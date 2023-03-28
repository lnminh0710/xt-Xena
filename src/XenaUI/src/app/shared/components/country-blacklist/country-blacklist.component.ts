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
    OnChanges,
    SimpleChanges,
} from "@angular/core";
import {
    ControlGridModel,
    ControlGridColumnModel,
    ApiResultResponse,
    GlobalSettingModel,
} from "app/models";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import camelCase from "lodash-es/camelCase";
import cloneDeep from "lodash-es/cloneDeep";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import {
    GridActions,
    ProcessDataActions,
    FilterActions,
    CustomAction,
} from "app/state-management/store/actions";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import {
    AppErrorHandler,
    CountrySelectionService,
    RuleService,
    DatatableService,
    ModalService,
    GlobalSettingService,
} from "app/services";
import { Uti } from "app/utilities";
import { RuleEnum, MapFromWidgetAppToFilterId } from "app/app.constants";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as moduleSettingReducer from "app/state-management/store/reducer/module-setting";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import { XnAgGridComponent } from "../xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import { SplitComponent } from "angular-split";

/**
 * CountryBlackListItem
 */
class CountryBlackListItem {
    [key: string]: Array<string>;
    public constructor(init?: Partial<CountryBlackListItem>) {
        Object.assign(this, init);
    }
}

const ID_STRING = {
    ID_COLUMN_NAME: "IdRepPersonStatus",
    ID_SELECT_ALL: "0",
    COUNTRY_ID: "IdSelectionProjectCountry",
    COUNTRY_LANGUAGE_ID: "IdCountrylanguage",
    MEDIACODE: "MediaCode",
    ID_SELECTION_PROJECT_RULES: "IdSelectionProjectRules",
};

