import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  GlobalSearchConstant,
  MenuModuleId,
  Configuration,
  LocalStorageKey,
  GridId,
  GlobalSettingConstant,
} from 'app/app.constants';
import {
  GlobalSearchModuleModel,
  TabModel,
  Module,
  SearchResultItemModel,
  ParkedItemModel,
  ApiResultResponse,
  MessageModel,
  GlobalSettingModel,
} from 'app/models';
import {
  GlobalSearchService,
  AppErrorHandler,
  ModuleService,
  AccessRightsService,
  ModalService,
  GlobalSettingService,
} from 'app/services';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  SearchResultActions,
  TabSummaryActions,
  ModuleActions,
  CustomAction,
  ProcessDataActions,
  GlobalSearchActions,
} from 'app/state-management/store/actions';
import isEmpty from 'lodash-es/isEmpty';
import isObject from 'lodash-es/isObject';

import { GlobalSearchResultComponent } from '../gs-result';
import * as parkedItemReducer from 'app/state-management/store/reducer/parked-item';
import * as moduleSettingReducer from 'app/state-management/store/reducer/module-setting';
import * as commonReducer from 'app/state-management/store/reducer/xn-common';
import * as uti from 'app/utilities';
import { Uti, String } from 'app/utilities';
import { ModuleList } from 'app/pages/private/base';

