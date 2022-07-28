import {
    Component, Input, EventEmitter, Output,
    OnInit, ViewChild, OnDestroy
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    CommonService,
    CampaignService,
    AppErrorHandler,
    PropertyPanelService
} from 'app/services';
import { ComboBoxTypeConstant, Configuration } from 'app/app.constants';
import { Uti, CustomValidators } from 'app/utilities';
import { Country, ApiResultResponse } from 'app/models';
import { Subscription } from 'rxjs/Subscription';
import { parse } from 'date-fns/esm';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { CheckCampaignNumber } from 'app/models/apimodel';
import { IMyOptions } from 'app/shared/components/xn-control/xn-date-picker/ngx-my-date-picker/interfaces/my-options.interface';
import { ControlFocusComponent } from 'app/shared/components/form';
import isEmpty from 'lodash-es/isEmpty';
import { XnCountryCheckListComponent } from 'app/shared/components/xn-control';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
    selector: 'campaign-country-t1-form',
    styleUrls: ['./campaign-country-t1-form.component.scss'],
    templateUrl: './campaign-country-t1-form.component.html'
})

export class CampaignCountryT1FormComponent extends BaseComponent implements OnInit, OnDestroy {
    public campaignCountryForm: FormGroup;
    public globalDateFormat;
    public dontShowCalendarWhenFocus: boolean;
    public existedCampaignNumber: boolean = false;
    public isEditMode = false;
    public booleanObj = {
        true: true,
        false: false
    };
    public myDatePickerOptions: IMyOptions;
    public itemFormatterShippingAddress = this.customItemFormatterShippingAddress.bind(this);

    private countryCheckListData: Array<any>;
    private countryEditListData: Array<any> = [];
    private campaignWizardCountries: Array<any> = [];
    private mandantList: Array<any>;
    private serviceProviderList: Array<any>;
    private wareHouseList: Array<any>;
    private campaignAddressList: Array<any>;
    private campaignGroupList: Array<any>;
    private campaignNumberList: Array<any>;
    private isCountryChange = false;
    private debounceTimer: any = null;

    private commonServiceSubscription: Subscription;
    private campaignServiceSubscription: Subscription;
    private campaignCountryFormValueChangesSubscription: Subscription;
    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;
    private mandantValueChangesSubscription: Subscription;

    private idRepSalesCampaignNamePrefixValueChangesSubscription: Subscription;
    private campaignNr1ValueChangesSubscription: Subscription;
    private campaignNr2ValueChangesSubscription: Subscription;
    private campaignNr3ValueChangesSubscription: Subscription;

    private checkCampaignNumberSubscription: Subscription

    private outputModel: {
        submitResult?: boolean,
        formValue: any,
        isValid?: boolean,
        isDirty?: boolean,
        returnID?: any,
        errorMessage?: string
    };

    private supportCampaignNumberPrefix: boolean = false;

    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @Output() saveData: EventEmitter<any> = new EventEmitter();
    @Output() showDialog: EventEmitter<any> = new EventEmitter();

    private _idSalesCampaignWizard: number;
    @Input() set idSalesCampaignWizard(data: number) {
        this._idSalesCampaignWizard = data;
        this.loadData();
    }
    @Input() isClone = false;

    get idSalesCampaignWizard() {
        return this._idSalesCampaignWizard;
    }

    @ViewChild('mandant') mandantCombobox: AngularMultiSelect;
    @ViewChild('campaignGroup') campaignGroup: AngularMultiSelect;
    @ViewChild('serviceProvider') serviceProvider: AngularMultiSelect;
    @ViewChild('wareHouse') wareHouse: AngularMultiSelect;
    @ViewChild('shippingAddress') shippingAddress: AngularMultiSelect;
    @ViewChild('returnAddress') returnAddress: AngularMultiSelect;
    @ViewChild('countryCheckList') countryCheckList: XnCountryCheckListComponent;
    @ViewChild('controlFocusComponent') controlFocusComponent: ControlFocusComponent;

