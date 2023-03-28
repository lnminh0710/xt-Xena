import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ElementRef,
} from "@angular/core";
import { ModuleList } from "app/pages/private/base";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
    CommonService,
    CampaignService,
    AppErrorHandler,
    PropertyPanelService,
} from "app/services";
import {
    ComboBoxTypeConstant,
    ApiMethodResultId,
    Configuration,
} from "app/app.constants";
import { Subscription } from "rxjs/Subscription";
import { Uti } from "app/utilities";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import isInteger from "lodash-es/isInteger";
import isString from "lodash-es/isString";
import cloneDeep from "lodash-es/cloneDeep";
import * as wjInput from "wijmo/wijmo.angular2.input";
import { DatePipe } from "@angular/common";
import { XnFileExplorerComponent } from "app/shared/components/xn-file/xn-file-explorer";
import { ApiResultResponse } from "app/models";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { parse } from "date-fns/esm";
import { ControlFocusComponent } from "app/shared/components/form";
import { Observable } from "rxjs";
import { AppState } from "app/state-management/store";
import { Store } from "@ngrx/store";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";

@Component({
    selector: "app-business-cost-header-form",
    styleUrls: ["./business-cost-header.component.scss"],
    templateUrl: "./business-cost-header.component.html",
})
export class BusinessCostHeaderFormComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public isRenderForm: boolean;
    public maxCharactersNotes = 500;
    public lastDayOfThisYear = new Date(new Date().getFullYear(), 11, 31);
    public globalDateFormat: string = null;
    public globalNumberFormat = "";
    public dontShowCalendarWhenFocus: boolean;
    private businessCostForm: FormGroup;
    private listComboBox: any;
    private idBusinessCosts: any = 0;
    private isDeletedFiles = false;
    private isRenderCompleted = true;
    private formChangeSubscription: Subscription;
    private idRepIsoCountryCode = 0;
    private data: any;
    private _idSalesCampaignWizard: any;
    private comServiceSubscription: Subscription;
    private campaingServiceSubscription: Subscription;

    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;

    private outputModel: {
        submitResult?: boolean;
        currencyText: string;
        formValue: any;
        isValid?: boolean;
        isDirty?: boolean;
        returnID?: string;
    };
    private _globalProperties: any;

    @ViewChild("controlFocus") controlFocus: ControlFocusComponent;
    @ViewChild("multiSelectCompany") multiSelectCompany: AngularMultiSelect;
    @ViewChild("invoiceDate") invoiceDate: wjInput.WjInputDate;
    @ViewChild("prePaymentDate") prePaymentDate: wjInput.WjInputDate;
    @ViewChild("principal") principalCombobox: AngularMultiSelect;
    @ViewChild("vat1AmountNumber") vat1AmountNumber: ElementRef;
    @ViewChild("vat2AmountNumber") vat2AmountNumber: ElementRef;
    @ViewChild("xnFileExplorerComponent")
    xnFileExplorerComponent: XnFileExplorerComponent;
    @ViewChild("vat1") vat1Ctrl: AngularMultiSelect;
    @ViewChild("vat2") vat2Ctrl: AngularMultiSelect;

    @Input() set idSalesCampaignWizard(data: any) {
        if (!isNil(data)) {
            this.isRenderCompleted = false;
            this._idSalesCampaignWizard = data;
            this.campaingServiceSubscription = this.campaingService
                .getCampaignCosts(data)
                .subscribe((response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!Uti.isResquestSuccess(response)) {
                            this.allowForFormValueChange(1);
                            return;
                        }
                        this.data = this.mapDataFromServerToEasierStructure(
                            response.item.data
                        );
                        if (this.data && this.data.idBusinessCosts)
                            this.idBusinessCosts = parseInt(
                                this.data.idBusinessCosts,
                                null
                            );
                        this.initFormData();
                        // this.getDataForVATDDL(response.item.data.idPerson);
                    });
                });
        }
    }

    get idSalesCampaignWizard() {
        return this._idSalesCampaignWizard;
    }

    @Input() set globalProperties(globalProperties: any[]) {
        this._globalProperties = globalProperties;
        this.globalDateFormat =
            this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                globalProperties
            );
        this.globalNumberFormat =
            this.propertyPanelService.buildGlobalNumberFormatFromProperties(
                globalProperties
            );
    }
    get globalProperties() {
        return this._globalProperties;
    }

    @Output() saveData: EventEmitter<any> = new EventEmitter();
    @Output() outputData: EventEmitter<any> = new EventEmitter();

    constructor(
        private appErrorHandler: AppErrorHandler,
        private propertyPanelService: PropertyPanelService,
        private formBuilder: FormBuilder,
        private comService: CommonService,
        private campaingService: CampaignService,
        private datePipe: DatePipe,
        private toasterService: ToasterService,
        private store: Store<AppState>,
        private consts: Configuration
    ) {
        this.globalPropertiesState = this.store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
    }

    public ngOnInit() {
        this.initFormData();
        this.getInitDropdownlistData();
        this.subscribeData();
    }

    public ngAfterViewInit() {}

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private mapDataFromServerToEasierStructure(data): any {
        const newData = cloneDeep(data[1]);
        const result = this.initEmptyData();
        if (newData && newData.length) {
            (newData as Array<any>).forEach((item) => {
                if (item.OriginalColumnName) {
                    switch (item.OriginalColumnName) {
                        case "B01RepBusinessCosts_IdRepBusinessCosts":
                            result["idRepBusinessCosts"] = item.Value;
                            break;
                        case "B00RepCurrencyCode_IdRepCurrencyCode":
                            result["idRepCurrencyCode"] = item.Value;
                            break;
                        case "B00Person_IdPersonToPrincipal":
                            result["idPerson"] = item.Value;
                            break;
                        case "B01BusinessCosts_InvoiceNr":
                            result["invoiceNr"] = item.Value;
                            break;
                        case "B01BusinessCosts_InvoiceDate":
                            result["invoiceDate"] = item.Value;
                            break;
                        case "B01BusinessCosts_Amount":
                            result["amount"] =
                                item.Value != null
                                    ? parseInt(item.Value, null)
                                    : null;
                            break;
                        case "B01BusinessCosts_Notes":
                            result["notes"] = item.Value;
                            break;
                        case "B01BusinessCosts_DoneDate":
                            result["doneDate"] = item.Value;
                            break;
                        case "B01BusinessCosts_IdRepVat1":
                            result["idRepVat1"] = item.Value;
                            break;
                        case "B01BusinessCosts_IdRepVat2":
                            result["idRepVat2"] = item.Value;
                            break;
                        case "B01BusinessCosts_VatAmount1":
                            result["vatAmount1"] =
                                item.Value != null
                                    ? parseInt(item.Value, null)
                                    : null;
                            break;
                        case "B01BusinessCosts_VatAmount2":
                            result["vatAmount2"] =
                                item.Value != null
                                    ? parseInt(item.Value, null)
                                    : null;
                            break;
                        case "B01BusinessCosts_IsActive":
                            result["isActive"] = item.Value;
                            break;
                        case "B01BusinessCosts_IdBusinessCosts":
                            result["idBusinessCosts"] = item.Value;
                            break;
                        case "B00PersonToCompany_IdPersonToCompany":
                            result["company"] = item.Value;
                            break;
                    }
                }
            });
        }
        return result;
    }

    private getInitDropdownlistData() {
        this.comServiceSubscription = this.comService
            .getListComboBox(
                "BusnessCostType,BusinessCostCompany," +
                    ComboBoxTypeConstant.currency +
                    "," +
                    ComboBoxTypeConstant.principal
            )
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    this.listComboBox = this.rebuildComboboxData(response.item);
                    this.initDataForForm();
                    // if (this.data)
                    //     this.getDataForVATDDL(this.data.idPerson);

                    setTimeout(() => {
                        if (
                            this.businessCostForm.controls["company"].value &&
                            this.listComboBox.BusinessCostCompany
                        ) {
                            if (this.multiSelectCompany)
                                this.multiSelectCompany.selectedItem =
                                    this.listComboBox.BusinessCostCompany.find(
                                        (item) =>
                                            item.idValue ==
                                            this.businessCostForm.controls[
                                                "company"
                                            ].value
                                    );
                        } else {
                            if (this.multiSelectCompany)
                                this.multiSelectCompany.selectedItem = null;
                        }
                    });
                });
            });
    }

    private rebuildComboboxData(response: any): any {
        if (!response.currency) {
            response.currency = [];
        }
        if (!response.BusnessCostType) {
            response.BusnessCostType = [];
        }
        if (!response.BusinessCostCompany) {
            response.BusinessCostCompany = [];
        }
        if (!response.principal) {
            response.principal = [];
        }
        return response;
    }

    private initDataForForm() {
        if (!this.listComboBox || this.isRenderForm) {
            return;
        }
        this.isRenderForm = true;
        this.updateFormValue();
    }

    private updateFormValue() {
        setTimeout(() => {
            this.updateFormMainValue();
        });
    }

    private updateFormMainValue() {
        if (this.formChangeSubscription)
            this.formChangeSubscription.unsubscribe();

        this.formChangeSubscription =
            this.businessCostForm.valueChanges.subscribe((data) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !this.businessCostForm.pristine &&
                        this.isRenderCompleted
                    ) {
                        this.setOutputData(null);
                    } else if (this.businessCostForm["clearText"]) {
                        this.businessCostForm.updateValueAndValidity();
                        this.setOutputData({
                            submitResult: false,
                            currencyText: this.getCurrencyText(),
                            formValue: this.businessCostForm.value,
                            isValid: this.businessCostForm.valid,
                            isDirty: true,
                        });
                        this.businessCostForm["clearText"] = false;
                    }
                });
            });
    }

    private initFormData() {
        let _data = this.initEmptyData();
        if (this.data) _data = this.data;

        if (this.businessCostForm && this.businessCostForm.controls) {
            this.businessCostForm.controls["idRepBusinessCosts"].setValue(
                _data.idRepBusinessCosts || ""
            );
            this.businessCostForm.controls["principal"].setValue(
                _data.idPerson || ""
            );
            this.businessCostForm.controls["invoice"].setValue(
                _data.invoiceNr || ""
            );
            this.businessCostForm.controls["date"].setValue(
                _data.invoiceDate != null && !isEmpty(_data.invoiceDate)
                    ? parse(_data.invoiceDate, "dd.MM.yyyy", new Date())
                    : ""
            );
            this.businessCostForm.controls["currency"].setValue(
                _data.idRepCurrencyCode || ""
            );
            this.businessCostForm.controls["controlAmount"].setValue(
                isNil(_data.amount) ? "" : _data.amount
            );
            this.businessCostForm.controls["prePayment"].setValue(
                _data.doneDate ? true : false
            );
            this.businessCostForm.controls["prePaymentDate"].setValue(
                _data.doneDate != null && !isEmpty(_data.doneDate)
                    ? parse(_data.doneDate, "dd.MM.yyyy", new Date())
                    : ""
            );
            this.businessCostForm.controls["vat1"].setValue(
                _data.idRepVat1 || ""
            );
            this.businessCostForm.controls["vat1Amount"].setValue(
                _data.vatAmount1 || ""
            );
            this.businessCostForm.controls["vat2"].setValue(
                _data.idRepVat2 || ""
            );
            this.businessCostForm.controls["vat2Amount"].setValue(
                _data.vatAmount2 || ""
            );
            this.businessCostForm.controls["notes"].setValue(_data.notes || "");
            this.businessCostForm.controls["company"].setValue(
                _data.company || ""
            );
        } else {
            this.businessCostForm = this.formBuilder.group({
                idRepBusinessCosts: [
                    _data.idRepBusinessCosts || "",
                    Validators.required,
                ],
                principal: [_data.idPerson || "", Validators.required],
                invoice: [_data.invoiceNr, Validators.required],
                date: [
                    _data.invoiceDate != null && !isEmpty(_data.invoiceDate)
                        ? parse(_data.invoiceDate, "dd.MM.yyyy", new Date())
                        : "",
                    Validators.required,
                ],
                currency: [_data.idRepCurrencyCode || "", Validators.required],
                controlAmount: [
                    isNil(_data.amount) ? "" : _data.amount,
                    Validators.required,
                ],
                prePayment: _data.doneDate ? true : false,
                prePaymentDate:
                    _data.doneDate != null && !isEmpty(_data.doneDate)
                        ? parse(_data.doneDate, "dd.MM.yyyy", new Date())
                        : "",
                vat1: [_data.idRepVat1 || ""],
                vat1Amount: [_data.vatAmount1],
                vat2: [_data.idRepVat2 || ""],
                vat2Amount: [_data.vatAmount2],
                notes: _data.notes,
                company: _data.company || "",
            });
            Uti.setEnableForMultipleFormControl(
                this.businessCostForm,
                ["vat1", "vat2", "vat1Amount", "vat2Amount"],
                false
            );
        }

        setTimeout(() => {
            if (!this.businessCostForm.controls["prePayment"].value)
                this.businessCostForm.controls["prePaymentDate"].disable();
            else this.businessCostForm.controls["prePaymentDate"].enable();
            if (this.listComboBox && this.listComboBox.BusinessCostCompany) {
                // if (this.data)
                //     this.getDataForVATDDL(this.data.idPerson);

                if (this.multiSelectCompany)
                    this.multiSelectCompany.selectedItem =
                        this.listComboBox.BusinessCostCompany.find(
                            (item) =>
                                item.idValue ==
                                this.businessCostForm.controls["company"].value
                        );
            }

            this.businessCostForm.updateValueAndValidity();
        });
        // if (_data.idPerson && this.listComboBox && this.listComboBox.principal)
        //     this.getDataForVATDDL(_data.idPerson);
        this.businessCostForm["submitted"] = false;
    }

    private initEmptyData(): any {
        return {
            idRepBusinessCosts: null,
            idRepCurrencyCode: null,
            idPerson: null,
            invoiceNr: null,
            invoiceDate: null,
            amount: null,
            notes: null,
            doneDate: null,
            idRepVat1: null,
            vatAmount1: null,
            idRepVat2: null,
            vatAmount2: null,
            isActive: null,
            idPersonToCompany: null,
        };
    }

    public onSubmit(event?: any) {
        this.businessCostForm["submitted"] = true;
        try {
            this.businessCostForm.updateValueAndValidity();
            if (!this.businessCostForm.dirty) {
                this.setOutputData(false);
                return;
            }
            if (!this.formValidate()) {
                this.setOutputData(false);
                //this.toasterService.pop('warning', 'Validation Fail', 'There are some fields do not pass validation.');
                return;
            }

            if (this.xnFileExplorerComponent && this.isDeletedFiles) {
                this.xnFileExplorerComponent.saveUpdateData();
                this.isDeletedFiles = false;
            }
            this.createCampaignCost();
        } catch (ex) {
            this.businessCostForm["submitted"] = true;
        }
    }

    private setOutputData(submitResult: any, data?: any) {
        if (typeof data !== "undefined") {
            this.outputModel = data;
        } else {
            this.outputModel = {
                submitResult: submitResult,
                currencyText: this.getCurrencyText(),
                formValue: this.businessCostForm.value,
                isValid: this.businessCostForm.valid,
                isDirty: this.businessCostForm.dirty,
            };
        }
        this.outputData.emit(this.outputModel);
    }

    private getCurrencyText() {
        const currentCurrency = this.listComboBox.currency.find((x) => {
            return x.idValue == this.businessCostForm.value["currency"];
        });
        if (!currentCurrency || !currentCurrency.idValue) return "";
        return currentCurrency.textValue;
    }

    private createCampaignCost() {
        this.campaingServiceSubscription = this.campaingService
            .saveCampaignCosts(this.prepareSubmitCreateData())
            .subscribe(
                (response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (
                            !response ||
                            response.statusCode != ApiMethodResultId.Success ||
                            !response.item
                        ) {
                            return;
                        }
                        this.saveData.emit({
                            submitResult: true,
                            formValue: this.businessCostForm.value,
                            isValid: true,
                            isDirty: false,
                            returnID: response.item.returnID,
                        });
                        this.idSalesCampaignWizard = response.item.returnID;
                        this.businessCostForm.markAsPristine();
                        this.allowForFormValueChange();
                    });
                },
                (err) => {
                    this.saveData.emit({
                        submitResult: false,
                        formValue: this.businessCostForm.value,
                        isValid: this.businessCostForm.valid,
                        isDirty: false,
                        returnID: this.idSalesCampaignWizard
                            ? this.idSalesCampaignWizard.toString()
                            : "",
                    });
                    this.saveData.emit(this.outputModel);
                }
            );
    }

    private formValidate(): boolean {
        return this.businessCostForm.valid;
    }

    private prepareSubmitCreateData() {
        this.businessCostForm.updateValueAndValidity();
        const model = this.businessCostForm.value;
        return {
            CampaignCosts: [
                {
                    IdRepBusinessCosts: model.idRepBusinessCosts,
                    IdRepCurrencyCode: model.currency,
                    IdPerson: model.principal,
                    InvoiceNr: model.invoice,
                    InvoiceDate:
                        model.date != null
                            ? this.datePipe.transform(
                                  model.date,
                                  this.consts.dateFormatInDataBase
                              )
                            : null,
                    Amount: model.controlAmount,
                    Notes: model.notes,
                    DoneDate:
                        this.businessCostForm.controls["prePaymentDate"] &&
                        this.businessCostForm.controls["prePaymentDate"]
                            .value != null
                            ? this.datePipe.transform(
                                  this.businessCostForm.controls[
                                      "prePaymentDate"
                                  ].value,
                                  this.consts.dateFormatInDataBase
                              )
                            : null,
                    IdRepVat1: model.vat1 || null,
                    VatAmount1:
                        this.vat1AmountNumber.nativeElement.value || null,
                    IdRepVat2: model.vat2 || null,
                    VatAmount2:
                        this.vat2AmountNumber.nativeElement.value || null,
                    IsActive: true,
                    IdBusinessCosts: this.data
                        ? this.data.idBusinessCosts
                        : null,
                    IdPersonToCompany:
                        isNil(model.company) || isEmpty(model.company)
                            ? null
                            : model.company,
                },
            ],
        };
    }

    public onChangePrincipal(event: any) {
        if (!this.principalCombobox || !this.principalCombobox.selectedValue) {
            this.allowForFormValueChange();
            return;
        }
        this.getDataForVATDDL(this.principalCombobox.selectedValue);
    }

    public onDeletedFiles($event: any) {
        this.setOutputData(null, {
            submitResult: null,
            currencyText: this.getCurrencyText(),
            formValue: this.businessCostForm.value,
            isValid: this.businessCostForm.valid,
            isDirty: true,
        });
        this.isDeletedFiles = true;
    }

    private getDataForVATDDL(idPerson: any) {
        if (!this.listComboBox || !this.listComboBox.principal) {
            this.allowForFormValueChange();
            return;
        }
        const filter = this.listComboBox.principal.find(
            (item) => item.idValue === idPerson
        );
        if (!filter) {
            this.allowForFormValueChange();
            return;
        }
        this.idRepIsoCountryCode = filter.idRepIsoCountryCode;
        this.comServiceSubscription = this.comService
            .getComboBoxDataByFilter(-1, filter.idRepIsoCountryCode, "vat")
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    let data = response.item;
                    this.setDatasourceForVat(filter, data);
                });
            });
    }

    private setDatasourceForVat(filter: any, data: any) {
        this.isRenderCompleted = false;
        if (!data || !data["vat_" + filter.idRepIsoCountryCode]) {
            this.listComboBox["vat"] = null;
            // this.isRenderCompleted = false;
            //console.log('=========================================');
            Uti.setEnableForMultipleFormControl(
                this.businessCostForm,
                ["vat1", "vat2", "vat1Amount", "vat2Amount"],
                false
            );
            Uti.setValueForMultipleFormControl(
                this.businessCostForm,
                ["vat1", "vat2", "vat1Amount", "vat2Amount"],
                null
            );
            this.vat1AmountNumber.nativeElement.value = null;
            this.vat2AmountNumber.nativeElement.value = null;
            this.businessCostForm.updateValueAndValidity();
            this.allowForFormValueChange();
        } else {
            this.listComboBox["vat"] =
                data["vat_" + filter.idRepIsoCountryCode];
            setTimeout(() => {
                Uti.setEnableForMultipleFormControl(
                    this.businessCostForm,
                    ["vat1", "vat2", "vat1Amount", "vat2Amount"],
                    true
                );
                this.businessCostForm.updateValueAndValidity();
                if (this.data) {
                    this.businessCostForm.controls["vat1"].setValue(
                        this.data["idRepVat1"]
                    );
                    this.businessCostForm.controls["vat2"].setValue(
                        this.data["idRepVat2"]
                    );
                    this.businessCostForm.controls["vat1Amount"].setValue(
                        this.data["vatAmount1"]
                    );
                    this.businessCostForm.controls["vat2Amount"].setValue(
                        this.data["vatAmount2"]
                    );
                    this.vat1AmountNumber.nativeElement.value =
                        this.data["vatAmount1"];
                    this.vat2AmountNumber.nativeElement.value =
                        this.data["vatAmount2"];
                }
                this.allowForFormValueChange();
            }, 500);
        }
    }

    private allowForFormValueChange(times?: number) {
        setTimeout(() => {
            this.isRenderCompleted = true;
        }, times || 1000);
    }

    public onChangeControlAmount(event: any) {
        if (!isInteger(event)) {
            this.businessCostForm.controls["controlAmount"].setValue(
                parseInt(event, null)
            );
            this.businessCostForm.controls[
                "controlAmount"
            ].updateValueAndValidity();
        }
    }

    public onChangeVat1Amount(event: any) {
        if (!isInteger(event)) {
            this.businessCostForm.controls["vat1Amount"].setValue(
                parseInt(event, null)
            );
            this.businessCostForm.controls[
                "vat1Amount"
            ].updateValueAndValidity();
        }
    }

    public onChangeVat2Amount(event: any) {
        if (!isInteger(event)) {
            this.businessCostForm.controls["vat2Amount"].setValue(
                parseInt(event, null)
            );
            this.businessCostForm.controls[
                "vat2Amount"
            ].updateValueAndValidity();
        }
    }

    public onChangePrePayment($event) {
        this.businessCostForm.controls["prePaymentDate"].setValue(
            $event.checked ? new Date() : null
        );
        const prePaymentDateControl =
            this.businessCostForm.controls["prePaymentDate"];
        // if (event) {
        //     let defaultDate = this.datePipe.transform((new Date()), 'MM/dd/yyyy');
        //     const invoiceDate = this.businessCostForm.controls['date'];
        //     // 1. prepaymentDate is empty: prepaymentDate following invoiceDate
        //     // 2. prepaymentDate is not empty: prepaymentDate following invoiceDate if prepaymentDate < invoiceDate
        //     if ((isNil(prePaymentDateControl.value) && invoiceDate.value != null) ||
        //         (!isNil(prePaymentDateControl.value) && !isNil(invoiceDate.value) &&
        //             (new Date(invoiceDate.value)).getTime() - (new Date(prePaymentDateControl.value)).getTime() >= 0)) {
        //         defaultDate = this.datePipe.transform(invoiceDate.value, 'MM/dd/yyyy');
        //     } else if (!prePaymentDateControl.value)
        //         prePaymentDateControl.setValue(defaultDate);
        //     prePaymentDateControl.enable();
        // } else
        //     prePaymentDateControl.disable();
        if ($event.checked) {
            prePaymentDateControl.enable();
        } else {
            prePaymentDateControl.disable();
        }

        this.controlFocus.initControl(true);
    }

    private onChangeInvoiceDate(event) {
        if (!event) return;

        if (isString(event)) event = new Date(event);

        if (event.getTime() - new Date().getTime() > 0) {
            //setTimeout(() => {
            //    this.businessCostForm.controls['date'].setValue(this.datePipe.transform(new Date(), 'MM/dd/yyyy'));
            //});
        }
        const prePaymentDateControll =
            this.businessCostForm.controls["prePaymentDate"];
        const prePaymentControll = this.businessCostForm.controls["prePayment"];
        if (
            prePaymentControll.value &&
            event.getTime() - new Date(prePaymentDateControll.value).getTime() >
                0
        )
            prePaymentDateControll.setValue(
                this.datePipe.transform(event, "MM/dd/yyyy")
            );
    }

    private onChangePrePaymentDate(event) {
        if (!event) return;

        if (isString(event)) event = new Date(event);
        const invoiceDateControll = this.businessCostForm.controls["date"];
        if (
            event.getTime() - new Date(invoiceDateControll.value).getTime() <
            0
        ) {
            setTimeout(() => {
                this.businessCostForm.controls["prePaymentDate"].setValue(
                    this.datePipe.transform(
                        invoiceDateControll.value,
                        "MM/dd/yyyy"
                    )
                );
            });
        }
    }

    public selectedIndexChanged(event) {
        if (this.multiSelectCompany && this.multiSelectCompany.selectedItem) {
            const idValue = this.multiSelectCompany.selectedItem.idValue;
            this.businessCostForm.controls["company"].setValue(
                idValue.toString()
            );
            // this.businessCostForm.controls['company'].updateValueAndValidity();
        }
    }

    public onDateChanged(controlName) {
        switch (controlName) {
            case "invoiceDate":
                this.onChangeInvoiceDate(this.invoiceDate.value);
                break;
            case "prePaymentDate":
                this.onChangePrePaymentDate(this.prePaymentDate.value);
                break;
        }
    }

    itemFormatter(index, item) {
        let newContent =
            '<div class="col-md-12  col-lg-12 xn-wj-ddl-item"><div class="col-sm-5 no-padding-left" >{personType}</div><div class="col-sm-1 hidden">-----</div><div class="col-sm-5 no-padding-right border-left" >{company}&nbsp;</div></div>';
        newContent = newContent.replace("{personType}", item.personType);
        newContent = newContent.replace("{company}", item.company);
        return newContent;
    }

    private subscribeData() {
        this.globalPropertiesStateSubscription =
            this.globalPropertiesState.subscribe((globalProperties: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (globalProperties && globalProperties.length) {
                        this.globalDateFormat =
                            this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                                globalProperties
                            );
                        let propShowDropdownWhenFocus =
                            this.propertyPanelService.getItemRecursive(
                                globalProperties,
                                "ShowDropdownWhenFocus"
                            );
                        if (propShowDropdownWhenFocus) {
                            this.dontShowCalendarWhenFocus =
                                propShowDropdownWhenFocus.value;
                        }
                    }
                });
            });
    }
}
