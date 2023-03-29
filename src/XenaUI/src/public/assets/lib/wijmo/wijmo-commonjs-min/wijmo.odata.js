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
function tryGetModuleWijmoGrid() {
  var e;
  return (e = window.wijmo) && e.grid;
}
function tryGetModuleWijmoGridFilter() {
  var e, t;
  return (e = window.wijmo) && (t = e.grid) && t.filter;
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
var wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.odata');
(window.wijmo = window.wijmo || {}), (window.wijmo.odata = wjcSelf);
var ODataCollectionView = (function (e) {
  function t(t, r, o) {
    var i = e.call(this) || this;
    return (
      (i._count = 0),
      (i._sortOnServer = !0),
      (i._pageOnServer = !0),
      (i._filterOnServer = !0),
      (i._showDatesAsGmt = !1),
      (i._inferDataTypes = !0),
      (i.loading = new wjcCore.Event()),
      (i.loaded = new wjcCore.Event()),
      (i.error = new wjcCore.Event()),
      (i._url = wjcCore.asString(t, !1)),
      (i._tbl = wjcCore.asString(r)),
      o && wjcCore.copy(i, o),
      i.sortDescriptions.collectionChanged.addHandler(function () {
        i.sortOnServer && i._getData();
      }),
      i._getData(),
      i
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'tableName', {
      get: function () {
        return this._tbl;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'fields', {
      get: function () {
        return this._fields;
      },
      set: function (e) {
        this._fields != e &&
          ((this._fields = wjcCore.asArray(e)), this._getData());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'requestHeaders', {
      get: function () {
        return this._requestHeaders;
      },
      set: function (e) {
        this._requestHeaders = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'keys', {
      get: function () {
        return this._keys;
      },
      set: function (e) {
        this._keys = wjcCore.asArray(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dataTypes', {
      get: function () {
        return this._dataTypes;
      },
      set: function (e) {
        this._dataTypes = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'inferDataTypes', {
      get: function () {
        return this._inferDataTypes;
      },
      set: function (e) {
        e != this.inferDataTypes &&
          ((this._inferDataTypes = wjcCore.asBoolean(e)), this._getData());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showDatesAsGmt', {
      get: function () {
        return this._showDatesAsGmt;
      },
      set: function (e) {
        e != this.showDatesAsGmt &&
          ((this._showDatesAsGmt = wjcCore.asBoolean(e)), this._getData());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sortOnServer', {
      get: function () {
        return this._sortOnServer;
      },
      set: function (e) {
        e != this._sortOnServer &&
          ((this._sortOnServer = wjcCore.asBoolean(e)), this._getData());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pageOnServer', {
      get: function () {
        return this._pageOnServer;
      },
      set: function (e) {
        e != this._pageOnServer &&
          ((this._pageOnServer = wjcCore.asBoolean(e)),
          this.pageSize && this._getData());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'filterOnServer', {
      get: function () {
        return this._filterOnServer;
      },
      set: function (e) {
        e != this._filterOnServer &&
          ((this._filterOnServer = wjcCore.asBoolean(e)), this._getData());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'filterDefinition', {
      get: function () {
        return this._filterDef;
      },
      set: function (e) {
        e != this._filterDef &&
          ((this._filterDef = wjcCore.asString(e)), this._getData());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.updateFilterDefinition = function (e) {
      this.filterOnServer &&
        tryGetModuleWijmoGrid() &&
        tryGetModuleWijmoGridFilter() &&
        e instanceof tryGetModuleWijmoGridFilter().FlexGridFilter &&
        (this.filterDefinition = this._asODataFilter(e));
    }),
    Object.defineProperty(t.prototype, 'oDataVersion', {
      get: function () {
        return this._odv;
      },
      set: function (e) {
        this._odv = wjcCore.asNumber(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isLoading', {
      get: function () {
        return this._loading;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onLoading = function (e) {
      this.loading.raise(this, e);
    }),
    (t.prototype.onLoaded = function (e) {
      this.loaded.raise(this, e);
    }),
    (t.prototype.load = function () {
      this._getData();
    }),
    (t.prototype.onError = function (e) {
      return this.error.raise(this, e), !e.cancel;
    }),
    (t.prototype.commitNew = function () {
      var t = this,
        r = { Accept: 'application/json' };
      if (this.requestHeaders)
        for (var o in this.requestHeaders) r[o] = this.requestHeaders[o];
      var i = this.currentAddItem;
      if (i) {
        var n = this._getWriteUrl();
        wjcCore.httpRequest(n, {
          method: 'POST',
          requestHeaders: r,
          data: this._convertToDbFormat(i),
          success: function (e) {
            var r = JSON.parse(e.response);
            t.keys.forEach(function (e) {
              i[e] = r[e];
            }),
              t.refresh();
          },
          error: this._error.bind(this),
        });
      }
      e.prototype.commitNew.call(this);
    }),
    (t.prototype.commitEdit = function () {
      var t = this.currentEditItem;
      if (
        t &&
        !this.currentAddItem &&
        !this._sameContent(t, this._edtClone) &&
        this.items.indexOf(t) > -1
      ) {
        var r = this._getWriteUrl(this._edtClone);
        wjcCore.httpRequest(r, {
          method: 'PUT',
          requestHeaders: this.requestHeaders,
          data: this._convertToDbFormat(t),
          error: this._error.bind(this),
        });
      }
      e.prototype.commitEdit.call(this);
    }),
    (t.prototype.remove = function (t) {
      if (t && t != this.currentAddItem && this.items.indexOf(t) > -1) {
        var r = this._getWriteUrl(t);
        wjcCore.httpRequest(r, {
          method: 'DELETE',
          requestHeaders: this.requestHeaders,
          error: this._error.bind(this),
        });
      }
      e.prototype.remove.call(this, t);
    }),
    Object.defineProperty(t.prototype, 'totalItemCount', {
      get: function () {
        return this._count;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pageCount', {
      get: function () {
        return this.pageSize
          ? Math.ceil(this.totalItemCount / this.pageSize)
          : 1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pageSize', {
      get: function () {
        return this._pgSz;
      },
      set: function (e) {
        e != this._pgSz &&
          ((this._pgSz = wjcCore.asInt(e)),
          this.pageOnServer
            ? ((this._pgIdx = wjcCore.clamp(
                this._pgIdx,
                0,
                this.pageCount - 1
              )),
              this._getData())
            : this.refresh());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onPageChanging = function (t) {
      return (
        e.prototype.onPageChanging.call(this, t),
        !t.cancel && this.pageOnServer && this._getData(),
        !t.cancel
      );
    }),
    (t.prototype._getPageView = function () {
      return this.pageOnServer
        ? this._view
        : e.prototype._getPageView.call(this);
    }),
    (t.prototype._performRefresh = function () {
      var t = this._canFilter,
        r = this._canSort;
      (this._canFilter = !this._filterOnServer),
        (this._canSort = !this._sortOnServer),
        e.prototype._performRefresh.call(this),
        (this._canFilter = t),
        (this._canSort = r);
    }),
    (t.prototype._storeItems = function (e, t) {
      t
        ? Array.prototype.push.apply(this.sourceCollection, e)
        : (this.sourceCollection = e);
    }),
    (t.prototype._getReadUrl = function (e) {
      var t = this._url;
      return (
        '/' != t[t.length - 1] && (t += '/'),
        e
          ? (t = 0 == e.indexOf('http') ? e : t + e)
          : this._tbl && (t += this._tbl),
        t
      );
    }),
    (t.prototype._getReadParams = function (e) {
      var t = { $format: 'json' };
      if (this._tbl && !e) {
        if (
          (this._odv < 4 ? (t.$inlinecount = 'allpages') : (t.$count = !0),
          this.fields && (t.$select = this.fields.join(',')),
          this.sortOnServer && this.sortDescriptions.length)
        ) {
          for (var r = '', o = 0; o < this.sortDescriptions.length; o++) {
            var i = this.sortDescriptions[o];
            r && (r += ','), (r += i.property), i.ascending || (r += ' desc');
          }
          t.$orderby = r;
        }
        this.pageOnServer &&
          this.pageSize > 0 &&
          ((t.$skip = this.pageIndex * this.pageSize),
          (t.$top = this.pageSize)),
          this.filterDefinition && (t.$filter = this.filterDefinition);
      }
      return t;
    }),
    (t.prototype._getData = function (e) {
      var t = this;
      this._toGetData && clearTimeout(this._toGetData),
        (this._toGetData = setTimeout(function () {
          if (null != t._odv) {
            (t._loading = !0), t.onLoading();
            var r = t._getReadUrl(e);
            wjcCore.httpRequest(r, {
              requestHeaders: t.requestHeaders,
              data: t._getReadParams(e),
              success: function (r) {
                var o = JSON.parse(r.response),
                  i = o.d ? o.d.results : o.value,
                  n = o.d ? o.d.__count : o['odata.count'] || o['@odata.count'];
                if (
                  (null != n && (t._count = parseInt(n)),
                  t.pageIndex > 0 && t.pageIndex >= t.pageCount)
                ) {
                  var a = t.pageIndex;
                  if ((t.moveToLastPage(), t.pageIndex != a)) return;
                }
                e ||
                  (t.inferDataTypes &&
                    !t._dataTypesInferred &&
                    (t._dataTypesInferred = t._getInferredDataTypes(i)));
                var s = t.dataTypes ? t.dataTypes : t._dataTypesInferred;
                if (s)
                  for (var c = 0; c < i.length; c++) t._convertItem(s, i[c]);
                t._storeItems(i, null != e),
                  t.refresh(),
                  (e = o.d
                    ? o.d.__next
                    : o['odata.nextLink'] || o['@odata.nextLink'])
                    ? t._getData(e)
                    : ((t._loading = !1), t.onLoaded());
              },
              error: function (e) {
                if (
                  ((t._loading = !1),
                  t.onLoaded(),
                  t.onError(new wjcCore.RequestErrorEventArgs(e)))
                )
                  throw 'HttpRequest Error: ' + e.status + ' ' + e.statusText;
              },
            });
          } else t._getSchema();
        }, 100));
    }),
    (t.prototype._convertToDbFormat = function (e) {
      var t = {};
      for (var r in e) {
        var o = e[r];
        wjcCore.isDate(o) && this._showDatesAsGmt
          ? (o = new Date(o.getTime() - 6e4 * o.getTimezoneOffset()))
          : wjcCore.isNumber(o) && this._odv < 4 && (o = o.toString()),
          (t[r] = o);
      }
      return t;
    }),
    (t.prototype._convertItem = function (e, t) {
      for (var r in e) {
        var o = e[r],
          i = t[r];
        null != i &&
          ((i =
            o == wjcCore.DataType.Date &&
            wjcCore.isString(i) &&
            0 == i.indexOf('/Date(')
              ? new Date(parseInt(i.substr(6)))
              : wjcCore.changeType(i, o, null)),
          wjcCore.isDate(i) &&
            this._showDatesAsGmt &&
            (i = new Date(i.getTime() + 6e4 * i.getTimezoneOffset())),
          (t[r] = i));
      }
    }),
    (t.prototype._getInferredDataTypes = function (e) {
      var r = null;
      if (e.length > 0) {
        for (var o = {}, i = 0; i < e.length && i < 10; i++)
          this._extend(o, e[i]);
        for (var n in o) {
          var a = o[n];
          wjcCore.isString(a) &&
            a.match(t._rxDate) &&
            (r || (r = {}), (r[n] = wjcCore.DataType.Date));
        }
      }
      return r;
    }),
    (t.prototype._getServiceUrl = function () {
      var e = this._url;
      return '/' != e[e.length - 1] && (e += '/'), e;
    }),
    (t.prototype._getSchema = function () {
      var e = this,
        r = this._getServiceUrl() + '$metadata';
      (this._odv = t._odvCache[r]),
        this._odv
          ? this._getData()
          : wjcCore.httpRequest(r, {
              requestHeaders: this.requestHeaders,
              success: function (o) {
                var i = o.response.match(/<.*Version\s*=\s*"(.*)"\s*>/i),
                  n = i ? parseFloat(i[1]) : 4;
                t._odvCache[r] = e._odv = n;
              },
              error: function (o) {
                t._odvCache[r] = e._odv = 4;
              },
              complete: function (t) {
                e._getData();
              },
            });
    }),
    (t.prototype._getWriteUrl = function (e) {
      var t = this._getServiceUrl();
      if (((t += this._tbl), e)) {
        wjcCore.assert(
          this.keys && this.keys.length > 0,
          'write operations require keys.'
        );
        var r = [];
        this.keys.forEach(function (t) {
          wjcCore.assert(null != e[t], 'key values cannot be null.'),
            r.push(t + '=' + e[t]);
        }),
          (t += '(' + r.join(',') + ')');
      }
      return t;
    }),
    (t.prototype._asODataFilter = function (e) {
      for (var t = '', r = 0; r < e.grid.columns.length; r++) {
        var o = e.grid.columns[r],
          i = e.getColumnFilter(o, !1);
        i &&
          i.isActive &&
          (t && (t += ' and '),
          i.conditionFilter && i.conditionFilter.isActive
            ? (t += this._asODataConditionFilter(i.conditionFilter))
            : i.valueFilter &&
              i.valueFilter.isActive &&
              (t += this._asODataValueFilter(i.valueFilter)));
      }
      return t;
    }),
    (t.prototype._asODataValueFilter = function (e) {
      var t = e.column,
        r = t.binding,
        o = t.dataMap,
        i = (e._getUniqueValues(t, !1), '');
      for (var n in e.showValues) {
        var a = wjcCore.changeType(n, t.dataType, t.format);
        o && wjcCore.isString(a) && (a = o.getKeyValue(a)),
          i && (i += ' or '),
          (i += '(' + r + ' eq ' + this._asODataValue(a, t.dataType) + ')');
      }
      return i.length && (i = '(' + i + ')'), i;
    }),
    (t.prototype._asODataConditionFilter = function (e) {
      var t = this._asODataCondition(e, e.condition1);
      return (
        null != e.condition2.operator &&
          (t +=
            (e.and ? ' and ' : ' or ') +
            this._asODataCondition(e, e.condition2)),
        '(' + t + ')'
      );
    }),
    (t.prototype._asODataCondition = function (e, t) {
      var r = e.column.binding,
        o = this._asODataValue(t.value, e.column.dataType);
      switch (t.operator) {
        case 0:
          return r + ' eq ' + o;
        case 1:
          return r + ' ne ' + o;
        case 2:
          return r + ' gt ' + o;
        case 3:
          return r + ' ge ' + o;
        case 4:
          return r + ' lt ' + o;
        case 5:
          return r + ' le ' + o;
        case 6:
          return 'startswith(' + r + ',' + o + ')';
        case 7:
          return 'endswith(' + r + ',' + o + ')';
        case 8:
          return this._odv >= 4
            ? 'contains(' + r + ',' + o + ')'
            : 'substringof(' + o.toLowerCase() + ', tolower(' + r + '))';
        case 9:
          return this._odv >= 4
            ? 'not contains(' + r + ',' + o + ')'
            : 'not substringof(' + o.toLowerCase() + ', tolower(' + r + '))';
      }
    }),
    (t.prototype._asODataValue = function (e, t) {
      return wjcCore.isDate(e)
        ? (this._showDatesAsGmt &&
            (e = new Date(e.getTime() - 6e4 * e.getTimezoneOffset())),
          e.toJSON())
        : wjcCore.isString(e)
        ? "'" + e.replace(/'/g, "''") + "'"
        : null != e
        ? e.toString()
        : t == wjcCore.DataType.String
        ? "''"
        : null;
    }),
    (t.prototype._error = function (e) {
      if (this.onError(new wjcCore.RequestErrorEventArgs(e)))
        throw (
          (this._getData(),
          'HttpRequest Error: ' + e.status + ' ' + e.statusText)
        );
    }),
    (t._odvCache = {}),
    (t._rxDate = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}|\/Date\([\d\-]*?\)/),
    t
  );
})(wjcCore.CollectionView);
exports.ODataCollectionView = ODataCollectionView;
var ODataVirtualCollectionView = (function (e) {
  function t(t, r, o) {
    var i = this;
    return (
      null == o && (o = {}),
      (o.pageOnServer = !0),
      (o.sortOnServer = !0),
      (o.canGroup = !1),
      o.pageSize || (o.pageSize = 100),
      (i = e.call(this, t, r, o) || this),
      (i._data = []),
      (i.sourceCollection = i._data),
      (i._skip = 0),
      i.setWindow(0, i.pageSize),
      i
    );
  }
  return (
    __extends(t, e),
    (t.prototype.setWindow = function (e, t) {
      var r = this;
      this._toSetWindow && clearTimeout(this._toSetWindow),
        (this._toSetWindow = setTimeout(function () {
          (r._toSetWindow = null), r._performSetWindow(e, t);
        }, 50));
    }),
    Object.defineProperty(t.prototype, 'pageOnServer', {
      get: function () {
        return !0;
      },
      set: function (e) {
        if (!e)
          throw 'ODataVirtualCollectionView requires pageOnServer = true.';
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sortOnServer', {
      get: function () {
        return !0;
      },
      set: function (e) {
        if (!wjcCore.asBoolean(e))
          throw 'ODataVirtualCollectionView requires sortOnServer = true.';
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'filterOnServer', {
      get: function () {
        return !0;
      },
      set: function (e) {
        if (!wjcCore.asBoolean(e))
          throw 'ODataVirtualCollectionView requires filterOnServer = true.';
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'canGroup', {
      get: function () {
        return this._canGroup;
      },
      set: function (e) {
        if (wjcCore.asBoolean(e))
          throw 'ODataVirtualCollectionView does not support grouping.';
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._performRefresh = function () {
      this.isLoading || (this._refresh = !0),
        e.prototype._performRefresh.call(this);
    }),
    (t.prototype._getReadParams = function (t) {
      var r = e.prototype._getReadParams.call(this, t);
      return (r.$skip = this._skip || 0), (r.$top = this.pageSize), r;
    }),
    (t.prototype._storeItems = function (e, t) {
      if (this._refresh || this._data.length != this.totalItemCount) {
        this._data.length = this.totalItemCount;
        for (o = 0; o < this._data.length; o++) this._data[o] = null;
        this._refresh = !1;
      }
      t || (this._loadOffset = 0);
      for (
        var r = this._loadOffset + (this._skip || 0), o = 0;
        o < e.length;
        o++
      )
        this._data[o + r] = e[o];
      this._loadOffset += e.length;
    }),
    (t.prototype._performSetWindow = function (e, t) {
      (e = wjcCore.asInt(e)),
        (t = wjcCore.asInt(t)),
        wjcCore.assert(t >= e, 'Start must be smaller than end.');
      var r = wjcCore.isNumber(this._start) && e > this._start;
      (this._start = e), (this._end = t);
      for (var o = !1, i = e; i < t && i < this._data.length && !o; i++)
        o = null == this._data[i];
      if (o) {
        for (
          var n = Math.max(0, r ? e : t - this.pageSize), i = n;
          i < this._data.length && null != this._data[i];
          i++
        )
          n++;
        (this._skip = n), this._getData();
      }
    }),
    t
  );
})(ODataCollectionView);
exports.ODataVirtualCollectionView = ODataVirtualCollectionView;
