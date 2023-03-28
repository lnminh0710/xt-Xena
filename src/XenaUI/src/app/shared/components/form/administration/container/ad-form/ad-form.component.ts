import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    OnInit,
    OnDestroy,
    Injector,
    ViewChild,
} from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { SubCommonState } from "app/state-management/store/reducer/xn-common";
import {
    XnCommonActions,
    ProcessDataActions,
    CustomAction,
} from "app/state-management/store/actions";
import { Configuration, ComboBoxTypeConstant } from "app/app.constants";
import { FormGroupChild } from "app/models";
import { Uti } from "app/utilities";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import isEmpty from "lodash-es/isEmpty";
import { PersonModel, Module, ApiResultResponse } from "app/models";
import {
    PersonService,
    PropertyPanelService,
    DatatableService,
} from "app/services";
import { AdministrationFormBase } from "app/shared/components/form/administration/container/ad-form-base";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import * as commonReducer from "app/state-management/store/reducer/xn-common";
import { Router } from "@angular/router";
import { ControlFocusComponent } from "app/shared/components/form";
import * as processDataReducer from "app/state-management/store/reducer/process-data";

@Component({
    selector: "app-ad-form",
    styleUrls: ["./ad-form.component.scss"],
    templateUrl: "./ad-form.component.html",
})
export class AdministrationFormComponent
    extends AdministrationFormBase
    implements OnInit, OnDestroy, AfterViewInit
{
    public currentPerson: PersonModel;

    private isRegistComboboxValueChange = false;
    private subModule: Module;
    private getPersonByIdSubscription: Subscription;
    private activeSubModuleModelSubscription: Subscription;
    private activeSubModuleModel: Observable<Module>;
    private dispatcherSubscription: Subscription;

    @Input() set config(data: any) {
        this.setAdministrationConfig(data);
    }
    @Input() searchIndexKey: string;

    @Output() outputData: EventEmitter<any> = new EventEmitter();

    @ViewChild("focusControl") controlFocusComponent: ControlFocusComponent;

    constructor(
        private comActions: XnCommonActions,
        private store: Store<AppState>,
        private toasterService: ToasterService,
        private _personService: PersonService,
        private propertyPanelService: PropertyPanelService,
        private dispatcher: ReducerManagerDispatcher,
        private _datatableService: DatatableService,
        protected router: Router,
        protected injector: Injector
    ) {
        super(injector, router);
        this.isAutoBuildMandatoryField = true;

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
        this.activeSubModuleModel = store.select(
            (state) => state.mainModule.activeSubModule
        );

        this.formEditModeState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).formEditMode
        );
        this.formEditDataState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).formEditData
        );
    }

    public onInitFormGroup(formGroupChild: FormGroupChild) {
        formGroupChild.form.setParent(this.formGroup);
        this.formGroup.addControl(formGroupChild.name, formGroupChild.form);
    }

    public ngOnInit() {
        this.subscribeFormEditModeState();
        this.getPersonEmptyData();
        this.initEmptyData();
        this.getDropdownlistData();
        this.subcribeRequestSaveState();
        this.getSubModule();
        this.subcribeModuleToPersonTypeState();
    }

    public ngAfterViewInit() {
        this.afterViewInit();
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

    public submit() {
        this.formGroup["submitted"] = true;
        try {
            if (!this.checkFormValid()) {
                this.setOutputData(false);
                return;
            }

            this.createPerson();
        } catch (ex) {
            this.formGroup["submitted"] = true;
            return;
        }
    }

    public getCommOutputData(eventData) {
        this.commOutputData = eventData;
        this.setOutputData(null);
    }

    public onCommHasError(event) {
        this.isCommValid = !event;
        this.setOutputData(null);
    }

    public prepareSubmitData() {
        this.formGroup.updateValueAndValidity();
        const model = this.formGroup.value;
        const result: any = {
            Person: {
                Notes: model.notes,
                IsMatch: false,
                IsActive: !!model.adMainFieldForm.isActive,
                IdPerson: this.getUnEmptyValue(model["idPerson"]),
            },
            PersonTypeGw: {
                IdRepPersonType:
                    this.mapMenuIdToPersonTypeId[
                        this.getSubModuleId(this.subModule)
                    ],
                IdPersonTypeGw: this.getUnEmptyValue(model["idPersonTypeGw"]),
            },
            SharingName: {
                IdRepTitleOfCourtesy:
                    model.adMainFieldForm.idRepTitleOfCourtesy,
                IdRepTitle: model.adMainFieldForm.idRepTitle,
                LastName: model.adMainFieldForm.lastName,
                FirstName: model.adMainFieldForm.firstName,
                NameAddition: model.adMainFieldForm.nameAddition,
                SuffixName: model.adMainFieldForm.suffixName,
                Middlename: model.adMainFieldForm.middlename,
                IdSharingName: this.getUnEmptyValue(model["idSharingName"]),
            },
            SharingCompany: {
                IdSharingCompany: this.getUnEmptyValue(
                    model["idSharingCompany"]
                ),
                Company: model.adMainFieldForm.company,
            },
            SharingAddress: {
                IdRepLanguage: model.address.idRepLanguage,
                IdRepIsoCountryCode: model.address.idRepIsoCountryCode,
                Street: model.address.street,
                StreetNr: model.address.streetNr,
                StreetAddition1: model.address.streetAddition1,
                StreetAddition2: model.address.streetAddition2,
                IdRepPoBox: model.address.idRepPoBox,
                PoboxLabel: model.address.poboxLabel,
                Zip: model.address.zip,
                Zip2: model.address.zip2,
                Place: model.address.place,
                Area: model.address.area,
                IdSharingAddress: this.getUnEmptyValue(
                    model["idSharingAddress"]
                ),
            },
            PersonInterface: {
                IdRepAddressType: "1",
                IsMainRecord: true,
                IdPersonInterface: this.getUnEmptyValue(
                    model["idPersonInterface"]
                ),
            },
            PersonRelationshipToPerson: {
                SlaveIdPerson:
                    model.adMainFieldForm.principal &&
                    model.adMainFieldForm.principal.length > 0
                        ? model.adMainFieldForm.principal
                        : null,
                IsBlocked: false,
            },
            Communications: this.makeCommunicationSavingData(
                this.getUnEmptyValue(model["idPersonInterface"])
            ),
        };
        if (this.mainId) {
            result.Person["IdPerson"] = this.mainId;
        }
        return result;
    }

    /**
     * PRIVATE METHODS
     */

    private getUnEmptyValue(value) {
        return value === "" ? null : value;
    }

    private makeCommunicationSavingData(idPersonInterface: any) {
        if (this.mainId && this.commOutputData && this.commOutputData.length) {
            return this.commOutputData.map((x) => {
                return {
                    IdPersonInterface: idPersonInterface,
                    IdSharingCommunication: x.IdSharingCommunication,
                    IdRepCommunicationType: x.CommunicationType,
                    CommValue1: x.CommunicationValue,
                    Notes: x.CommunicationNote,
                    IsDeleted: x.IsDeleted,
                };
            });
        }
        return this.commOutputData;
    }

    private getSubModule() {
        this.activeSubModuleModelSubscription =
            this.activeSubModuleModel.subscribe((activeSubModule: Module) => {
                this.appErrorHandler.executeAction(() => {
                    this.subModule = activeSubModule;

                    this.initFocusControl();
                });
            });
    }

    private setAdministrationConfig(data: any) {
        this.mainFieldConfig.formFieldConfig.principal = data.principal;
    }

    private getDropdownlistData() {
        this.xnComStateSubcription = this.xnComState.subscribe(
            (xnComState: SubCommonState) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !xnComState.listComboBox ||
                        !xnComState.listComboBox.title
                    ) {
                        return;
                    }

                    this.listComboBox = xnComState.listComboBox;
                    if (this.currentPerson) this.initDataForForm();
                });
            }
        );
        this.callToGetDropdownlistData();
    }

    private subcribeModuleToPersonTypeState() {
        this.moduleToPersonTypeStateSubcription =
            this.moduleToPersonTypeState.subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.mapMenuIdToPersonTypeId = data;
                });
            });
    }

    private callToGetDropdownlistData() {
        this.store.dispatch(
            this.comActions.loadComboBoxList(
                [
                    ComboBoxTypeConstant.countryCode,
                    ComboBoxTypeConstant.language,
                    ComboBoxTypeConstant.pOBox,
                    ComboBoxTypeConstant.title,
                    ComboBoxTypeConstant.communicationTypeType,
                    ComboBoxTypeConstant.titleOfCourtesy,
                    ComboBoxTypeConstant.principal,
                ],
                this.ofModule
            )
        );
    }

    private getPersonEmptyData() {
        this._personService
            .getMandatoryField("Administration")
            .subscribe((response1: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    var mandatoryParameter = Uti.getMandatoryData(response1);
                    if (!isEmpty(mandatoryParameter)) {
                        this.makeMadatoryField(mandatoryParameter);
                    }
                    this.getPersonByIdSubscription = this._personService
                        .getPersonById("")
                        .subscribe((response2: ApiResultResponse) => {
                            this.appErrorHandler.executeAction(() => {
                                if (!Uti.isResquestSuccess(response2)) {
                                    return;
                                }
                                this.currentPerson = response2.item;
                                this.regularExpressionData =
                                    Uti.getRegularExpressionData(
                                        this.currentPerson
                                    );
                                if (this.listComboBox) this.initDataForForm();
                            });
                        });
                });
            });
    }

    private initEmptyData() {
        this.initForm({
            idPerson: "",
            idPersonTypeGw: "",
            idSharingName: "",
            idSharingAddress: "",
            idPersonInterface: "",
            idPersonMasterData: "",
            idPersonStatus: "",
            idSharingCompany: "",
            notes: ["", Validators.maxLength(this.maxCharactersNotes)],
            communicationData: "",
        });
    }

    private initDataForForm() {
        if (!this.currentPerson || !this.listComboBox) {
            return;
        }
        this.initDataForMainField(this.currentPerson);
        this.initDataForAddressFG(this.currentPerson, true);
        this.updateFormValue();
        this.isRenderForm = !!this.currentPerson && !!this.currentPerson.notes;
    }

    private formGroupSubscriptionAdMainFieldForm: Subscription;
    private formGroupSubscriptionAddress: Subscription;
    private updateFormValue() {
        if (this.isRegistComboboxValueChange) {
            return;
        }
        setTimeout(() => {
            if (
                !this.formGroup.controls["adMainFieldForm"] ||
                !this.formGroup.controls["address"]
            ) {
                this.updateFormValue();
                return;
            }
            this.isRegistComboboxValueChange = true;
            this.updateFormMainValue();
            this.updateCommunicationData();

            if (this.formGroupSubscriptionAdMainFieldForm)
                this.formGroupSubscriptionAdMainFieldForm.unsubscribe();
            if (this.formGroupSubscriptionAddress)
                this.formGroupSubscriptionAddress.unsubscribe();

            this.formGroupSubscriptionAdMainFieldForm =
                Uti.updateFormComboboxValue(
                    this.formGroup,
                    this.listComboBox.title,
                    <FormGroup>this.formGroup.controls["adMainFieldForm"],
                    "idRepTitle",
                    "title"
                );

            this.formGroupSubscriptionAddress = Uti.updateFormComboboxValue(
                this.formGroup,
                this.listComboBox.countryCode,
                <FormGroup>this.formGroup.controls["address"],
                "idRepIsoCountryCode",
                "countryCode"
            );
        }, 300);
    }

    private updateFormMainValue() {
        if (this.formChangeSubscription)
            this.formChangeSubscription.unsubscribe();

        this.formChangeSubscription = this.formGroup.valueChanges
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((event) => {
                this.appErrorHandler.executeAction(() => {
                    if (!this.formGroup.pristine) {
                        this.setOutputData(null);
                        this.makeValidationForFormControl();
                    }
                });
            });
    }

    private updateCommunicationData() {
        if (this.formGroup.contains("communicationData"))
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

    private createPerson() {
        this._personService[this.mainId ? "updatePerson" : "createPerson"](
            this.prepareSubmitData(),
            this.searchIndexKey
        ).subscribe(
            (data) => {
                this.appErrorHandler.executeAction(() => {
                    this.setOutputData(false, {
                        submitResult: true,
                        formValue: this.formGroup.value,
                        isValid: true,
                        isDirty: false,
                        returnID: data.idPerson,
                    });
                    Uti.resetValueForForm(this.formGroup);
                });
            },
            (err) => {
                this.setOutputData(false);
            }
        );
    }

    private setOutputData(submitResult: any, data?: any) {
        this.setValueForOutputModel(submitResult, data);
        this.outputData.emit(this.outputModel);
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

    private getSubModuleId(subModule: Module) {
        if (subModule.idSettingsGUI === -1) {
            return subModule.idSettingsGUIParent;
        }

        return subModule.idSettingsGUI;
    }

    private initFocusControl() {
        if (!this.controlFocusComponent) return;

        this.controlFocusComponent.initControl();
    }

    // #region [Edit Form]

    private subscribeFormEditModeState() {
        this.formEditModeStateSubscription = this.formEditModeState.subscribe(
            (formEditModeState: boolean) => {
                this.appErrorHandler.executeAction(() => {
                    this.formEditMode = formEditModeState;
                });
            }
        );

        this.formEditDataStateSubscription = this.formEditDataState.subscribe(
            (formEditDataState: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.formEditData = formEditDataState;
                });
            }
        );
    }

    protected getEditData() {
        setTimeout(() => {
            if (!this.isRenderForm) {
                this.getEditData();
                return;
            }
            this._personService
                .getPersonById(this.mainId)
                .subscribe((response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!Uti.isResquestSuccess(response)) return;
                        this.mapRightDataForArticleForm(response.item);
                        const editingData = Uti.mapObjectValueToGeneralObject(
                            response.item
                        );
                        Uti.setValueForFormWithStraightObject(
                            this.formGroup,
                            editingData
                        );
                        this.formGroup.markAsPristine();
                        this.setOutputData(null);
                    });
                });
            this.loadCommunicationData();
        }, 400);
    }

    private loadCommunicationData() {
        this._personService
            .loadCommunication(this.mainId)
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    const tempDataSource =
                        this._datatableService.buildEditableDataSource(
                            response.data
                        );
                    this.commInputputData = tempDataSource.data;
                });
            });
    }

    private mapRightDataForArticleForm(data: any): any {
        for (let prop in data) {
            if (prop === "slaveIdPerson") {
                data["principal"] = data["principal"] || {};
                data["principal"].value = data[prop].value;
                break;
            }
        }
    }
    // #endregion
}
