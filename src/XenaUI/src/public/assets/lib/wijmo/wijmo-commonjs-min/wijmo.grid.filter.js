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
var wjcGrid = require('wijmo/wijmo.grid'),
  wjcCore = require('wijmo/wijmo'),
  wjcInput = require('wijmo/wijmo.input'),
  wjcSelf = require('wijmo/wijmo.grid.filter');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.grid = window.wijmo.grid || {}),
  (window.wijmo.grid.filter = wjcSelf);
var ValueFilter = (function () {
  function e(e) {
    (this._maxValues = 250),
      (this._sortValues = !0),
      (this._col = e),
      (this._bnd = e.binding ? new wjcCore.Binding(e.binding) : null);
  }
  return (
    Object.defineProperty(e.prototype, 'showValues', {
      get: function () {
        return this._values;
      },
      set: function (e) {
        this._values = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'filterText', {
      get: function () {
        return this._filterText;
      },
      set: function (e) {
        this._filterText = wjcCore.asString(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'maxValues', {
      get: function () {
        return this._maxValues;
      },
      set: function (e) {
        this._maxValues = wjcCore.asNumber(e, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'uniqueValues', {
      get: function () {
        return this._uniqueValues;
      },
      set: function (e) {
        this._uniqueValues = wjcCore.asArray(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'sortValues', {
      get: function () {
        return this._sortValues;
      },
      set: function (e) {
        this._sortValues = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'dataMap', {
      get: function () {
        return this._map;
      },
      set: function (e) {
        this._map = wjcCore.asType(e, wjcGrid.DataMap, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'column', {
      get: function () {
        return this._col;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isActive', {
      get: function () {
        return null != this._values && Object.keys(this._values).length > 0;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.apply = function (e) {
      var t = this.column;
      return (
        !(this._bnd && this._values && Object.keys(this._values).length) ||
        ((e = this._bnd.getValue(e)),
        (e = this.dataMap
          ? this.dataMap.getDisplayValue(e)
          : t.dataMap
          ? t.dataMap.getDisplayValue(e)
          : wjcCore.Globalize.format(e, t.format)),
        void 0 != this._values[e])
      );
    }),
    (e.prototype.clear = function () {
      (this.showValues = null), (this.filterText = null);
    }),
    (e.prototype.implementsInterface = function (e) {
      return 'IColumnFilter' == e;
    }),
    (e.prototype._getUniqueValues = function (e, t) {
      var i = [];
      if (this.uniqueValues) {
        for (var r = this.uniqueValues, n = 0; n < r.length; n++) {
          u = r[n];
          i.push({ value: u, text: u.toString() });
        }
        return i;
      }
      var o = {},
        l = e.collectionView,
        a = l ? l.sourceCollection : [];
      if (t && l && l.sourceCollection && l.filter) {
        var s = this.showValues;
        this.showValues = null;
        for (var c = [], n = 0; n < a.length; n++)
          l.filter(a[n]) && c.push(a[n]);
        (a = c), (this.showValues = s);
      }
      for (n = 0; n < a.length; n++) {
        var u = e._binding.getValue(a[n]),
          p = this.dataMap
            ? this.dataMap.getDisplayValue(u)
            : e.dataMap
            ? e.dataMap.getDisplayValue(u)
            : wjcCore.Globalize.format(u, e.format);
        o[p] || ((o[p] = !0), i.push({ value: u, text: p }));
      }
      return i;
    }),
    e
  );
})();
exports.ValueFilter = ValueFilter;
var ValueFilterEditor = (function (e) {
  function t(t, i) {
    var r = e.call(this, t) || this;
    r._filter = wjcCore.asType(i, ValueFilter, !1);
    var n = r.getTemplate();
    if (
      (r.applyTemplate('wj-control', n, {
        _divFilter: 'div-filter',
        _cbSelectAll: 'cb-select-all',
        _spSelectAll: 'sp-select-all',
        _divValues: 'div-values',
      }),
      wjcCore.setText(r._spSelectAll, wjcCore.culture.FlexGridFilter.selectAll),
      (r._view = new wjcCore.CollectionView()),
      i.sortValues)
    ) {
      var o = i.column.dataMap || i.dataMap ? 'text' : 'value',
        l = i.column.dataType != wjcCore.DataType.Boolean;
      r._view.sortDescriptions.push(new wjcCore.SortDescription(o, l));
    }
    return (
      (r._view.filter = r._filterValues.bind(r)),
      r._view.collectionChanged.addHandler(r._updateSelectAllCheck, r),
      (r._filterText = ''),
      (r._cmbFilter = new wjcInput.ComboBox(r._divFilter, {
        placeholder: wjcCore.culture.FlexGridFilter.search,
      })),
      (r._lbValues = new wjcInput.ListBox(r._divValues, {
        displayMemberPath: 'text',
        checkedMemberPath: 'show',
        itemsSource: r._view,
        itemFormatter: function (e, t) {
          return t || wjcCore.culture.FlexGridFilter.null;
        },
      })),
      r._cmbFilter.textChanged.addHandler(r._filterTextChanged, r),
      r._cbSelectAll.addEventListener('click', r._cbSelectAllClicked.bind(r)),
      r.updateEditor(),
      r
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'filter', {
      get: function () {
        return this._filter;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.updateEditor = function () {
      var e = this;
      setTimeout(function () {
        e._updateEditor();
      });
    }),
    (t.prototype._updateEditor = function () {
      var e = this,
        t = this._filter.column,
        i = this._filter._getUniqueValues(t, !0);
      this._lbValues.isContentHtml = t.isContentHtml;
      var r = this._filter.showValues;
      if (r && 0 != Object.keys(r).length) {
        for (var n in r)
          for (o = 0; o < i.length; o++)
            if (i[o].text == n) {
              i[o].show = !0;
              break;
            }
      } else for (var o = 0; o < i.length; o++) i[o].show = !0;
      (this._view.pageSize = 20),
        (this._view.sourceCollection = i),
        this._view.moveCurrentTo(null),
        setTimeout(function () {
          (e._view.pageSize = e._filter.maxValues),
            (e._cmbFilter.text = e._filter.filterText),
            (e._filterText = e._cmbFilter.text.toLowerCase());
        });
    }),
    (t.prototype.clearEditor = function () {
      (this._cmbFilter.text = ''),
        (this._filterText = ''),
        (this._view.pageSize = 0),
        this._view.refresh();
      for (var e = this._view.items, t = 0; t < e.length; t++) e[t].show = !1;
      this._view.pageSize = this._filter.maxValues;
    }),
    (t.prototype.updateFilter = function () {
      var e = null,
        t = this._view.items;
      if (this._filterText || this._cbSelectAll.indeterminate) {
        e = {};
        for (var i = 0; i < t.length; i++) {
          var r = t[i];
          r.show && (e[r.text] = !0);
        }
      }
      (this._filter.showValues = e),
        (this._filter.filterText = this._filterText);
    }),
    (t.prototype._filterTextChanged = function () {
      var e = this;
      this._toText && clearTimeout(this._toText),
        (this._toText = setTimeout(function () {
          var t = e._cmbFilter.text.toLowerCase();
          t != e._filterText &&
            ((e._filterText = t),
            e._view.refresh(),
            (e._cbSelectAll.checked = !0),
            e._cbSelectAllClicked());
        }, 500));
    }),
    (t.prototype._filterValues = function (e) {
      return (
        !this._filterText ||
        (!(!e || !e.text) &&
          e.text.toLowerCase().indexOf(this._filterText) > -1)
      );
    }),
    (t.prototype._cbSelectAllClicked = function () {
      for (
        var e = this._cbSelectAll.checked, t = this._view.items, i = 0;
        i < t.length;
        i++
      )
        t[i].show = e;
      this._view.refresh();
    }),
    (t.prototype._updateSelectAllCheck = function () {
      for (var e = 0, t = this._view.items, i = 0; i < t.length; i++)
        t[i].show && e++;
      0 == e
        ? ((this._cbSelectAll.checked = !1),
          (this._cbSelectAll.indeterminate = !1))
        : e == t.length
        ? ((this._cbSelectAll.checked = !0),
          (this._cbSelectAll.indeterminate = !1))
        : (this._cbSelectAll.indeterminate = !0);
    }),
    (t.controlTemplate =
      '<div><div wj-part="div-filter"></div><div class="wj-listbox-item"><label><input wj-part="cb-select-all" type="checkbox"> <span wj-part="sp-select-all"></span></label></div><div wj-part="div-values" style="height:150px"></div></div>'),
    t
  );
})(wjcCore.Control);
exports.ValueFilterEditor = ValueFilterEditor;
var ConditionFilter = (function () {
  function e(e) {
    (this._c1 = new FilterCondition()),
      (this._c2 = new FilterCondition()),
      (this._and = !0),
      (this._col = e),
      (this._bnd = e.binding ? new wjcCore.Binding(e.binding) : null);
  }
  return (
    Object.defineProperty(e.prototype, 'condition1', {
      get: function () {
        return this._c1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'condition2', {
      get: function () {
        return this._c2;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'and', {
      get: function () {
        return this._and;
      },
      set: function (e) {
        (this._and = wjcCore.asBoolean(e)),
          (this._bnd =
            this._col && this._col.binding
              ? new wjcCore.Binding(this._col.binding)
              : null);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'dataMap', {
      get: function () {
        return this._map;
      },
      set: function (e) {
        this._map = wjcCore.asType(e, wjcGrid.DataMap, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'column', {
      get: function () {
        return this._col;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isActive', {
      get: function () {
        return this._c1.isActive || this._c2.isActive;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.apply = function (e) {
      var t = this._col,
        i = this._c1,
        r = this._c2;
      if (!this._bnd || !this.isActive) return !0;
      (e = this._bnd.getValue(e)),
        t.dataMap
          ? (e = t.dataMap.getDisplayValue(e))
          : wjcCore.isDate(e)
          ? (wjcCore.isString(i.value) || wjcCore.isString(r.value)) &&
            (e = wjcCore.Globalize.format(e, t.format))
          : wjcCore.isNumber(e) &&
            (e = wjcCore.Globalize.parseFloat(
              wjcCore.Globalize.format(e, t.format)
            ));
      var n = i.apply(e),
        o = r.apply(e);
      return i.isActive && r.isActive
        ? this._and
          ? n && o
          : n || o
        : i.isActive
        ? n
        : !r.isActive || o;
    }),
    (e.prototype.clear = function () {
      this._c1.clear(), this._c2.clear(), (this.and = !0);
    }),
    (e.prototype.implementsInterface = function (e) {
      return 'IColumnFilter' == e;
    }),
    e
  );
})();
exports.ConditionFilter = ConditionFilter;
var ConditionFilterEditor = (function (e) {
  function t(t, i) {
    var r = e.call(this, t) || this;
    r._filter = wjcCore.asType(i, ConditionFilter, !1);
    var n = r.getTemplate();
    r.applyTemplate('wj-control', n, {
      _divHdr: 'div-hdr',
      _divCmb1: 'div-cmb1',
      _divVal1: 'div-val1',
      _btnAnd: 'btn-and',
      _btnOr: 'btn-or',
      _spAnd: 'sp-and',
      _spOr: 'sp-or',
      _divCmb2: 'div-cmb2',
      _divVal2: 'div-val2',
    });
    var o = wjcCore.culture.FlexGridFilter;
    wjcCore.setText(r._divHdr, o.header),
      wjcCore.setText(r._spAnd, o.and),
      wjcCore.setText(r._spOr, o.or),
      (r._cmb1 = r._createOperatorCombo(r._divCmb1)),
      (r._cmb2 = r._createOperatorCombo(r._divCmb2)),
      (r._val1 = r._createValueInput(r._divVal1)),
      (r._val2 = r._createValueInput(r._divVal2));
    var l = r._btnAndOrChanged.bind(r);
    return (
      r._btnAnd.addEventListener('change', l),
      r._btnOr.addEventListener('change', l),
      r.updateEditor(),
      r
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'filter', {
      get: function () {
        return this._filter;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.updateEditor = function () {
      var e = this._filter.condition1,
        t = this._filter.condition2;
      (this._cmb1.selectedValue = e.operator),
        (this._cmb2.selectedValue = t.operator),
        this._val1 instanceof wjcInput.ComboBox
          ? ((this._val1.text = wjcCore.changeType(
              e.value,
              wjcCore.DataType.String,
              null
            )),
            (this._val2.text = wjcCore.changeType(
              t.value,
              wjcCore.DataType.String,
              null
            )))
          : ((this._val1.value = e.value), (this._val2.value = t.value)),
        (this._btnAnd.checked = this._filter.and),
        (this._btnOr.checked = !this._filter.and);
    }),
    (t.prototype.clearEditor = function () {
      (this._cmb1.selectedValue = this._cmb2.selectedValue = null),
        (this._val1.text = this._val2.text = null),
        (this._btnAnd.checked = !0),
        (this._btnOr.checked = !1);
    }),
    (t.prototype.updateFilter = function () {
      var e = this._filter.column,
        t = this._filter.condition1,
        i = this._filter.condition2;
      if (
        ((t.operator = this._cmb1.selectedValue),
        (i.operator = this._cmb2.selectedValue),
        this._val1 instanceof wjcInput.ComboBox)
      ) {
        var r =
          e.dataType == wjcCore.DataType.Date
            ? wjcCore.DataType.String
            : e.dataType;
        (t.value = wjcCore.changeType(this._val1.text, r, e.format)),
          (i.value = wjcCore.changeType(this._val2.text, r, e.format));
      } else (t.value = this._val1.value), (i.value = this._val2.value);
      this._filter.and = this._btnAnd.checked;
    }),
    (t.prototype._createOperatorCombo = function (e) {
      var t = this._filter.column,
        i = wjcCore.culture.FlexGridFilter.stringOperators;
      t.dataType != wjcCore.DataType.Date || this._isTimeFormat(t.format)
        ? t.dataType != wjcCore.DataType.Number || t.dataMap
          ? t.dataType != wjcCore.DataType.Boolean ||
            t.dataMap ||
            (i = wjcCore.culture.FlexGridFilter.booleanOperators)
          : (i = wjcCore.culture.FlexGridFilter.numberOperators)
        : (i = wjcCore.culture.FlexGridFilter.dateOperators);
      var r = new wjcInput.ComboBox(e);
      return (
        (r.itemsSource = i),
        (r.displayMemberPath = 'name'),
        (r.selectedValuePath = 'op'),
        r
      );
    }),
    (t.prototype._createValueInput = function (e) {
      var t = this._filter.column,
        i = null;
      return (
        t.dataType != wjcCore.DataType.Date || this._isTimeFormat(t.format)
          ? t.dataType != wjcCore.DataType.Number || t.dataMap
            ? ((i = new wjcInput.ComboBox(e)).itemsSource = this._filter.dataMap
                ? this._filter.dataMap.getDisplayValues()
                : t.dataMap
                ? t.dataMap.getDisplayValues()
                : t.dataType == wjcCore.DataType.Boolean
                ? [!0, !1]
                : null)
            : ((i = new wjcInput.InputNumber(e)).format = t.format)
          : ((i = new wjcInput.InputDate(e)).format = t.format),
        (i.isRequired = !1),
        i
      );
    }),
    (t.prototype._isTimeFormat = function (e) {
      return (
        !!e &&
        ((e = wjcCore.culture.Globalize.calendar.patterns[e] || e),
        /[Hmst]+/.test(e))
      );
    }),
    (t.prototype._btnAndOrChanged = function (e) {
      (this._btnAnd.checked = e.target == this._btnAnd),
        (this._btnOr.checked = e.target == this._btnOr);
    }),
    (t.controlTemplate =
      '<div><div wj-part="div-hdr"></div><div wj-part="div-cmb1"></div><br/><div wj-part="div-val1"></div><br/><div style="text-align:center"><label><input wj-part="btn-and" type="radio"> <span wj-part="sp-and"></span> </label>&nbsp;&nbsp;&nbsp;<label><input wj-part="btn-or" type="radio"> <span wj-part="sp-or"></span> </label></div><div wj-part="div-cmb2"></div><br/><div wj-part="div-val2"></div><br/></div>'),
    t
  );
})(wjcCore.Control);
exports.ConditionFilterEditor = ConditionFilterEditor;
var FilterCondition = (function () {
  function e() {
    this._op = null;
  }
  return (
    Object.defineProperty(e.prototype, 'operator', {
      get: function () {
        return this._op;
      },
      set: function (e) {
        this._op = wjcCore.asEnum(e, Operator, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'value', {
      get: function () {
        return this._val;
      },
      set: function (e) {
        (this._val = e),
          (this._strVal = wjcCore.isString(e)
            ? e.toString().toLowerCase()
            : null);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isActive', {
      get: function () {
        switch (this._op) {
          case null:
            return !1;
          case Operator.EQ:
          case Operator.NE:
            return !0;
          default:
            return null != this._val || null != this._strVal;
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.clear = function () {
      (this.operator = null), (this.value = null);
    }),
    (e.prototype.apply = function (e) {
      var t = this._strVal || this._val;
      switch (
        (wjcCore.isString(e) && (e = e.toLowerCase()),
        wjcCore.isString(t) && null == e && (e = ''),
        this._op)
      ) {
        case null:
          return !0;
        case Operator.EQ:
          return wjcCore.isDate(e) && wjcCore.isDate(t)
            ? wjcCore.DateTime.sameDate(e, t)
            : e == t;
        case Operator.NE:
          return e != t;
        case Operator.GT:
          return e > t;
        case Operator.GE:
          return e >= t;
        case Operator.LT:
          return e < t;
        case Operator.LE:
          return e <= t;
        case Operator.BW:
          return (
            !(!this._strVal || !wjcCore.isString(e)) &&
            0 == e.indexOf(this._strVal)
          );
        case Operator.EW:
          return (
            !!(
              this._strVal &&
              wjcCore.isString(e) &&
              e.length >= this._strVal.length
            ) && e.substr(e.length - this._strVal.length) == t
          );
        case Operator.CT:
          return (
            !(!this._strVal || !wjcCore.isString(e)) &&
            e.indexOf(this._strVal) > -1
          );
        case Operator.NC:
          return (
            !(!this._strVal || !wjcCore.isString(e)) &&
            e.indexOf(this._strVal) < 0
          );
      }
      throw 'Unknown operator';
    }),
    e
  );
})();
exports.FilterCondition = FilterCondition;
var Operator;
!(function (e) {
  (e[(e.EQ = 0)] = 'EQ'),
    (e[(e.NE = 1)] = 'NE'),
    (e[(e.GT = 2)] = 'GT'),
    (e[(e.GE = 3)] = 'GE'),
    (e[(e.LT = 4)] = 'LT'),
    (e[(e.LE = 5)] = 'LE'),
    (e[(e.BW = 6)] = 'BW'),
    (e[(e.EW = 7)] = 'EW'),
    (e[(e.CT = 8)] = 'CT'),
    (e[(e.NC = 9)] = 'NC');
})((Operator = exports.Operator || (exports.Operator = {})));
var ColumnFilter = (function () {
  function e(e, t) {
    (this._owner = e),
      (this._col = t),
      (this._valueFilter = new ValueFilter(t)),
      (this._conditionFilter = new ConditionFilter(t));
  }
  return (
    Object.defineProperty(e.prototype, 'filterType', {
      get: function () {
        return null != this._filterType
          ? this._filterType
          : this._owner.defaultFilterType;
      },
      set: function (e) {
        if (e != this._filterType) {
          var t = this.isActive;
          this.clear(),
            (this._filterType = wjcCore.asEnum(e, FilterType, !0)),
            t
              ? this._owner.apply()
              : this._col.grid && this._col.grid.invalidate();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'dataMap', {
      get: function () {
        return this.conditionFilter.dataMap || this.valueFilter.dataMap;
      },
      set: function (e) {
        (this.conditionFilter.dataMap = e), (this.valueFilter.dataMap = e);
      },
      enumerable: !0,
      configurable: !0,
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
    Object.defineProperty(e.prototype, 'column', {
      get: function () {
        return this._col;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isActive', {
      get: function () {
        return this._conditionFilter.isActive || this._valueFilter.isActive;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.apply = function (e) {
      return this._conditionFilter.apply(e) && this._valueFilter.apply(e);
    }),
    (e.prototype.clear = function () {
      this._valueFilter.clear(), this._conditionFilter.clear();
    }),
    (e.prototype.implementsInterface = function (e) {
      return 'IColumnFilter' == e;
    }),
    e
  );
})();
(exports.ColumnFilter = ColumnFilter),
  (wjcCore.culture.FlexGridFilter = window.wijmo.culture.FlexGridFilter || {
    ascending: '↑ Ascending',
    descending: '↓ Descending',
    apply: 'Apply',
    cancel: 'Cancel',
    clear: 'Clear',
    conditions: 'Filter by Condition',
    values: 'Filter by Value',
    search: 'Search',
    selectAll: 'Select All',
    null: '(nothing)',
    header: 'Show items where the value',
    and: 'And',
    or: 'Or',
    stringOperators: [
      { name: '(not set)', op: null },
      { name: 'Equals', op: Operator.EQ },
      { name: 'Does not equal', op: Operator.NE },
      { name: 'Begins with', op: Operator.BW },
      { name: 'Ends with', op: Operator.EW },
      { name: 'Contains', op: Operator.CT },
      { name: 'Does not contain', op: Operator.NC },
    ],
    numberOperators: [
      { name: '(not set)', op: null },
      { name: 'Equals', op: Operator.EQ },
      { name: 'Does not equal', op: Operator.NE },
      { name: 'Is Greater than', op: Operator.GT },
      { name: 'Is Greater than or equal to', op: Operator.GE },
      { name: 'Is Less than', op: Operator.LT },
      { name: 'Is Less than or equal to', op: Operator.LE },
    ],
    dateOperators: [
      { name: '(not set)', op: null },
      { name: 'Equals', op: Operator.EQ },
      { name: 'Is Before', op: Operator.LT },
      { name: 'Is After', op: Operator.GT },
    ],
    booleanOperators: [
      { name: '(not set)', op: null },
      { name: 'Equals', op: Operator.EQ },
      { name: 'Does not equal', op: Operator.NE },
    ],
  });
var ColumnFilterEditor = (function (e) {
  function t(t, i, r) {
    void 0 === r && (r = !0);
    var n = e.call(this, t, null, !0) || this;
    (n.filterChanged = new wjcCore.Event()),
      (n.buttonClicked = new wjcCore.Event()),
      (n._filter = wjcCore.asType(i, ColumnFilter));
    var o = n.getTemplate();
    n.applyTemplate('wj-control wj-columnfiltereditor wj-content', o, {
      _divSort: 'div-sort',
      _btnAsc: 'btn-asc',
      _btnDsc: 'btn-dsc',
      _divType: 'div-type',
      _aVal: 'a-val',
      _aCnd: 'a-cnd',
      _divEdtVal: 'div-edt-val',
      _divEdtCnd: 'div-edt-cnd',
      _btnApply: 'btn-apply',
      _btnCancel: 'btn-cancel',
      _btnClear: 'btn-clear',
    });
    var l = wjcCore.culture.FlexGridFilter;
    wjcCore.setText(n._btnAsc, l.ascending),
      wjcCore.setText(n._btnDsc, l.descending),
      wjcCore.setText(n._aVal, l.values),
      wjcCore.setText(n._aCnd, l.conditions),
      wjcCore.setText(n._btnApply, l.apply),
      wjcCore.setText(n._btnCancel, l.cancel),
      wjcCore.setText(n._btnClear, l.clear);
    var a =
      n.filter.conditionFilter.isActive ||
      0 == (i.filterType & FilterType.Value)
        ? FilterType.Condition
        : FilterType.Value;
    n._showFilter(a);
    var s = n.filter.column.grid.collectionView;
    (r && s && s.canSort) || (n._divSort.style.display = 'none');
    var c = n._btnClicked.bind(n);
    return (
      n._btnApply.addEventListener('click', c),
      n._btnCancel.addEventListener('click', c),
      n._btnClear.addEventListener('click', c),
      n._btnAsc.addEventListener('click', c),
      n._btnDsc.addEventListener('click', c),
      n._aVal.addEventListener('click', c),
      n._aCnd.addEventListener('click', c),
      n.hostElement.addEventListener('keydown', function (e) {
        if (!e.defaultPrevented)
          switch (e.keyCode) {
            case wjcCore.Key.Enter:
              switch (e.target.tagName) {
                case 'A':
                case 'BUTTON':
                  n._btnClicked(e);
                  break;
                default:
                  n.updateFilter(), n.onFilterChanged(), n.onButtonClicked();
              }
              e.preventDefault();
              break;
            case wjcCore.Key.Escape:
              n.onButtonClicked(), e.preventDefault();
          }
      }),
      n
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'filter', {
      get: function () {
        return this._filter;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.updateEditor = function () {
      this._edtVal && this._edtVal.updateEditor(),
        this._edtCnd && this._edtCnd.updateEditor();
    }),
    (t.prototype.updateFilter = function () {
      switch (this._getFilterType()) {
        case FilterType.Value:
          this._edtVal.updateFilter(), this.filter.conditionFilter.clear();
          break;
        case FilterType.Condition:
          this._edtCnd.updateFilter(), this.filter.valueFilter.clear();
      }
    }),
    (t.prototype.onFilterChanged = function (e) {
      this.filterChanged.raise(this, e);
    }),
    (t.prototype.onButtonClicked = function (e) {
      this.buttonClicked.raise(this, e);
    }),
    (t.prototype._handleResize = function () {
      this.isTouching || this._wasTouching || this.onButtonClicked();
    }),
    (t.prototype._showFilter = function (e) {
      switch (
        ((this._wasTouching = this.isTouching),
        e == FilterType.Value &&
          null == this._edtVal &&
          (this._edtVal = new ValueFilterEditor(
            this._divEdtVal,
            this.filter.valueFilter
          )),
        e == FilterType.Condition &&
          null == this._edtCnd &&
          (this._edtCnd = new ConditionFilterEditor(
            this._divEdtCnd,
            this.filter.conditionFilter
          )),
        0 != (e & this.filter.filterType) &&
          (e == FilterType.Value
            ? ((this._divEdtVal.style.display = ''),
              (this._divEdtCnd.style.display = 'none'),
              this._enableLink(this._aVal, !1),
              this._enableLink(this._aCnd, !0),
              this._edtVal.focus())
            : ((this._divEdtVal.style.display = 'none'),
              (this._divEdtCnd.style.display = ''),
              this._enableLink(this._aVal, !0),
              this._enableLink(this._aCnd, !1),
              this._edtCnd.focus())),
        this.filter.filterType)
      ) {
        case FilterType.None:
        case FilterType.Condition:
        case FilterType.Value:
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
        ? FilterType.Value
        : FilterType.Condition;
    }),
    (t.prototype._btnClicked = function (e) {
      if (
        (e.preventDefault(),
        e.stopPropagation(),
        !wjcCore.hasClass(e.target, 'wj-state-disabled'))
      )
        if (e.target != this._aVal)
          if (e.target != this._aCnd) {
            if (e.target == this._btnAsc || e.target == this._btnDsc) {
              var t = this.filter.column,
                i = t.sortMemberPath ? t.sortMemberPath : t.binding,
                r = t.grid.collectionView,
                n = new wjcCore.SortDescription(i, e.target == this._btnAsc);
              r.sortDescriptions.deferUpdate(function () {
                r.sortDescriptions.clear(), r.sortDescriptions.push(n);
              });
            }
            e.target == this._btnApply
              ? (this.updateFilter(), this.onFilterChanged())
              : e.target == this._btnClear
              ? this.filter.isActive &&
                (this.filter.clear(), this.onFilterChanged())
              : this.updateEditor(),
              this.onButtonClicked();
          } else this._showFilter(FilterType.Condition);
        else this._showFilter(FilterType.Value);
    }),
    (t.controlTemplate =
      '<div><div wj-part="div-sort"><a wj-part="btn-asc" href="" style="min-width:95px" draggable="false"></a>&nbsp;&nbsp;&nbsp;<a wj-part="btn-dsc" href="" style="min-width:95px" draggable="false"></a></div><div style="text-align:right;margin:10px 0px;font-size:80%"><div wj-part="div-type"><a wj-part="a-cnd" href="" draggable="false"></a>&nbsp;|&nbsp;<a wj-part="a-val" href="" draggable="false"></a></div></div><div wj-part="div-edt-val"></div><div wj-part="div-edt-cnd"></div><div style="text-align:right;margin-top:10px"><a wj-part="btn-apply" href="" draggable="false"></a>&nbsp;&nbsp;<a wj-part="btn-cancel" href="" draggable="false"></a>&nbsp;&nbsp;<a wj-part="btn-clear" href="" draggable="false"></a></div>'),
    t
  );
})(wjcCore.Control);
exports.ColumnFilterEditor = ColumnFilterEditor;
var FilterType;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Condition = 1)] = 'Condition'),
    (e[(e.Value = 2)] = 'Value'),
    (e[(e.Both = 3)] = 'Both');
})((FilterType = exports.FilterType || (exports.FilterType = {})));
var FlexGridFilter = (function () {
  function e(e, t) {
    (this._showIcons = !0),
      (this._showSort = !0),
      (this._defFilterType = FilterType.Both),
      (this.filterApplied = new wjcCore.Event()),
      (this.filterChanging = new wjcCore.Event()),
      (this.filterChanged = new wjcCore.Event());
    var i = 'Missing dependency: FlexGridFilter requires ';
    wjcCore.assert(null != wjcGrid, i + 'wijmo.grid.'),
      wjcCore.assert(null != wjcInput, i + 'wijmo.input.'),
      (this._filters = []),
      (this._g = wjcCore.asType(e, wjcGrid.FlexGrid, !1)),
      this._g.formatItem.addHandler(this._formatItem.bind(this)),
      this._g.itemsSourceChanged.addHandler(this.clear.bind(this));
    var r = this._g.hostElement;
    e.addEventListener(r, 'mousedown', this._mousedown.bind(this), !0),
      e.addEventListener(r, 'click', this._click.bind(this), !0),
      e.addEventListener(r, 'keydown', this._keydown.bind(this), !0),
      this._g.invalidate(),
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
    Object.defineProperty(e.prototype, 'filterColumns', {
      get: function () {
        return this._filterColumns;
      },
      set: function (e) {
        (this._filterColumns = wjcCore.asArray(e)), this.clear();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showFilterIcons', {
      get: function () {
        return this._showIcons;
      },
      set: function (e) {
        e != this.showFilterIcons &&
          ((this._showIcons = wjcCore.asBoolean(e)),
          this._g && this._g.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showSortButtons', {
      get: function () {
        return this._showSort;
      },
      set: function (e) {
        this._showSort = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getColumnFilter = function (e, t) {
      void 0 === t && (t = !0), (e = this._asColumn(e));
      for (var i = 0; i < this._filters.length; i++)
        if (this._filters[i].column == e) return this._filters[i];
      if (t && e.binding) {
        var r = new ColumnFilter(this, e);
        return this._filters.push(r), r;
      }
      return null;
    }),
    Object.defineProperty(e.prototype, 'defaultFilterType', {
      get: function () {
        return this._defFilterType;
      },
      set: function (e) {
        e != this.defaultFilterType &&
          ((this._defFilterType = wjcCore.asEnum(e, FilterType, !1)),
          this._g.invalidate(),
          this.clear());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'filterDefinition', {
      get: function () {
        for (
          var e = {
              defaultFilterType: this.defaultFilterType,
              filters: [],
            },
            t = 0;
          t < this._filters.length;
          t++
        ) {
          var i = this._filters[t];
          if (i && i.column && i.column.binding)
            if (i.conditionFilter.isActive) {
              var r = i.conditionFilter;
              e.filters.push({
                binding: i.column.binding,
                type: 'condition',
                condition1: {
                  operator: r.condition1.operator,
                  value: r.condition1.value,
                },
                and: r.and,
                condition2: {
                  operator: r.condition2.operator,
                  value: r.condition2.value,
                },
              });
            } else if (i.valueFilter.isActive) {
              var n = i.valueFilter;
              e.filters.push({
                binding: i.column.binding,
                type: 'value',
                filterText: n.filterText,
                showValues: n.showValues,
              });
            }
        }
        return JSON.stringify(e);
      },
      set: function (e) {
        if (((e = wjcCore.asString(e)), this.clear(), e)) {
          var t = JSON.parse(e);
          this.defaultFilterType = t.defaultFilterType;
          for (var i = 0; i < t.filters.length; i++) {
            var r = t.filters[i],
              n = this._g.getColumn(r.binding),
              o = this.getColumnFilter(n, !0);
            if (o)
              switch (r.type) {
                case 'condition':
                  var l = o.conditionFilter;
                  (l.condition1.value =
                    n.dataType == wjcCore.DataType.Date
                      ? wjcCore.changeType(r.condition1.value, n.dataType, null)
                      : r.condition1.value),
                    (l.condition1.operator = r.condition1.operator),
                    (l.and = r.and),
                    (l.condition2.value =
                      n.dataType == wjcCore.DataType.Date
                        ? wjcCore.changeType(
                            r.condition2.value,
                            n.dataType,
                            null
                          )
                        : r.condition2.value),
                    (l.condition2.operator = r.condition2.operator);
                  break;
                case 'value':
                  var a = o.valueFilter;
                  (a.filterText = r.filterText), (a.showValues = r.showValues);
              }
          }
        }
        this.apply();
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.editColumnFilter = function (e, t) {
      var i = this;
      this.closeEditor(), (e = this._asColumn(e));
      var r = new wjcGrid.CellRangeEventArgs(
        this._g.cells,
        new wjcGrid.CellRange(-1, e.index)
      );
      if (this.onFilterChanging(r)) {
        r.cancel = !0;
        var n = document.createElement('div'),
          o = this.getColumnFilter(e),
          l = new ColumnFilterEditor(n, o, this.showSortButtons);
        wjcCore.addClass(n, 'wj-dropdown-panel'),
          this._g.rightToLeft && (n.dir = 'rtl'),
          l.filterChanged.addHandler(function () {
            (r.cancel = !1),
              setTimeout(function () {
                r.cancel || i.apply();
              });
          }),
          l.buttonClicked.addHandler(function () {
            i.closeEditor(), i._g.focus(), i.onFilterChanged(r);
          }),
          l.lostFocus.addHandler(function () {
            setTimeout(function () {
              var e = wjcCore.Control.getControl(i._divEdt);
              e && !e.containsFocus() && i.closeEditor();
            }, 10);
          }),
          this._g.scrollIntoView(-1, e.index, !0);
        var a = this._g.columnHeaders,
          s = t ? t.row : a.rows.length - 1,
          c = t ? t.col : e.index,
          u = a.getCellBoundingRect(s, c),
          p = a.getCellElement(s, c);
        p ? wjcCore.showPopup(n, p, !1, !1, !1) : wjcCore.showPopup(n, u),
          l.focus(),
          (this._divEdt = n),
          (this._edtCol = e);
      }
    }),
    (e.prototype.closeEditor = function () {
      if (this._divEdt) {
        var e = wjcCore.Control.getControl(this._divEdt);
        e &&
          wjcCore.hidePopup(e.hostElement, function () {
            e.dispose();
          }),
          (this._divEdt = null),
          (this._edtCol = null);
      }
    }),
    (e.prototype.apply = function () {
      var e = this._g.collectionView;
      if (e) {
        var t = this._g.editableCollectionView;
        t && (t.commitEdit(), t.commitNew()),
          e.filter ? e.refresh() : (e.filter = this._filter.bind(this));
      }
      var i = e ? e.updateFilterDefinition : null;
      wjcCore.isFunction(i) && i.call(e, this), this.onFilterApplied();
    }),
    (e.prototype.clear = function () {
      this._filters.length && ((this._filters = []), this.apply());
    }),
    (e.prototype.onFilterApplied = function (e) {
      this.filterApplied.raise(this, e);
    }),
    (e.prototype.onFilterChanging = function (e) {
      return this.filterChanging.raise(this, e), !e.cancel;
    }),
    (e.prototype.onFilterChanged = function (e) {
      this.filterChanged.raise(this, e);
    }),
    (e.prototype._asColumn = function (e) {
      return wjcCore.isString(e)
        ? this._g.getColumn(e)
        : wjcCore.isNumber(e)
        ? this._g.columns[e]
        : wjcCore.asType(e, wjcGrid.Column, !1);
    }),
    (e.prototype._filter = function (e) {
      for (var t = 0; t < this._filters.length; t++)
        if (!this._filters[t].apply(e)) return !1;
      return !0;
    }),
    (e.prototype._formatItem = function (t, i) {
      if (i.panel.cellType == wjcGrid.CellType.ColumnHeader) {
        var r = this._g,
          n =
            r.getMergedRange(i.panel, i.row, i.col) ||
            new wjcGrid.CellRange(i.row, i.col),
          o = r.columns[n.col],
          l = r._getBindingColumn(i.panel, i.row, o);
        if (n.row2 == i.panel.rows.length - 1 || o != l) {
          var a = this.getColumnFilter(
            l,
            this.defaultFilterType != FilterType.None
          );
          if (
            (this._filterColumns &&
              this._filterColumns.indexOf(l.binding) < 0 &&
              (a = null),
            a && a.filterType != FilterType.None)
          ) {
            if (this._showIcons) {
              e._filterGlyph ||
                (e._filterGlyph = wjcCore.createElement(
                  '<div role="button" class="' +
                    e._WJC_FILTER +
                    '"><span class="wj-glyph-filter"></span></div> '
                ));
              var s = i.cell.querySelector('div') || i.cell;
              s.querySelector('.wj-glyph-filter') ||
                s.insertBefore(e._filterGlyph.cloneNode(!0), s.firstChild);
            }
            wjcCore.toggleClass(i.cell, 'wj-filter-on', a.isActive),
              wjcCore.toggleClass(i.cell, 'wj-filter-off', !a.isActive);
          } else
            wjcCore.removeClass(i.cell, 'wj-filter-on'),
              wjcCore.removeClass(i.cell, 'wj-filter-off');
        }
      }
    }),
    (e.prototype._mousedown = function (e) {
      this._toggleEditor(e) &&
        ((this._tmd = !0), e.stopPropagation(), e.preventDefault());
    }),
    (e.prototype._click = function (e) {
      (this._tmd || this._toggleEditor(e)) &&
        (e.stopPropagation(), e.preventDefault()),
        (this._tmd = !1);
    }),
    (e.prototype._toggleEditor = function (t) {
      var i = this;
      if (((this._tmd = !1), !t.defaultPrevented && 0 == t.button))
        if (wjcCore.closestClass(t.target, e._WJC_FILTER)) {
          var r = this._g,
            n = new wjcGrid.HitTestInfo(t.target, null);
          if ((n.panel || (n = r.hitTest(t, !0)), n.panel == r.columnHeaders)) {
            var o = r.columns[n.col],
              l = r._getBindingColumn(n.panel, n.row, o);
            return (
              this._divEdt && this._edtCol == l
                ? (this.closeEditor(), r.focus())
                : setTimeout(
                    function () {
                      i.editColumnFilter(l, n);
                    },
                    this._divEdt ? 100 : 0
                  ),
              !0
            );
          }
        } else this.closeEditor();
      return !1;
    }),
    (e.prototype._keydown = function (e) {
      if (
        !e.defaultPrevented &&
        !e.ctrlKey &&
        e.altKey &&
        (e.keyCode == wjcCore.Key.Down || e.keyCode == wjcCore.Key.Up)
      ) {
        var t = this.grid.selection,
          i = t.col > -1 ? this.grid.columns[t.col] : null;
        i &&
          !i.dataMap &&
          this.getColumnFilter(i, !0) &&
          (this.editColumnFilter(i), e.preventDefault(), e.stopPropagation());
      }
    }),
    (e._WJC_FILTER = 'wj-elem-filter'),
    e
  );
})();
exports.FlexGridFilter = FlexGridFilter;
