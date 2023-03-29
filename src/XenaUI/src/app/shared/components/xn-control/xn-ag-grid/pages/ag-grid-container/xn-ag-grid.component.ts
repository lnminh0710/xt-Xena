import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ControlGridModel,
  GlobalSettingModel,
  Module,
  RowSetting,
  AutoGroupColumnDefModel,
} from 'app/models';
import {
  ColDef,
  Column,
  ColumnApi,
  GridApi,
  GridCell,
  GridOptions,
  NavigateToNextCellParams,
  RowNode,
} from 'ag-grid-community';
import { AgGridService, IAgGridData } from '../../shared/ag-grid.service';
import {
  AccessRightsService,
  AppErrorHandler,
  DatatableService,
  GlobalSettingService,
  PropertyPanelService,
  ResourceTranslationService,
} from 'app/services';
import isEqual from 'lodash-es/isEqual';
import isNil from 'lodash-es/isNil';
import isString from 'lodash-es/isString';
import isBoolean from 'lodash-es/isBoolean';
import isObject from 'lodash-es/isObject';
import mapKeys from 'lodash-es/mapKeys';
import cloneDeep from 'lodash-es/cloneDeep';
import camelCase from 'lodash-es/camelCase';
import isEmpty from 'lodash-es/isEmpty';
import toSafeInteger from 'lodash-es/toSafeInteger';
import max from 'lodash-es/max';
import { ColHeaderKey } from '../../shared/ag-grid-constant';
import 'ag-grid-enterprise';
import {
  ControlCheckboxCellRenderer,
  CountryFlagCellRenderer,
  DetailCellRenderer,
  TemplateButtonCellRenderer,
  TranslationToolPanelRenderer,
} from '../../components';
import { Uti } from 'app/utilities/uti';
import { IPageChangedEvent } from 'app/shared/components/xn-pager/xn-pagination.component';
import {
  AccessRightTypeEnum,
  ColumnVirtualisation,
  DefaultRowHeight,
  CustomCellRender,
  WidgetTableName,
  ArticlesInvoiceQuantity,
} from 'app/app.constants';
import { XnAgGridHeaderComponent } from 'app/shared/components/xn-control/xn-ag-grid/components/xn-ag-grid-header/xn-ag-grid-header.component';
import { AppState } from 'app/state-management/store';
import { Store } from '@ngrx/store';
import { ProcessDataActions } from 'app/state-management/store/actions';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import sortBy from 'lodash-es/sortBy';
import { isNumber } from 'wijmo/wijmo';
import 'jspdf';
import 'jspdf-autotable';
import { ICellRendererComp } from 'ag-grid-community/src/ts/rendering/cellRenderers/iCellRenderer';
import { Subject, Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { GuidHelper } from 'app/utilities/guild.helper';
import { AgGridFakeServer } from 'app/shared/components/xn-control/xn-ag-grid/shared/ag-grid-fakeServer';

declare let jsPDF;

declare const alasql: any;

const BUTTON_COLUMNS = {
  rowColCheckAll: 'rowColCheckAll',
};

const CONTROL_COLUMNS = {
  Priority: 'Priority',
};

let currentRowHeight = DefaultRowHeight.RowHeight;

@Component({
  selector: 'xn-ag-grid',
  templateUrl: './xn-ag-grid.component.html',
  styleUrls: ['./xn-ag-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AgGridService, AgGridFakeServer],
  host: { '(contextmenu)': 'rightClicked($event)' },
})
export class XnAgGridComponent implements OnInit, OnDestroy, AfterViewInit {
  // Core API of Ag Grid
  public api: GridApi;
  public columnApi: ColumnApi;
  public gridOptions: GridOptions;

  // Custom propeties to handle edited items
  public itemsAdded: Array<any> = [];
  public itemsRemoved: Array<any> = [];
  public itemsEdited: Array<any> = [];
  public modeSingleRow: boolean;
  public modeMultiRow: boolean;

  // variable for business logic
  public selectedNode: RowNode;
  public globalDateFormat: string = null;
  public dontShowCalendarWhenFocus: boolean;
  public globalNumberFormat: string = null;
  public pinnedBottomRowData: Array<any>;
  public pinnedTopRowData: Array<any>;
  public sideBar;
  public popupParent;
  public getRowHeight;

  // Used for paging
  public totalResults: number;
  public currentPage = 1;

  private _contextMenuItems: any;
  private isDragging = false;
  private _selectingCell: { rowIndex: number; colDef: ColDef } = {
    rowIndex: -1,
    colDef: null,
  };
  private currentColumnLayoutData: GlobalSettingModel;
  private settingIsAutoSaveLayout: any = {};
  private isStartEditing = false;

  public colResizeDefault: string;
  // public isMasterChecked: boolean = false;
  // public isUnMergeChecked: boolean = false;
  public isMarkedAsDelete = false;
  public hasValidationErrorLocal = false;
  public isSearching = false;
  public priorities: any[] = [];
  public globalProps: any[] = [];
  public isColumnsLayoutChanged = false;
  private _enterMovesDown = true;
  public overlayLoadingTemplate = `<div class="xn-loading"><i class="fa fa-spinner fa-spin"></i></div>`;
  public activeTranslateField: string;
  public overlayNoRowsTemplate: string;
  public localeText = {};
  public currentPageSize: number;
  public currentPageIndex: number = 1;
  public isButtonClicking = false;

  @Input() detailRowHeight = 400;
  @Input() masterDetail: boolean;
  @Input() isArticlesSelected: boolean;
  @Input() rowDetailTemplateRef: TemplateRef<any>;
  // Input
  @Input() set enterMovesDown(enterMovesDown: boolean) {
    this._enterMovesDown = enterMovesDown;
  }
  @Input() isUsedSearchTextboxInside = false;
  @Input() allowAddNew = false;
  @Input() allowDelete = false;
  @Input() allowMediaCode = false;
  @Input() treeViewMode = false;
  @Input() hasRowColCheckAll = false;
  @Input() currentModule: Module;
  @Input() readOnly = true;
  @Input() forceReadOnly = false;
  @Input() hightlightKeywords = '';
  @Input() enableQtyWithColor = false;
  @Input() parentInstance: any = null;
  @Input() allowSetColumnState = true;
  @Input() allowSelectAll = false;
  @Input() isDisableRowWithSelectAll = false;
  @Input() disabledAll = false;
  @Input() set pageSize(_pageSize) {
    this.currentPageSize = _pageSize;
  }

  get pageSize() {
    return this.currentPageSize;
  }
  @Input() set pageIndex(_pageIndex) {
    this.currentPageIndex = _pageIndex;
  }

  get pageIndex() {
    return this.currentPageIndex;
  }
  @Input() paginationFromPopup: any;
  @Input() serverPaging = false;
  @Input() customTooltip: any;
  @Input() autoSelectFirstRow = false;
  @Input() preventAutoSelectFirstRow = false;
  @Input() rowSelection = 'single';
  @Input() sheetName = 'Data Export';
  @Input() redRowOnDelete = false;
  @Input() hasGoToNextColRow = false;
  @Input() selectRowOnRightClick = false;
  @Input() isInWidget;
  @Input() suppressHorizontalScroll;
  @Input() disableCheckBoxWhenInActive = false;
  @Input() isHidden = false;
  @Input() isGlobalSearch = true;
  @Input() isArticleInvoiceHasError: boolean;
  @Input() articleInvoice = false;

  // Used this flag for grid on widget
  @Input() autoSaveColumnsLayout = true;
  @Input() id: string;
  @Input() printId: string;
  @Input() autoCompleteSearchFunc: Function;

  // Default true
  @Input() autoSelectCurrentRowAfterChangingData = true;

  /*Grid Header*/
  @Input() dontShowCheckBoxHeader = false;
  @Input() isShowedHeader = false;
  @Input() hasHeaderBorder = true;
  @Input() headerTitle: string;
  @Input() hasSearch = false;
  @Input() hasFilterBox = false;
  @Input() isShowedEditButtons = false;
  @Input() allowUploadFile = false;
  @Input() canExport = true;
  @Input() hasPriorityColumn = false;
  @Input() headerHeight: number;
  @Input() searchText = '*';
  /*Grid Header*/

  /* Allow Drag */
  @Input() allowDrag = false;
  @Input() customDragContent: any;
  @Input() autoCollapse;

  private _allowTranslation = false;
  @Input() set allowTranslation(status) {
    this._allowTranslation = status;
    this.onAllowTranslationAction.emit(this._allowTranslation);
    //console.log('allowTranslation:' + status);
  }

  get allowTranslation() {
    return this._allowTranslation;
  }

  private fitWidth = false;
  @Input() set fitWidthColumn(fitWidth) {
    if (!isNil(fitWidth)) {
      this.fitWidth = fitWidth;

      this.colResizeDefault = this.fitWidth ? 'shift' : null;

      if (this.columnApi) {
        if (this.fitWidth) {
          this.sizeColumnsToFit();
        } else {
          this.loadColumnLayout();
        }
      }
    }
  }
  @Input() suppressContextMenu = false;

  private _isShowToolPanels = false;
  @Input() set isShowToolPanels(status) {
    this._isShowToolPanels = status;
    if (status) {
      if (this.sideBar) {
        this.showToolPanel(status);
        return;
      } else {
        this.sideBar = this.agGridService.createToolPanelSidebar(false, this);
      }
    }
    this.showToolPanel(status);
  }

  get isShowToolPanels() {
    return this._isShowToolPanels;
  }

  private _columnsLayoutSettings: any;
  @Input() set columnsLayoutSettings(data: any) {
    this._columnsLayoutSettings = data;
  }

  get columnsLayoutSettings() {
    return this._columnsLayoutSettings;
  }

  // Used for translation
  public translateData: any = {};

  @Input() set widgetDetail(data: any) {
    if (data) {
      this.translateData = data;
      this.assignSelectedRowForTranslateData();
    }
  }

  private _isEditting: boolean;
  @Input() set isEditting(status: boolean) {
    this._isEditting = status;
    this.updateHeaderCellEditable(status);

    this.toggleRowColCheckAllColumn();
  }

  get isEditting() {
    return this._isEditting;
  }

  private _gridStyle;
  @Input() set gridStyle(gridStyle: any) {
    this._gridStyle = gridStyle;
    this.updateHeaderStyle();
    this.refresh();
  }

  get gridStyle() {
    return this._gridStyle;
  }

  private _filter: string;
  get filter(): string {
    return this._filter;
  }
  set filter(value: string) {
    if (this._filter !== value) {
      this._filter = value;
      this.applyFilter();
    }
  }

  @Input() showMenuRowGrouping: boolean;

  public rowGroupPanelShow = 'never';
  private _rowGrouping = false;
  @Input() set rowGrouping(rowGrouping: boolean) {
    this._rowGrouping = rowGrouping;
    this.rowGroupPanelShow = 'never';
    if (rowGrouping) {
      this.rowGroupPanelShow = 'always';
    } else {
      if (this.columnApi) {
        const rowGroupCols = this.columnApi.getRowGroupColumns();
        if (rowGroupCols && rowGroupCols.length) {
          const colIds = rowGroupCols.map((p) => p.getColId());
          for (let i = 0; i < colIds.length; i++) {
            this.columnApi.removeRowGroupColumn(colIds[i]);
          }
          this.updateColumnState();
        }
      }
    }
    setTimeout(() => {
      this.toggleRowGroupHeader();
    });
  }

  get rowGrouping() {
    return this._rowGrouping;
  }

  private _pivoting = false;
  @Input() set pivoting(pivoting: boolean) {
    this._pivoting = pivoting;
    if (pivoting) {
      this.sideBar = this.agGridService.createToolPanelSidebar(true, this);
      if (this.columnsLayoutSettings) {
        this.columnsLayoutSettings.isShowToolPanels = true;
      }
      //this.isShowToolPanels = true;
    } else {
      this.sideBar = this.agGridService.createToolPanelSidebar(false, this);
      if (this.columnsLayoutSettings) {
        this.columnsLayoutSettings.isShowToolPanels = false;
      }
      //this.isShowToolPanels = false;
    }
  }
  get pivoting() {
    return this._pivoting;
  }

  private _columnFilter = false;
  @Input() set columnFilter(columnFilter: boolean) {
    this._columnFilter = columnFilter;
    setTimeout(() => {
      if (this.api) {
        this.api.refreshHeader();
      }
    });
  }
  get columnFilter() {
    return this._columnFilter;
  }

  public agGridDataSource: IAgGridData;
  public rowBuffer;
  @Input() set dataSource(data: ControlGridModel) {
    if (!data) return;
    this.onDataChange.emit(data);

    const config = {
      allowDelete: this.allowDelete,
      allowMediaCode: this.allowMediaCode,
      allowSelectAll: this.allowSelectAll,
      treeViewMode: this.treeViewMode,
      readOnly: this.readOnly,
      hasRowColCheckAll: this.hasRowColCheckAll,
      masterDetail: this.masterDetail,
      allowTranslation: this.allowTranslation,
    };
    this.agGridDataSource = this.agGridService.mapDataSource(data, config);

    if (data.totalResults) {
      this.totalResults = data.totalResults;
    }

    const isColumnsChanged =
      !this.gridOptions ||
      this._isColumnsChanged(
        this.gridOptions.columnDefs,
        this.agGridDataSource.columnDefs,
        'field'
      );
    if (isColumnsChanged) {
      this.initGrid();
      this.gridOptions.columnDefs = this.agGridDataSource.columnDefs;
    } else {
      this.initGrid(false);
    }

    this.gridOptions.rowData = this.agGridDataSource.rowData;
    this.gridOptions.getRowStyle = this.getRowStyle.bind(this);
    // this.gridOptions.overlayNoRowsTemplate = this.getDataNoEntryTemplate();
    this.gridOptions.frameworkComponents = {
      translationToolPanelRenderer: TranslationToolPanelRenderer,
      templateDetailCellRenderer: DetailCellRenderer,
    };

    this.gridOptions.navigateToNextCell =
      this.navigateToNextCellFunc.bind(this);
    this.gridOptions.processCellForClipboard =
      this.processCellForClipboard.bind(this);

    this.gridOptions.rowClassRules = {
      'deleted-row-text': function (params) {
        return (
          params.node.data && params.node.data[ColHeaderKey.IsDeleted] == true
        );
      },
      'in-active-cell': function (params) {
        const inactiveRowWithIsActive =
          params.node.data &&
          (params.node.data[ColHeaderKey.IsActive] === false ||
            params.node.data[ColHeaderKey.IsActive] === null ||
            params.node.data[ColHeaderKey.IsActive] === 0 ||
            params.node.data[ColHeaderKey.IsActiveDisableRow] == false ||
            params.node.data[ColHeaderKey.IsActiveDisableRow] == 0);
        const inactiveRowWithSelectAll =
          params.node.data &&
          params.isDisableRowWithSelectAll &&
          (params.node.data[ColHeaderKey.SelectAll] == false ||
            params.node.data[ColHeaderKey.SelectAll] == 0);
        const setting =
          params.context.componentParent.agGridService.inactiveRowByColValueSetting(
            params
          );
        return (
          inactiveRowWithIsActive ||
          inactiveRowWithSelectAll ||
          setting.inactiveRowByValueSetting
        );
      },
      'background-status-red': function (params) {
        return (
          params.node.data &&
          params.node.data[ColHeaderKey.BorderStatus] == true
        );
      },
      'master-background': function (params) {
        return (
          params.node.data &&
          params.node.data[ColHeaderKey.MasterCheckbox] == true
        );
      },
      'master-detail-hide': function (params) {
        return (
          params.node.data &&
          params.node.data.hasOwnProperty(ColHeaderKey.MatchingText) &&
          (params.node.data[ColHeaderKey.MatchingText] != 'Master' ||
            !params.node.data[ColHeaderKey.MatchingGroup])
        );
      },
    };

    // When chaging new datasource, we need to remove all data rows of previous datasource.
    this.removeAllRowNodes();

    if (this.showTotalRow) {
      this.calculatePinnedRowBottomData(this.showTotalRow);
    }

    // Tree view
    if (this.treeViewMode) {
      this.buildTreeViewAutoGroupColumnDef(data);
    } else {
      // Grouping feature
      this._buildGroupByColumn(this.gridOptions.columnDefs);
    }

    this.initServerSideDatasource();
    setTimeout(() => {
      this.callRefreshErrorForGrid();
      if (!this.gridOptions || !this.gridOptions.rowData) return;

      this.setGridOption();

      if (!this.gridOptions.rowData.length && !!this.parentInstance) {
        this.rowClick.emit(
          this.agGridService.createEmptyRowClickData(
            this.gridOptions.columnDefs
          )
        );
      }

      if (this.fitWidth) {
        if (isColumnsChanged) {
          this.sizeColumnsToFit();
        }
      } else {
        this.loadColumnLayout();
      }

      this.autoSelectRow();
      this.updateHeaderStyle();

      if (isColumnsChanged && this.api) {
        this.filter = null;
      }

      this.toggleRowColCheckAllColumn();

      if (this.hasPriorityColumn) {
        this.initPriorityList();
      }
      this.onDataChanged.emit(data);
    });
  }

  @Input() set globalProperties(globalProperties: any[]) {
    this.globalProps = globalProperties;
    const globalDateFormat =
      this.propertyPanelService.buildGlobalDateFormatFromProperties(
        globalProperties
      );
    const globalNumberFormat =
      this.propertyPanelService.buildGlobalNumberFormatFromProperties(
        globalProperties
      );
    this.settingIsAutoSaveLayout =
      this.propertyPanelService.getItemRecursive(
        globalProperties,
        'AutoSaveLayout'
      ) || {};
    this.dontShowCalendarWhenFocus =
      this.propertyPanelService.getValueDropdownFromGlobalProperties(
        globalProperties
      );
    if (
      this.globalDateFormat != globalDateFormat ||
      this.globalNumberFormat != globalNumberFormat
    ) {
      this.globalDateFormat = globalDateFormat;
      this.globalNumberFormat = globalNumberFormat;
      this.refresh();
    }
  }

  @Input() widgetProperties: any[] = [];
  public isSortChanged = false;

  private _isActivated = true;
  @Input() set isActivated(status: boolean) {
    this._isActivated = status;
    if (!status) {
      this.ref.detach();
    } else {
      this.ref.reattach();
    }
  }

  get isActivated() {
    return this._isActivated;
  }

  private _showTotalRow: RowSetting;

  @Input() set showTotalRow(showTotalRow: RowSetting) {
    this._showTotalRow = showTotalRow;
    if (showTotalRow) {
      this.calculatePinnedRowBottomData(showTotalRow);
    } else {
      this.pinnedBottomRowData = [];
      this.pinnedTopRowData = [];
    }
  }

  private _borderRow: any;
  @Input() set borderRow(data: any) {
    this._borderRow = data;
  }

  private _rowBackground: boolean;
  @Input() set rowBackground(value: boolean) {
    this._rowBackground = value;
    this.refresh();
  }

  private _rowBackgroundGlobal: any;
  @Input() set rowBackgroundGlobal(value: any) {
    this._rowBackgroundGlobal = value;
    this.refresh();
  }

  private _backgroundColor: string;
  @Input() set background(backgroundColor: string) {
    backgroundColor = backgroundColor || '';
    this.setBackgroundForElement('.ag-body-viewport', backgroundColor);
    // $('.ag-header', this._eref.nativeElement).css('background-color', backgroundColor);
    // $('.ag-body-viewport', this._eref.nativeElement).css('background-color', backgroundColor);
    // $('.ag-row', this._eref.nativeElement).css('background-color', backgroundColor);
    this._backgroundColor = backgroundColor;
  }

  private _backgroundImage: string;
  @Input() set backgroundImage(backgroundImage: any) {
    if (!backgroundImage) return;
    this.setBackgroundImageForElement('.ag-body-viewport', backgroundImage);
    this._backgroundImage = backgroundImage;
  }

  get showTotalRow() {
    return this._showTotalRow;
  }

  @Input() set setDeselectAll(deselectAll: boolean) {
    if (this.api && deselectAll) {
      this.api.deselectAll();
      this.api.clearFocusedCell();
    }
  }

  @ViewChild('agGrid', { read: ViewContainerRef })
  public agGridViewContainerRef;
  @ViewChild('xnAgGridHeader') xnAgGridHeader: XnAgGridHeaderComponent;

  @Output() rowRightClicked = new EventEmitter<any>();
  @Output() rowDoubleClicked = new EventEmitter<any>();
  @Output() rowEditingStarted = new EventEmitter<any>();
  @Output() rowEditingStopped = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() cellEditingStarted = new EventEmitter<any>();
  @Output() cellEditingStopped = new EventEmitter<any>();
  @Output() cellEditting = new EventEmitter<any>();
  @Output() cellValueChanged = new EventEmitter<any>();
  @Output() buttonAndCheckboxValueChanged = new EventEmitter<any>();
  @Output() onRowMarkedAsDelete = new EventEmitter<any>();
  @Output() onDeleteChecked = new EventEmitter<any>();
  @Output() hasValidationError = new EventEmitter<any>();
  @Output() mediacodeClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() sendLetterClick = new EventEmitter<any>();
  @Output() buttonAndCheckboxClick = new EventEmitter<any>();
  @Output() resetStatusSendLetter = new EventEmitter<any>();
  @Output() unblockClick = new EventEmitter<any>();
  @Output() startStopClick = new EventEmitter<any>();
  @Output() runClick = new EventEmitter<any>();
  @Output() downloadClick = new EventEmitter<any>();
  @Output() previewClick = new EventEmitter<any>();
  @Output() uploadClick = new EventEmitter<any>();
  @Output() settingClick = new EventEmitter<any>();
  @Output() pdfClick = new EventEmitter<any>();
  @Output() editRowClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();
  @Output() runScheduleClick = new EventEmitter<any>();
  @Output() killProcessClick = new EventEmitter<any>();
  @Output() shrinkFileClick = new EventEmitter<any>();
  @Output() filterExtendedClick = new EventEmitter<any>();
  @Output() changeColumnLayout = new EventEmitter<any>();
  @Output() onMarkedAsSelectedAll = new EventEmitter<any>();
  @Output() onSelectedAllChecked = new EventEmitter<any>();
  @Output() cellContextMenuAction = new EventEmitter<any>();
  @Output() onTableSearch = new EventEmitter<any>();
  @Output() onUploadClick = new EventEmitter<any>();
  @Output() pageChanged = new EventEmitter<IPageChangedEvent>();
  @Output() pageNumberChanged = new EventEmitter<number>();
  @Output() onDeletedRows = new EventEmitter<boolean>();
  @Output() keyDown = new EventEmitter<any>();
  @Output() onCheckAllChecked = new EventEmitter<any>();
  @Output() onDataChange = new EventEmitter<any>();
  @Output() onDataChanged = new EventEmitter<any>();
  @Output() onPriorityEditEnded = new EventEmitter<any>();
  @Output() saveColumnsLayoutAction = new EventEmitter<any>();
  @Output() onAutoCompleteCellChanged = new EventEmitter<any>();
  @Output() onChangeColumnLayoutMasterDetail = new EventEmitter<any>();
  @Output() onTranslateColDetail = new EventEmitter<any>();
  @Output() onDataAction = new EventEmitter<any>();
  @Output() onGridReady = new EventEmitter<any>();
  @Output() onActionTranslateDialog = new EventEmitter<boolean>();
  @Output() onRowGroupPanel = new EventEmitter<any>();
  @Output() onAllowTranslationAction = new EventEmitter<any>();
  @Output() onQuantityArticleInvoice = new EventEmitter<any>();
  @Output() rowClickedAction = new EventEmitter<any>();

  private rowGroupPanel = true;
  //Don't remove it
  private detailCellRenderer;
  private bodyScrollChanged = new Subject<boolean>();
  private bodyScrollChangedSubscription: Subscription;
  private successSavedSubscription: Subscription;

  constructor(
    private _eref: ElementRef,
    private agGridService: AgGridService,
    private ref: ChangeDetectorRef,
    private datatableService: DatatableService,
    private propertyPanelService: PropertyPanelService,
    private processDataActions: ProcessDataActions,
    private store: Store<AppState>,
    private renderer: Renderer,
    private accessRightService: AccessRightsService,
    private _globalSettingService: GlobalSettingService,
    private _toasterService: ToasterService,
    private resourceTranslationService: ResourceTranslationService,
    private translateService: TranslateService,
    private _appErrorHandler: AppErrorHandler,
    private agGridFakeServer: AgGridFakeServer,
    @Inject(DOCUMENT) private document: Document,
    private uti: Uti
  ) {
    this.detailCellRenderer = 'templateDetailCellRenderer';
    this.rowBuffer = 0;

    this.getRowHeight = () => {
      return currentRowHeight;
    };
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.buildContextMenuItems = this.buildContextMenuItems.bind(this);
    this.popupParent = document.querySelector('body');

    this.bodyScrollChangedSubscription = this.bodyScrollChanged
      .debounceTime(250)
      .subscribe(() => {
        this.ref.detectChanges();
      });

    this.successSavedSubscription =
      this.resourceTranslationService.successSaved$.subscribe((status) => {
        this.initLocalText();
        this.ref.detectChanges();
      });
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    if (this.gridOptions) {
      this.gridOptions.columnDefs = null;
      this.gridOptions.rowData = null;
      this.gridOptions = null;
    }
    if (this.api) {
      this.api.destroy();
    }

    $('.ag-body-viewport', this._eref.nativeElement).unbind('scroll');
    Uti.unsubscribe(this);
  }

  get hostElement() {
    if (this._eref) {
      return this._eref.nativeElement;
    }
    return null;
  }

  /**
   * ngAfterViewInit
   */
  public ngAfterViewInit() {
    setTimeout(() => {
      if (
        this.agGridViewContainerRef &&
        this.agGridViewContainerRef.element.nativeElement
      ) {
        this.agGridViewContainerRef.element.nativeElement.addEventListener(
          'keydown',
          this.onGridKeydown.bind(this)
        );
      }
    });
    this.initLocalText();
  }

  public initLocalText() {
    this.localeText = this.agGridService.initLocalText();
    if (this.api) {
      const rowCount = this.api.getDisplayedRowCount();
      if (!rowCount) {
        // To refresh new value for no row text
        setTimeout(() => {
          this.api.showNoRowsOverlay();
        });
      }
    }
  }

  //private getDataNoEntryTemplate() {
  //    this.overlayNoRowsTemplate = '<span class="no-entry-data-block"><label-translation keyword="No_Entry_Data">' + this.translateService.instant('No_Entry_Data') + '</label-translation></span>';
  //    return this.overlayNoRowsTemplate;
  //}

  public doSearch(text: string) {
    this.xnAgGridHeader.doSearch(text);
  }

  public setFocusedCell(
    rowNumber: number,
    columnName: string,
    isStartEdit?: boolean
  ) {
    if (isStartEdit && !this.disabledAll) {
      this.api.startEditingCell({
        rowIndex: rowNumber,
        colKey: columnName,
      });
      return;
    }
    this.api.setFocusedCell(rowNumber, columnName);
  }

  /**
   * onGridKeydown
   * @param evt
   */
  private onGridKeydown(evt) {
    if (evt.key === 'Enter') {
      if (!this._enterMovesDown) {
        this.api.stopEditing();

        if (this.readOnly) {
          this.api.tabToNextCell();

          // Logic focused cell in Articles Invoice
          const currentFocusedCellArticle = this.api.getFocusedCell();
          const selectedNodesArticle = this.api.getSelectedNodes();
          if (
            this.articleInvoice &&
            currentFocusedCellArticle &&
            selectedNodesArticle &&
            selectedNodesArticle.length &&
            selectedNodesArticle[0].rowIndex !=
              currentFocusedCellArticle.rowIndex
          ) {
            const currentNode = this.api.getDisplayedRowAtIndex(
              currentFocusedCellArticle.rowIndex
            );
            if (currentNode && !currentNode.data.IsActive) {
              this.api.setFocusedCell(
                currentFocusedCellArticle.rowIndex + 1,
                ArticlesInvoiceQuantity.QtyKeep
              );
              return;
            }
            this.api.setFocusedCell(
              currentFocusedCellArticle.rowIndex,
              ArticlesInvoiceQuantity.QtyKeep
            );
          }
        } else {
          const nextEditableCell = this.getNextEditableCell(
            this.api.getFocusedCell()
          );
          if (nextEditableCell) {
            this.api.clearFocusedCell();
            this.api.setFocusedCell(
              nextEditableCell.row,
              nextEditableCell.col.getColId()
            );
          } else {
            this.api.tabToNextCell();
          }
        }
      } else {
        const currentCell = this.api.getFocusedCell();
        const finalRowIndex = this.api.paginationGetRowCount() - 1;
        if (currentCell) {
          // If we are editing the last row in the grid, don't move to next line
          if (currentCell.rowIndex === finalRowIndex) {
            return;
          }
          this.api.stopEditing();
          this.api.clearFocusedCell();

          this.api.setFocusedCell(
            currentCell.rowIndex + 1,
            currentCell.column.getColId()
          );
        }
      }
      const currentFocusedCell = this.api.getFocusedCell();
      const selectedNodes = this.api.getSelectedNodes();

      // Logic focused cell in Articles Invoice
      if (
        this._enterMovesDown &&
        this.articleInvoice &&
        currentFocusedCell &&
        selectedNodes &&
        selectedNodes.length &&
        selectedNodes[0].rowIndex != currentFocusedCell.rowIndex
      ) {
        const currentNode = this.api.getDisplayedRowAtIndex(
          currentFocusedCell.rowIndex
        );
        if (currentNode && !currentNode.data.IsActive) {
          this.api.setFocusedCell(
            currentFocusedCell.rowIndex + 1,
            currentFocusedCell.column.getColId()
          );
          return;
        }
        return this.api.setFocusedCell(
          currentFocusedCell.rowIndex,
          currentFocusedCell.column.getColId()
        );
      }

      if (currentFocusedCell && selectedNodes && selectedNodes.length) {
        if (selectedNodes[0].rowIndex != currentFocusedCell.rowIndex) {
          this.selectRowIndex(currentFocusedCell.rowIndex);
        }
      }
    }

    if (evt.code === 'Space') {
      const currentCell = this.api.getFocusedCell();
      const colDef = currentCell.column.getColDef();

      if (
        (colDef.cellRendererFramework &&
          colDef.cellRendererFramework.name ===
            'ControlCheckboxCellRenderer') ||
        (colDef.refData && colDef.refData.controlType === 'Checkbox')
      ) {
        const matCheckboxElm = evt.target.querySelector('mat-checkbox');
        if (
          matCheckboxElm &&
          !matCheckboxElm.classList.contains('mat-checkbox-disabled') &&
          (colDef.field == ColHeaderKey.Delete ||
            colDef.field == ColHeaderKey.SelectAll ||
            (colDef.refData && colDef.refData.controlType == 'Checkbox'))
        ) {
          const rowNode = this.api.getDisplayedRowAtIndex(currentCell.rowIndex);

          rowNode.data[colDef.field] = !rowNode.data[colDef.field];
          this.api.updateRowData({ update: [rowNode.data] });

          evt.stopPropagation();
        }
      } else if (
        (colDef.cellRendererFramework &&
          colDef.cellRendererFramework.name === 'TemplateButtonCellRenderer') ||
        (colDef.refData && colDef.refData.controlType === 'Button')
      ) {
        const buttonElm = evt.target.querySelector('button');
        if (buttonElm) {
          buttonElm.click();
          evt.stopPropagation();
        }
      }
    }

    this.keyDown.emit(evt);
    this.outputWhenDataChange(evt.keyCode);
  }

  private outputWhenDataChange(keycode: any) {
    if (
      !this.isStartEditing ||
      !(
        (
          (keycode > 47 && keycode < 58) || // number keys
          keycode == 32 ||
          keycode == 46 ||
          keycode == 8 || // spacebar & return key(s) (if you want to allow carriage returns)
          (keycode > 64 && keycode < 91) || // letter keys
          (keycode > 95 && keycode < 112) || // numpad keys
          (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
          (keycode > 218 && keycode < 223)
        ) // [\]' (in order)
      )
    )
      return;
    this.cellEditting.emit();
  }

  private getNextEditableCell(currentCell: GridCell) {
    const allCols = this.columnApi.getAllGridColumns();

    if (!allCols.filter((x) => x.getColDef().editable === true).length) {
      return null;
    }

    const allColsWithIndex = allCols.map((col, index) => {
      return {
        col,
        editable: col.getColDef().editable,
        index,
      };
    });

    const returnNextRow = () => {
      if (
        currentCell.rowIndex + 1 === this.gridOptions.rowData.length ||
        !allColsWithIndex.find(
          (x) => x.editable === true && x.col.getColDef().hide === false
        )
      ) {
        return null;
      } else {
        return {
          row: currentCell.rowIndex + 1,
          col: allColsWithIndex.find(
            (x) => x.editable === true && x.col.getColDef().hide === false
          ).col,
        };
      }
    };

    if (currentCell && currentCell.column) {
      const currentCellColIndex = allCols.findIndex(
        (x) => x.getColId() === currentCell.column.getColId()
      );

      if (currentCellColIndex === allColsWithIndex.length - 1) {
        returnNextRow();
      } else {
        const nextCol = allColsWithIndex.find(
          (x) =>
            x.index > currentCellColIndex &&
            x.editable === true &&
            x.col.getColDef().hide === false
        );
        if (nextCol) {
          return {
            row: currentCell.rowIndex,
            col: nextCol.col,
          };
        } else {
          returnNextRow();
        }
      }
    }
  }

  /**
   * initGrid
   * */
  private initGrid(resetGridOptions = true) {
    if (resetGridOptions) {
      if (this.gridOptions) {
        this.gridOptions = null;
      }
      this.gridOptions = <GridOptions>{
        onFirstDataRendered: (params) => {
          // params.api.sizeColumnsToFit();
          this.updateHeaderCellEditable(this.isEditting);
        },
        context: {
          componentParent: this,
        },
      };
    }

    this.itemsAdded = [];
    this.itemsRemoved = [];
    this.itemsEdited = [];
  }

  /**
   * getRowStyle
   * @param params
   */
  private getRowStyle(params?: any) {
    const backgroundTotalRow =
      this.showTotalRow && this.showTotalRow.backgroundTotalRow;
    const textColor = this.showTotalRow && this.showTotalRow.colorTextTotalRow;
    let rowPinnedStyle = {};
    let cellStyle = {};
    if (params.node.rowPinned) {
      rowPinnedStyle = {
        'background-color': backgroundTotalRow ? backgroundTotalRow : '',
        color: `${textColor} !important` ? `${textColor} !important` : '',
        'border-top': 'solid #d6d6d6 1px',
        'border-bottom': 'solid #d6d6d6 1px',
        'font-weight': 'bold',
      };
    }
    const gridStyle = this.gridStyle;
    const gradient =
      this._backgroundColor && this._backgroundColor.includes('rgb');
    let backgroundTable: string;
    if (gridStyle && gridStyle.rowStyle && !isEmpty(gridStyle.rowStyle)) {
      const isRowBorderGroundWidget =
        this._rowBackground && this._borderRow ? this._borderRow : '';
      // Have backgroundColor and is Gradient Color or background Image
      if ((this._backgroundColor && gradient) || this._backgroundImage) {
        backgroundTable = 'transparent';
      }
      if (this._backgroundColor && !gradient) {
        backgroundTable = this._backgroundColor;
      }

      if (
        !this._backgroundColor &&
        !gridStyle.rowStyle &&
        !this._backgroundImage
      ) {
        backgroundTable = '#f7f8f9';
      }
      // Have odd or even Color
      if (gridStyle && gridStyle.rowStyle['oddRow'] && this._rowBackground) {
        backgroundTable = gridStyle.rowStyle['oddRow'];
      }

      if (
        this._rowBackgroundGlobal &&
        this._rowBackgroundGlobal['oddRow'] &&
        !this._rowBackground
      ) {
        backgroundTable = this._rowBackgroundGlobal['oddRow'];
      }
      const rowBorderGlobal =
        this._rowBackgroundGlobal && this._rowBackgroundGlobal['borderRow']
          ? this._rowBackgroundGlobal['borderRow']
          : '';
      if (this.articleInvoice) {
        const data = params.node && params.node.data;
        if (data.IsMainArticle === 1 && !data.IsSetArticle) {
          cellStyle = {
            background: '#a4d8ab8a !important',
            color: gridStyle.rowStyle['color'],
            fontFamily: gridStyle.rowStyle['font-family'] || 'Tahoma',
            fontSize: gridStyle.rowStyle['font-size'],
            fontWeight: gridStyle.rowStyle['font-weight'],
            fontStyle: gridStyle.rowStyle['font-style'],
            textDecoration: gridStyle.rowStyle['text-decoration'],
          };
        }
        if (data.IsMainArticle === 0 && !data.IsSetArticle) {
          cellStyle = {
            background: '#f7f8f9 !important',
            color: gridStyle.rowStyle['color'],
            fontFamily: gridStyle.rowStyle['font-family'] || 'Tahoma',
            fontSize: gridStyle.rowStyle['font-size'],
            fontWeight: gridStyle.rowStyle['font-weight'],
            fontStyle: gridStyle.rowStyle['font-style'],
            textDecoration: gridStyle.rowStyle['text-decoration'],
          };
        }
        if (data.ParentIdSalesOrderArticles) {
          cellStyle = {
            background: '#f7d28038 !important',
            color: gridStyle.rowStyle['color'],
            fontFamily: gridStyle.rowStyle['font-family'] || 'Tahoma',
            fontSize: gridStyle.rowStyle['font-size'],
            fontWeight: gridStyle.rowStyle['font-weight'],
            fontStyle: gridStyle.rowStyle['font-style'],
            textDecoration: gridStyle.rowStyle['text-decoration'],
          };
        }
        if (data.IsSetArticle) {
          cellStyle = {
            background: '#f7d28063 !important',
            color: gridStyle.rowStyle['color'],
            fontFamily: gridStyle.rowStyle['font-family'] || 'Tahoma',
            fontSize: gridStyle.rowStyle['font-size'],
            fontWeight: gridStyle.rowStyle['font-weight'],
            fontStyle: gridStyle.rowStyle['font-style'],
            textDecoration: gridStyle.rowStyle['text-decoration'],
          };
        }
      }
      if (!this.articleInvoice && Uti.getNumberOdd(params.node.rowIndex)) {
        cellStyle = {
          background: backgroundTable,
          'border-color': this._rowBackground
            ? isRowBorderGroundWidget
            : rowBorderGlobal,
          color: gridStyle.rowStyle['color'],
          fontFamily: gridStyle.rowStyle['font-family'] || 'Tahoma',
          fontSize: gridStyle.rowStyle['font-size'],
          fontWeight: gridStyle.rowStyle['font-weight'],
          fontStyle: gridStyle.rowStyle['font-style'],
          textDecoration: gridStyle.rowStyle['text-decoration'],
        };
      }
      if (!this.articleInvoice && !Uti.getNumberOdd(params.node.rowIndex)) {
        let evenRowColor: string;
        // Have odd or even Color and Row BackGround turn on in Widget properties
        if (
          gridStyle.rowStyle &&
          gridStyle.rowStyle['evenRow'] &&
          this._rowBackground
        ) {
          evenRowColor = gridStyle.rowStyle['evenRow'];
        }

        if (
          this._rowBackgroundGlobal &&
          this._rowBackgroundGlobal['evenRow'] &&
          !this._rowBackground
        ) {
          evenRowColor = this._rowBackgroundGlobal['evenRow'];
        }
        cellStyle = {
          background: evenRowColor ? evenRowColor : 'transparent',
          'border-color': this._rowBackground
            ? isRowBorderGroundWidget
            : rowBorderGlobal,
          color: gridStyle.rowStyle['color'],
          fontFamily: gridStyle.rowStyle['font-family'] || 'Tahoma',
          fontSize: gridStyle.rowStyle['font-size'],
          fontWeight: gridStyle.rowStyle['font-weight'],
          fontStyle: gridStyle.rowStyle['font-style'],
          textDecoration: gridStyle.rowStyle['text-decoration'],
        };
      }
    }
    return Object.assign(cellStyle, rowPinnedStyle);
  }

  /**
   * updateHeaderStyle
   **/
  private updateHeaderStyle() {
    const gridStyle = this.gridStyle;
    if (gridStyle && gridStyle.headerStyle) {
      if (
        this.agGridViewContainerRef &&
        this.agGridViewContainerRef.element &&
        this.agGridViewContainerRef.element.nativeElement
      ) {
        const headerRow =
          this.agGridViewContainerRef.element.nativeElement.querySelector(
            '.ag-header-container .ag-header-row'
          );
        const headerPinnedLeft =
          this.agGridViewContainerRef.element.nativeElement.querySelector(
            '.ag-pinned-left-header .ag-header-row'
          );
        const headerPinnedRight =
          this.agGridViewContainerRef.element.nativeElement.querySelector(
            '.ag-pinned-right-header .ag-header-row'
          );

        if (headerRow || headerPinnedLeft || headerPinnedRight) {
          this.setElementStyleForHeader(headerRow, gridStyle);
          this.setElementStyleForHeader(headerPinnedLeft, gridStyle);
          this.setElementStyleForHeader(headerPinnedRight, gridStyle);
          const headerCellTextElms = headerRow.querySelectorAll(
            '.ag-header-cell-text'
          );
          const headerCellTextLeftElms = headerPinnedLeft.querySelectorAll(
            '.ag-header-cell-text'
          );
          const headerCellTextRightElms = headerPinnedRight.querySelectorAll(
            '.ag-header-cell-text'
          );
          if (headerCellTextElms.length) {
            headerCellTextElms.forEach((elm) => {
              this.renderer.setElementStyle(
                elm,
                'textDecoration',
                gridStyle.headerStyle['text-decoration']
              );
            });
          }
          if (headerCellTextLeftElms.length) {
            headerCellTextLeftElms.forEach((elm) => {
              this.renderer.setElementStyle(
                elm,
                'textDecoration',
                gridStyle.headerStyle['text-decoration']
              );
            });
          }
          if (headerCellTextRightElms.length) {
            $(
              '.ag-body-viewport-wrapper .ag-body-viewport.ag-layout-normal',
              this._eref.nativeElement
            ).css({ 'margin-right': '-17px' });
            headerCellTextRightElms.forEach((elm) => {
              this.renderer.setElementStyle(
                elm,
                'textDecoration',
                gridStyle.headerStyle['text-decoration']
              );
            });
          }
        }
      }
    }
  }

  private setElementStyleForHeader(headerName, gridStyle) {
    this.renderer.setElementStyle(
      headerName,
      'color',
      gridStyle.headerStyle['color']
    );
    this.renderer.setElementStyle(
      headerName,
      'fontFamily',
      gridStyle.headerStyle['font-family']
    );
    this.renderer.setElementStyle(
      headerName,
      'fontSize',
      gridStyle.headerStyle['font-size']
    );
    this.renderer.setElementStyle(
      headerName,
      'fontWeight',
      gridStyle.headerStyle['font-weight']
    );
    this.renderer.setElementStyle(
      headerName,
      'fontStyle',
      gridStyle.headerStyle['font-style']
    );
    this.renderer.setElementStyle(
      headerName,
      'textDecoration',
      gridStyle.headerStyle['text-decoration']
    );
  }

  /**
   * updateHeaderCellEditable
   **/
  public updateHeaderCellEditable(isEditing) {
    if (this.allowTranslation) {
      return;
    }
    if (
      this.agGridViewContainerRef &&
      this.agGridViewContainerRef.element &&
      this.agGridViewContainerRef.element.nativeElement
    ) {
      const headerCells: Array<any> =
        this.agGridViewContainerRef.element.nativeElement.querySelectorAll(
          '.ag-header-container .ag-header-row .ag-header-cell'
        );
      if (headerCells) {
        headerCells.forEach((headerCell) => {
          this.renderer.setElementClass(headerCell, 'editing', isEditing);
        });
      }
    }
  }

  /**
   * onReady
   * @param params
   */
  public onReady(params) {
    this.api = params.api;
    this.columnApi = params.columnApi;

    this.loadDataForColumnsLayout();
    this.showToolPanel(this.isShowToolPanels);
    this.updateHeaderStyle();
    if (this.allowDrag) {
      this.initDragDropHandler();
    }
    this.scrollDetailGridFollowMasterGrid();

    this.initServerSideDatasource();
    this.onGridReady.emit(this.api);

    // Assumption after 2 second the grid is rendered.
    setTimeout(() => {
      this.autoSelectRow();
      this.agGridService['isGridRendered'] = true;
    }, 2000);
  }

  private scrollDetailGridFollowMasterGrid() {
    if (this.masterDetail) {
      $('.ag-pinned-left-cols-viewport', this._eref.nativeElement).css({
        'overflow-y': 'hidden',
      });
      $('.ag-body-viewport', this._eref.nativeElement).bind(
        'scroll',
        function (e) {
          $(this)
            .closest('.ag-root')
            .find('.grid-master-detail .ag-body-viewport')
            .scrollLeft(e.currentTarget.scrollLeft);
        }
      );
    }
  }

  public resetScrollMasterGrid() {
    if (this.masterDetail) {
      const $viewport = $('.ag-body-viewport', this._eref.nativeElement);
      let scrollLeft = $viewport.scrollLeft();
      scrollLeft = scrollLeft > 0 ? scrollLeft - 1 : 0;
      $viewport.scrollLeft(scrollLeft);
    }
  }

  /**
   * columnVisible
   **/
  public columnVisible($event) {
    this.updateColumnState($event);
  }

  /**
   * sizeColumnsToFit
   **/
  public sizeColumnsToFit() {
    setTimeout(() => {
      if (this.api) {
        this.api.sizeColumnsToFit();
      }
    }, 200);
  }

  /**
   * onRowDoubleClicked
   * */
  public onRowDoubleClicked(params) {
    this.rowDoubleClicked.emit(params.data);
  }

  /**
   * onRowEditingStarted
   * @param params
   */
  public onRowEditingStarted(params) {
    this.rowEditingStarted.emit(params.data);
  }

  /**
   * onRowEditingStopped
   * @param params
   */
  public onRowEditingStopped(params) {
    this.rowEditingStopped.emit(params.data);
  }

  /**
   * onCellEditingStarted
   * @param params
   */
  public onCellEditingStarted(params) {
    if (this.disabledAll || this.preventDefault(params)) {
      this.api.stopEditing();
      return;
    }
    this.isStartEditing = true;

    const inactiveRowWithIsActive =
      params.node.data &&
      (params.node.data[ColHeaderKey.IsActive] === false ||
        params.node.data[ColHeaderKey.IsActive] === null ||
        params.node.data[ColHeaderKey.IsActive] === 0 ||
        params.node.data[ColHeaderKey.IsActiveDisableRow] == false ||
        params.node.data[ColHeaderKey.IsActiveDisableRow] == 0);

    const inactiveRowWithSelectAll =
      params.node.data &&
      params.isDisableRowWithSelectAll &&
      (params.node.data[ColHeaderKey.SelectAll] == false ||
        params.node.data[ColHeaderKey.SelectAll] == 0);
    const setting = this.agGridService.inactiveRowByColValueSetting(params);
    if (
      inactiveRowWithIsActive ||
      inactiveRowWithSelectAll ||
      setting.inactiveRowByValueSetting
    ) {
      let ignoreCol;
      if (setting.ignoreCols && setting.ignoreCols.length) {
        if (Array.isArray(setting.ignoreCols)) {
          ignoreCol = setting.ignoreCols.find((p) => p == params.colDef.field);
        }
      }
      if (!ignoreCol) {
        this.api.stopEditing();
        return;
      }
    }

    this.cellEditingStarted.emit(params.data);
    if (
      params.data.hasOwnProperty(ColHeaderKey.IsActive) &&
      !params.data[ColHeaderKey.IsActive]
    ) {
      params.data[ColHeaderKey.IsActive] = true;
    }
  }

  /**
   * onCellEditingStopped
   * @param params
   */
  public onCellEditingStopped(params) {
    const data: any = {
      cellType:
        params.colDef && params.colDef.refData
          ? params.colDef.refData.controlType
          : '',
      data: params.data,
      col: params.column,
      value: params.value,
    };
    this.isStartEditing = false;
    this.cellEditingStopped.emit(data);
  }

  /**
   * onCellValueChanged
   * @param params
   */
  public onCellValueChanged(params) {
    try {
      if (!isEqual(params.newValue, params.oldValue)) {
        if (!params.newValue && !params.oldValue) {
          return;
        }
        const itemAdded = this.itemsAdded.find((p) => p == params.data);
        if (itemAdded) {
          this.cellValueChanged.emit(params.data);
          return;
        }
        const item = this.itemsEdited.find((p) => p == params.data);
        if (!item) {
          this.itemsEdited.push(params.data);
        }
        this.cellValueChanged.emit(params.data);
      }
    } finally {
      this.hasValidationError.emit(this.hasError());
    }
  }

  private callRefreshErrorForGrid() {
    setTimeout(() => {
      this.hasError();
      this.ref.detectChanges();
    }, 500);
  }

  /**
   * hasError
   * */
  public hasError() {
    const invalidCells =
      this.agGridViewContainerRef.element.nativeElement.querySelectorAll(
        '.invalid-cell'
      );
    this.hasValidationErrorLocal = !!invalidCells.length;
    return invalidCells.length;
  }

  /**
   * hasUnsavedRows
   * */
  public hasUnsavedRows() {
    if (this.itemsAdded && this.itemsAdded.length) {
      const deletedNewItems = this.itemsAdded.filter((p) => p.IsDeleted);
      if (deletedNewItems && deletedNewItems.length) {
        this.api.updateRowData({ remove: deletedNewItems });
      }
      this.itemsAdded = this.itemsAdded.filter((p) => !p.IsDeleted);
    }
    return (
      this.itemsEdited.length > 0 ||
      this.itemsAdded.length > 0 ||
      this.itemsRemoved.length > 0
    );
  }

  /**
   * getEditedItems
   * */
  public getEditedItems() {
    return {
      itemsAdded: this.itemsAdded,
      itemsEdited: this.itemsEdited,
      itemsRemoved: this.itemsRemoved,
    };
  }

  /**
   * removeAllRowNodes
   **/
  public removeAllRowNodes() {
    if (this.api) {
      if (this.agGridDataSource.enabledServerSideDatasource) {
        this.api.setRowData([]);
        this.api.deselectAll();
      } else {
        const nodeItems = this.getCurrentNodeItems();
        if (nodeItems && nodeItems.length) {
          this.api.updateRowData({
            remove: nodeItems,
          });
        }
      }
    }
  }

  /**
   * addNewRow
   **/
  public addNewRow(data?, addIndex = 0) {
    let newItem = {};
    const gridColumns = this.gridOptions.columnDefs.map((colDef: ColDef) => {
      return {
        data: colDef.field,
        setting: colDef.refData ? colDef.refData.setting : null,
      };
    });

    const currentRowCount = this.api.getDisplayedRowCount();
    for (const col of gridColumns) {
      const config = null;
      newItem = this.datatableService.createEmptyRowData(
        newItem,
        col,
        config,
        currentRowCount
      );
    }

    // Set default value for new row that will be enable that row to edit.
    if (newItem.hasOwnProperty(ColHeaderKey.IsActive)) {
      newItem[ColHeaderKey.IsActive] = true;
    }

    if (data) {
      for (const col of gridColumns) {
        newItem[col.data] = data[col.data];
      }
    }

    const res = this.api.updateRowData({
      add: [newItem],
      addIndex: addIndex,
    });

    const item = this.itemsAdded.find((p) => p == newItem);
    if (!item) {
      this.itemsAdded.push(newItem);
    }

    this.api.clearFocusedCell();
    // this.refresh();

    //Select new added row
    this.selectRowIndex(0, true, true);
    setTimeout(() => {
      this.hasError();
    });
  }

  /**
   * deleteRows
   **/
  public deleteRows() {
    if (!this.allowDelete && !this.redRowOnDelete) {
      return;
    }
    const removeArray = [];
    const updateArray = [];
    for (let i = 0; i < this.api.getDisplayedRowCount(); i++) {
      const rowNode = this.api.getDisplayedRowAtIndex(i);
      if (
        rowNode.data[ColHeaderKey.Delete] &&
        (!rowNode.data['DT_RowId'] ||
          rowNode.data['DT_RowId'].indexOf('newrow') < 0)
      ) {
        rowNode.data[ColHeaderKey.IsDeleted] = true;
        // this.api.redrawRows({ rowNodes: [rowNode] });
        const item = this.itemsRemoved.find((p) => p == rowNode.data);
        if (!item) {
          this.itemsRemoved.push(rowNode.data);
        }
      } else {
        delete rowNode.data[ColHeaderKey.IsDeleted];
        this.itemsRemoved = this.itemsRemoved.filter((p) => p != rowNode.data);
      }
      if (
        rowNode.data[ColHeaderKey.Delete] &&
        rowNode.data['DT_RowId'] &&
        rowNode.data['DT_RowId'].indexOf('newrow') > -1
      ) {
        removeArray.push(rowNode.data);
      } else {
        updateArray.push(rowNode.data);
      }
    }
    if (removeArray.length) this.api.updateRowData({ remove: removeArray });
    if (updateArray.length) this.api.updateRowData({ update: updateArray });
    this.onDeletedRows.emit(true);
    this.hasValidationErrorLocal = false;
    // Update value for check-all of delete column
    this.onDeleteChecked.emit({ colDef: { field: ColHeaderKey.Delete } });
  }

  // public removeRows(rows: any[], idName?: string) {
  //     for (let item of this.dataSource.data) {
  //         for (let row of rows) {
  //             if (item[idName] = row[idName])
  //         }
  //     }
  // }

  /**
   * deleteRows when checkbox change
   **/
  public deleteCheckBoxChanges() {
    if (!this.allowDelete && !this.redRowOnDelete) {
      return;
    }
    const removeArray = [];
    const updateArray = [];
    for (let i = 0; i < this.api.getDisplayedRowCount(); i++) {
      const rowNode = this.api.getDisplayedRowAtIndex(i);
      if (!rowNode.data) continue;
      if (
        rowNode.data[ColHeaderKey.Delete] &&
        (!rowNode.data['DT_RowId'] ||
          rowNode.data['DT_RowId'].indexOf('newrow') < 0)
      ) {
        rowNode.data[ColHeaderKey.IsDeleted] = true;
        const item = this.itemsRemoved.find((p) => p == rowNode.data);
        if (!item) {
          this.itemsRemoved.push(rowNode.data);
        }
      } else {
        delete rowNode.data[ColHeaderKey.IsDeleted];
        this.itemsRemoved = this.itemsRemoved.filter((p) => p != rowNode.data);
      }
      if (
        rowNode.data[ColHeaderKey.Delete] &&
        rowNode.data['DT_RowId'] &&
        rowNode.data['DT_RowId'].indexOf('newrow') > -1
      ) {
        rowNode.data[ColHeaderKey.IsDeleted] = true;
        removeArray.push(rowNode.data);
      } else {
        updateArray.push(rowNode.data);
      }
      this.onDeleteChecked.emit({
        colDef: { field: ColHeaderKey.Delete },
      });
    }
  }

  public quantityInputChange(params, col) {
    setTimeout(() => {
      this.api.updateRowData({ update: [params] });
    });
    this.cellValueChanged.emit(params);
  }

  public quantityArticleInvoiceChange(params, column) {
    this.onQuantityArticleInvoice.emit({ data: params, column: column });
  }

  public buttonAndCheckboxChange(params, status) {
    const data: any = params.node.data;
    if (!data) return;
    data.colDef = params.colDef;
    data[params.column.colDef.field] =
      this.datatableService.updateValueForButtonAndCheckboxColumn(
        data[params.column.colDef.field],
        status
      );
    this.api.updateRowData({ update: [data] });
    this.buttonAndCheckboxValueChanged.emit(data);
  }

  /**
   * checkBoxChange
   * @param params
   */
  public checkBoxChange(params, status) {
    const data: any = params.node.data;
    if (!data) return;
    data.colDef = params.colDef;
    if (params.column) {
      switch (params.column.colDef.field) {
        case ColHeaderKey.Delete:
          this.setDeleteCheckboxStatus(data, status, (item) => {
            this.deleteCheckBoxChanges();
            this.api.updateRowData({ update: [item] });
            this.checkAndEmitDeleteRowStatus();
          });
          this.onDeleteChecked.emit(data);
          break;
        case ColHeaderKey.SelectAll:
          data[ColHeaderKey.SelectAll] = status;
          this.api.updateRowData({ update: [data] });
          this.onSelectedAllChecked.emit(data);

          if (!status) {
            this.onMarkedAsSelectedAll.emit(
              this.gridOptions.rowData.filter(
                (item) => item[ColHeaderKey.SelectAll] === true
              )
            );
          } else {
            const unselectedItems = this.gridOptions.rowData.filter(
              (item) => item[ColHeaderKey.SelectAll] !== true
            );
            if (!unselectedItems || !unselectedItems.length) {
              this.onMarkedAsSelectedAll.emit(this.gridOptions.rowData);
            } else {
              this.onMarkedAsSelectedAll.emit(
                this.gridOptions.rowData.filter(
                  (item) => item[ColHeaderKey.SelectAll] === true
                )
              );
            }
          }
          break;
        case ColHeaderKey.IsActive:
          data[ColHeaderKey.IsActive] = status;
          this.api.updateRowData({ update: [data] });
          this.cellValueChanged.emit(data);
          break;

        case ColHeaderKey.MasterCheckbox:
          // this.isMasterChecked = data[ColHeaderKey.MasterCheckbox] = status;
          data[ColHeaderKey.MasterCheckbox] = status;
          this.api.updateRowData({ update: [data] });

          if (status) {
            data[ColHeaderKey.UnMergeCheckbox] = false;
            this.api.updateRowData({ update: [data] });
            this.api.forEachNode((rowNode: RowNode, idx: number) => {
              if (
                rowNode != params.node &&
                rowNode.data[ColHeaderKey.MasterCheckbox]
              ) {
                rowNode.setDataValue(ColHeaderKey.MasterCheckbox, false);
              }
            });
          } else {
            data[ColHeaderKey.MasterCheckbox] = true;
            this.api.updateRowData({ update: [data] });
          }

          break;
        case ColHeaderKey.UnMergeCheckbox:
          // this.isUnMergeChecked = true;
          data[ColHeaderKey.UnMergeCheckbox] = status;
          this.api.updateRowData({ update: [data] });
          this.cellValueChanged.emit(data);
          break;

        case ColHeaderKey.noExport:
          data[ColHeaderKey.noExport] = status;
          this.api.updateRowData({ update: [data] });
          this.cellValueChanged.emit(data);
          break;

        default:
          data[params.column.colDef.field] = status;
          this.api.updateRowData({ update: [data] });
          this.cellValueChanged.emit(data);
          break;
      }
    }

    if (
      this.itemsEdited.indexOf(data) >= 0 ||
      params.column.colDef.field == ColHeaderKey.Delete
    ) {
      return;
    }
    this.itemsEdited.push(data);
  }

  /**
   * setDeleteCheckboxStatus
   **/
  public setDeleteCheckboxStatus(data, status, callback?) {
    data[ColHeaderKey.Delete] = !!status;
    if (!status) {
      delete data[ColHeaderKey.IsDeleted];
      this.itemsRemoved = this.itemsRemoved.filter((p) => p != data);
    }

    if (callback) {
      callback(data);
    }
  }

  /**
   * checkAndEmitDeleteRowStatus
   **/
  public checkAndEmitDeleteRowStatus() {
    // const deleteRows = this.gridOptions.rowData.filter(p => p[ColHeaderKey.Delete]);
    const deleteRows = this.getMarkedAsDeletedItems();
    if (deleteRows && deleteRows.length) {
      this.onRowMarkedAsDelete.emit({
        showCommandButtons: true,
        disabledDeleteButton: false,
      });
      this.isMarkedAsDelete = true;
    } else {
      this.onRowMarkedAsDelete.emit({
        showCommandButtons: false,
        disabledDeleteButton: true,
      });
      this.isMarkedAsDelete = false;
    }
  }

  /**
   * Select all checkbox changed event
   * @param data
   * @param status
   * @param callback
   */
  public checkAndEmitSelectAllStatus(status) {
    if (status) this.onMarkedAsSelectedAll.emit(this.gridOptions.rowData);
    else this.onMarkedAsSelectedAll.emit([]);
  }

  /**
   * onSelectionChanged
   * @param $event
   */
  public onSelectionChanged($event) {
    if (this.isButtonClicking) {
      this.isButtonClicking = false;
      return;
    }
    if (this.isDragging || this.isHidden) {
      return;
    }
    const rowData = this.selectedItem();
    if (rowData) {
      this.rowClick.emit(rowData);
    }
    this.assignSelectedRowForTranslateData();
  }

  public rowClickedHandler($event) {
    this.rowClickedAction.emit($event);
  }

  /**
   * Auto select row if there's only 01 row OR there's previous selected row
   * */
  public autoSelectRow() {
    if (
      this.api &&
      this.gridOptions &&
      this.gridOptions.rowData &&
      this.gridOptions.rowData.length
    ) {
      // Auto select row if there's only 01 row
      if (
        !this.preventAutoSelectFirstRow &&
        ((this.gridOptions.rowData.length === 1 &&
          !this.api.getSelectedNodes().length) ||
          this.autoSelectFirstRow)
      ) {
        this.selectRowIndex(0);
      } else {
        if (this.autoSelectCurrentRowAfterChangingData) {
          if (
            this.selectedNode &&
            this.selectedNode.rowIndex <= this.gridOptions.rowData.length - 1
          ) {
            this.selectRowIndex(this.selectedNode.rowIndex);
          } else {
            this.rowClick.emit(
              this.agGridService.createEmptyRowClickData(
                this.gridOptions.columnDefs
              )
            );
          }
        }
      }
    }
  }

  /**
   * changeToSingleRowMode
   */
  public changeToSingleRowMode(valueSwitchToDetail?: any) {
    // mode to know when table change in setActiveRowByCondition function
    if (valueSwitchToDetail) {
      this.modeMultiRow = false;
      return (this.modeSingleRow = false);
    } else {
      this.modeSingleRow = true;
    }

    if (!this.api || !this.selectedNode) {
      return;
    }
    const hardcodedFilter = {};
    //if (this.selectedNode && this.selectedNode.data['DT_RowId']) {
    //    hardcodedFilter['DT_RowId'] = {
    //        type: "contains",
    //        filter: this.selectedNode.data['DT_RowId']
    //    }
    //    this.api.setFilterModel(hardcodedFilter);
    //    this.api.onFilterChanged();
    //}
    if (this.selectedNode) {
      Object.keys(this.selectedNode.data).forEach((key) => {
        hardcodedFilter[key] = {
          type: 'contains',
          filter: this.selectedNode.data[key],
        };
      });
      this.api.setFilterModel(hardcodedFilter);
      this.api.onFilterChanged();
    }
  }

  /**
   * changeToMultipleRowMode
   **/
  public changeToMultipleRowMode(valueMultipleDisplayRowMode?: any) {
    if (this.api) {
      if (valueMultipleDisplayRowMode) {
        this.modeMultiRow = true;
        this.modeSingleRow = false;
      }
      this.api.setFilterModel(null);
      this.api.onFilterChanged();
    }
  }

  /**
   * refresh
   **/
  public refresh() {
    if (this.api) {
      setTimeout(() => {
        this.api.redrawRows();
      });
    }
  }

  /**
   * selectRowIndex
   * @param index
   */
  public selectRowIndex(
    index: number,
    thenScrollToIndex: boolean = true,
    thenEditRow?: boolean
  ) {
    if (index === -1) {
      this.api.forEachNode((rowNode: RowNode, rowIndex: number) => {
        rowNode.setSelected(false);
      });
    } else {
      this.api.forEachNode((rowNode: RowNode, rowIndex: number) => {
        if (rowNode.rowIndex == index) {
          rowNode.setSelected(true);
        }
      });
    }

    if (thenScrollToIndex) {
      this.api.ensureIndexVisible(index);
    }

    if (thenEditRow && !this.disabledAll) {
      const firstCol = this.firstVisibleColumn();
      if (firstCol) {
        this.api.startEditingCell({
          rowIndex: 0,
          colKey: firstCol.colId || firstCol.field,
        });
      }
    }
  }

  /**
   * Get first visible column
   * */
  public firstVisibleColumn(): ColDef {
    return this.gridOptions.columnDefs.find((col: ColDef) => !col.hide);
  }

  /**
   * calculatePinnedRowBottomData
   **/
  public calculatePinnedRowBottomData(showTotalRow?: RowSetting) {
    const rows = [];
    const data = {};
    this.gridOptions.columnDefs.forEach((colDef: ColDef) => {
      data[colDef.field] = null;
      if (colDef.refData && colDef.refData.controlType) {
        let total = 0;
        switch (colDef.refData.controlType.toLowerCase()) {
          case 'numeric':
            this.gridOptions.rowData.forEach((item) => {
              if (item[colDef.field]) {
                total += item[colDef.field];
              }
            });
            data[colDef.field] = total;
            break;
        }
      }
    });
    rows.push(data);
    switch (showTotalRow.positionTotalRow) {
      case 'Top':
        this.pinnedTopRowData = rows;
        this.pinnedBottomRowData = [];
        break;
      case 'Bottom':
        this.pinnedBottomRowData = rows;
        this.pinnedTopRowData = [];
        break;
      case 'Both':
        this.pinnedBottomRowData = rows;
        this.pinnedTopRowData = rows;
        break;
      default:
        this.pinnedTopRowData = [];
        this.pinnedBottomRowData = [];
        break;
    }
  }

  /**
   * Cell focused event
   * @param $event
   */
  public onCellFocused($event) {
    if (!$event || !$event.column || !$event.column.colDef) {
      return;
    }

    if (this.disabledAll || this.preventDefault($event)) {
      return;
    }

    if (
      this.hasPriorityColumn &&
      $event.column.colDef.field === CONTROL_COLUMNS.Priority
    ) {
      return;
    }

    /*
        const selectedNodes = this.api.getSelectedNodes();
        if (selectedNodes && selectedNodes.length) {
            if (selectedNodes[0].rowIndex != $event.rowIndex) {
                this.selectRowIndex($event.rowIndex);
            }
        } else {
            this.selectRowIndex($event.rowIndex);
        }
        */

    const isNotEditableCheckboxAndButton =
      !!$event.column.colDef.cellRendererFramework &&
      $event.column.colDef.cellRendererFramework.name !==
        'CheckboxEditableCellRenderer' &&
      $event.column.colDef.cellRendererFramework.name !==
        'TemplateButtonCellRenderer';
    if (
      !$event.column.colDef.editable &&
      (!$event.column.colDef.cellRendererFramework ||
        isNotEditableCheckboxAndButton)
    ) {
      return;
    }

    if (
      this._selectingCell &&
      this._selectingCell.rowIndex === $event.rowIndex &&
      this._selectingCell.colDef.field === $event.column.colDef.field
    ) {
      return;
    }

    this._selectingCell.rowIndex = $event.rowIndex;
    this._selectingCell.colDef = $event.column.colDef;

    const cellData = $event.api.getValue(
      $event.column.colDef.field,
      $event.api.getDisplayedRowAtIndex($event.rowIndex)
    );

    const isBooleanCol =
      $event.column.colDef.refData &&
      $event.column.colDef.refData.controlType === 'Checkbox' &&
      (isBoolean(cellData) ||
        cellData == 1 ||
        cellData == 0 ||
        isNil(cellData));
    if (
      isBooleanCol ||
      isNil(cellData) ||
      isNumber(cellData) ||
      (isString(cellData) && (!cellData || !cellData.trim())) ||
      (isObject(cellData) && !cellData.key)
    ) {
      //this.api.stopEditing();
      $event.api.startEditingCell({
        rowIndex: $event.rowIndex,
        colKey: $event.column.colDef.colId || $event.column.colDef.field,
      });
    }
  }

  /**
   * On column resized callback
   * @param $event
   */
  public onColumnResized($event) {
    if ($event) {
      if ($event.source === 'uiColumnDragged' && $event.finished) {
        this.updateColumnState($event);
      } else if ($event.source === 'autosizeColumns' && $event.finished) {
        this.updateColumnState($event);
      }
    }
  }

  /**
   * onColumnPinned
   * @param $event
   */
  public onColumnPinned($event) {
    this.updateHeaderStyle();
    this.updateColumnState($event);
  }

  /**
   * Update comlumn state after there are some actions occur on col (Resize, Show/Hide Col)
   **/
  private updateColumnState($event?) {
    if (!this.isDirtyFromUserAction()) return;
    const settings = this.getColumnLayout();
    const sortState = this.api ? this.api.getSortModel() : null;
    if (this.columnsLayoutSettings) {
      this.columnsLayoutSettings.settings =
        settings && settings.length
          ? settings
          : this.columnsLayoutSettings.settings;
      this.columnsLayoutSettings.sortState = sortState;
    }
    const outputData = {
      columnState: this.getColumnLayout(),
      sortState: sortState,
      source: $event ? $event.source : null,
      type: $event ? $event.type : null,
    };
    this.changeColumnLayout.emit(outputData);
    this.isColumnsLayoutChanged = true;
    this.saveColumnsLayoutItSelf();
    this.rowGroupPanel = false; // flag to off save columnSetting when change behaviour Show Hide Group panel
    this.changeColumnLayoutMasterDetail();
  }

  public changeColumnLayoutMasterDetail() {
    if (
      !this.masterDetail ||
      !this.columnsLayoutSettings ||
      !this.api ||
      !this.columnApi
    )
      return;

    this.columnsLayoutSettings.settings = this.getColumnLayout();
    this.columnsLayoutSettings.sortState = this.api.getSortModel();

    this.onChangeColumnLayoutMasterDetail.emit({
      columnsLayoutSettings: this.columnsLayoutSettings,
    });
  }
  public updateColumnStateForDetailGrid(settings?) {
    if (!this.columnsLayoutSettings || !this.api || !this.columnApi) return;

    this.columnsLayoutSettings = settings;
    this.columnApi.setColumnState(this.columnsLayoutSettings.settings);
  }

  private saveColumnsLayoutItSelf() {
    if (this.settingIsAutoSaveLayout.value && this.autoSaveColumnsLayout) {
      this.reloadAndSaveItSelfColumnsLayout();
    }
  }

  private isDirtyFromUserAction() {
    const columnsLayout = this.getColumnLayout() || [];
    // const rowGroupPanel = this.getRowGroupPanel() || [];
    const sortModel = this.api ? this.api.getSortModel() || [] : [];
    const setting =
      this.columnsLayoutSettings && this.columnsLayoutSettings.settings
        ? this.columnsLayoutSettings.settings
        : [];
    // const rowGroup = (this.columnsLayoutSettings && this.columnsLayoutSettings.rowGroup) ? this.columnsLayoutSettings.rowGroup : [];
    const sortState =
      this.columnsLayoutSettings && this.columnsLayoutSettings.sortState
        ? this.columnsLayoutSettings.sortState
        : [];

    return (
      columnsLayout.length != setting.length ||
      (this.rowGroupPanel && this.isGlobalSearch) ||
      sortModel.length != sortState.length ||
      JSON.stringify(setting) !== JSON.stringify(columnsLayout) ||
      JSON.stringify(sortState) !== JSON.stringify(sortModel)
    );
  }

  /**
   * Load column layout
   * */
  public loadColumnLayout() {
    if (!this.gridOptions || !this.gridOptions.columnDefs) {
      return;
    }

    if (this.allowSetColumnState) {
      if (this.columnApi && this.columnsLayoutSettings) {
        if (
          this.columnsLayoutSettings.settings &&
          typeof this.columnsLayoutSettings.settings === 'object'
        ) {
          //Check to update column state in case of length of state is not equal to current columns length
          if (
            this._isColumnsChanged(
              this.gridOptions.columnDefs,
              this.columnsLayoutSettings.settings,
              'colId'
            ) ||
            this.gridOptions.columnDefs.length !==
              this.columnsLayoutSettings.settings.length
          ) {
            const missingColDefs: ColDef[] = [];
            for (let i = 0; i < this.gridOptions.columnDefs.length; i++) {
              if (
                !this.columnsLayoutSettings.settings.find(
                  (x) => x['colId'] == this.gridOptions.columnDefs[i]['field']
                )
              ) {
                missingColDefs.push(this.gridOptions.columnDefs[i]);
              }
            }

            let masterDetailColumn: any;
            for (let i = 0; i < missingColDefs.length; i++) {
              if (missingColDefs[i].field === BUTTON_COLUMNS.rowColCheckAll) {
                this.columnsLayoutSettings.settings.splice(1, 0, {
                  aggFunc: null,
                  colId: missingColDefs[i].field,
                  hide: true,
                  pinned: null,
                  pivotIndex: null,
                  rowGroupIndex: null,
                  width: 100,
                });
              } else {
                const missingColDef = {
                  aggFunc: null,
                  colId: missingColDefs[i].field || null,
                  hide: missingColDefs[i].hide || false,
                  pinned: missingColDefs[i].pinned || null,
                  pivotIndex: missingColDefs[i].pivotIndex || null,
                  rowGroupIndex: missingColDefs[i].rowGroupIndex || null,
                  width: missingColDefs[i].width || 100,
                };

                if (missingColDefs[i].field == 'MasterDetailColumn')
                  masterDetailColumn = missingColDef;
                else this.columnsLayoutSettings.settings.push(missingColDef);
              }
            } //for

            if (masterDetailColumn)
              this.columnsLayoutSettings.settings.unshift(masterDetailColumn);
          }

          this.columnsLayoutSettings.settings =
            this.columnsLayoutSettings.settings.map((setting) => {
              return {
                ...setting,
                hide: this.hideColumnFromAccessRight(setting),
              };
            });

          this.columnApi.setColumnState(this.columnsLayoutSettings.settings);
        }
        if (this.columnsLayoutSettings.sortState) {
          this.api.setSortModel(this.columnsLayoutSettings.sortState);
        }
      }
    }
  }

  public getColumnLayout() {
    if (this.columnApi) {
      return this.columnApi.getColumnState();
    }

    return null;
  }

  public getRowGroupPanel() {
    if (this.columnApi) {
      return this.columnApi.getRowGroupColumns();
    }
    return null;
  }

  private _buildGroupByColumn(columnDefs: any[]) {
    const groupColumns: any[] = [];

    for (let i = 0; i < columnDefs.length; i++) {
      if (
        this.datatableService.hasDisplayField(
          columnDefs[i].refData,
          'GroupDisplayColumn'
        )
      ) {
        const colName = this._getColumnName(
          columnDefs,
          this.datatableService.getDisplayFieldValue(
            columnDefs[i].refData,
            'GroupDisplayColumn'
          )
        );
        if (colName) {
          groupColumns.push(colName);
        }
      }

      if (
        this.datatableService.hasDisplayField(
          columnDefs[i].refData,
          'AutoGroupColumnDef'
        )
      ) {
        this.gridOptions.autoGroupColumnDef = {
          headerName: columnDefs[i].headerName,
          field: columnDefs[i].field,
        };
      }
    }

    groupColumns.forEach((groupCol: string) => {
      const col: ColDef = columnDefs.find((c) => c.field == groupCol);
      if (col) {
        col.rowGroup = true;
      }
    });
  }

  private _getColumnName(columnDefs: any[], originalColumnName: string) {
    const col = columnDefs.find(
      (c) =>
        c.refData && c.refData.setting.OriginalColumnName == originalColumnName
    );
    if (col) {
      return col.field;
    }

    return null;
  }

  /**
   * toggleDeleteColumn
   * @param isShow
   */
  public toggleDeleteColumn(isShow) {
    //if (this.gridOptions && this.gridOptions.columnDefs) {
    //    const deleteCol: ColDef = this.gridOptions.columnDefs.find((p: ColDef) => {
    //        return p.field == ColHeaderKey.Delete;
    //    });
    //    if (deleteCol) {
    //        const isVisible = this.columnApi.getColumn(ColHeaderKey.Delete).isVisible();
    //        this.columnApi.setColumnVisible(ColHeaderKey.Delete, isShow);
    //        if (!isVisible && isShow) {
    //            if (callback) {
    //                callback();
    //            }
    //        }
    //    }
    //}
  }

  private _isColumnsChanged(
    oldColumns: any[],
    newColumns: any[],
    compareFieldName: string
  ) {
    if (!oldColumns || !newColumns) {
      return true;
    }

    if (oldColumns.length !== newColumns.length) {
      return true;
    }

    for (let i = 0; i < oldColumns.length; i++) {
      const item = newColumns.find(
        (x) => x[compareFieldName] == oldColumns[i][compareFieldName]
      );
      if (!item) {
        return true;
      } else {
        if (
          oldColumns[i][compareFieldName] &&
          item.hide != oldColumns[i].hide
        ) {
          return true;
        }
      }
    }
    //if (JSON.stringify(oldColumns) !== JSON.stringify(newColumns)) {
    //    return true;
    //}
    return false;
  }

  /**
   * Assign selected row for translate data
   **/
  private assignSelectedRowForTranslateData() {
    if (this.api && this.api.getSelectedNodes()) {
      if (this.api.getSelectedNodes()[0]) {
        if (this.translateData) {
          // service for translate grid data
          this.translateData.gridSelectedRow = [
            this.api.getSelectedNodes()[0].data,
          ];
        }
      }
    }
  }

  /**
   * Lost focus of grid
   **/
  public stopEditing() {
    this.api.stopEditing();
  }

  /**
   * Apply Filter
   **/
  public applyFilter() {
    this.api.clearFocusedCell();
    this.api.setQuickFilter(this.filter);
  }

  /**
   *setSelectedRow
   **/
  public setSelectedRow(selectedRow: any, keyColumnNames?: string) {
    // if (!this.gridOptions || !this.gridOptions.rowData)
    //     return;
    setTimeout(() => {
      if (!this.gridOptions || !this.gridOptions.rowData) return;

      if (keyColumnNames) {
        const keys = keyColumnNames.split(',');
        const compareObj1 = {};
        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          compareObj1[key] = selectedRow[key];
        }

        for (let i = 0; i < this.gridOptions.rowData.length; i++) {
          const item = cloneDeep(this.gridOptions.rowData[i]);
          const compareObj2 = {};
          for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            compareObj2[key] = item[key];
          }
          const isEqual: boolean =
            JSON.stringify(compareObj1).toLowerCase() ===
            JSON.stringify(compareObj2).toLowerCase();
          if (isEqual) {
            this.selectRowIndex(i);
            break;
          }
        }
        return;
      }

      for (let i = 0; i < this.gridOptions.rowData.length; i++) {
        const item = cloneDeep(this.gridOptions.rowData[i]);
        delete item['DT_RowId'];
        delete item['isReadOnlyColumn'];
        delete selectedRow['DT_RowId'];
        delete selectedRow['isReadOnlyColumn'];
        if (JSON.stringify(selectedRow) === JSON.stringify(item)) {
          this.selectRowIndex(i);
          break;
        }
      }
    }, 500);
  }

  /**
   * scrollToPosition
   * @param mode
   */
  public scrollToPosition(mode) {}

  /**
   * scrollHover
   * @param mode
   */
  public scrollHover(mode) {}

  /**
   * scrollUnHover
   * @param mode
   */
  public scrollUnHover(mode) {}

  /**
   * collapseGroupsToLevel
   * @param level
   */
  public collapseGroupsToLevel(mode) {
    // Calling node.setExpanded() causes the grid to get redrawn.
    // If you have many nodes you want to expand, then it is best to set node.expanded = true directly,
    // and then call api.onGroupExpandedOrCollapsed() when finished to get the grid to
    // redraw the grid again just once
    this.api.forEachNode((node) => {
      node.expanded = mode == 1 ? true : false;
    });
    // this.api.onGroupExpandedOrCollapsed();
  }

  /**
   * deselectRow
   **/
  public deselectRow() {
    if (this.api) {
      this.api.deselectAll();
      this.api.clearFocusedCell();
    }
  }

  /**
   * deleteRowByRowId
   * @param rowId
   */
  public deleteRowByRowId(rowId: any) {
    if (this.api) {
      const removeData: Array<any> = [];
      this.api.forEachNode((rowNode: RowNode) => {
        if (rowNode.allLeafChildren) {
          for (
            let i = 0, dataRow = rowNode.allLeafChildren.length;
            i < dataRow;
            i++
          ) {
            if (rowNode.allLeafChildren[i].data === rowId) {
              return removeData.push(rowNode.allLeafChildren[i].data);
            }
          }
        } else {
          if (rowNode.data && rowNode.data[ColHeaderKey.Id] == rowId) {
            return removeData.push(rowNode.data);
          }
        }
      });
      this.api.updateRowData({ remove: removeData });
    }
  }

  /**
   * setActiveRowByCondition
   * */
  public setActiveRowByCondition(keyObj: { [key: string]: any }) {
    if (this.api) {
      const filter = {};
      this.api.forEachNode((rowNode: RowNode) => {
        if (!rowNode || !rowNode.data) return;
        Object.keys(rowNode.data).forEach((key) => {
          if (
            key === 'IdPersonInterface' ||
            key === 'IdPersonInterfaceContactAddressGW'
          ) {
            if (
              keyObj['IdPersonInterfaceContactAddressGW'] &&
              keyObj['IdPersonInterfaceContactAddressGW'] ===
                rowNode.data['IdPersonInterfaceContactAddressGW']
            ) {
              if (this.modeSingleRow) {
                this.api.setFilterModel(null);
                filter[key] = {
                  type: 'contains',
                  filter: rowNode.data[key],
                };
                this.api.setFilterModel(filter);
                this.api.onFilterChanged();
              }
              if (this.modeMultiRow) {
                const selectedRow = this.api.getDisplayedRowAtIndex(
                  rowNode.rowIndex
                );
                return selectedRow.setSelected(true);
              }
            }
          } else {
            if (keyObj[key] && keyObj[key] === rowNode.data[key]) {
              if (this.modeSingleRow) {
                this.api.setFilterModel(null);
                filter[key] = {
                  type: 'contains',
                  filter: rowNode.data[key],
                };
                this.api.setFilterModel(filter);
                this.api.onFilterChanged();
              }
              if (this.modeMultiRow) {
                const selectedRow = this.api.getDisplayedRowAtIndex(
                  rowNode.rowIndex
                );
                return selectedRow.setSelected(true);
              }
            }
          }
        });
      });
    }
  }

  public onCellClicked($event) {
    if (this.disabledAll || this.preventDefault($event)) {
      return;
    }

    if (this.hasPriorityColumn) {
      if (!isNil($event.data['IsActive']) || $event.data['IsActive'] === null) {
        if (
          $event.colDef.field !== 'IsActive' &&
          ($event.data['IsActive'] === false ||
            $event.data['IsActive'] === null)
        ) {
          return;
        }
      }

      if (!this.readOnly && $event.colDef.field == CONTROL_COLUMNS.Priority) {
        this.updateCellPriority($event.data);
      }
    } else if (this._isEditting) {
      this.api.startEditingCell({
        rowIndex: $event.rowIndex,
        colKey: $event.colDef.colId || $event.colDef.field,
      });
    }
  }

  public onCellContextMenu($event) {
    if (this.hasPriorityColumn) {
      if (!isNil($event.data['IsActive'])) {
        if (
          $event.colDef.field !== 'IsActive' &&
          $event.data['IsActive'] === false
        ) {
          return;
        }
      }

      if (!this.readOnly && $event.colDef.field == CONTROL_COLUMNS.Priority) {
        this.api.hidePopupMenu();
        this.deletePriorityForCurrentItem($event.data);
      }
    }

    if (this.selectRowOnRightClick) {
      const currentFocusedCell = this.api.getFocusedCell();
      this.selectRowIndex(currentFocusedCell.rowIndex);
    }
  }

  /**
   * getHTMLTable
   **/
  public getHTMLTable(): string {
    let tblString = '';
    if (this.api && this.columnApi) {
      //this.columnApi.autoSizeAllColumns();
      this.api.setDomLayout('print');
      tblString = this.agGridViewContainerRef.element.nativeElement.outerHTML;

      setTimeout(() => {
        this.loadColumnLayout();
        this.api.setDomLayout(null);
      });

      //// start table
      //let tbl = '<table width="100%">';

      //// headers
      //tbl += '<thead>';
      //tbl +=  this.renderRowHeader(this.columnApi.getAllDisplayedColumns());
      ////for (let r = 0; r < flex.columnHeaders.rows.length; r++) {
      ////    tbl += this.renderRow(flex.columnHeaders, r);
      ////}
      //tbl += '</thead>';

      //// body
      //tbl += '<tbody>';
      ////for (let r = 0; r < flex.rows.length; r++) {
      ////    tbl += this.renderRow(flex.cells, r);
      ////}
      //tbl += '</tbody>';

      //// done
      //tbl += '</table>';
    }
    return tblString;
  }

  /**
   * Render Row Header
   * @param colHeaders
   */
  private renderRowHeader(colHeaders: Array<Column>) {
    let tr = '';
    tr += '<tr>';
    for (let c = 0; c < colHeaders.length; c++) {
      const col: Column = colHeaders[c];
      if (col.getColDef().field == ColHeaderKey.Delete) {
        break;
      }
      if (col.getActualWidth() > 0) {
        // get cell style, content
        const style = 'width:' + col.getActualWidth() + 'px;text-align: left',
          content = col.getColDef().headerName,
          cellElement = '';

        const className = '';

        //if (cellElement) {
        //    className = cellElement.className;
        //}

        tr +=
          '<th style="' +
          style +
          '" class="' +
          className +
          '" > ' +
          content +
          ' </th>';
      }
    }
    tr += '</tr>';
    return tr;
  }

  /**
   *showToolPanel
   * */
  public showToolPanel(status) {
    if (this.api) {
      this.api.setSideBarVisible(status);

      if (this.fitWidth) {
        this.sizeColumnsToFit();
      }

      if (this.columnsLayoutSettings) {
        this.columnsLayoutSettings.isShowToolPanels = status;
      }
    }
  }

  public rightClicked($event) {
    this.store.dispatch(this.processDataActions.dontWantToShowContextMenu());
    this.rowRightClicked.emit();
  }

  public buildContextMenuItems(params) {
    if (this.parentInstance && this.parentInstance.makeContextMenu) {
      this._contextMenuItems = this.parentInstance.makeContextMenu(
        this.getRowDataByCellFocus()
      );
    } else {
      this._contextMenuItems = [];
    }
    this._contextMenuItems = this.appendDefaultContextMenu(
      this._contextMenuItems || []
    );
    this.agGridService.buildContextMenuForTranslation(this._contextMenuItems);
    return this._contextMenuItems;
  }

  private getRowDataByCellFocus() {
    if (this.api) {
      const cell = this.api.getFocusedCell();
      if (!cell) return null;
      const row = this.api.getDisplayedRowAtIndex(cell.rowIndex);
      if (!row || !row.data) return null;
      return Uti.mapObjectToCamel(row.data);
    }
    return null;
  }

  /**
   * Manual update rows data
   * @param data
   */
  public updateRowData(data: any[]) {
    if (this.api) {
      this.api.updateRowData({ update: data });
    }

    if (data && data.length) {
      if (!this.itemsEdited.find((x) => x.DT_RowId === data[0].DT_RowId)) {
        this.itemsEdited.push(data[0]);
      }
    }
  }

  private isColumnMoved = false;
  public onColumnMoved($event) {
    if ($event && $event.source === 'uiColumnDragged') {
      this.isColumnMoved = true;
    }
  }

  public onDragStopped($event) {
    if (this.isColumnMoved) {
      this.updateColumnState($event);
      this.isColumnMoved = false;
    }
  }

  public onColumnRowGroupChanged($event) {
    this.updateColumnState($event);
  }

  public getGridColumns(): any[] {
    if (this.columnApi) {
      return this.columnApi.getAllGridColumns();
    }
  }

  public displayedColumnsChanged($event) {
    const apiColumnsChanged: GridApi = $event.api;
    if (!apiColumnsChanged) {
      return;
    }
    const params = { columns: ['Country'] };
    const instances = apiColumnsChanged.getCellRendererInstances(params);
    const instance = instances[0] as any;
    const controlTypeCountry =
      instance &&
      instance._params &&
      instance._params.colDef.refData.controlType;
    if (
      controlTypeCountry &&
      controlTypeCountry.toLowerCase() ===
        CustomCellRender.CountryFlagCellRenderer &&
      instances.length > 0
    ) {
      if (
        !(
          instance.getFrameworkComponentInstance() instanceof
          CountryFlagCellRenderer
        )
      ) {
        return;
      }
      const dataCountryFlag = instance.getFrameworkComponentInstance();
      const headerCountry =
        dataCountryFlag && dataCountryFlag.colDef.headerName;
      apiColumnsChanged.forEachNode((row) => {
        const country = row.data[headerCountry];
        let lengthCountry = 0;
        if (country && country.includes(';')) {
          const arrayCountries = country && country.split(';');
          lengthCountry = arrayCountries && (arrayCountries.length - 1) * 26;
        } else {
          lengthCountry = DefaultRowHeight.RowHeight;
        }
        row.setRowHeight(lengthCountry);
        apiColumnsChanged.onRowHeightChanged();
      });
      return;
    }
    currentRowHeight = DefaultRowHeight.RowHeight;
    apiColumnsChanged.resetRowHeights();
  }

  public onGridSizeChanged($event) {
    if (this.fitWidth) {
      this.sizeColumnsToFit();
    }
  }

  /*Grid Header*/
  public onGridHeaderSearch(keyword: string) {
    this.pageIndex = 1;
    this.hightlightKeywords = keyword;
    this.onTableSearch.emit(keyword);
  }

  public onGridHeaderFilter(keyword: string) {
    this.filter = keyword;
  }

  public uploadFile() {
    this.onUploadClick.emit(true);
  }

  public selectedItem(): any {
    if (!this.api) {
      return null;
    }

    const selectedNodes = this.api.getSelectedNodes();
    if (selectedNodes.length) {
      this.selectedNode = selectedNodes[0];
      const rowData = this.agGridService.buildRowClickData(
        selectedNodes[0].data
      );
      return rowData;
    }
    return null;
  }

  /*Grid Header*/

  /**
   * currentPageChanged
   * @param event
   */
  public currentPageChanged(event: IPageChangedEvent): void {
    this.currentPageIndex = event.page;
    this.currentPageSize = event.itemsPerPage;
    this.pageChanged.emit(event);
  }

  public onPageNumberDefault(pageNumber: number) {
    this.pageNumberChanged.emit(pageNumber);
  }

  /**
   * initDragDropHandler
   **/
  private initDragDropHandler() {
    const createDragContent = function (x, y, offsetX, offsetY, content) {
      const dragImage = document.createElement('div');
      dragImage.innerHTML = content;
      dragImage.style.position = 'absolute';
      dragImage.style.pointerEvents = 'none';
      dragImage.style.top = '0px'; // Math.max(0, y - offsetY) + 'px';
      dragImage.style.left = '0px'; // Math.max(0, x) + 'px';
      dragImage.style.zIndex = '1000';
      dragImage.classList.add('xn-grid-drag');

      document.body.appendChild(dragImage);

      setTimeout(function () {
        dragImage.style.visibility = 'hidden';
      }, 100);

      return dragImage;
    };

    const self = this;
    let node;
    const bodyContainer =
      this.agGridViewContainerRef.element.nativeElement.querySelector(
        '.ag-body-container'
      );
    bodyContainer.draggable = true;
    bodyContainer.addEventListener(
      'dragstart',
      function (e) {
        const focusedCell = self.api.getFocusedCell();
        if (focusedCell) {
          const row = self.api.getDisplayedRowAtIndex(focusedCell.rowIndex);
          let item = row.data;
          item = mapKeys(item, function (v, k) {
            return camelCase(k.toString());
          });
          if (self.customDragContent && self.customDragContent.data) {
            item['refData'] = self.customDragContent.data;
          }
          e.dataTransfer.setData('text', JSON.stringify(item));
          if (self.customDragContent && self.customDragContent.dragIcon) {
            node = createDragContent(
              e.pageX,
              e.pageY,
              e.offsetX,
              e.offsetY,
              self.customDragContent.dragIcon
            );
            const dataTransfer: any = e.dataTransfer;
            dataTransfer.setDragImage(node, 5, 5);
          }
          self.isDragging = true;
        }
      },
      true
    );

    bodyContainer.addEventListener(
      'dragend',
      function (e) {
        $('.xn-grid-drag').remove();
        self.isDragging = false;
      },
      true
    );
  }

  /**
   * Get Value At Focused Cell
   **/
  private getValueAtFocusedCell() {
    const focusedCell = this.api.getFocusedCell();
    if (focusedCell) {
      const row = this.api.getDisplayedRowAtIndex(focusedCell.rowIndex);
      const cellValue = this.api.getValue(focusedCell.column.getColId(), row);
      return cellValue;
    }
    return null;
  }

  /**
   * Get current data items of grid
   **/
  public getCurrentNodeItems() {
    const items: Array<any> = [];
    if (this.api) {
      this.api.forEachNode((rowNode: RowNode) => {
        items.push(rowNode.data);
      });
    }
    return items;
  }

  public focusOut() {
    if (this.api) {
      return this.api.stopEditing();
    }
  }

  /**
   * Get all items that marked as deleted
   **/
  public getMarkedAsDeletedItems() {
    const items: Array<any> = [];
    this.api.forEachNode((rowNode: RowNode) => {
      if (rowNode.data && rowNode.data[ColHeaderKey.Delete]) {
        items.push(rowNode.data);
      }
    });
    return items;
  }

  public getGridData() {
    return this.getCurrentNodeItems();
  }

  private hideColumnFromAccessRight(col) {
    switch (col.colId) {
      case 'Return':
        const gridCol: ColDef = this.gridOptions.columnDefs.find(
          (c: ColDef) => c.field === col.colId
        );
        if (gridCol && gridCol.refData.controlType === 'Button') {
          const accessRight = this.accessRightService.getAccessRight(
            AccessRightTypeEnum.SubModule,
            {
              idSettingsGUIParent: 5,
              idSettingsGUI: 29,
            }
          );

          if (accessRight) {
            if (!col.hide) {
              return !accessRight.read;
            }
          }
        }

        return col.hide;

      default:
        return col.hide;
    }
  }

  public getSelectedNode(): RowNode {
    return this.api && this.api.getSelectedNodes().length
      ? this.api.getSelectedNodes()[0]
      : null;
  }

  public getSelectedNodes(): RowNode[] {
    if (!this.api) return [];
    return this.api.getSelectedNodes();
  }

  private isFirstLoadAndAutoSort = true;

  /**
   * sortChanged
   * @param $event
   */
  public sortChanged($event) {
    /* Commnet these codes , they cause bug ""Save" button doesn't display after sort" ...
        // Try to prevent auto sorting when column layout change
        // The timeout is wait for grid loaded
        if (this.isFirstLoadAndAutoSort) {
            return;
        }
        setTimeout(() => {
            this.isFirstLoadAndAutoSort = false;
        }, 1500);
        // end prevent
        */
    if (this.isSortChanged) {
      this.updateColumnState($event);
    }
  }

  private appendDefaultContextMenu(contextMenuItems: Array<any>) {
    if (
      !Uti.existItemInArray(contextMenuItems, { name: 'Translate' }, 'name')
    ) {
      contextMenuItems.push({
        name: 'Translate',
        action: (event) => {
          this.onActionTranslateDialog.emit(true);
        },
        cssClasses: [''],
        icon: `<i class="fa  fa-language blue-color ag-context-icon"/>`,
      });
    }
    const copy = 'copy';
    if (contextMenuItems.indexOf(copy) < 0) {
      contextMenuItems.push(copy);
    }
    const copyWithHeaders = 'copyWithHeaders';
    if (contextMenuItems.indexOf(copyWithHeaders) < 0) {
      contextMenuItems.push(copyWithHeaders);
    }
    if (!Uti.existItemInArray(contextMenuItems, { name: 'Copy row' }, 'name')) {
      contextMenuItems.push({
        name: 'Copy row',
        action: (event) => {
          this.api.copySelectedRowsToClipboard(false);
        },
        cssClasses: [''],
        icon: `<i class="fa  fa-clipboard  blue-color  ag-context-icon"/>`,
      });
    }
    if (
      !Uti.existItemInArray(
        contextMenuItems,
        { name: 'Copy row with Headers' },
        'name'
      )
    ) {
      contextMenuItems.push({
        name: 'Copy row with Headers',
        action: (event) => {
          this.api.copySelectedRowsToClipboard(true);
        },
        cssClasses: [''],
        icon: `<i class="fa  fa-clipboard  blue-color  ag-context-icon"/>`,
      });
    }
    const paste = 'paste';
    if (contextMenuItems.indexOf(paste) < 0) {
      contextMenuItems.push(paste);
    }

    if (
      !Uti.existItemInArray(
        contextMenuItems,
        { name: 'Show Hide group panel' },
        'name'
      ) &&
      !this.showMenuRowGrouping
    ) {
      contextMenuItems.push({
        name: 'Show Hide group panel',
        action: (event) => {
          this.onRowGroupPanel.emit(!this._rowGrouping);
          this.rowGroupPanel = true;
          setTimeout(() => {
            this.updateColumnState();
          }, 500);
        },
        cssClasses: [''],
        icon: `<i class="fa  fa-object-group  ag-context-icon"/>`,
      });
    }

    if (
      this.canExport &&
      !Uti.existItemInArray(contextMenuItems, { name: 'Export' }, 'name')
    ) {
      contextMenuItems.push('separator');
      contextMenuItems.push({
        name: 'Export',
        icon: `<i class="fa fa-file-excel-o  blue-color ag-context-icon"/>`,
        subMenu: [
          {
            name: 'CSV_Export_Csv',
            action: (event) => {
              this.api.exportDataAsCsv();
            },
          },
          {
            name: 'Excel_Export_Xlsx',
            action: (event) => {
              this.api.exportDataAsExcel({
                exportMode: 'xlsx',
                processCellCallback: (params) => {
                  return this.exportProcessCellCallback(params);
                },
                sheetName: this.sheetName,
              });
            },
          },
          {
            name: 'Excel_Export_XML',
            action: (event) => {
              this.api.exportDataAsExcel({
                exportMode: 'xml',
                processCellCallback: (params) => {
                  return this.exportProcessCellCallback(params);
                },
              });
            },
          },
          {
            name: 'PDF_Export_Pdf',
            action: (event) => {
              this.downloadPdf();
            },
          },
        ],
      });
    }
    if (
      !Uti.existItemInArray(
        contextMenuItems,
        { name: 'Fit width columns' },
        'name'
      )
    ) {
      contextMenuItems.push({
        name: 'Fit width columns',
        action: (event) => {
          this.sizeColumnsToFit();
          setTimeout(() => {
            this.updateColumnState();
          }, 500);
        },
        cssClasses: [''],
        icon: `<i class="fa  fa-arrows  ag-context-icon"/>`,
      });
    }
    if (
      this.isColumnsLayoutChanged &&
      !Uti.existItemInArray(
        contextMenuItems,
        { name: 'Save table setting' },
        'name'
      ) &&
      !this.settingIsAutoSaveLayout.value
    ) {
      contextMenuItems.push({
        name: 'Save table setting',
        action: (event) => {
          this.saveColumnsLayout();
        },
        cssClasses: [''],
        icon: `<i class="fa  fa-save-config-in-context  orange-color  ag-context-icon"/>`,
      });
    }
    if (!this.isColumnsLayoutChanged) {
      Uti.removeItemInArray(
        contextMenuItems,
        { name: 'Save table setting' },
        'name'
      );
    }
    return this.reIndexContextMenu(contextMenuItems);
  }

  downloadPdf() {
    const pdf = new jsPDF('l', 'px', 'a4');
    const columnState = this.columnApi.getColumnState();
    const rowRaw = this.gridOptions.rowData;
    const columns = [];
    for (const key of columnState) {
      if (!key['hide'] && key.colId) {
        columns.push({ header: key.colId, field: key.colId });
      }
    }
    const rows = rowRaw.map((item) => {
      const result = [];
      columns.forEach((value) => {
        return item[value.field] || item[value.field] === 0
          ? item[value.field].key
            ? result.push(item[value.field].value)
            : item[value.field] instanceof Date
            ? result.push(formatDate(item[value.field]))
            : result.push(item[value.field])
          : result.push('');
      });
      return result;
    });
    pdf.autoTable(columns, rows, { margin: 5 });
    pdf.save(`${this.sheetName}.pdf`);

    // Format Date yyyy-mm-dd
    function formatDate(date) {
      const d = new Date(date),
        year = d.getFullYear();
      let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    }
  }

  private reIndexContextMenu(contextMenuItems: any) {
    const bottomContext: Array<any> = [];
    for (const item of contextMenuItems) {
      if (!item.index) continue;
      bottomContext.push(item);
    }

    for (const item of bottomContext) {
      Uti.removeItemInArray(contextMenuItems, { name: item.name }, 'name');
    }
    contextMenuItems = [
      ...contextMenuItems,
      ...sortBy(bottomContext, ['index']),
    ];
    return contextMenuItems;
  }

  public exportExcel() {
    this.api.exportDataAsExcel({
      exportMode: 'xlsx',
      processCellCallback: (params) => {
        return this.exportProcessCellCallback(params);
      },
      sheetName: this.sheetName,
    });
  }

  /**
   * exportProcessCellCallback
   * */
  private exportProcessCellCallback(params) {
    let data = params.value;
    if (isObject(data)) {
      data = data.value;
    }
    if (
      params &&
      params.column &&
      params.column.getColDef().refData &&
      params.column.getColDef().refData.controlType
    ) {
      switch (params.column.getColDef().refData.controlType.toLowerCase()) {
        case 'date':
        case 'datetimepicker':
          data = this.agGridService.dateFormatter(params);
          break;
        case 'checkbox':
          data = this.agGridService.boolFormatter(params);
      }
    }
    return data;
  }

  private toggleRowColCheckAllColumn() {
    setTimeout(() => {
      if (!this.columnApi) {
        return;
      }

      if (this.hasRowColCheckAll) {
        this.columnApi.setColumnsVisible(
          [BUTTON_COLUMNS.rowColCheckAll],
          this.isEditting
        );
        this.sizeColumnsToFit();
      }
    }, 200);
  }

  /**
   * Get all grid columns*/
  public getAllColumns() {
    if (!this.columnApi) {
      return [];
    }

    return this.columnApi.getAllColumns();
  }

  /**
   * Show/hide grid columns
   * @param cols
   * @param isVisible
   */
  public toggleColumns(cols: string[], isVisible: boolean) {
    setTimeout(() => {
      if (!this.columnApi) {
        return;
      }

      this.columnApi.setColumnsVisible(cols, isVisible);
      this.sizeColumnsToFit();
    }, 200);
  }

  /**
   * Show/hide row group header
   * Due to Ag-Grid issue, we need to call addRowGroupColumn & then removeRowGroupColumn to trigger
   * event redraw group header
   **/
  private toggleRowGroupHeader() {
    if (!this.columnApi) return;
    const cols = this.columnApi.getAllDisplayedColumns();
    if (cols && cols.length) {
      const field = cols[0].getColDef().field;
      this.columnApi.addRowGroupColumn(field);
      this.updateStyleForRowGrouping();
      this.columnApi.removeRowGroupColumn(field);
    }
  }

  private updateStyleForRowGrouping() {
    const groups = $('.ag-column-drop.ag-font-style', this._eref.nativeElement);
    if (!groups || !groups.length) return;
    if (this.rowGrouping) {
      $(groups[0]).removeClass('ag-hidden');
    } else if (!$(groups[0]).hasClass('ag-hidden')) {
      $(groups[0]).addClass('ag-hidden');
    }
  }

  public updatePriority(fromItem: any, changedPriorityOption: any) {
    const data = this.getCurrentNodeItems().filter(
      (p) => p[CONTROL_COLUMNS.Priority]
    );
    const destItem = data.find(
      (p) =>
        p[CONTROL_COLUMNS.Priority] ==
        (changedPriorityOption.key || changedPriorityOption.value)
    );
    if (fromItem && destItem) {
      const idField = Object.keys(fromItem).find((k) => k == 'id')
        ? 'id'
        : 'DT_RowId';
      const fromIndex = data.findIndex((p) => p[idField] == fromItem[idField]);
      const destIndex = data.findIndex((p) => p[idField] == destItem[idField]);
      if (fromIndex < destIndex) {
        const arr = data.map((p) => p[CONTROL_COLUMNS.Priority]);
        arr.splice(
          fromIndex,
          0,
          changedPriorityOption.key || changedPriorityOption.value
        );
        arr.splice(destIndex + 1, 1);
        data.forEach((db, index, dataArr) => {
          db[CONTROL_COLUMNS.Priority] = arr[index];
          this.updateRowData([db]);
        });
      }
      if (fromIndex > destIndex) {
        const arr = data.map((p) => p[CONTROL_COLUMNS.Priority]);
        arr.splice(
          fromIndex + 1,
          0,
          changedPriorityOption.key || changedPriorityOption.value
        );
        arr.splice(destIndex, 1);
        data.forEach((db, index, dataArr) => {
          db[CONTROL_COLUMNS.Priority] = arr[index];
          this.updateRowData([db]);
        });
      }

      this.onPriorityEditEnded.emit();
    }
  }

  /**
   * Init priority list
   */
  private initPriorityList() {
    this.priorities = [];
    const priorityList = this.gridOptions.rowData.map(
      (o) => o[CONTROL_COLUMNS.Priority]
    );
    if (priorityList && priorityList.length) {
      const maxValue = Math.max.apply(Math, priorityList);
      for (let i = 0; i < maxValue; i++) {
        this.priorities.push({
          label: i + 1,
          value: i + 1,
        });
      }
    }
  }

  private updateCellPriority(item) {
    if (item.hasOwnProperty(CONTROL_COLUMNS.Priority)) {
      const priority = item[CONTROL_COLUMNS.Priority];
      if (!priority) {
        const data = this.getCurrentNodeItems();
        const maxLength = data.length;
        const arr = data.map((p) => toSafeInteger(p[CONTROL_COLUMNS.Priority]));
        const maxValue = max(arr);
        if (maxValue < maxLength) {
          item[CONTROL_COLUMNS.Priority] = maxValue + 1;
          this.updateRowData([item]);
        } else {
          let validPriority = maxValue;
          let rs;
          do {
            validPriority -= 1;
            rs = data.find((p) => p[CONTROL_COLUMNS.Priority] == validPriority);
          } while (rs);
          item[CONTROL_COLUMNS.Priority] = validPriority;
          this.updateRowData([item]);
        }
        this.initPriorityList();

        setTimeout(() => {
          this.cellValueChanged.emit(this.selectedNode.data);
        });
      }
    }
  }

  private deletePriorityForCurrentItem(item) {
    const priorityDeleted = item[CONTROL_COLUMNS.Priority];
    if (priorityDeleted) {
      const data = this.getCurrentNodeItems();
      data.forEach((item) => {
        if (
          item[CONTROL_COLUMNS.Priority] > priorityDeleted &&
          item[CONTROL_COLUMNS.Priority] > 1
        ) {
          item[CONTROL_COLUMNS.Priority] -= 1;
          this.updateRowData([item]);
        }
      });
    }
    item[CONTROL_COLUMNS.Priority] = '';
    this.updateRowData([item]);
    this.onPriorityEditEnded.emit();
    this.initPriorityList();
  }

  private navigateToNextCellFunc(params: NavigateToNextCellParams) {
    let previousCell = params.previousCellDef;
    const suggestedNextCell = params.nextCellDef;

    const KEY_UP = 38;
    const KEY_DOWN = 40;
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;

    switch (params.key) {
      case KEY_DOWN:
        previousCell = params.previousCellDef;
        // set selected cell on current cell + 1
        this.api.forEachNode((node) => {
          if (previousCell.rowIndex + 1 === node.rowIndex) {
            node.setSelected(true);
          }
        });
        return suggestedNextCell;
      case KEY_UP:
        previousCell = params.previousCellDef;
        // set selected cell on current cell - 1
        this.api.forEachNode((node) => {
          if (previousCell.rowIndex - 1 === node.rowIndex) {
            node.setSelected(true);
          }
        });
        return suggestedNextCell;
      case KEY_LEFT:
      case KEY_RIGHT:
        return suggestedNextCell;
      default:
        throw new Error(
          'this will never happen, navigation is always one of the 4 keys above'
        );
    }
  }

  public processCellForClipboard(params) {
    if (
      params.value &&
      params.column &&
      params.column.colDef &&
      params.column.colDef.refData &&
      params.column.colDef.refData.controlType === 'datetimepicker'
    ) {
      return this.uti.formatLocale(
        new Date(params.value),
        params.column.colDef.refData.format
      );
    }

    return params.value;
  }

  private saveColumnsLayout() {
    this.isColumnsLayoutChanged = false;
    if (!this.autoSaveColumnsLayout) {
      this.saveColumnsLayoutAction.emit();
      return;
    }
    this.reloadAndSaveItSelfColumnsLayout();
  }

  private reloadAndSaveItSelfColumnsLayout() {
    this._globalSettingService
      .getAllGlobalSettings('-1')
      .subscribe((data: any) => {
        this._appErrorHandler.executeAction(() => {
          this.saveItSelfColumnsLayout(data);
        });
      });
  }

  private saveItSelfColumnsLayout(data: Array<GlobalSettingModel>) {
    if (
      !this.currentColumnLayoutData ||
      !this.currentColumnLayoutData.idSettingsGlobal
    ) {
      this.currentColumnLayoutData = new GlobalSettingModel({
        description: 'Grid Columns Layout',
        globalName: this.id,
        globalType: 'GridColLayout',
        idSettingsGUI: '-1',
        objectNr: '-1',
        isActive: true,
        jsonSettings: JSON.stringify(this.prepairColumnsLayout()),
      });
    } else {
      this.currentColumnLayoutData.jsonSettings = JSON.stringify(
        this.prepairColumnsLayout()
      );
      this.currentColumnLayoutData.idSettingsGUI = this.currentColumnLayoutData
        .idSettingsGUI
        ? this.currentColumnLayoutData.idSettingsGUI
        : this.currentColumnLayoutData.objectNr;
    }
    if (!this.currentColumnLayoutData.objectNr)
      this.currentColumnLayoutData.objectNr = '-1';
    this._globalSettingService
      .saveGlobalSetting(this.currentColumnLayoutData)
      .subscribe(
        (data) => this.saveColumnsLayoutSuccess(data),
        (error) => this.serviceError(error)
      );
  }

  private prepairColumnsLayout() {
    return {
      rowGroup: this._rowGrouping,
      settings: this.getColumnLayout(),
      sortState: this.api ? this.api.getSortModel() : null,
    };
  }

  private saveColumnsLayoutSuccess(data: any) {
    if (Uti.isResquestSuccess(data)) return;
    this._toasterService.pop(
      'success',
      'Success',
      'Columns layout is saved successful'
    );
    this.currentColumnLayoutData.idSettingsGlobal = data.returnValue;
    this._globalSettingService.saveUpdateCache(
      '-1',
      this.currentColumnLayoutData,
      data
    );
  }

  private loadDataForColumnsLayout() {
    if (!this.autoSaveColumnsLayout) {
      this.loadColumnLayout();
      return;
    }
    if (!this.id) return;
    this.loadColumnsLayoutByItSelf();
  }

  private loadColumnsLayoutByItSelf() {
    this._globalSettingService.getAllGlobalSettings(-1).subscribe(
      (data) => this.getAllGlobalSettingSuccess(data),
      (error) => this.serviceError(error)
    );
  }

  private getAllGlobalSettingSuccess(data: Array<GlobalSettingModel>) {
    if (!data || !data.length) return;
    this.currentColumnLayoutData = data.find((x) => x.globalName == this.id);
    if (
      !this.currentColumnLayoutData ||
      !this.currentColumnLayoutData.jsonSettings
    )
      return;
    this.columnsLayoutSettings = Uti.tryParseJson(
      this.currentColumnLayoutData.jsonSettings
    );
    this.rowGrouping =
      this.columnsLayoutSettings && this.columnsLayoutSettings.rowGroup;
    this.loadColumnLayout();
  }

  private serviceError(error) {
    Uti.logError(error);
  }

  public onCellDirectionChanged(enterMovesDown) {
    this._enterMovesDown = enterMovesDown ? false : true;
    this.bringFocusBack();
  }

  private bringFocusBack() {
    const cell = this.api.getFocusedCell();

    if (cell) {
      this.api.setFocusedCell(cell.rowIndex, cell.column);
    }
  }

  public showLoadingOverlay() {
    this.api.showLoadingOverlay();
  }

  public showNoRowsOverlay() {
    this.api.showNoRowsOverlay();
  }

  public hideOverlay() {
    this.api.hideOverlay();
  }

  public onRowGroupOpened($event) {
    // Check if this node expand, we need to colapse the other nodes
    if ($event && $event.node.expanded) {
      if (this.autoCollapse) {
        const currentId = $event.node.id;
        this.api.forEachNode((node) => {
          if (node.id != currentId) {
            // node.expanded = false;
            node.setExpanded(false);
          }
        });
      }
      setTimeout(() => {
        // this.api.onGroupExpandedOrCollapsed();
        if ($event.node.expanded && $event.node.master) {
          this.api.ensureIndexVisible($event.node.rowIndex, 'top');
        }
      });
    }
  }

  private recursiveCountForSetBackgroundElement = 0;
  private setBackgroundForElement(className: string, backgroundColor: string) {
    setTimeout(() => {
      const el = $(className, this._eref.nativeElement);
      if (!el.length) {
        this.recursiveCountForSetBackgroundElement++;
        this.setBackgroundForElement(className, backgroundColor);
        return;
      }
      if (this.recursiveCountForSetBackgroundElement > 20) {
        this.recursiveCountForSetBackgroundElement = 0;
        return;
      }
      el.css('background', backgroundColor);
      this.recursiveCountForSetBackgroundElement = 0;
    }, 200);
  }

  private setBackgroundImageForElement(
    className: string,
    backgroundImage?: string
  ) {
    setTimeout(() => {
      const el = $(className, this._eref.nativeElement);
      if (!el.length) {
        this.recursiveCountForSetBackgroundElement++;
        this.setBackgroundForElement(className, backgroundImage);
        return;
      }
      if (this.recursiveCountForSetBackgroundElement > 20) {
        this.recursiveCountForSetBackgroundElement = 0;
        return;
      }

      el.css('background-image', backgroundImage['image']);
      el.css('background-size', backgroundImage['size']);
      el.css('background-position', backgroundImage['position']);
      this.recursiveCountForSetBackgroundElement = 0;
    }, 200);
  }

  public clearAllRows() {
    this.api.setRowData([]);
  }

  public addItems(data: any[]) {
    if (this.api) {
      this.api.addItems(data);
    }
  }

  public onBodyScroll(event) {
    this.bodyScrollChanged.next(true);
  }

  public preventDefault(event) {
    return false;
  }

  public detectChanges() {
    setTimeout(() => {
      this.ref.markForCheck();
      this.ref.detectChanges();
    }, 300);
  }

  public insertItemsAtIndex(index: number, data: any[]) {
    if (this.api) {
      this.api.insertItemsAtIndex(index, data);
    }
  }

  //#region Treeview-ServerSide
  private buildTreeViewAutoGroupColumnDef(model: ControlGridModel) {
    this.gridOptions.treeData = true;
    this.gridOptions.animateRows = true;
    this.gridOptions.autoGroupColumnDef = {
      headerName: 'Tree View',
      cellRendererParams: {
        suppressCount: true,
      },
    };

    if (this.agGridDataSource.enabledServerSideDatasource) {
      this.agGridService.buildAutoGroupColumnDefForModules(
        model,
        this.gridOptions
      );
    } else {
      this.gridOptions.getDataPath = function (data) {
        return data[ColHeaderKey.TreeViewPath];
      };
    }

    if (model.autoGroupColumnDef) {
      const autoGroupColumnDef = this.gridOptions.autoGroupColumnDef;

      if (model.autoGroupColumnDef.minWidth)
        autoGroupColumnDef.minWidth = model.autoGroupColumnDef.minWidth;
      if (model.autoGroupColumnDef.width)
        autoGroupColumnDef.width = model.autoGroupColumnDef.width;
      if (model.autoGroupColumnDef.headerName)
        autoGroupColumnDef.headerName = model.autoGroupColumnDef.headerName;

      if (model.autoGroupColumnDef.isFitColumn) {
        autoGroupColumnDef.lockPosition = true;
        autoGroupColumnDef.suppressMenu = true;
        autoGroupColumnDef.suppressSorting = true;
        autoGroupColumnDef.suppressNavigable = true;
        autoGroupColumnDef.suppressToolPanel = true;
        autoGroupColumnDef.suppressResize = true;
        autoGroupColumnDef.suppressSizeToFit = true;
        autoGroupColumnDef.suppressAutoSize = true;

        autoGroupColumnDef.pinnedRowCellRenderer = function (params) {
          return '';
        };
        autoGroupColumnDef.pinned = 'left';
      }
    }
  }

  private setGridOption() {
    if (this.agGridDataSource.enabledServerSideDatasource) {
      this.gridOptions.enableFilter = false;
    }
  }

  private initServerSideDatasource() {
    if (!this.api || !this.agGridDataSource.enabledServerSideDatasource) return;

    const fakeServer = this.agGridFakeServer.FakeServer(
      this.agGridDataSource.rowData
    );
    const datasource = this.serverSideDatasource(
      fakeServer,
      this.agGridDataSource.funcGetData,
      this.serverSideDatasourceCallback.bind(this)
    );
    this.api.setServerSideDatasource(datasource);
  }

  private timeoutServerSideDatasourceCallback;
  private serverSideDatasourceCallback() {
    clearTimeout(this.timeoutServerSideDatasourceCallback);
    this.timeoutServerSideDatasourceCallback = null;
    this.timeoutServerSideDatasourceCallback = setTimeout(() => {
      this.autoSelectRow();
    }, 200);
  }

  private serverSideDatasource(server, funcGetData, funcCallback) {
    return {
      getRows: function (params) {
        //console.log('[Datasource] - rows requested by grid: ', params.request);
        if (params.parentNode.data) {
          //Get for Children
          if (funcGetData) {
            funcGetData(params);
          } else {
            params.failCallback();
          }
        } else {
          const response = server.getData(params.request);
          if (response.success) {
            params.successCallback(response.rows, response.lastRow);
            if (funcCallback) {
              funcCallback();
            }
          } else {
            params.failCallback();
          }
        }
      },
    };
  }
  //#endregion Treeview-ServerSide
}
