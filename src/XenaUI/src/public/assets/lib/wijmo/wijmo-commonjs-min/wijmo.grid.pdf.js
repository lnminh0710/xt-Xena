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
function tryGetModuleWijmoGridMultirow() {
  var e, t;
  return (e = window.wijmo) && (t = e.grid) && t.multirow;
}
function tryGetModuleWijmoGridSheet() {
  var e, t;
  return (e = window.wijmo) && (t = e.grid) && t.sheet;
}
function tryGetModuleWijmoOlap() {
  var e;
  return (e = window.wijmo) && e.olap;
}
function _merge(e, t, r) {
  if ((void 0 === r && (r = !1), t && e))
    for (var o in t) {
      var i = t[o],
        n = e[o];
      if (wjcCore.isObject(i)) {
        if (void 0 === n || (!wjcCore.isObject(n) && r)) {
          if (wjcCore.isFunction(i.clone)) {
            e[o] = n = i.clone();
            continue;
          }
          e[o] = n = {};
        }
        wjcCore.isObject(n) && _merge(e[o], i, r);
      } else (void 0 === n || (r && void 0 !== i)) && (e[o] = i);
    }
  return e;
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
var wjcPdf = require('wijmo/wijmo.pdf'),
  wjcGrid = require('wijmo/wijmo.grid'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.grid.pdf');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.grid = window.wijmo.grid || {}),
  (window.wijmo.grid.pdf = wjcSelf);
var ScaleMode;
!(function (e) {
  (e[(e.ActualSize = 0)] = 'ActualSize'),
    (e[(e.PageWidth = 1)] = 'PageWidth'),
    (e[(e.SinglePage = 2)] = 'SinglePage');
})((ScaleMode = exports.ScaleMode || (exports.ScaleMode = {})));
var ExportMode;
!(function (e) {
  (e[(e.All = 0)] = 'All'), (e[(e.Selection = 1)] = 'Selection');
})((ExportMode = exports.ExportMode || (exports.ExportMode = {})));
var PdfFormatItemEventArgs = (function (e) {
  function t(t, r, o, i, n, l, a, s, d) {
    var c = e.call(this, t, r) || this;
    return (
      (c.cancelBorders = !1),
      (c._cell = wjcCore.asType(o, HTMLElement, !0)),
      (c._canvas = i),
      (c._clientRect = n),
      (c._contentRect = l),
      (c._textTop = a),
      (c._style = s),
      (c._getFormattedCell = d),
      c
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'canvas', {
      get: function () {
        return this._canvas;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'cell', {
      get: function () {
        return this._cell;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'clientRect', {
      get: function () {
        return this._clientRect;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'contentRect', {
      get: function () {
        return this._contentRect;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getFormattedCell = function () {
      return wjcCore.asFunction(this._getFormattedCell)();
    }),
    Object.defineProperty(t.prototype, 'style', {
      get: function () {
        return this._style;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'textTop', {
      get: function () {
        return this._textTop;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcGrid.CellRangeEventArgs);
exports.PdfFormatItemEventArgs = PdfFormatItemEventArgs;
var globCell,
  FlexGridPdfConverter = (function () {
    function e() {}
    return (
      (e.draw = function (e, t, r, o, i) {
        wjcCore.assert(!!e, 'The flex argument cannot be null.'),
          wjcCore.assert(!!t, 'The doc argument cannot be null.');
        var n = _merge({}, i);
        _merge(n, this.DefaultDrawSettings),
          (n.scaleMode =
            null == r
              ? ScaleMode.ActualSize
              : null == o
              ? ScaleMode.PageWidth
              : ScaleMode.SinglePage);
        try {
          n.recalculateStarWidths &&
            e.columns._updateStarSizes(wjcPdf.ptToPx(t.width)),
            this._draw(e, t, null, r, o, n);
        } finally {
          n.recalculateStarWidths && e.invalidate(!0);
        }
      }),
      (e.drawToPosition = function (e, t, r, o, i, n) {
        wjcCore.assert(!!e, 'The flex argument cannot be null.'),
          wjcCore.assert(!!t, 'The doc argument cannot be null.'),
          wjcCore.assert(!!r, 'The point argument cannot be null.');
        var l = _merge({}, n);
        _merge(l, this.DefaultDrawSettings),
          (l.scaleMode =
            null == o
              ? ScaleMode.ActualSize
              : null == i
              ? ScaleMode.PageWidth
              : ScaleMode.SinglePage);
        try {
          l.recalculateStarWidths &&
            e.columns._updateStarSizes(wjcPdf.ptToPx(t.width)),
            this._draw(e, t, r, o, i, l);
        } finally {
          l.recalculateStarWidths && e.invalidate(!0);
        }
      }),
      (e.export = function (e, t, r) {
        wjcCore.assert(!!e, 'The flex argument cannot be null.'),
          wjcCore.assert(!!t, 'The fileName argument cannot be empty.'),
          _merge((r = _merge({}, r)), this.DefaultExportSettings);
        var o = r.documentOptions.ended;
        r.documentOptions.ended = function (e, r) {
          (o && !1 === o.apply(i, [e, r])) || wjcPdf.saveBlob(r.blob, t);
        };
        var i = new wjcPdf.PdfDocument(r.documentOptions);
        try {
          r.recalculateStarWidths &&
            e.columns._updateStarSizes(wjcPdf.ptToPx(i.width)),
            this._draw(e, i, null, null, null, r),
            i.end();
        } finally {
          r.recalculateStarWidths && e.invalidate(!0);
        }
      }),
      (e._draw = function (e, t, r, o, i, n) {
        var l = null != r,
          a = new wjcCore.Size(t.width, t.height);
        r || (r = new wjcCore.Point(0, t.y)),
          wjcCore.isArray(n.embeddedFonts) &&
            n.embeddedFonts.forEach(function (e) {
              t.registerFont(e);
            });
        var s = RowRange.getSelection(e, n.exportMode),
          d = this._getGridRenderer(e, n, s, this.BorderWidth, !0),
          c = new wjcCore.Rect(r.x || 0, r.y || 0, o || a.width, i || a.height),
          h = this._getScaleFactor(d, n.scaleMode, c),
          g = this._getPages(d, s, c, n, l, h);
        (globCell = document.createElement('div')).setAttribute(
          wjcGrid.FlexGrid._WJS_MEASURE,
          'true'
        ),
          (globCell.style.visibility = 'hidden'),
          e.hostElement.appendChild(globCell);
        try {
          for (var u = 0; u < g.length; u++) {
            u > 0 && t.addPage();
            var f = g[u],
              p = 0 === f.pageCol ? c.left : 0,
              w = 0 === f.pageRow ? c.top : 0;
            t.saveState(),
              t.paths.rect(0, 0, a.width, a.height).clip(),
              t.scale(h, h, new wjcCore.Point(p, w)),
              t.translate(p, w);
            var b = this._getGridRenderer(
              e,
              n,
              f.range,
              this.BorderWidth,
              u === g.length - 1
            );
            b.render(t),
              t.restoreState(),
              (t.x = p),
              (t.y = w + b.renderSize.height * h);
          }
        } finally {
          globCell && (wjcCore.removeChild(globCell), (globCell = null));
        }
      }),
      (e._getScaleFactor = function (e, t, r) {
        var o = 1;
        if (t === ScaleMode.ActualSize) return o;
        var i = e.renderSize;
        if (t === ScaleMode.SinglePage)
          (n = Math.min(r.width / i.width, r.height / i.height)) < 1 && (o = n);
        else {
          var n = r.width / i.width;
          n < 1 && (o = n);
        }
        return o;
      }),
      (e._getPages = function (e, t, r, o, i, n) {
        var l = this,
          a = [],
          s = [],
          d = wjcPdf.pxToPt,
          c = e.flex,
          h = e.showColumnHeader,
          g = e.showRowHeader,
          u = h ? d(c.columnHeaders.height) : 0,
          f = g ? d(c.rowHeaders.width) : 0,
          p =
            o.scaleMode === ScaleMode.ActualSize ||
            o.scaleMode === ScaleMode.PageWidth,
          w = o.scaleMode === ScaleMode.ActualSize,
          b = (r.width - r.left) * (1 / n),
          m = (r.height - r.top) * (1 / n),
          _ = r.width * (1 / n),
          C = r.height * (1 / n),
          R = u,
          y = f,
          j = i && o.scaleMode == ScaleMode.ActualSize;
        if (p) {
          var S = 0;
          t.forEach(c.cells, function (e, t, r, o) {
            var i = a.length ? C : m;
            if (PanelSection.isRenderableRow(e)) {
              var n = d(e.renderHeight);
              S++,
                (R += n),
                (h || S > 1) && (R -= l.BorderWidth),
                R > i &&
                  (u + n > i || j
                    ? (a.push(o), (R = u))
                    : (a.push(o - 1), (R = u + n)),
                  h && (R -= l.BorderWidth));
            }
          });
        }
        var v = t.length() - 1;
        if (
          (v < 0 && (v = 0),
          (a.length && a[a.length - 1] === v) || a.push(v),
          w)
        )
          for (var x = 0, P = t.leftCol; P <= t.rightCol; P++) {
            var T = c.columns[P];
            if (T.isVisible) {
              var M = d(T.renderWidth),
                G = s.length ? _ : b;
              x++,
                (y += M),
                (g || x > 1) && (y -= this.BorderWidth),
                y > G &&
                  (f + M > G || j
                    ? (s.push(P), (y = f))
                    : (s.push(P - 1), (y = f + M)),
                  g && (y -= this.BorderWidth));
            }
          }
        (s.length && s[s.length - 1] === t.rightCol) || s.push(t.rightCol);
        for (
          var W = [],
            z = !1,
            H = 1,
            A = i && o.maxPages > 0 ? 1 : o.maxPages,
            P = 0;
          P < a.length && !z;
          P++
        )
          for (var F = 0; F < s.length && !z; F++, H++)
            if (!(z = H > A)) {
              var L = 0 == P ? 0 : a[P - 1] + 1,
                O = 0 == F ? t.leftCol : s[F - 1] + 1;
              W.push(
                new PdfPageRowRange(t.subrange(L, a[P] - L + 1, O, s[F]), F, P)
              );
            }
        return W;
      }),
      (e._getGridRenderer = function (e, t, r, o, i) {
        return new ((tryGetModuleWijmoGridMultirow() &&
          e instanceof tryGetModuleWijmoGridMultirow().MultiRow &&
          MultiRowRenderer) ||
          (tryGetModuleWijmoGridSheet() &&
            e instanceof tryGetModuleWijmoGridSheet().FlexSheet &&
            FlexSheetRenderer) ||
          (tryGetModuleWijmoOlap() &&
            e instanceof tryGetModuleWijmoOlap().PivotGrid &&
            PivotGridRenderer) ||
          FlexGridRenderer)(e, t, r, o, i);
      }),
      (e.BorderWidth = 1),
      (e.DefaultDrawSettings = {
        maxPages: Number.MAX_VALUE,
        exportMode: ExportMode.All,
        repeatMergedValuesAcrossPages: !0,
        recalculateStarWidths: !0,
        styles: {
          cellStyle: {
            font: new wjcPdf.PdfFont(),
            padding: 1.5,
            verticalAlign: 'middle',
          },
          headerCellStyle: { font: { weight: 'bold' } },
        },
      }),
      (e.DefaultExportSettings = _merge(
        {
          scaleMode: ScaleMode.PageWidth,
          documentOptions: {
            compress: !1,
            pageSettings: {
              margins: {
                left: 36,
                right: 36,
                top: 18,
                bottom: 18,
              },
            },
          },
        },
        e.DefaultDrawSettings
      )),
      e
    );
  })();
exports.FlexGridPdfConverter = FlexGridPdfConverter;
var FlexGridRenderer = (function () {
    function e(e, t, r, o, i) {
      (this._flex = e),
        (this._borderWidth = o),
        (this._lastPage = i),
        (this._settings = t || {}),
        (this._topLeft = new PanelSectionRenderer(
          this,
          e.topLeftCells,
          this.showRowHeader && this.showColumnHeader
            ? new RowRange(e, [
                new wjcGrid.CellRange(
                  0,
                  0,
                  e.topLeftCells.rows.length - 1,
                  e.topLeftCells.columns.length - 1
                ),
              ])
            : new RowRange(e, []),
          o
        )),
        (this._rowHeader = new PanelSectionRenderer(
          this,
          e.rowHeaders,
          this.showRowHeader
            ? r.clone(0, e.rowHeaders.columns.length - 1)
            : new RowRange(e, []),
          o
        )),
        (this._columnHeader = new PanelSectionRenderer(
          this,
          e.columnHeaders,
          this.showColumnHeader
            ? new RowRange(e, [
                new wjcGrid.CellRange(
                  0,
                  r.leftCol,
                  e.columnHeaders.rows.length - 1,
                  r.rightCol
                ),
              ])
            : new RowRange(e, []),
          o
        )),
        (this._cells = new PanelSectionRenderer(this, e.cells, r, o)),
        (this._bottomLeft = new PanelSectionRenderer(
          this,
          e.bottomLeftCells,
          this.showRowHeader && this.showColumnFooter
            ? new RowRange(e, [
                new wjcGrid.CellRange(
                  0,
                  0,
                  e.bottomLeftCells.rows.length - 1,
                  e.bottomLeftCells.columns.length - 1
                ),
              ])
            : new RowRange(e, []),
          o
        )),
        (this._columnFooter = new PanelSectionRenderer(
          this,
          e.columnFooters,
          this.showColumnFooter
            ? new RowRange(e, [
                new wjcGrid.CellRange(
                  0,
                  r.leftCol,
                  e.columnFooters.rows.length - 1,
                  r.rightCol
                ),
              ])
            : new RowRange(e, []),
          o
        ));
    }
    return (
      Object.defineProperty(e.prototype, 'settings', {
        get: function () {
          return this._settings;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.render = function (e) {
        var t = Math.max(
            0,
            Math.max(
              this._topLeft.renderSize.width,
              this._rowHeader.renderSize.width
            ) - this._borderWidth
          ),
          r = Math.max(
            0,
            Math.max(
              this._topLeft.renderSize.height,
              this._columnHeader.renderSize.height
            ) - this._borderWidth
          );
        this._topLeft.render(e, 0, 0),
          this._rowHeader.render(e, 0, r),
          this._columnHeader.render(e, t, 0),
          this._cells.render(e, t, r),
          (r = Math.max(
            0,
            r + this._cells.renderSize.height - this._borderWidth
          )),
          this._bottomLeft.render(e, 0, r),
          this._columnFooter.render(e, t, r);
      }),
      Object.defineProperty(e.prototype, 'flex', {
        get: function () {
          return this._flex;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'renderSize', {
        get: function () {
          var e =
              Math.max(
                this._topLeft.renderSize.height,
                this._columnHeader.renderSize.height
              ) +
              Math.max(
                this._rowHeader.renderSize.height,
                this._cells.renderSize.height
              ) +
              Math.max(
                this._bottomLeft.renderSize.height,
                this._columnFooter.renderSize.height
              ),
            t =
              Math.max(
                this._topLeft.renderSize.width,
                this._rowHeader.renderSize.width
              ) +
              Math.max(
                this._columnHeader.renderSize.width,
                this._cells.renderSize.width
              );
          return (
            this._columnHeader.visibleRows > 0 && (e -= this._borderWidth),
            this._columnFooter.visibleRows > 0 && (e -= this._borderWidth),
            this._rowHeader.visibleColumns > 0 && (t -= this._borderWidth),
            new wjcCore.Size(t, e)
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'showColumnHeader', {
        get: function () {
          return !!(
            this._flex.headersVisibility & wjcGrid.HeadersVisibility.Column
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'showRowHeader', {
        get: function () {
          return !!(
            this._flex.headersVisibility & wjcGrid.HeadersVisibility.Row
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'showColumnFooter', {
        get: function () {
          return this._lastPage && this._flex.columnFooters.rows.length > 0;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.alignMergedTextToTheTopRow = function (e) {
        return !1;
      }),
      (e.prototype.getCellValue = function (e, t, r) {
        return e.getCellData(r, t, !0);
      }),
      (e.prototype.getColumn = function (e, t, r) {
        return e.columns[t];
      }),
      (e.prototype.isAlternatingRow = function (e) {
        return e.index % 2 != 0;
      }),
      (e.prototype.isGroupRow = function (e) {
        return e instanceof wjcGrid.GroupRow && e.hasChildren;
      }),
      (e.prototype.isMergeableCell = function (e, t) {
        return !0;
      }),
      (e.prototype.getCellStyle = function (e, t, r) {
        var o = this.settings.styles,
          i = _merge({}, o.cellStyle),
          n = this._flex;
        switch (e.cellType) {
          case wjcGrid.CellType.Cell:
            this.isGroupRow(t)
              ? _merge(i, o.groupCellStyle, !0)
              : this.isAlternatingRow(t) && _merge(i, o.altCellStyle, !0);
            break;
          case wjcGrid.CellType.ColumnHeader:
          case wjcGrid.CellType.RowHeader:
          case wjcGrid.CellType.TopLeft:
          case wjcGrid.CellType.BottomLeft:
            _merge(i, o.headerCellStyle, !0);
            break;
          case wjcGrid.CellType.ColumnFooter:
            _merge(i, o.headerCellStyle, !0), _merge(i, o.footerCellStyle, !0);
        }
        return (
          !this.settings.customCellContent &&
            n._getShowErrors() &&
            n._getError(e, t.index, r.index) &&
            _merge(i, o.errorCellStyle, !0),
          i
        );
      }),
      e
    );
  })(),
  FlexSheetRenderer = (function (e) {
    function t(t, r, o, i, n) {
      return e.call(this, t, r, o, i, n) || this;
    }
    return (
      __extends(t, e),
      (t.prototype.getCellValue = function (t, r, o) {
        return t.cellType === wjcGrid.CellType.Cell
          ? t.rows[o] instanceof tryGetModuleWijmoGridSheet().HeaderRow
            ? this.flex.columnHeaders.getCellData(o, r, !0)
            : this.flex.getCellValue(o, r, !0)
          : e.prototype.getCellValue.call(this, t, r, o);
      }),
      (t.prototype.getCellStyle = function (t, r, o) {
        var i = e.prototype.getCellStyle.call(this, t, r, o),
          n = this.flex.selectedSheet.findTable(r.index, o.index);
        if (n) {
          var l = r.index - n.range.topRow,
            a = o.index - n.range.leftCol,
            s = n._getTableCellAppliedStyles(l, a);
          s &&
            (Object.keys(s).forEach(function (e) {
              e.toLowerCase().indexOf('color') >= 0 &&
                (s[e] = n._getStrColor(s[e]));
            }),
            (s.font = new wjcPdf.PdfFont(
              s.fontFamily,
              wjcPdf._asPt(s.fontSize, !0, void 0),
              s.fontStyle,
              s.fontWeight
            ))),
            _merge(i, s, !0);
        }
        return i;
      }),
      Object.defineProperty(t.prototype, 'showColumnHeader', {
        get: function () {
          return !1;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'showRowHeader', {
        get: function () {
          return !1;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'showColumnFooter', {
        get: function () {
          return !1;
        },
        enumerable: !0,
        configurable: !0,
      }),
      t
    );
  })(FlexGridRenderer),
  MultiRowRenderer = (function (e) {
    function t(t, r, o, i, n) {
      return e.call(this, t, r, o, i, n) || this;
    }
    return (
      __extends(t, e),
      (t.prototype.getColumn = function (e, t, r) {
        return this.flex.getBindingColumn(e, r, t);
      }),
      (t.prototype.isAlternatingRow = function (t) {
        return t instanceof tryGetModuleWijmoGridMultirow()._MultiRow
          ? t.dataIndex % 2 != 0
          : e.prototype.isAlternatingRow.call(this, t);
      }),
      (t.prototype.isMergeableCell = function (e, t) {
        return !0;
      }),
      t
    );
  })(FlexGridRenderer),
  PivotGridRenderer = (function (e) {
    function t(t, r, o, i, n) {
      return e.call(this, t, r, o, i, n) || this;
    }
    return (
      __extends(t, e),
      (t.prototype.alignMergedTextToTheTopRow = function (e) {
        return (
          !this.flex.centerHeadersVertically &&
          (e.cellType === wjcGrid.CellType.ColumnHeader ||
            e.cellType === wjcGrid.CellType.RowHeader)
        );
      }),
      t
    );
  })(FlexGridRenderer),
  PanelSection = (function () {
    function e(e, t) {
      (this._panel = e), (this._range = t.clone());
    }
    return (
      (e.isRenderableRow = function (e) {
        return e.isVisible && !(e instanceof wjcGrid._NewRowTemplate);
      }),
      Object.defineProperty(e.prototype, 'visibleRows', {
        get: function () {
          var e = this;
          return (
            null == this._visibleRows &&
              ((this._visibleRows = 0),
              this._range.forEach(this._panel, function (t) {
                e.isRenderableRow(t) && e._visibleRows++;
              })),
            this._visibleRows
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'visibleColumns', {
        get: function () {
          if (
            null == this._visibleColumns &&
            ((this._visibleColumns = 0), this._range.isValid)
          )
            for (var e = this._range.leftCol; e <= this._range.rightCol; e++)
              this._panel.columns[e].isVisible && this._visibleColumns++;
          return this._visibleColumns;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'size', {
        get: function () {
          if (null == this._size) {
            var e = this._range.getRenderSize(this._panel);
            this._size = new wjcCore.Size(
              wjcPdf.pxToPt(e.width),
              wjcPdf.pxToPt(e.height)
            );
          }
          return this._size;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'range', {
        get: function () {
          return this._range;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'panel', {
        get: function () {
          return this._panel;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.isRenderableRow = function (t) {
        return e.isRenderableRow(t);
      }),
      e
    );
  })(),
  PanelSectionRenderer = (function (e) {
    function t(t, r, o, i) {
      var n = e.call(this, r, o) || this;
      return (n._gr = t), (n._borderWidth = i), n;
    }
    return (
      __extends(t, e),
      Object.defineProperty(t.prototype, 'gr', {
        get: function () {
          return this._gr;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'renderSize', {
        get: function () {
          return (
            null == this._renderSize &&
              ((this._renderSize = this.size.clone()),
              this.visibleColumns > 1 &&
                (this._renderSize.width -=
                  this._borderWidth * (this.visibleColumns - 1)),
              this.visibleRows > 1 &&
                (this._renderSize.height -=
                  this._borderWidth * (this.visibleRows - 1))),
            this._renderSize
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.getRangeWidth = function (e, t) {
        for (var r = 0, o = 0, i = this.panel, n = e; n <= t; n++) {
          var l = i.columns[n];
          l.isVisible && (o++, (r += l.renderWidth));
        }
        return (
          (r = wjcPdf.pxToPt(r)), o > 1 && (r -= this._borderWidth * (o - 1)), r
        );
      }),
      (t.prototype.getRangeHeight = function (e, t) {
        for (var r = 0, o = 0, i = this.panel, n = e; n <= t; n++) {
          var l = i.rows[n];
          this.isRenderableRow(l) && (o++, (r += l.renderHeight));
        }
        return (
          (r = wjcPdf.pxToPt(r)), o > 1 && (r -= this._borderWidth * (o - 1)), r
        );
      }),
      (t.prototype.render = function (e, t, r) {
        var o = this,
          i = this.range,
          n = this.panel,
          l = new GetMergedRangeProxy(this._gr.flex),
          a = new CellRangeExt(n, 0, 0, 0, 0),
          s = new CellRenderer(this, e, this._borderWidth);
        if (i.isValid) {
          for (var d = {}, c = i.leftCol; c <= i.rightCol; c++) d[c] = r;
          i.forEach(n, function (e, r, c) {
            if (o.isRenderableRow(e))
              for (var h = t, g = i.leftCol; g <= i.rightCol; g++) {
                var u,
                  f = o.gr.getColumn(n, g, c),
                  p = void 0,
                  w = void 0,
                  b = !1,
                  m = void 0;
                if (f.isVisible) {
                  var _ = o._getCellValue(g, c),
                    C = null;
                  if (
                    o.gr.isMergeableCell(f, e) &&
                    (C = l.getMergedRange(n, c, g))
                  )
                    if ((a.copyFrom(C), C.topRow !== C.bottomRow))
                      C.firstVisibleRow === c || c === r.topRow
                        ? ((b = !0),
                          (u = o.gr.settings.repeatMergedValuesAcrossPages
                            ? _
                            : C.firstVisibleRow === c
                            ? _
                            : ''),
                          (p = o.getRangeHeight(
                            c,
                            Math.min(C.bottomRow, r.bottomRow)
                          )),
                          (w = o.getRangeWidth(g, g)))
                        : (w = o.getRangeWidth(g, g));
                    else {
                      (b = !0),
                        (u = o.gr.settings.repeatMergedValuesAcrossPages
                          ? _
                          : g === C.leftCol
                          ? _
                          : ''),
                        (p = o.getRangeHeight(c, c)),
                        (w = o.getRangeWidth(
                          Math.max(i.leftCol, C.leftCol),
                          Math.min(i.rightCol, C.rightCol)
                        )),
                        (m = Math.min(i.rightCol, C.rightCol));
                      for (var R = g + 1; R <= m; R++)
                        d[R] += p - o._borderWidth;
                    }
                  else
                    a.setRange(c, g, c, g),
                      (b = !0),
                      (u = _),
                      (p = o.getRangeHeight(c, c)),
                      (w = o.getRangeWidth(g, g));
                  b &&
                    s.renderCell(u, e, f, a, new wjcCore.Rect(h, d[g], w, p)),
                    p && (d[g] += p - o._borderWidth),
                    w && (h += w - o._borderWidth),
                    m && (g = m);
                }
              }
          });
        }
      }),
      (t.prototype._getCellValue = function (e, t) {
        var r = this.panel,
          o = this.gr.getCellValue(r, e, t);
        if (!o && r.cellType === wjcGrid.CellType.Cell) {
          var i = r.rows[t];
          if (
            i instanceof wjcGrid.GroupRow &&
            i.dataItem &&
            i.dataItem.groupDescription &&
            e === r.columns.firstVisibleIndex
          ) {
            var n = i.dataItem.groupDescription.propertyName,
              l = r.columns.getColumn(n);
            l && l.header && (n = l.header),
              (o =
                n +
                ': ' +
                i.dataItem.name +
                ' (' +
                i.dataItem.items.length +
                ' items)');
          }
        }
        return o;
      }),
      t
    );
  })(PanelSection),
  CellRenderer = (function () {
    function e(e, t, r) {
      (this._pr = e), (this._area = t), (this._borderWidth = r);
    }
    return (
      (e.prototype.renderCell = function (e, t, r, o, i) {
        var n,
          l = t.grid,
          a = this._pr.panel,
          s = function () {
            var e = o.topRow,
              t = o.leftCol,
              r = a.getCellElement(e, t);
            return (
              r ||
                ((globCell.innerHTML =
                  globCell.className =
                  globCell.style.cssText =
                    ''),
                l.cellFactory.updateCell(a, e, t, globCell)),
              r || globCell
            );
          },
          d = !!this._pr.gr.settings.customCellContent,
          c = null,
          h = this._pr.gr.getCellStyle(a, t, r);
        if (
          (d && (c = s()),
          d &&
            !(e = c.textContent.trim()) &&
            this._isBooleanCell(r, t, a) &&
            (e = this._extractCheckboxValue(c) + ''),
          d)
        ) {
          var g = (function (e) {
            return (
              (e.className = e.className.replace('wj-state-selected', '')),
              (e.className = e.className.replace(
                'wj-state-multi-selected',
                ''
              )),
              window.getComputedStyle(e)
            );
          })(c);
          (h.color = g.color),
            (h.backgroundColor = g.backgroundColor),
            (h.borderColor =
              g.borderColor ||
              g.borderRightColor ||
              g.borderBottomColor ||
              g.borderLeftColor ||
              g.borderTopColor),
            (h.font = new wjcPdf.PdfFont(
              g.fontFamily,
              wjcPdf._asPt(g.fontSize, !0, void 0),
              g.fontStyle,
              g.fontWeight
            )),
            (h.textAlign = g.textAlign);
        }
        if (
          ((h.boxSizing = 'border-box'),
          (h.borderWidth = this._borderWidth),
          (h.borderStyle = 'solid'),
          h.textAlign ||
            (t instanceof wjcGrid.GroupRow && !r.aggregate) ||
            (h.textAlign = r.getAlignment()),
          a.cellType === wjcGrid.CellType.Cell &&
            l.rows.maxGroupLevel >= 0 &&
            o.leftCol === l.columns.firstVisibleIndex)
        ) {
          var u =
              t instanceof wjcGrid.GroupRow
                ? Math.max(t.level, 0)
                : l.rows.maxGroupLevel + 1,
            f = wjcPdf._asPt(h.paddingLeft || h.padding),
            p = wjcPdf.pxToPt(u * l.treeIndent);
          h.paddingLeft = f + p;
        }
        var w,
          b = this._measureCell(e, r, t, a, h, i),
          m =
            o.rowSpan > 1 &&
            o.visibleRowsCount > 1 &&
            this._pr.gr.alignMergedTextToTheTopRow(a);
        m &&
          ((w = new wjcCore.Rect(
            b.contentRect.left,
            b.contentRect.top,
            b.contentRect.width,
            b.contentRect.height / (o.visibleRowsCount || 1)
          )),
          (b.textRect = this._calculateTextRect(e, r, t, a, w, h))),
          wjcCore.isFunction(this._pr.gr.settings.formatItem) &&
            (((n = new PdfFormatItemEventArgs(
              a,
              o,
              c,
              this._area,
              b.rect,
              b.contentRect,
              b.textRect.top,
              h,
              function () {
                return c || s();
              }
            )).data = e),
            this._pr.gr.settings.formatItem(n),
            n.data !== e &&
              ((e = wjcCore.asString(n.data)),
              (b.textRect = this._calculateTextRect(
                e,
                r,
                t,
                a,
                m ? w : b.contentRect,
                h
              )))),
          this._renderCell(
            e,
            t,
            r,
            o,
            b,
            h,
            !n || !n.cancel,
            !n || !n.cancelBorders
          );
      }),
      (e.prototype._renderCell = function (e, t, r, o, i, n, l, a) {
        (l || a) &&
          (this._isBooleanCellAndValue(e, r, t, this._pr.panel)
            ? this._renderBooleanCell(e, i, n, l, a)
            : this._renderTextCell(e, i, n, l, a));
      }),
      (e.prototype._isBooleanCellAndValue = function (e, t, r, o) {
        return this._isBooleanCell(t, r, o) && this._isBoolean(e);
      }),
      (e.prototype._isBooleanCell = function (e, t, r) {
        return (
          e.dataType === wjcCore.DataType.Boolean &&
          r.cellType === wjcGrid.CellType.Cell &&
          !this._pr.gr.isGroupRow(t)
        );
      }),
      (e.prototype._isBoolean = function (e) {
        var t = wjcCore.isString(e) && e.toLowerCase();
        return 'true' === t || 'false' === t || !0 === e || !1 === e;
      }),
      (e.prototype._measureCell = function (e, t, r, o, i, n) {
        this._decompositeStyle(i);
        var l = n.left,
          a = n.top,
          s = n.height,
          d = n.width,
          c = this._parseBorder(i),
          h = c.left.width,
          g = c.top.width,
          u = c.bottom.width,
          f = c.right.width,
          p = this._parsePadding(i),
          w = 0,
          b = 0,
          m = 0,
          _ = 0;
        if ('content-box' === i.boxSizing || void 0 === i.boxSizing)
          (w = p.top + s + p.bottom),
            (b = p.left + d + p.right),
            (m = s),
            (_ = d);
        else {
          if ('border-box' !== i.boxSizing)
            throw 'Invalid value: ' + i.boxSizing;
          wjcPdf._IE && i instanceof CSSStyleDeclaration
            ? ((w = p.top + p.bottom + s), (b = p.left + p.right + d))
            : ((w = s - g - u), (b = d - h - f)),
            (m = w - p.top - p.bottom),
            (_ = b - p.left - p.right);
        }
        var n = new wjcCore.Rect(l, a, d, s),
          C = new wjcCore.Rect(l + h, a + g, b, w),
          R = new wjcCore.Rect(l + h + p.left, a + g + p.top, _, m);
        return {
          rect: n,
          clientRect: C,
          contentRect: R,
          textRect: this._calculateTextRect(e, t, r, o, R, i),
        };
      }),
      (e.prototype._decompositeStyle = function (e) {
        if (e) {
          var t;
          (t = e.borderColor) &&
            (e.borderLeftColor || (e.borderLeftColor = t),
            e.borderRightColor || (e.borderRightColor = t),
            e.borderTopColor || (e.borderTopColor = t),
            e.borderBottomColor || (e.borderBottomColor = t)),
            (t = e.borderWidth) &&
              (e.borderLeftWidth || (e.borderLeftWidth = t),
              e.borderRightWidth || (e.borderRightWidth = t),
              e.borderTopWidth || (e.borderTopWidth = t),
              e.borderBottomWidth || (e.borderBottomWidth = t)),
            (t = e.borderStyle) &&
              (e.borderLeftStyle || (e.borderLeftStyle = t),
              e.borderRightStyle || (e.borderRightStyle = t),
              e.borderTopStyle || (e.borderTopStyle = t),
              e.borderBottomStyle || (e.borderBottomStyle = t)),
            (t = e.padding) &&
              (e.paddingLeft || (e.paddingLeft = t),
              e.paddingRight || (e.paddingRight = t),
              e.paddingTop || (e.paddingTop = t),
              e.paddingBottom || (e.paddingBottom = t));
        }
      }),
      (e.prototype._parseBorder = function (e) {
        var t = {
          left: { width: 0 },
          top: { width: 0 },
          bottom: { width: 0 },
          right: { width: 0 },
        };
        return (
          'none' !== e.borderLeftStyle &&
            (t.left = {
              width: wjcPdf._asPt(e.borderLeftWidth),
              style: e.borderLeftStyle,
              color: e.borderLeftColor,
            }),
          'none' !== e.borderTopStyle &&
            (t.top = {
              width: wjcPdf._asPt(e.borderTopWidth),
              style: e.borderTopStyle,
              color: e.borderTopColor,
            }),
          'none' !== e.borderBottomStyle &&
            (t.bottom = {
              width: wjcPdf._asPt(e.borderBottomWidth),
              style: e.borderBottomStyle,
              color: e.borderBottomColor,
            }),
          'none' !== e.borderRightStyle &&
            (t.right = {
              width: wjcPdf._asPt(e.borderRightWidth),
              style: e.borderRightStyle,
              color: e.borderRightColor,
            }),
          t
        );
      }),
      (e.prototype._parsePadding = function (e) {
        return {
          left: wjcPdf._asPt(e.paddingLeft),
          top: wjcPdf._asPt(e.paddingTop),
          bottom: wjcPdf._asPt(e.paddingBottom),
          right: wjcPdf._asPt(e.paddingRight),
        };
      }),
      (e.prototype._renderEmptyCell = function (e, t, r, o) {
        var i = e.rect.left,
          n = e.rect.top,
          l = e.clientRect.width,
          a = e.clientRect.height,
          s = e.clientRect.left - e.rect.left,
          d = e.clientRect.top - e.rect.top,
          c =
            e.rect.top +
            e.rect.height -
            (e.clientRect.top + e.clientRect.height),
          h =
            e.rect.left +
            e.rect.width -
            (e.clientRect.left + e.clientRect.width);
        if (o && (s || h || c || d)) {
          var g = t.borderLeftColor || t.borderColor,
            u = t.borderRightColor || t.borderColor,
            f = t.borderTopColor || t.borderColor,
            p = t.borderBottomColor || t.borderColor;
          if (
            s &&
            d &&
            c &&
            h &&
            s === h &&
            s === c &&
            s === d &&
            g === u &&
            g === p &&
            g === f
          ) {
            var w = s,
              b = w / 2;
            this._area.paths
              .rect(i + b, n + b, l + w, a + w)
              .stroke(new wjcPdf.PdfPen(g, w));
          } else
            s &&
              this._area.paths
                .polygon([
                  [i, n],
                  [i + s, n + d],
                  [i + s, n + d + a],
                  [i, n + d + a + c],
                ])
                .fill(g),
              d &&
                this._area.paths
                  .polygon([
                    [i, n],
                    [i + s, n + d],
                    [i + s + l, n + d],
                    [i + s + l + h, n],
                  ])
                  .fill(f),
              h &&
                this._area.paths
                  .polygon([
                    [i + s + l + h, n],
                    [i + s + l, n + d],
                    [i + s + l, n + d + a],
                    [i + s + l + h, n + d + a + c],
                  ])
                  .fill(u),
              c &&
                this._area.paths
                  .polygon([
                    [i, n + d + a + c],
                    [i + s, n + d + a],
                    [i + s + l, n + d + a],
                    [i + s + l + h, n + d + a + c],
                  ])
                  .fill(p);
        }
        r &&
          t.backgroundColor &&
          l > 0 &&
          a > 0 &&
          this._area.paths.rect(i + s, n + d, l, a).fill(t.backgroundColor);
      }),
      (e.prototype._renderBooleanCell = function (e, t, r, o, i) {
        if ((this._renderEmptyCell(t, r, o, i), o)) {
          var n = t.textRect.left,
            l = t.textRect.top,
            a = t.textRect.height;
          if (
            (this._area.paths
              .rect(n, l, a, a)
              .fillAndStroke(
                wjcCore.Color.fromRgba(255, 255, 255),
                new wjcPdf.PdfPen(void 0, 0.5)
              ),
            !0 === wjcCore.changeType(e, wjcCore.DataType.Boolean, ''))
          ) {
            var s = a / 20,
              d = a - 0.5 - 2 * s,
              c = a / 8;
            this._area._pdfdoc.saveState(),
              this._area
                .translate(n + 0.25 + s, l + 0.25 + s)
                .paths.moveTo(c / 2, 0.6 * d)
                .lineTo(d - 0.6 * d, d - c)
                .lineTo(d - c / 2, c / 2)
                .stroke(new wjcPdf.PdfPen(void 0, c)),
              this._area._pdfdoc.restoreState();
          }
        }
      }),
      (e.prototype._renderTextCell = function (e, t, r, o, i) {
        this._renderEmptyCell(t, r, o, i),
          o &&
            e &&
            this._area.drawText(e, t.textRect.left, t.textRect.top, {
              brush: r.color,
              font: r.font,
              height: t.textRect.height,
              width: t.textRect.width,
              align:
                'center' === r.textAlign
                  ? wjcPdf.PdfTextHorizontalAlign.Center
                  : 'right' === r.textAlign
                  ? wjcPdf.PdfTextHorizontalAlign.Right
                  : 'justify' === r.textAlign
                  ? wjcPdf.PdfTextHorizontalAlign.Justify
                  : wjcPdf.PdfTextHorizontalAlign.Left,
            });
      }),
      (e.prototype._calculateTextRect = function (e, t, r, o, i, n) {
        var l = i.clone();
        if (this._isBooleanCellAndValue(e, t, r, o)) {
          var a = this._getTextLineHeight(n.font);
          switch (n.verticalAlign) {
            case 'middle':
              l.top = i.top + i.height / 2 - a / 2;
              break;
            case 'bottom':
              l.top = i.top + i.height - a;
          }
          switch (n.textAlign) {
            case 'justify':
            case 'center':
              l.left = i.left + i.width / 2 - a / 2;
              break;
            case 'right':
              l.left = i.left + i.width - a;
          }
          l.height = l.width = a;
        } else if (l.height > 0 && l.width > 0) {
          switch (n.verticalAlign) {
            case 'bottom':
              (s = this._area.measureText(e, n.font, {
                height: l.height,
                width: l.width,
              })).size.height < l.height &&
                ((l.top += l.height - s.size.height),
                (l.height = s.size.height));
              break;
            case 'middle':
              var s = this._area.measureText(e, n.font, {
                height: l.height,
                width: l.width,
              });
              s.size.height < l.height &&
                ((l.top += l.height / 2 - s.size.height / 2),
                (l.height = s.size.height));
          }
          t.wordWrap || (l.height = this._getTextLineHeight(n.font));
        }
        return l;
      }),
      (e.prototype._extractCheckboxValue = function (e) {
        var t = e.querySelector('input.wj-cell-check[type=checkbox]');
        if (t) {
          var r = window.getComputedStyle(t);
          if ('none' !== r.display && 'hidden' !== r.visibility)
            return t.checked;
        }
      }),
      (e.prototype._getTextLineHeight = function (e) {
        return this._area.lineHeight(e);
      }),
      e
    );
  })(),
  GetMergedRangeProxy = (function () {
    function e(e) {
      (this._columns = {}), (this._flex = e);
    }
    return (
      (e.prototype.getMergedRange = function (e, t, r) {
        var o = this._columns[r];
        if (o && t >= o.topRow && t <= o.bottomRow) return o;
        var i = this._flex.getMergedRange(e, t, r, !1);
        return (this._columns[r] = i ? new CellRangeExt(e, i) : null);
      }),
      e
    );
  })(),
  CellRangeExt = (function (e) {
    function t(t, r, o, i, n) {
      var l = this;
      ((l =
        r instanceof wjcGrid.CellRange
          ? e.call(this, r.row, r.col, r.row2, r.col2) || this
          : e.call(this, r, o, i, n) || this).firstVisibleRow = -1),
        (l.visibleRowsCount = 0);
      var a = l.topRow,
        s = l.bottomRow,
        d = t.rows.length;
      if (d > 0)
        for (var c = a; c <= s && c < d; c++)
          t.rows[c].isVisible &&
            (l.firstVisibleRow < 0 && (l.firstVisibleRow = c),
            l.visibleRowsCount++);
      return l;
    }
    return (
      __extends(t, e),
      (t.prototype.copyFrom = function (e) {
        this.setRange(e.row, e.col, e.row2, e.col2),
          (this.firstVisibleRow = e.firstVisibleRow),
          (this.visibleRowsCount = e.visibleRowsCount);
      }),
      t
    );
  })(wjcGrid.CellRange),
  RowRange = (function () {
    function e(e, t) {
      (this._flex = e), (this._ranges = t || []);
    }
    return (
      (e.getSelection = function (t, r) {
        var o = [];
        if (r === ExportMode.All)
          o.push(
            new wjcGrid.CellRange(0, 0, t.rows.length - 1, t.columns.length - 1)
          );
        else {
          var i = t.selection;
          switch (t.selectionMode) {
            case wjcGrid.SelectionMode.None:
              break;
            case wjcGrid.SelectionMode.Cell:
            case wjcGrid.SelectionMode.CellRange:
              o.push(i);
              break;
            case wjcGrid.SelectionMode.Row:
              o.push(
                new wjcGrid.CellRange(
                  i.topRow,
                  0,
                  i.topRow,
                  t.cells.columns.length - 1
                )
              );
              break;
            case wjcGrid.SelectionMode.RowRange:
              o.push(
                new wjcGrid.CellRange(
                  i.topRow,
                  0,
                  i.bottomRow,
                  t.cells.columns.length - 1
                )
              );
              break;
            case wjcGrid.SelectionMode.ListBox:
              for (var n = -1, l = 0; l < t.rows.length; l++)
                t.rows[l].isSelected
                  ? (n < 0 && (n = l),
                    l === t.rows.length - 1 &&
                      o.push(
                        new wjcGrid.CellRange(
                          n,
                          0,
                          l,
                          t.cells.columns.length - 1
                        )
                      ))
                  : (n >= 0 &&
                      o.push(
                        new wjcGrid.CellRange(
                          n,
                          0,
                          l - 1,
                          t.cells.columns.length - 1
                        )
                      ),
                    (n = -1));
          }
        }
        return new e(t, o);
      }),
      (e.prototype.length = function () {
        for (var e = 0, t = 0; t < this._ranges.length; t++) {
          var r = this._ranges[t];
          r.isValid && (e += r.bottomRow - r.topRow + 1);
        }
        return e;
      }),
      Object.defineProperty(e.prototype, 'isValid', {
        get: function () {
          return this._ranges.length && this._ranges[0].isValid;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'leftCol', {
        get: function () {
          return this._ranges.length ? this._ranges[0].leftCol : -1;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'rightCol', {
        get: function () {
          return this._ranges.length ? this._ranges[0].rightCol : -1;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.clone = function (t, r) {
        for (var o = [], i = 0; i < this._ranges.length; i++) {
          var n = this._ranges[i].clone();
          arguments.length > 0 && (n.col = t),
            arguments.length > 1 && (n.col2 = r),
            o.push(n);
        }
        return new e(this._flex, o);
      }),
      (e.prototype.getRenderSize = function (e) {
        for (
          var t = new wjcCore.Size(0, 0), r = 0;
          r < this._ranges.length;
          r++
        ) {
          var o = this._ranges[r].getRenderSize(e);
          (t.width = Math.max(t.width, o.width)), (t.height += o.height);
        }
        return t;
      }),
      (e.prototype.forEach = function (e, t) {
        for (var r = 0, o = 0; o < this._ranges.length; o++) {
          var i = this._ranges[o];
          if (i.isValid)
            for (var n = i.topRow; n <= i.bottomRow; n++)
              t(e.rows[n], i, n, r++);
        }
      }),
      (e.prototype.subrange = function (t, r, o, i) {
        var n = [];
        if (t >= 0 && r > 0)
          for (
            var l = 0, a = 0, s = 0;
            s < this._ranges.length && r > 0;
            s++, l = a + 1
          ) {
            var d = this._ranges[s];
            if (((a = l + (d.bottomRow - d.topRow)), !(t > a))) {
              var c = t > l ? d.topRow + (t - l) : d.topRow,
                h = Math.min(d.bottomRow, c + r - 1),
                g = arguments.length > 2 ? o : d.leftCol,
                u = arguments.length > 2 ? i : d.rightCol;
              n.push(new wjcGrid.CellRange(c, g, h, u)), (r -= h - c + 1);
            }
          }
        return new e(this._flex, n);
      }),
      e
    );
  })(),
  PdfPageRowRange = (function () {
    function e(e, t, r) {
      (this._col = t), (this._row = r), (this._range = e);
    }
    return (
      Object.defineProperty(e.prototype, 'range', {
        get: function () {
          return this._range;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'pageCol', {
        get: function () {
          return this._col;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'pageRow', {
        get: function () {
          return this._row;
        },
        enumerable: !0,
        configurable: !0,
      }),
      e
    );
  })();
