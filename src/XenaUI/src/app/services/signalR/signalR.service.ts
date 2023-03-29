import {
  Injectable,
  Injector,
  EventEmitter,
  Inject,
  forwardRef,
} from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { MessagePackHubProtocol } from '@aspnet/signalr-protocol-msgpack';
import remove from 'lodash-es/remove';
import { BaseService } from '../base.service';
import { Uti } from 'app/utilities/uti';
import { SignalRNotifyModel, User } from 'app/models';
import {
  Configuration,
  SignalRActionEnum,
  SignalRJobEnum,
  SignalRTypenEnum,
} from 'app/app.constants';

@Injectable()
export class SignalRService extends BaseService {
  public messageReceived = new EventEmitter<Array<SignalRNotifyModel>>(); //Array message
  public messageWidgetSavedSuccessReceived =
    new EventEmitter<SignalRNotifyModel>(); //One message
  public messageReIndexElasticSearch = new EventEmitter<SignalRNotifyModel>();
  public messageMatchingData = new EventEmitter<SignalRNotifyModel>();
  public messageImportDataMatrix = new EventEmitter<SignalRNotifyModel>();
  public messageImportInvoicePayment = new EventEmitter<SignalRNotifyModel>();
  public messageRCWord2Pdf = new EventEmitter<SignalRNotifyModel>();
  public messageDesignLayout = new EventEmitter<SignalRNotifyModel>();
  public sessionId: string;
  public designLayoutIsWorking = false;
  public designLayoutModulesSaved: any = {};

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection | undefined;
  private url: string =
    Configuration.PublicSettings.signalRApiUrl +
    '?env=web&groupName=' +
    location.host;
  private data: Array<SignalRNotifyModel> = [];
  private userLogin: User;
  private maximumRetryConnecting = 10000; //retry 10000 times
  private numofRetryConnecting = 0;
  private isStartingConnection = false;

  constructor(injector: Injector, protected uti: Uti) {
    super(injector);

    this.userLogin = this.uti.getUserInfo();
    this.userLogin.color = this.getRandomColor();
    this.url += '&userName=' + this.userLogin.loginName;

    const randNum = Math.round(Math.random() * 10000);
    this.sessionId = new Date().getTime() + randNum + '';
  }

  //#region Init SignalR
  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl(this.url)
      .configureLogging(LogLevel.Information)
      .withHubProtocol(new MessagePackHubProtocol())
      .build();

    /*
        - Timeout for server activity. If the server hasn't sent a message in this interval, the client considers the server disconnected and triggers the onclose event.
        - This value must be large enough for a ping message to be sent from the server and received by the client within the timeout interval.
        - The recommended value is a number at least double the server's KeepAliveInterval value to allow time for pings to arrive.
        - Default is 30 seconds
        */
    this._hubConnection.serverTimeoutInMilliseconds = 120 * 60 * 1000; // 120 minutes

