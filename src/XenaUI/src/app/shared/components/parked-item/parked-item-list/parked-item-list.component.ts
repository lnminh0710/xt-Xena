import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    Renderer,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    ElementRef,
    ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { DragulaService } from "ng2-dragula";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import isUndefined from "lodash-es/isUndefined";
import orderBy from "lodash-es/orderBy";
import { DomHandler, TimeCheckerService, DataEntryService } from "app/services";

import {
    ParkedItemModel,
    ParkedItemMenuModel,
    Module,
    TabSummaryModel,
    SearchResultItemModel,
    GlobalSettingModel,
    MessageModel,
} from "app/models";
import {
    ParkedItemService,
    ModalService,
    AppErrorHandler,
    GlobalSettingService,
    AccessRightsService,
    ParkedItemProcess,
} from "app/services";
import { SubLayoutInfoState } from "app/state-management/store/reducer/layout-info";
import { EditingWidget } from "app/state-management/store/reducer/widget-content-detail";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import {
    ParkedItemActions,
    TabSummaryActions,
    ModuleActions,
    LayoutInfoActions,
    ProcessDataActions,
    AdditionalInformationActions,
    GridActions,
    PropertyPanelActions,
    CustomAction,
    DataEntryActions,
    TabButtonActions,
} from "app/state-management/store/actions";
import {
    PageSize,
    MenuModuleId,
    GlobalSettingConstant,
    MessageModal,
    ModuleType,
    Configuration,
    TabButtonActionConst,
} from "app/app.constants";
import * as uti from "app/utilities";
import * as parkedItemReducer from "app/state-management/store/reducer/parked-item";
import * as tabSummaryReducer from "app/state-management/store/reducer/tab-summary";
import * as moduleSettingReducer from "app/state-management/store/reducer/module-setting";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as layoutInfoReducer from "app/state-management/store/reducer/layout-info";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";
import { BaseComponent, ModuleList } from "app/pages/private/base";
import * as widgetContentReducer from "app/state-management/store/reducer/widget-content-detail";
import { Uti } from "app/utilities";

@Component({
    selector: "parked-item-list",
    styleUrls: ["./parked-item-list.component.scss"],
    templateUrl: "./parked-item-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "(mouseenter)": "onMouseEnter()",
    },
})
export class ParkedItemListComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    @Input() set module(module: Module) {
        if (module) {
            if (isEmpty(module)) {
                this.ref.markForCheck();
                return;
            }

            if (isEqual(this.usingModule, module)) {
                return;
            }

            this.usingModule = module;

            if (this.usingModule.idSettingsGUI != MenuModuleId.backoffice) {
                this.initData(this.usingModule);
                setTimeout(() => {
                    this.getExpandCollapse();
                }, 200);
            }
        }

