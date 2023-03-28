import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    ViewChild,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    ElementRef,
} from "@angular/core";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import { Configuration, GlobalSettingConstant } from "app/app.constants";
import {
    ControlGridModel,
    ApiResultResponse,
    MessageModel,
    GlobalSettingModel,
} from "app/models";
import { XnAgGridComponent } from "../xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import {
    ProjectService,
    ModalService,
    AppErrorHandler,
    DatatableService,
    SearchService,
    GlobalSettingService,
} from "app/services";
import { IPageChangedEvent } from "../xn-pager/xn-pagination.component";
import camelCase from "lodash-es/camelCase";
import isEmpty from "lodash-es/isEmpty";
import cloneDeep from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";
import isNil from "lodash-es/isNil";
import { Uti } from "app/utilities";
import { ChangingModel } from "../form";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as moduleSettingReducer from "app/state-management/store/reducer/module-setting";
import { Subscription, Observable } from "rxjs";
import {
    CustomAction,
    ProcessDataActions,
} from "app/state-management/store/actions";
import { SplitComponent } from "angular-split";

class SelectionMediacodeExcluded {
    isActive: any;
    mediaCode: string;
    mediaCodeLabel: string;
    idSelectionProjectExcludeMediaCode: any;

    constructor(init?: Partial<SelectionMediacodeExcluded>) {
        Object.assign(this, init);
    }
}

class SelectionCountriesExcluded {
    idSelectionProjectCountry: any;
    idSelectionProjectExcludeCountries: any;
    isActive: any;
    selectionMediacodeExcluded: SelectionMediacodeExcluded[] = [];
    selectionMediacodeExcludedGridData = new ControlGridModel();

    constructor(init?: Partial<SelectionCountriesExcluded>) {
        Object.assign(this, init);
    }
}

class SelectionIsExcluded {
    idSelectionProject: number;
    idSelectionProjectExclude: number;
    selectionCountriesExcluded: SelectionCountriesExcluded[] = [];
    selectionCountriesExcludedGridData = new ControlGridModel();
    isDeleted = false;

    constructor(init?: Partial<SelectionIsExcluded>) {
        Object.assign(this, init);
    }
}

class CacheData {
    selectionIsExcluded: SelectionIsExcluded[] = [];
    selectionIsExcludedGridData = new ControlGridModel();

    constructor(init?: Partial<CacheData>) {
        Object.assign(this, init);
    }
}

