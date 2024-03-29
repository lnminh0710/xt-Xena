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
var wjcChart = require('wijmo/wijmo.chart'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.chart.hierarchical');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.chart = window.wijmo.chart || {}),
  (window.wijmo.chart.hierarchical = wjcSelf);
var Sunburst = (function (t) {
  function e(e, i) {
    var r = t.call(this, e, i) || this;
    return (
      (r._selectionIndex = 0),
      r.applyTemplate('wj-sunburst', null, null),
      r.initialize(i),
      r.refresh(),
      r
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'bindingName', {
      get: function () {
        return this._bindName;
      },
      set: function (t) {
        t != this._bindName &&
          (wjcCore.assert(
            null == t || wjcCore.isArray(t) || wjcCore.isString(t),
            'bindingName should be an array or a string.'
          ),
          (this._bindName = t),
          this._bindChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'childItemsPath', {
      get: function () {
        return this._childItemsPath;
      },
      set: function (t) {
        t != this._childItemsPath &&
          (wjcCore.assert(
            null == t || wjcCore.isArray(t) || wjcCore.isString(t),
            'childItemsPath should be an array or a string.'
          ),
          (this._childItemsPath = t),
          this._bindChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._initData = function () {
      t.prototype._initData.call(this),
        (this._processedData = []),
        (this._level = 1),
        (this._legendLabels = []),
        (this._processedItem = []);
    }),
    (e.prototype._performBind = function () {
      var t,
        e = this;
      this._initData(),
        this._cv &&
          ((t = this._cv.items),
          this._cv.groups && this._cv.groups.length
            ? (this._processedData = HierarchicalUtil.parseDataToHierarchical(
                this._cv,
                this.binding,
                this.bindingName,
                this.childItemsPath
              ))
            : t &&
              (this._processedData = HierarchicalUtil.parseDataToHierarchical(
                t,
                this.binding,
                this.bindingName,
                this.childItemsPath
              )),
          this._processedData &&
            this._processedData.length &&
            ((this._sum = this._calculateValueAndLevel(this._processedData, 1)),
            this._processedData.forEach(function (t) {
              e._legendLabels.push(t.name);
            })));
    }),
    (e.prototype._calculateValueAndLevel = function (t, e) {
      var i = this,
        r = 0,
        o = this._values,
        a = this._labels;
      return (
        this._level < e && (this._level = e),
        t.forEach(function (t) {
          var n;
          t.items
            ? ((n = i._calculateValueAndLevel(t.items, e + 1)),
              (t.value = n),
              o.push(n),
              a.push(t.name))
            : ((n = i._getBindData(t, o, a, 'value', 'name')), (t.value = n)),
            (r += n);
        }),
        r
      );
    }),
    (e.prototype._renderPie = function (t, e, i, r, o) {
      var a = this._getCenter();
      (this._sliceIndex = 0),
        this._renderHierarchicalSlices(
          t,
          a.x,
          a.y,
          this._processedData,
          this._sum,
          e,
          i,
          r,
          2 * Math.PI,
          o,
          1
        );
    }),
    (e.prototype._renderHierarchicalSlices = function (
      t,
      e,
      i,
      r,
      o,
      a,
      n,
      l,
      s,
      h,
      c
    ) {
      var u,
        _,
        p,
        d,
        m,
        f,
        C,
        w,
        g,
        v,
        y = r.length,
        b = l,
        j = 1 == this.reversed;
      (p = (a - n) / this._level),
        (u = a - (this._level - c) * p),
        (_ = n + (c - 1) * p);
      for (var I = 0; I < y; I++)
        (w = e),
          (g = i),
          (C = t.startGroup('slice-level' + c)),
          1 === c &&
            ((t.fill = this._getColorLight(I)), (t.stroke = this._getColor(I))),
          (m = r[I]),
          (f = Math.abs(m.value)),
          (d = Math.abs(f - o) < 1e-10 ? s : (s * f) / o),
          (v = j ? b - 0.5 * d : b + 0.5 * d),
          h > 0 && d < s && ((w += h * Math.cos(v)), (g += h * Math.sin(v))),
          m.items &&
            this._renderHierarchicalSlices(
              t,
              w,
              g,
              m.items,
              f,
              a,
              n,
              b,
              d,
              0,
              c + 1
            ),
          this._renderSlice(t, w, g, v, this._sliceIndex, u, _, b, d, s),
          this._processedItem.push(m.item),
          this._sliceIndex++,
          j ? (b -= d) : (b += d),
          t.endGroup(),
          this._pels.push(C);
    }),
    (e.prototype._getLabelsForLegend = function () {
      return this._legendLabels || [];
    }),
    (e.prototype._highlightCurrent = function () {
      this.selectionMode != wjcChart.SelectionMode.None &&
        this._highlight(!0, this._selectionIndex);
    }),
    (e.prototype.hitTest = function (e, i) {
      var r = t.prototype.hitTest.call(this, e, i),
        o = this._toControl(e, i);
      if (wjcChart.FlexChart._contains(this._rectChart, o)) {
        var a = r.pointIndex,
          n = this._processedItem[a],
          l = new wjcChart._DataPoint(null, a, null, null);
        (l.item = n), r._setDataPoint(l);
      }
      return r;
    }),
    e
  );
})(wjcChart.FlexPie);
exports.Sunburst = Sunburst;
var TreeMapType;
!(function (t) {
  (t[(t.Squarified = 0)] = 'Squarified'),
    (t[(t.Horizontal = 1)] = 'Horizontal'),
    (t[(t.Vertical = 2)] = 'Vertical');
})((TreeMapType = exports.TreeMapType || (exports.TreeMapType = {})));
var TreeMap = (function (t) {
  function e(e, i) {
    var r = t.call(this, e, null, !0) || this;
    return (
      (r._values = []),
      (r._labels = []),
      (r._areas = []),
      (r._sum = 0),
      (r._keywords = new wjcChart._KeyWords()),
      (r._processedData = []),
      (r._depth = 1),
      (r._itemIndex = 0),
      (r._processedItem = []),
      (r._maxDepth = -1),
      (r._tmItems = []),
      (r._colRowLens = []),
      (r._defPalette = [
        {
          titleColor: '#033884',
          maxColor: '#1450a7',
          minColor: '#83b3f9',
        },
        {
          titleColor: '#a83100',
          maxColor: '#dc4a0d',
          minColor: '#ffb190',
        },
        {
          titleColor: '#006658',
          maxColor: '#008d7a',
          minColor: '#7deddf',
        },
        {
          titleColor: '#a10046',
          maxColor: '#df0061',
          minColor: '#ff8cbe',
        },
        {
          titleColor: '#784d08',
          maxColor: '#99681a',
          minColor: '#efc989',
        },
        {
          titleColor: '#54156f',
          maxColor: '#722a90',
          minColor: '#cf95e7',
        },
        {
          titleColor: '#998605',
          maxColor: '#c2ac19',
          minColor: '#ffef8b',
        },
        {
          titleColor: '#9a0005',
          maxColor: '#c80c14',
          minColor: '#ff888d',
        },
      ]),
      r.applyTemplate('wj-control wj-flexchart wj-treemap', null, null),
      (r._currentRenderEngine = new wjcChart._SvgRenderEngine(r.hostElement)),
      (r._legend = new wjcChart.Legend(r)),
      (r._legend.position = wjcChart.Position.None),
      (r._tooltip = new wjcChart.ChartTooltip()),
      (r._tooltip.content = '<b>{name}</b><br/>{value}'),
      (r._tooltip.showDelay = 0),
      (r._lbl = new wjcChart.DataLabel()),
      (r._lbl.position = wjcChart.LabelPosition.Center),
      (r._lbl._chart = r),
      r.hostElement.addEventListener('mousemove', function (t) {
        r.isTouching || r._toogleTooltip(t);
      }),
      r.hostElement.addEventListener('click', function (t) {
        var e = !0;
        if (r.maxDepth > 0) {
          var i = r.hitTest(t),
            o = wjcChart.FlexChart._SELECTION_THRESHOLD;
          if (
            (r.tooltip && r.tooltip.threshold && (o = r.tooltip.threshold),
            i.distance <= o &&
              i.pointIndex >= -1 &&
              i.pointIndex < r._areas.length)
          ) {
            var a = r._areas[i.pointIndex];
            r._currentItem != a.item &&
              ((r._currentItem = a.item), r._refreshChart(), (e = !1));
          }
        }
        e && r.isTouching && r._toogleTooltip(t);
      }),
      r.hostElement.addEventListener('contextmenu', function (t) {
        if (r.maxDepth > 0) {
          var e = r.hitTest(t),
            i = wjcChart.FlexChart._SELECTION_THRESHOLD;
          r.tooltip && r.tooltip.threshold && (i = r.tooltip.threshold),
            e.distance <= i && r._rollUp();
        }
        return t.preventDefault(), !1;
      }),
      r.hostElement.addEventListener('mouseleave', function () {
        r._hideToolTip();
      }),
      r.initialize(i),
      r.refresh(),
      r
    );
  }
  return (
    __extends(e, t),
    (e.prototype._rollUp = function () {
      (this._currentItem =
        this._currentItem && this._currentItem.parent
          ? this._currentItem.parent
          : null),
        this._refreshChart();
    }),
    (e.prototype._toogleTooltip = function (t) {
      var e = this._tooltip;
      if (e.content) {
        var i = this.hitTest(t);
        if (i.distance <= e.threshold) {
          var r = this._getLabelContent(i, this.tooltip.content);
          this._showToolTip(r, new wjcCore.Rect(t.clientX, t.clientY, 5, 5));
        } else this._hideToolTip();
      }
    }),
    Object.defineProperty(e.prototype, 'tooltip', {
      get: function () {
        return this._tooltip;
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
          ((this._binding = wjcCore.asString(t, !0)), this._bindChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'type', {
      get: function () {
        return null == this._type ? TreeMapType.Squarified : this._type;
      },
      set: function (t) {
        t != this._type &&
          ((this._type = wjcCore.asEnum(t, TreeMapType)), this.invalidate());
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
          (wjcCore.assert(
            null == t || wjcCore.isArray(t) || wjcCore.isString(t),
            'bindingName should be an array or a string.'
          ),
          (this._bindingName = t),
          this._bindChart());
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
    Object.defineProperty(e.prototype, 'childItemsPath', {
      get: function () {
        return this._childItemsPath;
      },
      set: function (t) {
        t != this._childItemsPath &&
          (wjcCore.assert(
            null == t || wjcCore.isArray(t) || wjcCore.isString(t),
            'childItemsPath should be an array or a string.'
          ),
          (this._childItemsPath = t),
          this._bindChart());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'maxDepth', {
      get: function () {
        return this._maxDepth;
      },
      set: function (t) {
        t != this._maxDepth &&
          ((this._maxDepth = wjcCore.asNumber(t, !0)), this.invalidate());
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
          ((this._palette = wjcCore.asArray(t)),
          this._tmItems &&
            this._tmItems.length > 0 &&
            this._calculateColorForItems(this._tmItems),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._initData = function () {
      (this._sum = 0),
        (this._tmItems = []),
        (this._currentItem = null),
        (this._values = []),
        (this._labels = []),
        (this._processedData = []),
        (this._depth = 1),
        (this._processedItem = []);
    }),
    (e.prototype._performBind = function () {
      var t;
      this._initData(),
        this._cv &&
          ((t = this._cv.items),
          this._cv.groups && this._cv.groups.length
            ? (this._processedData = HierarchicalUtil.parseDataToHierarchical(
                this._cv,
                this.binding,
                this.bindingName,
                this.childItemsPath
              ))
            : t &&
              (this._processedData = HierarchicalUtil.parseDataToHierarchical(
                t,
                this.binding,
                this.bindingName,
                this.childItemsPath
              )),
          this._processedData &&
            this._processedData.length &&
            ((this._sum = this._calculateValueAndDepth(this._processedData, 1)),
            this._sortData(this._processedData),
            (this._values = []),
            this._getTMItemsAndLabelsAndValues(
              this._processedData,
              this._tmItems,
              1,
              null
            ),
            this._calculateColorForItems(this._tmItems)));
    }),
    (e.prototype._sortData = function (t) {
      var e = this;
      t.forEach(function (t) {
        t.items && e._sortData(t.items);
      }),
        t.sort(function (t, e) {
          return e.value - t.value;
        });
    }),
    (e.prototype._getTMItemsAndLabelsAndValues = function (t, e, i, r, o) {
      var a = this;
      t &&
        t.length > 0 &&
        t.forEach(function (t, o) {
          var n,
            l = new _TreeMapItem();
          (l.items = []),
            (l.parent = r),
            (l.depth = i),
            t.items &&
              a._getTMItemsAndLabelsAndValues(t.items, l.items, i + 1, l),
            (n = t.name ? t.name : t.value.toString()),
            (l.label = n),
            (l.value = t.value),
            null != r &&
              (t.value > r.maxValue && (r.maxValue = t.value),
              t.value < r.minValue && (r.minValue = t.value)),
            e.push(l),
            a._labels.push(n),
            a._values.push(t.value);
        });
    }),
    (e.prototype._calculateColorForItems = function (t, e, i) {
      var r = this,
        o = i;
      t.forEach(function (t, i) {
        var a = e;
        1 === t.depth && (a = r._getColor(i)), (t.palette = a);
        var n = t.palette;
        if (wjcCore.isString(n)) {
          var l = n,
            s = r._getLightColor(l);
          (t.titleFill = l), (t.titleStroke = l), (t.fill = s), (t.stroke = l);
        } else if (n.maxColor && n.minColor && n.titleColor)
          if (
            ((t.titleFill = n.titleColor),
            (t.titleStroke = n.titleColor),
            null == t.parent)
          )
            (t.fill = n.maxColor), (t.stroke = n.maxColor);
          else {
            null == o &&
              (o = new _ColorConverter(
                n.minColor,
                t.minValue,
                n.maxColor,
                t.maxValue
              ));
            var h = o._calculateColorByVal(t.value, !0).toString();
            (t.fill = h), (t.stroke = h);
          }
        if (t.items && t.items.length > 0) {
          var c = new _ColorConverter(
            n.minColor,
            t.minValue,
            n.maxColor,
            t.maxValue
          );
          r._calculateColorForItems(t.items, a, c);
        }
      });
    }),
    (e.prototype._getBindData = function (t, e, i) {
      var r,
        o = 0;
      i && (r = t[i]);
      o = 0;
      return (
        wjcCore.isNumber(r)
          ? (o = wjcCore.asNumber(r))
          : r && (o = parseFloat(r.toString())),
        !isNaN(o) && isFinite(o) ? e.push(o) : ((o = 0), e.push(o)),
        o
      );
    }),
    (e.prototype._calculateValueAndDepth = function (t, e) {
      var i = this,
        r = 0,
        o = this._values;
      return (
        this._depth < e && (this._depth = e),
        t.forEach(function (t) {
          var a;
          t.items
            ? ((a = i._calculateValueAndDepth(t.items, e + 1)),
              (t.value = a),
              o.push(a))
            : ((a = i._getBindData(t, o, 'value')), (t.value = a)),
            (r += a);
        }),
        r
      );
    }),
    (e.prototype._prepareRender = function () {
      this._areas = [];
    }),
    (e.prototype._renderChart = function (t, i, r) {
      var o,
        a,
        n,
        l = this._rectChart.clone();
      new wjcCore.Size(l.width, l.height);
      this.onRendering(new wjcChart.RenderEventArgs(t));
      var s = i.width,
        h = i.height;
      this._tmGroup = t.startGroup(null, null, !0);
      var c = this._parseMargin(this.plotMargin);
      this.dataLabel;
      isNaN(c.left) && (c.left = e._MARGIN),
        isNaN(c.right) && (c.right = e._MARGIN),
        isNaN(c.top) && (c.top = e._MARGIN),
        isNaN(c.bottom) && (c.bottom = e._MARGIN),
        (i.top += c.top);
      h = i.height - (c.top + c.bottom);
      (i.height = h > 0 ? h : 24), (i.left += c.left);
      s = i.width - (c.left + c.right);
      (i.width = s > 0 ? s : 24),
        (this._plotRect = i),
        (o = this._currentItem ? [this._currentItem] : this._tmItems),
        (a =
          null == this._currentItem || this.maxDepth < 1
            ? this.maxDepth
            : this._currentItem &&
              this._currentItem.items &&
              this._currentItem.items.length &&
              this.maxDepth > 1
            ? this.maxDepth
            : this.maxDepth + 1),
        (n = this._currentItem ? this._currentItem.value : this._sum),
        this._renderTreeMap(t, i, this._tmGroup, o, n, a),
        t.endGroup(),
        this.dataLabel.content &&
          this.dataLabel.position != wjcChart.LabelPosition.None &&
          this._renderLabels(t),
        this.onRendered(new wjcChart.RenderEventArgs(t));
    }),
    (e.prototype._renderTreeMap = function (t, e, i, r, o, a) {
      o > 0 &&
        ((this._itemIndex = 0),
        this._resetItemRects(this._tmItems),
        this._calculateItemRects(e, r, o, 1, a),
        this._renderHierarchicalTreeMapItems(t, i, e, this._tmItems, o, 1, a));
    }),
    (e.prototype._resetItemRects = function (t) {
      var e = this;
      t.forEach(function (t) {
        (t.rect = new wjcCore.Rect(0, 0, 0, 0)),
          (t.isTitle = !1),
          (t.type = e.type),
          t.items && t.items.length && e._resetItemRects(t.items);
      });
    }),
    (e.prototype._calculateItemRects = function (t, e, i, r, o) {
      var a = this;
      switch (this.type) {
        case TreeMapType.Horizontal:
          _TreeMapUtils.horizontal(e, t, i);
          break;
        case TreeMapType.Vertical:
          _TreeMapUtils.vertical(e, t, i);
          break;
        case TreeMapType.Squarified:
          _TreeMapUtils.squarified(e, t, i);
      }
      e.forEach(function (t, e) {
        t.rect.clone();
        t.items &&
          t.items.length &&
          (r === o ||
            (r > o && o >= 1) ||
            ((t.isTitle = !0),
            a._calculateItemRects(t.itemsRect, t.items, t.value, r + 1, o)));
      });
    }),
    (e.prototype._renderHierarchicalTreeMapItems = function (
      t,
      i,
      r,
      o,
      a,
      n,
      l
    ) {
      var s,
        h,
        c,
        u,
        _,
        p = o.length;
      this.type;
      if (0 !== p)
        for (var d = 0; d < p; d++)
          (s = t.startGroup(e._CSS_ITEMDEPTH + n)),
            (h = o[d]),
            (c = Math.abs(h.value)),
            (u = h.rect),
            h.draw(t),
            (_ = new wjcChart._RectArea(u)),
            h.items &&
              this._renderHierarchicalTreeMapItems(
                t,
                s,
                h.itemsRect,
                h.items,
                c,
                n + 1,
                l
              ),
            (_.tag = this._itemIndex),
            (_.name = h.label),
            (_.value = c),
            (_.item = h),
            this._areas.push(_),
            this._itemIndex++,
            t.endGroup();
    }),
    (e.prototype._renderLabels = function (t) {
      var e,
        i = this._areas.length,
        r = this.dataLabel,
        o = r.position,
        a = r.connectingLine,
        n = r.border,
        l = r.offset || 0;
      (t.stroke = 'null'),
        (t.fill = 'transparent'),
        (t.strokeWidth = 1),
        t.startGroup('wj-data-labels');
      for (var s = 0; s < i; s++) {
        var h = this._areas[s];
        if (h) {
          var c = h.rect,
            u = new wjcChart.HitTestInfo(this, e);
          u._setData(null, s);
          var _ = this._getLabelContent(u, r.content);
          if (
            ((e = new wjcCore.Point(
              c.left + c.width / 2,
              c.top + c.height / 2
            )),
            _ && c.width > 0 && c.height > 0)
          ) {
            var p = new wjcChart.DataLabelRenderEventArgs(t, u, e, _);
            r.onRendering(p) &&
              ((_ = p.text),
              (e = p.point),
              this._renderLabelAndBorder(t, h, c, _, o, l, e, a, 2, n));
          }
        }
      }
      t.endGroup();
    }),
    (e.prototype._renderLabelAndBorder = function (
      t,
      e,
      i,
      r,
      o,
      a,
      n,
      l,
      s,
      h
    ) {
      var c,
        u = 'wj-data-label',
        _ = 'wj-data-label-line';
      switch (o) {
        case wjcChart.LabelPosition.Top:
          l && t.drawLine(n.x, n.y, n.x, n.y - a, _),
            (n.y -= s + a),
            (c = this._renderText(t, e, i, r, n, 1, 2, u));
          break;
        case wjcChart.LabelPosition.Bottom:
          l && t.drawLine(n.x, n.y, n.x, n.y + a, _),
            (n.y += s + a),
            (c = this._renderText(t, e, i, r, n, 1, 0, u));
          break;
        case wjcChart.LabelPosition.Left:
          l && t.drawLine(n.x, n.y, n.x - a, n.y, _),
            (n.x -= s + a),
            (c = this._renderText(t, e, i, r, n, 2, 1, u));
          break;
        case wjcChart.LabelPosition.Right:
          l && t.drawLine(n.x, n.y, n.x + a, n.y, _),
            (n.x += s + a),
            (c = this._renderText(t, e, i, r, n, 0, 1, u));
          break;
        case wjcChart.LabelPosition.Center:
          c = this._renderText(t, e, i, r, n, 1, 1, u);
      }
      return (
        h &&
          c &&
          t.drawRect(
            c.left - s,
            c.top - s,
            c.width + 2 * s,
            c.height + 2 * s,
            'wj-data-label-border'
          ),
        c
      );
    }),
    (e.prototype._renderText = function (t, e, i, r, o, a, n, l) {
      var s,
        h = r,
        c = e.item;
      return (
        (s = t.measureString(r, l)),
        this.type === TreeMapType.Horizontal && c.isTitle
          ? (s.width > i.height && (h = this._cutText(r, s.width, i.height)),
            wjcChart.FlexChart._renderRotatedText(t, h, o, a, n, o, -90, l),
            null)
          : (s.width > i.width && (h = this._cutText(r, s.width, i.width)),
            wjcChart.FlexChart._renderText(t, h, o, a, n, l))
      );
    }),
    (e.prototype._cutText = function (t, e, i) {
      var r = '',
        o = t.length,
        a = Math.floor((1 - (e - i) / e) * o);
      return (
        t.length > 0 &&
          (r = t[0] + (a > 1 ? t.substring(1, a - 1) + '..' : '')),
        r
      );
    }),
    (e.prototype._measureLegendItem = function (t, e) {
      var i = new wjcCore.Size();
      if (
        ((i.width = wjcChart.Series._LEGEND_ITEM_WIDTH),
        (i.height = wjcChart.Series._LEGEND_ITEM_HEIGHT),
        e)
      ) {
        var r = t.measureString(
          e,
          wjcChart.FlexChart._CSS_LABEL,
          wjcChart.FlexChart._CSS_LEGEND
        );
        (i.width += r.width), i.height < r.height && (i.height = r.height);
      }
      return (
        (i.width += 3 * wjcChart.Series._LEGEND_ITEM_MARGIN),
        (i.height += 2 * wjcChart.Series._LEGEND_ITEM_MARGIN),
        i
      );
    }),
    (e.prototype._getDesiredLegendSize = function (t, e, i, r) {
      var o = new wjcCore.Size(),
        a = new wjcCore.Size(i, r),
        n = this._tmItems.length,
        l = 0,
        s = 0;
      this._colRowLens = [];
      for (var h = 0; h < n; h++) {
        var c = this._measureLegendItem(t, this._tmItems[h].label);
        e
          ? (s + c.height > r &&
              ((o.height = r), this._colRowLens.push(l), (l = 0), (s = 0)),
            l < c.width && (l = c.width),
            (s += c.height))
          : (l + c.width > i &&
              ((o.width = i), this._colRowLens.push(s), (s = 0), (l = 0)),
            s < c.height && (s = c.height),
            (l += c.width));
      }
      return (
        e
          ? (o.height < s && (o.height = s),
            this._colRowLens.push(l),
            (o.width = this._colRowLens.reduce(function (t, e) {
              return t + e;
            }, 0)),
            o.width > a.width / 2 && (o.width = a.width / 2))
          : (o.width < l && (o.width = l),
            this._colRowLens.push(s),
            (o.height = this._colRowLens.reduce(function (t, e) {
              return t + e;
            }, 0)),
            o.height > a.height / 2 && (o.height = a.height / 2)),
        o
      );
    }),
    (e.prototype._renderLegend = function (t, e, i, r, o, a) {
      for (
        var n,
          l = this._rectLegend,
          s = this._tmItems.length,
          h = 0,
          c = e.clone(),
          u = 0;
        u < s;
        u++
      ) {
        n = this._tmItems[u].label;
        var _ = this._measureLegendItem(t, n);
        r
          ? c.y + _.height > l.top + l.height + 1 &&
            ((c.x += this._colRowLens[h]), h++, (c.y = e.y))
          : c.x + _.width > l.left + l.width + 1 &&
            ((c.y += this._colRowLens[h]), h++, (c.x = e.x));
        var p = new wjcCore.Rect(c.x, c.y, _.width, _.height);
        this._drawLegendItem(t, p, u, n),
          i.push(p),
          r ? (c.y += _.height) : (c.x += _.width);
      }
    }),
    (e.prototype._drawLegendItem = function (t, e, i, r) {
      t.strokeWidth = 1;
      var o = wjcChart.Series._LEGEND_ITEM_MARGIN,
        a = this._getColor(i),
        n = a && a.maxColor ? a.maxColor : a,
        l = this._getLightColor(n);
      (t.fill = n), (t.stroke = l);
      var s = e.top + 0.5 * e.height,
        h = wjcChart.Series._LEGEND_ITEM_WIDTH,
        c = wjcChart.Series._LEGEND_ITEM_HEIGHT;
      t.drawRect(e.left + o, s - 0.5 * c, h, c, null),
        r &&
          wjcChart.FlexChart._renderText(
            t,
            r,
            new wjcCore.Point(e.left + c + 2 * o, s),
            0,
            1,
            wjcChart.FlexChart._CSS_LABEL
          );
    }),
    (e.prototype._getLabelContent = function (t, e) {
      return wjcCore.isString(e)
        ? this._keywords.replace(e, t)
        : wjcCore.isFunction(e)
        ? e(t)
        : null;
    }),
    (e.prototype.hitTest = function (t, e) {
      var i = this._toControl(t, e),
        r = new wjcChart.HitTestInfo(this, i),
        o = null;
      if (wjcChart.FlexChart._contains(this._rectHeader, i))
        r._chartElement = wjcChart.ChartElement.Header;
      else if (wjcChart.FlexChart._contains(this._rectFooter, i))
        r._chartElement = wjcChart.ChartElement.Footer;
      else if (wjcChart.FlexChart._contains(this._rectLegend, i))
        (r._chartElement = wjcChart.ChartElement.Legend),
          null !== (o = this.legend._hitTest(i)) &&
            o >= 0 &&
            o < this._areas.length &&
            r._setData(null, o);
      else if (wjcChart.FlexChart._contains(this._rectChart, i)) {
        for (var a, n = this._areas.length, l = NaN, s = 0; s < n; s++) {
          var h = i.clone(),
            c = this._areas[s];
          c.contains(h) && (r._setData(null, c.tag), (r._dist = 0));
          var u = c.distance(h);
          void 0 !== u && (isNaN(l) || u < l) && ((l = u), (a = c));
        }
        0 !== r._dist && null != a && (r._setData(null, a.tag), (r._dist = l)),
          (r._chartElement = wjcChart.ChartElement.ChartArea);
      } else r._chartElement = wjcChart.ChartElement.None;
      return r;
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
    (e._CSS_ITEMDEPTH = 'wj-treemap-item-depth'),
    (e._MARGIN = 0),
    e
  );
})(wjcChart.FlexChartBase);
exports.TreeMap = TreeMap;
var _TreeMapItem = (function () {
    function t() {
      (this.items = []),
        (this.maxValue = Number.MIN_VALUE),
        (this.minValue = Number.MAX_VALUE);
    }
    return (
      (t.prototype.draw = function (e) {
        var i = this.rect;
        (e.strokeWidth = 0),
          this.isTitle
            ? ((e.fill = this.titleFill), (e.stroke = this.titleStroke))
            : ((e.fill = this.fill), (e.stroke = this.stroke)),
          e.drawRect(i.left, i.top, i.width, i.height, t._CLASSNAME);
      }),
      Object.defineProperty(t.prototype, 'itemsRect', {
        get: function () {
          var t = this.rect,
            e = this._rect,
            i = 1 === this.depth ? 2 : 0.5;
          return this.isTitle
            ? this.type === TreeMapType.Horizontal
              ? new wjcCore.Rect(
                  t.left + t.width + 1,
                  t.top,
                  e.width - t.width - 2 * i,
                  t.height + 1
                )
              : new wjcCore.Rect(
                  t.left,
                  t.top + t.height + 1,
                  t.width + 1,
                  e.height - t.height - 2 * i
                )
            : new wjcCore.Rect(0, 0, 0, 0);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'rect', {
        get: function () {
          var t = this._rect,
            e = 1 === this.depth ? 2 : 0.5,
            i = t.width,
            r = t.height,
            o = t.left,
            a = t.top;
          return (
            this.isTitle
              ? (this.type === TreeMapType.Horizontal
                  ? ((i = t.width > 20 ? 20 : i),
                    (i = Math.max(20, i - 2 * e)),
                    (r = r > 2 * e ? r - 2 * e : 0))
                  : ((r = t.height > 20 ? 20 : r),
                    (r = Math.max(20, r - 2 * e)),
                    (i = i > 2 * e ? i - 2 * e : 0)),
                (o += e),
                (a += e))
              : ((i = i > 2 * e ? i - 2 * e : 0),
                (r = r > 2 * e ? r - 2 * e : 0)),
            new wjcCore.Rect(o, a, i, r)
          );
        },
        set: function (t) {
          t != this._rect && (this._rect = t);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'isTitle', {
        get: function () {
          return this._isTitle;
        },
        set: function (t) {
          var e = wjcCore.asBoolean(t, !0);
          e !== this._isTitle && (this._isTitle = e);
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t._CLASSNAME = 'wj-treemap-item'),
      t
    );
  })(),
  _ColorConverter = (function () {
    function t(t, e, i, r, o, a) {
      (this.minColor = new wjcCore.Color(t)),
        (this.minColorValue = e),
        (this.maxColor = new wjcCore.Color(i)),
        (this.maxColorValue = r),
        (this.midColorValue = this.originalMidColorValue = a),
        this._calculateMidColorValue(),
        (this.midColor = this.originalMidColor = new wjcCore.Color(o)),
        this._calculateMidColor();
    }
    return (
      (t.prototype._resetminColor = function (t) {
        (this.minColor = new wjcCore.Color(t)), this._calculateMidColor();
      }),
      (t.prototype._resetmidColor = function (t) {
        (this.midColor = this.originalMidColor = new wjcCore.Color(t)),
          this._calculateMidColor();
      }),
      (t.prototype._resetmaxColor = function (t) {
        (this.maxColor = new wjcCore.Color(t)), this._calculateMidColor();
      }),
      (t.prototype._resetminColorValue = function (t) {
        (this.minColorValue = t), this._calculateMidColorValue();
      }),
      (t.prototype._resetmidColorValue = function (t) {
        (this.midColorValue = this.originalMidColorValue = t),
          this._calculateMidColorValue();
      }),
      (t.prototype._resetmaxColorValue = function (t) {
        (this.maxColorValue = t), this._calculateMidColorValue();
      }),
      (t.prototype._calculateMidColorValue = function () {
        null == this.originalMidColorValue &&
          (this.midColorValue = (this.maxColorValue + this.minColorValue) / 2);
      }),
      (t.prototype._calculateMidColor = function () {
        null == this.originalMidColor &&
          (this.midColor = this._calculateColorByVal(this.midColorValue, !0));
      }),
      (t.prototype._calculateColorByVal = function (t, e) {
        void 0 === e && (e = !1);
        var i = this.maxColor,
          r = this.minColor,
          o = this.maxColorValue,
          a = this.minColorValue;
        if (t >= this.maxColorValue) return new wjcCore.Color(i.toString());
        if (t <= this.minColorValue) return new wjcCore.Color(r.toString());
        if (!e) {
          if (t === this.midColorValue)
            return new wjcCore.Color(this.midColor.toString());
          t < this.midColorValue
            ? ((i = this.midColor), (o = this.midColorValue))
            : ((r = this.midColor), (a = this.midColorValue));
        }
        return this._getColor(t, i, o, r, a);
      }),
      (t.prototype._getColor = function (t, e, i, r, o) {
        return wjcCore.Color.fromRgba(
          this._getValueByRatio(t, e.r, i, r.r, o),
          this._getValueByRatio(t, e.g, i, r.g, o),
          this._getValueByRatio(t, e.b, i, r.b, o),
          this._getValueByRatio(t, e.a, i, r.a, o)
        );
      }),
      (t.prototype._getValueByRatio = function (t, e, i, r, o) {
        return Math.abs(r + Math.round(((t - o) * (e - r)) / (i - o)));
      }),
      t
    );
  })(),
  _TreeMapUtils = (function () {
    function t() {}
    return (
      (t.squarified = function (e, i, r) {
        var o = e.slice(),
          a = i.clone(),
          n = (a.width * a.height) / r;
        do {
          var l = t.getRowedItems(o, a, n);
          t.layoutRowedItems(i, l, a, a.width > a.height);
        } while (o.length);
      }),
      (t.horizontal = function (e, i, r) {
        var o = i.clone();
        e.forEach(function (e) {
          var a = [{ item: e, val: (e.value * i.width * i.height) / r }];
          t.layoutRowedItems(i, a, o, !1);
        });
      }),
      (t.vertical = function (e, i, r) {
        var o = i.clone();
        e.forEach(function (e) {
          var a = [{ item: e, val: (e.value * i.width * i.height) / r }];
          t.layoutRowedItems(i, a, o, !0);
        });
      }),
      (t.getNarrowLen = function (t) {
        return Math.min(t.width, t.height);
      }),
      (t.getRowedItem = function (t, e, i) {
        return { item: t, val: i * t.value };
      }),
      (t.getRowedItems = function (e, i, r) {
        var o = e.shift(),
          a = [],
          n = [],
          l = t.getNarrowLen(i),
          s = t.getRowedItem(o, i, r);
        if ((a.push(s), n.push(s), e.length > 0))
          do {
            if (
              (n.push(t.getRowedItem(e[0], i, r)),
              !(t.worst(a, l) > t.worst(n, l)))
            )
              break;
            (a = n.slice()), e.shift();
          } while (e.length);
        return a;
      }),
      (t.layoutRowedItems = function (e, i, r, o) {
        var a,
          n = r.left,
          l = r.top,
          s = n + r.width,
          h = l + r.height,
          c = t.sumRowedArray(i);
        o
          ? ((a = 0 === r.height ? 0 : c / r.height),
            n + a >= s && (a = s - n),
            i.forEach(function (t, e) {
              var r = 0 === a ? 0 : t.val / a;
              (l + r > h || e === i.length - 1) && (r = h - l);
              var o = new wjcCore.Rect(n, l, a, r);
              (t.item.rect = o), (l += r);
            }),
            (r.left += a),
            (r.width -= a))
          : ((a = 0 === r.width ? 0 : c / r.width),
            l + a >= h && (a = h - l),
            i.forEach(function (t, e) {
              var r = 0 === a ? 0 : t.val / a;
              (n + r > s || e === i.length - 1) && (r = s - n);
              var o = new wjcCore.Rect(n, l, r, a);
              (t.item.rect = o), (n += r);
            }),
            (r.top += a),
            (r.height -= a));
      }),
      (t.sumRowedArray = function (t) {
        for (var e = 0, i = t.length, r = 0; r < i; r++) e += t[r].val;
        return e;
      }),
      (t.worst = function (e, i) {
        var r,
          o,
          a = t.sumRowedArray(e),
          n = a * a,
          l = i * i;
        return (
          (r = o = e[0].val),
          e.forEach(function (t, e) {
            t.val > r ? (r = t.val) : t.val < o && (o = t.val);
          }),
          Math.max((l * r) / n, n / (l * o))
        );
      }),
      t
    );
  })(),
  HierarchicalUtil = (function () {
    function t() {}
    return (
      (t.parseDataToHierarchical = function (e, i, r, o) {
        var a,
          n = [];
        return (
          e instanceof wjcCore.CollectionView && e.groups.length > 0
            ? (n = t.parseGroupCV(e, i))
            : e.length > 0 &&
              (wjcCore.isString(r) && r.indexOf(',') > -1 && (r = r.split(',')),
              o
                ? (n = t.parseItems(e, i, r, o))
                : ((a = t.convertFlatData(e, i, r)),
                  (n = t.parseItems(a, 'value', r, 'items')))),
          n
        );
      }),
      (t.parseGroupCV = function (t, e) {
        for (var i = [], r = 0, o = t.groups.length; r < o; r++) {
          var a = this.parseGroups(t.groups[r], e);
          i.push(a);
        }
        return i;
      }),
      (t.parseGroups = function (t, e) {
        var i = {};
        if (
          ((i.name = t.name),
          (i.nameField = t.groupDescription.propertyName),
          (i.item = t.items),
          t.groups && t.groups.length)
        ) {
          i.items = [];
          for (var r = 0, o = t.groups.length; r < o; r++) {
            var a = this.parseGroups(t.groups[r], e);
            i.items.push(a);
          }
        } else
          t.isBottomLevel &&
            (i.value = t.getAggregate(wjcCore.Aggregate.Sum, e));
        return i;
      }),
      (t.parseItems = function (e, i, r, o) {
        var a,
          n = [],
          l = e.length;
        for (a = 0; a < l; a++) n.push(t.parseItem(e[a], i, r, o));
        return n;
      }),
      (t.isFlatItem = function (t, e) {
        return !wjcCore.isArray(t[e]);
      }),
      (t.convertFlatData = function (e, i, r) {
        var o,
          a,
          n = [],
          l = {},
          s = e.length;
        for (o = 0; o < s; o++)
          (a = e[o]), t.convertFlatItem(l, a, i, wjcCore.isArray(r) ? r : [r]);
        return t.convertFlatToHierarchical(n, l), n;
      }),
      (t.convertFlatToHierarchical = function (e, i) {
        var r = i.flatDataOrder;
        r &&
          r.forEach(function (r) {
            var o,
              a = {},
              n = i[r];
            (a[i.field] = r),
              n.flatDataOrder
                ? ((o = []), t.convertFlatToHierarchical(o, n), (a.items = o))
                : (a.value = n),
              e.push(a);
          });
      }),
      (t.convertFlatItem = function (e, i, r, o) {
        var a, n, l, s;
        return (
          (a = o.slice()),
          (n = a.shift()),
          (n = wjcCore.isString(n) ? n.trim() : n),
          null != (l = null == n ? r : i[n]) &&
            (0 === a.length
              ? ((e[l] = i[r] || 0),
                e.flatDataOrder
                  ? e.flatDataOrder.push(l)
                  : (e.flatDataOrder = [l]),
                (e.field = n))
              : (null == e[l] &&
                  ((e[l] = {}),
                  e.flatDataOrder
                    ? e.flatDataOrder.push(l)
                    : (e.flatDataOrder = [l]),
                  (e.field = n)),
                (s = e[l]),
                t.convertFlatItem(s, i, r, a) || (e[l] = i[r])),
            !0)
        );
      }),
      (t.parseItem = function (e, i, r, o) {
        var a,
          n,
          l,
          s,
          h,
          c = {};
        return (
          wjcCore.isArray(o)
            ? (s = (h = o.slice()).length ? h.shift().trim() : '')
            : ((h = o), (s = o)),
          wjcCore.isArray(r)
            ? ((n = null == (n = (a = r.slice()).shift()) ? n : n.trim()),
              (c.nameField = null == n ? i : n),
              (c.name = null == n ? e[i] : e[n]),
              (l = e[s]),
              0 === a.length
                ? (c.value = e[i])
                : l && wjcCore.isArray(l) && l.length > 0
                ? (c.items = t.parseItems(l, i, a, h))
                : (c.value = e[i] || 0))
            : ((c.nameField = null == r ? i : r),
              (c.name = null == r ? e[i] : e[r]),
              null != (l = e[s]) && wjcCore.isArray(l) && l.length > 0
                ? (c.items = t.parseItems(l, i, r, h))
                : (c.value = e[i])),
          (c.item = e),
          c
        );
      }),
      (t.parseFlatItem = function (t, e, i, r) {
        t.items || (t.items = []);
      }),
      t
    );
  })();
exports.HierarchicalUtil = HierarchicalUtil;