        this.ref.markForCheck();
    }

    public showList: boolean;
    public menuConfig: ParkedItemMenuModel[] = [];
    public fieldConfig: Array<any> = [];
    public parkedItems: ParkedItemModel[] = [];
    private idSettingsModule: string;
    public selectedParkedItem: ParkedItemModel;
    private subModules: Module[] = [];
    public parkedItemContainerStyle: Object = {};
    public parkedItemListStyle: Object = {};
    private willChangeParkedItem: ParkedItemModel = null;
    private modulePrimaryKey = "";
    private selectedSearchResult: SearchResultItemModel = null;
    private editingWidgets: Array<EditingWidget> = [];
    private moduleStates: Array<any> = [];
    public usingModule: Module;
    public isPanelDisabled = false;
    public isSelectionProject = false;
    public globalProperties: any;
    public selectedODETab: any;
    public selectedEntity: any;
    public isDropDownDisableToggleMenu = false;

    private parkedItemsState: Observable<any>;
    private selectedParkedItemState: Observable<any>;
    private idSettingsModuleState: Observable<string>;
    private subModulesState: Observable<Module[]>;
    private layoutInfoModel: Observable<SubLayoutInfoState>;
    private selectedTabState: Observable<TabSummaryModel>;
    private selectedSearchResultState: Observable<SearchResultItemModel>;
    private editingWidgetsState: Observable<Array<EditingWidget>>;
    private moduleStatesState: Observable<Array<any>>;
    private requestTogglePanelState: Observable<any>;
    private toggleDisabledPanelState: Observable<any>;
    private modulePrimaryKeyState: Observable<string>;
    private globalPropertiesState: Observable<any>;
    private selectedODETabState: Observable<any>;
    private selectedGoToModuleItemState: Observable<any>;

    private parkedItemsStateSubscription: Subscription;
    private selectedParkedItemStateSubscription: Subscription;
    private idSettingsModuleStateSubscription: Subscription;
    private subModulesStateSubscription: Subscription;
    private layoutInfoModelSubscription: Subscription;
    private selectedTabStateSubscription: Subscription;
    private selectedSearchResultStateSubscription: Subscription;
    private editingWidgetsStateSubscription: Subscription;
    private currentUserSubscription: Subscription;
    private moduleStatesStateSubscription: Subscription;
    private requestTogglePanelStateSubscription: Subscription;
    private toggleDisabledPanelStateSubscription: Subscription;
    private modulePrimaryKeyStateSubscription: Subscription;
    private parkedItemServiceSubscription: Subscription;
    private globalPropertiesStateSubscription: Subscription;
    private okToChangeParkedItemSubscription: Subscription;
    private requestClearPropertiesSuccessSubscription: Subscription;
    private requestSaveParkedItemListSubscription: Subscription;
    private selectedSearchResultSubscription: Subscription;
    private requestAddToParkedItemsSubscription: Subscription;
    private requestRemoveFromParkedItemsSubscription: Subscription;
    private selectedODETabStateSubscription: Subscription;
    private requestReloadListStateSubscription: Subscription;
    private newOrEditSubscription: Subscription;
    private selectedGoToModuleItemStateSubscription: Subscription;

    private isAutoClickToggle = false;

    public options: any = {
        copy: function (el, source) {
            return source.nodeName.toLowerCase() === "tbody";
        },
        removeOnSpill: false,
        accepts: function (el, target, source, sibling) {
            return target.nodeName.toLowerCase() !== "tbody";
        },
        moves: function (el: any, container: any, handle: any): any {
            if (
                $(handle).closest("div.parkedItemBody").length ||
                $(handle).closest("div.parkedItemFooter").length
            )
                return false;

            if (
                el.tagName.toLowerCase() === "tr" &&
                (isUndefined($(el).data("allow-drag")) ||
                    $(el).data("allow-drag") === false)
            ) {
                return false;
            }

            return true;
        },
    };

    @ViewChild("toggleButton") private toggleButton: ElementRef;

    public accessRight: any = {};

    constructor(
        private dragulaService: DragulaService,
        private parkedItemService: ParkedItemService,
        private store: Store<AppState>,
        private parkedItemActions: ParkedItemActions,
        private tabSummaryActions: TabSummaryActions,
        private moduleActions: ModuleActions,
        private layoutInfoActions: LayoutInfoActions,
        private processDataActions: ProcessDataActions,
        private additionalInformationActions: AdditionalInformationActions,
        private pageSize: PageSize,
        private globalSettingService: GlobalSettingService,
        private globalSettingConstant: GlobalSettingConstant,
        private appErrorHandler: AppErrorHandler,
        private gridActions: GridActions,
        private renderer: Renderer,
        private domHandler: DomHandler,
        private modalService: ModalService,
        private propertyPanelActions: PropertyPanelActions,
        private ref: ChangeDetectorRef,
        private elmRef: ElementRef,
        private toasterService: ToasterService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router,
        private timeCheckerService: TimeCheckerService,
        private accessRightsService: AccessRightsService,
        private dataEntryService: DataEntryService,
        private dataEntryActions: DataEntryActions,
        private tabButtonActions: TabButtonActions,
        private parkedItemProcess: ParkedItemProcess
    ) {
        super(router);

        this.parkedItemsState = store.select(
            (state) =>
                parkedItemReducer.getParkedItemState(
                    state,
                    this.ofModule.moduleNameTrim
                ).parkedItems
        );
        this.selectedParkedItemState = store.select(
            (state) =>
                parkedItemReducer.getParkedItemState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedParkedItem
        );
        this.idSettingsModuleState = store.select(
            (state) =>
                parkedItemReducer.getParkedItemState(
                    state,
                    this.ofModule.moduleNameTrim
                ).idSettingsModule
        );
        this.layoutInfoModel = store.select((state) =>
            layoutInfoReducer.getLayoutInfoState(
                state,
                this.ofModule.moduleNameTrim
            )
        );
        this.selectedTabState = store.select(
            (state) =>
                tabSummaryReducer.getTabSummaryState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedTab
        );
        this.subModulesState = store.select(
            (state) => state.mainModule.subModules
        );
        this.selectedSearchResultState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedSearchResult
        );
        this.editingWidgetsState = store.select(
            (state) =>
                widgetContentReducer.getWidgetContentDetailState(
                    state,
                    this.ofModule.moduleNameTrim
                ).editingWidgets
        );
        this.moduleStatesState = store.select(
            (state) => state.mainModule.moduleStates
        );
        this.requestTogglePanelState = store.select(
            (state) =>
                parkedItemReducer.getParkedItemState(
                    state,
                    this.ofModule.moduleNameTrim
                ).requestTogglePanel
        );
        this.toggleDisabledPanelState = store.select(
            (state) =>
                parkedItemReducer.getParkedItemState(
                    state,
                    this.ofModule.moduleNameTrim
                ).toggleDisabledPanel
        );
        this.modulePrimaryKeyState = store.select(
            (state) =>
                moduleSettingReducer.getModuleSettingState(
                    state,
                    this.ofModule.moduleNameTrim
                ).modulePrimaryKey
        );
        this.globalPropertiesState = store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
        this.selectedODETabState = store.select(
            (state) =>
                tabSummaryReducer.getTabSummaryState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedODETab
        );
        this.selectedGoToModuleItemState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedGoToModuleItem
        );

        //accessRight For ParkedItem
        this.accessRight =
            this.accessRightsService.GetAccessRightsForParkedItem(
                this.ofModule
            );
        this.isSelectionProject =
            Configuration.PublicSettings.isSelectionProject;
    }

    onRouteChanged() {
        if (Uti.isRootUrl(this.router.url)) {
            $("body").removeClass("sidebar-collapse");
        }

        if (
            !this.ofModule ||
            this.router.url.indexOf(this.ofModule.moduleNameTrim) === -1
        ) {
            return;
        }
        this.checkSidebarCollapse();
        // Callback to module couting component for selecting existing parked item
        this.store.dispatch(
            this.processDataActions.loadParkedItemsCompleted(this.ofModule)
        );
    }

    ngOnInit(): void {
        this.subcribeModulePrimaryKeyState();
        this.subscribeGlobalProperties();
        this.subcribeParkedItemsState();
        this.subcribeSelectedParkedItemState();
        this.subcribeIdSettingsModuleState();
        this.subcribeLayoutInfoModel();
        this.subcribeSelectedTabState();
        this.subcribeOkToChangeParkedItemState();
        this.subcribeSubModulesState();
        this.subcribeSelectedSearchResultState();
        this.subcribeRequestAddToParkedItemsState();
        this.subcribeRequestRemoveFromParkedItemsState();
        this.subscribeEditingWidgetsState();
        this.subcribeModuleStatesState();
        this.subscribeRequestSaveParkedItemListState();
        this.subscribeTogglePanelState();
        this.subscribeRequestClearPropertiesSuccessState();
        this.subscribeToggleDisabledPanelState();
        this.subscribeSelectedODETabState();
        this.subscribeRequestReloadListState();
        this.subcribeNewOrEditModeState();
        this.subcribeViewModeState();
        this.subscribeSelectedGoToModuleItemState();

        this.initDragulaEvents();
    }
    private subcribeNewOrEditModeState() {
        this.newOrEditSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    (action.type === ProcessDataActions.NEW_MAIN_TAB ||
                        action.type === ProcessDataActions.NEW_OTHER_TAB ||
                        action.type === ProcessDataActions.EDIT_MODE) &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.isDropDownDisableToggleMenu = true;
                });
            });
    }

    private subcribeViewModeState() {
        this.newOrEditSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.VIEW_MODE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.isDropDownDisableToggleMenu = false;
                });
            });
    }

    ngOnDestroy() {
        uti.Uti.unsubscribe(this);
    }

    private initDragulaEvents() {
        this.dragulaService.dropModel.subscribe(this.onDropModel.bind(this));
    }

    private onDropModel(args: any) {
        const [bagName, elSource, bagTarget, bagSource] = args;
        if (bagName == "parked-item-bag") {
            this.saveParkedItem();
        }
    }

    private forceCollapseSidebar() {
        if (
            !Configuration.PublicSettings.enableOrderFailed &&
            this.usingModule.idSettingsGUI == MenuModuleId.orderDataEntry
        ) {
            this.showList = false;
            this.isPanelDisabled = true;
            this.store.dispatch(
                this.parkedItemActions.setCollapseState(true, this.ofModule)
            );
            this.store.dispatch(
                this.layoutInfoActions.setParkedItemWidth(
                    this.pageSize.ParkedItemHideSize.toString(),
                    this.ofModule
                )
            );

            const $body = $("body");
            if (!$body.hasClass("sidebar-collapse"))
                $body.addClass("sidebar-collapse");

            return true;
        }

        return false;
    }

    private checkSidebarCollapse() {
        if (this.forceCollapseSidebar()) {
            return;
        }

        const $body = $("body");
        if (
            this.showList &&
            (this.accessRight.read ||
                this.usingModule.idSettingsGUI ==
                    MenuModuleId.orderDataEntry) &&
            $body.hasClass("sidebar-collapse")
        ) {
            $body.removeClass("sidebar-collapse");
            setTimeout(() => {
                if (
                    $(".parked-item-panel").hasClass(
                        "parked-item-panel-disabled"
                    )
                )
                    $body.addClass("sidebar-collapse");
            }, 100);
        } else if (
            (!this.showList ||
                (!this.accessRight.read &&
                    this.usingModule.idSettingsGUI != 7)) &&
            !$body.hasClass("sidebar-collapse")
        ) {
            $body.addClass("sidebar-collapse");
        }
    }

    private subcribeModulePrimaryKeyState() {
        this.modulePrimaryKeyStateSubscription =
            this.modulePrimaryKeyState.subscribe((key: string) => {
                this.appErrorHandler.executeAction(() => {
                    this.modulePrimaryKey = key;
                });
            });
    }

    private subcribeParkedItemsState() {
        this.parkedItemsStateSubscription = this.parkedItemsState
            .skip(1)
            .subscribe((parkedItemsStateData: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (!parkedItemsStateData) {
                        this.parkedItems = [];
                        return;
                    }

                    this.store.dispatch(
                        this.moduleActions.addWorkingModule(
                            this.ofModule,
                            this.subModules,
                            parkedItemsStateData,
                            this.fieldConfig
                        )
                    );
                    this.store.dispatch(
                        this.moduleActions.resetSelectingWorkingModuleParkedItem(
                            this.ofModule
                        )
                    );

                    this.parkedItems = parkedItemsStateData;
                    this.processForParkedItems();

                    setTimeout(() => {
                        if (
                            this.usingModule.idSettingsGUI ==
                            ModuleList.OrderDataEntry.idSettingsGUI
                        ) {
                            if (
                                !this.parkedItems.length &&
                                this.showList &&
                                this.toggleButton
                            ) {
                                this.toggle();
                            }

                            setTimeout(() => {
                                this.checkSidebarCollapse();
                            }, 300);
                        }

                        this.ref.markForCheck();
                    }, 200);
                });
            });
    }

    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription =
            this.globalPropertiesState.subscribe((globalProperties: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (globalProperties) {
                        this.globalProperties = globalProperties;
                        this.setParkedItemNewTime();
                        this.ref.markForCheck();
                    }
                });
            });
    }

    private subcribeSelectedParkedItemState() {
        this.selectedParkedItemStateSubscription =
            this.selectedParkedItemState.subscribe(
                (selectedParkedItemState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        this.selectedParkedItem = selectedParkedItemState;

                        this.selectedEntity = selectedParkedItemState;
                        this.ref.markForCheck();
                    });
                }
            );
    }

    private subcribeIdSettingsModuleState() {
        this.idSettingsModuleStateSubscription =
            this.idSettingsModuleState.subscribe(
                (idSettingsModuleState: string) => {
                    this.appErrorHandler.executeAction(() => {
                        this.idSettingsModule = idSettingsModuleState;
                    });
                }
            );
    }

    private subcribeLayoutInfoModel() {
        this.layoutInfoModelSubscription = this.layoutInfoModel.subscribe(
            (layoutInfo: SubLayoutInfoState) => {
                this.appErrorHandler.executeAction(() => {
                    this.parkedItemContainerStyle = {
                        // 'min-height': `calc(100vh - ${layoutInfo.globalSearchHeight}px - ${layoutInfo.headerHeight}px - ${layoutInfo.parkedItemTitleHeight}px - ${layoutInfo.parkedItemPadding}px)`,
                        // 'max-height': `calc(100vh - ${layoutInfo.globalSearchHeight}px - ${layoutInfo.headerHeight}px - ${layoutInfo.parkedItemTitleHeight}px - ${layoutInfo.parkedItemPadding}px)`
                        "min-height": `calc(100vh - ${layoutInfo.headerHeight}px - ${layoutInfo.parkedItemTitleHeight}px - ${layoutInfo.parkedItemPadding}px - ${layoutInfo.selectedEntityHeight}px)`,
                        "max-height": `calc(100vh - ${layoutInfo.headerHeight}px - ${layoutInfo.parkedItemTitleHeight}px - ${layoutInfo.parkedItemPadding}px - ${layoutInfo.selectedEntityHeight}px)`,
                    };

                    this.parkedItemListStyle = {
                        // 'min-height': `calc(100vh - ${layoutInfo.globalSearchHeight}px - ${layoutInfo.headerHeight}px - ${layoutInfo.parkedItemTitleHeight}px - ${layoutInfo.parkedItemBufferHeight}px)`,
                        // 'max-height': `calc(100vh - ${layoutInfo.globalSearchHeight}px - ${layoutInfo.headerHeight}px - ${layoutInfo.parkedItemTitleHeight}px - ${layoutInfo.parkedItemBufferHeight}px)`
                        "min-height": `calc(100vh - ${layoutInfo.headerHeight}px - ${layoutInfo.parkedItemTitleHeight}px - ${layoutInfo.parkedItemBufferHeight}px - ${layoutInfo.selectedEntityHeight}px)`,
                        "max-height": `calc(100vh - ${layoutInfo.headerHeight}px - ${layoutInfo.parkedItemTitleHeight}px - ${layoutInfo.parkedItemBufferHeight}px - ${layoutInfo.selectedEntityHeight}px)`,
                    };
                    this.ref.markForCheck();
                });
            }
        );
    }

    private subcribeSelectedTabState() {
        this.selectedTabStateSubscription = this.selectedTabState.subscribe(
            (selectedTabState: TabSummaryModel) => {
                this.appErrorHandler.executeAction(() => {
                    // Firefox hack
                    if (!this.showList) {
                        $(
                            "#vertical-text",
                            this.elmRef.nativeElement
                        ).removeClass("margin-top-10px");
                        setTimeout(() => {
                            $(
                                "#vertical-text",
                                this.elmRef.nativeElement
                            ).addClass("margin-top-10px");
                        }, 2000);
                    }
                });
            }
        );
    }

    private subcribeOkToChangeParkedItemState() {
        this.okToChangeParkedItemSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        ProcessDataActions.OK_TO_CHANGE_PARKED_ITEM &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    if (!isEmpty(this.selectedParkedItem)) {
                        this.store.dispatch(
                            this.propertyPanelActions.requestClearProperties(
                                this.ofModule
                            )
                        );
                    } else {
                        this.okToChangeParkedItem();
                    }
                });
            });
    }

    private subscribeEditingWidgetsState() {
        this.editingWidgetsStateSubscription =
            this.editingWidgetsState.subscribe(
                (editingWidgets: Array<EditingWidget>) => {
                    this.appErrorHandler.executeAction(() => {
                        this.editingWidgets = editingWidgets;

                        if (
                            !this.editingWidgets.length &&
                            this.willChangeParkedItem
                        ) {
                            this.store.dispatch(
                                this.parkedItemActions.selectParkedItem(
                                    this.willChangeParkedItem,
                                    this.ofModule
                                )
                            );

                            if (
                                this.ofModule &&
                                this.ofModule.idSettingsGUI ===
                                    MenuModuleId.administration
                            ) {
                                this.selectActiveSubModule(
                                    this.willChangeParkedItem
                                );
                            }

                            this.store.dispatch(
                                this.propertyPanelActions.clearProperties(
                                    this.ofModule
                                )
                            );
                            this.store.dispatch(
                                this.layoutInfoActions.setRightPropertyPanelWidth(
                                    "0",
                                    this.ofModule
                                )
                            );
                            this.store.dispatch(
                                this.moduleActions.moveSelectedParkedItemToTop(
                                    this.ofModule,
                                    this.willChangeParkedItem
                                )
                            );

                            this.willChangeParkedItem = null;
                        }
                    });
                }
            );
    }

    private subscribeRequestClearPropertiesSuccessState() {
        this.requestClearPropertiesSuccessSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        PropertyPanelActions.REQUEST_CLEAR_PROPERTIES_SUCCESS &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.okToChangeParkedItem();
                });
            });
    }

    private subscribeToggleDisabledPanelState() {
        this.toggleDisabledPanelStateSubscription =
            this.toggleDisabledPanelState.subscribe(
                (toggleDisabledPanelState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (toggleDisabledPanelState) {
                            this.isPanelDisabled =
                                toggleDisabledPanelState.isDisabled;

                            this.ref.markForCheck();
                        }
                    });
                }
            );
    }

    private subcribeModuleStatesState() {
        this.moduleStatesStateSubscription = this.moduleStatesState.subscribe(
            (moduleStatesState: Array<any>) => {
                this.appErrorHandler.executeAction(() => {
                    this.moduleStates = moduleStatesState;
                });
            }
        );
    }

    private subscribeRequestSaveParkedItemListState() {
        this.requestSaveParkedItemListSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        ParkedItemActions.REQUEST_SAVE_PARKED_ITEM_LIST &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    setTimeout(() => {
                        this.saveParkedItem();
                    }, 500);
                });
            });
    }

    private subscribeTogglePanelState() {
        this.requestTogglePanelStateSubscription =
            this.requestTogglePanelState.subscribe(
                (requestTogglePanelState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (
                            requestTogglePanelState &&
                            this.showList !== requestTogglePanelState.isShow
                        ) {
                            if (this.toggleButton) {
                                this.renderer.invokeElementMethod(
                                    this.toggleButton.nativeElement,
                                    "click",
                                    []
                                );
                            }
                        }
                    });
                }
            );
    }

    private subcribeSubModulesState() {
        this.subModulesStateSubscription = this.subModulesState.subscribe(
            (subModulesState: Module[]) => {
                this.appErrorHandler.executeAction(() => {
                    this.subModules = subModulesState;
                    this.ref.markForCheck();
                });
            }
        );
    }

    private subcribeSelectedSearchResultState() {
        this.selectedSearchResultSubscription =
            this.selectedSearchResultState.subscribe(
                (selectedSearchResultState: SearchResultItemModel) => {
                    this.appErrorHandler.executeAction(() => {
                        this.selectedSearchResult = selectedSearchResultState;

                        if (selectedSearchResultState) {
                            this.parkedItemService
                                .getParkedItemById(
                                    this.ofModule,
                                    selectedSearchResultState[
                                        this.modulePrimaryKey
                                    ]
                                )
                                .subscribe((result) => {
                                    this.appErrorHandler.executeAction(() => {
                                        if (
                                            result &&
                                            result.collectionParkedtems &&
                                            result.collectionParkedtems[0]
                                        ) {
                                            this.selectedEntity =
                                                result.collectionParkedtems[0];
                                            this.ref.markForCheck();
                                        }
                                    });
                                });
                        }
                    });
                }
            );
    }

    private subscribeSelectedGoToModuleItemState() {
        this.selectedGoToModuleItemStateSubscription =
            this.selectedGoToModuleItemState.subscribe(
                (selectedGoToModuleItemState: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (selectedGoToModuleItemState) {
                            this.selectedEntity = selectedGoToModuleItemState;
                            this.ref.markForCheck();
                        }
                    });
                }
            );
    }

    private subcribeRequestAddToParkedItemsState() {
        this.requestAddToParkedItemsSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        ProcessDataActions.REQUEST_ADD_TO_PARKED_ITEMS &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe((data: CustomAction) => {
                this.appErrorHandler.executeAction(() => {
                    if (!isEmpty(data.payload)) {
                        this.addItemToParkedItems(data.payload);
                    }
                });
            });
    }

    private subcribeRequestRemoveFromParkedItemsState() {
        this.requestRemoveFromParkedItemsSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        ProcessDataActions.REQUEST_REMOVE_FROM_PARKED_ITEMS &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe((data: CustomAction) => {
                this.appErrorHandler.executeAction(() => {
                    if (!isEmpty(data.payload)) {
                        this.removeItemFromParkedItems(data.payload);
                    }
                });
            });
    }

    private selectParkedItemFromModuleState() {
        if (this.ofModule && this.moduleStates.length) {
            const moduleState = this.moduleStates.find(
                (ms) =>
                    ms.currentModule.idSettingsGUI ===
                    this.ofModule.idSettingsGUI
            );
            if (
                moduleState &&
                moduleState.selectedParkedItem &&
                moduleState.selectedParkedItem.id
            ) {
                if (
                    !this.selectedParkedItem ||
                    (this.selectedParkedItem &&
                        this.selectedParkedItem.id &&
                        this.selectedParkedItem.id !==
                            moduleState.selectedParkedItem.id)
                ) {
                    this.store.dispatch(
                        this.parkedItemActions.selectParkedItem(
                            moduleState.selectedParkedItem,
                            this.ofModule
                        )
                    );
                    this.store.dispatch(
                        this.moduleActions.moveSelectedParkedItemToTop(
                            this.ofModule,
                            moduleState.selectedParkedItem
                        )
                    );

                    setTimeout(() => {
                        if (moduleState.selectedTab) {
                            this.store.dispatch(
                                this.tabSummaryActions.requestSelectTab(
                                    moduleState.selectedTab.tabSummaryInfor
                                        .tabID,
                                    this.ofModule
                                )
                            );
                        }

                        if (moduleState.selectedAiTab) {
                            this.store.dispatch(
                                this.additionalInformationActions.requestSelectAiTab(
                                    moduleState.selectedAiTab.TabID,
                                    this.ofModule
                                )
                            );
                        }

                        this.store.dispatch(
                            this.moduleActions.clearModuleState(
                                moduleState.currentModule
                            )
                        );
                    }, 500);
                }
            }
        }
    }

    private okToChangeParkedItem() {
        if (this.willChangeParkedItem) {
            this.store.dispatch(
                this.parkedItemActions.selectParkedItem(
                    this.willChangeParkedItem,
                    this.ofModule
                )
            );

            if (
                this.ofModule &&
                this.ofModule.idSettingsGUI === MenuModuleId.administration
            ) {
                this.selectActiveSubModule(this.willChangeParkedItem);
            }
            this.store.dispatch(
                this.propertyPanelActions.clearProperties(this.ofModule)
            );
            this.store.dispatch(
                this.moduleActions.moveSelectedParkedItemToTop(
                    this.ofModule,
                    this.willChangeParkedItem
                )
            );
            this.store.dispatch(
                this.layoutInfoActions.setRightPropertyPanelWidth(
                    "0",
                    this.ofModule
                )
            );

            this.willChangeParkedItem = null;
        }
    }

    private subscribeSelectedODETabState() {
        this.selectedODETabStateSubscription =
            this.selectedODETabState.subscribe((selectedODETabState: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.selectedODETab = selectedODETabState;

                    if (
                        this.selectedODETab &&
                        Configuration.PublicSettings.enableOrderFailed
                    ) {
                        this.dataEntryService
                            .syncOrderFailedFromLocalStorageToFiles()
                            .finally(() => {})
                            .subscribe((response) => {
                                this.appErrorHandler.executeAction(() => {
                                    this.getParkedItems(
                                        this.usingModule,
                                        this.selectedODETab
                                    );
                                });
                            });
                    }
                });
            });
    }

    private subscribeRequestReloadListState() {
        this.requestReloadListStateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ParkedItemActions.REQUEST_RELOAD_LIST &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    switch (this.ofModule.idSettingsGUI) {
                        case ModuleList.OrderDataEntry.idSettingsGUI:
                            if (this.selectedODETab) {
                                this.getParkedItems(
                                    this.usingModule,
                                    this.selectedODETab
                                );
                            }
                            break;

                        default:
                            this.initData(this.ofModule);
                            break;
                    }
                });
            });
    }

    initData(activeModule: Module) {
        switch (activeModule.idSettingsGUI) {
            case ModuleList.OrderDataEntry.idSettingsGUI:
                break;

            default:
                this.parkedItemServiceSubscription = this.parkedItemService
                    .getParkedItemMenu(activeModule)
                    .subscribe((results: ParkedItemMenuModel[]) => {
                        this.appErrorHandler.executeAction(() => {
                            if (!$.isEmptyObject(results)) {
                                this.menuConfig = results;
                                this.fieldConfig =
                                    this.parkedItemService.buildFieldConfig(
                                        results
                                    );
                            } else {
                                this.menuConfig = [];
                                this.fieldConfig = [];
                            }

                            this.store.dispatch(
                                this.parkedItemActions.storeFieldConfig(
                                    this.fieldConfig,
                                    activeModule
                                )
                            );

                            this.getParkedItems(activeModule);
                            this.ref.markForCheck();
                        });
                    });
                break;
        }
    }

    onMouseEnter() {
        this.store.dispatch(
            this.tabSummaryActions.toggleTabButton(false, this.ofModule)
        );
    }

    getParkedItems(activeModule, ODETab?: any) {
        this.store.dispatch(
            this.parkedItemActions.loadParkedItems(activeModule, ODETab)
        );
    }

    saveParkedItem(isRemoved?: boolean, parkedItem?: ParkedItemModel) {
        // if (this.parkedItemProcess.isProcessingForRequestSaveParkedItemList) {
        //     return;
        // }
        if (this.parkedItemProcess.preventRequestSaveParkedItemList) {
            setTimeout(() => {
                this.parkedItemProcess.preventRequestSaveParkedItemList = false;
            }, 1000);
            return;
        }

        const parkedItemObj = {
            ObjectNr: this.ofModule.idSettingsGUI,
            ModuleName: "Parked " + this.ofModule.moduleName,
            ModuleType: ModuleType.PARKED_ITEM,
            Description: null,
            JsonSettings: this.parkedItemService.buildParkedItemId(
                this.parkedItems
            ),
            IsActive: "true",
            IdSettingsModule: this.idSettingsModule || null,
        };

        this.parkedItemServiceSubscription = this.parkedItemService
            .saveParkedItemByModule(parkedItemObj)
            .finally(() => {
                //this.parkedItemProcess.isProcessingForRequestSaveParkedItemList = false;
            })
            .subscribe((result: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (result) {
                        this.idSettingsModule = result.idSettingsModule;

                        if (isRemoved && parkedItem) {
                            this.toasterService.pop(
                                "success",
                                "Success",
                                "Parked item removed successfully"
                            );
                            this.store.dispatch(
                                this.parkedItemActions.removeParkedItem(
                                    parkedItem,
                                    this.ofModule
                                )
                            );
                        } else {
                            this.toasterService.pop(
                                "success",
                                "Success",
                                "Parked item list saved successfully"
                            );
                        }

                        this.ref.markForCheck();
                    }
                });
            });
    }

    private reloadODETab() {
        //Reload ODE
        this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.RELOAD_ORDER_DATA_ENTRY,
                this.ofModule
            )
        );
        this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.FIRST_LOAD,
                this.ofModule
            )
        );
        this.store.dispatch(
            this.dataEntryActions.dataEntryCallReload(
                true,
                this.selectedODETab.TabID
            )
        );
        this.store.dispatch(
            this.tabSummaryActions.requestSelectSimpleTab(0, this.ofModule)
        ); //Active the first SimpleTab
    }

    closeParkedItem(parkedItem) {
        const idx = this.parkedItems.indexOf(parkedItem);

        if (idx > -1) {
            this.parkedItems.splice(idx, 1);
            this.saveParkedItem(true, parkedItem);

            this.store.dispatch(
                this.parkedItemActions.unselectParkedItem(this.ofModule)
            );
            this.store.dispatch(
                this.tabSummaryActions.removeAllTabs(this.ofModule)
            );

            if (!this.selectedODETab) {
                this.store.dispatch(
                    this.moduleActions.removeParkedItemOfWorkingModule(
                        this.ofModule,
                        parkedItem
                    )
                );
            } else if (Configuration.PublicSettings.enableOrderFailed) {
                //Reload ODE
                this.reloadODETab();

                this.dataEntryService
                    .deleteOrderFailed(
                        this.selectedODETab.TabID,
                        parkedItem.idScansContainerItems.value
                    )
                    .subscribe((response: any) => {
                        this.appErrorHandler.executeAction(() => {
                            //reload parked item panel
                            if (response) {
                                this.store.dispatch(
                                    this.parkedItemActions.requestReloadList(
                                        this.ofModule
                                    )
                                );
                            }
                        });
                    });
            }
        }
    }

    removeParkedItemById(id: any) {
        const currentParkedItem = this.parkedItems.find(
            (x) => x.id && x.id.value == id
        );
        if (isEmpty(currentParkedItem)) {
            return;
        }
        this.closeParkedItem(currentParkedItem);
    }

    selectParkedItem(parkedItem) {
        if (!isEqual(this.selectedParkedItem, parkedItem)) {
            if (parkedItem.isNew) {
                this.store.dispatch(
                    this.parkedItemActions.selectParkedItem(
                        parkedItem,
                        this.ofModule
                    )
                );

                this.selectActiveSubModule(parkedItem);
            } else {
                this.willChangeParkedItem = parkedItem;
                this.store.dispatch(
                    this.processDataActions.requestChangeParkedItem(
                        this.ofModule
                    )
                );
            }
        }
    }

    selectActiveSubModule(parkedItem) {
        if (!parkedItem || !parkedItem.idRepPersonType) {
            return;
        }

        const activeSubModule = this.parkedItemService.getActiveSubModule(
            this.subModules,
            parkedItem.idSettingsGUI.value
        );
        if (activeSubModule) {
            this.store.dispatch(
                this.moduleActions.activeSubModule(activeSubModule)
            );
        }
    }

    toggle() {
        if (this.forceCollapseSidebar()) {
            return;
        }

        if (
            this.isPanelDisabled ||
            (!this.accessRight.read &&
                this.usingModule.idSettingsGUI !== MenuModuleId.orderDataEntry)
        ) {
            return;
        }

        // Firefox hack
        if (this.showList) {
            setTimeout(() => {
                $("#vertical-text", this.elmRef.nativeElement).addClass(
                    "margin-top-9px"
                );
            }, 200);
            setTimeout(() => {
                $("#vertical-text", this.elmRef.nativeElement).addClass(
                    "margin-top-10px"
                );
            }, 300);
        } else {
            $("#vertical-text", this.elmRef.nativeElement).removeClass(
                "margin-top-9px"
            );
            $("#vertical-text", this.elmRef.nativeElement).removeClass(
                "margin-top-10px"
            );
        }
        // Firefox hack

        this.showList = !this.showList;

        this.store.dispatch(
            this.parkedItemActions.setCollapseState(
                !this.showList,
                this.ofModule
            )
        );

        if (!this.showList) {
            this.store.dispatch(
                this.layoutInfoActions.setParkedItemWidth(
                    this.pageSize.ParkedItemHideSize.toString(),
                    this.ofModule
                )
            );
        } else {
            this.store.dispatch(
                this.layoutInfoActions.setParkedItemWidth(
                    this.pageSize.ParkedItemShowSize.toString(),
                    this.ofModule
                )
            );
        }
        if (!this.isAutoClickToggle) this.reloadAndSaveExpandConfig();

        this.isAutoClickToggle = false;
        this.store.dispatch(this.gridActions.requestRefresh(this.ofModule));
        this.store.dispatch(
            this.layoutInfoActions.resizeSplitter(this.ofModule)
        );
    }

    onParkedItemDropdownApply(event) {
        if (event) {
            this.initData(this.ofModule);
        }
    }

    transferDataSuccess(event: any) {
        if (
            !event ||
            !event.dragData ||
            !event.dragData[this.modulePrimaryKey]
        ) {
            return;
        }
        this.addItemToParkedItems({ data: event.dragData });
    }

    /********************** Start Drag and Drop Native HTML 5 Handler **********************/
    /**
     * onDrop
     * @param event
     */
    onDrop(event: DragEvent) {
        this.renderer.setElementClass(
            event.currentTarget,
            "drag-border",
            false
        );
        // let rawData = event.dataTransfer.getData('item-data');
        const rawData = event.dataTransfer.getData("text");
        if (rawData) {
            const data = JSON.parse(rawData);
            this.addItemToParkedItems({ data: data });
        }
        this.ref.markForCheck();
    }

    /**
     * onDragOver
     * @param event
     */
    onDragOver(event: DragEvent) {
        this.renderer.setElementClass(event.currentTarget, "drag-border", true);
        const elem: Element = this.domHandler.findSingle(
            document,
            ".xn-grid-drag"
        );
        if (elem) {
            if (
                this.selectedSearchResult &&
                !this.parkedItemService.checkItemExist(
                    this.selectedSearchResult,
                    this.modulePrimaryKey,
                    this.parkedItems
                )
            ) {
                this.domHandler.addClass(elem, "drag-enter-color");
            }
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        event.dataTransfer.dropEffect = "move";
        this.ref.markForCheck();
    }

    /**
     * onDragLeave
     * @param event
     */
    onDragLeave(event: DragEvent) {
        // console.log('onDragLeave : ' + event.toElement.className);
        this.renderer.setElementClass(
            event.currentTarget,
            "drag-border",
            false
        );

        const node = this.domHandler.findParent(
            event["toElement"],
            "parked-item"
        );
        if (node && node.length) {
            this.ref.markForCheck();
            return;
        }

        const elem: Element = this.domHandler.findSingle(
            document,
            ".xn-grid-drag"
        );
        if (elem) {
            this.domHandler.removeClass(elem, "drag-enter-color");
            /*
            setTimeout(() => {
                this.domHandler.removeClass(elem, 'drag-enter-color');
            }, 200);
            */
        }
        this.ref.markForCheck();
    }

    /**
     * onDragEnter
     * @param event
     */
    onDragEnter(event: DragEvent) {
        this.renderer.setElementClass(event.currentTarget, "drag-border", true);
        const elem: Element = this.domHandler.findSingle(
            document,
            ".xn-grid-drag"
        );
        if (elem) {
            if (
                this.selectedSearchResult &&
                !this.parkedItemService.checkItemExist(
                    this.selectedSearchResult,
                    this.modulePrimaryKey,
                    this.parkedItems
                )
            ) {
                this.domHandler.addClass(elem, "drag-enter-color");
            }
        }
        this.ref.markForCheck();
    }

    /********************** End Drag and Drop Native HTML 5 Handler **********************/

    addItemToParkedItems(data: any) {
        if (
            this.parkedItemService.checkItemExist(
                data.data,
                this.modulePrimaryKey,
                this.parkedItems
            )
        ) {
            if (data.adddition && data.adddition.thenSelect) {
                this.selectParkedItem(
                    Uti.makeParkedItemObjectFromStraightObject(
                        data.data,
                        data.adddition.idName
                    )
                );
                return;
            }
            this.modalService.warningMessage([
                {
                    key: "Modal_Message__This_Item_Has_Already_Parked",
                },
            ]);
            return;
        }

        this.parkedItemServiceSubscription = this.parkedItemService
            .getParkedItemById(this.ofModule, data.data[this.modulePrimaryKey])
            .subscribe((result) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        result &&
                        result.collectionParkedtems &&
                        result.collectionParkedtems[0]
                    ) {
                        const newParkedItem = result.collectionParkedtems[0];

                        this.parkedItems.splice(0, 0, newParkedItem);
                        this.selectParkedItem(newParkedItem);
                        this.store.dispatch(
                            this.moduleActions.moveSelectedParkedItemToTop(
                                this.ofModule,
                                newParkedItem
                            )
                        );
                        if (
                            document.querySelector(".parked-item-content") !=
                            null
                        )
                            document.querySelector(
                                ".parked-item-content"
                            ).scrollTop = 0;
                        this.saveParkedItem();
                        this.processForParkedItems();
                        this.ref.markForCheck();
                    }
                });
            });
    }

    removeItemFromParkedItems(item) {
        if (
            !this.parkedItemService.checkItemExist(
                item,
                this.modulePrimaryKey,
                this.parkedItems
            )
        ) {
            return;
        }
        this.removeParkedItemById(item[this.modulePrimaryKey]);
    }
    public deleteAllParkedItem($event: any) {
        if (!this.parkedItems || !this.parkedItems.length) {
            return;
        }
        this.modalService.confirmMessageHtmlContent(
            new MessageModel({
                headerText: "Delete All Items",
                messageType: MessageModal.MessageType.error,
                message: [
                    { key: "<p>" },
                    {
                        key: "Modal_Message__Do_You_Want_To_Delete_All_Packed_Items",
                    },
                    { key: "</p>" },
                ],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    this.deleteParkedItems();
                },
            })
        );
    }

    private deleteParkedItems() {
        const parkedItemObj = {
            ObjectNr: this.ofModule.idSettingsGUI,
            ModuleName: "Parked " + this.ofModule.moduleName,
            ModuleType: ModuleType.PARKED_ITEM,
            Description: null,
            JsonSettings: "",
            IsActive: "true",
            IdSettingsModule: this.idSettingsModule || null,
        };

        this.parkedItemServiceSubscription = this.parkedItemService
            .saveParkedItemByModule(parkedItemObj)
            .subscribe((result: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (result) {
                        this.idSettingsModule = result.idSettingsModule;
                        this.store.dispatch(
                            this.parkedItemActions.removeAllParkedItem(
                                this.ofModule
                            )
                        );
                        this.store.dispatch(
                            this.moduleActions.removeAllParkedItemsOfWorkingModule(
                                this.ofModule
                            )
                        );
                        this.store.dispatch(
                            this.parkedItemActions.unselectParkedItem(
                                this.ofModule
                            )
                        );
                        this.store.dispatch(
                            this.tabSummaryActions.removeAllTabs(this.ofModule)
                        );

                        if (
                            this.selectedODETab &&
                            Configuration.PublicSettings.enableOrderFailed
                        ) {
                            //delete all order failed
                            this.dataEntryService
                                .deleteAllOrderFailed(this.selectedODETab.TabID)
                                .subscribe();
                            this.reloadODETab();
                        }
                    }
                });
            });
    }

    /*************************Expand and Collapse */

    private getGlobalSettingSubscription: Subscription;
    private currentGlobalSettingModel: any;
    private getExpandCollapse() {
        this.getGlobalSettingSubscription = this.globalSettingService
            .getAllGlobalSettings(this.ofModule.idSettingsGUI)
            .subscribe(
                (data) => this.getAllGlobalSettingSuccess(data),
                (error) => this.serviceError(error)
            );
    }

    private getAllGlobalSettingSuccess(data: GlobalSettingModel[]) {
        if (!data || !data.length) return;

        if (this.forceCollapseSidebar()) {
            return;
        }

        const showList = this.getCurrentExpandCollapse(data);
        this.store.dispatch(
            this.parkedItemActions.setCollapseState(!showList, this.ofModule)
        );
        // 1. If current session is show, but variable from service is not
        // 2. If current section is not show, but variable from service is show
        if (this.showList !== showList) {
            this.showList = showList;

            // if (this.toggleButton) {
            //     this.renderer.invokeElementMethod(this.toggleButton.nativeElement, 'click', []);
            // }
        }

        if (
            !this.showList ||
            this.isPanelDisabled ||
            (!this.accessRight.read &&
                this.usingModule.idSettingsGUI != MenuModuleId.orderDataEntry)
        ) {
            this.store.dispatch(
                this.layoutInfoActions.setParkedItemWidth(
                    this.pageSize.ParkedItemHideSize.toString(),
                    this.ofModule
                )
            );
        } else {
            this.store.dispatch(
                this.layoutInfoActions.setParkedItemWidth(
                    this.pageSize.ParkedItemShowSize.toString(),
                    this.ofModule
                )
            );
        }

        this.checkSidebarCollapse();
    }
    private serviceError(error) {
        Uti.logError(error);
    }
    private getCurrentExpandCollapse(data: GlobalSettingModel[]): boolean {
        this.currentGlobalSettingModel = data.find(
            (x) => x.globalName === this.getSettingAIExpandCollapseName()
        );
        if (
            !this.currentGlobalSettingModel ||
            !this.currentGlobalSettingModel.idSettingsGlobal
        ) {
            return this.showList;
        }
        const sessionShowSetting = JSON.parse(
            this.currentGlobalSettingModel.jsonSettings
        );
        return sessionShowSetting && sessionShowSetting.IsExpand;
    }

    private reloadAndSaveExpandConfig() {
        if (!this.ofModule || !this.ofModule.idSettingsGUI) {
            return;
        }

        this.getGlobalSettingSubscription = this.globalSettingService
            .getAllGlobalSettings(this.ofModule.idSettingsGUI)
            .subscribe((data: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.saveExpandConfig(data);
                });
            });
    }
    private saveExpandConfig(data: GlobalSettingModel[]) {
        if (
            !this.currentGlobalSettingModel ||
            !this.currentGlobalSettingModel.idSettingsGlobal ||
            !this.currentGlobalSettingModel.globalName
        ) {
            this.currentGlobalSettingModel = new GlobalSettingModel({
                globalName: this.getSettingAIExpandCollapseName(),
                description: "Additional Information Session Show",
                globalType: this.globalSettingConstant.parkItemSessionShow,
            });
        }
        this.currentGlobalSettingModel.idSettingsGUI =
            this.ofModule.idSettingsGUI;
        this.currentGlobalSettingModel.jsonSettings = JSON.stringify({
            IsExpand: this.showList,
        });
        this.currentGlobalSettingModel.isActive = true;

        this.getGlobalSettingSubscription = this.globalSettingService
            .saveGlobalSetting(this.currentGlobalSettingModel)
            .subscribe(
                (_data) => this.saveExpandConfigSuccess(_data),
                (error) => this.serviceError(error)
            );
    }

    private saveExpandConfigSuccess(data: any) {
        this.globalSettingService.saveUpdateCache(
            this.ofModule.idSettingsGUI,
            this.currentGlobalSettingModel,
            data
        );
    }

    private getSettingAIExpandCollapseName() {
        return uti.String.Format(
            "{0}_{1}",
            this.globalSettingConstant.parkItemSessionShow,
            this.ofModule
                ? uti.String.hardTrimBlank(this.ofModule.moduleName)
                : ""
        );
    }
    /*************************End Expand and Collapse */

    public itemsTrackBy(index, item) {
        return item && typeof item.id === "object" ? item.id.value : undefined;
    }

    //#region Process for New Icon
    private timeoutProcessForParkedItems: any;
    private timeoutSetTiemParkedItems: any;
    private parkedItemNewTime: number = undefined; //24 hours;

    private setParkedItemNewTime() {
        if (!this.globalProperties || !this.globalProperties.length) return;

        const properties: Array<any> = <Array<any>>this.globalProperties;
        const applicationSettings = properties.find((item, i) => {
            return item.id == "ApplicationSettings";
        });

        if (
            applicationSettings &&
            applicationSettings.children &&
            applicationSettings.children.length
        ) {
            const parkedItemNewTimeItem = applicationSettings.children.find(
                (item, i) => {
                    return item.id == "ParkedItemNewTime";
                }
            );

            //in hours
            if (parkedItemNewTimeItem) {
                const isCallProcessForParkedItems: boolean =
                    this.parkedItemNewTime != parkedItemNewTimeItem.value;
                this.parkedItemNewTime = parkedItemNewTimeItem.value;

                if (!parkedItemNewTimeItem.value)
                    this.clearProcessForParkedItems();
                // (only call manual) if change settings -> recalculate ParkedItems
                else if (isCallProcessForParkedItems) {
                    clearTimeout(this.timeoutSetTiemParkedItems);
                    this.timeoutSetTiemParkedItems = null;

                    this.timeoutSetTiemParkedItems = setTimeout(() => {
                        this.processForParkedItems();
                    }, 400);
                } //if
            }
        }
    }

    private processForParkedItems() {
        clearTimeout(this.timeoutProcessForParkedItems);
        this.timeoutProcessForParkedItems = null;

        if (
            !this.parkedItems ||
            !this.parkedItems.length ||
            !this.parkedItemNewTime
        )
            return;

        let serverDateNow = this.timeCheckerService.getServerDateNow();
        if (serverDateNow) {
            const newTimeSettings = this.parkedItemNewTime; //in 24 hours
            //from serverDateNow -> set decrease x hours will be expired
            serverDateNow.setTime(
                serverDateNow.getTime() - newTimeSettings * 60 * 60 * 1000
            );

            //Set isNew icon
            this.parkedItems.forEach((item, i) => {
                item.isNewInsertedItem = item.createDateValue >= serverDateNow;
            }); //forEach
            this.ref.markForCheck();

            //get list in 'x' hours
            let newlist = this.parkedItems.filter((item, i) => {
                return item.isNewInsertedItem;
            }); //forEach

            //get Item with createDate is nearing expiration
            if (newlist && newlist.length) {
                //if parkedItems sorted desc-> just get last item = min Item

                //sort from Smallest to Largest
                newlist = orderBy(newlist, ["createDateValue"], ["asc"]);
                for (let i = 0; i < newlist.length; i++) {
                    const itemMin = newlist[i];
                    const dateNow: any = new Date();
                    const diffMs: any = dateNow - itemMin.createDateValue; // milliseconds between two dates
                    if (diffMs && diffMs > 0) {
                        //console.log('processForParkedItems - setTimeout in milliseconds: ' + diffMs);
                        this.timeoutProcessForParkedItems = setTimeout(() => {
                            this.processForParkedItems();
                        }, diffMs);

                        break;
                    }
                } //for
            }
        }
    }

    private clearProcessForParkedItems() {
        clearTimeout(this.timeoutProcessForParkedItems);
        this.timeoutProcessForParkedItems = null;

        if (!this.parkedItems || !this.parkedItems.length) return;

        this.parkedItems.forEach((item, i) => {
            item.isNewInsertedItem = false;
        }); //forEach
        this.ref.markForCheck();
    }
    //#endregion
}
