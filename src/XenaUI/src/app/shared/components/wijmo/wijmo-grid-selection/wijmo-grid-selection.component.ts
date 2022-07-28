import { Component, Input, Output, OnInit, OnDestroy, AfterViewInit, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, Inject, forwardRef } from '@angular/core';
import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as gridPdf from 'wijmo/wijmo.grid.pdf';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import * as wjcInput from 'wijmo/wijmo.input';
import * as Ps from 'perfect-scrollbar';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import cloneDeep from 'lodash-es/cloneDeep';
import isObject from 'lodash-es/isObject';
import mapKeys from 'lodash-es/mapKeys';
import camelCase from 'lodash-es/camelCase';
import isString from 'lodash-es/isString';
import isNumber from 'lodash-es/isNumber';
import isBoolean from 'lodash-es/isBoolean';
import isNaN from 'lodash-es/isNaN';
import orderBy from 'lodash-es/orderBy';
import max from 'lodash-es/max';
import toSafeInteger from 'lodash-es/toSafeInteger';

import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { GridActions, CustomAction } from 'app/state-management/store/actions';
import { AppState } from 'app/state-management/store';
import { Subscription } from 'rxjs/Subscription';
import {
    DatatableService,
    CommonService,
    AppErrorHandler,
    ModalService,
    ScrollUtils,
    DomHandler,
    PropertyPanelService
} from 'app/services';
import { MessageModal } from 'app/app.constants';
import { MessageModel, ApiResultResponse } from 'app/models';
import { Uti } from 'app/utilities/uti';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { format } from 'date-fns/esm';
import { IPageChangedEvent } from '../../xn-pager/xn-pagination.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'wijmo-grid-selection',
    styleUrls: ['./wijmo-grid-selection.component.scss', './wijmo-grid-selection.component.flag.scss'],
    templateUrl: './wijmo-grid-selection.component.html'
})

