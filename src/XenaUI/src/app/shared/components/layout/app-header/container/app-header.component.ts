import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  AfterViewInit,
} from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';
import isNil from 'lodash-es/isNil';
import {
  AppErrorHandler,
  PropertyPanelService,
  DomHandler,
  CommonService,
  GlobalSettingService,
  ModuleService,
  ParkedItemService,
} from 'app/services';
import {
  Module,
  TabSummaryModel,
  AdditionalInfromationTabModel,
  GlobalSettingModel,
} from 'app/models';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  ModuleActions,
  TabSummaryActions,
  ModuleSettingActions,
  ProcessDataActions,
  ParkedItemActions,
  SearchResultActions,
  PropertyPanelActions,
  AdditionalInformationActions,
  LayoutInfoActions,
  CustomAction,
  LayoutSettingActions,
  TabButtonActions,
  WidgetTemplateActions,
  GridActions,
  GlobalSearchActions,
  BackofficeActions,
} from 'app/state-management/store/actions';
import {
  MenuModuleId,
  GlobalSettingConstant,
  Configuration,
} from 'app/app.constants';
import * as mainModuleReducer from 'app/state-management/store/reducer/main-module';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as additionalInformationReducer from 'app/state-management/store/reducer/additional-information';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import * as widgetTemplateReducer from 'app/state-management/store/reducer/widget-template';
import * as layoutSettingReducer from 'app/state-management/store/reducer/layout-setting';
import * as parkedItemReducer from 'app/state-management/store/reducer/parked-item';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { Uti } from 'app/utilities';
import { UserBoxComponent } from '../components';
import * as uti from 'app/utilities';
import { XnCommonActions } from 'app/state-management/store/actions';

