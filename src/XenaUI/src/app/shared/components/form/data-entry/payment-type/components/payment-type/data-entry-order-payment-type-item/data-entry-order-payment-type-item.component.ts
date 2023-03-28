import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ViewChildren,
    QueryList,
    ChangeDetectorRef,
    AfterViewInit,
    ElementRef,
} from "@angular/core";
import {
    AppErrorHandler,
    PropertyPanelService,
    ValidationService,
    ModalService,
    HotKeySettingService,
    DataEntryProcess,
} from "app/services";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    FormArray,
} from "@angular/forms";
import cloneDeep from "lodash-es/cloneDeep";
import pullAllBy from "lodash-es/pullAllBy";
import filter from "lodash-es/filter";
import { Uti, LocalStorageHelper, LocalStorageProvider } from "app/utilities";
import {
    Configuration,
    MessageModal,
    LocalStorageKey,
    PaymentTypeGroupEnum,
    PaymentTypeIdEnum,
    BadChequeEnum,
} from "app/app.constants";
import { WjInputMask } from "wijmo/wijmo.angular2.input";
import { ControlFocusComponent } from "app/shared/components/form";
import {
    FormGroupChild,
    MessageModel,
    MessageModalModel,
    MessageModalHeaderModel,
    MessageModalBodyModel,
    MessageModalFooterModel,
    ButtonList,
} from "app/models";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { AppState } from "app/state-management/store";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";
import { BaseComponent, ModuleList } from "app/pages/private/base";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import {
    CustomAction,
    ProcessDataActions,
} from "app/state-management/store/actions";
import { DatePickerComponent } from "app/shared/components/xn-control";
import { parse, addMonths, differenceInMonths } from "date-fns/esm";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";

