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
        for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
      };
    return function (e, r) {
      function a() {
        this.constructor = e;
      }
      t(e, r),
        (e.prototype =
          null === r
            ? Object.create(r)
            : ((a.prototype = r.prototype), new a()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcChart = require('wijmo/wijmo.chart'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.chart.radar');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.chart = window.wijmo.chart || {}),
  (window.wijmo.chart.radar = wjcSelf);
var RadarChartType;
!(function (t) {
  (t[(t.Column = 0)] = 'Column'),
    (t[(t.Scatter = 1)] = 'Scatter'),
    (t[(t.Line = 2)] = 'Line'),
    (t[(t.LineSymbols = 3)] = 'LineSymbols'),
    (t[(t.Area = 4)] = 'Area');
})((RadarChartType = exports.RadarChartType || (exports.RadarChartType = {})));
var FlexRadar = (function (t) {
  function e(e, r) {
    var a = t.call(this, e, r) || this;
    return (
      (a._chartType = RadarChartType.Line),
      (a._startAngle = 0),
      (a._totalAngle = 360),
      (a._reversed = !1),
      (a._areas = []),
      a
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, '_radarLinePlotter', {
      get: function () {
        return (
          null == this.__radarLinePlotter &&
            ((this.__radarLinePlotter = new _RadarLinePlotter()),
            this._initPlotter(this.__radarLinePlotter)),
          this.__radarLinePlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_radarColumnPlotter', {
      get: function () {
        return (
          null == this.__radarColumnPlotter &&
            ((this.__radarColumnPlotter = new _RadarBarPlotter()),
            this._initPlotter(this.__radarColumnPlotter)),
          this.__radarColumnPlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._initAxes = function () {
      t.prototype._initAxes.call(this),
        this.axes.pop(),
        this.axes.pop(),
        (this.axisX = new FlexRadarAxis(wjcChart.Position.Bottom)),
        (this.axisX.majorGrid = !0),
        (this.axisY = new FlexRadarAxis(wjcChart.Position.Left)),
        (this.axisY.majorTickMarks = wjcChart.TickMark.Outside),
        this.axes.push(this.axisX),
        this.axes.push(this.axisY);
    }),
    (e.prototype._layout = function (e, r, a) {
      t.prototype._layout.call(this, e, r, a);
      var i = this.axisX._height;
      this._plotRect.top += i / 2;
      var n = this._plotRect;
      (this._radius = Math.min(n.width, n.height) / 2),
        (this._center = new wjcCore.Point(
          n.left + n.width / 2,
          n.top + n.height / 2
        ));
    }),
    Object.defineProperty(e.prototype, 'chartType', {
      get: function () {
        return this._chartType;
      },
      set: function (t) {
        t != this._chartType &&
          ((this._chartType = wjcCore.asEnum(t, RadarChartType)),
          this.invalidate());
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
    Object.defineProperty(e.prototype, 'totalAngle', {
      get: function () {
        return this._totalAngle;
      },
      set: function (t) {
        t != this._totalAngle &&
          t >= 0 &&
          ((this._totalAngle = wjcCore.asNumber(t, !0)),
          this._totalAngle <= 0 &&
            (wjcCore.assert(!1, 'totalAngle must be greater than 0.'),
            (this._totalAngle = 0)),
          this._totalAngle > 360 &&
            (wjcCore.assert(
              !1,
              'totalAngle must be less than or equal to 360.'
            ),
            (this._totalAngle = 360)),
          this.invalidate());
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
    Object.defineProperty(e.prototype, 'stacking', {
      get: function () {
        return this._stacking;
      },
      set: function (t) {
        t != this._stacking &&
          ((this._stacking = wjcCore.asEnum(t, wjcChart.Stacking)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._getChartType = function () {
      var t = wjcChart.ChartType.Line;
      switch (this.chartType) {
        case RadarChartType.Area:
          t = wjcChart.ChartType.Area;
          break;
        case RadarChartType.Line:
          t = wjcChart.ChartType.Line;
          break;
        case RadarChartType.Column:
          t = wjcChart.ChartType.Column;
          break;
        case RadarChartType.LineSymbols:
          t = wjcChart.ChartType.LineSymbols;
          break;
        case RadarChartType.Scatter:
          t = wjcChart.ChartType.Scatter;
      }
      return t;
    }),
    (e.prototype._getPlotter = function (e) {
      var r = this.chartType,
        a = null;
      if (e) {
        var i = e.chartType;
        null != i && i != r && ((r = i), !0);
      }
      switch (r) {
        case RadarChartType.Line:
          (this._radarLinePlotter.hasSymbols = !1),
            (this._radarLinePlotter.hasLines = !0),
            (this._radarLinePlotter.isArea = !1),
            (a = this._radarLinePlotter);
          break;
        case RadarChartType.LineSymbols:
          (this._radarLinePlotter.hasSymbols = !0),
            (this._radarLinePlotter.hasLines = !0),
            (this._radarLinePlotter.isArea = !1),
            (a = this._radarLinePlotter);
          break;
        case RadarChartType.Area:
          (this._radarLinePlotter.hasSymbols = !1),
            (this._radarLinePlotter.hasLines = !0),
            (this._radarLinePlotter.isArea = !0),
            (a = this._radarLinePlotter);
          break;
        case RadarChartType.Scatter:
          (this._radarLinePlotter.hasSymbols = !0),
            (this._radarLinePlotter.hasLines = !1),
            (this._radarLinePlotter.isArea = !1),
            (a = this._radarLinePlotter);
          break;
        case RadarChartType.Column:
          (this._radarColumnPlotter.isVolume = !1),
            (this._radarColumnPlotter.width = 0.8),
            (a = this._radarColumnPlotter);
          break;
        default:
          a = t.prototype._getPlotter.call(this, e);
      }
      return a;
    }),
    (e.prototype._convertPoint = function (t, e) {
      var r = new wjcCore.Point(),
        a = this._center;
      return (r.x = a.x + t * Math.sin(e)), (r.y = a.y - t * Math.cos(e)), r;
    }),
    (e.prototype._createSeries = function () {
      return new FlexRadarSeries();
    }),
    (e.prototype._clearCachedValues = function () {
      t.prototype._clearCachedValues.call(this),
        (this._isPolar = !1),
        (this._areas = []);
    }),
    (e.prototype._performBind = function () {
      t.prototype._performBind.call(this),
        this._xDataType === wjcCore.DataType.Number && (this._isPolar = !0);
    }),
    (e.prototype._prepareRender = function () {
      t.prototype._prepareRender.call(this), (this._areas = []);
    }),
    e
  );
})(wjcChart.FlexChartCore);
exports.FlexRadar = FlexRadar;
var FlexRadarSeries = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'chartType', {
      get: function () {
        return this._finChartType;
      },
      set: function (t) {
        t != this._finChartType &&
          ((this._finChartType = wjcCore.asEnum(t, RadarChartType, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._getChartType = function () {
      var t;
      switch (this.chartType) {
        case RadarChartType.Area:
          t = wjcChart.ChartType.Area;
          break;
        case RadarChartType.Line:
          t = wjcChart.ChartType.Line;
          break;
        case RadarChartType.Column:
          t = wjcChart.ChartType.Column;
          break;
        case RadarChartType.LineSymbols:
          t = wjcChart.ChartType.LineSymbols;
          break;
        case RadarChartType.Scatter:
          t = wjcChart.ChartType.Scatter;
      }
      return t;
    }),
    e
  );
})(wjcChart.SeriesBase);
exports.FlexRadarSeries = FlexRadarSeries;
var FlexRadarAxis = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (e._points = []), (e._axisLabels = []), e;
  }
  return (
    __extends(e, t),
    (e.prototype._render = function (e) {
      var r = this;
      if (this._hasVisibileSeries()) {
        t.prototype._render.call(this, e);
        var a = this._axisLabels;
        if (a.length) {
          var i = function () {
            var t =
              r.axisType == wjcChart.AxisType.X
                ? 'wj-axis-x-labels ' + wjcChart.FlexChart._CSS_AXIS_X
                : 'wj-axis-y-labels ' + wjcChart.FlexChart._CSS_AXIS_Y;
            e.startGroup(t),
              a.forEach(function (t) {
                var a = t.labelAngle;
                a > 0
                  ? wjcChart.FlexChart._renderRotatedText(
                      e,
                      t.text,
                      t.pos,
                      t.align,
                      t.vAlign,
                      t.pos,
                      a,
                      t.class
                    )
                  : a < 0
                  ? wjcChart.FlexChart._renderRotatedText(
                      e,
                      t.text,
                      t.pos,
                      t.align,
                      t.vAlign,
                      t.pos,
                      a,
                      t.class
                    )
                  : r._renderLabel(
                      e,
                      t.val,
                      t.text,
                      t.pos,
                      t.align,
                      t.vAlign,
                      t.class
                    );
              }),
              e.endGroup(),
              (r._axisLabels = []),
              r._chart.rendered.removeHandler(i);
          };
          this._chart.rendered.addHandler(i, this);
        }
      }
    }),
    (e.prototype._getHeight = function (e, r) {
      var a = t.prototype._getHeight.call(this, e, r);
      return (
        this._axisType == wjcChart.AxisType.Y && (a = 4),
        (this._height = 2 * a),
        2 * a
      );
    }),
    (e.prototype._updateActualLimits = function (e, r, a, i, n) {
      var s = this;
      void 0 === i && (i = null),
        void 0 === n && (n = null),
        t.prototype._updateActualLimits.call(this, e, r, a, i, n);
      var o,
        h = this._chart,
        l = this._lbls,
        c = this.actualMin.valueOf ? this.actualMin.valueOf() : this.actualMin,
        _ = this.actualMax.valueOf ? this.actualMax.valueOf() : this.actualMax;
      this._lbls &&
        this === h.axisX &&
        ((h._angles = []),
        this._isTimeAxis &&
          0 === this._lbls.length &&
          this._values.forEach(function (t) {
            l.push(s._formatValue(t));
          }),
        (o = l.length),
        h.totalAngle < 360 && (o -= 1),
        l.forEach(function (t, e) {
          var r = c + (e / o) * (_ - c),
            a = h.startAngle + (e / o) * h.totalAngle;
          isNaN(a) ||
            isNaN(r) ||
            h._angles.push({ value: s.convert(r), angle: a });
        }));
    }),
    (e.prototype._updateActualLimitsByChartType = function (t, e, r) {
      var a = this._chart;
      if (
        a._getChartType() != wjcChart.ChartType.Column &&
        360 === a.totalAngle &&
        this.axisType === wjcChart.AxisType.X
      )
        if (this._isTimeAxis) {
          var i = (a._xlabels.length || a._xvals.length) - 1;
          r += (r - e) / (i = i < 1 ? 1 : i);
        } else a._isPolar || (r += 1);
      return { min: e, max: r };
    }),
    (e.prototype.convert = function (t, e, r) {
      var a = null == e ? this.actualMax : e,
        i = null == r ? this.actualMin : r,
        n = this._chart;
      if (!n) return NaN;
      if (a == i) return 0;
      if (this.axisType === wjcChart.AxisType.X)
        return n.reversed
          ? ((n.startAngle - ((t - i) / (a - i)) * n.totalAngle) * Math.PI) /
              180
          : ((n.startAngle + ((t - i) / (a - i)) * n.totalAngle) * Math.PI) /
              180;
      if (this.logBase) {
        if (t <= 0) return NaN;
        var s = Math.log(a / i);
        return (Math.log(t / i) / s) * n._radius;
      }
      return ((t - i) / (a - i)) * n._radius;
    }),
    (e.prototype._renderLineAndTitle = function (t) {
      var e = this._chart,
        r = wjcChart.FlexChart._CSS_LINE,
        a = ((e.startAngle - 90) * Math.PI) / 180,
        i = (e.totalAngle * Math.PI) / 180,
        n = e._radius;
      this.axisType === wjcChart.AxisType.X &&
        this.axisLine &&
        ((t.stroke = wjcChart.FlexChart._FG),
        e._isPolar
          ? ((a = e.reversed ? a - i : a),
            t.drawPieSegment(e._center.x, e._center.y, n, a, i, r))
          : this._renderPolygon(t, n, r));
    }),
    (e.prototype._renderPolygon = function (t, e, r) {
      var a = this._chart,
        i = a._angles,
        n = i.length,
        s = a.axisX.minorGrid,
        o = [],
        h = [];
      if (
        (i.forEach(function (t, r) {
          if (s && r > 0) {
            var n = a._convertPoint(
              e,
              t.value - (t.value - i[r - 1].value) / 2
            );
            o.push(n.x), h.push(n.y);
          }
          var l = a._convertPoint(e, t.value);
          o.push(l.x), h.push(l.y);
        }),
        a.totalAngle < 360)
      )
        o.push(a._center.x), h.push(a._center.y);
      else if (s && n >= 2) {
        var l = a._convertPoint(
          e,
          i[n - 1].value - (i[n - 2].value - i[n - 1].value) / 2
        );
        o.push(l.x), h.push(l.y);
      }
      t.drawPolygon(o, h, r);
    }),
    (e.prototype._renderMinors = function (t, e, r, a) {
      var i,
        n = this,
        s = this._chart,
        o = wjcChart.FlexChart._CSS_GRIDLINE_MINOR,
        h = this.minorGrid,
        l = s._angles,
        c = l.length,
        _ = s.axisX.minorGrid,
        u = wjcChart.FlexChart._FG,
        p = this._GRIDLINE_WIDTH,
        d = (s.startAngle, Math.PI, s.totalAngle, Math.PI, this._TICK_OVERLAP),
        y = this.minorTickMarks,
        g = !0;
      (this._vals.minor = e),
        y == wjcChart.TickMark.Outside
          ? (d = 1)
          : y == wjcChart.TickMark.Inside
          ? (d = -1)
          : y == wjcChart.TickMark.Cross
          ? (d = 0)
          : (g = !1),
        this.axisType == wjcChart.AxisType.Y
          ? ((t.stroke = u),
            (t.strokeWidth = p),
            e.forEach(function (e) {
              var r = n.convert(e);
              if (
                (h && n._renderYGridLine(t, s, r, o),
                g &&
                  (l.forEach(function (e, a) {
                    if (_ && a > 0) {
                      i = e.value - (e.value - l[a - 1].value) / 2;
                      var o = s._convertPoint(r, i);
                      n._drawMinorTickLength(t, d, i, o);
                    }
                    i = e.value;
                    var h = s._convertPoint(r, i);
                    n._drawMinorTickLength(t, d, i, h);
                  }),
                  _ && c >= 2))
              ) {
                i = l[c - 1].value - (l[c - 2].value - l[c - 1].value) / 2;
                var a = s._convertPoint(r, i);
                n._drawMinorTickLength(t, d, i, a);
              }
            }))
          : ((t.stroke = u),
            (t.strokeWidth = p),
            e.forEach(function (e) {
              var r = n.convert(e);
              h && n._renderXGridLine(t, s, r, o);
            }));
    }),
    (e.prototype._drawMinorTickLength = function (t, e, r, a) {
      var i = this._TICK_HEIGHT,
        n = wjcChart.FlexChart._CSS_TICK_MINOR,
        s = 0.5 * (e - 1) * i * Math.cos(r),
        o = 0.5 * (1 + e) * i * Math.cos(r),
        h = 0.5 * (e - 1) * i * Math.sin(r),
        l = 0.5 * (1 + e) * i * Math.sin(r);
      t.drawLine(a.x + s, a.y + h, a.x + o, a.y + l, n);
    }),
    (e.prototype._renderLabelsAndTicks = function (t, e, r, a, i, n, s, o, h) {
      (this._points = []), (i = this.labelAngle || 0);
      var l,
        c = this._chart,
        _ = this.labelPadding || 2,
        u = wjcChart.FlexChart._CSS_LABEL,
        p = wjcChart.FlexChart._CSS_GRIDLINE,
        d = wjcChart.FlexChart._CSS_TICK,
        y = wjcChart.FlexChart._FG,
        g = this._TICK_WIDTH,
        C = this.majorGrid,
        v = wjcChart.FlexChart._FG,
        f = this._GRIDLINE_WIDTH,
        w = (c.startAngle * Math.PI) / 180,
        x = (c.totalAngle, Math.PI, 1);
      if (this.axisType == wjcChart.AxisType.Y) {
        C = r != this.actualMin && C && r != this.actualMax;
        var j = this.convert(r),
          P = c._convertPoint(j, w);
        if (
          (C &&
            ((t.stroke = v),
            (t.strokeWidth = f),
            this._renderYGridLine(t, c, j, p)),
          (t.stroke = y),
          (t.strokeWidth = g),
          s)
        ) {
          ((l = ((c.startAngle % 360) + 360) % 360) <= 90 && l >= 75) ||
          (l >= 270 && l <= 285)
            ? (x = 2)
            : ((l > 90 && l <= 105) || (l < 270 && l >= 255)) && (x = 0);
          L = new wjcCore.Point(P.x - _ - Math.abs(o - h), P.y);
          this._axisLabels.push({
            val: r,
            text: a,
            pos: L,
            align: 2,
            vAlign: x,
            labelAngle: i,
            class: u,
          });
        }
        n != wjcChart.TickMark.None &&
          t.drawLine(
            P.x - h * Math.cos(w),
            P.y - h * Math.sin(w),
            P.x - o * Math.cos(w),
            P.y - o * Math.sin(w),
            d
          );
      } else {
        var A = this.convert(r);
        if (
          (C &&
            ((t.stroke = v),
            (t.strokeWidth = f),
            this._renderXGridLine(t, c, A, p)),
          (t.stroke = y),
          (t.strokeWidth = g),
          s)
        ) {
          var m,
            T,
            b,
            L = c._convertPoint(c._radius + _, A);
          (m =
            c._angles && c._angles.length
              ? c._angles[e].angle
              : c.startAngle +
                ((r - this.actualMin) * c.totalAngle) /
                  (this.actualMax - this.actualMin)),
            (m = (m %= 360) >= 0 ? m : m + 360),
            (T = this._getXLabelVAlign(m)),
            (b = this._getXLabelAlign(m)),
            c._isPolar && (a = this._formatValue(m)),
            i > 0
              ? wjcChart.FlexChart._renderRotatedText(t, a, L, b, T, L, i, u)
              : i < 0
              ? wjcChart.FlexChart._renderRotatedText(t, a, L, b, T, L, i, u)
              : this._renderLabel(t, r, a, L, b, T, u);
        }
      }
      return !0;
    }),
    (e.prototype._renderXGridLine = function (t, e, r, a) {
      var i = e._center,
        n = e._convertPoint(e._radius, r);
      t.drawLine(i.x, i.y, n.x, n.y, a);
    }),
    (e.prototype._renderYGridLine = function (t, e, r, a) {
      e._angles;
      var i = e._center,
        n = (e.startAngle * Math.PI) / 180,
        s = (e.totalAngle * Math.PI) / 180;
      e._isPolar
        ? ((n = ((e.startAngle - 90) * Math.PI) / 180),
          (n = e.reversed ? n - s : n),
          t.drawPieSegment(i.x, i.y, r, n, s, a))
        : this._renderPolygon(t, r, a);
    }),
    (e.prototype._getXLabelVAlign = function (t) {
      var e = 1,
        r = this._chart,
        a = r.startAngle;
      return (
        r.reversed && (t = (360 + a + ((a % 360) - (t % 360))) % 360),
        0 === t ? (e = 2) : 180 === t && (e = 0),
        e
      );
    }),
    (e.prototype._getXLabelAlign = function (t) {
      var e = 0,
        r = this._chart,
        a = r.startAngle;
      return (
        r.reversed && (t = (360 + a + ((a % 360) - (t % 360))) % 360),
        t > 0 && t < 180 ? (e = -1) : t > 180 && t < 360 && (e = 1),
        e + 1
      );
    }),
    (e.prototype._createTimeLabels = function (e, r, a, i) {
      var n = this;
      if (this._axisType == wjcChart.AxisType.Y)
        t.prototype._createTimeLabels.call(this, e, r, a, i);
      else {
        var s = this._values;
        this.format;
        if (!s || 0 === s.length) return;
        s.forEach(function (t) {
          a.push(t), i.push(n._formatValue(t));
        });
      }
    }),
    e
  );
})(wjcChart.Axis);
exports.FlexRadarAxis = FlexRadarAxis;
var _RadarLinePlotter = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (e.isArea = !1), e;
  }
  return (
    __extends(e, t),
    (e.prototype._getLabelPoint = function (t, e) {
      var r = t._getAxisX(),
        a = t._getAxisY(),
        i = r.convert(e.dataX),
        n = a.convert(e.dataY);
      return this.chart._convertPoint(n, i);
    }),
    (e.prototype.plotSeries = function (t, e, r, a, i, n, s) {
      var o = wjcCore.asType(a, wjcChart.SeriesBase),
        h = this.chart,
        l = o._getChartType() || h._getChartType(),
        c = h.series.indexOf(a),
        _ = a.getValues(0),
        u = a.getValues(1);
      if (_) {
        u || (u = this.dataInfo.getXVals());
        var p = wjcChart._BasePlotter.cloneStyle(a.style, ['fill']),
          d = _.length,
          y = !0;
        u ? (d = Math.min(d, u.length)) : ((y = !1), (u = new Array(d)));
        var g = this._DEFAULT_WIDTH,
          C = o._getSymbolFill(c),
          v = o._getAltSymbolFill(c) || C,
          f = o._getSymbolStroke(c),
          w = o._getAltSymbolStroke(c) || f,
          x = o._getSymbolSize();
        (t.stroke = f), (t.strokeWidth = g), (t.fill = C);
        var j = new Array(),
          P = new Array(),
          A = this.stacking != wjcChart.Stacking.None && !o._isCustomAxisY(),
          m =
            this.stacking == wjcChart.Stacking.Stacked100pc &&
            !o._isCustomAxisY();
        void 0 !== o._getChartType() && (A = m = !1);
        for (var T = this.chart.interpolateNulls, b = !1, L = 0; L < d; L++) {
          var S = y ? u[L] : L,
            k = _[L];
          if (wjcChart._DataInfo.isValid(S) && wjcChart._DataInfo.isValid(k)) {
            if (A)
              if ((m && (k /= this.dataInfo.getStackedAbsSum(S)), k >= 0)) {
                M = isNaN(this.stackPos[S]) ? 0 : this.stackPos[S];
                k = this.stackPos[S] = M + k;
              } else {
                var M = isNaN(this.stackNeg[S]) ? 0 : this.stackNeg[S];
                k = this.stackNeg[S] = M + k;
              }
            var R;
            R = new wjcChart._DataPoint(c, L, S, k);
            var I = e.convert(S),
              F = r.convert(k),
              N = this.chart._convertPoint(F, I);
            if (((S = N.x), (k = N.y), isNaN(S) || isNaN(k)))
              (b = !0), !0 !== T && (j.push(void 0), P.push(void 0));
            else {
              j.push(S), P.push(k);
              var X = new wjcChart._CircleArea(
                new wjcCore.Point(S, k),
                0.5 * x
              );
              (X.tag = R), this.hitTester.add(X, c);
            }
          } else (b = !0), !0 !== T && (j.push(void 0), P.push(void 0));
        }
        var O = 0;
        if (this.hasLines)
          if (
            (this.isArea
              ? (t.fill = C || i._getColorLight(c))
              : (t.fill = 'none'),
            b && !0 !== T)
          ) {
            for (var D = [], V = [], L = 0; L < d; L++)
              void 0 === j[L]
                ? (D.push(void 0), V.push(0))
                : (D.push(j[L]), V.push(P[L]));
            D.length > 1 &&
              (h._isPolar && l !== wjcChart.ChartType.Area
                ? this._drawLines(t, D, V, null, p, this.chart._plotrectId)
                : (h.totalAngle < 360 &&
                    (D.push(h._center.x), V.push(h._center.y)),
                  t.drawPolygon(D, V, null, p, this.chart._plotrectId)),
              this.hitTester.add(new wjcChart._LinesArea(D, V), c),
              O++);
          } else
            h._isPolar && l !== wjcChart.ChartType.Area
              ? this._drawLines(t, j, P, null, p, this.chart._plotrectId)
              : (h.totalAngle < 360 &&
                  (j.push(h._center.x), P.push(h._center.y)),
                t.drawPolygon(j, P, null, p, this.chart._plotrectId)),
              this.hitTester.add(new wjcChart._LinesArea(j, P), c),
              O++;
        t.fill = C;
        for (L = 0; L < d; L++) {
          var S = j[L],
            k = P[L];
          !1 === this.hasLines &&
            ((t.fill = _[L] > 0 ? C : v), (t.stroke = _[L] > 0 ? f : w)),
            this.isValid(S, k, e, r) &&
              ((this.hasSymbols || this.chart.itemFormatter) &&
                x > 0 &&
                this._drawSymbol(t, S, k, x, o, L),
              a._setPointIndex(L, O),
              O++);
        }
      }
    }),
    e
  );
})(wjcChart._LinePlotter);
exports._RadarLinePlotter = _RadarLinePlotter;
var _RadarBarPlotter = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    (e.prototype.adjustLimits = function (t, e) {
      this.dataInfo = t;
      var r = t.getMinX(),
        a = t.getMinY(),
        i = t.getMaxX(),
        n = t.getMaxY(),
        s = t.getDeltaX();
      return (
        s <= 0 && (s = 1),
        this.chart.totalAngle < 360 && (s = 0),
        this.unload(),
        this.chart.axisY.logBase ||
          (this.origin > n
            ? (n = this.origin)
            : this.origin < a && (a = this.origin)),
        new wjcCore.Rect(r, a, i - r + s, n - a)
      );
    }),
    (e.prototype._getLabelPoint = function (t, e) {
      var r = t._getAxisX(),
        a = t._getAxisY(),
        i = r.convert(e.dataX),
        n = a.convert(e.dataY);
      return this.chart._convertPoint(n, i);
    }),
    (e.prototype.plotSeries = function (t, e, r, a, i, n, s) {
      var o = this.chart.series.indexOf(a),
        h = wjcCore.asType(a, wjcChart.SeriesBase),
        l = (this.chart.options, this.width),
        c = this.chart,
        _ = (-90 * Math.PI) / 180;
      n = n || 0;
      var u,
        p = h._getAxisY()._uniqueId,
        d = (this.stackNegMap[p], this.stackPosMap[p]),
        y = this.stacking != wjcChart.Stacking.None,
        g = this.stacking == wjcChart.Stacking.Stacked100pc,
        C = a.getValues(0),
        v = a.getValues(1);
      if (C) {
        v || (v = this.dataInfo.getXVals());
        var f;
        (f = v
          ? c.totalAngle / v.length
          : c.totalAngle / (e.actualMax - e.actualMin)) > 0 &&
          (l = y
            ? (f * l * Math.PI) / 180
            : (f * Math.pow(l, n + 1) * Math.PI) / 180);
        var w = h._getSymbolFill(o),
          x = h._getAltSymbolFill(o) || w,
          j = h._getSymbolStroke(o),
          P = h._getAltSymbolStroke(o) || j,
          A = C.length;
        null != v && (A = Math.min(A, v.length));
        var m,
          T,
          b = this.origin,
          L = 0;
        void 0 !== h._getChartType() && (y = g = !1),
          b < r.actualMin
            ? (b = r.actualMin)
            : b > r.actualMax && (b = r.actualMax);
        r.convert(b);
        var S = e.actualMin,
          k = e.actualMax;
        h._isCustomAxisY() && (y = g = !1), c._areas[o] || (c._areas[o] = []);
        for (var M = 0; M < A; M++) {
          var R = v ? v[M] : M,
            I = C[M];
          if (
            (this._getSymbolOrigin && r.convert(this._getSymbolOrigin(b, M, A)),
            this._getSymbolStyles)
          ) {
            var F = this._getSymbolStyles(M, A);
            (w = F && F.fill ? F.fill : w),
              (x = F && F.fill ? F.fill : x),
              (j = F && F.stroke ? F.stroke : j),
              (P = F && F.stroke ? F.stroke : P);
          }
          if (
            ((m = I > 0 ? w : x),
            (T = I > 0 ? j : P),
            (t.fill = m),
            (t.stroke = T),
            wjcChart._DataInfo.isValid(R) && wjcChart._DataInfo.isValid(I))
          ) {
            if (y) {
              var N = R - 0.5 * l,
                X = R + 0.5 * l;
              if ((N < S && X < S) || (N > k && X > k)) continue;
              if (
                ((N = e.convert(N)),
                (X = e.convert(X)),
                !wjcChart._DataInfo.isValid(N) ||
                  !wjcChart._DataInfo.isValid(X))
              )
                continue;
              var O, D;
              g && (I /= this.dataInfo.getStackedAbsSum(R));
              var V = isNaN(d[R]) ? 0 : d[R];
              (O = V), (D = V + I), (d[R] = V + I);
              var G = e.convert(R),
                Y = r.convert(O),
                E = r.convert(D);
              (G -= l / 2),
                t.drawDonutSegment(
                  c._center.x,
                  c._center.y,
                  E,
                  Y,
                  G + _,
                  l,
                  null,
                  h.symbolStyle
                ),
                ((u = new wjcChart._DonutSegment(
                  new wjcCore.Point(c._center.x, c._center.y),
                  E,
                  Y,
                  G + _,
                  l,
                  c.startAngle || 0
                )).tag = new wjcChart._DataPoint(o, M, R, V + I)),
                this.hitTester.add(u, o);
            } else {
              var G = e.convert(R),
                B = r.convert(I);
              c._convertPoint(B, G);
              (G -= l / 2),
                t.drawPieSegment(
                  c._center.x,
                  c._center.y,
                  B,
                  G + _,
                  l,
                  null,
                  h.symbolStyle
                ),
                ((u = new wjcChart._PieSegment(
                  new wjcCore.Point(c._center.x, c._center.y),
                  B,
                  G + _,
                  l,
                  c.startAngle
                )).tag = new wjcChart._DataPoint(o, M, R, I)),
                this.hitTester.add(u, o);
            }
            c._areas[o].push(u), a._setPointIndex(M, L), L++;
          }
        }
      }
    }),
    e
  );
})(wjcChart._BarPlotter);
exports._RadarBarPlotter = _RadarBarPlotter;
