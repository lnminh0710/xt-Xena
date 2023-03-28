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
    ControlGridColumnModel,
    ExtendedFilterRule,
    ApiResultResponse,
    MessageModel,
    GlobalSettingModel,
} from "app/models";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import camelCase from "lodash-es/camelCase";
import cloneDeep from "lodash-es/cloneDeep";
import omit from "lodash-es/omit";
import orderBy from "lodash-es/orderBy";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import {
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
import {
    QueryBuilderConfig,
    Rule,
    RuleSet,
} from "app/shared/components/xn-control/query-builder";
import {
    RuleEnum,
    MapFromWidgetAppToFilterId,
    GlobalSettingConstant,
    MessageModal,
} from "app/app.constants";
import { Uti } from "app/utilities";
import { GuidHelper } from "app/utilities/guild.helper";
import { QueryObject } from "app/app.constants";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as moduleSettingReducer from "app/state-management/store/reducer/module-setting";
import { XnAgGridComponent } from "../xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import { ColHeaderKey } from "../xn-control/xn-ag-grid/shared/ag-grid-constant";
import { SplitComponent } from "angular-split";

const ID_STRING = {
    COUNTRY_ID: "IdSelectionProjectCountry",
    COUNTRY_LANGUAGE_ID: "IdCountrylanguage",
    ID_SELECTION_PROJECT_RULES: "IdSelectionProjectRules",
    PRIORITY: "Priority",
    MEDIACODE: "MediaCode",
};

@Component({
    selector: "extended-filter-grid",
    templateUrl: "./extended-filter-grid.component.html",
    styleUrls: ["./extended-filter-grid.component.scss"],
})
export class ExtendedFilterGridComponent
    extends BaseComponent
    implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
    public listComboBox: any = {};
    public showDialog = false;
    public countryGridData: any;
    public filterGridData: any;
    public perfectScrollbarConfig: any = {};
    public isApplyDisabled = false;
    public isReadOnly;
    public isFilterGridReadOnly = true;
    public isFilterGridDisabled = true;
    public columnsLayoutSettings: any = {};
    public splitterConfig = {
        leftHorizontal: 25,
        rightHorizontal: 75,
    };
    private widgetListenKey = null;
    private selectedEntity: any = null;
    private selectedFilterRow;
    private cacheData: any = {};
    private cacheDataForAllCountry: any = [];
    private deletedRule: any = {};
    private profileData: any = null;
    private dialogMode = "view";
    private validationError = {};
    private isForAllCountry: boolean = false;
    private showCountriesUpdatedWarning = false;
    private template; // = '{"ruleItem":[{"key":"condition","controlType":"dropdown","label":"Condition","value":"AND","options":[{"key":"AND","value":"AND"},{"key":"OR","value":"OR"},{"key":"NOT","value":"NOT"},{"key":"BETWEEN","value":"BETWEEN"}],"children":[]},{"key":"filterName","controlType":"dropdown","label":"Filter Name","value":"ZipCode","options":[{"key":"ZipCode","value":"ZipCode"},{"key":"Ort","value":"Ort"}],"children":[]},{"key":"operator","controlType":"dropdown","label":"Operator","value":">","options":[{"key":">","value":">"},{"key":"<","value":"<"},{"key":">=","value":">="},{"key":"<=","value":"<="}],"children":[]},{"key":"value","controlType":"textbox","label":"Value","value":"","children":[]}]}';
    private showAllCountriesAffectWarning = {
        whenDelete: false,
        whenUpdate: false,
    };

    private queryOriginal = {
        //condition: 'AND',
        rules: [{ field: "extended", value: "" }],
    };
    public query = {
        //condition: 'AND',
        rules: [{ field: "extended", value: "" }],
    };

    public config: QueryBuilderConfig = null;

    @ViewChild("countryGrid") countryGrid: XnAgGridComponent;
    @ViewChild("filterGrid") filterGrid: XnAgGridComponent;
    @ViewChild("horizontalSplit") horizontalSplit: SplitComponent;

    @Input() readOnly = true;
    @Input() countryGridId: string;
    @Input() filterGridId: string;
    @Input() idRepWidgetApp = null;
    @Input() globalProperties: any[] = [];

    private _defaultMode: boolean = true;
    @Input() set defaultMode(value: boolean) {
        this._defaultMode = value;
        if (!this._defaultMode) {
            this.loadTemplateRule();
        } else {
            this.config = {
                fields: {
                    extended: {
                        name: "Extended Filter",
                        type: "extended-filter",
                        template: "",
                    },
                },
            };
        }
    }

    get defaultMode() {
        return this._defaultMode;
    }

    @Output() onGridEditStart = new EventEmitter<any>();
    @Output() onGridEditEnd = new EventEmitter<any>();
    @Output() onGridEditSuccess = new EventEmitter<any>();
    @Output() onSaveSuccess = new EventEmitter<any>();
    @Output() onCountrySelectionChanged = new EventEmitter<any>();
    @Output() onDeleteColumnClick = new EventEmitter<any>();

    private selectedEntityState: Observable<any>;
    private widgetListenKeyState: Observable<string>;
    private requestSaveWidgetState: Observable<any>;
    private requestLoadProfileState: Observable<any>;
    private selectionCountriesAreUpdatedState: Observable<any>;
    private isAllpliedForAllCountry = false;

    private selectedEntityStateSubscription: Subscription;
    private widgetListenKeyStateSubscription: Subscription;
    private countrySelectionServiceSubscription: Subscription;
    private blacklistServiceSubscription: Subscription;
    private ruleServiceSubscription: Subscription;
    private requestSaveWidgetStateSubscription: Subscription;
    private requestLoadProfileStateSubscription: Subscription;
    private getComboBoxForRuleBuilderSubscription: Subscription;
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
        private globalSettingService: GlobalSettingService,
        private globalSettingConstant: GlobalSettingConstant,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router,
        private changeDetectorRef: ChangeDetectorRef
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
        this.filterGridData = {
            data: [],
            columns: this.initFilterGridSetting(),
        };

        this.loadColumnLayoutSettings();
        setTimeout(() => {
            this.loadSplitterSettings();
        }, 200);

        this._subscribeWidgetListenKeyState();
        this._subscribeSelectedEntityState();
        this._subscribeRequestSaveWidgetState();
        this._subscribeRequestLoadProfileState();
        this._subscribeSelectionCountriesAreUpdatedState();
        this.getComboBoxForRuleBuilder();

        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false,
        };

        this.changeDetectorRef.detectChanges();
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        Uti.unsubscribe(this);
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

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["readOnly"]) {
            this.validateFilterGrid();
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

    private loadRulesByCountry(countryId, countryLanguageId) {
        return this.ruleService
            .getProjectRules(
                RuleEnum.ExtendedRules,
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
            observableBatch.push(
                this.loadRulesByCountry(
                    country[ID_STRING.COUNTRY_ID],
                    country[ID_STRING.COUNTRY_LANGUAGE_ID]
                )
            );
        });

        Observable.forkJoin(observableBatch)
            .finally(() => {
                this.changeDetectorRef.detectChanges();
            })
            .subscribe((results: Array<any>) => {
                results.forEach((result) => {
                    if (!result.item) {
                        this.cacheData[result.countryLanguageId] = {
                            gridData: {
                                data: [],
                                columns: this.initFilterGridSetting(),
                            },
                            isDirty: false,
                        };
                        return;
                    }

                    let filterRawData = [];
                    let rulesFromService = result.item[0];

                    rulesFromService.forEach((rfs) => {
                        filterRawData.push({
                            DT_RowId: GuidHelper.generateGUID(),
                            IdSelectionProjectCountry: result.countryId,
                            IdCountrylanguage: result.countryLanguageId,
                            IdSelectionProjectRules:
                                rfs[ID_STRING.ID_SELECTION_PROJECT_RULES],
                            Priority: rfs[ID_STRING.PRIORITY],
                            MediaCode: rfs[ID_STRING.MEDIACODE],
                            value: this.appendRuleIdToJsonCaseRules(
                                rfs.JsonCaseRules,
                                rfs[ID_STRING.ID_SELECTION_PROJECT_RULES]
                            ).jsonObject,
                            rawData: this.appendRuleIdToJsonCaseRules(
                                rfs.JsonCaseRules,
                                rfs[ID_STRING.ID_SELECTION_PROJECT_RULES]
                            ).jsonString,
                        });
                    });

                    filterRawData = this.formatFilterRawData(filterRawData);

                    let filterGridData = {
                        data: this.setCacheDataOfAllCountry(filterRawData),
                        columns: this.initFilterGridSetting(),
                    };

                    this.cacheData[result.countryLanguageId] = {
                        gridData: cloneDeep(filterGridData),
                        isDirty: false,
                    };
                });

                setTimeout(() => {
                    this.countryGrid.selectRowIndex(0);
                }, 200);
            });
    }

    /**
     * loadTemplateRule
     */
    private loadTemplateRule() {
        this.globalSettingService
            .getAllGlobalSettings(-1)
            .finally(() => {
                this.config = {
                    fields: {
                        extended: {
                            name: "Extended Filter",
                            type: "extended-filter",
                            template: this.template,
                        },
                    },
                };

                this.changeDetectorRef.detectChanges();
            })
            .subscribe(
                (data) => this.loadTemplateFromSettingSuccess(data),
                (error) => this.loadTemplateFromSettingError(error)
            );
    }

    /**
     * loadTemplateFromSettingSuccess
     * @param data
     */
    private loadTemplateFromSettingSuccess(data: Array<any>) {
        if (data && data.length) {
            let setting = data.find(
                (p) =>
                    p.globalName ==
                    this.globalSettingConstant.extendedFilterTemplate
            );
            if (setting) {
                this.template = setting.jsonSettings;
            }

            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * loadTemplateFromSettingError
     * @param error
     */
    private loadTemplateFromSettingError(error) {
        this.template = "";

        this.changeDetectorRef.detectChanges();
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

                    //if (this.countryGrid) {
                    //    this.countryGrid.flex.select(new wjcGrid.CellRange(-1, -1, -1, -1));
                    //}

                    if (this.filterGrid) {
                        let columns = this.filterGridData.columns;
                        this.filterGridData = null;
                        this.filterGridData = {
                            columns: columns,
                            data: [],
                        };
                    }

                    if (isEqual(this.selectedEntity, selectedEntityState)) {
                        return;
                    }

                    this.selectedEntity = selectedEntityState;
                    this.profileData = null;
                    this.cacheData = {};
                    this.isAllpliedForAllCountry = false;
                    this.cacheDataForAllCountry = [];

                    this.initCountryGridData();

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

    private getComboBoxForRuleBuilder() {
        this.getComboBoxForRuleBuilderSubscription = this.ruleService
            .getComboBoxForRuleBuilder(QueryObject.ExtendRules)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.length ||
                        isNil(response.item[1])
                    ) {
                        this.listComboBox = {};

                        this.changeDetectorRef.detectChanges();
                        return;
                    }
                    let data = {};
                    // build data for rule combobox
                    // 1. For logicalOperator data
                    data["LogicalOperatores"] = response.item[0];
                    // 2. For type data
                    data["Types"] = response.item[1];
                    // 3. For comparasion data
                    data["Operatores"] = response.item[2];

                    this.listComboBox = data;

                    this.changeDetectorRef.detectChanges();
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
            //if (this.filterGridData) {
            //    this.filterGridData = null;
            //    this.filterGridData = {
            //        data: [],
            //        columns: this.initFilterGridSetting()
            //    };
            //}

            this.loadFilterFromSeletedCountry();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * initCountryGridData
     */
    private initCountryGridData(callBack?: any) {
        this.countrySelectionServiceSubscription = this.countrySelectionService
            .getSelectionProjectCountry(
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

                    response.item[1] = response.item[1].filter((item) => {
                        return (
                            typeof item[ID_STRING.COUNTRY_LANGUAGE_ID] !==
                            "object"
                        );
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
                        hasCountrySelectAll: true,
                    };

                    tableData = this.datatableService.buildWijmoDataSource(
                        tableData,
                        config
                    );

                    this.countryGridData = tableData;
                    if (callBack) {
                        callBack();
                    }

                    setTimeout(() => {
                        //this.countryGrid.selectRowIndex(0);
                        this.preloadData();
                    }, 200);

                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    private loadFilterFromSeletedCountry(forceLoadFromService?: boolean) {
        if (this.countryGrid && this.countryGrid.selectedNode) {
            const item = this.countryGrid.selectedNode.data;
            const countryId = item[ID_STRING.COUNTRY_ID];
            const countryLanguageId = item[ID_STRING.COUNTRY_LANGUAGE_ID];

            if (this.filterGridData) {
                this.filterGridData = null;
                this.filterGridData = {
                    data: [],
                    columns: this.initFilterGridSetting(),
                };
            }

            if (!countryId) {
                this.validateFilterGrid();
                this.changeDetectorRef.detectChanges();
                return;
            }
            // load data from profile
            if (
                !forceLoadFromService &&
                this.profileData &&
                this.profileData.length
            ) {
                let profile = this.profileData[0];
                let rules = profile.Rules;
                if (rules) {
                    let selectingCountry =
                        this.countryGrid.getSelectedNode().data;
                    if (this.isForAllCountry) {
                        this.countryGrid.getGridData().forEach((country) => {
                            this.processApplyProfile(
                                rules,
                                country,
                                selectingCountry
                            );
                        });
                    } else {
                        this.processApplyProfile(
                            rules,
                            selectingCountry,
                            selectingCountry
                        );
                    }
                }

                this.profileData = [];
                this.validateFilterGrid();
                this.onTableEditSuccess();
                this.changeDetectorRef.detectChanges();
                return;
            }

            // load data from cached
            if (!forceLoadFromService && this.cacheData[countryLanguageId]) {
                //this.cacheData[countryLanguageId].gridData.data = this.cacheData[countryLanguageId].gridData.data.filter(dt => !dt.willDelete);
                //this.filterGridData = this.addMoreCachedDataWithAllCountryFromOtherItemAdded(cloneDeep(this.cacheData[countryLanguageId].gridData));
                this.filterGridData = {
                    data: this.cacheData[
                        countryLanguageId
                    ].gridData.data.filter((dt) => !dt.willDelete),
                    columns: this.initFilterGridSetting(),
                };
                this.validateFilterGrid();
            }
            // load data from service when data is empty
            else {
                this.ruleServiceSubscription = this.ruleService
                    .getProjectRules(
                        RuleEnum.ExtendedRules,
                        this.selectedEntity[camelCase(this.widgetListenKey)],
                        countryId
                    )
                    .subscribe((response: ApiResultResponse) => {
                        this.appErrorHandler.executeAction(() => {
                            if (
                                !response ||
                                !response.item ||
                                !response.item.length
                            ) {
                                if (this.cacheData) {
                                    delete this.cacheData[countryLanguageId];
                                }
                                if (
                                    this.profileData &&
                                    this.profileData.length
                                ) {
                                    this.profileData = this.profileData.filter(
                                        (p) =>
                                            p[ID_STRING.COUNTRY_LANGUAGE_ID] !=
                                            countryLanguageId
                                    );
                                }

                                this.filterGridData = {
                                    data: this.setCacheDataOfAllCountry([]),
                                    columns: this.filterGridData.columns,
                                };

                                this.cacheData[countryLanguageId] = {
                                    gridData: cloneDeep(this.filterGridData),
                                    isDirty: false,
                                };

                                this.validateFilterGrid();
                                this.changeDetectorRef.detectChanges();
                                return;
                            }

                            let filterRawData = [];
                            let rulesFromService = response.item[0];

                            rulesFromService.forEach((rfs) => {
                                filterRawData.push({
                                    DT_RowId: GuidHelper.generateGUID(),
                                    IdSelectionProjectCountry: countryId,
                                    IdCountrylanguage: countryLanguageId,
                                    IdSelectionProjectRules:
                                        rfs[
                                            ID_STRING.ID_SELECTION_PROJECT_RULES
                                        ],
                                    Priority: rfs[ID_STRING.PRIORITY],
                                    MediaCode: rfs[ID_STRING.MEDIACODE],
                                    value: this.appendRuleIdToJsonCaseRules(
                                        rfs.JsonCaseRules,
                                        rfs[
                                            ID_STRING.ID_SELECTION_PROJECT_RULES
                                        ]
                                    ).jsonObject,
                                    rawData: this.appendRuleIdToJsonCaseRules(
                                        rfs.JsonCaseRules,
                                        rfs[
                                            ID_STRING.ID_SELECTION_PROJECT_RULES
                                        ]
                                    ).jsonString,
                                });
                            });
                            filterRawData =
                                this.formatFilterRawData(filterRawData);

                            this.filterGridData = {
                                data: this.setCacheDataOfAllCountry(
                                    filterRawData
                                ),
                                columns: this.initFilterGridSetting(),
                            };

                            this.cacheData[countryLanguageId] = {
                                gridData: cloneDeep(this.filterGridData),
                                isDirty: false,
                            };

                            this.validateFilterGrid();
                            this.onTableEditSuccess();
                            this.changeDetectorRef.detectChanges();
                        });
                    });
            }

            this.changeDetectorRef.detectChanges();
        }
    }

    private processApplyProfile(rules, country, selectingCountry) {
        let filterRawData = [];
        rules.forEach((rfs) => {
            filterRawData.push({
                DT_RowId: GuidHelper.generateGUID(),
                IdSelectionProjectCountry: country[ID_STRING.COUNTRY_ID],
                IdCountrylanguage: country[ID_STRING.COUNTRY_LANGUAGE_ID],
                IdSelectionProjectRules:
                    rfs[ID_STRING.ID_SELECTION_PROJECT_RULES],
                Priority: rfs[ID_STRING.PRIORITY],
                MediaCode: rfs[ID_STRING.MEDIACODE],
                BoolOp: rfs.BoolOp,
                FieldName: rfs.FieldName,
                Operator: rfs.Operator,
                Value: rfs.Value,
                value: rfs,
                rawData: JSON.stringify(rfs),
                willDelete: rfs.IsDeleted,
            });
        });
        let data = this.formatFilterRawData(filterRawData);

        let currentData =
            this.cacheData[country[ID_STRING.COUNTRY_LANGUAGE_ID]].gridData
                .data;
        currentData.forEach((dt) => {
            dt.willDelete = true;
        });

        let newData = currentData.concat(data);

        if (
            country[ID_STRING.COUNTRY_LANGUAGE_ID] ==
            selectingCountry[ID_STRING.COUNTRY_LANGUAGE_ID]
        ) {
            this.filterGridData = {
                data: newData.filter((dt) => !dt.willDelete),
                columns: this.initFilterGridSetting(),
            };
        }

        this.cacheData[country[ID_STRING.COUNTRY_LANGUAGE_ID]] = {
            gridData: {
                data: cloneDeep(newData),
                columns: this.initFilterGridSetting(),
            },
            isDirty: true,
        };
    }

    private setCacheDataOfAllCountry(filterRawData: any) {
        // Add item of All Country
        if (this.cacheDataForAllCountry && this.cacheDataForAllCountry.length) {
            filterRawData = filterRawData.concat(this.cacheDataForAllCountry);
        }
        return filterRawData;
    }

    private addMoreCachedDataWithAllCountryFromOtherItemAdded(
        currentData: any
    ): any {
        let newData = [];
        if (currentData && currentData.data && currentData.data.length) {
            for (let item of this.cacheDataForAllCountry) {
                const currentItem = currentData.data.find(
                    (x) => x.DT_RowId === item.DT_RowId
                );
                if (!currentItem || !currentItem.DT_RowId) {
                    newData.push(cloneDeep(item));
                }
            }
            currentData.data = currentData.data.concat(cloneDeep(newData));
        } else {
            currentData.data = cloneDeep(this.cacheDataForAllCountry);
        }
        return currentData;
    }

    private appendRuleIdToJsonCaseRules(
        jsonCaseRules,
        idSelectionProjectRules
    ) {
        let jsonObject = Uti.tryParseJson(jsonCaseRules);
        jsonObject[ID_STRING.ID_SELECTION_PROJECT_RULES] =
            idSelectionProjectRules;

        return {
            jsonString: JSON.stringify(jsonObject),
            jsonObject: jsonObject,
        };
    }

    /**
     * formatExtenedFilterRawData
     */
    private formatFilterRawData(filterRawData) {
        let filterData = [];
        filterRawData.forEach((item) => {
            let ruleSet: RuleSet = item.value;
            if (ruleSet && ruleSet.rules) {
                const isExtended = ruleSet.rules.length > 1;
                let rule: any = ruleSet.rules[0];
                if (rule) {
                    const filterRule: ExtendedFilterRule = rule.value;
                    filterData.push({
                        DT_RowId: item.DT_RowId,
                        IdSelectionProjectCountry: item[ID_STRING.COUNTRY_ID],
                        IdCountrylanguage: item[ID_STRING.COUNTRY_LANGUAGE_ID],
                        IdSelectionProjectRules:
                            item[ID_STRING.ID_SELECTION_PROJECT_RULES],
                        BoolOp: filterRule.boolOp,
                        FieldName: filterRule.filterName,
                        Operator: filterRule.operator,
                        Value: filterRule.value,
                        Priority:
                            typeof item[ID_STRING.PRIORITY] === "object"
                                ? ""
                                : item[ID_STRING.PRIORITY],
                        MediaCode:
                            typeof item[ID_STRING.MEDIACODE] === "object"
                                ? ""
                                : item[ID_STRING.MEDIACODE],
                        FilterExtended: isExtended,
                        Delete: "",
                        Edit: "",
                        rawData: item.rawData,
                        willDelete: item.willDelete,
                    });
                }
            } else {
                filterData.push({
                    DT_RowId: item.DT_RowId,
                    IdSelectionProjectCountry: item[ID_STRING.COUNTRY_ID],
                    IdCountrylanguage: item[ID_STRING.COUNTRY_LANGUAGE_ID],
                    IdSelectionProjectRules:
                        item[ID_STRING.ID_SELECTION_PROJECT_RULES],
                    willDelete: item.willDelete,
                });
            }
        });

        filterData = orderBy(
            filterData,
            [ID_STRING.ID_SELECTION_PROJECT_RULES],
            ["asc"]
        );

        return filterData;
    }

    /**
     * initExtendedFilterGridSetting
     */
    private initFilterGridSetting(): ControlGridColumnModel[] {
        const colSetting = [
            new ControlGridColumnModel({
                title: "DT_RowId",
                data: "DT_RowId",
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                Hidden: "1",
                            },
                        },
                    ],
                },
            }),
            new ControlGridColumnModel({
                title: ID_STRING.COUNTRY_ID,
                data: ID_STRING.COUNTRY_ID,
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                Hidden: "1",
                            },
                        },
                    ],
                },
            }),
            new ControlGridColumnModel({
                title: ID_STRING.COUNTRY_LANGUAGE_ID,
                data: ID_STRING.COUNTRY_LANGUAGE_ID,
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                Hidden: "1",
                            },
                        },
                    ],
                },
            }),
            new ControlGridColumnModel({
                title: ID_STRING.ID_SELECTION_PROJECT_RULES,
                data: ID_STRING.ID_SELECTION_PROJECT_RULES,
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                Hidden: "1",
                            },
                        },
                    ],
                },
            }),
            new ControlGridColumnModel({
                title: "Field Name",
                data: "FieldName",
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            }),
            new ControlGridColumnModel({
                title: "Operator",
                data: "Operator",
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            }),
            new ControlGridColumnModel({
                title: "Value",
                data: "Value",
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            }),
            new ControlGridColumnModel({
                title: ID_STRING.PRIORITY,
                data: ID_STRING.PRIORITY,
                readOnly: false,
                setting: {
                    Setting: [
                        {
                            ControlType: {
                                Type: "Priority",
                            },
                        },
                    ],
                },
            }),
            new ControlGridColumnModel({
                title: ID_STRING.MEDIACODE,
                data: ID_STRING.MEDIACODE,
                readOnly: false,
                visible: true,
                setting: {
                    Setting: [
                        {
                            Validation: {
                                IsUniqued: "1",
                                ErrorMessage:
                                    "Can not input duplicate MediaCode",
                            },
                        },
                    ],
                },
            }),
            new ControlGridColumnModel({
                title: "Extended",
                data: "FilterExtended",
            }),
            new ControlGridColumnModel({
                title: "Delete",
                data: "Delete",
            }),
            new ControlGridColumnModel({
                title: "Edit",
                data: "Edit",
            }),
            new ControlGridColumnModel({
                title: "rawData",
                data: "rawData",
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                Hidden: "1",
                            },
                        },
                    ],
                },
            }),
        ];
        return colSetting;
    }

    public onCheckAllChanged(value: boolean) {
        if (!this.isForAllCountry && value) {
            this.showAllCountriesAffectWarning.whenDelete = true;
            this.showAllCountriesAffectWarning.whenUpdate = true;
        } else {
            this.showAllCountriesAffectWarning.whenDelete = false;
            this.showAllCountriesAffectWarning.whenUpdate = false;
        }

        this.isForAllCountry = value;

        this.changeDetectorRef.detectChanges();
    }

    public deleteRule(isForAllCountry?: boolean) {
        this.modalService.confirmMessageHtmlContent(
            new MessageModel({
                headerText: "Delete Rule",
                messageType: MessageModal.MessageType.error,
                message: [
                    { key: "<p>" },
                    {
                        key: "Modal_Message__Do_You_Want_To_Delete_Selected_Rule",
                    },
                    { key: "</p>" },
                ],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    //if (this.filterGrid && this.filterGrid.getCurrentNodeItems().length) {
                    //    let deletedItems: any[] = this.filterGrid.getCurrentNodeItems().filter(x => x[ColHeaderKey.IsDeleted]);
                    //    if (deletedItems.length) {
                    //        deletedItems.forEach((item) => {
                    //            this.onDeleteRule(item, isForAllCountry);
                    //        });
                    //    }
                    //}

                    this.onDeleteRuleNew();
                },
            })
        );
    }

    private onDeleteRule(deletedItem, isForAllCountry?: boolean) {
        if (this.filterGridData) {
            let willDeletedItemIndex = this.filterGrid
                .getCurrentNodeItems()
                .findIndex(
                    (dt) =>
                        dt["DT_RowId"] == deletedItem["DT_RowId"] ||
                        dt[ID_STRING.ID_SELECTION_PROJECT_RULES] ==
                            deletedItem[ID_STRING.ID_SELECTION_PROJECT_RULES]
                );
            if (willDeletedItemIndex !== -1) {
                let newData = cloneDeep(this.filterGrid.getCurrentNodeItems());
                newData.splice(willDeletedItemIndex, 1);
                this.filterGridData = null;
                this.filterGridData = {
                    data: newData,
                    columns: this.initFilterGridSetting(),
                };
            }
        }
        if (this.cacheData) {
            if (isForAllCountry) {
                Object.keys(this.cacheData).forEach((countryId) => {
                    let selectingCountryItem = this.cacheData[countryId];
                    selectingCountryItem.isDirty = true;

                    let willDeletedItemIndex =
                        selectingCountryItem.gridData.data.findIndex(
                            (dt) =>
                                dt["DT_RowId"] == deletedItem["DT_RowId"] ||
                                dt[ID_STRING.ID_SELECTION_PROJECT_RULES] ==
                                    deletedItem[
                                        ID_STRING.ID_SELECTION_PROJECT_RULES
                                    ] ||
                                dt[ColHeaderKey.Delete] ||
                                dt[ColHeaderKey.IsDeleted]
                        );
                    if (willDeletedItemIndex !== -1) {
                        if (
                            selectingCountryItem.gridData.data[
                                willDeletedItemIndex
                            ][ID_STRING.ID_SELECTION_PROJECT_RULES]
                        ) {
                            selectingCountryItem.gridData.data[
                                willDeletedItemIndex
                            ]["willDelete"] = true;
                        } else {
                            selectingCountryItem.gridData.data.splice(
                                willDeletedItemIndex,
                                1
                            );
                        }
                    }
                });
            } else {
                let selectingCountryItem =
                    this.cacheData[
                        this.countryGrid.selectedNode.data[
                            ID_STRING.COUNTRY_LANGUAGE_ID
                        ]
                    ];
                selectingCountryItem.isDirty = true;

                let willDeletedItemIndex =
                    selectingCountryItem.gridData.data.findIndex(
                        (dt) =>
                            dt["DT_RowId"] == deletedItem["DT_RowId"] ||
                            dt[ID_STRING.ID_SELECTION_PROJECT_RULES] ==
                                deletedItem[
                                    ID_STRING.ID_SELECTION_PROJECT_RULES
                                ] ||
                            dt[ColHeaderKey.Delete] ||
                            dt[ColHeaderKey.IsDeleted]
                    );
                if (willDeletedItemIndex !== -1) {
                    if (
                        selectingCountryItem.gridData.data[
                            willDeletedItemIndex
                        ][ID_STRING.ID_SELECTION_PROJECT_RULES]
                    ) {
                        selectingCountryItem.gridData.data[
                            willDeletedItemIndex
                        ]["willDelete"] = true;
                    } else {
                        selectingCountryItem.gridData.data.splice(
                            willDeletedItemIndex,
                            1
                        );
                    }
                }
            }
        }

        setTimeout(() => {
            this.filterGrid.refresh();
            this.emitAllTableEvents();
            this.changeDetectorRef.detectChanges();
        }, 200);

        this.emitAllTableEvents();
    }

    private onDeleteRuleNew() {
        if (this.filterGrid) {
            this.filterGrid.getGridData().forEach((dt) => {
                if (dt[ColHeaderKey.Delete] || dt[ColHeaderKey.IsDeleted]) {
                    this.filterGrid.deleteRowByRowId(dt.DT_RowId);
                }
            });
        }

        if (this.cacheData) {
            Object.keys(this.cacheData).forEach((countryId) => {
                let selectingCountryItem = this.cacheData[countryId];
                selectingCountryItem.isDirty = true;

                selectingCountryItem.gridData.data.forEach((dt, idx) => {
                    if (dt[ColHeaderKey.Delete] || dt[ColHeaderKey.IsDeleted]) {
                        if (dt[ID_STRING.ID_SELECTION_PROJECT_RULES]) {
                            dt["willDelete"] = true;
                        } else {
                            selectingCountryItem.gridData.data.splice(idx, 1);
                        }
                    }
                });
            });
        }

        setTimeout(() => {
            this.filterGrid.refresh();
            //this.deleteColumnClick();
            this.emitAllTableEvents();
            //this.onDeleteColumnClick.emit(0);
            this.changeDetectorRef.detectChanges();
        }, 200);
    }

    public deleteColumnClick($event?: any) {
        if (!$event) {
            return;
        }
        if (this.showAllCountriesAffectWarning.whenDelete) {
            this.modalService.alertMessage({
                message: [
                    {
                        key: "Modal_Message__All_Country_Checkbox_is_Checked_Affect",
                    },
                ],
            });
        }
        this.showAllCountriesAffectWarning.whenDelete = false;

        if (this.isForAllCountry) {
            let allCountries = this.countryGrid.getGridData();
            allCountries.forEach((country) => {
                if (
                    country[ID_STRING.COUNTRY_LANGUAGE_ID] !=
                    $event[ID_STRING.COUNTRY_LANGUAGE_ID]
                ) {
                    this.cacheData[
                        country[ID_STRING.COUNTRY_LANGUAGE_ID]
                    ].isDirty = true;

                    let found = this.cacheData[
                        country[ID_STRING.COUNTRY_LANGUAGE_ID]
                    ].gridData.data.find((dt) => {
                        return isEqual(
                            omit(JSON.parse($event.rawData), [
                                ID_STRING.ID_SELECTION_PROJECT_RULES,
                                ID_STRING.PRIORITY,
                                ID_STRING.MEDIACODE,
                            ]),
                            omit(JSON.parse(dt.rawData), [
                                ID_STRING.ID_SELECTION_PROJECT_RULES,
                                ID_STRING.PRIORITY,
                                ID_STRING.MEDIACODE,
                            ])
                        );
                    });
                    if (found) {
                        found[ColHeaderKey.IsDeleted] =
                            $event[ColHeaderKey.IsDeleted];
                        found[ColHeaderKey.Delete] =
                            $event[ColHeaderKey.Delete];
                    }
                }
            });
        } else {
            this.cacheData[$event[ID_STRING.COUNTRY_LANGUAGE_ID]].isDirty =
                true;
            let found = this.cacheData[
                $event[ID_STRING.COUNTRY_LANGUAGE_ID]
            ].gridData.data.find((dt) => dt.DT_RowId == $event.DT_RowId);
            if (found) {
                found[ColHeaderKey.IsDeleted] = $event[ColHeaderKey.IsDeleted];
                found[ColHeaderKey.Delete] = $event[ColHeaderKey.Delete];
            }
        }

        let deleteCount = 0;
        let allCountries = this.countryGrid.getGridData();
        allCountries.forEach((country) => {
            deleteCount += this.cacheData[
                country[ID_STRING.COUNTRY_LANGUAGE_ID]
            ].gridData.data.filter((x) => x[ColHeaderKey.IsDeleted]).length;
        });

        this.onDeleteColumnClick.emit(deleteCount);
    }

    public onEditClick($event, type) {
        if ($event) {
            if (this.showAllCountriesAffectWarning.whenUpdate) {
                this.modalService.alertMessage({
                    message: [
                        {
                            key: "Modal_Message__All_Country_Checkbox_is_Checked_Affect",
                        },
                    ],
                });
            }
            this.showAllCountriesAffectWarning.whenUpdate = false;

            this.selectedFilterRow = $event;
            this.query = JSON.parse(this.selectedFilterRow.rawData);
            this.queryOriginal = JSON.parse(this.selectedFilterRow.rawData);

            this.showDialog = true;
            this.dialogMode = "edit";
            this.isReadOnly = false;
            if (type == "FilterExtended") {
                this.isReadOnly = true;
            }

            this.isApplyDisabled = false;

            this.changeDetectorRef.detectChanges();
        }
    }

    public cancel() {
        this.isForAllCountry = this.isAllpliedForAllCountry;
        this.query = cloneDeep(this.queryOriginal);
        this.showDialog = false;
        this.dialogMode = "view";

        this.changeDetectorRef.detectChanges();
    }

    public apply() {
        setTimeout(() => {
            this.queryOriginal = cloneDeep(this.query);
            if (this.dialogMode === "edit") {
                this.processEditRule();
            } else if (this.dialogMode === "new") {
                this.processNewRule(this.isForAllCountry);
                this.isAllpliedForAllCountry = this.isForAllCountry;
            }
            this.emitAllTableEvents();
            this.showDialog = false;
            this.selectedFilterRow = null;

            this.changeDetectorRef.detectChanges();
        }, 500);
    }

    public newRule(isForAllCountry?: boolean) {
        if (isForAllCountry !== undefined)
            this.isForAllCountry = isForAllCountry;
        this.showDialog = true;
        this.dialogMode = "new";

        this.query = {
            //condition: 'AND',
            rules: [{ field: "extended", value: "" }],
        };
        this.queryOriginal = {
            //condition: 'AND',
            rules: [{ field: "extended", value: "" }],
        };

        this.isApplyDisabled = true;

        this.changeDetectorRef.detectChanges();
    }

    private processEditRule() {
        let editData: any = {
            DT_RowId: this.selectedFilterRow.DT_RowId,
            IdSelectionProjectCountry:
                this.selectedFilterRow[ID_STRING.COUNTRY_ID],
            IdCountrylanguage:
                this.selectedFilterRow[ID_STRING.COUNTRY_LANGUAGE_ID],
            IdSelectionProjectRules:
                this.selectedFilterRow[ID_STRING.ID_SELECTION_PROJECT_RULES],
            Priority: this.selectedFilterRow[ID_STRING.PRIORITY],
            MediaCode: this.selectedFilterRow[ID_STRING.MEDIACODE],
            value: this.query,
            rawData: JSON.stringify(this.query),
        };

        editData = this.formatFilterRawData([editData]);
        if (this.filterGrid && this.filterGrid.getCurrentNodeItems().length) {
            let currentItemIndex = this.filterGrid
                .getCurrentNodeItems()
                .findIndex((dt) => dt["DT_RowId"] == editData[0]["DT_RowId"]);
            if (currentItemIndex != -1) {
                let filterGridData: any[] =
                    this.filterGrid.getCurrentNodeItems();
                filterGridData.splice(currentItemIndex, 1, editData[0]);

                this.filterGridData = null;
                this.filterGridData = {
                    data: filterGridData,
                    columns: this.initFilterGridSetting(),
                };
            }
        }

        let beforeEditData = null;
        if (this.cacheData) {
            let selectingCountryItem =
                this.cacheData[
                    this.countryGrid.selectedNode.data[
                        ID_STRING.COUNTRY_LANGUAGE_ID
                    ]
                ];
            selectingCountryItem.isDirty = true;

            let currentItemIndex = selectingCountryItem.gridData.data.findIndex(
                (dt) => dt["DT_RowId"] == editData[0]["DT_RowId"]
            );
            if (currentItemIndex != -1) {
                if (this.isForAllCountry) {
                    beforeEditData = cloneDeep(
                        selectingCountryItem.gridData.data[currentItemIndex]
                    );
                }

                selectingCountryItem.gridData.data.splice(
                    currentItemIndex,
                    1,
                    editData[0]
                );
            }

            if (this.isForAllCountry) {
                let allCountries = this.countryGrid.getGridData();
                allCountries.forEach((country, idx) => {
                    if (
                        country[ID_STRING.COUNTRY_LANGUAGE_ID] !=
                        selectingCountryItem.gridData.data[currentItemIndex][
                            ID_STRING.COUNTRY_LANGUAGE_ID
                        ]
                    ) {
                        this.cacheData[
                            country[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ].isDirty = true;

                        let foundIndex = this.cacheData[
                            country[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ].gridData.data.findIndex((dt) => {
                            return isEqual(
                                omit(JSON.parse(beforeEditData.rawData), [
                                    ID_STRING.ID_SELECTION_PROJECT_RULES,
                                    ID_STRING.PRIORITY,
                                    ID_STRING.MEDIACODE,
                                ]),
                                omit(JSON.parse(dt.rawData), [
                                    ID_STRING.ID_SELECTION_PROJECT_RULES,
                                    ID_STRING.PRIORITY,
                                    ID_STRING.MEDIACODE,
                                ])
                            );
                        });
                        if (foundIndex !== -1) {
                            this.cacheData[
                                country[ID_STRING.COUNTRY_LANGUAGE_ID]
                            ].gridData.data[foundIndex] = {
                                ...this.cacheData[
                                    country[ID_STRING.COUNTRY_LANGUAGE_ID]
                                ].gridData.data[foundIndex],
                                BoolOp: editData[0].BoolOp,
                                FieldName: editData[0].FieldName,
                                Operator: editData[0].Operator,
                                Value: editData[0].Value,
                                rawData: editData[0].rawData,
                            };
                        }
                    }
                });
            }
        }

        this.changeDetectorRef.detectChanges();
    }

    private createNewRuleItem() {
        return {
            DT_RowId: GuidHelper.generateGUID(),
            IdSelectionProjectCountry:
                this.countryGrid.selectedNode.data[ID_STRING.COUNTRY_ID],
            IdCountrylanguage:
                this.countryGrid.selectedNode.data[
                    ID_STRING.COUNTRY_LANGUAGE_ID
                ],
            IdSelectionProjectRules: null,
            Priority: null,
            MediaCode: null,
            value: this.query,
            rawData: JSON.stringify(this.query),
        };
    }

    private processNewRule(isForAllCountry: boolean) {
        let newData: any = this.formatFilterRawData([this.createNewRuleItem()]);

        if (isForAllCountry) {
            let allCountries = this.countryGrid.getGridData();
            allCountries.forEach((country) => {
                this.cacheData[country[ID_STRING.COUNTRY_LANGUAGE_ID]].isDirty =
                    true;
                this.cacheData[
                    country[ID_STRING.COUNTRY_LANGUAGE_ID]
                ].gridData.data.push(newData[0]);
            });
        } else {
            if (
                !this.cacheData[
                    this.countryGrid.selectedNode.data[
                        ID_STRING.COUNTRY_LANGUAGE_ID
                    ]
                ]
            ) {
                this.cacheData[
                    this.countryGrid.selectedNode.data[
                        ID_STRING.COUNTRY_LANGUAGE_ID
                    ]
                ] = {
                    gridData: {
                        data: [newData[0]],
                        columns: this.initFilterGridSetting(),
                    },
                    isDirty: true,
                };
            } else {
                this.cacheData[
                    this.countryGrid.selectedNode.data[
                        ID_STRING.COUNTRY_LANGUAGE_ID
                    ]
                ].isDirty = true;
                this.cacheData[
                    this.countryGrid.selectedNode.data[
                        ID_STRING.COUNTRY_LANGUAGE_ID
                    ]
                ].gridData.data.push(newData[0]);
            }
        }

        //if (isForAllCountry) {
        //    this.cacheDataForAllCountry = this.cacheDataForAllCountry.concat(cloneDeep(newData));
        //}

        if (this.filterGrid && this.filterGrid.getCurrentNodeItems().length) {
            newData = this.filterGrid.getCurrentNodeItems().concat(newData);
        }
        this.filterGridData = null;
        this.filterGridData = {
            data: newData,
            columns: this.initFilterGridSetting(),
        };

        this.changeDetectorRef.detectChanges();
    }

    public countrySelectionChanged(e) {
        this.loadFilterFromSeletedCountry();

        this.onCountrySelectionChanged.emit(e);

        this.changeDetectorRef.detectChanges();
    }

    public onFilterGridEditEnded(editingItem) {
        if (this.cacheData && editingItem) {
            let selectingCountryItem =
                this.cacheData[
                    this.countryGrid.selectedNode.data[
                        ID_STRING.COUNTRY_LANGUAGE_ID
                    ]
                ];
            selectingCountryItem.isDirty = true;

            let currentItemIndex = selectingCountryItem.gridData.data.findIndex(
                (dt) => dt["DT_RowId"] == editingItem["DT_RowId"]
            );
            if (currentItemIndex != -1) {
                selectingCountryItem.gridData.data.splice(
                    currentItemIndex,
                    1,
                    editingItem
                );
            }

            if (this.isForAllCountry) {
                this.countryGrid.getGridData().forEach((country) => {
                    if (
                        country[ID_STRING.COUNTRY_LANGUAGE_ID] !==
                        editingItem[ID_STRING.COUNTRY_LANGUAGE_ID]
                    ) {
                        let found = this.cacheData[
                            country[ID_STRING.COUNTRY_LANGUAGE_ID]
                        ].gridData.data.find((dt) => {
                            return isEqual(
                                omit(JSON.parse(editingItem.rawData), [
                                    ID_STRING.ID_SELECTION_PROJECT_RULES,
                                    ID_STRING.PRIORITY,
                                    ID_STRING.MEDIACODE,
                                ]),
                                omit(JSON.parse(dt.rawData), [
                                    ID_STRING.ID_SELECTION_PROJECT_RULES,
                                    ID_STRING.PRIORITY,
                                    ID_STRING.MEDIACODE,
                                ])
                            );
                        });

                        if (found) {
                            this.cacheData[
                                country[ID_STRING.COUNTRY_LANGUAGE_ID]
                            ].isDirty = true;
                            found[ID_STRING.PRIORITY] =
                                editingItem[ID_STRING.PRIORITY];
                        }
                    }
                });
            }

            this.emitAllTableEvents();

            this.changeDetectorRef.detectChanges();
        }
    }

    public addAllFilterItemsToCache() {
        if (this.cacheData) {
            let selectingCountryItem =
                this.cacheData[
                    this.countryGrid.selectedNode.data[
                        ID_STRING.COUNTRY_LANGUAGE_ID
                    ]
                ];
            selectingCountryItem.isDirty = true;

            const currentItems = cloneDeep(
                this.filterGrid.getCurrentNodeItems()
            );

            for (let item of selectingCountryItem.gridData.data) {
                const currentItem = currentItems.find(
                    (x) => x.DT_RowId === item.DT_RowId
                );
                if (!currentItem || !currentItem.DT_RowId) {
                    currentItems.push(item);
                }
            }
            selectingCountryItem.gridData.data = currentItems;
            this.emitAllTableEvents();

            this.changeDetectorRef.detectChanges();
        }
    }

    public dragEnd($event) {
        this.countryGrid.sizeColumnsToFit();
        this.filterGrid.sizeColumnsToFit();

        this.splitterConfig = {
            leftHorizontal: this.horizontalSplit.areas[0].size,
            rightHorizontal: this.horizontalSplit.areas[1].size,
        };

        this.saveSplitterSettings();

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

        let saveData = this.createJsonData();

        if (!saveData) {
            return;
        }

        this.ruleServiceSubscription = this.ruleService
            .saveProjectRules(saveData)
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
            this.loadFilterFromSeletedCountry();
        });

        this.changeDetectorRef.detectChanges();
    }

    private reset() {
        this.validationError = {};
        this.profileData = {};
        this.cacheData = {};
        this.selectedFilterRow = {};
        this.cacheDataForAllCountry = [];
        this.isForAllCountry = false;
        this.onDeleteColumnClick.emit(0);

        this.changeDetectorRef.detectChanges();
    }

    public createJsonData() {
        let saveData: any = null;
        //if (this.isForAllCountry) {
        //    // Build data when applying for all country
        //    if (this.cacheDataForAllCountry && this.cacheDataForAllCountry.length) {
        //        saveData = {
        //            IdSelectionWidget: RuleEnum.ExtendedRules,
        //            IdSelectionProject: this.selectedEntity[camelCase(this.widgetListenKey)],
        //            JsonRules: []
        //        };
        //        for (let item of this.countryGridData.data) {
        //            if (item.IsActive) {
        //                let cachedItem = this.cacheData[item.IdCountrylanguage];
        //                let newItem = [];
        //                if (cachedItem && cachedItem.gridData) {
        //                    newItem = cloneDeep(cachedItem.gridData.data);
        //                }
        //                saveData.JsonRules.push({
        //                    IdSelectionProjectCountry: item.IdSelectionProjectCountry,
        //                    IdCountrylanguage: item.IdCountrylanguage,
        //                    Rules: this.buildRuleForAllCountry(newItem)
        //                });
        //            }
        //        }
        //    }
        //    return saveData;
        //}
        if (isEmpty(this.cacheData)) {
            return null;
        }

        let countryItems: any = {},
            cacheDataKeys = Object.keys(this.cacheData);

        cacheDataKeys.forEach((key) => {
            if (this.cacheData[key].isDirty) {
                countryItems[key] = this.cacheData[key];
            }
        });

        if (isEmpty(countryItems)) {
            return null;
        }

        saveData = {
            IdSelectionWidget: RuleEnum.ExtendedRules,
            IdSelectionProject:
                this.selectedEntity[camelCase(this.widgetListenKey)],
            JsonRules: [],
        };

        Object.keys(countryItems).forEach((countryLanguageId) => {
            const countryId = this.countryGridData.data.find(
                (c) => c[ID_STRING.COUNTRY_LANGUAGE_ID] == countryLanguageId
            )[ID_STRING.COUNTRY_ID];
            if (countryId) {
                saveData.JsonRules.push({
                    IdSelectionProjectCountry: countryId,
                    IdCountrylanguage: countryLanguageId,
                    Rules: this.buildRules(
                        countryItems[countryLanguageId].gridData.data
                    ),
                });
            }
        });

        return saveData;
    }

    public createJsonDataForProfile(): Observable<any> {
        return this.ruleService
            .getProjectRulesForTemplate(
                RuleEnum.Orders,
                this.selectedEntity[camelCase(this.widgetListenKey)]
            )
            .map((response: ApiResultResponse) => {
                let saveData = {
                    IdSelectionWidget: RuleEnum.Orders,
                    IdSelectionProject:
                        this.selectedEntity[camelCase(this.widgetListenKey)],
                    JsonRules: [],
                };

                if (!isEmpty(this.cacheData)) {
                    saveData.JsonRules.push({
                        Rules: this.buildRules(
                            this.cacheData[
                                this.currentSelectedGridItem("countryGrid")[
                                    ID_STRING.COUNTRY_LANGUAGE_ID
                                ]
                            ].gridData.data,
                            true
                        ),
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

    private buildRuleForAllCountry(gridData: any): any {
        let newRules = [];
        if (gridData.length) {
            for (let item of this.cacheDataForAllCountry) {
                let currentItem = gridData.find(
                    (x) => x.DT_RowId === item.DT_RowId
                );
                if (currentItem && currentItem.DT_RowId) continue;
                newRules.push(item);
            }
            gridData = gridData.concat(newRules);
        } else {
            gridData = cloneDeep(this.cacheDataForAllCountry);
        }
        return this.buildRules(gridData);
    }

    private buildRules(rules, forProfile?: boolean) {
        let result = [];
        if (rules.length) {
            for (let i = 0; i < rules.length; i++) {
                let rawData: any = {};

                if (forProfile && rules[i]["willDelete"]) {
                    continue;
                }

                if (rules[i]["willDelete"]) {
                    if (!rules[i][ID_STRING.ID_SELECTION_PROJECT_RULES]) {
                        continue;
                    }

                    rawData.IsDeleted = 1;
                    rawData.IdSelectionProjectRules = forProfile
                        ? undefined
                        : rules[i][ID_STRING.ID_SELECTION_PROJECT_RULES];
                    rawData.rules = [];
                } else {
                    rawData = JSON.parse(rules[i].rawData);
                    rawData.IsActive = 1;
                    rawData.IdSelectionProjectRules = forProfile
                        ? undefined
                        : rules[i][ID_STRING.ID_SELECTION_PROJECT_RULES];
                    rawData.Priority =
                        !isNil(rules[i][ID_STRING.PRIORITY]) &&
                        rules[i][ID_STRING.PRIORITY] !== ""
                            ? rules[i][ID_STRING.PRIORITY]
                            : null;
                    rawData.MediaCode =
                        !isNil(rules[i][ID_STRING.MEDIACODE]) &&
                        rules[i][ID_STRING.MEDIACODE] !== ""
                            ? rules[i][ID_STRING.MEDIACODE]
                            : null;
                }

                result.push(rawData);
            }
        }

        return result;
    }

    private buildRulesForHiddenCountry(allRules, countryId) {
        let result = [];

        for (let i = 0; i < allRules.length; i++) {
            if (allRules[i][ID_STRING.COUNTRY_ID] == countryId) {
                let rawData = JSON.parse(allRules[i].JsonCaseRules);
                rawData.IsActive = 1;
                rawData.IdSelectionProjectRules =
                    allRules[i][ID_STRING.ID_SELECTION_PROJECT_RULES];
                rawData.Priority =
                    !isNil(allRules[i][ID_STRING.PRIORITY]) &&
                    allRules[i][ID_STRING.PRIORITY] !== ""
                        ? allRules[i][ID_STRING.PRIORITY]
                        : null;
                rawData.MediaCode =
                    !isNil(allRules[i][ID_STRING.MEDIACODE]) &&
                    allRules[i][ID_STRING.MEDIACODE] !== ""
                        ? allRules[i][ID_STRING.MEDIACODE]
                        : null;

                result.push(rawData);
            }
        }
        return result;
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

    public onQueryBuilderChanged(data) {
        this.isApplyDisabled = this.isDisabledApplyButton(data);
    }

    private isDisabledApplyButton(data) {
        if (!data) {
            return true;
        }

        //if (this.ruleService.hasEmptyFieldRecursive(data, 'condition')) {
        //    return true;
        //}

        if (this.ruleService.hasEmptyFieldRecursive(data, "rules")) {
            return true;
        }

        if (
            this.ruleService.hasEmptySubFieldRecursive(data, "rules", "value")
        ) {
            return true;
        }

        return false;
    }

    private validateFilterGrid() {
        setTimeout(() => {
            let readOnly = this.checkFilterGridReadOnly();
            let disabled = this.checkFilterGridDisabled();

            if (
                readOnly !== this.isFilterGridReadOnly ||
                disabled !== this.isFilterGridDisabled
            ) {
                this.isFilterGridReadOnly = readOnly;
                this.isFilterGridDisabled = disabled;
                this.filterGrid.toggleColumns(
                    ["Delete", "Edit"],
                    !this.isFilterGridReadOnly
                );
                this.changeDetectorRef.detectChanges();

                if (this.filterGrid) {
                    this.filterGrid.refresh();
                }
            }
        }, 200);
    }
    public checkFilterGridReadOnly() {
        return (
            this.readOnly ||
            (this.countryGrid != null &&
                this.countryGrid.selectedNode != null &&
                !this.countryGrid.selectedNode.data["IsActive"])
        );
    }

    public checkFilterGridDisabled() {
        return (
            this.countryGrid != null &&
            this.countryGrid.selectedNode != null &&
            !this.countryGrid.selectedNode.data["IsActive"]
        );
    }
}
