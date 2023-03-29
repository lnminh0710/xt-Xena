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
      function r() {
        this.constructor = t;
      }
      e(t, i),
        (t.prototype =
          null === i
            ? Object.create(i)
            : ((r.prototype = i.prototype), new r()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcGrid = require('wijmo/wijmo.grid'),
  wjcSelf = require('wijmo/wijmo.grid.grouppanel');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.grid = window.wijmo.grid || {}),
  (window.wijmo.grid.grouppanel = wjcSelf);
var GroupPanel = (function (e) {
  function t(t, i) {
    var r = e.call(this, t) || this;
    (r._hideGroupedCols = !0), (r._maxGroups = 6), (r._hiddenCols = []);
    wjcCore.assert(
      null != wjcGrid,
      'Missing dependency: GroupPanel requires wijmo.grid.'
    );
    var n = r.getTemplate();
    r.applyTemplate('wj-grouppanel wj-control', n, {
      _divMarkers: 'div-markers',
      _divPH: 'div-ph',
    });
    var o = r.hostElement;
    return (
      r.addEventListener(o, 'dragstart', r._dragStart.bind(r)),
      r.addEventListener(o, 'dragover', r._dragOver.bind(r)),
      r.addEventListener(o, 'drop', r._drop.bind(r)),
      r.addEventListener(o, 'dragend', r._dragEnd.bind(r)),
      r.addEventListener(o, 'click', r._click.bind(r)),
      r.initialize(i),
      r
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'hideGroupedColumns', {
      get: function () {
        return this._hideGroupedCols;
      },
      set: function (e) {
        e != this._hideGroupedCols &&
          (this._hideGroupedCols = wjcCore.asBoolean(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'maxGroups', {
      get: function () {
        return this._maxGroups;
      },
      set: function (e) {
        e != this._maxGroups && (this._maxGroups = wjcCore.asNumber(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'placeholder', {
      get: function () {
        return this._divPH.textContent;
      },
      set: function (e) {
        this._divPH.textContent = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'grid', {
      get: function () {
        return this._g;
      },
      set: function (e) {
        (e = wjcCore.asType(e, wjcGrid.FlexGrid, !0)) != this._g &&
          (this._g &&
            (this._g.draggingColumn.removeHandler(this._draggingColumn),
            this._g.sortedColumn.removeHandler(this.invalidate),
            this._g.itemsSourceChanging.removeHandler(
              this._itemsSourceChanging
            ),
            this._g.itemsSourceChanged.removeHandler(this._itemsSourceChanged),
            this._g.columns.collectionChanged.removeHandler(
              this._itemsSourceChanged
            )),
          (this._g = e),
          (this._hiddenCols = []),
          this._g &&
            (this._g.draggingColumn.addHandler(this._draggingColumn, this),
            this._g.sortedColumn.addHandler(this.invalidate, this),
            this._g.itemsSourceChanging.addHandler(
              this._itemsSourceChanging,
              this
            ),
            this._g.itemsSourceChanged.addHandler(
              this._itemsSourceChanged,
              this
            ),
            this._g.columns.collectionChanged.addHandler(
              this._itemsSourceChanged,
              this
            )),
          this._itemsSourceChanged(this._g, null));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.refresh = function () {
      if (
        (e.prototype.refresh.call(this),
        (this._divMarkers.innerHTML = ''),
        (this._dragMarker = this._dragCol = null),
        this._gds)
      ) {
        for (var t = 0; t < this._gds.length; t++) {
          for (
            var i = this._gds[t],
              r = this._g.columnHeaders,
              n = -1,
              o = -1,
              s = r.rows.length - 1;
            s >= 0 && o < 0;
            s--
          )
            for (var d = 0; d < r.columns.length && o < 0; d++) {
              var a = this._g._getBindingColumn(r, s, r.columns[d]);
              if (a && a.binding == i.propertyName) {
                (o = d), (n = s);
                break;
              }
            }
          if (o > -1 && n > -1) {
            var l = document.createElement('div');
            this._g.cellFactory.updateCell(this._g.columnHeaders, n, o, l),
              l.setAttribute('class', 'wj-cell wj-header wj-groupmarker'),
              wjcCore.setCss(l, {
                position: 'static',
                display: 'inline-block',
                verticalAlign: 'top',
                left: '',
                top: '',
                right: '',
                height: 'auto',
                width: 'auto',
              });
            var h = l.querySelector('.wj-elem-filter');
            h && wjcCore.removeChild(h);
            wjcCore.createElement(
              '<span wj-remove="" style="font-weight:normal;cursor:pointer;pointer;padding:12px;padding-right:3px">&times;</span>',
              l
            );
            this._divMarkers.appendChild(l);
          }
        }
        this._divMarkers.children.length > 0
          ? ((this._divPH.style.display = 'none'),
            (this._divMarkers.style.display = ''))
          : ((this._divPH.style.display = ''),
            (this._divMarkers.style.display = 'none'));
      }
    }),
    (t.prototype._addGroup = function (e, t) {
      for (var i = this._getIndex(t), r = this._gds, n = 0; n < r.length; n++)
        if (r[n].propertyName == e.binding) {
          r.removeAt(n), n < i && i--;
          break;
        }
      for (n = this.maxGroups - 1; n < r.length; n++)
        this._removeGroup(n, r), n < i && i--;
      r.deferUpdate(function () {
        var t = new wjcCore.PropertyGroupDescription(e.binding);
        r.insert(i, t);
      }),
        e &&
          this.hideGroupedColumns &&
          ((e.visible = !1), this._hiddenCols.push(e)),
        this.invalidate();
    }),
    (t.prototype._moveGroup = function (e, t) {
      var i = this._gds,
        r = this._getElementIndex(this._dragMarker),
        n = this._getIndex(t);
      n > r && n--,
        n >= this._gds.length && (n = this._gds.length),
        r != n &&
          i.deferUpdate(function () {
            var e = i[r];
            i.removeAt(r), i.insert(n, e);
          });
    }),
    (t.prototype._removeGroup = function (e, t) {
      void 0 === t && (t = this._gds);
      var i = t[e].propertyName,
        r = this._g.columns.getColumn(i),
        n = this._hiddenCols.indexOf(r);
      t.removeAt(e),
        r && ((r.visible = !0), n > -1 && this._hiddenCols.splice(n, 1));
    }),
    (t.prototype._getIndex = function (e) {
      for (var t = this._divMarkers.children, i = 0; i < t.length; i++) {
        var r = t[i].getBoundingClientRect();
        if (e.clientX < r.left + r.width / 2) return i;
      }
      return t.length;
    }),
    (t.prototype._getElementIndex = function (e) {
      if (e && e.parentElement)
        for (var t = e.parentElement.children, i = 0; i < t.length; i++)
          if (t[i] == e) return i;
      return -1;
    }),
    (t.prototype._draggingColumn = function (e, t) {
      var i = this._g,
        r = i._getBindingColumn(t.panel, t.row, i.columns[t.col]);
      this._dragCol = r.binding ? r : null;
    }),
    (t.prototype._itemsSourceChanging = function (e, t) {
      this._hiddenCols.forEach(function (e) {
        e.visible = !0;
      }),
        (this._hiddenCols = []);
    }),
    (t.prototype._itemsSourceChanged = function (e, t) {
      this._gds &&
        this._gds.collectionChanged.removeHandler(this._groupsChanged),
        (this._gds = null),
        this._g.collectionView &&
          ((this._gds = this._g.collectionView.groupDescriptions),
          this._gds.collectionChanged.addHandler(this._groupsChanged, this)),
        this.invalidate();
    }),
    (t.prototype._groupsChanged = function (e, t) {
      this.invalidate();
    }),
    (t.prototype._dragStart = function (e) {
      wjcCore._startDrag(e.dataTransfer, 'move'),
        (this._dragMarker = e.target),
        (this._dragCol = null);
    }),
    (t.prototype._dragOver = function (e) {
      (this._dragCol || this._dragMarker) &&
        ((e.dataTransfer.dropEffect = 'move'),
        e.preventDefault(),
        e.stopPropagation());
    }),
    (t.prototype._drop = function (e) {
      this._dragMarker
        ? this._moveGroup(this._dragMarker, e)
        : this._dragCol && this._addGroup(this._dragCol, e);
    }),
    (t.prototype._dragEnd = function (e) {
      this._dragMarker = this._dragCol = null;
    }),
    (t.prototype._click = function (e) {
      for (
        var t = document.elementFromPoint(e.clientX, e.clientY),
          i = null != t.getAttribute('wj-remove'),
          r = t;
        r.parentElement && !wjcCore.hasClass(r, 'wj-cell');

      )
        r = r.parentElement;
      if (wjcCore.hasClass(r, 'wj-cell')) {
        var n = this._getElementIndex(r),
          o = this._g.collectionView.sortDescriptions;
        if (i) this._removeGroup(n);
        else if (e.ctrlKey) o.clear(), this.invalidate();
        else {
          for (var s = this._gds[n], d = !0, a = 0; a < o.length; a++)
            if (o[a].property == s.propertyName) {
              d = !o[a].ascending;
              break;
            }
          var l = new wjcCore.SortDescription(s.propertyName, d);
          o.splice(0, o.length, l), this.invalidate();
        }
      }
    }),
    (t.controlTemplate =
      '<div style="cursor:default;overflow:hidden;height:100%;width:100%;min-height:1em"><div wj-part="div-ph"></div><div wj-part="div-markers"></div></div>'),
    t
  );
})(wjcCore.Control);
exports.GroupPanel = GroupPanel;
