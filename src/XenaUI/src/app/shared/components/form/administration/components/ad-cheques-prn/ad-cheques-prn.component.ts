import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
    ComboBoxTypeConstant,
    PaymentMethod
} from 'app/app.constants';
import { Uti, CustomValidators } from 'app/utilities';
import isEmpty from 'lodash-es/isEmpty';

import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Subscription } from 'rxjs/Subscription';
import {PersonService, CommonService, AppErrorHandler, WidgetTemplateSettingService} from 'app/services';
import {FormGroupChild, ApiResultResponse, WidgetDetail} from 'app/models';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
    selector: 'ad-cheques-prn',
    templateUrl: './ad-cheques-prn.component.html'
})
export class AdChequesPRNComponent implements OnInit, OnDestroy {
    private adChequesPRNFormGroup: FormGroup;
    private commonConfig: any;
    public isRenderForm = false;
    public paymentTypeList: any[] = [];
    private listComboBox: any;
    private widgetTemplateSettingServiceSubscription: Subscription;

    private commonServiceSubscription: Subscription;
    private getMandantDataSubscription: Subscription;
    private REQUEST_STRING = {
        'Request':
            {
                'ModuleName': 'GlobalModule',
                'ServiceName': 'GlobalService',
                'Data':
                    '{"MethodName" : "SpAppWg002GetGridCashProviderContract", "CrudType"  : null, "Object" : null,"Mode" :  null, "WidgetTitle" : "CC PRN Table", "IsDisplayHiddenFieldWithMsg" : "1",<<LoginInformation>>,<<InputParameter>>}'
            }
    };
    public principalLabel: string;
    public mandantLabel: string;
    public countryLabel: string;
    public currencyLabel: string;
    public cashProviderLabel: string;
    public prnLabel: string;


    @Input() idPerson: string;
    @Input() set initInformation(information: any) {
        if (information && information.parentFormGroup && information.formConfig) {
            this.commonConfig = information.formConfig['commonConfig'];

            if (!information.parentFormGroup.contains('adChequesPRNFormGroup'))
                information.parentFormGroup.addControl('adChequesPRNFormGroup', this.adChequesPRNFormGroup);
            else
                information.parentFormGroup.controls['adChequesPRNFormGroup'] = this.adChequesPRNFormGroup;
            this.initFormGroup.emit({ form: this.adChequesPRNFormGroup, name: 'adChequesPRNFormGroup' });
        }
    }
    @Output() initFormGroup: EventEmitter<FormGroupChild> = new EventEmitter();
    @Output() onPaymentMethodChanged = new EventEmitter<any>();

    @ViewChild('principal') principalCombobox: AngularMultiSelect;

    constructor(
        private ref: ChangeDetectorRef,
        private store: Store<AppState>,
        private personService: PersonService,
        private commonService: CommonService,
        private forBuilder: FormBuilder,
        private appErrorHandler: AppErrorHandler,
        private widgetTemplateSettingService: WidgetTemplateSettingService

    ) {
        this.createEmptyData();

        const widgetDetail: WidgetDetail = new WidgetDetail({
            idRepWidgetType: 2,
            moduleName: 'Administration',
            request: JSON.stringify(this.REQUEST_STRING)
        });
        this.widgetTemplateSettingServiceSubscription = this.widgetTemplateSettingService.getWidgetDetailByRequestString(widgetDetail, {IdPerson: this.idPerson})
            .subscribe((response: WidgetDetail) => {
                this.appErrorHandler.executeAction(() => {
                    const data = response.contentDetail.columnSettings;
                    this.principalLabel = data['_Company'].ColumnHeader;
                    this.cashProviderLabel = data['_DefaultValue'].ColumnHeader;
                    this.mandantLabel = data['__Company'].ColumnHeader;
                    this.countryLabel = data['DefaultValue'].ColumnHeader;
                    this.currencyLabel = data['CurrencyCode'].ColumnHeader;
                    this.prnLabel = data['ContractNr'].ColumnHeader;
                });

            });
    }

    public ngOnInit() {
        this.setUpDataForForm();
    }
    public ngOnDestroy() {
        this.unsubscribeMandant();

    }

    private unsubscribeMandant() {
        Uti.unsubscribe(this);
    }

    public resetForm() {
        this.setDefaultValueForControl();
        this.unsubscribeMandant();
    }

    private setUpDataForForm() {
        this.getDropdownlistData();
    }

