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
    var t =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (t, e) {
          t.__proto__ = e;
        }) ||
      function (t, e) {
        for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
      };
    return function (e, i) {
      function r() {
        this.constructor = e;
      }
      t(e, i),
        (e.prototype =
          null === i
            ? Object.create(i)
            : ((r.prototype = i.prototype), new r()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.chart');
(window.wijmo = window.wijmo || {}), (window.wijmo.chart = wjcSelf);
var DataPoint = (function () {
  return function (t, e) {
    void 0 === t && (t = 0),
      void 0 === e && (e = 0),
      (this.x = t),
      (this.y = e);
  };
})();
exports.DataPoint = DataPoint;
var RenderEventArgs = (function (t) {
  function e(e) {
    var i = t.call(this) || this;
    return (i._engine = e), i;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'engine', {
      get: function () {
        return this._engine;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(wjcCore.CancelEventArgs);
exports.RenderEventArgs = RenderEventArgs;
var SeriesRenderingEventArgs = (function (t) {
  function e(e, i, r) {
    var n = t.call(this, e) || this;
    return (n._index = i), (n._count = r), n;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'index', {
      get: function () {
        return this._index;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'count', {
      get: function () {
        return this._count;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(RenderEventArgs);
exports.SeriesRenderingEventArgs = SeriesRenderingEventArgs;
var ImageFormat;
!(function (t) {
  (t[(t.Png = 0)] = 'Png'),
    (t[(t.Jpeg = 1)] = 'Jpeg'),
    (t[(t.Svg = 2)] = 'Svg');
})((ImageFormat = exports.ImageFormat || (exports.ImageFormat = {})));
var FlexChartBase = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (
      (e._palette = null),
      (e._selectionMode = SelectionMode.None),
      (e._defPalette = Palettes.standard),
      (e._notifyCurrentChanged = !0),
      (e._legendHost = null),
      (e._needBind = !1),
      (e.rendering = new wjcCore.Event()),
      (e.rendered = new wjcCore.Event()),
      (e.selectionChanged = new wjcCore.Event()),
      e
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'itemsSource', {
      get: function () {
        return this._items;
      },
      set: function (t) {
        this._items != t &&
          (this._cv &&
            (this._cv.currentChanged.removeHandler(
              this._cvCurrentChanged,
              this
            ),
            this._cv.collectionChanged.removeHandler(
              this._cvCollectionChanged,
              this
            ),
            (this._cv = null)),
          (this._items = t),
          (this._cv = wjcCore.asCollectionView(t)),
          null != this._cv &&
            (this._cv.currentChanged.addHandler(this._cvCurrentChanged, this),
            this._cv.collectionChanged.addHandler(
              this._cvCollectionChanged,
              this
            )),
          this._clearCachedValues(),
          this._bindChart());
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
    Object.defineProperty(e.prototype, 'palette', {
      get: function () {
        return this._palette;
      },
      set: function (t) {
        t != this._palette &&
          ((this._palette = wjcCore.asArray(t)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'plotMargin', {
      get: function () {
        return this._plotMargin;
      },
      set: function (t) {
        t != this._plotMargin && ((this._plotMargin = t), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'legend', {
      get: function () {
        return this._legend;
      },
      set: function (t) {
        t != this._legend &&
          ((this._legend = wjcCore.asType(t, Legend)),
          null != this._legend && (this._legend._chart = this));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'header', {
      get: function () {
        return this._header;
      },
      set: function (t) {
        t != this._header &&
          ((this._header = wjcCore.asString(t, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'footer', {
      get: function () {
        return this._footer;
      },
      set: function (t) {
        t != this._footer &&
          ((this._footer = wjcCore.asString(t, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'headerStyle', {
      get: function () {
        return this._headerStyle;
      },
      set: function (t) {
        t != this._headerStyle && ((this._headerStyle = t), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'footerStyle', {
      get: function () {
        return this._footerStyle;
      },
      set: function (t) {
        t != this._footerStyle && ((this._footerStyle = t), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'selectionMode', {
      get: function () {
        return this._selectionMode;
      },
      set: function (t) {
        t != this._selectionMode &&
          ((this._selectionMode = wjcCore.asEnum(t, SelectionMode)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'itemFormatter', {
      get: function () {
        return this._itemFormatter;
      },
      set: function (t) {
        t != this._itemFormatter &&
          ((this._itemFormatter = wjcCore.asFunction(t)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onRendered = function (t) {
      this.rendered.raise(this, t);
    }),
    (e.prototype.onRendering = function (t) {
      this.rendering.raise(this, t);
    }),
    (e.prototype.saveImageToFile = function (t) {
      var e, i, r, n;
      (t && 0 !== t.length && -1 !== t.indexOf('.')) || (t = 'image.png'),
        (n = t.split('.')),
        (e = n[0].toLowerCase()),
        (i = n[1].toLowerCase()),
        (r = ImageFormat[i[0].toUpperCase() + i.substring(1)]),
        this.saveImageToDataUrl(r, function (t) {
          ExportHelper.downloadImage(t, e, i);
        });
    }),
    (e.prototype.saveImageToDataUrl = function (t, e) {
      var i = wjcCore.asEnum(t, ImageFormat, !1),
        r = ImageFormat[i].toLowerCase();
      r &&
        r.length &&
        this._exportToImage(r, function (t) {
          e.call(e, t);
        });
    }),
    (e.prototype._exportToImage = function (t, e) {
      var i,
        r = new Image(),
        n = this._currentRenderEngine.element;
      (i = ExportHelper.getDataUri(n)),
        'svg' === t
          ? e.call(null, i)
          : ((r.onload = function () {
              var i,
                o = document.createElement('canvas'),
                s = n.parentNode || n,
                a = wjcCore.getElementRect(s);
              (o.width = a.width), (o.height = a.height);
              var h = o.getContext('2d');
              (h.fillStyle = '#ffffff'), h.fillRect(0, 0, a.width, a.height);
              var l = window
                  .getComputedStyle(s, null)
                  .getPropertyValue('padding-left')
                  .replace('px', ''),
                c = window
                  .getComputedStyle(s, null)
                  .getPropertyValue('padding-top')
                  .replace('px', '');
              h.drawImage(r, +l || 0, +c || 0),
                (i = o.toDataURL('image/' + t)),
                e.call(null, i),
                (o = null);
            }),
            (r.src = i));
    }),
    (e.prototype.refresh = function (e) {
      void 0 === e && (e = !0),
        t.prototype.refresh.call(this, e),
        this.isUpdating || this._refreshChart();
    }),
    (e.prototype.onSelectionChanged = function (t) {
      this.selectionChanged.raise(this, t);
    }),
    (e.prototype.onLostFocus = function (e) {
      this._tooltip && this._tooltip.isVisible && this._tooltip.hide(),
        t.prototype.onLostFocus.call(this, e);
    }),
    (e.prototype._cvCollectionChanged = function (t, e) {
      this._clearCachedValues(), this._bindChart();
    }),
    (e.prototype._cvCurrentChanged = function (t, e) {
      this._notifyCurrentChanged && this._bindChart();
    }),
    (e.prototype._getColor = function (t) {
      var e = this._defPalette;
      return (
        null != this._palette &&
          this._palette.length > 0 &&
          (e = this._palette),
        e[t % e.length]
      );
    }),
    (e.prototype._getColorLight = function (t) {
      var e = this._getColor(t);
      return this._getLightColor(e);
    }),
    (e.prototype._getLightColor = function (t) {
      var e = new wjcCore.Color(t);
      return (
        null != e &&
          -1 === t.indexOf('-') &&
          (1 == e.a && -1 == t.indexOf('rgba') && (e.a *= 0.7),
          (t = e.toString())),
        t
      );
    }),
    (e.prototype._bindChart = function () {
      (this._needBind = !0), this.invalidate();
    }),
    (e.prototype._clearCachedValues = function () {}),
    (e.prototype._render = function (t, e) {
      void 0 === e && (e = !0);
      this.hostElement;
      var i = this._getHostSize(),
        r = i.width,
        n = i.height;
      if (0 != r) {
        if (
          (isNaN(r) && (r = FlexChart._WIDTH),
          (0 == n || isNaN(n)) && (n = FlexChart._HEIGHT),
          t.beginRender(),
          r > 0 && n > 0)
        ) {
          t.setViewportSize(r, n),
            (this._rectChart = new wjcCore.Rect(0, 0, r, n)),
            this._prepareRender();
          var o = new wjcCore.Rect(0, 0, r, n);
          (this._chartRectId = 'chartRect' + (1e6 * Math.random()).toFixed()),
            t.addClipRect(o, this._chartRectId),
            this._renderHeader(t, o),
            this._renderFooter(t, o),
            this._renderLegends(t, o),
            this._renderChart(t, o, e);
        }
        t.endRender();
      }
    }),
    (e.prototype._renderHeader = function (t, e) {
      t.startGroup(FlexChart._CSS_HEADER, this._chartRectId),
        (e = this._drawTitle(t, e, this.header, this.headerStyle, !1)),
        t.endGroup();
    }),
    (e.prototype._renderFooter = function (t, e) {
      t.startGroup(FlexChart._CSS_FOOTER, this._chartRectId),
        (e = this._drawTitle(t, e, this.footer, this.footerStyle, !0)),
        t.endGroup();
    }),
    (e.prototype._renderLegends = function (t, e) {
      var i,
        r,
        n = this.legend,
        o = e.width,
        s = e.height,
        a = n._getPosition(o, s);
      switch (((i = n._getDesiredSize(t, a, o, s)), a)) {
        case Position.Right:
          (o -= i.width),
            (r = new wjcCore.Point(o, e.top + 0.5 * (s - i.height)));
          break;
        case Position.Left:
          (e.left += i.width),
            (o -= i.width),
            (r = new wjcCore.Point(0, e.top + 0.5 * (s - i.height)));
          break;
        case Position.Top:
          (s -= i.height),
            (r = new wjcCore.Point(0.5 * (o - i.width), e.top)),
            (e.top += i.height);
          break;
        case Position.Bottom:
          (s -= i.height),
            (r = new wjcCore.Point(0.5 * (o - i.width), e.top + s));
      }
      (e.width = o),
        (e.height = s),
        i
          ? ((this._legendHost = t.startGroup(
              FlexChart._CSS_LEGEND,
              this._chartRectId
            )),
            (this._rectLegend = new wjcCore.Rect(r.x, r.y, i.width, i.height)),
            this.legend._render(t, r, a, i.width, i.height),
            t.endGroup())
          : ((this._legendHost = null), (this._rectLegend = null));
    }),
    (e.prototype._prepareRender = function () {}),
    (e.prototype._renderChart = function (t, e, i) {}),
    (e.prototype._performBind = function () {}),
    (e.prototype._getDesiredLegendSize = function (t, e, i, r) {
      return null;
    }),
    (e.prototype._renderLegend = function (t, e, i, r, n, o) {}),
    (e.prototype._getHitTestItem = function (t) {
      return null;
    }),
    (e.prototype._getHitTestValue = function (t) {
      return null;
    }),
    (e.prototype._getHitTestLabel = function (t) {
      return null;
    }),
    (e.prototype._refreshChart = function () {
      this._needBind && ((this._needBind = !1), this._performBind()),
        this.hostElement && this._render(this._currentRenderEngine);
    }),
    (e.prototype._drawTitle = function (t, e, i, r, n) {
      var o = FlexChart._CSS_TITLE,
        s = n ? FlexChart._CSS_FOOTER : FlexChart._CSS_HEADER,
        a = null;
      if (
        (n ? (this._rectFooter = null) : (this._rectHeader = null), null != i)
      ) {
        var h = null,
          l = null,
          c = null,
          _ = null;
        r &&
          (r.fontSize && (h = r.fontSize),
          r.foreground && (l = r.foreground),
          r.fill && (l = r.fill),
          r.fontFamily && (c = r.fontFamily),
          r.halign && (_ = r.halign)),
          (t.fontSize = h),
          (t.fontFamily = c),
          (a = t.measureString(i, o, s, r)),
          (e.height -= a.height),
          l || (l = FlexChart._FG),
          (t.textFill = l),
          n
            ? ('left' == _
                ? FlexChart._renderText(
                    t,
                    i,
                    new wjcCore.Point(e.left, e.bottom),
                    0,
                    0,
                    o,
                    s,
                    r
                  )
                : 'right' == _
                ? FlexChart._renderText(
                    t,
                    i,
                    new wjcCore.Point(e.left + e.width, e.bottom),
                    2,
                    0,
                    o,
                    s,
                    r
                  )
                : FlexChart._renderText(
                    t,
                    i,
                    new wjcCore.Point(e.left + 0.5 * e.width, e.bottom),
                    1,
                    0,
                    o,
                    s,
                    r
                  ),
              (this._rectFooter = new wjcCore.Rect(
                e.left,
                e.bottom,
                e.width,
                a.height
              )))
            : ((this._rectHeader = new wjcCore.Rect(
                e.left,
                e.top,
                e.width,
                a.height
              )),
              (e.top += a.height),
              'left' == _
                ? FlexChart._renderText(
                    t,
                    i,
                    new wjcCore.Point(e.left, 0),
                    0,
                    0,
                    o,
                    s,
                    r
                  )
                : 'right' == _
                ? FlexChart._renderText(
                    t,
                    i,
                    new wjcCore.Point(e.left + e.width, 0),
                    2,
                    0,
                    o,
                    s,
                    r
                  )
                : FlexChart._renderText(
                    t,
                    i,
                    new wjcCore.Point(e.left + 0.5 * e.width, 0),
                    1,
                    0,
                    o,
                    s,
                    r
                  )),
          (t.textFill = null),
          (t.fontSize = null),
          (t.fontFamily = null);
      }
      return e;
    }),
    (e.prototype.pageToControl = function (t, e) {
      return this._toControl(t, e);
    }),
    (e.prototype._toControl = function (t, e) {
      wjcCore.isNumber(t) && wjcCore.isNumber(e)
        ? (t = new wjcCore.Point(t, e))
        : t instanceof MouseEvent && (t = wjcCore.mouseToPage(t)),
        wjcCore.asType(t, wjcCore.Point);
      var i = t.clone(),
        r = this._getHostOffset();
      (i.x -= r.x), (i.y -= r.y);
      var n = this._getHostComputedStyle();
      if (n) {
        var o = parseInt(n.paddingLeft.replace('px', ''));
        o && !isNaN(o) && (i.x -= o);
        var s = parseInt(n.paddingTop.replace('px', ''));
        s && !isNaN(s) && (i.y -= s);
      }
      return i;
    }),
    (e.prototype._highlightItems = function (t, e, i) {
      if (i) for (r = 0; r < t.length; r++) wjcCore.addClass(t[r], e);
      else for (var r = 0; r < t.length; r++) wjcCore.removeClass(t[r], e);
    }),
    (e.prototype._parseMargin = function (t) {
      var e = {};
      if (wjcCore.isNumber(t) && !isNaN(t))
        e.top = e.bottom = e.left = e.right = wjcCore.asNumber(t);
      else if (wjcCore.isString(t)) {
        var i = wjcCore.asString(t).split(' ', 4),
          r = NaN,
          n = NaN,
          o = NaN,
          s = NaN;
        i &&
          (4 == i.length
            ? ((r = parseFloat(i[0])),
              (s = parseFloat(i[1])),
              (n = parseFloat(i[2])),
              (o = parseFloat(i[3])))
            : 2 == i.length
            ? ((r = n = parseFloat(i[0])), (o = s = parseFloat(i[1])))
            : 1 == i.length && (r = n = o = s = parseFloat(i[1])),
          isNaN(r) || (e.top = r),
          isNaN(n) || (e.bottom = n),
          isNaN(o) || (e.left = o),
          isNaN(s) || (e.right = s));
      }
      return e;
    }),
    (e.prototype._showToolTip = function (t, e) {
      var i = this,
        r = this._tooltip.showDelay;
      i._clearTimeouts(),
        r > 0
          ? (i._toShow = setTimeout(function () {
              i._tooltip.show(i.hostElement, t, e),
                i._tooltip.hideDelay > 0 &&
                  (i._toHide = setTimeout(function () {
                    i._tooltip.hide();
                  }, i._tooltip.hideDelay));
            }, r))
          : (i._tooltip.show(i.hostElement, t, e),
            i._tooltip.hideDelay > 0 &&
              (i._toHide = setTimeout(function () {
                i._tooltip.hide();
              }, i._tooltip.hideDelay)));
    }),
    (e.prototype._hideToolTip = function () {
      this._clearTimeouts(), this._tooltip.hide();
    }),
    (e.prototype._clearTimeouts = function () {
      this._toShow && (clearTimeout(this._toShow), (this._toShow = null)),
        this._toHide && (clearTimeout(this._toHide), (this._toHide = null));
    }),
    (e.prototype._getHostOffset = function () {
      var t = wjcCore.getElementRect(this.hostElement);
      return new wjcCore.Point(t.left, t.top);
    }),
    (e.prototype._getHostSize = function () {
      var t = new wjcCore.Size(),
        e = this.hostElement,
        i = this._getHostComputedStyle(),
        r = e.offsetWidth,
        n = e.offsetHeight;
      if (i) {
        var o = parseFloat(i.paddingLeft.replace('px', '')),
          s = parseFloat(i.paddingRight.replace('px', '')),
          a = parseFloat(i.paddingTop.replace('px', '')),
          h = parseFloat(i.paddingBottom.replace('px', ''));
        isNaN(o) || (r -= o),
          isNaN(s) || (r -= s),
          isNaN(a) || (n -= a),
          isNaN(h) || (n -= h);
        var l = parseFloat(i.borderLeftWidth.replace('px', '')),
          c = parseFloat(i.borderRightWidth.replace('px', '')),
          _ = parseFloat(i.borderTopWidth.replace('px', '')),
          u = parseFloat(i.borderBottomWidth.replace('px', ''));
        isNaN(l) || (r -= l),
          isNaN(c) || (r -= c),
          isNaN(_) || (n -= _),
          isNaN(u) || (n -= u),
          (t.width = r),
          (t.height = n);
      }
      return t;
    }),
    (e.prototype._getHostComputedStyle = function () {
      var t = this.hostElement;
      return t && t.ownerDocument && t.ownerDocument.defaultView
        ? t.ownerDocument.defaultView.getComputedStyle(this.hostElement)
        : null;
    }),
    (e.prototype._find = function (t, e) {
      for (var i = [], r = 0; r < t.childElementCount; r++) {
        var n = t.childNodes.item(r);
        if (e.indexOf(n.nodeName) >= 0) i.push(n);
        else {
          var o = this._find(n, e);
          if (o.length > 0) for (var s = 0; s < o.length; s++) i.push(o[s]);
        }
      }
      return i;
    }),
    (e._WIDTH = 300),
    (e._HEIGHT = 200),
    (e._SELECTION_THRESHOLD = 15),
    e
  );
})(wjcCore.Control);
exports.FlexChartBase = FlexChartBase;
var _KeyWords = (function () {
  function t() {
    (this._keys = {}),
      (this._keys.seriesName = null),
      (this._keys.pointIndex = null),
      (this._keys.x = null),
      (this._keys.y = null),
      (this._keys.value = null),
      (this._keys.name = null);
  }
  return (
    (t.prototype.replace = function (t, e) {
      var i = this;
      return wjcCore.format(t, {}, function (t, r, n, o) {
        return i.getValue(r, e, n);
      });
    }),
    (t.prototype.getValue = function (t, e, i) {
      switch (t) {
        case 'seriesName':
          return e.series ? e.series.name : '';
        case 'pointIndex':
          return null != e.pointIndex ? e.pointIndex.toFixed() : '';
        case 'x':
          return i ? wjcCore.Globalize.format(e.x, i) : e._xfmt;
        case 'y':
          return i ? wjcCore.Globalize.format(e.y, i) : e._yfmt;
        case 'value':
          return i ? wjcCore.Globalize.format(e.value, i) : e.value;
        case 'name':
          return e.name;
      }
      return e.item &&
        (0 == t.indexOf('item.') && (t = t.substr(5)), t in e.item)
        ? i
          ? wjcCore.Globalize.format(e.item[t], i)
          : e.item[t]
        : '';
    }),
    t
  );
})();
exports._KeyWords = _KeyWords;
var ExportHelper = (function () {
    function t() {}
    return (
      (t.downloadImage = function (t, e, i) {
        var r = document.createElement('a'),
          n = 'image/' + i;
        if (navigator.msSaveOrOpenBlob) {
          t = t.substring(t.indexOf(',') + 1);
          var o,
            s,
            a,
            h = atob(t),
            l = [];
          for (o = 0; o < h.length; o += 512) {
            s = h.slice(o, o + 512);
            for (var c = new Array(s.length), _ = 0; _ < s.length; _++)
              c[_] = s.charCodeAt(_);
            var u = new Uint8Array(c);
            l.push(u);
          }
          (a = new Blob(l, { type: n })),
            navigator.msSaveOrOpenBlob(a, e + '.' + i);
        } else
          (r.download = e + '.' + i),
            (r.href = t),
            document.body.appendChild(r),
            r.addEventListener('click', function (t) {
              wjcCore.removeChild(r);
            }),
            r.click();
      }),
      (t.getDataUri = function (e) {
        var i,
          r,
          n,
          o,
          s,
          a,
          h,
          l,
          c,
          _,
          u = document.createElement('div'),
          p = e.cloneNode(!0);
        return (
          'svg' == e.tagName
            ? ((r = (i = wjcCore.getElementRect(e.parentNode || e)).width || 0),
              (n = i.height || 0),
              (o =
                e.viewBox.baseVal && 0 !== e.viewBox.baseVal.width
                  ? e.viewBox.baseVal.width
                  : r),
              (s =
                e.viewBox.baseVal && 0 !== e.viewBox.baseVal.height
                  ? e.viewBox.baseVal.height
                  : n))
            : ((r = (a = e.getBBox()).x + a.width),
              (n = a.y + a.height),
              p.setAttribute(
                'transform',
                p.getAttribute('transform').replace(/translate\(.*?\)/, '')
              ),
              (o = r),
              (s = n),
              (l = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'svg'
              )).appendChild(p),
              (p = l)),
          p.setAttribute('version', '1.1'),
          p.setAttributeNS(t.xmlns, 'xmlns', 'http://www.w3.org/2000/svg'),
          p.setAttributeNS(
            t.xmlns,
            'xmlns:xlink',
            'http://www.w3.org/1999/xlink'
          ),
          p.setAttribute('width', r),
          p.setAttribute('height', n),
          p.setAttribute('viewBox', '0 0 ' + o + ' ' + s),
          wjcCore.addClass(
            p,
            (e.parentNode && e.parentNode.getAttribute('class')) || ''
          ),
          u.appendChild(p),
          (h = t.getStyles(e)),
          (c = document.createElement('style')).setAttribute(
            'type',
            'text/css'
          ),
          (c.innerHTML = '<![CDATA[\n' + h + '\n]]>'),
          (_ = document.createElement('defs')).appendChild(c),
          p.insertBefore(_, p.firstChild),
          'data:image/svg+xml;base64,' +
            window.btoa(
              window.unescape(encodeURIComponent(t.doctype + u.innerHTML))
            )
        );
      }),
      (t.getStyles = function (t) {
        var e = '',
          i = document.styleSheets;
        return null == i || 0 === i.length
          ? null
          : ([].forEach.call(i, function (i) {
              var r;
              try {
                if (null == i.cssRules || 0 === i.cssRules.length) return !0;
              } catch (t) {
                if ('SecurityError' == t.name)
                  return (
                    console.log("SecurityError. Can't read: " + i.href), !0
                  );
              }
              (r = i.cssRules),
                [].forEach.call(r, function (i) {
                  var r,
                    n = i.style;
                  if (null == n) return !0;
                  try {
                    r = t.querySelector(i.selectorText);
                  } catch (t) {
                    console.warn(
                      'Invalid CSS selector "' + i.selectorText + '"',
                      t
                    );
                  }
                  r
                    ? (e += i.selectorText + ' { ' + n.cssText + ' }\n')
                    : i.cssText.match(/^@font-face/) && (e += i.cssText + '\n');
                });
            }),
            e);
      }),
      (t.doctype =
        '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'),
      (t.xmlns = 'http://www.w3.org/2000/xmlns/'),
      t
    );
  })(),
  FlexPie = (function (t) {
    function e(e, i) {
      var r = t.call(this, e, null, !0) || this;
      (r._areas = []),
        (r._keywords = new _KeyWords()),
        (r._startAngle = 0),
        (r._innerRadius = 0),
        (r._offset = 0),
        (r._reversed = !1),
        (r._isAnimated = !1),
        (r._selectedItemPosition = Position.None),
        (r._selectedItemOffset = 0),
        (r._rotationAngle = 0),
        (r._center = new wjcCore.Point()),
        (r._selectedOffset = new wjcCore.Point()),
        (r._selectedIndex = -1),
        (r._angles = []),
        (r._colRowLens = []),
        (r._values = []),
        (r._labels = []),
        (r._pels = []),
        (r._sum = 0),
        r.applyTemplate('wj-control wj-flexchart', null, null),
        (r._currentRenderEngine = new _SvgRenderEngine(r.hostElement)),
        (r._legend = new Legend(r)),
        (r._tooltip = new ChartTooltip()),
        (r._tooltip.content = '<b>{name}</b><br/>{value}'),
        (r._tooltip.showDelay = 0),
        (r._lbl = new PieDataLabel()),
        (r._lbl._chart = r);
      var n = r;
      return (
        r.hostElement.addEventListener('mousemove', function (t) {
          var e = n._tooltip;
          if (e.content && !n.isTouching) {
            var i = n.hitTest(t);
            if (i.distance <= e.threshold) {
              var r = n._getLabelContent(i, n.tooltip.content);
              n._showToolTip(r, new wjcCore.Rect(t.clientX, t.clientY, 5, 5));
            } else n._hideToolTip();
          }
        }),
        r.hostElement.addEventListener('click', function (t) {
          var e = !0;
          if (n.selectionMode != SelectionMode.None) {
            var i = n.hitTest(t),
              r = FlexChart._SELECTION_THRESHOLD;
            n.tooltip && n.tooltip.threshold && (r = n.tooltip.threshold),
              i.distance <= r
                ? (i.pointIndex != n._selectionIndex &&
                    n.selectedItemPosition != Position.None &&
                    (e = !1),
                  i.pointIndex != n._selectionIndex &&
                    n._select(i.pointIndex, !0))
                : n._selectedIndex >= 0 && n._select(null);
          }
          if (e && n.isTouching) {
            var o = n._tooltip;
            if (o.content)
              if ((i = n.hitTest(t)).distance <= o.threshold) {
                var s = n._getLabelContent(i, n.tooltip.content);
                n._showToolTip(s, new wjcCore.Rect(t.clientX, t.clientY, 5, 5));
              } else n._hideToolTip();
          }
        }),
        r.hostElement.addEventListener('mouseleave', function (t) {
          n._hideToolTip();
        }),
        r.initialize(i),
        r.refresh(),
        r
      );
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, 'binding', {
        get: function () {
          return this._binding;
        },
        set: function (t) {
          t != this._binding &&
            ((this._binding = wjcCore.asString(t, !0)), this._bindChart());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'bindingName', {
        get: function () {
          return this._bindingName;
        },
        set: function (t) {
          t != this._bindingName &&
            ((this._bindingName = wjcCore.asString(t, !0)), this._bindChart());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'startAngle', {
        get: function () {
          return this._startAngle;
        },
        set: function (t) {
          t != this._startAngle &&
            ((this._startAngle = wjcCore.asNumber(t, !0)), this.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'offset', {
        get: function () {
          return this._offset;
        },
        set: function (t) {
          t != this._offset &&
            ((this._offset = wjcCore.asNumber(t, !0)), this.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'innerRadius', {
        get: function () {
          return this._innerRadius;
        },
        set: function (t) {
          t != this._innerRadius &&
            ((this._innerRadius = wjcCore.asNumber(t, !0)), this.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'reversed', {
        get: function () {
          return this._reversed;
        },
        set: function (t) {
          t != this._reversed &&
            ((this._reversed = wjcCore.asBoolean(t, !0)), this.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'selectedItemPosition', {
        get: function () {
          return this._selectedItemPosition;
        },
        set: function (t) {
          t != this._selectedItemPosition &&
            ((this._selectedItemPosition = wjcCore.asEnum(t, Position, !0)),
            this.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'selectedItemOffset', {
        get: function () {
          return this._selectedItemOffset;
        },
        set: function (t) {
          t != this._selectedItemOffset &&
            ((this._selectedItemOffset = wjcCore.asNumber(t, !0)),
            this.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'isAnimated', {
        get: function () {
          return this._isAnimated;
        },
        set: function (t) {
          t != this._isAnimated && (this._isAnimated = t);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'tooltip', {
        get: function () {
          return this._tooltip;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'dataLabel', {
        get: function () {
          return this._lbl;
        },
        set: function (t) {
          t != this._lbl &&
            ((this._lbl = t), this._lbl && (this._lbl._chart = this));
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'selectedIndex', {
        get: function () {
          return this._selectedIndex;
        },
        set: function (t) {
          if (t != this._selectedIndex) {
            var e = wjcCore.asNumber(t, !0);
            this._select(e, !0);
          }
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype._getLabelsForLegend = function () {
        return this._labels;
      }),
      (e.prototype.hitTest = function (t, e) {
        var i = this._toControl(t, e),
          r = new HitTestInfo(this, i),
          n = null;
        if (FlexChart._contains(this._rectHeader, i))
          r._chartElement = ChartElement.Header;
        else if (FlexChart._contains(this._rectFooter, i))
          r._chartElement = ChartElement.Footer;
        else if (FlexChart._contains(this._rectLegend, i))
          (r._chartElement = ChartElement.Legend),
            null !== (n = this.legend._hitTest(i)) &&
              n >= 0 &&
              n < this._areas.length &&
              r._setData(null, n);
        else if (FlexChart._contains(this._rectChart, i)) {
          for (var o, s = this._areas.length, a = NaN, h = 0; h < s; h++) {
            var l = i.clone();
            if (0 != this._rotationAngle) {
              var c = this._center.x,
                _ = this._center.y,
                u = -c + l.x,
                p = -_ + l.y,
                d = Math.sqrt(u * u + p * p),
                f = Math.atan2(p, u) - (this._rotationAngle * Math.PI) / 180;
              (l.x = c + d * Math.cos(f)), (l.y = _ + d * Math.sin(f));
            }
            h == this._selectedIndex &&
              ((l.x -= this._selectedOffset.x),
              (l.y -= this._selectedOffset.y));
            var g = this._areas[h];
            if (
              g.contains(l) &&
              (r._setData(null, g.tag), (r._dist = 0), h != this._selectedIndex)
            )
              break;
            var m = g.distance(l);
            void 0 !== m && (isNaN(a) || m < a) && ((a = m), (o = g));
          }
          0 !== r._dist &&
            null != o &&
            (r._setData(null, o.tag), (r._dist = a)),
            (r._chartElement = ChartElement.ChartArea);
        } else r._chartElement = ChartElement.None;
        return r;
      }),
      (e.prototype._performBind = function () {
        if ((this._initData(), this._cv)) {
          this._selectionIndex = this._cv.currentPosition;
          var t = this._cv.items;
          if (t)
            for (var e = t.length, i = 0; i < e; i++) {
              var r = t[i];
              this._sum += Math.abs(
                this._getBindData(
                  r,
                  this._values,
                  this._labels,
                  this.binding,
                  this.bindingName
                )
              );
            }
        }
      }),
      (e.prototype._initData = function () {
        (this._sum = 0), (this._values = []), (this._labels = []);
      }),
      (e.prototype._getBindData = function (t, e, i, r, n) {
        var o,
          s = 0;
        r && (o = t[r]);
        s = 0;
        if (
          (wjcCore.isNumber(o)
            ? (s = wjcCore.asNumber(o))
            : o && (s = parseFloat(o.toString())),
          !isNaN(s) && isFinite(s) ? e.push(s) : ((s = 0), e.push(s)),
          n && t)
        ) {
          var a = t[n];
          a && (a = a.toString()), i.push(a);
        } else i.push(s.toString());
        return s;
      }),
      (e.prototype._render = function (e, i) {
        void 0 === i && (i = !0),
          this._selectionAnimationID &&
            clearInterval(this._selectionAnimationID),
          t.prototype._render.call(this, e, i);
      }),
      (e.prototype._prepareRender = function () {
        this._areas = [];
      }),
      (e.prototype._renderChart = function (t, i, r) {
        var n = this._rectChart.clone();
        new wjcCore.Size(n.width, n.height);
        this.onRendering(new RenderEventArgs(t));
        var o = i.width,
          s = i.height;
        this._pieGroup = t.startGroup(null, null, !0);
        var a = this._parseMargin(this.plotMargin),
          h = this.dataLabel,
          l = h.content && h.position == PieLabelPosition.Outside,
          c = l ? (wjcCore.isNumber(h.offset) ? h.offset : 0) + 24 : 0;
        isNaN(a.left) && (a.left = l ? c : e._MARGIN),
          isNaN(a.right) && (a.right = l ? c : e._MARGIN),
          isNaN(a.top) && (a.top = l ? c : e._MARGIN),
          isNaN(a.bottom) && (a.bottom = l ? c : e._MARGIN),
          (i.top += a.top);
        s = i.height - (a.top + a.bottom);
        (i.height = s > 0 ? s : 24), (i.left += a.left);
        o = i.width - (a.left + a.right);
        (i.width = o > 0 ? o : 24),
          this._renderData(t, i, this._pieGroup),
          t.endGroup(),
          (this._rotationAngle = 0),
          this._highlightCurrent(),
          this.dataLabel.content &&
            this.dataLabel.position != PieLabelPosition.None &&
            this._renderLabels(t),
          this.onRendered(new RenderEventArgs(t));
      }),
      (e.prototype._getDesiredLegendSize = function (t, e, i, r) {
        var n = new wjcCore.Size(),
          o = this,
          s = new wjcCore.Size(i, r),
          a = o._getLabelsForLegend(),
          h = a.length,
          l = 0,
          c = 0;
        this._colRowLens = [];
        for (var _ = 0; _ < h; _++) {
          var u = o._measureLegendItem(t, a[_]);
          e
            ? (c + u.height > r &&
                ((n.height = r), this._colRowLens.push(l), (l = 0), (c = 0)),
              l < u.width && (l = u.width),
              (c += u.height))
            : (l + u.width > i &&
                ((n.width = i), this._colRowLens.push(c), (c = 0), (l = 0)),
              c < u.height && (c = u.height),
              (l += u.width));
        }
        return (
          e
            ? (n.height < c && (n.height = c),
              this._colRowLens.push(l),
              (n.width = this._colRowLens.reduce(function (t, e) {
                return t + e;
              }, 0)),
              n.width > s.width / 2 && (n.width = s.width / 2))
            : (n.width < l && (n.width = l),
              this._colRowLens.push(c),
              (n.height = this._colRowLens.reduce(function (t, e) {
                return t + e;
              }, 0)),
              n.height > s.height / 2 && (n.height = s.height / 2)),
          n
        );
      }),
      (e.prototype._renderLegend = function (t, e, i, r, n, o) {
        for (
          var s = this,
            a = s._rectLegend,
            h = s._getLabelsForLegend(),
            l = h.length,
            c = 0,
            _ = e.clone(),
            u = 0;
          u < l;
          u++
        ) {
          var p = s._measureLegendItem(t, h[u]);
          r
            ? _.y + p.height > a.top + a.height + 1 &&
              ((_.x += this._colRowLens[c]), c++, (_.y = e.y))
            : _.x + p.width > a.left + a.width + 1 &&
              ((_.y += this._colRowLens[c]), c++, (_.x = e.x));
          var d = new wjcCore.Rect(_.x, _.y, p.width, p.height);
          s._drawLegendItem(t, d, u, h[u]),
            i.push(d),
            r ? (_.y += p.height) : (_.x += p.width);
        }
      }),
      (e.prototype._renderData = function (t, e, i) {
        (this._pels = []), (this._angles = []);
        var r = this._sum,
          n = this.startAngle + 180,
          o = this.innerRadius,
          s = this.offset;
        if (r > 0) {
          var a = (n * Math.PI) / 180,
            h = e.left + 0.5 * e.width,
            l = e.top + 0.5 * e.height,
            c = Math.min(0.5 * e.width, 0.5 * e.height);
          (this._center.x = h), (this._center.y = l);
          var _ = Math.max(s, this.selectedItemOffset);
          _ > 0 && (s *= c /= 1 + _), (this._radius = c);
          var u = o * c;
          this._renderPie(t, c, u, a, s), this._highlightCurrent();
        }
      }),
      (e.prototype._renderPie = function (t, e, i, r, n) {
        this._renderSlices(t, this._values, this._sum, e, i, r, 2 * Math.PI, n);
      }),
      (e.prototype._getCenter = function () {
        return this._center;
      }),
      (e.prototype._renderSlices = function (t, e, i, r, n, o, s, a) {
        for (
          var h,
            l,
            c,
            _ = e.length,
            u = o,
            p = 1 == this.reversed,
            d = this._center,
            f = 1 === _ ? 360 : 359.9 / 360,
            g = 0;
          g < _;
          g++
        ) {
          (l = d.x),
            (c = d.y),
            (h = t.startGroup()),
            (t.fill = this._getColorLight(g)),
            (t.stroke = this._getColor(g));
          var m = Math.abs(e[g]),
            y = Math.abs(m - i) < 1e-10 ? s : (s * m) / i;
          y = Math.min(y, s * f);
          var b = p ? u - 0.5 * y : u + 0.5 * y;
          a > 0 && y < s && ((l += a * Math.cos(b)), (c += a * Math.sin(b))),
            this._renderSlice(t, l, c, b, g, r, n, u, y, s),
            p ? (u -= y) : (u += y),
            t.endGroup(),
            this._pels.push(h);
        }
      }),
      (e.prototype._renderSlice = function (t, e, i, r, n, o, s, a, h, l) {
        var c = this,
          _ = !!this.reversed;
        if ((this._angles.push(r), this.itemFormatter)) {
          var u = new HitTestInfo(
            this,
            new wjcCore.Point(e + o * Math.cos(r), i + o * Math.sin(r)),
            ChartElement.SeriesSymbol
          );
          u._setData(null, n),
            this.itemFormatter(t, u, function () {
              c._drawSlice(t, n, _, e, i, o, s, a, h);
            });
        } else this._drawSlice(t, n, _, e, i, o, s, a, h);
      }),
      (e.prototype._renderLabels = function (t) {
        var e = this._areas.length,
          i = this.dataLabel,
          r = i.position,
          n = this._rotationAngle,
          o = i.connectingLine,
          s = i.offset ? i.offset : 0;
        (t.stroke = 'null'),
          (t.fill = 'transparent'),
          (t.strokeWidth = 1),
          t.startGroup('wj-data-labels');
        for (var a = 0; a < e; a++) {
          var h = this._areas[a];
          if (h) {
            var l = h.radius,
              c = h.langle + n,
              _ = 1,
              u = 1;
            r == PieLabelPosition.Center
              ? (l *= 0.5 * (1 + (h.innerRadius || 0) / h.radius))
              : ((c = _Math.clampAngle(c)) <= -170 || c >= 170
                  ? ((_ = 2), (u = 1))
                  : c >= -100 && c <= -80
                  ? ((_ = 1), (u = 2))
                  : c >= -10 && c <= 10
                  ? ((_ = 0), (u = 1))
                  : c >= 80 && c <= 100
                  ? ((_ = 1), (u = 0))
                  : -180 < c && c < -90
                  ? ((_ = 2), (u = 2))
                  : -90 <= c && c < 0
                  ? ((_ = 0), (u = 2))
                  : 0 < c && c < 90
                  ? ((_ = 0), (u = 0))
                  : 90 < c && c < 180 && ((_ = 2), (u = 0)),
                r == PieLabelPosition.Inside && ((_ = 2 - _), (u = 2 - u))),
              (c *= Math.PI / 180);
            var p = 0,
              d = 0,
              f = 0;
            a == this._selectedIndex &&
              this.selectedItemOffset > 0 &&
              (f = this.selectedItemOffset),
              f > 0 &&
                ((p = Math.cos(c) * f * this._radius),
                (d = Math.sin(c) * f * this._radius));
            var g = l;
            r == PieLabelPosition.Outside
              ? (g += s)
              : r == PieLabelPosition.Inside && (g -= s);
            var m = h.center.x,
              y = h.center.y,
              b = m - this._center.x,
              v = y - this._center.y;
            if (0 != this._rotationAngle) {
              var x = Math.sqrt(b * b + v * v),
                w = Math.atan2(v, b) + (this._rotationAngle * Math.PI) / 180;
              (m = this._center.x + x * Math.cos(w)),
                (y = this._center.y + x * Math.sin(w));
            }
            var C = new wjcCore.Point(
              m + p + g * Math.cos(c),
              y + d + g * Math.sin(c)
            );
            i.border &&
              r != PieLabelPosition.Center &&
              (0 == _ ? (C.x += 2) : 2 == _ && (C.x -= 2),
              0 == u ? (C.y += 2) : 2 == u && (C.y -= 2));
            var S = new HitTestInfo(this, C);
            S._setData(null, a);
            var P = this._getLabelContent(S, i.content),
              T = new DataLabelRenderEventArgs(t, S, C, P);
            if (
              (i.onRendering &&
                (i.onRendering(T) ? ((P = T.text), (C = T.point)) : (P = null)),
              P)
            ) {
              var M = FlexChart._renderText(t, P, C, _, u, 'wj-data-label');
              if (
                (i.border &&
                  t.drawRect(
                    M.left - 2,
                    M.top - 2,
                    M.width + 4,
                    M.height + 4,
                    'wj-data-label-border'
                  ),
                o)
              ) {
                var j = new wjcCore.Point(
                  h.center.x + p + l * Math.cos(c),
                  h.center.y + d + l * Math.sin(c)
                );
                t.drawLine(C.x, C.y, j.x, j.y, 'wj-data-label-line');
              }
            }
          }
        }
        t.endGroup();
      }),
      (e.prototype._drawSlice = function (t, e, i, r, n, o, s, a, h) {
        var l;
        i
          ? s > 0
            ? (0 != h && t.drawDonutSegment(r, n, o, s, a - h, h),
              ((l = new _DonutSegment(
                new wjcCore.Point(r, n),
                o,
                s,
                a - h,
                h,
                this.startAngle
              )).tag = e),
              this._areas.push(l))
            : (0 != h && t.drawPieSegment(r, n, o, a - h, h),
              ((l = new _PieSegment(
                new wjcCore.Point(r, n),
                o,
                a - h,
                h,
                this.startAngle
              )).tag = e),
              this._areas.push(l))
          : (s > 0
              ? (0 != h && t.drawDonutSegment(r, n, o, s, a, h),
                ((l = new _DonutSegment(
                  new wjcCore.Point(r, n),
                  o,
                  s,
                  a,
                  h,
                  this.startAngle
                )).tag = e),
                this._areas.push(l))
              : (0 != h && t.drawPieSegment(r, n, o, a, h),
                ((l = new _PieSegment(
                  new wjcCore.Point(r, n),
                  o,
                  a,
                  h,
                  this.startAngle
                )).tag = e),
                this._areas.push(l)),
            (a += h));
      }),
      (e.prototype._measureLegendItem = function (t, e) {
        var i = new wjcCore.Size();
        if (
          ((i.width = Series._LEGEND_ITEM_WIDTH),
          (i.height = Series._LEGEND_ITEM_HEIGHT),
          e)
        ) {
          var r = t.measureString(
            e,
            FlexChart._CSS_LABEL,
            FlexChart._CSS_LEGEND
          );
          (i.width += r.width), i.height < r.height && (i.height = r.height);
        }
        return (
          (i.width += 3 * Series._LEGEND_ITEM_MARGIN),
          (i.height += 2 * Series._LEGEND_ITEM_MARGIN),
          i
        );
      }),
      (e.prototype._drawLegendItem = function (t, e, i, r) {
        t.strokeWidth = 1;
        var n = Series._LEGEND_ITEM_MARGIN,
          o = null,
          s = null;
        null === o && (o = this._getColorLight(i)),
          null === s && (s = this._getColor(i)),
          (t.fill = o),
          (t.stroke = s);
        var a = e.top + 0.5 * e.height,
          h = Series._LEGEND_ITEM_WIDTH,
          l = Series._LEGEND_ITEM_HEIGHT;
        t.drawRect(e.left + n, a - 0.5 * l, h, l, null),
          null != r &&
            FlexChart._renderText(
              t,
              r.toString(),
              new wjcCore.Point(e.left + l + 2 * n, a),
              0,
              1,
              FlexChart._CSS_LABEL
            );
      }),
      (e.prototype._getLabelContent = function (t, e) {
        return wjcCore.isString(e)
          ? this._keywords.replace(e, t)
          : wjcCore.isFunction(e)
          ? e(t)
          : null;
      }),
      (e.prototype._select = function (t, e) {
        if (
          (void 0 === e && (e = !1),
          this._highlight(!1, this._selectionIndex),
          (this._selectionIndex = t),
          this.selectionMode == SelectionMode.Point)
        ) {
          var i = this._cv;
          i &&
            ((this._notifyCurrentChanged = !1),
            i.moveCurrentToPosition(t),
            (this._notifyCurrentChanged = !0));
        }
        !this.isAnimated &&
        (this.selectedItemOffset > 0 ||
          this.selectedItemPosition != Position.None)
          ? ((this._selectedIndex = null == t ? -1 : t), this.invalidate())
          : this._highlight(!0, this._selectionIndex, e),
          this.onSelectionChanged();
      }),
      (e.prototype._highlightCurrent = function () {
        if (this.selectionMode != SelectionMode.None) {
          var t = -1,
            e = this._cv;
          e && (t = e.currentPosition), this._highlight(!0, t);
        }
      }),
      (e.prototype._highlight = function (t, e, i) {
        if (
          (void 0 === i && (i = !1),
          this.selectionMode == SelectionMode.Point &&
            void 0 !== e &&
            null !== e &&
            e >= 0)
        ) {
          var r = this._pels[e];
          if (t) {
            if (r) {
              r.parentNode.appendChild(r);
              var n = this._find(r, ['ellipse']);
              this._highlightItems(
                this._find(r, ['path', 'ellipse']),
                FlexChart._CSS_SELECTION,
                t
              );
            }
            var o = this._angles[e];
            if (this.selectedItemPosition != Position.None && 0 != o) {
              var s = 0;
              this.selectedItemPosition == Position.Left
                ? (s = 180)
                : this.selectedItemPosition == Position.Top
                ? (s = -90)
                : this.selectedItemPosition == Position.Bottom && (s = 90);
              var a = (s * Math.PI) / 180 - o;
              (a *= 180 / Math.PI),
                i && this.isAnimated
                  ? this._animateSelectionAngle(a, 0.5)
                  : ((this._rotationAngle = a),
                    this._pieGroup.transform.baseVal
                      .getItem(0)
                      .setRotate(a, this._center.x, this._center.y));
            }
            var h = this.selectedItemOffset;
            if (h > 0 && n && 0 == n.length) {
              var l = (this._selectedOffset.x = Math.cos(o) * h * this._radius),
                c = (this._selectedOffset.y = Math.sin(o) * h * this._radius);
              r &&
                r.setAttribute(
                  'transform',
                  'translate(' + l.toFixed() + ',' + c.toFixed() + ')'
                );
            }
            this._selectedIndex = e;
          } else
            r &&
              (r.parentNode.insertBefore(r, r.parentNode.childNodes.item(e)),
              r.removeAttribute('transform'),
              this._highlightItems(
                this._find(r, ['path', 'ellipse']),
                FlexChart._CSS_SELECTION,
                t
              )),
              this._selectedIndex == e && (this._selectedIndex = -1);
        }
      }),
      (e.prototype._animateSelectionAngle = function (t, e) {
        var i = _Math.clampAngle(this._rotationAngle),
          r = (t = _Math.clampAngle(t)) - i,
          n = this,
          o = i,
          s = n._pieGroup;
        n._selectionAnimationID && clearInterval(this._selectionAnimationID),
          (this._selectionAnimationID = wjcCore.animate(function (t) {
            s == n._pieGroup &&
              ((n._rotationAngle = i = o + r * t),
              n._pieGroup.transform.baseVal
                .getItem(0)
                .setRotate(i, n._center.x, n._center.y),
              1 == t && clearInterval(n._selectionAnimationID),
              t > 0.99 &&
                (n.selectedItemOffset > 0 ||
                  n.selectedItemPosition != Position.None) &&
                n.invalidate());
          }, 1e3 * e));
      }),
      (e.prototype._getHitTestItem = function (t) {
        var e = null,
          i = null;
        return (
          (e = null != this._cv ? this._cv.items : this.itemsSource) &&
            t < e.length &&
            (i = e[t]),
          i
        );
      }),
      (e.prototype._getHitTestValue = function (t) {
        return this._values[t];
      }),
      (e.prototype._getHitTestLabel = function (t) {
        return this._labels[t];
      }),
      (e._MARGIN = 4),
      e
    );
  })(FlexChartBase);
exports.FlexPie = FlexPie;
var _Math = (function () {
    function t() {}
    return (
      (t.clampAngle = function (t, e) {
        void 0 === e && (e = 0);
        var i = ((t + 180) % 360) - 180;
        return i < -180 + (e < 0 ? e + 360 : e) && (i += 360), i;
      }),
      t
    );
  })(),
  _PieSegment = (function () {
    function t(t, e, i, r, n) {
      void 0 === n && (n = 0),
        (this._isFull = !1),
        (this._center = t),
        (this._radius = e),
        (this._originAngle = i),
        (this._originSweep = r),
        r >= 2 * Math.PI && (this._isFull = !0),
        (this._sweep = (0.5 * r * 180) / Math.PI),
        (this._angle = _Math.clampAngle((180 * i) / Math.PI + this._sweep)),
        (this._radius2 = e * e),
        (this._startAngle = n);
    }
    return (
      (t.prototype.contains = function (t) {
        var e = t.x - this._center.x,
          i = t.y - this._center.y;
        if (e * e + i * i <= this._radius2) {
          var r = (180 * Math.atan2(i, e)) / Math.PI,
            n =
              _Math.clampAngle(this._angle, this._startAngle) -
              _Math.clampAngle(r, this._startAngle);
          if (this._isFull || Math.abs(n) <= this._sweep) return !0;
        }
        return !1;
      }),
      (t.prototype.distance = function (t) {
        if (this.contains(t)) return 0;
        var e = t.x - this._center.x,
          i = t.y - this._center.y,
          r = e * e + i * i,
          n = (180 * Math.atan2(i, e)) / Math.PI,
          o =
            _Math.clampAngle(this._angle, this._startAngle) -
            _Math.clampAngle(n, this._startAngle);
        return this._isFull || Math.abs(o) <= this._sweep
          ? Math.sqrt(r) - this._radius
          : void 0;
      }),
      Object.defineProperty(t.prototype, 'center', {
        get: function () {
          return this._center;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'radius', {
        get: function () {
          return this._radius;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'langle', {
        get: function () {
          return this._angle;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'angle', {
        get: function () {
          return this._originAngle;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sweep', {
        get: function () {
          return this._originSweep;
        },
        enumerable: !0,
        configurable: !0,
      }),
      t
    );
  })();
exports._PieSegment = _PieSegment;
var _DonutSegment = (function () {
  function t(t, e, i, r, n, o) {
    void 0 === o && (o = 0),
      (this._isFull = !1),
      (this._center = t),
      (this._radius = e),
      (this._iradius = i),
      (this._originAngle = r),
      (this._originSweep = n),
      n >= 2 * Math.PI && (this._isFull = !0),
      (this._sweep = (0.5 * n * 180) / Math.PI),
      (this._angle = _Math.clampAngle((180 * r) / Math.PI + this._sweep)),
      (this._radius2 = e * e),
      (this._iradius2 = i * i),
      (this._startAngle = o);
  }
  return (
    (t.prototype.contains = function (t) {
      var e = t.x - this._center.x,
        i = t.y - this._center.y,
        r = e * e + i * i;
      if (r >= this._iradius2 && r <= this._radius2) {
        var n = (180 * Math.atan2(i, e)) / Math.PI,
          o =
            _Math.clampAngle(this._angle, this._startAngle) -
            _Math.clampAngle(n, this._startAngle);
        if (this._isFull || Math.abs(o) <= this._sweep) return !0;
      }
      return !1;
    }),
    (t.prototype.distance = function (t) {
      if (this.contains(t)) return 0;
    }),
    Object.defineProperty(t.prototype, 'center', {
      get: function () {
        return this._center;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'radius', {
      get: function () {
        return this._radius;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'langle', {
      get: function () {
        return this._angle;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'angle', {
      get: function () {
        return this._originAngle;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sweep', {
      get: function () {
        return this._originSweep;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'innerRadius', {
      get: function () {
        return this._iradius;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})();
exports._DonutSegment = _DonutSegment;
var Stacking;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Stacked = 1)] = 'Stacked'),
    (t[(t.Stacked100pc = 2)] = 'Stacked100pc');
})((Stacking = exports.Stacking || (exports.Stacking = {})));
var SelectionMode;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Series = 1)] = 'Series'),
    (t[(t.Point = 2)] = 'Point');
})((SelectionMode = exports.SelectionMode || (exports.SelectionMode = {})));
var FlexChartCore = (function (t) {
  function e(e, i) {
    var r = t.call(this, e, null, !0) || this;
    (r._series = new wjcCore.ObservableArray()),
      (r._axes = new AxisCollection()),
      (r._pareas = new PlotAreaCollection()),
      (r._interpolateNulls = !1),
      (r._legendToggle = !1),
      (r._symbolSize = 10),
      (r._dataInfo = new _DataInfo()),
      (r.__barPlotter = null),
      (r.__linePlotter = null),
      (r.__areaPlotter = null),
      (r.__bubblePlotter = null),
      (r.__financePlotter = null),
      (r.__funnelPlotter = null),
      (r._plotters = []),
      (r._rotated = !1),
      (r._stacking = Stacking.None),
      (r._xlabels = []),
      (r._xvals = []),
      (r._lblAreas = []),
      (r._colRowLens = []),
      (r._bindingSeparator = ','),
      (r.seriesVisibilityChanged = new wjcCore.Event()),
      r.applyTemplate('wj-control wj-flexchart', null, null);
    var n = r;
    return (
      n._series.collectionChanged.addHandler(function () {
        for (var t = n._series, e = 0; e < t.length; e++) {
          var i = wjcCore.tryCast(t[e], SeriesBase);
          if (!i) throw 'chartSeries array must contain SeriesBase objects.';
          (i._chart = n),
            i.axisX && (i.axisX._chart = n),
            i.axisY && (i.axisY._chart = n);
        }
        n.invalidate();
      }),
      (r._currentRenderEngine = new _SvgRenderEngine(r.hostElement)),
      (r._hitTester = new _HitTester(r)),
      (r._legend = new Legend(r)),
      (r._tooltip = new ChartTooltip()),
      (r._tooltip.showDelay = 0),
      (r._lbl = new DataLabel()),
      (r._lbl._chart = r),
      r._initAxes(),
      n._axes.collectionChanged.addHandler(function () {
        for (var t = n._axes, e = 0; e < t.length; e++) {
          var i = wjcCore.tryCast(t[e], Axis);
          if (!i) throw 'axes array must contain Axis objects.';
          i._chart = n;
        }
        n.invalidate();
      }),
      n._pareas.collectionChanged.addHandler(function () {
        for (var t = n._pareas, e = 0; e < t.length; e++) {
          var i = wjcCore.tryCast(t[e], PlotArea);
          if (!i) throw 'plotAreas array must contain PlotArea objects.';
          i._chart = n;
        }
        n.invalidate();
      }),
      (r._keywords = new _KeyWords()),
      r.hostElement.addEventListener('click', function (t) {
        var e = n._tooltip;
        if (e.content && n.isTouching) {
          var i = n.hitTest(t);
          if (i.distance <= e.threshold) {
            var r = n._getLabelContent(i, n._tooltip.content);
            n._showToolTip(r, new wjcCore.Rect(t.clientX, t.clientY, 5, 5));
          } else n._hideToolTip();
        }
      }),
      r.hostElement.addEventListener('mousemove', function (t) {
        var e = n._tooltip;
        if (e.content && !n.isTouching) {
          var i = n.hitTest(t);
          if (i.distance <= e.threshold) {
            var r = n._getLabelContent(i, n._tooltip.content);
            n._showToolTip(r, new wjcCore.Rect(t.clientX, t.clientY, 5, 5));
          } else n._hideToolTip();
        }
      }),
      r.hostElement.addEventListener('mouseleave', function (t) {
        n._hideToolTip();
      }),
      r.hostElement.addEventListener('click', function (t) {
        if (n.selectionMode != SelectionMode.None) {
          var e = n._hitTestData(t),
            i = FlexChart._SELECTION_THRESHOLD;
          n.tooltip && n.tooltip.threshold && (i = n.tooltip.threshold),
            e.distance <= i && e.series
              ? n._select(e.series, e.pointIndex)
              : n.selectionMode == SelectionMode.Series &&
                (e = n.hitTest(t)).chartElement == ChartElement.Legend &&
                e.series
              ? n._select(e.series, null)
              : n._select(null, null);
        }
        !0 === n.legendToggle &&
          (e = n.hitTest(t)).chartElement == ChartElement.Legend &&
          e.series &&
          (e.series.visibility == SeriesVisibility.Legend
            ? (e.series.visibility = SeriesVisibility.Visible)
            : e.series.visibility == SeriesVisibility.Visible &&
              (e.series.visibility = SeriesVisibility.Legend),
          n.focus());
      }),
      r.initialize(i),
      r
    );
  }
  return (
    __extends(e, t),
    (e.prototype._initAxes = function () {
      (this._axisX = new Axis(Position.Bottom)),
        (this._axisY = new Axis(Position.Left)),
        (this._axisX.majorGrid = !1),
        (this._axisX.name = 'axisX'),
        (this._axisY.majorGrid = !0),
        (this._axisY.majorTickMarks = TickMark.None),
        (this._axisY.name = 'axisY'),
        (this._axisX._chart = this),
        (this._axisY._chart = this),
        this._axes.push(this._axisX),
        this._axes.push(this._axisY);
    }),
    Object.defineProperty(e.prototype, 'series', {
      get: function () {
        return this._series;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'axes', {
      get: function () {
        return this._axes;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'axisX', {
      get: function () {
        return this._axisX;
      },
      set: function (t) {
        if (t != this._axisX) {
          var e = (this._axisX = wjcCore.asType(t, Axis));
          this.beginUpdate(),
            e &&
              (void 0 === e.majorGrid && (e.majorGrid = !1),
              void 0 === e.name && (e.name = 'axisX'),
              void 0 === e.position && (e.position = Position.Bottom),
              (e._axisType = AxisType.X),
              (e._chart = this)),
            this.endUpdate();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'axisY', {
      get: function () {
        return this._axisY;
      },
      set: function (t) {
        if (t != this._axisY) {
          var e = (this._axisY = wjcCore.asType(t, Axis));
          this.beginUpdate(),
            e &&
              (void 0 === e.majorGrid && (e.majorGrid = !0),
              void 0 === e.name && (e.name = 'axisY'),
              (e.majorTickMarks = TickMark.None),
              void 0 === e.position && (e.position = Position.Left),
              (e._axisType = AxisType.Y),
              (e._chart = this)),
            this.endUpdate();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'plotAreas', {
      get: function () {
        return this._pareas;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'binding', {
      get: function () {
        return this._binding;
      },
      set: function (t) {
        t != this._binding &&
          ((this._binding = wjcCore.asString(t, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'bindingX', {
      get: function () {
        return this._bindingX;
      },
      set: function (t) {
        t != this._bindingX &&
          ((this._bindingX = wjcCore.asString(t, !0)), this._bindChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'symbolSize', {
      get: function () {
        return this._symbolSize;
      },
      set: function (t) {
        t != this._symbolSize &&
          ((this._symbolSize = wjcCore.asNumber(t, !1, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'interpolateNulls', {
      get: function () {
        return this._interpolateNulls;
      },
      set: function (t) {
        t != this._interpolateNulls &&
          ((this._interpolateNulls = wjcCore.asBoolean(t)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'legendToggle', {
      get: function () {
        return this._legendToggle;
      },
      set: function (t) {
        t != this._legendToggle && (this._legendToggle = wjcCore.asBoolean(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'tooltip', {
      get: function () {
        return this._tooltip;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'dataLabel', {
      get: function () {
        return this._lbl;
      },
      set: function (t) {
        t != this._lbl &&
          ((this._lbl = wjcCore.asType(t, DataLabel)),
          this._lbl && (this._lbl._chart = this));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'selection', {
      get: function () {
        return this._selection;
      },
      set: function (t) {
        t != this._selection &&
          ((this._selection = wjcCore.asType(t, SeriesBase, !0)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onSeriesVisibilityChanged = function (t) {
      this.seriesVisibilityChanged.raise(this, t);
    }),
    (e.prototype.hitTest = function (t, e) {
      var i = this._toControl(t, e),
        r = new HitTestInfo(this, i),
        n = null;
      if (FlexChart._contains(this._rectHeader, i))
        r._chartElement = ChartElement.Header;
      else if (FlexChart._contains(this._rectFooter, i))
        r._chartElement = ChartElement.Footer;
      else if (FlexChart._contains(this._rectLegend, i))
        (r._chartElement = ChartElement.Legend),
          null !== (n = this.legend._hitTest(i)) &&
            n >= 0 &&
            n < this.series.length &&
            (this._getChartType() === ChartType.Bar
              ? r._setData(this.series[this.series.length - 1 - n])
              : r._setData(this.series[n]));
      else if (FlexChart._contains(this._rectChart, i)) {
        var o = this._hitTestLabels(i);
        if (o)
          (r._chartElement = ChartElement.DataLabel),
            (r._dist = 0),
            r._setDataPoint(o.tag);
        else {
          for (
            var s = this._hitTester.hitTest(i),
              a = null,
              h = null,
              l = this.series.length - 1;
            l >= 0;
            l--
          )
            if (this.series[l].hitTest !== Series.prototype.hitTest) {
              var c = this.series[l].hitTest(t);
              if (
                c &&
                ((!a || c.distance < a.distance) && ((a = c), (h = l)),
                0 === c.distance)
              )
                break;
            }
          s && s.area
            ? a && a.distance < s.distance
              ? (r = a)
              : a && a.distance == s.distance && h > s.area.tag.seriesIndex
              ? (r = a)
              : (r._setDataPoint(s.area.tag), (r._dist = s.distance))
            : a && (r = a),
            FlexChart._contains(this.axisX._axrect, i)
              ? (r._chartElement = ChartElement.AxisX)
              : FlexChart._contains(this.axisY._axrect, i)
              ? (r._chartElement = ChartElement.AxisY)
              : FlexChart._contains(this._plotRect, i)
              ? (r._chartElement = ChartElement.PlotArea)
              : FlexChart._contains(this._rectChart, i) &&
                (r._chartElement = ChartElement.ChartArea);
        }
      } else r._chartElement = ChartElement.None;
      return r;
    }),
    (e.prototype.pointToData = function (t, e) {
      return (
        wjcCore.isNumber(t) &&
          wjcCore.isNumber(e) &&
          (t = new wjcCore.Point(t, e)),
        t instanceof MouseEvent
          ? ((t = new wjcCore.Point(t.pageX, t.pageY)),
            (t = this._toControl(t)))
          : (t = t.clone()),
        (t.x = this.axisX.convertBack(t.x)),
        (t.y = this.axisY.convertBack(t.y)),
        t
      );
    }),
    (e.prototype.dataToPoint = function (t, e) {
      wjcCore.isNumber(t) &&
        wjcCore.isNumber(e) &&
        (t = new wjcCore.Point(t, e)),
        wjcCore.asType(t, wjcCore.Point);
      var i = t.clone();
      return (
        (i.x = this.axisX.convert(i.x)), (i.y = this.axisY.convert(i.y)), i
      );
    }),
    (e.prototype._copy = function (t, e) {
      if ('series' == t) {
        this.series.clear();
        for (var i = wjcCore.asArray(e), r = 0; r < i.length; r++) {
          var n = this._createSeries();
          wjcCore.copy(n, i[r]), this.series.push(n);
        }
        return !0;
      }
      return !1;
    }),
    (e.prototype._createSeries = function () {
      return new Series();
    }),
    (e.prototype._clearCachedValues = function () {
      for (var t = 0; t < this._series.length; t++) {
        var e = this._series[t];
        null == e.itemsSource && e._clearValues();
      }
    }),
    (e.prototype._performBind = function () {
      if (
        ((this._xDataType = null),
        this._xlabels.splice(0),
        this._xvals.splice(0),
        this._cv)
      ) {
        var t = this._cv.items;
        if (t) {
          for (var e = t.length, i = 0; i < e; i++) {
            var r = t[i];
            if (this._bindingX) {
              var n = r[this._bindingX];
              wjcCore.isNumber(n)
                ? (this._xvals.push(wjcCore.asNumber(n)),
                  (this._xDataType = wjcCore.DataType.Number))
                : wjcCore.isDate(n) &&
                  (this._xvals.push(wjcCore.asDate(n).valueOf()),
                  (this._xDataType = wjcCore.DataType.Date)),
                this._xlabels.push(r[this._bindingX]);
            }
          }
          this._xvals.length == e
            ? this._xlabels.splice(0)
            : this._xvals.splice(0);
        }
      }
    }),
    (e.prototype._hitTestSeries = function (t, e) {
      var i = this._toControl(t),
        r = new HitTestInfo(this, i),
        n = this._hitTester.hitTestSeries(i, e);
      return (
        n &&
          n.area &&
          (r._setDataPoint(n.area.tag),
          (r._chartElement = ChartElement.PlotArea),
          (r._dist = n.distance)),
        r
      );
    }),
    (e.prototype._hitTestData = function (t) {
      var e = this._toControl(t),
        i = new HitTestInfo(this, e),
        r = this._hitTester.hitTest(e, !0);
      return (
        r && r.area && (i._setDataPoint(r.area.tag), (i._dist = r.distance)), i
      );
    }),
    (e.prototype._hitTestLabels = function (t) {
      for (var e = null, i = this._lblAreas.length, r = 0; r < i; r++)
        if (this._lblAreas[r].contains(t)) {
          e = this._lblAreas[r];
          break;
        }
      return e;
    }),
    (e._dist2 = function (t, e) {
      var i = t.x - e.x,
        r = t.y - e.y;
      return i * i + r * r;
    }),
    (e._dist = function (t, e, i) {
      return Math.sqrt(FlexChart._distToSegmentSquared(t, e, i));
    }),
    (e._distToSegmentSquared = function (t, e, i) {
      var r = FlexChart._dist2(e, i);
      if (0 == r) return FlexChart._dist2(t, e);
      var n = ((t.x - e.x) * (i.x - e.x) + (t.y - e.y) * (i.y - e.y)) / r;
      return n < 0
        ? FlexChart._dist2(t, e)
        : n > 1
        ? FlexChart._dist2(t, i)
        : FlexChart._dist2(
            t,
            new wjcCore.Point(e.x + n * (i.x - e.x), e.y + n * (i.y - e.y))
          );
    }),
    (e.prototype._isRotated = function () {
      return this._getChartType() == ChartType.Bar
        ? !this._rotated
        : this._rotated;
    }),
    (e.prototype._getChartType = function () {
      return null;
    }),
    (e.prototype._prepareRender = function () {
      this._hitTester.clear();
    }),
    (e.prototype._renderChart = function (t, e, i) {
      var r = this._rectChart.clone(),
        n = new wjcCore.Size(r.width, r.height);
      e.width, e.height;
      ((g = this._getPlotter(null)).stacking = this._stacking),
        this._curPlotter != g &&
          (this._curPlotter && this._curPlotter.unload(),
          (this._curPlotter = g)),
        g.load();
      var o = this._isRotated();
      this._dataInfo.analyse(
        this._series,
        o,
        g.stacking,
        this._xvals.length > 0 ? this._xvals : null,
        this.axisX.logBase > 0,
        this.axisY.logBase > 0
      );
      var s = g.adjustLimits(this._dataInfo, e.clone());
      if (o) {
        var a = this._dataInfo.getDataTypeX();
        a || (a = this._xDataType),
          this.axisX._updateActualLimits(
            this._dataInfo.getDataTypeY(),
            s.left,
            s.right
          ),
          this.axisY._updateActualLimits(
            a,
            s.top,
            s.bottom,
            this._xlabels,
            this._xvals
          );
      } else {
        var h = this._dataInfo.getDataTypeX();
        h || (h = this._xDataType),
          this.axisX._updateActualLimits(
            h,
            s.left,
            s.right,
            this._xlabels,
            this._xvals
          ),
          this.axisY._updateActualLimits(
            this._dataInfo.getDataTypeY(),
            s.top,
            s.bottom
          );
      }
      var l = this._getAxes();
      if (
        (this._updateAuxAxes(l, o),
        this._layout(e, n, t),
        t.startGroup(FlexChart._CSS_PLOT_AREA),
        (t.fill = 'transparent'),
        (t.stroke = null),
        this.plotAreas.length > 0)
      )
        for (p = 0; p < this.plotAreas.length; p++)
          this.plotAreas[p]._render(t);
      else {
        var c = this._plotRect;
        t.drawRect(c.left, c.top, c.width, c.height);
      }
      t.endGroup();
      var _ = this._series.length;
      this._clearPlotters();
      for (var u = {}, p = 0; p < _; p++) {
        var d = this._series[p];
        if (
          ((x = d.visibility) == SeriesVisibility.Visible ||
            x == SeriesVisibility.Plot) &&
          d.getValues(0)
        ) {
          var f = d._getAxisY(),
            g = this._getPlotter(d);
          if (!f || f == this.axisY || g instanceof _BarPlotter)
            g.seriesCount++;
          else {
            var m = f._uniqueId;
            u[m] ? (u[m].count += 1) : (u[m] = { count: 1, index: 0 });
          }
        }
      }
      if (
        (this.onRendering(new RenderEventArgs(t)),
        this._getChartType() !== ChartType.Funnel)
      )
        for (p = 0; p < l.length; p++) {
          var y = l[p];
          (v =
            y.axisType == AxisType.X
              ? t.startGroup(FlexChart._CSS_AXIS_X, this._chartRectId)
              : t.startGroup(FlexChart._CSS_AXIS_Y, this._chartRectId)),
            (y._hostElement = i ? v : y._hostElement),
            y._render(t),
            t.endGroup();
        }
      t.startGroup('wj-series-group'),
        (this._plotrectId = 'plotRect' + (1e6 * Math.random()).toFixed()),
        t.addClipRect(this._plotRect, this._plotrectId);
      for (p = 0; p < _; p++) {
        var b = this._series[p];
        b._pointIndexes = [];
        g = this._getPlotter(b);
        b._plotter = g;
        var v = t.startGroup(b.cssClass, g.clipping ? this._plotrectId : null);
        b._hostElement = i ? v : b._hostElement;
        var x = b.visibility,
          w = b.axisX,
          C = b.axisY;
        if (
          (w || (w = this.axisX),
          C || (C = this.axisY),
          x == SeriesVisibility.Visible || x == SeriesVisibility.Plot)
        ) {
          var S,
            P,
            T = u[C._uniqueId];
          T
            ? ((S = T.index),
              (P = T.count),
              T.index++,
              b.onRendering(t, S, P) || g.plotSeries(t, w, C, b, this, S, P))
            : ((S = g.seriesIndex),
              (P = g.seriesCount),
              g.seriesIndex++,
              b.onRendering(t, S, P) || g.plotSeries(t, w, C, b, this, S, P)),
            b.onRendered(t);
        }
        t.endGroup();
      }
      t.endGroup(),
        (this._lblAreas = []),
        this.dataLabel.content &&
          this.dataLabel.position != LabelPosition.None &&
          this._renderLabels(t),
        this._highlightCurrent(),
        this.onRendered(new RenderEventArgs(t));
    }),
    (e.prototype._getDesiredLegendSize = function (t, e, i, r) {
      var n = new wjcCore.Size(),
        o = this.series,
        s = o.length,
        a = 0,
        h = 0;
      this._colRowLens = [];
      for (var l = 0; l < s; l++) {
        var c = wjcCore.tryCast(o[l], SeriesBase),
          _ = c.visibility;
        if (
          c.name &&
          _ != SeriesVisibility.Hidden &&
          _ != SeriesVisibility.Plot
        )
          for (var u = c.legendItemLength(), p = 0; p < u; p++) {
            var d = c.measureLegendItem(t, p);
            e
              ? (a + d.height > r &&
                  ((n.height = r), this._colRowLens.push(h), (h = 0), (a = 0)),
                h < d.width && (h = d.width),
                (a += d.height))
              : (h + d.width > i &&
                  ((n.width = i), this._colRowLens.push(a), (a = 0), (h = 0)),
                a < d.height && (a = d.height),
                (h += d.width));
          }
      }
      return (
        e
          ? (n.height < a && (n.height = a),
            this._colRowLens.push(h),
            (n.width = this._colRowLens.reduce(function (t, e) {
              return t + e;
            }, 0)),
            n.width > i / 2 && (n.width = i / 2))
          : (n.width < h && (n.width = h),
            this._colRowLens.push(a),
            (n.height = this._colRowLens.reduce(function (t, e) {
              return t + e;
            }, 0)),
            n.height > r / 2 && (n.height = r / 2)),
        n
      );
    }),
    (e.prototype._renderLegend = function (t, e, i, r, n, o) {
      var s,
        a = this.series,
        h = a.length,
        l = e.clone(),
        c = 0;
      if (this._getChartType() === ChartType.Bar)
        for (_ = h - 1; _ >= 0; _--)
          (s = wjcCore.tryCast(a[_], SeriesBase)),
            (c = this._renderLegendElements(t, s, e, l, i, r, n, o, c));
      else
        for (var _ = 0; _ < h; _++)
          (s = wjcCore.tryCast(a[_], SeriesBase)),
            (c = this._renderLegendElements(t, s, e, l, i, r, n, o, c));
    }),
    (e.prototype._renderLegendElements = function (t, e, i, r, n, o, s, a, h) {
      var l = this._rectLegend,
        c = h;
      if (!e) return c;
      var _ = e.visibility;
      if (!e.name || _ == SeriesVisibility.Hidden || _ == SeriesVisibility.Plot)
        return (e._legendElement = null), n.push(null), c;
      var u = e.legendItemLength(),
        p = t.startGroup(e.cssClass);
      _ == SeriesVisibility.Legend
        ? (p.setAttribute('opacity', '0.5'), (e._legendElement = p))
        : _ == SeriesVisibility.Visible
        ? (e._legendElement = p)
        : (e._legendElement = null);
      for (var d = 0; d < u; d++) {
        var f = e.measureLegendItem(t, d);
        o
          ? r.y + f.height > l.top + l.height + 1 &&
            ((r.x += this._colRowLens[c]), c++, (r.y = i.y))
          : r.x + f.width > l.left + l.width + 1 &&
            ((r.y += this._colRowLens[c]), c++, (r.x = i.x));
        var g = new wjcCore.Rect(r.x, r.y, f.width, f.height);
        (_ != SeriesVisibility.Legend && _ != SeriesVisibility.Visible) ||
          e.drawLegendItem(t, g, d),
          n.push(g),
          o ? (r.y += f.height) : (r.x += f.width);
      }
      return t.endGroup(), c;
    }),
    (e.prototype._renderLabels = function (t) {
      var e = this.series,
        i = e.length;
      (t.stroke = 'null'), (t.fill = 'transparent'), (t.strokeWidth = 1);
      t.startGroup('wj-data-labels');
      for (var r = 0; r < i; r++) {
        var n = e[r],
          o = this._hitTester._map[r];
        o && n._renderLabels(t, o, this, this._lblAreas);
      }
      t.endGroup();
    }),
    (e.prototype._getAxes = function () {
      for (
        var t = [this.axisX, this.axisY], e = this.series.length, i = 0;
        i < e;
        i++
      ) {
        var r = this.series[i],
          n = r.axisX;
        n && -1 === t.indexOf(n) && t.push(n);
        var o = r.axisY;
        o && -1 === t.indexOf(o) && t.push(o);
      }
      return t;
    }),
    (e.prototype._clearPlotters = function () {
      for (var t = this._plotters.length, e = 0; e < t; e++)
        this._plotters[e].clear();
    }),
    (e.prototype._initPlotter = function (t) {
      (t.chart = this),
        (t.dataInfo = this._dataInfo),
        (t.hitTester = this._hitTester),
        this._plotters.push(t);
    }),
    Object.defineProperty(e.prototype, '_barPlotter', {
      get: function () {
        return (
          null === this.__barPlotter &&
            ((this.__barPlotter = new _BarPlotter()),
            this._initPlotter(this.__barPlotter)),
          this.__barPlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_linePlotter', {
      get: function () {
        return (
          null === this.__linePlotter &&
            ((this.__linePlotter = new _LinePlotter()),
            this._initPlotter(this.__linePlotter)),
          this.__linePlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_areaPlotter', {
      get: function () {
        return (
          null === this.__areaPlotter &&
            ((this.__areaPlotter = new _AreaPlotter()),
            this._initPlotter(this.__areaPlotter)),
          this.__areaPlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_bubblePlotter', {
      get: function () {
        return (
          null === this.__bubblePlotter &&
            ((this.__bubblePlotter = new _BubblePlotter()),
            this._initPlotter(this.__bubblePlotter)),
          this.__bubblePlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_financePlotter', {
      get: function () {
        return (
          null === this.__financePlotter &&
            ((this.__financePlotter = new _FinancePlotter()),
            this._initPlotter(this.__financePlotter)),
          this.__financePlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_funnelPlotter', {
      get: function () {
        return (
          null === this.__funnelPlotter &&
            ((this.__funnelPlotter = new _FunnelPlotter()),
            this._initPlotter(this.__funnelPlotter)),
          this.__funnelPlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._getPlotter = function (t) {
      var e = this._getChartType(),
        i = !1;
      if (t) {
        var r = t._getChartType();
        null !== r && void 0 !== r && r != e && ((e = r), (i = !0));
      }
      var n;
      switch (e) {
        case ChartType.Column:
          (this._barPlotter.isVolume = !1),
            (this._barPlotter.width = 0.7),
            (n = this._barPlotter);
          break;
        case ChartType.Bar:
          (this._barPlotter.rotated = !this._rotated),
            (this._barPlotter.isVolume = !1),
            (this._barPlotter.width = 0.7),
            (n = this._barPlotter);
          break;
        case ChartType.Line:
          (this._linePlotter.hasSymbols = !1),
            (this._linePlotter.hasLines = !0),
            (this._linePlotter.isSpline = !1),
            (n = this._linePlotter);
          break;
        case ChartType.Scatter:
          (this._linePlotter.hasSymbols = !0),
            (this._linePlotter.hasLines = !1),
            (this._linePlotter.isSpline = !1),
            (n = this._linePlotter);
          break;
        case ChartType.LineSymbols:
          (this._linePlotter.hasSymbols = !0),
            (this._linePlotter.hasLines = !0),
            (this._linePlotter.isSpline = !1),
            (n = this._linePlotter);
          break;
        case ChartType.Area:
          (this._areaPlotter.isSpline = !1), (n = this._areaPlotter);
          break;
        case ChartType.Bubble:
          n = this._bubblePlotter;
          break;
        case ChartType.Candlestick:
          ((o = this._financePlotter).isCandle = !0),
            (o.isEqui = !1),
            (o.isArms = !1),
            (o.isVolume = !1),
            (n = o);
          break;
        case ChartType.HighLowOpenClose:
          var o = this._financePlotter;
          (o.isCandle = !1),
            (o.isEqui = !1),
            (o.isArms = !1),
            (o.isVolume = !1),
            (n = o);
          break;
        case ChartType.Spline:
          (this._linePlotter.hasSymbols = !1),
            (this._linePlotter.hasLines = !0),
            (this._linePlotter.isSpline = !0),
            (n = this._linePlotter);
          break;
        case ChartType.SplineSymbols:
          (this._linePlotter.hasSymbols = !0),
            (this._linePlotter.hasLines = !0),
            (this._linePlotter.isSpline = !0),
            (n = this._linePlotter);
          break;
        case ChartType.SplineArea:
          (this._areaPlotter.isSpline = !0), (n = this._areaPlotter);
          break;
        case ChartType.Funnel:
          n = this._funnelPlotter;
          break;
        default:
          throw 'Invalid chart type.';
      }
      return (
        (n.rotated = this._rotated),
        e == ChartType.Bar && (n.rotated = !n.rotated),
        i && (n.rotated = this._isRotated()),
        n
      );
    }),
    (e.prototype._layout = function (t, e, i) {
      this.plotAreas.length > 0
        ? this._layoutMultiple(t, e, i)
        : this._layoutSingle(t, e, i);
    }),
    (e.prototype._layoutSingle = function (t, e, i) {
      for (
        var r = t.width,
          n = t.height,
          o = new wjcCore.Size(r, 0.75 * n),
          s = new wjcCore.Size(n, 0.75 * r),
          a = 0,
          h = 0,
          l = r,
          c = n,
          _ = 0,
          u = 0,
          p = r,
          d = n,
          f = this._getAxes(),
          g = 0;
        g < f.length;
        g++
      ) {
        var m = (C = f[g]).origin,
          y = C._getPosition();
        if (C.axisType == AxisType.X) {
          (x = C._getHeight(i, r)) > o.height && (x = o.height),
            (C._desiredSize = new wjcCore.Size(o.width, x));
          var b = (C._hasOrigin =
              wjcCore.isNumber(m) &&
              m > this.axisY._getMinNum() &&
              m < this.axisY._getMaxNum()),
            v = Math.min(0.25 * r, C._annoSize.width);
          if (y == Position.Bottom)
            if (
              ((a = Math.max(a, 0.5 * v)), (l = Math.min(l, r - 0.5 * v)), b)
            ) {
              P = this._convertY(m, u, d);
              d -= Math.max(0, P + x - d);
            } else d -= x;
          else if (y == Position.Top)
            if (
              ((a = Math.max(a, 0.5 * v)), (l = Math.min(l, r - 0.5 * v)), b)
            ) {
              P = this._convertY(m, u, d);
              u += Math.max(0, u - (P - x));
            } else u += x;
        } else if (C.axisType == AxisType.Y) {
          var x = C._getHeight(i, n);
          x > s.height && (x = s.height),
            (C._desiredSize = new wjcCore.Size(s.width, x));
          b = C._hasOrigin =
            wjcCore.isNumber(m) &&
            m > this.axisX._getMinNum() &&
            m < this.axisX._getMaxNum();
          if (y == Position.Left)
            if (
              (C._actualAngle < 0
                ? (c = Math.min(c, n - C._annoSize.height))
                : C._actualAngle > 0
                ? (h = Math.max(h, C._annoSize.height))
                : ((h = Math.max(h, C._annoSize.height)),
                  (c = Math.min(c, n - C._annoSize.height))),
              b)
            ) {
              M = this._convertX(m, _, p);
              _ += Math.max(0, _ - (M - x));
            } else _ += x;
          else if (y == Position.Right)
            if (
              (C._actualAngle > 0
                ? (c = Math.min(c, n - C._annoSize.height))
                : C._actualAngle < 0
                ? (h = Math.max(h, C._annoSize.height))
                : ((h = Math.max(h, C._annoSize.height)),
                  (c = Math.min(c, n - C._annoSize.height))),
              b)
            ) {
              M = this._convertX(m, _, p);
              p -= Math.max(0, M + x - p);
            } else p -= x;
        }
      }
      var w = this._parseMargin(this.plotMargin);
      (a = _ = isNaN(w.left) ? Math.max(a, _) + t.left : w.left),
        (l = p = isNaN(w.right) ? Math.min(l, p) + t.left : e.width - w.right),
        (h = u = isNaN(w.top) ? Math.max(h, u) + t.top : w.top),
        (c = d =
          isNaN(w.bottom) ? Math.min(c, d) + t.top : e.height - w.bottom),
        (r = Math.max(1, l - a)),
        (n = Math.max(1, c - h)),
        (this._plotRect = new wjcCore.Rect(a, h, r, n)),
        (i.stroke = null);
      for (g = 0; g < f.length; g++) {
        var C = f[g],
          m = C.origin,
          y = C._getPosition();
        if (C.axisType == AxisType.X) {
          var S;
          if (C._hasOrigin) {
            var P = this._convertY(
              m,
              this._plotRect.top,
              this._plotRect.bottom
            );
            y == Position.Bottom
              ? ((S = new wjcCore.Rect(a, P, r, C._desiredSize.height)),
                (d += Math.max(0, S.bottom - this._plotRect.bottom)))
              : y == Position.Top
              ? ((S = new wjcCore.Rect(
                  a,
                  P - C._desiredSize.height,
                  r,
                  C._desiredSize.height
                )),
                (u -= Math.max(0, this._plotRect.top - S.top)))
              : (S = new wjcCore.Rect(a, P, r, 1));
          } else
            y == Position.Bottom
              ? ((S = new wjcCore.Rect(a, d, r, C._desiredSize.height)),
                (d += C._desiredSize.height))
              : y == Position.Top
              ? ((S = new wjcCore.Rect(
                  a,
                  u - C._desiredSize.height,
                  r,
                  C._desiredSize.height
                )),
                (u -= C._desiredSize.height))
              : (S = new wjcCore.Rect(a, u, r, 1));
          C._layout(S, this._plotRect);
        } else if (C.axisType == AxisType.Y) {
          var T;
          if (C._hasOrigin) {
            var M = this._convertX(
              m,
              this._plotRect.left,
              this._plotRect.right
            );
            y == Position.Left
              ? ((T = new wjcCore.Rect(
                  M - C._desiredSize.height,
                  h,
                  n,
                  C._desiredSize.height
                )),
                (_ -= C._desiredSize.height))
              : y == Position.Right
              ? ((T = new wjcCore.Rect(M, h, n, C._desiredSize.height)),
                (p += C._desiredSize.height))
              : (T = new wjcCore.Rect(M, h, n, 1));
          } else
            y == Position.Left
              ? ((T = new wjcCore.Rect(
                  _ - C._desiredSize.height,
                  h,
                  n,
                  C._desiredSize.height
                )),
                (_ -= C._desiredSize.height))
              : y == Position.Right
              ? ((T = new wjcCore.Rect(p, h, n, C._desiredSize.height)),
                (p += C._desiredSize.height))
              : (T = new wjcCore.Rect(_, h, n, 1));
          C._layout(T, this._plotRect);
        }
      }
    }),
    (e.prototype._layoutMultiple = function (t, e, i) {
      for (
        var r = t.width,
          n = t.height,
          o = [],
          s = [],
          a = this._getAxes(),
          h = a.length,
          l = 0;
        l < h;
        l++
      )
        if ((((C = a[l])._plotrect = null), C.axisType == AxisType.X)) {
          for (var c = C.plotArea ? C.plotArea.column : 0; o.length <= c; )
            o.push(new _AreaDef());
          o[c].axes.push(C);
        } else if (C.axisType == AxisType.Y) {
          for (var _ = C.plotArea ? C.plotArea.row : 0; s.length <= _; )
            s.push(new _AreaDef());
          s[_].axes.push(C);
        }
      for (
        var u = o.length,
          p = s.length,
          d = new wjcCore.Size(r, 0.3 * n),
          f = new wjcCore.Size(n, 0.3 * r),
          g = 0,
          m = 0,
          y = r,
          b = n,
          v = 0;
        v < u;
        v++
      ) {
        ((k = o[v]).right = r), (k.bottom = n);
        for (l = 0; l < k.axes.length; l++) {
          var x = (C = k.axes[l])._getHeight(
            i,
            C.axisType == AxisType.X ? r : n
          );
          x > d.height && (x = d.height);
          var w = new wjcCore.Size(d.width, x);
          (C._desiredSize = w),
            0 == v && (k.left = Math.max(k.left, 0.5 * C._annoSize.width)),
            v == u - 1 &&
              (k.right = Math.min(k.right, r - 0.5 * C._annoSize.width)),
            (D = C._getPosition()) == Position.Bottom
              ? (k.bottom -= w.height)
              : D == Position.Top && (k.top += w.height);
        }
      }
      for (V = 0; V < p; V++) {
        ((k = s[V]).right = r), (k.bottom = n);
        for (l = 0; l < k.axes.length; l++) {
          var C = k.axes[l],
            S = new wjcCore.Size(
              f.width,
              C._getHeight(i, C.axisType == AxisType.X ? r : n)
            );
          S.height > f.height && (S.height = f.height),
            (C._desiredSize = S),
            0 == V && (k.top = Math.max(k.top, 0.5 * C._annoSize.width)),
            V == p - 1 &&
              (k.bottom = Math.min(k.bottom, n - 0.5 * C._annoSize.width)),
            (D = C._getPosition()) == Position.Left
              ? (k.left += S.height)
              : D == Position.Right && (k.right -= S.height);
        }
      }
      for (var P = 0, T = 0, M = r, j = n, v = 0; v < u; v++) {
        k = o[v];
        (P = Math.max(P, k.left)),
          (T = Math.max(T, k.top)),
          (M = Math.min(M, k.right)),
          (j = Math.min(j, k.bottom));
      }
      for (V = 0; V < p; V++) {
        k = s[V];
        (P = Math.max(P, k.left)),
          (T = Math.max(T, k.top)),
          (M = Math.min(M, k.right)),
          (j = Math.min(j, k.bottom));
      }
      (P = g = Math.max(g, P)),
        (M = y = Math.min(y, M)),
        (T = m = Math.max(m, T)),
        (j = b = Math.min(b, j)),
        (this._plotRect = new wjcCore.Rect(g, m, y - g, b - m));
      for (
        var A = this._plotRect.clone(),
          L = g,
          N = this.plotAreas._calculateWidths(this._plotRect.width, u),
          v = 0;
        v < u;
        v++
      ) {
        (j = b), (T = m);
        for (var k = o[v], I = N[v], l = 0; l < k.axes.length; l++) {
          var E,
            D = (C = k.axes[l])._getPosition(),
            R = new wjcCore.Rect(L, A.top, I, A.height);
          D == Position.Bottom
            ? ((E = new wjcCore.Rect(L, j, I, C._desiredSize.height)),
              (j += C._desiredSize.height))
            : D == Position.Top &&
              ((E = new wjcCore.Rect(
                L,
                T - C._desiredSize.height,
                I,
                C._desiredSize.height
              )),
              (T -= C._desiredSize.height)),
            C._layout(E, R);
        }
        for (l = 0; l < this.plotAreas.length; l++)
          (Y = this.plotAreas[l]).column == v && Y._setPlotX(L, I);
        L += I;
      }
      for (
        var O = m,
          F = this.plotAreas._calculateHeights(this._plotRect.height, p),
          V = 0;
        V < p;
        V++
      ) {
        (P = g), (M = y);
        for (var k = s[V], X = F[V], l = 0; l < k.axes.length; l++) {
          var D = (C = k.axes[l])._getPosition(),
            R = new wjcCore.Rect(A.left, O, A.width, X);
          C._plotrect
            ? ((R.left = C._plotrect.left), (R.width = C._plotrect.width))
            : N && N.length > 0 && (R.width = N[0]);
          var B;
          D == Position.Left
            ? ((B = new wjcCore.Rect(
                P - C._desiredSize.height,
                O,
                X,
                C._desiredSize.height
              )),
              (P -= C._desiredSize.height))
            : D == Position.Right &&
              ((B = new wjcCore.Rect(M, O, X, C._desiredSize.height)),
              (M += C._desiredSize.height)),
            C._layout(B, R);
        }
        for (l = 0; l < this.plotAreas.length; l++) {
          var Y = this.plotAreas[l];
          Y.row == V && Y._setPlotY(O, X);
        }
        O += X;
      }
    }),
    (e.prototype._convertX = function (t, e, i) {
      var r = this.axisX;
      return r.reversed
        ? i -
            ((i - e) * (t - r._getMinNum())) / (r._getMaxNum() - r._getMinNum())
        : e +
            ((i - e) * (t - r._getMinNum())) /
              (r._getMaxNum() - r._getMinNum());
    }),
    (e.prototype._convertY = function (t, e, i) {
      var r = this.axisY;
      return r.reversed
        ? e +
            ((i - e) * (t - r._getMinNum())) / (r._getMaxNum() - r._getMinNum())
        : i -
            ((i - e) * (t - r._getMinNum())) /
              (r._getMaxNum() - r._getMinNum());
    }),
    (e.prototype._getLabelContent = function (t, e) {
      return wjcCore.isString(e)
        ? this._keywords.replace(e, t)
        : wjcCore.isFunction(e)
        ? e(t)
        : null;
    }),
    (e.prototype._select = function (t, e) {
      var i = !1;
      if (
        ((t == this._selection && e == this._selectionIndex) || (i = !0),
        this._selection &&
          this._highlight(this._selection, !1, this._selectionIndex),
        (this._selection = t),
        (this._selectionIndex = e),
        this._selection &&
          this._highlight(this._selection, !0, this._selectionIndex),
        this.selectionMode == SelectionMode.Point)
      ) {
        var r = t ? t.collectionView : this._cv;
        r &&
          ((this._notifyCurrentChanged = !1),
          r.moveCurrentToPosition(t ? e : -1),
          (this._notifyCurrentChanged = !0));
      }
      i && this.onSelectionChanged();
    }),
    (e.prototype._highlightCurrent = function () {
      if (this.selectionMode != SelectionMode.None) {
        var t = this._selection,
          e = -1;
        if (t) {
          var i = t.collectionView;
          i || (i = this._cv),
            i && (e = i.currentPosition),
            this._highlight(t, !0, e);
        }
      }
    }),
    (e.prototype._highlight = function (t, e, i) {
      if (
        ((t = wjcCore.asType(t, SeriesBase, !0)),
        this.selectionMode == SelectionMode.Series)
      ) {
        var r = this.series.indexOf(t),
          n = t.hostElement;
        e
          ? n.parentNode.appendChild(n)
          : n.parentNode.insertBefore(n, n.parentNode.childNodes.item(r));
        s = this._find(n, [
          'rect',
          'ellipse',
          'polyline',
          'polygon',
          'line',
          'path',
        ]);
        this._highlightItems(s, FlexChart._CSS_SELECTION, e),
          t.legendElement &&
            this._highlightItems(
              this._find(t.legendElement, ['rect', 'ellipse', 'line']),
              FlexChart._CSS_SELECTION,
              e
            );
      } else if (this.selectionMode == SelectionMode.Point) {
        var r = this.series.indexOf(t),
          n = t.hostElement;
        if (e) {
          n.parentNode.appendChild(n);
          var o = t.getPlotElement(i);
          if (o) {
            'g' != o.nodeName &&
              this._highlightItems([o], FlexChart._CSS_SELECTION, e);
            s = this._find(o, ['line', 'rect', 'ellipse', 'path', 'polygon']);
            this._highlightItems(s, FlexChart._CSS_SELECTION, e);
          }
        } else {
          n.parentNode.insertBefore(n, n.parentNode.childNodes.item(r));
          var s = this._find(n, ['rect', 'ellipse', 'line', 'path', 'polygon']);
          this._highlightItems(s, FlexChart._CSS_SELECTION, e);
        }
      }
    }),
    (e.prototype._updateAuxAxes = function (t, e) {
      for (var i = 2; i < t.length; i++) {
        var r = t[i];
        r._chart = this;
        for (var n = [], o = 0; o < this.series.length; o++) {
          var s = this.series[o];
          (s.axisX != r && s.axisY != r) || n.push(s);
        }
        for (var a, h, o = 0; o < n.length; o++) {
          var l = n[o].getDataRect() || n[o]._getDataRect();
          l &&
            ((r.axisType == AxisType.X && !e) || (r.axisType == AxisType.Y && e)
              ? ((void 0 === a || l.left < a) && (a = l.left),
                (void 0 === h || l.right > h) && (h = l.right))
              : ((void 0 === a || l.top < a) && (a = l.top),
                (void 0 === h || l.bottom > h) && (h = l.bottom)));
        }
        var c = n[0].getDataType(0);
        null == c && (c = wjcCore.DataType.Number),
          t[i]._updateActualLimits(c, a, h);
      }
    }),
    (e._contains = function (t, e) {
      return (
        !(!t || !e) &&
        e.x >= t.left &&
        e.x <= t.right &&
        e.y >= t.top &&
        e.y <= t.bottom
      );
    }),
    (e._intersects = function (t, e) {
      return !(
        t.left > e.right ||
        t.right < e.left ||
        t.top > e.bottom ||
        t.bottom < e.top
      );
    }),
    (e._toOADate = function (t) {
      return t.valueOf();
    }),
    (e._fromOADate = function (t) {
      return new Date(t);
    }),
    (e._renderText = function (t, e, i, r, n, o, s, a, h) {
      var l = t.measureString(e, o, s, a),
        c = i.x,
        _ = i.y;
      switch (r) {
        case 1:
          c -= 0.5 * l.width;
          break;
        case 2:
          c -= l.width;
      }
      switch (n) {
        case 1:
          _ += 0.5 * l.height;
          break;
        case 0:
          _ += l.height;
      }
      var u = new wjcCore.Rect(c, _ - l.height, l.width, l.height);
      return h
        ? h(u)
          ? (t.drawString(e, new wjcCore.Point(c, _), o, a), u)
          : null
        : (t.drawString(e, new wjcCore.Point(c, _), o, a), u);
    }),
    (e._renderRotatedText = function (t, e, i, r, n, o, s, a, h, l) {
      var c = t.measureString(e, a, h, l),
        _ = i.x,
        u = i.y;
      switch (r) {
        case 1:
          _ -= 0.5 * c.width;
          break;
        case 2:
          _ -= c.width;
      }
      switch (n) {
        case 1:
          u += 0.5 * c.height;
          break;
        case 0:
          u += c.height;
      }
      t.drawStringRotated(e, new wjcCore.Point(_, u), o, s, a, l);
    }),
    (e._CSS_AXIS_X = 'wj-axis-x'),
    (e._CSS_AXIS_Y = 'wj-axis-y'),
    (e._CSS_LINE = 'wj-line'),
    (e._CSS_GRIDLINE = 'wj-gridline'),
    (e._CSS_TICK = 'wj-tick'),
    (e._CSS_GRIDLINE_MINOR = 'wj-gridline-minor'),
    (e._CSS_TICK_MINOR = 'wj-tick-minor'),
    (e._CSS_LABEL = 'wj-label'),
    (e._CSS_LEGEND = 'wj-legend'),
    (e._CSS_HEADER = 'wj-header'),
    (e._CSS_FOOTER = 'wj-footer'),
    (e._CSS_TITLE = 'wj-title'),
    (e._CSS_SELECTION = 'wj-state-selected'),
    (e._CSS_PLOT_AREA = 'wj-plot-area'),
    (e._FG = '#666'),
    (e._epoch = new Date(1899, 11, 30).getTime()),
    (e._msPerDay = 864e5),
    e
  );
})(FlexChartBase);
exports.FlexChartCore = FlexChartCore;
var _AreaDef = (function () {
    function t() {
      (this._axes = new Array()),
        (this.left = 0),
        (this.right = 0),
        (this.top = 0),
        (this.bottom = 0);
    }
    return (
      Object.defineProperty(t.prototype, 'axes', {
        get: function () {
          return this._axes;
        },
        enumerable: !0,
        configurable: !0,
      }),
      t
    );
  })(),
  _DataInfo = (function () {
    function t() {
      (this.stackAbs = {}), (this._xvals = null);
    }
    return (
      (t.prototype.analyse = function (e, i, r, n, o, s) {
        var a = this;
        (this.minY = NaN),
          (this.maxY = NaN),
          (this.minX = NaN),
          (this.maxX = NaN),
          (this.minXp = NaN),
          (this.minYp = NaN),
          (this.dx = 0);
        var h = {},
          l = {},
          c = {};
        if (
          ((this.dataTypeX = null),
          (this.dataTypeY = null),
          (this._xvals = n),
          null != n)
        )
          for (var _ = n.length, u = 0; u < _; u++) {
            P = n[u];
            if (
              ((isNaN(this.minX) || this.minX > P) && (this.minX = P),
              (isNaN(this.maxX) || this.maxX < P) && (this.maxX = P),
              P > 0 &&
                (isNaN(this.minXp) || this.minXp > P) &&
                (this.minXp = P),
              u > 0)
            ) {
              v = Math.abs(P - n[u - 1]);
              !isNaN(v) && (v < this.dx || 0 == this.dx) && (this.dx = v);
            }
          }
        for (u = 0; u < e.length; u++) {
          var p = e[u],
            d = p._getChartType(),
            f = void 0 !== p.chartType,
            g = p.visibility;
          if (g != SeriesVisibility.Hidden && g != SeriesVisibility.Legend) {
            var m,
              y = p.getDataRect();
            y &&
              (!isNaN(this.minX) &&
                this.minX < y.left &&
                ((m = y.right),
                (y.left = this.minX),
                (y.width = m - this.minX)),
              !isNaN(this.maxX) &&
                this.maxX > y.right &&
                (y.width = this.maxX - y.left),
              !isNaN(this.minY) &&
                this.minY < y.top &&
                ((m = y.bottom),
                (y.top = this.minY),
                (y.height = m - this.minY)),
              !isNaN(this.maxY) &&
                this.maxY > y.bottom &&
                (y.height = this.maxY - y.top));
            var b = null;
            if (
              (i
                ? p._isCustomAxisY() || (b = p.getValues(1))
                : p._isCustomAxisX() || (b = p.getValues(1)),
              b)
            ) {
              this.dataTypeX || (this.dataTypeX = p.getDataType(1));
              for (C = 0; C < b.length; C++) {
                S = b[C];
                if (
                  t.isValid(S) &&
                  ((isNaN(this.minX) || this.minX > S) && (this.minX = S),
                  (isNaN(this.maxX) || this.maxX < S) && (this.maxX = S),
                  C > 0 && (!d || d == ChartType.Column || d == ChartType.Bar))
                ) {
                  var v = Math.abs(S - b[C - 1]);
                  !isNaN(v) &&
                    v > 0 &&
                    (v < this.dx || 0 == this.dx) &&
                    (this.dx = v);
                }
              }
            }
            var x = null,
              w = !1;
            if (
              (i
                ? ((w = p._isCustomAxisX()), (x = p.getValues(0)))
                : ((w = p._isCustomAxisY()), (x = p.getValues(0))),
              x &&
                (this.dataTypeY || w || (this.dataTypeY = p.getDataType(0)),
                isNaN(this.minX)
                  ? (this.minX = 0)
                  : b || n || (this.minX = Math.min(this.minX, 0)),
                isNaN(this.maxX)
                  ? (this.maxX = x.length - 1)
                  : b || n || (this.maxX = Math.max(this.maxX, x.length - 1)),
                !w))
            )
              for (var C = 0; C < x.length; C++) {
                var S = x[C],
                  P = b
                    ? wjcCore.asNumber(b[C], !0)
                    : n
                    ? wjcCore.asNumber(n[C], !0)
                    : C;
                wjcCore.isArray(S)
                  ? S.forEach(function (t) {
                      a._parseYVal(t, P, f, c, h, l);
                    })
                  : this._parseYVal(S, P, f, c, h, l);
              }
            var T = p.getDataRect(
              new wjcCore.Rect(
                this.minX,
                this.minY,
                this.maxX - this.minX,
                this.maxY - this.minY
              ),
              y
            );
            T &&
              ((this.minX = T.left),
              (this.maxX = T.right),
              (this.minY = T.top),
              (this.maxY = T.bottom));
          }
        }
        if (r == Stacking.Stacked) {
          for (var M in h) h[M] > this.maxY && (this.maxY = h[M]);
          for (var M in l) l[M] < this.minY && (this.minY = l[M]);
        } else if (r == Stacking.Stacked100pc) {
          (this.minY = 0), (this.maxY = 1);
          for (var M in c) {
            var j = c[M];
            if (isFinite(j) && 0 != j) {
              var A = h[M],
                L = l[M];
              isFinite(A) && (A = Math.min(A / j, this.maxY)),
                isFinite(L) && (L = Math.max(L / j, this.minY));
            }
          }
        }
        (this.stackAbs = c),
          o &&
            (i
              ? (this.minY = isNaN(this.minYp) ? 1 : this.minYp)
              : (this.minX = isNaN(this.minXp) ? 1 : this.minXp)),
          s &&
            (i
              ? (this.minX = isNaN(this.minXp) ? 1 : this.minXp)
              : (this.minY = isNaN(this.minYp) ? 1 : this.minYp));
      }),
      (t.prototype._parseYVal = function (e, i, r, n, o, s) {
        t.isValid(e) &&
          (null != e && (isNaN(this.minY) || this.minY > e) && (this.minY = e),
          null != e && (isNaN(this.maxY) || this.maxY < e) && (this.maxY = e),
          e > 0 && (isNaN(this.minYp) || this.minYp > e) && (this.minYp = e),
          r ||
            (e > 0
              ? isNaN(o[i])
                ? (o[i] = e)
                : (o[i] += e)
              : isNaN(s[i])
              ? (s[i] = e)
              : (s[i] += e),
            isNaN(n[i]) ? (n[i] = Math.abs(e)) : (n[i] += Math.abs(e))));
      }),
      (t.prototype.getMinY = function () {
        return this.minY;
      }),
      (t.prototype.getMaxY = function () {
        return this.maxY;
      }),
      (t.prototype.getMinX = function () {
        return this.minX;
      }),
      (t.prototype.getMaxX = function () {
        return this.maxX;
      }),
      (t.prototype.getMinXp = function () {
        return this.minXp;
      }),
      (t.prototype.getMinYp = function () {
        return this.minYp;
      }),
      (t.prototype.getDeltaX = function () {
        return this.dx;
      }),
      (t.prototype.getDataTypeX = function () {
        return this.dataTypeX;
      }),
      (t.prototype.getDataTypeY = function () {
        return this.dataTypeY;
      }),
      (t.prototype.getStackedAbsSum = function (t) {
        var e = this.stackAbs[t];
        return isFinite(e) ? e : 0;
      }),
      (t.prototype.getXVals = function () {
        return this._xvals;
      }),
      (t.isValid = function (t) {
        return isFinite(t);
      }),
      t
    );
  })();
exports._DataInfo = _DataInfo;
var ChartTooltip = (function (t) {
  function e() {
    var e = t.call(this) || this;
    return (
      (e._content = '<b>{seriesName}</b><br/>{x} {y}'), (e._threshold = 15), e
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'content', {
      get: function () {
        return this._content;
      },
      set: function (t) {
        t != this._content && (this._content = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'threshold', {
      get: function () {
        return this._threshold;
      },
      set: function (t) {
        t != this._threshold && (this._threshold = wjcCore.asNumber(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(wjcCore.Tooltip);
exports.ChartTooltip = ChartTooltip;
var ChartType;
!(function (t) {
  (t[(t.Column = 0)] = 'Column'),
    (t[(t.Bar = 1)] = 'Bar'),
    (t[(t.Scatter = 2)] = 'Scatter'),
    (t[(t.Line = 3)] = 'Line'),
    (t[(t.LineSymbols = 4)] = 'LineSymbols'),
    (t[(t.Area = 5)] = 'Area'),
    (t[(t.Bubble = 6)] = 'Bubble'),
    (t[(t.Candlestick = 7)] = 'Candlestick'),
    (t[(t.HighLowOpenClose = 8)] = 'HighLowOpenClose'),
    (t[(t.Spline = 9)] = 'Spline'),
    (t[(t.SplineSymbols = 10)] = 'SplineSymbols'),
    (t[(t.SplineArea = 11)] = 'SplineArea'),
    (t[(t.Funnel = 12)] = 'Funnel');
})((ChartType = exports.ChartType || (exports.ChartType = {})));
var FlexChart = (function (t) {
  function e(e, i) {
    var r = t.call(this, e, null) || this;
    return (r._chartType = ChartType.Column), r.initialize(i), r;
  }
  return (
    __extends(e, t),
    (e.prototype._getChartType = function () {
      return this._chartType;
    }),
    Object.defineProperty(e.prototype, 'chartType', {
      get: function () {
        return this._chartType;
      },
      set: function (t) {
        t != this._chartType &&
          ((this._chartType = wjcCore.asEnum(t, ChartType)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'rotated', {
      get: function () {
        return this._rotated;
      },
      set: function (t) {
        t != this._rotated &&
          ((this._rotated = wjcCore.asBoolean(t)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'stacking', {
      get: function () {
        return this._stacking;
      },
      set: function (t) {
        t != this._stacking &&
          ((this._stacking = wjcCore.asEnum(t, Stacking)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'options', {
      get: function () {
        return this._options;
      },
      set: function (t) {
        t != this._options && ((this._options = t), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(FlexChartCore);
exports.FlexChart = FlexChart;
var Position;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Left = 1)] = 'Left'),
    (t[(t.Top = 2)] = 'Top'),
    (t[(t.Right = 3)] = 'Right'),
    (t[(t.Bottom = 4)] = 'Bottom'),
    (t[(t.Auto = 5)] = 'Auto');
})((Position = exports.Position || (exports.Position = {})));
var AxisType;
!(function (t) {
  (t[(t.X = 0)] = 'X'), (t[(t.Y = 1)] = 'Y');
})((AxisType = exports.AxisType || (exports.AxisType = {})));
var OverlappingLabels;
!(function (t) {
  (t[(t.Auto = 0)] = 'Auto'), (t[(t.Show = 1)] = 'Show');
})(
  (OverlappingLabels =
    exports.OverlappingLabels || (exports.OverlappingLabels = {}))
);
var TickMark;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Outside = 1)] = 'Outside'),
    (t[(t.Inside = 2)] = 'Inside'),
    (t[(t.Cross = 3)] = 'Cross');
})((TickMark = exports.TickMark || (exports.TickMark = {})));
var Axis = (function () {
  function t(e) {
    (this._GRIDLINE_WIDTH = 1),
      (this._LINE_WIDTH = 1),
      (this._TICK_WIDTH = 1),
      (this._TICK_HEIGHT = 4),
      (this._TICK_OVERLAP = 1),
      (this._TICK_LABEL_DISTANCE = 4),
      (this._minorGrid = !1),
      (this._labels = !0),
      (this._axisLine = !0),
      (this._isTimeAxis = !1),
      (this._labelPadding = 5),
      (this.rangeChanged = new wjcCore.Event()),
      (this._customConvert = null),
      (this._customConvertBack = null),
      (this.__uniqueId = t._id++),
      (this._position = e),
      e == Position.Bottom || e == Position.Top
        ? (this._axisType = AxisType.X)
        : ((this._axisType = AxisType.Y), (this._axisLine = !1)),
      (this._minorTickMarks = TickMark.None),
      (this._overlap = OverlappingLabels.Auto);
  }
  return (
    Object.defineProperty(t.prototype, 'hostElement', {
      get: function () {
        return this._hostElement;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'actualMin', {
      get: function () {
        return this._isTimeAxis ? new Date(this._actualMin) : this._actualMin;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'actualMax', {
      get: function () {
        return this._isTimeAxis ? new Date(this._actualMax) : this._actualMax;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'min', {
      get: function () {
        return this._min;
      },
      set: function (t) {
        t != this._min &&
          (wjcCore.isDate(t)
            ? (this._min = wjcCore.asDate(t, !0))
            : (this._min = wjcCore.asNumber(t, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'max', {
      get: function () {
        return this._max;
      },
      set: function (t) {
        t != this._max &&
          (wjcCore.isDate(t)
            ? (this._max = wjcCore.asDate(t, !0))
            : (this._max = wjcCore.asNumber(t, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'reversed', {
      get: function () {
        return this._reversed;
      },
      set: function (t) {
        this._reversed != t &&
          ((this._reversed = wjcCore.asBoolean(t)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'position', {
      get: function () {
        return this._position;
      },
      set: function (t) {
        t != this._position &&
          ((this._position = wjcCore.asEnum(t, Position, !1)),
          this._position == Position.Bottom || this._position == Position.Top
            ? (this._axisType = AxisType.X)
            : (this._position != Position.Left &&
                this._position != Position.Right) ||
              (this._axisType = AxisType.Y),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'majorUnit', {
      get: function () {
        return this._majorUnit;
      },
      set: function (t) {
        t != this._majorUnit &&
          ((this._majorUnit = wjcCore.asNumber(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'minorUnit', {
      get: function () {
        return this._minorUnit;
      },
      set: function (t) {
        t != this._minorUnit &&
          ((this._minorUnit = wjcCore.asNumber(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'name', {
      get: function () {
        return this._name;
      },
      set: function (t) {
        t != this._name && (this._name = wjcCore.asString(t, !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'title', {
      get: function () {
        return this._title;
      },
      set: function (t) {
        t != this._title &&
          ((this._title = wjcCore.asString(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'format', {
      get: function () {
        return this._format;
      },
      set: function (t) {
        t != this._format &&
          ((this._format = wjcCore.asString(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'majorGrid', {
      get: function () {
        return this._majorGrid;
      },
      set: function (t) {
        t != this._majorGrid &&
          ((this._majorGrid = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'majorTickMarks', {
      get: function () {
        return this._majorTickMarks;
      },
      set: function (t) {
        t != this._majorTickMarks &&
          ((this._majorTickMarks = wjcCore.asEnum(t, TickMark, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'minorGrid', {
      get: function () {
        return this._minorGrid;
      },
      set: function (t) {
        t != this._minorGrid &&
          ((this._minorGrid = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'minorTickMarks', {
      get: function () {
        return this._minorTickMarks;
      },
      set: function (t) {
        t != this._minorTickMarks &&
          ((this._minorTickMarks = wjcCore.asEnum(t, TickMark, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'axisLine', {
      get: function () {
        return this._axisLine;
      },
      set: function (t) {
        t != this._axisLine &&
          ((this._axisLine = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'labels', {
      get: function () {
        return this._labels;
      },
      set: function (t) {
        t != this._labels &&
          ((this._labels = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'labelAlign', {
      get: function () {
        return this._labelAlign;
      },
      set: function (t) {
        t != this._labelAlign &&
          ((this._labelAlign = wjcCore.asString(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'labelAngle', {
      get: function () {
        return this._labelAngle;
      },
      set: function (t) {
        t != this._labelAngle &&
          ((this._labelAngle = wjcCore.asNumber(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'origin', {
      get: function () {
        return this._origin;
      },
      set: function (t) {
        t != this._origin &&
          ((this._origin = wjcCore.asNumber(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'overlappingLabels', {
      get: function () {
        return this._overlap;
      },
      set: function (t) {
        t != this._overlap &&
          ((this._overlap = wjcCore.asEnum(t, OverlappingLabels, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemsSource', {
      get: function () {
        return this._items;
      },
      set: function (t) {
        this._items != t &&
          (this._cv &&
            (this._cv.collectionChanged.removeHandler(
              this._cvCollectionChanged,
              this
            ),
            (this._cv = null)),
          (this._items = t),
          (this._cv = wjcCore.asCollectionView(t)),
          null != this._cv &&
            this._cv.collectionChanged.addHandler(
              this._cvCollectionChanged,
              this
            ));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'binding', {
      get: function () {
        return this._binding;
      },
      set: function (t) {
        t != this._binding &&
          ((this._binding = wjcCore.asString(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemFormatter', {
      get: function () {
        return this._ifmt;
      },
      set: function (t) {
        this._ifmt != t &&
          ((this._ifmt = wjcCore.asFunction(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'logBase', {
      get: function () {
        return this._logBase;
      },
      set: function (t) {
        t != this._logBase &&
          ((this._logBase = wjcCore.asNumber(t, !0, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'plotArea', {
      get: function () {
        return this._parea;
      },
      set: function (t) {
        t != this._parea &&
          ((this._parea = wjcCore.asType(t, PlotArea, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'labelPadding', {
      get: function () {
        return this._labelPadding;
      },
      set: function (t) {
        t != this._labelPadding &&
          ((this._labelPadding = wjcCore.asNumber(t, !0, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_groupClass', {
      get: function () {
        return this.axisType === AxisType.X
          ? FlexChartCore._CSS_AXIS_X
          : FlexChartCore._CSS_AXIS_Y;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onRangeChanged = function (t) {
      this.rangeChanged.raise(this, t);
    }),
    (t.prototype._getPosition = function () {
      if (this.axisType == AxisType.X) {
        if (this.position == Position.Auto) return Position.Bottom;
      } else if (this.axisType == AxisType.Y && this.position == Position.Auto)
        return Position.Left;
      return this.position;
    }),
    (t.prototype._isOverlapped = function (t, e, i, r) {
      var n = this._lbls;
      if (null != n && n.length > 1)
        for (
          var o = n.length,
            s = this._values && this._values.length == o ? this._values : null,
            a = 0,
            h = 0,
            l = 0;
          l < o;
          l++
        ) {
          var c = s ? s[l] : l;
          if (c >= this._actualMin && c <= this._actualMax) {
            var _ =
                (e * (c - this._actualMin)) /
                (this._actualMax - this._actualMin),
              u = t.measureString(n[l], i, this._groupClass);
            if (this.axisType == AxisType.X) {
              if (l > 0 && Math.abs(_ - a) < Math.max(u.width, h) + 12)
                return !0;
              (a = _), (h = u.width);
            } else this.axisType, AxisType.Y;
          }
        }
      return !1;
    }),
    (t.prototype._getHeight = function (t, e) {
      this._actualAngle = null;
      var i = FlexChart._CSS_LABEL,
        r = FlexChart._CSS_TITLE,
        n = this._actualMax - this._actualMin,
        o = this._nicePrecision(n);
      (o < 0 || o > 15) && (o = 0);
      var s = 0.1 * n,
        a = this._lbls,
        h = this.labelAngle;
      if (this.labels && this._chart._getChartType() !== ChartType.Funnel) {
        if (((s = this._updateAutoFormat(s)), null != a && a.length > 0)) {
          var l = a.length,
            c = this._values && this._values.length == l ? this._values : null;
          this._annoSize = new wjcCore.Size();
          for (var _ = 0; _ < l; _++) {
            var u = c ? c[_] : _;
            if (u >= this._actualMin && u <= this._actualMax) {
              d = t.measureString(a[_], i, this._groupClass);
              this.axisType,
                AxisType.X,
                d.width > this._annoSize.width &&
                  (this._annoSize.width = d.width),
                d.height > this._annoSize.height &&
                  (this._annoSize.height = d.height);
            }
          }
          null == h &&
            (this._isOverlapped(t, e, i, this.axisType)
              ? (h = this._actualAngle = -45)
              : (this._actualAngle = 0));
        } else {
          var p = this._formatValue(this._actualMin - s),
            d = t.measureString(p, i, this._groupClass);
          (this._annoSize = d),
            (p = this._formatValue(this._actualMax + s)),
            (d = t.measureString(p, i, this._groupClass)).width >
              this._annoSize.width && (this._annoSize.width = d.width),
            d.height > this._annoSize.height &&
              (this._annoSize.height = d.height);
        }
        if (h) {
          h > 90 ? (h = 90) : h < -90 && (h = -90);
          var f = (h * Math.PI) / 180,
            g = this._annoSize.width,
            m = this._annoSize.height;
          (this._annoSize.width =
            g * Math.abs(Math.cos(f)) + m * Math.abs(Math.sin(f))),
            (this._annoSize.height =
              g * Math.abs(Math.sin(f)) + m * Math.abs(Math.cos(f)));
        }
      } else this._annoSize = new wjcCore.Size();
      m = 2 * (this._labelPadding || 5);
      this._axisType == AxisType.X
        ? (m += this._annoSize.height)
        : (m += this._annoSize.width + this._TICK_LABEL_DISTANCE + 2);
      var y = this._TICK_HEIGHT,
        b = this._TICK_OVERLAP;
      v == TickMark.Outside
        ? (b = 1)
        : v == TickMark.Inside
        ? (b = -1)
        : v == TickMark.Cross && (b = 0);
      var v = this.majorTickMarks;
      return (
        null == v && (v = TickMark.Outside),
        v != TickMark.None && (m += 0.5 * (1 + b) * y),
        this._title &&
          ((p = this._title),
          (this._szTitle = t.measureString(p, r, this._groupClass)),
          (m += this._szTitle.height)),
        (t.fontSize = null),
        m
      );
    }),
    (t.prototype._updateAutoFormat = function (t) {
      if (this._isTimeAxis) {
        var e = this.format,
          i = (0.001 * (this._actualMax - this._actualMin)) / 10,
          r = new _timeSpan(i * _timeSpan.TicksPerSecond),
          n = wjcCore.isNumber(this._majorUnit)
            ? _timeSpan.fromDays(this._majorUnit)
            : _timeHelper.NiceTimeSpan(r, e);
        e ||
          (this._tfmt = _timeHelper.GetTimeDefaultFormat(
            1e3 * n.TotalSeconds,
            0
          )),
          (t = n.TotalSeconds);
      }
      return t;
    }),
    (t.prototype._updateActualLimitsByChartType = function (t, e, i) {
      if (t && t.length > 0 && !this._isTimeAxis) {
        var r = this._chart._getChartType();
        r != ChartType.Column && r != ChartType.Bar && ((e -= 0.5), (i += 0.5));
      }
      return { min: e, max: i };
    }),
    (t.prototype._updateActualLimits = function (t, e, i, r, n) {
      void 0 === r && (r = null), void 0 === n && (n = null);
      var o = this._actualMin,
        s = this._actualMax;
      this._isTimeAxis = t == wjcCore.DataType.Date;
      var a = this._updateActualLimitsByChartType(r, e, i);
      (e = a.min), (i = a.max);
      var h = this._min,
        l = this._max;
      if (
        (wjcCore.isDate(h) && (h = h.valueOf()),
        wjcCore.isDate(l) && (l = l.valueOf()),
        (this._actualMin =
          null != h &&
          this._chart &&
          this._chart._stacking !== Stacking.Stacked100pc
            ? h
            : e),
        (this._actualMax =
          null != l &&
          this._chart &&
          this._chart._stacking !== Stacking.Stacked100pc
            ? l
            : i),
        this._actualMin == this._actualMax &&
          ((this._actualMin -= 0.5), (this._actualMax += 0.5)),
        this.logBase > 0)
      ) {
        var c = this.logBase,
          _ = Math.log(c);
        if (!this._max) {
          var u = Math.ceil(Math.log(this._actualMax) / _);
          this._actualMax = Math.pow(c, u);
        }
        if (!this._min) {
          var p = Math.floor(Math.log(this._actualMin) / _);
          this._actualMin = Math.pow(c, p);
        }
        (this._actualMin <= 0 || !wjcCore.isNumber(this._actualMin)) &&
          (this._actualMin = 1),
          this._actualMax < this._actualMin &&
            (this._actualMax = this._actualMin + 1);
      }
      if (
        (((o != this._actualMin &&
          (wjcCore.isNumber(o) || wjcCore.isNumber(this._actualMin))) ||
          (s != this._actualMax &&
            (wjcCore.isNumber(s) || wjcCore.isNumber(this._actualMax)))) &&
          this.onRangeChanged(),
        this._items)
      ) {
        (this._values = []), (this._lbls = []);
        var d = this._items.length,
          f = 'value',
          g = 'text';
        if (this.binding) {
          var m = this.binding.split(',');
          2 == m.length && ((f = m[0]), (g = m[1]));
        }
        for (var y = 0; y < d; y++) {
          var b = this._items[y],
            v = b[f];
          wjcCore.isNumber(v) && (this._values.push(v), this._lbls.push(b[g]));
        }
      } else (this._lbls = r), (this._values = n);
    }),
    (t.prototype._layout = function (t, e) {
      var i = this.axisType == AxisType.Y;
      (this._plotrect = e),
        (this._axrect = i
          ? new wjcCore.Rect(t.left, t.top, t.height, t.width)
          : t);
    }),
    (t.prototype._hasVisibileSeries = function () {
      for (var t, e = this._chart.series, i = 0, r = e.length; i < r; i++)
        if (
          (t = e[i].visibility) == SeriesVisibility.Plot ||
          t == SeriesVisibility.Visible
        )
          return !0;
      return !1;
    }),
    (t.prototype._render = function (e) {
      if (this.position != Position.None && this._hasVisibileSeries()) {
        this._vals = {};
        var i = 0;
        this.labelAngle &&
          ((i = this.labelAngle) > 90 ? (i = 90) : i < -90 && (i = -90)),
          null == this.labelAngle &&
            null != this._actualAngle &&
            (i = this._actualAngle);
        var r = FlexChart._FG,
          n = this._actualMax - this._actualMin;
        if (wjcCore.isNumber(n)) {
          var o = this._calcMajorUnit();
          0 == o && (o = 0.1 * this._niceTickNumber(n));
          var s = Math.min(t.MAX_MAJOR, Math.floor(n / o) + 1),
            a = [],
            h = [];
          (this._rects = []), (this._vals.major = a), (this._vals.hasLbls = []);
          var l = Math.floor(this._actualMin / o) * o;
          l < this._actualMin && (l += o);
          var c = !1;
          if (this._lbls && this._lbls.length > 0)
            if (((h = this._lbls), 0 == this._values.length)) {
              c = !0;
              for (g = 0; g < h.length; g++) a.push(g);
            } else a = this._values;
          else
            this._isTimeAxis
              ? this._createTimeLabels(l, s, a, h)
              : this.logBase
              ? this._createLogarithmicLabels(
                  this._actualMin,
                  this._actualMax,
                  this.majorUnit,
                  a,
                  h,
                  !0
                )
              : this._createLabels(l, s, o, a, h);
          (s = Math.min(a.length, h.length)), (e.textFill = r);
          var _ = this._TICK_HEIGHT,
            u = this._TICK_OVERLAP,
            p = this.majorTickMarks;
          null == p && (p = TickMark.Outside),
            p == TickMark.Outside
              ? (u = 1)
              : p == TickMark.Inside
              ? (u = -1)
              : p == TickMark.Cross && (u = 0);
          for (
            var d = 0.5 * (u - 1) * _, f = 0.5 * (1 + u) * _, g = 0;
            g < s;
            g++
          ) {
            var m = !0,
              y = a[g],
              b = h[g],
              v = this.labels;
            if (
              (v &&
                (c || this.itemsSource) &&
                this.majorUnit &&
                g % this.majorUnit != 0 &&
                (v = !1),
              y >= this._actualMin && y <= this._actualMax)
            ) {
              var x = e.textFill;
              (m = this._renderLabelsAndTicks(e, g, y, b, i, p, v, d, f)),
                (e.textFill = x);
            }
            this._vals.hasLbls.push(m);
          }
        }
        (this.minorGrid || this.minorTickMarks != TickMark.None) &&
          this._renderMinor(e, a, c),
          (e.stroke = r),
          (e.fontSize = null),
          this._renderLineAndTitle(e),
          (e.stroke = null),
          (e.fontSize = null),
          (e.textFill = null),
          (e.strokeWidth = null);
      }
    }),
    (t.prototype._renderLineAndTitle = function (t) {
      var e = this._getPosition(),
        i = this.axisType == AxisType.Y,
        r = e != Position.Top && e != Position.Right,
        n = FlexChart._CSS_TITLE,
        o = FlexChart._CSS_LINE;
      if (i)
        if (r) {
          if (this._title) {
            s = new wjcCore.Point(
              this._axrect.left + 0.5 * this._szTitle.height,
              this._axrect.top + 0.5 * this._axrect.height
            );
            FlexChart._renderRotatedText(
              t,
              this._title,
              s,
              1,
              1,
              s,
              -90,
              n,
              this._groupClass
            );
          }
          this.axisLine &&
            t.drawLine(
              this._axrect.right,
              this._axrect.top,
              this._axrect.right,
              this._axrect.bottom,
              o
            );
        } else {
          if (this._title) {
            var s = new wjcCore.Point(
              this._axrect.right - 0.5 * this._szTitle.height,
              this._axrect.top + 0.5 * this._axrect.height
            );
            FlexChart._renderRotatedText(
              t,
              this._title,
              s,
              1,
              1,
              s,
              90,
              n,
              this._groupClass
            );
          }
          this.axisLine &&
            t.drawLine(
              this._axrect.left,
              this._axrect.top,
              this._axrect.left,
              this._axrect.bottom,
              o
            );
        }
      else
        r
          ? (this.axisLine &&
              t.drawLine(
                this._axrect.left,
                this._axrect.top,
                this._axrect.right,
                this._axrect.top,
                o
              ),
            this._title &&
              FlexChart._renderText(
                t,
                this._title,
                new wjcCore.Point(
                  this._axrect.left + 0.5 * this._axrect.width,
                  this._axrect.bottom
                ),
                1,
                2,
                n
              ))
          : (this.axisLine &&
              t.drawLine(
                this._axrect.left,
                this._axrect.bottom,
                this._axrect.right,
                this._axrect.bottom,
                o
              ),
            this._title &&
              FlexChart._renderText(
                t,
                this._title,
                new wjcCore.Point(
                  this._axrect.left + 0.5 * this._axrect.width,
                  this._axrect.top
                ),
                1,
                0,
                n
              ));
    }),
    (t.prototype._renderMinor = function (t, e, i) {
      var r = this._getPosition(),
        n = this.axisType == AxisType.Y,
        o = r != Position.Top && r != Position.Right;
      if (this.logBase) {
        if (this.minorUnit > 0) {
          var s = [];
          this._createLogarithmicLabels(
            this._actualMin,
            this._actualMax,
            this.minorUnit,
            s,
            null,
            !1
          );
          for (var a = [], h = 0; h < s.length; h++) {
            var l = s[h];
            -1 == e.indexOf(l) && l > this._actualMin && a.push(l);
          }
          this._renderMinors(t, a, n, o);
        }
      } else this._createMinors(t, e, n, o, i);
    }),
    (t.prototype._renderRotatedText = function (
      t,
      e,
      i,
      r,
      n,
      o,
      s,
      a,
      h,
      l,
      c
    ) {
      if (this.itemFormatter) {
        var _ = this._getFormattedItem(t, e, i, r, h);
        _ ? ((i = _.text), (h = _.cls)) : (i = null);
      }
      FlexChart._renderRotatedText(t, i, r, n, o, s, a, h, l, c);
    }),
    (t.prototype._getFormattedItem = function (t, e, i, r, n) {
      if (this.itemFormatter) {
        var o = r.clone();
        this.axisType == AxisType.X
          ? this.position == Position.Top
            ? (o.y = this._plotrect.top)
            : (o.y = this._plotrect.bottom)
          : this.position == Position.Right
          ? (o.x = this._plotrect.right)
          : (o.x = this._plotrect.left);
        var s = { val: e, text: i, pos: o, cls: n };
        return (s = this.itemFormatter(t, s));
      }
    }),
    (t.prototype._renderLabelsAndTicks = function (t, e, i, r, n, o, s, a, h) {
      var l = this._getPosition(),
        c = !0,
        _ = this.axisType == AxisType.Y,
        u = l != Position.Top && l != Position.Right,
        p = this.labelPadding || 5,
        d = this._TICK_WIDTH,
        f = this._getLabelAlign(_),
        g = FlexChart._CSS_LABEL,
        m = FlexChart._CSS_GRIDLINE,
        y = FlexChart._CSS_TICK,
        b = FlexChart._FG,
        v = FlexChart._FG,
        x = this._GRIDLINE_WIDTH,
        w = i != this._actualMin && this.majorGrid;
      if (_) {
        var C = this.convert(i);
        if (
          (w &&
            ((t.stroke = b),
            (t.strokeWidth = x),
            t.drawLine(this._plotrect.left, C, this._plotrect.right, C, m)),
          (t.stroke = v),
          (t.strokeWidth = d),
          u)
        ) {
          if (
            (o != TickMark.None &&
              t.drawLine(
                this._axrect.right - a,
                C,
                this._axrect.right - h,
                C,
                y
              ),
            s)
          ) {
            P = new wjcCore.Point(
              this._axrect.right - h - this._TICK_LABEL_DISTANCE - p,
              C
            );
            n > 0
              ? 90 == n
                ? this._renderRotatedText(
                    t,
                    i,
                    r,
                    P,
                    1,
                    0,
                    P,
                    n,
                    g,
                    this._groupClass
                  )
                : this._renderRotatedText(
                    t,
                    i,
                    r,
                    P,
                    2,
                    1,
                    P,
                    n,
                    g,
                    this._groupClass
                  )
              : n < 0
              ? -90 == n
                ? this._renderRotatedText(
                    t,
                    i,
                    r,
                    P,
                    1,
                    2,
                    P,
                    n,
                    g,
                    this._groupClass
                  )
                : this._renderRotatedText(
                    t,
                    i,
                    r,
                    P,
                    2,
                    1,
                    P,
                    n,
                    g,
                    this._groupClass
                  )
              : this._renderLabel(t, i, r, P, 2, f, g);
          }
        } else if (
          (o != TickMark.None &&
            t.drawLine(this._axrect.left + a, C, this._axrect.left + h, C, y),
          s)
        ) {
          P = new wjcCore.Point(
            this._axrect.left + h + this._TICK_LABEL_DISTANCE + p,
            C
          );
          n > 0
            ? 90 == n
              ? this._renderRotatedText(
                  t,
                  i,
                  r,
                  P,
                  1,
                  2,
                  P,
                  n,
                  g,
                  this._groupClass
                )
              : this._renderRotatedText(
                  t,
                  i,
                  r,
                  P,
                  0,
                  1,
                  P,
                  n,
                  g,
                  this._groupClass
                )
            : n < 0
            ? -90 == n
              ? this._renderRotatedText(
                  t,
                  i,
                  r,
                  P,
                  1,
                  0,
                  P,
                  n,
                  g,
                  this._groupClass
                )
              : this._renderRotatedText(
                  t,
                  i,
                  r,
                  P,
                  0,
                  1,
                  P,
                  n,
                  g,
                  this._groupClass
                )
            : this._renderLabel(t, i, r, P, 0, f, g);
        }
      } else {
        var S = this.convert(i);
        if (
          (this.overlappingLabels == OverlappingLabels.Auto &&
            this._xCross(S) &&
            (s = !1),
          w &&
            ((t.stroke = b),
            (t.strokeWidth = x),
            t.drawLine(S, this._plotrect.top, S, this._plotrect.bottom, m)),
          (t.stroke = v),
          (t.strokeWidth = d),
          u)
        ) {
          if (((c = !1), s)) {
            P = new wjcCore.Point(S, this._axrect.top + h + p);
            c =
              0 != n
                ? this._renderRotatedLabel(t, i, r, P, f, n, g, u)
                : this._renderLabel(t, i, r, P, f, 0, g);
          }
          o != TickMark.None &&
            c &&
            ((S = this.convert(i)),
            t.drawLine(S, this._axrect.top + a, S, this._axrect.top + h, y));
        } else {
          if (s) {
            var P = new wjcCore.Point(S, this._axrect.bottom - h - p);
            c =
              0 != n
                ? this._renderRotatedLabel(t, i, r, P, f, n, g, u)
                : this._renderLabel(t, i, r, P, f, 2, g);
          }
          o != TickMark.None &&
            ((S = this.convert(i)),
            t.drawLine(
              S,
              this._axrect.bottom - a,
              S,
              this._axrect.bottom - h,
              y
            ));
        }
      }
      return c;
    }),
    (t.prototype._xCross = function (t) {
      for (var e = this._rects.length, i = 0; i < e; i++) {
        var r = this._rects[i];
        if (t >= r.left && t <= r.right) return !0;
      }
      return !1;
    }),
    (t.prototype._createMinors = function (e, i, r, n, o) {
      if (i && i.length > 1) {
        for (
          var s = this.majorUnit
              ? this._isTimeAxis
                ? 24 * this.majorUnit * 3600 * 1e3
                : this.majorUnit
              : i[1] - i[0],
            a = wjcCore.isNumber(this.minorUnit)
              ? this._isTimeAxis
                ? 24 * this.minorUnit * 3600 * 1e3
                : this.minorUnit
              : 0.5 * s,
            h = [],
            l = i[0];
          l > this._actualMin && h.length < t.MAX_MINOR;
          l -= a
        )
          -1 == i.indexOf(l) && h.push(l);
        for (
          l = i[0] + a;
          l < this._actualMax && h.length < t.MAX_MINOR;
          l += a
        )
          -1 == i.indexOf(l)
            ? h.push(l)
            : o && this.majorUnit && l % this.majorUnit != 0 && h.push(l);
        this._renderMinors(e, h, r, n);
      }
    }),
    (t.prototype._renderMinors = function (t, e, i, r) {
      var n = this._TICK_HEIGHT,
        o = this._TICK_WIDTH,
        s = this._TICK_OVERLAP,
        a = FlexChart._FG,
        h = this.minorTickMarks,
        l = !0;
      (this._vals.minor = e),
        h == TickMark.Outside
          ? (s = 1)
          : h == TickMark.Inside
          ? (s = -1)
          : h == TickMark.Cross
          ? (s = 0)
          : (l = !1);
      for (
        var c = 0.5 * (s - 1) * n,
          _ = 0.5 * (1 + s) * n,
          u = e ? e.length : 0,
          p = this.minorGrid,
          d = this._plotrect,
          f = this._GRIDLINE_WIDTH,
          g = FlexChart._FG,
          m = FlexChart._CSS_GRIDLINE_MINOR,
          y = FlexChart._CSS_TICK_MINOR,
          b = 0;
        b < u;
        b++
      )
        if (e[b] >= this.actualMin && e[b] <= this.actualMax)
          if (i) {
            var v = this.convert(e[b]);
            l &&
              ((t.stroke = a),
              (t.strokeWidth = o),
              r
                ? t.drawLine(
                    this._axrect.right - c,
                    v,
                    this._axrect.right - _,
                    v,
                    y
                  )
                : t.drawLine(
                    this._axrect.left + c,
                    v,
                    this._axrect.left + _,
                    v,
                    y
                  )),
              p &&
                ((t.stroke = g),
                (t.strokeWidth = f),
                t.drawLine(d.left, v, d.right, v, m));
          } else {
            var x = this.convert(e[b]);
            l &&
              ((t.stroke = a),
              (t.strokeWidth = o),
              r
                ? t.drawLine(
                    x,
                    this._axrect.top + c,
                    x,
                    this._axrect.top + _,
                    y
                  )
                : t.drawLine(
                    x,
                    this._axrect.bottom - c,
                    x,
                    this._axrect.bottom - _,
                    y
                  )),
              p &&
                ((t.stroke = g),
                (t.strokeWidth = f),
                t.drawLine(x, d.top, x, d.bottom, m));
          }
    }),
    (t.prototype._renderLabel = function (t, e, i, r, n, o, s) {
      var a = !1;
      if (this.itemFormatter) {
        var h = this._getFormattedItem(t, e, i, r, s);
        h ? ((i = h.text), (s = h.cls)) : (i = null);
      }
      if (i) {
        var l = this._rects,
          c =
            this.overlappingLabels == OverlappingLabels.Auto &&
            !wjcCore.isNumber(this._actualAngle),
          _ = FlexChart._renderText(
            t,
            i,
            r,
            n,
            o,
            s,
            this._groupClass,
            null,
            function (t) {
              if (c)
                for (var e = l.length, i = 0; i < e; i++)
                  if (FlexChart._intersects(l[i], t)) return !1;
              return !0;
            }
          );
        _ && ((_.left += 4), (_.width += 8), l.push(_), (a = !0));
      }
      return a;
    }),
    (t.prototype._renderRotatedLabel = function (t, e, i, r, n, o, s, a) {
      if (this.itemFormatter) {
        var h = this._getFormattedItem(t, e, i, r, s);
        h ? ((i = h.text), (s = h.cls)) : (i = null);
      }
      if (i) {
        var l = t.measureString(i, s, this._groupClass),
          c = 0.5 * l.height,
          _ = 0.5 * l.width * Math.abs(Math.sin((o * Math.PI) / 180)),
          u = 0.5 * l.width,
          p =
            0.5 *
            (l.width * Math.abs(Math.cos((o * Math.PI) / 180)) +
              l.height * Math.abs(Math.sin((o * Math.PI) / 180))),
          d = new wjcCore.Point(r.x, r.y),
          f = new wjcCore.Point(r.x, r.y);
        this.labelAlign ||
          (n = 90 == o || -90 == o ? 1 : a ? (o > 0 ? 0 : 2) : o > 0 ? 2 : 0),
          a
            ? ((r.y += c + _), (d.y += c + _ - 0.5 * l.height))
            : ((r.y -= c + _ - l.height), (d.y -= c + _ - 0.5 * l.height));
        var g = 0;
        2 === n
          ? ((d.x -= p), (r.x -= u + p), (g = d.x + p - l.height - 2))
          : 0 === n
          ? ((d.x += p), (r.x -= u - p), (g = d.x - p))
          : ((r.x -= u), (g = d.x - l.height / 2));
        var m = new wjcCore.Rect(g, f.y, l.height + 2, l.width),
          y = this._rects;
        if (this.overlappingLabels == OverlappingLabels.Auto)
          for (var b = y.length, v = 0; v < b; v++)
            if (FlexChart._intersects(y[v], m)) return !1;
        return (
          FlexChart._renderRotatedText(
            t,
            i,
            r,
            0,
            2,
            d,
            o,
            s,
            this._groupClass
          ),
          this._rects.push(m),
          !0
        );
      }
      return !1;
    }),
    (t.prototype._getLabelAlign = function (t) {
      var e = 1;
      if (this.labelAlign) {
        var i = this.labelAlign.toLowerCase();
        t
          ? 'top' == i
            ? (e = 0)
            : 'bottom' == i && (e = 2)
          : 'left' == i
          ? (e = 0)
          : 'right' == i && (e = 2);
      }
      return e;
    }),
    (t.prototype.convert = function (t, e, i) {
      var r = null == e ? this._actualMax : e,
        n = null == i ? this._actualMin : i;
      if (r == n) return 0;
      var o = this._axrect.left,
        s = this._axrect.width,
        a = this._axrect.top,
        h = this._axrect.height;
      if (null != this._customConvert) {
        var l = this._customConvert(t, n, r);
        return this.axisType == AxisType.Y ? a + l * h : o + l * s;
      }
      if (this.logBase) {
        if (t <= 0) return NaN;
        var c = Math.log(r / n);
        return this._reversed
          ? this.axisType == AxisType.Y
            ? a + (Math.log(t / n) / c) * h
            : o + s - (Math.log(t / n) / c) * s
          : this.axisType == AxisType.Y
          ? a + h - (Math.log(t / n) / c) * h
          : o + (Math.log(t / n) / c) * s;
      }
      return this._reversed
        ? this.axisType == AxisType.Y
          ? a + ((t - n) / (r - n)) * h
          : o + s - ((t - n) / (r - n)) * s
        : this.axisType == AxisType.Y
        ? a + h - ((t - n) / (r - n)) * h
        : o + ((t - n) / (r - n)) * s;
    }),
    (t.prototype.convertBack = function (t) {
      if (this._actualMax == this._actualMin) return 0;
      var e = this._plotrect.left,
        i = this._plotrect.width,
        r = this._plotrect.top,
        n = this._plotrect.height,
        o = this._actualMax - this._actualMin,
        s = this.logBase;
      if (null != this._customConvertBack)
        return this.axisType == AxisType.Y
          ? this._customConvertBack(
              (t - r) / n,
              this._actualMin,
              this._actualMax
            )
          : this._customConvertBack(
              (t - e) / i,
              this._actualMin,
              this._actualMax
            );
      if (s) {
        var a = 0;
        return (
          (a = this._reversed
            ? this.axisType == AxisType.Y
              ? (t - r) / n
              : 1 - (t - e) / i
            : this.axisType == AxisType.Y
            ? 1 - (t - r) / n
            : (t - e) / i),
          Math.pow(
            s,
            (Math.log(this._actualMin) +
              (Math.log(this._actualMax) - Math.log(this._actualMin)) * a) /
              Math.log(s)
          )
        );
      }
      return this._reversed
        ? this.axisType == AxisType.Y
          ? this._actualMin + ((t - r) * o) / n
          : this._actualMin + ((e + i - t) * o) / i
        : this.axisType == AxisType.Y
        ? this._actualMax - ((t - r) * o) / n
        : this._actualMin + ((t - e) * o) / i;
    }),
    Object.defineProperty(t.prototype, 'axisType', {
      get: function () {
        var t = this._chart;
        if (t) {
          if (t.axisX == this) return AxisType.X;
          if (t.axisY == this) return AxisType.Y;
        }
        return this._axisType;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._getMinNum = function () {
      return this._actualMin;
    }),
    (t.prototype._getMaxNum = function () {
      return this._actualMax;
    }),
    (t.prototype._invalidate = function () {
      this._chart && this._chart.invalidate();
    }),
    (t.prototype._cvCollectionChanged = function (t, e) {
      this._invalidate();
    }),
    (t.prototype._createLabels = function (t, e, i, r, n) {
      for (var o = 0; o < e; o++) {
        var s = (t + i * o).toFixed(14),
          a = parseFloat(s),
          h = this._formatValue(a);
        r.push(a), n.push(h);
      }
    }),
    (t.prototype._createLogarithmicLabels = function (t, e, i, r, n, o) {
      var s = this.logBase,
        a = Math.log(s),
        h = Math.floor(Math.log(t) / a),
        l = Math.ceil(Math.log(e) / a),
        c = s,
        _ = !0;
      i > 0 && ((_ = !1), (c = i)), c < s && (c = s);
      var u = ((l - h + 1) * s) / c,
        p = 1;
      if (o) {
        var d = this._getPosition(),
          f = this._getAnnoNumber(d == Position.Left || d == Position.Right);
        u > f
          ? (p = Math.floor(u / f + 1))
          : _ && (u <= 0.2 * f ? (c = 0.2 * s) : u <= 0.1 * f && (c = 0.1 * s));
      }
      for (var g = h; g <= l; g += p)
        if (_)
          for (var m = Math.pow(s, g), y = 0; y * c < s - 1; y++)
            (b = m * (1 + y * c)) >= t &&
              b <= e &&
              (0 == y
                ? (r.unshift(b), n && n.unshift(this._formatValue(b)))
                : (r.push(b), n && n.push(this._formatValue(b))));
        else {
          var b = Math.pow(c, g);
          b >= t && b <= e && (r.push(b), n && n.push(this._formatValue(b)));
        }
    }),
    (t.prototype._createTimeLabels = function (t, e, i, r) {
      var n = this._actualMin,
        o = this._actualMax,
        s = new Date(n),
        a = new Date(o),
        h = this._format,
        l = this._getAnnoNumber(this._axisType == AxisType.Y);
      l > 12 && (l = 12);
      var c = (0.001 * (this._actualMax - this._actualMin)) / l,
        _ = new _timeSpan(c * _timeSpan.TicksPerSecond),
        u = wjcCore.isNumber(this._majorUnit)
          ? _timeSpan.fromDays(this._majorUnit)
          : _timeHelper.NiceTimeSpan(_, h);
      h ||
        (this._tfmt = h =
          _timeHelper.GetTimeDefaultFormat(1e3 * u.TotalSeconds, 0));
      var p = u.Ticks,
        d = _timeHelper.RoundTime(n, u.TotalDays, !1);
      isFinite(d) && (n = d);
      var f = _timeHelper.RoundTime(o, u.TotalDays, !0);
      isFinite(f) && (o = f);
      var g = new Date(n);
      new Date(o);
      if (u.TotalDays >= 365 && !wjcCore.isNumber(this._majorUnit)) {
        (g = new Date(s.getFullYear(), 1, 1)) < s &&
          g.setFullYear(g.getFullYear() + 1);
        var m = u.TotalDays / 365;
        m -= m % 1;
        for (v = g; v <= a && m; v.setFullYear(v.getFullYear() + m)) {
          w = v.valueOf();
          i.push(w), r.push(this._formatValue(w));
        }
      } else if (u.TotalDays >= 30 && !wjcCore.isNumber(this._majorUnit)) {
        (g = new Date(s.getFullYear(), s.getMonth(), 1)) < s &&
          g.setMonth(g.getMonth() + 1);
        var y = u.TotalDays / 30;
        y -= y % 1;
        for (v = g; v <= a; v.setMonth(v.getMonth() + y)) {
          w = v.valueOf();
          i.push(w), r.push(this._formatValue(w));
        }
      } else {
        var b = (1e3 * p) / _timeSpan.TicksPerSecond,
          v = g,
          x = s.getTime() - v.getTime();
        for (
          x > b && (v = new Date(v.getTime() + Math.floor(x / b) * b));
          v <= a && b;
          v = new Date(v.getTime() + b)
        )
          if (v >= s) {
            var w = v.valueOf();
            i.push(w), r.push(this._formatValue(w));
          }
      }
    }),
    (t.prototype._formatValue = function (t) {
      if (this._isTimeAxis)
        return this._format
          ? wjcCore.Globalize.format(new Date(t), this._format)
          : wjcCore.Globalize.format(new Date(t), this._tfmt);
      if (this._format) return wjcCore.Globalize.format(t, this._format);
      var e = t == Math.round(t) ? 'n0' : 'n';
      return wjcCore.Globalize.format(t, e);
    }),
    (t.prototype._calcMajorUnit = function () {
      var t = this._majorUnit;
      if (!wjcCore.isNumber(t)) {
        var e = this._actualMax - this._actualMin,
          i = this._nicePrecision(e),
          r = e / this._getAnnoNumber(this.axisType == AxisType.Y);
        (t = this._niceNumber(2 * r, -i, !0)) < r &&
          (t = this._niceNumber(r, 1 - i, !1)),
          t < r && (t = this._niceTickNumber(r));
      }
      return t;
    }),
    (t.prototype._getAnnoNumber = function (t) {
      var e = t ? this._annoSize.height : this._annoSize.width,
        i = t ? this._axrect.height : this._axrect.width;
      if (e > 0 && i > 0) {
        var r = Math.floor(i / (e + 6));
        return r <= 0 && (r = 1), r;
      }
      return 10;
    }),
    (t.prototype._nicePrecision = function (t) {
      if (!wjcCore.isNumber(t) || t <= 0) return 0;
      var e,
        i = Math.log(t) / Math.LN10;
      e = i >= 0 ? Math.floor(i) : Math.ceil(i);
      var r = t / Math.pow(10, e);
      return (
        r < 3 && ((e = 1 - e), (r = t / Math.pow(10, e)) < 3 && (e += 1)), e
      );
    }),
    (t.prototype._niceTickNumber = function (t) {
      if (0 == t) return t;
      t < 0 && (t = -t);
      var e = Math.log(t) / Math.LN10,
        i = Math.floor(e),
        r = t / Math.pow(10, i),
        n = 10;
      return (
        r <= 1 ? (n = 1) : r <= 2 ? (n = 2) : r <= 5 && (n = 5),
        n * Math.pow(10, i)
      );
    }),
    (t.prototype._niceNumber = function (t, e, i) {
      if (0 == t) return t;
      t < 0 && (t = -t);
      var r = t / Math.pow(10, e),
        n = 10;
      return (
        i
          ? r < 1.5
            ? (n = 1)
            : r < 3
            ? (n = 2)
            : r < 4.5
            ? (n = 4)
            : r < 7 && (n = 5)
          : r <= 1
          ? (n = 1)
          : r <= 2
          ? (n = 2)
          : r <= 5 && (n = 5),
        n * Math.pow(10, e)
      );
    }),
    Object.defineProperty(t.prototype, '_uniqueId', {
      get: function () {
        return this.__uniqueId;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.MAX_MAJOR = 1e3),
    (t.MAX_MINOR = 2e3),
    (t._id = 0),
    t
  );
})();
exports.Axis = Axis;
var AxisCollection = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    (e.prototype.getAxis = function (t) {
      var e = this.indexOf(t);
      return e > -1 ? this[e] : null;
    }),
    (e.prototype.indexOf = function (t) {
      for (var e = 0; e < this.length; e++) if (this[e].name == t) return e;
      return -1;
    }),
    e
  );
})(wjcCore.ObservableArray);
exports.AxisCollection = AxisCollection;
var _tmInc;
!(function (t) {
  (t[(t.tickf7 = -7)] = 'tickf7'),
    (t[(t.tickf6 = -6)] = 'tickf6'),
    (t[(t.tickf5 = -5)] = 'tickf5'),
    (t[(t.tickf4 = -4)] = 'tickf4'),
    (t[(t.tickf3 = -3)] = 'tickf3'),
    (t[(t.tickf2 = -2)] = 'tickf2'),
    (t[(t.tickf1 = -1)] = 'tickf1'),
    (t[(t.second = 1)] = 'second'),
    (t[(t.minute = 60)] = 'minute'),
    (t[(t.hour = 3600)] = 'hour'),
    (t[(t.day = 86400)] = 'day'),
    (t[(t.week = 604800)] = 'week'),
    (t[(t.month = 2678400)] = 'month'),
    (t[(t.year = 31536e3)] = 'year'),
    (t[(t.maxtime = Number.MAX_VALUE)] = 'maxtime');
})(_tmInc || (_tmInc = {}));
var _timeSpan = (function () {
    function t(t) {
      this.ticks = t;
    }
    return (
      Object.defineProperty(t.prototype, 'Ticks', {
        get: function () {
          return this.ticks;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'TotalSeconds', {
        get: function () {
          return this.ticks / 1e7;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'TotalDays', {
        get: function () {
          return this.ticks / 1e7 / 86400;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.fromSeconds = function (e) {
        return new t(1e7 * e);
      }),
      (t.fromDays = function (e) {
        return new t(1e7 * e * 24 * 60 * 60);
      }),
      (t.TicksPerSecond = 1e7),
      t
    );
  })(),
  _timeHelper = (function () {
    function t(t) {
      wjcCore.isDate(t)
        ? this.init(t)
        : wjcCore.isNumber(t) && this.init(FlexChart._fromOADate(t));
    }
    return (
      (t.prototype.init = function (t) {
        (this.year = t.getFullYear()),
          (this.month = t.getMonth()),
          (this.day = t.getDate()),
          (this.hour = t.getHours()),
          (this.minute = t.getMinutes()),
          (this.second = t.getSeconds());
      }),
      (t.prototype.getTimeAsDateTime = function () {
        this.hour >= 24 && ((this.hour -= 24), (this.day += 1)),
          this.month < 0
            ? (-1 - this.day, (this.month = 1))
            : this.month > 11 && (this.month - 12, (this.month = 12)),
          this.day < 1
            ? (-1 - this.day, (this.day = 1))
            : this.day > 28 && 2 == this.month
            ? (this.day - 28, (this.day = 28))
            : this.day > 30 &&
              (4 == this.month ||
                4 == this.month ||
                6 == this.month ||
                9 == this.month ||
                11 == this.month)
            ? (this.day - 30, (this.day = 30))
            : this.day > 31 && (this.day - 31, (this.day = 31)),
          this.second > 59 && (this.second - 59, (this.second = 59));
        return (
          this.minute > 59 && (this.minute - 59, (this.minute = 59)),
          new Date(
            this.year,
            this.month,
            this.day,
            this.hour,
            this.minute,
            this.second
          )
        );
      }),
      (t.prototype.getTimeAsDouble = function () {
        return this.getTimeAsDateTime().valueOf();
      }),
      (t.tround = function (t, e, i) {
        var r = (t / e) * e;
        return (r -= r % 1), i && r != t && (r += e -= e % 1), r;
      }),
      (t.RoundTime = function (e, i, r) {
        var n = 24 * i * 60 * 60;
        if (n > 0) {
          var o = new t(e);
          return n < _tmInc.minute
            ? ((o.second = this.tround(o.second, n, r)), o.getTimeAsDouble())
            : ((o.second = 0),
              n < _tmInc.hour
                ? ((n /= _tmInc.minute),
                  (o.minute = this.tround(o.minute, n, r)),
                  o.getTimeAsDouble())
                : ((o.minute = 0),
                  n < _tmInc.day
                    ? ((n /= _tmInc.hour),
                      (o.hour = this.tround(o.hour, n, r)),
                      o.getTimeAsDouble())
                    : ((o.hour = 0),
                      n < _tmInc.month
                        ? ((n /= _tmInc.day),
                          (o.day = this.tround(o.day, n, r)),
                          o.getTimeAsDouble())
                        : ((o.day = 1),
                          n < _tmInc.year
                            ? ((n /= _tmInc.month),
                              1 != o.month &&
                                (o.month = this.tround(o.month, n, r)),
                              o.getTimeAsDouble())
                            : ((o.month = 1),
                              (n /= _tmInc.year),
                              (o.year = this.tround(o.year, n, r)),
                              o.getTimeAsDouble())))));
        }
        var s = e,
          a = s - n,
          h = (a / i) * i;
        return r && h != a && (h += i), (s = n + h);
      }),
      (t.TimeSpanFromTmInc = function (t) {
        var e = _timeSpan.fromSeconds(1);
        if (t != _tmInc.maxtime)
          if (t > _tmInc.tickf1) e = _timeSpan.fromSeconds(t);
          else {
            var i = t,
              r = 1;
            for (i += 7; i > 0; ) (r *= 10), i--;
            e = new _timeSpan(r);
          }
        return e;
      }),
      (t.manualTimeInc = function (t) {
        var e = _tmInc.second;
        if (null == t || 0 == t.length) return e;
        var i = t.indexOf('f');
        if (i >= 0) {
          var r = -1;
          if (i > 0 && '%' == t.substr(i - 1, 1)) r = -1;
          else
            for (
              var n = 1;
              n < 6 && !(i + n >= t.length) && 'f' == t.substr(i + n, 1);
              n++
            )
              r--;
          e = r;
        } else
          t.indexOf('s') >= 0
            ? (e = _tmInc.second)
            : t.indexOf('m') >= 0
            ? (e = _tmInc.minute)
            : t.indexOf('h') >= 0 || t.indexOf('H')
            ? (e = _tmInc.hour)
            : t.indexOf('d') >= 0
            ? (e = _tmInc.day)
            : t.indexOf('M') >= 0
            ? (e = _tmInc.month)
            : t.indexOf('y') >= 0 && (e = _tmInc.year);
        return e;
      }),
      (t.getNiceInc = function (t, e, i) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r] * i;
          if (e <= n) return n;
        }
        return 0;
      }),
      (t.NiceTimeSpan = function (e, i) {
        var r = _tmInc.second;
        null != i && i.length > 0 && (r = t.manualTimeInc(i));
        var n = 0,
          o = 0;
        if (r < _tmInc.second && e.TotalSeconds < 10) {
          for (n = e.Ticks, o = t.TimeSpanFromTmInc(r).Ticks; n > 10 * o; )
            o *= 10;
          var s = o;
          return (
            n > s && (s *= 2),
            n > s && (s = 5 * o),
            n > s && (s = 10 * o),
            new _timeSpan(s)
          );
        }
        if (0 == (n = Math.ceil(e.TotalSeconds))) return t.TimeSpanFromTmInc(r);
        if (((o = 1), r < _tmInc.minute)) {
          if (
            n < _tmInc.minute &&
            0 != (o = t.getNiceInc([1, 2, 5, 10, 15, 30], n, r))
          )
            return _timeSpan.fromSeconds(o);
          r = _tmInc.minute;
        }
        if (r < _tmInc.hour) {
          if (
            n < _tmInc.hour &&
            0 != (o = t.getNiceInc([1, 2, 5, 10, 15, 30], n, r))
          )
            return _timeSpan.fromSeconds(o);
          r = _tmInc.hour;
        }
        if (r < _tmInc.day) {
          if (n < _tmInc.day && 0 != (o = t.getNiceInc([1, 3, 6, 12], n, r)))
            return _timeSpan.fromSeconds(o);
          r = _tmInc.day;
        }
        if (r < _tmInc.month) {
          if (n < _tmInc.month && 0 != (o = t.getNiceInc([1, 2, 7, 14], n, r)))
            return _timeSpan.fromSeconds(o);
          r = _tmInc.month;
        }
        if (r < _tmInc.year) {
          if (n < _tmInc.year && 0 != (o = t.getNiceInc([1, 2, 3, 4, 6], n, r)))
            return _timeSpan.fromSeconds(o);
          r = _tmInc.year;
        }
        return (
          (o = 100 * _tmInc.year),
          n < o &&
            0 == (o = t.getNiceInc([1, 2, 5, 10, 20, 50], n, r)) &&
            (o = 100 * _tmInc.year),
          _timeSpan.fromSeconds(o)
        );
      }),
      (t.NiceTimeUnit = function (e, i) {
        var r = _timeSpan.fromDays(e);
        return (r = t.NiceTimeSpan(r, i)).TotalDays;
      }),
      (t.GetTimeDefaultFormat = function (t, e) {
        if (!wjcCore.isNumber(t) || !wjcCore.isNumber(e)) return '';
        var i = 's',
          r = _timeSpan.fromSeconds(0.001 * (t - e)),
          n = r.TotalSeconds;
        if (n >= _tmInc.year) i = 'yyyy';
        else if (n >= _tmInc.month) i = 'MMM yyyy';
        else if (n >= _tmInc.day) i = 'MMM d';
        else if (n >= _tmInc.hour) i = 'ddd H:mm';
        else if (n >= 0.5 * _tmInc.hour) i = 'H:mm';
        else if (n >= 1) i = 'H:mm:ss';
        else if (n > 0) {
          var o = r.Ticks;
          for (i = 's.'; o < _timeSpan.TicksPerSecond; ) (o *= 10), (i += 'f');
        }
        return i;
      }),
      (t.secInYear = 86400),
      t
    );
  })(),
  PlotArea = (function () {
    function t(t) {
      (this._row = 0),
        (this._col = 0),
        (this._rect = new wjcCore.Rect(0, 0, 0, 0)),
        t && wjcCore.copy(this, t);
    }
    return (
      Object.defineProperty(t.prototype, 'row', {
        get: function () {
          return this._row;
        },
        set: function (t) {
          t != this._row &&
            ((this._row = wjcCore.asInt(t, !0, !0)), this._invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'column', {
        get: function () {
          return this._col;
        },
        set: function (t) {
          t != this._col &&
            ((this._col = wjcCore.asInt(t, !0, !0)), this._invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'name', {
        get: function () {
          return this._name;
        },
        set: function (t) {
          t != this._name && (this._name = wjcCore.asString(t, !0));
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'width', {
        get: function () {
          return this._width;
        },
        set: function (t) {
          t != this._width && ((this._width = t), this._invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'height', {
        get: function () {
          return this._height;
        },
        set: function (t) {
          t != this._height && ((this._height = t), this._invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'style', {
        get: function () {
          return this._style;
        },
        set: function (t) {
          t != this._style && ((this._style = t), this._invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype._invalidate = function () {
        this._chart && this._chart.invalidate();
      }),
      (t.prototype._render = function (t) {
        t.drawRect(
          this._rect.left,
          this._rect.top,
          this._rect.width,
          this._rect.height,
          null,
          this.style
        );
      }),
      (t.prototype._setPlotX = function (t, e) {
        (this._rect.left = t), (this._rect.width = e);
      }),
      (t.prototype._setPlotY = function (t, e) {
        (this._rect.top = t), (this._rect.height = e);
      }),
      t
    );
  })();
exports.PlotArea = PlotArea;
var PlotAreaCollection = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    (e.prototype.getPlotArea = function (t) {
      var e = this.indexOf(t);
      return e > -1 ? this[e] : null;
    }),
    (e.prototype.indexOf = function (t) {
      for (var e = 0; e < this.length; e++) if (this[e].name == t) return e;
      return -1;
    }),
    (e.prototype._getWidth = function (t) {
      for (var e = 0; e < this.length; e++) {
        var i = this[e];
        if (i.column == t && 0 == i.row) return i.width;
      }
    }),
    (e.prototype._getHeight = function (t) {
      for (var e = 0; e < this.length; e++) {
        var i = this[e];
        if (i.row == t && 0 == i.column) return i.height;
      }
    }),
    (e.prototype._calculateWidths = function (t, e) {
      if (e <= 0) throw 'ncols';
      for (var i = [], r = 0; r < e; r++) {
        var n = this._getWidth(r);
        i[r] = new _GridLength(n);
      }
      return this._calculateLengths(t, e, i);
    }),
    (e.prototype._calculateHeights = function (t, e) {
      if (e <= 0) throw 'nrows';
      for (var i = [], r = 0; r < e; r++) {
        var n = this._getHeight(r);
        i[r] = new _GridLength(n);
      }
      return this._calculateLengths(t, e, i);
    }),
    (e.prototype._calculateLengths = function (t, e, i) {
      for (var r = [e], n = 0, o = 0, s = 0; s < e; s++)
        i[s].isAbsolute
          ? ((r[s] = i[s].value), (n += r[s]))
          : i[s].isStar
          ? (o += i[s].value)
          : i[s].isAuto && o++;
      for (var a = (t - n) / o, s = 0; s < e; s++)
        i[s].isStar ? (r[s] = a * i[s].value) : i[s].isAuto && (r[s] = a),
          r[s] < 0 && (r[s] = 0);
      return r;
    }),
    e
  );
})(wjcCore.ObservableArray);
exports.PlotAreaCollection = PlotAreaCollection;
var _GridUnitType;
!(function (t) {
  (t[(t.Auto = 0)] = 'Auto'),
    (t[(t.Pixel = 1)] = 'Pixel'),
    (t[(t.Star = 2)] = 'Star');
})(_GridUnitType || (_GridUnitType = {}));
var _GridLength = (function () {
    function t(t) {
      void 0 === t && (t = null),
        (this._unitType = _GridUnitType.Auto),
        t &&
          ((t = t.toString()).indexOf('*') >= 0
            ? ((this._unitType = _GridUnitType.Star),
              (t = t.replace('*', '')),
              (this._value = parseFloat(t)),
              isNaN(this._value) && (this._value = 1))
            : ((this._unitType = _GridUnitType.Pixel),
              (this._value = parseFloat(t)),
              isNaN(this._value) &&
                ((this._unitType = _GridUnitType.Auto), (this._value = 1))));
    }
    return (
      Object.defineProperty(t.prototype, 'value', {
        get: function () {
          return this._value;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'isStar', {
        get: function () {
          return this._unitType == _GridUnitType.Star;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'isAbsolute', {
        get: function () {
          return this._unitType == _GridUnitType.Pixel;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'isAuto', {
        get: function () {
          return this._unitType == _GridUnitType.Auto;
        },
        enumerable: !0,
        configurable: !0,
      }),
      t
    );
  })(),
  SeriesVisibility;
!(function (t) {
  (t[(t.Visible = 0)] = 'Visible'),
    (t[(t.Plot = 1)] = 'Plot'),
    (t[(t.Legend = 2)] = 'Legend'),
    (t[(t.Hidden = 3)] = 'Hidden');
})(
  (SeriesVisibility =
    exports.SeriesVisibility || (exports.SeriesVisibility = {}))
);
var Marker;
!(function (t) {
  (t[(t.Dot = 0)] = 'Dot'), (t[(t.Box = 1)] = 'Box');
})((Marker = exports.Marker || (exports.Marker = {})));
var DataArray = (function () {
  return function () {};
})();
exports.DataArray = DataArray;
var SeriesEventArgs = (function (t) {
  function e(e) {
    var i = t.call(this) || this;
    return (i._series = wjcCore.asType(e, SeriesBase)), i;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'series', {
      get: function () {
        return this._series;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(wjcCore.EventArgs);
exports.SeriesEventArgs = SeriesEventArgs;
var SeriesBase = (function () {
  function t(t) {
    (this._altStyle = null),
      (this._symbolMarker = Marker.Dot),
      (this._visibility = SeriesVisibility.Visible),
      (this.rendering = new wjcCore.Event()),
      (this.rendered = new wjcCore.Event()),
      t && this.initialize(t);
  }
  return (
    Object.defineProperty(t.prototype, 'style', {
      get: function () {
        return this._style;
      },
      set: function (t) {
        t != this._style && ((this._style = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'altStyle', {
      get: function () {
        return this._altStyle;
      },
      set: function (t) {
        t != this._altStyle && ((this._altStyle = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'symbolStyle', {
      get: function () {
        return this._symbolStyle;
      },
      set: function (t) {
        t != this._symbolStyle && ((this._symbolStyle = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'symbolSize', {
      get: function () {
        return this._symbolSize;
      },
      set: function (t) {
        t != this._symbolSize &&
          ((this._symbolSize = wjcCore.asNumber(t, !0, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'symbolMarker', {
      get: function () {
        return this._symbolMarker;
      },
      set: function (t) {
        (t = wjcCore.asEnum(t, Marker, !0)) != this._symbolMarker &&
          ((this._symbolMarker = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'binding', {
      get: function () {
        return this._binding
          ? this._binding
          : this._chart
          ? this._chart.binding
          : null;
      },
      set: function (t) {
        t != this._binding &&
          ((this._binding = wjcCore.asString(t, !0)),
          this._clearValues(),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'bindingX', {
      get: function () {
        return this._bindingX
          ? this._bindingX
          : this._chart
          ? this._chart.bindingX
          : null;
      },
      set: function (t) {
        t != this._bindingX &&
          ((this._bindingX = wjcCore.asString(t, !0)),
          this._clearValues(),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'name', {
      get: function () {
        return this._name;
      },
      set: function (t) {
        this._name = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemsSource', {
      get: function () {
        return this._itemsSource;
      },
      set: function (t) {
        t != this._itemsSource &&
          (this._cv &&
            (this._cv.currentChanged.removeHandler(
              this._cvCurrentChanged,
              this
            ),
            this._cv.collectionChanged.removeHandler(
              this._cvCollectionChanged,
              this
            ),
            (this._cv = null)),
          (this._itemsSource = t),
          (this._cv = wjcCore.asCollectionView(t)),
          null != this._cv &&
            (this._cv.currentChanged.addHandler(this._cvCurrentChanged, this),
            this._cv.collectionChanged.addHandler(
              this._cvCollectionChanged,
              this
            )),
          this._clearValues(),
          (this._itemsSource = t),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'collectionView', {
      get: function () {
        return this._cv
          ? this._cv
          : this._chart
          ? this._chart.collectionView
          : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'chart', {
      get: function () {
        return this._chart;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'hostElement', {
      get: function () {
        return this._hostElement;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'legendElement', {
      get: function () {
        return this._legendElement;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'cssClass', {
      get: function () {
        return this._cssClass;
      },
      set: function (t) {
        this._cssClass = wjcCore.asString(t, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'visibility', {
      get: function () {
        return this._visibility;
      },
      set: function (t) {
        t != this._visibility &&
          ((this._visibility = wjcCore.asEnum(t, SeriesVisibility)),
          this._clearValues(),
          this._invalidate(),
          this._chart &&
            this._chart.onSeriesVisibilityChanged(new SeriesEventArgs(this)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.hitTest = function (t, e) {
      return (
        wjcCore.isNumber(t) && wjcCore.isNumber(e)
          ? (t = new wjcCore.Point(t, e))
          : t instanceof MouseEvent &&
            (t = new wjcCore.Point(t.pageX, t.pageY)),
        wjcCore.asType(t, wjcCore.Point),
        this._chart
          ? this._chart._hitTestSeries(t, this._chart.series.indexOf(this))
          : null
      );
    }),
    (t.prototype.getPlotElement = function (t) {
      if (this.hostElement && t < this._pointIndexes.length) {
        var e = this._pointIndexes[t];
        if (e < this.hostElement.childNodes.length)
          return this.hostElement.childNodes[e];
      }
      return null;
    }),
    Object.defineProperty(t.prototype, 'axisX', {
      get: function () {
        return this._axisX;
      },
      set: function (t) {
        if (t != this._axisX) {
          if (((this._axisX = wjcCore.asType(t, Axis, !0)), this._axisX)) {
            var e = (this._axisX._chart = this._chart);
            e && -1 == e.axes.indexOf(this._axisX) && e.axes.push(this._axisX);
          }
          this._invalidate();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'axisY', {
      get: function () {
        return this._axisY;
      },
      set: function (t) {
        if (t != this._axisY) {
          if (((this._axisY = wjcCore.asType(t, Axis, !0)), this._axisY)) {
            var e = (this._axisY._chart = this._chart);
            e && -1 == e.axes.indexOf(this._axisY) && e.axes.push(this._axisY);
          }
          this._invalidate();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.initialize = function (t) {
      t && wjcCore.copy(this, t);
    }),
    (t.prototype.pointToData = function (t) {
      return (
        wjcCore.asType(t, wjcCore.Point),
        (t = t.clone()),
        (t.x = this._getAxisX().convertBack(t.x)),
        (t.y = this._getAxisY().convertBack(t.y)),
        t
      );
    }),
    (t.prototype.dataToPoint = function (t) {
      return (
        wjcCore.asType(t, wjcCore.Point),
        (t = t.clone()),
        (t.x = this._getAxisX().convert(t.x)),
        (t.y = this._getAxisY().convert(t.y)),
        t
      );
    }),
    (t.prototype.onRendering = function (t, e, i) {
      var r = new SeriesRenderingEventArgs(t, e, i);
      return this.rendering.raise(this, r), r.cancel;
    }),
    (t.prototype.onRendered = function (t) {
      this.rendered.raise(this, new RenderEventArgs(t));
    }),
    Object.defineProperty(t.prototype, '_chart', {
      get: function () {
        return this.__chart;
      },
      set: function (t) {
        t !== this.__chart && (this.__chart = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._getSymbolSize = function () {
      return null != this.symbolSize ? this.symbolSize : this.chart.symbolSize;
    }),
    Object.defineProperty(t.prototype, '_plotter', {
      get: function () {
        return (
          this.chart &&
            !this.__plotter &&
            (this.__plotter = this.chart._getPlotter(this)),
          this.__plotter
        );
      },
      set: function (t) {
        t != this.__plotter && (this.__plotter = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getDataType = function (t) {
      return 0 == t
        ? this._valueDataType
        : 1 == t
        ? this._xvalueDataType
        : null;
    }),
    (t.prototype.getValues = function (t) {
      if (0 == t) {
        if (null == this._values)
          if (((this._valueDataType = null), null != this._cv)) {
            i = this._bindValues(this._cv.items, this._getBinding(0));
            (this._values = i.values), (this._valueDataType = i.dataType);
          } else if (
            null != this.binding &&
            null != this._chart &&
            null != this._chart.collectionView
          ) {
            i = this._bindValues(
              this._chart.collectionView.items,
              this._getBinding(0)
            );
            (this._values = i.values), (this._valueDataType = i.dataType);
          }
        return this._values;
      }
      if (1 == t) {
        if (null == this._xvalues) {
          this._xvalueDataType = null;
          var e = this;
          if (null != this.bindingX)
            if (null != e._cv) {
              i = this._bindValues(e._cv.items, this.bindingX, !0);
              (this._xvalueDataType = i.dataType), (this._xvalues = i.values);
            } else {
              if (null == this._bindingX) return null;
              if (null != e._chart && null != e._chart.collectionView) {
                var i = this._bindValues(
                  e._chart.collectionView.items,
                  this.bindingX,
                  !0
                );
                (this._xvalueDataType = i.dataType), (this._xvalues = i.values);
              }
            }
        }
        return this._xvalues;
      }
      return null;
    }),
    (t.prototype.drawLegendItem = function (t, e, i) {
      var r = this._getChartType();
      null == r && (r = this._chart._getChartType()),
        r === ChartType.Funnel
          ? this._drawFunnelLegendItem(t, e, i, this.style, this.symbolStyle)
          : this._drawLegendItem(
              t,
              e,
              r,
              this.name,
              this.style,
              this.symbolStyle
            );
    }),
    (t.prototype.measureLegendItem = function (t, e) {
      var i = this._getChartType();
      return (
        null == i && (i = this._chart._getChartType()),
        i === ChartType.Funnel
          ? this._measureLegendItem(t, this._getFunnelLegendName(e))
          : this._measureLegendItem(t, this.name)
      );
    }),
    (t.prototype.legendItemLength = function () {
      var t = this._getChartType();
      return (
        null == t && (t = this._chart._getChartType()),
        t === ChartType.Funnel &&
        this._chart._xlabels &&
        this._chart._xlabels.length
          ? this._chart._xlabels.length
          : 1
      );
    }),
    (t.prototype.getDataRect = function (t, e) {
      return null;
    }),
    (t.prototype._getChartType = function () {
      return this._chartType;
    }),
    (t.prototype._clearValues = function () {
      (this._values = null), (this._xvalues = null), (this.__plotter = null);
    }),
    (t.prototype._getBinding = function (t) {
      var e = this.binding;
      if (e) {
        var i = this.chart ? this.chart._bindingSeparator : ',';
        if (i) {
          var r = e.split(i);
          r && r.length > t && (e = r[t].trim());
        }
      }
      return e;
    }),
    (t.prototype._getBindingValues = function (t) {
      var e;
      return (
        null != this._cv
          ? (e = this._cv.items)
          : null != this._chart &&
            null != this._chart.collectionView &&
            (e = this._chart.collectionView.items),
        this._bindValues(e, this._getBinding(t)).values
      );
    }),
    (t.prototype._getItem = function (t) {
      var e = null,
        i = null;
      return (
        null != this.itemsSource
          ? (i = null != this._cv ? this._cv.items : this.itemsSource)
          : null != this._chart.itemsSource &&
            (i =
              null != this._chart.collectionView
                ? this._chart.collectionView.items
                : this._chart.itemsSource),
        null != i && (e = i[t]),
        e
      );
    }),
    (t.prototype._getLength = function () {
      var t = 0,
        e = null;
      return (
        null != this.itemsSource
          ? (e = null != this._cv ? this._cv.items : this.itemsSource)
          : null != this._chart.itemsSource &&
            (e =
              null != this._chart.collectionView
                ? this._chart.collectionView.items
                : this._chart.itemsSource),
        null != e && (t = e.length),
        t
      );
    }),
    (t.prototype._setPointIndex = function (t, e) {
      this._pointIndexes[t] = e;
    }),
    (t.prototype._getDataRect = function () {
      var t = this.getValues(0),
        e = this.getValues(1);
      if (t) {
        for (
          var i = NaN, r = NaN, n = NaN, o = NaN, s = t.length, a = 0;
          a < s;
          a++
        ) {
          var h = t[a];
          if (
            (isFinite(h) &&
              (isNaN(r) ? (r = o = h) : h < r ? (r = h) : h > o && (o = h)),
            e)
          ) {
            var l = e[a];
            isFinite(l) &&
              (isNaN(i) ? (i = n = l) : l < i ? (i = l) : h > o && (n = l));
          }
        }
        if ((e || ((i = 0), (n = s - 1)), !isNaN(r)))
          return new wjcCore.Rect(i, r, n - i, o - r);
      }
      return null;
    }),
    (t.prototype._isCustomAxisX = function () {
      return !!this._axisX && (!this._chart || this._axisX != this.chart.axisX);
    }),
    (t.prototype._isCustomAxisY = function () {
      return !!this._axisY && (!this._chart || this._axisY != this.chart.axisY);
    }),
    (t.prototype._getAxisX = function () {
      var t = null;
      return (
        this.axisX ? (t = this.axisX) : this.chart && (t = this.chart.axisX), t
      );
    }),
    (t.prototype._getAxisY = function () {
      var t = null;
      return (
        this.axisY ? (t = this.axisY) : this.chart && (t = this.chart.axisY), t
      );
    }),
    (t.prototype._measureLegendItem = function (t, e) {
      var i = new wjcCore.Size();
      if (
        ((i.width = Series._LEGEND_ITEM_WIDTH),
        (i.height = Series._LEGEND_ITEM_HEIGHT),
        this._name)
      ) {
        var r = t.measureString(e, FlexChart._CSS_LABEL, FlexChart._CSS_LEGEND);
        (i.width += r.width), i.height < r.height && (i.height = r.height);
      }
      return (
        (i.width += 3 * Series._LEGEND_ITEM_MARGIN),
        (i.height += 2 * Series._LEGEND_ITEM_MARGIN),
        i
      );
    }),
    (t.prototype._drawFunnelLegendItem = function (t, e, i, r, n) {
      t.strokeWidth = 1;
      var o = Series._LEGEND_ITEM_MARGIN,
        s = null,
        a = null;
      null === s && (s = this._chart._getColorLight(i)),
        null === a && (a = this._chart._getColor(i)),
        (t.fill = s),
        (t.stroke = a);
      var h = e.top + 0.5 * e.height,
        l = Series._LEGEND_ITEM_WIDTH,
        c = Series._LEGEND_ITEM_HEIGHT,
        _ = this._getFunnelLegendName(i);
      t.drawRect(e.left + o, h - 0.5 * c, l, c, null, n || r),
        _ &&
          FlexChart._renderText(
            t,
            _,
            new wjcCore.Point(e.left + c + 2 * o, h),
            0,
            1,
            FlexChart._CSS_LABEL
          );
    }),
    (t.prototype._getFunnelLegendName = function (t) {
      var e;
      return (
        this._chart._xlabels &&
          this._chart._xlabels.length &&
          (e = this._chart._xlabels[t]),
        e || (e = this.name),
        e
      );
    }),
    (t.prototype._drawLegendItem = function (t, e, i, r, n, o) {
      t.strokeWidth = 1;
      var s = Series._LEGEND_ITEM_MARGIN,
        a = null,
        h = null;
      null === a &&
        (a = this._chart._getColorLight(this._chart.series.indexOf(this))),
        null === h &&
          (h = this._chart._getColor(this._chart.series.indexOf(this))),
        (t.fill = a),
        (t.stroke = h);
      var l = e.top + 0.5 * e.height,
        c = Series._LEGEND_ITEM_WIDTH,
        _ = Series._LEGEND_ITEM_HEIGHT;
      switch (i) {
        case ChartType.Area:
        case ChartType.SplineArea:
          t.drawRect(e.left + s, l - 0.5 * _, c, _, null, n);
          break;
        case ChartType.Bar:
        case ChartType.Column:
          t.drawRect(e.left + s, l - 0.5 * _, c, _, null, o || n);
          break;
        case ChartType.Scatter:
        case ChartType.Bubble:
          var u = 0.3 * c,
            p = 0.3 * _;
          this.symbolMarker == Marker.Box
            ? t.drawRect(
                e.left + s + 0.5 * c - u,
                l - p,
                2 * u,
                2 * p,
                null,
                o || n
              )
            : t.drawEllipse(e.left + 0.5 * c + s, l, u, p, null, o || n);
          break;
        case ChartType.Line:
        case ChartType.Spline:
          t.drawLine(e.left + s, l, e.left + c + s, l, null, n);
          break;
        case ChartType.LineSymbols:
        case ChartType.SplineSymbols:
          var u = 0.3 * c,
            p = 0.3 * _;
          this.symbolMarker == Marker.Box
            ? t.drawRect(
                e.left + s + 0.5 * c - u,
                l - p,
                2 * u,
                2 * p,
                null,
                o || n
              )
            : t.drawEllipse(e.left + 0.5 * c + s, l, u, p, null, o || n),
            t.drawLine(e.left + s, l, e.left + c + s, l, null, n);
          break;
        case ChartType.Candlestick:
        case ChartType.HighLowOpenClose:
          t.drawLine(e.left + s, l, e.left + c + s, l, null, o || n);
      }
      this._name &&
        FlexChart._renderText(
          t,
          r,
          new wjcCore.Point(e.left + _ + 2 * s, l),
          0,
          1,
          FlexChart._CSS_LABEL
        );
    }),
    (t.prototype._cvCollectionChanged = function (t, e) {
      this._clearValues(), this._invalidate();
    }),
    (t.prototype._cvCurrentChanged = function (t, e) {
      this._chart && this._chart._notifyCurrentChanged && this._invalidate();
    }),
    (t.prototype._bindValues = function (t, e, i) {
      void 0 === i && (i = !1);
      var r, n, o;
      if (null != t) {
        var s = t.length;
        r = new Array(t.length);
        for (var a = 0; a < s; a++) {
          o = null;
          var h = t[a];
          null != e && (h = h[e]),
            wjcCore.isArray(h) && h.length > 0 && ((o = h), (h = h[0])),
            wjcCore.isNumber(h)
              ? ((r[a] = h), (n = wjcCore.DataType.Number))
              : wjcCore.isDate(h)
              ? ((r[a] = h.valueOf()), (n = wjcCore.DataType.Date))
              : i && h && ((r[a] = a), (n = wjcCore.DataType.Number)),
            wjcCore.isArray(o) && o.length > 0 && (r[a] = o);
        }
      }
      var l = new DataArray();
      return (l.values = r), (l.dataType = n), l;
    }),
    (t.prototype._invalidate = function () {
      this._chart && this._chart.invalidate();
    }),
    (t.prototype._indexToPoint = function (t) {
      if (t >= 0 && t < this._values.length) {
        var e = this._values[t],
          i = this._xvalues ? this._xvalues[t] : t;
        return new wjcCore.Point(i, e);
      }
      return null;
    }),
    (t.prototype._getSymbolFill = function (t) {
      var e = null;
      return (
        this.symbolStyle && (e = this.symbolStyle.fill),
        !e && this.style && (e = this.style.fill),
        !e && this.chart && (e = this.chart._getColorLight(t)),
        e
      );
    }),
    (t.prototype._getSymbolStroke = function (t) {
      var e = null;
      return (
        this.symbolStyle && (e = this.symbolStyle.stroke),
        !e && this.style && (e = this.style.stroke),
        !e && this.chart && (e = this.chart._getColor(t)),
        e
      );
    }),
    (t.prototype._getAltSymbolStroke = function (t) {
      var e = null;
      return this.altStyle && (e = this.altStyle.stroke), e;
    }),
    (t.prototype._getAltSymbolFill = function (t) {
      var e = null;
      return this.altStyle && (e = this.altStyle.fill), e;
    }),
    (t.prototype._renderLabels = function (t, e, i, r) {
      this._plotter && this._plotter._renderLabels(t, this, e, i, r);
    }),
    (t._LEGEND_ITEM_WIDTH = 10),
    (t._LEGEND_ITEM_HEIGHT = 10),
    (t._LEGEND_ITEM_MARGIN = 4),
    (t._DEFAULT_SYM_SIZE = 10),
    t
  );
})();
exports.SeriesBase = SeriesBase;
var Series = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'chartType', {
      get: function () {
        return this._chartType;
      },
      set: function (t) {
        t != this._chartType &&
          ((this._chartType = wjcCore.asEnum(t, ChartType, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(SeriesBase);
exports.Series = Series;
var _SvgRenderEngine = (function () {
  function t(e) {
    (this._strokeWidth = 1),
      (this._fontSize = null),
      (this._fontFamily = null),
      (this._savedGradient = {}),
      (this._element = e),
      this._create(),
      this._element.appendChild(this._svg),
      void 0 === t._isff &&
        (t._isff = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0);
  }
  return (
    (t.prototype.beginRender = function () {
      for (; this._svg.firstChild; ) wjcCore.removeChild(this._svg.firstChild);
      (this._savedGradient = {}),
        this._svg.appendChild(this._defs),
        this._svg.appendChild(this._textGroup);
    }),
    (t.prototype.endRender = function () {
      wjcCore.removeChild(this._textGroup);
    }),
    (t.prototype.setViewportSize = function (t, e) {
      this._svg.setAttribute('width', t.toString()),
        this._svg.setAttribute('height', e.toString());
    }),
    Object.defineProperty(t.prototype, 'element', {
      get: function () {
        return this._svg;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'fill', {
      get: function () {
        return this._fill;
      },
      set: function (t) {
        this._fill = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'fontSize', {
      get: function () {
        return this._fontSize;
      },
      set: function (t) {
        this._fontSize = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'fontFamily', {
      get: function () {
        return this._fontFamily;
      },
      set: function (t) {
        this._fontFamily = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'stroke', {
      get: function () {
        return this._stroke;
      },
      set: function (t) {
        this._stroke = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'strokeWidth', {
      get: function () {
        return this._strokeWidth;
      },
      set: function (t) {
        this._strokeWidth = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'textFill', {
      get: function () {
        return this._textFill;
      },
      set: function (t) {
        this._textFill = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.addClipRect = function (e, i) {
      if (e && i) {
        var r = document.createElementNS(t.svgNS, 'clipPath'),
          n = document.createElementNS(t.svgNS, 'rect');
        n.setAttribute('x', (e.left - 1).toFixed()),
          n.setAttribute('y', (e.top - 1).toFixed()),
          n.setAttribute('width', (e.width + 2).toFixed()),
          n.setAttribute('height', (e.height + 2).toFixed()),
          r.appendChild(n),
          r.setAttribute('id', i),
          this._svg.appendChild(r);
      }
    }),
    (t.prototype.drawEllipse = function (e, i, r, n, o, s) {
      var a = document.createElementNS(t.svgNS, 'ellipse');
      return (
        this._applyColor(a, 'stroke', this._stroke),
        null !== this._strokeWidth &&
          a.setAttribute('stroke-width', this._strokeWidth.toString()),
        this._applyColor(a, 'fill', this._fill),
        a.setAttribute('cx', e.toFixed(1)),
        a.setAttribute('cy', i.toFixed(1)),
        a.setAttribute('rx', r.toFixed(1)),
        a.setAttribute('ry', n.toFixed(1)),
        o && a.setAttribute('class', o),
        this._applyStyle(a, s),
        this._appendChild(a),
        a
      );
    }),
    (t.prototype.drawRect = function (e, i, r, n, o, s, a) {
      var h = document.createElementNS(t.svgNS, 'rect');
      return (
        this._applyColor(h, 'fill', this._fill),
        this._applyColor(h, 'stroke', this._stroke),
        null !== this._strokeWidth &&
          h.setAttribute('stroke-width', this._strokeWidth.toString()),
        h.setAttribute('x', e.toFixed(1)),
        h.setAttribute('y', i.toFixed(1)),
        r > 0 && r < 0.05
          ? h.setAttribute('width', '0.1')
          : h.setAttribute('width', r.toFixed(1)),
        n > 0 && n < 0.05
          ? h.setAttribute('height', '0.1')
          : h.setAttribute('height', n.toFixed(1)),
        a && h.setAttribute('clip-path', 'url(#' + a + ')'),
        o && h.setAttribute('class', o),
        this._applyStyle(h, s),
        this._appendChild(h),
        h
      );
    }),
    (t.prototype.drawLine = function (e, i, r, n, o, s) {
      var a = document.createElementNS(t.svgNS, 'line');
      return (
        this._applyColor(a, 'stroke', this._stroke),
        null !== this._strokeWidth &&
          a.setAttribute('stroke-width', this._strokeWidth.toString()),
        a.setAttribute('x1', e.toFixed(1)),
        a.setAttribute('x2', r.toFixed(1)),
        a.setAttribute('y1', i.toFixed(1)),
        a.setAttribute('y2', n.toFixed(1)),
        o && a.setAttribute('class', o),
        this._applyStyle(a, s),
        this._appendChild(a),
        a
      );
    }),
    (t.prototype.drawLines = function (e, i, r, n, o) {
      if (e && i) {
        var s = Math.min(e.length, i.length);
        if (s > 0) {
          var a = document.createElementNS(t.svgNS, 'polyline');
          this._applyColor(a, 'stroke', this._stroke),
            null !== this._strokeWidth &&
              a.setAttribute('stroke-width', this._strokeWidth.toString()),
            a.setAttribute('fill', 'none');
          for (var h = '', l = 0; l < s; l++)
            h += e[l].toFixed(1) + ',' + i[l].toFixed(1) + ' ';
          return (
            a.setAttribute('points', h),
            r && a.setAttribute('class', r),
            o && a.setAttribute('clip-path', 'url(#' + o + ')'),
            this._applyStyle(a, n),
            this._appendChild(a),
            a
          );
        }
      }
      return null;
    }),
    (t.prototype.drawSplines = function (e, i, r, n, o) {
      if (e && i) {
        var s = new _Spline(e, i).calculate(),
          a = s.xs,
          h = s.ys,
          l = Math.min(a.length, h.length);
        if (l > 0) {
          var c = document.createElementNS(t.svgNS, 'polyline');
          this._applyColor(c, 'stroke', this._stroke),
            null !== this._strokeWidth &&
              c.setAttribute('stroke-width', this._strokeWidth.toString()),
            c.setAttribute('fill', 'none');
          for (var _ = '', u = 0; u < l; u++)
            _ += a[u].toFixed(1) + ',' + h[u].toFixed(1) + ' ';
          return (
            c.setAttribute('points', _),
            r && c.setAttribute('class', r),
            o && c.setAttribute('clip-path', 'url(#' + o + ')'),
            this._applyStyle(c, n),
            this._appendChild(c),
            c
          );
        }
      }
      return null;
    }),
    (t.prototype.drawPolygon = function (e, i, r, n, o) {
      if (e && i) {
        var s = Math.min(e.length, i.length);
        if (s > 0) {
          var a = document.createElementNS(t.svgNS, 'polygon');
          this._applyColor(a, 'stroke', this._stroke),
            null !== this._strokeWidth &&
              a.setAttribute('stroke-width', this._strokeWidth.toString()),
            this._applyColor(a, 'fill', this._fill);
          for (var h = '', l = 0; l < s; l++)
            h += e[l].toFixed(1) + ',' + i[l].toFixed(1) + ' ';
          return (
            a.setAttribute('points', h),
            r && a.setAttribute('class', r),
            o && a.setAttribute('clip-path', 'url(#' + o + ')'),
            this._applyStyle(a, n),
            this._appendChild(a),
            a
          );
        }
      }
      return null;
    }),
    (t.prototype.drawPieSegment = function (e, i, r, n, o, s, a, h) {
      if (o >= 2 * Math.PI) return this.drawEllipse(e, i, r, r, s, a);
      var l = document.createElementNS(t.svgNS, 'path');
      this._applyColor(l, 'fill', this._fill),
        this._applyColor(l, 'stroke', this._stroke),
        null !== this._strokeWidth &&
          l.setAttribute('stroke-width', this._strokeWidth.toString());
      var c = new wjcCore.Point(e, i);
      (c.x += r * Math.cos(n)), (c.y += r * Math.sin(n));
      var _ = n + o,
        u = new wjcCore.Point(e, i);
      (u.x += r * Math.cos(_)), (u.y += r * Math.sin(_));
      var p = ' 0 0,1 ';
      Math.abs(o) > Math.PI && (p = ' 0 1,1 ');
      var d = 'M ' + c.x.toFixed(1) + ',' + c.y.toFixed(1);
      return (
        (d += ' A ' + r.toFixed(1) + ',' + r.toFixed(1) + p),
        (d += u.x.toFixed(1) + ',' + u.y.toFixed(1)),
        (d += ' L ' + e.toFixed(1) + ',' + i.toFixed(1) + ' z'),
        l.setAttribute('d', d),
        h && l.setAttribute('clip-path', 'url(#' + h + ')'),
        s && l.setAttribute('class', s),
        this._applyStyle(l, a),
        this._appendChild(l),
        l
      );
    }),
    (t.prototype.drawDonutSegment = function (e, i, r, n, o, s, a, h, l) {
      var c = !1;
      s >= 2 * Math.PI && ((c = !0), (s -= 0.001));
      var _ = document.createElementNS(t.svgNS, 'path');
      this._applyColor(_, 'fill', this._fill),
        this._applyColor(_, 'stroke', this._stroke),
        null !== this._strokeWidth &&
          _.setAttribute('stroke-width', this._strokeWidth.toString());
      var u = new wjcCore.Point(e, i);
      (u.x += r * Math.cos(o)), (u.y += r * Math.sin(o));
      var p = o + s,
        d = new wjcCore.Point(e, i);
      (d.x += r * Math.cos(p)), (d.y += r * Math.sin(p));
      var f = new wjcCore.Point(e, i);
      (f.x += n * Math.cos(p)), (f.y += n * Math.sin(p));
      var g = new wjcCore.Point(e, i);
      (g.x += n * Math.cos(o)), (g.y += n * Math.sin(o));
      var m = ' 0 0,1 ',
        y = ' 0 0,0 ';
      Math.abs(s) > Math.PI && ((m = ' 0 1,1 '), (y = ' 0 1,0 '));
      var b = 'M ' + u.x.toFixed(3) + ',' + u.y.toFixed(3);
      return (
        (b += ' A ' + r.toFixed(3) + ',' + r.toFixed(3) + m),
        (b += d.x.toFixed(3) + ',' + d.y.toFixed(3)),
        (b += c
          ? ' M ' + f.x.toFixed(3) + ',' + f.y.toFixed(3)
          : ' L ' + f.x.toFixed(3) + ',' + f.y.toFixed(3)),
        (b += ' A ' + n.toFixed(3) + ',' + n.toFixed(3) + y),
        (b += g.x.toFixed(3) + ',' + g.y.toFixed(3)),
        c || (b += ' z'),
        _.setAttribute('d', b),
        l && _.setAttribute('clip-path', 'url(#' + l + ')'),
        a && _.setAttribute('class', a),
        this._applyStyle(_, h),
        this._appendChild(_),
        _
      );
    }),
    (t.prototype.drawString = function (t, e, i, r) {
      var n = this._createText(e, t);
      i && n.setAttribute('class', i),
        this._applyStyle(n, r),
        this._appendChild(n);
      var o = this._getBBox(n);
      return n.setAttribute('y', (e.y - (o.y + o.height - e.y)).toFixed(1)), n;
    }),
    (t.prototype.drawStringRotated = function (e, i, r, n, o, s) {
      var a = this._createText(i, e);
      o && a.setAttribute('class', o), this._applyStyle(a, s);
      var h = document.createElementNS(t.svgNS, 'g');
      h.setAttribute(
        'transform',
        'rotate(' +
          n.toFixed(1) +
          ',' +
          r.x.toFixed(1) +
          ',' +
          r.y.toFixed(1) +
          ')'
      ),
        h.appendChild(a),
        this._appendChild(h);
      var l = this._getBBox(a);
      return a.setAttribute('y', (i.y - (l.y + l.height - i.y)).toFixed(1)), a;
    }),
    (t.prototype.measureString = function (t, e, i, r) {
      var n = new wjcCore.Size(0, 0);
      this._fontSize && this._text.setAttribute('font-size', this._fontSize),
        this._fontFamily &&
          this._text.setAttribute('font-family', this._fontFamily),
        e && this._text.setAttribute('class', e),
        i && this._textGroup.setAttribute('class', i),
        this._applyStyle(this._text, r),
        this._setText(this._text, t);
      var o = this._getBBox(this._text);
      if (
        ((n.width = o.width),
        (n.height = o.height),
        this._text.removeAttribute('font-size'),
        this._text.removeAttribute('font-family'),
        this._text.removeAttribute('class'),
        r)
      )
        for (var s in r) this._text.removeAttribute(this._deCase(s));
      return (
        this._textGroup.removeAttribute('class'),
        (this._text.textContent = null),
        n
      );
    }),
    (t.prototype.startGroup = function (e, i, r) {
      void 0 === r && (r = !1);
      var n = document.createElementNS(t.svgNS, 'g');
      return (
        e && n.setAttribute('class', e),
        i && n.setAttribute('clip-path', 'url(#' + i + ')'),
        this._appendChild(n),
        r && n.transform.baseVal.appendItem(this._svg.createSVGTransform()),
        (this._group = n),
        n
      );
    }),
    (t.prototype.endGroup = function () {
      if (this._group) {
        var t = this._group.parentNode;
        t == this._svg ? (this._group = null) : (this._group = t);
      }
    }),
    (t.prototype.drawImage = function (e, i, r, n, o) {
      var s = document.createElementNS(t.svgNS, 'image');
      return (
        s.setAttributeNS(t.xlinkNS, 'href', e),
        s.setAttribute('x', i.toFixed(1)),
        s.setAttribute('y', r.toFixed(1)),
        s.setAttribute('width', n.toFixed(1)),
        s.setAttribute('height', o.toFixed(1)),
        this._appendChild(s),
        s
      );
    }),
    (t.prototype._appendChild = function (t) {
      var e = this._group;
      e || (e = this._svg), e.appendChild(t);
    }),
    (t.prototype._create = function () {
      (this._svg = document.createElementNS(t.svgNS, 'svg')),
        (this._defs = document.createElementNS(t.svgNS, 'defs')),
        this._svg.appendChild(this._defs),
        (this._text = this._createText(new wjcCore.Point(-1e3, -1e3), '')),
        (this._textGroup = document.createElementNS(t.svgNS, 'g')),
        this._textGroup.appendChild(this._text),
        this._svg.appendChild(this._textGroup);
    }),
    (t.prototype._setText = function (t, e) {
      var i = e ? e.toString() : null;
      if (i && i.indexOf('tspan') >= 0)
        try {
          t.textContent = null;
          for (
            var r = '<svg xmlns="http://www.w3.org/2000/svg">' + i + '</svg>',
              n = new DOMParser().parseFromString(r, 'text/xml').documentElement
                .firstChild;
            n;

          )
            t.appendChild(t.ownerDocument.importNode(n, !0)),
              (n = n.nextSibling);
        } catch (t) {
          throw new Error('Error parsing XML string.');
        }
      else t.textContent = i;
    }),
    (t.prototype._createText = function (e, i) {
      var r = document.createElementNS(t.svgNS, 'text');
      return (
        this._setText(r, i),
        r.setAttribute('fill', this._textFill),
        r.setAttribute('x', e.x.toFixed(1)),
        r.setAttribute('y', e.y.toFixed(1)),
        this._fontSize && r.setAttribute('font-size', this._fontSize),
        this._fontFamily && r.setAttribute('font-family', this._fontFamily),
        r
      );
    }),
    (t.prototype._applyStyle = function (t, e) {
      if (e)
        for (var i in e)
          'fill' === i || 'stroke' === i
            ? this._applyColor(t, i, e[i])
            : t.setAttribute(this._deCase(i), e[i]);
    }),
    (t.prototype._deCase = function (t) {
      return t.replace(/[A-Z]/g, function (t) {
        return '-' + t.toLowerCase();
      });
    }),
    (t.prototype._getBBox = function (e) {
      if (!t._isff) return e.getBBox();
      try {
        return e.getBBox();
      } catch (t) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }
    }),
    (t.prototype._applyColor = function (e, i, r) {
      var n = _GradientColorUtil.tryParse(r);
      if (null != n)
        if (wjcCore.isString(n)) e.setAttribute(i, n);
        else {
          if (null == this._savedGradient[r]) {
            var o,
              s = 'gc' + (1e6 * Math.random()).toFixed();
            null != n.x1
              ? ((o = document.createElementNS(t.svgNS, 'linearGradient')),
                ['x1', 'y1', 'x2', 'y2', 'gradientUnits'].forEach(function (t) {
                  null != n[t] && o.setAttribute(t, n[t]);
                }))
              : null != n.r &&
                ((o = document.createElementNS(t.svgNS, 'radialGradient')),
                ['cx', 'cy', 'r', 'fx', 'fy', 'fr', 'gradientUnits'].forEach(
                  function (t) {
                    null != n[t] && o.setAttribute(t, n[t]);
                  }
                )),
              n.colors &&
                n.colors &&
                n.colors.length > 0 &&
                n.colors.forEach(function (e) {
                  var i = document.createElementNS(t.svgNS, 'stop');
                  null != e.color && i.setAttribute('stop-color', e.color),
                    null != e.offset && i.setAttribute('offset', e.offset),
                    null != e.opacity &&
                      i.setAttribute('stop-opacity', e.opacity),
                    o.appendChild(i);
                }),
              o.setAttribute('id', s),
              this._defs.appendChild(o),
              (this._savedGradient[r] = s);
          }
          e.setAttribute(i, 'url(#' + this._savedGradient[r] + ')');
        }
    }),
    (t.svgNS = 'http://www.w3.org/2000/svg'),
    (t.xlinkNS = 'http://www.w3.org/1999/xlink'),
    t
  );
})();
exports._SvgRenderEngine = _SvgRenderEngine;
var _GradientColorUtil = (function () {
    function t() {}
    return (
      (t.tryParse = function (e) {
        if (t.parsedColor[e]) return t.parsedColor[e];
        if (null == e || -1 === e.indexOf('-')) return e;
        var i,
          r = e.replace(/\s+/g, '').split(/\-/g),
          n = r[0][0],
          o = !1,
          s = r[0]
            .match(/\(\S+\)/)[0]
            .replace(/[\(\\)]/g, '')
            .split(/\,/g);
        'l' === n || 'L' === n
          ? ((i = { x1: '0', y1: '0', x2: '0', y2: '0', colors: [] }),
            'l' === n && (o = !0),
            ['x1', 'y1', 'x2', 'y2'].forEach(function (t, e) {
              null != s[e] && (i[t] = o ? 100 * +s[e] + '%' : s[e] + '');
            }))
          : ('r' !== n && 'R' !== n) ||
            ((i = { cx: '0', cy: '0', r: '0', colors: [] }),
            'r' === n && (o = !0),
            ['cx', 'cy', 'r', 'fx', 'fy', 'fr'].forEach(function (t, e) {
              null != s[e] &&
                '' !== s[e] &&
                (i[t] = o ? 100 * +s[e] + '%' : s[e] + '');
            })),
          o || (i.gradientUnits = 'userSpaceOnUse'),
          (t.parsedColor[e] = i);
        var a = r.length - 1;
        return (
          r.forEach(function (t, e) {
            t.indexOf(')') > -1 && (t = t.match(/\)\S+/)[0].replace(')', ''));
            var r = t.split(':'),
              n = { color: 'black' };
            null != r[0] && (n.color = r[0]),
              null != r[1]
                ? (n.offset = o ? 100 * +r[1] + '%' : r[1] + '')
                : (n.offset = (e / a) * 100 + '%'),
              null != r[2] && (n.opacity = r[2]),
              i.colors.push(n);
          }),
          i
        );
      }),
      (t.parsedColor = {}),
      t
    );
  })(),
  Legend = (function () {
    function t(t) {
      (this._position = Position.Right),
        (this._title = ''),
        (this._titleAlign = 'left'),
        (this._titlePadding = 5),
        (this._areas = new Array()),
        (this._sz = new wjcCore.Size()),
        (this._colRowLens = []),
        (this._chart = t);
    }
    return (
      Object.defineProperty(t.prototype, 'position', {
        get: function () {
          return this._position;
        },
        set: function (t) {
          t != this._position &&
            ((this._position = wjcCore.asEnum(t, Position)),
            this._chart && this._chart.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'title', {
        get: function () {
          return this._title;
        },
        set: function (t) {
          t != this._title &&
            ((this._title = wjcCore.asString(t, !1)),
            this._chart && this._chart.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'titleAlign', {
        get: function () {
          return this._titleAlign;
        },
        set: function (t) {
          if (t != this._titleAlign) {
            var e = wjcCore.asString(t, !1);
            (this._titleAlign =
              'right' === e ? 'right' : 'center' === e ? 'center' : 'left'),
              this._chart && this._chart.invalidate();
          }
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype._getDesiredSize = function (t, e, i, r) {
        if (e == Position.None) return null;
        var n = e == Position.Right || e == Position.Left,
          o = this._chart._getDesiredLegendSize(t, n, i, r);
        if (null != o) {
          if (this.title.length > 0) {
            var s = t.measureString(this.title, 'wj-title', 'wj-legend');
            (o.height += s.height + this._titlePadding),
              s.width > o.width && (o.width = s.width);
          }
          this._sz = o;
        }
        return o;
      }),
      (t.prototype._getPosition = function (t, e) {
        return this.position == Position.Auto
          ? t >= e
            ? Position.Right
            : Position.Bottom
          : this.position;
      }),
      (t.prototype._render = function (t, e, i, r, n) {
        this._areas = [];
        var o = i == Position.Right || i == Position.Left;
        if (
          ((t.fill = 'transparent'),
          (t.stroke = null),
          t.drawRect(e.x, e.y, this._sz.width, this._sz.height),
          this.title.length)
        ) {
          var s = t.drawString(this.title, e, 'wj-title'),
            a = s.getBBox();
          s.setAttribute('y', Number(s.getAttribute('y')) + a.height),
            'right' === this.titleAlign
              ? s.setAttribute('x', e.x + r - a.width)
              : 'center' === this.titleAlign &&
                s.setAttribute('x', e.x + r / 2 - a.width / 2);
          var h = a.height + this._titlePadding;
          (e.y += h), (n -= h);
        }
        this._chart._renderLegend(t, e, this._areas, o, r, n);
      }),
      (t.prototype._hitTest = function (t) {
        for (var e = this._areas, i = 0; i < e.length; i++)
          if (e[i] && FlexChartCore._contains(e[i], t)) return i;
        return null;
      }),
      t
    );
  })();
exports.Legend = Legend;
var ChartElement;
!(function (t) {
  (t[(t.PlotArea = 0)] = 'PlotArea'),
    (t[(t.AxisX = 1)] = 'AxisX'),
    (t[(t.AxisY = 2)] = 'AxisY'),
    (t[(t.ChartArea = 3)] = 'ChartArea'),
    (t[(t.Legend = 4)] = 'Legend'),
    (t[(t.Header = 5)] = 'Header'),
    (t[(t.Footer = 6)] = 'Footer'),
    (t[(t.Series = 7)] = 'Series'),
    (t[(t.SeriesSymbol = 8)] = 'SeriesSymbol'),
    (t[(t.DataLabel = 9)] = 'DataLabel'),
    (t[(t.None = 10)] = 'None');
})((ChartElement = exports.ChartElement || (exports.ChartElement = {})));
var HitTestInfo = (function () {
  function t(t, e, i) {
    (this._pointIndex = null),
      (this._chartElement = ChartElement.None),
      (this._chart = t),
      (this._pt = e),
      (this._chartElement = i);
  }
  return (
    Object.defineProperty(t.prototype, 'chart', {
      get: function () {
        return this._chart;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'point', {
      get: function () {
        return this._pt;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'series', {
      get: function () {
        return this._series;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pointIndex', {
      get: function () {
        return this._pointIndex;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'chartElement', {
      get: function () {
        return this._chartElement;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'distance', {
      get: function () {
        return this._dist;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'item', {
      get: function () {
        if (null == this._item && null !== this.pointIndex)
          if (null != this.series)
            this._item = this.series._getItem(this.pointIndex);
          else {
            var t = this._chart._getHitTestItem(this.pointIndex);
            t && (this._item = t);
          }
        return this._item;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'x', {
      get: function () {
        return void 0 === this._x && (this._x = this._getValue(1, !1)), this._x;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'y', {
      get: function () {
        return void 0 === this._y && (this._y = this._getValue(0, !1)), this._y;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'value', {
      get: function () {
        var t = this._chart._getHitTestValue(this.pointIndex);
        return null != t ? t : this.y;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'name', {
      get: function () {
        if (void 0 === this._name) {
          var t = this._chart._getHitTestLabel(this.pointIndex);
          return null == t ? this.series.name : t.toString();
        }
        return this._name;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_xfmt', {
      get: function () {
        return (
          void 0 === this.__xfmt && (this.__xfmt = this._getValue(1, !0)),
          this.__xfmt
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_yfmt', {
      get: function () {
        return (
          void 0 === this.__yfmt && (this.__yfmt = this._getValue(0, !0)),
          this.__yfmt
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._setData = function (t, e) {
      (this._series = t), (this._pointIndex = e);
    }),
    (t.prototype._setDataPoint = function (t) {
      if ((t = wjcCore.asType(t, _DataPoint, !0))) {
        this._pointIndex = t.pointIndex;
        var e = wjcCore.asType(this._chart, FlexChartCore, !0),
          i = t.seriesIndex;
        null !== i &&
          i >= 0 &&
          i < e.series.length &&
          (this._series = e.series[i]),
          null != t.item && (this._item = t.item),
          null != t.x && (this._x = t.x),
          null != t.y && (this._y = t.y),
          null != t.xfmt && (this.__xfmt = t.xfmt),
          null != t.yfmt && (this.__yfmt = t.yfmt),
          null != t.name && (this._name = t.name);
      }
    }),
    (t.prototype._getValue = function (t, e) {
      var i = this._chart._getHitTestValue(this.pointIndex);
      if (null != i) return i;
      var r = null,
        n = this._chart,
        o = this.pointIndex,
        s = n._isRotated();
      if (null !== this.series && null !== o) {
        var a = this.series.getValues(t),
          h = this.series.getDataType(t);
        a && this.pointIndex < a.length
          ? ((r = a[this.pointIndex]),
            h != wjcCore.DataType.Date || e || (r = new Date(r)))
          : 1 == t &&
            (n._xlabels && n._xlabels.length > 0 && o < n._xlabels.length
              ? (r = n._xlabels[o])
              : n._xvals &&
                o < n._xvals.length &&
                ((r = n._xvals[o]),
                n._xDataType != wjcCore.DataType.Date ||
                  e ||
                  (r = new Date(r))));
      }
      return (
        null !== r &&
          e &&
          (s
            ? 0 == t
              ? (r = this.ax._formatValue(r))
              : 1 == t && (r = this.ay._formatValue(r))
            : 0 == t
            ? (r = this.ay._formatValue(r))
            : 1 == t && (r = this.ax._formatValue(r))),
        r
      );
    }),
    Object.defineProperty(t.prototype, 'ax', {
      get: function () {
        return this.series.axisX ? this.series.axisX : this._chart.axisX;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'ay', {
      get: function () {
        return this.series.axisY ? this.series.axisY : this._chart.axisY;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})();
exports.HitTestInfo = HitTestInfo;
var Palettes = (function () {
  function t() {}
  return (
    (t.standard = [
      '#88bde6',
      '#fbb258',
      '#90cd97',
      '#f6aac9',
      '#bfa554',
      '#bc99c7',
      '#eddd46',
      '#f07e6e',
      '#8c8c8c',
    ]),
    (t.cocoa = [
      '#466bb0',
      '#c8b422',
      '#14886e',
      '#b54836',
      '#6e5944',
      '#8b3872',
      '#73b22b',
      '#b87320',
      '#141414',
    ]),
    (t.coral = [
      '#84d0e0',
      '#f48256',
      '#95c78c',
      '#efa5d6',
      '#ba8452',
      '#ab95c2',
      '#ede9d0',
      '#e96b7d',
      '#888888',
    ]),
    (t.dark = [
      '#005fad',
      '#f06400',
      '#009330',
      '#e400b1',
      '#b65800',
      '#6a279c',
      '#d5a211',
      '#dc0127',
      '#000000',
    ]),
    (t.highcontrast = [
      '#ff82b0',
      '#0dda2c',
      '#0021ab',
      '#bcf28c',
      '#19c23b',
      '#890d3a',
      '#607efd',
      '#1b7700',
      '#000000',
    ]),
    (t.light = [
      '#ddca9a',
      '#778deb',
      '#cb9fbb',
      '#b5eae2',
      '#7270be',
      '#a6c7a7',
      '#9e95c7',
      '#95b0c7',
      '#9b9b9b',
    ]),
    (t.midnight = [
      '#83aaca',
      '#e37849',
      '#14a46a',
      '#e097da',
      '#a26d54',
      '#a584b7',
      '#d89c54',
      '#e86996',
      '#2c343b',
    ]),
    (t.modern = [
      '#2d9fc7',
      '#ec993c',
      '#89c235',
      '#e377a4',
      '#a68931',
      '#a672a6',
      '#d0c041',
      '#e35855',
      '#68706a',
    ]),
    (t.organic = [
      '#9c88d9',
      '#a3d767',
      '#8ec3c0',
      '#e9c3a9',
      '#91ab36',
      '#d4ccc0',
      '#61bbd8',
      '#e2d76f',
      '#80715a',
    ]),
    (t.slate = [
      '#7493cd',
      '#f99820',
      '#71b486',
      '#e4a491',
      '#cb883b',
      '#ae83a4',
      '#bacc5c',
      '#e5746a',
      '#505d65',
    ]),
    (t.zen = [
      '#7bb5ae',
      '#e2d287',
      '#92b8da',
      '#eac4cb',
      '#7b8bbd',
      '#c7d189',
      '#b9a0c8',
      '#dfb397',
      '#a9a9a9',
    ]),
    (t.cyborg = [
      '#2a9fd6',
      '#77b300',
      '#9933cc',
      '#ff8800',
      '#cc0000',
      '#00cca3',
      '#3d6dcc',
      '#525252',
      '#000000',
    ]),
    (t.superhero = [
      '#5cb85c',
      '#f0ad4e',
      '#5bc0de',
      '#d9534f',
      '#9f5bde',
      '#46db8c',
      '#b6b86e',
      '#4e5d6c',
      '#2b3e4b',
    ]),
    (t.flatly = [
      '#18bc9c',
      '#3498db',
      '#f39c12',
      '#6cc1be',
      '#99a549',
      '#8f54b5',
      '#e74c3c',
      '#8a9899',
      '#2c3e50',
    ]),
    (t.darkly = [
      '#375a7f',
      '#00bc8c',
      '#3498db',
      '#f39c12',
      '#e74c3c',
      '#8f61b3',
      '#b08725',
      '#4a4949',
      '#000000',
    ]),
    (t.cerulan = [
      '#033e76',
      '#87c048',
      '#59822c',
      '#53b3eb',
      '#fc6506',
      '#d42323',
      '#e3bb00',
      '#cccccc',
      '#222222',
    ]),
    t
  );
})();
exports.Palettes = Palettes;
var _Spline = (function () {
  function t(t, e) {
    (this.k = 0.002),
      (this._a = []),
      (this._b = []),
      (this._c = []),
      (this._d = []),
      (this.m = [
        [-0.5, 1.5, -1.5, 0.5],
        [1, -2.5, 2, -0.5],
        [-0.5, 0, 0.5, 0],
        [0, 1, 0, 0],
      ]),
      (this._x = t),
      (this._y = e);
    var i = (this._len = Math.min(t.length, e.length));
    if (i > 3)
      for (var r = 0; r < i - 1; r++) {
        var n =
            0 == r
              ? new wjcCore.Point(t[r], e[r])
              : new wjcCore.Point(t[r - 1], e[r - 1]),
          o = new wjcCore.Point(t[r], e[r]),
          s = new wjcCore.Point(t[r + 1], e[r + 1]),
          a =
            r == i - 2
              ? new wjcCore.Point(t[r + 1], e[r + 1])
              : new wjcCore.Point(t[r + 2], e[r + 2]),
          h = new wjcCore.Point(),
          l = new wjcCore.Point(),
          c = new wjcCore.Point(),
          _ = new wjcCore.Point();
        (h.x =
          n.x * this.m[0][0] +
          o.x * this.m[0][1] +
          s.x * this.m[0][2] +
          a.x * this.m[0][3]),
          (l.x =
            n.x * this.m[1][0] +
            o.x * this.m[1][1] +
            s.x * this.m[1][2] +
            a.x * this.m[1][3]),
          (c.x =
            n.x * this.m[2][0] +
            o.x * this.m[2][1] +
            s.x * this.m[2][2] +
            a.x * this.m[2][3]),
          (_.x =
            n.x * this.m[3][0] +
            o.x * this.m[3][1] +
            s.x * this.m[3][2] +
            a.x * this.m[3][3]),
          (h.y =
            n.y * this.m[0][0] +
            o.y * this.m[0][1] +
            s.y * this.m[0][2] +
            a.y * this.m[0][3]),
          (l.y =
            n.y * this.m[1][0] +
            o.y * this.m[1][1] +
            s.y * this.m[1][2] +
            a.y * this.m[1][3]),
          (c.y =
            n.y * this.m[2][0] +
            o.y * this.m[2][1] +
            s.y * this.m[2][2] +
            a.y * this.m[2][3]),
          (_.y =
            n.y * this.m[3][0] +
            o.y * this.m[3][1] +
            s.y * this.m[3][2] +
            a.y * this.m[3][3]),
          this._a.push(h),
          this._b.push(l),
          this._c.push(c),
          this._d.push(_);
      }
  }
  return (
    (t.prototype.calculatePoint = function (t) {
      var e = Math.floor(t);
      e < 0 && (e = 0), e > this._len - 2 && (e = this._len - 2);
      var i = t - e;
      return {
        x:
          ((this._a[e].x * i + this._b[e].x) * i + this._c[e].x) * i +
          this._d[e].x,
        y:
          ((this._a[e].y * i + this._b[e].y) * i + this._c[e].y) * i +
          this._d[e].y,
      };
    }),
    (t.prototype.calculate = function () {
      if (this._len <= 3) return { xs: this._x, ys: this._y };
      var t = [],
        e = [],
        i = this.calculatePoint(0);
      t.push(i.x), e.push(i.y);
      for (var r = this._len * this.k, n = r; n <= this._len - 1; n += r) {
        var o = this.calculatePoint(n);
        (Math.abs(i.x - o.x) >= 3 || Math.abs(i.y - o.y) >= 3) &&
          (t.push(o.x), e.push(o.y), (i = o));
      }
      return { xs: t, ys: e };
    }),
    t
  );
})();
exports._Spline = _Spline;
var LabelPosition;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Left = 1)] = 'Left'),
    (t[(t.Top = 2)] = 'Top'),
    (t[(t.Right = 3)] = 'Right'),
    (t[(t.Bottom = 4)] = 'Bottom'),
    (t[(t.Center = 5)] = 'Center');
})((LabelPosition = exports.LabelPosition || (exports.LabelPosition = {})));
var PieLabelPosition;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Inside = 1)] = 'Inside'),
    (t[(t.Center = 2)] = 'Center'),
    (t[(t.Outside = 3)] = 'Outside');
})(
  (PieLabelPosition =
    exports.PieLabelPosition || (exports.PieLabelPosition = {}))
);
var DataLabelRenderEventArgs = (function (t) {
  function e(e, i, r, n) {
    var o = t.call(this, e) || this;
    return (o.cancel = !1), (o._ht = i), (o._pt = r), (o._text = n), o;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'point', {
      get: function () {
        return this._pt;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'text', {
      get: function () {
        return this._text;
      },
      set: function (t) {
        this._text = wjcCore.asString(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'hitTestInfo', {
      get: function () {
        return this._ht;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(RenderEventArgs);
exports.DataLabelRenderEventArgs = DataLabelRenderEventArgs;
var DataLabelBase = (function () {
  function t() {
    this.rendering = new wjcCore.Event();
  }
  return (
    Object.defineProperty(t.prototype, 'content', {
      get: function () {
        return this._content;
      },
      set: function (t) {
        t != this._content && ((this._content = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'border', {
      get: function () {
        return this._bdr;
      },
      set: function (t) {
        t != this._bdr &&
          ((this._bdr = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'offset', {
      get: function () {
        return this._off;
      },
      set: function (t) {
        t != this._off &&
          ((this._off = wjcCore.asNumber(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'connectingLine', {
      get: function () {
        return this._line;
      },
      set: function (t) {
        t != this._line &&
          ((this._line = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onRendering = function (t) {
      return this.rendering.raise(this, t), !t.cancel;
    }),
    (t.prototype._invalidate = function () {
      this._chart && this._chart.invalidate();
    }),
    t
  );
})();
exports.DataLabelBase = DataLabelBase;
var DataLabel = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (e._pos = LabelPosition.Top), e;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'position', {
      get: function () {
        return this._pos;
      },
      set: function (t) {
        t != this._pos &&
          ((this._pos = wjcCore.asEnum(t, LabelPosition)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(DataLabelBase);
exports.DataLabel = DataLabel;
var PieDataLabel = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (e._pos = PieLabelPosition.Center), e;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'position', {
      get: function () {
        return this._pos;
      },
      set: function (t) {
        t != this._pos &&
          ((this._pos = wjcCore.asEnum(t, PieLabelPosition)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(DataLabelBase);
exports.PieDataLabel = PieDataLabel;
var LineMarkers = (function () {
    function t() {
      (this._moveMarker = function (t) {
        var e = t.currentTarget,
          i = this._markers,
          r = e.getAttribute('data-markerIndex');
        null != r &&
          i[r].forEach(function (e) {
            e._moveMarker(t);
          });
      }),
        (this._markers = []),
        (this._bindMoveMarker = this._moveMarker.bind(this));
    }
    return (
      (t.prototype.attach = function (t) {
        var e,
          i,
          r = t.chart.hostElement,
          n = this._markers,
          o = r.getAttribute('data-markerIndex');
        null != o
          ? (i = n[o]) && wjcCore.isArray(i)
            ? i.push(t)
            : ((n[o] = [t]), this._bindMoveEvent(r))
          : ((e = n.length),
            (i = [t]),
            n.push(i),
            r.setAttribute('data-markerIndex', e),
            this._bindMoveEvent(r));
      }),
      (t.prototype.detach = function (t) {
        var e,
          i,
          r = t.chart.hostElement,
          n = this._markers,
          o = r.getAttribute('data-markerIndex');
        null != o &&
          ((e = (i = n[o]).indexOf(t)) > -1 && i.splice(e, 1),
          0 === i.length &&
            ((e = n.indexOf(i)) > -1 && (n[e] = void 0),
            this._unbindMoveEvent(r)));
      }),
      (t.prototype._unbindMoveEvent = function (t) {
        var e = this._bindMoveMarker;
        t.removeEventListener('mousemove', e),
          'ontouchstart' in window && t.removeEventListener('touchmove', e);
      }),
      (t.prototype._bindMoveEvent = function (t) {
        var e = this._bindMoveMarker;
        t.addEventListener('mousemove', e),
          'ontouchstart' in window && t.addEventListener('touchmove', e);
      }),
      t
    );
  })(),
  lineMarkers = new LineMarkers(),
  LineMarkerLines;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Vertical = 1)] = 'Vertical'),
    (t[(t.Horizontal = 2)] = 'Horizontal'),
    (t[(t.Both = 3)] = 'Both');
})(
  (LineMarkerLines = exports.LineMarkerLines || (exports.LineMarkerLines = {}))
);
var LineMarkerInteraction;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Move = 1)] = 'Move'),
    (t[(t.Drag = 2)] = 'Drag');
})(
  (LineMarkerInteraction =
    exports.LineMarkerInteraction || (exports.LineMarkerInteraction = {}))
);
var LineMarkerAlignment;
!(function (t) {
  (t[(t.Auto = 2)] = 'Auto'),
    (t[(t.Right = 0)] = 'Right'),
    (t[(t.Left = 1)] = 'Left'),
    (t[(t.Bottom = 4)] = 'Bottom'),
    (t[(t.Top = 6)] = 'Top');
})(
  (LineMarkerAlignment =
    exports.LineMarkerAlignment || (exports.LineMarkerAlignment = {}))
);
var LineMarker = (function () {
  function t(t, e) {
    (this._wrapperMousedown = null),
      (this._wrapperMouseup = null),
      (this.positionChanged = new wjcCore.Event());
    var i = this;
    (i._chart = t),
      t.rendered.addHandler(i._initialize, i),
      i._resetDefaultValue(),
      wjcCore.copy(this, e),
      i._initialize();
  }
  return (
    Object.defineProperty(t.prototype, 'chart', {
      get: function () {
        return this._chart;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isVisible', {
      get: function () {
        return this._isVisible;
      },
      set: function (t) {
        var e = this;
        t !== e._isVisible &&
          ((e._isVisible = wjcCore.asBoolean(t)),
          e._marker && e._toggleVisibility());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'seriesIndex', {
      get: function () {
        return this._seriesIndex;
      },
      set: function (t) {
        var e = this;
        t !== e._seriesIndex && (e._seriesIndex = wjcCore.asNumber(t, !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'horizontalPosition', {
      get: function () {
        return this._horizontalPosition;
      },
      set: function (t) {
        var e = this;
        if (t !== e._horizontalPosition) {
          if (
            ((e._horizontalPosition = wjcCore.asNumber(t, !0)),
            e._horizontalPosition < 0 || e._horizontalPosition > 1)
          )
            throw "horizontalPosition's value should be in (0, 1).";
          e._marker && e._updateMarkerPosition();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'x', {
      get: function () {
        var t = this,
          e = t._targetPoint.x - t._plotRect.left;
        return t._chart.axisX.convertBack(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'y', {
      get: function () {
        var t = this,
          e = t._targetPoint.y - t._plotRect.top;
        return t._chart.axisY.convertBack(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'content', {
      get: function () {
        return this._content;
      },
      set: function (t) {
        t !== this._content &&
          ((this._content = wjcCore.asFunction(t)),
          this._updateMarkerPosition());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'verticalPosition', {
      get: function () {
        return this._verticalPosition;
      },
      set: function (t) {
        var e = this;
        if (t !== e._verticalPosition) {
          if (
            ((e._verticalPosition = wjcCore.asNumber(t, !0)),
            e._verticalPosition < 0 || e._verticalPosition > 1)
          )
            throw "verticalPosition's value should be in (0, 1).";
          e._marker && e._updateMarkerPosition();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'alignment', {
      get: function () {
        return this._alignment;
      },
      set: function (t) {
        var e = this;
        t !== e._alignment &&
          ((e._alignment = t), e._marker && e._updatePositionByAlignment());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'lines', {
      get: function () {
        return this._lines;
      },
      set: function (t) {
        var e = this;
        t !== e._lines &&
          ((e._lines = wjcCore.asEnum(t, LineMarkerLines)),
          e._marker && e._resetLinesVisibility());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'interaction', {
      get: function () {
        return this._interaction;
      },
      set: function (t) {
        var e = this;
        t !== e._interaction &&
          (e._marker && e._detach(),
          (e._interaction = wjcCore.asEnum(t, LineMarkerInteraction)),
          e._marker && e._attach(),
          e._toggleElesDraggableClass(
            e._interaction === LineMarkerInteraction.Drag
          ));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dragThreshold', {
      get: function () {
        return this._dragThreshold;
      },
      set: function (t) {
        t != this._dragThreshold && (this._dragThreshold = wjcCore.asNumber(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dragContent', {
      get: function () {
        return this._dragContent;
      },
      set: function (e) {
        var i = this;
        e !== i._dragContent && (i._dragContent = wjcCore.asBoolean(e)),
          wjcCore.toggleClass(
            i._dragEle,
            t._CSS_LINE_DRAGGABLE,
            i._interaction === LineMarkerInteraction.Drag &&
              i._dragContent &&
              i._lines !== LineMarkerLines.None
          );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dragLines', {
      get: function () {
        return this._dragLines;
      },
      set: function (t) {
        t != this._dragLines && (this._dragLines = wjcCore.asBoolean(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onPositionChanged = function (t) {
      this.positionChanged.raise(this, t);
    }),
    (t.prototype.remove = function () {
      var t = this,
        e = t._chart;
      t._marker &&
        (e.rendered.removeHandler(t._initialize, t),
        t._detach(),
        t._removeMarker(),
        (t._wrapperMoveMarker = null),
        (t._wrapperMousedown = null),
        (t._wrapperMouseup = null));
    }),
    (t.prototype._attach = function () {
      var e = this,
        i = e._chart.hostElement;
      this._interaction !== LineMarkerInteraction.None
        ? wjcCore.addClass(i, t._CSS_TOUCH_DISABLED)
        : wjcCore.removeClass(i, t._CSS_TOUCH_DISABLED),
        lineMarkers.attach(e),
        e._attachDrag();
    }),
    (t.prototype._attachDrag = function () {
      var t = this;
      t._interaction === LineMarkerInteraction.Drag &&
        (t._wrapperMousedown || (t._wrapperMousedown = t._onMousedown.bind(t)),
        t._wrapperMouseup || (t._wrapperMouseup = t._onMouseup.bind(t)),
        t._toggleDragEventAttach(!0));
    }),
    (t.prototype._detach = function () {
      var e = this;
      wjcCore.removeClass(e._chart.hostElement, t._CSS_TOUCH_DISABLED),
        lineMarkers.detach(e),
        e._detachDrag();
    }),
    (t.prototype._detachDrag = function () {
      var t = this;
      t._interaction === LineMarkerInteraction.Drag &&
        t._toggleDragEventAttach(!1);
    }),
    (t.prototype._toggleDragEventAttach = function (t) {
      var e = this,
        i = e._chart.hostElement,
        r = t ? 'addEventListener' : 'removeEventListener';
      i[r]('mousedown', e._wrapperMousedown),
        document[r]('mouseup', e._wrapperMouseup),
        'ontouchstart' in window && i[r]('touchstart', e._wrapperMousedown),
        'ontouchend' in window && document[r]('touchend', e._wrapperMouseup);
    }),
    (t.prototype._onMousedown = function (e) {
      var i,
        r,
        n,
        o,
        s,
        a = this,
        h = a._getEventPoint(e);
      a._interaction === LineMarkerInteraction.Drag &&
        ((o = !(
          0 === (i = wjcCore.getElementRect(a._hLine)).width || 0 === i.height
        )),
        (s = !(
          0 === (r = wjcCore.getElementRect(a._vLine)).width || 0 === r.height
        )),
        (n = wjcCore.getElementRect(a._markerContent)),
        a._dragContent && a._pointInRect(h, n)
          ? ((a._capturedEle = a._markerContent),
            (a._contentDragStartPoint = new wjcCore.Point(h.x, h.y)),
            (a._mouseDownCrossPoint = new wjcCore.Point(
              a._targetPoint.x,
              a._targetPoint.y
            )))
          : o &&
            (Math.abs(i.top - h.y) <= a._dragThreshold ||
              Math.abs(h.y - i.top - i.height) <= a._dragThreshold ||
              (h.y >= i.top && h.y <= i.top + i.height))
          ? ((a._capturedEle = a._hLine),
            (a._contentDragStartPoint = void 0),
            wjcCore.addClass(a._chart.hostElement, t._CSS_LINE_DRAGGABLE))
          : s &&
            (Math.abs(r.left - h.x) <= a._dragThreshold ||
              Math.abs(h.x - r.left - r.width) <= a._dragThreshold ||
              (h.x >= r.left && h.x <= r.left + r.width)) &&
            ((a._capturedEle = a._vLine),
            (a._contentDragStartPoint = void 0),
            wjcCore.addClass(a._chart.hostElement, t._CSS_LINE_DRAGGABLE)),
        e.preventDefault());
    }),
    (t.prototype._onMouseup = function (e) {
      var i = this,
        r =
          i._alignment === LineMarkerAlignment.Auto &&
          i._capturedEle === i._markerContent &&
          i._lines !== LineMarkerLines.None;
      (i._capturedEle = void 0),
        (i._contentDragStartPoint = void 0),
        (i._mouseDownCrossPoint = void 0),
        r && (i._updatePositionByAlignment(), i._updatePositionByAlignment()),
        wjcCore.removeClass(i._chart.hostElement, t._CSS_LINE_DRAGGABLE);
    }),
    (t.prototype._moveMarker = function (t) {
      var e,
        i,
        r,
        n,
        o,
        s,
        a = this,
        h = a._chart,
        l = a._getEventPoint(t),
        c = a._plotRect,
        _ = a._interaction === LineMarkerInteraction.Drag,
        u = a._lines === LineMarkerLines.Horizontal,
        p = a._lines === LineMarkerLines.Vertical,
        d = a._seriesIndex,
        f = wjcCore.getElementRect(h.hostElement);
      if (
        c &&
        a._isVisible &&
        a._interaction !== LineMarkerInteraction.None &&
        (a._interaction !== LineMarkerInteraction.Drag ||
          (a._capturedEle && a._lines !== LineMarkerLines.None))
      ) {
        if (
          (_ &&
            (a._contentDragStartPoint
              ? ((l.x = u
                  ? a._targetPoint.x
                  : a._mouseDownCrossPoint.x +
                    l.x -
                    a._contentDragStartPoint.x),
                (l.y = p
                  ? a._targetPoint.y
                  : a._mouseDownCrossPoint.y +
                    l.y -
                    a._contentDragStartPoint.y))
              : u || (!a._dragLines && a._capturedEle === a._hLine)
              ? (l.x = a._targetPoint.x)
              : (p || (!a._dragLines && a._capturedEle === a._vLine)) &&
                (l.y = a._targetPoint.y)),
          (_ && a._lines === LineMarkerLines.Horizontal) ||
            (!a._dragLines && a._capturedEle === a._hLine))
        ) {
          if (l.y <= c.top || l.y >= c.top + c.height) return;
        } else if (
          (_ && a._lines === LineMarkerLines.Vertical) ||
          (!a._dragLines && a._capturedEle === a._vLine)
        ) {
          if (l.x <= c.left || l.x >= c.left + c.width) return;
        } else if (
          l.x <= c.left ||
          l.y <= c.top ||
          l.x >= c.left + c.width ||
          l.y >= c.top + c.height
        )
          return;
        if (null != d && d >= 0 && d < h.series.length) {
          if (
            ((e = h.series[d]),
            null == (i = e.hitTest(new wjcCore.Point(l.x, NaN))) ||
              null == i.x ||
              null == i.y)
          )
            return;
          (r = e.axisX || h.axisX),
            (n = e._getAxisY()),
            (o = wjcCore.isDate(i.x) ? FlexChart._toOADate(i.x) : i.x),
            (o = wjcCore.isString(o) ? i.pointIndex : o),
            (s = wjcCore.isDate(i.y) ? FlexChart._toOADate(i.y) : i.y),
            (l.x = r.convert(o) + f.left),
            (l.y = n.convert(s) + f.top);
        }
        a._updateMarkerPosition(l), t.preventDefault();
      }
    }),
    (t.prototype._show = function (t) {
      (t || this._marker).style.display = 'block';
    }),
    (t.prototype._hide = function (t) {
      (t || this._marker).style.display = 'none';
    }),
    (t.prototype._toggleVisibility = function () {
      this._isVisible ? this._show() : this._hide();
    }),
    (t.prototype._resetDefaultValue = function () {
      var t = this;
      (t._isVisible = !0),
        (t._alignment = LineMarkerAlignment.Auto),
        (t._lines = LineMarkerLines.None),
        (t._interaction = LineMarkerInteraction.None),
        (t._horizontalPosition = null),
        (t._verticalPosition = null),
        (t._content = null),
        (t._seriesIndex = null),
        (t._dragThreshold = 15),
        (t._dragContent = !1),
        (t._dragLines = !1),
        (t._targetPoint = new wjcCore.Point());
    }),
    (t.prototype._initialize = function () {
      var t,
        e = this,
        i = e._chart.hostElement.querySelector('.' + FlexChart._CSS_PLOT_AREA);
      (e._plot = i),
        e._marker || e._createMarker(),
        i &&
          ((e._plotRect = wjcCore.getElementRect(i)),
          (t = i.getBBox()),
          (e._plotRect.width = t.width),
          (e._plotRect.height = t.height),
          e._updateMarkerSize(),
          e._updateLinesSize()),
        e._updateMarkerPosition(),
        (e._wrapperMoveMarker = e._moveMarker.bind(e)),
        e._attach();
    }),
    (t.prototype._createMarker = function () {
      var e,
        i,
        r = this;
      (e = document.createElement('div')),
        wjcCore.addClass(e, t._CSS_MARKER),
        (i = r._getContainer()).appendChild(e),
        (r._markerContainer = i),
        (r._marker = e),
        r._createChildren();
    }),
    (t.prototype._removeMarker = function () {
      var t = this,
        e = t._markerContainer;
      e.removeChild(t._marker),
        (t._content = null),
        (t._hLine = null),
        (t._vLine = null),
        e.hasChildNodes() ||
          (t._chart.hostElement.removeChild(t._markerContainer),
          (t._markerContainer = null)),
        (t._marker = null);
    }),
    (t.prototype._getContainer = function () {
      var e = this._chart.hostElement.querySelector(t._CSS_MARKER_CONTAINER);
      return e || (e = this._createContainer()), e;
    }),
    (t.prototype._createContainer = function () {
      var e = document.createElement('div'),
        i = this._chart.hostElement;
      return (
        wjcCore.addClass(e, t._CSS_MARKER_CONTAINER),
        i.insertBefore(e, i.firstChild),
        e
      );
    }),
    (t.prototype._createChildren = function () {
      var e,
        i,
        r,
        n,
        o = this,
        s = o._marker;
      ((n = document.createElement('div')).style.position = 'absolute'),
        (n.style.height = '100%'),
        (n.style.width = '100%'),
        s.appendChild(n),
        (o._dragEle = n),
        (e = document.createElement('div')),
        wjcCore.addClass(e, t._CSS_MARKER_CONTENT),
        s.appendChild(e),
        (o._markerContent = e),
        (i = document.createElement('div')),
        wjcCore.addClass(i, t._CSS_MARKER_HLINE),
        s.appendChild(i),
        (o._hLine = i),
        (r = document.createElement('div')),
        wjcCore.addClass(r, t._CSS_MARKER_VLINE),
        s.appendChild(r),
        (o._vLine = r),
        o._toggleElesDraggableClass(
          o._interaction === LineMarkerInteraction.Drag
        ),
        o._resetLinesVisibility();
    }),
    (t.prototype._toggleElesDraggableClass = function (e) {
      var i = this;
      wjcCore.toggleClass(i._hLine, t._CSS_LINE_DRAGGABLE, e),
        wjcCore.toggleClass(i._vLine, t._CSS_LINE_DRAGGABLE, e),
        wjcCore.toggleClass(
          i._dragEle,
          t._CSS_LINE_DRAGGABLE,
          e && i._dragContent && i._lines !== LineMarkerLines.None
        );
    }),
    (t.prototype._updateMarkerSize = function () {
      var t = this,
        e = t._plotRect,
        i = t._chart.hostElement,
        r = window.getComputedStyle(i, null),
        n = wjcCore.getElementRect(i);
      t._marker &&
        ((t._marker.style.marginTop =
          e.top -
          n.top -
          (parseFloat(r.getPropertyValue('padding-top')) || 0) +
          'px'),
        (t._marker.style.marginLeft =
          e.left -
          n.left -
          (parseFloat(r.getPropertyValue('padding-left')) || 0) +
          'px'));
    }),
    (t.prototype._updateLinesSize = function () {
      var t = this,
        e = t._plotRect;
      t._hLine &&
        t._vLine &&
        ((t._hLine.style.width = e.width + 'px'),
        (t._vLine.style.height = e.height + 'px'));
    }),
    (t.prototype._resetLinesVisibility = function () {
      var t = this;
      t._hLine &&
        t._vLine &&
        (t._hide(t._hLine),
        t._hide(t._vLine),
        (t._lines !== LineMarkerLines.Horizontal &&
          t._lines !== LineMarkerLines.Both) ||
          t._show(t._hLine),
        (t._lines !== LineMarkerLines.Vertical &&
          t._lines !== LineMarkerLines.Both) ||
          t._show(t._vLine));
    }),
    (t.prototype._updateMarkerPosition = function (t) {
      var e,
        i,
        r = this,
        n = r._plotRect,
        o = r._targetPoint,
        s = !1;
      r._interaction, LineMarkerInteraction.Drag;
      r._plot &&
        ((e = n.left + n.width * (r._horizontalPosition || 0)),
        (i = n.top + n.height * (r._verticalPosition || 0)),
        null == r._horizontalPosition && t && (e = t.x),
        null == r._verticalPosition && t && (i = t.y),
        (e === o.x && i === o.y) || (s = !0),
        (o.x = e),
        (o.y = i),
        r._toggleVisibility(),
        r._content && r._updateContent(),
        s && r._raisePositionChanged(e, i),
        r._updatePositionByAlignment(!!t));
    }),
    (t.prototype._updateContent = function () {
      var t,
        e = this,
        i = e._chart,
        r = e._targetPoint,
        n = i.hitTest(r);
      (t = e._content.call(null, n, r)), (e._markerContent.innerHTML = t || '');
    }),
    (t.prototype._raisePositionChanged = function (t, e) {
      this._plotRect;
      this.onPositionChanged(new wjcCore.Point(t, e));
    }),
    (t.prototype._updatePositionByAlignment = function (t) {
      var e = this,
        i = e._alignment,
        r = e._targetPoint,
        n = e._marker,
        o = 0,
        s = 0,
        a = n.clientWidth,
        h = n.clientHeight,
        l = e._plotRect;
      e._plot &&
        (!e._capturedEle ||
        (e._capturedEle && e._capturedEle !== e._markerContent)
          ? (i === LineMarkerAlignment.Auto
              ? (r.x + a + 12 > l.left + l.width && r.x - a >= 0 && (s = a),
                (o = h),
                r.y - h < l.top && (o = 0))
              : (1 == (1 & i) && (s = a), 2 == (2 & i) && (o = h)),
            e._interaction === LineMarkerInteraction.Move &&
              0 === o &&
              0 === s &&
              (s = -12))
          : (parseInt(e._hLine.style.top) > 0 && (o = h),
            parseInt(e._vLine.style.left) > 0 && (s = a)),
        (n.style.left = r.x - s - l.left + 'px'),
        (n.style.top = r.y - o - l.top + 'px'),
        (e._hLine.style.top = o + 'px'),
        (e._hLine.style.left = l.left - r.x + s + 'px'),
        (e._vLine.style.top = l.top - r.y + o + 'px'),
        (e._vLine.style.left = s + 'px'));
    }),
    (t.prototype._getEventPoint = function (t) {
      return t instanceof MouseEvent
        ? new wjcCore.Point(t.pageX, t.pageY)
        : new wjcCore.Point(
            t.changedTouches[0].pageX,
            t.changedTouches[0].pageY
          );
    }),
    (t.prototype._pointInRect = function (t, e) {
      return (
        !(!t || !e) &&
        t.x >= e.left &&
        t.x <= e.left + e.width &&
        t.y >= e.top &&
        t.y <= e.top + e.height
      );
    }),
    (t._CSS_MARKER = 'wj-chart-linemarker'),
    (t._CSS_MARKER_HLINE = 'wj-chart-linemarker-hline'),
    (t._CSS_MARKER_VLINE = 'wj-chart-linemarker-vline'),
    (t._CSS_MARKER_CONTENT = 'wj-chart-linemarker-content'),
    (t._CSS_MARKER_CONTAINER = 'wj-chart-linemarker-container'),
    (t._CSS_LINE_DRAGGABLE = 'wj-chart-linemarker-draggable'),
    (t._CSS_TOUCH_DISABLED = 'wj-flexchart-touch-disabled'),
    t
  );
})();
exports.LineMarker = LineMarker;
var _DataPoint = (function () {
  function t(t, e, i, r) {
    (this._seriesIndex = t),
      (this._pointIndex = e),
      (this._dataX = i),
      (this._dataY = r);
  }
  return (
    Object.defineProperty(t.prototype, 'seriesIndex', {
      get: function () {
        return this._seriesIndex;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pointIndex', {
      get: function () {
        return this._pointIndex;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dataX', {
      get: function () {
        return this._dataX;
      },
      set: function (t) {
        t !== this._dataX && (this._dataX = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dataY', {
      get: function () {
        return this._dataY;
      },
      set: function (t) {
        t !== this._dataY && (this._dataY = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})();
exports._DataPoint = _DataPoint;
var _MeasureOption;
!(function (t) {
  (t[(t.X = 0)] = 'X'), (t[(t.Y = 1)] = 'Y'), (t[(t.XY = 2)] = 'XY');
})((_MeasureOption = exports._MeasureOption || (exports._MeasureOption = {})));
var _RectArea = (function () {
  function t(t) {
    this._rect = t;
  }
  return (
    Object.defineProperty(t.prototype, 'rect', {
      get: function () {
        return this._rect;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.contains = function (t) {
      var e = this._rect;
      return t.x >= e.left && t.x <= e.right && t.y >= e.top && t.y <= e.bottom;
    }),
    (t.prototype.pointDistance = function (t, e, i) {
      var r = e.x - t.x,
        n = e.y - t.y;
      return i == _MeasureOption.X
        ? Math.abs(r)
        : i == _MeasureOption.Y
        ? Math.abs(n)
        : Math.sqrt(r * r + n * n);
    }),
    (t.prototype.distance = function (t) {
      var e = _MeasureOption.XY;
      null === t.x
        ? (e = _MeasureOption.Y)
        : null === t.y && (e = _MeasureOption.X);
      var i = this._rect;
      return t.x < i.left
        ? t.y < i.top
          ? this.pointDistance(t, new wjcCore.Point(i.left, i.top), e)
          : t.y > i.bottom
          ? this.pointDistance(t, new wjcCore.Point(i.left, i.bottom), e)
          : e == _MeasureOption.Y
          ? 0
          : i.left - t.x
        : t.x > i.right
        ? t.y < i.top
          ? this.pointDistance(t, new wjcCore.Point(i.right, i.top), e)
          : t.y > i.bottom
          ? this.pointDistance(t, new wjcCore.Point(i.right, i.bottom), e)
          : e == _MeasureOption.Y
          ? 0
          : t.x - i.right
        : e == _MeasureOption.X
        ? 0
        : t.y < i.top
        ? i.top - t.y
        : t.y > i.bottom
        ? t.y - i.bottom
        : 0;
    }),
    t
  );
})();
exports._RectArea = _RectArea;
var _CircleArea = (function () {
  function t(t, e) {
    (this._center = t), this.setRadius(e);
  }
  return (
    (t.prototype.setRadius = function (t) {
      (this._rad = t), (this._rad2 = t * t);
    }),
    Object.defineProperty(t.prototype, 'center', {
      get: function () {
        return this._center;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.contains = function (t) {
      var e = this._center.x - t.x,
        i = this._center.y - t.y;
      return e * e + i * i <= this._rad2;
    }),
    (t.prototype.distance = function (t) {
      var e = isNaN(t.x) ? 0 : this._center.x - t.x,
        i = isNaN(t.y) ? 0 : this._center.y - t.y,
        r = e * e + i * i;
      return r <= this._rad2 ? 0 : Math.sqrt(r) - this._rad;
    }),
    t
  );
})();
exports._CircleArea = _CircleArea;
var _LinesArea = (function () {
  function t(t, e) {
    (this._x = []), (this._y = []), (this._x = t), (this._y = e);
  }
  return (
    (t.prototype.contains = function (t) {
      return !1;
    }),
    (t.prototype.distance = function (t) {
      for (var e = NaN, i = 0; i < this._x.length - 1; i++) {
        var r = FlexChart._dist(
          t,
          new wjcCore.Point(this._x[i], this._y[i]),
          new wjcCore.Point(this._x[i + 1], this._y[i + 1])
        );
        (isNaN(e) || r < e) && (e = r);
      }
      return e;
    }),
    t
  );
})();
exports._LinesArea = _LinesArea;
var _HitResult = (function () {
  return function () {};
})();
exports._HitResult = _HitResult;
var _HitTester = (function () {
  function t(t) {
    (this._map = {}), (this._chart = t);
  }
  return (
    (t.prototype.add = function (t, e) {
      this._map[e] &&
        (t.tag || (t.tag = new _DataPoint(e, NaN, NaN, NaN)),
        this._map[e].push(t));
    }),
    (t.prototype.clear = function () {
      this._map = {};
      for (var t = this._chart.series, e = 0; e < t.length; e++)
        t[e].hitTest === Series.prototype.hitTest &&
          (this._map[e] = new Array());
    }),
    (t.prototype.hitTest = function (t, e) {
      void 0 === e && (e = !1);
      for (
        var i = null, r = Number.MAX_VALUE, n = this._chart.series.length - 1;
        n >= 0;
        n--
      ) {
        var o = this._map[n];
        if (o) {
          for (var s = o.length - 1; s >= 0; s--) {
            var a = o[s];
            if (!wjcCore.tryCast(a, _LinesArea) || e) {
              var h = a.distance(t);
              if (h < r && ((r = h), (i = a), 0 == r)) break;
            }
          }
          if (0 == r) break;
        }
      }
      if (i) {
        var l = new _HitResult();
        return (l.area = i), (l.distance = r), l;
      }
      return null;
    }),
    (t.prototype.hitTestSeries = function (t, e) {
      var i = null,
        r = Number.MAX_VALUE,
        n = this._map[e];
      if (n)
        for (var o = n.length - 1; o >= 0; o--) {
          var s = n[o],
            a = s.distance(t);
          if (a < r && ((r = a), (i = s), 0 == r)) break;
        }
      if (i) {
        var h = new _HitResult();
        return (h.area = i), (h.distance = r), h;
      }
      return null;
    }),
    t
  );
})();
exports._HitTester = _HitTester;
var _BasePlotter = (function () {
  function t() {
    (this._DEFAULT_WIDTH = 2),
      (this._DEFAULT_SYM_SIZE = 10),
      (this.clipping = !0);
  }
  return (
    (t.prototype.clear = function () {
      (this.seriesCount = 0), (this.seriesIndex = 0);
    }),
    (t.prototype._renderLabels = function (t, e, i, r, n) {
      var o = i.length,
        s = r.dataLabel,
        a = s.border,
        h = s.offset,
        l = s.connectingLine;
      void 0 === h && (h = l ? 16 : 0), a && (h -= 2);
      for (var c = 0; c < o; c++) {
        var _ = i[c],
          u = wjcCore.asType(_.tag, _DataPoint, !0);
        u && this._renderLabel(t, _, u, r, s, e, h, n);
      }
    }),
    (t.prototype._renderLabel = function (t, e, i, r, n, o, s, a) {
      var h = null == n.position ? LabelPosition.Top : n.position,
        l = n.border,
        c = n.connectingLine,
        _ = new HitTestInfo(r, p);
      _._setDataPoint(i);
      var u = r._getLabelContent(_, n.content),
        p = this._getLabelPoint(o, i);
      if ((this._getPointAndPosition(p, h, e, r), r._plotRect.contains(p))) {
        var d = new DataLabelRenderEventArgs(t, _, p, u);
        if (
          (n.onRendering &&
            (n.onRendering(d) ? ((u = d.text), (p = d.point)) : (u = null)),
          u)
        ) {
          var f = this._renderLabelAndBorder(t, u, h, s, p, c, 2, l);
          if (f) {
            var g = new _RectArea(f);
            (g.tag = i), a.push(g);
          }
        }
      }
    }),
    (t.prototype._getPointAndPosition = function (t, e, i, r) {
      if (i instanceof _RectArea) {
        var n = i;
        r._isRotated()
          ? (t.y = n.rect.top + 0.5 * n.rect.height)
          : (t.x = n.rect.left + 0.5 * n.rect.width);
      }
    }),
    (t.prototype._getLabelPoint = function (t, e) {
      var i = t._getAxisX(),
        r = t._getAxisY();
      return new wjcCore.Point(i.convert(e.dataX), r.convert(e.dataY));
    }),
    (t.prototype._renderLabelAndBorder = function (t, e, i, r, n, o, s, a) {
      var h,
        l = 'wj-data-label',
        c = 'wj-data-label-line';
      switch (i) {
        case LabelPosition.Top:
          o && t.drawLine(n.x, n.y, n.x, n.y - r, c),
            (n.y -= s + r),
            (h = FlexChart._renderText(t, e, n, 1, 2, l));
          break;
        case LabelPosition.Bottom:
          o && t.drawLine(n.x, n.y, n.x, n.y + r, c),
            (n.y += s + r),
            (h = FlexChart._renderText(t, e, n, 1, 0, l));
          break;
        case LabelPosition.Left:
          o && t.drawLine(n.x, n.y, n.x - r, n.y, c),
            (n.x -= s + r),
            (h = FlexChart._renderText(t, e, n, 2, 1, l));
          break;
        case LabelPosition.Right:
          o && t.drawLine(n.x, n.y, n.x + r, n.y, c),
            (n.x += s + r),
            (h = FlexChart._renderText(t, e, n, 0, 1, l));
          break;
        case LabelPosition.Center:
          h = FlexChart._renderText(t, e, n, 1, 1, l);
      }
      return (
        a &&
          h &&
          t.drawRect(
            h.left - s,
            h.top - s,
            h.width + 2 * s,
            h.height + 2 * s,
            'wj-data-label-border'
          ),
        h
      );
    }),
    (t.prototype.getOption = function (t, e) {
      var i = this.chart.options;
      if (
        (e && (i = i ? i[e] : null),
        i && !wjcCore.isUndefined(i[t]) && null !== i[t])
      )
        return i[t];
    }),
    (t.prototype.getNumOption = function (t, e) {
      var i = this.chart.options;
      if ((e && (i = i ? i[e] : null), i && i[t]))
        return wjcCore.asNumber(i[t], !0);
    }),
    (t.cloneStyle = function (t, e) {
      if (!t) return t;
      var i = {};
      for (var r in t) (e && e.indexOf(r) >= 0) || (i[r] = t[r]);
      return i;
    }),
    (t.prototype.isValid = function (t, e, i, r) {
      return (
        _DataInfo.isValid(t) &&
        _DataInfo.isValid(e) &&
        FlexChart._contains(this.chart._plotRect, new wjcCore.Point(t, e))
      );
    }),
    (t.prototype.load = function () {}),
    (t.prototype.unload = function () {}),
    t
  );
})();
exports._BasePlotter = _BasePlotter;
var _BarPlotter = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (
      (e.origin = 0),
      (e.width = 0.7),
      (e.isVolume = !1),
      (e._volHelper = null),
      (e.stackPosMap = {}),
      (e.stackNegMap = {}),
      (e.stacking = Stacking.None),
      e
    );
  }
  return (
    __extends(e, t),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this),
        (this.stackNegMap[this.chart.axisY._uniqueId] = {}),
        (this.stackPosMap[this.chart.axisY._uniqueId] = {}),
        (this._volHelper = null);
    }),
    (e.prototype.load = function () {
      if ((t.prototype.load.call(this), this.isVolume)) {
        var e,
          i,
          r,
          n,
          o,
          s,
          a,
          h,
          l = null,
          c = null;
        for (s = 0; s < this.chart.series.length; s++) {
          if (
            ((e = this.chart.series[s]),
            (o = e.getDataType(1) || e.chart._xDataType),
            (i = e._getAxisX()),
            (r = e._getChartType()),
            (r =
              null === r || wjcCore.isUndefined(r)
                ? this.chart._getChartType()
                : r) === ChartType.Column)
          ) {
            var _ = this.chart ? this.chart._bindingSeparator : ',',
              u = e.binding.split(_).length - 1;
            n = e._getBindingValues(u);
          } else
            n = r === ChartType.Candlestick ? e._getBindingValues(4) : null;
          if (o === wjcCore.DataType.Date) {
            var p;
            for (a = [], h = [], s = 0; s < e._getLength(); s++)
              (p = e._getItem(s)[e.bindingX].valueOf()),
                a.push(p),
                h.push({
                  value: p,
                  text: wjcCore.Globalize.format(new Date(p), i.format || 'd'),
                });
          } else a = this.dataInfo.getXVals();
          if (
            ((l = this.dataInfo.getMinX()),
            (c = this.dataInfo.getMaxX()),
            n && n.length > 0)
          ) {
            (this._volHelper = new _VolumeHelper(n, a, l, c, o)),
              (i._customConvert = this._volHelper.convert.bind(
                this._volHelper
              )),
              (i._customConvertBack = this._volHelper.convertBack.bind(
                this._volHelper
              )),
              h && h.length > 0 && (this._itemsSource = i.itemsSource = h);
            break;
          }
        }
      }
    }),
    (e.prototype.unload = function () {
      t.prototype.unload.call(this);
      for (var e, i = 0; i < this.chart.series.length; i++)
        (e = this.chart.series[i]._getAxisX()) &&
          ((e._customConvert = null),
          (e._customConvertBack = null),
          e.itemsSource &&
            e.itemsSource == this._itemsSource &&
            (this._itemsSource = e.itemsSource = null));
    }),
    (e.prototype.adjustLimits = function (t, e) {
      this.dataInfo = t;
      var i = t.getMinX(),
        r = t.getMaxX(),
        n = t.getMinY(),
        o = t.getMaxY(),
        s = t.getDeltaX();
      s <= 0 && (s = 1),
        !this.isVolume ||
        (this.chart._getChartType() !== ChartType.Column &&
          this.chart._getChartType() !== ChartType.Candlestick)
          ? this.unload()
          : this.load();
      for (var a = 0; a < this.chart.series.length; a++) {
        var h = this.chart.series[a],
          l = h._getChartType();
        ((l =
          null === l || wjcCore.isUndefined(l)
            ? this.chart._getChartType()
            : l) !== ChartType.Column &&
          l !== ChartType.Bar) ||
          (this._isRange(h) &&
            h._getBindingValues(1).forEach(function (t) {
              t < n ? (n = t) : t > o && (o = t);
            }));
      }
      return this.rotated
        ? (this.chart.axisY.logBase ||
            t.getDataTypeY() === wjcCore.DataType.Date ||
            (this.origin > o
              ? (o = this.origin)
              : this.origin < n && (n = this.origin)),
          new wjcCore.Rect(n, i - 0.5 * s, o - n, r - i + s))
        : (this.chart.axisY.logBase ||
            t.getDataTypeY() === wjcCore.DataType.Date ||
            (this.origin > o
              ? (o = this.origin)
              : this.origin < n && (n = this.origin)),
          new wjcCore.Rect(i - 0.5 * s, n, r - i + s, o - n));
    }),
    (e.prototype._isRange = function (t) {
      var e = this.chart ? this.chart._bindingSeparator : ',',
        i = (null == t.binding ? '' : t.binding.split(e)).length - 1;
      return this.isVolume ? 2 === i : 1 === i;
    }),
    (e.prototype.plotSeries = function (t, e, i, r, n, o, s, a) {
      var h = [],
        l = this.chart.series.indexOf(r),
        c = wjcCore.asType(r, SeriesBase),
        _ = this.chart.options,
        u = this.width,
        p = 0;
      if (((o = o || 0), (s = s || 1), _ && _.groupWidth)) {
        var d = _.groupWidth;
        if (wjcCore.isNumber(d)) {
          g = wjcCore.asNumber(d);
          isFinite(g) && g > 0 && ((p = g), (u = 1));
        } else if (wjcCore.isString(d)) {
          var f = wjcCore.asString(d);
          if (f && f.indexOf('%') >= 0) {
            f = f.replace('%', '');
            g = parseFloat(f);
            isFinite(g) &&
              (g < 0 ? (g = 0) : g > 100 && (g = 100), (p = 0), (u = g / 100));
          } else {
            var g = parseFloat(f);
            isFinite(g) && g > 0 && ((p = g), (u = 1));
          }
        }
      }
      var m = u / s,
        y = c._getAxisY()._uniqueId,
        b = this.stackNegMap[y],
        v = this.stackPosMap[y],
        x = r.getValues(0),
        w = r.getValues(1),
        C = this._isRange(c),
        S = c._bindValues(
          null == c._cv
            ? null == this.chart.collectionView
              ? null
              : this.chart.collectionView.items
            : c._cv.items,
          c._getBinding(1)
        ).values;
      if (x) {
        if ((w || (w = this.dataInfo.getXVals()), w)) {
          var P = this.dataInfo.getDeltaX();
          P > 0 && ((u *= P), (m *= P));
        }
        var T = c._getSymbolFill(l),
          M = c._getAltSymbolFill(l) || T,
          j = c._getSymbolStroke(l),
          A = c._getAltSymbolStroke(l) || j,
          L = x.length;
        null != w && (L = Math.min(L, w.length));
        var N,
          k,
          I = this.origin,
          E = 0,
          D = this.stacking != Stacking.None,
          R = this.stacking == Stacking.Stacked100pc;
        if ((void 0 !== c._getChartType() && (D = R = !1), this.rotated)) {
          I < e.actualMin
            ? (I = e.actualMin)
            : I > e.actualMax && (I = e.actualMax),
            c._isCustomAxisY() && (D = R = !1);
          for (
            var O = e.convert(I), F = i.actualMin, V = i.actualMax, X = 0;
            X < L;
            X++
          ) {
            var B = w ? w[X] : X,
              Y = x[X],
              z = O;
            if (
              (this._getSymbolOrigin &&
                (z = i.convert(this._getSymbolOrigin(I, X))),
              C && S && S.length)
            ) {
              tt = S[X];
              _DataInfo.isValid(tt) && (z = e.convert(tt));
            }
            if (this._getSymbolStyles) {
              var H = this._getSymbolStyles(X);
              (T = H && H.fill ? H.fill : T),
                (M = H && H.fill ? H.fill : M),
                (j = H && H.stroke ? H.fill : j),
                (A = H && H.stroke ? H.fill : A);
            }
            if (
              ((N = Y > 0 ? T : M),
              (k = Y > 0 ? j : A),
              (t.fill = N),
              (t.stroke = k),
              _DataInfo.isValid(B) && _DataInfo.isValid(Y))
            )
              if (D) {
                it = B + 0.5 * u;
                if (((et = B - 0.5 * u) < F && it < F) || (et > V && it > V))
                  continue;
                (et = i.convert(Math.max(et, F))),
                  (it = i.convert(Math.min(it, V)));
                var G;
                if (R) {
                  var W = this.dataInfo.getStackedAbsSum(B);
                  Y /= W;
                }
                rt = 0;
                Y > 0
                  ? ((rt = isNaN(v[B]) ? 0 : v[B]),
                    (G = e.convert(rt)),
                    (nt = e.convert(rt + Y)),
                    (v[B] = rt + Y))
                  : ((rt = isNaN(b[B]) ? 0 : b[B]),
                    (G = e.convert(rt)),
                    (nt = e.convert(rt + Y)),
                    (b[B] = rt + Y)),
                  a && h.push(new wjcCore.Point(nt, i.convert(B)));
                q = new wjcCore.Rect(
                  Math.min(G, nt),
                  Math.min(et, it),
                  Math.abs(nt - G),
                  Math.abs(it - et)
                );
                if (p > 0) {
                  (Z = 1 - p / q.height) < 0 && (Z = 0);
                  J = q.top + 0.5 * q.height;
                  (q.top += (J - q.top) * Z),
                    (q.height = Math.min(p, q.height));
                }
                at = new _RectArea(q);
                this.drawSymbol(
                  t,
                  q,
                  r,
                  X,
                  new wjcCore.Point(nt, q.top + 0.5 * q.height)
                ),
                  r._setPointIndex(X, E),
                  E++,
                  (at.tag = new _DataPoint(l, X, rt + Y, B)),
                  this.hitTester.add(at, l);
              } else {
                it = B - 0.5 * u + (o + 1) * m;
                if (
                  ((et = B - 0.5 * u + o * m) < F && it < F) ||
                  (et > V && it > V)
                )
                  continue;
                (et = i.convert(Math.max(et, F))),
                  (it = i.convert(Math.min(it, V)));
                var U = e.convert(Y),
                  q = new wjcCore.Rect(
                    Math.min(U, z),
                    Math.min(et, it),
                    Math.abs(z - U),
                    Math.abs(it - et)
                  );
                if ((a && h.push(new wjcCore.Point(U, (et + it) / 2)), p > 0)) {
                  var K = p / s,
                    Z = 1 - K / q.height;
                  Z < 0 && (Z = 0);
                  var J = i.convert(B);
                  (q.top += (J - q.top) * Z),
                    (q.height = Math.min(K, q.height));
                }
                at = new _RectArea(q);
                this.drawSymbol(
                  t,
                  q,
                  r,
                  X,
                  new wjcCore.Point(U, q.top + 0.5 * q.height)
                ),
                  r._setPointIndex(X, E),
                  E++,
                  (at.tag = new _DataPoint(l, X, Y, B)),
                  this.hitTester.add(at, l);
              }
          }
        } else {
          I < i.actualMin
            ? (I = i.actualMin)
            : I > i.actualMax && (I = i.actualMax);
          var O = i.convert(I),
            Q = e.actualMin,
            $ = e.actualMax;
          c._isCustomAxisY() && (D = R = !1);
          for (X = 0; X < L; X++) {
            var z = O,
              B = w ? w[X] : X,
              Y = x[X];
            if (
              (this._getSymbolOrigin &&
                (z = i.convert(this._getSymbolOrigin(I, X, L))),
              C && S && S.length)
            ) {
              var tt = S[X];
              _DataInfo.isValid(tt) && (z = i.convert(tt));
            }
            if (
              (this._getSymbolStyles &&
                ((T = (H = this._getSymbolStyles(X, L)) && H.fill ? H.fill : T),
                (M = H && H.fill ? H.fill : M),
                (j = H && H.stroke ? H.stroke : j),
                (A = H && H.stroke ? H.stroke : A)),
              (N = Y > 0 ? T : M),
              (k = Y > 0 ? j : A),
              (t.fill = N),
              (t.stroke = k),
              _DataInfo.isValid(B) && _DataInfo.isValid(Y))
            )
              if (D) {
                nt = B + 0.5 * u;
                if (((G = B - 0.5 * u) < Q && nt < Q) || (G > $ && nt > $))
                  continue;
                if (
                  ((G = e.convert(G)),
                  (nt = e.convert(nt)),
                  !_DataInfo.isValid(G) || !_DataInfo.isValid(nt))
                )
                  continue;
                var et, it;
                R && (Y /= W = this.dataInfo.getStackedAbsSum(B));
                var rt = 0;
                Y > 0
                  ? ((rt = isNaN(v[B]) ? 0 : v[B]),
                    (et = i.convert(rt)),
                    (it = i.convert(rt + Y)),
                    (v[B] = rt + Y))
                  : ((rt = isNaN(b[B]) ? 0 : b[B]),
                    (et = i.convert(rt)),
                    (it = i.convert(rt + Y)),
                    (b[B] = rt + Y)),
                  a && h.push(new wjcCore.Point(e.convert(B), it));
                q = new wjcCore.Rect(
                  Math.min(G, nt),
                  Math.min(et, it),
                  Math.abs(nt - G),
                  Math.abs(it - et)
                );
                if (p > 0) {
                  (Z = 1 - p / q.width) < 0 && (Z = 0);
                  st = q.left + 0.5 * q.width;
                  (q.left += (st - q.left) * Z),
                    (q.width = Math.min(p, q.width));
                }
                at = new _RectArea(q);
                this.drawSymbol(
                  t,
                  q,
                  r,
                  X,
                  new wjcCore.Point(q.left + 0.5 * q.width, it)
                ),
                  r._setPointIndex(X, E),
                  E++,
                  (at.tag = new _DataPoint(l, X, B, rt + Y)),
                  this.hitTester.add(at, l);
              } else {
                var nt = B - 0.5 * u + (o + 1) * m;
                if (
                  ((G = B - 0.5 * u + o * m) < Q && nt < Q) ||
                  (G > $ && nt > $)
                )
                  continue;
                if (
                  ((G = e.convert(G)),
                  (nt = e.convert(nt)),
                  !_DataInfo.isValid(G) || !_DataInfo.isValid(nt))
                )
                  continue;
                var ot = i.convert(Y),
                  q = new wjcCore.Rect(
                    Math.min(G, nt),
                    Math.min(ot, z),
                    Math.abs(nt - G),
                    Math.abs(z - ot)
                  );
                if ((a && h.push(new wjcCore.Point((G + nt) / 2, ot)), p > 0)) {
                  (Z = 1 - (K = p / s) / q.width) < 0 && (Z = 0);
                  var st = e.convert(B);
                  (q.left += (st - q.left) * Z),
                    (q.width = Math.min(K, q.width));
                }
                var at = new _RectArea(q);
                this.drawSymbol(
                  t,
                  q,
                  r,
                  X,
                  new wjcCore.Point(q.left + 0.5 * q.width, ot)
                ),
                  r._setPointIndex(X, E),
                  E++,
                  (at.tag = new _DataPoint(l, X, B, Y)),
                  this.hitTester.add(at, l);
              }
          }
        }
        a && h && h.length && a(h);
      }
    }),
    (e.prototype.drawSymbol = function (t, e, i, r, n) {
      var o = this;
      if (this.chart.itemFormatter) {
        t.startGroup();
        var s = new HitTestInfo(this.chart, n, ChartElement.SeriesSymbol);
        s._setData(i, r),
          this.chart.itemFormatter(t, s, function () {
            o.drawDefaultSymbol(t, e, i);
          }),
          t.endGroup();
      } else this.drawDefaultSymbol(t, e, i);
    }),
    (e.prototype.drawDefaultSymbol = function (t, e, i) {
      t.drawRect(e.left, e.top, e.width, e.height, null, i.symbolStyle);
    }),
    e
  );
})(_BasePlotter);
exports._BarPlotter = _BarPlotter;
var _LinePlotter = (function (t) {
  function e() {
    var e = t.call(this) || this;
    return (
      (e.hasSymbols = !1),
      (e.hasLines = !0),
      (e.isSpline = !1),
      (e.stacking = Stacking.None),
      (e.stackPos = {}),
      (e.stackNeg = {}),
      (e.clipping = !1),
      e
    );
  }
  return (
    __extends(e, t),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this), (this.stackNeg = {}), (this.stackPos = {});
    }),
    (e.prototype.adjustLimits = function (t, e) {
      this.dataInfo = t;
      var i = t.getMinX(),
        r = t.getMinY(),
        n = t.getMaxX(),
        o = t.getMaxY();
      if (this.isSpline && !this.chart.axisY.logBase) {
        var s = 0.1 * (o - r);
        (r -= s), (o += s);
      }
      return this.rotated
        ? new wjcCore.Rect(r, i, o - r, n - i)
        : new wjcCore.Rect(i, r, n - i, o - r);
    }),
    (e.prototype.plotSeries = function (t, e, i, r, n, o, s, a) {
      var h = [],
        l = wjcCore.asType(r, SeriesBase),
        c = this.chart.series.indexOf(r),
        _ = r.getValues(0),
        u = r.getValues(1);
      if (_) {
        u || (u = this.dataInfo.getXVals());
        var p = _BasePlotter.cloneStyle(r.style, ['fill']),
          d = _.length,
          f = !0;
        u ? (d = Math.min(d, u.length)) : ((f = !1), (u = new Array(d)));
        var g = this._DEFAULT_WIDTH,
          m = l._getSymbolFill(c),
          y = l._getAltSymbolFill(c) || m,
          b = l._getSymbolStroke(c),
          v = l._getAltSymbolStroke(c) || b,
          x = l._getSymbolSize();
        (t.stroke = b), (t.strokeWidth = g), (t.fill = m);
        var w = new Array(),
          C = new Array(),
          S = new Array(),
          P = this.rotated,
          T = this.stacking != Stacking.None && !l._isCustomAxisY(),
          M = this.stacking == Stacking.Stacked100pc && !l._isCustomAxisY();
        void 0 !== l._getChartType() && (T = M = !1);
        for (var j = this.chart.interpolateNulls, A = !1, L = 0; L < d; L++) {
          var N = f ? u[L] : L,
            k = _[L];
          if (_DataInfo.isValid(N) && _DataInfo.isValid(k)) {
            if (T)
              if ((M && (k /= this.dataInfo.getStackedAbsSum(N)), k >= 0)) {
                I = isNaN(this.stackPos[N]) ? 0 : this.stackPos[N];
                k = this.stackPos[N] = I + k;
              } else {
                var I = isNaN(this.stackNeg[N]) ? 0 : this.stackNeg[N];
                k = this.stackNeg[N] = I + k;
              }
            var E;
            if (P) {
              E = new _DataPoint(c, L, k, N);
              var D = e.convert(k);
              (k = i.convert(N)), (N = D);
            } else
              (E = new _DataPoint(c, L, N, k)),
                (N = e.convert(N)),
                (k = i.convert(k));
            if (isNaN(N) || isNaN(k))
              (A = !0),
                !0 !== j && (w.push(void 0), C.push(void 0)),
                S.push(!0);
            else {
              w.push(N),
                C.push(k),
                S.push(!1),
                a && h.push(new wjcCore.Point(N, k));
              var R = new _CircleArea(new wjcCore.Point(N, k), 0.5 * x);
              (R.tag = E), this.hitTester.add(R, c);
            }
          } else
            (A = !0), !0 !== j && (w.push(void 0), C.push(void 0)), S.push(!0);
        }
        var O = 0;
        if (this.hasLines)
          if (((t.fill = null), A && !0 !== j)) {
            for (var F = [], V = [], L = 0; L < d; L++)
              void 0 === w[L]
                ? (F.length > 1 &&
                    (this._drawLines(t, F, V, null, p, this.chart._plotrectId),
                    this.hitTester.add(new _LinesArea(F, V), c),
                    O++),
                  (F = []),
                  (V = []))
                : (F.push(w[L]), V.push(C[L]));
            F.length > 1 &&
              (this._drawLines(t, F, V, null, p, this.chart._plotrectId),
              this.hitTester.add(new _LinesArea(F, V), c),
              O++);
          } else
            this._drawLines(t, w, C, null, p, this.chart._plotrectId),
              this.hitTester.add(new _LinesArea(w, C), c),
              O++;
        if ((this.hasSymbols || this.chart.itemFormatter) && x > 0) {
          t.fill = m;
          for (var X = 0, L = 0; L < d; L++)
            if (!j || !S[L]) {
              var N = w[X],
                k = C[X];
              (!1 === this.hasLines || this.chart.itemFormatter) &&
                ((t.fill = _[L] > 0 ? m : y), (t.stroke = _[L] > 0 ? b : v)),
                this.isValid(N, k, e, i) &&
                  (this._drawSymbol(t, N, k, x, l, L),
                  r._setPointIndex(L, O),
                  O++),
                X++;
            }
        }
        a && h && h.length && a(h);
      }
    }),
    (e.prototype._drawLines = function (t, e, i, r, n, o) {
      this.isSpline ? t.drawSplines(e, i, r, n, o) : t.drawLines(e, i, r, n, o);
    }),
    (e.prototype._drawSymbol = function (t, e, i, r, n, o) {
      var s = this;
      if (this.chart.itemFormatter) {
        t.startGroup();
        var a = new HitTestInfo(
          this.chart,
          new wjcCore.Point(e, i),
          ChartElement.SeriesSymbol
        );
        a._setData(n, o),
          this.chart.itemFormatter(t, a, function () {
            s.hasSymbols &&
              s._drawDefaultSymbol(t, e, i, r, n.symbolMarker, n.symbolStyle);
          }),
          t.endGroup();
      } else this._drawDefaultSymbol(t, e, i, r, n.symbolMarker, n.symbolStyle);
    }),
    (e.prototype._drawDefaultSymbol = function (t, e, i, r, n, o) {
      n == Marker.Dot
        ? t.drawEllipse(e, i, 0.5 * r, 0.5 * r, null, o)
        : n == Marker.Box &&
          t.drawRect(e - 0.5 * r, i - 0.5 * r, r, r, null, o);
    }),
    e
  );
})(_BasePlotter);
exports._LinePlotter = _LinePlotter;
var _AreaPlotter = (function (t) {
  function e() {
    var e = t.call(this) || this;
    return (
      (e.stacking = Stacking.None),
      (e.isSpline = !1),
      (e.stackPos = {}),
      (e.stackNeg = {}),
      e
    );
  }
  return (
    __extends(e, t),
    (e.prototype.adjustLimits = function (t, e) {
      this.dataInfo = t;
      var i = t.getMinX(),
        r = t.getMinY(),
        n = t.getMaxX(),
        o = t.getMaxY();
      if (this.isSpline) {
        var s = 0.1 * (o - r);
        this.chart.axisY.logBase || (r -= s), (o += s);
      }
      return this.rotated
        ? new wjcCore.Rect(r, i, o - r, n - i)
        : new wjcCore.Rect(i, r, n - i, o - r);
    }),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this), (this.stackNeg = {}), (this.stackPos = {});
    }),
    (e.prototype.plotSeries = function (t, e, i, r, n, o, s, a) {
      var h = [],
        l = this.chart.series.indexOf(r),
        c = r,
        _ = r.getValues(0),
        u = r.getValues(1);
      if (_) {
        var p = _.length;
        if (p) {
          u || (u = this.dataInfo.getXVals());
          var d = !0;
          u ? u.length < p && (p = u.length) : ((d = !1), (u = new Array(p)));
          var f = new Array(),
            g = new Array(),
            m = new Array(),
            y = new Array(),
            b = this.stacking != Stacking.None && !c._isCustomAxisY(),
            v = this.stacking == Stacking.Stacked100pc && !c._isCustomAxisY();
          void 0 !== c._getChartType() && (b = v = !1);
          for (
            var x = this.rotated,
              w = !1,
              C = this.chart.interpolateNulls,
              S = null,
              P = null,
              T = this.chart._plotRect,
              M = 0;
            M < p;
            M++
          ) {
            var j = d ? u[M] : M,
              A = _[M];
            if (
              ((null === S || j > S) && (S = j),
              (null === P || j < P) && (P = j),
              _DataInfo.isValid(j) && _DataInfo.isValid(A))
            ) {
              var L = x ? i.convert(j) : e.convert(j);
              if (b) {
                v && (A /= this.dataInfo.getStackedAbsSum(j));
                var N = 0;
                A >= 0
                  ? ((N = isNaN(this.stackPos[j]) ? 0 : this.stackPos[j]),
                    (A = this.stackPos[j] = N + A))
                  : ((N = isNaN(this.stackNeg[j]) ? 0 : this.stackNeg[j]),
                    (A = this.stackNeg[j] = N + A)),
                  x
                    ? (N < e.actualMin && (N = e.actualMin),
                      m.push(e.convert(N)),
                      y.push(L))
                    : (m.push(L),
                      N < i.actualMin && (N = i.actualMin),
                      y.push(i.convert(N)));
              }
              if (x) {
                k = e.convert(A);
                isNaN(L) || isNaN(k)
                  ? ((w = !0),
                    b || !0 === C || (f.push(void 0), g.push(void 0)))
                  : (f.push(k),
                    g.push(L),
                    FlexChart._contains(T, new wjcCore.Point(k, L)) &&
                      (((I = new _CircleArea(
                        new wjcCore.Point(k, L),
                        this._DEFAULT_SYM_SIZE
                      )).tag = new _DataPoint(l, M, A, j)),
                      this.hitTester.add(I, l)));
              } else {
                var k = i.convert(A);
                if (isNaN(L) || isNaN(k))
                  (w = !0), b || !0 === C || (f.push(void 0), g.push(void 0));
                else if (
                  (f.push(L),
                  g.push(k),
                  FlexChart._contains(T, new wjcCore.Point(L, k)))
                ) {
                  var I = new _CircleArea(
                    new wjcCore.Point(L, k),
                    this._DEFAULT_SYM_SIZE
                  );
                  (I.tag = new _DataPoint(l, M, j, A)),
                    this.hitTester.add(I, l);
                }
              }
            } else (w = !0), b || !0 === C || (f.push(void 0), g.push(void 0));
          }
          a &&
            f.forEach(function (t, e) {
              null != t && h.push(new wjcCore.Point(t, g[e]));
            });
          var E = this._DEFAULT_WIDTH,
            D = n._getColorLight(l),
            R = n._getColor(l),
            O = _BasePlotter.cloneStyle(r.style, ['fill']),
            F = _BasePlotter.cloneStyle(r.style, ['stroke']);
          if (!b && !0 !== C && w) {
            for (var V = [], X = [], M = 0; M < p; M++)
              void 0 === f[M]
                ? (V.length > 1 &&
                    (this.isSpline &&
                      ((V = (B = this._convertToSpline(V, X)).xs), (X = B.ys)),
                    (t.stroke = R),
                    (t.strokeWidth = E),
                    (t.fill = 'none'),
                    t.drawLines(V, X, null, O),
                    this.hitTester.add(new _LinesArea(V, X), l),
                    x
                      ? (V.push(e.convert(e.actualMin), e.convert(e.actualMin)),
                        X.push(i.convert(i.actualMax), i.convert(i.actualMin)))
                      : (V.push(V[V.length - 1], V[0]),
                        X.push(i.convert(i.actualMin), i.convert(i.actualMin))),
                    (t.fill = D),
                    (t.stroke = 'none'),
                    t.drawPolygon(V, X, null, F)),
                  (V = []),
                  (X = []))
                : (V.push(f[M]), X.push(g[M]));
            V.length > 1 &&
              (this.isSpline &&
                ((V = (B = this._convertToSpline(V, X)).xs), (X = B.ys)),
              (t.stroke = R),
              (t.strokeWidth = E),
              (t.fill = 'none'),
              t.drawLines(V, X, null, O),
              this.hitTester.add(new _LinesArea(V, X), l),
              x
                ? (V.push(e.convert(e.actualMin), e.convert(e.actualMin)),
                  X.push(i.convert(i.actualMax), i.convert(i.actualMin)))
                : (V.push(V[V.length - 1], V[0]),
                  X.push(i.convert(i.actualMin), i.convert(i.actualMin))),
              (t.fill = D),
              (t.stroke = 'none'),
              t.drawPolygon(V, X, null, F));
          } else {
            if (this.isSpline) {
              var B = this._convertToSpline(f, g);
              (f = B.xs), (g = B.ys);
            }
            if (b) {
              if (this.isSpline) {
                var Y = this._convertToSpline(m, y);
                (m = Y.xs), (y = Y.ys);
              }
              (f = f.concat(m.reverse())), (g = g.concat(y.reverse()));
            } else
              x
                ? (f.push(e.convert(e.actualMin), e.convert(e.actualMin)),
                  g[0] > g[g.length - 1]
                    ? g.push(i.convert(S), i.convert(P))
                    : g.push(i.convert(P), i.convert(S)))
                : (f[0] > f[f.length - 1]
                    ? f.push(e.convert(P), e.convert(S))
                    : f.push(e.convert(S), e.convert(P)),
                  g.push(i.convert(i.actualMin), i.convert(i.actualMin)));
            (t.fill = D),
              (t.stroke = 'none'),
              t.drawPolygon(f, g, null, F),
              b
                ? ((f = f.slice(0, f.length - m.length)),
                  (g = g.slice(0, g.length - y.length)))
                : ((f = f.slice(0, f.length - 2)),
                  (g = g.slice(0, g.length - 2))),
              (t.stroke = R),
              (t.strokeWidth = E),
              (t.fill = 'none'),
              t.drawLines(f, g, null, O),
              this.hitTester.add(new _LinesArea(f, g), l);
          }
          this._drawSymbols(t, r, l), a && h && h.length && a(h);
        }
      }
    }),
    (e.prototype._convertToSpline = function (t, e) {
      if (t && e) {
        var i = new _Spline(t, e).calculate();
        return { xs: i.xs, ys: i.ys };
      }
      return { xs: t, ys: e };
    }),
    (e.prototype._drawSymbols = function (t, e, i) {
      if (null != this.chart.itemFormatter)
        for (var r = this.hitTester._map[i], n = 0; n < r.length; n++) {
          var o = wjcCore.tryCast(r[n], _CircleArea);
          if (o) {
            var s = o.tag;
            t.startGroup();
            var a = new HitTestInfo(
              this.chart,
              o.center,
              ChartElement.SeriesSymbol
            );
            a._setDataPoint(s),
              this.chart.itemFormatter(t, a, function () {}),
              t.endGroup();
          }
        }
    }),
    e
  );
})(_BasePlotter);
exports._AreaPlotter = _AreaPlotter;
var _BubblePlotter = (function (t) {
  function e() {
    var e = t.call(this) || this;
    return (
      (e._MIN_SIZE = 5),
      (e._MAX_SIZE = 30),
      (e.hasLines = !1),
      (e.hasSymbols = !0),
      (e.clipping = !0),
      e
    );
  }
  return (
    __extends(e, t),
    (e.prototype.adjustLimits = function (e, i) {
      var r = this.getNumOption('minSize', 'bubble');
      this._minSize = r || this._MIN_SIZE;
      var n = this.getNumOption('maxSize', 'bubble');
      this._maxSize = n || this._MAX_SIZE;
      for (
        var o = this.chart.series, s = o.length, a = NaN, h = NaN, l = 0;
        l < s;
        l++
      ) {
        var c = o[l]._getBindingValues(1);
        if (c)
          for (var _ = c.length, u = 0; u < _; u++)
            _DataInfo.isValid(c[u]) &&
              ((isNaN(a) || c[u] < a) && (a = c[u]),
              (isNaN(h) || c[u] > h) && (h = c[u]));
      }
      (this._minValue = a), (this._maxValue = h);
      var p = t.prototype.adjustLimits.call(this, e, i),
        d = this.chart.axisX,
        f = this.chart.axisY;
      if (d.logBase <= 0) {
        var g = (i.width - this._maxSize) / p.width;
        (p.left -= (0.5 * this._maxSize) / g), (p.width += this._maxSize / g);
      }
      if (f.logBase <= 0) {
        var m = (i.height - this._maxSize) / p.height;
        (p.top -= (0.5 * this._maxSize) / m), (p.height += this._maxSize / m);
      }
      return p;
    }),
    (e.prototype._drawSymbol = function (t, e, i, r, n, o) {
      var s = this;
      if (null == this._minSize) {
        var a = this.getNumOption('minSize', 'bubble');
        this._minSize = a || this._MIN_SIZE;
      }
      if (null == this._maxSize) {
        var h = this.getNumOption('maxSize', 'bubble');
        this._maxSize = h || this._MAX_SIZE;
      }
      var l = n._getItem(o);
      if (l) {
        var c = n._getBinding(1);
        if (c) {
          var r = l[c];
          if (_DataInfo.isValid(r)) {
            var _ =
              this._minValue == this._maxValue
                ? 1
                : Math.sqrt(
                    (r - this._minValue) / (this._maxValue - this._minValue)
                  );
            if (
              ((r = this._minSize + (this._maxSize - this._minSize) * _),
              this.chart.itemFormatter)
            ) {
              var u = new HitTestInfo(
                this.chart,
                new wjcCore.Point(e, i),
                ChartElement.SeriesSymbol
              );
              u._setData(n, o),
                t.startGroup(),
                this.chart.itemFormatter(t, u, function () {
                  s._drawDefaultSymbol(
                    t,
                    e,
                    i,
                    r,
                    n.symbolMarker,
                    n.symbolStyle
                  );
                }),
                t.endGroup();
            } else
              this._drawDefaultSymbol(
                t,
                e,
                i,
                r,
                n.symbolMarker,
                n.symbolStyle
              );
            var p = this.hitTester._map[this.chart.series.indexOf(n)];
            if (null != p)
              for (var d = p.length - 1; d >= 0; d--) {
                var f = p[d];
                if (f.tag && f.tag.pointIndex == o) {
                  var g = wjcCore.tryCast(f, _CircleArea);
                  g && g.setRadius(0.5 * r);
                }
              }
          }
        }
      }
    }),
    e
  );
})(_LinePlotter);
exports._BubblePlotter = _BubblePlotter;
var _FinancePlotter = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (
      (e.isCandle = !0),
      (e.isArms = !1),
      (e.isEqui = !1),
      (e.isVolume = !1),
      (e._volHelper = null),
      (e._symWidth = 0.7),
      e
    );
  }
  return (
    __extends(e, t),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this), (this._volHelper = null);
    }),
    (e.prototype.load = function () {
      if ((t.prototype.load.call(this), this.isVolume)) {
        var e,
          i,
          r,
          n,
          o,
          s,
          a,
          h,
          l = null,
          c = null;
        for (s = 0; s < this.chart.series.length; s++) {
          if (
            ((e = this.chart.series[s]),
            (o = e.getDataType(1) || e.chart._xDataType),
            (i = e._getAxisX()),
            (r = e._getChartType()),
            (r =
              null === r || wjcCore.isUndefined(r)
                ? this.chart._getChartType()
                : r),
            (n =
              r === ChartType.Column
                ? e._getBindingValues(1)
                : r === ChartType.Candlestick
                ? e._getBindingValues(4)
                : null),
            o === wjcCore.DataType.Date)
          ) {
            var _;
            for (a = [], h = [], s = 0; s < e._getLength(); s++)
              (_ = e._getItem(s)[e.bindingX].valueOf()),
                a.push(_),
                h.push({
                  value: _,
                  text: wjcCore.Globalize.format(new Date(_), i.format || 'd'),
                });
          } else a = this.dataInfo.getXVals();
          if (
            ((l = this.dataInfo.getMinX()),
            (c = this.dataInfo.getMaxX()),
            n && n.length > 0)
          ) {
            (this._volHelper = new _VolumeHelper(n, a, l, c, o)),
              (i._customConvert = this._volHelper.convert.bind(
                this._volHelper
              )),
              (i._customConvertBack = this._volHelper.convertBack.bind(
                this._volHelper
              )),
              h && h.length > 0 && (this._itemsSource = i.itemsSource = h);
            break;
          }
        }
      }
    }),
    (e.prototype.unload = function () {
      t.prototype.unload.call(this);
      for (var e, i = 0; i < this.chart.series.length; i++)
        (e = this.chart.series[i]._getAxisX()) &&
          ((e._customConvert = null),
          (e._customConvertBack = null),
          e.itemsSource &&
            e.itemsSource == this._itemsSource &&
            (this._itemsSource = e.itemsSource = null));
    }),
    (e.prototype.parseSymbolWidth = function (t) {
      if (((this._isPixel = void 0), t))
        if (wjcCore.isNumber(t)) {
          var e = wjcCore.asNumber(t);
          isFinite(e) && e > 0 && ((this._symWidth = e), (this._isPixel = !0));
        } else if (wjcCore.isString(t)) {
          var i = wjcCore.asString(t);
          if (i && i.indexOf('%') >= 0) {
            i = i.replace('%', '');
            r = parseFloat(i);
            isFinite(r) &&
              (r < 0 ? (r = 0) : r > 100 && (r = 100),
              (this._symWidth = r / 100),
              (this._isPixel = !1));
          } else {
            var r = parseFloat(t);
            isFinite(r) &&
              r > 0 &&
              ((this._symWidth = r), (this._isPixel = !0));
          }
        }
    }),
    (e.prototype.adjustLimits = function (t, e) {
      this.dataInfo = t;
      var i = t.getMinX(),
        r = t.getMinY(),
        n = t.getMaxX(),
        o = t.getMaxY(),
        s = t.getDeltaX(),
        a = this.chart._xDataType;
      s <= 0 && (s = 1);
      var h = this.chart.series,
        l = h.length,
        c = 0;
      this.parseSymbolWidth(this.symbolWidth),
        !this.isVolume ||
        (this.chart._getChartType() !== ChartType.Column &&
          this.chart._getChartType() !== ChartType.Candlestick)
          ? this.unload()
          : this.load();
      for (var _ = 0; _ < l; _++) {
        var u = h[_];
        if (!u._isCustomAxisY()) {
          var p = u._getBinding(1),
            d = u._getBinding(2),
            f = u._getBinding(3),
            g = u._getLength();
          if (g) {
            var m = u._getSymbolSize();
            m > c && (c = m);
            for (var y = 0; y < g; y++) {
              var b = u._getItem(y);
              b &&
                [p ? b[p] : null, d ? b[d] : null, f ? b[f] : null].forEach(
                  function (t) {
                    _DataInfo.isValid(t) &&
                      null !== t &&
                      ((isNaN(r) || t < r) && (r = t),
                      (isNaN(o) || t > o) && (o = t));
                  }
                );
            }
          }
        }
      }
      var v = n - i,
        x = this.chart._plotRect;
      if (x && x.width && !this.isVolume) {
        m += 2;
        var w = (x.width / (x.width - m)) * v;
        (i -= 0.5 * (w - v)), (v = w);
      }
      return a !== wjcCore.DataType.Date ||
        !this.isVolume ||
        (this.chart._getChartType() !== ChartType.Column &&
          this.chart._getChartType() !== ChartType.Candlestick)
        ? this.chart._isRotated()
          ? new wjcCore.Rect(r, i, o - r, v)
          : new wjcCore.Rect(i, r, v, o - r)
        : new wjcCore.Rect(i - 0.5 * s, r, n - i + s, o - r);
    }),
    (e.prototype.plotSeries = function (t, e, i, r, n, o, s, a) {
      var h = this,
        l = wjcCore.asType(r, SeriesBase),
        c = this.chart.series.indexOf(r),
        _ = r.getValues(0),
        u = r.getValues(1),
        p = this._symWidth,
        d = this.chart._isRotated();
      if (_) {
        if ((u || (u = this.dataInfo.getXVals()), u)) {
          var f = this.dataInfo.getDeltaX();
          f > 0 && !1 === this._isPixel && (p *= f);
        }
        var g = _.length,
          m = !0;
        u ? (g = Math.min(g, u.length)) : ((m = !1), (u = new Array(g)));
        var y = this._DEFAULT_WIDTH,
          b = l._getSymbolFill(c),
          v = l._getAltSymbolFill(c) || 'transparent',
          x = l._getSymbolStroke(c),
          w = l._getAltSymbolStroke(c) || x,
          C = void 0 === this._isPixel ? l._getSymbolSize() : p;
        (t.stroke = x), (t.strokeWidth = y), (t.fill = b);
        for (
          var S,
            P,
            T = l._getBinding(1),
            M = l._getBinding(2),
            j = l._getBinding(3),
            A = d ? i.actualMin : e.actualMin,
            L = d ? i.actualMax : e.actualMax,
            N = 0,
            k = null,
            I = null,
            E = 0;
          E < g;
          E++
        )
          if ((k = l._getItem(E))) {
            var D = m ? u[E] : E;
            if (_DataInfo.isValid(D) && A <= D && D <= L) {
              var R = _[E],
                O = T ? k[T] : null,
                F = M ? k[M] : null,
                V = j ? k[j] : null;
              if (
                (t.startGroup(),
                this.isEqui && null !== I
                  ? I[j] !== k[j] &&
                    ((S = I[j] < k[j] ? v : b), (P = I[j] < k[j] ? w : x))
                  : ((S = F < V ? v : b), (P = F < V ? w : x)),
                (t.fill = S),
                (t.stroke = P),
                this.chart.itemFormatter)
              ) {
                var X = new HitTestInfo(
                  this.chart,
                  new wjcCore.Point(e.convert(D), i.convert(R)),
                  ChartElement.SeriesSymbol
                );
                X._setData(l, E),
                  this.chart.itemFormatter(t, X, function () {
                    h._drawSymbol(t, e, i, c, E, S, C, D, R, O, F, V);
                  });
              } else this._drawSymbol(t, e, i, c, E, S, C, D, R, O, F, V);
              t.endGroup(), r._setPointIndex(E, N), N++;
            }
            I = k;
          }
      }
    }),
    (e.prototype._drawSymbol = function (t, e, i, r, n, o, s, a, h, l, c, _) {
      var u,
        p = new _DataPoint(r, n, a, h),
        d = null,
        f = null,
        g = null,
        m = null,
        y = this.chart._isRotated();
      if (y) {
        var b = i;
        (i = e), (e = b);
      }
      if (
        !1 === this._isPixel &&
        ((g = e.convert(a - 0.5 * s)), (m = e.convert(a + 0.5 * s)), g > m)
      ) {
        var v = g;
        (g = m), (m = v);
      }
      (a = e.convert(a)),
        !1 !== this._isPixel && ((g = a - 0.5 * s), (m = a + 0.5 * s)),
        this.isCandle
          ? (_DataInfo.isValid(c) &&
              _DataInfo.isValid(_) &&
              ((c = i.convert(c)),
              (_ = i.convert(_)),
              (f = (d = Math.min(c, _)) + Math.abs(c - _)),
              y
                ? (t.drawRect(d, g, f - d || 1, m - g || 1),
                  (u = new _RectArea(
                    new wjcCore.Rect(d, g, f - d || 1, m - g || 1)
                  )))
                : (t.drawRect(g, d, m - g || 1, f - d || 1),
                  (u = new _RectArea(
                    new wjcCore.Rect(g, d, m - g || 1, f - d || 1)
                  ))),
              (u.tag = p),
              this.hitTester.add(u, r)),
            _DataInfo.isValid(h) &&
              ((h = i.convert(h)),
              null !== d &&
                (y ? t.drawLine(f, a, h, a) : t.drawLine(a, d, a, h))),
            _DataInfo.isValid(l) &&
              ((l = i.convert(l)),
              null !== f &&
                (y ? t.drawLine(d, a, l, a) : t.drawLine(a, f, a, l))))
          : this.isEqui
          ? _DataInfo.isValid(h) &&
            _DataInfo.isValid(l) &&
            ((h = i.convert(h)),
            (l = i.convert(l)),
            (f = (d = Math.min(h, l)) + Math.abs(h - l)),
            t.drawRect(g, d, m - g || 1, f - d || 1),
            ((u = new _RectArea(
              new wjcCore.Rect(g, d, m - g || 1, f - d || 1)
            )).tag = p),
            this.hitTester.add(u, r))
          : this.isArms
          ? (_DataInfo.isValid(c) &&
              _DataInfo.isValid(_) &&
              ((c = i.convert(c)),
              (_ = i.convert(_)),
              (f = (d = Math.min(c, _)) + Math.abs(c - _)),
              t.drawRect(g, d, m - g || 1, f - d || 1)),
            _DataInfo.isValid(h) &&
              null !== d &&
              ((h = i.convert(h)), t.drawLine(a, d, a, h)),
            _DataInfo.isValid(l) &&
              null !== f &&
              ((l = i.convert(l)), t.drawLine(a, f, a, l)),
            _DataInfo.isValid(h) &&
              _DataInfo.isValid(l) &&
              ((t.fill = 'transparent'),
              (f = (d = Math.min(h, l)) + Math.abs(h - l)),
              t.drawRect(g, d, m - g || 1, f - d || 1),
              ((u = new _RectArea(
                new wjcCore.Rect(g, d, m - g || 1, f - d || 1)
              )).tag = p),
              this.hitTester.add(u, r)))
          : (_DataInfo.isValid(h) &&
              _DataInfo.isValid(l) &&
              ((h = i.convert(h)),
              (l = i.convert(l)),
              (f = (d = Math.min(h, l)) + Math.abs(h - l)),
              y
                ? (t.drawLine(l, a, h, a),
                  (u = new _RectArea(
                    new wjcCore.Rect(d, g, f - d || 1, m - g || 1)
                  )))
                : (t.drawLine(a, l, a, h),
                  (u = new _RectArea(
                    new wjcCore.Rect(g, d, m - g || 1, f - d || 1)
                  ))),
              (u.tag = p),
              this.hitTester.add(u, r)),
            _DataInfo.isValid(c) &&
              ((c = i.convert(c)),
              y ? t.drawLine(c, g, c, a) : t.drawLine(g, c, a, c)),
            _DataInfo.isValid(_) &&
              ((_ = i.convert(_)),
              y ? t.drawLine(_, a, _, m) : t.drawLine(a, _, m, _)));
    }),
    e
  );
})(_BasePlotter);
exports._FinancePlotter = _FinancePlotter;
var _FunnelPlotter = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (e.stacking = Stacking.None), e;
  }
  return (
    __extends(e, t),
    (e.prototype.adjustLimits = function (t, e) {
      this.dataInfo = t;
      var i = t.getMinX(),
        r = t.getMinY(),
        n = t.getMaxX(),
        o = t.getMaxY();
      return this.rotated
        ? new wjcCore.Rect(r, i, o - r, n - i)
        : new wjcCore.Rect(i, r, n - i, o - r);
    }),
    (e.prototype.plotSeries = function (t, e, i, r, n, o, s, a) {
      var h = this.chart.series.indexOf(r);
      if (!(h > 0)) {
        var l,
          c,
          _,
          u,
          p,
          d = wjcCore.asType(r, SeriesBase),
          f = this.chart.options,
          g = r.getValues(0),
          m = r.getValues(1),
          y = this.chart._plotRect,
          b =
            f && f.funnel && null != f.funnel.neckWidth
              ? f.funnel.neckWidth
              : 0.2,
          v =
            f && f.funnel && null != f.funnel.neckHeight
              ? f.funnel.neckHeight
              : 0,
          x = b * y.width,
          w = 0,
          C = 0,
          S = 0,
          P = 0,
          T = y.left,
          M = y.top,
          j = y.width,
          A = y.height;
        if (g) {
          (x = x || 1), m || (m = this.dataInfo.getXVals());
          var L = g.length;
          for (null != m && (L = Math.min(L, m.length)), w = 0; w < L; w++)
            C += g[w];
          var N,
            k,
            I = 0;
          if (f && f.funnel && 'rectangle' === f.funnel.type) {
            (v = A / L), (b = j);
            var E;
            for (w = 0; w < L; w++) {
              var D = m ? m[w] : w,
                R = g[w],
                O = d._getSymbolFill(w),
                F = d._getAltSymbolFill(w) || O,
                V = d._getSymbolStroke(w),
                X = d._getAltSymbolStroke(w) || V;
              if (
                (this._getSymbolStyles &&
                  ((O =
                    (G = this._getSymbolStyles(w, L)) && G.fill ? G.fill : O),
                  (F = G && G.fill ? G.fill : F),
                  (V = G && G.stroke ? G.stroke : V),
                  (X = G && G.stroke ? G.stroke : X)),
                (N = R > 0 ? O : F),
                (k = R > 0 ? V : X),
                (t.fill = N),
                (t.stroke = k),
                _DataInfo.isValid(D) && _DataInfo.isValid(R))
              ) {
                E || (E = j / R);
                var B = E * R;
                (T += (b - B) / 2),
                  t.drawRect(T, M, B, v),
                  (Y = new _FunnelSegment(new wjcCore.Point(T, M), B, v, B, v)),
                  (M += v),
                  (b = B),
                  (Y.tag = new _DataPoint(h, w, D, R)),
                  this.hitTester.add(Y, h),
                  r._setPointIndex(w, I),
                  I++;
              }
            }
          } else
            for (
              S = y.left + (y.width * (1 - b)) / 2,
                P = y.top + y.height * (1 - v),
                c = ((1 - b) * y.width) / 2 / (y.height * (1 - v)),
                (!isNaN(c) && isFinite(c)) || ((j = x), (T = S), (M = P)),
                l =
                  y.width * b * y.height +
                  ((y.width * (1 - b)) / 2) * y.height * (1 - v),
                w = 0;
              w < L;
              w++
            ) {
              var Y,
                D = m ? m[w] : w,
                R = g[w],
                z = [],
                H = [],
                O = d._getSymbolFill(w),
                F = d._getAltSymbolFill(w) || O,
                V = d._getSymbolStroke(w),
                X = d._getAltSymbolStroke(w) || V;
              if (this._getSymbolStyles) {
                var G = this._getSymbolStyles(w, L);
                (O = G && G.fill ? G.fill : O),
                  (F = G && G.fill ? G.fill : F),
                  (V = G && G.stroke ? G.stroke : V),
                  (X = G && G.stroke ? G.stroke : X);
              }
              if (
                ((N = R > 0 ? O : F),
                (k = R > 0 ? V : X),
                (t.fill = N),
                (t.stroke = k),
                _DataInfo.isValid(D) && _DataInfo.isValid(R))
              ) {
                var W = (l * R) / C;
                j > x
                  ? (M + (u = this._getTrapezoidOffsetY(j, W, c)) < P
                      ? ((z = [T, T + (_ = c * u), T + j - _, T + j]),
                        (H = [M, M + u, M + u, M]),
                        (Y = new _FunnelSegment(
                          new wjcCore.Point(T, M),
                          j,
                          u,
                          j - 2 * _,
                          0
                        )),
                        (j -= 2 * _),
                        (T += _),
                        (M += u))
                      : ((_ = c * (u = P - M)),
                        (p = (W -= this._getTrapezoidArea(j, c, u)) / x),
                        z.push(T, T + _, T + _, T + _ + x, T + _ + x, T + j),
                        H.push(M, M + u, M + u + p, M + u + p, M + u, M),
                        (Y = new _FunnelSegment(
                          new wjcCore.Point(T, M),
                          j,
                          u + p,
                          x,
                          p
                        )),
                        (j = x),
                        (T += _),
                        (M = M + u + p)),
                    t.drawPolygon(z, H))
                  : ((p = W / x),
                    t.drawRect(T, M, j, p),
                    (Y = new _FunnelSegment(
                      new wjcCore.Point(T, M),
                      x,
                      p,
                      x,
                      p
                    )),
                    (M += p)),
                  (Y.tag = new _DataPoint(h, w, D, R)),
                  this.hitTester.add(Y, h),
                  r._setPointIndex(w, I),
                  I++;
              }
            }
        }
      }
    }),
    (e.prototype._getTrapezoidArea = function (t, e, i) {
      var r = i * e;
      return r * i + (t - 2 * r) * i;
    }),
    (e.prototype._getTrapezoidOffsetY = function (t, e, i) {
      var r = Math.pow(t / 2 / i, 2) - e / i;
      return t / 2 / i - Math.sqrt(r >= 0 ? r : 0);
    }),
    (e.prototype.drawSymbol = function (t, e, i, r, n) {
      var o = this;
      if (this.chart.itemFormatter) {
        t.startGroup();
        var s = new HitTestInfo(this.chart, n, ChartElement.SeriesSymbol);
        s._setData(i, r),
          this.chart.itemFormatter(t, s, function () {
            o.drawDefaultSymbol(t, e, i);
          }),
          t.endGroup();
      } else this.drawDefaultSymbol(t, e, i);
    }),
    (e.prototype.drawDefaultSymbol = function (t, e, i) {
      t.drawRect(e.left, e.top, e.width, e.height, null, i.symbolStyle);
    }),
    (e.prototype._getPointAndPosition = function (t, e, i, r) {
      var n = i;
      (t.x = n.center.x),
        (t.y = n.center.y),
        (e = null == e ? LabelPosition.Center : e);
    }),
    e
  );
})(_BasePlotter);
exports._FunnelPlotter = _FunnelPlotter;
var _FunnelSegment = (function () {
  function t(t, e, i, r, n) {
    (this._startPoint = t),
      (this._width = e),
      (this._height = i),
      (this._neckWidth = r),
      (this._neckHeight = n),
      (this._center = new wjcCore.Point(
        this._startPoint.x + e / 2,
        this._startPoint.y + i / 2
      )),
      (this._offsetX = (e - r) / 2),
      (this._offsetY = i - n);
  }
  return (
    (t.prototype.contains = function (t) {
      var e = this._startPoint,
        i = this._offsetX,
        r = this._offsetY;
      if (
        t.x >= e.x &&
        t.x <= e.x + this._width &&
        t.y >= e.y &&
        t.y <= e.y + this._height
      ) {
        if (t.x >= e.x + i && t.x <= e.x + this._width - i) return !0;
        if (t.y > e.y + r) return !1;
        if (t.x < this._center.x) return (t.y - e.y) / (t.x - e.x) < r / i;
        if (t.x > this._center.x)
          return (t.y - e.y) / (e.x + this._width - t.x) < r / i;
      }
      return !1;
    }),
    (t.prototype.distance = function (t) {
      if (this.contains(t)) return 0;
      var e = this._startPoint,
        i = this._width,
        r = this._height,
        n = this._offsetX,
        o = this._offsetY;
      return t.y < e.y
        ? t.x < e.x
          ? Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2))
          : t.x > e.x + i
          ? Math.sqrt(Math.pow(t.x - e.x - i, 2) + Math.pow(e.y - t.y, 2))
          : e.y - t.y
        : t.y > e.y + r
        ? t.x < e.x
          ? Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(t.y - e.y - r, 2))
          : t.x > e.x + i
          ? Math.sqrt(Math.pow(t.x - e.x - i, 2) + Math.pow(t.y - e.y - r, 2))
          : t.y - e.y - r
        : t.y > e.y + o
        ? t.x < e.x + n
          ? e.x + n - t.x
          : t.x > e.x + i - n
          ? t.x - e.x - i + n
          : void 0
        : t.x < e.x + n
        ? Math.min(
            Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(t.y - e.y, 2)),
            Math.sqrt(
              Math.pow(t.x - n / 2 - e.x, 2) + Math.pow(t.y - o / 2 - e.y, 2)
            ),
            Math.sqrt(Math.pow(t.x - n - e.x, 2) + Math.pow(t.y - o - e.y, 2))
          )
        : Math.min(
            Math.sqrt(Math.pow(t.x - i - e.x, 2) + Math.pow(t.y - e.y, 2)),
            Math.sqrt(
              Math.pow(t.x - i + n / 2 - e.x, 2) +
                Math.pow(t.y - o / 2 - e.y, 2)
            ),
            Math.sqrt(
              Math.pow(t.x - i + n - e.x, 2) + Math.pow(t.y - o - e.y, 2)
            )
          );
    }),
    Object.defineProperty(t.prototype, 'center', {
      get: function () {
        return this._center;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})();
exports._FunnelSegment = _FunnelSegment;
var _VolumeHelper = (function () {
  function t(t, e, i, r, n) {
    (this._volumes = wjcCore.asArray(t)),
      (this._xVals = wjcCore.asArray(e)),
      (this._xDataMin = wjcCore.asNumber(i, !0, !1)),
      (this._xDataMax = wjcCore.asNumber(r, !0, !1)),
      (this._xDataType = wjcCore.asEnum(n, wjcCore.DataType, !0)),
      (this._calcData = []),
      this._init();
  }
  return (
    (t.prototype.convert = function (e, i, r) {
      var n = void 0,
        o = this._calcData.length,
        s = -1;
      if (this._hasXs && this._xDataType === wjcCore.DataType.Date) {
        if (-1 === (s = this._xVals.indexOf(e)))
          for (var a = 0; a < this._xVals.length; a++) {
            if (
              a < this._xVals.length - 1 &&
              this._xVals[a] <= e &&
              e <= this._xVals[a + 1]
            ) {
              s = a;
              break;
            }
            if (0 === a && e <= this._xVals[a]) {
              s = a;
              break;
            }
            if (a === this._xVals.length - 1 && this._xVals[a] <= e) {
              s = a;
              break;
            }
          }
        -1 === s &&
          ((s = this._xVals.indexOf(Math.floor(e))),
          (s = wjcCore.clamp(s, 0, o - 1)));
      } else
        this._hasXs
          ? -1 === (s = this._xVals.indexOf(e)) &&
            ((s = this._xVals.indexOf(Math.floor(e))),
            (s = wjcCore.clamp(s, 0, o - 1)))
          : (s = wjcCore.clamp(Math.round(e), 0, o - 1));
      return (
        0 <= s &&
          s < o &&
          (this._hasXs &&
            (e = t.convertToRange(e, 0, o - 1, this._xDataMin, this._xDataMax)),
          (n =
            ((n =
              this._calcData[s].value +
              (e - s) * this._calcData[s].width -
              0.5 * this._calcData[s].width) -
              (i = this._getXVolume(i))) /
            ((r = this._getXVolume(r)) - i))),
        n
      );
    }),
    (t.prototype.convertBack = function (e, i, r) {
      var n,
        o = void 0,
        s = this._calcData.length,
        a = -1;
      for (n = 0; n < s; n++)
        if (
          (this._calcData[n].x1 <= e && e <= this._calcData[n].x2) ||
          (0 === n && e <= this._calcData[n].x2) ||
          (n === s - 1 && this._calcData[n].x1 <= e)
        ) {
          a = n;
          break;
        }
      return (
        0 <= a &&
          a < s &&
          ((o =
            e / this._calcData[a].width -
            this._calcData[a].value / this._calcData[a].width +
            0.5 +
            n),
          this._hasXs &&
            (o = t.convertToRange(
              o,
              this._xDataMin,
              this._xDataMax,
              0,
              s - 1
            ))),
        o
      );
    }),
    (t.prototype._init = function () {
      (this._hasXs = null !== this._xVals && this._xVals.length > 0),
        this._hasXs &&
          !wjcCore.isNumber(this._xDataMin) &&
          (this._xDataMin = Math.min.apply(null, this._xVals)),
        this._hasXs &&
          !wjcCore.isNumber(this._xDataMax) &&
          (this._xDataMax = Math.max.apply(null, this._xVals)),
        this._hasXs &&
          (this._hasXs =
            wjcCore.isNumber(this._xDataMin) &&
            wjcCore.isNumber(this._xDataMax)),
        this._hasXs &&
          this._xDataType === wjcCore.DataType.Date &&
          this._fillGaps();
      var t = 0,
        e = 0,
        i =
          null !== this._volumes && this._volumes.length > 0
            ? this._volumes.length
            : 0;
      for (e = 0; e < i; e++) t += this._volumes[e] || 0;
      var r,
        n,
        o = 0;
      for (e = 0; e < i; e++)
        (r = o + (n = (this._volumes[e] || 0) / t)),
          this._calcData.push({ value: r, width: n, x1: o, x2: r }),
          (o = this._calcData[e].value);
    }),
    (t.prototype._getXVolume = function (e) {
      var i = this._calcData.length,
        r = -1;
      if (this._hasXs) {
        r = this._xVals.indexOf(e);
        for (var n = 0; n < this._xVals.length; n++) {
          if (
            n < this._xVals.length - 1 &&
            this._xVals[n] <= e &&
            e <= this._xVals[n + 1]
          ) {
            r = n;
            break;
          }
          if (0 === n && e <= this._xVals[n]) {
            r = n;
            break;
          }
          if (n === this._xVals.length - 1 && this._xVals[n] <= e) {
            r = n;
            break;
          }
        }
      }
      return (
        this._hasXs &&
          (e = t.convertToRange(e, 0, i - 1, this._xDataMin, this._xDataMax)),
        -1 === r && (r = wjcCore.clamp(Math.round(e), 0, i - 1)),
        this._calcData[r].value +
          (e - r) * this._calcData[r].width -
          0.5 * this._calcData[r].width
      );
    }),
    (t.convertToRange = function (t, e, i, r, n) {
      return e === i || r === n ? 0 : ((t - r) * (i - e)) / (n - r) + e;
    }),
    (t.prototype._fillGaps = function () {
      if (
        !(
          this._xDataType !== wjcCore.DataType.Date ||
          null === this._xVals ||
          this._xVals.length <= 0
        )
      ) {
        var t,
          e = this._xDataMin,
          i = this._xDataMax;
        for (t = 1; e < i; t++)
          (e = new Date(e)).setDate(e.getDate() + 1),
            (e = e.valueOf()) !== this._xVals[t] &&
              (this._xVals.splice(t, 0, e), this._volumes.splice(t, 0, 0));
      }
    }),
    t
  );
})();
exports._VolumeHelper = _VolumeHelper;
