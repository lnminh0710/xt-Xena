import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  GlobalSearchConstant,
  PageSize,
  Configuration,
  MenuModuleId,
} from 'app/app.constants';
import { TabModel, Module, SearchResultItemModel } from 'app/models';
import { ResizeEvent } from 'angular-resizable-element';
import { AppErrorHandler } from 'app/services';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from 'app/state-management/store';
import { SubLayoutInfoState } from 'app/state-management/store/reducer';
import { TabSummaryActions } from 'app/state-management/store/actions';
import { LayoutInfoActions } from 'app/state-management/store/actions';
import {
  SearchResultActions,
  XnCommonActions,
  GlobalSearchActions,
  CustomAction,
  ProcessDataActions,
} from 'app/state-management/store/actions';
import { Uti } from 'app/utilities';
import { GlobalSearchTabComponent } from '../../components/gs-tab';
import { BaseComponent } from 'app/pages/private/base';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as layoutInfoReducer from 'app/state-management/store/reducer/layout-info';
import * as commonReducer from 'app/state-management/store/reducer/xn-common';
import * as moduleSettingReducer from 'app/state-management/store/reducer/module-setting';
import { TabDirective } from 'ngx-bootstrap';
import { UUID } from 'angular2-uuid';
import { ModuleService, ModalService } from 'app/services';
import { LocalStorageKey } from 'app/app.constants';