@Component({
  selector: 'app-header',
  styleUrls: ['./app-header.component.scss'],
  templateUrl: './app-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'onMouseEnter()',
  },
})
export class AppHeaderComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public mainModules: Module[] = [];
  public subModules: Module[] = [];
  public activeModule: Module;
  public activeSubModule: Module;
  public isViewMode = true;
  private willChangeModule: Module;
  private willChangeSubModule: Module;
  private requestCreateNewFromModuleDropdown = false;
  public selectedEntity: any;
  private selectedTab: TabSummaryModel;
  public selectedODETab: any;
  private selectedAiTab: AdditionalInfromationTabModel;
  private requestChangeSubModule: any;
  public buildVersion = '';
  public gradientBackgroundStatus: boolean;
  private continueToSelectSubModule: string;
  public isFocus: boolean;
  public searchText: string;
  public ofModuleLocal: Module;
  public autoCloseDropdown: boolean = true;
  public checkedModuleIds: any[] = [];
  public isFeedbackLoading = false;
  public isSelectionProject = false;

  private mainModulesStateSubscription: Subscription;
  private subModulesStateSubscription: Subscription;
  private activeModuleStateSubscription: Subscription;
  private activeSubModuleModelSubscription: Subscription;
  private selectedEntityStateSubscription: Subscription;
  private selectedTabStateSubscription: Subscription;
  private selectedAiTabStateSubscription: Subscription;
  private requestCreateNewModuleItemStateSubscription: Subscription;
  private isViewModeStateSubscription: Subscription;
  private widgetTemplateModeStateSubscription: Subscription;
  private layoutSettingModeStateSubscription: Subscription;
  private requestChangeModuleStateSubscription: Subscription;
  private requestChangeSubModuleStateSubscription: Subscription;
  private globalPropertiesStateSubscription: Subscription;
  private globalSettingSerSubscription: Subscription;
  private getGlobalSettingSubscription: Subscription;
  private okToCreateNewFromModuleDropdownSubscription: Subscription;
  private okToChangeModuleSubscription: Subscription;
  private requestClearPropertiesSuccessSubscription: Subscription;
  private okToChangeSubModuleSubscription: Subscription;
  private showFeedbackCompleteSubscription: Subscription;
  private selectedODETabStateSubscription: Subscription;
  private requestGoToModuleStateSubscription: Subscription;

  public isParkedItemCollapsedState: Observable<boolean>;
  public mainModulesState: Observable<Module[]>;
  public subModulesState: Observable<Module[]>;
  public activeModuleState: Observable<Module>;
  private activeSubModuleModel: Observable<Module>;
  private selectedEntityState: Observable<any>;
  private selectedTabState: Observable<TabSummaryModel>;
  private selectedODETabState: Observable<any>;
  private selectedAiTabState: Observable<AdditionalInfromationTabModel>;
  private requestCreateNewModuleItemState: Observable<any>;
  private isViewModeState: Observable<boolean>;
  private widgetTemplateModeState: Observable<boolean>;
  private layoutSettingModeState: Observable<boolean>;
  private requestChangeModuleState: Observable<any>;
  private requestChangeSubModuleState: Observable<any>;
  private globalPropertiesState: Observable<any>;
  private requestGoToModuleState: Observable<any>;

  @ViewChild('clearSearchElm')
  clearSearchElm: ElementRef;

  @ViewChild('searchInputElm')
  searchInputElm: ElementRef;

  @ViewChild(UserBoxComponent)
  userBoxComponent: UserBoxComponent;

  constructor(
    private store: Store<AppState>,
    private moduleActions: ModuleActions,
    private tabSummaryActions: TabSummaryActions,
    private moduleSettingActions: ModuleSettingActions,
    private processDataActions: ProcessDataActions,
    private parkedItemActions: ParkedItemActions,
    private searchResultActions: SearchResultActions,
    private backofficeActions: BackofficeActions,
    private appErrorHandler: AppErrorHandler,
    private propertyPanelActions: PropertyPanelActions,
    private additionalInformationActions: AdditionalInformationActions,
    private layoutInfoActions: LayoutInfoActions,
    private layoutSettingActions: LayoutSettingActions,
    private tabButtonActions: TabButtonActions,
    private globalSettingConstant: GlobalSettingConstant,
    private propertyPanelService: PropertyPanelService,
    private changeDetectorRef: ChangeDetectorRef,
    private domHandler: DomHandler,
    private dispatcher: ReducerManagerDispatcher,
    private commonService: CommonService,
    protected router: Router,
    private widgetTemplateActions: WidgetTemplateActions,
    private xnCommonActions: XnCommonActions,
    private globalSettingService: GlobalSettingService,
    private moduleService: ModuleService,
    private gridActions: GridActions,
    private parkedItemService: ParkedItemService,
    private globalSearchActions: GlobalSearchActions,
    private location: PlatformLocation
  ) {
    super(router);

    this.ofModuleLocal = this.ofModule;

    this.isSelectionProject = Configuration.PublicSettings.isSelectionProject;

    this.mainModulesState = store.select(mainModuleReducer.getMainModules);

    this.subModulesState = store.select((state) => state.mainModule.subModules);
    this.activeModuleState = store.select(mainModuleReducer.getActiveModule);
    this.activeSubModuleModel = store.select(
      (state) => state.mainModule.activeSubModule
    );
    this.selectedEntityState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedEntity
    );
    this.selectedTabState = store.select(
      (state) =>
        tabSummaryReducer.getTabSummaryState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedTab
    );
    this.selectedODETabState = store.select(
      (state) =>
        tabSummaryReducer.getTabSummaryState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedODETab
    );
    this.selectedAiTabState = store.select(
      (state) =>
        additionalInformationReducer.getAdditionalInformationState(
          state,
          this.ofModule.moduleNameTrim
        ).additionalInfromationTabModel
    );
    this.requestCreateNewModuleItemState = store.select(
      (state) => state.mainModule.requestCreateNewModuleItem
    );
    this.isViewModeState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).isViewMode
    );
    this.widgetTemplateModeState = store.select(
      (state) =>
        widgetTemplateReducer.getWidgetTemplateState(
          state,
          this.ofModule.moduleNameTrim
        ).enableWidgetTemplate
    );
    this.layoutSettingModeState = store.select(
      (state) =>
        layoutSettingReducer.getLayoutSettingState(
          state,
          this.ofModule.moduleNameTrim
        ).enableLayoutSetting
    );
    this.requestChangeModuleState = store.select(
      (state) => state.mainModule.requestChangeModule
    );
    this.requestChangeSubModuleState = store.select(
      (state) => state.mainModule.requestChangeSubModule
    );
    this.globalPropertiesState = store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).globalProperties
    );
    this.isParkedItemCollapsedState = store.select(
      (state) =>
        parkedItemReducer.getParkedItemState(
          state,
          this.ofModule.moduleNameTrim
        ).isCollapsed
    );

    //On BACK and NEXT button pressed
    location.onPopState(() => {
      setTimeout(() => {
        let currentModule = this.getCurrentModule();

        if (currentModule && currentModule.idSettingsGUI != -1) {
          if (
            !this.activeModule ||
            currentModule.idSettingsGUI !== this.activeModule.idSettingsGUI ||
            currentModule.idSettingsGUI == MenuModuleId.backoffice ||
            // || currentModule.idSettingsGUI == MenuModuleId.mailingData
            currentModule.idSettingsGUI == MenuModuleId.tools ||
            currentModule.idSettingsGUI == MenuModuleId.statistic ||
            currentModule.idSettingsGUI == MenuModuleId.selection
          ) {
            this.onSelectedModule(currentModule);
          } else if (
            currentModule.idSettingsGUI !== MenuModuleId.logistic &&
            (!this.activeSubModule ||
              currentModule.idSettingsGUI !==
                this.activeSubModule.idSettingsGUI)
          ) {
            this.onSelectedModule(currentModule);
          }

          this.changeDetectorRef.markForCheck();
        }
      });
    });
  }

  onRouteChanged() {
    this.buildModuleFromRoute();
    this.ofModuleLocal = this.ofModule;

    this.store.dispatch(this.gridActions.requestRefresh(this.ofModule));
  }

  ngOnInit(): void {
    this.store.dispatch(this.moduleActions.loadMainModules());
    this.subscribeMainModulesState();
    this.subscribeSubModulesState();
    this.subscribeActiveModuleModel();
    this.subscribeActiveSubModuleModel();
    this.subcribeSelectedEntityState();
    this.subcribeSelectedTabState();
    this.subscribeSelectedODETabState();
    this.subcribeSelectedAiTabState();
    this.subcribeRequestCreateNewModuleItemState();
    this.subscribeRequestClearPropertiesSuccessState();
    this.subscribeIsViewModeState();
    this.subscribeWidgetTemplateModeState();
    this.subscribeLayoutSettingModeState();
    this.subscribeOkToCreateNewFromModuleDropdownState();
    this.subscribeOkToChangeModuleState();
    this.subscribeOkToChangeSubModuleState();
    this.subscribeRequestChangeModuleState();
    this.subscribeRequestChangeSubModuleState();
    this.subscribeGlobalProperties();
    this.subscribeShowFeedbackCompleteState();
    this.subscribeRequestGoToModuleState();

    this.getAppVersion();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public feedbackClicked() {
    this.isFeedbackLoading = true;
    this.changeDetectorRef.detectChanges();
    this.store.dispatch(this.xnCommonActions.showFeedbackClicked(true));
    this.store.dispatch(
      this.xnCommonActions.storeFeedbacData({
        isSendToAdmin: false,
        tabID: null,
      })
    );
  }

  private registerEventControlSidebar() {
    /*
     * Before apply preload modules: When user clicks on the icon setting -> open the right tab settings. --> the bellow  code is not necessary
     * After apply preload modules: must apply the bellow code
     */
    setTimeout(() => {
      let $controlSidebar = $('[data-toggle="control-sidebar"]');
      if (!$controlSidebar || !$controlSidebar.length) {
        console.log(
          'app-header.component -> registerEventControlSidebar: can not find control-sidebar'
        );
        this.registerEventControlSidebar();
        return;
      }
      $controlSidebar.unbind('click');
      $controlSidebar.click(function () {
        $('.control-sidebar.control-sidebar-dark').toggleClass(
          'control-sidebar-open'
        );
      });
    }, 200);
  }

  private subscribeGlobalProperties() {
    this.globalPropertiesStateSubscription =
      this.globalPropertiesState.subscribe((globalProperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalProperties) {
            this.updatePropertiesFromGlobalProperties(globalProperties);
          }
        });
      });
  }

  private subscribeShowFeedbackCompleteState() {
    this.showFeedbackCompleteSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === XnCommonActions.SHOW_FEEDBACK_COMPLETE;
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.isFeedbackLoading = false;

          this.changeDetectorRef.markForCheck();
        });
      });
  }

  private subscribeMainModulesState() {
    this.mainModulesStateSubscription = this.mainModulesState.subscribe(
      (mainModulesState: Module[]) => {
        this.appErrorHandler.executeAction(() => {
          this.mainModules = mainModulesState;

          if (
            this.mainModules.length &&
            this.router &&
            !Uti.isRootUrl(this.router.url)
          ) {
            let moduleName: any = Uti.getModuleNamesFromUrl(this.router.url);

            let module: Module = this.mainModules.find(
              (m) => m.moduleNameTrim == moduleName[0]
            );
            if (moduleName.length > 1) {
              this.continueToSelectSubModule = moduleName[1];
            }

            if (module) {
              this.store.dispatch(this.moduleActions.activeModule(module));
            }
          } else if (this.mainModules.length) {
            this.getCheckedModules();
          }

          this.changeDetectorRef.markForCheck();
        });
      }
    );
  }

  private subscribeSubModulesState() {
    this.subModulesStateSubscription = this.subModulesState.subscribe(
      (subModulesState: Module[]) => {
        this.appErrorHandler.executeAction(() => {
          this.subModules = subModulesState;

          let requestedSubModule: Module;
          if (this.continueToSelectSubModule) {
            requestedSubModule = this.subModules.find(
              (m) => m.moduleNameTrim == this.continueToSelectSubModule
            );
            if (!requestedSubModule) {
              const logisticModules = this.subModules.find(
                (m) => m.idSettingsGUI == MenuModuleId.logistic
              );
              if (logisticModules && logisticModules.children) {
                requestedSubModule = logisticModules.children.find(
                  (m) => m.moduleNameTrim == this.continueToSelectSubModule
                );
              }
            }
          } else if (this.requestChangeSubModule) {
            requestedSubModule = this.subModules.find(
              (m) =>
                m.idSettingsGUI ==
                this.requestChangeSubModule.requestedSubModuleId
            );
          }

          if (requestedSubModule) {
            this.onSelectedSubModule(requestedSubModule);

            this.store.dispatch(
              this.moduleActions.clearRequestChangeSubModule()
            );
            this.continueToSelectSubModule = null;
          }

          this.changeDetectorRef.markForCheck();
        });
      }
    );
  }

  private subscribeActiveModuleModel() {
    this.activeModuleStateSubscription = this.activeModuleState.subscribe(
      (activeModule: Module) => {
        this.appErrorHandler.executeAction(() => {
          if (isEmpty(activeModule)) {
            this.activeModule = null;

            this.changeDetectorRef.markForCheck();
            return;
          }

          if (isEqual(this.activeModule, activeModule)) {
            return;
          }

          this.activeModule = cloneDeep(activeModule);

          this.changeDetectorRef.markForCheck();
        });
      }
    );
  }

  private subscribeActiveSubModuleModel() {
    this.activeSubModuleModelSubscription = this.activeSubModuleModel.subscribe(
      (activeSubModuleModel: Module) => {
        this.appErrorHandler.executeAction(() => {
          if (isEmpty(activeSubModuleModel)) {
            this.activeSubModule = null;
            this.changeDetectorRef.markForCheck();
            return;
          }

          this.activeSubModule = cloneDeep(activeSubModuleModel);

          this.changeDetectorRef.markForCheck();
        });
      }
    );
  }

  private subcribeSelectedEntityState() {
    this.selectedEntityStateSubscription = this.selectedEntityState.subscribe(
      (selectedEntityState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedEntity = selectedEntityState;
          this.changeDetectorRef.markForCheck();
        });
      }
    );
  }

  private subcribeSelectedTabState() {
    this.selectedTabStateSubscription = this.selectedTabState.subscribe(
      (selectedTabState: TabSummaryModel) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedTab = selectedTabState;
          this.changeDetectorRef.markForCheck();
        });
      }
    );
  }

  private subcribeSelectedAiTabState() {
    this.selectedAiTabStateSubscription = this.selectedAiTabState.subscribe(
      (selectedAiTabState: AdditionalInfromationTabModel) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedAiTab = selectedAiTabState;
        });
      }
    );
  }

  private subcribeRequestCreateNewModuleItemState() {
    this.requestCreateNewModuleItemStateSubscription =
      this.requestCreateNewModuleItemState.subscribe(
        (requestCreateNewModuleItemState: any) => {
          this.appErrorHandler.executeAction(() => {
            if (requestCreateNewModuleItemState) {
              this.onClickNewModule(requestCreateNewModuleItemState);
            }
          });
        }
      );
  }

  private subscribeIsViewModeState() {
    this.isViewModeStateSubscription = this.isViewModeState.subscribe(
      (isViewModeState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          if (!isNil(isViewModeState)) this.isViewMode = isViewModeState;

          if (!isViewModeState) {
            this.store.dispatch(
              this.searchResultActions.requestTogglePanel(false)
            );
            this.store.dispatch(
              this.additionalInformationActions.requestTogglePanel(
                false,
                this.ofModule
              )
            );
          }

          this.registerEventControlSidebar();

          this.changeDetectorRef.markForCheck();
        });
      }
    );
  }

  private subscribeWidgetTemplateModeState() {
    this.widgetTemplateModeStateSubscription =
      this.widgetTemplateModeState.subscribe(
        (widgetTemplateModeState: boolean) => {
          this.appErrorHandler.executeAction(() => {
            if (!isNil(widgetTemplateModeState)) {
              this.isViewMode = !widgetTemplateModeState;

              this.store.dispatch(
                this.widgetTemplateActions.toggleWidgetTemplateSettingPanel(
                  !this.isViewMode,
                  this.ofModule
                )
              );
            }

            this.changeDetectorRef.markForCheck();
          });
        }
      );
  }

  private subscribeLayoutSettingModeState() {
    this.layoutSettingModeStateSubscription =
      this.layoutSettingModeState.subscribe((enableLayoutSetting: boolean) => {
        this.appErrorHandler.executeAction(() => {
          if (enableLayoutSetting == undefined) return;

          this.isViewMode = enableLayoutSetting ? false : true;

          if (enableLayoutSetting) {
            this.store.dispatch(
              this.tabButtonActions.toggle(false, this.ofModule)
            );
            this.store.dispatch(
              this.layoutInfoActions.setRightMenuWidth('50', this.ofModule)
            );
            this.store.dispatch(
              this.layoutSettingActions.requestTogglePanel(true, this.ofModule)
            );
          } else {
            this.store.dispatch(
              this.tabButtonActions.toggle(true, this.ofModule)
            );
            this.store.dispatch(
              this.layoutInfoActions.setRightMenuWidth('0', this.ofModule)
            );
            this.store.dispatch(
              this.layoutSettingActions.requestTogglePanel(false, this.ofModule)
            );
          }
          this.changeDetectorRef.markForCheck();
        });
      });
  }

  private subscribeSelectedODETabState() {
    this.selectedODETabStateSubscription = this.selectedODETabState.subscribe(
      (selectedODETabState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedODETab = selectedODETabState;
        });
      }
    );
  }

  private subscribeRequestGoToModuleState() {
    this.requestGoToModuleStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_GO_TO_MODULE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe((value: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          const data = value && value.payload && value.payload.item;
          if (data) {
            const primaryKeyValue: any = data.PrimaryKeyValue;
            if (
              typeof primaryKeyValue === 'string' &&
              primaryKeyValue.indexOf(',') !== -1
            ) {
              const module: Module = ModuleList[data.ModuleName];
              module.searchKeyword = primaryKeyValue;
              this.onSearchingModule(module);
            } else {
              this.parkedItemService
                .getParkedItemById(ModuleList[data.ModuleName], primaryKeyValue)
                .subscribe((result) => {
                  this.appErrorHandler.executeAction(() => {
                    let module: Module;
                    module = ModuleList[data.ModuleName];
                    if (
                      result &&
                      result.collectionParkedtems &&
                      result.collectionParkedtems[0]
                    ) {
                      const entity = result.collectionParkedtems[0];
                      if (data.IdSettingsGUI != this.ofModule.idSettingsGUI) {
                        this.store.dispatch(
                          this.processDataActions.toggleDashboardLoading(
                            true,
                            module
                          )
                        );
                        if (module.idSettingsGUIParent) {
                          let mainModule: Module = this.mainModules.find(
                            (md) =>
                              md.idSettingsGUI === module.idSettingsGUIParent
                          );

                          if (
                            module.idSettingsGUIParent == MenuModuleId.logistic
                          ) {
                            mainModule = this.mainModules.find(
                              (md) =>
                                md.idSettingsGUI == MenuModuleId.backoffice
                            );
                          }

                          if (
                            module.idSettingsGUIParent !==
                            this.ofModule.idSettingsGUI
                          ) {
                            if (mainModule) {
                              this.store.dispatch(
                                this.moduleActions.requestChangeModule(
                                  mainModule
                                )
                              );
                            }
                          }

                          setTimeout(() => {
                            this.store.dispatch(
                              this.moduleActions.requestChangeSubModule(
                                mainModule.idSettingsGUI,
                                module.idSettingsGUI
                              )
                            );
                          }, 200);
                        } else {
                          this.store.dispatch(
                            this.moduleActions.requestChangeModule(module)
                          );
                        }

                        setTimeout(() => {
                          this.store.dispatch(
                            this.processDataActions.selectGoToModuleItem(
                              entity,
                              ModuleList[data.ModuleName]
                            )
                          );

                          setTimeout(() => {
                            this.store.dispatch(
                              this.processDataActions.toggleDashboardLoading(
                                false,
                                module
                              )
                            );
                          }, 500);
                        }, 2000);
                      }
                    } else {
                      const dataRowReturnRefund =
                        value && value.payload && value.payload.data;
                      if (data.IdSettingsGUI != this.ofModule.idSettingsGUI) {
                        this.store.dispatch(
                          this.processDataActions.toggleDashboardLoading(
                            true,
                            module
                          )
                        );
                        if (module.idSettingsGUIParent) {
                          let mainModule: Module = this.mainModules.find(
                            (md) =>
                              md.idSettingsGUI === module.idSettingsGUIParent
                          );

                          if (
                            module.idSettingsGUIParent == MenuModuleId.logistic
                          ) {
                            mainModule = this.mainModules.find(
                              (md) =>
                                md.idSettingsGUI == MenuModuleId.backoffice
                            );
                          }

                          if (
                            module.idSettingsGUIParent !==
                            this.ofModule.idSettingsGUI
                          ) {
                            if (mainModule) {
                              this.store.dispatch(
                                this.moduleActions.requestChangeModule(
                                  mainModule
                                )
                              );
                            }
                          }

                          setTimeout(() => {
                            this.store.dispatch(
                              this.moduleActions.requestChangeSubModule(
                                mainModule.idSettingsGUI,
                                module.idSettingsGUI
                              )
                            );
                          }, 200);
                        } else {
                          this.store.dispatch(
                            this.moduleActions.requestChangeModule(module)
                          );
                        }
                        setTimeout(() => {
                          this.store.dispatch(
                            this.backofficeActions.requestOpenReturnRefundModule(
                              module,
                              dataRowReturnRefund
                            )
                          );
                          setTimeout(() => {
                            this.store.dispatch(
                              this.processDataActions.toggleDashboardLoading(
                                false,
                                module
                              )
                            );
                          }, 500);
                        }, 1500);
                        // setTimeout(() => {
                        //     this.store.dispatch(this.backofficeActions.requestOpenReturnRefundModule(module, dataRowReturnRefund));
                        //     this.store.dispatch(this.processDataActions.toggleDashboardLoading(false, module));
                        // }, 500);
                      }
                    }
                  });
                });
            }
          }
        });
      });
  }

  /**
   * updatePropertiesFromGlobalProperties
   * @param globalProperties
   */
  protected updatePropertiesFromGlobalProperties(globalProperties) {
    const gradientColor = this.propertyPanelService.getItemRecursive(
      globalProperties,
      'GradientColor'
    );
    this.gradientBackgroundStatus = gradientColor ? gradientColor.value : false;

    this.changeDetectorRef.markForCheck();
  }

  public onMouseEnter() {
    this.store.dispatch(
      this.tabSummaryActions.toggleTabButton(false, this.ofModule)
    );
  }

  public onSelectedModule(selectedModule: Module): void {
    if (
      selectedModule &&
      (!this.activeModule ||
        selectedModule.idSettingsGUI !== this.activeModule.idSettingsGUI ||
        selectedModule.idSettingsGUI == MenuModuleId.backoffice ||
        selectedModule.idSettingsGUI == MenuModuleId.tools ||
        selectedModule.idSettingsGUI == MenuModuleId.statistic ||
        selectedModule.idSettingsGUI == MenuModuleId.selection)
    ) {
      this.willChangeModule = selectedModule;
      if (this.ofModule.idSettingsGUI == -1) {
        this.okToChangeOrCreateNewModule();
      } else {
        this.store.dispatch(
          this.processDataActions.requestChangeModule(this.ofModule)
        );
        // reset subModule
        this.store.dispatch(this.moduleActions.clearActiveSubModule());
      }
    }

    this.changeDetectorRef.markForCheck();
  }

  /**
   *
   * @param selectedSubModule
   */
  public onSelectedSubModule(selectedSubModule: Module): void {
    let okToChangeSubModule =
      selectedSubModule &&
      selectedSubModule.idSettingsGUI !== MenuModuleId.logistic &&
      (!this.activeSubModule ||
        selectedSubModule.idSettingsGUI !== this.activeSubModule.idSettingsGUI);

    if (okToChangeSubModule) {
      this.willChangeSubModule = selectedSubModule;
      this.store.dispatch(
        this.processDataActions.requestChangeSubModule(this.ofModule)
      );
    }

    this.changeDetectorRef.markForCheck();
  }

  private subscribeOkToCreateNewFromModuleDropdownState() {
    this.okToCreateNewFromModuleDropdownSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            ProcessDataActions.OK_TO_CREATE_NEW_FROM_MODULE_DROPDOWN &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (!isEmpty(this.selectedEntity)) {
            this.store.dispatch(
              this.propertyPanelActions.requestClearProperties(this.ofModule)
            );
          } else {
            this.okToChangeOrCreateNewModule();
          }

          this.changeDetectorRef.markForCheck();
        });
      });
  }

  private subscribeOkToChangeModuleState() {
    this.okToChangeModuleSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.OK_TO_CHANGE_MODULE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (!isEmpty(this.selectedEntity)) {
            this.store.dispatch(
              this.propertyPanelActions.requestClearProperties(this.ofModule)
            );
          } else {
            this.okToChangeOrCreateNewModule();
          }

          this.changeDetectorRef.markForCheck();
        });
      });
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
          if (
            this.willChangeModule ||
            this.requestCreateNewFromModuleDropdown
          ) {
            this.okToChangeOrCreateNewModule();
          } else if (this.willChangeSubModule) {
            this.okToChangeSubModule();
          }

          this.changeDetectorRef.markForCheck();
        });
      });
  }

  private subscribeOkToChangeSubModuleState() {
    this.okToChangeSubModuleSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.OK_TO_CHANGE_SUB_MODULE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (!isEmpty(this.selectedEntity)) {
            this.store.dispatch(
              this.propertyPanelActions.requestClearProperties(this.ofModule)
            );
          } else {
            this.okToChangeSubModule();
          }

          this.changeDetectorRef.markForCheck();
        });
      });
  }

  private subscribeRequestChangeModuleState() {
    this.requestChangeModuleStateSubscription =
      this.requestChangeModuleState.subscribe(
        (requestChangeModuleState: any) => {
          this.appErrorHandler.executeAction(() => {
            //this.requestChangeSubModule = requestChangeSubModuleState;

            if (requestChangeModuleState) {
              this.onSelectedModule(requestChangeModuleState.requestedModule);
              this.store.dispatch(
                this.moduleActions.clearRequestChangeModule()
              );
            }

            this.changeDetectorRef.markForCheck();
          });
        }
      );
  }

  private subscribeRequestChangeSubModuleState() {
    this.requestChangeSubModuleStateSubscription =
      this.requestChangeSubModuleState.subscribe(
        (requestChangeSubModuleState: any) => {
          this.appErrorHandler.executeAction(() => {
            this.requestChangeSubModule = requestChangeSubModuleState;

            if (requestChangeSubModuleState) {
              let requestedModule = this.mainModules.find(
                (m) =>
                  m.idSettingsGUI ==
                  requestChangeSubModuleState.requestedModuleId
              );
              if (
                requestedModule &&
                this.activeModule.idSettingsGUI == requestedModule.idSettingsGUI
              ) {
                let requestedSubModule = this.subModules.find(
                  (m) =>
                    m.idSettingsGUI ==
                    requestChangeSubModuleState.requestedSubModuleId
                );

                if (
                  !requestedSubModule &&
                  requestedModule.idSettingsGUI == MenuModuleId.backoffice
                ) {
                  const logisticModules = this.subModules.find(
                    (m) => m.idSettingsGUI == MenuModuleId.logistic
                  );
                  if (logisticModules && logisticModules.children) {
                    requestedSubModule = logisticModules.children.find(
                      (m) =>
                        m.idSettingsGUI ==
                        requestChangeSubModuleState.requestedSubModuleId
                    );
                  }
                }

                if (requestedSubModule) {
                  this.onSelectedSubModule(requestedSubModule);

                  this.store.dispatch(
                    this.moduleActions.clearRequestChangeSubModule()
                  );
                }
              } else {
                this.onSelectedModule(requestedModule);
              }
            }

            this.changeDetectorRef.markForCheck();
          });
        }
      );
  }

  private okToChangeOrCreateNewModule() {
    if (this.willChangeModule) {
      //this.closeCurrentModule();

      if (
        this.selectedEntity &&
        this.selectedEntity.hasOwnProperty('selectedParkedItem')
      ) {
        this.store.dispatch(
          this.moduleActions.storeModuleStates(
            this.activeModule,
            this.selectedEntity['selectedParkedItem'],
            this.selectedTab,
            this.selectedAiTab
          )
        );
      }

      this.store.dispatch(
        this.moduleActions.addWorkingModule(this.willChangeModule, [], [], [])
      );
      this.store.dispatch(this.moduleActions.clearSubModules());
      this.store.dispatch(
        this.moduleActions.activeModule(this.willChangeModule)
      );
      this.store.dispatch(
        this.propertyPanelActions.clearProperties(this.ofModule)
      );
      this.store.dispatch(
        this.layoutInfoActions.setRightPropertyPanelWidth('0', this.ofModule)
      );
      this.store.dispatch(
        this.layoutSettingActions.updateEditModeStatus(false, this.ofModule)
      );

      this.router.navigate([
        Uti.getPrivateUrlWithModuleName(this.willChangeModule.moduleNameTrim),
      ]);

      this.willChangeModule = null;
    } else if (this.requestCreateNewFromModuleDropdown) {
      this.store.dispatch(
        this.processDataActions.requestCreateNewMainTab(this.ofModule)
      );
      this.requestCreateNewFromModuleDropdown = false;
    }
    this.changeDetectorRef.markForCheck();
  }

  private okToChangeSubModule() {
    if (this.willChangeSubModule) {
      this.activeSubModule = this.willChangeSubModule;
      //this.closeCurrentSubModule();

      this.store.dispatch(
        this.moduleActions.activeSubModule(this.willChangeSubModule)
      );
      this.store.dispatch(
        this.propertyPanelActions.clearProperties(this.ofModule)
      );
      this.store.dispatch(
        this.layoutInfoActions.setRightPropertyPanelWidth('0', this.ofModule)
      );
      this.store.dispatch(
        this.layoutSettingActions.updateEditModeStatus(false, this.ofModule)
      );

      if (this.activeModule.idSettingsGUI != MenuModuleId.administration) {
        let newRoute =
          this.activeModule.moduleNameTrim +
          '/' +
          this.willChangeSubModule.moduleNameTrim;
        this.router.navigate([Uti.getPrivateUrlWithModuleName(newRoute)]);
      }

      this.willChangeSubModule = null;

      this.changeDetectorRef.markForCheck();

      if (this.requestCreateNewFromModuleDropdown) {
        setTimeout(() => {
          this.store.dispatch(
            this.processDataActions.requestCreateNewFromModuleDropdown(
              this.ofModule
            )
          );
        }, 500);
      }
    }
  }

  public onClickNewModule(selectedModule: Module) {
    this.requestCreateNewFromModuleDropdown = true;

    if (
      this.activeModule &&
      this.activeModule.idSettingsGUI == MenuModuleId.backoffice &&
      (!this.activeSubModule ||
        this.activeSubModule.idSettingsGUI !=
          selectedModule.idSettingsGUIParent)
    ) {
      let subModule: Module = this.moduleService.getModuleRecursive(
        this.subModules,
        selectedModule.idSettingsGUIParent
      );
      if (subModule && subModule.idSettingsGUI != MenuModuleId.logistic) {
        this.onSelectedSubModule(subModule);
        return;
      }
    }

    this.store.dispatch(
      this.processDataActions.requestCreateNewFromModuleDropdown(this.ofModule)
    );
    this.store.dispatch(this.moduleActions.activeSubModule(selectedModule));
    this.changeDetectorRef.markForCheck();
  }

  /**
   * onSearchingModule
   * @param selectedModule
   */
  public onSearchingModule(selectedModule: Module) {
    this.store.dispatch(this.moduleActions.searchKeywordModule(selectedModule));
  }

  private closeCurrentModule() {
    this.store.dispatch(this.moduleActions.clearActiveModule());
    this.store.dispatch(this.moduleActions.clearActiveSubModule());
    this.store.dispatch(
      this.moduleSettingActions.clearModuleSetting(this.ofModule)
    );
    this.store.dispatch(this.parkedItemActions.reset(this.ofModule));
    this.store.dispatch(
      this.tabSummaryActions.toggleTabButton(false, this.ofModule)
    );
    this.store.dispatch(this.tabSummaryActions.removeAllTabs(this.ofModule));
    this.store.dispatch(
      this.processDataActions.clearSearchResult(this.ofModule)
    );
    this.store.dispatch(
      this.processDataActions.clearGoToModuleItem(this.ofModule)
    );

    this.changeDetectorRef.markForCheck();
  }

  private closeCurrentSubModule() {
    if (
      this.activeSubModule.idSettingsGUIParent === MenuModuleId.backoffice ||
      this.activeSubModule.idSettingsGUIParent === MenuModuleId.logistic ||
      this.activeSubModule.idSettingsGUIParent === MenuModuleId.mailingData
    ) {
      this.store.dispatch(
        this.moduleSettingActions.clearModuleSetting(this.ofModule)
      );
      this.store.dispatch(this.parkedItemActions.reset(this.ofModule));
      this.store.dispatch(
        this.tabSummaryActions.toggleTabButton(false, this.ofModule)
      );
      this.store.dispatch(
        this.processDataActions.clearSearchResult(this.ofModule)
      );
      this.store.dispatch(
        this.processDataActions.clearGoToModuleItem(this.ofModule)
      );
      this.store.dispatch(this.tabSummaryActions.removeAllTabs(this.ofModule));
    }
    this.store.dispatch(this.moduleActions.clearActiveSubModule());

    this.changeDetectorRef.markForCheck();
  }

  focusSearchBox() {
    this.isFocus = true;
    this.changeDetectorRef.markForCheck();
  }

  focusOutSearchBox() {
    this.isFocus = false;
    this.changeDetectorRef.markForCheck();
  }

  search($event) {
    if (this.searchText) {
      this.store.dispatch(
        this.moduleActions.searchKeywordModule(
          new Module({
            searchKeyword: this.searchText,
            idSettingsGUI: -1,
            isCanSearch: true,
          })
        )
      );
      if ($event) {
        $event.preventDefault();
      }
    }
  }

  clearSearchText() {
    this.searchText = '';
    this.searchInputElm.nativeElement.value = this.searchText;
    this.domHandler.addClass(this.clearSearchElm.nativeElement, 'hidden');
    this.changeDetectorRef.markForCheck();
  }

  keypress($event) {
    if ($event.which === 13 || $event.keyCode === 13) {
      $event.preventDefault();
    } else {
      this.searchText = $event.target.value;
      if (this.searchText) {
        this.domHandler.removeClass(
          this.clearSearchElm.nativeElement,
          'hidden'
        );
      } else {
        this.domHandler.addClass(this.clearSearchElm.nativeElement, 'hidden');
      }
      this.changeDetectorRef.markForCheck();
    }
  }

  private getAppVersion() {
    this.buildVersion = Configuration.PublicSettings.appVersion;
    this.changeDetectorRef.markForCheck();
  }

  public preventClose(event: MouseEvent) {
    // event.stopImmediatePropagation();
  }

  public onUserDropdownClosed() {
    if (this.userBoxComponent) {
      this.userBoxComponent.close();
    }
  }

  public updateDropdownAutoClose(autoClose: boolean) {
    this.autoCloseDropdown = autoClose;
  }

  private getCheckedModules() {
    this.getGlobalSettingSubscription = this.globalSettingService
      .getAllGlobalSettings()
      .subscribe(
        (data) => this.getCheckedModulesSuccess(data),
        (error) => this.serviceError(error)
      );
  }

  private getCheckedModulesSuccess(data: GlobalSettingModel[]) {
    if (!data || !data.length) {
      return;
    }
    this.checkedModuleIds = this.getCurrentCheckedModules(data);
    for (let i = 0; i < this.checkedModuleIds.length; i++) {
      const moduleInfo = this.mainModules.find(
        (md) => md.idSettingsGUI == this.checkedModuleIds[i]
      );

      if (moduleInfo && moduleInfo.accessRight && moduleInfo.accessRight.read) {
        this.store.dispatch(
          this.moduleActions.addWorkingModule(moduleInfo, [], [], [], true)
        );

        if (i == 0 && this.router && uti.Uti.isRootUrl(this.router.url)) {
          this.onSelectedModule(moduleInfo);
        }
      }
    }
  }

  private serviceError(error) {
    Uti.logError(error);
  }

  private getCurrentCheckedModules(data: GlobalSettingModel[]): any {
    let currentGlobalSettingModel = data.find(
      (x) => x.globalName === this.getSettingName()
    );
    if (
      !currentGlobalSettingModel ||
      !currentGlobalSettingModel.idSettingsGlobal
    ) {
      return this.checkedModuleIds;
    }
    const checkedModulesSetting = JSON.parse(
      currentGlobalSettingModel.jsonSettings
    );

    return checkedModulesSetting && checkedModulesSetting.CheckedModules;
  }

  private getSettingName() {
    return this.globalSettingConstant.settingCheckedModules;
  }
}
