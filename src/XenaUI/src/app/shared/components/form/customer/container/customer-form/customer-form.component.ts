import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  Injector,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  PersonService,
  PropertyPanelService,
  HotKeySettingService,
  CommonService,
  DatatableService,
  ModalService,
  SearchService,
} from 'app/services';
import { Uti } from 'app/utilities';
import { FormControl, Validators } from '@angular/forms';
import {
  Title,
  PersonModel,
  Country,
  FieldFilter,
  ZipMaskPattern,
  ApiResultResponse,
  FormModel,
  WidgetPropertyModel,
  AutoGroupColumnDefModel,
} from 'app/models';
import { FormGroup } from '@angular/forms';

import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  XnCommonActions,
  ProcessDataActions,
  CustomAction,
  HotKeySettingActions,
  DataEntryActions,
  TabButtonActions,
} from 'app/state-management/store/actions';
import {
  ComboBoxTypeConstant,
  Configuration,
  MenuModuleId,
} from 'app/app.constants';
import isEmpty from 'lodash-es/isEmpty';
import merge from 'lodash-es/merge';
import { WjComboBox } from 'wijmo/wijmo.angular2.input';
import { CustomerFormBase } from 'app/shared/components/form/customer/container/customer-form-base';
import { parse, format } from 'date-fns/esm';
import * as commonReducer from 'app/state-management/store/reducer/xn-common';