@Component({
  selector: 'gs-main',
  styleUrls: ['./gs-main.component.scss'],
  templateUrl: './gs-main.component.html',
  host: {
    //'(document:keydown)': 'onKeyDown($event)',
    '(mouseenter)': 'onMouseEnter()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchMainComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public static PIN_CLASS_NAME = 'global-search__pin';
  public static UN_PIN_CLASS_NAME = 'global-search__unpin';

  public isCollapsed = true;
  public showFakedHeading = true;
  public allowResize = false;
  public isWithStar: boolean = false;
  public indeterminate = false;
  public activeModule: Module = null;
  public activeSubModule: Module = null;
  public mainModules: Module[] = [];
  public pinIconClassName: string = GlobalSearchMainComponent.UN_PIN_CLASS_NAME;
  public mainContainerStyle: Object = {};
  public mainContentStyle: Object = {
    height: this.pageSize.GlobalSearchDefaultSize + 'px',
  };
  public enableGSNewWindow: boolean =
    Configuration.PublicSettings.enableGSNewWindow;
  public mainModulesState: Observable<Module[]>;
  public subModulesState: Observable<Module[]>;
  public activeModuleState: Observable<Module>;
  public activeSubModuleState: Observable<Module>;
  public isViewModeState: Observable<boolean>;
  // public activeAdvanceSearchStatus: boolean;

  // private globalSearchHeight: string;
  private isPopupOpening: boolean = false;
  private removeTabHander = false;
  private isPinGroup = false;
  private modulePrimaryKey = '';
  private willSelectSearchResult: SearchResultItemModel = null;

  private isViewMode = true;
  private _showFullPage: boolean = false;
  private contextMenuClicked = false;
  private layoutInfo: any;
  private searchingModuleState: Observable<Module>;
  private layoutInfoModel: Observable<SubLayoutInfoState>;
  private modulePrimaryKeyState: Observable<string>;
  private parkedItemHeight: string;
  private mainContentHeight: string;
  private keyBuffer: any = [];
  private controlKeyNumber: any = 17; // control key
  private fKeyNumber: any = 70; // f key
  private keyCombinate: any = [this.controlKeyNumber, this.fKeyNumber]; // control + f

  private layoutInfoModelSubscription: Subscription;
  private xnContextMenuClickedState: Observable<boolean>;
  private xnContextMenuClickedStateSubcription: Subscription;
  private requestTogglePanelState: Observable<any>;
  private requestTogglePanelStateSubscription: Subscription;
  private searchingModuleStateSubcription: Subscription;
  private isViewModeStateSubscription: Subscription;
  // Used for local storage sync
  private searchKeywordLocalStorageSubscription: Subscription;
  private closeModuleTabLocalStorageSubscription: Subscription;
  private activeModuleTabLocalStorageSubscription: Subscription;
  private menuContextActionLocalStorageSubscription: Subscription;
  private activeModuleStateSubscription: Subscription;
  private activeSubModuleStateSubscription: Subscription;
  private mainModulesStateSubscription: Subscription;
  private changeItemLocalStorageSubscription: Subscription;
  private rowDoubleClickLocalStorageSubscription: Subscription;
  private loadParkedItemsCompletedSubscription: Subscription;
  private modulePrimaryKeyStateSubscription: Subscription;

  @ViewChild('searchContainer')
  private searchContainerRef: ElementRef;

  @ViewChildren('globalSearchTabForm')
  private globalSearchTabForms: QueryList<GlobalSearchTabComponent>;

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick($event) {
    this.onClick($event);
  }

  @HostListener('document:keydown.out-zone', ['$event'])
  onKeyDown($event) {
    this.pushIntoBuffer($event.keyCode);
    if (Uti.arraysEqual(this.keyCombinate, this.keyBuffer)) {
      $event.preventDefault();
      this.collapse(false);
      this.keyBuffer = [];
      setTimeout(() => {
        this.focusSearchTextbox();
      }, 300);
      this.changeDetectorRef();
    }
  }

  @Input() set showFullPage(data: boolean) {
    this._showFullPage = data;
    if (data) {
      this.store.dispatch(this.searchResultActions.expand());
    }
  }

  get showFullPage() {
    return this._showFullPage;
  }

  @Input() set tabs(data: TabModel[]) {
    this._tabs = data;

    if (!data || !data.length) return;

    setTimeout(() => {
      if (
        (!this.globalSearchTabForms || this.globalSearchTabForms.length != 1) &&
        !this._tabs[0].active
      )
        return;

      this.globalSearchTabForms.first.search(this.tabs[0].textSearch);
      this.changeDetectorRef();
    }, 1000);
  }

  get tabs() {
    return this._tabs;
  }

  private browserTabId: string = Uti.defineBrowserTabId();

  constructor(
    private _eref: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    public globalSearchConsts: GlobalSearchConstant,
    private pageSize: PageSize,
    private store: Store<AppState>,
    private tabSummaryActions: TabSummaryActions,
    private layoutInfoActions: LayoutInfoActions,
    private searchResultActions: SearchResultActions,
    private xnCommonActions: XnCommonActions,
    private globalSearchActions: GlobalSearchActions,
    private appErrorHandler: AppErrorHandler,
    private dispatcher: ReducerManagerDispatcher,
    protected router: Router,
    private processDataActions: ProcessDataActions,
    private moduleService: ModuleService,
    private modalService: ModalService
  ) {
    super(router);

    this.layoutInfoModel = store.select((state) =>
      layoutInfoReducer.getLayoutInfoState(state, this.ofModule.moduleNameTrim)
    );
    this.mainModulesState = store.select(
      (state) => state.mainModule.mainModules
    );
    this.subModulesState = store.select((state) => state.mainModule.subModules);
    this.activeModuleState = store.select(
      (state) => state.mainModule.activeModule
    );
    this.activeSubModuleState = store.select(
      (state) => state.mainModule.activeSubModule
    );
    this.searchingModuleState = store.select(
      (state) => state.mainModule.searchingModule
    );
    this.xnContextMenuClickedState = this.store.select(
      (state) =>
        commonReducer.getCommonState(state, this.ofModule.moduleNameTrim)
          .contextMenuClicked
    );
    this.requestTogglePanelState = this.store.select(
      (state) => state.searchResult.requestTogglePanel
    );
    this.isViewModeState = this.store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).isViewMode
    );
    this.modulePrimaryKeyState = this.store.select(
      (state) =>
        moduleSettingReducer.getModuleSettingState(
          state,
          this.ofModule.moduleNameTrim
        ).modulePrimaryKey
    );
  }

  onRouteChanged() {
    this.buildModuleFromRoute();

    setTimeout(() => {
      // this.updateHeightToStore(this.isCollapsed);
      this.clearTextFixForEdge();
    }, 100);
  }

  public ngOnInit() {
    this.subscibeData();
    //setTimeout(() => {
    //	this.updateHeightToStore(this.isCollapsed);
    //	this.clearTextFixForEdge();
    //}, 100);

    this.showFakedHeading = !this.showFullPage;
    this.isCollapsed = !this.showFullPage;
    this.registerUnloadPage();
    this.store.dispatch(this.globalSearchActions.updateTab(this.tabs));
  }

  private timeScan = 0;
  private clearTextFixForEdge() {
    if (this.timeScan > 50) return;
    const txt = $('#txt-global-search-0');
    if (!txt.length) {
      this.timeScan++;
      setTimeout(() => {
        this.clearTextFixForEdge();
      }, 100);
      return;
    }
    txt.val('');
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public ngAfterViewInit() {}

  private subscibeData() {
    this.layoutInfoModelSubscription = this.layoutInfoModel.subscribe(
      (layoutInfo: SubLayoutInfoState) => {
        this.appErrorHandler.executeAction(() => {
          // this.globalSearchHeight = layoutInfo.globalSearchHeight;
          this.parkedItemHeight = layoutInfo.parkedItemHeight;
          this.mainContentHeight = layoutInfo.mainContentHeight;
          this.layoutInfo = layoutInfo;

          this.mainContainerStyle[
            'width'
          ] = `calc(100vw - ${layoutInfo.rightMenuWidth}px)`;
        });
      }
    );
    this.xnContextMenuClickedStateSubcription =
      this.xnContextMenuClickedState.subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!data) {
            return;
          }
          this.contextMenuClicked = !!data.contextMenuClicked;
        });
      });

    this.requestTogglePanelStateSubscription =
      this.requestTogglePanelState.subscribe((requestTogglePanelState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            requestTogglePanelState &&
            this.isCollapsed !== !this.requestTogglePanelState['isShow']
          ) {
            this.headerClick(null, true);
          }
        });
      });

    this.searchingModuleStateSubcription = this.searchingModuleState.subscribe(
      (searchModule: Module) => {
        this.appErrorHandler.executeAction(() => {
          if (searchModule && searchModule.searchKeyword) {
            setTimeout(() => {
              this.collapse(false);
              // this.isPinGroup = true;
              // this.pinIconClassName = GlobalSearchMainComponent.PIN_CLASS_NAME;
              // Search All
              if (searchModule.idSettingsGUI == -1) {
                if (this.tabs && this.tabs.length) {
                  this.tabs[0].textSearch = searchModule.searchKeyword;
                  this.tabs[0].active = true;
                  if (
                    this.globalSearchTabForms &&
                    this.globalSearchTabForms.length
                  ) {
                    this.search(
                      this.tabs[0],
                      this.globalSearchTabForms.first,
                      this.tabs[0].textSearch
                    );
                  }
                }
              }
              this.markForCheck();
            });
          }
        });
      }
    );

    this.isViewModeStateSubscription = this.isViewModeState.subscribe(
      (isViewModeState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          this.isViewMode = isViewModeState;
        });
      }
    );

    this.activeModuleStateSubscription = this.activeModuleState.subscribe(
      (data) => {
        this.appErrorHandler.executeAction(() => {
          this.activeModule = data;
        });
      }
    );

    this.activeSubModuleStateSubscription = this.activeSubModuleState.subscribe(
      (data) => {
        this.appErrorHandler.executeAction(() => {
          this.activeSubModule = data;
        });
      }
    );

    this.mainModulesStateSubscription = this.mainModulesState.subscribe(
      (data) => {
        this.appErrorHandler.executeAction(() => {
          this.mainModules = data;
        });
      }
    );

    // Used for local storage sync
    if (Configuration.PublicSettings.enableGSNewWindow) {
      this.subscribeClosePopupLocalStorageState();
      this.subscribeMenuContextActionLocalStorageState();
      this.subscribeChangeItemLocalStorageState();
      this.subscribeRowDoubleClickLocalStorageState();
      this.subcribeLoadParkedItemsCompletedState();
      this.subcribeModulePrimaryKeyState();
    }
  }

  private subscribeClosePopupLocalStorageState() {
    this.activeModuleTabLocalStorageSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === GlobalSearchActions.CLOSE_POPUP_STORAGE;
      })
      .subscribe((data: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          if (data.browserTabId && data.browserTabId != this.browserTabId)
            return;

          this.handleAfterPopupClosed();
          this.restoreTab();
        });
      });
  }

  private handleAfterPopupClosed(isPopupOpening?: boolean) {
    this.isCollapsed = !this.isCollapsed;
    this.isPopupOpening =
      isPopupOpening !== undefined ? isPopupOpening : !this.isPopupOpening;
    this.showFakedHeading = !this.showFakedHeading;
    this.changeDetectorRef();
  }

  /**
   * restoreTab
   **/
  public restoreTab() {
    const data = localStorage.getItem(
      LocalStorageKey.buildKey(
        LocalStorageKey.LocalStorageGSTabKey,
        this.browserTabId
      )
    );
    if (data) {
      this.tabs = JSON.parse(data).tabs;
    }
  }

  private subscribeMenuContextActionLocalStorageState() {
    this.menuContextActionLocalStorageSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === GlobalSearchActions.MENU_CONTEXT_ACTION_STORAGE;
      })
      .subscribe((data: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !data ||
            !data.payload ||
            !data.payload.action ||
            !data.payload.data
          )
            return;

          if (data.browserTabId && data.browserTabId != this.browserTabId)
            return;

          switch (data.payload.action) {
            case 'AddToParkedItem':
              this.store.dispatch(
                this.processDataActions.requestAddToParkedItems(
                  data.payload.data,
                  this.ofModule
                )
              );
              break;
            case 'RemoveFromParkedItem':
              this.store.dispatch(
                this.processDataActions.requestRemoveFromParkedItems(
                  data.payload.data,
                  this.ofModule
                )
              );
              break;
            case 'AddToDoublet':
              this.store.dispatch(
                this.processDataActions.requestAddToDoublet(
                  data.payload.data,
                  this.ofModule
                )
              );
              break;
          }
        });
      });
  }

  /**
   * subscribeChangeItemLocalStorageState
   */
  private subscribeChangeItemLocalStorageState() {
    if (!Configuration.PublicSettings.enableGSNewWindow) return;

    this.changeItemLocalStorageSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === GlobalSearchActions.CHANGE_MODULE_TAB_STORAGE;
      })
      .subscribe((data: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          if (
            data &&
            data.browserTabId &&
            data.browserTabId != this.browserTabId
          )
            return;

          const selectedModule = new Module(data.payload);
          this.moduleService.loadContentDetailBySelectedModule(
            selectedModule,
            this.activeModule,
            this.activeSubModule,
            this.mainModules
          );
        });
      });
  }

  private subscribeRowDoubleClickLocalStorageState() {
    if (!Configuration.PublicSettings.enableGSNewWindow) return;

    this.rowDoubleClickLocalStorageSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === GlobalSearchActions.ROW_DOUBLE_CLICK_STORAGE;
      })
      .subscribe((action: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          if (action && action.payload) {
            if (action.browserTabId && action.browserTabId != this.browserTabId)
              return;

            const selectedModule = action.payload.selectedModule;
            const data = action.payload.data;
            const status = this.moduleService.loadContentDetailBySelectedModule(
              selectedModule,
              this.activeModule,
              this.activeSubModule,
              this.mainModules
            );
            if (status) {
              this.willSelectSearchResult = data;
            } else {
              this.addSearchResultDataToStore(Object.assign({}, data));
            }
          }
        });
      });
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

  private subcribeModulePrimaryKeyState() {
    this.modulePrimaryKeyStateSubscription =
      this.modulePrimaryKeyState.subscribe((modulePrimaryKeyState: string) => {
        this.appErrorHandler.executeAction(() => {
          this.modulePrimaryKey = modulePrimaryKeyState;
        });
      });
  }

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
  }

  private isClickInsideRect(mouseEvent) {
    const clientX = mouseEvent.clientX;
    const clientY = mouseEvent.clientY;
    if (this.searchContainerRef) {
      const rect =
        this.searchContainerRef.nativeElement.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.left + rect.width &&
        clientY >= rect.top &&
        clientY <= rect.top + rect.height
      ) {
        return true;
      }
    }
    return false;
  }

  public onClick(event) {
    if (this.isPinGroup || (event && event.defaultPrevented)) return;
    if (this.contextMenuClicked) {
      this.store.dispatch(
        this.xnCommonActions.contextMenuClicked(false, this.ofModule)
      );
      return;
    }

    if (this.isClickInsideRect(event)) {
      return;
    }

    if (
      !this._eref.nativeElement.contains(event.target) &&
      !this.isCollapsed &&
      !this.removeTabHander
    ) {
      //prevent collapse if existing the modal dialog
      if (
        event &&
        event.target &&
        event.target.className &&
        typeof event.target.className.indexOf === 'function'
      ) {
        if (
          event.target.className.indexOf('xn-modal') !== -1 ||
          event.target.className.indexOf('ag-menu-option-icon') !== -1 ||
          (event.target.parentNode &&
            event.target.parentNode.className.indexOf('ag-menu-option-icon') !==
              -1) ||
          event.target.className.indexOf('ag-menu-option-text') !== -1 ||
          (event.target.parentNode &&
            event.target.parentNode.className &&
            event.target.parentNode.className.indexOf('ag-menu-option-text') !==
              -1) ||
          event.target.className.indexOf('ag-menu-option-shortcut') !== -1 ||
          event.target.className.indexOf('ag-menu-option-popup-pointer') !==
            -1 ||
          (event.target.download && event.target.download === 'export.csv') ||
          (event.target.download && event.target.download === 'export.xlsx') ||
          (event.target.download && event.target.download === 'export.xlm') ||
          $(event.target).parents('.modal-dialog').length
        ) {
          this.removeTabHander = false;
          return;
        }
      }

      this.isCollapsed = true;
      setTimeout(() => {
        this.showFakedHeading = !this.showFullPage ? true : false;
        this.allowResize = false;
        this.changeDetectorRef();
      }, 250);

      // this.updateHeightToStore(this.isCollapsed);

      if (this.isCollapsed) {
        this.store.dispatch(this.searchResultActions.collapse());
      } else {
        this.store.dispatch(this.searchResultActions.expand());
      }
    }

    // Keeping global search panel is expanded.
    this.removeTabHander = false;
  }

  private pushIntoBuffer(keyCode) {
    if (
      !this.keyBuffer ||
      this.keyBuffer.indexOf(keyCode) > -1 ||
      this.keyCombinate.indexOf(keyCode) < 0 ||
      (keyCode === this.fKeyNumber &&
        this.keyBuffer.indexOf(this.controlKeyNumber) < 0)
    )
      return;
    this.keyBuffer.push(keyCode);
    setTimeout(() => {
      this.keyBuffer = [];
    }, 200);
  }

  private focusSearchTextbox() {
    const searchInputs = $('.gs__search-text-input');
    if (!searchInputs || !searchInputs.length) {
      return;
    }
    let input: any;
    for (const item of <any>searchInputs) {
      input = $(item);
      if (input.is(':visible')) {
        setTimeout(() => {
          input.focus();
        }, 100);
        return;
      }
    }
  }

  public onMouseEnter() {
    this.store.dispatch(
      this.tabSummaryActions.toggleTabButton(false, this.ofModule)
    );
  }

  public collapsed(event: any): void {
    this.allowResize = false;
  }

  public expanded(event: any): void {
    this.allowResize = true;
  }

  private _tabs: TabModel[] = [
    {
      id: UUID.UUID(),
      title: this.globalSearchConsts.searchAll,
      active: true,
      removable: false,
      textSearch: '*',
      module: null,
      searchIndex: '',
      isLoading: false,
      isWithStar: this.isWithStar,
      histories: [],
      activeAdvanceSearchStatus: false,
    },
  ];

  //public tabs: TabModel[] = [
  //    {
  //        id: UUID.UUID(),
  //        title: this.globalSearchConsts.searchAll,
  //        active: true,
  //        removable: false,
  //        textSearch: '*',
  //        module: null,
  //        searchIndex: '',
  //        isLoading: false,
  //        isWithStar: this.isWithStar
  //    }
  //];

  public removeTabHandler(tabz: TabModel, fromStorage?) {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].title === tabz.title) {
        this.tabs[i - 1].active = true;
        this.tabs.splice(i, 1);
        break;
      }
    }
    // Keeping global search panel is expanded.
    this.removeTabHander = true;

    if (Configuration.PublicSettings.enableGSNewWindow) {
      if (!fromStorage) {
        this.store.dispatch(this.globalSearchActions.closeModuleTab(tabz));
        this.store.dispatch(this.globalSearchActions.updateTab(this.tabs));
      }
      this.changeDetectorRef();
    }
  }

  public globalSearchItemClicked(event: any) {
    this.mainContainerStyle = {
      position: 'fixed',
      left: '0',
      top: '',
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`,
    };
  }

  public onResizeEnd(event: ResizeEvent) {
    if (this.isCollapsed || !this.allowResize) {
      return;
    }

    let newTop, newHeight;
    if (event.rectangle.top <= parseInt(this.layoutInfo.headerHeight, null)) {
      newTop = parseInt(this.layoutInfo.headerHeight, null) + 10;
      newHeight = event.rectangle.bottom - newTop;
    } else {
      newTop = event.rectangle.top;
      newHeight = event.rectangle.height;
    }

    this.mainContainerStyle = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${newTop}px`,
      width: `${event.rectangle.width}px`,
      height: `${newHeight}px`,
    };

    this.mainContentStyle['height'] = `${
      newHeight - this.pageSize.GlobalSearchHeaderSize
    }px`;

    setTimeout(() => {
      this.reCalculateHeightForGlobalSearchContent();
    }, 200);
    // Dont re-calculate the page content height
    // this.store.dispatch(this.layoutInfoActions.setGlobalSearchHeight(event.rectangle.height.toString(), this.ofModule));
  }

  private reCalculateHeightForGlobalSearchContent() {
    const gsMainHeight = $('#global-search-container').innerHeight();
    const gsHeadingHeight = $('#global-search-heading').innerHeight();
    const gsSearchInputHeight = $('#gs__search-input').innerHeight();
    const gsTabContent = $('#gs-tab-content');
    const headerSpacing = 15;
    const tabSize = 45;
    const tabSpacing = 5;
    const footerSpacing = 15;
    const history = 11;
    gsTabContent.height(
      gsMainHeight -
        gsHeadingHeight -
        gsSearchInputHeight -
        headerSpacing -
        tabSpacing -
        footerSpacing -
        tabSize -
        history
    );
  }

  public headerClick(event: any, force?: boolean) {
    if ((!force && !this.isViewMode) || this.isPopupOpening) {
      return;
    }

    this.collapse(!this.isCollapsed, force);
  }

  private collapse(value, force?) {
    if (!force && this.isPinGroup) {
      return;
    }

    if (force && this.isPinGroup) {
      this.pinGlobalSearchGroup();
    }

    this.isCollapsed = value;

    if (this.isCollapsed) {
      setTimeout(() => {
        this.showFakedHeading = !this.showFullPage ? true : false;
        this.allowResize = false;
        this.changeDetectorRef();
      }, 250);
    } else {
      this.showFakedHeading = false;
      this.allowResize = true;
      this.changeDetectorRef();
    }

    // this.updateHeightToStore(this.isCollapsed);

    setTimeout(() => {
      this.reCalculateHeightForGlobalSearchContent();
    }, 500);

    if (this.isCollapsed) {
      this.store.dispatch(this.searchResultActions.collapse());
    } else {
      this.store.dispatch(this.searchResultActions.expand());
    }
  }

  // private updateHeightToStore(isCollapsed) {
  //     // Dont re-calculate page content height
  //     // if (isCollapsed) {
  //     //     this.store.dispatch(this.layoutInfoActions.setGlobalSearchHeight('0', this.ofModule));
  //     // } else {
  //     //     setTimeout(() => {
  //     //         this.store.dispatch(this.layoutInfoActions.setGlobalSearchHeight(this._eref.nativeElement.firstChild ? this._eref.nativeElement.firstChild.offsetHeight.toString() : '0', this.ofModule));
  //     //     }, 200);
  //     // }
  // }

  public pinGlobalSearchGroup() {
    this.isPinGroup = !this.isPinGroup;
    this.pinIconClassName = this.isPinGroup
      ? GlobalSearchMainComponent.PIN_CLASS_NAME
      : GlobalSearchMainComponent.UN_PIN_CLASS_NAME;

    if (!this.isPinGroup) {
      this.headerClick(null);
    }
  }

  public turnOnPinGroupTranslateClick(event) {
    if (event) {
      this.isPinGroup = true;
      this.pinIconClassName = GlobalSearchMainComponent.PIN_CLASS_NAME;
    }
  }

  /**
   * markForCheck
   */
  public markForCheck() {
    if (this.globalSearchTabForms) {
      this.globalSearchTabForms.forEach((item) => {
        item._changeDetectorRef.markForCheck();
      });
    }
  }

  /**
   * onSearchResultCompleted
   */
  public onSearchResultCompleted(tab: TabModel, event) {
    tab.isLoading = false;
    tab.isWithStar = this.isWithStar;
  }
  /**
   * search
   * @param tab
   * @param globalSearchTabComponent
   * @param value
   */
  public search(
    tab: TabModel,
    globalSearchTabComponent: GlobalSearchTabComponent,
    value: string,
    searchFromLocalStorage?
  ) {
    if (value.indexOf(',') !== -1 && value.indexOf('+') !== -1) {
      this.modalService.warningMessageWithOption({
        text: 'Keyword Search',
        message: [
          {
            key: 'Modal_Message__You_can_not_combine_comma_and_plus_in_one_keyword_search',
          },
        ],
        closeText: 'OK',
      });
      return;
    }

    tab.isLoading = true;
    tab.isWithStar = this.isWithStar;
    globalSearchTabComponent.search(value);

    if (Configuration.PublicSettings.enableGSNewWindow) {
      if (!searchFromLocalStorage) {
        this.store.dispatch(this.globalSearchActions.searchKeyword(value));
      }
      this.store.dispatch(this.globalSearchActions.updateTab(this.tabs));
    }
    tab.activeAdvanceSearchStatus = false;
  }

  /**
   * selectTab
   * @param tab
   */
  public selectTab(ev, tab: TabModel, fromStorage?) {
    let allowSelect: boolean;
    if (fromStorage) {
      allowSelect = true;
    }
    if (ev instanceof TabDirective) {
      allowSelect = true;
    }
    if (!allowSelect) {
      return;
    }
    //if (!(ev instanceof TabDirective))
    //    return;

    const item = this.tabs.find((p) => p.title == tab.title);
    if (item) {
      item.active = true;
      item.isWithStar = this.isWithStar;
    }

    if (Configuration.PublicSettings.enableGSNewWindow && !fromStorage) {
      setTimeout(() => {
        this.store.dispatch(this.globalSearchActions.updateTab(this.tabs));
      });
    }
  }

  private popup: any;

  openNewWindow($event) {
    if (!Configuration.PublicSettings.enableGSNewWindow) return;

    this.onClick($event);
    this.openPopup();
  }

  private openPopup() {
    //var params = [
    //    'width=' + 1024,
    //    'height=' + 600
    //].join(',');
    //this.popup = window.open('/search', 'windowName', params);

    this.popup = Uti.openPopupCenter('/search', 'globalSearchPopup', 1024, 600);

    this.isPopupOpening = true;
    this.isCollapsed = true;
    this.showFakedHeading = true;
  }

  public collapseClick() {
    if (this.popup && this.popup.closed) {
      this.handleAfterPopupClosed(false);
      this.popup = null;
      return;
    }
    if (this.showFullPage) return;
    if (this.isPopupOpening) {
      if (!this.popup) {
        this.openPopup();
        return;
      }
      window.open('', 'globalSearchPopup');
      return;
    }
    this.headerClick(null);
  }

  private registerUnloadPage() {
    if (Configuration.PublicSettings.enableGSNewWindow) {
      var that = this;
      $(window).bind('beforeunload', function () {
        if (that.showFullPage) {
          that.store.dispatch(that.globalSearchActions.closePopup());
        } else {
          that.closePopup();
        }
      });
    }
  }

  private closePopup() {
    if (this.popup && !this.popup.closed) {
      this.popup.close();
    }
  }

  private changeDetectorRef() {
    setTimeout(() => {
      this._changeDetectorRef.markForCheck();
      this._changeDetectorRef.detectChanges();
    }, 300);
  }
}
