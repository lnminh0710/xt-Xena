import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  AppErrorHandler,
  CommonService,
  HotKeySettingService,
  ModalService,
  DataEntryProcess,
  DataEntryService,
} from 'app/services';
import {
  ComboBoxTypeConstant,
  MessageModal,
  PaymentTypeGroupEnum,
  OrderFailedDataEnum,
  PaymentTypeIdEnum,
} from 'app/app.constants';
import {
  DataEntryActions,
  CustomAction,
} from 'app/state-management/store/actions';
import {
  FormModel,
  Currency,
  ApiResultResponse,
  FormOutputModel,
  OrderDataEntryPaymentTypeModel,
  MessageModel,
} from 'app/models';
import { Uti } from 'app/utilities';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import cloneDeep from 'lodash-es/cloneDeep';
import reject from 'lodash-es/reject';
import max from 'lodash-es/max';
import orderBy from 'lodash-es/orderBy';
import groupBy from 'lodash-es/groupBy';
import { DataEntryPaymentTypeItemComponent } from '../data-entry-order-payment-type-item/data-entry-order-payment-type-item.component';
import { OrderDataEntryWidgetLayoutModeEnum } from 'app/app.constants';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import { Router } from '@angular/router';
import { DataEntryFormBase } from 'app/shared/components/form/data-entry/data-entry-form-base';
import { ModuleList } from 'app/pages/private/base';

