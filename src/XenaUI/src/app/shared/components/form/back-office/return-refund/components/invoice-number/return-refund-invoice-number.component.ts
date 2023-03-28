import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    AfterViewInit,
} from "@angular/core";
import { ReturnRefundService, AppErrorHandler } from "app/services";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import isNil from "lodash-es/isNil";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import {
    WidgetDetailActions,
    ReturnRefundActions,
    CustomAction,
} from "app/state-management/store/actions";
import {
    WidgetDetail,
    ReturnRefundInvoiceNumberModel,
    FormOutputModel,
    ReturnPaymentModel,
    ArticleOrder,
    WidgetKeyType,
} from "app/models";
import { Uti } from "app/utilities";
import { WidgetUtils } from "app/shared/components/widget/utils";
import { FormSaveEvenType } from "app/app.constants";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as backofficeReducer from "app/state-management/store/reducer/backoffice";
import * as returnRefundReducer from "app/state-management/store/reducer/return-refund";
import { BaseComponent, ModuleList } from "app/pages/private/base";
import { Router } from "@angular/router";

@Component({
    selector: "app-return-refund-invoice-number",
    styleUrls: ["./return-refund-invoice-number.component.scss"],
    templateUrl: "./return-refund-invoice-number.component.html",
})
export class ReturnRefundInvoiceNumberComponent
    extends BaseComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    private data: WidgetDetail;
    @Input() set widgetData(data: WidgetDetail) {
        if (data) {
            this.data = data;
        }
    }
    @Input() parentInstance: any = null;

    private refundPaymentData: FormOutputModel;
    private returnPaymentData: ReturnPaymentModel;
    private keepArticleOrders: Array<ArticleOrder>;
    private invoiceNewData: FormOutputModel;
    private isEnableConfirmBtn = false;
    private listWidgetIds = [];
    private widgetUtils: WidgetUtils = new WidgetUtils();
    private keepArticleOrdersValid = true;

    // private invoiceState: Observable<any>;
    // private invoiceStateSubscription: Subscription;

    private selectedEntityState: Observable<any>;
    private selectedEntityStateSubscription: Subscription;

    // private returnAndRefundInvoiceNumberDataState: Observable<any>;
    // private returnAndRefundInvoiceNumberDataStateSubscription: Subscription;

    // private invoiceNrState: Observable<any>;
    // private invoiceNrStateSubscription: Subscription;

    private refundPaymentDataState: Observable<FormOutputModel>;
    private refundPaymentDataStateSubscription: Subscription;

    private returnPaymentDataState: Observable<ReturnPaymentModel>;
    private returnPaymentDataStateSubscription: Subscription;

    private keepArticleOrdersState: Observable<Array<ArticleOrder>>;
    private keepArticleOrdersStateSubscription: Subscription;
    private keepArticleOrdersValidState: Observable<boolean>;
    private keepArticleOrdersValidStateSubscription: Subscription;

    private invoiceNewDataState: Observable<FormOutputModel>;
    private invoiceNewDataStateSubscription: Subscription;

    private selectedBackOfficeEntityState: Observable<any>;
    private selectedBackOfficeEntityStateSubscription: Subscription;

    private returnRefundServiceSubscription: Subscription;
    private requestConfirmSubscription: Subscription;

    public allowInputCharacters = [".", ";", "-"];
    public dontExistSearchData = false;
    public isRenderForm: boolean;
    public listComboBox: any;
    public invoiceForm: FormGroup;
    public invoiceNumberData = new ReturnRefundInvoiceNumberModel();

    constructor(
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private appErrorHandler: AppErrorHandler,
        private returnRefundActions: ReturnRefundActions,
        private widgetDetailActions: WidgetDetailActions,
        private toasterService: ToasterService,
        private returnRefundService: ReturnRefundService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router
    ) {
        super(router);

        // this.invoiceState = store.select(state => returnRefundReducer.getReturnRefundState(state, this.ofModule.moduleNameTrim).invoiceNumberData);
        this.selectedEntityState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedEntity
        );
        // this.invoiceNrState = store.select(state => returnRefundReducer.getReturnRefundState(state, this.ofModule.moduleNameTrim).invoiceNumberData);
        this.refundPaymentDataState = store.select(
            (state) =>
                returnRefundReducer.getReturnRefundState(
                    state,
                    this.ofModule.moduleNameTrim
                ).refundPaymentData
        );
        this.returnPaymentDataState = store.select(
            (state) =>
                returnRefundReducer.getReturnRefundState(
                    state,
                    this.ofModule.moduleNameTrim
                ).returnPaymentData
        );
        this.keepArticleOrdersState = store.select(
            (state) =>
                returnRefundReducer.getReturnRefundState(
                    state,
                    this.ofModule.moduleNameTrim
                ).keepArticleOrders
        );
        this.keepArticleOrdersValidState = store.select(
            (state) =>
                returnRefundReducer.getReturnRefundState(
                    state,
                    this.ofModule.moduleNameTrim
                ).keepArticleOrdersValid
        );
        this.invoiceNewDataState = store.select(
            (state) =>
                returnRefundReducer.getReturnRefundState(
                    state,
                    this.ofModule.moduleNameTrim
                ).invoiceNewData
        );
        this.selectedBackOfficeEntityState = store.select(
            (state) =>
                backofficeReducer.getBackofficeState(
                    state,
                    ModuleList.Backoffice.moduleNameTrim
                ).selectedEntity
        );
        // this.returnAndRefundInvoiceNumberDataState = store.select(state => returnRefundReducer.getReturnRefundState(state, this.ofModule.moduleNameTrim).invoiceNumberData);
    }

    public ngOnInit() {
        this.initForm();
        this.isRenderForm = true;
        this.setWidgetDataTypeValues([
            "IdPerson",
            "IdSalesOrder",
            "InvoiceNr",
            "MEDIACODE",
            "IdCountryLanguage",
        ]);
        this.store.dispatch(
            this.returnRefundActions.updateInvoiceNumberData(
                this.invoiceNumberData,
                this.ofModule
            )
        );
        this.subscribe();
    }

    public ngOnDestroy() {
        this.invoiceNumberData = new ReturnRefundInvoiceNumberModel();
        this.store.dispatch(
            this.returnRefundActions.updateInvoiceNumberData(
                this.invoiceNumberData,
                this.ofModule
            )
        );
        this.store.dispatch(
            this.widgetDetailActions.clearRequestReload(this.ofModule)
        );
        Uti.unsubscribe(this);
    }

    public makeContextMenu(data?: any) {
        if (!this.parentInstance || !this.parentInstance.makeContextMenu) {
            return [];
        }
        return this.parentInstance.makeContextMenu(data);
    }

    private checkToEnableConfirmBtn() {
        const hasInvoiceNumberData = !isNil(this.invoiceNumberData);
        // const hasReturnData = !isNil(this.returnPaymentData);
        // const hasRefundData = this.refundPaymentData && this.refundPaymentData.formValue;
        const hasKeepArticleOrders = !isNil(this.keepArticleOrders);
        const hasNewInvoice = !!(
            this.invoiceNewData && this.invoiceNewData.isDirty
        );

        // this.isEnableConfirmBtn = hasInvoiceNumberData && (hasReturnData || hasRefundData || hasKeepArticleOrders || hasNewInvoice);
        // Apply new behavior
        this.isEnableConfirmBtn =
            hasInvoiceNumberData &&
            this.keepArticleOrdersValid &&
            (hasKeepArticleOrders || hasNewInvoice);
        if (this.invoiceNumberData) {
            this.invoiceNumberData.enableConfirmButton =
                this.isEnableConfirmBtn;
            this.store.dispatch(
                this.returnRefundActions.updateInvoiceNumberData(
                    this.invoiceNumberData,
                    this.ofModule
                )
            );
        }
    }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {
        //this.registerControlEvent();
    }

    private subscribe() {
        this.refundPaymentDataStateSubscription =
            this.refundPaymentDataState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.refundPaymentData = data;
                    this.checkToEnableConfirmBtn();
                });
            });

        this.returnPaymentDataStateSubscription =
            this.returnPaymentDataState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.returnPaymentData = data;
                    this.checkToEnableConfirmBtn();
                });
            });

        this.keepArticleOrdersStateSubscription =
            this.keepArticleOrdersState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.keepArticleOrders = data;
                    this.checkToEnableConfirmBtn();
                });
            });

        this.keepArticleOrdersValidStateSubscription =
            this.keepArticleOrdersValidState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.keepArticleOrdersValid = data;
                    this.checkToEnableConfirmBtn();
                });
            });

        this.invoiceNewDataStateSubscription =
            this.invoiceNewDataState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.invoiceNewData = data;
                    this.checkToEnableConfirmBtn();
                });
            });

        this.requestConfirmSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ReturnRefundActions.REQUEST_CONFIRM &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.submit();
                });
            });

        this.selectedBackOfficeEntityStateSubscription =
            this.selectedBackOfficeEntityState.subscribe(
                (selectedBackOfficeEntityState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (
                            selectedBackOfficeEntityState &&
                            (selectedBackOfficeEntityState["invoiceNr"] ||
                                selectedBackOfficeEntityState["InvoiceNr"]) &&
                            this.invoiceForm
                        ) {
                            this.invoiceForm.controls["invoiceNumber"].setValue(
                                selectedBackOfficeEntityState["invoiceNr"] ||
                                    selectedBackOfficeEntityState["InvoiceNr"]
                            );
                            this.go();
                        }
                    });
                }
            );

        this.selectedEntityStateSubscription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !this.invoiceForm ||
                        !this.invoiceForm.controls ||
                        !selectedEntityState
                    )
                        return;
                    const invoiceNr = selectedEntityState["invoiceNr"];
                    this.invoiceForm.controls["invoiceNumber"].setValue(
                        invoiceNr || ""
                    );
                });
            });
        // this.returnAndRefundInvoiceNumberDataStateSubscription = this.returnAndRefundInvoiceNumberDataState.subscribe((invoiceNumberData: ReturnRefundInvoiceNumberModel) => {
        //     this.appErrorHandler.executeAction(() => {
        //         this.invoiceNumberData.hasArticleInvoiceError = invoiceNumberData.hasArticleInvoiceError;
        //     })
        // });
    }

    private getInvoiceNumberDetail(callbackFunc?) {
        if (!this.invoiceForm || !this.invoiceForm.value) return;
        this.invoiceForm.updateValueAndValidity();
        const invoiceNr = this.invoiceForm.value["invoiceNumber"];
        let personNr = "",
            mediaCode = "";
        if (!invoiceNr) {
            let barcode = this.invoiceForm.value["barcode"];
            if (barcode) {
                barcode = barcode.split(";");
                if (barcode && barcode.length === 3) {
                    personNr = barcode[1];
                    mediaCode = barcode[2];
                }
            }
        }
        if (!invoiceNr && !personNr && !mediaCode) return;
        this.returnRefundServiceSubscription = this.returnRefundService
            .getWidgetInfoByIds(personNr, invoiceNr, mediaCode)
            .subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    // then, if there is return data
                    if (callbackFunc) {
                        callbackFunc();
                    } else {
                        if (
                            !data ||
                            !data.data ||
                            !data.data.length ||
                            !data.data[0] ||
                            !data.data[0].length ||
                            !data.data[0][0]
                        ) {
                            this.dontExistSearchData = true;
                            this.resetWidgetIdData();
                        } else {
                            const _data = data.data[0][0];
                            this.dontExistSearchData =
                                !_data || !_data.IdPerson;
                            this.invoiceNumberData = {
                                idPerson: _data.IdPerson,
                                isSalesOrderInvoice: _data.IdSalesOrderInvoice,
                                isSalesOrder: _data.IdSalesOrder,
                                invoiceNr: _data.InvoiceNr,
                                idSalesOrderReturn: null,
                                invoiceDetailData: null,
                                mediaCode: _data.MEDIACODE,
                                idCountrylanguage: _data.IdCountrylanguage,
                                enableConfirmButton: false,
                                hasArticleInvoiceError: false,
                            };
                            this.setWidgetIdData(data);
                            this.checkToEnableConfirmBtn();
                        }
                        this.store.dispatch(
                            this.returnRefundActions.updateInvoiceNumberData(
                                this.invoiceNumberData,
                                this.ofModule
                            )
                        );
                    }
                });
            });
    }

    public submit() {
        this.store.dispatch(this.returnRefundActions.submitForm(this.ofModule));
        if (!this.invoiceNumberData || !this.invoiceNumberData.invoiceNr) {
            this.toasterService.pop(
                "warning",
                "Warning",
                "Please input invoice number"
            );
            return;
        }
        if (!this.isEnableConfirmBtn) {
            this.toasterService.pop(
                "warning",
                "Warning",
                "Please complete data of each widget"
            );
            return;
        }
        this.saveData();
    }

    private setWidgetIdData(data: any) {
        if (
            !data ||
            !data.data ||
            !data.data.length ||
            !data.data[0] ||
            !data.data[0].length ||
            !data.data[0][0]
        )
            return;
        data = data.data[0][0];

        for (let item in data) {
            this.listWidgetIds.push(item);
            this.setWidgetDataTypeValue(item, data[item]);
        }
        this.store.dispatch(
            this.widgetDetailActions.requestReload(this.ofModule)
        );
    }

    private setWidgetDataTypeValues(propertyNames: Array<string>) {
        for (const item of propertyNames) {
            this.setWidgetDataTypeValue(item, "");
        }
    }

    private setWidgetDataTypeValue(propertyName: string, data: any) {
        this.widgetUtils.updateWidgetDataTypeValues(
            this.ofModule.moduleNameTrim,
            propertyName,
            data,
            WidgetKeyType.Main
        );
        WidgetUtils.widgetDataTypeValues[
            this.ofModule.moduleNameTrim
        ].renderFor = null;
    }

    private resetWidgetIdData() {
        if (!this.listWidgetIds || !this.listWidgetIds.length) {
            return;
        }
        const widgetUtils: WidgetUtils = new WidgetUtils();
        for (let item of this.listWidgetIds) {
            widgetUtils.updateWidgetDataTypeValues(
                this.ofModule.moduleNameTrim,
                item,
                "",
                WidgetKeyType.Main
            );
        }
        WidgetUtils.widgetDataTypeValues[
            this.ofModule.moduleNameTrim
        ].renderFor = null;
        this.store.dispatch(
            this.widgetDetailActions.requestReload(this.ofModule)
        );
        this.listWidgetIds = [];
    }

    private saveData() {
        if (!this.valid()) {
            return;
        }
        this.returnRefundServiceSubscription = this.returnRefundService
            .saveWidgetData(this.prepareSaveData())
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    if (response) {
                        if (
                            response.eventType == FormSaveEvenType.Successfully
                        ) {
                            this.toasterService.pop(
                                "success",
                                "Success",
                                "Invoice Data is saved successfully"
                            );
                            this.reset();
                            this.store.dispatch(
                                this.returnRefundActions.updateInvoiceNumberData(
                                    null,
                                    this.ofModule
                                )
                            );
                        } else {
                            // log warning for error message from return SQL
                            if (response.sqlStoredMessage) {
                                console.warn(response.sqlStoredMessage);
                            }
                            this.toasterService.pop(
                                "error",
                                "Failed",
                                "Invoice Data cannot be saved"
                            );
                        }
                    }
                });
            });
    }

    private valid(): boolean {
        if (
            this.refundPaymentData &&
            !this.refundPaymentData.isValid &&
            !this.refundPaymentData.formValue["dontRefund"]
        ) {
            this.toasterService.pop(
                "warning",
                "Warning",
                "Please complete data of the payment form"
            );
            return false;
        }

        if (!this.keepArticleOrdersValid) {
            this.toasterService.pop(
                "warning",
                "Warning",
                "Please complete data of the Article widget"
            );
            return false;
        }

        if (
            this.invoiceNewData &&
            this.invoiceNewData.isDirty &&
            !this.invoiceNewData.isValid
        ) {
            this.toasterService.pop(
                "warning",
                "Warning",
                "Please complete data of the New Invoice widget"
            );
            return false;
        }
        return true;
    }

    private prepareSaveData() {
        const model = this.invoiceForm.value;
        const result = {
            IdRepSalesOrderReturnReason: null,
            IdSalesOrderInvoice: this.invoiceNumberData.isSalesOrderInvoice,
            IdSalesOrderReturn: null,
            IsNewInvoice: 0,
            Notes: "",
            IsActive: 1,
            IsAutoSave: model.autoSave ? 1 : 0,
            IsAutoBroken: model.autoBroken ? 1 : 0,
            ReturnAndRefundOrderPayments: null,
            OrderReturnArticles: null,
        };

        if (this.returnPaymentData) {
            if (this.returnPaymentData.returnNotes) {
                result.Notes +=
                    "Return Note: " + this.returnPaymentData.returnNotes + ". ";
            }
            result.IdRepSalesOrderReturnReason =
                this.returnPaymentData.returnReason;
        }

        if (this.refundPaymentData && this.refundPaymentData.formValue) {
            const paymentType = this.refundPaymentData.formValue;
            if (paymentType.dontRefund) {
                result.ReturnAndRefundOrderPayments = [
                    {
                        Reason: "Refund Reason: " + paymentType.reason + ".",
                        DontRefund: "1",
                    },
                ];
            } else {
                result.ReturnAndRefundOrderPayments = [
                    {
                        Reason: "Refund Reason: " + paymentType.reason + ".",
                        IdSalesOrderReturnReimbursement: null,
                        IdSalesOrderReturn: null,
                        IdSharingPaymentGateway: null,
                        IdSharingCreditCard: null,
                        IdSharingPaymentCheque: null,
                        IdRepPaymentsMethods: paymentType.paymentTypeId,
                        IdRepCurrencyCode: paymentType.currency,
                        IdRepCreditCardType: paymentType.issuer,
                        CreditCardHolderName: "default",
                        CreditCardNr: paymentType.creditCardNr,
                        CreditCardValidMonth: paymentType.validThruMonth,
                        CreditCardValidYear: paymentType.validThruYear,
                        CreditCardCVV: paymentType.cvc,
                        ChequeCodeline: paymentType.codeline,
                        ChequeNr: null,
                        ChequeType: null,
                        ChequeCreditedDate:
                            isNil(paymentType.year) &&
                            isNil(paymentType.month) &&
                            isNil(paymentType.day)
                                ? null
                                : paymentType.year +
                                  "." +
                                  paymentType.month +
                                  "." +
                                  paymentType.day,
                        ChequeRejectDate: Uti.getCurrentDate("."),
                        Amount: paymentType.amount,
                    },
                ];
            }
        }

        if (this.keepArticleOrders && this.keepArticleOrders.length) {
            result.OrderReturnArticles = [];
            this.keepArticleOrders.forEach((item) => {
                if (!item) return;
                result.OrderReturnArticles.push({
                    IdSalesOrderReturnArticle: null,
                    IdSalesOrderReturn: null,
                    IdSalesOrderArticles: item.idSalesOrderArticles,
                    ControlAmount: item.quantity,
                    QtyBackToWarehouse: +item.back,
                    QtyDefect: +item.defect,
                    QtyKeep: +item.keep,
                    IsSetArticle: "0",
                    IsActive: item.isActive,
                    IsDeleted: "0",
                });
            });
        }
        if (
            this.invoiceNewData &&
            this.invoiceNewData.formValue &&
            this.invoiceNewData.isDirty
        ) {
            result["NewInvoiceAmount"] = this.invoiceNewData.formValue.amount;
            result["NewInvoiceTotalAmount"] =
                this.invoiceNewData.formValue.totalAmount;
            result["NewInvoiceCurrency"] =
                this.invoiceNewData.formValue.currency;
            result["NewInvoiceFreeShipping"] = this.invoiceNewData.formValue
                .isFreeShipping
                ? "1"
                : "0";
            result["NewInvoiceItemData"] =
                this.invoiceNewData.formValue.gridData &&
                this.invoiceNewData.formValue.gridData.length
                    ? this.invoiceNewData.formValue.gridData
                    : [];
        }

        return result;
    }

    private initForm() {
        this.invoiceForm = this.formBuilder.group({
            invoiceNumber: null,
            barcode: null,
            autoSave: false,
            autoBroken: false,
        });
        this.invoiceForm["submitted"] = false;
    }

    public go() {
        const isAutoSave = this.invoiceForm.controls["autoSave"].value;
        const isAutoBroken = this.invoiceForm.controls["autoBroken"].value;
        if (isAutoSave || isAutoBroken) {
            this.getInvoiceNumberDetail(() => this.saveData());
        } else {
            this.getInvoiceNumberDetail();
        }
    }

    public reset() {
        const isAutoSave = this.invoiceForm.controls["autoSave"].value;
        const isAutoBroken = this.invoiceForm.controls["autoBroken"].value;
        Uti.resetValueForForm(this.invoiceForm);
        this.invoiceForm.controls["autoSave"].setValue(isAutoSave);
        this.invoiceForm.controls["autoBroken"].setValue(isAutoBroken);
        this.resetWidgetIdData();
        this.store.dispatch(
            this.returnRefundActions.updateInvoiceNumberData(
                null,
                this.ofModule
            )
        );
        this.store.dispatch(
            this.returnRefundActions.resetAllEditableForm(this.ofModule)
        );
        this.invoiceNumberData = new ReturnRefundInvoiceNumberModel();
        this.store.dispatch(
            this.returnRefundActions.updateInvoiceNumberData(
                this.invoiceNumberData,
                this.ofModule
            )
        );
    }

    public confirm() {
        this.submit();
    }

    // TODO: will active later
    //private registerControlEvent() {
    //    this.registerControlEnterEvent('#return-refund-invoice-number');
    //    this.registerControlEnterEvent('#return-refund-barcode');
    //}

    //private registerControlEnterEvent(controlName: string) {
    //    const control = $(controlName);
    //    if (!control || !control.length) return;
    //    control.keydown(($event) => {
    //        if (!($event.which === 13 || $event.keyCode === 13)) { return; }
    //        //this.go();
    //    });
    //}
}
