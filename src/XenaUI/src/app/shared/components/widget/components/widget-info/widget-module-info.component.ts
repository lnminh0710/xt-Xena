import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  ViewChild,
  OnDestroy,
  ElementRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import {
  FilterModeEnum,
  SavingWidgetType,
  Configuration,
  WidgetFormTypeEnum,
  MessageModal,
  EditWidgetTypeEnum,
  ModuleType,
  MenuModuleId,
  RepWidgetAppIdEnum,
  AccessRightTypeEnum,
  AccessRightWidgetCommandButtonEnum,
  MapFromWidgetAppToFilterId,
  LogicItemsId,
  ComboBoxTypeConstant,
  PropertyNameOfWidgetProperty,
  FileUploadModuleType,
  ModuleConfiguration,
  TypeForm,
  SignalRActionEnum,
  SignalRJobEnum,
  FormSaveEvenType,
  SAVIdConnectionName,
} from 'app/app.constants';
import { Uti } from 'app/utilities/uti';
import 'rxjs/add/operator/switchMap';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import {
  WidgetPropertyModel,
  WidgetPropertiesStateModel,
  FieldFilter,
  ColumnLayoutSetting,
  Country,
  WidgetDetail,
  FilterData,
  WidgetItemSize,
  WidgetType,
  MessageModel,
  ApiResultResponse,
  RowSetting,
  SignalRNotifyModel,
  SimpleTabModel,
  WidgetConstant,
  WidgetMenuStatusModel,
  LightWidgetDetail,
  ListenKey,
  IListenKeyConfig,
} from 'app/models';
import {
  PropertyPanelActions,
  AdditionalInformationActions,
  BackofficeActions,
  TabButtonActions,
  LayoutInfoActions,
  TabSummaryActions,
  CustomAction,
  WidgetDetailActions,
  ProcessDataActions,
  FilterActions,
  ParkedItemActions,
} from 'app/state-management/store/actions';
import {
  CommonService,
  WidgetTemplateSettingService,
  DatatableService,
  ModalService,
  TreeViewService,
  PropertyPanelService,
  DomHandler,
  AppErrorHandler,
  BackOfficeService,
  GlobalSettingService,
  ArticleService,
  ToolsService,
  DownloadFileService,
  AccessRightsService,
  PersonService,
  ProjectService,
  SignalRService,
  ContextMenuService,
  MenuStatusService,
  ResourceTranslationService,
  BlockedOrderService,
} from 'app/services';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { WidgetUtils } from '../../utils';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import cloneDeep from 'lodash-es/cloneDeep';
import isNull from 'lodash-es/isNull';
import { XnMediacodeDialogComponent } from 'app/shared/components/xn-mediacode-dialog';
import {
  XnFileExplorerComponent,
  XnUploadTemplateFileComponent,
} from 'app/shared/components/xn-file';
import { WidgetModuleInfoTranslationComponent } from '../widget-module-info-translation';
import * as Ps from 'perfect-scrollbar';
import { BaseWidgetModuleInfo } from './base.widget-module-info';
import { NgGridItemConfig } from 'app/shared/components/grid-stack';
import { XnWidgetMenuStatusComponent } from 'app/shared/components/widget/components/xn-widget-menu-status';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { ModuleList } from 'app/pages/private/base';
import * as widgetContentReducer from 'app/state-management/store/reducer/widget-content-detail';
import {
  EditingWidget,
  RowData,
} from 'app/state-management/store/reducer/widget-content-detail';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import {
  ScheduleSettingComponent,
  ScheduleSettingRunImmediatelyComponent,
} from 'app/shared/components/xn-control/';
import {
  SendLetterDialogComponent,
  PrinterFormDialogComponent,
  MatchingCustomerDataDialogComponent,
} from 'app/shared/components/form';
import { SelCountrySelectionCombineComponent } from 'app/shared/components/country-selection';
import { CountryBlacklistComponent } from 'app/shared/components/country-blacklist';
import { DatabaseCombineGridComponent } from 'app/shared/components/database-combine-grid';
import { AgeFilterGridComponent } from 'app/shared/components/age-filter-grid/age-filter-grid.component';
import { ExtendedFilterGridComponent } from 'app/shared/components/extended-filter-grid/extended-filter-grid.component';
import { NewLotDialogComponent } from '../new-lot-dialog';
import {
  WidgetProfileSavingComponent,
  WidgetProfileSelectComponent,
} from '../widget-profile';
import { FrequencyGridComponent } from 'app/shared/components/frequency-grid/frequency-grid.component';
import { GroupPriorityGridComponent } from 'app/shared/components/group-priority-grid/group-priority-grid.component';
import { WidgetChartComponent } from '../widget-chart';
import { WidgetPdfComponent } from '../widget-pdf/widget-pdf.component';
import { SelectionProjectDetailComponent } from 'app/shared/components/selection-project-detail/selection-project-detail.component';
import { MediacodePricingGridComponent } from 'app/shared/components/mediacode-pricing-grid/mediacode-pricing-grid.component';
import * as autoScroll from 'dom-autoscroller';
import { GuidHelper } from 'app/utilities/guild.helper';
import { LocalStorageKey } from 'app/app.constants';
import { SavLetterTemplateComponent } from 'app/shared/components/form/tools/sav-letter-template';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';
import { has } from 'lodash-es';
import { NoteActionEnum, NoteFormDataAction } from 'app/models/note.model';
import { WidgetNoteFormComponent } from '../widget-note-form';