    constructor(private commonService: CommonService,
        private consts: Configuration,
        private campaignService: CampaignService,
        private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private propertyPanelService: PropertyPanelService,
        protected router: Router
    ) {
        super(router);
        this.globalPropertiesState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, ModuleList.Base.moduleNameTrim).globalProperties);
        this.supportCampaignNumberPrefix = Configuration.PublicSettings.supportCampaignNumberPrefix;
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
        this.initData();
        this.subscribeGlobalProperties();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public onDateChanged($event) {
        console.log($event);
    }

    public campaignTypeChanged() {
        if (this.campaignCountryForm.value.campaignType === 'master') {
            if (!this.campaignCountryForm.controls['postageDate'].errors) {
                this.campaignCountryForm.controls['postageDate'].setValidators(Validators.required);
                if (!this.campaignCountryForm.controls['postageDate'].value)
                    this.campaignCountryForm.controls['postageDate'].setErrors({ 'required': true });
                this.campaignCountryForm.updateValueAndValidity();
            }
        } else {
            this.campaignCountryForm.controls['postageDate'].clearValidators();
            this.campaignCountryForm.controls['postageDate'].setErrors(null);
        }
    }

    subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription = this.globalPropertiesState.subscribe((globalProperties: any) => {
            this.appErrorHandler.executeAction(() => {
                if (globalProperties) {
                    this.globalDateFormat = this.propertyPanelService.buildGlobalInputDateFormatFromProperties(globalProperties);
                    this.dontShowCalendarWhenFocus = this.propertyPanelService.getValueDropdownFromGlobalProperties(globalProperties);
                    this.myDatePickerOptions = {
                        // other options...
                        dateFormat: this.globalDateFormat,
                        appendSelectorToBody: true
                    }
                }
            });
        });
    }

    private loadData() {
        if (this.idSalesCampaignWizard) {
            // Load form existing data
            this.campaignServiceSubscription = this.campaignService.getCampaignWizardT1(this.idSalesCampaignWizard)
                .subscribe((response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!Uti.isResquestSuccess(response)) {
                            return;
                        }

                        this.isEditMode = true;

                        if (response.item['collectionData']) {
                            const data = response.item['collectionData'][0];
                            // Bug: http://mantis.xena.local/view.php?id=919
                            if (this.isClone) {
                                data['idRepSalesCampaignNamePrefix'].value = '';
                                data['campaignNr1'].value = '';
                                data['campaignNr2'].value = '';
                                data['campaignNr3'].value = '';
                            }
                            this.createFormGroupWithData(data);

                            if (this.isEditMode && !this.isClone) {
                                this.campaignCountryForm.controls['campaignMode'].clearValidators();
                                this.campaignCountryForm.controls['campaignMode'].setErrors(null);
                                this.campaignCountryForm.controls['campaignMode'].disable();
                            } else {
                                this.campaignCountryForm.controls['campaignMode'].setValidators(Validators.required);
                                this.campaignCountryForm.controls['campaignMode'].setErrors({ 'required': true });
                                this.campaignCountryForm.controls['campaignMode'].enable();
                            }

                            this.subscribeFormValueChange();
                        }
                    });
                });
        } else {
            this.isEditMode = false;
            this.createFormGroup();
            this.subscribeFormValueChange();

        }
        this.campaignServiceSubscription = this.campaignService.getCampaignWizardCountry(this.idSalesCampaignWizard)
            .subscribe(rs => {
                this.appErrorHandler.executeAction(() => {
                    if (rs && rs.item) {
                        this.countryCheckListData = this.getValidCombobox(rs.item, ComboBoxTypeConstant.countryCode);
                        if (this.idSalesCampaignWizard) {
                            this.countryEditListData = this.countryCheckListData.filter(p => p.isActive == '1');
                            if (this.countryEditListData) {
                                this.countryEditListData = this.countryEditListData.map(p => {
                                    return {
                                        IdCountrylanguage: +p.idValue,
                                        IsActive: true,
                                        IdSalesCampaignWizardItems: +p.idSalesCampaignWizardItems
                                    };
                                });
                            }
                        }
                    }
                });
            });
    }

    /**
     * initData
     */
    private initData() {
        const keys: Array<number> = [
            ComboBoxTypeConstant.allMandant,
            ComboBoxTypeConstant.serviceProvider,
            ComboBoxTypeConstant.wareHouse,
            ComboBoxTypeConstant.campaignGroup,
            ComboBoxTypeConstant.campaignNamePrefix
        ];

        this.commonServiceSubscription = this.commonService.getListComboBox(keys.join(','))
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    this.mandantList = this.getValidCombobox(response.item, ComboBoxTypeConstant.allMandant);
                    this.serviceProviderList = this.getValidCombobox(response.item, ComboBoxTypeConstant.serviceProvider);
                    this.wareHouseList = this.getValidCombobox(response.item, ComboBoxTypeConstant.wareHouse);
                    this.campaignGroupList = this.getValidCombobox(response.item, ComboBoxTypeConstant.campaignGroup);

                    if (this.supportCampaignNumberPrefix) {
                        this.campaignNumberList = this.getValidCombobox(response.item, ComboBoxTypeConstant.campaignNamePrefix);
                    }

                    this.initFocusControl();
                });
            });
    }

    private getValidCombobox(listComboBox: any, identificationKey: number, filterBy?: string) {
        const keys = Object.keys(ComboBoxTypeConstant);
        let idx: string;
        keys.forEach((key) => {
            if (ComboBoxTypeConstant[key] == identificationKey) {
                idx = key;
            }
        });

        let options: Array<any> = listComboBox[idx];
        if (filterBy)
            options = listComboBox[idx + '_' + filterBy];

        if (options) {
            options.forEach(option => {
                if (option.textValue === '') {
                    option.textValue = '--------';
                }
            });
        }

        return options;
    }

    private createFormGroup() {
        this.campaignCountryForm = new FormGroup({
            campaignMode: new FormControl('newCampaign', Validators.required),
            campaignType: new FormControl('', Validators.required),
            campaignName: new FormControl('', CustomValidators.required),
            campaignGroup: new FormControl('', Validators.required),
            mandant: new FormControl('', Validators.required),
            serviceProvider: new FormControl('', Validators.required),
            wareHouse: new FormControl('', Validators.required),
            shippingAddress: new FormControl('', Validators.required),
            returnAddress: new FormControl('', Validators.required),
            postageDate: new FormControl(null),
            postageCost: new FormControl('', Validators.required),
            selection: new FormControl('', Validators.required),
            collate: new FormControl('', Validators.required),
            gift: new FormControl('', Validators.required),
            mail: new FormControl('', Validators.required),
            track: new FormControl('', Validators.required),
            inter: new FormControl('', Validators.required),
            asile: new FormControl('', Validators.required),
            catalog: new FormControl('', Validators.required),
            birthday: new FormControl('', Validators.required),
            // campaignNumberPrefix: new FormControl('', Validators.required),
            campaignNr1: new FormControl('', Validators.required),
            campaignNr2: new FormControl(''),
            campaignNr3: new FormControl('')
        });
        if (this.supportCampaignNumberPrefix) {
            this.campaignCountryForm.setControl('campaignNumberPrefix', new FormControl('', Validators.required));
        }
        this.registerFormControlType();
        this.campaignCountryForm['submitted'] = false;
    }

    private registerFormControlType() {
        // Uti.registerFormControlType(this.campaignCountryForm, {
        //     dropdown: 'campaignNumberPrefix;campaignGroup;mandant;serviceProvider;wareHouse;shippingAddress;returnAddress',
        //     datetime: 'postageDate'
        // });
    }

    /**
     * getCampaignType
     * @param data
     */
    private getCampaignType(data: any) {
        let campaignType = '';

        if (data.isMaster.value == 'True') {
            campaignType = 'master';
        }

        if (data.isTrack.value == 'True') {
            campaignType = 'track';
        }

        if (data.isInter.value == 'True') {
            campaignType = 'inter';
        }

        if (data.isAsile.value == 'True') {
            campaignType = 'asile';
        }
        return campaignType;
    }

    private buildBooleanRadio(data, fieldName) {
        if (data[fieldName]) {
            if (data[fieldName].value == 'True')
                return true;
            if (data[fieldName].value == 'False')
                return false;
        }

        return '';
    }

    private createFormGroupWithData(data: any) {

        const campaignType = this.getCampaignType(data);

        let postageDate: any = '';
        if (data.postageDate.value) {
            try {
                postageDate = Uti.getUTCDate(parse(data.postageDate.value, 'dd.MM.yyyy', new Date()));
            } catch (ex) {
                postageDate = '';
            }
        }

        if (this.campaignCountryForm && this.campaignCountryForm.controls) {
            this.campaignCountryForm.controls['campaignMode'].setValue('newCampaign');
            this.campaignCountryForm.controls['campaignType'].setValue(campaignType);
            this.campaignCountryForm.controls['campaignName'].setValue(data.campaignName.value);
            this.campaignCountryForm.controls['campaignGroup'].setValue(data.idSharingTreeGroups.value);
            this.campaignCountryForm.controls['mandant'].setValue(data.idPersonToMandant.value);
            this.campaignCountryForm.controls['serviceProvider'].setValue(data.idPersonToServiceProvider.value);
            this.campaignCountryForm.controls['wareHouse'].setValue(data.idPersonToWarehouse.value);
            this.campaignCountryForm.controls['shippingAddress'].setValue(data.idPersonInterfaceContactAddressGWToShippingAddress.value);
            this.campaignCountryForm.controls['returnAddress'].setValue(data.idPersonInterfaceContactAddressGWToReturnAddress.value);
            this.campaignCountryForm.controls['postageDate'].setValue(postageDate);
            this.campaignCountryForm.controls['postageCost'].setValue(this.buildBooleanRadio(data, 'isWithPostageCost'));
            this.campaignCountryForm.controls['selection'].setValue(this.buildBooleanRadio(data, 'isWithSelection'));
            this.campaignCountryForm.controls['collate'].setValue(this.buildBooleanRadio(data, 'isWithCollate'));
            this.campaignCountryForm.controls['gift'].setValue(this.buildBooleanRadio(data, 'isWithGift'));
            this.campaignCountryForm.controls['mail'].setValue(this.buildBooleanRadio(data, 'isWithWhitemail'));
            this.campaignCountryForm.controls['track'].setValue(this.buildBooleanRadio(data, 'isWithTrack'));
            this.campaignCountryForm.controls['inter'].setValue(this.buildBooleanRadio(data, 'isWithInter'));
            this.campaignCountryForm.controls['asile'].setValue(this.buildBooleanRadio(data, 'isWithAsile'));
            this.campaignCountryForm.controls['catalog'].setValue(this.buildBooleanRadio(data, 'isWithCatalog'));
            this.campaignCountryForm.controls['birthday'].setValue(this.buildBooleanRadio(data, 'isWithBirthday'));
            if (this.supportCampaignNumberPrefix && this.campaignCountryForm.controls['campaignNumberPrefix']) {
                this.campaignCountryForm.controls['campaignNumberPrefix'].setValue(data.idRepSalesCampaignNamePrefix.value);
            }
            this.campaignCountryForm.controls['campaignNr1'].setValue(data.campaignNr1.value);
            this.campaignCountryForm.controls['campaignNr2'].setValue(data.campaignNr2.value);
            this.campaignCountryForm.controls['campaignNr3'].setValue(data.campaignNr3.value);
        } else {
            this.campaignCountryForm = new FormGroup({
                campaignMode: new FormControl('newCampaign', Validators.required),
                campaignType: new FormControl(campaignType, Validators.required),
                campaignName: new FormControl(data.campaignName.value, CustomValidators.required),
                campaignGroup: new FormControl(data.idSharingTreeGroups.value, Validators.required),
                mandant: new FormControl(data.idPersonToMandant.value, Validators.required),
                serviceProvider: new FormControl(data.idPersonToServiceProvider.value, Validators.required),
                wareHouse: new FormControl(data.idPersonToWarehouse.value, Validators.required),
                shippingAddress: new FormControl(data.idPersonInterfaceContactAddressGWToShippingAddress.value, Validators.required),
                returnAddress: new FormControl(data.idPersonInterfaceContactAddressGWToReturnAddress.value, Validators.required),
                postageDate: new FormControl(postageDate),
                postageCost: new FormControl(this.buildBooleanRadio(data, 'isWithPostageCost'), Validators.required),
                selection: new FormControl(this.buildBooleanRadio(data, 'isWithSelection'), Validators.required),
                collate: new FormControl(this.buildBooleanRadio(data, 'isWithCollate'), Validators.required),
                gift: new FormControl(this.buildBooleanRadio(data, 'isWithGift'), Validators.required),
                mail: new FormControl(this.buildBooleanRadio(data, 'isWithWhitemail'), Validators.required),
                track: new FormControl(this.buildBooleanRadio(data, 'isWithTrack'), Validators.required),
                inter: new FormControl(this.buildBooleanRadio(data, 'isWithInter'), Validators.required),
                asile: new FormControl(this.buildBooleanRadio(data, 'isWithAsile'), Validators.required),
                catalog: new FormControl(this.buildBooleanRadio(data, 'isWithCatalog'), Validators.required),
                birthday: new FormControl(this.buildBooleanRadio(data, 'isWithBirthday'), Validators.required),
                // campaignNumberPrefix: new FormControl(data.idRepSalesCampaignNamePrefix.value, Validators.required),
                campaignNr1: new FormControl(data.campaignNr1.value, Validators.required),
                campaignNr2: new FormControl(data.campaignNr2.value),
                campaignNr3: new FormControl(data.campaignNr3.value)
            });

            if (this.supportCampaignNumberPrefix) {
                this.campaignCountryForm.setControl("campaignNumberPrefix", new FormControl(data.idRepSalesCampaignNamePrefix.value, Validators.required));
            }
        }
        this.campaignCountryForm['submitted'] = false;
        this.registerFormControlType();
        this.commonServiceSubscription = this.commonService.getComboBoxDataByFilter(ComboBoxTypeConstant.campaignWizardAddress, data.idPersonToMandant.value)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    this.campaignAddressList = this.getValidCombobox(response.item, ComboBoxTypeConstant.campaignWizardAddress, data.idPersonToMandant.value);

                    this.initFocusControl();
                });
            });
        this.campaignTypeChanged();
    }

    private prepareSubmitCreateData() {
        const model = this.campaignCountryForm.value;
        const data = {
            'SalesCampaignWizard': [
                {
                    'IdRepSalesCampaignNamePrefix': model.campaignNumberPrefix || '',
                    'IdSharingTreeGroups': +model.campaignGroup,
                    'IdPersonToMandant': +model.mandant,
                    'IdPersonToServiceProvider': +model.serviceProvider,
                    'IdPersonToWarehouse': +model.wareHouse,
                    'IdPersonInterfaceContactAddressGWToShippingAddress': +model.shippingAddress,
                    'IdPersonInterfaceContactAddressGWToReturnAddress': +model.returnAddress,
                    'CampaignNr1': model.campaignNr1,
                    'CampaignNr2': model.campaignNr2,
                    'CampaignNr3': model.campaignNr3,
                    'CampaignName': model.campaignName,
                    'IsMaster': model.campaignType == 'master',
                    'IsTrack': model.campaignType == 'track',
                    'IsInter': model.campaignType == 'inter',
                    'IsAsile': model.campaignType == 'asile',
                    'IsWithPostageCost': model.postageCost,
                    'IsWithSelection': model.selection,
                    'IsWithCollate': model.collate,
                    'IsWithGift': model.gift,
                    'IsWithTrack': model.track,
                    'IsWithInter': model.inter,
                    'IsWithAsile': model.asile,
                    'IsWithCatalog': model.catalog,
                    'IsWithBirthday': model.birthday,
                    'IsWithWhitemail': model.mail,
                    'Notes': '',
                    'IsActive': true,
                    'PostageDate': model.postageDate
                }
            ],
            'CampaignWizardCountries': this.campaignWizardCountries
        };
        if (this.idSalesCampaignWizard && !this.isClone) {
            data.SalesCampaignWizard[0]['IdSalesCampaignWizard'] = +this.idSalesCampaignWizard;
        }
        return data;
    }

    onSubmit(event?: any) {
        this.campaignCountryForm['submitted'] = true;
        try {
            this.campaignCountryForm.updateValueAndValidity();
            let errorMessage;
            if (!this.countryCheckList.hasCheckedItems()) {
                errorMessage = 'Please choose at least 1 country';
            }
            if (this.campaignCountryForm.invalid || this.existedCampaignNumber || !!errorMessage) {
                this.outputModel = {
                    submitResult: false,
                    formValue: this.campaignCountryForm.value,
                    isValid: false,
                    isDirty: this.campaignCountryForm.dirty,
                    errorMessage: errorMessage
                };
                this.outputData.emit(this.outputModel);
                return;
            }

            if (!this.checkFormDirty()) {
                this.outputModel = {
                    submitResult: true,
                    formValue: this.campaignCountryForm.value,
                    isValid: false,
                    isDirty: true,
                    returnID: this.idSalesCampaignWizard
                };
                this.saveData.emit(this.outputModel);
                return;
            }

            this.campaignServiceSubscription = this.campaignService.saveCampaignWizard(this.prepareSubmitCreateData())
                .subscribe(
                    (data) => {
                        this.appErrorHandler.executeAction(() => {
                            if (data && data.item && data.item.returnID) {
                                this.outputModel = {
                                    submitResult: true,
                                    formValue: this.campaignCountryForm.value,
                                    isValid: true,
                                    isDirty: false,
                                    returnID: data.item.returnID
                                };
                                this.idSalesCampaignWizard = data.item.returnID;
                                this.saveData.emit(this.outputModel);
                            }
                            else {
                                this.outputModel = {
                                    submitResult: false,
                                    formValue: this.campaignCountryForm.value,
                                    isValid: !this.campaignCountryForm.invalid,
                                    isDirty: false,
                                    returnID: this.idSalesCampaignWizard ? this.idSalesCampaignWizard.toString() : '',
                                    errorMessage: ''
                                };
                                this.saveData.emit(this.outputModel);
                            }
                        });
                    },
                    (err) => {
                        this.outputModel = { submitResult: false, formValue: this.campaignCountryForm.value, isValid: !this.campaignCountryForm.invalid, isDirty: false, returnID: this.idSalesCampaignWizard ? this.idSalesCampaignWizard.toString() : '' };
                        this.saveData.emit(this.outputModel);
                    });
        } catch (ex) {}

    }

    private checkFormDirty(): boolean {
        return this.campaignCountryForm.dirty || this.isCountryChange;
    }

    getCountryList(data: any) {
        this.isCountryChange = true;
        this.setOutputDirty();
        const countryList: Array<Country> = data && data.outDataCountries;
        if (countryList && countryList.length) {
            const activeCountryList = countryList.filter(p => p.isActive);
            const inActiveCountryList = countryList.filter(p => !p.isActive);

            // Create new Mode
            if (!this.idSalesCampaignWizard || this.isClone) {
                this.campaignWizardCountries = activeCountryList.map((p: Country) => {
                    return {
                        IdCountrylanguage: +p.idValue,
                        IsActive: true
                    };
                });
            } else {
                // Update Mode
                this.campaignWizardCountries = [];
                if (activeCountryList.length) {
                    const activeCountryDataMapList = activeCountryList.map((p: Country) => {
                        return {
                            IdCountrylanguage: +p.idValue,
                            IsActive: true,
                            IdSalesCampaignWizardItems: +p.idSalesCampaignWizardItems == 0 ? null : +p.idSalesCampaignWizardItems,
                            IsDeleted: '0'
                        };
                    });

                    if (this.countryEditListData && this.countryEditListData.length) {
                        activeCountryDataMapList.forEach(activeCountry => {
                            let isExists = false;
                            for (let i = 0; i < this.countryEditListData.length; i++) {
                                if (this.countryEditListData[i].IdCountrylanguage == activeCountry.IdCountrylanguage) {
                                    isExists = true;
                                    break;
                                }
                            }
                            if (!isExists) {
                                this.campaignWizardCountries.push(activeCountry);
                            }
                        });
                    } else {
                        this.campaignWizardCountries = this.countryEditListData.concat(activeCountryDataMapList);
                    }
                }

                if (inActiveCountryList.length) {
                    const inActiveCountryDataMapList = inActiveCountryList.map((p: Country) => {
                        return {
                            IdCountrylanguage: +p.idValue,
                            IsActive: false,
                            IdSalesCampaignWizardItems: +p.idSalesCampaignWizardItems == 0 ? null : +p.idSalesCampaignWizardItems
                        };
                    });

                    if (this.countryEditListData && this.countryEditListData.length) {
                        inActiveCountryDataMapList.forEach(inActiveCountry => {

                            this.countryEditListData.forEach((item, index, object) => {
                                if (item.IdCountrylanguage == inActiveCountry.IdCountrylanguage) {
                                    if (object[index].IdSalesCampaignWizardItems) {
                                        inActiveCountry['IsDeleted'] = '1';
                                        this.campaignWizardCountries.push(inActiveCountry);
                                    }
                                }
                            });

                        });
                    }
                }
            }
        }
    }

    private subscribeFormValueChange() {

        if (this.mandantValueChangesSubscription) this.mandantValueChangesSubscription.unsubscribe();
        if (this.campaignCountryFormValueChangesSubscription) this.campaignCountryFormValueChangesSubscription.unsubscribe();
        if (this.idRepSalesCampaignNamePrefixValueChangesSubscription) this.idRepSalesCampaignNamePrefixValueChangesSubscription.unsubscribe();
        if (this.campaignNr1ValueChangesSubscription) this.campaignNr1ValueChangesSubscription.unsubscribe();
        if (this.campaignNr2ValueChangesSubscription) this.campaignNr2ValueChangesSubscription.unsubscribe();
        if (this.campaignNr3ValueChangesSubscription) this.campaignNr3ValueChangesSubscription.unsubscribe();

        // Bug: 0000926: T1A - Display message confirm dialog although there is not any changes data
        // Link: http://mantis.xena.local/view.php?id=926
        setTimeout(() => {

            // Fix bug: Form Dirty after init 
            // Root cause: selectedIndexChanged auto run after setting data.
            // Solution: Remove selectedIndexChanged event on template, manual capture mandant value changes from form group.
            this.mandantValueChangesSubscription = this.campaignCountryForm.get('mandant').valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        this.onMandantChangeValue();
                    });
                });

            this.campaignCountryFormValueChangesSubscription = this.campaignCountryForm.valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        if (this.campaignCountryForm.pristine != undefined && !this.campaignCountryForm.pristine) {
                            this.setOutputData(null);
                        }
                    });
                });

            if (this.supportCampaignNumberPrefix) {
                this.idRepSalesCampaignNamePrefixValueChangesSubscription = this.campaignCountryForm.get('campaignNumberPrefix').valueChanges
                    .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                    .subscribe((data) => {
                        this.appErrorHandler.executeAction(() => {
                            this.checkCampaignNumber();
                        });
                    });
            }

            this.campaignNr1ValueChangesSubscription = this.campaignCountryForm.get('campaignNr1').valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        this.checkCampaignNumber();
                    });
                });

            this.campaignNr2ValueChangesSubscription = this.campaignCountryForm.get('campaignNr2').valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        this.checkCampaignNumber();
                    });
                });

            this.campaignNr3ValueChangesSubscription = this.campaignCountryForm.get('campaignNr3').valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        this.checkCampaignNumber();
                    });
                });

        }, 500);
    }

    private checkCampaignNumber() {
        const checkCampaignNumberModel = new CheckCampaignNumber({
            IdRepSalesCampaignNamePrefix: this.supportCampaignNumberPrefix ? this.campaignCountryForm.controls['campaignNumberPrefix'].value : '',
            CampaignNr1: this.campaignCountryForm.controls['campaignNr1'].value,
            CampaignNr2: this.campaignCountryForm.controls['campaignNr2'].value,
            CampaignNr3: this.campaignCountryForm.controls['campaignNr3'].value
        });

        this.checkCampaignNumberSubscription = this.campaignService.checkCampaignNumber(checkCampaignNumberModel)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    const data = response.item.data[0][0];
                    this.existedCampaignNumber = data.ReturnID > 0;
                });
            });
    }

    private setOutputData(submitResult: any, data?: any) {
        if ((typeof data) !== 'undefined') {
            this.outputModel = data;
        } else {
            this.outputModel = { submitResult: submitResult, formValue: this.campaignCountryForm.value, isValid: !this.campaignCountryForm.invalid, isDirty: this.campaignCountryForm.dirty, returnID: this.idSalesCampaignWizard ? this.idSalesCampaignWizard.toString() : '' };
        }
        this.outputData.emit(this.outputModel);
    }

    private setOutputDirty() {
        this.setOutputData(null, {
            submitResult: null,
            formValue: this.campaignCountryForm.value,
            isValid: !this.campaignCountryForm.invalid,
            isDirty: true
        });
    }

    /**
     * onMandantChangeValue
     * @param event
     */
    public onMandantChangeValue() {
        if (!this.mandantCombobox || !this.mandantCombobox.selectedValue) {
            this.campaignAddressList = null;
            return;
        }

        const value = this.mandantCombobox.selectedValue;
        this.commonServiceSubscription = this.commonService.getComboBoxDataByFilter(ComboBoxTypeConstant.campaignWizardAddress, value)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    let rs = response.item;
                    if (this.mandantCombobox.selectedValue) {
                        this.campaignAddressList = this.getValidCombobox(rs, ComboBoxTypeConstant.campaignWizardAddress, value);

                        this.initFocusControl();
                    }
                });
            });
    }

    public selectCampaignToClone() {
        const campaignMode = this.campaignCountryForm.controls['campaignMode'].value;
        if (campaignMode == 'cloneCampaign') this.showDialog.emit();
    }

    //#region initFocusControl
    private timeoutFocusControl: any;
    private initFocusControl() {
        clearTimeout(this.timeoutFocusControl);
        this.timeoutFocusControl = null;

        this.timeoutFocusControl = setTimeout(() => {
            if (!this.controlFocusComponent) return;
            this.controlFocusComponent.initControl(true);
        }, 500);
    }
    //#endregion

    public customItemFormatterShippingAddress(index, content) {
        if (this.campaignAddressList && this.campaignAddressList.length) {
            const campaignAddress = this.campaignAddressList[index];
            const company = isEmpty(campaignAddress.company) ? '' : campaignAddress.company;
            const poboxLabel = isEmpty(campaignAddress.poboxLabel) ? '' : campaignAddress.poboxLabel;
            const zip = isEmpty(campaignAddress.zip) ? '' : campaignAddress.zip;
            const place = isEmpty(campaignAddress.place) ? '' : campaignAddress.place;
            const newContent =
                '<div class="col-md-12 col-lg-12 xn-wj-ddl-item">'
                + '<div class="col-sm-3 no-padding-left" > '
                + company.replace('{}', '')
                + '</div><div class="col-sm-1" style="display:none" > - </div>'
                + '<div class="col-sm-3 no-padding-right border-left" > '
                + poboxLabel.replace('{}', '') + '&nbsp;'
                + '</div><div class="col-sm-1" style="display:none" > - </div>'
                + '<div class="col-sm-3 no-padding-right border-left" > '
                + zip.replace('{}', '') + '&nbsp;'
                + '</div><div class="col-sm-1" style="display:none" > - </div>'
                + '<div class="col-sm-3 no-padding-right border-left" > '
                + place.replace('{}', '') + '&nbsp;'
                + '</div>'
                + '</div>';
            return newContent;
        }
    }

}
