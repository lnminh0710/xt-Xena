import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
    PersonService,
    PropertyPanelService,
    AppErrorHandler,
    WidgetTemplateSettingService,
} from "app/services";
import { ComboBoxTypeConstant, Configuration } from "app/app.constants";
import { Uti } from "app/utilities";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { SubCommonState } from "app/state-management/store/reducer/xn-common";
import {
    XnCommonActions,
    ProcessDataActions,
    CustomAction,
} from "app/state-management/store/actions";
import isEmpty from "lodash-es/isEmpty";
import cloneDeep from "lodash-es/cloneDeep";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as commonReducer from "app/state-management/store/reducer/xn-common";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import { WidgetDetail } from "app/models";

@Component({
    selector: "app-ad-cash-provider-pc-form",
    styleUrls: ["./ad-cash-provider-provider-cost-form.component.scss"],
    templateUrl: "./ad-cash-provider-provider-cost-form.component.html",
})
export class AdCashProviderProviderCostFormComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    public isRenderForm: boolean;
    public globalNumberFormat: string = null;

    private listComboBox: any;
    private paymentCostTypeData: any = {};
    private idPerson;
    private currentPayemtType: any = {};
    private isPaymentTypeDisabled = false;
    private formSubmitted = false;
    public globalProps: any[] = [];

    private xnComState: Observable<SubCommonState>;
    private xnComStateSubcription: Subscription;
    private adCashProviderPCFormValueChangesSubscription: Subscription;
    private personServiceSubscription: Subscription;
    private selectedEntityState: Observable<any>;
    private selectedEntityStateSubscription: Subscription;
    private dispatcherSubscription: Subscription;
    private widgetTemplateSettingServiceSubscription: Subscription;

    private data: any;
    private REQUEST_STRING = {
        Request: {
            ModuleName: "GlobalModule",
            ServiceName: "GlobalService",
            Data: '{"MethodName" : "SpAppWg002GetGridProviderCosts", "CrudType"  : null, "Object" : null,"Mode" :  null, "WidgetTitle" : "ProviderCosts List...", "IsDisplayHiddenFieldWithMsg" : "1",<<LoginInformation>>,<<InputParameter>>}',
        },
    };
    private adCashProviderPCForm: FormGroup;
    @Input() gridId: string;
    @Input() set globalProperties(globalProperties: any[]) {
        this.globalProps = globalProperties;
        this.globalNumberFormat =
            this.propertyPanelService.buildGlobalNumberFormatFromProperties(
                globalProperties
            );
    }

    private outputModel: {
        submitResult?: boolean;
        formValue: any;
        isValid?: boolean;
        isDirty?: boolean;
        returnID?: string;
    };
    @Output() outputData: EventEmitter<any> = new EventEmitter();
    public paymentCostTypeLabel: string;
    public paymentTypeLabel: string;
    public amountLabel: string;
    public currencyLabel: string;
    constructor(
        private consts: Configuration,
        private formBuilder: FormBuilder,
        private comActions: XnCommonActions,
        private personService: PersonService,
        private propertyPanelService: PropertyPanelService,
        private dispatcher: ReducerManagerDispatcher,
        private store: Store<AppState>,
        protected router: Router,
        private appErrorHandler: AppErrorHandler,
        private widgetTemplateSettingService: WidgetTemplateSettingService
    ) {
        super(router);

        this.xnComState = this.store.select((state) =>
            commonReducer.getCommonState(state, this.ofModule.moduleNameTrim)
        );
        this.selectedEntityState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedEntity
        );
    }

    public ngOnInit() {
        this.initEmptyData();
        this.subcribeData();
        this.getDropdownlistData();
        this.createGridData();
        const widgetDetail: WidgetDetail = new WidgetDetail({
            idRepWidgetType: 2,
            moduleName: "Administration",
            request: JSON.stringify(this.REQUEST_STRING),
        });
        this.widgetTemplateSettingServiceSubscription =
            this.widgetTemplateSettingService
                .getWidgetDetailByRequestString(widgetDetail, {
                    IdPerson: this.idPerson,
                })
                .subscribe((response: WidgetDetail) => {
                    this.appErrorHandler.executeAction(() => {
                        const data = response.contentDetail.columnSettings;
                        this.paymentCostTypeLabel =
                            data["__DefaultValue"].ColumnHeader;
                        this.paymentTypeLabel =
                            data["_DefaultValue"].ColumnHeader;
                        this.amountLabel = data["Amount"].ColumnHeader;
                        this.currencyLabel = data["CurrencyCode"].ColumnHeader;
                    });
                });
    }

    public subcribeData() {
        this.selectedEntityStateSubscription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (selectedEntityState && selectedEntityState.id) {
                        this.idPerson = selectedEntityState.id;
                    }
                });
            });

        this.dispatcherSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.onSubmit();
                });
            });
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private initEmptyData() {
        this.adCashProviderPCForm = this.formBuilder.group({
            isActive: true,
            paymentType: ["", Validators.required],
            paymentTypeText: null,
            paymentCostType: ["", Validators.required],
            paymentCostTypeText: null,
            amount: ["", Validators.required],
            currency: ["", Validators.required],
            currencyText: null,
        });
        Uti.registerFormControlType(this.adCashProviderPCForm, {
            dropdown: "paymentType;paymentCostType;currency",
            number: "amount",
        });
        this.adCashProviderPCForm["submitted"] = false;
        this.initDataForForm();
    }

    private initDataForForm() {
        if (!this.data || this.isRenderForm || !this.listComboBox) {
            return;
        }
        this.regisValueChange();
        this.isRenderForm = true;
        this.updateFormMainValue();
    }

    private updateFormMainValue() {
        setTimeout(() => {
            if (this.adCashProviderPCFormValueChangesSubscription)
                this.adCashProviderPCFormValueChangesSubscription.unsubscribe();

            this.adCashProviderPCFormValueChangesSubscription =
                this.adCashProviderPCForm.valueChanges
                    .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                    .subscribe((data) => {
                        this.appErrorHandler.executeAction(() => {
                            if (!this.adCashProviderPCForm.pristine) {
                                this.setOutputData(null);
                            }
                        });
                    });
        });
    }
    private getDropdownlistData() {
        this.xnComStateSubcription = this.xnComState.subscribe(
            (xnComState: SubCommonState) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !xnComState.listComboBox ||
                        !xnComState.listComboBox.currency
                    ) {
                        return;
                    }

                    this.listComboBox = xnComState.listComboBox;
                    this.setUpFakeDataForForm();
                    this.initDataForForm();
                });
            }
        );
        this.callToGetDropdownlistData();
    }

    private callToGetDropdownlistData() {
        this.store.dispatch(
            this.comActions.loadComboBoxList(
                [
                    ComboBoxTypeConstant.currency,
                    ComboBoxTypeConstant.paymentType,
                    ComboBoxTypeConstant.providerCostType,
                ],
                this.ofModule
            )
        );
    }

    private formGroupSubscriptionPaymentType: Subscription;
    private formGroupSubscriptionPaymentCostType: Subscription;
    private formGroupSubscriptionCurrency: Subscription;

    private regisValueChange() {
        if (this.formGroupSubscriptionPaymentType)
            this.formGroupSubscriptionPaymentType.unsubscribe();
        if (this.formGroupSubscriptionPaymentCostType)
            this.formGroupSubscriptionPaymentCostType.unsubscribe();
        if (this.formGroupSubscriptionCurrency)
            this.formGroupSubscriptionCurrency.unsubscribe();

        this.formGroupSubscriptionPaymentType = Uti.updateFormComboboxValue(
            this.adCashProviderPCForm,
            this.listComboBox.paymentType,
            this.adCashProviderPCForm,
            "paymentType",
            "paymentTypeText"
        );

        this.formGroupSubscriptionPaymentCostType = Uti.updateFormComboboxValue(
            this.adCashProviderPCForm,
            this.listComboBox.paymentCostType,
            this.adCashProviderPCForm,
            "paymentCostType",
            "paymentCostTypeText"
        );

        this.formGroupSubscriptionCurrency = Uti.updateFormComboboxValue(
            this.adCashProviderPCForm,
            this.listComboBox.currency,
            this.adCashProviderPCForm,
            "currency",
            "currencyText"
        );
    }

    public addToGrid($event: any) {
        this.adCashProviderPCForm["submitted"] = true;
        this.adCashProviderPCForm.updateValueAndValidity();
        if (!this.adCashProviderPCForm.valid) {
            return;
        }

        this.adCashProviderPCForm.updateValueAndValidity();
        let currentGridData = cloneDeep(this.paymentCostTypeData.data);
        currentGridData.push({
            providerType: this.adCashProviderPCForm.value.paymentCostType,
            providerTypeText:
                this.adCashProviderPCForm.value.paymentCostTypeText,
            amount: this.adCashProviderPCForm.value.amount,
            currency: this.adCashProviderPCForm.value.currency,
            currencyText: this.adCashProviderPCForm.value.currencyText,
        });
        this.paymentCostTypeData = {};
        this.paymentCostTypeData = {
            data: cloneDeep(currentGridData),
            columns: this.createGridColumns(),
        };
        currentGridData = {};
        this.isPaymentTypeDisabled = true;
        this.setCurrentPayemtType();
        this.resetForm();
    }

    private setCurrentPayemtType() {
        if (!isEmpty(this.currentPayemtType)) {
            return;
        }
        this.adCashProviderPCForm.updateValueAndValidity();
        this.currentPayemtType = {
            isActive: this.adCashProviderPCForm.value.isActive,
            paymentType: this.adCashProviderPCForm.value.paymentType,
        };
    }

    private resetForm() {
        Uti.resetValueForForm(this.adCashProviderPCForm);
        this.setDefaultValueForActive();
        this.setChosenValueForPaymentType();
    }

    public setChosenValueForPaymentType() {
        (<any>(<any>this.adCashProviderPCForm.controls).paymentType).setValue(
            this.currentPayemtType.paymentType
        );
    }

    public setDefaultValueForActive() {
        (<any>(<any>this.adCashProviderPCForm.controls).isActive).setValue(
            true
        );
    }

    private resetFormWhenSave() {
        this.createGridData();
        this.resetForm();
        this.isPaymentTypeDisabled = false;
        this.currentPayemtType = {};
    }

    public onSubmit(event?: any) {
        try {
            this.formSubmitted = true;
            this.adCashProviderPCForm.updateValueAndValidity();
            if (!this.checkFormValid()) {
                this.setOutputData(false);
                return false;
            }

            this.createProviderCost();
        } catch (ex) {
            return false;
        }
    }

    private checkFormValid() {
        return !!this.paymentCostTypeData.data.length;
    }

    private createProviderCost() {
        this.personServiceSubscription = this.personService
            .createCostProvider(this.prepareSubmitCreateData())
            .subscribe(
                (data) => {
                    this.appErrorHandler.executeAction(() => {
                        this.setOutputData(false, {
                            submitResult: true,
                            formValue: this.adCashProviderPCForm.value,
                            isValid: true,
                            isDirty: false,
                            returnID: data.returnID,
                        });
                        this.resetFormWhenSave();
                    });
                },
                (err) => {
                    this.setOutputData(false);
                    this.outputData.emit(this.outputModel);
                }
            );
    }

    private setOutputData(submitResult: any, data?: any) {
        if (typeof data !== "undefined") {
            this.outputModel = data;
        } else {
            this.outputModel = {
                submitResult: submitResult,
                formValue: this.adCashProviderPCForm.value,
                isValid: this.adCashProviderPCForm.valid,
                isDirty: this.adCashProviderPCForm.dirty,
            };
        }
        this.outputData.emit(this.outputModel);
    }

    private prepareSubmitCreateData() {
        return {
            ProviderCosts: {
                IdPerson: this.idPerson,
                IdRepPaymentsMethods: this.currentPayemtType.paymentType,
                IsActive: this.currentPayemtType.isActive,
                Notes: "",
            },
            ProviderCostsItems: this.createPaymentCodeTypes(),
        };
    }

    private createPaymentCodeTypes() {
        const result = [];
        for (const item of this.paymentCostTypeData.data) {
            result.push({
                Amount: item.amount,
                IdRepCurrencyCode: item.currency,
                IdRepProviderCostsType: item.providerType,
                IsActive: true,
            });
        }
        return result;
    }

    private setUpFakeDataForForm() {
        this.createComboboxFakeData();
        this.createFakeModelData();
    }

    private createFakeModelData() {
        this.data = {
            isActive: {
                displayValue: "isActive",
                value: null,
            },
            paymentType: {
                displayValue: "paymentType",
                value: null,
            },
            paymentCostType: {
                displayValue: "paymentCostType",
                value: null,
            },
            amount: {
                displayValue: "amount",
                value: null,
            },
            currency: {
                displayValue: "currency",
                value: null,
            },
        };
    }

    private createComboboxFakeData(): any {
        this.listComboBox = {
            paymentType: this.listComboBox.paymentType,
            paymentCostType: this.listComboBox.providerCostType,
            currency: this.listComboBox.currency,
        };
    }

    private createGridData() {
        this.paymentCostTypeData = {
            data: [],
            columns: this.createGridColumns(),
        };
    }

    private createGridColumns() {
        const result: any = [];
        result.push({
            title: "Provider Type",
            data: "providerType",
            setting: {
                DataType: "nvarchar",
                Setting: [
                    {
                        DisplayField: {
                            Hidden: "1",
                        },
                    },
                ],
            },
        });
        result.push({
            title: "Provider Type",
            data: "providerTypeText",
            visible: true,
        });
        result.push({
            title: "Amount",
            data: "amount",
            visible: true,
        });
        result.push({
            title: "Currency",
            data: "currency",
            setting: {
                DataType: "nvarchar",
                Setting: [
                    {
                        DisplayField: {
                            Hidden: "1",
                        },
                    },
                ],
            },
        });
        result.push({
            title: "Currency",
            data: "currencyText",
            visible: true,
        });

        return result;
    }
}
