import { Component, Output, Input, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Uti } from 'app/utilities';
import { HotKeySettingService, CommonService, AppErrorHandler } from 'app/services';
import { ZipMaskPattern, ApiResultResponse } from 'app/models';
import { ComboBoxTypeConstant } from 'app/app.constants';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
    selector: 'form-fg-address',
    styleUrls: ['./address.component.scss'],
    templateUrl: './address.component.html'
})
export class XnFormFgAddressComponent implements OnInit, OnDestroy {
    public isRenderForm = false;
    public zipMaskPattern: ZipMaskPattern;
    public listComboBox: any;//OnDestroy event: you cannot release it, because it is referenced in cache and is commonly used
    public data: any;//used for displaying lable
    public addressForm: FormGroup;

    private mandatoryCheckData: any = {};
    private regularExpressionData: any = {};
    private updateData: any;
    private parentFormGroup: any;

    @ViewChild('idRepIsoCountryCode') idRepIsoCountryCodeCombobox: AngularMultiSelect;
    @ViewChild('multiSelectDDLPoBox') multiSelectDDLPoBox: AngularMultiSelect;

    //#region Input, Output
    @Input() mandatoryCheckColor = {};
    @Input() hiddenFields = {};
    @Input() dontAllowCharForArea = '';

    @Input() set initInformation(information: any) {
        if (!information || !information.parentFG) return;

        if (information.data)
            this.data = information.data;

        if (information.updateData)
            this.updateData = information.updateData;

        this.mandatoryCheckData = information.mandatoryData || {};
        this.regularExpressionData = information.regularExpressionData || {};

        if (information.parentFG)
            this.parentFormGroup = information.parentFG;

        if (information.listComboBox)
            this.listComboBox = information.listComboBox;

        this.initData();
    }

    @Input() isVerticalLayout = false;

    //Only using for Customer Form, used to show 2 controls: idRepIsoCountryCode, idRepLanguage
    //If has data and idRepIsoCountryCode, idRepLanguage = true -> show; Else -> hide
    private _dontShowControl: any = {};
    @Input() set dontShowControl(data: any) {
        if (!data) return;

        this._dontShowControl = data || {};

        //remove controls not used in this form
        this.removeControlInFormGroup();
    }
    get dontShowControl() {
        return this._dontShowControl;
    }

    @Output() initFormGroup: EventEmitter<FormGroup> = new EventEmitter();
    @Output() onCountryChangedAction: EventEmitter<any> = new EventEmitter();
    //#endregion

    constructor(
        private formBuilder: FormBuilder,
        public hotKeySettingService: HotKeySettingService,
        private commonService: CommonService,
        private appErrorHandler: AppErrorHandler
    ) {
    }

    public ngOnInit() {
        this.initEmptyData();
        this.loadDefaultData();

        // remove validation of PoBox behaviour
        // this.validateIdRepPoBox();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    get poBoxLabel() {
        return this.addressForm.get('poboxLabel');
    }

    private validateIdRepPoBox() {
        this.addressForm.get('idRepPoBox').valueChanges.subscribe(value => {
            if (value) {
                this.poBoxLabel.setValidators([Validators.required]);
            }
            this.poBoxLabel.updateValueAndValidity();

        })
    }

    //#region Init Data
    private initEmptyData() {
        this.addressForm = this.formBuilder.group({
            idRepLanguage: '',
            idRepIsoCountryCode: '',
            countryCode: '',
            area: '',
            streetNr: '',
            street: '',
            streetAddition1: '',
            streetAddition2: '',
            zip: '',
            zip2: '',
            poboxLabel: '',
            idRepPoBox: '',
            place: '',
            idSharingAddress: ''
        });

        Uti.setIsTextBoxForFormControl(this.addressForm, [
            'street',
            'streetNr',
            'streetAddition1',
            'streetAddition2',
            'poboxLabel',
            'zip',
            'zip2',
            'place',
            'area']);

        Uti.registerFormControlType(this.addressForm,
            { dropdown: 'idRepLanguage;idRepIsoCountryCode;idRepPoBox' }
        );

        this.zipMaskPattern = {
            validationZip2MaskFormat: '',
            validationZip2RegEx: '',
            validationZipMaskFormat: '',
            validationZipRegEx: ''
        };

        this.removeControlInFormGroup();
    }

    //Get Load Default Data: ListComboBox
    private loadDefaultData() {
        //if already loaded data -> initData
        if (this.listComboBox && this.listComboBox.countryCode && this.listComboBox.language && this.listComboBox.pOBox) {
            this.initData();
            return;
        }

        //if ListComboBox doesn't have from CustomerForm -> call to get ListComboBox
        const comboBoxTypes = [
            ComboBoxTypeConstant.countryCode,
            ComboBoxTypeConstant.language,
            ComboBoxTypeConstant.pOBox
        ];
        this.commonService.getListComboBox(comboBoxTypes.join())
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) return;

