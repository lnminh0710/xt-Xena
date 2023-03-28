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
"use strict";
function isValid(t) {
    return isFinite(t) && !isNaN(t) && wjcCore.isNumber(t);
}
function _cci(t, e, i, a, s) {
    wjcCore.asArray(t, !1),
        wjcCore.asArray(e, !1),
        wjcCore.asArray(i, !1),
        wjcCore.asInt(a, !1, !0),
        wjcCore.asNumber(s, !1, !0);
    var r,
        n,
        l = wjcChartFinance._minimum(t.length, e.length, i.length),
        o = [],
        h = [],
        c = [];
    for (
        wjcCore.assert(
            l > a && a > 1,
            "CCI period must be an integer less than the length of the data and greater than one."
        ),
            n = 0;
        n < l;
        n++
    )
        o.push(wjcChartFinance._average(t[n], e[n], i[n]));
    r = wjcChartFinance._sma(o, a);
    var _;
    for (n = 0; n < r.length; n++)
        (_ = o.slice(n, a + n).reduce(function (t, e) {
            return t + Math.abs(r[n] - e);
        }, 0)),
            h.push(_ / a);
    for (o.splice(0, a - 1), n = 0; n < r.length; n++)
        c.push((o[n] - r[n]) / (s * h[n]));
    return c;
}
function _williamsR(t, e, i, a) {
    wjcCore.asArray(t, !1),
        wjcCore.asArray(e, !1),
        wjcCore.asArray(i, !1),
        wjcCore.asInt(a, !1, !0);
    var s,
        r = wjcChartFinance._minimum(t.length, e.length, i.length),
        n = [],
        l = [],
        o = [];
    for (
        wjcCore.assert(
            r > a && a > 1,
            "Williams %R period must be an integer less than the length of the data and greater than one."
        ),
            s = a;
        s <= t.length;
        s++
    )
        n.push(wjcChartFinance._maximum(t.slice(s - a, s))),
            l.push(wjcChartFinance._minimum(e.slice(s - a, s)));
    for (i.splice(0, a - 1), s = 0; s < n.length; s++)
        o.push(((n[s] - i[s]) / (n[s] - l[s])) * -100);
    return o;
}
function _bollingerBands(t, e, i) {
    wjcCore.asArray(t, !1),
        wjcCore.asInt(e, !1, !0),
        wjcCore.asNumber(i, !1, !0),
        wjcCore.assert(
            t.length > e && e > 1,
            "Bollinger Bands period must be an integer less than the length of the data and greater than one."
        );
    var a,
        s = wjcChartFinance._sma(t, e),
        r = [];
    for (a = e; a <= t.length; a++)
        r.push(wjcChartFinance._stdDeviation(t.slice(a - e, a)));
    var n = s,
        l = s.map(function (t, e) {
            return t + r[e] * i;
        });
    return {
        lowers: s.map(function (t, e) {
            return t - r[e] * i;
        }),
        middles: n,
        uppers: l,
    };
}
function _rsi(t, e) {
    wjcCore.asArray(t, !1),
        wjcCore.asInt(e, !0, !1),
        wjcCore.assert(
            t.length > e && e > 1,
            "RSI period must be an integer less than the length of the data and greater than one."
        );
    var i,
        a,
        s,
        r,
        n = [],
        l = [],
        o = [],
        h = [];
    for (r = 1; r < t.length; r++) n.push(t[r] - t[r - 1]);
    for (
        i = n.map(function (t) {
            return t > 0 ? t : 0;
        }),
            a = n.map(function (t) {
                return t < 0 ? Math.abs(t) : 0;
            }),
            r = e;
        r <= n.length;
        r++
    )
        r === e
            ? (l.push(wjcChartFinance._sum(i.slice(r - e, r)) / e),
              o.push(wjcChartFinance._sum(a.slice(r - e, r)) / e))
            : (l.push((i[r - 1] + l[r - e - 1] * (e - 1)) / e),
              o.push((a[r - 1] + o[r - e - 1] * (e - 1)) / e)),
            (s = l[r - e] / o[r - e]),
            (s = isFinite(s) ? s : 0),
            h.push(100 - 100 / (1 + s));
    return h;
}
function _macd(t, e, i, a) {
    wjcCore.asArray(t, !1),
        wjcCore.asInt(e, !1, !0),
        wjcCore.asInt(i, !1, !0),
        wjcCore.asInt(a, !1, !0);
    var s,
        r = e > i;
    r && ((s = i), (i = e), (e = s));
    var n,
        l,
        o = wjcChartFinance._ema(t, e),
        h = wjcChartFinance._ema(t, i),
        c = [],
        _ = [];
    for (o.splice(0, i - e), l = 0; l < o.length; l++)
        (s = o[l] - h[l]), r && (s *= -1), c.push(s);
    n = wjcChartFinance._ema(c, a);
    var u = c.slice(c.length - n.length, c.length);
    for (l = 0; l < u.length; l++) _.push(u[l] - n[l]);
    return { macds: c, signals: n, histograms: _ };
}
function _stochastic(t, e, i, a, s, r) {
    wjcCore.asArray(t, !1),
        wjcCore.asArray(e, !1),
        wjcCore.asArray(i, !1),
        wjcCore.asInt(a, !1, !0),
        wjcCore.asInt(s, !1, !0),
        wjcCore.asInt(r, !0, !0);
    var n,
        l,
        o = [],
        h = [],
        c = [];
    for (l = a; l <= t.length; l++)
        o.push(wjcChartFinance._maximum(t.slice(l - a, l))),
            h.push(wjcChartFinance._minimum(e.slice(l - a, l)));
    for (i = i.slice(a - 1), l = 0; l < i.length; l++)
        c.push(((i[l] - h[l]) / (o[l] - h[l])) * 100);
    return (
        r && r > 1 && (c = wjcChartFinance._sma(c, r)),
        (n = wjcChartFinance._sma(c, s)),
        { ks: c, ds: n }
    );
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
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            };
        return function (e, i) {
            function a() {
                this.constructor = e;
            }
            t(e, i),
                (e.prototype =
                    null === i
                        ? Object.create(i)
                        : ((a.prototype = i.prototype), new a()));
        };
    })();
Object.defineProperty(exports, "__esModule", { value: !0 });
var wjcCore = require("wijmo/wijmo"),
    wjcChart = require("wijmo/wijmo.chart"),
    wjcChartFinance = require("wijmo/wijmo.chart.finance"),
    wjcSelf = require("wijmo/wijmo.chart.finance.analytics");
(window.wijmo = window.wijmo || {}),
    (window.wijmo.chart = window.wijmo.chart || {}),
    (window.wijmo.chart.finance = window.wijmo.chart.finance || {}),
    (window.wijmo.chart.finance.analytics = wjcSelf);
