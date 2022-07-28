import {
    Component, OnInit, OnDestroy,
    EventEmitter, Output,
    ViewChild, AfterViewInit,
    ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
    AppErrorHandler,
    ModalService,
    SearchService,
    DatatableService
} from 'app/services';
import { PurchaseFormHeaderComponent, PurchaseFormArticleComponent } from 'app/shared/components/form';
import {
    ModuleSettingActions,
    CustomAction,
    ProcessDataActions
} from 'app/state-management/store/actions';
import { RequestSavingMode } from 'app/app.constants';
import { TabSummaryActions } from 'app/state-management/store/actions/tab-summary';
import { ApiResultResponse, ControlGridModel, ControlGridColumnModel } from 'app/models';
import { Uti } from 'app/utilities';
import { WijmoGridComponent } from 'app/shared/components/wijmo';
import { BaseComponent } from 'app/pages/private/base';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import * as moduleSettingReducer from 'app/state-management/store/reducer/module-setting';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';

@Component({
    selector: 'purchase-form-combine',
    styleUrls: ['./purchase-form-combine.component.scss'],
    templateUrl: './purchase-form-combine.component.html'
})
export class PurchaseFormCombineComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    private _progressStatus;

    set progressStatus(value) {
        this._progressStatus = value;
        if (this.toolbarSetting) {
            this.toolbarSetting.SaveNext = this._progressStatus == 1 ? '1' : '0';
        }
        this.store.dispatch(this.moduleSettingActions.selectToolbarSetting(this.toolbarSetting, this.ofModule));
    }

    get progressStatus() {
        return this._progressStatus;
    };

    public showDialog = false;
    public campaignExistingData: ControlGridModel;
    public isGridItemselect = false;
    public showForm1 = true;
    public idSalesCampaignWizard: any;
    public isClone = false;

    private selectedId = null;
    private saveAndChangeStep = false;
    private outPutFormHeader: any;
    private outPutFormArticle: any;

    private form1aHasChangeValue = false;
    private form1bHasChangeValue = false;

    private form1aSaveCallback = false;
    private form1bSaveCallback = false;

    private formHeaderSubmitted = false;
    private formArticleSubmitted = false;

    private formEditMode = false;
    private formEditData = null;
    private formEditModeState: Observable<boolean>;
    private formEditDataState: Observable<any>;
    private formEditModeStateSubscription: Subscription;
    private formEditDataStateSubscription: Subscription;
    private toolbarSettingStateSubscription: Subscription;
    private toolbarSettingState: Observable<any>;
    private toolbarSetting: any;

    private searchServiceSubscription: Subscription;
    private dispatcherSubscription: Subscription;
    private step1ClickSubscription: Subscription;
    private step2ClickSubscription: Subscription;

    @ViewChild('purchaseFormHeaderComponent') purchaseFormHeaderComponent: PurchaseFormHeaderComponent;
    @ViewChild('purchaseFormArticleComponent') purchaseFormArticleComponent: PurchaseFormArticleComponent;

    @Output() outputData: EventEmitter<any> = new EventEmitter();

    constructor(private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private modalService: ModalService,
        private tabSummaryActions: TabSummaryActions,
        private moduleSettingActions: ModuleSettingActions,
        private searchService: SearchService,
        private ref: ChangeDetectorRef,
        private datatableService: DatatableService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router
    ) {
        super(router);

        this.formEditModeState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).formEditMode);
        this.formEditDataState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).formEditData);
        this.toolbarSettingState = store.select(state => moduleSettingReducer.getModuleSettingState(state, this.ofModule.moduleNameTrim).toolbarSetting);
    }

    public ngOnInit() {
        this.campaignExistingData = {
            data: [],
            columns: []
        };
        this.subcribeRequestSaveState();
        this.subscribeFormEditModeState();
        this.subcribeToolbarSettingState();
        this.subscribeStep1Click();
        this.subscribeStep2Click();
    }

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {
        if (this.formEditMode) {
            this.idSalesCampaignWizard = +this.formEditData.id;
        }
        this.editForm();
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private editForm() {
        if (this.formEditMode) {
            this.progressStatus = 2;
            this.setShowForm1(false);
        } else {
            this.progressStatus = 1;
            this.setShowForm1(true);
        }
        this.store.dispatch(this.tabSummaryActions.setFormEditDataActiveSubTab(this.showForm1, this.ofModule));
        this.store.dispatch(this.tabSummaryActions.setFormEditTextDataSubTab({
            main: 'Header',
            detail: 'Article'
        }, this.ofModule));
    }

    /**
     * subcribeToolbarSettingState
     */
    private subcribeToolbarSettingState() {
        this.toolbarSettingStateSubscription = this.toolbarSettingState.subscribe((toolbarSettingState: any) => {
            this.appErrorHandler.executeAction(() => {
                this.toolbarSetting = toolbarSettingState;
            });
        });
    }

    /**
     * subscribeFormEditModeState
     */
    private subscribeFormEditModeState() {
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
    }
    private subscribeStep1Click() {
        this.step1ClickSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === TabSummaryActions.SET_FORM_EDIT_SUB_TAB_1_CLICK && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe((requestSaveState: any) => {
            this.appErrorHandler.executeAction(() => {
                this.step1Click(null);
            });
        });
    }
    private subscribeStep2Click() {
        this.step2ClickSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === TabSummaryActions.SET_FORM_EDIT_SUB_TAB_2_CLICK && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe((requestSaveState: any) => {
            this.appErrorHandler.executeAction(() => {
                this.step2Click(null);
            });
        });
    }

    private currentSavingMode: RequestSavingMode;

    private subcribeRequestSaveState() {
        this.dispatcherSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.REQUEST_SAVE && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).map((action: CustomAction) => {
            return {
                savingMode: action.payload
            };
        }).subscribe((requestSaveState: any) => {
            this.appErrorHandler.executeAction(() => {
                this.currentSavingMode = RequestSavingMode.SaveAndClose;
                if (requestSaveState.savingMode) {
                    this.currentSavingMode = requestSaveState.savingMode;
                }
                this.onSubmit(this.showForm1);
            });
        });
    }

    private onSubmit(showForm1: boolean) {
        if (showForm1) {
            if (this.purchaseFormHeaderComponent)
                this.purchaseFormHeaderComponent.submit();
            this.formHeaderSubmitted = true;
        } else {
            // if (this.purchaseFormArticleComponent)
            // this.purchaseFormArticleComponent.submit();
            this.formArticleSubmitted = true;
        }
    }

    public form1aSaveDataChange($event) {
        this.outPutFormHeader = $event;
        if (!$event || !$event.submitResult || !$event.returnID) return;

        setTimeout(() => {
            this.form1aHasChangeValue = false;
        }, 1000);
        this.idSalesCampaignWizard = $event.returnID;
        if (this.form1aSaveCallback || this.currentSavingMode === RequestSavingMode.SaveAndNext) {
            this.progressStatus = 2;
            this.setShowForm1(false);
            this.form1aSaveCallback = false;
            this.outputData.emit({
                submitResult: true,
                formValue: this.outPutFormHeader.formValue,
                isValid: true,
                isDirty: false,
                returnID: this.idSalesCampaignWizard,
                savingMode: RequestSavingMode.SaveAndNext
            });
            return;
        }
        this.changeStep(true);
        this.outputData.emit({
            submitResult: true,
            formValue: this.outPutFormHeader.formValue,
            isValid: true, isDirty: false,
            returnID: this.outPutFormHeader.returnID,
            savingMode: this.currentSavingMode
        });
    }

    public form1aDataChange($event) {
        this.outPutFormHeader = $event;
        this.outputData.emit(this.outPutFormHeader);
        this.form1aHasChangeValue = true;
    }

    public form1bSaveDataChange($event) {
        this.outPutFormArticle = $event;
        if (!$event || !$event.submitResult || !$event.returnID) return;
        this.setShowForm1(false);
        setTimeout(() => {
            this.form1bHasChangeValue = false;
        }, 1000);
        if (this.form1bSaveCallback) {
            this.progressStatus = 1;
            this.setShowForm1(true);
            this.form1bSaveCallback = false;
            this.outputData.emit({
                submitResult: true,
                formValue: this.outPutFormArticle.formValue,
                isValid: true,
                isDirty: false,
                returnID: this.idSalesCampaignWizard,
                savingMode: RequestSavingMode.SaveOnly
            });
            return;
        }
        this.changeStep(true);
        this.outputData.emit({
            submitResult: true,
            formValue: this.outPutFormArticle.formValue,
            isValid: true,
            isDirty: false,
            returnID: this.idSalesCampaignWizard
        });
    }

    public form1bDataChange($event) {
        this.outPutFormArticle = $event;
        this.outputData.emit(this.outPutFormArticle);
        this.form1bHasChangeValue = true;
    }

    private step1Click(event) {
        if (!this.showForm1 && this.form1bHasChangeValue) {
            this.confirmSavingWhenChangeStatus(false);
        } else {
            this.gotoStep1();
        }
    }
    private gotoStep1() {
        this.progressStatus = 1;
        this.setShowForm1(true);
        this.updateFormDirty();
    }

    private step2Click(event) {
        if (!this.idSalesCampaignWizard)
            return;

        if (this.showForm1 && this.form1aHasChangeValue) {
            this.confirmSavingWhenChangeStatus(true);
        } else {
            this.gotoStep2();
        }
    }
    private gotoStep2() {
        this.progressStatus = 2;
        this.setShowForm1(false);
        this.updateFormDirty();
    }

    private changeStep(toStep2: boolean) {
        if (!this.saveAndChangeStep) {
            return;
        }

        this.saveAndChangeStep = false;
        if (toStep2) this.gotoStep2();
        else this.gotoStep1();
    }

    private updateFormDirty() {
        this.outputData.emit({
            submitResult: null,
            formValue: null,
            isValid: true,
            isDirty: false,
            returnID: null,
            savingMode: this.currentSavingMode
        });
    }

    private confirmSavingWhenChangeStatus(showBusinessCostHeaderForm: boolean) {
        this.modalService.unsavedWarningMessageDefault({
            headerText: 'Saving Changes',
            onModalSaveAndExit: () => { this.saveDataWhenChangeStatus(showBusinessCostHeaderForm); },
            onModalExit: () => {
                this.form1aHasChangeValue = false;
                this.form1bHasChangeValue = false;
                if (this.showForm1) this.gotoStep2();
                else this.gotoStep1();
            }
        });
    }

    private saveDataWhenChangeStatus(showForm1: boolean) {
        this.saveAndChangeStep = true;
        this.form1aSaveCallback = showForm1;
        this.form1bSaveCallback = !showForm1;
        this.onSubmit(showForm1);
    }

    private setShowForm1(value: boolean) {
        this.showForm1 = value;
        this.store.dispatch(this.tabSummaryActions.setFormEditDataActiveSubTab(this.showForm1, this.ofModule));
    }

    /**
     * form1bReloadData
     */
    public form1bReloadData() {
        this.outputData.emit({ isDirty: false, isValid: true });
        this.form1bHasChangeValue = false;
        this.outPutFormArticle = null;
    }
}
