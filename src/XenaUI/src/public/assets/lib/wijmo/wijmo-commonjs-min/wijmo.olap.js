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
  wjcGridFilter = require('wijmo/wijmo.grid.filter'),
  wjcInput = require('wijmo/wijmo.input'),
  wjcGrid = require('wijmo/wijmo.grid'),
  wjcChart = require('wijmo/wijmo.chart'),
  wjcSelf = require('wijmo/wijmo.olap');
(window.wijmo = window.wijmo || {}), (window.wijmo.olap = wjcSelf);
var _Tally = (function () {
  function e() {
    (this._cnt = 0),
      (this._cntn = 0),
      (this._sum = 0),
      (this._sum2 = 0),
      (this._min = null),
      (this._max = null),
      (this._first = null),
      (this._last = null);
  }
  return (
    (e.prototype.add = function (t, i) {
      t instanceof e
        ? ((this._sum += t._sum),
          (this._sum2 += t._sum2),
          (this._max =
            this._max && t._max
              ? Math.max(this._max, t._max)
              : this._max || t._max),
          (this._min =
            this._min && t._min
              ? Math.min(this._min, t._min)
              : this._min || t._min),
          (this._cnt += t._cnt),
          (this._cntn += t._cntn))
        : null != t &&
          (this._cnt++,
          wjcCore.isBoolean(t) && (t = t ? 1 : 0),
          (null == this._min || t < this._min) && (this._min = t),
          (null == this._max || t > this._max) && (this._max = t),
          null == this._first && (this._first = t),
          (this._last = t),
          wjcCore.isNumber(t) &&
            !isNaN(t) &&
            (wjcCore.isNumber(i) && (t *= i),
            this._cntn++,
            (this._sum += t),
            (this._sum2 += t * t)));
    }),
    (e.prototype.getAggregate = function (e) {
      if (0 == this._cnt) return null;
      var t = 0 == this._cntn ? 0 : this._sum / this._cntn;
      switch (e) {
        case wjcCore.Aggregate.Avg:
          return t;
        case wjcCore.Aggregate.Cnt:
          return this._cnt;
        case wjcCore.Aggregate.Max:
          return this._max;
        case wjcCore.Aggregate.Min:
          return this._min;
        case wjcCore.Aggregate.Rng:
          return this._max - this._min;
        case wjcCore.Aggregate.Sum:
          return this._sum;
        case wjcCore.Aggregate.VarPop:
          return this._cntn <= 1 ? 0 : this._sum2 / this._cntn - t * t;
        case wjcCore.Aggregate.StdPop:
          return this._cntn <= 1
            ? 0
            : Math.sqrt(this._sum2 / this._cntn - t * t);
        case wjcCore.Aggregate.Var:
          return this._cntn <= 1
            ? 0
            : ((this._sum2 / this._cntn - t * t) * this._cntn) /
                (this._cntn - 1);
        case wjcCore.Aggregate.Std:
          return this._cntn <= 1
            ? 0
            : Math.sqrt(
                ((this._sum2 / this._cntn - t * t) * this._cntn) /
                  (this._cntn - 1)
              );
        case wjcCore.Aggregate.First:
          return this._first;
        case wjcCore.Aggregate.Last:
          return this._last;
      }
      throw 'Invalid aggregate type.';
    }),
    e
  );
})();
exports._Tally = _Tally;
var _PivotKey = (function () {
  function e(e, t, i, r, o) {
    (this._fields = e),
      (this._fieldCount = t),
      (this._valueFields = i),
      (this._valueFieldIndex = r),
      (this._item = o);
  }
  return (
    Object.defineProperty(e.prototype, 'fields', {
      get: function () {
        return this._fields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'valueFields', {
      get: function () {
        return this._valueFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'valueField', {
      get: function () {
        return this._valueFields[this._valueFieldIndex];
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'values', {
      get: function () {
        if (null == this._vals) {
          this._vals = new Array(this._fieldCount);
          for (var e = 0; e < this._fieldCount; e++) {
            var t = this._fields[e];
            this._vals[e] = t._getValue(this._item, !1);
          }
        }
        return this._vals;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'fieldNames', {
      get: function () {
        if (!this._names) {
          this._names = [];
          for (var e = 0; e < this.fields.length; e++) {
            var t = this._fields[e];
            this._names.push(t._getName());
          }
        }
        return this._names;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'aggregate', {
      get: function () {
        var e = this._valueFields,
          t = this._valueFieldIndex;
        return (
          wjcCore.assert(
            e && t > -1 && t < e.length,
            'aggregate not available for this key'
          ),
          e[t].aggregate
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getValue = function (e, t) {
      if (0 == this.values.length)
        return wjcCore.culture.olap.PivotEngine.grandTotal;
      if (e > this.values.length - 1)
        return wjcCore.culture.olap.PivotEngine.subTotal;
      var i = this.values[e];
      if (t && !wjcCore.isString(i)) {
        var r = this.fields[e],
          o = r ? r.format : '';
        i = wjcCore.Globalize.format(this.values[e], o);
      }
      return i;
    }),
    Object.defineProperty(e.prototype, 'level', {
      get: function () {
        return this._fieldCount == this._fields.length ? -1 : this._fieldCount;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.compareTo = function (e) {
      var t = 0;
      if (null != e && e._fields == this._fields) {
        for (
          var i = this.values,
            r = e.values,
            o = Math.min(i.length, r.length),
            n = 0;
          n < o;
          n++
        ) {
          var s = null != i[n] ? wjcCore.getType(i[n]) : null,
            l = i[n],
            a = r[n],
            c = this._fields[n];
          if (
            c.sortComparer &&
            ((t = c.sortComparer(l, a)), wjcCore.isNumber(t))
          ) {
            if (0 != t) return c.descending ? -t : t;
          } else {
            if (s == wjcCore.DataType.Date) {
              var d = c.format;
              if (d && 'd' != d && 'D' != d) {
                var h = c._getValue(this._item, !0),
                  u = c._getValue(e._item, !0),
                  p = wjcCore.Globalize.parseDate(h, d),
                  g = wjcCore.Globalize.parseDate(u, d);
                p && g ? ((l = p), (a = g)) : ((l = h), (a = u));
              }
            }
            if (!(l == a || wjcCore.DateTime.equals(l, a)))
              return null == l
                ? 1
                : null == a
                ? -1
                : ((t = l < a ? -1 : 1), c.descending ? -t : t);
          }
        }
        if (
          i.length == r.length &&
          0 != (t = this._valueFieldIndex - e._valueFieldIndex)
        )
          return t;
        if (0 != (t = r.length - i.length))
          return t * (this.fields.engine.totalsBeforeData ? -1 : 1);
      }
      return 0;
    }),
    (e.prototype.matchesItem = function (e) {
      for (var t = 0; t < this._vals.length; t++)
        if (this.getValue(t, !0) != this._fields[t]._getValue(e, !0)) return !1;
      return !0;
    }),
    (e.prototype.toString = function () {
      if (!this._key) {
        for (var e = '', t = 0; t < this._fieldCount; t++) {
          var i = this._fields[t];
          e += i._getName() + ':' + i._getValue(this._item, !0) + ';';
        }
        this._valueFields
          ? (e += this._valueFields[this._valueFieldIndex]._getName() + ':0;')
          : (e += '{total}'),
          (this._key = e);
      }
      return this._key;
    }),
    (e._ROW_KEY_NAME = '$rowKey'),
    e
  );
})();
exports._PivotKey = _PivotKey;
var _PivotNode = (function () {
  function e(e, t, i, r, o, n) {
    (this._key = new _PivotKey(e, t, i, r, o)),
      (this._nodes = {}),
      (this._parent = n);
  }
  return (
    (e.prototype.getNode = function (t, i, r, o, n) {
      for (var s = this, l = 0; l < i; l++) {
        a = t[l]._getValue(n, !0);
        (c = s._nodes[a]) ||
          ((c = new e(t, l + 1, r, o, n, s)), (s._nodes[a] = c)),
          (s = c);
      }
      if (r && o > -1) {
        var a = r[o].header,
          c = s._nodes[a];
        c || ((c = new e(t, i, r, o, n, s)), (s._nodes[a] = c)), (s = c);
      }
      return s;
    }),
    Object.defineProperty(e.prototype, 'key', {
      get: function () {
        return this._key;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'parent', {
      get: function () {
        return this._parent;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'tree', {
      get: function () {
        return (
          this._tree || (this._tree = new e(null, 0, null, -1, null)),
          this._tree
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
exports._PivotNode = _PivotNode;
var PivotCollectionView = (function (e) {
  function t(t) {
    var i = e.call(this) || this;
    return (i._ng = wjcCore.asType(t, PivotEngine, !1)), i;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'engine', {
      get: function () {
        return this._ng;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._performSort = function (e) {
      var t = this._ng;
      if (t.sortableGroups && t._getShowRowTotals() == ShowTotals.Subtotals) {
        var i = 0,
          r = e.length - 1;
        0 == this._getItemLevel(e[i]) && i++,
          0 == this._getItemLevel(e[r]) && r--,
          this._sortGroups(e, 1, i, r);
      } else this._sortData(e);
    }),
    (t.prototype._performFilter = function (e) {
      return this._ng &&
        0 == this._ng.valueFields.length &&
        0 == this._ng.rowFields.length
        ? []
        : this.canFilter && this._filter
        ? e.filter(this._filter, this)
        : e;
    }),
    (t.prototype._getGroupRange = function (e, t) {
      var i = this._ng,
        r = e.indexOf(t),
        o = r,
        n = this._getItemLevel(e[r]);
      if (i.totalsBeforeData)
        for (
          o = r;
          o < e.length - 1 &&
          !((s = this._getItemLevel(e[o + 1])) > -1 && s <= n);
          o++
        );
      else
        for (r = o; r; r--) {
          var s = this._getItemLevel(e[r - 1]);
          if (s > -1 && s <= n) break;
        }
      return [r, o];
    }),
    (t.prototype._sortGroups = function (t, i, r, o) {
      for (var n = [], s = r; s <= o; s++)
        this._getItemLevel(t[s]) == i && n.push(t[s]);
      if (n.length) {
        e.prototype._performSort.call(this, n);
        for (var l = [], s = 0; s < n.length; s++) {
          for (
            var a = this._getGroupRange(t, n[s]), c = l.length, d = a[0];
            d <= a[1];
            d++
          )
            l.push(t[d]);
          i < this._ng.rowFields.length - 1
            ? this._sortGroups(l, i + 1, r + c, l.length - 1)
            : this._sortSegment(l, r + c, l.length - 1);
        }
        for (s = 0; s < l.length; s++) t[r + s] = l[s];
      } else this._sortData(t);
    }),
    (t.prototype._sortSegment = function (t, i, r) {
      var o = t.slice(i, r);
      e.prototype._performSort.call(this, o);
      for (var n = 0; n < o.length; n++) t[i + n] = o[n];
    }),
    (t.prototype._sortData = function (t) {
      for (var i = 0; i < t.length; i++)
        if (!(this._getItemLevel(t[i]) > -1)) {
          for (
            var r = i;
            r < t.length - 1 && !(this._getItemLevel(t[r + 1]) > -1);
            r++
          );
          if (r > i) {
            var o = t.slice(i, r + 1);
            e.prototype._performSort.call(this, o);
            for (var n = 0; n < o.length; n++) t[i + n] = o[n];
          }
          i = r;
        }
    }),
    (t.prototype._getItemLevel = function (e) {
      return e[_PivotKey._ROW_KEY_NAME].level;
    }),
    t
  );
})(wjcCore.CollectionView);
exports.PivotCollectionView = PivotCollectionView;
var PivotField = (function () {
  function e(e, t, i, r) {
    (this.propertyChanged = new wjcCore.Event()),
      (this._ng = e),
      (this._binding = new wjcCore.Binding(t)),
      (this._header = i || wjcCore.toHeaderCase(t)),
      (this._aggregate = wjcCore.Aggregate.Sum),
      (this._showAs = ShowAs.NoCalculation),
      (this._isContentHtml = !1),
      (this._format = ''),
      (this._filter = new PivotFilter(this)),
      r && wjcCore.copy(this, r);
  }
  return (
    Object.defineProperty(e.prototype, 'binding', {
      get: function () {
        return this._binding ? this._binding.path : null;
      },
      set: function (e) {
        if (e != this.binding) {
          var t = this.binding,
            i = wjcCore.asString(e);
          if (
            ((this._binding = i ? new wjcCore.Binding(i) : null),
            !this._dataType && this._ng && this._binding)
          ) {
            var r = this._ng.collectionView;
            if (r && r.sourceCollection && r.sourceCollection.length) {
              var o = r.sourceCollection[0];
              this._dataType = wjcCore.getType(this._binding.getValue(o));
            }
          }
          var n = new wjcCore.PropertyChangedEventArgs('binding', t, e);
          this.onPropertyChanged(n);
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'header', {
      get: function () {
        return this._header;
      },
      set: function (e) {
        e = wjcCore.asString(e, !1);
        var t = this._ng.fields.getField(e);
        !e || (t && t != this)
          ? wjcCore.assert(!1, 'field headers must be unique and non-empty.')
          : this._setProp('_header', wjcCore.asString(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'filter', {
      get: function () {
        return this._filter;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'aggregate', {
      get: function () {
        return this._aggregate;
      },
      set: function (e) {
        this._setProp('_aggregate', wjcCore.asEnum(e, wjcCore.Aggregate));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showAs', {
      get: function () {
        return this._showAs;
      },
      set: function (e) {
        this._setProp('_showAs', wjcCore.asEnum(e, ShowAs));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'weightField', {
      get: function () {
        return this._weightField;
      },
      set: function (t) {
        this._setProp('_weightField', wjcCore.asType(t, e, !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'dataType', {
      get: function () {
        return this._dataType;
      },
      set: function (e) {
        this._setProp('_dataType', wjcCore.asEnum(e, wjcCore.DataType));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isMeasure', {
      get: function () {
        return this._dataType == wjcCore.DataType.Number;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'format', {
      get: function () {
        return this._format;
      },
      set: function (e) {
        this._setProp('_format', wjcCore.asString(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'width', {
      get: function () {
        return this._width;
      },
      set: function (e) {
        this._setProp('_width', wjcCore.asNumber(e, !0, !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'wordWrap', {
      get: function () {
        return this._wordWrap;
      },
      set: function (e) {
        this._setProp('_wordWrap', wjcCore.asBoolean(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'descending', {
      get: function () {
        return !!this._descending;
      },
      set: function (e) {
        this._setProp('_descending', wjcCore.asBoolean(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isContentHtml', {
      get: function () {
        return this._isContentHtml;
      },
      set: function (e) {
        this._setProp('_isContentHtml', wjcCore.asBoolean(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'sortComparer', {
      get: function () {
        return this._srtCmp;
      },
      set: function (e) {
        e != this.sortComparer && (this._srtCmp = wjcCore.asFunction(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'engine', {
      get: function () {
        return this._ng;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'collectionView', {
      get: function () {
        return this.engine ? this.engine.collectionView : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isActive', {
      get: function () {
        return this._getIsActive();
      },
      set: function (e) {
        this._setIsActive(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'parentField', {
      get: function () {
        return this._parent;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'key', {
      get: function () {
        return this.header;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onPropertyChanged = function (e) {
      this.propertyChanged.raise(this, e),
        this._ng._fieldPropertyChanged(this, e);
    }),
    (e.prototype._getIsActive = function () {
      if (this._ng)
        for (var e = this._ng._viewLists, t = 0; t < e.length; t++)
          for (var i = e[t], r = 0; r < i.length; r++)
            if (i[r].binding == this.binding) return !0;
      return !1;
    }),
    (e.prototype._setIsActive = function (e) {
      if (this._ng) {
        var t = this.isActive;
        if ((e = wjcCore.asBoolean(e)) != t)
          if (e)
            this.isMeasure
              ? this._ng.valueFields.push(this)
              : this._ng.rowFields.push(this);
          else {
            for (var i = this._ng._viewLists, r = 0; r < i.length; r++)
              for (var o = i[r], n = 0; n < o.length; n++)
                ((l = o[n]) != this && l.parentField != this) ||
                  (o.removeAt(n), n--);
            for (var s = this._ng.fields, n = s.length - 1; n >= 0; n--) {
              var l = s[n];
              l.parentField == this && (s.removeAt(n), n--);
            }
          }
      }
    }),
    (e.prototype._clone = function () {
      var t = new e(this._ng, this.binding);
      this._ng._copyProps(t, this, e._props),
        (t._autoGenerated = !0),
        (t._parent = this);
      for (var i = this.header.replace(/\d+$/, ''), r = 2; ; r++) {
        var o = i + r.toString();
        if (null == this._ng.fields.getField(o)) {
          t._header = o;
          break;
        }
      }
      return t;
    }),
    (e.prototype._setProp = function (e, t, i) {
      var r = this[e];
      if (t != r) {
        this[e] = t;
        var o = new wjcCore.PropertyChangedEventArgs(e.substr(1), r, t);
        this.onPropertyChanged(o);
      }
    }),
    (e.prototype._getName = function () {
      return this.header || this.binding;
    }),
    (e.prototype._getValue = function (e, t) {
      var i = this._binding._key
        ? e[this._binding._key]
        : this._binding.getValue(e);
      return t && 'string' != typeof i
        ? wjcCore.Globalize.format(i, this._format)
        : i;
    }),
    (e.prototype._getWeight = function (e) {
      var t = this._weightField ? this._weightField._getValue(e, !1) : null;
      return wjcCore.isNumber(t) ? t : null;
    }),
    (e._props = [
      'dataType',
      'format',
      'width',
      'wordWrap',
      'aggregate',
      'showAs',
      'descending',
      'isContentHtml',
    ]),
    e
  );
})();
exports.PivotField = PivotField;
var CubePivotField = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'header', {
      get: function () {
        return this._header;
      },
      set: function (e) {
        this._setProp('_header', wjcCore.asString(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dimensionType', {
      get: function () {
        return this._dimensionType;
      },
      set: function (e) {
        this._setProp('_dimensionType', wjcCore.asEnum(e, DimensionType, !1));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isMeasure', {
      get: function () {
        switch (this._dimensionType) {
          case 1:
          case 8:
            return !0;
        }
        return !1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'subFields', {
      get: function () {
        return this._subFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'key', {
      get: function () {
        return this.binding;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._clone = function () {
      throw 'CubePivotField objects cannot be cloned';
    }),
    (t.prototype._copy = function (e, t) {
      var i = this;
      return (
        'subFields' == e &&
        (this._subFields
          ? this._subFields.splice(0, this._subFields.length)
          : (this._subFields = []),
        t &&
          t.length &&
          t.forEach(function (e) {
            var t = i.engine._createField(e, i._autoGenerated);
            i._subFields.push(t);
          }),
        !0)
      );
    }),
    (t.prototype._getIsActive = function () {
      return (
        (!this.subFields || !this.subFields.length) &&
        e.prototype._getIsActive.call(this)
      );
    }),
    (t.prototype._setIsActive = function (t) {
      (this.subFields && this.subFields.length) ||
        e.prototype._setIsActive.call(this, t);
    }),
    t
  );
})(PivotField);
exports.CubePivotField = CubePivotField;
var DimensionType;
!(function (e) {
  (e[(e.Dimension = 0)] = 'Dimension'),
    (e[(e.Measure = 1)] = 'Measure'),
    (e[(e.Kpi = 2)] = 'Kpi'),
    (e[(e.NameSet = 3)] = 'NameSet'),
    (e[(e.Attribute = 4)] = 'Attribute'),
    (e[(e.Folder = 5)] = 'Folder'),
    (e[(e.Hierarchy = 6)] = 'Hierarchy'),
    (e[(e.Date = 7)] = 'Date'),
    (e[(e.Currency = 8)] = 'Currency');
})((DimensionType = exports.DimensionType || (exports.DimensionType = {})));
var PivotFieldCollection = (function (e) {
  function t(t) {
    var i = e.call(this) || this;
    return (i._ng = t), i;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'maxItems', {
      get: function () {
        return this._maxItems;
      },
      set: function (e) {
        this._maxItems = wjcCore.asInt(e, !0, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'engine', {
      get: function () {
        return this._ng;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getField = function (e) {
      return this._getField(this, e);
    }),
    (t.prototype._getField = function (e, t) {
      for (var i = 0; i < e.length; i++) {
        var r = e[i];
        if (r.key == t) return r;
        if (
          r instanceof CubePivotField &&
          r.subFields &&
          (r = this._getField(r.subFields, t))
        )
          return r;
      }
      return null;
    }),
    (t.prototype.push = function () {
      for (var t = [], i = 0; i < arguments.length; i++) t[i] = arguments[i];
      for (var r = this._ng, o = 0; t && o < t.length; o++) {
        var n = t[o];
        if (
          (wjcCore.isString(n) &&
            (n =
              this == r.fields ? new PivotField(r, n) : r.fields.getField(n)),
          wjcCore.assert(
            n instanceof PivotField,
            'This collection must contain PivotField objects only.'
          ),
          n.key && this.getField(n.key))
        )
          return wjcCore.assert(!1, 'PivotField keys must be unique.'), -1;
        if (null != this._maxItems && this.length >= this._maxItems) break;
        e.prototype.push.call(this, n);
      }
      return this.length;
    }),
    t
  );
})(wjcCore.ObservableArray);
exports.PivotFieldCollection = PivotFieldCollection;
var PivotFilter = (function () {
  function e(e) {
    this._fld = e;
    var t = e;
    (this._valueFilter = new wjcGridFilter.ValueFilter(t)),
      (this._conditionFilter = new wjcGridFilter.ConditionFilter(t));
  }
  return (
    Object.defineProperty(e.prototype, 'filterType', {
      get: function () {
        return null != this._filterType
          ? this._filterType
          : this._fld.engine.defaultFilterType;
      },
      set: function (e) {
        e != this._filterType &&
          ((this._filterType = wjcCore.asEnum(e, wjcGridFilter.FilterType, !0)),
          this.clear());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.apply = function (e) {
      return this._conditionFilter.apply(e) && this._valueFilter.apply(e);
    }),
    Object.defineProperty(e.prototype, 'isActive', {
      get: function () {
        return this._conditionFilter.isActive || this._valueFilter.isActive;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.clear = function () {
      var e = !1;
      this._valueFilter.isActive && (this._valueFilter.clear(), (e = !0)),
        this._conditionFilter.isActive && (this._valueFilter.clear(), (e = !0)),
        e &&
          this._fld.onPropertyChanged(
            new wjcCore.PropertyChangedEventArgs('filter', null, null)
          );
    }),
    Object.defineProperty(e.prototype, 'valueFilter', {
      get: function () {
        return this._valueFilter;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'conditionFilter', {
      get: function () {
        return this._conditionFilter;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
(exports.PivotFilter = PivotFilter),
  (wjcCore.culture.olap = wjcCore.culture.olap || {}),
  (wjcCore.culture.olap.PivotFieldEditor = window.wijmo.culture.olap
    .PivotFieldEditor || {
    dialogHeader: 'Field settings:',
    header: 'Header:',
    summary: 'Summary:',
    showAs: 'Show As:',
    weighBy: 'Weigh by:',
    sort: 'Sort:',
    filter: 'Filter:',
    format: 'Format:',
    sample: 'Sample:',
    edit: 'Edit...',
    clear: 'Clear',
    ok: 'OK',
    cancel: 'Cancel',
    none: '(none)',
    sorts: { asc: 'Ascending', desc: 'Descending' },
    aggs: {
      sum: 'Sum',
      cnt: 'Count',
      avg: 'Average',
      max: 'Max',
      min: 'Min',
      rng: 'Range',
      std: 'StdDev',
      var: 'Var',
      stdp: 'StdDevPop',
      varp: 'VarPop',
      first: 'First',
      last: 'Last',
    },
    calcs: {
      noCalc: 'No calculation',
      dRow: 'Difference from previous row',
      dRowPct: '% Difference from previous row',
      dCol: 'Difference from previous column',
      dColPct: '% Difference from previous column',
      dPctGrand: '% of grand total',
      dPctRow: '% of row total',
      dPctCol: '% of column total',
      dRunTot: 'Running total',
      dRunTotPct: '% running total',
    },
    formats: {
      n0: 'Integer (n0)',
      n2: 'Float (n2)',
      c: 'Currency (c)',
      p0: 'Percentage (p0)',
      p2: 'Percentage (p2)',
      n2c: 'Thousands (n2,)',
      n2cc: 'Millions (n2,,)',
      n2ccc: 'Billions (n2,,,)',
      d: 'Date (d)',
      MMMMddyyyy: 'Month Day Year (MMMM dd, yyyy)',
      dMyy: 'Day Month Year (d/M/yy)',
      ddMyy: 'Day Month Year (dd/M/yy)',
      dMyyyy: 'Day Month Year (dd/M/yyyy)',
      MMMyyyy: 'Month Year (MMM yyyy)',
      MMMMyyyy: 'Month Year (MMMM yyyy)',
      yyyy: 'Year (yyyy)',
      yyyyQq: 'Year Quarter (yyyy "Q"q)',
      FYEEEEQU: 'Fiscal Year Quarter ("FY"EEEE "Q"U)',
    },
  });
var PivotFieldEditor = (function (e) {
  function t(t, i) {
    var r = e.call(this, t, null, !0) || this;
    wjcCore.assert(
      null != wjcInput,
      'Missing dependency: PivotFieldEditor requires wijmo.input.'
    ),
      (r.hostElement.tabIndex = -1);
    var o = r.getTemplate();
    r.applyTemplate('wj-control wj-content wj-pivotfieldeditor', o, {
      _dBnd: 'sp-bnd',
      _dHdr: 'div-hdr',
      _dAgg: 'div-agg',
      _dShw: 'div-shw',
      _dWFl: 'div-wfl',
      _dSrt: 'div-srt',
      _btnFltEdt: 'btn-flt-edt',
      _btnFltClr: 'btn-flt-clr',
      _dFmt: 'div-fmt',
      _dSmp: 'div-smp',
      _btnApply: 'btn-apply',
      _btnCancel: 'btn-cancel',
      _gDlg: 'g-dlg',
      _gHdr: 'g-hdr',
      _gAgg: 'g-agg',
      _gShw: 'g-shw',
      _gWfl: 'g-wfl',
      _gSrt: 'g-srt',
      _gFlt: 'g-flt',
      _gFmt: 'g-fmt',
      _gSmp: 'g-smp',
    }),
      (r._pvDate = new Date());
    var n = wjcCore.culture.olap.PivotFieldEditor;
    return (
      wjcCore.setText(r._gDlg, n.dialogHeader),
      wjcCore.setText(r._gHdr, n.header),
      wjcCore.setText(r._gAgg, n.summary),
      wjcCore.setText(r._gShw, n.showAs),
      wjcCore.setText(r._gWfl, n.weighBy),
      wjcCore.setText(r._gSrt, n.sort),
      wjcCore.setText(r._gFlt, n.filter),
      wjcCore.setText(r._gFmt, n.format),
      wjcCore.setText(r._gSmp, n.sample),
      wjcCore.setText(r._btnFltEdt, n.edit),
      wjcCore.setText(r._btnFltClr, n.clear),
      wjcCore.setText(r._btnApply, n.ok),
      wjcCore.setText(r._btnCancel, n.cancel),
      (r._cmbHdr = new wjcInput.ComboBox(r._dHdr)),
      (r._cmbAgg = new wjcInput.ComboBox(r._dAgg)),
      (r._cmbShw = new wjcInput.ComboBox(r._dShw)),
      (r._cmbWFl = new wjcInput.ComboBox(r._dWFl)),
      (r._cmbSrt = new wjcInput.ComboBox(r._dSrt)),
      (r._cmbFmt = new wjcInput.ComboBox(r._dFmt)),
      (r._cmbSmp = new wjcInput.ComboBox(r._dSmp)),
      r._initAggregateOptions(),
      r._initShowAsOptions(),
      r._initFormatOptions(),
      r._initSortOptions(),
      r._updatePreview(),
      r._cmbShw.textChanged.addHandler(r._updateFormat, r),
      r._cmbFmt.textChanged.addHandler(r._updatePreview, r),
      r.addEventListener(r._btnFltEdt, 'click', function (e) {
        r._editFilter(), e.preventDefault();
      }),
      r.addEventListener(r._btnFltClr, 'click', function (e) {
        wjcCore.enable(r._btnFltClr, !1),
          r._createFilterEditor(),
          setTimeout(function () {
            r._eFlt.clearEditor();
          }),
          e.preventDefault();
      }),
      r.addEventListener(r._btnApply, 'click', function (e) {
        r.updateField();
      }),
      r.initialize(i),
      r
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'field', {
      get: function () {
        return this._fld;
      },
      set: function (e) {
        e != this._fld &&
          ((this._fld = wjcCore.asType(e, PivotField)), this.updateEditor());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.updateEditor = function () {
      if (this._fld) {
        (this._dBnd.textContent = this._fld.binding),
          (this._cmbHdr.text = this._fld.header),
          this._cmbAgg.collectionView.refresh(),
          (this._cmbAgg.selectedValue = this._fld.aggregate),
          (this._cmbSrt.selectedValue = this._fld.descending),
          (this._cmbShw.selectedValue = this._fld.showAs),
          this._initWeighByOptions(),
          wjcCore.enable(this._btnFltClr, this._fld.filter.isActive),
          this._cmbFmt.collectionView.refresh(),
          (this._cmbFmt.selectedValue = this._fld.format),
          this._cmbFmt.selectedValue || (this._cmbFmt.text = this._fld.format);
        var e = this._fld instanceof CubePivotField;
        (this._cmbAgg.isDisabled = e), (this._cmbWFl.isDisabled = e);
      }
    }),
    (t.prototype.updateField = function () {
      if (this._fld) {
        var e = this._cmbHdr.text.trim();
        (this._fld.header = e || wjcCore.toHeaderCase(this._fld.binding)),
          (this._fld.aggregate = this._cmbAgg.selectedValue),
          (this._fld.showAs = this._cmbShw.selectedValue),
          (this._fld.weightField = this._cmbWFl.selectedValue),
          (this._fld.descending = this._cmbSrt.selectedValue),
          this._eFlt && this._eFlt.updateFilter(),
          (this._fld.format = this._cmbFmt.selectedValue || this._cmbFmt.text);
      }
    }),
    (t.prototype._initAggregateOptions = function () {
      var e = this,
        t = wjcCore.culture.olap.PivotFieldEditor.aggs,
        i = wjcCore.Aggregate,
        r = [
          { key: t.sum, val: i.Sum, all: !1 },
          { key: t.cnt, val: i.Cnt, all: !0 },
          { key: t.avg, val: i.Avg, all: !1 },
          { key: t.max, val: i.Max, all: !0 },
          { key: t.min, val: i.Min, all: !0 },
          { key: t.rng, val: i.Rng, all: !1 },
          { key: t.std, val: i.Std, all: !1 },
          { key: t.var, val: i.Var, all: !1 },
          { key: t.stdp, val: i.StdPop, all: !1 },
          { key: t.varp, val: i.VarPop, all: !1 },
          { key: t.first, val: i.First, all: !0 },
          { key: t.last, val: i.Last, all: !0 },
        ];
      (this._cmbAgg.itemsSource = r),
        (this._cmbAgg.collectionView.filter = function (t) {
          if (t && t.all) return !0;
          if (e._fld) {
            var i = e._fld.dataType;
            return (
              i == wjcCore.DataType.Number || i == wjcCore.DataType.Boolean
            );
          }
          return !1;
        }),
        this._cmbAgg.initialize({
          displayMemberPath: 'key',
          selectedValuePath: 'val',
        });
    }),
    (t.prototype._initShowAsOptions = function () {
      var e = wjcCore.culture.olap.PivotFieldEditor.calcs,
        t = [
          { key: e.noCalc, val: ShowAs.NoCalculation },
          { key: e.dRow, val: ShowAs.DiffRow },
          { key: e.dRowPct, val: ShowAs.DiffRowPct },
          { key: e.dCol, val: ShowAs.DiffCol },
          { key: e.dColPct, val: ShowAs.DiffColPct },
          { key: e.dPctGrand, val: ShowAs.PctGrand },
          { key: e.dPctRow, val: ShowAs.PctRow },
          { key: e.dPctCol, val: ShowAs.PctCol },
          { key: e.dRunTot, val: ShowAs.RunTot },
          { key: e.dRunTotPct, val: ShowAs.RunTotPct },
        ];
      (this._cmbShw.itemsSource = t),
        this._cmbShw.initialize({
          displayMemberPath: 'key',
          selectedValuePath: 'val',
        });
    }),
    (t.prototype._initFormatOptions = function () {
      var e = this,
        t = wjcCore.culture.olap.PivotFieldEditor.formats,
        i = [
          { key: t.n0, val: 'n0', all: !0 },
          { key: t.n2, val: 'n2', all: !0 },
          { key: t.c, val: 'c', all: !0 },
          { key: t.p0, val: 'p0', all: !0 },
          { key: t.p2, val: 'p2', all: !0 },
          { key: t.n2c, val: 'n2,', all: !0 },
          { key: t.n2cc, val: 'n2,,', all: !0 },
          { key: t.n2ccc, val: 'n2,,,', all: !0 },
          { key: t.d, val: 'd', all: !1 },
          { key: t.MMMMddyyyy, val: 'MMMM dd, yyyy', all: !1 },
          { key: t.dMyy, val: 'd/M/yy', all: !1 },
          { key: t.ddMyy, val: 'dd/M/yy', all: !1 },
          { key: t.dMyyyy, val: 'dd/M/yyyy', all: !1 },
          { key: t.MMMyyyy, val: 'MMM yyyy', all: !1 },
          { key: t.MMMMyyyy, val: 'MMMM yyyy', all: !1 },
          { key: t.yyyy, val: 'yyyy', all: !1 },
          { key: t.yyyyQq, val: 'yyyy "Q"q', all: !1 },
          { key: t.FYEEEEQU, val: '"FY"EEEE "Q"U', all: !1 },
        ];
      (this._cmbFmt.itemsSource = i),
        (this._cmbFmt.isEditable = !0),
        (this._cmbFmt.isRequired = !1),
        (this._cmbFmt.collectionView.filter = function (t) {
          return (
            !(!t || !t.all) ||
            (!!e._fld && e._fld.dataType == wjcCore.DataType.Date)
          );
        }),
        this._cmbFmt.initialize({
          displayMemberPath: 'key',
          selectedValuePath: 'val',
        });
    }),
    (t.prototype._initWeighByOptions = function () {
      var e = [{ key: wjcCore.culture.olap.PivotFieldEditor.none, val: null }];
      if (this._fld)
        for (var t = this._fld.engine, i = 0; i < t.fields.length; i++) {
          var r = t.fields[i];
          r != this._fld &&
            r.dataType == wjcCore.DataType.Number &&
            e.push({ key: r.header, val: r });
        }
      this._cmbWFl.initialize({
        displayMemberPath: 'key',
        selectedValuePath: 'val',
        itemsSource: e,
        selectedValue: this._fld.weightField,
      });
    }),
    (t.prototype._initSortOptions = function () {
      var e = wjcCore.culture.olap.PivotFieldEditor.sorts,
        t = [
          { key: e.asc, val: !1 },
          { key: e.desc, val: !0 },
        ];
      (this._cmbSrt.itemsSource = t),
        this._cmbSrt.initialize({
          displayMemberPath: 'key',
          selectedValuePath: 'val',
        });
    }),
    (t.prototype._updateFormat = function () {
      switch (this._cmbShw.selectedValue) {
        case ShowAs.DiffRowPct:
        case ShowAs.DiffColPct:
          this._cmbFmt.selectedValue = 'p0';
          break;
        default:
          this._cmbFmt.selectedValue = 'n0';
      }
    }),
    (t.prototype._updatePreview = function () {
      var e = this._cmbFmt.selectedValue || this._cmbFmt.text,
        t = wjcCore.Globalize.format,
        i = '';
      if (e) {
        var r = e[0].toLowerCase();
        i =
          'nfgxc'.indexOf(r) > -1
            ? t(1234.5678, e)
            : 'p' == r
            ? t(0.12345678, e)
            : t(this._pvDate, e);
      }
      this._cmbSmp.text = i;
    }),
    (t.prototype._editFilter = function () {
      this._createFilterEditor(),
        wjcCore.showPopup(this._dFlt, this._btnFltEdt, !1, !1, !1),
        wjcCore.moveFocus(this._dFlt, 0);
    }),
    (t.prototype._createFilterEditor = function () {
      var e = this;
      this._dFlt ||
        ((this._dFlt = document.createElement('div')),
        (this._eFlt = new PivotFilterEditor(this._dFlt, this._fld)),
        wjcCore.addClass(this._dFlt, 'wj-dropdown-panel'),
        this._eFlt.lostFocus.addHandler(function () {
          setTimeout(function () {
            var t = wjcCore.Control.getControl(e._dFlt);
            t && !t.containsFocus() && e._closeFilter();
          }, 10);
        }),
        this._eFlt.finishEditing.addHandler(function () {
          e._closeFilter(), wjcCore.enable(e._btnFltClr, !0);
        }));
    }),
    (t.prototype._closeFilter = function () {
      this._dFlt && (wjcCore.hidePopup(this._dFlt, !0), this.focus());
    }),
    (t.controlTemplate =
      '<div><div class="wj-dialog-header" tabindex="-1"><span wj-part="g-dlg"></span> <span wj-part="sp-bnd"></span></div><div class="wj-dialog-body"><table style="table-layout:fixed"><tr><td wj-part="g-hdr"></td><td><div wj-part="div-hdr"></div></td></tr><tr class="wj-separator"><td wj-part="g-agg"></td><td><div wj-part="div-agg"></div></td></tr><tr class="wj-separator"><td wj-part="g-shw"></td><td><div wj-part="div-shw"></div></td></tr><tr><td wj-part="g-wfl"></td><td><div wj-part="div-wfl"></div></td></tr><tr><td wj-part="g-srt"></td><td><div wj-part="div-srt"></div></td></tr><tr class="wj-separator"><td wj-part="g-flt"></td><td><a wj-part="btn-flt-edt" href= "" draggable="false"></a>&nbsp;&nbsp;<a wj-part="btn-flt-clr" href= "" draggable="false"></a></td></tr><tr class="wj-separator"><td wj-part="g-fmt"></td><td><div wj-part="div-fmt"></div></td></tr><tr><td wj-part="g-smp"></td><td><div wj-part="div-smp" readonly disabled tabindex="-1"></div></td></tr></table></div><div class="wj-dialog-footer"><a class="wj-hide" wj-part="btn-apply" href="" draggable="false"></a>&nbsp;&nbsp;<a class="wj-hide" wj-part="btn-cancel" href="" draggable="false"></a></div></div>'),
    t
  );
})(wjcCore.Control);
exports.PivotFieldEditor = PivotFieldEditor;
var PivotFilterEditor = (function (e) {
  function t(t, i, r) {
    var o = e.call(this, t) || this;
    o.finishEditing = new wjcCore.Event();
    wjcCore.assert(
      null != wjcInput,
      'Missing dependency: PivotFilterEditor requires wijmo.input.'
    ),
      (o.hostElement.tabIndex = -1);
    var n = o.getTemplate();
    o.applyTemplate('wj-control wj-pivotfiltereditor wj-content', n, {
      _divType: 'div-type',
      _aVal: 'a-val',
      _aCnd: 'a-cnd',
      _divEdtVal: 'div-edt-val',
      _divEdtCnd: 'div-edt-cnd',
      _btnOk: 'btn-ok',
    }),
      wjcCore.setText(o._aVal, wjcCore.culture.FlexGridFilter.values),
      wjcCore.setText(o._aCnd, wjcCore.culture.FlexGridFilter.conditions),
      wjcCore.setText(o._btnOk, wjcCore.culture.olap.PivotFieldEditor.ok);
    var s = o._btnClicked.bind(o);
    return (
      o.addEventListener(o._btnOk, 'click', s),
      o.addEventListener(o._aVal, 'click', s),
      o.addEventListener(o._aCnd, 'click', s),
      o.addEventListener(o.hostElement, 'keydown', function (e) {
        switch (e.keyCode) {
          case wjcCore.Key.Enter:
            switch (e.target.tagName) {
              case 'A':
              case 'BUTTON':
                o._btnClicked(e);
                break;
              default:
                o.onFinishEditing(new wjcCore.CancelEventArgs());
            }
            e.preventDefault();
            break;
          case wjcCore.Key.Escape:
            o.onFinishEditing(new wjcCore.CancelEventArgs()),
              e.preventDefault();
            break;
          case wjcCore.Key.Tab:
            wjcCore.moveFocus(o.hostElement, e.shiftKey ? -1 : 1),
              e.preventDefault();
        }
      }),
      (o._fld = i),
      o.initialize(r),
      o.updateEditor(),
      o
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'field', {
      get: function () {
        return this._fld;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'filter', {
      get: function () {
        return this._fld ? this._fld.filter : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.updateEditor = function () {
      var e = wjcGridFilter.FilterType.None;
      this.filter &&
        ((e =
          this.filter.conditionFilter.isActive ||
          0 == (this.filter.filterType & wjcGridFilter.FilterType.Value)
            ? wjcGridFilter.FilterType.Condition
            : wjcGridFilter.FilterType.Value),
        this._showFilter(e)),
        this._edtVal && this._edtVal.updateEditor(),
        this._edtCnd && this._edtCnd.updateEditor();
    }),
    (t.prototype.updateFilter = function () {
      switch (this._getFilterType()) {
        case wjcGridFilter.FilterType.Value:
          this._edtVal.updateFilter(), this.filter.conditionFilter.clear();
          break;
        case wjcGridFilter.FilterType.Condition:
          this._edtCnd.updateFilter(), this.filter.valueFilter.clear();
      }
      this.field.onPropertyChanged(
        new wjcCore.PropertyChangedEventArgs('filter', null, null)
      );
    }),
    (t.prototype.clearEditor = function () {
      this._edtVal && this._edtVal.clearEditor(),
        this._edtCnd && this._edtCnd.clearEditor();
    }),
    (t.prototype.onFinishEditing = function (e) {
      return this.finishEditing.raise(this, e), !e.cancel;
    }),
    (t.prototype._showFilter = function (e) {
      switch (
        (e == wjcGridFilter.FilterType.Value &&
          null == this._edtVal &&
          (this._edtVal = new wjcGridFilter.ValueFilterEditor(
            this._divEdtVal,
            this.filter.valueFilter
          )),
        e == wjcGridFilter.FilterType.Condition &&
          null == this._edtCnd &&
          (this._edtCnd = new wjcGridFilter.ConditionFilterEditor(
            this._divEdtCnd,
            this.filter.conditionFilter
          )),
        0 != (e & this.filter.filterType) &&
          (e == wjcGridFilter.FilterType.Value
            ? ((this._divEdtVal.style.display = ''),
              (this._divEdtCnd.style.display = 'none'),
              this._enableLink(this._aVal, !1),
              this._enableLink(this._aCnd, !0))
            : ((this._divEdtVal.style.display = 'none'),
              (this._divEdtCnd.style.display = ''),
              this._enableLink(this._aVal, !0),
              this._enableLink(this._aCnd, !1))),
        this.filter.filterType)
      ) {
        case wjcGridFilter.FilterType.None:
        case wjcGridFilter.FilterType.Condition:
        case wjcGridFilter.FilterType.Value:
          this._divType.style.display = 'none';
          break;
        default:
          this._divType.style.display = '';
      }
    }),
    (t.prototype._enableLink = function (e, t) {
      (e.style.textDecoration = t ? '' : 'none'),
        (e.style.fontWeight = t ? '' : 'bold'),
        wjcCore.setAttribute(e, 'href', t ? '' : null);
    }),
    (t.prototype._getFilterType = function () {
      return 'none' != this._divEdtVal.style.display
        ? wjcGridFilter.FilterType.Value
        : wjcGridFilter.FilterType.Condition;
    }),
    (t.prototype._btnClicked = function (e) {
      if (
        (e.preventDefault(),
        e.stopPropagation(),
        !wjcCore.hasClass(e.target, 'wj-state-disabled'))
      )
        return e.target == this._aVal
          ? (this._showFilter(wjcGridFilter.FilterType.Value),
            void wjcCore.moveFocus(this._edtVal.hostElement, 0))
          : e.target == this._aCnd
          ? (this._showFilter(wjcGridFilter.FilterType.Condition),
            void wjcCore.moveFocus(this._edtCnd.hostElement, 0))
          : void this.onFinishEditing(new wjcCore.CancelEventArgs());
    }),
    (t.controlTemplate =
      '<div><div wj-part="div-type" style="text-align:center;margin-bottom:12px;font-size:80%"><a wj-part="a-cnd" href="" tabindex="-1" draggable="false"></a>&nbsp;|&nbsp;<a wj-part="a-val" href="" tabindex="-1" draggable="false"></a></div><div wj-part="div-edt-val"></div><div wj-part="div-edt-cnd"></div><div style="text-align:right;margin-top:10px"><a wj-part="btn-ok" href="" draggable="false"></a></div>'),
    t
  );
})(wjcCore.Control);
(exports.PivotFilterEditor = PivotFilterEditor),
  (wjcCore.culture.olap = wjcCore.culture.olap || {}),
  (wjcCore.culture.olap.PivotEngine = window.wijmo.culture.olap.PivotEngine || {
    grandTotal: 'Grand Total',
    subTotal: 'Subtotal',
  });
var ShowTotals;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.GrandTotals = 1)] = 'GrandTotals'),
    (e[(e.Subtotals = 2)] = 'Subtotals');
})((ShowTotals = exports.ShowTotals || (exports.ShowTotals = {})));
var ShowAs;
!(function (e) {
  (e[(e.NoCalculation = 0)] = 'NoCalculation'),
    (e[(e.DiffRow = 1)] = 'DiffRow'),
    (e[(e.DiffRowPct = 2)] = 'DiffRowPct'),
    (e[(e.DiffCol = 3)] = 'DiffCol'),
    (e[(e.DiffColPct = 4)] = 'DiffColPct'),
    (e[(e.PctGrand = 5)] = 'PctGrand'),
    (e[(e.PctRow = 6)] = 'PctRow'),
    (e[(e.PctCol = 7)] = 'PctCol'),
    (e[(e.RunTot = 8)] = 'RunTot'),
    (e[(e.RunTotPct = 9)] = 'RunTotPct');
})((ShowAs = exports.ShowAs || (exports.ShowAs = {})));
var PivotEngine = (function () {
  function e(e) {
    (this._autoGenFields = !0),
      (this._allowFieldEditing = !0),
      (this._showRowTotals = ShowTotals.GrandTotals),
      (this._showColTotals = ShowTotals.GrandTotals),
      (this._totalsBefore = !1),
      (this._sortableGroups = !0),
      (this._showZeros = !1),
      (this._updating = 0),
      (this._dirty = !1),
      (this._cntTotal = 0),
      (this._cntFiltered = 0),
      (this._async = !0),
      (this._serverParms = {
        timeout: _ServerConnection._TIMEOUT,
        pollInterval: _ServerConnection._POLL_INTERVAL,
        maxDetail: _ServerConnection._MAXDETAIL,
      }),
      (this.itemsSourceChanged = new wjcCore.Event()),
      (this.viewDefinitionChanged = new wjcCore.Event()),
      (this.updatingView = new wjcCore.Event()),
      (this.updatedView = new wjcCore.Event()),
      (this.error = new wjcCore.Event()),
      (this._pivotView = new PivotCollectionView(this)),
      (this._fields = new PivotFieldCollection(this)),
      (this._rowFields = new PivotFieldCollection(this)),
      (this._columnFields = new PivotFieldCollection(this)),
      (this._valueFields = new PivotFieldCollection(this)),
      (this._filterFields = new PivotFieldCollection(this)),
      (this._viewLists = [
        this._rowFields,
        this._columnFields,
        this._valueFields,
        this._filterFields,
      ]);
    var t = this._fieldListChanged.bind(this);
    this._fields.collectionChanged.addHandler(t);
    for (var i = 0; i < this._viewLists.length; i++)
      this._viewLists[i].collectionChanged.addHandler(t);
    (this._defaultFilterType = null), e && wjcCore.copy(this, e);
  }
  return (
    Object.defineProperty(e.prototype, 'itemsSource', {
      get: function () {
        return this._items;
      },
      set: function (e) {
        var t = this;
        this._items != e &&
          (this._cv &&
            (this._cv.collectionChanged.removeHandler(
              this._cvCollectionChanged,
              this
            ),
            (this._cv = null)),
          this._server &&
            (this._server.clearPendingRequests(), (this._server = null)),
          (this._items = e),
          wjcCore.isString(e)
            ? (this._server = new _ServerConnection(this, e))
            : (this._cv = wjcCore.asCollectionView(e)),
          null != this._cv &&
            this._cv.collectionChanged.addHandler(
              this._cvCollectionChanged,
              this
            ),
          this.deferUpdate(function () {
            t.autoGenerateFields && t._generateFields();
          }),
          this.onItemsSourceChanged());
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
    Object.defineProperty(e.prototype, 'pivotView', {
      get: function () {
        return this._pivotView;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showRowTotals', {
      get: function () {
        return this._showRowTotals;
      },
      set: function (e) {
        e != this.showRowTotals &&
          ((this._showRowTotals = wjcCore.asEnum(e, ShowTotals)),
          this.onViewDefinitionChanged(),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showColumnTotals', {
      get: function () {
        return this._showColTotals;
      },
      set: function (e) {
        e != this.showColumnTotals &&
          ((this._showColTotals = wjcCore.asEnum(e, ShowTotals)),
          this.onViewDefinitionChanged(),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'totalsBeforeData', {
      get: function () {
        return this._totalsBefore;
      },
      set: function (e) {
        e != this._totalsBefore &&
          ((this._totalsBefore = wjcCore.asBoolean(e)),
          this.onViewDefinitionChanged(),
          this._updatePivotView());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'sortableGroups', {
      get: function () {
        return this._sortableGroups;
      },
      set: function (e) {
        e != this._sortableGroups &&
          ((this._sortableGroups = wjcCore.asBoolean(e)),
          this.onViewDefinitionChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showZeros', {
      get: function () {
        return this._showZeros;
      },
      set: function (e) {
        e != this._showZeros &&
          ((this._showZeros = wjcCore.asBoolean(e)),
          this.onViewDefinitionChanged(),
          this._updatePivotView());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'defaultFilterType', {
      get: function () {
        return null != this._defaultFilterType
          ? this._defaultFilterType
          : this._server
          ? wjcGridFilter.FilterType.Condition
          : wjcGridFilter.FilterType.Both;
      },
      set: function (e) {
        this._defaultFilterType = wjcCore.asEnum(e, wjcGridFilter.FilterType);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'autoGenerateFields', {
      get: function () {
        return this._autoGenFields;
      },
      set: function (e) {
        this._autoGenFields = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'allowFieldEditing', {
      get: function () {
        return this._allowFieldEditing;
      },
      set: function (e) {
        this._allowFieldEditing = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'fields', {
      get: function () {
        return this._fields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'rowFields', {
      get: function () {
        return this._rowFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'columnFields', {
      get: function () {
        return this._columnFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'filterFields', {
      get: function () {
        return this._filterFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'valueFields', {
      get: function () {
        return this._valueFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'viewDefinition', {
      get: function () {
        for (
          var e = {
              showZeros: this.showZeros,
              showColumnTotals: this.showColumnTotals,
              showRowTotals: this.showRowTotals,
              defaultFilterType: this.defaultFilterType,
              totalsBeforeData: this.totalsBeforeData,
              sortableGroups: this.sortableGroups,
              fields: [],
              rowFields: this._getFieldCollectionProxy(this.rowFields),
              columnFields: this._getFieldCollectionProxy(this.columnFields),
              filterFields: this._getFieldCollectionProxy(this.filterFields),
              valueFields: this._getFieldCollectionProxy(this.valueFields),
            },
            t = 0;
          t < this.fields.length;
          t++
        ) {
          var i = this._getFieldDefinition(this.fields[t]);
          e.fields.push(i);
        }
        return JSON.stringify(e);
      },
      set: function (t) {
        var i = this,
          r = JSON.parse(t);
        r &&
          this.deferUpdate(function () {
            i._copyProps(i, r, e._props), i.fields.clear();
            for (n = 0; n < r.fields.length; n++) {
              var t = r.fields[n],
                o = i._getFieldFromDefinition(t);
              i.fields.push(o);
            }
            for (var n = 0; n < r.fields.length; n++) {
              t = r.fields[n];
              wjcCore.isString(t.weightField) &&
                (i.fields[n].weightField = i.fields.getField(t.weightField));
            }
            i._setFieldCollectionProxy(i.rowFields, r.rowFields),
              i._setFieldCollectionProxy(i.columnFields, r.columnFields),
              i._setFieldCollectionProxy(i.filterFields, r.filterFields),
              i._setFieldCollectionProxy(i.valueFields, r.valueFields);
          });
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isViewDefined', {
      get: function () {
        var e = this._valueFields.length,
          t = this._rowFields.length,
          i = this._columnFields.length;
        return this._server
          ? e > 0 && (t > 0 || i > 0)
          : e > 0 || t > 0 || i > 0;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.beginUpdate = function () {
      this.cancelPendingUpdates(), this._updating++;
    }),
    (e.prototype.endUpdate = function () {
      this._updating--,
        this._updating <= 0 && (this.onViewDefinitionChanged(), this.refresh());
    }),
    Object.defineProperty(e.prototype, 'isUpdating', {
      get: function () {
        return this._updating > 0;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.deferUpdate = function (e) {
      try {
        this.beginUpdate(), e();
      } finally {
        this.endUpdate();
      }
    }),
    (e.prototype.refresh = function (e) {
      void 0 === e && (e = !1), (this.isUpdating && !e) || this._updateView();
    }),
    (e.prototype.invalidate = function () {
      var e = this;
      this._toInv && (this._toInv = clearTimeout(this._toInv)),
        this.isUpdating ||
          (this._toInv = setTimeout(function () {
            e.refresh();
          }, wjcCore.Control._REFRESH_INTERVAL));
    }),
    Object.defineProperty(e.prototype, 'async', {
      get: function () {
        return this._async;
      },
      set: function (e) {
        e != this._async &&
          (this.cancelPendingUpdates(), (this._async = wjcCore.asBoolean(e)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'serverTimeout', {
      get: function () {
        return this._serverParms.timeout;
      },
      set: function (e) {
        this._serverParms.timeout = wjcCore.asNumber(e, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'serverPollInterval', {
      get: function () {
        return this._serverParms.pollInterval;
      },
      set: function (e) {
        this._serverParms.pollInterval = wjcCore.asNumber(e, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'serverMaxDetail', {
      get: function () {
        return this._serverParms.maxDetail;
      },
      set: function (e) {
        this._serverParms.maxDetail = wjcCore.asNumber(e, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.cancelPendingUpdates = function () {
      this._toUpdateTallies &&
        (clearTimeout(this._toUpdateTallies), (this._toUpdateTallies = null));
    }),
    (e.prototype.getDetail = function (e, t) {
      var i = e ? e[_PivotKey._ROW_KEY_NAME] : null,
        r = this._getKey(t);
      if (this._server) return this._server.getDetail(i, r);
      for (
        var o = this.collectionView.items, n = [], s = 0;
        s < o.length;
        s++
      ) {
        var l = o[s];
        !this._applyFilter(l) ||
          (null != i && !i.matchesItem(l)) ||
          (null != r && !r.matchesItem(l)) ||
          n.push(l);
      }
      return n;
    }),
    (e.prototype.getDetailView = function (e, t) {
      var i = this.getDetail(e, t);
      return new wjcCore.CollectionView(i);
    }),
    (e.prototype.getKeys = function (e, t) {
      var i = e ? e[_PivotKey._ROW_KEY_NAME] : null,
        r = this._getKey(t);
      return {
        rowKey: { fields: i.fieldNames, values: i.values },
        colKey: { fields: r.fieldNames, values: r.values },
      };
    }),
    (e.prototype.editField = function (e) {
      if (this.allowFieldEditing) {
        var t = new PivotFieldEditor(document.createElement('div'), {
          field: e,
        });
        new wjcInput.Popup(document.createElement('div'), {
          content: t.hostElement,
        }).show(!0);
      }
    }),
    (e.prototype.removeField = function (e) {
      for (var t = 0; t < this._viewLists.length; t++) {
        var i = this._viewLists[t],
          r = i.indexOf(e);
        if (r > -1) return void i.removeAt(r);
      }
    }),
    (e.prototype.onItemsSourceChanged = function (e) {
      this.itemsSourceChanged.raise(this, e);
    }),
    (e.prototype.onViewDefinitionChanged = function (e) {
      this._updating || this.viewDefinitionChanged.raise(this, e);
    }),
    (e.prototype.onUpdatingView = function (e) {
      this.updatingView.raise(this, e);
    }),
    (e.prototype.onUpdatedView = function (e) {
      this.updatedView.raise(this, e);
    }),
    (e.prototype.onError = function (e) {
      return this.error.raise(this, e), !e.cancel;
    }),
    (e.prototype._copy = function (e, t) {
      var i;
      switch (e) {
        case 'fields':
          this.fields.clear();
          for (r = 0; r < this._viewLists.length; r++)
            this._viewLists[r].clear();
          i = wjcCore.asArray(t);
          for (r = 0; r < i.length; r++) {
            o = this._createField(i[r], !1);
            this.fields.push(o);
          }
          return !0;
        case 'rowFields':
        case 'columnFields':
        case 'valueFields':
        case 'filterFields':
          this[e].clear(),
            wjcCore.isArray(t) ||
              ((this[e].maxItems = t.maxItems), (t = t.items)),
            (i = wjcCore.asArray(t));
          for (var r = 0; r < i.length; r++) {
            var o = this.fields.getField(i[r]);
            this[e].push(o);
          }
          return !0;
      }
      return !1;
    }),
    (e.prototype._getKey = function (e) {
      return this._keys[e];
    }),
    (e.prototype._getRowLevel = function (e) {
      if (wjcCore.isNumber(e)) {
        var t = this._pivotView.items[e];
        e = t ? t[_PivotKey._ROW_KEY_NAME] : null;
      }
      return e ? e.level : -1;
    }),
    (e.prototype._getColLevel = function (e) {
      return (
        wjcCore.isNumber(e) && (e = this._colBindings[e]),
        wjcCore.isString(e) && (e = this._getKey(e)),
        wjcCore.assert(
          null == e || e instanceof _PivotKey,
          'invalid parameter in call to _getColLevel'
        ),
        e ? e.level : -1
      );
    }),
    (e.prototype._applyFilter = function (e) {
      for (var t = this._activeFilterFields, i = 0; i < t.length; i++)
        if (!t[i].filter.apply(e)) return !1;
      return !0;
    }),
    (e.prototype._updateView = function () {
      var e = this;
      if (
        (this.cancelPendingUpdates(),
        (this._cntTotal = this._cntFiltered = 0),
        (this._tallies = {}),
        (this._keys = {}),
        (this._activeFilterFields = []),
        this._server && this.isViewDefined)
      )
        this._server.getOutputView(function (t) {
          e.isViewDefined && (e._server.updateTallies(t), e._updatePivotView());
        });
      else {
        for (var t = this._viewLists, i = 0; i < t.length; i++)
          for (var r = t[i], o = 0; o < r.length; o++) {
            var n = r[o];
            n.filter.isActive && this._activeFilterFields.push(n);
          }
        this.isViewDefined && wjcCore.hasItems(this._cv)
          ? ((this._batchStart = Date.now()),
            this._updateTallies(this._cv.items, 0))
          : this._updatePivotView();
      }
    }),
    (e.prototype._updateTallies = function (t, i) {
      var r = this,
        o = t.length,
        n = new _PivotNode(this._rowFields, 0, null, -1, null),
        s = this.valueFields;
      0 == s.length &&
        this.columnFields.length > 0 &&
        (s = new PivotFieldCollection(this)).push(new PivotField(this, ''));
      for (
        var l = ShowTotals,
          a = this._rowFields.length,
          c = this._getShowRowTotals(),
          d = c == l.None ? a : 0,
          h = c == l.GrandTotals ? Math.max(1, a) : 1,
          u = this._columnFields.length,
          p = this._getShowColTotals(),
          g = p == l.None ? u : 0,
          _ = p == l.GrandTotals ? Math.max(1, u) : 1,
          f = s.length,
          w = this,
          v = i;
        v < o;
        v++
      ) {
        var y = (function (o) {
          if (
            w._async &&
            o - i >= e._BATCH_SIZE &&
            Date.now() - w._batchStart > e._BATCH_DELAY
          )
            return (
              (w._toUpdateTallies = setTimeout(function () {
                r.onUpdatingView(
                  new ProgressEventArgs(Math.round((o / t.length) * 100))
                ),
                  (r._batchStart = Date.now()),
                  r._updateTallies(t, o);
              }, e._BATCH_TIMEOUT)),
              { value: void 0 }
            );
          w._cntTotal++;
          var l = t[o];
          if (!w._activeFilterFields.length || w._applyFilter(l)) {
            w._cntFiltered++;
            for (var c = d; c <= a; c += h) {
              var p = n.getNode(w._rowFields, c, null, -1, l),
                v = p.key,
                y = v.toString(),
                m = w._tallies[y];
              m || ((w._keys[y] = v), (w._tallies[y] = m = {}));
              for (var C = g; C <= u; C += _)
                for (var b = 0; b < f; b++) {
                  var j = p.tree.getNode(w._columnFields, C, s, b, l).key,
                    F = j.toString(),
                    P = m[F];
                  P || ((w._keys[F] = j), (P = m[F] = new _Tally()));
                  var x = s[b],
                    T = x._getValue(l, !1),
                    S = x._weightField ? x._getWeight(l) : null;
                  P.add(T, S);
                }
            }
          }
        })(v);
        if ('object' == typeof y) return y.value;
      }
      (this._toUpdateTallies = null), this._updatePivotView();
    }),
    (e.prototype._updatePivotView = function () {
      var e = this;
      this._pivotView.deferUpdate(function () {
        e.onUpdatingView(new ProgressEventArgs(100));
        var t = e._pivotView.sourceCollection;
        t.length = 0;
        var i = {};
        for (var r in e._tallies) i[r] = !0;
        var o = {};
        for (var r in e._tallies) {
          d = e._tallies[r];
          for (var n in d) o[n] = !0;
        }
        for (
          var s = e._getSortedKeys(i), l = e._getSortedKeys(o), a = 0;
          a < s.length;
          a++
        ) {
          var c = s[a],
            d = e._tallies[c],
            h = {};
          h[_PivotKey._ROW_KEY_NAME] = e._getKey(c);
          for (var u = 0; u < l.length; u++) {
            var p = l[u],
              g = d[p],
              _ = e._getKey(p),
              f = g ? g.getAggregate(_.aggregate) : null;
            0 != f || e._showZeros || (f = null), (h[p] = f);
          }
          t.push(h);
        }
        (e._colBindings = l),
          e._updateFieldValues(t),
          e._pivotView.sortDescriptions.clear(),
          e.onUpdatedView();
      });
    }),
    (e.prototype._getSortedKeys = function (e) {
      var t = this;
      return Object.keys(e).sort(function (e, i) {
        return t._keys[e].compareTo(t._keys[i]);
      });
    }),
    (e.prototype._updateFieldValues = function (e) {
      for (var t = this.valueFields.length, i = 0; i < t; i++) {
        var r = this.valueFields[i];
        switch (r.showAs) {
          case ShowAs.RunTot:
          case ShowAs.RunTotPct:
            for (h = i; h < this._colBindings.length; h += t) {
              for (a = 0; a < e.length; a++)
                (c = e[a])[(l = this._colBindings[h])] = this._getRunningTotal(
                  e,
                  a,
                  h,
                  r.showAs
                );
              if (r.showAs == ShowAs.RunTotPct)
                for (a = 0; a < e.length; a++) {
                  var o = (c = e[a])[(l = this._colBindings[h])];
                  if (wjcCore.isNumber(o)) {
                    var n = this._getLastValueInRowGroup(e, a, h);
                    0 != n && (c[l] = o / n);
                  }
                }
            }
            break;
          case ShowAs.PctGrand:
          case ShowAs.PctCol:
            var s = 0;
            if (r.showAs == ShowAs.PctGrand)
              for (h = i; h < this._colBindings.length; h += t)
                -1 == this._getColLevel(h) && (s += this._getColTotal(e, h));
            for (h = i; h < this._colBindings.length; h += t) {
              r.showAs == ShowAs.PctCol && (s = this._getColTotal(e, h));
              for (var l = this._colBindings[h], a = 0; a < e.length; a++) {
                u = (c = e[a])[l];
                wjcCore.isNumber(u) && (c[l] = 0 != s ? u / s : null);
              }
            }
            break;
          case ShowAs.PctRow:
            for (a = 0; a < e.length; a++) {
              for (
                var c = e[a], d = 0, h = i;
                h < this._colBindings.length;
                h += t
              )
                if (-1 == this._getColLevel(h)) {
                  u = c[(l = this._colBindings[h])];
                  wjcCore.isNumber(u) && (d += u);
                }
              for (h = i; h < this._colBindings.length; h += t) {
                var u = c[(l = this._colBindings[h])];
                wjcCore.isNumber(u) && (c[l] = 0 != d ? u / d : null);
              }
            }
            break;
          case ShowAs.DiffRow:
          case ShowAs.DiffRowPct:
            for (h = i; h < this._colBindings.length; h += t)
              for (a = e.length - 1; a >= 0; a--)
                (c = e[a])[(l = this._colBindings[h])] = this._getRowDifference(
                  e,
                  a,
                  h,
                  r.showAs
                );
            break;
          case ShowAs.DiffCol:
          case ShowAs.DiffColPct:
            for (a = 0; a < e.length; a++)
              for (h = this._colBindings.length - t + i; h >= 0; h -= t)
                (c = e[a])[(l = this._colBindings[h])] = this._getColDifference(
                  e,
                  a,
                  h,
                  r.showAs
                );
        }
      }
    }),
    (e.prototype._getColTotal = function (e, t) {
      for (var i = this._colBindings[t], r = 0, o = 0; o < e.length; o++)
        if (-1 == this._getRowLevel(o)) {
          var n = e[o][i];
          wjcCore.isNumber(n) && (r += n);
        }
      return r;
    }),
    (e.prototype._getRunningTotal = function (e, t, i, r) {
      var o = this._getRowLevel(t);
      if (0 == o) return null;
      for (
        var n = this._colBindings[i],
          s = e[t][n],
          l = this._getShowRowTotals(),
          a = this.rowFields.length - 2,
          c = t - 1;
        c >= 0;
        c--
      ) {
        var d = this._getRowLevel(c);
        if (d == o) {
          if (a > -1 && o < 0 && l != ShowTotals.Subtotals) {
            var h = e[t].$rowKey,
              u = e[c].$rowKey;
            if (h.values[a] != u.values[a]) return null;
          }
          s += e[c][n];
          break;
        }
        if (d > o) break;
      }
      return s;
    }),
    (e.prototype._getLastValueInRowGroup = function (e, t, i) {
      for (
        var r = this._colBindings[i],
          o = e[t][r],
          n = this._getRowLevel(t),
          s = this.rowFields.length - 2,
          l = this._getShowRowTotals(),
          a = t + 1;
        a < e.length;
        a++
      ) {
        var c = this._getRowLevel(a);
        if (c == n) {
          if (s > -1 && n < 0 && l != ShowTotals.Subtotals) {
            var d = e[t].$rowKey,
              h = e[a].$rowKey;
            if (d.values[s] != h.values[s]) return o;
          }
          o = e[a][r];
        }
        if (c > n) break;
      }
      return o;
    }),
    (e.prototype._getRowDifference = function (e, t, i, r) {
      var o = this._getRowLevel(t);
      if (0 == o) return null;
      for (
        var n = this.rowFields.length - 2,
          s = this._getShowRowTotals(),
          l = t - 1;
        l >= 0;
        l--
      ) {
        var a = this._getRowLevel(l);
        if (a == o) {
          if (n > -1 && o < 0 && s != ShowTotals.Subtotals) {
            var c = e[t].$rowKey,
              d = e[l].$rowKey;
            if (c.values[n] != d.values[n]) return null;
          }
          var h = this._colBindings[i],
            u = e[t][h],
            p = e[l][h],
            g = u - p;
          return r == ShowAs.DiffRowPct && (g /= p), g;
        }
        if (a > o) break;
      }
      return null;
    }),
    (e.prototype._getColDifference = function (e, t, i, r) {
      var o = this._getColLevel(i);
      if (0 == o) return null;
      for (
        var n = this.valueFields.length,
          s = this.columnFields.length - 2,
          l = this._getShowColTotals(),
          a = i - n;
        a >= 0;
        a -= n
      ) {
        var c = this._getColLevel(a);
        if (c == o) {
          if (s > -1 && o < 0 && l != ShowTotals.Subtotals) {
            var d = this._getKey(this._colBindings[i]),
              h = this._getKey(this._colBindings[a]);
            if (d.values[s] != h.values[s]) return null;
          }
          var u = e[t],
            p = u[this._colBindings[i]],
            g = u[this._colBindings[a]],
            _ = p - g;
          return r == ShowAs.DiffColPct && (_ /= g), _;
        }
        if (c > o) break;
      }
      return null;
    }),
    (e.prototype._getShowRowTotals = function () {
      return this._valueFields.length ? this._showRowTotals : ShowTotals.None;
    }),
    (e.prototype._getShowColTotals = function () {
      return this._valueFields.length ? this._showColTotals : ShowTotals.None;
    }),
    (e.prototype._generateFields = function () {
      for (var e, t = 0; t < this._viewLists.length; t++)
        this._viewLists[t].clear();
      for (t = 0; t < this.fields.length; t++)
        (e = this.fields[t])._autoGenerated && (this.fields.removeAt(t), t--);
      if (this._server)
        for (var i = this._server.getFields(), t = 0; t < i.length; t++)
          (e = this._createField(i[t], !0)),
            this.fields.getField(e.header) || this.fields.push(e);
      else {
        var r,
          o = null,
          n = this.collectionView;
        if (
          (wjcCore.hasItems(n) && (o = (r = n.sourceCollection)[0]),
          o && this.autoGenerateFields)
        )
          for (var s in o)
            for (var l = null, a = 0; a < r.length && a < 1e3 && null == l; a++)
              (l = r[a][s]),
                wjcCore.isPrimitive(l) &&
                  ((e = this._createField(
                    {
                      binding: s,
                      header: wjcCore.toHeaderCase(s),
                      dataType: wjcCore.getType(l),
                    },
                    !0
                  )),
                  this.fields.getField(e.header) || this.fields.push(e));
        if (o)
          for (t = 0; t < this.fields.length; t++)
            null == (e = this.fields[t]).dataType &&
              e._binding &&
              (e.dataType = wjcCore.getType(e._binding.getValue(o)));
      }
    }),
    (e.prototype._createField = function (e, t) {
      var i;
      return (
        wjcCore.isString(e)
          ? (i = new PivotField(this, e))
          : e &&
            (e.key && delete e.key,
            (i =
              null != e.dimensionType
                ? new CubePivotField(this, e.binding, e.header)
                : new PivotField(this, e.binding, e.header)),
            null != e.dataType && (i.dataType = e.dataType)),
        (i._autoGenerated = t),
        (t || wjcCore.isString(e)) &&
          ((i.format = i.dataType == wjcCore.DataType.Date ? 'd' : 'n0'),
          (i.aggregate =
            i.dataType == wjcCore.DataType.Number
              ? wjcCore.Aggregate.Sum
              : wjcCore.Aggregate.Cnt)),
        e && !wjcCore.isString(e) && wjcCore.copy(i, e),
        i
      );
    }),
    (e.prototype._cvCollectionChanged = function (e, t) {
      this.invalidate();
    }),
    (e.prototype._fieldListChanged = function (e, t) {
      if (t.action == wjcCore.NotifyCollectionChangedAction.Add) {
        for (var i = e, r = 0; r < i.length - 1; r++)
          if (i[r].key)
            for (var o = r + 1; o < i.length; o++)
              i[r].key == i[o].key && (i.removeAt(o), o--);
        if (i != this._fields)
          if (this._fields.getField(t.item.key)) {
            for (r = 0; r < this._viewLists.length; r++)
              if (this._viewLists[r] != i) {
                var n = this._viewLists[r];
                (s = n.indexOf(t.item)) > -1 && n.removeAt(s);
              }
          } else i.removeAt(t.index);
        if (wjcCore.isNumber(i.maxItems) && i.maxItems > -1)
          for (; i.length > i.maxItems; ) {
            var s = i.length - 1;
            i[s] == t.item && s > 0 && s--, i.removeAt(s);
          }
      }
      this.onViewDefinitionChanged(), this.invalidate();
    }),
    (e.prototype._fieldPropertyChanged = function (e, t) {
      if ((this.onViewDefinitionChanged(), e.isActive)) {
        var i = t.propertyName;
        'width' != i && 'wordWrap' != i && 'isContentHtml' != i
          ? 'format' == i && this.valueFields.indexOf(e) > -1
            ? this._pivotView.refresh()
            : 'showAs' != i
            ? 'descending' != i
              ? 'aggregate' != i
                ? this.invalidate()
                : this.valueFields.indexOf(e) > -1 &&
                  !this.isUpdating &&
                  (this._server ? this._updateView() : this._updatePivotView())
              : this._updatePivotView()
            : this.valueFields.indexOf(e) > -1 &&
              !this.isUpdating &&
              this._updatePivotView()
          : this._pivotView.refresh();
      }
    }),
    (e.prototype._copyProps = function (e, t, i) {
      for (var r = 0; r < i.length; r++) {
        var o = i[r];
        null != t[o] && (e[o] = t[o]);
      }
    }),
    (e.prototype._getFieldFromDefinition = function (e) {
      var t = e.filter;
      e.filter && delete e.filter;
      var i = this._createField(e, !0);
      return t && (this._setFilterProxy(i, t), (e.filter = t)), i;
    }),
    (e.prototype._getFieldDefinition = function (e) {
      var t = {
        binding: e.binding,
        header: e.header,
        dataType: e.dataType,
        aggregate: e.aggregate,
        showAs: e.showAs,
        descending: e.descending,
        format: e.format,
        width: e.width,
        isContentHtml: e.isContentHtml,
      };
      if (
        (e.weightField && (t.weightField = e.weightField._getName()),
        e.key && (t.key = e.key),
        e.filter.isActive && (t.filter = this._getFilterProxy(e)),
        e instanceof CubePivotField)
      ) {
        var i = e;
        if (
          ((t.dimensionType = i.dimensionType),
          i.subFields && i.subFields.length)
        ) {
          t.subFields = [];
          for (var r = 0; r < i.subFields.length; r++)
            t.subFields.push(this._getFieldDefinition(i.subFields[r]));
        }
      }
      return t;
    }),
    (e.prototype._getFieldCollectionProxy = function (e) {
      var t = { items: [] };
      wjcCore.isNumber(e.maxItems) &&
        e.maxItems > -1 &&
        (t.maxItems = e.maxItems);
      for (var i = 0; i < e.length; i++) {
        var r = e[i];
        t.items.push(r.key);
      }
      return t;
    }),
    (e.prototype._setFieldCollectionProxy = function (e, t) {
      e.clear(),
        (e.maxItems = wjcCore.isNumber(t.maxItems) ? t.maxItems : null);
      for (var i = 0; i < t.items.length; i++) e.push(t.items[i]);
    }),
    (e.prototype._getFilterProxy = function (e) {
      var t = e.filter;
      if (t.conditionFilter.isActive) {
        var i = t.conditionFilter,
          r = {
            type: 'condition',
            condition1: {
              operator: i.condition1.operator,
              value: i.condition1.value,
            },
            and: i.and,
            condition2: {
              operator: i.condition2.operator,
              value: i.condition2.value,
            },
          };
        return (
          i.condition1.isActive || delete r.condition1,
          i.condition2.isActive || delete r.condition2,
          r
        );
      }
      if (t.valueFilter.isActive) {
        var o = t.valueFilter;
        return {
          type: 'value',
          filterText: o.filterText,
          showValues: o.showValues,
        };
      }
      return (
        wjcCore.assert(!1, "inactive filters shouldn't be persisted."), null
      );
    }),
    (e.prototype._setFilterProxy = function (e, t) {
      var i = e.filter;
      switch ((i.clear(), t.type)) {
        case 'condition':
          var r = i.conditionFilter;
          if (t.condition1) {
            o = wjcCore.changeType(t.condition1.value, e.dataType, e.format);
            (r.condition1.value = o || t.condition1.value),
              (r.condition1.operator = t.condition1.operator);
          }
          if ((wjcCore.isBoolean(t.and) && (r.and = t.and), t.condition2)) {
            var o = wjcCore.changeType(
              t.condition2.value,
              e.dataType,
              e.format
            );
            (r.condition2.value = o || t.condition2.value),
              (r.condition2.operator = t.condition2.operator);
          }
          break;
        case 'value':
          var n = i.valueFilter;
          (n.filterText = t.filterText), (n.showValues = t.showValues);
      }
    }),
    (e._BATCH_SIZE = 1e4),
    (e._BATCH_TIMEOUT = 0),
    (e._BATCH_DELAY = 100),
    (e._props = [
      'showZeros',
      'showRowTotals',
      'showColumnTotals',
      'totalsBeforeData',
      'sortableGroups',
      'defaultFilterType',
    ]),
    e
  );
})();
exports.PivotEngine = PivotEngine;
var ProgressEventArgs = (function (e) {
  function t(t) {
    var i = e.call(this) || this;
    return (i._progress = wjcCore.asNumber(t)), i;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'progress', {
      get: function () {
        return this._progress;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.EventArgs);
exports.ProgressEventArgs = ProgressEventArgs;
var _ServerConnection = (function () {
  function e(e, t) {
    (this._ng = wjcCore.asType(e, PivotEngine)),
      wjcCore.assert(this._isValidUrl(t), 'Invalid service Url: ' + t + ')');
  }
  return (
    (e.prototype.getFields = function () {
      var e = this,
        t = null;
      return (
        wjcCore.httpRequest(this._getUrl('Fields'), {
          async: !1,
          success: function (e) {
            (t = JSON.parse(e.responseText)),
              wjcCore.isArray(t) ||
                console.error(
                  'Failed to get fields from server: ' + e.responseText
                );
          },
          error: function (t) {
            e._handleError('Getting Fields', t);
          },
        }),
        t
      );
    }),
    (e.prototype.getOutputView = function (e) {
      var t = this;
      this.clearPendingRequests(),
        this._sendHttpRequest('Analyses', {
          method: 'POST',
          data: { view: this._ng.viewDefinition },
          success: function (i) {
            var r = JSON.parse(i.responseText);
            (t._token = r.token),
              (t._start = Date.now()),
              t._handleResult(r.status, e);
          },
          error: function (e) {
            t._handleError('Analyses', e);
          },
        });
    }),
    (e.prototype.getDetail = function (t, i) {
      for (
        var r,
          o = [],
          n = this._ng.rowFields.length,
          s = t ? t.values.length : 0,
          l = 0;
        l < n;
        l++
      )
        l < s ? o.push(e._getRequestedValue(t.values[l])) : o.push(null);
      (n = this._ng.columnFields.length), (s = i ? i.values.length : 0);
      for (l = 0; l < n; l++)
        l < s ? o.push(e._getRequestedValue(i.values[l])) : o.push(null);
      return (
        (r = new wjcCore.ObservableArray()),
        this._loadArray('Detail', r, {
          method: 'POST',
          view: this._ng.viewDefinition,
          keys: o,
          max: this._ng.serverMaxDetail,
        }),
        r
      );
    }),
    (e._getRequestedValue = function (e) {
      if (wjcCore.isDate(e)) {
        var t = e;
        return new Date(
          Date.UTC(
            t.getFullYear(),
            t.getMonth(),
            t.getDate(),
            t.getHours(),
            t.getMinutes(),
            t.getSeconds(),
            t.getMilliseconds()
          )
        );
      }
      return e;
    }),
    (e.prototype.clearPendingRequests = function () {
      this._clearRequest(), this._clearTimeout(), this._clearToken();
    }),
    (e.prototype.updateTallies = function (e) {
      var t = this,
        i = this._ng,
        r = i.rowFields.length,
        o = i.columnFields.length,
        n = i.valueFields.length,
        s = new _PivotNode(i.rowFields, 0, null, -1, null);
      e.forEach(function (e, l, a) {
        var c = t._getAggregatedFieldCount(e, i.rowFields),
          d = s.getNode(i.rowFields, r - c, null, -1, e),
          h = d.key,
          u = h.toString(),
          p = i._tallies[u];
        p || ((i._keys[u] = h), (i._tallies[u] = p = {})),
          (c = t._getAggregatedFieldCount(e, i.columnFields));
        for (var g = 0; g < n; g++) {
          var _ = d.tree.getNode(
              i.columnFields,
              o - c,
              i.valueFields,
              g,
              e
            ).key,
            f = _.toString(),
            w = i.valueFields[g],
            v = p[f];
          v
            ? wjcCore.assert(!1, 'Server tallies have a single value.')
            : ((i._keys[f] = _),
              (v = p[f] = new _ServerTally()).add(t._getFieldValue(w, e, !1)));
        }
      });
    }),
    (e.prototype._getFieldValue = function (e, t, i) {
      var r = t[e.key];
      return i && 'string' != typeof r
        ? wjcCore.Globalize.format(r, e.format)
        : r;
    }),
    (e.prototype._getAggregatedFieldCount = function (e, t) {
      for (var i = t.length, r = 0, o = 0; o < i; o++) {
        var n = t[o];
        null == this._getFieldValue(n, e, !1) && r++;
      }
      return r;
    }),
    (e.prototype._loadArray = function (e, t, i) {
      var r = this;
      i || (i = {}),
        null == i.skip && (i.skip = 0),
        null == i.top && (i.top = 100);
      var o = wjcCore.isNumber(i.max) ? i.max : 1e6;
      this._request = wjcCore.httpRequest(this._getUrl(e), {
        data: i,
        method: i.method || 'GET',
        success: function (n) {
          var s = JSON.parse(n.responseText);
          t.deferUpdate(function () {
            s.value.forEach(function (e) {
              t.push(e);
            });
          }),
            s.value.length == i.top &&
              t.length < o &&
              ((i.skip += i.top), r._loadArray(e, t, i));
        },
        error: function (t) {
          r._handleError(e, t);
        },
      });
    }),
    (e.prototype._getUrl = function (e, t, i) {
      void 0 === t && (t = this._token);
      var r = this._ng.itemsSource.toString(),
        o = r.lastIndexOf('/');
      r.substr(0, o);
      switch ((e = e.toLowerCase())) {
        case 'rawdata':
        case 'detail':
          return r;
        case 'fields':
        case 'analyses':
          return r + '/' + e;
        case 'clear':
          return r + '/analyses/' + t + '/';
        case 'result':
        case 'status':
          return r + '/analyses/' + t + '/' + e;
        case 'uniquevalues':
          return r + '/fields/' + i + '/' + e;
      }
      wjcCore.assert(!1, 'Unrecognized command');
    }),
    (e.prototype._isValidUrl = function (e) {
      var t = document.createElement('a');
      return (
        (t.href = wjcCore.asString(e)),
        (t.href = t.href),
        t.protocol && t.hostname && t.pathname && '/' != e[e.length - 1]
      );
    }),
    (e.prototype._handleResult = function (e, t) {
      var i = this;
      switch (e.executingStatus.toLowerCase()) {
        case 'executing':
        case 'notset':
          if (Date.now() - this._start > this._ng.serverTimeout)
            return void this._handleError('Analyses', {
              status: 500,
              statusText: 'Analysis timed out',
            });
          (this._progress = e.progress),
            this._ng.onUpdatingView(new ProgressEventArgs(this._progress)),
            this._clearTimeout(),
            (this._toGetStatus = setTimeout(function () {
              i._waitUntilComplete(t);
            }, this._ng.serverPollInterval));
          break;
        case 'completed':
          (this._progress = 100),
            this._ng.onUpdatingView(new ProgressEventArgs(this._progress)),
            this._getResults(t);
          break;
        case 'exception':
          this._getResults(t);
          break;
        default:
          this._handleError('Analyses', {
            status: 500,
            statusText: 'Unexpected result...',
          });
      }
    }),
    (e.prototype._waitUntilComplete = function (e) {
      var t = this;
      this._sendHttpRequest('Status', {
        success: function (i) {
          var r = JSON.parse(i.responseText);
          t._handleResult(r, e);
        },
        error: function (e) {
          t._handleError('Status', e);
        },
      });
    }),
    (e.prototype._getResults = function (e) {
      var t = this;
      this._sendHttpRequest('Result', {
        success: function (i) {
          t._clearToken();
          var r = JSON.parse(i.responseText);
          wjcCore.assert(wjcCore.isArray(r), 'Result array Expected.');
          var o = [];
          t._ng._viewLists.forEach(function (e) {
            o = o.concat(
              e.filter(function (e) {
                return e.dataType == wjcCore.DataType.Date;
              })
            );
          }),
            o.length > 0 &&
              r.forEach(function (e) {
                o.forEach(function (t) {
                  var i = t._binding,
                    r = i.getValue(e);
                  wjcCore.isString(r) && i.setValue(e, new Date(r));
                });
              }),
            wjcCore.asFunction(e)(r);
        },
        error: function (e) {
          t._handleError('Result', e);
        },
      });
    }),
    (e.prototype._handleError = function (e, t) {
      this.clearPendingRequests(),
        (e = '** HttpRequest error on command "' + e + '"'),
        this._ng.onError(new wjcCore.RequestErrorEventArgs(t, e)) &&
          this._throwResponseError(e, t);
    }),
    (e.prototype._throwResponseError = function (e, t) {
      e = e + '\r\n' + t.status + '\r\n';
      var i = t.responseText || '';
      throw (
        (500 == t.status &&
          t.responseText &&
          (i = JSON.parse(t.responseText).ExceptionMessage),
        (e += i || t.statusText))
      );
    }),
    (e.prototype._sendHttpRequest = function (e, t) {
      var i = this._getUrl(e);
      this._request = wjcCore.httpRequest(i, t);
    }),
    (e.prototype._clearToken = function () {
      this._token &&
        (this._clearRequest(),
        this._clearTimeout(),
        this._sendHttpRequest('Clear', { method: 'DELETE' }),
        (this._token = null));
    }),
    (e.prototype._clearRequest = function () {
      this._request &&
        4 != this._request.readyState &&
        (this._request.abort(), (this._request = null));
    }),
    (e.prototype._clearTimeout = function () {
      this._toGetStatus &&
        (clearTimeout(this._toGetStatus), (this._toGetStatus = null));
    }),
    (e._TIMEOUT = 6e4),
    (e._POLL_INTERVAL = 500),
    (e._MAXDETAIL = 1e3),
    e
  );
})();
exports._ServerConnection = _ServerConnection;
var _ServerTally = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.add = function (e, t) {
      wjcCore.assert(0 == this._cnt, 'Server tallies have a single value.'),
        (this._aggregatedValue = e);
    }),
    (t.prototype.getAggregate = function (e) {
      return this._aggregatedValue;
    }),
    t
  );
})(_Tally);
(wjcCore.culture.olap = wjcCore.culture.olap || {}),
  (wjcCore.culture.olap._ListContextMenu = window.wijmo.culture.olap
    ._ListContextMenu || {
    up: 'Move Up',
    down: 'Move Down',
    first: 'Move to Beginning',
    last: 'Move to End',
    filter: 'Move to Report Filter',
    rows: 'Move to Row Labels',
    cols: 'Move to Column Labels',
    vals: 'Move to Values',
    remove: 'Remove Field',
    edit: 'Field Settings...',
    detail: 'Show Detail...',
  });
var _ListContextMenu = (function (e) {
  function t(t) {
    var i =
      e.call(this, document.createElement('div'), {
        header: 'Field Context Menu',
        displayMemberPath: 'text',
        commandParameterPath: 'parm',
        command: {
          executeCommand: function (e) {
            i._execute(e);
          },
          canExecuteCommand: function (e) {
            return i._canExecute(e);
          },
        },
      }) || this;
    return (
      (i._full = t),
      (i.itemsSource = i._getMenuItems(t)),
      wjcCore.addClass(i.dropDown, 'context-menu'),
      i
    );
  }
  return (
    __extends(t, e),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        (this.itemsSource = this._getMenuItems(this._full)),
        e.prototype.refresh.call(this, t);
    }),
    (t.prototype.attach = function (e) {
      var t = this;
      wjcCore.assert(
        e instanceof wjcGrid.FlexGrid,
        'Expecting a FlexGrid control...'
      );
      var i = e.hostElement;
      i.addEventListener('contextmenu', function (r) {
        t._selectField(e, r) && (r.preventDefault(), (t.owner = i), t.show(r));
      });
    }),
    (t.prototype._selectField = function (e, t) {
      var i = e.hitTest(t);
      if (i.panel != e.cells || !i.range.isValid) return !1;
      var r = e.rows[i.row].dataItem;
      return (
        !(r instanceof CubePivotField && r.subFields && r.subFields.length) &&
        (e.select(i.range, !0), !0)
      );
    }),
    (t.prototype._getMenuItems = function (e) {
      var t;
      t = e
        ? [
            { text: '<div class="menu-icon"></div>*', parm: 'up' },
            { text: '<div class="menu-icon"></div>*', parm: 'down' },
            { text: '<div class="menu-icon"></div>*', parm: 'first' },
            { text: '<div class="menu-icon"></div>*', parm: 'last' },
            { text: '<div class="wj-separator"></div>' },
            {
              text: '<div class="menu-icon"><span class="wj-glyph-filter"></span></div>*',
              parm: 'filter',
            },
            {
              text: '<div class="menu-icon">&#8801;</div>*',
              parm: 'rows',
            },
            {
              text: '<div class="menu-icon">&#10996;</div>*',
              parm: 'cols',
            },
            {
              text: '<div class="menu-icon">&#931;</div>*',
              parm: 'vals',
            },
            { text: '<div class="wj-separator"></div>' },
            {
              text: '<div class="menu-icon menu-icon-remove">&#10006;</div>*',
              parm: 'remove',
            },
            { text: '<div class="wj-separator"></div>' },
            {
              text: '<div class="menu-icon">&#9965;</div>*',
              parm: 'edit',
            },
          ]
        : [
            {
              text: '<div class="menu-icon"><span class="wj-glyph-filter"></span></div>*',
              parm: 'filter',
            },
            {
              text: '<div class="menu-icon">&#8801;</div>*',
              parm: 'rows',
            },
            {
              text: '<div class="menu-icon">&#10996;</div>*',
              parm: 'cols',
            },
            {
              text: '<div class="menu-icon">&#931;</div>*',
              parm: 'vals',
            },
            { text: '<div class="wj-separator"></div>' },
            {
              text: '<div class="menu-icon">&#9965;</div>*',
              parm: 'edit',
            },
          ];
      for (var i = 0; i < t.length; i++) {
        var r = t[i];
        if (r.parm) {
          var o = wjcCore.culture.olap._ListContextMenu[r.parm];
          wjcCore.assert(o, 'missing localized text for item ' + r.parm),
            (r.text = r.text.replace(/([^>]+$)/, o));
        }
      }
      return t;
    }),
    (t.prototype._execute = function (e) {
      var t = wjcCore.Control.getControl(this.owner),
        i = t.itemsSource,
        r = t.selection.row,
        o = t.rows[r].dataItem,
        n = o ? o.engine : null,
        s = this._getTargetList(n, e);
      switch (e) {
        case 'up':
        case 'first':
        case 'down':
        case 'last':
          if (n) {
            var l = i.indexOf(o),
              a =
                'up' == e
                  ? l - 1
                  : 'first' == e
                  ? 0
                  : 'down' == e
                  ? l + 1
                  : 'last' == e
                  ? i.length
                  : -1;
            n.deferUpdate(function () {
              i.removeAt(l), i.insert(a, o);
            });
          }
          break;
        case 'filter':
        case 'rows':
        case 'cols':
        case 'vals':
          s && o && s.push(o);
          break;
        case 'remove':
          o && n.removeField(o);
          break;
        case 'edit':
          o && n.editField(o);
      }
    }),
    (t.prototype._canExecute = function (e) {
      var t = wjcCore.Control.getControl(this.owner);
      if (!t) return !1;
      var i = t.selection.row,
        r = i > -1 ? t.rows[i].dataItem : null,
        o = r ? r.engine : null,
        n = this._getTargetList(o, e);
      switch (e) {
        case 'up':
        case 'first':
          return i > 0;
        case 'down':
        case 'last':
          return i < t.rows.length - 1;
        case 'filter':
        case 'rows':
        case 'cols':
        case 'vals':
          return n && n.indexOf(r) < 0;
        case 'edit':
          return o && o.allowFieldEditing;
        case 'detail':
          return r && !(r instanceof CubePivotField);
      }
      return !0;
    }),
    (t.prototype._getTargetList = function (e, t) {
      if (e)
        switch (t) {
          case 'filter':
            return e.filterFields;
          case 'rows':
            return e.rowFields;
          case 'cols':
            return e.columnFields;
          case 'vals':
            return e.valueFields;
        }
      return null;
    }),
    t
  );
})(wjcInput.Menu);
(exports._ListContextMenu = _ListContextMenu),
  (wjcCore.culture.olap = wjcCore.culture.olap || {}),
  (wjcCore.culture.olap.PivotPanel = window.wijmo.culture.olap.PivotPanel || {
    fields: 'Choose fields to add to report:',
    drag: 'Drag fields between areas below:',
    filters: 'Filters',
    cols: 'Columns',
    rows: 'Rows',
    vals: 'Values',
    defer: 'Defer Updates',
    update: 'Update',
  });
var PivotPanel = (function (e) {
  function t(t, i) {
    var r = e.call(this, t, null, !0) || this;
    (r._showIcons = !0),
      (r._restrictDrag = null),
      (r.itemsSourceChanged = new wjcCore.Event()),
      (r.viewDefinitionChanged = new wjcCore.Event()),
      (r.updatingView = new wjcCore.Event()),
      (r.updatedView = new wjcCore.Event());
    var o = 'Missing dependency: PivotPanel requires ';
    wjcCore.assert(null != wjcInput, o + 'wijmo.input.'),
      wjcCore.assert(
        null != wjcGrid && null != wjcGridFilter,
        o + 'wijmo.grid.filter.'
      );
    var n = r.getTemplate();
    r.applyTemplate('wj-control wj-content wj-pivotpanel', n, {
      _dFields: 'd-fields',
      _dFilters: 'd-filters',
      _dRows: 'd-rows',
      _dCols: 'd-cols',
      _dVals: 'd-vals',
      _dProgress: 'd-prog',
      _btnUpdate: 'btn-update',
      _chkDefer: 'chk-defer',
      _gFlds: 'g-flds',
      _gDrag: 'g-drag',
      _gFlt: 'g-flt',
      _gCols: 'g-cols',
      _gRows: 'g-rows',
      _gVals: 'g-vals',
      _gDefer: 'g-defer',
    }),
      r._globalize();
    var s = r.hostElement;
    r.addEventListener(s, 'dragstart', r._dragstart.bind(r)),
      r.addEventListener(s, 'dragover', r._dragover.bind(r)),
      r.addEventListener(s, 'dragleave', r._dragover.bind(r)),
      r.addEventListener(s, 'drop', r._drop.bind(r)),
      r.addEventListener(s, 'dragend', r._dragend.bind(r)),
      (r._lbFields = r._createFieldGrid(r._dFields)),
      (r._lbFilters = r._createFieldGrid(r._dFilters)),
      (r._lbRows = r._createFieldGrid(r._dRows)),
      (r._lbCols = r._createFieldGrid(r._dCols)),
      (r._lbVals = r._createFieldGrid(r._dVals));
    var l = (r._ctxMenuShort = new _ListContextMenu(!1));
    return (
      l.attach(r._lbFields),
      (l = r._ctxMenuFull = new _ListContextMenu(!0)).attach(r._lbFilters),
      l.attach(r._lbRows),
      l.attach(r._lbCols),
      l.attach(r._lbVals),
      (r._dMarker = wjcCore.createElement(
        '<div class="wj-marker" style="display:none">&nbsp;</div>'
      )),
      r.hostElement.appendChild(r._dMarker),
      r.addEventListener(r._btnUpdate, 'click', function (e) {
        r._ng.refresh(!0), e.preventDefault();
      }),
      r.addEventListener(r._chkDefer, 'click', function (e) {
        wjcCore.enable(r._btnUpdate, r._chkDefer.checked),
          r._chkDefer.checked ? r._ng.beginUpdate() : r._ng.endUpdate();
      }),
      (r.engine = new PivotEngine()),
      r.initialize(i),
      r
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'engine', {
      get: function () {
        return this._ng;
      },
      set: function (e) {
        this._ng &&
          (this._ng.itemsSourceChanged.removeHandler(this._itemsSourceChanged),
          this._ng.viewDefinitionChanged.removeHandler(
            this._viewDefinitionChanged
          ),
          this._ng.updatingView.removeHandler(this._updatingView),
          this._ng.updatedView.removeHandler(this._updatedView),
          this._ng.error.removeHandler(this._requestError)),
          (e = wjcCore.asType(e, PivotEngine, !1)),
          (this._ng = e),
          this._ng.itemsSourceChanged.addHandler(
            this._itemsSourceChanged,
            this
          ),
          this._ng.viewDefinitionChanged.addHandler(
            this._viewDefinitionChanged,
            this
          ),
          this._ng.updatingView.addHandler(this._updatingView, this),
          this._ng.updatedView.addHandler(this._updatedView, this),
          this._ng.error.addHandler(this._requestError, this),
          (this._lbFields.itemsSource = e.fields),
          (this._lbFilters.itemsSource = e.filterFields),
          (this._lbRows.itemsSource = e.rowFields),
          (this._lbCols.itemsSource = e.columnFields),
          (this._lbVals.itemsSource = e.valueFields),
          (this._lbFields.collectionView.filter = function (e) {
            return null == e.parentField;
          });
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemsSource', {
      get: function () {
        return this._ng.itemsSource;
      },
      set: function (e) {
        this._ng.itemsSource = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'collectionView', {
      get: function () {
        return this._ng.collectionView;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pivotView', {
      get: function () {
        return this._ng.pivotView;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'autoGenerateFields', {
      get: function () {
        return this.engine.autoGenerateFields;
      },
      set: function (e) {
        this._ng.autoGenerateFields = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'fields', {
      get: function () {
        return this._ng.fields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'rowFields', {
      get: function () {
        return this._ng.rowFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'columnFields', {
      get: function () {
        return this._ng.columnFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'valueFields', {
      get: function () {
        return this._ng.valueFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'filterFields', {
      get: function () {
        return this._ng.filterFields;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'viewDefinition', {
      get: function () {
        return this._ng.viewDefinition;
      },
      set: function (e) {
        this._ng.viewDefinition = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isViewDefined', {
      get: function () {
        return this._ng.isViewDefined;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showFieldIcons', {
      get: function () {
        return this._showIcons;
      },
      set: function (e) {
        e != this._showIcons &&
          ((this._showIcons = wjcCore.asBoolean(e)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'restrictDragging', {
      get: function () {
        return this._restrictDrag;
      },
      set: function (e) {
        this._restrictDrag = wjcCore.asBoolean(e, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onItemsSourceChanged = function (e) {
      this.itemsSourceChanged.raise(this, e);
    }),
    (t.prototype.onViewDefinitionChanged = function (e) {
      this.viewDefinitionChanged.raise(this, e);
    }),
    (t.prototype.onUpdatingView = function (e) {
      this.updatingView.raise(this, e);
    }),
    (t.prototype.onUpdatedView = function (e) {
      this.updatedView.raise(this, e);
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        this._lbFields.refresh(),
        this._lbFilters.refresh(),
        this._lbRows.refresh(),
        this._lbCols.refresh(),
        this._lbVals.refresh(),
        t &&
          (this._globalize(),
          this._ctxMenuShort.refresh(),
          this._ctxMenuFull.refresh()),
        e.prototype.refresh.call(this, t);
    }),
    (t.prototype._copy = function (e, t) {
      switch (e) {
        case 'engine':
          return (this.engine = t), !0;
      }
      return !1;
    }),
    (t.prototype._globalize = function () {
      var e = wjcCore.culture.olap.PivotPanel;
      wjcCore.setText(this._gFlds, e.fields),
        wjcCore.setText(this._gDrag, e.drag),
        wjcCore.setText(this._gFlt, e.filters),
        wjcCore.setText(this._gCols, e.cols),
        wjcCore.setText(this._gRows, e.rows),
        wjcCore.setText(this._gVals, e.vals),
        wjcCore.setText(this._gDefer, e.defer),
        wjcCore.setText(this._btnUpdate, e.update);
    }),
    (t.prototype._itemsSourceChanged = function (e, t) {
      this.onItemsSourceChanged(t);
    }),
    (t.prototype._viewDefinitionChanged = function (e, t) {
      e.isUpdating || (this.invalidate(), this.onViewDefinitionChanged(t));
    }),
    (t.prototype._updatingView = function (e, t) {
      var i = wjcCore.clamp(t.progress, 5, 100) % 100;
      (this._dProgress.style.width = i + '%'), this.onUpdatingView(t);
    }),
    (t.prototype._updatedView = function (e, t) {
      this.onUpdatedView(t);
    }),
    (t.prototype._requestError = function (e, t) {
      this._dProgress.style.width = '0';
    }),
    (t.prototype._createFieldGrid = function (e) {
      var t = this,
        i = new wjcGrid.FlexGrid(e, {
          autoGenerateColumns: !1,
          childItemsPath: 'subFields',
          columns: [{ binding: 'header', width: '*' }],
          headersVisibility: 'None',
          selectionMode: 'Cell',
          showAlternatingRows: !1,
        });
      return (
        (e.querySelector('[wj-part=root]').style.overflowX = 'hidden'),
        i.formatItem.addHandler(function (e, i) {
          var r = e.rows[i.row].dataItem;
          wjcCore.assert(r instanceof PivotField, 'PivotField expected...');
          var o =
            r instanceof CubePivotField &&
            null != r.subFields &&
            r.subFields.length > 0;
          wjcCore.toggleClass(i.cell, 'wj-header', o),
            i.cell.setAttribute('draggable', (!o).toString());
          var n = i.cell.innerHTML;
          r.filter.isActive &&
            (n += '&nbsp;&nbsp;<span class="wj-glyph-filter"></span>'),
            e == t._lbVals &&
              (n +=
                ' <span class="wj-aggregate">(' +
                wjcCore.Aggregate[r.aggregate] +
                ')</span>'),
            e != t._lbFields ||
              o ||
              (t._showIcons &&
                (n =
                  '<span class="wj-glyph-' +
                  (r.isMeasure ? 'measure' : 'dimension') +
                  '"></span> ' +
                  n),
              (n =
                '<label><input type="checkbox"' +
                (r.isActive ? ' checked' : '') +
                '> ' +
                n +
                '</label>')),
            (i.cell.innerHTML = n);
        }),
        i.addEventListener(e, 'click', function (e) {
          var t = e.target;
          if (t instanceof HTMLInputElement && 'checkbox' == t.type) {
            var r = i.selection,
              o = r && r.row > -1 ? i.rows[r.row].dataItem : null;
            o instanceof PivotField && (o.isActive = t.checked);
          }
        }),
        i
      );
    }),
    (t.prototype._dragstart = function (e) {
      var t = this._getFlexGridTarget(e);
      t &&
        ((this._dragField = this._hitTestField(t, e)),
        (this._dragSource =
          this._dragField instanceof PivotField ? t.hostElement : null),
        this._dragSource &&
          e.dataTransfer &&
          (wjcCore._startDrag(e.dataTransfer, 'copyMove'),
          e.stopPropagation()));
    }),
    (t.prototype._dragover = function (e) {
      var t = !1,
        i = this._getFlexGridTarget(e);
      if (i && this._dragField) {
        if (this._dragSource == this._dFields && i != this._lbFields) {
          var r = i.itemsSource;
          if (null == r.maxItems || r.length < r.maxItems) {
            var o = this._dragField;
            i.itemsSource.indexOf(o) < 0
              ? (t = !0)
              : i == this._lbVals && (t = !(o instanceof CubePivotField));
          }
        }
        this._dragSource && this._dragSource != this._dFields && (t = !0);
      }
      if (t && this._getRestrictDrag() && this._dragSource != i.hostElement) {
        var n = this._dragField.isMeasure;
        i == this._lbVals
          ? (t = n)
          : (i != this._lbRows && i != this._lbCols) || (t = !n);
      }
      t
        ? (this._updateDropMarker(i, e),
          (e.dataTransfer.dropEffect =
            this._dragSource == this._dFields ? 'copy' : 'move'),
          e.preventDefault(),
          e.stopPropagation())
        : this._updateDropMarker();
    }),
    (t.prototype._drop = function (e) {
      var t = this,
        i = this._getFlexGridTarget(e);
      if (i && this._dragField) {
        var r = wjcCore.Control.getControl(this._dragSource),
          o = this._dragField;
        r == this._lbFields &&
          i == this._lbVals &&
          i.itemsSource.indexOf(o) > -1 &&
          ((o = o._clone()), this.engine.fields.push(o)),
          i == this._lbFields
            ? (o.isActive = !1)
            : this._ng.deferUpdate(function () {
                var e = i.itemsSource,
                  r = e.indexOf(o);
                r != t._dropIndex &&
                  (r > -1 &&
                    (e.removeAt(r), r < t._dropIndex && t._dropIndex--),
                  e.insert(t._dropIndex, o));
              });
      }
      this._resetMouseState();
    }),
    (t.prototype._dragend = function (e) {
      this._resetMouseState();
    }),
    (t.prototype._hitTestField = function (e, t) {
      var i = e.hitTest(t);
      return i.panel == e.cells && i.range.isValid
        ? (e.select(i.range, !0), e.rows[i.row].dataItem)
        : null;
    }),
    (t.prototype._getRestrictDrag = function () {
      var e = this._restrictDrag;
      return (
        null == e &&
          this.fields.length &&
          (e = this.fields[0] instanceof CubePivotField),
        e
      );
    }),
    (t.prototype._resetMouseState = function () {
      (this._dragSource = null), this._updateDropMarker();
    }),
    (t.prototype._getFlexGridTarget = function (e) {
      var t = wjcCore.Control.getControl(
        wjcCore.closest(e.target, '.wj-flexgrid')
      );
      return t instanceof wjcGrid.FlexGrid ? t : null;
    }),
    (t.prototype._updateDropMarker = function (e, t) {
      if (t) {
        var i;
        if (e.rows.length) {
          var r = e.hitTest(t),
            o = r.row;
          o > -1
            ? ((i = e.getCellBoundingRect(o, 0)),
              r.point.y > i.top + i.height / 2 && ((i.top += i.height), o++),
              (this._dropIndex = o))
            : ((o = e.viewRange.bottomRow),
              ((i = e.getCellBoundingRect(o, 0)).top += i.height),
              (this._dropIndex = o + 1));
        } else
          ((i = wjcCore.Rect.fromBoundingRect(
            e.hostElement.getBoundingClientRect()
          )).top += 4),
            (this._dropIndex = 0);
        var n = this.hostElement.getBoundingClientRect();
        wjcCore.setCss(this._dMarker, {
          left: Math.round(i.left - n.left),
          top: Math.round(i.top - n.top - 2),
          width: Math.round(i.width),
          height: 4,
          display: '',
        });
      } else this._dMarker.style.display = 'none';
    }),
    (t.controlTemplate =
      '<div><label wj-part="g-flds"></label><div wj-part="d-fields"></div><label wj-part="g-drag"></label><table><tr><td width="50%"><label><span class="wj-glyph wj-glyph-filter"></span> <span wj-part="g-flt"></span></label><div wj-part="d-filters"></div></td><td width= "50%" style= "border-left-style:solid"><label><span class="wj-glyph">&#10996;</span> <span wj-part="g-cols"></span></label><div wj-part="d-cols"></div></td></tr><tr style= "border-top-style:solid"><td width="50%"><label><span class="wj-glyph">&#8801;</span> <span wj-part="g-rows"></span></label><div wj-part="d-rows"></div></td><td width= "50%" style= "border-left-style:solid"><label><span class="wj-glyph">&#931;</span> <span wj-part="g-vals"></span></label><div wj-part="d-vals"></div></td></tr></table><div wj-part="d-prog" class="wj-state-selected" style="width:0px;height:3px"></div><div style="display:table"><label style="display:table-cell;vertical-align:middle"><input wj-part="chk-defer" type="checkbox"/> <span wj-part="g-defer"></span></label><a wj-part="btn-update" href="" draggable="false" disabled class="wj-state-disabled"></a></div></div>'),
    t
  );
})(wjcCore.Control);
exports.PivotPanel = PivotPanel;
var _GridContextMenu = (function (e) {
  function t() {
    var t =
      e.call(this, document.createElement('div'), {
        header: 'PivotGrid Context Menu',
        displayMemberPath: 'text',
        commandParameterPath: 'parm',
        command: {
          executeCommand: function (e) {
            t._execute(e);
          },
          canExecuteCommand: function (e) {
            return t._canExecute(e);
          },
        },
      }) || this;
    return (
      (t.itemsSource = t._getMenuItems()),
      wjcCore.addClass(t.dropDown, 'context-menu'),
      t
    );
  }
  return (
    __extends(t, e),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        (this.itemsSource = this._getMenuItems()),
        e.prototype.refresh.call(this, t);
    }),
    (t.prototype.attach = function (e) {
      var t = this;
      wjcCore.assert(
        e instanceof PivotGrid,
        'Expecting a PivotGrid control...'
      );
      var i = e.hostElement;
      i.addEventListener('contextmenu', function (r) {
        if (
          e.customContextMenu &&
          (r.preventDefault(), (t.owner = i), t._selectField(r))
        ) {
          var o = t.dropDown;
          (t.selectedIndex = -1),
            t.onIsDroppedDownChanging(new wjcCore.CancelEventArgs()) &&
              (wjcCore.showPopup(o, r), t.onIsDroppedDownChanged(), o.focus());
        }
      });
    }),
    (t.prototype._selectField = function (e) {
      (this._targetField = null), (this._htDown = null);
      var t = wjcCore.Control.getControl(this.owner),
        i = t.engine,
        r = t.hitTest(e);
      switch (r.cellType) {
        case wjcGrid.CellType.Cell:
          t.select(r.range),
            (this._targetField = i.valueFields[r.col % i.valueFields.length]),
            (this._htDown = r);
          break;
        case wjcGrid.CellType.ColumnHeader:
          this._targetField = i.columnFields[r.row];
          break;
        case wjcGrid.CellType.RowHeader:
          this._targetField = i.rowFields[r.col];
          break;
        case wjcGrid.CellType.TopLeft:
          r.row == r.panel.rows.length - 1 &&
            (this._targetField = i.rowFields[r.col]);
      }
      return null != this._targetField;
    }),
    (t.prototype._getMenuItems = function () {
      for (
        var e = [
            {
              text: '<div class="menu-icon menu-icon-remove">&#10006;</div>Remove Field',
              parm: 'remove',
            },
            {
              text: '<div class="menu-icon">&#9965;</div>Field Settings...',
              parm: 'edit',
            },
            { text: '<div class="wj-separator"></div>' },
            {
              text: '<div class="menu-icon">&#8981;</div>Show Detail...',
              parm: 'detail',
            },
          ],
          t = 0;
        t < e.length;
        t++
      ) {
        var i = e[t];
        if (i.parm) {
          var r = wjcCore.culture.olap._ListContextMenu[i.parm];
          wjcCore.assert(r, 'missing localized text for item ' + i.parm),
            (i.text = i.text.replace(/([^>]+$)/, r));
        }
      }
      return e;
    }),
    (t.prototype._execute = function (e) {
      var t = wjcCore.Control.getControl(this.owner),
        i = this._targetField,
        r = this._htDown;
      switch (e) {
        case 'remove':
          t.engine.removeField(i);
          break;
        case 'edit':
          t.engine.editField(i);
          break;
        case 'detail':
          t.showDetail(r.row, r.col);
      }
    }),
    (t.prototype._canExecute = function (e) {
      var t = this._targetField,
        i = wjcCore.Control.getControl(this.owner),
        r = i ? i.engine : null;
      switch (e) {
        case 'remove':
          return null != t;
        case 'edit':
          return null != t && r && r.allowFieldEditing;
        case 'detail':
          return (
            null != this._htDown && null != t && !(t instanceof CubePivotField)
          );
      }
      return !0;
    }),
    t
  );
})(wjcInput.Menu);
exports._GridContextMenu = _GridContextMenu;
var _PivotMergeManager = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.getMergedRange = function (t, i, r, o) {
      void 0 === o && (o = !0);
      var n = t.grid.collectionView;
      if (
        ((this._ng = n instanceof PivotCollectionView ? n.engine : null),
        !this._ng)
      )
        return e.prototype.getMergedRange.call(this, t, i, r, o);
      if (i < 0 || i >= t.rows.length || r < 0 || r >= t.columns.length)
        return null;
      switch (t.cellType) {
        case wjcGrid.CellType.TopLeft:
          return this._getMergedTopLeftRange(t, i, r);
        case wjcGrid.CellType.RowHeader:
          return this._getMergedRowHeaderRange(t, i, r, o ? t.viewRange : null);
        case wjcGrid.CellType.ColumnHeader:
          return this._getMergedColumnHeaderRange(
            t,
            i,
            r,
            o ? t.viewRange : null
          );
      }
      return null;
    }),
    (t.prototype._getMergedTopLeftRange = function (e, t, i) {
      for (
        var r = new wjcGrid.CellRange(t, i);
        r.col > 0 && !e.getCellData(t, r.col, !0);

      )
        r.col--;
      for (
        ;
        r.col2 < e.columns.length - 1 && !e.getCellData(t, r.col2 + 1, !0);

      )
        r.col2++;
      return r;
    }),
    (t.prototype._getMergedRowHeaderRange = function (e, t, i, r) {
      var o = this._ng._getRowLevel(t);
      if (o > -1 && i >= o) {
        var n = e.getCellData(t, i, !1),
          s = void 0,
          l = void 0,
          a = r ? r.col : 0,
          c = r ? r.col2 : e.columns.length - 1;
        for (s = i; s > a && e.getCellData(t, s - 1, !1) == n; s--);
        for (l = i; l < c && e.getCellData(t, l + 1, !1) == n; l++);
        return s != l ? new wjcGrid.CellRange(t, s, t, l) : null;
      }
      var d,
        h,
        u = r ? r.row : 0,
        p = r ? r.row2 : e.rows.length - 1;
      for (d = t; d > u && this._sameColumnValues(e, t, d - 1, i); d--);
      for (h = t; h < p && this._sameColumnValues(e, t, h + 1, i); h++);
      return d != h ? new wjcGrid.CellRange(d, i, h, i) : null;
    }),
    (t.prototype._sameColumnValues = function (e, t, i, r) {
      for (; r >= 0; r--)
        if (e.getCellData(t, r, !1) != e.getCellData(i, r, !1)) return !1;
      return !0;
    }),
    (t.prototype._getMergedColumnHeaderRange = function (e, t, i, r) {
      var o = this._ng._getKey(e.columns[i].binding),
        n = e.getCellData(t, i, !1),
        s = this._ng._getColLevel(o);
      if (s > -1 && t >= s) {
        var l = void 0,
          a = void 0,
          c = r ? r.row : 0,
          d = r ? r.row2 : e.rows.length - 1;
        for (l = t; l > c && e.getCellData(l - 1, i, !1) == n; l--);
        for (a = t; a < d && e.getCellData(a + 1, i, !1) == n; a++);
        if (l != a) return new wjcGrid.CellRange(l, i, a, i);
      }
      var h,
        u,
        p = r ? r.col : 0,
        g = r ? r.col2 : e.columns.length - 1;
      for (h = i; h > p && this._sameRowValues(e, t, i, h - 1); h--);
      for (u = i; u < g && this._sameRowValues(e, t, i, u + 1); u++);
      return h != u ? new wjcGrid.CellRange(t, h, t, u) : null;
    }),
    (t.prototype._sameRowValues = function (e, t, i, r) {
      for (; t >= 0; t--)
        if (e.getCellData(t, i, !1) != e.getCellData(t, r, !1)) return !1;
      return !0;
    }),
    t
  );
})(wjcGrid.MergeManager);
exports._PivotMergeManager = _PivotMergeManager;
var PivotGrid = (function (e) {
  function t(t, i) {
    var r = e.call(this, t) || this;
    return (
      (r._showDetailOnDoubleClick = !0),
      (r._collapsibleSubtotals = !0),
      (r._customCtxMenu = !0),
      (r._showRowFldSort = !1),
      (r._showRowFldHdrs = !0),
      (r._showColFldHdrs = !0),
      (r._centerVert = !0),
      (r._collapsedKeys = {}),
      wjcCore.addClass(r.hostElement, 'wj-pivotgrid'),
      (r.isReadOnly = !0),
      (r.deferResizing = !0),
      (r.showAlternatingRows = !1),
      (r.autoGenerateColumns = !1),
      (r.allowDragging = wjcGrid.AllowDragging.None),
      (r.mergeManager = new _PivotMergeManager(r)),
      (r.customContextMenu = !0),
      r.initialize(i),
      r.formatItem.addHandler(r._formatItem, r),
      r.addEventListener(r.hostElement, 'mousedown', r._mousedown.bind(r), !0),
      r.addEventListener(r.hostElement, 'mouseup', r._mouseup.bind(r), !0),
      r.addEventListener(r.hostElement, 'dblclick', r._dblclick.bind(r), !0),
      (r._ctxMenu = new _GridContextMenu()),
      r._ctxMenu.attach(r),
      r
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'engine', {
      get: function () {
        return this._ng;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showDetailOnDoubleClick', {
      get: function () {
        return this._showDetailOnDoubleClick;
      },
      set: function (e) {
        this._showDetailOnDoubleClick = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showRowFieldHeaders', {
      get: function () {
        return this._showRowFldHdrs;
      },
      set: function (e) {
        e != this._showRowFldHdrs &&
          ((this._showRowFldHdrs = wjcCore.asBoolean(e)),
          this._updateFixedContent());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showColumnFieldHeaders', {
      get: function () {
        return this._showColFldHdrs;
      },
      set: function (e) {
        e != this._showColFldHdrs &&
          ((this._showColFldHdrs = wjcCore.asBoolean(e)),
          this._updateFixedContent());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showRowFieldSort', {
      get: function () {
        return this._showRowFldSort;
      },
      set: function (e) {
        e != this._showRowFldSort &&
          ((this._showRowFldSort = wjcCore.asBoolean(e)),
          this._updateFixedContent());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'customContextMenu', {
      get: function () {
        return this._customCtxMenu;
      },
      set: function (e) {
        this._customCtxMenu = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'collapsibleSubtotals', {
      get: function () {
        return this._collapsibleSubtotals;
      },
      set: function (e) {
        e != this._collapsibleSubtotals &&
          ((this._collapsibleSubtotals = wjcCore.asBoolean(e)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
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
    (t.prototype.getDetail = function (e, t) {
      var i = this.rows[wjcCore.asInt(e)].dataItem,
        r = this.columns[wjcCore.asInt(t)].binding;
      return this._ng.getDetail(i, r);
    }),
    (t.prototype.getKeys = function (e, t) {
      var i = this.rows[wjcCore.asInt(e)].dataItem,
        r = this.columns[wjcCore.asInt(t)].binding;
      return this._ng.getKeys(i, r);
    }),
    (t.prototype.getDetailView = function (e, t) {
      var i = this.rows[wjcCore.asInt(e)].dataItem,
        r = this.columns[wjcCore.asInt(t)].binding;
      return this._ng.getDetailView(i, r);
    }),
    (t.prototype.showDetail = function (e, t) {
      var i = new DetailDialog(document.createElement('div'));
      i.showDetail(this, new wjcGrid.CellRange(e, t));
      var r = new wjcInput.Popup(document.createElement('div'));
      (r.content = i.hostElement), r.show(!0);
    }),
    (t.prototype.collapseRowsToLevel = function (e) {
      this._collapseRowsToLevel(e);
    }),
    (t.prototype.collapseColumnsToLevel = function (e) {
      this._collapseColsToLevel(e);
    }),
    (t.prototype._getQuickAutoSize = function () {
      return wjcCore.isBoolean(this.quickAutoSize)
        ? this.quickAutoSize
        : this.formatItem.handlerCount <= 1 && null == this.itemFormatter;
    }),
    (t.prototype._bindGrid = function (t) {
      var i = this;
      this.deferUpdate(function () {
        var r = i.preserveOutlineState,
          o = i._collapsedKeys,
          n = i.rows,
          s = i.columns;
        if (
          (r || (o = i._collapsedKeys = {}),
          e.prototype._bindGrid.call(i, t),
          i._ng && r && !wjcCore.isEmpty(o))
        ) {
          for (
            var l = i._ng.totalsBeforeData,
              a = l ? n.length - 1 : 0,
              c = l ? -1 : n.length,
              d = l ? -1 : 1,
              h = a;
            h != c;
            h += d
          ) {
            var u = n[h].dataItem;
            (g = u ? u[_PivotKey._ROW_KEY_NAME] : null) &&
              g.level > 0 &&
              o[g.toString()] &&
              i._setRowCollapsed(new wjcGrid.CellRange(h, g.level - 1), !0);
          }
          (a = l ? s.length - 1 : 0), (c = l ? -1 : s.length), (d = l ? -1 : 1);
          for (h = a; h != c; h += d) {
            var p = s[h].binding,
              g = i._ng._getKey(p);
            g &&
              g.level > 0 &&
              o[g.toString()] &&
              i._setColCollapsed(new wjcGrid.CellRange(g.level - 1, h), !0);
          }
        }
      });
    }),
    (t.prototype._getCollectionView = function (e) {
      return (
        e instanceof PivotPanel
          ? (e = e.engine.pivotView)
          : e instanceof PivotEngine && (e = e.pivotView),
        wjcCore.asCollectionView(e)
      );
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        this._ctxMenu.refresh(),
        e.prototype.refresh.call(this, t);
    }),
    (t.prototype.onItemsSourceChanged = function (t) {
      this._ng &&
        (this._ng.updatedView.removeHandler(this._updatedView, this),
        this._ng.viewDefinitionChanged.removeHandler(
          this._viewDefinitionChanged,
          this
        )),
        (this._collapsedKeys = {});
      var i = this.collectionView;
      (this._ng = i instanceof PivotCollectionView ? i.engine : null),
        this._ng &&
          (this._ng.updatedView.addHandler(this._updatedView, this),
          this._ng.viewDefinitionChanged.addHandler(
            this._viewDefinitionChanged,
            this
          )),
        this._updatedView(),
        e.prototype.onItemsSourceChanged.call(this, t);
    }),
    (t.prototype.onResizedColumn = function (t) {
      var i = this._ng;
      if (
        i &&
        (t.panel == this.topLeftCells &&
          t.col < i.rowFields.length &&
          ((r = i.rowFields[t.col]).width = t.panel.columns[t.col].renderWidth),
        t.panel == this.columnHeaders && i.valueFields.length > 0)
      ) {
        var r = i.valueFields[t.col % i.valueFields.length];
        r.width = t.panel.columns[t.col].renderWidth;
      }
      e.prototype.onResizedColumn.call(this, t);
    }),
    (t.prototype._updatedView = function () {
      this._updateFixedCounts(), this.columns.clear(), this.rows.clear();
    }),
    (t.prototype._viewDefinitionChanged = function () {
      this._collapsedKeys = {};
    }),
    (t.prototype.onLoadedRows = function (t) {
      if (0 == this.columns.length) {
        var i = this.collectionView,
          r = i ? i.sourceCollection : null;
        if (r && r.length) {
          var o = r[0];
          for (var n in o)
            if (n != _PivotKey._ROW_KEY_NAME) {
              var s = new wjcGrid.Column({
                binding: n,
                dataType:
                  null != o[n]
                    ? wjcCore.getType(o[n])
                    : wjcCore.DataType.Number,
              });
              this.columns.push(s);
            }
        }
      }
      this._updateFixedContent(), e.prototype.onLoadedRows.call(this, t);
    }),
    (t.prototype._updateFixedCounts = function () {
      var e,
        t = this._ng,
        i = t && t.isViewDefined;
      (e = Math.max(1, i ? t.rowFields.length : 1)),
        this._setLength(this.topLeftCells.columns, e),
        (e = Math.max(1, i ? t.columnFields.length : 1)),
        t && t.columnFields.length && t.valueFields.length > 1 && e++,
        this._setLength(this.topLeftCells.rows, e);
    }),
    (t.prototype._setLength = function (e, t) {
      for (; e.length < t; )
        e.push(
          e instanceof wjcGrid.ColumnCollection
            ? new wjcGrid.Column()
            : new wjcGrid.Row()
        );
      for (; e.length > t; ) e.removeAt(e.length - 1);
    }),
    (t.prototype._updateFixedContent = function () {
      var e = this._ng;
      if (e && e.isViewDefined) {
        for (var t = this.topLeftCells, i = 0; i < t.rows.length; i++)
          for (c = 0; c < t.columns.length; c++) {
            s = '';
            this.showRowFieldHeaders &&
              c < e.rowFields.length &&
              i == t.rows.length - 1 &&
              (s = e.rowFields[c].header),
              this.showColumnFieldHeaders &&
                !s &&
                i < e.columnFields.length &&
                0 == c &&
                (s = e.columnFields[i].header + ':'),
              t.setCellData(i, c, s, !1, !1);
          }
        t = this.rowHeaders;
        for (i = 0; i < t.rows.length; i++) {
          r = t.rows[i].dataItem[_PivotKey._ROW_KEY_NAME];
          wjcCore.assert(r instanceof _PivotKey, 'missing PivotKey for row...');
          for (c = 0; c < t.columns.length; c++) {
            s = r.getValue(c, !0);
            t.setCellData(i, c, s, !1, !1);
          }
        }
        t = this.columnHeaders;
        for (c = 0; c < t.columns.length; c++) {
          var r = e._getKey(t.columns[c].binding),
            o = e.valueFields,
            n = o.length > 1 || 0 == o.length || r.level > -1;
          wjcCore.assert(
            r instanceof _PivotKey,
            'missing PivotKey for column...'
          );
          for (i = 0; i < t.rows.length; i++) {
            var s =
              n && i == t.rows.length - 1 && o.length
                ? o[c % o.length].header
                : r.getValue(i, !0);
            t.setCellData(i, c, s, !1, !1);
          }
        }
        t = this.topLeftCells;
        for (c = 0; c < t.columns.length; c++) {
          var l = t.columns[c],
            a = c < e.rowFields.length ? e.rowFields[c] : null;
          null == l.width &&
            (l.width =
              a && wjcCore.isNumber(a.width)
                ? a.width
                : this.columns.defaultSize),
            (l.wordWrap = a ? a.wordWrap : null),
            (l.align = null);
        }
        t = this.cells;
        for (var c = 0; c < t.columns.length; c++) {
          var l = t.columns[c],
            a = e.valueFields.length
              ? e.valueFields[c % e.valueFields.length]
              : null;
          null == l.width &&
            (l.width =
              a && wjcCore.isNumber(a.width)
                ? a.width
                : this.columns.defaultSize),
            (l.wordWrap = a ? a.wordWrap : null),
            (l.format = a ? a.format : null);
        }
      } else this.topLeftCells.setCellData(0, 0, null);
    }),
    (t.prototype._formatItem = function (e, t) {
      var i = this._ng;
      if (i) {
        if (t.panel == this.topLeftCells) {
          t.cell.style.textAlign = '';
          var r = t.row < t.panel.rows.length - 1 || 0 == i.rowFields.length;
          wjcCore.toggleClass(t.cell, 'wj-col-field-hdr', r),
            wjcCore.toggleClass(t.cell, 'wj-row-field-hdr', !r);
        }
        t.panel == this.columnHeaders &&
          (i.valueFields.length < 2 || t.row < t.panel.rows.length - 1) &&
          (t.cell.style.textAlign = '');
        var o = i._getRowLevel(t.row),
          n = i._getColLevel(t.panel.columns[t.col].binding);
        if (
          (wjcCore.toggleClass(t.cell, 'wj-aggregate', o > -1 || n > -1),
          this._collapsibleSubtotals)
        ) {
          if (
            t.panel == this.rowHeaders &&
            i._getShowRowTotals() == ShowTotals.Subtotals
          ) {
            s = this.getMergedRange(t.panel, t.row, t.col, !1) || t.range;
            t.col < i.rowFields.length - 1 &&
              s.rowSpan > 1 &&
              (t.cell.innerHTML =
                this._getCollapsedGlyph(this._getRowCollapsed(s)) +
                t.cell.innerHTML);
          }
          if (
            t.panel == this.columnHeaders &&
            i._getShowColTotals() == ShowTotals.Subtotals
          ) {
            var s = this.getMergedRange(t.panel, t.row, t.col, !1) || t.range;
            t.row < i.columnFields.length - 1 &&
              s.columnSpan > 1 &&
              (t.cell.innerHTML =
                this._getCollapsedGlyph(this._getColCollapsed(s)) +
                t.cell.innerHTML);
          }
        }
        if (
          t.panel == this.topLeftCells &&
          this.showRowFieldSort &&
          t.col < i.rowFields.length &&
          t.row == this._getSortRowIndex()
        ) {
          var l = i.rowFields[t.col];
          wjcCore.toggleClass(t.cell, 'wj-sort-asc', !l.descending),
            wjcCore.toggleClass(t.cell, 'wj-sort-desc', l.descending),
            (t.cell.innerHTML +=
              ' <span class="wj-glyph-' +
              (l.descending ? 'down' : 'up') +
              '"></span>');
        }
        if (
          this._centerVert &&
          t.cell.hasChildNodes &&
          (t.panel == this.rowHeaders || t.panel == this.columnHeaders)
        ) {
          var a = wjcCore.createElement(
            '<div style="display:table-cell;vertical-align:middle"></div>'
          );
          this._docRange || (this._docRange = document.createRange()),
            this._docRange.selectNodeContents(t.cell),
            this._docRange.surroundContents(a),
            wjcCore.setCss(t.cell, {
              display: 'table',
              tableLayout: 'fixed',
              paddingTop: 0,
              paddingBottom: 0,
            });
        }
      }
    }),
    (t.prototype._getCollapsedGlyph = function (e) {
      return (
        '<div style="display:inline-block;cursor:pointer" ' +
        t._WJA_COLLAPSE +
        '><span class="wj-glyph-' +
        (e ? 'plus' : 'minus') +
        '"></span></div>&nbsp'
      );
    }),
    (t.prototype._mousedown = function (e) {
      if (e.defaultPrevented || 0 != e.button) this._htDown = null;
      else if (
        ((this._htDown = this.hitTest(e)),
        null != wjcCore.closest(e.target, '[' + t._WJA_COLLAPSE + ']') &&
          null != this._htDown.panel)
      ) {
        var i = this._htDown.range,
          r = void 0;
        switch (this._htDown.panel.cellType) {
          case wjcGrid.CellType.RowHeader:
            (r = this._getRowCollapsed(i)),
              e.shiftKey || e.ctrlKey
                ? this._collapseRowsToLevel(i.col + (r ? 2 : 1))
                : this._setRowCollapsed(i, !r);
            break;
          case wjcGrid.CellType.ColumnHeader:
            (r = this._getColCollapsed(i)),
              e.shiftKey || e.ctrlKey
                ? this._collapseColsToLevel(i.row + (r ? 2 : 1))
                : this._setColCollapsed(i, !r);
        }
        (this._htDown = null), e.preventDefault();
      }
    }),
    (t.prototype._mouseup = function (e) {
      if (
        this._htDown &&
        !e.defaultPrevented &&
        'col-resize' != this.hostElement.style.cursor
      ) {
        var t = this.hitTest(e);
        if (
          this._htDown.panel == t.panel &&
          t.range.equals(this._htDown.range)
        ) {
          var i = this._ng,
            r = this.topLeftCells;
          if (t.panel == r && t.row == r.rows.length - 1 && t.col > -1) {
            if (this.allowSorting && t.panel.columns[t.col].allowSorting) {
              var o = new wjcGrid.CellRangeEventArgs(t.panel, t.range);
              if (this.onSortingColumn(o)) {
                i.pivotView.sortDescriptions.clear();
                var n = i.rowFields[t.col];
                (n.descending = !n.descending), this.onSortedColumn(o);
              }
            }
            e.preventDefault();
          }
        }
      }
    }),
    (t.prototype._dblclick = function (e) {
      if (
        this._ng &&
        this._ng.fields.length > 0 &&
        !(this._ng.fields[0] instanceof CubePivotField) &&
        !e.defaultPrevented &&
        this._showDetailOnDoubleClick
      ) {
        var t = this._htDown;
        t && t.panel == this.cells && this.showDetail(t.row, t.col);
      }
    }),
    (t.prototype._getRowLevel = function (e) {
      return this._ng._getRowLevel(e);
    }),
    (t.prototype._getGroupedRows = function (e) {
      var t,
        i,
        r = this._getRowLevel.bind(this),
        o = e.col + 1;
      if (this._ng.totalsBeforeData) {
        for (
          i = e.row;
          i < this.rows.length - 1 && !((n = r(i + 1)) > -1 && n <= o);
          i++
        );
        for (t = i; t > 0 && r(t) != o; t--);
      } else {
        for (t = e.row; t > 0; t--) {
          var n = r(t - 1);
          if (n > -1 && n <= o) break;
        }
        for (i = t; i < this.rows.length - 1 && r(i) != o; i++);
      }
      return (
        r(t) == o && t++,
        r(i) == o && i--,
        wjcCore.assert(i >= t, 'group end < start?'),
        i >= t ? new wjcGrid.CellRange(t, e.col, i, e.col2) : e
      );
    }),
    (t.prototype._toggleRowCollapsed = function (e) {
      this._setRowCollapsed(e, !this._getRowCollapsed(e));
    }),
    (t.prototype._getRowCollapsed = function (e) {
      e = this._getGroupedRows(e);
      var t = this._ng.totalsBeforeData ? e.row - 1 : e.row2 + 1,
        i =
          t > -1 && t < this.rows.length
            ? this.rows[t].dataItem[_PivotKey._ROW_KEY_NAME]
            : null;
      return !!i && this._collapsedKeys[i.toString()];
    }),
    (t.prototype._setRowCollapsed = function (e, t) {
      var i = this;
      e = this._getGroupedRows(e);
      var r = this._ng,
        o = r.totalsBeforeData ? e.row - 1 : e.row2 + 1,
        n =
          o > -1 && o < this.rows.length
            ? this.rows[o].dataItem[_PivotKey._ROW_KEY_NAME]
            : null;
      null != n &&
        ((this._collapsedKeys[n.toString()] = t),
        this.deferUpdate(function () {
          i.rows[r.totalsBeforeData ? e.row - 1 : e.row2 + 1].visible = !0;
          for (var n = e.row; n <= e.row2; n++) i.rows[n].visible = !t;
          if (!t) {
            for (var s = i._getRowLevel(o), l = [], a = e.row; a <= e.row2; a++)
              if (i._getRowLevel(a) > -1) {
                var c = i._getGroupedRows(new wjcGrid.CellRange(a, s));
                wjcCore.assert(
                  c.row >= e.row && c.row2 <= e.row2,
                  'child range overflow'
                ),
                  l.push(c),
                  a++;
              }
            l.forEach(function (e) {
              var t = i._getRowCollapsed(e);
              i._setRowCollapsed(e, t);
            });
          }
        }));
    }),
    (t.prototype._collapseRowsToLevel = function (e) {
      var t = this;
      e >= this._ng.rowFields.length && (e = -1),
        this.deferUpdate(function () {
          for (var i = 0; i < t.rows.length; i++) {
            var r = t._getRowLevel(i);
            if (r > 0) {
              var o = t.rows[i].dataItem[_PivotKey._ROW_KEY_NAME];
              t._collapsedKeys[o.toString()] = e > 0 && r >= e;
            }
            if (e < 0) t.rows[i].visible = !0;
            else {
              var n = r > -1 && r <= e;
              n ||
                (t._ng.totalsBeforeData
                  ? 0 == i && (n = !0)
                  : i == t.rows.length - 1 && (n = !0)),
                (t.rows[i].visible = n);
            }
          }
        });
    }),
    (t.prototype._getColLevel = function (e) {
      return this._ng._getColLevel(this.columns[e].binding);
    }),
    (t.prototype._getGroupedCols = function (e) {
      var t,
        i = this._getColLevel.bind(this),
        r = e.row + 1,
        o = e.col;
      if (this._ng.totalsBeforeData)
        for (o = e.col2; o < this.columns.length && (n = i(o)) == r; o++);
      for (; o > 0 && !((n = i(o - 1)) > -1 && n <= r); o--);
      for (t = o; t < this.columns.length - 1; t++) {
        var n = i(t + 1);
        if (n > -1 && n <= r) break;
      }
      return (
        i(o) == r && o++,
        i(t) == r && t--,
        wjcCore.assert(t >= o, 'group end < start?'),
        t >= o ? new wjcGrid.CellRange(e.row, o, e.row2, t) : e
      );
    }),
    (t.prototype._toggleColCollapsed = function (e) {
      this._setColCollapsed(e, !this._getColCollapsed(e));
    }),
    (t.prototype._getColCollapsed = function (e) {
      e = this._getGroupedCols(e);
      var t = this._ng,
        i = t.totalsBeforeData ? e.col - t.valueFields.length : e.col2 + 1,
        r =
          i > -1 && i < this.columns.length
            ? t._getKey(this.columns[i].binding)
            : null;
      return !!r && this._collapsedKeys[r.toString()];
    }),
    (t.prototype._setColCollapsed = function (e, t) {
      var i = this;
      e = this._getGroupedCols(e);
      var r = this._ng,
        o = r.totalsBeforeData ? e.col - r.valueFields.length : e.col2 + 1,
        n =
          o > -1 && o < this.columns.length
            ? r._getKey(this.columns[o].binding)
            : null;
      null != n &&
        ((this._collapsedKeys[n.toString()] = t),
        this.deferUpdate(function () {
          for (var n = 1; n <= r.valueFields.length; n++)
            i.columns[r.totalsBeforeData ? e.col - n : e.col2 + n].visible = !0;
          for (var s = e.col; s <= e.col2; s++) i.columns[s].visible = !t;
          if (!t) {
            for (var l = i._getColLevel(o), a = [], c = e.col; c <= e.col2; c++)
              if (i._getColLevel(c) > -1) {
                var d = i._getGroupedCols(new wjcGrid.CellRange(l, c));
                wjcCore.assert(
                  d.col >= e.col && d.col2 <= e.col2,
                  'child range overflow'
                ),
                  a.push(d),
                  (c += r.valueFields.length - 1);
              }
            a.forEach(function (e) {
              var t = i._getColCollapsed(e);
              i._setColCollapsed(e, t);
            });
          }
        }));
    }),
    (t.prototype._collapseColsToLevel = function (e) {
      var t = this;
      e >= this._ng.columnFields.length && (e = -1),
        this.deferUpdate(function () {
          for (var i = 0; i < t.columns.length; i++) {
            var r = t._getColLevel(i);
            if (r > 0) {
              var o = t._ng._getKey(t.columns[i].binding);
              t._collapsedKeys[o.toString()] = e > 0 && r >= e;
            }
            if (e < 0) t.columns[i].visible = !0;
            else {
              var n = r > -1 && r <= e;
              t.columns[i].visible = n;
            }
          }
        });
    }),
    (t._WJA_COLLAPSE = 'wj-pivot-collapse'),
    t
  );
})(wjcGrid.FlexGrid);
(exports.PivotGrid = PivotGrid),
  (wjcCore.culture.olap = wjcCore.culture.olap || {}),
  (wjcCore.culture.olap.DetailDialog = window.wijmo.culture.olap
    .DetailDialog || {
    header: 'Detail View:',
    ok: 'OK',
    items: '{cnt:n0} items',
    item: '{cnt} item',
    row: 'Row',
    col: 'Column',
  });
var DetailDialog = (function (e) {
  function t(t, i) {
    var r = e.call(this, t, null, !0) || this,
      o = r.getTemplate();
    r.applyTemplate('wj-control wj-content wj-detaildialog', o, {
      _sCnt: 'sp-cnt',
      _dSummary: 'div-summary',
      _dGrid: 'div-grid',
      _btnOK: 'btn-ok',
      _gHdr: 'g-hdr',
    });
    var n = wjcCore.culture.olap.DetailDialog;
    return (
      (r._gHdr.textContent = n.header),
      (r._btnOK.textContent = n.ok),
      (r._g = new wjcGrid.FlexGrid(r._dGrid, { isReadOnly: !0 })),
      r.initialize(i),
      r
    );
  }
  return (
    __extends(t, e),
    (t.prototype.showDetail = function (e, t) {
      var i = this,
        r = e.getDetailView(t.row, t.col);
      this._g.itemsSource = r;
      var o = wjcCore.tryCast(r, 'IPagedCollectionView');
      this._updateDetailCount(o ? o.totalItemCount : r.items.length),
        r.collectionChanged.addHandler(function () {
          i._updateDetailCount(r.items.length);
        });
      var n = e.engine,
        s = wjcCore.culture.olap.DetailDialog,
        l = '',
        a = e.rows[t.row].dataItem[_PivotKey._ROW_KEY_NAME],
        c = this._getHeader(a);
      c && (l += s.row + ': <b>' + wjcCore.escapeHtml(c) + '</b><br>');
      var d = n._getKey(e.columns[t.col].binding),
        h = this._getHeader(d);
      h && (l += s.col + ': <b>' + wjcCore.escapeHtml(h) + '</b><br>');
      var u = n.valueFields,
        p = u[t.col % u.length].header,
        g = e.getCellData(t.row, t.col, !0);
      (l += wjcCore.escapeHtml(p) + ': <b>' + wjcCore.escapeHtml(g) + '</b>'),
        (this._dSummary.innerHTML = l);
    }),
    (t.prototype._updateDetailCount = function (e) {
      var t = wjcCore.culture.olap.DetailDialog;
      this._sCnt.textContent = wjcCore.format(1 == e ? t.item : t.items, {
        cnt: e,
      });
    }),
    (t.prototype._getHeader = function (e) {
      if (e.values.length) {
        for (var t = [], i = 0; i < e.values.length; i++)
          t.push(e.getValue(i, !0));
        return t.join(' - ');
      }
      return null;
    }),
    (t.controlTemplate =
      '<div><div class="wj-dialog-header"><span wj-part="g-hdr">Detail View:</span> <span wj-part="sp-cnt"></span></div><div class="wj-dialog-body"><div wj-part="div-summary"></div><div wj-part="div-grid"></div></div><div class="wj-dialog-footer"><a class="wj-hide" wj-part="btn-ok" href="" draggable="false">OK</a>&nbsp;&nbsp;</div></div>'),
    t
  );
})(wjcCore.Control);
(exports.DetailDialog = DetailDialog),
  (wjcCore.culture.olap = wjcCore.culture.olap || {}),
  (wjcCore.culture.olap.PivotChart = window.wijmo.culture.olap.PivotChart || {
    by: 'by',
    and: 'and',
  });
var PivotChartType;
!(function (e) {
  (e[(e.Column = 0)] = 'Column'),
    (e[(e.Bar = 1)] = 'Bar'),
    (e[(e.Scatter = 2)] = 'Scatter'),
    (e[(e.Line = 3)] = 'Line'),
    (e[(e.Area = 4)] = 'Area'),
    (e[(e.Pie = 5)] = 'Pie');
})((PivotChartType = exports.PivotChartType || (exports.PivotChartType = {})));
var LegendVisibility;
!(function (e) {
  (e[(e.Always = 0)] = 'Always'),
    (e[(e.Never = 1)] = 'Never'),
    (e[(e.Auto = 2)] = 'Auto');
})(
  (LegendVisibility =
    exports.LegendVisibility || (exports.LegendVisibility = {}))
);
var PivotChart = (function (e) {
  function t(i, r) {
    var o = e.call(this, i) || this;
    return (
      (o._chartType = PivotChartType.Column),
      (o._showHierarchicalAxes = !0),
      (o._showTotals = !1),
      (o._showTitle = !0),
      (o._showLegend = LegendVisibility.Always),
      (o._legendPosition = wjcChart.Position.Right),
      (o._maxSeries = t.MAX_SERIES),
      (o._maxPoints = t.MAX_POINTS),
      (o._stacking = wjcChart.Stacking.None),
      (o._colItms = []),
      (o._dataItms = []),
      (o._lblsSrc = []),
      (o._grpLblsSrc = []),
      wjcCore.addClass(o.hostElement, 'wj-pivotchart'),
      o._isPieChart() ? o._createFlexPie() : o._createFlexChart(),
      e.prototype.initialize.call(o, r),
      o
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'engine', {
      get: function () {
        return this._ng;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemsSource', {
      get: function () {
        return this._itemsSource;
      },
      set: function (e) {
        if (e && this._itemsSource !== e) {
          var t = this._itemsSource;
          e instanceof PivotPanel
            ? (e = e.engine.pivotView)
            : e instanceof PivotEngine && (e = e.pivotView),
            (this._itemsSource = wjcCore.asCollectionView(e)),
            this._onItemsSourceChanged(t);
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'chartType', {
      get: function () {
        return this._chartType;
      },
      set: function (e) {
        if (e != this._chartType) {
          var t = this._chartType;
          (this._chartType = wjcCore.asEnum(e, PivotChartType)),
            this._changeChartType(),
            (e !== PivotChartType.Bar && t !== PivotChartType.Bar) ||
              this._updatePivotChart();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showHierarchicalAxes', {
      get: function () {
        return this._showHierarchicalAxes;
      },
      set: function (e) {
        e != this._showHierarchicalAxes &&
          ((this._showHierarchicalAxes = wjcCore.asBoolean(e, !0)),
          !this._isPieChart() &&
            this._flexChart &&
            this._updateFlexChart(
              this._dataItms,
              this._lblsSrc,
              this._grpLblsSrc
            ));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showTotals', {
      get: function () {
        return this._showTotals;
      },
      set: function (e) {
        e != this._showTotals &&
          ((this._showTotals = wjcCore.asBoolean(e, !0)),
          this._updatePivotChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showTitle', {
      get: function () {
        return this._showTitle;
      },
      set: function (e) {
        e != this._showTitle &&
          ((this._showTitle = wjcCore.asBoolean(e, !0)),
          this._updatePivotChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showLegend', {
      get: function () {
        return this._showLegend;
      },
      set: function (e) {
        e != this.showLegend &&
          ((this._showLegend = wjcCore.asEnum(e, LegendVisibility)),
          this._updatePivotChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'legendPosition', {
      get: function () {
        return this._legendPosition;
      },
      set: function (e) {
        e != this.legendPosition &&
          ((this._legendPosition = wjcCore.asEnum(e, wjcChart.Position)),
          this._updatePivotChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'stacking', {
      get: function () {
        return this._stacking;
      },
      set: function (e) {
        e != this._stacking &&
          ((this._stacking = wjcCore.asEnum(e, wjcChart.Stacking)),
          this._flexChart &&
            ((this._flexChart.stacking = this._stacking),
            this._updatePivotChart()));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'maxSeries', {
      get: function () {
        return this._maxSeries;
      },
      set: function (e) {
        e != this._maxSeries &&
          ((this._maxSeries = wjcCore.asNumber(e)), this._updatePivotChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'maxPoints', {
      get: function () {
        return this._maxPoints;
      },
      set: function (e) {
        e != this._maxPoints &&
          ((this._maxPoints = wjcCore.asNumber(e)), this._updatePivotChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'flexChart', {
      get: function () {
        return this._flexChart;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'flexPie', {
      get: function () {
        return this._flexPie;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        this._isPieChart()
          ? this._flexPie && this._flexPie.refresh(t)
          : this._flexChart && this._flexChart.refresh(t);
    }),
    (t.prototype._onItemsSourceChanged = function (e) {
      this._ng &&
        this._ng.updatedView.removeHandler(this._updatePivotChart, this),
        e && e.collectionChanged.removeHandler(this._updatePivotChart, this);
      var t = this._itemsSource;
      (this._ng = t instanceof PivotCollectionView ? t.engine : null),
        this._ng &&
          this._ng.updatedView.addHandler(this._updatePivotChart, this),
        this._itemsSource &&
          this._itemsSource.collectionChanged.addHandler(
            this._updatePivotChart,
            this
          ),
        this._updatePivotChart();
    }),
    (t.prototype._createFlexChart = function () {
      var e = this,
        t = document.createElement('div');
      this.hostElement.appendChild(t),
        (this._flexChart = new wjcChart.FlexChart(t)),
        (this._flexChart._bindingSeparator = null),
        (this._flexChart.legend.position = wjcChart.Position.Right),
        (this._flexChart.bindingX = _PivotKey._ROW_KEY_NAME),
        (this._flexChart.stacking = this._stacking),
        (this._flexChart.tooltip.content = function (t) {
          var i = t.name ? '<b>' + t.name + '</b> <br/>' : '';
          return (i += e._getLabel(t.x) + ' ' + e._getValue(t));
        }),
        (this._flexChart.hostElement.style.visibility = 'hidden');
    }),
    (t.prototype._createFlexPie = function () {
      var e = this,
        t = document.createElement('div');
      this.hostElement.appendChild(t),
        (this._colMenu = new wjcInput.Menu(t)),
        (this._colMenu.displayMemberPath = 'text'),
        (this._colMenu.selectedValuePath = 'prop'),
        (this._colMenu.hostElement.style.visibility = 'hidden');
      var i = document.createElement('div');
      this.hostElement.appendChild(i),
        (this._flexPie = new wjcChart.FlexPie(i)),
        (this._flexPie.bindingName = _PivotKey._ROW_KEY_NAME),
        (this._flexPie.tooltip.content = function (t) {
          return (
            '<b>' +
            e._getLabel(e._dataItms[t.pointIndex][_PivotKey._ROW_KEY_NAME]) +
            '</b> <br/>' +
            e._getValue(t)
          );
        }),
        this._flexPie.rendering.addHandler(this._updatePieInfo, this);
    }),
    (t.prototype._updatePivotChart = function () {
      if (this._ng && this._ng.pivotView) {
        for (
          var e,
            t = [],
            i = [],
            r = [],
            o = 0,
            n = this._ng.pivotView,
            s = this._ng.rowFields,
            l = 0;
          l < n.items.length;
          l++
        ) {
          var a = n.items[l],
            c = a.$rowKey;
          if ((0 == l && this._getColumns(a), t.length >= this._maxPoints))
            break;
          if (!this._isTotalRow(a[_PivotKey._ROW_KEY_NAME])) {
            t.push(a),
              i.push({
                value: t.length - 1,
                text: this._getLabel(a[_PivotKey._ROW_KEY_NAME]),
              });
            for (u = 0; u < s.length; u++)
              if (
                (r.length <= u && r.push([]), this._getMergeIndex(c, e) < u)
              ) {
                o = r[u].length - 1;
                var d = r[u][o];
                if (
                  (0 === o && u < s.length - 1 && (d.value = (d.width - 1) / 2),
                  o > 0 && u < s.length - 1)
                ) {
                  var h = this._getOffsetWidth(r[u]);
                  d.value = h + (d.width - 1) / 2;
                }
                r[u].push({
                  value: t.length - 1,
                  text: c.getValue(u, !0),
                  width: 1,
                });
              } else (o = r[u].length - 1), r[u][o].width++;
            e = c;
          }
        }
        for (var u = 0; u < s.length; u++)
          u < r.length &&
            ((o = r[u].length - 1),
            (r[u][o].value =
              this._getOffsetWidth(r[u]) + (r[u][o].width - 1) / 2));
        (this._dataItms = t),
          (this._lblsSrc = i),
          (this._grpLblsSrc = r),
          this._updateFlexChartOrPie();
      }
    }),
    (t.prototype._updateFlexChartOrPie = function () {
      var e = this._isPieChart();
      !e && this._flexChart
        ? this._updateFlexChart(this._dataItms, this._lblsSrc, this._grpLblsSrc)
        : e &&
          this._flexPie &&
          this._updateFlexPie(this._dataItms, this._lblsSrc);
    }),
    (t.prototype._updateFlexChart = function (e, t, i) {
      if (this._ng && this._flexChart) {
        var r,
          o = this._flexChart,
          n = o.hostElement;
        if (
          (o.beginUpdate(),
          (o.itemsSource = e),
          this._createSeries(),
          o.series && o.series.length > 0 && e.length > 0
            ? (n.style.visibility = 'visible')
            : (n.style.visibility = 'hidden'),
          (o.header = this._getChartTitle()),
          this._isBarChart())
        ) {
          if (this._showHierarchicalAxes && i.length > 0) {
            if (
              ((o.axisY.itemsSource = i[i.length - 1]),
              (o.axisX.labelAngle = void 0),
              i.length >= 2)
            )
              for (s = i.length - 2; s >= 0; s--) this._createGroupAxes(i[s]);
          } else (o.axisY.labelAngle = void 0), (o.axisY.itemsSource = t);
          o.axisX.itemsSource = void 0;
        } else {
          if (this._showHierarchicalAxes && i.length > 0) {
            if (((o.axisX.itemsSource = i[i.length - 1]), i.length >= 2))
              for (var s = i.length - 2; s >= 0; s--)
                this._createGroupAxes(i[s]);
          } else (o.axisX.labelAngle = void 0), (o.axisX.itemsSource = t);
          o.axisY.itemsSource = void 0;
        }
        (o.axisX.labelPadding = 6),
          (o.axisY.labelPadding = 6),
          this.chartType === PivotChartType.Bar
            ? ((r = o.axisX), (o.axisY.reversed = !0))
            : ((r = o.axisY), (o.axisY.reversed = !1)),
          o.stacking !== wjcChart.Stacking.Stacked100pc &&
          this._ng.valueFields.length > 0 &&
          this._ng.valueFields[0].format
            ? (r.format = this._ng.valueFields[0].format)
            : (r.format = ''),
          (o.legend.position = this._getLegendPosition()),
          o.endUpdate();
      }
    }),
    (t.prototype._updateFlexPie = function (e, t) {
      if (this._ng && this._flexPie) {
        var i = this._flexPie,
          r = i.hostElement,
          o = this._colMenu;
        this._colItms.length > 0 && e.length > 0
          ? (r.style.visibility = 'visible')
          : (r.style.visibility = 'hidden'),
          i.beginUpdate(),
          (i.itemsSource = e),
          (i.bindingName = _PivotKey._ROW_KEY_NAME),
          this._colItms &&
            this._colItms.length > 0 &&
            (i.binding = this._colItms[0].prop),
          (i.header = this._getChartTitle()),
          (i.legend.position = this._getLegendPosition()),
          i.endUpdate();
        var n = this._getTitle(this._ng.columnFields);
        '' !== n && (n = '<b>' + n + ': </b>'),
          this._colItms && this._colItms.length > 1 && e.length > 0
            ? ((o.hostElement.style.visibility = 'visible'),
              (o.header = n + this._colItms[0].text),
              (o.itemsSource = this._colItms),
              (o.command = {
                executeCommand: function (e) {
                  var t = o.selectedItem;
                  (o.header = n + t.text), (i.binding = t.prop);
                },
              }),
              (o.selectedIndex = 0),
              o.invalidate(),
              o.listBox.invalidate())
            : (o.hostElement.style.visibility = 'hidden');
      }
    }),
    (t.prototype._getLegendPosition = function () {
      var e = this.legendPosition;
      if (this.showLegend == LegendVisibility.Never) e = wjcChart.Position.None;
      else if (
        this.showLegend == LegendVisibility.Auto &&
        this.flexChart &&
        this.flexChart.series
      ) {
        var t = 0;
        this.flexChart.series.forEach(function (e) {
          var i = e.visibility;
          e.name &&
            i != wjcChart.SeriesVisibility.Hidden &&
            i != wjcChart.SeriesVisibility.Plot &&
            t++;
        }),
          t < 2 && (e = wjcChart.Position.None);
      }
      return e;
    }),
    (t.prototype._createSeries = function () {
      this._flexChart && (this._flexChart.series.length = 0);
      for (
        var e = 1 == this._ng.valueFields.length, t = 0;
        t < this._colItms.length;
        t++
      ) {
        var i = new wjcChart.Series(),
          r = this._colItms[t].prop,
          o = this._colItms[t].text;
        if (e) {
          var n = o.lastIndexOf(';');
          n > -1 && (o = o.substr(0, n));
        }
        (i.binding = r), (i.name = o), this._flexChart.series.push(i);
      }
    }),
    (t.prototype._getColumns = function (e) {
      var t,
        i = 0;
      if (e) {
        this._colItms.length = 0;
        for (var r in e)
          e.hasOwnProperty(r) &&
            r !== _PivotKey._ROW_KEY_NAME &&
            i < this._maxSeries &&
            ((this._showTotals && this._isTotalColumn(r)) ||
              (!this._showTotals && !this._isTotalColumn(r))) &&
            ((t = this._ng._getKey(r)),
            this._getLabel(t),
            this._colItms.push({
              prop: r,
              text: this._getLabel(t),
            }),
            i++);
      }
    }),
    (t.prototype._createGroupAxes = function (e) {
      var i,
        r = this,
        o = this._flexChart,
        n = this._isBarChart() ? o.axisY : o.axisX;
      if (e) {
        ((i = new wjcChart.Axis()).labelAngle = 0),
          (i.labelPadding = 6),
          (i.position = this._isBarChart()
            ? wjcChart.Position.Left
            : wjcChart.Position.Bottom),
          (i.majorTickMarks = wjcChart.TickMark.None),
          (i.itemsSource = e),
          (i.reversed = n.reversed),
          (i.itemFormatter = function (o, n) {
            var s =
              0.5 *
              e.filter(function (e) {
                return e.value == n.val;
              })[0].width;
            if (r._isBarChart()) {
              var l = i.reversed ? -1 : 1,
                a = i.convert(n.val + s) + 5 * l,
                c = i.convert(n.val - s) - 5 * l,
                d = i._axrect.left + i._axrect.width - 5;
              o.drawLine(d, a, d, c, t.HRHAXISCSS),
                o.drawLine(d, a, d + 5, a, t.HRHAXISCSS),
                o.drawLine(d, c, d + 5, c, t.HRHAXISCSS),
                o.drawLine(d, n.pos.y, d - 5, n.pos.y, t.HRHAXISCSS);
            } else {
              var h = i.convert(n.val - s) + 5,
                u = i.convert(n.val + s) - 5,
                p = i._axrect.top;
              o.drawLine(h, p, u, p, t.HRHAXISCSS),
                o.drawLine(h, p, h, p - 5, t.HRHAXISCSS),
                o.drawLine(u, p, u, p - 5, t.HRHAXISCSS),
                o.drawLine(n.pos.x, p, n.pos.x, p + 5, t.HRHAXISCSS);
            }
            return n;
          }),
          (i.min = n.actualMin),
          (i.max = n.actualMax),
          n.rangeChanged.addHandler(function () {
            (isNaN(i.min) && isNaN(n.actualMin)) ||
              i.min == n.actualMin ||
              (i.min = n.actualMin),
              (isNaN(i.max) && isNaN(n.actualMax)) ||
                i.max == n.actualMax ||
                (i.max = n.actualMax);
          });
        var s = new wjcChart.Series();
        (s.visibility = wjcChart.SeriesVisibility.Hidden),
          this._isBarChart() ? (s.axisY = i) : (s.axisX = i),
          o.series.push(s);
      }
    }),
    (t.prototype._updateFlexPieBinding = function () {
      (this._flexPie.binding = this._colMenu.selectedValue),
        this._flexPie.refresh();
    }),
    (t.prototype._updatePieInfo = function () {
      var e = this;
      this._flexPie &&
        (this._flexPie._labels = this._flexPie._labels.map(function (t, i) {
          return e._lblsSrc[i].text;
        }));
    }),
    (t.prototype._changeChartType = function () {
      var e = null;
      if (this.chartType === PivotChartType.Pie)
        this._flexPie || this._createFlexPie(),
          this._updateFlexPie(this._dataItms, this._lblsSrc),
          this._swapChartAndPie(!1);
      else {
        switch (this.chartType) {
          case PivotChartType.Column:
            e = wjcChart.ChartType.Column;
            break;
          case PivotChartType.Bar:
            e = wjcChart.ChartType.Bar;
            break;
          case PivotChartType.Scatter:
            e = wjcChart.ChartType.Scatter;
            break;
          case PivotChartType.Line:
            e = wjcChart.ChartType.Line;
            break;
          case PivotChartType.Area:
            e = wjcChart.ChartType.Area;
        }
        this._flexChart
          ? ('none' !== this._flexChart.hostElement.style.display &&
              e !== PivotChartType.Bar &&
              this._flexChart.chartType !== wjcChart.ChartType.Bar) ||
            this._updateFlexChart(
              this._dataItms,
              this._lblsSrc,
              this._grpLblsSrc
            )
          : (this._createFlexChart(),
            this._updateFlexChart(
              this._dataItms,
              this._lblsSrc,
              this._grpLblsSrc
            )),
          (this._flexChart.chartType = e),
          this._swapChartAndPie(!0);
      }
    }),
    (t.prototype._swapChartAndPie = function (e) {
      var t = this;
      this._flexChart &&
        (this._flexChart.hostElement.style.display = e ? 'block' : 'none'),
        this._flexPie &&
          (this._flexPie.hostElement.style.display = e ? 'none' : 'block'),
        this._colMenu &&
          this._colMenu.hostElement &&
          ((this._colMenu.hostElement.style.display = e ? 'none' : 'block'),
          (this._colMenu.hostElement.style.top = '0'),
          setTimeout(function () {
            t._colMenu.hostElement.style.top = '';
          }, 0));
    }),
    (t.prototype._getLabel = function (e) {
      var t = '';
      if (!e || !e.values) return t;
      var i = e.valueFields ? e.valueField : null;
      switch (e.values.length) {
        case 0:
          i && (t += i.header);
          break;
        case 1:
          (t += e.getValue(0, !0)), i && (t += '; ' + i.header);
          break;
        default:
          for (var r = 0; r < e.values.length; r++)
            r > 0 && (t += '; '), (t += e.getValue(r, !0));
          i && (t += '; ' + i.header);
      }
      return t;
    }),
    (t.prototype._getValue = function (e) {
      var t = this._ng.valueFields[0].format,
        i = e.series ? e.series.chart.series.indexOf(e.series) : 0,
        r = (this._ng.valueFields[i] && this._ng.valueFields[i].format) || t;
      return r ? wjcCore.Globalize.format(e.y, r) : e._yfmt;
    }),
    (t.prototype._getChartTitle = function () {
      if (!this.showTitle || !this._ng.valueFields.length) return null;
      var e = this._ng,
        t = this._getTitle(e.valueFields),
        i = this._getTitle(e.rowFields),
        r = this._getTitle(e.columnFields),
        o = t,
        n = wjcCore.culture.olap.PivotChart;
      return (
        t &&
          this._dataItms.length > 0 &&
          (i &&
            (o += wjcCore.format(' {by} {rows}', {
              by: n.by,
              rows: i,
            })),
          r &&
            (o += wjcCore.format(' {and} {cols}', {
              and: i ? n.and : n.by,
              cols: r,
            }))),
        o
      );
    }),
    (t.prototype._getTitle = function (e) {
      for (var t = '', i = 0; i < e.length; i++)
        t.length > 0 && (t += '; '), (t += e[i].header);
      return t;
    }),
    (t.prototype._isTotalColumn = function (e) {
      var t = e.split(';');
      return !!(t && t.length - 2 < this._ng.columnFields.length);
    }),
    (t.prototype._isTotalRow = function (e) {
      return e.values.length < this._ng.rowFields.length;
    }),
    (t.prototype._isPieChart = function () {
      return this._chartType == PivotChartType.Pie;
    }),
    (t.prototype._isBarChart = function () {
      return this._chartType == PivotChartType.Bar;
    }),
    (t.prototype._getMergeIndex = function (e, t) {
      var i = -1;
      if (
        null != e &&
        null != t &&
        e.values.length == t.values.length &&
        e.values.length == e.fields.length &&
        t.values.length == t.fields.length
      )
        for (var r = 0; r < e.values.length; r++) {
          if (e.getValue(r, !0) != t.getValue(r, !0)) return i;
          i = r;
        }
      return i;
    }),
    (t.prototype._getOffsetWidth = function (e) {
      var t = 0;
      if (e.length <= 1) return t;
      for (var i = 0; i < e.length - 1; i++) t += e[i].width;
      return t;
    }),
    (t.MAX_SERIES = 100),
    (t.MAX_POINTS = 100),
    (t.HRHAXISCSS = 'wj-hierarchicalaxes-line'),
    t
  );
})(wjcCore.Control);
exports.PivotChart = PivotChart;
