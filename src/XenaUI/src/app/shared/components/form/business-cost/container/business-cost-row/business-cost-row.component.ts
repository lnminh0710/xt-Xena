import {
    Component, Input, Output, EventEmitter, ViewChild,
    ChangeDetectorRef, OnInit, OnDestroy, AfterViewInit, ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { ComboBoxTypeConstant, RequestSavingMode, MessageModal, MenuModuleId, ESQueryType } from 'app/app.constants';
import {
    CommonService, AppErrorHandler, SearchService,
    BusinessCostService, DatatableService, ModalService,
    PropertyPanelService,
    ParkedItemProcess
} from 'app/services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Uti, CustomValidators } from 'app/utilities';

import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import isNumber from 'lodash-es/isNumber';
import cloneDeep from 'lodash-es/cloneDeep';
import { WjAutoComplete, WjInputNumber } from 'wijmo/wijmo.angular2.input';
import { ControlFocusComponent, ModuleSearchDialogComponent } from 'app/shared/components/form';
import { ControlMessageComponent } from 'app/shared/components/form';
import { RowData } from 'app/state-management/store/reducer/widget-content-detail';
import { ApiResultResponse, MessageModel, Module } from 'app/models';
import { BaseComponent } from 'app/pages/private/base';
import * as widgetContentReducer from 'app/state-management/store/reducer/widget-content-detail';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';
import { CustomAction, ProcessDataActions } from 'app/state-management/store/actions';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';

@Component({
    selector: 'app-business-cost-row-form',
    styleUrls: ['./business-cost-row.component.scss'],
    templateUrl: './business-cost-row.component.html'
})
export class BusinessCostRowFormComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    public globalNumberFormat = '';
    public isRenderForm = false;
    public globalPropertiesLocal: any[] = [];
    public hiddenCountry = false;
    public isSearching = false;
    public moduleDialog: any = {
        campaign: {
            title: 'Search Campaign',
            searchIndex: 'campaign',
            module: new Module({ idSettingsGUI: MenuModuleId.campaign })
        }
    };

    private isRenderCompleted = true;
    private maxCharactersNotes = 500;
    private listComboBox: any;
    private isEditingRowItem = false;
    // private isNotItemCampaignEmpty = false;
    private isCountryCached = false;
    private formDirty = false;
    private currentSelectedRow: any = {};
    private businessCostRowForm: FormGroup;
    private businessCostRowItemId = '';
    private searchCampaignResult = [];
    private campaignItem: { campaignId: null, campaignNr: null };
    private isSearchCampaignFocus: boolean = false;
    private outputModel: { submitResult?: boolean, formValue: any, isValid?: boolean, isDirty?: boolean, returnID?: string };
    private controlDisplayConfig = {};
    private countryCheckListItems = [];
    private countryCheckListData = [];
    private cacheCountryCheckListData = [];
    private controlDisplay = ['description', 'currency', 'costPerPiece', 'totalAmount'];
    private displayConfig = {
        '1': ['description', 'currency', 'totalAmount'],
        '2': ['description', 'currency', 'totalAmount'],
        '3': ['description', 'currency', 'totalAmount'],
        '4': ['description', 'currency', 'totalAmount'],
        '5': ['description', 'currency', 'totalAmount'],
        '6': ['description', 'currency', 'totalAmount'],
        '7': ['description', 'currency', 'costPerPiece'],
        '8': ['description', 'currency', 'costPerPiece'],
        '9': ['description', 'currency', 'costPerPiece'],
        '': []
    };
    private businessCostRowGrid = {
        data: [],
        columns: []
    };
    private businessCostRowGridCurrent = [];
    private formChangeSubscription: Subscription;
    private rowBusinessCostRowDataState: Observable<RowData>;
    private formEditDataState: Observable<any>;
    private formEditModeState: Observable<boolean>;

    private formEditDataStateSubscription: Subscription;
    private formEditModeStateSubscription: Subscription;
    private rowBusinessCostRowDataStateSubscription: Subscription;
    private requestSaveSubscription: Subscription;
    private requestNewInEditSubscription: Subscription;
    private businessCostServiceSubscription: Subscription;
    private commonServiceSubscription: Subscription;
    private formEditMode = false;
    private formEditData = null;
    private idBusinessCost: any;
    private currentSavingMode: RequestSavingMode;
    private loadWithNullCampaign = false;
    // prevent Form group make dirty
    private isSettingTextForCampaign = false;
    private isSettingTextForCampaignFromPopup = false;

    @ViewChild(XnAgGridComponent) private xnAgGridComponent: XnAgGridComponent;
    @ViewChild('controlMessageCostType') private controlMessageCostType: ControlMessageComponent;
    @ViewChild('searchCampaignCtl') searchCampaignCtl: WjAutoComplete;
    @ViewChild('searchCampaignDialogModule') searchCampaignDialogModule: ModuleSearchDialogComponent;

    @Input() gridId: string;
    @Input() set globalProperties(globalProperties: any[]) {
        this.globalPropertiesLocal = globalProperties;
        this.globalNumberFormat = this.propertyPanelService.buildGlobalNumberFormatFromProperties(globalProperties);
    }

    @Output() outputData: EventEmitter<any> = new EventEmitter();

    @ViewChild('focusControl') focusControl: ControlFocusComponent;
    @ViewChild('costTypeCtl') costTypeCtl: AngularMultiSelect;
    @ViewChild('ctrCurrency') ctrCurrency: AngularMultiSelect;

    constructor(
        private store: Store<AppState>,
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private searchService: SearchService,
        private appErrorHandler: AppErrorHandler,
        private dataTableService: DatatableService,
        private commonService: CommonService,
        private modalService: ModalService,
        private toasterService: ToasterService,
        private propertyPanelService: PropertyPanelService,
        private businessCostService: BusinessCostService,
        private dispatcher: ReducerManagerDispatcher,
        private processDataActions: ProcessDataActions,
        private parkedItemProcess: ParkedItemProcess,
        protected router: Router
    ) {
        super(router);

        this.searchCampaign = this.searchCampaign.bind(this);
        this.rowBusinessCostRowDataState = this.store.select(state => widgetContentReducer.getWidgetContentDetailState(state, this.ofModule.moduleNameTrim).rowData);
        this.formEditModeState = this.store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).formEditMode);
        this.formEditDataState = this.store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).formEditData);
    }

    public ngOnInit() {
        this.initEmptyData();
        this.getDropdownlistData();
        this.subscribeData();
        this.subscriptionFormValueChange();
    }

    public ngAfterViewInit() {
        if (this.formEditMode) {
            this.idBusinessCost = +this.formEditData.id ? +this.formEditData.id : null;
            this.businessCostRowForm.controls['campaign'].disable();
        }
        this.loadBusinessCostItems();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public onSubmit() {
        this.callToSaveData(
            (response: any) => {
                this.saveSuccess(response.item);
            },
            () => { this.saveError(); });
    }

    public saveWhenClickYesChangeRow($event: any) {
        this.onSubmit();
    }

    public campaignSelectedValueChange(event: any) {
        if (!this.businessCostRowItemId) {
            if (!this.isSettingTextForCampaignFromPopup) {
                this.campaignItem = this.searchCampaignResult.find(x => x.campaignId == event) || { campaignNr: null, campaignId: null };
            }
            this.isCountryCached = false;
            if (!this.campaignItem.campaignNr) {
                if (this.isSearchCampaignFocus) {
                    this.countryCheckListData = [];
                    this.countryCheckListItems = [];
                }
                return;
            }
        }
        this.getCountryList();
        this.searchBusinessCostByCampaignNumber();
    }

    public onFocusSearchCampaign() {
        this.isSearchCampaignFocus = true;
        if (this.businessCostRowForm.controls['campaign'].disabled) {
            $('#notes').focus();
        }
    }

    public searchCampaign(query: any, max: any, callback: any) {
        if (!query || this.businessCostRowItemId || this.formEditMode || this.isSettingTextForCampaign) {
            if (this.campaignItem && this.campaignItem.campaignId &&
                this.businessCostRowForm && !this.businessCostRowForm.controls['campaign'].disabled) {
                callback([{
                    campaignId: this.campaignItem.campaignId,
                    campaignNr: this.campaignItem.campaignNr
                }]);
            } else {
                callback([]);
            }
            return;
        }
        this.isSearching = true;
        query = ((query || '').replace(/([.?\\])/g, '') + '*');
        this.searchService.search('campaign', query, null, 1, 100, 'campaignNr', null, null, null, null, null, ESQueryType.Wildcard)
            .finally(() => {
                this.refDetectChanges();
            })
            .subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    const autoCompleteData = this.buildCampaignDataSource(query, response.item);
                    this.searchCampaignResult = autoCompleteData;
                    this.searchBusinessCostAfterSearchCampaign(autoCompleteData, query);
                    callback(autoCompleteData);
                    if (!autoCompleteData.length) {
                        this.hiddenCountry = false;
                        this.countryCheckListData = [];
                    }
                    try {
                        this.setValueForCampaign(autoCompleteData);
                    } catch (ex) { }
                    this.isSearching = false;
                });
            });
    }

    private searchBusinessCostAfterSearchCampaign(result: any[], campaignNumber: string) {
        result = result || [];
        if (result.length != 1
            || campaignNumber.replace('*', '').toLowerCase() != result[0]['campaignNr'].toLowerCase()) {
            return;
        }
        this.campaignItem.campaignId = result[0]['idSalesCampaignWizard'];
        this.campaignItem.campaignNr = result[0]['campaignNr'];
        this.searchBusinessCostByCampaignNumber();
    }

    private searchBusinessCostByCampaignNumber() {
        if (!this.campaignItem.campaignNr) return;
        this.searchService.search('businesscosts', this.campaignItem.campaignNr, null, 1, 1, 'campaignNr', null, null, null, null, null, ESQueryType.Term)
        .finally(() => {
            this.refDetectChanges();
        })
        .subscribe((response) => {
            this.appErrorHandler.executeAction(() => {
                this.handleBusinessCostAfterSearch(response.item.results);
            });
        });
    }

    private handleBusinessCostAfterSearch(resultSearch: any[]) {
        // New Case
        if (!resultSearch || !resultSearch.length) {
            // this.businessCostRowForm.controls['campaign'].disable();

            setTimeout(() => {
                this.costTypeCtl.focus();
            }, 500);
        } else { // Edit Case
            // current editing business cost
            if (resultSearch[0]['idBusinessCosts'] == this.idBusinessCost) {
                return;
            } else { // other business cost
                this.resetFormForNewCase(true);
                this.idBusinessCost = resultSearch[0]['idBusinessCosts'];
                this.loadBusinessCostItems();
                this.businessCostRowForm.controls['campaign'].disable();
                setTimeout(() => {
                    this.costTypeCtl.focus();
                }, 500);
            }
        }
    }

    public deleteClickHandle(rowData: any): void {
        this.modalService.confirmMessageHtmlContent(new MessageModel({
            headerText: 'Delete Business Cost Row',
            messageType: MessageModal.MessageType.error,
            message: [{ key: 'Modal_Message__Do_You_Want_To_Delete_This_Item' }],
            buttonType1: MessageModal.ButtonType.danger,
            callBack1: () => {
                const deleteData = [{
                    'IdBusinessCostsItems': rowData['IdBusinessCostsItems'],
                    'IsDeleted': 1
                }];
                this.saveData(deleteData,
                    (response: any) => {
                        this.deleteItemSuccess(response, rowData);
                    },
                    () => {
                        this.deleteItemFail();
                    }
                );
            }
        }));
    }

    private deleteItemSuccess(response: any, rowData: any) {
        if (rowData['IdBusinessCostsItems'] === this.businessCostRowItemId) {
            this.resetForm(true);
        }
        Uti.removeItemInArray(this.businessCostRowGrid.data, rowData, 'IdBusinessCostsItems');
        this.businessCostRowGrid = cloneDeep(this.businessCostRowGrid);
    }

    private deleteItemFail() {

    }

    public onChangeCostType($event: any) {
        // when the cost type control has not been ready yet
        if (!this.costTypeCtl) return;

        // set sub controls display
        this.setDisplayForControl();
        this.subscriptionFormValueChange();
        this.setOutputData();
    }

    public getCountryItems(event: any) {
        this.countryCheckListItems = event.filter(x => x.isActive);
        this.setOutputDirty(true);
    }

    public updateLeftCharacters(event) {
        setTimeout(() => {
            this.businessCostRowForm['leftCharacters'] = this.maxCharactersNotes - event.target.value.length;
        });
    }

    public businessCostRowGridItemDoubleClick(rowData: any) {
        if (Uti.isNullUndefinedEmptyObject(rowData)) return;

        // if (this.businessCostRowForm.dirty
        //     && this.currentSelectedRow.IdBusinessCostsItems != rowData.IdBusinessCostsItems) {
        //     if (this.xnAgGridComponent) {
        //         this.xnAgGridComponent.setSelectedRow(this.currentSelectedRow, 'IdBusinessCostsItems');
        //     }
        //     this.nextSelectedRow = rowData;
        //     this.saveBusinessCostRowData();
        //     return;
        // }

        this.currentSelectedRow = rowData;
        this.isRenderCompleted = false;

        this.resetAndSetDataForFieldWhenItemClicked();
        setTimeout(() => {
            this.businessCostRowForm.markAsPristine();
            this.setOutputDirty(false);
        }, 500);
    }

    // private nextSelectedRow: any;
    // private willChangeBusinessCostRow = false;
    // private okToChangeBusinessCostRowSubscription: Subscription;
    // public saveBusinessCostRowData() {
    //     this.willChangeBusinessCostRow = true;
    //     this.store.dispatch(this.processDataActions.requestChangeBusinessCostRow(this.ofModule));
    // }

    // private subscribeChangeBusinessCost() {
    //     this.okToChangeBusinessCostRowSubscription = this.dispatcher.filter((action: CustomAction) => {
    //         return action.type === ProcessDataActions.OK_TO_CHANGE_BUSINESS_COST_ROW && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
    //     }).subscribe((requestSaveState: any) => {
    //         this.appErrorHandler.executeAction(() => {
    //             if (this.willChangeBusinessCostRow) {
    //                 this.processChangeBusinessCostRow();
    //             }
    //         });
    //     });
    // }

    // private processChangeBusinessCostRow() {
    //     this.willChangeBusinessCostRow = false;
    //     // this.businessCostRow.reSelectGridRow();
    // }

    public onSearchCampaignClicked() {
        if (!this.searchCampaignDialogModule || this.formEditMode || this.businessCostRowItemId) return;
        this.searchCampaignDialogModule.open(this.searchCampaignCtl.text);
    }

    public campaignNumberItemSelect(data: any) {
        if (!data) return;
        this.isSettingTextForCampaign = this.isSettingTextForCampaignFromPopup = true;
        this.searchCampaignCtl.text = data['campaignNr'];
        this.businessCostRowForm.controls['campaign'].setValue(data['idSalesCampaignWizard']);
        this.campaignItem.campaignId = data['idSalesCampaignWizard'];
        this.campaignItem.campaignNr = data['campaignNr'];
        this.searchCampaignCtl.refresh();
        setTimeout(() => {
            this.isSettingTextForCampaign = this.isSettingTextForCampaignFromPopup = false;
        }, 1000);
        this.searchCampaignCtl.focus();
    }

    /**********************************************************************/
    /********************* PRIVATE METHODS ********************************/

    private setDirtyWhenRenderComplete() {
        this.isRenderCompleted = true;
        // this.exposeDirtyWhenDeleteRowItemChecked();
    }

    private checkValidBeforeSaving(saveData: any): boolean {
        if (!this.formDirty && (!saveData || !saveData.length)) {
            // will show empty data for saving
            this.setOutputData({
                submitResult: false,
                formValue: {},
                isValid: true,
                isDirty: this.formDirty
            });
            return false;
        }
        this.businessCostRowForm['submitted'] = true;
        if (this.formDirty && !this.businessCostRowForm.valid) {
            // will show validation message
            this.setOutputData({
                submitResult: false,
                formValue: {},
                isValid: false,
                isDirty: this.formDirty
            });
            return false;
        }
        if (this.formDirty && (!this.countryCheckListItems || !this.countryCheckListItems.length)) {
            this.setOutputData({
                submitResult: false,
                formValue: {},
                isValid: false,
                isDirty: true,
                errorMessage: 'Please select country!'
            });
            return false;
        }
        return true;
    }

    private subscribeData() {
        this.formEditModeStateSubscription = this.formEditModeState.subscribe((formEditModeState: boolean) => {
            this.appErrorHandler.executeAction(() => {
                this.formEditMode = formEditModeState;
            });
        });
        this.formEditDataStateSubscription = this.formEditDataState.subscribe((formEditDataState: any) => {
            this.appErrorHandler.executeAction(() => {
                this.formEditData = formEditDataState;
            });
        });

        this.rowBusinessCostRowDataStateSubscription = this.rowBusinessCostRowDataState.subscribe((rowData: RowData) => {
            this.appErrorHandler.executeAction(() => {
                if (!rowData || !rowData.data) return;
                if (!Uti.checkKeynameExistInArray(rowData.data, 'key', 'IdBusinessCostsItems')) return;
            });
        });

        this.requestSaveSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.REQUEST_SAVE && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).map((action: CustomAction) => {
            return {
                savingMode: action.payload
            };
        }).subscribe((requestSaveState: any) => {
            this.appErrorHandler.executeAction(() => {
                this.currentSavingMode = RequestSavingMode.SaveOnly;
                if (requestSaveState.savingMode) {
                    this.currentSavingMode = requestSaveState.savingMode;
                }
                this.onSubmit();
            });
        });

        this.requestNewInEditSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.REQUEST_NEW_IN_EDIT && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.onAddNew();
            });
        });

        // this.subscribeChangeBusinessCost();
    }

    private initEmptyData() {
        this.businessCostRowForm = this.formBuilder.group({
            campaign: ['', Validators.required],
            costType: ['', Validators.required],
            description: null,
            currency: '',
            costPerPiece: 0,
            totalAmount: 0,
            notes: null
        });

        this.businessCostRowForm['leftCharacters'] = this.maxCharactersNotes;
        this.businessCostRowForm['submitted'] = false;
    }

    private loadBusinessCostItems() {
        this.businessCostServiceSubscription = this.businessCostService.getBusinessCostsItem(this.idBusinessCost)
            .subscribe(
                (response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!Uti.isResquestSuccess(response)) {
                            this.businessCostRowGrid = { data: [], columns: this.businessCostRowGrid.columns };
                            return;
                        }
                        let gridData: any = this.dataTableService.formatDataTableFromRawData(response.item.data);
                        gridData = this.dataTableService.buildDataSource(gridData);
                        gridData = this.dataTableService.appendRowId(gridData);
                        gridData = this.appendDeleteButtonForGrid(gridData);
                        this.businessCostRowGrid = gridData;
                        this.businessCostRowGridCurrent = cloneDeep(this.businessCostRowGrid.data);
                        this.updateCampaignNumberWhenEditingMode();
                    });
                });
    }

    private updateCampaignNumberWhenEditingMode() {
        if (!this.businessCostRowGrid || !this.businessCostRowGrid.data.length) return;
        this.isSettingTextForCampaign = true;
        this.searchCampaignCtl.text = this.businessCostRowGrid.data[0]['CampaignNr'];
        this.businessCostRowForm.controls['campaign'].setValue(this.businessCostRowGrid.data[0]['IdSalesCampaignWizard']);
        setTimeout(() => {
            if (!this.businessCostRowGrid.data || !this.businessCostRowGrid.data.length) return;
            this.campaignItem.campaignId = this.businessCostRowGrid.data[0]['IdSalesCampaignWizard'];
            this.campaignItem.campaignNr = this.businessCostRowGrid.data[0]['CampaignNr'];
            this.isSettingTextForCampaign = false;
        }, 1000);
    }

    private appendDeleteButtonForGrid(gridData: any): any {
        gridData.columns.push({
            data: 'Delete',
            readOnly: false,
            title: '',
            visible: true,
            setting: {
                DataType: 'button',
                Setting: [
                    {
                        DisplayField: {
                            ReadOnly: '1'
                        }
                    }
                ]
            }
        });
        return gridData;
    }

    private getCountryList() {
        setTimeout(() => {
            if (!this.campaignItem.campaignId) {
                return;
            }
            if (this.isCountryCached) {
                this.countryCheckListData = cloneDeep(this.cacheCountryCheckListData);
                if (this.isEditingRowItem) this.setCountryChecked();
                this.setDirtyWhenRenderComplete();
                return;
            }
            this.getCountriesAfterWaiting(this.campaignItem.campaignId);
        }, 100);
    }

    private getCountriesAfterWaiting(campaign: any) {
        this.hiddenCountry = true;
        this.refDetectChanges();

        this.businessCostServiceSubscription = this.businessCostService.getBusinessCostsCountries(this.businessCostRowItemId, campaign)
            .finally(() => {
                this.isRenderCompleted = true;
            })
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.countryCode) this.countryCheckListData = [];
                    else this.countryCheckListData = response.item.countryCode;

                    this.cacheCountryCheckListData = cloneDeep(this.countryCheckListData);
                    if (this.isEditingRowItem) this.setCountryChecked();
                    this.isCountryCached = true;
                    // this.isNotItemCampaignEmpty = false;
                    this.refDetectChanges();
                    setTimeout(() => {
                        this.hiddenCountry = false;
                        this.refDetectChanges();
                    }, 300);
                });
            });
    }

    private getDropdownlistData() {
        this.commonServiceSubscription = this.commonService.getListComboBox(ComboBoxTypeConstant.businessCosts_CostType
            + ',' + ComboBoxTypeConstant.currency
            + ',' + ComboBoxTypeConstant.additionalCosts_CostType)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.businessCosts_CostType) {
                        return;
                    }
                    this.listComboBox = response.item;
                    this.isRenderForm = true;
                });
            });
    }
    private callToSaveData(successCallback?: Function, failCallback?: Function) {
        // this.isRenderCompleted = false;
        const saveData = this.getSavingData();
        if (!this.checkValidBeforeSaving(saveData)) return;
        this.saveData(saveData, successCallback, failCallback);
    }

    private saveData(saveData: any, successCallback?: Function, failCallback?: Function) {
        this.parkedItemProcess.preventRequestSaveParkedItemList = !!this.idBusinessCost;
        this.businessCostServiceSubscription = this.businessCostService.saveBusinessCostsItem({
            'CampaignCost': { 'IdBusinessCosts': this.idBusinessCost },
            'CampaignCostItems': saveData
        }).finally(() => {
            this.setDirtyWhenRenderComplete();
        }).subscribe((response: ApiResultResponse) => {
            if (!Uti.isResquestSuccess(response)) return;
            if (successCallback) successCallback(response);
        },
            (err) => {
                if (failCallback) failCallback();
            }
        );
    }

    // private saveWhenClickAdd() {
    //     this.callToSaveData(
    //         (response) => {
    //             this.loadBusinessCostItems();
    //             this.resetFormForNewCase();
    //             this.formDirty = false;
    //             this.setOutputData();
    //         },
    //         () => { this.saveError(); });
    // }

    private saveSuccess(response: any) {
        this.appErrorHandler.executeAction(() => {
            this.idBusinessCost = response.idBusinessCosts;
            this.formDirty = this.businessCostRowForm['submitted'] = false;
            this.businessCostRowForm.updateValueAndValidity();
            this.outPutSaveData(true, response.returnID ? this.idBusinessCost : null);
            this.resetFormAfterSavingData(response);
        });
    }

    private resetFormAfterSavingData(response) {
        switch (this.currentSavingMode) {
            case RequestSavingMode.SaveOnly: {
                this.resetForm(true);
                this.businessCostRowForm.controls['campaign'].setValue(this.campaignItem.campaignId);
                this.businessCostRowForm.controls['campaign'].disable();
                this.loadBusinessCostItems();
                break;
            }
            case RequestSavingMode.SaveAndNew: {
                this.resetFormForNewCase();
                break;
            }
        }
    }

    private saveError() {
        this.appErrorHandler.executeAction(() => {
            this.outPutSaveData(true);
        });
    }

    private outPutSaveData(submitResult: boolean, returnID?: any) {
        this.outputModel = {
            submitResult: submitResult,
            formValue: {},
            isValid: true,
            isDirty: false,
            returnID: returnID
        };
        this.outputModel['savingMode'] = this.currentSavingMode;
        this.outputData.emit(this.outputModel);
    }

    private setOutputData(data?: any) {
        if ((typeof data) !== 'undefined') {
            this.outputModel = data;
        } else {
            this.outputModel = {
                submitResult: null,
                formValue: {},
                isValid: this.businessCostRowForm.valid,
                isDirty: this.businessCostRowForm.dirty || (!!this.xnAgGridComponent && !!this.xnAgGridComponent.getEditedItems().itemsRemoved.length)
            };
        }
        this.formDirty = this.businessCostRowForm.dirty;
        this.outputData.emit(this.outputModel);
    }

    private setOutputDirty(isDirty: boolean, valid?: boolean) {
        valid = (valid === undefined ? true : valid);
        this.setOutputData({
            submitResult: null,
            formValue: {},
            isValid: valid && this.businessCostRowForm.valid,
            isDirty: isDirty
        });
        this.formDirty = isDirty;
    }

    private setDisplayForControl() {
        setTimeout(() => {
            const mapCostTypeWithDescription = (!this.costTypeCtl.selectedValue
                ? ''
                : this.costTypeCtl.selectedValue);

            const displayConfig = this.displayConfig[mapCostTypeWithDescription];
            for (const item of this.controlDisplay) {
                this.controlDisplayConfig[item] = (displayConfig.indexOf(item) > -1);
            }
            setTimeout(() => {
                // rebuild enter focus control
                this.focusControl.initControl(true);
                this.setDefaultValueForCurrency();
            }, 100);
        });
    }

    private getIdBusinessCostsItemsCountryByCountryId(countryListOld: any, countryId: any) {
        const countryItem = countryListOld.find(x => { return x.id === countryId; });
        if (!countryItem || !countryItem.id) return null;
        return countryItem.businessCountryId;
    }

    private getCountryItemProValueById(findValue: string, findPropName: string, propName: string) {
        const currentCountry = this.cacheCountryCheckListData.find(x => x[findPropName] === findValue);
        if (!currentCountry || !currentCountry[findPropName]) return null;
        return currentCountry[propName];
    }

    private subscriptionFormValueChange() {
        if (this.formChangeSubscription) this.formChangeSubscription.unsubscribe();

        this.formChangeSubscription = this.businessCostRowForm.valueChanges
            .subscribe((data) => {
                if (this.isSettingTextForCampaign) {
                    this.businessCostRowForm.markAsPristine();
                    return;
                }
                if (!this.businessCostRowForm.pristine && this.isRenderCompleted) {
                    this.setOutputData();
                } else if (this.businessCostRowForm['clearText']) {
                    this.setOutputData({
                        submitResult: null,
                        formValue: {},
                        isValid: this.businessCostRowForm.valid,
                        isDirty: true
                    });
                    this.businessCostRowForm['clearText'] = false;
                    this.formDirty = true;
                }
            });
        // init message only for cost type control when this control change.
        if (this.controlMessageCostType)
            this.controlMessageCostType.ngOnInit();
    }

    private setLeftCharacters(textLength: number) {
        setTimeout(() => {
            this.businessCostRowForm['leftCharacters'] = this.maxCharactersNotes - textLength;
        });
    }

    private resetFormForNewCase(keepCampaignItem?: boolean) {
        this.businessCostRowGrid = {
            data: [],
            columns: this.businessCostRowGrid.columns
        }
        this.resetForm(keepCampaignItem);
        this.idBusinessCost = null;
    }

    private resetForm(keepCampaignItem?: boolean) {
        this.resetFormWhenGridClick(keepCampaignItem);
        // this.isNotItemCampaignEmpty = false;
        this.countryCheckListData = [];
        this.isEditingRowItem = false;
        this.formDirty = false;
        this.businessCostRowItemId = null;
        this.businessCostRowForm.controls['campaign'].enable();
        this.currentSelectedRow = {};
    }

    private resetFormWhenGridClick(keepCampaignItem?: boolean) {
        if (!keepCampaignItem) {
            this.campaignItem.campaignId = null;
            this.campaignItem.campaignNr = null;
            this.searchCampaignCtl.text = '';
        }

        this.resetBusinessCostForm(keepCampaignItem);
        this.countryCheckListItems = [];
        this.isCountryCached = false;
    }

    private resetBusinessCostForm(keepCampaignItem?: boolean) {
        this.businessCostRowForm.controls['costType'].reset();
        this.businessCostRowForm.controls['description'].reset();
        this.businessCostRowForm.controls['currency'].reset();
        this.businessCostRowForm.controls['costPerPiece'].reset();
        this.businessCostRowForm.controls['totalAmount'].reset();
        this.businessCostRowForm.controls['notes'].reset();
        this.setDefaultValueForCurrency();
        if (!keepCampaignItem) {
            this.businessCostRowForm.controls['campaign'].reset();
            this.searchCampaignCtl.text = '';
            setTimeout(() => {
                this.searchCampaignCtl.focus();
            }, 300);
        } else {
            this.getCountryList();
            setTimeout(() => {
                this.costTypeCtl.focus();
            }, 500);
        }
        this.businessCostRowForm.markAsUntouched();
        this.businessCostRowForm.markAsPristine();
        this.businessCostRowForm['submitted'] = false;
    }

    private setDefaultValueForCurrency() {
        if (!this.listComboBox || !this.listComboBox.currency || !this.listComboBox.currency.length || !this.ctrCurrency || this.businessCostRowItemId) {
            return;
        }
        for (let i = 0; i < this.listComboBox.currency.length; i++) {
            if (this.listComboBox.currency[i]['textValue'] != 'EUR') continue;
            this.ctrCurrency.selectedIndex = i;
            return;
        }
    }

    private getSavingData() {
        this.businessCostRowForm.updateValueAndValidity();
        let isInvalid = (((!this.businessCostRowForm.valid || !this.countryCheckListItems || !this.countryCheckListItems.length))
            || (!this.businessCostRowForm.valid && this.formDirty));
        if (!isInvalid || this.formDirty) {
            return [this.createGridItemObject()];
        }
        return [];
    }

    private resetAndSetDataForFieldWhenItemClicked() {
        this.businessCostRowItemId = this.currentSelectedRow.IdBusinessCostsItems;
        this.campaignItem.campaignId = this.currentSelectedRow.IdSalesCampaignWizard;
        this.campaignItem.campaignNr = this.currentSelectedRow.CampaignNr;

        this.hiddenCountry = true;
        this.refDetectChanges();
        // this.isNotItemCampaignEmpty = !!(this.currentSelectedRow.CampaignNr);
        this.isEditingRowItem = true;
        this.resetFormWhenGridClick(true);
        this.setFormValueWhenClickGridItem();
    }

    private setFormValueWhenClickGridItem() {
        this.isSettingTextForCampaign = true;
        this.searchCampaignCtl.text = this.currentSelectedRow.CampaignNr;
        this.businessCostRowForm.controls['campaign'].disable();
        this.businessCostRowForm.controls['costType'].setValue(this.currentSelectedRow.IdRepBusinessCostsGroups.toString());
        this.businessCostRowForm.controls['description'].setValue(this.currentSelectedRow.Description);
        this.businessCostRowForm.controls['currency'].setValue(this.currentSelectedRow.IdRepCurrencyCode);
        this.businessCostRowForm.controls['costPerPiece'].setValue(this.currentSelectedRow.CostsPerPiece);
        this.businessCostRowForm.controls['totalAmount'].setValue(this.currentSelectedRow.TotalAomount);

        const notes = this.currentSelectedRow.Notes;
        this.businessCostRowForm.controls['notes'].setValue(notes);
        if (notes) {
            this.setLeftCharacters(notes.length);
        }

        setTimeout(() => {
            this.isSettingTextForCampaign = false;
        }, 300);
    }

    private setCountryChecked() {
        let countryIds = this.currentSelectedRow.CountriesID;
        if (this.cacheCountryCheckListData && this.cacheCountryCheckListData.length) {
            const viewCountryData = cloneDeep(this.cacheCountryCheckListData);
            countryIds = (typeof countryIds) === 'string' ? countryIds : '';
            const countryIdsArr = countryIds.split(';');
            for (const item of viewCountryData) {
                item.isActive = (countryIdsArr.indexOf(item.idValue) > -1);
            }
            this.countryCheckListData = viewCountryData;
            this.countryCheckListItems = this.countryCheckListData.filter(x => x.isActive);
        }
    }

    private createGridItemObject(): any {
        const formValue = this.businessCostRowForm.value;
        const data: any = {
            'IdSalesCampaignWizard': this.campaignItem.campaignId,
            'IdSalesCampaignWizardItems': this.campaignItem.campaignId,
            'Notes': formValue.notes,
            'IdBusinessCosts': this.idBusinessCost,
            'IdRepBusinessCostsGroups': formValue.costType,
            'Quantity': formValue.qty,
            'CostsPerPiece': formValue.costPerPiece,
            'TotalAomount': formValue.totalAmount,
            'Description': formValue.description,
            'IdRepCurrencyCode': formValue.currency,
            'IsActive': true,
            'CampaignCostsItemsCountries': this.repairCampaignCostsItemsCountries()
        };
        if (!Uti.isNilE(this.businessCostRowItemId)) {
            data['IdBusinessCostsItems'] = this.businessCostRowItemId;
        }
        return data;
    }

    private repairCampaignCostsItemsCountries(): any {
        const countryIdArr = this.countryCheckListItems.map(x => { return x['idValue']; });
        if (!countryIdArr || !countryIdArr.length) return [];
        if (Uti.isNilE(this.businessCostRowItemId)) {
            return countryIdArr.map(x => {
                return {
                    'IdCountrylanguage': x,
                    'IdSalesCampaignWizardItems': this.getCountryItemProValueById(x, 'idValue', 'idSalesCampaignWizardItems'),
                    'IsActive': true
                };
            });
        }

        return this.repairCampaignCostsItemsCountriesEdit(countryIdArr);
    }

    private repairCampaignCostsItemsCountriesEdit(countryIdArrNew: any): any {
        const currentBusinessCostRowItem = this.businessCostRowGridCurrent.find(x => x.IdBusinessCostsItems == this.businessCostRowItemId);
        if (!currentBusinessCostRowItem || !currentBusinessCostRowItem.IdBusinessCostsItems) return null;
        if (!isNil(currentBusinessCostRowItem.CountriesID) &&
            !isEmpty(currentBusinessCostRowItem.CountriesID) &&
            currentBusinessCostRowItem.CountriesID.length) {
            let countryIdArrOld = currentBusinessCostRowItem.CountriesID.split(';');
            const countryListOld = this.makeCountriesObject(currentBusinessCostRowItem);
            const deleteItem = this.repairCampaignCostsItemsCountriesDelete(countryIdArrOld, countryIdArrNew, countryListOld);
            const addItem = this.repairCampaignCostsItemsCountriesAdd(countryIdArrOld, countryIdArrNew);
            return [...deleteItem, ...addItem];
        } else {
            return this.repairCampaignCostsItemsCountriesAdd(null, countryIdArrNew);
        }
    }

    private repairCampaignCostsItemsCountriesDelete(countryIdArrOld: any, countryIdArrNew: any, countryListOld: any): any {
        const deleteItem = countryIdArrOld.filter(x => { return (countryIdArrNew.indexOf(x) === -1); });
        return deleteItem.map(x => {
            return {
                'IdBusinessCostsItemsCountries': this.getIdBusinessCostsItemsCountryByCountryId(countryListOld, x),
                'IsDeleted': 1
            };
        });
    }

    private repairCampaignCostsItemsCountriesAdd(countryIdArrOld: any, countryIdArrNew: any): any {
        let addItem = countryIdArrNew;
        if (countryIdArrOld)
            addItem = countryIdArrNew.filter(x => { return (countryIdArrOld.indexOf(x) === -1); });
        return addItem.map(x => {
            return {
                'IdCountrylanguage': x,
                'IdSalesCampaignWizardItems': this.getCountryItemProValueById(x, 'idValue', 'idSalesCampaignWizardItems'),
                'IsActive': true
            };
        });
    }

    private makeCountriesObject(businessCostRowItem: any): any {
        const countryNames = businessCostRowItem.Countries.split(';');
        const countryIds = businessCostRowItem.CountriesID.split(';');
        const businessCountryIds = businessCostRowItem.IdBusinessCostsItemsCountries.split(';');
        if (!countryNames || !countryNames.length) return {};
        const result = [];
        for (let i = 0; i < countryNames.length; i++) {
            result.push({
                id: countryIds[i],
                name: countryNames[i],
                businessCountryId: businessCountryIds[i]
            });
        }
        return result;
    }

    private onAddNew() {
        this.subscriptionFormValueChange();
        // if (this.formDirty) {
        //     this.confirmToAddNewItem();
        //     return;
        // }
        this.resetFormForNewCase();
    }

    // private confirmToAddNewItem() {
    //     this.modalService.unsavedWarningMessageDefault({
    //         onModalSaveAndExit: () => { this.saveWhenClickAdd(); },
    //         onModalExit: () => { this.resetFormForNewCase(); }
    //     });
    // }

    private refDetectChanges() {
        setTimeout(() => {
            this.ref.detectChanges();
        });
    }

    private buildCampaignDataSource(queryString: string, data: any) {
        if (!data || !data.results || !data.results.length) {
            return [];
        }
        //const item = data.results.find(x => { return (x.campaignNr && x.campaignNr.toLowerCase() === queryString.toLowerCase()); });
        //if (item && item.campaignNr) {
        //    return [{
        //        campaignId: item.idSalesCampaignWizard,
        //        campaignNr: item.campaignNr
        //    }]
        //}
        return data.results.map(x => {
            return {
                campaignId: x.idSalesCampaignWizard,
                campaignNr: x.campaignNr
            };
        });
    }

    private setValueForCampaign(data: any) {
        if (!this.isEditingRowItem) return;
        const campaignNr = this.currentSelectedRow.CampaignNr;
        const campaignItem = data.find(x => x.campaignNr === campaignNr);
        if (this.searchCampaignCtl) {
            this.searchCampaignCtl.selectedItem = campaignItem;
        }
    }
}
