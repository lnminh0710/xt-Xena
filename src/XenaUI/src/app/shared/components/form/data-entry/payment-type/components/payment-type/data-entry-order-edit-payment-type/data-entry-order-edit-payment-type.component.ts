import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import {
  DataEntryService,
  AppErrorHandler,
  PropertyPanelService,
  ModalService,
  DataEntryProcess,
} from 'app/services';
import {
  MessageModal,
  OrderDataEntryWidgetLayoutModeEnum,
} from 'app/app.constants';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/Observable/forkJoin';
import { Subscription } from 'rxjs/Subscription';
import { Uti } from 'app/utilities';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import isEqual from 'lodash-es/isEqual';
import { DataEntryActions } from 'app/state-management/store/actions';
import {
  Currency,
  PaymentType,
  FormOutputModel,
  MessageModalModel,
  MessageModalHeaderModel,
  MessageModalBodyModel,
  MessageModalFooterModel,
  ButtonList,
  FormModel,
  LightWidgetDetail,
  WidgetDetail,
} from 'app/models';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import * as widgetContentReducer from 'app/state-management/store/reducer/widget-content-detail';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { ModuleList, BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DataEntryPaymentTypeComponent } from 'app/shared/components/form';
import {
  WidgetModuleComponent,
  WidgetUtils,
} from 'app/shared/components/widget';

