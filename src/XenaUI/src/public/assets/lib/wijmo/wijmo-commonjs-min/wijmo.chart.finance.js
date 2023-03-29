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
function _trunc(t) {
  return wjcCore.asNumber(t, !0, !1), t > 0 ? Math.floor(t) : Math.ceil(t);
}
function _sum(t) {
  return (
    arguments.length > 1 && (t = Array.prototype.slice.call(arguments)),
    wjcCore.asArray(t, !1),
    t.reduce(function (t, e) {
      return t + wjcCore.asNumber(e);
    }, 0)
  );
}
function _average(t) {
  return (
    arguments.length > 1 && (t = Array.prototype.slice.call(arguments)),
    wjcCore.asArray(t, !1),
    _sum(t) / t.length
  );
}
function _minimum(t) {
  return (
    arguments.length > 1 && (t = Array.prototype.slice.call(arguments)),
    wjcCore.asArray(t, !1),
    Math.min.apply(null, t)
  );
}
function _maximum(t) {
  return (
    arguments.length > 1 && (t = Array.prototype.slice.call(arguments)),
    wjcCore.asArray(t, !1),
    Math.max.apply(null, t)
  );
}
function _variance(t) {
  arguments.length > 1 && (t = Array.prototype.slice.call(arguments)),
    wjcCore.asArray(t, !1);
  var e = _average(t);
  return _average(
    t.map(function (t) {
      return Math.pow(t - e, 2);
    })
  );
}
function _stdDeviation(t) {
  return (
    arguments.length > 1 && (t = Array.prototype.slice.call(arguments)),
    wjcCore.asArray(t, !1),
    Math.sqrt(_variance(t))
  );
}
function _avgTrueRng(t, e, a, i) {
  void 0 === i && (i = 14),
    wjcCore.asArray(t, !1),
    wjcCore.asArray(e, !1),
    wjcCore.asArray(a, !1),
    wjcCore.asInt(i, !1, !0);
  var r = _trueRng(t, e, a, i),
    n = Math.min(t.length, e.length, a.length, r.length),
    s = [];
  wjcCore.assert(
    n > i && i > 1,
    'Average True Range period must be an integer less than the length of the data and greater than one.'
  );
  for (var o = 0; o < n; o++)
    wjcCore.asNumber(t[o], !1),
      wjcCore.asNumber(e[o], !1),
      wjcCore.asNumber(a[o], !1),
      wjcCore.asNumber(r[o], !1),
      o + 1 === i
        ? s.push(_average(r.slice(0, i)))
        : o + 1 > i && s.push(((i - 1) * s[s.length - 1] + r[o]) / i);
  return s;
}
function _trueRng(t, e, a, i) {
  void 0 === i && (i = 14),
    wjcCore.asArray(t, !1),
    wjcCore.asArray(e, !1),
    wjcCore.asArray(a, !1),
    wjcCore.asInt(i, !1, !0);
  var r = Math.min(t.length, e.length, a.length),
    n = [];
  wjcCore.assert(
    r > i && i > 1,
    'True Range period must be an integer less than the length of the data and greater than one.'
  );
  for (var s = 0; s < r; s++)
    wjcCore.asNumber(t[s], !1),
      wjcCore.asNumber(e[s], !1),
      wjcCore.asNumber(a[s], !1),
      0 === s
        ? n.push(t[s] - e[s])
        : n.push(
            Math.max(
              t[s] - e[s],
              Math.abs(t[s] - a[s - 1]),
              Math.abs(e[s] - a[s - 1])
            )
          );
  return n;
}
function _sma(t, e) {
  wjcCore.asArray(t, !1),
    wjcCore.asNumber(e, !1, !0),
    wjcCore.assert(
      t.length > e && e > 1,
      'Simple Moving Average period must be an integer less than the length of the data and greater than one.'
    );
  for (var a = [], i = e; i <= t.length; i++)
    a.push(_average(t.slice(i - e, i)));
  return a;
}
function _ema(t, e) {
  wjcCore.asArray(t, !1),
    wjcCore.asNumber(e, !1, !0),
    wjcCore.assert(
      t.length > e && e > 1,
      'Exponential Moving Average period must be an integer less than the length of the data and greater than one.'
    );
  var a = [],
    i = 2 / (e + 1),
    r = _sma(t, e);
  t = t.slice(e - 1);
  for (var n = 0; n < t.length; n++)
    0 === n ? a.push(r[0]) : a.push((t[n] - a[n - 1]) * i + a[n - 1]);
  return a;
}
function _range(t, e, a) {
  void 0 === a && (a = 1),
    wjcCore.asNumber(t, !1),
    wjcCore.asNumber(e, !1),
    wjcCore.asNumber(a, !1),
    wjcCore.assert(t < e, 'begin argument must be less than end argument.');
  for (var i = [], r = t; r <= e; r += a) i.push(r);
  return i;
}
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
        for (var a in e) e.hasOwnProperty(a) && (t[a] = e[a]);
      };
    return function (e, a) {
      function i() {
        this.constructor = e;
      }
      t(e, a),
        (e.prototype =
          null === a
            ? Object.create(a)
            : ((i.prototype = a.prototype), new i()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcChart = require('wijmo/wijmo.chart'),
  wjcSelf = require('wijmo/wijmo.chart.finance');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.chart = window.wijmo.chart || {}),
  (window.wijmo.chart.finance = wjcSelf),
  (exports._trunc = _trunc),
  (exports._sum = _sum),
  (exports._average = _average),
  (exports._minimum = _minimum),
  (exports._maximum = _maximum),
  (exports._variance = _variance),
  (exports._stdDeviation = _stdDeviation),
  (exports._avgTrueRng = _avgTrueRng),
  (exports._trueRng = _trueRng),
  (exports._sma = _sma),
  (exports._ema = _ema),
  (exports._range = _range);
var FinancialChartType;
!(function (t) {
  (t[(t.Column = 0)] = 'Column'),
    (t[(t.Scatter = 1)] = 'Scatter'),
    (t[(t.Line = 2)] = 'Line'),
    (t[(t.LineSymbols = 3)] = 'LineSymbols'),
    (t[(t.Area = 4)] = 'Area'),
    (t[(t.Candlestick = 5)] = 'Candlestick'),
    (t[(t.HighLowOpenClose = 6)] = 'HighLowOpenClose'),
    (t[(t.HeikinAshi = 7)] = 'HeikinAshi'),
    (t[(t.LineBreak = 8)] = 'LineBreak'),
    (t[(t.Renko = 9)] = 'Renko'),
    (t[(t.Kagi = 10)] = 'Kagi'),
    (t[(t.ColumnVolume = 11)] = 'ColumnVolume'),
    (t[(t.EquiVolume = 12)] = 'EquiVolume'),
    (t[(t.CandleVolume = 13)] = 'CandleVolume'),
    (t[(t.ArmsCandleVolume = 14)] = 'ArmsCandleVolume'),
    (t[(t.PointAndFigure = 15)] = 'PointAndFigure');
})(
  (FinancialChartType =
    exports.FinancialChartType || (exports.FinancialChartType = {}))
);
var FinancialChart = (function (t) {
  function e(e, a) {
    var i = t.call(this, e, null) || this;
    return (
      (i._chartType = FinancialChartType.Line),
      (i.__heikinAshiPlotter = null),
      (i.__lineBreakPlotter = null),
      (i.__renkoPlotter = null),
      (i.__kagiPlotter = null),
      (i.__pfPlotter = null),
      i.initialize(a),
      i
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'chartType', {
      get: function () {
        return this._chartType;
      },
      set: function (t) {
        t != this._chartType &&
          ((this._chartType = wjcCore.asEnum(t, FinancialChartType)),
          this.invalidate());
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
    Object.defineProperty(e.prototype, '_heikinAshiPlotter', {
      get: function () {
        return (
          null === this.__heikinAshiPlotter &&
            ((this.__heikinAshiPlotter = new _HeikinAshiPlotter()),
            this._initPlotter(this.__heikinAshiPlotter)),
          this.__heikinAshiPlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_lineBreakPlotter', {
      get: function () {
        return (
          null === this.__lineBreakPlotter &&
            ((this.__lineBreakPlotter = new _LineBreakPlotter()),
            this._initPlotter(this.__lineBreakPlotter)),
          this.__lineBreakPlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_renkoPlotter', {
      get: function () {
        return (
          null === this.__renkoPlotter &&
            ((this.__renkoPlotter = new _RenkoPlotter()),
            this._initPlotter(this.__renkoPlotter)),
          this.__renkoPlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_kagiPlotter', {
      get: function () {
        return (
          null === this.__kagiPlotter &&
            ((this.__kagiPlotter = new _KagiPlotter()),
            this._initPlotter(this.__kagiPlotter)),
          this.__kagiPlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_pfPlotter', {
      get: function () {
        return (
          null === this.__pfPlotter &&
            ((this.__pfPlotter = new _PointAndFigurePlotter()),
            this._initPlotter(this.__pfPlotter)),
          this.__pfPlotter
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._getChartType = function () {
      var t = null;
      switch (this.chartType) {
        case FinancialChartType.Area:
          t = wjcChart.ChartType.Area;
          break;
        case FinancialChartType.Line:
        case FinancialChartType.Kagi:
        case FinancialChartType.PointAndFigure:
          t = wjcChart.ChartType.Line;
          break;
        case FinancialChartType.Column:
        case FinancialChartType.ColumnVolume:
          t = wjcChart.ChartType.Column;
          break;
        case FinancialChartType.LineSymbols:
          t = wjcChart.ChartType.LineSymbols;
          break;
        case FinancialChartType.Scatter:
          t = wjcChart.ChartType.Scatter;
          break;
        case FinancialChartType.Candlestick:
        case FinancialChartType.Renko:
        case FinancialChartType.HeikinAshi:
        case FinancialChartType.LineBreak:
        case FinancialChartType.EquiVolume:
        case FinancialChartType.CandleVolume:
        case FinancialChartType.ArmsCandleVolume:
          t = wjcChart.ChartType.Candlestick;
          break;
        case FinancialChartType.HighLowOpenClose:
          t = wjcChart.ChartType.HighLowOpenClose;
      }
      return t;
    }),
    (e.prototype._getPlotter = function (e) {
      var a = this.chartType,
        i = null;
      if (e) {
        var r = e.chartType;
        r && !wjcCore.isUndefined(r) && r != a && ((a = r), !0);
      }
      switch (a) {
        case FinancialChartType.HeikinAshi:
          i = this._heikinAshiPlotter;
          break;
        case FinancialChartType.LineBreak:
          i = this._lineBreakPlotter;
          break;
        case FinancialChartType.Renko:
          i = this._renkoPlotter;
          break;
        case FinancialChartType.Kagi:
          i = this._kagiPlotter;
          break;
        case FinancialChartType.ColumnVolume:
          ((i = t.prototype._getPlotter.call(this, e)).isVolume = !0),
            (i.width = 1);
          break;
        case FinancialChartType.EquiVolume:
          ((i = t.prototype._getPlotter.call(this, e)).isEqui = !0),
            (i.isCandle = !1),
            (i.isArms = !1),
            (i.isVolume = !0),
            (i.symbolWidth = '100%');
          break;
        case FinancialChartType.CandleVolume:
          ((i = t.prototype._getPlotter.call(this, e)).isEqui = !1),
            (i.isCandle = !0),
            (i.isArms = !1),
            (i.isVolume = !0),
            (i.symbolWidth = '100%');
          break;
        case FinancialChartType.ArmsCandleVolume:
          ((i = t.prototype._getPlotter.call(this, e)).isEqui = !1),
            (i.isCandle = !1),
            (i.isArms = !0),
            (i.isVolume = !0),
            (i.symbolWidth = '100%');
          break;
        case FinancialChartType.PointAndFigure:
          i = this._pfPlotter;
          break;
        default:
          i = t.prototype._getPlotter.call(this, e);
      }
      return i;
    }),
    (e.prototype._createSeries = function () {
      return new FinancialSeries();
    }),
    e
  );
})(wjcChart.FlexChartCore);
exports.FinancialChart = FinancialChart;
var FinancialSeries = (function (t) {
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
          ((this._finChartType = wjcCore.asEnum(t, FinancialChartType, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._getChartType = function () {
      var t = null;
      switch (this.chartType) {
        case FinancialChartType.Area:
          t = wjcChart.ChartType.Area;
          break;
        case FinancialChartType.Line:
        case FinancialChartType.Kagi:
        case FinancialChartType.PointAndFigure:
          t = wjcChart.ChartType.Line;
          break;
        case FinancialChartType.Column:
        case FinancialChartType.ColumnVolume:
          t = wjcChart.ChartType.Column;
          break;
        case FinancialChartType.LineSymbols:
          t = wjcChart.ChartType.LineSymbols;
          break;
        case FinancialChartType.Scatter:
          t = wjcChart.ChartType.Scatter;
          break;
        case FinancialChartType.Candlestick:
        case FinancialChartType.Renko:
        case FinancialChartType.HeikinAshi:
        case FinancialChartType.LineBreak:
        case FinancialChartType.EquiVolume:
        case FinancialChartType.CandleVolume:
        case FinancialChartType.ArmsCandleVolume:
          t = wjcChart.ChartType.Candlestick;
          break;
        case FinancialChartType.HighLowOpenClose:
          t = wjcChart.ChartType.HighLowOpenClose;
      }
      return t;
    }),
    e
  );
})(wjcChart.SeriesBase);
exports.FinancialSeries = FinancialSeries;
var _BaseCalculator = (function () {
  function t(t, e, a, i) {
    (this.highs = t), (this.lows = e), (this.opens = a), (this.closes = i);
  }
  return (t.prototype.calculate = function () {}), t;
})();
exports._BaseCalculator = _BaseCalculator;
var _HeikinAshiCalculator = (function (t) {
  function e(e, a, i, r) {
    return t.call(this, e, a, i, r) || this;
  }
  return (
    __extends(e, t),
    (e.prototype.calculate = function () {
      var t,
        e,
        a,
        i,
        r = Math.min(
          this.highs.length,
          this.lows.length,
          this.opens.length,
          this.closes.length
        ),
        n = [];
      if (r <= 0) return n;
      for (var s = 0; s < r; s++)
        (i = _average(
          this.highs[s],
          this.lows[s],
          this.opens[s],
          this.closes[s]
        )),
          0 === s
            ? ((a = _average(this.opens[s], this.closes[s])),
              (t = this.highs[s]),
              (e = this.lows[s]))
            : ((a = _average(n[s - 1].open, n[s - 1].close)),
              (t = Math.max(this.highs[s], a, i)),
              (e = Math.min(this.lows[s], a, i))),
          n.push({
            high: t,
            low: e,
            close: i,
            open: a,
            pointIndex: s,
            x: null,
          });
      return n;
    }),
    e
  );
})(_BaseCalculator);
exports._HeikinAshiCalculator = _HeikinAshiCalculator;
var _BaseRangeCalculator = (function (t) {
  function e(e, a, i, r, n, s, o, l) {
    var h = t.call(this, e, a, i, r) || this;
    return (h.xs = n), (h.size = s), (h.unit = o), (h.fields = l), h;
  }
  return (
    __extends(e, t),
    (e.prototype._getValues = function () {
      var t,
        e = [],
        a = Math.min(
          this.highs.length,
          this.lows.length,
          this.opens.length,
          this.closes.length
        );
      switch (this.fields) {
        case DataFields.High:
          e = this.highs;
          break;
        case DataFields.Low:
          e = this.lows;
          break;
        case DataFields.Open:
          e = this.opens;
          break;
        case DataFields.HL2:
          for (t = 0; t < a; t++) e.push(_average(this.highs[t], this.lows[t]));
          break;
        case DataFields.HLC3:
          for (t = 0; t < a; t++)
            e.push(_average(this.highs[t], this.lows[t], this.closes[t]));
          break;
        case DataFields.HLOC4:
          for (t = 0; t < a; t++)
            e.push(
              _average(
                this.highs[t],
                this.lows[t],
                this.opens[t],
                this.closes[t]
              )
            );
          break;
        case DataFields.Close:
        default:
          e = this.closes;
      }
      return e;
    }),
    (e.prototype._getSize = function () {
      var t =
        this.unit === RangeMode.ATR
          ? _avgTrueRng(this.highs, this.lows, this.closes, this.size)
          : null;
      return this.unit === RangeMode.ATR ? t[t.length - 1] : this.size;
    }),
    e
  );
})(_BaseCalculator);
exports._BaseRangeCalculator = _BaseRangeCalculator;
var _LineBreakCalculator = (function (t) {
  function e(e, a, i, r, n, s) {
    return t.call(this, e, a, i, r, n, s) || this;
  }
  return (
    __extends(e, t),
    (e.prototype.calculate = function () {
      var t = null !== this.xs && this.xs.length > 0,
        e = this.closes.length,
        a = [],
        i = [[], []];
      if (e <= 0) return a;
      for (var r, n, s, o, l, h, c, u = [], _ = 1; _ < e; _++) {
        if (
          ((o = a.length),
          (l = o - 1),
          (n = t ? this.xs[_] : _),
          (s = this.closes[_]),
          -1 === l)
        ) {
          if ((r = this.closes[0]) === s) continue;
        } else if (
          ((u =
            this._trendExists(i) || 1 === this.size
              ? i[0].slice(-this.size).concat(i[1].slice(-this.size))
              : i[0].slice(1 - this.size).concat(i[1].slice(1 - this.size))),
          (h = Math.max.apply(null, u)),
          (c = Math.min.apply(null, u)),
          s > h)
        )
          r = Math.max(i[0][l], i[1][l]);
        else {
          if (!(s < c)) continue;
          r = Math.min(i[0][l], i[1][l]);
        }
        i[0].push(r),
          i[1].push(s),
          a.push({
            high: Math.max(r, s),
            low: Math.min(r, s),
            open: r,
            close: s,
            x: n,
            pointIndex: _,
          });
      }
      return a;
    }),
    (e.prototype._trendExists = function (t) {
      if (t[1].length < this.size) return !1;
      var e,
        a = !1,
        i = t[1].slice(-this.size);
      for (e = 1; e < this.size && (a = i[e] > i[e - 1]); e++);
      if (!a) for (e = 1; e < this.size && (a = i[e] < i[e - 1]); e++);
      return a;
    }),
    e
  );
})(_BaseRangeCalculator);
exports._LineBreakCalculator = _LineBreakCalculator;
var _KagiCalculator = (function (t) {
  function e(e, a, i, r, n, s, o, l) {
    return t.call(this, e, a, i, r, n, s, o, l) || this;
  }
  return (
    __extends(e, t),
    (e.prototype.calculate = function () {
      var t = this._getSize(),
        e = Math.min(
          this.highs.length,
          this.lows.length,
          this.opens.length,
          this.closes.length
        ),
        a = this._getValues(),
        i = null !== this.xs && this.xs.length > 0,
        r = [],
        n = [[], []];
      if (e <= 0) return r;
      for (var s, o, l, h, c, u, _, g, p, d, f = 1; f < e; f++) {
        if (
          ((h = r.length),
          (c = h - 1),
          (o = i ? this.xs[f] : f),
          (d = f),
          (p = !1),
          this.fields === DataFields.HighLow)
        )
          if (-1 === c)
            if (this.highs[f] > this.highs[0]) l = this.highs[f];
            else {
              if (!(this.lows[f] < this.lows[0])) continue;
              l = this.lows[f];
            }
          else if ((g = n[1][c] - n[0][c]) > 0)
            if (this.highs[f] > n[1][c]) l = this.highs[f];
            else {
              if (!(this.lows[f] < n[1][c])) continue;
              l = this.lows[f];
            }
          else if (this.lows[f] < n[1][c]) l = this.lows[f];
          else {
            if (!(this.highs[f] > n[1][c])) continue;
            l = this.highs[f];
          }
        else l = a[f];
        if (
          (this.unit === RangeMode.Percentage && (t = l * this.size), -1 === c)
        ) {
          if (
            ((o = i ? this.xs[0] : 0),
            (d = 0),
            (s =
              this.fields === DataFields.HighLow
                ? null == this.highs[0]
                  ? this.highs[this.highs.length - 1]
                  : this.highs[0]
                : null == a[0]
                ? a[a.length - 1]
                : a[0]),
            (g = Math.abs(s - l) || 0) < t)
          )
            continue;
        } else if (
          ((g = n[1][c] - n[0][c]),
          (_ = Math.max(n[0][c], n[1][c])),
          (u = Math.min(n[0][c], n[1][c])),
          g > 0)
        )
          if (l > _) p = !0;
          else {
            if (!((g = _ - l) >= t)) continue;
            s = _;
          }
        else if (l < u) p = !0;
        else {
          if (!((g = l - u) >= t)) continue;
          s = u;
        }
        p
          ? ((n[1][c] = l),
            (r[c].close = l),
            (r[c].high = Math.max(r[c].open, r[c].close)),
            (r[c].low = Math.min(r[c].open, r[c].close)))
          : (n[0].push(s),
            n[1].push(l),
            r.push({
              high: Math.max(s, l),
              low: Math.min(s, l),
              open: s,
              close: l,
              x: o,
              pointIndex: d,
            }));
      }
      return r;
    }),
    e
  );
})(_BaseRangeCalculator);
exports._KagiCalculator = _KagiCalculator;
var _RenkoCalculator = (function (t) {
  function e(e, a, i, r, n, s, o, l, h) {
    void 0 === h && (h = !1);
    var c = t.call(this, e, a, i, r, n, s, o, l) || this;
    return (c.rounding = h), c;
  }
  return (
    __extends(e, t),
    (e.prototype.calculate = function () {
      var t = this._getSize(),
        e = Math.min(
          this.highs.length,
          this.lows.length,
          this.opens.length,
          this.closes.length
        ),
        a = null !== this.xs && this.xs.length > 0,
        i = this._getValues(),
        r = [],
        n = [[], []];
      if (e <= 0) return r;
      for (var s, o, l, h, c, u, _, g, p = 1; p < e; p++) {
        if (
          ((h = r.length),
          (c = h - 1),
          (o = a ? this.xs[p] : p),
          this.fields === DataFields.HighLow)
        )
          if (-1 === c)
            if (this.highs[p] - this.highs[0] > t)
              (s = this.highs[0]), (l = this.highs[p]);
            else {
              if (!(this.lows[0] - this.lows[p] > t)) continue;
              (s = this.lows[0]), (l = this.lows[p]);
            }
          else if (
            ((u = Math.min(n[0][c], n[1][c])),
            (_ = Math.max(n[0][c], n[1][c])),
            this.highs[p] - _ > t)
          )
            (s = _), (l = this.highs[p]);
          else {
            if (!(u - this.lows[p] > t)) continue;
            (s = u), (l = this.lows[p]);
          }
        else if (((l = i[p]), -1 === c)) s = i[0];
        else if (
          ((u = Math.min(n[0][c], n[1][c])),
          (_ = Math.max(n[0][c], n[1][c])),
          l > _)
        )
          s = _;
        else {
          if (!(l < u)) continue;
          s = u;
        }
        if (((g = l - s), !(Math.abs(g) < t))) {
          g = _trunc(g / t);
          for (var d = 0; d < Math.abs(g); d++) {
            var f = {};
            this.rounding && (s = this._round(s, t)),
              n[0].push(s),
              (f.open = s),
              (s = g > 0 ? s + t : s - t),
              n[1].push(s),
              (f.close = s),
              (f.x = o),
              (f.pointIndex = p),
              (f.high = Math.max(f.open, f.close)),
              (f.low = Math.min(f.open, f.close)),
              r.push(f);
          }
        }
      }
      return r;
    }),
    (e.prototype._round = function (t, e) {
      return Math.round(t / e) * e;
    }),
    e
  );
})(_BaseRangeCalculator);
exports._RenkoCalculator = _RenkoCalculator;
var _HeikinAshiPlotter = (function (t) {
  function e() {
    var e = t.call(this) || this;
    return (e._symFactor = 0.7), e.clear(), e;
  }
  return (
    __extends(e, t),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this),
        (this._haValues = null),
        (this._calculator = null);
    }),
    (e.prototype.plotSeries = function (t, e, a, i, r, n, s) {
      var o = this;
      this._calculate(i);
      var l = wjcCore.asType(i, wjcChart.SeriesBase),
        h = this.chart.series.indexOf(i),
        c = i.getValues(1),
        u = this._symFactor,
        _ = this._haValues.length,
        g = !0;
      if (c) {
        var p = this.dataInfo.getDeltaX();
        p > 0 && (u *= p);
      } else c = this.dataInfo.getXVals();
      c ? (_ = Math.min(_, c.length)) : ((g = !1), (c = new Array(_)));
      var d = this._DEFAULT_WIDTH,
        f = l._getSymbolFill(h),
        C = l._getAltSymbolFill(h) || 'transparent',
        m = l._getSymbolStroke(h),
        w = l._getAltSymbolStroke(h) || m,
        y = u,
        v = i.getDataType(1) || i.chart._xDataType;
      t.strokeWidth = d;
      for (
        var x,
          j,
          b,
          k,
          F,
          P,
          T,
          V,
          A = e.actualMin,
          L = e.actualMax,
          M = 0,
          S = 0;
        S < _;
        S++
      )
        if (
          ((b = g ? c[S] : S),
          wjcChart._DataInfo.isValid(b) && A <= b && b <= L)
        ) {
          if (
            ((F = this._haValues[S].high),
            (P = this._haValues[S].low),
            (T = this._haValues[S].open),
            (V = this._haValues[S].close),
            (x = T < V ? C : f),
            (j = T < V ? w : m),
            (t.fill = x),
            (t.stroke = j),
            t.startGroup(),
            (k = this._getDataPoint(h, S, b, i)),
            this.chart.itemFormatter)
          ) {
            var D = new wjcChart.HitTestInfo(
              this.chart,
              new wjcCore.Point(e.convert(b), a.convert(F)),
              wjcChart.ChartElement.SeriesSymbol
            );
            D._setData(l, S),
              D._setDataPoint(k),
              this.chart.itemFormatter(t, D, function () {
                o._drawSymbol(t, e, a, h, S, x, y, b, F, P, T, V, k, v);
              });
          } else this._drawSymbol(t, e, a, h, S, x, y, b, F, P, T, V, k, v);
          t.endGroup(), i._setPointIndex(S, M), M++;
        }
    }),
    (e.prototype._drawSymbol = function (
      t,
      e,
      a,
      i,
      r,
      n,
      s,
      o,
      l,
      h,
      c,
      u,
      _,
      g
    ) {
      var p,
        d = null,
        f = null,
        C = null,
        m = null,
        w = g === wjcCore.DataType.Date ? 432e5 : 0.5;
      if (((C = e.convert(o - w * s)), (m = e.convert(o + w * s)), C > m)) {
        var y = C;
        (C = m), (m = y);
      }
      (o = e.convert(o)),
        wjcChart._DataInfo.isValid(c) &&
          wjcChart._DataInfo.isValid(u) &&
          ((c = a.convert(c)),
          (u = a.convert(u)),
          (f = (d = Math.min(c, u)) + Math.abs(c - u)),
          t.drawRect(C, d, m - C, f - d),
          ((p = new wjcChart._RectArea(
            new wjcCore.Rect(C, d, m - C, f - d)
          )).tag = _),
          this.hitTester.add(p, i)),
        wjcChart._DataInfo.isValid(l) &&
          ((l = a.convert(l)), null !== d && t.drawLine(o, d, o, l)),
        wjcChart._DataInfo.isValid(h) &&
          ((h = a.convert(h)), null !== f && t.drawLine(o, f, o, h));
    }),
    (e.prototype._getDataPoint = function (t, e, a, i) {
      var r = new wjcChart._DataPoint(t, e, a, this._haValues[e].high),
        n = i._getItem(e),
        s = i._getBinding(0),
        o = i._getBinding(1),
        l = i._getBinding(2),
        h = i._getBinding(3),
        c = i._getAxisY();
      return (
        (r.item = wjcChart._BasePlotter.cloneStyle(n, [])),
        (r.item[s] = this._haValues[e].high),
        (r.item[o] = this._haValues[e].low),
        (r.item[l] = this._haValues[e].open),
        (r.item[h] = this._haValues[e].close),
        (r.y = this._haValues[e].high),
        (r.yfmt = c._formatValue(this._haValues[e].high)),
        r
      );
    }),
    (e.prototype._calculate = function (t) {
      var e = t._getBindingValues(0),
        a = t._getBindingValues(1),
        i = t._getBindingValues(2),
        r = t._getBindingValues(3);
      (this._calculator = new _HeikinAshiCalculator(e, a, i, r)),
        (this._haValues = this._calculator.calculate()),
        (null === this._haValues || wjcCore.isUndefined(this._haValues)) &&
          this._init();
    }),
    (e.prototype._init = function () {
      this._haValues = [];
    }),
    e
  );
})(wjcChart._FinancePlotter);
exports._HeikinAshiPlotter = _HeikinAshiPlotter;
var _BaseRangePlotter = (function (t) {
  function e() {
    var e = t.call(this) || this;
    return (e._symFactor = 0.7), e.clear(), e;
  }
  return (
    __extends(e, t),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this),
        (this._rangeValues = null),
        (this._rangeXLabels = null),
        (this._calculator = null);
    }),
    (e.prototype.unload = function () {
      t.prototype.unload.call(this);
      for (var e, a, i = 0; i < this.chart.series.length; i++)
        (e = this.chart.series[i]) &&
          (a = e._getAxisX()) &&
          a.itemsSource &&
          (a.itemsSource = null);
    }),
    (e.prototype.adjustLimits = function (t, e) {
      var a,
        i,
        r,
        n = 0,
        s = 0,
        o = 0,
        l = 0,
        h = this.chart._xDataType === wjcCore.DataType.Date ? 0.5 : 0;
      wjcCore.assert(
        this.chart.series.length <= 1,
        'Current FinancialChartType only supports a single series'
      );
      for (var c = 0; c < this.chart.series.length; c++)
        (a = this.chart.series[c]),
          this._calculate(a),
          this._rangeValues.length <= 0 ||
            this._rangeXLabels.length <= 0 ||
            ((i = this._rangeValues.map(function (t) {
              return t.open;
            })).push.apply(
              i,
              this._rangeValues.map(function (t) {
                return t.close;
              })
            ),
            (r = this._rangeXLabels.map(function (t) {
              return t.value;
            })),
            (o = Math.min.apply(null, i)),
            (l = Math.max.apply(null, i)),
            (n = Math.min.apply(null, r)),
            (s = Math.max.apply(null, r)),
            (a._getAxisX().itemsSource = this._rangeXLabels));
      return (n -= h), new wjcCore.Rect(n, o, s - n + h, l - o);
    }),
    (e.prototype.plotSeries = function (t, e, a, i, r, n, s) {
      var o = this;
      this._calculate(i);
      var l = this.chart.series.indexOf(i),
        h = this._rangeValues.length,
        c = e.actualMin,
        u = e.actualMax,
        _ = this._DEFAULT_WIDTH,
        g = this._symFactor,
        p = i._getSymbolFill(l),
        d = i._getAltSymbolFill(l) || 'transparent',
        f = i._getSymbolStroke(l),
        C = i._getAltSymbolStroke(l) || f;
      t.strokeWidth = _;
      for (var m, w, y, v, x = 0, j = 0; j < h; j++)
        if (((m = j), wjcChart._DataInfo.isValid(m) && c <= m && m <= u)) {
          if (
            ((w = this._rangeValues[j].open),
            (y = this._rangeValues[j].close),
            (t.fill = w > y ? p : d),
            (t.stroke = w > y ? f : C),
            (v = this._getDataPoint(l, j, i, Math.max(w, y))),
            t.startGroup(),
            this.chart.itemFormatter)
          ) {
            var b = new wjcChart.HitTestInfo(
              this.chart,
              new wjcCore.Point(e.convert(m), a.convert(y)),
              wjcChart.ChartElement.SeriesSymbol
            );
            b._setData(i, j),
              b._setDataPoint(v),
              this.chart.itemFormatter(t, b, function () {
                o._drawSymbol(t, e, a, l, x, g, m, w, y, v);
              });
          } else this._drawSymbol(t, e, a, l, x, g, m, w, y, v);
          t.endGroup(), i._setPointIndex(j, x), x++;
        }
    }),
    (e.prototype._drawSymbol = function (t, e, a, i, r, n, s, o, l, h) {
      var c, u, _, g, p;
      if (((_ = e.convert(s - 0.5 * n)), (g = e.convert(s + 0.5 * n)), _ > g)) {
        var d = _;
        (_ = g), (g = d);
      }
      wjcChart._DataInfo.isValid(o) &&
        wjcChart._DataInfo.isValid(l) &&
        ((o = a.convert(o)),
        (l = a.convert(l)),
        (u = (c = Math.min(o, l)) + Math.abs(o - l)),
        t.drawRect(_, c, g - _, u - c),
        ((p = new wjcChart._RectArea(
          new wjcCore.Rect(_, c, g - _, u - c)
        )).tag = h),
        this.hitTester.add(p, i));
    }),
    (e.prototype._getDataPoint = function (t, e, a, i) {
      var r = e,
        n = new wjcChart._DataPoint(t, e, r, i),
        s = a._getItem(this._rangeValues[e].pointIndex),
        o = a.bindingX || this.chart.bindingX,
        l = a._getBinding(0),
        h = a._getBinding(1),
        c = a._getBinding(2),
        u = a._getBinding(3),
        _ = a._getAxisY();
      return (
        (n.item = wjcChart._BasePlotter.cloneStyle(s, [])),
        (n.item[l] = this._rangeValues[e].high),
        (n.item[h] = this._rangeValues[e].low),
        (n.item[c] = this._rangeValues[e].open),
        (n.item[u] = this._rangeValues[e].close),
        (n.y = this._rangeValues[e].close),
        (n.yfmt = _._formatValue(this._rangeValues[e].close)),
        (n.x = n.item[o]),
        (n.xfmt = this._rangeXLabels[e]._text),
        n
      );
    }),
    (e.prototype._init = function () {
      (this._rangeValues = []), (this._rangeXLabels = []);
    }),
    (e.prototype._calculate = function (t) {}),
    (e.prototype._generateXLabels = function (t) {
      var e,
        a = this,
        i = t._getAxisX(),
        r = t.getDataType(1) || this.chart._xDataType;
      this._rangeValues.forEach(function (t, n) {
        var s = t.x;
        (e =
          r === wjcCore.DataType.Date
            ? wjcCore.Globalize.format(
                wjcChart.FlexChart._fromOADate(s),
                i.format || 'd'
              )
            : r === wjcCore.DataType.Number
            ? i._formatValue(s)
            : (null !== r && r !== wjcCore.DataType.String) || !a.chart._xlabels
            ? s.toString()
            : a.chart._xlabels[s]),
          a._rangeXLabels.push({ value: n, text: e, _text: e });
      }, this);
    }),
    e
  );
})(wjcChart._BasePlotter);
exports._BaseRangePlotter = _BaseRangePlotter;
var DataFields;
!(function (t) {
  (t[(t.Close = 0)] = 'Close'),
    (t[(t.High = 1)] = 'High'),
    (t[(t.Low = 2)] = 'Low'),
    (t[(t.Open = 3)] = 'Open'),
    (t[(t.HighLow = 4)] = 'HighLow'),
    (t[(t.HL2 = 5)] = 'HL2'),
    (t[(t.HLC3 = 6)] = 'HLC3'),
    (t[(t.HLOC4 = 7)] = 'HLOC4');
})((DataFields = exports.DataFields || (exports.DataFields = {})));
var RangeMode;
!(function (t) {
  (t[(t.Fixed = 0)] = 'Fixed'),
    (t[(t.ATR = 1)] = 'ATR'),
    (t[(t.Percentage = 2)] = 'Percentage');
})((RangeMode = exports.RangeMode || (exports.RangeMode = {})));
var _LineBreakPlotter = (function (t) {
  function e() {
    return t.call(this) || this;
  }
  return (
    __extends(e, t),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this), (this._newLineBreaks = null);
    }),
    (e.prototype._calculate = function (t) {
      this._init();
      var e = t._getBindingValues(3),
        a = t.getValues(1) || this.chart._xvals;
      (this._calculator = new _LineBreakCalculator(
        null,
        null,
        null,
        e,
        a,
        this._newLineBreaks
      )),
        (this._rangeValues = this._calculator.calculate()),
        (null === this._rangeValues ||
          wjcCore.isUndefined(this._rangeValues)) &&
          (this._rangeValues = []),
        this._generateXLabels(t);
    }),
    (e.prototype._init = function () {
      t.prototype._init.call(this),
        (this._newLineBreaks =
          wjcCore.asInt(
            this.getNumOption('newLineBreaks', 'lineBreak'),
            !0,
            !0
          ) || 3),
        wjcCore.assert(
          this._newLineBreaks >= 1,
          'Value must be greater than 1'
        );
    }),
    e
  );
})(_BaseRangePlotter);
exports._LineBreakPlotter = _LineBreakPlotter;
var _RenkoPlotter = (function (t) {
  function e() {
    return t.call(this) || this;
  }
  return (
    __extends(e, t),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this),
        (this._boxSize = null),
        (this._rangeMode = null);
    }),
    (e.prototype._calculate = function (t) {
      this._init();
      var e = t._getBindingValues(0),
        a = t._getBindingValues(1),
        i = t._getBindingValues(2),
        r = t._getBindingValues(3),
        n = t.getValues(1) || this.chart._xvals;
      (this._calculator = new _RenkoCalculator(
        e,
        a,
        i,
        r,
        n,
        this._boxSize,
        this._rangeMode,
        this._fields,
        this._rounding
      )),
        (this._rangeValues = this._calculator.calculate()),
        (null === this._rangeValues ||
          wjcCore.isUndefined(this._rangeValues)) &&
          (this._rangeValues = []),
        this._generateXLabels(t);
    }),
    (e.prototype._init = function () {
      t.prototype._init.call(this),
        (this._boxSize = this.getNumOption('boxSize', 'renko') || 14),
        (this._rangeMode =
          this.getOption('rangeMode', 'renko') || RangeMode.Fixed),
        (this._rangeMode = wjcCore.asEnum(this._rangeMode, RangeMode, !0)),
        wjcCore.assert(
          this._rangeMode !== RangeMode.Percentage,
          'RangeMode.Percentage is not supported'
        ),
        (this._fields = this.getOption('fields', 'renko') || DataFields.Close),
        (this._fields = wjcCore.asEnum(this._fields, DataFields, !0)),
        wjcCore.assert(
          this._fields !== DataFields.HighLow,
          'DataFields.HighLow is not supported'
        ),
        (this._rounding = wjcCore.asBoolean(
          this.getOption('rounding', 'renko'),
          !0
        ));
    }),
    (e.prototype._generateXLabels = function (e) {
      var a = this;
      t.prototype._generateXLabels.call(this, e),
        this._rangeXLabels.forEach(function (t, e) {
          e > 0 && a._rangeXLabels[e - 1]._text === t.text && (t.text = '');
        }, this);
    }),
    e
  );
})(_BaseRangePlotter);
exports._RenkoPlotter = _RenkoPlotter;
var _KagiPlotter = (function (t) {
  function e() {
    return t.call(this) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._calculate = function (t) {
      this._init();
      var e = t._getBindingValues(0),
        a = t._getBindingValues(1),
        i = t._getBindingValues(2),
        r = t._getBindingValues(3),
        n = t.getValues(1) || this.chart._xvals;
      (this._calculator = new _KagiCalculator(
        e,
        a,
        i,
        r,
        n,
        this._reversalAmount,
        this._rangeMode,
        this._fields
      )),
        (this._rangeValues = this._calculator.calculate()),
        (null === this._rangeValues ||
          wjcCore.isUndefined(this._rangeValues)) &&
          (this._rangeValues = []),
        this._generateXLabels(t);
    }),
    (e.prototype.plotSeries = function (t, e, a, i, r, n, s) {
      this._calculate(i);
      var o = this.chart.series.indexOf(i),
        l = this._rangeValues.length,
        h = e.actualMin,
        c = e.actualMax,
        u = this._DEFAULT_WIDTH,
        _ = i._getSymbolStroke(o),
        g = i._getAltSymbolStroke(o) || _,
        p = [],
        d = [];
      (t.stroke = _), (t.strokeWidth = u);
      var f,
        C,
        m,
        w,
        y,
        v,
        x,
        j = 0;
      t.startGroup();
      for (var b = 0; b < l; b++)
        (f = b),
          wjcChart._DataInfo.isValid(f) &&
            h <= f &&
            f <= c &&
            ((C = this._rangeValues[b].open),
            (m = this._rangeValues[b].close),
            0 === b
              ? ((w = Math.min(C, m)),
                (y = Math.max(C, m)),
                (t.strokeWidth = C > m ? u : 2 * u),
                (t.stroke = C > m ? _ : g),
                t.drawLine(
                  e.convert(f),
                  a.convert(C),
                  e.convert(f),
                  a.convert(m)
                ),
                t.drawLine(
                  e.convert(f - 1) - t.strokeWidth / 2,
                  a.convert(C),
                  e.convert(f) + t.strokeWidth / 2,
                  a.convert(C)
                ))
              : t.strokeWidth === u
              ? m > C
                ? (m > y
                    ? (t.drawLine(
                        e.convert(f),
                        a.convert(C),
                        e.convert(f),
                        a.convert(y)
                      ),
                      (t.strokeWidth = 2 * u),
                      (t.stroke = g),
                      t.drawLine(
                        e.convert(f),
                        a.convert(y),
                        e.convert(f),
                        a.convert(m)
                      ),
                      (w = C))
                    : t.drawLine(
                        e.convert(f),
                        a.convert(C),
                        e.convert(f),
                        a.convert(m)
                      ),
                  (y = m))
                : t.drawLine(
                    e.convert(f),
                    a.convert(C),
                    e.convert(f),
                    a.convert(m)
                  )
              : t.strokeWidth / 2 === u &&
                (m < C
                  ? (m < w
                      ? (t.drawLine(
                          e.convert(f),
                          a.convert(C),
                          e.convert(f),
                          a.convert(w)
                        ),
                        (t.strokeWidth = u),
                        (t.stroke = _),
                        t.drawLine(
                          e.convert(f),
                          a.convert(w),
                          e.convert(f),
                          a.convert(m)
                        ),
                        (y = C))
                      : t.drawLine(
                          e.convert(f),
                          a.convert(C),
                          e.convert(f),
                          a.convert(m)
                        ),
                    (w = m))
                  : t.drawLine(
                      e.convert(f),
                      a.convert(C),
                      e.convert(f),
                      a.convert(m)
                    )),
            b < l - 1 &&
              t.drawLine(
                e.convert(f) - t.strokeWidth / 2,
                a.convert(m),
                e.convert(f + 1) + t.strokeWidth / 2,
                a.convert(m)
              ),
            (x = this._getDataPoint(o, b, i, m)),
            ((v = new wjcChart._CircleArea(
              new wjcCore.Point(e.convert(f), a.convert(m)),
              0.5 * t.strokeWidth
            )).tag = x),
            this.hitTester.add(v, o),
            i._setPointIndex(b, j),
            j++,
            p.push(e.convert(f)),
            d.push(a.convert(C)),
            p.push(e.convert(f)),
            d.push(a.convert(m)));
      t.endGroup(), this.hitTester.add(new wjcChart._LinesArea(p, d), o);
    }),
    (e.prototype._init = function () {
      t.prototype._init.call(this),
        (this._reversalAmount =
          this.getNumOption('reversalAmount', 'kagi') || 14),
        (this._rangeMode =
          this.getOption('rangeMode', 'kagi') || RangeMode.Fixed),
        (this._rangeMode = wjcCore.asEnum(this._rangeMode, RangeMode, !0)),
        (this._fields = this.getOption('fields', 'kagi') || DataFields.Close),
        (this._fields = wjcCore.asEnum(this._fields, DataFields, !0));
    }),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this),
        (this._reversalAmount = null),
        (this._rangeMode = null);
    }),
    e
  );
})(_BaseRangePlotter);
exports._KagiPlotter = _KagiPlotter;
var PointAndFigureScaling;
!(function (t) {
  (t[(t.Traditional = 0)] = 'Traditional'),
    (t[(t.Fixed = 1)] = 'Fixed'),
    (t[(t.Dynamic = 2)] = 'Dynamic');
})(
  (PointAndFigureScaling =
    exports.PointAndFigureScaling || (exports.PointAndFigureScaling = {}))
);
var _PointAndFigurePlotter = (function (t) {
  function e() {
    return t.call(this) || this;
  }
  return (
    __extends(e, t),
    (e.prototype.clear = function () {
      t.prototype.clear.call(this),
        (this._boxSize = null),
        (this._fields = null),
        (this._reversal = null),
        (this._scaling = null);
    }),
    (e.prototype.unload = function () {
      t.prototype.unload.call(this),
        (this.chart.axisX.itemsSource = this._xlbls);
    }),
    (e.prototype._init = function () {
      (this._boxSize = this.getNumOption('boxSize', 'pointAndFigure') || 1),
        (this._reversal = this.getNumOption('reversal', 'pointAndFigure') || 3),
        (this._period = this.getNumOption('period', 'pointAndFigure') || 20),
        (this._fields =
          this.getOption('fields', 'pointAndFigure') || DataFields.Close),
        (this._fields = wjcCore.asEnum(this._fields, DataFields, !0)),
        wjcCore.assert(
          this._fields == DataFields.Close ||
            this._fields == DataFields.HighLow,
          'Only DataFields.Close and DataFields.HighLow are supported'
        ),
        (this._scaling =
          this.getOption('scaling', 'pointAndFigure') ||
          PointAndFigureScaling.Traditional),
        (this._scaling = wjcCore.asEnum(
          this._scaling,
          PointAndFigureScaling,
          !0
        )),
        (this._xlbls = []);
    }),
    (e.prototype.adjustLimits = function (t, e) {
      this._init(), this.hitTester.clear();
      var a = new wjcCore.Rect(0, 0, 0, 0),
        i = this.chart.series.length;
      if (
        (wjcCore.assert(
          i <= 1,
          'Current FinancialChartType only supports a single series'
        ),
        i > 0)
      ) {
        var r = this.chart.series[0],
          n = this._reversal,
          s = r.collectionView ? r.collectionView : this.chart.collectionView,
          o = s ? s.items : null;
        if (o && o.length > 0) {
          var l = r._getBinding(0),
            h = r._getBinding(1),
            c = r._getBinding(2),
            u = r._getBinding(3);
          this._fields == DataFields.Close &&
            (u ? (l = u) : c && (l = c), (h = l));
          var _ = r.bindingX ? r.bindingX : this.chart.bindingX,
            g = (this._actualBoxSize = this.calcBoxSize(o, l, h));
          if (
            ((this._pfdata = this.calcPFHiLo2(o, l, h, _, g, n)),
            this._pfdata && this._pfdata.length > 0)
          ) {
            var p = this._pfdata.reduce(function (t, e) {
                return Math.max(t, e.max);
              }, this._pfdata[0].max),
              d = this._pfdata.reduce(function (t, e) {
                return Math.min(t, e.min);
              }, this._pfdata[0].min);
            a = new wjcCore.Rect(
              -0.5,
              d - 0.5 * g,
              this._pfdata.length,
              p - d + g
            );
            for (var f = 1; f < this._pfdata.length; f++) {
              var C = this._pfdata[f - 1],
                m = this._pfdata[f];
              wjcCore.isDate(m.date) &&
                wjcCore.isDate(C.date) &&
                m.date.getYear() != C.date.getYear() &&
                this._xlbls.push({
                  value: f,
                  text: wjcCore.Globalize.formatNumber(
                    m.date.getFullYear() % 100,
                    'd2'
                  ),
                });
            }
          }
        }
      }
      return (
        0 == this._xlbls.length && this._xlbls.push({ value: 0 }),
        (this.chart.axisY.majorGrid = !1),
        (this.chart.axisX.itemsSource = this._xlbls),
        a
      );
    }),
    (e.prototype.plotSeries = function (t, e, a, i, r, n, s) {
      if (this._pfdata && this._pfdata.length > 0) {
        var o = this._actualBoxSize;
        this.renderGrid(t, this._pfdata, o),
          this.renderData(this.chart, t, this._pfdata, o);
      }
    }),
    (e.prototype.calcBoxSize = function (t, e, a) {
      var i = t.reduce(function (t, a) {
          return Math.max(t, a[e]);
        }, t[0][e]),
        r = t.reduce(function (t, e) {
          return Math.min(t, e[a]);
        }, t[0][a]),
        n = this._boxSize,
        s = i - r;
      switch (this._scaling) {
        case PointAndFigureScaling.Traditional:
          s < 0.25
            ? (n = 0.0625)
            : s >= 0.25 && s < 1
            ? (n = 0.125)
            : s >= 1 && s < 5
            ? (n = 0.25)
            : s >= 5 && s < 20
            ? (n = 0.5)
            : s >= 20 && s < 100
            ? (n = 1)
            : s >= 100 && s < 200
            ? (n = 2)
            : s >= 200 && s < 500
            ? (n = 4)
            : s >= 500 && s < 1e3
            ? (n = 5)
            : s >= 1e3 && s < 25e3
            ? (n = 50)
            : s > -25e3 && (n = 500);
          break;
        case PointAndFigureScaling.Dynamic:
          var o = this.chart.series[0],
            l = o._getBindingValues(0),
            h = o._getBindingValues(1),
            c =
              (o._getBindingValues(2),
              _avgTrueRng(l, h, o._getBindingValues(3), this._period));
          n = c[c.length - 1];
          break;
        case PointAndFigureScaling.Fixed:
      }
      return n;
    }),
    (e.prototype.calcPFHiLo2 = function (t, e, a, i, r, n) {
      for (var s = [], o = 0; o < t.length; o++) {
        var l = t[o][e],
          h = t[o][a];
        wjcCore.assert(l >= h, "'High' value must be larger than 'low' value.");
        var c = t[o][i];
        if (0 == s.length)
          s.push({
            min: this.roundDown(h, r),
            max: this.roundDown(l, r),
            rise: !1,
            date: c,
          });
        else {
          var u = s[s.length - 1];
          if (u.rise) {
            var _ = u.max + r,
              g = u.max - n * r;
            this.roundUp(l, r) >= _
              ? (u.max = this.roundUp(l, r))
              : h <= g &&
                s.push({
                  min: this.roundDown(h, r),
                  max: u.max - r,
                  rise: !1,
                  date: c,
                });
          } else {
            var _ = u.min - r,
              g = u.min + n * r;
            this.roundDown(h, r) <= _
              ? (u.min = this.roundDown(h, r))
              : l >= g &&
                s.push({
                  min: u.min + r,
                  max: this.roundUp(l, r),
                  rise: !0,
                  date: c,
                });
          }
        }
      }
      if (s.length > 0) {
        var p = s[0];
        p.min == p.max && s.splice(0, 1);
      }
      return s;
    }),
    (e.prototype.roundUp = function (t, e) {
      return Math.ceil(t / e - 0.999999) * e;
    }),
    (e.prototype.roundDown = function (t, e) {
      return Math.floor(t / e + 0.999999) * e;
    }),
    (e.prototype.renderGrid = function (t, e, a) {
      if (this._pfdata) {
        for (
          var i = this._pfdata.reduce(function (t, e) {
              return Math.max(t, e.max);
            }, this._pfdata[0].max),
            r = this._pfdata.reduce(function (t, e) {
              return Math.min(t, e.min);
            }, this._pfdata[0].min),
            n = this.chart,
            s = this._pfdata.length,
            o = r - 0.5 * a;
          o <= i + a;
          o += a
        ) {
          h = new wjcCore.Point(-0.5, o);
          h = n.dataToPoint(h);
          c = new wjcCore.Point(s, o);
          (c = n.dataToPoint(c)),
            (t.stroke = wjcChart.FlexChart._FG),
            (t.strokeWidth = 1),
            t.drawLine(h.x, h.y, c.x, c.y, wjcChart.FlexChart._CSS_GRIDLINE);
        }
        for (var l = -0.5; l <= s; l += 1) {
          var h = new wjcCore.Point(l, this.chart.axisY.actualMin);
          h = n.dataToPoint(h);
          var c = new wjcCore.Point(l, this.chart.axisY.actualMax);
          (c = n.dataToPoint(c)),
            (t.stroke = wjcChart.FlexChart._FG),
            (t.strokeWidth = 1),
            t.drawLine(h.x, h.y, c.x, c.y, wjcChart.FlexChart._CSS_GRIDLINE);
        }
      }
    }),
    (e.prototype.renderData = function (t, e, a, i) {
      for (
        var r = t.series[0],
          n = r._getSymbolStroke(0),
          s = r._getAltSymbolStroke(0) || n,
          o = 0;
        o < a.length;
        o++
      ) {
        var l = a[o],
          h = (a[o].max - a[o].min) / i;
        if (0 != h) {
          var c = new wjcCore.Point(o - 0.5, l.min);
          c = t.dataToPoint(c);
          var u = new wjcCore.Point(o + 0.5, l.max);
          (u = t.dataToPoint(u)), (e.fill = 'transparent');
          for (var _ = (u.y - c.y) / h, g = 0; g < h + 1; g++)
            if (
              ((e.strokeWidth = 1.5),
              l.rise
                ? ((e.stroke = n),
                  e.drawLine(
                    c.x,
                    c.y + (g - 0.5) * _,
                    u.x,
                    c.y + (g + 0.5) * _
                  ),
                  e.drawLine(
                    u.x,
                    c.y + (g - 0.5) * _,
                    c.x,
                    c.y + (g + 0.5) * _
                  ))
                : ((e.stroke = s),
                  e.drawEllipse(
                    0.5 * (c.x + u.x),
                    c.y + g * _,
                    0.5 * Math.abs(c.x - u.x),
                    0.5 * Math.abs(_)
                  )),
              this.hitTester)
            ) {
              var p = l.min + g * i,
                d = new wjcChart._DataPoint(0, o, l.date, p);
              (d.y = p),
                (d.yfmt = this.chart.axisY._formatValue(p)),
                wjcCore.isDate(l.date) &&
                  ((d.x = l.date),
                  (d.xfmt = wjcCore.Globalize.formatDate(l.date, 'd')));
              var f = new wjcCore.Rect(
                Math.min(c.x, u.x),
                c.y + g * _ - 0.5 * _,
                Math.abs(u.x - c.x),
                _
              );
              f.height < 0 && ((f.top += _), (f.height = -f.height));
              var C = new wjcChart._RectArea(f);
              (C.tag = d), this.hitTester.add(C, 0);
            }
        }
      }
    }),
    e
  );
})(wjcChart._BasePlotter);
exports._PointAndFigurePlotter = _PointAndFigurePlotter;