@Component({
    selector: "country-blacklist",
    templateUrl: "./country-blacklist.component.html",
    styleUrls: ["./country-blacklist.component.scss"],
})
export class CountryBlacklistComponent
    extends BaseComponent
    implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
    public countryGridData: any;
    public blackListGridData: any;
    private widgetListenKey = null;
    private selectedEntity: any = null;
    public countryBlackListItem = new CountryBlackListItem();
    private isForAllCountry: boolean;
    private cacheData = {};
    public perfectScrollbarConfig: any = {};
    private profileData: any = null;
    private validationError = {};
    public isBlacklistGridReadOnly = true;
    public isBlacklistGridDisabled = false;
    public columnsLayoutSettings: any = {};
    private showCountriesUpdatedWarning = false;
    private showAllCountriesAffectWarning = {
        whenUpdate: false,
    };
    public splitterConfig = {
        leftHorizontal: 60,
        rightHorizontal: 40,
    };

    @ViewChild("countryGrid") countryGrid: XnAgGridComponent;
    @ViewChild("blackListGrid") blackListGrid: XnAgGridComponent;
    @ViewChild("horizontalSplit") horizontalSplit: SplitComponent;

    @Input() readOnly = true;
    @Input() idRepWidgetApp = null;
    @Input() globalProperties: any[] = [];
    @Input() countryGridId: string;
    @Input() filterGridId: string;

    @Output() onGridEditStart = new EventEmitter<any>();
    @Output() onGridEditEnd = new EventEmitter<any>();
    @Output() onGridEditSuccess = new EventEmitter<any>();
    @Output() onSaveSuccess = new EventEmitter<any>();

    private selectedEntityState: Observable<any>;
    private widgetListenKeyState: Observable<string>;
    private requestSaveWidgetState: Observable<any>;
    private requestLoadProfileState: Observable<any>;
    private selectionCountriesAreUpdatedState: Observable<any>;

    private selectedEntityStateSubscription: Subscription;
    private widgetListenKeyStateSubscription: Subscription;
    private countrySelectionServiceSubscription: Subscription;
    private blacklistServiceSubscription: Subscription;
    private ruleServiceSubscription: Subscription;
    private requestSaveWidgetStateSubscription: Subscription;
    private requestLoadProfileStateSubscription: Subscription;
    private selectionCountriesAreUpdatedStateSubscription: Subscription;

    constructor(
        private store: Store<AppState>,
        private _eref: ElementRef,
        private appErrorHandler: AppErrorHandler,
        private countrySelectionService: CountrySelectionService,
        private ruleService: RuleService,
        private datatableService: DatatableService,
        private processDataActions: ProcessDataActions,
        private filterActions: FilterActions,
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

        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false,
        };
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
        this.loadColumnLayoutSettings();
        setTimeout(() => {
            this.loadSplitterSettings();
        }, 200);

        this._subscribeWidgetListenKeyState();
        this._subscribeSelectedEntityState();
        this._subscribeRequestSaveWidgetState();
        this._subscribeRequestLoadProfileState();
        this._subscribeSelectionCountriesAreUpdatedState();
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["readOnly"]) {
            this.validateBlacklistGrid();
        }
    }

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {}

    ngAfterContentChecked(): void {
        if (
            this._eref.nativeElement.offsetParent != null &&
            this.showCountriesUpdatedWarning
        ) {
            this.reload();
            this.showCountriesUpdatedWarning = false;
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
                    this.profileData = null;
                    this.cacheData = {};
                    this.countryBlackListItem = new CountryBlackListItem();

                    this.initCountryGridData();
                    this.initBlackListGridData(() => {
                        setTimeout(() => {
                            this.preloadData();
                        }, 500);
                    });

                    this.changeDetectorRef.detectChanges();
                });
            });
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

    private _subscribeRequestLoadProfileState() {
        this.requestSaveWidgetStateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === FilterActions.REQUEST_LOAD_PROFILE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .map((action: CustomAction) => {
                return action.payload;
            })
            .subscribe((profileData) => {
                this.appErrorHandler.executeAction(() => {
                    if (profileData) {
                        if (
                            profileData.IdSelectionWidget ==
                            MapFromWidgetAppToFilterId[this.idRepWidgetApp]
                        ) {
                            this.initProfileData(profileData);
                        } else {
                            this.profileData = null;
                        }

                        this.changeDetectorRef.detectChanges();
                    }
                });
            });
    }

    private _subscribeSelectionCountriesAreUpdatedState() {
        this.selectionCountriesAreUpdatedStateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        ProcessDataActions.SELECTION_COUNTRIES_ARE_UPDATED &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.showCountriesUpdatedWarning = true;
                });
            });
    }

    private initProfileData(profileData) {
        if (!profileData || !profileData.TemplateData) {
            return;
        }

        this.profileData = Uti.tryParseJson(profileData.TemplateData);
        if (this.profileData) {
            this.profileData = this.profileData.JsonRules;

            //if (this.countryGrid) {
            //    this.countryGrid.flex.select(new wjcGrid.CellRange(-1, -1, -1, -1));
            //}
            //if (this.blackListGrid) {
            //    this.blackListGrid.getCurrentNodeItems().forEach((item) => {
            //        item.noExport = false;
            //        this.blackListGrid.updateRowData([item]);
            //    })
            //}

            this.loadBlackListFromSeletedCountry();
        }

        this.changeDetectorRef.detectChanges();
    }

    /**
     * initCountryGridData
     */
    private initCountryGridData(callBack?: any) {
        this.countrySelectionServiceSubscription = this.countrySelectionService
            .getSelectionProjectCountry(
                this.selectedEntity[camelCase(this.widgetListenKey)],
                RuleEnum.Blacklist
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

                    response.item[1] = response.item[1].filter((item) => {
                        return typeof item.IdCountrylanguage !== "object";
                    });

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
                    };

                    tableData = this.datatableService.buildWijmoDataSource(
                        tableData,
                        config
                    );

                    this.countryGridData = tableData;
                    this.cacheData = [];

                    if (callBack) {
                        callBack();
                    }

                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    private loadRulesByCountry(countryId, countryLanguageId) {
        return this.ruleService
            .getProjectRules(
                RuleEnum.Blacklist,
                this.selectedEntity[camelCase(this.widgetListenKey)],
                countryId
            )
            .map((response: ApiResultResponse) => {
                return {
                    ...response,
                    countryId,
                    countryLanguageId,
                };
            });
    }

    private preloadData() {
        let countries = this.countryGrid.getGridData();
        let observableBatch = [];
        countries.forEach((country) => {
            if (country[ID_STRING.COUNTRY_ID]) {
                observableBatch.push(
                    this.loadRulesByCountry(
                        country[ID_STRING.COUNTRY_ID],
                        country[ID_STRING.COUNTRY_LANGUAGE_ID]
                    )
                );
            }
        });

        Observable.forkJoin(observableBatch)
            .finally(() => {
                this.changeDetectorRef.detectChanges();
            })
            .subscribe((results: Array<any>) => {
                results.forEach((response) => {
                    if (!response) {
                        return;
                    }

                    if (
                        response.item &&
                        response.item.length &&
                        response.item[0][0]
                    ) {
                        let rulesFromService = response.item[0][0];
                        this.cacheData[response.countryId] =
                            rulesFromService[
                                ID_STRING.ID_SELECTION_PROJECT_RULES
                            ];
                        let rules = Uti.tryParseJson(
                            response.item[0][0].JsonCaseRules
                        ).rules;
                        rules.forEach((rule) => {
                            const rs = this.blackListGrid
                                .getCurrentNodeItems()
                                .find(
                                    (p) =>
                                        p[ID_STRING.ID_COLUMN_NAME] ==
                                        rule.value[ID_STRING.ID_COLUMN_NAME]
                                );
                            if (rs) {
                                rs.noExport = true;
                                this.blackListGrid.updateRowData([rs]);
                            }
                            this.updateBlackListItemForCountry(
                                response.countryLanguageId,
                                rule.value[ID_STRING.ID_COLUMN_NAME],
                                true
                            );
                        });

                        this.validateBlacklistGrid();
                        this.changeDetectorRef.detectChanges();
                    } else {
                        this.countryBlackListItem[response.countryLanguageId] =
                            [];
                    }
                });

                setTimeout(() => {
                    this.countryGrid.selectRowIndex(0);
                }, 200);
            });
    }

    /*
     * initBlackListGridData
     */
    private initBlackListGridData(callBack?: any) {
        this.blacklistServiceSubscription = this.ruleService
            .getBlackListRules()
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.length ||
                        isNil(response.item[1])
                    ) {
                        return;
                    }

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
                        hasNoExport: true,
                    };

                    tableData = this.datatableService.buildWijmoDataSource(
                        tableData,
                        config
                    );

                    this.blackListGridData = tableData;

                    if (callBack) {
                        callBack();
                    }

                    this.validateBlacklistGrid();
                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    /**
     * loadBlackListFromSeletedCountry
     */
    private loadBlackListFromSeletedCountry() {
        if (this.countryGrid && this.countryGrid.selectedNode) {
            const item = this.countryGrid.selectedNode.data;
            const countryId = item[ID_STRING.COUNTRY_ID];
            const countryLanguageId = item[ID_STRING.COUNTRY_LANGUAGE_ID];

            if (this.blackListGrid) {
                this.blackListGrid.getCurrentNodeItems().forEach((item) => {
                    item.noExport = false;
                    this.blackListGrid.updateRowData([item]);
                });
            }

            //if (this.blackListGridData) {
            //    this.blackListGridData.data.map(p => {
            //        p.noExport = false;
            //    });
            //    let currentGridData = cloneDeep(this.blackListGridData);
            //    this.blackListGridData = null;
            //    this.blackListGridData = currentGridData;
            //}

            if (!countryId) {
                this.validateBlacklistGrid();
                this.changeDetectorRef.detectChanges();
                return;
            }

            if (this.profileData && this.profileData.length) {
                let profile = this.profileData[0];
                let rules = profile.Rules;
                if (rules) {
                    if (this.isForAllCountry) {
                        this.countryGrid.getGridData().forEach((country) => {
                            this.processApplyProfile(rules[0].rules, country);
                        });
                    } else {
                        let selectingCountry =
                            this.countryGrid.getSelectedNode().data;
                        this.processApplyProfile(
                            rules[0].rules,
                            selectingCountry
                        );
                    }
                }

                this.profileData = [];
                this.validateBlacklistGrid();
                this.onTableEditSuccess();
                this.changeDetectorRef.detectChanges();
                return;

                //let rulesOfThisCountryId = this.profileData.find(r => r[ID_STRING.COUNTRY_LANGUAGE_ID] == countryLanguageId);
                //if (rulesOfThisCountryId && rulesOfThisCountryId.Rules && rulesOfThisCountryId.Rules.length) {
                //    this.countryBlackListItem[countryLanguageId] = [];

                //    let rules = rulesOfThisCountryId.Rules[0].rules;
                //    if (rules) {
                //        rules.forEach(rule => {
                //            const rs = this.blackListGrid.getCurrentNodeItems().find(p => p[ID_STRING.ID_COLUMN_NAME] == rule.value[ID_STRING.ID_COLUMN_NAME]);
                //            if (rs) {
                //                rs.noExport = true;
                //                this.blackListGrid.updateRowData([rs]);
                //            }
                //            this.updateBlackListItemForCountry(countryLanguageId, rule.value[ID_STRING.ID_COLUMN_NAME], true);
                //        });
                //    }

                //    this.profileData = this.profileData.filter(p => p[ID_STRING.COUNTRY_LANGUAGE_ID] != countryLanguageId);

                //    this.emitAllTableEvents();

                //    this.validateBlacklistGrid();
                //    this.changeDetectorRef.detectChanges();
                //    return;
                //}
            }

            if (this.countryBlackListItem[countryLanguageId]) {
                let activeBlackListItems =
                    this.countryBlackListItem[countryLanguageId];
                activeBlackListItems.forEach((id) => {
                    const rs = this.blackListGrid
                        .getCurrentNodeItems()
                        .find((p) => p[ID_STRING.ID_COLUMN_NAME] == id);
                    if (rs) {
                        rs.noExport = true;
                        this.blackListGrid.updateRowData([rs]);
                    }
                });
                this.validateBlacklistGrid();
                this.changeDetectorRef.detectChanges();
                return;
            } else {
                this.ruleServiceSubscription = this.ruleService
                    .getProjectRules(
                        RuleEnum.Blacklist,
                        this.selectedEntity[camelCase(this.widgetListenKey)],
                        countryId
                    )
                    .subscribe((response: ApiResultResponse) => {
                        this.appErrorHandler.executeAction(() => {
                            if (!response) {
                                return;
                            }

                            if (
                                response.item &&
                                response.item.length &&
                                response.item[0][0]
                            ) {
                                let rulesFromService = response.item[0][0];
                                this.cacheData[countryId] =
                                    rulesFromService[
                                        ID_STRING.ID_SELECTION_PROJECT_RULES
                                    ];
                                let rules = Uti.tryParseJson(
                                    response.item[0][0].JsonCaseRules
                                ).rules;
                                rules.forEach((rule) => {
                                    const rs = this.blackListGrid
                                        .getCurrentNodeItems()
                                        .find(
                                            (p) =>
                                                p[ID_STRING.ID_COLUMN_NAME] ==
                                                rule.value[
                                                    ID_STRING.ID_COLUMN_NAME
                                                ]
                                        );
                                    if (rs) {
                                        rs.noExport = true;
                                        this.blackListGrid.updateRowData([rs]);
                                    }
                                    this.updateBlackListItemForCountry(
                                        countryLanguageId,
                                        rule.value[ID_STRING.ID_COLUMN_NAME],
                                        true
                                    );
                                });

                                this.validateBlacklistGrid();
                                this.changeDetectorRef.detectChanges();
                            }
                        });
                    });
            }

            this.changeDetectorRef.detectChanges();
        }
    }

    private processApplyProfile(rules, selectingCountry) {
        this.countryBlackListItem[
            selectingCountry[ID_STRING.COUNTRY_LANGUAGE_ID]
        ] = rules.map((rule) => rule.value.IdRepPersonStatus);

        rules.forEach((rule) => {
            const rs = this.blackListGrid
                .getCurrentNodeItems()
                .find(
                    (p) =>
                        p[ID_STRING.ID_COLUMN_NAME] ==
                        rule.value[ID_STRING.ID_COLUMN_NAME]
                );
            if (rs) {
                rs.noExport = true;
                this.blackListGrid.updateRowData([rs]);
            }
        });
    }

    /**
     * countrySelectionChanged
     * @param e
     */
    countrySelectionChanged() {
        this.loadBlackListFromSeletedCountry();
    }

    /**
     * updateBlackListItemForCountry
     * @param countryId
     * @param value
     */
    private updateBlackListItemForCountry(
        countryLanguageId,
        blackListId,
        checked
    ) {
        if (this.countryBlackListItem[countryLanguageId]) {
            const rs = this.countryBlackListItem[countryLanguageId].find(
                (p) => p == blackListId
            );
            if (!rs) {
                this.countryBlackListItem[countryLanguageId].push(blackListId);
            } else if (!checked) {
                this.countryBlackListItem[countryLanguageId] =
                    this.countryBlackListItem[countryLanguageId].filter(
                        (x) => x != blackListId
                    );
            }
        } else {
            this.countryBlackListItem[countryLanguageId] = [blackListId];
        }

        this.changeDetectorRef.detectChanges();
    }

    /**
     * onCheckboxExportChanged
     */
    onCheckboxExportChanged(item) {
        if (!item) {
            return;
        }

        if (this.showAllCountriesAffectWarning.whenUpdate) {
            this.modalService.alertMessage({
                message: [
                    {
                        key: "Modal_Message__All_Country_Checkbox_is_Checked_Affect",
                    },
                ],
            });

            this.showAllCountriesAffectWarning.whenUpdate = false;
        }

        let countryId;
        // Select All Checked
        if (this.isForAllCountry) {
            this.countryGrid.getGridData().forEach((country) => {
                if (item.noExport) {
                    if (
                        !this.countryBlackListItem[
                            country[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ]
                    ) {
                        this.countryBlackListItem[
                            country[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ] = [item[ID_STRING.ID_COLUMN_NAME]];
                    }

                    if (
                        this.countryBlackListItem[
                            country[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ].indexOf(item[ID_STRING.ID_COLUMN_NAME]) === -1
                    ) {
                        this.countryBlackListItem[
                            country[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ].push(item[ID_STRING.ID_COLUMN_NAME]);
                    }
                } else {
                    let idx = this.countryBlackListItem[
                        country[ID_STRING.COUNTRY_LANGUAGE_ID]
                    ].indexOf(item[ID_STRING.ID_COLUMN_NAME]);
                    if (idx !== -1) {
                        this.countryBlackListItem[
                            country[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ].splice(idx, 1);
                    }
                }
            });
        } else {
            if (this.countryGrid.selectedNode) {
                const dataItem = this.countryGrid.selectedNode.data;
                if (item.noExport) {
                    if (
                        !this.countryBlackListItem[
                            dataItem[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ]
                    ) {
                        this.countryBlackListItem[
                            dataItem[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ] = [item[ID_STRING.ID_COLUMN_NAME]];
                    }

                    if (
                        this.countryBlackListItem[
                            dataItem[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ].indexOf(item[ID_STRING.ID_COLUMN_NAME]) === -1
                    ) {
                        this.countryBlackListItem[
                            dataItem[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ].push(item[ID_STRING.ID_COLUMN_NAME]);
                    }
                } else {
                    let idx = this.countryBlackListItem[
                        dataItem[ID_STRING.COUNTRY_LANGUAGE_ID]
                    ].indexOf(item[ID_STRING.ID_COLUMN_NAME]);
                    if (idx !== -1) {
                        this.countryBlackListItem[
                            dataItem[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ].splice(idx, 1);
                    }
                }
            }
        }

        this.emitAllTableEvents();

        this.changeDetectorRef.detectChanges();
    }

    onAllCheckboxExportChanged(checked) {
        let blackListItems = this.blackListGrid.getCurrentNodeItems();
        blackListItems.forEach((item) => {
            this.onCheckboxExportChanged(item);
        });
    }

    onCheckAllChanged(value: boolean) {
        if (!this.isForAllCountry && value) {
            this.showAllCountriesAffectWarning.whenUpdate = true;
        } else {
            this.showAllCountriesAffectWarning.whenUpdate = false;
        }

        this.isForAllCountry = value;

        //if (this.selectAll) {
        //    if (this.blackListGrid) {
        //        this.blackListGrid.getCurrentNodeItems().forEach((item) => {
        //            item.noExport = false;
        //            this.blackListGrid.updateRowData([item]);
        //        })
        //    }
        //}
        //else {
        //    this.countryBlackListItem[ID_STRING.ID_SELECT_ALL] = [];
        //    this.loadBlackListFromSeletedCountry();
        //}

        this.changeDetectorRef.detectChanges();
    }

    public submit(callback?: any) {
        if (this.isValidationError()) {
            this.modalService.warningMessage([
                {
                    key: "Modal_Message__The_Value_You_Entered_Is_Not_Valid",
                },
            ]);
            return;
        }

        this.checkAllCountriesBeforeSubmit();

        this.ruleServiceSubscription = this.ruleService
            .saveProjectRules(this.createJsonData())
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    if (callback) {
                        callback();
                    }

                    this.reset();
                    this.store.dispatch(
                        this.processDataActions.saveWidgetSuccess(this.ofModule)
                    );
                    this.preloadData();
                    this.onSaveSuccess.emit();

                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    private checkAllCountriesBeforeSubmit() {
        if (this.isForAllCountry) {
            let selectingCountry = this.countryGrid.getSelectedNode().data;
            let mainData =
                this.countryBlackListItem[
                    selectingCountry[ID_STRING.COUNTRY_LANGUAGE_ID]
                ];
            Object.keys(this.countryBlackListItem).forEach(
                (idCountryLanguage) => {
                    if (
                        idCountryLanguage !=
                        selectingCountry[ID_STRING.COUNTRY_LANGUAGE_ID]
                    ) {
                        this.countryBlackListItem[idCountryLanguage] = mainData;
                    }
                }
            );
        }
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

    public reload() {
        this.reset();
        this.initCountryGridData(() => {
            this.loadBlackListFromSeletedCountry();
        });
    }

    private reset() {
        this.validationError = {};
        this.profileData = {};
        this.cacheData = {};
        this.countryBlackListItem = new CountryBlackListItem();

        this.changeDetectorRef.detectChanges();
    }

    public createJsonData() {
        return {
            IdSelectionWidget: RuleEnum.Blacklist,
            IdSelectionProject:
                this.selectedEntity[camelCase(this.widgetListenKey)],
            JsonRules: this.buildCountryRuleForSave(),
        };
    }

    public createJsonDataForProfile(): Observable<any> {
        return this.ruleService
            .getProjectRulesForTemplate(
                RuleEnum.Blacklist,
                this.selectedEntity[camelCase(this.widgetListenKey)]
            )
            .map((response: ApiResultResponse) => {
                let saveData = {
                    IdSelectionWidget: RuleEnum.Blacklist,
                    IdSelectionProject:
                        this.selectedEntity[camelCase(this.widgetListenKey)],
                    JsonRules: [],
                };

                //if (!response || !response.item || !response.item.length) {
                //    return null;
                //}

                //let allRules: any[] = response.item[0];

                if (!isEmpty(this.countryBlackListItem)) {
                    saveData.JsonRules.push({
                        //Rules: this.buildRules(this.cacheData[this.currentSelectedGridItem('countryGrid')[ID_STRING.COUNTRY_LANGUAGE_ID]].gridData.data, true),
                        Rules: [
                            {
                                IsActive: 1,
                                MediaCode:
                                    this.currentSelectedGridItem("countryGrid")[
                                        ID_STRING.MEDIACODE
                                    ],
                                rules: this.buildRuleForSave(
                                    this.countryBlackListItem[
                                        this.currentSelectedGridItem(
                                            "countryGrid"
                                        )[ID_STRING.COUNTRY_LANGUAGE_ID]
                                    ]
                                ),
                            },
                        ],
                    });
                }

                return saveData;
            });
    }

    private currentSelectedGridItem(gridObject): any {
        return Uti.mapArrayToObject(
            this[gridObject].selectedItem() || [],
            true
        );
    }

    private buildCountryRuleForSave() {
        let result: any[] = [];
        if (this.countryBlackListItem) {
            let keys = Object.keys(this.countryBlackListItem);
            for (let i = 0; i < keys.length; i++) {
                //if ((this.isForAllCountry && keys[i] != '0') || (!this.isForAllCountry && keys[i] == '0')) {
                //    continue;
                //}
                const countries = this.countryGrid.getCurrentNodeItems();
                const countryId = countries.find(
                    (c) => c[ID_STRING.COUNTRY_LANGUAGE_ID] == keys[i]
                )[ID_STRING.COUNTRY_ID];
                const mediaCode = countries.find(
                    (c) => c[ID_STRING.COUNTRY_LANGUAGE_ID] == keys[i]
                )[ID_STRING.MEDIACODE];
                if (this.countryBlackListItem[keys[i]].length || mediaCode) {
                    result.push({
                        IdSelectionProjectCountry: countryId,
                        //IdCountrylanguage: countryLanguageId,
                        Rules: [
                            {
                                IsActive: 1,
                                IdSelectionProjectRules:
                                    this.buildIdSelectionProjectRules(
                                        countryId
                                    ),
                                MediaCode: mediaCode,
                                rules: this.buildRuleForSave(
                                    this.countryBlackListItem[keys[i]]
                                ),
                            },
                        ],
                    });
                } else {
                    let idSelectionProjectRules =
                        this.buildIdSelectionProjectRules(countryId);
                    if (idSelectionProjectRules) {
                        result.push({
                            IdSelectionProjectCountry: countryId,
                            IdCountrylanguage: keys[i],
                            Rules: [
                                {
                                    IsDeleted: 1,
                                    IdSelectionProjectRules:
                                        idSelectionProjectRules,
                                },
                            ],
                        });
                    }
                }
            }
        }

        return result;
    }

    //private buildCountryRuleForSaveProfile(allRules: any[]) {
    //    let result: any[] = [];
    //    let ignoreCountryIds = [];
    //    if (this.countryBlackListItem) {
    //        let keys = Object.keys(this.countryBlackListItem);
    //        for (let i = 0; i < keys.length; i++) {
    //            if (keys[i] == '0') continue;
    //            const countryId = this.countryGrid.getCurrentNodeItems().find(c => c[ID_STRING.COUNTRY_LANGUAGE_ID] == keys[i])[ID_STRING.COUNTRY_ID];
    //            const mediaCode = this.countryGrid.getCurrentNodeItems().find(c => c[ID_STRING.COUNTRY_LANGUAGE_ID] == keys[i])[ID_STRING.MEDIACODE];
    //            if (this.countryBlackListItem[keys[i]].length || mediaCode) {
    //                result.push({
    //                    IdSelectionProjectCountry: countryId,
    //                    IdCountrylanguage: keys[i],
    //                    Rules: [
    //                        {
    //                            IsActive: 1,
    //                            IdSelectionProjectRules: this.buildIdSelectionProjectRules(countryId),
    //                            MediaCode: mediaCode,
    //                            rules: this.buildRuleForSave(this.countryBlackListItem[keys[i]])
    //                        }
    //                    ]
    //                });
    //            } else {
    //                result.push({
    //                    IdSelectionProjectCountry: countryId,
    //                    IdCountrylanguage: keys[i],
    //                    Rules: [
    //                        {
    //                            IsDeleted: 1,
    //                            IdSelectionProjectRules: this.buildIdSelectionProjectRules(countryId)
    //                        }
    //                    ]
    //                });
    //            }

    //            ignoreCountryIds.push(countryId);
    //        }
    //    }

    //    ignoreCountryIds.forEach(countryId => {
    //        allRules = allRules.filter(r => r[ID_STRING.COUNTRY_ID] != countryId);
    //    });

    //    let newCountryList = [];
    //    for (let i = 0; i < allRules.length; i++) {
    //        if (newCountryList.indexOf(allRules[i][ID_STRING.COUNTRY_ID]) === -1) {
    //            newCountryList.push(allRules[i][ID_STRING.COUNTRY_ID]);
    //        }
    //    }

    //    newCountryList.forEach(countryId => {
    //        result.push({
    //            IdSelectionProjectCountry: countryId,
    //            IdCountrylanguage: this.countryGrid.getCurrentNodeItems().find(c => c[ID_STRING.COUNTRY_ID] == countryId)[ID_STRING.COUNTRY_LANGUAGE_ID],
    //            Rules: this.buildRulesForHiddenCountry(allRules, countryId)
    //        });
    //    });

    //    return result;
    //}

    private buildIdSelectionProjectRules(countryId) {
        let result;
        if (this.cacheData.hasOwnProperty(countryId)) {
            result = this.cacheData[countryId];
        }

        return result;
    }

    private buildRuleForSave(ruleIds) {
        let result: any[] = [];
        ruleIds.forEach((ruleId) => {
            result.push({
                value: {
                    IdRepPersonStatus: ruleId,
                },
            });
        });

        return result;
    }

    private buildRulesForHiddenCountry(allRules, countryId) {
        let result = [];

        for (let i = 0; i < allRules.length; i++) {
            if (allRules[i][ID_STRING.COUNTRY_ID] == countryId) {
                result.push({
                    IsActive: 1,
                    IdSelectionProjectRules:
                        allRules[i][ID_STRING.ID_SELECTION_PROJECT_RULES],
                    MediaCode: !isNil(allRules[i].Mediacode)
                        ? allRules[i][ID_STRING.MEDIACODE]
                        : null,
                    rules: JSON.parse(allRules[i].JsonCaseRules).rules,
                });
            }
        }
        return result;
    }

    public dragEnd($event) {
        this.countryGrid.sizeColumnsToFit();
        this.blackListGrid.sizeColumnsToFit();

        this.splitterConfig = {
            leftHorizontal: this.horizontalSplit.areas[0].size,
            rightHorizontal: this.horizontalSplit.areas[1].size,
        };

        this.saveSplitterSettings();

        this.changeDetectorRef.detectChanges();
    }

    public onCountryGridEditEnded($event) {
        if (this.countryBlackListItem) {
            if (
                isNil(
                    this.countryBlackListItem[
                        $event[ID_STRING.COUNTRY_LANGUAGE_ID]
                    ]
                )
            ) {
                this.countryBlackListItem[
                    $event[ID_STRING.COUNTRY_LANGUAGE_ID]
                ] = [];
            }

            this.emitAllTableEvents();

            this.changeDetectorRef.detectChanges();
        }
    }

    public hasValidationErrorHandler($event, gridName) {
        this.validationError[gridName] = $event;
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

    private validateBlacklistGrid() {
        setTimeout(() => {
            let readOnly = this.checkBlacklistGridReadOnly();
            let disabled = this.checkBlacklistGridDisabled();

            if (
                readOnly !== this.isBlacklistGridReadOnly ||
                disabled !== this.isBlacklistGridDisabled
            ) {
                this.isBlacklistGridReadOnly = readOnly;
                this.isBlacklistGridDisabled = disabled;
                this.changeDetectorRef.detectChanges();

                if (this.blackListGrid) {
                    this.blackListGrid.refresh();
                }
            }
        }, 200);
    }
    public checkBlacklistGridReadOnly() {
        return (
            this.readOnly ||
            (this.countryGrid != null &&
                this.countryGrid.selectedNode != null &&
                !this.countryGrid.selectedNode.data["IsActive"])
        );
    }

    public checkBlacklistGridDisabled() {
        return (
            this.countryGrid != null &&
            this.countryGrid.selectedNode != null &&
            !this.countryGrid.selectedNode.data["IsActive"]
        );
    }
}
