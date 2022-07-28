import {
    Component, Input, Output,
    EventEmitter, ViewChild, OnInit, OnDestroy
} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {CommonService, DatatableService, AppErrorHandler, WidgetTemplateSettingService} from 'app/services';
import {ComboBoxTypeConstant, Configuration} from 'app/app.constants';
import {Uti} from 'app/utilities/uti';
import {
    Store, ReducerManagerDispatcher
} from '@ngrx/store';
import {AppState} from 'app/state-management/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {PersonService} from 'app/services';
import {
    ApiResultResponse, WidgetDetail,
} from 'app/models';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import {BaseComponent} from 'app/pages/private/base';
import {Router} from '@angular/router';
import {
    ProcessDataActions,
    CustomAction
} from 'app/state-management/store/actions';
import {ColHeaderKey} from 'app/shared/components/xn-control/xn-ag-grid/shared/ag-grid-constant';
import {ToasterService} from 'angular2-toaster/angular2-toaster';
import {XnAgGridComponent} from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';

@Component({
    selector: 'app-ad-payment-account-form',
    styleUrls: ['./ad-payment-account-form.component.scss'],
    templateUrl: './ad-payment-account-form.component.html'
})

export class PaymentAccountFormComponent extends BaseComponent implements OnInit, OnDestroy {
    isRenderForm: boolean;
    private listComboBox: any;
    private paymentAccountForm: FormGroup;
    private outputModel: { submitResult?: boolean, formValue: any, isValid?: boolean, isDirty?: boolean, returnID?: string };
    private initData: any;
    private submitted = false;
    private idPerson;
    private uti: Uti;
    private scrollHeight: any;
    private gridError = false;

    private selectedEntityState: Observable<any>;
    private selectedEntityStateSubscription: Subscription;
    private widgetTemplateSettingServiceSubscription: Subscription;

    private dataSourceTable = {data: [], columns: []};
    private paymentAccountFormValueChangesSubscription: Subscription;
    private comServiceSubscription: Subscription;
    private personServSubscription: Subscription;
    private dispatcherSubscription: Subscription;
    private REQUEST_STRING = {
        'Request':
            {
                'ModuleName': 'GlobalModule',
                'ServiceName': 'GlobalService',
                'Data':
                    '{"MethodName" : "SpAppWg002CashProviderGrid", "CrudType"  : null, "Object" : null,"Mode" :  null, "WidgetTitle" : "Cash Provider", "IsDisplayHiddenFieldWithMsg" : "1",<<LoginInformation>>,<<InputParameter>>}'
            }
    };
    @ViewChild(XnAgGridComponent) public xnAgGridComponent: XnAgGridComponent;

    @Input() gridId: string;
    @Output() outputData: EventEmitter<any> = new EventEmitter();
    public paymentsTermsName: any;
    public countryCode: any;
    public paymentsTermsType: any;

