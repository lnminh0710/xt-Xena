import * as wjcCore from 'wijmo/wijmo';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcChart from 'wijmo/wijmo.chart';
import * as wjcSelf from 'wijmo/wijmo.olap';
export declare class _Tally {
  _cnt: number;
  _cntn: number;
  _sum: number;
  _sum2: number;
  _min: any;
  _max: any;
  _first: any;
  _last: any;
  add(value: any, weight?: number): void;
  getAggregate(aggregate: wjcCore.Aggregate): number;
}
export declare class _PivotKey {
  private _fields;
  private _fieldCount;
  private _valueFields;
  private _valueFieldIndex;
  private _item;
  private _key;
  private _vals;
  private _names;
  static _ROW_KEY_NAME: string;
  constructor(
    fields: PivotFieldCollection,
    fieldCount: number,
    valueFields: PivotFieldCollection,
    valueFieldIndex: number,
    item: any
  );
  readonly fields: PivotFieldCollection;
  readonly valueFields: PivotFieldCollection;
  readonly valueField: PivotField;
  readonly values: any[];
  readonly fieldNames: string[];
  readonly aggregate: wjcCore.Aggregate;
  getValue(index: number, formatted: boolean): any;
  readonly level: number;
  compareTo(key: _PivotKey): number;
  matchesItem(item: any): boolean;
  toString(): string;
}
export declare class _PivotNode {
  _key: _PivotKey;
  _nodes: any;
  _tree: _PivotNode;
  _parent: _PivotNode;
  constructor(
    fields: PivotFieldCollection,
    fieldCount: number,
    valueFields: PivotFieldCollection,
    valueFieldIndex: number,
    item: any,
    parent?: _PivotNode
  );
  getNode(
    fields: PivotFieldCollection,
    fieldCount: number,
    valueFields: PivotFieldCollection,
    valueFieldIndex: number,
    item: any
  ): _PivotNode;
  readonly key: _PivotKey;
  readonly parent: _PivotNode;
  readonly tree: _PivotNode;
}
export declare class PivotCollectionView extends wjcCore.CollectionView {
  private _ng;
  constructor(engine: PivotEngine);
  readonly engine: PivotEngine;
  _performSort(items: any[]): void;
  _performFilter(items: any[]): any[];
  _getGroupRange(items: any[], item: any): number[];
  _sortGroups(items: any[], level: number, start: number, end: number): void;
  _sortSegment(items: any[], start: number, end: number): void;
  _sortData(items: any[]): void;
  _getItemLevel(item: any): any;
}
export declare class PivotField {
  private _ng;
  _header: string;
  _binding: wjcCore.Binding;
  _autoGenerated: boolean;
  private _aggregate;
  private _showAs;
  private _weightField;
  private _format;
  private _width;
  private _wordWrap;
  private _dataType;
  private _filter;
  private _srtCmp;
  private _descending;
  private _isContentHtml;
  private _parent;
  static _props: string[];
  constructor(
    engine: PivotEngine,
    binding: string,
    header?: string,
    options?: any
  );
  binding: string;
  header: string;
  readonly filter: PivotFilter;
  aggregate: wjcCore.Aggregate;
  showAs: ShowAs;
  weightField: PivotField;
  dataType: wjcCore.DataType;
  readonly isMeasure: boolean;
  format: string;
  width: number;
  wordWrap: boolean;
  descending: boolean;
  isContentHtml: boolean;
  sortComparer: Function;
  readonly engine: PivotEngine;
  readonly collectionView: wjcCore.ICollectionView;
  isActive: boolean;
  readonly parentField: PivotField;
  readonly key: string;
  readonly propertyChanged: wjcCore.Event;
  onPropertyChanged(e: wjcCore.PropertyChangedEventArgs): void;
  _getIsActive(): boolean;
  _setIsActive(value: boolean): void;
  _clone(): PivotField;
  _setProp(name: string, value: any, member?: string): void;
  _getName(): string;
  _getValue(item: any, formatted: boolean): any;
  _getWeight(item: any): number;
}
export declare class CubePivotField extends PivotField {
  private _subFields;
  private _dimensionType;
  header: string;
  dimensionType: DimensionType;
  readonly isMeasure: boolean;
  readonly subFields: CubePivotField[];
  readonly key: string;
  _clone(): PivotField;
  _copy(key: string, value: any): boolean;
  _getIsActive(): boolean;
  _setIsActive(value: boolean): void;
}
export declare enum DimensionType {
  Dimension = 0,
  Measure = 1,
  Kpi = 2,
  NameSet = 3,
  Attribute = 4,
  Folder = 5,
  Hierarchy = 6,
  Date = 7,
  Currency = 8,
}
export declare class PivotFieldCollection extends wjcCore.ObservableArray {
  private _ng;
  private _maxItems;
  constructor(engine: PivotEngine);
  maxItems: number;
  readonly engine: PivotEngine;
  getField(key: string): PivotField;
  _getField(fields: any, key: string): PivotField;
  push(...item: any[]): number;
}
export declare class PivotFilter {
  private _fld;
  private _valueFilter;
  private _conditionFilter;
  private _filterType;
  constructor(field: PivotField);
  filterType: wjcGridFilter.FilterType;
  apply(value: any): boolean;
  readonly isActive: boolean;
  clear(): void;
  readonly valueFilter: wjcGridFilter.ValueFilter;
  readonly conditionFilter: wjcGridFilter.ConditionFilter;
}
export declare class PivotFieldEditor extends wjcCore.Control {
  private _fld;
  private _pvDate;
  private _dBnd;
  private _dHdr;
  private _dAgg;
  private _dShw;
  private _dWFl;
  private _dSrt;
  private _dFmt;
  private _dSmp;
  private _dFlt;
  private _btnFltEdt;
  private _btnFltClr;
  private _btnApply;
  private _btnCancel;
  private _cmbHdr;
  private _cmbAgg;
  private _cmbShw;
  private _cmbWFl;
  private _cmbSrt;
  private _cmbFmt;
  private _cmbSmp;
  private _eFlt;
  private _gDlg;
  private _gHdr;
  private _gAgg;
  private _gShw;
  private _gWfl;
  private _gSrt;
  private _gFlt;
  private _gFmt;
  private _gSmp;
  static controlTemplate: string;
  constructor(element: any, options?: any);
  field: PivotField;
  updateEditor(): void;
  updateField(): void;
  _initAggregateOptions(): void;
  _initShowAsOptions(): void;
  _initFormatOptions(): void;
  _initWeighByOptions(): void;
  _initSortOptions(): void;
  _updateFormat(): void;
  _updatePreview(): void;
  _editFilter(): void;
  _createFilterEditor(): void;
  _closeFilter(): void;
}
export declare class PivotFilterEditor extends wjcCore.Control {
  private _fld;
  private _divType;
  private _aCnd;
  private _aVal;
  private _divEdtVal;
  private _divEdtCnd;
  private _btnOk;
  private _edtVal;
  private _edtCnd;
  static controlTemplate: string;
  '</div>': any;
  constructor(element: any, field: PivotField, options?: any);
  readonly field: PivotField;
  readonly filter: PivotFilter;
  updateEditor(): void;
  updateFilter(): void;
  clearEditor(): void;
  readonly finishEditing: wjcCore.Event;
  onFinishEditing(e?: wjcCore.CancelEventArgs): boolean;
  private _showFilter(filterType);
  _enableLink(a: HTMLLinkElement, enable: boolean): void;
  private _getFilterType();
  private _btnClicked(e);
}
export declare enum ShowTotals {
  None = 0,
  GrandTotals = 1,
  Subtotals = 2,
}
export declare enum ShowAs {
  NoCalculation = 0,
  DiffRow = 1,
  DiffRowPct = 2,
  DiffCol = 3,
  DiffColPct = 4,
  PctGrand = 5,
  PctRow = 6,
  PctCol = 7,
  RunTot = 8,
  RunTotPct = 9,
}
export declare class PivotEngine {
  private _items;
  private _cv;
  private _autoGenFields;
  private _allowFieldEditing;
  private _showRowTotals;
  private _showColTotals;
  private _totalsBefore;
  private _sortableGroups;
  private _showZeros;
  private _updating;
  private _dirty;
  private _toInv;
  private _cntTotal;
  private _cntFiltered;
  private _colBindings;
  private _pivotView;
  private _defaultFilterType;
  private _async;
  private _batchStart;
  private _toUpdateTallies;
  private _activeFilterFields;
  _tallies: any;
  _keys: any;
  private _fields;
  private _rowFields;
  private _columnFields;
  private _valueFields;
  private _filterFields;
  _viewLists: PivotFieldCollection[];
  private _server;
  private _serverParms;
  static _BATCH_SIZE: number;
  static _BATCH_TIMEOUT: number;
  static _BATCH_DELAY: number;
  static _props: string[];
  constructor(options?: any);
  itemsSource: any;
  readonly collectionView: wjcCore.ICollectionView;
  readonly pivotView: wjcCore.ICollectionView;
  showRowTotals: ShowTotals;
  showColumnTotals: ShowTotals;
  totalsBeforeData: boolean;
  sortableGroups: boolean;
  showZeros: boolean;
  defaultFilterType: wjcGridFilter.FilterType;
  autoGenerateFields: boolean;
  allowFieldEditing: boolean;
  readonly fields: PivotFieldCollection;
  readonly rowFields: PivotFieldCollection;
  readonly columnFields: PivotFieldCollection;
  readonly filterFields: PivotFieldCollection;
  readonly valueFields: PivotFieldCollection;
  viewDefinition: string;
  readonly isViewDefined: boolean;
  beginUpdate(): void;
  endUpdate(): void;
  readonly isUpdating: boolean;
  deferUpdate(fn: Function): void;
  refresh(force?: boolean): void;
  invalidate(): void;
  async: boolean;
  serverTimeout: number;
  serverPollInterval: number;
  serverMaxDetail: number;
  cancelPendingUpdates(): void;
  getDetail(item: any, binding: string): any[];
  getDetailView(item: any, binding: string): wjcCore.ICollectionView;
  getKeys(item: any, binding: string): any;
  editField(field: PivotField): void;
  removeField(field: PivotField): void;
  readonly itemsSourceChanged: wjcCore.Event;
  onItemsSourceChanged(e?: wjcCore.EventArgs): void;
  readonly viewDefinitionChanged: wjcCore.Event;
  onViewDefinitionChanged(e?: wjcCore.EventArgs): void;
  readonly updatingView: wjcCore.Event;
  onUpdatingView(e: ProgressEventArgs): void;
  readonly updatedView: wjcCore.Event;
  onUpdatedView(e?: wjcCore.EventArgs): void;
  readonly error: wjcCore.Event;
  onError(e: wjcCore.RequestErrorEventArgs): boolean;
  _copy(key: string, value: any): boolean;
  _getKey(keyString: string): _PivotKey;
  _getRowLevel(key: any): number;
  _getColLevel(key: any): number;
  private _applyFilter(item);
  private _updateView();
  private _updateTallies(arr, startIndex);
  private _updatePivotView();
  private _getSortedKeys(obj);
  private _updateFieldValues(arr);
  private _getColTotal(arr, col);
  private _getRunningTotal(arr, row, col, showAs);
  private _getLastValueInRowGroup(arr, row, col);
  private _getRowDifference(arr, row, col, showAs);
  private _getColDifference(arr, row, col, showAs);
  _getShowRowTotals(): ShowTotals;
  _getShowColTotals(): ShowTotals;
  private _generateFields();
  _createField(options: any, autoGenerated: boolean): PivotField;
  private _cvCollectionChanged(sender, e);
  private _fieldListChanged(s, e);
  _fieldPropertyChanged(
    field: PivotField,
    e: wjcCore.PropertyChangedEventArgs
  ): void;
  _copyProps(dst: any, src: any, props: string[]): void;
  private _getFieldFromDefinition(fldDef);
  private _getFieldDefinition(fld);
  private _getFieldCollectionProxy(arr);
  private _setFieldCollectionProxy(arr, proxy);
  private _getFilterProxy(fld);
  private _setFilterProxy(fld, proxy);
}
export declare class ProgressEventArgs extends wjcCore.EventArgs {
  _progress: number;
  constructor(progress: number);
  readonly progress: number;
}
export declare class _ServerConnection {
  private _ng;
  private _token;
  private _start;
  private _progress;
  private _request;
  private _toGetStatus;
  static _TIMEOUT: number;
  static _POLL_INTERVAL: number;
  static _MAXDETAIL: number;
  constructor(engine: PivotEngine, url: string);
  getFields(): PivotField[];
  getOutputView(callBack: Function): void;
  getDetail(rowKey: any, colKey: any): any[];
  private static _getRequestedValue(value);
  clearPendingRequests(): void;
  updateTallies(aggregatedData: any[]): void;
  private _getFieldValue(vf, item, formatted?);
  private _getAggregatedFieldCount(item, fields);
  _loadArray(command: string, arr: any, data?: any): void;
  private _getUrl(command, token?, fieldName?);
  private _isValidUrl(url);
  private _handleResult(result, callBack);
  private _waitUntilComplete(callBack);
  private _getResults(callBack);
  private _handleError(msg, xhr);
  private _throwResponseError(msg, xhr);
  private _sendHttpRequest(command, settings?);
  private _clearToken();
  private _clearRequest();
  private _clearTimeout();
}
export declare class _ListContextMenu extends wjcInput.Menu {
  _full: boolean;
  constructor(full: boolean);
  refresh(fullUpdate?: boolean): void;
  attach(grid: wjcGrid.FlexGrid): void;
  _selectField(grid: wjcGrid.FlexGrid, e: MouseEvent): boolean;
  _getMenuItems(full: boolean): any[];
  _execute(parm: any): void;
  _canExecute(parm: any): boolean;
  _getTargetList(
    engine: PivotEngine,
    parm: string
  ): wjcSelf.PivotFieldCollection;
}
export declare class PivotPanel extends wjcCore.Control {
  private _ng;
  private _dFields;
  private _dFilters;
  private _dRows;
  private _dCols;
  private _dVals;
  private _dMarker;
  private _dProgress;
  private _chkDefer;
  private _btnUpdate;
  private _lbFields;
  private _lbFilters;
  private _lbRows;
  private _lbCols;
  private _lbVals;
  private _gFlds;
  private _gDrag;
  private _gFlt;
  private _gCols;
  private _gRows;
  private _gVals;
  private _gDefer;
  _ctxMenuShort: _ListContextMenu;
  _ctxMenuFull: _ListContextMenu;
  private _dragSource;
  private _dragField;
  private _dropIndex;
  private _showIcons;
  private _restrictDrag;
  static controlTemplate: string;
  constructor(element: any, options?: any);
  engine: PivotEngine;
  itemsSource: any;
  readonly collectionView: wjcCore.ICollectionView;
  readonly pivotView: wjcCore.ICollectionView;
  autoGenerateFields: boolean;
  readonly fields: PivotFieldCollection;
  readonly rowFields: PivotFieldCollection;
  readonly columnFields: PivotFieldCollection;
  readonly valueFields: PivotFieldCollection;
  readonly filterFields: PivotFieldCollection;
  viewDefinition: string;
  readonly isViewDefined: boolean;
  showFieldIcons: boolean;
  restrictDragging: boolean;
  readonly itemsSourceChanged: wjcCore.Event;
  onItemsSourceChanged(e?: wjcCore.EventArgs): void;
  readonly viewDefinitionChanged: wjcCore.Event;
  onViewDefinitionChanged(e?: wjcCore.EventArgs): void;
  readonly updatingView: wjcCore.Event;
  onUpdatingView(e: ProgressEventArgs): void;
  readonly updatedView: wjcCore.Event;
  onUpdatedView(e?: wjcCore.EventArgs): void;
  refresh(fullUpdate?: boolean): void;
  _copy(key: string, value: any): boolean;
  _globalize(): void;
  _itemsSourceChanged(s: PivotEngine, e?: wjcCore.EventArgs): void;
  _viewDefinitionChanged(s: PivotEngine, e?: wjcCore.EventArgs): void;
  _updatingView(s: PivotEngine, e: ProgressEventArgs): void;
  _updatedView(s: PivotEngine, e?: wjcCore.EventArgs): void;
  _requestError(s: PivotEngine, e: wjcCore.RequestErrorEventArgs): void;
  _createFieldGrid(host: HTMLElement): wjcGrid.FlexGrid;
  _dragstart(e: DragEvent): void;
  _dragover(e: DragEvent): void;
  _drop(e: DragEvent): void;
  _dragend(e: DragEvent): void;
  _hitTestField(grid: wjcGrid.FlexGrid, e: MouseEvent): PivotField;
  _getRestrictDrag(): boolean;
  _resetMouseState(): void;
  _getFlexGridTarget(e: DragEvent): wjcGrid.FlexGrid;
  _updateDropMarker(grid?: wjcGrid.FlexGrid, e?: DragEvent): void;
}
export declare class _GridContextMenu extends wjcInput.Menu {
  private _targetField;
  private _htDown;
  constructor();
  refresh(fullUpdate?: boolean): void;
  attach(grid: PivotGrid): void;
  _selectField(e: MouseEvent): boolean;
  _getMenuItems(): any[];
  _execute(parm: any): void;
  _canExecute(parm: any): boolean;
}
export declare class _PivotMergeManager extends wjcGrid.MergeManager {
  private _ng;
  getMergedRange(
    p: wjcGrid.GridPanel,
    r: number,
    c: number,
    clip?: boolean
  ): wjcGrid.CellRange;
  _getMergedTopLeftRange(
    p: wjcGrid.GridPanel,
    r: number,
    c: number
  ): wjcGrid.CellRange;
  _getMergedRowHeaderRange(
    p: wjcGrid.GridPanel,
    r: number,
    c: number,
    rng: wjcGrid.CellRange
  ): wjcGrid.CellRange;
  _sameColumnValues(
    p: wjcGrid.GridPanel,
    r1: number,
    r2: number,
    c: number
  ): boolean;
  _getMergedColumnHeaderRange(
    p: wjcGrid.GridPanel,
    r: number,
    c: number,
    rng: wjcGrid.CellRange
  ): wjcGrid.CellRange;
  _sameRowValues(
    p: wjcGrid.GridPanel,
    r: number,
    c1: number,
    c2: number
  ): boolean;
}
export declare class PivotGrid extends wjcGrid.FlexGrid {
  private _ng;
  private _htDown;
  private _showDetailOnDoubleClick;
  private _collapsibleSubtotals;
  private _customCtxMenu;
  private _ctxMenu;
  private _showRowFldSort;
  private _showRowFldHdrs;
  private _showColFldHdrs;
  private _centerVert;
  private _docRange;
  private _collapsedKeys;
  static _WJA_COLLAPSE: string;
  constructor(element: any, options?: any);
  readonly engine: PivotEngine;
  showDetailOnDoubleClick: boolean;
  showRowFieldHeaders: boolean;
  showColumnFieldHeaders: boolean;
  showRowFieldSort: boolean;
  customContextMenu: boolean;
  collapsibleSubtotals: boolean;
  centerHeadersVertically: boolean;
  getDetail(row: number, col: number): any[];
  getKeys(row: number, col: number): any;
  getDetailView(row: number, col: number): wjcCore.ICollectionView;
  showDetail(row: number, col: number): void;
  collapseRowsToLevel(level: number): void;
  collapseColumnsToLevel(level: number): void;
  _getQuickAutoSize(): boolean;
  _bindGrid(full: boolean): void;
  protected _getCollectionView(value: any): wjcCore.ICollectionView;
  refresh(fullUpdate?: boolean): void;
  onItemsSourceChanged(e?: wjcCore.EventArgs): void;
  onResizedColumn(e: wjcGrid.CellRangeEventArgs): void;
  _updatedView(): void;
  _viewDefinitionChanged(): void;
  onLoadedRows(e?: wjcCore.EventArgs): void;
  _updateFixedCounts(): void;
  _setLength(arr: wjcCore.ObservableArray, cnt: number): void;
  _updateFixedContent(): void;
  _formatItem(s: any, e: wjcGrid.FormatItemEventArgs): void;
  _getCollapsedGlyph(collapsed: boolean): string;
  _mousedown(e: MouseEvent): void;
  _mouseup(e: MouseEvent): void;
  _dblclick(e: MouseEvent): void;
  _getRowLevel(row: number): number;
  _getGroupedRows(rng: wjcGrid.CellRange): wjcGrid.CellRange;
  _toggleRowCollapsed(rng: wjcGrid.CellRange): void;
  _getRowCollapsed(rng: wjcGrid.CellRange): boolean;
  _setRowCollapsed(rng: wjcGrid.CellRange, collapse: boolean): void;
  _collapseRowsToLevel(level: number): void;
  _getColLevel(col: number): number;
  _getGroupedCols(rng: wjcGrid.CellRange): wjcGrid.CellRange;
  _toggleColCollapsed(rng: wjcGrid.CellRange): void;
  _getColCollapsed(rng: wjcGrid.CellRange): boolean;
  _setColCollapsed(rng: wjcGrid.CellRange, collapse: boolean): void;
  _collapseColsToLevel(level: number): void;
}
export declare class DetailDialog extends wjcCore.Control {
  private _g;
  private _sCnt;
  private _dSummary;
  private _dGrid;
  private _btnOK;
  private _gHdr;
  static controlTemplate: string;
  constructor(element: any, options?: any);
  showDetail(ownerGrid: PivotGrid, cell: wjcGrid.CellRange): void;
  _updateDetailCount(cnt: number): void;
  _getHeader(key: _PivotKey): string;
}
export declare enum PivotChartType {
  Column = 0,
  Bar = 1,
  Scatter = 2,
  Line = 3,
  Area = 4,
  Pie = 5,
}
export declare enum LegendVisibility {
  Always = 0,
  Never = 1,
  Auto = 2,
}
export declare class PivotChart extends wjcCore.Control {
  static MAX_SERIES: number;
  static MAX_POINTS: number;
  static HRHAXISCSS: string;
  private _ng;
  private _chartType;
  private _showHierarchicalAxes;
  private _showTotals;
  private _showTitle;
  private _showLegend;
  private _legendPosition;
  private _maxSeries;
  private _maxPoints;
  private _stacking;
  private _itemsSource;
  private _flexChart;
  private _flexPie;
  private _colMenu;
  private _colItms;
  private _dataItms;
  private _lblsSrc;
  private _grpLblsSrc;
  constructor(element: any, options?: any);
  readonly engine: PivotEngine;
  itemsSource: any;
  chartType: PivotChartType;
  showHierarchicalAxes: boolean;
  showTotals: boolean;
  showTitle: boolean;
  showLegend: LegendVisibility;
  legendPosition: wjcChart.Position;
  stacking: wjcChart.Stacking;
  maxSeries: number;
  maxPoints: number;
  readonly flexChart: wjcChart.FlexChart;
  readonly flexPie: wjcChart.FlexPie;
  refresh(fullUpdate?: boolean): void;
  private _onItemsSourceChanged(oldItemsSource?);
  private _createFlexChart();
  private _createFlexPie();
  private _updatePivotChart();
  private _updateFlexChartOrPie();
  private _updateFlexChart(dataItms, labelsSource, grpLblsSrc);
  private _updateFlexPie(dataItms, labelsSource);
  private _getLegendPosition();
  private _createSeries();
  private _getColumns(itm);
  private _createGroupAxes(groups);
  private _updateFlexPieBinding();
  private _updatePieInfo();
  private _changeChartType();
  private _swapChartAndPie(chartshow);
  private _getLabel(key);
  private _getValue(ht);
  private _getChartTitle();
  private _getTitle(fields);
  private _isTotalColumn(colKey);
  private _isTotalRow(rowKey);
  private _isPieChart();
  private _isBarChart();
  private _getMergeIndex(key1, key2);
  private _getOffsetWidth(labels);
}
