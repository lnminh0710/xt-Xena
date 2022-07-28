import {
    Component,
    Output,
    Input,
    EventEmitter,
    ViewChild,
    OnInit,
    OnDestroy,
    Injector,
    ChangeDetectorRef,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DatePipe } from "@angular/common";
import {
    CommonService,
    PersonService,
    PropertyPanelService,
    DatatableService,
} from "app/services";
import {
    ComboBoxTypeConstant,
    Configuration,
    RepWidgetAppIdEnum,
} from "app/app.constants";
import {
    ContactModel,
    FormGroupChild,
    ApiResultResponse,
    FormOutputModel,
} from "app/models";
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
import { ParkedItemState } from "app/state-management/store/reducer/parked-item";
import isEmpty from "lodash-es/isEmpty";
import cloneDeep from "lodash-es/cloneDeep";
import { AdministrationFormBase } from "app/shared/components/form/administration/container/ad-form-base";
import { AdContactMainFieldComponent } from "../../components/ad-contact-main-field";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as commonReducer from "app/state-management/store/reducer/xn-common";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import * as widgetContentReducer from "app/state-management/store/reducer/widget-content-detail";
import { XnCountryCheckListComponent } from "app/shared/components/xn-control";

@Component({
    selector: "app-ad-contact-form",
    styleUrls: ["./ad-contact-form.component.scss"],
    templateUrl: "./ad-contact-form.component.html",
})
export class AdContactFormComponent
    extends AdministrationFormBase
    implements OnInit, OnDestroy
{
    private selectedEntityState: Observable<any>;
    private rowDataState: Observable<Array<any>>;

    private selectedEntityStateSubscription: Subscription;
    private personServiceSubscription: Subscription;
    private comServiceSubscription: Subscription;
    private dispatcherSubscription: Subscription;
    private rowDataStateSubscription: Subscription;

    private contactModel: ContactModel;
    private countryCheckListData: any;
    private isRenderedCountryCheckList: boolean;
    private idPerson: number;
    private originalContactTypeList: Array<any> = [];
    private originalCountryList: Array<any> = [];
    private idPersonInterfaceContactAddressGW: string;

    @ViewChild(AdContactMainFieldComponent)
    adContactMainFieldComponent: AdContactMainFieldComponent;
    @ViewChild(XnCountryCheckListComponent)
    countryListComponent: XnCountryCheckListComponent;

    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @Input() set globalProperties(globalProperties: any[]) {
        this.globalDateFormat =
            this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                globalProperties
            );
        this.dontShowCalendarWhenFocus =
            this.propertyPanelService.getValueDropdownFromGlobalProperties(
                globalProperties
            );
    }

    constructor(
        private store: Store<AppState>,
        private comActions: XnCommonActions,
        private datePipe: DatePipe,
        private comService: CommonService,
        private personService: PersonService,
        private propertyPanelService: PropertyPanelService,
        private datatableService: DatatableService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router,
        protected injector: Injector,
        protected cdr: ChangeDetectorRef
    ) {
        super(injector, router);

        this.xnComState = this.store.select((state) =>
            commonReducer.getCommonState(state, this.ofModule.moduleNameTrim)
        );
        this.moduleToPersonTypeState = this.store.select(
            (state) =>
                commonReducer.getCommonState(
                    state,
                    this.ofModule.moduleNameTrim
                ).moduleToPersonType
        );
        this.selectedEntityState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedEntity
        );
        this.selectedEntityStateSubscription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        selectedEntityState &&
                        selectedEntityState["idPersonInterface"]
                    ) {
                        this.idPerson =
                            selectedEntityState["idPersonInterface"];
                    }
                });
            });

        this.formEditModeState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).formEditMode
        );
        this.rowDataState = store.select(
            (state) =>
                widgetContentReducer.getWidgetContentDetailState(
                    state,
                    this.ofModule.moduleNameTrim
                ).rowsData
        );
    }

    public onInitFormGroup(formGroupChild: FormGroupChild) {
        formGroupChild.form.setParent(this.formGroup);
        this.formGroup.addControl(formGroupChild.name, formGroupChild.form);
    }

    public ngOnInit() {
        this.makeInitDataForCombobox();
        this.getPersonEmptyData();
        this.initEmptyData();
        this.getDropdownlistData();
        this.subcribeRequestSaveState();
        this.subcribeModuleToPersonTypeState();
        this.subscribeFormEditModeState();
        this.subscribeRowDataState();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public isDirty(): boolean {
        return this.checkFormDirty();
    }

    public isValid(): boolean {
        return this.checkFormValid();
    }

    public submit(event?: any) {
        try {
            this.formGroup["submitted"] = true;
            this.formGroup.updateValueAndValidity();

            if (!this.checkFormValid()) {
                this.setOutputData(false);
                return;
            }

            this.createContact();
        } catch (ex) {
            this.formGroup["submitted"] = false;
        }
    }

    public getDataForCountryCheckList(data: any) {
        this.formGroup["PersonInterfaceContactCountries"] = data;
        this.forceDirty = true;
        this.setOutputData(null);
    }

    public getCommOutputData(eventData) {
        this.commOutputData = eventData;
        this.outputModel = new FormOutputModel({
            submitResult: null,
            formValue: this.formGroup.value,
            isValid: this.checkFormValid(),
            isDirty: this.checkFormDirty(),
            returnID: null,
        });
        this.outputData.emit(this.outputModel);
    }

    public onCommHasError(event) {
        this.isCommValid = !event;
        this.setOutputData(null);
    }

    public prepareSubmitData() {
        const model = this.formGroup.value;
        const mainFieldModel = model.adminContactMainFieldForm;
        const returnContact: any = {
            Person: {
                Notes: model.notes,
                IsMatch: false,
                IsActive: !!mainFieldModel.isActive,
                IdPerson: this.mainId ? this.mainId : null,
            },
            PersonTypeGw: {
                IdRepPersonType: this.mapMenuIdToPersonTypeId["-1"],
                IdPersonTypeGw: this.getUnEmptyValue(
                    mainFieldModel["idPersonTypeGw"]
                ),
            },
            SharingName: {
                IdRepTitleOfCourtesy: Uti.isNullUndefinedEmptyObject(
                    mainFieldModel.idRepTitleOfCourtesy
                )
                    ? null
                    : mainFieldModel.idRepTitleOfCourtesy,
                IdRepTitle: Uti.isNullUndefinedEmptyObject(
                    mainFieldModel.idRepTitle
                )
                    ? null
                    : mainFieldModel.idRepTitle,
                LastName: mainFieldModel.lastName,
                FirstName: mainFieldModel.firstName,
                SuffixName: mainFieldModel.suffixName,
                Middlename: mainFieldModel.middlename,
                NameAddition: mainFieldModel.nameAddition,
                IdSharingName: this.getUnEmptyValue(
                    mainFieldModel["idSharingName"]
                ),
            },
            SharingAddress: {
                IdRepLanguage: model.address.idRepLanguage,
                IdRepIsoCountryCode: model.address.idRepIsoCountryCode,
                IdRepPoBox: model.address.idRepPoBox,
                Street: model.address.street,
                StreetNr: model.address.streetNr,
                StreetAddition1: model.address.streetAddition1,
                StreetAddition2: model.address.streetAddition2,
                PoboxLabel: model.address.poboxLabel,
                Zip: model.address.zip,
                Zip2: model.address.zip2,
                Place: model.address.place,
                Area: model.address.area,
                IdSharingAddress: this.getUnEmptyValue(
                    model.address["idSharingAddress"]
                ),
            },
            PersonInterface: {
                IdRepAddressType: "1",
                IsMainRecord: true,
                IdPersonInterface: this.getUnEmptyValue(
                    mainFieldModel["idPersonInterface"]
                ),
            },
            PersonMasterData: {
                DateOfBirth:
                    mainFieldModel.dateOfBirth != null
                        ? this.datePipe.transform(
                              mainFieldModel.dateOfBirth,
                              this.consts.dateFormatInDataBase
                          )
                        : null,
                IsActive: true,
                IdPersonMasterData: this.getUnEmptyValue(
                    mainFieldModel["idPersonMasterData"]
                ),
            },
            PersonStatus: {
                IdRepPersonStatus: mainFieldModel.idRepPersonStatus,
                IsActive: true,
            },
            PersonAlias: {
                PersonAliasNr: "default",
            },
            Communications: this.commOutputData,
            PersonInterfaceContactCountries: this.buildCoutriesData(),
            ContactAddressTypes: this.createContactAddressType(),
            PersonInterfaceContactAddressGw: {
                // 'IdRepContactAddressType': mainFieldModel.idRepContactAddressType,
                IdRepContactAddressType: null, // because the contact type is built in ContactAddressTypes property, so dont need input here
                IdPersonInterface: this.idPerson,
                IdPersonInterfaceContactAddressGW:
                    this.idPersonInterfaceContactAddressGW,
            },
            SharingCompany: {
                Company: mainFieldModel.company,
                Department: mainFieldModel.department,
                Position: mainFieldModel.position,
                IdSharingCompany: this.getUnEmptyValue(
                    mainFieldModel["idSharingCompany"]
                ),
            },
        };
        if (model.address.idRepPoBox) {
            returnContact.SharingAddress.IdRepPoBox = model.address.idRepPoBox;
        }
        return returnContact;
    }

    private getUnEmptyValue(value) {
        return value === "" ? null : value;
    }

    public onContactAddressChanged() {
        this.forceDirty = true;
        this.setOutputData(null);
    }

    /**
     * PRIVATE METHODS
     */

    private createContactAddressType(): Array<any> {
        return this.adContactMainFieldComponent.createContactAddressType(
            this.originalContactTypeList
        );
    }

    private subcribeRequestSaveState() {
        this.dispatcherSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.submit();
                });
            });
    }

    private subcribeModuleToPersonTypeState() {
        this.moduleToPersonTypeStateSubcription =
            this.moduleToPersonTypeState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.mapMenuIdToPersonTypeId = data;
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
        this.rowDataStateSubscription = this.rowDataState.subscribe(
            (rowsData: Array<any>) => {
                this.appErrorHandler.executeAction(() => {
                    if (this.formEditMode && rowsData && rowsData.length) {
                        const rowDataItem = rowsData.find(
                            (p) =>
                                p.widgetDetail &&
                                p.widgetDetail.idRepWidgetApp ==
                                    RepWidgetAppIdEnum.AdminContactTable
                        );
                        if (rowDataItem && rowDataItem.rowData) {
                            const item = rowDataItem.rowData.find(
                                (p) => p.key == "IdPerson"
                            );
                            const idPersonInterfaceContactAddressGW =
                                rowDataItem.rowData.find(
                                    (p) =>
                                        p.key ==
                                        "IdPersonInterfaceContactAddressGW"
                                );
                            if (idPersonInterfaceContactAddressGW) {
                                this.idPersonInterfaceContactAddressGW =
                                    idPersonInterfaceContactAddressGW.value;
                            }
                            if (item) {
                                this.mainId = item.value;
                                this.getEditData();
                            }
                        }
                    }
                });
            }
        );
    }

    private subscribeFormEditModeState() {
        if (this.formEditModeStateSubscription) {
            this.formEditModeStateSubscription.unsubscribe();
        }
        this.formEditModeStateSubscription = this.formEditModeState.subscribe(
            (formEditModeState: boolean) => {
                this.appErrorHandler.executeAction(() => {
                    this.formEditMode = formEditModeState;
                });
            }
        );
    }

    /** Init Data */
    private getDropdownlistData() {
        this.dispatchToGetDropdownlistData();
        this.xnComStateSubcription = this.xnComState.subscribe(
            (xnComState: SubCommonState) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !xnComState.listComboBox ||
                        !xnComState.listComboBox.title ||
                        !xnComState.listComboBox.contactType
                    ) {
                        return;
                    }

                    this.buildDataForDropDownlist(
                        cloneDeep(xnComState.listComboBox)
                    );
                    if (this.contactModel) this.initDataForForm();
                });
            }
        );
    }

    private makeInitDataForCombobox() {
        this.listComboBox = {
            communicationTypeType: [],
            contactType: [],
            countryCode: [],
            countryLanguageCode: [],
            language: [],
            pOBox: [],
            title: [],
            titleOfCourtesy: [],
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

    private dispatchToGetDropdownlistData() {
        this.store.dispatch(
            this.comActions.loadComboBoxList(
                [
                    ComboBoxTypeConstant.countryCode,
                    ComboBoxTypeConstant.countryLanguageCode,
                    ComboBoxTypeConstant.title,
                    ComboBoxTypeConstant.titleOfCourtesy,
                    ComboBoxTypeConstant.language,
                    ComboBoxTypeConstant.pOBox,
                    ComboBoxTypeConstant.communicationTypeType,
                    ComboBoxTypeConstant.contactType,
                ],
                this.ofModule
            )
        );
    }

    private getPersonEmptyData() {
        this.personService
            .getMandatoryField("AdministrationContact")
            .subscribe((response1: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    var mandatoryParameter = Uti.getMandatoryData(response1);
                    if (!isEmpty(mandatoryParameter)) {
                        this.makeMadatoryField(mandatoryParameter);
                        this.makeMadatoryField(mandatoryParameter, {
                            idRepContactAddressType: undefined,
                        });
                    }
                    this.personServiceSubscription = this.personService
                        .getPersonById("")
                        .subscribe((response2: ApiResultResponse) => {
                            this.appErrorHandler.executeAction(() => {
                                this.regularExpressionData =
                                    Uti.getRegularExpressionData(
                                        response2.item
                                    );
                                this.addFakeFieldForContactModel(
                                    response2.item
                                );
                                this.makeMadatoryField(mandatoryParameter, {
                                    idRepContactAddressType: undefined,
                                });
                                if (!Uti.isResquestSuccess(response2)) {
                                    return;
                                }
                                if (
                                    this.listComboBox.communicationTypeType &&
                                    this.listComboBox.communicationTypeType
                                        .length > 0
                                ) {
                                    this.initDataForForm();
                                }
                            });
                        });
                });
            });
    }

    private timeoutFormValueChange: any;
    protected subscribeFormValueChange() {
        clearTimeout(this.timeoutFormValueChange);
        this.timeoutFormValueChange = null;
        this.timeoutFormValueChange = setTimeout(() => {
            if (this.formChangeSubscription)
                this.formChangeSubscription.unsubscribe();
            this.formChangeSubscription = this.formGroup.valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!this.formGroup.pristine) {
                            this.setOutputData(null);
                            this.makeValidationForFormControl();
                        }
                    });
                });
        }, 1500);
    }

    /**
     * TODO: Will remove when service has expirationDate
     */
    private addFakeFieldForContactModel(data: ContactModel) {
        this.contactModel = data;
        this.contactModel.expirationDate = {
            displayValue: "expirationDate",
            value: null,
        };
        this.contactModel.idRepContactAddressType = {
            displayValue: "idRepContactAddressType",
            value: "",
        };
        this.contactModel.position = { displayValue: "position", value: "" };
        this.contactModel.department = {
            displayValue: "department",
            value: "",
        };
    }

    private initEmptyData() {
        this.initForm({
            notes: ["", Validators.maxLength(this.maxCharactersNotes)],
            communicationData: "",
        });
        this.formGroup["PersonInterfaceContactCountries"] = [];
    }

    private initDataForForm() {
        this.initDataForMainField(this.contactModel);
        this.initDataForAddressFG(this.contactModel, true);
        this.initCountryCheckListData();
        this.updateCommunicationData();
        this.isRenderForm = !!this.contactModel && !!this.contactModel.notes;
        this.subscribeFormValueChange();
    }

    private initCountryCheckListData() {
        if (
            !this.listComboBox ||
            !this.listComboBox.countryLanguageCode ||
            this.isRenderedCountryCheckList
        ) {
            return;
        }
        this.countryCheckListData = this.listComboBox.countryLanguageCode;
        this.isRenderedCountryCheckList = true;
    }

    private updateCommunicationData() {
        if (this.formGroup.contains("communicationData")) {
            if (this.communicationDataChangeSubscription)
                this.communicationDataChangeSubscription.unsubscribe();

            this.communicationDataChangeSubscription = this.formGroup.controls[
                "communicationData"
            ].valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        this.commInputputData = [];
                    });
                });
        }
    }
    /** End Init Data */

    private createContact() {
        const submitData = this.prepareSubmitData();
        const observable: Observable<any> = this.mainId
            ? this.comService.updateContact(submitData)
            : this.comService.createContact(submitData);
        this.comServiceSubscription = observable.subscribe(
            (response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    this.setOutputData(false, {
                        submitResult: true,
                        formValue: this.formGroup.value,
                        isValid: true,
                        isDirty: false,
                        returnID: response.item.returnID,
                    });
                    if (!response.item.returnID) {
                        return;
                    }
                    Uti.resetValueForForm(this.formGroup);
                    this.countryCheckListData = cloneDeep(
                        this.listComboBox.countryCode
                    );
                    this.originalContactTypeList = [];
                    this.originalCountryList = [];
                });
            },
            (err) => {
                this.setOutputData(false);
            }
        );
    }

    private setOutputData(submitResult: any, returnID?: any) {
        this.setValueForOutputModel(submitResult, returnID);
        this.outputData.emit(this.outputModel);
    }

    private buildCoutriesData() {
        let result: any[] = [];
        let deletedCountryList = [];
        if (this.countryListComponent) {
            result = this.countryListComponent.getAllActiveCountry();
        }
        if (result && result.length) {
            result = result.map((item) => {
                return {
                    IdCountrylanguage: item.idValueCountryLanguage,
                    IsActive: 1,
                    IdPersonInterfaceContactAddressGW:
                        this.idPersonInterfaceContactAddressGW,
                };
            });
            if (this.originalCountryList && this.originalCountryList.length) {
                this.originalCountryList.forEach((item) => {
                    const rs = result.find(
                        (p) =>
                            p.IdCountrylanguage == item.idValueCountryLanguage
                    );
                    if (!rs) {
                        deletedCountryList.push({
                            IdCountrylanguage: item.idValueCountryLanguage,
                            IsDeleted: "1",
                            IdPersonInterfaceContactAddressGW:
                                this.idPersonInterfaceContactAddressGW,
                        });
                    }
                });
            }
        } else {
            result = [];
            if (this.originalCountryList && this.originalCountryList.length) {
                deletedCountryList = this.originalCountryList.map((item) => {
                    return {
                        IdCountrylanguage: item.idValueCountryLanguage,
                        IsDeleted: "1",
                        IdPersonInterfaceContactAddressGW:
                            this.idPersonInterfaceContactAddressGW,
                    };
                });
            }
        }
        return [...result, ...deletedCountryList];
    }

    protected getEditData() {
        setTimeout(() => {
            if (!this.isRenderForm) {
                this.getEditData();
                return;
            }
            this.personService
                .getPersonById(this.mainId)
                .subscribe((response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!Uti.isResquestSuccess(response)) return;
                        const editingData = Uti.mapObjectValueToGeneralObject(
                            response.item
                        );
                        Uti.setValueForFormWithStraightObject(
                            this.formGroup,
                            editingData
                        );
                        const idRepContactAddressType: string =
                            editingData.idRepContactAddressType;
                        if (
                            idRepContactAddressType &&
                            this.listComboBox.contactType
                        ) {
                            const idRepContactAddressTypes: Array<string> =
                                idRepContactAddressType.split(",");
                            this.listComboBox.contactType.forEach((item) => {
                                if (
                                    idRepContactAddressTypes.indexOf(
                                        item.idValue
                                    ) > -1
                                ) {
                                    item.selected = true;
                                    this.originalContactTypeList.push(item);
                                }
                            });
                            this.listComboBox.contactType = Object.assign(
                                [],
                                this.listComboBox.contactType
                            );
                        }
                        this.mainFieldData = Object.assign(
                            {},
                            this.mainFieldData,
                            {
                                listComboBox: this.listComboBox,
                            }
                        );
                        this.updateCountryList(editingData.idCountrylanguage);
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

    private updateCountryList(idCountrylanguage) {
        if (idCountrylanguage && this.countryCheckListData) {
            let idCountrylanguageArr: Array<string> =
                idCountrylanguage.split(",");
            if (idCountrylanguageArr && idCountrylanguageArr.length) {
                idCountrylanguageArr.forEach((key) => {
                    const item = this.countryCheckListData.find(
                        (p) => p.idValueCountryLanguage == key
                    );
                    if (item) {
                        item.isActive = true;
                        this.originalCountryList.push(item);
                    }
                });
                this.countryCheckListData = Object.assign(
                    [],
                    this.countryCheckListData
                );
            }
        }
    }

    private loadCommunicationData() {
        this.personService
            .loadCommunication(this.mainId)
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    const tempDataSource =
                        this.datatableService.buildEditableDataSource(
                            response.data
                        );
                    this.commInputputData = tempDataSource.data;
                });
            });
    }
}
