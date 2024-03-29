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
function tryGetModuleWijmoGridDetail() {
  var e, o;
  return (e = window.wijmo) && (o = e.grid) && o.detail;
}
function tryGetModuleWijmoGridMultirow() {
  var e, o;
  return (e = window.wijmo) && (o = e.grid) && o.multirow;
}
var __extends =
  (this && this.__extends) ||
  (function () {
    var e =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (e, o) {
          e.__proto__ = o;
        }) ||
      function (e, o) {
        for (var l in o) o.hasOwnProperty(l) && (e[l] = o[l]);
      };
    return function (o, l) {
      function r() {
        this.constructor = o;
      }
      e(o, l),
        (o.prototype =
          null === l
            ? Object.create(l)
            : ((r.prototype = l.prototype), new r()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcGrid = require('wijmo/wijmo.grid'),
  wjcXlsx = require('wijmo/wijmo.xlsx'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.grid.xlsx');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.grid = window.wijmo.grid || {}),
  (window.wijmo.grid.xlsx = wjcSelf);
var FlexGridXlsxConverter = (function () {
  function e() {}
  return (
    (e.save = function (e, o, l) {
      var r = this._saveFlexGridToWorkbook(e, o);
      return l && r.save(l), r;
    }),
    (e.saveAsync = function (e, o, l, r, t) {
      var n = this._saveFlexGridToWorkbook(e, o);
      return n.saveAsync(l, r, t), n;
    }),
    (e.load = function (e, o, l) {
      var r = this;
      if (o instanceof Blob) {
        var t = new FileReader();
        (t.onload = function () {
          var o = wjcXlsx.Workbook._base64EncArr(new Uint8Array(t.result)),
            n = new wjcXlsx.Workbook();
          n.load(o),
            (o = null),
            e.deferUpdate(function () {
              r._loadToFlexGrid(e, n, l), (n = null);
            });
        }),
          t.readAsArrayBuffer(o);
      } else if (o instanceof wjcXlsx.Workbook)
        e.deferUpdate(function () {
          r._loadToFlexGrid(e, o, l), (o = null);
        });
      else {
        if (o instanceof ArrayBuffer)
          o = wjcXlsx.Workbook._base64EncArr(new Uint8Array(o));
        else if (!wjcCore.isString(o)) throw 'Invalid workbook.';
        var n = new wjcXlsx.Workbook();
        n.load(o),
          (o = null),
          e.deferUpdate(function () {
            r._loadToFlexGrid(e, n, l), (n = null);
          });
      }
    }),
    (e.loadAsync = function (e, o, l, r, t) {
      var n = this;
      if (o instanceof Blob) {
        var s = new FileReader();
        (s.onload = function () {
          var o = wjcXlsx.Workbook._base64EncArr(new Uint8Array(s.result)),
            i = new wjcXlsx.Workbook();
          i.loadAsync(
            o,
            function (t) {
              (o = null),
                (i = null),
                e.deferUpdate(function () {
                  n._loadToFlexGrid(e, t, l), r && r(t), (t = null);
                });
            },
            t
          );
        }),
          s.readAsArrayBuffer(o);
      } else if (o instanceof wjcXlsx.Workbook)
        e.deferUpdate(function () {
          n._loadToFlexGrid(e, o, l), r && r(o), (o = null);
        });
      else {
        if (o instanceof ArrayBuffer)
          o = wjcXlsx.Workbook._base64EncArr(new Uint8Array(o));
        else if (!wjcCore.isString(o)) throw 'Invalid workbook.';
        new wjcXlsx.Workbook().loadAsync(
          o,
          function (t) {
            (o = null),
              e.deferUpdate(function () {
                n._loadToFlexGrid(e, t, l), r && r(t), (t = null);
              });
          },
          t
        );
      }
    }),
    (e._saveFlexGridToWorkbook = function (e, o) {
      var l,
        r,
        t,
        n,
        s,
        i,
        a,
        c,
        d,
        u,
        w,
        f,
        h,
        m = new wjcXlsx.Workbook(),
        p = new wjcXlsx.WorkSheet(),
        g = (new wjcXlsx.WorkbookStyle(), new wjcXlsx.WorkbookFrozenPane()),
        x = !o || null == o.includeColumnHeaders || o.includeColumnHeaders,
        y = !(!o || null == o.includeRowHeaders) && o.includeRowHeaders,
        b = !o || null == o.includeCellStyles || o.includeCellStyles,
        _ = o ? o.activeWorksheet : null,
        j = o ? o.includeColumns : null,
        C = o ? o.formatItem : null,
        k = 0,
        v = 0,
        S = 0,
        W = 0,
        T = [];
      if (
        (null == this.hasCssText &&
          (this.hasCssText = 'cssText' in document.body.style),
        (u = e.wj_sheetInfo),
        (p.name = o ? o.sheetName : ''),
        (p.visible = !o || !1 !== o.sheetVisible),
        u && u.tableNames && u.tableNames.length > 0)
      )
        for (var X = 0; X < u.tableNames.length; X++)
          p.tableNames.push(u.tableNames[X]);
      if (
        ((i = []),
        u ||
          (!b && !C) ||
          (((w = document.createElement('div')).style.visibility = 'hidden'),
          w.setAttribute(wjcGrid.FlexGrid._WJS_MEASURE, 'true'),
          e.hostElement.appendChild(w)),
        y)
      ) {
        for (c = 0, a = 0; a < e.rowHeaders.rows.length; a++)
          if (!(e.rowHeaders.rows[a].renderSize <= 0)) {
            for (i[c] = [], d = 0; d < e.rowHeaders.columns.length; d++)
              (t = e._getBindingColumn(
                e.rowHeaders,
                a,
                e.rowHeaders.columns[d]
              )),
                (n = this._getColumnSetting(
                  t,
                  e.columnHeaders.columns.defaultSize
                )),
                (i[c][d] = n),
                0 === c &&
                  ((s = new wjcXlsx.WorkbookColumn())._deserialize(n),
                  p._addWorkbookColumn(s, d));
            c++;
          }
        W = d;
      }
      if (x && e.columnHeaders.rows.length > 0) {
        for (c = 0, a = 0; a < e.columnHeaders.rows.length; a++)
          if (!(e.columnHeaders.rows[a].renderSize <= 0)) {
            for (
              i[c] || (i[c] = []), d = 0;
              d < e.columnHeaders.columns.length;
              d++
            )
              (t = e._getBindingColumn(
                e.columnHeaders,
                a,
                e.columnHeaders.columns[d]
              )),
                (n = this._getColumnSetting(
                  t,
                  e.columnHeaders.columns.defaultSize
                )),
                (i[c][W + d] = n),
                0 === c &&
                  ((j && !j(t)) ||
                    ((s = new wjcXlsx.WorkbookColumn())._deserialize(n),
                    p._addWorkbookColumn(s)));
            (W = 0),
              (l = {}),
              (r = new wjcXlsx.WorkbookRow()),
              y &&
                (W = this._parseFlexGridRowToSheetRow(
                  e.topLeftCells,
                  l,
                  a,
                  0,
                  i,
                  b,
                  w,
                  T,
                  !1,
                  0,
                  j,
                  C
                )),
              this._parseFlexGridRowToSheetRow(
                e.columnHeaders,
                l,
                a,
                W,
                i,
                b,
                w,
                T,
                !1,
                0,
                j,
                C
              ),
              l.cells.length > 0 &&
                (r._deserialize(l), p._addWorkbookRow(r, c)),
              c++;
          }
        v = c;
      } else
        for (
          i[0] || (i[0] = []), d = 0;
          d < e.columnHeaders.columns.length;
          d++
        )
          (t = e._getBindingColumn(
            e.columnHeaders,
            0,
            e.columnHeaders.columns[d]
          )),
            (n = this._getColumnSetting(
              t,
              e.columnHeaders.columns.defaultSize
            )),
            (i[0][W + d] = n),
            (j && !j(t)) ||
              ((s = new wjcXlsx.WorkbookColumn())._deserialize(n),
              p._addWorkbookColumn(s));
      for (a = 0; a < e.cells.rows.length; a++)
        (W = 0),
          (l = {}),
          (r = new wjcXlsx.WorkbookRow()),
          (f = e.rows[a]) instanceof wjcGrid._NewRowTemplate ||
            ((h = f instanceof wjcGrid.GroupRow)
              ? (k = wjcCore.tryCast(f, wjcGrid.GroupRow).level)
              : e.rows.maxGroupLevel > -1 && (k = e.rows.maxGroupLevel + 1),
            y &&
              (W = this._parseFlexGridRowToSheetRow(
                e.rowHeaders,
                l,
                a,
                0,
                i,
                b,
                w,
                T,
                h,
                k,
                j,
                C
              )),
            this._parseFlexGridRowToSheetRow(
              e.cells,
              l,
              a,
              W,
              i,
              b,
              w,
              T,
              h,
              k,
              j,
              C
            ),
            l.cells.length > 0 &&
              (r._deserialize(l), p._addWorkbookRow(r, v + a)));
      for (S = e.cells.rows.length, a = 0; a < e.columnFooters.rows.length; a++)
        (W = 0),
          (l = {}),
          (r = new wjcXlsx.WorkbookRow()),
          (h = (f = e.columnFooters.rows[a]) instanceof wjcGrid.GroupRow),
          y &&
            (W = this._parseFlexGridRowToSheetRow(
              e.rowHeaders,
              l,
              a,
              0,
              i,
              b,
              w,
              T,
              h,
              0,
              j,
              C
            )),
          this._parseFlexGridRowToSheetRow(
            e.columnFooters,
            l,
            a,
            W,
            i,
            b,
            w,
            T,
            h,
            0,
            j,
            C
          ),
          l.cells.length > 0 &&
            (r._deserialize(l), p._addWorkbookRow(r, v + S + a));
      return (
        (g.rows = x ? e.frozenRows + v : e.frozenRows),
        (g.columns = y ? e.frozenColumns + W : e.frozenColumns),
        (p.frozenPane = g),
        m._addWorkSheet(p),
        u ||
          (!b && !C) ||
          (e.hostElement.removeChild(w),
          T.forEach(function (e) {
            return e.forEach(function (e) {
              e && e.parentElement && e.parentElement.removeChild(e);
            });
          })),
        (m.activeWorksheet = _),
        m
      );
    }),
    (e._loadToFlexGrid = function (e, o, l) {
      var r,
        t,
        n,
        s,
        i,
        a,
        c,
        d,
        u,
        w,
        f,
        h,
        m,
        p,
        g,
        x,
        y,
        b,
        _,
        j,
        C,
        k,
        v,
        S,
        W,
        T,
        X,
        R,
        A,
        G,
        F,
        N,
        H,
        B = !l || null == l.includeColumnHeaders || l.includeColumnHeaders,
        D = !l || null == l.includeColumnHeaders || l.includeColumnHeaders,
        E =
          l && null != l.sheetIndex && !isNaN(l.sheetIndex) ? l.sheetIndex : 0,
        I = l ? l.sheetName : null,
        z = !l || l.sheetVisible,
        M = null != e.wj_sheetInfo,
        L = 0,
        O = 0,
        P = !1,
        V = {};
      if (
        ((e.itemsSource = null),
        e.columns.clear(),
        e.rows.clear(),
        (e.frozenColumns = 0),
        (e.frozenRows = 0),
        (X = {}),
        (R = {}),
        (O = 0),
        (s = []),
        (A = []),
        E < 0 || E >= o.sheets.length)
      )
        throw 'The sheet index option is out of the sheet range of current workbook.';
      if (null != I)
        for (r = 0; r < o.sheets.length; r++)
          if (I === o.sheets[r].name) {
            h = o.sheets[r];
            break;
          }
      if (null != (h = h || o.sheets[E]).rows) {
        for (
          B &&
            ((O = 1),
            h.rows.length <= 1 && ((D = !1), (O = 0)),
            (d = h.rows[0])),
            p = this._getColumnCount(h.rows),
            m = this._getRowCount(h.rows, p),
            _ = h.summaryBelow,
            n = h.columns,
            L = 0;
          L < p;
          L++
        )
          e.columns.push(new wjcGrid.Column()),
            n[L] &&
              (isNaN(+n[L].width) || (e.columns[L].width = +n[L].width),
              n[L].visible ||
                null == n[L].visible ||
                (e.columns[L].visible = !!n[L].visible),
              n[L].style &&
                n[L].style.wordWrap &&
                (e.columns[L].wordWrap = n[L].style.wordWrap));
        for (; O < m; O++) {
          if (((g = !1), (H = null), (f = h.rows[O])))
            for (y = O + 1; y < h.rows.length; ) {
              if ((b = h.rows[y])) {
                ((isNaN(f.groupLevel) && !isNaN(b.groupLevel)) ||
                  (!isNaN(f.groupLevel) && f.groupLevel < b.groupLevel)) &&
                  (g = !0);
                break;
              }
              y++;
            }
          for (
            g && !_
              ? (C && (C.isCollapsed = P),
                ((C = new wjcGrid.GroupRow()).isReadOnly = !1),
                (P = null != f.collapsed && f.collapsed),
                (C.level = isNaN(f.groupLevel) ? 0 : f.groupLevel),
                (V[C.level] = P),
                this._checkParentCollapsed(V, C.level) &&
                  C._setFlag(wjcGrid.RowColFlags.ParentCollapsed, !0),
                e.rows.push(C))
              : ((j = new wjcGrid.Row()),
                f &&
                  this._checkParentCollapsed(V, f.groupLevel) &&
                  j._setFlag(wjcGrid.RowColFlags.ParentCollapsed, !0),
                e.rows.push(j)),
              f &&
                f.height &&
                !isNaN(f.height) &&
                (e.rows[D ? O - 1 : O].height = f.height + 7),
              L = 0;
            L < p;
            L++
          )
            if (f) {
              if (
                ((x = f.cells[L]),
                (S = x ? x.formula : null) && '=' !== S[0] && (S = '=' + S),
                x && x.textRuns && x.textRuns.length > 0
                  ? ((e.rows[D ? O - 1 : O].isContentHtml = !0),
                    e.setCellData(
                      D ? O - 1 : O,
                      L,
                      this._parseTextRunsToHTML(x.textRuns)
                    ))
                  : e.setCellData(
                      D ? O - 1 : O,
                      L,
                      S && M ? S : this._getItemValue(x)
                    ),
                g || this._setColumn(s, L, x),
                (W = O * p + L),
                (T = x ? x.style : null),
                (G = wjcXlsx.Workbook._parseExcelFormat(x)),
                T)
              ) {
                if (
                  ((H = null == H ? !!T.wordWrap : H && !!T.wordWrap),
                  (F = this._getItemType(x)),
                  T.hAlign)
                )
                  N = wjcXlsx.Workbook._parseHAlignToString(
                    wjcCore.asEnum(T.hAlign, wjcXlsx.HAlign)
                  );
                else
                  switch (F) {
                    case wjcCore.DataType.Number:
                      N = 'right';
                      break;
                    case wjcCore.DataType.Boolean:
                      N = 'center';
                      break;
                    default:
                      N = G && 0 === G.search(/[n,c,p]/i) ? 'right' : 'left';
                  }
                (X[W] = {
                  fontWeight: T.font && T.font.bold ? 'bold' : 'none',
                  fontStyle: T.font && T.font.italic ? 'italic' : 'none',
                  textDecoration:
                    T.font && T.font.underline ? 'underline' : 'none',
                  textAlign: N,
                  fontFamily: T.font && T.font.family ? T.font.family : '',
                  fontSize: T.font && T.font.size ? T.font.size + 'px' : '',
                  color: T.font && T.font.color ? T.font.color : '',
                  backgroundColor: T.fill && T.fill.color ? T.fill.color : '',
                  whiteSpace: T.wordWrap ? 'pre-wrap' : 'normal',
                  format: G,
                }),
                  T.borders &&
                    (T.borders.left &&
                      (this._parseBorderStyle(
                        T.borders.left.style,
                        'Left',
                        X[W]
                      ),
                      (X[W].borderLeftColor = T.borders.left.color)),
                    T.borders.right &&
                      (this._parseBorderStyle(
                        T.borders.right.style,
                        'Right',
                        X[W]
                      ),
                      (X[W].borderRightColor = T.borders.right.color)),
                    T.borders.top &&
                      (this._parseBorderStyle(T.borders.top.style, 'Top', X[W]),
                      (X[W].borderTopColor = T.borders.top.color)),
                    T.borders.bottom &&
                      (this._parseBorderStyle(
                        T.borders.bottom.style,
                        'Bottom',
                        X[W]
                      ),
                      (X[W].borderBottomColor = T.borders.bottom.color))),
                  T.font &&
                    -1 === A.indexOf(T.font.family) &&
                    A.push(T.font.family);
              }
              if (
                x &&
                wjcCore.isNumber(x.rowSpan) &&
                x.rowSpan > 0 &&
                wjcCore.isNumber(x.colSpan) &&
                x.colSpan > 0 &&
                (x.rowSpan > 1 || x.colSpan > 1)
              )
                for (r = O; r < O + x.rowSpan; r++)
                  for (t = L; t < L + x.colSpan; t++)
                    R[(W = r * p + t)] = new wjcGrid.CellRange(
                      O,
                      L,
                      O + x.rowSpan - 1,
                      L + x.colSpan - 1
                    );
            } else
              e.setCellData(D ? O - 1 : O, L, ''), this._setColumn(s, L, null);
          f &&
            (this._checkParentCollapsed(V, f.groupLevel) ||
              f.visible ||
              null == f.visible ||
              (e.rows[D ? O - 1 : O].visible = f.visible),
            (e.rows[D ? O - 1 : O].wordWrap =
              (!!f.style && !!f.style.wordWrap) || !!H));
        }
        for (
          C && (C.isCollapsed = P),
            h.frozenPane &&
              ((k = h.frozenPane.columns),
              wjcCore.isNumber(k) && !isNaN(k) && (e.frozenColumns = k),
              (v = h.frozenPane.rows),
              wjcCore.isNumber(v) &&
                !isNaN(v) &&
                (e.frozenRows = D && v > 0 ? v - 1 : v)),
            L = 0;
          L < e.columnHeaders.columns.length;
          L++
        )
          (i = s[L]),
            ((a = e.columns[L]).isRequired = !1),
            D && (u = d ? d.cells[L] : null) && u.value
              ? ((w = wjcXlsx.Workbook._parseExcelFormat(u)),
                (c = wjcCore.Globalize.format(u.value, w)))
              : (c = this._numAlpha(L)),
            (a.header = c),
            i &&
              (i.dataType === wjcCore.DataType.Boolean &&
                (a.dataType = i.dataType),
              (a.format = i.format),
              (a.align = i.hAlign),
              (a.wordWrap = a.wordWrap || !!i.wordWrap));
        M &&
          ((e.wj_sheetInfo.name = h.name),
          (e.wj_sheetInfo.visible = !0 === z || !1 !== h.visible),
          (e.wj_sheetInfo.styledCells = X),
          (e.wj_sheetInfo.mergedRanges = R),
          (e.wj_sheetInfo.fonts = A),
          (e.wj_sheetInfo.tableNames = h.tableNames));
      }
    }),
    (e._parseFlexGridRowToSheetRow = function (
      e,
      o,
      l,
      r,
      t,
      n,
      s,
      i,
      a,
      c,
      d,
      u
    ) {
      var w,
        f,
        h,
        m,
        p,
        g,
        x,
        y,
        b,
        _,
        j,
        C,
        k,
        v,
        S,
        W,
        T,
        X,
        R,
        A,
        G,
        F,
        N,
        H,
        B,
        D,
        E,
        I = !1;
      for (
        X = (w = e.grid).wj_sheetInfo,
          F = null != (f = e.rows[l]).recordIndex ? f.recordIndex : 0,
          o.cells || (o.cells = []),
          o.visible = f.isVisible,
          o.height = f.renderHeight || e.rows.defaultSize,
          o.groupLevel = c,
          a && (o.collapsed = f.isCollapsed),
          f.wordWrap && (o.style = { wordWrap: f.wordWrap }),
          (f.constructor === wjcGrid.Row ||
            f.constructor === wjcGrid._NewRowTemplate ||
            (tryGetModuleWijmoGridDetail() &&
              f.constructor === tryGetModuleWijmoGridDetail().DetailRow) ||
            (tryGetModuleWijmoGridMultirow() &&
              f.constructor === tryGetModuleWijmoGridMultirow()._MultiRow)) &&
            (I = !0),
          m = 0;
        m < e.columns.length;
        m++
      )
        if (
          ((p = null),
          (T = 1),
          (W = 1),
          (E = 0),
          (G = !1),
          (v = null),
          (B = null),
          (H = null),
          (y = null),
          (A = w._getBindingColumn(e, l, e.columns[m])),
          (S = null),
          X && e === w.cells
            ? ((k = l * e.columns.length + m),
              X.mergedRanges && (S = X.mergedRanges[k]),
              X.styledCells && (v = X.styledCells[k]))
            : n &&
              ((H = this._getMeasureCell(e, m, s, i)),
              (v = (S = w.getMergedRange(e, l, m, !1))
                ? this._getCellStyle(e, H, S.bottomRow, S.rightCol) || {}
                : this._getCellStyle(e, H, l, m) || {})),
          S || (S = w.getMergedRange(e, l, m, !1)),
          S
            ? l === S.topRow &&
              m === S.leftCol &&
              ((W = S.bottomRow - S.topRow + 1),
              (T = this._getColSpan(e, S, d)),
              (G = !0))
            : (G = !0),
          !d || d(A))
        ) {
          if (
            ((h = t[F][m + r]),
            I || a
              ? ((x = G ? e.getCellData(l, m, !0) : null),
                (b = G ? e.getCellData(l, m, !1) : null),
                (j = !1),
                x &&
                  wjcCore.isString(x) &&
                  x.length > 1 &&
                  '=' === x[0] &&
                  (j = !0),
                (R = wjcCore.isDate(b)),
                v && v.format
                  ? ((p = v.format),
                    (g = wjcXlsx.Workbook._parseCellFormat(v.format, R)))
                  : h && h.style && h.style.format
                  ? ((p = A.format), (g = h.style.format))
                  : (g = null),
                g ||
                  (R
                    ? (g = 'm/d/yyyy')
                    : wjcCore.isNumber(b) && !A.dataMap
                    ? (g = wjcCore.isInt(b) ? '#,##0' : '#,##0.00')
                    : j
                    ? (C = x.toLowerCase()).indexOf('now()') > -1
                      ? ((g = 'm/d/yyyy h:mm'), (R = !0))
                      : C.indexOf('today()') > -1 || C.indexOf('date(') > -1
                      ? ((g = 'm/d/yyyy'), (R = !0))
                      : C.indexOf('time(') > -1 &&
                        ((g = 'h:mm AM/PM'), (R = !0))
                    : (g = 'General')))
              : ((x = G ? w.columnHeaders.getCellData(0, m, !0) : null),
                (g = 'General')),
            wjcCore.isString(x) &&
              -1 !== x.indexOf('<span') &&
              ((y = this._parseToTextRuns(x)), (x = null)),
            (B = this._parseCellStyle(v) || {}),
            e === w.cells &&
              a &&
              f.hasChildren &&
              m === w.columns.firstVisibleIndex)
          ) {
            if (
              (x
                ? (_ = x)
                : G && (_ = f.getGroupHeader().replace(/<\/?\w+>/g, '')),
              null == _ && !v)
            )
              continue;
            !(R = wjcCore.isDate(_)) &&
              p &&
              'd' === p.toLowerCase() &&
              wjcCore.isInt(_) &&
              (g = '0'),
              (_ = 'string' == typeof _ ? wjcXlsx.Workbook._unescapeXML(_) : _),
              m === w.columns.firstVisibleIndex && w.treeIndent && (E = c),
              (N = {
                value: _,
                isDate: R,
                formula: j ? this._parseToExcelFormula(x, R) : null,
                colSpan: T,
                rowSpan: W,
                style: this._extend(B, {
                  format: g,
                  font: { bold: !0 },
                  hAlign: wjcXlsx.HAlign.Left,
                  indent: E,
                }),
                textRuns: y,
              });
          } else
            (x = wjcCore.isString(x) ? wjcXlsx.Workbook._unescapeXML(x) : x),
              (b = wjcCore.isString(b) ? wjcXlsx.Workbook._unescapeXML(b) : b),
              !R &&
                p &&
                'd' === p.toLowerCase() &&
                wjcCore.isInt(b) &&
                (g = '0'),
              (D =
                B && B.hAlign
                  ? B.hAlign
                  : h && h.style && null != h.style.hAlign
                  ? wjcCore.asEnum(h.style.hAlign, wjcXlsx.HAlign, !0)
                  : wjcCore.isDate(b)
                  ? wjcXlsx.HAlign.Left
                  : wjcXlsx.HAlign.General),
              m !== w.columns.firstVisibleIndex ||
                !w.treeIndent ||
                (D !== wjcXlsx.HAlign.Left && D !== wjcXlsx.HAlign.General) ||
                (E = c),
              (N = {
                value: j ? null : 'General' === g ? x : b,
                isDate: R,
                formula: j ? this._parseToExcelFormula(x, R) : null,
                colSpan: m < w.columns.firstVisibleIndex ? 1 : T,
                rowSpan: W,
                style: this._extend(B, {
                  format: g,
                  hAlign: D,
                  vAlign:
                    W > 1
                      ? e === w.cells || !1 === w.centerHeadersVertically
                        ? wjcXlsx.VAlign.Top
                        : wjcXlsx.VAlign.Center
                      : null,
                  indent: E,
                }),
                textRuns: y,
              });
          u &&
            u(
              new XlsxFormatItemEventArgs(
                e,
                new wjcGrid.CellRange(l, m),
                H,
                s,
                i,
                N
              )
            ),
            o.cells.push(N);
        }
      return r + m;
    }),
    (e._parseCellStyle = function (e, o) {
      if ((void 0 === o && (o = !1), null == e)) return null;
      var l = e.fontSize;
      (l = l ? +l.substring(0, l.indexOf('px')) : null), isNaN(l) && (l = null);
      var r = e.fontWeight;
      r = 'bold' === r || +r >= 700;
      var t = 'italic' === e.fontStyle,
        n = e.textDecorationStyle;
      null == n && (n = e.textDecoration), (n = 'underline' === n);
      var s = e.whiteSpace;
      return (
        (s = !!s && s.indexOf('pre') > -1),
        {
          font: {
            bold: r,
            italic: t,
            underline: n,
            family: this._parseToExcelFontFamily(e.fontFamily),
            size: l,
            color: e.color,
          },
          fill: { color: e.backgroundColor },
          borders: this._parseBorder(e, o),
          hAlign: wjcXlsx.Workbook._parseStringToHAlign(e.textAlign),
          wordWrap: s,
        }
      );
    }),
    (e._parseBorder = function (e, o) {
      var l = {};
      return (
        (l.left = this._parseEgdeBorder(e, 'Left')),
        (l.right = this._parseEgdeBorder(e, 'Right')),
        (l.top = this._parseEgdeBorder(e, 'Top')),
        (l.bottom = this._parseEgdeBorder(e, 'Bottom')),
        o &&
          ((l.vertical = this._parseEgdeBorder(e, 'Vertical')),
          (l.horizontal = this._parseEgdeBorder(e, 'Horizontal'))),
        l
      );
    }),
    (e._parseEgdeBorder = function (e, o) {
      var l,
        r = e['border' + o + 'Style'],
        t = e['border' + o + 'Width'];
      if (
        (t && t.length > 2 && (t = +t.substring(0, t.length - 2)),
        r && 'none' !== r && 'hidden' !== r)
      ) {
        switch (((l = {}), (r = r.toLowerCase()))) {
          case 'dotted':
            l.style =
              t > 1
                ? wjcXlsx.BorderStyle.MediumDashDotted
                : wjcXlsx.BorderStyle.Dotted;
            break;
          case 'dashed':
            l.style =
              t > 1
                ? wjcXlsx.BorderStyle.MediumDashed
                : wjcXlsx.BorderStyle.Dashed;
            break;
          case 'double':
            l.style = wjcXlsx.BorderStyle.Double;
            break;
          default:
            l.style =
              t > 2
                ? wjcXlsx.BorderStyle.Thick
                : t > 1
                ? wjcXlsx.BorderStyle.Medium
                : wjcXlsx.BorderStyle.Thin;
        }
        l.color = e['border' + o + 'Color'];
      }
      return l;
    }),
    (e._parseBorderStyle = function (e, o, l) {
      var r = 'border' + o + 'Style',
        t = 'border' + o + 'Width';
      switch (e) {
        case wjcXlsx.BorderStyle.Dotted:
        case wjcXlsx.BorderStyle.Hair:
          (l[r] = 'dotted'), (l[t] = '1px');
          break;
        case wjcXlsx.BorderStyle.Dashed:
        case wjcXlsx.BorderStyle.ThinDashDotDotted:
        case wjcXlsx.BorderStyle.ThinDashDotted:
          (l[r] = 'dashed'), (l[t] = '1px');
          break;
        case wjcXlsx.BorderStyle.MediumDashed:
        case wjcXlsx.BorderStyle.MediumDashDotDotted:
        case wjcXlsx.BorderStyle.MediumDashDotted:
        case wjcXlsx.BorderStyle.SlantedMediumDashDotted:
          (l[r] = 'dashed'), (l[t] = '2px');
          break;
        case wjcXlsx.BorderStyle.Double:
          (l[r] = 'double'), (l[t] = '3px');
          break;
        case wjcXlsx.BorderStyle.Medium:
          (l[r] = 'solid'), (l[t] = '2px');
          break;
        default:
          (l[r] = 'solid'), (l[t] = '1px');
      }
    }),
    (e._parseToExcelFontFamily = function (e) {
      var o;
      return (
        e &&
          (o = e.split(',')) &&
          o.length > 0 &&
          (e = o[0].replace(/\"|\'/g, '')),
        e
      );
    }),
    (e._parseToExcelFormula = function (e, o) {
      var l,
        r,
        t,
        n,
        s,
        i,
        a,
        c = /(floor|ceiling)\([+-]?\d+\.?\d*\)/gi,
        d = /text\(\"?\w+\"?\s*\,\s*\"\w+\"\)/gi,
        u = /\"?\w+\"?\s*\,\s*\"(\w+)\"/i;
      if ((l = e.match(c)))
        for (s = 0; s < l.length; s++)
          (a = (i = l[s]).substring(0, i.lastIndexOf(')')) + ', 1)'),
            (e = e.replace(i, a));
      if (((l = null), (l = e.match(d))))
        for (s = 0; s < l.length; s++)
          (r = (i = l[s]).match(u)) &&
            2 === r.length &&
            ((t = r[1]),
            /^d{1,4}?$/.test(t) ||
              ((n = wjcXlsx.Workbook._parseCellFormat(t, o)),
              (a = i.replace(t, n)),
              (e = e.replace(i, a))));
      return e;
    }),
    (e._parseToTextRuns = function (e) {
      var o,
        l,
        r,
        t = e.split('<span '),
        n = [];
      for (o = 0; o < t.length; o++)
        (r =
          -1 !== (l = t[o]).indexOf('</span>')
            ? {
                text: l.substring(l.indexOf('>') + 1, l.indexOf('</span>')),
                font: this._parseToTextRunFont(
                  l.substring(l.indexOf('style="') + 7, l.indexOf(';"'))
                ),
              }
            : { text: l }),
          n.push(r);
      return n;
    }),
    (e._parseToTextRunFont = function (e) {
      var o,
        l,
        r,
        t,
        n,
        s,
        i,
        a,
        c,
        d = e.split(';');
      if (d.length > 0) {
        for (o = 0; o < d.length; o++)
          if (2 === (l = d[o].split(':')).length)
            switch (((l[1] = l[1].trim()), l[0])) {
              case 'font-size':
                (s = +l[1].substring(0, l[1].indexOf('px'))),
                  isNaN(s) && (s = null);
                break;
              case 'font-weight':
                r = 'bold' === l[1] || +l[1] >= 700;
                break;
              case 'font-style':
                t = 'italic' === l[1];
                break;
              case 'text-decoration-style':
              case 'text-decoration':
                n = 'underline' === l[1];
                break;
              case 'font-family':
                i = this._parseToExcelFontFamily(l[1]);
                break;
              case 'color':
                a = l[1];
            }
        c = {
          bold: r,
          italic: t,
          underline: n,
          family: i,
          size: s,
          color: a,
        };
      }
      return c;
    }),
    (e._getMeasureCell = function (e, o, l, r) {
      var t = r[e.cellType],
        n = t && t[o],
        s = null == n;
      if (n) {
        if (this.hasCssText) {
          n.style;
          (n.style.cssText = ''), (n.style.visibility = 'hidden');
        }
      } else t || (r[e.cellType] = t = []), (t[o] = n = l.cloneNode());
      return (
        (!s && n.parentElement) ||
          (e.hostElement.children.length > 0
            ? e.hostElement.children[0].appendChild(n)
            : e.hostElement.appendChild(n)),
        n
      );
    }),
    (e._getColumnSetting = function (e, o) {
      var l = e.renderWidth;
      return (
        (l = l || o),
        {
          autoWidth: !0,
          width: l,
          visible: e.visible,
          style: {
            format: e.format
              ? wjcXlsx.Workbook._parseCellFormat(
                  e.format,
                  e.dataType === wjcCore.DataType.Date
                )
              : '',
            hAlign: wjcXlsx.Workbook._parseStringToHAlign(
              this._toExcelHAlign(e.getAlignment())
            ),
            wordWrap: e.wordWrap,
          },
        }
      );
    }),
    (e._toExcelHAlign = function (e) {
      return (e = e ? e.trim().toLowerCase() : e)
        ? e.indexOf('center') > -1
          ? 'center'
          : e.indexOf('right') > -1 || e.indexOf('end') > -1
          ? 'right'
          : e.indexOf('justify') > -1
          ? 'justify'
          : 'left'
        : e;
    }),
    (e._getColumnCount = function (e) {
      for (var o, l = 0, r = 0, t = 0; t < e.length; t++)
        (o = e[t] && e[t].cells ? e[t].cells : []) &&
          o.length > 0 &&
          ((r = o.length),
          wjcCore.isInt(o[r - 1].colSpan) &&
            o[r - 1].colSpan > 1 &&
            (r = r + o[r - 1].colSpan - 1),
          r > l && (l = r));
      return l;
    }),
    (e._getRowCount = function (e, o) {
      for (var l, r, t, n = e.length, s = n - 1, i = 0; i < o; i++)
        e: for (; s >= 0; s--)
          if (
            ((l = e[s]),
            (r = l && l.cells ? l.cells : []),
            (t = r[i]) &&
              ((null != t.value && '' !== t.value) ||
                (wjcCore.isInt(t.rowSpan) && t.rowSpan > 1)))
          ) {
            wjcCore.isInt(t.rowSpan) &&
              t.rowSpan > 1 &&
              s + t.rowSpan > n &&
              (n = s + t.rowSpan);
            break e;
          }
      return n;
    }),
    (e._numAlpha = function (e) {
      var o = Math.floor(e / 26) - 1;
      return (
        (o > -1 ? this._numAlpha(o) : '') + String.fromCharCode(65 + (e % 26))
      );
    }),
    (e._getItemType = function (e) {
      return null == e || null == e.value || isNaN(e.value)
        ? null
        : wjcCore.getType(e.value);
    }),
    (e._setColumn = function (e, o, l) {
      var r,
        t,
        n,
        s = e[o];
      s
        ? ((r = this._getItemType(l)),
          s.dataType !== r &&
            s.dataType === wjcCore.DataType.Boolean &&
            r !== wjcCore.DataType.Boolean &&
            (s.dataType = r),
          l &&
            null != l.value &&
            '' !== l.value &&
            (t = wjcXlsx.Workbook._parseExcelFormat(l)) &&
            s.format !== t &&
            'General' !== t &&
            (s.format = t),
          l &&
            l.style &&
            (l.style.hAlign &&
              (n = wjcXlsx.Workbook._parseHAlignToString(
                wjcCore.asEnum(l.style.hAlign, wjcXlsx.HAlign)
              )),
            null == s.wordWrap
              ? (s.wordWrap = !!l.style.wordWrap)
              : (s.wordWrap = s.wordWrap && !!l.style.wordWrap)),
          n || r !== wjcCore.DataType.Number || (n = 'right'),
          (s.hAlign = n))
        : (e[o] = {
            dataType: this._getItemType(l),
            format: wjcXlsx.Workbook._parseExcelFormat(l),
            hAlign: '',
            wordWrap: null,
          });
    }),
    (e._getItemValue = function (e) {
      if (null == e || null == e.value) return null;
      var o = e.value;
      return wjcCore.isNumber(o) && isNaN(o)
        ? ''
        : o instanceof Date && isNaN(o.getTime())
        ? ''
        : o;
    }),
    (e._getCellStyle = function (e, o, l, r) {
      try {
        e.grid.cellFactory.updateCell(e, l, r, o),
          (o.className = o.className.replace('wj-state-selected', '')),
          (o.className = o.className.replace('wj-state-multi-selected', ''));
      } catch (e) {
        return null;
      }
      return window.getComputedStyle(o);
    }),
    (e._parseTextRunsToHTML = function (e) {
      var o, l, r, t;
      for (r = '', t = 0; t < e.length; t++)
        r += (l = (o = e[t]).font)
          ? '<span style="' +
            (l.bold ? 'font-weight: bold;' : '') +
            (l.italic ? 'font-style: italic;' : '') +
            (l.underline ? 'text-decoration: underline;' : '') +
            (l.family ? 'font-family: ' + l.family + ';' : '') +
            (null != l.size ? 'font-size: ' + l.size + 'px;' : '') +
            (l.color ? 'color: ' + l.color + ';' : '') +
            '">' +
            o.text +
            '</span>'
          : o.text;
      return r;
    }),
    (e._extend = function (e, o) {
      for (var l in o) {
        var r = o[l];
        wjcCore.isObject(r) && e[l] ? wjcCore.copy(e[l], r) : (e[l] = r);
      }
      return e;
    }),
    (e._checkParentCollapsed = function (e, o) {
      var l = !1;
      return (
        Object.keys(e).forEach(function (r) {
          !0 === e[r] && !1 === l && !isNaN(o) && +r < o && (l = !0);
        }),
        l
      );
    }),
    (e._getColSpan = function (e, o, l) {
      for (var r = 0, t = o.leftCol; t <= o.rightCol; t++)
        (l && !l(e.columns[t])) || r++;
      return r;
    }),
    e
  );
})();
exports.FlexGridXlsxConverter = FlexGridXlsxConverter;
var XlsxFormatItemEventArgs = (function (e) {
  function o(o, l, r, t, n, s) {
    var i = e.call(this, o, l) || this;
    return (
      (i._cell = r),
      (i._patternCell = t),
      (i._xlsxCell = s),
      (i._cellsCache = n),
      i
    );
  }
  return (
    __extends(o, e),
    Object.defineProperty(o.prototype, 'cell', {
      get: function () {
        return this._cell;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(o.prototype, 'xlsxCell', {
      get: function () {
        return this._xlsxCell;
      },
      set: function (e) {
        this._xlsxCell = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (o.prototype.getFormattedCell = function () {
      return (
        this._cell ||
          ((this._cell = FlexGridXlsxConverter._getMeasureCell(
            this.panel,
            this.col,
            this._patternCell,
            this._cellsCache
          )),
          FlexGridXlsxConverter._getCellStyle(
            this.panel,
            this._cell,
            this.row,
            this.col
          )),
        this._cell
      );
    }),
    o
  );
})(wjcGrid.CellRangeEventArgs);
exports.XlsxFormatItemEventArgs = XlsxFormatItemEventArgs;