@Component({
  selector: 'gs-tab',
  styleUrls: ['./gs-tab.component.scss'],
  templateUrl: './gs-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchTabComponent implements OnInit, OnDestroy {
  public tabList: TabModel[];
  public tabType: string;
  public gridId: string;
  public currentTab: TabModel;
  public perfectScrollbarConfig: any = {};
  public allowDrag: any = {
    value: false,
  };

  private selectedSearchResult: SearchResultItemModel = null;
  private willSelectSearchResult: SearchResultItemModel = null;
  public isCollapsed = true;
  private modulePrimaryKey = '';
  private parkedItems: any;
  private contextMenuData: any = [];
  private moduleToPersonType: any;

  private xnContextMenuState: Observable<any>;
  private isCollapsedState: Observable<boolean>;
  private modulePrimaryKeyState: Observable<string>;
  private parkedItemsState: Observable<ParkedItemModel[]>;
  private moduleToPersonTypeState: Observable<any>;

  private xnContextMenuStateSubscription: Subscription;
  private isCollapsedStateSubscription: Subscription;
  private parkedItemsStateSubscription: Subscription;
  private modulePrimaryKeyStateSubscription: Subscription;
  private loadParkedItemsCompletedSubscription: Subscription;
  private moduleToPersonTypeStateSubcription: Subscription;

  private mainItemClassParent = 'gs_module-item__parent';
  private mainItemClassChild = 'gs_module-item__child';
  private searchItemClassName = 'form-control__circle';
  private searchItemClassNameSmall: string = this.searchItemClassName + '--sm';
  private searchItemBgClassName = 'gs__all-icon__bg';
  private searchItemBgClassNameSearched: string =
    this.searchItemBgClassName + '--searched';
  private searchTextClassName = 'gs__result';
  private searchTextClassNameSmall: string = this.searchTextClassName + '--sm';
  private limitHistoriesNumber = 30;

  public globalSearchConfig: any = {
    isAdministrationClicked: false,
    isSearched: false,
  };
  public globalSearchModuleModels: Array<GlobalSearchModuleModel> = [];
  public globalSearchModuleModelsAdminChildren: Array<GlobalSearchModuleModel> =
    [];
  public that: any;

  @Input() set type(type: string) {
    this.tabType = type;
  }
  @Input() set tabs(tabs: TabModel[]) {
    this.tabList = tabs;
  }
  @Input() set tabz(tabz: TabModel) {
    this.currentTab = tabz;

    if (tabz) {
      //accessRight For ParkedItem
      this.accessRight = this.accessRightsService.GetAccessRightsForParkedItem(
        tabz.module
      );
    }

    setTimeout(() => {
      this.allowDrag.value = this.setAllowDrag(this.currentTab);
    });
  }
  @Input() isWithStar: boolean = false;

  @Input() mainModules: Module[] = [];
  @Input() subModules: Module[] = [];

  private _activeModule: Module;
  @Input() set activeModule(data: Module) {
    this._activeModule = data;
  }

  get activeModule() {
    return this._activeModule;
  }

  private _activeSubModule: Module;
  @Input() set activeSubModule(data: Module) {
    this._activeSubModule = data;
  }

  get activeSubModule() {
    return this._activeSubModule;
  }

  @Input() ofModule: Module = null;
  @Input() cssClass: string;

  @Output() onMarkForCheck: EventEmitter<any> = new EventEmitter();
  @Output() onSearchResultCompleted: EventEmitter<any> = new EventEmitter();
  @Output() onPinGroupTranslateClick: EventEmitter<any> = new EventEmitter();

  @ViewChild(GlobalSearchResultComponent)
  public globalSearchResult: GlobalSearchResultComponent;

  public accessRight: any = {};

  constructor(
    public globalSearchConsts: GlobalSearchConstant,
    private globalServ: GlobalSearchService,
    public _changeDetectorRef: ChangeDetectorRef,
    private store: Store<AppState>,
    private searchResultActions: SearchResultActions,
    private moduleActions: ModuleActions,
    private tabSummaryActions: TabSummaryActions,
    private moduleService: ModuleService,
    private processDataActions: ProcessDataActions,
    private appErrorHandler: AppErrorHandler,
    private dispatcher: ReducerManagerDispatcher,
    private accessRightsService: AccessRightsService,
    private _modalService: ModalService,
    private _globalSettingService: GlobalSettingService,
    private _globalSettingConstant: GlobalSettingConstant,
    private globalSearchActions: GlobalSearchActions
  ) {
    this.isCollapsedState = this.store.select(
      (state) => state.searchResult.isCollapsed
    );
    this.moduleToPersonTypeState = this.store.select(
      (state) =>
        commonReducer.getCommonState(
          state,
          this.ofModule ? this.ofModule.moduleNameTrim : ''
        ).moduleToPersonType
    );
    this.that = this;
  }

  public ngOnInit() {
    this.getAllModule();
    this.initHotkeys();

    this.isCollapsedStateSubscription = this.isCollapsedState.subscribe(
      (isCollapsedState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          this.isCollapsed = isCollapsedState;
        });
      }
    );

    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };

    if (this.ofModule) {
      this.modulePrimaryKeyState = this.store.select(
        (state) =>
          moduleSettingReducer.getModuleSettingState(
            state,
            this.ofModule.moduleNameTrim
          ).modulePrimaryKey
      );
      this.parkedItemsState = this.store.select(
        (state) =>
          parkedItemReducer.getParkedItemState(
            state,
            this.ofModule.moduleNameTrim
          ).parkedItems
      );
      this.xnContextMenuState = this.store.select(
        (state) =>
          commonReducer.getCommonState(state, this.ofModule.moduleNameTrim)
            .contextMenuData
      );

      this.subcribeModulePrimaryKeyState();
      this.subcribeParkedItemsState();
      this.subcribeLoadParkedItemsCompletedState();
      this.subscibeXnContextMenuState();
      this.subscribeModuleToPersonTypeState();
    }
  }

  public ngOnDestroy() {
    //this.hotkeysService.remove(this.ctrlP);
    uti.Uti.unsubscribe(this);
  }

  private subscibeXnContextMenuState() {
    this.xnContextMenuStateSubscription = this.xnContextMenuState.subscribe(
      (data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!data) {
            return;
          }
          this.contextMenuData = data;
        });
      }
    );
  }

  private subscribeModuleToPersonTypeState() {
    this.moduleToPersonTypeStateSubcription =
      this.moduleToPersonTypeState.subscribe((moduleToPersonTypeState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.moduleToPersonType = moduleToPersonTypeState;
        });
      });
  }

  private setAllowDrag(currentTab) {
    if (
      !this.accessRight.read ||
      isEmpty(this.activeModule) ||
      !currentTab.module
    ) {
      return false;
    }

    const childModule = this.subModules.find(
      (child) => child.idSettingsGUI === currentTab.module.idSettingsGUI
    );
    if (
      childModule &&
      this.activeModule.idSettingsGUI === childModule.idSettingsGUIParent
    ) {
      return true;
    } else if (
      currentTab.module.idSettingsGUI === this.activeModule.idSettingsGUI ||
      (this.activeSubModule &&
        currentTab.module.idSettingsGUI === this.activeSubModule.idSettingsGUI)
    ) {
      return true;
    }

    return false;
  }

  private initHotkeys() {
    //this.ctrlP = new Hotkey('ctrl+p', (event: KeyboardEvent): boolean => {
    //    this.addToParkedItem();
    //    return false; // Prevent bubbling
    //},
    //    ['INPUT', 'SELECT', 'TEXTAREA']
    //);
  }

  private addToParkedItem(data) {
    if (data) {
      if (Uti.isSearchUrl())
        this.storeMenuContextAction({
          action: 'AddToParkedItem',
          data: data,
        });
      else {
        let module = this.ofModule;
        if (
          module.idSettingsGUIParent &&
          module.idSettingsGUIParent == ModuleList.Administration.idSettingsGUI
        ) {
          module = ModuleList.Administration;
        }

        this.store.dispatch(
          this.processDataActions.requestAddToParkedItems(data, module)
        );
      }
    }
  }

  private addToDoublet(data) {
    if (data) {
      if (Uti.isSearchUrl())
        this.storeMenuContextAction({
          action: 'AddToDoublet',
          data: data,
        });
      else
        this.store.dispatch(
          this.processDataActions.requestAddToDoublet(data, this.ofModule)
        );
    }
  }

  private removeFromParkedItem(data) {
    if (data) {
      if (Uti.isSearchUrl())
        this.storeMenuContextAction({
          action: 'RemoveFromParkedItem',
          data: data,
        });
      else
        this.store.dispatch(
          this.processDataActions.requestRemoveFromParkedItems(
            data,
            this.ofModule
          )
        );
    }
  }

  private getAllModule() {
    this.globalServ.getAllSearchModules().subscribe(
      (data) => this.getAllModulesSuccess(data),
      (error) => {
        Uti.logError(error);
      }
    );
  }

  private getAllModulesSuccess(data: ApiResultResponse) {
    if (!data) return;
    this.globalSearchModuleModels = data.item;

    if (this.globalSearchModuleModels && this.globalSearchModuleModels.length) {
      this.makeSubDataForMainModule();
    }

    this.makeClientDataForAllModules();

    const currentModule = this.globalServ.getCurrentModule(
      this.globalSearchModuleModels,
      this.globalSearchModuleModelsAdminChildren,
      this.currentTab
    );

    if (currentModule) {
      this.currentTab.module = new Module(Object.assign({}, currentModule));
    }
    this.changeDetectorRef();
  }

  private makeSubDataForMainModule() {
    let item: GlobalSearchModuleModel;
    for (let i = 0; i < this.globalSearchModuleModels.length; i++) {
      item = this.globalSearchModuleModels[i];
      item.gridId = GridId.MainModuleGlobalSearch[i];
      if (
        //item.idSettingsGUI != MenuModuleId.selectionCampaign &&
        (item.idSettingsGUI != MenuModuleId.selectionBroker &&
          item.idSettingsGUI != MenuModuleId.selectionCollect) ||
        (item.children && item.children.length)
      ) {
        continue;
      }
      item.children = [
        new GlobalSearchModuleModel({
          idSettingsGUI: item.idSettingsGUI,
          idSettingsGUIParent: item.idSettingsGUI,
          moduleName: 'Active',
          iconName: 'fa-check',
          isCanNew: true,
          isCanSearch: true,
          searchIndexKey: item.searchIndexKey + 'isactive',
        }),
        new GlobalSearchModuleModel({
          idSettingsGUI: item.idSettingsGUI,
          idSettingsGUIParent: item.idSettingsGUI,
          moduleName: 'Archived',
          iconName: 'fa-archive',
          isCanNew: true,
          isCanSearch: true,
          searchIndexKey: item.searchIndexKey + 'isarchived',
        }),
      ];
      for (let s of [
        'SelectionCampaign',
        'SelectionBroker',
        'SelectionCollect',
      ]) {
        for (let j = 0; j < item.children.length; j++) {
          item.children[j].gridId = GridId[s + 'ModuleGlobalSearch'][j];
        }
      }
      //Set accessRight for Module
      this.accessRightsService.SetAccessRightsForModule(item.children);
    }
  }

  private makeClientDataForAllModules() {
    if (this.globalSearchModuleModels.length <= 0) {
      return;
    }
    // Make for master
    for (const module of this.globalSearchModuleModels) {
      module.controlClassName =
        this.searchItemBgClassName + '  ' + this.searchItemClassName;
      module.textClassName = this.searchTextClassName;
      module.mainClassName = this.mainItemClassParent;
    }
    const adminChildrenModules = this.getAdminChildrenModule();
    if (adminChildrenModules.length <= 0) {
      return;
    }
    // Make for detail
    for (const module of adminChildrenModules) {
      module.controlClassName =
        this.searchItemBgClassName + '  ' + this.searchItemClassNameSmall;
      module.textClassName = this.searchTextClassNameSmall;
      module.parentName = this.globalSearchConsts.searchAdministration;
      module.mainClassName = this.mainItemClassChild;
    }
    this.globalSearchModuleModelsAdminChildren = adminChildrenModules;
    this.addGridIdForSubAdminModule();
  }

  private addGridIdForSubAdminModule() {
    for (
      let i = 0;
      i < this.globalSearchModuleModelsAdminChildren.length;
      i++
    ) {
      this.globalSearchModuleModelsAdminChildren[i].gridId =
        GridId.SubAdminModuleGlobalSearch[i];
    }
  }

  private getAdminChildrenModule(): GlobalSearchModuleModel[] {
    const moduleAdministration = this.globalServ.getModuleByName(
      this.globalSearchModuleModels,
      this.globalSearchConsts.searchAdministration
    );
    if (
      !moduleAdministration ||
      !moduleAdministration.children ||
      moduleAdministration.children.length <= 0
    ) {
      return [];
    }
    return moduleAdministration.children;
  }

  public onClickSearch() {
    this.search(this.currentTab.textSearch);
  }

  public search(value: string) {
    this.currentTab = this.globalServ.getCurrentTabModelItem(this.tabList);

    if (this.currentTab.textSearch == value && this.globalSearchResult) {
      this.globalSearchResult.search();
    }

    this.currentTab.textSearch = value;

    const currentModule = this.globalServ.getCurrentModule(
      this.globalSearchModuleModels,
      this.globalSearchModuleModelsAdminChildren,
      this.currentTab
    );
    if (currentModule) {
      this.currentTab.module = new Module(Object.assign({}, currentModule));
    }

    this.setLoadingForModule(this.globalSearchModuleModels, true);
    if (!this.currentTab.textSearch) {
      this.globalServ.setSearchResultForModule(
        this.globalSearchModuleModels,
        null,
        this.searchItemBgClassName + '  ' + this.searchItemClassName
      );
      this.globalServ.setSearchResultForModule(
        this.globalSearchModuleModelsAdminChildren,
        null,
        this.searchItemBgClassName + '  ' + this.searchItemClassNameSmall
      );
      this.globalSearchConfig.isSearch = false;
      this.onSearchResultCompleted.emit();
      return;
    }

    //Only search all when don't stay at any tabs
    if (!this.currentTab.module) {
      // Search Admin Group.
      this.searchForAdminstration();
      // Search Other Group.
      this.searchOtherGroup();
    }
  }

  private searchOtherGroupTimeout: any;
  private searchOtherGroup() {
    clearTimeout(this.searchOtherGroupTimeout);
    this.searchOtherGroupTimeout = null;
    this.searchOtherGroupTimeout = setTimeout(() => {
      const indexSearchKeys = this.globalSearchModuleModels
        .map((p) => p.searchIndexKey)
        .filter((p) => p)
        .join(',');
      this.getSearchSummary(
        indexSearchKeys,
        this.currentTab.textSearch,
        this.globalSearchModuleModels
      ).subscribe((rs) => {
        this.appErrorHandler.executeAction(() => {
          this.onSearchResultCompleted.emit();
          this.changeDetectorRef();
        });
      });
      this.globalSearchConfig.isSearch = true;
    }, 1000);
  }

  // public component function
  public globalSearchItemClicked($event: any) {
    if (this.globalSearchConfig.isAdministrationClicked) {
      this.searchForAdminstration();
    }
    if (
      //$event.idSettingsGUI == MenuModuleId.selectionCampaign ||
      $event.idSettingsGUI == MenuModuleId.selectionBroker ||
      $event.idSettingsGUI == MenuModuleId.selectionCollect
    ) {
      this.makeClientDataForChildrenModules($event);
    }
  }

  // public component function
  public globalSearchItemDoubleClicked($event: any) {
    this.currentTab = this.globalServ.getCurrentTabModelItem(this.tabList);
    if (this.globalSearchConfig.isAdministrationClicked) {
      this.searchForAdminstration();
    }
    if (
      //$event.idSettingsGUI == MenuModuleId.selectionCampaign ||
      $event.idSettingsGUI == MenuModuleId.selectionBroker ||
      $event.idSettingsGUI == MenuModuleId.selectionCollect
    ) {
      this.makeClientDataForChildrenModules($event);
    }
    this.onMarkForCheck.emit();
  }

  /**
   * Used for Selection modules
   * @param parentModule
   */
  private makeClientDataForChildrenModules(parentModule: any) {
    const globalSearchModuleModelChildren = parentModule
      ? parentModule.children
      : {};
    if (globalSearchModuleModelChildren.length <= 0) {
      return;
    }
    // Make for detail
    for (const module of globalSearchModuleModelChildren) {
      module.controlClassName =
        this.searchItemBgClassName + '  ' + this.searchItemClassNameSmall;
      module.textClassName = this.searchTextClassNameSmall;
      module.parentName = this.globalSearchConsts.searchAdministration;
      module.mainClassName = this.mainItemClassChild;
    }
    this.globalSearchModuleModelsAdminChildren =
      globalSearchModuleModelChildren;
  }

  private searchForAdminstrationTimeout: any;
  private searchForAdminstration() {
    clearTimeout(this.searchForAdminstrationTimeout);
    this.searchForAdminstrationTimeout = null;

    this.searchForAdminstrationTimeout = setTimeout(() => {
      if (!this.currentTab.textSearch) {
        this.globalServ.setSearchResultForModule(
          this.globalSearchModuleModelsAdminChildren,
          null,
          this.searchItemBgClassName + '  ' + this.searchItemClassNameSmall
        );
        this.globalSearchConfig.isSearch = false;
        return;
      }

      // Get Count Summary for Administrator
      const adminModule = this.globalSearchModuleModels.filter(
        (p) => p.idSettingsGUI === 1
      );
      if (adminModule.length > 0) {
        this.setLoadingForModule(
          this.globalSearchModuleModelsAdminChildren,
          true
        );
        const indexSearchKeys = this.globalSearchModuleModelsAdminChildren
          .map((p) => p.searchIndexKey)
          .join(',');

        this.getSearchSummary(
          indexSearchKeys,
          this.currentTab.textSearch,
          this.globalSearchModuleModelsAdminChildren
        ).subscribe((rs) => {
          this.appErrorHandler.executeAction(() => {
            adminModule[0].isLoading = false;
            adminModule[0].searchResult = rs;
            adminModule[0].isSearchEmpty = adminModule[0].searchResult === 0;
            this.onSearchResultCompleted.emit();
            this.changeDetectorRef();
          });
        });
      }
    }, 500);
  }

  private getSearchSummary(
    idexSearchKeys: string,
    textSearch: string,
    searchModuleModels: Array<GlobalSearchModuleModel>
  ) {
    return this.globalServ
      .getSearchSummary(textSearch, idexSearchKeys, this.isWithStar)
      .map((indexSearchSummaries) => {
        let count = 0;
        for (const indexSearchSummary of indexSearchSummaries.item) {
          count += indexSearchSummary.count;
          const rs = searchModuleModels.filter(
            (p) => p.searchIndexKey === indexSearchSummary.key
          );
          if (!rs || !rs.length) continue;

          rs[0].searchResult = indexSearchSummary.count;
          rs[0].isLoading = false;
          rs[0].isSearchEmpty = rs[0].searchResult === 0;

          // Used for Selection modules
          if (
            //rs[0].idSettingsGUI != MenuModuleId.selectionCampaign &&
            (rs[0].idSettingsGUI != MenuModuleId.selectionBroker &&
              rs[0].idSettingsGUI != MenuModuleId.selectionCollect) ||
            !rs[0].children ||
            !rs[0].children.length
          ) {
            continue;
          }
          // Set search result for children Item
          for (let child of rs[0].children) {
            const currentChildResult = indexSearchSummaries.item.find(
              (x) => x.key === child.searchIndexKey
            );
            if (currentChildResult) {
              child.searchResult = currentChildResult.count;
              child.isLoading = false;
              child.isSearchEmpty = currentChildResult.count === 0;
            }
          }
        }
        return count;
      });
  }

  public searchEachItem(keyWord: string, model: GlobalSearchModuleModel) {
    this.globalServ
      .getSearchSummary(keyWord, model.searchIndexKey, this.isWithStar)
      .finally(() => (model.isLoading = false))
      .subscribe(
        (data) => this.getSearchSummarySuccess(data.item, model),
        (error) => {
          Uti.logError(error);
        }
      );
  }

  private getSearchSummarySuccess(
    data: Array<any>,
    model: GlobalSearchModuleModel
  ) {
    model.isLoading = false;
    let count = 0;
    if (data && data.length > 0) {
      const rs = data.filter((p) => p.key === model.searchIndexKey);
      if (rs.length > 0) {
        count = rs[0].count;
      }
    }
    model.searchResult = count;
    model.isSearchEmpty = model.searchResult === 0;
    model.controlClassName =
      this.searchItemBgClassNameSearched +
      '  ' +
      (model.parentName
        ? this.searchItemClassNameSmall
        : this.searchItemClassName);
    this.changeDetectorRef();
  }

  private setLoadingForModule(
    modules: GlobalSearchModuleModel[],
    loading: boolean
  ) {
    for (const item of modules) {
      item.isLoading = loading;
    }
    this.changeDetectorRef();
  }

  private pinGroupTranslateClick(event) {
    this.onPinGroupTranslateClick.emit(event);
  }

  public onTableRowClicked(data) {
    let tabInfo = this.currentTab;

    if (
      this.activeModule.idSettingsGUI == MenuModuleId.administration &&
      data.idRepPersonType
    ) {
      for (let key in this.moduleToPersonType) {
        if (this.moduleToPersonType[key] == data.idRepPersonType) {
          tabInfo.moduleID = key;
        }
      }
    }

    const currentModule = this.globalServ.getCurrentModule(
      this.globalSearchModuleModels,
      this.globalSearchModuleModelsAdminChildren,
      this.currentTab
    );

    const selectedModule = new Module(currentModule);
    const status = this.moduleService.loadContentDetailBySelectedModule(
      selectedModule,
      this.activeModule,
      this.activeSubModule,
      this.mainModules
    );
    if (status) {
      this.willSelectSearchResult = data;
      setTimeout(() => {
        if (
          this.activeModule.idSettingsGUI == MenuModuleId.administration &&
          this.currentTab.moduleID
        ) {
          this.onTableRowClicked(data);
        }
      }, 1000);
    } else {
      this.addSearchResultDataToStore(Object.assign({}, data));
    }

    this.store.dispatch(
      this.globalSearchActions.rowDoubleClick({
        data,
        selectedModule,
      })
    );
  }

  public makeContextMenu(data?: any) {
    return this.makeMenuRightClick(uti.Uti.mapObjectToCamel(data));
  }

  /******************************* */

  private addSearchResultDataToStore(data) {
    let module: Module = this.ofModule;
    if (
      this.ofModule.idSettingsGUIParent &&
      this.ofModule.idSettingsGUIParent == MenuModuleId.administration
    ) {
      module = this.mainModules.find(
        (m) => m.idSettingsGUI == MenuModuleId.administration
      );
    }

    this.store.dispatch(
      this.processDataActions.selectSearchResult(data, module)
    );
    this.selectedSearchResult = data;
  }

  private subcribeModulePrimaryKeyState() {
    this.modulePrimaryKeyStateSubscription =
      this.modulePrimaryKeyState.subscribe((modulePrimaryKeyState: string) => {
        this.appErrorHandler.executeAction(() => {
          this.modulePrimaryKey = modulePrimaryKeyState;
        });
      });
  }
  private subcribeParkedItemsState() {
    this.parkedItemsStateSubscription = this.parkedItemsState.subscribe(
      (parkedItemsState: ParkedItemModel[]) => {
        this.appErrorHandler.executeAction(() => {
          this.parkedItems = parkedItemsState;
        });
      }
    );
  }

  private subcribeLoadParkedItemsCompletedState() {
    this.loadParkedItemsCompletedSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === ProcessDataActions.LOAD_PARKED_ITEMS_COMPLETED;
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (this.willSelectSearchResult) {
            this.addSearchResultDataToStore(this.willSelectSearchResult);

            if (
              this.ofModule &&
              this.ofModule.idSettingsGUI == MenuModuleId.warehouseMovement
            ) {
              this.store.dispatch(
                this.tabSummaryActions.requestUpdateTabHeader(
                  this.willSelectSearchResult[this.modulePrimaryKey],
                  this.ofModule
                )
              );
            }

            this.willSelectSearchResult = null;
          }
        });
      });
  }

  private createGridMenuContextData(data: any) {
    let result: any = [];

    if (this.accessRight.read) {
      result.push({
        name: `<span class="pull-left">Add to parked items</span>
                       <span class="ag-context-shortcut"></span>`, //Ctrl+P
        action: (event) => {
          this.addToParkedItem(data);
        },
        cssClasses: [''],
        icon: `<i class="fa  fa-plus  green-color  ag-context-icon"/>`,
        key: 'AddToParkedItems',
      });
      result.push({
        name: 'Remove from parked items',
        action: (event) => {
          this.removeFromParkedItem(data);
        },
        cssClasses: [''],
        icon: `<i class="fa  fa-times  red-color  ag-context-icon"/>`,
        key: 'RemoveFromParkedItems',
      });
    }

    if (this.currentTab.searchIndex.toLowerCase() === 'customer') {
      result.push({
        name: 'Add to doublet',
        action: (event) => {
          this.addToDoublet(data);
        },
        cssClasses: [''],
        icon: `<i class="fa  fa-plus-circle  green-color  ag-context-icon"/>`,
      });
    }
    if (result.length) result.push('separator');

    return result;
  }

  public makeMenuRightClick(data: any) {
    const menuContext: any = this.createGridMenuContextData(data);

    if (this.accessRight.read) {
      const id = data[this.modulePrimaryKey];
      const currentParkedItem = this.parkedItems.find(
        (x) => x.id && x.id.value == id
      );
      const hasNotParkedItem = isEmpty(currentParkedItem);

      for (let menuItem of menuContext) {
        if (menuItem !== 'string') {
          if (menuItem.key === 'AddToParkedItems')
            menuItem.cssClasses = !hasNotParkedItem ? ['xn-disabled'] : [''];
          else if (menuItem.key === 'RemoveFromParkedItems')
            menuItem.cssClasses = hasNotParkedItem ? ['xn-disabled'] : [''];
        }
      } //for
    }

    return menuContext;
  }

  private storeMenuContextAction(data) {
    if (!Configuration.PublicSettings.enableGSNewWindow) return;

    this.store.dispatch(this.globalSearchActions.menuContextAction(data));
  }

  /**
   * onSearchCompleted
   */
  public onSearchCompleted() {
    this.onSearchResultCompleted.emit();
  }

  private changeDetectorRef() {
    setTimeout(() => {
      this._changeDetectorRef.markForCheck();
      this._changeDetectorRef.detectChanges();
    }, 300);
  }

  public texClickedHandler(curentHistoryItem: any) {
    this.search(curentHistoryItem.text);
  }

  public addToHistoryHandler(event: any) {
    if (!this.currentTab || !this.currentTab.histories) return;
    this.getGlobalAndSaveData(event);
  }

  public deleteItemHandler(item: any) {
    Uti.removeItemInArray(this.currentTab.histories, item, 'text');
    this.getGlobalAndSaveData();
  }

  public deleteAllHandler() {
    this._modalService.confirmDeleteMessageHtmlContent({
      headerText: 'Delete data',
      message: [
        { key: '<p>' },
        {
          key: 'Modal_Message__Are_You_Sure_You_Want_To_Delete_All_Items',
        },
        { key: '</p>' },
      ],
      callBack1: () => {
        this.currentTab.histories.length = 0;
        this.changeDetectorRef();
        this.getGlobalAndSaveData();
      },
    });
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/

  private globalSettingItem: any = {};

  private getGlobalAndSaveData(addNewItem?: any) {
    this._globalSettingService
      .getAllGlobalSettings('-1')
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          let globalSettingName = String.Format(
            '{0}_{1}',
            this._globalSettingConstant.gsHistoryTabSearching,
            this.currentTab.title.replace(/ /g, '')
          );

          this.globalSettingItem = data.find(
            (x) => x.globalName === globalSettingName
          );

          if (
            !this.globalSettingItem ||
            !this.globalSettingItem.idSettingsGlobal ||
            !this.globalSettingItem.globalName
          ) {
            this.globalSettingItem = new GlobalSettingModel({
              globalName: globalSettingName,
              description: 'Global Search History Tab Searching',
              globalType: this._globalSettingConstant.gsHistoryTabSearching,
              idSettingsGUI: '-1',
              isActive: true,
              objectNr: '-1',
            });
          }
          if (addNewItem) {
            if (
              !this.currentTab.histories ||
              !this.currentTab.histories.length
            ) {
              this.currentTab.histories = Uti.tryParseJson(
                this.globalSettingItem.jsonSettings,
                []
              );
            }
            // If exists dont need update to global setting
            if (this.checkAndAddNewItem(addNewItem)) return;
          }
          this.globalSettingItem.jsonSettings = JSON.stringify(
            this.buildGSHistoryDataForSaving()
          );
          this.globalSettingItem.idSettingsGUI = '-1';

          this._globalSettingService
            .saveGlobalSetting(this.globalSettingItem)
            .subscribe(
              (response) => this.saveGlobalSuccess(response),
              (error) => this.saveGlobalError(error)
            );
        });
      });
  }

  private checkAndAddNewItem(addNewItem) {
    let isExistedItem: boolean = false;
    for (let item of this.currentTab.histories) {
      item.active = false;
      if (item.text === addNewItem.keyword) {
        item.num = addNewItem.numberOfResult;
        item.active = true;
        isExistedItem = true;
      }
    }
    if (isExistedItem) return true;
    this.currentTab.histories.push({
      text: addNewItem.keyword,
      num: addNewItem.numberOfResult,
      active: true,
    });
    this.limitHistoriesLength();
    return false;
  }

  private limitHistoriesLength() {
    if (this.currentTab.histories.length < this.limitHistoriesNumber + 1) {
      return;
    }
    this.currentTab.histories.shift();
  }

  private buildGSHistoryDataForSaving(): Array<any> {
    if (!this.currentTab.histories || !this.currentTab.histories.length)
      return [];
    return this.currentTab.histories.map((x) => {
      return {
        text: x.text,
        active: x.active,
      };
    });
  }

  private saveGlobalSuccess(response: any) {
    this._globalSettingService.saveUpdateCache(
      this.ofModule.idSettingsGUI,
      this.globalSettingItem,
      response
    );
  }

  private saveGlobalError(response: any) {
    // handle after save golbal setting error
  }
}
