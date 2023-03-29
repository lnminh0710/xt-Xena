import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  isDevMode,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import {
  CommonService,
  AppErrorHandler,
  ToolsService,
  ModalService,
  SignalRService,
} from 'app/services';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { FakeData } from './fake';
import {
  ComboBoxTypeConstant,
  SignalRActionEnum,
  SystemScheduleServiceName,
  SignalRJobEnum,
  MessageModal,
} from 'app/app.constants';
import {
  ApiResultResponse,
  SignalRNotifyModel,
  MessageModel,
} from 'app/models';
import { Uti } from 'app/utilities';
import { Subscription } from 'rxjs';

@Component({
  selector: 'matching-data',
  styleUrls: ['./matching-data.component.scss'],
  templateUrl: './matching-data.component.html',
})
export class MatchingDataComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private fake: any = new FakeData();
  private procesingList: Array<any> = [];

  public dataSource: any = {
    data: [],
    columns: this.fake.createGridColumns(),
  };
  public status: string = 'Ready';
  public matchingStatus: boolean = false;
  @Input() gridId: string;
  @Input() rowBackground: any;
  @Input() rowBackgroundGlobal: any;
  @Input() borderRow: any;
  @Input() backgroundImage: any;
  @Input() background: any;
  @Input() gridStyle: any;

  @ViewChild('matchingGrid') matchingGrid: XnAgGridComponent;

  private messageMatchingDataSubscription: Subscription;

  constructor(
    private _commonService: CommonService,
    private _toolsService: ToolsService,
    private _modalService: ModalService,
    private _signalRService: SignalRService,
    private _toasterService: ToasterService,
    private _appErrorHandler: AppErrorHandler,
    private _ref: ChangeDetectorRef,
    router?: Router
  ) {
    super(router);
  }

  public ngOnInit() {
    this.getCountriesData();
    this.listenSignalRMessage();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public startStop() {
    if (!this.matchingStatus) {
      this.start();
    } else {
      this._modalService.confirmMessageHtmlContent(
        new MessageModel({
          headerText: 'Stop matching',
          messageType: MessageModal.MessageType.error,
          message: [
            { key: '<p>' },
            {
              key: 'Modal_Message__Do_You_Want_Stop_Matching_Data',
            },
            { key: '</p>' },
          ],
          buttonType1: MessageModal.ButtonType.danger,
          callBack1: () => {
            this.stop();
          },
        })
      );
    }
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/

  private getData() {
    this.sendMessage(SignalRActionEnum.MatchingData_GetProcessingList);
  }

  private listenSignalRMessage() {
    if (this.messageMatchingDataSubscription)
      this.messageMatchingDataSubscription.unsubscribe();

    this.messageMatchingDataSubscription =
      this._signalRService.messageMatchingData.subscribe(
        (message: SignalRNotifyModel) => {
          this._appErrorHandler.executeAction(() => {
            if (message.Job == SignalRJobEnum.Disconnected) {
              // BackgroundJob is stopped
              // Notify an error message to user
              return;
            }

            console.log(message);

            switch (message.Action) {
              case SignalRActionEnum.MatchingData_ServiceAlive:
                this.createQueueAndStart();
                break;
              case SignalRActionEnum.MatchingData_GetProcessingList:
                this.getProcessingList(message);
                break;
              case SignalRActionEnum.MatchingData_StartSuccessfully:
                this.startSuccessfully(message);
                break;
              case SignalRActionEnum.MatchingData_Processsing:
                this.processsing(message);
                break;
              case SignalRActionEnum.MatchingData_Fail:
                this.processingFail(message);
                break;
              case SignalRActionEnum.MatchingData_Success:
                this.processingSuccess(message);
                break;
              case SignalRActionEnum.MatchingData_Finish:
                this.processingFinish(message);
                break;
              case SignalRActionEnum.MatchingData_StopSuccessfully:
                this.stopSuccessfully();
                break;
              default:
                break;
            }
          });
        }
      );
  }

  private getProcessingList(message: SignalRNotifyModel) {
    this.procesingList = message.Data;
    if (
      !this.dataSource.data ||
      !this.dataSource.data.length ||
      !this.procesingList ||
      !this.procesingList.length
    )
      return;
    for (let item of this.procesingList) {
      this.updateStatusForGrid(item);
    }
    this.setMatchingStatus(!!this.procesingList.length);
    this.changeDetector();
  }

  private processsing(message: SignalRNotifyModel) {
    if (!this.dataSource.data || !this.dataSource.data.length) return;
    const data = message.Data && message.Data.length ? message.Data[0] : null;
    if (!data) return;
    this.updateStatusForGrid(data);
    this.changeDetector();
  }

  private processingFail(message: SignalRNotifyModel) {
    this.processsing(message);
  }

  private processingSuccess(message: SignalRNotifyModel) {
    this.processsing(message);
  }

  private processingFinish(message: SignalRNotifyModel) {
    this.setMatchingStatus(false);
    this._toasterService.pop(
      'success',
      'Success',
      'Data processing is finished'
    );
    this.changeDetector();
  }

  private updateStatusForGrid(data: any) {
    let row = this.dataSource.data.find((x) => x.id == data.CountryCode);
    if (!row || !row.id) return;

    switch (data.Status) {
      // Idle
      case 0: {
        row.status = 'fa-clock-o';
        break;
      }
      // Fail
      case -1:
      case 3: {
        row.status = 'fa-times  red-color';
        break;
      }
      // Processing
      case 1: {
        row.status = 'fa-spinner  fa-spin  orange-color';
        break;
      }
      // Successfully
      case 2: {
        row.status = 'fa-check  green-color';
        break;
      }
    }
    row.selected = true;
    row.duration = Uti.secondsToString(data.Duration);
    this.matchingGrid.updateRowData([row]);
  }

  private getCountriesData() {
    this._toolsService.getMatchingCountry().subscribe((response: any) => {
      this._appErrorHandler.executeAction(() => {
        if (!Uti.isResquestSuccess(response)) return;
        this.dataSource = {
          data: this.mapRawToRealData(response.item.data[0]),
          columns: this.dataSource.columns,
        };
        setTimeout(() => {
          this.getData();
        }, 500);
      });
    });
  }

  // #region [Start Stop]
  private isCallStart: boolean = false;
  private startTimeout: any;
  private start() {
    if (this.isCallStart) {
      this._toasterService.pop(
        'warning',
        'SignalR',
        'Bus connection is connecting...'
      );
      return;
    }

    const countriesSelected = this.dataSource.data.filter((x) => x.selected);
    if (!countriesSelected || !countriesSelected.length) {
      this._modalService.warningText('Modal_Message__Select_Country_Process');
      return;
    }

    this.isCallStart = true;
    this.sendMessage(SignalRActionEnum.MatchingData_Ping);

    clearTimeout(this.startTimeout);
    this.startTimeout = null;
    this.startTimeout = setTimeout(() => {
      if (this.isCallStart) {
        this.isCallStart = false;
        this._toasterService.pop(
          'error',
          'SignalR Error',
          'Bus connection failed, please try again.'
        );
      }
    }, 5000);
  }

  private createQueueAndStart() {
    if (!this.isCallStart) return;

    this.isCallStart = false;
    const countriesSelected = this.dataSource.data.filter((x) => x.selected);
    this._commonService
      .createQueue(this.buildDataForSave(countriesSelected))
      .subscribe((response: any) => {
        this._appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) return;
          this.sendMessage(SignalRActionEnum.MatchingData_Start);
        });
      });
  }

  private startSuccessfully(message: SignalRNotifyModel) {
    this.procesingList = message.Data;
    for (let row of this.dataSource.data) {
      row.status = !row.selected ? '' : 'fa-clock-o';
      row.duration = '';
      this.matchingGrid.updateRowData([row]);
    }
    this.setMatchingStatus(true);
    this._toasterService.pop(
      'success',
      'Success',
      'Data processing is started'
    );
    this.changeDetector();
  }

  private setMatchingStatus(matchingStatus: boolean) {
    this.status = matchingStatus ? 'Processing...' : 'Ready';
    this.matchingStatus = matchingStatus;
  }

  private stop() {
    this._commonService
      .deleteQueues(this.buildDataForDelete())
      .subscribe((response: any) => {
        this._appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) return;
          this.sendMessage(SignalRActionEnum.MatchingData_Stop);
        });
      });
  }

  private stopSuccessfully() {
    for (let item of this.procesingList) {
      let row = this.dataSource.data.find((x) => x.id == item.CountryCode);
      if (!row || !row.id) continue;
      row.status = 'fa-clock-o';
      this.matchingGrid.updateRowData([row]);
    }
    this.setMatchingStatus(false);
    this._toasterService.pop(
      'warning',
      'Notification',
      'Data processing is stopped'
    );
    this.changeDetector();
  }
  // #endregion [Start Stop]

  private mapRawToRealData(rawData: Array<any>): Array<any> {
    return rawData.map((x) => {
      return {
        id: x.IdRepIsoCountryCode,
        text: x.DefaultValue,
        isoCode: x.IsoCode,
        selected: false,
        country: x.IsoCode + ',' + x.DefaultValue,
        status: '',
        duration: null,
      };
    });
  }

  private buildDataForSave(countriesSelected) {
    let queueData: Array<any> = [];
    for (let item of countriesSelected) {
      queueData.push({
        IdRepAppSystemScheduleServiceName:
          SystemScheduleServiceName.DoubletService,
        JsonLog: JSON.stringify({
          IdRepIsoCountryCode: item.id,
          DefaultValue: item.text,
          IsoCode: item.isoCode,
        }),
      });
    }
    return {
      IdRepAppSystemScheduleServiceName:
        SystemScheduleServiceName.DoubletService,
      JsonText: JSON.stringify({ SystemScheduleQueue: queueData }),
    };
  }

  private buildDataForDelete() {
    if (!this.procesingList || !this.procesingList.length) return '';
    let result = '';
    for (let item of this.procesingList) {
      result += item.IdAppSystemScheduleQueue + ',';
    }
    result = result.substring(0, result.length - 1);
    return { QueuesId: result };
  }

  private sendMessage(action: SignalRActionEnum) {
    let model = this._signalRService.createMessageMatchingData();
    model.Action = action;
    this._signalRService.sendMessage(model);
  }

  private changeDetectorTimeout: any;
  private changeDetector() {
    clearTimeout(this.changeDetectorTimeout);
    this.changeDetectorTimeout = null;
    this.changeDetectorTimeout = setTimeout(() => {
      this._ref.detectChanges();
    }, 300);
  }
}