@Component({
    selector: "selection-project-detail",
    templateUrl: "./selection-project-detail.component.html",
    styleUrls: ["./selection-project-detail.component.scss"],
})
export class SelectionProjectDetailComponent
    extends BaseComponent
    implements OnInit, OnDestroy, OnChanges
{
    public perfectScrollbarConfig: any = {};
    public leftGridData: ControlGridModel;
    public rightGridData: ControlGridModel;
    public bottomLeftGridData: ControlGridModel;
    public bottomRightGridData: ControlGridModel;
    public isBottomRightGridDisabled = false;
    public pageSize: number = Configuration.pageSize;
    private pageIndex: number = Configuration.pageIndex;
    private keyword: string = "*";
    private leftGrid: XnAgGridComponent;
    public columnsLayoutSettings: any = {};
    public splitterConfig = {
        leftVertical: 35,
        rightVertical: 65,
        topHorizontal: 50,
        botHorizontal: 50,
    };

    private cacheData = new CacheData();
    private selectedEntity: any = null;
    private widgetListenKey = null;

    private selectedEntityStateSubscription: Subscription;
    private selectedEntityState: Observable<any>;
    private requestSaveWidgetState: Observable<any>;

    private widgetListenKeyState: Observable<string>;
    private widgetListenKeyStateSubscription: Subscription;
    private requestSaveWidgetStateSubscription: Subscription;

    @Input() leftGridId: string;
    @Input() rightGridId: string;
    @Input() bottomLeftGridId: string;
    @Input() bottomRightGridId: string;
    @Input() globalProperties: any[] = [];
    @Input() readOnly = true;
    @Input() idRepWidgetApp = null;

    @Output() onGridEditStart = new EventEmitter<any>();
    @Output() onGridEditEnd = new EventEmitter<any>();
    @Output() onGridEditSuccess = new EventEmitter<any>();
    @Output() onSaveSuccess = new EventEmitter<any>();

    @ViewChild("leftGrid") set leftGridInstance(
        leftGridInstance: XnAgGridComponent
    ) {
        this.leftGrid = leftGridInstance;
    }
    @ViewChild("rightGrid") private rightGrid: XnAgGridComponent;
    @ViewChild("bottomLeftGrid") private bottomLeftGrid: XnAgGridComponent;
    @ViewChild("bottomRightGrid") private bottomRightGrid: XnAgGridComponent;
    @ViewChild("verticalSplit") private verticalSplit: SplitComponent;
    @ViewChild("horizontalSplit") private horizontalSplit: SplitComponent;

    constructor(
        private store: Store<AppState>,
        protected router: Router,
        private _eref: ElementRef,
        private projectService: ProjectService,
        private changeDetectorRef: ChangeDetectorRef,
        private modalService: ModalService,
        private appErrorHandler: AppErrorHandler,
        private datatableService: DatatableService,
        private dispatcher: ReducerManagerDispatcher,
        private processDataActions: ProcessDataActions,
        private searchService: SearchService,
        private globalSettingService: GlobalSettingService,
        private globalSettingConstant: GlobalSettingConstant
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

        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false,
        };
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
        this._subscribeWidgetListenKeyState();
        this._subscribeSelectedEntityState();
        this._subscribeRequestSaveWidgetState();

        this.loadColumnLayoutSettings();
        setTimeout(() => {
            this.loadSplitterSettings();
        }, 200);
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["readOnly"]) {
            if (!this.readOnly) {
                setTimeout(() => {
                    this.search();
                }, 50);

                //this.getSelectionToExclude();
            }
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
                                    this.verticalSplit.updateArea(
                                        this.verticalSplit.areas[0].component,
                                        1,
                                        this.splitterConfig.leftVertical,
                                        20
                                    );
                                    this.verticalSplit.updateArea(
                                        this.verticalSplit.areas[1].component,
                                        1,
                                        this.splitterConfig.rightVertical,
                                        20
                                    );
                                    this.horizontalSplit.updateArea(
                                        this.horizontalSplit.areas[0].component,
                                        1,
                                        this.splitterConfig.topHorizontal,
                                        20
                                    );
                                    this.horizontalSplit.updateArea(
                                        this.horizontalSplit.areas[1].component,
                                        1,
                                        this.splitterConfig.botHorizontal,
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

    private initData() {
        this.cacheData = new CacheData();
        this.initEmptyDataForGrid();

        if (!this.readOnly) {
            setTimeout(() => {
                this.search();
            }, 50);
            //this.getSelectionToExclude();
        }

        this.getSelectionIsExcluded();
    }

    private initEmptyDataForGrid() {
        this.leftGridData = {
            data: [],
            columns: [],
        };
        this.rightGridData = {
            data: [],
            columns: [],
        };
        this.bottomLeftGridData = {
            data: [],
            columns: [],
        };
        this.bottomRightGridData = {
            data: [],
            columns: [],
        };
    }

    private _subscribeRequestSaveWidgetState() {
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
                    this.submit();
                });
            });
    }

    public submit(callback?: any) {
        let saveData = {
            IdSelectionProject:
                this.selectedEntity[camelCase(this.widgetListenKey)],
            ProjectExcludeData: this.buildProjectExclude(),
        };

        this.projectService
            .saveProjectExclude(saveData)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    if (callback) {
                        callback();
                    }

                    this.store.dispatch(
                        this.processDataActions.saveWidgetSuccess(this.ofModule)
                    );
                    this.reset();
                    this.onSaveSuccess.emit();

                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    public onLeftGridSearch(keyword) {
        this.pageIndex = 1;
        this.keyword = keyword;
        this.search();
    }

    private search() {
        if (
            !this.leftGrid ||
            this.modalService.isStopSearchWhenEmptySize(
                this.pageSize,
                this.pageIndex
            )
        )
            return;
        this.leftGrid.isSearching = true;
        this.searchService
            .search(
                "selectioncampaignisactive",
                this.keyword,
                this.ofModule.idSettingsGUI,
                this.pageIndex,
                this.pageSize
            )
            .finally(() => {
                this.changeDetectorRef.detectChanges();
            })
            .subscribe(this.onSearchComplete.bind(this));
    }

    private onSearchComplete(response: ApiResultResponse) {
        const results: Array<any> = response.item.results;
        const columnSetting = this.formatColumnSetting(
            response.item.setting[0][0]
        );
        if (!results || !results.length) {
            this.leftGridData = {
                columns: columnSetting,
                data: [],
                totalResults: 0,
            };
            this.leftGrid.isSearching = false;

            //if (!this.rightGridData.columns.length) {
            //    this.rightGridData = {
            //        columns: columnSetting,
            //        data: [],
            //        totalResults: 0
            //    }

            //    this.currentRightGridData = cloneDeep(this.rightGridData);
            //}
            return;
        }
        const newData: Array<any> = [];
        for (const res of results) {
            const dataObj: any = {};
            if (this.checkExistPrimaryItem(res.idSelectionProject)) {
                continue;
            }

            if (
                this.selectedEntity &&
                res[camelCase(this.widgetListenKey)] ==
                    this.selectedEntity[camelCase(this.widgetListenKey)]
            ) {
                continue;
            }

            for (const col of columnSetting) {
                dataObj[col.data] = res[camelCase(col.data)];
            }
            newData.push(dataObj);
        }

        this.leftGridData.data = newData;
        let leftData = {
            data: newData,
            columns: columnSetting,
            totalResults: response.item.total,
        };
        // leftData = this.datatableService.appendRowId(leftData);
        this.leftGridData = leftData;
        this.leftGrid.isSearching = false;

        //if (!this.rightGridData.columns.length) {
        //    this.rightGridData = {
        //        columns: columnSetting,
        //        data: [],
        //        totalResults: 0
        //    }

        //    this.currentRightGridData = cloneDeep(this.rightGridData);
        //}
    }

    public onPageChanged(event: IPageChangedEvent) {
        this.pageIndex = event.page;
        this.pageSize = event.itemsPerPage;
        this.search();
    }

    public onPageNumberChanged(pageNumber: number) {
        this.pageSize = pageNumber;
    }

    private buildProjectExclude() {
        let ProjectExclude: any[] = null;

        this.cacheData.selectionIsExcluded.forEach((project) => {
            ProjectExclude = ProjectExclude || [];
            if (project.isDeleted) {
                ProjectExclude.push({
                    IdSelectionProjectExclude:
                        project.idSelectionProjectExclude,
                    IdSelectionProject: project.idSelectionProject,
                    ExcludeIdSelectionProject: null,
                    IsDeleted: 1,
                    JsonCountiesExclude: this.buildJsonCountiesExclude(project),
                });
            } else {
                ProjectExclude.push({
                    IdSelectionProjectExclude:
                        project.idSelectionProjectExclude,
                    IdSelectionProject: project.idSelectionProject,
                    ExcludeIdSelectionProject: null,
                    IsActive: 1,
                    JsonCountiesExclude: this.buildJsonCountiesExclude(project),
                });
            }
        });

        return ProjectExclude;
    }

    private buildJsonCountiesExclude(project: SelectionIsExcluded) {
        let ProjectExcludeCountries: any[] = null;

        for (let i = 0; i < project.selectionCountriesExcluded.length; i++) {
            ProjectExcludeCountries = ProjectExcludeCountries || [];
            let isActive = Uti.isNullUndefinedEmptyObject(
                project.selectionCountriesExcluded[i].isActive
            )
                ? false
                : project.selectionCountriesExcluded[i].isActive;
            if (isActive === 1) {
                isActive = true;
            } else if (isActive === 0) {
                isActive = false;
            }

            ProjectExcludeCountries.push({
                IdSelectionProjectExcludeCountries:
                    project.selectionCountriesExcluded[i]
                        .idSelectionProjectExcludeCountries,
                IdSelectionProjectCountry:
                    project.selectionCountriesExcluded[i]
                        .idSelectionProjectCountry,
                IsActive: isActive,
                JsonMediaCodeExclude: isActive
                    ? this.buildJsonMediaCodeExclude(
                          project.selectionCountriesExcluded[i]
                      )
                    : JSON.stringify({ ProjectExcludeMediaCode: null }),
            });
        }

        return JSON.stringify({ ProjectExcludeCountries });
    }

    private buildJsonMediaCodeExclude(country: SelectionCountriesExcluded) {
        let ProjectExcludeMediaCode: any[] = null;

        for (let i = 0; i < country.selectionMediacodeExcluded.length; i++) {
            ProjectExcludeMediaCode = ProjectExcludeMediaCode || [];

            let isActive = Uti.isNullUndefinedEmptyObject(
                country.selectionMediacodeExcluded[i].isActive
            )
                ? false
                : country.selectionMediacodeExcluded[i].isActive;
            if (isActive === 1) {
                isActive = true;
            } else if (isActive === 0) {
                isActive = false;
            }

            if (isActive) {
                ProjectExcludeMediaCode.push({
                    IdSelectionProjectExcludeMediaCode:
                        country.selectionMediacodeExcluded[i]
                            .idSelectionProjectExcludeMediaCode,
                    MediaCode: country.selectionMediacodeExcluded[i].mediaCode,
                    MediaCodeLabel:
                        country.selectionMediacodeExcluded[i].mediaCodeLabel,
                    IsActive: isActive,
                });
            } else if (
                !isActive &&
                country.selectionMediacodeExcluded[i]
                    .idSelectionProjectExcludeMediaCode
            ) {
                ProjectExcludeMediaCode.push({
                    IdSelectionProjectExcludeMediaCode:
                        country.selectionMediacodeExcluded[i]
                            .idSelectionProjectExcludeMediaCode,
                    MediaCode: country.selectionMediacodeExcluded[i].mediaCode,
                    MediaCodeLabel:
                        country.selectionMediacodeExcluded[i].mediaCodeLabel,
                    IsDeleted: true,
                });
            }
        }

        if (ProjectExcludeMediaCode && !ProjectExcludeMediaCode.length) {
            ProjectExcludeMediaCode = null;
        }

        return JSON.stringify({ ProjectExcludeMediaCode });
    }

    public reload() {
        this.initData();
    }

    private reset() {
        this.cacheData.selectionIsExcluded.forEach((project) => {
            project.isDeleted = false;
        });
    }

    private getSelectionToExclude() {
        this.projectService
            .getSelectionToExclude(
                this.selectedEntity[camelCase(this.widgetListenKey)]
            )
            .finally(() => {
                this.changeDetectorRef.detectChanges();
            })
            .subscribe((response: ApiResultResponse) => {
                if (Uti.isResquestSuccess(response)) {
                    let tableData: any =
                        this.datatableService.formatDataTableFromRawData(
                            response.item
                        );
                    tableData =
                        this.datatableService.buildDataSource(tableData);

                    const config = {
                        allowDelete: false,
                        allowMediaCode: false,
                        allowDownload: false,
                        allowSelectAll: false,
                        hasDisableRow: false,
                        hasCountrySelectAll: false,
                    };

                    tableData = this.datatableService.buildWijmoDataSource(
                        tableData,
                        config
                    );

                    const newData: Array<any> = [];
                    for (const res of tableData.data) {
                        if (
                            this.checkExistPrimaryItem(
                                res[this.widgetListenKey]
                            )
                        ) {
                            continue;
                        }

                        if (
                            this.selectedEntity &&
                            res[this.widgetListenKey] ==
                                this.selectedEntity[
                                    camelCase(this.widgetListenKey)
                                ]
                        ) {
                            continue;
                        }

                        newData.push(res);
                    }

                    this.leftGridData = {
                        columns: tableData.columns,
                        data: newData,
                        totalResults: newData.length,
                    };

                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    private getSelectionIsExcluded() {
        this.projectService
            .getSelectionIsExcluded(
                this.selectedEntity[camelCase(this.widgetListenKey)]
            )
            .finally(() => {
                this.changeDetectorRef.detectChanges();
            })
            .subscribe((response: ApiResultResponse) => {
                if (Uti.isResquestSuccess(response)) {
                    let tableData: any =
                        this.datatableService.formatDataTableFromRawData(
                            response.item
                        );
                    tableData =
                        this.datatableService.buildDataSource(tableData);

                    const config = {
                        allowDelete: false,
                        allowMediaCode: false,
                        allowDownload: false,
                        allowSelectAll: false,
                        hasDisableRow: false,
                        hasCountrySelectAll: false,
                    };

                    tableData = this.datatableService.buildWijmoDataSource(
                        tableData,
                        config
                    );

                    this.rightGridData = tableData;

                    this.cacheData.selectionIsExcludedGridData = cloneDeep(
                        this.rightGridData
                    );

                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    private getSelectionCountriesExcluded(idSelectionProject) {
        let found = this.cacheData.selectionIsExcluded.find(
            (item) => item.idSelectionProject == idSelectionProject
        );
        if (found && found.selectionCountriesExcluded.length) {
            this.bottomLeftGridData = found.selectionCountriesExcludedGridData;

            this.changeDetectorRef.detectChanges();
            return;
        }

        this.projectService
            .getSelectionCountriesExcluded(idSelectionProject)
            .finally(() => {
                this.changeDetectorRef.detectChanges();
            })
            .subscribe((response: ApiResultResponse) => {
                if (Uti.isResquestSuccess(response)) {
                    let tableData: any =
                        this.datatableService.formatDataTableFromRawData(
                            response.item
                        );
                    tableData =
                        this.datatableService.buildDataSource(tableData);

                    const config = {
                        allowDelete: false,
                        allowMediaCode: false,
                        allowDownload: false,
                        allowSelectAll: false,
                        hasDisableRow: false,
                        hasCountrySelectAll: false,
                    };

                    tableData = this.datatableService.buildWijmoDataSource(
                        tableData,
                        config
                    );

                    this.bottomLeftGridData = tableData;

                    found.selectionCountriesExcludedGridData = tableData;
                    found.selectionCountriesExcluded =
                        this.buildSelectionCountriesExcluded(
                            idSelectionProject,
                            tableData
                        );

                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    private buildSelectionCountriesExcluded(idSelectionProject, tableData) {
        return tableData.data.map((item) => {
            return new SelectionCountriesExcluded({
                idSelectionProjectCountry: item.IdSelectionProjectCountry,
                idSelectionProjectExcludeCountries:
                    item.IdSelectionProjectExcludeCountries,
                isActive: item.IsActive,
                selectionMediacodeExcluded: [],
                selectionMediacodeExcludedGridData: new ControlGridModel(),
            });
        });
    }

    private getSelectionMediacodeExcluded(
        idSelectionProject,
        idSelectionProjectCountry
    ) {
        let project = this.cacheData.selectionIsExcluded.find(
            (x) => x.idSelectionProject == idSelectionProject
        );
        let country: SelectionCountriesExcluded;
        if (project) {
            country = project.selectionCountriesExcluded.find(
                (x) => x.idSelectionProjectCountry == idSelectionProjectCountry
            );

            if (country && country.selectionMediacodeExcluded.length) {
                this.bottomRightGridData =
                    country.selectionMediacodeExcludedGridData;

                this.changeDetectorRef.detectChanges();
                return;
            }
        }

        this.projectService
            .getSelectionMediacodeExcluded(
                idSelectionProject,
                idSelectionProjectCountry
            )
            .finally(() => {
                this.changeDetectorRef.detectChanges();
            })
            .subscribe((response: ApiResultResponse) => {
                if (Uti.isResquestSuccess(response)) {
                    let tableData: any =
                        this.datatableService.formatDataTableFromRawData(
                            response.item
                        );
                    tableData =
                        this.datatableService.buildDataSource(tableData);

                    const config = {
                        allowDelete: false,
                        allowMediaCode: false,
                        allowDownload: false,
                        allowSelectAll: false,
                        hasDisableRow: false,
                        hasCountrySelectAll: false,
                    };

                    tableData = this.datatableService.buildWijmoDataSource(
                        tableData,
                        config
                    );
                    this.bottomRightGridData = tableData;

                    country.selectionMediacodeExcludedGridData = tableData;
                    country.selectionMediacodeExcluded =
                        this.buildSelectionMediacodeExcluded(
                            idSelectionProjectCountry,
                            tableData
                        );

                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    private buildSelectionMediacodeExcluded(
        idSelectionProjectCountry,
        tableData
    ) {
        return tableData.data.map((item) => {
            return new SelectionMediacodeExcluded({
                isActive: item.IsActive,
                mediaCode: item.MediaCode,
                mediaCodeLabel: item.MediaCodeLabel,
                idSelectionProjectExcludeMediaCode:
                    item.IdSelectionProjectExcludeMediacode,
            });
        });
    }

    private formatColumnSetting(settingData) {
        const formatColumnSetting: { [key: string]: any } = {};
        let widgetTitle = "";
        if (settingData && settingData.SettingColumnName) {
            const columnSetting: Array<any> = JSON.parse(
                settingData.SettingColumnName
            );
            if (columnSetting && columnSetting.length) {
                widgetTitle = columnSetting[0].WidgetTitle;
                if (columnSetting[1]) {
                    const columns: Array<any> = columnSetting[1].ColumnsName;
                    columns.forEach((col) => {
                        formatColumnSetting[col.ColumnName] = col;
                    });
                }
            }
        }

        const columns: Array<any> = [];

        Object.keys(formatColumnSetting).forEach((key) => {
            columns.push({
                title: formatColumnSetting[key].ColumnHeader,
                data: formatColumnSetting[key].ColumnName,
                setting: {
                    Setting: formatColumnSetting[key].Setting,
                },
            });
        });

        return columns;
    }

    private checkExistPrimaryItem(idSelectionProject: any): boolean {
        const project = this.rightGridData.data.find(
            (x) => x.IdSelectionProject == idSelectionProject
        );
        return project && project.IdSelectionProject;
    }

    public addProject() {
        if (isEmpty(this.currentSelectedItemLeft())) return;
        this.rightGridData = this.addProjectItem(
            this.rightGridData,
            this.getRightItem()
        );
        this.leftGridData = this.removeProjectItem(
            this.leftGridData,
            this.currentSelectedItemLeft()
        );
        this.focusRightLastItem();
        this.onTableEditSuccess();

        this.changeDetectorRef.detectChanges();
    }

    private currentSelectedItemLeft(): any {
        return Uti.mapArrayToObject(this.leftGrid.selectedItem() || [], true);
    }

    private currentSelectedItemRight(): any {
        return Uti.mapArrayToObject(this.rightGrid.selectedItem() || [], true);
    }

    private currentSelectedItemBottomLeft(): any {
        return Uti.mapArrayToObject(
            this.bottomLeftGrid.selectedItem() || [],
            true
        );
    }

    private focusRightLastItem() {
        // Select the last item
        setTimeout(() => {
            if (this.rightGrid) {
                this.rightGrid.selectRowIndex(
                    this.rightGridData.data.length - 1,
                    true
                );
            }
        }, 1000);
    }

    private addProjectItem(
        controlGridModel: ControlGridModel,
        selectItem: any
    ): ControlGridModel {
        controlGridModel.data.push(selectItem);
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    private getRightItem(): any {
        let leftSelectItem = this.currentSelectedItemLeft();
        let cachedItem = this.cacheData.selectionIsExcludedGridData.data.find(
            (x) => x.IdSelectionProject == leftSelectItem.IdSelectionProject
        );
        if (cachedItem) {
            return cachedItem;
        }
        return leftSelectItem;
    }

    private removeProjectItem(
        controlGridModel: ControlGridModel,
        selectItem: any
    ): ControlGridModel {
        Uti.removeItemInArray(
            controlGridModel.data,
            selectItem,
            "IdSelectionProject"
        );
        this.resetBottomGrid();
        return Uti.cloneDataForGridItems(controlGridModel);
    }

    private resetBottomGrid() {
        this.bottomLeftGridData = Uti.cloneDataForGridItems({
            data: [],
            columns: this.bottomLeftGridData.columns,
        });

        this.bottomRightGridData = Uti.cloneDataForGridItems({
            data: [],
            columns: this.bottomRightGridData.columns,
        });
    }

    public removeProject() {
        if (isEmpty(this.currentSelectedItemRight())) {
            return;
        }

        let project = this.cacheData.selectionIsExcluded.find(
            (x) =>
                x.idSelectionProject ==
                this.currentSelectedItemRight().IdSelectionProject
        );
        if (project) {
            project.isDeleted = true;
            project.selectionCountriesExcluded = [];
        }

        this.rightGridData = this.removeProjectItem(
            this.rightGridData,
            this.currentSelectedItemRight()
        );
        this.focusRightLastItem();
        this.search();

        this.onTableEditSuccess();

        this.changeDetectorRef.detectChanges();
    }

    public removeAllProjects() {
        if (!this.rightGridData.data.length) return;
        this.modalService.confirmMessageHtmlContent(
            new MessageModel({
                message: [
                    { key: "<p>" },
                    {
                        key: "Modal_Message__Are_You_Sure_You_Want_To_Remove_All_Projects",
                    },
                    { key: "</p>" },
                ],
                callBack1: () => {
                    this.removeAllProjectsAfterConfirm();
                },
            })
        );
    }

    private removeAllProjectsAfterConfirm() {
        this.rightGridData = {
            data: [],
            columns: this.rightGridData.columns,
        };
        this.resetBottomGrid();
        this.focusRightLastItem();
        this.onTableEditSuccess();
        //this.getSelectionToExclude();

        this.changeDetectorRef.detectChanges();
    }

    public leftGridRowDoubleClick($event: any) {
        this.addProject();
    }

    public rightGridRowDoubleClick($event: any) {
        if (!this.readOnly) {
            this.removeProject();
        }
    }

    public rightGridRowClick($event: any) {
        setTimeout(() => {
            let idSelectionProject = Uti.getValueFromArrayByKey(
                $event,
                "IdSelectionProject"
            );
            let idSelectionProjectExclude = Uti.getValueFromArrayByKey(
                $event,
                "IdSelectionProjectExclude"
            );

            let found = this.cacheData.selectionIsExcluded.find(
                (x) => x.idSelectionProject == idSelectionProject
            );
            if (!found) {
                this.cacheData.selectionIsExcluded.push({
                    idSelectionProject: idSelectionProject,
                    idSelectionProjectExclude: idSelectionProjectExclude,
                    selectionCountriesExcludedGridData: new ControlGridModel(),
                    selectionCountriesExcluded: [],
                    isDeleted: false,
                });
            }

            this.getSelectionCountriesExcluded(idSelectionProject);

            this.changeDetectorRef.detectChanges();
        }, 100);
    }

    public bottomLeftGridRowClick($event: any) {
        setTimeout(() => {
            let idSelectionProject =
                this.currentSelectedItemRight()["IdSelectionProject"];
            let idSelectionProjectCountry = Uti.getValueFromArrayByKey(
                $event,
                "IdSelectionProjectCountry"
            );
            let isActive = Uti.getValueFromArrayByKey($event, "IsActive");
            let idSelectionProjectExcludeCountries = Uti.getValueFromArrayByKey(
                $event,
                "IdSelectionProjectExcludeCountries"
            );

            let project = this.cacheData.selectionIsExcluded.find(
                (x) => x.idSelectionProject == idSelectionProject
            );
            if (project) {
                let country = project.selectionCountriesExcluded.find(
                    (x) =>
                        x.idSelectionProjectCountry == idSelectionProjectCountry
                );

                if (!country) {
                    project.selectionCountriesExcluded.push({
                        idSelectionProjectCountry: idSelectionProjectCountry,
                        idSelectionProjectExcludeCountries:
                            idSelectionProjectExcludeCountries,
                        isActive: isActive,
                        selectionMediacodeExcludedGridData:
                            new ControlGridModel(),
                        selectionMediacodeExcluded: [],
                    });
                }
            }

            this.validateBottomRightGrid();

            this.getSelectionMediacodeExcluded(
                idSelectionProject,
                idSelectionProjectCountry
            );

            this.changeDetectorRef.detectChanges();
        }, 100);
    }

    private _subscribeWidgetListenKeyState() {
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

    private _subscribeSelectedEntityState() {
        this.selectedEntityStateSubscription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
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

                    this.initData();

                    this.changeDetectorRef.detectChanges();
                });
            });
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

    public onBottomLeftGridEditSuccess($event) {
        let idSelectionProject =
            this.currentSelectedItemRight()["IdSelectionProject"];
        let idSelectionProjectCountry = Uti.getValueFromArrayByKey(
            $event,
            "IdSelectionProjectCountry"
        );
        let isActive = Uti.getValueFromArrayByKey($event, "IsActive");

        let project = this.cacheData.selectionIsExcluded.find(
            (x) => x.idSelectionProject == idSelectionProject
        );
        if (project) {
            let country = project.selectionCountriesExcluded.find(
                (x) => x.idSelectionProjectCountry == idSelectionProjectCountry
            );

            if (country) {
                country.isActive = isActive;

                if (!isActive) {
                    country.selectionMediacodeExcluded = [];
                }
            }
        }

        this.validateBottomRightGrid();

        this.onTableEditSuccess();

        this.changeDetectorRef.detectChanges();
    }

    public onBottomRightGridEditSuccess($event) {
        let idSelectionProject =
            this.currentSelectedItemRight()["IdSelectionProject"];
        let idSelectionProjectCountry =
            this.currentSelectedItemBottomLeft()["IdSelectionProjectCountry"];
        let mediaCode = Uti.getValueFromArrayByKey($event, "MediaCode");
        let isActive = Uti.getValueFromArrayByKey($event, "IsActive");

        let project = this.cacheData.selectionIsExcluded.find(
            (x) => x.idSelectionProject == idSelectionProject
        );
        if (project) {
            let country = project.selectionCountriesExcluded.find(
                (x) => x.idSelectionProjectCountry == idSelectionProjectCountry
            );

            if (country) {
                let foundMediacode = country.selectionMediacodeExcluded.find(
                    (x) => x.mediaCode == mediaCode
                );
                if (foundMediacode) {
                    foundMediacode.isActive = isActive;
                }
            }
        }

        this.onTableEditSuccess();

        this.changeDetectorRef.detectChanges();
    }

    private emitAllTableEvents() {
        this.onGridEditStart.emit();
        this.onGridEditEnd.emit();
        this.onGridEditSuccess.emit();

        this.changeDetectorRef.detectChanges();
    }

    private validateBottomRightGrid() {
        this.isBottomRightGridDisabled = this.checkBottomRightGridDisabled();

        this.changeDetectorRef.detectChanges();
    }

    private checkBottomRightGridDisabled() {
        return (
            this.bottomLeftGrid != null &&
            this.bottomLeftGrid.selectedNode != null &&
            !this.bottomLeftGrid.selectedNode.data["IsActive"]
        );
    }

    public onBottomLeftGridIsActiveAllChanged(checked) {
        let idSelectionProject =
            this.currentSelectedItemRight()["IdSelectionProject"];

        let project = this.cacheData.selectionIsExcluded.find(
            (x) => x.idSelectionProject == idSelectionProject
        );
        if (project) {
            project.selectionCountriesExcluded.forEach((item) => {
                item.isActive = checked;
            });
            project.selectionCountriesExcludedGridData = new ControlGridModel({
                columns: this.bottomLeftGridData.columns,
                data: this.bottomLeftGrid.getGridData(),
                totalResults: this.bottomLeftGrid.getGridData().length,
            });
        }

        this.onTableEditSuccess();

        this.changeDetectorRef.detectChanges();
    }

    public onBottomRightGridIsActiveAllChanged(checked) {
        let idSelectionProject =
            this.currentSelectedItemRight()["IdSelectionProject"];
        let idSelectionProjectCountry =
            this.currentSelectedItemBottomLeft()["IdSelectionProjectCountry"];

        let project = this.cacheData.selectionIsExcluded.find(
            (x) => x.idSelectionProject == idSelectionProject
        );
        if (project) {
            let country = project.selectionCountriesExcluded.find(
                (x) => x.idSelectionProjectCountry == idSelectionProjectCountry
            );

            if (country) {
                country.selectionMediacodeExcluded.forEach((item) => {
                    item.isActive = checked;
                });
                country.selectionMediacodeExcludedGridData =
                    new ControlGridModel({
                        columns: this.bottomRightGridData.columns,
                        data: this.bottomRightGrid.getGridData(),
                        totalResults: this.bottomRightGrid.getGridData().length,
                    });
            }
        }

        this.onTableEditSuccess();

        this.changeDetectorRef.detectChanges();
    }
    public dragEnd($event) {
        this.leftGrid && this.leftGrid.sizeColumnsToFit();
        this.rightGrid && this.rightGrid.sizeColumnsToFit();
        this.bottomLeftGrid && this.bottomLeftGrid.sizeColumnsToFit();
        this.bottomRightGrid && this.bottomRightGrid.sizeColumnsToFit();

        this.splitterConfig = {
            leftVertical: this.verticalSplit.areas[0].size,
            rightVertical: this.verticalSplit.areas[1].size,
            topHorizontal: this.horizontalSplit.areas[0].size,
            botHorizontal: this.horizontalSplit.areas[1].size,
        };

        this.saveSplitterSettings();

        this.changeDetectorRef.detectChanges();
    }
}
