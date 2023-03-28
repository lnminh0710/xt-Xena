import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ElementRef,
    ViewChild,
    ChangeDetectorRef,
    SimpleChanges,
    OnChanges,
} from "@angular/core";
import { ApiResultResponse, GlobalSettingModel } from "app/models";
import {
    DatabaseService,
    AppErrorHandler,
    DatatableService,
    ModalService,
    GlobalSettingService,
} from "app/services";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import camelCase from "lodash-es/camelCase";
import cloneDeep from "lodash-es/cloneDeep";
import { Uti } from "app/utilities";
import {
    ProcessDataActions,
    CustomAction,
} from "app/state-management/store/actions";
import * as uti from "app/utilities";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as moduleSettingReducer from "app/state-management/store/reducer/module-setting";
import { XnAgGridComponent } from "../xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import { SplitComponent } from "angular-split";

@Component({
    selector: "database-combine-grid",
    templateUrl: "./database-combine-grid.component.html",
    styleUrls: ["./database-combine-grid.component.scss"],
})
export class DatabaseCombineGridComponent
    extends BaseComponent
    implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
    public countryGridData: any;
    public countryGridAnotherData: any;
    public databaseGridData: any;
    public perfectScrollbarConfig: any = {};
    public disabledDatabaseGridData: boolean = false;
    public isCountryGridReadOnly = true;
    public isCountryGridDisabled = true;
    public columnsLayoutSettings: any = {};
    public splitterConfig = {
        leftHorizontal: 50,
        rightHorizontal: 50,
    };
    public showAnotherCountryGrid = false;

    private widgetListenKey: string = null;
    private selectedEntity: any = null;
    private cacheData = {};
    private willUpdateCache = false;
    private validationError = {};
    private databaseServiceSubscription: Subscription;
    private selectedEntityStateSubscription: Subscription;
    private widgetListenKeyStateSubscription: Subscription;
    private requestSaveWidgetStateSubscription: Subscription;

    private selectedEntityState: Observable<any>;
    private widgetListenKeyState: Observable<string>;
    private requestSaveWidgetState: Observable<any>;

    @ViewChild("databaseGrid") databaseGrid: XnAgGridComponent;

    private countryGrid: XnAgGridComponent;
    @ViewChild("countryGrid") set countryGridIns(
        countryGridIns: XnAgGridComponent
    ) {
        this.countryGrid = countryGridIns;
    }

    @ViewChild("horizontalSplit") horizontalSplit: SplitComponent;

    @Input() readOnly = true;
    @Input() databaseGridId: string;
    @Input() countryGridId: string;
    @Input() countryGridAnotherId: string;
    @Input() globalProperties: any[] = [];
    @Input() idRepWidgetApp = null;

    @Output() onGridEditStart = new EventEmitter<any>();
    @Output() onGridEditEnd = new EventEmitter<any>();
    @Output() onGridEditSuccess = new EventEmitter<any>();
    @Output() onSaveSuccess = new EventEmitter<any>();

    constructor(
        protected store: Store<AppState>,
        private _eref: ElementRef,
        private appErrorHandler: AppErrorHandler,
        private databaseService: DatabaseService,
        private datatableService: DatatableService,
        private processDataActions: ProcessDataActions,
        private modalService: ModalService,
        protected router: Router,
        private dispatcher: ReducerManagerDispatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private globalSettingService: GlobalSettingService
    ) {
        super(router);

        this.selectedEntityState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedEntity
        );
        this.widgetListenKeyState = store.select(
            (state) =>
                moduleSettingReducer.getModuleSettingState(
                    state,
                    this.ofModule.moduleNameTrim
                ).widgetListenKey
        );
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
        this.loadColumnLayoutSettings();
        setTimeout(() => {
            this.loadSplitterSettings();
        }, 200);

        this.subscribeWidgetListenKeyState();
        this.subscribeSelectedEntityState();
        this.subscribeRequestSaveWidgetState();

        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false,
        };
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        uti.Uti.unsubscribe(this);
    }

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["readOnly"]) {
            this.validateCountryGrid();
        }
    }

    private loadColumnLayoutSettings() {
        this.globalSettingService
            .getAllGlobalSettings(-1)
            .subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (data && data.length) {
                        let gridColLayoutSettings = data.filter(
                            (p) => p.globalType == "GridColLayout"
                        );
                        if (
                            gridColLayoutSettings &&
                            gridColLayoutSettings.length
                        ) {
                            gridColLayoutSettings.forEach((setting) => {
                                this.columnsLayoutSettings[setting.globalName] =
                                    JSON.parse(setting.jsonSettings);
                            });
                        }

                        this.changeDetectorRef.detectChanges();
                    }
                });
            });
    }

    private loadSplitterSettings() {
        this.globalSettingService
            .getAllGlobalSettings(-1)
            .subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (data && data.length) {
                        let selectionWidgetSplitterSettings = data.filter(
                            (p) =>
                                p.globalName == this.idRepWidgetApp &&
                                p.globalType == "WidgetSplitter"
                        );
                        if (
                            selectionWidgetSplitterSettings &&
                            selectionWidgetSplitterSettings.length
                        ) {
                            selectionWidgetSplitterSettings.forEach(
                                (setting) => {
                                    this.splitterConfig = JSON.parse(
                                        setting.jsonSettings
                                    );
                                    this.horizontalSplit.updateArea(
                                        this.horizontalSplit.areas[0].component,
                                        1,
                                        this.splitterConfig.leftHorizontal,
                                        20
                                    );
                                    this.horizontalSplit.updateArea(
                                        this.horizontalSplit.areas[1].component,
                                        1,
                                        this.splitterConfig.rightHorizontal,
                                        20
                                    );
                                }
                            );
                        }

                        this.changeDetectorRef.detectChanges();
                    }
                });
            });
    }

    private saveSplitterSettings() {
        this.globalSettingService
            .getAllGlobalSettings(-1)
            .subscribe((getAllGlobalSettings) => {
                let selectionWidgetSplitterSettings = getAllGlobalSettings.find(
                    (x) =>
                        x.globalName == this.idRepWidgetApp &&
                        x.globalType == "WidgetSplitter"
                );
                if (
                    !selectionWidgetSplitterSettings ||
                    !selectionWidgetSplitterSettings.idSettingsGlobal ||
                    !selectionWidgetSplitterSettings.globalName
                ) {
                    selectionWidgetSplitterSettings = new GlobalSettingModel({
                        globalName: this.idRepWidgetApp,
                        globalType: "WidgetSplitter",
                        description: "WidgetSplitter",
                        isActive: true,
                    });
                }
                selectionWidgetSplitterSettings.idSettingsGUI = -1;
                selectionWidgetSplitterSettings.jsonSettings = JSON.stringify(
                    this.splitterConfig
                );
                selectionWidgetSplitterSettings.isActive = true;

                this.globalSettingService
                    .saveGlobalSetting(selectionWidgetSplitterSettings)
                    .subscribe((data) => {
                        this.globalSettingService.saveUpdateCache(
                            "-1",
                            selectionWidgetSplitterSettings,
                            data
                        );
                    });
            });
    }

    private subscribeWidgetListenKeyState() {
        this.widgetListenKeyStateSubscription =
            this.widgetListenKeyState.subscribe(
                (widgetListenKeyState: string) => {
                    this.appErrorHandler.executeAction(() => {
                        this.widgetListenKey = widgetListenKeyState;

                        this.changeDetectorRef.detectChanges();
                    });
                }
            );
    }

    private subscribeSelectedEntityState() {
        this.selectedEntityStateSubscription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.cacheData = {};

                    if (this.countryGrid) {
                        if (this.isAnotherCountryGrid()) {
                            let columns = this.countryGridAnotherData.columns;
                            this.countryGridAnotherData = null;
                            this.countryGridAnotherData = {
                                columns: columns,
                                data: [],
                            };
                        } else {
                            let columns = this.countryGridData.columns;
                            this.countryGridData = null;
                            this.countryGridData = {
                                columns: columns,
                                data: [],
                            };
                        }
                    }

                    if (
                        isEmpty(selectedEntityState) &&
                        !isEmpty(this.selectedEntity)
                    ) {
                        this.selectedEntity = null;

                        this.changeDetectorRef.detectChanges();
                        return;
                    }

                    if (isEqual(this.selectedEntity, selectedEntityState)) {
                        return;
                    }

                    this.selectedEntity = selectedEntityState;

                    this.initDatabaseGrid();

                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    private subscribeRequestSaveWidgetState() {
        this.requestSaveWidgetStateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE_WIDGET &&
                    action.module.idSettingsGUI ==
                        this.ofModule.idSettingsGUI &&
                    this._eref.nativeElement.offsetParent != null
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.saveData();
                });
            });
    }

    private initDatabaseGrid() {
        this.databaseServiceSubscription = this.databaseService
            .getListOfDatabaseNames(
                this.selectedEntity[camelCase(this.widgetListenKey)]
            )
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.length ||
                        isNil(response.item[1])
                    ) {
                        return;
                    }

                    let tableData =
                        this.datatableService.formatDataTableFromRawData(
                            response.item
                        );
                    tableData =
                        this.datatableService.buildDataSource(tableData);

                    this.databaseGridData = tableData;

                    setTimeout(() => {
                        this.databaseGrid.selectRowIndex(0);
                    }, 200);
                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    public onChangeSelectedItemsChanged() {
        if (!this.databaseGrid || !this.databaseGrid.selectedNode) return;
        const itemId =
            this.databaseGrid.selectedNode.data["IdSelectionDatabaseName"];

        if (itemId) {
            this.showAnotherCountryGrid = this.isAnotherCountryGrid();
            setTimeout(() => {
                if (this.cacheData[itemId]) {
                    if (this.isAnotherCountryGrid()) {
                        this.countryGridAnotherData =
                            this.cacheData[itemId].gridData;
                    } else {
                        this.countryGridData = this.cacheData[itemId].gridData;
                    }

                    if (this.willUpdateCache) {
                        this.updateCache();

                        this.willUpdateCache = false;
                    }
                    this.removeDisableGrid();
                    this.validateCountryGrid();
                } else {
                    this.databaseServiceSubscription = this.databaseService
                        .getListOfDatabaseCountry(
                            this.selectedEntity[
                                camelCase(this.widgetListenKey)
                            ],
                            itemId
                        )
                        .subscribe((response: ApiResultResponse) => {
                            this.appErrorHandler.executeAction(() => {
                                if (
                                    !Uti.isResquestSuccess(response) ||
                                    !response.item.length ||
                                    isNil(response.item[1])
                                ) {
                                    return;
                                }

                                let countryTableData =
                                    this.datatableService.formatDataTableFromRawData(
                                        response.item
                                    );
                                countryTableData =
                                    this.datatableService.buildDataSource(
                                        countryTableData
                                    );

                                if (this.isAnotherCountryGrid()) {
                                    this.countryGridAnotherData =
                                        countryTableData;
                                } else {
                                    this.countryGridData = countryTableData;
                                }

                                this.cacheData[itemId] = {
                                    gridData: cloneDeep(
                                        this.isAnotherCountryGrid()
                                            ? this.countryGridAnotherData
                                            : this.countryGridData
                                    ),
                                    isDirty: false,
                                    isDeleted: false,
                                };

                                if (this.willUpdateCache) {
                                    this.updateCache();

                                    this.willUpdateCache = false;
                                }
                                this.removeDisableGrid();
                                this.validateCountryGrid();
                                this.changeDetectorRef.detectChanges();
                            });
                        });
                }

                this.changeDetectorRef.detectChanges();
            }, 50);

            this.changeDetectorRef.detectChanges();
        }
    }

    private removeDisableGrid() {
        setTimeout(() => {
            this.disabledDatabaseGridData = false;

            this.changeDetectorRef.detectChanges();
        }, 500);
    }

    private updateCache() {
        let currentDatabaseItem = this.databaseGrid.selectedNode.data;

        if (this.cacheData[currentDatabaseItem["IdSelectionDatabaseName"]]) {
            this.cacheData[
                currentDatabaseItem["IdSelectionDatabaseName"]
            ].isDirty = true;
            this.cacheData[
                currentDatabaseItem["IdSelectionDatabaseName"]
            ].isDeleted = !this.databaseGrid.selectedNode.data.IsActive;

            this.emitAllTableEvents();
        } else {
            this.willUpdateCache = true;
        }

        this.changeDetectorRef.detectChanges();
    }

    private isValidationError() {
        let gridNames = Object.keys(this.validationError);
        for (let i = 0; i < gridNames.length; i++) {
            if (this.validationError[gridNames[i]]) {
                return true;
            }
        }

        return false;
    }

    public saveData() {
        if (this.isValidationError()) {
            this.modalService.warningMessage([
                {
                    key: "Modal_Message__The_Value_You_Entered_Is_Not_Valid",
                },
            ]);
            return;
        }

        if (isEmpty(this.cacheData)) {
            return;
        }

        let saveData: any[] = [],
            databaseItems: any = {},
            cacheDataKeys = Object.keys(this.cacheData);

        cacheDataKeys.forEach((key) => {
            if (this.cacheData[key].isDirty) {
                databaseItems[key] = this.cacheData[key];
            }
        });

        if (isEmpty(databaseItems)) {
            return;
        }

        Object.keys(databaseItems).forEach((key) => {
            if (databaseItems[key].isDeleted) {
                saveData.push({
                    _DataBase_IsActive: 0,
                    IdSelectionDatabaseName: key,
                    IdSelectionProject:
                        this.selectedEntity[camelCase(this.widgetListenKey)],
                });
            } else {
                databaseItems[key].gridData.data.forEach((country) => {
                    let saveItem: any = {
                        IsActive: 1,
                        IdSelectionDatabaseName: key,
                        IdSelectionProject:
                            this.selectedEntity[
                                camelCase(this.widgetListenKey)
                            ],
                        Priority: this.databaseGrid
                            .getCurrentNodeItems()
                            .find((x) => x.IdSelectionDatabaseName == key)
                            .Priority,
                        QtyToNeeded:
                            typeof country.QtyToNeeded === "object"
                                ? null
                                : country.QtyToNeeded,
                        IdSelectionProjectCountry:
                            country.IdSelectionProjectCountry,
                    };
                    if (
                        !country.hasOwnProperty("IdSelectionProjectDatabase") ||
                        isNil(country["IdSelectionProjectDatabase"]) ||
                        typeof country["IdSelectionProjectDatabase"] ===
                            "object"
                    ) {
                        saveData.push(saveItem);
                    } else {
                        saveItem["IdSelectionProjectDatabase"] =
                            country["IdSelectionProjectDatabase"];
                        saveData.push(saveItem);
                    }
                });
            }
        });

        this.databaseServiceSubscription = this.databaseService
            .saveProjectDatabase(saveData)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }

                    this.store.dispatch(
                        this.processDataActions.saveWidgetSuccess(this.ofModule)
                    );
                    this.reset();
                    this.onSaveSuccess.emit();

                    this.changeDetectorRef.detectChanges();
                });
            });

        this.changeDetectorRef.detectChanges();
    }

    public onCountryGridEditEnded(editingItem) {
        if (this.cacheData && editingItem) {
            let selectingDatabaseItem =
                this.cacheData[
                    this.databaseGrid.selectedNode.data[
                        "IdSelectionDatabaseName"
                    ]
                ];
            selectingDatabaseItem.isDirty = true;

            let currentItemIndex =
                selectingDatabaseItem.gridData.data.findIndex(
                    (dt) =>
                        dt.IdSelectionProjectCountry ==
                        editingItem.IdSelectionProjectCountry
                );
            if (currentItemIndex != -1) {
                selectingDatabaseItem.gridData.data.splice(
                    currentItemIndex,
                    1,
                    editingItem
                );
            }

            this.emitAllTableEvents();
            this.validateCountryGrid();
            this.changeDetectorRef.detectChanges();
        }
    }

    public dragEnd($event) {
        setTimeout(() => {
            this.databaseGrid.sizeColumnsToFit();
            this.countryGrid.sizeColumnsToFit();

            this.splitterConfig = {
                leftHorizontal: this.horizontalSplit.areas[0].size,
                rightHorizontal: this.horizontalSplit.areas[1].size,
            };

            this.saveSplitterSettings();

            this.changeDetectorRef.detectChanges();
        }, 50);
    }

    public reload() {
        this.reset();

        //if (this.databaseGrid) {
        //    this.databaseGrid.flex.select(new wjcGrid.CellRange(-1, -1, -1, -1));
        //}

        //if (this.countryGrid) {
        //    let columns = this.countryGridData.columns;
        //    this.countryGridData = null;
        //    this.countryGridData = {
        //        columns: columns,
        //        data: []
        //    }
        //}

        this.initDatabaseGrid();

        this.changeDetectorRef.detectChanges();
    }

    private reset() {
        this.validationError = {};
        this.cacheData = {};
    }

    public hasValidationErrorHandler($event, gridName) {
        this.validationError[gridName] = $event;

        this.changeDetectorRef.detectChanges();
    }

    public onDatabasePriotityChanged($event) {
        if (this.cacheData) {
            let databaseItems = this.databaseGrid
                .getCurrentNodeItems()
                .filter((x) => x.IsActive);
            databaseItems = databaseItems.map((dt) => {
                return dt["IdSelectionDatabaseName"];
            });

            databaseItems.forEach((dbId) => {
                if (this.cacheData[dbId]) {
                    this.cacheData[dbId].isDirty = true;
                }
            });

            this.emitAllTableEvents();

            this.changeDetectorRef.detectChanges();
        }
    }

    public onTableEditStart() {
        this.onGridEditStart.emit();
    }

    public onTableEditEnd() {
        this.onGridEditEnd.emit();
    }

    public onTableEditSuccess() {
        this.onGridEditSuccess.emit();
    }

    private emitAllTableEvents() {
        this.onGridEditStart.emit();
        this.onGridEditEnd.emit();
        this.onGridEditSuccess.emit();
    }

    private validateCountryGrid() {
        setTimeout(() => {
            let readOnly = this.checkCountryGridReadOnly();
            let disabled = this.checkCountryGridDisabled();

            if (
                readOnly !== this.isCountryGridReadOnly ||
                disabled !== this.isCountryGridDisabled
            ) {
                this.isCountryGridReadOnly = readOnly;
                this.isCountryGridDisabled = disabled;
                this.changeDetectorRef.detectChanges();
                if (this.countryGrid) {
                    this.countryGrid.refresh();
                }
            }
        }, 200);
    }
    public checkCountryGridReadOnly() {
        return (
            this.readOnly ||
            (this.databaseGrid != null &&
                this.databaseGrid.selectedNode != null &&
                !this.databaseGrid.selectedNode.data["IsActive"])
        );
    }

    public checkCountryGridDisabled() {
        return (
            this.databaseGrid != null &&
            this.databaseGrid.selectedNode != null &&
            !this.databaseGrid.selectedNode.data["IsActive"]
        );
    }

    public onDatabaseRowChecked(cellData) {
        this.willUpdateCache = true;
        this.updateCache();
    }

    private isAnotherCountryGrid() {
        return (
            this.databaseGrid &&
            this.databaseGrid.selectedNode &&
            this.databaseGrid.selectedNode.data["IdSelectionDatabaseName"] != 1
        );
    }
}