    constructor(
        private consts: Configuration,
        private formBuilder: FormBuilder,
        private comService: CommonService,
        private personServ: PersonService,
        private store: Store<AppState>,
        private datatableService: DatatableService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router,
        private toasterService: ToasterService,
        private appErrorHandler: AppErrorHandler,
        private widgetTemplateSettingService: WidgetTemplateSettingService,

    ) {
        super(router);

        this.selectedEntityState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).selectedEntity);
        this.uti = new Uti();
    }

    public ngOnInit() {
        this.initEmptyData();
        this.getDropdownlistData();
        this.subcribeRequestSaveState();

        this.paymentAccountFormValueChangesSubscription = this.paymentAccountForm.valueChanges
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((data) => {
                this.appErrorHandler.executeAction(() => {
                    setTimeout(() => {
                        if (!this.paymentAccountForm.pristine) {
                            this.outputModel = {
                                submitResult: null, formValue: this.paymentAccountForm.value,
                                isValid: this.paymentAccountForm.valid, isDirty: this.paymentAccountForm.dirty
                            };
                            this.outputData.emit(this.outputModel);
                        }
                    });
                });
            });

        this.selectedEntityStateSubscription = this.selectedEntityState.subscribe((selectedEntityState: any) => {
            this.appErrorHandler.executeAction(() => {
                if (selectedEntityState && selectedEntityState['id']) {
                    this.idPerson = selectedEntityState['id'];
                }
            });
        });

        const widgetDetail: WidgetDetail = new WidgetDetail({
            idRepWidgetType: 2,
            moduleName: 'Administration',
            request: JSON.stringify(this.REQUEST_STRING)
        });
        this.widgetTemplateSettingServiceSubscription = this.widgetTemplateSettingService.getWidgetDetailByRequestString(widgetDetail, {IdPerson: this.idPerson})
            .subscribe((response: WidgetDetail) => {
                this.appErrorHandler.executeAction(() => {
                    const data = response.contentDetail.columnSettings;
                        this.paymentsTermsType = data['DefaultValue'].ColumnHeader;
                        this.countryCode = data['__DefaultValue'].ColumnHeader;
                        this.paymentsTermsName = data.PaymentsTermsName.ColumnHeader;
                });
            });
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public onTableEditSuccess(eventData) {
        if (this.xnAgGridComponent) {
            this.gridError = this.xnAgGridComponent.hasError();
        }
        this.paymentAccountForm.markAsDirty();
        this.onDeletedRowsSuccess(null);
    }

    public onSubmit(event?: any) {
        this.submitted = true;
        try {
            this.paymentAccountForm.updateValueAndValidity();
            this.paymentAccountForm['submitted'] = true;
            if (!this.paymentAccountForm.valid || this.gridError) {
                this.outputModel = {
                    submitResult: false, formValue: this.paymentAccountForm.value,
                    isValid: this.paymentAccountForm.valid, isDirty: this.paymentAccountForm.dirty
                };
                this.outputData.emit(this.outputModel);
                //this.toasterService.pop('warning', 'Validation Fail', 'There are some fields do not pass validation.');
                return false;
            }

            this.personServSubscription = this.personServ.createPaymentAccount(this.prepareSubmitCreateData())
                .subscribe(
                    (data) => {
                        this.appErrorHandler.executeAction(() => {
                            this.outputModel = {
                                submitResult: true, formValue: this.paymentAccountForm.value,
                                isValid: true, isDirty: false, returnID: data.returnID
                            };
                            this.outputData.emit(this.outputModel);
                            this.resetForm();
                        });
                    },
                    (err) => {
                        this.outputModel = {
                            submitResult: false, formValue: this.paymentAccountForm.value,
                            isValid: this.paymentAccountForm.valid, isDirty: this.paymentAccountForm.dirty
                        };
                        this.outputData.emit(this.outputModel);
                    }
                );
        } catch (ex) {
            return false;
        }

        return false;
    }

    private resetForm() {
        Uti.resetValueForForm(this.paymentAccountForm);
        this.submitted = false;
        this.buildDatatable();
    }

    private initEmptyData() {
        this.paymentAccountForm = this.formBuilder.group({
            isActive: true,
            idRepIsoCountryCode: ['', Validators.required],
            idProviderType: ['', Validators.required],
            idCurrency: ['', Validators.required],
            paymentsTermsName: ['', Validators.required],
            identifierCodes: ''
        });
        Uti.registerFormControlType(this.paymentAccountForm, {
            dropdown: 'idRepIsoCountryCode;idProviderType;idCurrency'
        });
        this.paymentAccountForm['submitted'] = false;
        this.buildDatatable();
        this.getFormDisplayFields();
    }

    private buildDatatable() {
        const fakeColumnsSetting = [
            [
                {
                    'SettingColumnName': '[{"WidgetTitle":"IdentifierCode"},{"ColumnsName":[{"ColumnName":"IdRepCashProviderPaymentTermsColumns","ColumnHeader":"Identifier Code","Value":"","DataType":"int","DataLength":"0","OriginalColumnName":"B00CashProviderPaymentTermsValues_IdRepCashProviderPaymentTermsColumns","Setting":[{"ControlType":{"Type":"Combobox","Value":"16"}},{"Validation":{"IsRequired":"1"}}]},{"ColumnName":"IdentiferValue","ColumnHeader":"Identifier Code Value","Value":"","DataType":"nvarchar","DataLength":"","OriginalColumnName":"B00CashProviderPaymentTermsValues_IdentiferValue","Setting":[{"ControlType":{"Type":"TextArea"}},{"Validation":{"IsRequired":"1"}}]}]}]'
                }
            ], []
        ];
        this.dataSourceTable = this.datatableService.buildEditableDataSource(fakeColumnsSetting);
        this.scrollHeight = 'calc(100% - 70px)';
    }

    private subcribeRequestSaveState() {
        this.dispatcherSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.REQUEST_SAVE && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.onSubmit();
            });
        });
    }

    private getFormDisplayFields() {
        this.personServSubscription = this.personServ.getPaymentAccountById(null).subscribe((data) => {
            this.appErrorHandler.executeAction(() => {
                this.initData = data;
                if (this.listComboBox && this.listComboBox.countryCode) {
                    this.isRenderForm = true;
                }
            });
        });
    }

    private prepareSubmitCreateData() {
        const model = this.paymentAccountForm.value;
        const _data = {
            'CashProviderPaymentTerms': {
                'IdRepCashProviderPaymentTermsType': model.idProviderType,
                'IdRepIsoCountryCode': model.idRepIsoCountryCode,
                'PaymentsTermsName': model.paymentsTermsName,
                'IsActive': true
            },
            'CashProviderPaymentTermsCurrency': {
                'IdRepCurrencyCode': model.idCurrency,
                'IsActive': true
            },
            'PersonCashProviderPaymentTermsGw': {
                'IdPerson': this.idPerson
            },
            'IdentiferCodes': this.mapGridItemToSaveData()
        };
        return _data;
    }

    private getDropdownlistData() {
        this.comServiceSubscription = this.comService.getListComboBox(
            ComboBoxTypeConstant.countryCode + ',' +
            ComboBoxTypeConstant.currency + ',' +
            ComboBoxTypeConstant.cashProviderType + ',' +
            ComboBoxTypeConstant.identifierCode
        )
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    this.listComboBox = response.item;
                    if (this.initData) {
                        this.isRenderForm = true;
                    }
                });
            });
    }

    private onDeletedRowsSuccess($event: any) {
        let currrentData = [];
        if (this.dataSourceTable.data) {
            currrentData = this.dataSourceTable.data.filter(x => !x.deleted);
        }
        const isDirty = (this.paymentAccountForm.dirty || !!(currrentData.length));
        this.outputModel = {
            submitResult: null, formValue: this.paymentAccountForm.value,
            isValid: (this.paymentAccountForm.valid && !this.gridError), isDirty: isDirty, returnID: null
        };
        this.paymentAccountForm.markAsDirty();
        this.outputData.emit(this.outputModel);
    }

    private mapGridItemToSaveData(): any {
        if (!this.xnAgGridComponent) return [];
        const updatedItems = this.xnAgGridComponent.getEditedItems();
        if (!updatedItems) return [];
        const addedItem = updatedItems.itemsAdded.filter(v => v.DT_RowId.includes('newrow') && !v.IsDeleted && !v[ColHeaderKey.Delete]);
        const editedItem = updatedItems.itemsEdited.filter(v => (!v.DT_RowId || v.DT_RowId.includes('newrow')) && !v.IsDeleted && !v[ColHeaderKey.Delete]);
        const deletedItem = updatedItems.itemsRemoved.filter(v => (!v.DT_RowId || v.DT_RowId.includes('newrow')));
        const identiferCodes = [...addedItem, ...editedItem, ...deletedItem];
        return identiferCodes.map(x => {
            return {
                IdRepCashProviderPaymentTermsColumns: x.IdRepCashProviderPaymentTermsColumns.key,
                IdentiferValue: x.IdentiferValue
            };
        });
    }
}