@Component({
  selector: 'data-entry-order-payment-type',
  templateUrl: './data-entry-order-payment-type-master.component.html',
  styleUrls: ['./data-entry-order-payment-type-master.component.scss'],
})
export class DataEntryPaymentTypeComponent
  extends DataEntryFormBase
  implements OnInit, OnDestroy
{
  public perfectScrollbarConfig: any;

  public _layoutViewMode: OrderDataEntryWidgetLayoutModeEnum =
    OrderDataEntryWidgetLayoutModeEnum.Inline;
  @Input() set layoutViewMode(mode: OrderDataEntryWidgetLayoutModeEnum) {
    mode = mode ? Number(mode) : mode;
    if (
      (this._layoutViewMode == OrderDataEntryWidgetLayoutModeEnum.Inline &&
        mode == OrderDataEntryWidgetLayoutModeEnum.InTab) ||
      (this._layoutViewMode == OrderDataEntryWidgetLayoutModeEnum.InTab &&
        mode == OrderDataEntryWidgetLayoutModeEnum.Inline)
    ) {
      if (this.data) {
        this.data = (this.data as Array<any>).reverse();
      }
    }
    this._layoutViewMode = mode;
  }
  @Input() tabID: string;
  @Output() outputData: EventEmitter<any> = new EventEmitter();

  public allowAddingPaymentType = false;
  public isCancelThreatSAV = false;
  public isCancelBadChequeSAV = false;
  public parentComponent = this;
  private paymentTypeCallSave: Observable<any>;
  private paymentTypeCallSaveSubscription: Subscription;

  private mainCurrencyAndMainPaymentTypeListStateSubscription: Subscription;
  private mainCurrencyAndMainPaymentTypeListState: Observable<any>;

  private scanningStatusCallSkipStateSubscription: Subscription;
  private scanningStatusCallSkipState: Observable<any>;

  private activeTabInListPaymentTabStateSubscription: Subscription;
  private updateIsCancelSAVStateSubscription: Subscription;

  private orderTotalSummaryStateSubscription: Subscription;
  private orderTotalSummaryState: Observable<any>;

  private orderFailedRequestDataState: Observable<any>;
  private orderFailedRequestDataStateSubcription: Subscription;
  private cachedFailedDataState: Observable<any>;
  private cachedFailedDataStateSubcription: Subscription;
  private saveOrderDataEntrySuccessSubscription: Subscription;

  private rejectIdPaymentsStateSubscription: Subscription;
  private rejectIdPaymentsState: Observable<any>;

  private editOrderDataState: Observable<any>;
  private editOrderDataStateSubcription: Subscription;

  public data: any = [];
  public mainCurrency: Currency;
  public shadowPaymentTypeList: Array<any> = [];
  //shadowCurrencyList, shadowODEPaymentPost, shadowODEPaymentBank
  //OnDestroy event: you cannot release it, because it is referenced in cache and is commonly used
  private shadowCurrencyList: Array<any> = [];
  private shadowODEPaymentPostList: Array<any> = [];
  private shadowODEPaymentBankList: Array<any> = [];

  @ViewChildren('paymentItem')
  private paymentItemsCtrl: QueryList<DataEntryPaymentTypeItemComponent>;

  @ViewChild('plusCtrl') plusCtrl: ElementRef;
  private currentPaymentIdForConfirmTotalAmount: any = undefined;

  constructor(
    private appErrorHandler: AppErrorHandler,
    private dataEntryActions: DataEntryActions,
    private store: Store<AppState>,
    private ref: ChangeDetectorRef,
    private commonService: CommonService,
    public hotKeySettingService: HotKeySettingService,
    protected router: Router,
    private dispatcher: ReducerManagerDispatcher,
    private modalService: ModalService,
    private dataEntryProcess: DataEntryProcess,
    private dataEntryService: DataEntryService
  ) {
    super(router, {
      defaultTranslateText: 'paymentTypeData',
      emptyData: new OrderDataEntryPaymentTypeModel(),
    });

    this.mainCurrencyAndMainPaymentTypeListState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .mainCurrencyAndMainPaymentTypeList
    );
    this.paymentTypeCallSave = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .paymentTypeCallSave
    );
    this.scanningStatusCallSkipState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .scanningStatusCallSkip
    );
    this.orderTotalSummaryState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .orderTotalSummaryData
    );

    this.orderFailedRequestDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .orderFailedRequestData
    );
    this.cachedFailedDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).cachedFailedData
    );

    this.rejectIdPaymentsState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).rejectIdPayments
    );
    this.editOrderDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).editOrderData
    );
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.initData();
    this.subscription();
    this.initPerfectScroll();
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    this.store.dispatch(
      this.dataEntryActions.dataEntryPaymentCallAddType(false, this.tabID)
    );
    this.store.dispatch(
      this.dataEntryActions.dataEntryPaymentTypeCallSave(false, this.tabID)
    );
    this.store.dispatch(
      this.dataEntryActions.dataEntrySetOrderDataPaymnetType([], this.tabID)
    );

    Uti.unsubscribe(this);

    //set object = null
    this.perfectScrollbarConfig = null;

    //set array length = 0
    if (this.data) this.data.length = 0;
    if (this.shadowPaymentTypeList) this.shadowPaymentTypeList.length = 0;
    //set object = {}
  }

  //#region Init data
  private initData() {
    this.data = this.emptyData();
    this.getListComboBox();
  }

  private getListComboBox(): Observable<any> {
    if (this.shadowCurrencyList && this.shadowCurrencyList.length)
      return Observable.of(this.shadowCurrencyList);

    return this.commonService
      .getListComboBox(
        '' +
          ComboBoxTypeConstant.currency +
          ',' +
          ComboBoxTypeConstant.odePaymentPost +
          ',' +
          ComboBoxTypeConstant.odePaymentBank
      )
      .map((response: ApiResultResponse) => {
        if (!response || !response.item || !response.item.currency) return null;

        this.shadowCurrencyList = response.item.currency;
        this.shadowODEPaymentPostList = response.item.odePaymentPost;
        this.shadowODEPaymentBankList = response.item.odePaymentBank;
        return response.item;
      });
  }

  private subscription() {
    this.paymentTypeCallSaveSubscription = this.paymentTypeCallSave.subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (!response || isEmpty(response) || !response.save) return;
          this.submit();
        });
      }
    );

    this.mainCurrencyAndMainPaymentTypeListStateSubscription =
      this.mainCurrencyAndMainPaymentTypeListState.subscribe((data) => {
        this.appErrorHandler.executeAction(() => {
          if (!data) return;

          this.isLoadingCurrencyAndPaymentType = true;
          this.getListComboBox().subscribe((response) => {
            this.waitForLoadingDataByCurrencyAndPaymentType(data);
          });
        });
      });

    this.scanningStatusCallSkipStateSubscription =
      this.scanningStatusCallSkipState.subscribe((canSkip: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !canSkip ||
            this.dataEntryProcess.selectedODETab.TabID != this.tabID
          )
            return;

          // if (canSkip.skip)
          //     this.resetData(true);
        });
      });

    this.activeTabInListPaymentTabStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            DataEntryActions.DATA_ENTRY_ACTIVE_TAB_IN_LIST_PAYMENT_TAB &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI &&
          action.area == this.tabID
        );
      })
      .subscribe((data: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          if (!data || !data.payload) return;

          const tabId = data.payload;
          this.data.forEach((_tab) => {
            _tab.active = _tab.paymentId == tabId;
          });
          this.ref.detectChanges();
        });
      });

    this.updateIsCancelSAVStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === DataEntryActions.DATA_ENTRY_UPDATE_IS_CANCEL_SAV &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI &&
          action.area == this.tabID
        );
      })
      .subscribe((data: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          if (!data) return;
          this.isCancelThreatSAV = this.isCancelBadChequeSAV = !!data.payload;
        });
      });

    this.orderTotalSummaryStateSubscription = this.orderTotalSummaryState
      .debounceTime(100)
      .subscribe((response: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!response || !this.paymentItemsCtrl) return;

          // let isChangeCreditCardAmount = false;
          let isSetCreditCardAmount = false;
          let isSetOpenInvoice = false;
          this.paymentItemsCtrl.forEach((item) => {
            if (!item.data.paymentTypeId) return;
            if (
              response.paymentId == item.data.paymentId &&
              !this.currentPaymentIdForConfirmTotalAmount
            ) {
              this.currentPaymentIdForConfirmTotalAmount = response.paymentId;
            }
            item.data.creditCardTotalAmount = response.creditCardTotalAmount;
            if (item.data.paymentTypeGroup == PaymentTypeGroupEnum.CreditCard) {
              isSetCreditCardAmount = true;
              if (isSetOpenInvoice) {
                item.setValueForCreditCardAmount(0);
              } else {
                item.setValueForCreditCardAmount(
                  response.creditCardTotalAmount
                );
              }
            } else if (
              item.data.paymentTypeId == PaymentTypeIdEnum.OpenInvoice
            ) {
              isSetOpenInvoice = true;
              if (isSetCreditCardAmount) {
                item.setValueForOpenInvoicedAmount(0);
              } else {
                item.setValueForOpenInvoicedAmount(
                  response.creditCardTotalAmount
                );
              }
            }
          });

          //if (!isChangeCreditCardAmount && this.currentPaymentIdForConfirmTotalAmount && Number(response.totalAmount)) {
          //    this.paymentItemsCtrl.forEach((item) => {
          //        if (this.currentPaymentIdForConfirmTotalAmount === item.data.paymentId) {
          //            this.currentPaymentIdForConfirmTotalAmount = undefined;
          //            this.confirmTotalAmount(response, item);
          //            return;
          //        }
          //    });
          //}
        });
      });

    this.subscribeSaveOrderDataEntrySuccess();
    this.subscribeOrderFailed();
    this.subscribeEditOrder();

    this.rejectIdPaymentsStateSubscription =
      this.rejectIdPaymentsState.subscribe((rejectIdPayments: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            rejectIdPayments &&
            rejectIdPayments.length &&
            this.paymentItemsCtrl &&
            this.paymentItemsCtrl.length
          ) {
            setTimeout(() => {
              let paymentIds = [];
              this.paymentItemsCtrl.forEach((item) => {
                const isRejected = item.paymentTypeIsRejected(true);
                if (isRejected) {
                  paymentIds.push(item.data.paymentId);
                }
              });

              if (paymentIds.length > 1) {
                setTimeout(() => {
                  for (let i = 1; i < paymentIds.length; i++) {
                    this.data = reject(this.data, {
                      paymentId: paymentIds[i],
                    });
                  }
                }, 500);
              }
            });
          }
        });
      });
  }

  private subscribeOrderFailed() {
    this.orderFailedRequestDataStateSubcription =
      this.orderFailedRequestDataState.subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (response && response.isNotify) {
            this.store.dispatch(
              this.dataEntryActions.orderFailedReceiveData(
                {
                  key: OrderFailedDataEnum.PaymentType,
                  data: this.data,
                },
                this.tabID
              )
            );
          }
        });
      });

    this.cachedFailedDataStateSubcription =
      this.cachedFailedDataState.subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !response ||
            !response.paymentType ||
            !response.paymentType.length
          )
            return;

          this.reloadPaymentTypes(response);
        });
      });
  }

  //#region EditOrder
  private subscribeEditOrder() {
    this.editOrderDataStateSubcription = this.editOrderDataState.subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !response ||
            !response.paymentType ||
            !response.paymentType.length
          )
            return;

          this.editOrderLoadData(response);
        });
      }
    );
  }

  private editOrderLoadData(data: any, count?: number) {
    count = count || 1;
    if (count > 60) return; //retry 60 times, each time 500ms -> 30s

    //if component still haven't loaded, wait 1s
    if (
      this.isLoadingCurrencyAndPaymentType ||
      !this.paymentItemsCtrl ||
      !this.shadowCurrencyList ||
      !this.shadowCurrencyList.length
    ) {
      //console.log('EditOrder: wait 0.5s for loading paymentItemComponent');
      setTimeout(() => {
        this.editOrderLoadData(data, ++count);
      }, 500);
    } else {
      const model = this.editOrderBuildModel(data);
      this.reloadPaymentTypes(model);
    }
  }

  private editOrderBuildModel(data: any) {
    let paymentTypes = data.paymentType;
    if (!paymentTypes || !paymentTypes.length) return;

    let newPaymentTypes = [];

    let gPaymentTypes = groupBy(paymentTypes, 'IdRepPaymentsMethods');
    //console.log('Group PaymentTypes', gPaymentTypes);
    let paymentIndex = 1;
    Object.keys(gPaymentTypes).forEach((key, index, arr) => {
      let gPayment: Array<any> = gPaymentTypes[key];
      let newPaymentType = null;
      let formValue: any = null;
      let amount: number = 0;
      let amounts: Array<any> = null;
      let creditCardAmounts: Array<any> = null;
      let paymentTypeGroup: any;
      gPayment.forEach((item) => {
        paymentTypeGroup = this.getPaymentTypeGroup(item.IdRepPaymentsMethods);
        //Group Cash or PostBank always create new PaymentType
        if (
          newPaymentType == null ||
          paymentTypeGroup == PaymentTypeGroupEnum.Cash ||
          paymentTypeGroup == PaymentTypeGroupEnum.PostBank
        ) {
          newPaymentType = this.makeNewPaymentTypeData(paymentIndex++);

          newPaymentType.paymentTypeId = item.IdRepPaymentsMethods;
          newPaymentType.paymentTypeGroup = paymentTypeGroup;
          newPaymentType.postageCosts = this.getPostageCosts(
            newPaymentType.paymentTypeId
          );
          newPaymentType.currencyId = item.IdRepCurrencyCode;
          newPaymentType.currency = item.IdRepCurrencyCode;

          formValue = {};
          amounts = [];
          creditCardAmounts = [];
          formValue.paymentTypeId = newPaymentType.paymentTypeId;
          formValue.paymentTypeGroup = newPaymentType.paymentTypeGroup;
          formValue.currency = newPaymentType.currency;
        }

        let amountTemp = 0;
        switch (newPaymentType.paymentTypeGroup) {
          case PaymentTypeGroupEnum.Cash:
            amount =
              (item.ConversionPaidAmount
                ? item.ConversionPaidAmount
                : item.PaidAmount) || 0;

            formValue.amount = amount;
            newPaymentType.amount = amount;
            newPaymentType.formValue = formValue;
            newPaymentTypes.push(newPaymentType);
            newPaymentType = null;
            break;
          case PaymentTypeGroupEnum.Cheque:
            if (amounts.length == 0) {
              formValue.codeline = item.ChequeCodeline;
            }
            amountTemp =
              (item.ConversionPaidAmount
                ? item.ConversionPaidAmount
                : item.PaidAmount) || 0;
            amounts.push({
              amount: amountTemp,
              chequeDate: item.ChequeCreditedDate
                ? new Date(item.ChequeCreditedDate)
                : null,
            });
            amount += amountTemp;
            break;
          case PaymentTypeGroupEnum.CreditCard:
            if (creditCardAmounts.length == 0) {
              formValue.issuer = item.IdRepCreditCardType;
              formValue.creditCardNr = item.CreditCardNr;
              formValue.validThru =
                item.CreditCardValidMonth.padStart(2, '0') +
                '/' +
                item.CreditCardValidYear.padStart(2, '0');
              formValue.cvc = item.CreditCardCVV;
            }
            amountTemp =
              (item.ConversionPaidAmount
                ? item.ConversionPaidAmount
                : item.PaidAmount) || 0;
            creditCardAmounts.push({
              amount: amountTemp,
              creditDate: item.CreditCardDate
                ? new Date(item.CreditCardDate)
                : null,
            });
            amount += amountTemp;
            break;
          case PaymentTypeGroupEnum.PostBank:
            amount =
              (item.ConversionPaidAmount
                ? item.ConversionPaidAmount
                : item.PaidAmount) || 0;

            formValue.amount = amount;
            newPaymentType.amount = amount;
            newPaymentType.formValue = formValue;
            newPaymentTypes.push(newPaymentType);
            newPaymentType = null;
            break;
        }
      });

      //Add for Cheque & CreditCard
      if (paymentTypeGroup != PaymentTypeGroupEnum.Cash) {
        switch (paymentTypeGroup) {
          case PaymentTypeGroupEnum.Cheque:
            if (amounts.length) {
              amounts = orderBy(amounts, ['chequeDate'], ['asc']);
            }
            formValue.amount = amount;
            formValue.amounts = amounts;
            break;
          case PaymentTypeGroupEnum.CreditCard:
            if (creditCardAmounts.length) {
              creditCardAmounts = orderBy(
                creditCardAmounts,
                ['creditDate'],
                ['asc']
              );
              formValue.creditCardOption = '0';
              formValue.creditCardCustomMonth = gPayment.length;
            } else {
              formValue.creditCardOption = '1';
              formValue.creditCardCustomMonth = 0;
            }
            formValue.creditCardAmounts = creditCardAmounts;
            formValue.creditCardAmount = amount;
            break;
        }
        newPaymentType.amount = amount;
        newPaymentType.formValue = formValue;
        newPaymentTypes.push(newPaymentType);
      }
    }); //for Groups
    //console.log('New PaymentTypes', newPaymentTypes);
    return {
      mainCurrency: data.mainCurrency,
      mainPaymenTypeList: data.mainPaymenTypeList,
      paymentType: cloneDeep(newPaymentTypes),
    };
  }

  private getPaymentTypeGroup(paymentTypeId) {
    switch (paymentTypeId) {
      case PaymentTypeIdEnum.Cash:
      case PaymentTypeIdEnum.CreditCardAlreadyPaid:
      case PaymentTypeIdEnum.OpenInvoice:
        return PaymentTypeGroupEnum.Cash;

      case PaymentTypeIdEnum.Cheque:
      case PaymentTypeIdEnum.MoneyOrder:
        return PaymentTypeGroupEnum.Cheque;

      case PaymentTypeIdEnum.CreditCard:
        return PaymentTypeGroupEnum.CreditCard;

      case PaymentTypeIdEnum.Post:
      case PaymentTypeIdEnum.Bank:
        return PaymentTypeGroupEnum.PostBank;
    }
    return null;
  }

  private getPostageCosts(paymentTypeId) {
    const shadowPaymentTypeItem = this.shadowPaymentTypeList.find(
      (n) => n.paymentTypeId == paymentTypeId
    );
    return shadowPaymentTypeItem ? shadowPaymentTypeItem.postageCosts || 0 : 0;
  }
  //#endregion

  private dontAllowChangePaymentTypeAndCurrency: boolean;
  private subscribeSaveOrderDataEntrySuccess() {
    if (this.saveOrderDataEntrySuccessSubscription)
      this.saveOrderDataEntrySuccessSubscription.unsubscribe();

    this.saveOrderDataEntrySuccessSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === DataEntryActions.DATA_ENTRY_SAVE_RESULT &&
          action.area == this.tabID
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!data || !data.returnID || !this.hasCachePaymentTypeData())
            return;

          this.dontAllowChangePaymentTypeAndCurrency = true;
          this.isCancelThreatSAV = this.isCancelBadChequeSAV = false;

          let cachedPaymentTypeData = this.dataEntryProcess.paymentTypeData;
          //only keep the paymentType, clear content
          this.data.length = 0;
          this.setDataForReloadPaymentTypes(cachedPaymentTypeData);

          let newPaymentTypes = [];
          const paymentTypes = cachedPaymentTypeData.paymentType;
          let paymentIndex = 1;
          for (let paymentType of paymentTypes) {
            let newPaymentType = this.createEmptyPaymentItem(paymentIndex--);
            newPaymentType.paymentTypeGroup = paymentType.paymentTypeGroup;
            newPaymentType.paymentTypeId = paymentType.paymentTypeId;
            newPaymentType.paymentTypeText = paymentType.paymentTypeText;
            newPaymentType.postageCosts = 0; //paymentType.postageCosts; //Reset postageCosts
            newPaymentType.paymentTypes = paymentType.paymentTypes;

            newPaymentType.currencyList = paymentType.currencyList;
            newPaymentType.mainCurrency = paymentType.mainCurrency;
            newPaymentType.mainCurrencyCode = paymentType.mainCurrencyCode;
            newPaymentType.idMainCurrencyCode = paymentType.idMainCurrencyCode;
            newPaymentType.currency = paymentType.currency;
            newPaymentType.currencyId = paymentType.currencyId;
            newPaymentType.currencyText = paymentType.currencyText;

            newPaymentTypes.push(newPaymentType);
          }

          cachedPaymentTypeData.paymentType = cloneDeep(newPaymentTypes); //cloneDeep to prevent using the same memory
          this.data = cachedPaymentTypeData.paymentType;

          //Force choose PaymentType
          setTimeout(() => {
            this.paymentItemsCtrl.forEach((item) => {
              const findItem = this.data.find(
                (n) => n.paymentId == item.data.paymentId
              );
              item.restoreWithKeepPaymentType(findItem);
            });
            this.selectTab(this.data[0], true); //Dont focus on payment when save success

            setTimeout(() => {
              this.dontAllowChangePaymentTypeAndCurrency = false;
            }, 1000);
          }, 1000);
        });
      });
  }

  private reloadPaymentTypes(response: any) {
    if (!response || !response.paymentType || !response.paymentType.length)
      return;

    this.dontAllowChangePaymentTypeAndCurrency = true;

    if (response.mainCurrency) this.mainCurrency = response.mainCurrency;

    if (response.mainPaymenTypeList && response.mainPaymenTypeList.length)
      this.buildShadowPaymentTypeList(response.mainPaymenTypeList);

    this.data = response.paymentType;

    setTimeout(() => {
      this.selectTab(this.data[0], true);
      this.reBuildPaymentTypeDropdownData(() => {
        setTimeout(() => {
          this.sortData();
          this.updateData();
          this.dontAllowChangePaymentTypeAndCurrency = false;
          this.dataEntryProcess.isProcessingLoadEditOrder = false;
        }, 200);
      });
    });
  }

  private setDataForReloadPaymentTypes(response: any) {
    if (!response || !response.paymentType || !response.paymentType.length)
      return;

    if (response.mainCurrency) this.mainCurrency = response.mainCurrency;

    if (response.mainPaymenTypeList && response.mainPaymenTypeList.length)
      this.buildShadowPaymentTypeList(response.mainPaymenTypeList);
  }

  private reloadPaymentTypesWhenChangingMediaCode() {
    const mainCurrencyId = this.mainCurrency.idRepCurrencyCode || '';
    const currencyCode = this.mainCurrency.currencyCode;

    let cashIndex = 0;
    let listChosenCurrencyIds = [];
    for (let paymentItem of this.data) {
      const cashType =
        paymentItem.paymentTypeGroup == PaymentTypeGroupEnum.Cash &&
        paymentItem.paymentTypeId !== PaymentTypeIdEnum.OpenInvoice;

      if (paymentItem.paymentTypeId == PaymentTypeIdEnum.Post)
        paymentItem.postNameList = cloneDeep(this.shadowODEPaymentPostList);
      else if (paymentItem.paymentTypeId == PaymentTypeIdEnum.Bank)
        paymentItem.bankNameList = cloneDeep(this.shadowODEPaymentBankList);

      paymentItem.currencyList = cloneDeep(this.shadowCurrencyList);
      paymentItem.mainCurrency = this.mainCurrency;
      paymentItem.mainCurrencyCode = currencyCode;
      paymentItem.idMainCurrencyCode = mainCurrencyId;
      paymentItem.postageCosts = this.getPostageCosts(
        paymentItem.paymentTypeId
      );

      if (cashType) {
        //The first Cash always chooses MainCurrency
        if (cashIndex == 0) {
          paymentItem.currencyId = mainCurrencyId;
          paymentItem.currencyText = currencyCode;
          listChosenCurrencyIds.push(mainCurrencyId);
        } else {
          //Item # 2 onwards will choose the other currencies
          for (
            let i = 0, length = this.shadowCurrencyList.length;
            i < length;
            i++
          ) {
            const currencyItem = this.shadowCurrencyList[i];
            const findChosenCurrencyId = listChosenCurrencyIds.find(
              (n) => n == currencyItem.idValue
            );
            if (findChosenCurrencyId) continue;

            paymentItem.currencyId = currencyItem.idValue;
            paymentItem.currencyText = currencyItem.textValue;
            listChosenCurrencyIds.push(currencyItem.idValue);
            break;
          } //for
        }
        cashIndex++;
      } else {
        paymentItem.currencyId = mainCurrencyId;
        paymentItem.currencyText = currencyCode;
      }
    }

    //If is Processing For Save Order DataEntry Success, after 1s we will call the restoreWithKeepPaymentType function. So don't need to call it again
    if (!this.dontAllowChangePaymentTypeAndCurrency) {
      setTimeout(() => {
        this.paymentItemsCtrl.forEach((item) => {
          const findItem = this.data.find(
            (n) => n.paymentId == item.data.paymentId
          );
          item.restoreWithKeepPaymentType(findItem);
        });
      }, 200);
    }
  }

  private hasCachePaymentTypeData() {
    const cachePaymentTypeData = this.dataEntryProcess.paymentTypeData;
    return (
      cachePaymentTypeData.paymentType &&
      cachePaymentTypeData.paymentType.length
    );
  }

  private isLoadingCurrencyAndPaymentType: boolean;
  private waitForLoadingDataByCurrencyAndPaymentType(
    mainCurrencyAndMainPaymentType: any,
    count?: number
  ) {
    count = count || 1;
    if (count > 30) return;

    //if component still haven't loaded, wait 1s
    if (!this.paymentItemsCtrl) {
      console.log('Init: wait 0.5s for loading paymentItemComponent');
      setTimeout(() => {
        this.waitForLoadingDataByCurrencyAndPaymentType(
          mainCurrencyAndMainPaymentType,
          ++count
        );
      }, 500);
    } else {
      this.loadDataByCurrencyAndPaymentType(mainCurrencyAndMainPaymentType);
    }
  }

  private loadDataByCurrencyAndPaymentType(data: any) {
    this.resetData();

    if (data.mainCurrency) this.mainCurrency = data.mainCurrency;

    if (data.mainPaymentTypeList && data.mainPaymentTypeList.length)
      this.buildShadowPaymentTypeList(data.mainPaymentTypeList);

    if (this.isBackofficeOrders()) {
      this.isLoadingCurrencyAndPaymentType = false;
      this.addPaymentType();
    } else {
      if (this.hasCachePaymentTypeData()) {
        if (
          data.mainCurrency &&
          data.mainPaymentTypeList &&
          data.mainPaymentTypeList.length
        )
          this.reloadPaymentTypesWhenChangingMediaCode();
      } else {
        this.addPaymentType();
      }

      setTimeout(() => {
        this.updateData();
        this.isLoadingCurrencyAndPaymentType = false;
      });
    }
  }

  public rebuildTranslateText() {}

  private initPerfectScroll() {
    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };
  }

  private emptyData(): any {
    return [this.createEmptyPaymentItem()];
  }

  private buildShadowPaymentTypeList(data: any) {
    this.shadowPaymentTypeList = data.map((item) => {
      return {
        paymentTypeText: item['paymentType'],
        paymentTypeId: item['idRepInvoicePaymentType'],
        postageCosts: item['postageCosts'],
        paymentTypeGroup: item['paymentGroup'],
      };
    });

    /*
        //TODO: For Testing
        this.shadowPaymentTypeList.push({
            paymentTypeText: '8-Post',
            paymentTypeId: 8,
            postageCosts: 0,
            paymentTypeGroup: 4
        });
        this.shadowPaymentTypeList.push({
            paymentTypeText: '9-Bank',
            paymentTypeId: 9,
            postageCosts: 0,
            paymentTypeGroup: 4
        });
        */
  }

  private createEmptyPaymentItem(index?: number): any {
    return {
      id: new Date().getTime() + (index || 0),
      paymentId: 'orderDataEntryPayment' + Uti.getTempId(),
      active: true,
      headerText: 'Payment',
      isRemove: false,
      paymentTypes: [],
      currencyList: [],
      postNameList: [],
      bankNameList: [],
      postageCosts: 0,
      mainCurrencyCode: '',
      idMainCurrencyCode: '',
      currencyId: null,
      paymentTypeGroup: null, //1: Cash, 2: Cheque, 3: CreditCard, 4: PostBank
      creditCardOptionsConfig: {
        //'1': { disabled: false },//Default
        '3': { disabled: false }, //3 Months
        '6': { disabled: false }, //6 Months
        '12': { disabled: false }, //12 Months
        '0': { disabled: false }, //Custom
      },
    };
  }

  public resetData(isInitEmptyData?: boolean, isSetPaymentEmpty?: boolean) {
    const hasCachePaymentTypeData = this.hasCachePaymentTypeData();

    if (isInitEmptyData) this.data = this.emptyData();
    else if (!hasCachePaymentTypeData || isSetPaymentEmpty)
      this.data.length = 0;

    if (!hasCachePaymentTypeData || isSetPaymentEmpty) {
      this.mainCurrency = new Currency();
      this.shadowPaymentTypeList.length = 0;
    }
    // this.isCancelSAV = false;
  }
  //#endregion

  //#region Event
  public outputDataHandler($event: any) {}

  private submit() {
    this.paymentItemsCtrl.forEach((item) => {
      item.onSubmit();
    });
  }
  //#endregion

  //#region Currency
  public onCurrencyChanged($event): void {
    if (!$event || this.dontAllowChangePaymentTypeAndCurrency) return;

    //Only rebuild with Cash Type
    setTimeout(() => {
      const allowedCurrencyList = this.createCurrencyList();
      this.paymentItemsCtrl.forEach((item) => {
        if (
          $event.currencyId != item.data.currencyId &&
          item.data.paymentTypeGroup === PaymentTypeGroupEnum.Cash &&
          item.data.paymentTypeId !== PaymentTypeIdEnum.OpenInvoice
        ) {
          item.setCurrencySource(allowedCurrencyList);
        }
      });
    });
  }

  private createCurrencyList(): Array<any> {
    const excludeCurrencyIds = this.getExcludeCurrencyIds();
    let currencyList = cloneDeep(this.shadowCurrencyList);
    if (excludeCurrencyIds.length) {
      for (let currencyId of excludeCurrencyIds) {
        currencyList = reject(currencyList, {
          idValue: currencyId + '',
        });
      }
    }
    return currencyList;
  }

  private getExcludeCurrencyIds(): any {
    let excludeCurrencyIds = [];
    //If PaymentType is Cash, the other Cash will not be chosen this Currency
    for (let item of this.data) {
      if (
        item.currencyId &&
        item.paymentTypeGroup &&
        item.paymentTypeGroup == PaymentTypeGroupEnum.Cash &&
        item.paymentTypeId !== PaymentTypeIdEnum.OpenInvoice
      ) {
        excludeCurrencyIds.push(item.currencyId);
      }
    }

    return excludeCurrencyIds;
  }
  //#endregion

  //#region PaymentType: Add/ remove Payment tab
  public addPayment($event: any) {
    if (this.shadowPaymentTypeList.length === 0) return;

    if ($event === true && this.plusCtrl) {
      let el: HTMLElement = this.plusCtrl.nativeElement as HTMLElement;
      el.click();
    } else {
      this.addPaymentType();
    }
  }

  public removePayment($event: any) {
    //must have more 1 item -> allow remove
    if (this.data.length < 2) return;

    this.dontAllowChangePaymentTypeAndCurrency = true;

    const currentPayment = this.data.find((x) => {
      return x.paymentId == $event.paymentId;
    });
    if (!currentPayment || !currentPayment.paymentId) return;

    if (this._layoutViewMode == OrderDataEntryWidgetLayoutModeEnum.InTab) {
      this.reselectTab($event);
    }

    Uti.removeItemInArray(this.data, currentPayment, 'paymentId'); //remove current item from 'data'
    this.reBuildPaymentTypeDropdownData(() => {
      setTimeout(() => {
        this.sortData();
        this.updateData();
        this.dontAllowChangePaymentTypeAndCurrency = false;
      }, 200);
    });
  }

  public selectTab(tab: any, notFocusPaymentType?: boolean) {
    if (!tab) return;
    let activeTabs = this.data.filter((p) => p.active);
    activeTabs.forEach((_tab) => {
      _tab.active = false;
    });
    tab.active = true;
    this.ref.detectChanges();
    this.paymentItemsCtrl.forEach((item) => {
      if (tab.paymentId === item.data.paymentId) {
        item.paymentTypeCtrlAutoExpandSelection = true;
        if (!notFocusPaymentType) {
          setTimeout(() => {
            item.focusPaymentType();
          }, 200);
        }
      }
    });
  }

  private reselectTab(payment: any) {
    if (this.data.length <= 1) return;

    const itemIndex = this.data.indexOf(payment);
    if (itemIndex === 0) {
      this.data[1].active = true;
      return;
    }
    this.data[itemIndex - 1].active = true;
  }

  private sortData() {
    //only sort for InTab
    if (
      !this.data ||
      !this.data.length ||
      this._layoutViewMode != OrderDataEntryWidgetLayoutModeEnum.Inline
    )
      return;

    //mode InTab: sort from new to old
    this.data = orderBy(this.data, ['id'], ['desc']);
  }

  //Add more payment type item into master data
  private addPaymentType($event?: any) {
    if (!this.checkAddingPaymentType()) return;

    const tab = this.makeNewPaymentTypeData();
    this.data.push(tab);
    this.selectTab(tab);
    this.sortData();

    //must call again to set for variable allowAddingPaymentType
    this.checkAddingPaymentType();
  }

  //Run when payment type dropdown is changed
  public changePaymentType($event: any) {
    if (this.dontAllowChangePaymentTypeAndCurrency) return;

    //update postageCosts
    const shadowPaymentTypeItem = this.shadowPaymentTypeList.find(
      (n) => n.paymentTypeId == $event.paymentTypeId
    );
    if (shadowPaymentTypeItem) {
      const item = this.data.find(
        (n) => n.paymentTypeId == $event.paymentTypeId
      );
      item.postageCosts = shadowPaymentTypeItem.postageCosts;
    }
    this.reBuildPaymentTypeDropdownData();
  }

  private checkAddingPaymentType() {
    if (!this.data.length) {
      this.allowAddingPaymentType = true;
    } else {
      //if there is any 'PaymentType DropdownList' which have not been chosen -> don't allow add new 'PaymentType Component'
      const findPaymentNotChooseType = this.data.find((x) => {
        return !x.paymentTypeId;
      });
      this.allowAddingPaymentType = findPaymentNotChooseType ? false : true;
    }

    return this.allowAddingPaymentType;
  }

  //Build dropdown payment data
  private reBuildPaymentTypeDropdownData(callback?: Function) {
    this.checkAddingPaymentType();

    setTimeout(() => {
      const allowedPaymentTypeList = this.createPaymentTypeList();
      const allowedCurrencyList = this.createCurrencyList(); //exclude currencies with payment type is cash

      this.paymentItemsCtrl.forEach((item) => {
        item.setPaymentTypeSource(allowedPaymentTypeList);
        const notCash =
          item.data.paymentTypeGroup !== PaymentTypeGroupEnum.Cash ||
          item.data.paymentTypeId === PaymentTypeIdEnum.OpenInvoice;
        item.setCurrencySource(
          notCash ? this.shadowCurrencyList : allowedCurrencyList
        );
      }); //forEach

      if (callback != null) {
        callback();
      }
    });
  }

  // Create a new payment type data
  private makeNewPaymentTypeData(paymentIndex?: number): any {
    let paymentItem = this.createEmptyPaymentItem(paymentIndex);

    paymentItem.paymentTypes = this.createPaymentTypeList();
    paymentItem.currencyList = this.createCurrencyList();
    paymentItem.mainCurrency = this.mainCurrency;
    paymentItem.mainCurrencyCode = this.mainCurrency.currencyCode;
    paymentItem.idMainCurrencyCode = this.mainCurrency.idRepCurrencyCode || '';

    paymentItem.postNameList = cloneDeep(this.shadowODEPaymentPostList);
    paymentItem.bankNameList = cloneDeep(this.shadowODEPaymentBankList);

    return paymentItem;
  }

  // Create fake data for dropdown payment type
  private createPaymentTypeList(): Array<any> {
    const excludePaymentTypeIds = this.getExcludePaymentTypeIds();
    let mainPayments = cloneDeep(this.shadowPaymentTypeList);
    if (excludePaymentTypeIds.length) {
      for (let paymentTypeId of excludePaymentTypeIds) {
        mainPayments = reject(mainPayments, {
          paymentTypeId: paymentTypeId,
        });
      }
    }
    return mainPayments;
  }

  private getExcludePaymentTypeIds(): any {
    const excludePaymentTypeIds = [];
    // If chosen CreditCard / Cheque / OpenInvoice -> don't allow to choose them again
    for (const item of this.data) {
      if (
        item.paymentTypeId &&
        item.paymentTypeGroup &&
        ((item.paymentTypeGroup !== PaymentTypeGroupEnum.Cash &&
          item.paymentTypeGroup !== PaymentTypeGroupEnum.PostBank) ||
          item.paymentTypeId === PaymentTypeIdEnum.OpenInvoice)
      ) {
        excludePaymentTypeIds.push(item.paymentTypeId);
      }
    }
    return excludePaymentTypeIds;
  }

  public itemsTrackBy(index, item) {
    return item ? item.id : index;
  }
  //#endregion

  //#region Event: updateData

  private mapDataForSaving(paymentItem: any, amountItem?: any) {
    let item = {
      PaymentId: paymentItem.paymentId,
      IdSalesOrderInvoicePayments: null, // -- only for Edit
      IdRepPaymentsMethods: paymentItem.paymentTypeId,
      IdSharingPaymentGateway: null, // -- only for Edit
      IdRepCurrencyCode: paymentItem.currency,
      IdSharingCreditCard: null, // -- only for Edit
      IdRepCreditCardType: paymentItem.issuer,
      CreditCardNr: paymentItem.creditCardNr,
      CreditCardValidMonth: paymentItem.validThruMonth,
      CreditCardValidYear: paymentItem.validThruYear,
      CreditCardCVV: paymentItem.cvc,
      IdSharingPaymentCheque: null, //  -- only for Edit
      ChequeCodeline: paymentItem.codeline,
      ChequeNr: null,
      ChequeType: null,
      ChequeRejectDate: null,
      PaidAmount: null,
      ConversionValue: null,
      ConversionPaidAmount: null,
      SystemCurrency: null,
      SystemConversionValue: null,
      PaymentDate: Uti.parseDateToDBString(paymentItem.paymentDate),
    };

    switch (paymentItem.paymentTypeGroup) {
      case PaymentTypeGroupEnum.Cash:
        item['Amount'] = paymentItem.amount;
        break;
      case PaymentTypeGroupEnum.Cheque:
        item['AmountIndex'] = amountItem.index;
        item['Amount'] = amountItem.amount;
        item['ChequeCreditedDate'] = Uti.parseDateToDBString(
          amountItem.chequeDate
        );
        break;
      case PaymentTypeGroupEnum.CreditCard:
        item['AmountIndex'] = amountItem.index;
        item['CreditCardHolderName'] = '';
        item['Amount'] = amountItem.amount;
        item['CreditCardDate'] = Uti.parseDateToDBString(amountItem.creditDate);
        break;
      case PaymentTypeGroupEnum.PostBank:
        item['Amount'] = paymentItem.amount;
        item['IdCashProviderPaymentTerms'] = paymentItem.postBankNameId;
        break;
    } //switch

    return item;
  }

  public updateData($event?: any) {
    if (!this.paymentItemsCtrl) return;

    const mappedData = [];
    let isValid = true;
    if (this.data && this.data.length) {
      this.data.forEach((item) => {
        isValid = isValid && item.valid;
        if (item.paymentTypeId) {
          switch (item.paymentTypeGroup) {
            case PaymentTypeGroupEnum.Cash:
              mappedData.push(this.mapDataForSaving(item));
              break;
            case PaymentTypeGroupEnum.Cheque:
              if (item.amounts && item.amounts.length) {
                item.amounts.forEach((amountItem) => {
                  mappedData.push(
                    this.mapDataForSaving(item, {
                      index: amountItem.index,
                      amount: amountItem.amount,
                      chequeDate: amountItem.chequeDate,
                    })
                  );
                });
              }
              break;
            case PaymentTypeGroupEnum.CreditCard:
              if (item.amounts && item.amounts.length) {
                item.amounts.forEach((amountItem) => {
                  mappedData.push(
                    this.mapDataForSaving(item, {
                      index: amountItem.index,
                      amount: amountItem.amount,
                      creditDate: amountItem.creditDate,
                    })
                  );
                });
              }
              break;
            case PaymentTypeGroupEnum.PostBank:
              mappedData.push(this.mapDataForSaving(item));
              break;
          } //switch
        }
      }); //for Each Payment Type
    }

    let isDirty: boolean;
    if (this.paymentItemsCtrl.length) {
      this.paymentItemsCtrl.forEach((item) => {
        if (item.dataEntryPaymentTypeItemForm) {
          if (item.dataEntryPaymentTypeItemForm.dirty) isDirty = true;
        }
      }); //forEach
    }

    let model = new FormModel({
      formValue: cloneDeep(this.data),
      mappedData: mappedData,
      isValid: isValid,
      isDirty: isDirty,
    });

    model.paymentId = $event;

    //mode Inline: sort from old to new
    if (
      model.formValue &&
      model.formValue.length &&
      this._layoutViewMode == OrderDataEntryWidgetLayoutModeEnum.Inline
    )
      model.formValue = orderBy(model.formValue, ['id'], ['asc']);

    // Calcualte Delivery Charges fee
    model.deliveryCharges = this.calcuateMinDeliveryCharges();
    this.store.dispatch(
      this.dataEntryActions.dataEntrySetOrderDataPaymnetType(model, this.tabID)
    );
    this.outputData.emit(model);
    return model;
  }
  private calcuateMinDeliveryCharges(): number {
    let deliveryChargesFee = 0; // default value
    if (this.data && this.data.length > 0) {
      deliveryChargesFee = max(map(this.data, 'postageCosts')) || 0;
    }
    return deliveryChargesFee;
  }

  private timeoutConfirmTotal: any = undefined;
  private confirmTotalAmount(orderTotal, paymentItem) {
    if (
      !paymentItem.data.amount ||
      !paymentItem.data.paymentTypeId ||
      !paymentItem.data.paymentTypeGroup ||
      !paymentItem.allowShowConfirmTotalAmount
    )
      return;

    clearTimeout(this.timeoutConfirmTotal);

    this.timeoutConfirmTotal = null;
    this.timeoutConfirmTotal = setTimeout(() => {
      paymentItem.allowShowConfirmTotalAmount = false;

      //Only process for the Cash and Cheque
      const orderTotalAmount = parseFloat(orderTotal.totalAmount);
      let subTotalAmount = parseFloat(orderTotal.subTotalAmount);
      if (orderTotalAmount != subTotalAmount * -1) {
        const configOverPercent: number = 0; //over 10%
        //const configUnderPercent: number = -10;//under 10%

        // total = 50, subTotal = 60 --> 50 * 100 / 60 = 120 - 100 = 20%
        let overAmountPercent: number =
          (subTotalAmount * 100) / orderTotalAmount;
        let operatorText: string = ''; //less/greater

        if (subTotalAmount > 0 && overAmountPercent > configOverPercent) {
          operatorText = 'greater';
        }
        //else if (subTotalAmount < 0 && overAmountPercent < configUnderPercent) {
        //    operatorText = 'less';
        //}

        if (!operatorText) return;

        if (this.dataEntryProcess.preventShowDialogConfirmPrice) {
          this.dataEntryProcess.preventShowDialogConfirmPrice = false;
          return;
        }
        const currencyText =
          orderTotal && orderTotal.currencyText ? orderTotal.currencyText : '';

        this.modalService.confirmMessageHtmlContent(
          new MessageModel({
            headerText: 'Confirmation',
            messageType: MessageModal.MessageType.confirm,
            modalSize: MessageModal.ModalSize.small,
            message: [
              { key: '<p>' },
              { key: 'Modal_Message__Current_Total' },
              { key: '<strong>' },
              { key: orderTotal.total },
              { key: currencyText },
              { key: '</strong>' },
              { key: 'Modal_Message__Is' },
              { key: operatorText },
              { key: 'Modal_Message__Than_The' },
              { key: '<br/>' },
              { key: 'Modal_Message__Total_Amount' },
              { key: '</strong>' },
              { key: orderTotal.totalAmount },
              { key: currencyText },
              { key: '</strong>. <br/><br/>' },
              {
                key: 'Modal_Message__Do_You_Want_To_Keep_This_Value',
              },
              { key: '</p>' },
            ],
            okText: 'Yes',
            cancelText: 'No',
            callBack1: () => {
              //do nothing
            },
            callBack2: () => {
              paymentItem.resetValueWhenConfirmTotalAmount();
            },
          })
        );
      } //total not equal subTotal
    }, 200);
  }

  public isBlockUI() {
    return (
      this.tabID == this.dataEntryProcess.selectedODETab.TabID &&
      this.dataEntryProcess.mediaCodeDoesnotExist
    );
  }
  //#endregion

  private isBackofficeOrders() {
    return this.tabID == 'BackofficeOrders' || this.isNotOrderDataEntryModule();
  }

  private isNotOrderDataEntryModule() {
    return (
      this.ofModule &&
      this.ofModule.idSettingsGUI !== ModuleList.OrderDataEntry.idSettingsGUI
    );
  }
}
