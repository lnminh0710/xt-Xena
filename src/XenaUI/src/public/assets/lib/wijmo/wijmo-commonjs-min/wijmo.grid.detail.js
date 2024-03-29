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
        for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
      };
    return function (t, i) {
      function o() {
        this.constructor = t;
      }
      e(t, i),
        (t.prototype =
          null === i
            ? Object.create(i)
            : ((o.prototype = i.prototype), new o()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcGrid = require('wijmo/wijmo.grid'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.grid.detail');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.grid = window.wijmo.grid || {}),
  (window.wijmo.grid.detail = wjcSelf);
var DetailVisibilityMode;
!(function (e) {
  (e[(e.Code = 0)] = 'Code'),
    (e[(e.Selection = 1)] = 'Selection'),
    (e[(e.ExpandSingle = 2)] = 'ExpandSingle'),
    (e[(e.ExpandMulti = 3)] = 'ExpandMulti');
})(
  (DetailVisibilityMode =
    exports.DetailVisibilityMode || (exports.DetailVisibilityMode = {}))
);
var FlexGridDetailProvider = (function () {
  function e(e, t) {
    var i = this;
    (this._mode = DetailVisibilityMode.ExpandSingle),
      (this._animated = !1),
      (this._g = e),
      (e.mergeManager = new DetailMergeManager(e)),
      e.rowHeaders.hostElement.addEventListener(
        'click',
        this._hdrClick.bind(this)
      ),
      e.formatItem.addHandler(this._formatItem, this),
      e.selectionChanged.addHandler(this._selectionChanged, this),
      e.resizedRow.addHandler(this._resizedRow, this),
      e.loadingRows.addHandler(function () {
        i.hideDetail();
      }),
      e.draggingRow.addHandler(function (e, t) {
        t.row < e.rows.length - 1 &&
          e.rows[t.row + 1] instanceof DetailRow &&
          ((t.cancel = !0), i.hideDetail(t.row));
      }),
      e.formatItem.addHandler(function (e, t) {
        t.panel == e.cells &&
          e.rows[t.row] instanceof DetailRow &&
          (t.cell.style.left = '0');
      }),
      t && wjcCore.copy(this, t);
  }
  return (
    Object.defineProperty(e.prototype, 'grid', {
      get: function () {
        return this._g;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'detailVisibilityMode', {
      get: function () {
        return this._mode;
      },
      set: function (e) {
        e != this._mode &&
          ((this._mode = wjcCore.asEnum(e, DetailVisibilityMode)),
          this.hideDetail(),
          this._g.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'maxHeight', {
      get: function () {
        return this._maxHeight;
      },
      set: function (e) {
        this._maxHeight = wjcCore.asNumber(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isAnimated', {
      get: function () {
        return this._animated;
      },
      set: function (e) {
        e != this._animated && (this._animated = wjcCore.asBoolean(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'createDetailCell', {
      get: function () {
        return this._createDetailCellFn;
      },
      set: function (e) {
        this._createDetailCellFn = wjcCore.asFunction(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'disposeDetailCell', {
      get: function () {
        return this._disposeDetailCellFn;
      },
      set: function (e) {
        this._disposeDetailCellFn = wjcCore.asFunction(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'rowHasDetail', {
      get: function () {
        return this._rowHasDetailFn;
      },
      set: function (e) {
        this._rowHasDetailFn = wjcCore.asFunction(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getDetailRow = function (e) {
      var t = this._g.rows;
      return (
        (e = this._toIndex(e)),
        t[e] instanceof DetailRow
          ? t[e]
          : e < t.length - 1 && t[e + 1] instanceof DetailRow
          ? t[e + 1]
          : null
      );
    }),
    (e.prototype.isDetailVisible = function (e) {
      return null != this.getDetailRow(e);
    }),
    (e.prototype.isDetailAvailable = function (e) {
      this._g.rows;
      return (e = this._toIndex(e)), this._hasDetail(e);
    }),
    (e.prototype.hideDetail = function (e) {
      var t = this._g.rows;
      if (null != e) {
        !(t[(e = this._toIndex(e))] instanceof DetailRow) &&
          e < t.length - 1 &&
          t[e + 1] instanceof DetailRow &&
          e++;
        var i = t[e];
        i instanceof DetailRow &&
          (this.disposeDetailCell && this.disposeDetailCell(i),
          wjcCore.Control.disposeAll(i.detail),
          t.removeAt(e));
      } else
        for (var o = 0; o < t.length; o++)
          t[o] instanceof DetailRow && this.hideDetail(o);
    }),
    (e.prototype.showDetail = function (e, t) {
      void 0 === t && (t = !1);
      var i = this._g,
        o = i.rows;
      if (((e = this._toIndex(e)) > 0 && o[e] instanceof DetailRow && e--, t)) {
        for (var n = i.selection, r = !1, l = 0; l < o.length - 1; l++)
          l != e &&
            o[l + 1] instanceof DetailRow &&
            (this.hideDetail(l),
            l < e && e--,
            l < n.row && (n.row--, n.row2--, (r = !0)));
        r && i.select(n, !1);
      }
      if (!this.isDetailVisible(e) && this._hasDetail(e)) {
        var a = new DetailRow(o[e]);
        if (((a.detail = this._createDetailCell(o[e])), a.detail))
          if (this._animated) {
            var s = a.detail.style;
            (s.transform = 'translateY(-100%)'),
              (s.opacity = '0'),
              o.insert(e + 1, a),
              wjcCore.animate(function (t) {
                t < 1
                  ? ((s.transform =
                      'translateY(' + (100 * -(1 - t)).toFixed(0) + '%)'),
                    (s.opacity = (t * t).toString()))
                  : ((s.transform = ''),
                    (s.opacity = ''),
                    wjcCore.Control.invalidateAll(a.detail),
                    i.scrollIntoView(e, -1));
              });
          } else o.insert(e + 1, a), i.scrollIntoView(e, -1);
      }
    }),
    (e.prototype._toIndex = function (e) {
      return (
        e instanceof wjcGrid.Row && (e = e.index), wjcCore.asNumber(e, !1, !0)
      );
    }),
    (e.prototype._hdrClick = function (e) {
      if (!e.defaultPrevented)
        switch (this._mode) {
          case DetailVisibilityMode.ExpandMulti:
          case DetailVisibilityMode.ExpandSingle:
            var t = this._g,
              i = t.hitTest(e);
            if (i.row > -1) {
              t.rows[i.row];
              this.isDetailVisible(i.row)
                ? this.hideDetail(i.row)
                : (t.select(
                    new wjcGrid.CellRange(i.row, 0, i.row, t.columns.length - 1)
                  ),
                  this.showDetail(
                    i.row,
                    this._mode == DetailVisibilityMode.ExpandSingle
                  )),
                e.preventDefault();
            }
        }
    }),
    (e.prototype._selectionChanged = function (e, t) {
      var i = this;
      this._mode == DetailVisibilityMode.Selection &&
        (this._toSel && clearTimeout(this._toSel),
        (this._toSel = setTimeout(function () {
          e.selection.row > -1
            ? i.showDetail(e.selection.row, !0)
            : i.hideDetail();
        }, 300)));
    }),
    (e.prototype._formatItem = function (e, t) {
      var i = this._g,
        o = t.panel.rows[t.row];
      if (t.panel == i.cells && o instanceof DetailRow && null != o.detail)
        if (
          (wjcCore.addClass(t.cell, 'wj-detail'),
          (t.cell.textContent = ''),
          (t.cell.style.textAlign = ''),
          t.cell.appendChild(o.detail),
          null == o.height)
        ) {
          wjcCore.Control.refreshAll(t.cell);
          var n = getComputedStyle(t.cell),
            r =
              o.detail.scrollHeight +
              parseInt(n.paddingTop) +
              parseInt(n.paddingBottom);
          this._maxHeight > 0 && r > this._maxHeight && (r = this._maxHeight),
            (o.height = r),
            o.detail.style.height || (o.detail.style.height = '100%');
          var l = o.detail.querySelector('.wj-flexgrid');
          l && !l.style.height && (l.style.height = '100%');
        } else
          setTimeout(function () {
            wjcCore.Control.refreshAll(o.detail);
          });
      if (
        (this._mode == DetailVisibilityMode.ExpandMulti ||
          this._mode == DetailVisibilityMode.ExpandSingle) &&
        t.panel == i.rowHeaders &&
        0 == t.col &&
        this._hasDetail(t.row)
      ) {
        var a =
          t.row < i.rows.length - 1 && i.rows[t.row + 1] instanceof DetailRow;
        t.cell.innerHTML = a
          ? '<span class="wj-glyph-minus"></span>'
          : '<span class="wj-glyph-plus"></span>';
      }
    }),
    (e.prototype._resizedRow = function (e, t) {
      var i = t.panel.rows[t.row];
      i instanceof DetailRow &&
        i.detail &&
        wjcCore.Control.refreshAll(i.detail);
    }),
    (e.prototype._hasVisibleDetail = function (e) {
      return !(
        e instanceof DetailRow ||
        e instanceof wjcGrid.GroupRow ||
        e instanceof wjcGrid._NewRowTemplate
      );
    }),
    (e.prototype._hasDetail = function (e) {
      return (
        !wjcCore.isFunction(this._rowHasDetailFn) ||
        this._rowHasDetailFn(this._g.rows[e])
      );
    }),
    (e.prototype._createDetailCell = function (e, t) {
      return this.createDetailCell ? this.createDetailCell(e, t) : null;
    }),
    e
  );
})();
exports.FlexGridDetailProvider = FlexGridDetailProvider;
var DetailMergeManager = (function (e) {
  function t(t) {
    return e.call(this, t) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.getMergedRange = function (t, i, o, n) {
      switch ((void 0 === n && (n = !0), t.cellType)) {
        case wjcGrid.CellType.Cell:
          if (t.rows[i] instanceof DetailRow)
            return new wjcGrid.CellRange(i, 0, i, t.columns.length - 1);
          break;
        case wjcGrid.CellType.RowHeader:
          if (t.rows[i] instanceof DetailRow)
            return new wjcGrid.CellRange(i - 1, o, i, o);
          if (i < t.rows.length - 1 && t.rows[i + 1] instanceof DetailRow)
            return new wjcGrid.CellRange(i, o, i + 1, o);
      }
      return e.prototype.getMergedRange.call(this, t, i, o, n);
    }),
    t
  );
})(wjcGrid.MergeManager);
exports.DetailMergeManager = DetailMergeManager;
var DetailRow = (function (e) {
  function t(t) {
    var i = e.call(this) || this;
    return (i.isReadOnly = !0), i;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'detail', {
      get: function () {
        return this._detail;
      },
      set: function (e) {
        this._detail = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcGrid.Row);
exports.DetailRow = DetailRow;
