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
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
      };
    return function (t, r) {
      function o() {
        this.constructor = t;
      }
      e(t, r),
        (t.prototype =
          null === r
            ? Object.create(r)
            : ((o.prototype = r.prototype), new o()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcGrid = require('wijmo/wijmo.grid'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.grid.multirow');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.grid = window.wijmo.grid || {}),
  (window.wijmo.grid.multirow = wjcSelf);
var _MultiRow = (function (e) {
  function t(t, r, o) {
    var n = e.call(this, t) || this;
    return (n._idxData = r), (n._idxRecord = o), n;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'recordIndex', {
      get: function () {
        return this._idxRecord;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dataIndex', {
      get: function () {
        return this._idxData;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcGrid.Row);
exports._MultiRow = _MultiRow;
var _Cell = (function (e) {
  function t(t) {
    var r = e.call(this) || this;
    return (
      (r._row = r._col = 0),
      (r._rowspan = r._colspan = 1),
      t && wjcCore.copy(r, t),
      r
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'colspan', {
      get: function () {
        return this._colspan;
      },
      set: function (e) {
        this._colspan = wjcCore.asInt(e, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcGrid.Column);
exports._Cell = _Cell;
var _CellGroup = (function (e) {
  function t(t, r) {
    var o = e.call(this) || this;
    if (((o._colstart = 0), (o._g = t), r && wjcCore.copy(o, r), !o._cells))
      throw 'Cell group with no cells?';
    for (var n = 0, l = 0, s = 0, i = 0; i < o._cells.length; i++)
      l + (a = o._cells[i]).colspan > o._colspan && (n++, (l = 0)),
        (a._row = n),
        (a._col = l),
        (l += a.colspan),
        (s += a.colspan);
    (o._rowspan = n + 1), o._colspan > s && (o._colspan = s);
    for (i = 0; i < o._cells.length; i++) {
      var a = o._cells[i];
      (i == o._cells.length - 1 || o._cells[i + 1]._row > a._row) &&
        ((l = a._col), (a._colspan = o._colspan - l));
    }
    return o;
  }
  return (
    __extends(t, e),
    (t.prototype._copy = function (e, t) {
      if ('cells' == e) {
        if (((this._cells = []), wjcCore.isArray(t)))
          for (var r = 0; r < t.length; r++) {
            var o = new _Cell(t[r]);
            !t[r].header &&
              o.binding &&
              (t.header = wjcCore.toHeaderCase(o.binding)),
              this._cells.push(o),
              (this._colspan = Math.max(this._colspan, o.colspan));
          }
        return !0;
      }
      return !1;
    }),
    Object.defineProperty(t.prototype, 'cells', {
      get: function () {
        return this._cells;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.closeGroup = function (e) {
      if (e > this._rowspan) {
        for (t = 0; t < this._cells.length; t++)
          (r = this._cells[t])._row == this._rowspan - 1 &&
            (r._rowspan = e - r._row);
        this._rowspan = e;
      }
      (this._cols = new wjcGrid.ColumnCollection(
        this._g,
        this._g.columns.defaultSize
      )),
        (this._rng = new Array(e * this._colspan));
      for (var t = 0; t < this._cells.length; t++)
        for (var r = this._cells[t], o = 0; o < r._rowspan; o++)
          for (var n = 0; n < r._colspan; n++) {
            var l = (r._row + o) * this._colspan + r._col + n;
            this._cols.setAt(l, r);
            var s = new wjcGrid.CellRange(
              0 - o,
              0 - n,
              0 - o + r._rowspan - 1,
              0 - n + r._colspan - 1
            );
            s.isSingleCell || (this._rng[l] = s);
          }
      this._rng[-1] = new wjcGrid.CellRange(
        0,
        this._colstart,
        0,
        this._colstart + this._colspan - 1
      );
    }),
    (t.prototype.getColumnWidth = function (e) {
      for (var t = 0; t < this._cells.length; t++) {
        var r = this._cells[t];
        if (r._col == e && 1 == r.colspan) return r.width;
      }
      return null;
    }),
    (t.prototype.getMergedRange = function (e, t, r) {
      if (t < 0) return this._rng[-1];
      var o = e.rows[t],
        n = null != o.recordIndex ? o.recordIndex : t % this._rowspan,
        l = r - this._colstart,
        s = this._rng[n * this._colspan + l];
      return (
        e.cellType == wjcGrid.CellType.ColumnHeader && t++,
        s
          ? new wjcGrid.CellRange(t + s.row, r + s.col, t + s.row2, r + s.col2)
          : null
      );
    }),
    (t.prototype.getBindingColumn = function (e, t, r) {
      if (t < 0) return this;
      var o = e.rows[t],
        n = o && null != o.recordIndex ? o.recordIndex : t % this._rowspan,
        l = r - this._colstart;
      return this._cols[n * this._colspan + l];
    }),
    (t.prototype.getColumn = function (e) {
      return this._cols.getColumn(e);
    }),
    t
  );
})(_Cell);
exports._CellGroup = _CellGroup;
var _MergeManager = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.getMergedRange = function (t, r, o, n) {
      void 0 === n && (n = !0);
      var l = t.grid;
      switch (t.cellType) {
        case wjcGrid.CellType.Cell:
        case wjcGrid.CellType.RowHeader:
          if (t.rows[r] instanceof wjcGrid.GroupRow)
            return e.prototype.getMergedRange.call(this, t, r, o, n);
      }
      switch (t.cellType) {
        case wjcGrid.CellType.Cell:
        case wjcGrid.CellType.ColumnHeader:
          var s = l._cellGroupsByColumn[o];
          wjcCore.assert(s instanceof _CellGroup, 'Failed to get the group!');
          var i =
            t.cellType == wjcGrid.CellType.ColumnHeader
              ? s.getMergedRange(t, r - 1, o)
              : s.getMergedRange(t, r, o);
          if (i && t.columns.frozen) {
            a = t.columns.frozen;
            i.col < a &&
              i.col2 >= a &&
              (o < a ? (i.col2 = a - 1) : (i.col = a));
          }
          if (i && t.rows.frozen && t.cellType == wjcGrid.CellType.Cell) {
            var a = t.rows.frozen;
            i.row < a &&
              i.row2 >= a &&
              (r < a ? (i.row2 = a - 1) : (i.row = a));
          }
          return i;
        case wjcGrid.CellType.RowHeader:
          var c = l._rowsPerItem,
            d = r - t.rows[r].recordIndex,
            p = Math.min(d + c - 1, t.rows.length - 1);
          return new wjcGrid.CellRange(d, 0, p, t.columns.length - 1);
        case wjcGrid.CellType.TopLeft:
          return new wjcGrid.CellRange(
            0,
            0,
            t.rows.length - 1,
            t.columns.length - 1
          );
      }
      return null;
    }),
    t
  );
})(wjcGrid.MergeManager);
exports._MergeManager = _MergeManager;
var _AddNewHandler = (function (e) {
  function t(t) {
    return t._addHdl._detach(), e.call(this, t) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.updateNewRowTemplate = function () {
      for (
        var e = this._g.editableCollectionView,
          t = this._g,
          r = t.rows,
          o = e && e.canAddNew && t.allowAddNew && !t.isReadOnly,
          n = !0,
          l = r.length - t.rowsPerItem;
        l < r.length;
        l++
      )
        if (!(r[l] instanceof _NewRowTemplate)) {
          n = !1;
          break;
        }
      if (o && !n)
        for (l = 0; l < t.rowsPerItem; l++) {
          var s = new _NewRowTemplate(l);
          r.push(s);
        }
      if (!o && n)
        for (l = 0; l < r.length; l++)
          r[l] instanceof _NewRowTemplate && (r.removeAt(l), l--);
    }),
    t
  );
})(wjcGrid._AddNewHandler);
exports._AddNewHandler = _AddNewHandler;
var _NewRowTemplate = (function (e) {
    function t(t) {
      var r = e.call(this) || this;
      return (r._idxRecord = t), r;
    }
    return (
      __extends(t, e),
      Object.defineProperty(t.prototype, 'recordIndex', {
        get: function () {
          return this._idxRecord;
        },
        enumerable: !0,
        configurable: !0,
      }),
      t
    );
  })(wjcGrid._NewRowTemplate),
  MultiRow = (function (e) {
    function t(t, r) {
      var o = e.call(this, t) || this;
      (o._rowsPerItem = 1),
        (o._cellBindingGroups = []),
        (o._centerVert = !0),
        (o._collapsedHeaders = !1),
        (o.collapsedHeadersChanging = new wjcCore.Event()),
        (o.collapsedHeadersChanged = new wjcCore.Event()),
        wjcCore.addClass(o.hostElement, 'wj-multirow');
      var n = o.columnHeaders.hostElement.parentElement,
        l = wjcCore.createElement(
          '<div class="wj-hdr-collapse"><span></span></div>'
        );
      (l.style.display = 'none'),
        n.appendChild(l),
        (o._btnCollapse = l),
        o._updateButtonGlyph(),
        o.addEventListener(
          l,
          'mousedown',
          function (e) {
            switch (o.collapsedHeaders) {
              case null:
              case !1:
                (o._collapsedHeadersWasNull = null == o.collapsedHeaders),
                  (o.collapsedHeaders = !0);
                break;
              case !0:
                o.collapsedHeaders = !!o._collapsedHeadersWasNull && null;
            }
            e.preventDefault(), o.focus();
          },
          !0
        ),
        (o.autoGenerateColumns = !1),
        (o.mergeManager = new _MergeManager(o));
      var s = o.hostElement;
      return (
        o.removeEventListener(s, 'dragover'),
        o.removeEventListener(s, 'dragleave'),
        o.removeEventListener(s, 'dragdrop'),
        (o._addHdl = new _AddNewHandler(o)),
        o.formatItem.addHandler(o._formatItem, o),
        o.addEventListener(
          o.rowHeaders.hostElement,
          'click',
          function (e) {
            if (
              !e.defaultPrevented &&
              o.selectionMode != wjcGrid.SelectionMode.None
            ) {
              var t = o.hitTest(e);
              if (t.panel == o.rowHeaders && t.row > -1) {
                var r = o.selection,
                  n = o.rows[r.topRow],
                  l =
                    o.selectionMode != wjcGrid.SelectionMode.Row
                      ? o.rows[r.bottomRow]
                      : n;
                if (n && null != n.recordIndex) {
                  var s = n.index - n.recordIndex,
                    i = l.index - l.recordIndex + o.rowsPerItem - 1,
                    a = o.columns.length - 1,
                    c =
                      r.row != r.topRow
                        ? new wjcGrid.CellRange(i, 0, s, a)
                        : new wjcGrid.CellRange(s, 0, i, a);
                  o.select(c), e.preventDefault();
                }
              }
            }
          },
          !0
        ),
        o.initialize(r),
        o
      );
    }
    return (
      __extends(t, e),
      Object.defineProperty(t.prototype, 'layoutDefinition', {
        get: function () {
          return this._layoutDef;
        },
        set: function (e) {
          (this._layoutDef = wjcCore.asArray(e)),
            (this._rowsPerItem = 1),
            (this._cellBindingGroups = this._parseCellGroups(this._layoutDef));
          for (var t = 0; t < this._cellBindingGroups.length; t++) {
            var r = this._cellBindingGroups[t];
            this._rowsPerItem = Math.max(this._rowsPerItem, r._rowspan);
          }
          this._bindGrid(!0);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'rowsPerItem', {
        get: function () {
          return this._rowsPerItem;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.getBindingColumn = function (e, t, r) {
        return this._getBindingColumn(e, t, e.columns[r]);
      }),
      (t.prototype.getColumn = function (e) {
        for (var t = this._cellBindingGroups, r = 0; r < t.length; r++) {
          var o = t[r].getColumn(e);
          if ((t[r].getBindingColumn, o)) return o;
        }
        return null;
      }),
      Object.defineProperty(t.prototype, 'centerHeadersVertically', {
        get: function () {
          return this._centerVert;
        },
        set: function (e) {
          e != this._centerVert &&
            ((this._centerVert = wjcCore.asBoolean(e)), this.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'collapsedHeaders', {
        get: function () {
          return this._collapsedHeaders;
        },
        set: function (e) {
          if (e != this._collapsedHeaders) {
            var t = new wjcCore.CancelEventArgs();
            this.onCollapsedHeadersChanging(t) &&
              ((this._collapsedHeaders = wjcCore.asBoolean(e, !0)),
              this._updateCollapsedHeaders(),
              this._updateButtonGlyph(),
              this.onCollapsedHeadersChanged(t));
          }
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'showHeaderCollapseButton', {
        get: function () {
          return '' == this._btnCollapse.style.display;
        },
        set: function (e) {
          e != this.showHeaderCollapseButton &&
            (this._btnCollapse.style.display = wjcCore.asBoolean(e)
              ? ''
              : 'none');
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.onCollapsedHeadersChanging = function (e) {
        return this.collapsedHeadersChanging.raise(this, e), !e.cancel;
      }),
      (t.prototype.onCollapsedHeadersChanged = function (e) {
        this.collapsedHeadersChanged.raise(this, e);
      }),
      (t.prototype._addBoundRow = function (e, t) {
        for (var r = e[t], o = 0; o < this._rowsPerItem; o++)
          this.rows.push(new _MultiRow(r, t, o));
      }),
      (t.prototype._addNode = function (e, t, r) {
        this._addBoundRow(e, t);
      }),
      (t.prototype._bindColumns = function () {
        for (
          var e = this.columnHeaders.rows, t = this._rowsPerItem + 1;
          e.length > t;

        )
          e.removeAt(e.length - 1);
        for (; e.length < t; ) e.push(new wjcGrid.Row());
        this._updateCollapsedHeaders(),
          this.columns.clear(),
          (this._cellGroupsByColumn = {});
        var r = this.collectionView;
        if (
          (r &&
            r.sourceCollection &&
            r.sourceCollection.length &&
            r.sourceCollection[0],
          this._cellBindingGroups)
        )
          for (var o = 0; o < this._cellBindingGroups.length; o++)
            for (
              var n = this._cellBindingGroups[o], l = 0;
              l < n._colspan;
              l++
            ) {
              this._cellGroupsByColumn[this.columns.length] = n;
              for (
                var s = new wjcGrid.Column(), i = 0;
                i < n.cells.length;
                i++
              ) {
                var a = n.cells[i];
                if (a._col == l) {
                  a.width && (s.width = a.width),
                    a.binding && (s.binding = a.binding),
                    a.format && (s.format = a.format),
                    a.aggregate != wjcCore.Aggregate.None &&
                      (s.aggregate = a.aggregate);
                  break;
                }
              }
              this.columns.push(s);
            }
      }),
      (t.prototype._updateCollapsedHeaders = function () {
        var e = this.columnHeaders.rows,
          t = this.collapsedHeaders;
        e[0].visible = 0 != t;
        for (var r = 1; r < e.length; r++) e[r].visible = 1 != t;
      }),
      (t.prototype._updateColumnTypes = function () {
        e.prototype._updateColumnTypes.call(this);
        var t = this.collectionView;
        if (wjcCore.hasItems(t))
          for (
            var r = t.items[0], o = 0;
            o < this._cellBindingGroups.length;
            o++
          )
            for (
              var n = this._cellBindingGroups[o], l = 0;
              l < n._cols.length;
              l++
            ) {
              var s = n._cols[l];
              null == s.dataType &&
                s._binding &&
                (s.dataType = wjcCore.getType(s._binding.getValue(r)));
            }
      }),
      (t.prototype._getBindingColumn = function (e, t, r) {
        if (e == this.cells || e == this.columnHeaders) {
          var o = this._cellGroupsByColumn[r.index];
          e == this.columnHeaders && t--,
            (r = o.getBindingColumn(e, t, r.index));
        }
        return r;
      }),
      (t.prototype._cvCollectionChanged = function (e, t) {
        if (this.autoGenerateColumns && 0 == this.columns.length)
          this._bindGrid(!0);
        else
          switch (t.action) {
            case wjcCore.NotifyCollectionChangedAction.Change:
              this.invalidate();
              break;
            case wjcCore.NotifyCollectionChangedAction.Add:
              if (t.index == this.collectionView.items.length - 1) {
                for (
                  var r = this.rows.length;
                  r > 0 && this.rows[r - 1] instanceof wjcGrid._NewRowTemplate;

                )
                  r--;
                for (var o = 0; o < this._rowsPerItem; o++)
                  this.rows.insert(r + o, new _MultiRow(t.item, t.index, o));
                return;
              }
              wjcCore.assert(!1, 'added item should be the last one.');
              break;
            default:
              this._bindGrid(!1);
          }
      }),
      (t.prototype._parseCellGroups = function (e) {
        var t = [],
          r = 1;
        if (e) {
          for (var o = 0, n = 0; o < e.length; o++) {
            var l = new _CellGroup(this, e[o]);
            (l._colstart = n),
              (n += l._colspan),
              (r = Math.max(r, l._rowspan)),
              t.push(l);
          }
          for (o = 0; o < t.length; o++) t[o].closeGroup(r);
        }
        return t;
      }),
      (t.prototype._formatItem = function (e, t) {
        var r = this._rowsPerItem,
          o = t.panel.cellType,
          n = t.panel.rows[t.range.row],
          l = t.panel.rows[t.range.row2];
        if (
          (o == wjcGrid.CellType.ColumnHeader &&
            wjcCore.toggleClass(t.cell, 'wj-group-header', 0 == t.range.row),
          o == wjcGrid.CellType.Cell || o == wjcGrid.CellType.ColumnHeader)
        ) {
          var s = this._cellGroupsByColumn[t.col];
          wjcCore.assert(s instanceof _CellGroup, 'Failed to get the group!'),
            wjcCore.toggleClass(
              t.cell,
              'wj-group-start',
              s._colstart == t.range.col
            ),
            wjcCore.toggleClass(
              t.cell,
              'wj-group-end',
              s._colstart + s._colspan - 1 == t.range.col2
            );
        }
        if (
          (r > 1 &&
            ((o != wjcGrid.CellType.Cell && o != wjcGrid.CellType.RowHeader) ||
              (wjcCore.toggleClass(
                t.cell,
                'wj-record-start',
                n instanceof _MultiRow && 0 == n.recordIndex
              ),
              wjcCore.toggleClass(
                t.cell,
                'wj-record-end',
                l instanceof _MultiRow && l.recordIndex == r - 1
              ))),
          this.showAlternatingRows &&
            wjcCore.toggleClass(
              t.cell,
              'wj-alt',
              n instanceof _MultiRow && n.dataIndex % 2 != 0
            ),
          this._centerVert)
        )
          if (t.cell.hasChildNodes && t.range.rowSpan > 1) {
            var i = wjcCore.createElement(
                '<div style="display:table-cell;vertical-align:middle"></div>'
              ),
              a = document.createRange();
            a.selectNodeContents(t.cell),
              a.surroundContents(i),
              wjcCore.setCss(t.cell, {
                display: 'table',
                tableLayout: 'fixed',
                paddingTop: 0,
                paddingBottom: 0,
              });
          } else {
            var c = t.cell.querySelector('input') ? '0px' : '';
            wjcCore.setCss(t.cell, {
              display: '',
              tableLayout: '',
              paddingTop: c,
              paddingBottom: c,
            });
          }
      }),
      (t.prototype._updateButtonGlyph = function () {
        var e = this._btnCollapse.querySelector('span');
        e instanceof HTMLElement &&
          (e.className = this.collapsedHeaders
            ? 'wj-glyph-left'
            : 'wj-glyph-down-left');
      }),
      t
    );
  })(wjcGrid.FlexGrid);
exports.MultiRow = MultiRow;