    // re-establish the connection if connection dropped
    this._hubConnection.onclose(() => {
      console.log('_hubConnection onclose', new Date());
      this.startConnection();
    });
  }

  private startConnection(): void {
    if (!this._hubConnection) {
      console.log('_hubConnection is null');
      return;
    }

    ////Connected
    ////connecting: 0, connected: 1, reconnecting: 2, disconnected: 4
    //if (this._hubConnection['connection']['connectionState'] === 1) {
    //    console.log('_hubConnection is connected', new Date());
    //    return;
    //}

    if (this.numofRetryConnecting > this.maximumRetryConnecting) {
      this.connectionIsEstablished = false;
      this.isStartingConnection = false;
      return;
    }

    if (this.isStartingConnection) return;

    this.isStartingConnection = true;
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        this.isStartingConnection = false;
        this.numofRetryConnecting = 0;
        console.log('Hub connection started', new Date());
      })
      .catch((err) => {
        console.log(
          'Error while establishing connection, retrying...',
          new Date(),
          err
        );
        this.connectionIsEstablished = false;
        this.isStartingConnection = false;
        this.numofRetryConnecting++;
        setTimeout(() => {
          this.startConnection();
        }, 10000);
      });
  }

  private registerOnServerEvents(): void {
    const listenerNames: string[] = [
      'ReceiveMessage',
      'ReceiveMessageES',
      'ReceiveMessageMatchingData',
      'ReceiveMessageImportDataMatrix',
      'ReceiveMessageImportInvoicePayment',
      'ReceiveMessageRCWord2Pdf',
    ];

    listenerNames.forEach((listenerName) => {
      this._hubConnection.on(listenerName, (data: SignalRNotifyModel) => {
        this.processReceiveMessage(data);
      });
    });
  }

  public initHub() {
    if (!Configuration.PublicSettings.enableSignalR) return;

    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }
  //#endregion

  //#region Helpers

  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  //#endregion

  //#region Invoke: SendMessage
  public sendMessage(message: SignalRNotifyModel): void {
    if (
      !Configuration.PublicSettings.enableSignalR ||
      this.isStartingConnection
    )
      return;

    if (!this.connectionIsEstablished) {
      this.numofRetryConnecting = 0;
      if (this._hubConnection) {
        this.startConnection();
        console.error('Can not connect to SignalR server');
      }
      return;
    }

    let sendMessageType = '';

    //Process for WidgetForm-Editing before sending message to Server
    if (
      message.Type === SignalRTypenEnum.WidgetForm &&
      message.Job === SignalRJobEnum.Editing
    ) {
      this.sendMessageWidgetFormEditing(message);
    } else {
      sendMessageType = this.getMessageType(message);
    }
    this._hubConnection
      .invoke('SendMessage' + sendMessageType, message)
      .catch(this.errorHandler.bind(this));
  }

  private getMessageType(message: SignalRNotifyModel): string {
    let sendMessageType = '';

    if (
      message.Type === SignalRTypenEnum.ES &&
      message.Job === SignalRJobEnum.ES_ReIndex
    ) {
      sendMessageType = SignalRTypenEnum.ES;
    } else if (
      message.Type === SignalRTypenEnum.MatchingData &&
      message.Job === SignalRJobEnum.MatchingData
    ) {
      sendMessageType = SignalRTypenEnum.MatchingData;
    } else if (
      message.Type === SignalRTypenEnum.ImportDataMatrix &&
      message.Job === SignalRJobEnum.ImportDataMatrix
    ) {
      sendMessageType = SignalRTypenEnum.ImportDataMatrix;
    } else if (
      message.Type === SignalRTypenEnum.ImportInvoicePayment &&
      message.Job === SignalRJobEnum.ImportInvoicePayment
    ) {
      sendMessageType = SignalRTypenEnum.ImportInvoicePayment;
    } else if (
      message.Type === SignalRTypenEnum.RCWord2Pdf &&
      message.Job === SignalRJobEnum.RCWord2Pdf
    ) {
      sendMessageType = SignalRTypenEnum.RCWord2Pdf;
    }

    return sendMessageType;
  }

  private errorHandler(err: Error): void {
    if (!err.message) return;

    console.log(err);
    /*
        console.log(err.message);
        //reconnect
        if (!this.isStartingConnection && err.message.indexOf('Cannot send data if the connection is not in the \'Connected\' State') !== -1) {
            console.log(' -> reconnect connection SignalR');
            this.numofRetryConnecting = 0;
            this.connectionIsEstablished = false;
            this.startConnection();
        }
        */
  }
  //#endregion

  //#region process: ReceiveMessage
  private processReceiveMessage(message: SignalRNotifyModel) {
    if (
      (message.Type === SignalRTypenEnum.ES &&
        message.Job === SignalRJobEnum.ES_ReIndex) ||
      (message.Job === SignalRJobEnum.Disconnected &&
        message.UserName === SignalRTypenEnum.ES)
    ) {
      this.receiveMessageEsReIndex(message);
      return;
    }

    if (
      (message.Type === SignalRTypenEnum.MatchingData &&
        message.Job === SignalRJobEnum.MatchingData) ||
      (message.Job === SignalRJobEnum.Disconnected &&
        message.UserName === SignalRTypenEnum.MatchingData)
    ) {
      this.receiveMessageMatchingData(message);
      return;
    }

    if (
      (message.Type === SignalRTypenEnum.ImportDataMatrix &&
        message.Job === SignalRJobEnum.ImportDataMatrix) ||
      (message.Job === SignalRJobEnum.Disconnected &&
        message.UserName === SignalRTypenEnum.ImportDataMatrix)
    ) {
      this.receiveMessageImportDataMatrix(message);
      return;
    }

    if (
      (message.Type === SignalRTypenEnum.ImportInvoicePayment &&
        message.Job === SignalRJobEnum.ImportInvoicePayment) ||
      (message.Job === SignalRJobEnum.Disconnected &&
        message.UserName === SignalRTypenEnum.ImportInvoicePayment)
    ) {
      this.receiveMessageImportInvoicePayment(message);
      return;
    }

    if (
      (message.Type === SignalRTypenEnum.RCWord2Pdf &&
        message.Job === SignalRJobEnum.RCWord2Pdf) ||
      (message.Job === SignalRJobEnum.Disconnected &&
        message.UserName === SignalRTypenEnum.RCWord2Pdf)
    ) {
      this.receiveMessageRCWord2Pdf(message);
      return;
    }

    //F5, Close Browser, or User Disconnected with SignalR server
    if (message.Job === SignalRJobEnum.Disconnected && message.UserName) {
      //Remove all data of Disconnected User
      remove(this.data, {
        UserName: message.UserName,
      });
    }

    if (
      message.Type === SignalRTypenEnum.WidgetForm &&
      message.Job === SignalRJobEnum.Editing
    ) {
      this.receiveMessageWidgetFormEditing(message);
      return;
    }

    if (
      message.Type === SignalRTypenEnum.DesignLayout &&
      message.Job === SignalRJobEnum.DesignLayout
    ) {
      this.receiveMessageDesignLayout(message);
      return;
    }

    if (message.Job === SignalRJobEnum.Disconnected) {
      this.receiveMessageWidgetFormEditing(message);
      this.receiveMessageDesignLayout(message);
    }
  }
  //#endregion

  //#region Private methods
  private createSingalRNotifyModel(
    signalRTypenEnum: SignalRTypenEnum,
    signalRJobEnum: SignalRJobEnum
  ) {
    return new SignalRNotifyModel({
      Type: signalRTypenEnum,
      Job: signalRJobEnum,
      Color: this.userLogin.color,
      UserName: this.userLogin.loginName,
      DisplayName: this.userLogin.fullName
        ? this.userLogin.fullName
        : this.userLogin.lastname + ' ' + this.userLogin.firstname,
      IpAddress: Configuration.PublicSettings.clientIpAddress, //ipAddress
      SessionId: this.sessionId,
    });
  }
  //#endregion
  //#region WidgetForm: Editing
  public createMessageWidgetFormEditing(): SignalRNotifyModel {
    return this.createSingalRNotifyModel(
      SignalRTypenEnum.WidgetForm,
      SignalRJobEnum.Editing
    );
  }

  private displayEditingUsersWidgetFormEditing(model: SignalRNotifyModel) {
    //display editing users
    const items = this.data.filter(
      (p) =>
        p.Type === model.Type &&
        p.Job === model.Job &&
        p.ObjectId === model.ObjectId &&
        p.Action === SignalRActionEnum.ConnectEditing &&
        p.UserName !== this.userLogin.loginName
    );
    this.messageReceived.emit(items);
  }

  private sendMessageWidgetFormEditing(message: SignalRNotifyModel) {
    //SavedSuccessfully only processing for case ReceiveMessage
    if (message.Action == SignalRActionEnum.SavedSuccessfully) return;

    const connectedItemByUserLogin = this.data.find(
      (p) =>
        p.Type === message.Type &&
        p.Job === message.Job &&
        p.ObjectId === message.ObjectId &&
        p.UserName === this.userLogin.loginName
    );

    switch (message.Action) {
      case SignalRActionEnum.IsThereAnyoneEditing:
        if (connectedItemByUserLogin) break;

        //Only adding when it does not exist
        this.data.push(message);
        break;
      case SignalRActionEnum.ConnectEditing:
      case SignalRActionEnum.StopEditing:
        {
          //If UserLogin does not connect -> do nothing
          if (!connectedItemByUserLogin) break;

          //Only processing when UserLogin connecting
          const updateItem = this.data.find(
            (p) =>
              p.Type === message.Type &&
              p.Job === message.Job &&
              p.ObjectId === message.ObjectId &&
              p.UserName === message.UserName
          );

          if (updateItem) {
            if (message.Action === SignalRActionEnum.StopEditing) {
              updateItem.Data = null;
              updateItem.Action = SignalRActionEnum.StopEditing;
            } else {
              updateItem.Action = SignalRActionEnum.ConnectEditing;
              updateItem.Data = message.Data;
            }
          } else {
            this.data.push(message);
          }
        }
        break;
      case SignalRActionEnum.DisconnectEditing:
        //If UserLogin does not connect -> do nothing
        if (!connectedItemByUserLogin) break;

        //remove editing user out of list
        remove(this.data, {
          Type: message.Type,
          Job: message.Job,
          ObjectId: message.ObjectId,
          UserName: message.UserName,
        });
        break;
      default:
        break;
    } //switch

    this.displayEditingUsersWidgetFormEditing(message);
  }

  private receiveMessageWidgetFormEditing(message: SignalRNotifyModel) {
    //If a message is fired by myself -> do nothing
    if (message.UserName === this.userLogin.loginName) return;

    if (message.Job == SignalRJobEnum.Disconnected) {
      //display editing users
      const items = this.data.filter(
        (p) =>
          p.Type == SignalRTypenEnum.WidgetForm &&
          p.Job == SignalRJobEnum.Editing &&
          p.Action == SignalRActionEnum.ConnectEditing &&
          p.UserName != this.userLogin.loginName
      );
      this.messageReceived.emit(items);

      return;
    }

    switch (message.Action) {
      case SignalRActionEnum.IsThereAnyoneEditing:
        {
          //I am 'user login' and I am editing this item
          const connectedItemByUserLogin = this.data.find(
            (p) =>
              p.Type == message.Type &&
              p.Job == message.Job &&
              p.ObjectId == message.ObjectId &&
              p.UserName == this.userLogin.loginName &&
              p.Action == SignalRActionEnum.ConnectEditing
          );

          if (connectedItemByUserLogin) {
            //If another user notifies me and I am also editing this item, I must notify they again.
            this._hubConnection
              .invoke('SendMessage', connectedItemByUserLogin)
              .catch(this.errorHandler.bind(this));
          }
        }
        break;
      case SignalRActionEnum.ConnectEditing:
      case SignalRActionEnum.StopEditing:
        this.sendMessageWidgetFormEditing(message);

        break;
      case SignalRActionEnum.DisconnectEditing:
        //remove editing user out of list
        remove(this.data, {
          Type: message.Type,
          Job: message.Job,
          ObjectId: message.ObjectId,
          UserName: message.UserName,
        });

        this.displayEditingUsersWidgetFormEditing(message);
        break;
      case SignalRActionEnum.SavedSuccessfully:
        {
          //If I'am editing on this item -> show dialog to do: Keep Data/ Reload Data,...
          const item = this.data.find(
            (p) =>
              p.Type === message.Type &&
              p.Job === message.Job &&
              p.ObjectId === message.ObjectId &&
              p.UserName === this.userLogin.loginName
          );

          if (item && item.UserName) {
            this.messageWidgetSavedSuccessReceived.emit(message);
          }
        }
        break;
      default:
        break;
    } //switch
  }
  //#endregion

  //#region Elastic Search: ReIndex
  public createMessageESReIndex(): SignalRNotifyModel {
    return this.createSingalRNotifyModel(
      SignalRTypenEnum.ES,
      SignalRJobEnum.ES_ReIndex
    );
  }

  private receiveMessageEsReIndex(message: SignalRNotifyModel) {
    //If a message is fired by myself -> do nothing
    if (message.UserName === this.userLogin.loginName) return;

    this.messageReIndexElasticSearch.emit(message);
  }
  //#endregion

  //#region Matching Data
  public createMessageMatchingData(): SignalRNotifyModel {
    return this.createSingalRNotifyModel(
      SignalRTypenEnum.MatchingData,
      SignalRJobEnum.MatchingData
    );
  }

  private receiveMessageMatchingData(message: SignalRNotifyModel) {
    //If a message is fired by myself -> do nothing
    if (message.UserName === this.userLogin.loginName) return;

    this.messageMatchingData.emit(message);
  }
  //#endregion

  //#region ImportDataMatrix
  public createMessageImportDataMatrix(): SignalRNotifyModel {
    return this.createSingalRNotifyModel(
      SignalRTypenEnum.ImportDataMatrix,
      SignalRJobEnum.ImportDataMatrix
    );
  }

  private receiveMessageImportDataMatrix(message: SignalRNotifyModel) {
    //If a message is fired by myself -> do nothing
    if (message.UserName === this.userLogin.loginName) return;

    this.messageImportDataMatrix.emit(message);
  }
  //#endregion

  //#region DesignLayout
  public createMessageDesignLayout(): SignalRNotifyModel {
    return this.createSingalRNotifyModel(
      SignalRTypenEnum.DesignLayout,
      SignalRJobEnum.DesignLayout
    );
  }

  private receiveMessageDesignLayout(message: SignalRNotifyModel) {
    //This function only work on the same user for purpose preventing 'Desgin Layout' at the same time.
    if (message.UserName !== this.userLogin.loginName) return;
    if (message.SessionId === this.sessionId) return;

    this.messageDesignLayout.emit(message);
  }

  public sendMessageDesignLayout(
    action: SignalRActionEnum,
    idSettingsGUI: any
  ) {
    const model = this.createMessageDesignLayout();
    model.Action = action;
    model.ObjectId = idSettingsGUI;
    this.sendMessage(model);
  }
  //#endregion

  //#region ImportInvoicePayment
  public createMessageImportInvoicePayment(): SignalRNotifyModel {
    return this.createSingalRNotifyModel(
      SignalRTypenEnum.ImportInvoicePayment,
      SignalRJobEnum.ImportInvoicePayment
    );
  }

  private receiveMessageImportInvoicePayment(message: SignalRNotifyModel) {
    //If a message is fired by myself -> do nothing
    if (message.UserName === this.userLogin.loginName) return;

    this.messageImportInvoicePayment.emit(message);
  }
  //#endregion

  //#region RCWord2Pdf
  public createMessageRCWord2Pdf(): SignalRNotifyModel {
    return this.createSingalRNotifyModel(
      SignalRTypenEnum.RCWord2Pdf,
      SignalRJobEnum.RCWord2Pdf
    );
  }

  private receiveMessageRCWord2Pdf(message: SignalRNotifyModel) {
    //If a message is fired by myself -> do nothing
    if (
      message.UserName === this.userLogin.loginName ||
      message.Action == SignalRActionEnum.RCWord2Pdf_ProcessForODE
    )
      return;

    this.messageRCWord2Pdf.emit(message);
  }
  //#endregion
}
