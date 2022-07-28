import {
    Component, Output, Input, EventEmitter,
    OnInit, OnDestroy, Injector, ViewChild
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ComboBoxTypeConstant, RepWidgetAppIdEnum } from 'app/app.constants';
import { CommonService, PersonService, AppErrorHandler, PropertyPanelService, DatatableService } from 'app/services';
import { Uti } from 'app/utilities';
import {
    ContactModel,
    ApiResultResponse,
} from 'app/models';

import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { SubCommonState } from 'app/state-management/store/reducer/xn-common';
import {
    XnCommonActions,
    ProcessDataActions,
    CustomAction
} from 'app/state-management/store/actions';

import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import { CustomerFormBase } from 'app/shared/components/form/customer/container/customer-form-base';
import { FormOutputModel } from 'app/models';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as commonReducer from 'app/state-management/store/reducer/xn-common';
import { Router } from '@angular/router';
import { WjMultiSelect } from 'wijmo/wijmo.angular2.input';
import { Validators } from '@angular/forms';
import cloneDeep from 'lodash-es/cloneDeep';
import * as widgetContentReducer from 'app/state-management/store/reducer/widget-content-detail';
import { RowData } from 'app/state-management/store/reducer';

@Component({
    selector: 'app-cust-contact-form',
    styleUrls: ['./cust-contact-form.component.scss'],
    templateUrl: './cust-contact-form.component.html'
})
export class CustContactFormComponent extends CustomerFormBase implements OnInit, OnDestroy {
    private contactModel: ContactModel;
    private rowDataState: Observable<Array<any>>;
    private selectedEntityState: Observable<any>;
    private selectedEntityStateSubscription: Subscription;
    private globalSubscription: Subscription;
    private dispatcherSubscription: Subscription;
    private rowDataStateSubscription: Subscription;
    private originalContactTypeList: Array<any> = [];

    @Input() set globalProperties(globalProperties: any[]) {
        this.globalDateFormat = this.propertyPanelService.buildGlobalInputDateFormatFromProperties(globalProperties);
    }
    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @ViewChild('idRepContactAddressType') idRepContactAddressTypeCombobox: WjMultiSelect;