@Component({
  selector: 'widget-module-info',
  styleUrls: ['./widget-module-info.component.scss'],
  templateUrl: './widget-module-info.component.html',
  providers: [WidgetUtils],
  host: {
    '(mouseleave)': 'mouseout($event)',
    '(mouseenter)': 'mouseenter($event)',
    '(click)': 'mouseenter($event)',
    '(dblclick)': 'mouseDblClick($event)',
    '(contextmenu)': 'onRightClick($event)',
  },
})
export class WidgetModuleComponent
  extends BaseWidgetModuleInfo
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  @Input() gridItemConfig: NgGridItemConfig;
  @Input() columnsLayoutSettings: any = {};
  @Input() payload: any = {};
  @Input() onPopup = false;
  @Input() rowDataChange: any = {};
  @Input() set selectedSimpleTab(data: SimpleTabModel) {
    this._simpleTabData = data;
    this.execSelectedSimpleTab(data);
  }

  @Input() set widgetProperties(properties: any) {
    if (!properties) {
      return;
    }
    if (isNil(properties.properties)) {
      this.properties = properties;
      this.propertiesForSaving.properties = cloneDeep(properties);
    } else {
      this.properties = properties.properties;
      this.propertiesForSaving = cloneDeep(properties);
    }
    this.setOriginalProperties();
    this.changeProperties();
  }

  public refreshCurrentWidget: any;
  public isOpenUserEditingList = false;
  public backGroundImageStyle: any;
  public preventRenderDataMode: boolean;
  public showMediacodeDialog = false;
  public menuStatusOpacity = 1;
  public isNewRuleForAllCountry = false;
  public logicItemsId: any = {
    AgeFilter: LogicItemsId.AgeFilter,
    CountryBlackList: LogicItemsId.CountryBlackList,
    DatabaseCombine: LogicItemsId.DatabaseCombine,
    ExtendedFilter: LogicItemsId.ExtendedFilter,
    GroupPriority: LogicItemsId.GroupPriority,
    AgeFilter_Extend: LogicItemsId.AgeFilter_Extend,
    ExtendedFilter_Extend: LogicItemsId.ExtendedFilter_Extend,
  };
  public savSendLetterData: any = { data: [] };
  public idLinkWidgetList = [];
  public idLinkWidgetModel: any;

  @Input() set isDesignUpdatingStatus(status: boolean) {
    this.preventRenderDataMode = false;
    if (status && this.domHandler.isIE()) {
      this.preventRenderDataMode = true;
    }
  }

  @Input() set resized(resized: string) {
    this.resizedLocal = resized;

    if (!this.showInDialog) {
      if (this.resizedLocal.indexOf('start') !== -1) {
        this.removeHorizontalPerfectScrollEvent();
        this.removeVerticalPerfectScrollEvent();
      } else if (this.resizedLocal.indexOf('stop') !== -1) {
        this.checkWidgetFormHasScrollbars();
      }
    }
  }

  @Input() set layoutPageInfo(layoutPageInfo: any) {
    this.layoutPageInfoWidget = layoutPageInfo;
    if (
      layoutPageInfo &&
      this.data &&
      this.data.syncWidgetIds &&
      this.data.syncWidgetIds.length
    ) {
      const parentWidgetId = this.data.syncWidgetIds[0];
      let parentWidgetDetail: WidgetDetail;

      for (let i = 0; i < layoutPageInfo.length; i++) {
        const parentWidget = layoutPageInfo[i].widgetboxesTitle.find(
          (x) => x.id == parentWidgetId
        );
        if (parentWidget) {
          parentWidgetDetail = parentWidget.widgetDetail;
          break;
        }
      }

      if (parentWidgetDetail && this.widgetMenuStatusComponent) {
        this.initwidgetMenuStatusData = {
          widgetDetail: {
            ...this.data,
            contentDetail: parentWidgetDetail.contentDetail,
          },
          selectedFilter: this.selectedFilter,
          selectedSubFilter: this.selectedSubFilter,
          fieldFilters: this.fieldFilters,
          columnLayoutsetting: this.columnLayoutsetting,
          rowSetting: this.rowSetting,
          selectedWidgetFormType: this.widgetFormType,
          widgetProperties: this.properties,
          gridLayoutSettings: this.columnsLayoutSettings,
          isForAllCountryCheckbox: false,
          isForAllCountryButton: false,
        };
      }
    }
  }

  // -----------------------
  @Output() onRemoveWidget = new EventEmitter<WidgetDetail>();
  @Output() onRowTableClick = new EventEmitter<any>();
  @Output() onChangeFieldFilter = new EventEmitter<any>();
  @Output() onUpdateTitle = new EventEmitter<WidgetDetail>();
  @Output() onResetWidgetTranslation = new EventEmitter<any>();
  @Output() onEditWidgetInPopup = new EventEmitter<any>();
  @Output() onOpenTranslateWidget = new EventEmitter<any>();
  @Output() onShowEmailPopup = new EventEmitter<any>();
  @Output() onOpenPropertyPanel = new EventEmitter<any>();
  @Output() onResetWidget = new EventEmitter<WidgetDetail>();
  @Output() onSaveWidget = new EventEmitter<WidgetDetail>();
  @Output() onMaximizeWidget = new EventEmitter<any>(); //Toggle: true: maximize, false: restore

  // -----------------------
  @ViewChild('xnFileExplorerComponentCtrl')
  xnFileExplorerComponentCtrl: XnFileExplorerComponent;
  @ViewChild('xnMediacodeDialog')
  xnMediacodeDialog: XnMediacodeDialogComponent;
  @ViewChild('widgetInfoTranslation')
  widgetModuleInfoTranslationComponent: WidgetModuleInfoTranslationComponent;
  @ViewChild('uploadTemplateFileComponent')
  uploadTemplateFileComponent: XnUploadTemplateFileComponent;
  @ViewChild(XnWidgetMenuStatusComponent)
  widgetMenuStatusComponent: XnWidgetMenuStatusComponent;
  @ViewChild('scheduleSetting')
  private scheduleSetting: ScheduleSettingComponent;
  @ViewChild('sendLetterDialogComponent')
  private sendLetterDialogComponent: SendLetterDialogComponent;
  @ViewChild('scheduleSettingRunImmediately')
  private scheduleSettingRunImmediately: ScheduleSettingRunImmediatelyComponent;
  @ViewChild('widgetProfileSaving')
  widgetProfileSaving: WidgetProfileSavingComponent;
  @ViewChild('widgetProfileSelect')
  widgetProfileSelect: WidgetProfileSelectComponent;
  @ViewChild('countryBlacklist') countryBlacklist: CountryBlacklistComponent;
  @ViewChild('ageFilterGrid') ageFilterGrid: AgeFilterGridComponent;
  @ViewChild('extendedFilterGrid')
  extendedFilterGrid: ExtendedFilterGridComponent;
  @ViewChild('groupPriority') groupPriority: GroupPriorityGridComponent;
  @ViewChild('databaseCombineGrid')
  databaseCombineGrid: DatabaseCombineGridComponent;
  @ViewChild('newLotDialog') newLotDialogComponent: NewLotDialogComponent;
  @ViewChild('countrySelectionCombine')
  countrySelectionCombine: SelCountrySelectionCombineComponent;
  @ViewChild('frequencyGrid') frequencyGrid: FrequencyGridComponent;
  @ViewChild('signalRPopover') signalRPopover: any;
  @ViewChild('chartWidget') chartWidget: WidgetChartComponent;
  @ViewChild('pdfWidget') pdfWidget: WidgetPdfComponent;
  @ViewChild('selectionProjectDetail')
  selectionProjectDetail: SelectionProjectDetailComponent;
  @ViewChild('synchronizationMediacodeGrid')
  mediacodePricingGrid: MediacodePricingGridComponent;
  @ViewChild('savLetterTemplateComponent')
  savLetterTemplateComponent: SavLetterTemplateComponent;
  @ViewChild('idLinkWidgetCombobox') idLinkWidgetCombobox: AngularMultiSelect;
  @ViewChild('printerFormDialog')
  printerFormDialog: PrinterFormDialogComponent;
  //
  @ViewChild('widgetComponent') widgetComponent: any;
  @ViewChild('widgetNoteFormComponent')
  widgetNoteFormComponent: WidgetNoteFormComponent;

  // ------------------------

  public menuStatusConfig: any = {
    isForAllCountryCheckbox: false,
    isForAllCountryButton: false,
  };

  public isShowCreditCardSelection: boolean;
  public isShowScheduleSetting = false;
  public isShowSendLetter = false;
  public isShowScheduleSettingRunImmediately = false;
  public WidgetTypeView = WidgetType;
  public RepWidgetAppIdEnum = RepWidgetAppIdEnum;
  public NOTE_ACTION_ENUM = NoteActionEnum;
  public widgetInstance: WidgetModuleComponent;
  public perfectScrollbarConfig: any = {};
  private creditCardSelected: any;
  public countryCheckListData: Country[] = [];
  public fileUploadModuleTypeView = FileUploadModuleType;
  public isShowToolPanelSetting = false;
  public accessRight: any = {
    read: false,
    edit: false,
    delete: false,
    export: false,
  };
  public accessRightForCommandButton: any =
    this.initAccessRightDataForCommandButton();
  public accessRightAll: any = {};
  public isCampaignCountrySelection = 0;
  private outputDataCountries: Country[];
  private savingWidgetType: SavingWidgetType;
  public contextMenuData: Array<any> = [];
  public listenKeyValue: string;
  private positionTotalRow: string;
  private backgroundTotalRow: string;
  private colorTextTotalRow: string;

  public showWidgetContain: any = false;
  private _buildFormDataForReadonlyGridCounter = 0;

  public readonlyGridFormData: WidgetDetail;
  private readonlyGridAutoSwitchToDetailProp = false;
  private readonlyGridMultipleRowDisplayProp = false;
  public resizedLocal: string;
  public isSelectedCountryActive = false;
  public isSelectionProject = false;
  private widgetToolbarSetting: any[] = [];
  private requestChangeTab: any = null;
  private currentGridRowItem: any;
  public profileSelectedData: any = {};

  private requestSavePropertiesStateSubscription: Subscription;
  private requestUpdatePropertiesStateSubscription: Subscription;
  private requestUpdateTempPropertiesStateSubscription: Subscription;
  private requestUpdateOriginalPropertiesStateSubscription: Subscription;
  private requestApplyPropertiesStateSubscription: Subscription;
  private globalPropertiesStateSubscription: Subscription;
  private requestRollbackPropertiesStateSubscription: Subscription;
  private widgetTemplateSettingServiceSubscription: Subscription;
  private backOfficeServiceSubscription: Subscription;
  private editingWidgetsStateSubscription: Subscription;
  private rowsDataStateSubscription: Subscription;
  private tabChangedSuccessSubscription: Subscription;
  private tabChangedFailedSubscription: Subscription;
  private requestRemoveConnectionFromParentWidgetSubscription: Subscription;
  private requestRemoveConnectionFromChildWidgetSubscription: Subscription;
  private isEditAllWidgetModeStateSubscription: Subscription;
  private requestClearPropertiesSuccessSubscription: Subscription;
  private successSavedSubscription: Subscription;
  private processingDataActionSubscription: Subscription;

  private requestSavePropertiesState: Observable<any>;
  private requestUpdatePropertiesState: Observable<any>;
  private requestApplyPropertiesState: Observable<any>;
  private globalPropertiesState: Observable<any>;
  private requestRollbackPropertiesState: Observable<any>;
  private editingWidgetsState: Observable<Array<EditingWidget>>;
  private rowsDataState: Observable<any>;
  private isEditAllWidgetModeState: Observable<boolean>;
  public activeRowIndex;
  public widgetFormType: WidgetFormTypeEnum = null;

  private settingNewDataForProperties = false;
  private originalTitle = '';
  public editingTitle: boolean;

  public widgetBackgroundColor = '';

  public isHideWidetToolbarSpecialCase = false;

  public isTranslateDataTextOnly = false;
  public translationDataKeyword: string;

  public noEntryData = false;
  public noEntryDataIncludeIds: Array<any> = [9, 10, 11];

  public disableButtonEditWidget: boolean;
  public listenKeyRequestItem: any;
  public printId: string;
  public _simpleTabData: SimpleTabModel;
  public backgroundColor: string;
  public backgroundGradient: string;
  public menuStatusSettings: WidgetMenuStatusModel = null;

  public isShowMatchingDataDialog = false;
  @ViewChild('matchingCustomerDataDialog')
  matchingCustomerDataDialog: MatchingCustomerDataDialogComponent;

  public noteFormDataAction: NoteFormDataAction;
  public dataSourceNotes = [];

  constructor(
    public _eref: ElementRef,
    public store: Store<AppState>,
    public widgetTemplateSettingService: WidgetTemplateSettingService,
    private commonService: CommonService,
    public widgetUtils: WidgetUtils,
    public datatableService: DatatableService,
    public modalService: ModalService,
    public treeViewService: TreeViewService,
    protected domHandler: DomHandler,
    public propertyPanelService: PropertyPanelService,
    private additionalInformationActions: AdditionalInformationActions,
    private appErrorHandler: AppErrorHandler,
    protected componentFactoryResolver: ComponentFactoryResolver,
    private backOfficeService: BackOfficeService,
    protected containerRef: ViewContainerRef,
    private backofficeActions: BackofficeActions,
    private tabButtonActions: TabButtonActions,
    public globalSettingService: GlobalSettingService,
    public articleService: ArticleService,
    public ref: ChangeDetectorRef,
    private layoutInfoActions: LayoutInfoActions,
    private tabSummaryActions: TabSummaryActions,
    private parkedItemActions: ParkedItemActions,
    private dispatcher: ReducerManagerDispatcher,
    protected widgetDetailActions: WidgetDetailActions,
    private toasterService: ToasterService,
    private processDataActions: ProcessDataActions,
    private _toolsService: ToolsService,
    private _downloadFileService: DownloadFileService,
    private _accessRightsService: AccessRightsService,
    private filterActions: FilterActions,
    private projectService: ProjectService,
    private signalRService: SignalRService,
    public personService: PersonService,
    public propertyPanelActions: PropertyPanelActions,
    private contextMenuService: ContextMenuService,
    private _resourceTranslationService: ResourceTranslationService,
    public menuStatusService: MenuStatusService,
    private _blockedOrderService: BlockedOrderService
  ) {
    super(
      _eref,
      store,
      modalService,
      propertyPanelService,
      widgetUtils,
      treeViewService,
      widgetTemplateSettingService,
      componentFactoryResolver,
      containerRef,
      domHandler,
      datatableService,
      globalSettingService,
      articleService,
      personService,
      ref,
      widgetDetailActions,
      propertyPanelActions
    );
    this.widgetInstance = this;

    //this.requestSavePropertiesState = this.store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.currentModule.moduleNameTrim).requestSave);
    //this.requestApplyPropertiesState = this.store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.currentModule.moduleNameTrim).requestApply);
    //this.requestUpdatePropertiesState = this.store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.currentModule.moduleNameTrim).requestUpdateProperties);
    //this.requestRollbackPropertiesState = this.store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.currentModule.moduleNameTrim).requestRollbackProperties);
    //this.globalPropertiesState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, ModuleList.Base.moduleNameTrim).globalProperties);
    //this.editingWidgetsState = store.select(state => widgetContentReducer.getWidgetContentDetailState(state, this.currentModule.moduleNameTrim).editingWidgets);
    //this.rowsDataState = this.store.select(state => widgetContentReducer.getWidgetContentDetailState(state, this.currentModule.moduleNameTrim).rowsData);
    //this.isEditAllWidgetModeState = store.select(state => widgetContentReducer.getWidgetContentDetailState(state, this.currentModule.moduleNameTrim).isEditAllWidgetMode);
    this.isSelectionProject = Configuration.PublicSettings.isSelectionProject;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.reattach();

    this.listenKeyRequestItem = this.getListenKeyRequestItem();
    this.disableButtonEditWidget =
      (!this.isSelectionProject && !this.listenKeyRequestItem) ||
      (!!this.listenKeyRequestItem && !this.listenKeyRequestItem.value) ||
      this.data.idRepWidgetType == this.WidgetTypeView.FieldSetReadonly;

    if (
      this.currentModule.idSettingsGUI === 7 &&
      this.data.idRepWidgetType === this.WidgetTypeView.NoteForm
    ) {
      this.disableButtonEditWidget = !this.listenKeyValue;
    }

    this.enableEditWidgetContextMenu();

    if (
      changes['selectedEntity'] &&
      this.hasChanges(changes['selectedEntity'])
    ) {
      this.subscribeSelectedEntity();
    }
    if (!changes['widgetStates'] && !changes['tabHeaderTableFilter']) {
      return;
    }
    const hasChanges =
      this.hasChanges(changes['widgetStates']) ||
      this.hasChanges(changes['tabHeaderTableFilter']);

    if (
      (this.payload && this.payload.idRepWidgetApp) ||
      (this.data && this.data.idRepWidgetApp)
    ) {
      this.buildAccessRight();
    }

    if (hasChanges && this.widgetStates.length) {
      this.processData();
      if (this.data.idRepWidgetType === this.WidgetTypeView.NoteForm) {
        this.dataSourceNotes =
          !this.data ||
          !this.data.contentDetail ||
          !this.data.contentDetail.data ||
          !this.data.contentDetail.data[1]
            ? []
            : this.data.contentDetail.data[1];
      }
    }

    if (this.hasChanges(changes['widgetStates'])) {
      this.showEditingNotification();
      this.checkToHideWidgetToolbarForSpecialCases();

      if (this.isOnEditFileExplorer) {
        this.isOnEditFileExplorer = false;
      }

      if (this.isDeletedFiles) {
        this.isDeletedFiles = false;
      }

      this.intSavingWidgetType();
      // this.waitingWidgetDataLoadedToSetMenu();

      if (this.data.idRepWidgetApp) {
        this.initContextMenu();
      }

      // Check linked widget status at desgin mode
      this.checkLinkedWidgetStatus();
      this.buildIsShowToolPanelSetting();
      this.resetSomeKeyOfSignalR();
      this.createSavSendLetterData();
    }

    if (this.hasChanges(changes['currentModule'])) {
      this.isCampaignCountrySelection = (
        changes['currentModule'].currentValue || {}
      ).idSettingsGUI;
    }

    this.detach(2000);
  }

  private subscribeSelectedEntity() {
    setTimeout(() => {
      if (!this.contextMenuData || !this.contextMenuData.length) {
        return;
      }
      this.contextMenuData[1].disabled = !this.selectedEntity;
    }, 1000);
  }

  private initState() {
    this.requestSavePropertiesState = this.store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          this.currentModule.moduleNameTrim
        ).requestSave
    );
    this.requestApplyPropertiesState = this.store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          this.currentModule.moduleNameTrim
        ).requestApply
    );
    this.requestUpdatePropertiesState = this.store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          this.currentModule.moduleNameTrim
        ).requestUpdateProperties
    );
    this.requestRollbackPropertiesState = this.store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          this.currentModule.moduleNameTrim
        ).requestRollbackProperties
    );
    this.globalPropertiesState = this.store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).globalProperties
    );
    this.editingWidgetsState = this.store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.currentModule.moduleNameTrim
        ).editingWidgets
    );
    this.rowsDataState = this.store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.currentModule.moduleNameTrim
        ).rowsData
    );
    this.isEditAllWidgetModeState = this.store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.currentModule.moduleNameTrim
        ).isEditAllWidgetMode
    );
  }

  ngOnInit() {
    this.printId = Uti.guid();
    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };

    this.accessRightAll = {
      ...this.accessRight,
      ...this.accessRightForCommandButton,
    };

    this.menuStatusSettings = new WidgetMenuStatusModel();
    this.menuStatusSettings.setAccessRight(this.accessRightAll);
    this.initState();
    this.subscribe();
  }

  ngAfterViewInit() {
    this.signalRRegisterEvent();

    setTimeout(() => {
      if (this.data && this.data.id) {
        this.store.dispatch(
          this.widgetDetailActions.clearWidgetTableDataRows(
            this.data,
            this.currentModule
          )
        );
      }
    }, 200);
  }

  private subscribeRequestClearPropertiesSuccessState() {
    this.requestClearPropertiesSuccessSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            PropertyPanelActions.REQUEST_CLEAR_PROPERTIES_SUCCESS &&
          action.module.idSettingsGUI == this.currentModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.afterCheckDirtyWhenClickOutSide();
        });
      });
  }

  private subscribe() {
    this.subscribeRequestClearPropertiesSuccessState();
    this.subscribeSaveTranslateSuccess();
    if (this.editingWidgetsStateSubscription) {
      this.editingWidgetsStateSubscription.unsubscribe();
    }

    this.editingWidgetsStateSubscription = this.editingWidgetsState.subscribe(
      (editingWidgets: Array<EditingWidget>) => {
        this.appErrorHandler.executeAction(() => {
          this.editingWidgets = editingWidgets;
        });
      }
    );

    this.requestSavePropertiesStateSubscription =
      this.requestSavePropertiesState.subscribe(
        (requestSavePropertiesState: any) => {
          this.appErrorHandler.executeAction(() => {
            if (
              requestSavePropertiesState &&
              JSON.stringify(this.propertiesForSaving) !==
                JSON.stringify(this.properties)
            ) {
              this.saveProperties(
                requestSavePropertiesState.propertiesParentData
              );
            }
          });
        }
      );

    this.requestApplyPropertiesStateSubscription =
      this.requestApplyPropertiesState.subscribe(
        (requestApplyPropertiesState: any) => {
          this.appErrorHandler.executeAction(() => {
            if (requestApplyPropertiesState) {
              const widgetData: WidgetDetail =
                requestApplyPropertiesState.propertiesParentData;
              if (widgetData && widgetData.id === this.data.id) {
                // this.changeProperties();
                this.saveChangeOfPropDisplayFields();
                this.saveChangeOfPropImportantDisplayFields();
                this.saveChangeOfPropFieldFormat();
              }
            }
          });
        }
      );

    this.requestUpdatePropertiesStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === PropertyPanelActions.UPDATE_PROPERTIES &&
          (action.module || {}).idSettingsGUI ==
            (this.currentModule || {}).idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((actionData) => {
        this.appErrorHandler.executeAction(() => {
          if (actionData) {
            this.widgetPropertyEditing = actionData;
            const widgetData: WidgetDetail = actionData.widgetData;
            const properties: any = actionData.widgetProperties;
            if (
              widgetData &&
              widgetData.id &&
              this.data.id &&
              widgetData.id === this.data.id &&
              properties
            ) {
              this.settingNewDataForProperties = true;
              if (properties.length) {
                this.properties = JSON.parse(JSON.stringify(properties));
              }
              if (!this.properties) {
                this.widgetProperties = properties;
              }
              this.changeProperties();
              this.requestDataWhenChangePropety(actionData);
              this.reattach();
              this.detach(2000);
            }
          }
        });
      });

    this.requestUpdateTempPropertiesStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === PropertyPanelActions.UPDATE_TEMP_PROPERTIES &&
          (action.module || {}).idSettingsGUI ==
            (this.currentModule || {}).idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((actionData) => {
        this.appErrorHandler.executeAction(() => {
          // if (!actionData || this.isEditingLayout) return;
          // this.properties = actionData;
          // this.changeProperties();
          // setTimeout(() => {
          //     this.ref.markForCheck();
          //     this.ref.detectChanges();
          // }, 500);
        });
      });

    this.requestUpdateOriginalPropertiesStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === PropertyPanelActions.UPDATE_ORIGINAL_PROPERTIES &&
          (action.module || {}).idSettingsGUI ==
            (this.currentModule || {}).idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.originalProperties = cloneDeep(this.properties);
        });
      });

    this.requestRollbackPropertiesStateSubscription =
      this.requestRollbackPropertiesState.subscribe(
        (requestRollbackPropertiesState: any) => {
          this.appErrorHandler.executeAction(() => {
            if (
              requestRollbackPropertiesState &&
              requestRollbackPropertiesState.data &&
              !requestRollbackPropertiesState.isGlobal
            ) {
              const widgetData: WidgetDetail =
                requestRollbackPropertiesState.data;
              if (
                widgetData &&
                widgetData.id &&
                this.data.id &&
                widgetData.id === this.data.id
              ) {
                // update original properties for saving before assign it to the properties
                this.updateOrgPropertiesBeforeRollback();
                this.properties = cloneDeep(this.originalProperties);
                this.resetPropertiesToOriginal();
                // if (isNil(this.propertiesForSaving.properties)) {
                //     this.properties = cloneDeep(this.propertiesForSaving);
                // } else {
                //     this.properties = cloneDeep(this.propertiesForSaving.properties);
                // }
                const propTitleText: WidgetPropertyModel =
                  this.propertyPanelService.getItemRecursive(
                    this.properties,
                    'TitleText'
                  );
                propTitleText.translatedValue = this.title.value;
                this.updatePropertiesFromGlobalProperties(
                  this.globalProperties
                );
                const widgetPropertiesStateModel: WidgetPropertiesStateModel =
                  new WidgetPropertiesStateModel({
                    widgetData: this.data,
                    widgetProperties: this.properties,
                  });
                this.store.dispatch(
                  this.propertyPanelActions.updateProperties(
                    widgetPropertiesStateModel,
                    this.currentModule
                  )
                );
              }
            }
          });
        }
      );

    this.globalPropertiesStateSubscription = this.globalPropertiesState
      .throttleTime(200)
      .distinctUntilChanged()
      .subscribe((globalProperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalProperties) {
            this.globalProperties = globalProperties;
            this.updatePropertiesFromGlobalProperties(globalProperties);
            this.updateWidgetFormGeneralStyle(globalProperties);
            this.updateWidgetFormLabelStyle(globalProperties);
            this.updateWidgetFormDataStyle(globalProperties);
            this.updateWidgetFormSeparatorStyle(globalProperties);
            this.updateWidgetTableRowBackground(globalProperties);
          }
        });
      });

    if (this.rowsDataStateSubscription)
      this.rowsDataStateSubscription.unsubscribe();
    this.rowsDataStateSubscription = this.rowsDataState.subscribe(
      (rowsData: any) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedRowsData = rowsData;
        });
      }
    );

    this.tabChangedSuccessSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabSummaryActions.TAB_CHANGED_SUCCESS &&
          (action.module || {}).idSettingsGUI ==
            (this.currentModule || {}).idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (this.requestChangeTab) {
            if (this.requestChangeTab.nextEvent == 'new') {
              setTimeout(() => {
                this.store.dispatch(
                  this.widgetDetailActions.canceAllWidgetEditing(
                    this.currentModule
                  )
                );
                this.store.dispatch(
                  this.tabButtonActions.requestNew(this.currentModule)
                );
                this.requestChangeTab = null;
              }, 100);
            } else if (this.requestChangeTab.nextEvent == 'edit') {
              setTimeout(() => {
                this.store.dispatch(
                  this.widgetDetailActions.canceAllWidgetEditing(
                    this.currentModule
                  )
                );
                this.store.dispatch(
                  this.tabButtonActions.requestEdit(this.currentModule)
                );
                this.requestChangeTab = null;
              }, 100);
            }
          }
        });
      });

    this.tabChangedFailedSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === TabSummaryActions.TAB_CHANGED_FAILED &&
          (action.module || {}).idSettingsGUI ==
            (this.currentModule || {}).idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (this.requestChangeTab) {
            if (this.requestChangeTab.nextEvent == 'new') {
              this.toasterService.pop(
                'warning',
                'Add Failed',
                'Cannot add new data'
              );
            } else if (this.requestChangeTab.nextEvent == 'edit') {
              this.toasterService.pop(
                'warning',
                'Edit Failed',
                'Cannot edit this data'
              );
            }

            this.requestChangeTab = null;
          }
        });
      });

    this.requestRemoveConnectionFromParentWidgetSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            WidgetDetailActions.REQUEST_REMOVE_CONNECTION_FROM_PARENT_WIDGET &&
          (action.module || {}).idSettingsGUI ==
            this.currentModule.idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((parentWidgetId) => {
        this.appErrorHandler.executeAction(() => {
          if (
            parentWidgetId &&
            ((this.data.widgetDataType.parentWidgetIds &&
              this.data.widgetDataType.parentWidgetIds.indexOf(
                parentWidgetId
              ) !== -1) ||
              (this.data.syncWidgetIds &&
                this.data.syncWidgetIds.indexOf(parentWidgetId) !== -1))
          ) {
            const withParkedItemProp =
              this.propertyPanelService.getItemRecursive(
                cloneDeep(this.properties),
                'WithParkedItem'
              );
            this.removeLinkWidgetSuccess(
              true,
              !!withParkedItemProp && withParkedItemProp.value
            );

            this.linkedSuccessWidget =
              !!withParkedItemProp && withParkedItemProp.value;
          }
        });
      });

    this.requestRemoveConnectionFromChildWidgetSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            WidgetDetailActions.REQUEST_REMOVE_CONNECTION_FROM_CHILD_WIDGET &&
          (action.module || {}).idSettingsGUI ==
            (this.currentModule || {}).idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((parentWidgetIds: Array<string>) => {
        this.appErrorHandler.executeAction(() => {
          if (parentWidgetIds && parentWidgetIds.length) {
            parentWidgetIds.forEach((parentWidgetId) => {
              if (parentWidgetId == this.data.id) {
                this.linkedSuccessWidget = false;
                this.checkLinkedWidgetStatus();
              }
            });
          }
        });
      });

    this.isEditAllWidgetModeStateSubscription =
      this.isEditAllWidgetModeState.subscribe(
        (isEditAllWidgetModeState: boolean) => {
          this.appErrorHandler.executeAction(() => {
            if (this.isEditAllWidgetMode !== isEditAllWidgetModeState) {
              this.isEditAllWidgetMode = isEditAllWidgetModeState;

              if (this.isSelectionProject) {
                setTimeout(() => {
                  if (this.widgetMenuStatusComponent) {
                    this.widgetMenuStatusComponent.toggleToolButtonsWithoutClick(
                      isEditAllWidgetModeState
                    );
                  }

                  if (
                    this.isEditAllWidgetMode &&
                    this.data.idRepWidgetType == WidgetType.FieldSet &&
                    this.widgetFormComponent
                  ) {
                    this.editFormWidget(1);
                  } else {
                    this.resetWidget();
                  }
                }, 200);
              }
            }
          });
        }
      );
  }

  private saveProperties(widgetDetail: WidgetDetail) {
    const widgetData: WidgetDetail = widgetDetail;
    if (widgetData && widgetData.id === this.data.id) {
      this.changeProperties();
      this.propertiesForSaving.properties = cloneDeep(this.properties);
      this._saveMenuChanges();
    }
  }

  handleRowGroupPanel(data) {
    this.rowGrouping = data;
    const prop = this.propertyPanelService.getItemRecursive(
      this.properties,
      'RowGrouping'
    );
    if (prop) prop.value = this.rowGrouping;
  }

  onShowCreditCardSelection($event) {
    let checkShowCreditCardSelection = $event;
    let checkEditMode = checkShowCreditCardSelection;
    if (Array.isArray($event)) {
      checkShowCreditCardSelection = $event[0];
      checkEditMode = $event[1];
    }
    this.isShowCreditCardSelection = checkShowCreditCardSelection;
    this.creditCardComponent._editMode = checkEditMode;
  }

  public onChangeColumnLayoutHandler($event) {
    this.widgetMenuStatusComponent.onColumnsLayoutSettingsChanged();
    if (
      $event &&
      $event.type == 'columnResized' &&
      $event.source == 'autosizeColumns'
    ) {
      this.allowFitColumn = false;
      if (this.columnLayoutsetting) {
        this.columnLayoutsetting.isFitWidthColumn = false;
        this.updateFitWidthColumnProperty(this.columnLayoutsetting);
      }
    }
    setTimeout(() => {
      this.reattach();
      this.ref.detectChanges();
    }, 250);
  }

  private checkToHideWidgetToolbarForSpecialCases() {
    if (this.isHideWidetToolbarSpecialCase) return;

    if (this.data) {
      // is return-refund module and is
      // new-invoice/return-payment/refund-payment/invoice-number
      this.isHideWidetToolbarSpecialCase =
        this.data.idRepWidgetType === WidgetType.ReturnRefund &&
        (this.data.idRepWidgetApp == 78 ||
          this.data.idRepWidgetApp == 85 ||
          this.data.idRepWidgetApp == 77 ||
          this.data.idRepWidgetApp == 74);
    }
  }

  controlMenuStatusToolButtons(value: boolean) {
    if (this.widgetMenuStatusComponent) {
      this.widgetMenuStatusComponent.toggleToolButtonsWithoutClick(value);
      this.ref.markForCheck();
      this.ref.detectChanges();
    }
  }

  private updateOrgPropertiesBeforeRollback() {
    // display fields
    this.updateChangeOfPropDisplayFields();

    // important fields
    this.updateChangeOfPropImportantDisplayFields();

    // Field Format (Label + Data)
    if (
      this.data.idRepWidgetType === WidgetType.FieldSet ||
      this.data.idRepWidgetType === WidgetType.Combination ||
      this.data.idRepWidgetType === WidgetType.CombinationCreditCard ||
      this.data.idRepWidgetType === WidgetType.FieldSetReadonly
    ) {
      this.updateChangeOfPropLabelFieldFormat();
      this.updateChangeOfPropDataFieldFormat();
    }
  }

  private saveChangeOfPropDisplayFields() {
    const propertiesResetBackground =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'ResetBackground'
      );
    const valueResetBackground =
      propertiesResetBackground && propertiesResetBackground.value;
    if (this.updateChangeOfPropDisplayFields()) {
      this.propertiesForSaving.properties = cloneDeep(this.properties);
      this._saveMenuChanges(false);
    }
  }

  private updateChangeOfPropDisplayFields(): boolean {
    // get from properties
    const propDisplayField: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'DisplayField'
      );
    const propShowDropDownOfField: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'ShowDropDownOfField'
      );
    const propBackgroundStyleImage: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'WidgetBackgroundStyleImage'
      );
    const propDisplayColumn: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'DisplayColumn'
      );
    // get from propertiesForSaving
    const propDisplayField_ForSaving: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.propertiesForSaving.properties,
        'DisplayField'
      );
    const propShowDropDownOfField_ForSaving: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.propertiesForSaving.properties,
        'ShowDropDownOfField'
      );
    const propBackgroundStyleImage_ForSaving: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.propertiesForSaving.properties,
        'WidgetBackgroundStyleImage'
      );
    const propDisplayColumn_ForSaving: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.propertiesForSaving.properties,
        'DisplayColumn'
      );
    if (
      !propDisplayField_ForSaving ||
      !propDisplayColumn_ForSaving ||
      !propShowDropDownOfField_ForSaving
    )
      return;
    // update
    if (
      (propDisplayField &&
        JSON.stringify(propDisplayField.options) !==
          JSON.stringify(propDisplayField_ForSaving.options)) ||
      (propDisplayColumn &&
        JSON.stringify(propDisplayColumn.options) !==
          JSON.stringify(propDisplayColumn_ForSaving.options)) ||
      (propShowDropDownOfField &&
        JSON.stringify(propShowDropDownOfField.options) !==
          JSON.stringify(propShowDropDownOfField_ForSaving.options)) ||
      (propBackgroundStyleImage &&
        JSON.stringify(propBackgroundStyleImage.value) !==
          JSON.stringify(propBackgroundStyleImage_ForSaving.value))
    ) {
      if (propDisplayField)
        propDisplayField_ForSaving.options = cloneDeep(
          propDisplayField.options
        );
      if (propShowDropDownOfField)
        propShowDropDownOfField_ForSaving.options = cloneDeep(
          propShowDropDownOfField.options
        );
      if (propDisplayColumn)
        propDisplayColumn_ForSaving.options = cloneDeep(
          propDisplayColumn.options
        );

      return true;
    }
    return false;
  }

  private saveChangeOfPropImportantDisplayFields() {
    if (this.updateChangeOfPropImportantDisplayFields()) {
      // Reset widget properties dirty
      this.properties = this.propertyPanelService.resetDirty(this.properties);
      this.propertiesForSaving.properties =
        this.propertyPanelService.resetDirty(
          this.propertiesForSaving.properties
        );

      // Save setting here
      this.onChangeFieldFilter.emit({
        widgetDetail: this.data,
      });
    }
  }

  private updateChangeOfPropImportantDisplayFields(): boolean {
    if (
      !(
        this.data.idRepWidgetType === WidgetType.FieldSet ||
        this.data.idRepWidgetType === WidgetType.DataGrid ||
        this.data.idRepWidgetType === WidgetType.Combination ||
        this.data.idRepWidgetType === WidgetType.CombinationCreditCard ||
        this.data.idRepWidgetType === WidgetType.FieldSetReadonly
      )
    )
      return false;

    // get from properties
    const propDisplayField: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'ImportantDisplayFields'
      );
    // get from propertiesForSaving
    const propDisplayField_ForSaving: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.propertiesForSaving.properties,
        'ImportantDisplayFields'
      );
    // update
    if (
      propDisplayField &&
      JSON.stringify(propDisplayField.options) !==
        JSON.stringify(propDisplayField_ForSaving.options)
    ) {
      if (propDisplayField)
        propDisplayField_ForSaving.options = cloneDeep(
          propDisplayField.options
        );
      return true;
    }
    return false;
  }

  /**
   * saveChangeOfPropFieldFormat
   */
  private saveChangeOfPropFieldFormat() {
    if (
      !(
        this.data.idRepWidgetType === WidgetType.FieldSet ||
        this.data.idRepWidgetType === WidgetType.Combination ||
        this.data.idRepWidgetType === WidgetType.CombinationCreditCard ||
        this.data.idRepWidgetType === WidgetType.FieldSetReadonly
      )
    )
      return;

    let isUpdated = false;
    // update Prop Label Field Format
    if (this.updateChangeOfPropLabelFieldFormat()) {
      // Reset widget properties dirty
      this.properties = this.propertyPanelService.resetDirty(this.properties);
      this.propertiesForSaving.properties =
        this.propertyPanelService.resetDirty(
          this.propertiesForSaving.properties
        );
      isUpdated = true;
    }
    // update Prop Data Field Format
    if (this.updateChangeOfPropDataFieldFormat()) {
      // Reset widget properties dirty
      this.properties = this.propertyPanelService.resetDirty(this.properties);
      this.propertiesForSaving.properties =
        this.propertyPanelService.resetDirty(
          this.propertiesForSaving.properties
        );
      isUpdated = true;
    }

    if (isUpdated) {
      // Save setting here
      this.onChangeFieldFilter.emit({
        widgetDetail: this.data,
      });
    }
  }

  private updateChangeOfPropLabelFieldFormat(): boolean {
    const labelDisplayProp: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'LabelDisplay'
      );
    const labelDisplayProp_ForSaving: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.propertiesForSaving.properties,
        'LabelDisplay'
      );
    // update
    if (
      labelDisplayProp &&
      labelDisplayProp_ForSaving &&
      JSON.stringify(labelDisplayProp.value) !==
        JSON.stringify(labelDisplayProp_ForSaving.value)
    ) {
      labelDisplayProp_ForSaving.value = cloneDeep(labelDisplayProp.value);
      return true;
    }
    return false;
  }

  private updateChangeOfPropDataFieldFormat(): boolean {
    const dataDisplayProp: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'DataDisplay'
      );
    const dataDisplayProp_ForSaving: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.propertiesForSaving.properties,
        'DataDisplay'
      );
    // update
    if (
      dataDisplayProp &&
      dataDisplayProp_ForSaving &&
      JSON.stringify(dataDisplayProp.value) !==
        JSON.stringify(dataDisplayProp_ForSaving.value)
    ) {
      dataDisplayProp_ForSaving.value = cloneDeep(dataDisplayProp.value);
      return true;
    }
    return false;
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.removeHorizontalPerfectScrollEvent();
    this.removeVerticalPerfectScrollEvent();
    Uti.unsubscribe(this);
    this.runImmediatelyRowDatas.length = 0;
  }

  private subscribeSaveTranslateSuccess() {
    this.successSavedSubscription =
      this._resourceTranslationService.successSaved$.subscribe((status) => {
        switch (this.data.idRepWidgetType) {
          case WidgetType.DataGrid:
            // this.updateTableStatusAfterCompletedSaving();
            this.allowGridTranslation = false;
            break;
        }
      });
  }

  saveWidget(event): void {
    this.onSaveWidget.emit();
    switch (this.data.idRepWidgetType) {
      case WidgetType.FieldSet:
        if (this.currentModule.idSettingsGUI === MenuModuleId.customer) {
          this.checkMatchingDataBeforeSaveWidgetData();
          break;
        }
        this.saveFormWidget();
        break;
      case WidgetType.Combination:
        this.saveCombinationWidget();
        break;

      case WidgetType.CombinationCreditCard:
        this.saveFormCreditCardCombinationWidget();
        break;

      // case WidgetType.EditableTable:
      case WidgetType.EditableGrid:
      case WidgetType.EditableRoleTreeGrid:
        this.saveEditableTableWidget();
        break;

      case WidgetType.FileExplorer:
      case WidgetType.ToolFileTemplate:
        this.saveFileExplorerWidget();
        break;
      case WidgetType.FileExplorerWithLabel:
        if (this.xnFileExplorerComponentCtrl) {
          this.xnFileExplorerComponentCtrl.saveUpdateData();
        }
        break;
      case WidgetType.FileTemplate:
        this.saveFileManagement();
        break;

      case WidgetType.Country:
        this.saveCountryWidget();
        break;

      case WidgetType.TreeView:
        this.saveTreeView();
        break;

      case WidgetType.Translation: {
        this.widgetTranslationComponent.submit(() => {
          this.onSaveSuccessWidget.emit(this.data);
          this.reloadWidgets.emit([
            this.widgetTranslationComponent.translateCommunicationData
              .srcWidgetDetail,
          ]);
        });
        break;
      }

      case WidgetType.CountrySelection: {
        this.countrySelectionCombine.submit(() => {
          this.onSaveSuccessWidget.emit(this.data);
        });
        break;
      }

      case WidgetType.DoubleGrid: {
        if (this.countryBlacklist) {
          this.countryBlacklist.submit(() => {
            this.onSaveSuccessWidget.emit(this.data);
          });
        }
        if (this.ageFilterGrid) {
          this.ageFilterGrid.submit(() => {
            this.onSaveSuccessWidget.emit(this.data);
          });
        }
        if (this.extendedFilterGrid) {
          this.extendedFilterGrid.submit(() => {
            this.onSaveSuccessWidget.emit(this.data);
          });
        }
        if (this.groupPriority) {
          this.groupPriority.submit(() => {
            this.onSaveSuccessWidget.emit(this.data);
          });
        }
        if (this.frequencyGrid) {
          this.frequencyGrid.submit(() => {
            this.onSaveSuccessWidget.emit(this.data);
          });
        }
        break;
      }

      case WidgetType.TripleGrid: {
        if (this.selectionProjectDetail) {
          this.selectionProjectDetail.submit(() => {
            this.onSaveSuccessWidget.emit(this.data);
          });
        }
        break;
      }

      case WidgetType.SAVLetter: {
        if (this.savLetterTemplateComponent) {
          this.savLetterTemplateComponent.submit();
        }
        break;
      }
      default:
        if (this.widgetComponent && this.widgetComponent.submit) {
          this.widgetComponent.submit((...arg) => {
            this.onSaveSuccessWidget.emit(this.data);
            if (arg && arg[0] && arg[0].isReloadWidget) {
              this.reloadLinkWidgetAfterDataSaved();
            }
          });
        }
        break;
    }

    this.buildContextMenu(
      this.contextMenuData,
      this.data.idRepWidgetType,
      this.currentModule,
      this.toolbarSetting,
      this.selectedTabHeader,
      this.activeSubModule
    );
  }

  private reloadLinkWidgetAfterDataSaved() {
    this.reloadLinkWidgets.emit(this.data);
  }

  /**
   * resetWidget
   */
  public resetWidget(callback?: Function): void {
    if (this.agGridComponent) {
      this.agGridComponent.stopEditing();
    }
    // show message modal in case of widget edited
    setTimeout(() => {
      if (
        this.isWidgetDataEdited &&
        this.data.idRepWidgetType === this.WidgetTypeView.NoteForm
      ) {
        const hasData = !!this.noteFormDataAction.status.hasData;
        if (!hasData) {
          this.onModalSaveAndExit.bind(this);
          this.resetEditingWidget(callback);
        } else {
          setTimeout(() => {
            this.modalService.unsavedWarningMessageDefault({
              headerText: 'Reset Widget',
              onModalSaveAndExit: () => {
                const updateRequest =
                  this.widgetNoteFormComponent.getDataSave();
                this.callSaveNoteFormWidget(updateRequest);
                this.resetEditingWidget(callback);
              },
              onModalExit: () => {
                this.onModalExit.bind(this);
                this.resetEditingWidget(callback);
              },
              onModalCancel: this.onModalCancel.bind(this),
            });
          });
        }
        return;
      } else if (
        this.isWidgetDataEdited &&
        this.data.idRepWidgetType !== this.WidgetTypeView.NoteForm
      ) {
        setTimeout(() => {
          // this.initForMessageModal(MessageModal.MessageType.warning);
          this.modalService.unsavedWarningMessageDefault({
            headerText: 'Reset Widget',
            onModalSaveAndExit: this.onModalSaveAndExit.bind(this),
            onModalExit: this.onModalExit.bind(this),
            onModalCancel: this.onModalCancel.bind(this),
          });
        });
        return;
      }
      this.resetEditingWidget(callback);
    });
  }

  private showModalWarningMesDefault(
    funcSaveAndExist: any,
    funcNotSaveAndExist: any = null
  ) {
    setTimeout(() => {
      // this.initForMessageModal(MessageModal.MessageType.warning);
      this.modalService.unsavedWarningMessageDefault({
        headerText: 'Reset Widget',
        onModalSaveAndExit: funcSaveAndExist,
        onModalExit: !!funcNotSaveAndExist
          ? funcNotSaveAndExist
          : this.onModalExit.bind(this),
        onModalCancel: this.onModalCancel.bind(this),
      });
    });
  }

  private cancelEditing() {
    this.resetWidget();
  }

  /**
   * resetWidgetToViewMode
   **/
  public resetWidgetToViewMode(
    fromWidgetContainer?: boolean,
    callback?: Function,
    manualReset?: boolean
  ) {
    switch (this.data.idRepWidgetType) {
      case WidgetType.FieldSet:
      case WidgetType.FieldSetReadonly:
        this.resetForm();
        break;
      case WidgetType.CombinationCreditCard:
        this.resetForm();
        this.resetValueForCreditCard();
        break;
      case WidgetType.DataGrid:
      // case WidgetType.EditableTable:
      case WidgetType.EditableGrid:
      case WidgetType.EditableRoleTreeGrid:
        this.changeDisplayTable(true);
        this.manageEditableTableStatusButtonsAfterSaving();
        this.isOnEditingTable = false;
        this.isTableEdited = false;
        this.templateId = null;
        if (this.agGridComponent) {
          // this.agGridComponent.isSelectDeletedAll = false;
          this.agGridComponent.toggleDeleteColumn(false);
        }

        if (
          !fromWidgetContainer &&
          (this.data.idRepWidgetApp == RepWidgetAppIdEnum.CustomerStatus ||
            this.data.idRepWidgetApp ==
              RepWidgetAppIdEnum.CustomerBusinessStatus)
        ) {
          this.isCustomerStatusWidgetEdit = false;
        }
        this.changeToEditModeDefault();
        if (this.allowGridTranslation) {
          this.widgetMenuStatusComponent.openTranslateWidget('row');
        }
        break;
      case WidgetType.Combination:
        this.changeDisplayTable(true);
        this.manageEditableTableStatusButtonsAfterSaving();
        this.isOnEditingTable = false;
        this.isTableEdited = false;
        if (this.widgetFormComponent) {
          this.widgetFormComponent.resetValue();
          if (!this.showInDialog) {
            this.widgetFormComponent.editFormMode = false;
            this.widgetFormComponent.resetToViewMode();
          }
        }

        if (this.agGridComponent) {
          // this.agGridComponent.isSelectDeletedAll = false;
        }
        break;
      case WidgetType.Country:
        if (!this.showInDialog) {
          this.resetCountryWidget();
        } else {
          this.widgetCountryComponent.resetData();
        }
        break;
      case WidgetType.TreeView:
        this.resetTreeView();
        break;
      case WidgetType.Upload:
        this.articleMediaManagerComponent.uploadMode = false;
        break;
      case WidgetType.FileExplorer:
      case WidgetType.ToolFileTemplate:
        this.resetFileExplorer();
        break;
      case WidgetType.FileExplorerWithLabel:
        this.xnFileExplorerComponentCtrl.resetData(true);
        if (callback) callback();
        break;
      case WidgetType.FileTemplate:
        this.resetFileManagement();
        break;
      case WidgetType.Translation:
        if (this.widgetTranslationComponent) {
          this.widgetTranslationComponent.reload();
        }
        break;
      case WidgetType.CountrySelection:
        if (manualReset && this.isSelectionProject) {
          this.isOnEditingTable = false;

          if (this.countrySelectionCombine) {
            this.countrySelectionCombine.reload();
          }

          if (!this.isEditAllWidgetMode) {
            this.widgetMenuStatusComponent.toggleToolButtons(false);
            this.widgetMenuStatusComponent.toggleToolButtonsWithoutClick(false);
          }
        }

        break;
      case WidgetType.DoubleGrid:
        if (manualReset && this.isSelectionProject) {
          this.isOnEditingTable = false;

          if (this.isEditAllWidgetMode) {
            this.mouseDblClick(null);
          } else {
            if (this.countryBlacklist) {
              this.countryBlacklist.reload();
            }
            if (this.ageFilterGrid) {
              this.ageFilterGrid.reload();
            }
            if (this.extendedFilterGrid) {
              this.extendedFilterGrid.reload();
            }
            if (this.groupPriority) {
              this.groupPriority.reload();
            }
            if (this.databaseCombineGrid) {
              this.databaseCombineGrid.reload();
            }

            if (this.frequencyGrid) {
              this.frequencyGrid.reload();
            }

            if (this.mediacodePricingGrid) {
              this.mediacodePricingGrid.reload();
            }

            this.widgetMenuStatusComponent.toggleToolButtons(false);
            this.widgetMenuStatusComponent.toggleToolButtonsWithoutClick(false);
          }
        }
        break;
      case WidgetType.TripleGrid:
        if (manualReset && this.isSelectionProject) {
          this.isOnEditingTable = false;

          if (this.isEditAllWidgetMode) {
            this.mouseDblClick(null);
          } else {
            if (this.selectionProjectDetail) {
              this.selectionProjectDetail.reload();
            }

            this.widgetMenuStatusComponent.toggleToolButtons(false);
            this.widgetMenuStatusComponent.toggleToolButtonsWithoutClick(false);
          }
        }
      case WidgetType.NoteForm:
        this.resetNoteForm();
      default:
        break;
    }
  }

  /**
   * resetEditingWidget
   */
  public resetEditingWidget(callback?: Function) {
    this.allowGridTranslation = false;
    this.menuStatusOpacity = 0;
    this.resetWidgetToViewMode(null, callback, true);
    if (!this.showInDialog) {
      this.onCancelEditingWidget.emit(this.data);
    }
    this.onResetWidget.emit(this.data);
    this.buildContextMenu(
      this.contextMenuData,
      this.data.idRepWidgetType,
      this.currentModule,
      this.toolbarSetting,
      this.selectedTabHeader,
      this.activeSubModule
    );
    this.reattach();
    this.reEditWhenInPopup();
    this.runImmediatelyRowDatas.length = 0;
  }

  public reEditWhenInPopup() {
    // re-open the edit button command of menu status when edit in popup
    this.menuStatusOpacity = 0;
    if (this.showInDialog) {
      setTimeout(() => {
        this.editWidget();
        this.menuStatusOpacity = 1;
      }, 200);
    } else {
      this.menuStatusOpacity = 1;
    }
  }

  editWidget(widgetType?: any) {
    if (widgetType != EditWidgetTypeEnum.InPopup) {
      switch (widgetType) {
        // the case has been removed
        case EditWidgetTypeEnum.EditableDeleteRow:
          this.deleteRowEditableTable();
          break;

        case EditWidgetTypeEnum.EditableAddNewRow:
          this.addRowEditableTable();
          break;

        default:
          switch (this.data.idRepWidgetType) {
            case WidgetType.FieldSet:
            case WidgetType.Combination:
            case WidgetType.CombinationCreditCard:
            case WidgetType.Translation:
              this.editFormWidget(widgetType);
              this.contextMenuData = this.widgetUtils.contextMenuInEditMode(
                this.contextMenuData,
                this.getAccessRightAll()
              );
              break;
            // case WidgetType.EditableTable:
            case WidgetType.EditableGrid:
            case WidgetType.EditableRoleTreeGrid:
            case WidgetType.FileExplorer:
            case WidgetType.ToolFileTemplate:
            case WidgetType.ToolFileTemplate:
            case WidgetType.FileExplorerWithLabel:
            case WidgetType.FileTemplate:
              this.editEditableTableWidget(widgetType);
              break;
            case WidgetType.Country:
              this.editCountryWidget(widgetType);
              break;
            case WidgetType.TreeView: {
              this.editTreeView();
              this.contextMenuData = this.widgetUtils.contextMenuInEditMode(
                this.contextMenuData,
                this.getAccessRightAll()
              );
              break;
            }
            case WidgetType.NoteForm:
              this.editNoteForm(widgetType);
              break;
          }
      }
    } else {
      this.onEditWidgetInPopup.emit(this.data);
    }
  }

  /**
   * hasChanges
   * @param changes
   */
  private hasChanges(changes) {
    return (
      changes &&
      changes.hasOwnProperty('currentValue') &&
      changes.hasOwnProperty('previousValue')
    );
  }

  private intSavingWidgetType(): void {
    if (!this.savingWidgetType && this.data.idRepWidgetType) {
      switch (this.data.idRepWidgetType) {
        case WidgetType.Combination:
          this.savingWidgetType = SavingWidgetType.Combination;
          break;
        case WidgetType.CombinationCreditCard:
          this.savingWidgetType = SavingWidgetType.CombinationCreditCard;
          break;
        case WidgetType.Country:
          this.savingWidgetType = SavingWidgetType.Country;
          break;
        case WidgetType.FieldSet:
          this.savingWidgetType = SavingWidgetType.Form;
          break;
        case WidgetType.TreeView:
          this.savingWidgetType = SavingWidgetType.TreeView;
          break;
        case WidgetType.FileTemplate:
          this.savingWidgetType = SavingWidgetType.FileTemplate;
        default:
          this.savingWidgetType = SavingWidgetType.EditableTable;
          break;
      }
    }
  }

  private initContextMenu() {
    this.widgetTemplateSettingService
      .getWidgetToolbar(
        null,
        null,
        (this.currentModule || {}).idSettingsGUI,
        ModuleType.WIDGET_TOOLBAR
      )
      .subscribe((response: ApiResultResponse) => {
        if (!Uti.isResquestSuccess(response)) {
          return;
        }

        let contextMenuText: any = {
          name: this.currentModule.moduleName,
          id: this.currentModule.moduleName,
        };
        //let moduleNameText = this.currentModule.moduleName;
        if (response.item.length && response.item[0].jsonSettings) {
          const widgetToolbarJson = Uti.tryParseJson(
            response.item[0].jsonSettings
          );
          if (widgetToolbarJson && widgetToolbarJson.length) {
            this.widgetToolbarSetting = widgetToolbarJson;
            contextMenuText = this.widgetUtils.getTabIDFromWidgetToolbar(
              contextMenuText,
              this.data.idRepWidgetApp,
              this.widgetToolbarSetting
            );
          }
        }

        this.contextMenuData = [
          {
            id: 'widget-new-entity-menu-context',
            title:
              (this.currentModule.idSettingsGUI ==
              ModuleList.BusinessCosts.idSettingsGUI
                ? 'Add '
                : 'New ') + contextMenuText.name,
            iconName: 'fa-plus  green-color',
            callback: (event) => {
              if (contextMenuText.name != this.currentModule.moduleName) {
                this.requestChangeTab = {
                  nextEvent: 'new',
                };
                this.store.dispatch(
                  this.tabSummaryActions.requestSelectTab(
                    contextMenuText.id,
                    this.currentModule
                  )
                );
              } else {
                this.store.dispatch(
                  this.tabButtonActions.requestNew(this.currentModule)
                );
              }
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: true,
          },
          {
            id: 'widget-edit-entity-menu-context',
            title: 'Edit ' + contextMenuText.name,
            iconName: 'fa-pencil-square-o  orange-color',
            callback: (event) => {
              if (contextMenuText.name != this.currentModule.moduleName) {
                this.requestChangeTab = {
                  nextEvent: 'edit',
                };
                this.store.dispatch(
                  this.tabSummaryActions.requestSelectTab(
                    contextMenuText.id,
                    this.currentModule
                  )
                );
              } else {
                this.store.dispatch(
                  this.tabButtonActions.requestEdit(this.currentModule)
                );
              }
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: true,
          },
          {
            id: 'widget-clone-entity-menu-context',
            title: 'Clone ' + contextMenuText.name,
            iconName: 'fa-copy',
            callback: (event) => {
              if (contextMenuText.name != this.currentModule.moduleName) {
                this.requestChangeTab = {
                  nextEvent: 'clone',
                };
                this.store.dispatch(
                  this.tabSummaryActions.requestSelectTab(
                    contextMenuText.id,
                    this.currentModule
                  )
                );
              } else {
                this.store.dispatch(
                  this.tabButtonActions.requestClone(this.currentModule)
                );
              }
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: true,
          },
          {
            id: 'widget-separator-menu-context',
            title: '',
            iconName: '',
            callback: (event) => {},
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: false,
            isSeparator: true,
          },
          {
            id: 'widget-edit-menu-context',
            title: 'Edit Widget',
            iconName: 'fa-pencil-square-o  orange-color',
            callback: (event) => {
              if (this.widgetMenuStatusComponent) {
                this.controlMenuStatusToolButtons(true);

                switch (this.data.idRepWidgetType) {
                  case WidgetType.FieldSet:
                  case WidgetType.Combination:
                  case WidgetType.CombinationCreditCard:
                    this.widgetMenuStatusComponent.editWidget('form');
                    break;
                  // case WidgetType.EditableTable:
                  case WidgetType.EditableGrid:
                  case WidgetType.FileExplorer:
                  case WidgetType.ToolFileTemplate:
                    this.widgetMenuStatusComponent.editWidget('table');
                    break;
                  case WidgetType.FileExplorerWithLabel:
                    this.widgetMenuStatusComponent.toggleToolButtons(true);
                    break;
                  case WidgetType.Country:
                    this.widgetMenuStatusComponent.editWidget('country');
                    break;
                  case WidgetType.TreeView: {
                    this.widgetMenuStatusComponent.editWidget('treeview');
                    break;
                  }
                  case WidgetType.NoteForm:
                    this.widgetMenuStatusComponent.editWidget(
                      EditWidgetTypeEnum.NoteForm
                    );
                    break;
                }
              }
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: true,
          },
          {
            id: 'widget-save-menu-context',
            title: 'Save Widget',
            iconName: 'fa-floppy-o  orange-color',
            callback: (event) => {
              this.saveWidget(this.savingWidgetType);
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hotkey: 'Ctrl + S',
            // hidden: !this.getAccessRightForCommandButton('ToolbarButton') || !this.getAccessRightForCommandButton('ToolbarButton__EditButton')
            hidden:
              !this.accessRight['edit'] ||
              !this.getAccessRightForCommandButton('ToolbarButton'),
          },
          {
            id: 'widget-add-row-menu-context',
            title: 'Add Row',
            iconName: 'fa-plus  green-color',
            callback: (event) => {
              this.addRowEditableTable();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            // hidden: !this.getAccessRightForCommandButton('ToolbarButton') || !this.getAccessRightForCommandButton('ToolbarButton__EditButton')
            hidden:
              !this.accessRight['edit'] ||
              !this.getAccessRightForCommandButton('ToolbarButton'),
          },
          {
            id: 'widget-upload-file-menu-context',
            title: 'Upload File',
            iconName: 'fa-cloud-upload  green-color',
            callback: (event) => {
              this.onUploadFileClick();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hotkey: '',
            // hidden: !this.getAccessRightForCommandButton('ToolbarButton') || !this.getAccessRightForCommandButton('ToolbarButton__EditButton')
            hidden:
              !this.accessRight['edit'] ||
              !this.getAccessRightForCommandButton('ToolbarButton'),
          },
          {
            id: 'widget-delete-file-menu-context',
            title: 'Delete File',
            iconName: 'fa-trash-o  red-color',
            callback: (event) => {
              this.onClickDeleteFiles();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hotkey: '',
            // hidden: !this.getAccessRightForCommandButton('ToolbarButton') || !this.getAccessRightForCommandButton('ToolbarButton__EditButton')
            hidden:
              !this.accessRight['delete'] ||
              !this.getAccessRightForCommandButton('ToolbarButton'),
          },
          {
            id: 'widget-cancel-menu-context',
            title: 'Cancel Edit Widget',
            iconName: 'fa-undo  red-color',
            callback: (event) => {
              this.cancelEditing();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            // hidden: !this.getAccessRightForCommandButton('ToolbarButton') || !this.getAccessRightForCommandButton('ToolbarButton__EditButton')
            hidden:
              !this.accessRight['edit'] ||
              !this.getAccessRightForCommandButton('ToolbarButton'),
          },
          {
            id: 'widget-translate-menu-context',
            title: 'Translate',
            iconName: 'fa-language  blue-color',
            callback: (event) => {
              // this.translateWidget(event);
              this.openTranslateWidget(event);
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden:
              !this.getAccessRightForCommandButton('ToolbarButton') ||
              !this.getAccessRightForCommandButton(
                'ToolbarButton__TranslateButton'
              ),
          },
          {
            id: 'widget-translate-fields-menu-context',
            title: 'Translate Fields',
            iconName: 'fa-tasks',
            callback: (event) => {
              this.onOpenFieldTranslateWidget(event);
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden:
              !(this.data.idRepWidgetApp == 106) ||
              !this.getAccessRightForCommandButton('ToolbarButton') ||
              !this.getAccessRightForCommandButton(
                'ToolbarButton__TranslateButton'
              ),
          },
          {
            id: 'widget-print-menu-context',
            title: 'Print',
            iconName: 'fa-print',
            callback: (event) => {
              this.printWidget();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden:
              !this.getAccessRightForCommandButton('ToolbarButton') ||
              !this.getAccessRightForCommandButton(
                'ToolbarButton__PrintButton'
              ),
          },
          {
            id: 'widget-refresh-menu-context',
            title: 'Refresh',
            iconName: 'fa-undo  green-color',
            callback: (event) => {
              this.onRefreshWidget();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: false,
          },
        ];

        this.buildContextMenu(
          this.contextMenuData,
          this.data.idRepWidgetType,
          this.currentModule,
          this.toolbarSetting,
          this.selectedTabHeader,
          this.activeSubModule
        );
        this.rebuildContextMenuForToggleEditForm();
        this.widgetUtils.rebuildContextMenuWhenChangeSimpleTab(
          this.contextMenuData,
          this._simpleTabData,
          this.getAccessRightAll(),
          this.currentModule
        );
        this.addContextMenuForDesignLayout();
        this.addMenuSettingForm();
        this.enableEditWidgetContextMenu();
      });
  }

  private addMenuSettingForm() {
    if (
      !!(
        (this.data.idRepWidgetType == this.WidgetTypeView.DataGrid &&
          this.displayReadonlyGridAsForm) ||
        this.data.idRepWidgetType == this.WidgetTypeView.FieldSet ||
        this.data.idRepWidgetType == this.WidgetTypeView.FieldSetReadonly
      ) &&
      !Uti.existItemInArray(this.contextMenuData, { id: 'settingForm' }, 'id')
    ) {
      this.contextMenuData.push({
        id: 'widget-separator-menu-context',
        title: '',
        iconName: '',
        subject: new Subject(),
        disabled: false,
        children: [],
        hidden: true,
        isSeparator: true,
      });
      this.contextMenuData.push({
        id: 'settingForm',
        title: 'Setting Form',
        iconName: '',
        subject: new Subject(),
        disabled: false,
        children: [
          {
            id: 'settingColumn',
            title: 'Setting Column',
            iconName: 'fa-columns  blue-color',
            callback: (event) => {
              this.widgetFormComponent.openSettingColumnDialog();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: false,
          },
          {
            id: 'settingPanel',
            title: 'Setting Panel',
            iconName: 'fa-square-o  blue-color',
            callback: (event) => {
              this.widgetFormComponent.openSettingPanelDialog();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: false,
          },
          {
            id: 'settingField',
            title: 'Setting Field',
            iconName: 'fa-cog  blue-color',
            callback: (event) => {
              this.widgetFormComponent.openSettingFieldDialog();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: false,
          },
          {
            id: 'settingAllFields',
            title: 'Setting All Fields',
            iconName: 'fa-bars  blue-color',
            callback: (event) => {
              this.widgetFormComponent.openSettingAllFieldDialog();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: false,
          },
        ],
        hidden: true,
      });
    }
    if (this.isEditingLayout) {
      this.setActiveContextMenuDesignLayout();
    }
  }

  private addContextMenuForDesignLayout() {
    if (
      !!(
        (this.data.idRepWidgetType == this.WidgetTypeView.DataGrid &&
          this.displayReadonlyGridAsForm) ||
        this.data.idRepWidgetType == this.WidgetTypeView.FieldSet ||
        this.data.idRepWidgetType == this.WidgetTypeView.FieldSetReadonly
      ) &&
      !Uti.existItemInArray(
        this.contextMenuData,
        { id: 'designTemplate' },
        'id'
      )
    ) {
      this.contextMenuData.push({
        id: 'widget-separator-menu-context',
        title: '',
        iconName: '',
        subject: new Subject(),
        disabled: false,
        children: [],
        hidden: true,
        isSeparator: true,
      });
      this.contextMenuData.push({
        id: 'designTemplate',
        title: 'Design Template',
        iconName: '',
        subject: new Subject(),
        disabled: false,
        children: [
          {
            id: 'addColumn',
            title: 'Add Column',
            iconName: 'fa-columns  blue-color',
            callback: (event) => {
              this.widgetFormComponent.addColumn();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: false,
          },
          {
            id: 'addPanel',
            title: 'Add Panel',
            iconName: 'fa-square-o  blue-color',
            callback: (event) => {
              this.widgetFormComponent.addPanel();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: false,
          },
          // {
          //     id: 'addRowPanel',
          //     title: 'Add Row Panel',
          //     iconName: 'fa-square-o  blue-color',
          //     callback: (event) => {
          //         this.widgetFormComponent.addPanel(true);
          //     },
          //     subject: new Subject(),
          //     disabled: false,
          //     children: [],
          //     hidden: false
          // },
          {
            id: 'addLineBreak',
            title: 'Add Line-break',
            iconName: 'fa-arrows-v  blue-color',
            callback: (event) => {
              this.widgetFormComponent.addLineBreak();
            },
            subject: new Subject(),
            disabled: false,
            children: [],
            hidden: false,
          },
        ],
        hidden: true,
      });
    }
    if (this.isEditingLayout) {
      this.setActiveContextMenuDesignLayout();
    }
  }

  private addContextMenuForSelectionExport(context) {
    if (
      Configuration.PublicSettings.isSelectionProject &&
      (this.data.idRepWidgetApp === 514 || this.data.idRepWidgetApp === 515) &&
      !Uti.existItemInArray(
        this.contextMenuData,
        { name: 'Selection Export' },
        'name'
      )
    ) {
      context.push({
        name: '',
        cssClasses: ['xn-ag-separator'],
        index: 710,
      });
      context.push({
        name: 'Selection Export',
        cssClasses: [''],
        icon: `<i class="fa  fa-download blue-color  ag-context-icon"/>`,
        index: 711,
        subMenu: [
          {
            name: 'All',
            cssClasses: [''],
            icon: `<i class="fa  fa-file-o  blue-color ag-context-icon"/>`,
            action: (event) => {
              this.store.dispatch(
                this.processDataActions.requestExportSelectionDataFromContextMenu(
                  'all',
                  this.currentModule
                )
              );
            },
          },
          {
            name: 'Mediacode',
            cssClasses: [''],
            icon: `<i class="fa  fa-file-excel-o green-color ag-context-icon"/>`,
            action: (event) => {
              this.store.dispatch(
                this.processDataActions.requestExportSelectionDataFromContextMenu(
                  'mediacode',
                  this.currentModule
                )
              );
            },
          },
          {
            name: 'Data',
            cssClasses: [''],
            icon: `<i class="fa  fa-file-archive-o orange-color  ag-context-icon"/>`,
            action: (event) => {
              this.store.dispatch(
                this.processDataActions.requestExportSelectionDataFromContextMenu(
                  'data',
                  this.currentModule
                )
              );
            },
          },
        ],
      });
    }
  }

  private execSelectedSimpleTab(data: SimpleTabModel) {
    this.widgetUtils.rebuildContextMenuWhenChangeSimpleTab(
      this.contextMenuData,
      data,
      this.getAccessRightAll(),
      this.currentModule
    );
  }

  private rebuildContextMenuForToggleEditForm() {
    if (
      this.data.idRepWidgetType == WidgetType.FileExplorerWithLabel &&
      this.xnFileExplorerComponentCtrl
    ) {
      this.makeEditingContextMenuForFileExplorerComponent(
        this.xnFileExplorerComponentCtrl.isEditing
      );
    }
  }

  private timesLoopSetRightMenu = 0;

  private waitingWidgetDataLoadedToSetMenu() {
    setTimeout(() => {
      if (this.timesLoopSetRightMenu > 50) {
        return;
      }
      if (!this.data.idRepWidgetType) {
        this.waitingWidgetDataLoadedToSetMenu();
        this.timesLoopSetRightMenu++;
        return;
      }
      this.buildContextMenu(
        this.contextMenuData,
        this.data.idRepWidgetType,
        this.currentModule,
        this.toolbarSetting,
        this.selectedTabHeader,
        this.activeSubModule
      );
    }, 300);
  }

  private translateWidget(event) {
    if (
      this.widgetFormComponent &&
      this.widgetFormComponent.editLanguageMode !== undefined
    ) {
      this.widgetFormComponent.editLanguageMode = true;
      this.contextMenuData = this.widgetUtils.contextMenuInTranslateMode(
        this.contextMenuData,
        this.data.idRepWidgetType,
        this.getAccessRightAll(),
        this.data.idRepWidgetApp
      );
    }
  }

  private processData(): void {
    if (isEmpty(this.data)) {
      return;
    }
    if (
      !isNil(this.data.idRepWidgetType) &&
      this.data.idRepWidgetType !== WidgetType.Combination
    )
      this.selectedSubFilter = null;

    this.updateDataForWidgetMenuStatus();

    if (this.columnLayoutsetting)
      this.columnLayout = this.columnLayoutsetting.columnLayout;

    if (
      this.data.widgetDataType &&
      this.data.widgetDataType.listenKey &&
      this.data.widgetDataType.listenKey.main
    ) {
      const key = this.data.widgetDataType.listenKey.main.key;
      this.listenKeyValue = this.data.widgetDataType.listenKeyRequest(
        this.currentModule.moduleNameTrim
      )[key];
    }

    if (this.widgetUtils.isTableWidgetDataType(this.data)) {
      if (
        !this.isWidgetDataEdited &&
        !this.checkCurrentWidgetHasChildrenInEditMode()
      ) {
        this.formatTableSetting();
        // Build datatable
        this.changeDisplayTable(true);
        this.manageEditableTableStatusButtonsAfterSaving();
      }
    }

    if (this.data.widgetDataType)
      this.otherSetting = this.data.widgetDataType.otherSetting;

    this.formatShowFilterSetting();

    if (
      WidgetConstant.WidgetTypeIdAllowWidgetInfoTranslation.indexOf(
        this.data.idRepWidgetType
      ) > -1
    ) {
      this.allowWidgetInfoTranslation = true;
    }
    if (this.widgetMenuStatusComponent && this.showInDialog) {
      this.widgetMenuStatusComponent.isShowProperties = false;
      this.widgetMenuStatusComponent.isShowWidgetSetting = false;
    }

    if (
      this.isCustomerStatusWidgetEdit &&
      (this.data.idRepWidgetApp == RepWidgetAppIdEnum.CustomerStatus ||
        this.data.idRepWidgetApp == RepWidgetAppIdEnum.CustomerBusinessStatus)
    ) {
      this.onTableEditStart(null);
    }

    this.changeProperties();
    this.initConfig();
    this.updateChartData();
  }

  private updateDataForWidgetMenuStatus() {
    let isForAllCountryCheckbox = false;
    const isForAllCountryButton = false;
    switch (this.data.idRepWidgetApp) {
      case this.logicItemsId.CountryBlackList:
      case this.logicItemsId.GroupPriority:
      case this.logicItemsId.AgeFilter:
      case this.logicItemsId.ExtendedFilter:
      case this.logicItemsId.AgeFilter_Extend:
      case this.logicItemsId.ExtendedFilter_Extend: {
        isForAllCountryCheckbox = true;
        break;
      }

      //case this.logicItemsId.AgeFilter:
      //case this.logicItemsId.ExtendedFilter:
      //case this.logicItemsId.AgeFilter_Extend:
      //case this.logicItemsId.ExtendedFilter_Extend: {
      //    isForAllCountryButton = true;
      //    break;
      //}
    }

    this.initwidgetMenuStatusData = {
      widgetDetail: this.data,
      selectedFilter: this.selectedFilter,
      selectedSubFilter: this.selectedSubFilter,
      fieldFilters: this.fieldFilters,
      columnLayoutsetting: this.columnLayoutsetting,
      rowSetting: this.rowSetting,
      selectedWidgetFormType: this.widgetFormType,
      widgetProperties: this.properties,
      gridLayoutSettings: this.columnsLayoutSettings,
      isForAllCountryCheckbox: isForAllCountryCheckbox,
      isForAllCountryButton: isForAllCountryButton,
    };
  }

  private updateBackgroundWhenColorChangeValue() {
    // Get data from Old Property
    const oldWidgetStyleBackgroundColor: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.propertiesOld,
        'WidgetStyleBackgroundColor'
      );
    const oldWidgetBackgroundStyleGradientColor: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.propertiesOld,
        'WidgetBackgroundStyleGradientColor'
      );
    const oldPropBackgroundStyleImage: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.propertiesOld,
        'WidgetBackgroundStyleImage'
      );
    const oldPropResetBackground: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.propertiesOld,
        'ResetBackground'
      );

    // Get data from New Property
    const propertyResetBackground: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.properties,
        'ResetBackground'
      );
    const newWidgetStyleBackgroundColor: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.properties,
        'WidgetStyleBackgroundColor'
      );
    const newWidgetBackgroundStyleGradientColor: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.properties,
        'WidgetBackgroundStyleGradientColor'
      );
    const newPropBackgroundStyleImage: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.properties,
        'WidgetBackgroundStyleImage'
      );
    const newOpacityImage: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.properties,
        'OpacityImage'
      );

    // Reset background
    if (
      oldPropResetBackground.value !== propertyResetBackground.value &&
      propertyResetBackground.value
    ) {
      newWidgetStyleBackgroundColor.value = '#ffffff';
      this.setBackgroundForWidget(
        newWidgetStyleBackgroundColor.value,
        null,
        null,
        null
      );
      // this.store.dispatch(this.propertyPanelActions.togglePanel(this.currentModule, true, this.data, this.properties, false));
      this.updateNewPropertiesForOldProperties();
    }

    // 1./ If color/image have not changed then return
    if (
      (oldWidgetStyleBackgroundColor.value || '') ===
        (newWidgetStyleBackgroundColor.value || '') &&
      (oldWidgetBackgroundStyleGradientColor.value || '') ===
        (newWidgetBackgroundStyleGradientColor.value || '') &&
      oldPropBackgroundStyleImage.value === newPropBackgroundStyleImage.value
    ) {
      this.setBackgroundForWidget(
        newWidgetStyleBackgroundColor.value,
        newWidgetBackgroundStyleGradientColor.value,
        newPropBackgroundStyleImage.value,
        newOpacityImage.value
      );
      return;
    }

    // The first time set background and do not save then return
    if (
      !newWidgetStyleBackgroundColor.value &&
      !newWidgetBackgroundStyleGradientColor.value &&
      !newPropBackgroundStyleImage.value
    ) {
      this.setBackgroundForWidget(null, null, null, null);
      return;
    }

    // 3./ If image changed and have image
    if (
      oldPropBackgroundStyleImage.value !== newPropBackgroundStyleImage.value &&
      newPropBackgroundStyleImage.value
    ) {
      const updateOpacity = newOpacityImage.value;
      if (!newOpacityImage.value) {
        newOpacityImage.value = 0.5;
      } else {
        newOpacityImage.value = updateOpacity;
      }
      this.setBackgroundForWidget(
        null,
        null,
        newPropBackgroundStyleImage.value,
        newOpacityImage.value
      );
      newWidgetStyleBackgroundColor.value = null;
      newWidgetBackgroundStyleGradientColor.value = null;
      propertyResetBackground.value = false;
      this.updateNewPropertiesForOldProperties();
      return;
    }

    // 2.2/ If gradient color changed and have gradient color
    if (
      (oldWidgetBackgroundStyleGradientColor.value || '') !==
        (newWidgetBackgroundStyleGradientColor.value || '') &&
      newWidgetBackgroundStyleGradientColor.value
    ) {
      this.setBackgroundForWidget(
        null,
        newWidgetBackgroundStyleGradientColor.value,
        null,
        null
      );
      newPropBackgroundStyleImage.value = null;
      newWidgetStyleBackgroundColor.value = null;
      newOpacityImage.value = null;
      propertyResetBackground.value = false;
      this.updateNewPropertiesForOldProperties();
      return;
    }

    // 2.1/ If straight color changed and have color
    if (
      (oldWidgetStyleBackgroundColor.value || '') !==
      (newWidgetStyleBackgroundColor.value || '')
    ) {
      this.setBackgroundForWidget(
        newWidgetStyleBackgroundColor.value,
        null,
        null,
        null
      );
      newPropBackgroundStyleImage.value = null;
      newWidgetBackgroundStyleGradientColor.value = null;
      newOpacityImage.value = null;
      propertyResetBackground.value = false;
      this.updateNewPropertiesForOldProperties();
      return;
    }
    // // 4./ If dont have color and image value
    // newPropBackgroundStyleImage.value = null;
    // newPathImage.value = null;
    // newOpacityImage.value = null;
    // newWidgetStyleBackgroundColor.value = null;
    // newWidgetBackgroundStyleGradientColor.value = null;
    // this.backgroundColor = '';
    // this.backGroundImageStyle = '';
    // this.updateNewPropertiesForOldProperties();
  }

  private updateNewPropertiesForOldProperties() {
    // Update new data for old data
    setTimeout(() => {
      this.propertiesOld = cloneDeep(this.properties);
    }, 500);
  }

  private setBackgroundForWidget(
    color: any,
    gradientColor: any,
    image: any,
    opacity: any
  ) {
    if (color) {
      this.backgroundColor = color;
      this.backGroundImageStyle = '';
      return;
    }

    if (gradientColor) {
      this.backgroundColor = gradientColor;
      this.backGroundImageStyle = '';
      return;
    }

    this.backgroundColor = '';
    if (!image) {
      this.backGroundImageStyle = '';
      return;
    }
    this.backGroundImageStyle = {
      image: `linear-gradient(rgba(255,255,255, ${
        opacity || 0.5
      }), rgba(255,255,255, ${opacity || 0.5})), url(${image})`,
      size: 'cover',
      position: 'center center',
    };
  }

  private changeProperties() {
    this.updateConnectedWidgetStatusProperty(this.data);
    this.updateWidgetTitle();
    const newTitleObj = this.propertyPanelService.getItemRecursive(
      this.properties,
      'TitleText'
    );
    if (newTitleObj) {
      this.data.title = newTitleObj.value;
    }
    this.updateWidgetWidgetBehavior();
    this.updateDataForWidgetMenuStatus();
    // 0001151: The widget is not effect immediately when user change something in properties panel
    this.updateWidgetStyle();
    this.updateBackgroundWhenColorChangeValue();
    // this.changeBackGroundStyle(this.properties);
    //this.updateWidgetToolbarStyle();
    const isNotWidgetTable =
      this.data.idRepWidgetType &&
      (this.data.idRepWidgetType === WidgetType.FieldSet ||
        this.data.idRepWidgetType === WidgetType.FieldSetReadonly ||
        this.data.idRepWidgetType === WidgetType.Combination ||
        this.data.idRepWidgetType === WidgetType.CombinationCreditCard);
    const isChart = this.data.idRepWidgetType === WidgetType.Chart;
    const isPDfViewer = this.data.idRepWidgetType === WidgetType.PdfViewer;
    const isSavSendLetter =
      this.data.idRepWidgetType === WidgetType.SAVSendLetter;
    if (isChart) {
      this.updateChartType();
      this.updateChartColorScheme();
      this.updateOptionsPieChart();
      this.updateOptionsBarChart();
      this.updateOptionsAreaLineChart();
      this.updateDataForWidgetMenuStatus();
      this.updateSeries();
    }

    if (isPDfViewer) {
      this.updatePdfColumn();
    }

    if (isSavSendLetter) {
      this.updateSAVSendLetter();
    }

    if (isNotWidgetTable) {
      this.updateForEachFieldStyle();
      this.updateDesignColumns();
      this.updateWidgetFormPanelStyle();
      this.updateWidgetFormImportantLabelStyle();
      this.updateWidgetFormImportantDataStyle();
    }
    const isReadonlyWidgetTable =
      this.data.idRepWidgetType === WidgetType.DataGrid;
    if (isNotWidgetTable || isReadonlyWidgetTable) {
      this.updateImportantDisplayFields();
    }

    if (
      this.data.idRepWidgetType &&
      WidgetConstant.WidgetTypeIdUpdateProperty.indexOf(
        this.data.idRepWidgetType
      ) > -1
    ) {
      this.updateWidgetGridHeaderStyle();
      this.updateWidgetGridRowStyle();
      this.updateRowBackground();
      this.updateWidgetGridBorderRowStyle();
      setTimeout(() => {
        this.updateRowDisplayMode();
      }, 200);
    }

    if (
      (this.data.idRepWidgetType &&
        this.data.idRepWidgetType === WidgetType.Doublette) ||
      WidgetType.SynchronizeElasticsSearch
    ) {
      this.updateWidgetGridRowStyle();
      this.updateRowBackground();
      this.updateWidgetGridBorderRowStyle();
    }

    if (
      this.data.idRepWidgetType &&
      this.data.idRepWidgetType === WidgetType.DataGrid
    ) {
      this.updateForEachFieldStyle();
      // this.updateWidgetFormLabelStyle();
      // this.updateWidgetFormDataStyle();
      this.updateDesignColumns();
      this.updateWidgetFormImportantLabelStyle();
      this.updateWidgetFormImportantDataStyle();
      this.updateImportantDisplayFields();
      this.updateWidgetGridHeaderStyle();
      this.updateWidgetGridRowStyle();
      this.updateRowBackground();
      this.updateWidgetGridBorderRowStyle();
      this.readonlyGridAutoSwitchToDetailProp =
        this.checkForReadonlyGridAutoSwitchToDetail();
      this._buildFormDataForReadonlyGridCounter = 0;

      setTimeout(() => {
        this.readonlyGridMultipleRowDisplayProp =
          this.checkForReadonlyGridMultipleRowDisplay();
        this.updateRowDisplayMode();
        this.buildFormDataForReadonlyGrid();
      }, 200);
    }

    // setTimeout(() => {
    //     this.updateBackgroundWidget();
    // }, 200);
    if (this.widgetFormComponent) {
      this.widgetFormComponent.updateProperties();
    }
    this.updateContextMenuWhenChangeProperties();
    this.updateListenKeyForSendLetterWidget();
  }

  private updateContextMenuWhenChangeProperties() {
    this.addContextMenuForDesignLayout();
    this.addMenuSettingForm();
  }

  /**
   * updateWidgetWidgetBehavior
   */
  private updateWidgetWidgetBehavior() {
    this.updateWidgetFormTypeProperty();
    this.updateFitWidthColumnProperty();
    this.updateShowTotalRowProperty();
    this.updateShowTotalRowDetail();
    this.updateAgGridProperty('rowGrouping');
    this.updateAgGridProperty('pivoting');
    this.updateAgGridProperty('columnFilter');
    this.updateDisplayFieldsProperty(null);
    this.updateDisplayModeProperty();
    this.updateDOBFormat();
  }

  /**
   * updateDisplayModeProperty
   * @param filterModeEnum
   * @param isSubDisplayMode
   */
  private updateDisplayModeProperty(
    filterModeEnum?: FilterModeEnum,
    isSubDisplayMode?: boolean
  ) {
    if (!this.data && !this.properties) return;

    const isFireEventUpdateData = false;
    const isNotWidgetTable =
      this.data &&
      (this.data.idRepWidgetType === WidgetType.FieldSet ||
        this.data.idRepWidgetType === WidgetType.FieldSetReadonly ||
        this.data.idRepWidgetType === WidgetType.OrderDataEntry);
    const isWidgetCombination =
      this.data && this.data.idRepWidgetType === WidgetType.Combination;
    const propDisplayField: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'DisplayField'
      );
    const propDisplayColumn: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'DisplayColumn'
      );

    if (propDisplayField || propDisplayColumn) {
      let isChangeDisplayMode = false;
      // ShowData of DisplayColumn
      if (
        propDisplayColumn &&
        propDisplayColumn.children &&
        propDisplayColumn.children.length
      ) {
        const propDisplayColumn_ShowData: WidgetPropertyModel =
          this.propertyPanelService.getItemRecursive(
            propDisplayColumn.children,
            'ShowData'
          );
        //// clear value of propDisplayColumn_ShowData in case no options
        //// (mean this gets default setting from DB)
        //if (!propDisplayColumn_ShowData.options || !propDisplayColumn_ShowData.options.length)
        //    propDisplayColumn_ShowData.value = null;

        if (
          propDisplayColumn_ShowData &&
          !isNil(filterModeEnum) &&
          propDisplayColumn_ShowData.value !== filterModeEnum
        ) {
          if (filterModeEnum !== FilterModeEnum.ShowAllWithoutFilter) {
            if (isSubDisplayMode || !propDisplayField) {
              propDisplayColumn_ShowData.value = filterModeEnum;
              propDisplayColumn.disabled = false;
            }
          } else propDisplayColumn.disabled = true;
        }

        if (
          !isSubDisplayMode &&
          propDisplayColumn_ShowData &&
          this.selectedFilter !== filterModeEnum &&
          !isNil(propDisplayColumn_ShowData.value) &&
          this.selectedFilter !== propDisplayColumn_ShowData.value
        ) {
          this.selectedFilter = propDisplayColumn_ShowData.value;
          isChangeDisplayMode = true;
        }

        if (
          (isSubDisplayMode && this.selectedSubFilter !== filterModeEnum) ||
          (propDisplayColumn_ShowData &&
            propDisplayField &&
            !isNil(propDisplayColumn_ShowData.value) &&
            this.selectedSubFilter !== propDisplayColumn_ShowData.value)
        ) {
          this.selectedSubFilter = propDisplayColumn_ShowData.value;
          isChangeDisplayMode = true;
        }
      }

      // ShowData of DisplayField
      if (
        propDisplayField &&
        propDisplayField.children &&
        propDisplayField.children.length
      ) {
        const propDisplayField_ShowData: WidgetPropertyModel =
          this.propertyPanelService.getItemRecursive(
            propDisplayField.children,
            'ShowData'
          );
        //// clear value of propDisplayColumn_ShowData in case no options
        //// (mean this gets default setting from DB)
        //if (!propDisplayField_ShowData.options || !propDisplayField_ShowData.options.length)
        //    propDisplayField_ShowData.value = null;

        if (
          propDisplayField_ShowData &&
          !isNil(filterModeEnum) &&
          propDisplayField_ShowData.value !== filterModeEnum &&
          !isSubDisplayMode
        ) {
          if (filterModeEnum !== FilterModeEnum.ShowAllWithoutFilter) {
            propDisplayField_ShowData.value = filterModeEnum;
            propDisplayField.disabled = false;
          } else propDisplayField.disabled = true;
        }

        if (
          propDisplayField_ShowData &&
          this.selectedFilter !== filterModeEnum &&
          !isNil(propDisplayField_ShowData.value) &&
          this.selectedFilter !== propDisplayField_ShowData.value
        ) {
          this.selectedFilter = propDisplayField_ShowData.value;
          isChangeDisplayMode = true;
        }
      }

      if (isChangeDisplayMode) {
        // init if fieldFilters is empty
        if (!this.fieldFilters || !this.fieldFilters.length) {
          this.fieldFilters = [];
          // from DisplayField
          if (
            propDisplayField &&
            propDisplayField.options &&
            propDisplayField.options.length
          ) {
            const displayFields: Array<any> = cloneDeep(
              propDisplayField.options
            );
            displayFields.forEach((item) => {
              this.fieldFilters.push(
                new FieldFilter({
                  fieldDisplayName: item.value,
                  fieldName: item.key,
                  selected: item.selected,
                  isHidden: item.isHidden,
                  isEditable: item.isEditable,
                })
              );
            });
          }

          // from DisplayColumn
          if (
            propDisplayColumn &&
            propDisplayColumn.options &&
            propDisplayColumn.options.length
          ) {
            const displayFields: Array<any> = cloneDeep(
              propDisplayColumn.options
            );
            displayFields.forEach((item) => {
              this.fieldFilters.push(
                new FieldFilter({
                  fieldDisplayName: item.value,
                  fieldName: item.key,
                  selected: item.selected,
                  isHidden: item.isHidden,
                  isEditable: item.isEditable,
                })
              );
            });
          }
        }
        if (this.fieldFilters && this.fieldFilters.length)
          this.changeDisplayTable();
      }
    }
  }

  private updateDisplayFieldsProperty(fieldFilters?: FieldFilter[]) {
    const isUpdateProperties = fieldFilters && fieldFilters.length;
    const _fieldFilters: FieldFilter[] = [];
    const propDisplayFields: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'DisplayField'
      );
    const propDisplayColumns: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        'DisplayColumn'
      );
    if (
      propDisplayFields &&
      propDisplayFields.options &&
      propDisplayFields.options.length
    ) {
      propDisplayFields.options.forEach((item) => {
        if (isUpdateProperties) {
          const fItem = fieldFilters.find(
            (_item) => _item.fieldName === item.key
          );
          if (fItem) item.selected = fItem.selected;
        }
        _fieldFilters.push(
          new FieldFilter({
            fieldDisplayName: item.value,
            fieldName: item.key,
            selected: item.selected,
            isHidden: item.isHidden,
            isEditable: item.isEditable,
          })
        );
      });
    }

    if (
      propDisplayColumns &&
      propDisplayColumns.options &&
      propDisplayColumns.options.length
    ) {
      propDisplayColumns.options.forEach((item) => {
        if (isUpdateProperties) {
          const fItem = fieldFilters.find(
            (_item) => _item.fieldName === item.key
          );
          if (fItem) item.selected = fItem.selected;
        }
        const itemFilters = _fieldFilters.some(
          (value) => value.fieldName === item.key
        );
        if (!itemFilters) {
          _fieldFilters.push(
            new FieldFilter({
              fieldDisplayName: item.value,
              fieldName: item.key,
              selected: item.selected,
              isHidden: item.isHidden,
              isEditable: item.isEditable,
              isTableField: item.isTableField,
            })
          );
        }
      });
    }

    if (_fieldFilters !== this.fieldFilters) {
      this.fieldFilters = cloneDeep(_fieldFilters);
    }
  }

  /**
   * updateWidgetFormTypeProperty
   * @param widgetFormType
   */
  private updateWidgetFormTypeProperty(widgetFormType?: WidgetFormTypeEnum) {
    if (!this.data && !this.properties) return;

    if (this.showInDialog) {
      this.widgetFormType = WidgetFormTypeEnum.List;
      return;
    }

    const propWidgetType = this.propertyPanelService.getItemRecursive(
      this.properties,
      'WidgetType'
    );
    if (
      propWidgetType &&
      !isNil(widgetFormType) &&
      propWidgetType.value !== widgetFormType
    )
      propWidgetType.value = widgetFormType;

    if (
      propWidgetType &&
      !isNil(propWidgetType.value) &&
      this.widgetFormType !== propWidgetType.value
    ) {
      this.widgetFormType = propWidgetType.value;
    }
  }

  /**
   * updateFitWidthColumnProperty
   * @param columnLayoutSetting
   */
  private updateFitWidthColumnProperty(
    columnLayoutSetting?: ColumnLayoutSetting
  ) {
    if (!this.data && !this.properties) return;

    const propFitWidthColumn = this.propertyPanelService.getItemRecursive(
      this.properties,
      'IsFitWidthColumn'
    );
    if (
      propFitWidthColumn &&
      columnLayoutSetting &&
      propFitWidthColumn.value !== columnLayoutSetting.isFitWidthColumn
    ) {
      propFitWidthColumn.value = columnLayoutSetting.isFitWidthColumn;
    }

    const hasDifference =
      this.columnLayoutsetting &&
      propFitWidthColumn &&
      !isNil(propFitWidthColumn.value) &&
      this.columnLayoutsetting.isFitWidthColumn !== propFitWidthColumn.value;
    const isEmpty =
      !this.columnLayoutsetting &&
      propFitWidthColumn &&
      !isNil(propFitWidthColumn.value);
    if (isEmpty || hasDifference) {
      this.changeColumnLayoutsetting(
        new ColumnLayoutSetting({
          isFitWidthColumn: propFitWidthColumn.value,
          columnLayout: null,
        })
      );
    }
  }

  private updateShowTotalRowProperty(rowSetting?: RowSetting) {
    if (!this.data && !this.properties) return;

    const propShowTotalRow = this.propertyPanelService.getItemRecursive(
      this.properties,
      'ShowTotalRow'
    );
    if (
      propShowTotalRow &&
      rowSetting &&
      propShowTotalRow.value !== rowSetting.showTotalRow
    )
      propShowTotalRow.value = rowSetting.showTotalRow;

    const hasDifference =
      this.rowSetting &&
      propShowTotalRow &&
      !isNil(propShowTotalRow.value) &&
      this.rowSetting.showTotalRow !== propShowTotalRow.value;
    const isEmpty =
      !this.rowSetting && propShowTotalRow && !isNil(propShowTotalRow.value);
    if (isEmpty || hasDifference) {
      this.changeRowSetting(
        new RowSetting({
          showTotalRow: propShowTotalRow.value,
          positionTotalRow: '',
          backgroundTotalRow: '',
          colorTextTotalRow: '',
        })
      );
    }
  }

  private updateShowTotalRowDetail() {
    const propShowTotalRow = this.propertyPanelService.getItemRecursive(
      this.properties,
      'ShowTotalRow'
    );
    const propPosition = this.propertyPanelService.getItemRecursive(
      this.properties,
      'Position'
    );
    const propBackground = this.propertyPanelService.getItemRecursive(
      this.properties,
      'BackgroundTotalRow'
    );
    const propTextColor = this.propertyPanelService.getItemRecursive(
      this.properties,
      'TextColorTotalRow'
    );

    if (propPosition && propPosition.value) {
      this.positionTotalRow = propPosition.value;
    }
    if (propBackground && propBackground.value) {
      this.backgroundTotalRow = propBackground.value;
    }
    if (propTextColor && propTextColor.value) {
      this.colorTextTotalRow = propTextColor.value;
    }
    if (propShowTotalRow && propShowTotalRow.value) {
      this.showTotalRow = {
        showTotalRow: propShowTotalRow.value,
        positionTotalRow: this.positionTotalRow,
        backgroundTotalRow: this.backgroundTotalRow,
        colorTextTotalRow: this.colorTextTotalRow,
      };
    }
  }

  private updateAgGridProperty(propName) {
    if (!this.data && !this.properties) return;

    const prop = this.propertyPanelService.getItemRecursive(
      this.properties,
      this.upperFirstChar(propName)
    );
    if (prop) this[propName] = prop.value;
  }

  private upperFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public onResizeStop() {
    this.checkToShowScrollbars();
    this.resizeWijmoGrid();
    if (!this.widgetFormComponent) return;
    this.widgetFormComponent.resizeEventHandler();
  }

  public removeWidget(): void {
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        messageType: MessageModal.MessageType.error,
        headerText: 'Remove Widget',
        message: [
          { key: '<p>' },
          { key: 'Modal_Message__Do_You_Want_To_Remove_This_Widget' },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.danger,
        callBack1: () => {
          this.onRemoveWidget.emit(
            Object.assign({}, this.data, { id: this.payload.id })
          );

          this.store.dispatch(
            this.propertyPanelActions.clearProperties(this.currentModule)
          );
          this.store.dispatch(
            this.layoutInfoActions.setRightPropertyPanelWidth(
              '0',
              this.currentModule
            )
          );
        },
      })
    );
  }

  private saveFormWidget(updateRequest?: string, data?: any) {
    if (this.isWidgetDataEdited) {
      if (
        this.data.idRepWidgetType === this.WidgetTypeView.NoteForm ||
        this.widgetFormComponent.form.valid
      ) {
        const formValues =
          this.data.idRepWidgetType === this.WidgetTypeView.NoteForm
            ? data
            : this.widgetFormComponent.filterValidFormField();
        //Remove to fix bug 2976
        //formValues = Uti.convertDataEmptyToNull(formValues);
        let updateKeyValue;
        if (this.data.idRepWidgetType === this.WidgetTypeView.NoteForm) {
          const updateKeyValueTemp = this.data.widgetDataType.listenKeyRequest(
            this.currentModule.moduleNameTrim
          );
          updateKeyValue = updateKeyValueTemp
            ? JSON.stringify(updateKeyValueTemp)
            : null;
          if (this.currentModule.idSettingsGUI === 7 && !!updateKeyValue) {
            updateKeyValue = `{'IdPerson' : ${this.listenKeyValue}}`;
          }
        } else {
          updateKeyValue = Uti.getUpdateKeyValue(
            formValues,
            this.data.widgetDataType.listenKeyRequest(
              this.currentModule.moduleNameTrim
            )
          );
        }

        let updatedModule = this.currentModule;

        if (this.currentModule) {
          if (
            this.currentModule.idSettingsGUI == MenuModuleId.administration ||
            this.currentModule.idSettingsGUI == MenuModuleId.customer
          ) {
            if (
              this.currentModule.idSettingsGUI == MenuModuleId.administration
            ) {
              updatedModule = this.activeSubModule;
            }

            if (
              this.data.idRepWidgetApp ==
                RepWidgetAppIdEnum.CustomerContactDetail ||
              this.data.idRepWidgetApp ==
                RepWidgetAppIdEnum.AdministrationContactDetail
            ) {
              updatedModule = null;
            }
          }
        }

        this.widgetTemplateSettingServiceSubscription =
          this.widgetTemplateSettingService
            .updateWidgetInfo(
              formValues,
              updateRequest ? updateRequest : this.data.updateRequest,
              updatedModule,
              updateKeyValue,
              null,
              this.data.widgetDataType.jsonTextUpdate
            )
            .subscribe(() => {
              this.appErrorHandler.executeAction(() => {
                const checkIdArticle =
                  this.selectedEntity &&
                  this.selectedEntity.id === formValues.B00Article_IdArticle;
                if (checkIdArticle) {
                  this.store.dispatch(
                    this.tabSummaryActions.requestLoadTabs(this.currentModule)
                  );
                }
                this.store.dispatch(
                  this.parkedItemActions.requestReloadList(this.currentModule)
                );
                this.isWidgetDataEdited = false;
                if (this.widgetFormComponent) {
                  this.widgetFormComponent.syncFormDataToDataSource();
                  this.widgetFormComponent.updatePreValue();
                }
                if (this.currentModule.idSettingsGUI === 7) {
                  this.widgetNoteFormComponent.refresh();
                }
                this.manageEditableTableStatusButtonsAfterSaving();
                this.copiedData = null;
                this.onCancelEditingWidget.emit(this.data);
                this.onSaveSuccessWidget.emit(this.data);
                // set credit card to read mode
                if (this.creditCardComponent) {
                  // this.isOnEditCreditCard = false;
                  this.creditCardComponent.editMode = false;
                }

                if (!this.widgetFormComponent) return;
                if (!this.showInDialog) {
                  this.widgetFormComponent.editFormMode = false;
                  this.widgetFormComponent.resetToViewMode();
                } else {
                  this.widgetFormComponent.updateOriginalFormValues();
                  setTimeout(() => {
                    this.widgetFormComponent.editFormMode = true;
                  });
                }
                this.widgetFormComponent.invokeSaveWidgetSuccess();
                this.disableButtonEditWidget = false;
              });
            });
        this.afterWidgetGetData(formValues);
      } else {
        this.toasterService.pop(
          'warning',
          'Validation Failed',
          'There are some fields do not pass validation!'
        );
        this.widgetFormComponent.focusOnFirstFieldError();
      }
    } else {
      if (this.showInDialog) return;
      this.resetForm();
    }
  }

  private afterWidgetGetData(formValues: any) {
    if (this.data.idRepWidgetApp != RepWidgetAppIdEnum.MainArticleDetail)
      return;
    // call to set disable for Tab header for Article set when save an Article
    this.store.dispatch(
      this.processDataActions.setDisableTabHeader(
        Uti.makeWidgetDataToFormData(this.data.contentDetail.data[1], {
          isSetArticle: formValues.B00Article_IsSetArticle,
        }),
        this.currentModule
      )
    );
  }

  private saveFormCreditCardCombinationWidget() {
    setTimeout(() => {
      let updateData = this.updateDataForCreditCard();
      if (!updateData) {
        updateData = [];
      }
      const updateRequest = this.widgetUtils.updateCustomData(
        this.data.updateRequest,
        updateData,
        this.creditCardComponent.isFormChanged
      );
      this.saveFormWidget(updateRequest);
    });
  }

  private updateDataForCreditCard() {
    if (!this.widgetUtils.checkHasSubCollectionData(this.data)) {
      return;
    }
    if (!this.creditCardSelected || !this.creditCardSelected.length) {
      return [];
    }
    return this.updateEditingDataForCreditCard();
  }

  private updateEditingDataForCreditCard(): any {
    const result: any = [];
    let editItem: any;
    let updateItem: any;
    this.creditCardSelected.forEach((item) => {
      editItem = this.getCreditCardItemByIcon(item.iconFileName);
      if (!!item.select !== !!Uti.strValObj(editItem.IsActive)) {
        // update credit card Item
        if (!!item.id) {
          updateItem = {
            IdCashProviderContractCreditcardTypeContainer: item.id,
            IsActive: item.select ? '1' : '0',
          };
          if (!item.select) {
            updateItem.IsDeleted = '1';
          }
          result.push(updateItem);
        } else if (!!item.select) {
          // insert credit card Item
          result.push({
            IdCashProviderContract: Uti.strValObj(
              editItem.IdCashProviderContract
            ),
            IdRepCreditCardType: Uti.strValObj(editItem.IdRepCreditCardType),
            IsActive: 1,
          });
        }
      }
    });
    return result;
  }

  private getCreditCardItemByIcon(icon: string) {
    return this.data.contentDetail.data[3].find(
      (x) => Uti.strValObj(x.IconFileName) === icon
    );
  }

  private resetForm() {
    if (!this.widgetFormComponent) return;
    this.widgetFormComponent.resetValue(!this.showInDialog);
    this.widgetFormComponent.editFormMode = false;
    this.widgetFormComponent.editLanguageMode = false;
    this.widgetFormComponent.errorShow = false;
    this.widgetFormComponent.resetToViewMode();
  }

  private editFormWidget(event): void {
    if (this.widgetFormComponent) {
      this.widgetFormComponent.editFormMode = true;
    }
    if (this.articleMediaManagerComponent) {
      this.articleMediaManagerComponent.uploadMode = true;
      return;
    }
    if (this.widgetTranslationComponent) {
      this.widgetTranslationComponent.editMode = true;
      this.controlMenuStatusToolButtons(true);
    }
    if (this.isWidgetDataEdited) {
      this.onEditingWidget.emit(this.data);
    }
    switch (this.data.idRepWidgetType) {
      case WidgetType.Combination: {
        this.isOnEditingTable = true;
        break;
      }
      case WidgetType.CombinationCreditCard: {
        this.editCreditCard();
        break;
      }
      case WidgetType.TreeView: {
        this.editTreeView();
        break;
      }
      case WidgetType.FileTemplate: {
        this.editFileManagement();
        break;
      }
      default:
        break;
    }
  }

  public changeDisplayMode(dataFilter: any) {
    if (dataFilter) {
      if (!dataFilter.isSub) this.selectedFilter = dataFilter.selectedFilter;
      else this.selectedSubFilter = dataFilter.selectedFilter;
      this.fieldFilters = dataFilter.fieldFilters;

      this.changeDisplayTable();

      this.checkToShowScrollbars();
      if (!dataFilter.isSub)
        this.updateDisplayModeProperty(this.selectedFilter, false);
      else this.updateDisplayModeProperty(this.selectedSubFilter, true);
    }
  }

  public onRowClick(rowData: any) {
    if (this.onPopup) {
      this.processWhenGridItemClickOnPopup(rowData);
    }
    this.processWhenGridItemClick(rowData);
  }

  public processWhenGridItemClick(rowData: any) {
    this.currentGridRowItem = rowData;
    this.onRowTableClick.emit({
      cellInfos: rowData,
      widgetDetail: this.data,
    });
    this.checkSelectedNodes();
  }

  private processWhenGridItemClickOnPopup(rowData: any) {
    this.store.dispatch(
      this.processDataActions.setGridItemDataToLocalStorage(
        this.currentModule,
        {
          widgetDetail: new LightWidgetDetail(this.data),
          data: rowData,
        }
      )
    );
  }

  public makeContextMenu(data?: any) {
    this.onRowClick(Uti.mapObjectGeneralObjectToKeyValueArray(data, true));

    const context: Array<any> = [];
    if (!data && this.contextMenuData && this.contextMenuData.length > 1) {
      this.contextMenuData[1].disabled = true;
    }
    for (const item of this.contextMenuData) {
      if (item.hidden) continue;
      if (item.id === 'widget-separator-menu-context') {
        context.push('separator');
        continue;
      }
      context.push({
        name: item.title,
        action: (event) => {
          item.callback(event);
        },
        cssClasses: [''],
        icon: `<i class="fa  ` + item.iconName + `  ag-context-icon"/>`,
        key: item.key,
        params: item.params,
        disabled: item.disabled,
      });
    }

    this.makeGotoModuleContextMenu(context, data);
    this.addContextMenuForSelectionExport(context);
    context.push('separator');
    this.enableEditWidgetContextMenuForGrid(context);
    return context;
  }

  private makeGotoModuleContextMenu(context, data) {
    if (!data || !data.goToModule) return;
    const goToModule = Uti.tryParseJson(data.goToModule);
    if (!goToModule || !goToModule.length) return;
    context.push({
      name: '',
      cssClasses: ['xn-ag-separator'],
      index: 700,
    });
    const gotoModuleContext = {
      name: 'Goto module',
      cssClasses: [''],
      icon: `<i class="fa  fa-exchange  ag-context-icon  green-color"/>`,
      index: 701,
      subMenu: [],
    };

    for (const item of goToModule) {
      const result = {
        item: item,
        data: data,
      };
      gotoModuleContext.subMenu.push({
        name: item.Displayname,
        action: (event) => {
          this.store.dispatch(
            this.processDataActions.requestGoToModule(
              result,
              this.currentModule
            )
          );
        },
        cssClasses: [''],
        icon:
          `<i class="fa  ` +
          ModuleConfiguration.Icon[(item || {}).IdSettingsGUI] +
          `  ag-context-icon"/>`,
      });
    }
    context.push(gotoModuleContext);
  }

  public onStartStopClickHandler(data) {
    data.Status = data.StartStop == '1' ? 'Stopped' : 'Running';
    this.agGridComponent.updateRowData([data]);
    // update start/stop for this schedule setting
    this._toolsService
      .saveStatusSystemSchedule(this.buildScheduleSettingSavingData(data))
      .subscribe((response: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) return;
          this.toasterService.pop(
            'success',
            'Success',
            'Schedule is ' + (data.StartStop == '1' ? 'stop' : 'start') + ' now'
          );
        });
      });
  }

  private buildScheduleSettingSavingData(data: any) {
    return {
      ScheduleStatus: [
        {
          IdRepAppSystemScheduleServiceName:
            data.IdRepAppSystemScheduleServiceName,
          IsDeleted: data.StartStop,
        },
      ],
    };
  }

  private counterWaitingScheduleSettingRunImmediatelyDialog = 0;

  public onRunClickHandler(data) {
    this.isShowScheduleSettingRunImmediately = true;
    this.counterWaitingScheduleSettingRunImmediatelyDialog = 0;
    this.showcounterWaitingScheduleSettingRunImmediatelyDialog(data);
  }

  private showcounterWaitingScheduleSettingRunImmediatelyDialog(data) {
    if (this.counterWaitingScheduleSettingRunImmediatelyDialog > 100) return;
    setTimeout(() => {
      this.counterWaitingScheduleSettingRunImmediatelyDialog++;
      if (!this.scheduleSettingRunImmediately) {
        this.showcounterWaitingScheduleSettingRunImmediatelyDialog(data);
        return;
      }
      this.scheduleSettingRunImmediately.callShowDiaglog(data);
    });
  }

  private runImmediatelyRowDatas: Array<any> = [];

  // private isRequestingStatus: boolean = false;
  public runScheduleHandle(currentItem: any) {
    if (currentItem) {
      // Disable Run button
      this.setDataForRunButton(currentItem.rowData, '2');
      this.runImmediatelyRowDatas.push(currentItem);
    }
    // if (this.isRequestingStatus) return;
    // this.isRequestingStatus = true;
    this.refreshScheduleWidgetData();
  }

  public closedScheduleSettingRunImmediatelyHandle() {
    this.isShowScheduleSettingRunImmediately = false;
  }

  private setDataForRunButton(rowData: any, data: any) {
    for (const row of this.dataSourceTable.data) {
      if (row.DT_RowId != rowData['dtRowId']) {
        continue;
      }
      row['Run'] = data;
      this.agGridComponent.updateRowData([row]);
      break;
    }
  }

  private refreshScheduleWidgetData() {
    if (!this.runImmediatelyRowDatas.length) {
      return;
    }
    setTimeout(() => {
      this.refreshScheduleWidgetData();
    }, 2000);
    for (const item of this.runImmediatelyRowDatas) {
      setTimeout(() => {
        this.callRefreshScheduleWidgetData(item);
      }, 500);
    }
  }

  private callRefreshScheduleWidgetData(currentItem: any) {
    if (!currentItem) {
      return;
    }
    this._toolsService
      .getScheduleServiceStatusByQueueId(currentItem.idAppSystemScheduleQueue)
      .subscribe((response: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !Uti.isResquestSuccess(response) ||
            !response.item.data ||
            !response.item.data.length ||
            !response.item.data[0] ||
            !response.item.data[0].length ||
            !response.item.data[0][0]
          ) {
            return;
          }
          if (response.item.data[0][0].StatusID == '1') {
            // Enable Run button
            this.setDataForRunButton(currentItem.rowData, true);
            Uti.removeItemInArray(
              this.runImmediatelyRowDatas,
              currentItem,
              'idScheduleQueue'
            );
            this.onRowClick(this.currentGridRowItem);
            // this.isRequestingStatus = !!this.runImmediatelyRowDatas.length;
          }
          if (response.item.data[0][0].StatusID == '3') {
            // Enable Run button
            this.setDataForRunButton(currentItem.rowData, true);
            // Show no data message
            this.toasterService.pop(
              'error',
              'Notification',
              'No data exported'
            );
          }
        });
      });
  }

  private counterWaitingScheduleSettingDialog = 0;

  public onSettingClickHandler(data) {
    this.isShowScheduleSetting = true;
    this.counterWaitingScheduleSettingDialog = 0;
    this.showScheduleSettingDialog(data);
  }

  private showScheduleSettingDialog(data) {
    if (this.counterWaitingScheduleSettingDialog > 100) return;
    setTimeout(() => {
      this.counterWaitingScheduleSettingDialog++;
      if (!this.scheduleSetting) {
        this.showScheduleSettingDialog(data);
        return;
      }
      this.scheduleSetting.callShowDialog(data);
    });
  }

  public closedScheduleSettingHandle(isReload?: boolean) {
    this.isShowScheduleSetting = false;
    if (isReload) this.reloadWidgets.emit([this.data]);
  }

  public dateFilterOutputHandle($event) {
    this.onRowTableClick.emit({
      cellInfos: Uti.buildKeyValueArrayForObject($event),
      widgetDetail: this.data,
    });
  }

  public changeFieldFilter($event: FilterData) {
    if ($event) {
      this.fieldFilters = Object.assign(
        [],
        this.fieldFilters,
        $event.fieldFilters
      );
      this.columnLayoutsetting = $event.columnLayoutsetting;
      this.rowSetting = $event.rowSetting;
      this.widgetFormType = $event.widgetFormType;
      this.updateDisplayFieldsProperty(this.fieldFilters);
      this.propertiesForSaving.properties = cloneDeep(this.properties);
    }

    this._saveMenuChanges();
    this.updateDataForWidgetMenuStatus();
  }

  private _saveMenuChanges(isClosedPropertyPanel?: boolean) {
    if (this.columnLayoutsetting) {
      if (this.agGridComponent) {
        this.columnLayoutsetting.columnLayout =
          this.agGridComponent.getColumnLayout();
      } else {
        this.columnLayoutsetting.columnLayout = null;
      }

      this.allowFitColumn = this.columnLayoutsetting.isFitWidthColumn;
    }

    if (this.rowSetting) {
      this.showTotalRow = this.rowSetting.showTotalRow;
    }

    // Fix bug: The saving icon for grid config of table widget does not hide after saving
    // this.changeDisplayTable();

    this.checkToShowScrollbars();

    if (this.widgetMenuStatusComponent) {
      this.widgetMenuStatusComponent.resetToUpdateFieldsFilterFromOutside();
    }

    // Reset widget properties dirty
    this.properties = this.propertyPanelService.resetDirty(this.properties);
    this.propertiesForSaving.properties = this.propertyPanelService.resetDirty(
      this.propertiesForSaving.properties
    );
    this.removeTranslatedTitleFromPropertiesForSaving();

    // Save setting here
    this.onChangeFieldFilter.emit({
      fieldFilters: this.fieldFilters,
      widgetDetail: this.data,
      widgetFormType: this.widgetFormType,
      isClosedPropertyPanel: isClosedPropertyPanel,
    });

    // Turn off the changing columns layout dirty
    setTimeout(() => {
      if (!this.agGridComponent) return;
      this.agGridComponent.isColumnsLayoutChanged = false;
    });
  }

  private checkToShowScrollbars() {
    if (!this.showInDialog) {
      if (this.agGridComponent) {
        // this.agGridComponent.checkGridHasScrollbars();
      }

      this.widgetFormLoadedHandler(true);
    }
  }

  public resizeWijmoGrid() {
    if (this.agGridComponent && this.allowFitColumn) {
      // this.agGridComponent.turnOnStarResizeMode();
      this.agGridComponent.refresh();
    }
  }

  public callRefreshWidgetDataHanlder() {
    this.onResetWidget.emit(this.data);
  }

  /**
   * changeDisplayTable
   * @param isOnChangingData
   * Note: Please don't use timeout in this function, contact author for detail.
   */
  private changeDisplayTable(isOnChangingData?: boolean) {
    if (!this.widgetUtils.isTableWidgetDataType(this.data)) {
      return;
    }

    if (!isOnChangingData) this.updateDataSourceFromDataTable();
    else this.copiedData = cloneDeep(this.data);
    this.updateDataSourceCloumnSettings();
    let contentDetail = this.copiedData.contentDetail;
    if (this.data.idRepWidgetType === WidgetType.Combination) {
      contentDetail = contentDetail.data[2][0];
    }

    if (this.agGridComponent != null) {
      this.agGridComponent.deselectRow();
    }

    this.buildDatatable(contentDetail);
    this.copiedData = null;
    this.checkToShowFilterTableOnMenuToolbar();
  }

  public editTitle() {
    if (this.allowDesignEdit) return;
    this.editingTitle = true;
    this.originalTitle = this.title.value;
  }

  public saveTitle() {
    if (!isNil(this.title.value)) {
      this.editingTitle = false;
      this.updateWidgetTitle(this.title);
      const propTitleText: WidgetPropertyModel =
        this.propertyPanelService.getItemRecursive(
          this.propertiesForSaving.properties,
          'TitleText'
        );
      if (propTitleText) {
        propTitleText.value = this.title.value;
        propTitleText.translatedValue = '';
        this.onUpdateTitle.emit(this.data);
        this.originalTitle = this.title.value;
      }
    }
  }

  private removeTranslatedTitleFromPropertiesForSaving() {
    const propTitleText: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.propertiesForSaving.properties,
        'TitleText'
      );
    propTitleText.translatedValue = '';
  }

  private resetTitle() {
    this.editingTitle = false;
    this.title.value = this.originalTitle;
  }

  private onChangeTitle(event) {
    this.title.value = event.target.value;
    this.data.title = this.title.value;
  }

  public onCursorFocusOutOfMenuToolbar(event) {
    if (event) {
      if (this.isMaximized) {
        this.hoverBox = true;
      } else {
        this.hoverBox = false;
      }
    }
  }

  private mouseout(event) {
    if (this.isActiveWidget || this.allowDesignEdit || this.isMaximized) return;

    let parentElm, editDropdown;
    if (event.toElement) {
      parentElm = this.domHandler.findParent(event.toElement, 'filter-menu');
      editDropdown = this.domHandler.findParent(
        event.toElement,
        'edit-dropdown'
      );
    } else if (event.relatedTarget) {
      parentElm = this.domHandler.findParent(
        event.relatedTarget,
        'filter-menu'
      );
      editDropdown = this.domHandler.findParent(
        event.relatedTarget,
        'edit-dropdown'
      );
    }
    if (
      (!parentElm || parentElm.length === 0) &&
      (!editDropdown || !editDropdown.length)
    ) {
      if (this.isMaximized) {
        this.hoverBox = true;
      } else {
        this.hoverBox = false;
      }
      if (
        !this.allowDesignEdit &&
        !this.isOnEditingCountry &&
        !this.isOnEditTreeView &&
        !this.isOnEditingTable &&
        !this.isOnEditFileExplorer &&
        !(
          this.widgetFormComponent &&
          (this.widgetFormComponent.editFormMode ||
            this.widgetFormComponent.editFieldMode)
        )
      ) {
        if (this.widgetMenuStatusComponent) {
          this.widgetMenuStatusComponent.dropdownStatus.isHidden = true;
          this.widgetMenuStatusComponent.dropdownTableStatus.isHidden = true;
          this.widgetMenuStatusComponent.isShowEditDropdown = false;
          this.widgetMenuStatusComponent.hideMenuWidgetStatus();

          if (this.widgetMenuStatusComponent.editFormDropdown)
            this.widgetMenuStatusComponent.editFormDropdown.hide();
        }
      }
    }
    setTimeout(() => {
      $('div.box-default', $(this._eref.nativeElement)).removeClass('click');
    });

    this.scrollUtils.scrollUnHovering('left');
    this.scrollUtils.scrollUnHovering('top');
    this.widgetBorderColor = '';
  }

  private mouseenter(event) {
    // Design mode
    if (
      this.allowDesignEdit
      // || this.isMaximized
    ) {
      return;
    }
    this.hoverBox = true;
    if (event.type === 'click') {
      $('div.box-default', $(this._eref.nativeElement)).addClass('click');
      return;
    } else
      $('div.box-default', $(this._eref.nativeElement)).removeClass('click');
    if (
      !this.allowDesignEdit &&
      !this.isOnEditingCountry &&
      !this.isOnEditTreeView &&
      !this.isOnEditingTable &&
      !this.isOnEditFileExplorer &&
      !(
        this.widgetFormComponent &&
        (this.widgetFormComponent.editFormMode ||
          this.widgetFormComponent.editFieldMode)
      )
    ) {
      if (this.widgetMenuStatusComponent) {
        this.widgetMenuStatusComponent.dropdownStatus.isHidden = false;
        this.widgetMenuStatusComponent.dropdownTableStatus.isHidden = false;
        this.widgetMenuStatusComponent.isShowEditDropdown = true;
      }
    }
    if (this.widgetStyle.borderColor) {
      this.widgetBorderColor = '1px solid ' + this.widgetStyle.borderColor;
      return;
    }
    if (this.widgetStyle.globalBorderColor)
      this.widgetBorderColor =
        '1px solid ' + this.widgetStyle.globalBorderColor;
  }

  private onEditFormField(event) {
    if (!event && this.isWidgetDataEdited) {
      this.isWidgetDataEdited = false;
      this.onCancelEditingWidget.emit(this.data);
    } else if (event) {
      this.controlMenuStatusToolButtons(true);
    }
  }

  public onCancelEditFormField(event) {
    if (event) {
      this.controlMenuStatusToolButtons(false);
    }
  }

  private saveCombinationWidget() {
    setTimeout(() => {
      if (this.agGridComponent) {
        this.isTableEdited = this.agGridComponent.hasUnsavedRows();
        this.agGridComponent.focusOut();
      }

      if (!this.isTableEdited) {
        this.isOnEditingTable = false;
        let strUpdateRequest: string = this.data.updateRequest;
        if (this.data.updateRequest.includes('<<JSONText>>')) {
          const start = this.data.updateRequest.indexOf('<<JSONText>>');
          const end = this.data.updateRequest.lastIndexOf('<<JSONText>>');
          strUpdateRequest = this.data.updateRequest.substring(
            start,
            end + '<<JSONText>>'.length
          );
          strUpdateRequest = this.data.updateRequest.replace(
            strUpdateRequest,
            ''
          );
        }
        this.saveFormWidget(strUpdateRequest);
        return;
      } else {
        let _dataSourceTable = this.dataSourceTable;
        if (this.agGridComponent) {
          const wijmoGridData = this.agGridComponent.getEditedItems();
          _dataSourceTable = Uti.mergeWijmoGridData(
            this.dataSourceTable,
            wijmoGridData
          );
        }
        // TODO: NTH
        const key = Object.keys(
          this.data.widgetDataType.listenKeyRequest(
            this.currentModule.moduleNameTrim
          )
        )[0];
        const value = this.data.widgetDataType.listenKeyRequest(
          this.currentModule.moduleNameTrim
        )[key];

        _dataSourceTable = this.rebuildComboboxData(_dataSourceTable);
        this.updateDataSourceFromDataTable(_dataSourceTable);
        let updateData = Uti.mapDataSourceToDataUpdateByColumnSetting(
          this.copiedData.contentDetail.data[2][0],
          key,
          value
        );
        updateData = JSON.stringify(updateData);
        updateData = updateData.replace(/"/g, '\\\\\\"');
        let strUpdateRequest: string = this.data.updateRequest;
        if (this.data.updateRequest.includes('<<JSONText>>')) {
          strUpdateRequest = this.data.updateRequest.replace(
            new RegExp('<<JSONText>>', 'g'),
            ''
          );
        }
        this.saveFormWidget(
          strUpdateRequest.replace('<<SubInputParameter>>', updateData)
        );
        return;
      }
    });
  }

  private editEditableTableWidget(event): void {
    switch (this.data.idRepWidgetType) {
      case WidgetType.FileExplorer:
      case WidgetType.ToolFileTemplate:
        this.isOnEditFileExplorer = true;
        if (!this.isDeletedFiles && this.widgetMenuStatusComponent)
          this.widgetMenuStatusComponent.manageSaveTableButtonStatus(true);
        break;
      case WidgetType.FileExplorerWithLabel:
      case WidgetType.FileTemplate:
        this.isOnEditFileExplorer = true;
        if (this.widgetMenuStatusComponent)
          this.widgetMenuStatusComponent.manageSaveTableButtonStatus(false);
        this.makeEditingContextMenuForFileExplorerComponent(true, true, true);
        break;
      default:
        if (
          this.data.idRepWidgetApp == RepWidgetAppIdEnum.CustomerStatus ||
          this.data.idRepWidgetApp == RepWidgetAppIdEnum.CustomerBusinessStatus
        ) {
          this.isCustomerStatusWidgetEdit = true;
          this.reloadWidgets.emit([this.data]);
        } else {
          this.isOnEditingTable = true;
          this.contextMenuData = this.widgetUtils.contextMenuInEditMode(
            this.contextMenuData,
            this.getAccessRightAll(),
            this.data,
            this.widgetMenuStatusComponent
          );
          if (this.agGridComponent) {
            this.agGridComponent.toggleDeleteColumn(true);
          }
        }

        break;
    }
    if (this.isTableEdited) {
      this.onEditingWidget.emit(this.data);
    }
  }

  private makeEditingContextMenuForFileExplorerComponent(
    isShow: boolean,
    isShowSaveWidget?: boolean,
    isShowCancelSave?: boolean
  ) {
    if (!isShow) return;
    this.contextMenuData = this.widgetUtils.contextMenuInEditMode(
      this.contextMenuData,
      this.getAccessRightAll(),
      this.data,
      this.widgetMenuStatusComponent,
      {
        isShowSaveWidget: isShowSaveWidget,
        isShowCancelSave: isShowCancelSave,
        isShowUploadTemplate: true,
        isShowDeleteTemplate: true,
      }
    );
  }

  public checkToShowCommandButtons(makeCommandButsHidden?: boolean) {
    // const isTableWidget = (this.data.idRepWidgetType === WidgetType.EditableGrid || this.data.idRepWidgetType === WidgetType.EditableTable);
    const isTableWidget = this.data.idRepWidgetType === WidgetType.EditableGrid;
    let isTableWidgetUnEdited = !this.isTableEdited && isTableWidget;

    const isFormWidget = this.data.idRepWidgetType === WidgetType.FieldSet;
    const isFormWidgetUnEdited = !this.isWidgetDataEdited && isFormWidget;

    const isCombinationWidget =
      this.data.idRepWidgetType === WidgetType.Combination ||
      this.data.idRepWidgetType === WidgetType.CombinationCreditCard;
    let isCombinationWidgetUnEdited =
      !this.isTableEdited && !this.isWidgetDataEdited && isCombinationWidget;

    const isFileExplorerWidget =
      this.data.idRepWidgetType === WidgetType.FileExplorer ||
      this.data.idRepWidgetType === WidgetType.ToolFileTemplate ||
      this.data.idRepWidgetType === WidgetType.FileExplorerWithLabel;
    const isFileExplorerWidgetUnEdited =
      !this.isOnEditFileExplorer && isFileExplorerWidget;

    if (makeCommandButsHidden && this.agGridComponent) {
      const editedItems = this.agGridComponent.getEditedItems();
      const hasEditedItems =
        !isNil(editedItems) &&
        editedItems.itemsEdited &&
        editedItems.itemsEdited.length > 0;
      if (isTableWidget) {
        isTableWidgetUnEdited = hasEditedItems ? false : true;
        if (isTableWidgetUnEdited) {
          this.onCancelEditingWidget.emit(this.data);
        }
      }

      if (isCombinationWidget) {
        isCombinationWidgetUnEdited = this.isWidgetDataEdited
          ? isCombinationWidgetUnEdited
          : hasEditedItems
          ? false
          : true;
        if (isCombinationWidgetUnEdited) {
          this.onCancelEditingWidget.emit(this.data);
        }
      }
    }

    return (
      isTableWidgetUnEdited ||
      isFormWidgetUnEdited ||
      isCombinationWidgetUnEdited ||
      isFileExplorerWidgetUnEdited
    );
  }

  ///////// ----------------Start CombiCredit Card Widget-----------------////////////////////
  private onEditingCreditCard() {
    this.isWidgetDataEdited = true;
    this.controlMenuStatusToolButtons(true);
    this.onEditingWidget.emit(this.data);
  }

  private resetValueForCreditCard() {
    // this.isOnEditingCreditCard = false;
    if (this.creditCardComponent) {
      // this.isOnEditCreditCard = false;
      this.creditCardComponent.editMode = false;
      this.creditCardComponent.isFormChanged = false;
    }
    this.creditCardComponent.resetCreditCardComponent();
  }

  /**
   * getSelectedData
   * @param data
   */
  public getSelectedData(data: any) {
    this.onEditingCreditCard();
    this.widgetFormComponent.editFieldMode = true;
    this.creditCardSelected = data;
  }

  public onFileExplorerEditingHandler() {
    this.widgetMenuStatusComponent.manageSaveTableButtonStatus(false);
    this.isOnEditFileExplorer = true;
    this.makeEditingContextMenuForFileExplorerComponent(true, true, true);
  }

  public onFileTemplateEditingHandler() {
    this.updateWidgetEditedStatus(true);
    this.editingWidget(this.dataInfo);
    this.onRowMarkedAsDeleted({
      disabledDeleteButton: true,
      showCommandButtons: true,
    });
    if (this.widgetMenuStatusInfo) {
      // enable save button
      this.widgetMenuStatusComponent.manageSaveTableButtonStatus(false);
    }
  }

  /**
   * editCreditCard
   */
  private editCreditCard() {
    if (this.creditCardComponent) {
      this.creditCardComponent.editMode = true;
    }
  }

  ///////// ----------------End CombiCredit Card Widget-----------------////////////////////

  ///////// ----------------Start Country Widget-----------------////////////////////

  public getDataForCountryCheckList(eventData) {
    this.outputDataCountries = eventData;
    this.isWidgetDataEdited = true;
    this.onEditingWidget.emit(this.data);
  }

  private saveCountryWidget() {
    // TODO: NTH
    const updateData = this.prepareDataForSavingCountryWidget();

    this.widgetTemplateSettingServiceSubscription =
      this.widgetTemplateSettingService
        .updateWidgetInfo(
          updateData,
          this.data.updateRequest,
          null,
          null,
          (s: string) => {
            return s.replace(/"/g, '\\\\"');
          }
        )
        .subscribe((rs) => {
          this.appErrorHandler.executeAction(() => {
            this.onCancelEditingWidget.emit(this.data);
            this.onSaveSuccessWidget.emit(this.data);
            this.countryCheckListData = cloneDeep(this.outputDataCountries);
            if (this.showInDialogStatus) {
              this.widgetCountryComponent.setEditMode(true);
              return;
            }
            this.widgetCountryComponent.setEditMode(false);
            this.isWidgetDataEdited = false;
            this.outputDataCountries = [];
          });
        });
  }

  private prepareDataForSavingCountryWidget() {
    if (!this.outputDataCountries || !this.outputDataCountries.length)
      return [];
    const result: any[] = [];
    const key = Object.keys(
      this.data.widgetDataType.listenKeyRequest(
        this.currentModule.moduleNameTrim
      )
    )[0];
    const value = this.data.widgetDataType.listenKeyRequest(
      this.currentModule.moduleNameTrim
    )[key];

    this.outputDataCountries.forEach((item) => {
      const _newItem = {};
      if (isNil(item.idArticleExcludeCountries)) {
        _newItem[key] = value;
        _newItem['IdCountrylanguage'] = item.idValue;
        _newItem['IdRepIsoCountryCode'] = item.idValue;
        _newItem['IdPersonInterfaceContactCountries'] = item.idValueExtra;
        _newItem['IsActive'] = item.isActive == true ? 1 : 0;
        result.push(_newItem);
      } else if (!isNil(item.idArticleExcludeCountries) && !item.isActive) {
        _newItem['IdArticleExcludeCountries'] = item.idArticleExcludeCountries;
        _newItem['IsDeleted'] = '1';
        result.push(_newItem);
      }
    });
    return result;
  }

  private editCountryWidget(event) {
    if (this.widgetCountryComponent)
      this.widgetCountryComponent.setEditMode(true);

    this.contextMenuData = this.widgetUtils.contextMenuInEditMode(
      this.contextMenuData,
      this.getAccessRightAll()
    );
  }

  private resetCountryWidget() {
    if (this.widgetCountryComponent)
      this.widgetCountryComponent.setEditMode(false);
    this.isWidgetDataEdited = false;
  }

  private editNoteForm(event) {
    if (
      (this.widgetNoteFormComponent ||
        this.currentModule.idSettingsGUI === 7) &&
      this.widgetMenuStatusComponent
    ) {
      this.widgetMenuStatusComponent.updateModeStatusNoteForm(true);
    }

    this.isEditAllWidgetMode = true;
    this.contextMenuData = this.widgetUtils.contextMenuInEditMode(
      this.contextMenuData,
      this.getAccessRightAll()
    );
  }

  private resetNoteForm() {
    if (
      (this.widgetNoteFormComponent ||
        this.currentModule.idSettingsGUI === 7) &&
      this.widgetMenuStatusComponent
    ) {
      this.widgetMenuStatusComponent.updateModeStatusNoteForm(false);
    }
    this.isEditAllWidgetMode = false;
  }

  ///////// ----------------End Country Widget-----------------////////////////////

  ///////// ----------------Start Message Modal-----------------////////////////////
  private onModalSaveAndExit() {
    this.saveWidget(this.savingWidgetType);
  }

  private onModalExit() {
    this.isTableEdited = false;
    this.isWidgetDataEdited = false;
    this.resetWidget();
  }

  private onModalCancel() {}

  ///////// ----------------End Message Modal-----------------////////////////////

  //////// -----------------Start Wijmo Grid--------------///////////////////

  public onWijmoGridMediacodeClick(eventData) {
    this.showMediacodeDialog = true;
    setTimeout(() => {
      this.xnMediacodeDialog.open(eventData);
    }, 200);
  }

  public onMediacodeDialogClosed() {
    this.showMediacodeDialog = false;
  }

  public onPdfColumnClickHandler(eventData) {
    if (eventData) {
      this.store.dispatch(
        this.backofficeActions.requestDownloadPdf(this.currentModule, eventData)
      );
    }
  }

  public onTrackingColumnClickHandler(eventData) {
    if (eventData) {
      this.store.dispatch(
        this.backofficeActions.requestGoToTrackingPage(
          this.currentModule,
          eventData
        )
      );
    }
  }

  public onReturnRefundColumnClickHandler(eventData) {
    if (eventData) {
      this.store.dispatch(
        this.backofficeActions.requestOpenReturnRefundModule(
          this.currentModule,
          eventData
        )
      );
    }
  }

  public onWijmoGridRowDoubleClickHandler(eventData) {
    //TODO: update later
  }

  public onRowDoubleClickHandler($event: any) {
    // if (($event && $event.isReadOnlyColumn) || !this.getAccessRightForCommandButton('ToolbarButton') || !this.getAccessRightForCommandButton('ToolbarButton__EditButton')) return;
    if (
      ($event && $event.isReadOnlyColumn) ||
      !this.accessRight['edit'] ||
      !this.getAccessRightForCommandButton('ToolbarButton')
    )
      return;

    // call to open edit grid if not readolny
    if (
      this.data.idRepWidgetType == this.WidgetTypeView.EditableGrid ||
      // || this.data.idRepWidgetType == this.WidgetTypeView.EditableTable
      this.data.idRepWidgetType == this.WidgetTypeView.Combination ||
      this.data.idRepWidgetType == this.WidgetTypeView.EditableRoleTreeGrid
    ) {
      if (
        this.data.idRepWidgetApp == RepWidgetAppIdEnum.CustomerStatus ||
        this.data.idRepWidgetApp == RepWidgetAppIdEnum.CustomerBusinessStatus
      ) {
        this.isCustomerStatusWidgetEdit = true;
        this.reloadWidgets.emit([this.data]);
      }

      this.onTableEditStart($event);
    }
  }

  public onSendLetterColumnClickHandler(eventData) {
    this.onShowEmailPopup.emit(eventData);
    //TODO: update later
  }

  public onUnblockColumnClickHandler(eventData) {
    if (eventData) {
      this.modalService.confirmMessageHtmlContent(
        new MessageModel({
          headerText: 'Unblock Order',
          message: [
            { key: '<p>' },
            {
              key: 'Modal_Message__Do_You_Want_To_Unblock_This_Order',
            },
            { key: '</p>' },
          ],
          callBack1: () => {
            this.saveUnblockOrder(eventData);
          },
        })
      );
    }
  }

  public onDeleteColumnClickHandler(eventData) {
    if (eventData) {
      this.modalService.confirmMessageHtmlContent(
        new MessageModel({
          messageType: MessageModal.MessageType.error,
          headerText: 'Delete Order',
          message: [
            { key: '<p>' },
            {
              key: 'Modal_Message__Do_You_Want_To_Delete_This_Order',
            },
            { key: '</p>' },
          ],
          buttonType1: MessageModal.ButtonType.danger,
          callBack1: () => {
            this.saveDeleteOrder(eventData);
          },
        })
      );
    }
  }

  public onScheduleSettingClickHandle($event) {
    // TODO:
  }

  public onRunScheduleSettingClickHandle($event) {
    // TODO:
  }

  private saveUnblockOrder(eventData: any, isDelete?: boolean) {
    this.backOfficeServiceSubscription = this.backOfficeService
      .saveUnblockOrder(eventData.IdSalesOrder, isDelete)
      .subscribe((resultData: any) => {
        this.appErrorHandler.executeAction(() => {
          // TODO: will get correct message in result
          if (!this.agGridComponent) return;
          this.agGridComponent.deleteRowByRowId(eventData.DT_RowId);
        });
      });
  }

  private saveDeleteOrder(eventData: any) {
    this.backOfficeServiceSubscription = this.backOfficeService
      .saveDeleteOrder(eventData.IdSalesOrder)
      .subscribe((resultData: any) => {
        this.appErrorHandler.executeAction(() => {
          // TODO: will get correct message in result
          if (!this.agGridComponent) return;
          this.agGridComponent.deleteRowByRowId(eventData.DT_RowId);
        });
      });
  }

  private hasScrollbarsHandler(eventData) {
    if (eventData) {
      this.scrollStatus.top = isNull(eventData.top)
        ? this.scrollStatus.top
        : eventData.top;
      this.scrollStatus.left = isNull(eventData.left)
        ? this.scrollStatus.left
        : eventData.left;
      this.scrollStatus.right = isNull(eventData.right)
        ? this.scrollStatus.right
        : eventData.right;
      this.scrollStatus.bottom = isNull(eventData.bottom)
        ? this.scrollStatus.bottom
        : eventData.bottom;
    }
  }

  private hasValidationErrorHandler(eventData) {
    if (this.agGridComponent) {
      if (this.widgetMenuStatusComponent && this.isOnEditingTable) {
        this.widgetMenuStatusComponent.manageAddRowTableButtonStatus(eventData);
        this.widgetMenuStatusComponent.manageSaveTableButtonStatus(eventData);
      }
    }
  }

  //////// -----------------End Wijmo Grid--------------///////////////////

  private checkWidgetFormHasScrollbars() {
    if (this.scrollUtils.hasVerticalScroll) {
      this.scrollStatus.top = this.scrollUtils.canScrollUpTop;
      this.scrollStatus.bottom = this.scrollUtils.canScrollDownBottom;
      this.addVerticalPerfectScrollEvent();
    } else {
      this.scrollStatus.top = false;
      this.scrollStatus.bottom = false;
      this.removeVerticalPerfectScrollEvent();
    }

    if (this.scrollUtils.hasHorizontalScroll) {
      this.scrollStatus.left = this.scrollUtils.canScrollToLeft;
      this.scrollStatus.right = this.scrollUtils.canScrollToRight;
      this.addHorizontalPerfectScrollEvent();
    } else {
      this.scrollStatus.left = false;
      this.scrollStatus.right = false;
      this.removeHorizontalPerfectScrollEvent();
    }

    if (this.directiveScroll && this.directiveScroll.elementRef) {
      Ps.update(this.directiveScroll.elementRef.nativeElement);
    }

    // this.scrollUtils.displayScroll();
  }

  private widgetFormLoadedHandler(eventData) {
    setTimeout(() => {
      if (eventData && !this.showInDialog) {
        this.checkWidgetFormHasScrollbars();
      }

      if (this.isSelectionProject && this.isEditAllWidgetMode) {
        this.editFormWidget(1);
      }
    }, 500);
  }

  private addHorizontalPerfectScrollEvent() {
    $(this._eref.nativeElement).on('ps-scroll-left', () => {
      this.scrollStatus.left = this.scrollUtils.canScrollToLeft;
      this.scrollStatus.right = this.scrollUtils.canScrollToRight;
    });

    $(this._eref.nativeElement).on('ps-scroll-right', () => {
      this.scrollStatus.left = this.scrollUtils.canScrollToLeft;
      this.scrollStatus.right = this.scrollUtils.canScrollToRight;
    });
  }

  private removeHorizontalPerfectScrollEvent() {
    $(this._eref.nativeElement).off('ps-scroll-left');
    $(this._eref.nativeElement).off('ps-scroll-right');
    $(this._eref.nativeElement).off('ps-x-reach-end');
    $(this._eref.nativeElement).off('ps-x-reach-start');
  }

  private addVerticalPerfectScrollEvent() {
    $(this._eref.nativeElement).on('ps-scroll-up', () => {
      this.scrollStatus.top = this.scrollUtils.canScrollUpTop;
      this.scrollStatus.bottom = this.scrollUtils.canScrollDownBottom;
    });

    $(this._eref.nativeElement).on('ps-scroll-down', () => {
      this.scrollStatus.top = this.scrollUtils.canScrollUpTop;
      this.scrollStatus.bottom = this.scrollUtils.canScrollDownBottom;
    });
  }

  private removeVerticalPerfectScrollEvent() {
    $(this._eref.nativeElement).off('ps-scroll-up');
    $(this._eref.nativeElement).off('ps-scroll-down');
    $(this._eref.nativeElement).off('ps-y-reach-end');
    $(this._eref.nativeElement).off('ps-y-reach-start');
  }

  /**
   * changeColumnLayoutsetting
   * @param $event
   */
  public changeColumnLayoutsetting($event: ColumnLayoutSetting) {
    this.columnLayoutsetting = $event;
    if (this.columnLayoutsetting) {
      this.columnLayout = this.columnLayoutsetting.columnLayout;
      this.allowFitColumn = this.columnLayoutsetting.isFitWidthColumn;
    }
    this.updateFitWidthColumnProperty(this.columnLayoutsetting);
  }

  public changeRowSetting($event: RowSetting) {
    this.rowSetting = $event;
    if (this.rowSetting) {
      this.showTotalRow = this.rowSetting.showTotalRow;
    }
    this.updateShowTotalRowProperty(this.rowSetting);
  }

  /**
   * changeWidgetLayout
   * @param $event
   */
  public changeWidgetFormType($event: WidgetFormTypeEnum) {
    this.widgetFormType = $event;
    this.updateWidgetFormTypeProperty($event);
    setTimeout(() => {
      const container = $(
        'div.widget-form-container',
        $(this._eref.nativeElement)
      );
      if (container && container.length) {
        Ps.update(container.get(0));
        setTimeout(() => {
          this.checkWidgetFormHasScrollbars();
        });
      }
    });
  }

  /**
   * getWidgetItemSize: Full Height & Width of widget content
   */
  private getWidgetItemSize(): WidgetItemSize {
    let totalHeight = 0;
    const totalWidth = this._eref.nativeElement.scrollWidth;
    const container = this._eref.nativeElement.querySelector('.box-default');
    if (container && container.children.length) {
      for (let i = 0; i < container.children.length; i++) {
        totalHeight += container.children[i].scrollHeight;
      }
    }
    return {
      width: totalWidth,
      height: totalHeight,
    };
  }

  // ---------------File Explorer Widget

  public onPropertiesItemClickHandler(eventData) {
    if (eventData) {
      this.store.dispatch(
        this.additionalInformationActions.requestTogglePanel(
          false,
          this.currentModule
        )
      );
      this.store.dispatch(
        this.propertyPanelActions.togglePanel(
          this.currentModule,
          eventData,
          this.data,
          this.properties,
          false
        )
      );
      if (this.isMaximized) {
        this.hoverBox = true;
      } else {
        this.hoverBox = false;
      }
      this.onOpenPropertyPanel.emit(true);
    }
  }

  /**
   * openTranslateWidget
   * @param event
   */
  public openTranslateWidget(event) {
    let translateInDialog = true;
    this.isTranslateDataTextOnly = false;
    if (this.widgetUtils.isTableWidgetDataType(this.data)) {
      if (event && event.mode == 'row') {
        this.allowGridTranslation = !this.allowGridTranslation;
        translateInDialog = false;
      }
    }
    if (translateInDialog) {
      this.isRenderWidgetInfoTranslation = true;
      this.onOpenTranslateWidget.emit({ isHidden: false });
      this.data.fieldsTranslating = false;
      this.combinationTranslateMode = event ? event.mode : null;
      setTimeout(() => {
        if (this.widgetModuleInfoTranslationComponent)
          this.widgetModuleInfoTranslationComponent.showDialog = true;
      }, 250);
    }
  }

  /**
   * openArticleTranslate
   */
  public openArticleTranslate() {
    if (this.widgetArticleTranslationDialogComponent) {
      this.widgetArticleTranslationDialogComponent.translatedDataGrid =
        this.dataSourceTable;
      this.widgetArticleTranslationDialogComponent.open();
      // this.ref.detectChanges();
    }
  }

  onHiddenWidgetInfoTranslation(event?: any) {
    this.isRenderWidgetInfoTranslation = false;
    this.isTranslateDataTextOnly = false;
    this.onOpenTranslateWidget.emit(event);
  }

  private resetWidgetTranslation($event: any) {
    this.resetWidget();
    this.onResetWidgetTranslation.emit(this.data.id);
  }

  openTranslateTitle() {
    this.isTranslateDataTextOnly = true;
    this.isRenderWidgetInfoTranslation = true;
    const propTitleText: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.propertiesForSaving.properties,
        'TitleText'
      );
    this.translationDataKeyword = propTitleText.value;
    this.onOpenTranslateWidget.emit({ isHidden: false });
    setTimeout(() => {
      if (this.widgetModuleInfoTranslationComponent)
        this.widgetModuleInfoTranslationComponent.showDialog = true;
    }, 100);
  }

  public buildFormDataForReadonlyGrid(filterObj?: any) {
    // should wait the grid init completed.
    if (!this.agGridComponent || !this.agGridComponent.gridOptions) {
      if (this._buildFormDataForReadonlyGridCounter < 30) {
        setTimeout(() => {
          this.buildFormDataForReadonlyGrid(filterObj);
        }, 100);
      }
      this._buildFormDataForReadonlyGridCounter++;
      return;
    }

    if (!this.data) return;

    // if (this.data.idRepWidgetType == WidgetType.DataGrid) {
    if (this.data.contentDetail.columnSettings) {
      // const gridToDetailPro = of(this.readonlyGridAutoSwitchToDetailProp).filter(Boolean).take(1);
      // gridToDetailPro.subscribe(value => {
      if (
        this.readonlyGridAutoSwitchToDetailProp &&
        this.agGridComponent &&
        this.agGridComponent.gridOptions
      ) {
        this.displayReadonlyGridAsForm = true;
        this.readonlyGridFormData = cloneDeep(this.data);
        this.readonlyGridFormData.contentDetail = { data: [[[]], []] };
        const rowData =
          this.agGridComponent.gridOptions.rowData.length > 0 &&
          this.agGridComponent.gridOptions.rowData;
        const gridSelectedRow = [];
        if (filterObj) {
          Object.keys(filterObj).forEach((x) => {
            for (const key of rowData) {
              if (key[x] === filterObj[x]) {
                gridSelectedRow.push(key);
              }
            }
          });
        }

        const rowDataChange =
          gridSelectedRow && gridSelectedRow.length > 0
            ? gridSelectedRow
            : this.agGridComponent.gridOptions.rowData;
        if (rowDataChange.length === 1) {
          this.readonlyGridFormData.contentDetail.data[1] =
            this.widgetUtils.buildReadonlyGridFormColumns(
              this.data.contentDetail.columnSettings,
              this.readonlyGridFormData.contentDetail.data[1]
            );
          this.readonlyGridFormData.contentDetail.data[1] =
            this.widgetUtils.buildReadonlyGridFormColumnsValue(
              rowDataChange,
              this.readonlyGridFormData.contentDetail.data[1]
            );
        } else {
          this.displayReadonlyGridAsForm = false;
          if (this.agGridComponent) {
            this.agGridComponent.refresh();
          }
        }
      } else {
        this.displayReadonlyGridAsForm = false;
        if (this.agGridComponent) {
          this.agGridComponent.refresh();
        }
      }
      // });
    }
    this.buildEmptyDataForWidgetDetail();
    this.showWidgetContain = true;
    this.updateContextMenuWhenChangeProperties();
    // }
  }

  private buildEmptyDataForWidgetDetail() {
    if (!this.readonlyGridFormData || !this.readonlyGridFormData.contentDetail)
      return;

    const data = cloneDeep(this.data);
    data.contentDetail = {
      data: [[[]], []],
    };
    data.contentDetail.data[1] = this.widgetUtils.buildReadonlyGridFormColumns(
      this.data.contentDetail.columnSettings,
      []
    );
    this.readonlyGridFormData = data;
  }

  public onToolbarButtonsToggleHandler(isShow: boolean) {
    this.isToolbarButtonsShowed = isShow;

    if (this.agGridComponent) {
      this.agGridComponent.toggleDeleteColumn(isShow);
    }
    if (this.data.idRepWidgetType === WidgetType.FileExplorerWithLabel) {
      this.xnFileExplorerComponentCtrl.toggleEditingFileExplorer(isShow);
      if (isShow) {
        this.makeEditingContextMenuForFileExplorerComponent(true);
      } else {
        this.buildContextMenu(
          this.contextMenuData,
          this.data.idRepWidgetType,
          this.currentModule,
          this.toolbarSetting,
          this.selectedTabHeader,
          this.activeSubModule
        );
      }
    } else if (this.data.idRepWidgetType === WidgetType.ExportBlockedCustomer) {
      if (isShow) {
        this.hoverBox = true;
        this.ref.markForCheck();
        this.ref.detectChanges();
      }
    }
  }

  public noEntryDataEvent($event): void {
    this.noEntryData = $event;
  }

  private buildContextMenu(
    contextMenuData,
    idRepWidgetType,
    currentModule,
    toolbarSetting,
    selectedTabHeader,
    activeSubModule
  ) {
    this.contextMenuData = this.widgetUtils.contextMenuInViewMode(
      contextMenuData,
      idRepWidgetType,
      this.getAccessRightAll(),
      currentModule,
      toolbarSetting,
      selectedTabHeader,
      activeSubModule,
      this.widgetToolbarSetting,
      this.data.idRepWidgetApp
    );
  }

  public onRightClick($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    if (
      this.currentModule &&
      this.currentModule.idSettingsGUI == MenuModuleId.administration &&
      this.activeSubModule &&
      this.activeSubModule.idSettingsGUI != MenuModuleId.cashProvider
    ) {
      for (let i = 0; i < this.contextMenuData.length; i++) {
        if (
          this.contextMenuData[i].title.indexOf('CC PRN') !== -1 ||
          this.contextMenuData[i].title.indexOf('Provider Cost') !== -1
        ) {
          this.contextMenuData[i].hidden = true;
        }
      }
    }
  }

  public onOpenFieldTranslateWidget(event) {
    if (this.data && this.data.idRepWidgetApp == 106) {
      //Repository Name widget

      const gridData = this.agGridComponent.gridOptions.rowData;
      const translateSource: any[] = [];
      const groupNames: any[] = [];
      for (let i = 0; i < gridData.length; i++) {
        if (
          !translateSource.length ||
          !translateSource.find((t) => t.Value == gridData[i].TableName)
        ) {
          translateSource.push({
            ColumnName: gridData[i].Alias,
            OriginalText: gridData[i].Alias,
            Value: gridData[i].TableName,
            OriginalColumnName:
              'RepositoryName_' + gridData[i].Alias.replace(/ /g, ''),
            Selected:
              this.agGridComponent &&
              this.agGridComponent.selectedNode &&
              this.agGridComponent.selectedNode.data &&
              gridData[i].TableName ==
                this.agGridComponent.selectedNode.data.TableName,
          });

          const groupName = gridData[i].GroupNameAlias;
          if (groupNames.findIndex((x) => x.OriginalText == groupName) === -1) {
            groupNames.push({
              IsGroupName: true,
              ColumnName: groupName,
              OriginalText: groupName,
              Value: gridData[i].GroupName,
              OriginalColumnName:
                'RepositoryName_' + groupName.replace(/ /g, ''),
              Selected:
                this.agGridComponent &&
                this.agGridComponent.selectedNode &&
                this.agGridComponent.selectedNode.data &&
                gridData[i].TableName ==
                  this.agGridComponent.selectedNode.data.TableName,
            });
          }
        }
      }

      for (let i = 0; i < groupNames.length; i++) {
        translateSource.splice(i, 0, groupNames[i]);
      }

      this.data.fieldsTranslating = true;
      this.data.contentDetail.data = [null, translateSource];

      this.isTranslateDataTextOnly = false;
      this.isRenderWidgetInfoTranslation = true;
      this.onOpenTranslateWidget.emit({ isHidden: false });
      setTimeout(() => {
        if (this.widgetModuleInfoTranslationComponent)
          this.widgetModuleInfoTranslationComponent.showDialog = true;
      }, 100);
    }
  }

  public buildReadOnlyCells(idRepWidgetApp) {
    switch (idRepWidgetApp) {
      case 105:
        return [
          {
            name: 'IdLoginRoles',
            value: 1,
          },
          {
            name: 'IdLoginRoles',
            value: 2,
          },
        ];
      default:
        return null;
    }
  }

  public checkToShowTableTooltip(idRepWidgetApp) {
    switch (idRepWidgetApp) {
      case 105:
      case 106:
        return true;
      default:
        return false;
    }
  }

  public buildCustomTooltip(idRepWidgetApp) {
    switch (idRepWidgetApp) {
      case 106:
        return { preText: 'Original Name: ', fieldName: 'Alias' };
      case 105:
        return { preText: '', fieldName: 'Explanation' };
      default:
        return null;
    }
  }

  public onAddWidgetTemplate() {
    if (
      this.data &&
      (this.data.idRepWidgetApp == 111 ||
        this.data.idRepWidgetApp == 112 ||
        this.data.idRepWidgetApp == 113 ||
        this.data.idRepWidgetApp == 114 ||
        this.data.idRepWidgetApp == 126)
    ) {
      if (this.agGridComponent) {
        this.clearDataSourceData();
      }
    }
  }

  public onChangeWidgetTemplate(templateId) {
    this.templateId = templateId;

    this.reloadWidgets.emit([this.data]);
    setTimeout(() => {
      this.onTableEditStart(null);
    }, 200);
  }

  public onRefreshWidget() {
    this.resetEditingWidget();
    this.refreshCurrentWidget = GuidHelper.generateGUID();
  }

  public onNoteFormWidgetAction(event: NoteFormDataAction) {
    this.noteFormDataAction = event;

    switch (event.action) {
      case this.NOTE_ACTION_ENUM.SAVE:
        this.updateNote(event);
        break;

      default:
        break;
    }
  }
  public updateNote(event: NoteFormDataAction) {
    if (event.action === this.NOTE_ACTION_ENUM.SAVE) {
      let updateRequest;
      if (event.data) {
        const eventData = event.data;
        eventData['Date'] = eventData.date;
        updateRequest = [eventData];
      } else {
        updateRequest = this.widgetNoteFormComponent.getDataSave();
      }

      this.callSaveNoteFormWidget(updateRequest);
    }
  }
  private callSaveNoteFormWidget(updateRequest: any) {
    if (!updateRequest) return;
    this.saveFormWidget(null, updateRequest);
  }

  private buildIsShowToolPanelSetting() {
    switch (this.data.idRepWidgetType) {
      case this.WidgetTypeView.DataGrid:
      case this.WidgetTypeView.EditableGrid:
      // case this.WidgetTypeView.EditableTable:
      case this.WidgetTypeView.FileExplorerWithLabel:
      case this.WidgetTypeView.EditableRoleTreeGrid:
      case this.WidgetTypeView.ReturnRefund:
        this.isShowToolPanelSetting = true;
    }
  }
  public updateEditingWidgetForNote(event) {
    if (event) {
      this.onEditingWidget.emit(this.data);
    } else {
      this.onCancelEditingWidget.emit(this.data);
    }
  }

  private resetPropertiesToOriginal() {
    setTimeout(() => {
      // this.properties = cloneDeep(this.originalProperties);
      this.settingNewDataForProperties = false;
    }, 2000); // Just waiting the data from service.
  }

  public setOriginalProperties() {
    if (!this.settingNewDataForProperties) {
      this.originalProperties = cloneDeep(this.properties);
    }
    this.store.dispatch(
      this.propertyPanelActions.updateTempProperties(
        this.originalProperties,
        this.currentModule
      )
    );
  }

  // #region [Access Right]
  private getAccessRightAll(): any {
    const moduleAccessRight = this._accessRightsService.getAccessRight(
      AccessRightTypeEnum.Tab,
      {
        idSettingsGUIParent: (this.currentModule || {}).idSettingsGUIParent,
        idSettingsGUI: (this.currentModule || {}).idSettingsGUI,
        tabID: this.tabID,
      }
    );
    const result = {
      ParkedItem_New: moduleAccessRight.new,
      ParkedItem_Edit: moduleAccessRight.edit,
    };
    for (const item in AccessRightWidgetCommandButtonEnum) {
      result[item] = this.getAccessRightForCommandButton(item);
    }
    return { ...result, ...this.accessRight };
  }

  private initAccessRightDataForCommandButton() {
    const accessRightData: any = {};
    for (const item in AccessRightWidgetCommandButtonEnum) {
      accessRightData[item] = { read: false };
    }
    return accessRightData;
  }

  private buildAccessRight() {
    if (!this.activeSubModule) return;
    const accessRightData: Array<any> = [];
    const idRepWidgetApp = this.payload
      ? this.payload.idRepWidgetApp
      : this.data
      ? this.data.idRepWidgetApp
      : null;
    const idRepWidgetType = this.payload
      ? this.payload.idRepWidgetType
      : this.data
      ? this.data.idRepWidgetType
      : null;
    for (const item in AccessRightWidgetCommandButtonEnum) {
      accessRightData.push({
        idSettingsGUIParent: (this.currentModule || {}).idSettingsGUIParent,
        idSettingsGUI: (this.currentModule || {}).idSettingsGUI,
        idRepWidgetApp: idRepWidgetApp,
        buttonCommand: item,
      });
    }
    this.accessRightForCommandButton =
      this._accessRightsService.SetAccessRightsForWidgetMenuStatus(
        accessRightData
      );

    if (
      idRepWidgetType === WidgetType.Translation ||
      idRepWidgetType === WidgetType.BlankWidget
    ) {
      this.accessRight = this._accessRightsService.createFullAccessRight();
    } else {
      this.accessRight = this._accessRightsService.SetAccessRightsForWidget({
        idSettingsGUIParent: (this.currentModule || {}).idSettingsGUIParent,
        idSettingsGUI: (this.currentModule || {}).idSettingsGUI,
        idRepWidgetApp: idRepWidgetApp,
      });
    }

    this.accessRightAll = {
      ...this.accessRight,
      ...this.accessRightForCommandButton,
    };
    if (this.menuStatusSettings)
      this.menuStatusSettings.setAccessRight(this.accessRightAll);
  }

  public getAccessRightForCommandButton(buttonName: string) {
    if (
      !this.accessRightForCommandButton ||
      !this.accessRightForCommandButton[
        AccessRightWidgetCommandButtonEnum[buttonName]
      ]
    ) {
      return false;
    }
    const status =
      this.accessRightForCommandButton[
        AccessRightWidgetCommandButtonEnum[buttonName]
      ]['read'];
    return status;
  }

  //#endregion [Access Right]

  //#region [SELECTION]
  public onCountryChanged() {
    this.isOnEditingTable = true;
    this.controlMenuStatusToolButtons(true);
    this.isTableEdited = true;
    this.editingWidget(this.dataInfo);
  }

  public onFilterCountrySelectionChanged(selectedCountry: any[]) {
    if (
      selectedCountry &&
      selectedCountry.length &&
      this.data.idRepWidgetType == WidgetType.DoubleGrid &&
      (this.data.idRepWidgetApp == LogicItemsId.AgeFilter ||
        this.data.idRepWidgetApp == LogicItemsId.AgeFilter_Extend ||
        this.data.idRepWidgetApp == LogicItemsId.ExtendedFilter ||
        this.data.idRepWidgetApp == LogicItemsId.ExtendedFilter_Extend)
    ) {
      const isActive = selectedCountry.find((c) => c.key == 'IsActive');
      if (isActive) {
        this.isSelectedCountryActive = isActive.value;
      }
    }
  }

  public onFrequencyGridLoaded() {
    this.frequencyGrid.toggleColumns(this.selectedFilter);
  }

  public onSaveFilter() {
    this.profileSelectedData['IdSelectionWidget'] =
      MapFromWidgetAppToFilterId[this.data.idRepWidgetApp];
    this.widgetProfileSaving.openConfirmSaving();
  }

  public onOpenFilter() {
    this.widgetProfileSelect.open({
      idSelectionWidget: MapFromWidgetAppToFilterId[this.data.idRepWidgetApp],
    });
  }

  public onProfileSelectedData($event) {
    $event['IdSelectionWidget'] =
      MapFromWidgetAppToFilterId[this.data.idRepWidgetApp];
    this.profileSelectedData = $event;

    this.store.dispatch(
      this.filterActions.requestLoadProfile(
        this.profileSelectedData,
        this.currentModule
      )
    );
  }

  public onProfileSavingData(isNew: boolean) {
    /*
        Checking data follow database id with
        idRepWidgetApp = 503: Age Filter widget
        idRepWidgetApp = 509: Age Filter Extend widget
        idRepWidgetApp = 504: Black List widget
        idRepWidgetApp = 506: Extended Filter widget
        idRepWidgetApp = 510: Extended Filter Extend widget
        idRepWidgetApp = 507: Group Priority widget

        If database change those id that must be updated
        */

    switch (this.data.idRepWidgetApp) {
      case LogicItemsId.AgeFilter:
      case LogicItemsId.AgeFilter_Extend:
        this.processSaveProfile(isNew, this.ageFilterGrid);
        break;

      case LogicItemsId.CountryBlackList:
        this.processSaveProfile(isNew, this.countryBlacklist);
        break;

      case LogicItemsId.ExtendedFilter:
      case LogicItemsId.ExtendedFilter_Extend:
        this.processSaveProfile(isNew, this.extendedFilterGrid);
        break;

      case LogicItemsId.GroupPriority:
        this.processSaveProfile(isNew, this.groupPriority);
        break;
    }
  }

  private processSaveProfile(isNew, gridComponent) {
    gridComponent.createJsonDataForProfile().subscribe((jsonData: any) => {
      if (
        !isNew &&
        (isEmpty(this.profileSelectedData) ||
          !this.profileSelectedData ||
          !this.profileSelectedData.IdSelectionWidgetTemplate)
      ) {
        this.widgetProfileSaving.openUpdateWithoutSelectProfile(
          MapFromWidgetAppToFilterId[this.data.idRepWidgetApp],
          jsonData
        );
        return;
      }
      this.widgetProfileSaving.callSavingData(jsonData);
    });
  }

  public onNewLotClick($event) {
    if (this.newLotDialogComponent) {
      this.newLotDialogComponent.open();
    }
  }

  public onDeleteProjectClick($event) {
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        messageType: MessageModal.MessageType.error,
        headerText: 'Delete Project',
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Do_You_Want_To_Delete_This_Project',
          },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.danger,
        callBack1: () => {
          this.deleteProject();
        },
      })
    );
  }

  private deleteProject() {
    const formValues = this.widgetFormComponent.filterValidFormField();
    const updateKeyValue = Uti.getUpdateKeyValue(
      formValues,
      this.data.widgetDataType.listenKeyRequest(
        this.currentModule.moduleNameTrim
      )
    );

    const saveData = {
      IdSalesCampaignWizard: updateKeyValue,
      IsDeleted: true,
    };

    this.projectService.saveProject([saveData]).subscribe(
      (response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
        });
      },
      (err) => {}
    );
  }

  public onNewRule(isForAllCountry?: boolean) {
    switch (this.data.idRepWidgetApp) {
      case this.logicItemsId.AgeFilter:
      case this.logicItemsId.AgeFilter_Extend:
        if (this.ageFilterGrid) {
          this.ageFilterGrid.newRule(isForAllCountry);
        }
        break;

      case this.logicItemsId.ExtendedFilter:
      case this.logicItemsId.ExtendedFilter_Extend:
        if (this.extendedFilterGrid) {
          this.extendedFilterGrid.newRule(isForAllCountry);
        }
    }
  }

  public onDeleteRule(isForAllCountry?: boolean) {
    switch (this.data.idRepWidgetApp) {
      case this.logicItemsId.AgeFilter:
      case this.logicItemsId.AgeFilter_Extend:
        if (this.ageFilterGrid) {
          this.ageFilterGrid.deleteRule(isForAllCountry);
        }
        break;

      case this.logicItemsId.ExtendedFilter:
      case this.logicItemsId.ExtendedFilter_Extend:
        if (this.extendedFilterGrid) {
          this.extendedFilterGrid.deleteRule(isForAllCountry);
        }
        break;
    }
  }

  public onAllCountryCheckboxChanged(isForAllCountry?: boolean) {
    switch (this.data.idRepWidgetApp) {
      case this.logicItemsId.CountryBlackList:
        if (this.countryBlacklist) {
          this.countryBlacklist.onCheckAllChanged(isForAllCountry);
        }
        break;

      case this.logicItemsId.GroupPriority:
        if (this.groupPriority) {
          this.groupPriority.onCheckAllChanged(isForAllCountry);
        }

      case this.logicItemsId.AgeFilter:
      case this.logicItemsId.AgeFilter_Extend:
        if (this.ageFilterGrid) {
          this.ageFilterGrid.onCheckAllChanged(isForAllCountry);
        }

      case this.logicItemsId.ExtendedFilter:
      case this.logicItemsId.ExtendedFilter_Extend:
        if (this.extendedFilterGrid) {
          this.extendedFilterGrid.onCheckAllChanged(isForAllCountry);
        }
    }
  }

  public onZoomSliderChanged(value) {
    if (this.frequencyGrid) {
      this.frequencyGrid.changeZoom(value);
    }
  }

  public mouseDblClick($event) {
    if (
      this.data &&
      (this.data.idRepWidgetType == WidgetType.DoubleGrid ||
        this.data.idRepWidgetType == WidgetType.TripleGrid ||
        this.data.idRepWidgetType == WidgetType.CountrySelection) &&
      this.widgetMenuStatusComponent &&
      !this.isToolbarButtonsShowed
    ) {
      this.widgetMenuStatusComponent.toggleToolButtonsWithoutClick(true);
    }
  }

  public onSaveSelectionWidgetSuccess() {
    this.manageEditableTableStatusButtonsAfterSaving();
    this.cancelEditingWidget(this.dataInfo);
    this.saveSuccessWidget(this.dataInfo);
    this.copiedData = null;
    this.reEditWhenInPopup();

    this.isTableEdited = false;
    this.isOnEditingTable = false;
    if (this.isSelectionProject && !this.isEditAllWidgetMode) {
      this.widgetMenuStatusComponent.toggleToolButtons(false);
      this.widgetMenuStatusComponent.toggleToolButtonsWithoutClick(false);
      this.reattach();
    }
  }

  public onDeleteRuleColumnClick(deleteCount: number) {
    if (
      this.widgetMenuStatusComponent &&
      this.widgetMenuStatusComponent.showDeleteRuleButton
    ) {
      this.widgetMenuStatusComponent.deletedRulesCount = deleteCount;
    }
  }

  //#endregion SELECTION

  //#region [SignalR]
  public notifyItems: Array<SignalRNotifyModel> = [];
  public userJustSaved: SignalRNotifyModel;
  private listenEditingEventSubscription: Subscription;
  private listenSavedSuccessEventSubscription: Subscription;
  private _isActivated = true;

  private signalRRegisterEvent() {
    if (
      !Configuration.PublicSettings.enableSignalR ||
      !Configuration.PublicSettings.enableSignalRForWidgetDetail ||
      !this.payload ||
      (this.payload.idRepWidgetType != this.WidgetTypeView.FieldSet &&
        this.payload.idRepWidgetType != this.WidgetTypeView.FieldSetReadonly)
    )
      return;
    this.registerListenEditingEvent();
    this.registerListenSavedSuccessEvent();
  }

  private registerListenEditingEvent() {
    if (this.listenEditingEventSubscription)
      this.listenEditingEventSubscription.unsubscribe();

    this.listenEditingEventSubscription =
      this.signalRService.messageReceived.subscribe(
        (items: Array<SignalRNotifyModel>) => {
          if (
            !this.widgetFormComponent ||
            !this.widgetFormComponent.notifyObjectId
          )
            return;

          this.notifyItems = items.filter(
            (x) => x.ObjectId === this.widgetFormComponent.notifyObjectId
          );
          this.setValueForIsOpenUserEditingList();
          setTimeout(() => {
            this.ref.detectChanges();
          }, 100);
        }
      );
  }

  private registerListenSavedSuccessEvent() {
    if (this.listenSavedSuccessEventSubscription)
      this.listenSavedSuccessEventSubscription.unsubscribe();

    this.listenSavedSuccessEventSubscription =
      this.signalRService.messageWidgetSavedSuccessReceived.subscribe(
        (item: SignalRNotifyModel) => {
          if (!item) return;
          this.userJustSaved = item;

          if (this.isWidgetEditMode) {
            this.isShowReloadMessage = true;
          } else {
            this.reloadWidgets.emit([this.data]);
            this.setReloadMessageValue(true);
            this.autoClearMessageAfterShow(5000);
          }
          this.callDetectChanges();
        }
      );
  }

  public setActivatedForThisComponent(isActivated: boolean) {
    setTimeout(() => {
      this.isOpenUserEditingList =
        isActivated && !!(this.notifyItems && this.notifyItems.length);
      if (!this.signalRPopover) return;
      if (this.isOpenUserEditingList) {
        this.signalRPopover.show();
      } else {
        this.signalRPopover.hide();
      }
    }, 200);
    this._isActivated = isActivated;
  }

  private setValueForIsOpenUserEditingList() {
    this.isOpenUserEditingList =
      this._isActivated && !!(this.notifyItems && this.notifyItems.length);
  }

  private showEditingNotification() {
    if (
      this.widgetFormComponent &&
      this.data &&
      this.data.idRepWidgetType == this.WidgetTypeView.FieldSet
    ) {
      this.widgetFormComponent.signalRIsThereAnyoneEditing();
    }
  }

  public isUserClickToggle = false;

  public onToggleClicked($event) {
    this.isUserClickToggle = $event;
  }

  public isShowReloadMessage = false;
  public reloadMessageIsBlockUI = true;
  public forceResetWidgetForm = false;
  public controlUpdated: Array<any> = [];
  private doesStayOnMessage = false;
  private autoClearMessageAfterShowTimeOut: any;

  public onReloadMessage($event) {
    this.setReloadMessageValue(false);

    this.reloadWidgets.emit([this.data]);
    this.forceResetWidgetForm = true;
  }

  public onCancelMessage($event) {
    this.setReloadMessageValue(false);
  }

  private resetSomeKeyOfSignalR() {
    setTimeout(() => {
      this.forceResetWidgetForm = false;
    }, 1000);
  }

  private setReloadMessageValue(value: boolean) {
    this.isShowReloadMessage = value;
    this.reloadMessageIsBlockUI = !value;
  }

  private callDetectChanges() {
    setTimeout(() => {
      this.ref.detectChanges();
    }, 100);
  }

  public onMouseInReloadMessage() {
    this.doesStayOnMessage = true;
    if (this.autoClearMessageAfterShowTimeOut) {
      clearTimeout(this.autoClearMessageAfterShowTimeOut);
    }
  }

  public onMouseOutReloadMessage() {
    this.doesStayOnMessage = false;
    this.autoClearMessageAfterShow(1500);
  }

  private autoClearMessageAfterShow(timeOut: number) {
    this.autoClearMessageAfterShowTimeOut = setTimeout(() => {
      if (this.doesStayOnMessage) {
        return;
      }
      this.setReloadMessageValue(false);
      this.callDetectChanges();
    }, timeOut);
  }

  //#endregion SignalR

  //#region [Property]
  private currentObjectName = '';

  private requestDataWhenChangePropety(data: WidgetPropertiesStateModel) {
    if (data.widgetData.idRepWidgetApp == RepWidgetAppIdEnum.ChartWidget) {
      this.requestDataWhenChangeObjectNameOfChartProperty(data);
    }
  }

  private requestDataWhenChangeObjectNameOfChartProperty(
    data: WidgetPropertiesStateModel
  ) {
    if (
      !data.widgetData ||
      (data.widgetData.syncWidgetIds && data.widgetData.syncWidgetIds.length)
    ) {
      return;
    }
    const properties = data.widgetProperties.properties
      ? data.widgetProperties.properties
      : data.widgetProperties;
    const dataSourceObject: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        properties,
        ComboBoxTypeConstant.chartDataSourceObject,
        PropertyNameOfWidgetProperty.ComboboxStoreObject
      );
    if (
      !dataSourceObject ||
      !dataSourceObject.value ||
      dataSourceObject.value == this.currentChartDataSourceObject
    ) {
      return;
    }
    data.widgetData.request = data.widgetData.request.replace(
      this.currentObjectName ? this.currentObjectName : '<<ObjectName>>',
      dataSourceObject.value
    );
    this.currentObjectName = dataSourceObject.value;
    this.reloadWidgets.emit([data.widgetData]);
  }

  //#endregion [Property]

  //#region [Chart]
  public chartData: any;

  private updateChartData() {
    if (this.data.idRepWidgetApp != RepWidgetAppIdEnum.ChartWidget) return;
    const dataSourceObject: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        ComboBoxTypeConstant.chartDataSourceObject,
        PropertyNameOfWidgetProperty.ComboboxStoreObject
      );

    if (
      dataSourceObject &&
      dataSourceObject.value &&
      dataSourceObject.value == this.currentChartDataSourceObject
    ) {
      return;
    }

    const linkWidgetTitleId: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(
        this.properties,
        PropertyNameOfWidgetProperty.LinkWidgetTitleId
      );
    if (!this.data.syncWidgetIds || !this.data.syncWidgetIds.length) {
      dataSourceObject.visible = true;
      linkWidgetTitleId.visible = false;
      if (
        !this.data.contentDetail ||
        !this.data.contentDetail.data ||
        this.data.contentDetail.data.length < 2
      )
        return;
      this.chartData = this.datatableService.formatDataTableFromRawData(
        this.data.contentDetail.data
      );

      if (this.isExpandedPropertyPanel) {
        this.buildFieldFilterForChart(this.chartData.columnSettings);
      }

      this.currentChartDataSourceObject = dataSourceObject.value;
    } else {
      // Update combobx text when link chart to other widget
      dataSourceObject.visible = false;
      linkWidgetTitleId.visible = true;
      const parentWidget: WidgetDetail = this.getWidgetById(
        this.data.syncWidgetIds[0]
      );
      linkWidgetTitleId.value = parentWidget ? parentWidget.title : null;
      this.currentChartDataSourceObject = null;
    }
  }

  private getWidgetById(widgetId: any) {
    let widgetDetail: any;
    for (const item of this.layoutPageInfoWidget) {
      widgetDetail = item.widgetboxesTitle.find((x) => x.id == widgetId);
      if (widgetDetail && widgetDetail.id) return widgetDetail;
    }
    return widgetDetail;
  }

  private buildFieldFilterForChart(columnSettings) {
    this.fieldFilters = [];
    Object.keys(columnSettings).forEach((key) => {
      this.fieldFilters.push(
        new FieldFilter({
          fieldDisplayName: columnSettings[key].ColumnName,
          fieldName: columnSettings[key].OriginalColumnName,
          selected: false,
          isHidden: false,
          isEditable: false,
        })
      );
    });

    //Reset previous data
    this.widgetMenuStatusComponent.isInitDisplayFields = false;
    this.widgetMenuStatusComponent.fieldFilters = [];
    const propXSeries: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(this.properties, 'XSeries');
    if (propXSeries) {
      propXSeries.options = [];
      propXSeries.value = [];
    }

    const propYSeries: WidgetPropertyModel =
      this.propertyPanelService.getItemRecursive(this.properties, 'YSeries');
    if (propYSeries) {
      propYSeries.options = [];
      propYSeries.value = [];
    }

    this.initwidgetMenuStatusData = {
      widgetDetail: {
        ...this.data,
        contentDetail: this.chartData,
      },
      selectedFilter: this.selectedFilter,
      selectedSubFilter: this.selectedSubFilter,
      fieldFilters: this.fieldFilters,
      columnLayoutsetting: this.columnLayoutsetting,
      rowSetting: this.rowSetting,
      selectedWidgetFormType: this.widgetFormType,
      widgetProperties: this.properties,
      gridLayoutSettings: this.columnsLayoutSettings,
      isForAllCountryCheckbox: false,
      isForAllCountryButton: false,
    };

    setTimeout(() => {
      this.store.dispatch(
        this.propertyPanelActions.clearProperties(this.currentModule)
      );
      this.store.dispatch(
        this.propertyPanelActions.togglePanel(
          this.currentModule,
          true,
          this.data,
          this.properties,
          false
        )
      );
    }, 250);
  }

  //#endregion [Chart]

  // ==========================================================================================================================================
  //#region [Sav Letter]
  private messageRCWord2PdfSubscription: Subscription;
  private showSendLetterDialogData: {
    widgetData: any;
    selectedItems: Array<any>;
  } = { widgetData: {}, selectedItems: [] };
  private showSAVWidgetDialogData: { widgetData: any; data: any } = {
    widgetData: {},
    data: {},
  };
  private isCallStart: boolean = false;
  private startTimeout: any;
  private sendLetterOutputData: any = {};
  private isSAVPreview = false;
  private isSAVWidget = false;
  private sAVIdConnectionName = 'NoConnection';

  public closedSendLetterHandle(isReload?: boolean) {
    this.isShowSendLetter = false;
    if (isReload) {
      this.reloadWidgets.emit([this.data]);
    }
    this.callDetectChanges();
  }

  public buttonAndCheckboxClickHandler(rowData: any) {
    this.showSendLetterDialogData = {
      widgetData: this.data,
      selectedItems: [rowData],
    };
    this.isShowSendLetter = true;
    Uti.executeFunctionWithTimeout(
      () => {
        this.sendLetterDialogComponent.callShowDialog(
          this.showSendLetterDialogData
        );
      },
      () => {
        return !!this.sendLetterDialogComponent;
      }
    );
  }

  public initComponentHandle() {
    this.signalRListenMessage();
  }

  public startGeneratePdfHandle(data: any, isPreview?: boolean) {
    this.sendLetterOutputData = data;
    this.isSAVPreview = isPreview;
    if (this.isCallStart) {
      this.toasterService.pop(
        'warning',
        'SignalR',
        'Bus connection is connecting...'
      );
      return;
    }

    if (
      this.isSAVWidget &&
      (!this.showSAVWidgetDialogData.data ||
        !this.showSAVWidgetDialogData.data.key)
    ) {
      this.modalService.warningText(
        'Modal_Message__Please_Select_Item_To_Generate_PDF'
      );
      return;
    }

    if (
      !this.isSAVPreview &&
      !this.isSAVWidget &&
      (!this.showSendLetterDialogData.selectedItems ||
        !this.showSendLetterDialogData.selectedItems.length)
    ) {
      this.modalService.warningText(
        'Modal_Message__Please_Select_Blocked_Order_Item'
      );
      return;
    }

    this.isCallStart = true;
    this.sendMessage(SignalRActionEnum.RCWord2Pdf_Ping);

    clearTimeout(this.startTimeout);
    this.startTimeout = null;
    this.startTimeout = setTimeout(() => {
      if (this.isCallStart) {
        this.isCallStart = false;
        if (this.savLetterTemplateComponent) {
          this.savLetterTemplateComponent.setShowPreviewIndicator(false);
        }
        this.toasterService.pop(
          'error',
          'SignalR Error',
          'Bus connection failed, please try again.'
        );
      }
    }, 5000);
  }

  /* Private Methods */

  // private isButtonAndCheckboxChecked(stringData: string): boolean {
  //     try {
  //         let _jsonData = Uti.parseJsonString(stringData);
  //         return _jsonData['Value'];
  //     } catch(e) {
  //         return false;
  //     }
  // }

  private signalRIsProcessing: boolean = false;
  private signalRListenMessage() {
    if (this.messageRCWord2PdfSubscription)
      this.messageRCWord2PdfSubscription.unsubscribe();

    this.messageRCWord2PdfSubscription =
      this.signalRService.messageRCWord2Pdf.subscribe(
        (message: SignalRNotifyModel) => {
          this.appErrorHandler.executeAction(() => {
            if (message.Job == SignalRJobEnum.Disconnected) {
              // BackgroundJob is stopped
              // Notify an error message to user
              return;
            }

            // if (isDevMode()) {
            console.log(message);
            // }

            switch (message.Action) {
              case SignalRActionEnum.RCWord2Pdf_ServiceAlive:
                this.createQueueAndStart();
                break;
              case SignalRActionEnum.RCWord2Pdf_GetProcessingList:
                // Refresh Grid get data
                // this.signalRGetProcessingList(message);
                break;
              case SignalRActionEnum.RCWord2Pdf_StartSuccessfully:
                this.signalRStartSuccessfully(message);
                break;
              case SignalRActionEnum.RCWord2Pdf_Processsing:
                this.signalRProcesssing(message);
                break;
              case SignalRActionEnum.RCWord2Pdf_Fail:
                this.signalRProcesssing(message);
                break;
              case SignalRActionEnum.RCWord2Pdf_Success:
                this.signalRProcesssing(message);
                break;
              case SignalRActionEnum.RCWord2Pdf_Finish:
                this.signalRProcessingFinish(message);
                break;
              case SignalRActionEnum.RCWord2Pdf_StopSuccessfully:
                this.signalRStopSuccessfully();
                break;
              default:
                break;
            }
          });
        }
      );
  }

  private signalRProcesssing(message: SignalRNotifyModel) {
    if (!message.Data || !message.Data.length) return;

    if (this.isSAVPreview) {
      this.signalRProcessingForPreview(message);
      return;
    }
    if (this.isSAVWidget) {
      this.signalRProcessingForSAVWidget(message);
      return;
    }
    this.signalRProcessingForSelfWidget(message);
  }

  private signalRProcessingForPreview(message: SignalRNotifyModel) {
    switch (message.Action) {
      case SignalRActionEnum.RCWord2Pdf_Processsing:
        if (this.savLetterTemplateComponent)
          this.savLetterTemplateComponent.setShowPreviewIndicator(true);
        break;
      case SignalRActionEnum.RCWord2Pdf_Success:
        if (this.savLetterTemplateComponent)
          this.savLetterTemplateComponent.setShowPreviewIndicator(false);
        this.callShowPDFFileAfterGenerated(message);
        break;
      case SignalRActionEnum.RCWord2Pdf_Fail:
        if (this.savLetterTemplateComponent)
          this.savLetterTemplateComponent.setShowPreviewIndicator(false);
        this.toasterService.pop(
          'error',
          'Notification',
          'File is not generated'
        );
        break;
    }
    this.callDetectChanges();
  }

  private signalRProcessingForSAVWidget(message: SignalRNotifyModel) {
    switch (message.Action) {
      case SignalRActionEnum.RCWord2Pdf_Processsing:
        this.savSendLetterData.Status = 1;
        this.reloadLinkWidgets.emit(this.data);
        break;
      case SignalRActionEnum.RCWord2Pdf_Success:
        if (
          !(() => {
            try {
              return !!message.Data[0].FileItem.MediaName;
            } catch (d) {
              return false;
            }
          })()
        ) {
          this.toasterService.pop(
            'error',
            'Notification',
            message.Message || 'File is not generated'
          );
          return;
        }
        this.savSendLetterData.Status = 2;
        this.reloadWidgets.emit([this.data]);
        this.reloadLinkWidgets.emit(this.data);
        break;
      case SignalRActionEnum.RCWord2Pdf_Fail:
        this.toasterService.pop(
          'error',
          'Notification',
          message.Message || 'File is not generated'
        );
        break;
    }
    // this.savSendLetterData = cloneDeep(this.savSendLetterData);
    this.callDetectChanges();
  }

  private signalRProcessingForSelfWidget(message: SignalRNotifyModel) {
    switch (message.Action) {
      case SignalRActionEnum.RCWord2Pdf_Processsing:
      case SignalRActionEnum.RCWord2Pdf_Success:
        {
          let _item = this.showSendLetterDialogData.selectedItems.find(
            (x) => x.IdSalesOrder == message.Data[0]['IdSalesOrder']
          );
          if (!_item) return;

          let _jsonData = Uti.parseJsonString(_item['Letters']);
          _jsonData['Status'] = message.Data[0]['Status'];
          _jsonData['IdGenerateLetter'] = message.Data[0]['IdGenerateLetter'];
          _item['Letters'] = JSON.stringify(_jsonData);
          if (message.Action === SignalRActionEnum.RCWord2Pdf_Success) {
            const pdfString = (() => {
              try {
                return message.Data[0].FileItem.FullFileName;
              } catch (e) {
                return '';
              }
            })();
            _item['PDFLetter'] = pdfString;
            this.callShowPDFFileAfterGenerated(message);
          }
          this.agGridComponent.updateRowData([_item]);
        }
        break;
      case SignalRActionEnum.RCWord2Pdf_Fail:
        this.toasterService.pop(
          'error',
          'Notification',
          message.Message || 'File is not generated'
        );
        break;
    }
  }

  private callShowPDFFileAfterGenerated(message: SignalRNotifyModel) {
    const pdfString = (() => {
      try {
        return message.Data[0].FileItem.FullFileName;
      } catch (e) {
        return '';
      }
    })();
    let rowData: any = [
      {
        key: 'PDF',
        value: pdfString,
      },
    ];
    if (!this.isSAVPreview) {
      Uti.setValueForArrayByKey(
        this.currentGridRowItem,
        'value',
        pdfString,
        'key',
        'PDFLetter'
      );
      rowData = this.currentGridRowItem;
    }
    this.onRowTableClick.emit({
      cellInfos: rowData,
      widgetDetail: this.data,
    });
  }

  private signalRProcessingFinish(message: SignalRNotifyModel) {
    if (this.savLetterTemplateComponent)
      this.savLetterTemplateComponent.setShowPreviewIndicator(false);
    this.signalRIsProcessing = false;
  }

  private sendMessage(action: SignalRActionEnum, data?: any) {
    let model = this.signalRService.createMessageRCWord2Pdf();
    model.Action = action;
    model.Data = data;
    this.signalRService.sendMessage(model);
  }

  private signalRStartSuccessfully(message: SignalRNotifyModel) {
    if (!message.Data || !message.Data.length) return;

    this.signalRIsProcessing = true;
    this.toasterService.pop('success', 'Success', 'Data processing is started');
    this.updateWaitingStatusForRenderPdfItems();
  }

  private signalRStopSuccessfully() {
    if (this.savLetterTemplateComponent)
      this.savLetterTemplateComponent.setShowPreviewIndicator(false);
    this.signalRIsProcessing = false;
  }

  private createQueueAndStart() {
    if (!this.isCallStart) return;

    this.isCallStart = false;
    const items = this.getGeneratePDFSignalRData();
    if (items && items.length) {
      this.sendMessage(SignalRActionEnum.RCWord2Pdf_Start, items);
    }
  }

  private getGeneratePDFSignalRData(): any {
    if (this.isSAVPreview) {
      return this.getSAVPreviewData();
    } else if (this.isSAVWidget) {
      return this.getSAVWidgetData();
    }
    return this.getIdSalesOrdersFromCheckedItems();
  }

  private getIdSalesOrdersFromCheckedItems() {
    return this.showSendLetterDialogData.selectedItems.map((x) => {
      return {
        Mode: null,
        IdSalesOrder: x.IdSalesOrder,
        IdGenerateLetter: this.sendLetterOutputData['IdGenerateLetter'],
        IdBackOfficeLetters: this.sendLetterOutputData['IdBackOfficeLetters'],
        //'DynamicValues': {
        //    'Key': value
        //}
      };
    });
  }

  private getSAVPreviewData() {
    return [
      {
        Mode: 'Test',
        IdSalesOrder: new Date().getTime() + '',
        IdBackOfficeLetters: this.sendLetterOutputData['IdBackOfficeLetters'],
        ListOfIdCountryLanguage:
          this.sendLetterOutputData['ListOfIdCountryLanguage'],
        DataTest: this.getDataTest(),
        //'DynamicValues': {
        //    'Key': value
        //}
      },
    ];
  }

  private getSAVWidgetData() {
    const value = this.getSAVIdConnectionValue();
    return [
      {
        Mode: null,
        IdSalesOrder: value[this.sAVIdConnectionName],
        IdPerson:
          this.sAVIdConnectionName == SAVIdConnectionName.IdPerson
            ? value[this.sAVIdConnectionName]
            : '',
        IdGenerateLetter: this.sendLetterOutputData['IdGenerateLetter'],
        IdBackOfficeLetters: this.sendLetterOutputData['IdBackOfficeLetters'],
        //'DynamicValues': {
        //    'Key': value
        //}
      },
    ];
  }

  private getDataTest() {
    if (!this.isSAVPreview) return null;
    return {
      RelativePath: this.sendLetterOutputData['RelativePath'],
      FileName: this.sendLetterOutputData['FileName'],
      Values: this.sendLetterOutputData['Values'],
    };
  }

  private updateWaitingStatusForRenderPdfItems() {
    if (!this.showSendLetterDialogData) return;

    for (let _item of this.showSendLetterDialogData.selectedItems) {
      let _jsonData = Uti.parseJsonString(_item['Letters']);
      _jsonData['Status'] = 1;
      _item['Letters'] = JSON.stringify(_jsonData);
      this.agGridComponent.updateRowData([_item]);
    }
  }
  // #endregion [Start Stop]
  // endregion [signalR Processing For Send Letter]
  //#endregion [Sav Letter]
  // ==========================================================================================================================================

  //#region [Download/Upload File]
  public showFileUploadPopup = false;
  public acceptExtensionFiles = '*';
  public uploadIdFolder = '';
  public allowSelectDuplicateFile = false;
  public saveFileName = '';
  public singleFile = false;
  public showUploadFile = false;

  public onDownloadFile(rowData: any) {
    this._downloadFileService.makeDownloadFile(
      rowData['MediaRelativePath'] + '\\' + rowData['MediaName'],
      rowData['MediaOriginalName'],
      this.modalService
    );
  }

  public onUploadFile(rowData: any) {
    switch (this.data.idRepWidgetApp) {
      case RepWidgetAppIdEnum.ReportType: {
        this.showUploadFile = true;
        setTimeout(() => {
          this.acceptExtensionFiles = '.xlsx';
          this.singleFile = true;
          this.fileUploadPopupComponent.showFileUploadPopup = true;
          this.uploadIdFolder = rowData['MediaRelativePath'];
          this.saveFileName = rowData['MediaOriginalName'];
        }, 300);
        break;
      }
    }
  }

  public onCompleteUploadItemHandler($event) {
    this.toasterService.pop('success', 'Success', 'File is uploaded.');
  }

  public onCloseUploadPopupHandler($event) {
    this.showUploadFile = false;
    // reset data here
  }

  //#endregion [Download/Upload File]

  //#region [Design Column Layout]

  @ViewChild('widgetFieldBody', { read: ViewContainerRef })
  widgetFieldBody: any;
  private isColumnResizing = false;
  private onColumnResizeEndHandlerTimeout: any;
  public autoScrollUtil;
  public isEditingLayout = false;

  public designColumnsHandler(value) {
    this.isEditingLayout = value;
    if (value) {
      setTimeout(() => {
        this.directiveScroll.scrollToTop();
        this.directiveScroll.scrollToLeft();
      }, 200);
    }
    this.setActiveContextMenuDesignLayout();
  }

  public onColumnResizeEndHandler() {
    this.isColumnResizing = true;
    if (this.onColumnResizeEndHandlerTimeout) {
      clearTimeout(this.onColumnResizeEndHandlerTimeout);
      this.onColumnResizeEndHandlerTimeout = null;
    }
    this.onColumnResizeEndHandlerTimeout = setTimeout(() => {
      this.isColumnResizing = false;
    }, 200);
  }

  public containerMousedown() {
    if (this.autoScrollUtil) {
      this.autoScrollUtil.destroy();
      this.autoScrollUtil = null;
    }
    const that = this;
    this.autoScrollUtil = autoScroll(
      [this.widgetFieldBody.element.nativeElement],
      {
        margin: 10,
        maxSpeed: 6,
        scrollWhenOutside: true,
        autoScroll: function () {
          // Only scroll when the pointer is down.
          return this.down && !that.isColumnResizing;
        },
      }
    );
  }

  public fieldDragEndHandler() {
    if (this.autoScrollUtil) {
      this.autoScrollUtil.destroy();
      this.autoScrollUtil = null;
    }
  }

  public setHiddenForSettingForm(data?: any) {
    if (
      !this.contextMenuData[17] ||
      !this.contextMenuData[17].children ||
      !this.contextMenuData[17].children.length
    ) {
      this.contextMenuService.setMenuData.next({
        obj: this.contextMenuData,
      });
      return;
    }
    this.contextMenuData[17].children[1].hidden = false;
    this.contextMenuData[17].children[2].hidden = false;
    if (data.layoutType === TypeForm.Column) {
      // hidden Panel
      this.contextMenuData[17].children[1].hidden = true;
      // hidden Field
      this.contextMenuData[17].children[2].hidden = true;
    }

    if (data.layoutType === TypeForm.Control) {
      // hidden Panel
      this.contextMenuData[17].children[1].hidden = true;
      this.contextMenuData[17].children[2].hidden = false;
    }

    if (data.layoutType === TypeForm.Panel) {
      const isField = data.children.some(
        (v) => v.layoutType === TypeForm.Control
      );
      this.contextMenuData[17].children[1].hidden = false;
      this.contextMenuData[17].children[2].hidden = !isField;
    }
    this.contextMenuService.setMenuData.next({ obj: this.contextMenuData });
  }

  private setActiveContextMenuDesignLayout() {
    if (!this.contextMenuData || this.contextMenuData.length < 17) return;
    for (let i = 0; i < 14; i++) {
      this.contextMenuData[i].disabled = this.isEditingLayout;
    }
    if (this.contextMenuData[14])
      this.contextMenuData[14].hidden = !this.isEditingLayout;
    if (this.contextMenuData[15])
      this.contextMenuData[15].hidden = !this.isEditingLayout;
    if (this.contextMenuData[16])
      this.contextMenuData[16].hidden = !this.isEditingLayout;
    if (this.contextMenuData[17])
      this.contextMenuData[17].hidden = !this.isEditingLayout;
    // this.enableEditWidgetContextMenu();
  }

  private enableEditWidgetContextMenu() {
    if (
      !this.contextMenuData ||
      !this.contextMenuData.length ||
      !this.contextMenuData[4]
    )
      return;
    // Disable Edit widget form
    this.contextMenuData[4].disabled = this.disableButtonEditWidget;
  }

  private enableEditWidgetContextMenuForGrid(context: Array<any>) {
    for (const item of context) {
      if (item.name !== 'Edit Widget') continue;
      item['disabled'] = this.disableButtonEditWidget;
      return;
    }
  }

  public isChangeColumnLayoutHandler() {
    this.widgetMenuStatusComponent.manageSaveColumnLayoutStatus(true);
    this.widgetFormComponent.makeTemporariesColumnLayoutData();
  }

  public makeTempPropertiesHandler(propertiesData: any) {
    // Call update properties data for separate widget
    this.store.dispatch(
      this.propertyPanelActions.updateTempProperties(
        propertiesData,
        this.currentModule
      )
    );
  }

  public toggleEditingColumnLayoutOfWidgetHandler() {
    this.modalService.unsavedWarningMessageDefault({
      headerText: 'Reset Widget',
      onModalSaveAndExit: this.onColumnLayoutModalSaveAndExit.bind(this),
      onModalExit: this.onColumnLayoutModalExit.bind(this),
    });
  }

  public saveColumnLayoutHandler() {
    // Save setting here
    this.propertiesForSaving.properties = cloneDeep(this.properties);
    this.onChangeFieldFilter.emit({
      widgetDetail: this.data,
    });
    setTimeout(() => {
      this.widgetMenuStatusComponent.toggleAllToolButtons(false);
    }, 300);
  }

  public callRenderScrollHandler() {
    setTimeout(() => {
      if (this.directiveScroll && this.directiveScroll.elementRef) {
        Ps.update(this.directiveScroll.elementRef.nativeElement);
      }
      // this.directiveScroll.update();
    }, 100);
  }

  public onColumnLayoutModalSaveAndExit() {
    this.widgetFormComponent.saveColumnLayout();
  }

  private onColumnLayoutModalExit() {
    this.widgetFormComponent.resetColumnLayout();
    // Call reset properties for separate widget
    this.store.dispatch(
      this.propertyPanelActions.updateTempProperties(
        this.originalProperties,
        this.currentModule
      )
    );
    setTimeout(() => {
      this.widgetMenuStatusComponent.toggleAllToolButtons(false);
    }, 300);
  }

  public saveColumnsLayoutHandle() {
    this.widgetMenuStatusComponent.saveTableSetting();
  }

  public handleDirtySavLetterTemplate(data) {
    setTimeout(() => {
      this.widgetMenuStatusComponent.toggleAllToolButtons(true);
    }, 300);
  }

  //#endregion [Design Column Layout]

  //#region Maximize Widget
  maximizeWidget($event: any) {
    this.isMaximized = $event.isMaximize;
    this.hasJustRestoredFullScreen = !$event.isMaximize;
    this.onMaximizeWidget.emit({
      data: this.data,
      isMaximized: $event.isMaximize,
    });
    this.ref.markForCheck();
    this.ref.detectChanges();
  }

  //#endregion

  //#region [SAV Send Letter]

  private currentIdLinkWidgetComboboxIndex = -1;

  public sendLetterClickHandler() {
    let value = this.getSAVIdConnectionValue();
    if (!value || !value[this.sAVIdConnectionName]) {
      this.modalService.warningText(
        'Modal_Message__Please_Select_Item_To_Generate_PDF'
      );
      return;
    }
    this.showSAVWidgetDialogData = {
      widgetData: this.data,
      data: {
        key: this.sAVIdConnectionName,
        value: value[this.sAVIdConnectionName],
      },
    };
    this.isShowSendLetter = true;
    this.isSAVWidget = true;
    Uti.executeFunctionWithTimeout(
      () => {
        this.sendLetterDialogComponent.callShowSAVWidget(
          this.showSAVWidgetDialogData
        );
      },
      () => {
        return !!this.sendLetterDialogComponent;
      }
    );
  }

  public confirmSendLetterClickHandler() {
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        messageType: MessageModal.MessageType.confirm,
        headerText: 'Confirm Letter',
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Do_You_Want_To_Confirm_This_Letter',
          },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.primary,
        callBack1: () => {
          this.confirmStatusForSendLetter();
        },
      })
    );
  }

  public resetSendLetterStatusClickHandler(data) {
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        messageType: MessageModal.MessageType.confirm,
        headerText: 'Reset Letter',
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Do_You_Want_To_Cancel_This_Running_Process',
          },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.primary,
        callBack1: () => {
          this.resetStatusForSendLetter(data);
        },
      })
    );
  }

  public onIdLinkWidgetComboboxChanged() {
    if (
      this.idLinkWidgetCombobox.isFirstTimeRender &&
      this.currentIdLinkWidgetComboboxIndex ===
        this.idLinkWidgetCombobox.selectedIndex
    )
      return;
    const propSAVListenKey =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.properties,
        'SAVListenKey'
      );
    if (propSAVListenKey.value == this.idLinkWidgetCombobox.selectedValue)
      return;
    if (this.linkedSuccessWidget) {
      this.removeLinkWidget(
        () => {
          this.setValueForSAVListenKey();
        },
        () => {
          this.idLinkWidgetCombobox.selectedIndex =
            this.currentIdLinkWidgetComboboxIndex;
        }
      );
      return;
    }
    this.setValueForSAVListenKey();
  }

  public handleSavSendLetterWidget() {
    setTimeout(() => {
      Uti.executeFunctionWithTimeout(
        () => {
          this.currentIdLinkWidgetComboboxIndex =
            this.idLinkWidgetCombobox.selectedIndex;
        },
        () => {
          return !!this.idLinkWidgetCombobox;
        }
      );
    }, 500);
  }

  /** PRIVATE METHODS */

  private setValueForSAVListenKey() {
    const propSAVListenKey =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.properties,
        'SAVListenKey'
      );
    propSAVListenKey.value = this.idLinkWidgetCombobox.selectedValue;
    this.propertiesForSaving.properties = cloneDeep(this.properties);
    this.currentIdLinkWidgetComboboxIndex =
      this.idLinkWidgetCombobox.selectedIndex;
    this.updateListenKeyForSendLetterWidget();
  }

  private confirmStatusForSendLetter() {
    if (!this.savSendLetterData) return;
    const idGenerateLetter = this.savSendLetterData.IdGenerateLetter;
    this.backOfficeServiceSubscription = this.backOfficeService
      .confirmSalesOrderLetters(idGenerateLetter)
      .subscribe((resultData: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            resultData &&
            resultData.eventType == FormSaveEvenType.Successfully &&
            resultData.returnID
          ) {
            this.toasterService.pop(
              'success',
              'Success',
              'Confirm letter successfully'
            );
            this.savSendLetterData.Status = 3;
            this.reloadWidgets.emit([this.data]);
            this.reloadLinkWidgets.emit(this.data);
          }
        });
      });
  }

  private resetStatusForSendLetter(data) {
    const resetStatusIdGenerateLetter =
      data && JSON.parse(data.Letters).IdGenerateLetter;
    const idGenerateLetter =
      this.savSendLetterData && this.savSendLetterData.IdGenerateLetter
        ? this.savSendLetterData.IdGenerateLetter
        : resetStatusIdGenerateLetter;
    this.backOfficeServiceSubscription = this.backOfficeService
      .resetLetterStatus(idGenerateLetter)
      .subscribe((resultData: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            resultData &&
            resultData.eventType == FormSaveEvenType.Successfully &&
            resultData.returnID
          ) {
            this.toasterService.pop(
              'success',
              'Success',
              'Reset status letter successfully'
            );
            this.savSendLetterData.Status = 0;
            this.reloadLinkWidgets.emit(this.data);
          }
        });
      });
  }

  private updateListenKeyForSendLetterWidget() {
    if (this.data.idRepWidgetType != this.WidgetTypeView.SAVSendLetter) return;
    this.buildIdLinkWidgetList();
    const propSAVListenKey =
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.properties,
        'SAVListenKey'
      );
    const oldPropSAVListenKey = cloneDeep(
      this.propertyPanelService.getItemRecursiveResultNotNull(
        this.propertiesOld,
        'SAVListenKey'
      )
    );
    this.updateNewPropertiesForOldProperties();
    if (
      (propSAVListenKey == oldPropSAVListenKey ||
        propSAVListenKey.value == oldPropSAVListenKey.value) &&
      this.data.widgetDataType.listenKey.key
    ) {
      return;
    }
    this.sAVIdConnectionName = 'NoConnection';
    if (!propSAVListenKey || !propSAVListenKey.value) {
      this.data.widgetDataType.listenKey = new ListenKey({
        key: 'NoConnection',
      });
      return;
    }
    let item = Uti.getValueFromPropertyCombobox(propSAVListenKey);
    this.data.widgetDataType.listenKey.key = item.value || 'NoConnection';
    this.sAVIdConnectionName = this.data.widgetDataType.listenKey.key;
    // this.data.widgetDataType.listenKey = new ListenKey({
    //     key: item.value || 'NoConnection',
    //     // sub: [{
    //     //     key: item.value || 'NoConnection',
    //     //     filterKey: item.value || 'NoConnection'
    //     // }],
    //     // main: {
    //     //     key: item.value || 'NoConnection',
    //     //     filterKey: item.value || 'NoConnection'
    //     // }
    // });
  }

  private buildIdLinkWidgetList() {
    setTimeout(() => {
      const propSAVListenKey =
        this.propertyPanelService.getItemRecursiveResultNotNull(
          this.properties,
          'SAVListenKey'
        );
      if (
        this.idLinkWidgetList &&
        this.idLinkWidgetList.length &&
        propSAVListenKey &&
        propSAVListenKey.value
      )
        return;
      const options: any[] = propSAVListenKey.options || [];
      this.idLinkWidgetList = options.map((x) => {
        return {
          idValue: x.key,
          textValue: x.value,
        };
      });
      this.idLinkWidgetModel = propSAVListenKey.value;
    }, 500);
  }

  private getSAVIdConnectionValue() {
    return (
      this.data.widgetDataType.listenKeyRequest(
        this.currentModule.moduleNameTrim
      ) || {}
    );
  }

  private createSavSendLetterData() {
    if (this.data.idRepWidgetType != this.WidgetTypeView.SAVSendLetter) return;
    let data = (() => {
      try {
        return this.data.contentDetail.data[1] || [];
      } catch (e) {
        return [];
      }
    })();
    if (data.length) {
      data = data.filter((x) => x['PDF']);
    }
    this.savSendLetterData = {};
    if (data.length) {
      this.savSendLetterData = data[0];
    }
    this.savSendLetterData['data'] = data;
  }

  //#endregion [SAV Send Letter]

  public showPrinterFormDialog = false;
  //#region [Print and Confirm]
  public printWidgetClickedHandler() {
    const selectedFile = this.dataSourceTable.data.filter((x) => x.Select);
    if (!selectedFile || !selectedFile.length) {
      this.toasterService.pop(
        'warning',
        'Select File',
        'Please select at least a file to print'
      );
      return;
    }
    this.showPrinterFormDialog = true;
    Uti.executeFunctionWithTimeout(
      () => {
        this.printerFormDialog.open(selectedFile);
      },
      () => {
        return !!this.printerFormDialog;
      }
    );
  }

  public confirmPrintWidgetClickedHandler() {
    const selectedFile = this.dataSourceTable.data.filter((x) => x.Select);
    if (!selectedFile || !selectedFile.length) {
      this.toasterService.pop(
        'warning',
        'Select File',
        'Please select at least a file to confirm'
      );
      return;
    }
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        customClass: 'width-500',
        headerText: 'Confirm Printed Files',
        okText: 'Confirm',
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Do_You_Want_To_Confirm_File_Printed_1',
          },
          { key: '</p>' },
          { key: '<p>' },
          {
            key: 'Modal_Message__Do_You_Want_To_Confirm_File_Printed_2',
          },
          { key: '</p>' },
        ],
        callBack1: () => {
          this.confirmPrintedData();
        },
      })
    );
  }

  public closePrinterFormDialogHandler() {
    this.showPrinterFormDialog = false;
  }

  public printAndConfirmHandler() {
    this.confirmPrintedData();
  }

  private confirmPrintedData() {
    const saveData = {
      ConfirmBackOfficeLettersModels: this.dataSourceTable.data
        .filter((x) => x.Select)
        .map((x) => {
          return {
            IdSalesOrderLetters: x.IdSalesOrderLetters,
          };
        }),
    };
    this._blockedOrderService
      .saveSalesOrderLettersConfirm(saveData)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            this.toasterService.pop('error', 'Failed', 'Data is not confirmed');
            return;
          }
          this.toasterService.pop('success', 'Success', 'Data is confirmed');
          this.printerFormDialog.close();
          this.reloadWidgets.emit([this.data]);
          this.ref.detectChanges();
        });
      });
  }
  //#endregion [Print and Confirm]

  //#region Matching data

  public onCloseMatchingDialog() {
    this.resetForm();
    this.isShowMatchingDataDialog = false;
  }

  public onIgnoreMatchingAndSave() {
    this.saveFormWidget();
    this.isShowMatchingDataDialog = false;
  }

  private makeDataSourceData(rawData: any): Array<any> {
    if (!rawData.item || !rawData.item.length) {
      return [];
    }
    return rawData.item;
  }

  private prepareMatchingData(): any {
    const formValues = this.widgetFormComponent.filterValidFormField();
    const originalValue = this.widgetFormComponent.originalFormValues;

    return {
      firstName:
        formValues.B00SharingName_FirstName ||
        originalValue.B00SharingName_FirstName,
      lastName:
        formValues.B00SharingName_LastName ||
        originalValue.B00SharingName_LastName,
      street:
        formValues.B00SharingAddress_Street ||
        originalValue.B00SharingAddress_Street,
      idRepIsoCountryCode:
        formValues.B00SharingAddress_IdRepIsoCountryCode ||
        originalValue.B00SharingAddress_IdRepIsoCountryCode,
      zip:
        formValues.B00SharingAddress_Zip || originalValue.B00SharingAddress_Zip,
    };
  }

  private checkFieldMatchingDataEdited(): any {
    const formValues = this.widgetFormComponent.filterValidFormField();

    return (
      has(formValues, 'B00SharingName_FirstName') ||
      has(formValues, 'B00SharingName_LastName') ||
      has(formValues, 'B00SharingAddress_Street') ||
      has(formValues, 'B00SharingAddress_IdRepIsoCountryCode') ||
      has(formValues, 'B00SharingAddress_Zip')
    );
  }

  private checkMatchingDataBeforeSaveWidgetData() {
    if (
      !this.checkFieldMatchingDataEdited() ||
      !Configuration.PublicSettings.enableCheckDedupe
    ) {
      this.saveFormWidget();
      return;
    }

    this.commonService
      .matchingCustomerData(this.prepareMatchingData())
      .subscribe(
        (response) => {
          this.appErrorHandler.executeAction(() => {
            const formValues = this.widgetFormComponent.filterValidFormField();

            let data: any = this.makeDataSourceData(response);
            if (!data || !data.length) {
              this.saveFormWidget();
              return;
            }
            data = data.filter(
              (x) => x.IdPerson != formValues.B00Person_IdPerson
            );
            if (!data || !data.length) {
              this.saveFormWidget();
              return;
            }
            this.isShowMatchingDataDialog = true;
            setTimeout(() => {
              if (this.matchingCustomerDataDialog) {
                this.matchingCustomerDataDialog.onShowDialog({ data }, true);
              }
            }, 300);
          });
        },
        (err) => {}
      );
  }
  //#endregion Matching data

  public killProcessClickHandler(event: any) {
    this.modalService.confirmDeleteMessageHtmlContent({
      message: [{ key: 'Modal_Message__Kill_Process' }],
      callBack1: () => {
        const request = event.setting;
        if (!request) return;

        request.IdProcess = event.data.SessionID;

        this._toolsService.callbackSP(request).subscribe(
          (response) => {
            this.toasterService.pop(
              'success',
              'Kill process',
              `Process ${request.IdProcess} is stop`
            );

            this.agGridComponent.deleteRowByRowId(event.data.DT_RowId);
          },
          (error) => {
            this.toasterService.pop(
              'error',
              'Kill process',
              'Kill process failed'
            );
          }
        );
      },
    });
  }

  public shrinkFileClickHandler(event: any) {
    const request = event.setting;
    if (!request) return;

    this._toolsService.callbackSP(request).subscribe(
      (response) => {
        this.toasterService.pop(
          'success',
          'Shrink files',
          `Shrink files succeed`
        );
        this.onRefreshWidget();
      },
      (error) => {
        this.toasterService.pop('error', 'Shrink files', 'Shrink files failed');
      }
    );
  }

  public onSelectCustomerODE(event: any) {
    this.listenKeyValue = event;
    this.disableButtonEditWidget = !event;
  }
}