import { DatePickerComponent } from 'app/shared/components/xn-control';
import { MatchingCustomerDataDialogComponent } from 'app/shared/components/form';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import isObject from 'lodash-es/isObject';
import cloneDeep from 'lodash-es/cloneDeep';
import { XnFormFgAddressComponent } from 'app/shared/components/form';
import { ControlFocusComponent } from 'app/shared/components/form';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'customer-form',
  styleUrls: ['./customer-form.component.scss'],
  templateUrl: './customer-form.component.html',
})
export class CustomerFormComponent
  extends CustomerFormBase
  implements OnInit, OnDestroy, AfterViewInit
{
  public currentCustomer: PersonModel;
  public customerData: PersonModel;
  public formFields: Array<FieldFilter> = [];
  public hotKeySetting: any;
  public globalNumberFormat: string = null;
  public dontShowControl: any = {
    idRepIsoCountryCode: true,
    idRepLanguage: true,
  };
  public showLoading = false;
  public showDialog = false;
  public proGlobalProperties: any;

  private isInvalidBDDate = false;
  private initCustomerSubscription: Subscription;
  private idRepIsoCountryCodeValuesChangedSubscription: Subscription;
  private customerFormIdRepTitleValuesChangeSubscription: Subscription;
  private dispatcherSubscription: Subscription;
  private customerMandatoryFieldStateSubscription: Subscription;
  private customerMandatoryFieldState: Observable<any>;
  private doubletCheckRequestState: Observable<any>;
  private doubletCheckRequestStateSubcription: Subscription;
  private subject: Subject<any> = new Subject();

  private MATCHING_DATA_FIELDS = [
    'idRepIsoCountryCode',
    'firstName',
    'lastName',
    'street',
    'zip',
  ];
  private _canSearchMatchingData = false;
  public needToCheckMatchingData = false;

  //Used to identify: finished loading the data
  private loadedDefaultData: any = {
    getListComboBox: false,
    getMandatoryField: false,
    getCustomerLabel: false,
  };

  //#region Input, Output
  @Output() outputData: EventEmitter<any> = new EventEmitter();
  @Output() outputFormFields: EventEmitter<FieldFilter[]> = new EventEmitter();

  @Input() searchIndexKey: string;
  @Input() isVerticalLayout = false; //True: use for ODE
  @Input() tabID: string;

  @Input() set data(data: any) {
    this.executeData(data);
  }
  @Input() set formFieldsData(formFields: FieldFilter[]) {
    this.executeFormFieldsData(formFields);
  }
  @Input() set globalProperties(globalProperties: any[]) {
    this.proGlobalProperties = globalProperties;
    this.executeGlobalProperties(globalProperties);
  }
  @Input() set transferTranslate(data: any) {
    this.execTransferTranslate(data);
  }
  //#endregion

  @ViewChild('idRepIsoCountryCode')
  idRepIsoCountryCodeCombobox: AngularMultiSelect;
  @ViewChild('dateOfBirth') dateOfBirth: DatePickerComponent;
  @ViewChild('matchingCustomerDataDialog')
  matchingCustomerDataDialog: MatchingCustomerDataDialogComponent;
  @ViewChild(XnFormFgAddressComponent)
  xnFormFgAddressComponent: XnFormFgAddressComponent;
  @ViewChild('focusControl') focusControl: ControlFocusComponent;

  constructor(
    public hotKeySettingService: HotKeySettingService,
    private modalService: ModalService,
    private comActions: XnCommonActions,
    private datePipe: DatePipe,
    private _personService: PersonService,
    private datatableService: DatatableService,
    private store: Store<AppState>,
    private dispatcher: ReducerManagerDispatcher,
    private hotKeySettingActions: HotKeySettingActions,
    private commonService: CommonService,
    private _dataEntryActions: DataEntryActions,
    private _tabButtonActions: TabButtonActions,
    private _processDataActions: ProcessDataActions,
    private el: ElementRef,
    protected propertyPanelService: PropertyPanelService,
    protected injector: Injector,
    protected router: Router,
    private searchService: SearchService,
    private uti: Uti
  ) {
    super(injector, propertyPanelService, router);

    this.isAutoBuildMandatoryField = true;

    this.moduleToPersonTypeState = this.store.select(
      (state) =>
        commonReducer.getCommonState(state, this.ofModule.moduleNameTrim)
          .moduleToPersonType
    );
    this.globalPropertiesState = store.select(
      (state) =>
        this.propertyPanelReducer.getPropertyPanelState(
          state,
          this.moduleList.Base.moduleNameTrim
        ).globalProperties
    );
    this.customerMandatoryFieldState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .customerMandatoryField
    );
    this.doubletCheckRequestState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .doubletCheckRequest
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

  public ngOnInit() {
    this.maxCharactersNotes = 4000;
    this.initFormData();
    this.loadDefaultData();
    this.subscription();
  }

  public ngAfterViewInit() {
    this.afterViewInit();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);

    this.currentCustomer = null;
    this.customerData = null;
  }

  //#region Form Events
  public onInputFieldChanged($event) {
    console.log($event);
  }

  public onCallSubmit(event?: any) {
    this.formGroup['submitted'] = true;
    this.formGroup.updateValueAndValidity();
  }

  public onCountryChanged() {
    if (
      !this.idRepIsoCountryCodeCombobox ||
      !this.idRepIsoCountryCodeCombobox.selectedItem
    )
      return;

    this.countrySelectedItem = this.idRepIsoCountryCodeCombobox.selectedItem;
    this.buildRegexForField(this.countrySelectedItem);
    this.buildHotKey(this.countrySelectedItem.sharingAddressHiddenFields);
    this.buildDateOfBirthFormat();
    this.onCountryChangedHandler(this.countrySelectedItem);
    if (this.formGroup.controls['isoCode']) {
      this.formGroup.controls['isoCode'].setValue(
        this.countrySelectedItem.isoCode
      );
      this.formGroup.controls['isoCode'].markAsPristine();
    }
    this.store.dispatch(
      this.comActions.changeCountryCode(
        this.idRepIsoCountryCodeCombobox.selectedItem,
        this.ofModule
      )
    );
  }

  public getCommOutputData(eventData) {
    this.commOutputData = eventData;
    this.setOutputData(null);
  }

  public onCommHasError(event) {
    this.isCommValid = !event;
    this.setOutputData(null);
  }

  public submit(event?: any) {
    this.formGroup.updateValueAndValidity();
    this.formGroup['submitted'] = true;
    if (this.isVerticalLayout) return;
    try {
      if (!this.isValid()) {
        this.setOutputData(false);
        return;
      }
      if (!this.formGroup.dirty) {
        this.callSaveData();
        return;
      }
      this.checkMatchingDataBeforeSaveData();
    } catch (ex) {}
  }

  public callBackAfterEnterWhenLastItemHandler($event) {
    if (this.isMatchingDataDirty()) {
      if (Configuration.PublicSettings.callODEDoublet) {
        this.callMatchingData();
      } else {
        this.focusControl.executeBehaviorInLastCustomerItem();
      }
    }
  }

  private callMatchingDataWithWaitForLoaingDataTimeout: any;
  private callMatchingDataWithWaitForLoaingData(
    forceSaveODE: boolean,
    numofCalling?: number
  ) {
    if (
      !this.isRenderForm ||
      !this.formGroup ||
      !this.formGroup.value ||
      !this.formGroup.value.idRepIsoCountryCode
    ) {
      clearTimeout(this.callMatchingDataWithWaitForLoaingDataTimeout);
      this.callMatchingDataWithWaitForLoaingDataTimeout = null;

      numofCalling = numofCalling || 1;
      if (numofCalling > 30) return;

      this.callMatchingDataWithWaitForLoaingDataTimeout = setTimeout(() => {
        this.callMatchingDataWithWaitForLoaingData(
          forceSaveODE,
          ++numofCalling
        );
      }, 300);

      return;
    }

    this.callMatchingData(forceSaveODE);
  }

  private isForceSaveODE: boolean;
  private callMatchingData(forceSaveODE?: boolean) {
    if (
      !this.isRenderForm ||
      !this.formGroup ||
      !this.formGroup.value ||
      !this.formGroup.value.idRepIsoCountryCode
    )
      return;

    this.isForceSaveODE = forceSaveODE;
    this._canSearchMatchingData = false;
    this.showLoading = true;

    this.commonService
      .matchingCustomerData(this.prepareMatchingData())
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          this.showLoading = false;
          const data = this.makeDataSourceData(response);
          if (!data || !data.length) {
            //Customer on ODE
            if (this.isVerticalLayout) {
              if (forceSaveODE)
                this.store.dispatch(
                  this._dataEntryActions.dataEntryCustomerMatchedDataChanged(
                    { forceSaveODE: true },
                    this.tabID
                  )
                );
            } else {
              this.focusControl.executeBehaviorInLastCustomerItem();
            }
            return;
          }

          const arrayPersonNr = [];
          data.forEach((item) => {
            if (item.PersonNr) {
              arrayPersonNr.push(item.PersonNr);
            }
          });
          if (!arrayPersonNr.length) return;

          this.searchCustomerDoublet(arrayPersonNr);
        });
      });
  }

  private searchCustomerDoublet(arrayPersonNr: Array<string>) {
    //arrayPersonNr = ["83471", "7904", '7881', '7882', '113922'];
    this.searchService
      .searchCustomerDoublet(arrayPersonNr)
      .subscribe((response: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!response.item) return;
          response = response.item;
          this.showDialog = true;
          setTimeout(() => {
            if (this.matchingCustomerDataDialog) {
              const dataResult =
                this.datatableService.buildDataSourceFromEsSearchResult(
                  response,
                  1
                );
              if (dataResult.data && dataResult.data.length) {
                const array1 = [];
                const array2 = [];
                dataResult.data.forEach((item) => {
                  item.GroupName = item.IdPerson;
                  let found = false;
                  if (item.IdPerson == item.IdPersonMaster) {
                    found = true;
                  } else {
                    //Can't find parent
                    if (
                      !dataResult.data.find(
                        (f) => f.IdPerson == item.IdPersonMaster
                      )
                    ) {
                      found = true;
                    }
                  }
                  if (found) {
                    item.IdPersonMaster = null;
                    array2.push(item);
                  } else {
                    array1.push(item);
                  }
                });
                dataResult.data = array2.concat(array1);

                dataResult.autoGroupColumnDef = new AutoGroupColumnDefModel({
                  headerName: 'Id Person',
                  width: 35,
                  isFitColumn: true,
                });
                this.matchingCustomerDataDialog.onShowDialog(dataResult);
              }
            }
          }, 300);
        });
      });
  }

  public isMatchingDataDirty() {
    try {
      //Customer on ODE
      if (this.isVerticalLayout) {
        if (
          !this._canSearchMatchingData ||
          !this.formGroup.value.idRepIsoCountryCode
        )
          return false;

        const addressControl = (<any>this.formGroup.controls['address'])
          .controls;
        let countValue = 0;

        if (!!this.formGroup.value.firstName) countValue++;
        if (!!this.formGroup.value.lastName) countValue++;
        if (!!addressControl.street.value) countValue++;

        if (countValue < 2) return false;

        return (
          addressControl.street.dirty ||
          addressControl.zip.dirty ||
          this.formGroup.controls['idRepIsoCountryCode'].dirty ||
          this.formGroup.controls['firstName'].dirty ||
          this.formGroup.controls['lastName'].dirty
        );
      } else {
        //idPerson = null && personNr != null -> person from DB Mailling
        if (
          !this.formGroup.value.idPerson &&
          this.formGroup.value.personNr &&
          !!this.formGroup.value.idRepIsoCountryCode &&
          !!this.formGroup.value.firstName &&
          !!this.formGroup.value.lastName
        ) {
          return true;
        }
      }
    } catch (ex) {}

    return false;
  }

  public onCloseHanlder(isPrevented?: boolean) {
    if (this.isVerticalLayout && this.needToCheckMatchingData) {
      this.needToCheckMatchingData = false;
      this.setOutputData(null);
    }
    this.showDialog = false;
    if (this.isVerticalLayout && !isPrevented) {
      if (this.isForceSaveODE)
        this.store.dispatch(
          this._dataEntryActions.dataEntryCustomerMatchedDataChanged(
            { forceSaveODE: true },
            this.tabID
          )
        );
      else this.focusControl.executeBehaviorInLastCustomerItem();
    } else {
      this.store.dispatch(
        this._tabButtonActions.setCommandDisable(this.ofModule, [
          { save: false },
          { saveAndNew: false },
          { saveAndClose: false },
          { saveAndNext: false },
        ])
      );
    }
  }

  public onIgnoreAndSaveHanlder() {
    this.callSaveData();
  }

  keypress($event) {
    const valueKeypress = $event && $event.target && $event.target.value;
    if (valueKeypress === '') {
      this.formGroup.value.dateOfBirth = valueKeypress;
    }
  }

  public onSelectedItemHanlder($event) {
    if (this.isVerticalLayout) {
      this.needToCheckMatchingData = false;
      this.showDialog = false;
      this.setOutputData(null);
      this.store.dispatch(
        this._dataEntryActions.dataEntryCustomerMatchedDataChanged(
          $event,
          this.tabID
        )
      );
    } else {
      // Close new form
      this.store.dispatch(
        this._tabButtonActions.requestCancel(this.ofModule, true)
      );
      // add to parked Item
      this.store.dispatch(
        this._processDataActions.requestAddToParkedItems(
          $event,
          this.ofModule,
          { thenSelect: true, idName: 'idPerson' }
        )
      );
    }
  }

  public dateOfBirthChanged(): void {
    const dayOfBirth = this.formGroup.controls['dateOfBirth'].value;
    if (dayOfBirth) {
      const bdDay = this.uti.formatLocale(dayOfBirth, 'dd');
      const bdMonth = this.uti.formatLocale(dayOfBirth, 'MM');
      const bdYear = this.uti.formatLocale(dayOfBirth, 'yyyy');
      this.formGroup.controls['bdDay'].setValue(bdDay);
      this.formGroup.controls['bdMonth'].setValue(bdMonth);
      this.formGroup.controls['bdYear'].setValue(bdYear);

      this.validateBirthDay(bdDay, bdMonth, bdYear);
    }
  }
  //#endregion

  //#region Public Methods
  public getFormValue() {
    return merge(this.formGroup.value, {
      Communications: this.commOutputData,
    });
  }

  public getTitle(idRepTitle: any) {
    let title: any = '';
    if (this.listComboBox && this.listComboBox.title) {
      title = this.listComboBox.title.find((x) => x.idValue == idRepTitle);
      if (title) {
        return title.textValue;
      }
    }

    return title;
  }

  public prepareSubmitData() {
    const model = this.formGroup.value;
    if (!model || !model.address || !this.currentCustomer) return null;

    return {
      Person: {
        IdPerson: this.getUnEmptyValue(model['idPerson']),
        Notes: model.notes,
        IsMatch: Uti.toBoolean(model.isMatch),
        IsActive: Uti.toBoolean(model.isActive),
      },
      PersonTypeGw: {
        IdRepPersonType: this.mapMenuIdToPersonTypeId['2'], // Customer
        IdPersonTypeGw: this.getUnEmptyValue(model['idPersonTypeGw']),
      },
      SharingName: {
        IdRepTitleOfCourtesy: null,
        IdRepTitle: Uti.isNullUndefinedEmptyObject(model.idRepTitle)
          ? null
          : model.idRepTitle,
        LastName: model.lastName,
        FirstName: model.firstName,
        NameAddition: model.nameAddition,
        IdSharingName: this.getUnEmptyValue(model['idSharingName']),
      },
      SharingAddress: {
        IdRepLanguage: model.idRepLanguage,
        IdRepIsoCountryCode: model.idRepIsoCountryCode,
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
        IdSharingAddress: this.getUnEmptyValue(model['idSharingAddress']),
      },
      PersonInterface: {
        IdRepAddressType: '1',
        IsMainRecord: true,
        IdPersonInterface: this.getUnEmptyValue(model['idPersonInterface']),
      },
      PersonMasterData: {
        DateOfBirth:
          model.dateOfBirth && this.getUnEmptyStringDoB(model.dateOfBirth)
            ? this.datePipe.transform(
                model.dateOfBirth,
                this.consts.dateFormatInDataBase
              )
            : '',
        IsActive: true,
        IdPersonMasterData: this.getUnEmptyValue(model['idPersonMasterData']),
      },
      PersonStatus: {
        IdRepPersonStatus: this.getUnEmptyValue(model.idRepPersonStatus),
        IsActive: true,
        IdPersonStatus: this.getUnEmptyValue(model['idPersonStatus']),
      },
      PersonAlias: {
        PersonAliasNr: 'default',
      },
      Communications: this.makeCommunicationSavingData(
        this.getUnEmptyValue(model['idPersonInterface'])
      ),
    };
  }

  public isValid(): boolean {
    if (this.isVerticalLayout) {
      this.validateBirthDay();
      return this.formGroup.valid && !this.isInvalidBDDate;
    }
    return this.checkFormValid();
  }

  public isDirty(): boolean {
    return this.checkFormDirty();
  }

  public getFormModel(): any {
    const formValue = this.getFormValue();
    const mappedData = this.prepareSubmitData();
    const isFormValid = this.isValid();
    const isFormDirty = this.isDirty();

    if (formValue && formValue.idRepTitle)
      formValue.title = this.getTitle(formValue.idRepTitle);

    return new FormModel({
      formValue: formValue,
      mappedData: mappedData,
      isValid: isFormValid,
      isDirty: isFormDirty,
      needToCheckMatchingData: this.needToCheckMatchingData,
    });
  }

  public markAsPristineForm() {
    if (!this.isRenderForm) return;

    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();

    this.outputData.emit({
      submitResult: null,
      returnID: null,
      isValid: true,
      isDirty: false,
      formValue: this.formGroup.value,
      customData: this.getFormModel(),
    });
  }

  public callBackWhenInvalidCharacterHandler() {
    if (!this.isVerticalLayout) return;
    this.modalService.warningMessage([
      {
        key: 'Modal_Message__Please_Input_Area_Without_Character',
        callBack: () => {
          setTimeout(() => {
            $('#area', this.el.nativeElement).focus();
          }, 300);
        },
      },
    ]);
  }
  //#endregion

  //#region Private Methods

  private setOutputData(submitResult: any, returnID?: any) {
    this.setValueForOutputModel(submitResult, returnID);
    this.outputModel.customData = this.getFormModel();
    this.outputModel.customData.originalCustomerData =
      this.addressFGData.updateData;
    this.outputData.emit(this.outputModel);
  }

  //#region Subscription

  private subscription() {
    this.subscribeFormEditModeState();
    this.subcribeRequestSaveState();
    this.updateCommunicationData();
    this.subcribeModuleToPersonTypeState();
    this.subscribeGlobalProperties();
    this.subscribeCustomerMandatoryFieldChanged();
    this.subscribeDoubletCheck();
  }

  private subcribeRequestSaveState() {
    this.dispatcherSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_SAVE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI &&
          (!action.area || action.area == this.tabID)
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.submit();
        });
      });
  }

  private subscribeCustContactForm() {
    if (this.formValuesChangeSubscription)
      this.formValuesChangeSubscription.unsubscribe();

    this.formValuesChangeSubscription = this.formGroup.valueChanges
      .debounceTime(this.consts.valueChangeDeboundTimeDefault)
      .subscribe((data) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !(this.formGroup.pristine && this.formGroup.untouched) ||
            this.isVerticalLayout
          ) {
            this.makeValidationForFormControl();
            this.toggleMatchingSearch();
            this.setMatchingDataDirty();
            this.setOutputData(null);
          }
        });
      });
  }

  private subscribeCustomerMandatoryFieldChanged() {
    this.customerMandatoryFieldStateSubscription =
      this.customerMandatoryFieldState.subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (data) {
            this.rebuildRequireFields(data);
          }
        });
      });
  }

  private subscribeDoubletCheck() {
    this.doubletCheckRequestStateSubcription =
      this.doubletCheckRequestState.subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (response && response.isCheck) {
            this.callMatchingDataWithWaitForLoaingData(response.forceSaveODE);
          }
        });
      });
  }

  private setMatchingDataDirty() {
    if (!this.isVerticalLayout) return;

    this.needToCheckMatchingData = this.isMatchingDataDirty();
    //console.log('needToCheckMatchingData: ' + this.needToCheckMatchingData);
  }
  //#endregion

  //#region Init Form
  private initFormData() {
    this.initForm({
      idRepIsoCountryCode: '',
      countryCode: '',
      isoCode: '',
      idRepLanguage: '',
      idRepTitle: '',
      title: '',
      firstName: '',
      lastName: '',
      nameAddition: '',
      idRepPersonStatus: '',
      dateOfBirth: '',
      communicationData: '',
      bdDay: 1,
      bdMonth: 1,
      isActive: true,
      bdYear: new Date().getFullYear() - 18,
      idPerson: '',
      idPersonTypeGw: '',
      idSharingName: '',
      idSharingAddress: '',
      idPersonInterface: '',
      idPersonMasterData: '',
      idPersonStatus: '',
      personNr: '',
      addressFormat: '',
      notes: '',
    });

    Uti.registerFormControlType(this.formGroup, {
      dropdown:
        'idRepIsoCountryCode;idRepLanguage;idRepTitle;idRepPersonStatus',
      number: 'bdDay;bdMonth;bdYear',
      datetime: 'dateOfBirth',
    });

    Uti.setIsTextBoxForFormControl(this.formGroup, [
      'firstName',
      'lastName',
      'nameAddition',
    ]);

    this.buildFormFields();
  }

  private buildFormFields() {
    if (this.formFields && this.formFields.length) return;

    this.formFields = [
      new FieldFilter({
        fieldDisplayName: 'Iso Country Code',
        fieldName: 'idRepIsoCountryCode',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Language',
        fieldName: 'idRepLanguage',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Gender',
        fieldName: 'idRepTitle',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'First Name',
        fieldName: 'firstName',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Last Name',
        fieldName: 'lastName',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Name Addition',
        fieldName: 'nameAddition',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Birthday',
        fieldName: 'dateOfBirth',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Area',
        fieldName: 'area',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Street',
        fieldName: 'street',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Street Number',
        fieldName: 'streetNr',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Street Addition 1',
        fieldName: 'streetAddition1',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Street Addition 1',
        fieldName: 'streetAddition1',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Street Addition 2',
        fieldName: 'streetAddition2',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Zip',
        fieldName: 'zip',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Zip 2',
        fieldName: 'zip2',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Pobox',
        fieldName: 'idRepPoBox',
        selected: true,
        isEditable: false,
      }),
      new FieldFilter({
        fieldDisplayName: 'Place',
        fieldName: 'place',
        selected: true,
        isEditable: false,
      }),
    ];
  }

  private manageDisplayFormFields() {
    if (!this.formGroup || !this.formFields) return;

    this.formFields.forEach((field) => {
      if (!field.selected) {
        if (this.formGroup.controls[field.fieldName]) {
          this.formGroup.removeControl(field.fieldName);
          if (field.fieldName == 'dateOfBirth') {
            this.formGroup.removeControl('bdDay');
            this.formGroup.removeControl('bdMonth');
            this.formGroup.removeControl('bdYear');
          }
        } else if (
          this.formGroup.contains('address') &&
          this.formGroup.get('address.' + field.fieldName)
        ) {
          (this.formGroup.get('address') as FormGroup).removeControl(
            field.fieldName
          );
        }
      } else {
        switch (field.fieldName) {
          case 'idRepIsoCountryCode':
          case 'idRepLanguage':
          case 'idRepTitle':
          case 'firstName':
          case 'lastName':
          case 'nameAddition':
            this.formGroup.addControl(field.fieldName, new FormControl());
            break;

          case 'dateOfBirth':
            this.formGroup.addControl(field.fieldName, new FormControl(''));
            this.formGroup.addControl('bdDay', new FormControl());
            this.formGroup.addControl('bdMonth', new FormControl());
            this.formGroup.addControl('bdYear', new FormControl());
            break;

          default:
            if (this.formGroup.contains('address')) {
              (this.formGroup.get('address') as FormGroup).addControl(
                field.fieldName,
                new FormControl()
              );
            }
            break;
        }
      }
    }); //forEach

    this.formGroup.updateValueAndValidity();
    this.registerValueChangeForLitleControl();
    this.outputFormFields.emit(this.formFields);

    if (this.focusControl) this.focusControl.initControl(true);
  }

  private registerValueChangeForLitleControl() {
    if (this.formGroup.controls['idRepIsoCountryCode']) {
      if (this.idRepIsoCountryCodeValuesChangedSubscription)
        this.idRepIsoCountryCodeValuesChangedSubscription.unsubscribe();

      this.idRepIsoCountryCodeValuesChangedSubscription =
        this.formGroup.controls['idRepIsoCountryCode'].valueChanges
          .debounceTime(this.consts.valueChangeDeboundTimeDefault)
          .subscribe(() => {
            this.appErrorHandler.executeAction(() => {
              if (!this.formGroup.controls['idRepIsoCountryCode'].dirty) return;

              setTimeout(() => {
                if (
                  !this.formGroup.controls['idRepIsoCountryCode'].value ||
                  this.formGroup.controls['idRepIsoCountryCode'].value.length <=
                    0
                )
                  return;

                const filterCountry = (<Array<Country>>(
                  this.listComboBox.countryCode
                )).find(
                  (item) =>
                    item.idValue ===
                    this.formGroup.controls['idRepIsoCountryCode'].value
                );
                this.formGroup.controls['countryCode'].setValue(
                  filterCountry.textValue
                );
                this.formGroup.updateValueAndValidity();
              });
            });
          });
    }

    if (this.formGroup.controls['idRepTitle']) {
      if (this.customerFormIdRepTitleValuesChangeSubscription)
        this.customerFormIdRepTitleValuesChangeSubscription.unsubscribe();

      this.customerFormIdRepTitleValuesChangeSubscription =
        this.formGroup.controls['idRepTitle'].valueChanges
          .debounceTime(this.consts.valueChangeDeboundTimeDefault)
          .subscribe(() => {
            this.appErrorHandler.executeAction(() => {
              if (!this.formGroup.controls['idRepTitle'].dirty) return;

              setTimeout(() => {
                if (
                  !this.formGroup.controls['idRepTitle'].value ||
                  this.formGroup.controls['idRepTitle'].value.length <= 0
                )
                  return;

                const filterTitle = (<Array<Title>>(
                  this.listComboBox.title
                )).find(
                  (item) =>
                    item.idValue === this.formGroup.controls['idRepTitle'].value
                );
                this.formGroup.controls['title'].setValue(
                  filterTitle.textValue
                );
                this.formGroup.updateValueAndValidity();
              });
            });
          });
    }
  }
  //#endregion

  //#region Load Default Data

  //Get ListComboBox, Customer Mandatory Fields, Customer Labels
  private loadDefaultData() {
    //get ListComboBox
    const comboBoxTypes = [
      ComboBoxTypeConstant.language,
      ComboBoxTypeConstant.title,
      ComboBoxTypeConstant.countryCode,
      ComboBoxTypeConstant.pOBox,
      ComboBoxTypeConstant.customerStatus,
      ComboBoxTypeConstant.communicationTypeType,
    ];
    this.commonService
      .getListComboBox(comboBoxTypes.join())
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) return;

          this.listComboBox = response.item;
          //finished loading the data
          this.loadedDefaultData.getListComboBox = true;
          this.proccessForLoadDefaultDataFinished();
        });
      });

    //Get Mandatory Fields
    this._personService
      .getMandatoryField('Customer')
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) return;

          var mandatoryParameter = Uti.getMandatoryData(response);
          if (!isEmpty(mandatoryParameter)) {
            this.makeMadatoryField(mandatoryParameter);
            //finished loading the data
            this.loadedDefaultData.getMandatoryField = true;
            this.proccessForLoadDefaultDataFinished();
          }
        });
      });

    //Get Labels
    this._personService
      .getPersonById('')
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) return;

          //Customer Labels
          this.currentCustomer = response.item;

          //finished loading the data
          this.loadedDefaultData.getCustomerLabel = true;
          this.regularExpressionData = Uti.getRegularExpressionData(
            this.currentCustomer
          );
          this.proccessForLoadDefaultDataFinished();
        });
      });
  }

  private proccessForLoadDefaultDataFinished() {
    if (
      !this.loadedDefaultData.getListComboBox ||
      !this.loadedDefaultData.getMandatoryField ||
      !this.loadedDefaultData.getCustomerLabel
    )
      return;

    this.subscribeCustContactForm();

    //currentCustomer: customer Labels; customerData: updateData
    this.initDataForAddressFG(
      this.currentCustomer,
      cloneDeep(this.customerData),
      true
    );
    this.customerData = null;

    this.manageDisplayFormFields();
    this.isRenderForm = true;

    this.setOutputData(null);

    //if this widget is using on ODE -> don't focus on first control
    if (!this.isVerticalLayout) {
      setTimeout(() => {
        if (!this.focusControl) return;
        if (!this.isVerticalLayout) {
          this.focusControl.focusOnFirstControl();
        }
      }, 300);
    }
  }
  //#endregion

  private getUnEmptyValue(value) {
    return value === '' ? null : value;
  }

  private getUnEmptyStringDoB(value) {
    return value === '' ? '' : value;
  }

  private checkMatchingDataBeforeSaveData() {
    this.commonService
      .matchingCustomerData(this.prepareMatchingData())
      .subscribe(
        (response) => {
          this.appErrorHandler.executeAction(() => {
            this.showLoading = false;
            let data: any = this.makeDataSourceData(response);
            if (!data || !data.length) {
              this.callSaveData();
              return;
            }
            if (this.formEditMode) {
              data = data.filter((x) => x.IdPerson != this.mainId);
              if (!data || !data.length) {
                this.callSaveData();
                return;
              }
            }
            this.showDialog = true;
            setTimeout(() => {
              if (this.matchingCustomerDataDialog) {
                this.matchingCustomerDataDialog.onShowDialog(
                  { data },
                  this.formEditMode &&
                    this.ofModule.idSettingsGUI === MenuModuleId.customer
                );
              }
            }, 300);
          });
        },
        (err) => {}
      );
  }

  private callSaveData() {
    this._personService[this.mainId ? 'updatePerson' : 'createPerson'](
      this.prepareSubmitData(),
      this.searchIndexKey
    ).subscribe(
      (data) => {
        this.appErrorHandler.executeAction(() => {
          this.setOutputData(true, data.idPerson);
          Uti.resetValueForForm(this.formGroup);
        });
      },
      (err) => {
        this.setOutputData(false);
      }
    );
  }

  private makeDataSourceData(rawData: any): Array<any> {
    if (!rawData.item || !rawData.item.length) {
      return [];
    }
    return rawData.item;
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

  private prepareMatchingData(): any {
    const addressControls = (<any>this.formGroup.controls['address']).controls;
    return {
      firstName: this.formGroup.value.firstName,
      lastName: this.formGroup.value.lastName,
      street: addressControls.street.value,
      idRepIsoCountryCode: this.formGroup.value.idRepIsoCountryCode,
      zip: addressControls.zip.value,
    };
  }
  private buildRegexForField(selectedItem: any) {
    let validationZip2MaskFormat = selectedItem.validationZip2MaskFormat;
    let validationZip2RegEx = selectedItem.validationZip2RegEx;
    let validationZipMaskFormat = selectedItem.validationZipMaskFormat;
    let validationZipRegEx = selectedItem.validationZipRegEx;

    if (this.xnFormFgAddressComponent) {
      this.xnFormFgAddressComponent.updateZipMask({
        validationZipMaskFormat,
        validationZipRegEx,
        validationZip2MaskFormat,
        validationZip2RegEx,
      });
    }
  }
  private buildHotKey(sharingAddressHiddenFields: any) {
    if (sharingAddressHiddenFields) {
      let hiddenFields: Array<string> = sharingAddressHiddenFields.split(';');
      if (hiddenFields) {
        hiddenFields.forEach((hiddenField) => {
          let key = hiddenField.charAt(0).toLowerCase() + hiddenField.slice(1);
          this.store.dispatch(
            this.hotKeySettingActions.addHotKeySetting(key, '')
          );
        });
      }
    }
  }
  private subcribeModuleToPersonTypeState() {
    this.moduleToPersonTypeStateSubcription =
      this.moduleToPersonTypeState.subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          this.mapMenuIdToPersonTypeId = data;
        });
      });
  }

  private executeGlobalProperties(globalProperties: any[]) {
    this.globalDateFormat =
      this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
        globalProperties
      );
    this.globalNumberFormat =
      this.propertyPanelService.buildGlobalNumberFormatFromProperties(
        globalProperties
      );
  }

  private executeFormFieldsData(formFields: FieldFilter[]) {
    if (formFields && formFields.length && formFields != this.formFields) {
      this.formFields = formFields;
      this.manageDisplayFormFields();
    }
  }

  private execTransferTranslate(transferTranslate: Array<any>) {
    if (!this.currentCustomer || !this.currentCustomer.idRepIsoCountryCode)
      return;

    for (let item in this.currentCustomer) {
      if (!this.currentCustomer[item]) continue;
      this.currentCustomer[item]['displayValue'] =
        Uti.getTranslateTitle(transferTranslate, item) ||
        this.currentCustomer[item]['displayValue'];
    }
  }

  private toggleMatchingSearch() {
    if (this._canSearchMatchingData) return;

    const fieldNameChanged: Array<string> = this.getFieldNameChanged();
    if (!fieldNameChanged || !fieldNameChanged.length) {
      return;
    }

    for (let item of fieldNameChanged) {
      if (this.MATCHING_DATA_FIELDS.indexOf(item) > -1) {
        this._canSearchMatchingData = true;
        return;
      }
    }
  }

  private rebuildRequireFields(data: any) {
    Object.keys(this.formGroup.controls).forEach((y) => {
      data.forEach((x) => {
        if (x.Fieldname.toLowerCase() == y.toLowerCase()) {
          this.formGroup.controls[y].setValidators(Validators.required);
          this.formGroup.controls[y].setErrors({ required: true });
          this.formGroup.controls[y].updateValueAndValidity();
          if (this.mandatoryColor) this.mandatoryColor[y] = x.GroupsColor;
        }
      });
    });
  }
  //#endregion

  //#region UpdateData
  public executeData(data: any) {
    if (!isEmpty(data)) {
      this.updateFormData(data);
    } else {
      Uti.resetValueForForm(this.formGroup);
    }
  }

  private updateFormData(data: any) {
    if (!this.isVerticalLayout || !this.formGroup || !data || !isObject(data))
      return;
    this.continueUpdateFormData(data);
  }

  private continueUpdateFormData(data: any) {
    Uti.resetValueForForm(this.formGroup);
    this.setDataForForm(data, [
      'idRepIsoCountryCode',
      'idRepLanguage',
      'idRepTitle',
      'firstName',
      'lastName',
      'nameAddition',
      'idPerson',
      'idPersonTypeGw',
      'idSharingName',
      'idSharingAddress',
      'idPersonInterface',
      'idPersonMasterData',
      'idPersonStatus',
      'isActive',
      'personNr',
      'addressFormat',
    ]);

    const dateOfBirth = data['dateOfBirth'];
    if (
      dateOfBirth &&
      dateOfBirth.value &&
      dateOfBirth.value.length &&
      this.formGroup.controls['dateOfBirth']
    )
      this.formGroup.controls['dateOfBirth'].setValue(
        parse(dateOfBirth.value, 'dd.MM.yyyy', new Date())
      );

    if (this.isRenderForm) {
      //currentCustomer: customer Labels; data: updateData
      if (!this.currentCustomer) this.currentCustomer = data;

      this.addressFGData = {
        updateData: data,
        mode: 1,
        listComboBox: this.listComboBox,
        parentFG: this.formGroup,
      };
    } else {
      //wait for rendering customer form, 'customerData' used to update for AddressComponent
      //After passing to AddressComponent, it will be destroyed
      this.customerData = data;
    }

    this.formGroup.updateValueAndValidity();
    setTimeout(() => {
      this.makeValidationForFormControl();
    });
  }

  private setDataForForm(data: any, formControlNames: Array<string>) {
    for (let item of formControlNames) {
      if (!this.formGroup.controls[item] || !data[item]) continue;
      this.formGroup.controls[item].setValue(
        Uti.isNullUndefinedEmptyObject(data[item].value) ? '' : data[item].value
      );
      this.formGroup.markAsPristine();
    }
  }
  //#endregion

  //#region Validate
  private validateBirthDay(day?: any, month?: any, year?: any) {
    if (!day) {
      const dayOfBirth = this.formGroup.controls['dateOfBirth'].value;
      if (dayOfBirth) {
        day = this.uti.formatLocale(dayOfBirth, 'dd');
        month = this.uti.formatLocale(dayOfBirth, 'MM');
        year = this.uti.formatLocale(dayOfBirth, 'yyyy');
      }
    }

    if (
      !(!day && !month && !year) &&
      (!day ||
        !month ||
        !year ||
        !this.isValidDate(day + '/' + month + '/' + year))
    ) {
      this.isInvalidBDDate = true;
    }
    this.isInvalidBDDate = false;
  }

  private isValidDate(s) {
    const bits = s.split('/');
    const y = bits[2],
      m = bits[1],
      d = bits[0];
    // Assume not leap year by default (note zero index for Jan)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // If evenly divisible by 4 and not evenly divisible by 100,
    // or is evenly divisible by 400, then a leap year
    if ((!(parseInt(y) % 4) && parseInt(y) % 100) || !(parseInt(y) % 400)) {
      daysInMonth[1] = 29;
    }
    return (
      y.length == 4 &&
      parseInt(y) >= new Date().getFullYear() - 100 &&
      !/\D/.test(String(d)) &&
      parseInt(d) > 0 &&
      parseInt(d) <= daysInMonth[parseInt(m) - 1]
    );
  }

  //#endregion

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
            const editingData = Uti.mapObjectValueToGeneralObject(
              response.item
            );
            Uti.setValueForFormWithStraightObject(this.formGroup, editingData, {
              dateOfBirth: 'datetime',
              dateFormatString: 'dd.MM.yyyy',
            });
            this.formGroup.markAsPristine();
            this.setOutputData(null);
            const noteValue = this.formGroup.get('notes').value;
            this.formGroup['leftCharacters'] =
              this.maxCharactersNotes - (noteValue ? noteValue.length : 0);
            setTimeout(() => {
              this.makeValidationForFormControl();
            });
          });
        });
      this.loadCommunicationData();
    }, 400);
  }

  private loadCommunicationData() {
    this._personService.loadCommunication(this.mainId).subscribe((response) => {
      this.appErrorHandler.executeAction(() => {
        const tempDataSource = this.datatableService.buildEditableDataSource(
          response.data
        );
        this.commInputputData = tempDataSource.data;
      });
    });
  }
  // #endregion
}
