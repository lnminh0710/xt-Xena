import {
    Component,
    Input,
    Output,
    OnInit,
    OnDestroy,
    AfterViewInit,
    EventEmitter,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
    TemplateRef,
    ContentChild,
} from "@angular/core";
import { Router } from "@angular/router";
import * as wjcCore from "wijmo/wijmo";
import * as wjcGrid from "wijmo/wijmo.grid";
import * as gridPdf from "wijmo/wijmo.grid.pdf";
import * as wjcGridFilter from "wijmo/wijmo.grid.filter";
import * as wjcInput from "wijmo/wijmo.input";
import * as Ps from "perfect-scrollbar";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import cloneDeep from "lodash-es/cloneDeep";
import isObject from "lodash-es/isObject";
import mapKeys from "lodash-es/mapKeys";
import camelCase from "lodash-es/camelCase";
import isString from "lodash-es/isString";
import isNumber from "lodash-es/isNumber";
import isBoolean from "lodash-es/isBoolean";
import isNaN from "lodash-es/isNaN";
import orderBy from "lodash-es/orderBy";
import max from "lodash-es/max";
import toSafeInteger from "lodash-es/toSafeInteger";
import { parse, compareAsc } from "date-fns/esm";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { GridActions, CustomAction } from "app/state-management/store/actions";
import { AppState } from "app/state-management/store";
import { Subscription } from "rxjs/Subscription";
import { IPageChangedEvent } from "app/shared/components/xn-pager/xn-pagination.component";
import {
    DatatableService,
    CommonService,
    AppErrorHandler,
    ModalService,
    ScrollUtils,
    DomHandler,
    PropertyPanelService,
    HotKeySettingService,
} from "app/services";
import { MessageModal } from "app/app.constants";
import { MessageModel, ApiResultResponse, ReloadMode } from "app/models";
import { Uti } from "app/utilities/uti";
import { BaseComponent } from "app/pages/private/base";
import {
    BooleanCellTemplateDirective,
    BooleanColHeaderTemplateDirective,
} from "../template";
import { CellEditDialogComponent } from "../components/cell-edit-dialog";
import { format } from "date-fns/esm";

