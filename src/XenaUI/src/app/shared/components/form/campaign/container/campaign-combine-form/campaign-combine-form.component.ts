import {
    Component,
    OnInit,
    OnDestroy,
    EventEmitter,
    Output,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
    Input,
} from "@angular/core";
import { Router } from "@angular/router";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import {
    AppErrorHandler,
    ModalService,
    SearchService,
    DatatableService,
} from "app/services";
import {
    CampaignCountryT1FormComponent,
    CampaignCountryT1BFormComponent,
} from "app/shared/components/form";
import {
    ModuleSettingActions,
    CustomAction,
    TabSummaryActions,
    ProcessDataActions,
} from "app/state-management/store/actions";
import { RequestSavingMode, Configuration } from "app/app.constants";
import {
    ApiResultResponse,
    ControlGridModel,
    ControlGridColumnModel,
} from "app/models";
import { Uti } from "app/utilities";
import * as moduleSettingReducer from "app/state-management/store/reducer/module-setting";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import { BaseComponent } from "app/pages/private/base";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import { IPageChangedEvent } from "app/shared/components/xn-pager/xn-pagination.component";
import { Dialog } from "primeng/components/dialog/dialog";

@Component({
    selector: "app-campaign-combine-t1-form",
    styleUrls: ["./campaign-combine-form.component.scss"],
    templateUrl: "./campaign-combine-form.component.html",
})
export class CampaignCombineFormComponent
    extends BaseComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    private _progressStatus;

    set progressStatus(value) {
        this._progressStatus = value;
        if (this.toolbarSetting) {
            this.toolbarSetting.SaveNext =
                this._progressStatus == 1 ? "1" : "0";
        }
        this.store.dispatch(
            this.moduleSettingActions.selectToolbarSetting(
                this.toolbarSetting,
                this.ofModule
            )
        );
    }

    get progressStatus() {
        return this._progressStatus;
    }

    public showDialog = false;
    public campaignExistingData: ControlGridModel;
    public isGridItemselect = false;
    public showForm1 = true;
    public idSalesCampaignWizard: any;
    public isClone = false;
    public pageSize: number = Configuration.pageSize;
    public isResizable = true;
    public isDraggable = true;
    public isMaximized = false;
    public dialogStyleClass = this.consts.popupResizeClassName;

    private selectedId = null;
    private saveAndChangeStep = false;
    private outPutForm1a: any;
    private outPutForm1b: any;

    private form1aHasChangeValue = false;
    private form1bHasChangeValue = false;

    private form1aSaveCallback = false;
    private form1bSaveCallback = false;

    private form1aSubmitted = false;
    private form1bSubmitted = false;
    private pageIndex: number = Configuration.pageIndex;
    private keyword = "";
    private preDialogW: string;
    private preDialogH: string;
    private preDialogLeft: string;
    private preDialogTop: string;

    private formEditMode = false;
    private formEditData = null;
    private formEditModeState: Observable<boolean>;
    private formEditDataState: Observable<any>;
    private formEditModeStateSubscription: Subscription;
    private formEditDataStateSubscription: Subscription;
    private toolbarSettingStateSubscription: Subscription;
    private toolbarSettingState: Observable<any>;
    private toolbarSetting: any;
    private step1ClickSubscription: Subscription;
    private step2ClickSubscription: Subscription;
    private searchServiceSubscription: Subscription;
    private dispatcherSubscription: Subscription;

    @ViewChild("campaignT1aForm")
    campaignT1aForm: CampaignCountryT1FormComponent;
    @ViewChild("campaignT1bForm")
    campaignT1bForm: CampaignCountryT1BFormComponent;
    @ViewChild("xnAgGridComponent")
    private xnAgGridComponent: XnAgGridComponent;
    private pDialogCampaignCloneExisting: any;
    @ViewChild("pDialogCampaignCloneExisting")
    set pDialogCampaignCloneExistingInstance(
        pDialogCampaignCloneExistingInstance: Dialog
    ) {
        this.pDialogCampaignCloneExisting =
            pDialogCampaignCloneExistingInstance;
    }
    @Input() globalProperties: any[] = [];
    @Input() campaignExistingDataGridId: string;

    @Output() outputData: EventEmitter<any> = new EventEmitter();

    constructor(
        private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private modalService: ModalService,
        private consts: Configuration,
        private tabSummaryActions: TabSummaryActions,
        private moduleSettingActions: ModuleSettingActions,
        private searchService: SearchService,
        private ref: ChangeDetectorRef,
        private datatableService: DatatableService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router
    ) {
        super(router);

        this.onSearchComplete = this.onSearchComplete.bind(this);
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
        this.toolbarSettingState = store.select(
            (state) =>
                moduleSettingReducer.getModuleSettingState(
                    state,
                    this.ofModule.moduleNameTrim
                ).toolbarSetting
        );
    }

    /**
     * subcribeToolbarSettingState
     */
    private subcribeToolbarSettingState() {
        this.toolbarSettingStateSubscription =
            this.toolbarSettingState.subscribe((toolbarSettingState: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.toolbarSetting = toolbarSettingState;
                });
            });
    }

    public ngOnInit() {
        this.campaignExistingData = {
            data: [],
            columns: [],
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

    private editForm() {
        if (this.formEditMode) {
            this.progressStatus = 2;
            this.setShowForm1(false);
        } else {
            this.progressStatus = 1;
            this.setShowForm1(true);
        }
        this.store.dispatch(
            this.tabSummaryActions.setFormEditDataActiveSubTab(
                this.showForm1,
                this.ofModule
            )
        );
        this.store.dispatch(
            this.tabSummaryActions.setFormEditTextDataSubTab(
                {
                    main: "Countries/Int. (T1) A",
                    detail: "Countries/Int. (T1) B",
                },
                this.ofModule
            )
        );
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public onPageChanged(event: IPageChangedEvent) {
        this.pageIndex = event.page;
        this.pageSize = event.itemsPerPage;
        this.search();
    }

    public onPageNumberChanged(pageNumber: number) {
        this.pageSize = pageNumber;
    }

    private setShowForm1(value: boolean) {
        this.showForm1 = value;
        this.store.dispatch(
            this.tabSummaryActions.setFormEditDataActiveSubTab(
                this.showForm1,
                this.ofModule
            )
        );
    }

    /**
     * subscribeFormEditModeState
     */
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
    private subscribeStep1Click() {
        this.step1ClickSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        TabSummaryActions.SET_FORM_EDIT_SUB_TAB_1_CLICK &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe((requestSaveState: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.step1Click(null);
                });
            });
    }
    private subscribeStep2Click() {
        this.step2ClickSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        TabSummaryActions.SET_FORM_EDIT_SUB_TAB_2_CLICK &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe((requestSaveState: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.step2Click(null);
                });
            });
    }

    private currentSavingMode: RequestSavingMode;

    private subcribeRequestSaveState() {
        this.dispatcherSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .map((action: CustomAction) => {
                return {
                    savingMode: action.payload,
                };
            })
            .subscribe((requestSaveState: any) => {
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
            if (this.campaignT1aForm) this.campaignT1aForm.onSubmit();
            this.form1aSubmitted = true;
        } else {
            if (this.campaignT1bForm) this.campaignT1bForm.onSubmit();
            this.form1bSubmitted = true;
        }
    }

    public form1aSaveDataChange($event) {
        this.outPutForm1a = $event;
        if (!$event || !$event.submitResult || !$event.returnID) return;

        setTimeout(() => {
            this.form1aHasChangeValue = false;
        }, 1000);
        this.idSalesCampaignWizard = $event.returnID;
        if (
            this.form1aSaveCallback ||
            this.currentSavingMode === RequestSavingMode.SaveAndNext
        ) {
            this.progressStatus = 2;
            this.setShowForm1(false);
            this.form1aSaveCallback = false;
            this.outputData.emit({
                submitResult: true,
                formValue: this.outPutForm1a.formValue,
                isValid: true,
                isDirty: false,
                returnID: this.idSalesCampaignWizard,
                savingMode: RequestSavingMode.SaveAndNext,
            });
            return;
        }
        this.changeStep(true);
        this.outputData.emit({
            submitResult: true,
            formValue: this.outPutForm1a.formValue,
            isValid: true,
            isDirty: false,
            returnID: this.outPutForm1a.returnID,
            savingMode: this.currentSavingMode,
        });
    }

    public form1aDataChange($event) {
        this.outPutForm1a = $event;
        this.outputData.emit(this.outPutForm1a);
        this.form1aHasChangeValue = true;
    }

    public form1bSaveDataChange($event) {
        this.outPutForm1b = $event;
        if (!$event || !$event.submitResult) return;
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
                formValue: this.outPutForm1b.formValue,
                isValid: true,
                isDirty: false,
                returnID: !$event.returnID ? null : this.idSalesCampaignWizard,
                savingMode: RequestSavingMode.SaveOnly,
            });
            return;
        }
        this.changeStep(true);
        this.outputData.emit({
            submitResult: true,
            formValue: this.outPutForm1b.formValue,
            isValid: true,
            isDirty: false,
            returnID: !$event.returnID ? null : this.idSalesCampaignWizard,
        });
    }

    public form1bDataChange($event) {
        this.outPutForm1b = $event;
        this.outputData.emit(this.outPutForm1b);
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
        if (!this.idSalesCampaignWizard) return;

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
            savingMode: this.currentSavingMode,
        });
    }

    private confirmSavingWhenChangeStatus(showBusinessCostHeaderForm: boolean) {
        this.modalService.unsavedWarningMessageDefault({
            headerText: "Saving Changes",
            onModalSaveAndExit: () => {
                this.saveDataWhenChangeStatus(showBusinessCostHeaderForm);
            },
            onModalExit: () => {
                this.form1aHasChangeValue = false;
                this.form1bHasChangeValue = false;
                if (this.showForm1) this.gotoStep2();
                else this.gotoStep1();
            },
        });
    }

    private saveDataWhenChangeStatus(showForm1: boolean) {
        this.saveAndChangeStep = true;
        this.form1aSaveCallback = showForm1;
        this.form1bSaveCallback = !showForm1;
        this.onSubmit(showForm1);
    }

    /**
     * cancelDataWhenChangeStatus
     * @param showForm1
     */
    public cancelDataWhenChangeStatus(showForm1: boolean) {
        this.onCancel(showForm1);
    }

    /**
     * onCancel
     * @param showForm1
     */
    private onCancel(showForm1: boolean) {
        if (showForm1) {
            this.form1aSubmitted = true;
            this.form1aHasChangeValue = false;
        } else {
            this.form1bSubmitted = true;
            this.form1bHasChangeValue = false;
        }
    }

    /**
     * form1bReloadData
     */
    public form1bReloadData() {
        this.outputData.emit({ isDirty: false, isValid: true });
        this.form1bHasChangeValue = false;
        this.outPutForm1b = null;
    }

    public makeColumnsForSearchGrid() {
        this.campaignExistingData = {
            data: [],
            columns: [
                new ControlGridColumnModel({
                    title: "Campaign Nr",
                    data: "campaignNr",
                    visible: true,
                    readOnly: true,
                }),
                new ControlGridColumnModel({
                    title: "Campaign Name",
                    data: "campaignName",
                    visible: true,
                    readOnly: true,
                }),
                new ControlGridColumnModel({
                    title: "Created Date",
                    data: "createDate",
                    visible: true,
                    readOnly: true,
                }),
            ],
        };
    }

    public selectCampaignToClone() {
        if (
            !this.campaignExistingData.columns ||
            !this.campaignExistingData.columns.length
        ) {
            this.makeColumnsForSearchGrid();
        }
        this.showDialog = true;
        // setTimeout(() => {
        //     if (this.xnAgGridComponent)
        //         this.xnAgGridComponent.sizeColumnsToFit();
        // }, 500);
    }

    public selectCampaign() {
        this.isClone = true;
        this.idSalesCampaignWizard = this.selectedId;
        this.editForm();
        this.closeDialog();
    }

    public campaignExistingDataRowClick(event: any) {
        this.isGridItemselect = true;
        this.selectedId = Uti.getValueFromArrayByKey(
            event,
            "idSalesCampaignWizard"
        );
    }

    public campaignExistingDataRowDoubleClick(event: any) {
        this.isClone = true;
        this.idSalesCampaignWizard = Uti.getValueFromArrayByKey(
            event,
            "idSalesCampaignWizard"
        );
        this.editForm();
        this.closeDialog();
    }

    public campaignExistingDataTableSearch(keyword: any) {
        this.pageIndex = 1;
        this.keyword = keyword;
        this.search();
    }

    public closeDialog() {
        this.showDialog = false;
    }

    private onSearchComplete(response: ApiResultResponse) {
        let leftData = {
            data: response.item.results ? response.item.results : [],
            columns: this.campaignExistingData.columns,
            totalResults: response.item.total,
        };
        leftData = this.datatableService.appendRowId(leftData);
        this.campaignExistingData = leftData;
        this.xnAgGridComponent.isSearching = false;
    }

    private search() {
        if (
            this.modalService.isStopSearchWhenEmptySize(
                this.pageSize,
                this.pageIndex
            )
        )
            return;
        this.xnAgGridComponent.isSearching = true;
        this.searchServiceSubscription = this.searchService
            .search(
                "campaign",
                this.keyword,
                null,
                this.pageIndex,
                this.pageSize
            )
            .finally(() => {
                this.ref.detectChanges();
            })
            .subscribe(this.onSearchComplete);
    }

    private maximize() {
        // if (this.pDialogCampaignCloneExisting)
        //     this.pDialogCampaignCloneExisting.resized();
        this.isMaximized = true;
        this.isResizable = false;
        this.isDraggable = false;
        this.dialogStyleClass =
            this.consts.popupResizeClassName +
            "  " +
            this.consts.popupFullViewClassName;
        if (this.pDialogCampaignCloneExisting) {
            this.preDialogW =
                this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.width;
            this.preDialogH =
                this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.height;
            this.preDialogLeft =
                this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.left;
            this.preDialogTop =
                this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.top;

            this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.width =
                $(document).width() + "px";
            this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.height =
                $(document).height() + "px";
            this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.top =
                "0px";
            this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.left =
                "0px";
        }
    }

    private restore() {
        // if (this.pDialogCampaignCloneExisting)
        //     this.pDialogCampaignCloneExisting.resized();
        this.isMaximized = false;
        this.isResizable = true;
        this.isDraggable = true;
        this.dialogStyleClass = this.consts.popupResizeClassName;
        if (this.pDialogCampaignCloneExisting) {
            this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.width =
                this.preDialogW;
            this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.height =
                this.preDialogH;
            this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.top =
                this.preDialogTop;
            this.pDialogCampaignCloneExisting.containerViewChild.nativeElement.style.left =
                this.preDialogLeft;
        }
        // setTimeout(() => {
        //     this.bindResizeEvent();
        // }, 200);
    }
}