export class WijmoGridSelectionComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    public priority = [];
    public quantityPriority = [];
    private currentCellData: any;
    private _filter = '';
    private _thisFilterFunction: wjcCore.IPredicate;
    private _toFilter: any;
    private currentSelectedColHeader: any = null;
    public wijmoDataSource: any = null;
    private _colWidthUpdated = false;
    private _beginningEdit = false;
    private isDoubleClick = false;
    private popupPosition: { top: number, left: number } = { top: -50, left: 0 };
    private isHalfOpacity = false;
    public isShowingPopupFilter = false;
    private _randomNo: number = Math.round(Math.random() * 10000000);
    private _errorObject: any = {};
    private _activeRowIndex: number;
    private showCtxItem = false;
    private deletedItemList: any[] = [];
    private _hasValidationError = false;
    public isSelectDeletedAll = false;
    private _isFormDirty = false;
    // the current page
    public currentPage = 1;
    private totalResults: number;
    private _previousCellRange: any = {
        col: -1,
        row: -1
    };
    private _scrollUtils: ScrollUtils;
    private get scrollUtils() {
        if (!this._scrollUtils) {
            this._scrollUtils = new ScrollUtils(this.scrollBodyContainer, this.domHandler);
        }
        return this._scrollUtils;
    }
    private filterObj: any;
    public globalDateFormat: string = null;
    public globalNumberFormat: string = null;
    gridData: wjcCore.CollectionView;
    gridColumns: any[] = [];
    newDate: any = new Date();
    filterColumns: any[] = [];
    editingRow: any = null;
    groupByColumn: any = null;
    itemFormatter: Function;
    isMarkedAsDelete = false;
    isMarkedAsSelectedAll = false;
    search = '';
    gridScrollBars: any = {
        right: false,
        bottom: false,
        reachBottom: false,
        reachRight: false
    };
    localGridStyle: any = {
        headerStyle: {},
        rowStyle: {}
    }
    public CONTROL_COLUMNS = {
        Priority: 'Priority',
        deleted: 'deleted',
        mediaCodeButton: 'mediaCodeButton',
        download: 'download',
        selectAll: 'selectAll',
        InvoicePDF: 'InvoicePDF',
        Tracking: 'Tracking',
        Return: 'Return',
        SendLetter: 'SendLetter',
        SAV: 'SAV',
        Unblock: 'Unblock',
        Delete: 'Delete',
        Edit: 'Edit',
        FilterExtended: 'FilterExtended',
        noExport: 'noExport'
    };
    public isSearching = false;
    //public isCountrySelectAll = false;


    private commonServiceSubscription: Subscription;
    private requestRefreshSubscription: Subscription;
    private requestInvalidateSubscription: Subscription;

    private fitWidth = true;
    private isDragging = false;
    private resizing = false;
    private showTotalRowLocal = false;

    @Input() parentInstance: any = null;
    @Input() columnsLayoutSettings: any = null;
    @Input() readOnly = true;
    @Input() hasSearch = false;
    @Input() hasFilter = true;
    @Input() hasFilterBox = false;
    @Input() selectionMode: any = 'Row';
    @Input() headersVisibility: any = 'All';
    @Input() showSelectedHeaders: any = 'None';
    @Input() showMarquee = false;
    @Input() allowResizing: any = 'Both';
    @Input() columnFilter = true;
    @Input() isShowedEditButtons = false;
    @Input() enableDownloadColumn = false;
    @Input() set fitWidthColumn(fitWidth: boolean) {
        if (!isNil(fitWidth)) {
            this.fitWidth = fitWidth;

            if (this.fitWidth) {
                this._turnOnStarResizeMode();
            } else {
                this._turnOffStarResizeMode();

                if (this.columnLayout || (this.columnsLayoutSettings && this.columnsLayoutSettings.settings)) {
                    this._updateColumnLayoutFromState();
                } else {
                    this.flex.autoSizeColumns();
                }
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
    @Input() autoSelectFirstRow = true;
    @Input() allowUploadFile = false;
    @Input() isShowedHeader: boolean;
    @Input() allowSelectAll = false;
    @Input() headerTitle: string;
    @Input() set isFormDirty(obj: any) {
        this._isFormDirty = obj.value;
    }
    @Input() set activeRowIndex(val) {
        this._activeRowIndex = val;
        if (!isNil(this._activeRowIndex)) {
            this.selectRowIndex(val);
        }
    }
    @Input() hasDisableRow = false;
    @Input() smallRowHeaders = false;
    //@Input() hasCountrySelectAll = false;
    @Input() allowSorting = true;
    @Input() disabledAll = false;
    @Input() hasCountryFlagColumn = false;
    @Input() hasQuantityPriorityColumn = false;
    @Input() noFilterColumns: string[] = [];
    @Input() customClass: string;
    @Input() requiredAddressNumber = 0;
    @Input() redRowOnDelete = false;
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

    get activeRowIndex() {
        return this._activeRowIndex;
    }

    @Input() set dataSource(dataSource: any) {
        if (!dataSource) {
            return;
        }

        this._errorObject = {};
        this.totalResults = dataSource.totalResults;
        const config = {
            allowDelete: this.allowDelete,
            allowMediaCode: this.allowMediaCode,
            allowDownload: this.allowDownload,
            allowSelectAll: this.allowSelectAll,
            hasDisableRow: this.hasDisableRow,
            hasCountryFlagColumn: this.hasCountryFlagColumn
        }
        this.wijmoDataSource = this.datatableService.buildWijmoDataSource(dataSource, config);

        this.gridData = new wjcCore.CollectionView(this.wijmoDataSource.data, {
            getError: this.validateCells
        });
        this.gridData.trackChanges = true;

        this.gridData.collectionChanged.addHandler(this.collectionChangedHandler);

        this._toggleNoDataMessage();

        this.deletedItemList = [];
        if (this.gridData.items.length) {
            const deletedItems = this.gridData.items.filter(i => i.deleted === true);
            if (deletedItems && deletedItems.length) {
                for (const item of deletedItems) {
                    this.deletedItemList.push(item);
                }
            }
        }

        //this.flex.selection = null;

        if (this.isColumnsChanged(this.gridColumns, this.wijmoDataSource.columns)) {
            this.gridColumns = this.wijmoDataSource.columns;


            this.filterColumns = this.datatableService.buildWijmoFilterColumns(this.gridColumns, config, this.noFilterColumns);

            if (this.flex) {
                const groupByColumn = this._getGroupByColumn(this.gridColumns);
                if (groupByColumn) {
                    this._applyGroupBy(groupByColumn);
                }

                this._updateColumnLayoutFromState();

                this.addPerfectScrollbar();
                this.checkGridHasScrollbars();
                this.selectRowIndex(this.activeRowIndex);
                this.setAutoSizeColumns();
                if (this.smallRowHeaders) {
                    this.resizeRowHeaders(22);
                }

                setTimeout(() => {
                    this.toggleDeleteColumn(false);
                });

                if (this.showTotalRowLocal) {
                    this._addFooterRow(this.flex);
                } else {
                    this.flex.columnFooters.rows.clear();
                }
            }

            this.resetPopup();
        }
        const count = this.gridData.items.length;
        this.priority = [];
        for (let i = 0; i < count; i++) {
            this.priority.push({
                key: i + 1,
                value: i + 1
            });
        }

        if (this.hasQuantityPriorityColumn) {
            this.buildQuantityPriorityList();
            this.processUpdateQuantityColor();
        }
    };

    /**
     * initPriorityList
     */
    private initPriorityList() {
        this.priority = [];
        const priorityList = this.gridData.items.map(o => o[this.CONTROL_COLUMNS.Priority]);
        if (priorityList && priorityList.length) {
            const maxValue = Math.max.apply(Math, priorityList);
            for (let i = 0; i < maxValue; i++) {
                this.priority.push({
                    key: i + 1,
                    value: i + 1
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
    @Input() isDisableRowWithSelectAll: boolean = false;
    @Input() isDesignWidgetMode = false;
    @Input() enableQtyWithColor = false;
    @Input() set globalProperties(globalProperties: any[]) {
        this.globalDateFormat = this.propertyPanelService.buildGlobalDateFormatFromProperties(globalProperties);
        this.globalNumberFormat = this.propertyPanelService.buildGlobalNumberFormatFromProperties(globalProperties);
    }

    @Output() gridItemRightClick = new EventEmitter<any>();
    @Output() onRowClick = new EventEmitter<any>();
    @Output() onTableEditStart = new EventEmitter<any>();
    @Output() onTableEditEnd = new EventEmitter<any>();
    @Output() onRowMarkedAsDelete = new EventEmitter<any>();
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
    @Output() onPageChanged = new EventEmitter<IPageChangedEvent>();
    @Output() onDeletedRows = new EventEmitter<any>();
    @Output() onCellClick = new EventEmitter<any>();
    @Output() onChangeSelectedItems = new EventEmitter<any>();
    @Output() onUploadFileClick = new EventEmitter<any>();
    @Output() onRowClickingConfirmYes = new EventEmitter<any>();
    @Output() onBeforeSelectionChange = new EventEmitter<any>();
    @Output() onMarkedAsSelectedAll = new EventEmitter<any>();
    @Output() onEditColumnClick = new EventEmitter<any>();
    @Output() onSelectionColumnChanged = new EventEmitter<any>();
    @Output() onCellEditEnded = new EventEmitter<any>();
    @Output() onChangeColumnLayout = new EventEmitter<any>();
    //@Output() onSelectAllCountryChanged = new EventEmitter<any>();
    @Output() onNoExportChanged = new EventEmitter<any>();
    @Output() onPriorityEditEnded = new EventEmitter<any>();

    @ViewChild('flex') flex: wjcGrid.FlexGrid;
    @ViewChild('filter') gridFilter: wjcGridFilter.FlexGridFilter;
    @ViewChild('popup') popup: wjcInput.Popup;

    get filter(): string {
        return this._filter;
    }
    set filter(value: string) {
        if (this._filter !== value) {
            this._filter = value;
            this._applyFilter();
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
        private uti: Uti,
        public translateService: TranslateService,
        protected router: Router
    ) {
        super(router);

        this._thisFilterFunction = this._filterFunction.bind(this);
        this.validateCells = this.validateCells.bind(this);
        this.beginningEditHandler = this.beginningEditHandler.bind(this);
        this.collectionChangedHandler = this.collectionChangedHandler.bind(this);
        this.itemFormatter = this._itemFormatterFunc.bind(this);
        this._onCellClick = this._onCellClick.bind(this);
        this.copyingHandler = this.copyingHandler.bind(this);
        this._pastingCellHandler = this._pastingCellHandler.bind(this);
        this.selectionChangedHandler = this.selectionChangedHandler.bind(this);
        this.selectionChangingHandler = this.selectionChangingHandler.bind(this);
        this.onGridKeydown = this.onGridKeydown.bind(this);
    }

    ngOnInit() {
        this._subscribeRequestRefreshState();
        this._subscribeRequestInvalidateState();
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);

        this._removeHorizontalPerfectScrollEvent();
        this._removeVerticalPerfectScrollEvent();
    }

    ngAfterViewInit() {
        if (this.flex) {
            this.registerCellClickEvent();
            this.registerContextMenu();
            this.addPerfectScrollbar();
            this.checkGridHasScrollbars();

            if (this.activeRowIndex) {
                this.selectRowIndex(this.activeRowIndex);
            } else if (this.autoSelectFirstRow) {
                this.selectFirstRow();
            }

            this.flex.selectionChanging.addHandler(this.selectionChangingHandler);
            this.flex.selectionChanged.addHandler(this.selectionChangedHandler)
            this.flex.beginningEdit.addHandler(this.beginningEditHandler);
            this.flex.cells.hostElement.addEventListener('click', this._onCellClick);
            this.flex.copying.addHandler(this.copyingHandler);
            this.flex.pastingCell.addHandler(this._pastingCellHandler);
            this.flex.hostElement.addEventListener("keydown", this.onGridKeydown);
            this.flex.resizingColumn.addHandler(this.resizingColumnHandler.bind(this));
            this.flex.resizedColumn.addHandler(this.resizedColumnHandler.bind(this));

            if (this.smallRowHeaders) {
                this.resizeRowHeaders(22);
            }

            setTimeout(() => {
                this.toggleDeleteColumn(false);
            }, 200);

            if (this.allowDrag) {
                this._initDragDropHandler();
            }
        }
    }

    addPerfectScrollbar() {
        this._addPerfectScrollbar();
    }

    checkGridHasScrollbars() {
        this._checkGridHasScrollbars();
    }

    format(data: any, formatPattern: string) {
        const result = !data ? '' : this.uti.formatLocale(new Date(data), formatPattern);
        return result;
    }

    deleteRows() {
        this._deleteRows();
    }

    /**
     * setAutoSizeColumns
     */
    setAutoSizeColumns() {
        if (this.wijmoDataSource && this.wijmoDataSource.columns) {
            setTimeout(() => {
                (this.wijmoDataSource.columns as Array<any>).forEach((col, index) => {
                    if (col.autoSize) {
                        this.flex.autoSizeColumn(index);
                    }
                });
            });
        }
    }

    selectionChangingHandler(s, e) {
        if (this._isFormDirty) {
            e.cancel = true;
            this.onBeforeSelectionChange.emit(e);
        } else {
            if (this.disabledAll) {
                e.cancel = true;
                return;
            }

            //const selectingRow: any = this._getSelectedFlexRow(this.flex.rows, e);
            //if (selectingRow && !isNil(selectingRow.dataItem['IsActive']) && this.hasDisableRow) {
            //    if (!this.readOnly && selectingRow.dataItem['IsActive'] === false) {
            //        e.cancel = true;
            //    }
            //} else {
            //    if (e.col === 0 && e.row === 0 && !this.autoSelectFirstRow) {
            //        e.cancel = true;
            //    } else {
            //        e.cancel = false;
            //    }
            //}

            if (e.col === 0 && e.row === 0 && !this.autoSelectFirstRow) {
                e.cancel = true;
            } else {
                e.cancel = false;
            }
        }
    }

    selectionChangedHandler(s, e) {
        this._selectionChangedHandler(e);
    }

    beginningEditHandler(s, e) {
        this._beginningEditHandler(s, e);
    }

    collectionChangedHandler(s, e) {
        this._collectionChangedHandler(s, e);
    }

    rowEditStartedHandler(eventData) {
        this._rowEditStartedHandler(eventData);
    }

    rowEditEndedHandler(eventData) {
        this._rowEditEndedHandler(eventData);
    }

    cellEditEndedHandler(eventData) {
        this._cellEditEndedHandler(eventData);
    }

    hasUnsavedRows() {
        return this._hasUnsavedRows();
    }

    getWijmoGridData() {
        return this._getWijmoGridData();
    }

    getWillDeletedItems() {
        return this._getWillDeletedItems();
    }

    public resizingColumnHandler(s, e) {
        this._resizingColumnHandler(s, e);
    }

    validateCells(item, property) {
        if (this.disabledAll) {
            return null;
        }

        if (this.resizing) {
            return null;
        }

        if (this.readOnly || !item || !property) {
            this._errorObject = this._buildErrorObject(this._errorObject, item, property, false);
            return null;
        }

        const column = this.gridColumns.find(col => col.data === property);

        if (!column) {
            this._errorObject = this._buildErrorObject(this._errorObject, item, property, false);
            return null;
        }

        if (this.datatableService.hasValidation(column, 'IsRequired')) {
            if (isEmpty(item[property]) || (typeof item[property] === 'object' && !item[property]['key'])) {
                this._errorObject = this._buildErrorObject(this._errorObject, item, property, true);
                return 'Field is required';
            }
        }

        if (this.datatableService.hasValidation(column, 'Comparison')) {
            if (isEmpty(item[property]) || (typeof item[property] === 'object' && !item[property]['key'])) {
                this._errorObject = this._buildErrorObject(this._errorObject, item, property, true);
                let compareThem = {
                    '<=': (x, y) => { return x <= y },
                    '<': (x, y) => { return x < y },
                    '=': (x, y) => { return x == y },
                    '>': (x, y) => { return x > y },
                    '>=': (x, y) => { return x >= y }
                };

                let comparisonRules = this.datatableService.getSettingContainsValidation(column.setting.Setting).Validation.Comparison;
                for (let i = 0; i < comparisonRules.length; i++) {
                    let leftData = parseFloat(item[property]) || 0.0;
                    let rightData = parseFloat(item[comparisonRules[i].With]) || 0.0;
                    if (compareThem[comparisonRules[i].Operator](leftData, rightData) === false) {
                        return comparisonRules[i].ErrorMessage;
                    }
                }
            }
        }

        if (this.datatableService.hasValidation(column, 'IsUniqued')) {
            let uniqueList = this.gridData.items.filter(x => !isNil(x[property]) && (x.DT_RowId != item.DT_RowId || x.id != item.id));
            if (uniqueList.length) {
                uniqueList = uniqueList.map(dt => {
                    return dt.MediaCode.trim();
                });

                if (uniqueList.indexOf(item[property]) !== -1) {
                    this._errorObject = this._buildErrorObject(this._errorObject, item, property, true);
                    return this.datatableService.getSettingContainsValidation(column.setting.Setting).Validation.ErrorMessage;
                }
            }
        }

        if (this.datatableService.hasValidation(column)) {
            const regexData = this.datatableService.buildWijmoGridValidationExpression(item, column);
            if (regexData && regexData.Regex) {
                const regex = new RegExp(decodeURIComponent(regexData.Regex), 'g');

                if (!regex.test(item[property])) {
                    this._errorObject = this._buildErrorObject(this._errorObject, item, property, true);
                    if (regexData.ErrorMessage) {
                        return regexData.ErrorMessage;
                    } else {
                        return 'Invalid';
                    }
                }
            }
        }

        this._errorObject = this._buildErrorObject(this._errorObject, item, property, false);
        return null;
    }

    hasError() {
        this._hasValidationError = false;

        let hasError = this._hasError();
        if (hasError.result) {
            let itemHasError = this.gridData.items.find(i => i.DT_RowId == hasError.rowID);
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

    onRowDblclicked(s: wjcGrid.FlexGrid, e: any) {
        this._onRowDblclicked(s, e);
    }

    refresh() {
        this._refresh();
    }

    invalidate() {
        this._invalidate();
    }

    currentPageChanged(event: IPageChangedEvent): void {
        if (this.flex) {
            this.flex.select(new wjcGrid.CellRange(-1, -1, -1, -1));
        }
        this.onPageChanged.emit(event);
    };

    selectFirstRow() {
        this._selectFirstRow();
    }

    selectRowIndex(index: number) {
        this._selectRowIndex(index);
    }

    selectCell(iRow: number, iCol: number) {
        this._selectCell(iRow, iCol);
    }

    doSearch(value: string) {
        this.isSearching = true;
        if (this.search !== value) {
            this.search = value;
            this._applySearch();
        }
    }

    searchClicked() {
        if (!this.search) return;
        this.isSearching = true;
        setTimeout(() => {
            this.isSearching = false;
        }, 500);
    }

    exportToPdf(fileName) {
        gridPdf.FlexGridPdfConverter.export(this.flex, fileName + '.pdf');
    }

    public turnOnStarResizeMode() {
        this._turnOnStarResizeMode();
    }

    copyingHandler(s: wjcGrid.FlexGrid, e: any) {
        this._copyingHandler(s, e);
    }

    private onGridKeydown(e) {
        const n = (window.event) ? e.which : e.keyCode;
        if (n === 9) {
            if (e.which == 9) {
                let selectedCellRange = this.flex.selection;
                let nextCell: any = {
                    col: selectedCellRange.col + 1,
                    row: selectedCellRange.row
                };

                if (nextCell.col == this.flex.columns.length && nextCell.row == this.flex.rows.length) {
                    nextCell.col = 1;
                    nextCell.row = 0;
                } else if (nextCell.col == this.flex.columns.length) {
                    nextCell.col = 1;
                    nextCell.row += 1;

                    if (nextCell.row == this.flex.rows.length) {
                        nextCell.row = 0;
                    }
                }

                this.flex.select(new wjcGrid.CellRange(nextCell.row, nextCell.col, nextCell.row, nextCell.col));
            }
        }
    }

    private _copyingHandler(s: wjcGrid.FlexGrid, e: any) {
        const colBinding = this.flex.columns[e.col]['binding'],
            cellData = this.gridData.currentItem[colBinding];

        wjcCore.Clipboard.copy(cellData.toString());
        e.cancel = true;
    }

    private _onCellClick() {
        this.onCellClick.emit(this.flex.selection);
    }

    private _pastingCellHandler(p: any, e: any) {
        const isNotTheSelectingCell = (!p.selection || p.selection.col !== e.col || p.selection.row !== e.row);
        const isComboboxCell = this.gridColumns[e.col].dataType === 'Object';

        e.cancel = isNotTheSelectingCell || isComboboxCell;
    }

    /**
     * registerCellClickEvent
     */
    private registerCellClickEvent() {
        this.flex.addEventListener(this.flex.hostElement, 'click', (e) => {

            const ht = this.flex.hitTest(e);
            if (ht.cellType === wjcGrid.CellType.Cell) {
                let item = this.flex.rows[ht.row].dataItem;
                const binding = this.flex.columns[ht.col].binding;

                if (!isNil(item['IsActive']) && this.hasDisableRow) {
                    if (binding !== 'IsActive' && item['IsActive'] === false) {
                        e.cancel = true;
                        return;
                    }
                }

                if (!this.readOnly && binding == this.CONTROL_COLUMNS.Priority) {
                    this.updateCellPriority(item);
                }
            } else if (ht.cellType === wjcGrid.CellType.None) {
                if (this.hasQuantityPriorityColumn) {
                    this.stopQuantityPriorityEditMode();
                }
            }
        });
    }

    private updateCellPriority(item) {
        if (item.hasOwnProperty(this.CONTROL_COLUMNS.Priority)) {
            const priority = item[this.CONTROL_COLUMNS.Priority];
            if (!priority) {
                let data = this.flex.collectionView.items;
                const maxLength = data.length;
                const arr = data.map(p => toSafeInteger(p[this.CONTROL_COLUMNS.Priority]));
                const maxValue = max(arr);
                if (maxValue < maxLength) {
                    item[this.CONTROL_COLUMNS.Priority] = maxValue + 1;
                }
                else {
                    let validPriority = maxValue;
                    let rs;
                    do {
                        validPriority -= 1;
                        rs = data.find(p => p[this.CONTROL_COLUMNS.Priority] == validPriority);
                    } while (rs);
                    item[this.CONTROL_COLUMNS.Priority] = validPriority;
                }
                this.initPriorityList();

                this.onCellEditEnded.emit(this.gridData.currentItem);
            }
        }
    }

    private registerContextMenu() {
        if (this.showContextMenu) {
            this.flex.addEventListener(this.flex.hostElement, 'contextmenu', (e) => {
                this.showCtxItem = false;
                const ht = this.flex.hitTest(e);
                if (ht.row < 0 || ht.col < 0) {
                    return;
                }

                const selection = this.flex.selection;
                if ((selection.row !== ht.row) || (selection.col !== ht.col)) {
                    this.flex.select(new wjcGrid.CellRange(ht.row, ht.col, ht.row, ht.col));
                } else {
                    this.gridItemRightClick.emit(this.flex.selectedItems);
                }

                let item = this.flex.rows[ht.row].dataItem;

                const binding = this.flex.columns[ht.col].binding;
                if (binding == this.CONTROL_COLUMNS.Priority && !this.readOnly) {
                    if (!$(e.target).hasClass('wj-form-control')
                        && !$(e.target).hasClass('wj-btn')
                        && !$(e.target).hasClass('wj-glyph-down')) {
                        this.deletePriorityForCurrentItem(item);
                    }
                }
                else {
                    setTimeout(() => {
                        this.showCtxItem = true;

                        this.ref.detectChanges();
                    }, 300);
                }
            });
        }
    }

    /**
     * deletePriorityForCurrentItem
     */
    private deletePriorityForCurrentItem(item) {
        const priorityDeleted = item[this.CONTROL_COLUMNS.Priority];
        if (priorityDeleted) {
            const data = this.flex.collectionView.items;
            data.forEach(item => {
                if (item[this.CONTROL_COLUMNS.Priority] > priorityDeleted) {
                    if (item[this.CONTROL_COLUMNS.Priority] > 1) {
                        item[this.CONTROL_COLUMNS.Priority] -= 1;
                    }
                }
            });
        }
        item[this.CONTROL_COLUMNS.Priority] = '';
        this.onPriorityEditEnded.emit();
        this.initPriorityList();
    }

    private _selectFirstRow() {
        if (this.flex.rows.length) {
            setTimeout(() => {
                this.flex.select(new wjcGrid.CellRange(0, 1, 0, 1));
            }, 200);
        }
    }

    private _selectRowIndex(index: number) {
        if (this.flex && this.flex.rows && this.flex.rows.length && !isNil(index)) {
            setTimeout(() => {
                this.flex.select(new wjcGrid.CellRange(index, 1, index, 1))
            }, 200);
        }
    }

    private _selectCell(iRow: number, iCol: number) {
        if (this.flex && this.flex.rows && this.flex.rows.length && !isNil(iRow) && !isNil(iCol) &&
            this.flex.rows.length > iRow && this.flex.columns.length > iCol) {
            setTimeout(() => {
                this.flex.select(new wjcGrid.CellRange(iRow, iCol, iRow, iCol));
            }, 200);
        }
    }


    private _refresh() {
        this.isMarkedAsDelete = false;
        this.isSelectDeletedAll = false;
        setTimeout(() => {
            this.flex.refresh();
        }, 100);
    }

    private _invalidate() {
        if (this.flex) {
            this.flex.invalidate();
        }
    }

    private _buildErrorObject(errorObject, item, property, hasError) {
        if (item['DT_RowId']) {
            if (!this._errorObject[item['DT_RowId']]) {
                this._errorObject[item['DT_RowId']] = {};
            }
            this._errorObject[item['DT_RowId']][property] = hasError;
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
                            result: true
                        };
                    }
                }
            }
        }

        return {
            rowID: null,
            result: false
        };
    }

    private _onRowDblclicked(s: wjcGrid.FlexGrid, e: any) {
        if (s.activeEditor) {
            return;
        }

        this.isDoubleClick = true;
        this.onRowDoubleClick.emit(s.selectedRows[0] ? s.selectedRows[0].dataItem : null);
    }

    private _updateColumnLayoutFromState() {
        setTimeout(() => {
            if (this.fitWidth) {
                this.turnOnStarResizeMode();
            } else if (this.columnsLayoutSettings && this.columnsLayoutSettings.settings) {
                this.updateColumnWidth(this.flex.columns, this.columnsLayoutSettings.settings);
            }
        });
    }

    private updateColumnWidth(columns, columnLayout) {
        const columnLayoutObj = JSON.parse(columnLayout);
        if (columnLayoutObj && columnLayoutObj.columns) {
            for (let i = 0; i < columnLayoutObj.columns.length; i++) {
                if (columnLayoutObj.columns[i])
                    columns[i].width = columnLayoutObj.columns[i].width;
            }
        }
    }

    private _subscribeRequestRefreshState() {
        this.requestRefreshSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === GridActions.REQUEST_REFRESH && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.refresh();
            });
        });
    }

    private _subscribeRequestInvalidateState() {
        this.requestInvalidateSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === GridActions.REQUEST_INVALIDATE && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.invalidate();
            });
        });
    }

    private _itemFormatterFunc(panel, r, c, cell) {
        if (this.resizing) {
            return;
        }

        const qtyWithColor = 'qtywithcolor';
        if (panel.cellType === wjcGrid.CellType.ColumnHeader) {
            if (!this.readOnly && (!panel.columns[c].isReadOnly || !isNil(Object.keys(this.CONTROL_COLUMNS).find(x => x === panel.columns[c].binding)))) {
                cell.style.borderBottom = '1px solid orange';
            } else {
                cell.style.borderBottom = '';
            }
            const binding = panel.columns[c].binding;
            if (this.enableQtyWithColor && binding && binding.toLowerCase() === qtyWithColor) {
                cell.classList.value = cell.classList.value + ' qty-with-color';
            }

            if (this.hasQuantityPriorityColumn) {
                const flexCol = panel.columns[c];
                const gridCol = this.gridColumns.find(c => c.data == flexCol.binding);

                if (gridCol.controlType == 'QuantityPriority') {
                    $(cell).addClass('no-padding');

                    if (!this.readOnly) {
                        cell.style.borderBottom = '3px solid orange';
                    }

                    this.stopQuantityPriorityEditMode();
                }
            }

            if (!this.localGridStyle || isEmpty(this.localGridStyle.headerStyle)) {
                return;
            }

            cell.style.color = this.isDesignWidgetMode ? 'black' : this.localGridStyle.headerStyle['color'];
            cell.style.fontFamily = this.localGridStyle.headerStyle['font-family'];
            cell.style.fontSize = this.localGridStyle.headerStyle['font-size'];
            cell.style.fontWeight = this.localGridStyle.headerStyle['font-weight'];
            cell.style.fontStyle = this.localGridStyle.headerStyle['font-style'];
            cell.style.textDecoration = this.localGridStyle.headerStyle['text-decoration'];
        }

        if (panel.cellType === wjcGrid.CellType.ColumnFooter && this.hasQuantityPriorityColumn) {
            const flexCol = panel.columns[c];
            const gridCol = this.gridColumns.find(c => c.data == flexCol.binding);

            if (gridCol.controlType == 'QuantityPriority') {
                let sum = 0;
                this.gridData.items.forEach(item => {
                    if (item[gridCol.data].ExportQty != item[gridCol.data].ExportQtyBackup) {
                        sum += item[gridCol.data].ExportQty;
                    } else {
                        sum += item[gridCol.data].Qty;
                    }
                })

                cell.innerHTML = `
                    <table class="w-100">
                        <tr>
                            <td class="w-50 text-center">${sum}</td>
                            <td></td>
                        </tr>
                    </table>
                `;
            }
        }

        if (panel.cellType === wjcGrid.CellType.TopLeft) {
            if (this.flex.hostElement) {
                this.popupPosition.top = this.flex.hostElement.clientHeight + 6;
            }

            const filterSpan = $('span.wj-glyph-filter', cell);
            if (!filterSpan.length) {
                const ele = $('<span class="wj-glyph-filter" id="btnPopup"></span>');
                $(cell).append(ele);
                ele.bind('click', (eve) => {
                    this.isShowingPopupFilter = true;
                    setTimeout(() => {
                        $('input#xn-input' + this._randomNo).focus();
                        $('input#xn-input' + this._randomNo).val($('input#xn-input' + this._randomNo).val());
                    }, 1000);
                });

                if (this._filter.length) {
                    $(cell).addClass('has-filter-text');
                }
            }
        }

        // append the validation icon for row header.
        if (panel.cellType === wjcGrid.CellType.RowHeader) {
            if ($(cell).hasClass('wj-state-invalid')) {
                const span = '<i class="fa fa-info-circle" style="font-size: 14px;color:white"></i>';
                $(cell).append(span);
            } else {
                $(cell).empty();
            }
        }

        if (panel.rows[r] instanceof wjcGrid.GroupRow && panel.cellType !== wjcGrid.CellType.RowHeader) {
            if (!this.groupByColumn || !this.groupByColumn.groupDisplayColumn) {
                return;
            }

            let span = '<span class="wj-elem-collapse wj-glyph-down-right"></span>'; // html for expand/collapse group
            const flex = panel.grid,
                value = flex.rows[r].dataItem.name, // get group header name
                count = flex.rows[r].dataItem.items.length, // get items in group,
                newValue = this._buildGridGroupTitle(this.gridData.items, value, this.groupByColumn);

            if (flex.rows[r].isCollapsed)
                span = '<span class="wj-elem-collapse wj-glyph-right"></span>';

            cell.innerHTML = span + ' <b>' + newValue + '</b> (' + count + ' items)';
        }

        if (panel.cellType === wjcGrid.CellType.Cell) {

            const item = panel.rows[r].dataItem;
            const prop = panel.columns[c].binding;

            if (prop && item) {
                if (isObject(item[prop]) && isEmpty(item[prop])) {
                    item[prop] = '';
                    cell.innerHTML = '';
                }
                if (this.hightlightKeywords && this.hightlightKeywords.trim() !== '*') {
                    this.hightlightKeywords = this.hightlightKeywords.split('*').join('');
                    let regTxt;
                    this.hightlightKeywords = this.hightlightKeywords.trim().replace(/\?|\+|\-|\%|\>|\<|\$|/g, "");

                    if (/ or | and | [&] |[&]| [|] |[|]/i.test(this.hightlightKeywords)) {
                        this.hightlightKeywords = this.hightlightKeywords.replace(/OR|AND|&|\|/gi, function (matched) {
                            return '|';
                        });
                        this.hightlightKeywords = this.hightlightKeywords.trim().replace(/ +/g, "");
                    }
                    else {
                        this.hightlightKeywords = this.hightlightKeywords.trim().replace(/ +/g, "|");
                    }
                    if (/ [&&] |[&&]| [||] |[||]|/i.test(this.hightlightKeywords)) {
                        this.hightlightKeywords = this.hightlightKeywords.replace(/&&|\|\|/gi, function (matched) {
                            return '|';
                        });
                        this.hightlightKeywords = this.hightlightKeywords.trim().replace(/ +/g, "");
                    }
                    else {
                        this.hightlightKeywords = this.hightlightKeywords.trim().replace(/ +/g, "|");
                    }

                    regTxt = new RegExp(this.hightlightKeywords, 'gi');
                    if (typeof item[prop] === 'string') {
                        cell.innerHTML = cell.innerText.replace(regTxt, function (str) {
                            return '<span class="hight-light__keyword">' + str + '</span>';
                        });
                    }
                }

                if (this.enableQtyWithColor && prop.toLowerCase() === qtyWithColor) {
                    const _value = item[prop];
                    try {
                        if (!isNil(_value)) {
                            if (parseInt(_value) > 0) {
                                $(cell).addClass('positive-qty');
                            } else if (parseInt(_value) < 0) {
                                $(cell).addClass('negative-qty');
                            }
                        }
                    } catch (ex) { }
                }

                if (item['deleted']) {
                    if (this.deletedItemList.indexOf(item) !== -1) {
                        $(cell).addClass('deleted-row-text');
                    }
                }

                if (item['isActiveDisableRow'] === false) {
                    cell.classList.add('in-active-cell');
                }

                if (!isNil(item['IsActive']) && !item['IsActive'] && this.hasDisableRow) {
                    $(cell).addClass('disabled-row-text');
                    // Check if have Priority Column
                    if (item[this.CONTROL_COLUMNS.Priority]) {
                        this.deletePriorityForCurrentItem(item);
                    }
                }

                if (this.disabledAll) {
                    $(cell).addClass('disabled-row-text');
                }

                if (this.hasQuantityPriorityColumn) {
                    const item = panel.rows[r].dataItem;
                    const flexCol = panel.columns[c];
                    const gridCol = this.gridColumns.find(c => c.data == flexCol.binding);
                    if (gridCol.controlType == 'QuantityPriority') {
                        $(cell).addClass('no-padding');
                        this.buildCellColor(cell, item, gridCol);
                    }

                    if (gridCol.data == 'Total Qty') {
                        $(cell).css('font-weight', 'bold');
                    }
                }
            }
            if (this.allowDrag) {
                cell.draggable = true;
            }

            if (!this.localGridStyle || isEmpty(this.localGridStyle.rowStyle)) {
                return;
            }

            cell.style.color = this.isDesignWidgetMode ? 'black' : this.localGridStyle.rowStyle['color'];
            cell.style.fontFamily = this.localGridStyle.rowStyle['font-family'];
            cell.style.fontSize = this.localGridStyle.rowStyle['font-size'];
            cell.style.fontWeight = this.localGridStyle.rowStyle['font-weight'];
            cell.style.fontStyle = this.localGridStyle.rowStyle['font-style'];
            cell.style.textDecoration = this.localGridStyle.rowStyle['text-decoration'];
        }
    }

    private _initDragDropHandler() {

        const isIE = (typeof document.createElement('span').dragDrop === 'function');

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
                dragImage.style.visibility = "hidden";
            }, 100);

            return dragImage;
        }

        const updateDragContent = function (_node, x, y, offsetX, offsetY) {
            if (_node) {
                _node.style.top = Math.max(0, y) + 'px';
                _node.style.left = Math.max(0, x) + 'px';
            }
        }

        const flex = this.flex;
        const self = this;
        let node;
        this.flex.hostElement.addEventListener('dragstart', function (e) {
            const ht = flex.hitTest(e);
            if (ht.cellType === wjcGrid.CellType.Cell) {
                flex.select(new wjcGrid.CellRange(ht.row, 0, ht.row, flex.columns.length - 1));
                let item = flex.rows[ht.row].dataItem;
                item = mapKeys(item, function (v, k) { return camelCase(k.toString()); });
                e.dataTransfer.setData('text', JSON.stringify(item));
                if (self.customDragContent) {
                    if (!isIE) {
                        node = createDragContent(e.pageX, e.pageY, e.offsetX, e.offsetY, self.customDragContent);
                        const dataTransfer: any = e.dataTransfer;
                        dataTransfer.setDragImage(node, 5, 5);
                    }
                }
                self.isDragging = true;
            };
        }, true);

        this.flex.hostElement.addEventListener('dragend', function (e) {
            $('.xn-grid-drag').remove();
            self.isDragging = false;
        }, true);

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
                if (this.flex.columns[i].width === '*') {
                    this.flex.columns[i].width = this.flex.columns[i].size;
                    this._colWidthUpdated = true;
                }
            }
        }

        this.ref.detach();
    }

    private _turnOffStarResizeMode() {
        for (let i = 0; i < this.flex.columns.length; i++) {
            if (this.flex.columns[i].width === '*') {
                this.flex.columns[i].width = this.flex.columns[i].size;
            }
        }
    }

    private _resizedColumnHandler(s: wjcCore.CollectionView, e: any) {
        this.resizing = false;
        if (this.flex) {
            if (!this.fitWidth && this.widgetId) {
                this.store.dispatch(this.gridActions.setColumnLayout(this.widgetId, this.flex.columnLayout, this.ofModule));
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
            if (this.flex.columns[i]['binding'] === this.CONTROL_COLUMNS.deleted ||
                this.flex.columns[i]['binding'] === this.CONTROL_COLUMNS.Delete ||
                this.flex.columns[i]['binding'] === this.CONTROL_COLUMNS.Edit ||
                this.flex.columns[i]['binding'] === this.CONTROL_COLUMNS.FilterExtended ||
                this.flex.columns[i]['binding'] === this.CONTROL_COLUMNS.noExport ||
                this.flex.columns[i]['dataType'] === wjcCore.DataType.Boolean ||
                this.gridColumns.find(col => !isNil(col.width) && col.data == this.flex.columns[i]['binding'])) {
                continue;
            } else {
                if (!this.checkColIsAutoSize(this.flex.columns[i].binding))
                    this.flex.columns[i].width = '*';
            }
        }
    }

    private checkColIsAutoSize(id) {
        return !isNil(this.gridColumns.find((item) => item.data === id && item.autoSize));
    }

    private _addPerfectScrollbar() {
        setTimeout(() => {
            $('div[wj-part=\'root\']', this.flex.hostElement).perfectScrollbar();

            setTimeout(() => {
                this._updatePerfectScrollbar();
                if (this.fitWidth) {
                    this._turnOnStarResizeMode();
                }

                setTimeout(() => {
                    $('.ps-scrollbar-x-rail', this.flex.hostElement).css('z-index', 999);
                    $('.ps-scrollbar-y-rail', this.flex.hostElement).css('z-index', 999);
                });
            }, 200);
        }, 200);
    }

    private _addHorizontalPerfectScrollEvent() {
        $('div[wj-part=\'root\']', this.flex.hostElement).on('ps-scroll-left', () => {
            this.hasScrollbars.emit({
                top: this.scrollUtils.canScrollUpTop,
                left: this.scrollUtils.canScrollToLeft,
                right: this.scrollUtils.canScrollToRight,
                bottom: this.scrollUtils.canScrollDownBottom
            });
        });

        $('div[wj-part=\'root\']', this.flex.hostElement).on('ps-scroll-right', () => {

            this.hasScrollbars.emit({
                top: this.scrollUtils.canScrollUpTop,
                left: this.scrollUtils.canScrollToLeft,
                right: this.scrollUtils.canScrollToRight,
                bottom: this.scrollUtils.canScrollDownBottom
            });
        });
    }

    private _removeHorizontalPerfectScrollEvent() {
        $('div[wj-part=\'root\']', this.flex.hostElement).off('ps-scroll-left');
        $('div[wj-part=\'root\']', this.flex.hostElement).off('ps-scroll-right');
        $('div[wj-part=\'root\']', this.flex.hostElement).off('ps-x-reach-end');
        $('div[wj-part=\'root\']', this.flex.hostElement).off('ps-x-reach-start');
    }

    private _addVerticalPerfectScrollEvent() {
        $('div[wj-part=\'root\']', this.flex.hostElement).on('ps-scroll-up', () => {
            this.hasScrollbars.emit({
                top: this.scrollUtils.canScrollUpTop,
                left: this.scrollUtils.canScrollToLeft,
                right: this.scrollUtils.canScrollToRight,
                bottom: this.scrollUtils.canScrollDownBottom
            });
        });

        $('div[wj-part=\'root\']', this.flex.hostElement).on('ps-scroll-down', () => {

            this.hasScrollbars.emit({
                top: this.scrollUtils.canScrollUpTop,
                left: this.scrollUtils.canScrollToLeft,
                right: this.scrollUtils.canScrollToRight,
                bottom: this.scrollUtils.canScrollDownBottom
            });

        });
    }

    private _removeVerticalPerfectScrollEvent() {
        $('div[wj-part=\'root\']', this.flex.hostElement).off('ps-scroll-up');
        $('div[wj-part=\'root\']', this.flex.hostElement).off('ps-scroll-down');
        $('div[wj-part=\'root\']', this.flex.hostElement).off('ps-y-reach-end');
        $('div[wj-part=\'root\']', this.flex.hostElement).off('ps-y-reach-start');
    }

    private _checkGridHasScrollbars() {
        if (!this.gridData || !this.gridData.items || !this.gridData.items.length) {
            this.hasScrollbars.emit({
                top: false,
                left: false,
                right: false,
                bottom: false
            });

            return;
        }

        setTimeout(() => {
            const wjPartRootElm = $('div[wj-part="root"]', this.flex.hostElement);
            if (wjPartRootElm.length) {
                this.hasScrollbars.emit({
                    top: this.scrollUtils.canScrollUpTop,
                    left: this.scrollUtils.canScrollToLeft,
                    right: this.scrollUtils.canScrollToRight,
                    bottom: this.scrollUtils.canScrollDownBottom
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
            const terms = f.toUpperCase().split(' ');

            // look for any term in any string field
            for (let i = 0; i < terms.length; i++) {
                let termFound = false;
                for (const key in item) {
                    if (key) {
                        const value = item[key];
                        if (wjcCore.isString(value) && value.toUpperCase().indexOf(terms[i]) > -1) {
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
            Object.keys(this.filterObj).forEach(keyFilter => {
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
    protected _applyFilter() {
        if (this._toFilter) {
            clearTimeout(this._toFilter);
        }
        const self = this;
        this._toFilter = setTimeout(function () {
            self._toFilter = null;
            if (self.flex) {
                const cv = self.flex.collectionView;
                if (cv) {
                    if (cv.filter !== self._thisFilterFunction) {
                        cv.filter = self._thisFilterFunction;
                    } else {
                        cv.refresh();
                    }
                }
            }
        }, 500);
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
            const groupNames = groupByColumn.data.split(',');
            for (let i = 0; i < groupNames.length; i++) {
                const groupName = groupNames[i];
                if (groupName) {
                    const groupDesc = new wjcCore.PropertyGroupDescription(groupName);
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
                return ' ' + item[groupByColumn.groupDisplayColumn];
            }
        }

        return titleText;
    }

    public preventRowEmit: boolean;

    private _selectionChangedHandler(eventData) {
        setTimeout(() => {

            if (this.isDragging) {
                return;
            }

            if (this.isDoubleClick) {
                this.isDoubleClick = false;
                this.onChangeSelectedItems.emit(this.flex.selectedItems);
                return;
            }

            if (this.preventRowEmit) {
                this.preventRowEmit = false;
                return;
            }

            if (eventData) {
                const isRowAutoChangedOnFirstLoad =
                    (this._previousCellRange.row === -1
                        && this.autoSelectFirstRow
                        && eventData.row === 0);
                const isRowChangedByClick = this._previousCellRange.row !== eventData.row;

                if (isRowAutoChangedOnFirstLoad || isRowChangedByClick) {
                    const selectedRow: any = this._getSelectedFlexRow(this.flex.rows, eventData);

                    if (selectedRow) {
                        const rowData = this._buildRowClickData(selectedRow.dataItem);
                        this.onRowClick.emit(rowData);
                    }

                    this._previousCellRange.row = eventData.row;
                    this._previousCellRange.col = eventData.col;
                }
            }

            this.onChangeSelectedItems.emit(this.flex.selectedItems);
        }, 300);
    }

    private _beginningEditHandler(s: wjcGrid.FlexGrid, e: any) {
        if (e && e.panel && e.panel._activeCell && e.panel._activeCell.className.indexOf('in-active-cell') > -1) {
            e.cancel = true;
            return;
        }

        if (!this.readOnly && this.disabledAll) {
            e.cancel = true;
            return;
        }

        let currentFlexCol = this.flex.getColumn(e.col);

        if ((this.hasDisableRow && currentFlexCol.binding === 'IsActive')
            || currentFlexCol.binding === this.CONTROL_COLUMNS.noExport) {
            e.cancel = true;
            return;
        }

        const row = s.rows[e.row],
            item = row.dataItem;

        if (!isNil(item['IsActive']) && this.hasDisableRow) {
            if (currentFlexCol.binding !== 'IsActive' && item['IsActive'] === false) {
                e.cancel = true;
                return;
            }
        }

        if (!this.readOnly) {
            if (this.isDisableRowWithSelectAll
                && item['selectAll'] !== undefined
                && !item['selectAll']) {
                e.cancel = true;
                return;
            }

            if (this.allowDelete
                && e.col !== this.flex.columns.length - 1
                && item['deleted']
                && this.deletedItemList.indexOf(item) !== -1) {
                e.cancel = true;
            } else {
                this._beginningEdit = true;
                this._buildComboboxData(s, e);
            }
        }
    }

    private _buildComboboxData(s: wjcGrid.FlexGrid, e: any) {
        const column = this.gridColumns[e.col];
        const selectedRowData: any = this.gridData.items[e.row];

        if (isEmpty(selectedRowData)) {
            for (const col of this.gridColumns) {
                if (this.datatableService.hasControlType(col, 'Combobox')) {
                    selectedRowData[col.data] = {
                        key: '',
                        value: '',
                        options: []
                    };
                } else {
                    selectedRowData[col.data] = '';
                }
            }
        }

        if (this.datatableService.hasControlType(column, 'Combobox')) {
            const comboboxType = this.datatableService.getComboboxType(column);

            const filterByValue = this.datatableService.getControlTypeFilterBy(column);
            if (filterByValue) {
                const filterByFrom = typeof selectedRowData[filterByValue] === 'object' ?
                    selectedRowData[filterByValue]['key'] :
                    selectedRowData[filterByValue];
                this.commonServiceSubscription = this.commonService.getComboBoxDataByFilter(comboboxType.value.toString(), filterByFrom).subscribe((response: ApiResultResponse) => {
                    this._onGetComboboxDataSuccess(response.item, comboboxType, selectedRowData, column, filterByFrom);
                });
            } else {
                this.commonServiceSubscription = this.commonService.getListComboBox(comboboxType.value.toString())
                    .subscribe((response: ApiResultResponse) => {
                        if (!Uti.isResquestSuccess(response)) {
                            return;
                        }
                        this._onGetComboboxDataSuccess(response.item, comboboxType, selectedRowData, column);
                    });
            }
        }

        this.editingRow = cloneDeep(selectedRowData);
    }

    private _onGetComboboxDataSuccess(comboboxData, comboboxType, selectedRowData, column, filterByValue?) {
        let comboboxTypeName = comboboxType.name;
        if (filterByValue) {
            comboboxTypeName += '_' + filterByValue;
        }
        let options: any[] = comboboxData[comboboxTypeName];

        if (!options) {
            selectedRowData[column.data].key = '';
            selectedRowData[column.data].value = '';
            selectedRowData[column.data].options = [];
        } else {
            options = options.map((opt) => {
                return {
                    label: opt.textValue,
                    value: opt.idValue
                }
            });

            selectedRowData[column.data].options = options;
        }
    }

    private _rowEditStartedHandler(eventData) {
        if (!this.readOnly) {
            this.onTableEditStart.emit(true);

            this.hasValidationError.emit(this.hasError());

            this.toggleDeleteColumn(true);
        }
    }

    private _cellEditEndedHandler(eventData) {
        if (!this.readOnly) {
            if (this.allowDelete && eventData.col === this.flex.columns.length - 1) {
                const hasDeletedRows = this._hasDeletedRow(this.gridData.items);
                this.onRowMarkedAsDelete.emit(
                    {
                        showCommandButtons: hasDeletedRows,
                        disabledDeleteButton: !hasDeletedRows
                    });

                if (this.isShowedEditButtons) {
                    this.isMarkedAsDelete = this._hasRowMarkedAsDeleted();
                }
            }

            this.hasValidationError.emit(this.hasError());

            this._convertCurrenCellValueToFloat(eventData);

            this.onCellEditEnded.emit(this.gridData.currentItem);
        }
    }

    private _convertCurrenCellValueToFloat(eventData) {
        let currentFlexCol = this.flex.getColumn(eventData.col);
        if (!currentFlexCol) {
            return;
        }

        let currentGridCol = this.gridColumns.find(c => c.data == currentFlexCol.binding);
        let currentCellData = this.flex.getCellData(eventData.row, eventData.col, false);
        if (currentGridCol
            && currentGridCol.controlType === 'Numeric'
            && currentCellData
            && typeof currentCellData === 'string') {
            currentCellData = currentCellData ? wjcCore.Globalize.parseFloat(currentCellData, 'd') : null;
        }

        this.flex.setCellData(eventData.row, eventData.col, currentCellData);
        this.gridData.currentItem[currentFlexCol.binding] = currentCellData;
    }

    private _hasRowMarkedAsDeleted() {
        return this.gridData.items.filter(item => item.deleted === true).length > 0;
    }

    private _collectionChangedHandler(s: wjcCore.CollectionView, e: any) {
        if (!this.readOnly) {
            if (this._beginningEdit
                && !this._isRowDataEqual(this.editingRow, s.currentItem)
                && s.itemsAdded.indexOf(s.currentItem) < 0) {
                if (s.itemsEdited.indexOf(s.currentItem) < 0) {
                    s.itemsEdited.push(s.currentItem);
                }

                this._beginningEdit = false;
            }

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

    private _rowEditEndedHandler(eventData) {
        if (!this.readOnly) {
            this.onTableEditEnd.emit(true);

            if (this.gridData.itemsEdited.length
                || this.gridData.itemsAdded.length
                || this.gridData.itemsRemoved.length
                || this.deletedItemList.length) {
                this.onRowEditEnded.emit(this.gridData.currentItem);
            }

            this.toggleDeleteColumn(false);
        }
    }

    private _isRowDataEqual(firstRow, secondRow) {
        for (const fprop in firstRow) {
            if (fprop) {
                for (const sprop in secondRow) {
                    if (fprop === sprop) {
                        if (typeof firstRow[fprop] === 'object' && typeof secondRow[sprop] === 'object' && firstRow[fprop] && secondRow[sprop]) {
                            if (firstRow[fprop]['key'] !== secondRow[sprop]['key'] || firstRow[fprop]['value'] !== secondRow[sprop]['value']) {
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
        return itemsEdited.filter(item => item.deleted === true).length > 0;
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
                    value: selectedRow[propName]
                });
            }
        }

        return result;
    }

    private _deleteRows() {
        if (!this.allowDelete) {
            return;
        }

        const deletedRows = this.gridData.items.filter(item => item.deleted === true);
        if (deletedRows && deletedRows.length) {
            this.showDeleteConfirmModal();
        }
    }

    private showDeleteConfirmModal() {
        this.modalService.confirmMessageHtmlContent(new MessageModel({
            headerText: 'Delete Item',
            messageType: MessageModal.MessageType.error,
            message: [{key: '<p>'}, {key: 'Modal_Message__Do_You_Want_To_Delete_The_Selected_Items'},
                {key: '</p>'}],
            buttonType1: MessageModal.ButtonType.danger,
            callBack1: () => { this._okDeleteRows(); },
            callBack2: () => { this._cancelDeleteRows(); },
            callBackCloseButton: () => { this._cancelDeleteRows() }
        }));
    }

    private _okDeleteRow(item: any) {
        if (this.redRowOnDelete) {
            this.onCheckboxChanged(item, 'deleted', { checked: !item['deleted'] });

            if (item['deleted']) {
                this._okDeleteRows();
            }
        } else {
            Uti.removeItemInArray(this.gridData.items, item, 'id');
            this.deleteFlexRowItem(item);
            this.flex.refresh();
        }
        this.onDeleteColumnClick.emit(item);
    }

    private _okDeleteRows() {
        const deletedRows = this.gridData.items.filter(item => item.deleted === true);
        if (deletedRows.length) {
            for (let i = 0; i < deletedRows.length; i++) {
                if (deletedRows[i]['DT_RowId'].indexOf('newrow') !== -1) {
                    let gridItemidx = this.gridData.items.findIndex(ii => ii['DT_RowId'] == deletedRows[i]['DT_RowId']);
                    this.gridData.items.splice(gridItemidx, 1);

                    this.deleteFlexRowItem(deletedRows[i]);

                    this.gridData.commitEdit();

                    this.onRowMarkedAsDelete.emit({
                        showCommandButtons: true,
                        disabledDeleteButton: true,
                        enableAddButtonCommand: true
                    });
                    this.isMarkedAsDelete = false;
                } else {
                    if (this.deletedItemList.indexOf(deletedRows[i]) === -1) {
                        this.deletedItemList.push(deletedRows[i]);
                    }

                    this.onRowMarkedAsDelete.emit({
                        showCommandButtons: true,
                        disabledDeleteButton: false
                    });
                    this.isMarkedAsDelete = true;

                    this.onDeletedRows.emit(true);
                }

                if (this._errorObject && this._errorObject[deletedRows[i]['DT_RowId']])
                    delete this._errorObject[deletedRows[i]['DT_RowId']];
            }

            // update isSelectDeletedAll in case no left items
            const remainItems = this.gridData.items.filter((item) => item.deleted !== true);
            if (!remainItems.length && this.selectDeleteAll) {
                this.isSelectDeletedAll = false;
            }

            this.flex.refresh();

            setTimeout(() => {
                this.hasValidationError.emit(this.hasError());
            }, 100);
        }
    }

    private deleteFlexRowItem(deleteItem: any) {
        let flexRowidx = -1;
        for (let ii = 0; ii < this.flex.rows.length; ii++) {
            if (this.flex.rows[ii]['dataItem']['DT_RowId'] == deleteItem['DT_RowId']) {
                flexRowidx = ii;
                break;
            }
        }
        if (flexRowidx !== -1) {
            this.flex.rows.splice(flexRowidx, 1);
        }
    }

    private _cancelDeleteRows() {
        this.onRowMarkedAsDelete.emit({
            showCommandButtons: true,
            disabledDeleteButton: false
        });
    }

    private _hasUnsavedRows() {
        return this.gridData.itemsEdited.length > 0
            || this.gridData.itemsAdded.length > 0
            || this.gridData.itemsRemoved.length > 0
            || this.deletedItemList.length > 0;
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

    public onHandleClickHeader(event, col) {
        if (this.currentSelectedColHeader && this.currentSelectedColHeader !== col)
            this.currentSelectedColHeader['sort'] = null;
        if (!col['sort'])
            col['sort'] = 'wj-glyph-up';
        else if (col['sort'] === 'wj-glyph-up')
            col['sort'] = 'wj-glyph-down';
        else if (col['sort'] = 'wj-glyph-down')
            col['sort'] = 'wj-glyph-up';

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
        if (this.redRowOnDelete) {
            this._okDeleteRow(rowData);
        } else {
            this.modalService.confirmMessageHtmlContent(new MessageModel({
                headerText: 'Delete Item',
                messageType: MessageModal.MessageType.error,
                message: [{key: '<p>'}, {key: 'Modal_Message__Do_You_Want_To_Delete_This_Item'},
                    {key: '</p>'}],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => { this._okDeleteRow(rowData); }
            }));
        }
    }

    public editButtonClickHandler(rowData, binding) {
        this.onEditColumnClick.emit({
            data: rowData,
            binding: binding
        });
    }

    public _buildCcList(ccData) {
        if (!ccData) {
            return [];
        }

        return ccData.split(',');
    }

    private _addNoDataMessage() {
        setTimeout(() => {
            const wjPartCellsElement = $('div[wj-part="cells"]', this.flex.hostElement);
            if (wjPartCellsElement.length && wjPartCellsElement.children().length) {
                return;
            }

            const wjPartFCellsElement = $('div[wj-part="fcells"]', this.flex.hostElement);

            if (wjPartFCellsElement.length) {
                const noDataMessageElement = wjPartFCellsElement.find('p#noDataMessage');
                if (noDataMessageElement.length) {
                    return;
                } else {
                    const _noDataMessageElement = document.createElement('p');
                    const textNode = document.createTextNode('No data available in table');
                    _noDataMessageElement.id = 'noDataMessage';
                    _noDataMessageElement.className = 'text-center';
                    _noDataMessageElement.appendChild(textNode);

                    wjPartFCellsElement.append(noDataMessageElement);
                }
            }
        }, 200);
    }

    private _removeNoDataMessage() {
        const noDataMessageElement = $('p#noDataMessage', this.flex.hostElement);
        if (noDataMessageElement.length) {
            noDataMessageElement[0].parentNode.removeChild(noDataMessageElement[0]);
        }
    }

    private _toggleNoDataMessage() {
        if (this.gridData && (!this.gridData.items.length || (!this.gridData.items.length && (this.gridData.itemsRemoved.length || this.deletedItemList.length)))) {
            this._addNoDataMessage();
        } else {
            this._removeNoDataMessage();
        }
    }

    private _getGroupByColumn(columns) {
        for (const col of columns) {
            if (col['isGrouped']) {
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
                allowSelectAll: this.allowSelectAll
            }
            newItem = this.datatableService.createEmptyRowData(newItem, col, config, this.gridData.items.length);
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
        this.flex.select(new wjcGrid.CellRange(0, 1, 0, 1));
        this.flex.scrollIntoView(0, 1);
        $(this.flex.hostElement).focus();

        if (data) {
            for (let i = 0; i < this.flex.columns.length; i++) {
                this.flex.setCellData(0, i, data[this.flex.columns[i]['binding']]);
            }
        }
        this.flex.refresh();
    }

    private _deleteRowByRowId(rowId: any) {
        const item = this.flex.rows.find(x => (x.dataItem && x.dataItem.DT_RowId === rowId));
        if (!item) return;
        this.flex.rows.remove(item);

        let gridItemidx = this.gridData.items.findIndex(ii => ii['DT_RowId'] === rowId);
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

    private resetPopup() {
        this.isShowingPopupFilter = false;
        this.filter = '';
    }

    public contextMenuItemClick(func: any) {
        if (func)
            func();
    }

    public uploadFile() {
        this.onUploadFileClick.emit(true);
    }

    public selectDeleteAll(event) {
        const checked = this.isSelectDeletedAll;
        this.isSelectDeletedAll = checked;
        this.onRowMarkedAsDelete.emit({
            showCommandButtons: checked,
            disabledDeleteButton: !checked
        });
        this.gridData.items.forEach((item) => item['deleted'] = checked);

        if (!checked) {
            this.deletedItemList = [];
        }

        this.isMarkedAsDelete = checked;
        this.flex.refresh();
    }

    public onCheckboxChanged(item, fieldName, event) {
        item[fieldName] = event.checked;

        if (fieldName === 'deleted') {
            if (!event.checked) {
                if (this.deletedItemList.indexOf(item) !== -1) {
                    this.deletedItemList.splice(this.deletedItemList.indexOf(item), 1);
                }
            }

            const itemMarkedAsDeleted = this.gridData.items.filter(_item => _item.deleted === true);

            // only emit if this is selected item/ there is no one
            if (event.checked && itemMarkedAsDeleted.length) {
                this.onRowMarkedAsDelete.emit({
                    showCommandButtons: true,
                    disabledDeleteButton: false
                });
                this.isMarkedAsDelete = true;
            } else if (itemMarkedAsDeleted.length > this.deletedItemList.length) {
                this.onRowMarkedAsDelete.emit({
                    showCommandButtons: true,
                    disabledDeleteButton: false
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
                    showCommandButtons: itemMarkedAsDeleted.length === 0 ? false : true,
                    disabledDeleteButton: appearAll
                });
                this.isMarkedAsDelete = !appearAll;
            } else {
                this.onRowMarkedAsDelete.emit({
                    showCommandButtons: false,
                    disabledDeleteButton: true
                });
                this.isMarkedAsDelete = false;
            }

            this.isSelectDeletedAll = itemMarkedAsDeleted.length === this.gridData.items.length;
        }

        else if (fieldName === 'selectAll') {
            if (!event.checked) {
                this.isMarkedAsSelectedAll = false;
                this.onMarkedAsSelectedAll.emit(this.gridData.items.filter((item) => item['selectAll'] === true));
            }
            else {
                const unselectedItems = this.gridData.items.filter((item) => item['selectAll'] !== true);
                if (!unselectedItems || !unselectedItems.length) {
                    this.isMarkedAsSelectedAll = true;
                    this.onMarkedAsSelectedAll.emit(this.gridData.items);
                } else {
                    this.onMarkedAsSelectedAll.emit(this.gridData.items.filter((item) => item['selectAll'] === true));
                }

            }
        }

        if (this.gridData.itemsEdited.indexOf(item) < 0) {
            this.gridData.itemsEdited.push(item);
        }

        this.flex.refresh();
    }

    public copyToClipboard(event: wjcGrid.CellRangeEventArgs) {
        if (this.flex && event) {
            const text = this.flex.getCellData(event.row, event.col, false);
            if (!isString(text) && !isBoolean(text) && !isNumber(text) &&
                isObject(text) && text.value) {
                setTimeout(() => {
                    try {
                        const $temp = $('<input>');
                        $('body').append($temp);
                        $temp.val(text.value).select();
                        document.execCommand('copy');
                        $temp.remove();
                    } catch (exc) { }
                });
            }
        }
    }

    selectAllColumnItems() {
        const checked = this.isMarkedAsSelectedAll;
        this.gridData.items.forEach((item) => item['selectAll'] = checked);
        if (checked)
            this.onMarkedAsSelectedAll.emit(this.gridData.items);
        else
            this.onMarkedAsSelectedAll.emit([]);
        this.flex.refresh();
    }

    private _updatePerfectScrollbar() {
        if (this.flex) {
            const flex = $('div[wj-part=\'root\']', this.flex.hostElement);
            if (flex.length) {
                Ps.update(flex.get(0));
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
            cv.sourceCollection = this.wijmoDataSource.data.filter((obj, pos, arr) => {
                let count = 0;
                Object.keys(keyObj).forEach(key => {
                    const value = keyObj[key];
                    if (obj[key] && obj[key] == value) {
                        count++;
                    }
                });
                if (Object.keys(keyObj).length == count) {
                    return true;
                }
                return false;
            });
        }
        else {
            if (rowIndex != flex.selection.row) {
                this.preventRowEmit = true;
                this.flex.select(new wjcGrid.CellRange(rowIndex, 1, rowIndex, 1));
            }
        }
    }

    /**
     * changeToSingleRowMode
     */
    public changeToSingleRowMode() {
        const cv = this.flex.collectionView;
        if (cv.currentItem) {
            cv.sourceCollection = [cv.currentItem];
        }
    }

    /**
     * changeToMultipleRowMode
     */
    public changeToMultipleRowMode() {
        const cv = this.flex.collectionView;
        const lastItem = Object.assign({}, cv.currentItem);
        cv.sourceCollection = this.wijmoDataSource.data;
        let rowIndex = 0;
        cv.items.forEach((item, index, arr) => {
            if (item["DT_RowId"] == lastItem["DT_RowId"]) {
                rowIndex = index;
            }
        });
        this.flex.select(new wjcGrid.CellRange(rowIndex, 1, rowIndex, 1));
    }

    /**
     * getHTMLTable
     */
    public getHTMLTable() {
        const flex = this.flex;
        // start table
        let tbl = '<table width="100%">';

        // headers
        tbl += '<thead>';
        for (let r = 0; r < flex.columnHeaders.rows.length; r++) {
            tbl += this.renderRow(flex.columnHeaders, r);
        }
        tbl += '</thead>';

        // body
        tbl += '<tbody>';
        for (let r = 0; r < flex.rows.length; r++) {
            tbl += this.renderRow(flex.cells, r);
        }
        tbl += '</tbody>';

        // done
        tbl += '</table>';
        return tbl;
    }

    /**
     * renderRow
     * @param panel
     * @param r
     */
    private renderRow(panel: wjcGrid.GridPanel, r: number) {
        let tr = '',
            row: wjcGrid.Row = panel.rows[r];
        if (row.renderSize > 0) {
            tr += '<tr>';
            for (let c = 0; c < panel.columns.length; c++) {
                let col: wjcGrid.Column = panel.columns[c];
                if (col.binding == 'deleted') {
                    break;
                }
                if (col.renderSize > 0) {

                    // get cell style, content
                    let style = 'width:' + col.renderSize + 'px;text-align:' + col.getAlignment(),
                        content = panel.getCellData(r, c, true),
                        cellElement = panel.getCellElement(r, c);
                    let className = '';

                    if (cellElement) {
                        className = cellElement.className;
                    }

                    if (!row.isContentHtml && !col.isContentHtml) {
                        content = wjcCore.escapeHtml(content);
                    }

                    // add cell to row
                    if (panel.cellType == wjcGrid.CellType.ColumnHeader) {
                        tr += '<th style="' + style + '" class="' + className + '" > ' + content + ' </th>';
                    } else {

                        let raw = panel.getCellData(r, c, false);

                        const rs = this.gridColumns.filter(p => p.data == col.binding);
                        if (rs.length) {
                            const controlType = rs[0].controlType;
                            if (controlType) {
                                if (controlType.toLowerCase() == 'creditcard') {
                                    className += ' creditcard-icon';
                                } else if (controlType.toLowerCase() == 'countryflag') {
                                    className += ' country-flag-icon';
                                }
                                const element = panel.getCellElement(r, c);
                                raw = element.innerHTML;
                            }
                        }

                        if (isObject(raw)) {
                            content = raw.value ? raw.value : '';
                        }
                        else if (isBoolean(raw)) {
                            if (raw === true) {
                                content = '&#9745;';
                            } else if (raw === false) {
                                content = '&#9744;';
                            }
                        }
                        else if (isString(raw)) {
                            content = raw;
                        }
                        if (className.indexOf('wj-cell') == -1) {
                            className += ' wj-cell ';
                        }
                        if (r % 2 != 0) {
                            if (className.indexOf('wj-alt') == -1) {
                                className += ' wj-alt ';
                            }
                        }
                        className = className.replace("wj-state-selected", "").replace("wj-state-multi-selected", "");
                        tr += '<td style="' + style + '" class="' + className + '">' + content + '</td>';
                    }
                }
            }
            tr += '</tr>';
        }
        return tr;
    }

    /**
     * scrollBodyContainer of widget
     */
    private get scrollBodyContainer() {
        const elm = $('div[wj-part=\'root\']', this.flex.hostElement);
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
            bottom: this.scrollUtils.canScrollDownBottom
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
            if (this.parentInstance && this.parentInstance.hasOwnProperty('widgetInstance')) {
                const itemMarkedAsDeleted = this.gridData.items.filter(_item => _item.deleted === true);
                if (itemMarkedAsDeleted.length) {
                    return;
                }

                let deleteCol = this.flex.columns.find(c => c.binding == 'deleted');
                if (!deleteCol) {
                    return;
                }

                let gridDeleteCol = this.gridColumns.find(c => c.data == 'deleted');
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

    public gridContextMenuDataTrackBy(index, item) {
        return item ? item.title : undefined;
    }

    public gridColumnsTrackBy(index, item) {
        return item ? item.data : undefined;
    }

    public formatNumber(data, globalNumberFormat, allowNumberSeparator?: boolean) {
        if (data == 0) {
            return 0;
        }

        if (isNil(data) || isNaN(data)) {
            return '';
        }

        if (!isNil(allowNumberSeparator) && allowNumberSeparator == false) {
            return data;
        }

        if (globalNumberFormat === 'N') {
            return data ? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
        }

        return data;
    }


    /**
     * updatePriority
     */
    private updatePriority(fromItem: any, changedPriorityOption: any) {
        let data = this.flex.collectionView.items.filter(p => p[this.CONTROL_COLUMNS.Priority]);
        let destItem = data.find(p => p[this.CONTROL_COLUMNS.Priority] == changedPriorityOption.key);
        if (fromItem && destItem) {
            const idField = Object.keys(fromItem).find(k => k == 'id') ? 'id' : 'DT_RowId';
            const fromIndex = data.findIndex(p => p[idField] == fromItem[idField]);
            const destIndex = data.findIndex(p => p[idField] == destItem[idField]);
            if (fromIndex < destIndex) {
                let arr = data.map(p => p[this.CONTROL_COLUMNS.Priority]);
                arr.splice(fromIndex, 0, changedPriorityOption.key);
                arr.splice(destIndex + 1, 1);
                data.forEach((db, index, dataArr) => {
                    db[this.CONTROL_COLUMNS.Priority] = arr[index];
                });
            }
            if (fromIndex > destIndex) {
                var arr = data.map(p => p[this.CONTROL_COLUMNS.Priority]);
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
        item['IsActive'] = event.checked;

        if (this.gridData.itemsEdited.indexOf(item) < 0) {
            this.gridData.itemsEdited.push(item);
        }

        this.flex.refresh(true);

        if (event.checked) {
            this.flex.select(new wjcGrid.CellRange(cell.row.index, cell.col.index + 1, cell.row.index, cell.col.index + 1));

            this.updateCellPriority(item);
        }

        this.onSelectionColumnChanged.emit(item['IsActive']);
    }

    public resizeRowHeaders(size) {
        this._resizeRowHeaders(size);
    }

    private _resizeRowHeaders(size) {
        this.flex.rowHeaders.columns.defaultSize = size;
    }

    public onCheckboxExportChanged(item, $event) {
        this.onNoExportChanged.emit({ item, $event });
    }

    private isColumnsChanged(oldColumns: any[], newColumns: any[]) {
        if (!oldColumns || !newColumns) {
            return true;
        }

        if (oldColumns.length !== newColumns.length) {
            return true
        }

        for (let i = 0; i < oldColumns.length; i++) {
            if (!newColumns.find(x => x.data == oldColumns[i].data)) {
                return true;
            }
        }

        return false;
    }



    /****START Frequency grid *******/
    private buildQuantityPriorityList() {
        let count = 0;
        this.quantityPriority = [];
        this.gridData.items.forEach(item => {
            Object.keys(item).forEach(keyName => {
                if (typeof item[keyName] === 'object' && item[keyName]['Qty'] > 0) {
                    count++;
                    this.quantityPriority.push({
                        key: count,
                        value: count
                    });
                }
            });
        });
    }

    public onFrequencyPriorityChanged(newCellData, combobox) {
        if (combobox.selectedItem && combobox.selectedItem.value && this.currentCellData[this.CONTROL_COLUMNS.Priority] != combobox.selectedItem.value) {
            this.onTableEditStart.emit();
            this.updateQuantityPriority(this.currentCellData, combobox.selectedItem);
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
        if (this.currentCellData['ExportQty'] != quantityInputNumber.value) {
            if (newCellData['ExportQty'] > newCellData['Qty']) {
                this.modalService.warningMessageHtmlContent({
                    headerText: 'Update quantity',
                    messageType: MessageModal.MessageType.warning,
                    message: [{key: '<p>'},
                        {key: 'Modal_Message__The_Value_Should_Not_Greater'},
                        {key: '<strong>'},
                        {key: newCellData['Qty']},
                        {key: '</strong></p>'}],
                    buttonType1: MessageModal.ButtonType.primary,
                    callBack1: () => {
                        newCellData['ExportQty'] = this.currentCellData['ExportQty'];
                        this.flex.refresh();
                    },
                    callBackCloseButton: () => {
                        newCellData['ExportQty'] = this.currentCellData['ExportQty'];
                        this.flex.refresh();
                    }
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
        this.gridData.items.forEach(item => {
            Object.keys(item).forEach(keyName => {
                if (typeof item[keyName] === 'object' && item[keyName]['Qty'] > 0) {
                    if (fromItem && item[keyName].hasOwnProperty('pEdit')) {
                        item[keyName][this.CONTROL_COLUMNS.Priority] = fromItem[this.CONTROL_COLUMNS.Priority];
                    }
                    result.push(item[keyName]);
                }
            });
        });

        return result;
    }

    private updateQuantityPriority(fromItem: any, changedPriorityOption: any) {
        let data = this.buildQuantityPriorityArray(fromItem);

        let destItem = data.find(p => p[this.CONTROL_COLUMNS.Priority] == changedPriorityOption.key);
        if (fromItem && destItem) {
            const fromIndex = data.findIndex(p => p[this.CONTROL_COLUMNS.Priority] == fromItem[this.CONTROL_COLUMNS.Priority]);
            const destIndex = data.findIndex(p => p[this.CONTROL_COLUMNS.Priority] == destItem[this.CONTROL_COLUMNS.Priority]);
            if (fromIndex < destIndex) {
                let arr = data.map(p => p[this.CONTROL_COLUMNS.Priority]);
                arr.splice(fromIndex, 0, changedPriorityOption.key);
                arr.splice(destIndex + 1, 1);
                data.forEach((db, index, dataArr) => {
                    db[this.CONTROL_COLUMNS.Priority] = arr[index];
                    db['isDirty'] = true;
                });
            }
            if (fromIndex > destIndex) {
                var arr = data.map(p => p[this.CONTROL_COLUMNS.Priority]);
                arr.splice(fromIndex + 1, 0, changedPriorityOption.key);
                arr.splice(destIndex, 1);
                data.forEach((db, index, dataArr) => {
                    db[this.CONTROL_COLUMNS.Priority] = arr[index];
                    db['isDirty'] = true;
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
        if (data && binding && data['ExportQty'] != data['ExportQtyBackup']) {
            this.modalService.confirmMessageHtmlContent(new MessageModel({
                headerText: 'Restore Quantity',
                messageType: MessageModal.MessageType.error,
                message: [{key: '<p>'},
                    {key: 'Modal_Message__Quantity_Will_Change_From'},
                    {key: '<strong>'},
                    {key: data['ExportQty']},
                    {key: '</strong>'},
                    {key: 'Modal_Message__To'},
                    {key: '<strong>'},
                    {key: data['ExportQtyBackup']},
                    {key: '</strong>.'},
                    {key: 'Modal_Message__Are_You_Sure'},
                    {key: '</p>'}

                ],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    data['ExportQty'] = data['ExportQtyBackup'];
                }
            }));
        }
    }

    private stopQuantityPriorityEditMode() {
        this.gridData.items.forEach(item => {
            Object.keys(item).forEach(keyName => {
                if (typeof item[keyName] === 'object') {
                    if (item[keyName].hasOwnProperty('pEdit')) {
                        delete item[keyName]['pEdit'];
                    }
                    if (item[keyName].hasOwnProperty('qEdit')) {
                        delete item[keyName]['qEdit'];
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
        priorityData = orderBy(priorityData, [this.CONTROL_COLUMNS.Priority], ['asc']);

        let totalQuantity = 0;
        let notRedAnymore = false;
        for (let i = 0; i < priorityData.length; i++) {
            this.resetProps(priorityData[i], ['isRed', 'isBlue', 'isGreen', 'isUnderline', 'isDarkRed', 'isDarkBlue', 'isDarkGreen']);

            //Underline
            if (priorityData[i]['ExportQty'] < priorityData[i]['Qty']) {
                priorityData[i]['isUnderline'] = true;
            }

            //Blue color
            if (priorityData[i]['isUnderline']) {
                priorityData[i]['isDarkBlue'] = true;
            } else {
                priorityData[i]['isBlue'] = true;
            }


            //Green color
            if (priorityData[i]['Qty'] < 10) {
                priorityData[i]['isBlue'] = false;
                priorityData[i]['isDarkBlue'] = false;

                if (priorityData[i]['isUnderline']) {
                    priorityData[i]['isDarkGreen'] = true;
                } else {
                    priorityData[i]['isGreen'] = true;
                }
            }

            //Red color
            if (!notRedAnymore) {
                totalQuantity += priorityData[i]['ExportQty'];
                if (totalQuantity >= requiredNumber) {
                    let diff = requiredNumber - (totalQuantity - priorityData[i]['ExportQty']);
                    priorityData[i]['ExportQty'] = diff;

                    notRedAnymore = true;
                }

                priorityData[i]['isBlue'] = false;
                priorityData[i]['isDarkBlue'] = false;
                priorityData[i]['isGreen'] = false;
                priorityData[i]['isDarkGreen'] = false;

                //Underline
                if (priorityData[i]['ExportQty'] < priorityData[i]['Qty']) {
                    priorityData[i]['isUnderline'] = true;
                }
                if (priorityData[i]['isUnderline']) {
                    priorityData[i]['isDarkRed'] = true;
                } else {
                    priorityData[i]['isRed'] = true;
                }
            }
        }
    }

    private buildCellColor(cell, item, col) {
        if (!this.requiredAddressNumber) {
            $(cell).addClass('red-text');
        }

        if (item[col.data].isUnderline) {
            $(cell).addClass('underline-text');
        }

        if (item[col.data].isDarkBlue) {
            $(cell).addClass('dark-blue-text');
        }

        if (item[col.data].isDarkGreen) {
            $(cell).addClass('dark-green-text');
        }

        if (item[col.data].isDarkRed) {
            $(cell).addClass('dark-red-text');
        }

        if (item[col.data].isBlue) {
            $(cell).addClass('blue-text');
        }

        if (item[col.data].isGreen) {
            $(cell).addClass('green-text');
        }

        if (item[col.data].isRed) {
            $(cell).addClass('red-text');
        }
    }
    /****END Frequency grid *******/

    private _addFooterRow(flex: wjcGrid.FlexGrid) {
        flex.columnFooters.rows.clear();

        if (this.gridData && (this.gridData.items && !this.gridData.items.length)) {
            return;
        }

        // create a GroupRow to show aggregates
        var row = new wjcGrid.GroupRow();

        // add the row to the column footer panel
        flex.columnFooters.rows.push(row);

        // show a sigma on the header
        flex.bottomLeftCells.setCellData(0, 0, '\u03A3');
    }
}
