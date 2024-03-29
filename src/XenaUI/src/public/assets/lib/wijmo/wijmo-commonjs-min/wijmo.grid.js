/*
 *
 * Wijmo Library 5.20173.405
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 *
 * Licensed under the GrapeCity Commercial License.
 * sales@wijmo.com
 * wijmo.com/products/wijmo-5/license/
 *
 */
'use strict';
function tryGetModuleWijmoInput() {
  var e;
  return (e = window.wijmo) && e.input;
}
var __extends =
  (this && this.__extends) ||
  (function () {
    var e =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (e, t) {
          e.__proto__ = t;
        }) ||
      function (e, t) {
        for (var o in t) t.hasOwnProperty(o) && (e[o] = t[o]);
      };
    return function (t, o) {
      function i() {
        this.constructor = t;
      }
      e(t, o),
        (t.prototype =
          null === o
            ? Object.create(o)
            : ((i.prototype = o.prototype), new i()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.grid');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.grid = wjcSelf),
  (wjcCore.culture.FlexGrid = window.wijmo.culture.FlexGrid || {
    groupHeaderFormat: '{name}: <b>{value}</b> ({count:n0} items)',
  });
var HeadersVisibility;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Column = 1)] = 'Column'),
    (e[(e.Row = 2)] = 'Row'),
    (e[(e.All = 3)] = 'All');
})(
  (HeadersVisibility =
    exports.HeadersVisibility || (exports.HeadersVisibility = {}))
);
var FlexGrid = (function (e) {
  function t(t, o) {
    var i = e.call(this, t, null, !0) || this;
    (i._szClient = new wjcCore.Size(0, 0)),
      (i._ptScrl = new wjcCore.Point(0, 0)),
      (i._cellPadding = 3),
      (i._clipToScreen = !1),
      (i._autoGenCols = !0),
      (i._autoClipboard = !0),
      (i._readOnly = !1),
      (i._indent = 14),
      (i._autoSizeMode = AutoSizeMode.Both),
      (i._hdrVis = HeadersVisibility.All),
      (i._alSorting = !0),
      (i._alAddNew = !1),
      (i._alDelete = !1),
      (i._alResizing = AllowResizing.Columns),
      (i._alDragging = AllowDragging.Columns),
      (i._alMerging = AllowMerging.None),
      (i._ssHdr = HeadersVisibility.None),
      (i._shSort = !0),
      (i._shGroups = !0),
      (i._shAlt = !0),
      (i._shErr = !0),
      (i._shDropDown = !0),
      (i._valEdt = !0),
      (i._deferResizing = !1),
      (i._pSel = !0),
      (i._pOutline = !0),
      (i._vt = 0),
      (i.itemsSourceChanging = new wjcCore.Event()),
      (i.itemsSourceChanged = new wjcCore.Event()),
      (i.scrollPositionChanged = new wjcCore.Event()),
      (i.selectionChanging = new wjcCore.Event()),
      (i.selectionChanged = new wjcCore.Event()),
      (i.loadingRows = new wjcCore.Event()),
      (i.loadedRows = new wjcCore.Event()),
      (i.updatingLayout = new wjcCore.Event()),
      (i.updatedLayout = new wjcCore.Event()),
      (i.resizingColumn = new wjcCore.Event()),
      (i.resizedColumn = new wjcCore.Event()),
      (i.autoSizingColumn = new wjcCore.Event()),
      (i.autoSizedColumn = new wjcCore.Event()),
      (i.draggingColumn = new wjcCore.Event()),
      (i.draggingColumnOver = new wjcCore.Event()),
      (i.draggedColumn = new wjcCore.Event()),
      (i.resizingRow = new wjcCore.Event()),
      (i.resizedRow = new wjcCore.Event()),
      (i.autoSizingRow = new wjcCore.Event()),
      (i.autoSizedRow = new wjcCore.Event()),
      (i.draggingRow = new wjcCore.Event()),
      (i.draggingRowOver = new wjcCore.Event()),
      (i.draggedRow = new wjcCore.Event()),
      (i.groupCollapsedChanging = new wjcCore.Event()),
      (i.groupCollapsedChanged = new wjcCore.Event()),
      (i.sortingColumn = new wjcCore.Event()),
      (i.sortedColumn = new wjcCore.Event()),
      (i.beginningEdit = new wjcCore.Event()),
      (i.prepareCellForEdit = new wjcCore.Event()),
      (i.cellEditEnding = new wjcCore.Event()),
      (i.cellEditEnded = new wjcCore.Event()),
      (i.rowEditStarting = new wjcCore.Event()),
      (i.rowEditStarted = new wjcCore.Event()),
      (i.rowEditEnding = new wjcCore.Event()),
      (i.rowEditEnded = new wjcCore.Event()),
      (i.rowAdded = new wjcCore.Event()),
      (i.deletingRow = new wjcCore.Event()),
      (i.deletedRow = new wjcCore.Event()),
      (i.copying = new wjcCore.Event()),
      (i.copied = new wjcCore.Event()),
      (i.pasting = new wjcCore.Event()),
      (i.pasted = new wjcCore.Event()),
      (i.pastingCell = new wjcCore.Event()),
      (i.pastedCell = new wjcCore.Event()),
      (i.formatItem = new wjcCore.Event()),
      (i.updatingView = new wjcCore.Event()),
      (i.updatedView = new wjcCore.Event()),
      (i._mappedColumns = null);
    var n = i.hostElement;
    wjcCore.isIE() && (n.style.borderRadius = '0px');
    var r = i.getTemplate();
    i.applyTemplate('wj-control wj-flexgrid wj-content', r, {
      _root: 'root',
      _eSz: 'sz',
      _eCt: 'cells',
      _fCt: 'fcells',
      _eTL: 'tl',
      _eBL: 'bl',
      _eCHdr: 'ch',
      _eRHdr: 'rh',
      _eCFtr: 'cf',
      _eTLCt: 'tlcells',
      _eBLCt: 'blcells',
      _eCHdrCt: 'chcells',
      _eCFtrCt: 'cfcells',
      _eRHdrCt: 'rhcells',
      _eMarquee: 'marquee',
      _eFocus: 'focus',
    }),
      (i._tabIndex = n.tabIndex),
      (n.tabIndex = -1);
    var l = i._getDefaultRowHeight();
    return (
      i.deferUpdate(function () {
        (i._rows = new RowCollection(i, l)),
          (i._cols = new ColumnCollection(i, 4 * l)),
          (i._hdrRows = new RowCollection(i, l)),
          (i._hdrCols = new ColumnCollection(i, Math.round(1.25 * l))),
          (i._ftrRows = new RowCollection(i, l)),
          (i._gpTL = new GridPanel(
            i,
            CellType.TopLeft,
            i._hdrRows,
            i._hdrCols,
            i._eTLCt
          )),
          (i._gpCHdr = new GridPanel(
            i,
            CellType.ColumnHeader,
            i._hdrRows,
            i._cols,
            i._eCHdrCt
          )),
          (i._gpRHdr = new GridPanel(
            i,
            CellType.RowHeader,
            i._rows,
            i._hdrCols,
            i._eRHdrCt
          )),
          (i._gpCells = new GridPanel(
            i,
            CellType.Cell,
            i._rows,
            i._cols,
            i._eCt
          )),
          (i._gpBL = new GridPanel(
            i,
            CellType.BottomLeft,
            i._ftrRows,
            i._hdrCols,
            i._eBLCt
          )),
          (i._gpCFtr = new GridPanel(
            i,
            CellType.ColumnFooter,
            i._ftrRows,
            i._cols,
            i._eCFtrCt
          )),
          i._hdrRows.push(new Row()),
          i._hdrCols.push(new Column()),
          (i._hdrCols[0].align = 'center'),
          (i._cf = new CellFactory()),
          (i._keyHdl = new _KeyboardHandler(i)),
          (i._mouseHdl = new _MouseHandler(i)),
          (i._edtHdl = new _EditHandler(i)),
          (i._selHdl = new _SelectionHandler(i)),
          (i._addHdl = new _AddNewHandler(i)),
          (i._mrgMgr = new MergeManager(i)),
          (i._bndSortConverter = i._sortConverter.bind(i)),
          (i._bndScroll = i._scroll.bind(i)),
          wjcCore.setAttribute(i.cells.hostElement, 'role', 'grid', !0),
          (i.selectionMode = SelectionMode.CellRange),
          i.initialize(o);
      }),
      i.addEventListener(i._root, 'scroll', function (e) {
        i._updateScrollPosition() && (i.finishEditing(), i._updateContent(!0));
      }),
      i.addEventListener(
        n,
        'focus',
        function (e) {
          if (n.tabIndex > -1) {
            var t = e.target;
            if (t instanceof HTMLElement && t.tabIndex < 0)
              return void i._setFocus(!0);
          }
        },
        !0
      ),
      i
    );
  }
  return (
    __extends(t, e),
    (t.prototype._handleResize = function () {
      (this._rcBounds = null), e.prototype._handleResize.call(this);
    }),
    Object.defineProperty(t.prototype, 'headersVisibility', {
      get: function () {
        return this._hdrVis;
      },
      set: function (e) {
        e != this._hdrVis &&
          ((this._hdrVis = wjcCore.asEnum(e, HeadersVisibility)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'stickyHeaders', {
      get: function () {
        return this._stickyHdr;
      },
      set: function (e) {
        e != this._stickyHdr &&
          ((this._stickyHdr = wjcCore.asBoolean(e)),
          this._updateStickyHeaders(),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'preserveSelectedState', {
      get: function () {
        return this._pSel;
      },
      set: function (e) {
        this._pSel = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'preserveOutlineState', {
      get: function () {
        return this._pOutline;
      },
      set: function (e) {
        this._pOutline = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'virtualizationThreshold', {
      get: function () {
        return this._vt;
      },
      set: function (e) {
        this._vt = wjcCore.asNumber(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'autoGenerateColumns', {
      get: function () {
        return this._autoGenCols;
      },
      set: function (e) {
        this._autoGenCols = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'autoClipboard', {
      get: function () {
        return this._autoClipboard;
      },
      set: function (e) {
        this._autoClipboard = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'columnLayout', {
      get: function () {
        for (
          var e = t._getSerializableProperties(Column),
            o = new Column(),
            i = [],
            n = 0;
          n < this.columns.length;
          n++
        ) {
          for (var r = this.columns[n], l = {}, s = 0; s < e.length; s++) {
            var a = e[s],
              c = r[a];
            c != o[a] && wjcCore.isPrimitive(c) && 'size' != a && (l[a] = c);
          }
          i.push(l);
        }
        return JSON.stringify({ columns: i });
      },
      set: function (e) {
        var t = JSON.parse(wjcCore.asString(e));
        if (!t || null == t.columns) throw 'Invalid columnLayout data.';
        this.columns.clear(), this.initialize(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isReadOnly', {
      get: function () {
        return this._readOnly;
      },
      set: function (e) {
        e != this._readOnly &&
          ((this._readOnly = wjcCore.asBoolean(e)),
          this.finishEditing(),
          this.invalidate(!0),
          this._addHdl.updateNewRowTemplate(),
          wjcCore.toggleClass(
            this.hostElement,
            'wj-state-readonly',
            this.isReadOnly
          ),
          this._setAria('readonly', this.isReadOnly ? 'true' : null));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'imeEnabled', {
      get: function () {
        return null != this._imeHdl;
      },
      set: function (e) {
        e != this.imeEnabled &&
          (this._imeHdl && (this._imeHdl.dispose(), (this._imeHdl = null)),
          e && (this._imeHdl = new _ImeHandler(this)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'allowResizing', {
      get: function () {
        return this._alResizing;
      },
      set: function (e) {
        this._alResizing = wjcCore.asEnum(e, AllowResizing);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'deferResizing', {
      get: function () {
        return this._deferResizing;
      },
      set: function (e) {
        this._deferResizing = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'autoSizeMode', {
      get: function () {
        return this._autoSizeMode;
      },
      set: function (e) {
        this._autoSizeMode = wjcCore.asEnum(e, AutoSizeMode);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'quickAutoSize', {
      get: function () {
        return this._quickSize;
      },
      set: function (e) {
        this._quickSize = wjcCore.asBoolean(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._getQuickAutoSize = function () {
      return wjcCore.isBoolean(this._quickSize)
        ? this._quickSize
        : !this.formatItem.hasHandlers && null == this.itemFormatter;
    }),
    Object.defineProperty(t.prototype, 'allowSorting', {
      get: function () {
        return this._alSorting;
      },
      set: function (e) {
        this._alSorting = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'allowAddNew', {
      get: function () {
        return this._alAddNew;
      },
      set: function (e) {
        e != this._alAddNew &&
          ((this._alAddNew = wjcCore.asBoolean(e)),
          this._addHdl.updateNewRowTemplate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'newRowAtTop', {
      get: function () {
        return this._addHdl.newRowAtTop;
      },
      set: function (e) {
        this._addHdl.newRowAtTop = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'allowDelete', {
      get: function () {
        return this._alDelete;
      },
      set: function (e) {
        e != this._alDelete && (this._alDelete = wjcCore.asBoolean(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'allowMerging', {
      get: function () {
        return this._alMerging;
      },
      set: function (e) {
        e != this._alMerging &&
          ((this._alMerging = wjcCore.asEnum(e, AllowMerging)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showSelectedHeaders', {
      get: function () {
        return this._ssHdr;
      },
      set: function (e) {
        e != this._ssHdr &&
          ((this._ssHdr = wjcCore.asEnum(e, HeadersVisibility)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showMarquee', {
      get: function () {
        return !this._eMarquee.style.display;
      },
      set: function (e) {
        if (e != this.showMarquee) {
          var t = this._eMarquee.style;
          (t.visibility = 'collapse'),
            (t.display = wjcCore.asBoolean(e) ? '' : 'none'),
            this.invalidate();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showSort', {
      get: function () {
        return this._shSort;
      },
      set: function (e) {
        e != this._shSort &&
          ((this._shSort = wjcCore.asBoolean(e)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showGroups', {
      get: function () {
        return this._shGroups;
      },
      set: function (e) {
        e != this._shGroups &&
          ((this._shGroups = wjcCore.asBoolean(e)), this._bindGrid(!1));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showAlternatingRows', {
      get: function () {
        return this._shAlt;
      },
      set: function (e) {
        e != this._shAlt &&
          ((this._shAlt = wjcCore.asBoolean(e)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showErrors', {
      get: function () {
        return this._shErr;
      },
      set: function (e) {
        e != this._shErr &&
          (this._clearCells(), (this._shErr = wjcCore.asBoolean(e)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemValidator', {
      get: function () {
        return this._itemValidator;
      },
      set: function (e) {
        e != this.itemValidator &&
          ((this._itemValidator = wjcCore.asFunction(e)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'validateEdits', {
      get: function () {
        return this._valEdt;
      },
      set: function (e) {
        this._valEdt = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'groupHeaderFormat', {
      get: function () {
        return this._gHdrFmt;
      },
      set: function (e) {
        e != this._gHdrFmt &&
          ((this._gHdrFmt = wjcCore.asString(e)), this._bindGrid(!1));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'allowDragging', {
      get: function () {
        return this._alDragging;
      },
      set: function (e) {
        e != this._alDragging &&
          ((this._alDragging = wjcCore.asEnum(e, AllowDragging)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemsSource', {
      get: function () {
        return this._items;
      },
      set: function (e) {
        if (e != this._items) {
          var t = new wjcCore.CancelEventArgs();
          if (this.onItemsSourceChanging(t)) {
            if (
              (this._cv &&
                ((o = wjcCore.tryCast(this._cv, wjcCore.CollectionView)) &&
                  o.sortConverter == this._bndSortConverter &&
                  (o.sortConverter = null),
                this._cv.currentChanged.removeHandler(
                  this._cvCurrentChanged,
                  this
                ),
                this._cv.collectionChanged.removeHandler(
                  this._cvCollectionChanged,
                  this
                ),
                (this._cv = null)),
              (this._items = e),
              (this._cv = this._getCollectionView(e)),
              (this._lastCount = 0),
              this._cv)
            ) {
              this._cv.currentChanged.addHandler(this._cvCurrentChanged, this),
                this._cv.collectionChanged.addHandler(
                  this._cvCollectionChanged,
                  this
                );
              var o = wjcCore.tryCast(this._cv, wjcCore.CollectionView);
              o &&
                !o.sortConverter &&
                (o.sortConverter = this._bndSortConverter);
            }
            this._bindGrid(!0);
            var i = SelectionMode;
            this.selectionMode == i.ListBox &&
              ((this.selectionMode = i.CellRange),
              (this.selectionMode = i.ListBox)),
              this.onItemsSourceChanged(t);
          }
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'collectionView', {
      get: function () {
        return this._cv;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'editableCollectionView', {
      get: function () {
        return wjcCore.tryCast(this._cv, 'IEditableCollectionView');
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'childItemsPath', {
      get: function () {
        return this._childItemsPath;
      },
      set: function (e) {
        e != this._childItemsPath &&
          (wjcCore.assert(
            null == e || wjcCore.isArray(e) || wjcCore.isString(e),
            'childItemsPath should be an array or a string.'
          ),
          (this._childItemsPath = e),
          this._bindGrid(!0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'rowHeaderPath', {
      get: function () {
        return this._rowHdrPath ? this._rowHdrPath.path : null;
      },
      set: function (e) {
        e != this.rowHeaderPath &&
          ((e = wjcCore.asString(e)),
          (this._rowHdrPath = e ? new wjcCore.Binding(e) : null),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'cells', {
      get: function () {
        return this._gpCells;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'columnHeaders', {
      get: function () {
        return this._gpCHdr;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'columnFooters', {
      get: function () {
        return this._gpCFtr;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'rowHeaders', {
      get: function () {
        return this._gpRHdr;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'topLeftCells', {
      get: function () {
        return this._gpTL;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'bottomLeftCells', {
      get: function () {
        return this._gpBL;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'rows', {
      get: function () {
        return this._rows;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'columns', {
      get: function () {
        return this._cols;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getColumn = function (e) {
      return this.columns.getColumn(e);
    }),
    Object.defineProperty(t.prototype, 'frozenRows', {
      get: function () {
        return this.rows.frozen;
      },
      set: function (e) {
        this.rows.frozen = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'frozenColumns', {
      get: function () {
        return this.columns.frozen;
      },
      set: function (e) {
        this.columns.frozen = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'cloneFrozenCells', {
      get: function () {
        return this._fzClone;
      },
      set: function (e) {
        e != this.cloneFrozenCells &&
          ((this._fzClone = wjcCore.asBoolean(e, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sortRowIndex', {
      get: function () {
        return this._sortRowIndex;
      },
      set: function (e) {
        e != this._sortRowIndex &&
          ((this._sortRowIndex = wjcCore.asNumber(e, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'scrollPosition', {
      get: function () {
        return this._ptScrl.clone();
      },
      set: function (e) {
        var o = this._root,
          i = -e.x;
        if (this.rightToLeft)
          switch (t._getRtlMode()) {
            case 'rev':
              i = o.scrollWidth - o.clientWidth + e.x;
              break;
            case 'neg':
              i = e.x;
              break;
            default:
              i = -e.x;
          }
        (o.scrollLeft = i), (o.scrollTop = -e.y);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'clientSize', {
      get: function () {
        return this._szClient;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'controlRect', {
      get: function () {
        return (
          this._rcBounds ||
            (this._rcBounds = wjcCore.getElementRect(this._root)),
          this._rcBounds
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'scrollSize', {
      get: function () {
        return new wjcCore.Size(this._gpCells.width, this._heightBrowser);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'viewRange', {
      get: function () {
        return this._gpCells.viewRange;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'cellFactory', {
      get: function () {
        return this._cf;
      },
      set: function (e) {
        e != this._cf &&
          (this._clearCells(), (this._cf = wjcCore.asType(e, CellFactory, !1)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemFormatter', {
      get: function () {
        return this._itemFormatter;
      },
      set: function (e) {
        e != this._itemFormatter &&
          (this._clearCells(), (this._itemFormatter = wjcCore.asFunction(e)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.canEditCell = function (e, t) {
      return this._edtHdl._allowEditing(e, t);
    }),
    (t.prototype.getCellData = function (e, t, o) {
      return this.cells.getCellData(e, t, o);
    }),
    (t.prototype.getCellBoundingRect = function (e, t, o) {
      return this.cells.getCellBoundingRect(e, t, o);
    }),
    (t.prototype.setCellData = function (e, t, o, i, n) {
      return (
        void 0 === i && (i = !0),
        void 0 === n && (n = !0),
        this.cells.setCellData(e, t, o, i, n)
      );
    }),
    (t.prototype.hitTest = function (e, t) {
      return (
        wjcCore.isNumber(e) &&
          wjcCore.isNumber(t) &&
          (e = new wjcCore.Point(e, t)),
        wjcCore.isBoolean(t) && t && (this._rcBounds = null),
        new HitTestInfo(this, e)
      );
    }),
    (t.prototype.getClipString = function (e) {
      return this._edtHdl.getClipString(e);
    }),
    (t.prototype.setClipString = function (e, t) {
      this._edtHdl.setClipString(e, t);
    }),
    (t.prototype.focus = function () {
      this._setFocus(!1);
    }),
    (t.prototype.dispose = function () {
      this.finishEditing(!0),
        (this.itemsSource = null),
        e.prototype.dispose.call(this);
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        this.finishEditing(),
        t && (this._updateColumnTypes(), (this.scrollPosition = this._ptScrl)),
        this.refreshCells(t);
    }),
    (t.prototype.refreshCells = function (e, t, o) {
      this.isUpdating || (e ? this._updateLayout() : this._updateContent(t, o));
    }),
    (t.prototype.autoSizeColumn = function (e, t, o) {
      void 0 === t && (t = !1),
        void 0 === o && (o = 4),
        this.autoSizeColumns(e, e, t, o);
    }),
    (t.prototype.autoSizeColumns = function (e, o, i, n) {
      var r = this;
      void 0 === i && (i = !1), void 0 === n && (n = 4);
      var l = 0,
        s = i ? this.topLeftCells : this.columnHeaders,
        a = i ? this.bottomLeftCells : this.columnFooters,
        c = i ? this.rowHeaders : this.cells,
        h = this.viewRange;
      (e = null == e ? 0 : wjcCore.asInt(e)),
        (o = null == o ? c.columns.length - 1 : wjcCore.asInt(o)),
        (h.row = Math.max(0, h.row - 1e3)),
        (h.row2 = Math.min(h.row2 + 1e3, this.rows.length - 1)),
        this.finishEditing() &&
          this.columns.deferUpdate(function () {
            wjcCore.setCss(r._eCt, { width: r._gpCells.width });
            var i = document.createElement('div');
            i.setAttribute(t._WJS_MEASURE, 'true'),
              (i.style.visibility = 'hidden'),
              c.hostElement.parentElement.appendChild(i);
            for (
              var d = r._getCanvasContext(), u = e;
              u <= o && u > -1 && u < c.columns.length;
              u++
            ) {
              var g = c.columns[u];
              if (g.isVisible) {
                if (((l = 0), r.autoSizeMode & AutoSizeMode.Headers)) {
                  for (p = 0; p < s.rows.length; p++)
                    if (s.rows[p].isVisible) {
                      f = r._getDesiredWidth(s, p, u, i);
                      l = Math.max(l, f);
                    }
                  for (p = 0; p < a.rows.length; p++)
                    if (a.rows[p].isVisible) {
                      f = r._getDesiredWidth(a, p, u, i);
                      l = Math.max(l, f);
                    }
                }
                if (r.autoSizeMode & AutoSizeMode.Cells && h.isValid)
                  if (g._getQuickAutoSize()) {
                    var p = r._getWidestRow(c, h, u, d),
                      f = r._getDesiredWidth(c, p, u, i);
                    l = Math.max(l, f);
                  } else
                    for (p = h.row; p <= h.row2 && p < c.rows.length; p++)
                      if (c.rows[p].isVisible) {
                        f = r._getDesiredWidth(c, p, u, i);
                        l = Math.max(l, f);
                      }
                g.width = l + n + 2;
              }
            }
            r.cellFactory.disposeCell(i), wjcCore.removeChild(i);
          });
    }),
    (t.prototype.autoSizeRow = function (e, t, o) {
      void 0 === t && (t = !1),
        void 0 === o && (o = 0),
        this.autoSizeRows(e, e, t, o);
    }),
    (t.prototype.autoSizeRows = function (e, o, i, n) {
      var r = this;
      void 0 === i && (i = !1), void 0 === n && (n = 0);
      var l = 0,
        s = i ? this.topLeftCells : this.rowHeaders,
        a = i ? this.columnHeaders : this.cells;
      (i = wjcCore.asBoolean(i)),
        (n = wjcCore.asNumber(n)),
        (e = null == e ? 0 : wjcCore.asInt(e)),
        (o = null == o ? a.rows.length - 1 : wjcCore.asInt(o)),
        this.finishEditing() &&
          this.rows.deferUpdate(function () {
            wjcCore.setCss(r._eCt, { width: r._gpCells.width });
            var i = document.createElement('div');
            i.setAttribute(t._WJS_MEASURE, 'true'),
              (i.style.visibility = 'hidden'),
              a.hostElement.appendChild(i);
            for (var c = {}, h = e; h <= o && h > -1 && h < a.rows.length; h++)
              if (a.rows[h].isVisible) {
                if (((l = 0), r.autoSizeMode & AutoSizeMode.Headers))
                  for (u = 0; u < s.columns.length; u++)
                    if (s.columns[u].isVisible > 0) {
                      f = r._getDesiredHeight(s, h, u, i);
                      l = Math.max(l, f);
                    }
                if (r.autoSizeMode & AutoSizeMode.Cells)
                  for (var d = !0, u = 0; u < a.columns.length; u++) {
                    var g = a.columns[u],
                      p = g._getQuickAutoSize();
                    if (
                      g.isVisible &&
                      (d ||
                        g.wordWrap ||
                        g.cssClass ||
                        g.dataType == wjcCore.DataType.Boolean ||
                        !p)
                    ) {
                      var f = void 0;
                      if (p) {
                        var w = {
                            col: u,
                            content:
                              g.dataType == wjcCore.DataType.Number
                                ? '1'
                                : a.getCellData(h, u, !0),
                          },
                          _ = JSON.stringify(w);
                        null == (f = c[_]) &&
                          ((f = r._getDesiredHeight(a, h, u, i)), (c[_] = f));
                      } else f = r._getDesiredHeight(a, h, u, i);
                      (l = Math.max(l, f)), (d = !1);
                    }
                  }
                a.rows[h].height = l + n;
              }
            r.cellFactory.disposeCell(i), wjcCore.removeChild(i);
          });
    }),
    Object.defineProperty(t.prototype, 'treeIndent', {
      get: function () {
        return this._indent;
      },
      set: function (e) {
        e != this._indent &&
          ((this._indent = wjcCore.asNumber(e, !1, !0)),
          this.columns.onCollectionChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.collapseGroupsToLevel = function (e) {
      if (this.finishEditing()) {
        var t = this.rows;
        t.deferUpdate(function () {
          for (var o = 0; o < t.length; o++) {
            var i = wjcCore.tryCast(t[o], GroupRow);
            i && (i.isCollapsed = i.level >= e);
          }
        });
      }
    }),
    Object.defineProperty(t.prototype, 'selectionMode', {
      get: function () {
        return this._selHdl.selectionMode;
      },
      set: function (e) {
        e != this.selectionMode &&
          (this._clearCells(),
          (this._selHdl.selectionMode = wjcCore.asEnum(e, SelectionMode)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'selection', {
      get: function () {
        return this._selHdl.selection.clone();
      },
      set: function (e) {
        this._selHdl.selection = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.select = function (e, t) {
      void 0 === t && (t = !0), this._selHdl.select(e, t);
    }),
    (t.prototype.getSelectedState = function (e, t) {
      return this.cells.getSelectedState(e, t, null);
    }),
    Object.defineProperty(t.prototype, 'selectedRows', {
      get: function () {
        var e = [];
        if (this.selectionMode == SelectionMode.ListBox)
          for (o = 0; o < this.rows.length; o++)
            this.rows[o].isSelected && e.push(this.rows[o]);
        else if (this.rows.length)
          for (
            var t = this.selection, o = t.topRow;
            o > -1 && o <= t.bottomRow;
            o++
          )
            e.push(this.rows[o]);
        return e;
      },
      set: function (e) {
        var t = this;
        wjcCore.assert(
          this.selectionMode == SelectionMode.ListBox,
          'This property can be set only in ListBox mode.'
        ),
          (e = wjcCore.asArray(e)),
          this.deferUpdate(function () {
            for (var o = 0, i = !0; o < t.rows.length; o++) {
              var n = t.rows[o],
                r = e && e.indexOf(n) > -1;
              r && i && ((i = !1), t.select(o, t.selection.col)),
                (n.isSelected = r);
            }
          });
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'selectedItems', {
      get: function () {
        for (var e = this.selectedRows, t = 0; t < e.length; t++)
          e[t] = e[t].dataItem;
        return e;
      },
      set: function (e) {
        var t = this;
        wjcCore.assert(
          this.selectionMode == SelectionMode.ListBox,
          'This property can be set only in ListBox mode.'
        ),
          (e = wjcCore.asArray(e)),
          this.deferUpdate(function () {
            for (var o = 0, i = !0; o < t.rows.length; o++) {
              var n = t.rows[o],
                r = e && e.indexOf(n.dataItem) > -1;
              r && i && ((i = !1), t.select(o, t.selection.col)),
                (n.isSelected = r);
            }
          });
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.scrollIntoView = function (e, t, o) {
      null == this._maxOffsetY && this._updateLayout();
      var i = this.scrollPosition,
        n = this._szClient.width,
        r = this._szClient.height - this._gpCFtr.rows.getTotalSize(),
        l = this.cells._getFrozenPos();
      if (
        (e = wjcCore.asInt(e)) > -1 &&
        e < this._rows.length &&
        e >= this._rows.frozen
      ) {
        var s = this._rows[e],
          a =
            this.cells.height > r
              ? Math.round((s.pos / (this.cells.height - r)) * 100) / 100
              : 0,
          c = Math.round(this._maxOffsetY * a),
          h = s.pos - c,
          d = h + s.renderSize;
        d > r - i.y && (i.y = Math.max(-h, r - d)),
          h - l.y < -i.y && (i.y = -(h - l.y));
      }
      if (
        (t = wjcCore.asInt(t)) > -1 &&
        t < this._cols.length &&
        t >= this._cols.frozen
      ) {
        var u = this._cols[t],
          g = u.pos + u.renderSize;
        g > -i.x + n && (i.x = Math.max(-u.pos, n - g)),
          u.pos - l.x < -i.x && (i.x = -(u.pos - l.x));
      }
      return (
        !i.equals(this._ptScrl) &&
        ((this.scrollPosition = i),
        o && (this._updateScrollPosition(), this.refresh()),
        !0)
      );
    }),
    (t.prototype.isRangeValid = function (e) {
      return (
        e.isValid &&
        e.bottomRow < this.rows.length &&
        e.rightCol < this.columns.length
      );
    }),
    (t.prototype.startEditing = function (e, t, o, i) {
      return void 0 === e && (e = !0), this._edtHdl.startEditing(e, t, o, i);
    }),
    (t.prototype.finishEditing = function (e) {
      return void 0 === e && (e = !1), this._edtHdl.finishEditing(e);
    }),
    Object.defineProperty(t.prototype, 'activeEditor', {
      get: function () {
        return this._edtHdl.activeEditor;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'editRange', {
      get: function () {
        return this._edtHdl.editRange;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'mergeManager', {
      get: function () {
        return this._mrgMgr;
      },
      set: function (e) {
        e != this._mrgMgr &&
          ((this._mrgMgr = wjcCore.asType(e, MergeManager, !0)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getMergedRange = function (e, t, o, i) {
      return (
        void 0 === i && (i = !0),
        this._mrgMgr ? this._mrgMgr.getMergedRange(e, t, o, i) : null
      );
    }),
    Object.defineProperty(t.prototype, 'keyActionTab', {
      get: function () {
        return this._keyHdl._kaTab;
      },
      set: function (e) {
        this._keyHdl._kaTab = wjcCore.asEnum(e, KeyAction);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'keyActionEnter', {
      get: function () {
        return this._keyHdl._kaEnter;
      },
      set: function (e) {
        this._keyHdl._kaEnter = wjcCore.asEnum(e, KeyAction);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showDropDown', {
      get: function () {
        return this._shDropDown;
      },
      set: function (e) {
        e != this._shDropDown &&
          ((this._shDropDown = wjcCore.asBoolean(e, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.toggleDropDownList = function () {
      this._tglDropDown ||
        ((this._tglDropDown = !0),
        this._edtHdl._toggleListBox(null),
        (this._tglDropDown = !1));
    }),
    (t.prototype.onItemsSourceChanging = function (e) {
      return this.itemsSourceChanging.raise(this, e), !e.cancel;
    }),
    (t.prototype.onItemsSourceChanged = function (e) {
      this.itemsSourceChanged.raise(this, e);
    }),
    (t.prototype.onScrollPositionChanged = function (e) {
      this.scrollPositionChanged.raise(this, e);
    }),
    (t.prototype.onSelectionChanging = function (e) {
      return this.selectionChanging.raise(this, e), !e.cancel;
    }),
    (t.prototype.onSelectionChanged = function (e) {
      this.selectionChanged.raise(this, e);
    }),
    (t.prototype.onLoadingRows = function (e) {
      return this.loadingRows.raise(this, e), !e.cancel;
    }),
    (t.prototype.onLoadedRows = function (e) {
      this.loadedRows.raise(this, e);
    }),
    (t.prototype.onUpdatingLayout = function (e) {
      return this.updatingLayout.raise(this, e), !e.cancel;
    }),
    (t.prototype.onUpdatedLayout = function (e) {
      this.updatedLayout.raise(this, e);
    }),
    (t.prototype.onResizingColumn = function (e) {
      return this.resizingColumn.raise(this, e), !e.cancel;
    }),
    (t.prototype.onResizedColumn = function (e) {
      this.resizedColumn.raise(this, e);
    }),
    (t.prototype.onAutoSizingColumn = function (e) {
      return this.autoSizingColumn.raise(this, e), !e.cancel;
    }),
    (t.prototype.onAutoSizedColumn = function (e) {
      this.autoSizedColumn.raise(this, e);
    }),
    (t.prototype.onDraggingColumn = function (e) {
      return this.draggingColumn.raise(this, e), !e.cancel;
    }),
    (t.prototype.onDraggingColumnOver = function (e) {
      return this.draggingColumnOver.raise(this, e), !e.cancel;
    }),
    (t.prototype.onDraggedColumn = function (e) {
      this.draggedColumn.raise(this, e);
    }),
    (t.prototype.onResizingRow = function (e) {
      return this.resizingRow.raise(this, e), !e.cancel;
    }),
    (t.prototype.onResizedRow = function (e) {
      this.resizedRow.raise(this, e);
    }),
    (t.prototype.onAutoSizingRow = function (e) {
      return this.autoSizingRow.raise(this, e), !e.cancel;
    }),
    (t.prototype.onAutoSizedRow = function (e) {
      this.autoSizedRow.raise(this, e);
    }),
    (t.prototype.onDraggingRow = function (e) {
      return this.draggingRow.raise(this, e), !e.cancel;
    }),
    (t.prototype.onDraggingRowOver = function (e) {
      return this.draggingRowOver.raise(this, e), !e.cancel;
    }),
    (t.prototype.onDraggedRow = function (e) {
      this.draggedRow.raise(this, e);
    }),
    (t.prototype.onGroupCollapsedChanging = function (e) {
      return this.groupCollapsedChanging.raise(this, e), !e.cancel;
    }),
    (t.prototype.onGroupCollapsedChanged = function (e) {
      this.groupCollapsedChanged.raise(this, e);
    }),
    (t.prototype.onSortingColumn = function (e) {
      return this.sortingColumn.raise(this, e), !e.cancel;
    }),
    (t.prototype.onSortedColumn = function (e) {
      this.sortedColumn.raise(this, e);
    }),
    (t.prototype.onBeginningEdit = function (e) {
      return this.beginningEdit.raise(this, e), !e.cancel;
    }),
    (t.prototype.onPrepareCellForEdit = function (e) {
      this.prepareCellForEdit.raise(this, e);
    }),
    (t.prototype.onCellEditEnding = function (e) {
      return this.cellEditEnding.raise(this, e), !e.cancel && !e.stayInEditMode;
    }),
    (t.prototype.onCellEditEnded = function (e) {
      this.cellEditEnded.raise(this, e);
    }),
    (t.prototype.onRowEditStarting = function (e) {
      this.rowEditStarting.raise(this, e);
    }),
    (t.prototype.onRowEditStarted = function (e) {
      this.rowEditStarted.raise(this, e);
    }),
    (t.prototype.onRowEditEnding = function (e) {
      this.rowEditEnding.raise(this, e);
    }),
    (t.prototype.onRowEditEnded = function (e) {
      this.rowEditEnded.raise(this, e);
    }),
    (t.prototype.onRowAdded = function (e) {
      return this.rowAdded.raise(this, e), !e.cancel;
    }),
    (t.prototype.onDeletingRow = function (e) {
      return this.deletingRow.raise(this, e), !e.cancel;
    }),
    (t.prototype.onDeletedRow = function (e) {
      this.deletedRow.raise(this, e);
    }),
    (t.prototype.onCopying = function (e) {
      return this.copying.raise(this, e), !e.cancel;
    }),
    (t.prototype.onCopied = function (e) {
      this.copied.raise(this, e);
    }),
    (t.prototype.onPasting = function (e) {
      return this.pasting.raise(this, e), !e.cancel;
    }),
    (t.prototype.onPasted = function (e) {
      this.pasted.raise(this, e);
    }),
    (t.prototype.onPastingCell = function (e) {
      return this.pastingCell.raise(this, e), !e.cancel;
    }),
    (t.prototype.onPastedCell = function (e) {
      this.pastedCell.raise(this, e);
    }),
    (t.prototype.onFormatItem = function (e) {
      this.formatItem.raise(this, e);
    }),
    (t.prototype.onUpdatingView = function (e) {
      return this.updatingView.raise(this, e), !e.cancel;
    }),
    (t.prototype.onUpdatedView = function (e) {
      this.updatedView.raise(this, e);
    }),
    (t.prototype._getShowErrors = function () {
      return this.showErrors && this._hasValidation;
    }),
    (t.prototype._getHasValidation = function () {
      return this._hasValidation;
    }),
    (t.prototype._getError = function (e, t, o) {
      if (wjcCore.isFunction(this.itemValidator)) {
        if (e == this.cells) return this.itemValidator(t, o);
        if (e == this.rowHeaders)
          for (o = 0; o < this.columns.length; o++)
            if ((c = this.itemValidator(t, o))) return c;
      }
      var i = this._cv,
        n = i ? i.getError : null;
      if (wjcCore.isFunction(n)) {
        var r = e.rows,
          l = this.columns,
          s = r[t].dataItem;
        if (s)
          for (; t < r.length && r[t].dataItem == s; t++) {
            if (e == this.cells)
              return n(
                s,
                (a = this._getBindingColumn(this.cells, t, l[o])).binding
              );
            if (e == this.rowHeaders)
              for (o = 0; o < l.length; o++) {
                var a = this._getBindingColumn(this.cells, t, l[o]),
                  c = n(s, a.binding);
                if (c) return c;
              }
          }
      }
      return null;
    }),
    (t.prototype._setAria = function (e, t) {
      wjcCore.setAttribute(this.cells.hostElement, 'aria-' + e, t);
    }),
    (t.prototype._setFocus = function (e) {
      if (this.hostElement && (e || !this.containsFocus())) {
        var t = wjcCore.getActiveElement(),
          o = this._eFocus,
          i = 'tabindex';
        this.activeEditor
          ? wjcCore.contains(this.activeEditor, t) ||
            (this.activeEditor.focus(), o.removeAttribute(i))
          : this._activeCell
          ? wjcCore.contains(this._activeCell, t) ||
            (t != this._root &&
              ((this._activeCell.tabIndex = this._tabIndex),
              this._activeCell.focus(),
              o.removeAttribute(i)))
          : wjcCore.contains(o, t) ||
            ((o.tabIndex = this._tabIndex), o.focus()),
          this.containsFocus() || ((o.tabIndex = this._tabIndex), o.focus());
      }
    }),
    (t.prototype._setFocusNoScroll = function (e) {
      var t = this.scrollPosition,
        o = e.style,
        i = o.position;
      (o.position = 'fixed'),
        (e.tabIndex = this._tabIndex),
        e.focus(),
        (o.position = i),
        (this.scrollPosition = t);
      var n = this.hostElement;
      n.scrollTop = n.scrollLeft = 0;
    }),
    (t.prototype._getDefaultRowHeight = function () {
      var e = this._eFocus.scrollHeight + 2;
      return (e <= 6 || isNaN(e)) && (e = 28), e;
    }),
    (t.prototype._getDefaultCellPadding = function () {
      var e = getComputedStyle(this._eFocus);
      return parseInt(this.rightToLeft ? e.paddingRight : e.paddingLeft);
    }),
    (t.prototype._getCollectionView = function (e) {
      return wjcCore.asCollectionView(e);
    }),
    (t.prototype._getCanvasContext = function () {
      var e = document.createElement('canvas').getContext('2d'),
        t = getComputedStyle(this.hostElement);
      return (e.font = t.fontSize + ' ' + t.fontFamily.split(',')[0]), e;
    }),
    (t.prototype._getWidestRow = function (e, t, o, i) {
      for (
        var n = 0,
          r = 0,
          l = e.columns[o].dataType == wjcCore.DataType.Boolean,
          s = t.row;
        s <= t.row2;
        s++
      )
        if (e.rows[s].isVisible) {
          var a = e.getCellData(s, o, !0),
            c = i.measureText(a).width;
          if ((c > r && ((r = c), (n = s)), l)) break;
        }
      return n;
    }),
    (t.prototype._getDesiredWidth = function (e, t, o, i) {
      var n = this.getMergedRange(e, t, o),
        r = i.style;
      return (
        this.cellFactory.updateCell(e, t, o, i, n),
        (r.width = r.top = r.left = ''),
        i.offsetWidth / (n && n.columnSpan > 1 ? n.columnSpan : 1)
      );
    }),
    (t.prototype._getDesiredHeight = function (e, t, o, i) {
      var n = this.getMergedRange(e, t, o),
        r = i.style;
      return (
        this.cellFactory.updateCell(e, t, o, i, n),
        (r.height = r.top = r.left = ''),
        i.offsetHeight / (n && n.rowSpan > 1 ? n.rowSpan : 1)
      );
    }),
    (t.prototype._getSortRowIndex = function () {
      return null != this._sortRowIndex
        ? this._sortRowIndex
        : this.columnHeaders.rows.length - 1;
    }),
    (t.prototype._sortConverter = function (e, t, o, i) {
      var n;
      if (i) {
        if (((this._mappedColumns = null), this._cv))
          for (var r = this._cv.sortDescriptions, l = 0; l < r.length; l++)
            (n = this.getColumn(r[l].property)) &&
              n.dataMap &&
              (this._mappedColumns || (this._mappedColumns = {}),
              (this._mappedColumns[n.binding] = n.dataMap));
        this._mouseHdl._htDown &&
          this._mouseHdl._htDown.col > -1 &&
          ((n = this.columns[this._mouseHdl._htDown.col]),
          this._mappedColumns &&
            n.dataMap &&
            (this._mappedColumns[n.binding] = n.dataMap));
      }
      if (this._mappedColumns) {
        var s = this._mappedColumns[e.property];
        s && s.sortByDisplayValues && (o = s.getDisplayValue(o));
      }
      return o;
    }),
    (t.prototype._bindGrid = function (e) {
      var t = this;
      if (
        (this.deferUpdate(function () {
          0 == t._lastCount && wjcCore.hasItems(t._cv) && (e = !0);
          var o,
            i = t.selectionMode == SelectionMode.ListBox;
          t.preserveSelectedState &&
            i &&
            !t.childItemsPath &&
            (o = t.selectedItems);
          var n;
          if (
            t.preserveOutlineState &&
            wjcCore.isFunction(window.Map) &&
            t.rows.maxGroupLevel > -1
          ) {
            n = new Map();
            for (h = 0; h < t.rows.length; h++) {
              var r = t.rows[h];
              if (r instanceof GroupRow && r.isCollapsed && r.dataItem) {
                var l = r.dataItem;
                l instanceof wjcCore.CollectionViewGroup && (l = l._path),
                  n.set(l, !0);
              }
            }
          }
          e &&
            t.columns.deferUpdate(function () {
              t._bindColumns();
            });
          var s = new wjcCore.CancelEventArgs();
          t.onLoadingRows(s) &&
            (t.rows.deferUpdate(function () {
              t._bindRows();
            }),
            t.onLoadedRows(s));
          var a = 0;
          if (o && o.length)
            for (h = 0; h < t.rows.length && a < o.length; h++)
              o.indexOf(t.rows[h].dataItem) > -1 &&
                ((t.rows[h].isSelected = !0), a++);
          if (i && 0 == a && t._lastCount > 0)
            for (
              var c = t.selection, h = c.topRow;
              h <= c.bottomRow && h > -1 && h < t.rows.length;
              h++
            )
              t.rows[h].isSelected = !0;
          n &&
            t.rows.deferUpdate(function () {
              for (var e = 0; e < t.rows.length; e++) {
                var o = t.rows[e];
                if (o instanceof GroupRow) {
                  var i = o.dataItem;
                  i instanceof wjcCore.CollectionViewGroup && (i = i._path),
                    n.get(i) && (o.isCollapsed = !0);
                }
              }
            }),
            !t._lastCount &&
              t._cv &&
              t._cv.items &&
              (t._lastCount = t._cv.items.length);
        }),
        !this.rows.length)
      ) {
        var o = this._selHdl.selection;
        o.row = o.row2 = -1;
      }
      this._cv && this._syncSelection(!0);
    }),
    (t.prototype._cvCollectionChanged = function (e, t) {
      if (this.autoGenerateColumns && 0 == this.columns.length)
        this._bindGrid(!0);
      else if (
        this.childItemsPath &&
        t.action != wjcCore.NotifyCollectionChangedAction.Change
      )
        this._bindGrid(!1);
      else {
        switch (t.action) {
          case wjcCore.NotifyCollectionChangedAction.Change:
            return void this.invalidate();
          case wjcCore.NotifyCollectionChangedAction.Add:
            if (t.index == this._cv.items.length - 1) {
              var o = this.rows.length;
              return (
                this.rows[o - 1] instanceof _NewRowTemplate && o--,
                void this.rows.insert(o, new Row(t.item))
              );
            }
            wjcCore.assert(!1, 'added item should be the last one.');
            break;
          case wjcCore.NotifyCollectionChangedAction.Remove:
            var i = this._findRow(t.item);
            if (i > -1)
              return this.rows.removeAt(i), void this._syncSelection(!1);
            wjcCore.assert(!1, 'removed item not found in grid.');
        }
        this._bindGrid(!1);
      }
    }),
    (t.prototype._cvCurrentChanged = function (e, t) {
      this._syncSelection(!1);
    }),
    (t.prototype._syncSelection = function (e) {
      if (this._cv && this.selectionMode != SelectionMode.None) {
        var t = this.selection,
          o =
            t.row > -1 && t.row < this.rows.length
              ? this.rows[t.row].dataItem
              : null;
        if (
          (o instanceof wjcCore.CollectionViewGroup && (o = null),
          (o != this._cv.currentItem || e) &&
            (!this.childItemsPath ||
              !this.editableCollectionView ||
              !this.editableCollectionView.currentAddItem))
        ) {
          var i = this._getRowIndex(this._cv.currentPosition);
          (i == t.row && this.childItemsPath) ||
            ((t.row = t.row2 = i),
            this.select(t, !1),
            this.selectionMode && this.scrollIntoView(t.row, -1));
        }
      }
    }),
    (t.prototype._getRowIndex = function (e) {
      if (this._cv) {
        if (e > -1) {
          for (var t = this._cv.items[e]; e < this.rows.length; e++)
            if (this.rows[e].dataItem === t) return e;
          return -1;
        }
        if (1 == this.rows.length && this.rows[0] instanceof _NewRowTemplate)
          return 0;
        var o = this.selection.row,
          i = o > -1 ? this.rows[o] : null;
        return i && (i instanceof GroupRow || null == i.dataItem) ? o : -1;
      }
      return this.selection.row;
    }),
    (t.prototype._getCvIndex = function (e) {
      if (this._cv && e > -1 && e < this.rows.length) {
        var t = this._cv.items,
          o = this.rows[e].dataItem;
        for (e = Math.min(e, t.length - 1); e > -1; e--)
          if (t[e] === o) return e;
      }
      return -1;
    }),
    (t.prototype._findRow = function (e) {
      for (var t = 0; t < this.rows.length; t++)
        if (this.rows[t].dataItem == e) return t;
      return -1;
    }),
    (t.prototype._updateLayout = function () {
      var e = new wjcCore.CancelEventArgs();
      if (this.onUpdatingLayout(e)) {
        this._hasValidation =
          wjcCore.isFunction(this._itemValidator) ||
          (this._cv && wjcCore.isFunction(this._cv.getError));
        var o =
            this._hdrVis & HeadersVisibility.Row
              ? this._hdrCols.getTotalSize()
              : 0,
          i =
            this._hdrVis & HeadersVisibility.Column
              ? this._hdrRows.getTotalSize()
              : 0,
          n = this._ftrRows.getTotalSize(),
          r = this._rows.getTotalSize() + n;
        r < 1 && (r = 1),
          (this._heightBrowser = Math.min(r, t._getMaxSupportedCssHeight())),
          (this._maxOffsetY = Math.max(0, r - this._heightBrowser)),
          (this._cellPadding = this._getDefaultCellPadding());
        var l = this._heightBrowser + i - n,
          s = this._gpCells.width,
          a = this._heightBrowser;
        !s && this.rows.length && (s = 0.1),
          !a && this.columns.length && (a = 0.1),
          this.rightToLeft
            ? (wjcCore.setCss(this._eTL, {
                right: 0,
                top: 0,
                width: o,
                height: i,
              }),
              wjcCore.setCss(this._eCHdr, {
                right: o,
                top: 0,
                height: i,
              }),
              wjcCore.setCss(this._eRHdr, {
                right: 0,
                top: i,
                width: o,
              }),
              wjcCore.setCss(this._eCt, {
                right: o,
                top: i,
                width: s,
                height: a,
              }),
              wjcCore.setCss(this._fCt, { right: o, top: i }),
              wjcCore.setCss(this._eBL, {
                right: 0,
                top: l,
                width: o,
                height: n,
              }),
              wjcCore.setCss(this._eCFtr, {
                right: o,
                top: l,
                height: n,
              }))
            : (wjcCore.setCss(this._eTL, {
                left: 0,
                top: 0,
                width: o,
                height: i,
              }),
              wjcCore.setCss(this._eCHdr, {
                left: o,
                top: 0,
                height: i,
              }),
              wjcCore.setCss(this._eRHdr, {
                left: 0,
                top: i,
                width: o,
              }),
              wjcCore.setCss(this._eCt, {
                left: o,
                top: i,
                width: s,
                height: a,
              }),
              wjcCore.setCss(this._fCt, { left: o, top: i }),
              wjcCore.setCss(this._eBL, {
                left: 0,
                top: l,
                width: o,
                height: n,
              }),
              wjcCore.setCss(this._eCFtr, {
                left: o,
                top: l,
                height: n,
              })),
          this._stickyHdr && this._updateStickyHeaders();
        var c = this.frozenRows || this.frozenColumns ? '3' : '';
        wjcCore.setCss(
          [
            this._eTL,
            this._eBL,
            this._eCHdr,
            this._eCFtr,
            this._eRHdr,
            this._eMarquee,
          ],
          { zIndex: c }
        );
        var h = this._root,
          d = h.offsetWidth - h.clientWidth,
          u = h.offsetHeight - h.clientHeight;
        wjcCore.setCss(this._eSz, {
          width: o + d + this._gpCells.width,
          height: i + u + this._heightBrowser,
        });
        var g = null;
        this.columns._updateStarSizes(h.clientWidth - o) &&
          ((g = h.clientWidth),
          wjcCore.setCss(this._eCt, { width: this._gpCells.width })),
          (this._szClient = new wjcCore.Size(
            h.clientWidth - o,
            h.clientHeight - i
          )),
          (this._rcBounds = null),
          this._updateScrollHandler(),
          this._updateContent(!1),
          (d = h.offsetWidth - h.clientWidth),
          (u = h.offsetHeight - h.clientHeight),
          wjcCore.setCss(this._eSz, {
            width: o + d + this._gpCells.width,
            height: i + u + this._heightBrowser,
          }),
          (this._szClient = new wjcCore.Size(
            h.clientWidth - o,
            h.clientHeight - i
          )),
          g &&
            g != h.clientWidth &&
            this.columns._updateStarSizes(h.clientWidth - o) &&
            (wjcCore.setCss(this._eCt, {
              width: this._gpCells.width,
            }),
            this._updateContent(!1)),
          wjcCore.setCss([this._eCHdr, this._eCFtr, this._fCt], {
            width: this._szClient.width,
          }),
          wjcCore.setCss([this._eRHdr, this._fCt], {
            height: this._szClient.height,
          }),
          n &&
            ((l = Math.min(l, this._szClient.height + i - n)),
            wjcCore.setCss([this._eBL, this._eCFtr], { top: l })),
          this.onUpdatedLayout(e);
      }
    }),
    (t.prototype._updateStickyHeaders = function () {
      var e = !1,
        o = 0;
      if (this._stickyHdr) {
        for (
          var i = 0, n = null, r = this.hostElement;
          r;
          r = r.parentElement
        ) {
          var l = r.getBoundingClientRect();
          null == n && (n = l.top), (i = Math.max(i, l.top));
        }
        (o = -(n = Math.max(0, i - n - 1))),
          (e = n > 0),
          (this._rcBounds = null);
      }
      (this._eTL.style.top = this._eCHdr.style.top = e ? -o + 'px' : ''),
        wjcCore.toggleClass(this._eTL, t._WJS_STICKY, e),
        wjcCore.toggleClass(this._eCHdr, t._WJS_STICKY, e);
    }),
    (t.prototype._updateScrollHandler = function () {
      this._clipToScreen = this._getClipToScreen();
      var e = this._stickyHdr || this._clipToScreen;
      e != this._scrollHandlerAttached &&
        ((this._scrollHandlerAttached = e),
        e
          ? this.addEventListener(window, 'scroll', this._bndScroll, !0)
          : this.removeEventListener(window, 'scroll', this._bndScroll, !0));
    }),
    (t.prototype._getClipToScreen = function () {
      if (this.rows.length <= t._MIN_VIRT_ROWS) return !1;
      if (this._root.clientHeight != this._root.scrollHeight) return !1;
      for (
        var e = this.hostElement;
        e && e != document.documentElement;
        e = e.parentElement
      )
        if ('auto' == getComputedStyle(e).overflow) return !1;
      return !0;
    }),
    (t.prototype._scroll = function (e) {
      var t = this;
      wjcCore.contains(e.target, this.hostElement) &&
        (this._clipToScreen &&
          (this._afScrl && cancelAnimationFrame(this._afScrl),
          (this._afScrl = requestAnimationFrame(function () {
            (t._afScrl = null), t.finishEditing(), t._updateContent(!0);
          }))),
        this._stickyHdr &&
          (this._afSticky && cancelAnimationFrame(this._afSticky),
          (this._afSticky = requestAnimationFrame(function () {
            t._afSticky = null;
            var e = new wjcCore.CancelEventArgs();
            t.onUpdatingLayout(e) &&
              (t._updateStickyHeaders(), t.onUpdatedLayout(e));
          }))));
    }),
    (t.prototype._updateScrollPosition = function () {
      var e = this._root,
        o = e.scrollTop,
        i = e.scrollLeft;
      this.rightToLeft &&
        'rev' == t._getRtlMode() &&
        (i = e.scrollWidth - e.clientWidth - i);
      var n = new wjcCore.Point(-Math.abs(i), -o);
      return (
        !this._ptScrl.equals(n) &&
        ((this._ptScrl = n), this.onScrollPositionChanged(), !0)
      );
    }),
    (t.prototype._updateContent = function (e, t) {
      var o = wjcCore.getActiveElement(),
        i = wjcCore.contains(this.hostElement, o) ? o : null,
        n = this._activeCell,
        r = new wjcCore.CancelEventArgs();
      if (this.onUpdatingView(r)) {
        if (
          ((this._offsetY = 0), this._heightBrowser > this._szClient.height)
        ) {
          var l =
            Math.round(
              (-this._ptScrl.y /
                (this._heightBrowser - this._szClient.height)) *
                100
            ) / 100;
          this._offsetY = Math.round(this._maxOffsetY * l);
        }
        this._updateScrollPosition();
        var s = this._gpCells._updateContent(e, t, this._offsetY);
        if (
          (this._hdrVis & HeadersVisibility.Column &&
            (!t || this._ssHdr & HeadersVisibility.Column) &&
            this._gpCHdr._updateContent(e, t, 0),
          this._hdrVis & HeadersVisibility.Row &&
            (!t || this._ssHdr & HeadersVisibility.Row) &&
            this._gpRHdr._updateContent(e, t, this._offsetY),
          this._hdrVis && !t && this._gpTL._updateContent(e, t, 0),
          this._gpCFtr.rows.length &&
            (this._gpBL._updateContent(e, t, 0),
            this._gpCFtr._updateContent(e, t, 0)),
          this.showMarquee)
        ) {
          var a = this._selHdl.selection,
            c = this._eMarquee;
          if (this.isRangeValid(a)) {
            var h = this._getMarqueeRect(a),
              d = this.cells.hostElement,
              u = c.firstChild,
              g = c.offsetWidth - u.offsetWidth,
              p = c.offsetHeight - u.offsetHeight;
            wjcCore.setCss(c, {
              left: h.left + d.offsetLeft - g / 2,
              top: h.top + d.offsetTop - p / 2,
              width: h.width + g,
              height: h.height + p,
              visibility: h.width > 0 && h.height > 0 ? '' : 'collapse',
            });
          } else
            wjcCore.setCss(c, {
              left: 0,
              top: 0,
              width: 0,
              height: 0,
              visibility: 'collapse',
            });
        }
        if (
          (this._useFrozenDiv() &&
            (this._updateFrozenCells(t),
            s && wjcCore.hasClass(s, 'wj-frozen') && (s = null)),
          (this._activeCell = s),
          i)
        )
          if (
            i != this._root &&
            i != this._eFocus &&
            wjcCore.contains(this.hostElement, i) &&
            !wjcCore.contains(this.cells.hostElement, i)
          ) {
            if (
              (document.activeElement != i && i.focus(),
              wjcCore.isIE() &&
                i instanceof HTMLInputElement &&
                !i.type.match(/checkbox|radio|range/i))
            ) {
              var f = i.selectionStart,
                w = i.selectionEnd;
              i.setSelectionRange(f, w);
            }
          } else {
            var _ = s != n;
            this._setFocus(_);
          }
        !i && s && (s.tabIndex = this._tabIndex),
          n && n != s && n.removeAttribute('tabindex'),
          (this._rcBounds = null),
          this.onUpdatedView(r);
      }
    }),
    (t.prototype._clearCells = function () {
      for (var e in this)
        if ('_' == e[0]) {
          var t = this[e];
          t instanceof GridPanel && t._clearCells();
        }
      this.invalidate();
    }),
    (t.prototype._useFrozenDiv = function () {
      return wjcCore.isBoolean(this._fzClone)
        ? this._fzClone
        : wjcCore.isIE() || wjcCore.isFirefox() || wjcCore.isMobile();
    }),
    (t.prototype._updateFrozenCells = function (e) {
      if (this.frozenRows || this.frozenColumns) {
        var t = this._eCt.querySelectorAll('.wj-frozen');
        if (e && this._fCt.children.length == t.length) {
          for (o = 0; o < t.length; o++)
            this._fCt.children[o].className = t[o].className;
          return;
        }
        if ((wjcCore.setText(this._fCt, null), !this.activeEditor))
          for (var o = 0; o < t.length; o++) {
            var i = t[o].cloneNode(!0);
            (i.style.pointerEvents = 'auto'), this._fCt.appendChild(i);
          }
      } else wjcCore.setText(this._fCt, null);
    }),
    (t.prototype._getMarqueeRect = function (e) {
      var t =
          this.getMergedRange(this.cells, e.topRow, e.leftCol) ||
          new CellRange(e.topRow, e.leftCol),
        o =
          this.getMergedRange(this.cells, e.bottomRow, e.rightCol) ||
          new CellRange(e.bottomRow, e.rightCol),
        i = this.cells.getCellBoundingRect(t.topRow, t.leftCol, !0),
        n = this.cells.getCellBoundingRect(o.bottomRow, o.rightCol, !0);
      if (this.rows.frozen) {
        var r = Math.min(this.rows.length, this.rows.frozen),
          l = this.cells.getCellBoundingRect(r - 1, 0, !0);
        e.topRow >= r && i.top < l.bottom && (i.top = l.bottom),
          e.bottomRow >= r &&
            n.bottom < l.bottom &&
            (n.height = l.bottom - n.top);
      }
      if (this.columns.frozen) {
        var s = Math.min(this.columns.length, this.columns.frozen),
          l = this.cells.getCellBoundingRect(0, s - 1, !0);
        this.rightToLeft
          ? (e.leftCol >= s && i.right > l.left && (i.left = l.left - i.width),
            e.rightCol >= s && n.left > l.left && (n.left = l.left))
          : (e.leftCol >= s && i.left < l.right && (i.left = l.right),
            e.rightCol >= s &&
              n.right < l.right &&
              (n.width = l.right - n.left));
      }
      return this.rightToLeft
        ? new wjcCore.Rect(n.left, i.top, i.right - n.left, n.bottom - i.top)
        : new wjcCore.Rect(i.left, i.top, n.right - i.left, n.bottom - i.top);
    }),
    (t.prototype._bindColumns = function () {
      for (var e = 0; e < this.columns.length; e++)
        (s = this.columns[e])._getFlag(RowColFlags.AutoGenerated) &&
          (this.columns.removeAt(e), e--);
      var t = this._cv,
        o = t ? t.sourceCollection : null,
        i = o && o.length ? o[0] : null;
      if (i && this.autoGenerateColumns)
        for (var n in i)
          for (var r = null, l = 0; l < o.length && l < 1e3 && null == r; l++)
            if (((r = o[l][n]), wjcCore.isPrimitive(r))) {
              var s = new Column();
              s._setFlag(RowColFlags.AutoGenerated, !0),
                (s.binding = s.name = n),
                (s.header = wjcCore.toHeaderCase(n)),
                (s.dataType = wjcCore.getType(r)),
                s.dataType == wjcCore.DataType.Number && (s.width = 80);
              var a = Object.getOwnPropertyDescriptor(i, n);
              !a ||
                a.writable ||
                wjcCore.isFunction(a.set) ||
                s._setFlag(RowColFlags.ReadOnly, !0),
                this.columns.push(s);
            }
      this._updateColumnTypes();
    }),
    (t.prototype._updateColumnTypes = function () {
      var e = this._cv;
      if (wjcCore.hasItems(e))
        for (var t = e.items[0], o = this.columns, i = 0; i < o.length; i++) {
          var n = o[i];
          null == n.dataType &&
            n._binding &&
            (n.dataType = wjcCore.getType(n._binding.getValue(t)));
        }
    }),
    (t.prototype._getBindingColumn = function (e, t, o) {
      return o;
    }),
    (t.prototype._getRowHeaderPath = function () {
      return this._rowHdrPath;
    }),
    (t.prototype._bindRows = function () {
      this.rows.clear();
      var e = this._cv;
      if (e && e.items) {
        var t = e.items,
          o = e.groups;
        if (this.childItemsPath)
          for (i = 0; i < t.length; i++) this._addNode(t, i, 0);
        else if (null != o && o.length > 0 && this.showGroups)
          for (i = 0; i < o.length; i++) this._addGroup(o[i]);
        else for (var i = 0; i < t.length; i++) this._addBoundRow(t, i);
      }
    }),
    (t.prototype._addBoundRow = function (e, t) {
      this.rows.push(new Row(e[t]));
    }),
    (t.prototype._addNode = function (e, t, o) {
      var i = new GroupRow(),
        n = this.childItemsPath,
        r = wjcCore.isArray(n) ? n[o] : n,
        l = e[t],
        s = l[r];
      if (
        ((i.dataItem = l), (i.level = o), this.rows.push(i), wjcCore.isArray(s))
      )
        for (var a = 0; a < s.length; a++) this._addNode(s, a, o + 1);
    }),
    (t.prototype._addGroup = function (e) {
      var t = new GroupRow();
      if (
        ((t.level = e.level),
        (t.dataItem = e),
        this.rows.push(t),
        e.isBottomLevel)
      )
        for (var o = e.items, i = 0; i < o.length; i++) this._addBoundRow(o, i);
      else for (i = 0; i < e.groups.length; i++) this._addGroup(e.groups[i]);
    }),
    (t._getSerializableProperties = function (e) {
      var t = [];
      for (e = e.prototype; e != Object.prototype; e = Object.getPrototypeOf(e))
        for (var o = Object.getOwnPropertyNames(e), i = 0; i < o.length; i++) {
          var n = o[i],
            r = Object.getOwnPropertyDescriptor(e, n);
          r &&
            r.set &&
            r.get &&
            '_' != n[0] &&
            !n.match(/disabled|required/) &&
            t.push(n);
        }
      return t;
    }),
    (t.prototype._copy = function (e, t) {
      if ('columns' == e) {
        this.columns.clear();
        for (var o = wjcCore.asArray(t), i = 0; i < o.length; i++) {
          var n = new Column();
          wjcCore.copy(n, o[i]), this.columns.push(n);
        }
        return !0;
      }
      return !1;
    }),
    (t.prototype._isInputElement = function (e) {
      if (e instanceof HTMLElement) {
        if ('true' == e.contentEditable) return !0;
        var t = e.tagName.match(/^(BUTTON|A|INPUT|TEXTAREA|SELECT|OPTION)$/i);
        return t && t.length > 0;
      }
      return !1;
    }),
    (t.prototype._wantsInput = function (e) {
      return (
        this._isInputElement(e) &&
        !this.activeEditor &&
        !this._edtHdl._isNativeCheckbox(e) &&
        !wjcCore.hasClass(e, 'wj-grid-ime') &&
        wjcCore.contains(document.body, e)
      );
    }),
    (t._getMaxSupportedCssHeight = function () {
      if (!t._maxCssHeight) {
        var e = 335e5;
        wjcCore.isIE() ? (e = 15e5) : wjcCore.isFirefox() && (e = 175e5),
          (t._maxCssHeight = e);
      }
      return t._maxCssHeight;
    }),
    (t._getRtlMode = function () {
      if (!t._rtlMode) {
        var e = wjcCore.createElement(
          '<div dir="rtl" style="visibility:hidden;width:100px;height:100px;overflow:auto"><div style="width:2000px;height:2000px"></div></div>'
        );
        document.body.appendChild(e);
        var o = e.scrollLeft;
        e.scrollLeft = -1e3;
        var i = e.scrollLeft;
        wjcCore.removeChild(e),
          (t._rtlMode = i < 0 ? 'neg' : o > 0 ? 'rev' : 'std');
      }
      return t._rtlMode;
    }),
    (t._WJS_STICKY = 'wj-state-sticky'),
    (t._WJS_MEASURE = 'wj-state-measuring'),
    (t._WJS_UPDATING = 'wj-state-updating'),
    (t._MIN_VIRT_ROWS = 200),
    (t.controlTemplate =
      '<div style="position:relative;width:100%;height:100%;overflow:hidden;max-width:inherit;max-height:inherit"><div wj-part="focus" aria-hidden="true" class="wj-cell" style="position:fixed;opacity:0;pointer-events:none;left:-10px">0</div><div wj-part="root" style="position:absolute;width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch;max-width:inherit;max-height:inherit"><div wj-part="cells" class="wj-cells" style="position:absolute"></div><div wj-part="marquee" aria-hidden="true" class="wj-marquee" style="display:none;pointer-events:none;"><div style="width:100%;height:100%"></div></div></div><div wj-part="fcells" aria-hidden="true" class="wj-cells" style="position:absolute;pointer-events:none;overflow:hidden"></div><div wj-part="rh" aria-hidden="true" style="position:absolute;overflow:hidden;outline:none"><div wj-part="rhcells" class="wj-rowheaders" style="position:relative"></div></div><div wj-part="cf" aria-hidden="true" style="position:absolute;overflow:hidden;outline:none"><div wj-part="cfcells" class="wj-colfooters" style="position:relative"></div></div><div wj-part="ch" aria-hidden="true" style="position:absolute;overflow:hidden;outline:none"><div wj-part="chcells" class="wj-colheaders" style="position:relative"></div></div><div wj-part="bl" aria-hidden="true" style="position:absolute;overflow:hidden;outline:none"><div wj-part="blcells" class="wj-bottomleft" style="position:relative"></div></div><div wj-part="tl" aria-hidden="true" style="position:absolute;overflow:hidden;outline:none"><div wj-part="tlcells" class="wj-topleft" style="position:relative"></div></div><div wj-part="sz" aria-hidden="true" style="position:relative;visibility:hidden"></div></div>'),
    t
  );
})(wjcCore.Control);
exports.FlexGrid = FlexGrid;
var CellRangeEventArgs = (function (e) {
  function t(t, o, i) {
    var n = e.call(this) || this;
    return (
      (n._p = wjcCore.asType(t, GridPanel)),
      (n._rng = wjcCore.asType(o, CellRange)),
      (n._data = i),
      n
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'panel', {
      get: function () {
        return this._p;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'range', {
      get: function () {
        return this._rng.clone();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'row', {
      get: function () {
        return this._rng.row;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'col', {
      get: function () {
        return this._rng.col;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'data', {
      get: function () {
        return this._data;
      },
      set: function (e) {
        this._data = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.CancelEventArgs);
exports.CellRangeEventArgs = CellRangeEventArgs;
var FormatItemEventArgs = (function (e) {
  function t(t, o, i) {
    var n = e.call(this, t, o) || this;
    return (n._cell = wjcCore.asType(i, HTMLElement)), n;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'cell', {
      get: function () {
        return this._cell;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(CellRangeEventArgs);
exports.FormatItemEventArgs = FormatItemEventArgs;
var CellEditEndingEventArgs = (function (e) {
  function t() {
    var t = (null !== e && e.apply(this, arguments)) || this;
    return (t._stayInEditMode = !1), (t._refresh = !0), t;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'stayInEditMode', {
      get: function () {
        return this._stayInEditMode;
      },
      set: function (e) {
        this._stayInEditMode = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'refresh', {
      get: function () {
        return this._refresh;
      },
      set: function (e) {
        this._refresh = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(CellRangeEventArgs);
exports.CellEditEndingEventArgs = CellEditEndingEventArgs;
var CellType;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Cell = 1)] = 'Cell'),
    (e[(e.ColumnHeader = 2)] = 'ColumnHeader'),
    (e[(e.RowHeader = 3)] = 'RowHeader'),
    (e[(e.TopLeft = 4)] = 'TopLeft'),
    (e[(e.ColumnFooter = 5)] = 'ColumnFooter'),
    (e[(e.BottomLeft = 6)] = 'BottomLeft');
})((CellType = exports.CellType || (exports.CellType = {})));
var GridPanel = (function () {
  function e(e, t, o, i, n) {
    (this._offsetY = 0),
      (this._g = wjcCore.asType(e, FlexGrid)),
      (this._ct = wjcCore.asInt(t)),
      (this._rows = wjcCore.asType(o, RowCollection)),
      (this._cols = wjcCore.asType(i, ColumnCollection)),
      (this._e = wjcCore.asType(n, HTMLElement)),
      (this._vrb = new CellRange());
  }
  return (
    Object.defineProperty(e.prototype, 'grid', {
      get: function () {
        return this._g;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'cellType', {
      get: function () {
        return this._ct;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'viewRange', {
      get: function () {
        return this._getViewRange();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'width', {
      get: function () {
        return this._cols.getTotalSize();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'height', {
      get: function () {
        return this._rows.getTotalSize();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'rows', {
      get: function () {
        return this._rows;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'columns', {
      get: function () {
        return this._cols;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getCellData = function (e, t, o) {
      var i,
        n = this._rows[wjcCore.asNumber(e, !1, !0)],
        r = null;
      if (wjcCore.isString(t) && (t = this._cols.indexOf(t)) < 0)
        throw 'Invalid column name or binding.';
      i = this._cols[wjcCore.asNumber(t, !1, !0)];
      var l = this._g ? this._g._getBindingColumn(this, e, i) : i;
      if (
        (!l.binding ||
        !n.dataItem ||
        n.dataItem instanceof wjcCore.CollectionViewGroup
          ? n._ubv && (r = n._ubv[i._hash])
          : (r = l._binding.getValue(n.dataItem)),
        null == r)
      )
        switch (this._ct) {
          case CellType.ColumnHeader:
            (e != this._rows.length - 1 && l == i) || (r = l.header);
            break;
          case CellType.ColumnFooter:
            if (
              l.aggregate != wjcCore.Aggregate.None &&
              n instanceof GroupRow
            ) {
              var s = this._g.collectionView;
              if (s) {
                var a = wjcCore.tryCast(s, wjcCore.CollectionView);
                r = a
                  ? a.getAggregate(l.aggregate, l.binding)
                  : wjcCore.getAggregate(l.aggregate, s.items, l.binding);
              }
            }
            break;
          case CellType.Cell:
            if (
              l.aggregate != wjcCore.Aggregate.None &&
              n instanceof GroupRow
            ) {
              var c = wjcCore.tryCast(n.dataItem, wjcCore.CollectionViewGroup);
              c &&
                (r = c.getAggregate(
                  l.aggregate,
                  l.binding,
                  this._g.collectionView
                ));
            }
        }
      return (
        o &&
          (this.cellType == CellType.Cell &&
            l.dataMap &&
            (r = l.dataMap.getDisplayValue(r)),
          (r = null != r ? wjcCore.Globalize.format(r, l.format) : '')),
        r
      );
    }),
    (e.prototype.setCellData = function (e, t, o, i, n) {
      void 0 === i && (i = !0), void 0 === n && (n = !0);
      var r,
        l = this._rows[wjcCore.asNumber(e, !1, !0)];
      if (wjcCore.isString(t) && (t = this._cols.indexOf(t)) < 0)
        throw 'Invalid column name or binding.';
      r = this._cols[wjcCore.asNumber(t, !1, !0)];
      var s = this._g ? this._g._getBindingColumn(this, e, r) : r;
      if (this._ct == CellType.Cell) {
        if (s.dataMap && null != o && (s.isRequired || '' != o)) {
          var a = s.dataMap,
            c = a.getKeyValue(o);
          if (null == c && null == a.getDisplayValue(null)) {
            if (!a.isEditable || a.displayMemberPath != a.selectedValuePath)
              return !1;
          } else o = c;
        }
        var h = wjcCore.DataType.Object;
        if (s.dataType) h = s.dataType;
        else {
          var d = this.getCellData(e, t, !1);
          h = wjcCore.getType(d);
        }
        if (wjcCore.isBoolean(s.isRequired))
          if (s.isRequired || ('' !== o && null !== o)) {
            if (s.isRequired && ('' === o || null === o)) return !1;
          } else (o = null), (i = !1);
        if (
          i &&
          ((o = wjcCore.changeType(o, h, s.format)),
          h != wjcCore.DataType.Object && wjcCore.getType(o) != h)
        )
          return !1;
      }
      if (l.dataItem && s.binding) {
        var u = s._binding,
          g = l.dataItem,
          p = u.getValue(g);
        if (o !== p && !wjcCore.DateTime.equals(o, p)) {
          u.setValue(g, o);
          var f = this._g.collectionView;
          if (f instanceof wjcCore.CollectionView && g != f.currentEditItem) {
            var w = new wjcCore.NotifyCollectionChangedEventArgs(
              wjcCore.NotifyCollectionChangedAction.Change,
              g,
              f.items.indexOf(g)
            );
            f.onCollectionChanged(w);
          }
        }
      } else l._ubv || (l._ubv = {}), (l._ubv[r._hash] = o);
      return n && this._g && this._g.invalidate(), !0;
    }),
    (e.prototype.getCellBoundingRect = function (e, t, o) {
      var i = this.rows[e],
        n = this.columns[t],
        r = new wjcCore.Rect(n.pos, i.pos, n.renderSize, i.renderSize);
      if (
        this._g.rightToLeft &&
        ((r.left = this.hostElement.clientWidth - r.right),
        !wjcCore.isIE() && !wjcCore.isFirefox())
      ) {
        var l = this.hostElement.parentElement;
        r.left -= l.offsetWidth - l.clientWidth;
      }
      if (!o) {
        var s = this.hostElement.getBoundingClientRect();
        (r.left += s.left), (r.top += s.top - this._offsetY);
      }
      return (
        e < this.rows.frozen && (r.top -= this._g.scrollPosition.y),
        t < this.columns.frozen &&
          (r.left -= this._g.scrollPosition.x * (this._g.rightToLeft ? -1 : 1)),
        r
      );
    }),
    (e.prototype.getCellElement = function (t, o) {
      for (
        var i = this.hostElement.children, n = Math.min(t + 2, i.length), r = 0;
        r < n;
        r++
      )
        for (
          var l = i[r].children, s = Math.min(o + 2, l.length), a = 0;
          a < s;
          a++
        ) {
          var c = l[a],
            h = c[e._INDEX_KEY];
          if (
            h &&
            ((h.row == t && h.col == o) || (h.rng && h.rng.contains(t, o)))
          )
            return c;
        }
      return null;
    }),
    (e.prototype.getSelectedState = function (e, t, o) {
      var i = this._g,
        n = i.selectionMode,
        r = i._selHdl.selection,
        l = SelectionMode,
        s = SelectedState;
      if (n != l.None)
        switch (this._ct) {
          case CellType.Cell:
            if ((o || (o = i.getMergedRange(this, e, t)), o)) {
              if (o.contains(r.row, r.col))
                return i.showMarquee ? s.None : s.Cursor;
              if (o.intersects(r)) return s.Selected;
            }
            if (r.row == e && r.col == t)
              return i.showMarquee ? s.None : s.Cursor;
            if (i.rows[e].isSelected || i.columns[t].isSelected)
              return s.Selected;
            if (o)
              switch (n) {
                case l.Row:
                case l.RowRange:
                case l.ListBox:
                  if (o.containsRow(r.row)) return s.Selected;
              }
            return (
              (r = i._selHdl._adjustSelection(r)),
              n == SelectionMode.ListBox
                ? s.None
                : r.containsRow(e) && r.containsColumn(t)
                ? s.Selected
                : s.None
            );
          case CellType.ColumnHeader:
            if (
              i.showSelectedHeaders & HeadersVisibility.Column &&
              (i.columns[t].isSelected ||
                r.containsColumn(t) ||
                r.intersectsColumn(o)) &&
              (o && (e = o.bottomRow), e == this.rows.length - 1)
            )
              return s.Selected;
            break;
          case CellType.RowHeader:
            if (
              i.showSelectedHeaders & HeadersVisibility.Row &&
              (i.rows[e].isSelected ||
                r.containsRow(e) ||
                r.intersectsRow(o)) &&
              (o && (t = o.rightCol), t == this.columns.length - 1)
            )
              return s.Selected;
        }
      return s.None;
    }),
    Object.defineProperty(e.prototype, 'hostElement', {
      get: function () {
        return this._e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._getOffsetY = function () {
      return this._offsetY;
    }),
    (e.prototype._updateContent = function (e, t, o) {
      var i = this._g,
        n = this._e,
        r = this._rows,
        l = this._cols,
        s = this._ct;
      if (
        s == CellType.ColumnHeader ||
        s == CellType.ColumnFooter ||
        s == CellType.RowHeader
      ) {
        var a = i._ptScrl,
          c = n.style;
        s == CellType.RowHeader
          ? (c.top = a.y + 'px')
          : i.rightToLeft
          ? (c.right = a.x + 'px')
          : (c.left = a.x + 'px');
      }
      this._offsetY != o && ((e = !1), (this._offsetY = o));
      var h = this._getViewRange(),
        d = h;
      if (r.length <= i.virtualizationThreshold)
        d = new CellRange(0, 0, r.length - 1, l.length - 1);
      else if (d.isValid && i.isTouching) {
        d = new CellRange(
          Math.max(h.row - 6, r.frozen),
          Math.max(h.col - 1, l.frozen),
          Math.min(h.row2 + 6, r.length - 1),
          Math.min(h.col2 + 1, l.length - 1)
        );
      }
      if (e && !t && this._vrb.contains(h) && !r.frozen && !l.frozen)
        return this._activeCell;
      (e && d.equals(this._vrb)) || (t = !1),
        e &&
          !t &&
          this._ct != CellType.TopLeft &&
          this._reorderCells(d, this._vrb),
        (this._activeCell = null),
        (this._vru = h),
        (this._vrb = d),
        (this._cf = i.cellFactory);
      var u = 0;
      this._ct == CellType.Cell && (u = this._renderColHdrRow(d, t));
      for (g = 0; g < r.frozen && g < r.length; g++)
        u = this._renderRow(g, d, t, u);
      for (var g = d.topRow; g <= d.bottomRow && g > -1; g++)
        u = this._renderRow(g, d, t, u);
      for (; n.childElementCount > u; ) {
        var p = n.lastElementChild;
        n.removeChild(p), this._removeExtraCells(p, 0);
      }
      return this._activeCell;
    }),
    (e.prototype._updateScrollPosition = function () {
      var e = this._g,
        t = e._ptScrl,
        o = this.hostElement.style;
      this.cellType == CellType.RowHeader
        ? (o.top = t.y + 'px')
        : e.rightToLeft
        ? (o.right = t.x + 'px')
        : (o.left = t.x + 'px');
    }),
    (e.prototype._clearCells = function () {
      for (var e = this.hostElement, t = e.childElementCount - 1; t >= 0; t--) {
        var o = e.children[t];
        e.removeChild(o);
        for (var i = o.childElementCount - 1; i >= 0; i--)
          this._cf.disposeCell(o.children[i]);
      }
    }),
    (e.prototype._reorderCells = function (e, t) {
      if (
        !(
          this._rows.frozen > 0 ||
          this._cols.frozen > 0 ||
          e.columnSpan != t.columnSpan ||
          e.rowSpan != t.rowSpan
        ) &&
        t.isValid &&
        e.isValid &&
        e.intersects(t) &&
        e.row != t.row
      ) {
        var o = e.row - t.row,
          i = Math.max(1, e.rowSpan - 1),
          n = this._e;
        if (0 != o && Math.abs(o) < i) {
          var r = this._ct == CellType.Cell ? 1 : 0,
            l = n.childElementCount;
          if (o > 0) {
            var s = r,
              a = Math.min(r + o, l - 1);
            (c = this._createRange(s, a)) &&
              a < l - 1 &&
              n.appendChild(c.extractContents());
          }
          if (o < 0) {
            var a = l,
              s = Math.max(r, a + o),
              c = this._createRange(s, a);
            if (c && s > r) {
              var h = n.children[r];
              n.insertBefore(c.extractContents(), h);
            }
          }
        }
      }
    }),
    (e.prototype._createRange = function (e, t) {
      var o,
        i = this._e.childElementCount;
      return (
        t > e &&
          t <= i &&
          e > -1 &&
          ((o = document.createRange()).setStart(this._e, e),
          o.setEnd(this._e, t)),
        o
      );
    }),
    (e.prototype._renderColHdrRow = function (e, t) {
      var o = this._e.children[0];
      o ||
        (o = wjcCore.createElement(
          '<div class="wj-row" tabindex="-1" role="row"></div>',
          this._e
        )),
        wjcCore.setAttribute(o, 'aria-selected', null);
      var i = 0,
        n = this._g._getRowHeaderPath();
      n && (i = this._renderRowHdrCell(o, -1, n.path));
      for (r = 0; r < this.columns.frozen && r < this.columns.length; r++)
        i = this._renderColHdrCell(o, r, e, t, i);
      for (var r = e.leftCol; r <= e.rightCol && r > -1; r++)
        i = this._renderColHdrCell(o, r, e, t, i);
      return this._removeExtraCells(o, i), 1;
    }),
    (e.prototype._renderColHdrCell = function (t, o, i, n, r) {
      var l = this.columns[o];
      if (l.renderSize <= 0) return r;
      var s = t.children[r];
      s ||
        (s = wjcCore.createElement(
          '<div class="wj-cell" tabindex="-1" role="columnheader"></div>',
          t
        )),
        n ||
          ((s.textContent = this.columns[o].header),
          wjcCore.setCss(s, {
            position: 'fixed',
            top: -32e3,
            height: 0.1,
            left: l.pos,
            width: l.renderWidth,
            overflow: 'hidden',
            opacity: '0',
            pointerEvents: 'none',
          }));
      var a = this.grid;
      if (a.allowSorting) {
        var c = 'none';
        switch (a._getBindingColumn(this, 0, l).currentSort) {
          case '+':
            c = 'ascending';
            break;
          case '-':
            c = 'descending';
        }
        wjcCore.setAttribute(s, 'aria-sort', c);
      }
      return (s[e._INDEX_KEY] = { row: -1, col: o, panel: this }), r + 1;
    }),
    (e.prototype._renderRowHdrCell = function (t, o, i) {
      var n = t.children[0];
      return (
        n ||
          (n = wjcCore.createElement(
            '<div class="wj-cell" tabindex="-1"></div>',
            t
          )),
        n.setAttribute('role', o < 0 ? 'columnheader' : 'rowheader'),
        (n.textContent = i ? i.toString() : ''),
        wjcCore.setCss(n, {
          position: 'fixed',
          left: -32e3,
          top: -32e3,
          width: 0.1,
          height: 0.1,
          overflow: 'hidden',
          opacity: '0',
        }),
        (n[e._INDEX_KEY] = { row: o, col: -1, panel: this }),
        1
      );
    }),
    (e.prototype._renderRow = function (e, t, o, i) {
      var n = this._g,
        r = this.rows[e];
      if (r.renderSize <= 0) return i;
      var l = this._e.children[i];
      if (
        (l ||
          ((l = wjcCore.createElement(
            '<div class="wj-row" tabindex="-1"></div>',
            this._e
          )),
          this._ct == CellType.Cell && l.setAttribute('role', 'row')),
        this._ct == CellType.Cell)
      ) {
        var s = SelectionMode;
        switch (n.selectionMode) {
          case s.Row:
          case s.RowRange:
          case s.ListBox:
            var a = r.isSelected || this._g._selHdl.selection.containsRow(e);
            wjcCore.setAttribute(l, 'aria-selected', !!a);
        }
      }
      var c = 0;
      if (this._ct == CellType.Cell) {
        var h = this._g._getRowHeaderPath();
        h && (c = this._renderRowHdrCell(l, e, h.getValue(r.dataItem)));
      }
      for (d = 0; d < this.columns.frozen && d < this.columns.length; d++)
        c = this._renderCell(l, e, d, t, o, c);
      for (var d = t.leftCol; d <= t.rightCol && d > -1; d++)
        c = this._renderCell(l, e, d, t, o, c);
      return this._removeExtraCells(l, c), i + 1;
    }),
    (e.prototype._renderCell = function (t, o, i, n, r, l) {
      var s = this._g,
        a = s.getMergedRange(this, o, i);
      if (a) {
        for (c = Math.max(n.row, a.row); c < o; c++)
          if (this.rows[c].isVisible) return l;
        for (var c = Math.max(n.col, a.col); c < i; c++)
          if (this.columns[c].isVisible) return l;
      }
      if (
        this.columns[i].renderSize <= 0 &&
        (!a || a.getRenderSize(this).width <= 0)
      )
        return l;
      var h = !1;
      if (this.cellType == CellType.Cell) {
        var d = s._selHdl.selection;
        h = (d.row == o && d.col == i) || (a && a.contains(d.row, d.col));
      }
      var u = t.children[l],
        g = this.getSelectedState(o, i, a),
        p = SelectedState;
      return u && r
        ? (wjcCore.toggleClass(u, 'wj-state-selected', g == p.Cursor),
          wjcCore.toggleClass(u, 'wj-state-multi-selected', g == p.Selected),
          h && (this._activeCell = u),
          l + 1)
        : (u ||
            (((u = document.createElement('div')).tabIndex = -1),
            this._ct == CellType.Cell && u.setAttribute('role', 'gridcell'),
            t.appendChild(u)),
          h && (this._activeCell = u),
          s.cellFactory.updateCell(this, o, i, u, a),
          (u[e._INDEX_KEY] = { row: o, col: i, rng: a, panel: this }),
          l + 1);
    }),
    (e.prototype._removeExtraCells = function (e, t) {
      for (; e.childElementCount > t; ) {
        var o = e.lastElementChild;
        e.removeChild(o), this._cf.disposeCell(o);
      }
    }),
    (e.prototype._getViewRange = function () {
      var e = this._g,
        t = e._ptScrl,
        o = this._rows,
        i = this._cols,
        n = new CellRange(0, 0, o.length - 1, i.length - 1);
      if (this._ct == CellType.Cell || this._ct == CellType.RowHeader) {
        var r = -t.y + this._offsetY,
          l = e._szClient.height;
        if (
          ((h = Math.min(o.frozen, o.length - 1)) > 0 &&
            ((r += d = o[h - 1].pos), (l -= d)),
          (n.row = Math.min(
            o.length - 1,
            Math.max(o.frozen, o.getItemAt(r + 1))
          )),
          (n.row2 = o.getItemAt(r + l + 1)),
          e._clipToScreen)
        ) {
          var s = e.hostElement.getBoundingClientRect();
          s.top < 0 &&
            (n.row = Math.max(n.row, o.getItemAt(-s.top - e._ptScrl.y) - 1)),
            s.bottom > innerHeight &&
              (n.row2 = Math.min(
                n.row2,
                o.getItemAt(-s.top - e._ptScrl.y + innerHeight) + 1
              ));
        }
      }
      if (this._ct == CellType.Cell || this._ct == CellType.ColumnHeader) {
        var a = -t.x,
          c = e._szClient.width,
          h = Math.min(i.frozen, i.length - 1);
        if (h > 0) {
          var d = i[h - 1].pos;
          (a += d), (c -= d);
        }
        (n.col = Math.min(
          i.length - 1,
          Math.max(i.frozen, i.getItemAt(a + 1))
        )),
          (n.col2 = i.getItemAt(a + c + 1));
      }
      return (
        o.length <= o.frozen && (n.row = n.row2 = -1),
        i.length <= i.frozen && (n.col = n.col2 = -1),
        n
      );
    }),
    (e.prototype._getFrozenPos = function () {
      var e = this._rows.frozen,
        t = this._cols.frozen,
        o = e > 0 ? this._rows[e - 1] : null,
        i = t > 0 ? this._cols[t - 1] : null,
        n = o ? o.pos + o.renderSize : 0,
        r = i ? i.pos + i.renderSize : 0;
      return new wjcCore.Point(r, n);
    }),
    (e._INDEX_KEY = 'wj-cell-index'),
    e
  );
})();
exports.GridPanel = GridPanel;
var CellFactory = (function () {
  function e() {}
  return (
    (e.prototype.updateCell = function (t, o, i, n, r, l) {
      var s = t.grid,
        a = s.rightToLeft,
        c = t.cellType,
        h = t.rows,
        d = t.columns,
        u = h[o],
        g = d[i],
        p = o,
        f = i,
        w = u instanceof GroupRow ? u : null,
        _ = u instanceof _NewRowTemplate ? u : null,
        C = g.renderWidth,
        m = u.renderHeight,
        y = 'wj-cell',
        v = { display: '' };
      if (
        (0 != l &&
          n.firstElementChild &&
          ((1 == n.childNodes.length &&
            'checkbox' == n.firstElementChild.type) ||
            (n.textContent = '')),
        r && !r.isSingleCell)
      ) {
        (o = r.row),
          (i = r.col),
          (p = r.row2),
          (f = r.col2),
          (u = h[o]),
          (g = d[i]),
          (w = u instanceof GroupRow ? u : null);
        var b = r.getRenderSize(t);
        (m = b.height), (C = b.width);
      }
      var R = s._getBindingColumn(t, o, g),
        j = R.dataType == wjcCore.DataType.Boolean && !R.dataMap,
        S = g.pos,
        E = u.pos;
      if (
        (s._useFrozenDiv() && c == CellType.Cell && !s.editRange
          ? (o < h.frozen && i >= d.frozen && (S += s._ptScrl.x),
            i < d.frozen && o >= h.frozen && (E += s._ptScrl.y))
          : (o < h.frozen && (E -= s._ptScrl.y),
            i < d.frozen && (S -= s._ptScrl.x)),
        a ? (v.right = S + 'px') : (v.left = S + 'px'),
        (v.top = E - t._getOffsetY() + 'px'),
        (v.width = C + 'px'),
        (v.height = m + 'px'),
        (v.zIndex = ''),
        (o < h.frozen || i < d.frozen) &&
          (v.zIndex = o < h.frozen && i < d.frozen ? 2 : 1),
        c == CellType.Cell
          ? (w && (y += ' wj-group'),
            s.showAlternatingRows &&
              u.visibleIndex % 2 != 0 &&
              ((r && r.row != r.row2) || (y += ' wj-alt')),
            (o < h.frozen || i < d.frozen) && (y += ' wj-frozen'),
            _ && (y += ' wj-new'),
            u.cssClass && (y += ' ' + u.cssClass),
            R.cssClass && (y += ' ' + R.cssClass))
          : ((y += ' wj-header'),
            s.showAlternatingRows && o % 2 != 0 && (y += ' wj-header-alt')),
        (c == CellType.Cell || c == CellType.RowHeader) && s._getShowErrors())
      ) {
        var x = s._getError(t, o, i);
        wjcCore.setAttribute(n, 'title', x), x && (y += ' wj-state-invalid');
      }
      var z = t.getSelectedState(o, i, r);
      switch (
        (z != SelectedState.None &&
          c == CellType.Cell &&
          !j &&
          s.editRange &&
          s.editRange.contains(o, i) &&
          (z = SelectedState.None),
        z)
      ) {
        case SelectedState.Cursor:
          y += ' wj-state-selected';
          break;
        case SelectedState.Selected:
          y += ' wj-state-multi-selected';
      }
      if (
        (p == h.frozen - 1 && (y += ' wj-frozen-row'),
        f == d.frozen - 1 && (y += ' wj-frozen-col'),
        (R.wordWrap || u.wordWrap) && (y += ' wj-wrap'),
        (v.textAlign = R.getAlignment()),
        (v.paddingLeft = v.paddingRight = v.paddingTop = v.paddingBottom = ''),
        c == CellType.Cell &&
          s.rows.maxGroupLevel > -1 &&
          i == s.columns.firstVisibleIndex &&
          s.treeIndent)
      ) {
        var T = w ? Math.max(0, w.level) : s.rows.maxGroupLevel + 1,
          M = s.treeIndent * T + s._cellPadding;
        a ? (v.paddingRight = M + 'px') : (v.paddingLeft = M + 'px');
      }
      if (0 != l) {
        var H = t.getCellData(o, i, !1),
          P = t.getCellData(o, i, !0);
        if (
          c == CellType.Cell &&
          i == s.columns.firstVisibleIndex &&
          w &&
          w.hasChildren &&
          !this._isEditingCell(s, o, i)
        )
          P || (P = w.getGroupHeader()),
            (n.innerHTML = this._getTreeIcon(w) + ' ' + P),
            (v.textAlign = '');
        else if (
          c == CellType.ColumnHeader &&
          R.currentSort &&
          s.showSort &&
          (p == s._getSortRowIndex() || R != g)
        )
          (y += ' wj-sort-' + ('+' == R.currentSort ? 'asc' : 'desc')),
            (n.innerHTML =
              wjcCore.escapeHtml(P) + '&nbsp;' + this._getSortIcon(R));
        else if (
          c != CellType.RowHeader ||
          i != s.rowHeaders.columns.length - 1 ||
          P
        )
          if (
            c != CellType.Cell ||
            R.dataType != wjcCore.DataType.Boolean ||
            R.dataMap ||
            (w && !wjcCore.isBoolean(H))
          )
            if (c == CellType.Cell && this._isEditingCell(s, o, i)) {
              var A = R.inputType;
              if (
                (R.inputType ||
                  (A =
                    R.dataType != wjcCore.DataType.Number || R.dataMap
                      ? 'text'
                      : 'tel'),
                !R.dataMap && !R.mask)
              ) {
                var L = t.getCellData(o, i, !1);
                if (wjcCore.isNumber(L)) {
                  var D = L.toString(),
                    I = R.format;
                  if (I && L != Math.round(L)) {
                    var O = D.match(/\.(\d+)/)[1].length;
                    I = I.replace(/([a-z])(\d*)(.*)/gi, '$01' + O + '$3');
                  }
                  P = wjcCore.Globalize.formatNumber(L, I, !0);
                }
              }
              n.innerHTML =
                '<input type="' +
                A +
                '" class="wj-grid-editor wj-form-control">';
              var N = n.children[0];
              (N.value = P),
                (N.required = R.getIsRequired()),
                R.maxLength && (N.maxLength = R.maxLength),
                (N.style.textAlign = R.getAlignment()),
                (v.paddingTop = v.paddingBottom = '0px'),
                R.mask && new wjcCore._MaskProvider(N, R.mask),
                (s._edtHdl._edt = N);
            } else
              c == CellType.Cell && (u.isContentHtml || R.isContentHtml)
                ? (n.innerHTML = P)
                : (n.textContent = P || '');
          else {
            var F = n.firstChild;
            (F instanceof HTMLInputElement && 'checkbox' == F.type) ||
              ((n.innerHTML =
                '<input type="checkbox" class="wj-cell-check" tabindex="-1"/>'),
              (F = n.firstChild)),
              (F.checked = 1 == H),
              (F.indeterminate = null == H),
              (F.disabled = !s.canEditCell(o, i)),
              F.disabled && (F.style.cursor = 'default'),
              s.editRange && s.editRange.contains(o, i) && (s._edtHdl._edt = F);
          }
        else {
          var k = s.editableCollectionView,
            B = k ? k.currentEditItem : null;
          B && u.dataItem == B
            ? (n.innerHTML = '<span class="wj-glyph-pencil"></span>')
            : u instanceof _NewRowTemplate &&
              (n.innerHTML = '<span class="wj-glyph-asterisk"></span>');
        }
        if (
          c == CellType.Cell &&
          tryGetModuleWijmoInput() &&
          R.dataMap &&
          s.showDropDown &&
          0 != R.showDropDown &&
          s.canEditCell(o, i)
        ) {
          e._ddIcon ||
            (e._ddIcon = wjcCore.createElement(
              '<div role="button" class="' +
                e._WJC_DROPDOWN +
                '"><span class="wj-glyph-down"></span></div>'
            ));
          var V = e._ddIcon.cloneNode(!0);
          n.appendChild(V);
        }
      }
      var G = !1;
      switch (c) {
        case CellType.RowHeader:
          (G =
            !w &&
            !_ &&
            u.allowDragging &&
            0 != (s.allowDragging & AllowDragging.Rows)),
            wjcCore.setAttribute(n, 'draggable', G ? 'true' : null);
          break;
        case CellType.ColumnHeader:
          (G =
            g.allowDragging && 0 != (s.allowDragging & AllowDragging.Columns)),
            wjcCore.setAttribute(n, 'draggable', G ? 'true' : null);
      }
      n.className != y && (n.className = y);
      var K = n.style;
      for (var W in v) K[W] = v[W];
      if (s._edtHdl._edt && s._edtHdl._edt.parentElement == n) {
        var q = s._root,
          U = q.getBoundingClientRect(),
          Y = n.getBoundingClientRect(),
          J = U.top + q.clientHeight - Y.top,
          X = U.left + q.clientWidth - Y.left;
        Y.height > J && (n.style.height = J + 'px'),
          Y.width > X && (n.style.width = X + 'px');
      }
      if (
        (s.itemFormatter && s.itemFormatter(t, o, i, n),
        s.formatItem.hasHandlers)
      ) {
        var Z = e._fmtRng;
        Z
          ? Z.setRange(o, i, p, f)
          : (Z = e._fmtRng = new CellRange(o, i, p, f));
        var Q = new FormatItemEventArgs(t, Z, n);
        s.onFormatItem(Q);
      }
    }),
    (e.prototype.disposeCell = function (e) {}),
    (e.prototype.getEditorValue = function (e) {
      var t = e._edtHdl._edt;
      if (t instanceof HTMLInputElement) {
        if ('checkbox' == t.type) return t.checked;
        var o = t.maxLength;
        return wjcCore.isNumber(o) && o > -1 && t.value.length > o
          ? t.value.substr(0, o)
          : t.value;
      }
      return null;
    }),
    (e.prototype._isEditingCell = function (e, t, o) {
      return e.editRange && e.editRange.contains(t, o);
    }),
    (e.prototype._getTreeIcon = function (t) {
      var o =
        'wj-glyph-' +
        (t.isCollapsed ? '' : 'down-') +
        (t.grid.rightToLeft ? 'left' : 'right');
      return (
        '<span role="button" class="' + e._WJC_COLLAPSE + ' ' + o + '"></span>'
      );
    }),
    (e.prototype._getSortIcon = function (e) {
      return (
        '<span class="wj-glyph-' +
        ('+' == e.currentSort ? 'up' : 'down') +
        '"></span>'
      );
    }),
    (e._WJC_COLLAPSE = 'wj-elem-collapse'),
    (e._WJC_DROPDOWN = 'wj-elem-dropdown'),
    e
  );
})();
exports.CellFactory = CellFactory;
var CellRange = (function () {
  function e(e, t, o, i) {
    void 0 === e && (e = -1),
      void 0 === t && (t = -1),
      void 0 === o && (o = e),
      void 0 === i && (i = t),
      this.setRange(e, t, o, i);
  }
  return (
    (e.prototype.setRange = function (e, t, o, i) {
      void 0 === e && (e = -1),
        void 0 === t && (t = -1),
        void 0 === o && (o = e),
        void 0 === i && (i = t),
        (this._row = wjcCore.asInt(e)),
        (this._col = wjcCore.asInt(t)),
        (this._row2 = wjcCore.asInt(o)),
        (this._col2 = wjcCore.asInt(i));
    }),
    Object.defineProperty(e.prototype, 'row', {
      get: function () {
        return this._row;
      },
      set: function (e) {
        this._row = wjcCore.asInt(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'col', {
      get: function () {
        return this._col;
      },
      set: function (e) {
        this._col = wjcCore.asInt(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'row2', {
      get: function () {
        return this._row2;
      },
      set: function (e) {
        this._row2 = wjcCore.asInt(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'col2', {
      get: function () {
        return this._col2;
      },
      set: function (e) {
        this._col2 = wjcCore.asInt(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.clone = function () {
      return new e(this._row, this._col, this._row2, this._col2);
    }),
    Object.defineProperty(e.prototype, 'rowSpan', {
      get: function () {
        return Math.abs(this._row2 - this._row) + 1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'columnSpan', {
      get: function () {
        return Math.abs(this._col2 - this._col) + 1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'topRow', {
      get: function () {
        return Math.min(this._row, this._row2);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'bottomRow', {
      get: function () {
        return Math.max(this._row, this._row2);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'leftCol', {
      get: function () {
        return Math.min(this._col, this._col2);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'rightCol', {
      get: function () {
        return Math.max(this._col, this._col2);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isValid', {
      get: function () {
        return (
          this._row > -1 && this._col > -1 && this._row2 > -1 && this._col2 > -1
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isSingleCell', {
      get: function () {
        return this._row == this._row2 && this._col == this._col2;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.contains = function (t, o) {
      var i = wjcCore.tryCast(t, e);
      if (i)
        return (
          i.topRow >= this.topRow &&
          i.bottomRow <= this.bottomRow &&
          i.leftCol >= this.leftCol &&
          i.rightCol <= this.rightCol
        );
      if (wjcCore.isInt(t) && wjcCore.isInt(o))
        return (
          t >= this.topRow &&
          t <= this.bottomRow &&
          o >= this.leftCol &&
          o <= this.rightCol
        );
      throw 'contains expects a CellRange or row/column indices.';
    }),
    (e.prototype.containsRow = function (e) {
      return wjcCore.asInt(e) >= this.topRow && e <= this.bottomRow;
    }),
    (e.prototype.containsColumn = function (e) {
      return wjcCore.asInt(e) >= this.leftCol && e <= this.rightCol;
    }),
    (e.prototype.intersects = function (e) {
      return this.intersectsRow(e) && this.intersectsColumn(e);
    }),
    (e.prototype.intersectsRow = function (e) {
      return e && !(this.bottomRow < e.topRow || this.topRow > e.bottomRow);
    }),
    (e.prototype.intersectsColumn = function (e) {
      return e && !(this.rightCol < e.leftCol || this.leftCol > e.rightCol);
    }),
    (e.prototype.getRenderSize = function (e) {
      var t = new wjcCore.Size(0, 0);
      if (this.isValid) {
        for (var o = this.topRow; o <= this.bottomRow; o++)
          t.height += e.rows[o].renderSize;
        for (var i = this.leftCol; i <= this.rightCol; i++)
          t.width += e.columns[i].renderSize;
      }
      return t;
    }),
    (e.prototype.equals = function (t) {
      return (
        t instanceof e &&
        this._row == t._row &&
        this._col == t._col &&
        this._row2 == t._row2 &&
        this._col2 == t._col2
      );
    }),
    e
  );
})();
exports.CellRange = CellRange;
var RowColFlags;
!(function (e) {
  (e[(e.Visible = 1)] = 'Visible'),
    (e[(e.AllowResizing = 2)] = 'AllowResizing'),
    (e[(e.AllowDragging = 4)] = 'AllowDragging'),
    (e[(e.AllowMerging = 8)] = 'AllowMerging'),
    (e[(e.AllowSorting = 16)] = 'AllowSorting'),
    (e[(e.AutoGenerated = 32)] = 'AutoGenerated'),
    (e[(e.Collapsed = 64)] = 'Collapsed'),
    (e[(e.ParentCollapsed = 128)] = 'ParentCollapsed'),
    (e[(e.Selected = 256)] = 'Selected'),
    (e[(e.ReadOnly = 512)] = 'ReadOnly'),
    (e[(e.HtmlContent = 1024)] = 'HtmlContent'),
    (e[(e.WordWrap = 2048)] = 'WordWrap'),
    (e[(e.HasTemplate = 4096)] = 'HasTemplate'),
    (e[(e.RowDefault = 3)] = 'RowDefault'),
    (e[(e.ColumnDefault = 23)] = 'ColumnDefault');
})((RowColFlags = exports.RowColFlags || (exports.RowColFlags = {})));
var RowCol = (function () {
  function e() {
    (this._list = null), (this._pos = 0), (this._idx = -1), (this._vidx = -1);
  }
  return (
    Object.defineProperty(e.prototype, 'visible', {
      get: function () {
        return this._getFlag(RowColFlags.Visible);
      },
      set: function (e) {
        this._setFlag(RowColFlags.Visible, e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isVisible', {
      get: function () {
        return (
          !!this._getFlag(RowColFlags.Visible) &&
          (!this._getFlag(RowColFlags.ParentCollapsed) ||
            this instanceof _NewRowTemplate)
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'pos', {
      get: function () {
        return (
          this._list && this._list._dirty && this._list._update(), this._pos
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'index', {
      get: function () {
        return (
          this._list && this._list._dirty && this._list._update(), this._idx
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'visibleIndex', {
      get: function () {
        return (
          this._list && this._list._dirty && this._list._update(),
          this.isVisible ? this._vidx : -1
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'size', {
      get: function () {
        return this._sz;
      },
      set: function (e) {
        e != this._sz &&
          ((this._sz = wjcCore.asNumber(e, !0)), this.onPropertyChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'renderSize', {
      get: function () {
        if (!this.isVisible) return 0;
        var e = this._sz,
          t = this._list;
        return (
          t &&
            ((null == e || e < 0) && (e = Math.round(t.defaultSize)),
            null != t.minSize && e < t.minSize && (e = t.minSize),
            null != t.maxSize && e > t.maxSize && (e = t.maxSize)),
          null != this._szMin && e < this._szMin && (e = this._szMin),
          null != this._szMax && e > this._szMax && (e = this._szMax),
          Math.round(e)
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'allowResizing', {
      get: function () {
        return this._getFlag(RowColFlags.AllowResizing);
      },
      set: function (e) {
        this._setFlag(RowColFlags.AllowResizing, e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'allowDragging', {
      get: function () {
        return this._getFlag(RowColFlags.AllowDragging);
      },
      set: function (e) {
        this._setFlag(RowColFlags.AllowDragging, e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'allowMerging', {
      get: function () {
        return this._getFlag(RowColFlags.AllowMerging);
      },
      set: function (e) {
        this._setFlag(RowColFlags.AllowMerging, e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isSelected', {
      get: function () {
        return this._getFlag(RowColFlags.Selected);
      },
      set: function (e) {
        if (this._setFlag(RowColFlags.Selected, e, !0)) {
          var t = this.grid;
          t && t.refreshCells(!1, !0, !0);
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isReadOnly', {
      get: function () {
        return this._getFlag(RowColFlags.ReadOnly);
      },
      set: function (e) {
        this._setFlag(RowColFlags.ReadOnly, e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isContentHtml', {
      get: function () {
        return this._getFlag(RowColFlags.HtmlContent);
      },
      set: function (e) {
        this.isContentHtml != e &&
          (this._setFlag(RowColFlags.HtmlContent, e),
          this.grid && this.grid.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'wordWrap', {
      get: function () {
        return this._getFlag(RowColFlags.WordWrap);
      },
      set: function (e) {
        this._setFlag(RowColFlags.WordWrap, e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'cssClass', {
      get: function () {
        return this._cssClass;
      },
      set: function (e) {
        e != this._cssClass &&
          ((this._cssClass = wjcCore.asString(e)),
          this.grid && this.grid.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'grid', {
      get: function () {
        return this._list ? this._list._g : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'collectionView', {
      get: function () {
        return this.grid ? this.grid.collectionView : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onPropertyChanged = function () {
      this._list && ((this._list._dirty = !0), this.grid.invalidate());
    }),
    (e.prototype._getFlag = function (e) {
      return 0 != (this._f & e);
    }),
    (e.prototype._setFlag = function (e, t, o) {
      return (
        t != this._getFlag(e) &&
        ((this._f = t ? this._f | e : this._f & ~e),
        o || this.onPropertyChanged(),
        !0)
      );
    }),
    e
  );
})();
exports.RowCol = RowCol;
var Column = (function (e) {
  function t(o) {
    var i = e.call(this) || this;
    return (
      (i._f = RowColFlags.ColumnDefault),
      (i._hash = t._ctr.toString(36)),
      t._ctr++,
      o && wjcCore.copy(i, o),
      i
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'name', {
      get: function () {
        return this._name;
      },
      set: function (e) {
        this._name = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dataType', {
      get: function () {
        return this._type;
      },
      set: function (e) {
        this._type != e &&
          ((this._type = wjcCore.asEnum(e, wjcCore.DataType)),
          this.grid && this.grid.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isRequired', {
      get: function () {
        return this._required;
      },
      set: function (e) {
        this._required = wjcCore.asBoolean(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showDropDown', {
      get: function () {
        return this._showDropDown;
      },
      set: function (e) {
        e != this._showDropDown &&
          ((this._showDropDown = wjcCore.asBoolean(e, !0)),
          this.grid && this.grid.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dropDownCssClass', {
      get: function () {
        return this._ddCssClass;
      },
      set: function (e) {
        this._ddCssClass = wjcCore.asString(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'inputType', {
      get: function () {
        return this._inpType;
      },
      set: function (e) {
        this._inpType = wjcCore.asString(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'mask', {
      get: function () {
        return this._mask;
      },
      set: function (e) {
        this._mask = wjcCore.asString(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'maxLength', {
      get: function () {
        return this._maxLen;
      },
      set: function (e) {
        this._maxLen = wjcCore.asNumber(e, !0, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'binding', {
      get: function () {
        return this._binding ? this._binding.path : null;
      },
      set: function (e) {
        if (e != this.binding) {
          var t = wjcCore.asString(e);
          if (
            ((this._binding = t ? new wjcCore.Binding(t) : null),
            !this._type && this.grid && this._binding)
          ) {
            var o = this.grid.collectionView;
            if (o && o.sourceCollection && o.sourceCollection.length) {
              var i = o.sourceCollection[0];
              this._type = wjcCore.getType(this._binding.getValue(i));
            }
          }
          this.onPropertyChanged();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sortMemberPath', {
      get: function () {
        return this._bindingSort ? this._bindingSort.path : null;
      },
      set: function (e) {
        if (e != this.sortMemberPath) {
          var t = wjcCore.asString(e);
          (this._bindingSort = t ? new wjcCore.Binding(t) : null),
            this.onPropertyChanged();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'width', {
      get: function () {
        return null != this._szStar ? this._szStar : this.size;
      },
      set: function (e) {
        null != t._parseStarSize(e)
          ? ((this._szStar = e), this.onPropertyChanged())
          : ((this._szStar = null), (this.size = wjcCore.asNumber(e, !0)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'minWidth', {
      get: function () {
        return this._szMin;
      },
      set: function (e) {
        e != this._szMin &&
          ((this._szMin = wjcCore.asNumber(e, !0, !0)),
          this.onPropertyChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'maxWidth', {
      get: function () {
        return this._szMax;
      },
      set: function (e) {
        e != this._szMax &&
          ((this._szMax = wjcCore.asNumber(e, !0, !0)),
          this.onPropertyChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'quickAutoSize', {
      get: function () {
        return this._quickSize;
      },
      set: function (e) {
        this._quickSize = wjcCore.asBoolean(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._getQuickAutoSize = function () {
      return (
        !!this.grid._getQuickAutoSize() &&
        (wjcCore.isBoolean(this._quickSize)
          ? this._quickSize
          : !this.isContentHtml && !this._getFlag(RowColFlags.HasTemplate))
      );
    }),
    Object.defineProperty(t.prototype, 'renderWidth', {
      get: function () {
        return this.renderSize;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'align', {
      get: function () {
        return this._align;
      },
      set: function (e) {
        this._align != e && ((this._align = e), this.onPropertyChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getAlignment = function () {
      var e = this._align;
      if (null == e && ((e = ''), !this._map))
        switch (this._type) {
          case wjcCore.DataType.Boolean:
            e = 'center';
            break;
          case wjcCore.DataType.Number:
            e = 'right';
        }
      return e;
    }),
    (t.prototype.getIsRequired = function () {
      return null != this._required
        ? this._required
        : this.dataType != wjcCore.DataType.String ||
            null != this.dataMap ||
            (this._mask && this._mask.length > 0);
    }),
    Object.defineProperty(t.prototype, 'header', {
      get: function () {
        return this._hdr ? this._hdr : this.binding;
      },
      set: function (e) {
        this._hdr != e && ((this._hdr = e), this.onPropertyChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dataMap', {
      get: function () {
        return this._map;
      },
      set: function (e) {
        this._map != e &&
          (this._map &&
            this._map.mapChanged.removeHandler(this.onPropertyChanged, this),
          wjcCore.isArray(e) && (e = new DataMap(e, null, null)),
          (this._map = wjcCore.asType(e, DataMap, !0)),
          this._map &&
            this._map.mapChanged.addHandler(this.onPropertyChanged, this),
          this.onPropertyChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'format', {
      get: function () {
        return this._fmt;
      },
      set: function (e) {
        this._fmt != e && ((this._fmt = e), this.onPropertyChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'allowSorting', {
      get: function () {
        return this._getFlag(RowColFlags.AllowSorting);
      },
      set: function (e) {
        this._setFlag(RowColFlags.AllowSorting, e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'currentSort', {
      get: function () {
        if (
          this.grid &&
          this.grid.collectionView &&
          this.grid.collectionView.canSort
        )
          for (
            var e = this.grid.collectionView.sortDescriptions, t = 0;
            t < e.length;
            t++
          )
            if (e[t].property == this._getBindingSort())
              return e[t].ascending ? '+' : '-';
        return null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'aggregate', {
      get: function () {
        return null != this._agg ? this._agg : wjcCore.Aggregate.None;
      },
      set: function (e) {
        e != this._agg &&
          ((this._agg = wjcCore.asEnum(e, wjcCore.Aggregate)),
          this.onPropertyChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._getBindingSort = function () {
      return this.sortMemberPath
        ? this.sortMemberPath
        : this.binding
        ? this.binding
        : null;
    }),
    (t._parseStarSize = function (e) {
      if (wjcCore.isString(e) && e.length > 0 && '*' == e[e.length - 1]) {
        var t = 1 == e.length ? 1 : 1 * e.substr(0, e.length - 1);
        if (t > 0 && !isNaN(t)) return t;
      }
      return null;
    }),
    (t._ctr = 0),
    t
  );
})(RowCol);
exports.Column = Column;
var Row = (function (e) {
  function t(t) {
    var o = e.call(this) || this;
    return (o._f = RowColFlags.ColumnDefault), (o._data = t), o;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'dataItem', {
      get: function () {
        return this._data;
      },
      set: function (e) {
        this._data = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'height', {
      get: function () {
        return this.size;
      },
      set: function (e) {
        this.size = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'renderHeight', {
      get: function () {
        return this.renderSize;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(RowCol);
exports.Row = Row;
var GroupRow = (function (e) {
  function t() {
    var t = e.call(this) || this;
    return (t._level = -1), (t.isReadOnly = !0), t;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'level', {
      get: function () {
        return this._level;
      },
      set: function (e) {
        wjcCore.asInt(e),
          e != this._level && ((this._level = e), this.onPropertyChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'hasChildren', {
      get: function () {
        if (null != this.grid && null != this._list) {
          this._list._update();
          var e =
              this.index < this._list.length - 1
                ? this._list[this.index + 1]
                : null,
            o = wjcCore.tryCast(e, t),
            i = wjcCore.tryCast(e, _NewRowTemplate);
          return null != e && null == i && (null == o || o.level > this.level);
        }
        return !0;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isCollapsed', {
      get: function () {
        return this._getFlag(RowColFlags.Collapsed);
      },
      set: function (e) {
        wjcCore.asBoolean(e),
          e != this.isCollapsed && null != this._list && this._setCollapsed(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getGroupHeader = function () {
      var e = this.grid,
        t = e.groupHeaderFormat
          ? e.groupHeaderFormat
          : wjcCore.culture.FlexGrid.groupHeaderFormat,
        o = wjcCore.tryCast(this.dataItem, wjcCore.CollectionViewGroup);
      if (o && t) {
        var i = o.groupDescription.propertyName,
          n = o.name,
          r = e.getColumn(i),
          l = this.isContentHtml;
        r &&
          ((l = l || r.isContentHtml),
          r.header && (i = r.header),
          r.dataMap
            ? (n = r.dataMap.getDisplayValue(n))
            : r.format && (n = wjcCore.Globalize.format(n, r.format)));
        var s = o.getAggregate(
          wjcCore.Aggregate.CntAll,
          null,
          e.collectionView
        );
        return wjcCore.format(t, {
          name: wjcCore.escapeHtml(i),
          value: l ? n : wjcCore.escapeHtml(n),
          level: o.level,
          count: s,
        });
      }
      return '';
    }),
    (t.prototype._setCollapsed = function (e) {
      var o,
        i = this,
        n = this.grid,
        r = n.rows,
        l = this.getCellRange(),
        s = new CellRangeEventArgs(n.cells, new CellRange(this.index, -1));
      n.onGroupCollapsedChanging(s),
        s.cancel ||
          (n.deferUpdate(function () {
            i._setFlag(RowColFlags.Collapsed, e);
            for (
              var n = l.topRow + 1;
              n <= l.bottomRow && n > -1 && n < r.length;
              n++
            )
              r[n]._setFlag(RowColFlags.ParentCollapsed, e),
                null != (o = wjcCore.tryCast(r[n], t)) &&
                  o.isCollapsed &&
                  (n = o.getCellRange().bottomRow);
          }),
          n.onGroupCollapsedChanged(s));
    }),
    (t.prototype.getCellRange = function () {
      for (
        var e = this._list, o = this.index, i = e.length - 1, n = o + 1;
        n <= i;
        n++
      ) {
        var r = wjcCore.tryCast(e[n], t);
        if (null != r && r.level <= this.level) {
          i = n - 1;
          break;
        }
      }
      return new CellRange(o, 0, i, this.grid.columns.length - 1);
    }),
    t
  );
})(Row);
exports.GroupRow = GroupRow;
var RowColCollection = (function (e) {
  function t(t, o) {
    var i = e.call(this) || this;
    return (
      (i._frozen = 0),
      (i._vlen = 0),
      (i._szDef = 28),
      (i._szTot = 0),
      (i._dirty = !1),
      (i._g = wjcCore.asType(t, FlexGrid)),
      (i._szDef = wjcCore.asNumber(o, !1, !0)),
      i
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'defaultSize', {
      get: function () {
        return this._szDef;
      },
      set: function (e) {
        this._szDef != e &&
          ((this._szDef = wjcCore.asNumber(e, !1, !0)),
          (this._dirty = !0),
          this._g.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'frozen', {
      get: function () {
        return this._frozen;
      },
      set: function (e) {
        e != this._frozen &&
          ((this._frozen = wjcCore.asNumber(e, !1, !0)),
          (this._dirty = !0),
          this._g.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.isFrozen = function (e) {
      return e < this.frozen;
    }),
    Object.defineProperty(t.prototype, 'minSize', {
      get: function () {
        return this._szMin;
      },
      set: function (e) {
        e != this._szMin &&
          ((this._szMin = wjcCore.asNumber(e, !0, !0)),
          (this._dirty = !0),
          this._g.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'maxSize', {
      get: function () {
        return this._szMax;
      },
      set: function (e) {
        e != this._szMax &&
          ((this._szMax = wjcCore.asNumber(e, !0, !0)),
          (this._dirty = !0),
          this._g.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getTotalSize = function () {
      return this._dirty && this._update(), this._szTot;
    }),
    Object.defineProperty(t.prototype, 'visibleLength', {
      get: function () {
        return this._dirty && this._update(), this._vlen;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getItemAt = function (e) {
      if ((this._dirty && this._update(), e <= 0 && this.length > 0)) return 0;
      e = Math.round(e);
      for (var t, o, i = this.length, n = 0, r = i - 1; n <= r; )
        if (((t = (n + r) >>> 1), (o = this[t])._pos > e && t > 0)) r = t - 1;
        else {
          if (!(o._pos + o.renderSize <= e && t < i - 1)) {
            for (; t > 0 && !this[t].visible; ) t--;
            for (; t < i - 1 && !this[t].visible; ) t++;
            return t;
          }
          n = t + 1;
        }
      return r;
    }),
    (t.prototype.getNextCell = function (e, t, o) {
      var i;
      switch (t) {
        case SelMove.Next:
          for (i = e + 1; i < this.length; i++)
            if (this[i].renderSize > 0) return i;
          break;
        case SelMove.Prev:
          for (i = e - 1; i >= 0; i--) if (this[i].renderSize > 0) return i;
          break;
        case SelMove.End:
          for (i = this.length - 1; i >= 0; i--)
            if (this[i].renderSize > 0) return i;
          break;
        case SelMove.Home:
          for (i = 0; i < this.length; i++)
            if (this[i].renderSize > 0) return i;
          break;
        case SelMove.NextPage:
          return (i = this.getItemAt(this[e].pos + o)) < 0
            ? this.getNextCell(e, SelMove.End, o)
            : i == e && i < this.length - 1
            ? i + 1
            : i;
        case SelMove.PrevPage:
          return (i = this.getItemAt(this[e].pos - o)) < 0
            ? this.getNextCell(e, SelMove.Home, o)
            : i == e && i > 0
            ? i - 1
            : i;
      }
      return e;
    }),
    (t.prototype.canMoveElement = function (e, t) {
      if (t == e) return !1;
      if (e < 0 || e >= this.length || t >= this.length) return !1;
      t < 0 && (t = this.length - 1);
      for (var o = Math.min(e, t), i = Math.max(e, t), n = o; n <= i; n++)
        if (!this[n].allowDragging) return !1;
      return !(this[t] instanceof _NewRowTemplate);
    }),
    (t.prototype.moveElement = function (e, t) {
      if (this.canMoveElement(e, t)) {
        var o = this[e];
        this.removeAt(e), t < 0 && (t = this.length), this.insert(t, o);
      }
    }),
    (t.prototype.onCollectionChanged = function (t) {
      void 0 === t && (t = wjcCore.NotifyCollectionChangedEventArgs.reset),
        (this._dirty = !0),
        this._g.invalidate(),
        e.prototype.onCollectionChanged.call(this, t);
    }),
    (t.prototype.push = function (t) {
      return (t._list = this), e.prototype.push.call(this, t);
    }),
    (t.prototype.splice = function (t, o, i) {
      return i && (i._list = this), e.prototype.splice.call(this, t, o, i);
    }),
    (t.prototype.beginUpdate = function () {
      this._update(), e.prototype.beginUpdate.call(this);
    }),
    (t.prototype._update = function () {
      if (this._dirty && !this.isUpdating) {
        this._dirty = !1;
        for (
          var e = 0, t = 0, o = void 0, i = void 0, n = 0;
          n < this.length;
          n++
        )
          ((i = this[n])._idx = n),
            (i._vidx = e),
            (i._list = this),
            (i._pos = t),
            (o = i.renderSize) > 0 && ((t += o), e++);
        return (this._vlen = e), (this._szTot = t), !0;
      }
      return !1;
    }),
    t
  );
})(wjcCore.ObservableArray);
exports.RowColCollection = RowColCollection;
var ColumnCollection = (function (e) {
  function t() {
    var t = (null !== e && e.apply(this, arguments)) || this;
    return (t._firstVisible = -1), t;
  }
  return (
    __extends(t, e),
    (t.prototype.getColumn = function (e) {
      var t = wjcCore.isNumber(e) ? e : this.indexOf(e);
      return t > -1 ? this[t] : null;
    }),
    (t.prototype.indexOf = function (t) {
      if (t instanceof Column) return e.prototype.indexOf.call(this, t);
      for (o = 0; o < this.length; o++) if (this[o].name == t) return o;
      for (var o = 0; o < this.length; o++) if (this[o].binding == t) return o;
      return -1;
    }),
    Object.defineProperty(t.prototype, 'firstVisibleIndex', {
      get: function () {
        return this._dirty && this._update(), this._firstVisible;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._update = function () {
      if (e.prototype._update.call(this)) {
        this._firstVisible = -1;
        for (var t = 0; t < this.length; t++)
          if (this[t].visible) {
            this._firstVisible = t;
            break;
          }
        return !0;
      }
      return !1;
    }),
    (t.prototype._updateStarSizes = function (e) {
      for (var t, o = 0, i = 0; i < this.length; i++)
        (r = this[i]).isVisible &&
          (r._szStar
            ? ((o += Column._parseStarSize(r._szStar)), (t = r))
            : (e -= r.renderWidth));
      if (t) {
        for (var n = e, i = 0; i < this.length; i++) {
          var r = this[i];
          r.isVisible &&
            r._szStar &&
            (r == t && n > 0
              ? (r._sz = n)
              : ((r._sz = Math.max(
                  0,
                  Math.round((Column._parseStarSize(r._szStar) / o) * e)
                )),
                (n -= r.renderWidth)));
        }
        return (this._dirty = !0), this._update(), !0;
      }
      return !1;
    }),
    t
  );
})(RowColCollection);
exports.ColumnCollection = ColumnCollection;
var RowCollection = (function (e) {
  function t() {
    var t = (null !== e && e.apply(this, arguments)) || this;
    return (t._maxLevel = -1), t;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'maxGroupLevel', {
      get: function () {
        return this._dirty && this._update(), this._maxLevel;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._update = function () {
      if (e.prototype._update.call(this)) {
        this._maxLevel = -1;
        for (var t = 0; t < this.length; t++) {
          var o = wjcCore.tryCast(this[t], GroupRow);
          o && o.level > this._maxLevel && (this._maxLevel = o.level);
        }
        return !0;
      }
      return !1;
    }),
    t
  );
})(RowColCollection);
exports.RowCollection = RowCollection;
var HitTestInfo = (function () {
  function e(t, o) {
    (this._row = -1), (this._col = -1), (this._edge = 0);
    var i;
    if (t instanceof Element)
      (x = (E = wjcCore.closest(t, '.wj-cell'))
        ? E[GridPanel._INDEX_KEY]
        : null) &&
        ((this._row = x.row),
        (this._col = x.col),
        (this._rng = x.rng),
        (this._p = x.panel),
        (this._g = x.panel.grid));
    else {
      if (t instanceof FlexGrid) i = this._g = t;
      else {
        if (!(t instanceof GridPanel))
          throw 'First parameter should be a FlexGrid or GridPanel.';
        (this._p = t), (i = this._g = this._p.grid);
      }
      var n;
      o instanceof MouseEvent &&
        ((n = o), 'mousedown' == o.type && (i._rcBounds = null)),
        (o = wjcCore.mouseToPage(o)),
        (this._pt = o.clone());
      var r = i.controlRect,
        l = i._szClient,
        s = i.topLeftCells,
        a = i._eTL,
        c = i.headersVisibility,
        h = HeadersVisibility,
        d = c & h.Row ? s.columns.getTotalSize() : 0,
        u = c & h.Column ? s.rows.getTotalSize() : 0,
        g = c & h.Column ? u + a.offsetTop : 0,
        p = i._eBL,
        f = p.offsetHeight;
      if (
        ((o.x -= r.left),
        (o.y -= r.top),
        this._g.rightToLeft && (o.x = r.width - o.x),
        !this._p &&
          o.x >= 0 &&
          o.y >= a.offsetTop &&
          l &&
          o.x <= l.width + d &&
          o.y <= l.height + g &&
          (o.y < g
            ? (this._p = o.x < d ? i.topLeftCells : i.columnHeaders)
            : o.y < p.offsetTop
            ? (this._p = o.x < d ? i.rowHeaders : i.cells)
            : (this._p = o.x < d ? i.bottomLeftCells : i.columnFooters)),
        null != this._p)
      ) {
        var w = this._p.rows,
          _ = this._p.columns,
          C = this._p.cellType,
          m = CellType,
          y = this._p._getFrozenPos(),
          v =
            C == m.TopLeft || C == m.ColumnHeader
              ? u
              : C == m.BottomLeft || C == m.ColumnFooter
              ? f
              : w.getTotalSize(),
          b =
            C == m.TopLeft || C == m.BottomLeft || C == m.RowHeader
              ? d
              : _.getTotalSize();
        C == m.RowHeader || C == m.Cell
          ? ((o.y -= u),
            (o.y > y.y || y.y <= 0) &&
              ((o.y -= i._ptScrl.y), (o.y += this._p._getOffsetY())))
          : (C != m.BottomLeft && C != m.ColumnFooter) || (o.y -= p.offsetTop),
          (C != m.ColumnHeader && C != m.Cell && C != m.ColumnFooter) ||
            ((o.x -= d), (o.x > y.x || y.x <= 0) && (o.x -= i._ptScrl.x)),
          (C != m.ColumnHeader && C != m.TopLeft) || (o.y -= g - u),
          (this._edge = 0);
        var R = e._SZEDGE[this._g.isTouching ? 1 : 0];
        if (
          (this._g.isTouching && ((R = e._SZEDGE[1]), (o.x -= R / 2)),
          (this._row = o.y > v ? -1 : w.getItemAt(o.y)),
          (this._col = o.x > b ? -1 : _.getItemAt(o.x)),
          this._row < 0 || this._col < 0)
        )
          return void (this._p = null);
        if (this._col > -1) {
          var j = _[this._col];
          o.x - j.pos <= R && (this._edge |= 1),
            j.pos + j.renderSize - o.x <= R && (this._edge |= 4);
        }
        if (this._row > -1) {
          var S = w[this._row];
          o.y - S.pos <= R && (this._edge |= 2),
            S.pos + S.renderSize - o.y <= R && (this._edge |= 8);
        }
      }
      if (!(8 & this._edge) && n instanceof MouseEvent) {
        var E = wjcCore.closest(n.target, '.wj-cell'),
          x = E ? E[GridPanel._INDEX_KEY] : null;
        x &&
          !x.rng &&
          x.panel == this._p &&
          this._row != x.row &&
          (this._row = x.row);
      }
    }
  }
  return (
    Object.defineProperty(e.prototype, 'point', {
      get: function () {
        return this._pt;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'cellType', {
      get: function () {
        return this._p ? this._p.cellType : CellType.None;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'panel', {
      get: function () {
        return this._p;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'grid', {
      get: function () {
        return this._p ? this._p.grid : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'row', {
      get: function () {
        return this._row;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'col', {
      get: function () {
        return this._col;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'range', {
      get: function () {
        return (
          this._rng || (this._rng = new CellRange(this._row, this._col)),
          this._rng
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'edgeLeft', {
      get: function () {
        return 0 != (1 & this._edge);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'edgeTop', {
      get: function () {
        return 0 != (2 & this._edge);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'edgeRight', {
      get: function () {
        return 0 != (4 & this._edge);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'edgeBottom', {
      get: function () {
        return 0 != (8 & this._edge);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e._SZEDGE = [5, 30]),
    e
  );
})();
exports.HitTestInfo = HitTestInfo;
var AllowMerging;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Cells = 1)] = 'Cells'),
    (e[(e.ColumnHeaders = 2)] = 'ColumnHeaders'),
    (e[(e.RowHeaders = 4)] = 'RowHeaders'),
    (e[(e.AllHeaders = 6)] = 'AllHeaders'),
    (e[(e.All = 7)] = 'All');
})((AllowMerging = exports.AllowMerging || (exports.AllowMerging = {})));
var MergeManager = (function () {
  function e(e) {
    this._g = e;
  }
  return (
    (e.prototype.getMergedRange = function (e, t, o, i) {
      void 0 === i && (i = !0);
      var n,
        r,
        l = e.cellType,
        s = e.columns,
        a = e.rows,
        c = a[t],
        h = s[o];
      if (c instanceof _NewRowTemplate) return null;
      if (
        c instanceof GroupRow &&
        c.dataItem instanceof wjcCore.CollectionViewGroup
      ) {
        if (
          ((n = new CellRange(t, o)), h.aggregate == wjcCore.Aggregate.None)
        ) {
          for (
            ;
            n.col > 0 &&
            s[n.col - 1].aggregate == wjcCore.Aggregate.None &&
            n.col != s.frozen;

          )
            n.col--;
          for (
            ;
            n.col2 < s.length - 1 &&
            s[n.col2 + 1].aggregate == wjcCore.Aggregate.None &&
            n.col2 + 1 != s.frozen;

          )
            n.col2++;
        }
        for (; n.col < o && !s[n.col].visible; ) n.col++;
        return n.isSingleCell ? null : n;
      }
      var d = !1;
      switch (this._g.allowMerging) {
        case AllowMerging.None:
          d = !0;
          break;
        case AllowMerging.Cells:
          d = l != CellType.Cell;
          break;
        case AllowMerging.ColumnHeaders:
          d = l != CellType.ColumnHeader && l != CellType.TopLeft;
          break;
        case AllowMerging.RowHeaders:
          d = l != CellType.RowHeader && l != CellType.TopLeft;
          break;
        case AllowMerging.AllHeaders:
          d = l == CellType.Cell;
      }
      if (d) return null;
      if (s[o].allowMerging) {
        n = new CellRange(t, o);
        var u = 0,
          g = a.length - 1;
        t >= a.frozen
          ? !i ||
            (l != CellType.Cell && l != CellType.RowHeader) ||
            ((u = (r = e._getViewRange()).topRow), (g = r.bottomRow))
          : (g = a.frozen - 1);
        for (var p = t - 1; p >= u && this._mergeCell(e, p, o, t, o); p--)
          n.row = p;
        for (var f = t + 1; f <= g && this._mergeCell(e, t, o, f, o); f++)
          n.row2 = f;
        for (; n.row < t && !a[n.row].visible; ) n.row++;
        if (!n.isSingleCell) return n;
      }
      if (a[t].allowMerging) {
        n = new CellRange(t, o);
        var w = 0,
          _ = s.length - 1;
        o >= s.frozen
          ? !i ||
            (l != CellType.Cell && l != CellType.ColumnHeader) ||
            ((w = (r = e._getViewRange()).leftCol), (_ = r.rightCol))
          : (_ = s.frozen - 1);
        for (var C = o - 1; C >= w && this._mergeCell(e, t, C, t, o); C--)
          n.col = C;
        for (var m = o + 1; m <= _ && this._mergeCell(e, t, o, t, m); m++)
          n.col2 = m;
        for (; n.col < o && !s[n.col].visible; ) n.col++;
        if (!n.isSingleCell) return n;
      }
      return null;
    }),
    (e.prototype._mergeCell = function (e, t, o, i, n) {
      var r = e.rows[t],
        l = e.rows[i];
      if (
        r instanceof GroupRow ||
        r instanceof _NewRowTemplate ||
        l instanceof GroupRow ||
        l instanceof _NewRowTemplate
      )
        return !1;
      if (t != i && e.rows.isFrozen(t) != e.rows.isFrozen(i)) return !1;
      if (o != n && e.columns.isFrozen(o) != e.columns.isFrozen(n)) return !1;
      if (t != i) {
        if (
          o > 0 &&
          ((r.allowMerging && this._mergeCell(e, t, o - 1, t, o)) ||
            (l.allowMerging && this._mergeCell(e, i, o - 1, i, o)))
        )
          return !1;
        if (
          n < e.columns.length - 1 &&
          ((r.allowMerging && this._mergeCell(e, t, n, t, n + 1)) ||
            (l.allowMerging && this._mergeCell(e, i, n, i, n + 1)))
        )
          return !1;
      }
      return e.getCellData(t, o, !0) == e.getCellData(i, n, !0);
    }),
    e
  );
})();
exports.MergeManager = MergeManager;
var DataMap = (function () {
  function e(e, t, o) {
    if (
      ((this.mapChanged = new wjcCore.Event()), wjcCore.isArray(e) && !t && !o)
    ) {
      for (var i = [], n = 0; n < e.length; n++) i.push({ value: e[n] });
      (e = i), (t = o = 'value');
    }
    (this._cv = wjcCore.asCollectionView(e)),
      (this._keyPath = wjcCore.asString(t, !1)),
      (this._displayPath = wjcCore.asString(o, !1)),
      this._cv.collectionChanged.addHandler(this.onMapChanged, this);
  }
  return (
    Object.defineProperty(e.prototype, 'sortByDisplayValues', {
      get: function () {
        return 1 != this._sortByKey;
      },
      set: function (e) {
        this._sortByKey = !wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'collectionView', {
      get: function () {
        return this._cv;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'selectedValuePath', {
      get: function () {
        return this._keyPath;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'displayMemberPath', {
      get: function () {
        return this._displayPath;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getKeyValue = function (e) {
      var t = this._indexOf(e, this._displayPath, !1);
      return t > -1 ? this._cv.sourceCollection[t][this._keyPath] : null;
    }),
    (e.prototype.getDisplayValue = function (e) {
      if (!this._hash) {
        this._hash = {};
        var t = this._cv.sourceCollection;
        if (t && this._keyPath && this._displayPath)
          for (var o = t.length - 1; o >= 0; o--) {
            var i = t[o],
              n = i[this._keyPath],
              r = i[this._displayPath];
            this._hash[n] = r;
          }
      }
      var l = this._hash[e];
      return null != l ? l : e;
    }),
    (e.prototype.getDisplayValues = function (e) {
      var t = [];
      if (this._cv && this._displayPath)
        for (var o = this._cv.items, i = 0; i < o.length; i++)
          t.push(o[i][this._displayPath]);
      return t;
    }),
    (e.prototype.getKeyValues = function () {
      var e = [];
      if (this._cv && this._keyPath)
        for (var t = this._cv.items, o = 0; o < t.length; o++)
          e.push(t[o][this._keyPath]);
      return e;
    }),
    Object.defineProperty(e.prototype, 'isEditable', {
      get: function () {
        return this._editable;
      },
      set: function (e) {
        this._editable = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onMapChanged = function (e) {
      (this._hash = null), this.mapChanged.raise(this, e);
    }),
    (e.prototype._indexOf = function (e, t, o) {
      var i = -1,
        n = -1;
      if (this._cv && t)
        for (
          var r = null != e ? e.toString() : '',
            l = o ? r : r.toLowerCase(),
            s = this._cv.sourceCollection,
            a = 0;
          a < s.length;
          a++
        ) {
          var c = s[a],
            h = c[t];
          if (
            (h == e
              ? (i = a)
              : o || h.length != l.length || h.toLowerCase() != l
              ? null != h && h.toString() == r && (i = a)
              : (i = a),
            i == a)
          ) {
            if (!this._cv.filter || this._cv.filter(c)) return i;
            n < 0 && (n = i);
          }
        }
      return n;
    }),
    e
  );
})();
exports.DataMap = DataMap;
var SelectionMode;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Cell = 1)] = 'Cell'),
    (e[(e.CellRange = 2)] = 'CellRange'),
    (e[(e.Row = 3)] = 'Row'),
    (e[(e.RowRange = 4)] = 'RowRange'),
    (e[(e.ListBox = 5)] = 'ListBox');
})((SelectionMode = exports.SelectionMode || (exports.SelectionMode = {})));
var SelectedState;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Selected = 1)] = 'Selected'),
    (e[(e.Cursor = 2)] = 'Cursor');
})((SelectedState = exports.SelectedState || (exports.SelectedState = {})));
var SelMove;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Next = 1)] = 'Next'),
    (e[(e.Prev = 2)] = 'Prev'),
    (e[(e.NextPage = 3)] = 'NextPage'),
    (e[(e.PrevPage = 4)] = 'PrevPage'),
    (e[(e.Home = 5)] = 'Home'),
    (e[(e.End = 6)] = 'End'),
    (e[(e.NextCell = 7)] = 'NextCell'),
    (e[(e.PrevCell = 8)] = 'PrevCell');
})((SelMove = exports.SelMove || (exports.SelMove = {})));
var _SelectionHandler = (function () {
  function e(e) {
    (this._sel = new CellRange(0, 0)),
      (this._mode = SelectionMode.CellRange),
      (this._g = e);
  }
  return (
    Object.defineProperty(e.prototype, 'selectionMode', {
      get: function () {
        return this._mode;
      },
      set: function (e) {
        if (e != this._mode) {
          var t = SelectionMode;
          if (e == t.ListBox || this._mode == t.ListBox)
            for (var o = this._g.rows, i = 0; i < o.length; i++) {
              var n = o[i],
                r = e == SelectionMode.ListBox && this._sel.containsRow(i);
              n._setFlag(RowColFlags.Selected, r, !0);
            }
          switch (e) {
            case t.None:
              this._sel.setRange(-1, -1);
              break;
            case t.Cell:
              (this._sel.row2 = this._sel.row),
                (this._sel.col2 = this._sel.col);
              break;
            case t.Row:
              this._sel.row2 = this._sel.row;
          }
          (this._mode = e), this._g.invalidate();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'selection', {
      get: function () {
        return this._sel;
      },
      set: function (e) {
        this.select(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.select = function (e, t) {
      void 0 === t && (t = !0),
        wjcCore.isNumber(e) &&
          wjcCore.isNumber(t) &&
          ((e = new CellRange(e, t)), (t = !0)),
        (e = wjcCore.asType(e, CellRange));
      var o = this._g,
        i = this._sel,
        n = e,
        r = !1,
        l = SelectionMode;
      switch (o.selectionMode) {
        case l.Cell:
          (e.row2 = e.row), (e.col2 = e.col);
          break;
        case l.Row:
          e.row2 = e.row;
          break;
        case l.ListBox:
          r = !0;
      }
      var s = n.equals(i);
      if ((r && n.row > -1 && !o.rows[n.row].isSelected && (s = !1), s))
        t && o.scrollIntoView(n.row, n.col);
      else {
        var a = new CellRangeEventArgs(o.cells, n);
        if (o.onSelectionChanging(a)) {
          if (r && (n.row != i.row || n.rowSpan > 1 || i.rowSpan > 1)) {
            for (var c = 0; c < o.rows.length; c++)
              o.rows[c]._setFlag(RowColFlags.Selected, n.containsRow(c), !0);
            o.refreshCells(!1, !0, !0);
          }
          if (
            ((n.row = Math.min(n.row, o.rows.length - 1)),
            (n.row2 = Math.min(n.row2, o.rows.length - 1)),
            (this._sel = n),
            o.refreshCells(!1, !0, !0),
            t && o.scrollIntoView(n.row, n.col),
            o.collectionView)
          ) {
            var h = o._getCvIndex(n.row);
            o.collectionView.moveCurrentToPosition(h);
          }
          o.onSelectionChanged(a);
        }
      }
    }),
    (e.prototype.moveSelection = function (e, t, o) {
      var i,
        n,
        r = this._g,
        l = r.rows,
        s = r.columns,
        a = this._getReferenceCell(e, t, o),
        c = Math.max(0, r._szClient.height - r.columnHeaders.height);
      if (t == SelMove.NextCell)
        (n = s.getNextCell(a.col, SelMove.Next, c)),
          (i = a.row),
          n == a.col &&
            (i = l.getNextCell(i, SelMove.Next, c)) > a.row &&
            ((n = s.getNextCell(0, SelMove.Next, c)),
            (n = s.getNextCell(n, SelMove.Prev, c))),
          r.select(i, n);
      else if (t == SelMove.PrevCell)
        (n = s.getNextCell(a.col, SelMove.Prev, c)),
          (i = a.row),
          n == a.col &&
            (i = l.getNextCell(i, SelMove.Prev, c)) < a.row &&
            ((n = s.getNextCell(s.length - 1, SelMove.Prev, c)),
            (n = s.getNextCell(n, SelMove.Next, c))),
          r.select(i, n);
      else if (
        ((i = l.getNextCell(a.row, e, c)), (n = s.getNextCell(a.col, t, c)), o)
      ) {
        var h = r._selHdl._sel;
        r.select(new CellRange(i, n, h.row2, h.col2));
      } else r.select(i, n);
    }),
    (e.prototype._getReferenceCell = function (e, t, o) {
      var i = this._g,
        n = i._selHdl._sel,
        r = i.getMergedRange(i.cells, n.row, n.col);
      if (!r || r.isSingleCell) return n;
      switch (((r = r.clone()), e)) {
        case SelMove.Next:
        case SelMove.NextCell:
          r.row = r.bottomRow;
          break;
        case SelMove.None:
          r.row = n.row;
      }
      switch (t) {
        case SelMove.Next:
        case SelMove.NextCell:
          r.col = r.rightCol;
          break;
        case SelMove.None:
          r.col = n.col;
      }
      return r;
    }),
    (e.prototype._adjustSelection = function (e) {
      switch (this._mode) {
        case SelectionMode.Cell:
          return new CellRange(e.row, e.col, e.row, e.col);
        case SelectionMode.Row:
          return new CellRange(e.row, 0, e.row, this._g.columns.length - 1);
        case SelectionMode.RowRange:
        case SelectionMode.ListBox:
          return new CellRange(e.row, 0, e.row2, this._g.columns.length - 1);
      }
      return e;
    }),
    e
  );
})();
exports._SelectionHandler = _SelectionHandler;
var KeyAction;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.MoveDown = 1)] = 'MoveDown'),
    (e[(e.MoveAcross = 2)] = 'MoveAcross'),
    (e[(e.Cycle = 3)] = 'Cycle'),
    (e[(e.CycleOut = 4)] = 'CycleOut');
})((KeyAction = exports.KeyAction || (exports.KeyAction = {})));
var _KeyboardHandler = (function () {
  function e(e) {
    (this._kaTab = KeyAction.None),
      (this._kaEnter = KeyAction.MoveDown),
      (this._g = e);
    var t = e.hostElement;
    e.addEventListener(t, 'keypress', this._keypress.bind(this)),
      e.addEventListener(t, 'keydown', this._keydown.bind(this));
  }
  return (
    (e.prototype._keydown = function (e) {
      var t = this._g,
        o = t.selection,
        i = e.ctrlKey || e.metaKey,
        n = e.shiftKey,
        r = (e.target, !0);
      if (
        ((this._altDown = !1),
        !t._wantsInput(e.target) &&
          t.isRangeValid(o) &&
          !e.defaultPrevented &&
          (!t.activeEditor || !t._edtHdl._keydown(e)))
      ) {
        var l = wjcCore.tryCast(t.rows[o.row], GroupRow),
          s = t.editableCollectionView,
          a = e.keyCode;
        if (t.autoClipboard) {
          if (i && (67 == a || 45 == a)) {
            var c = new CellRangeEventArgs(t.cells, o);
            if (t.onCopying(c)) {
              var h = t.getClipString() + '\r\n';
              wjcCore.Clipboard.copy(h), t.onCopied(c);
            }
            return void e.stopPropagation();
          }
          if ((i && 86 == a) || (n && 45 == a)) {
            if (!t.isReadOnly) {
              var d = new CellRangeEventArgs(t.cells, o);
              t.onPasting(d) &&
                wjcCore.Clipboard.paste(function (e) {
                  t.setClipString(e), t.onPasted(d);
                });
            }
            return void e.stopPropagation();
          }
        }
        if (t.rightToLeft)
          switch (a) {
            case wjcCore.Key.Left:
              a = wjcCore.Key.Right;
              break;
            case wjcCore.Key.Right:
              a = wjcCore.Key.Left;
          }
        var u = SelMove,
          g = SelectionMode;
        switch (a) {
          case wjcCore.Key.Space:
            if (n && o.isValid)
              switch (t.selectionMode) {
                case g.CellRange:
                case g.Row:
                case g.RowRange:
                case g.ListBox:
                  t.select(
                    new CellRange(o.row, 0, o.row, t.columns.length - 1)
                  );
              }
            else if (i && o.isValid)
              switch (t.selectionMode) {
                case g.CellRange:
                  t.select(new CellRange(0, o.col, t.rows.length - 1, o.col));
              }
            else
              (r = this._startEditing(!0, e)) &&
                setTimeout(function () {
                  var e = t.activeEditor;
                  e &&
                    (e.disabled || e.readOnly
                      ? t.finishEditing()
                      : 'checkbox' == e.type
                      ? ((e.checked = !e.checked), t.finishEditing())
                      : wjcCore.setSelectionRange(e, e.value.length));
                });
            break;
          case 65:
            if (i)
              switch (t.selectionMode) {
                case g.CellRange:
                case g.Row:
                case g.RowRange:
                case g.ListBox:
                  t.select(
                    new CellRange(0, 0, t.rows.length - 1, t.columns.length - 1)
                  );
              }
            else r = !1;
            break;
          case wjcCore.Key.Left:
            i || e.altKey
              ? (r = !1)
              : o.isValid &&
                0 == o.col &&
                null != l &&
                !l.isCollapsed &&
                l.hasChildren
              ? (l.isCollapsed = !0)
              : this._moveSel(u.None, i ? u.Home : u.Prev, n);
            break;
          case wjcCore.Key.Right:
            i || e.altKey
              ? (r = !1)
              : o.isValid && 0 == o.col && null != l && l.isCollapsed
              ? (l.isCollapsed = !1)
              : this._moveSel(u.None, i ? u.End : u.Next, n);
            break;
          case wjcCore.Key.Up:
            i
              ? (r = !1)
              : ((this._altDown = e.altKey),
                e.altKey
                  ? (r = t._edtHdl._toggleListBox(e))
                  : this._moveSel(u.Prev, u.None, n));
            break;
          case wjcCore.Key.Down:
            i
              ? (r = !1)
              : ((this._altDown = e.altKey),
                e.altKey
                  ? (r = t._edtHdl._toggleListBox(e))
                  : this._moveSel(u.Next, u.None, n));
            break;
          case wjcCore.Key.PageUp:
            (this._altDown = e.altKey),
              this._moveSel(e.altKey ? u.Home : u.PrevPage, u.None, n);
            break;
          case wjcCore.Key.PageDown:
            (this._altDown = e.altKey),
              this._moveSel(e.altKey ? u.End : u.NextPage, u.None, n);
            break;
          case wjcCore.Key.Home:
            this._moveSel(i ? u.Home : u.None, u.Home, n);
            break;
          case wjcCore.Key.End:
            this._moveSel(i ? u.End : u.None, u.End, n);
            break;
          case wjcCore.Key.Tab:
            r = this._performKeyAction(t.keyActionTab, n);
            break;
          case wjcCore.Key.Enter:
            (r = this._performKeyAction(t.keyActionEnter, n)),
              !n &&
                s &&
                null != s.currentEditItem &&
                t._edtHdl._commitRowEdits();
            break;
          case wjcCore.Key.Escape:
            if (((r = !1), s && (s.currentAddItem || s.currentEditItem))) {
              var p = new CellRangeEventArgs(t.cells, t.selection);
              (p.cancel = !0),
                t.onRowEditEnding(p),
                s.currentAddItem && s.cancelNew(),
                s.currentEditItem && s.cancelEdit(),
                t.onRowEditEnded(p),
                (r = !0);
            }
            t._mouseHdl.resetMouseState();
            break;
          case wjcCore.Key.Delete:
          case wjcCore.Key.Back:
            r = this._deleteSel(e);
            break;
          case wjcCore.Key.F2:
            r = this._startEditing(!0, e);
            break;
          case wjcCore.Key.F4:
            r = t._edtHdl._toggleListBox(e);
            break;
          default:
            r = !1;
        }
        r &&
          (t.containsFocus() || t.focus(),
          e.preventDefault(),
          e.stopPropagation());
      }
    }),
    (e.prototype._performKeyAction = function (e, t) {
      var o = KeyAction,
        i = SelMove;
      switch (e) {
        case o.MoveDown:
          return this._moveSel(t ? i.Prev : i.Next, i.None, !1), !0;
        case o.MoveAcross:
          return this._moveSel(i.None, t ? i.Prev : i.Next, !1), !0;
        case o.Cycle:
          return this._moveSel(i.None, t ? i.PrevCell : i.NextCell, !1), !0;
        case o.CycleOut:
          var n = this._g.selection;
          return (
            this._moveSel(i.None, t ? i.PrevCell : i.NextCell, !1),
            !n.equals(this._g.selection)
          );
      }
      return !1;
    }),
    (e.prototype._keypress = function (e) {
      var t = this._g;
      if (!t._wantsInput(e.target) && !e.defaultPrevented)
        if (this._altDown) e.preventDefault();
        else if (t.activeEditor) t._edtHdl._keypress(e);
        else if (
          e.charCode > wjcCore.Key.Space &&
          this._startEditing(!1, e) &&
          t.activeEditor
        ) {
          var o = wjcCore.getActiveElement();
          if (o instanceof HTMLInputElement && 'checkbox' != o.type) {
            var i = t._selHdl.selection,
              n = t.getCellData(i.row, i.col, !0),
              r = t.getCellData(i.row, i.col, !1);
            (o.value = String.fromCharCode(e.charCode)),
              wjcCore.isNumber(r) && n.indexOf('%') > -1 && (o.value += '%'),
              wjcCore.setSelectionRange(o, 1),
              o.dispatchEvent(t._edtHdl._evtInput),
              t._edtHdl._keypress(e),
              e.preventDefault();
          }
        }
    }),
    (e.prototype._moveSel = function (e, t, o) {
      this._g.selectionMode != SelectionMode.None &&
        this._g._selHdl.moveSelection(e, t, o);
    }),
    (e.prototype._deleteSel = function (e) {
      var t = this._g,
        o = t.editableCollectionView,
        i = t.selection,
        n = t.rows,
        r = [],
        l = new CellRange(),
        s = new CellEditEndingEventArgs(t.cells, l, e),
        a = SelectionMode;
      if (
        t.allowDelete &&
        !t.isReadOnly &&
        (null == o || (o.canRemove && !o.isAddingNew && !o.isEditingItem))
      )
        switch (t.selectionMode) {
          case a.CellRange:
            if (0 == i.leftCol && i.rightCol == t.columns.length - 1)
              for (c = i.topRow; c > -1 && c <= i.bottomRow; c++) r.push(n[c]);
            break;
          case a.ListBox:
            for (c = 0; c < n.length; c++) n[c].isSelected && r.push(n[c]);
            break;
          case a.Row:
            i.topRow > -1 && r.push(n[i.topRow]);
            break;
          case a.RowRange:
            for (var c = i.topRow; c > -1 && c <= i.bottomRow; c++)
              r.push(n[c]);
        }
      if (r.length > 0) {
        if (
          (t.deferUpdate(function () {
            o && o.beginUpdate();
            for (var e = r.length - 1; e >= 0; e--) {
              var i = r[e];
              l.setRange(i.index, -1),
                t.onDeletingRow(s) &&
                  (o && i.dataItem
                    ? o.remove(i.dataItem)
                    : t.rows.removeAt(i.index),
                  t.onDeletedRow(s));
            }
            o && o.endUpdate();
          }),
          t.selectionMode == a.ListBox)
        ) {
          var h = t.selection.row;
          h > -1 && h < t.rows.length && (t.rows[h].isSelected = !0);
        }
        return (
          t.childItemsPath && t.collectionView && t.collectionView.refresh(), !0
        );
      }
      if (!t.isReadOnly && 0 == r.length) {
        var d = !1,
          u = t.scrollPosition;
        return (
          t.deferUpdate(function () {
            for (var e = i.topRow; e <= i.bottomRow; e++) {
              var n = t.rows[e];
              if (!n.isReadOnly)
                for (var r = i.leftCol; r <= i.rightCol; r++) {
                  var a = t._getBindingColumn(t.cells, e, t.columns[r]);
                  a.getIsRequired() ||
                    a.isReadOnly ||
                    (t.getCellData(e, r, !0) &&
                      (l.setRange(e, r),
                      (s.cancel = !1),
                      t.onBeginningEdit(s) &&
                        (o &&
                          (d || ((d = !0), o.beginUpdate()),
                          o.editItem(n.dataItem),
                          (t._edtHdl._edItem = o.currentEditItem)),
                        t.setCellData(e, r, '', !0, !1),
                        t.onCellEditEnding(s),
                        t.onCellEditEnded(s))));
                }
            }
            (t.selection = i), (t.scrollPosition = u), d && o.endUpdate();
          }),
          !0
        );
      }
      return !1;
    }),
    (e.prototype._startEditing = function (e, t, o, i) {
      return this._g._edtHdl.startEditing(e, o, i, !0, t);
    }),
    e
  );
})();
exports._KeyboardHandler = _KeyboardHandler;
var _AR_ALLCELLS = 4,
  _WJC_DRAGSRC = 'wj-state-dragsrc',
  AllowResizing;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Columns = 1)] = 'Columns'),
    (e[(e.Rows = 2)] = 'Rows'),
    (e[(e.Both = 3)] = 'Both'),
    (e[(e.ColumnsAllCells = e.Columns | _AR_ALLCELLS)] = 'ColumnsAllCells'),
    (e[(e.RowsAllCells = e.Rows | _AR_ALLCELLS)] = 'RowsAllCells'),
    (e[(e.BothAllCells = e.Both | _AR_ALLCELLS)] = 'BothAllCells');
})((AllowResizing = exports.AllowResizing || (exports.AllowResizing = {})));
var AutoSizeMode;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Headers = 1)] = 'Headers'),
    (e[(e.Cells = 2)] = 'Cells'),
    (e[(e.Both = 3)] = 'Both');
})((AutoSizeMode = exports.AutoSizeMode || (exports.AutoSizeMode = {})));
var AllowDragging;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Columns = 1)] = 'Columns'),
    (e[(e.Rows = 2)] = 'Rows'),
    (e[(e.Both = 3)] = 'Both');
})((AllowDragging = exports.AllowDragging || (exports.AllowDragging = {})));
var _MouseHandler = (function () {
  function e(e) {
    var t = this;
    this._tsLast = 0;
    var o = e.hostElement;
    (this._g = e),
      (this._dvMarker = wjcCore.createElement(
        '<div class="wj-marker">&nbsp;</div>'
      )),
      e.addEventListener(o, 'mousedown', function (o) {
        if (((e._rcBounds = null), !o.defaultPrevented && 0 == o.button)) {
          var r = o.target;
          if (!e.containsFocus()) {
            var l = r instanceof HTMLElement && r.tabIndex > -1 ? r : e._eFocus;
            e._setFocusNoScroll(l);
          }
          if (
            (setTimeout(function () {
              o.defaultPrevented || e.focus();
            }),
            wjcCore.closest(o.target, '.wj-flexgrid') != e.hostElement ||
              (!e.activeEditor && e._isInputElement(r)))
          ) {
            var s = e.hitTest(o);
            switch (s.cellType) {
              case CellType.Cell:
                e.select(s.range);
                break;
              case CellType.ColumnHeader:
              case CellType.ColumnFooter:
                e.scrollIntoView(-1, s.col);
                break;
              case CellType.RowHeader:
                e.scrollIntoView(s.row, -1);
            }
            return;
          }
          e.removeEventListener(document, 'mousemove'),
            e.removeEventListener(document, 'mouseup'),
            e.addEventListener(document, 'mousemove', i),
            e.addEventListener(document, 'mouseup', n),
            (t._isDown = !0),
            t._mousedown(o);
        }
      });
    var i = function (e) {
        t._mousemove(e);
      },
      n = function (o) {
        (t._isDown = !1),
          e.removeEventListener(document, 'mousemove'),
          e.removeEventListener(document, 'mouseup'),
          t._mouseup(o);
      };
    e.addEventListener(o, 'mouseup', function (e) {
      t._tsLast = Date.now();
    }),
      e.addEventListener(o, 'mouseenter', function (t) {
        e._rcBounds = null;
      }),
      e.addEventListener(o, 'mousemove', this._hover.bind(this)),
      e.addEventListener(o, 'dblclick', this._dblclick.bind(this)),
      e.addEventListener(o, 'click', this._click.bind(this)),
      e.addEventListener(o, 'selectstart', function (t) {
        e._isInputElement(t.target) || t.preventDefault();
      }),
      e.addEventListener(o, 'wheel', function (t) {
        var o = e.cells.hostElement.parentElement,
          i = t.deltaY;
        if (
          i &&
          !t.ctrlKey &&
          !t.metaKey &&
          o.scrollHeight > o.offsetHeight &&
          wjcCore.closest(t.target, '.wj-flexgrid') == e.hostElement
        ) {
          switch (t.deltaMode) {
            case 1:
              o.scrollTop += e.rows.defaultSize * (i < 0 ? -1 : 1);
              break;
            case 2:
              o.scrollTop += o.clientHeight * (i < 0 ? -1 : 1);
              break;
            case 0:
            default:
              wjcCore.isSafari() && (i = wjcCore.clamp(i, -150, 150)),
                (o.scrollTop += i);
          }
          t.preventDefault(), t.stopImmediatePropagation();
        }
      }),
      e.addEventListener(o, 'dragstart', this._dragstart.bind(this)),
      e.addEventListener(o, 'dragover', this._dragover.bind(this)),
      e.addEventListener(o, 'dragleave', this._dragover.bind(this)),
      e.addEventListener(o, 'drop', this._drop.bind(this)),
      e.addEventListener(o, 'dragend', this._dragend.bind(this)),
      this._enableTouchResizing();
  }
  return (
    (e.prototype.resetMouseState = function () {
      this._dragSource && wjcCore.removeClass(this._dragSource, _WJC_DRAGSRC),
        this._showDragMarker(null);
      var e = this._g.hostElement;
      e && (e.style.cursor = '');
      var t = this._g;
      t.removeEventListener(document, 'mousemove'),
        t.removeEventListener(document, 'mouseup'),
        (this._tsLast = Date.now()),
        (this._eMouse = null),
        (this._isDown = null),
        (this._htDown = null),
        (this._lbSelRows = null),
        (this._szRowCol = null),
        (this._szArgs = null),
        (this._dragSource = null);
    }),
    (e.prototype._enableTouchResizing = function () {
      var e = this,
        t = this._g,
        o = t.hostElement,
        i =
          'ontouchstart' in window
            ? ['touchstart', 'touchmove', 'touchend']
            : 'onpointerdown' in window
            ? ['pointerdown', 'pointermove', 'pointerup']
            : null;
      i &&
        (t.addEventListener(o, i[0], function (i) {
          if (
            (null == i.pointerType || 'touch' == i.pointerType) &&
            !wjcCore.closest(i.target, '.wj-elem-filter')
          ) {
            var n = wjcCore.closest(i.target, '.wj-cell');
            n instanceof HTMLElement &&
              ((t._rcBounds = null),
              (e._htDown = null),
              e._hover(i),
              e._szRowCol &&
                (n.removeAttribute('draggable'),
                (o.style.touchAction = 'none'),
                e._mousedown(i),
                i.preventDefault()));
          }
        }),
        t.addEventListener(o, i[1], function (t) {
          (null != t.pointerType && 'touch' != t.pointerType) ||
            (e._szRowCol && (e._mousemove(t), t.preventDefault()));
        }),
        t.addEventListener(o, i[2], function (t) {
          if (
            ((wjcCore.Control._touching = !1),
            (null == t.pointerType || 'touch' == t.pointerType) && e._szRowCol)
          ) {
            if (e._szArgs) e._finishResizing(e._eMouse);
            else {
              var i = wjcCore.closest(t.target, '.wj-cell');
              i instanceof HTMLElement && i.click();
            }
            e.resetMouseState(), (o.style.touchAction = '');
          }
        }));
    }),
    (e.prototype._mousedown = function (e) {
      var t = this._g,
        o = t.hitTest(e),
        i = o.cellType,
        n = e.ctrlKey || e.metaKey;
      if (((this._selDown = t.selection), o.panel == t.cells)) {
        if (wjcCore.closestClass(e.target, CellFactory._WJC_DROPDOWN))
          return t._edtHdl._toggleListBox(e, o.range), void e.preventDefault();
        if (t.editRange && t.editRange.contains(o.range)) return;
      }
      var r = wjcCore.getActiveElement();
      if (e.target != r || !t._isInputElement(e.target))
        if (i != CellType.None) {
          if (((this._htDown = o), (this._eMouse = e), null != this._szRowCol))
            return (
              r != t._eFocus && ((t._eFocus.tabIndex = 0), t._eFocus.focus()),
              void this._handleResizing(e)
            );
          switch (i) {
            case CellType.Cell:
              n &&
                t.selectionMode == SelectionMode.ListBox &&
                this._startListBoxSelection(o.row),
                this._mouseSelect(e, e.shiftKey);
              break;
            case CellType.RowHeader:
              0 == (this._g.allowDragging & AllowDragging.Rows) &&
                (n &&
                  t.selectionMode == SelectionMode.ListBox &&
                  this._startListBoxSelection(o.row),
                this._mouseSelect(e, e.shiftKey));
          }
          if (
            i == CellType.Cell &&
            t.rows.maxGroupLevel > -1 &&
            wjcCore.closestClass(e.target, CellFactory._WJC_COLLAPSE)
          ) {
            var l = wjcCore.tryCast(t.rows[o.row], GroupRow);
            if (l)
              return (
                n
                  ? t.collapseGroupsToLevel(
                      l.isCollapsed ? l.level + 1 : l.level
                    )
                  : (l.isCollapsed = !l.isCollapsed),
                void this.resetMouseState()
              );
          }
        } else t._edtHdl._commitRowEdits();
    }),
    (e.prototype._mousemove = function (e) {
      if (null != this._htDown) {
        if (
          0 == e.buttons &&
          this._eMouse &&
          e.timeStamp - this._eMouse.timeStamp > 600
        )
          return void this.resetMouseState();
        if (((this._eMouse = e), this._szRowCol)) this._handleResizing(e);
        else
          switch (this._htDown.cellType) {
            case CellType.Cell:
              this._mouseSelect(e, !0);
              break;
            case CellType.RowHeader:
              0 == (this._g.allowDragging & AllowDragging.Rows) &&
                this._mouseSelect(e, !0);
          }
      }
    }),
    (e.prototype._mouseup = function (e) {
      if (
        !this._g.isTouching ||
        !(this._dragSource || e.target instanceof HTMLHtmlElement)
      ) {
        var t = this._g,
          o = t.hitTest(e),
          i = this._htDown,
          n = SelectionMode;
        if (i && !e.defaultPrevented)
          if (this._szArgs) this._finishResizing(e);
          else if (i.panel != t.topLeftCells || this._szArgs)
            i.panel != t.columnHeaders || e.dataTransfer
              ? i.panel == t.cells &&
                (e.ctrlKey ||
                  e.metaKey ||
                  e.shiftKey ||
                  (o.panel == i.panel &&
                    o.range.equals(i.range) &&
                    t.selection.equals(this._selDown) &&
                    t._edtHdl.startEditing(!0, o.row, o.col, !0, e)))
              : o.panel == i.panel &&
                o.col == i.col &&
                !o.edgeRight &&
                o.col > -1 &&
                this._clickSort(e, o);
          else if (
            o.panel == i.panel &&
            o.row == i.row &&
            o.col == i.col &&
            t.rows.length &&
            t.columns.length
          )
            switch (t.selectionMode) {
              case n.CellRange:
              case n.RowRange:
              case n.ListBox:
                t.select(
                  new CellRange(0, 0, t.rows.length - 1, t.columns.length - 1)
                );
            }
        this.resetMouseState();
      }
    }),
    (e.prototype._click = function (e) {
      Date.now() - this._tsLast > 50 && !e.pointerType && this._handleClick(e);
    }),
    (e.prototype._handleClick = function (e) {
      var t = this._g,
        o = e.target,
        i = new HitTestInfo(o, null);
      if (!e.defaultPrevented && i.grid == t && !t._isInputElement(o))
        if (i.panel == t.topLeftCells)
          t.select(
            new CellRange(0, 0, t.rows.length - 1, t.columns.length - 1)
          );
        else if (i.panel == t.columnHeaders) this._clickSort(e, i);
        else if (i.panel == t.rowHeaders)
          t.select(new CellRange(i.row, 0, i.row, t.columns.length - 1));
        else if (i.panel == t.cells)
          if (i.row < 0) this._clickSort(e, i);
          else if (wjcCore.closestClass(o, CellFactory._WJC_COLLAPSE)) {
            var n = t.rows[i.row];
            n instanceof GroupRow &&
              (e.ctrlKey
                ? t.collapseGroupsToLevel(n.isCollapsed ? n.level + 1 : n.level)
                : (n.isCollapsed = !n.isCollapsed));
          } else
            wjcCore.closestClass(o, CellFactory._WJC_DROPDOWN)
              ? t._edtHdl._toggleListBox(e, i.range)
              : t.select(i.range);
    }),
    (e.prototype._clickSort = function (e, t) {
      var o = this._g,
        i = o.collectionView,
        n = e.ctrlKey || e.metaKey;
      if (i && i.canSort && o.allowSorting) {
        t.range.bottomRow;
        var r = t.panel.columns[t.col],
          l = o._getBindingColumn(t.panel, t.row, r),
          s = l ? l._getBindingSort() : null;
        if (l.allowSorting && s) {
          for (
            var a = t.grid.collectionView.sortDescriptions, c = null, h = 0;
            h < a.length;
            h++
          )
            if (a[h].property == s) {
              c = !a[h].ascending;
              break;
            }
          if (null == c) {
            if (n) return;
            c = !0;
          }
          var d = new CellRangeEventArgs(t.panel, t.range);
          o.onSortingColumn(d) &&
            (o._edtHdl._commitRowEdits(),
            n
              ? a.clear()
              : a.splice(0, a.length, new wjcCore.SortDescription(s, c)),
            o.onSortedColumn(d));
        }
      }
    }),
    (e.prototype._dblclick = function (e) {
      var t,
        o = this._g,
        i = o.hitTest(e),
        n = i.cellType,
        r = o.selection,
        l = i.range;
      if (!e.defaultPrevented)
        if (i.edgeRight && o.allowResizing & AllowResizing.Columns) {
          if (
            n == CellType.ColumnHeader ||
            (n == CellType.Cell && o.allowResizing & _AR_ALLCELLS)
          ) {
            e.preventDefault(), e.ctrlKey && r.containsColumn(i.col) && (l = r);
            for (var s = l.leftCol; s <= l.rightCol; s++)
              o.columns[s].allowResizing &&
                ((t = new CellRangeEventArgs(o.cells, new CellRange(-1, s))),
                o.onAutoSizingColumn(t) &&
                  o.onResizingColumn(t) &&
                  (o.autoSizeColumn(s),
                  o.onResizedColumn(t),
                  o.onAutoSizedColumn(t)));
          } else
            n == CellType.TopLeft &&
              i.panel.columns[i.col].allowResizing &&
              (e.preventDefault(),
              (t = new CellRangeEventArgs(i.panel, new CellRange(-1, i.col))),
              o.onAutoSizingColumn(t) &&
                o.onResizingColumn(t) &&
                (o.autoSizeColumn(i.col, !0),
                o.onAutoSizedColumn(t),
                o.onResizedColumn(t)));
          this.resetMouseState();
        } else if (i.edgeBottom && o.allowResizing & AllowResizing.Rows) {
          if (
            n == CellType.RowHeader ||
            (n == CellType.Cell && o.allowResizing & _AR_ALLCELLS)
          ) {
            e.ctrlKey && r.containsRow(i.row) && (l = r);
            for (var a = l.topRow; a <= l.bottomRow; a++)
              o.rows[a].allowResizing &&
                ((t = new CellRangeEventArgs(o.cells, new CellRange(a, -1))),
                o.onAutoSizingRow(t) &&
                  o.onResizingRow(t) &&
                  (o.autoSizeRow(a), o.onResizedRow(t), o.onAutoSizedRow(t)));
          } else
            n == CellType.TopLeft &&
              i.panel.rows[i.row].allowResizing &&
              ((t = new CellRangeEventArgs(i.panel, new CellRange(i.row, -1))),
              o.onAutoSizingRow(t) &&
                o.onResizingRow(t) &&
                (o.autoSizeRow(i.row, !0),
                o.onResizedRow(t),
                o.onAutoSizedRow(t)));
          this.resetMouseState();
        } else;
    }),
    (e.prototype._hover = function (e) {
      if (null == this._htDown) {
        var t = this._g,
          o = t.hitTest(e),
          i = (o.panel, o.cellType),
          n = '';
        return (
          (this._szRowCol = null),
          (i == CellType.ColumnHeader ||
            i == CellType.TopLeft ||
            (i == CellType.Cell && t.allowResizing & _AR_ALLCELLS)) &&
            o.edgeRight &&
            0 != (t.allowResizing & AllowResizing.Columns) &&
            (this._szRowCol = this._getResizeCol(o)),
          (i == CellType.RowHeader ||
            i == CellType.TopLeft ||
            (i == CellType.Cell && t.allowResizing & _AR_ALLCELLS)) &&
            o.edgeBottom &&
            0 != (t.allowResizing & AllowResizing.Rows) &&
            (this._szRowCol = this._getResizeRow(o)),
          this._szRowCol instanceof Column
            ? (n = 'col-resize')
            : this._szRowCol instanceof Row && (n = 'row-resize'),
          (this._szStart = this._szRowCol ? this._szRowCol.renderSize : 0),
          (t.hostElement.style.cursor = n),
          o
        );
      }
      return null;
    }),
    (e.prototype._getResizeCol = function (e) {
      for (
        var t = e.panel.columns, o = t[e.col], i = e.col + 1;
        i < t.length;
        i++
      )
        if ((n = t[i]).visible) {
          n.size < 1 && (o = n);
          break;
        }
      if (
        e.col == t.length - 1 &&
        (e.cellType == CellType.TopLeft || e.cellType == CellType.RowHeader)
      ) {
        t = this._g.columns;
        for (i = 0; i < t.length; i++) {
          var n = t[i];
          if (n.visible) {
            n.size < 1 && (o = n);
            break;
          }
        }
      }
      return o.allowResizing ? o : null;
    }),
    (e.prototype._getResizeRow = function (e) {
      for (var t = e.panel.rows, o = t[e.row], i = e.row + 1; i < t.length; i++)
        if ((n = t[i]).visible) {
          n.size < 1 && (o = n);
          break;
        }
      if (
        e.row == t.length - 1 &&
        (e.cellType == CellType.TopLeft || e.cellType == CellType.ColumnHeader)
      ) {
        t = this._g.rows;
        for (i = 0; i < t.length; i++) {
          var n = t[i];
          if (n.visible) {
            n.size < 1 && (o = n);
            break;
          }
        }
      }
      return o.allowResizing ? o : null;
    }),
    (e.prototype._mouseSelect = function (e, t) {
      var o = this,
        i = this._g;
      if (
        this._htDown &&
        this._htDown.panel &&
        i.selectionMode != SelectionMode.None
      ) {
        var n = new HitTestInfo(this._htDown.panel, e);
        this._handleSelection(n, t),
          !wjcCore.isIE9() &&
            e.button >= 0 &&
            e.target != i._root &&
            (n = new HitTestInfo(i, e)).cellType != CellType.Cell &&
            n.cellType != CellType.RowHeader &&
            setTimeout(function () {
              o._mouseSelect(o._eMouse, t);
            }, 100);
      }
    }),
    (e.prototype._handleResizing = function (t) {
      if ((t.preventDefault(), this._szRowCol instanceof Column)) {
        var o = this._g,
          i = wjcCore.mouseToPage(t).x,
          n = Math.round(
            Math.max(
              e._SZ_MIN,
              this._szStart +
                (i - this._htDown.point.x) * (o.rightToLeft ? -1 : 1)
            )
          );
        if (this._szRowCol.renderSize != n) {
          if (null == this._szArgs) {
            l =
              o.rowHeaders.columns.indexOf(this._szRowCol) > -1
                ? o.rowHeaders
                : o.cells;
            this._szArgs = new CellRangeEventArgs(
              l,
              new CellRange(-1, this._szRowCol.index)
            );
          }
          (this._szArgs.cancel = !1),
            o.onResizingColumn(this._szArgs) &&
              (o.deferResizing
                ? this._showResizeMarker(n)
                : (this._szRowCol.width = n));
        }
      }
      if (this._szRowCol instanceof Row) {
        var o = this._g,
          r = wjcCore.mouseToPage(t).y,
          n = Math.round(
            Math.max(e._SZ_MIN, this._szStart + (r - this._htDown.point.y))
          );
        if (this._szRowCol.renderSize != n) {
          if (null == this._szArgs) {
            var l =
              o.columnHeaders.rows.indexOf(this._szRowCol) > -1
                ? o.columnHeaders
                : o.cells;
            this._szArgs = new CellRangeEventArgs(
              l,
              new CellRange(this._szRowCol.index, -1)
            );
          }
          (this._szArgs.cancel = !1),
            o.onResizingRow(this._szArgs) &&
              (o.deferResizing
                ? this._showResizeMarker(n)
                : (this._szRowCol.height = n));
        }
      }
    }),
    (e.prototype._dragstart = function (e) {
      var t = this._g,
        o = this._htDown;
      if (o) {
        if (((this._dragSource = null), !this._szRowCol)) {
          var i = new CellRangeEventArgs(o.panel, o.range);
          if (
            o.cellType == CellType.ColumnHeader &&
            t.allowDragging & AllowDragging.Columns &&
            o.col > -1 &&
            t.columns[o.col].allowDragging
          )
            t.onDraggingColumn(i)
              ? (this._dragSource = e.target)
              : e.preventDefault();
          else if (
            o.cellType == CellType.RowHeader &&
            t.allowDragging & AllowDragging.Rows &&
            o.row > -1 &&
            t.rows[o.row].allowDragging
          ) {
            var n = t.rows[o.row];
            n instanceof GroupRow ||
              n instanceof _NewRowTemplate ||
              (t.onDraggingRow(i)
                ? (this._dragSource = e.target)
                : e.preventDefault());
          }
        }
        this._dragSource &&
          e.dataTransfer &&
          !e.defaultPrevented &&
          (wjcCore._startDrag(e.dataTransfer, 'move'),
          e.stopPropagation(),
          wjcCore.addClass(this._dragSource, _WJC_DRAGSRC),
          t.beginUpdate(),
          (this._updating = !0));
      }
    }),
    (e.prototype._dragend = function (e) {
      this._updating && (this._g.endUpdate(), (this._updating = !1)),
        this.resetMouseState();
    }),
    (e.prototype._dragover = function (e) {
      var t = this._g,
        o = t.hitTest(e),
        i = !1,
        n = new CellRangeEventArgs(t.cells, o.range);
      this._htDown &&
        o.cellType == this._htDown.cellType &&
        (o.cellType == CellType.ColumnHeader
          ? ((n.cancel = !t.columns.canMoveElement(this._htDown.col, o.col)),
            (i = t.onDraggingColumnOver(n)))
          : o.cellType == CellType.RowHeader &&
            ((n.cancel = !t.rows.canMoveElement(this._htDown.row, o.row)),
            (i = t.onDraggingRowOver(n)))),
        i
          ? ((e.dataTransfer.dropEffect = 'move'),
            this._showDragMarker(o),
            e.preventDefault(),
            e.stopPropagation())
          : this._showDragMarker(null);
    }),
    (e.prototype._drop = function (e) {
      var t = this._g,
        o = t.hitTest(e);
      if (this._htDown && o.cellType == this._htDown.cellType) {
        var i = t.selection,
          n = new CellRangeEventArgs(t.cells, o.range, this._htDown);
        o.cellType == CellType.ColumnHeader
          ? (t.columns.moveElement(this._htDown.col, o.col),
            t.select(i.row, o.col),
            t.onDraggedColumn(n))
          : o.cellType == CellType.RowHeader &&
            (t.rows.moveElement(this._htDown.row, o.row),
            t.select(o.row, i.col),
            t.onDraggedRow(n));
      }
      this.resetMouseState();
    }),
    (e.prototype._showResizeMarker = function (e) {
      var t = this._g,
        o = this._dvMarker,
        i = t.cells.hostElement;
      o.parentElement != i && i.appendChild(o);
      var n,
        r = this._szArgs.panel.cellType;
      this._szRowCol instanceof Column
        ? ((n = {
            left: this._szRowCol.pos + e - 1,
            top: -1e3,
            right: '',
            bottom: 0,
            width: 3,
            height: '',
          }),
          t.rightToLeft && (n.left = i.clientWidth - n.left - n.width),
          (r != CellType.TopLeft && r != CellType.RowHeader) ||
            (n.left -= t.topLeftCells.hostElement.offsetWidth))
        : ((n = {
            left: -1e3,
            top: this._szRowCol.pos + e - 1,
            right: 0,
            bottom: '',
            width: '',
            height: 3,
          }),
          (r != CellType.TopLeft && r != CellType.ColumnHeader) ||
            (n.top -= t.topLeftCells.hostElement.offsetHeight)),
        wjcCore.setCss(o, n);
    }),
    (e.prototype._showDragMarker = function (e) {
      var t = this._g,
        o = this._dvMarker;
      if (!e || !e.panel)
        return wjcCore.removeChild(o), void (this._rngTarget = null);
      if (!e.range.equals(this._rngTarget)) {
        this._rngTarget = e.range;
        var i = e.panel.hostElement;
        o.parentElement != i && i.appendChild(o);
        var n = {
          left: 0,
          top: 0,
          width: 6,
          height: 6,
          right: '',
          bottom: '',
        };
        switch (e.cellType) {
          case CellType.ColumnHeader:
            n.height = e.panel.height;
            var r = t.columns[e.col];
            (n.left = r.pos - n.width / 2),
              e.col > this._htDown.col && (n.left += r.renderWidth),
              t.rightToLeft &&
                (n.left = o.parentElement.clientWidth - n.left - n.width);
            break;
          case CellType.RowHeader:
            n.width = e.panel.width;
            var l = t.rows[e.row];
            (n.top = l.pos - n.height / 2),
              e.row > this._htDown.row && (n.top += l.renderHeight);
        }
        wjcCore.setCss(o, n);
      }
    }),
    (e.prototype._finishResizing = function (t) {
      var o = this._g,
        i = o.selection,
        n = this._szArgs,
        r = this._eMouse && this._eMouse.ctrlKey;
      if (n && !n.cancel) {
        if (n.col > -1) {
          var l = n.col,
            s = wjcCore.mouseToPage(t).x,
            a = Math.round(
              Math.max(
                e._SZ_MIN,
                this._szStart +
                  (s - this._htDown.point.x) * (this._g.rightToLeft ? -1 : 1)
              )
            );
          if (
            ((n.panel.columns[l].width = Math.round(a)),
            o.onResizedColumn(n),
            r &&
              this._htDown.cellType == CellType.ColumnHeader &&
              i.containsColumn(l))
          )
            for (var c = i.leftCol; c <= i.rightCol; c++)
              o.columns[c].allowResizing &&
                c != l &&
                ((n = new CellRangeEventArgs(o.cells, new CellRange(-1, c))),
                o.onResizingColumn(n) &&
                  ((o.columns[c].size = o.columns[l].size),
                  o.onResizedColumn(n)));
        }
        if (n.row > -1) {
          var l = n.row,
            h = wjcCore.mouseToPage(t).y,
            a = Math.round(
              Math.max(e._SZ_MIN, this._szStart + (h - this._htDown.point.y))
            );
          if (
            ((n.panel.rows[l].height = Math.round(a)),
            o.onResizedRow(n),
            r &&
              this._htDown.cellType == CellType.RowHeader &&
              i.containsRow(l))
          )
            for (var d = i.topRow; d <= i.bottomRow; d++)
              o.rows[d].allowResizing &&
                d != l &&
                ((n = new CellRangeEventArgs(o.cells, new CellRange(d, -1))),
                o.onResizingRow(n) &&
                  ((o.rows[d].size = o.rows[l].size), o.onResizedRow(n)));
        }
      }
    }),
    (e.prototype._startListBoxSelection = function (e) {
      var t = this._g.rows;
      (this._lbSelState = !t[e].isSelected), (this._lbSelRows = {});
      for (var o = 0; o < t.length; o++)
        t[o].isSelected && (this._lbSelRows[o] = !0);
    }),
    (e.prototype._handleSelection = function (e, t) {
      var o = this._g,
        i = o.rows,
        n = o._selHdl.selection,
        r = new CellRange(e.row, e.col);
      if (e.row > -1 && e.col > -1)
        if (null != this._lbSelRows) {
          var l = !1;
          r = new CellRange(e.row, e.col, this._htDown.row, this._htDown.col);
          for (var s = 0; s < i.length; s++) {
            var a = r.containsRow(s)
              ? this._lbSelState
              : null != this._lbSelRows[s];
            if (a != i[s].isSelected) {
              var c = new CellRangeEventArgs(
                o.cells,
                new CellRange(s, n.col, s, n.col2)
              );
              o.onSelectionChanging(c) &&
                (i[s]._setFlag(RowColFlags.Selected, a, !0),
                (l = !0),
                o.onSelectionChanged(c));
            }
          }
          l && o.refreshCells(!1, !0, !0), o.scrollIntoView(e.row, e.col);
        } else
          e.cellType == CellType.RowHeader &&
            ((r.col = 0), (r.col2 = o.columns.length - 1)),
            t && ((r.row2 = n.row2), (r.col2 = n.col2)),
            o.select(r);
    }),
    (e._SZ_MIN = 0),
    e
  );
})();
exports._MouseHandler = _MouseHandler;
var _WJC_CHECKBOX = 'wj-cell-check',
  _EditHandler = (function () {
    function e(e) {
      var t = this;
      (this._fullEdit = !1),
        (this._list = null),
        (this._g = e),
        (this._evtInput = document.createEvent('HTMLEvents')),
        this._evtInput.initEvent('input', !0, !1),
        e.selectionChanging.addHandler(function (o, i) {
          if (t.finishEditing()) {
            var n = e._selHdl.selection.row;
            if (n != i.row) {
              var r = e.rows.length;
              (n > -1 && n < r ? e.rows[n].dataItem : null) !=
                (i.row > -1 && i.row < r ? e.rows[i.row].dataItem : null) &&
                t._commitRowEdits();
            }
          } else i.cancel = !0;
        }),
        e.lostFocus.addHandler(function () {
          if (!e.containsFocus()) {
            var o = wjcCore.getActiveElement();
            (o && 'fixed' == getComputedStyle(o).position) ||
              t._commitRowEdits();
          }
        }),
        e.addEventListener(
          e.hostElement,
          'mousedown',
          function (o) {
            if (
              !o.defaultPrevented &&
              0 == o.button &&
              !e._mouseHdl._szRowCol
            ) {
              e.selection;
              var i = e.hitTest(o);
              if (i.cellType != CellType.Cell && i.cellType != CellType.None)
                t.finishEditing();
              else if (i.cellType != CellType.None) {
                var n = wjcCore.tryCast(o.target, HTMLInputElement);
                t._isNativeCheckbox(n) &&
                  (n != t.activeEditor &&
                    (o.preventDefault(),
                    t.startEditing(!1, i.row, i.col, !0, o) &&
                      (n = t.activeEditor)),
                  !n ||
                    'checkbox' != n.type ||
                    n.disabled ||
                    n.readOnly ||
                    ((n.checked = !n.checked), n.focus(), t.finishEditing()));
              }
            }
          },
          !0
        ),
        e.addEventListener(e.hostElement, 'click', function (e) {
          t._isNativeCheckbox(e.target) && e.preventDefault();
        });
    }
    return (
      (e.prototype.startEditing = function (e, t, o, i, n) {
        void 0 === e && (e = !0);
        var r = this._g;
        if (
          ((t = wjcCore.asNumber(t, !0, !0)),
          (o = wjcCore.asNumber(o, !0, !0)),
          null == t && (t = r.selection.row),
          null == o && (o = r.selection.col),
          null == i && (i = !0),
          !this._allowEditing(t, o))
        )
          return !1;
        var l = r.getMergedRange(r.cells, t, o, !1);
        l || (l = new CellRange(t, o));
        var s = r.rows[t].dataItem;
        if ((r.select(l, !0), !r.rows[t] || s != r.rows[t].dataItem)) return !1;
        if (l.equals(this._rng)) return !0;
        if (this.activeEditor && !this.finishEditing()) return !1;
        var a = new CellRangeEventArgs(r.cells, l, n);
        if (!r.onBeginningEdit(a)) return !1;
        var c = r.editableCollectionView,
          h = !1;
        c &&
          ((h = (s = r.rows[t].dataItem) != c.currentEditItem) &&
            r.onRowEditStarting(a),
          c.editItem(s),
          h && (r.onRowEditStarted(a), (this._edItem = s))),
          (this._fullEdit = wjcCore.asBoolean(e)),
          (this._rng = l),
          (this._list = null);
        var d = r.columns[o].dataMap;
        d && (this._list = d.getDisplayValues(s)),
          l.isSingleCell ? this._updateEditorCell(t, o, h) : r.refresh(!1);
        var u = this._edt;
        if (u) {
          if ('checkbox' == u.type) this._fullEdit = !1;
          else if (i) {
            if (
              wjcCore.isNumber(r.getCellData(t, o, !1)) &&
              u.value.indexOf('%') > -1
            ) {
              for (
                var g = u.value, p = 0, f = g.length;
                f > 0 && '%' == g[f - 1];

              )
                f--;
              for (; p < f && '%' == g[p]; ) p++;
              wjcCore.setSelectionRange(u, p, f);
            } else wjcCore.setSelectionRange(u, 0, u.value.length);
            r._setFocusNoScroll(u);
          }
          if ((r.onPrepareCellForEdit(a), u.disabled || u.readOnly)) return !1;
        }
        return null != u && !u.disabled && !u.readOnly;
      }),
      (e.prototype.finishEditing = function (e) {
        void 0 === e && (e = !1);
        var t = this._edt;
        if (!t) return this._removeListBox(), !0;
        var o = this._g,
          i = this._rng,
          n = new CellEditEndingEventArgs(o.cells, i),
          r = o.containsFocus(),
          l = o.hostElement.querySelector('.wj-control.wj-state-focused');
        if (l) {
          var s = wjcCore.Control.getControl(l);
          s && s.onLostFocus(n);
        }
        if (((n.cancel = e), !e && o.validateEdits)) {
          var a = this._getValidationError();
          if (a) {
            n.cancel = !0;
            var c = t.parentElement;
            c &&
              (wjcCore.toggleClass(c, 'wj-state-invalid', !0),
              (c.title = a),
              (n.stayInEditMode = !0));
          }
        }
        if (!o.onCellEditEnding(n) && n.stayInEditMode)
          return (
            r
              ? setTimeout(function () {
                  t.select();
                })
              : t.select(),
            !1
          );
        if (!n.cancel) {
          n.data = o.cells.getCellData(i.topRow, i.leftCol, !1);
          for (
            var h = o.cellFactory.getEditorValue(o), d = i.topRow;
            d <= i.bottomRow && d < o.rows.length;
            d++
          )
            for (
              var u = i.leftCol;
              u <= i.rightCol && u < o.columns.length;
              u++
            )
              o.cells.setCellData(d, u, h, !0, !1);
        }
        (this._edt = null),
          (this._rng = null),
          (this._list = null),
          this._removeListBox();
        var g = wjcCore.closest(t, '.wj-cell');
        return (
          wjcCore.contains(g, wjcCore.getActiveElement()) && g.focus(),
          n.cancel || !n.refresh
            ? this._updateEditorCell(i.row, i.col, !1)
            : o.refresh(!1),
          r && o.focus(),
          o.onCellEditEnded(n),
          !0
        );
      }),
      Object.defineProperty(e.prototype, 'activeEditor', {
        get: function () {
          return this._edt;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'editRange', {
        get: function () {
          return this._rng;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.getClipString = function (e) {
        var t = this._g,
          o = '',
          i = !0,
          n = SelectionMode;
        if (!e)
          switch (((e = t.selection), t.selectionMode)) {
            case n.Row:
            case n.RowRange:
              (e.col = 0), (e.col2 = t.columns.length - 1);
              break;
            case n.ListBox:
              (e.col = 0), (e.col2 = t.columns.length - 1);
              for (var r = 0; r < t.rows.length; r++)
                t.rows[r].isSelected &&
                  t.rows[r].isVisible &&
                  ((e.row = e.row2 = r),
                  o && (o += '\n'),
                  (o += this.getClipString(e)));
              return o;
          }
        for (
          var l = (e = wjcCore.asType(e, CellRange)).topRow;
          l <= e.bottomRow;
          l++
        )
          if (t.rows[l].isVisible) {
            i || (o += '\n'), (i = !1);
            for (var s = e.leftCol, a = !0; s <= e.rightCol; s++)
              if (t.columns[s].isVisible) {
                a || (o += '\t'), (a = !1);
                var c = t.cells.getCellData(l, s, !0).toString();
                (c = c.replace(/\t/g, ' ')).indexOf('\n') > -1 &&
                  (c = '"' + c.replace(/"/g, '""') + '"'),
                  (o += c);
              }
          }
        return o;
      }),
      (e.prototype.setClipString = function (e, t) {
        var o = this,
          i = this._g,
          n = null == t,
          r = SelectionMode;
        if (!t)
          switch (((t = i.selection), i.selectionMode)) {
            case r.Row:
            case r.RowRange:
            case r.ListBox:
              (t.col = 0), (t.col2 = i.columns.length - 1);
          }
        t = wjcCore.asType(t, CellRange);
        var l = this._parseClipString(wjcCore.asString(e));
        n && !t.isSingleCell && l.length && this._expandClipRows(l, t);
        var s,
          a = new CellRange(t.topRow, t.leftCol),
          c = i.editableCollectionView,
          h = t.topRow,
          d = !1;
        i.deferUpdate(function () {
          c && c.beginUpdate();
          for (var e = 0; e < l.length && h < i.rows.length; e++, h++)
            if (i.rows[h].isVisible)
              for (
                var n = l[e], r = t.leftCol, u = 0;
                u < n.length && r < i.columns.length;
                u++, r++
              )
                i.columns[r].isVisible
                  ? o._allowEditing(h, r) &&
                    ((s = new CellRangeEventArgs(
                      i.cells,
                      new CellRange(h, r),
                      n[u]
                    )),
                    i.onPastingCell(s) &&
                      (c &&
                        (c.editItem(i.rows[h].dataItem),
                        (o._edItem = c.currentEditItem)),
                      i.cells.setCellData(h, r, s.data) &&
                        (i.onPastedCell(s), (d = !0))),
                    (a.row2 = Math.max(a.row2, h)),
                    (a.col2 = Math.max(a.col2, r)))
                  : u--;
            else e--;
          c && c.endUpdate(), i.select(a);
        });
      }),
      (e.prototype._isNativeCheckbox = function (e) {
        return (
          e instanceof HTMLInputElement &&
          'checkbox' == e.type &&
          !e.disabled &&
          !e.readOnly &&
          wjcCore.hasClass(e, _WJC_CHECKBOX) &&
          wjcCore.closest(e, '.wj-flexgrid') == this._g.hostElement
        );
      }),
      (e.prototype._parseClipString = function (e) {
        var t = [];
        e = (e = e.replace(/\r\n/g, '\n').replace(/\r/g, '\n')).replace(
          /\n+$/g,
          ''
        );
        var o = 0,
          i = 0;
        for (o = 0; o < e.length; o++) {
          var n = '"' == e[o] && e[o + 1] >= ' ',
            r = !1,
            l = !1;
          for (i = o; i < e.length && !l; i++) {
            var s = e[i];
            switch (s) {
              case '"':
                n && (r = !r);
                break;
              case '\t':
              case '\n':
                r ||
                  (this._parseClipCell(t, e, o, i, '\n' == s),
                  (o = i),
                  (l = !0));
            }
          }
          if (i == e.length) {
            this._parseClipCell(t, e, o, e.length, !1);
            break;
          }
        }
        return 0 == t.length && t.push(['']), t;
      }),
      (e.prototype._parseClipCell = function (e, t, o, i, n) {
        e.length || e.push([]);
        var r = t.substr(o, i - o),
          l = r.length;
        l > 1 &&
          '"' == r[0] &&
          '"' == r[l - 1] &&
          (r = (r = r.substr(1, l - 2)).replace(/""/g, '"')),
          e[e.length - 1].push(r),
          n && e.push([]);
      }),
      (e.prototype._expandClipRows = function (e, t) {
        for (var o = e.length, i = 0, n = 0; n < o; n++)
          i = Math.max(i, e[n].length);
        for (var r = this._g, l = 0, s = 0, a = t.topRow; a <= t.bottomRow; a++)
          r.rows[a].isVisible && l++;
        for (c = t.leftCol; c <= t.rightCol; c++) r.columns[c].isVisible && s++;
        if (
          (l > 1 || s > 1) &&
          (1 == l && (l = o), 1 == s && (s = i), s % i == 0 && l % o == 0)
        ) {
          for (var c = i; c < s; c++)
            for (a = 0; a < o; a++) e[a].push(e[a % o][c % i]);
          for (a = o; a < l; a++) e.push(e[a % o]);
        }
      }),
      (e.prototype._updateEditorCell = function (e, t, o) {
        var i = this._g,
          n = i.cells.getCellElement(e, t),
          r = i._useFrozenDiv() && (e < i.frozenRows || t < i.frozenColumns);
        if (!n || r || i._hasPendingUpdates()) i.refresh(!1);
        else if (
          (this._updateCell(n),
          (o = o || i._getHasValidation()) &&
            i.headersVisibility & HeadersVisibility.Row)
        ) {
          var l = i.rowHeaders,
            s = l.columns.length - 1,
            a = l.getCellElement(e, s);
          a && this._updateCell(a);
        }
      }),
      (e.prototype._updateCell = function (e) {
        var t = new HitTestInfo(e, null),
          o = FlexGrid._WJS_UPDATING;
        t.panel &&
          (wjcCore.addClass(e, o),
          t.grid.cellFactory.updateCell(t.panel, t.row, t.col, e, t.range),
          wjcCore.removeClass(e, o));
      }),
      (e.prototype._getValidationError = function () {
        var e = this._g;
        if (e._getHasValidation()) {
          var t = this._rng.row,
            o = this._rng.col,
            i = e.cellFactory.getEditorValue(e),
            n = e.getCellData(t, o, !1);
          if (e.setCellData(t, o, i, !0, !1)) {
            var r = e._getError(e.cells, t, o);
            return e.setCellData(t, o, n, !0, !1), r;
          }
        }
        return null;
      }),
      (e.prototype._allowEditing = function (e, t) {
        var o = this._g;
        if (o.isReadOnly || o.selectionMode == SelectionMode.None) return !1;
        if (
          e < 0 ||
          e >= o.rows.length ||
          o.rows[e].isReadOnly ||
          !o.rows[e].isVisible
        )
          return !1;
        if (t < 0 || t >= o.columns.length) return !1;
        var i = o._getBindingColumn(o.cells, e, o.columns[t]);
        return !(!i || i.isReadOnly || !i.isVisible);
      }),
      (e.prototype._commitRowEdits = function () {
        var e = this._g;
        if (this.finishEditing() && this._edItem) {
          var t = e.editableCollectionView;
          if (t && t.currentEditItem) {
            var o = new CellRangeEventArgs(e.cells, e.selection);
            e.onRowEditEnding(o), t.commitEdit(), e.onRowEditEnded(o);
          }
          this._edItem = null;
        }
      }),
      (e.prototype._keydown = function (e) {
        switch (e.keyCode) {
          case wjcCore.Key.F2:
            return (this._fullEdit = !this._fullEdit), e.preventDefault(), !0;
          case wjcCore.Key.F4:
            return this._toggleListBox(e), e.preventDefault(), !0;
          case wjcCore.Key.Space:
            var t = this._edt;
            return (
              !t ||
                'checkbox' != t.type ||
                t.disabled ||
                t.readOnly ||
                ((t.checked = !t.checked),
                this.finishEditing(),
                e.preventDefault()),
              !0
            );
          case wjcCore.Key.Enter:
          case wjcCore.Key.Tab:
            return e.preventDefault(), !this.finishEditing();
          case wjcCore.Key.Escape:
            return e.preventDefault(), this.finishEditing(!0), !0;
          case wjcCore.Key.Up:
          case wjcCore.Key.Down:
          case wjcCore.Key.Left:
          case wjcCore.Key.Right:
          case wjcCore.Key.PageUp:
          case wjcCore.Key.PageDown:
          case wjcCore.Key.Home:
          case wjcCore.Key.End:
            if (this._lbx) return this._keydownListBox(e);
            if (e.altKey)
              switch (e.keyCode) {
                case wjcCore.Key.Up:
                case wjcCore.Key.Down:
                  return this._toggleListBox(e), e.preventDefault(), !0;
              }
            if (!this._fullEdit && this.finishEditing()) return !1;
        }
        return !0;
      }),
      (e.prototype._keydownListBox = function (e) {
        var t = !0;
        if (this._lbx)
          switch (e.keyCode) {
            case wjcCore.Key.Up:
              e.altKey
                ? this._toggleListBox(e)
                : this._lbx.selectedIndex > 0 && this._lbx.selectedIndex--;
              break;
            case wjcCore.Key.Down:
              e.altKey ? this._toggleListBox(e) : this._lbx.selectedIndex++;
              break;
            case wjcCore.Key.Home:
            case wjcCore.Key.PageUp:
              this._lbx.selectedIndex = 0;
              break;
            case wjcCore.Key.End:
            case wjcCore.Key.PageDown:
              this._lbx.selectedIndex =
                this._lbx.collectionView.items.length - 1;
              break;
            default:
              t = !1;
          }
        return !!t && (e.preventDefault(), !0);
      }),
      (e.prototype._keypress = function (e) {
        var t = this._edt;
        if (
          t &&
          'checkbox' != t.type &&
          this._list &&
          this._list.length > 0 &&
          e.charCode >= 32
        ) {
          var o = t.selectionStart,
            i = t.value.substr(0, o);
          e.target == t && (o++, (i += String.fromCharCode(e.charCode))),
            (i = i.toLowerCase());
          for (var n = 0; n < this._list.length; n++)
            if (0 == this._list[n].toLowerCase().indexOf(i)) {
              (t.value = this._list[n]),
                wjcCore.setSelectionRange(t, o, this._list[n].length),
                t.dispatchEvent(this._evtInput),
                e.preventDefault();
              break;
            }
        }
      }),
      (e.prototype._toggleListBox = function (e, t) {
        var o = this._g,
          i = o._selHdl.selection;
        if ((t || (t = i), this._lbx && (this._removeListBox(), i.contains(t))))
          return (
            o.activeEditor
              ? o.activeEditor.focus()
              : o.containsFocus() || o.focus(),
            !0
          );
        var n = o.isTouching,
          r = o._getBindingColumn(o.cells, t.row, o.columns[t.col]);
        return (
          !(!tryGetModuleWijmoInput() || !r.dataMap || !1 === r.showDropDown) &&
          !(
            !tryGetModuleWijmoInput() ||
            !this.startEditing(!0, t.row, t.col, !n, e)
          ) &&
          ((this._lbx = this._createListBox()),
          this._lbx.showSelection(),
          n && this._lbx.focus(),
          !0)
        );
      }),
      (e.prototype._createListBox = function () {
        var e = this,
          t = this._g,
          o = this._rng,
          i = t.rows[o.row],
          n = t._getBindingColumn(t.cells, o.row, t.columns[o.col]),
          r = document.createElement('div'),
          l = new (tryGetModuleWijmoInput().ListBox)(r);
        this._removeListBox(),
          wjcCore.addClass(r, 'wj-dropdown-panel wj-grid-listbox'),
          (l.maxHeight = 4 * i.renderHeight),
          (l.isContentHtml = n.isContentHtml),
          (l.itemsSource = n.dataMap.getDisplayValues(i.dataItem)),
          (l.selectedValue = t.activeEditor
            ? t.activeEditor.value
            : t.getCellData(o.row, o.col, !0)),
          wjcCore.addClass(r, n.dropDownCssClass),
          l.addEventListener(l.hostElement, 'click', function () {
            e._removeListBox(), t.focus(), e.finishEditing();
          }),
          l.lostFocus.addHandler(function () {
            e._removeListBox();
          }),
          l.selectedIndexChanged.addHandler(function () {
            var o = t.activeEditor;
            o &&
              ((o.value = e._lbx.selectedValue),
              o.dispatchEvent(e._evtInput),
              wjcCore.setSelectionRange(o, 0, o.value.length));
          });
        var s = t.cells.getCellElement(o.row, o.col);
        return (
          s
            ? wjcCore.showPopup(r, s, !1, !1, !1)
            : (wjcCore.showPopup(r, t.getCellBoundingRect(o.row, o.col)),
              (r[wjcCore.Control._OWNR_KEY] = t.hostElement)),
          l
        );
      }),
      (e.prototype._removeListBox = function () {
        var e = this._lbx;
        e &&
          ((this._lbx = null),
          wjcCore.hidePopup(e.hostElement, function () {
            e.dispose();
          }));
      }),
      e
    );
  })();
exports._EditHandler = _EditHandler;
var _AddNewHandler = (function () {
  function e(e) {
    (this._nrt = new _NewRowTemplate()),
      (this._g = e),
      (this._keydownBnd = this._keydown.bind(this)),
      this._attach();
  }
  return (
    Object.defineProperty(e.prototype, 'newRowAtTop', {
      get: function () {
        return this._top;
      },
      set: function (e) {
        e != this.newRowAtTop &&
          ((this._top = wjcCore.asBoolean(e)), this.updateNewRowTemplate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.updateNewRowTemplate = function () {
      var e = this._g,
        t = e.editableCollectionView,
        o = e.rows,
        i = t && t.canAddNew && e.allowAddNew && !e.isReadOnly,
        n = o.indexOf(this._nrt),
        r = this._top ? 0 : o.length - 1,
        l = !1;
      if (!i && n > -1) {
        var s = e.selection;
        s.row == n && e.select(s.row - 1, s.col), o.removeAt(n);
      } else
        i &&
          (n < 0 ? (l = !0) : n != r && (o.removeAt(n), (l = !0)),
          l && (this._top ? o.insert(0, this._nrt) : o.push(this._nrt)),
          this._nrt && this._nrt._setFlag(RowColFlags.ParentCollapsed, !1));
    }),
    (e.prototype._attach = function () {
      var e = this._g;
      e &&
        (e.beginningEdit.addHandler(this._beginningEdit, this),
        e.pastingCell.addHandler(this._beginningEdit, this),
        e.rowEditEnded.addHandler(this._rowEditEnded, this),
        e.loadedRows.addHandler(this.updateNewRowTemplate, this),
        e.hostElement.addEventListener('keydown', this._keydownBnd, !0));
    }),
    (e.prototype._detach = function () {
      var e = this._g;
      e &&
        (e.beginningEdit.removeHandler(this._beginningEdit),
        e.pastingCell.removeHandler(this._beginningEdit),
        e.rowEditEnded.removeHandler(this._rowEditEnded),
        e.loadedRows.removeHandler(this.updateNewRowTemplate),
        e.hostElement.removeEventListener('keydown', this._keydownBnd, !0));
    }),
    (e.prototype._keydown = function (e) {
      e.defaultPrevented ||
        e.keyCode != wjcCore.Key.Escape ||
        (null == this._g.activeEditor &&
          this._top &&
          this._nrt.dataItem &&
          ((this._nrt.dataItem = null), this._g.invalidate()));
    }),
    (e.prototype._beginningEdit = function (e, t) {
      if (!t.cancel) {
        var o = this._g.rows[t.row];
        if (wjcCore.tryCast(o, _NewRowTemplate)) {
          var i = this._g.editableCollectionView;
          if (i && i.canAddNew)
            if (this._top) {
              if (null == this._nrt.dataItem) {
                var n = null,
                  r = i.sourceCollection,
                  l = i.newItemCreator;
                (n = wjcCore.isFunction(l)
                  ? l()
                  : r && r.length
                  ? new r[0].constructor()
                  : {}),
                  (this._nrt.dataItem = n);
              }
            } else {
              n =
                i.currentAddItem && i.currentAddItem == o.dataItem
                  ? i.currentAddItem
                  : i.addNew();
              i.moveCurrentTo(n),
                this.updateNewRowTemplate(),
                this._g.refresh(!0),
                this._g.onRowAdded(t),
                t.cancel && i.cancelNew();
            }
        }
      }
    }),
    (e.prototype._rowEditEnded = function (e, t) {
      var o = this,
        i = this._g.editableCollectionView,
        n = this._nrt.dataItem;
      if (i)
        if (i.isAddingNew) i.commitNew();
        else if (n && !t.cancel) {
          this._nrt.dataItem = null;
          var r = i.addNew();
          for (var l in n) r[l] = n[l];
          this._g.onRowAdded(t),
            t.cancel ? i.cancelNew() : i.commitNew(),
            setTimeout(function () {
              o._g.select(0, o._g.columns.firstVisibleIndex),
                o.updateNewRowTemplate();
            }, 20);
        }
    }),
    e
  );
})();
exports._AddNewHandler = _AddNewHandler;
var _NewRowTemplate = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return __extends(t, e), t;
})(Row);
exports._NewRowTemplate = _NewRowTemplate;
var _ImeHandler = (function () {
  function e(t) {
    (this._g = t),
      (this._tbx = wjcCore.createElement(
        '<input class="wj-grid-editor wj-form-control wj-grid-ime"/>'
      )),
      wjcCore.setCss(this._tbx, e._cssHidden),
      t.cells.hostElement.parentElement.appendChild(this._tbx),
      this._updateImeFocus();
    var o = t.hostElement;
    t.addEventListener(
      this._tbx,
      'compositionstart',
      this._compositionstart.bind(this)
    ),
      t.addEventListener(o, 'blur', this._updateImeFocus.bind(this), !0),
      t.addEventListener(o, 'focus', this._updateImeFocus.bind(this), !0),
      t.addEventListener(o, 'mousedown', this._mousedown.bind(this), !0),
      t.addEventListener(o, 'mouseup', this._mouseup.bind(this), !0),
      t.cellEditEnded.addHandler(this._cellEditEnded, this),
      t.selectionChanged.addHandler(this._updateImeFocus, this);
  }
  return (
    (e.prototype.dispose = function () {
      var e = this._g,
        t = e.hostElement;
      e.removeEventListener(this._tbx, 'compositionstart'),
        e.removeEventListener(t, 'blur'),
        e.removeEventListener(t, 'focus'),
        e.removeEventListener(t, 'mousedown'),
        e.removeEventListener(t, 'mouseup'),
        e.cellEditEnded.removeHandler(this._cellEditEnded),
        e.selectionChanged.removeHandler(this._updateImeFocus),
        wjcCore.removeChild(this._tbx);
    }),
    (e.prototype._cellEditEnded = function () {
      wjcCore.setCss(this._tbx, e._cssHidden), (this._tbx.value = '');
    }),
    (e.prototype._compositionstart = function () {
      var e = this,
        t = this._g;
      if (null == t.activeEditor) {
        var o = t._selHdl.selection;
        if (t.startEditing(!1, o.row, o.col, !1)) {
          o = t.editRange;
          var i = t.cells.hostElement,
            n = t.columns[o.col].pos + i.offsetLeft,
            r = t.rows[o.row].pos + i.offsetTop,
            l = t.getCellBoundingRect(o.row, o.col);
          if (!o.isSingleCell) {
            var s = t.cells.getCellElement(o.row, o.col);
            (l.width = s.offsetWidth), (l.height = s.offsetHeight);
          }
          o.row < t.frozenRows && (r += i.parentElement.scrollTop),
            o.col < t.frozenColumns && (n += i.parentElement.scrollLeft);
          var a = t.activeEditor,
            c = a && a.parentElement ? a.parentElement.style.zIndex : '';
          wjcCore.setCss(this._tbx, {
            position: 'absolute',
            pointerEvents: '',
            opacity: '',
            left: n,
            top: r,
            width: l.width - 1,
            height: l.height - 1,
            zIndex: c,
          }),
            a instanceof HTMLInputElement &&
              ['minLength', 'maxLength', 'pattern'].forEach(function (t) {
                wjcCore.setAttribute(e._tbx, t, a.getAttribute(t));
              }),
            (t._edtHdl._edt = this._tbx);
        }
      }
    }),
    (e.prototype._mousedown = function (e) {
      (this._mouseDown = !0), this._updateImeFocus();
    }),
    (e.prototype._mouseup = function (e) {
      (this._mouseDown = !1), this._updateImeFocus();
    }),
    (e.prototype._updateImeFocus = function () {
      var e = this._g,
        t = wjcCore.getActiveElement();
      if (
        !e.activeEditor &&
        !e.isTouching &&
        !this._mouseDown &&
        wjcCore.contains(e.hostElement, t)
      ) {
        var o = this._tbx;
        this._enableIme()
          ? t != o && ((o.disabled = !1), o.select())
          : (o.disabled = !0);
      }
    }),
    (e.prototype._enableIme = function () {
      var e = this._g,
        t = e.selection,
        o = t.isValid
          ? e._getBindingColumn(e.cells, t.row, e.columns[t.col])
          : null;
      return (
        !!e.canEditCell(t.row, t.col) &&
        !(!o || o.dataType == wjcCore.DataType.Boolean)
      );
    }),
    (e._cssHidden = {
      position: 'fixed',
      pointerEvents: 'none',
      opacity: 0,
      left: -10,
      top: -10,
      width: 0,
    }),
    e
  );
})();
exports._ImeHandler = _ImeHandler;