var Fibonacci = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (
            (i._levels = [0, 23.6, 38.2, 50, 61.8, 100]),
            (i._uptrend = !0),
            (i._labelPosition = wjcChart.LabelPosition.Left),
            i.rendering.addHandler(i._render),
            i.initialize(e),
            i
        );
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "low", {
            get: function () {
                return this._low;
            },
            set: function (t) {
                t != this._low &&
                    ((this._low = wjcCore.asNumber(t, !0)), this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "high", {
            get: function () {
                return this._high;
            },
            set: function (t) {
                t != this._high &&
                    ((this._high = wjcCore.asNumber(t, !0)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "labelPosition", {
            get: function () {
                return this._labelPosition;
            },
            set: function (t) {
                t != this._labelPosition &&
                    ((this._labelPosition = wjcCore.asEnum(
                        t,
                        wjcChart.LabelPosition,
                        !0
                    )),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "uptrend", {
            get: function () {
                return this._uptrend;
            },
            set: function (t) {
                t != this._uptrend &&
                    ((this._uptrend = wjcCore.asBoolean(t, !0)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "levels", {
            get: function () {
                return this._levels;
            },
            set: function (t) {
                t != this._levels &&
                    ((this._levels = wjcCore.asArray(t, !0)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "minX", {
            get: function () {
                return this._minX;
            },
            set: function (t) {
                t != this._minX && ((this._minX = t), this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "maxX", {
            get: function () {
                return this._maxX;
            },
            set: function (t) {
                t != this._maxX && ((this._maxX = t), this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype._getMinX = function () {
            return wjcCore.isNumber(this._minX)
                ? this._minX
                : wjcCore.isDate(this._minX)
                ? wjcCore.asDate(this._minX).valueOf()
                : this._getAxisX().actualMin;
        }),
        (e.prototype._getMaxX = function () {
            return wjcCore.isNumber(this._maxX)
                ? this._maxX
                : wjcCore.isDate(this._maxX)
                ? wjcCore.asDate(this._maxX).valueOf()
                : this._getAxisX().actualMax;
        }),
        (e.prototype._updateLevels = function () {
            var e = void 0,
                i = void 0;
            if (void 0 === this._low || void 0 === this._high) {
                var a = t.prototype.getValues.call(this, 0),
                    s = t.prototype.getValues.call(this, 1);
                if (a)
                    for (
                        var r = a.length,
                            n = this._getMinX(),
                            l = this._getMaxX(),
                            o = 0;
                        o < r;
                        o++
                    ) {
                        var h = a[o],
                            c = s ? s[o] : o;
                        c < n ||
                            c > l ||
                            isNaN(h) ||
                            ((void 0 === e || e > h) && (e = h),
                            (void 0 === i || i < h) && (i = h));
                    }
            }
            void 0 === this._low && void 0 !== e
                ? (this._actualLow = e)
                : (this._actualLow = this._low),
                void 0 === this._high && void 0 !== i
                    ? (this._actualHigh = i)
                    : (this._actualHigh = this._high);
        }),
        (e.prototype._render = function (t, e) {
            e.cancel = !0;
            var i = t;
            i._updateLevels();
            var a = i._getAxisX(),
                s = i._getAxisY(),
                r = e.engine,
                n = i._getSymbolStroke(i._chart.series.indexOf(i)),
                l = wjcChart._BasePlotter.cloneStyle(i.style, ["fill"]),
                o = wjcChart._BasePlotter.cloneStyle(i.style, ["stroke"]),
                h = i.chart._plotrectId;
            (r.stroke = n), (r.strokeWidth = 2), (r.textFill = n);
            var c = i._getMinX(),
                _ = i._getMaxX();
            c < a.actualMin && (c = a.actualMin),
                _ > a.actualMax && (_ = a.actualMax),
                r.startGroup(null, h);
            for (var u = i._levels ? i._levels.length : 0, p = 0; p < u; p++) {
                var d = i._levels[p],
                    g = a.convert(c),
                    w = a.convert(_),
                    f = i.uptrend
                        ? s.convert(
                              i._actualLow +
                                  0.01 * d * (i._actualHigh - i._actualLow)
                          )
                        : s.convert(
                              i._actualHigh -
                                  0.01 * d * (i._actualHigh - i._actualLow)
                          );
                if (
                    wjcChart._DataInfo.isValid(g) &&
                    wjcChart._DataInfo.isValid(w) &&
                    wjcChart._DataInfo.isValid(f) &&
                    (r.drawLine(g, f, w, f, null, l),
                    i.labelPosition != wjcChart.LabelPosition.None)
                ) {
                    var y = d.toFixed(1) + "%",
                        m = 0;
                    switch (
                        (((i.uptrend && 0 == p) ||
                            (!i.uptrend && p == u - 1)) &&
                            (m = 2),
                        i.labelPosition)
                    ) {
                        case wjcChart.LabelPosition.Left:
                            wjcChart.FlexChartCore._renderText(
                                r,
                                y,
                                new wjcCore.Point(g, f),
                                0,
                                m,
                                null,
                                null,
                                o
                            );
                            break;
                        case wjcChart.LabelPosition.Center:
                            wjcChart.FlexChartCore._renderText(
                                r,
                                y,
                                new wjcCore.Point(0.5 * (g + w), f),
                                1,
                                m,
                                null,
                                null,
                                o
                            );
                            break;
                        case wjcChart.LabelPosition.Right:
                            wjcChart.FlexChartCore._renderText(
                                r,
                                y,
                                new wjcCore.Point(w, f),
                                2,
                                m,
                                null,
                                null,
                                o
                            );
                    }
                }
            }
            (r.stroke = null),
                (r.strokeWidth = null),
                (r.textFill = null),
                r.endGroup();
        }),
        (e.prototype._getChartType = function () {
            return wjcChart.ChartType.Line;
        }),
        e
    );
})(wjcChart.SeriesBase);
exports.Fibonacci = Fibonacci;
var FibonacciArcs = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (
            (i._levels = [38.2, 50, 61.8]),
            (i._labelPosition = wjcChart.LabelPosition.Top),
            i.rendering.addHandler(i._render, i),
            i.initialize(e),
            i
        );
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "start", {
            get: function () {
                return this._start;
            },
            set: function (t) {
                t !== this.start &&
                    ((this._start = wjcCore.asType(t, wjcChart.DataPoint)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "end", {
            get: function () {
                return this._end;
            },
            set: function (t) {
                t !== this.end &&
                    ((this._end = wjcCore.asType(t, wjcChart.DataPoint)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "levels", {
            get: function () {
                return this._levels;
            },
            set: function (t) {
                t !== this._levels &&
                    ((this._levels = wjcCore.asArray(t, !1)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "labelPosition", {
            get: function () {
                return this._labelPosition;
            },
            set: function (t) {
                t !== this.labelPosition &&
                    ((this._labelPosition = wjcCore.asEnum(
                        t,
                        wjcChart.LabelPosition
                    )),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype._render = function (e, i) {
            i.cancel = !0;
            var a = this._getX(0),
                s = this._getY(0),
                r = this._getX(1),
                n = this._getY(1);
            if (
                !(t.prototype._getLength.call(this) <= 1) &&
                isValid(a) &&
                isValid(s) &&
                isValid(r) &&
                isValid(n)
            ) {
                var l,
                    o = this._getAxisX(),
                    h = this._getAxisY(),
                    c = i.engine,
                    _ = this.chart.series.indexOf(this),
                    u = this._getSymbolStroke(_),
                    p = wjcChart._BasePlotter.cloneStyle(this.style, ["fill"]),
                    d = wjcChart._BasePlotter.cloneStyle(this.style, [
                        "stroke",
                    ]);
                (c.stroke = u), (c.strokeWidth = 2), (c.textFill = u);
                var g,
                    w,
                    f,
                    y,
                    m,
                    C,
                    j,
                    v,
                    V,
                    b = this.chart._plotrectId,
                    x = n - s;
                (l = c.startGroup(null, b)),
                    wjcCore.addClass(l, "fibonacci-arcs"),
                    isValid(a) &&
                        isValid(s) &&
                        isValid(r) &&
                        isValid(n) &&
                        c.drawLines(
                            [o.convert(a), o.convert(r)],
                            [h.convert(s), h.convert(n)],
                            null,
                            p
                        ),
                    (y = Math.sqrt(
                        Math.pow(o.convert(r) - o.convert(a), 2) +
                            Math.pow(h.convert(n) - h.convert(s), 2)
                    )),
                    (C = new wjcCore.Point(r, n));
                for (var P = 0; P < this.levels.length; P++)
                    if (
                        ((j = 0.01 * this.levels[P]),
                        (m = Math.abs(y * j)),
                        isValid(C.x) &&
                            isValid(C.y) &&
                            isValid(m) &&
                            ((g = o.convert(C.x)),
                            (w = h.convert(C.y)),
                            c.drawDonutSegment(
                                g,
                                w,
                                m,
                                m,
                                x > 0 ? 0 : Math.PI,
                                Math.PI,
                                null,
                                p
                            ),
                            this.labelPosition !==
                                wjcChart.LabelPosition.None && 0 !== j))
                    ) {
                        switch (
                            ((V = wjcCore.Globalize.format(j, "p1")),
                            (v = c.measureString(V, null, null, d)),
                            (f = x <= 0 ? w - m : w + m),
                            this.labelPosition)
                        ) {
                            case wjcChart.LabelPosition.Center:
                                f += 0.5 * v.height;
                                break;
                            case wjcChart.LabelPosition.Bottom:
                                f += x <= 0 ? v.height : 0;
                                break;
                            default:
                                f += x <= 0 ? 0 : v.height;
                        }
                        c.drawString(
                            V,
                            new wjcCore.Point(g - 0.5 * v.width, f),
                            null,
                            d
                        );
                    }
                (c.stroke = null),
                    (c.strokeWidth = null),
                    (c.textFill = null),
                    c.endGroup();
            }
        }),
        (e.prototype._getX = function (t) {
            var e = null;
            return (
                0 === t && this.start
                    ? (e = this.start.x)
                    : 1 === t && this.end && (e = this.end.x),
                wjcCore.isDate(e) && (e = wjcCore.asDate(e).valueOf()),
                e
            );
        }),
        (e.prototype._getY = function (t) {
            var e = null;
            return (
                0 === t && this.start
                    ? (e = this.start.y)
                    : 1 === t && this.end && (e = this.end.y),
                e
            );
        }),
        (e.prototype._getChartType = function () {
            return wjcChart.ChartType.Line;
        }),
        e
    );
})(wjcChart.SeriesBase);
exports.FibonacciArcs = FibonacciArcs;
var FibonacciFans = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (
            (i._levels = [0, 23.6, 38.2, 50, 61.8, 100]),
            (i._labelPosition = wjcChart.LabelPosition.Top),
            i.rendering.addHandler(i._render, i),
            i.initialize(e),
            i
        );
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "start", {
            get: function () {
                return this._start;
            },
            set: function (t) {
                t !== this.start &&
                    ((this._start = wjcCore.asType(t, wjcChart.DataPoint)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "end", {
            get: function () {
                return this._end;
            },
            set: function (t) {
                t !== this.end &&
                    ((this._end = wjcCore.asType(t, wjcChart.DataPoint)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "levels", {
            get: function () {
                return this._levels;
            },
            set: function (t) {
                t !== this._levels &&
                    ((this._levels = wjcCore.asArray(t, !1)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "labelPosition", {
            get: function () {
                return this._labelPosition;
            },
            set: function (t) {
                t !== this.labelPosition &&
                    ((this._labelPosition = wjcCore.asEnum(
                        t,
                        wjcChart.LabelPosition
                    )),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype._updateLevels = function () {
            if (!this.start || !this.end) {
                var e,
                    i,
                    a,
                    s,
                    r = this.chart._getPlotter(this),
                    n = this._getAxisX(),
                    l = t.prototype.getValues.call(this, 0),
                    o =
                        t.prototype.getValues.call(this, 1) ||
                        r.dataInfo.getXVals();
                l &&
                    l.length > 0 &&
                    ((a = wjcChartFinance._minimum(l)),
                    (s = wjcChartFinance._maximum(l))),
                    o && o.length > 0
                        ? ((e = wjcChartFinance._minimum(o)),
                          (i = wjcChartFinance._maximum(o)))
                        : ((e = n.actualMin), (i = n.actualMax)),
                    isValid(e) &&
                        isValid(a) &&
                        isValid(i) &&
                        isValid(s) &&
                        ((this.start = new wjcChart.DataPoint(e, a)),
                        (this.end = new wjcChart.DataPoint(i, s)));
            }
        }),
        (e.prototype._render = function (e, i) {
            (i.cancel = !0), this._updateLevels();
            var a = this._getX(0),
                s = this._getY(0),
                r = this._getX(1),
                n = this._getY(1);
            if (
                !(t.prototype._getLength.call(this) <= 1) &&
                isValid(a) &&
                isValid(s) &&
                isValid(r) &&
                isValid(n)
            ) {
                var l = this._getAxisX(),
                    o = this._getAxisY(),
                    h = this.chart.series.indexOf(this),
                    c = i.engine,
                    _ = this._getSymbolStroke(h),
                    u = wjcChart._BasePlotter.cloneStyle(this.style, ["fill"]),
                    p = wjcChart._BasePlotter.cloneStyle(this.style, [
                        "stroke",
                    ]);
                (c.stroke = _), (c.strokeWidth = 2), (c.textFill = _);
                var d,
                    g,
                    w,
                    f,
                    y,
                    m,
                    C,
                    j,
                    v,
                    V,
                    b,
                    x,
                    P,
                    k = n - s,
                    L = r - a,
                    X = this.chart._plotrectId;
                (d = a), (w = s), (f = n);
                var M = (g = r);
                c.startGroup(null, X);
                for (var B = 0; B < this.levels.length; B++)
                    if (
                        ((g = L < 0 ? l.actualMin : l.actualMax),
                        (V = 0.01 * this.levels[B]),
                        (f = w + V * k),
                        (j = (f - w) / (M - d)),
                        (v = f - j * M),
                        (f = j * g + v),
                        k > 0 && f > o.actualMax
                            ? (g = ((f = o.actualMax) - v) / j)
                            : k < 0 &&
                              f < o.actualMin &&
                              (g = ((f = o.actualMin) - v) / j),
                        isValid(d) &&
                            isValid(w) &&
                            isValid(g) &&
                            isValid(f) &&
                            ((y = new wjcCore.Point(
                                l.convert(d),
                                o.convert(w)
                            )),
                            (m = new wjcCore.Point(l.convert(g), o.convert(f))),
                            c.drawLines([y.x, m.x], [y.y, m.y], null, u),
                            this.labelPosition != wjcChart.LabelPosition.None))
                    ) {
                        (b = wjcCore.Globalize.format(V, "p1")),
                            (x = c.measureString(b, null, null, p)),
                            (P =
                                (180 * Math.atan((m.y - y.y) / (m.x - y.x))) /
                                Math.PI),
                            (C = m.clone()),
                            (m.x = L > 0 ? m.x - x.width : m.x);
                        var I,
                            F = (P * Math.PI) / 180,
                            O = new wjcCore.Point(),
                            S = new wjcCore.Point(),
                            A = new wjcCore.Point(),
                            D = new wjcCore.Point(),
                            T = o.convert(o.actualMin),
                            Y = o.convert(o.actualMax),
                            W = l.convert(l.actualMin),
                            R = l.convert(l.actualMax),
                            N = C.clone();
                        switch (this.labelPosition) {
                            case wjcChart.LabelPosition.Center:
                                (m.y += 0.5 * x.height),
                                    (N.y += 0.5 * x.height);
                                break;
                            case wjcChart.LabelPosition.Bottom:
                                m.y += x.height;
                        }
                        L > 0
                            ? (this.labelPosition ===
                                  wjcChart.LabelPosition.Top ||
                              this.labelPosition ===
                                  wjcChart.LabelPosition.Center
                                  ? ((D = N.clone()),
                                    (A.x = D.x + x.height * Math.sin(F)),
                                    (A.y = D.y - x.height * Math.cos(F)),
                                    (O.x =
                                        D.x -
                                        x.width * Math.cos(F) +
                                        x.height * Math.sin(F)),
                                    (O.y =
                                        D.y -
                                        x.width * Math.sin(F) -
                                        x.height * Math.cos(F)),
                                    (S.x = D.x - x.width * Math.cos(F)),
                                    (S.y = D.y - x.width * Math.sin(F)))
                                  : this.labelPosition ===
                                        wjcChart.LabelPosition.Bottom &&
                                    ((A = N.clone()),
                                    (O.x = A.x - x.width * Math.cos(F)),
                                    (O.y = A.y - x.width * Math.sin(F)),
                                    (S.x = O.x - x.height * Math.sin(F)),
                                    (S.y = O.y + x.height * Math.cos(F)),
                                    (D.x =
                                        O.x +
                                        x.width * Math.cos(F) -
                                        x.height * Math.sin(F)),
                                    (D.y =
                                        O.y +
                                        x.width * Math.sin(F) +
                                        x.height * Math.cos(F))),
                              k > 0
                                  ? (A.y < Y &&
                                        ((j =
                                            (o.convertBack(A.y) -
                                                o.convertBack(O.y)) /
                                            (l.convertBack(A.x) -
                                                l.convertBack(O.x))),
                                        (v =
                                            o.convertBack(A.y) -
                                            j * l.convertBack(A.x)),
                                        (I = l.convert((o.actualMax - v) / j)),
                                        (m.x -= Math.abs(A.x - I))),
                                    D.x > R && (m.x -= Math.abs(R - D.x)))
                                  : k < 0 &&
                                    (D.y > T &&
                                        ((j =
                                            (o.convertBack(S.y) -
                                                o.convertBack(D.y)) /
                                            (l.convertBack(S.x) -
                                                l.convertBack(D.x))),
                                        (v =
                                            o.convertBack(D.y) -
                                            j * l.convertBack(D.x)),
                                        (I = l.convert((o.actualMin - v) / j)),
                                        (m.x -= Math.max(
                                            Math.abs(I - D.x),
                                            Math.abs(T - D.y)
                                        ))),
                                    A.x > R && (m.x -= Math.abs(R - A.x))))
                            : L < 0 &&
                              (this.labelPosition ===
                                  wjcChart.LabelPosition.Top ||
                              this.labelPosition ===
                                  wjcChart.LabelPosition.Center
                                  ? ((S = N.clone()),
                                    (O.x = S.x + x.height * Math.sin(F)),
                                    (O.y = S.y - x.height * Math.cos(F)),
                                    (D.x = S.x + x.width * Math.cos(F)),
                                    (D.y = S.y + x.width * Math.sin(F)),
                                    (A.x = O.x + x.width * Math.cos(F)),
                                    (A.y = O.y + x.width * Math.sin(F)))
                                  : this.labelPosition ===
                                        wjcChart.LabelPosition.Bottom &&
                                    ((O = N.clone()),
                                    (A.x = O.x + x.width * Math.cos(F)),
                                    (A.y = O.y + x.width * Math.sin(F)),
                                    (S.x = O.x - x.height * Math.sin(F)),
                                    (S.y = O.y + x.height * Math.cos(F)),
                                    (D.x =
                                        O.x +
                                        x.width * Math.cos(F) -
                                        x.height * Math.sin(F)),
                                    (D.y =
                                        O.y +
                                        x.width * Math.sin(F) +
                                        x.height * Math.cos(F))),
                              k > 0
                                  ? (O.y < Y &&
                                        ((j =
                                            (o.convertBack(O.y) -
                                                o.convertBack(A.y)) /
                                            (l.convertBack(O.x) -
                                                l.convertBack(A.x))),
                                        (v =
                                            o.convertBack(O.y) -
                                            j * l.convertBack(O.x)),
                                        (I = l.convert((o.actualMax - v) / j)),
                                        (m.x += Math.abs(O.x - I))),
                                    S.x < W && (m.x += Math.abs(W - S.x)))
                                  : k < 0 &&
                                    (S.y > T &&
                                        ((j =
                                            (o.convertBack(D.y) -
                                                o.convertBack(S.y)) /
                                            (l.convertBack(D.x) -
                                                l.convertBack(S.x))),
                                        (v =
                                            o.convertBack(S.y) -
                                            j * l.convertBack(S.x)),
                                        (I = l.convert((o.actualMin - v) / j)),
                                        (m.x += Math.max(
                                            Math.abs(I - S.x),
                                            Math.abs(T - S.y)
                                        ))),
                                    O.x < W && (m.x += Math.abs(W - O.x)))),
                            0 === P
                                ? c.drawString(b, m, null, p)
                                : c.drawStringRotated(b, m, C, P, null, p);
                    }
                (c.stroke = null),
                    (c.strokeWidth = null),
                    (c.textFill = null),
                    c.endGroup();
            }
        }),
        (e.prototype._getX = function (t) {
            var e = null;
            return (
                0 === t && this.start
                    ? (e = this.start.x)
                    : 1 === t && this.end && (e = this.end.x),
                wjcCore.isDate(e) && (e = wjcCore.asDate(e).valueOf()),
                e
            );
        }),
        (e.prototype._getY = function (t) {
            var e = null;
            return (
                0 === t && this.start
                    ? (e = this.start.y)
                    : 1 === t && this.end && (e = this.end.y),
                e
            );
        }),
        (e.prototype._getChartType = function () {
            return wjcChart.ChartType.Line;
        }),
        e
    );
})(wjcChart.SeriesBase);
exports.FibonacciFans = FibonacciFans;
var FibonacciTimeZones = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (
            (i._levels = [0, 1, 2, 3, 5, 8, 13, 21, 34]),
            (i._labelPosition = wjcChart.LabelPosition.Right),
            i.rendering.addHandler(i._render, i),
            i.initialize(e),
            i
        );
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "startX", {
            get: function () {
                return this._startX;
            },
            set: function (t) {
                t !== this.startX &&
                    (wjcCore.isDate(t)
                        ? (this._startX = wjcCore.asDate(t))
                        : (this._startX = wjcCore.asNumber(t)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "endX", {
            get: function () {
                return this._endX;
            },
            set: function (t) {
                t !== this.endX &&
                    (wjcCore.isDate(t)
                        ? (this._endX = wjcCore.asDate(t))
                        : (this._endX = wjcCore.asNumber(t)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "levels", {
            get: function () {
                return this._levels;
            },
            set: function (t) {
                t !== this._levels &&
                    ((this._levels = wjcCore.asArray(t, !1)),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "labelPosition", {
            get: function () {
                return this._labelPosition;
            },
            set: function (t) {
                t !== this.labelPosition &&
                    ((this._labelPosition = wjcCore.asEnum(
                        t,
                        wjcChart.LabelPosition
                    )),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype._render = function (e, i) {
            (i.cancel = !0), this._updateLevels();
            var a = this._getX(0),
                s = this._getX(1);
            if (
                !(t.prototype._getLength.call(this) <= 1) &&
                isValid(a) &&
                isValid(s)
            ) {
                var r,
                    n,
                    l,
                    o,
                    h = s - a,
                    c = this._getAxisX(),
                    _ = this._getAxisY(),
                    u = this._chart.series.indexOf(this),
                    p = i.engine,
                    d = this._getSymbolStroke(u),
                    g = wjcChart._BasePlotter.cloneStyle(this.style, ["fill"]),
                    w = wjcChart._BasePlotter.cloneStyle(this.style, [
                        "stroke",
                    ]),
                    f = _.convert(_.actualMin),
                    y = _.convert(_.actualMax),
                    m = this.chart._plotrectId;
                if (
                    ((p.stroke = d),
                    (p.strokeWidth = 2),
                    (p.textFill = d),
                    0 !== h)
                ) {
                    p.startGroup(null, m);
                    for (var C = 0; C < this.levels.length; C++)
                        if (
                            ((r = this.levels[C]),
                            !(
                                (n = h * r + a) < c.actualMin || c.actualMax < n
                            ) &&
                                isValid(n) &&
                                ((n = c.convert(n)),
                                p.drawLine(n, f, n, y, null, g),
                                this.labelPosition !==
                                    wjcChart.LabelPosition.None))
                        ) {
                            switch (
                                ((o = wjcCore.Globalize.format(r, "n0")),
                                (l = p.measureString(o, null, null, w)),
                                this.labelPosition)
                            ) {
                                case wjcChart.LabelPosition.Left:
                                    n -= l.width + 2;
                                    break;
                                case wjcChart.LabelPosition.Center:
                                    n -= l.width / 2;
                                    break;
                                case wjcChart.LabelPosition.Right:
                                    n += 2;
                                    break;
                                default:
                                    n = h < 0 ? n - l.width - 2 : n + 2;
                            }
                            p.drawString(o, new wjcCore.Point(n, f), null, w);
                        }
                    (p.stroke = null),
                        (p.strokeWidth = null),
                        (p.textFill = null),
                        p.endGroup();
                }
            }
        }),
        (e.prototype._updateLevels = function () {
            var e = this.chart._getPlotter(this),
                i =
                    t.prototype.getValues.call(this, 1) ||
                    e.dataInfo.getXVals();
            if (!(t.prototype._getLength.call(this) <= 1)) {
                var a = this._getX(0),
                    s = this._getX(1),
                    r = wjcCore.isNumber(a) && wjcCore.isNumber(s);
                r || i
                    ? !r && i && ((this._startX = i[0]), (this._endX = i[1]))
                    : ((this._startX = 0), (this._endX = 1));
            }
        }),
        (e.prototype._getX = function (t) {
            var e = null;
            return (
                0 === t ? (e = this.startX) : 1 === t && (e = this.endX),
                wjcCore.isDate(e) && (e = wjcCore.asDate(e).valueOf()),
                e
            );
        }),
        (e.prototype._getChartType = function () {
            return wjcChart.ChartType.Line;
        }),
        e
    );
})(wjcChart.SeriesBase);
exports.FibonacciTimeZones = FibonacciTimeZones;
var OverlayIndicatorBase = (function (t) {
    function e(e) {
        var i = t.call(this, e) || this;
        return (i._seriesCount = 1), i;
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "_hitTester", {
            get: function () {
                return (
                    this._plotter &&
                        !this.__hitTester &&
                        (this.__hitTester = this._plotter.hitTester),
                    this.__hitTester
                );
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype._getChartType = function () {
            return wjcChart.ChartType.Line;
        }),
        (e.prototype._getXValues = function () {
            return (
                t.prototype.getValues.call(this, 1) ||
                this._plotter.dataInfo.getXVals()
            );
        }),
        (e.prototype._getDataPoint = function (t, e, i, a, s, r) {
            var n = new wjcChart._DataPoint(i, a, t, e);
            return (
                (n.y = e),
                (n.yfmt = r._formatValue(e)),
                (n.x = t),
                (n.xfmt = s._formatValue(t)),
                n
            );
        }),
        (e.prototype._shouldCalculate = function () {
            return !0;
        }),
        (e.prototype._init = function () {}),
        (e.prototype._calculate = function () {}),
        (e.prototype._clearValues = function () {
            t.prototype._clearValues.call(this), (this.__hitTester = null);
        }),
        (e.prototype._getName = function (t) {
            var e = void 0;
            if (this.name)
                if (this.name.indexOf(",")) {
                    var i = this.name.split(",");
                    i && i.length - 1 >= t && (e = i[t].trim());
                } else e = this.name;
            return e;
        }),
        (e.prototype._getStyles = function (t) {
            var e = null;
            if (t < 0 || null === this._styles) return e;
            var i = 0;
            for (var a in this._styles) {
                if (i === t && this._styles.hasOwnProperty(a)) {
                    e = this._styles[a];
                    break;
                }
                i++;
            }
            return e;
        }),
        (e.prototype.legendItemLength = function () {
            return this._seriesCount;
        }),
        (e.prototype.measureLegendItem = function (t, e) {
            var i = this._getName(e),
                a = new wjcCore.Size(0, 0);
            return i && (a = this._measureLegendItem(t, this._getName(e))), a;
        }),
        (e.prototype.drawLegendItem = function (t, e, i) {
            var a = this._getStyles(i) || this.style;
            this._getName(i) &&
                this._drawLegendItem(
                    t,
                    e,
                    this._getChartType(),
                    this._getName(i),
                    a,
                    this.symbolStyle
                );
        }),
        e
    );
})(wjcChart.SeriesBase);
exports.OverlayIndicatorBase = OverlayIndicatorBase;
var SingleOverlayIndicatorBase = (function (t) {
    function e(e) {
        var i = t.call(this, e) || this;
        return (i._period = 14), i;
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "period", {
            get: function () {
                return this._period;
            },
            set: function (t) {
                t !== this._period &&
                    ((this._period = wjcCore.asInt(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype.getValues = function (e) {
            var i = null;
            return t.prototype._getLength.call(this) <= 0
                ? i
                : (this._shouldCalculate() && (this._init(), this._calculate()),
                  0 === e ? (i = this._yvals) : 1 === e && (i = this._xvals),
                  i);
        }),
        (e.prototype.getDataRect = function (e, i) {
            if (i) return i;
            var a = null;
            if (t.prototype._getLength.call(this) <= 0) return a;
            this._shouldCalculate() && (this._init(), this._calculate());
            var s = wjcChartFinance._minimum(this._xvals),
                r = wjcChartFinance._maximum(this._xvals),
                n = wjcChartFinance._minimum(this._yvals),
                l = wjcChartFinance._maximum(this._yvals);
            return (
                wjcChart._DataInfo.isValid(s) &&
                    wjcChart._DataInfo.isValid(r) &&
                    wjcChart._DataInfo.isValid(n) &&
                    wjcChart._DataInfo.isValid(l) &&
                    (a = new wjcCore.Rect(s, n, r - s, l - n)),
                a
            );
        }),
        (e.prototype._clearValues = function () {
            t.prototype._clearValues.call(this),
                (this._xvals = null),
                (this._yvals = null);
        }),
        (e.prototype._shouldCalculate = function () {
            return !this._yvals || !this._xvals;
        }),
        (e.prototype._init = function () {
            t.prototype._init.call(this),
                (this._yvals = []),
                (this._xvals = []);
        }),
        (e.prototype._getItem = function (e) {
            return t.prototype._getLength.call(this) <= 0
                ? t.prototype._getItem.call(this, e)
                : (this._shouldCalculate() && (this._init(), this._calculate()),
                  (e =
                      t.prototype._getLength.call(this) -
                      wjcChartFinance._minimum(
                          this._yvals.length,
                          this._xvals.length
                      ) +
                      e),
                  t.prototype._getItem.call(this, e));
        }),
        e
    );
})(OverlayIndicatorBase);
exports.SingleOverlayIndicatorBase = SingleOverlayIndicatorBase;
var ATR = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (i.period = 14), i.initialize(e), i;
    }
    return (
        __extends(e, t),
        (e.prototype._calculate = function () {
            if (!(t.prototype._getLength.call(this) <= 0)) {
                var e = t.prototype._getBindingValues.call(this, 0),
                    i = t.prototype._getBindingValues.call(this, 1),
                    a = t.prototype._getBindingValues.call(this, 3),
                    s = this._getXValues();
                (this._yvals = wjcChartFinance._avgTrueRng(
                    e,
                    i,
                    a,
                    this.period
                )),
                    (this._xvals = s
                        ? s.slice(this.period - 1)
                        : wjcChartFinance._range(this.period - 1, e.length));
            }
        }),
        e
    );
})(SingleOverlayIndicatorBase);
exports.ATR = ATR;
var CCI = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (i._constant = 0.015), (i.period = 20), i.initialize(e), i;
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "constant", {
            get: function () {
                return this._constant;
            },
            set: function (t) {
                t !== this._constant &&
                    ((this._constant = wjcCore.asNumber(t, !1)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype._calculate = function () {
            var e = t.prototype._getLength.call(this);
            if (!(e <= 0)) {
                var i = t.prototype._getBindingValues.call(this, 0),
                    a = t.prototype._getBindingValues.call(this, 1),
                    s = t.prototype._getBindingValues.call(this, 3),
                    r = this._getXValues();
                (this._yvals = _cci(i, a, s, this.period, this.constant)),
                    (this._xvals = r
                        ? r.slice(this.period - 1)
                        : wjcChartFinance._range(this.period - 1, e - 1));
            }
        }),
        e
    );
})(SingleOverlayIndicatorBase);
(exports.CCI = CCI), (exports._cci = _cci);
var WilliamsR = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (i.period = 14), i.initialize(e), i;
    }
    return (
        __extends(e, t),
        (e.prototype._calculate = function () {
            var e = t.prototype._getLength.call(this);
            if (!(e <= 0)) {
                var i = t.prototype._getBindingValues.call(this, 0),
                    a = t.prototype._getBindingValues.call(this, 1),
                    s = t.prototype._getBindingValues.call(this, 3),
                    r = this._getXValues();
                (this._yvals = _williamsR(i, a, s, this.period)),
                    (this._xvals = r
                        ? r.slice(this.period - 1)
                        : wjcChartFinance._range(this.period - 1, e - 1));
            }
        }),
        e
    );
})(SingleOverlayIndicatorBase);
(exports.WilliamsR = WilliamsR), (exports._williamsR = _williamsR);
var MovingAverageType;
!(function (t) {
    (t[(t.Simple = 0)] = "Simple"), (t[(t.Exponential = 1)] = "Exponential");
})(
    (MovingAverageType =
        exports.MovingAverageType || (exports.MovingAverageType = {}))
);
var Envelopes = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (
            (i._period = 20),
            (i._type = MovingAverageType.Simple),
            (i._size = 0.025),
            i.rendering.addHandler(i._rendering, i),
            i.initialize(e),
            i
        );
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "period", {
            get: function () {
                return this._period;
            },
            set: function (t) {
                t !== this._period &&
                    ((this._period = wjcCore.asInt(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (t) {
                t !== this._type &&
                    ((this._type = wjcCore.asEnum(t, MovingAverageType, !1)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (t) {
                t !== this._size &&
                    ((this._size = wjcCore.asNumber(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype.getDataRect = function (e, i) {
            if (i) return i;
            var a = null;
            if (t.prototype._getLength.call(this) <= 0) return a;
            this._shouldCalculate() && (this._init(), this._calculate());
            var s = this._upperYVals.concat(this._lowerYVals),
                r = wjcChartFinance._minimum(this._xVals),
                n = wjcChartFinance._maximum(this._xVals),
                l = wjcChartFinance._minimum(s),
                o = wjcChartFinance._maximum(s);
            return (
                wjcChart._DataInfo.isValid(r) &&
                    wjcChart._DataInfo.isValid(n) &&
                    wjcChart._DataInfo.isValid(l) &&
                    wjcChart._DataInfo.isValid(o) &&
                    (a = new wjcCore.Rect(r, l, n - r, o - l)),
                a
            );
        }),
        (e.prototype._clearValues = function () {
            t.prototype._clearValues.call(this),
                (this._upperYVals = null),
                (this._lowerYVals = null),
                (this._xVals = null);
        }),
        (e.prototype._init = function () {
            t.prototype._init.call(this),
                (this._upperYVals = []),
                (this._lowerYVals = []),
                (this._xVals = []);
        }),
        (e.prototype._shouldCalculate = function () {
            return !this._upperYVals || !this._lowerYVals || !this._xVals;
        }),
        (e.prototype._calculate = function () {
            var e = this;
            if (!(t.prototype._getLength.call(this) <= 0)) {
                var i,
                    a = t.prototype.getValues.call(this, 0),
                    s = this._getXValues();
                switch (this.type) {
                    case MovingAverageType.Exponential:
                        i = wjcChartFinance._ema(a, this.period);
                        break;
                    case MovingAverageType.Simple:
                    default:
                        i = wjcChartFinance._sma(a, this.period);
                }
                (this._xVals = s
                    ? s.slice(this.period - 1)
                    : wjcChartFinance._range(
                          this.period - 1,
                          t.prototype._getLength.call(this) - 1
                      )),
                    (this._upperYVals = i.map(function (t) {
                        return t + t * e.size;
                    })),
                    (this._lowerYVals = i.map(function (t) {
                        return t - t * e.size;
                    }));
            }
        }),
        (e.prototype._rendering = function (e, i) {
            if (((i.cancel = !0), !(t.prototype._getLength.call(this) <= 0))) {
                this._shouldCalculate() && (this._init(), this._calculate());
                var a = this.chart.series.indexOf(this),
                    s = i.engine,
                    r = this._getAxisX(),
                    n = this._getAxisY(),
                    l = wjcChartFinance._minimum(
                        this._upperYVals.length,
                        this._lowerYVals.length,
                        this._xVals.length
                    ),
                    o = wjcChart._BasePlotter.cloneStyle(this.style, ["fill"]),
                    h = this._getSymbolStroke(a),
                    c = this.chart._plotrectId;
                if (l && !(l <= 0)) {
                    (s.stroke = h), (s.strokeWidth = 2);
                    for (
                        var _,
                            u,
                            p,
                            d = [],
                            g = [],
                            w = [],
                            f = this._getLength(),
                            y = 0;
                        y < l;
                        y++
                    )
                        (p = f - l + y),
                            d.push(r.convert(this._xVals[y])),
                            g.push(n.convert(this._upperYVals[y])),
                            (_ = this._getDataPoint(
                                this._xVals[y],
                                this._upperYVals[y],
                                a,
                                p,
                                r,
                                n
                            )),
                            ((u = new wjcChart._CircleArea(
                                new wjcCore.Point(d[y], g[y]),
                                0.5 * s.strokeWidth
                            )).tag = _),
                            this._hitTester.add(u, a),
                            w.push(n.convert(this._lowerYVals[y])),
                            (_ = this._getDataPoint(
                                this._xVals[y],
                                this._lowerYVals[y],
                                a,
                                p,
                                r,
                                n
                            )),
                            ((u = new wjcChart._CircleArea(
                                new wjcCore.Point(d[y], w[y]),
                                0.5 * s.strokeWidth
                            )).tag = _),
                            this._hitTester.add(u, a);
                    this._hitTester.add(new wjcChart._LinesArea(d, g), a),
                        this._hitTester.add(new wjcChart._LinesArea(d, w), a),
                        s.drawLines(d, g, null, o, c),
                        s.drawLines(d, w, null, o, c);
                }
            }
        }),
        (e.prototype.getCalculatedValues = function (e) {
            e = wjcCore.asString(e, !1);
            var i = [],
                a = 0;
            if (t.prototype._getLength.call(this) <= 0) return i;
            switch (
                (this._shouldCalculate() && (this._init(), this._calculate()),
                e)
            ) {
                case "upperEnvelope":
                    for (; a < this._upperYVals.length; a++)
                        i.push({ x: this._xVals[a], y: this._upperYVals[a] });
                    break;
                case "lowerEnvelope":
                    for (; a < this._lowerYVals.length; a++)
                        i.push({ x: this._xVals[a], y: this._lowerYVals[a] });
            }
            return i;
        }),
        e
    );
})(OverlayIndicatorBase);
exports.Envelopes = Envelopes;
var BollingerBands = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (
            (i._period = 20),
            (i._multiplier = 2),
            i.rendering.addHandler(i._rendering, i),
            i.initialize(e),
            i
        );
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "period", {
            get: function () {
                return this._period;
            },
            set: function (t) {
                t !== this._period &&
                    ((this._period = wjcCore.asInt(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "multiplier", {
            get: function () {
                return this._multiplier;
            },
            set: function (t) {
                t !== this._multiplier &&
                    ((this._multiplier = wjcCore.asNumber(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype.getDataRect = function (e, i) {
            if (i) return i;
            if (t.prototype._getLength.call(this) <= 0) return null;
            this._shouldCalculate() && (this._init(), this._calculate());
            var a = this._upperYVals.concat(this._lowerYVals),
                s = wjcChartFinance._minimum(this._xVals),
                r = wjcChartFinance._maximum(this._xVals),
                n = wjcChartFinance._minimum(a),
                l = wjcChartFinance._maximum(a);
            return wjcChart._DataInfo.isValid(s) &&
                wjcChart._DataInfo.isValid(r) &&
                wjcChart._DataInfo.isValid(n) &&
                wjcChart._DataInfo.isValid(l)
                ? new wjcCore.Rect(s, n, r - s, l - n)
                : null;
        }),
        (e.prototype._clearValues = function () {
            t.prototype._clearValues.call(this),
                (this._upperYVals = null),
                (this._middleYVals = null),
                (this._lowerYVals = null),
                (this._xVals = null);
        }),
        (e.prototype._shouldCalculate = function () {
            return !(
                this._upperYVals &&
                this._middleYVals &&
                this._lowerYVals &&
                this._xVals
            );
        }),
        (e.prototype._init = function () {
            t.prototype._init.call(this),
                (this._upperYVals = []),
                (this._middleYVals = []),
                (this._lowerYVals = []),
                (this._xVals = []);
        }),
        (e.prototype._calculate = function () {
            var e = t.prototype._getLength.call(this);
            if (!(e <= 0)) {
                var i = t.prototype.getValues.call(this, 0),
                    a = this._getXValues(),
                    s = _bollingerBands(i, this.period, this.multiplier);
                (this._upperYVals = s.uppers),
                    (this._middleYVals = s.middles),
                    (this._lowerYVals = s.lowers),
                    (this._xVals = a
                        ? a.slice(this.period - 1)
                        : wjcChartFinance._range(this.period - 1, e - 1));
            }
        }),
        (e.prototype._rendering = function (e, i) {
            if (((i.cancel = !0), !(t.prototype._getLength.call(this) <= 0))) {
                this._shouldCalculate() && (this._init(), this._calculate());
                var a = this.chart.series.indexOf(this),
                    s = i.engine,
                    r = this._getAxisX(),
                    n = this._getAxisY(),
                    l = wjcChartFinance._minimum(
                        this._upperYVals.length,
                        this._middleYVals.length,
                        this._lowerYVals.length,
                        this._xVals.length
                    ),
                    o = wjcChart._BasePlotter.cloneStyle(this.style, ["fill"]),
                    h = this._getSymbolStroke(a),
                    c = this.chart._plotrectId;
                if (l && !(l <= 0)) {
                    (s.stroke = h), (s.strokeWidth = 2);
                    for (
                        var _,
                            u,
                            p,
                            d = [],
                            g = [],
                            w = [],
                            f = [],
                            y = this._getLength(),
                            m = 0;
                        m < l;
                        m++
                    )
                        (p = y - l + m),
                            d.push(r.convert(this._xVals[m])),
                            g.push(n.convert(this._upperYVals[m])),
                            (_ = this._getDataPoint(
                                this._xVals[m],
                                this._upperYVals[m],
                                a,
                                p,
                                r,
                                n
                            )),
                            ((u = new wjcChart._CircleArea(
                                new wjcCore.Point(d[m], g[m]),
                                0.5 * s.strokeWidth
                            )).tag = _),
                            this._hitTester.add(u, a),
                            w.push(n.convert(this._middleYVals[m])),
                            (_ = this._getDataPoint(
                                this._xVals[m],
                                this._middleYVals[m],
                                a,
                                p,
                                r,
                                n
                            )),
                            ((u = new wjcChart._CircleArea(
                                new wjcCore.Point(d[m], w[m]),
                                0.5 * s.strokeWidth
                            )).tag = _),
                            this._hitTester.add(u, a),
                            f.push(n.convert(this._lowerYVals[m])),
                            (_ = this._getDataPoint(
                                this._xVals[m],
                                this._lowerYVals[m],
                                a,
                                p,
                                r,
                                n
                            )),
                            ((u = new wjcChart._CircleArea(
                                new wjcCore.Point(d[m], f[m]),
                                0.5 * s.strokeWidth
                            )).tag = _),
                            this._hitTester.add(u, a);
                    this._hitTester.add(new wjcChart._LinesArea(d, g), a),
                        this._hitTester.add(new wjcChart._LinesArea(d, w), a),
                        this._hitTester.add(new wjcChart._LinesArea(d, f), a),
                        s.drawLines(d, g, null, o, c),
                        s.drawLines(d, w, null, o, c),
                        s.drawLines(d, f, null, o, c);
                }
            }
        }),
        (e.prototype.getCalculatedValues = function (e) {
            e = wjcCore.asString(e, !1);
            var i = [],
                a = 0;
            if (t.prototype._getLength.call(this) <= 0) return i;
            switch (
                (this._shouldCalculate() && (this._init(), this._calculate()),
                e)
            ) {
                case "upperBand":
                    for (; a < this._upperYVals.length; a++)
                        i.push({ x: this._xVals[a], y: this._upperYVals[a] });
                    break;
                case "middleBand":
                    for (; a < this._middleYVals.length; a++)
                        i.push({ x: this._xVals[a], y: this._middleYVals[a] });
                    break;
                case "lowerBand":
                    for (; a < this._lowerYVals.length; a++)
                        i.push({ x: this._xVals[a], y: this._lowerYVals[a] });
            }
            return i;
        }),
        e
    );
})(OverlayIndicatorBase);
(exports.BollingerBands = BollingerBands),
    (exports._bollingerBands = _bollingerBands);
var RSI = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (i.period = 14), i.initialize(e), i;
    }
    return (
        __extends(e, t),
        (e.prototype._calculate = function () {
            var e = t.prototype._getLength.call(this);
            if (!(e <= 0)) {
                var i = t.prototype._getBindingValues.call(this, 0),
                    a = this._getXValues();
                (this._yvals = _rsi(i, this.period)),
                    (this._xvals = a
                        ? a.slice(this.period)
                        : wjcChartFinance._range(this.period, e));
            }
        }),
        e
    );
})(SingleOverlayIndicatorBase);
(exports.RSI = RSI), (exports._rsi = _rsi);
var MacdBase = (function (t) {
    function e(e) {
        var i = t.call(this, e) || this;
        return (
            (i._fastPeriod = 12),
            (i._slowPeriod = 26),
            (i._smoothingPeriod = 9),
            i
        );
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "fastPeriod", {
            get: function () {
                return this._fastPeriod;
            },
            set: function (t) {
                t !== this._fastPeriod &&
                    ((this._fastPeriod = wjcCore.asInt(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "slowPeriod", {
            get: function () {
                return this._slowPeriod;
            },
            set: function (t) {
                t !== this._slowPeriod &&
                    ((this._slowPeriod = wjcCore.asInt(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "smoothingPeriod", {
            get: function () {
                return this._smoothingPeriod;
            },
            set: function (t) {
                t !== this._smoothingPeriod &&
                    ((this._smoothingPeriod = wjcCore.asInt(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype._clearValues = function () {
            t.prototype._clearValues.call(this),
                (this._macdVals = null),
                (this._macdXVals = null),
                (this._signalVals = null),
                (this._signalXVals = null),
                (this._histogramVals = null),
                (this._histogramXVals = null);
        }),
        (e.prototype._shouldCalculate = function () {
            return !(
                this._macdVals &&
                this._macdXVals &&
                this._signalVals &&
                this._signalXVals &&
                this._histogramVals &&
                this._histogramXVals
            );
        }),
        (e.prototype._init = function () {
            t.prototype._init.call(this),
                (this._macdVals = []),
                (this._macdXVals = []),
                (this._signalVals = []),
                (this._signalXVals = []),
                (this._histogramVals = []),
                (this._histogramXVals = []);
        }),
        (e.prototype._calculate = function () {
            var e = t.prototype._getLength.call(this);
            if (!(e <= 0)) {
                var i = t.prototype.getValues.call(this, 0),
                    a = this._getXValues(),
                    s = _macd(
                        i,
                        this.fastPeriod,
                        this.slowPeriod,
                        this.smoothingPeriod
                    );
                (this._macdVals = s.macds),
                    (this._signalVals = s.signals),
                    (this._histogramVals = s.histograms),
                    (this._macdXVals = a
                        ? a.slice(e - this._macdVals.length, e)
                        : wjcChartFinance._range(
                              e - this._macdVals.length,
                              e - 1
                          )),
                    (this._signalXVals = a
                        ? a.slice(e - this._signalVals.length, e)
                        : wjcChartFinance._range(
                              e - this._signalVals.length,
                              e - 1
                          )),
                    (this._histogramXVals = a
                        ? a.slice(e - this._histogramVals.length, e)
                        : wjcChartFinance._range(
                              e - this._histogramVals.length,
                              e - 1
                          ));
            }
        }),
        e
    );
})(OverlayIndicatorBase);
exports.MacdBase = MacdBase;
var Macd = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (
            (i._seriesCount = 2),
            i.rendering.addHandler(i._rendering, i),
            i.initialize(e),
            i
        );
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "styles", {
            get: function () {
                return this._styles;
            },
            set: function (t) {
                t !== this._styles && ((this._styles = t), this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype.getDataRect = function (e, i) {
            if (i) return i;
            var a = null;
            if (t.prototype._getLength.call(this) <= 0) return a;
            this._shouldCalculate() && (this._init(), this._calculate());
            var s = [],
                r = [];
            r.push.apply(r, this._macdXVals),
                r.push.apply(r, this._signalXVals),
                s.push.apply(s, this._macdVals),
                s.push.apply(s, this._signalVals);
            var n = wjcChartFinance._minimum(r),
                l = wjcChartFinance._maximum(r),
                o = wjcChartFinance._minimum(s),
                h = wjcChartFinance._maximum(s);
            return (
                wjcChart._DataInfo.isValid(n) &&
                    wjcChart._DataInfo.isValid(l) &&
                    wjcChart._DataInfo.isValid(o) &&
                    wjcChart._DataInfo.isValid(h) &&
                    (a = new wjcCore.Rect(n, o, l - n, h - o)),
                a
            );
        }),
        (e.prototype._rendering = function (e, i) {
            if (((i.cancel = !0), !(t.prototype._getLength.call(this) <= 0))) {
                this._shouldCalculate() && (this._init(), this._calculate());
                var a = this.chart.series.indexOf(this),
                    s = i.engine,
                    r = this._getAxisX(),
                    n = this._getAxisY(),
                    l = wjcChart._BasePlotter.cloneStyle(this.style, ["fill"]),
                    o = this._getSymbolStroke(a),
                    h = this.chart._plotrectId,
                    c = null,
                    _ = o,
                    u = 2,
                    p = null,
                    d = o,
                    g = 2;
                this.styles &&
                    wjcCore.isObject(this.styles) &&
                    (this.styles.macdLine &&
                        wjcCore.isObject(this.styles.macdLine) &&
                        ((_ = (c = wjcChart._BasePlotter.cloneStyle(
                            this.styles.macdLine,
                            ["fill"]
                        )).stroke
                            ? c.stroke
                            : o),
                        (u = c.strokeWidth ? c.strokeWidth : 2)),
                    this.styles.signalLine &&
                        wjcCore.isObject(this.styles.signalLine) &&
                        ((d = (p = wjcChart._BasePlotter.cloneStyle(
                            this.styles.signalLine,
                            ["fill"]
                        )).stroke
                            ? p.stroke
                            : o),
                        (g = p.strokeWidth ? p.strokeWidth : 2)));
                var w,
                    f,
                    y,
                    m,
                    C = [],
                    j = [],
                    v = [],
                    V = [],
                    b = this._getLength();
                for (y = 0; y < this._macdVals.length; y++)
                    (m = b - this._macdVals.length + y),
                        j.push(r.convert(this._macdXVals[y])),
                        C.push(n.convert(this._macdVals[y])),
                        ((w = this._getDataPoint(
                            this._macdXVals[y],
                            this._macdVals[y],
                            a,
                            m,
                            r,
                            n
                        )).name = this._getName(0)),
                        ((f = new wjcChart._CircleArea(
                            new wjcCore.Point(j[y], C[y]),
                            0.5 * s.strokeWidth
                        )).tag = w),
                        this._hitTester.add(f, a);
                for (
                    this._hitTester.add(new wjcChart._LinesArea(j, C), a),
                        s.stroke = _,
                        s.strokeWidth = u,
                        s.drawLines(j, C, null, l, h),
                        y = 0;
                    y < this._signalVals.length;
                    y++
                )
                    (m = b - this._signalVals.length + y),
                        V.push(r.convert(this._signalXVals[y])),
                        v.push(n.convert(this._signalVals[y])),
                        ((w = this._getDataPoint(
                            this._signalXVals[y],
                            this._signalVals[y],
                            a,
                            m,
                            r,
                            n
                        )).name = this._getName(1)),
                        ((f = new wjcChart._CircleArea(
                            new wjcCore.Point(V[y], v[y]),
                            0.5 * s.strokeWidth
                        )).tag = w),
                        this._hitTester.add(f, a);
                this._hitTester.add(new wjcChart._LinesArea(V, v), a),
                    (s.stroke = d),
                    (s.strokeWidth = g),
                    s.drawLines(V, v, null, l, h);
            }
        }),
        (e.prototype.getCalculatedValues = function (e) {
            e = wjcCore.asString(e, !1);
            var i = [],
                a = 0;
            if (t.prototype._getLength.call(this) <= 0) return i;
            switch (
                (this._shouldCalculate() && (this._init(), this._calculate()),
                e)
            ) {
                case "macdLine":
                    for (; a < this._macdVals.length; a++)
                        i.push({ x: this._macdXVals[a], y: this._macdVals[a] });
                    break;
                case "signalLine":
                    for (; a < this._signalVals.length; a++)
                        i.push({
                            x: this._signalXVals[a],
                            y: this._signalVals[a],
                        });
            }
            return i;
        }),
        e
    );
})(MacdBase);
exports.Macd = Macd;
var MacdHistogram = (function (t) {
    function e(e) {
        return t.call(this, e) || this;
    }
    return (
        __extends(e, t),
        (e.prototype.getValues = function (e) {
            var i = null;
            return t.prototype._getLength.call(this) <= 0
                ? i
                : (this._shouldCalculate() && (this._init(), this._calculate()),
                  0 === e
                      ? (i = this._histogramVals)
                      : 1 === e && (i = this._histogramXVals),
                  i);
        }),
        (e.prototype.getDataRect = function (e, i) {
            if (i) return i;
            var a = null;
            if (t.prototype._getLength.call(this) <= 0) return a;
            this._shouldCalculate() && (this._init(), this._calculate());
            var s = wjcChartFinance._minimum(this._histogramXVals),
                r = wjcChartFinance._maximum(this._histogramXVals),
                n = wjcChartFinance._minimum(this._histogramVals),
                l = wjcChartFinance._maximum(this._histogramVals);
            return (
                wjcChart._DataInfo.isValid(s) &&
                    wjcChart._DataInfo.isValid(r) &&
                    wjcChart._DataInfo.isValid(n) &&
                    wjcChart._DataInfo.isValid(l) &&
                    (a = new wjcCore.Rect(s, n, r - s, l - n)),
                a
            );
        }),
        (e.prototype._getChartType = function () {
            return wjcChart.ChartType.Column;
        }),
        (e.prototype._getItem = function (e) {
            return (
                (e =
                    t.prototype._getLength.call(this) -
                    wjcChartFinance._minimum(
                        this._histogramVals.length,
                        this._histogramXVals.length
                    ) +
                    e),
                t.prototype._getItem.call(this, e)
            );
        }),
        e
    );
})(MacdBase);
(exports.MacdHistogram = MacdHistogram), (exports._macd = _macd);
var Stochastic = (function (t) {
    function e(e) {
        var i = t.call(this) || this;
        return (
            (i._kPeriod = 14),
            (i._dPeriod = 3),
            (i._smoothingPeriod = 1),
            (i._seriesCount = 2),
            i.rendering.addHandler(i._rendering, i),
            i.initialize(e),
            i
        );
    }
    return (
        __extends(e, t),
        Object.defineProperty(e.prototype, "kPeriod", {
            get: function () {
                return this._kPeriod;
            },
            set: function (t) {
                t !== this._kPeriod &&
                    ((this._kPeriod = wjcCore.asInt(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "dPeriod", {
            get: function () {
                return this._dPeriod;
            },
            set: function (t) {
                t !== this._dPeriod &&
                    ((this._dPeriod = wjcCore.asInt(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "smoothingPeriod", {
            get: function () {
                return this._smoothingPeriod;
            },
            set: function (t) {
                t !== this._smoothingPeriod &&
                    ((this._smoothingPeriod = wjcCore.asInt(t, !1, !0)),
                    this._clearValues(),
                    this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(e.prototype, "styles", {
            get: function () {
                return this._styles;
            },
            set: function (t) {
                t !== this._styles && ((this._styles = t), this._invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (e.prototype.getDataRect = function (e, i) {
            if (i) return i;
            var a = null;
            if (t.prototype._getLength.call(this) <= 0) return a;
            this._shouldCalculate() && (this._init(), this._calculate());
            var s = this._kVals.concat(this._dVals),
                r = this._kXVals.concat(this._dXVals),
                n = wjcChartFinance._minimum(r),
                l = wjcChartFinance._maximum(r),
                o = wjcChartFinance._minimum(s),
                h = wjcChartFinance._maximum(s);
            return (
                wjcChart._DataInfo.isValid(n) &&
                    wjcChart._DataInfo.isValid(l) &&
                    wjcChart._DataInfo.isValid(o) &&
                    wjcChart._DataInfo.isValid(h) &&
                    (a = new wjcCore.Rect(n, o, l - n, h - o)),
                a
            );
        }),
        (e.prototype._clearValues = function () {
            t.prototype._clearValues.call(this),
                (this._kVals = null),
                (this._kXVals = null),
                (this._dVals = null),
                (this._dXVals = null);
        }),
        (e.prototype._shouldCalculate = function () {
            return !(
                this._kVals &&
                this._kXVals &&
                this._dVals &&
                this._dXVals
            );
        }),
        (e.prototype._init = function () {
            t.prototype._init.call(this),
                (this._kVals = []),
                (this._kXVals = []),
                (this._dVals = []),
                (this._dXVals = []);
        }),
        (e.prototype._calculate = function () {
            var e = t.prototype._getLength.call(this);
            if (!(t.prototype._getLength.call(this) <= 0)) {
                var i = t.prototype._getBindingValues.call(this, 0),
                    a = t.prototype._getBindingValues.call(this, 1),
                    s = t.prototype._getBindingValues.call(this, 3),
                    r = this._getXValues(),
                    n = _stochastic(
                        i,
                        a,
                        s,
                        this.kPeriod,
                        this.dPeriod,
                        this.smoothingPeriod
                    );
                (this._kVals = n.ks),
                    (this._dVals = n.ds),
                    (this._kXVals = r
                        ? r.slice(this.kPeriod - 1)
                        : wjcChartFinance._range(this.kPeriod - 1, e - 1)),
                    this.smoothingPeriod &&
                        this.smoothingPeriod > 1 &&
                        (this._kXVals = this._kXVals.slice(
                            this._kXVals.length - this._kVals.length,
                            this._kXVals.length
                        )),
                    (this._dXVals = this._kXVals.slice(
                        this._kXVals.length - this._dVals.length,
                        this._kXVals.length
                    ));
            }
        }),
        (e.prototype._rendering = function (e, i) {
            if (((i.cancel = !0), !(t.prototype._getLength.call(this) <= 0))) {
                this._shouldCalculate() && (this._init(), this._calculate());
                var a = this.chart.series.indexOf(this),
                    s = i.engine,
                    r = this._getAxisX(),
                    n = this._getAxisY(),
                    l = wjcChart._BasePlotter.cloneStyle(this.style, ["fill"]),
                    o = this._getSymbolStroke(a),
                    h = this.chart._plotrectId,
                    c = null,
                    _ = o,
                    u = 2,
                    p = null,
                    d = o,
                    g = 2;
                this.styles &&
                    wjcCore.isObject(this.styles) &&
                    (this.styles.kLine &&
                        wjcCore.isObject(this.styles.kLine) &&
                        ((_ = (c = wjcChart._BasePlotter.cloneStyle(
                            this.styles.kLine,
                            ["fill"]
                        )).stroke
                            ? c.stroke
                            : o),
                        (u = c.strokeWidth ? c.strokeWidth : 2)),
                    this.styles.dLine &&
                        wjcCore.isObject(this.styles.dLine) &&
                        ((d = (p = wjcChart._BasePlotter.cloneStyle(
                            this.styles.dLine,
                            ["fill"]
                        )).stroke
                            ? p.stroke
                            : o),
                        (g = p.strokeWidth ? p.strokeWidth : 2)));
                var w,
                    f,
                    y,
                    m,
                    C = [],
                    j = [],
                    v = [],
                    V = [],
                    b = this._getLength();
                for (y = 0; y < this._kVals.length; y++)
                    (m = b - this._kVals.length + y),
                        j.push(r.convert(this._kXVals[y])),
                        C.push(n.convert(this._kVals[y])),
                        ((w = this._getDataPoint(
                            this._kXVals[y],
                            this._kVals[y],
                            a,
                            m,
                            r,
                            n
                        )).name = this._getName(0)),
                        ((f = new wjcChart._CircleArea(
                            new wjcCore.Point(j[y], C[y]),
                            0.5 * s.strokeWidth
                        )).tag = w),
                        this._hitTester.add(f, a);
                for (
                    this._hitTester.add(new wjcChart._LinesArea(j, C), a),
                        s.stroke = _,
                        s.strokeWidth = u,
                        s.drawLines(j, C, null, l, h),
                        y = 0;
                    y < this._dVals.length;
                    y++
                )
                    (m = b - this._dVals.length + y),
                        V.push(r.convert(this._dXVals[y])),
                        v.push(n.convert(this._dVals[y])),
                        ((w = this._getDataPoint(
                            this._dXVals[y],
                            this._dVals[y],
                            a,
                            m,
                            r,
                            n
                        )).name = this._getName(1)),
                        ((f = new wjcChart._CircleArea(
                            new wjcCore.Point(V[y], v[y]),
                            0.5 * s.strokeWidth
                        )).tag = w),
                        this._hitTester.add(f, a);
                this._hitTester.add(new wjcChart._LinesArea(V, v), a),
                    (s.stroke = d),
                    (s.strokeWidth = g),
                    s.drawLines(V, v, null, l, h);
            }
        }),
        (e.prototype.getCalculatedValues = function (e) {
            e = wjcCore.asString(e, !1);
            var i = [],
                a = 0;
            if (t.prototype._getLength.call(this) <= 0) return i;
            switch (
                (this._shouldCalculate() && (this._init(), this._calculate()),
                e)
            ) {
                case "kLine":
                    for (; a < this._kVals.length; a++)
                        i.push({ x: this._kXVals[a], y: this._kVals[a] });
                    break;
                case "dLine":
                    for (; a < this._dVals.length; a++)
                        i.push({ x: this._dXVals[a], y: this._dVals[a] });
            }
            return i;
        }),
        e
    );
})(OverlayIndicatorBase);
(exports.Stochastic = Stochastic), (exports._stochastic = _stochastic);