    private idPerson: number;
    public dontShowCalendarWhenFocus: boolean;
    constructor(
        private store: Store<AppState>,
        private comActions: XnCommonActions,
        private comService: CommonService,
        private personServ: PersonService,
        private toasterService: ToasterService,
        private _datatableService: DatatableService,
        private datePipe: DatePipe,
        private dispatcher: ReducerManagerDispatcher,
        protected propertyPanelService: PropertyPanelService,
        protected router: Router,
        protected injector: Injector
    ) {
        super(injector, propertyPanelService, router);

        //this.requestSaveState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).requestSave);
        this.globalPropertiesState = store.select(state => this.propertyPanelReducer.getPropertyPanelState(state, this.moduleList.Base.moduleNameTrim).globalProperties);
        this.globalSubscription = this.globalPropertiesState.subscribe((globalProperties) => {
            this.appErrorHandler.executeAction(() => {
                if (globalProperties) {
                    this.dontShowCalendarWhenFocus = this.propertyPanelService.getValueDropdownFromGlobalProperties(globalProperties);
                }
            });
        })
        this.moduleToPersonTypeState = this.store.select(state => commonReducer.getCommonState(state, this.ofModule.moduleNameTrim).moduleToPersonType);
        this.selectedEntityState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).selectedEntity);
        this.selectedEntityStateSubscription = this.selectedEntityState.subscribe((selectedEntityState: any) => {
            this.appErrorHandler.executeAction(() => {
                if (selectedEntityState && selectedEntityState['idPersonInterface']) {
                    this.idPerson = selectedEntityState['idPersonInterface'];
                }
            });
        });

        this.formEditModeState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).formEditMode);
        this.rowDataState = store.select(state => widgetContentReducer.getWidgetContentDetailState(state, this.ofModule.moduleNameTrim).rowsData);
    }

    public ngOnInit() {
        this.makeInitDataForCombobox();
        this.initEmptyData();
        this.getDropdownlistData();
        this.getContactData();
        this.subcribeRequestSaveState();
        this.subscribeGlobalProperties();
        this.subcribeModuleToPersonTypeState();
        this.subscribeFormEditModeState();
        this.subscribeRowDataState();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public getCommOutputData(eventData) {
        this.commOutputData = eventData;
        this.setOutputData(null);
    }

    public onCommHasError(event) {
        this.isCommValid = !event;
        this.setOutputData(null);
    }

    /**
     * PRIVATE METHODS
     */

    public isDirty(): boolean {
        return this.checkFormDirty();
    }

    public isValid(): boolean {
        return this.checkFormValid();
    }

    public submit(event?: any) {
        this.formGroup['submitted'] = true;
        try {
            this.formGroup.updateValueAndValidity();
            const isValid = this.isValid();
            if (!isValid) {
                this.outputModel = new FormOutputModel({
                    formValue: this.formGroup.value,
                    submitResult: false,
                    isValid: isValid,
                    isDirty: this.isDirty(),
                    returnID: null
                });
                this.outputData.emit(this.outputModel);

                return false;
            }

            this.createContact();
        } catch (ex) {
            return false;
        }
        return false;
    }

    public onIdRepContactAddressTypeChanged() {
        if (!this.idRepContactAddressTypeCombobox.checkedItems.length) {
            this.formGroup.controls['idRepContactAddressType'].setValidators(Validators.required);
            this.formGroup.controls['idRepContactAddressType'].setErrors({ 'required': true });
        } else {
            this.formGroup.controls['idRepContactAddressType'].clearValidators();
            this.formGroup.controls['idRepContactAddressType'].setErrors(null);
        }
        this.forceDirty = true;
        this.setOutputData(null);
    }

    public onContactCountryChangedHandler($event) {
        this.onCountryChangedHandler($event);
        this.buildDateOfBirthFormat();
    }

    public prepareSubmitData() {
        const model = this.formGroup.value;
        const returnContact: any = {
            'Person': {
                'Notes': model.notes,
                'IsMatch': false,
                'IsActive': !!model.isActive,
                'IdPerson': this.mainId ? this.mainId : null
            },
            'PersonTypeGw': {
                'IdRepPersonType': this.mapMenuIdToPersonTypeId['-1'],
                'IdPersonTypeGw': this.getUnEmptyValue(model['idPersonTypeGw'])
            },
            'SharingName': {
                'IdRepTitleOfCourtesy': model.idRepTitleOfCourtesy,
                'IdRepTitle': model.idRepTitle,
                'LastName': model.lastName,
                'FirstName': model.firstName,
                'SuffixName': model.suffixName,
                'Middlename': model.middlename,
                'NameAddition': model.nameAddition,
                'Postion': model.position,
                'Deparment': model.department,
                'IdSharingName': this.getUnEmptyValue(model['idSharingName'])
            },
            'SharingCompany': {
                'Company': model.company,
                'IdSharingCompany': this.getUnEmptyValue(model['idSharingCompany'])
            },
            'SharingAddress': {
                'IdRepLanguage': model.address.idRepLanguage,
                'IdRepIsoCountryCode': model.address.idRepIsoCountryCode,
                'IdRepPoBox': model.address.idRepPoBox,
                'Street': model.address.street,
                'StreetNr': model.address.streetNr,
                'StreetAddition1': model.address.streetAddition1,
                'StreetAddition2': model.address.streetAddition2,
                'PoboxLabel': model.address.poboxLabel,
                'Zip': model.address.zip,
                'Zip2': model.address.zip2,
                'Place': model.address.place,
                'Area': model.address.area,
                'IdSharingAddress': this.getUnEmptyValue(model['idSharingAddress'])
            },
            'PersonInterface': {
                'IdRepAddressType': '1',
                'IsMainRecord': true,
                'IdPersonInterface': this.getUnEmptyValue(model['idPersonInterface'])
            },
            'PersonMasterData': {
                'DateOfBirth': model.dateOfBirth && this.getUnEmptyStringDoB(model.dateOfBirth) ? this.datePipe.transform(model.dateOfBirth, this.consts.dateFormatInDataBase) : '',
                'IsActive': true,
                'IdPersonMasterData': this.getUnEmptyValue(model['idPersonMasterData'])
            },
            'PersonStatus': {
                'IdRepPersonStatus': model.idRepPersonStatus,
                'IsActive': true,
            },
            'PersonAlias': {
                'PersonAliasNr': 'default'
            },
            'Communications': this.commOutputData,
            'ContactAddressTypes': this.createContactAddressType(),
            'PersonInterfaceContactAddressGw': {
                // 'IdRepContactAddressType': model.idRepContactAddressType,
                'IdRepContactAddressType': null, // because the contact type is built in ContactAddressTypes property, so dont need input here
                'IdPersonInterface': this.idPerson
            }
        };
        if (model && model.address && !isNil(model.address.idRepPoBox)) {
            returnContact.SharingAddress.IdRepPoBox = model.address.idRepPoBox;
        }
        return returnContact;
    }

    private getUnEmptyValue(value) {
        return value === '' ? null : value;
    }

    private getUnEmptyStringDoB(value) {
        return value === '' ? '' : value;
    }

    private createContactAddressType(): Array<any> {
        const selectedContactAddressTypeList = this.idRepContactAddressTypeCombobox.checkedItems.map(x => {
            return {
                IdRepContactAddressType: x.value,
                IsDeleted: '0'
            };
        });
        let deletedContactAddressTypeList = [];
        if (selectedContactAddressTypeList && selectedContactAddressTypeList.length) {
            if (this.originalContactTypeList && this.originalContactTypeList.length) {
                this.originalContactTypeList.forEach(item => {
                    const rs = selectedContactAddressTypeList.find(p => p.IdRepContactAddressType == item.idValue);
                    if (!rs) {
                        deletedContactAddressTypeList.push({
                            IdRepContactAddressType: item.idValue,
                            IsDeleted: '1'
                        });
                    }
                });
            }
        }
        return [...selectedContactAddressTypeList, ...deletedContactAddressTypeList];
    }

    private subcribeModuleToPersonTypeState() {
        this.moduleToPersonTypeStateSubcription = this.moduleToPersonTypeState.subscribe((data: any) => {
            this.appErrorHandler.executeAction(() => {
                this.mapMenuIdToPersonTypeId = data;
            });
        });
    }

    private subcribeRequestSaveState() {
        this.dispatcherSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.REQUEST_SAVE && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.submit();
            });
        });
    }

    /**
     * subscribeRowDataState
     */
    private subscribeRowDataState() {
        if (this.rowDataStateSubscription) {
            this.rowDataStateSubscription.unsubscribe();
        }
        this.rowDataStateSubscription = this.rowDataState.subscribe((rowsData: Array<any>) => {
            this.appErrorHandler.executeAction(() => {
                if (this.formEditMode && rowsData && rowsData.length) {
                    const rowDataItem = rowsData.find(p => p.widgetDetail && p.widgetDetail.idRepWidgetApp == RepWidgetAppIdEnum.ContactTable);
                    if (rowDataItem && rowDataItem.rowData) {
                        const item = rowDataItem.rowData.find(p => p.key == 'IdPerson');
                        if (item) {
                            this.mainId = item.value;
                            this.getEditData();
                        }
                    }
                }
            });
        });
    }

    private subscribeFormEditModeState() {
        if (this.formEditModeStateSubscription) {
            this.formEditModeStateSubscription.unsubscribe();
        }
        this.formEditModeStateSubscription = this.formEditModeState.subscribe((formEditModeState: boolean) => {
            this.appErrorHandler.executeAction(() => {
                this.formEditMode = formEditModeState;
            });
        });
    }

    private initEmptyData() {
        this.initForm({
            idRepContactAddressType: null,
            idRepTitle: '',
            firstName: '',
            lastName: '',
            nameAddition: '',
            middlename: '',
            suffixName: '',
            company: '',
            position: '',
            department: '',
            idRepTitleOfCourtesy: '',
            dateOfBirth: '',
            notes: '',
            communicationData: '',
            idSharingAddress: '',
            idPersonInterface: '',
            idPersonMasterData: '',
            idSharingName: '',
            idPersonTypeGw: '',
            idSharingCompany: ''
        });
        Uti.registerFormControlType(this.formGroup, {
            dropdown: 'idRepTitle;idRepTitleOfCourtesy',
            multiple: 'idRepContactAddressType'
        });
        Uti.setIsTextBoxForFormControl(this.formGroup, [
            'firstName',
            'lastName',
            'nameAddition',
            'middlename',
            'suffixName',
            'company',
            'position',
            'department']);
        this.updateCommunicationData();
    }

    private getDropdownlistData() {
        const comboBoxTypes = [
            ComboBoxTypeConstant.countryCode,
            ComboBoxTypeConstant.title,
            ComboBoxTypeConstant.titleOfCourtesy,
            ComboBoxTypeConstant.language,
            ComboBoxTypeConstant.pOBox,
            ComboBoxTypeConstant.communicationTypeType,
            ComboBoxTypeConstant.contactType,
            ComboBoxTypeConstant.personType
        ];
        this.comService.getListComboBox(comboBoxTypes.join())
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.title) return;
                    this.buildDataForDropDownlist(cloneDeep(response.item));

                    if (!this.contactModel || !this.contactModel.firstName) return;
                    this.setRenderForm();
                });
            });
    }

    private makeInitDataForCombobox() {
        this.listComboBox = {
            communicationTypeType: [],
            contactType: [],
            countryCode: [],
            language: [],
            pOBox: [],
            personType: [],
            poBox: [],
            title: [],
            titleOfCourtesy: []
        };
    }

    private buildDataForDropDownlist(rawData: any) {
        if (rawData && rawData.contactType && rawData.contactType.length) {
            for (var item of rawData.contactType) {
                item.value = item.idValue;
                item.idValue = item.idValue;
                item.selected = false;
            }
        }
        this.listComboBox = rawData;
    }

    private getContactData() {
        this.personServ.getMandatoryField('CustomerContact')
            .subscribe((response1: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    var mandatoryParameter = Uti.getMandatoryData(response1);
                    if (!isEmpty(mandatoryParameter)) {
                        this.makeMadatoryField(mandatoryParameter, { idRepContactAddressType: null });
                    }
                    this.personServ.getPersonById('')
                        .subscribe((response: ApiResultResponse) => {
                            this.appErrorHandler.executeAction(() => {
                                if (!Uti.isResquestSuccess(response)) {
                                    return;
                                }
                                const data = response.item;
                                this.regularExpressionData = Uti.getRegularExpressionData(response.item);
                                data.idRepContactAddressType = { displayValue: 'idRepContactAddressType', value: null };
                                data.position = { displayValue: 'position', value: '' };
                                data.department = { displayValue: 'department', value: '' };
                                this.contactModel = data;
                                if (this.listComboBox && this.listComboBox.title) {
                                    this.setRenderForm();
                                }
                            });
                        });
                });
            });
    }

    private setRenderForm() {
        this.isRenderForm = true;
        this.isRenderedAddressFG = true;
        this.initDataForAddressFG(this.contactModel, null, true);
        this.subscribeFormValueChange();
    }

    private timeoutFormValueChange: any;
    protected subscribeFormValueChange() {
        clearTimeout(this.timeoutFormValueChange);
        this.timeoutFormValueChange = null;

        this.timeoutFormValueChange = setTimeout(() => {
            if (this.formValuesChangeSubscription) this.formValuesChangeSubscription.unsubscribe();

            this.formValuesChangeSubscription = this.formGroup.valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((x) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!this.formGroup.pristine) {
                            this.setOutputData(null);
                            this.makeValidationForFormControl();
                        }
                    });
                });
        }, 1500);
    }

    private createContact() {
        const submitData = this.prepareSubmitData();
        const observable: Observable<any> = this.mainId ? this.comService.updateContact(submitData) :
            this.comService.createContact(submitData);

        this.formValuesChangeSubscription = observable.subscribe((response: ApiResultResponse) => {
            if (!Uti.isResquestSuccess(response)) {
                return;
            }
            this.outputModel = new FormOutputModel({
                submitResult: true, formValue: this.formGroup.value,
                isDirty: false, isValid: true, returnID: response.item.returnID
            });
            this.outputData.emit(this.outputModel);
            if (!response.item.returnID) {
                return;
            }
            Uti.resetValueForForm(this.formGroup);
            this.originalContactTypeList = [];
        },
            (err) => {
                this.setOutputData(false);
            });
    }

    private setOutputData(submitResult: any, returnID?: any) {
        this.setValueForOutputModel(submitResult, returnID);
        this.outputData.emit(this.outputModel);
    }


    protected getEditData() {
        setTimeout(() => {
            if (!this.isRenderForm) {
                this.getEditData();
                return;
            }
            this.personServ.getPersonById(this.mainId)
                .subscribe((response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!Uti.isResquestSuccess(response)) return;
                        const editingData = Uti.mapObjectValueToGeneralObject(response.item);
                        Uti.setValueForFormWithStraightObject(this.formGroup, editingData, {
                            dateOfBirth: 'datetime',
                            dateFormatString: 'dd.MM.yyyy'
                        });
                        const idRepContactAddressType: string = editingData.idRepContactAddressType;
                        if (idRepContactAddressType && this.listComboBox.contactType) {
                            const idRepContactAddressTypes: Array<string> = idRepContactAddressType.split(',');
                            this.listComboBox.contactType.forEach(item => {
                                if (idRepContactAddressTypes.indexOf(item.idValue) > -1) {
                                    item.selected = true;
                                    this.originalContactTypeList.push(item);
                                }
                            });
                            this.listComboBox.contactType = Object.assign([], this.listComboBox.contactType);
                        }
                        // this.setOutputData(null);
                        setTimeout(() => {
                            this.makeValidationForFormControl();
                            this.formGroup.markAsPristine();
                            this.formGroup.markAsUntouched();
                            this.setOutputData(null);
                        });
                    });
                });
            this.loadCommunicationData();
        }, 400);
    }

    private loadCommunicationData() {
        this.personServ.loadCommunication(this.mainId).subscribe((response) => {
            this.appErrorHandler.executeAction(() => {
                const tempDataSource = this._datatableService.buildEditableDataSource(response.data);
                this.commInputputData = tempDataSource.data;
            });
        });
    }
}