@Component({
    selector: "wijmo-grid",
    styleUrls: [
        "./wijmo-grid.component.scss",
        "./wijmo-grid.component.flag.scss",
    ],
    templateUrl: "./wijmo-grid.component.html",
})
export class WijmoGridComponent
    extends BaseComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    public priority: any[] = [];
    public quantityPriority = [];
    private currentCellData: any;
    private _filter = "";
    private _thisFilterFunction: wjcCore.IPredicate;
    private _toFilter: any;
    private currentSelectedColHeader: any = null;
    public wijmoDataSource: any = null;
    private _colWidthUpdated = false;
    private _beginningEdit = false;
    private isDoubleClick = false;
    private popupPosition: { top: number; left: number } = {
        top: -50,
        left: 0,
    };
    public isHalfOpacity = false;
    public isShowingPopupFilter = false;
    private _randomNo: number = Math.round(Math.random() * 10000000);
    private _errorObject: any = {};
    private _activeRowIndex: number;
    public showCtxItem = false;
    private deletedItemList: any[] = [];
    private _hasValidationError = false;
    public isSelectDeletedAll = false;
    private _isFormDirty = false;
    // the current page
    public currentPage = 1;
    public totalResults: number;
    private _previousCellRange: any = {
        col: -1,
        row: -1,
    };
    private _scrollUtils: ScrollUtils;
    private get scrollUtils() {
        if (!this._scrollUtils) {
            this._scrollUtils = new ScrollUtils(
                this.scrollBodyContainer,
                this.domHandler
            );
        }
        return this._scrollUtils;
    }
    private filterObj: any;

    public globalDateFormat: string = null;
    public dontShowCalendarWhenFocus: boolean;
    public globalDateFormatFilter: string = null;
    public globalNumberFormat: string = null;
    public translateData: any = {};
    gridData: wjcCore.CollectionView;
    gridColumns: any[] = [];
    filterColumns: any[] = [];
    editingRow: any = null;
    groupByColumn: any = null;
    itemFormatter: Function;
    isMarkedAsDelete = false;
    isMarkedAsSelectedAll = false;
    search = "";
    private localGridStyle: any = {
        headerStyle: {},
        rowStyle: {},
    };
    private localWidgetStyle: any;

    public CONTROL_COLUMNS = {
        deleted: "deleted",
        mediaCodeButton: "mediaCodeButton",
        download: "download",
        selectAll: "selectAll",
        InvoicePDF: "InvoicePDF",
        PDF: "PDF",
        Tracking: "Tracking",
        Return: "Return",
        SendLetter: "SendLetter",
        SAV: "SAV",
        Unblock: "Unblock",
        Delete: "Delete",
        EditRow: "EditRow",
        scheduleSetting: "ScheduleSetting",
        runScheduleSetting: "RunScheduleSetting",
        FilterExtended: "FilterExtended",
        noExport: "noExport",
        Priority: "Priority",
        Edit: "Edit",
    };
    public CHECKBOX_COLUMNS = {
        masterCheckbox: "MasterCheckbox",
        unMergeCheckbox: "UnMergeCheckbox",
    };
    private checkBoxColumnsName = [
        "IsActive",
        "isActiveDisableRow",
        "selectAll",
        "select",
        "UnAssign",
    ];
    private fitWidth = true;
    private showTotalRowLocal = false;
    private isDragging = false;
    public isSearching = false;
    public isAutoCompleteSearching = false;
    private resizing = false;
    public needCheckGlobalSearchDirty = true;
    public cheatCounter = 0;
    public preventRowEmit: boolean;
    private selectedRow: { r: number; c: number };
    public showCellEditDialog = false;

    private commonServiceSubscription: Subscription;
    private getGlobalSettingSubscription: Subscription;
    private requestRefreshSubscription: Subscription;
    private requestInvalidateSubscription: Subscription;
    private requestResetSelectingCellSubscription: Subscription;

    private _isActivated: boolean = true;
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

    @Input() set widgetDetail(data: any) {
        this.translateData = data;
        this.assignSelectedRowForTranslateData();
    }
    @Input() columnsLayoutSettings: any = null;
    @Input() autoCompleteSearch: any = null;
    @Input() parentInstance: any = null;
    @Input() isEditting = true;
    @Input() readOnly = true;
    @Input() hasSearch = false;
    @Input() hasFilter = true;
    @Input() hasFilterBox = false;
    @Input() selectionMode: any = "Row";
    @Input() headersVisibility: any = "All";
    @Input() showSelectedHeaders: any = "None";
    @Input() showMarquee = false;
    @Input() allowResizing: any = "Both";
    @Input() columnFilter = true;
    @Input() isShowedEditButtons = false;
    @Input() enableDownloadColumn = false;
    @Input() widgetReloadMode: ReloadMode = ReloadMode.ListenKey;
    @Input() set fitWidthColumn(fitWidth: boolean) {
        if (!isNil(fitWidth)) {
            this.fitWidth = fitWidth;

            if (this.fitWidth) {
                this.turnOnStarResizeMode();
            } else {
                this.turnOffStarResizeMode();

                if (
                    this.columnLayout ||
                    (this.columnsLayoutSettings &&
                        this.columnsLayoutSettings.settings)
                ) {
                    this._updateColumnLayoutFromState();
                } else {
                    this.flex.autoSizeColumns();
                }
            }
        }
    }
    @Input() set showTotalRow(showTotalRow: boolean) {
        if (!isNil(showTotalRow)) {
            this.showTotalRowLocal = showTotalRow;

            if (this.showTotalRowLocal) {
                this._addFooterRow(this.flex);
            } else {
                this.flex.columnFooters.rows.clear();
            }
        }
    }
    @Input() allowDelete = false;
    @Input() allowAddNew = false;
    @Input() allowMediaCode = false;
    @Input() columnLayout: any = null;
    @Input() hightlightKeywords: string;
    @Input() widgetId: string = null;
    @Input() serverPaging = false;
    @Input() pageSize: number;
    @Input() allowDrag = false;
    @Input() customDragContent: string;
    @Input() allowDownload = false;
    @Input() autoSelectFirstRow = false;
    @Input() allowUploadFile = false;
    @Input() isShowedHeader: boolean;
    @Input() allowSelectAll = false;
    @Input() headerTitle: string;
    @Input() set isFormDirty(obj: any) {
        this._isFormDirty = obj.value;
    }
    @Input() showTooltip: boolean = false;
    @Input() tooltipField: string;
    @Input() set activeRowIndex(val) {
        this._activeRowIndex = val;
        if (!isNil(this._activeRowIndex)) {
            this.selectRowIndex(val);
        }
    }
    @Input() hasDisableRow = false;
    @Input() smallRowHeaders = false;
    @Input() hasCountryFlagColumn = false;
    @Input() requiredAddressNumber = 0;
    @Input() hasQuantityPriorityColumn = false;
    @Input() customClass: string;
    @Input() noFilterColumns: string[] = [];

    get activeRowIndex() {
        return this._activeRowIndex;
    }

    @Input() wordWrapHeader = true;
    @Input() set dataSource(dataSource: any) {
        if (!dataSource) {
            return;
        }
        dataSource.data = dataSource.data || [];
        dataSource.columns = dataSource.columns || [];

        this.isMarkedAsSelectedAll = false;
        this._previousCellRange = {};
        this._errorObject = {};
        this.totalResults = dataSource.totalResults;
        const config = {
            allowDelete: this.allowDelete,
            allowMediaCode: this.allowMediaCode,
            allowDownload: this.allowDownload,
            allowSelectAll: this.allowSelectAll,
            hasDisableRow: this.hasDisableRow,
            hasCountryFlagColumn: this.hasCountryFlagColumn,
        };
        // TODO: get column layout settings here
        this.setDatasouceForGrid(dataSource, config);
    }

    /**
     * initPriorityList
     */
    private initPriorityList() {
        this.priority = [];
        const priorityList = this.gridData.items.map(
            (o) => o[this.CONTROL_COLUMNS.Priority]
        );
        if (priorityList && priorityList.length) {
            const maxValue = Math.max.apply(Math, priorityList);
            for (let i = 0; i < maxValue; i++) {
                this.priority.push({
                    key: i + 1,
                    value: i + 1,
                });
            }
        }
    }

    @Input() showContextMenu: any = false;
    @Input() gridContextMenuData: any;
    @Input() set gridStyle(gridStyle: any) {
        if (this.flex) {
            this.localGridStyle = gridStyle;
            this.flex.refresh();
        }
    }
    @Input() set widgetStyle(widgetStyle: any) {
        if (this.flex) {
            this.localWidgetStyle = widgetStyle;
            this.flex.refresh();
        }
    }
    @Input() isDisableRowWithSelectAll: boolean = false;
    @Input() isDesignWidgetMode = false;
    @Input() enableQtyWithColor = false;
    @Input() set globalProperties(globalProperties: any[]) {
        this.globalDateFormat =
            this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                globalProperties
            );
        this.globalNumberFormat =
            this.propertyPanelService.buildGlobalNumberFormatFromProperties(
                globalProperties
            );
        this.dontShowCalendarWhenFocus =
            this.propertyPanelService.getValueDropdownFromGlobalProperties(
                globalProperties
            );
    }

    @Input() enableRowHotKey: boolean = false;
    @Input() isGlobalSearch = false;
    @Input() isSupportHierarchicalView = false;
    @Input() hasHeaderBorder = true;
    @Input() readOnlyCells: any[];
    @Input() disabledAll = false;
    @Input() resetDatasouceWhenChanged = false;

    @Output() gridItemRightClick = new EventEmitter<any>();
    @Output() onRowClick = new EventEmitter<any>();
    @Output() onTableEditStart = new EventEmitter<any>();
    @Output() onTableEditEnd = new EventEmitter<any>();
    @Output() onCellEditEnd = new EventEmitter<any>();
    @Output() onRowMarkedAsDelete = new EventEmitter<any>();
    @Output() onEachRowMarkedAsDelete = new EventEmitter<any>();
    @Output() onMediacodeClick = new EventEmitter<any>();
    @Output() onPdfColumnClick = new EventEmitter<any>();
    @Output() onTrackingColumnClick = new EventEmitter<any>();
    @Output() onReturnRefundColumnClick = new EventEmitter<any>();
    @Output() onSendLetterColumnClick = new EventEmitter<any>();
    @Output() onUnblockColumnClick = new EventEmitter<any>();
    @Output() onDeleteColumnClick = new EventEmitter<any>();
    @Output() onDownloadFile = new EventEmitter<any>();
    @Output() onTableSearch = new EventEmitter<any>();
    @Output() hasScrollbars = new EventEmitter<any>();
    @Output() hasValidationError = new EventEmitter<any>();
    @Output() onRowDoubleClick = new EventEmitter<any>();
    @Output() onRowEditEnded = new EventEmitter<any>();
    @Output() onCheckAllChecked = new EventEmitter<any>();
    @Output() onPageChanged = new EventEmitter<IPageChangedEvent>();
    @Output() onDeletedRows = new EventEmitter<any>();
    @Output() onDeletedRowAway = new EventEmitter<any>();
    @Output() onCellClick = new EventEmitter<any>();
    @Output() onChangeSelectedItems = new EventEmitter<any>();
    @Output() onUploadFileClick = new EventEmitter<any>();
    @Output() onRowClickingConfirmYes = new EventEmitter<any>();
    @Output() onBeforeSelectionChange = new EventEmitter<any>();
    @Output() onMarkedAsSelectedAll = new EventEmitter<any>();
    @Output() onEnterPress = new EventEmitter<any>();
    @Output() onChangeColumnLayout = new EventEmitter<any>();
    @Output() onSearchCellcChanged = new EventEmitter<any>();
    @Output() onSelectionChanging = new EventEmitter<any>();
    @Output() onAfterFlexgridRendered = new EventEmitter<any>();
    @Output() onScrollPositionChanged = new EventEmitter<any>();
    @Output() onEditRowColumnClick = new EventEmitter<any>();
    @Output() onScheduleSettingClickAction = new EventEmitter<any>();
    @Output() onRunScheduleSettingClickAction = new EventEmitter<any>();
    @Output() onNoExportChanged = new EventEmitter<any>();
    @Output() onPriorityEditEnded = new EventEmitter<any>();
    @Output() onSelectionColumnChanged = new EventEmitter<any>();
    @Output() onCellEditEnded = new EventEmitter<any>();
    @Output() onEditColumnClick = new EventEmitter<any>();

    @ViewChild("flex") flex: wjcGrid.FlexGrid;
    @ViewChild("filter") gridFilter: wjcGridFilter.FlexGridFilter;
    @ViewChild("popup") popup: wjcInput.Popup;

    private cellCombo: wjcInput.ComboBox;
    @ViewChild("cellCombo") set content(content: wjcInput.ComboBox) {
        this.cellCombo = content;
    }

    private cellEditDialog: CellEditDialogComponent;
    @ViewChild(CellEditDialogComponent) set cellEditDialogComponent(
        cellEditDialogComponent: CellEditDialogComponent
    ) {
        this.cellEditDialog = cellEditDialogComponent;
    }
    @ContentChild(BooleanCellTemplateDirective)
    booleanCellTemplate: BooleanCellTemplateDirective;
    @ContentChild(BooleanColHeaderTemplateDirective)
    booleanColHeaderTemplate: BooleanColHeaderTemplateDirective;

    get filter(): string {
        return this._filter;
    }
    set filter(value: string) {
        if (this._filter !== value) {
            this._filter = value;
            this._applyFilter();
            this.flex.scrollIntoView(0, 0);
        }
    }

    constructor(
        private commonService: CommonService,
        private datatableService: DatatableService,
        private appErrorHandler: AppErrorHandler,
        private store: Store<AppState>,
        private gridActions: GridActions,
        private _eref: ElementRef,
        private ref: ChangeDetectorRef,
        private modalService: ModalService,
        private domHandler: DomHandler,
        private propertyPanelService: PropertyPanelService,
        private dispatcher: ReducerManagerDispatcher,
        public hotKeySettingService: HotKeySettingService,
        protected router: Router,
        private uti: Uti
    ) {
        super(router);

        this._thisFilterFunction = this._filterFunction.bind(this);
        this.validateCells = this.validateCells.bind(this);
        this.sortComparer = this.sortComparer.bind(this);
        this.collectionChangedHandler =
            this.collectionChangedHandler.bind(this);
        this.itemFormatter = this._itemFormatterFunc.bind(this);
    }

    ngOnInit() {
        this._subscribeRequestRefreshState();
        this._subscribeRequestInvalidateState();
    }

    ngOnDestroy() {
        this._removeHorizontalPerfectScrollEvent();
        this._removeVerticalPerfectScrollEvent();

        $(this.flex.hostElement).unbind();
        $(this.flex.hostElement).children().unbind();
        $(this.flex.hostElement).off();
        $(this.flex.hostElement).children().off();

        Uti.unsubscribe(this);

        //set array length = 0
        if (this.gridColumns) this.gridColumns.length = 0;
        if (this.filterColumns) this.filterColumns.length = 0;
        if (this.deletedItemList) this.deletedItemList.length = 0;

        //set object = null
        this.gridData = null;
        this.editingRow = null;
        this.groupByColumn = null;
        this.translateData = null;
        this._thisFilterFunction = null;
        this._toFilter = null;
        this.currentSelectedColHeader = null;
        this.wijmoDataSource = null;
        this._scrollUtils = null;
        this.filterObj = null;

        //set object = {}
        this._errorObject = {};
    }

    ngAfterViewInit() {
        if (this.flex) {
            this.flex.keyActionEnter = wjcGrid.KeyAction.MoveAcross;
            this.registerCellClickEvent();
            this.registerContextMenu();
            //this.addPerfectScrollbar();
            //this.checkGridHasScrollbars();

            if (this.activeRowIndex) {
                this.selectRowIndex(this.activeRowIndex);
            } else if (
                this.autoSelectFirstRow ||
                (this.gridData && this.gridData.items.length === 1)
            ) {
                this.selectFirstRow();
            }
            this.flex.selectionChanging.addHandler(
                this.selectionChangingHandler.bind(this)
            );
            this.flex.selectionChanged.addHandler(
                this.selectionChangedHandler.bind(this)
            );
            this.flex.beginningEdit.addHandler(
                this.beginningEditHandler.bind(this)
            );
            this.flex.sortingColumn.addHandler(
                this.sortingColumnHandler.bind(this)
            );
            this.flex.cellEditEnding.addHandler(
                this.cellEditEndingHandler.bind(this)
            );
            this.flex.cells.hostElement.addEventListener(
                "click",
                this._onCellClick.bind(this)
            );
            this.flex.copying.addHandler(this.copyingHandler.bind(this));
            this.flex.pastingCell.addHandler(
                this._pastingCellHandler.bind(this)
            );
            this.flex.hostElement.addEventListener(
                "keydown",
                this.onGridKeydown.bind(this)
            );
            this.flex.rowEditStarted.addHandler(
                this._rowEditStarted.bind(this)
            );
            this.flex.cellEditEnded.addHandler(this._cellEditEnded.bind(this));
            this.flex.rowEditEnded.addHandler(
                this.rowEditEndedHandler.bind(this)
            );
            this.flex.resizingColumn.addHandler(
                this.resizingColumnHandler.bind(this)
            );
            this.flex.resizedColumn.addHandler(
                this.resizedColumnHandler.bind(this)
            );
            this.flex.draggedColumn.addHandler(
                this.draggedColumnHandler.bind(this)
            );
            this.flex.scrollPositionChanged.addHandler(
                this.scrollPositionChanged.bind(this)
            );

            if (this.smallRowHeaders) {
                this.resizeRowHeaders(22);
            }

            setTimeout(() => {
                this.toggleDeleteColumn(false);
                //this.appendTooltip();
            }, 200);

            if (this.allowDrag) {
                this._initDragDropHandler();
            }
        }
    }

    public searchData(input) {
        this.onSearchCellcChanged.emit(input.target.value);
    }

    public addPerfectScrollbar() {
        this._addPerfectScrollbar();
    }

    public checkGridHasScrollbars() {
        this._checkGridHasScrollbars();
    }

    public deleteRows() {
        this._deleteRows();
    }

    /**
     * setAutoSizeColumns
     */
    public setAutoSizeColumns() {
        if (this.wijmoDataSource && this.wijmoDataSource.columns) {
            setTimeout(() => {
                if (this.wijmoDataSource && this.wijmoDataSource.columns) {
                    (this.wijmoDataSource.columns as Array<any>).forEach(
                        (col, index) => {
                            if (col.autoSize) {
                                this.flex.autoSizeColumn(index);
                            }
                        }
                    );
                }
            });
        }
    }

    public selectionChangingHandler(s, e) {
        if (this.cheatCounter == 1) {
            this.cheatCounter = 0;
            e.cancel = true;
            return;
        }
        this.cheatCounter++;
        this.resetCheatCounter();

        if (this.isGlobalSearch) {
            if (this.needCheckGlobalSearchDirty) {
                e.cancel = true;
                let selectingCell = {
                    row: e.row,
                    col: e.col,
                };
                this.onSelectionChanging.emit(selectingCell);
            } else {
                this.needCheckGlobalSearchDirty = true;
            }
        } else {
            if (this._isFormDirty) {
                e.cancel = true;
                this.onBeforeSelectionChange.emit(e);
            } else if (this.disabledAll) {
                e.cancel = true;
            }
        }
    }

    private resetCheatCounter() {
        setTimeout(() => {
            this.cheatCounter = 0;
        }, 10);
    }

    public selectionChangedHandler(s, e) {
        this._selectionChangedHandler(e);
    }

    public beginningEditHandler(s, e) {
        this._beginningEditHandler(s, e);
    }

    public sortingColumnHandler(s, e) {
        let column = this.flex.getColumn(e.col);
        let hasBorderStatus = false;
        for (let col of this.flex.columns) {
            if (col._hdr === "BorderStatus") {
                hasBorderStatus = true;
                break;
            }
        }
        if (
            hasBorderStatus &&
            this.checkBoxColumnsName.indexOf(column.binding) > -1
        )
            e.cancel = true;
    }

    public collectionChangedHandler(s, e) {
        this._collectionChangedHandler(s, e);
    }

    public rowEditEndedHandler(s, e) {
        this._rowEditEndedHandler(s, e);
    }

    public cellEditEndingHandler(s, e) {
        this._cellEditEndingHandler(s, e);
    }

    public hasUnsavedRows() {
        return this._hasUnsavedRows();
    }

    public getWijmoGridData() {
        return this._getWijmoGridData();
    }

    public getWillDeletedItems() {
        return this._getWillDeletedItems();
    }

    public resizingColumnHandler(s, e) {
        this._resizingColumnHandler(s, e);
    }

    public validateCells(item, property) {
        if (this.disabledAll) {
            return null;
        }

        if (this.resizing) {
            return null;
        }

        if (this.readOnly || !item || !property) {
            this._errorObject = this._buildErrorObject(
                this._errorObject,
                item,
                property,
                false
            );
            return null;
        }

        const column = this.gridColumns.find((col) => col.data === property);

        if (!column) {
            this._errorObject = this._buildErrorObject(
                this._errorObject,
                item,
                property,
                false
            );
            return null;
        }

        if (this.datatableService.hasValidation(column, "IsRequired")) {
            if (
                isNil(item[property]) ||
                item[property] === "" ||
                item[property] === 0 ||
                (typeof item[property] === "object" && !item[property]["key"])
            ) {
                this._errorObject = this._buildErrorObject(
                    this._errorObject,
                    item,
                    property,
                    true
                );
                return "Field is required";
            }
        }

        if (this.datatableService.hasValidation(column, "RequiredFrom")) {
            let fromFieldName =
                this.datatableService.getSettingContainsValidation(
                    column.setting.Setting
                ).Validation.RequiredFrom;

            if (
                !isNil(item[fromFieldName]) &&
                item[fromFieldName] !== "" &&
                (isNil(item[property]) ||
                    item[property] === "" ||
                    item[property] === 0 ||
                    (typeof item[property] === "object" &&
                        !item[property]["key"]))
            ) {
                this._errorObject = this._buildErrorObject(
                    this._errorObject,
                    item,
                    property,
                    true
                );
                return "Field is required";
            }
        }

        if (this.datatableService.hasValidation(column, "Comparison")) {
            if (
                isNil(item[property]) ||
                item[property] === "" ||
                item[property] === 0 ||
                (typeof item[property] === "object" && !item[property]["key"])
            ) {
                this._errorObject = this._buildErrorObject(
                    this._errorObject,
                    item,
                    property,
                    true
                );
                let compareThem = {
                    "<=": (x, y) => {
                        return x <= y;
                    },
                    "<": (x, y) => {
                        return x < y;
                    },
                    "=": (x, y) => {
                        return x == y;
                    },
                    ">": (x, y) => {
                        return x > y;
                    },
                    ">=": (x, y) => {
                        return x >= y;
                    },
                };

                let comparisonRules =
                    this.datatableService.getSettingContainsValidation(
                        column.setting.Setting
                    ).Validation.Comparison;
                for (let i = 0; i < comparisonRules.length; i++) {
                    let leftData = parseFloat(item[property]) || 0.0;
                    let rightData =
                        parseFloat(item[comparisonRules[i].With]) || 0.0;
                    if (
                        compareThem[comparisonRules[i].Operator](
                            leftData,
                            rightData
                        ) === false
                    ) {
                        return comparisonRules[i].ErrorMessage;
                    }
                }
            }
        }

        if (this.datatableService.hasValidation(column, "ValidationRange")) {
            if (
                isNil(item["ValidationRangeFrom"]) ||
                isNil(item["ValidationRangeTo"])
            ) {
                return null;
            }

            if (
                !(
                    item[property] >= item["ValidationRangeFrom"] &&
                    item[property] <= item["ValidationRangeTo"]
                )
            ) {
                this._errorObject = this._buildErrorObject(
                    this._errorObject,
                    item,
                    property,
                    true
                );
                return (
                    property +
                    " must be in the range of " +
                    item["ValidationRangeFrom"] +
                    " and " +
                    item["ValidationRangeTo"]
                );
            }
        }

        if (this.datatableService.hasValidation(column)) {
            const regexData =
                this.datatableService.buildWijmoGridValidationExpression(
                    item,
                    column
                );
            if (regexData && regexData.Regex) {
                const regex = new RegExp(
                    decodeURIComponent(regexData.Regex),
                    "g"
                );

                if (!regex.test(item[property])) {
                    this._errorObject = this._buildErrorObject(
                        this._errorObject,
                        item,
                        property,
                        true
                    );
                    if (regexData.ErrorMessage) {
                        return regexData.ErrorMessage;
                    } else {
                        return "Invalid";
                    }
                }
            }
        }

        this._errorObject = this._buildErrorObject(
            this._errorObject,
            item,
            property,
            false
        );
        return null;
    }

    hasError() {
        if (!this.gridData) {
            return false;
        }

        this._hasValidationError = false;

        let hasError = this._hasError();
        if (hasError.result) {
            let itemHasError = this.gridData.items.find(
                (i) => i.DT_RowId == hasError.rowID
            );
            if (itemHasError && !itemHasError.deleted) {
                this._hasValidationError = true;
            }
        }

        return this._hasValidationError;
    }

    lostFocus() {
        this._lostFocus();
    }

    addNewRow(data?) {
        this._addNewRow(data);
    }

    deleteRowByRowId(rowId: any) {
        this._deleteRowByRowId(rowId);
    }

    getColumnLayout() {
        return this._getColumnLayout();
    }

    resizedColumnHandler(s, e) {
        this._resizedColumnHandler(s, e);
    }

    draggedColumnHandler(s, e) {
        this._resizedColumnHandler(s, e);
    }

    onRowDblclicked(s: wjcGrid.FlexGrid, e: any) {
        this._onRowDblclicked(s, e);
    }

    refresh() {
        this._refresh();
    }

    currentPageChanged(event: IPageChangedEvent): void {
        if (this.flex) {
            this.flex.select(new wjcGrid.CellRange(-1, -1, -1, -1));
        }
        this.onPageChanged.emit(event);
    }

    selectFirstRow() {
        this._selectFirstRow();
    }

    selectRowIndex(index: number) {
        this._selectRowIndex(index);
    }

    //Please don't use timeout in this function, contact author for detail.
    deselectRow() {
        if (this.flex && this.flex.rows && this.flex.rows.length) {
            this.flex.select(new wjcGrid.CellRange(-1, 1, -1, 1));
        }
    }

    selectCell(iRow: number, iCol: number) {
        this._selectCell(iRow, iCol);
    }

    doSearch(value: string) {
        if (!value) {
            this.isSearching = false;
            return;
        }

        if (this.search == value) return;

        this.isSearching = true;
        this.search = value;
        this.hightlightKeywords = value;
        this._applySearch();
    }

    searchClicked($event) {
        if (!this.search) {
            this.isSearching = false;
            return;
        }

        this.isSearching = true;
        this.hightlightKeywords = this.search;
        this._applySearch();
        setTimeout(() => {
            this.flex.refresh(true);
        });
    }

    exportToPdf(fileName) {
        gridPdf.FlexGridPdfConverter.export(this.flex, fileName + ".pdf");
    }

    public turnOnStarResizeMode() {
        this._turnOnStarResizeMode();
    }

    public turnOffStarResizeMode() {
        this._turnOffStarResizeMode();
    }

    copyingHandler(s: wjcGrid.FlexGrid, e: any) {
        this._copyingHandler(s, e);
    }

    format(data: any, formatPattern: string) {
        const result = !data
            ? ""
            : this.uti.formatLocale(new Date(data), formatPattern);
        return result;
    }

    public invalidate() {
        this._invalidate();
    }

    public wordWrapColumnsHeader() {
        this._wordWrapColumnsHeader();
    }

    public onAutoCompleteLostFocus(control) {
        if (!control.selectedValue) {
            control.text = null;
        }
    }

    public selectedItem(): any {
        return this.gridData.currentItem;
    }

    public setDatasouceForGrid(dataSource, config) {
        if (!dataSource) return;

        let processData = () => {
            this.wijmoDataSource = this.datatableService.buildWijmoDataSource(
                dataSource,
                config
            );
            this.wijmoDataSource = this.preOrderColumnBeforeApplyColumn(
                this.wijmoDataSource
            );

            this.gridData = new wjcCore.CollectionView(
                this.wijmoDataSource.data,
                {
                    getError: this.validateCells,
                    sortComparer: this.sortComparer,
                }
            );

            this.gridData.trackChanges = true;
            this.gridData.collectionChanged.addHandler(
                this.collectionChangedHandler
            );

            if (!this.autoSelectFirstRow && this.gridData.items.length !== 1) {
                this.gridData.currentItem = null;
            }

            this._toggleNoDataMessage();

            this.deletedItemList = [];
            if (this.gridData.items.length) {
                const deletedItems = this.gridData.items.filter(
                    (i) => i.deleted === true
                );
                if (deletedItems && deletedItems.length) {
                    for (const item of deletedItems) {
                        this.deletedItemList.push(item);
                    }
                }
            }

            if (
                this.widgetReloadMode === ReloadMode.UpdatingData &&
                this._filter
            ) {
                this._applyFilter(true);
            } else {
                this.resetFilterPopup();
            }

            if (
                this.isColumnsChanged(
                    this.gridColumns,
                    this.wijmoDataSource.columns
                )
            ) {
                this.gridColumns = this.wijmoDataSource.columns;
                this.filterColumns =
                    this.datatableService.buildWijmoFilterColumns(
                        this.gridColumns,
                        config,
                        this.noFilterColumns
                    );

                if (this.flex) {
                    const groupByColumn = this._getGroupByColumn(
                        this.gridColumns
                    );
                    if (groupByColumn) {
                        this._applyGroupBy(groupByColumn);
                    }

                    this._updateColumnLayoutFromState();
                    //this.checkGridHasScrollbars();
                    this.selectRowIndex(this.activeRowIndex);
                    this.setAutoSizeColumns();

                    if (this.smallRowHeaders) {
                        this.resizeRowHeaders(22);
                    }

                    if (this.wordWrapHeader) {
                        this.wordWrapColumnsHeader();
                    }

                    setTimeout(() => {
                        this.toggleDeleteColumn(false);
                        this.onAfterFlexgridRendered.emit();
                        //this.addPerfectScrollbar();
                    }, 200);

                    if (this.showTotalRowLocal) {
                        this._addFooterRow(this.flex);
                    } else {
                        this.flex.columnFooters.rows.clear();
                    }
                }
            }
            setTimeout(() => {
                if (this.selectedRow) {
                    this.flex.select(
                        new wjcGrid.CellRange(this.selectedRow.r, -1),
                        true
                    );
                }
            }, 200);
        };

        if (this.resetDatasouceWhenChanged) {
            if (this.wijmoDataSource) {
                this.wijmoDataSource.data = [];
                this.wijmoDataSource.columns = [];
                this.gridData = null;
                this.gridColumns = [];
            }

            setTimeout(() => {
                processData();
            });
        } else {
            processData();
        }
    }

    public hasReadOnlyCells(dataItem) {
        if (!dataItem || !dataItem.length) return false;

        if (this.readOnlyCells && this.readOnlyCells.length) {
            for (let i = 0; i < this.readOnlyCells.length; i++) {
                if (
                    dataItem[this.readOnlyCells[i].name] ==
                    this.readOnlyCells[i].value
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    public changeEnterKeyAction(keyAction: wjcGrid.KeyAction) {
        if (this.flex) {
            this.flex.keyActionEnter = keyAction;
        }
    }

    public firstVisibleCellIndex() {
        return this._firstVisibleCellIndex();
    }

    private preOrderColumnBeforeApplyColumn(dataSource): any {
        if (
            !this.widgetId ||
            !this.columnsLayoutSettings ||
            !this.columnsLayoutSettings.settings ||
            !dataSource.columns ||
            !dataSource.columns.length
        ) {
            return dataSource;
        }
        let result = {
            columns: [],
            data: dataSource.data,
        };

        if (
            this.widgetId &&
            this.columnsLayoutSettings &&
            this.columnsLayoutSettings.settings &&
            typeof this.columnsLayoutSettings.settings === "string"
        ) {
            let settings = JSON.parse(this.columnsLayoutSettings.settings);
            if (settings && settings.columns && settings.columns.length) {
                if (settings.columns.length == dataSource.columns.length) {
                    settings.columns.forEach((x) => {
                        let col = dataSource.columns.find(
                            (y) => y.data == x.binding
                        );
                        if (col) {
                            result.columns.push(col);
                        }
                    });
                } else {
                    return dataSource;
                }
            }
        }
        return result;
    }

    private _wordWrapColumnsHeader() {
        if (this.flex) {
            setTimeout(() => {
                if (
                    this.flex.columnHeaders &&
                    this.flex.columnHeaders.rows.length
                ) {
                    var row = this.flex.columnHeaders.rows[0];
                    row.wordWrap = true;

                    // autosize first header row
                    this.flex.autoSizeRow(0, true);
                }
            }, 500);
        }
    }

    private _invalidate() {
        if (this.flex) {
            this.flex.invalidate();
        }
    }

    private onGridKeydown(e) {
        const n = window.event ? e.which : e.keyCode;
        if (
            (n === 9 && e.which == 9) ||
            (n === 13 &&
                e.which == 13 &&
                this.flex.keyActionEnter === wjcGrid.KeyAction.MoveAcross)
        ) {
            let selectedCellRange = this.flex.selection;
            let nextCell: any = {
                col: this._nextVisibleColumn(selectedCellRange.col, this.flex),
                row: selectedCellRange.row,
            };

            if (
                nextCell.col == this.flex.columns.length &&
                nextCell.row == this.flex.rows.length
            ) {
                let firstVisibleCell = this.firstVisibleCellIndex();
                if (firstVisibleCell) {
                    nextCell.col = firstVisibleCell.c;
                }
                nextCell.row = 0;
            } else if (nextCell.col == this.flex.columns.length) {
                let firstVisibleCell = this.firstVisibleCellIndex();
                if (firstVisibleCell) {
                    nextCell.col = firstVisibleCell.c;
                }
                nextCell.row += 1;

                if (nextCell.row == this.flex.rows.length) {
                    nextCell.row = 0;
                }
            }

            this.flex.select(
                new wjcGrid.CellRange(
                    nextCell.row,
                    nextCell.col,
                    nextCell.row,
                    nextCell.col
                )
            );
        }

        // Enter Key
        if (n == 13) {
            if (
                this.flex &&
                this.flex.selectedRows &&
                this.flex.selectedRows.length
            ) {
                this.onEnterPress.emit(this.flex.selectedRows[0].dataItem);
            }
        }

        if (n == 32) {
            let selectedCellRange = this.flex.selection;
            let flexCol = this.flex.getColumn(<any>selectedCellRange.col);
            if (flexCol) {
                let gridCol = this.gridColumns.find(
                    (x) => x.data === flexCol.binding
                );
                if (
                    gridCol &&
                    (gridCol.dataType == "Boolean" ||
                        gridCol.data == this.CONTROL_COLUMNS.deleted ||
                        gridCol.data == this.CONTROL_COLUMNS.selectAll) &&
                    $(e.target).find("mat-checkbox").length
                ) {
                    let row = this.flex.rows[selectedCellRange.row];
                    if (row) {
                        let item = row.dataItem;
                        this.onCheckboxChanged(item, flexCol.binding, {
                            checked: !item[flexCol.binding],
                        });
                    }
                }
            }
        }
    }

    private _nextVisibleColumn(curColIndex: number, flex: wjcGrid.FlexGrid) {
        if (curColIndex === flex.columns.length - 1) {
            return flex.columns.length;
        }

        for (let i: any = curColIndex + 1; i < flex.columns.length; i++) {
            const column = flex.columns.getColumn(i);
            if (column && column.visible) {
                return i;
            }
        }

        return flex.columns.length;
    }

    private _copyingHandler(s: wjcGrid.FlexGrid, e: any) {
        const colBinding = this.flex.columns[e.col]["binding"],
            cellData = this.gridData.currentItem[colBinding];

        wjcCore.Clipboard.copy(cellData.toString());
        e.cancel = true;
    }

    private _onCellClick(e) {
        this.onCellClick.emit(this.flex.selection);
    }

    private _rowEditStarted(s, e) {
        if (!this.readOnly) {
            this.onTableEditStart.emit(true);

            this.hasValidationError.emit(this.hasError());

            this.toggleDeleteColumn(true);

            let currentFlexCol = this.flex.getColumn(e.col),
                row = s.rows[e.row],
                item = row.dataItem;
            if (
                e &&
                currentFlexCol &&
                e._data instanceof KeyboardEvent &&
                e.panel &&
                e.panel._activeCell &&
                e.panel._activeCell.className.indexOf("in-active-cell") > -1 &&
                !currentFlexCol.isReadOnly &&
                (!item["BorderStatus"] || item["BorderStatus"] !== "1")
            ) {
                if (
                    item.hasOwnProperty("isActiveDisableRow") &&
                    !item["isActiveDisableRow"]
                ) {
                    item["isActiveDisableRow"] = true;
                }

                if (item.hasOwnProperty("IsActive") && !item["IsActive"]) {
                    item["IsActive"] = true;
                }
            }
        }
    }

    private _toggleTooltip() {
        if (this.showTooltip && this.tooltipField) {
            $("i[id^=info-icon-]", this.flex.hostElement).hide();
            if (this.gridData.currentItem) {
                $(
                    "i#info-icon-" + this.gridData.currentItem.DT_RowId,
                    this.flex.hostElement
                ).show();
            }
        }
    }

    private _pastingCellHandler(p: any, e: any) {
        const isNotTheSelectingCell =
            !p.selection ||
            p.selection.col !== e.col ||
            p.selection.row !== e.row;
        const isComboboxCell = this.gridColumns[e.col].dataType === "Object";

        e.cancel = isNotTheSelectingCell || isComboboxCell;
    }

    private registerContextMenu() {
        if (this.showContextMenu) {
            this.flex.addEventListener(
                this.flex.hostElement,
                "contextmenu",
                (e) => {
                    this.showCtxItem = false;
                    const ht = this.flex.hitTest(e);
                    const selection = this.flex.selection;
                    if (selection.row !== ht.row || selection.col !== ht.col) {
                        this.flex.select(
                            new wjcGrid.CellRange(
                                ht.row,
                                ht.col,
                                ht.row,
                                ht.col
                            )
                        );
                    } else {
                        this.gridItemRightClick.emit(this.flex.selectedItems);
                    }

                    let item = this.flex.rows[ht.row].dataItem;

                    const binding = this.flex.columns[ht.col].binding;
                    if (
                        binding == this.CONTROL_COLUMNS.Priority &&
                        !this.readOnly
                    ) {
                        if (
                            !$(e.target).hasClass("wj-form-control") &&
                            !$(e.target).hasClass("wj-btn") &&
                            !$(e.target).hasClass("wj-glyph-down")
                        ) {
                            this.deletePriorityForCurrentItem(item);
                        }
                    } else {
                        setTimeout(() => {
                            this.showCtxItem = true;

                            this.ref.detectChanges();
                        }, 300);
                    }
                }
            );
        }
    }

    private _selectFirstRow() {
        setTimeout(() => {
            if (this.flex.rows.length) {
                this.flex.select(new wjcGrid.CellRange(0, -1, 0, -1));
            }
        }, 200);
    }

    private _selectRowIndex(index: number) {
        setTimeout(() => {
            if (
                this.flex &&
                this.flex.rows &&
                this.flex.rows.length &&
                !isNil(index)
            ) {
                this.flex.select(new wjcGrid.CellRange(index, -1, index, -1));
            }
        }, 200);
    }

    private _selectCell(iRow: number, iCol: number) {
        if (
            this.flex &&
            this.flex.rows &&
            this.flex.rows.length &&
            !isNil(iRow) &&
            !isNil(iCol) &&
            this.flex.rows.length > iRow &&
            this.flex.columns.length > iCol
        ) {
            this.flex.select(new wjcGrid.CellRange(iRow, iCol, iRow, iCol));
        }
    }

    private _refresh() {
        this.isMarkedAsDelete = false;
        this.isSelectDeletedAll = false;
        setTimeout(() => {
            this.flex.refresh(true);
        }, 100);
    }

    private _buildErrorObject(errorObject, item, property, hasError) {
        if (item["DT_RowId"]) {
            if (!this._errorObject[item["DT_RowId"]]) {
                this._errorObject[item["DT_RowId"]] = {};
            }
            this._errorObject[item["DT_RowId"]][property] = hasError;
        }

        return errorObject;
    }

    private _hasError() {
        for (const prop in this._errorObject) {
            if (prop) {
                for (const childProp in this._errorObject[prop]) {
                    if (this._errorObject[prop][childProp]) {
                        return {
                            rowID: prop,
                            result: true,
                        };
                    }
                }
            }
        }

        return {
            rowID: null,
            result: false,
        };
    }

    private _onRowDblclicked(s: wjcGrid.FlexGrid, e: any) {
        if (s.activeEditor) {
            return;
        }

        this.isDoubleClick = true;
        if (s.selectedRows.length) {
            let col: any = s.hitTest(e).col;
            let currentFlexCol = this.flex.getColumn(col);

            if (!currentFlexCol) {
                return;
            }

            let result = s.selectedRows[0].dataItem;
            // isReadOnlyColumn: use as constant
            result["isReadOnlyColumn"] = currentFlexCol.isReadOnly;
            this.onRowDoubleClick.emit(result);
            this._toggleTooltip();
        }
    }

    private _updateColumnLayoutFromState() {
        setTimeout(() => {
            if (this.fitWidth) {
                this.turnOnStarResizeMode();
            } else if (
                this.columnsLayoutSettings &&
                this.columnsLayoutSettings.settings
            ) {
                this.updateColumnWidth(
                    this.flex.columns,
                    this.columnsLayoutSettings.settings
                );
            }
        });
    }

    private updateColumnWidth(columns, columnLayout) {
        if (!columns.length || typeof columnLayout !== "string") {
            return;
        }
        const columnLayoutObj = JSON.parse(columnLayout);
        if (
            columnLayoutObj &&
            columnLayoutObj.columns &&
            columnLayoutObj.columns.length == columns.length
        ) {
            for (let i = 0; i < columnLayoutObj.columns.length; i++) {
                if (columnLayoutObj.columns[i])
                    columns[i].width = columnLayoutObj.columns[i].width;
            }
        }
    }

    private _subscribeRequestRefreshState() {
        this.requestRefreshSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === GridActions.REQUEST_REFRESH &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.refresh();
                });
            });
    }

    private _subscribeRequestInvalidateState() {
        this.requestInvalidateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === GridActions.REQUEST_INVALIDATE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.invalidate();
                });
            });
    }

    private _itemFormatterFunc(panel, r, c, cell) {
        if (this.resizing) {
            return;
        }

        if (this.localWidgetStyle) {
            let rootElement = $("div[wj-part='root']", this.flex.hostElement);
            if (rootElement.length) {
                if (!isNil(this.localWidgetStyle.backgroundColor)) {
                    rootElement.get(0).style.backgroundColor =
                        this.localWidgetStyle.backgroundColor;
                } else if (
                    !isNil(this.localWidgetStyle.globalBackgroundColor)
                ) {
                    rootElement.get(0).style.backgroundColor =
                        this.localWidgetStyle.globalBackgroundColor;
                }
            }
        }

        if (panel.cellType === wjcGrid.CellType.TopLeft) {
            if (this.flex.hostElement) {
                this.popupPosition.top = this.flex.hostElement.clientHeight + 6;
            }

            const filterSpan = $("span.wj-glyph-filter", cell);
            if (!filterSpan.length) {
                const ele = $(
                    '<span class="wj-glyph-filter" id="btnPopup"></span>'
                );
                $(cell).append(ele);
                ele.bind("click", (eve) => {
                    this.isShowingPopupFilter = true;
                    setTimeout(() => {
                        $("input#xn-input" + this._randomNo).focus();
                        $("input#xn-input" + this._randomNo).val(
                            $("input#xn-input" + this._randomNo).val()
                        );
                    }, 1000);
                });

                if (this._filter.length) {
                    $(cell).addClass("has-filter-text");
                }
            }
        }

        const qtyWithColor = "qtywithcolor";
        if (panel.cellType === wjcGrid.CellType.ColumnHeader) {
            if (
                !this.readOnly &&
                (!panel.columns[c].isReadOnly ||
                    !isNil(
                        Object.keys(this.CONTROL_COLUMNS).find(
                            (x) => x === panel.columns[c].binding
                        )
                    ))
            ) {
                cell.style.borderBottom = "3px solid orange";
            } else {
                cell.style.borderBottom = "";
            }
            const binding = panel.columns[c].binding;
            if (
                this.enableQtyWithColor &&
                binding &&
                binding.toLowerCase() === qtyWithColor
            ) {
                cell.classList.value = cell.classList.value + " qty-with-color";
            }

            if (this.hasQuantityPriorityColumn) {
                const flexCol = panel.columns[c];
                const gridCol = this.gridColumns.find(
                    (c) => c.data == flexCol.binding
                );

                if (gridCol.controlType == "QuantityPriority") {
                    $(cell).addClass("no-padding");

                    if (!this.readOnly) {
                        cell.style.borderBottom = "3px solid orange";
                    }

                    this.stopQuantityPriorityEditMode();
                }
            }

            if (
                !this.localGridStyle ||
                isEmpty(this.localGridStyle.headerStyle)
            ) {
                return;
            }

            cell.style.color = this.isDesignWidgetMode
                ? "black"
                : this.localGridStyle.headerStyle["color"];
            cell.style.fontFamily =
                this.localGridStyle.headerStyle["font-family"];
            cell.style.fontSize = this.localGridStyle.headerStyle["font-size"];
            cell.style.fontWeight =
                this.localGridStyle.headerStyle["font-weight"];
            cell.style.fontStyle =
                this.localGridStyle.headerStyle["font-style"];
            cell.style.textDecoration =
                this.localGridStyle.headerStyle["text-decoration"];
        }

        // append the validation icon for row header.
        if (panel.cellType === wjcGrid.CellType.RowHeader) {
            if ($(cell).hasClass("wj-state-invalid")) {
                const span =
                    '<i class="fa fa-info-circle  text-danger" style="font-size: 19px;"></i>';
                $(cell).append(span);
            }

            let borderStatusColumn = this.gridColumns.find((col) => {
                return this.datatableService.hasControlType(
                    col,
                    "BorderStatus"
                );
            });
            if (borderStatusColumn) {
                const item = panel.rows[r].dataItem;
                if (item[borderStatusColumn.data] == 1) {
                    // $(cell).addClass('border-status-red left-border top-bot-border');
                    $(cell).addClass("background-status-red");
                }
            }

            if (this.showTooltip && this.tooltipField) {
                let data = this.flex.getCellData(r, c, true);
                if (this.tooltipField) {
                    data = this.flex.rows[r]["dataItem"][this.tooltipField];
                }

                if (data) {
                    const span =
                        `<i id="info-icon-` +
                        this.flex.rows[r]["dataItem"].DT_RowId +
                        `" class="fa fa-info-circle text-info" style="font-size: 19px;display:none"></i>`;
                    $(cell).append(span);

                    let toolTip = new wjcCore.Tooltip();
                    cell.addEventListener("mouseenter", (e) => {
                        let ht = this.flex.hitTest(e),
                            rng = null;

                        if (!ht.range.equals(rng)) {
                            if (ht.cellType == wjcGrid.CellType.RowHeader) {
                                rng = ht.range;
                                let data = this.flex.getCellData(
                                    rng.row,
                                    rng.col,
                                    true
                                );
                                if (this.tooltipField) {
                                    data =
                                        this.flex.rows[rng.row]["dataItem"][
                                            this.tooltipField
                                        ];
                                }
                                let tipContent = data
                                        ? `<strong>${data}</strong>`
                                        : "",
                                    cellElement = document.elementFromPoint(
                                        e.clientX,
                                        e.clientY
                                    ),
                                    cellBounds = wjcCore.Rect.fromBoundingRect(
                                        cellElement
                                            ? cellElement.getBoundingClientRect()
                                            : <any>{
                                                  top: 0,
                                                  width: 0,
                                                  bottom: 0,
                                                  height: 0,
                                              }
                                    );

                                if (
                                    $(
                                        "i#info-icon-" +
                                            this.flex.rows[rng.row]["dataItem"]
                                                .DT_RowId,
                                        this.flex.hostElement
                                    ).is(":visible")
                                ) {
                                    toolTip.show(
                                        this.flex.hostElement,
                                        tipContent,
                                        cellBounds
                                    );
                                }
                            }
                        }
                    });
                    cell.addEventListener("mouseout", (e) => {
                        toolTip.hide();
                    });
                }
            }
        }

        if (
            panel.rows[r] instanceof wjcGrid.GroupRow &&
            panel.cellType !== wjcGrid.CellType.RowHeader
        ) {
            if (!this.groupByColumn || !this.groupByColumn.groupDisplayColumn) {
                return;
            }

            let span =
                '<span class="wj-elem-collapse wj-glyph-down-right"></span>'; // html for expand/collapse group
            const flex = panel.grid,
                value = flex.rows[r].dataItem.name, // get group header name
                count = flex.rows[r].dataItem.items.length, // get items in group,
                newValue = this._buildGridGroupTitle(
                    this.gridData.items,
                    value,
                    this.groupByColumn
                );

            if (flex.rows[r].isCollapsed)
                span = '<span class="wj-elem-collapse wj-glyph-right"></span>';

            cell.innerHTML =
                span + " <b>" + newValue + "</b> (" + count + " items)";
        }

        if (panel.cellType === wjcGrid.CellType.Cell) {
            const item = panel.rows[r].dataItem;
            const prop = panel.columns[c].binding;

            if (prop && item) {
                let tooltip = new wjcCore.Tooltip();
                //let currentElement: any;
                cell.addEventListener("mouseenter", (e) => {
                    let rng = null;
                    let _ht = this.flex.hitTest(e);
                    if (!_ht.range.equals(rng)) {
                        if (_ht.cellType == wjcGrid.CellType.Cell) {
                            rng = _ht.range;
                            let cellElement: any = cell,
                                cellBounds = this.flex.getCellBoundingRect(
                                    _ht.row,
                                    _ht.col
                                ),
                                tooltipContent = this.flex.getCellData(
                                    rng.row,
                                    rng.col,
                                    false
                                );

                            //if ($(currentElement).is($(cellElement))) {
                            //    return;
                            //}

                            //currentElement = cellElement;

                            if (
                                cellElement.className.indexOf(
                                    "mat-checkbox-inner-container"
                                ) === -1 &&
                                !this.checkWidthInARound(
                                    cellElement.clientWidth || 0,
                                    cellElement.scrollWidth || 0,
                                    2
                                )
                            ) {
                                if (
                                    tooltipContent &&
                                    typeof tooltipContent === "object"
                                ) {
                                    tooltipContent = tooltipContent.value;
                                }

                                if (
                                    tooltipContent === true ||
                                    tooltipContent === "true"
                                ) {
                                    tooltipContent = "Activate";
                                }

                                if (
                                    tooltipContent === false ||
                                    tooltipContent === "false"
                                ) {
                                    tooltipContent = "Deactivate";
                                }

                                if (tooltipContent) {
                                    tooltipContent = tooltipContent || "";
                                    tooltipContent = tooltipContent + "";
                                    tooltipContent = tooltipContent.replace(
                                        /#/g,
                                        "\\#"
                                    );
                                    tooltip.show(
                                        this.flex.hostElement,
                                        tooltipContent,
                                        cellBounds
                                    );
                                }
                            } else {
                                tooltip.hide();
                            }
                        }
                    }
                });
                cell.addEventListener("mouseout", (e) => {
                    tooltip.hide();
                });

                if (isObject(item[prop]) && isEmpty(item[prop])) {
                    item[prop] = "";
                    cell.innerHTML = "";
                }

                if (
                    isObject(item[prop]) ||
                    panel.columns[c].dataType === wjcCore.DataType.Date
                ) {
                    if ($(cell).find("input").length) {
                        $(cell).css("padding-left", 0);
                        $(cell).css("padding-right", 0);
                    }
                }

                let column = this.gridColumns.find((c) => c.data == prop);
                if (
                    column &&
                    !this.isReadonlyColumn(column) &&
                    column.dataType !== "Date" &&
                    column.dataType !== "Boolean" &&
                    column.dataType !== "Object" &&
                    column.dataType !== "Number" &&
                    !this.CONTROL_COLUMNS[prop] &&
                    !this.checkBoxColumnsName[prop] &&
                    column.controlType !== "Button" &&
                    column.controlType !== "Numeric" &&
                    column.controlType !== "Icon" &&
                    column.controlType !== "Image" &&
                    column.controlType !== "CountryFlag" &&
                    column.controlType !== "Autocomplete" &&
                    column.controlType !== "CreditCard"
                ) {
                    $(cell).append(
                        '<button style="position:absolute;right:0;top:0;bottom:0;border-radius:0;opacity:0" class="expand-btn btn btn-xs btn-default"><i class="fa fa-ellipsis-v"></i></button>'
                    );
                    $(cell).hover(
                        function () {
                            $(this).find("button.expand-btn").css("opacity", 1);
                        },
                        function () {
                            $(this).find("button.expand-btn").css("opacity", 0);
                        }
                    );

                    if (
                        $(cell).find("input[type=text].wj-grid-editor").length
                    ) {
                        $(cell).trigger("mouseenter");
                    }

                    $(cell)
                        .find("button.expand-btn")
                        .on("click", (e) => {
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            e.preventDefault();

                            this.showCellEditDialog = true;

                            setTimeout(() => {
                                if (this.cellEditDialog) {
                                    this.cellEditDialog.cellData.value =
                                        this.flex.getCellData(r, c, true);
                                    this.cellEditDialog.cellData.r = r;
                                    this.cellEditDialog.cellData.c = c;
                                    this.cellEditDialog.cellData.title =
                                        column.title;
                                    this.cellEditDialog.cellData.data =
                                        column.data;
                                }
                            }, 200);

                            this.ref.detectChanges();
                        });
                }

                if (
                    this.hightlightKeywords &&
                    this.hightlightKeywords.trim() !== "*"
                ) {
                    this.hightlightKeywords = this.hightlightKeywords
                        .split("*")
                        .join("");
                    let regTxt;
                    this.hightlightKeywords = this.hightlightKeywords
                        .trim()
                        .replace(/\?|\+|\%|\>|\<|\$|/g, "");

                    if (
                        / or | and | [&] |[&]| [|] |[|]/i.test(
                            this.hightlightKeywords
                        )
                    ) {
                        this.hightlightKeywords =
                            this.hightlightKeywords.replace(
                                /OR|AND|&|\|/gi,
                                function (matched) {
                                    return "|";
                                }
                            );
                        this.hightlightKeywords = this.hightlightKeywords
                            .trim()
                            .replace(/ +/g, "");
                    } else {
                        this.hightlightKeywords = this.hightlightKeywords
                            .trim()
                            .replace(/ +/g, "|");
                    }
                    if (
                        / [&&] |[&&]| [||] |[||]|/i.test(
                            this.hightlightKeywords
                        )
                    ) {
                        this.hightlightKeywords =
                            this.hightlightKeywords.replace(
                                /&&|\|\|/gi,
                                function (matched) {
                                    return "|";
                                }
                            );
                        this.hightlightKeywords = this.hightlightKeywords
                            .trim()
                            .replace(/ +/g, "");
                    } else {
                        this.hightlightKeywords = this.hightlightKeywords
                            .trim()
                            .replace(/ +/g, "|");
                    }
                    regTxt = new RegExp(this.hightlightKeywords, "gi");
                    if (
                        panel.columns[c].dataType == wjcCore.DataType.String ||
                        panel.columns[c].dataType == wjcCore.DataType.Number
                    ) {
                        cell.innerHTML = cell.innerText.replace(
                            regTxt,
                            function (str) {
                                return (
                                    '<span class="hight-light__keyword">' +
                                    str +
                                    "</span>"
                                );
                            }
                        );
                    }
                }

                if (
                    this.enableQtyWithColor &&
                    prop.toLowerCase() === qtyWithColor
                ) {
                    const _value = item[prop];
                    try {
                        if (!isNil(_value)) {
                            if (parseInt(_value) > 0) {
                                $(cell).addClass("positive-qty");
                            } else if (parseInt(_value) < 0) {
                                $(cell).addClass("negative-qty");
                            }
                        }
                    } catch (ex) {}
                }

                if (item["deleted"]) {
                    if (this.deletedItemList.indexOf(item) !== -1) {
                        $(cell).addClass("deleted-row-text");
                    }
                }

                if (
                    item["isActiveDisableRow"] === false ||
                    item["isActiveDisableRow"] === 0 ||
                    item["IsActive"] === false ||
                    item["IsActive"] === 0
                ) {
                    if (
                        (panel._cols[c].binding != "isActiveDisableRow" &&
                            panel._cols[c].binding != "IsActive") ||
                        item["BorderStatus"] === "1"
                    ) {
                        cell.classList.add("in-active-cell");
                    } else {
                        cell.classList.add("in-active-cell-for-active");
                    }
                }

                if (this.allowSelectAll && this.isDisableRowWithSelectAll) {
                    if (
                        panel._cols[c].binding != "selectAll" &&
                        !item["selectAll"]
                    ) {
                        cell.classList.add("in-active-cell");
                    }
                }

                if (this.disabledAll) {
                    cell.classList.add("in-active-cell");
                }

                if (
                    !isNil(item["IsActive"]) &&
                    !item["IsActive"] &&
                    this.hasDisableRow
                ) {
                    $(cell).addClass("disabled-row-text");
                    // Check if have Priority Column
                    if (
                        item.hasOwnProperty(this.CONTROL_COLUMNS.Priority) &&
                        !Uti.isEmptyObject(
                            item[this.CONTROL_COLUMNS.Priority]
                        ) &&
                        !!item[this.CONTROL_COLUMNS.Priority]
                    ) {
                        this.deletePriorityForCurrentItem(item);
                    }
                }

                if (column && column.fontWeight) {
                    $(cell).css("font-weight", column.fontWeight);
                }

                if (column && column.disabledBy) {
                    let disabledCheckbox =
                        !Uti.isEmptyObject(item) &&
                        item["DT_RowId"].indexOf("newrow") === -1 &&
                        !!item[column.disabledBy];
                    setTimeout(() => {
                        let matChecbox = $(cell).find("mat-checkbox");
                        if (matChecbox.length) {
                            if (disabledCheckbox) {
                                $(matChecbox).addClass("mat-checkbox-disabled");
                            } else {
                                $(matChecbox).removeClass(
                                    "mat-checkbox-disabled"
                                );
                            }
                        }
                    }, 200);
                }
                if (
                    column &&
                    column.data &&
                    Uti.toLowerCase(column.data) ===
                        Uti.toLowerCase(
                            this.CHECKBOX_COLUMNS.unMergeCheckbox
                        ) &&
                    item[this.CHECKBOX_COLUMNS.masterCheckbox]
                ) {
                    cell.classList.add("in-active-cell--control");
                }

                if (this.hasQuantityPriorityColumn) {
                    const item = panel.rows[r].dataItem;
                    const flexCol = panel.columns[c];
                    const gridCol = this.gridColumns.find(
                        (c) => c.data == flexCol.binding
                    );
                    if (gridCol.controlType == "QuantityPriority") {
                        $(cell).addClass("no-padding");
                        this.buildCellColor(cell, item, gridCol);
                    }

                    if (gridCol.data == "Total Qty") {
                        $(cell).css("font-weight", "bold");
                    }
                }
            }
            if (this.allowDrag) {
                cell.draggable = true;
            }

            if (!this.localGridStyle || isEmpty(this.localGridStyle.rowStyle)) {
                return;
            }

            cell.style.color = this.isDesignWidgetMode
                ? "black"
                : this.localGridStyle.rowStyle["color"];
            cell.style.fontFamily = this.localGridStyle.rowStyle["font-family"];
            cell.style.fontSize = this.localGridStyle.rowStyle["font-size"];
            cell.style.fontWeight = this.localGridStyle.rowStyle["font-weight"];
            cell.style.fontStyle = this.localGridStyle.rowStyle["font-style"];
            cell.style.textDecoration =
                this.localGridStyle.rowStyle["text-decoration"];
        }
    }

    private checkWidthInARound(
        width1: number,
        width2: number,
        probability?: number
    ): boolean {
        probability = probability || 1;
        if (width1 + probability == width2 || width1 == width2 + probability)
            return true;
        if (
            width1 + probability > width2 &&
            width1 + probability - width2 <= probability
        )
            return true;
        if (
            width2 + probability > width1 &&
            width2 + probability - width1 <= probability
        )
            return true;
        return false;
    }

    private _initDragDropHandler() {
        const isIE =
            typeof document.createElement("span").dragDrop === "function";

        const createDragContent = function (x, y, offsetX, offsetY, content) {
            const dragImage = document.createElement("div");
            dragImage.innerHTML = content;
            dragImage.style.position = "absolute";
            dragImage.style.pointerEvents = "none";
            dragImage.style.top = "0px"; // Math.max(0, y - offsetY) + 'px';
            dragImage.style.left = "0px"; // Math.max(0, x) + 'px';
            dragImage.style.zIndex = "1000";
            dragImage.classList.add("xn-grid-drag");

            document.body.appendChild(dragImage);

            setTimeout(function () {
                dragImage.style.visibility = "hidden";
            }, 100);

            return dragImage;
        };

        const updateDragContent = function (_node, x, y, offsetX, offsetY) {
            if (_node) {
                _node.style.top = Math.max(0, y) + "px";
                _node.style.left = Math.max(0, x) + "px";
            }
        };

        const flex = this.flex;
        const self = this;
        let node;
        this.flex.hostElement.addEventListener(
            "dragstart",
            function (e) {
                const ht = flex.hitTest(e);
                if (ht.cellType === wjcGrid.CellType.Cell) {
                    flex.select(
                        new wjcGrid.CellRange(
                            ht.row,
                            0,
                            ht.row,
                            flex.columns.length - 1
                        )
                    );
                    let item = flex.rows[ht.row].dataItem;
                    item = mapKeys(item, function (v, k) {
                        return camelCase(k.toString());
                    });
                    e.dataTransfer.setData("text", JSON.stringify(item));
                    if (self.customDragContent) {
                        if (!isIE) {
                            node = createDragContent(
                                e.pageX,
                                e.pageY,
                                e.offsetX,
                                e.offsetY,
                                self.customDragContent
                            );
                            const dataTransfer: any = e.dataTransfer;
                            dataTransfer.setDragImage(node, 5, 5);
                        }
                    }
                    self.isDragging = true;
                }
            },
            true
        );

        this.flex.hostElement.addEventListener(
            "dragend",
            function (e) {
                $(".xn-grid-drag").remove();
                self.isDragging = false;
            },
            true
        );

        /*
        // TODO: Fix IE
        if (isIE) {
            this.flex.hostElement.addEventListener('mousedown', function (e) {
                flex.focus();
                var ht = flex.hitTest(e);
                if (flex.hitTest(e).cellType == wjcGrid.CellType.Cell) {
                    let nodeIE = createImage(e.pageX, e.pageY, e.offsetX, e.offsetY, self.customDragContent);
                    nodeIE.dragDrop();
                    // e.stopPropagation();
                };
            }, true);
        }
        */
    }

    private _resizingColumnHandler(s: wjcCore.CollectionView, e: any) {
        this.resizing = true;
        if (!this.fitWidth && !this._colWidthUpdated) {
            for (let i = 0; i < this.flex.columns.length; i++) {
                if (this.flex.columns[i].width === "*") {
                    this.flex.columns[i].width = this.flex.columns[i].size;
                    this._colWidthUpdated = true;
                }
            }
        }

        this.ref.detach();
    }

    private _turnOffStarResizeMode() {
        for (let i = 0; i < this.flex.columns.length; i++) {
            if (this.flex.columns[i].width === "*") {
                this.flex.columns[i].width = this.flex.columns[i].size;
            }
        }
    }

    private _resizedColumnHandler(s: wjcCore.CollectionView, e: any) {
        this.resizing = false;
        if (this.flex) {
            if (!this.fitWidth && this.widgetId) {
                this.store.dispatch(
                    this.gridActions.setColumnLayout(
                        this.widgetId,
                        this.flex.columnLayout,
                        this.ofModule
                    )
                );
            }
            if (this.columnsLayoutSettings) {
                this.columnsLayoutSettings.settings = this.flex.columnLayout;
                this.onChangeColumnLayout.emit(this.flex.columnLayout);
            }
            this.flex.refresh();

            setTimeout(() => {
                this._updatePerfectScrollbar();
            }, 200);
        }

        this.ref.reattach();
    }

    private _turnOnStarResizeMode() {
        for (let i = 0; i < this.flex.columns.length; i++) {
            if (
                this.flex.columns[i]["binding"] ===
                    this.CONTROL_COLUMNS.deleted ||
                this.flex.columns[i]["binding"] ===
                    this.CONTROL_COLUMNS.download ||
                this.flex.columns[i]["binding"] ===
                    this.CONTROL_COLUMNS.mediaCodeButton ||
                this.flex.columns[i]["binding"] === this.CONTROL_COLUMNS.Edit ||
                this.flex.columns[i]["binding"] ===
                    this.CONTROL_COLUMNS.FilterExtended ||
                this.flex.columns[i]["binding"] ===
                    this.CONTROL_COLUMNS.noExport ||
                this.flex.columns[i]["dataType"] === wjcCore.DataType.Boolean ||
                this.gridColumns.find(
                    (col) =>
                        !isNil(col.width) &&
                        col.data == this.flex.columns[i]["binding"]
                )
            ) {
                continue;
            } else {
                if (this.canBeStarSize(this.flex.columns[i].binding))
                    this.flex.columns[i].width = "*";
            }
        }
    }

    private canBeStarSize(id) {
        return isNil(
            this.gridColumns.find(
                (item) =>
                    item.data === id && (item.autoSize || !isNil(item.width))
            )
        );
    }

    private _addPerfectScrollbar() {
        let flexGrid = $("div[wj-part='root']", this.flex.hostElement).get(0);
        if (flexGrid) {
            Ps.destroy(flexGrid);
            Ps.initialize(flexGrid);

            setTimeout(() => {
                this._updatePerfectScrollbar();

                setTimeout(() => {
                    $(".ps-scrollbar-x-rail", this.flex.hostElement).css(
                        "z-index",
                        999
                    );
                    $(".ps-scrollbar-y-rail", this.flex.hostElement).css(
                        "z-index",
                        999
                    );
                });
            }, 200);
        }
    }

    private _addHorizontalPerfectScrollEvent() {
        $("div[wj-part='root']", this.flex.hostElement).on(
            "ps-scroll-left",
            () => {
                this.hasScrollbars.emit({
                    top: this.scrollUtils.canScrollUpTop,
                    left: this.scrollUtils.canScrollToLeft,
                    right: this.scrollUtils.canScrollToRight,
                    bottom: this.scrollUtils.canScrollDownBottom,
                });
            }
        );

        $("div[wj-part='root']", this.flex.hostElement).on(
            "ps-scroll-right",
            () => {
                this.hasScrollbars.emit({
                    top: this.scrollUtils.canScrollUpTop,
                    left: this.scrollUtils.canScrollToLeft,
                    right: this.scrollUtils.canScrollToRight,
                    bottom: this.scrollUtils.canScrollDownBottom,
                });
            }
        );
    }

    private _removeHorizontalPerfectScrollEvent() {
        $("div[wj-part='root']", this.flex.hostElement).off("ps-scroll-left");
        $("div[wj-part='root']", this.flex.hostElement).off("ps-scroll-right");
        $("div[wj-part='root']", this.flex.hostElement).off("ps-x-reach-end");
        $("div[wj-part='root']", this.flex.hostElement).off("ps-x-reach-start");
    }

    private _addVerticalPerfectScrollEvent() {
        $("div[wj-part='root']", this.flex.hostElement).on(
            "ps-scroll-up",
            () => {
                this.hasScrollbars.emit({
                    top: this.scrollUtils.canScrollUpTop,
                    left: this.scrollUtils.canScrollToLeft,
                    right: this.scrollUtils.canScrollToRight,
                    bottom: this.scrollUtils.canScrollDownBottom,
                });
            }
        );

        $("div[wj-part='root']", this.flex.hostElement).on(
            "ps-scroll-down",
            () => {
                this.hasScrollbars.emit({
                    top: this.scrollUtils.canScrollUpTop,
                    left: this.scrollUtils.canScrollToLeft,
                    right: this.scrollUtils.canScrollToRight,
                    bottom: this.scrollUtils.canScrollDownBottom,
                });
            }
        );
    }

    private _removeVerticalPerfectScrollEvent() {
        $("div[wj-part='root']", this.flex.hostElement).off("ps-scroll-up");
        $("div[wj-part='root']", this.flex.hostElement).off("ps-scroll-down");
        $("div[wj-part='root']", this.flex.hostElement).off("ps-y-reach-end");
        $("div[wj-part='root']", this.flex.hostElement).off("ps-y-reach-start");
    }

    private _checkGridHasScrollbars() {
        if (!this.gridData) {
            return;
        }

        if (!this.gridData.items.length) {
            this.hasScrollbars.emit({
                top: false,
                left: false,
                right: false,
                bottom: false,
            });

            return;
        }

        setTimeout(() => {
            const wjPartRootElm = $(
                'div[wj-part="root"]',
                this.flex.hostElement
            );
            if (wjPartRootElm.length) {
                this.hasScrollbars.emit({
                    top: this.scrollUtils.canScrollUpTop,
                    left: this.scrollUtils.canScrollToLeft,
                    right: this.scrollUtils.canScrollToRight,
                    bottom: this.scrollUtils.canScrollDownBottom,
                });

                if (this.scrollUtils.hasHorizontalScroll) {
                    this._addHorizontalPerfectScrollEvent();
                } else {
                    this._removeHorizontalPerfectScrollEvent();
                }

                if (this.scrollUtils.hasVerticalScroll) {
                    this._addVerticalPerfectScrollEvent();
                } else {
                    this._removeVerticalPerfectScrollEvent();
                }
            }
        }, 300);
    }

    // ICollectionView filter function
    private _filterFunction(item) {
        const f = this.filter;
        if (f && item) {
            // split string into terms to enable multi-field searches such as 'us gadget red'
            const terms = f.toUpperCase().split(" ");

            // look for any term in any string field
            for (let i = 0; i < terms.length; i++) {
                let termFound = false;
                for (const key in item) {
                    if (key) {
                        const value = item[key];
                        if (
                            wjcCore.isString(value) &&
                            value.toUpperCase().indexOf(terms[i]) > -1
                        ) {
                            termFound = true;
                            break;
                        }
                    }
                }

                // fail if any of the terms is not found
                if (!termFound) {
                    return false;
                }
            }
        }

        if (this.filterObj && item) {
            let termFound = false;
            let count = 0;
            Object.keys(this.filterObj).forEach((keyFilter) => {
                const valueFilter = this.filterObj[keyFilter];
                for (const key in item) {
                    if (key) {
                        const value = item[key];
                        if (key == keyFilter && value == valueFilter) {
                            count++;
                            break;
                        }
                    }
                }
            });

            if (Object.keys(this.filterObj).length == count) {
                termFound = true;
            }

            // fail if any of the terms is not found
            if (!termFound) {
                return false;
            }
        }

        // include item in view
        return true;
    }

    // apply filter (applied on a 500 ms timeOut)
    protected _applyFilter(noTimeout?: boolean) {
        if (this._toFilter) {
            clearTimeout(this._toFilter);
        }

        this._toFilter = () => {
            if (this.flex) {
                const cv = this.flex.collectionView;
                if (cv) {
                    if (cv.filter !== this._thisFilterFunction) {
                        cv.filter = this._thisFilterFunction;
                    } else {
                        cv.refresh();
                    }
                    if (cv.items) {
                        this.totalResults = cv.items.length;
                    }
                }
            }
        };

        setTimeout(this._toFilter, noTimeout ? 0 : 500);
    }

    protected _applySearch() {
        this.onTableSearch.emit(this.search);
    }

    private _applyGroupBy(groupByColumn) {
        const cv = this.gridData;
        cv.beginUpdate();
        cv.groupDescriptions.clear();
        if (groupByColumn) {
            this.groupByColumn = groupByColumn;
            const groupNames = groupByColumn.data.split(",");
            for (let i = 0; i < groupNames.length; i++) {
                const groupName = groupNames[i];
                if (groupName) {
                    const groupDesc = new wjcCore.PropertyGroupDescription(
                        groupName
                    );
                    cv.groupDescriptions.push(groupDesc);
                }
            }
            cv.refresh();
        }
        cv.endUpdate();
    }

    private _buildGridGroupTitle(items, titleText, groupByColumn) {
        for (const item of items) {
            if (item[groupByColumn.data] === titleText) {
                return " " + item[groupByColumn.groupDisplayColumn];
            }
        }

        return titleText;
    }

    private _selectionChangedHandler(eventData) {
        setTimeout(() => {
            if (this.isDragging) {
                return;
            }

            if (this.isDoubleClick) {
                this.isDoubleClick = false;
                return;
            }

            if (this.preventRowEmit) {
                this.preventRowEmit = false;
                return;
            }

            if (eventData) {
                const isRowAutoChangedOnFirstLoad =
                    this._previousCellRange.row === -1 &&
                    this.autoSelectFirstRow &&
                    eventData.row === 0;
                const isRowChangedByClick =
                    this._previousCellRange.row !== eventData.row;
                const selectedRow: any = this._getSelectedFlexRow(
                    this.flex.rows,
                    eventData
                );

                if (isRowAutoChangedOnFirstLoad || isRowChangedByClick) {
                    if (selectedRow) {
                        const rowData = this._buildRowClickData(
                            selectedRow.dataItem
                        );
                        this.onRowClick.emit(rowData);

                        if (!this.selectedRow) {
                            this.selectedRow = {
                                c: eventData.col,
                                r: eventData.row,
                            };
                        } else {
                            this.selectedRow.c = eventData.col;
                            this.selectedRow.r = eventData.row;
                        }
                    }

                    this._previousCellRange.row = eventData.row;
                    this._previousCellRange.col = eventData.col;
                }

                let col: any = eventData.col;
                let flexCol = this.flex.getColumn(col);
                if (flexCol) {
                    let gridCol = this.gridColumns.find(
                        (x) => x.data === flexCol.binding
                    );
                    if (
                        selectedRow &&
                        ((selectedRow.dataItem &&
                            !selectedRow.dataItem[gridCol.data]) ||
                            (typeof selectedRow.dataItem[gridCol.data] ===
                                "object" &&
                                !selectedRow.dataItem[gridCol.data].key))
                    ) {
                        if (
                            this.flex.selection.row > -1 &&
                            this.flex.selection.col > -1
                        ) {
                            this.flex.startEditing(
                                false,
                                this.flex.selection.row,
                                this.flex.selection.col,
                                true
                            );
                        }
                    }
                }
            }

            this._toggleTooltip();

            setTimeout(() => {
                if (this.flex.selectedItems) {
                    this.onChangeSelectedItems.emit(this.flex.selectedItems);
                }
            });

            this.assignSelectedRowForTranslateData();
        }, 300);
    }

    private _beginningEditHandler(s: wjcGrid.FlexGrid, e: any) {
        if (!this.readOnly) {
            if (this.disabledAll) {
                e.cancel = true;
                return;
            }

            let currentFlexCol = this.flex.getColumn(e.col),
                row = s.rows[e.row];

            if (!currentFlexCol) return;

            if (
                (this.hasDisableRow && currentFlexCol.binding === "IsActive") ||
                currentFlexCol.binding === this.CONTROL_COLUMNS.noExport
            ) {
                e.cancel = true;
                return;
            }

            if (row) {
                let item = row.dataItem;

                if (!isNil(item["IsActive"]) && this.hasDisableRow) {
                    if (
                        currentFlexCol.binding !== "IsActive" &&
                        item["IsActive"] === false
                    ) {
                        e.cancel = true;
                        return;
                    }
                }

                if (
                    e &&
                    e.panel &&
                    e.panel._activeCell &&
                    e.panel._activeCell.className.indexOf("in-active-cell") >
                        -1 &&
                    (!currentFlexCol.isReadOnly ||
                        (currentFlexCol.isReadOnly &&
                            item["BorderStatus"] &&
                            item["BorderStatus"] === "1"))
                ) {
                    e.cancel = true;
                    return;
                }

                if (this.isDisableRowWithSelectAll) {
                    e.cancel = true;
                    return;
                }

                // Type is checkbox
                if (currentFlexCol.dataType === wjcCore.DataType.Boolean) {
                    e.cancel = true;
                    return;
                }

                if (this.hasReadOnlyCells(item)) {
                    e.cancel = true;
                }

                if (
                    this.allowDelete &&
                    e.col !== this.flex.columns.length - 1 &&
                    item["deleted"] &&
                    this.deletedItemList.indexOf(item) !== -1
                ) {
                    e.cancel = true;
                }
            }

            this._toggleTooltip();
            this._beginningEdit = true;
            this._buildComboboxData(s, e);
        }
    }

    private _buildComboboxData(s: wjcGrid.FlexGrid, e: any) {
        const column = this.gridColumns[e.col];
        const selectedRowData: any = this.gridData.items[e.row];

        if (isEmpty(selectedRowData)) {
            for (const col of this.gridColumns) {
                if (this.datatableService.hasControlType(col, "Combobox")) {
                    selectedRowData[col.data] = {
                        key: "",
                        value: "",
                        options: [],
                    };
                } else {
                    selectedRowData[col.data] = "";
                }
            }
        }

        if (this.datatableService.hasControlType(column, "Combobox")) {
            const comboboxType = this.datatableService.getComboboxType(column);

            let filterByValue =
                this.datatableService.getControlTypeFilterBy(column);

            if (filterByValue) {
                let filterByFrom: string;
                if (selectedRowData[filterByValue]) {
                    filterByFrom =
                        typeof selectedRowData[filterByValue] === "object"
                            ? selectedRowData[filterByValue]["key"]
                            : selectedRowData[filterByValue];
                } else {
                    filterByFrom =
                        this.parentInstance.data.widgetDataType.listenKeyRequest(
                            this.ofModule.moduleNameTrim
                        )[filterByValue];
                }

                this.commonServiceSubscription = this.commonService
                    .getComboBoxDataByFilter(
                        comboboxType.value.toString(),
                        filterByFrom
                    )
                    .subscribe((response: ApiResultResponse) => {
                        this.appErrorHandler.executeAction(() => {
                            this._onGetComboboxDataSuccess(
                                response.item,
                                comboboxType,
                                selectedRowData,
                                column,
                                filterByFrom
                            );
                        });
                    });
            } else {
                this.commonServiceSubscription = this.commonService
                    .getListComboBox(comboboxType.value.toString())
                    .subscribe((response: ApiResultResponse) => {
                        this.appErrorHandler.executeAction(() => {
                            if (!Uti.isResquestSuccess(response)) {
                                return;
                            }
                            this._onGetComboboxDataSuccess(
                                response.item,
                                comboboxType,
                                selectedRowData,
                                column
                            );
                        });
                    });
            }
        }

        this.editingRow = cloneDeep(selectedRowData);
    }

    private _onGetComboboxDataSuccess(
        comboboxData,
        comboboxType,
        selectedRowData,
        column,
        filterByValue?
    ) {
        let comboboxTypeName = comboboxType.name;
        if (filterByValue) {
            comboboxTypeName += "_" + filterByValue;
        }
        let options: any[] = comboboxData[comboboxTypeName];

        if (!options) {
            selectedRowData[column.data].key = "";
            selectedRowData[column.data].value = "";
            selectedRowData[column.data].options = [];
        } else {
            options = options.map((opt) => {
                return {
                    label: opt.textValue,
                    value: opt.idValue,
                };
            });

            selectedRowData[column.data].options = options;
            this.ref.detectChanges();
            setTimeout(() => {
                if (this.cellCombo) {
                    if (this.cellCombo.itemsSource.length === 1) {
                        this.cellCombo.selectedIndex = 0;
                    } else {
                        this.cellCombo.isDroppedDown = true;
                    }
                }
            }, 200);
        }
    }

    private _cellEditEndingHandler(s: wjcGrid.FlexGrid, e: any) {
        if (!this.readOnly) {
            let currentFlexCol = this.flex.getColumn(e.col);
            // Type is checkbox
            if (
                currentFlexCol &&
                currentFlexCol.dataType === wjcCore.DataType.Boolean
            ) {
                e.cancel = true;
            }
        }
    }

    private _cellEditEnded(s, e) {
        if (!this.readOnly) {
            if (this.allowDelete && e.col === this.flex.columns.length - 1) {
                const hasDeletedRows = this._hasDeletedRow(this.gridData.items);
                this.onRowMarkedAsDelete.emit({
                    showCommandButtons: hasDeletedRows,
                    disabledDeleteButton: !hasDeletedRows,
                });

                if (this.isShowedEditButtons) {
                    this.isMarkedAsDelete = this._hasRowMarkedAsDeleted();
                }
            }

            this.hasValidationError.emit(this.hasError());

            this._convertCurrenCellValueToFloat(e);

            setTimeout(() => {
                if (
                    this.gridData &&
                    ((this.gridData.itemsEdited &&
                        this.gridData.itemsEdited.length) ||
                        (this.gridData.itemsAdded &&
                            this.gridData.itemsAdded.length))
                ) {
                    let editingItem = this.gridData.itemsEdited.find(
                        (x) => x.DT_RowId == this.gridData.currentItem.DT_RowId
                    );
                    if (!editingItem) {
                        editingItem = this.gridData.itemsAdded.find(
                            (x) =>
                                x.DT_RowId == this.gridData.currentItem.DT_RowId
                        );
                    }

                    if (editingItem) {
                        const column = this.flex.getColumn(e.col);
                        const cellData =
                            column && column.binding
                                ? this.gridData.currentItem[column.binding]
                                : null;
                        this.onCellEditEnd.emit({
                            col: this.flex.getColumn(e.col),
                            currentItem: this.gridData.currentItem,
                            cellData: cellData,
                            itemData: this.gridData.currentItem,
                        });
                    }
                }
            }, 100);

            let currentFlexCol = this.flex.getColumn(e.col),
                row = s.rows[e.row];
            if (row && currentFlexCol) {
                let item = row.dataItem;
                if (
                    !currentFlexCol.isReadOnly &&
                    item[currentFlexCol.binding]
                ) {
                    if (
                        item.hasOwnProperty("isActiveDisableRow") &&
                        !item["isActiveDisableRow"]
                    ) {
                        item["isActiveDisableRow"] = true;
                    }

                    if (item.hasOwnProperty("IsActive") && !item["IsActive"]) {
                        item["IsActive"] = true;
                    }
                }
            }
        }
    }

    private _convertCurrenCellValueToFloat(eventData) {
        let currentFlexCol = this.flex.getColumn(eventData.col);
        if (currentFlexCol) {
            let currentGridCol = this.gridColumns.find(
                (c) => c.data == currentFlexCol.binding
            );
            let currentCellData = this.flex.getCellData(
                eventData.row,
                eventData.col,
                false
            );
            currentCellData =
                currentCellData == null || currentCellData == undefined
                    ? null
                    : currentCellData;
            if (
                currentGridCol &&
                currentGridCol.controlType === "Numeric" &&
                currentCellData &&
                typeof currentCellData === "string"
            ) {
                currentCellData = wjcCore.Globalize.parseFloat(
                    currentCellData,
                    "d"
                );
            }

            this.flex.setCellData(
                eventData.row,
                eventData.col,
                currentCellData
            );
            this.gridData.currentItem[currentFlexCol.binding] = currentCellData;
        }
    }

    private _hasRowMarkedAsDeleted() {
        return (
            this.gridData.items.filter((item) => item.deleted === true).length >
            0
        );
    }

    private _collectionChangedHandler(s: wjcCore.CollectionView, e: any) {
        if (!this.readOnly) {
            if (
                this._beginningEdit &&
                !this._isRowDataEqual(this.editingRow, s.currentItem) &&
                s.itemsAdded.indexOf(s.currentItem) < 0
            ) {
                if (s.itemsEdited && s.itemsEdited.indexOf(s.currentItem) < 0) {
                    s.itemsEdited.push(s.currentItem);
                }
            }
            this._beginningEdit = false;

            this._toggleNoDataMessage();

            setTimeout(() => {
                this.hasValidationError.emit(this.hasError());
            }, 500);

            if (this.showTotalRowLocal) {
                this._addFooterRow(this.flex);
            } else {
                this.flex.columnFooters.rows.clear();
            }
        }
    }

    private _rowEditEndedHandler(s: wjcCore.CollectionView, e: any) {
        const currentItem = this.gridData.currentItem;
        setTimeout(() => {
            if (!this.readOnly) {
                this.onTableEditEnd.emit(true);

                if (this.gridData) {
                    if (
                        this.gridData.itemsEdited.length ||
                        this.gridData.itemsAdded.length ||
                        this.gridData.itemsRemoved.length ||
                        this.deletedItemList.length
                    ) {
                        this.onRowEditEnded.emit(currentItem);
                    }
                }

                this.toggleDeleteColumn(false);
            }
        }, 200);
    }

    private _isRowDataEqual(firstRow, secondRow) {
        for (const fprop in firstRow) {
            if (fprop) {
                for (const sprop in secondRow) {
                    if (fprop === sprop) {
                        if (
                            typeof firstRow[fprop] === "object" &&
                            typeof secondRow[sprop] === "object" &&
                            firstRow[fprop] &&
                            secondRow[sprop]
                        ) {
                            if (
                                firstRow[fprop]["key"] !==
                                    secondRow[sprop]["key"] ||
                                firstRow[fprop]["value"] !==
                                    secondRow[sprop]["value"]
                            ) {
                                return false;
                            }
                        } else {
                            if (firstRow[fprop] !== secondRow[sprop]) {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        return true;
    }

    private _hasDeletedRow(itemsEdited) {
        return itemsEdited.filter((item) => item.deleted === true).length > 0;
    }

    private _getSelectedFlexRow(flexRows, eventData) {
        let selectedRow: any = null;
        for (let i = 0; i < flexRows.length; i++) {
            if (flexRows[i].index === eventData.row) {
                selectedRow = flexRows[i];
                break;
            }
        }

        return selectedRow;
    }

    private _buildRowClickData(selectedRow) {
        const result = [];
        for (const propName in selectedRow) {
            if (propName) {
                result.push({
                    key: propName,
                    value: selectedRow[propName],
                });
            }
        }

        return result;
    }

    private _deleteRows() {
        if (!this.allowDelete) {
            return;
        }

        const deletedRows = this.gridData.items.filter(
            (item) => item.deleted === true
        );
        if (deletedRows && deletedRows.length) {
            this._okDeleteRows();
            //this.showDeleteConfirmModal();
        }
    }

    private showDeleteConfirmModal() {
        this.modalService.confirmMessageHtmlContent(
            new MessageModel({
                headerText: "Delete Item",
                messageType: MessageModal.MessageType.error,
                message: [
                    { key: "<p>" },
                    {
                        key: "Modal_Message__Do_You_Want_To_Delete_The_Selected_Items",
                    },
                    { key: "</p>" },
                ],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    this._okDeleteRows();
                },
                callBack2: () => {
                    this._cancelDeleteRows();
                },
                callBackCloseButton: () => {
                    this._cancelDeleteRows();
                },
            })
        );
    }

    private _okDeleteRows() {
        const deletedRows = this.gridData.items.filter(
            (item) => item.deleted === true
        );
        if (deletedRows.length) {
            this.onDeletedRowAway.emit();
            for (let i = 0; i < deletedRows.length; i++) {
                if (deletedRows[i]["DT_RowId"].indexOf("newrow") !== -1) {
                    let gridItemidx = this.gridData.items.findIndex(
                        (ii) => ii["DT_RowId"] == deletedRows[i]["DT_RowId"]
                    );
                    this.gridData.items.splice(gridItemidx, 1);

                    let flexRowidx = -1;
                    for (let ii = 0; ii < this.flex.rows.length; ii++) {
                        if (
                            this.flex.rows[ii]["dataItem"]["DT_RowId"] ==
                            deletedRows[i]["DT_RowId"]
                        ) {
                            flexRowidx = ii;
                        }
                    }
                    if (flexRowidx !== -1) {
                        this.flex.rows.splice(flexRowidx, 1);

                        let gridItemidx = this.gridData.itemsAdded.findIndex(
                            (ii) => ii["DT_RowId"] == deletedRows[i]["DT_RowId"]
                        );
                        this.gridData.itemsAdded.splice(gridItemidx, 1);
                        gridItemidx = this.gridData.itemsEdited.findIndex(
                            (ii) => ii["DT_RowId"] == deletedRows[i]["DT_RowId"]
                        );
                        this.gridData.itemsEdited.splice(gridItemidx, 1);
                    }

                    this.gridData.commitEdit();

                    this.onRowMarkedAsDelete.emit({
                        showCommandButtons: true,
                        disabledDeleteButton: true,
                        enableAddButtonCommand: true,
                    });
                    this.isMarkedAsDelete = false;
                } else {
                    if (this.deletedItemList.indexOf(deletedRows[i]) === -1) {
                        this.deletedItemList.push(deletedRows[i]);
                    }

                    this.onRowMarkedAsDelete.emit({
                        showCommandButtons: true,
                        disabledDeleteButton: false,
                    });
                    this.isMarkedAsDelete = true;

                    this.onDeletedRows.emit(true);
                }

                if (
                    this._errorObject &&
                    this._errorObject[deletedRows[i]["DT_RowId"]]
                )
                    delete this._errorObject[deletedRows[i]["DT_RowId"]];
            }

            // update isSelectDeletedAll in case no left items
            const remainItems = this.gridData.items.filter(
                (item) => item.deleted !== true
            );
            if (!remainItems.length && this.selectDeleteAll) {
                this.isSelectDeletedAll = false;
            }

            this.flex.refresh();

            setTimeout(() => {
                this.hasValidationError.emit(this.hasError());
            }, 100);
        }
    }

    private _cancelDeleteRows() {
        this.onRowMarkedAsDelete.emit({
            showCommandButtons: true,
            disabledDeleteButton: false,
        });
    }

    private _hasUnsavedRows() {
        return (
            this.gridData.itemsEdited.length > 0 ||
            this.gridData.itemsAdded.length > 0 ||
            this.gridData.itemsRemoved.length > 0 ||
            this.deletedItemList.length > 0
        );
    }

    private _getWijmoGridData() {
        if (this.deletedItemList.length) {
            const ecv = <wjcCore.CollectionView>this.flex.collectionView;
            for (const item of this.deletedItemList) {
                if (this.gridData.itemsRemoved.indexOf(item) === -1) {
                    ecv.remove(item);
                }
            }

            this.deletedItemList = [];
        }

        return this.gridData;
    }

    private _getWillDeletedItems() {
        return this.deletedItemList;
    }

    public downloadMediaHandler(event: any, item: any) {
        this.onDownloadFile.emit({ rowData: item, element: event.target });
    }

    public scheduleSettingClicked(event: any, item: any) {
        this.onScheduleSettingClickAction.emit({
            rowData: item,
            element: event.target,
        });
    }

    public runScheduleSettingClicked(event: any, item: any) {
        this.onRunScheduleSettingClickAction.emit({
            rowData: item,
            element: event.target,
        });
    }

    public onHandleClickHeader(event, col) {
        if (event.target.className.indexOf("mat-checkbox") !== -1) {
            return;
        }

        if (
            this.currentSelectedColHeader &&
            this.currentSelectedColHeader !== col
        )
            this.currentSelectedColHeader["sort"] = null;
        if (!col["sort"]) col["sort"] = "wj-glyph-up";
        else if (col["sort"] === "wj-glyph-up") col["sort"] = "wj-glyph-down";
        else if ((col["sort"] = "wj-glyph-down")) col["sort"] = "wj-glyph-up";

        this.currentSelectedColHeader = col;
    }

    public mediaCodeClickHandler(rowData) {
        this.onMediacodeClick.emit(rowData);
    }

    public pdfButtonClickHandler(rowData) {
        this.onPdfColumnClick.emit(rowData);
    }

    public trackingButtonClickHandler(rowData) {
        this.onTrackingColumnClick.emit(rowData);
    }

    public returnRefundButtonClickHandler(rowData) {
        this.onReturnRefundColumnClick.emit(rowData);
    }

    public sendLetterButtonClickHandler(rowData) {
        this.onSendLetterColumnClick.emit(rowData);
    }

    public unblockButtonClickHandler(rowData) {
        this.onUnblockColumnClick.emit(rowData);
    }

    public deleteButtonClickHandler(rowData) {
        this.onDeleteColumnClick.emit(rowData);
    }

    public _buildCcList(ccData) {
        if (!ccData) {
            return [];
        }

        return ccData.split(",");
    }

    private _addNoDataMessage() {
        setTimeout(() => {
            const wjPartCellsElement = $(
                'div[wj-part="cells"]',
                this.flex.hostElement
            );
            if (
                wjPartCellsElement.length &&
                wjPartCellsElement.children().length
            ) {
                return;
            }

            const wjPartFCellsElement = $(
                'div[wj-part="fcells"]',
                this.flex.hostElement
            );

            if (wjPartFCellsElement.length) {
                const noDataMessageElement =
                    wjPartFCellsElement.find("p#noDataMessage");
                if (noDataMessageElement.length) {
                    return;
                } else {
                    const _noDataMessageElement = document.createElement("p");
                    const textNode = document.createTextNode(
                        "No data available in table"
                    );
                    _noDataMessageElement.id = "noDataMessage";
                    _noDataMessageElement.className = "text-center";
                    _noDataMessageElement.appendChild(textNode);

                    wjPartFCellsElement.append(noDataMessageElement);
                }
            }
        }, 200);
    }

    private _removeNoDataMessage() {
        const noDataMessageElement = $(
            "p#noDataMessage",
            this.flex.hostElement
        );
        if (noDataMessageElement.length) {
            noDataMessageElement[0].parentNode.removeChild(
                noDataMessageElement[0]
            );
        }
    }

    private _toggleNoDataMessage() {
        if (
            this.gridData &&
            (!this.gridData.items.length ||
                (!this.gridData.items.length &&
                    (this.gridData.itemsRemoved.length ||
                        this.deletedItemList.length)))
        ) {
            this._addNoDataMessage();
        } else {
            this._removeNoDataMessage();
        }
    }

    private _getGroupByColumn(columns) {
        for (const col of columns) {
            if (col["isGrouped"]) {
                return col;
            }
        }

        return null;
    }

    private _lostFocus() {
        if (this.flex) {
            $(document).click();
        }
    }

    private _addNewRow(data?) {
        if (!this.allowAddNew) {
            return;
        }

        let newItem = this.gridData.addNew();

        for (const col of this.gridColumns) {
            let config = {
                allowDelete: this.allowDelete,
                allowMediaCode: this.allowMediaCode,
                allowDownload: this.allowDownload,
                allowSelectAll: this.allowSelectAll,
            };
            newItem = this.datatableService.createEmptyRowData(
                newItem,
                col,
                config,
                this.gridData.items.length
            );
        }

        this.gridData.commitNew();
        this._hasValidationError = true;

        this.gridData.beginUpdate();
        const newFlexRow = this.flex.rows[this.flex.rows.length - 1];
        this.flex.rows.splice(0, 0, newFlexRow);
        this.flex.rows.splice(this.flex.rows.length - 1, 1);

        const newDataRow = this.gridData.items[this.gridData.items.length - 1];
        this.gridData.items.splice(0, 0, newDataRow);
        this.gridData.items.splice(this.gridData.items.length - 1, 1);

        this._updatePerfectScrollbar();

        if (data) {
            for (let i = 0; i < this.flex.columns.length; i++) {
                this.flex.setCellData(
                    0,
                    i,
                    data[this.flex.columns[i]["binding"]]
                );
            }
        }

        this.flex.refresh();
        setTimeout(() => {
            this.flex.scrollIntoView(0, 1);
            $(this.flex.hostElement).focus();
            let firstVisibleCell = this.firstVisibleCellIndex();
            if (firstVisibleCell) {
                if (firstVisibleCell.r > -1 && firstVisibleCell.c > -1) {
                    this.flex.startEditing(
                        false,
                        firstVisibleCell.r,
                        firstVisibleCell.c,
                        true
                    );
                }
            }
        });
    }

    private _deleteRowByRowId(rowId: any) {
        const item = this.flex.rows.find(
            (x) => x.dataItem && x.dataItem.DT_RowId === rowId
        );
        if (!item) return;
        this.flex.rows.remove(item);

        let gridItemidx = this.gridData.items.findIndex(
            (ii) => ii["DT_RowId"] === rowId
        );
        if (gridItemidx !== -1) {
            this.gridData.items.splice(gridItemidx, 1);
        }
    }

    private _getColumnLayout() {
        return this.flex.columnLayout;
    }

    public closePopupHandler(event) {
        this.isShowingPopupFilter = false;
    }

    public focusFilterHandler(event, isOut?: boolean) {
        this.isHalfOpacity = isNil(isOut) ? false : isOut;
    }

    private resetFilterPopup() {
        this.isShowingPopupFilter = false;
        this.filter = "";
    }

    public contextMenuItemClick(func: any) {
        if (func) func();
    }

    public uploadFile() {
        this.onUploadFileClick.emit(true);
    }

    public selectDeleteAll(event) {
        const checked = this.isSelectDeletedAll;
        this.isSelectDeletedAll = checked;
        this.onRowMarkedAsDelete.emit({
            showCommandButtons: checked,
            disabledDeleteButton: !checked,
        });
        this.gridData.items.forEach((item) => {
            if (!this.hasReadOnlyCells(item)) {
                item["deleted"] = checked;
            }
        });

        if (!checked) {
            this.deletedItemList = [];
        }

        this.isMarkedAsDelete = checked;
        this.flex.refresh();
    }

    public onCheckboxChanged(item, fieldName, event, row?: any, cell?: any) {
        item[fieldName] = event.checked;

        // Set row to disable when isactive is false
        if (
            (fieldName.toLowerCase() == "isactive" ||
                fieldName.toLowerCase() == "isactivedisablerow") &&
            row
        ) {
            row.isReadOnly = !event.checked;
        }
        switch (Uti.toLowerCase(fieldName)) {
            case "deleted": {
                this.handleForDeleteCase(event, item);
                break;
            }
            case "selectall": {
                this.handleForCheckAllCase(event);
                break;
            }
            case Uti.toLowerCase(this.CHECKBOX_COLUMNS.masterCheckbox): {
                this.handleForMasterCheckboxCase(
                    event.checked,
                    cell.row.index,
                    cell.col.index
                );
                break;
            }
            default:
                if (this.checkBoxColumnsName.indexOf(fieldName) > -1) {
                    this.onRowEditEnded.emit(this.gridData.currentItem);
                }
                break;
        }
        if (this.gridData.itemsEdited.indexOf(item) < 0) {
            this.gridData.itemsEdited.push(item);
        }

        setTimeout(() => {
            this.hasValidationError.emit(this.hasError());
        }, 100);

        this.onCellEditEnd.emit({
            col: {
                binding: fieldName,
            },
            currentItem: this.gridData.currentItem,
            cellData: item[fieldName],
            itemData: this.gridData.currentItem,
        });

        this.flex.refresh();
    }

    private handleForDeleteCase(event: any, item: any) {
        if (!event.checked) {
            if (this.deletedItemList.indexOf(item) !== -1) {
                this.deletedItemList.splice(
                    this.deletedItemList.indexOf(item),
                    1
                );
            }
        }

        const itemMarkedAsDeleted = this.gridData.items.filter(
            (_item) => _item.deleted === true
        );

        // only emit if this is selected item/ there is no one
        if (event.checked && itemMarkedAsDeleted.length) {
            this.onRowMarkedAsDelete.emit({
                showCommandButtons: true,
                disabledDeleteButton: false,
            });
            this.isMarkedAsDelete = true;
        } else if (itemMarkedAsDeleted.length > this.deletedItemList.length) {
            this.onRowMarkedAsDelete.emit({
                showCommandButtons: true,
                disabledDeleteButton: false,
            });
            this.isMarkedAsDelete = true;
        } else if (itemMarkedAsDeleted.length === this.deletedItemList.length) {
            let appearAll = true;
            for (const markedItem of itemMarkedAsDeleted) {
                if (this.deletedItemList.indexOf(markedItem) === -1) {
                    appearAll = false;
                }
            }

            this.onRowMarkedAsDelete.emit({
                showCommandButtons:
                    itemMarkedAsDeleted.length === 0 ? false : true,
                disabledDeleteButton: appearAll,
            });
            this.isMarkedAsDelete = !appearAll;
        } else {
            this.onRowMarkedAsDelete.emit({
                showCommandButtons: false,
                disabledDeleteButton: true,
            });
            this.isMarkedAsDelete = false;
        }

        this.isSelectDeletedAll =
            itemMarkedAsDeleted.length === this.gridData.items.length;

        // For each delete item change
        this.onEachRowMarkedAsDelete.emit();
    }

    private handleForCheckAllCase(event: any) {
        if (!event.checked) {
            this.isMarkedAsSelectedAll = false;
            this.onMarkedAsSelectedAll.emit(
                this.gridData.items.filter((item) => item["selectAll"] === true)
            );
        } else {
            const unselectedItems = this.gridData.items.filter(
                (item) => item["selectAll"] !== true
            );
            if (!unselectedItems || !unselectedItems.length) {
                this.isMarkedAsSelectedAll = true;
                this.onMarkedAsSelectedAll.emit(this.gridData.items);
            } else {
                this.onMarkedAsSelectedAll.emit(
                    this.gridData.items.filter(
                        (item) => item["selectAll"] === true
                    )
                );
            }
        }
    }

    private handleForMasterCheckboxCase(value: any, r: any, c: any) {
        if (value && Uti.toLowerCase(value) !== "false") {
            let counter = 0;
            for (let i = 0; i < this.flex.rows.length; i++) {
                if (counter == 2) return;
                const cellData = this.flex.getCellData(i, c, false);
                if (cellData === true && r !== i) {
                    this.flex.setCellData(i, c, false);
                    counter++;
                }
                if (r == i) {
                    const unMergeColumnIndex = this.getColumnIndexByName(
                        this.CHECKBOX_COLUMNS.unMergeCheckbox
                    );
                    this.flex.setCellData(i, unMergeColumnIndex, false);
                    counter++;
                }
            }
        }
    }

    private getColumnIndexByName(name: string): number {
        for (let i = 0; i < this.flex.columns.length; i++) {
            if (
                Uti.toLowerCase(this.flex.columns[i].binding) ==
                Uti.toLowerCase(name)
            ) {
                return i;
            }
        }
        return -1;
    }

    public copyToClipboard(event: wjcGrid.CellRangeEventArgs) {
        if (this.flex && event) {
            const text = this.flex.getCellData(event.row, event.col, false);
            if (
                !isString(text) &&
                !isBoolean(text) &&
                !isNumber(text) &&
                isObject(text) &&
                text.value
            ) {
                setTimeout(() => {
                    try {
                        const $temp = $("<input>");
                        $("body").append($temp);
                        $temp.val(text.value).select();
                        document.execCommand("copy");
                        $temp.remove();
                    } catch (exc) {}
                });
            }
        }
    }

    selectAllColumnItems() {
        const checked = this.isMarkedAsSelectedAll;
        this.gridData.items.forEach((item) => (item["selectAll"] = checked));
        if (checked) this.onMarkedAsSelectedAll.emit(this.gridData.items);
        else this.onMarkedAsSelectedAll.emit([]);
        this.flex.refresh();
    }

    private _updatePerfectScrollbar() {
        if (this.flex) {
            const flex = $("div[wj-part='root']", this.flex.hostElement).get(0);
            if (flex) {
                Ps.update(flex);
            }
        }
    }

    /**
     * setActiveRowByCondition
     * @param keyArray
     */
    public setActiveRowByCondition(keyObj: { [key: string]: any }) {
        const flex = this.flex;
        const cv = flex.collectionView;
        let panel: wjcGrid.GridPanel = flex.cells;
        let count = 0;
        let rowIndex = -1;

        // Find in the current data list.
        for (let r = 0; r < flex.rows.length; r++) {
            for (let c = 0; c < panel.columns.length; c++) {
                let col: wjcGrid.Column = panel.columns[c];
                if (keyObj[col.binding]) {
                    let raw = panel.getCellData(r, c, false);
                    if (keyObj[col.binding] == raw) {
                        count++;
                    }
                }
            }
            if (count > 0 && count == Object.keys(keyObj).length) {
                rowIndex = r;
                break;
            }
        }

        // Not found
        // May be grid is displaying in single row mode so we need to trace in original datasource.
        if (rowIndex == -1) {
            this.preventRowEmit = true;
            cv.sourceCollection = this.wijmoDataSource.data.filter(
                (obj, pos, arr) => {
                    let count = 0;
                    Object.keys(keyObj).forEach((key) => {
                        const value = keyObj[key];
                        if (obj[key] && obj[key] == value) {
                            count++;
                        }
                    });
                    if (Object.keys(keyObj).length == count) {
                        return true;
                    }
                    return false;
                }
            );
        } else {
            if (rowIndex != flex.selection.row) {
                this.preventRowEmit = true;
                this.flex.select(
                    new wjcGrid.CellRange(rowIndex, -1, rowIndex, -1)
                );
            }
        }
    }

    /**
     * changeToSingleRowMode
     */
    public changeToSingleRowMode() {
        const cv = this.flex.collectionView;
        const lastItem = cv.currentItem
            ? cv.currentItem
            : this.wijmoDataSource.data && this.wijmoDataSource.data.length
            ? this.wijmoDataSource.data[0]
            : null;
        if (lastItem) {
            cv.sourceCollection = [lastItem];
        }
    }

    /**
     * changeToMultipleRowMode
     */
    public changeToMultipleRowMode() {
        const cv = this.flex.collectionView;
        if (!cv) return;
        const lastItem = cv.currentItem;
        cv.sourceCollection = this.wijmoDataSource.data;
        let rowIndex = 0;
        if (lastItem) {
            for (let i = 0; i < cv.items.length; i++) {
                if (cv.items[i]["DT_RowId"] != lastItem["DT_RowId"]) continue;
                rowIndex = i;
                break;
            }
        }

        if (
            this.autoSelectFirstRow ||
            (this.gridData && this.gridData.items.length === 1)
        ) {
            this.flex.select(new wjcGrid.CellRange(rowIndex, -1, rowIndex, -1));
        }
    }

    /**
     * getHTMLTable
     */
    public getHTMLTable() {
        const flex = this.flex;
        // start table
        let tbl = '<table width="100%">';

        // headers
        tbl += "<thead>";
        for (let r = 0; r < flex.columnHeaders.rows.length; r++) {
            tbl += this.renderRow(flex.columnHeaders, r);
        }
        tbl += "</thead>";

        // body
        tbl += "<tbody>";
        for (let r = 0; r < flex.rows.length; r++) {
            tbl += this.renderRow(flex.cells, r);
        }
        tbl += "</tbody>";

        // done
        tbl += "</table>";
        return tbl;
    }

    /**
     * renderRow
     * @param panel
     * @param r
     */
    private renderRow(panel: wjcGrid.GridPanel, r: number) {
        let tr = "",
            row: wjcGrid.Row = panel.rows[r];
        if (row.renderSize > 0) {
            tr += "<tr>";
            for (let c = 0; c < panel.columns.length; c++) {
                let col: wjcGrid.Column = panel.columns[c];
                if (col.binding == "deleted") {
                    break;
                }
                if (col.renderSize > 0) {
                    // get cell style, content
                    let style =
                            "width:" +
                            col.renderSize +
                            "px;text-align:" +
                            col.getAlignment(),
                        content = panel.getCellData(r, c, true),
                        cellElement = panel.getCellElement(r, c);
                    let className = "";

                    if (cellElement) {
                        className = cellElement.className;
                    }

                    if (!row.isContentHtml && !col.isContentHtml) {
                        content = wjcCore.escapeHtml(content);
                    }

                    // add cell to row
                    if (panel.cellType == wjcGrid.CellType.ColumnHeader) {
                        tr +=
                            '<th style="' +
                            style +
                            '" class="' +
                            className +
                            '" > ' +
                            content +
                            " </th>";
                    } else {
                        let raw = panel.getCellData(r, c, false);

                        const rs = this.gridColumns.filter(
                            (p) => p.data == col.binding
                        );
                        let controlType; //toLowerCase
                        if (rs.length) {
                            controlType = (
                                rs[0].controlType || ""
                            ).toLowerCase();
                            if (controlType == "creditcard") {
                                className += " creditcard-icon";
                                const element = panel.getCellElement(r, c);
                                raw = element.innerHTML;
                            }
                        }

                        if (isObject(raw)) {
                            content = raw.value ? raw.value : "";
                        } else if (isBoolean(raw)) {
                            if (raw === true) {
                                content = "&#9745;";
                            } else if (raw === false) {
                                content = "&#9744;";
                            }
                        } else if (controlType === "checkbox") {
                            if (
                                cellElement &&
                                className === "wj-cell readonly" &&
                                $(cellElement).find(".fa-check.active").length
                            ) {
                                content = "&#9745;";
                            } else {
                                if (raw == "1") {
                                    content = "&#9745;";
                                } else if (raw == "0") {
                                    content = "&#9744;";
                                }
                            }
                        } else if (isString(raw)) {
                            content = raw;
                        }

                        if (className.indexOf("wj-cell") == -1) {
                            className += " wj-cell ";
                        }
                        if (r % 2 != 0) {
                            if (className.indexOf("wj-alt") == -1) {
                                className += " wj-alt ";
                            }
                        }
                        className = className
                            .replace("wj-state-selected", "")
                            .replace("wj-state-multi-selected", "");
                        tr +=
                            '<td style="' +
                            style +
                            '" class="' +
                            className +
                            '">' +
                            content +
                            "</td>";
                    }
                }
            }
            tr += "</tr>";
        }
        return tr;
    }

    /**
     * scrollBodyContainer of widget
     */
    private get scrollBodyContainer() {
        const elm = $("div[wj-part='root']", this.flex.hostElement);
        if (elm.length) {
            return elm[0];
        }
        return null;
    }

    /**
     * scrollToPosition
     */
    scrollToPosition(mode) {
        this.scrollUtils.scrollToPosition(mode);
        this.hasScrollbars.emit({
            top: this.scrollUtils.canScrollUpTop,
            left: this.scrollUtils.canScrollToLeft,
            right: this.scrollUtils.canScrollToRight,
            bottom: this.scrollUtils.canScrollDownBottom,
        });
    }

    /**
     * scrollHover
     * @param mode
     */
    scrollHover(mode) {
        this.scrollUtils.scrollHovering(mode);
    }

    /**
     * scrollUnHover
     * @param mode
     */
    scrollUnHover(mode) {
        this.scrollUtils.scrollUnHovering(mode);
    }

    public toggleDeleteColumn(isShow) {
        if (this.flex) {
            if (
                this.parentInstance &&
                this.parentInstance.hasOwnProperty("widgetInstance")
            ) {
                const itemMarkedAsDeleted = this.gridData.items.filter(
                    (_item) => _item.deleted === true
                );
                if (itemMarkedAsDeleted.length) {
                    return;
                }

                let deleteCol = this.flex.columns.find(
                    (c) => c.binding == "deleted"
                );
                if (!deleteCol) {
                    return;
                }

                let gridDeleteCol = this.gridColumns.find(
                    (c) => c.data == "deleted"
                );
                if (!gridDeleteCol) {
                    return;
                }

                if (isShow || this.parentInstance.isToolbarButtonsShowed) {
                    deleteCol.visible = true;
                    gridDeleteCol.visible = true;
                } else {
                    deleteCol.visible = false;
                    gridDeleteCol.visible = false;
                }
                this.flex.refresh();
            }
        }
    }

    public toogleColumns(columnNames: Array<string>, status: boolean) {
        for (let item of columnNames) {
            let column = this.flex.columns.find((x) => x.binding === item);
            if (!column) continue;
            column.visible = status;
        }
        this.flex.refresh();
    }

    public gridContextMenuDataTrackBy(index, item) {
        return item ? item.title : undefined;
    }

    public gridColumnsTrackBy(index, item) {
        return item ? item.data : undefined;
    }

    public formatNumber(
        data,
        globalNumberFormat,
        allowNumberSeparator?: boolean
    ) {
        if (data == 0) {
            return 0;
        }

        if (isNil(data) || isNaN(data)) {
            return "";
        }

        if (!isNil(allowNumberSeparator) && allowNumberSeparator == false) {
            return data;
        }

        if (globalNumberFormat === "N") {
            return data
                ? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : null;
        }

        return data;
    }

    public checkAllItems(colName, e) {
        for (let i = 0; i < this.gridData.sourceCollection.length; i++) {
            let item = this.gridData.sourceCollection[i];
            if (!item["BorderStatus"]) {
                let gridCol = this.gridColumns.find((x) => x.data == colName);
                if (gridCol && gridCol.disabledBy && item[gridCol.disabledBy]) {
                    continue;
                }

                this.gridData.editItem(item);
                item[colName] = e.checked;
                item["isEdited"] = true;
                this.gridData.commitEdit();
            }
        }

        this.onCheckAllChecked.emit(e.checked);
    }

    public setSelectedRow(selectedRow: any, keyColumnNames?: string) {
        if (!this.gridData) return;
        setTimeout(() => {
            if (!this.gridData) return;

            if (keyColumnNames) {
                const keys = keyColumnNames.split(",");
                const compareObj1 = {};
                for (var j = 0; j < keys.length; j++) {
                    const key = keys[j];
                    compareObj1[key] = selectedRow[key];
                }

                for (let i = 0; i < this.gridData.items.length; i++) {
                    const item = cloneDeep(this.gridData.items[i]);
                    const compareObj2 = {};
                    for (var j = 0; j < keys.length; j++) {
                        const key = keys[j];
                        compareObj2[key] = item[key];
                    }
                    let isEqual: boolean =
                        JSON.stringify(compareObj1).toLowerCase() ===
                        JSON.stringify(compareObj2).toLowerCase();
                    if (isEqual) {
                        this.gridData.moveCurrentToPosition(i);
                        break;
                    }
                }
            } else {
                for (let i = 0; i < this.gridData.items.length; i++) {
                    let item = cloneDeep(this.gridData.items[i]);
                    delete item["DT_RowId"];
                    delete item["isReadOnlyColumn"];
                    delete selectedRow["DT_RowId"];
                    delete selectedRow["isReadOnlyColumn"];
                    if (JSON.stringify(selectedRow) === JSON.stringify(item)) {
                        this.gridData.moveCurrentToPosition(i);
                        break;
                    }
                }
            }
        }, 500);
    }

    /**
     * initialized
     */
    public initialized() {
        if (this.isSupportHierarchicalView) {
            this.flex.childItemsPath = "children";
        }
        setTimeout(() => {
            this.onAfterFlexgridRendered.emit();
        });
    }

    /**
     * getBooleanCellTemplate
     */
    public getBooleanCellTemplate(): TemplateRef<any> {
        const t = this.booleanCellTemplate;
        return t ? t.template : null;
    }

    /**
     * getBooleanColHeaderTemplate
     */
    public getBooleanColHeaderTemplate(): TemplateRef<any> {
        const t = this.booleanColHeaderTemplate;
        return t ? t.template : null;
    }

    /**
     *scrollPositionChanged
     */
    public scrollPositionChanged(s: wjcCore.CollectionView, e: any) {
        this.onScrollPositionChanged.emit(e);
    }

    private assignSelectedRowForTranslateData() {
        let temp = Object.assign({}, this.translateData);
        // service for translate grid data
        temp.gridSelectedRow = this.flex.selectedItems;
        this.translateData = Object.assign({}, temp);
    }

    public onCellEditClose() {
        this.showCellEditDialog = false;
    }

    private isReadonlyColumn(column) {
        return (
            this.readOnly ||
            (!this.readOnly &&
                column &&
                this.datatableService.hasDisplayField(column, "Readonly") &&
                this.datatableService.getDisplayFieldValue(
                    column,
                    "Readonly"
                ) === "1")
        );
    }

    public onCellEditAccept(cellData) {
        this.showCellEditDialog = false;

        if (cellData && this.flex) {
            this.flex.setCellData(cellData.r, cellData.c, cellData.value);
            if (
                Uti.toLowerCase(cellData.data) ===
                Uti.toLowerCase(this.CHECKBOX_COLUMNS.masterCheckbox)
            ) {
                this.handleForMasterCheckboxCase(
                    cellData.value,
                    cellData.r,
                    cellData.c
                );
            }
            setTimeout(() => {
                this.flex.startEditing();
            }, 200);
        }
    }

    private _addFooterRow(flex: wjcGrid.FlexGrid) {
        flex.columnFooters.rows.clear();

        if (
            this.gridData &&
            this.gridData.items &&
            !this.gridData.items.length
        ) {
            return;
        }

        // create a GroupRow to show aggregates
        var row = new wjcGrid.GroupRow();

        // add the row to the column footer panel
        flex.columnFooters.rows.push(row);

        // show a sigma on the header
        flex.bottomLeftCells.setCellData(0, 0, "\u03A3");
    }

    private _firstVisibleCellIndex() {
        if (!this.flex || !this.flex.rows.length || !this.flex.columns.length) {
            return null;
        }

        return {
            r: 0,
            c: this.flex.columns.firstVisibleIndex,
        };
    }

    private compareComboboxColumn(a, b) {
        return ("" + a.value).localeCompare(b.value);
    }

    private sortComparer(a, b) {
        //Check Date column
        if (
            a &&
            typeof a === "string" &&
            a.indexOf("/") !== -1 &&
            b &&
            typeof b === "string" &&
            b.indexOf("/") !== -1
        ) {
            let aDateObj = parse(a, "MM/dd/yyyy", new Date());
            let bDateObj = parse(b, "MM/dd/yyyy", new Date());
            if (aDateObj && bDateObj) {
                return compareAsc(aDateObj, bDateObj);
            }
        }

        //Check Combobox column
        if (
            wjcCore.isObject(a) &&
            wjcCore.isObject(b) &&
            !wjcCore.isUndefined(a.key) &&
            !wjcCore.isUndefined(b.key)
        ) {
            return this.compareComboboxColumn(a, b);
        }

        return null;
    }

    public editRowButtonClickHandler(item) {
        this.onEditRowColumnClick.emit(item);
    }

    public editButtonClickHandler(rowData, binding) {
        this.onEditColumnClick.emit({
            data: rowData,
            binding: binding,
        });
    }

    private isColumnsChanged(oldColumns: any[], newColumns: any[]) {
        if (!oldColumns || !newColumns) {
            return true;
        }

        if (oldColumns.length !== newColumns.length) {
            return true;
        }

        for (let i = 0; i < oldColumns.length; i++) {
            if (!newColumns.find((x) => x.data == oldColumns[i].data)) {
                return true;
            }
        }

        return false;
    }

    public resizeRowHeaders(size) {
        this._resizeRowHeaders(size);
    }

    private _resizeRowHeaders(size) {
        this.flex.rowHeaders.columns.defaultSize = size;
    }

    /**
     * deletePriorityForCurrentItem
     */
    private deletePriorityForCurrentItem(item) {
        const priorityDeleted = item[this.CONTROL_COLUMNS.Priority];
        if (priorityDeleted) {
            const data = this.flex.collectionView.items;
            data.forEach((item) => {
                if (item[this.CONTROL_COLUMNS.Priority] > priorityDeleted) {
                    if (item[this.CONTROL_COLUMNS.Priority] > 1) {
                        item[this.CONTROL_COLUMNS.Priority] -= 1;
                    }
                }
            });
        }
        item[this.CONTROL_COLUMNS.Priority] = "";
        this.onPriorityEditEnded.emit();
        this.initPriorityList();
    }

    public onCheckboxExportChanged(item, $event) {
        this.onNoExportChanged.emit({ item, $event });
    }

    /****START Frequency grid *******/
    private buildQuantityPriorityList() {
        let count = 0;
        this.quantityPriority = [];
        this.gridData.items.forEach((item) => {
            Object.keys(item).forEach((keyName) => {
                if (
                    typeof item[keyName] === "object" &&
                    item[keyName]["Qty"] > 0
                ) {
                    count++;
                    this.quantityPriority.push({
                        key: count,
                        value: count,
                    });
                }
            });
        });
    }

    public onFrequencyPriorityChanged(newCellData, combobox) {
        if (
            combobox.selectedItem &&
            combobox.selectedItem.value &&
            this.currentCellData[this.CONTROL_COLUMNS.Priority] !=
                combobox.selectedItem.value
        ) {
            this.onTableEditStart.emit();
            this.updateQuantityPriority(
                this.currentCellData,
                combobox.selectedItem
            );
            this.updateQuantityColor(newCellData);
        }
    }

    public onFrequencyQuantityKeypress(e, quantityInputNumber) {
        if (e.keyCode === 13) {
            quantityInputNumber.onLostFocus();
        } else {
            this.onTableEditStart.emit();
        }
    }

    public onFrequencyQuantityInit(quantityInputNumber) {
        quantityInputNumber.focus();
    }

    public onFrequencyQuantityChanged(newCellData, quantityInputNumber) {
        if (this.currentCellData["ExportQty"] != quantityInputNumber.value) {
            if (newCellData["ExportQty"] > newCellData["Qty"]) {
                this.modalService.warningMessageHtmlContent({
                    headerText: "Update quantity",
                    messageType: MessageModal.MessageType.warning,
                    message: [
                        { key: "<p>" },
                        {
                            key: "Modal_Message__The_Value_Should_Not_Be_Greater_Than",
                        },
                        { key: "<strong>" },
                        { key: newCellData["Qty"] },
                        { key: "</strong></p>" },
                    ],
                    buttonType1: MessageModal.ButtonType.primary,
                    callBack1: () => {
                        newCellData["ExportQty"] =
                            this.currentCellData["ExportQty"];
                    },
                    callBackCloseButton: () => {
                        newCellData["ExportQty"] =
                            this.currentCellData["ExportQty"];
                    },
                });
            } else {
                this.updateQuantityColor(newCellData);
            }
        }
    }

    private updateQuantityColor(newCellData) {
        newCellData.isDirty = true;
        this.currentCellData = cloneDeep(newCellData);
        this.processUpdateQuantityColor();
        this.flex.refresh();

        this.onTableEditEnd.emit();
        this.onRowEditEnded.emit(this.gridData.currentItem);
    }

    private buildQuantityPriorityArray(fromItem?) {
        let result: any[] = [];
        this.gridData.items.forEach((item) => {
            Object.keys(item).forEach((keyName) => {
                if (
                    typeof item[keyName] === "object" &&
                    item[keyName]["Qty"] > 0
                ) {
                    if (fromItem && item[keyName].hasOwnProperty("pEdit")) {
                        item[keyName][this.CONTROL_COLUMNS.Priority] =
                            fromItem[this.CONTROL_COLUMNS.Priority];
                    }
                    result.push(item[keyName]);
                }
            });
        });

        return result;
    }

    private updateQuantityPriority(fromItem: any, changedPriorityOption: any) {
        let data = this.buildQuantityPriorityArray(fromItem);

        let destItem = data.find(
            (p) => p[this.CONTROL_COLUMNS.Priority] == changedPriorityOption.key
        );
        if (fromItem && destItem) {
            const fromIndex = data.findIndex(
                (p) =>
                    p[this.CONTROL_COLUMNS.Priority] ==
                    fromItem[this.CONTROL_COLUMNS.Priority]
            );
            const destIndex = data.findIndex(
                (p) =>
                    p[this.CONTROL_COLUMNS.Priority] ==
                    destItem[this.CONTROL_COLUMNS.Priority]
            );
            if (fromIndex < destIndex) {
                let arr = data.map((p) => p[this.CONTROL_COLUMNS.Priority]);
                arr.splice(fromIndex, 0, changedPriorityOption.key);
                arr.splice(destIndex + 1, 1);
                data.forEach((db, index, dataArr) => {
                    db[this.CONTROL_COLUMNS.Priority] = arr[index];
                    db["isDirty"] = true;
                });
            }
            if (fromIndex > destIndex) {
                var arr = data.map((p) => p[this.CONTROL_COLUMNS.Priority]);
                arr.splice(fromIndex + 1, 0, changedPriorityOption.key);
                arr.splice(destIndex, 1);
                data.forEach((db, index, dataArr) => {
                    db[this.CONTROL_COLUMNS.Priority] = arr[index];
                    db["isDirty"] = true;
                });
            }

            this.onPriorityEditEnded.emit();
        }
    }

    public onQuantityPriorityClick(data, binding, prop) {
        if (this.readOnly) {
            return;
        }

        this.stopQuantityPriorityEditMode();
        data[prop] = !data[prop];
        this.currentCellData = cloneDeep(data);
    }

    public onQuantityPriorityRightClick(data, binding) {
        if (data && binding && data["ExportQty"] != data["ExportQtyBackup"]) {
            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    headerText: "Restore Quantity",
                    messageType: MessageModal.MessageType.error,
                    message: [
                        { key: "<p>" },
                        { key: "Modal_Message__Quantity_Will_Change_From" },
                        { key: "<strong>" },
                        { key: data["ExportQty"] },
                        { key: "</strong>" },
                        { key: "Modal_Message__To" },
                        { key: "<strong>" },
                        { key: data["ExportQtyBackup"] },
                        { key: "</strong>." },
                        { key: "Modal_Message__Are_You_Sure" },
                        { key: "</p>" },
                    ],
                    buttonType1: MessageModal.ButtonType.danger,
                    callBack1: () => {
                        data["ExportQty"] = data["ExportQtyBackup"];
                    },
                })
            );
        }
    }

    private stopQuantityPriorityEditMode() {
        this.gridData.items.forEach((item) => {
            Object.keys(item).forEach((keyName) => {
                if (typeof item[keyName] === "object") {
                    if (item[keyName].hasOwnProperty("pEdit")) {
                        delete item[keyName]["pEdit"];
                    }
                    if (item[keyName].hasOwnProperty("qEdit")) {
                        delete item[keyName]["qEdit"];
                    }
                }
            });
        });
    }

    private resetProps(obj, props: string[]) {
        for (let i = 0; i < props.length; i++) {
            if (obj.hasOwnProperty(props[i])) {
                delete obj[props[i]];
            }
        }
    }

    private processUpdateQuantityColor() {
        if (!this.requiredAddressNumber) {
            return;
        }

        let requiredNumber = this.requiredAddressNumber;
        let priorityData = this.buildQuantityPriorityArray();
        priorityData = orderBy(
            priorityData,
            [this.CONTROL_COLUMNS.Priority],
            ["asc"]
        );

        let totalQuantity = 0;
        let notRedAnymore = false;
        for (let i = 0; i < priorityData.length; i++) {
            this.resetProps(priorityData[i], [
                "isRed",
                "isBlue",
                "isGreen",
                "isUnderline",
                "isDarkRed",
                "isDarkBlue",
                "isDarkGreen",
            ]);

            //Underline
            if (priorityData[i]["ExportQty"] < priorityData[i]["Qty"]) {
                priorityData[i]["isUnderline"] = true;
            }

            //Blue color
            if (priorityData[i]["isUnderline"]) {
                priorityData[i]["isDarkBlue"] = true;
            } else {
                priorityData[i]["isBlue"] = true;
            }

            //Green color
            if (priorityData[i]["Qty"] < 10) {
                priorityData[i]["isBlue"] = false;
                priorityData[i]["isDarkBlue"] = false;

                if (priorityData[i]["isUnderline"]) {
                    priorityData[i]["isDarkGreen"] = true;
                } else {
                    priorityData[i]["isGreen"] = true;
                }
            }

            //Red color
            if (!notRedAnymore) {
                totalQuantity += priorityData[i]["ExportQty"];
                if (totalQuantity >= requiredNumber) {
                    let diff =
                        requiredNumber -
                        (totalQuantity - priorityData[i]["ExportQty"]);
                    priorityData[i]["ExportQty"] = diff;

                    notRedAnymore = true;
                }

                priorityData[i]["isBlue"] = false;
                priorityData[i]["isDarkBlue"] = false;
                priorityData[i]["isGreen"] = false;
                priorityData[i]["isDarkGreen"] = false;

                //Underline
                if (priorityData[i]["ExportQty"] < priorityData[i]["Qty"]) {
                    priorityData[i]["isUnderline"] = true;
                }
                if (priorityData[i]["isUnderline"]) {
                    priorityData[i]["isDarkRed"] = true;
                } else {
                    priorityData[i]["isRed"] = true;
                }
            }
        }
    }

    private buildCellColor(cell, item, col) {
        if (!this.requiredAddressNumber) {
            $(cell).addClass("red-text");
        }

        if (item[col.data].isUnderline) {
            $(cell).addClass("underline-text");
        }

        if (item[col.data].isDarkBlue) {
            $(cell).addClass("dark-blue-text");
        }

        if (item[col.data].isDarkGreen) {
            $(cell).addClass("dark-green-text");
        }

        if (item[col.data].isDarkRed) {
            $(cell).addClass("dark-red-text");
        }

        if (item[col.data].isBlue) {
            $(cell).addClass("blue-text");
        }

        if (item[col.data].isGreen) {
            $(cell).addClass("green-text");
        }

        if (item[col.data].isRed) {
            $(cell).addClass("red-text");
        }
    }

    private updateCellPriority(item) {
        if (item.hasOwnProperty(this.CONTROL_COLUMNS.Priority)) {
            const priority = item[this.CONTROL_COLUMNS.Priority];
            if (!priority) {
                let data = this.flex.collectionView.items;
                const maxLength = data.length;
                const arr = data.map((p) =>
                    toSafeInteger(p[this.CONTROL_COLUMNS.Priority])
                );
                const maxValue = max(arr);
                if (maxValue < maxLength) {
                    item[this.CONTROL_COLUMNS.Priority] = maxValue + 1;
                } else {
                    let validPriority = maxValue;
                    let rs;
                    do {
                        validPriority -= 1;
                        rs = data.find(
                            (p) =>
                                p[this.CONTROL_COLUMNS.Priority] ==
                                validPriority
                        );
                    } while (rs);
                    item[this.CONTROL_COLUMNS.Priority] = validPriority;
                }
                this.initPriorityList();

                this.onCellEditEnded.emit(this.gridData.currentItem);
            }
        }
    }
    /****END Frequency grid *******/

    /**
     * updatePriority
     */
    private updatePriority(fromItem: any, changedPriorityOption: any) {
        let data = this.flex.collectionView.items.filter(
            (p) => p[this.CONTROL_COLUMNS.Priority]
        );
        let destItem = data.find(
            (p) => p[this.CONTROL_COLUMNS.Priority] == changedPriorityOption.key
        );
        if (fromItem && destItem) {
            const idField = Object.keys(fromItem).find((k) => k == "id")
                ? "id"
                : "DT_RowId";
            const fromIndex = data.findIndex(
                (p) => p[idField] == fromItem[idField]
            );
            const destIndex = data.findIndex(
                (p) => p[idField] == destItem[idField]
            );
            if (fromIndex < destIndex) {
                let arr = data.map((p) => p[this.CONTROL_COLUMNS.Priority]);
                arr.splice(fromIndex, 0, changedPriorityOption.key);
                arr.splice(destIndex + 1, 1);
                data.forEach((db, index, dataArr) => {
                    db[this.CONTROL_COLUMNS.Priority] = arr[index];
                });
            }
            if (fromIndex > destIndex) {
                var arr = data.map((p) => p[this.CONTROL_COLUMNS.Priority]);
                arr.splice(fromIndex + 1, 0, changedPriorityOption.key);
                arr.splice(destIndex, 1);
                data.forEach((db, index, dataArr) => {
                    db[this.CONTROL_COLUMNS.Priority] = arr[index];
                });
            }

            this.onPriorityEditEnded.emit();
        }
    }

    /**
     * onPriorityChangeValue
     * @param item
     * @param $event
     */
    onPriorityChangeValue(item, $event) {
        if ($event.selectedItem && $event.selectedItem.value) {
            this.updatePriority(item, $event.selectedItem);
        }
    }

    public onSelectColumnChanged(item, event, cell) {
        item["IsActive"] = event.checked;

        if (this.gridData.itemsEdited.indexOf(item) < 0) {
            this.gridData.itemsEdited.push(item);
        }

        this.flex.refresh(true);

        if (event.checked) {
            this.flex.select(
                new wjcGrid.CellRange(
                    cell.row.index,
                    cell.col.index + 1,
                    cell.row.index,
                    cell.col.index + 1
                )
            );

            this.updateCellPriority(item);
        }

        this.onSelectionColumnChanged.emit(item["IsActive"]);
    }

    /**
     * registerCellClickEvent
     */
    private registerCellClickEvent() {
        this.flex.addEventListener(this.flex.hostElement, "click", (e) => {
            const ht = this.flex.hitTest(e);
            if (ht.cellType === wjcGrid.CellType.Cell) {
                let item = this.flex.rows[ht.row].dataItem;
                const binding = this.flex.columns[ht.col].binding;

                if (!isNil(item["IsActive"]) && this.hasDisableRow) {
                    if (binding !== "IsActive" && item["IsActive"] === false) {
                        e.cancel = true;
                        return;
                    }
                }

                if (
                    !this.readOnly &&
                    binding == this.CONTROL_COLUMNS.Priority
                ) {
                    this.updateCellPriority(item);
                }
            } else if (ht.cellType === wjcGrid.CellType.None) {
                if (this.hasQuantityPriorityColumn) {
                    this.stopQuantityPriorityEditMode();
                }
            }
        });
    }
}