                    this.listComboBox = response.item;
                    this.initData();
                });
            });
    }

    private initData() {
        if (!this.addressForm || !this.data) return;

        //Add 'Address Form' to 'Parent Form'
        if (this.parentFormGroup.contains('address'))
            this.parentFormGroup.controls['address'] = this.addressForm;
        else
            this.parentFormGroup.addControl('address', this.addressForm);

        this.updateFormValue(this.updateData ? this.updateData : this.data);//update value
        this.parentFormGroup.updateValueAndValidity();

        if (!this.isRenderForm) {
            Uti.setValidatorForForm(this.addressForm, this.mandatoryCheckData);
            Uti.setValidatorRegularExpresionForForm(this.addressForm, this.regularExpressionData);
            this.removeControlInFormGroup();
            this.isRenderForm = true;
        }
    }
    //#endregion

    public changeCountryCode() {
        if (this.idRepIsoCountryCodeCombobox && this.idRepIsoCountryCodeCombobox.selectedItem) {
            this.onCountryChangedAction.emit(this.idRepIsoCountryCodeCombobox.selectedItem);

            const selectedItem = this.idRepIsoCountryCodeCombobox.selectedItem;
            let validationZip2MaskFormat = selectedItem.validationZip2MaskFormat;
            let validationZip2RegEx = selectedItem.validationZip2RegEx;
            let validationZipMaskFormat = selectedItem.validationZipMaskFormat;
            let validationZipRegEx = selectedItem.validationZipRegEx;

            this.updateZipMask({
                validationZipMaskFormat,
                validationZipRegEx,
                validationZip2MaskFormat,
                validationZip2RegEx
            });
        }
    }

    private updateFormValue(data) {
        if (this.isVerticalLayout) {
            if (this.addressForm.controls['area'] && data['area'])
                this.addressForm.controls['area'].setValue(data['area'].value);

            if (this.addressForm.controls['street'] && data['street'])
                this.addressForm.controls['street'].setValue(data['street'].value);

            if (this.addressForm.controls['streetNr'] && data['streetNr'])
                this.addressForm.controls['streetNr'].setValue(data['streetNr'].value);

            if (this.addressForm.controls['streetAddition1'] && data['streetAddition1'])
                this.addressForm.controls['streetAddition1'].setValue(data['streetAddition1'].value);

            if (this.addressForm.controls['streetAddition2'] && data['streetAddition2'])
                this.addressForm.controls['streetAddition2'].setValue(data['streetAddition2'].value);

            if (this.addressForm.controls['zip'] && data['zip'])
                this.addressForm.controls['zip'].setValue(data['zip'].value);

            if (this.addressForm.controls['zip2'] && data['zip2'])
                this.addressForm.controls['zip2'].setValue(data['zip2'].value);

            if (this.addressForm.controls['poboxLabel'] && data['poboxLabel'])
                this.addressForm.controls['poboxLabel'].setValue(data['poboxLabel'].value);

            if (this.addressForm.controls['idRepPoBox'] && data['idRepPoBox'])
                this.addressForm.controls['idRepPoBox'].setValue(data['idRepPoBox'].value);

            if (this.addressForm.controls['place'] && data['place'])
                this.addressForm.controls['place'].setValue(data['place'].value);

            if (this.addressForm.parent)
                this.addressForm.parent.updateValueAndValidity();

            if (data.idRepIsoCountryCode) {
                const idRepIsoCountryCode = data.idRepIsoCountryCode.value;
                if (this.listComboBox && this.listComboBox.countryCode) {
                    const selectedItem = this.listComboBox.countryCode.find(p => p.idValue == idRepIsoCountryCode);
                    if (selectedItem) {
                        let validationZip2MaskFormat = selectedItem.validationZip2MaskFormat;
                        let validationZip2RegEx = selectedItem.validationZip2RegEx;
                        let validationZipMaskFormat = selectedItem.validationZipMaskFormat;
                        let validationZipRegEx = selectedItem.validationZipRegEx;
                        this.updateZipMask({
                            validationZipMaskFormat,
                            validationZipRegEx,
                            validationZip2MaskFormat,
                            validationZip2RegEx
                        });
                    }
                }
            }
        }
    }

    public gotFocusPoBox(event) {
        this.addressForm.controls['idRepPoBox'].markAsTouched();
        this.addressForm.markAsTouched();
    }

    public updateZipMask(zipMaskPattern: ZipMaskPattern) {
        if (zipMaskPattern && zipMaskPattern.validationZipMaskFormat) {
            zipMaskPattern.validationZipMaskFormat = zipMaskPattern.validationZipMaskFormat.replace(/§/g, 'A');
        }
        if (zipMaskPattern && zipMaskPattern.validationZip2MaskFormat) {
            zipMaskPattern.validationZip2MaskFormat = zipMaskPattern.validationZip2MaskFormat.replace(/§/g, 'A');
        }
        this.zipMaskPattern = zipMaskPattern;

        if (!this.zipMaskPattern) {
            this.zipMaskPattern = {
                validationZip2MaskFormat: '',
                validationZip2RegEx: '',
                validationZipMaskFormat: '',
                validationZipRegEx: ''
            }
        }        
    }

    private removeControlInFormGroup() {
        if (!this.addressForm) return;

        for (let controlName in this.dontShowControl) {
            this.addressForm.removeControl(controlName);
        }
    }

    ///**
    // * maskValueChanged
    // * @param event
    // */
    //public maskValueChanged(event) {
    //    if (this.addressForm.controls['zip']) {
    //        let zip = this.addressForm.controls['zip'].value;
    //        zip = zip.replace(new RegExp("\\_", "gi"), "");
    //        this.addressForm.controls['zip'].setValue(zip);
    //    }
    //}
}