@Component({
  selector: 'data-entry-order-edit-payment-type',
  styleUrls: ['./data-entry-order-edit-payment-type.component.scss'],
  templateUrl: './data-entry-order-edit-payment-type.component.html',
})
export class DataEntryEditPaymentTypeComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public translatedSource: Array<any>;
  public orderDataEntryWidgetLayoutMode =
    OrderDataEntryWidgetLayoutModeEnum.Inline;
  public mainCurrency: Currency;
  public mainPaymenTypeList: Array<PaymentType>;
  public clearPayment = false;
  public hiddenPayment = true;

  private isValid = false;
  private _widgetData: WidgetDetail;

  // private rowsDataState: Observable<any[]>;
  // private rowsDataStateSubscription: Subscription;
  private rowDataState: Observable<RowData>;
  private rowDataStateSubscription: Subscription;
  private selectedEntityState: Observable<any>;
  private selectedEntityStateSubscription: Subscription;
  private paymentTypeDataStateSubscription: Subscription;
  private paymentTypeDataState: Observable<any>;
  private globalPropertiesStateSubscription: Subscription;
  private globalPropertiesState: Observable<any>;

  public globalProperties: any;
  private paymentTypeData: any;
  private globalDateFormat: string = null;

  public isDataProcessing: boolean;
  public lostAmountStatus: boolean;

  @Output() outputData: EventEmitter<any> = new EventEmitter();

  @Input() tabID: string = 'BackofficeOrders';

  private widgetParentDetailId: string;
  @Input() set widgetData(data: WidgetDetail) {
    this._widgetData = data;
    if (this.widgetParentDetailId) return;

    if (
      data &&
      data.widgetDataType &&
      data.widgetDataType.parentWidgetIds &&
      data.widgetDataType.parentWidgetIds.length
    )
      this.widgetParentDetailId = data.widgetDataType.parentWidgetIds[0];
  }

  private idSalesOrder;

  @ViewChild('currentComponent')
  dataEntryPaymentTypeComponent: DataEntryPaymentTypeComponent;
  @Input() parentInstance: WidgetModuleComponent;

  constructor(
    private elementRef: ElementRef,
    private dataEntryService: DataEntryService,
    private store: Store<AppState>,
    private dataEntryActions: DataEntryActions,
    private appErrorHandler: AppErrorHandler,
    private propertyPanelService: PropertyPanelService,
    private modalService: ModalService,
    private _changeDetectorRef: ChangeDetectorRef,
    protected router: Router,
    private dataEntryProcess: DataEntryProcess,
    protected widgetUtils: WidgetUtils,
    private toasterService: ToasterService
  ) {
    super(router);

    this.paymentTypeDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).paymentTypeData
    );
    this.globalPropertiesState = store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).globalProperties
    );
    // this.rowsDataState = this.store.select(state => widgetContentReducer.getWidgetContentDetailState(state, this.ofModule.moduleNameTrim).rowsData);
    this.rowDataState = this.store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.ofModule.moduleNameTrim
        ).rowData
    );
    this.selectedEntityState = this.store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedEntity
    );
  }

  public ngOnInit() {
    this.subcribe();
    //this.getData("0384gk129-00004-0", "GK129-00", "475186");
  }

  public ngOnDestroy() {
    this.store.dispatch(this.dataEntryActions.editOrder(null, this.tabID));
    Uti.unsubscribe(this);
  }

  public outputDataHandler(eventData: FormModel) {
    // console.log(eventData);
    if (eventData.isDirty) {
      this.isValid = eventData.isValid;
      this.toggleSaveButtonMode(true, this.isValid);
    }
    // this.onEditingWidget.emit(this.data);
  }

  private subcribe() {
    this.globalPropertiesStateSubscription =
      this.globalPropertiesState.subscribe((globalProperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalProperties.length) {
            this.globalProperties = globalProperties;
            this.globalDateFormat =
              this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                globalProperties
              );
          }
        });
      });

    this.paymentTypeDataStateSubscription = this.paymentTypeDataState.subscribe(
      (paymentTypeDataState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            paymentTypeDataState &&
            !isEqual(this.paymentTypeData, paymentTypeDataState)
          ) {
            this.paymentTypeData = paymentTypeDataState;
            //this.checkValidStatusForSaving();
          }
        });
      }
    );

    this.subscribeParkedItem();
    this.subscribeRowData();
    // this.rowsDataStateSubscription = this.rowsDataState.subscribe((data: any[]) => {
    //     this.appErrorHandler.executeAction(() => {
    //         this.idSalesOrder = '';
    //         if (!data || !this.widgetParentDetailId) return;
    //         //console.log('rowsData', data);
    //         let idSalesOrder;
    //         let mediacode;
    //         let campaignNr;
    //         data.forEach(item => {
    //             if (item.widgetDetail && item.widgetDetail.id == this.widgetParentDetailId && item.rowData && item.rowData.length) {
    //                 for (let i = 0, length = item.rowData.length; i < length; i++) {
    //                     const rowDataItem = item.rowData[i];
    //                     switch (rowDataItem.key) {
    //                         case 'IdSalesOrder':
    //                             idSalesOrder = rowDataItem.value;
    //                             break;
    //                         case 'MEDIACODE':
    //                             mediacode = rowDataItem.value;
    //                             break;
    //                         case 'CampaignNr':
    //                             campaignNr = rowDataItem.value;
    //                             break;
    //                     }
    //                     if (idSalesOrder && mediacode && campaignNr)
    //                         break;
    //                 }//for
    //             }
    //         });//for
    //         if (data[0] && data[0].rowData) {
    //             let isPaid = Uti.getItemFromArrayByProperty(data[0].rowData, 'key', 'IsPaid');
    //             let isActive = Uti.getItemFromArrayByProperty(data[0].rowData, 'key', 'IsActive');
    //             this.clearPayment = (isPaid && isPaid.value) || (isActive && !isActive.value);
    //         }
    //         if (!this.clearPayment) {
    //             this.toggleSaveButtonMode(false, false);
    //         }
    //         if (idSalesOrder && mediacode && campaignNr) {
    //             this.idSalesOrder = idSalesOrder;
    //             this.getData(mediacode, campaignNr, idSalesOrder);
    //         }
    //     });
    // });
  }

  private subscribeParkedItem() {
    this.selectedEntityStateSubscription = this.selectedEntityState.subscribe(
      (data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !data ||
            !data['idSalesOrder'] ||
            !this._widgetData ||
            !this._widgetData.widgetDataType ||
            !this._widgetData.widgetDataType.listenKey ||
            !this._widgetData.widgetDataType.listenKey.main ||
            this._widgetData.widgetDataType.listenKey.main.key !=
              this._widgetData.widgetDataType.listenKey.key
          )
            return;
          this.idSalesOrder = '';
          data['isActive'] = true;
          this.loadDataWhenListenKeyChanged(data);
        });
      }
    );
  }

  private subscribeRowData() {
    this.rowDataStateSubscription = this.rowDataState.subscribe(
      (data: RowData) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !this._widgetData ||
            !this._widgetData.widgetDataType ||
            !data ||
            !data.widgetDetail ||
            !data.widgetDetail.widgetDataType ||
            !this.widgetUtils.isValidWidgetToConnect(
              this._widgetData,
              <any>data.widgetDetail
            ).connected
          )
            return;
          this.idSalesOrder = '';
          let _data: any = {
            idSalesOrder: Uti.getValueFromArrayByKey(data.data, 'IdSalesOrder'),
            mediacode: Uti.getValueFromArrayByKey(data.data, 'MEDIACODE'),
            campaign: Uti.getValueFromArrayByKey(data.data, 'CampaignNr'),
            isPaid: Uti.getValueFromArrayByKey(data.data, 'IsPaid'),
            isActive: Uti.getValueFromArrayByKey(data.data, 'IsActive'),
          };
          this.loadDataWhenListenKeyChanged(_data);
        });
      }
    );
  }

  private loadDataWhenListenKeyChanged(data) {
    this.clearPayment = data['isPaid'] || !data['isActive'];
    if (!this.clearPayment) {
      this.toggleSaveButtonMode(false, false);
    }
    if (!data['idSalesOrder'] || !data['mediacode'] || !data['campaign'])
      return;
    this.idSalesOrder = data['idSalesOrder'];
    this.getData(data['mediacode'], data['campaign'], data['idSalesOrder']);
  }

  private isShowWarningDialogPaymentTotalAmount() {
    //if (this.tabID != OrderDataEntryTabEnum.Manual && this.tabID != OrderDataEntryTabEnum.Scanning) return false;
    //if (!this.orderTotalSummaryData || !this.orderTotalSummaryData.subTotalAmount ||
    //    !this.paymentTypeData || !this.paymentTypeData.mappedData || !this.paymentTypeData.mappedData.length) return false;

    //const subTotalAmount = Number(this.orderTotalSummaryData.subTotalAmount);
    //if (subTotalAmount >= 0) return false;

    return true;
  }

  private showWarningDialogPaymentTotalAmount() {
    //Only show warning when subTotal is negative
    this.modalService.showMessageModal(
      new MessageModalModel({
        customClass: 'dialog-confirm-total',
        //callBackFunc: null,
        messageType: MessageModal.MessageType.warning,
        modalSize: MessageModal.ModalSize.middle,
        showCloseButton: true,
        header: new MessageModalHeaderModel({
          text: 'Save Order',
        }),
        body: new MessageModalBodyModel({
          isHtmlContent: true,
          content: [
            { key: '<p>' },
            {
              key: 'Modal_Message__The_Payment_Not_Enough_Order_Save_Order',
            },
            { key: '</p>' },
          ],
        }),
        footer: new MessageModalFooterModel({
          isFocus: true,
          buttonList: [
            new ButtonList({
              buttonType: MessageModal.ButtonType.primary,
              text: 'Accept',
              //disabled: false,
              customClass: '',
              callBackFunc: () => {
                this.modalService.hideModal();
                if (this.paymentTypeData)
                  this.paymentTypeData.paymentConfirm = 1; //Accept

                //this.onSubmitSaveODE();
              },
            }),
            new ButtonList({
              buttonType: MessageModal.ButtonType.default,
              text: 'Pay in new Order',
              customClass: '',
              callBackFunc: () => {
                this.modalService.hideModal();
                if (this.paymentTypeData)
                  this.paymentTypeData.paymentConfirm = 2; //Pay in new Order

                //this.onSubmitSaveODE();
              },
            }),
            new ButtonList({
              buttonType: MessageModal.ButtonType.default,
              text: 'Cancel',
              customClass: '',
              callBackFunc: () => {
                this.modalService.hideModal();
              },
              focus: true,
            }),
          ],
        }),
      })
    );
  }

  private getData(mediacode: string, campaignNr: string, idSalesOrder: string) {
    this.dataEntryProcess.isProcessingLoadEditOrder = true;
    this.isDataProcessing = true;
    this.hiddenPayment = true;
    forkJoin(
      this.dataEntryService.getMainCurrencyAndPaymentTypeForOrder(
        mediacode,
        campaignNr,
        true
      ),
      this.dataEntryService.getSalesOrderById(idSalesOrder)
    )
      .finally(() => {
        this.dataEntryProcess.loadOrderFinished(() => {
          setTimeout(() => {
            this.isDataProcessing = false;
          }, 500);
        });
      })
      .subscribe(([response1, response2]) => {
        this.getDataSuccess(response1, response2);
      });
  }

  private getDataSuccess(response1, response2) {
    this.appErrorHandler.executeAction(() => {
      if (response1) {
        this.mediacodeResponse(response1);
      }
      this.orderResponse(response2);
      this.clearPayment = this.isClearPayment(response2);
      if (!this.clearPayment) {
        this.orderResponse(response2);
        this.showPaymentType();
      } else {
        setTimeout(() => {
          this.dataEntryPaymentTypeComponent.resetData(false, true);
          this.showPaymentType();
        }, 700);
      }
    });
  }

  private showPaymentType() {
    setTimeout(() => {
      this.hiddenPayment = false;
    });
  }

  private isClearPayment(response: any) {
    if (!response || !response.data) return true;
    return this.getIsPaid(response);
  }

  private getIsPaid(response: any): boolean {
    try {
      return !!response.data[0][0]['IsPaid'];
    } catch (e) {
      return false;
    }
  }

  private mediacodeResponse(response: any) {
    if (!response) return;

    //console.log('mediacodeResponse', response);
    let isValidCampaignNr: boolean;
    let isValidPaymentType: boolean;
    const currencyIndex = 0;
    const paymentTypeIndex = 1;

    // For CampaignNr
    if (response.data && response.data.length) {
      if (
        response.data[currencyIndex] &&
        response.data[currencyIndex].length &&
        response.data[currencyIndex][0].CampaignNr
      ) {
        isValidCampaignNr = true;
      }
      // For Payment Type
      if (
        response.data[paymentTypeIndex] &&
        response.data[paymentTypeIndex].length
      )
        isValidPaymentType = true;
    }

    // Found CampaignNr
    if (isValidCampaignNr) {
      const campaign = response.data[currencyIndex][0];
      this.mainCurrency = new Currency({
        idRepCurrencyCode: campaign.IdRepCurrencyCode,
        currencyCode: campaign.CurrencyCode,
      });

      if (isValidPaymentType) {
        const array = response.data[paymentTypeIndex] as Array<any>;
        this.mainPaymenTypeList = array.map((p) => {
          return new PaymentType({
            idRepInvoicePaymentType: p.IdRepInvoicePaymentType,
            paymentType: p.PaymentType,
            postageCosts: p.PostageCosts,
            paymentGroup: Number(p.PaymentGroup),
          });
        });
      } else {
        this.toasterService.pop(
          'error',
          'Edit Payment Type',
          'Paymen Type Not Found'
        );
        this.mainPaymenTypeList = [];
      }
      this.store.dispatch(
        this.dataEntryActions.dataEntrySetMainCurrencyAndPaymentTypeList(
          this.mainCurrency,
          this.mainPaymenTypeList,
          this.tabID
        )
      );
    }
    // Not Found Campagin Nr
    else {
      this.toasterService.pop(
        'error',
        'Edit Payment Type',
        'Campagin Number Not Found'
      );
    }
  }

  private orderResponse(response: any) {
    if (!response) return;
    //console.log('orderResponse', response);
    if (response.data && response.data.length > 2) {
      const editOrderData = this.dataEntryProcess.buildEditOrderModel(
        response.data,
        this.mainCurrency,
        this.mainPaymenTypeList
      );
      this.store.dispatch(
        this.dataEntryActions.editOrder(editOrderData, this.tabID)
      );
    }
  }

  public onlostAmountChange() {
    this.toggleSaveButtonMode(true, this.isValid);
  }

  private toggleSaveButtonMode(isToggle: boolean, isEnable?: boolean) {
    if (
      this.parentInstance.widgetMenuStatusComponent &&
      this.parentInstance.widgetMenuStatusComponent.settings
    ) {
      this.parentInstance.controlMenuStatusToolButtons(isToggle);
      this.parentInstance.widgetMenuStatusComponent.settings.btnSavePaymentTypeForm.enable =
        isEnable;
    }
  }

  private getDataForSaving() {
    let formModel: FormModel = this.dataEntryPaymentTypeComponent.updateData();
    return {
      IdSalesOrder: this.idSalesOrder,
      IsLostAmount: this.lostAmountStatus == true ? '1' : '0',
      OrderPayments: formModel.mappedData,
    };
  }

  public submit(callback?) {
    const data = this.getDataForSaving();
    this.dataEntryService.savePaymentForOrder(data).subscribe(
      (response: any) => {
        this.appErrorHandler.executeAction(() => {
          if (response && response.returnID) {
            this.toggleSaveButtonMode(false, false);
            if (callback) {
              callback({ isReloadWidget: true });
            }
          } else {
            this.toasterService.pop('error', 'Failed', 'Data is not saved');
          }
        });
      },
      (err) => {
        this.toasterService.pop('error', 'Failed', 'Data is not saved');
      }
    );
  }
}

interface RowData {
  data?: any;
  widgetDetail?: LightWidgetDetail;
}