    private createEmptyData() {
        this.adChequesPRNFormGroup = this.forBuilder.group({
            isActive: true,
            paymentMethod: ['', Validators.required],
            paymentMethodText: null,
            principal: ['', Validators.required],
            principalText: null,
            mandant: ['', Validators.required],
            mandantText: null,
            country: ['', Validators.required],
            countryText: null,
            currency: ['', Validators.required],
            currencyText: null,
            prn: [null, CustomValidators.required]
        });

        Uti.registerFormControlType(this.adChequesPRNFormGroup, {
            dropdown: 'paymentMethod;principal;mandant;country;currency'
        });
    }

    private getDropdownlistData() {
        this.commonServiceSubscription = this.commonService.getListComboBox(
            ComboBoxTypeConstant.principal + ',' +
            ComboBoxTypeConstant.countryCode + ',' +
            ComboBoxTypeConstant.currency + ',' +
            ComboBoxTypeConstant.paymentType
        )
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.countryCode) {
                        return;
                    }
                    this.listComboBox = response.item;

                    if (this.listComboBox.paymentType && this.listComboBox.paymentType.length) {
                        this.paymentTypeList = this.listComboBox.paymentType.filter(pt => pt.idValue == PaymentMethod.CHECK || pt.idValue == PaymentMethod.CREDIT_CARD);
                    }

                    this.initDataForForm();
                });
            });
    }

    private initDataForForm() {
        if (this.isRenderForm || isEmpty(this.listComboBox)) { return; }
        this.regisValueChange();
        this.setDefaultValueForControl();
        this.isRenderForm = true;
    }

    private formGroupSubscriptionPaymentMethod: Subscription;
    private formGroupSubscriptionPrincipal: Subscription;
    private formGroupSubscriptionCountry: Subscription;
    private formGroupSubscriptionCurrency: Subscription;
    private regisValueChange() {
        if (this.formGroupSubscriptionPaymentMethod) this.formGroupSubscriptionPaymentMethod.unsubscribe();
        if (this.formGroupSubscriptionPrincipal) this.formGroupSubscriptionPrincipal.unsubscribe();
        if (this.formGroupSubscriptionCountry) this.formGroupSubscriptionCountry.unsubscribe();
        if (this.formGroupSubscriptionCurrency) this.formGroupSubscriptionCurrency.unsubscribe();

        this.formGroupSubscriptionPaymentMethod = Uti.updateFormComboboxValue(this.adChequesPRNFormGroup, this.listComboBox.paymentType,
            (this.adChequesPRNFormGroup), 'paymentMethod', 'paymentMethodText');

        this.formGroupSubscriptionPrincipal = Uti.updateFormComboboxValue(this.adChequesPRNFormGroup, this.listComboBox.principal,
            (this.adChequesPRNFormGroup), 'principal', 'principalText');

        this.formGroupSubscriptionCountry = Uti.updateFormComboboxValue(this.adChequesPRNFormGroup, this.listComboBox.countryCode,
            (this.adChequesPRNFormGroup), 'country', 'countryText');

        this.formGroupSubscriptionCurrency = Uti.updateFormComboboxValue(this.adChequesPRNFormGroup, this.listComboBox.currency,
            (this.adChequesPRNFormGroup), 'currency', 'currencyText');
    }

    private setDefaultValueForControl() {
        this.setDefaultValueForActive();
    }

    public setDefaultValueForActive() {
        (<any>(<any>this.adChequesPRNFormGroup.controls).isActive).setValue(true);
    }

    public onChangePaymentMethod(e) {
        if (!this.adChequesPRNFormGroup.pristine) {
            this.onPaymentMethodChanged.emit(this.adChequesPRNFormGroup.value['paymentMethod']);
        }
    }

    private formGroupSubscriptionMandant: Subscription;
    public onChangePrincipal($event: any) {
        if (!this.principalCombobox || !this.principalCombobox.selectedValue) {
            this.listComboBox.mandant = [];
            this.unsubscribeMandant();
            this.ref.detectChanges();
            this.adChequesPRNFormGroup.markAsPristine();
            return;
        }
        this.getMandantDataSubscription = this.commonService.getComboBoxDataByCondition('Mandant', this.principalCombobox.selectedValue).subscribe(
            (response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    let dataResult = response.item;
                    if (!dataResult || !dataResult.mandant) {
                        this.listComboBox.mandant = [];
                        this.adChequesPRNFormGroup.markAsPristine();
                    } else {
                        this.listComboBox.mandant = dataResult.mandant;
                        this.adChequesPRNFormGroup.markAsPristine();

                        if (this.formGroupSubscriptionMandant) this.formGroupSubscriptionMandant.unsubscribe();

                        this.formGroupSubscriptionMandant = Uti.updateFormComboboxValue(this.adChequesPRNFormGroup, this.listComboBox.mandant,
                            (this.adChequesPRNFormGroup), 'mandant', 'mandantText');
                    }
                    this.ref.detectChanges();
                });
            });
    }
}
