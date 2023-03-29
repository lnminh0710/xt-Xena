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
      function i() {
        this.constructor = e;
      }
      t(e, r),
        (e.prototype =
          null === r
            ? Object.create(r)
            : ((i.prototype = r.prototype), new i()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcChart = require('wijmo/wijmo.chart'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.chart.analytics');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.chart = window.wijmo.chart || {}),
  (window.wijmo.chart.analytics = wjcSelf);
var TrendLineBase = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    return (
      (r._chartType = wjcChart.ChartType.Line),
      (r._sampleCount = 100),
      r.initialize(e),
      r
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'sampleCount', {
      get: function () {
        return this._sampleCount;
      },
      set: function (t) {
        (t = wjcCore.asNumber(t, !1, !0)) != this._sampleCount &&
          ((this._sampleCount = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.approximate = function (t) {
      return 0;
    }),
    (e.prototype.getValues = function (e) {
      var r = this,
        i = r.binding,
        n = r.bindingX;
      return (
        i !== r._bind && ((r._bind = i), (r.binding = i)),
        n !== r._bindX && ((r._bindX = n), (r.bindingX = n)),
        null == r._originYValues &&
          (r._originYValues = t.prototype.getValues.call(this, 0)),
        null == r._originXValues &&
          (r._originXValues = t.prototype.getValues.call(this, 1)),
        null == r._originXValues || null == r._originYValues
          ? null
          : (t.prototype.getValues.call(this, e),
            (null != r._xValues && null != r._yValues) || r._calculateValues(),
            0 === e
              ? r._yValues || null
              : 1 === e
              ? r._xValues || null
              : void 0)
      );
    }),
    (e.prototype._calculateValues = function () {}),
    (e.prototype._invalidate = function () {
      t.prototype._invalidate.call(this), this._clearCalculatedValues();
    }),
    (e.prototype._clearValues = function () {
      t.prototype._clearValues.call(this),
        (this._originXValues = null),
        (this._originYValues = null),
        this._clearCalculatedValues();
    }),
    (e.prototype._clearCalculatedValues = function () {
      (this._xValues = null), (this._yValues = null);
    }),
    e
  );
})(wjcChart.SeriesBase);
exports.TrendLineBase = TrendLineBase;
var MathHelper = (function () {
    function t() {}
    return (
      (t.round = function (t, e) {
        if (!t) return 0;
        var r = Math.pow(10, e || 2);
        return Math.round(t * r) / r;
      }),
      (t.avg = function (e) {
        return t.sum(e) / e.length;
      }),
      (t.sum = function (t) {
        return (t = wjcCore.asArray(t, !1)).reduce(function (t, e) {
          return t + e;
        }, 0);
      }),
      (t.sumOfPow = function (t, e) {
        return (
          (t = wjcCore.asArray(t, !1)),
          (e = wjcCore.asNumber(e, !1)),
          t.reduce(function (t, r) {
            return t + Math.pow(r, e);
          }, 0)
        );
      }),
      (t.sumProduct = function () {
        for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
        e.length;
        var i,
          n,
          a = 0,
          o = [];
        for (
          (e = wjcCore.asArray(e, !1)).forEach(function (t, e) {
            (t = wjcCore.asArray(t, !1)),
              0 === e
                ? (a = t.length)
                : wjcCore.assert(
                    t.length === a,
                    'The length of the arrays must be equal'
                  );
          }),
            i = 0;
          i < a;
          i++
        )
          (n = 1),
            e.some(function (t, e) {
              var r = t[i];
              if (!r || !wjcCore.isNumber(r)) return (n = 0), !0;
              n *= r;
            }),
            o.push(n);
        return t.sum(o);
      }),
      (t.variance = function (e) {
        e = wjcCore.asArray(e, !1);
        var r,
          i = t.avg(e);
        return (
          (r = e.map(function (t) {
            return t - i;
          })),
          t.sumOfSquares(r) / (e.length - 1)
        );
      }),
      (t.covariance = function (e, r) {
        (e = wjcCore.asArray(e, !1)),
          (r = wjcCore.asArray(r, !1)),
          wjcCore.assert(
            e.length === r.length,
            'Length of arrays must be equal'
          );
        var i,
          n = t.avg(e),
          a = t.avg(r),
          o = e.length,
          s = 0;
        for (i = 0; i < o; i++) s += ((e[i] - n) * (r[i] - a)) / o;
        return s;
      }),
      (t.min = function (t) {
        return Math.min.apply(Math, wjcCore.asArray(t, !1));
      }),
      (t.max = function (t) {
        return Math.max.apply(Math, wjcCore.asArray(t, !1));
      }),
      (t.square = function (t) {
        return Math.pow(wjcCore.asNumber(t, !1), 2);
      }),
      (t.sumOfSquares = function (e) {
        return t.sumOfPow(e, 2);
      }),
      (t.stdDev = function (e) {
        return Math.sqrt(t.variance(e));
      }),
      t
    );
  })(),
  TrendLineFitType;
!(function (t) {
  (t[(t.Linear = 0)] = 'Linear'),
    (t[(t.Exponential = 1)] = 'Exponential'),
    (t[(t.Logarithmic = 2)] = 'Logarithmic'),
    (t[(t.Power = 3)] = 'Power'),
    (t[(t.Fourier = 4)] = 'Fourier'),
    (t[(t.Polynomial = 5)] = 'Polynomial'),
    (t[(t.MinX = 6)] = 'MinX'),
    (t[(t.MinY = 7)] = 'MinY'),
    (t[(t.MaxX = 8)] = 'MaxX'),
    (t[(t.MaxY = 9)] = 'MaxY'),
    (t[(t.AverageX = 10)] = 'AverageX'),
    (t[(t.AverageY = 11)] = 'AverageY');
})(
  (TrendLineFitType =
    exports.TrendLineFitType || (exports.TrendLineFitType = {}))
);
var TrendLine = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    return (
      (r._fitType = TrendLineFitType.Linear), (r._order = 2), r.initialize(e), r
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'fitType', {
      get: function () {
        return this._fitType;
      },
      set: function (t) {
        (t = wjcCore.asEnum(t, TrendLineFitType, !1)) != this._fitType &&
          ((this._fitType = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'order', {
      get: function () {
        return this._order;
      },
      set: function (t) {
        t != this._order &&
          ((this._order = wjcCore.asNumber(t, !1, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'coefficients', {
      get: function () {
        return this._helper ? this._helper.coefficients : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.approximate = function (t) {
      return this._helper ? this._helper.approximate(t) : NaN;
    }),
    (e.prototype.getEquation = function (t) {
      return (this._helper ? this._helper.getEquation(t) : '').replace(
        /\S(\+|\-)\d/g,
        function (t) {
          return t[0] + ' ' + t[1] + ' ' + t[2];
        }
      );
    }),
    (e.prototype._calculateValues = function () {
      var t = TrendLineFitType[this._fitType];
      if (TrendLineHelper[t]) {
        var e = !1,
          r = this._originXValues;
        0 == this._chart._xvals.length &&
          this._chart._xlabels.length > 0 &&
          ((r = this._originXValues.map(function (t) {
            return t + 1;
          })),
          (e = !0));
        var i = new TrendLineHelper[t](
          this._originYValues,
          r,
          this.sampleCount,
          this.order
        );
        i._isXString = e;
        var n = i.calculateValues();
        (this._yValues = n[0]), (this._xValues = n[1]), (this._helper = i);
      }
    }),
    e
  );
})(TrendLineBase);
exports.TrendLine = TrendLine;
var Calculator = (function () {
    function t(t, e) {
      (this._x = t), (this._y = e);
    }
    return (
      Object.defineProperty(t.prototype, 'x', {
        get: function () {
          return this._x;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'y', {
        get: function () {
          return this._y;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'minX', {
        get: function () {
          return (
            null == this._minX && (this._minX = MathHelper.min(this._x)),
            this._minX
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'minY', {
        get: function () {
          return (
            null == this._minY && (this._minY = MathHelper.min(this._y)),
            this._minY
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'maxX', {
        get: function () {
          return (
            null == this._maxX && (this._maxX = MathHelper.max(this._x)),
            this._maxX
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'maxY', {
        get: function () {
          return (
            null == this._maxY && (this._maxY = MathHelper.max(this._y)),
            this._maxY
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'averageX', {
        get: function () {
          return (
            null == this._averageX &&
              (this._averageX = MathHelper.avg(this._x)),
            this._averageX
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'averageY', {
        get: function () {
          return (
            null == this._averageY &&
              (this._averageY = MathHelper.avg(this._y)),
            this._averageY
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sumX', {
        get: function () {
          return (
            null == this._sumX && (this._sumX = MathHelper.sum(this._x)),
            this._sumX
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sumY', {
        get: function () {
          return (
            null == this._sumY && (this._sumY = MathHelper.sum(this._y)),
            this._sumY
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'LogX', {
        get: function () {
          return (
            null == this._logX &&
              (this._logX = this._x.map(function (t) {
                return Math.log(t);
              })),
            this._logX
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'LogY', {
        get: function () {
          return (
            null == this._logY &&
              (this._logY = this._y.map(function (t) {
                return Math.log(t);
              })),
            this._logY
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sumLogX', {
        get: function () {
          return (
            null == this._sumLogX &&
              (this._sumLogX = MathHelper.sum(this.LogX)),
            this._sumLogX
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sumLogY', {
        get: function () {
          return (
            null == this._sumLogY &&
              (this._sumLogY = MathHelper.sum(this.LogY)),
            this._sumLogY
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sumOfSquareX', {
        get: function () {
          return (
            null == this._sumOfSquareX &&
              (this._sumOfSquareX = MathHelper.sumOfSquares(this._x)),
            this._sumOfSquareX
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sumOfSquareY', {
        get: function () {
          return (
            null == this._sumOfSquareY &&
              (this._sumOfSquareY = MathHelper.sumOfSquares(this._y)),
            this._sumOfSquareY
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sumOfSquareLogX', {
        get: function () {
          return (
            null == this._sumOfSquareLogX &&
              (this._sumOfSquareLogX = MathHelper.sumOfSquares(this.LogX)),
            this._sumOfSquareLogX
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sumOfSquareLogY', {
        get: function () {
          return (
            null == this._sumOfSquareLogY &&
              (this._sumOfSquareLogY = MathHelper.sumOfSquares(this.LogY)),
            this._sumOfSquareLogY
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.sumProduct = function (t, e) {
        return (
          null == this._sumProduct &&
            (this._sumProduct = MathHelper.sumProduct(t, e)),
          this._sumProduct
        );
      }),
      t
    );
  })(),
  TrendHelperBase = (function () {
    function t(t, e, r) {
      (this._coefficients = []),
        (this.y = wjcCore.asArray(t)),
        (this.x = wjcCore.asArray(e)),
        wjcCore.assert(
          t.length === e.length,
          'Length of X and Y arrays are not equal'
        ),
        (this.count = r || t.length),
        (this._calculator = new Calculator(e, t)),
        (this.xMin = this._calculator.minX),
        (this.xMax = this._calculator.maxX);
    }
    return (
      Object.defineProperty(t.prototype, 'calculator', {
        get: function () {
          return this._calculator;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'y', {
        get: function () {
          return this._y;
        },
        set: function (t) {
          t !== this.y && (this._y = wjcCore.asArray(t, !1));
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'x', {
        get: function () {
          return this._x;
        },
        set: function (t) {
          t !== this.x && (this._x = wjcCore.asArray(t, !1));
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'count', {
        get: function () {
          return this._count;
        },
        set: function (t) {
          t !== this.count && (this._count = wjcCore.asInt(t, !1, !0));
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'xMin', {
        get: function () {
          return this._xMin;
        },
        set: function (t) {
          t !== this.xMin && (this._xMin = wjcCore.asNumber(t, !1));
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'xMax', {
        get: function () {
          return this._xMax;
        },
        set: function (t) {
          t !== this.xMax && (this._xMax = wjcCore.asNumber(t, !1));
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'coefficients', {
        get: function () {
          return this._coefficients;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype._calculateCoefficients = function () {
        var t = this.calcB(),
          e = this.calcA(t);
        this._coefficients.push(e, t);
      }),
      (t.prototype.calculateValues = function () {
        for (
          var t = (this.xMax - this.xMin) / (this.count - 1),
            e = [[], []],
            r = 0;
          r < this.count;
          r++
        ) {
          var i = this.xMin + t * r,
            n = this.calcY(i);
          e[0].push(n), this._isXString ? e[1].push(i - 1) : e[1].push(i);
        }
        return e;
      }),
      (t.prototype.calcA = function (t) {
        var e = this.y.length,
          r = this.calculator.sumX;
        return (this.calculator.sumY - (t = t || this.calcB()) * r) / e;
      }),
      (t.prototype.calcB = function () {
        var t = this.y.length,
          e = this.calculator,
          r = e.sumProduct(e.x, e.y),
          i = e.sumX;
        return (
          (t * r - i * e.sumY) / (t * e.sumOfSquareX - MathHelper.square(i))
        );
      }),
      (t.prototype.calcY = function (t) {
        var e = this.coefficients;
        return e[0] + e[1] * t;
      }),
      (t.prototype.approximate = function (t) {
        return this.calcY(t);
      }),
      (t.prototype.getEquation = function (t) {
        var t = t || this._defaultEquationFmt;
        return this._getEquation(t);
      }),
      (t.prototype._getEquation = function (t) {
        var e = [];
        return (
          this.coefficients.forEach(function (r) {
            e.push(t(r));
          }),
          this._concatEquation(e)
        );
      }),
      (t.prototype._concatEquation = function (t) {
        return '';
      }),
      (t.prototype._defaultEquationFmt = function (t) {
        var e,
          r = Math.abs(t),
          i = String(r),
          n = 0;
        return r >= 1e5
          ? ((e = String(Math.round(r)).length - 1),
            Math.round(t / Number('1e' + e)) + 'e' + e)
          : r < 1e-4
          ? ((e =
              i.indexOf('e') > -1
                ? Math.abs(+i.substring(i.indexOf('e') + 1))
                : i.match(/\.0+/)[0].length),
            Math.round(t * Number('1e' + e)) + 'e-' + e)
          : ((n = t > 0 ? 6 : 7),
            r >= 1e4 && n--,
            String(+String(t).substring(0, n)));
      }),
      t
    );
  })(),
  LinearHelper = (function (t) {
    function e(e, r, i, n) {
      var a = t.call(this, e, r, i) || this;
      return a._calculateCoefficients(), (a.yOffset = n), a;
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, 'yOffset', {
        get: function () {
          return this._yOffset;
        },
        set: function (t) {
          t !== this.yOffset && (this._yOffset = wjcCore.asNumber(t, !0));
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.calcA = function (e) {
        return null != this.yOffset
          ? this.yOffset
          : t.prototype.calcA.call(this, e);
      }),
      (e.prototype.calcB = function () {
        return null != this.yOffset
          ? this._calculateBSimple()
          : t.prototype.calcB.call(this);
      }),
      (e.prototype._calculateBSimple = function () {
        var t = this.calculator,
          e = t.sumProduct(t.x, t.y),
          r = t.sumX,
          i = t.sumOfSquareX;
        return (e - this.yOffset * r) / i;
      }),
      (e.prototype._calculateCoefficients = function () {
        var t = this.calcB(),
          e = this.calcA(t);
        this.coefficients.push(t, e);
      }),
      (e.prototype.calcY = function (t) {
        var e = this.coefficients;
        return e[0] * t + e[1];
      }),
      (e.prototype._concatEquation = function (t) {
        return (
          'y = ' + t[0] + 'x' + (this.coefficients[1] >= 0 ? '+' : '') + t[1]
        );
      }),
      e
    );
  })(TrendHelperBase),
  LogHelper = (function (t) {
    function e(e, r, i) {
      var n = t.call(this, e, r, i) || this;
      return n._calculateCoefficients(), n;
    }
    return (
      __extends(e, t),
      (e.prototype.calcA = function (t) {
        var e = this.y.length,
          r = this.calculator,
          i = r.sumY,
          n = r.sumLogX;
        return (i - (t = t || this.calcB()) * n) / e;
      }),
      (e.prototype.calcB = function () {
        var t = this.y.length,
          e = this.calculator,
          r = e.sumProduct(e.y, e.LogX),
          i = e.sumY,
          n = e.sumLogX;
        return (t * r - i * n) / (t * e.sumOfSquareLogX - MathHelper.square(n));
      }),
      (e.prototype._calculateCoefficients = function () {
        var t = this.calcB(),
          e = this.calcA(t);
        this.coefficients.push(t, e);
      }),
      (e.prototype.calcY = function (t) {
        var e = this.coefficients;
        return Math.log(t) * e[0] + e[1];
      }),
      (e.prototype._concatEquation = function (t) {
        return (
          'y = ' +
          t[0] +
          'ln(x)' +
          (this.coefficients[1] >= 0 ? '+' : '') +
          t[1]
        );
      }),
      e
    );
  })(TrendHelperBase),
  ExpHelper = (function (t) {
    function e(e, r, i) {
      var n = t.call(this, e, r, i) || this;
      return n._calculateCoefficients(), n;
    }
    return (
      __extends(e, t),
      (e.prototype.calcA = function () {
        var t = this.y.length,
          e = this.calculator,
          r = e.sumLogY,
          i = e.sumOfSquareX,
          n = e.sumX,
          a = e.sumProduct(e.x, e.LogY);
        return Math.exp((r * i - n * a) / (t * i - MathHelper.square(n)));
      }),
      (e.prototype.calcB = function () {
        var t = this.y.length,
          e = this.calculator,
          r = e.sumLogY,
          i = e.sumOfSquareX,
          n = e.sumX;
        return (
          (t * e.sumProduct(e.x, e.LogY) - n * r) /
          (t * i - MathHelper.square(n))
        );
      }),
      (e.prototype.calcY = function (t) {
        var e = this.coefficients;
        return e[0] * Math.exp(e[1] * t);
      }),
      (e.prototype._concatEquation = function (t) {
        return 'y = ' + t[0] + 'e<sup>' + t[1] + 'x</sup>';
      }),
      e
    );
  })(TrendHelperBase),
  PowerHelper = (function (t) {
    function e(e, r, i) {
      var n = t.call(this, e, r, i) || this;
      return n._calculateCoefficients(), n;
    }
    return (
      __extends(e, t),
      (e.prototype.calcA = function (t) {
        var e = this.calculator,
          r = this.y.length,
          i = e.sumLogX,
          n = e.sumLogY,
          t = t || this.calcB();
        return Math.exp((n - t * i) / r);
      }),
      (e.prototype.calcB = function () {
        var t = this.y.length,
          e = this.calculator,
          r = e.sumProduct(e.LogX, e.LogY),
          i = e.sumLogX;
        return (
          (t * r - i * e.sumLogY) /
          (t * e.sumOfSquareLogX - MathHelper.square(i))
        );
      }),
      (e.prototype.calcY = function (t) {
        var e = this.coefficients;
        return e[0] * Math.pow(t, e[1]);
      }),
      (e.prototype._concatEquation = function (t) {
        return 'y = ' + t[0] + 'x<sup>' + t[1] + '</sup>';
      }),
      e
    );
  })(TrendHelperBase),
  LeastSquaresHelper = (function (t) {
    function e(e, r, i, n) {
      var a = t.call(this, e, r, i) || this;
      return (
        (a._order = null == n ? 2 : n),
        (a._basis = []),
        a._calculateCoefficients(),
        a
      );
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, 'basis', {
        get: function () {
          return this._basis;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'order', {
        get: function () {
          return this._order;
        },
        set: function (t) {
          this._order = wjcCore.asNumber(t, !0);
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype._calculateCoefficients = function () {
        (this._coefficients.length = this.order),
          this._createBasis(),
          this._normalizeAndSolveGauss();
      }),
      (e.prototype._createBasis = function () {
        var t = this.x.length,
          e = this.order;
        if (t < 2) throw 'Incompatible data: Less than 2 data points.';
        if (e < 1)
          throw 'Incompatible data: Less than 1 coefficient in the fit';
        if (e > t)
          throw 'Incompatible data: Number of data points less than number of terms';
      }),
      (e.prototype._normalizeAndSolveGauss = function () {
        var t = [];
        if (
          (this._computeNormalEquations(t),
          this._genDefValForArray(t, 0),
          !this._solveGauss(t))
        )
          throw 'Incompatible data: No solution.';
      }),
      (e.prototype._genDefValForArray = function (t, e) {
        var r = t.length + 1;
        t.forEach(function (t) {
          for (var i = 0; i < r; i++) null == t[i] && (t[i] = e);
        });
      }),
      (e.prototype._computeNormalEquations = function (t) {
        var e,
          r,
          i,
          n,
          a = this.y,
          o = this.basis,
          s = this.order,
          u = a.length;
        for (e = 0; e < s; e++)
          for (
            i = 0,
              null == t[e] && (t[e] = []),
              a.forEach(function (t, r) {
                i += t * o[r][e];
              }),
              t[e][s] = i,
              r = e;
            r < s;
            r++
          ) {
            for (i = 0, n = 0; n < u; n++) i += o[n][r] * o[n][e];
            null == t[r] && (t[r] = []), (t[r][e] = i), (t[e][r] = i);
          }
      }),
      (e.prototype._solveGauss = function (t) {
        var e,
          r,
          i = t.length,
          n = this._coefficients,
          a = !0;
        if (n.length < i || t[0].length < i + 1)
          throw 'Dimension of matrix is not correct.';
        if (
          (t.some(function (e, n) {
            var o,
              s,
              u = n,
              l = Math.abs(e[n]);
            for (r = n + 1; r < i; r++)
              l < (o = Math.abs(t[r][n])) && ((l = o), (u = r));
            if (!(l > 0)) return (a = !1), !0;
            for (r = n; r <= i; r++)
              (s = t[n][r]), (t[n][r] = t[u][r]), (t[u][r] = s);
            for (u = n + 1; u < i; u++)
              for (s = t[u][n] / e[n], t[u][n] = 0, r = n + 1; r <= i; r++)
                t[u][r] -= s * e[r];
          }),
          a)
        )
          for (e = i - 1; e >= 0; e--) {
            for (n[e] = t[e][i], r = e + 1; r < i; r++) n[e] -= t[e][r] * n[r];
            n[e] = n[e] / t[e][e];
          }
        return a;
      }),
      e
    );
  })(TrendHelperBase),
  PolyHelper = (function (t) {
    function e(e, r, i, n) {
      return t.call(this, e, r, i, n) || this;
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, 'coefficients', {
        get: function () {
          return this._coefficients.slice(0).reverse();
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.calcY = function (t) {
        var e = 0,
          r = 1;
        return (
          this._coefficients.forEach(function (i, n) {
            n > 0 && (r *= t), (e += i * r);
          }),
          e
        );
      }),
      (e.prototype._calculateCoefficients = function () {
        this._coefficients;
        this.order++,
          t.prototype._calculateCoefficients.call(this),
          this.order--;
      }),
      (e.prototype._createBasis = function () {
        t.prototype._createBasis.call(this);
        var e = this.x,
          r = this.basis,
          i = this.order;
        e.forEach(function (t, e) {
          r[e] = [1];
          for (var n = 1; n <= i; n++) r[e][n] = t * r[e][n - 1];
        });
      }),
      (e.prototype._concatEquation = function (t) {
        var e = 'y = ',
          r = t.length,
          i = this.coefficients;
        return (
          t.forEach(function (t, n) {
            var a,
              o = r - 1 - n;
            0 === o
              ? (e += t)
              : 1 === o
              ? ((a = i[n + 1] >= 0 ? '+' : ''), (e += t + 'x' + a))
              : ((a = i[n + 1] >= 0 ? '+' : ''),
                (e += t + 'x<sup>' + o + '</sup>' + a));
          }),
          e
        );
      }),
      e
    );
  })(LeastSquaresHelper),
  FourierHelper = (function (t) {
    function e(e, r, i, n) {
      return (n = null == n ? r.length : n), t.call(this, e, r, i, n) || this;
    }
    return (
      __extends(e, t),
      (e.prototype._createBasis = function () {
        t.prototype._createBasis.call(this);
        var e = this.x,
          r = this.basis,
          i = this.order;
        e.forEach(function (t, e) {
          var n, a;
          for (r[e] = [1], n = 1; n < i; n++)
            (a = Math.floor((n + 1) / 2)),
              n % 2 == 1
                ? r[e].push(Math.cos(a * t))
                : r[e].push(Math.sin(a * t));
        });
      }),
      (e.prototype.calcY = function (t) {
        var e;
        return (
          this._coefficients.forEach(function (r, i) {
            var n,
              a = Math.floor((i + 1) / 2);
            0 === i
              ? (e = r)
              : ((n = a * t),
                (e += i % 2 == 1 ? r * Math.cos(n) : r * Math.sin(n)));
          }),
          e
        );
      }),
      (e.prototype._concatEquation = function (t) {
        var e = 'y = ',
          r = t.length,
          i = this.coefficients;
        return (
          t.forEach(function (t, n) {
            var a = n === r - 1 ? '' : i[n + 1] >= 0 ? '+' : '',
              o = '',
              s = Math.ceil(n / 2);
            if (0 === n) e += t + a;
            else {
              o = n % 2 == 1 ? 'cos' : 'sin';
              (o += '(' + (1 === s ? '' : String(s)) + 'x)'), (e += t + o + a);
            }
          }),
          e
        );
      }),
      e
    );
  })(LeastSquaresHelper),
  SimpleTrendHelper = (function (t) {
    function e(e, r, i) {
      var n = t.call(this, e, r, i) || this;
      return n._calculateCoefficients(), n;
    }
    return (
      __extends(e, t),
      (e.prototype._setVal = function (t) {
        this._val = t;
      }),
      (e.prototype.calcY = function (t) {
        return this._val;
      }),
      e
    );
  })(TrendHelperBase),
  MinXHelper = (function (t) {
    function e(e, r, i) {
      return t.call(this, e, r, i) || this;
    }
    return (
      __extends(e, t),
      (e.prototype.calculateValues = function () {
        var t,
          e,
          r = this.xMin,
          i = MathHelper.min(this.y),
          n = MathHelper.max(this.y);
        return (
          this._isXString && (r -= 1),
          (t = [r, r]),
          (e = [i, n]),
          this._setVal(r),
          [e, t]
        );
      }),
      (e.prototype.getEquation = function (t) {
        var e = this.xMin;
        return this._isXString && (e -= 1), t && (e = t(e)), 'x = ' + e;
      }),
      e
    );
  })(SimpleTrendHelper),
  MinYHelper = (function (t) {
    function e(e, r, i) {
      return t.call(this, e, r, i) || this;
    }
    return (
      __extends(e, t),
      (e.prototype.calculateValues = function () {
        var t,
          e,
          r = this.xMin,
          i = this.xMax,
          n = MathHelper.min(this.y);
        return (
          this._isXString && ((r -= 1), (i -= 1)),
          (t = [r, i]),
          (e = [n, n]),
          this._setVal(n),
          [e, t]
        );
      }),
      (e.prototype.getEquation = function (t) {
        var e = MathHelper.min(this.y);
        return t && (e = t(e)), 'y = ' + e;
      }),
      e
    );
  })(SimpleTrendHelper),
  MaxXHelper = (function (t) {
    function e(e, r, i) {
      return t.call(this, e, r, i) || this;
    }
    return (
      __extends(e, t),
      (e.prototype.calculateValues = function () {
        var t,
          e,
          r = this.xMax,
          i = MathHelper.min(this.y),
          n = MathHelper.max(this.y);
        return (
          this._isXString && (r -= 1),
          (t = [r, r]),
          (e = [i, n]),
          this._setVal(r),
          [e, t]
        );
      }),
      (e.prototype.getEquation = function (t) {
        var e = this.xMax;
        return this._isXString && (e -= 1), t && (e = t(e)), 'x = ' + e;
      }),
      e
    );
  })(SimpleTrendHelper),
  MaxYHelper = (function (t) {
    function e(e, r, i) {
      return t.call(this, e, r, i) || this;
    }
    return (
      __extends(e, t),
      (e.prototype.calculateValues = function () {
        var t,
          e,
          r = this.xMin,
          i = this.xMax,
          n = MathHelper.max(this.y);
        return (
          this._isXString && ((r -= 1), (i -= 1)),
          (t = [r, i]),
          (e = [n, n]),
          this._setVal(n),
          [e, t]
        );
      }),
      (e.prototype.getEquation = function (t) {
        var e = MathHelper.max(this.y);
        return t && (e = t(e)), 'y = ' + e;
      }),
      e
    );
  })(SimpleTrendHelper),
  AverageXHelper = (function (t) {
    function e(e, r, i) {
      return t.call(this, e, r, i) || this;
    }
    return (
      __extends(e, t),
      (e.prototype.calculateValues = function () {
        var t,
          e,
          r = MathHelper.avg(this.x),
          i = MathHelper.min(this.y),
          n = MathHelper.max(this.y);
        return (
          this._isXString && (r -= 1),
          (t = [r, r]),
          (e = [i, n]),
          this._setVal(r),
          [e, t]
        );
      }),
      (e.prototype._getEquation = function (t) {
        var e = MathHelper.avg(this.x);
        return this._isXString && (e -= 1), t && (e = t(e)), ' x =' + e;
      }),
      (e.prototype._defaultEquationFmt = function (e) {
        return Math.abs(e) < 1e5
          ? t.prototype._defaultEquationFmt.call(this, e)
          : '' + MathHelper.round(e, 2);
      }),
      e
    );
  })(SimpleTrendHelper),
  AverageYHelper = (function (t) {
    function e(e, r, i) {
      return t.call(this, e, r, i) || this;
    }
    return (
      __extends(e, t),
      (e.prototype.calculateValues = function () {
        var t,
          e,
          r = MathHelper.avg(this.y),
          i = this.xMin,
          n = this.xMax;
        return (
          this._isXString && ((i -= 1), (n -= 1)),
          (t = [i, n]),
          (e = [r, r]),
          this._setVal(r),
          [e, t]
        );
      }),
      (e.prototype._getEquation = function (t) {
        return 'y = ' + t(MathHelper.avg(this.y));
      }),
      (e.prototype._defaultEquationFmt = function (e) {
        return Math.abs(e) < 1e5
          ? t.prototype._defaultEquationFmt.call(this, e)
          : '' + MathHelper.round(e, 2);
      }),
      e
    );
  })(SimpleTrendHelper),
  TrendLineHelper = {
    TrendHelperBase: TrendHelperBase,
    Linear: LinearHelper,
    Exponential: ExpHelper,
    Logarithmic: LogHelper,
    Power: PowerHelper,
    Polynomial: PolyHelper,
    Fourier: FourierHelper,
    MinX: MinXHelper,
    MinY: MinYHelper,
    MaxX: MaxXHelper,
    MaxY: MaxYHelper,
    AverageX: AverageXHelper,
    AverageY: AverageYHelper,
  },
  FunctionSeries = (function (t) {
    function e(e) {
      var r = t.call(this) || this;
      return (
        (r._min = 0),
        (r._max = 1),
        r.initialize(e),
        null == r.itemsSource && (r.itemsSource = [new wjcCore.Point(0, 0)]),
        r
      );
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, 'min', {
        get: function () {
          return this._min;
        },
        set: function (t) {
          this._min !== t &&
            ((this._min = wjcCore.asNumber(t, !1)), this._invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(e.prototype, 'max', {
        get: function () {
          return this._max;
        },
        set: function (t) {
          this._max !== t &&
            ((this._max = wjcCore.asNumber(t, !1)), this._invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      (e.prototype.getValues = function (t) {
        var e = this;
        return (
          (null != e._xValues && null != e._yValues) || e._calculateValues(),
          0 === t ? e._yValues || null : 1 === t ? e._xValues || null : void 0
        );
      }),
      (e.prototype._calculateValues = function () {
        for (
          var t,
            e = this,
            r = e.sampleCount,
            i = [],
            n = [],
            a = (e.max - e.min) / (r - 1),
            o = 0;
          o < r;
          o++
        )
          (t = o === r - 1 ? this.max : this.min + a * o),
            (i[o] = e._calculateX(t)),
            (n[o] = e._calculateY(t));
        (e._yValues = n), (e._xValues = i);
      }),
      (e.prototype._validateValue = function (t) {
        return isFinite(t) ? t : Number.NaN;
      }),
      (e.prototype._calculateValue = function (t, e) {
        var r;
        try {
          r = t(e);
        } catch (t) {
          r = Number.NaN;
        }
        return this._validateValue(r);
      }),
      (e.prototype._calculateX = function (t) {
        return 0;
      }),
      (e.prototype._calculateY = function (t) {
        return 0;
      }),
      e
    );
  })(TrendLineBase);
exports.FunctionSeries = FunctionSeries;
var YFunctionSeries = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'func', {
      get: function () {
        return this._func;
      },
      set: function (t) {
        t &&
          this._func !== t &&
          ((this._func = wjcCore.asFunction(t, !1)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._calculateX = function (t) {
      return t;
    }),
    (e.prototype._calculateY = function (t) {
      return this._calculateValue(this.func, t);
    }),
    (e.prototype.approximate = function (t) {
      return this._calculateValue(this.func, t);
    }),
    e
  );
})(FunctionSeries);
exports.YFunctionSeries = YFunctionSeries;
var ParametricFunctionSeries = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'xFunc', {
      get: function () {
        return this._xFunc;
      },
      set: function (t) {
        t &&
          this._xFunc !== t &&
          ((this._xFunc = wjcCore.asFunction(t, !1)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'yFunc', {
      get: function () {
        return this._yFunc;
      },
      set: function (t) {
        t &&
          this._yFunc !== t &&
          ((this._yFunc = wjcCore.asFunction(t, !1)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._calculateX = function (t) {
      return this._calculateValue(this.xFunc, t);
    }),
    (e.prototype._calculateY = function (t) {
      return this._calculateValue(this.yFunc, t);
    }),
    (e.prototype.approximate = function (t) {
      var e = this._calculateValue(this.xFunc, t),
        r = this._calculateValue(this.yFunc, t);
      return new wjcCore.Point(e, r);
    }),
    e
  );
})(FunctionSeries);
exports.ParametricFunctionSeries = ParametricFunctionSeries;
var MovingAverageType;
!(function (t) {
  (t[(t.Simple = 0)] = 'Simple'),
    (t[(t.Weighted = 1)] = 'Weighted'),
    (t[(t.Exponential = 2)] = 'Exponential'),
    (t[(t.Triangular = 3)] = 'Triangular');
})(
  (MovingAverageType =
    exports.MovingAverageType || (exports.MovingAverageType = {}))
);
var MovingAverage = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    return (
      (r._chartType = wjcChart.ChartType.Line),
      (r._type = MovingAverageType.Simple),
      (r._period = 2),
      r.initialize(e),
      r
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'type', {
      get: function () {
        return this._type;
      },
      set: function (t) {
        (t = wjcCore.asEnum(t, MovingAverageType, !1)) != this._type &&
          ((this._type = wjcCore.asEnum(t, MovingAverageType, !1)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'period', {
      get: function () {
        return this._period;
      },
      set: function (t) {
        (t = wjcCore.asNumber(t, !1, !0)) != this._period &&
          ((this._period = wjcCore.asNumber(t, !1, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._checkPeriod = function () {
      var t = this.period,
        e = this._originXValues;
      t <= 1 && wjcCore.assert(!1, 'period must be greater than 1.'),
        e &&
          e.length &&
          t >= e.length &&
          wjcCore.assert(!1, "period must be less than itemSource's length.");
    }),
    (e.prototype._calculateValues = function () {
      this._type;
      var t = '_calculate' + MovingAverageType[this._type],
        e = [],
        r = [];
      this._checkPeriod(),
        this[t] && this[t].call(this, e, r),
        (this._yValues = r),
        (this._xValues = e);
    }),
    (e.prototype._calculateSimple = function (t, e, r) {
      void 0 === r && (r = !1);
      for (
        var i = this._originXValues,
          n = this._originYValues,
          a = i.length,
          o = this._period,
          s = 0,
          u = 0;
        u < a;
        u++
      )
        (s += n[u] || 0),
          u >= o && (s -= n[u - o] || 0),
          u >= o - 1
            ? (t.push(i[u]), e.push(s / o))
            : r && (t.push(i[u]), e.push(s / (u + 1)));
    }),
    (e.prototype._calculateWeighted = function (t, e) {
      for (
        var r = this._originXValues,
          i = this._originYValues,
          n = r.length,
          a = this._period,
          o = (a * (a + 1)) / 2,
          s = 0,
          u = 0,
          l = 0;
        l < n;
        l++
      )
        l > 0 && (s += i[l - 1] || 0),
          l > a && (s -= i[l - a - 1] || 0),
          l < a - 1
            ? (u += (i[l] || 0) * (l + 1))
            : ((u += (i[l] || 0) * a),
              l > a - 1 && (u -= s),
              t.push(r[l]),
              e.push(u / o));
    }),
    (e.prototype._calculateExponential = function (t, e) {
      for (
        var r = this._originXValues,
          i = this._originYValues,
          n = r.length,
          a = this._period,
          o = 0,
          s = 0;
        s < n;
        s++
      )
        s <= a - 2
          ? ((o += i[s] || 0), s === a - 2 && (o /= a - 1))
          : ((o += (2 / (a + 1)) * ((i[s] || 0) - o)), t.push(r[s]), e.push(o));
    }),
    (e.prototype._calculateTriangular = function (t, e) {
      var r = this._period,
        i = [],
        n = [],
        a = 0;
      this._calculateSimple(i, n, !0);
      for (var o = 0, s = i.length; o < s; o++)
        (a += n[o] || 0),
          o >= r && (a -= n[o - r] || 0),
          o >= r - 1 && (t.push(i[o]), e.push(a / r));
    }),
    e
  );
})(TrendLineBase);
exports.MovingAverage = MovingAverage;
var Waterfall = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    return (
      (r._startLabel = 'Start'),
      (r._relativeData = !0),
      (r._connectorLines = !1),
      (r._showTotal = !1),
      (r._totalLabel = 'Total'),
      (r._getXValues = !1),
      (r._showIntermediateTotal = !1),
      (r._intermediateTotalPos = []),
      (r._chartType = wjcChart.ChartType.Bar),
      r.rendering.addHandler(r._rendering, r),
      r.initialize(e),
      r
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'relativeData', {
      get: function () {
        return this._relativeData;
      },
      set: function (t) {
        t != this._relativeData &&
          ((this._relativeData = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'start', {
      get: function () {
        return this._start;
      },
      set: function (t) {
        t != this._start &&
          ((this._start = wjcCore.asNumber(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'startLabel', {
      get: function () {
        return this._startLabel;
      },
      set: function (t) {
        t != this._startLabel &&
          ((this._startLabel = wjcCore.asString(t, !1)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showTotal', {
      get: function () {
        return this._showTotal;
      },
      set: function (t) {
        t != this._showTotal &&
          ((this._showTotal = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'totalLabel', {
      get: function () {
        return this._totalLabel;
      },
      set: function (t) {
        t != this._totalLabel &&
          ((this._totalLabel = wjcCore.asString(t, !1)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showIntermediateTotal', {
      get: function () {
        return this._showIntermediateTotal;
      },
      set: function (t) {
        t != this._showIntermediateTotal &&
          ((this._showIntermediateTotal = wjcCore.asBoolean(t, !1)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'intermediateTotalPositions', {
      get: function () {
        return this._intermediateTotalPositions;
      },
      set: function (t) {
        t != this._intermediateTotalPositions &&
          ((this._intermediateTotalPositions = wjcCore.asArray(t, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'intermediateTotalLabels', {
      get: function () {
        return this._intermediateTotalLabels;
      },
      set: function (t) {
        t != this._intermediateTotalLabels &&
          (wjcCore.assert(
            null == t || wjcCore.isArray(t) || wjcCore.isString(t),
            'Array or string expected.'
          ),
          (this._intermediateTotalLabels = t),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'connectorLines', {
      get: function () {
        return this._connectorLines;
      },
      set: function (t) {
        t != this._connectorLines &&
          ((this._connectorLines = wjcCore.asBoolean(t, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'styles', {
      get: function () {
        return this._styles;
      },
      set: function (t) {
        t != this._styles && ((this._styles = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getValues = function (e) {
      var r,
        i,
        n,
        a,
        o = this,
        s = [],
        u = 0;
      if (((r = t.prototype.getValues.call(this, e)), 0 === e)) {
        if (!this._yValues) {
          var s = [],
            l = 0,
            c = 0,
            h = (r && r.length) || 0;
          if (this.relativeData) {
            for (; c < h; c++) (l += isNaN(r[c]) ? 0 : r[c]), s.push(l);
            this._yValues = s;
          } else {
            for (; c < h; c++) (l = isNaN(r[c]) ? 0 : r[c]), s.push(l);
            this._yValues = s;
          }
          (i = this._yValues) &&
            i.length > 0 &&
            (this.showIntermediateTotal &&
              this.intermediateTotalPositions &&
              this.intermediateTotalPositions.length > 0 &&
              ((this._intermediateTotalPos = i.slice()),
              this.intermediateTotalPositions.reduceRight(function (t, e) {
                var r = 0 === e ? i[0] : i[e - 1];
                return (
                  i.length > e
                    ? (i.splice(e, 0, r),
                      o._intermediateTotalPos.splice(e, 0, !0))
                    : i.length === e &&
                      (i.push(r), o._intermediateTotalPos.push(!0)),
                  0
                );
              }, 0)),
            null != this.start &&
              (i.splice(0, 0, this.start),
              this._intermediateTotalPos.splice(0, 0, !1)),
            this.showTotal && i && i.push(i[i.length - 1]));
        }
        return this._yValues;
      }
      if (
        !this._xValues &&
        this._getXValues &&
        ((this._xValues = r && r.slice()),
        (this._getXValues = !1),
        this._xValues &&
          this._xValues.length > 1 &&
          ((h = this._xValues.length),
          (a = this._xValues[h - 1]),
          (u = Math.abs(this._xValues[h - 1] - this._xValues[h - 2]))),
        this.chart && this.chart._xlabels && this.chart._xlabels.length)
      ) {
        if (
          ((n = this.chart._xlabels),
          this.showIntermediateTotal &&
            this.intermediateTotalPositions &&
            this.intermediateTotalPositions.length > 0)
        ) {
          var p = this.intermediateTotalLabels;
          p &&
            this.intermediateTotalPositions.reduceRight(function (t, e, r) {
              var i = '';
              return (
                (i = wjcCore.isString(p) ? p : p[r] || ''),
                n.length > e ? n.splice(e, 0, i) : n.length === e && n.push(i),
                u && ((a += u), o._xValues.push(a)),
                0
              );
            }, 0);
        }
        null != this.start &&
          (n.splice(0, 0, this.startLabel),
          u && ((a += u), this._xValues.push(a))),
          this.showTotal &&
            (n.push(this.totalLabel), u && ((a += u), this._xValues.push(a)));
      }
      return this._xValues;
    }),
    (e.prototype.legendItemLength = function () {
      return this.showTotal ? 3 : 2;
    }),
    (e.prototype.measureLegendItem = function (t, e) {
      var r = this._getName(e);
      return r ? this._measureLegendItem(t, r) : new wjcCore.Size(0, 0);
    }),
    (e.prototype.drawLegendItem = function (t, e, r) {
      var i = this._getLegendStyles(r);
      this._getName(r) &&
        this._drawLegendItem(
          t,
          e,
          wjcChart.ChartType.Bar,
          this._getName(r),
          i,
          this.symbolStyle
        );
    }),
    (e.prototype._clearValues = function () {
      t.prototype._clearValues.call(this),
        (this._xValues = null),
        (this._yValues = null),
        (this._wfstyle = null),
        (this._getXValues = !0),
        (this._intermediateTotalPos = []),
        this.chart && this.chart._performBind();
    }),
    (e.prototype._invalidate = function () {
      t.prototype._invalidate.call(this), this._clearValues();
    }),
    (e.prototype._rendering = function (t, r) {
      var i = this;
      (r.cancel = !0), (this._wfstyle = null);
      var n,
        a,
        o,
        s,
        u,
        l,
        c = this.chart,
        h = this._getAxisY(),
        p = this._getAxisX(),
        f = h.origin || 0,
        _ = r.engine;
      if (
        ((this._barPlotter = c._getPlotter(this)),
        (o = this._barPlotter.rotated),
        this._barPlotter._getSymbolOrigin ||
          (this._barPlotter._getSymbolOrigin = function (t, e, r) {
            return 0 === e
              ? t
              : !0 === i._intermediateTotalPos[e]
              ? t
              : e === r - 1 && i.showTotal
              ? t
              : i._yValues[e - 1];
          }),
        this._barPlotter._getSymbolStyles ||
          (this._barPlotter._getSymbolStyles = function (t, e) {
            var r = i._getStyles();
            return 0 === t && null != i.start
              ? r.start
              : !0 === i._intermediateTotalPos[t]
              ? r.intermediateTotal
              : t === e - 1 && i.showTotal
              ? r.total
              : i._yValues[t] < i._yValues[t - 1]
              ? r.falling
              : r.rising;
          }),
        this._barPlotter.plotSeries(_, p, h, t, c, 0, 1),
        this.connectorLines)
      ) {
        for (
          _.startGroup(e.CSS_CONNECTOR_LINE_GROUP),
            s = this._barPlotter.hitTester._map[0],
            l = this._yValues[0] < f,
            u = s[0].rect,
            n = 1,
            a = s.length;
          n < a;
          n++
        )
          (!0 === this._intermediateTotalPos[n] && n !== a - 1) ||
            (this._drawConnectorLine(_, o, u, s[n].rect, l),
            (u = s[n].rect),
            (l = this._yValues[n] < this._yValues[n - 1]));
        _.endGroup();
      }
    }),
    (e.prototype._getStyles = function () {
      if (this._wfstyle) return this._wfstyle;
      var t = this._chart.series.indexOf(this),
        e = this._getSymbolFill(t),
        r = this._getSymbolStroke(t),
        i = this.styles || {};
      return (
        (this._wfstyle = {
          start: this._getStyleByKey(i, 'start', e, r),
          intermediateTotal: this._getStyleByKey(i, 'intermediateTotal', e, r),
          total: this._getStyleByKey(i, 'total', e, r),
          falling: this._getStyleByKey(i, 'falling', 'red', 'red'),
          rising: this._getStyleByKey(i, 'rising', 'green', 'green'),
        }),
        this._wfstyle
      );
    }),
    (e.prototype._getStyleByKey = function (t, e, r, i) {
      return {
        fill: t[e] && t[e].fill ? t[e].fill : r,
        stroke: t[e] && t[e].stroke ? t[e].stroke : i,
      };
    }),
    (e.prototype._drawConnectorLine = function (t, r, i, n, a) {
      var o = new wjcCore.Point(),
        s = new wjcCore.Point(),
        u = this.chart.axisY.reversed,
        l = this.chart.axisX.reversed;
      (u ^= a),
        r
          ? (u
              ? ((o.x = i.left), (s.x = i.left))
              : ((o.x = i.left + i.width), (s.x = i.left + i.width)),
            l
              ? ((o.y = i.top), (s.y = n.top + n.height))
              : ((o.y = i.top + i.height), (s.y = n.top)))
          : (u
              ? ((o.y = i.top + i.height), (s.y = i.top + i.height))
              : ((o.y = i.top), (s.y = i.top)),
            l
              ? ((o.x = i.left + i.width), (s.x = n.left))
              : ((o.x = i.left), (s.x = n.left + n.width))),
        t.drawLine(
          o.x,
          o.y,
          s.x,
          s.y,
          e.CSS_CONNECTOR_LINE,
          (this.styles && this.styles.connectorLines) || {
            stroke: 'black',
          }
        );
    }),
    (e.prototype._getLegendStyles = function (t) {
      if (t < 0 || null === this.styles) return null;
      var e = this._getStyles();
      return 0 === t ? e.rising : 1 === t ? e.falling : e.total;
    }),
    (e.prototype._getName = function (t) {
      var e = void 0;
      if (this.name)
        if (this.name.indexOf(',')) {
          var r = this.name.split(',');
          r && r.length - 1 >= t && (e = r[t].trim());
        } else e = this.name;
      return e;
    }),
    (e.CSS_CONNECTOR_LINE_GROUP = 'water-fall-connector-lines'),
    (e.CSS_CONNECTOR_LINE = 'water-fall-connector-line'),
    (e.CSS_ENDLABEL = 'water-fall-end-label'),
    e
  );
})(wjcChart.SeriesBase);
exports.Waterfall = Waterfall;
var QuartileCalculation;
!(function (t) {
  (t[(t.InclusiveMedian = 0)] = 'InclusiveMedian'),
    (t[(t.ExclusiveMedian = 1)] = 'ExclusiveMedian');
})(
  (QuartileCalculation =
    exports.QuartileCalculation || (exports.QuartileCalculation = {}))
);
var BoxWhisker = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    return (
      (r._groupWidth = 0.8),
      (r._gapWidth = 0.1),
      (r._showInnerPoints = !1),
      (r._showOutliers = !1),
      (r._quartileCalculation = QuartileCalculation.InclusiveMedian),
      (r._chartType = wjcChart.ChartType.Bar),
      r.rendering.addHandler(r._rendering, r),
      r.initialize(e),
      r
    );
  }
  return (
    __extends(e, t),
    (e.prototype._initProperties = function (t) {
      t && wjcCore.copy(this, t);
    }),
    (e.prototype._clearValues = function () {
      t.prototype._clearValues.call(this);
    }),
    Object.defineProperty(e.prototype, 'quartileCalculation', {
      get: function () {
        return this._quartileCalculation;
      },
      set: function (t) {
        t != this._quartileCalculation &&
          ((this._quartileCalculation = wjcCore.asEnum(
            t,
            QuartileCalculation,
            !0
          )),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'groupWidth', {
      get: function () {
        return this._groupWidth;
      },
      set: function (t) {
        t != this._groupWidth &&
          t >= 0 &&
          t <= 1 &&
          ((this._groupWidth = wjcCore.asNumber(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'gapWidth', {
      get: function () {
        return this._gapWidth;
      },
      set: function (t) {
        t != this._gapWidth &&
          t >= 0 &&
          t <= 1 &&
          ((this._gapWidth = wjcCore.asNumber(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showMeanLine', {
      get: function () {
        return this._showMeanLine;
      },
      set: function (t) {
        t != this._showMeanLine &&
          ((this._showMeanLine = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'meanLineStyle', {
      get: function () {
        return this._meanLineStyle;
      },
      set: function (t) {
        t != this._meanLineStyle &&
          ((this._meanLineStyle = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showMeanMarker', {
      get: function () {
        return this._showMeanMarker;
      },
      set: function (t) {
        t != this._showMeanMarker &&
          ((this._showMeanMarker = wjcCore.asBoolean(t, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'meanMarkerStyle', {
      get: function () {
        return this._meanMarkerStyle;
      },
      set: function (t) {
        t != this._meanMarkerStyle &&
          ((this._meanMarkerStyle = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showInnerPoints', {
      get: function () {
        return this._showInnerPoints;
      },
      set: function (t) {
        t != this._showInnerPoints &&
          ((this._showInnerPoints = wjcCore.asBoolean(t, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showOutliers', {
      get: function () {
        return this._showOutliers;
      },
      set: function (t) {
        t != this._showOutliers &&
          ((this._showOutliers = wjcCore.asBoolean(t, !0)), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._rendering = function (t, e) {
      var r = this;
      e.cancel = !0;
      var i,
        n,
        a = this,
        o = a.chart,
        s = (a.chart, a._getAxisX()),
        u = a._getAxisY(),
        l = e.index,
        c = e.count,
        h = e.engine,
        p = this._plotter,
        f = o.series.indexOf(a),
        _ = wjcCore.asType(a, wjcChart.SeriesBase),
        m = this.quartileCalculation,
        d = this.showOutliers,
        y = this.groupWidth,
        g = (null == this.gapWidth ? 0.2 : this.gapWidth) / 2;
      l = l || 0;
      var b = y / (c = c || 1),
        v = a.getValues(0),
        x = a.getValues(1);
      if (v) {
        if ((x || (x = p.dataInfo.getXVals()), x)) {
          var w = p.dataInfo.getDeltaX();
          w > 0 && ((y *= w), (b *= w));
        }
        var P = _._getSymbolFill(f),
          M = _._getAltSymbolFill(f) || P,
          j = _._getSymbolStroke(f),
          S = _._getAltSymbolStroke(f) || j,
          C = v.length;
        null != x && (C = Math.min(C, x.length));
        var V,
          L,
          O = 0,
          E = 0;
        if (p.rotated) {
          (O = s.origin || O) < s.actualMin
            ? (O = s.actualMin)
            : O > s.actualMax && (O = s.actualMax);
          s.convert(O);
          for (var T = u.actualMin, B = u.actualMax, X = 0; X < C; X++) {
            var A = x ? x[X] : X,
              q = v[X];
            if (null == q || 0 === q.length) return;
            if (
              (p._getSymbolOrigin && u.convert(p._getSymbolOrigin(O, X)),
              p._getSymbolStyles)
            ) {
              var Y = p._getSymbolStyles(X);
              (P = Y && Y.fill ? Y.fill : P),
                (M = Y && Y.fill ? Y.fill : M),
                (j = Y && Y.stroke ? Y.fill : j),
                (S = Y && Y.stroke ? Y.fill : S);
            }
            if (
              ((V = q[0] > 0 ? P : M),
              (L = q[0] > 0 ? j : S),
              (h.fill = V),
              (h.stroke = L),
              wjcChart._DataInfo.isValid(A) &&
                wjcCore.isArray(q) &&
                q.length > 0 &&
                wjcChart._DataInfo.isValid(q[0]))
            ) {
              var H = A - 0.5 * y + l * b,
                F = A - 0.5 * y + (l + 1) * b,
                N = (F - H) * g;
              if (((H += N), (F -= N), (H < T && F < T) || (H > B && F > B)))
                continue;
              (H = u.convert(H)), (F = u.convert(F));
              var k = new _BoxPlot(q, m, d),
                I = {
                  min: s.convert(k.min),
                  max: s.convert(k.max),
                  firstQuartile: s.convert(k.firstQuartile),
                  median: s.convert(k.median),
                  thirdQuartile: s.convert(k.thirdQuartile),
                  mean: s.convert(k.mean),
                  outlierPoints: this._convertPoints(k.outlierPoints, s),
                  innerPoints: this._convertPoints(k.innerPoints, s),
                },
                Q = new wjcCore.Rect(
                  Math.min(I.min, I.max),
                  Math.min(H, F),
                  Math.abs(I.max - I.min),
                  Math.abs(F - H)
                ),
                D = new wjcChart._RectArea(Q),
                W = {
                  min: Math.min(H, F),
                  median: (H + F) / 2,
                  max: Math.max(F, H),
                };
              if (o.itemFormatter) {
                h.startGroup();
                var R = new wjcChart.HitTestInfo(
                  o,
                  new wjcCore.Point((I.min + I.max) / 2, W.median),
                  wjcChart.ChartElement.SeriesSymbol
                );
                R._setData(a, X),
                  o.itemFormatter(h, R, function () {
                    r._drawBoxWhisker(h, I, W, i, n, a), (i = I), (n = W);
                  }),
                  h.endGroup();
              } else this._drawBoxWhisker(h, I, W, i, n, a), (i = I), (n = W);
              a._setPointIndex(X, E), E++;
              var G = new wjcChart._DataPoint(f, X, q, A);
              (G.item = k), (D.tag = G), p.hitTester.add(D, f);
            }
          }
        } else {
          (O = u.origin || O) < u.actualMin
            ? (O = u.actualMin)
            : O > u.actualMax && (O = u.actualMax);
          u.convert(O);
          for (var z = s.actualMin, K = s.actualMax, X = 0; X < C; X++) {
            A = x ? x[X] : X;
            if (null == (q = v[X]) || 0 === q.length) return;
            if (
              (p._getSymbolOrigin && u.convert(p._getSymbolOrigin(O, X, C)),
              p._getSymbolStyles &&
                ((P = (Y = p._getSymbolStyles(X, C)) && Y.fill ? Y.fill : P),
                (M = Y && Y.fill ? Y.fill : M),
                (j = Y && Y.stroke ? Y.stroke : j),
                (S = Y && Y.stroke ? Y.stroke : S)),
              (V = q[0] > 0 ? P : M),
              (L = q[0] > 0 ? j : S),
              (h.fill = V),
              (h.stroke = L),
              wjcChart._DataInfo.isValid(A) &&
                wjcCore.isArray(q) &&
                q.length > 0 &&
                wjcChart._DataInfo.isValid(q[0]))
            ) {
              var U = A - 0.5 * y + l * b,
                J = A - 0.5 * y + (l + 1) * b;
              if (
                ((U += N = (J - U) * g),
                (J -= N),
                (U < z && J < z) || (U > K && J > K))
              )
                continue;
              if (
                ((U = s.convert(U)),
                (J = s.convert(J)),
                !wjcChart._DataInfo.isValid(U) ||
                  !wjcChart._DataInfo.isValid(J))
              )
                continue;
              var k = new _BoxPlot(q, m, d),
                I = {
                  min: u.convert(k.min),
                  max: u.convert(k.max),
                  firstQuartile: u.convert(k.firstQuartile),
                  median: u.convert(k.median),
                  thirdQuartile: u.convert(k.thirdQuartile),
                  mean: u.convert(k.mean),
                  outlierPoints: this._convertPoints(k.outlierPoints, u),
                  innerPoints: this._convertPoints(k.innerPoints, u),
                },
                Q = new wjcCore.Rect(
                  Math.min(U, J),
                  Math.min(I.min, I.max),
                  Math.abs(J - U),
                  Math.abs(I.max - I.min)
                ),
                D = new wjcChart._RectArea(Q),
                Z = {
                  min: Math.min(U, J),
                  median: (U + J) / 2,
                  max: Math.max(U, J),
                };
              o.itemFormatter
                ? (h.startGroup(),
                  (R = new wjcChart.HitTestInfo(
                    o,
                    new wjcCore.Point(Z.median, (I.min + I.max) / 2),
                    wjcChart.ChartElement.SeriesSymbol
                  ))._setData(a, X),
                  o.itemFormatter(h, R, function () {
                    r._drawBoxWhisker(h, Z, I, i, n, a), (i = Z), (n = I);
                  }),
                  h.endGroup())
                : (this._drawBoxWhisker(h, Z, I, i, n, a), (i = Z), (n = I)),
                a._setPointIndex(X, E),
                E++,
                ((G = new wjcChart._DataPoint(f, X, A, q)).item = k),
                (D.tag = G),
                p.hitTester.add(D, f);
            }
          }
        }
      }
    }),
    (e.prototype._convertPoints = function (t, e) {
      return t.map(function (t) {
        return e.convert(t);
      });
    }),
    (e.prototype._drawBoxWhisker = function (t, e, r, i, n, a) {
      var o = a.symbolStyle,
        s = this.showInnerPoints,
        u = this.showOutliers,
        l = this.showMeanLine,
        c = this.meanLineStyle,
        h = this.showMeanMarker,
        p = this.meanMarkerStyle,
        f = this._plotter;
      if ((t.startGroup('box-plot'), f.rotated)) {
        if (
          (t.drawLine(
            e.min,
            (r.min + r.median) / 2,
            e.min,
            (r.max + r.median) / 2,
            null,
            o
          ),
          t.drawLine(e.min, r.median, e.firstQuartile, r.median, null, o),
          t.drawRect(
            Math.min(e.firstQuartile, e.thirdQuartile),
            Math.min(r.min, r.max),
            Math.abs(e.thirdQuartile - e.firstQuartile),
            Math.abs(r.max - r.min),
            null,
            o
          ),
          t.drawLine(e.median, r.min, e.median, r.max, null, o),
          t.drawLine(e.max, r.median, e.thirdQuartile, r.median, null, o),
          t.drawLine(
            e.max,
            (r.min + r.median) / 2,
            e.max,
            (r.max + r.median) / 2,
            null,
            o
          ),
          l &&
            i &&
            n &&
            t.drawLine(
              e.mean,
              r.median,
              i.mean,
              n.median,
              'box-whisker-mean-line',
              c || o
            ),
          h)
        ) {
          _ = Math.abs(r.median - r.min) / 2;
          t.drawLine(
            e.mean - _,
            r.median - _,
            e.mean + _,
            r.median + _,
            null,
            p || o
          ),
            t.drawLine(
              e.mean + _,
              r.median - _,
              e.mean - _,
              r.median + _,
              null,
              p || o
            );
        }
        u &&
          e.outlierPoints.forEach(function (e) {
            t.drawPieSegment(e, r.median, 2, 0, 2 * Math.PI, null, o);
          }),
          s &&
            e.innerPoints.forEach(function (e) {
              t.drawPieSegment(e, r.median, 2, 0, 2 * Math.PI, null, o);
            });
      } else {
        if (
          (t.drawLine(
            (e.min + e.median) / 2,
            r.min,
            (e.max + e.median) / 2,
            r.min,
            null,
            o
          ),
          t.drawLine(e.median, r.min, e.median, r.firstQuartile, null, o),
          t.drawRect(
            Math.min(e.min, e.max),
            Math.min(r.firstQuartile, r.thirdQuartile),
            Math.abs(e.max - e.min),
            Math.abs(r.thirdQuartile - r.firstQuartile),
            null,
            o
          ),
          t.drawLine(e.min, r.median, e.max, r.median, null, o),
          t.drawLine(e.median, r.max, e.median, r.thirdQuartile, null, o),
          t.drawLine(
            (e.min + e.median) / 2,
            r.max,
            (e.max + e.median) / 2,
            r.max,
            null,
            o
          ),
          l &&
            i &&
            n &&
            t.drawLine(
              e.median,
              r.mean,
              i.median,
              n.mean,
              'box-whisker-mean-line',
              c || o
            ),
          h)
        ) {
          var _ = Math.abs(e.median - e.min) / 2;
          t.drawLine(
            e.median - _,
            r.mean - _,
            e.median + _,
            r.mean + _,
            null,
            p || o
          ),
            t.drawLine(
              e.median - _,
              r.mean + _,
              e.median + _,
              r.mean - _,
              null,
              p || o
            );
        }
        u &&
          r.outlierPoints.forEach(function (r) {
            t.drawPieSegment(e.median, r, 2, 0, 2 * Math.PI, null, o);
          }),
          s &&
            r.innerPoints.forEach(function (r) {
              t.drawPieSegment(e.median, r, 2, 0, 2 * Math.PI, null, o);
            });
      }
      t.endGroup();
    }),
    (e.prototype._renderLabels = function (t, e, r, i) {
      var n = this,
        a = this,
        o = this._plotter,
        s = e.length,
        u = r.dataLabel,
        l = u.border,
        c = u.offset,
        h = u.connectingLine,
        p = 'dataY';
      o.rotated && (p = 'dataX'),
        void 0 === c && (c = h ? 16 : 0),
        l && (c -= 2);
      for (var f = 0; f < s; f++) {
        var _ = e[f],
          m = _.tag,
          d = wjcCore.asType(m, wjcChart._DataPoint, !0);
        if (d) {
          var y = m.item,
            g = m.y;
          if (
            ((m[p] = y.min),
            (m.yfmt = y.min),
            (m.y = y.min),
            this._plotter._renderLabel(t, _, d, r, u, a, c, i),
            (m[p] = y.firstQuartile),
            (m.yfmt = y.firstQuartile),
            (m.y = y.firstQuartile),
            this._plotter._renderLabel(t, _, d, r, u, a, c, i),
            (m[p] = y.median),
            (m.yfmt = y.median),
            (m.y = y.median),
            this._plotter._renderLabel(t, _, d, r, u, a, c, i),
            (m[p] = y.thirdQuartile),
            (m.yfmt = y.thirdQuartile),
            (m.y = y.thirdQuartile),
            this._plotter._renderLabel(t, _, d, r, u, a, c, i),
            (m[p] = y.max),
            (m.yfmt = y.max),
            (m.y = y.max),
            this._plotter._renderLabel(t, _, d, r, u, a, c, i),
            this.showMeanMarker)
          ) {
            var b = Number(y.mean.toFixed(2));
            (m[p] = b),
              (m.yfmt = b),
              (m.y = b),
              this._plotter._renderLabel(t, _, d, r, u, a, c, i);
          }
          y.showOutliers &&
            y.outlierPoints &&
            y.outlierPoints.forEach(function (e) {
              (m[p] = e),
                (m.yfmt = e),
                (m.y = e),
                n._plotter._renderLabel(t, _, d, r, u, a, c, i);
            }),
            (m.y = g);
        }
      }
    }),
    e
  );
})(wjcChart.SeriesBase);
exports.BoxWhisker = BoxWhisker;
var _BoxPlot = (function () {
  function t(t, e, r) {
    (this._outlierPoints = []),
      (this._innerPoints = []),
      (this._data = t),
      (this._quartileCalculation = e),
      (this._showOutliers = r),
      this._parse();
  }
  return (
    Object.defineProperty(t.prototype, 'showOutliers', {
      get: function () {
        return this._showOutliers;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'min', {
      get: function () {
        return this._min;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'max', {
      get: function () {
        return this._max;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'mean', {
      get: function () {
        return this._mean;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'firstQuartile', {
      get: function () {
        return this._firstQuartile;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'thirdQuartile', {
      get: function () {
        return this._thirdQuartile;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'median', {
      get: function () {
        return this._median;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'outlierPoints', {
      get: function () {
        return this._outlierPoints;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'innerPoints', {
      get: function () {
        return this._innerPoints;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._parse = function () {
      var t = this,
        e = this._data.length,
        r = this._data,
        i = 0;
      (this._outlierPoints = []),
        (this._innerPoints = []),
        r.sort(function (t, e) {
          return t - e;
        }),
        r.some(function (e) {
          return null != e && ((t._min = e), !0);
        }),
        (this._max = null == r[e - 1] ? 0 : r[e - 1]),
        this._quartileCalculation === QuartileCalculation.InclusiveMedian
          ? ((this._firstQuartile = this._quartileInc(r, 0.25)),
            (this._median = this._quartileInc(r, 0.5)),
            (this._thirdQuartile = this._quartileInc(r, 0.75)))
          : ((this._firstQuartile = this._quartileExc(r, 0.25)),
            (this._median = this._quartileExc(r, 0.5)),
            (this._thirdQuartile = this._quartileExc(r, 0.75))),
        (this._iqr = 1.5 * Math.abs(this._thirdQuartile - this._firstQuartile));
      var n = this._firstQuartile - this._iqr,
        a = this._thirdQuartile + this._iqr;
      if (this._showOutliers) {
        var o = this._max;
        (this._max = this._min),
          (this._min = o),
          this._data.forEach(function (e) {
            (i += e),
              e < n || e > a
                ? t._outlierPoints.push(e)
                : (e < t._min && (t._min = e), e > t._max && (t._max = e));
          });
      } else
        i = this._data.reduce(function (t, e) {
          return t + e;
        }, 0);
      (this._innerPoints = this._data.filter(function (e) {
        if (e > t._min && e < t._max) return !0;
      })),
        (this._mean = i / e);
    }),
    (t.prototype._quartileInc = function (t, e) {
      var r,
        i,
        n,
        a,
        o = t.length;
      return 1 === o
        ? t[0]
        : ((r = (o - 1) * e + 1),
          (i = Math.floor(r)),
          (n = t[i - 1]),
          (a = r - i),
          n + (t[i] - n) * a);
    }),
    (t.prototype._quartileExc = function (t, e) {
      var r,
        i,
        n,
        a,
        o = t.length;
      return 1 === o
        ? t[0]
        : 2 === o
        ? t[Math.round(e)]
        : (o + 1) % 4 == 0
        ? t[(o + 1) * e]
        : ((r = (o + 1) * e),
          (i = Math.floor(r)),
          (n = t[i - 1]),
          (a = r - i),
          n + (t[i] - n) * a);
    }),
    t
  );
})();
exports._BoxPlot = _BoxPlot;
var ErrorAmount;
!(function (t) {
  (t[(t.FixedValue = 0)] = 'FixedValue'),
    (t[(t.Percentage = 1)] = 'Percentage'),
    (t[(t.StandardDeviation = 2)] = 'StandardDeviation'),
    (t[(t.StandardError = 3)] = 'StandardError'),
    (t[(t.Custom = 4)] = 'Custom');
})((ErrorAmount = exports.ErrorAmount || (exports.ErrorAmount = {})));
var ErrorBarEndStyle;
!(function (t) {
  (t[(t.Cap = 0)] = 'Cap'), (t[(t.NoCap = 1)] = 'NoCap');
})(
  (ErrorBarEndStyle =
    exports.ErrorBarEndStyle || (exports.ErrorBarEndStyle = {}))
);
var ErrorBarDirection;
!(function (t) {
  (t[(t.Both = 0)] = 'Both'),
    (t[(t.Minus = 1)] = 'Minus'),
    (t[(t.Plus = 2)] = 'Plus');
})(
  (ErrorBarDirection =
    exports.ErrorBarDirection || (exports.ErrorBarDirection = {}))
);
var ErrorBar = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    return (
      (r._errorAmount = ErrorAmount.FixedValue),
      (r._endStyle = ErrorBarEndStyle.Cap),
      (r._direction = ErrorBarDirection.Both),
      r.rendering.addHandler(r._rendering, r),
      r.initialize(e),
      r
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'value', {
      get: function () {
        return this._value;
      },
      set: function (t) {
        t != this._value && ((this._value = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'errorAmount', {
      get: function () {
        return this._errorAmount;
      },
      set: function (t) {
        (t = wjcCore.asEnum(t, ErrorAmount, !0)) != this._errorAmount &&
          ((this._errorAmount = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'errorBarStyle', {
      get: function () {
        return this._errorBarStyle;
      },
      set: function (t) {
        t != this._errorBarStyle &&
          ((this._errorBarStyle = t), this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'endStyle', {
      get: function () {
        return this._endStyle;
      },
      set: function (t) {
        t != this._endStyle &&
          ((this._endStyle = wjcCore.asEnum(t, ErrorBarEndStyle, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'direction', {
      get: function () {
        return this._direction;
      },
      set: function (t) {
        t != this._direction &&
          ((this._direction = wjcCore.asEnum(t, ErrorBarDirection, !0)),
          this._invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getDataRect = function (t, e) {
      if (!t) return null;
      this._chart;
      var r,
        i = this.errorAmount,
        n = 0,
        a = 0;
      (this._paddings = []), this._calculateErrorValue();
      var o,
        s,
        u,
        l,
        c = this.getValues(0);
      if (!c) return t;
      for (u = 0, r = c.length; u < r; u++) {
        var h = { plus: 0, minus: 0 },
          p = this._value || 0;
        switch (((l = c[u]), i)) {
          case ErrorAmount.Custom:
            (h = this._getCustomValue(u)), this._paddings.push(h);
            break;
          case ErrorAmount.FixedValue:
            this._paddings.push({ plus: p, minus: p });
            break;
          case ErrorAmount.Percentage:
            this._paddings.push({ plus: l * p, minus: l * p });
            break;
          case ErrorAmount.StandardDeviation:
            this._paddings.push({
              plus: this._errorValue * p,
              minus: this._errorValue * p,
            });
            break;
          case ErrorAmount.StandardError:
            this._paddings.push({
              plus: this._errorValue,
              minus: this._errorValue,
            });
        }
        (isNaN(o) || o > l - h.minus) && (o = l - h.minus),
          (isNaN(s) || s < l + h.plus) && (s = l + h.plus);
      }
      switch (i) {
        case ErrorAmount.FixedValue:
          (n = p), (a = p);
          break;
        case ErrorAmount.Percentage:
          (n = o * p), (a = s * p);
          break;
        case ErrorAmount.StandardDeviation:
          (n = this._errorValue * p), (a = this._errorValue * p);
          break;
        case ErrorAmount.StandardError:
          (n = this._errorValue), (a = this._errorValue);
      }
      return (
        this._showPlus && (s += a),
        this._showMinus && (o -= n),
        new wjcCore.Rect(t.left, o, t.width, s - o)
      );
    }),
    (e.prototype._getCustomValue = function (t) {
      var e,
        r = this.value,
        i = { minus: 0, plus: 0 };
      return null != this._minusBindingValues || null != this._plusBindingValues
        ? ((i.minus =
            (this._minusBindingValues && this._minusBindingValues[t]) || 0),
          (i.plus =
            (this._plusBindingValues && this._plusBindingValues[t]) || 0),
          i)
        : null == r
        ? i
        : (wjcCore.isArray(r)
            ? ((e = r[t]) && e.minus && (i.minus = e.minus),
              e && e.plus && (i.plus = e.plus))
            : wjcCore.isNumber(r)
            ? ((i.minus = r), (i.plus = r))
            : (r.minus && (i.minus = r.minus), r.plus && (i.plus = r.plus)),
          i);
    }),
    (e.prototype._calculateErrorValue = function () {
      var t = 0,
        e = 0,
        r = 0;
      if (
        this._errorAmount === ErrorAmount.StandardDeviation ||
        this._errorAmount === ErrorAmount.StandardError
      ) {
        var i = this.getValues(0);
        null != i &&
          (i.forEach(function (r) {
            (t += r), e++;
          }),
          (r = t / e),
          (this._mean = r),
          (t = 0),
          i.forEach(function (e) {
            t += Math.pow(e - r, 2);
          }),
          (this._errorValue = Math.sqrt(t / (e - 1)))),
          this._errorAmount == ErrorAmount.StandardError &&
            (this._errorValue = this._errorValue / Math.sqrt(e));
      }
    }),
    (e.prototype._clearValues = function () {
      (this.__errorValue = null),
        (this._mean = null),
        (this._plusBindingValues = null),
        (this._minusBindingValues = null),
        t.prototype._clearValues.call(this);
    }),
    (e.prototype.getValues = function (e) {
      if (0 == e && this.errorAmount === ErrorAmount.Custom) {
        var r = this._getBinding(1),
          i = this._getBinding(2);
        if (
          (null == this._plusBindingValues ||
            null == this._minusBindingValues) &&
          r &&
          i
        )
          if (null != this._cv) {
            if (r) {
              n = this._bindValues(this._cv.items, r);
              this._plusBindingValues = n.values;
            }
            if (i) {
              a = this._bindValues(this._cv.items, i);
              this._minusBindingValues = a.values;
            }
          } else if (
            null != this.binding &&
            null != this._chart &&
            null != this._chart.collectionView
          ) {
            if (r) {
              var n = this._bindValues(this._chart.collectionView.items, r);
              this._plusBindingValues = n.values;
            }
            if (i) {
              var a = this._bindValues(this._chart.collectionView.items, i);
              this._minusBindingValues = a.values;
            }
          }
      }
      return t.prototype.getValues.call(this, e);
    }),
    Object.defineProperty(e.prototype, '_chart', {
      get: function () {
        return this.__chart;
      },
      set: function (t) {
        t !== this.__chart && (this.__chart = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_errorValue', {
      get: function () {
        return this.__errorValue;
      },
      set: function (t) {
        t != this.__errorValue && (this.__errorValue = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_showPlus', {
      get: function () {
        return (
          this.direction === ErrorBarDirection.Both ||
          this.direction === ErrorBarDirection.Plus
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_showMinus', {
      get: function () {
        return (
          this.direction === ErrorBarDirection.Both ||
          this.direction === ErrorBarDirection.Minus
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._rendering = function (t, e) {
      var r = this;
      e.cancel = !0;
      var i = this.chart,
        n = this._getAxisY(),
        a = this._getAxisX(),
        o = (n.origin, e.engine);
      this._plotter.plotSeries(
        o,
        a,
        n,
        this,
        i,
        e.index,
        e.count,
        function (t) {
          var e,
            s,
            u,
            l = r._paddings,
            c = r._showPlus,
            h = r._showMinus,
            p = i._isRotated(),
            f = (r.errorBarStyle && r.errorBarStyle['stroke-width']) || 2;
          (u = (s = p ? a : n).actualMax), (e = s.convert(u));
          var _ = o.stroke,
            m = o.strokeWidth;
          (o.stroke = 'black'),
            (o.strokeWidth = 1),
            t &&
              t.length &&
              t.forEach(function (t, i) {
                if (null != t.x && null != t.y) {
                  var n = l[i],
                    a = (n && n.minus) || 0,
                    _ = (n && n.plus) || 0,
                    m = Math.abs(s.convert(u - a) - e),
                    d = Math.abs(s.convert(u + _) - e),
                    y = new wjcCore.Point(t.x, t.y),
                    g = new wjcCore.Point(t.x, t.y);
                  p
                    ? (r.errorAmount === ErrorAmount.StandardDeviation &&
                        ((t = new wjcCore.Point(s.convert(r._mean), t.y)),
                        (y.x = t.x),
                        (g.x = t.x)),
                      h && (y.x = y.x - m),
                      c && (g.x = g.x + d))
                    : (r.errorAmount === ErrorAmount.StandardDeviation &&
                        ((t = new wjcCore.Point(t.x, s.convert(r._mean))),
                        (y.y = t.y),
                        (g.y = t.y)),
                      h && (y.y = y.y + m),
                      c && (g.y = g.y - d)),
                    o.drawLine(
                      y.x,
                      y.y,
                      g.x,
                      g.y,
                      'error-bar',
                      r.errorBarStyle
                    ),
                    r.endStyle === ErrorBarEndStyle.Cap &&
                      (c &&
                        (p
                          ? o.drawLine(
                              g.x,
                              g.y - f,
                              g.x,
                              g.y + f,
                              'error-bar',
                              r.errorBarStyle
                            )
                          : o.drawLine(
                              g.x - f,
                              g.y,
                              g.x + f,
                              g.y,
                              'error-bar',
                              r.errorBarStyle
                            )),
                      h &&
                        (p
                          ? o.drawLine(
                              y.x,
                              y.y - f,
                              y.x,
                              y.y + f,
                              'error-bar',
                              r.errorBarStyle
                            )
                          : o.drawLine(
                              y.x - f,
                              y.y,
                              y.x + f,
                              y.y,
                              'error-bar',
                              r.errorBarStyle
                            )));
                }
              }),
            (o.stroke = _),
            (o.strokeWidth = m);
        }
      );
    }),
    e
  );
})(wjcChart.Series);
exports.ErrorBar = ErrorBar;
