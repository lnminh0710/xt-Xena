import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  trigger,
  transition,
  style,
  animate,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';

import {
  ParkedItemModel,
  TabSummaryModel,
  ModuleSettingModel,
  GlobalSettingModel,
  SimpleTabModel,
  ReturnRefundInvoiceNumberModel,
  WidgetPropertyModel,
  MessageModel,
  LightWidgetDetail,
} from 'app/models';
import { RowData } from 'app/state-management/store/reducer/widget-content-detail';
import {
  TabService,
  AppErrorHandler,
  ModalService,
  GlobalSettingService,
  PropertyPanelService,
  BaseService,
  DataEntryProcess,
  AccessRightsService,
  EventEmitterService,
  LayoutSettingService,
  ParkedItemProcess,
} from 'app/services';
import { Uti } from 'app/utilities/uti';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { EditingWidget } from 'app/state-management/store/reducer/widget-content-detail';
import { SubLayoutInfoState } from 'app/state-management/store/reducer/layout-info';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  DataEntryActions,
  XnCommonActions,
  TabSummaryActions,
  ParkedItemActions,
  ModuleActions,
  ModuleSettingActions,
  ProcessDataActions,
  WidgetDetailActions,
  TabButtonActions,
  PropertyPanelActions,
  BackofficeActions,
  ReturnRefundActions,
  WarehouseMovementActions,
  CustomAction,
  LayoutInfoActions,
  LayoutSettingActions,
} from 'app/state-management/store/actions';
import { WidgetDataUpdated } from 'app/state-management/store/reducer/widget-content-detail';
import * as warehouseMevementReducer from 'app/state-management/store/reducer/warehouse-movement';
import {
  GlobalSettingConstant,
  RequestSavingMode,
  TabButtonActionConst,
  MenuModuleId,
  Configuration,
  AccessRightTypeEnum,
  WarehouseMovementFormEnum,
  MessageModal,
  OrderDataEntryTabEnum,
} from 'app/app.constants';
import * as uti from 'app/utilities';
import * as parkedItemReducer from 'app/state-management/store/reducer/parked-item';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as moduleSettingReducer from 'app/state-management/store/reducer/module-setting';
import * as tabButtonReducer from 'app/state-management/store/reducer/tab-button';
import * as returnRefundReducer from 'app/state-management/store/reducer/return-refund';
import * as layoutInfoReducer from 'app/state-management/store/reducer/layout-info';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import * as widgetContentReducer from 'app/state-management/store/reducer/widget-content-detail';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import { MatButton } from '../../xn-control/light-material-ui/button';
import * as propertyPanelReducer from '../../../../state-management/store/reducer/property-panel';
import { SelectionExportDataDialogComponent } from '../../widget';
import { String } from 'app/utilities';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'xn-tab-button',
  styleUrls: ['./xn-tab-button.component.scss'],
  templateUrl: './xn-tab-button.component.html',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('100ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('100ms', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class XnTabButtonComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private isViewModeStateSubscription: Subscription;
  private parkedItemsStateSubscription: Subscription;
  private selectedEntityStateSubscription: Subscription;
  private tabsStateSubscription: Subscription;
  private selectedTabStateSubscription: Subscription;
  private selectedODETabStateSubscription: Subscription;
  private selectedSimpleTabStateSubscription: Subscription;
  private selectedSubTabStateSubscription: Subscription;
  private editingWidgetsStateSubscription: Subscription;
  private formDirtyStateSubscription: Subscription;
  private toolbarSettingStateSubscription: Subscription;
  private moduleSettingStateSubscription: Subscription;
  private layoutInfoStateSubscription: Subscription;
  private currentActionStateSubscription: Subscription;
  private saveMainTabResultStateSubscription: Subscription;
  private saveOtherTabResultStateSubscription: Subscription;
  private modulePrimaryKeyStateSubscription: Subscription;
  private widgetListenKeyStateSubscription: Subscription;
  private saveOnlyMainTabResultStateSubscription: Subscription;
  private saveOnlyOtherTabResultStateSubscription: Subscription;
  private widgetDataUpdatedStateSubscription: Subscription;
  private requestCancelOrderDataEntryStateSubscription: Subscription;
  private requestDownloadOrderDataEntryStateSubscription: Subscription;
  private requestSaveOrderDataEntryStateSubscription: Subscription;
  private requestSendToAdminOrderDataEntryStateSubscription: Subscription;
  private requestSkipOrderDataEntryStateSubscription: Subscription;
  private requestSaveStateSubscription: Subscription;
  private requestSaveAllWidgetsStateSubscription: Subscription;
  private requestSaveAndCloseStateSubscription: Subscription;
  private requestSaveAndNewStateSubscription: Subscription;
  private requestSaveAndNextStateSubscription: Subscription;
  private tabHeaderHasScrollerStateSubscription: Subscription;
  private returnAndRefundInvoiceNumberDataStateSubscription: Subscription;
  private isHiddenParkedItemStateSubscription: Subscription;
  private requestChangeParkedItemStateSubscription: Subscription;
  private requestChangeTabStateSubscription: Subscription;
  private requestRemoveTabStateSubscription: Subscription;
  private requestCreateNewFromModuleDropdownStateSubscription: Subscription;
  private requestCreateNewMainTabStateSubscription: Subscription;
  private requestCancelStateSubscription: Subscription;
  private setCommandDisableStateSubscription: Subscription;
  private requestEditStateSubscription: Subscription;
  private requestNewStateSubscription: Subscription;
  private requestNewInEditStateSubscription: Subscription;
  private dblClickTabHeaderStateSubscription: Subscription;
  private requestChangeModuleStateSubscription: Subscription;
  private requestChangeSubModuleStateSubscription: Subscription;
  private requestClearPropertiesSuccessStateSubscription: Subscription;
  private requestGoToFirstStepStateSubscription: Subscription;
  private requestGoToSecondStepStateSubscription: Subscription;
  private requestChangeBusinessCostRowStateSubscription: Subscription;
  private requestChangeSearchResultStateSubscription: Subscription;
  private isOrderDataEntrySaveDisabledStateSubscription: Subscription;
  private saveOrderDataEntryResultStateSubscription: Subscription;
  private selectedWidgetRowDataStateSubscription: Subscription;
  private rowsDataStateSubscription: Subscription;
  private requestSaveOnlyWithoutControllingTabStateSubscription: Subscription;
  private showSendToAdminCompleteSubscription: Subscription;
  private formEditModeStateSubscription: Subscription;
  private scanningStatusStateSubscription: Subscription;
  private activeWidgetStateSubscription: Subscription;
  private requestExportSelectionDataFromContextMenuStateSubscription: Subscription;
  private warehouseMovementSubFormStateSubscription: Subscription;
  private formOutputDataStateSubscription: Subscription;
  private contentDisplayModeStateSubscription: Subscription;
  private showTabButtonStateSubscription: Subscription;

  public showTabButtonState: Observable<boolean>;
  private parkedItemsState: Observable<any>;
  private selectedEntityState: Observable<any>;
  private selectedTabState: Observable<TabSummaryModel>;
  private selectedODETabState: Observable<any>;
  private selectedSimpleTabState: Observable<SimpleTabModel>;
  private selectedSubTabState: Observable<any>;
  public isViewModeState: Observable<boolean>;
  private editingWidgetsState: Observable<Array<EditingWidget>>;
  private formDirtyState: Observable<boolean>;
  private toolbarSettingState: Observable<any>;
  private moduleSettingState: Observable<ModuleSettingModel[]>;
  private layoutInfoState: Observable<SubLayoutInfoState>;
  private currentActionState: Observable<string>;
  private saveMainTabResultState: Observable<any>;
  private saveOtherTabResultState: Observable<any>;
  private modulePrimaryKeyState: Observable<string>;
  private widgetListenKeyState: Observable<string>;
  private saveOnlyMainTabResultState: Observable<any>;
  private saveOnlyOtherTabResultState: Observable<any>;
  private widgetDataUpdatedState: Observable<WidgetDataUpdated>;
  private returnAndRefundInvoiceNumberDataState: Observable<any>;
  private isHiddenParkedItemState: Observable<boolean>;
  private selectedWidgetRowDataState: Observable<RowData>;
  private rowsDataState: Observable<any[]>;
  public tabHeaderHasScrollerState: Observable<any>;
  private formEditModeState: Observable<boolean>;
  private scanningStatusState: Observable<any>;
  private activeWidgetState: Observable<LightWidgetDetail>;
  private warehouseMovementSubFormState: Observable<string>;
  private formOutputDataState: Observable<any>;
  private contentDisplayModeState: Observable<string>;
  private globalPropertiesState: Observable<any>;
  private globalPropertiesStateSubscription: Subscription;

  public showTabButton = false;
  private formOutputData: any = null;
  private contentDisplayMode: any = null;
  private parkedItems: ParkedItemModel[] = [];
  private selectedEntity: any;
  private isViewMode: boolean;
  private selectedTab: TabSummaryModel;
  private selectedODETab: any;
  private selectedSimpleTab: SimpleTabModel;
  private selectedSubTab: any;
  private formDirty: boolean;
  public editingWidgets: Array<EditingWidget>;
  public toolbarSetting: any;
  public isFormEditMode = false;
  public parentStyle: any;
  public activeWidget: LightWidgetDetail;
  private currentAction: string;
  private modulePrimaryKey = '';
  private widgetListenKey = '';
  private newMainTabResultId: any;
  private editMainTabResultId: any;
  private editOtherTabItemId: any;
  private requestAdd = false;
  private requestAddAsNewAndEdit = false;
  private requestEdit = false;
  private requestClone = false;
  private requestClose = false;
  public isTabCollapsed = false;
  private showUnsavedDialog = true;
  private collapseStateSettings: any;
  private globalSettingName = '';
  public returnAndRefundInvoiceNumberData: ReturnRefundInvoiceNumberModel;
  private isHiddenParkedItem = false;
  private isEditAllWidgetMode = false;
  public isSelectionProject = false;
  public TAB_BUTTON_STATE = {
    save: {
      disabled: true,
    },
    saveAndNew: {
      disabled: true,
    },
    saveAndClose: {
      disabled: true,
    },
    saveAndNext: {
      disabled: true,
    },
    exportAll: {
      loading: false,
    },
    exportMediacode: {
      loading: false,
    },
    exportSelectionData: {
      loading: false,
    },
    saveOnlyForSortingGood: {
      disabled: true,
    },
    confirmAll: {
      disabled: true,
    },
    confirmAndSave: {
      disabled: true,
    },
  };
  private selectedWidgetRowData: RowData;
  private rowsData: any[] = [];
  private saveButtonClass = {
    dataDirty: false,
  };
  public isOrderDataEntrySaveDisabled: any;
  public isSendToAdminLoading = false;
  public idScansContainerItems: any;
  public moduleAccessRight: any;
  public tabAccessRight: any;
  public odeButtonsAccessRight: {
    save: boolean;
    skip: boolean;
    download: boolean;
    sendToAdmin: boolean;
    print: boolean;
    delete: boolean;
  } = {
    save: false,
    skip: false,
    download: false,
    sendToAdmin: false,
    print: false,
    delete: false,
  };
  public ordersButtonsAccessRight: {
    pdf: boolean;
    tracking: boolean;
    returnRefund: boolean;
  } = {
    pdf: false,
    tracking: false,
    returnRefund: false,
  };
  public returnRefundButtonsAccessRight: {
    confirm: boolean;
    newInvoice: boolean;
  } = {
    confirm: false,
    newInvoice: false,
  };
  public sysManageWidgetTabButtonsAccessRight: { clone: boolean } = {
    clone: false,
  };
  public warehouseMovementFormEnum: any = WarehouseMovementFormEnum;
  public subForm: string = '';
  public hitTabHeader = false;
  private resizeTimer = null;

  @ViewChild('btnOrderDataEntrySaveCtrl')
  btnOrderDataEntrySaveCtrl: ElementRef; //MatButton;
  @ViewChild('btnSaveAllWidgetCtrl') btnSaveAllWidgetCtrl: MatButton;
  @ViewChild('btnSaveOnlyCtrl') btnSaveOnlyCtrl: MatButton;

  public showSelectionExportDataDialog = false;
  public selectionExportDataDialog: SelectionExportDataDialogComponent;
  @ViewChild(SelectionExportDataDialogComponent)
  set selectionExportDataDialogInstance(
    selectionExportDataDialogInstance: SelectionExportDataDialogComponent
  ) {
    this.selectionExportDataDialog = selectionExportDataDialogInstance;
  }

  @HostListener('document:keyup.out-zone', ['$event'])
  onKeyUp(event) {
    const e = <KeyboardEvent>event;
    // Pagedown key
    if (e.keyCode == 34) {
      if (this.btnSaveAllWidgetCtrl && !this.btnSaveAllWidgetCtrl['disabled']) {
        this.btnSaveAllWidgetCtrl['_elementRef'].nativeElement.click();
      } else if (this.btnSaveOnlyCtrl && !this.btnSaveOnlyCtrl['disabled']) {
        this.btnSaveOnlyCtrl['_elementRef'].nativeElement.click();
      } else if (
        this.ofModule.idSettingsGUI == MenuModuleId.orderDataEntry &&
        this.btnOrderDataEntrySaveCtrl &&
        this.btnOrderDataEntrySaveCtrl.nativeElement
      ) {
        this.btnOrderDataEntrySaveCtrl.nativeElement.click();
      }
    }
  }

  constructor(
    protected router: Router,
    private tabService: TabService,
    private store: Store<AppState>,
    private tabSummaryActions: TabSummaryActions,
    private parkedItemActions: ParkedItemActions,
    private moduleActions: ModuleActions,
    private moduleSettingActions: ModuleSettingActions,
    private processDataActions: ProcessDataActions,
    private slimLoadingBarService: SlimLoadingBarService,
    private widgetDetailActions: WidgetDetailActions,
    private dataEntryAction: DataEntryActions,
    private xnCommonActions: XnCommonActions,
    private appErrorHandler: AppErrorHandler,
    private modalService: ModalService,
    private tabButtonActions: TabButtonActions,
    private toasterService: ToasterService,
    private propertyPanelActions: PropertyPanelActions,
    private layoutSettingActions: LayoutSettingActions,
    private globalSettingService: GlobalSettingService,
    private layoutSettingService: LayoutSettingService,
    private globalSettingConstant: GlobalSettingConstant,
    private backofficeActions: BackofficeActions,
    private returnRefundActions: ReturnRefundActions,
    private warehouseMovementActions: WarehouseMovementActions,
    private dispatcher: ReducerManagerDispatcher,
    private propertyPanelService: PropertyPanelService,
    private dataEntryProcess: DataEntryProcess,
    private changeDetectorRef: ChangeDetectorRef,
    private elmRef: ElementRef,
    private accessRightService: AccessRightsService,
    private eventEmitterService: EventEmitterService,
    private layoutInfoActions: LayoutInfoActions,
    public translateService: TranslateService,
    private parkedItemProcess: ParkedItemProcess
  ) {
    super(router);
    this.globalPropertiesState = store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).globalProperties
    );
    this.parkedItemsState = store.select(
      (state) =>
        parkedItemReducer.getParkedItemState(
          state,
          this.ofModule.moduleNameTrim
        ).parkedItems
    );
    this.selectedEntityState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedEntity
    );
    this.showTabButtonState = store.select(
      (state) =>
        tabSummaryReducer.getTabSummaryState(
          state,
          this.ofModule.moduleNameTrim
        ).showTabButton
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
    this.selectedSimpleTabState = store.select(
      (state) =>
        tabSummaryReducer.getTabSummaryState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedSimpleTab
    );
    this.selectedSubTabState = store.select(
      (state) =>
        tabSummaryReducer.getTabSummaryState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedSubTab
    );
    this.isViewModeState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).isViewMode
    );
    this.editingWidgetsState = store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.ofModule.moduleNameTrim
        ).editingWidgets
    );
    this.formDirtyState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formDirty
    );
    this.moduleSettingState = store.select(
      (state) =>
        moduleSettingReducer.getModuleSettingState(
          state,
          this.ofModule.moduleNameTrim
        ).moduleSetting
    );
    this.toolbarSettingState = store.select(
      (state) =>
        moduleSettingReducer.getModuleSettingState(
          state,
          this.ofModule.moduleNameTrim
        ).toolbarSetting
    );
    this.layoutInfoState = store.select((state) =>
      layoutInfoReducer.getLayoutInfoState(state, this.ofModule.moduleNameTrim)
    );
    this.currentActionState = store.select(
      (state) =>
        tabButtonReducer.getTabButtonState(state, this.ofModule.moduleNameTrim)
          .currentAction
    );
    this.saveMainTabResultState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).saveMainTabResult
    );
    this.saveOtherTabResultState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).saveOtherTabResult
    );
    this.modulePrimaryKeyState = store.select(
      (state) =>
        moduleSettingReducer.getModuleSettingState(
          state,
          this.ofModule.moduleNameTrim
        ).modulePrimaryKey
    );
    this.widgetListenKeyState = store.select(
      (state) =>
        moduleSettingReducer.getModuleSettingState(
          state,
          this.ofModule.moduleNameTrim
        ).widgetListenKey
    );
    this.saveOnlyMainTabResultState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).saveOnlyMainTabResult
    );
    this.saveOnlyOtherTabResultState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).saveOnlyOtherTabResult
    );
    this.widgetDataUpdatedState = store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.ofModule.moduleNameTrim
        ).widgetDataUpdated
    );
    this.tabHeaderHasScrollerState = store.select(
      (state) =>
        tabButtonReducer.getTabButtonState(state, this.ofModule.moduleNameTrim)
          .tabHeaderHasScroller
    );
    this.returnAndRefundInvoiceNumberDataState = store.select(
      (state) =>
        returnRefundReducer.getReturnRefundState(
          state,
          this.ofModule.moduleNameTrim
        ).invoiceNumberData
    );
    this.isHiddenParkedItemState = store.select(
      (state) =>
        moduleSettingReducer.getModuleSettingState(
          state,
          this.ofModule.moduleNameTrim
        ).isHiddenParkedItem
    );
    this.selectedWidgetRowDataState = this.store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.ofModule.moduleNameTrim
        ).rowData
    );
    this.rowsDataState = this.store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.ofModule.moduleNameTrim
        ).rowsData
    );
    this.formEditModeState = this.store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formEditMode
    );
    this.activeWidgetState = this.store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.ofModule.moduleNameTrim
        ).activeWidget
    );
    this.warehouseMovementSubFormState = store.select(
      (state) =>
        warehouseMevementReducer.getWarehouseMovementState(
          state,
          this.ofModule.moduleNameTrim
        ).subForm
    );
    this.formOutputDataState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formOutputData
    );
    this.contentDisplayModeState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).contentDisplayMode
    );

    this.slimLoadingBarService.interval = 50;
    this.isSelectionProject = Configuration.PublicSettings.isSelectionProject;
  }

  ngOnInit() {
    this.listenGlobalpropertiesChange();
    this.getModule();
    this.getTabHeaderCollapseStateFromGlobalSetting();
    this.getUnsavedDialogSettingFromGlobalSetting();

    this.subscribeParkedItemsState();
    this.subscribeSelectedEntityState();
    this.subscribeSelectedTabState();
    this.subscribeSelectedODETabState();
    this.subscribeSelectedSimpleTabState();
    this.subscribeSelectedSubTabState();
    this.subcribeIsViewModeState();
    this.subscribeWidgetDetailState();
    this.subcribeFormDirtyState();
    this.subcribeModuleSettingState();
    this.subcribeToolbarSettingState();
    this.subscribeLayoutInfoModel();
    this.subscribeCurrentActionState();
    this.subcribeSaveMainTabResultState();
    this.subcribeSaveOtherTabResultState();
    this.subcribeModulePrimaryKeyState();
    this.subcribeWidgetListenKeyState();
    this.subcribeRequestChangeParkedItemState();
    this.subcribeRequestChangeTabState();
    this.subcribeRequestRemoveTabState();
    this.subcribeRequestCreateNewFromModuleDropdownState();
    this.subcribeRequestCreateNewMainTabState();
    this.subcribeRequestChangeModuleState();
    this.subcribeRequestChangeSubModuleState();
    this.subcribeSaveOnlyMainTabResultState();
    this.subcribeSaveOnlyOtherTabResultState();
    this.subscribeWidgetDataUpdatedState();
    this.subscribeRequestClearPropertiesSuccessState();
    this.subscribeRequestGoToFirstStepState();
    this.subscribeRequestGoToSecondStepState();
    this.subscribeRequestChangeBusinessCostRowState();
    this.subcribeRequestCancelState();
    this.subcribeSetCommandDisableState();
    this.subcribeRequestEditState();
    this.subcribeRequestNewState();
    this.subcribeRequestAddAsNewAndEditState();
    this.subcribeRequestCloneState();
    this.subcribeDblClickTabHeaderState();
    this.subscribereturnAndRefundInvoiceNumberDataState();
    this.subcribeIsHiddenParkedItemState();
    this.subcribeRequestChangeSearchResultState();
    this.subscribeSelectedWidgetRowDataState();
    this.subscribeRowsDataState();
    this.subscribeRequestSaveOnlyWithoutControllingTabState();
    this.subscribeFormEditModeState();
    this.subscribeActiveWidgetState();
    this.subscribeFormOutputDataState();
    this.subscribeShowTabButtonState();

    this.subcribeIsOrderDataEntrySaveDisabledState();
    this.subscribeSaveOrderDataEntryResultState();
    this.subscribeShowSendToAdminCompleteState();
    this.subscribeRequestExportSelectionDataFromContextMenuState();
    this.subscribeWarehouseMovementSubFormState();
    this.subscribeConfirmAllSortingGoodsResult();
    this.subscribeContentDisplayModeState();
    this.subscribeCheckDirtyPropertiesWidget();

    BaseService.toggleSlimLoadingBar$.subscribe((state) => {
      this.appErrorHandler.executeAction(() => {
        if (state) {
          if (state.status === 'START') {
            this.slimLoadingBarService.start();
          } else if (state.status === 'COMPLETE') {
            this.slimLoadingBarService.complete();
          }
        }
      });
    });

    this.eventEmitterService.invokeFirstComponentFunction.subscribe(
      (message) => {
        return message && this.refreshWidgetsEmit();
      }
    );
  }

  ngAfterViewInit() {
    this.moduleAccessRight = this.accessRightService.getAccessRight(
      AccessRightTypeEnum.Module,
      { idSettingsGUI: this.ofModule.idSettingsGUI }
    );

    this.bindWindowResizeEvent();
    this.processHitTabHeader();
  }

  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  private listenGlobalpropertiesChange() {
    this.globalPropertiesStateSubscription =
      this.globalPropertiesState.subscribe((globalproperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalproperties) {
            const propertyUnsavedDialog =
              this.propertyPanelService.getItemRecursive(
                globalproperties,
                'UnsavedDialog'
              );
            if (propertyUnsavedDialog) {
              this.showUnsavedDialog = propertyUnsavedDialog.value;
            }
          }
        });
      });
  }

  private subscribeParkedItemsState() {
    this.parkedItemsStateSubscription = this.parkedItemsState.subscribe(
      (parkedItemsState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (parkedItemsState) {
            this.parkedItems = parkedItemsState;

            if (this.newMainTabResultId) {
              this.processNewMainTabSuccess(parkedItemsState);
            }
          }
        });
      }
    );
  }

  private subscribeSelectedEntityState() {
    this.selectedEntityStateSubscription = this.selectedEntityState.subscribe(
      (selectedEntityState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedEntity = selectedEntityState;
        });
      }
    );
  }

  private subscribeSelectedTabState() {
    this.selectedTabStateSubscription = this.selectedTabState.subscribe(
      (selectedTabState: TabSummaryModel) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedTab = selectedTabState;

          if (this.selectedTab) {
            this.tabAccessRight = this.accessRightService.getAccessRight(
              AccessRightTypeEnum.Tab,
              {
                idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
                idSettingsGUI: this.ofModule.idSettingsGUI,
                tabID: this.selectedTab.tabSummaryInfor.tabID,
              }
            );

            this.getTabButtonAccessRight();
          } else {
            this.tabAccessRight = null;
          }
        });
      }
    );
  }

  private subscribeSelectedODETabState() {
    this.selectedODETabStateSubscription = this.selectedODETabState.subscribe(
      (selectedODETabState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedODETab = selectedODETabState;

          if (this.selectedODETab) {
            this.dataEntryProcess.reset();
            this.dataEntryProcess.selectedODETab = this.selectedODETab;

            this.scanningStatusState = this.store.select(
              (state) =>
                dataEntryReducer.getDataEntryState(
                  state,
                  this.selectedODETab.TabID
                ).scanningStatusData
            );
            this.subscribeScansContainerItems();
            this.getTabButtonAccessRight();
          }
          this.changeDetectorRef.markForCheck();
        });
      }
    );
  }

  private subscribeScansContainerItems(): void {
    if (this.scanningStatusStateSubscription) {
      this.scanningStatusStateSubscription.unsubscribe();
    }

    this.scanningStatusStateSubscription = this.scanningStatusState.subscribe(
      (scanningStatusState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.idScansContainerItems =
            scanningStatusState && scanningStatusState.length
              ? scanningStatusState[0].idScansContainerItems
              : null;
        });
      }
    );
  }

  private subscribeSelectedSimpleTabState() {
    this.selectedSimpleTabStateSubscription =
      this.selectedSimpleTabState.subscribe(
        (selectedSimpleTabState: SimpleTabModel) => {
          this.appErrorHandler.executeAction(() => {
            this.selectedSimpleTab = selectedSimpleTabState;
          });
        }
      );
  }

  private subscribeSelectedSubTabState() {
    this.selectedSubTabStateSubscription = this.selectedSubTabState.subscribe(
      (selectedSubTabState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedSubTab = selectedSubTabState;

          if (
            this.selectedSubTab &&
            this.ofModule.idSettingsGUI == MenuModuleId.businessCosts
          ) {
            if (this.selectedSubTab.title === 'Main') {
              switch (this.currentAction) {
                case TabButtonActionConst.EDIT_OTHER_TAB:
                  this.store.dispatch(
                    this.processDataActions.turnOffFormEditMode(this.ofModule)
                  );
                  this.store.dispatch(
                    this.processDataActions.turnOffFormCloneMode(this.ofModule)
                  );
                  this.store.dispatch(
                    this.processDataActions.viewMode(this.ofModule)
                  );
                  setTimeout(() => {
                    this.store.dispatch(
                      this.tabSummaryActions.requestSelectTab(
                        'MainInfo',
                        this.ofModule
                      )
                    );
                    this.edit();
                  }, 50);

                  break;
              }
            }
          }
        });
      }
    );
  }

  private subcribeIsViewModeState() {
    this.isViewModeStateSubscription = this.isViewModeState.subscribe(
      (isViewModeState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          this.isViewMode = isViewModeState;
        });
      }
    );
  }

  private subscribeWidgetDetailState() {
    this.editingWidgetsStateSubscription = this.editingWidgetsState.subscribe(
      (editingWidgets: Array<EditingWidget>) => {
        this.appErrorHandler.executeAction(() => {
          this.editingWidgets = editingWidgets;

          if (!this.editingWidgets.length && !this.formDirty) {
            this.store.dispatch(
              this.moduleActions.removeDirtyModule(this.ofModule)
            );
          }

          this.detectDataDirty();
        });
      }
    );
  }

  private subcribeFormDirtyState() {
    this.formDirtyStateSubscription = this.formDirtyState.subscribe(
      (formDirtyState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          this.formDirty = formDirtyState;

          if (!this.editingWidgets.length && !this.formDirty) {
            this.store.dispatch(
              this.moduleActions.removeDirtyModule(this.ofModule)
            );
          }

          this.detectDataDirty();
          this.setStateForSavingButtonState('disabled', !this.formDirty);
        });
      }
    );
  }

  private subcribeModuleSettingState() {
    this.moduleSettingStateSubscription = this.moduleSettingState.subscribe(
      (moduleSettingState: ModuleSettingModel[]) => {
        this.appErrorHandler.executeAction(() => {
          if (
            moduleSettingState &&
            moduleSettingState.length &&
            this.ofModule &&
            this.ofModule.idSettingsGUI == MenuModuleId.orderDataEntry
          ) {
            let jsonSettings: any = {};
            try {
              jsonSettings = JSON.parse(moduleSettingState[0].jsonSettings);
            } catch (e) {
              jsonSettings = {};
            }

            if (
              !isEmpty(jsonSettings) &&
              jsonSettings.Content &&
              jsonSettings.Content.CustomTabs &&
              jsonSettings.Content.CustomTabs.length &&
              jsonSettings.Content.CustomTabs[0].Toolbar
            ) {
              this.store.dispatch(
                this.moduleSettingActions.selectToolbarSetting(
                  jsonSettings.Content.CustomTabs[0].Toolbar,
                  this.ofModule
                )
              );
            }
          }
        });
      }
    );
  }

  private subcribeToolbarSettingState() {
    this.toolbarSettingStateSubscription = this.toolbarSettingState.subscribe(
      (toolbarSettingState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.toolbarSetting = toolbarSettingState;
        });
      }
    );
  }

  private subscribeLayoutInfoModel() {
    this.layoutInfoStateSubscription = this.layoutInfoState.subscribe(
      (layoutInfoState: SubLayoutInfoState) => {
        this.appErrorHandler.executeAction(() => {
          this.parentStyle = {
            'min-width': `calc(100vw - ${layoutInfoState.rightMenuWidth}px)`,
          };
        });
      }
    );
  }

  private subscribeCurrentActionState() {
    this.currentActionStateSubscription = this.currentActionState.subscribe(
      (currentActionState: string) => {
        this.appErrorHandler.executeAction(() => {
          this.currentAction = currentActionState;
        });
      }
    );
  }

  private subcribeSaveMainTabResultState() {
    this.saveMainTabResultStateSubscription =
      this.saveMainTabResultState.subscribe((saveMainTabResultState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!saveMainTabResultState) {
            return;
          }

          if (!isNil(saveMainTabResultState.returnID)) {
            if (
              (typeof saveMainTabResultState.returnID == 'string' ||
                typeof saveMainTabResultState.returnID == 'number') &&
              saveMainTabResultState.returnID
            ) {
              switch (this.currentAction) {
                case TabButtonActionConst.WAREHOUSE_MOVEMENT_CONFIRM_ALL_SORTING_GOODS:
                  return;
                case TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_MAIN_TAB:
                case TabButtonActionConst.EDIT_AND_SAVE_AND_NEXT_MAIN_TAB:
                case TabButtonActionConst.EDIT_AND_SAVE_ONLY_MAIN_TAB:
                case TabButtonActionConst.SAVE_ONLY_OTHER_TAB:
                  this.editMainTabResultId = saveMainTabResultState.returnID;
                  this.processEditMainTabSuccess();
                  break;

                case TabButtonActionConst.SAVE_AND_CLOSE_SIMPLE_TAB:
                  this.processEditOtherTabSuccess();
                  break;

                default:
                  if (
                    this.currentAction ===
                      TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_OTHER_TAB &&
                    (this.ofModule.idSettingsGUI ==
                      MenuModuleId.businessCosts ||
                      this.ofModule.idSettingsGUI == MenuModuleId.campaign)
                  ) {
                    this.processNewMainTabSuccessThenBackToViewMode();
                  } else if (!this.isHiddenParkedItem) {
                    this.newMainTabResultId = saveMainTabResultState.returnID;
                    this.processParkedItemAfterSavingData();
                  } else {
                    this.processNewMainTabSuccessThenBackToViewMode();
                  }
                  break;
              }

              return;
            }
          }

          this.saveFailed(saveMainTabResultState);
        });
      });
  }

  private processParkedItemAfterSavingData() {
    if (this.parkedItemProcess.preventRequestSaveParkedItemList) {
      setTimeout(() => {
        this.parkedItemProcess.preventRequestSaveParkedItemList = false;
      }, 1000);
      return;
    }
    this.store.dispatch(
      this.parkedItemActions.loadThenAddParkedItem(
        this.newMainTabResultId,
        this.ofModule,
        this.modulePrimaryKey,
        this.widgetListenKey
      )
    );
  }

  private subcribeSaveOtherTabResultState() {
    this.saveOtherTabResultStateSubscription =
      this.saveOtherTabResultState.subscribe((saveOtherTabResultState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!saveOtherTabResultState) {
            return;
          }

          if (!isNil(saveOtherTabResultState.returnID)) {
            if (
              (typeof saveOtherTabResultState.returnID == 'string' ||
                typeof saveOtherTabResultState.returnID == 'number') &&
              saveOtherTabResultState.returnID
            ) {
              switch (this.currentAction) {
                case TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_OTHER_TAB:
                case TabButtonActionConst.EDIT_OTHER_TAB:
                case TabButtonActionConst.EDIT_AND_SAVE_ONLY_OTHER_TAB:
                  this.processEditOtherTabSuccess();
                  break;

                default:
                  this.processNewOtherTabSuccess();
                  break;
              }

              return;
            }
          }

          this.saveFailed(saveOtherTabResultState);
        });
      });
  }

  private subcribeSaveOnlyMainTabResultState() {
    this.saveOnlyMainTabResultStateSubscription =
      this.saveOnlyMainTabResultState.subscribe(
        (saveOnlyMainTabResultState: any) => {
          this.appErrorHandler.executeAction(() => {
            if (!saveOnlyMainTabResultState) {
              return;
            }

            if (!isNil(saveOnlyMainTabResultState.returnID)) {
              if (
                (typeof saveOnlyMainTabResultState.returnID == 'string' ||
                  typeof saveOnlyMainTabResultState.returnID == 'number') &&
                saveOnlyMainTabResultState.returnID
              ) {
                switch (this.currentAction) {
                  case TabButtonActionConst.EDIT_AND_SAVE_ONLY_MAIN_TAB:
                  case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP:
                  case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP:
                  case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW:
                    this.editMainTabResultId =
                      saveOnlyMainTabResultState.returnID;
                    this.processEditMainTabSuccess();
                    break;

                  default:
                    break;
                }

                return;
              }
            }

            this.saveFailed(saveOnlyMainTabResultState);
          });
        }
      );
  }

  private subcribeSaveOnlyOtherTabResultState() {
    this.saveOnlyOtherTabResultStateSubscription =
      this.saveOnlyOtherTabResultState.subscribe(
        (saveOnlyOtherTabResultState: any) => {
          this.appErrorHandler.executeAction(() => {
            if (!saveOnlyOtherTabResultState) {
              return;
            }

            if (!isNil(saveOnlyOtherTabResultState.returnID)) {
              if (
                (typeof saveOnlyOtherTabResultState.returnID == 'string' ||
                  typeof saveOnlyOtherTabResultState.returnID == 'number') &&
                saveOnlyOtherTabResultState.returnID
              ) {
                switch (this.currentAction) {
                  case TabButtonActionConst.EDIT_AND_SAVE_ONLY_OTHER_TAB:
                  case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP:
                  case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP:
                  case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW:
                    this.editOtherTabItemId =
                      saveOnlyOtherTabResultState.returnID;
                    this.processEditOtherTabSuccess();
                    break;

                  default:
                    break;
                }

                return;
              }
            }

            this.saveFailed(saveOnlyOtherTabResultState);
          });
        }
      );
  }

  private subscribeWidgetDataUpdatedState() {
    this.widgetDataUpdatedStateSubscription =
      this.widgetDataUpdatedState.subscribe(
        (widgetDataUpdatedState: WidgetDataUpdated) => {
          this.appErrorHandler.executeAction(() => {
            if (widgetDataUpdatedState) {
              switch (this.currentAction) {
                case TabButtonActionConst.CHANGE_MODULE:
                  this.store.dispatch(
                    this.processDataActions.okToChangeModule(this.ofModule)
                  );
                  break;

                case TabButtonActionConst.CHANGE_SUB_MODULE:
                  this.store.dispatch(
                    this.processDataActions.okToChangeSubModule(this.ofModule)
                  );
                  break;

                case TabButtonActionConst.CHANGE_TAB:
                  this.store.dispatch(
                    this.processDataActions.okToChangeTab(this.ofModule)
                  );
                  break;

                case TabButtonActionConst.REMOVE_TAB:
                  this.store.dispatch(
                    this.processDataActions.okToRemoveTab(this.ofModule)
                  );
                  break;

                case TabButtonActionConst.CREATE_NEW_FROM_MODULE_DROPDOWN:
                  this.store.dispatch(
                    this.tabButtonActions.setCurrentAction(
                      TabButtonActionConst.FIRST_LOAD,
                      this.ofModule
                    )
                  );
                  this.store.dispatch(
                    this.processDataActions.okToCreateNewFromModuleDropdown(
                      this.ofModule
                    )
                  );
                  break;

                case TabButtonActionConst.BEFORE_EDIT_OTHER_TAB:
                  this.store.dispatch(
                    this.tabButtonActions.setCurrentAction(
                      TabButtonActionConst.EDIT_OTHER_TAB,
                      this.ofModule
                    )
                  );
                  this.store.dispatch(
                    this.processDataActions.newOtherTab(this.ofModule)
                  );
                  break;

                case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_MAIN_TAB:
                case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_OTHER_TAB:
                  this.store.dispatch(
                    this.processDataActions.okToChangeSearchResult(
                      this.ofModule
                    )
                  );
                  break;

                case TabButtonActionConst.BEFORE_CLOSE:
                  this.store.dispatch(
                    this.tabButtonActions.setCurrentAction(
                      TabButtonActionConst.FIRST_LOAD,
                      this.ofModule
                    )
                  );
                  this.processClose();
                  break;

                case TabButtonActionConst.REFRESH_TAB:
                  this.store.dispatch(
                    this.tabButtonActions.setCurrentAction(
                      TabButtonActionConst.FIRST_LOAD,
                      this.ofModule
                    )
                  );
                  this.store.dispatch(
                    this.widgetDetailActions.requestRefreshWidgetsInTab(
                      this.selectedTab.tabSummaryInfor.tabID,
                      this.ofModule
                    )
                  );
                  break;

                default:
                  break;
              }
            }
          });
        }
      );
  }

  private subcribeModulePrimaryKeyState() {
    this.modulePrimaryKeyStateSubscription =
      this.modulePrimaryKeyState.subscribe((modulePrimaryKeyState: string) => {
        this.appErrorHandler.executeAction(() => {
          this.modulePrimaryKey = modulePrimaryKeyState;
        });
      });
  }

  private subcribeWidgetListenKeyState() {
    this.widgetListenKeyStateSubscription = this.widgetListenKeyState.subscribe(
      (widgetListenKeyState: string) => {
        this.appErrorHandler.executeAction(() => {
          this.widgetListenKey = widgetListenKeyState;
        });
      }
    );
  }

  private subcribeRequestChangeParkedItemState() {
    this.requestChangeParkedItemStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_CHANGE_PARKED_ITEM &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          let currentAction;
          if (!this.selectedTab) {
            currentAction = TabButtonActionConst.FIRST_LOAD;
          } else if (this.tabService.isMainTabSelected(this.selectedTab)) {
            currentAction =
              TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_MAIN_TAB;
          } else {
            currentAction =
              TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_OTHER_TAB;
          }

          if (this.isDirty()) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                currentAction,
                this.ofModule
              )
            );
            this.showDirtyWarningMessage();
          } else {
            switch (currentAction) {
              case TabButtonActionConst.FIRST_LOAD:
                this.store.dispatch(
                  this.processDataActions.okToChangeParkedItem(this.ofModule)
                );
                break;

              case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_MAIN_TAB:
                this.store.dispatch(
                  this.processDataActions.turnOffFormEditMode(this.ofModule)
                );
                this.store.dispatch(
                  this.processDataActions.turnOffFormCloneMode(this.ofModule)
                );
                this.store.dispatch(
                  this.processDataActions.viewMode(this.ofModule)
                );
                this.store.dispatch(
                  this.parkedItemActions.removeDraftItem(this.ofModule)
                );
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.FIRST_LOAD,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToChangeParkedItem(this.ofModule)
                );
                break;

              case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_OTHER_TAB:
                this.store.dispatch(
                  this.processDataActions.turnOffFormEditMode(this.ofModule)
                );
                this.store.dispatch(
                  this.processDataActions.turnOffFormCloneMode(this.ofModule)
                );
                this.store.dispatch(
                  this.processDataActions.viewMode(this.ofModule)
                );
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.FIRST_LOAD,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToChangeParkedItem(this.ofModule)
                );
                break;

              default:
                break;
            }
          }
        });
      });
  }

  private subcribeRequestChangeTabState() {
    this.requestChangeTabStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_CHANGE_TAB &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return {
          tabSetting: action.payload,
        };
      })
      .subscribe((requestChangeTabState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.CHANGE_TAB,
              this.ofModule
            )
          );

          if (this.isDirty(requestChangeTabState.tabSetting)) {
            if (
              this.ofModule.idSettingsGUI !=
              ModuleList.OrderDataEntry.idSettingsGUI
            ) {
              this.showDirtyWarningMessage();
            } else {
              this.onModalExit();
            }
          } else {
            this.store.dispatch(
              this.processDataActions.viewMode(this.ofModule)
            );
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.FIRST_LOAD,
                this.ofModule
              )
            );
            this.store.dispatch(
              this.processDataActions.okToChangeTab(this.ofModule)
            );
          }
        });
      });
  }

  private subcribeRequestRemoveTabState() {
    this.requestRemoveTabStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_REMOVE_TAB &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return {
          tabSetting: action.payload,
        };
      })
      .subscribe((requestRemoveTabState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.REMOVE_TAB,
              this.ofModule
            )
          );

          if (this.isDirty(requestRemoveTabState.tabSetting)) {
            this.showDirtyWarningMessage();
          } else {
            this.store.dispatch(
              this.processDataActions.viewMode(this.ofModule)
            );
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.FIRST_LOAD,
                this.ofModule
              )
            );
            this.store.dispatch(
              this.processDataActions.okToRemoveTab(this.ofModule)
            );
          }
        });
      });
  }

  private subcribeRequestCreateNewFromModuleDropdownState() {
    this.requestCreateNewFromModuleDropdownStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            ProcessDataActions.REQUEST_CREATE_NEW_FROM_MODULE_DROPDOWN &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          // Fix bug: when click Add button too soon and click Add button again and App can not go to New form
          // if (this.currentAction == TabButtonActionConst.NEW_MAIN_TAB) {
          //     return;
          // }

          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.CREATE_NEW_FROM_MODULE_DROPDOWN,
              this.ofModule
            )
          );

          if (this.isDirty()) {
            this.showDirtyWarningMessage();
          } else {
            this.store.dispatch(
              this.processDataActions.turnOffFormEditMode(this.ofModule)
            );
            this.store.dispatch(
              this.processDataActions.turnOffFormCloneMode(this.ofModule)
            );
            this.store.dispatch(
              this.processDataActions.viewMode(this.ofModule)
            );
            this.store.dispatch(
              this.parkedItemActions.removeDraftItem(this.ofModule)
            );
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.FIRST_LOAD,
                this.ofModule
              )
            );
            setTimeout(() => {
              this.store.dispatch(
                this.processDataActions.okToCreateNewFromModuleDropdown(
                  this.ofModule
                )
              );
            }, 500);
          }
        });
      });
  }

  private subcribeRequestCreateNewMainTabState() {
    this.requestCreateNewMainTabStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_CREATE_NEW_MAIN_TAB &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.NEW_MAIN_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.newMainTab(this.ofModule)
          );
        });
      });
  }

  private subcribeRequestCancelState() {
    this.requestCancelStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabButtonActions.REQUEST_CANCEL &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return {
          fromMediaCode: action.payload,
        };
      })
      .subscribe((requestCancelState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (requestCancelState.fromMediaCode) {
            this.store.dispatch(
              this.processDataActions.turnOffFormEditMode(this.ofModule)
            );
            this.store.dispatch(
              this.processDataActions.turnOffFormCloneMode(this.ofModule)
            );
            this.store.dispatch(
              this.processDataActions.viewMode(this.ofModule)
            );
            this.store.dispatch(
              this.parkedItemActions.removeDraftItem(this.ofModule)
            );
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.FIRST_LOAD,
                this.ofModule
              )
            );
            this.store.dispatch(
              this.tabSummaryActions.toggleTabButton(false, this.ofModule)
            );
            this.store.dispatch(
              this.processDataActions.formValid(true, this.ofModule)
            );
            this.store.dispatch(
              this.processDataActions.formDirty(false, this.ofModule)
            );
            // this.setTabButtonState('disabled', [{ save: true }, { saveAndNew: true }, { saveAndClose: true }, { saveAndNext: true }]);
            this.store.dispatch(
              this.warehouseMovementActions.setSubForm(
                WarehouseMovementFormEnum.None,
                this.ofModule
              )
            );
            this.setStateForSavingButtonState('disabled', true);
          } else {
            this.cancel();
          }
        });
      });
  }

  private subcribeSetCommandDisableState() {
    this.setCommandDisableStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabButtonActions.SET_COMMAND_DISABLE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((setCommandDisableState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.setTabButtonState('disabled', setCommandDisableState);
        });
      });
  }

  private subcribeRequestEditState() {
    this.requestEditStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabButtonActions.REQUEST_EDIT &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.edit();
        });
      });
  }

  private subcribeRequestNewState() {
    this.requestNewStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabButtonActions.REQUEST_NEW &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.add();
        });
      });
  }

  private subcribeRequestAddAsNewAndEditState() {
    this.requestNewStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabButtonActions.REQUEST_ADD_AS_NEW_AND_EDIT &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.addAsNewAndEdit();
        });
      });
  }

  private subcribeRequestCloneState() {
    this.requestNewStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabButtonActions.REQUEST_CLONE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.clone();
        });
      });
  }

  private subcribeDblClickTabHeaderState() {
    this.dblClickTabHeaderStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabButtonActions.DBL_CLICK_TAB_HEADER &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.toggleTab();
        });
      });
  }

  private subcribeRequestChangeModuleState() {
    this.requestChangeModuleStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_CHANGE_MODULE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          //this.store.dispatch(this.tabButtonActions.setCurrentAction(TabButtonActionConst.CHANGE_MODULE, this.ofModule));
          let currentAction = this.currentAction;
          switch (currentAction) {
            case TabButtonActionConst.NEW_MAIN_TAB:
              currentAction =
                TabButtonActionConst.NEW_MAIN_TAB_AND_CHANGE_MODULE;
              break;

            case TabButtonActionConst.NEW_OTHER_TAB:
              currentAction =
                TabButtonActionConst.NEW_OTHER_TAB_AND_CHANGE_MODULE;
              break;

            case TabButtonActionConst.EDIT_MAIN_TAB:
              currentAction =
                TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_MODULE;
              break;

            case TabButtonActionConst.EDIT_OTHER_TAB:
              currentAction =
                TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_MODULE;
              break;

            case TabButtonActionConst.FIRST_LOAD:
              currentAction = TabButtonActionConst.CHANGE_MODULE;
              break;
          }

          if (this.showUnsavedDialog && this.isDirty()) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                currentAction,
                this.ofModule
              )
            );
            this.showDirtyWarningMessage();
          } else {
            //this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
            //this.store.dispatch(this.tabButtonActions.setCurrentAction(TabButtonActionConst.FIRST_LOAD, this.ofModule));

            if (this.isDirty()) {
              this.store.dispatch(
                this.moduleActions.addDirtyModule(this.ofModule)
              );
            }

            switch (currentAction) {
              case TabButtonActionConst.NEW_MAIN_TAB_AND_CHANGE_MODULE:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.NEW_MAIN_TAB,
                    this.ofModule
                  )
                );
                break;

              case TabButtonActionConst.NEW_OTHER_TAB_AND_CHANGE_MODULE:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.NEW_OTHER_TAB,
                    this.ofModule
                  )
                );
                break;

              case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_MODULE:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.EDIT_MAIN_TAB,
                    this.ofModule
                  )
                );
                break;

              case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_MODULE:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.EDIT_OTHER_TAB,
                    this.ofModule
                  )
                );
                break;
            }

            this.store.dispatch(
              this.processDataActions.okToChangeModule(this.ofModule)
            );
          }
        });
      });
  }

  private subcribeRequestChangeSubModuleState() {
    this.requestChangeSubModuleStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_CHANGE_SUB_MODULE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.CHANGE_SUB_MODULE,
              this.ofModule
            )
          );

          if (this.isDirty()) {
            this.showDirtyWarningMessage();
          } else {
            this.store.dispatch(
              this.processDataActions.turnOffFormEditMode(this.ofModule)
            );
            this.store.dispatch(
              this.processDataActions.turnOffFormCloneMode(this.ofModule)
            );
            this.store.dispatch(
              this.processDataActions.viewMode(this.ofModule)
            );
            this.store.dispatch(
              this.parkedItemActions.removeDraftItem(this.ofModule)
            );
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.FIRST_LOAD,
                this.ofModule
              )
            );
            setTimeout(() => {
              this.store.dispatch(
                this.processDataActions.okToChangeSubModule(this.ofModule)
              );
            }, 500);
          }
        });
      });
  }

  private subscribeCheckDirtyPropertiesWidget() {
    this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === PropertyPanelActions.CHECK_DIRTY_PROPERTIES_OF_WIDGET
        );
      })
      .subscribe((action: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          if (!action.payload) {
            this.refreshWidgetsEmit();
          }
        });
      });
  }

  private subscribeRequestClearPropertiesSuccessState() {
    this.requestClearPropertiesSuccessStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            PropertyPanelActions.REQUEST_CLEAR_PROPERTIES_SUCCESS &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (this.requestAdd) {
            this.okToAdd();
          } else if (this.requestEdit) {
            this.okToEdit();
          } else if (this.requestClone) {
            this.okToClone();
          } else if (this.requestClose) {
            this.okToClose();
          }
        });
      });
  }

  private subscribeRequestGoToFirstStepState() {
    this.requestGoToFirstStepStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_GO_TO_FIRST_STEP &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          let currentAction;
          switch (this.currentAction) {
            case TabButtonActionConst.EDIT_MAIN_TAB:
            case TabButtonActionConst.EDIT_AND_SAVE_AND_NEXT_SECOND_STEP:
              currentAction =
                TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP;
              break;

            case TabButtonActionConst.EDIT_OTHER_TAB:
              currentAction =
                TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP;
              break;

            case TabButtonActionConst.SAVE_AND_NEXT_SECOND_STEP:
              currentAction = TabButtonActionConst.SAVE_AND_NEXT;
              break;
          }

          if (this.isDirty()) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                currentAction,
                this.ofModule
              )
            );
            this.showDirtyWarningMessage();
          } else {
            switch (currentAction) {
              case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.EDIT_MAIN_TAB,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToGoToFirstStep(this.ofModule)
                );
                break;

              case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.EDIT_OTHER_TAB,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToGoToFirstStep(this.ofModule)
                );
                break;

              case TabButtonActionConst.SAVE_AND_NEXT:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.EDIT_MAIN_TAB,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToGoToFirstStep(this.ofModule)
                );
                break;
            }
          }
        });
      });
  }

  private subscribeRequestGoToSecondStepState() {
    this.requestGoToSecondStepStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_GO_TO_SECOND_STEP &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          let currentAction;
          switch (this.currentAction) {
            case TabButtonActionConst.EDIT_MAIN_TAB:
              currentAction =
                TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP;
              break;

            case TabButtonActionConst.EDIT_OTHER_TAB:
              currentAction =
                TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP;
              break;
          }

          if (this.isDirty()) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                currentAction,
                this.ofModule
              )
            );
            this.showDirtyWarningMessage();
          } else {
            switch (currentAction) {
              case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.EDIT_MAIN_TAB,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToGoToSecondStep(this.ofModule)
                );
                break;

              case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.EDIT_OTHER_TAB,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToGoToSecondStep(this.ofModule)
                );
                break;
            }
          }
        });
      });
  }

  private subscribeRequestChangeBusinessCostRowState() {
    this.requestChangeBusinessCostRowStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_CHANGE_BUSINESS_COST_ROW &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          let currentAction;
          switch (this.currentAction) {
            case TabButtonActionConst.EDIT_MAIN_TAB:
              currentAction =
                TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW;
              break;

            case TabButtonActionConst.EDIT_OTHER_TAB:
              currentAction =
                TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW;
              break;
          }

          if (this.isDirty()) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                currentAction,
                this.ofModule
              )
            );
            this.showDirtyWarningMessage();
          } else {
            switch (currentAction) {
              case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.EDIT_MAIN_TAB,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToChangeBusinessCostRow(
                    this.ofModule
                  )
                );
                break;

              case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW:
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.EDIT_OTHER_TAB,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToChangeBusinessCostRow(
                    this.ofModule
                  )
                );
                break;
            }
          }
        });
      });
  }

  private subscribereturnAndRefundInvoiceNumberDataState() {
    this.returnAndRefundInvoiceNumberDataStateSubscription =
      this.returnAndRefundInvoiceNumberDataState.subscribe(
        (invoiceNumberData: ReturnRefundInvoiceNumberModel) => {
          this.appErrorHandler.executeAction(() => {
            this.returnAndRefundInvoiceNumberData = invoiceNumberData;
          });
        }
      );
  }

  private subcribeIsHiddenParkedItemState() {
    this.isHiddenParkedItemStateSubscription =
      this.isHiddenParkedItemState.subscribe(
        (isHiddenParkedItemState: boolean) => {
          this.appErrorHandler.executeAction(() => {
            this.isHiddenParkedItem = isHiddenParkedItemState;
          });
        }
      );
  }

  private subcribeRequestChangeSearchResultState() {
    this.requestChangeSearchResultStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_CHANGE_SEARCH_RESULT &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          let currentAction;
          if (!this.selectedTab) {
            currentAction = TabButtonActionConst.FIRST_LOAD;
          } else if (this.tabService.isMainTabSelected(this.selectedTab)) {
            currentAction =
              TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_MAIN_TAB;
          } else {
            currentAction =
              TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_OTHER_TAB;
          }

          if (this.isDirty()) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                currentAction,
                this.ofModule
              )
            );
            this.showDirtyWarningMessage();
          } else {
            switch (currentAction) {
              case TabButtonActionConst.FIRST_LOAD:
                this.store.dispatch(
                  this.processDataActions.okToChangeSearchResult(this.ofModule)
                );
                break;

              case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_MAIN_TAB:
                this.store.dispatch(
                  this.processDataActions.turnOffFormEditMode(this.ofModule)
                );
                this.store.dispatch(
                  this.processDataActions.turnOffFormCloneMode(this.ofModule)
                );
                this.store.dispatch(
                  this.processDataActions.viewMode(this.ofModule)
                );
                this.store.dispatch(
                  this.parkedItemActions.removeDraftItem(this.ofModule)
                );
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.FIRST_LOAD,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToChangeSearchResult(this.ofModule)
                );
                break;

              case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_OTHER_TAB:
                this.store.dispatch(
                  this.processDataActions.turnOffFormEditMode(this.ofModule)
                );
                this.store.dispatch(
                  this.processDataActions.turnOffFormCloneMode(this.ofModule)
                );
                this.store.dispatch(
                  this.processDataActions.viewMode(this.ofModule)
                );
                this.store.dispatch(
                  this.tabButtonActions.setCurrentAction(
                    TabButtonActionConst.FIRST_LOAD,
                    this.ofModule
                  )
                );
                this.store.dispatch(
                  this.processDataActions.okToChangeSearchResult(this.ofModule)
                );
                break;

              default:
                break;
            }
          }
        });
      });
  }

  private subcribeIsOrderDataEntrySaveDisabledState() {
    if (this.isOrderDataEntrySaveDisabledStateSubscription)
      this.isOrderDataEntrySaveDisabledStateSubscription.unsubscribe();

    this.isOrderDataEntrySaveDisabledStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === DataEntryActions.DATA_ENTRY_DISABLED_SAVE_BUTTON &&
          this.selectedODETab &&
          action.area == this.selectedODETab.TabID
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!data) return;

          this.isOrderDataEntrySaveDisabled = data;
          this.changeDetectorRef.markForCheck();
        });
      });
  }

  private subscribeSaveOrderDataEntryResultState() {
    if (this.saveOrderDataEntryResultStateSubscription) {
      this.saveOrderDataEntryResultStateSubscription.unsubscribe();
    }

    this.saveOrderDataEntryResultStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === DataEntryActions.DATA_ENTRY_SAVE_RESULT &&
          this.selectedODETab &&
          action.area == this.selectedODETab.TabID
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!data) return;

          if (!isNil(data.returnID)) {
            if (
              data.returnID &&
              (typeof data.returnID == 'string' ||
                typeof data.returnID == 'number')
            ) {
              switch (this.currentAction) {
                case TabButtonActionConst.SAVE_ORDER_DATA_ENTRY:
                case TabButtonActionConst.SAVE_ORDER_DATA_ENTRY_AND_CHANGE_TAB:
                case TabButtonActionConst.SAVE_ORDER_DATA_ENTRY_AND_REMOVE_TAB:
                case TabButtonActionConst.SAVE_ORDER_DATA_ENTRY_AND_RELOAD:
                  this.processSaveOrderDataEntrySuccess();
                  break;
              }

              return;
            }
          }

          this.saveFailed(data);
        });
      });
  }

  private subscribeSelectedWidgetRowDataState() {
    this.selectedWidgetRowDataStateSubscription =
      this.selectedWidgetRowDataState.subscribe(
        (selectedWidgetRowDataState: RowData) => {
          this.appErrorHandler.executeAction(() => {
            this.selectedWidgetRowData = selectedWidgetRowDataState;
          });
        }
      );
  }

  private subscribeRowsDataState() {
    this.rowsDataStateSubscription = this.rowsDataState.subscribe(
      (rowsDataState: any[]) => {
        this.appErrorHandler.executeAction(() => {
          this.rowsData = rowsDataState;
        });
      }
    );
  }

  private subscribeRequestSaveOnlyWithoutControllingTabState() {
    this.requestSaveOnlyWithoutControllingTabStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            TabButtonActions.REQUEST_SAVE_ONLY_WITHOUT_CONTROLLING_TAB &&
          this.ofModule.idSettingsGUI == action.module.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (
            this.btnOrderDataEntrySaveCtrl &&
            this.btnOrderDataEntrySaveCtrl.nativeElement
          )
            this.btnOrderDataEntrySaveCtrl.nativeElement.click();
        });
      });
  }

  private subscribeFormEditModeState() {
    this.formEditModeStateSubscription = this.formEditModeState.subscribe(
      (formEditModeState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          this.isFormEditMode = formEditModeState;
        });
      }
    );
  }

  private subscribeActiveWidgetState() {
    this.activeWidgetStateSubscription = this.activeWidgetState.subscribe(
      (activeWidgetState: LightWidgetDetail) => {
        this.appErrorHandler.executeAction(() => {
          this.activeWidget = activeWidgetState;
        });
      }
    );
  }

  private subscribeFormOutputDataState() {
    this.formOutputDataStateSubscription = this.formOutputDataState.subscribe(
      (formOutputData: any) => {
        this.appErrorHandler.executeAction(() => {
          this.formOutputData = formOutputData;
          this.setButtonStateWhenFormOutputDataChanged();
        });
      }
    );
  }

  private subscribeShowTabButtonState() {
    this.showTabButtonStateSubscription = this.showTabButtonState.subscribe(
      (showTabButtonState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.showTabButton = showTabButtonState;

          if (this.showTabButton) {
            this.processHitTabHeader();
          }
        });
      }
    );
  }

  private subscribeContentDisplayModeState() {
    this.contentDisplayModeStateSubscription =
      this.contentDisplayModeState.subscribe(
        (contentDisplayModeState: string) => {
          this.appErrorHandler.executeAction(() => {
            this.contentDisplayMode = contentDisplayModeState;
          });
        }
      );
  }

  private setButtonStateWhenFormOutputDataChanged() {
    if (this.subForm === WarehouseMovementFormEnum.SortingGood) {
      const confirmAllEnable =
        this.formOutputData && this.formOutputData.payload
          ? this.formOutputData.payload.isConfirmAllDirty
          : false;
      this.TAB_BUTTON_STATE['confirmAll']['disabled'] = !confirmAllEnable;
    }
  }

  private subscribeConfirmAllSortingGoodsResult() {
    this.requestRemoveTabStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            WarehouseMovementActions.REQUEST_CONFIRM_ALL_SUCCESS ||
          (action.type ===
            WarehouseMovementActions.REQUEST_SAVE_AND_CONFIRM_SUCCESS &&
            action.module.idSettingsGUI == this.ofModule.idSettingsGUI)
        );
      })
      .subscribe((action: CustomAction) => {
        this.appErrorHandler.executeAction(() => {
          switch (this.currentAction) {
            case TabButtonActionConst.WAREHOUSE_MOVEMENT_CONFIRM_ALL_SORTING_GOODS:
              this.store.dispatch(
                this.processDataActions.turnOffFormEditMode(this.ofModule)
              );
              this.store.dispatch(
                this.processDataActions.turnOffFormCloneMode(this.ofModule)
              );
              this.store.dispatch(
                this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
              );
              this.store.dispatch(
                this.tabButtonActions.setCurrentAction(
                  TabButtonActionConst.FIRST_LOAD,
                  this.ofModule
                )
              );
              this.store.dispatch(
                this.processDataActions.viewMode(this.ofModule)
              );
              this.store.dispatch(
                this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
              );
              this.store.dispatch(
                this.warehouseMovementActions.setSubForm(
                  WarehouseMovementFormEnum.None,
                  this.ofModule
                )
              );
              break;
            default:
              break;
          }
        });
      });
  }

  /**
   * openTranslationDialog
   */
  public openTranslationDialog() {
    this.store.dispatch(
      this.processDataActions.openTranslationDialog(this.ofModule)
    );
  }

  public skipOrderDataEntry() {
    this.store.dispatch(
      this.dataEntryAction.dataEntryScanningStatusCallSkip(
        true,
        this.selectedODETab.TabID
      )
    );
  }

  public reloadOrderDataEntry() {
    this.store.dispatch(
      this.tabButtonActions.setCurrentAction(
        TabButtonActionConst.RELOAD_ORDER_DATA_ENTRY,
        this.ofModule
      )
    );

    if (this.isDirty()) {
      this.showDirtyWarningMessage();
    } else {
      this.store.dispatch(
        this.tabButtonActions.setCurrentAction(
          TabButtonActionConst.FIRST_LOAD,
          this.ofModule
        )
      );
      this.store.dispatch(
        this.dataEntryAction.dataEntryCallReload(
          true,
          this.selectedODETab.TabID
        )
      );
    }
  }

  public downloadOrderDataEntryScanningImage() {
    this.store.dispatch(
      this.dataEntryAction.requestDownloadScanningImage(
        this.selectedODETab.TabID
      )
    );
  }

  public addItemInEdit() {
    this.store.dispatch(
      this.processDataActions.requestNewInEdit(this.ofModule)
    );
    // this.startToCreateNewMainItem();
  }

  public saveAllWidget() {
    this.store.dispatch(this.widgetDetailActions.requestSave(this.ofModule));
    if (this.isFormEditMode) {
      this.store.dispatch(
        this.processDataActions.turnOffFormEditMode(this.ofModule)
      );
      this.store.dispatch(
        this.processDataActions.turnOffFormCloneMode(this.ofModule)
      );
    }
  }

  public add() {
    this.requestAdd = true;
    this.store.dispatch(
      this.propertyPanelActions.requestClearProperties(this.ofModule)
    );
  }

  public addAsNewAndEdit() {
    this.requestAddAsNewAndEdit = true;
    // TODO:
    this.store.dispatch(
      this.propertyPanelActions.requestClearProperties(this.ofModule)
    );
  }

  public edit() {
    this.requestEdit = true;
    this.store.dispatch(
      this.propertyPanelActions.requestClearProperties(this.ofModule)
    );
  }

  public clone() {
    this.requestClone = true;
    this.store.dispatch(
      this.propertyPanelActions.requestClearProperties(this.ofModule)
    );
  }

  public cancel() {
    if (this.isDirty()) {
      this.showDirtyWarningMessage();
    } else {
      this.store.dispatch(
        this.processDataActions.turnOffFormEditMode(this.ofModule)
      );
      this.store.dispatch(
        this.processDataActions.turnOffFormCloneMode(this.ofModule)
      );
      this.store.dispatch(this.processDataActions.viewMode(this.ofModule));

      switch (this.currentAction) {
        case TabButtonActionConst.NEW_MAIN_TAB:
          this.store.dispatch(
            this.parkedItemActions.removeDraftItem(this.ofModule)
          );
          this.store.dispatch(
            this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
          );

          if (
            this.selectedEntity &&
            this.selectedEntity.hasOwnProperty('selectedParkedItem')
          ) {
            this.store.dispatch(
              this.moduleActions.moveSelectedParkedItemToTop(
                this.ofModule,
                this.selectedEntity.selectedParkedItem
              )
            );
          }

          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.NEW_OTHER_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.EDIT_MAIN_TAB:
          this.store.dispatch(
            this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
          );

          if (
            this.selectedEntity &&
            this.selectedEntity.hasOwnProperty('selectedParkedItem')
          ) {
            this.store.dispatch(
              this.moduleActions.moveSelectedParkedItemToTop(
                this.ofModule,
                this.selectedEntity.selectedParkedItem
              )
            );
          }

          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.EDIT_OTHER_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.CREATE_NEW_FROM_MODULE_DROPDOWN:
          this.store.dispatch(
            this.parkedItemActions.removeDraftItem(this.ofModule)
          );
          this.store.dispatch(
            this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
          );

          if (
            this.selectedEntity &&
            this.selectedEntity.hasOwnProperty('selectedParkedItem')
          ) {
            this.store.dispatch(
              this.moduleActions.moveSelectedParkedItemToTop(
                this.ofModule,
                this.selectedEntity.selectedParkedItem
              )
            );
          }

          this.store.dispatch(
            this.tabSummaryActions.requestLoadTabs(this.ofModule)
          );
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.SAVE_AND_CLOSE_MAIN_TAB:
        case TabButtonActionConst.SAVE_AND_NEW_MAIN_TAB:
          this.store.dispatch(
            this.parkedItemActions.removeDraftItem(this.ofModule)
          );
          this.store.dispatch(
            this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
          );

          if (
            this.selectedEntity &&
            this.selectedEntity.hasOwnProperty('selectedParkedItem')
          ) {
            this.store.dispatch(
              this.moduleActions.moveSelectedParkedItemToTop(
                this.ofModule,
                this.selectedEntity.selectedParkedItem
              )
            );
          }

          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.SAVE_AND_CLOSE_OTHER_TAB:
        case TabButtonActionConst.SAVE_AND_NEW_OTHER_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.SAVE_AND_NEXT:
          this.store.dispatch(
            this.parkedItemActions.removeDraftItem(this.ofModule)
          );
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.SAVE_AND_NEXT_SECOND_STEP:
          this.store.dispatch(
            this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
          );

          if (
            this.selectedEntity &&
            this.selectedEntity.hasOwnProperty('selectedParkedItem')
          ) {
            this.store.dispatch(
              this.moduleActions.moveSelectedParkedItemToTop(
                this.ofModule,
                this.selectedEntity.selectedParkedItem
              )
            );
          }

          this.store.dispatch(
            this.tabSummaryActions.requestLoadTabs(this.ofModule)
          );
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.SAVE_ONLY_MAIN_TAB:
          this.store.dispatch(
            this.parkedItemActions.removeDraftItem(this.ofModule)
          );
          this.store.dispatch(
            this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
          );
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          break;

        default:
          break;
      }

      this.store.dispatch(
        this.tabSummaryActions.toggleTabButton(false, this.ofModule)
      );
      // this.setTabButtonState('disabled', [{ save: true }, { saveAndNew: true }, { saveAndClose: true }, { saveAndNext: true }]);
      this.store.dispatch(
        this.warehouseMovementActions.setSubForm(
          WarehouseMovementFormEnum.None,
          this.ofModule
        )
      );
      this.setStateForSavingButtonState('disabled', true);
    }
  }

  public close() {
    this.requestClose = true;
    this.store.dispatch(
      this.propertyPanelActions.requestClearProperties(this.ofModule)
    );
    this.store.dispatch(
      this.warehouseMovementActions.setSubForm(
        WarehouseMovementFormEnum.None,
        this.ofModule
      )
    );
  }

  public saveAndClose() {
    setTimeout(() => {
      this.setTabButtonState('disabled', [{ saveAndClose: true }]);

      switch (this.currentAction) {
        case TabButtonActionConst.EDIT_MAIN_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_MAIN_TAB,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.EDIT_OTHER_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_OTHER_TAB,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.EDIT_AND_SAVE_AND_NEXT_SECOND_STEP:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_MAIN_TAB,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.EDIT_SIMPLE_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.SAVE_AND_CLOSE_SIMPLE_TAB,
              this.ofModule
            )
          );
          break;

        default:
          if (
            this.currentAction ==
              TabButtonActionConst.SAVE_AND_NEXT_SECOND_STEP &&
            this.ofModule.idSettingsGUI == MenuModuleId.campaign
          ) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_OTHER_TAB,
                this.ofModule
              )
            );
          } else if (this.tabService.isMainTabSelected(this.selectedTab)) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.SAVE_AND_CLOSE_MAIN_TAB,
                this.ofModule
              )
            );
          } else {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.SAVE_AND_CLOSE_OTHER_TAB,
                this.ofModule
              )
            );
          }
          break;
      }

      this.store.dispatch(
        this.processDataActions.requestSave(
          this.ofModule,
          RequestSavingMode.SaveAndClose
        )
      );
      this.store.dispatch(
        this.warehouseMovementActions.setSubForm(
          WarehouseMovementFormEnum.None,
          this.ofModule
        )
      );
    }, 200);
  }

  public saveAndNew() {
    setTimeout(() => {
      this.setTabButtonState('disabled', [{ saveAndNew: true }]);

      if (this.tabService.isMainTabSelected(this.selectedTab)) {
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_NEW_MAIN_TAB,
            this.ofModule
          )
        );
      } else {
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_NEW_OTHER_TAB,
            this.ofModule
          )
        );
      }

      this.store.dispatch(
        this.processDataActions.requestSave(
          this.ofModule,
          RequestSavingMode.SaveAndNew
        )
      );
    }, 200);
  }

  public saveAndNext() {
    setTimeout(() => {
      this.setTabButtonState('disabled', [{ saveAndNext: true }]);

      switch (this.currentAction) {
        case TabButtonActionConst.EDIT_MAIN_TAB:
        case TabButtonActionConst.EDIT_AND_SAVE_AND_NEXT_SECOND_STEP:
        case TabButtonActionConst.SAVE_AND_NEXT_SECOND_STEP:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_AND_SAVE_AND_NEXT_MAIN_TAB,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.EDIT_OTHER_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_AND_SAVE_AND_NEXT_OTHER_TAB,
              this.ofModule
            )
          );
          break;

        default:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.SAVE_AND_NEXT,
              this.ofModule
            )
          );
          break;
      }

      this.store.dispatch(
        this.processDataActions.requestSave(
          this.ofModule,
          RequestSavingMode.SaveAndNext
        )
      );
    }, 200);
  }

  public saveAndNext_Widget() {
    //this.setTabButtonState('disabled', [{ saveAndNext: true }]);

    switch (this.selectedTab.tabSummaryInfor.tabID) {
      case 'SelectProject':
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_NEXT_STEP_SELECT_PROJECT,
            this.ofModule
          )
        );
        break;
      case 'Country':
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_NEXT_STEP_COUNTRY,
            this.ofModule
          )
        );
        break;
      case 'Database':
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_NEXT_STEP_DATABASE,
            this.ofModule
          )
        );
        break;
      case 'Logic':
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_NEXT_STEP_LOGIC,
            this.ofModule
          )
        );
        break;
      case 'Frequencies':
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_NEXT_STEP_FREQUENCIES,
            this.ofModule
          )
        );
        break;
      case 'Export':
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_NEXT_STEP_EXPORT,
            this.ofModule
          )
        );
        break;
      case 'Finalize':
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_NEXT_STEP_FINALIZE,
            this.ofModule
          )
        );
        break;
    }

    this.store.dispatch(
      this.processDataActions.requestSaveWidget(
        this.ofModule,
        this.selectedTab.tabSummaryInfor.tabID
      )
    );
  }

  public saveOnly() {
    setTimeout(() => {
      this.setTabButtonState('disabled', [{ save: true }]);

      switch (this.currentAction) {
        case TabButtonActionConst.EDIT_MAIN_TAB:
        case TabButtonActionConst.EDIT_AND_SAVE_AND_NEXT_SECOND_STEP:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_AND_SAVE_ONLY_MAIN_TAB,
              this.ofModule
            )
          );
          break;

        case TabButtonActionConst.EDIT_OTHER_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_AND_SAVE_ONLY_OTHER_TAB,
              this.ofModule
            )
          );
          break;

        default:
          if (
            this.currentAction ===
              TabButtonActionConst.SAVE_AND_NEXT_SECOND_STEP &&
            this.ofModule.idSettingsGUI == MenuModuleId.businessCosts
          ) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.SAVE_ONLY_OTHER_TAB,
                this.ofModule
              )
            );
          } else if (this.tabService.isMainTabSelected(this.selectedTab)) {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.SAVE_ONLY_MAIN_TAB,
                this.ofModule
              )
            );
          } else {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.SAVE_ONLY_OTHER_TAB,
                this.ofModule
              )
            );
          }
          break;
      }

      this.store.dispatch(
        this.processDataActions.requestSave(
          this.ofModule,
          RequestSavingMode.SaveOnly
        )
      );
    }, 200);
  }

  public saveOnlyWithoutControllingTab() {
    setTimeout(() => {
      let isValid = true;
      if (this.ofModule.idSettingsGUI == MenuModuleId.orderDataEntry) {
        switch (this.currentAction) {
          case TabButtonActionConst.CHANGE_TAB:
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.SAVE_ORDER_DATA_ENTRY_AND_CHANGE_TAB,
                this.ofModule
              )
            );
            break;

          case TabButtonActionConst.REMOVE_TAB:
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.SAVE_ORDER_DATA_ENTRY_AND_REMOVE_TAB,
                this.ofModule
              )
            );
            break;

          case TabButtonActionConst.RELOAD_ORDER_DATA_ENTRY:
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.SAVE_ORDER_DATA_ENTRY_AND_RELOAD,
                this.ofModule
              )
            );
            break;

          default:
            if (
              !this.isOrderDataEntrySaveDisabled ||
              !this.isOrderDataEntrySaveDisabled.status ||
              (this.selectedODETab &&
                this.selectedODETab.TabID == 'Scanning' &&
                !this.idScansContainerItems &&
                this.isOrderDataEntrySaveDisabled.orderType != '2')
            ) {
              isValid = false;
              this.toasterService.pop(
                'warning',
                'Validation Failed',
                'Validation failed, please check again!'
              );
            } else {
              this.store.dispatch(
                this.tabButtonActions.setCurrentAction(
                  TabButtonActionConst.SAVE_ORDER_DATA_ENTRY,
                  this.ofModule
                )
              );
            }
            break;
        }
      }

      if (isValid) {
        this.dataEntryProcess.preventShowDialogConfirmPrice = true;
        const tabId = this.selectedODETab ? this.selectedODETab.TabID : null;
        this.store.dispatch(
          this.processDataActions.requestSave(
            this.ofModule,
            RequestSavingMode.SaveOnly,
            tabId
          )
        );
      }
    }, 500);
  }

  public toggleTab() {
    this.isTabCollapsed = !this.isTabCollapsed;
    this.reloadAndSaveSetting();
    this.store.dispatch(
      this.tabSummaryActions.toggleTabHeader(this.isTabCollapsed, this.ofModule)
    );
  }

  private trigerClickBeforeSaving() {
    this.elmRef.nativeElement.click();
  }

  private okToAdd() {
    let currentAction;
    if (this.tabService.isMainTabSelected(this.selectedTab)) {
      currentAction = TabButtonActionConst.BEFORE_NEW_MAIN_TAB;
    } else {
      currentAction = TabButtonActionConst.BEFORE_NEW_OTHER_TAB;
    }

    if (this.isDirty()) {
      this.store.dispatch(
        this.tabButtonActions.setCurrentAction(currentAction, this.ofModule)
      );
      this.showDirtyWarningMessage();
    } else {
      this.store.dispatch(
        this.processDataActions.turnOffFormEditMode(this.ofModule)
      );
      this.store.dispatch(
        this.processDataActions.turnOffFormCloneMode(this.ofModule)
      );

      switch (currentAction) {
        case TabButtonActionConst.BEFORE_NEW_MAIN_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.NEW_MAIN_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.newMainTab(this.ofModule)
          );
          break;

        case TabButtonActionConst.BEFORE_NEW_OTHER_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.NEW_OTHER_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.newOtherTab(this.ofModule)
          );
          break;

        default:
          break;
      }
    }

    this.requestAdd = false;
  }

  private okToEdit() {
    let currentAction;

    // if (this.tabService.isMainTabSelected(this.selectedTab) && this.ofModule.idSettingsGUI != MenuModuleId.warehouseMovement) {
    if (this.tabService.isMainTabSelected(this.selectedTab)) {
      currentAction = TabButtonActionConst.BEFORE_EDIT_MAIN_TAB;
    } else if (
      this.selectedSimpleTab &&
      this.selectedSimpleTab.ParentTabID ==
        this.selectedTab.tabSummaryInfor.tabID
    ) {
      currentAction = TabButtonActionConst.BEFORE_EDIT_SIMPLE_TAB;
    } else {
      currentAction = TabButtonActionConst.BEFORE_EDIT_OTHER_TAB;
    }

    if (this.isDirty()) {
      this.store.dispatch(
        this.tabButtonActions.setCurrentAction(currentAction, this.ofModule)
      );
      this.showDirtyWarningMessage();
    } else {
      switch (currentAction) {
        case TabButtonActionConst.BEFORE_EDIT_MAIN_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_MAIN_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.updateMainTab(this.ofModule)
          );

          if (
            this.ofModule.idSettingsGUI != MenuModuleId.systemManagement &&
            this.selectedEntity
          ) {
            this.store.dispatch(
              this.processDataActions.turnOnFormEditMode(
                this.selectedEntity,
                this.ofModule
              )
            );
          }

          if (
            this.ofModule.idSettingsGUI == MenuModuleId.systemManagement &&
            this.selectedWidgetRowData
          ) {
            this.store.dispatch(
              this.processDataActions.turnOnFormEditMode(
                this.selectedWidgetRowData,
                this.ofModule
              )
            );
          }

          break;

        case TabButtonActionConst.BEFORE_EDIT_OTHER_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_OTHER_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.newOtherTab(this.ofModule)
          );

          if (
            this.ofModule.idSettingsGUI != MenuModuleId.systemManagement &&
            this.selectedEntity
          ) {
            this.store.dispatch(
              this.processDataActions.turnOnFormEditMode(
                this.selectedEntity,
                this.ofModule
              )
            );
          }

          if (
            this.ofModule.idSettingsGUI == MenuModuleId.systemManagement &&
            this.selectedWidgetRowData
          ) {
            this.store.dispatch(
              this.processDataActions.turnOnFormEditMode(
                this.selectedWidgetRowData,
                this.ofModule
              )
            );
          }

          break;

        case TabButtonActionConst.BEFORE_EDIT_SIMPLE_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_SIMPLE_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.newSimpleTab(this.ofModule)
          );
          break;

        default:
          break;
      }
    }

    this.requestEdit = false;
  }

  private okToClone() {
    let currentAction;

    //if (this.selectedSimpleTab) {
    //    currentAction = TabButtonActionConst.BEFORE_CLONE_SIMPLE_TAB;
    //} else {
    //    if (this.tabService.isMainTabSelected(this.selectedTab)) {
    //        currentAction = TabButtonActionConst.BEFORE_CLONE_MAIN_TAB;
    //    } else {
    //        currentAction = TabButtonActionConst.BEFORE_CLONE_OTHER_TAB;
    //    }
    //}

    if (this.tabService.isMainTabSelected(this.selectedTab)) {
      currentAction = TabButtonActionConst.BEFORE_CLONE_MAIN_TAB;
    } else if (
      this.selectedSimpleTab &&
      this.selectedSimpleTab.ParentTabID ==
        this.selectedTab.tabSummaryInfor.tabID
    ) {
      currentAction = TabButtonActionConst.BEFORE_CLONE_SIMPLE_TAB;
    } else {
      currentAction = TabButtonActionConst.BEFORE_CLONE_OTHER_TAB;
    }

    if (this.isDirty()) {
      this.store.dispatch(
        this.tabButtonActions.setCurrentAction(currentAction, this.ofModule)
      );
      this.showDirtyWarningMessage();
    } else {
      switch (currentAction) {
        case TabButtonActionConst.BEFORE_CLONE_MAIN_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.CLONE_MAIN_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.updateMainTab(this.ofModule)
          );

          if (
            this.ofModule.idSettingsGUI != MenuModuleId.systemManagement &&
            this.selectedEntity
          ) {
            this.store.dispatch(
              this.processDataActions.turnOnFormCloneMode(
                this.selectedEntity,
                this.ofModule
              )
            );
          }

          if (
            this.ofModule.idSettingsGUI == MenuModuleId.systemManagement &&
            this.selectedWidgetRowData
          ) {
            this.store.dispatch(
              this.processDataActions.turnOnFormCloneMode(
                this.selectedWidgetRowData,
                this.ofModule
              )
            );
          }

          break;

        case TabButtonActionConst.BEFORE_CLONE_OTHER_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.CLONE_OTHER_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.newOtherTab(this.ofModule)
          );

          if (
            this.ofModule.idSettingsGUI != MenuModuleId.systemManagement &&
            this.selectedEntity
          ) {
            this.store.dispatch(
              this.processDataActions.turnOnFormCloneMode(
                this.selectedEntity,
                this.ofModule
              )
            );
          }

          if (
            this.ofModule.idSettingsGUI == MenuModuleId.systemManagement &&
            this.selectedWidgetRowData
          ) {
            this.store.dispatch(
              this.processDataActions.turnOnFormCloneMode(
                this.selectedWidgetRowData,
                this.ofModule
              )
            );
          }

          break;

        case TabButtonActionConst.BEFORE_CLONE_SIMPLE_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.CLONE_SIMPLE_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.newSimpleTab(this.ofModule)
          );
          break;

        default:
          break;
      }
    }

    this.requestClone = false;
  }

  private okToClose() {
    let currentAction;
    currentAction = TabButtonActionConst.BEFORE_CLOSE;

    if (this.isDirty()) {
      this.store.dispatch(
        this.tabButtonActions.setCurrentAction(currentAction, this.ofModule)
      );
      this.showDirtyWarningMessage();
    } else {
      if (currentAction == TabButtonActionConst.BEFORE_CLOSE) {
        this.processClose();
      }
    }
  }

  private isDirty(tabSetting?: any) {
    if (this.formDirty) {
      return true;
    }

    if (!this.editingWidgets.length) return false;

    if (tabSetting) {
      for (let editingWidget of this.editingWidgets) {
        let pageId = editingWidget.pageId;
        // Fix bug: http://tfs.xoontec.vn:8080/tfs/DefaultCollection/XenaUI/_workitems/edit/6357
        if (editingWidget.tabId == tabSetting.CurrentTabID) {
          if (
            tabSetting.TabContent[this.contentDisplayMode].Split &&
            tabSetting.TabContent[this.contentDisplayMode].Split.Items
          ) {
            let splitItem = tabSetting.TabContent[
              this.contentDisplayMode
            ].Split.Items.find((si) => si.Page && si.Page.PageId != pageId);
            if (splitItem) {
              return true;
            }
          } else if (
            tabSetting.TabContent[this.contentDisplayMode].Page &&
            tabSetting.TabContent[this.contentDisplayMode].Page.PageId != pageId
          ) {
            return true;
          }
        }
      } //for
    } else if (this.selectedEntity) {
      //ODE
      if (this.selectedODETab && this.selectedODETab.TabID) {
        var modulePrimaryKey = this.modulePrimaryKey || 'id';
        if (!modulePrimaryKey) return false;

        for (let editingWidget of this.editingWidgets) {
          if (
            this.selectedODETab.TabID == editingWidget.tabId &&
            editingWidget.selectedEntity &&
            editingWidget.selectedEntity[modulePrimaryKey] ==
              this.selectedEntity[modulePrimaryKey]
          ) {
            return true;
          }
        } //for
      } else {
        for (let editingWidget of this.editingWidgets) {
          if (
            editingWidget.selectedEntity &&
            editingWidget.selectedEntity[this.modulePrimaryKey] ==
              this.selectedEntity[this.modulePrimaryKey]
          ) {
            return true;
          }
        } //for
      }
    }

    return false;
  }
  // <h1>This item </h1> <strong>{{quantity}}</strong> <h1> is not available</h1>
  // <h1>This item </h1> <strong>1</strong> <h1> is not available</h1>
  // This item 1 is not available

  private showDirtyWarningMessage() {
    let modalOptions: any = {
      headerText: 'Saving Changes',
      onModalSaveAndExit: this.onModalSaveAndExit.bind(this),
      onModalExit: this.onModalExit.bind(this),
      onModalCancel: this.onModalCancel.bind(this),
      callBackFunc: this.onModalCancel.bind(this),
      noButtonText:
        this.ofModule.idSettingsGUI == MenuModuleId.orderDataEntry
          ? 'Keep Data'
          : null,
    };

    if (this.ofModule.idSettingsGUI == MenuModuleId.orderDataEntry) {
      modalOptions.customClass = 'custom-modal-medium';
      modalOptions.yesButtonText = 'Save Data';
      modalOptions.yesButtonDisabled =
        !this.isOrderDataEntrySaveDisabled ||
        !this.isOrderDataEntrySaveDisabled.status ||
        (this.selectedODETab &&
          this.selectedODETab.TabID == OrderDataEntryTabEnum.Scanning &&
          !this.idScansContainerItems &&
          this.isOrderDataEntrySaveDisabled.orderType != '2');

      if (this.requestClose) {
        modalOptions.noButtonText = 'Close Module';
      } else if (
        this.currentAction === TabButtonActionConst.RELOAD_ORDER_DATA_ENTRY
      ) {
        modalOptions.noButtonText = 'Reload Data';
      } else if (this.currentAction === TabButtonActionConst.REMOVE_TAB) {
        modalOptions.noButtonText = 'Remove Tab';
      } else {
        modalOptions.noButtonText = 'Keep Data';
      }
    } else {
      delete modalOptions.yesButtonText;
      delete modalOptions.noButtonText;
      delete modalOptions.customClass;
    }

    this.modalService.unsavedWarningMessageDefault(modalOptions);
  }

  private onModalSaveAndExit() {
    switch (this.currentAction) {
      case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_MAIN_TAB:
      case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_OTHER_TAB:
      case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_MAIN_TAB:
      case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_OTHER_TAB:
      case TabButtonActionConst.CHANGE_TAB:
      case TabButtonActionConst.REMOVE_TAB:
      case TabButtonActionConst.CREATE_NEW_FROM_MODULE_DROPDOWN:
      case TabButtonActionConst.CHANGE_MODULE:
      case TabButtonActionConst.CHANGE_SUB_MODULE:
      case TabButtonActionConst.NEW_MAIN_TAB_AND_CHANGE_MODULE:
      case TabButtonActionConst.SAVE_AND_CLOSE_OTHER_TAB:
      case TabButtonActionConst.RELOAD_ORDER_DATA_ENTRY:
      case TabButtonActionConst.BEFORE_CLOSE:
        if (this.ofModule.idSettingsGUI == MenuModuleId.orderDataEntry) {
          if (
            this.isOrderDataEntrySaveDisabled &&
            this.isOrderDataEntrySaveDisabled.status
          ) {
            this.saveOnlyWithoutControllingTab();
          } else {
            this.store.dispatch(
              this.tabButtonActions.setCurrentAction(
                TabButtonActionConst.FIRST_LOAD,
                this.ofModule
              )
            );
          }
        } else if (this.editingWidgets.length) {
          this.store.dispatch(
            this.widgetDetailActions.requestSave(this.ofModule)
          );
        } else {
          this.store.dispatch(
            this.processDataActions.requestSave(
              this.ofModule,
              RequestSavingMode.SaveAndClose
            )
          );
        }

        break;

      case TabButtonActionConst.BEFORE_NEW_MAIN_TAB:
      case TabButtonActionConst.BEFORE_NEW_OTHER_TAB:
      case TabButtonActionConst.BEFORE_EDIT_OTHER_TAB:
        this.store.dispatch(
          this.widgetDetailActions.requestSave(this.ofModule)
        );
        break;

      case TabButtonActionConst.NEW_MAIN_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_CLOSE_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.requestSave(
            this.ofModule,
            RequestSavingMode.SaveAndClose
          )
        );
        break;

      case TabButtonActionConst.NEW_OTHER_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.SAVE_AND_CLOSE_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.requestSave(
            this.ofModule,
            RequestSavingMode.SaveAndClose
          )
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.requestSave(
            this.ofModule,
            RequestSavingMode.SaveAndClose
          )
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.requestSave(
            this.ofModule,
            RequestSavingMode.SaveAndClose
          )
        );
        break;

      case TabButtonActionConst.EDIT_SIMPLE_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_SIMPLE_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.requestSave(
            this.ofModule,
            RequestSavingMode.SaveAndClose
          )
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP:
      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP:
      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP:
      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP:
      case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW:
      case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW:
        this.store.dispatch(
          this.processDataActions.requestSave(
            this.ofModule,
            RequestSavingMode.SaveOnly
          )
        );
        break;

      default:
        break;
    }
  }

  private onModalExit() {
    switch (this.currentAction) {
      case TabButtonActionConst.CHANGE_MODULE:
      case TabButtonActionConst.CHANGE_SUB_MODULE:
      case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_MAIN_TAB:
      case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_OTHER_TAB:
      case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_MAIN_TAB:
      case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_OTHER_TAB:
      case TabButtonActionConst.CHANGE_TAB:
      case TabButtonActionConst.REMOVE_TAB:
      case TabButtonActionConst.NEW_MAIN_TAB_AND_CHANGE_MODULE:
      case TabButtonActionConst.NEW_OTHER_TAB_AND_CHANGE_MODULE:
      case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_MODULE:
      case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_MODULE:
      case TabButtonActionConst.RELOAD_ORDER_DATA_ENTRY:
        break;

      default:
        this.store.dispatch(
          this.processDataActions.formDirty(false, this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.formValid(true, this.ofModule)
        );
        break;
    }

    switch (this.currentAction) {
      case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_MAIN_TAB:
        if (!this.isViewMode) {
          this.store.dispatch(
            this.processDataActions.formDirty(false, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.formValid(true, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(
            this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.parkedItemActions.removeDraftItem(this.ofModule)
          );
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
        }
        this.store.dispatch(
          this.processDataActions.okToChangeParkedItem(this.ofModule)
        );
        break;

      case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_OTHER_TAB:
        if (!this.isViewMode) {
          this.store.dispatch(
            this.processDataActions.formDirty(false, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.formValid(true, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(
            this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
        }
        this.store.dispatch(
          this.processDataActions.okToChangeParkedItem(this.ofModule)
        );
        break;

      case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_MAIN_TAB:
        if (!this.isViewMode) {
          this.store.dispatch(
            this.processDataActions.formDirty(false, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.formValid(true, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(
            this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.parkedItemActions.removeDraftItem(this.ofModule)
          );
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
        }
        this.store.dispatch(
          this.processDataActions.okToChangeSearchResult(this.ofModule)
        );
        break;

      case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_OTHER_TAB:
        if (!this.isViewMode) {
          this.store.dispatch(
            this.processDataActions.formDirty(false, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.formValid(true, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(
            this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
        }
        this.store.dispatch(
          this.processDataActions.okToChangeSearchResult(this.ofModule)
        );
        break;

      case TabButtonActionConst.BEFORE_NEW_MAIN_TAB:
        this.store.dispatch(
          this.processDataActions.formDirty(false, this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.formValid(true, this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.NEW_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(this.processDataActions.newMainTab(this.ofModule));
        break;

      case TabButtonActionConst.BEFORE_NEW_OTHER_TAB:
        this.store.dispatch(
          this.processDataActions.formDirty(false, this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.formValid(true, this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.NEW_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(this.processDataActions.newOtherTab(this.ofModule));
        break;

      case TabButtonActionConst.NEW_MAIN_TAB:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.parkedItemActions.removeDraftItem(this.ofModule)
        );
        this.store.dispatch(
          this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
        );

        if (
          this.selectedEntity &&
          this.selectedEntity.hasOwnProperty('selectedParkedItem')
        ) {
          this.store.dispatch(
            this.moduleActions.moveSelectedParkedItemToTop(
              this.ofModule,
              this.selectedEntity.selectedParkedItem
            )
          );
        }

        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.NEW_OTHER_TAB:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.parkedItemActions.requestTogglePanel(true, this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB:
      case TabButtonActionConst.CLONE_MAIN_TAB:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
        );

        if (
          this.selectedEntity &&
          this.selectedEntity.hasOwnProperty('selectedParkedItem')
        ) {
          this.store.dispatch(
            this.moduleActions.moveSelectedParkedItemToTop(
              this.ofModule,
              this.selectedEntity.selectedParkedItem
            )
          );
        }

        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.BEFORE_EDIT_OTHER_TAB:
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(this.processDataActions.newOtherTab(this.ofModule));
        break;

      case TabButtonActionConst.BEFORE_CLONE_OTHER_TAB:
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.CLONE_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(this.processDataActions.newOtherTab(this.ofModule));
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB:
      case TabButtonActionConst.CLONE_OTHER_TAB:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
        );

        if (
          this.selectedEntity &&
          this.selectedEntity.hasOwnProperty('selectedParkedItem')
        ) {
          this.store.dispatch(
            this.moduleActions.moveSelectedParkedItemToTop(
              this.ofModule,
              this.selectedEntity.selectedParkedItem
            )
          );
        }

        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.CHANGE_TAB:
        if (!this.isViewMode) {
          this.store.dispatch(
            this.processDataActions.formDirty(false, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.formValid(true, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(
            this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        } else if (this.ofModule.idSettingsGUI == MenuModuleId.orderDataEntry) {
          this.store.dispatch(
            this.processDataActions.formDirty(false, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.formValid(true, this.ofModule)
          );
          this.store.dispatch(
            this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
          );
        }
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeTab(this.ofModule)
        );
        break;

      case TabButtonActionConst.REMOVE_TAB:
        if (!this.isViewMode) {
          this.store.dispatch(
            this.processDataActions.formDirty(false, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.formValid(true, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(
            this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        } else if (this.ofModule.idSettingsGUI == MenuModuleId.orderDataEntry) {
          this.store.dispatch(
            this.processDataActions.formDirty(false, this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.formValid(true, this.ofModule)
          );
          this.store.dispatch(
            this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
          );
          this.store.dispatch(
            this.parkedItemActions.requestReloadList(this.ofModule)
          );
        }
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToRemoveTab(this.ofModule)
        );
        break;

      case TabButtonActionConst.CREATE_NEW_FROM_MODULE_DROPDOWN:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.processDataActions.okToCreateNewFromModuleDropdown(this.ofModule)
        );
        break;

      case TabButtonActionConst.CHANGE_MODULE:
        //this.store.dispatch(this.processDataActions.turnOffFormEditMode(this.ofModule));
        //this.store.dispatch(this.processDataActions.turnOffFormCloneMode(this.ofModule));
        //this.store.dispatch(this.widgetDetailActions.canceAllWidgetEditing(this.ofModule));
        //this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        //this.store.dispatch(this.tabButtonActions.setCurrentAction(TabButtonActionConst.FIRST_LOAD, this.ofModule));
        this.store.dispatch(
          this.processDataActions.okToChangeModule(this.ofModule)
        );
        break;

      case TabButtonActionConst.CHANGE_SUB_MODULE:
        //this.store.dispatch(this.processDataActions.turnOffFormEditMode(this.ofModule));
        //this.store.dispatch(this.processDataActions.turnOffFormCloneMode(this.ofModule));
        //this.store.dispatch(this.widgetDetailActions.canceAllWidgetEditing(this.ofModule));
        //this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        //this.store.dispatch(this.tabButtonActions.setCurrentAction(TabButtonActionConst.FIRST_LOAD, this.ofModule));
        this.store.dispatch(
          this.processDataActions.okToChangeSubModule(this.ofModule)
        );
        break;

      case TabButtonActionConst.SAVE_AND_NEW_MAIN_TAB:
      case TabButtonActionConst.SAVE_AND_CLOSE_MAIN_TAB:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.parkedItemActions.removeDraftItem(this.ofModule)
        );
        this.store.dispatch(
          this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
        );

        if (
          this.selectedEntity &&
          this.selectedEntity.hasOwnProperty('selectedParkedItem')
        ) {
          this.store.dispatch(
            this.moduleActions.moveSelectedParkedItemToTop(
              this.ofModule,
              this.selectedEntity.selectedParkedItem
            )
          );
        }

        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.SAVE_AND_NEW_OTHER_TAB:
      case TabButtonActionConst.SAVE_AND_CLOSE_OTHER_TAB:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
        );

        if (
          this.selectedEntity &&
          this.selectedEntity.hasOwnProperty('selectedParkedItem')
        ) {
          this.store.dispatch(
            this.moduleActions.moveSelectedParkedItemToTop(
              this.ofModule,
              this.selectedEntity.selectedParkedItem
            )
          );
        }

        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.BEFORE_CLOSE:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.processClose();
        break;

      case TabButtonActionConst.SAVE_AND_NEXT:
      case TabButtonActionConst.SAVE_AND_NEXT_SECOND_STEP:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.parkedItemActions.removeDraftItem(this.ofModule)
        );
        this.store.dispatch(
          this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
        );

        if (
          this.selectedEntity &&
          this.selectedEntity.hasOwnProperty('selectedParkedItem')
        ) {
          this.store.dispatch(
            this.moduleActions.moveSelectedParkedItemToTop(
              this.ofModule,
              this.selectedEntity.selectedParkedItem
            )
          );
        }

        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToGoToFirstStep(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToGoToSecondStep(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToGoToFirstStep(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToGoToSecondStep(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeBusinessCostRow(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeBusinessCostRow(this.ofModule)
        );
        break;

      case TabButtonActionConst.NEW_MAIN_TAB_AND_CHANGE_MODULE:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.NEW_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeModule(this.ofModule)
        );
        break;

      case TabButtonActionConst.NEW_OTHER_TAB_AND_CHANGE_MODULE:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.NEW_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeModule(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_MODULE:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeModule(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_MODULE:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeModule(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_SIMPLE_TAB:
      case TabButtonActionConst.CLONE_SIMPLE_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.parkedItemActions.selectPreviousParkedItem(this.ofModule)
        );
        break;

      case TabButtonActionConst.RELOAD_ORDER_DATA_ENTRY:
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.dataEntryAction.dataEntryCallReload(
            true,
            this.selectedODETab.TabID
          )
        );
        break;
    }

    this.store.dispatch(
      this.tabSummaryActions.toggleTabButton(false, this.ofModule)
    );
    // this.setTabButtonState('disabled', [{ save: false }, { saveAndNew: false }, { saveAndClose: false }, { saveAndNext: false }]);
    this.store.dispatch(
      this.warehouseMovementActions.setSubForm(
        WarehouseMovementFormEnum.None,
        this.ofModule
      )
    );
    this.setStateForSavingButtonState('disabled', true);
  }

  private onModalCancel() {
    switch (this.currentAction) {
      case TabButtonActionConst.CHANGE_MODULE:
      case TabButtonActionConst.CHANGE_SUB_MODULE:
      case TabButtonActionConst.CHANGE_TAB:
      case TabButtonActionConst.REMOVE_TAB:
      case TabButtonActionConst.CREATE_NEW_FROM_MODULE_DROPDOWN:
      case TabButtonActionConst.BEFORE_EDIT_OTHER_TAB:
      case TabButtonActionConst.RELOAD_ORDER_DATA_ENTRY:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP:
      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP:
      case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP:
      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP:
      case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.NEW_MAIN_TAB_AND_CHANGE_MODULE:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.NEW_MAIN_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.NEW_OTHER_TAB_AND_CHANGE_MODULE:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.NEW_OTHER_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_MODULE:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_MODULE:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.BEFORE_CLOSE:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.requestClose = false;
        break;
    }
    // this.setTabButtonState('disabled', [{ save: false }, { saveAndNew: false }, { saveAndClose: false }, { saveAndNext: false }]);
  }

  private processClose() {
    this.requestClose = false;
    this.store.dispatch(
      this.processDataActions.turnOffFormEditMode(this.ofModule)
    );
    this.store.dispatch(
      this.processDataActions.turnOffFormCloneMode(this.ofModule)
    );
    this.store.dispatch(
      this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
    );
    this.store.dispatch(this.moduleActions.clearActiveModule());
    this.store.dispatch(this.moduleActions.clearActiveSubModule());
    this.store.dispatch(
      this.parkedItemActions.unselectParkedItem(this.ofModule)
    );
    this.store.dispatch(
      this.tabSummaryActions.toggleTabButton(false, this.ofModule)
    );
    this.store.dispatch(
      this.processDataActions.clearSearchResult(this.ofModule)
    );
    this.store.dispatch(
      this.processDataActions.clearGoToModuleItem(this.ofModule)
    );
    this.store.dispatch(
      this.propertyPanelActions.togglePanel(this.ofModule, false)
    );
    // this.setTabButtonState('disabled', [{ save: true }, { saveAndNew: true }, { saveAndClose: true }, { saveAndNext: true }]);
    this.setStateForSavingButtonState('disabled', true);
    this.store.dispatch(
      this.warehouseMovementActions.setSubForm(
        WarehouseMovementFormEnum.None,
        this.ofModule
      )
    );
    this.store.dispatch(this.moduleActions.removeWorkingModule(this.ofModule));
    this.store.dispatch(
      this.processDataActions.setSelectedEntity(this.ofModule, null)
    );
    this.store.dispatch(
      this.widgetDetailActions.toggleEditAllWidgetMode(false, this.ofModule)
    );

    this.router.navigate([Configuration.rootPrivateUrl]);
  }

  private processNewMainTabSuccess(parkedItemsState) {
    const newInsertedItem = parkedItemsState.find(
      (item) => item.isNewInsertedItem
    );
    if (
      newInsertedItem &&
      newInsertedItem.id &&
      !isEmpty(newInsertedItem.id) &&
      newInsertedItem.id.value === this.newMainTabResultId
    ) {
      this.store.dispatch(
        this.parkedItemActions.removeDraftItem(this.ofModule)
      );
      this.store.dispatch(
        this.processDataActions.formValid(true, this.ofModule)
      );
      this.store.dispatch(
        this.processDataActions.formDirty(false, this.ofModule)
      );

      if (this.currentAction !== TabButtonActionConst.SAVE_AND_NEXT) {
        //this.parkedItemProcess.isProcessingForRequestSaveParkedItemList = true;
        this.store.dispatch(
          this.parkedItemActions.requestSaveParkedItemList(this.ofModule)
        );
      }

      if (!this.formOutputData.dontShowMessage) {
        this.toasterService.pop(
          'success',
          'Success',
          this.ofModule.moduleName + ' added successfully'
        );
      }

      this.newMainTabResultId = null;

      this.store.dispatch(
        this.processDataActions.clearSaveResult(this.ofModule)
      );

      switch (this.currentAction) {
        case TabButtonActionConst.SAVE_AND_NEW_MAIN_TAB:
          this.startToCreateNewMainItem();
          break;

        case TabButtonActionConst.SAVE_AND_CLOSE_MAIN_TAB:
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.parkedItemActions.selectParkedItem(
              newInsertedItem,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.moduleActions.moveSelectedParkedItemToTop(
              this.ofModule,
              newInsertedItem
            )
          );
          break;

        case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_MAIN_TAB:
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.okToChangeParkedItem(this.ofModule)
          );
          break;

        case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_OTHER_TAB:
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.okToChangeParkedItem(this.ofModule)
          );
          break;

        case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_MAIN_TAB:
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.okToChangeSearchResult(this.ofModule)
          );
          break;

        case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_OTHER_TAB:
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.okToChangeSearchResult(this.ofModule)
          );
          break;

        case TabButtonActionConst.CHANGE_MODULE:
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.okToChangeModule(this.ofModule)
          );
          break;

        case TabButtonActionConst.CHANGE_SUB_MODULE:
          this.store.dispatch(
            this.processDataActions.turnOffFormEditMode(this.ofModule)
          );
          this.store.dispatch(
            this.processDataActions.turnOffFormCloneMode(this.ofModule)
          );
          this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.FIRST_LOAD,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.processDataActions.okToChangeSubModule(this.ofModule)
          );
          break;

        case TabButtonActionConst.SAVE_AND_NEXT:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.SAVE_AND_NEXT_SECOND_STEP,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.parkedItemActions.selectParkedItem(
              newInsertedItem,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.moduleActions.moveSelectedParkedItemToTop(
              this.ofModule,
              newInsertedItem
            )
          );
          break;

        case TabButtonActionConst.SAVE_ONLY_MAIN_TAB:
          this.store.dispatch(
            this.tabButtonActions.setCurrentAction(
              TabButtonActionConst.EDIT_MAIN_TAB,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.parkedItemActions.selectParkedItem(
              newInsertedItem,
              this.ofModule
            )
          );
          this.store.dispatch(
            this.moduleActions.moveSelectedParkedItemToTop(
              this.ofModule,
              newInsertedItem
            )
          );
          break;
      }

      this.store.dispatch(
        this.tabSummaryActions.toggleTabButton(false, this.ofModule)
      );
    }
    // this.setTabButtonState('disabled', [{ save: false }, { saveAndNew: false }, { saveAndClose: false }, { saveAndNext: false }]);
    this.store.dispatch(
      this.warehouseMovementActions.setSubForm(
        WarehouseMovementFormEnum.None,
        this.ofModule
      )
    );
    this.setStateForSavingButtonState('disabled', true);
  }

  private processEditMainTabSuccess() {
    const editedItem = this.parkedItems.find(
      (i) => i.id.value == this.editMainTabResultId
    );

    this.store.dispatch(this.processDataActions.formValid(true, this.ofModule));
    this.store.dispatch(
      this.processDataActions.formDirty(false, this.ofModule)
    );
    if (!this.formOutputData.dontShowMessage) {
      this.toasterService.pop(
        'success',
        'Success',
        'Edit ' + this.ofModule.moduleName + ' successfully'
      );
    }

    this.editMainTabResultId = null;

    this.store.dispatch(this.processDataActions.clearSaveResult(this.ofModule));

    switch (this.currentAction) {
      case TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_MAIN_TAB:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.parkedItemActions.selectParkedItem(editedItem, this.ofModule)
        );
        this.store.dispatch(
          this.moduleActions.moveSelectedParkedItemToTop(
            this.ofModule,
            editedItem
          )
        );
        break;

      case TabButtonActionConst.EDIT_AND_SAVE_AND_NEXT_MAIN_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_AND_SAVE_AND_NEXT_SECOND_STEP,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.parkedItemActions.selectParkedItem(editedItem, this.ofModule)
        );
        this.store.dispatch(
          this.moduleActions.moveSelectedParkedItemToTop(
            this.ofModule,
            editedItem
          )
        );
        break;

      case TabButtonActionConst.EDIT_AND_SAVE_ONLY_MAIN_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.parkedItemActions.selectParkedItem(editedItem, this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToGoToFirstStep(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToGoToSecondStep(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeBusinessCostRow(this.ofModule)
        );
        break;

      case TabButtonActionConst.SAVE_ONLY_OTHER_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.parkedItemActions.selectParkedItem(editedItem, this.ofModule)
        );
        break;
    }

    this.store.dispatch(
      this.tabSummaryActions.toggleTabButton(false, this.ofModule)
    );
    // this.setTabButtonState('disabled', [{ save: false }, { saveAndNew: false }, { saveAndClose: false }, { saveAndNext: false }]);
    this.setStateForSavingButtonState('disabled', true);
  }

  private processNewOtherTabSuccess() {
    this.store.dispatch(this.processDataActions.formValid(true, this.ofModule));
    this.store.dispatch(
      this.processDataActions.formDirty(false, this.ofModule)
    );
    if (!this.formOutputData.dontShowMessage) {
      this.toasterService.pop(
        'success',
        'Success',
        this.selectedTab.tabSummaryInfor.tabName + ' added successfully'
      );
    }

    if (this.currentAction !== TabButtonActionConst.SAVE_AND_NEW_OTHER_TAB) {
      this.store.dispatch(
        this.processDataActions.turnOffFormEditMode(this.ofModule)
      );
      this.store.dispatch(
        this.processDataActions.turnOffFormCloneMode(this.ofModule)
      );
      this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
    }

    this.store.dispatch(this.processDataActions.clearSaveResult(this.ofModule));

    switch (this.currentAction) {
      case TabButtonActionConst.SAVE_AND_NEW_OTHER_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.NEW_OTHER_TAB,
            this.ofModule
          )
        );
        //this.store.dispatch(this.processDataActions.newOtherTab(this.ofModule));
        break;

      case TabButtonActionConst.SAVE_AND_CLOSE_OTHER_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.tabSummaryActions.requestLoadTabs(this.ofModule)
        );
        break;

      case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_MAIN_TAB:
        this.store.dispatch(
          this.parkedItemActions.removeDraftItem(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeParkedItem(this.ofModule)
        );
        break;

      case TabButtonActionConst.CHANGE_PARKED_ITEM_FROM_OTHER_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeParkedItem(this.ofModule)
        );
        break;

      case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_MAIN_TAB:
        this.store.dispatch(
          this.parkedItemActions.removeDraftItem(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeSearchResult(this.ofModule)
        );
        break;

      case TabButtonActionConst.CHANGE_SEARCH_RESULT_FROM_OTHER_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeSearchResult(this.ofModule)
        );
        break;

      case TabButtonActionConst.CREATE_NEW_FROM_MODULE_DROPDOWN:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToCreateNewFromModuleDropdown(this.ofModule)
        );
        break;
    }

    this.store.dispatch(
      this.tabSummaryActions.toggleTabButton(false, this.ofModule)
    );
    // this.setTabButtonState('disabled', [{ save: false }, { saveAndNew: false }, { saveAndClose: false }, { saveAndNext: false }]);
    this.setStateForSavingButtonState('disabled', true);
  }

  private processEditOtherTabSuccess() {
    this.store.dispatch(this.processDataActions.formValid(true, this.ofModule));
    this.store.dispatch(
      this.processDataActions.formDirty(false, this.ofModule)
    );
    if (!this.formOutputData.dontShowMessage) {
      this.toasterService.pop(
        'success',
        'Success',
        'Edit ' + this.selectedTab.tabSummaryInfor.tabName + ' successfully'
      );
    }

    this.store.dispatch(this.processDataActions.clearSaveResult(this.ofModule));

    switch (this.currentAction) {
      case TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_OTHER_TAB:
      case TabButtonActionConst.EDIT_OTHER_TAB:
      case TabButtonActionConst.SAVE_AND_CLOSE_SIMPLE_TAB:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.tabSummaryActions.requestLoadTabs(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_AND_SAVE_ONLY_OTHER_TAB:
        this.store.dispatch(
          this.processDataActions.turnOffFormEditMode(this.ofModule)
        );
        this.store.dispatch(
          this.processDataActions.turnOffFormCloneMode(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToGoToFirstStep(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToGoToSecondStep(this.ofModule)
        );
        break;

      case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeBusinessCostRow(this.ofModule)
        );
        break;
    }

    this.store.dispatch(
      this.tabSummaryActions.toggleTabButton(false, this.ofModule)
    );
    // this.setTabButtonState('disabled', [{ save: true }, { saveAndNew: true }, { saveAndClose: true }, { saveAndNext: true }]);
    this.setStateForSavingButtonState('disabled', true);
  }

  private saveFailed(saveResult) {
    // 0001059: Campaign - Validation message is wrong
    // isValid: true  : valid validation.
    // isValid: false : in-valid validation.
    if (saveResult.submitResult) {
      if (isNil(saveResult.returnID)) {
        this.toasterService.pop(
          'error',
          'Failed',
          saveResult.errorMessage || 'Save operation is not successful.'
        );
      }
    } else {
      if (saveResult.isValid && !saveResult.isDirty) {
        this.toasterService.pop(
          'warning',
          'Validation Failed',
          saveResult.errorMessage || 'No entry data for saving!'
        );
        //
      } else if (!saveResult.isValid) {
        this.toasterService.pop(
          'warning',
          'Validation Failed',
          saveResult.errorMessage ||
            'There are some fields do not pass validation!'
        );
      }
    }
    this.store.dispatch(this.processDataActions.clearSaveResult(this.ofModule));

    switch (this.currentAction) {
      case TabButtonActionConst.EDIT_AND_SAVE_ONLY_MAIN_TAB:
      case TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_MAIN_TAB:
      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_SECOND_STEP:
      case TabButtonActionConst.EDIT_MAIN_TAB_AND_GO_TO_FIRST_STEP:
      case TabButtonActionConst.EDIT_MAIN_TAB_AND_CHANGE_BUSINESS_COST_ROW:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_MAIN_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.EDIT_AND_SAVE_ONLY_OTHER_TAB:
      case TabButtonActionConst.EDIT_AND_SAVE_AND_CLOSE_OTHER_TAB:
      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_SECOND_STEP:
      case TabButtonActionConst.EDIT_OTHER_TAB_AND_GO_TO_FIRST_STEP:
      case TabButtonActionConst.EDIT_OTHER_TAB_AND_CHANGE_BUSINESS_COST_ROW:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.EDIT_OTHER_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.SAVE_AND_CLOSE_MAIN_TAB:
      case TabButtonActionConst.SAVE_AND_NEXT:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.NEW_MAIN_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.SAVE_AND_CLOSE_OTHER_TAB:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.NEW_OTHER_TAB,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.SAVE_ORDER_DATA_ENTRY:
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;
    }

    this.setTabButtonState('disabled', [
      { save: false },
      { saveAndNew: false },
      { saveAndClose: false },
      { saveAndNext: false },
    ]);
  }

  private processNewMainTabSuccessThenBackToViewMode() {
    this.store.dispatch(this.processDataActions.formValid(true, this.ofModule));
    this.store.dispatch(
      this.processDataActions.formDirty(false, this.ofModule)
    );

    if (!this.formOutputData.dontShowMessage) {
      this.toasterService.pop(
        'success',
        'Success',
        this.ofModule.moduleName + ' added successfully'
      );
    }

    this.newMainTabResultId = null;

    this.store.dispatch(this.processDataActions.clearSaveResult(this.ofModule));

    this.store.dispatch(
      this.processDataActions.turnOffFormEditMode(this.ofModule)
    );
    this.store.dispatch(
      this.processDataActions.turnOffFormCloneMode(this.ofModule)
    );
    this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
    this.store.dispatch(this.parkedItemActions.removeDraftItem(this.ofModule));
    this.store.dispatch(
      this.tabButtonActions.setCurrentAction(
        TabButtonActionConst.FIRST_LOAD,
        this.ofModule
      )
    );
    // this.setTabButtonState('disabled', [{ save: true }, { saveAndNew: true }, { saveAndClose: true }, { saveAndNext: true }]);
    this.setStateForSavingButtonState('disabled', true);
  }

  private processSaveOrderDataEntrySuccess() {
    this.store.dispatch(this.processDataActions.formValid(true, this.ofModule));
    this.store.dispatch(
      this.processDataActions.formDirty(false, this.ofModule)
    );
    if (!this.formOutputData || !this.formOutputData.dontShowMessage) {
      this.toasterService.pop(
        'success',
        'Success',
        'Save ' + this.ofModule.moduleName + ' successfully'
      );
    }

    if (Configuration.PublicSettings.enableOrderFailed) {
      this.store.dispatch(
        this.parkedItemActions.requestReloadList(this.ofModule)
      );
    }

    switch (this.currentAction) {
      case TabButtonActionConst.SAVE_ORDER_DATA_ENTRY:
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        break;

      case TabButtonActionConst.SAVE_ORDER_DATA_ENTRY_AND_CHANGE_TAB:
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToChangeTab(this.ofModule)
        );
        break;

      case TabButtonActionConst.SAVE_ORDER_DATA_ENTRY_AND_REMOVE_TAB:
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.processDataActions.okToRemoveTab(this.ofModule)
        );
        break;

      case TabButtonActionConst.SAVE_ORDER_DATA_ENTRY_AND_RELOAD:
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.dataEntryAction.dataEntryCallReload(
            true,
            this.selectedODETab.TabID
          )
        );
        break;
    }
  }

  private getUnsavedDialogSettingFromGlobalSetting() {
    this.globalSettingService
      .getAllGlobalSettings(ModuleList.Base.idSettingsGUI)
      .subscribe((globalSetting: any) => {
        this.appErrorHandler.executeAction(() => {
          this.showUnsavedDialog = this.getUnsavedDialogSetting(globalSetting);
        });
      });
  }

  private getUnsavedDialogSetting(globalSetting) {
    if (!globalSetting || !globalSetting.length) {
      return true;
    }

    let propertiesSettings = globalSetting.find(
      (x) => x.globalName === this.globalSettingConstant.globalWidgetProperties
    );
    if (!propertiesSettings || !propertiesSettings.idSettingsGlobal) {
      propertiesSettings = {};
      propertiesSettings.jsonSettings = JSON.stringify(
        this.propertyPanelService.createDefaultGlobalSettings()
      );
    }

    const properties = JSON.parse(
      propertiesSettings.jsonSettings
    ) as GlobalSettingModel[];
    if (properties && properties.length) {
      const propApplicationSetting: WidgetPropertyModel =
        this.propertyPanelService.getItemRecursive(
          properties,
          'ApplicationSettings'
        );
      if (propApplicationSetting) {
        const propUnsavedDialog = this.propertyPanelService.getItemRecursive(
          properties,
          'UnsavedDialog'
        );
        if (propUnsavedDialog) {
          return propUnsavedDialog.value;
        }
      }
    }

    return true;
  }

  private getTabHeaderCollapseStateFromGlobalSetting() {
    this.globalSettingService
      .getAllGlobalSettings(this.ofModule.idSettingsGUI)
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          this.isTabCollapsed = this.getCollapseState(data);
          this.store.dispatch(
            this.tabSummaryActions.toggleTabHeader(
              this.isTabCollapsed,
              this.ofModule
            )
          );
        });
      });
  }

  private getCollapseState(data) {
    if (!data || !data.length) {
      return false;
    }
    this.collapseStateSettings = data.find(
      (x) => x.globalName === this.globalSettingName
    );
    if (
      !this.collapseStateSettings ||
      !this.collapseStateSettings.idSettingsGlobal
    ) {
      return false;
    }
    const collapseStateSetting = JSON.parse(
      this.collapseStateSettings.jsonSettings
    );

    return collapseStateSetting && collapseStateSetting.IsCollapsed;
  }

  private reloadAndSaveSetting() {
    this.globalSettingService
      .getAllGlobalSettings(this.ofModule.idSettingsGUI)
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          this.saveSetting(data);
        });
      });
  }
  private saveSetting(data: GlobalSettingModel[]) {
    if (!data || !Array.isArray(data)) return;
    this.collapseStateSettings = data.find(
      (x) => x.globalName === this.globalSettingName
    );
    if (
      !this.collapseStateSettings ||
      !this.collapseStateSettings.idSettingsGlobal ||
      !this.collapseStateSettings.globalName
    ) {
      this.collapseStateSettings = new GlobalSettingModel({
        globalName: this.globalSettingName,
        description: 'Tab Header Collapse State',
        globalType: this.globalSettingConstant.tabHeaderCollapseState,
      });
    }
    this.collapseStateSettings.idSettingsGUI = this.ofModule.idSettingsGUI;
    this.collapseStateSettings.jsonSettings = JSON.stringify({
      IsCollapsed: this.isTabCollapsed,
    });
    this.collapseStateSettings.isActive = true;

    this.globalSettingService
      .saveGlobalSetting(this.collapseStateSettings)
      .subscribe(
        (_data) => this.saveSettingSuccess(_data),
        (error) => this.saveSettingError(error)
      );
  }

  private getShowTabsNameToList(tabs: any[]): Array<string> {
    const result: Array<string> = [];
    for (const item of tabs) {
      result.push(item.TabID);
    }
    return result;
  }

  private saveSettingSuccess(data: any) {
    this.globalSettingService.saveUpdateCache(
      this.ofModule.idSettingsGUI,
      this.collapseStateSettings,
      data
    );
  }

  private saveSettingError(error) {
    Uti.logError(error);
  }

  private getModule() {
    this.globalSettingName = uti.String.Format(
      '{0}_{1}',
      this.globalSettingConstant.tabHeaderCollapseState,
      uti.String.hardTrimBlank(this.ofModule.moduleName)
    );
  }

  public downloadPdf() {
    this.store.dispatch(
      this.backofficeActions.requestDownloadPdf(this.ofModule)
    );
  }

  public goToTrackingPage() {
    this.store.dispatch(
      this.backofficeActions.requestGoToTrackingPage(this.ofModule)
    );
  }

  public openReturnRefundModule() {
    this.store.dispatch(
      this.backofficeActions.requestOpenReturnRefundModule(this.ofModule)
    );
  }

  public confirmReturnRefund() {
    this.store.dispatch(this.returnRefundActions.requestConfirm(this.ofModule));
  }

  public newInvoiceReturnRefund() {
    this.store.dispatch(
      this.returnRefundActions.requestNewInvoice(this.ofModule)
    );
  }

  private setTabButtonState(stateName: string, values: any[]) {
    values.forEach((val) => {
      if (!isNil(val)) {
        this.TAB_BUTTON_STATE[Object.keys(val)[0]][stateName] =
          val[Object.keys(val)[0]];
      }
    });
  }

  private setStateForSavingButtonState(stateName: string, value: any) {
    this.TAB_BUTTON_STATE['save'][stateName] = value;
    this.TAB_BUTTON_STATE['saveAndNew'][stateName] = value;
    this.TAB_BUTTON_STATE['saveAndClose'][stateName] = value;
    this.TAB_BUTTON_STATE['saveAndNext'][stateName] = value;
    this.TAB_BUTTON_STATE['saveAndClose'][stateName] = value;

    this.TAB_BUTTON_STATE['confirmAndSave'][stateName] = value;
    this.TAB_BUTTON_STATE['saveOnlyForSortingGood'][stateName] = value;
  }

  private detectDataDirty(): void {
    this.saveButtonClass.dataDirty =
      this.formDirty || this.editingWidgets.length > 0;
  }

  private subscribeRequestExportSelectionDataFromContextMenuState() {
    this.requestExportSelectionDataFromContextMenuStateSubscription =
      this.dispatcher
        .filter((action: CustomAction) => {
          return (
            action.type ===
              ProcessDataActions.REQUEST_EXPORT_SELECTION_DATA_FROM_CONTEXT_MENU &&
            action.module.idSettingsGUI == this.ofModule.idSettingsGUI
          );
        })
        .subscribe((action: CustomAction) => {
          this.appErrorHandler.executeAction(() => {
            this.exportSelectionData(action.payload);
          });
        });
  }

  private subscribeWarehouseMovementSubFormState() {
    this.warehouseMovementSubFormStateSubscription =
      this.warehouseMovementSubFormState.subscribe((subForm: string) => {
        this.appErrorHandler.executeAction(() => {
          this.subForm = subForm;
        });
      });
  }

  /**
   * sendToAdmin
   */
  public sendToAdmin() {
    this.isSendToAdminLoading = true;
    this.store.dispatch(this.xnCommonActions.showFeedbackClicked(true));
    this.store.dispatch(
      this.xnCommonActions.storeFeedbacData({
        isSendToAdmin: true,
        tabID: this.selectedODETab.TabID,
      })
    );
  }

  private subscribeShowSendToAdminCompleteState() {
    this.showSendToAdminCompleteSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === XnCommonActions.SHOW_FEEDBACK_COMPLETE;
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.isSendToAdminLoading = false;
          this.changeDetectorRef.markForCheck();
        });
      });
  }

  /**
   * print
   */
  public print() {
    this.store.dispatch(
      this.dataEntryAction.dataEntryPrint(this.selectedODETab.TabID)
    );
  }

  public confirmAllSortingGood(): void {
    this.store.dispatch(
      this.tabButtonActions.setCurrentAction(
        TabButtonActionConst.WAREHOUSE_MOVEMENT_CONFIRM_ALL_SORTING_GOODS,
        this.ofModule
      )
    );
    this.store.dispatch(
      this.warehouseMovementActions.requestConfirmAll(this.ofModule)
    );
  }

  public saveAndConfirmSortingGood(): void {
    this.store.dispatch(
      this.tabButtonActions.setCurrentAction(
        TabButtonActionConst.WAREHOUSE_MOVEMENT_CONFIRM_ALL_SORTING_GOODS,
        this.ofModule
      )
    );
    this.store.dispatch(
      this.warehouseMovementActions.requestSaveAndConfirm(this.ofModule)
    );
  }

  public editSortingGood(): void {
    this.store.dispatch(
      this.warehouseMovementActions.setSubForm(
        WarehouseMovementFormEnum.SortingGood,
        this.ofModule
      )
    );

    this.edit();
    this.TAB_BUTTON_STATE['confirmAll']['disabled'] = true;
    this.setStateForSavingButtonState('disabled', true);
  }

  public refreshWidgetsEmit() {
    this.store.dispatch(
      this.tabButtonActions.setCurrentAction(
        TabButtonActionConst.REFRESH_TAB,
        this.ofModule
      )
    );

    if (this.isWidgetInCurrentTabDirty()) {
      this.showReloadWidgetsDirtyWarningMessage();
    } else {
      this.store.dispatch(
        this.tabButtonActions.setCurrentAction(
          TabButtonActionConst.FIRST_LOAD,
          this.ofModule
        )
      );
      this.store.dispatch(
        this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
      );
      this.store.dispatch(
        this.widgetDetailActions.requestRefreshWidgetsInTab(
          this.selectedTab.tabSummaryInfor.tabID,
          this.ofModule
        )
      );
      this.store.dispatch(
        this.propertyPanelActions.requestClearPropertiesSuccess(this.ofModule)
      );
      this.refreshPageLayout();
    }

    // emit event when user login the same account and design layout or customize widget
    this.eventEmitterService.onFirstRefreshWidgetButtonClick(false);
  }

  public refreshWidgets() {
    this.store.dispatch(
      this.propertyPanelActions.clearPropertiesWhenRefreshBtn(this.ofModule)
    );
  }

  public refreshPageLayout() {
    this.globalSettingService
      .getAllGlobalSettingsRefreshPageLayout(this.ofModule.idSettingsGUI)
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!data || !(data instanceof Array)) return;

          const globalSettingName = String.Format(
            '{0}_{1}',
            this.globalSettingConstant.moduleLayoutSetting,
            String.hardTrimBlank(this.ofModule.moduleName)
          );
          let globalSettingItem = data.find(
            (x) =>
              x.globalName &&
              x.idSettingsGlobal &&
              x.globalName === globalSettingName
          );
          if (!globalSettingItem)
            globalSettingItem = data.find(
              (x) => x.globalName === globalSettingName
            );

          if (globalSettingItem && globalSettingItem.jsonSettings) {
            const moduleSetting = JSON.parse(globalSettingItem.jsonSettings);
            if (moduleSetting.item) {
              this.store.dispatch(
                this.moduleSettingActions.loadModuleSettingSuccess(
                  moduleSetting.item,
                  this.ofModule
                )
              ); // Refresh layout
            }
          }
        });
      });
  }

  private showReloadWidgetsDirtyWarningMessage() {
    let modalOptions: any = {
      headerText: 'Saving Widgets',
      onModalSaveAndExit: () => {
        this.store.dispatch(
          this.widgetDetailActions.requestSave(this.ofModule)
        );
      },
      onModalExit: () => {
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
        this.store.dispatch(
          this.widgetDetailActions.canceAllWidgetEditing(this.ofModule)
        );
        this.store.dispatch(
          this.widgetDetailActions.requestRefreshWidgetsInTab(
            this.selectedTab.tabSummaryInfor.tabID,
            this.ofModule
          )
        );
      },
      onModalCancel: () => {
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
      },
      callBackFunc: () => {
        this.store.dispatch(
          this.tabButtonActions.setCurrentAction(
            TabButtonActionConst.FIRST_LOAD,
            this.ofModule
          )
        );
      },
    };

    this.modalService.unsavedWarningMessageDefault(modalOptions);
  }

  private isWidgetInCurrentTabDirty() {
    let dirtyWidgetsInCurrentTab = this.editingWidgets.filter(
      (x) => x.tabId == this.selectedTab.tabSummaryInfor.tabID
    );
    return dirtyWidgetsInCurrentTab.length > 0;
  }

  public toggleEditAllWidget() {
    this.isEditAllWidgetMode = !this.isEditAllWidgetMode;
    this.store.dispatch(
      this.widgetDetailActions.toggleEditAllWidgetMode(
        this.isEditAllWidgetMode,
        this.ofModule
      )
    );

    if (this.isEditAllWidgetMode) {
      this.toasterService.pop(
        'info',
        '',
        "All widget has just switched to edit mode, so that you don't need to click edit for everytime updating"
      );
    }
  }

  public buildFrequency() {
    this.store.dispatch(
      this.processDataActions.requestBuildFrequency(this.ofModule)
    );
  }

  public getTabButtonAccessRight() {
    let tabId = '';

    if (
      this.ofModule.idSettingsGUI === ModuleList.OrderDataEntry.idSettingsGUI
    ) {
      tabId = this.selectedODETab ? this.selectedODETab.TabID : '';
      this.odeButtonsAccessRight = {
        save: true,
        download: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'Download',
          }
        ).read,
        skip: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'Skip',
          }
        ).read,
        sendToAdmin: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'SendToAdmin',
          }
        ).read,
        delete: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'Delete',
          }
        ).read,
        print: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'Print',
          }
        ).read,
      };
    }

    tabId =
      this.selectedTab && this.selectedTab.tabSummaryInfor
        ? this.selectedTab.tabSummaryInfor.tabID
        : '';
    if (this.ofModule.idSettingsGUI == ModuleList.Orders.idSettingsGUI) {
      this.ordersButtonsAccessRight = {
        pdf: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'Pdf',
          }
        ).read,
        tracking: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'Tracking',
          }
        ).read,
        returnRefund: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'ReturnRefund',
          }
        ).read,
      };
    }

    if (this.ofModule.idSettingsGUI == ModuleList.ReturnRefund.idSettingsGUI) {
      this.returnRefundButtonsAccessRight = {
        confirm: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'Confirm',
          }
        ).read,
        newInvoice: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'NewInvoice',
          }
        ).read,
      };
    }

    if (
      this.ofModule.idSettingsGUI == ModuleList.SystemManagement.idSettingsGUI
    ) {
      this.sysManageWidgetTabButtonsAccessRight = {
        clone: this.accessRightService.getAccessRight(
          AccessRightTypeEnum.TabButton,
          {
            idSettingsGUIParent: this.ofModule.idSettingsGUIParent,
            idSettingsGUI: this.ofModule.idSettingsGUI,
            tabID: tabId,
            buttonName: 'Clone',
          }
        ).read,
      };
    }
  }

  public isEditBtnActive(): boolean {
    if (this.tabService.isMainTabSelected(this.selectedTab)) {
      return this.selectedEntity;
    } else if (this.tabService.isAllowEdit(this.selectedTab)) {
      return true;
    }

    // should define in Store [SpCallGuiMenus] for editWidgetAppId
    if (this.activeWidget && this.rowsData.length) {
      let selectedRowOfActiveWidget = this.rowsData.find(
        (r) => r.widgetDetail.id === this.activeWidget.id
      );
      if (
        !selectedRowOfActiveWidget ||
        !selectedRowOfActiveWidget.widgetDetail ||
        !selectedRowOfActiveWidget.widgetDetail['idRepWidgetApp']
      ) {
        return false;
      }
      return (
        this.selectedTab.tabSummaryInfor['editWidgetAppId'] ==
        selectedRowOfActiveWidget.widgetDetail['idRepWidgetApp']
      );
    }

    return false;
  }

  public exportSelectionData(type) {
    this.showSelectionExportDataDialog = true;
    setTimeout(() => {
      if (this.selectionExportDataDialog) {
        this.selectionExportDataDialog.open();
      }
    }, 100);
  }

  public onCloseSelectionExportDataDialog() {
    this.showSelectionExportDataDialog = false;
  }

  public syncMediacode() {
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        headerText: 'Sync Mediacode',
        messageType: MessageModal.MessageType.information,
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Are_You_Sure_You_Want_To_Sync_Mediacode',
          },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.info,
        callBack1: () => {
          this.store.dispatch(
            this.processDataActions.requestSyncMediacode(this.ofModule)
          );
        },
        callBack2: () => {},
        callBackCloseButton: () => {},
      })
    );
  }

  bindWindowResizeEvent() {
    $(window).on('resize', (e) => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.processHitTabHeader();
      }, 500);
    });
  }

  processHitTabHeader() {
    setTimeout(() => {
      let buttonContainerElm = $('.button-container');
      if (buttonContainerElm.length) {
        let lastTabElm = $('.tab-summary-wrapper li:last');
        if (lastTabElm.length) {
          let lastTabElmRightPos =
            lastTabElm.offset().left + lastTabElm.width();
          let buttonContainerElmWidth = this.hitTabHeader
            ? buttonContainerElm.height() + 60
            : buttonContainerElm.width();

          if (
            window.innerWidth - lastTabElmRightPos <=
            buttonContainerElmWidth
          ) {
            this.hitTabHeader = true;
            this.store.dispatch(
              this.layoutInfoActions.toggleMakeSpaceForTabButton(
                this.hitTabHeader,
                this.ofModule
              )
            );
            return;
          }
        }

        this.hitTabHeader = false;
        this.store.dispatch(
          this.layoutInfoActions.toggleMakeSpaceForTabButton(
            this.hitTabHeader,
            this.ofModule
          )
        );
      }
    });
  }

  private startToCreateNewMainItem() {
    this.store.dispatch(
      this.processDataActions.turnOffFormEditMode(this.ofModule)
    );
    this.store.dispatch(
      this.processDataActions.turnOffFormCloneMode(this.ofModule)
    );
    this.store.dispatch(this.processDataActions.viewMode(this.ofModule));
    this.store.dispatch(
      this.tabButtonActions.setCurrentAction(
        TabButtonActionConst.NEW_MAIN_TAB,
        this.ofModule
      )
    );
    this.store.dispatch(this.processDataActions.newMainTab(this.ofModule));
  }

  /**
   * Toolbar delete
   */

  public deleteOrderDataEntry() {
    this.modalService.confirmDeleteMessageHtmlContent(
      new MessageModel({
        headerText: 'Delete',
        messageType: MessageModal.MessageType.information,
        message: [
          { key: '<p>' },
          { key: 'Modal_Message__Are_You_Sure_You_Want_To_Delete' },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.info,
        callBack1: () => {
          this.store.dispatch(
            this.dataEntryAction.dataEntryScanningStatusCallDelete(
              true,
              this.selectedODETab.TabID
            )
          );
        },
      })
    );
  }
}
