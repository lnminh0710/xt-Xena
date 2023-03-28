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
function tryGetModuleWijmoChartRadar() {
    var t, e;
    return (t = window.wijmo) && (e = t.chart) && e.radar;
}
function tryGetModuleWijmoChartFinance() {
    var t, e;
    return (t = window.wijmo) && (e = t.chart) && e.finance;
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
                for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            };
        return function (e, n) {
            function i() {
                this.constructor = e;
            }
            t(e, n),
                (e.prototype =
                    null === n
                        ? Object.create(n)
                        : ((i.prototype = n.prototype), new i()));
        };
    })();
Object.defineProperty(exports, "__esModule", { value: !0 });
var wjcChart = require("wijmo/wijmo.chart"),
    wjcCore = require("wijmo/wijmo"),
    wjcSelf = require("wijmo/wijmo.chart.animation");
(window.wijmo = window.wijmo || {}),
    (window.wijmo.chart = window.wijmo.chart || {}),
    (window.wijmo.chart.animation = wjcSelf);
var Easing;
!(function (t) {
    (t[(t.Linear = 0)] = "Linear"),
        (t[(t.Swing = 1)] = "Swing"),
        (t[(t.EaseInQuad = 2)] = "EaseInQuad"),
        (t[(t.EaseOutQuad = 3)] = "EaseOutQuad"),
        (t[(t.EaseInOutQuad = 4)] = "EaseInOutQuad"),
        (t[(t.EaseInCubic = 5)] = "EaseInCubic"),
        (t[(t.EaseOutCubic = 6)] = "EaseOutCubic"),
        (t[(t.EaseInOutCubic = 7)] = "EaseInOutCubic"),
        (t[(t.EaseInQuart = 8)] = "EaseInQuart"),
        (t[(t.EaseOutQuart = 9)] = "EaseOutQuart"),
        (t[(t.EaseInOutQuart = 10)] = "EaseInOutQuart"),
        (t[(t.EaseInQuint = 11)] = "EaseInQuint"),
        (t[(t.EaseOutQuint = 12)] = "EaseOutQuint"),
        (t[(t.EaseInOutQuint = 13)] = "EaseInOutQuint"),
        (t[(t.EaseInSine = 14)] = "EaseInSine"),
        (t[(t.EaseOutSine = 15)] = "EaseOutSine"),
        (t[(t.EaseInOutSine = 16)] = "EaseInOutSine"),
        (t[(t.EaseInExpo = 17)] = "EaseInExpo"),
        (t[(t.EaseOutExpo = 18)] = "EaseOutExpo"),
        (t[(t.EaseInOutExpo = 19)] = "EaseInOutExpo"),
        (t[(t.EaseInCirc = 20)] = "EaseInCirc"),
        (t[(t.EaseOutCirc = 21)] = "EaseOutCirc"),
        (t[(t.EaseInOutCirc = 22)] = "EaseInOutCirc"),
        (t[(t.EaseInBack = 23)] = "EaseInBack"),
        (t[(t.EaseOutBack = 24)] = "EaseOutBack"),
        (t[(t.EaseInOutBack = 25)] = "EaseInOutBack"),
        (t[(t.EaseInBounce = 26)] = "EaseInBounce"),
        (t[(t.EaseOutBounce = 27)] = "EaseOutBounce"),
        (t[(t.EaseInOutBounce = 28)] = "EaseInOutBounce"),
        (t[(t.EaseInElastic = 29)] = "EaseInElastic"),
        (t[(t.EaseOutElastic = 30)] = "EaseOutElastic"),
        (t[(t.EaseInOutElastic = 31)] = "EaseInOutElastic");
})((Easing = exports.Easing || (exports.Easing = {})));
var AnimationMode;
!(function (t) {
    (t[(t.All = 0)] = "All"),
        (t[(t.Point = 1)] = "Point"),
        (t[(t.Series = 2)] = "Series");
})((AnimationMode = exports.AnimationMode || (exports.AnimationMode = {})));
var ChartAnimation = (function () {
    function t(t, e) {
        this._play = !0;
        var n = this,
            i = t.hostElement,
            a = new wjcCore.Size(i.offsetWidth, i.offsetHeight);
        (n._chart = t),
            (n._updateEventArgs = []),
            t instanceof wjcChart.FlexPie
                ? (n._animation = new FlexPieAnimation(t, n._updateEventArgs))
                : (tryGetModuleWijmoChartRadar() &&
                  tryGetModuleWijmoChartRadar().FlexRadar &&
                  t instanceof tryGetModuleWijmoChartRadar().FlexRadar
                      ? (n._animation = new FlexRadarAnimation(
                            t,
                            n._updateEventArgs
                        ))
                      : (n._animation = new FlexChartAnimation(
                            t,
                            n._updateEventArgs
                        )),
                  (n._chartType = t.chartType)),
            e && n._initOptions(e),
            t.beginUpdate(),
            window.setTimeout(function () {
                t.rendered.addHandler(n._playAnimation, n), t.endUpdate();
            }, 0),
            n._setCV(t.collectionView),
            window.addEventListener("resize", function (t) {
                var e = new wjcCore.Size(i.offsetWidth, i.offsetHeight);
                a.equals(e) || ((n._play = !1), (a = e));
            });
    }
    return (
        (t.prototype._initOptions = function (t) {
            t.duration && (this.duration = t.duration),
                t.easing && (this.easing = t.easing),
                t.animationMode && (this.animationMode = t.animationMode);
        }),
        (t.prototype._setCV = function (t) {
            (this._cv = t), this._animation._clearState();
        }),
        Object.defineProperty(t.prototype, "animationMode", {
            get: function () {
                return this._animation.animationMode;
            },
            set: function (t) {
                t !== this._animation.animationMode &&
                    (this._animation.animationMode = t);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "easing", {
            get: function () {
                return this._animation.easing;
            },
            set: function (t) {
                t !== this._animation.easing && (this._animation.easing = t);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "duration", {
            get: function () {
                return this._animation.duration;
            },
            set: function (t) {
                t !== this._animation.duration &&
                    (this._animation.duration = t);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "axisAnimation", {
            get: function () {
                return this._animation.axisAnimation;
            },
            set: function (t) {
                t !== this._animation.axisAnimation &&
                    (this._animation.axisAnimation = t);
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype._playAnimation = function () {
            var t = this,
                e = t._chart,
                n = e.chartType;
            t._cv !== e.collectionView && t._setCV(e.collectionView),
                null != t._chartType &&
                    t._chartType !== n &&
                    ((t._chartType = n), t._animation._clearState()),
                t._play ? t._animation.playAnimation() : (t._play = !0);
        }),
        (t.prototype.animate = function () {
            var t = this._chart;
            if (t) {
                var e = t.itemsSource;
                t.beginUpdate(),
                    (t.itemsSource = null),
                    (t.itemsSource = e),
                    t.endUpdate();
            }
        }),
        t
    );
})();
exports.ChartAnimation = ChartAnimation;
var FlexAnimation = (function () {
        function t(t, e) {
            (this._axisAnimation = !0), (this._chart = t), (this._timers = []);
        }
        return (
            Object.defineProperty(t.prototype, "animationMode", {
                get: function () {
                    return this._animationMode || AnimationMode.All;
                },
                set: function (t) {
                    t !== this._animationMode &&
                        (this._clearState(),
                        (this._animationMode = wjcCore.asEnum(
                            t,
                            AnimationMode,
                            !1
                        )));
                },
                enumerable: !0,
                configurable: !0,
            }),
            Object.defineProperty(t.prototype, "easing", {
                get: function () {
                    return null == this._easing ? Easing.Swing : this._easing;
                },
                set: function (t) {
                    t !== this._easing &&
                        (this._easing = wjcCore.asEnum(t, Easing, !1));
                },
                enumerable: !0,
                configurable: !0,
            }),
            Object.defineProperty(t.prototype, "duration", {
                get: function () {
                    return this._duration || 400;
                },
                set: function (t) {
                    t !== this._duration &&
                        (this._duration = wjcCore.asNumber(t, !1, !0));
                },
                enumerable: !0,
                configurable: !0,
            }),
            Object.defineProperty(t.prototype, "axisAnimation", {
                get: function () {
                    return !!this._axisAnimation;
                },
                set: function (t) {
                    t !== this._axisAnimation &&
                        (this._axisAnimation = wjcCore.asBoolean(t, !1));
                },
                enumerable: !0,
                configurable: !0,
            }),
            (t.prototype.playAnimation = function () {}),
            (t.prototype._clearState = function () {
                this._previousState && (this._previousState = null),
                    this._currentState && (this._currentState = null);
            }),
            (t.prototype._setInitState = function (t, e, n) {
                var i = AnimationHelper.parseAttrs(e, n);
                AnimationHelper.setElementAttr(t, i, 0);
            }),
            (t.prototype._getAnimation = function (t, e) {
                return t[e] || (t[e] = []), t[e];
            }),
            (t.prototype._toggleVisibility = function (t, e) {
                e
                    ? AnimationHelper.playAnimation(
                          t,
                          { opacity: 0 },
                          { opacity: 1 },
                          null,
                          Easing.Swing,
                          100
                      )
                    : t.setAttribute("opacity", "0");
            }),
            (t.prototype._toggleDataLabelVisibility = function (t) {
                var e = this._chart.hostElement,
                    n = e && e.querySelector(".wj-data-labels");
                n && this._toggleVisibility(n, t);
            }),
            (t.prototype._playAnimation = function (t) {
                var e,
                    n = this,
                    i = this,
                    a = i.duration,
                    o = i.easing,
                    r = t.length;
                i._toggleDataLabelVisibility(!1),
                    (e = i._getDurationAndDelay(t.length, a)),
                    this._timers &&
                        this._timers.length &&
                        (this._timers.forEach(function (t) {
                            return window.clearInterval(t);
                        }),
                        (this._timers.length = 0)),
                    t.forEach(function (t, a) {
                        var s;
                        t &&
                            ((s = window.setTimeout(function () {
                                var s;
                                t.forEach(function (t, c) {
                                    if (t && t.ele) {
                                        if (a === r - 1 && 0 === c) {
                                            var l = t.done;
                                            t.done = function () {
                                                i._toggleDataLabelVisibility(
                                                    !0
                                                ),
                                                    l && l();
                                            };
                                        }
                                        wjcCore.isArray(t.ele)
                                            ? ((s =
                                                  AnimationHelper.playAnimations(
                                                      t.ele,
                                                      t.from,
                                                      t.to,
                                                      t.done,
                                                      o,
                                                      e.duration
                                                  )),
                                              (n._timers =
                                                  n._timers.concat.apply(s)))
                                            : ((s =
                                                  AnimationHelper.playAnimation(
                                                      t.ele,
                                                      t.from,
                                                      t.to,
                                                      t.done,
                                                      o,
                                                      e.duration
                                                  )),
                                              n._timers.push(s));
                                    }
                                });
                            }, e.delay * a)),
                            n._timers.push(s));
                    });
            }),
            (t.prototype._getDurationAndDelay = function (t, e) {
                var n = { duration: e, delay: 0 };
                return (
                    t > 1 &&
                        (this._previousState
                            ? ((n.duration = e / t), (n.delay = e / t))
                            : ((n.duration = 0.5 * e),
                              (n.delay = (0.5 * e) / (t - 1)))),
                    n
                );
            }),
            t
        );
    })(),
    FlexPieAnimation = (function (t) {
        function e(e, n) {
            var i = t.call(this, e, n) || this;
            return e.selectionChanged.addHandler(i._selectionChanged, i), i;
        }
        return (
            __extends(e, t),
            (e.prototype._selectionChanged = function () {
                this._isSelectionChanged = !0;
            }),
            (e.prototype._clearState = function () {
                t.prototype._clearState.call(this),
                    (this._isSelectionChanged = !1);
            }),
            (e.prototype._getElementRotate = function (t) {
                var e,
                    n = t.getAttribute("transform");
                return (n =
                    n && n.indexOf("rotate") > -1
                        ? (n = n
                              .replace("rotate(", "")
                              .replace(")", "")).indexOf(",") > -1
                            ? n.split(",").map(function (t) {
                                  return +t;
                              })
                            : n.split(" ").map(function (t) {
                                  return +t;
                              })
                        : [0, (e = this._chart._areas[0].center).x, e.y]);
            }),
            (e.prototype._getDurationAndDelay = function (t, e) {
                var n = { duration: e, delay: 0 };
                return (
                    this.animationMode === AnimationMode.Point &&
                        t > 1 &&
                        ((n.duration = e / t), (n.delay = e / t)),
                    n
                );
            }),
            (e.prototype.playAnimation = function () {
                t.prototype.playAnimation.call(this);
                var e = this,
                    n = [];
                e._playPieAnimation(n), n.length && e._playAnimation(n);
            }),
            (e.prototype._playPieAnimation = function (t) {
                var e = this,
                    n = e._chart,
                    i = !0;
                if (
                    ((e._previousState = e._currentState),
                    (e._currentState = {
                        areas: n._areas,
                        pels: n._pels,
                        rotate:
                            n._pels.length &&
                            e._getElementRotate(n._pels[0].parentNode),
                    }),
                    e._previousState && (i = !1),
                    e._isSelectionChanged)
                )
                    return (
                        n.isAnimated || e._playSelectPieAnimation(t),
                        void (e._isSelectionChanged = !1)
                    );
                i ? e._playLoadPieAnimation(t) : e._playUpdatePieAnimation(t);
            }),
            (e.prototype._playSelectPieAnimation = function (t) {
                if (null != this._previousState) {
                    var e,
                        n,
                        i,
                        a = this,
                        o = a._chart._pels[0].parentNode,
                        r = a._previousState.rotate,
                        s = a._getElementRotate(o),
                        c = r[0],
                        l = s[0];
                    c !== l &&
                        (c - l > 180
                            ? (s[0] += 360)
                            : l - c > 180 && (r[0] += 360),
                        (e = a._getAnimation(t, 0)),
                        (n = { rotate: r }),
                        (i = { rotate: s }),
                        a._setInitState(o, n, i),
                        e.push({ ele: o, from: n, to: i }));
                }
            }),
            (e.prototype._playUpdatePieAnimation = function (t) {
                var e,
                    n,
                    i,
                    a,
                    o = this,
                    r = o._chart,
                    s = o._previousState,
                    c = r._areas,
                    l = r._pels,
                    u = s.areas.length,
                    p = c.length,
                    h = Math.max(p, u),
                    m = o._getAnimation(t, 0),
                    d = 0;
                if (0 !== p && 0 !== u)
                    for (o._playSelectPieAnimation(t), e = 0; e < h; e++)
                        (n = {}),
                            l[e] &&
                                l[e].childNodes &&
                                l[e].childNodes.length > 0 &&
                                (e < p &&
                                    e < u &&
                                    ((i = c[0]),
                                    0 === e && (d = i.angle),
                                    1 === u
                                        ? l[e].childNodes[0].setAttribute(
                                              "d",
                                              AnimationHelper.getPathDescOfPie(
                                                  i.center.x,
                                                  i.center.y,
                                                  i.radius,
                                                  d,
                                                  2 * Math.PI,
                                                  i.innerRadius || 0
                                              )
                                          )
                                        : l[e].childNodes[0].setAttribute(
                                              "d",
                                              s.pels[
                                                  e
                                              ].childNodes[0].getAttribute("d")
                                          )),
                                e < p
                                    ? ((i = c[e]),
                                      (n.to = {
                                          pie: [
                                              i.center.x,
                                              i.center.y,
                                              i.radius,
                                              i.angle,
                                              i.sweep,
                                              i.innerRadius || 0,
                                          ],
                                      }),
                                      (n.ele = l[e].childNodes[0]))
                                    : ((i = c[0]),
                                      (a = s.pels[e]),
                                      (n.to = {
                                          pie: [
                                              i.center.x,
                                              i.center.y,
                                              i.radius,
                                              d + 2 * Math.PI,
                                              0,
                                              i.innerRadius || 0,
                                          ],
                                      }),
                                      l[0].parentNode.appendChild(a),
                                      (n.done = (function (t) {
                                          return function () {
                                              t.parentNode.removeChild(t);
                                          };
                                      })(a)),
                                      (n.ele = a.childNodes[0])),
                                e < u
                                    ? ((i = s.areas[e]),
                                      (n.from = {
                                          pie: [
                                              i.center.x,
                                              i.center.y,
                                              i.radius,
                                              i.angle,
                                              i.sweep,
                                              i.innerRadius || 0,
                                          ],
                                      }))
                                    : (l[e].childNodes[0].setAttribute(
                                          "d",
                                          AnimationHelper.getPathDescOfPie(
                                              i.center.x,
                                              i.center.y,
                                              i.radius,
                                              2 * Math.PI + d,
                                              0,
                                              i.innerRadius || 0
                                          )
                                      ),
                                      (i = s.areas[0]),
                                      (n.from = {
                                          pie: [
                                              i.center.x,
                                              i.center.y,
                                              i.radius,
                                              2 * Math.PI + d,
                                              0,
                                              i.innerRadius || 0,
                                          ],
                                      })),
                                m.push(n));
            }),
            (e.prototype._playLoadPieAnimation = function (t) {
                var e = this,
                    n = e._chart,
                    i = e.animationMode,
                    a = n._areas;
                n._pels.forEach(function (n, o) {
                    var r,
                        s = n.childNodes[0],
                        c = {},
                        l = {};
                    s &&
                        (i === AnimationMode.Point
                            ? (e._parsePathByAngle(a[o], c, l),
                              (r = e._getAnimation(t, o)))
                            : (e._parsePathByRadius(a[o], c, l),
                              (r = e._getAnimation(t, 0))),
                        e._setInitState(s, c, l),
                        r.push({ ele: s, from: c, to: l }));
                });
            }),
            (e.prototype._parsePathByRadius = function (t, e, n) {
                var i,
                    a,
                    o = t.center.x,
                    r = t.center.y,
                    s = t.radius,
                    c = t.angle,
                    l = t.sweep;
                (i = [o, r, 0, c, l, 0]),
                    (a = [o, r, s, c, l, t.innerRadius || 0]),
                    (e.pie = i),
                    (n.pie = a);
            }),
            (e.prototype._parsePathByAngle = function (t, e, n) {
                var i,
                    a,
                    o = t.center.x,
                    r = t.center.y,
                    s = t.radius,
                    c = t.angle,
                    l = t.sweep,
                    u = t.innerRadius;
                (i = [o, r, s, c, 0, u || 0]),
                    (a = [o, r, s, c, l, u || 0]),
                    (e.pie = i),
                    (e["stroke-width"] = 0),
                    (n.pie = a),
                    (n["stroke-width"] = 1);
            }),
            e
        );
    })(FlexAnimation),
    FlexChartAnimation = (function (t) {
        function e(e, n) {
            return t.call(this, e, n) || this;
        }
        return (
            __extends(e, t),
            (e.prototype._clearState = function () {
                t.prototype._clearState.call(this);
                var e = this;
                e._prevAxesStates && (e._prevAxesStates = null),
                    e._currAxesStates && (e._currAxesStates = null);
            }),
            (e.prototype.playAnimation = function () {
                t.prototype.playAnimation.call(this);
                var e,
                    n,
                    i,
                    a,
                    o,
                    r,
                    s,
                    c,
                    l,
                    u = this,
                    p = !0,
                    h = u._chart,
                    m =
                        tryGetModuleWijmoChartFinance() &&
                        tryGetModuleWijmoChartFinance().FinancialChart &&
                        h instanceof
                            tryGetModuleWijmoChartFinance().FinancialChart,
                    d = h.series,
                    _ = d.length,
                    f = [];
                for (
                    u._previousState = u._currentState,
                        u._previousXVal = u._currentXVal,
                        u._currentState = [],
                        u._addStart = 0,
                        u._removeStart = 0,
                        u._currentXVal = h._xlabels.slice(),
                        u._previousState &&
                            u._previousState.length &&
                            ((p = !1),
                            (o = (r = u._previousState).length),
                            (s = u._previousXVal),
                            (c = u._currentXVal),
                            s.length > 2 &&
                                c.length > 2 &&
                                ((e = c.indexOf(s[0])) > 0 && e < c.length - 2
                                    ? c[e + 1] === s[1] &&
                                      c[e + 2] === s[2] &&
                                      (u._addStart = e)
                                    : (e = s.indexOf(c[0])) > 0 &&
                                      e < s.length - 2 &&
                                      s[e + 1] === c[1] &&
                                      s[e + 2] === c[2] &&
                                      (u._removeStart = e))),
                        e = 0;
                    e < _;
                    e++
                )
                    if (
                        ((n = d[e]),
                        (a =
                            null != n._getChartType()
                                ? n._getChartType()
                                : h._getChartType()),
                        (i = u._getChartType(a)),
                        u._currentState.push({
                            seriesType: a,
                            ele: n.hostElement,
                        }),
                        m)
                    )
                        u._playDefaultAnimation(f, e);
                    else {
                        if (((l = r && r[e]), "Default" === i)) {
                            u._playDefaultAnimation(f, e);
                            continue;
                        }
                        if (p || (l && l.seriesType !== a))
                            u._playLoadAnimation(f, e, i);
                        else if (
                            (u._playUpdateAnimation(
                                f,
                                e,
                                i,
                                n,
                                (l && l.ele) || null
                            ),
                            e === _ - 1 && e < o - 1)
                        )
                            for (e++; e <= o - 1; e++)
                                u._playUpdateAnimation(f, e, i, null, l.ele);
                    }
                u._adjustAnimations(i, f),
                    f.length && u._playAnimation(f),
                    u.axisAnimation && u._playAxesAnimation();
            }),
            (e.prototype._playAxesAnimation = function () {
                var t,
                    e,
                    n,
                    i = this,
                    a = i._chart.axes,
                    o = a.length;
                for (
                    i._prevAxesStates = i._currAxesStates,
                        i._currAxesStates = [],
                        e = 0;
                    e < o;
                    e++
                )
                    (t = a[e]).hostElement &&
                        i._currAxesStates.push({
                            ele: t.hostElement,
                            vals: t._vals,
                            axis: t,
                            maxValue: wjcCore.isDate(t.actualMax)
                                ? t.actualMax.getTime()
                                : t.actualMax,
                            minValue: wjcCore.isDate(t.actualMin)
                                ? t.actualMin.getTime()
                                : t.actualMin,
                        });
                if (i._prevAxesStates)
                    for (
                        n = Math.max(
                            i._prevAxesStates.length,
                            i._currAxesStates.length
                        ),
                            e = 0;
                        e < n;
                        e++
                    )
                        i._playAxisAnimation(
                            i._prevAxesStates[e],
                            i._currAxesStates[e]
                        );
            }),
            (e.prototype._playAxisAnimation = function (t, e) {
                var n,
                    i = this,
                    a = [],
                    o = [];
                e &&
                    e.maxValue - e.minValue &&
                    ((n = i._parseAxisState(e)),
                    i._convertAxisAnimation(
                        a,
                        n.major,
                        e.axis,
                        t.maxValue,
                        t.minValue
                    ),
                    i._convertAxisAnimation(
                        a,
                        n.minor,
                        e.axis,
                        t.maxValue,
                        t.minValue
                    )),
                    t &&
                        t.maxValue - t.minValue &&
                        ((n = i._parseAxisState(t)),
                        i._convertAxisAnimation(o, n.major, t.axis),
                        i._convertAxisAnimation(o, n.minor, t.axis)),
                    a && o && i._combineAxisAnimations(a, o),
                    i._playCurrAxisAnimation(a),
                    i._playPrevAxisAnimation(o);
            }),
            (e.prototype._combineAxisAnimations = function (t, e) {
                var n,
                    i,
                    a = this,
                    o = e.length;
                for (n = o - 1; n >= 0; n--)
                    (i = e[n]).text &&
                        t.some(function (t) {
                            if (t.text && t.text === i.text)
                                return (
                                    a._combineAxisAnimation(t, i),
                                    e.splice(n, 1),
                                    !0
                                );
                        });
            }),
            (e.prototype._combineAxisAnimation = function (t, e) {
                var n = this;
                ["label", "majorGrid", "tick"].forEach(function (i) {
                    t[i] && e[i] && n._resetExistAxisAttrs(t[i], e[i]);
                });
            }),
            (e.prototype._resetExistAxisAttrs = function (t, e) {
                var n = t.ele,
                    i = e.ele,
                    a = {},
                    o = {};
                ["x", "y", "x1", "x2", "y1", "y2"].forEach(function (t) {
                    var e = n.getAttribute(t),
                        r = i.getAttribute(t);
                    e !== r && ((a[t] = r), (o[t] = e));
                }),
                    (t.calcPos = a),
                    (t.elePos = o);
            }),
            (e.prototype._convertAxisAnimation = function (t, e, n, i, a) {
                var o,
                    r = this,
                    s = n.hostElement,
                    c = n.axisType == wjcChart.AxisType.Y;
                e.forEach(function (e, l) {
                    var u = n.convert(e.val, i, a);
                    isNaN(u) ||
                        ((o = {}),
                        e.majorGrid &&
                            (o.majorGrid = r._getAxisAnimationAttrs(
                                e.majorGrid,
                                s,
                                u,
                                c
                            )),
                        e.label &&
                            ((o.label = r._getAxisAnimationAttrs(
                                e.label,
                                s,
                                u,
                                c
                            )),
                            (o.text =
                                e.label.innerHTML || e.label.textContent)),
                        e.tick &&
                            (o.tick = r._getAxisAnimationAttrs(
                                e.tick,
                                s,
                                u,
                                c
                            )),
                        t.push(o));
                });
            }),
            (e.prototype._getAxisAnimationAttrs = function (t, e, n, i) {
                var a, o, r;
                return (
                    (a = { ele: t, parent: e, elePos: {}, calcPos: {} }),
                    "text" === t.nodeName
                        ? ((o = i ? "y" : "x"),
                          (r = Number(t.getAttribute(o))),
                          (a.elePos[o] = r),
                          (a.calcPos[o] = n))
                        : ((o = i ? "y1" : "x1"),
                          (r = Number(t.getAttribute(o))),
                          i
                              ? ((a.elePos = { y1: r, y2: r }),
                                (a.calcPos = { y1: n, y2: n }))
                              : ((a.elePos = { x1: r, x2: r }),
                                (a.calcPos = { x1: n, x2: n }))),
                    (a.elePos.opacity = 1),
                    (a.calcPos.opacity = 0),
                    a
                );
            }),
            (e.prototype._playCurrAxisAnimation = function (t) {
                var e = this.duration;
                t &&
                    0 !== t.length &&
                    t.forEach(function (t) {
                        ["majorGrid", "label", "tick"].forEach(function (n) {
                            var i = t[n];
                            if (i) {
                                i.parent;
                                var a = i.ele,
                                    o = i.elePos,
                                    r = i.calcPos;
                                AnimationHelper.playAnimation(
                                    a,
                                    r,
                                    o,
                                    null,
                                    Easing.Swing,
                                    e
                                );
                            }
                        });
                    });
            }),
            (e.prototype._playPrevAxisAnimation = function (t) {
                var e = this.duration;
                t &&
                    0 !== t.length &&
                    t.forEach(function (t) {
                        ["majorGrid", "label", "tick"].forEach(function (n) {
                            var i = t[n];
                            if (i) {
                                var a = i.parent,
                                    o = i.ele,
                                    r = i.elePos,
                                    s = i.calcPos;
                                a.appendChild(o),
                                    AnimationHelper.playAnimation(
                                        o,
                                        r,
                                        s,
                                        function () {
                                            o.parentNode === a &&
                                                a.removeChild(o);
                                        },
                                        Easing.Swing,
                                        e
                                    );
                            }
                        });
                    });
            }),
            (e.prototype._parseAxisState = function (t) {
                if (null == t) return null;
                var e = t.vals,
                    n = t.axis,
                    i = n.axisType == wjcChart.AxisType.Y,
                    a = t.ele.childNodes,
                    o = 0,
                    r = e.major,
                    s = e.minor,
                    c = e.hasLbls,
                    l = [],
                    u = [];
                return (
                    r &&
                        r.forEach(function (t, e) {
                            var r,
                                s = {},
                                u = !!c[e];
                            l.push(s),
                                (s.val = t),
                                (r = a[o]),
                                n.majorGrid &&
                                    wjcCore.hasClass(
                                        r,
                                        wjcChart.FlexChart._CSS_GRIDLINE
                                    ) &&
                                    ((s.majorGrid = r), (r = a[++o])),
                                i
                                    ? (u &&
                                          r &&
                                          n.majorTickMarks !==
                                              wjcChart.TickMark.None &&
                                          wjcCore.hasClass(
                                              r,
                                              wjcChart.FlexChart._CSS_TICK
                                          ) &&
                                          ((s.tick = r), (r = a[++o])),
                                      u &&
                                          r &&
                                          (wjcCore.hasClass(
                                              r,
                                              wjcChart.FlexChart._CSS_LABEL
                                          ) ||
                                              r.querySelector(
                                                  "." +
                                                      wjcChart.FlexChart
                                                          ._CSS_LABEL
                                              )) &&
                                          ((s.label = r), o++))
                                    : (u &&
                                          r &&
                                          (wjcCore.hasClass(
                                              r,
                                              wjcChart.FlexChart._CSS_LABEL
                                          ) ||
                                              r.querySelector(
                                                  "." +
                                                      wjcChart.FlexChart
                                                          ._CSS_LABEL
                                              )) &&
                                          ((s.label = r), (r = a[++o])),
                                      u &&
                                          r &&
                                          n.majorTickMarks !==
                                              wjcChart.TickMark.None &&
                                          wjcCore.hasClass(
                                              r,
                                              wjcChart.FlexChart._CSS_TICK
                                          ) &&
                                          ((s.tick = r), o++));
                        }),
                    s &&
                        s.forEach(function (t, e) {
                            var i,
                                r = {};
                            u.push(r),
                                (r.val = t),
                                (i = a[o]),
                                n.minorTickMarks !== wjcChart.TickMark.None &&
                                    wjcCore.hasClass(
                                        i,
                                        wjcChart.FlexChart._CSS_TICK_MINOR
                                    ) &&
                                    ((r.tick = i), (i = a[++o])),
                                n.minorGrid &&
                                    wjcCore.hasClass(
                                        i,
                                        wjcChart.FlexChart._CSS_GRIDLINE_MINOR
                                    ) &&
                                    ((r.majorGrid = i), o++);
                        }),
                    { major: l, minor: u }
                );
            }),
            (e.prototype._playLoadAnimation = function (t, e, n) {
                this["_playLoad" + n + "Animation"](t, e);
            }),
            (e.prototype._playUpdateAnimation = function (t, e, n, i, a) {
                null == i || null == a
                    ? null == i
                        ? this["_play" + n + "RemoveAnimation"](t, a)
                        : this["_play" + n + "AddAnimation"](t, i)
                    : this["_play" + n + "MoveAnimation"](t, i, a);
            }),
            (e.prototype._adjustAnimations = function (t, e) {
                var n,
                    i = e.length;
                if ("Column" === t || "Bar" === t)
                    for (n = i - 1; n >= 0; n--) null == e[n] && e.splice(n, 1);
            }),
            (e.prototype._getChartType = function (t) {
                var e = "Default",
                    n = this._chart._isRotated();
                switch (t) {
                    case wjcChart.ChartType.Scatter:
                    case wjcChart.ChartType.Bubble:
                    case wjcChart.ChartType.Candlestick:
                    case wjcChart.ChartType.HighLowOpenClose:
                        e = "Scatter";
                        break;
                    case wjcChart.ChartType.Column:
                    case wjcChart.ChartType.Bar:
                        e = n ? "Bar" : "Column";
                        break;
                    case wjcChart.ChartType.Line:
                    case wjcChart.ChartType.LineSymbols:
                    case wjcChart.ChartType.Area:
                    case wjcChart.ChartType.Spline:
                    case wjcChart.ChartType.SplineSymbols:
                    case wjcChart.ChartType.SplineArea:
                        e = "Line";
                        break;
                    default:
                        e = "Default";
                }
                return e;
            }),
            (e.prototype._playLoadLineAnimation = function (t, e) {
                var n,
                    i = this,
                    a = i._chart.series[e],
                    o = i.animationMode,
                    r = a.hostElement;
                o === AnimationMode.Point
                    ? i._playDefaultAnimation(t, e)
                    : ((n =
                          o === AnimationMode.All
                              ? i._getAnimation(t, 0)
                              : i._getAnimation(t, e)),
                      [].slice.call(r.childNodes).forEach(function (t) {
                          i._setLineRiseDiveAnimation(n, t, !0);
                      }));
            }),
            (e.prototype._setLineRiseDiveAnimation = function (t, e, n) {
                var i,
                    a,
                    o,
                    r,
                    s,
                    c,
                    l,
                    u = this,
                    p = this,
                    h = p._chart,
                    m = e.nodeName,
                    d = [],
                    _ = [],
                    f = p._chart._plotRect,
                    y = f.top + f.height,
                    A = f.left,
                    g = {},
                    v = {};
                if ("g" === m && e.childNodes)
                    [].slice.call(e.childNodes).forEach(function (e) {
                        u._setLineRiseDiveAnimation(t, e, n);
                    });
                else {
                    if ("polyline" === m || "polygon" === m) {
                        for (
                            o = (c = e.points).length || c.numberOfItems, r = 0;
                            r < o;
                            r++
                        )
                            (s = c[r] || c.getItem(r)),
                                h.rotated
                                    ? d.push({ x: A, y: s.y })
                                    : d.push({ x: s.x, y: y }),
                                _.push({ x: s.x, y: s.y });
                        (g[m] = d), (v[m] = _);
                    } else
                        "ellipse" === m &&
                            (p._toggleVisibility(e, !1),
                            n &&
                                (l = function () {
                                    p._toggleVisibility(e, !0);
                                }));
                    (i = n ? g : v),
                        (a = n ? v : g),
                        p._setInitState(e, i, a),
                        t.push({ ele: e, from: i, to: a, done: l });
                }
            }),
            (e.prototype._setLineMoveAnimation = function (t, e, n, i, a) {
                if (null != e && null != n) {
                    var o,
                        r,
                        s,
                        c,
                        l,
                        u,
                        p,
                        h,
                        m,
                        d = this,
                        _ = e.nodeName,
                        f = [],
                        y = [],
                        A = {},
                        g = {};
                    for (
                        m = "polygon" === _,
                            s = e.points,
                            u = n.points,
                            o = s.length || s.numberOfItems,
                            c = u.length || u.numberOfItems,
                            h = Math.max(o, c),
                            p = 0;
                        p < h;
                        p++
                    )
                        p < o &&
                            ((r = s[p] || s.getItem(p)),
                            f.push({ x: r.x, y: r.y })),
                            p < c &&
                                ((l = u[p] || u.getItem(p)),
                                y.push({ x: l.x, y: l.y }));
                    d._addStart
                        ? (d._adjustStartLinePoints(d._addStart, f, s),
                          (o += d._addStart))
                        : d._removeStart &&
                          (d._adjustStartLinePoints(d._removeStart, y, u),
                          (c += d._removeStart)),
                        c > o
                            ? d._adjustEndLinePoints(c, o, f, s, m)
                            : c < o && d._adjustEndLinePoints(o, c, y, u, m),
                        (A[_] = f),
                        (g[_] = y),
                        d._setInitState(i, A, g),
                        t.push({ ele: i, from: A, to: g, done: a });
                }
            }),
            (e.prototype._adjustStartLinePoints = function (t, e, n) {
                for (var i = n[0] || n.getItem(0); t; )
                    e.splice(0, 0, { x: i.x, y: i.y }), t--;
            }),
            (e.prototype._adjustEndLinePoints = function (t, e, n, i, a) {
                var o, r, s;
                for (
                    a && (i.length >= 3 || i.numberOfItems >= 3)
                        ? ((r = n.pop()),
                          (o = n.pop()),
                          (s =
                              i[i.length - 3] ||
                              i.getItem(i.numberOfItems - 3)))
                        : (i.length > 0 || i.numberOfItems > 0) &&
                          (s =
                              i[i.length - 1] ||
                              i.getItem(i.numberOfItems - 1));
                    t > e && s;

                )
                    n.push({ x: s.x, y: s.y }), e++;
                a && r && o && (n.push(o), n.push(r));
            }),
            (e.prototype._playLineRemoveAnimation = function (t, e) {
                var n,
                    i = this,
                    a = i._chart.series[0].hostElement.parentNode,
                    o = i._getAnimation(t, 0);
                a.appendChild(e),
                    [].slice.call(e.childNodes).forEach(function (t) {
                        i._setLineRiseDiveAnimation(o, t, !1);
                    }),
                    o.length &&
                        ((n = o[0].done),
                        (o[0].done = function () {
                            e && e.parentNode === a && a.removeChild(e),
                                n && n();
                        }));
            }),
            (e.prototype._playLineAddAnimation = function (t, e) {
                var n = this,
                    i = e.hostElement,
                    a = this._getAnimation(t, 0);
                [].slice.call(i.childNodes).forEach(function (t) {
                    n._setLineRiseDiveAnimation(a, t, !0);
                });
            }),
            (e.prototype._playLineMoveAnimation = function (t, e, n) {
                var i,
                    a,
                    o,
                    r,
                    s = this,
                    c = (s._chart, s._getAnimation(t, 0)),
                    l = [];
                (i = e.hostElement),
                    (a = [].slice.call(n.childNodes)),
                    [].slice.call(i.childNodes).forEach(function (t, e) {
                        (r = t.nodeName),
                            (o = a[e]),
                            "g" === r && t.nodeChilds
                                ? [].slice
                                      .call(t.nodeChilds)
                                      .forEach(function (t, e) {
                                          o &&
                                              (l.push(t),
                                              s._toggleVisibility(t, !1));
                                      })
                                : "polygon" === r || "polyline" === r
                                ? s._setLineMoveAnimation(
                                      c,
                                      o,
                                      t,
                                      t,
                                      0 === e
                                          ? function () {
                                                l.forEach(function (t) {
                                                    s._toggleVisibility(t, !0);
                                                }),
                                                    (l = null);
                                            }
                                          : null
                                  )
                                : o && (l.push(t), s._toggleVisibility(t, !1));
                    });
            }),
            (e.prototype._playLoadColumnAnimation = function (t, e) {
                this._playLoadBarAnimation(t, e, !0);
            }),
            (e.prototype._playLoadBarAnimation = function (t, e, n) {
                void 0 === n && (n = !1);
                var i = this,
                    a = i._chart.series[e],
                    o = i.animationMode,
                    r = a.hostElement;
                [].slice.call(r.childNodes).forEach(function (a, r) {
                    var s,
                        c = a.nodeName;
                    (s =
                        o === AnimationMode.Point
                            ? i._getAnimation(t, r)
                            : o === AnimationMode.Series
                            ? i._getAnimation(t, e)
                            : i._getAnimation(t, 0)),
                        "g" === c
                            ? a.childNodes &&
                              [].slice
                                  .call(a.childNodes)
                                  .forEach(function (t, e) {
                                      i._setLoadBarAnimation(s, t, n);
                                  })
                            : i._setLoadBarAnimation(s, a, n);
                });
            }),
            (e.prototype._setBarAnimation = function (t, e, n, i, a) {
                this._setInitState(e, n, i),
                    t.push({ ele: e, from: n, to: i, done: a });
            }),
            (e.prototype._setLoadBarAnimation = function (t, e, n, i, a) {
                void 0 === i && (i = !1);
                var o,
                    r,
                    s = this,
                    c = n ? "height" : "width",
                    l = n ? "y" : "x",
                    u = e.getAttribute(c),
                    p = e.getAttribute(l),
                    h = n ? "top" : "left",
                    m = s._chart._plotRect,
                    d = {},
                    _ = {};
                (d[c] = 0),
                    (_[c] = Number(u)),
                    n && ((d[l] = m[c] + m[h]), (_[l] = Number(p))),
                    (o = i ? _ : d),
                    (r = i ? d : _),
                    "g" === e.nodeName
                        ? e.childNodes &&
                          [].slice.call(e.childNodes).forEach(function (e) {
                              s._setBarAnimation(t, e, o, r, a);
                          })
                        : s._setBarAnimation(t, e, o, r, a);
            }),
            (e.prototype._setMoveBarAnimation = function (t, e, n) {
                var i = {},
                    a = {};
                null != e &&
                    null != n &&
                    (["width", "height", "x", "y", "top", "left"].forEach(
                        function (t) {
                            var o = e.getAttribute(t),
                                r = n.getAttribute(t);
                            o !== r && ((i[t] = Number(o)), (a[t] = Number(r)));
                        }
                    ),
                    this._setInitState(n, i, a),
                    t.push({ ele: n, from: i, to: a }));
            }),
            (e.prototype._playColumnRemoveAnimation = function (t, e) {
                this._playBarRemoveAnimation(t, e, !0);
            }),
            (e.prototype._playColumnAddAnimation = function (t, e) {
                this._playBarAddAnimation(t, e, !0);
            }),
            (e.prototype._playColumnMoveAnimation = function (t, e, n) {
                this._playBarMoveAnimation(t, e, n, !0);
            }),
            (e.prototype._playBarRemoveAnimation = function (t, e, n) {
                void 0 === n && (n = !1);
                var i = this,
                    a = i._chart.series[0].hostElement.parentNode,
                    o = i._getAnimation(t, 0);
                a.appendChild(e),
                    [].slice.call(e.childNodes).forEach(function (t) {
                        i._setLoadBarAnimation(o, t, n, !0);
                    }),
                    o.length &&
                        (o[0].done = function () {
                            e && e.parentNode === a && a.removeChild(e);
                        });
            }),
            (e.prototype._playBarAddAnimation = function (t, e, n) {
                var i = this;
                void 0 === n && (n = !1);
                var a = e.hostElement,
                    o = this._getAnimation(t, 2);
                [].slice.call(a.childNodes).forEach(function (t) {
                    i._setLoadBarAnimation(o, t, n, !1);
                });
            }),
            (e.prototype._playBarMoveAnimation = function (t, e, n, i) {
                void 0 === i && (i = !1);
                var a,
                    o,
                    r,
                    s,
                    c,
                    l,
                    u,
                    p = this;
                p._chart;
                if (
                    ((a = e.hostElement),
                    (r = [].slice.call(n.childNodes)),
                    p._addStart)
                )
                    for (u = 0, s = r[0]; u < p._addStart; )
                        r.splice(0, 0, s), u++;
                if (p._removeStart)
                    for (u = 0, s = r[r.length - 1]; u < p._removeStart; ) {
                        var h = r.shift();
                        r.push(h), u++;
                    }
                (c = r.length),
                    (o = [].slice.call(a.childNodes)),
                    (l = o.length),
                    o.forEach(function (e, n) {
                        var a;
                        if (n < c) {
                            if (
                                ((s = r[n]),
                                n < p._addStart
                                    ? ((a = p._getAnimation(t, 2)),
                                      p._setLoadBarAnimation(a, e, i, !1))
                                    : n >= c - p._removeStart
                                    ? ((a = p._getAnimation(t, 2)),
                                      p._setLoadBarAnimation(a, e, i, !1),
                                      (a = p._getAnimation(t, 0)),
                                      p._removeBarAnimation(a, e, s, i))
                                    : ((a = p._getAnimation(t, 1)),
                                      p._setMoveBarAnimation(a, s, e)),
                                n === l - 1 && n < c - 1)
                            )
                                for (a = p._getAnimation(t, 0), n++; n < c; n++)
                                    (s = r[n]),
                                        p._removeBarAnimation(a, e, s, i);
                        } else (a = p._getAnimation(t, 2)), p._setLoadBarAnimation(a, e, i, !1);
                    });
            }),
            (e.prototype._removeBarAnimation = function (t, e, n, i) {
                var a = e.parentNode;
                a.appendChild(n),
                    this._setLoadBarAnimation(
                        t,
                        n,
                        i,
                        !0,
                        (function (t) {
                            return function () {
                                t.parentNode &&
                                    t.parentNode === a &&
                                    a.removeChild(t);
                            };
                        })(n)
                    );
            }),
            (e.prototype._playLoadScatterAnimation = function (t, e) {
                var n = this,
                    i = n._chart,
                    a = i.series[e],
                    o = n.animationMode,
                    r = a.hostElement,
                    s = a._xValues || i._xvals;
                0 === s.length && (s = a._pointIndexes),
                    [].slice.call(r.childNodes).forEach(function (i, a) {
                        var r;
                        (r =
                            o === AnimationMode.Point
                                ? n._getScatterAnimation(t, s[a])
                                : o === AnimationMode.Series
                                ? n._getAnimation(t, e)
                                : n._getAnimation(t, 0)),
                            n._setLoadScatterAnimation(r, i, !1);
                    });
            }),
            (e.prototype._setLoadScatterAnimation = function (t, e, n, i) {
                var a = this;
                void 0 === n && (n = !1);
                var o,
                    r,
                    s = {},
                    c = {};
                "g" === e.nodeName && e.childNodes
                    ? [].slice.call(e.childNodes).forEach(function (e) {
                          a._setLoadScatterAnimation(t, e, n, i);
                      })
                    : (["rx", "ry", "stroke-width"].forEach(function (t) {
                          var n = e.getAttribute(t);
                          (s[t] = 0), (c[t] = Number(n));
                      }),
                      (o = n ? c : s),
                      (r = n ? s : c),
                      this._setInitState(e, o, r),
                      t.push({ ele: e, from: o, to: r, done: i }));
            }),
            (e.prototype._setUpdateScatterAnimation = function (t, e, n, i) {
                var a = {},
                    o = {};
                ["cx", "cy"].forEach(function (t) {
                    var i = e.getAttribute(t),
                        r = n.getAttribute(t);
                    i !== r && ((a[t] = Number(i)), (o[t] = Number(r)));
                }),
                    this._setInitState(n, a, o),
                    t.push({ ele: n, from: a, to: o, done: i });
            }),
            (e.prototype._getScatterAnimation = function (t, e) {
                var n = this._getScatterAnimationIndex(t, e);
                return t[n] || (t[n] = []), t[n];
            }),
            (e.prototype._getScatterAnimationIndex = function (t, e) {
                var n = this._chart.axisX,
                    i = null == n.min ? n.actualMin : n.min,
                    a = null == n.max ? n.actualMax : n.max;
                return Math.ceil((e - i) / ((a - i) / 20));
            }),
            (e.prototype._playScatterRemoveAnimation = function (t, e) {
                var n = this,
                    i = n._chart.series[0].hostElement.parentNode,
                    a = n._getAnimation(t, 0);
                i.appendChild(e),
                    [].slice.call(e.childNodes).forEach(function (t) {
                        n._setLoadScatterAnimation(a, t, !0);
                    }),
                    a.length &&
                        (a[0].done = function () {
                            e && e.parentNode === i && i.removeChild(e);
                        });
            }),
            (e.prototype._playScatterAddAnimation = function (t, e) {
                var n = this,
                    i = e.hostElement,
                    a = this._getAnimation(t, 0);
                [].slice.call(i.childNodes).forEach(function (t) {
                    n._setLoadScatterAnimation(a, t, !1);
                });
            }),
            (e.prototype._playScatterMoveAnimation = function (t, e, n) {
                var i,
                    a,
                    o,
                    r,
                    s,
                    c,
                    l,
                    u = this,
                    p = (u._chart, u._getAnimation(t, 0));
                if (
                    ((i = e.hostElement),
                    (o = [].slice.call(n.childNodes)),
                    u._addStart)
                )
                    for (l = 0, r = o[0]; l < u._addStart; )
                        o.splice(0, 0, r), l++;
                if (u._removeStart)
                    for (l = 0, r = o[o.length - 1]; l < u._removeStart; ) {
                        var h = o.shift();
                        o.push(h), l++;
                    }
                (s = o.length),
                    (a = [].slice.call(i.childNodes)),
                    (c = a.length),
                    a.forEach(function (t, e) {
                        if (e < s) {
                            if (
                                (e < u._addStart
                                    ? u._setLoadScatterAnimation(p, t, !1)
                                    : e >= s - u._removeStart
                                    ? (u._setLoadScatterAnimation(p, t, !1),
                                      (r = o[e]),
                                      u._removeScatterAnimation(p, t, r))
                                    : ((r = o[e]),
                                      u._setUpdateScatterAnimation(p, r, t)),
                                e === c - 1 && e < s - 1)
                            )
                                for (e++; e < s; e++)
                                    (r = o[e]),
                                        u._removeScatterAnimation(p, t, r);
                        } else u._setLoadScatterAnimation(p, t, !1);
                    });
            }),
            (e.prototype._removeScatterAnimation = function (t, e, n) {
                var i = e.parentNode;
                i.appendChild(n),
                    this._setLoadScatterAnimation(
                        t,
                        n,
                        !0,
                        (function (t) {
                            return function () {
                                t.parentNode &&
                                    t.parentNode === i &&
                                    i.removeChild(t);
                            };
                        })(n)
                    );
            }),
            (e.prototype._playDefaultAnimation = function (t, e) {
                var n,
                    i = this._chart,
                    a = i.series[e].hostElement,
                    o = i._plotRect,
                    r = i._currentRenderEngine,
                    s = a.getAttribute("clip-path"),
                    c = "clipPath" + (1e6 * Math.random()).toFixed();
                r.addClipRect(new wjcCore.Rect(o.left, o.top, 0, o.height), c),
                    a.setAttribute("clip-path", "url(#" + c + ")"),
                    (n = i.hostElement.querySelector("#" + c)),
                    this._getAnimation(t, 0).push({
                        ele: n.querySelector("rect"),
                        from: { width: 0 },
                        to: { width: o.width },
                        done: function () {
                            a &&
                                (s
                                    ? a.setAttribute("clip-path", s)
                                    : a.removeAttribute("clip-path"),
                                n &&
                                    n.parentNode &&
                                    n.parentNode.removeChild(n));
                        },
                    });
            }),
            e
        );
    })(FlexAnimation),
    FlexRadarAnimation = (function (t) {
        function e(e, n) {
            return t.call(this, e, n) || this;
        }
        return (
            __extends(e, t),
            (e.prototype._getDurationAndDelay = function (e, n) {
                var i = t.prototype._getDurationAndDelay.call(this, e, n);
                return (
                    this.animationMode === AnimationMode.Point &&
                        ((i.duration = n / e), (i.delay = n / e)),
                    i
                );
            }),
            (e.prototype._playAxesAnimation = function () {}),
            (e.prototype._getChartType = function (e) {
                var n = t.prototype._getChartType.call(this, e);
                return "Bar" === n && (n = "Column"), n;
            }),
            (e.prototype._playLoadLineAnimation = function (t, e) {
                var n,
                    i,
                    a,
                    o = this,
                    r = o._chart,
                    s = o._chart.series[e],
                    c = s._xValues || r._xvals,
                    l = o.animationMode,
                    u = s.hostElement;
                l === AnimationMode.Point
                    ? (0 === c.length && (c = s._pointIndexes),
                      (a = [].slice.call(u.childNodes)),
                      (i = a.length - u.querySelectorAll("ellipse").length),
                      a.forEach(function (e, n) {
                          o._setRadarLinePointAnimation(t, e, n, c, i);
                      }))
                    : ((n =
                          l === AnimationMode.All
                              ? o._getAnimation(t, 0)
                              : o._getAnimation(t, e)),
                      [].slice.call(u.childNodes).forEach(function (t) {
                          o._setLineRiseDiveAnimation(n, t, !0);
                      }));
            }),
            (e.prototype._setRadarLinePointAnimation = function (
                t,
                e,
                n,
                i,
                a
            ) {
                var o,
                    r,
                    s,
                    c,
                    l,
                    u,
                    p,
                    h = this,
                    m = h._chart,
                    d = e.nodeName,
                    _ = [],
                    f = [],
                    y = [],
                    A = [],
                    g = m._center,
                    v = [],
                    x = !1,
                    E = {},
                    C = {},
                    S = 0;
                if ("polyline" === d || "polygon" === d) {
                    for (
                        o = (c = e.points).length || c.numberOfItems, r = 0;
                        r < o;
                        r++
                    )
                        v[(p = h._getScatterAnimationIndex(t, i[r]))] ||
                            (v[p] = []),
                            v[p].push(r),
                            (s = c[r] || c.getItem(r)),
                            _.push({ x: g.x, y: g.y }),
                            f.push({ x: s.x, y: s.y });
                    for (r = 0, o = v.length; r < o; r++)
                        v[r] &&
                            ((u = h._getAnimation(t, S)),
                            (y = A.length ? A.slice() : _.slice()),
                            (A = y.slice()),
                            v[r].forEach(function (t) {
                                var e = f[t];
                                A[t] = { x: e.x, y: e.y };
                            }),
                            (C = {}),
                            ((E = {})[d] = y),
                            (C[d] = A),
                            x || (h._setInitState(e, E, C), (x = !0)),
                            u.push({ ele: e, from: E, to: C, done: l }),
                            S++);
                } else if ("ellipse" === d) {
                    if ((r = n - (a || 0)) < 0) return;
                    (u = m._isPolar
                        ? h._getScatterAnimation(t, i[r])
                        : h._getScatterAnimation(t, r)),
                        h._toggleVisibility(e, !1),
                        (l = function () {
                            h._toggleVisibility(e, !0);
                        }),
                        u.push({ ele: e, from: E, to: C, done: l });
                }
            }),
            (e.prototype._setLineRiseDiveAnimation = function (t, e, n) {
                var i,
                    a,
                    o,
                    r,
                    s,
                    c,
                    l,
                    u = this,
                    p = u._chart,
                    h = e.nodeName,
                    m = [],
                    d = [],
                    _ = p._center,
                    f = {},
                    y = {};
                if ("polyline" === h || "polygon" === h) {
                    for (
                        o = (c = e.points).length || c.numberOfItems, r = 0;
                        r < o;
                        r++
                    )
                        (s = c[r] || c.getItem(r)),
                            m.push({ x: _.x, y: _.y }),
                            d.push({ x: s.x, y: s.y });
                    (f[h] = m), (y[h] = d);
                } else
                    "ellipse" === h &&
                        (u._toggleVisibility(e, !1),
                        n &&
                            (l = function () {
                                u._toggleVisibility(e, !0);
                            }));
                (i = n ? f : y),
                    (a = n ? y : f),
                    u._setInitState(e, i, a),
                    t.push({ ele: e, from: i, to: a, done: l });
            }),
            (e.prototype._parsePathByRadius = function (t, e, n) {
                var i,
                    a,
                    o = t.center.x,
                    r = t.center.y,
                    s = t.radius,
                    c = t.angle,
                    l = t.sweep;
                (i = [o, r, 0, c, l, 0]),
                    (a = [o, r, s, c, l, t.innerRadius || 0]),
                    (e.pie = i),
                    (n.pie = a);
            }),
            (e.prototype._playUpdateAnimation = function (e, n, i, a, o) {
                if ("Bar" === i || "Column" === i) {
                    if (null == a) return;
                    this._playLoadBarAnimation(e, n, !1);
                } else
                    t.prototype._playUpdateAnimation.call(this, e, n, i, a, o);
            }),
            (e.prototype._playLoadBarAnimation = function (t, e, n) {
                void 0 === n && (n = !1);
                var i = this,
                    a = i._chart,
                    o = a.series[e],
                    r = a._areas[e],
                    s = i.animationMode,
                    c = o.hostElement;
                [].slice.call(c.childNodes).forEach(function (n, a) {
                    var o,
                        c,
                        l = {},
                        u = {};
                    (o =
                        s === AnimationMode.Point
                            ? i._getAnimation(t, a)
                            : s === AnimationMode.Series
                            ? i._getAnimation(t, e)
                            : i._getAnimation(t, 0)),
                        (c = r[a]),
                        i._parsePathByRadius(c, l, u),
                        i._setInitState(n, l, u),
                        o.push({ ele: n, from: l, to: u });
                });
            }),
            e
        );
    })(FlexChartAnimation),
    AnimationHelper = (function () {
        function t() {}
        return (
            (t.playAnimations = function (e, n, i, a, o, r, s) {
                void 0 === o && (o = Easing.Swing);
                var c = e.length,
                    l = 0,
                    u = [];
                return (
                    e.forEach(function (e, p) {
                        var h = t.playAnimation(
                            e,
                            n[p],
                            i[p],
                            function () {
                                l === c - 1 && a && a(), l++;
                            },
                            o,
                            r,
                            s
                        );
                        u.push(h);
                    }),
                    u
                );
            }),
            (t.playAnimation = function (e, n, i, a, o, r, s) {
                void 0 === o && (o = Easing.Swing);
                var c = t.parseAttrs(n, i);
                return t.animate(
                    function (n) {
                        t.setElementAttr(e, c, n);
                    },
                    a,
                    o,
                    r,
                    s
                );
            }),
            (t.setElementAttr = function (e, n, i) {
                var a, o;
                for (o in n)
                    (a = n[o]),
                        t.calcValue(a, i),
                        e.setAttribute(o, a.getValue(a.value, i));
            }),
            (t.getPathDescOfPie = function (t, e, n, i, a, o) {
                void 0 === o && (o = 0);
                var r = !1;
                a >= 2 * Math.PI && ((r = !0), (a = 2 * Math.PI - 0.001));
                var s = new wjcCore.Point(t, e);
                (s.x += n * Math.cos(i)), (s.y += n * Math.sin(i));
                var c = i + a,
                    l = new wjcCore.Point(t, e);
                if (((l.x += n * Math.cos(c)), (l.y += n * Math.sin(c)), o)) {
                    var u = new wjcCore.Point(t, e);
                    (u.x += o * Math.cos(c)), (u.y += o * Math.sin(c));
                    var p = new wjcCore.Point(t, e);
                    (p.x += o * Math.cos(i)), (p.y += o * Math.sin(i));
                }
                var h = " 0 0,1 ",
                    m = " 0 0,0 ";
                Math.abs(a) > Math.PI && ((h = " 0 1,1 "), (m = " 0 1,0 "));
                var d = "M " + s.x.toFixed(3) + "," + s.y.toFixed(3);
                return (
                    (d += " A " + n.toFixed(3) + "," + n.toFixed(3) + h),
                    (d += l.x.toFixed(3) + "," + l.y.toFixed(3)),
                    o
                        ? ((d += r
                              ? " M " + u.x.toFixed(3) + "," + u.y.toFixed(3)
                              : " L " + u.x.toFixed(3) + "," + u.y.toFixed(3)),
                          (d += " A " + o.toFixed(3) + "," + o.toFixed(3) + m),
                          (d += p.x.toFixed(3) + "," + p.y.toFixed(3)))
                        : (d += " L " + t.toFixed(3) + "," + e.toFixed(3)),
                    r || (d += " z"),
                    d
                );
            }),
            (t.parseAttrs = function (e, n) {
                var i = {};
                for (var a in e)
                    if (null != n[a])
                        switch (a) {
                            case "polyline":
                                i.points = t.parseAttr(
                                    e[a],
                                    n[a],
                                    function (t, e) {
                                        if (1 === e) {
                                            for (var n, i, a; t.length > 1; ) {
                                                if (
                                                    ((i = t[0]),
                                                    (a = t[1]),
                                                    i.x !== a.x || i.y !== a.y)
                                                ) {
                                                    (i = null), (a = null);
                                                    break;
                                                }
                                                t.splice(1, 1);
                                            }
                                            for (n = t.length - 1; n > 0; n--)
                                                if (((i = a), (a = t[n]), i)) {
                                                    if (
                                                        i.x !== a.x ||
                                                        i.y !== a.y
                                                    )
                                                        break;
                                                    t.pop();
                                                }
                                        }
                                        return t
                                            .map(function (t) {
                                                return t.x + "," + t.y;
                                            })
                                            .join(" ");
                                    }
                                );
                                break;
                            case "polygon":
                                i.points = t.parseAttr(
                                    e[a],
                                    n[a],
                                    function (t, e) {
                                        if (1 === e) {
                                            var n, i, a, o, r;
                                            for (
                                                o = t.pop(), r = t.pop();
                                                t.length > 1;

                                            ) {
                                                if (
                                                    ((i = t[0]),
                                                    (a = t[1]),
                                                    i.x !== a.x || i.y !== a.y)
                                                ) {
                                                    (i = null), (a = null);
                                                    break;
                                                }
                                                t.splice(1, 1);
                                            }
                                            for (n = t.length - 1; n >= 0; n--)
                                                if (((i = a), (a = t[n]), i)) {
                                                    if (
                                                        i.x !== a.x ||
                                                        i.y !== i.y
                                                    )
                                                        break;
                                                    t.splice(n, 1);
                                                }
                                            t.push(r), t.push(o);
                                        }
                                        return t
                                            .map(function (t) {
                                                return t.x + "," + t.y;
                                            })
                                            .join(" ");
                                    }
                                );
                                break;
                            case "d":
                                i[a] = t.parseAttr(e[a], n[a], function (t) {
                                    return t
                                        .map(function (t) {
                                            return "string" == typeof t
                                                ? t
                                                : t[0] + "," + t[1];
                                        })
                                        .join(" ");
                                });
                                break;
                            case "pie":
                                i.d = t.parseAttr(e[a], n[a], function (e) {
                                    return t.getPathDescOfPie.apply(t, e);
                                });
                                break;
                            case "rotate":
                                i.transform = t.parseAttr(
                                    e[a],
                                    n[a],
                                    function (t) {
                                        return "rotate(" + t.join(" ") + ")";
                                    }
                                );
                                break;
                            case "width":
                            case "height":
                            case "rx":
                            case "ry":
                            case "stroke-width":
                                i[a] = t.parseAttr(e[a], n[a], function (t) {
                                    return Math.abs(t);
                                });
                                break;
                            default:
                                i[a] = t.parseAttr(e[a], n[a]);
                        }
                return i;
            }),
            (t.animate = function (t, e, n, i, a) {
                void 0 === n && (n = Easing.Swing),
                    void 0 === i && (i = 400),
                    void 0 === a && (a = 16),
                    wjcCore.asFunction(t),
                    wjcCore.asNumber(i, !1, !0),
                    wjcCore.asNumber(a, !1, !0);
                var o = 0,
                    r = setInterval(function () {
                        Date.now();
                        var s = o / i;
                        (s = EasingHelper[Easing[n]](s)),
                            t(s),
                            (o += a) >= i &&
                                (clearInterval(r),
                                (s < 1 || s > 1) && t(1),
                                e && e());
                    }, a);
                return r;
            }),
            (t.calcValue = function (e, n) {
                var i = e.from,
                    a = e.diff,
                    o = e.value;
                wjcCore.isNumber(i)
                    ? (e.value = 0 === a ? i : i + a * n)
                    : wjcCore.isArray(i) &&
                      t.parseArrayAttr(o, i, a, function (t, e) {
                          return "number" == typeof t ? t + e * n : t;
                      });
            }),
            (t.parseAttr = function (e, n, i) {
                var a, o, r, s;
                return (
                    wjcCore.isArray(e) && wjcCore.isArray(n)
                        ? ((o = n),
                          (r = []),
                          (s = (a = e).slice()),
                          t.parseArrayAttr(r, a, o, function (t, e) {
                              return t === e ? 0 : e - t;
                          }))
                        : ((s = a = Number(e)), (r = (o = Number(n)) - a)),
                    {
                        from: a,
                        to: o,
                        value: s,
                        diff: r,
                        getValue:
                            i ||
                            function (t, e) {
                                return t;
                            },
                    }
                );
            }),
            (t.parseArrayAttr = function (t, e, n, i) {
                e.forEach(function (e, a) {
                    var o = {},
                        r = [],
                        s = n[a];
                    wjcCore.isNumber(e) || "string" == typeof e
                        ? (t[a] = i(e, s))
                        : wjcCore.isArray(e)
                        ? (e.forEach(function (t, n) {
                              r[n] = i(e[n], s[n]);
                          }),
                          (t[a] = r))
                        : (Object.getOwnPropertyNames(e).forEach(function (t) {
                              o[t] = i(e[t], s[t]);
                          }),
                          (t[a] = o));
                });
            }),
            t
        );
    })(),
    EasingHelper = (function () {
        function t() {}
        return (
            (t.Linear = function (t) {
                return t;
            }),
            (t.Swing = function (t) {
                var e = 1.70158;
                return (t /= 0.5) < 1
                    ? t * t * ((1 + (e *= 1.525)) * t - e) * 0.5
                    : 0.5 * ((t -= 2) * t * ((1 + (e *= 1.525)) * t + e) + 2);
            }),
            (t.EaseInQuad = function (t) {
                return t * t;
            }),
            (t.EaseOutQuad = function (t) {
                return t * (2 - t);
            }),
            (t.EaseInOutQuad = function (t) {
                return t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1;
            }),
            (t.EaseInCubic = function (t) {
                return t * t * t;
            }),
            (t.EaseOutCubic = function (t) {
                return --t * t * t + 1;
            }),
            (t.EaseInOutCubic = function (t) {
                return t < 0.5
                    ? 4 * t * t * t
                    : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }),
            (t.EaseInQuart = function (t) {
                return t * t * t * t;
            }),
            (t.EaseOutQuart = function (t) {
                return 1 - --t * t * t * t;
            }),
            (t.EaseInOutQuart = function (t) {
                return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
            }),
            (t.EaseInQuint = function (t) {
                return t * t * t * t * t;
            }),
            (t.EaseOutQuint = function (t) {
                return 1 + --t * t * t * t * t;
            }),
            (t.EaseInOutQuint = function (t) {
                return t < 0.5
                    ? 16 * t * t * t * t * t
                    : 1 + 16 * --t * t * t * t * t;
            }),
            (t.EaseInSine = function (t) {
                return 1 - Math.cos(t * (Math.PI / 2));
            }),
            (t.EaseOutSine = function (t) {
                return Math.sin(t * (Math.PI / 2));
            }),
            (t.EaseInOutSine = function (t) {
                return -0.5 * (Math.cos(Math.PI * t) - 1);
            }),
            (t.EaseInExpo = function (t) {
                return 0 == t ? 0 : Math.pow(2, 10 * (t - 1));
            }),
            (t.EaseOutExpo = function (t) {
                return 1 == t ? 1 : 1 - Math.pow(2, -10 * t);
            }),
            (t.EaseInOutExpo = function (t) {
                return t == !!t
                    ? t
                    : (t /= 0.5) < 1
                    ? 0.5 * Math.pow(2, 10 * (t - 1))
                    : 0.5 * (2 - Math.pow(2, -10 * --t));
            }),
            (t.EaseInCirc = function (t) {
                return -(Math.sqrt(1 - t * t) - 1);
            }),
            (t.EaseOutCirc = function (t) {
                return Math.sqrt(1 - Math.pow(t - 1, 2));
            }),
            (t.EaseInOutCirc = function (t) {
                return (t /= 0.5) < 1
                    ? -0.5 * (Math.sqrt(1 - t * t) - 1)
                    : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
            }),
            (t.EaseInBack = function (t) {
                var e = 1.70158;
                return t * t * ((e + 1) * t - e);
            }),
            (t.EaseOutBack = function (t) {
                var e = 1.70158;
                return (t -= 1) * t * ((e + 1) * t + e) + 1;
            }),
            (t.EaseInOutBack = function (t) {
                var e = 1.70158;
                return (t /= 0.5) < 1
                    ? t * t * ((1 + (e *= 1.525)) * t - e) * 0.5
                    : 0.5 * ((t -= 2) * t * ((1 + (e *= 1.525)) * t + e) + 2);
            }),
            (t.EaseInBounce = function (e) {
                return 1 - t.EaseOutBounce(1 - e);
            }),
            (t.EaseOutBounce = function (t) {
                var e = 7.5625;
                return t < 1 / 2.75
                    ? e * t * t
                    : t < 2 / 2.75
                    ? e * (t -= 1.5 / 2.75) * t + 0.75
                    : t < 2.5 / 2.75
                    ? e * (t -= 2.25 / 2.75) * t + 0.9375
                    : e * (t -= 2.625 / 2.75) * t + 0.984375;
            }),
            (t.EaseInOutBounce = function (e) {
                return e < 0.5
                    ? 0.5 * t.EaseInBounce(2 * e)
                    : 0.5 * t.EaseOutBounce(2 * e - 1) + 0.5;
            }),
            (t.EaseInElastic = function (t) {
                return t == !!t
                    ? t
                    : -Math.pow(2, 10 * (t -= 1)) *
                          Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3);
            }),
            (t.EaseOutElastic = function (t) {
                return t == !!t
                    ? t
                    : Math.pow(2, -10 * t) *
                          Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) +
                          1;
            }),
            (t.EaseInOutElastic = function (t) {
                return t == !!t
                    ? t
                    : (t *= 2) < 1
                    ? Math.pow(2, 10 * (t -= 1)) *
                      Math.sin(((t - 0.1125) * (2 * Math.PI)) / 0.45) *
                      -0.5
                    : Math.pow(2, -10 * (t -= 1)) *
                          Math.sin(((t - 0.1125) * (2 * Math.PI)) / 0.45) *
                          0.5 +
                      1;
            }),
            t
        );
    })();
