import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReducerManagerDispatcher, Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  AppErrorHandler,
  GlobalSettingService,
  CommonService,
  HotKeySettingService,
  PropertyPanelService,
  ModalService,
} from 'app/services';
import {
  FormModel,
  ApiResultResponse,
  FormOutputModel,
  OrderDataEntryTotalSummaryModel,
  MessageModalModel,
  MessageModalHeaderModel,
  MessageModalBodyModel,
  MessageModalFooterModel,
  ButtonList,
} from 'app/models';
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';
import isNil from 'lodash-es/isNil';
import { BloombergService } from 'app/services/common/bloomberg.service';
import {
  CustomAction,
  XnCommonActions,
} from 'app/state-management/store/actions';
import { Uti } from 'app/utilities/uti';
import {
  ComboBoxTypeConstant,
  PaymentTypeGroupEnum,
  Configuration,
  PaymentTypeIdEnum,
  MessageModal,
} from 'app/app.constants';
import { DataEntryActions } from 'app/state-management/store/actions';
import { DataEntryFormBase } from 'app/shared/components/form/data-entry/data-entry-form-base';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';

@Component({
  selector: 'data-entry-order-total-summary',
  templateUrl: './order-total-summary.component.html',
  styleUrls: ['./order-total-summary.component.scss'],
})
export class DataEntryOrderTotalSummaryComponent
  extends DataEntryFormBase
  implements OnInit, OnDestroy, AfterViewInit
{
  public isGettingExchangeMoney: boolean = false;
  private exchangeData: any = {};
  private systemExchangeData: any = {};
  public articleTotal: number = 0;
  private currencyStr: string = '';

  private paymentTypeDataState: Observable<any>;
  private paymentTypeDataStateSubscription: Subscription;

  private deliveryChargesState: Observable<number>;
  private deliveryChargesStateSubscription: Subscription;

  private articleTotalState: Observable<number>;
  private articleTotalStateSubscription: Subscription;

  private mainCurrencyStateSubscription: Subscription;
  private mainCurrencyState: Observable<any>;

  private cachedFailedDataState: Observable<any>;
  private cachedFailedDataStateSubcription: Subscription;

  private editOrderDataState: Observable<any>;
  private editOrderDataStateSubcription: Subscription;

  public data: any;
  public perfectScrollbarConfig: any;
  public deliveryCharge: boolean = true;
  public mainCurrency: any;
  public signSubTotalAmountBoolean: boolean = true;

  @Input() tabID: string;
  @Input() globalProperties: any[];

  @Output() outputData: EventEmitter<FormOutputModel> = new EventEmitter();

  constructor(
    private appErrorHandler: AppErrorHandler,
    private bloombergService: BloombergService,
    private globalSettingService: GlobalSettingService,
    private commonService: CommonService,
    public hotKeySettingService: HotKeySettingService,
    private xnCommonActions: XnCommonActions,
    private store: Store<AppState>,
    private dataEntryActions: DataEntryActions,
    protected router: Router,
    private elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private propertyPanelService: PropertyPanelService,
    private dispatcher: ReducerManagerDispatcher,
    private modalService: ModalService
  ) {
    super(router, {
      defaultTranslateText: 'orderTotalSummaryData',
      emptyData: new OrderDataEntryTotalSummaryModel(),
    });

    this.paymentTypeDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).paymentTypeData
    );
    this.deliveryChargesState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).deliveryCharges
    );
    this.articleTotalState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).articleTotal
    );
    this.mainCurrencyState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).mainCurrency
    );
    this.cachedFailedDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).cachedFailedData
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
    this.data = this.createEmptyData();
    this.initPerfectScroll();
    this.getAllCurrencyString();
    this.subscription();
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public ngAfterViewInit() {}

  private initPerfectScroll() {
    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };
  }

  private createEmptyData() {
    return {
      totalAmount: 0.0,
      subTotalAmount: 0,
      paymentDetails: [],
      total: 0.0,
      subTotal: 0,
      deliveryCharges: 0.0,
      subDeliveryCharges: 0,
      currencyText: 'EUR',
    };
  }

  private subscription() {
    this.paymentTypeDataStateSubscription = this.paymentTypeDataState.subscribe(
      (response: FormModel) => {
        this.appErrorHandler.executeAction(() => {
          if (!response || !response.formValue || !this.data) {
            this.data.deliveryCharges = 0;
            return;
          }

          this.data.deliveryCharges = Uti.fixToDigit(
            response.deliveryCharges,
            2
          );
          //use for determining current payment item editing
          this.data.paymentId = response.paymentId;
          this.buildOrderTotalSummaryData(response.formValue);

          this.outputData.emit(
            new FormOutputModel({
              isDirty: response.isDirty,
              isValid: response.isValid,
              formValue: {},
            })
          );
        });
      }
    );
    this.deliveryChargesStateSubscription = this.deliveryChargesState.subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (this.data && !isNil(response)) {
            const deliveryCharges = Uti.fixToDigit(response, 2);
            if (this.data.deliveryCharges != deliveryCharges) {
              this.data.deliveryCharges = deliveryCharges;
              this.calcualteSubTotalAmount();
            }
          }
        });
      }
    );
    this.articleTotalStateSubscription = this.articleTotalState.subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (
            this.data &&
            !isNil(response) &&
            !isEqual(this.articleTotal, response)
          ) {
            this.articleTotal = response;
            this.calcualteTotalAmount();
          } else if (!this.articleTotal) {
            this.data.totalAmount = 0;
            this.data.subTotalAmount = 0;
          }
        });
      }
    );
    this.mainCurrencyStateSubscription = this.mainCurrencyState.subscribe(
      (mainCurrency: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!mainCurrency) {
            this.data = this.createEmptyData();
            this.mainCurrency = null;
            return;
          }

          //only get when don't have mainCurrency
          if (isEqual(this.mainCurrency, mainCurrency)) return;

          this.setMainCurrency(mainCurrency);
        });
      }
    );
    this.cachedFailedDataStateSubcription =
      this.cachedFailedDataState.subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (response) {
            if (response.mainCurrency)
              this.setMainCurrency(response.mainCurrency);

            if (response.totalSummaryData)
              this.deliveryCharge = !response.totalSummaryData.isFreeShipping;
          }
        });
      });
    this.editOrderDataStateSubcription = this.editOrderDataState.subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (response && response.totalSummaryData)
            this.deliveryCharge = !response.totalSummaryData.isFreeShipping;
        });
      }
    );

    this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === DataEntryActions.DATA_ENTRY_RESET_ALL_FORM_DATA &&
          action.area == this.tabID
        );
      })
      .subscribe(() => {
        this.deliveryCharge = true;
      });
  }

  private setMainCurrency(mainCurrency: any) {
    this.mainCurrency = mainCurrency;
    if (this.data) this.data.currencyText = mainCurrency.currencyCode;

    this.getExchangeMoney();
  }

  private getAllCurrencyString(): Observable<any> {
    if (this.currencyStr) return Observable.of(this.currencyStr);

    return this.commonService
      .getListComboBox('' + ComboBoxTypeConstant.currency)
      .map((response: ApiResultResponse) => {
        if (
          !Uti.isResquestSuccess(response) ||
          !response.item.currency ||
          !response.item.currency.length
        )
          return null;

        this.currencyStr = '';
        for (let i = 0; i < response.item.currency.length; i++) {
          this.currencyStr += response.item.currency[i].textValue;
        }

        return this.currencyStr;
      });
  }

  public getExchangeMoney() {
    this.getAllCurrencyString().subscribe((currencyStr) => {
      if (
        !currencyStr ||
        !this.mainCurrency ||
        !this.mainCurrency.currencyCode ||
        !this.currencyStr
      )
        return;

      let systemCurrency: any;
      let systemCurrencyText: any;
      if (Configuration.PublicSettings.systemCurrency) {
        systemCurrency = Configuration.PublicSettings.systemCurrency.key;
        systemCurrencyText = Configuration.PublicSettings.systemCurrency.value;
      }

      let observableBatch = [];
      let willApplyMainToSystemCurrency = false;
      observableBatch.push(
        this.bloombergService.getExchangeMoney(
          this.mainCurrency.currencyCode,
          this.currencyStr.toLowerCase()
        )
      );
      if (
        systemCurrency &&
        systemCurrencyText &&
        systemCurrency !== this.mainCurrency.currencyCode
      ) {
        //Add conversion rate between SystemCurrency and current currency
        observableBatch.push(
          this.bloombergService.getExchangeMoney(
            systemCurrencyText,
            this.currencyStr.toLowerCase()
          )
        );
      } else {
        willApplyMainToSystemCurrency = true;
      }

      this.isGettingExchangeMoney = true;
      //getExchangeMoney
      Observable.forkJoin(observableBatch).subscribe(
        (results: Array<any>) => {
          this.appErrorHandler.executeAction(() => {
            this.isGettingExchangeMoney = false;

            if (results[0].item) {
              this.exchangeData.data = results[0].item;

              this.store.dispatch(
                this.xnCommonActions.setWidgetboxesInfo(
                  this.exchangeData.data,
                  this.ofModule
                )
              );

              if (willApplyMainToSystemCurrency) {
                this.systemExchangeData = {
                  currency: systemCurrency,
                  data: this.exchangeData.data,
                };
              } else if (results[1] && results[1].item) {
                this.systemExchangeData = {
                  currency: systemCurrency,
                  data: results[1].item,
                };
              }

              if (this.paymentDataForRebuildTotalSummary)
                this.buildOrderTotalSummaryData(
                  this.paymentDataForRebuildTotalSummary
                );
            } else {
              this.showDialogRecheckExchangeRate();
            }
          });
        },
        (error) => {
          console.log(error);
          this.showDialogRecheckExchangeRate();
        }
      );
    }); //getCurrencyString
  }

  private showDialogRecheckExchangeRate() {
    //Only show warning when subTotal is negative
    this.modalService.showMessageModal(
      new MessageModalModel({
        customClass: 'dialog-confirm-total',
        messageType: MessageModal.MessageType.error,
        modalSize: MessageModal.ModalSize.middle,
        showCloseButton: false,
        header: new MessageModalHeaderModel({
          text: 'Exchange Rate',
        }),
        body: new MessageModalBodyModel({
          isHtmlContent: true,
          content: [
            { key: '<p>' },
            {
              key: 'Modal_Message__Exchange_Rate_Server_Error_Recheck_Button',
            },
            { key: '</p>' },
          ],
        }),
        footer: new MessageModalFooterModel({
          buttonList: [
            new ButtonList({
              buttonType: MessageModal.ButtonType.primary,
              text: 'Recheck',
              //disabled: false,
              customClass: '',
              callBackFunc: () => {
                this.modalService.hideModal();
                this.getExchangeMoney();
              },
            }),
          ],
        }),
      })
    );
  }

  private calcualteTotalAmount(): void {
    const total: number = this.deliveryCharge
      ? this.articleTotal + parseFloat(this.data.deliveryCharges)
      : this.articleTotal;
    this.data.totalAmount = Uti.fixToDigit(total, 2);

    this.calculateCreditCardAmount();
    this.calcualteSubTotalAmount();
  }

  private calcualteSubTotalAmount(): void {
    const subtotalAmount: number =
      parseFloat(this.data.total) - parseFloat(this.data.totalAmount);
    this.signSubTotalAmountBoolean = subtotalAmount >= 0;
    this.data.subTotalAmount =
      this.getSignNumber(subtotalAmount) + Uti.fixToDigit(subtotalAmount, 2);
    this.store.dispatch(
      this.dataEntryActions.dataEntrySetOrderTotalSummary(
        cloneDeep(this.data),
        this.tabID
      )
    );
  }

  private getSignNumber(n: number): string {
    const sign: string = n && n > 0 ? '+' : '';
    return sign;
  }

  private paymentDataForRebuildTotalSummary: any;
  private buildOrderTotalSummaryData(paymentData: any) {
    if (!this.exchangeData.data) {
      this.paymentDataForRebuildTotalSummary = paymentData;
      return;
    }

    const newData = [];
    let total = 0;
    for (let i = 0, length = paymentData.length; i < length; i++) {
      const paymentItem = paymentData[i];
      if (!paymentItem.paymentTypeText) continue;

      let newItem = {
        paymentId: paymentItem.paymentId,
        paymentTypeId: paymentItem.paymentTypeId,
        paymentTypeGroup: paymentItem.paymentTypeGroup,
        name: paymentItem.paymentTypeText,
        cost: paymentItem.amount,
        currency: null,
        exchangeValue: null,
        exchangeRate: null,
        systemCurrency: null,
        systemConversionValue: null,
        amounts: null,
      };

      let currencyTextLowerCase = '';
      let exchangeValue: number = 0;
      let exchangeRateStr = '';
      let currencyText = paymentItem.currencyText;
      if (currencyText) {
        if (paymentItem.amount) {
          exchangeValue = this.exchangeCurrency(
            currencyText,
            paymentItem.amount
          );
          exchangeValue = +Uti.fixToDigit(exchangeValue, 2);
        }
        currencyTextLowerCase = currencyText.toLowerCase();
        exchangeRateStr = this.exchangeData.data[currencyTextLowerCase] || '';

        if (this.systemExchangeData) {
          newItem.systemCurrency = this.systemExchangeData.currency;
          if (this.systemExchangeData.data && currencyTextLowerCase)
            newItem.systemConversionValue =
              this.systemExchangeData.data[currencyTextLowerCase];
        }
      }

      newItem.currency = currencyText;
      newItem.exchangeValue = exchangeValue;
      newItem.exchangeRate = exchangeRateStr;

      //#region Amounts
      if (paymentItem.amounts && paymentItem.amounts.length) {
        newItem.amounts = [];
        paymentItem.amounts.forEach((amountItem) => {
          let newAmountItem = {
            index: amountItem.index,
            cost: amountItem.amount,
            currency: currencyText,
            exchangeValue: null,
            exchangeRate: exchangeRateStr,
            systemCurrency: newItem.systemCurrency,
            systemConversionValue: newItem.systemConversionValue,
          };

          if (currencyText && amountItem.amount) {
            let mountExchangeValue = this.exchangeCurrency(
              currencyText,
              amountItem.amount
            );
            mountExchangeValue = +Uti.fixToDigit(mountExchangeValue, 2);
            newAmountItem.exchangeValue = mountExchangeValue;
          }
          newItem.amounts.push(newAmountItem);
        });
      }
      //#endregion

      newData.push(newItem);
      total += exchangeValue;
    } //for
    this.data.total = Uti.fixToDigit(total, 2);
    this.data.paymentDetails = newData;
    this.data.isFreeShipping = !this.deliveryCharge;

    this.calcualteTotalAmount();

    this.paymentDataForRebuildTotalSummary = null;
  }

  private calculateCreditCardAmount() {
    let totalAmountWithoutCreditCard = 0;
    const paymentData = this.data.paymentDetails;
    for (let i = 0, length = paymentData.length; i < length; i++) {
      const paymentItem = paymentData[i];
      if (!paymentItem.name) continue;

      if (
        paymentItem.paymentTypeGroup !== PaymentTypeGroupEnum.CreditCard &&
        paymentItem.paymentTypeId !== PaymentTypeIdEnum.OpenInvoice
      ) {
        totalAmountWithoutCreditCard += paymentItem.exchangeValue;
      }
    }

    const orderTotalAmount = parseFloat(this.data.totalAmount);
    let creditCardAmount = 0;
    if (orderTotalAmount > totalAmountWithoutCreditCard) {
      creditCardAmount = orderTotalAmount - totalAmountWithoutCreditCard;
    } else {
      creditCardAmount = 0;
    }
    this.data.creditCardTotalAmount = creditCardAmount;
  }

  private exchangeCurrency(from: string, value: any): any {
    const mainCurrencyCode: string =
      this.data && this.data.currencyText ? this.data.currencyText : '';
    const exchangeData = Uti.calculateExchange(
      from.toLowerCase() + ',' + mainCurrencyCode.toLowerCase(),
      value,
      this.exchangeData.data
    );
    return exchangeData[mainCurrencyCode.toLowerCase()];
  }

  public chargeChange() {
    if (this.data) {
      this.data.isFreeShipping = !this.deliveryCharge;
      this.calcualteTotalAmount();
    }
    this.outputData.emit(
      new FormOutputModel({
        isDirty: true,
        isValid: true,
        formValue: {},
      })
    );
  }

  public deliveryChargeUpdate(status) {
    this.deliveryCharge = !status;
    this.chargeChange();
    this._changeDetectorRef.detectChanges();
  }

  public rebuildTranslateText() {}
}