@Component({
    selector: "data-entry-order-payment-type-item",
    templateUrl: "./data-entry-order-payment-type-item.component.html",
    styleUrls: ["./data-entry-order-payment-type-item.component.scss"],
})
export class DataEntryPaymentTypeItemComponent
    extends BaseComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public PaymentTypeGroupEnum = PaymentTypeGroupEnum;
    public PaymentTypeIdEnum = PaymentTypeIdEnum;
    public listComboBox: any;
    public dataEntryPaymentTypeItemForm: FormGroup;
    public globalDateFormat: string = null;
    public validThruMaskString = "00/00";
    public cvcMaskString = "000";
    public creditCardMaskString = "0000 0000 0000 0000";
    private displayConfig = {
        1: ["amount", "currency", "paymentDate"], //group Cash
        2: ["currency", "codeline", "amounts", "paymentDate"], //group Cheque
        3: [
            "creditCardAmount",
            "currency",
            "issuer",
            "creditCardNr",
            "validThru",
            "cvc",
            "creditCardAmounts",
            "paymentDate",
        ], //Group Credit Card
        4: ["currency", "amount", "postBankName", "paymentDate"], //group PostBank
        "": [],
    };

    @ViewChild("payementTypeCtl") payementTypeCtl: AngularMultiSelect;
    @ViewChild("issuerCtl") issuerCtl: AngularMultiSelect;
    @ViewChild("currencyCtl") currencyCtl: AngularMultiSelect;
    @ViewChild("focusControl") focusControl: ControlFocusComponent;
    @ViewChild("creditCardNr") creditCardNrCtrl: WjInputMask;
    @ViewChild("validThru") validThru: WjInputMask;
    @ViewChild("cvcCtrl") cvcCtrl: WjInputMask;
    @ViewChild("codelineCtrl") codelineCtrl: ElementRef;
    @ViewChildren("chequeDate") chequesDate: QueryList<DatePickerComponent>;
    @ViewChildren("amount") amountCtrls: QueryList<ElementRef>; //used to set focus for Cash, Cheque, CreditCard
    @ViewChild("creditCardCustomMonthCtrl")
    creditCardCustomMonthCtrl: ElementRef;
    @ViewChild("postBankNameCtl") postBankNameCtl: AngularMultiSelect;

    private outputModel: {
        submitResult?: boolean;
        formValue: any;
        isValid?: boolean;
        isDirty?: boolean;
        returnID?: string;
    };
    public perfectScrollbarConfig: any;
    private dataEntryPaymentTypeItemFormValueChangesSubscription: Subscription;
    private chequesDateChangesSubscription: Subscription;

    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;

    private dispatcherSubscription: Subscription;
    private paymentTypeSubscription: Subscription;
    private currencySubscription: Subscription;

    @Input() isInGroup?: boolean = true;
    @Input() localizer: any = {};

    private _information: any;

    @Input() set initInformation(information: any) {
        this._information = information;
        this.initForm();
    }

    @Output() initFormGroup: EventEmitter<FormGroupChild> = new EventEmitter();

    @Input() masterData: any;
    @Input() layoutViewMode: any;

    @Input() data: any;
    @Input() parentComponent: any;
    @Input() index: number;

    @Input() ascIndex: number;
    @Input() maxIndex: number;
    @Input() tabID: string;
    @Input() isShowAddPaymentButton = false;
    @Input() disabledRemoveButton = false;

    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @Output() updateData: EventEmitter<any> = new EventEmitter();
    @Output() changePaymentType: EventEmitter<any> = new EventEmitter();
    @Output() outputRemove: EventEmitter<any> = new EventEmitter();
    @Output() onAddPayment: EventEmitter<any> = new EventEmitter();
    @Output() onCurrencyChanged: EventEmitter<any> = new EventEmitter();

    private isPaymentTypeTyping = false;
    public preventFocus: Promise<any>;
    private currentAmountIndex: number = undefined;
    private amountTyping: boolean;
    private textTyping: boolean;
    private textChanged: boolean;
    private dateTyping: boolean;
    private currencyTyping: boolean;
    private postBankNameTyping: boolean;
    private allowShowConfirmTotalAmount = false;
    private preventCallEventUpdateData = false;
    private Math: any;
    private previoursFormValue: any;
    public paymentTypeCtrlAutoExpandSelection: boolean = false;

    constructor(
        private consts: Configuration,
        private appErrorHandler: AppErrorHandler,
        private formBuilder: FormBuilder,
        private ref: ChangeDetectorRef,
        private store: Store<AppState>,
        private propertyPanelService: PropertyPanelService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router,
        private modalService: ModalService,
        public hotKeySettingService: HotKeySettingService,
        private toasterService: ToasterService,
        private dataEntryProcess: DataEntryProcess
    ) {
        super(router);

        this.Math = Math;
        this.globalPropertiesState = this.store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
        this.initData();
        this.initPerfectScroll();
        this.subscription();
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        Uti.unsubscribe(this);

        this.currentPaymentTypeId = null;
        this.currentPaymentTypeGroup = null;
        //set object = null
        this.previoursFormValue = null;
        this.listComboBox = null;
        this.dataEntryPaymentTypeItemForm = null;
        this._information = null;
        this.preventFocus = null;
        this.perfectScrollbarConfig = null;
        //-----------------------
        //set array length = 0

        //-----------------------
        //set object = {}
    }

    public ngAfterViewInit() {
        this.registerFormValueChange();

        if (!this.isBackofficeOrders()) {
            setTimeout(() => {
                this.focusPaymentType();
            }, 300);
        }
    }

    //#region Init Data
    private resetData() {
        this.resetForm();

        this.currentPaymentTypeId = null;
        this.currentPaymentTypeGroup = null;
        this.data.headerText = "Payment";
        this.data.mainCurrencyCode = "";
        this.data.idMainCurrencyCode = "";
        this.data.currencyId = null;
        this.data.currencyText = "";
        this.data.currency = null;
        this.data.paymentTypeGroup = null;
        this.data.paymentTypeId = null;
        this.data.paymentTypeText = "";

        if (this.payementTypeCtl) {
            this.payementTypeCtl.text = "";
            this.payementTypeCtl.selectedValue = null;
            this.payementTypeCtl.refresh();
            setTimeout(() => {
                this.payementTypeCtl.focus();
            }, 300);
        }
    }

    private subscription() {
        this.dispatcherSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE &&
                    action.module.idSettingsGUI ==
                        this.ofModule.idSettingsGUI &&
                    action.area == this.tabID
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.dataEntryPaymentTypeItemForm["submitted"] = true;
                    this.dataEntryPaymentTypeItemForm.updateValueAndValidity();
                });
            });

        this.globalPropertiesStateSubscription =
            this.globalPropertiesState.subscribe((globalProperties: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (globalProperties && globalProperties.length) {
                        this.globalDateFormat =
                            this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                                globalProperties
                            );
                    }
                });
            });
    }

    private initForm() {
        if (this.isInGroup || !this._information) return;

        setTimeout(() => {
            if (!this.dataEntryPaymentTypeItemForm) {
                this.initForm();
                return;
            }

            if (
                this._information &&
                this._information.data &&
                this._information.listComboBox &&
                this._information.parentFormGroup &&
                this._information.formConfig
            ) {
                if (
                    !this._information.parentFormGroup.contains(
                        "paymentTypeForm"
                    )
                )
                    this._information.parentFormGroup.addControl(
                        "paymentTypeForm",
                        this.dataEntryPaymentTypeItemForm
                    );
                else
                    this._information.parentFormGroup.controls[
                        "paymentTypeForm"
                    ] = this.dataEntryPaymentTypeItemForm;

                this.initFormGroup.emit({
                    form: this.dataEntryPaymentTypeItemForm,
                    name: "paymentTypeForm",
                });
            }
        }, 200);
    }

    private initPerfectScroll() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false,
        };
    }

    private initData() {
        this.dataEntryPaymentTypeItemForm = this.formBuilder.group({
            paymentTypeId: ["", Validators.required],
            paymentTypeText: null,
            paymentTypeGroup: null, //1: Cash, 2: Cheque, 3: CreditCard, 4: PostBank
            currency: [
                this.data && this.data.idMainCurrencyCode
                    ? this.data.idMainCurrencyCode
                    : "",
                Validators.required,
            ],

            //Cash
            amount: ["", Validators.required],

            //Cheque
            codeline: ["", Validators.required],
            amounts: this.formBuilder.array([this.initAmountCheque()]),

            //CreditCard
            issuer: ["", Validators.required],
            creditCardNr: [
                "",
                Validators.required,
                ValidationService.creditCardValidator,
            ],
            validThru: [
                "",
                Validators.required,
                ValidationService.validThruValidator,
            ],
            cvc: [""],
            creditCardOption: ["", Validators.required],
            creditCardCustomMonth: null,
            creditCardAmounts: this.formBuilder.array([
                this.initAmountCreditCard(),
            ]),
            creditCardAmount: ["", Validators.required],

            //PostBank
            postBankName: ["", Validators.required],

            // For All
            paymentDate: [
                "",
                this.isNotOrderDataEntryModule() ? Validators.required : null,
            ],
        });

        this.dataEntryPaymentTypeItemForm["submitted"] = false;

        this.listComboBox = {
            issuers: [...this.createFakeIssuerData()],
        };

        if (!this.data.creditCardOptionsConfig) {
            this.data.creditCardOptionsConfig = {
                //'1': { disabled: false },//Default
                "3": { disabled: false }, //3 Months
                "6": { disabled: false }, //6 Months
                "12": { disabled: false }, //12 Months
                "0": { disabled: false }, //Custom
            };
        }

        this.restorePreviousFormValueOnload();
    }

    private initAmountCheque(isRequireDate?: boolean): FormGroup {
        let group = {};
        if (isRequireDate) {
            group = {
                amount: ["", Validators.required],
                chequeDate: [new Date(), Validators.required],
            };
        } else {
            group = {
                amount: ["", Validators.required],
                chequeDate: [new Date()],
            };
        }
        return this.formBuilder.group(group);
    }

    private initAmountCreditCard(): FormGroup {
        const group = {
            amount: ["", Validators.required],
            creditDate: [new Date(), Validators.required],
        };
        return this.formBuilder.group(group);
    }

    private createFakeIssuerData(): Array<any> {
        return [
            { textValue: "Visa", idValue: 1 },
            { textValue: "MasterCard", idValue: 2 },
            { textValue: "Maestro", idValue: 3 },
            { textValue: "JCB", idValue: 4 },
        ];
    }
    //#endregion

    //#region Event: Form
    public restoreWithKeepPaymentType(newPaymentType: any) {
        this.setPayementTypeCtl();
        this.setCurrencyCtl(newPaymentType);
    }

    private restorePreviousFormValueOnload() {
        if (this.data.formValue) {
            this.previoursFormValue = Object.assign({}, this.data.formValue);

            //auto choose payment type
            this.setPayementTypeCtl();
        }
    }

    public restorePreviousFormValue() {
        if (!this.data || !this.previoursFormValue) return;

        const formValue = Object.assign({}, this.previoursFormValue);

        for (let controlName in formValue) {
            let control =
                this.dataEntryPaymentTypeItemForm.controls[controlName];
            if (!control) continue;

            switch (formValue.paymentTypeGroup) {
                case PaymentTypeGroupEnum.Cash:
                    break;
                case PaymentTypeGroupEnum.Cheque:
                    if (controlName === "amounts") {
                        let formArray = <FormArray>(
                            this.dataEntryPaymentTypeItemForm.controls[
                                "amounts"
                            ]
                        );

                        for (let index in formValue["amounts"]) {
                            if (index == "0") {
                                if (formArray.controls.length) {
                                    formArray.controls[0]["controls"][
                                        "amount"
                                    ].setValue(
                                        formValue["amounts"][index]["amount"]
                                    );
                                    formArray.controls[0]["controls"][
                                        "chequeDate"
                                    ].setValue(
                                        formValue["amounts"][index][
                                            "chequeDate"
                                        ]
                                    );
                                }
                            } else {
                                const formGroup = this.initAmountCheque(true);
                                formGroup.controls["amount"].setValue(
                                    formValue["amounts"][index]["amount"]
                                );
                                formGroup.controls["chequeDate"].setValue(
                                    formValue["amounts"][index]["chequeDate"]
                                );
                                formArray.push(formGroup);
                            }
                        } //for
                    }
                    break;
                case PaymentTypeGroupEnum.CreditCard:
                    if (controlName === "creditCardAmounts") {
                        let formArray = <FormArray>(
                            this.dataEntryPaymentTypeItemForm.controls[
                                "creditCardAmounts"
                            ]
                        );

                        for (let index in formValue["creditCardAmounts"]) {
                            const formGroup = this.initAmountCreditCard();
                            formGroup.controls["amount"].setValue(
                                formValue["creditCardAmounts"][index]["amount"]
                            );
                            formGroup.controls["creditDate"].setValue(
                                formValue["creditCardAmounts"][index][
                                    "creditDate"
                                ]
                            );
                            formArray.push(formGroup);
                        } //for
                    }
                    break;
            } //switch

            if (
                controlName !== "amounts" &&
                controlName !== "creditCardAmounts"
            ) {
                control.setValue(formValue[controlName]);
            }
        } //for

        this.ref.detectChanges();
        this.previoursFormValue = null;

        setTimeout(() => {
            if (this.dataEntryPaymentTypeItemForm) {
                this.dataEntryPaymentTypeItemForm.markAsPristine();
                this.dataEntryPaymentTypeItemForm.markAsUntouched();
            }
        }, 200);
    }

    private registerFormValueChange() {
        this.chequesDateChangesSubscription = this.chequesDate.changes
            .debounceTime(300)
            .subscribe((r) => {
                this.appErrorHandler.executeAction(() => {
                    this.focusControl.initControl(true);
                });
            });

        this.dataEntryPaymentTypeItemFormValueChangesSubscription =
            this.dataEntryPaymentTypeItemForm.valueChanges
                .debounceTime(300)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        if (
                            data.paymentTypeText != null &&
                            !this.preventCallEventUpdateData
                        ) {
                            this.reUpdateData();
                        }
                    });
                });
    }

    private reUpdateData() {
        const formValue = this.dataEntryPaymentTypeItemForm.value;
        let valid: boolean = false;

        if (formValue.paymentTypeId) {
            this.data.paymentTypeId = formValue.paymentTypeId;
            this.data.paymentTypeText = formValue.paymentTypeText;
            this.data.currency = formValue.currency;
            this.data.paymentDate = formValue.paymentDate;

            valid = this.validatePaymentForm();

            switch (this.data.paymentTypeGroup) {
                case PaymentTypeGroupEnum.Cash: // Cash
                    this.data.amount = formValue.amount;
                    break;
                case PaymentTypeGroupEnum.Cheque: // Cheque
                    this.data.codeline = formValue.codeline;

                    this.data.amounts = [];
                    let chequeTotal = 0,
                        chequeAmount = 0;
                    if (formValue.amounts && formValue.amounts.length) {
                        const chequeAmountsLength = formValue.amounts.length;
                        for (let i = chequeAmountsLength - 1; i >= 0; i--) {
                            if (formValue.amounts[i].amount) {
                                chequeAmount = Number(
                                    parseFloat(
                                        formValue.amounts[i].amount
                                    ).toFixed(2)
                                );
                                chequeTotal += chequeAmount;

                                if (chequeAmountsLength == 1) {
                                    this.data.amounts.push({
                                        index: i,
                                        amount: chequeAmount,
                                        chequeDate:
                                            formValue.amounts[i].chequeDate,
                                    });
                                } else if (formValue.amounts[i].chequeDate) {
                                    this.data.amounts.push({
                                        index: i,
                                        amount: chequeAmount,
                                        chequeDate:
                                            formValue.amounts[i].chequeDate,
                                    });
                                }
                            }
                        } //for
                    }

                    if (!this.data.amounts.length) valid = false;

                    this.data.amount = chequeTotal;
                    break;
                case PaymentTypeGroupEnum.CreditCard: // Credit Card
                    this.data.validThru = formValue.validThru;
                    this.data.issuer = formValue.issuer;
                    this.data.creditCardNr = formValue.creditCardNr
                        ? formValue.creditCardNr.replace(/ /g, "")
                        : null;
                    this.data.chequeDate = formValue.chequeDate;
                    this.data.cvc = formValue.cvc;

                    if (
                        formValue.validThru &&
                        formValue.validThru.length == 5
                    ) {
                        let validThruArray = formValue.validThru.split("/");
                        this.data.validThruMonth = validThruArray[0];
                        this.data.validThruYear = validThruArray[1];
                    }

                    this.data.creditCardOption = formValue.creditCardOption;
                    this.data.creditCardCustomMonth =
                        formValue.creditCardCustomMonth;
                    this.data.amounts = [];

                    let creditCardTotal = 0;

                    if (formValue.creditCardOption == 1) {
                        //default
                        creditCardTotal = formValue.creditCardAmount;
                        this.data.amounts.push({
                            amount: creditCardTotal,
                        });
                    } else {
                        let creditCardAmount = 0;
                        if (formValue.creditCardAmounts) {
                            for (
                                let i = formValue.creditCardAmounts.length - 1;
                                i >= 0;
                                i--
                            ) {
                                if (formValue.creditCardAmounts[i].amount) {
                                    creditCardAmount = Number(
                                        parseFloat(
                                            formValue.creditCardAmounts[i]
                                                .amount
                                        ).toFixed(2)
                                    );
                                    creditCardTotal += creditCardAmount;

                                    if (
                                        formValue.creditCardAmounts[i]
                                            .creditDate
                                    ) {
                                        this.data.amounts.push({
                                            index: i,
                                            amount: creditCardAmount,
                                            creditDate:
                                                formValue.creditCardAmounts[i]
                                                    .creditDate,
                                        });
                                    }
                                }
                            } //for
                        }
                    }

                    if (!this.data.amounts.length) valid = false;

                    this.data.amount = creditCardTotal;
                    break;
                case PaymentTypeGroupEnum.PostBank: // PostBank
                    this.data.amount = formValue.amount;
                    this.data.postBankNameText = this.postBankNameCtl
                        .selectedItem
                        ? this.postBankNameCtl.selectedItem.textValue
                        : "";
                    this.data.postBankNameId = formValue.postBankName;
                    break;
            } //switch
        }

        this.data.formValue = formValue;
        this.data.valid = valid;
        this.updateData.emit(this.data.paymentId);
    }

    private validatePaymentForm(): boolean {
        if (this.paymentTypeIsRejected()) return false;

        const formValue = this.dataEntryPaymentTypeItemForm.value;
        let valid = true;

        switch (this.data.paymentTypeGroup) {
            case PaymentTypeGroupEnum.Cash:
                break;
            case PaymentTypeGroupEnum.Cheque:
                break;
            case PaymentTypeGroupEnum.CreditCard:
                const validThru = this.getValidThru();
                valid = validThru.isValid;

                // CVC: no mandatory field, only check when it has value
                if (valid && this.cvcCtrl) {
                    if (
                        this.cvcCtrl.rawValue &&
                        this.cvcCtrl.rawValue.length != 3
                    )
                        valid = false;
                }

                //option != default
                if (valid && formValue.creditCardOption != 1) {
                    valid = formValue.creditCardAmounts.length ? true : false;
                }
                break;
            case PaymentTypeGroupEnum.PostBank:
                break;
        } //switch

        if (!valid) return valid;

        // Required Fields
        let controls = this.displayConfig[this.data.paymentTypeGroup];
        for (let i = controls.length - 1; i >= 0; i--) {
            const property = controls[i];
            if (
                property == "cvc" ||
                property == "validThru" ||
                property == "creditCardAmount"
            )
                continue;
            if (
                (this.isOrderDataEntryModule() ||
                    this.isReturnRefundModule()) &&
                property == "paymentDate"
            )
                continue;

            const control =
                this.dataEntryPaymentTypeItemForm.controls[property];
            if (
                !control ||
                !control.value ||
                control.invalid ||
                (control.errors && control.errors.length)
            ) {
                valid = false;
                break;
            }
        } //for

        return valid;
    }

    public onSubmit() {
        this.dataEntryPaymentTypeItemForm["submitted"] = true;
        this.dataEntryPaymentTypeItemForm.updateValueAndValidity();
        if (!this.dataEntryPaymentTypeItemForm.valid) {
            this.data.valid = false;
            return;
        }
        this.dataEntryPaymentTypeItemForm["submitted"] = false;
        this.data.valid = true;
        this.callToOutputData(null);
    }

    private callToOutputData(submitResult: any) {
        this.outputModel = {
            submitResult: submitResult,
            formValue: this.dataEntryPaymentTypeItemForm.value,
            isDirty: this.dataEntryPaymentTypeItemForm.dirty,
            isValid: this.dataEntryPaymentTypeItemForm.valid,
        };
        this.outputData.emit(this.outputModel);
    }

    private clearValidatorsFormDataEntryPayment(keys: Array<string>): void {
        for (const key of keys) {
            this.dataEntryPaymentTypeItemForm.controls[key].clearValidators();
            this.dataEntryPaymentTypeItemForm.controls[key].setErrors(null);
        }
    }

    private clearFormArray(formArray: FormArray): void {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }

    //#endregion

    //#region PaymentType
    private currentPaymentTypeId: number;
    public currentPaymentTypeGroup: number; //1: Cash, 2: Cheque, 3: CreditCard

    private setPaymentTypeText(paymentTypeId?: any) {
        if (!paymentTypeId && this.payementTypeCtl)
            paymentTypeId = this.payementTypeCtl.selectedValue;

        if (!paymentTypeId) return;

        const paymentType = this.data.paymentTypes.find((x) => {
            return x.paymentTypeId === paymentTypeId;
        });
        if (
            !paymentType ||
            !paymentType.paymentTypeId ||
            !paymentType.paymentTypeText
        ) {
            console.log(
                "setPaymentTypeText - not found PaymentType with paymentTypeId: " +
                    paymentTypeId,
                paymentType
            );
            return;
        }

        this.data.paymentTypeText = paymentType.paymentTypeText;
        this.dataEntryPaymentTypeItemForm.controls["paymentTypeText"].setValue(
            paymentType.paymentTypeText
        );
        this.data.headerText = this.index + " - " + paymentType.paymentTypeText;
    }

    private getPaymentTypeGroup(paymentTypeId: any): number {
        const paymentType = this.data.paymentTypes.find((x) => {
            return x.paymentTypeId === paymentTypeId;
        });
        if (paymentType && paymentType.paymentTypeGroup) {
            return paymentType.paymentTypeGroup;
        }
        return null;
    }

    public addPayment() {
        if (!this.payementTypeCtl || !this.data.paymentTypeId) return;
        this.onAddPayment.emit(true);
    }

    public removeItem($event: any) {
        if (this.disabledRemoveButton) return;
        this.outputRemove.emit(this.data);
    }

    private initFormWhenChangePaymentType() {
        const paymentTypeId: number =
            this.dataEntryPaymentTypeItemForm.controls["paymentTypeId"].value;
        if (!paymentTypeId) return;

        switch (this.data.paymentTypeGroup) {
            case PaymentTypeGroupEnum.Cash:
                this.dataEntryPaymentTypeItemForm.controls["amount"].setValue(
                    ""
                );
                break;

            case PaymentTypeGroupEnum.Cheque:
                const formArrayChequeAmounts = <FormArray>(
                    this.dataEntryPaymentTypeItemForm.controls["amounts"]
                );
                if (formArrayChequeAmounts && formArrayChequeAmounts.length) {
                    this.clearFormArray(formArrayChequeAmounts);
                    const formGroup = this.initAmountCheque();
                    const orderDate = this.getOrderDate();
                    formGroup.controls["chequeDate"].setValue(
                        orderDate ? orderDate : ""
                    );
                    formArrayChequeAmounts.push(formGroup);
                }
                break;

            case PaymentTypeGroupEnum.CreditCard:
                this.dataEntryPaymentTypeItemForm.controls[
                    "creditCardAmount"
                ].setValue("");

                this.dataEntryPaymentTypeItemForm.controls[
                    "creditCardOption"
                ].setValue(1);
                this.dataEntryPaymentTypeItemForm.controls[
                    "creditCardCustomMonth"
                ].setValue("");

                const formArrayCreditCardAmounts = <FormArray>(
                    this.dataEntryPaymentTypeItemForm.controls[
                        "creditCardAmounts"
                    ]
                );
                if (
                    formArrayCreditCardAmounts &&
                    formArrayCreditCardAmounts.length
                )
                    this.clearFormArray(formArrayCreditCardAmounts);
                break;

            case PaymentTypeGroupEnum.PostBank:
                this.dataEntryPaymentTypeItemForm.controls["amount"].setValue(
                    ""
                );
                this.dataEntryPaymentTypeItemForm.controls[
                    "postBankName"
                ].setValue("");
                break;
            default:
                break;
        }

        this.setPaymentTypeText(paymentTypeId);

        this.initForm();
        this.dataEntryPaymentTypeItemForm["submitted"] = false;
        this.dataEntryPaymentTypeItemForm.updateValueAndValidity();
        this.preventFocus = Promise.resolve(true);

        setTimeout(() => {
            this.restorePreviousFormValue();

            if (this.dataEntryPaymentTypeItemForm) {
                this.data.currencyId =
                    this.dataEntryPaymentTypeItemForm.controls[
                        "currency"
                    ].value;
                this.setCurrencyText(this.data.currencyId);
            }

            this.changePaymentType.emit({
                paymentId: this.data.paymentId,
                paymentTypeId: this.data.paymentTypeId,
                paymentTypeGroup: this.data.paymentTypeGroup,
            });

            this.focusOnControls();
            this.preventFocus = undefined;
        }, 200);
    }

    private focusOnControls() {
        // Group Cash
        if (this.data.paymentTypeGroup === PaymentTypeGroupEnum.Cash) {
            this.cashFocusOnAmount();
        }
        // Group Cheque
        if (
            this.data.paymentTypeGroup === PaymentTypeGroupEnum.Cheque &&
            this.codelineCtrl
        ) {
            this.codelineCtrl.nativeElement.focus();
        }
        // Group Credit Card
        if (
            this.data.paymentTypeGroup === PaymentTypeGroupEnum.CreditCard &&
            this.issuerCtl
        ) {
            this.issuerCtl.focus();
        }
        // Group PostBank
        if (
            this.data.paymentTypeGroup === PaymentTypeGroupEnum.PostBank &&
            this.postBankNameCtl
        ) {
            this.postBankNameCtl.focus();
        }
    }

    public focusPaymentType() {
        if (!this.payementTypeCtl || this.payementTypeCtl.isDisabled) return;

        if (this.data.paymentTypeId) this.focusOnControls();
        else {
            this.payementTypeCtl.focus();
            this.paymentTypeIdGotFocus();
        }
    }

    private initPaymentType() {
        this.data.paymentTypeGroup = this.getPaymentTypeGroup(
            this.data.paymentTypeId
        );
        //keep paymentTypeGroup into form to restore data: change setting tab Inline/InTba, order failed
        this.dataEntryPaymentTypeItemForm.controls["paymentTypeGroup"].setValue(
            this.data.paymentTypeGroup
        );

        if (
            this.data.paymentTypeId &&
            this.currentPaymentTypeId === this.data.paymentTypeId
        )
            return;

        this.currentPaymentTypeId = this.data.paymentTypeId;
        this.currentPaymentTypeGroup = this.data.paymentTypeGroup;
        this.resetForm();
        this.initFormWhenChangePaymentType();
    }

    public paymentTypeIdClick($event) {
        this.isPaymentTypeTyping = false;
    }

    public paymentTypeIdKeyUp($event) {
        this.isPaymentTypeTyping = true;

        if ($event.keyCode === 13) {
            this.isPaymentTypeTyping = false;

            if (this.payementTypeCtl.selectedItem) {
                this.data.paymentTypeId = this.payementTypeCtl.selectedValue;
                this.initPaymentType();
            }
        }
    }

    public paymentTypeIdChanged($event) {
        if (!this.payementTypeCtl || this.isPaymentTypeTyping) return;

        if (
            this.payementTypeCtl.selectedValue &&
            (!this.payementTypeCtl.isDroppedDown || !this.currentPaymentTypeId)
        ) {
            if (!this.currentPaymentTypeId) {
                this.payementTypeCtl.isDroppedDown = false;
            }
            this.data.paymentTypeId = this.payementTypeCtl.selectedValue;
            this.initPaymentType();
        }
    }

    public paymentTypeIdGotFocus() {
        if (this.payementTypeCtl && !this.payementTypeCtl.selectedValue) {
            this.payementTypeCtl.isDroppedDown = true;
            this.payementTypeCtl.onIsDroppedDownChanged();
        }
    }

    public setPayementTypeCtl(count?: number) {
        count = count || 1;
        if (count > 30) return;

        if (this.payementTypeCtl && this.payementTypeCtl.isInitialized) {
            this.payementTypeCtl.text = this.data.paymentTypeText;
            this.payementTypeCtl.selectedValue = this.data.paymentTypeId;
            this.payementTypeCtl.refresh();
        } else {
            setTimeout(() => {
                this.setPayementTypeCtl(++count);
            }, 300);
        }
    }

    public paymentTypeIsRejected(resetDataBeforeShowDialog?: boolean) {
        if (
            this.ofModule.idSettingsGUI !==
            ModuleList.OrderDataEntry.idSettingsGUI
        )
            return;
        if (!this.parentComponent) return;
        if (
            !this.dataEntryProcess.notApprovedPaymentsMethods ||
            !this.dataEntryProcess.notApprovedPaymentsMethods.length ||
            (this.parentComponent["isCancelThreatSAV"] &&
                this.parentComponent["isCancelBadChequeSAV"])
        )
            return false;
        const threatSAV = this.getThreatSAV();
        const badCheque = this.getBadCheque();
        if (!this.parentComponent["isCancelThreatSAV"] && threatSAV) {
            this.createSAVWarningMessage(
                false,
                () => {
                    this.parentComponent["isCancelThreatSAV"] = true;
                },
                null
            );

            return true;
        } else if (!this.parentComponent["isCancelBadChequeSAV"] && badCheque) {
            switch (badCheque["MessageType"]) {
                case BadChequeEnum.BadCheckSAV:
                    return this.badCheque(
                        badCheque,
                        true,
                        resetDataBeforeShowDialog
                    );
                case BadChequeEnum.BadCheck:
                    return this.badCheque(
                        badCheque,
                        false,
                        resetDataBeforeShowDialog
                    );
                default:
                    return false;
            }
        }
    }

    private getThreatSAV(): any {
        for (let item of this.dataEntryProcess.notApprovedPaymentsMethods) {
            if (item["MessageType"] === BadChequeEnum.ThreatSAV) return item;
        }
        return null;
    }

    private getBadCheque(): any {
        for (let item of this.dataEntryProcess.notApprovedPaymentsMethods) {
            if (
                item["MessageType"] === BadChequeEnum.BadCheck ||
                item["MessageType"] === BadChequeEnum.BadCheckSAV
            )
                return item;
        }
        return null;
    }

    private badCheque(
        badCheque: any,
        isSAV: boolean,
        resetDataBeforeShowDialog?: boolean
    ): boolean {
        if (
            this.currentPaymentTypeGroup &&
            badCheque["IdRepPaymentsMethods"] == this.currentPaymentTypeGroup
        ) {
            this.data.paymentTypeIsRejected = true;

            if (resetDataBeforeShowDialog) {
                this.resetData();
            }
            if (isSAV) {
                this.createSAVWarningMessage(true, () => {
                    this.parentComponent["isCancelBadChequeSAV"] = false;
                    this.resetData();
                });
            } else {
                this.createBadChequeMessage();
            }
            return true;
        }

        this.data.paymentTypeIsRejected = false;
        return false;
    }

    private createBadChequeMessage() {
        this.modalService.warningMessageWithOption({
            showCloseButton: false,
            text: "Rejected Payment",
            message: [
                {
                    key: "Modal_Message__This_Payment_Type_Is_Not_Accepted_For_This_Customer",
                },
            ],
            closeText: "OK",
            callBack: () => {
                this.resetData();
            },
        });
    }

    private createSAVWarningMessage(
        hasContinue: boolean,
        cancelFunc?: Function,
        continueFunc?: Function
    ) {
        let buttonList = [
            new ButtonList({
                buttonType: MessageModal.ButtonType.default,
                text: "Cancel",
                customClass: "",
                callBackFunc: () => {
                    if (cancelFunc) {
                        cancelFunc();
                    }
                    this.modalService.hideModal();
                },
            }),
        ];
        if (hasContinue) {
            buttonList.unshift(
                new ButtonList({
                    buttonType: MessageModal.ButtonType.danger,
                    text: "Continue",
                    customClass: "",
                    callBackFunc: () => {
                        if (continueFunc) {
                            continueFunc();
                        }
                        this.parentComponent["isCancelThreatSAV"] =
                            this.parentComponent["isCancelBadChequeSAV"] = true;
                        this.modalService.hideModal();
                    },
                })
            );
        }
        const messageOption = new MessageModalModel({
            customClass: "message-modal--sav",
            messageType: MessageModal.MessageType.warning,
            modalSize: MessageModal.ModalSize.small,
            showCloseButton: false,
            header: new MessageModalHeaderModel({
                text: "Warning",
            }),
            body: new MessageModalBodyModel({
                isHtmlContent: true,
                content: [
                    {
                        key: '<p style="text-align: center; color: #a94442; font-weight: 900; font-size: 30px;">',
                    },
                    { key: "Modal_Message__SAV" },
                    { key: "</p>" },
                ],
            }),
            footer: new MessageModalFooterModel({
                buttonList: buttonList,
            }),
        });
        this.modalService.createModal(messageOption);
        this.modalService.showModal();
    }
    //#endregion

    //#region Common Events: amount, text
    public amountKeyUp($event: any, index: number): void {
        this.amountTyping = true;
        this.allowShowConfirmTotalAmount = false;
    }

    private amountLostFocusTimeout: any;

    public amountLostFocus($event: any): void {
        if (!this.amountTyping) return;

        clearTimeout(this.amountLostFocusTimeout);
        this.amountLostFocusTimeout = null;

        this.amountLostFocusTimeout = setTimeout(() => {
            this.amountTyping = false;
            this.allowShowConfirmTotalAmount = true;
            this.reUpdateData();
        }, 100);
    }

    public textKeyUp($event: any): void {
        this.allowShowConfirmTotalAmount = false;
    }
    //#endregion

    //#region Currency
    public currencyClick($event) {
        this.currencyTyping = true;
    }

    public currencyKeyUp($event: any): void {
        this.currencyTyping = true;

        this.allowShowConfirmTotalAmount = false;
        this.preventCallEventUpdateData = true;

        if ($event.keyCode === 13) {
            this.currencyLostFocus();
        }
    }

    public currencyGotFocus() {
        if (this.currencyCtl && !this.currencyCtl.selectedValue) {
            this.currencyCtl.isDroppedDown = true;
            this.currencyCtl.onIsDroppedDownChanged();
        }
    }

    public currencyLostFocus($event?: any): void {
        if (
            !this.currencyCtl ||
            !this.currencyTyping ||
            !this.currencyCtl.selectedItem
        )
            return;

        const isChange = this.data.currencyId != this.currencyCtl.selectedValue;

        this.data.currencyId = this.currencyCtl.selectedValue;
        this.data.currencyText = this.currencyCtl.selectedItem.textValue;

        this.currencyTyping = false;
        this.allowShowConfirmTotalAmount = true;
        this.preventCallEventUpdateData = false;
        this.reUpdateData();

        if (isChange && this.data.currencyId) {
            this.onCurrencyChanged.emit({
                currencyId: this.data.currencyId,
            });
        }
    }

    private currencySetValueOrDefault(currency?: any) {
        const hasCurrency = currency ? true : false;
        currency = currency || {};
        if (!currency.idValue && this.data.currencyList.length) {
            const mainCurrencyId = this.data.mainCurrency
                ? this.data.mainCurrency.idRepCurrencyCode
                : null;
            const mainCurrency = this.data.currencyList.find((item) => {
                return item.idValue == mainCurrencyId;
            });
            if (mainCurrency) {
                currency.idValue = this.data.mainCurrency.idRepCurrencyCode;
                currency.textValue = this.data.mainCurrency.currencyCode;
            } else {
                currency.idValue = this.data.currencyList[0]["idValue"];
                currency.textValue = this.data.currencyList[0]["textValue"];
            }
        }

        if (
            this.currencyCtl &&
            currency.idValue &&
            this.currencyCtl.selectedValue != currency.idValue
        ) {
            this.currencyCtl.selectedValue = currency.idValue;
            this.currencyCtl.text = currency.textValue;
            this.currencyCtl.refresh();
            if (
                !hasCurrency &&
                this.data.currencyId != this.currencyCtl.selectedValue
            ) {
                this.currencyTyping = true;
                this.currencyLostFocus();
            }
        }
    }

    private setCurrencyCtl(newCurrency: any, count?: number) {
        count = count || 1;
        if (count > 30) return;

        if (this.currencyCtl && this.currencyCtl.isInitialized) {
            if (newCurrency != null) {
                this.data.currencyId = newCurrency.currencyId;
                this.data.currencyText = newCurrency.currencyText;
            }

            if (this.data.currencyId) {
                this.setCurrencyText(this.data.currencyId);
                this.currencyCtl.selectedValue = this.data.currencyId;
                this.currencyCtl.text = this.data.currencyText;
                this.currencyCtl.refresh();
            }
        } else {
            setTimeout(() => {
                this.setCurrencyCtl(newCurrency, ++count);
            }, 200);
        }
    }

    private setCurrencyText(currencyId) {
        if (!currencyId) return;

        const item = this.data.currencyList.find(
            (n) => n.idValue == currencyId
        );
        if (item) {
            this.data.currencyText = item["textValue"];
        } else if (this.data.idMainCurrencyCode == currencyId) {
            this.data.currencyText = this.data.mainCurrencyCode;
        }
    }
    //#endregion

    //#region Cash
    private cashFocusOnAmount() {
        if (!this.amountCtrls.length) return;

        const lastGroup = this.amountCtrls.last;
        if (lastGroup) {
            lastGroup.nativeElement.focus();
        }
    }
    //#endregion

    //#region Cheque
    /*
       If There is one row -> Date Control is not mandatory
       Else If There is more than one row, flow :
     */
    public chequeDateKeyUp($event: any, index: number): void {
        this.allowShowConfirmTotalAmount = false;
        this.preventFocus = undefined;

        //Only create new row or delete last empty row when enterring
        if ($event.keyCode === 13) {
            if (index !== this.chequesDate.length - 1) return;

            const formArray = <FormArray>(
                this.dataEntryPaymentTypeItemForm.controls["amounts"]
            );
            if (!formArray || !formArray.length || formArray.length < 2) return;

            const dateControl = this.chequesDate.find((item, i) => i == index);
            const amountControl = this.amountCtrls.find(
                (item, i) => i == index
            );

            //Both of current amount and date controls are empty
            if (!dateControl.value && !amountControl.nativeElement.value) {
                // Remove the last row
                formArray.removeAt(index);

                this.chequeDateAmountSetValidators();
                this.chequeFocusOnLastAmount();
            }
        }
    }

    public chequeAmountKeyUp($event: any, index: number): void {
        this.amountTyping = true;
        this.allowShowConfirmTotalAmount = false;
        this.currentAmountIndex = index;

        if ($event.keyCode === 13) {
            this.amountTyping = false;
            this.chequeProcessDateWhenEnterOrLostFocusAmount(index);
        } //if
    }

    public chequeAmountLostFocus($event: any, index: number): void {
        if (!this.amountTyping) return;

        this.chequeProcessDateWhenEnterOrLostFocusAmount(index);
        this.amountLostFocus($event);
    }

    public chequeRemoveAmountDate($event: any, index: number): void {
        this.allowShowConfirmTotalAmount = false;

        if (!index) return;

        const formArray = <FormArray>(
            this.dataEntryPaymentTypeItemForm.controls["amounts"]
        );
        if (!formArray || !formArray.length || formArray.length < 2) return;

        const dateControl = this.chequesDate.find((item, i) => i == index);
        const amountControl = this.amountCtrls.find((item, i) => i == index);

        const removeRow = () => {
            //when using the hotkey
            if ($event === true) {
                setTimeout(() => {
                    formArray.removeAt(index);
                    this.ref.detectChanges();
                });
            } else {
                formArray.removeAt(index);
            }

            this.chequeDateAmountSetValidators();
            this.chequeFocusOnLastAmount();
        };

        if (dateControl.value || amountControl.nativeElement.value) {
            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    headerText: "Confirmation",
                    messageType: MessageModal.MessageType.error,
                    modalSize: MessageModal.ModalSize.small,
                    message: [
                        { key: "<p>" },
                        {
                            key: "Modal_Message__Do_You_Want_To_Delete_The_Selected_Items",
                        },
                        { key: "</p>" },
                    ],
                    okText: "Yes",
                    cancelText: "No",
                    callBack1: () => {
                        removeRow();
                    },
                    callBack2: () => {
                        this.chequeFocusOnLastAmount();
                    },
                })
            );
        } else {
            removeRow();
        }
    }

    public chequeAddAmountDate($event: any, index: number): void {
        this.allowShowConfirmTotalAmount = false;
        this.preventFocus = undefined;

        const formArray = <FormArray>(
            this.dataEntryPaymentTypeItemForm.controls["amounts"]
        );
        const dateControl = this.chequesDate.find((item, i) => i == index);
        const amountControl = this.amountCtrls.find((item, i) => i == index);
        if (
            dateControl &&
            dateControl.value &&
            amountControl &&
            amountControl.nativeElement.value
        ) {
            this.preventFocus = Promise.resolve(true);

            const formGroup = this.initAmountCheque(true);
            formGroup.controls["chequeDate"].setValue("");

            //when using the hotkey
            if ($event === true) {
                setTimeout(() => {
                    formArray.push(formGroup);
                    this.ref.detectChanges();
                });
            } else {
                formArray.push(formGroup);
            }

            this.chequeDateAmountSetValidators();
            this.chequeFocusOnLastAmount();
        }
    }

    private chequeProcessDateWhenEnterOrLostFocusAmount(index: number) {
        this.preventFocus = undefined;

        if (index !== this.chequesDate.length - 1) return;

        const formArray = <FormArray>(
            this.dataEntryPaymentTypeItemForm.controls["amounts"]
        );
        if (!formArray || !formArray.length || formArray.length < 2) return;

        //Process for last item
        const amountControl = this.amountCtrls.find((item, i) => i == index);
        const dateControl = this.chequesDate.find((item, i) => i == index);

        if (!dateControl.value && !amountControl.nativeElement.value) {
            // Remove the last row
            formArray.removeAt(index);

            this.chequeDateAmountSetValidators();
            this.chequeFocusOnLastAmount();
        } else if (!dateControl.value && amountControl.nativeElement.value) {
            const prevDateControl =
                this.dataEntryPaymentTypeItemForm.controls["amounts"][
                    "controls"
                ][index - 1]["controls"]["chequeDate"];
            const date = addMonths(prevDateControl.value, 1); //add 1 month

            this.dataEntryPaymentTypeItemForm.controls["amounts"]["controls"][
                index
            ]["controls"]["chequeDate"].setValue(date);
        }
    }

    private chequeAmountTimeout: any;

    private chequeFocusOnLastAmount() {
        clearTimeout(this.chequeAmountTimeout);
        this.chequeAmountTimeout = null;

        setTimeout(() => {
            const lastGroup = this.amountCtrls.last;
            if (lastGroup) lastGroup.nativeElement.focus();
        }, 100);
    }

    private chequeDateAmountSetValidators() {
        setTimeout(() => {
            let formArray = <FormArray>(
                this.dataEntryPaymentTypeItemForm.controls["amounts"]
            );
            if (!formArray || !formArray.length) return;

            const length = formArray.length;
            //remove validator
            formArray.controls.forEach((item, i) => {
                const dateControl = item["controls"]["chequeDate"];
                if (length == 1) {
                    dateControl.setErrors(null);
                    dateControl.clearValidators();
                } else {
                    dateControl.setValidators([Validators.required]);
                }
            }); //forEach

            formArray.updateValueAndValidity();
        });
    }

    private getOrderDate(): Date {
        const formControlValueState = LocalStorageHelper.toInstance(
            LocalStorageProvider
        ).getItem(
            LocalStorageKey.buildKey(
                LocalStorageKey.OrderDataEntry_FormControlValue,
                this.tabID
            ),
            {}
        );
        const date = formControlValueState["orderDate"];
        if (date) {
            return new Date(date);
        }
        return null;
    }

    //#endregion

    //#region CreditCard
    public creditCardOptionDisabled: boolean = false;
    private creditCardCustomMonthIsProcessing: boolean = false;
    private creditCardCustomMonthIsValueChanged: boolean = false;
    private creditCardMaximumMonthBaseonValidThru: number = undefined; //month base on valid thru
    private creditCardOldValidThru: any = undefined; //keep to revert

    public creditCardOptionChanged(numofMonth?: number): void {
        this.allowShowConfirmTotalAmount = false;

        const creditCardCustomMonthControl =
            this.dataEntryPaymentTypeItemForm.controls["creditCardCustomMonth"];
        let option =
            this.dataEntryPaymentTypeItemForm.controls["creditCardOption"]
                .value;

        //Custom Option
        if (option == 0) {
            creditCardCustomMonthControl.setValidators([Validators.required]);
            creditCardCustomMonthControl.updateValueAndValidity();

            if (numofMonth) {
                this.creditCardRenderAmounts(numofMonth);
            } else {
                this.clearCreditCardAmounts();
                this.creditCardCustomMonthCtrl.nativeElement.focus();
            }
        } else {
            creditCardCustomMonthControl.clearValidators();
            creditCardCustomMonthControl.updateValueAndValidity();

            this.creditCardRenderAmounts(option); // option is numofMonth
        }
    }

    public creditCardOptionChoose(option: number, numofMonth?: number) {
        //If 1 month -> set option Default
        if (numofMonth && numofMonth == 1) option = 1; //Default: 1M

        this.dataEntryPaymentTypeItemForm.controls["creditCardOption"].setValue(
            option
        );
        this.dataEntryPaymentTypeItemForm.controls[
            "creditCardOption"
        ].updateValueAndValidity();
        this.ref.detectChanges();

        this.creditCardOptionChanged(numofMonth);
    }

    public creditDateKeyUp($event: any): void {
        this.allowShowConfirmTotalAmount = false;
    }

    public creditDateValueChanged($event: any): void {
        this.validateCreditCardAmountDates();
    }

    public creditCardAmountKeyUp($event: any, index: number): void {
        this.amountTyping = true;
        this.allowShowConfirmTotalAmount = false;
        this.currentAmountIndex = index;
    }

    public creditCardCustomMonthValueChanged($event: any): void {
        this.creditCardCustomMonthIsValueChanged = true;
    }

    public creditCardCustomMonthKeyUp($event: any): any {
        if (!this.creditCardCustomMonthIsValueChanged) return;

        this.allowShowConfirmTotalAmount = false;

        if ($event.keyCode === 13) {
            //must set false to prevent doing when losting focus
            this.creditCardCustomMonthIsValueChanged = false;
            this.creditCardRenderAmounts();
        }
    }

    public creditCardCustomMonthLostFocus($event: any): void {
        if (!this.creditCardCustomMonthIsValueChanged) return;

        this.allowShowConfirmTotalAmount = false;
        this.creditCardCustomMonthIsValueChanged = false;
        this.creditCardRenderAmounts();
    }

    private creditCardRenderAmounts(numofMonths?: number) {
        if (this.creditCardCustomMonthIsProcessing) return;

        const creditCardOption =
            this.dataEntryPaymentTypeItemForm.controls["creditCardOption"]
                .value;
        const creditCardCustomMonthControl =
            this.dataEntryPaymentTypeItemForm.controls["creditCardCustomMonth"];
        const creditCardCustomMonth = creditCardCustomMonthControl.value;
        let formArray = <FormArray>(
            this.dataEntryPaymentTypeItemForm.controls["creditCardAmounts"]
        );

        try {
            this.creditCardCustomMonthIsProcessing = true;

            if (!numofMonths && !creditCardCustomMonth) {
                this.clearCreditCardAmounts(formArray);
            } else {
                numofMonths = numofMonths || creditCardCustomMonth;
                numofMonths = numofMonths < 2 ? 2 : numofMonths; //minimum is 2
                numofMonths = numofMonths > 120 ? 120 : numofMonths; //maximum 120 months

                //= 0: Custom Option
                if (creditCardOption == 0) {
                    if (
                        numofMonths > this.creditCardMaximumMonthBaseonValidThru
                    )
                        numofMonths =
                            this.creditCardMaximumMonthBaseonValidThru;

                    numofMonths = numofMonths < 2 ? 2 : numofMonths; //minimum is 2
                    if (creditCardCustomMonthControl.value != numofMonths)
                        creditCardCustomMonthControl.setValue(numofMonths);
                } else {
                    creditCardCustomMonthControl.setValue("");

                    //= 1: Default Option
                    if (creditCardOption == 1) numofMonths = 1;
                }

                this.clearCreditCardAmounts(formArray);

                //#region calculate amount
                /*
                 * First month: total Amount * 50% + fractional
                 * Second month: average of 'remain of total amount' + fractional
                 * Next month: average without fractional
                 */
                let firstAmount: number = 0;
                let secondAmount: number = 0;
                let averageAmount: number = 0;
                this.data.creditCardTotalAmount =
                    this.data.creditCardTotalAmount || 0;
                const total = this.data.creditCardTotalAmount;
                if (numofMonths > 1 && total) {
                    const percentOfFirstMonth = 0.5; //50%
                    let fractional = Number((total % 1).toPrecision(2));
                    let totalWithoutFractional = total - fractional;

                    firstAmount =
                        totalWithoutFractional * percentOfFirstMonth +
                        fractional;

                    if (numofMonths > 2) {
                        const remainNumofMonths = numofMonths - 1;
                        const remainOfTotal = total - firstAmount;
                        averageAmount = Math.floor(
                            remainOfTotal / remainNumofMonths
                        );
                        secondAmount =
                            remainOfTotal -
                            averageAmount * (remainNumofMonths - 1);
                    } else {
                        secondAmount = total - firstAmount;
                    }
                } else {
                    firstAmount = total;
                }
                //#endregion

                for (let i = 0; i < numofMonths; i++) {
                    const groupAmount = this.formBuilder.group({
                        amount: ["", Validators.required],
                        creditDate: [
                            new Date(),
                            Validators.required,
                            this.incorrectValidator,
                        ],
                    });

                    let amountValue = averageAmount;
                    switch (i) {
                        case 0:
                            amountValue = firstAmount;
                            break;
                        case 1:
                            amountValue = secondAmount;
                            break;
                    }
                    groupAmount.controls["amount"].setValue(amountValue);

                    formArray.push(groupAmount);
                } //for
            }
        } finally {
            this.creditCardCustomMonthIsProcessing = false;

            //set month base on numofMonth
            setTimeout(() => {
                this.creditCardCustomMonthIsValueChanged = false;

                let formArray = <FormArray>(
                    this.dataEntryPaymentTypeItemForm.controls[
                        "creditCardAmounts"
                    ]
                );
                if (formArray && formArray.length) {
                    let date =
                        formArray.controls[0]["controls"]["creditDate"].value;

                    formArray.controls.forEach((item, i) => {
                        if (i > 0) {
                            date = addMonths(date, 1);
                        }
                        item["controls"]["creditDate"].setValue(date);
                    }); //forEach
                }
            });
        }
    }

    private clearCreditCardAmounts(formArray?: FormArray) {
        formArray =
            formArray ||
            <FormArray>(
                this.dataEntryPaymentTypeItemForm.controls["creditCardAmounts"]
            );
        if (formArray.length) this.clearFormArray(formArray);
    }

    public creditCardItemsTrackBy(index, item) {
        //return item ? item.creditDate : undefined;
        return undefined;
    }

    public issuerGotFocus() {
        if (this.issuerCtl && !this.issuerCtl.selectedValue) {
            this.issuerCtl.isDroppedDown = true;
            this.issuerCtl.onIsDroppedDownChanged();
        }
    }

    //#endregion

    //#region CreditCard: ValidThru

    /*
    1. When changing valid thru and it is less than the biggest amount date
    2. When changing the amount date -> if invalid: only display error for itself
    --> Case 1: show dialog confirm
    1.1 Press No: will revert the previous value if have
    1.2 Press Yes: will automatically choose the appropriate option
    * Confirm Message:
    The installment date should not larger than credit card valid thru.
    System will be update the number of month for suitable. Do you want to continue?
    */
    private validThruIsChanged: boolean;
    private validThruOldRawValue: any;

    public validThruValueChanged($event: any): void {
        this.validThruIsChanged = true;
        this.preventCallEventUpdateData = false;
    }

    public validThruKeyUp($event: any): void {
        if (!this.validThruIsChanged) return;

        this.allowShowConfirmTotalAmount = false;
        //this.preventCallEventUpdateData = true;
        this.creditCardOptionDisabled = true;

        if ($event.keyCode === 13) {
            //must set false to prevent doing when losting focus
            this.validThruIsChanged = false;
            this.validThruProcess();
        }
    }

    public validThruLostFocus($event: any): void {
        if (!this.validThruIsChanged) return;

        this.validThruProcess();
    }

    private validThruProcess() {
        if (this.validThruOldRawValue == this.validThru.rawValue) return;

        this.validThruIsChanged = false;
        this.preventCallEventUpdateData = false;
        this.creditCardOptionDisabled = false;

        if (!this.validThru.rawValue) return;

        const validThru = this.getValidThru();
        if (!validThru.isValid) return;

        if (this.data.creditCardTotalAmount == undefined)
            this.toasterService.pop(
                "warning",
                "Total Amount",
                "The Order Total Summary widget is required for calculating total amount!"
            );

        this.validThruOldRawValue = this.validThru.rawValue;

        //set true all options
        this.data.creditCardOptionsConfig["3"].disabled = true;
        this.data.creditCardOptionsConfig["6"].disabled = true;
        this.data.creditCardOptionsConfig["12"].disabled = true;
        this.data.creditCardOptionsConfig["0"].disabled = true;

        //let numofMonth = differenceInMonths(validThru.date, new Date());
        let numofMonth: number = this.getValidThruInMonths(validThru.date);

        //#region Enable CreditCardOptions
        if (numofMonth) {
            //Custom
            if (numofMonth > 1)
                this.data.creditCardOptionsConfig["0"].disabled = false;
            //3M
            if (numofMonth > 2)
                this.data.creditCardOptionsConfig["3"].disabled = false;
            //6M
            if (numofMonth > 5)
                this.data.creditCardOptionsConfig["6"].disabled = false;
            //12M
            if (numofMonth > 11)
                this.data.creditCardOptionsConfig["12"].disabled = false;

            this.creditCardMaximumMonthBaseonValidThru = Math.ceil(numofMonth);
        } //if
        //#endregion

        //#region Reset Option
        let formArray = <FormArray>(
            this.dataEntryPaymentTypeItemForm.controls["creditCardAmounts"]
        );

        if (formArray && formArray.length) {
            //Default: 1M
            let resetToOption: number = 1;

            if (numofMonth) {
                //Default: 1M
                if (numofMonth <= 1) resetToOption = 1;
                //Custom
                else if (numofMonth > 1 && numofMonth <= 2) resetToOption = 0;
                //3M
                else if (numofMonth >= 3 && numofMonth < 4) resetToOption = 3;
                //6M
                else if (numofMonth >= 6 && numofMonth < 7) resetToOption = 6;
                //12M
                else if (numofMonth >= 12 && numofMonth < 13)
                    resetToOption = 12;
                //Custom
                else resetToOption = 0;
            } //if

            const isResetOption: boolean =
                this.dataEntryPaymentTypeItemForm.controls["creditCardOption"]
                    .value != resetToOption;

            const lastDateCtrl = formArray.controls[formArray.length - 1];
            const lastDate = lastDateCtrl["controls"]["creditDate"].value;
            if (validThru.date < lastDate) {
                //set invalid for last Date control
                this.setValidCreditCardAmountDate(lastDateCtrl, false);

                if (isResetOption) {
                    this.modalService.confirmMessageHtmlContent(
                        new MessageModel({
                            headerText: "Confirmation",
                            messageType: MessageModal.MessageType.confirm,
                            modalSize: MessageModal.ModalSize.small,
                            message: [
                                { key: "<p>" },
                                {
                                    key: "Modal_Message__The_Installment_Date_Should_Not_Larger_Than_Credit_Card_Valid_Thru",
                                },
                                { key: "<br/>" },
                                {
                                    key: "Modal_Message__System_Will_Be_Update_The_Number_Of_Month_For_Suitable_Do_You_Want_To_Continue",
                                },
                                { key: "</p>" },
                            ],
                            okText: "Yes",
                            cancelText: "No",
                            callBack1: () => {
                                this.creditCardOldValidThru =
                                    this.validThru.value; //keep current value
                                let resetNumofMonth: number =
                                    resetToOption == 0
                                        ? Math.ceil(numofMonth)
                                        : undefined;

                                //Yes: will automatically choose the appropriate option
                                this.creditCardOptionChoose(
                                    resetToOption,
                                    resetNumofMonth
                                );
                            },
                            callBack2: () => {
                                //No: will revert the previous value if have
                                this.dataEntryPaymentTypeItemForm.controls[
                                    "validThru"
                                ].setValue(this.creditCardOldValidThru || "");
                            },
                        })
                    );

                    //Must return here, because we don't need to do anything if invalid
                    return;
                }
            } //if
            else if (isResetOption) {
                let resetNumofMonth: number =
                    resetToOption == 0 ? Math.ceil(numofMonth) : undefined;

                //will automatically choose the appropriate option
                this.creditCardOptionChoose(resetToOption, resetNumofMonth);
            }
        } //formArray
        //#endregion

        this.creditCardOldValidThru = this.validThru.value; //keep current value
        this.validateCreditCardAmountDates();
    }

    private getValidThru() {
        let validThru = {
            isValid: false,
            month: 0,
            year: 0,
            date: undefined,
        };

        if (this.validThru && this.validThru.rawValue.length == 4) {
            let valid = true;

            const validThruArray = this.validThru.value.split("/");
            const validThruMonth = parseInt(validThruArray[0]);
            let validThruYear = 0;

            if (validThruMonth > 0 && validThruMonth <= 12) {
                validThruYear = parse(
                    validThruArray[1],
                    "yy",
                    new Date()
                ).getFullYear();
                const currentYear = new Date().getFullYear();

                if (validThruYear < currentYear) {
                    valid = false;
                } else if (validThruYear == currentYear) {
                    const currentMonth = new Date().getMonth() + 1;
                    if (validThruMonth < currentMonth) valid = false;
                }
            } else {
                valid = false;
            }

            if (valid) {
                validThru.month = validThruMonth;
                validThru.year = validThruYear;
                validThru.isValid = true;

                let date = new Date(validThruYear, validThruMonth - 1, 1),
                    y = date.getFullYear(),
                    m = date.getMonth(),
                    lastDate = new Date(y, m + 1, 0),
                    lastDay = lastDate.getDate(); //get the last day of month

                validThru.date = new Date(
                    validThruYear,
                    validThruMonth - 1,
                    lastDay
                );
            }
        }

        return validThru;
    }

    //Get num of months of 'valid thru'
    private getValidThruInMonths(validThruDate) {
        const dateNow = new Date();
        let numofMonth = differenceInMonths(validThruDate, dateNow); //always be integer
        //add more 1 month
        if (numofMonth && validThruDate.getDate() > dateNow.getDate()) {
            numofMonth += 1;
        }

        return numofMonth;
    }

    private validateCreditCardAmountDates() {
        setTimeout(() => {
            let formArray = <FormArray>(
                this.dataEntryPaymentTypeItemForm.controls["creditCardAmounts"]
            );
            if (!formArray || !formArray.length) return;

            const validThru = this.getValidThru();
            const length = formArray.length;
            let previousItem = undefined;

            formArray.controls.forEach((item, i) => {
                if (previousItem == undefined) {
                    previousItem = item;
                    return;
                }

                const previousDate =
                    previousItem["controls"]["creditDate"].value;
                const currentDate = item["controls"]["creditDate"].value;

                if (previousDate >= currentDate) {
                    this.setValidCreditCardAmountDate(item, false); //error
                } else {
                    this.setValidCreditCardAmountDate(item, true); //valid
                }
                previousItem = item;
            }); //forEach

            //validate last date control
            if (validThru.isValid) {
                const lastDateCtrl = formArray.controls[length - 1];
                const lastDate = lastDateCtrl["controls"]["creditDate"].value;
                if (validThru.date < lastDate) {
                    this.setValidCreditCardAmountDate(lastDateCtrl, false); //error
                }
            }
        });
    }

    private setValidCreditCardAmountDate(item, isValid?: boolean) {
        const dateCtrl = item["controls"]["creditDate"];
        dateCtrl["valueIncorrect"] = !isValid;
        dateCtrl.markAsDirty();

        if (isValid) dateCtrl.setErrors(null);
        else dateCtrl.setErrors({ incorrect: true });

        dateCtrl.updateValueAndValidity();
    }

    private incorrectValidator(control: FormControl): Observable<any> {
        return new Observable<any>((obser) => {
            if (!control["valueIncorrect"]) {
                obser.next(null); //ok
            } else {
                const validator = { incorrect: true };
                obser.next(validator);
            }
            obser.complete();
        }).debounceTime(300);
    }

    //#endregion

    //#region Post-Bank
    // public paymentDateKeyUp($event: any): void {
    //     // this.allowShowConfirmTotalAmount = false;
    // }

    public postBankNameClick($event) {
        this.postBankNameTyping = true;
    }

    public postBankNameKeyUp($event: any): void {
        this.postBankNameTyping = true;

        this.allowShowConfirmTotalAmount = false;
        this.preventCallEventUpdateData = true;

        if ($event.keyCode === 13) {
            this.postBankNameLostFocus();
        }
    }

    public postBankNameGotFocus() {
        if (this.postBankNameCtl && !this.postBankNameCtl.selectedValue) {
            this.postBankNameCtl.isDroppedDown = true;
            this.postBankNameCtl.onIsDroppedDownChanged();
        }
    }

    public postBankNameLostFocus($event?: any): void {
        if (
            !this.postBankNameCtl ||
            !this.postBankNameTyping ||
            !this.postBankNameCtl.selectedItem
        )
            return;

        this.data.postBankNameId = this.postBankNameCtl.selectedValue;
        this.data.postBankNameText =
            this.postBankNameCtl.selectedItem.textValue;

        this.postBankNameTyping = false;
        this.allowShowConfirmTotalAmount = true;
        this.preventCallEventUpdateData = false;
        this.reUpdateData();
    }
    //#endregion

    //#region Public
    public resetForm() {}

    public setPaymentTypeSource(source: Array<any>) {
        if (!this.payementTypeCtl) return;

        let tempData = cloneDeep(source);

        const paymentTypeId = this.data.paymentTypeId;
        if (paymentTypeId) {
            const removedList = filter(this.data.paymentTypes, function (o) {
                return o.paymentTypeId != paymentTypeId;
            });
            const addedList = filter(tempData, function (o) {
                return o.paymentTypeId != paymentTypeId;
            });
            //remove all except current payment
            pullAllBy(this.data.paymentTypes, removedList);
            //add allowed items
            Array.prototype.push.apply(this.data.paymentTypes, addedList); //Merge the second array into the first one
        } else {
            //clear all
            this.data.paymentTypes.length = 0;
            //add all items
            Array.prototype.push.apply(this.data.paymentTypes, tempData);
        }

        //sort paymentTypeId by asc
        this.data.paymentTypes.sort((a, b) => {
            return Uti.sortBy(a, b, "paymentTypeId");
        });
    }

    public setCurrencySource(source: Array<any>) {
        if (!this.currencyCtl) return;

        //if Cash: source excludes all selected currencies including itself
        let tempData = cloneDeep(source);

        let oldCurrency = undefined;
        if (this.currencyCtl.selectedItem) {
            oldCurrency = {
                idValue: this.currencyCtl.selectedItem.idValue,
                textValue: this.currencyCtl.selectedItem.textValue,
            };
        }

        //The Cash must exclude the chosen currencies
        if (
            this.data.paymentTypeGroup == PaymentTypeGroupEnum.Cash &&
            this.data.paymentTypeId !== PaymentTypeIdEnum.OpenInvoice
        ) {
            const currencyId = this.data.currencyId;
            if (currencyId) {
                const currentCurrency = this.data.currencyList.find(
                    (n) => n.idValue == currencyId
                );
                if (currentCurrency) {
                    //Because 'tempData' only contains currencies and excludes the chosen currencies, so we must add the currency that chosen before
                    //Add new items to the beginning of an array
                    const findCurrency = tempData.find(
                        (n) => n.idValue == currencyId
                    );
                    //CurrentCurrency don't have in Temp
                    if (!findCurrency) tempData.unshift(currentCurrency);

                    oldCurrency = {
                        idValue: currentCurrency.idValue,
                        textValue: currentCurrency.textValue,
                    };
                }
            }
        } else {
            //This code helps to display MainCurrency
            if (
                this.data.mainCurrency &&
                this.data.mainCurrency.idRepCurrencyCode
            ) {
                const mainCurrencyId = this.data.mainCurrency.idRepCurrencyCode;
                //remove mainCurrency from 'tempData' and add it to the beginning of an array
                const mainCurrency = tempData.find(
                    (n) => n.idValue == mainCurrencyId
                );
                if (mainCurrency) {
                    tempData = tempData.filter(
                        (p) => p.idValue != mainCurrencyId
                    );
                    tempData.unshift(mainCurrency);
                }
            }
        }

        this.data.currencyList = tempData;

        setTimeout(() => {
            this.currencySetValueOrDefault(oldCurrency);
        });
    }

    public setValueForCreditCardAmount(creditCardAmount) {
        let isSetCreditCardAmount = false; //It is used to check if there is actually a change in the amount, to avoid calling loop code. Amount change -> will call the ValueChanges

        // option month is default
        if (this.data.creditCardOption == 1) {
            creditCardAmount = Number(parseFloat(creditCardAmount).toFixed(2));

            if (this.data.amount === "" && creditCardAmount == 0) {
                isSetCreditCardAmount = true;
            } else {
                this.data.amount = !this.data.amount ? 0 : this.data.amount;
                isSetCreditCardAmount = this.data.amount != creditCardAmount;
            }

            if (isSetCreditCardAmount) {
                setTimeout(() => {
                    if (this.data) {
                        this.data.amount = creditCardAmount;
                        this.dataEntryPaymentTypeItemForm.controls[
                            "creditCardAmount"
                        ].setValue(creditCardAmount);
                    }
                });
            }
        }
        return isSetCreditCardAmount;
    }

    public setValueForOpenInvoicedAmount(openInvoiceAmount) {
        let isSetAmount = false; //It is used to check if there is actually a change in the amount, to avoid calling loop code. Amount change -> will call the ValueChanges

        openInvoiceAmount = Number(parseFloat(openInvoiceAmount).toFixed(2));

        if (this.data.amount === "" && openInvoiceAmount == 0) {
            isSetAmount = true;
        } else {
            this.data.amount = !this.data.amount ? 0 : this.data.amount;
            isSetAmount = this.data.amount != openInvoiceAmount;
        }

        if (isSetAmount) {
            setTimeout(() => {
                if (this.data) {
                    this.data.amount = openInvoiceAmount;
                    this.dataEntryPaymentTypeItemForm.controls[
                        "amount"
                    ].setValue(openInvoiceAmount);
                }
            });
        }
        return isSetAmount;
    }

    public resetValueWhenConfirmTotalAmount() {
        setTimeout(() => {
            switch (this.data.paymentTypeGroup) {
                case PaymentTypeGroupEnum.Cash:
                    this.dataEntryPaymentTypeItemForm.controls[
                        "amount"
                    ].setValue("");
                    this.cashFocusOnAmount();
                    break;
                case PaymentTypeGroupEnum.Cheque:
                    const chequeFormArrayControl = <FormGroup>(
                        this.dataEntryPaymentTypeItemForm.controls["amounts"][
                            "controls"
                        ][this.currentAmountIndex]
                    );
                    if (chequeFormArrayControl) {
                        chequeFormArrayControl.controls["amount"].setValue("");

                        const amountControl = this.amountCtrls.find(
                            (item, i) => i == this.currentAmountIndex
                        );
                        amountControl.nativeElement.focus();
                    }
                    break;
                case PaymentTypeGroupEnum.CreditCard:
                    const creditCardFormArrayControl = <FormGroup>(
                        this.dataEntryPaymentTypeItemForm.controls[
                            "creditCardAmounts"
                        ]["controls"][this.currentAmountIndex]
                    );
                    if (creditCardFormArrayControl) {
                        creditCardFormArrayControl.controls["amount"].setValue(
                            ""
                        );

                        const amountControl = this.amountCtrls.find(
                            (item, i) => i == this.currentAmountIndex
                        );
                        amountControl.nativeElement.focus();
                    }
                    break;
                case PaymentTypeGroupEnum.PostBank:
                    this.dataEntryPaymentTypeItemForm.controls[
                        "amount"
                    ].setValue("");
                    this.cashFocusOnAmount();
                    break;
            } //switch
        });
    }

    //#endregion

    public isBackofficeOrders() {
        return (
            this.tabID == "BackofficeOrders" || this.isNotOrderDataEntryModule()
        );
    }

    private isNotOrderDataEntryModule() {
        return (
            this.ofModule &&
            this.ofModule.idSettingsGUI !==
                ModuleList.OrderDataEntry.idSettingsGUI
        );
    }

    private isOrderDataEntryModule() {
        return (
            this.ofModule &&
            this.ofModule.idSettingsGUI ===
                ModuleList.OrderDataEntry.idSettingsGUI
        );
    }

    private isReturnRefundModule() {
        return (
            this.ofModule &&
            this.ofModule.idSettingsGUI ===
                ModuleList.ReturnRefund.idSettingsGUI
        );
    }
}
