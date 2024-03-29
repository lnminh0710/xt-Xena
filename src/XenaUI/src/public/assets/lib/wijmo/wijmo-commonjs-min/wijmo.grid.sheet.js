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
        for (var o in t) t.hasOwnProperty(o) && (e[o] = t[o]);
      };
    return function (t, o) {
      function n() {
        this.constructor = t;
      }
      e(t, o),
        (t.prototype =
          null === o
            ? Object.create(o)
            : ((n.prototype = o.prototype), new n()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcXlsx = require('wijmo/wijmo.xlsx'),
  wjcGrid = require('wijmo/wijmo.grid'),
  wjcInput = require('wijmo/wijmo.input'),
  wjcGridFilter = require('wijmo/wijmo.grid.filter'),
  wjcGridXlsx = require('wijmo/wijmo.grid.xlsx'),
  wjcSelf = require('wijmo/wijmo.grid.sheet');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.grid = window.wijmo.grid || {}),
  (window.wijmo.grid.sheet = wjcSelf);
var _CalcEngine = (function () {
  function e(e) {
    (this._expressionCache = {}),
      (this._idChars = '$:!'),
      (this._functionTable = {}),
      (this._cacheSize = 0),
      (this._tableRefStart = !1),
      (this.unknownFunction = new wjcCore.Event()),
      (this._owner = e),
      this._buildSymbolTable(),
      this._registerAggregateFunction(),
      this._registerMathFunction(),
      this._registerLogicalFunction(),
      this._registerTextFunction(),
      this._registerDateFunction(),
      this._registLookUpReferenceFunction(),
      this._registFinacialFunction();
  }
  return (
    (e.prototype.onUnknownFunction = function (e, t) {
      var o, n;
      if (t && t.length > 0) {
        o = [];
        for (var i = 0; i < t.length; i++)
          o[i] = t[i].evaluate(this._rowIndex, this._columnIndex);
      }
      if (
        ((n = new UnknownFunctionEventArgs(e, o)),
        this.unknownFunction.raise(this, n),
        null != n.value)
      )
        return new _Expression(n.value);
      throw 'The function "' + e + '" has not supported in FlexSheet yet.';
    }),
    (e.prototype.evaluate = function (e, t, o, n, i) {
      var r;
      try {
        if (e && e.length > 1 && '=' === e[0]) {
          for (
            this._containsCellRef = !1,
              this._rowIndex = n,
              this._columnIndex = i,
              r = this._checkCache(e).evaluate(n, i, o);
            r instanceof _Expression;

          )
            r = r.evaluate(n, i, o);
          return t && wjcCore.isPrimitive(r)
            ? wjcCore.Globalize.format(r, t)
            : r;
        }
        return e || '';
      } catch (e) {
        return 'Error: ' + e;
      }
    }),
    (e.prototype.addCustomFunction = function (e, t, o, n) {
      var i = this;
      (e = e.toLowerCase()),
        (this._functionTable[e] = new _FunctionDefinition(
          function (e) {
            var o,
              n = [];
            if (e.length > 0)
              for (var r = 0; r < e.length; r++)
                (o = e[r]),
                  (n[r] =
                    o instanceof _CellRangeExpression
                      ? o.cells
                      : o.evaluate(i._rowIndex, i._columnIndex));
            return t.apply(i, n);
          },
          n,
          o
        ));
    }),
    (e.prototype.addFunction = function (e, t, o, n) {
      var i = this;
      (e = e.toLowerCase()),
        (this._functionTable[e] = new _FunctionDefinition(
          function (e) {
            var o,
              n = [];
            if (e.length > 0)
              for (var r = 0; r < e.length; r++)
                (o = e[r]),
                  (n[r] =
                    o instanceof _CellRangeExpression
                      ? o.getValuseWithTwoDimensions()
                      : [[o.evaluate(i._rowIndex, i._columnIndex)]]);
            return t.apply(i, n);
          },
          n,
          o
        ));
    }),
    (e.prototype._clearExpressionCache = function () {
      (this._expressionCache = null),
        (this._expressionCache = {}),
        (this._cacheSize = 0);
    }),
    (e.prototype._parse = function (e) {
      return (
        (this._expression = e),
        (this._expressLength = e ? e.length : 0),
        (this._pointer = 0),
        this._expressLength > 0 &&
          '=' === this._expression[0] &&
          this._pointer++,
        this._parseExpression()
      );
    }),
    (e.prototype._buildSymbolTable = function () {
      this._tokenTable ||
        ((this._tokenTable = {}),
        this._addToken('+', _TokenID.ADD, _TokenType.ADDSUB),
        this._addToken('-', _TokenID.SUB, _TokenType.ADDSUB),
        this._addToken('(', _TokenID.OPEN, _TokenType.GROUP),
        this._addToken(')', _TokenID.CLOSE, _TokenType.GROUP),
        this._addToken('*', _TokenID.MUL, _TokenType.MULDIV),
        this._addToken(',', _TokenID.COMMA, _TokenType.GROUP),
        this._addToken('.', _TokenID.PERIOD, _TokenType.GROUP),
        this._addToken('/', _TokenID.DIV, _TokenType.MULDIV),
        this._addToken('\\', _TokenID.DIVINT, _TokenType.MULDIV),
        this._addToken('=', _TokenID.EQ, _TokenType.COMPARE),
        this._addToken('>', _TokenID.GT, _TokenType.COMPARE),
        this._addToken('<', _TokenID.LT, _TokenType.COMPARE),
        this._addToken('^', _TokenID.POWER, _TokenType.POWER),
        this._addToken('<>', _TokenID.NE, _TokenType.COMPARE),
        this._addToken('>=', _TokenID.GE, _TokenType.COMPARE),
        this._addToken('<=', _TokenID.LE, _TokenType.COMPARE),
        this._addToken('&', _TokenID.CONCAT, _TokenType.CONCAT),
        this._addToken('[', _TokenID.OPEN, _TokenType.SQUAREBRACKETS),
        this._addToken(']', _TokenID.CLOSE, _TokenType.SQUAREBRACKETS));
    }),
    (e.prototype._registerAggregateFunction = function () {
      var e = this;
      (e._functionTable.sum = new _FunctionDefinition(function (t, o) {
        return e._getAggregateResult(wjcCore.Aggregate.Sum, t, o);
      })),
        (e._functionTable.average = new _FunctionDefinition(function (t, o) {
          return e._getAggregateResult(wjcCore.Aggregate.Avg, t, o);
        })),
        (e._functionTable.max = new _FunctionDefinition(function (t, o) {
          return e._getAggregateResult(wjcCore.Aggregate.Max, t, o);
        })),
        (e._functionTable.min = new _FunctionDefinition(function (t, o) {
          return e._getAggregateResult(wjcCore.Aggregate.Min, t, o);
        })),
        (e._functionTable.var = new _FunctionDefinition(function (t, o) {
          return e._getAggregateResult(wjcCore.Aggregate.Var, t, o);
        })),
        (e._functionTable.varp = new _FunctionDefinition(function (t, o) {
          return e._getAggregateResult(wjcCore.Aggregate.VarPop, t, o);
        })),
        (e._functionTable.stdev = new _FunctionDefinition(function (t, o) {
          return e._getAggregateResult(wjcCore.Aggregate.Std, t, o);
        })),
        (e._functionTable.stdevp = new _FunctionDefinition(function (t, o) {
          return e._getAggregateResult(wjcCore.Aggregate.StdPop, t, o);
        })),
        (e._functionTable.count = new _FunctionDefinition(function (t, o) {
          return e._getFlexSheetAggregateResult(
            _FlexSheetAggregate.Count,
            t,
            o
          );
        })),
        (e._functionTable.counta = new _FunctionDefinition(function (t, o) {
          return e._getFlexSheetAggregateResult(
            _FlexSheetAggregate.CountA,
            t,
            o
          );
        })),
        (e._functionTable.countblank = new _FunctionDefinition(function (t, o) {
          return e._getFlexSheetAggregateResult(
            _FlexSheetAggregate.ConutBlank,
            t,
            o
          );
        })),
        (e._functionTable.countif = new _FunctionDefinition(
          function (t, o) {
            return e._getFlexSheetAggregateResult(
              _FlexSheetAggregate.CountIf,
              t,
              o
            );
          },
          2,
          2
        )),
        (e._functionTable.countifs = new _FunctionDefinition(
          function (t, o) {
            return e._getFlexSheetAggregateResult(
              _FlexSheetAggregate.CountIfs,
              t,
              o
            );
          },
          254,
          2
        )),
        (e._functionTable.sumif = new _FunctionDefinition(
          function (t, o) {
            return e._getFlexSheetAggregateResult(
              _FlexSheetAggregate.SumIf,
              t,
              o
            );
          },
          3,
          2
        )),
        (e._functionTable.sumifs = new _FunctionDefinition(
          function (t, o) {
            return e._getFlexSheetAggregateResult(
              _FlexSheetAggregate.SumIfs,
              t,
              o
            );
          },
          255,
          2
        )),
        (e._functionTable.rank = new _FunctionDefinition(
          function (t, o) {
            return e._getFlexSheetAggregateResult(
              _FlexSheetAggregate.Rank,
              t,
              o
            );
          },
          3,
          2
        )),
        (e._functionTable.product = new _FunctionDefinition(
          function (t, o) {
            return e._getFlexSheetAggregateResult(
              _FlexSheetAggregate.Product,
              t,
              o
            );
          },
          255,
          1
        )),
        (e._functionTable.subtotal = new _FunctionDefinition(
          function (t, o) {
            return e._handleSubtotal(t, o);
          },
          255,
          2
        )),
        (e._functionTable.dcount = new _FunctionDefinition(
          function (t, o) {
            return e._handleDCount(t, o);
          },
          3,
          3
        )),
        (e._functionTable.sumproduct = new _FunctionDefinition(
          function (t, o) {
            return e._getSumProduct(t, o);
          },
          255,
          1
        ));
    }),
    (e.prototype._registerMathFunction = function () {
      var e = this,
        t = [
          'abs',
          'acos',
          'asin',
          'atan',
          'cos',
          'exp',
          'ln',
          'sin',
          'sqrt',
          'tan',
        ],
        o = ['ceiling', 'floor'],
        n = ['round', 'rounddown', 'roundup'];
      (e._functionTable.pi = new _FunctionDefinition(
        function () {
          return Math.PI;
        },
        0,
        0
      )),
        (e._functionTable.rand = new _FunctionDefinition(
          function () {
            return Math.random();
          },
          0,
          0
        )),
        (e._functionTable.power = new _FunctionDefinition(
          function (t, o) {
            return Math.pow(
              _Expression.toNumber(t[0], e._rowIndex, e._columnIndex, o),
              _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o)
            );
          },
          2,
          2
        )),
        (e._functionTable.atan2 = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toNumber(t[0], e._rowIndex, e._columnIndex, o),
              i = _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o);
            if (0 === n && 0 === i)
              throw "The x number and y number can't both be zero for the atan2 function";
            return Math.atan2(i, n);
          },
          2,
          2
        )),
        (e._functionTable.mod = new _FunctionDefinition(
          function (t, o) {
            return (
              _Expression.toNumber(t[0], e._rowIndex, e._columnIndex, o) %
              _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o)
            );
          },
          2,
          2
        )),
        (e._functionTable.trunc = new _FunctionDefinition(
          function (t, o) {
            var n,
              i = _Expression.toNumber(t[0], e._rowIndex, e._columnIndex, o),
              r =
                2 === t.length
                  ? _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o)
                  : 0;
            return 0 === r
              ? i >= 0
                ? Math.floor(i)
                : Math.ceil(i)
              : ((n = Math.pow(10, r)),
                i >= 0 ? Math.floor(i * n) / n : Math.ceil(i * n) / n);
          },
          2,
          1
        )),
        o.forEach(function (t) {
          e._functionTable[t] = new _FunctionDefinition(
            function (o, n) {
              var i,
                r,
                l,
                s = _Expression.toNumber(o[0], e._rowIndex, e._columnIndex, n),
                a =
                  2 === o.length
                    ? _Expression.toNumber(o[1], e._rowIndex, e._columnIndex, n)
                    : 1;
              if (isNaN(s)) throw 'Invalid Number!';
              if (isNaN(a)) throw 'Invalid Significance!';
              if (s > 0 && a < 0)
                throw 'The significance has to be positive, if the number is positive.';
              if (0 === s || 0 === a) return 0;
              if (((i = a - Math.floor(a)), (r = 1), 0 !== i))
                for (; i < 1; ) (r *= 10), (i *= 10);
              return (
                (l = 'ceiling' === t ? Math.ceil(s / a) : Math.floor(s / a)),
                (a * r * l) / r
              );
            },
            2,
            1
          );
        }),
        n.forEach(function (t) {
          e._functionTable[t] = new _FunctionDefinition(
            function (o, n) {
              var i,
                r,
                l,
                s = _Expression.toNumber(o[0], e._rowIndex, e._columnIndex, n),
                a = _Expression.toNumber(o[1], e._rowIndex, e._columnIndex, n);
              if (0 === a) {
                switch (t) {
                  case 'rounddown':
                    i = s >= 0 ? Math.floor(s) : Math.ceil(s);
                    break;
                  case 'roundup':
                    i = s >= 0 ? Math.ceil(s) : Math.floor(s);
                    break;
                  case 'round':
                    i = Math.round(s);
                    break;
                  default:
                    i = Math.floor(s);
                }
                r = 'n0';
              } else if (a > 0 && wjcCore.isInt(a)) {
                switch (((l = Math.pow(10, a)), t)) {
                  case 'rounddown':
                    i = s >= 0 ? Math.floor(s * l) / l : Math.ceil(s * l) / l;
                    break;
                  case 'roundup':
                    i = s >= 0 ? Math.ceil(s * l) / l : Math.floor(s * l) / l;
                    break;
                  case 'round':
                    i = Math.round(s * l) / l;
                }
                r = 'n' + a;
              }
              if (null != i) return { value: i, format: r };
              throw 'Invalid precision!';
            },
            2,
            2
          );
        }),
        t.forEach(function (t) {
          e._functionTable[t] = new _FunctionDefinition(
            function (o, n) {
              return 'ln' === t
                ? Math.log(
                    _Expression.toNumber(o[0], e._rowIndex, e._columnIndex, n)
                  )
                : Math[t](
                    _Expression.toNumber(o[0], e._rowIndex, e._columnIndex, n)
                  );
            },
            1,
            1
          );
        });
    }),
    (e.prototype._registerLogicalFunction = function () {
      var e = this;
      (e._functionTable.and = new _FunctionDefinition(
        function (t, o) {
          var n,
            i = !0;
          for (
            n = 0;
            n < t.length &&
            (i =
              i && _Expression.toBoolean(t[n], e._rowIndex, e._columnIndex, o));
            n++
          );
          return i;
        },
        Number.MAX_VALUE,
        1
      )),
        (e._functionTable.or = new _FunctionDefinition(
          function (t, o) {
            var n,
              i = !1;
            for (
              n = 0;
              n < t.length &&
              !(i =
                i ||
                _Expression.toBoolean(t[n], e._rowIndex, e._columnIndex, o));
              n++
            );
            return i;
          },
          Number.MAX_VALUE,
          1
        )),
        (e._functionTable.not = new _FunctionDefinition(
          function (t, o) {
            return !_Expression.toBoolean(t[0], e._rowIndex, e._columnIndex, o);
          },
          1,
          1
        )),
        (e._functionTable.if = new _FunctionDefinition(
          function (t, o) {
            return 3 === t.length
              ? _Expression.toBoolean(t[0], e._rowIndex, e._columnIndex, o)
                ? t[1].evaluate(e._rowIndex, e._columnIndex, o)
                : t[2].evaluate(e._rowIndex, e._columnIndex, o)
              : !!_Expression.toBoolean(t[0], e._rowIndex, e._columnIndex, o) &&
                  t[1].evaluate(e._rowIndex, e._columnIndex, o);
          },
          3,
          2
        )),
        (e._functionTable.true = new _FunctionDefinition(
          function () {
            return !0;
          },
          0,
          0
        )),
        (e._functionTable.false = new _FunctionDefinition(
          function () {
            return !1;
          },
          0,
          0
        ));
    }),
    (e.prototype._registerTextFunction = function () {
      var e = this;
      (e._functionTable.char = new _FunctionDefinition(
        function (t, o) {
          var n,
            i = '';
          for (n = 0; n < t.length; n++)
            i += String.fromCharCode(
              _Expression.toNumber(t[n], e._rowIndex, e._columnIndex, o)
            );
          return i;
        },
        Number.MAX_VALUE,
        1
      )),
        (e._functionTable.code = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o);
            return n && n.length > 0 ? n.charCodeAt(0) : -1;
          },
          1,
          1
        )),
        (e._functionTable.concatenate = new _FunctionDefinition(
          function (t, o) {
            var n,
              i = '';
            for (n = 0; n < t.length; n++)
              i = i.concat(
                _Expression.toString(t[n], e._rowIndex, e._columnIndex, o)
              );
            return i;
          },
          Number.MAX_VALUE,
          1
        )),
        (e._functionTable.left = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o),
              i = Math.floor(
                _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o)
              );
            return n && n.length > 0 ? n.slice(0, i) : null;
          },
          2,
          2
        )),
        (e._functionTable.right = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o),
              i = Math.floor(
                _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o)
              );
            return n && n.length > 0 ? n.slice(-i) : null;
          },
          2,
          2
        )),
        (e._functionTable.find = new _FunctionDefinition(
          function (t, o) {
            var n,
              i = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o),
              r = _Expression.toString(t[1], e._rowIndex, e._columnIndex, o),
              l =
                null != t[2]
                  ? wjcCore.asInt(
                      _Expression.toNumber(t[2], e._rowIndex, e._columnIndex, o)
                    )
                  : 0;
            return null != r &&
              null != i &&
              (n =
                !isNaN(l) && l > 0 && l < r.length
                  ? r.indexOf(i, l)
                  : r.indexOf(i)) > -1
              ? n + 1
              : -1;
          },
          3,
          2
        )),
        (e._functionTable.search = new _FunctionDefinition(
          function (t, o) {
            var n,
              i,
              r,
              l = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o),
              s = _Expression.toString(t[1], e._rowIndex, e._columnIndex, o),
              a =
                null != t[2]
                  ? wjcCore.asInt(
                      _Expression.toNumber(t[2], e._rowIndex, e._columnIndex, o)
                    )
                  : 0;
            return null != s &&
              null != l &&
              ((i = new RegExp(l, 'i')),
              !isNaN(a) && a > 0 && a < s.length
                ? ((s = s.substring(a)), (n = a + 1))
                : (n = 1),
              (r = s.search(i)) > -1)
              ? r + n
              : -1;
          },
          3,
          2
        )),
        (e._functionTable.len = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o);
            return n ? n.length : -1;
          },
          1,
          1
        )),
        (e._functionTable.mid = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o),
              i = Math.floor(
                _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o)
              ),
              r = Math.floor(
                _Expression.toNumber(t[2], e._rowIndex, e._columnIndex, o)
              );
            return n && n.length > 0 && i > 0 ? n.substr(i - 1, r) : null;
          },
          3,
          3
        )),
        (e._functionTable.lower = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o);
            return n && n.length > 0 ? n.toLowerCase() : null;
          },
          1,
          1
        )),
        (e._functionTable.upper = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o);
            return n && n.length > 0 ? n.toUpperCase() : null;
          },
          1,
          1
        )),
        (e._functionTable.proper = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o);
            return n && n.length > 0
              ? n[0].toUpperCase() + n.substring(1).toLowerCase()
              : null;
          },
          1,
          1
        )),
        (e._functionTable.trim = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o);
            return n && n.length > 0 ? n.trim() : null;
          },
          1,
          1
        )),
        (e._functionTable.replace = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o),
              i = Math.floor(
                _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o)
              ),
              r = Math.floor(
                _Expression.toNumber(t[2], e._rowIndex, e._columnIndex, o)
              ),
              l = _Expression.toString(t[3], e._rowIndex, e._columnIndex, o);
            return n && n.length > 0 && i > 0
              ? n.substring(0, i - 1) + l + n.slice(i - 1 + r)
              : null;
          },
          4,
          4
        )),
        (e._functionTable.substitute = new _FunctionDefinition(
          function (t, o) {
            var n,
              i = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o),
              r = _Expression.toString(t[1], e._rowIndex, e._columnIndex, o),
              l = _Expression.toString(t[2], e._rowIndex, e._columnIndex, o),
              s =
                4 === t.length
                  ? _Expression.toNumber(t[3], e._rowIndex, e._columnIndex, o)
                  : null,
              a = 0;
            if ((null != s && s < 1) || isNaN(s))
              throw 'Invalid instance number.';
            return i && i.length > 0 && r && r.length > 0
              ? ((n = new RegExp(r, 'g')),
                i.replace(n, function (e) {
                  return (
                    a++, null != s ? ((s = Math.floor(s)), a === s ? l : e) : l
                  );
                }))
              : null;
          },
          4,
          3
        )),
        (e._functionTable.rept = new _FunctionDefinition(
          function (t, o) {
            var n,
              i = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o),
              r = Math.floor(
                _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o)
              ),
              l = '';
            if (i && i.length > 0 && r > 0)
              for (n = 0; n < r; n++) l = l.concat(i);
            return l;
          },
          2,
          2
        )),
        (e._functionTable.text = new _FunctionDefinition(
          function (t, o) {
            var n,
              i = t[0].evaluate(e._rowIndex, e._columnIndex, o),
              r = _Expression.toString(t[1], e._rowIndex, e._columnIndex, o);
            if (
              (!wjcCore.isPrimitive(i) && i && (i = i.value), wjcCore.isDate(i))
            )
              r = r
                .replace(/\[\$\-.+\]/g, '')
                .replace(/(\\)(.)/g, '$2')
                .replace(/H+/g, function (e) {
                  return e.toLowerCase();
                })
                .replace(/m+/g, function (e) {
                  return e.toUpperCase();
                })
                .replace(/S+/g, function (e) {
                  return e.toLowerCase();
                })
                .replace(/AM\/PM/gi, 'tt')
                .replace(/A\/P/gi, 't')
                .replace(/\.000/g, '.fff')
                .replace(/\.00/g, '.ff')
                .replace(/\.0/g, '.f')
                .replace(/\\[\-\s,]/g, function (e) {
                  return e.substring(1);
                })
                .replace(/Y+/g, function (e) {
                  return e.toLowerCase();
                })
                .replace(/D+/g, function (e) {
                  return e.toLowerCase();
                })
                .replace(/M+:?|:?M+/gi, function (e) {
                  return e.indexOf(':') > -1 ? e.toLowerCase() : e;
                })
                .replace(/g+e/gi, function (e) {
                  return e.substring(0, e.length - 1) + 'yy';
                });
            else {
              if (!wjcCore.isNumber(i)) return i;
              if (
                (n = r.match(/^(\d+)(\.\d+)?\E\+(\d+)(\.\d+)?$/)) &&
                5 === n.length
              )
                return e._parseToScientificValue(i, n[1], n[2], n[3], n[4]);
              /M{1,4}|d{1,4}|y{1,4}/.test(r)
                ? (i = new Date(1900, 0, i - 1))
                : r &&
                  r.indexOf('#') > -1 &&
                  (r = wjcXlsx.Workbook.fromXlsxFormat(r)[0]);
            }
            if (wjcCore.isDate(i))
              switch (r) {
                case 'd':
                  return i.getDate();
                case 'M':
                  return i.getMonth() + 1;
                case 'y':
                  r = 'yy';
                  break;
                case 'yyy':
                  r = 'yyyy';
              }
            return wjcCore.Globalize.format(i, r);
          },
          2,
          2
        )),
        (e._functionTable.value = new _FunctionDefinition(
          function (t, o) {
            var n,
              i = _Expression.toString(t[0], e._rowIndex, e._columnIndex, o);
            if (
              (i = i.replace(/(\,\d{3})/g, function (e) {
                return e.substring(1);
              })).length > 0
            ) {
              if (
                i[0] === wjcCore.culture.Globalize.numberFormat.currency.symbol
              )
                return +(i = i.substring(1));
              if ('%' === i[i.length - 1])
                return +(i = i.substring(0, i.length - 1)) / 100;
            }
            return (
              (n = +i),
              isNaN(n)
                ? _Expression.toNumber(t[0], e._rowIndex, e._columnIndex, o)
                : n
            );
          },
          1,
          1
        ));
    }),
    (e.prototype._registerDateFunction = function () {
      var e = this;
      (e._functionTable.now = new _FunctionDefinition(
        function () {
          return { value: new Date(), format: 'M/d/yyyy h:mm' };
        },
        0,
        0
      )),
        (e._functionTable.today = new _FunctionDefinition(
          function () {
            var e = new Date();
            return {
              value: new Date(e.getFullYear(), e.getMonth(), e.getDate()),
              format: 'd',
            };
          },
          0,
          0
        )),
        (e._functionTable.year = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toDate(t[0], e._rowIndex, e._columnIndex, o);
            return !wjcCore.isPrimitive(n) && n
              ? n.value
              : wjcCore.isDate(n)
              ? n.getFullYear()
              : 1900;
          },
          1,
          1
        )),
        (e._functionTable.month = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toDate(t[0], e._rowIndex, e._columnIndex, o);
            return !wjcCore.isPrimitive(n) && n
              ? n.value
              : wjcCore.isDate(n)
              ? n.getMonth() + 1
              : 1;
          },
          1,
          1
        )),
        (e._functionTable.day = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toDate(t[0], e._rowIndex, e._columnIndex, o);
            return !wjcCore.isPrimitive(n) && n
              ? n.value
              : wjcCore.isDate(n)
              ? n.getDate()
              : 0;
          },
          1,
          1
        )),
        (e._functionTable.hour = new _FunctionDefinition(
          function (t, o) {
            var n = t[0].evaluate(e._rowIndex, e._columnIndex, o);
            if (wjcCore.isNumber(n) && !isNaN(n))
              return Math.floor(24 * (n - Math.floor(n)));
            if (wjcCore.isDate(n)) return n.getHours();
            if (
              ((n = _Expression.toDate(t[0], e._rowIndex, e._columnIndex, o)),
              !wjcCore.isPrimitive(n) && n && (n = n.value),
              wjcCore.isDate(n))
            )
              return n.getHours();
            throw 'Invalid parameter.';
          },
          1,
          1
        )),
        (e._functionTable.time = new _FunctionDefinition(
          function (t, o) {
            var n = t[0].evaluate(e._rowIndex, e._columnIndex, o),
              i = t[1].evaluate(e._rowIndex, e._columnIndex, o),
              r = t[2].evaluate(e._rowIndex, e._columnIndex, o);
            if (
              wjcCore.isNumber(n) &&
              wjcCore.isNumber(i) &&
              wjcCore.isNumber(r)
            )
              return (
                (n %= 24),
                (i %= 60),
                (r %= 60),
                {
                  value: new Date(0, 0, 0, n, i, r),
                  format: 't',
                }
              );
            throw 'Invalid parameters.';
          },
          3,
          3
        )),
        (e._functionTable.date = new _FunctionDefinition(
          function (t, o) {
            var n = t[0].evaluate(e._rowIndex, e._columnIndex, o),
              i = t[1].evaluate(e._rowIndex, e._columnIndex, o),
              r = t[2].evaluate(e._rowIndex, e._columnIndex, o);
            if (
              wjcCore.isNumber(n) &&
              wjcCore.isNumber(i) &&
              wjcCore.isNumber(r)
            )
              return {
                value: new Date(n, i - 1, r),
                format: 'd',
              };
            throw 'Invalid parameters.';
          },
          3,
          3
        )),
        (e._functionTable.datedif = new _FunctionDefinition(
          function (t, o) {
            var n,
              i,
              r,
              l,
              s,
              a = _Expression.toDate(t[0], e._rowIndex, e._columnIndex, o),
              h = _Expression.toDate(t[1], e._rowIndex, e._columnIndex, o),
              c = t[2].evaluate(e._rowIndex, e._columnIndex, o);
            if (
              (!wjcCore.isPrimitive(a) && a && (a = a.value),
              !wjcCore.isPrimitive(h) && h && (h = h.value),
              wjcCore.isDate(a) && wjcCore.isDate(h) && wjcCore.isString(c))
            ) {
              if (((n = a.getTime()), (i = h.getTime()), n > i))
                throw 'Start date is later than end date.';
              switch (
                ((r = h.getDate() - a.getDate()),
                (l = h.getMonth() - a.getMonth()),
                (s = h.getFullYear() - a.getFullYear()),
                c.toUpperCase())
              ) {
                case 'Y':
                  return l > 0 ? s : l < 0 ? s - 1 : r >= 0 ? s : s - 1;
                case 'M':
                  return r >= 0 ? 12 * s + l : 12 * s + l - 1;
                case 'D':
                  return (i - n) / 864e5;
                case 'YM':
                  return (l = r >= 0 ? 12 * s + l : 12 * s + l - 1) % 12;
                case 'YD':
                  return l > 0
                    ? (new Date(
                        a.getFullYear(),
                        h.getMonth(),
                        h.getDate()
                      ).getTime() -
                        a.getTime()) /
                        864e5
                    : l < 0
                    ? (new Date(
                        a.getFullYear() + 1,
                        h.getMonth(),
                        h.getDate()
                      ).getTime() -
                        a.getTime()) /
                      864e5
                    : r >= 0
                    ? r
                    : (new Date(
                        a.getFullYear() + 1,
                        h.getMonth(),
                        h.getDate()
                      ).getTime() -
                        a.getTime()) /
                      864e5;
                case 'MD':
                  return r >= 0
                    ? r
                    : (r =
                        new Date(h.getFullYear(), h.getMonth(), 0).getDate() -
                        new Date(
                          h.getFullYear(),
                          h.getMonth() - 1,
                          1
                        ).getDate() +
                        1 +
                        r);
                default:
                  throw 'Invalid unit.';
              }
            }
            throw 'Invalid parameters.';
          },
          3,
          3
        ));
    }),
    (e.prototype._registLookUpReferenceFunction = function () {
      var e = this;
      (e._functionTable.column = new _FunctionDefinition(
        function (t, o, n, i) {
          var r;
          if (null == t) return i + 1;
          if (
            ((r = t[0]),
            (r = e._ensureNonFunctionExpression(r)) instanceof
              _CellRangeExpression)
          )
            return r.cells.col + 1;
          throw 'Invalid Cell Reference.';
        },
        1,
        0
      )),
        (e._functionTable.columns = new _FunctionDefinition(
          function (t, o) {
            var n = t[0];
            if (
              (n = e._ensureNonFunctionExpression(n)) instanceof
              _CellRangeExpression
            )
              return n.cells.columnSpan;
            throw 'Invalid Cell Reference.';
          },
          1,
          1
        )),
        (e._functionTable.row = new _FunctionDefinition(
          function (t, o, n, i) {
            var r;
            if (null == t) return n + 1;
            if (
              ((r = t[0]),
              (r = e._ensureNonFunctionExpression(r)) instanceof
                _CellRangeExpression)
            )
              return r.cells.row + 1;
            throw 'Invalid Cell Reference.';
          },
          1,
          0
        )),
        (e._functionTable.rows = new _FunctionDefinition(
          function (t, o) {
            var n = t[0];
            if (
              (n = e._ensureNonFunctionExpression(n)) instanceof
              _CellRangeExpression
            )
              return n.cells.rowSpan;
            throw 'Invalid Cell Reference.';
          },
          1,
          1
        )),
        (e._functionTable.choose = new _FunctionDefinition(
          function (t, o) {
            var n = _Expression.toNumber(t[0], e._rowIndex, e._columnIndex, o);
            if (isNaN(n)) throw 'Invalid index number.';
            if (n < 1 || n >= t.length)
              throw 'The index number is out of the list range.';
            return t[n].evaluate(e._rowIndex, e._columnIndex, o);
          },
          255,
          2
        )),
        (e._functionTable.index = new _FunctionDefinition(
          function (t, o) {
            var n,
              i = t[0],
              r = _Expression.toNumber(t[1], e._rowIndex, e._columnIndex, o),
              l =
                null != t[2]
                  ? _Expression.toNumber(t[2], e._rowIndex, e._columnIndex, o)
                  : 0;
            if (isNaN(r) || r < 0) throw 'Invalid Row Number.';
            if (isNaN(l) || l < 0) throw 'Invalid Column Number.';
            if (
              (i = e._ensureNonFunctionExpression(i)) instanceof
              _CellRangeExpression
            ) {
              if (((n = i.cells), r > n.rowSpan || l > n.columnSpan))
                throw 'Index is out of the cell range.';
              if (r > 0 && l > 0)
                return e._owner.getCellValue(
                  n.topRow + r - 1,
                  n.leftCol + l - 1,
                  !0,
                  o
                );
              if (0 === r && 0 === l) return i;
              if (0 === r)
                return new _CellRangeExpression(
                  new wjcGrid.CellRange(
                    n.topRow,
                    n.leftCol + l - 1,
                    n.bottomRow,
                    n.leftCol + l - 1
                  ),
                  i.sheetRef,
                  e._owner
                );
              if (0 === l)
                return new _CellRangeExpression(
                  new wjcGrid.CellRange(
                    n.topRow + r - 1,
                    n.leftCol,
                    n.topRow + r - 1,
                    n.rightCol
                  ),
                  i.sheetRef,
                  e._owner
                );
            }
            throw 'Invalid Cell Reference.';
          },
          4,
          2
        )),
        (e._functionTable.hlookup = new _FunctionDefinition(
          function (t, o) {
            return e._handleHLookup(t, o);
          },
          4,
          3
        ));
    }),
    (e.prototype._registFinacialFunction = function () {
      var e = this;
      e._functionTable.rate = new _FunctionDefinition(
        function (t, o) {
          return { value: e._calculateRate(t, o), format: 'p2' };
        },
        6,
        3
      );
    }),
    (e.prototype._addToken = function (e, t, o) {
      var n = new _Token(e, t, o);
      this._tokenTable[e] = n;
    }),
    (e.prototype._parseExpression = function () {
      return this._getToken(), this._parseCompareOrConcat();
    }),
    (e.prototype._parseCompareOrConcat = function () {
      for (
        var e, t, o = this._parseAddSub();
        this._token.tokenType === _TokenType.COMPARE ||
        this._token.tokenType === _TokenType.CONCAT;

      )
        (e = this._token),
          this._getToken(),
          (t = this._parseAddSub()),
          (o = new _BinaryExpression(e, o, t));
      return o;
    }),
    (e.prototype._parseAddSub = function () {
      for (
        var e, t, o = this._parseMulDiv();
        this._token.tokenType === _TokenType.ADDSUB;

      )
        (e = this._token),
          this._getToken(),
          (t = this._parseMulDiv()),
          (o = new _BinaryExpression(e, o, t));
      return o;
    }),
    (e.prototype._parseMulDiv = function () {
      for (
        var e, t, o = this._parsePower();
        this._token.tokenType === _TokenType.MULDIV;

      )
        (e = this._token),
          this._getToken(),
          (t = this._parsePower()),
          (o = new _BinaryExpression(e, o, t));
      return o;
    }),
    (e.prototype._parsePower = function () {
      for (
        var e, t, o = this._parseUnary();
        this._token.tokenType === _TokenType.POWER;

      )
        (e = this._token),
          this._getToken(),
          (t = this._parseUnary()),
          (o = new _BinaryExpression(e, o, t));
      return o;
    }),
    (e.prototype._parseUnary = function () {
      var e, t;
      return this._token.tokenID === _TokenID.ADD ||
        this._token.tokenID === _TokenID.SUB
        ? ((e = this._token),
          this._getToken(),
          (t = this._parseAtom()),
          new _UnaryExpression(e, t))
        : this._parseAtom();
    }),
    (e.prototype._parseAtom = function () {
      var e,
        t,
        o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c,
        d,
        u,
        _ = null;
      switch (this._token.tokenType) {
        case _TokenType.LITERAL:
          _ = new _Expression(this._token);
          break;
        case _TokenType.IDENTIFIER:
          if (
            ((e = this._token.value.toString().toLowerCase()),
            (t = this._functionTable[e]))
          ) {
            if (
              ((o = this._getParameters()),
              this._token.tokenType === _TokenType.GROUP &&
                this._token.tokenID === _TokenID.CLOSE)
            ) {
              if (((n = o ? o.length : 0), -1 !== t.paramMin && n < t.paramMin))
                throw 'Too few parameters.';
              if (-1 !== t.paramMax && n > t.paramMax)
                throw 'Too many parameters.';
              'rand' === e && (this._containsCellRef = !0),
                (_ = new _FunctionExpression(t, o));
              break;
            }
            if ('true' === e || 'false' === e) {
              _ = new _FunctionExpression(t, o, !1);
              break;
            }
          }
          if (
            (2 === (h = e.split('!')).length
              ? ((d = h[0]), (c = h[1]))
              : (c = h[0]),
            (r = this._getDefinedName(
              c,
              d || this._owner.selectedSheet.name.toLowerCase()
            )))
          ) {
            if (
              r.sheetName &&
              r.sheetName !== this._owner.selectedSheet.name &&
              r.sheetName.toLowerCase() !== d
            )
              throw (
                'The defined name item works in ' +
                r.sheetName +
                '.  It does not work in current sheet.'
              );
            (a = this._pointer),
              (s = this._expressLength),
              (l = this._expression),
              (this._pointer = 0),
              (_ = this._checkCache(r.value)),
              (this._pointer = a),
              (this._expressLength = s),
              (this._expression = l);
            break;
          }
          if (((d = ''), null != (u = this._owner._getTable(e)))) {
            if ('' === (d = this._getTableRelatedSheet(e)))
              throw 'The Table(' + e + ') is not located in any sheet.';
            if (
              (this._getToken(),
              this._token.tokenType !== _TokenType.SQUAREBRACKETS ||
                this._token.tokenID !== _TokenID.OPEN)
            )
              throw 'Invalid Table Reference.';
            (this._tableRefStart = !0), (_ = this._getTableReference(u, d));
            break;
          }
          if ((i = this._getCellRange(e))) {
            (this._containsCellRef = !0),
              (_ = new _CellRangeExpression(
                i.cellRange,
                i.sheetRef,
                this._owner
              ));
            break;
          }
          (o = this._getParameters()), (_ = this.onUnknownFunction(e, o));
          break;
        case _TokenType.GROUP:
          if (this._token.tokenID !== _TokenID.OPEN)
            throw 'Expression expected.';
          if (
            (this._getToken(),
            (_ = this._parseCompareOrConcat()),
            this._token.tokenID !== _TokenID.CLOSE)
          )
            throw 'Unbalanced parenthesis.';
          break;
        case _TokenType.SQUAREBRACKETS:
          if (this._token.tokenID !== _TokenID.OPEN)
            throw 'Table References expected.';
          null !=
            (u = this._owner.selectedSheet.findTable(
              this._rowIndex,
              this._columnIndex
            )) &&
            ((d = this._getTableRelatedSheet(u.name.toLowerCase())),
            (this._tableRefStart = !0),
            (_ = this._getTableReference(u, d)));
      }
      if (null === _) throw '';
      return this._getToken(), _;
    }),
    (e.prototype._getToken = function () {
      for (
        var e,
          t,
          o,
          n,
          i,
          r = '',
          l = '',
          s = new RegExp('[　-〿぀-ゟ゠-ヿ＀-ﾟ一-龯㐀-䶿]');
        this._pointer < this._expressLength &&
        ' ' === this._expression[this._pointer];

      )
        this._pointer++;
      if (this._pointer >= this._expressLength)
        this._token = new _Token(null, _TokenID.END, _TokenType.GROUP);
      else {
        if (
          ((t = this._expression[this._pointer]),
          (n = (t >= 'a' && t <= 'z') || (t >= 'A' && t <= 'Z') || s.test(t)),
          (i = (t >= '0' && t <= '9') || '.' == t),
          !n && !i)
        ) {
          var a = this._tokenTable[t];
          if (a)
            return (
              (this._token = a),
              this._pointer++,
              void (
                this._pointer < this._expressLength &&
                ('>' === t || '<' === t) &&
                (a =
                  this._tokenTable[
                    this._expression.substring(
                      this._pointer - 1,
                      this._pointer + 1
                    )
                  ]) &&
                ((this._token = a), this._pointer++)
              )
            );
        }
        if (i) this._parseDigit();
        else if ('"' !== t) {
          if ("'" !== t || (l = this._parseSheetRef()))
            if ('#' !== t) {
              if (!n && '_' !== t && this._idChars.indexOf(t) < 0 && !l)
                throw 'Identifier expected.';
              for (e = 1; e + this._pointer < this._expressLength; e++)
                if (
                  ((t = this._expression[this._pointer + e]),
                  (n =
                    (t >= 'a' && t <= 'z') ||
                    (t >= 'A' && t <= 'Z') ||
                    s.test(t)),
                  (i = t >= '0' && t <= '9'),
                  "'" !== t || ':' !== o)
                ) {
                  if (
                    ((o = t),
                    !n && !i && '_' !== t && this._idChars.indexOf(t) < 0)
                  )
                    break;
                } else
                  (r =
                    l +
                    this._expression.substring(
                      this._pointer,
                      this._pointer + e
                    )),
                    (this._pointer += e),
                    (l = this._parseSheetRef()),
                    (e = 0);
              (r +=
                l +
                this._expression.substring(this._pointer, this._pointer + e)),
                (this._pointer += e),
                (this._token = new _Token(
                  r,
                  _TokenID.ATOM,
                  _TokenType.IDENTIFIER
                ));
            } else this._parseDate();
        } else this._parseString();
      }
    }),
    (e.prototype._getTableToken = function () {
      for (
        var e, t, o, n = !1;
        this._pointer < this._expressLength &&
        ' ' === this._expression[this._pointer];

      )
        this._pointer++;
      for (
        '[' === (t = this._expression[this._pointer]) && (n = !0), e = 1;
        e + this._pointer < this._expressLength;
        e++
      ) {
        if (((t = this._expression[this._pointer + e]), n && ',' === t))
          throw 'Invalid table reference.';
        if (',' === t || ']' === t) break;
      }
      (o = this._expression.substring(
        this._pointer + (n ? 1 : 0),
        this._pointer + e
      )),
        (this._pointer += e + (n ? 1 : 0)),
        (this._token = new _Token(o, _TokenID.ATOM, _TokenType.IDENTIFIER));
    }),
    (e.prototype._parseDigit = function () {
      var e,
        t,
        o = -1,
        n = !1,
        i = !1,
        r = 0;
      for (e = 0; e + this._pointer < this._expressLength; e++)
        if ((t = this._expression[this._pointer + e]) >= '0' && t <= '9')
          (r = 10 * r + (+t - 0)), o > -1 && (o *= 10);
        else if ('.' === t && o < 0) o = 1;
        else {
          if (('E' !== t && 'e' !== t) || n) {
            if ('%' === t) {
              (i = !0), e++;
              break;
            }
            break;
          }
          (n = !0),
            ('+' !== (t = this._expression[this._pointer + e + 1]) &&
              '-' !== t) ||
              e++;
        }
      n
        ? (r = +this._expression.substring(this._pointer, this._pointer + e))
        : (o > 1 && (r /= o), i && (r /= 100)),
        (this._token = new _Token(r, _TokenID.ATOM, _TokenType.LITERAL)),
        (this._pointer += e);
    }),
    (e.prototype._parseString = function () {
      var e, t, o;
      for (e = 1; e + this._pointer < this._expressLength; e++)
        if ('"' === (t = this._expression[this._pointer + e])) {
          if (
            '"' !==
            (e + this._pointer < this._expressLength - 1
              ? this._expression[this._pointer + e + 1]
              : ' ')
          )
            break;
          e++;
        }
      if ('"' !== t) throw "Can't find final quote.";
      if (
        ((o = this._expression.substring(this._pointer + 1, this._pointer + e)),
        (this._pointer += e + 1),
        '!' === this._expression[this._pointer])
      )
        throw 'Illegal cross sheet reference.';
      this._token = new _Token(
        o.replace('""', '"'),
        _TokenID.ATOM,
        _TokenType.LITERAL
      );
    }),
    (e.prototype._parseDate = function () {
      var e, t, o;
      for (
        e = 1;
        e + this._pointer < this._expressLength &&
        '#' !== (t = this._expression[this._pointer + e]);
        e++
      );
      if ('#' !== t) throw 'Can\'t find final date delimiter ("#").';
      (o = this._expression.substring(this._pointer + 1, this._pointer + e)),
        (this._pointer += e + 1),
        (this._token = new _Token(
          Date.parse(o),
          _TokenID.ATOM,
          _TokenType.LITERAL
        ));
    }),
    (e.prototype._parseSheetRef = function () {
      var e, t, o;
      for (e = 1; e + this._pointer < this._expressLength; e++)
        if ("'" === (t = this._expression[this._pointer + e])) {
          if (
            "'" !==
            (e + this._pointer < this._expressLength - 1
              ? this._expression[this._pointer + e + 1]
              : ' ')
          )
            break;
          e++;
        }
      if ("'" !== t) throw "Can't find final quote.";
      return (
        (o = this._expression.substring(this._pointer + 1, this._pointer + e)),
        (this._pointer += e + 1),
        '!' === this._expression[this._pointer] ? o.replace(/\'\'/g, "'") : ''
      );
    }),
    (e.prototype._getCellRange = function (e) {
      var t, o, n, i, r;
      if (
        e &&
        (t = e.split(':')).length > 0 &&
        t.length < 3 &&
        ((o = this._parseCell(t[0])), (i = o.cellRange) && 2 === t.length)
      ) {
        if (
          ((n = this._parseCell(t[1])),
          (r = n.cellRange),
          o.sheetRef && !n.sheetRef && (n.sheetRef = o.sheetRef),
          o.sheetRef !== n.sheetRef)
        )
          throw 'The cell reference must be in the same sheet!';
        r ? ((i.col2 = r.col), (i.row2 = r.row)) : (i = null);
      }
      return null == i ? null : { cellRange: i, sheetRef: o.sheetRef };
    }),
    (e.prototype._parseCellRange = function (e) {
      var t,
        o,
        n = -1,
        i = -1,
        r = !1,
        l = !1;
      for (t = 0; t < e.length; t++)
        if ('$' !== (o = e[t]) || r) {
          if (!((o >= 'a' && o <= 'z') || (o >= 'A' && o <= 'Z'))) break;
          n < 0 && (n = 0),
            (n =
              26 * n + (o.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1));
        } else r = !0;
      for (; t < e.length; t++)
        if ('$' !== (o = e[t]) || l) {
          if (!(o >= '0' && o <= '9')) break;
          i < 0 && (i = 0), (i = 10 * i + (+o - 0));
        } else l = !0;
      return (
        t < e.length && (i = n = -1),
        -1 === i || -1 === n ? null : new wjcGrid.CellRange(i - 1, n - 1)
      );
    }),
    (e.prototype._parseCell = function (e) {
      var t, o, n, i;
      if ((o = e.lastIndexOf('!')) > 0 && o < e.length - 1)
        (i = e.substring(0, o)), (n = e.substring(o + 1));
      else {
        if (!(o <= 0)) return null;
        n = e;
      }
      return (t = this._parseCellRange(n)), { cellRange: t, sheetRef: i };
    }),
    (e.prototype._getParameters = function () {
      var e,
        t,
        o = this._pointer,
        n = this._token;
      if (
        (this._getToken(),
        this._token.tokenType !== _TokenType.SQUAREBRACKETS ||
          this._token.tokenID !== _TokenID.OPEN)
      ) {
        if (this._token.tokenID !== _TokenID.OPEN)
          return (this._pointer = o), (this._token = n), null;
        if (
          ((o = this._pointer),
          this._getToken(),
          this._token.tokenID === _TokenID.CLOSE)
        )
          return null;
        for (
          this._pointer = o,
            e = new Array(),
            t = this._parseExpression(),
            e.push(t);
          this._token.tokenID === _TokenID.COMMA;

        )
          (t = this._parseExpression()), e.push(t);
        if (this._token.tokenID !== _TokenID.CLOSE) throw 'Syntax error.';
        return e;
      }
    }),
    (e.prototype._getTableReference = function (e, t) {
      var o,
        n = [],
        i = this._getTableParameter(),
        r = !1;
      if (null == i) throw 'Invalid table reference.';
      for (
        n.push(i);
        this._tableRefStart &&
        (this._token.tokenID === _TokenID.COMMA || ':' === this._token.value);

      ) {
        if (
          (':' === this._token.value && (r = !0),
          null == (i = this._getTableParameter()))
        )
          throw 'Invalid table reference.';
        r ? ((n[n.length - 1] += ':' + i), (r = !1)) : n.push(i);
      }
      if (
        this._token.tokenType !== _TokenType.SQUAREBRACKETS ||
        this._token.tokenID !== _TokenID.CLOSE
      )
        throw 'Unbalanced square brackets.';
      return (
        (this._tableRefStart = !1),
        (o = this._getTableRange(e, n)),
        (this._containsCellRef = !0),
        new _CellRangeExpression(o, t.toLowerCase(), this._owner)
      );
    }),
    (e.prototype._getTableParameter = function () {
      var e;
      for (
        this._pointer;
        this._pointer < this._expressLength &&
        ' ' === this._expression[this._pointer];

      )
        this._pointer++;
      return ']' === this._expression[this._pointer + 1]
        ? ((this._tableRefStart = !1), null)
        : (this._getTableToken(), (e = this._token.value), this._getToken(), e);
    }),
    (e.prototype._getTableRange = function (e, t) {
      for (var o, n, i, r, l, s = 0; s < t.length; s++) {
        if (n) throw 'Invalid Table Refernce.';
        if (((o = t[s].toLowerCase()), (r = null), '#' === o[0])) {
          switch (o) {
            case '#all':
              r = e.range.clone();
              break;
            case '#data':
              r = e.getDataRange();
              break;
            case '#headers':
              r = e.getHeaderRange();
              break;
            case '#totals':
              r = e.getTotalRange();
              break;
            case '#this row':
              if (
                !(
                  this._rowIndex >= e.range.topRow &&
                  this._rowIndex <= e.range.bottomRow
                )
              )
                throw 'The row is out of the table (' + e.name + ') range.';
              r = new wjcGrid.CellRange(
                this._rowIndex,
                e.range.leftCol,
                this._rowIndex,
                e.range.rightCol
              );
              break;
            default:
              throw 'Invalid Table Refernce.';
          }
          if (null == r) throw 'Invalid Table Refernce.';
          null == i
            ? (i = r)
            : ((i.row = i.topRow < r.topRow ? i.topRow : r.topRow),
              (i.row2 = i.bottomRow > r.bottomRow ? i.bottomRow : r.bottomRow));
        } else {
          (n = !0), (l = o.split(':'));
          for (var a = 0; a < l.length; a++) {
            if (l.length > 2) throw 'Invalid Table Column Refernce.';
            if ('@' === (o = l[a])[0]) {
              if (l.length > 1 || null != i)
                throw 'Invalid Table Column Refernce.';
              if (null == (i = e.getColumnRange(o.substring(1))))
                throw 'Invalid Table Refernce.';
              if (this._rowIndex >= i.topRow && this._rowIndex <= i.bottomRow)
                return (i.row = this._rowIndex), (i.row2 = this._rowIndex), i;
              throw 'The row is out of the table (' + e.name + ') range.';
            }
            if (null == (r = e.getColumnRange(o)))
              throw 'Invalid Table Refernce.';
            0 === a && (null == i ? (i = r) : (i.col = r.col)),
              (i.col2 = r.col),
              (r = null);
          }
        }
      }
      return i;
    }),
    (e.prototype._getAggregateResult = function (e, t, o) {
      var n,
        i = this._getItemList(t, o);
      return (
        (n = wjcCore.getAggregate(e, i.items)), i.isDate && (n = new Date(n)), n
      );
    }),
    (e.prototype._getFlexSheetAggregateResult = function (e, t, o) {
      var n, i, r, l;
      switch (e) {
        case _FlexSheetAggregate.Count:
          return (
            (n = this._getItemList(t, o, !0, !1)),
            this._countNumberCells(n.items)
          );
        case _FlexSheetAggregate.CountA:
          return (n = this._getItemList(t, o, !1, !1)).items.length;
        case _FlexSheetAggregate.ConutBlank:
          return (
            (n = this._getItemList(t, o, !1, !0)),
            this._countBlankCells(n.items)
          );
        case _FlexSheetAggregate.Rank:
          if (
            ((r = _Expression.toNumber(
              t[0],
              this._rowIndex,
              this._columnIndex,
              o
            )),
            (l = t[2]
              ? _Expression.toNumber(t[2], this._rowIndex, this._columnIndex, o)
              : 0),
            isNaN(r))
          )
            throw 'Invalid number.';
          if (isNaN(l)) throw 'Invalid order.';
          if (
            ((t[1] = this._ensureNonFunctionExpression(t[1])),
            t[1] instanceof _CellRangeExpression)
          )
            return (
              (n = this._getItemList([t[1]], o)),
              this._getRankOfCellRange(r, n.items, l)
            );
          throw 'Invalid Cell Reference.';
        case _FlexSheetAggregate.CountIf:
          if (
            ((t[0] = this._ensureNonFunctionExpression(t[0])),
            t[0] instanceof _CellRangeExpression)
          )
            return (
              (n = this._getItemList([t[0]], o, !1)),
              this._countCellsByCriterias([n.items], [t[1]], o)
            );
          throw 'Invalid Cell Reference.';
        case _FlexSheetAggregate.CountIfs:
          return this._handleCountIfs(t, o);
        case _FlexSheetAggregate.SumIf:
          if (
            ((t[0] = this._ensureNonFunctionExpression(t[0])),
            t[0] instanceof _CellRangeExpression)
          )
            return (
              (n = this._getItemList([t[0]], o, !1)),
              (t[2] = this._ensureNonFunctionExpression(t[2])),
              null != t[2] &&
                t[2] instanceof _CellRangeExpression &&
                (i = this._getItemList([t[2]], o)),
              this._sumCellsByCriterias(
                [n.items],
                [t[1]],
                i ? i.items : null,
                o
              )
            );
          throw 'Invalid Cell Reference.';
        case _FlexSheetAggregate.SumIfs:
          return this._handleSumIfs(t, o);
        case _FlexSheetAggregate.Product:
          return (
            (n = this._getItemList(t, o)), this._getProductOfNumbers(n.items)
          );
      }
      throw 'Invalid aggregate type.';
    }),
    (e.prototype._getItemList = function (e, t, o, n, i, r) {
      void 0 === o && (o = !0),
        void 0 === n && (n = !1),
        void 0 === i && (i = !0);
      var l,
        s,
        a,
        h,
        c,
        d = new Array(),
        u = !0;
      for (s = 0; s < e.length; s++)
        if (
          ((c = e[s]),
          (c = this._ensureNonFunctionExpression(c)) instanceof
            _CellRangeExpression)
        )
          for (h = c.getValues(i, r, t), a = 0; a < h.length; a++)
            (l = h[a]),
              (n || (null != l && '' !== l)) &&
                ((u = u && l instanceof Date),
                (l = o && !wjcCore.isBoolean(l) ? +l : l),
                d.push(l));
        else {
          if (
            ((l =
              c instanceof _Expression
                ? c.evaluate(this._rowIndex, this._columnIndex, t)
                : c),
            wjcCore.isPrimitive(l) || (l = l.value),
            !n && (null == l || '' === l))
          )
            continue;
          (u = u && l instanceof Date), (l = o ? +l : l), d.push(l);
        }
      return 0 === d.length && (u = !1), { isDate: u, items: d };
    }),
    (e.prototype._countBlankCells = function (e) {
      for (var t, o = 0, n = 0; o < e.length; o++)
        (null == (t = e[o]) ||
          (wjcCore.isString(t) && '' === t) ||
          (wjcCore.isNumber(t) && isNaN(t))) &&
          n++;
      return n;
    }),
    (e.prototype._countNumberCells = function (e) {
      for (var t, o = 0, n = 0; o < e.length; o++)
        null != (t = e[o]) && wjcCore.isNumber(t) && !isNaN(t) && n++;
      return n;
    }),
    (e.prototype._getRankOfCellRange = function (e, t, o) {
      void 0 === o && (o = 0);
      var n,
        i = 0,
        r = 0;
      for (
        o
          ? t.sort(function (e, t) {
              return isNaN(e) || isNaN(t) ? -1 : e - t;
            })
          : t.sort(function (e, t) {
              return isNaN(e) || isNaN(t) ? 1 : t - e;
            });
        i < t.length;
        i++
      )
        if (((n = t[i]), !isNaN(n) && (r++, e === n))) return r;
      throw e + ' is not in the cell range.';
    }),
    (e.prototype._handleCountIfs = function (e, t) {
      var o,
        n,
        i,
        r,
        l = 0,
        s = [],
        a = [];
      if (e.length % 2 != 0) throw 'Invalid params.';
      for (; l < e.length / 2; l++) {
        if (
          ((n = e[2 * l]),
          !(
            (n = this._ensureNonFunctionExpression(n)) instanceof
            _CellRangeExpression
          ))
        )
          throw 'Invalid Cell Reference.';
        if (0 === l) {
          if (!n.cells) throw 'Invalid Cell Reference.';
          (i = n.cells.rowSpan), (r = n.cells.columnSpan);
        } else {
          if (!n.cells) throw 'Invalid Cell Reference.';
          if (n.cells.rowSpan !== i || n.cells.columnSpan !== r)
            throw 'The row span and column span of each cell range has to be same with each other.';
        }
        (o = this._getItemList([n], t, !1)),
          (s[l] = o.items),
          (a[l] = e[2 * l + 1]);
      }
      return this._countCellsByCriterias(s, a, t);
    }),
    (e.prototype._countCellsByCriterias = function (e, t, o, n) {
      for (
        var i, r, l, s, a, h = 0, c = 0, d = 0, u = e[0].length, _ = [];
        c < t.length;
        c++
      )
        '*' ===
        (a = _Expression.toString(t[c], this._rowIndex, this._columnIndex, o))
          ? _.push(a)
          : _.push(this._parseRightExpr(a));
      for (; h < u; h++) {
        i = !1;
        e: for (c = 0; c < e.length; c++)
          if (((l = e[c]), (s = l[h]), 'string' == typeof (a = _[c]))) {
            if ('*' !== a && (null == s || '' === s)) {
              i = !1;
              break e;
            }
            if (
              !(i =
                '*' === a ||
                this.evaluate(
                  this._combineExpr(s, a),
                  null,
                  o,
                  this._rowIndex,
                  this._columnIndex
                ))
            )
              break e;
          } else if (!(i = i = a.reg.test(s.toString()) === a.checkMathces))
            break e;
        i &&
          (n
            ? null != (r = n[h]) && wjcCore.isNumber(r) && !isNaN(r) && d++
            : d++);
      }
      return d;
    }),
    (e.prototype._handleSumIfs = function (e, t) {
      var o,
        n,
        i,
        r,
        l,
        s,
        a = 1,
        h = [],
        c = [];
      if (e.length % 2 != 1) throw 'Invalid params.';
      if (
        ((i = e[0]),
        !(
          (i = this._ensureNonFunctionExpression(i)) instanceof
          _CellRangeExpression
        ))
      )
        throw 'Invalid Sum Cell Reference.';
      if (!i.cells) throw 'Invalid Sum Cell Reference.';
      for (
        l = i.cells.rowSpan,
          s = i.cells.columnSpan,
          n = this._getItemList([i], t);
        a < (e.length + 1) / 2;
        a++
      ) {
        if (
          ((r = e[2 * a - 1]),
          !(
            (r = this._ensureNonFunctionExpression(r)) instanceof
            _CellRangeExpression
          ))
        )
          throw 'Invalid Criteria Cell Reference.';
        if (!r.cells) throw 'Invalid Criteria Cell Reference.';
        if (r.cells.rowSpan !== l || r.cells.columnSpan !== s)
          throw 'The row span and column span of each cell range has to be same with each other.';
        (o = this._getItemList([r], t, !1)),
          (h[a - 1] = o.items),
          (c[a - 1] = e[2 * a]);
      }
      return this._sumCellsByCriterias(h, c, n.items, t);
    }),
    (e.prototype._sumCellsByCriterias = function (e, t, o, n) {
      var i,
        r,
        l,
        s,
        a,
        h = 0,
        c = 0,
        d = 0,
        u = e[0].length,
        _ = [];
      for (null == o && (o = e[0]); c < t.length; c++)
        '*' ===
        (a = _Expression.toString(t[c], this._rowIndex, this._columnIndex, n))
          ? _.push(a)
          : _.push(this._parseRightExpr(a));
      for (; h < u; h++) {
        (r = !1), (i = o[h]);
        e: for (c = 0; c < e.length; c++)
          if (((l = e[c]), (s = l[h]), 'string' == typeof (a = _[c]))) {
            if ('*' !== a && (null == s || '' === s)) {
              r = !1;
              break e;
            }
            if (
              !(r =
                '*' === a ||
                this.evaluate(
                  this._combineExpr(s, a),
                  null,
                  n,
                  this._rowIndex,
                  this._columnIndex
                ))
            )
              break e;
          } else if (!(r = a.reg.test(s.toString()) === a.checkMathces))
            break e;
        r && wjcCore.isNumber(i) && !isNaN(i) && (d += i);
      }
      return d;
    }),
    (e.prototype._getProductOfNumbers = function (e) {
      var t,
        o = 0,
        n = 1,
        i = !1;
      if (e)
        for (; o < e.length; o++)
          (t = e[o]), wjcCore.isNumber(t) && !isNaN(t) && ((n *= t), (i = !0));
      return i ? n : 0;
    }),
    (e.prototype._handleSubtotal = function (e, t) {
      var o,
        n,
        i,
        r,
        l = !0;
      if (
        ((o = _Expression.toNumber(
          e[0],
          this._rowIndex,
          this._columnIndex,
          t
        )) >= 1 &&
          o <= 11) ||
        (o >= 101 && o <= 111)
      ) {
        switch (
          (o >= 101 && o <= 111 && (l = !1),
          (o = wjcCore.asEnum(o, _SubtotalFunction)),
          (n = this._getItemList(e.slice(1), t, !0, !1, l)),
          o)
        ) {
          case _SubtotalFunction.Count:
          case _SubtotalFunction.CountWithoutHidden:
            return this._countNumberCells(n.items);
          case _SubtotalFunction.CountA:
          case _SubtotalFunction.CountAWithoutHidden:
            return n.items.length;
          case _SubtotalFunction.Product:
          case _SubtotalFunction.ProductWithoutHidden:
            return this._getProductOfNumbers(n.items);
          case _SubtotalFunction.Average:
          case _SubtotalFunction.AverageWithoutHidden:
            i = wjcCore.Aggregate.Avg;
            break;
          case _SubtotalFunction.Max:
          case _SubtotalFunction.MaxWithoutHidden:
            i = wjcCore.Aggregate.Max;
            break;
          case _SubtotalFunction.Min:
          case _SubtotalFunction.MinWithoutHidden:
            i = wjcCore.Aggregate.Min;
            break;
          case _SubtotalFunction.Std:
          case _SubtotalFunction.StdWithoutHidden:
            i = wjcCore.Aggregate.Std;
            break;
          case _SubtotalFunction.StdPop:
          case _SubtotalFunction.StdPopWithoutHidden:
            i = wjcCore.Aggregate.StdPop;
            break;
          case _SubtotalFunction.Sum:
          case _SubtotalFunction.SumWithoutHidden:
            i = wjcCore.Aggregate.Sum;
            break;
          case _SubtotalFunction.Var:
          case _SubtotalFunction.VarWithoutHidden:
            i = wjcCore.Aggregate.Var;
            break;
          case _SubtotalFunction.VarPop:
          case _SubtotalFunction.VarPopWithoutHidden:
            i = wjcCore.Aggregate.VarPop;
        }
        return (
          (r = wjcCore.getAggregate(i, n.items)),
          n.isDate && (r = new Date(r)),
          r
        );
      }
      throw 'Invalid Subtotal function.';
    }),
    (e.prototype._handleDCount = function (e, t) {
      var o,
        n,
        i,
        r = e[0],
        l = e[2];
      if (
        ((r = this._ensureNonFunctionExpression(r)),
        (l = this._ensureNonFunctionExpression(l)),
        r instanceof _CellRangeExpression &&
          l instanceof _CellRangeExpression &&
          ((o = e[1].evaluate(this._rowIndex, this._columnIndex, t)),
          (n = this._getColumnIndexByField(r, o)),
          (i = this._getItemList([r], t, !0, !1, !0, n)).items &&
            i.items.length > 1))
      )
        return this._DCountWithCriterias(i.items.slice(1), r, l);
      throw 'Invalid Count Cell Reference.';
    }),
    (e.prototype._DCountWithCriterias = function (e, t, o) {
      var n,
        i,
        r,
        l,
        s,
        a,
        h,
        c,
        d,
        u,
        _,
        g = o.cells,
        w = 0;
      if (
        ((n = this._getSheet(t.sheetRef)),
        (i = this._getSheet(o.sheetRef)),
        g.rowSpan > 1)
      ) {
        for (r = g.topRow, l = g.bottomRow; l > g.topRow; l--) {
          for (u = [], _ = [], s = g.leftCol; s <= g.rightCol; s++)
            if (
              null != (h = this._owner.getCellValue(l, s, !1, i)) &&
              '' !== h
            ) {
              if (
                (_.push(new _Expression(h)),
                (c = this._owner.getCellValue(r, s, !1, i)),
                (a = this._getColumnIndexByField(t, c)),
                !(
                  null !=
                    (d = this._getItemList([t], n, !1, !1, !0, a)).items &&
                  d.items.length > 1
                ))
              )
                throw 'Invalid Count Cell Reference.';
              u.push(d.items.slice(1));
            }
          w += this._countCellsByCriterias(u, _, n, e);
        }
        return w;
      }
      throw 'Invalid Criteria Cell Reference.';
    }),
    (e.prototype._getColumnIndexByField = function (e, t) {
      var o, n, i, r, l;
      if (((o = e.cells), -1 === (l = o.topRow)))
        throw 'Invalid Count Cell Reference.';
      if (wjcCore.isInt(t) && !isNaN(t)) {
        if (t >= 1 && t <= o.columnSpan) return (i = o.leftCol + t - 1);
      } else
        for (
          n = this._getSheet(e.sheetRef), i = o.leftCol;
          i <= o.rightCol;
          i++
        )
          if (
            ((r = this._owner.getCellValue(l, i, !1, n)),
            (t = wjcCore.isString(t) ? t.toLowerCase() : t),
            (r = wjcCore.isString(r) ? r.toLowerCase() : r),
            t === r)
          )
            return i;
      throw 'Invalid field.';
    }),
    (e.prototype._getSumProduct = function (e, t) {
      var o,
        n,
        i,
        r = 0,
        l = this._getItemListForSumProduct(e, t);
      if (l.length > 0) {
        (n = l[0].length), (i = l.length);
        for (var s = 0; s < n; s++) {
          o = 1;
          for (var a = 0; a < i; a++) o *= l[a][s];
          r += o;
        }
      }
      return r;
    }),
    (e.prototype._getItemListForSumProduct = function (e, t) {
      var o,
        n,
        i,
        r,
        l,
        s,
        a = [new Array()];
      for (i = 0; i < e.length; i++) {
        if (
          ((s = e[i]),
          (o = new Array()),
          (s = this._ensureNonFunctionExpression(s)) instanceof
            _CellRangeExpression)
        )
          for (l = s.getValues(!0, null, t), r = 0; r < l.length; r++)
            (n = l[r]), o.push(+n);
        else
          (n =
            s instanceof _Expression
              ? s.evaluate(this._rowIndex, this._columnIndex, t)
              : s),
            o.push(+n);
        if (i > 0 && o.length !== a[0].length)
          throw 'The cell ranges of the sumProduct formula must have the same dimensions.';
        a[i] = o;
      }
      return a;
    }),
    (e.prototype._getSheet = function (e) {
      var t,
        o = 0;
      if (e)
        for (
          ;
          o < this._owner.sheets.length &&
          (t = this._owner.sheets[o]).name !== e;
          o++
        );
      return t;
    }),
    (e.prototype._parseRightExpr = function (e) {
      var t,
        o,
        n = !1;
      if (e.indexOf('?') > -1 || e.indexOf('*') > -1) {
        if (
          null == (t = e.match(/([\?\*]*)(\w+)([\?\*]*)(\w+)([\?\*]*)/)) ||
          6 !== t.length
        )
          throw 'Invalid Criteria.';
        return (
          (o = new RegExp(
            '^' +
              (t[1].length > 0 ? this._parseRegCriteria(t[1]) : '') +
              t[2] +
              (t[3].length > 0 ? this._parseRegCriteria(t[3]) : '') +
              t[4] +
              (t[5].length > 0 ? this._parseRegCriteria(t[5]) : '') +
              '$',
            'i'
          )),
          /^[<>=]/.test(e) ? '=' === e.trim()[0] && (n = !0) : (n = !0),
          { reg: o, checkMathces: n }
        );
      }
      if (isNaN(+e))
        if (/^\w/.test(e)) e = '="' + e + '"';
        else {
          if (!/^[<>=]{1,2}\s*-?.+$/.test(e)) throw 'Invalid Criteria.';
          e = e.replace(/([<>=]{1,2})\s*(-?.+)/, '$1"$2"');
        }
      else e = '=' + +e;
      return e;
    }),
    (e.prototype._combineExpr = function (e, t) {
      return (
        (wjcCore.isString(e) || wjcCore.isDate(e)) && (e = '"' + e + '"'),
        (e = '=' + e) + t
      );
    }),
    (e.prototype._parseRegCriteria = function (e) {
      for (var t = 0, o = 0, n = ''; t < e.length; t++)
        '*' === e[t]
          ? (o > 0 && ((n += '\\w{' + o + '}'), (o = 0)), (n += '\\w*'))
          : '?' === e[t] && o++;
      return o > 0 && (n += '\\w{' + o + '}'), n;
    }),
    (e.prototype._calculateRate = function (e, t) {
      var o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c,
        d,
        u = 0,
        _ = 0;
      for (
        i = _Expression.toNumber(e[0], this._rowIndex, this._columnIndex, t),
          r = _Expression.toNumber(e[1], this._rowIndex, this._columnIndex, t),
          l = _Expression.toNumber(e[2], this._rowIndex, this._columnIndex, t),
          s =
            null != e[3]
              ? _Expression.toNumber(e[3], this._rowIndex, this._columnIndex, t)
              : 0,
          a =
            null != e[4]
              ? _Expression.toNumber(e[4], this._rowIndex, this._columnIndex, t)
              : 0,
          n =
            null != e[5]
              ? _Expression.toNumber(e[5], this._rowIndex, this._columnIndex, t)
              : 0.1,
          Math.abs(n) < 1e-7
            ? l * (1 + i * n) + r * (1 + n * a) * i + s
            : l * (h = Math.exp(i * Math.log(1 + n))) +
              r * (1 / n + a) * (h - 1) +
              s,
          c = l + r * i + s,
          d = l * h + r * (1 / n + a) * (h - 1) + s,
          o = n;
        Math.abs(c - d) > 1e-7 && u < 20;

      )
        (n = (d * _ - c * o) / (d - c)),
          (_ = o),
          (o = n),
          (c = d),
          (d =
            Math.abs(n) < 1e-7
              ? l * (1 + i * n) + r * (1 + n * a) * i + s
              : l * (h = Math.exp(i * Math.log(1 + n))) +
                r * (1 / n + a) * (h - 1) +
                s),
          ++u;
      if (Math.abs(c - d) > 1e-7 && 20 === u)
        throw 'It is not able to calculate the rate with current parameters.';
      return n;
    }),
    (e.prototype._handleHLookup = function (e, t) {
      var o,
        n,
        i = e[0].evaluate(this._rowIndex, this._columnIndex, t),
        r = e[1],
        l = _Expression.toNumber(e[2], this._rowIndex, this._columnIndex, t),
        s =
          null == e[3] ||
          _Expression.toBoolean(e[3], this._rowIndex, this._columnIndex, t);
      if (null == i || '' == i) throw 'Invalid lookup value.';
      if (isNaN(l) || l < 0) throw 'Invalid row index.';
      if (
        (r = this._ensureNonFunctionExpression(r)) instanceof
        _CellRangeExpression
      ) {
        if (((o = r.cells), l > o.rowSpan))
          throw 'Row index is out of the cell range.';
        if (
          (s
            ? -1 === (n = this._exactMatch(i, o, t, !1)) &&
              (n = this._approximateMatch(i, o, t))
            : (n = this._exactMatch(i, o, t)),
          -1 === n)
        )
          throw 'Lookup Value is not found.';
        return this._owner.getCellValue(o.topRow + l - 1, n, !1, t);
      }
      throw 'Invalid Cell Reference.';
    }),
    (e.prototype._exactMatch = function (e, t, o, n) {
      void 0 === n && (n = !0);
      var i,
        r,
        l,
        s,
        a = t.topRow;
      if (
        (wjcCore.isString(e) && (e = e.toLowerCase()),
        n &&
          wjcCore.isString(e) &&
          (e.indexOf('?') > -1 || e.indexOf('*') > -1))
      ) {
        if (
          null == (l = e.match(/([\?\*]*)(\w+)([\?\*]*)(\w+)([\?\*]*)/)) ||
          6 !== l.length
        )
          throw 'Invalid lookup value.';
        s = new RegExp(
          '^' +
            (l[1].length > 0 ? this._parseRegCriteria(l[1]) : '') +
            l[2] +
            (l[3].length > 0 ? this._parseRegCriteria(l[3]) : '') +
            l[4] +
            (l[5].length > 0 ? this._parseRegCriteria(l[5]) : '') +
            '$',
          'i'
        );
      }
      for (i = t.leftCol; i <= t.rightCol; i++)
        if (((r = this._owner.getCellValue(a, i, !1, o)), null != s)) {
          if (s.test(r)) return i;
        } else if ((wjcCore.isString(r) && (r = r.toLowerCase()), e === r))
          return i;
      return -1;
    }),
    (e.prototype._approximateMatch = function (e, t, o) {
      var n,
        i,
        r = t.topRow,
        l = [],
        s = 0;
      for (
        wjcCore.isString(e) && (e = e.toLowerCase()), i = t.leftCol;
        i <= t.rightCol;
        i++
      )
        (n = this._owner.getCellValue(r, i, !1, o)),
          (n = isNaN(+n) ? n : +n),
          l.push({ value: n, index: i });
      for (
        l.sort(function (e, t) {
          return (
            wjcCore.isString(e.value) && (e.value = e.value.toLowerCase()),
            wjcCore.isString(t.value) && (t.value = t.value.toLowerCase()),
            e.value > t.value ? -1 : e.value === t.value ? t.index - e.index : 1
          );
        });
        s < l.length;
        s++
      )
        if (
          ((n = l[s]),
          wjcCore.isString(n.value) && (n.value = n.value.toLowerCase()),
          e > n.value)
        )
          return n.index;
      throw 'Lookup Value is not found.';
    }),
    (e.prototype._parseToScientificValue = function (e, t, o, n, i) {
      var r,
        l,
        s,
        a,
        h = 0;
      if (Math.abs(e) >= 1)
        for (l = '+', r = Math.pow(10, t.length); e > r; )
          (e /= r), (h += t.length);
      else
        for (l = '-', r = Math.pow(10, t.length); e * r < r; )
          (e *= r), (h += t.length);
      if (((s = wjcCore.Globalize.format(e, 'D' + t.length)), o))
        for (
          (s += wjcCore.Globalize.format(e - Math.floor(e), t + o).substring(
            1
          )).indexOf('.') > -1
            ? (a = s.length - 1 - s.indexOf('.'))
            : ((s += '.'), (a = 0));
          a < o.length - 1;

        )
          (s += '0'), a++;
      if (((s += 'E' + l + wjcCore.Globalize.format(h, 'D' + n.length)), i)) {
        s += '.';
        for (var c = 1; c < i.length; c++) s += '0';
      }
      return s;
    }),
    (e.prototype._checkCache = function (e) {
      var t =
        this._expressionCache[e] ||
        this._expressionCache[
          this._rowIndex + '_' + this._columnIndex + ':' + e
        ];
      if (t) return t;
      if (
        ((t = this._parse(e)),
        this._token.tokenID !== _TokenID.END ||
          this._token.tokenType !== _TokenType.GROUP)
      )
        throw 'Invalid Expression: ' + e;
      return (
        this._cacheSize > 1e4 && this._clearExpressionCache(),
        (this._expressionCache[
          (this._containsCellRef
            ? this._rowIndex + '_' + this._columnIndex + ':'
            : '') + e
        ] = t),
        this._cacheSize++,
        t
      );
    }),
    (e.prototype._ensureNonFunctionExpression = function (e, t) {
      for (; e instanceof _FunctionExpression; )
        e = e.evaluate(this._rowIndex, this._columnIndex, t);
      return e;
    }),
    (e.prototype._getDefinedName = function (e, t) {
      for (var o, n, i = 0; i < this._owner.definedNames.length; i++)
        if ((o = this._owner.definedNames[i]).name.toLowerCase() === e)
          if (o.sheetName) {
            if (o.sheetName.toLowerCase() === t) return o;
          } else n = o;
      return n;
    }),
    (e.prototype._getTableRelatedSheet = function (e) {
      for (var t = 0; t < this._owner.sheets.length; t++)
        for (var o = this._owner.sheets[t], n = 0; n < o.tableNames.length; n++)
          if (o.tableNames[n].toLowerCase() === e) return o.name;
      return '';
    }),
    e
  );
})();
exports._CalcEngine = _CalcEngine;
var _Token = (function () {
  function e(e, t, o) {
    (this._value = e), (this._tokenID = t), (this._tokenType = o);
  }
  return (
    Object.defineProperty(e.prototype, 'value', {
      get: function () {
        return this._value;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'tokenID', {
      get: function () {
        return this._tokenID;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'tokenType', {
      get: function () {
        return this._tokenType;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
exports._Token = _Token;
var _FunctionDefinition = (function () {
  function e(e, t, o) {
    (this._paramMax = Number.MAX_VALUE),
      (this._paramMin = Number.MIN_VALUE),
      (this._func = e),
      wjcCore.isNumber(t) && !isNaN(t) && (this._paramMax = t),
      wjcCore.isNumber(o) && !isNaN(o) && (this._paramMin = o);
  }
  return (
    Object.defineProperty(e.prototype, 'paramMax', {
      get: function () {
        return this._paramMax;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'paramMin', {
      get: function () {
        return this._paramMin;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'func', {
      get: function () {
        return this._func;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
exports._FunctionDefinition = _FunctionDefinition;
var _TokenType;
!(function (e) {
  (e[(e.COMPARE = 0)] = 'COMPARE'),
    (e[(e.ADDSUB = 1)] = 'ADDSUB'),
    (e[(e.MULDIV = 2)] = 'MULDIV'),
    (e[(e.POWER = 3)] = 'POWER'),
    (e[(e.CONCAT = 4)] = 'CONCAT'),
    (e[(e.GROUP = 5)] = 'GROUP'),
    (e[(e.LITERAL = 6)] = 'LITERAL'),
    (e[(e.IDENTIFIER = 7)] = 'IDENTIFIER'),
    (e[(e.SQUAREBRACKETS = 8)] = 'SQUAREBRACKETS');
})((_TokenType = exports._TokenType || (exports._TokenType = {})));
var _TokenID;
!(function (e) {
  (e[(e.GT = 0)] = 'GT'),
    (e[(e.LT = 1)] = 'LT'),
    (e[(e.GE = 2)] = 'GE'),
    (e[(e.LE = 3)] = 'LE'),
    (e[(e.EQ = 4)] = 'EQ'),
    (e[(e.NE = 5)] = 'NE'),
    (e[(e.ADD = 6)] = 'ADD'),
    (e[(e.SUB = 7)] = 'SUB'),
    (e[(e.MUL = 8)] = 'MUL'),
    (e[(e.DIV = 9)] = 'DIV'),
    (e[(e.DIVINT = 10)] = 'DIVINT'),
    (e[(e.MOD = 11)] = 'MOD'),
    (e[(e.POWER = 12)] = 'POWER'),
    (e[(e.CONCAT = 13)] = 'CONCAT'),
    (e[(e.OPEN = 14)] = 'OPEN'),
    (e[(e.CLOSE = 15)] = 'CLOSE'),
    (e[(e.END = 16)] = 'END'),
    (e[(e.COMMA = 17)] = 'COMMA'),
    (e[(e.PERIOD = 18)] = 'PERIOD'),
    (e[(e.ATOM = 19)] = 'ATOM');
})((_TokenID = exports._TokenID || (exports._TokenID = {})));
var _FlexSheetAggregate;
!(function (e) {
  (e[(e.Count = 0)] = 'Count'),
    (e[(e.CountA = 1)] = 'CountA'),
    (e[(e.ConutBlank = 2)] = 'ConutBlank'),
    (e[(e.CountIf = 3)] = 'CountIf'),
    (e[(e.CountIfs = 4)] = 'CountIfs'),
    (e[(e.Rank = 5)] = 'Rank'),
    (e[(e.SumIf = 6)] = 'SumIf'),
    (e[(e.SumIfs = 7)] = 'SumIfs'),
    (e[(e.Product = 8)] = 'Product');
})(_FlexSheetAggregate || (_FlexSheetAggregate = {}));
var _SubtotalFunction;
!(function (e) {
  (e[(e.Average = 1)] = 'Average'),
    (e[(e.Count = 2)] = 'Count'),
    (e[(e.CountA = 3)] = 'CountA'),
    (e[(e.Max = 4)] = 'Max'),
    (e[(e.Min = 5)] = 'Min'),
    (e[(e.Product = 6)] = 'Product'),
    (e[(e.Std = 7)] = 'Std'),
    (e[(e.StdPop = 8)] = 'StdPop'),
    (e[(e.Sum = 9)] = 'Sum'),
    (e[(e.Var = 10)] = 'Var'),
    (e[(e.VarPop = 11)] = 'VarPop'),
    (e[(e.AverageWithoutHidden = 101)] = 'AverageWithoutHidden'),
    (e[(e.CountWithoutHidden = 102)] = 'CountWithoutHidden'),
    (e[(e.CountAWithoutHidden = 103)] = 'CountAWithoutHidden'),
    (e[(e.MaxWithoutHidden = 104)] = 'MaxWithoutHidden'),
    (e[(e.MinWithoutHidden = 105)] = 'MinWithoutHidden'),
    (e[(e.ProductWithoutHidden = 106)] = 'ProductWithoutHidden'),
    (e[(e.StdWithoutHidden = 107)] = 'StdWithoutHidden'),
    (e[(e.StdPopWithoutHidden = 108)] = 'StdPopWithoutHidden'),
    (e[(e.SumWithoutHidden = 109)] = 'SumWithoutHidden'),
    (e[(e.VarWithoutHidden = 110)] = 'VarWithoutHidden'),
    (e[(e.VarPopWithoutHidden = 111)] = 'VarPopWithoutHidden');
})(_SubtotalFunction || (_SubtotalFunction = {}));
var _Expression = (function () {
  function e(e) {
    this._token = e
      ? e instanceof _Token
        ? e
        : new _Token(e, _TokenID.ATOM, _TokenType.LITERAL)
      : new _Token(null, _TokenID.ATOM, _TokenType.IDENTIFIER);
  }
  return (
    Object.defineProperty(e.prototype, 'token', {
      get: function () {
        return this._token;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.evaluate = function (e, t, o) {
      if (this._token.tokenType !== _TokenType.LITERAL) throw 'Bad expression.';
      return this._token.value;
    }),
    (e.toString = function (e, t, o, n) {
      var i = e.evaluate(t, o, n);
      return (
        wjcCore.isPrimitive(i) || (i = i.value), null != i ? i.toString() : ''
      );
    }),
    (e.toNumber = function (e, t, o, n) {
      var i = e.evaluate(t, o, n),
        r = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
      if ((wjcCore.isPrimitive(i) || (i = i.value), wjcCore.isNumber(i)))
        return i;
      if (wjcCore.isBoolean(i)) return i ? 1 : 0;
      if (wjcCore.isDate(i)) return this._toOADate(i);
      if (wjcCore.isString(i)) {
        if (i) {
          if (isNaN(+i)) {
            for (var l in r)
              if (i.indexOf(r[l]) > -1) return this._toOADate(new Date(i));
            return +i;
          }
          return +i;
        }
        return 0;
      }
      return wjcCore.changeType(i, wjcCore.DataType.Number, '');
    }),
    (e.toBoolean = function (e, t, o, n) {
      var i = e.evaluate(t, o, n);
      return (
        wjcCore.isPrimitive(i) || (i = i.value),
        wjcCore.isBoolean(i)
          ? i
          : wjcCore.isNumber(i)
          ? 0 !== i
          : wjcCore.changeType(i, wjcCore.DataType.Boolean, '')
      );
    }),
    (e.toDate = function (e, t, o, n) {
      var i = e.evaluate(t, o, n);
      return (
        wjcCore.isPrimitive(i) || (i = i.value),
        wjcCore.isDate(i)
          ? i
          : wjcCore.isNumber(i)
          ? this._fromOADate(i)
          : wjcCore.changeType(i, wjcCore.DataType.Date, '')
      );
    }),
    (e._toOADate = function (e) {
      var t = Date.UTC(1899, 11, 30);
      return (
        (Date.UTC(
          e.getFullYear(),
          e.getMonth(),
          e.getDate(),
          e.getHours(),
          e.getMinutes(),
          e.getSeconds(),
          e.getMilliseconds()
        ) -
          t) /
        864e5
      );
    }),
    (e._fromOADate = function (e) {
      var t = Date.UTC(1899, 11, 30),
        o = new Date(),
        n = e >= 60 ? 0 : 864e5;
      return new Date(864e5 * e + t + 6e4 * o.getTimezoneOffset() + n);
    }),
    e
  );
})();
exports._Expression = _Expression;
var _UnaryExpression = (function (e) {
  function t(t, o) {
    var n = e.call(this, t) || this;
    return (n._expr = o), n;
  }
  return (
    __extends(t, e),
    (t.prototype.evaluate = function (e, t, o) {
      if (this.token.tokenID === _TokenID.SUB)
        return (
          null == this._evaluatedValue &&
            (this._evaluatedValue = -_Expression.toNumber(this._expr, e, t, o)),
          this._evaluatedValue
        );
      if (this.token.tokenID === _TokenID.ADD)
        return (
          null == this._evaluatedValue &&
            (this._evaluatedValue = +_Expression.toNumber(this._expr, e, t, o)),
          this._evaluatedValue
        );
      throw 'Bad expression.';
    }),
    t
  );
})(_Expression);
exports._UnaryExpression = _UnaryExpression;
var _BinaryExpression = (function (e) {
  function t(t, o, n) {
    var i = e.call(this, t) || this;
    return (i._leftExpr = o), (i._rightExpr = n), i;
  }
  return (
    __extends(t, e),
    (t.prototype.evaluate = function (e, t, o) {
      var n,
        i,
        r,
        l,
        s,
        a,
        h,
        c = !1;
      if (null != this._evaluatedValue) return this._evaluatedValue;
      if (
        ((n = _Expression.toString(this._leftExpr, e, t, o)),
        (i = _Expression.toString(this._rightExpr, e, t, o)),
        this.token.tokenType === _TokenType.CONCAT)
      )
        return (this._evaluatedValue = n + i), this._evaluatedValue;
      if (
        ((r = this._leftExpr.evaluate(e, t, o)),
        (l = this._rightExpr.evaluate(e, t, o)),
        (c = this._isDateValue(r) || this._isDateValue(l)),
        (s = _Expression.toNumber(this._leftExpr, e, t, o)),
        (a = _Expression.toNumber(this._rightExpr, e, t, o)),
        (h = s - a),
        this.token.tokenType === _TokenType.COMPARE)
      )
        switch (this.token.tokenID) {
          case _TokenID.GT:
            return h > 0;
          case _TokenID.LT:
            return h < 0;
          case _TokenID.GE:
            return h >= 0;
          case _TokenID.LE:
            return h <= 0;
          case _TokenID.EQ:
            return isNaN(h)
              ? ((this._evaluatedValue = n.toLowerCase() === i.toLowerCase()),
                this._evaluatedValue)
              : ((this._evaluatedValue = 0 === h), this._evaluatedValue);
          case _TokenID.NE:
            return isNaN(h)
              ? ((this._evaluatedValue = n.toLowerCase() !== i.toLowerCase()),
                this._evaluatedValue)
              : ((this._evaluatedValue = 0 !== h), this._evaluatedValue);
        }
      switch (this.token.tokenID) {
        case _TokenID.ADD:
          this._evaluatedValue = s + a;
          break;
        case _TokenID.SUB:
          this._evaluatedValue = s - a;
          break;
        case _TokenID.MUL:
          this._evaluatedValue = s * a;
          break;
        case _TokenID.DIV:
          this._evaluatedValue = s / a;
          break;
        case _TokenID.DIVINT:
          this._evaluatedValue = Math.floor(s / a);
          break;
        case _TokenID.MOD:
          this._evaluatedValue = Math.floor(s % a);
          break;
        case _TokenID.POWER:
          0 === a && (this._evaluatedValue = 1),
            0.5 === a && (this._evaluatedValue = Math.sqrt(s)),
            1 === a && (this._evaluatedValue = s),
            2 === a && (this._evaluatedValue = s * s),
            3 === a && (this._evaluatedValue = s * s * s),
            4 === a && (this._evaluatedValue = s * s * s * s),
            (this._evaluatedValue = Math.pow(s, a));
          break;
        default:
          this._evaluatedValue = NaN;
      }
      if (!isNaN(this._evaluatedValue))
        return (
          c &&
            (this._evaluatedValue = {
              value: _Expression._fromOADate(this._evaluatedValue),
              format: r.format || l.format,
            }),
          this._evaluatedValue
        );
      throw 'Bad expression.';
    }),
    (t.prototype._isDateValue = function (e) {
      return wjcCore.isPrimitive(e)
        ? wjcCore.isDate(e)
        : wjcCore.isDate(e.value);
    }),
    t
  );
})(_Expression);
exports._BinaryExpression = _BinaryExpression;
var _CellRangeExpression = (function (e) {
  function t(t, o, n) {
    var i = e.call(this) || this;
    return (
      (i._cells = t),
      (i._sheetRef = o),
      (i._flex = n),
      (i._evalutingRange = {}),
      i
    );
  }
  return (
    __extends(t, e),
    (t.prototype.evaluate = function (e, t, o) {
      return (
        null == this._evaluatedValue &&
          (this._evaluatedValue = this._getCellValue(this._cells, o, e, t)),
        this._evaluatedValue
      );
    }),
    (t.prototype.getValues = function (e, t, o) {
      void 0 === e && (e = !0);
      var n,
        i,
        t,
        r,
        l,
        s = [],
        a = 0;
      if (
        ((r = null == t || isNaN(+t) ? this._cells.leftCol : t),
        (l = null == t || isNaN(+t) ? this._cells.rightCol : t),
        !(o = this._getSheet() || o || this._flex.selectedSheet))
      )
        return null;
      for (i = this._cells.topRow; i <= this._cells.bottomRow; i++) {
        if (i >= o.grid.rows.length)
          throw 'The cell reference is out of the cell range of the flexsheet.';
        if (e || !1 !== o.grid.rows[i].isVisible)
          for (t = r; t <= l; t++) {
            if (t >= o.grid.columns.length)
              throw 'The cell reference is out of the cell range of the flexsheet.';
            (e || !1 !== o.grid.columns[t].isVisible) &&
              ((n = this._getCellValue(new wjcGrid.CellRange(i, t), o)),
              wjcCore.isPrimitive(n) || (n = n.value),
              (s[a] = n),
              a++);
          }
      }
      return s;
    }),
    (t.prototype.getValuseWithTwoDimensions = function (e, t) {
      void 0 === e && (e = !0);
      var o,
        n,
        i,
        r,
        l = [],
        s = 0,
        a = 0;
      if (!(t = this._getSheet() || t || this._flex.selectedSheet)) return null;
      for (i = this._cells.topRow; i <= this._cells.bottomRow; i++) {
        if (i >= t.grid.rows.length)
          throw 'The cell reference is out of the cell range of the flexsheet.';
        if (e || !1 !== t.grid.rows[i].isVisible) {
          for (
            n = [], a = 0, r = this._cells.leftCol;
            r <= this._cells.rightCol;
            r++
          ) {
            if (r >= t.grid.columns.length)
              throw 'The cell reference is out of the cell range of the flexsheet.';
            e || !1 !== t.grid.columns[r].isVisible
              ? ((o = this._getCellValue(new wjcGrid.CellRange(i, r), t)),
                wjcCore.isPrimitive(o) || (o = o.value),
                (n[a] = o),
                a++)
              : a++;
          }
          (l[s] = n), s++;
        } else s++;
      }
      return l;
    }),
    Object.defineProperty(t.prototype, 'cells', {
      get: function () {
        return this._cells;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sheetRef', {
      get: function () {
        return this._sheetRef;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._getCellValue = function (e, t, o, n) {
      var t, i, r, l;
      if (!(t = this._getSheet() || t || this._flex.selectedSheet)) return null;
      if (
        (e.isSingleCell
          ? ((r = e.row), (l = e.col))
          : (null != o &&
              o >= e.topRow &&
              o <= e.bottomRow &&
              e.col === e.col2 &&
              ((r = o), (l = e.col)),
            null != n &&
              n >= e.leftCol &&
              n <= e.rightCol &&
              e.row === e.row2 &&
              ((r = e.row), (l = n))),
        null == r || null == l)
      )
        throw 'Invalid Cell Reference.';
      if (
        ((i = t.name + ':' + r + ',' + l + '-' + r + ',' + l),
        this._evalutingRange[i])
      )
        throw 'Circular Reference';
      try {
        if (this._flex)
          return (
            (this._evalutingRange[i] = !0), this._flex.getCellValue(r, l, !1, t)
          );
      } finally {
        delete this._evalutingRange[i];
      }
    }),
    (t.prototype._getSheet = function () {
      var e,
        t = 0;
      if (!this._sheetRef) return null;
      for (; t < this._flex.sheets.length; t++)
        if ((e = this._flex.sheets[t]).name.toLowerCase() === this._sheetRef)
          return e;
      throw 'Invalid sheet reference';
    }),
    t
  );
})(_Expression);
exports._CellRangeExpression = _CellRangeExpression;
var _FunctionExpression = (function (e) {
  function t(t, o, n) {
    void 0 === n && (n = !0);
    var i = e.call(this) || this;
    return (
      (i._funcDefinition = t),
      (i._params = o),
      (i._needCacheEvaluatedVal = n),
      i
    );
  }
  return (
    __extends(t, e),
    (t.prototype.evaluate = function (e, t, o) {
      return this._needCacheEvaluatedVal
        ? (null == this._evaluatedValue &&
            (this._evaluatedValue = this._funcDefinition.func(
              this._params,
              o,
              e,
              t
            )),
          this._evaluatedValue)
        : this._funcDefinition.func(this._params, o, e, t);
    }),
    t
  );
})(_Expression);
exports._FunctionExpression = _FunctionExpression;
var _UndoAction = (function () {
  function e(e) {
    (this._owner = e), (this._sheetIndex = e.selectedSheetIndex);
  }
  return (
    Object.defineProperty(e.prototype, 'sheetIndex', {
      get: function () {
        return this._sheetIndex;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.undo = function () {
      throw 'This abstract method must be overridden.';
    }),
    (e.prototype.redo = function () {
      throw 'This abstract method must be overridden.';
    }),
    (e.prototype.saveNewState = function () {
      throw 'This abstract method must be overridden.';
    }),
    e
  );
})();
exports._UndoAction = _UndoAction;
var _EditAction = (function (e) {
  function t(t, o) {
    var n,
      o,
      i,
      r,
      l,
      s = this;
    if (
      ((s = e.call(this, t) || this),
      (s._isPaste = !1),
      (s._selections = o ? [o] : t.selectedSheet.selectionRanges.slice()),
      (s._oldValues = {}),
      (s._mergeAction = new _CellMergeAction(t)),
      t.rows.length > 0 && t.columns.length > 0)
    )
      for (n = 0; n < s._selections.length; n++)
        for (i = (o = s._selections[n]).topRow; i <= o.bottomRow; i++)
          for (r = o.leftCol; r <= o.rightCol; r++)
            (l =
              null ==
              (l = t.getCellData(i, r, t.columns[r] && !!t.columns[r].dataMap))
                ? ''
                : l),
              (s._oldValues['r' + i + '_c' + r] = {
                row: i,
                col: r,
                value: l,
              });
    return s;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'isPaste', {
      get: function () {
        return this._isPaste;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.undo = function () {
      var e = this;
      e._owner._clearCalcEngine(),
        e._owner.selectedSheet.selectionRanges.clear(),
        e._owner.deferUpdate(function () {
          var t, o, n, i;
          if (e._deletedTables && e._deletedTables.length > 0)
            for (t = 0; t < e._deletedTables.length; t++)
              (o = e._deletedTables[t]),
                e._owner.tables.push(o),
                e._owner.selectedSheet.tableNames.push(o.name);
          for (n = 0; n < e._selections.length; n++)
            (i = e._selections[n]),
              e._owner.selectedSheet.selectionRanges.push(i);
          Object.keys(e._oldValues).forEach(function (t) {
            var o = e._oldValues[t];
            e._owner.setCellData(o.row, o.col, o.value);
          }),
            e._mergeAction.undo(),
            e._owner.refresh(!1);
        });
    }),
    (t.prototype.redo = function () {
      var e = this;
      e._owner._clearCalcEngine(),
        e._owner.selectedSheet.selectionRanges.clear(),
        e._owner.deferUpdate(function () {
          var t, o, n, i;
          if (e._deletedTables && e._deletedTables.length > 0)
            for (t = 0; t < e._deletedTables.length; t++)
              (o = e._deletedTables[t]),
                e._owner.selectedSheet.tableNames.splice(
                  e._owner.selectedSheet.tableNames.indexOf(o.name),
                  1
                ),
                e._owner.tables.remove(o);
          for (n = 0; n < e._selections.length; n++)
            (i = e._selections[n]),
              e._owner.selectedSheet.selectionRanges.push(i);
          Object.keys(e._newValues).forEach(function (t) {
            var o = e._newValues[t];
            e._owner.setCellData(o.row, o.col, o.value);
          }),
            e._mergeAction.redo(),
            e._owner.refresh(!1);
        });
    }),
    (t.prototype.saveNewState = function () {
      var e, t, o, n, i, r;
      for (this._newValues = {}, e = 0; e < this._selections.length; e++)
        for (n = (t = this._selections[e]).topRow; n <= t.bottomRow; n++)
          for (i = t.leftCol; i <= t.rightCol; i++) {
            if (!(o = this._owner.columns[i])) return !1;
            (r =
              null == (r = this._owner.getCellData(n, i, !!o.dataMap))
                ? ''
                : r),
              (this._newValues['r' + n + '_c' + i] = {
                row: n,
                col: i,
                value: r,
              });
          }
      return this._mergeAction.saveNewState(), !this._checkActionState();
    }),
    (t.prototype.markIsPaste = function () {
      this._isPaste = !0;
    }),
    (t.prototype.updateForPasting = function (e) {
      var t = this._selections[this._selections.length - 1],
        o = this._owner.getCellData(
          e.row,
          e.col,
          !!this._owner.columns[e.col].dataMap
        );
      t || ((t = this._owner.selection), (this._selections = [t])),
        (o = null == o ? '' : o),
        (this._oldValues['r' + e.row + '_c' + e.col] = {
          row: e.row,
          col: e.col,
          value: o,
        }),
        (t.row = Math.min(t.topRow, e.topRow)),
        (t.row2 = Math.max(t.bottomRow, e.bottomRow)),
        (t.col = Math.min(t.leftCol, e.leftCol)),
        (t.col2 = Math.max(t.rightCol, e.rightCol));
    }),
    (t.prototype._storeDeletedTables = function (e) {
      null == this._deletedTables && (this._deletedTables = []),
        this._deletedTables.push(e);
    }),
    (t.prototype._checkActionState = function () {
      var e = this,
        t = !0;
      return (
        Object.keys(e._oldValues).forEach(function (o) {
          var n, i;
          t &&
            ((n = e._oldValues[o]),
            (i = e._newValues[o]),
            n && i && n.value !== i.value && (t = !1));
        }),
        t
      );
    }),
    t
  );
})(_UndoAction);
exports._EditAction = _EditAction;
var _ColumnResizeAction = (function (e) {
  function t(t, o, n) {
    var i = e.call(this, t) || this;
    return (
      (i._panel = o),
      (i._colIndex = n),
      (i._oldColWidth = o.columns[n].width),
      i
    );
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      var e = this._panel.columns[this._colIndex];
      e && (e.width = this._oldColWidth);
    }),
    (t.prototype.redo = function () {
      var e = this._panel.columns[this._colIndex];
      e && (e.width = this._newColWidth);
    }),
    (t.prototype.saveNewState = function () {
      return (
        (this._newColWidth = this._panel.columns[this._colIndex].width),
        this._oldColWidth !== this._newColWidth
      );
    }),
    t
  );
})(_UndoAction);
exports._ColumnResizeAction = _ColumnResizeAction;
var _RowResizeAction = (function (e) {
  function t(t, o, n) {
    var i = e.call(this, t) || this;
    return (
      (i._panel = o), (i._rowIndex = n), (i._oldRowHeight = o.rows[n].height), i
    );
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      var e = this._panel.rows[this._rowIndex];
      e && (e.height = this._oldRowHeight);
    }),
    (t.prototype.redo = function () {
      var e = this._panel.rows[this._rowIndex];
      e && (e.height = this._newRowHeight);
    }),
    (t.prototype.saveNewState = function () {
      return (
        (this._newRowHeight = this._panel.rows[this._rowIndex].height),
        this._oldRowHeight !== this._newRowHeight
      );
    }),
    t
  );
})(_UndoAction);
exports._RowResizeAction = _RowResizeAction;
var _ColumnsChangedAction = (function (e) {
  function t(t) {
    var o,
      n,
      i,
      r,
      l = this,
      s = [],
      a = [];
    for (l = e.call(this, t) || this, o = 0; o < t.columns.length; o++)
      s.push(t.columns[o]);
    if (t.selectedSheet.tableNames && t.selectedSheet.tableNames.length > 0)
      for (n = 0; n < t.selectedSheet.tableNames.length; n++)
        (i = t.selectedSheet.tableNames[n]),
          (r = t._getTable(i)) &&
            a.push({
              name: i,
              range: r.range,
              columns: r.columns.slice(),
            });
    return (
      (l._oldValue = {
        columns: s,
        sortList: t.sortManager._committedList.slice(),
        styledCells: t.selectedSheet
          ? JSON.parse(JSON.stringify(t.selectedSheet._styledCells))
          : null,
        mergedCells: t._cloneMergedCells(),
        tableRanges: a,
        selection: t.selection,
      }),
      l
    );
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      var e,
        t,
        o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c = this;
      if (c._owner.selectedSheet) {
        for (
          c._owner._isUndoing = !0,
            c._owner._clearCalcEngine(),
            c._owner.finishEditing(),
            c._owner.columns.clear(),
            c._owner.selectedSheet._styledCells = void 0,
            c._owner.selectedSheet._mergedRanges = void 0,
            c._owner.columns.beginUpdate(),
            e = 0;
          e < c._oldValue.columns.length;
          e++
        )
          c._owner.columns.push(c._oldValue.columns[e]);
        for (
          c._owner.columns.endUpdate(),
            c._owner.selectedSheet._styledCells = JSON.parse(
              JSON.stringify(c._oldValue.styledCells)
            ),
            c._owner.selectedSheet._mergedRanges = c._oldValue.mergedCells,
            o = 0;
          o < this._oldValue.tableRanges.length;
          o++
        )
          (n = this._oldValue.tableRanges[o]),
            (i = this._owner._getTable(n.name)) &&
              i._setTableRange(n.range, n.columns);
        if (
          (c._affectedFormulas && (l = c._affectedFormulas.oldFormulas),
          c._owner.deferUpdate(function () {
            if (l && l.length > 0)
              for (t = 0; t < l.length; t++)
                null != (r = l[t]).point
                  ? r.sheet.name === c._owner.selectedSheet.name
                    ? c._owner.setCellData(r.point.x, r.point.y, r.formula)
                    : r.sheet.grid.setCellData(r.point.x, r.point.y, r.formula)
                  : (r.row._ubv[r.column._hash] = r.formula);
            if (c._deletedTables && c._deletedTables.length > 0)
              for (o = 0; o < c._deletedTables.length; o++)
                (i = c._deletedTables[o]),
                  c._owner.tables.push(i),
                  c._owner.selectedSheet.tableNames.push(i.name);
          }),
          c._affectedDefinedNameVals &&
            (s = c._affectedDefinedNameVals.oldDefinedNameVals),
          s && s.length > 0)
        )
          for (t = 0; t < s.length; t++)
            (a = s[t]),
              (h = c._owner._getDefinedNameIndexByName(a.name)) > -1 &&
                (c._owner.definedNames[h].value = a.value);
        (c._owner.selectedSheet.grid.wj_sheetInfo.styledCells =
          c._owner.selectedSheet._styledCells),
          (c._owner.selectedSheet.grid.wj_sheetInfo.mergedRanges =
            c._owner.selectedSheet._mergedRanges),
          (c._owner.sortManager.sortDescriptions.sourceCollection =
            c._oldValue.sortList.slice()),
          c._owner.sortManager.commitSort(!1),
          c._owner.sortManager._refresh(),
          (c._owner.selection = c._oldValue.selection),
          c._owner.refresh(!0),
          (c._owner._isUndoing = !1),
          c._owner._copyColumnsToSelectedSheet();
      }
    }),
    (t.prototype.redo = function () {
      var e,
        t,
        o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c = this;
      if (c._owner.selectedSheet) {
        for (
          c._owner._isUndoing = !0,
            c._owner._clearCalcEngine(),
            c._owner.finishEditing(),
            c._owner.columns.clear(),
            c._owner.selectedSheet._styledCells = void 0,
            c._owner.selectedSheet._mergedRanges = void 0,
            c._owner.columns.beginUpdate(),
            e = 0;
          e < c._newValue.columns.length;
          e++
        )
          c._owner.columns.push(c._newValue.columns[e]);
        for (
          c._owner.columns.endUpdate(),
            c._owner.selectedSheet._styledCells = JSON.parse(
              JSON.stringify(c._newValue.styledCells)
            ),
            c._owner.selectedSheet._mergedRanges = c._newValue.mergedCells,
            o = 0;
          o < this._newValue.tableRanges.length;
          o++
        )
          (n = this._newValue.tableRanges[o]),
            (i = this._owner._getTable(n.name)) &&
              i._setTableRange(n.range, n.columns);
        if (
          (c._affectedFormulas && (l = c._affectedFormulas.newFormulas),
          c._owner.deferUpdate(function () {
            if (l && l.length > 0)
              for (t = 0; t < l.length; t++)
                null != (r = l[t]).point
                  ? r.sheet.name === c._owner.selectedSheet.name
                    ? c._owner.setCellData(r.point.x, r.point.y, r.formula)
                    : r.sheet.grid.setCellData(r.point.x, r.point.y, r.formula)
                  : (r.row._ubv[r.column._hash] = r.formula);
            if (c._deletedTables && c._deletedTables.length > 0)
              for (o = 0; o < c._deletedTables.length; o++)
                (i = c._deletedTables[o]),
                  c._owner.selectedSheet.tableNames.splice(
                    c._owner.selectedSheet.tableNames.indexOf(i.name),
                    1
                  ),
                  c._owner.tables.remove(i);
          }),
          c._affectedDefinedNameVals &&
            (s = c._affectedDefinedNameVals.newDefinedNameVals),
          s && s.length > 0)
        )
          for (t = 0; t < s.length; t++)
            (a = s[t]),
              (h = c._owner._getDefinedNameIndexByName(a.name)) > -1 &&
                (c._owner.definedNames[h].value = a.value);
        (c._owner.selectedSheet.grid.wj_sheetInfo.styledCells =
          c._owner.selectedSheet._styledCells),
          (c._owner.selectedSheet.grid.wj_sheetInfo.mergedRanges =
            c._owner.selectedSheet._mergedRanges),
          (c._owner.sortManager.sortDescriptions.sourceCollection =
            c._newValue.sortList.slice()),
          c._owner.sortManager.commitSort(!1),
          c._owner.sortManager._refresh(),
          (c._owner.selection = c._newValue.selection),
          c._owner.refresh(!0),
          (c._owner._isUndoing = !1),
          c._owner._copyColumnsToSelectedSheet();
      }
    }),
    (t.prototype.saveNewState = function () {
      var e,
        t,
        o,
        n,
        i = [],
        r = [];
      for (e = 0; e < this._owner.columns.length; e++)
        i.push(this._owner.columns[e]);
      if (
        this._owner.selectedSheet.tableNames &&
        this._owner.selectedSheet.tableNames.length > 0
      )
        for (t = 0; t < this._owner.selectedSheet.tableNames.length; t++)
          (o = this._owner.selectedSheet.tableNames[t]),
            (n = this._owner._getTable(o)) &&
              r.push({
                name: o,
                range: n.range,
                columns: n.columns.slice(),
              });
      return (
        (this._newValue = {
          columns: i,
          sortList: this._owner.sortManager._committedList.slice(),
          styledCells: this._owner.selectedSheet
            ? JSON.parse(JSON.stringify(this._owner.selectedSheet._styledCells))
            : null,
          mergedCells: this._owner._cloneMergedCells(),
          tableRanges: r,
          selection: this._owner.selection,
        }),
        !0
      );
    }),
    t
  );
})(_UndoAction);
exports._ColumnsChangedAction = _ColumnsChangedAction;
var _RowsChangedAction = (function (e) {
  function t(t) {
    var o,
      n,
      i,
      r,
      l,
      s,
      a = this,
      h = [],
      c = [],
      d = [];
    for (a = e.call(this, t) || this, o = 0; o < t.rows.length; o++)
      h.push(t.rows[o]);
    for (n = 0; n < t.columns.length; n++) c.push(t.columns[n]);
    if (t.selectedSheet.tableNames && t.selectedSheet.tableNames.length > 0)
      for (i = 0; i < t.selectedSheet.tableNames.length; i++)
        (r = t.selectedSheet.tableNames[i]),
          (l = t._getTable(r)) &&
            d.push({
              name: r,
              range: l.range,
              setting: {
                showHeaderRow: l.showHeaderRow,
                showTotalRow: l.showTotalRow,
              },
            });
    return (
      t.itemsSource &&
        (s =
          t.itemsSource instanceof wjcCore.CollectionView
            ? t.itemsSource.items.slice()
            : t.itemsSource.slice()),
      (a._oldValue = {
        rows: h,
        columns: c,
        itemsSource: s,
        styledCells: t.selectedSheet
          ? JSON.parse(JSON.stringify(t.selectedSheet._styledCells))
          : null,
        mergedCells: t._cloneMergedCells(),
        tableSettings: d,
        selection: t.selection,
      }),
      a
    );
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      var e,
        t,
        o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c,
        d,
        u = this,
        _ = !!u._oldValue.itemsSource;
      if (u._owner.selectedSheet) {
        if (
          ((u._owner._isUndoing = !0),
          u._owner._clearCalcEngine(),
          u._owner.finishEditing(),
          u._owner.columns.clear(),
          u._owner.rows.clear(),
          (u._owner.selectedSheet._styledCells = void 0),
          (u._owner.selectedSheet._mergedRanges = void 0),
          _)
        )
          u._owner.collectionView.beginUpdate(),
            (u._owner.autoGenerateColumns = !1),
            u._owner.itemsSource instanceof wjcCore.CollectionView
              ? ((d = [0, u._owner.itemsSource.items.length].concat(
                  u._oldValue.itemsSource
                )),
                Array.prototype.splice.apply(u._owner.itemsSource.items, d))
              : (u._owner.itemsSource = u._oldValue.itemsSource.slice()),
            u._owner.collectionView.endUpdate();
        else
          for (
            u._owner.rows.beginUpdate(), e = 0;
            e < u._oldValue.rows.length;
            e++
          )
            u._owner.rows.push(u._oldValue.rows[e]);
        for (t = 0; t < u._oldValue.columns.length; t++)
          u._owner.columns.push(u._oldValue.columns[t]);
        for (
          u._owner.rows.endUpdate(),
            u._owner.selectedSheet._styledCells = JSON.parse(
              JSON.stringify(u._oldValue.styledCells)
            ),
            u._owner.selectedSheet._mergedRanges = u._oldValue.mergedCells,
            n = 0;
          n < this._oldValue.tableSettings.length;
          n++
        )
          (i = this._oldValue.tableSettings[n]),
            (r = this._owner._getTable(i.name)) &&
              ((r._showHeaderRow = i.setting.showHeaderRow),
              (r._showTotalRow = i.setting.showTotalRow),
              r._setTableRange(i.range));
        if (
          (u._affectedFormulas && (s = u._affectedFormulas.oldFormulas),
          u._owner.deferUpdate(function () {
            if (s && s.length > 0)
              for (o = 0; o < s.length; o++)
                null != (l = s[o]).point
                  ? l.sheet.name === u._owner.selectedSheet.name
                    ? u._owner.setCellData(l.point.x, l.point.y, l.formula)
                    : l.sheet.grid.setCellData(l.point.x, l.point.y, l.formula)
                  : (l.row._ubv[l.column._hash] = l.formula);
            if (u._deletedTables && u._deletedTables.length > 0)
              for (n = 0; n < u._deletedTables.length; n++)
                (r = u._deletedTables[n]),
                  u._owner.tables.push(r),
                  u._owner.selectedSheet.tableNames.push(r.name);
          }),
          u._affectedDefinedNameVals &&
            (a = u._affectedDefinedNameVals.oldDefinedNameVals),
          a && a.length > 0)
        )
          for (o = 0; o < a.length; o++)
            (h = a[o]),
              (c = u._owner._getDefinedNameIndexByName(h.name)) > -1 &&
                (u._owner.definedNames[c].value = h.value);
        (u._owner.selectedSheet.grid.wj_sheetInfo.styledCells =
          u._owner.selectedSheet._styledCells),
          (u._owner.selectedSheet.grid.wj_sheetInfo.mergedRanges =
            u._owner.selectedSheet._mergedRanges),
          (u._owner.selection = u._oldValue.selection),
          u._owner.refresh(!0),
          (u._owner._isUndoing = !1),
          u._owner._copyRowsToSelectedSheet();
      }
    }),
    (t.prototype.redo = function () {
      var e,
        t,
        o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c,
        d,
        u = this,
        _ = !!u._newValue.itemsSource;
      if (u._owner.selectedSheet) {
        if (
          ((u._owner._isUndoing = !0),
          u._owner._clearCalcEngine(),
          u._owner.finishEditing(),
          u._owner.columns.clear(),
          u._owner.rows.clear(),
          (u._owner.selectedSheet._styledCells = void 0),
          (u._owner.selectedSheet._mergedRanges = void 0),
          _)
        )
          u._owner.collectionView.beginUpdate(),
            (u._owner.autoGenerateColumns = !1),
            u._owner.itemsSource instanceof wjcCore.CollectionView
              ? ((d = [0, u._owner.itemsSource.items.length].concat(
                  u._newValue.itemsSource
                )),
                Array.prototype.splice.apply(u._owner.itemsSource.items, d))
              : (u._owner.itemsSource = u._newValue.itemsSource.slice()),
            u._owner.collectionView.endUpdate();
        else
          for (
            u._owner.rows.beginUpdate(), e = 0;
            e < u._newValue.rows.length;
            e++
          )
            u._owner.rows.push(u._newValue.rows[e]);
        for (t = 0; t < u._newValue.columns.length; t++)
          u._owner.columns.push(u._newValue.columns[t]);
        for (
          u._owner.rows.endUpdate(),
            u._owner.selectedSheet._styledCells = JSON.parse(
              JSON.stringify(u._newValue.styledCells)
            ),
            u._owner.selectedSheet._mergedRanges = u._newValue.mergedCells,
            n = 0;
          n < this._newValue.tableSettings.length;
          n++
        )
          (i = this._newValue.tableSettings[n]),
            (r = this._owner._getTable(i.name)) &&
              ((r._showHeaderRow = i.setting.showHeaderRow),
              (r._showTotalRow = i.setting.showTotalRow),
              r._setTableRange(i.range));
        if (
          (u._affectedFormulas && (s = u._affectedFormulas.newFormulas),
          u._owner.deferUpdate(function () {
            if (s && s.length > 0)
              for (o = 0; o < s.length; o++)
                null != (l = s[o]).point
                  ? l.sheet.name === u._owner.selectedSheet.name
                    ? u._owner.setCellData(l.point.x, l.point.y, l.formula)
                    : l.sheet.grid.setCellData(l.point.x, l.point.y, l.formula)
                  : (l.row._ubv[l.column._hash] = l.formula);
            if (u._deletedTables && u._deletedTables.length > 0)
              for (n = 0; n < u._deletedTables.length; n++)
                (r = u._deletedTables[n]),
                  u._owner.selectedSheet.tableNames.splice(
                    u._owner.selectedSheet.tableNames.indexOf(r.name),
                    1
                  ),
                  u._owner.tables.remove(r);
          }),
          u._affectedDefinedNameVals &&
            (a = u._affectedDefinedNameVals.newDefinedNameVals),
          a && a.length > 0)
        )
          for (o = 0; o < a.length; o++)
            (h = a[o]),
              (c = u._owner._getDefinedNameIndexByName(h.name)) > -1 &&
                (u._owner.definedNames[c].value = h.value);
        (u._owner.selectedSheet.grid.wj_sheetInfo.styledCells =
          u._owner.selectedSheet._styledCells),
          (u._owner.selectedSheet.grid.wj_sheetInfo.mergedRanges =
            u._owner.selectedSheet._mergedRanges),
          (u._owner.selection = u._newValue.selection),
          u._owner.refresh(!0),
          (u._owner._isUndoing = !1),
          u._owner._copyRowsToSelectedSheet();
      }
    }),
    (t.prototype.saveNewState = function () {
      var e,
        t,
        o,
        n,
        i,
        r,
        l = [],
        s = [],
        a = [];
      for (e = 0; e < this._owner.rows.length; e++) l.push(this._owner.rows[e]);
      for (t = 0; t < this._owner.columns.length; t++)
        s.push(this._owner.columns[t]);
      if (
        this._owner.selectedSheet.tableNames &&
        this._owner.selectedSheet.tableNames.length > 0
      )
        for (o = 0; o < this._owner.selectedSheet.tableNames.length; o++)
          (n = this._owner.selectedSheet.tableNames[o]),
            (i = this._owner._getTable(n)) &&
              a.push({
                name: n,
                range: i.range,
                setting: {
                  showHeaderRow: i.showHeaderRow,
                  showTotalRow: i.showTotalRow,
                },
              });
      return (
        this._owner.itemsSource &&
          (r =
            this._owner.itemsSource instanceof wjcCore.CollectionView
              ? this._owner.itemsSource.items.slice()
              : this._owner.itemsSource.slice()),
        (this._newValue = {
          rows: l,
          columns: s,
          itemsSource: r,
          styledCells: this._owner.selectedSheet
            ? JSON.parse(JSON.stringify(this._owner.selectedSheet._styledCells))
            : null,
          mergedCells: this._owner._cloneMergedCells(),
          tableSettings: a,
          selection: this._owner.selection,
        }),
        !0
      );
    }),
    t
  );
})(_UndoAction);
exports._RowsChangedAction = _RowsChangedAction;
var _CellStyleAction = (function (e) {
  function t(t, o) {
    var n = e.call(this, t) || this;
    return (
      (n._oldStyledCells = o
        ? JSON.parse(JSON.stringify(o))
        : t.selectedSheet
        ? JSON.parse(JSON.stringify(t.selectedSheet._styledCells))
        : null),
      n
    );
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      this._owner.selectedSheet &&
        ((this._owner.selectedSheet._styledCells = JSON.parse(
          JSON.stringify(this._oldStyledCells)
        )),
        (this._owner.selectedSheet.grid.wj_sheetInfo.styledCells =
          this._owner.selectedSheet._styledCells),
        this._owner.refresh(!1));
    }),
    (t.prototype.redo = function () {
      this._owner.selectedSheet &&
        ((this._owner.selectedSheet._styledCells = JSON.parse(
          JSON.stringify(this._newStyledCells)
        )),
        (this._owner.selectedSheet.grid.wj_sheetInfo.styledCells =
          this._owner.selectedSheet._styledCells),
        this._owner.refresh(!1));
    }),
    (t.prototype.saveNewState = function () {
      return (
        (this._newStyledCells = this._owner.selectedSheet
          ? JSON.parse(JSON.stringify(this._owner.selectedSheet._styledCells))
          : null),
        !0
      );
    }),
    t
  );
})(_UndoAction);
exports._CellStyleAction = _CellStyleAction;
var _CellMergeAction = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    return (o._oldMergedCells = t._cloneMergedCells()), o;
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      this._owner.selectedSheet &&
        (this._owner._clearCalcEngine(),
        (this._owner.selectedSheet._mergedRanges = this._oldMergedCells),
        (this._owner.selectedSheet.grid.wj_sheetInfo.mergedRanges =
          this._owner.selectedSheet._mergedRanges),
        this._owner.refresh(!0));
    }),
    (t.prototype.redo = function () {
      this._owner.selectedSheet &&
        (this._owner._clearCalcEngine(),
        (this._owner.selectedSheet._mergedRanges = this._newMergedCells),
        (this._owner.selectedSheet.grid.wj_sheetInfo.mergedRanges =
          this._owner.selectedSheet._mergedRanges),
        this._owner.refresh(!0));
    }),
    (t.prototype.saveNewState = function () {
      return (this._newMergedCells = this._owner._cloneMergedCells()), !0;
    }),
    t
  );
})(_UndoAction);
exports._CellMergeAction = _CellMergeAction;
var _SortColumnAction = (function (e) {
  function t(t) {
    var o,
      n,
      i = this,
      r = [],
      l = [];
    if (((i = e.call(this, t) || this), !t.itemsSource)) {
      for (o = 0; o < t.rows.length; o++) l.push(t.rows[o]);
      for (n = 0; n < t.columns.length; n++) r.push(t.columns[n]);
    }
    return (
      (i._oldValue = {
        sortList: t.sortManager._committedList.slice(),
        rows: l,
        columns: r,
        formulas: t._scanFormulas(),
      }),
      i
    );
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      var e,
        t,
        o,
        n,
        i = this;
      i._owner.selectedSheet &&
        ((i._owner._isUndoing = !0),
        i._owner.deferUpdate(function () {
          if (
            (i._owner._clearCalcEngine(),
            (i._owner.sortManager.sortDescriptions.sourceCollection =
              i._oldValue.sortList.slice()),
            i._owner.sortManager.commitSort(!1),
            i._owner.sortManager._refresh(),
            !i._owner.itemsSource)
          ) {
            for (
              i._owner.rows.clear(),
                i._owner.columns.clear(),
                i._owner.selectedSheet.grid.rows.clear(),
                i._owner.selectedSheet.grid.columns.clear(),
                e = 0;
              e < i._oldValue.rows.length;
              e++
            )
              (o = i._oldValue.rows[e]),
                i._owner.rows.push(o),
                i._owner.selectedSheet.grid.rows.push(o);
            for (t = 0; t < i._oldValue.columns.length; t++)
              (n = i._oldValue.columns[t]),
                i._owner.columns.push(n),
                i._owner.selectedSheet.grid.columns.push(n);
            i._owner._resetFormulas(i._oldValue.formulas),
              (i._owner._isUndoing = !1),
              setTimeout(function () {
                i._owner._setFlexSheetToDirty(), i._owner.refresh(!0);
              }, 10);
          }
        }));
    }),
    (t.prototype.redo = function () {
      var e,
        t,
        o,
        n,
        i = this;
      i._owner.selectedSheet &&
        ((i._owner._isUndoing = !0),
        i._owner.deferUpdate(function () {
          if (
            (i._owner._clearCalcEngine(),
            (i._owner.sortManager.sortDescriptions.sourceCollection =
              i._newValue.sortList.slice()),
            i._owner.sortManager.commitSort(!1),
            i._owner.sortManager._refresh(),
            !i._owner.itemsSource)
          ) {
            for (
              i._owner.rows.clear(),
                i._owner.columns.clear(),
                i._owner.selectedSheet.grid.rows.clear(),
                i._owner.selectedSheet.grid.columns.clear(),
                e = 0;
              e < i._newValue.rows.length;
              e++
            )
              (o = i._newValue.rows[e]),
                i._owner.rows.push(o),
                i._owner.selectedSheet.grid.rows.push(o);
            for (t = 0; t < i._newValue.columns.length; t++)
              (n = i._newValue.columns[t]),
                i._owner.columns.push(n),
                i._owner.selectedSheet.grid.columns.push(n);
            i._owner._resetFormulas(i._newValue.formulas),
              (i._owner._isUndoing = !1),
              setTimeout(function () {
                i._owner._setFlexSheetToDirty(), i._owner.refresh(!0);
              }, 10);
          }
        }));
    }),
    (t.prototype.saveNewState = function () {
      var e,
        t,
        o = [],
        n = [];
      if (!this._owner.itemsSource) {
        for (e = 0; e < this._owner.rows.length; e++)
          n.push(this._owner.rows[e]);
        for (t = 0; t < this._owner.columns.length; t++)
          o.push(this._owner.columns[t]);
      }
      return (
        (this._newValue = {
          sortList: this._owner.sortManager._committedList.slice(),
          rows: n,
          columns: o,
          formulas: this._owner._scanFormulas(),
        }),
        !0
      );
    }),
    t
  );
})(_UndoAction);
exports._SortColumnAction = _SortColumnAction;
var _MoveCellsAction = (function (e) {
  function t(t, o, n, i) {
    var r,
      l,
      s,
      a,
      h,
      c,
      d = this;
    if (((d = e.call(this, t) || this), t.selectedSheet)) {
      for (
        0 === o.topRow && o.bottomRow === t.rows.length - 1
          ? (d._isDraggingColumns = !0)
          : (d._isDraggingColumns = !1),
          d._isCopyCells = i,
          d._dragRange = o,
          d._dropRange = n,
          d._oldDroppingCells = [],
          d._oldDroppingColumnSetting = {},
          r = n.topRow;
        r <= n.bottomRow;
        r++
      )
        for (l = n.leftCol; l <= n.rightCol; l++)
          d._isDraggingColumns &&
            (d._oldDroppingColumnSetting[l] ||
              (d._oldDroppingColumnSetting[l] = {
                dataType: t.columns[l].dataType,
                align: t.columns[l].align,
                format: t.columns[l].format,
              })),
            (s = r * d._owner.columns.length + l),
            (h = d._owner.selectedSheet._styledCells[s]
              ? JSON.parse(
                  JSON.stringify(d._owner.selectedSheet._styledCells[s])
                )
              : null),
            (a = d._owner.getCellData(r, l, !1)),
            d._oldDroppingCells.push({
              rowIndex: r,
              columnIndex: l,
              cellContent: a,
              cellStyle: h,
            });
      if (i) {
        if (d._isDraggingColumns)
          for (r = o.topRow; r <= o.bottomRow; r++)
            for (l = o.leftCol; l <= o.rightCol; l++)
              (c = d._owner.selectedSheet.findTable(r, l)) &&
                c.showHeaderRow &&
                r === c.range.topRow &&
                (d._draggingTableColumns || (d._draggingTableColumns = []),
                d._draggingTableColumns.push({
                  rowIndex: r,
                  columnIndex: l,
                  cellContent: c.columns[l - c.range.leftCol].name,
                }));
      } else
        for (
          d._draggingCells = [], d._draggingColumnSetting = {}, r = o.topRow;
          r <= o.bottomRow;
          r++
        )
          for (l = o.leftCol; l <= o.rightCol; l++)
            d._isDraggingColumns &&
              (d._draggingColumnSetting[l] ||
                (d._draggingColumnSetting[l] = {
                  dataType: t.columns[l].dataType,
                  align: t.columns[l].align,
                  format: t.columns[l].format,
                })),
              (s = r * d._owner.columns.length + l),
              (h = d._owner.selectedSheet._styledCells[s]
                ? JSON.parse(
                    JSON.stringify(d._owner.selectedSheet._styledCells[s])
                  )
                : null),
              (a = d._owner.getCellData(r, l, !1)),
              d._draggingCells.push({
                rowIndex: r,
                columnIndex: l,
                cellContent: a,
                cellStyle: h,
              });
      return d;
    }
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      var e,
        t,
        o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c = this;
      c._owner.selectedSheet &&
        (c._owner._clearCalcEngine(),
        c._owner.deferUpdate(function () {
          var d;
          if (
            (c._affectedFormulas && (r = c._affectedFormulas.oldFormulas),
            r && r.length > 0)
          )
            for (e = 0; e < r.length; e++)
              (l = r[e]).sheet.name === c._owner.selectedSheet.name
                ? c._owner.setCellData(l.point.x, l.point.y, l.formula)
                : l.sheet.grid.setCellData(l.point.x, l.point.y, l.formula);
          if (
            (c._affectedDefinedNameVals &&
              (s = c._affectedDefinedNameVals.oldDefinedNameVals),
            s && s.length > 0)
          )
            for (e = 0; e < s.length; e++)
              (a = s[e]),
                (h = c._owner._getDefinedNameIndexByName(a.name)) > -1 &&
                  (c._owner.definedNames[h].value = a.value);
          for (e = 0; e < c._oldDroppingCells.length; e++)
            (t = c._oldDroppingCells[e]),
              c._owner.setCellData(t.rowIndex, t.columnIndex, t.cellContent),
              (d = c._owner.selectedSheet.findTable(
                t.rowIndex,
                t.columnIndex
              )) &&
                d.showHeaderRow &&
                t.rowIndex === d.range.topRow &&
                (d.columns[t.columnIndex - d.range.leftCol].name =
                  t.cellContent),
              (o = t.rowIndex * c._owner.columns.length + t.columnIndex),
              t.cellStyle
                ? (c._owner.selectedSheet._styledCells[o] = t.cellStyle)
                : delete c._owner.selectedSheet._styledCells[o];
          if (
            (c._isDraggingColumns &&
              c._oldDroppingColumnSetting &&
              Object.keys(c._oldDroppingColumnSetting).forEach(function (e) {
                (c._owner.columns[+e].dataType = c._oldDroppingColumnSetting[+e]
                  .dataType
                  ? c._oldDroppingColumnSetting[+e].dataType
                  : wjcCore.DataType.Object),
                  (c._owner.columns[+e].align =
                    c._oldDroppingColumnSetting[+e].align),
                  (c._owner.columns[+e].format =
                    c._oldDroppingColumnSetting[+e].format);
              }),
            c._isCopyCells)
          ) {
            if (c._draggingTableColumns && c._draggingTableColumns.length > 0)
              for (e = 0; e < c._draggingTableColumns.length; e++)
                (t = c._draggingTableColumns[e]),
                  (d = c._owner.selectedSheet.findTable(
                    t.rowIndex,
                    t.columnIndex
                  )) &&
                    d.showHeaderRow &&
                    t.rowIndex === d.range.topRow &&
                    (c._owner.setCellData(
                      t.rowIndex,
                      t.columnIndex,
                      t.cellContent
                    ),
                    (d.columns[t.columnIndex - d.range.leftCol].name =
                      t.cellContent));
          } else {
            for (e = 0; e < c._draggingCells.length; e++)
              (t = c._draggingCells[e]),
                c._owner.setCellData(t.rowIndex, t.columnIndex, t.cellContent),
                (d = c._owner.selectedSheet.findTable(
                  t.rowIndex,
                  t.columnIndex
                )) &&
                  d.showHeaderRow &&
                  t.rowIndex === d.range.topRow &&
                  (d.columns[t.columnIndex - d.range.leftCol].name =
                    t.cellContent),
                (o = t.rowIndex * c._owner.columns.length + t.columnIndex),
                t.cellStyle &&
                  (c._owner.selectedSheet._styledCells[o] = t.cellStyle);
            if (
              (c._isDraggingColumns &&
                c._draggingColumnSetting &&
                Object.keys(c._draggingColumnSetting).forEach(function (e) {
                  (c._owner.columns[+e].dataType = c._draggingColumnSetting[+e]
                    .dataType
                    ? c._draggingColumnSetting[+e].dataType
                    : wjcCore.DataType.Object),
                    (c._owner.columns[+e].align =
                      c._draggingColumnSetting[+e].align),
                    (c._owner.columns[+e].format =
                      c._draggingColumnSetting[+e].format);
                }),
              c._isDraggingColumns)
            )
              if (c._dragRange.leftCol < c._dropRange.leftCol)
                for (
                  i = c._dragRange.leftCol, n = c._dropRange.leftCol;
                  n <= c._dropRange.rightCol;
                  n++
                )
                  c._owner._updateColumnFiler(n, i), i++;
              else
                for (
                  i = c._dragRange.rightCol, n = c._dropRange.rightCol;
                  n >= c._dropRange.leftCol;
                  n--
                )
                  c._owner._updateColumnFiler(n, i), i--;
          }
        }));
    }),
    (t.prototype.redo = function () {
      var e,
        t,
        o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c,
        d = this;
      d._owner.selectedSheet &&
        (d._owner._clearCalcEngine(),
        d._owner.deferUpdate(function () {
          if (
            (d._affectedFormulas && (r = d._affectedFormulas.newFormulas),
            r && r.length > 0)
          )
            for (e = 0; e < r.length; e++)
              (l = r[e]).sheet.name === d._owner.selectedSheet.name
                ? d._owner.setCellData(l.point.x, l.point.y, l.formula)
                : l.sheet.grid.setCellData(l.point.x, l.point.y, l.formula);
          if (
            (d._affectedDefinedNameVals &&
              (s = d._affectedDefinedNameVals.newDefinedNameVals),
            s && s.length > 0)
          )
            for (e = 0; e < s.length; e++)
              (a = s[e]),
                (h = d._owner._getDefinedNameIndexByName(a.name)) > -1 &&
                  (d._owner.definedNames[h].value = a.value);
          if (d._isCopyCells) {
            if (d._draggingTableColumns && d._draggingTableColumns.length > 0)
              for (e = 0; e < d._draggingTableColumns.length; e++)
                (t = d._draggingTableColumns[e]),
                  (c = d._owner.selectedSheet.findTable(
                    t.rowIndex,
                    t.columnIndex
                  )) &&
                    c.showHeaderRow &&
                    t.rowIndex === c.range.topRow &&
                    (d._owner.setCellData(
                      t.rowIndex,
                      t.columnIndex,
                      t.updatedCellContent
                    ),
                    (c.columns[t.columnIndex - c.range.leftCol].name =
                      t.updatedCellContent));
          } else {
            for (e = 0; e < d._draggingCells.length; e++)
              (t = d._draggingCells[e]),
                (c = d._owner.selectedSheet.findTable(
                  t.rowIndex,
                  t.columnIndex
                )) &&
                c.showHeaderRow &&
                t.rowIndex === c.range.topRow
                  ? (d._owner.setCellData(
                      t.rowIndex,
                      t.columnIndex,
                      t.updatedCellContent
                    ),
                    (c.columns[t.columnIndex - c.range.leftCol].name =
                      t.updatedCellContent))
                  : d._owner.setCellData(t.rowIndex, t.columnIndex, null),
                (o = t.rowIndex * d._owner.columns.length + t.columnIndex),
                d._owner.selectedSheet._styledCells[o] &&
                  delete d._owner.selectedSheet._styledCells[o];
            d._isDraggingColumns &&
              d._draggingColumnSetting &&
              Object.keys(d._draggingColumnSetting).forEach(function (e) {
                (d._owner.columns[+e].dataType = wjcCore.DataType.Object),
                  (d._owner.columns[+e].align = null),
                  (d._owner.columns[+e].format = null);
              });
          }
          for (e = 0; e < d._newDroppingCells.length; e++)
            (t = d._newDroppingCells[e]),
              d._owner.setCellData(t.rowIndex, t.columnIndex, t.cellContent),
              (c = d._owner.selectedSheet.findTable(
                t.rowIndex,
                t.columnIndex
              )) &&
                c.showHeaderRow &&
                t.rowIndex === c.range.topRow &&
                (c.columns[t.columnIndex - c.range.leftCol].name =
                  t.cellContent),
              (o = t.rowIndex * d._owner.columns.length + t.columnIndex),
              t.cellStyle
                ? (d._owner.selectedSheet._styledCells[o] = t.cellStyle)
                : delete d._owner.selectedSheet._styledCells[o];
          if (
            (d._isDraggingColumns &&
              d._newDroppingColumnSetting &&
              Object.keys(d._newDroppingColumnSetting).forEach(function (e) {
                (d._owner.columns[+e].dataType = d._newDroppingColumnSetting[+e]
                  .dataType
                  ? d._newDroppingColumnSetting[+e].dataType
                  : wjcCore.DataType.Object),
                  (d._owner.columns[+e].align =
                    d._newDroppingColumnSetting[+e].align),
                  (d._owner.columns[+e].format =
                    d._newDroppingColumnSetting[+e].format);
              }),
            d._isDraggingColumns && !d._isCopyCells)
          )
            if (d._dragRange.leftCol > d._dropRange.leftCol)
              for (
                i = d._dropRange.leftCol, n = d._dragRange.leftCol;
                n <= d._dragRange.rightCol;
                n++
              )
                d._owner._updateColumnFiler(n, i), i++;
            else
              for (
                i = d._dropRange.rightCol, n = d._dragRange.rightCol;
                n >= d._dragRange.leftCol;
                n--
              )
                d._owner._updateColumnFiler(n, i), i--;
        }));
    }),
    (t.prototype.saveNewState = function () {
      var e, t, o, n, i, r, l, s;
      if (!this._owner.selectedSheet) return !1;
      if (this._dropRange) {
        for (
          this._newDroppingCells = [],
            this._newDroppingColumnSetting = {},
            e = this._dropRange.topRow;
          e <= this._dropRange.bottomRow;
          e++
        )
          for (t = this._dropRange.leftCol; t <= this._dropRange.rightCol; t++)
            this._isDraggingColumns &&
              (this._newDroppingColumnSetting[t] ||
                (this._newDroppingColumnSetting[t] = {
                  dataType: this._owner.columns[t].dataType,
                  align: this._owner.columns[t].align,
                  format: this._owner.columns[t].format,
                })),
              (o = e * this._owner.columns.length + t),
              (i = this._owner.selectedSheet._styledCells[o]
                ? JSON.parse(
                    JSON.stringify(this._owner.selectedSheet._styledCells[o])
                  )
                : null),
              (n = this._owner.getCellData(e, t, !1)),
              this._newDroppingCells.push({
                rowIndex: e,
                columnIndex: t,
                cellContent: n,
                cellStyle: i,
              });
        if (this._isDraggingColumns)
          if (this._isCopyCells) {
            if (
              this._draggingTableColumns &&
              this._draggingTableColumns.length > 0 &&
              this._draggingTableColumns &&
              this._draggingTableColumns.length > 0
            )
              for (r = 0; r < this._draggingTableColumns.length; r++)
                (l = this._draggingTableColumns[r]),
                  (s = this._owner.selectedSheet.findTable(
                    l.rowIndex,
                    l.columnIndex
                  )) &&
                    s.showHeaderRow &&
                    l.rowIndex === s.range.topRow &&
                    (l.updatedCellContent =
                      s.columns[l.columnIndex - s.range.leftCol].name);
          } else if (this._draggingCells && this._draggingCells.length > 0)
            for (r = 0; r < this._draggingCells.length; r++)
              (l = this._draggingCells[r]),
                (s = this._owner.selectedSheet.findTable(
                  l.rowIndex,
                  l.columnIndex
                )) &&
                  s.showHeaderRow &&
                  l.rowIndex === s.range.topRow &&
                  (l.updatedCellContent =
                    s.columns[l.columnIndex - s.range.leftCol].name);
        return !0;
      }
      return !1;
    }),
    t
  );
})(_UndoAction);
exports._MoveCellsAction = _MoveCellsAction;
var _CutAction = (function (e) {
  function t(t) {
    var o,
      n,
      i,
      r,
      l = this;
    for (
      (l = e.call(this, t) || this)._oldValues = [],
        l._oldCutValues = [],
        l._mergeAction = new _CellMergeAction(t),
        l._cutSheet = t._copiedSheet,
        l._selection = t.selection,
        l._cutSelection = t._copiedRanges[0],
        r = l._cutSheet === t.selectedSheet ? t : l._cutSheet.grid,
        o = l._cutSelection.topRow;
      o <= l._cutSelection.bottomRow;
      o++
    )
      if (null != r.rows[o])
        for (n = l._cutSelection.leftCol; n <= l._cutSelection.rightCol; n++)
          (i =
            null == (i = r.getCellData(o, n, !!r.columns[n].dataMap)) ? '' : i),
            l._oldCutValues.push({ row: o, col: n, value: i });
    return l;
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      var e = this;
      e._owner._clearCalcEngine(),
        e._owner.selectedSheet.selectionRanges.clear(),
        e._owner.deferUpdate(function () {
          var t,
            o,
            n =
              e._cutSheet === e._owner.selectedSheet
                ? e._owner
                : e._cutSheet.grid;
          for (
            e._owner.selectedSheet.selectionRanges.push(e._selection), t = 0;
            t < e._oldCutValues.length;
            t++
          )
            (o = e._oldCutValues[t]), n.setCellData(o.row, o.col, o.value);
          for (t = 0; t < e._oldValues.length; t++)
            (o = e._oldValues[t]), e._owner.setCellData(o.row, o.col, o.value);
          e._mergeAction.undo(), e._owner.refresh(!1);
        });
    }),
    (t.prototype.redo = function () {
      var e = this;
      e._owner._clearCalcEngine(),
        e._owner.selectedSheet.selectionRanges.clear(),
        e._owner.deferUpdate(function () {
          var t,
            o,
            n =
              e._cutSheet === e._owner.selectedSheet
                ? e._owner
                : e._cutSheet.grid;
          for (
            e._owner.selectedSheet.selectionRanges.push(e._selection), t = 0;
            t < e._newCutValues.length;
            t++
          )
            (o = e._newCutValues[t]), n.setCellData(o.row, o.col, o.value);
          for (t = 0; t < e._newValues.length; t++)
            (o = e._newValues[t]), e._owner.setCellData(o.row, o.col, o.value);
          e._mergeAction.redo(), e._owner.refresh(!1);
        });
    }),
    (t.prototype.saveNewState = function () {
      var e,
        t,
        o,
        n =
          this._cutSheet === this._owner.selectedSheet
            ? this._owner
            : this._cutSheet.grid;
      for (
        this._newCutValues = [], e = this._cutSelection.topRow;
        e <= this._cutSelection.bottomRow;
        e++
      )
        if (null != n.rows[e])
          for (
            t = this._cutSelection.leftCol;
            t <= this._cutSelection.rightCol;
            t++
          )
            (o =
              null == (o = n.getCellData(e, t, !!n.columns[t].dataMap))
                ? ''
                : o),
              this._newCutValues.push({
                row: e,
                col: t,
                value: o,
              });
      for (
        this._newValues = [], e = this._selection.topRow;
        e <= this._selection.bottomRow;
        e++
      )
        for (t = this._selection.leftCol; t <= this._selection.rightCol; t++) {
          if (!this._owner.columns[t]) return !1;
          (o =
            null ==
            (o = this._owner.getCellData(
              e,
              t,
              !!this._owner.columns[t].dataMap
            ))
              ? ''
              : o),
            this._newValues.push({ row: e, col: t, value: o });
        }
      return this._mergeAction.saveNewState(), !0;
    }),
    (t.prototype.updateForPasting = function (e) {
      var t = this._owner.getCellData(
        e.row,
        e.col,
        !!this._owner.columns[e.col].dataMap
      );
      (t = null == t ? '' : t),
        this._oldValues.push({ row: e.row, col: e.col, value: t }),
        (this._selection.row = Math.min(this._selection.topRow, e.topRow)),
        (this._selection.row2 = Math.max(
          this._selection.bottomRow,
          e.bottomRow
        )),
        (this._selection.col = Math.min(this._selection.leftCol, e.leftCol)),
        (this._selection.col2 = Math.max(this._selection.rightCol, e.rightCol));
    }),
    t
  );
})(_UndoAction);
exports._CutAction = _CutAction;
var _TableSettingAction = (function (e) {
  function t(t, o) {
    var n = e.call(this, t) || this;
    return (
      (n._table = o),
      (n._oldTableSetting = {
        name: o.name,
        style: o.style,
        showHeaderRow: o.showHeaderRow,
        showTotalRow: o.showTotalRow,
        showbandedRows: o.showBandedRows,
        showBandedColumns: o.showBandedColumns,
        showFirstColumn: o.showFirstColumn,
        showLastColumn: o.showLastColumn,
      }),
      n
    );
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      (this._owner._isUndoing = !0),
        (this._table.name = this._oldTableSetting.name),
        (this._table.style = this._oldTableSetting.style),
        (this._table.showHeaderRow = this._oldTableSetting.showHeaderRow),
        (this._table.showTotalRow = this._oldTableSetting.showTotalRow),
        (this._table.showBandedRows = this._oldTableSetting.showbandedRows),
        (this._table.showBandedColumns =
          this._oldTableSetting.showBandedColumns),
        (this._table.showFirstColumn = this._oldTableSetting.showFirstColumn),
        (this._table.showLastColumn = this._oldTableSetting.showLastColumn),
        (this._owner._isUndoing = !1);
    }),
    (t.prototype.redo = function () {
      (this._owner._isUndoing = !0),
        (this._table.name = this._newTableSetting.name),
        (this._table.style = this._newTableSetting.style),
        (this._table.showHeaderRow = this._newTableSetting.showHeaderRow),
        (this._table.showTotalRow = this._newTableSetting.showTotalRow),
        (this._table.showBandedRows = this._newTableSetting.showbandedRows),
        (this._table.showBandedColumns =
          this._newTableSetting.showBandedColumns),
        (this._table.showFirstColumn = this._newTableSetting.showFirstColumn),
        (this._table.showLastColumn = this._newTableSetting.showLastColumn),
        (this._owner._isUndoing = !1);
    }),
    (t.prototype.saveNewState = function () {
      return (
        (this._newTableSetting = {
          name: this._table.name,
          style: this._table.style,
          showHeaderRow: this._table.showHeaderRow,
          showTotalRow: this._table.showTotalRow,
          showbandedRows: this._table.showBandedRows,
          showBandedColumns: this._table.showBandedColumns,
          showFirstColumn: this._table.showFirstColumn,
          showLastColumn: this._table.showLastColumn,
        }),
        !0
      );
    }),
    t
  );
})(_UndoAction);
exports._TableSettingAction = _TableSettingAction;
var _TableAction = (function (e) {
  function t(t, o) {
    var n = e.call(this, t) || this;
    return (n._addedTable = o), n;
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      var e, t;
      if (this._addedTable.showHeaderRow)
        for (t = this._addedTable.range, e = 0; e < t.columnSpan; e++)
          this._owner.setCellData(t.topRow, t.leftCol + e, '');
      this._owner.selectedSheet.tableNames.splice(
        this._owner.selectedSheet.tableNames.indexOf(this._addedTable.name),
        1
      ),
        this._owner.tables.remove(this._addedTable),
        this._owner.refresh();
    }),
    (t.prototype.redo = function () {
      var e, t;
      if (this._addedTable.showHeaderRow)
        for (t = this._addedTable.range, e = 0; e < t.columnSpan; e++)
          this._owner.setCellData(
            t.topRow,
            t.leftCol + e,
            this._addedTable.columns[e].name
          );
      this._owner.tables.push(this._addedTable),
        this._owner.selectedSheet.tableNames.push(this._addedTable.name),
        this._owner.refresh();
    }),
    t
  );
})(_UndoAction);
exports._TableAction = _TableAction;
var _FilteringAction = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    return (o._oldFilterDefinition = t._filter.filterDefinition), o;
  }
  return (
    __extends(t, e),
    (t.prototype.undo = function () {
      this._owner._filter.filterDefinition = this._oldFilterDefinition;
    }),
    (t.prototype.redo = function () {
      this._owner._filter.filterDefinition = this._newFilterDefinition;
    }),
    (t.prototype.saveNewState = function () {
      return (
        this._oldFilterDefinition !== this._owner._filter.filterDefinition &&
        ((this._newFilterDefinition = this._owner._filter.filterDefinition), !0)
      );
    }),
    t
  );
})(_UndoAction);
exports._FilteringAction = _FilteringAction;
var _ContextMenu = (function (e) {
  function t(t, o) {
    var n = e.call(this, t) || this;
    return (
      (n._idx = -1),
      (n._isDisableDelRow = !1),
      (n._owner = o),
      n.applyTemplate('', n.getTemplate(), {
        _insRows: 'insert-rows',
        _delRows: 'delete-rows',
        _insCols: 'insert-columns',
        _delCols: 'delete-columns',
        _convertTable: 'convert-table',
      }),
      n._init(),
      n
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'visible', {
      get: function () {
        return 'none' !== this.hostElement.style.display;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.show = function (e, t) {
      var o = (t ? t.x : e.clientX) + (e ? window.pageXOffset : 0),
        n = (t ? t.y : e.clientY) + (e ? window.pageYOffset : 0);
      (this.hostElement.style.position = 'absolute'),
        (this.hostElement.style.display = 'inline'),
        this._owner._isDisableDeleteRow(
          this._owner.selection.topRow,
          this._owner.selection.bottomRow
        ) &&
          ((this._isDisableDelRow = !0),
          wjcCore.addClass(this._delRows, 'wj-state-disabled')),
        this._showTableOperation(),
        n + this.hostElement.clientHeight > window.innerHeight &&
          (n -= this.hostElement.clientHeight),
        o + this.hostElement.clientWidth > window.innerWidth &&
          (o -= this.hostElement.clientWidth),
        (this.hostElement.style.top = n + 'px'),
        (this.hostElement.style.left = o + 'px');
    }),
    (t.prototype.hide = function () {
      this._idx = -1;
      var e = this.hostElement.querySelectorAll('.wj-context-menu-item');
      this._removeSelectedState(e),
        (this.hostElement.style.display = 'none'),
        (this._isDisableDelRow = !1),
        wjcCore.removeClass(this._delRows, 'wj-state-disabled');
    }),
    (t.prototype.moveToNext = function () {
      var e = this.hostElement.querySelectorAll('.wj-context-menu-item');
      for (
        this._removeSelectedState(e),
          this._idx++,
          1 === this._idx && this._isDisableDelRow && this._idx++;
        e[this._idx] && 'none' === e[this._idx].style.display;

      )
        this._idx++;
      this._idx >= e.length && (this._idx = 0),
        wjcCore.addClass(e[this._idx], 'wj-context-menu-item-selected');
    }),
    (t.prototype.moveToPrev = function () {
      var e = this.hostElement.querySelectorAll('.wj-context-menu-item');
      for (
        this._removeSelectedState(e),
          this._idx--,
          1 === this._idx && this._isDisableDelRow && this._idx--;
        this._idx > 0 && 'none' === e[this._idx].style.display;

      )
        this._idx--;
      this._idx < 0 && (this._idx = e.length - 1),
        wjcCore.addClass(e[this._idx], 'wj-context-menu-item-selected');
    }),
    (t.prototype.moveToFirst = function () {
      var e = this.hostElement.querySelectorAll('.wj-context-menu-item');
      this._removeSelectedState(e),
        (this._idx = 0),
        wjcCore.addClass(e[this._idx], 'wj-context-menu-item-selected');
    }),
    (t.prototype.moveToLast = function () {
      var e = this.hostElement.querySelectorAll('.wj-context-menu-item');
      this._removeSelectedState(e),
        (this._idx = e.length - 1),
        e[this._idx] && 'none' === e[this._idx].style.display && this._idx--,
        wjcCore.addClass(e[this._idx], 'wj-context-menu-item-selected');
    }),
    (t.prototype.handleContextMenu = function () {
      if (-1 === this._idx) this.moveToNext();
      else {
        switch (
          this.hostElement.querySelectorAll('.wj-context-menu-item')[this._idx]
        ) {
          case this._insCols:
            this._owner.insertColumns();
            break;
          case this._insRows:
            this._owner.insertRows();
            break;
          case this._delCols:
            this._owner.deleteColumns();
            break;
          case this._delRows:
            this._isDisableDelRow || this._owner.deleteRows();
            break;
          case this._convertTable:
            this._addTable();
        }
        this.hide(), this._owner.hostElement.focus();
      }
    }),
    (t.prototype._init = function () {
      var e = this,
        t = this.hostElement.querySelectorAll('.wj-context-menu-item');
      (e.hostElement.style.zIndex = '9999'),
        document.querySelector('body').appendChild(e.hostElement),
        e.addEventListener(document.body, 'mousemove', function () {
          e._removeSelectedState(t);
        }),
        e.addEventListener(e.hostElement, 'contextmenu', function (e) {
          e.preventDefault();
        }),
        e.addEventListener(e._insRows, 'click', function (t) {
          e._owner.insertRows(), e.hide(), e._owner.hostElement.focus();
        }),
        e.addEventListener(e._delRows, 'click', function (t) {
          e._isDisableDelRow || e._owner.deleteRows(),
            e.hide(),
            e._owner.hostElement.focus();
        }),
        e.addEventListener(e._insCols, 'click', function (t) {
          e._owner.insertColumns(), e.hide(), e._owner.hostElement.focus();
        }),
        e.addEventListener(e._delCols, 'click', function (t) {
          e._owner.deleteColumns(), e.hide(), e._owner.hostElement.focus();
        }),
        e.addEventListener(e._convertTable, 'click', function (t) {
          e._addTable(), e.hide(), e._owner.hostElement.focus();
        });
    }),
    (t.prototype._removeSelectedState = function (e) {
      for (var t = 0; t < e.length; t++)
        wjcCore.removeClass(e[t], 'wj-context-menu-item-selected');
    }),
    (t.prototype._showTableOperation = function () {
      this._owner.selection;
      (this._convertTable.style.display = 'none'),
        (this._convertTable.parentElement.style.display = 'none');
    }),
    (t.prototype._addTable = function () {
      var e = this._owner.selection,
        t = this._owner.addTable(e.topRow, e.leftCol, e.rowSpan, e.columnSpan),
        o = new _TableAction(this._owner, t);
      this._owner.undoStack._addAction(o);
    }),
    (t.controlTemplate =
      '<div class="wj-context-menu" width="150px"><div class="wj-context-menu-item" wj-part="insert-rows">Insert Row</div><div class="wj-context-menu-item" wj-part="delete-rows">Delete Rows</div><div class="wj-context-menu-item" wj-part="insert-columns">Insert Column</div><div class="wj-context-menu-item" wj-part="delete-columns">Delete Columns</div><div><div class="wj-state-disabled" style="width:100%;height:1px;background-color:lightgray;"></div><div class="wj-context-menu-item" wj-part="convert-table">Convert To Table</div></div></div>'),
    t
  );
})(wjcCore.Control);
exports._ContextMenu = _ContextMenu;
var _TabHolder = (function (e) {
  function t(t, o) {
    var n = e.call(this, t) || this;
    return (
      (n._splitterMousedownHdl = n._splitterMousedownHandler.bind(n)),
      (n._owner = o),
      n.hostElement.attributes.tabindex &&
        n.hostElement.attributes.removeNamedItem('tabindex'),
      n.applyTemplate('', n.getTemplate(), {
        _divSheet: 'left',
        _divSplitter: 'splitter',
        _divRight: 'right',
      }),
      n._init(),
      n
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'sheetControl', {
      get: function () {
        return this._sheetControl;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'visible', {
      get: function () {
        return 'none' !== this.hostElement.style.display;
      },
      set: function (e) {
        (this.hostElement.style.display = e ? 'block' : 'none'),
          (this._divSheet.style.display = e ? 'block' : 'none');
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getSheetBlanketSize = function () {
      return 20;
    }),
    (t.prototype.adjustSize = function () {
      var e = this._owner.scrollSize.width - this._owner.clientSize.width,
        t =
          (this._owner.scrollSize.height,
          this._owner.clientSize.height,
          this._divSplitter.parentElement);
      e <= 0
        ? ((t.style.minWidth = '100px'),
          (this._divSplitter.style.display = 'none'),
          (this._divRight.style.display = 'none'),
          (this._divSheet.style.width = '100%'),
          this._divSplitter.removeEventListener(
            'mousedown',
            this._splitterMousedownHdl,
            !0
          ))
        : ((t.style.minWidth = '300px'),
          (this._divSplitter.style.display = 'none'),
          (this._divRight.style.display = 'none'),
          (this._divSheet.style.width = '100%'),
          this._divSplitter.removeEventListener(
            'mousedown',
            this._splitterMousedownHdl,
            !0
          ),
          this._divSplitter.addEventListener(
            'mousedown',
            this._splitterMousedownHdl,
            !0
          )),
        this._sheetControl._adjustSize();
    }),
    (t.prototype._init = function () {
      var e = this;
      (e._funSplitterMousedown = function (t) {
        e._splitterMouseupHandler(t);
      }),
        (e._divSplitter.parentElement.style.height =
          e.getSheetBlanketSize() + 'px'),
        (e._sheetControl = new _SheetTabs(e._divSheet, this._owner));
    }),
    (t.prototype._splitterMousedownHandler = function (e) {
      (this._startPos = e.pageX),
        document.addEventListener(
          'mousemove',
          this._splitterMousemoveHandler.bind(this),
          !0
        ),
        document.addEventListener('mouseup', this._funSplitterMousedown, !0),
        e.preventDefault();
    }),
    (t.prototype._splitterMousemoveHandler = function (e) {
      null !== this._startPos &&
        void 0 !== this._startPos &&
        this._adjustDis(e.pageX - this._startPos);
    }),
    (t.prototype._splitterMouseupHandler = function (e) {
      document.removeEventListener(
        'mousemove',
        this._splitterMousemoveHandler,
        !0
      ),
        document.removeEventListener('mouseup', this._funSplitterMousedown, !0),
        this._adjustDis(e.pageX - this._startPos),
        (this._startPos = null);
    }),
    (t.prototype._adjustDis = function (e) {
      var t = this._divRight.offsetWidth - e,
        o = this._divSheet.offsetWidth + e;
      t <= 100
        ? ((t = 100),
          (e = this._divRight.offsetWidth - t),
          (o = this._divSheet.offsetWidth + e))
        : o <= 100 &&
          ((e = (o = 100) - this._divSheet.offsetWidth),
          (t = this._divRight.offsetWidth - e)),
        0 != e &&
          ((this._divRight.style.width = t + 'px'),
          (this._divSheet.style.width = o + 'px'),
          (this._startPos = this._startPos + e));
    }),
    (t.controlTemplate =
      '<div><div wj-part="left" style ="float:left;height:100%;overflow:hidden"></div><div wj-part="splitter" style="float:left;height:100%;width:6px;background-color:#e9eaee;padding:2px;cursor:e-resize"><div style="background-color:#8a9eb2;height:100%"></div></div><div wj-part="right" style="float:left;height:100%;background-color:#e9eaee"></div></div>'),
    t
  );
})(wjcCore.Control);
exports._TabHolder = _TabHolder;
var _FlexSheetCellFactory = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.updateCell = function (t, o, n, i, r) {
      var l,
        s,
        a,
        h,
        c,
        d,
        u,
        _,
        g,
        w,
        f,
        p,
        m,
        C,
        b,
        S = t.grid;
      switch (
        (t.cellType === wjcGrid.CellType.Cell &&
          this._resetCellStyle(t.columns[n], i),
        e.prototype.updateCell.call(this, t, o, n, i, r),
        r && !r.isSingleCell && ((o = r.row), (n = r.col), r.row2, r.col2),
        (f = S._getBindingColumn(t, o, t.columns[n])),
        t.cellType)
      ) {
        case wjcGrid.CellType.RowHeader:
          i.textContent = o + 1 + '';
          break;
        case wjcGrid.CellType.ColumnHeader:
          (l = FlexSheet.convertNumberToAlpha(n)),
            i.textContent
              ? (i.innerHTML = i.innerHTML
                  .replace(wjcCore.escapeHtml(i.textContent.trim()), l)
                  .replace(i.textContent, l))
              : (i.innerHTML += l),
            (i.style.textAlign = 'center');
          break;
        case wjcGrid.CellType.Cell:
          if (
            ((a = t.grid),
            (s = o * a.columns.length + n),
            (_ =
              a.selectedSheet && a.selectedSheet._styledCells
                ? a.selectedSheet._styledCells[s]
                : null),
            r &&
              !r.isSingleCell &&
              ((o = (m = this._getFirstVisibleCell(a, r)).row), (n = m.col)),
            t.rows[o] instanceof HeaderRow)
          )
            t.columns[n].dataType === wjcCore.DataType.Boolean
              ? 1 === i.childElementCount &&
                i.firstElementChild instanceof HTMLInputElement &&
                'checkbox' === i.firstElementChild.type &&
                (i.innerHTML = wjcCore.escapeHtml(t.columns[n].header))
              : i.innerHTML ||
                (i.innerHTML = wjcCore.escapeHtml(t.columns[n].header)),
              wjcCore.addClass(i, 'wj-header-row');
          else if (
            ((c = a.getCellValue(o, n, !1)),
            (d = a.getCellData(o, n, !1)),
            (u = null != d && 'string' == typeof d && '=' === d[0]),
            (C = t.rows[o] instanceof wjcGrid.GroupRow),
            (p = (_ ? _.format : null) || (C ? null : f.format)),
            a.editRange && a.editRange.contains(o, n)
              ? !wjcCore.isNumber(c) ||
                f.dataMap ||
                u ||
                (p && (c = this._getFormattedValue(c, p)),
                (w = i.querySelector('input')) && (w.value = c))
              : t.columns[n].dataType === wjcCore.DataType.Boolean
              ? (g = i.querySelector('[type="checkbox"]')) &&
                ((g.checked = a.getCellValue(o, n)),
                (g.disabled = g.disabled || !a.canEditCell(o, n)))
              : f.dataMap && !C
              ? ((c = a.getCellValue(o, n, !0)),
                (h = i.firstChild) &&
                  3 === h.nodeType &&
                  h.nodeValue !== c &&
                  (h.nodeValue = c))
              : 0 === i.childElementCount &&
                i.textContent === a.getCellData(o, n, !0) &&
                ('' !== (c = a.getCellValue(o, n, !0)) &&
                  wjcCore.isNumber(+c) &&
                  !isNaN(+c) &&
                  /[hsmy\:]/i.test(p) &&
                  ((b = _Expression._fromOADate(+c)),
                  isNaN(b.getTime()) ||
                    (c = wjcCore.Globalize.formatDate(b, p))),
                (!p && C) ||
                  ((c = wjcCore.isString(c)
                    ? c.replace(/^(\')(\s*[\w|=])/, '$2')
                    : c),
                  wjcCore.isString(c)
                    ? c && this._isURL(c)
                      ? (i.innerHTML =
                          '<a href="' +
                          c +
                          '" target="_blank">' +
                          wjcCore.escapeHtml(c) +
                          '</a>')
                      : (i.innerHTML = wjcCore.escapeHtml(c))
                    : (i.innerHTML = c))),
            _)
          ) {
            var y,
              v = i.style;
            for (var R in _)
              'className' === R
                ? _.className && wjcCore.addClass(i, _.className)
                : 'format' !== R &&
                  (y = _[R]) &&
                  ((!wjcCore.hasClass(i, 'wj-state-selected') &&
                    !wjcCore.hasClass(i, 'wj-state-multi-selected')) ||
                  ('color' !== R && 'backgroundColor' !== R)
                    ? 'whiteSpace' === R && 'normal' === y
                      ? (v[R] = '')
                      : R.toLowerCase().indexOf('color') > -1 &&
                        !wjcCore.isString(y)
                      ? (v[R] =
                          null != y ? a._getThemeColor(y.theme, y.tint) : '')
                      : (v[R] = y)
                    : (v[R] = ''));
          }
          (i.style.backgroundColor || i.style.color) &&
            (_ || (a.selectedSheet._styledCells[s] = _ = {}),
            i.style.backgroundColor &&
              (_.backgroundColor = i.style.backgroundColor),
            i.style.color && (_.color = i.style.color));
      }
      t.cellType === wjcGrid.CellType.Cell &&
        (o !== S._lastVisibleFrozenRow ||
          wjcCore.hasClass(i, 'wj-frozen-row') ||
          wjcCore.addClass(i, 'wj-frozen-row'),
        n !== S._lastVisibleFrozenColumn ||
          wjcCore.hasClass(i, 'wj-frozen-col') ||
          wjcCore.addClass(i, 'wj-frozen-col'));
    }),
    (t.prototype._resetCellStyle = function (e, t) {
      [
        'fontFamily',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'textDecoration',
        'textAlign',
        'verticalAlign',
        'backgroundColor',
        'color',
        'whiteSpace',
        'borderLeftStyle',
        'borderLeftColor',
        'borderLeftWidth',
        'borderRightStyle',
        'borderRightColor',
        'borderRightWidth',
        'borderTopStyle',
        'borderTopColor',
        'borderTopWidth',
        'borderBottomStyle',
        'borderBottomColor',
        'borderBottomWidth',
      ].forEach(function (o) {
        'textAlign' === o
          ? (t.style.textAlign = e.getAlignment())
          : (t.style[o] = '');
      });
    }),
    (t.prototype._getFormattedValue = function (e, t) {
      return (
        e !== Math.round(e) && (t = t.replace(/([a-z])(\d*)(.*)/gi, '$0112$3')),
        wjcCore.Globalize.formatNumber(e, t, !0)
      );
    }),
    (t.prototype._getFirstVisibleCell = function (e, t) {
      var o, n;
      for (o = t.topRow; o <= t.bottomRow && !e.rows[o].isVisible; o++);
      for (n = t.leftCol; n <= t.rightCol && !e.columns[n].isVisible; n++);
      return new wjcGrid.CellRange(o, n);
    }),
    (t.prototype._isURL = function (e) {
      return new RegExp(
        "^(https|http|ftp|rtsp|mms)://(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"
      ).test(e);
    }),
    t
  );
})(wjcGrid.CellFactory);
exports._FlexSheetCellFactory = _FlexSheetCellFactory;
var FlexSheetFunctions = [
    { name: 'abs', description: 'Returns the absolute value of a number.' },
    { name: 'acos', description: 'Returns the arccosine of a number.' },
    {
      name: 'and',
      description: 'Returns TRUE if all of its arguments are TRUE.',
    },
    { name: 'asin', description: 'Returns the arcsine of a number.' },
    { name: 'atan', description: 'Returns the arctangent of a number.' },
    {
      name: 'atan2',
      description: 'Returns the arctangent from x- and y-coordinates.',
    },
    {
      name: 'average',
      description: 'Returns the average of its arguments.',
    },
    {
      name: 'ceiling',
      description:
        'Rounds a number to the nearest integer or to the nearest multiple of significance.',
    },
    {
      name: 'char',
      description: 'Returns the character specified by the code number.',
    },
    {
      name: 'choose',
      description: 'Chooses a value from a list of values.',
    },
    {
      name: 'code',
      description:
        'Returns a numeric code for the first character in a text string.',
    },
    {
      name: 'column',
      description: 'Returns the column number of a reference.',
    },
    {
      name: 'columns',
      description: 'Returns the number of columns in a reference.',
    },
    {
      name: 'concatenate',
      description: 'Joins several text items into one text item.',
    },
    { name: 'cos', description: 'Returns the cosine of a number.' },
    {
      name: 'count',
      description: 'Counts how many numbers are in the list of arguments.',
    },
    {
      name: 'counta',
      description: 'Counts how many values are in the list of arguments.',
    },
    {
      name: 'countblank',
      description: 'Counts the number of blank cells within a range.',
    },
    {
      name: 'countif',
      description:
        'Counts the number of cells within a range that meet the given criteria.',
    },
    {
      name: 'countifs',
      description:
        'Counts the number of cells within a range that meet multiple criteria.',
    },
    {
      name: 'date',
      description: 'Returns the serial number of a particular date.',
    },
    {
      name: 'datedif',
      description:
        'Calculates the number of days, months, or years between two dates.',
    },
    {
      name: 'day',
      description: 'Converts a serial number to a day of the month.',
    },
    {
      name: 'dcount',
      description: 'Counts the cells that contain numbers in a database.',
    },
    {
      name: 'exp',
      description: 'Returns e raised to the power of a given number.',
    },
    { name: 'false', description: 'Returns the logical value FALSE.' },
    {
      name: 'find',
      description: 'Finds one text value within another (case-sensitive).',
    },
    { name: 'floor', description: 'Rounds a number down, toward zero.' },
    {
      name: 'hlookup',
      description:
        'Looks in the top row of an array and returns the value of the indicated cell.',
    },
    { name: 'hour', description: 'Converts a serial number to an hour.' },
    { name: 'if', description: 'Specifies a logical test to perform.' },
    {
      name: 'index',
      description: 'Uses an index to choose a value from a reference.',
    },
    {
      name: 'left',
      description: 'Returns the leftmost characters from a text value.',
    },
    {
      name: 'len',
      description: 'Returns the number of characters in a text string.',
    },
    {
      name: 'ln',
      description: 'Returns the natural logarithm of a number.',
    },
    { name: 'lower', description: 'Converts text to lowercase.' },
    {
      name: 'max',
      description: 'Returns the maximum value in a list of arguments.',
    },
    {
      name: 'mid',
      description:
        'Returns a specific number of characters from a text string starting at the position you specify.',
    },
    {
      name: 'min',
      description: 'Returns the minimum value in a list of arguments.',
    },
    { name: 'mod', description: 'Returns the remainder from division.' },
    { name: 'month', description: 'Converts a serial number to a month.' },
    { name: 'not', description: 'Reverses the logic of its argument.' },
    {
      name: 'now',
      description: 'Returns the serial number of the current date and time.',
    },
    { name: 'or', description: 'Returns TRUE if any argument is TRUE.' },
    { name: 'pi', description: 'Returns the value of pi.' },
    {
      name: 'power',
      description: 'Returns the result of a number raised to a power.',
    },
    { name: 'product', description: 'Multiplies its arguments.' },
    {
      name: 'proper',
      description: 'Capitalizes the first letter in each word of a text value.',
    },
    {
      name: 'rand',
      description: 'Returns a random number between 0 and 1.',
    },
    {
      name: 'rank',
      description: 'Returns the rank of a number in a list of numbers.',
    },
    {
      name: 'rate',
      description: 'Returns the interest rate per period of an annuity.',
    },
    { name: 'replace', description: 'Replaces characters within text.' },
    { name: 'rept', description: 'Repeats text a given number of times.' },
    {
      name: 'right',
      description: 'Returns the rightmost characters from a text value.',
    },
    {
      name: 'round',
      description: 'Rounds a number to a specified number of digits.',
    },
    {
      name: 'rounddown',
      description: 'Rounds a number down, toward zero.',
    },
    { name: 'roundup', description: 'Rounds a number up, away from zero.' },
    { name: 'row', description: 'Returns the row number of a reference.' },
    {
      name: 'rows',
      description: 'Returns the number of rows in a reference.',
    },
    {
      name: 'search',
      description: 'Finds one text value within another (not case-sensitive).',
    },
    { name: 'sin', description: 'Returns the sine of the given angle.' },
    { name: 'sqrt', description: 'Returns a positive square root.' },
    {
      name: 'stdev',
      description: 'Estimates standard deviation based on a sample.',
    },
    {
      name: 'stdevp',
      description:
        'Calculates standard deviation based on the entire population.',
    },
    {
      name: 'substitute',
      description: 'Substitutes new text for old text in a text string.',
    },
    {
      name: 'subtotal',
      description: 'Returns a subtotal in a list or database.',
    },
    { name: 'sum', description: 'Adds its arguments.' },
    {
      name: 'sumif',
      description: 'Adds the cells specified by a given criteria.',
    },
    {
      name: 'sumifs',
      description: 'Adds the cells in a range that meet multiple criteria.',
    },
    {
      name: 'sumproduct',
      description:
        'Multiplies corresponding components in the given arrays, and returns the sum of those products.',
    },
    { name: 'tan', description: 'Returns the tangent of a number.' },
    {
      name: 'text',
      description: 'Formats a number and converts it to text.',
    },
    {
      name: 'time',
      description: 'Returns the serial number of a particular time.',
    },
    {
      name: 'today',
      description: "Returns the serial number of today's date.",
    },
    { name: 'trim', description: 'Removes spaces from text.' },
    { name: 'true', description: 'Returns the logical value TRUE.' },
    { name: 'trunc', description: 'Truncates a number to an integer.' },
    { name: 'upper', description: 'Converts text to uppercase.' },
    { name: 'value', description: 'Converts a text argument to a number.' },
    { name: 'var', description: 'Estimates variance based on a sample.' },
    {
      name: 'varp',
      description: 'Calculates variance based on the entire population.',
    },
    { name: 'year', description: 'Converts a serial number to a year.' },
  ],
  FlexSheet = (function (e) {
    function t(t, o) {
      var n = e.call(this, t, o) || this;
      return (
        (n._selectedSheetIndex = -1),
        (n._columnHeaderClicked = !1),
        (n._addingSheet = !1),
        (n._mouseMoveHdl = n._mouseMove.bind(n)),
        (n._clickHdl = n._click.bind(n)),
        (n._touchStartHdl = n._touchStart.bind(n)),
        (n._touchEndHdl = n._touchEnd.bind(n)),
        (n._isContextMenuKeyDown = !1),
        (n._isClicking = !1),
        (n._resettingFilter = !1),
        (n._definedNames = new wjcCore.ObservableArray()),
        (n._builtInTableStylesCache = {}),
        (n._needCopyToSheet = !0),
        (n.selectedSheetChanged = new wjcCore.Event()),
        (n.draggingRowColumn = new wjcCore.Event()),
        (n.droppingRowColumn = new wjcCore.Event()),
        (n.loaded = new wjcCore.Event()),
        (n.unknownFunction = new wjcCore.Event()),
        (n.sheetCleared = new wjcCore.Event()),
        (n.prepareChangingRow = new wjcCore.Event()),
        (n.prepareChangingColumn = new wjcCore.Event()),
        (n.rowChanged = new wjcCore.Event()),
        (n.columnChanged = new wjcCore.Event()),
        (n._needCopyToSheet = !1),
        (n._colorThemes = [
          'FFFFFF',
          '000000',
          'EEECE1',
          '1F497D',
          '4F818D',
          'C0504D',
          '9BBB59',
          '8064A2',
          '4BACC6',
          'F79646',
        ]),
        (n._eCt.style.backgroundColor = 'white'),
        wjcCore.addClass(n.hostElement, 'wj-flexsheet'),
        wjcCore.setCss(n.hostElement, { fontFamily: 'Arial' }),
        (n._cf = new _FlexSheetCellFactory()),
        (n._bndSortConverter = n._sheetSortConverter.bind(n)),
        (n.quickAutoSize = !1),
        n._init(),
        (n.showSort = !1),
        (n.allowSorting = !1),
        (n.showGroups = !1),
        (n.showMarquee = !0),
        (n.showSelectedHeaders = wjcGrid.HeadersVisibility.All),
        (n.allowResizing = wjcGrid.AllowResizing.Both),
        (n.allowDragging = wjcGrid.AllowDragging.None),
        (n._needCopyToSheet = !0),
        n
      );
    }
    return (
      __extends(t, e),
      Object.defineProperty(t.prototype, 'sheets', {
        get: function () {
          return (
            this._sheets ||
              ((this._sheets = new SheetCollection()),
              this._sheets.selectedSheetChanged.addHandler(
                this._selectedSheetChange,
                this
              ),
              this._sheets.collectionChanged.addHandler(
                this._sourceChange,
                this
              ),
              this._sheets.sheetVisibleChanged.addHandler(
                this._sheetVisibleChange,
                this
              ),
              this._sheets.sheetCleared.addHandler(this.onSheetCleared, this)),
            this._sheets
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'selectedSheetIndex', {
        get: function () {
          return this._selectedSheetIndex;
        },
        set: function (e) {
          e !== this._selectedSheetIndex &&
            (this._showSheet(e), (this._sheets.selectedIndex = e));
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'selectedSheet', {
        get: function () {
          return this._sheets[this._selectedSheetIndex];
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'isFunctionListOpen', {
        get: function () {
          return (
            this._functionListHost &&
            'none' !== this._functionListHost.style.display
          );
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'isTabHolderVisible', {
        get: function () {
          return this._tabHolder.visible;
        },
        set: function (e) {
          e !== this._tabHolder.visible &&
            ((this._divContainer.style.height = e
              ? this._divContainer.parentElement.clientHeight -
                this._tabHolder.getSheetBlanketSize() +
                'px'
              : this._divContainer.parentElement.clientHeight + 'px'),
            (this._tabHolder.visible = e));
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'undoStack', {
        get: function () {
          return this._undoStack;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'sortManager', {
        get: function () {
          return this._sortManager;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'showFilterIcons', {
        get: function () {
          return !!this._filter && this._filter.showFilterIcons;
        },
        set: function (e) {
          this._filter &&
            this._filter.showFilterIcons !== e &&
            (this._filter.showFilterIcons = e);
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'definedNames', {
        get: function () {
          return this._definedNames;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'tables', {
        get: function () {
          return this._tables;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype.onSelectedSheetChanged = function (e) {
        this._sortManager._refresh(), this.selectedSheetChanged.raise(this, e);
      }),
      (t.prototype.onDraggingRowColumn = function (e) {
        this.draggingRowColumn.raise(this, e);
      }),
      (t.prototype.onDroppingRowColumn = function (e) {
        this.droppingRowColumn.raise(this, new wjcCore.EventArgs());
      }),
      (t.prototype.onLoaded = function (e) {
        var t = this;
        t._toRefresh && (clearTimeout(t._toRefresh), (t._toRefresh = null)),
          (t._toRefresh = setTimeout(function () {
            t._setFlexSheetToDirty(), t.invalidate();
          }, 10)),
          t.loaded.raise(this, new wjcCore.EventArgs());
      }),
      (t.prototype.onUnknownFunction = function (e) {
        this.unknownFunction.raise(this, e);
      }),
      (t.prototype.onSheetCleared = function (e) {
        this.sheetCleared.raise(this, new wjcCore.EventArgs());
      }),
      (t.prototype.onPrepareChangingRow = function () {
        this.prepareChangingRow.raise(this, new wjcCore.EventArgs());
      }),
      (t.prototype.onPrepareChangingColumn = function () {
        this.prepareChangingColumn.raise(this, new wjcCore.EventArgs());
      }),
      (t.prototype.onRowChanged = function (e) {
        this.rowChanged.raise(this, e);
      }),
      (t.prototype.onColumnChanged = function (e) {
        this.columnChanged.raise(this, e);
      }),
      (t.prototype.refresh = function (t) {
        void 0 === t && (t = !0);
        var o, n, i;
        if (
          ((this._divContainer.style.height =
            this._divContainer.parentElement.clientHeight -
            (this.isTabHolderVisible
              ? this._tabHolder.getSheetBlanketSize()
              : 0) +
            'px'),
          !this.preserveSelectedState &&
            this.selectedSheet &&
            (this.selectedSheet.selectionRanges.clear(),
            this.selectedSheet.selectionRanges.push(this.selection)),
          t && this._clearCalcEngine(),
          (this._lastVisibleFrozenRow = -1),
          this.frozenRows > 0)
        )
          for (var r = this.frozenRows - 1; r >= 0; r--)
            if (this.rows[r] && this.rows[r].isVisible) {
              this._lastVisibleFrozenRow = r;
              break;
            }
        if (((this._lastVisibleFrozenColumn = -1), this.frozenColumns > 0))
          for (var l = this.frozenColumns - 1; l >= 0; l--)
            if (this.columns[l] && this.columns[l].isVisible) {
              this._lastVisibleFrozenColumn = l;
              break;
            }
        if (this.selectedSheet) {
          if (this.selectedSheet._freezeHiddenRowCnt > 0)
            for (o = 0; o < this.selectedSheet._freezeHiddenRowCnt; o++)
              (n = this.rows[o]) instanceof HeaderRow || (n.visible = !1);
          if (this.selectedSheet._freezeHiddenColumnCnt > 0)
            for (i = 0; i < this.selectedSheet._freezeHiddenColumnCnt; i++)
              this.columns[i].visible = !1;
        }
        e.prototype.refresh.call(this, t), this._tabHolder.adjustSize();
      }),
      (t.prototype.setCellData = function (e, t, o, n, i) {
        void 0 === n && (n = !1), void 0 === i && (i = !0);
        var r = wjcCore.isString(o) && o.length > 1 && '=' === o[0];
        return (
          this._clearCalcEngine(), this.cells.setCellData(e, t, o, n && !r, i)
        );
      }),
      (t.prototype.containsFocus = function () {
        return this.isFunctionListOpen || e.prototype.containsFocus.call(this);
      }),
      (t.prototype.addUnboundSheet = function (e, t, o, n, i) {
        var r = this._addSheet(e, t, o, n, i);
        return (
          0 === r.selectionRanges.length &&
            r.selectionRanges.push(this.selection),
          r
        );
      }),
      (t.prototype.addBoundSheet = function (e, t, o, n) {
        var i = this._addSheet(e, 0, 0, o, n);
        return (
          t &&
            ((i.itemsSource = t),
            this.childItemsPath &&
              (i.grid.childItemsPath = this.childItemsPath)),
          0 === i.selectionRanges.length &&
            i.selectionRanges.push(this.selection),
          i
        );
      }),
      (t.prototype.applyCellsStyle = function (e, t, o) {
        void 0 === o && (o = !1);
        var n,
          i,
          r,
          l,
          s,
          a = t || [this.selection];
        if (this.selectedSheet) {
          if (!e && this._cloneStyle)
            return (
              (this.selectedSheet._styledCells = JSON.parse(
                JSON.stringify(this._cloneStyle)
              )),
              (this._cloneStyle = null),
              void this.refresh(!1)
            );
          if (a) {
            for (
              t || o
                ? o &&
                  !this._cloneStyle &&
                  (this._cloneStyle = JSON.parse(
                    JSON.stringify(this.selectedSheet._styledCells)
                  ))
                : ((s = new _CellStyleAction(this, this._cloneStyle)),
                  (this._cloneStyle = null)),
                l = 0;
              l < a.length;
              l++
            )
              for (n = (r = a[l]).topRow; n <= r.bottomRow; n++)
                for (i = r.leftCol; i <= r.rightCol; i++)
                  this._applyStyleForCell(n, i, e);
            t || o || (s.saveNewState(), this._undoStack._addAction(s));
          }
          t || this.refresh(!1);
        }
      }),
      (t.prototype.freezeAtCursor = function () {
        var e,
          t,
          o,
          n,
          i,
          r = this;
        if (r.selectedSheet) {
          if (r.selection && 0 === r.frozenRows && 0 === r.frozenColumns) {
            if (r._ptScrl.y < 0)
              for (e = 0; e < r.selection.topRow - 1; e++)
                if (!((i = r.rows[e]) instanceof HeaderRow)) {
                  if (!(i._pos + r._ptScrl.y < 0)) {
                    r.selectedSheet._freezeHiddenRowCnt = e;
                    break;
                  }
                  i.visible = !1;
                }
            if (r._ptScrl.x < 0)
              for (t = 0; t < r.selection.leftCol - 1; t++) {
                if (!(r.columns[t]._pos + r._ptScrl.x < 0)) {
                  r.selectedSheet._freezeHiddenColumnCnt = t;
                  break;
                }
                r.columns[t].visible = !1;
              }
            (o = r.selection.leftCol > 0 ? r.selection.leftCol : 0),
              (n = r.selection.topRow > 0 ? r.selection.topRow : 0);
          } else {
            for (e = 0; e < r.frozenRows - 1; e++) r.rows[e].visible = !0;
            for (t = 0; t < r.frozenColumns - 1; t++) r.columns[t].visible = !0;
            r._filter.apply(),
              (o = 0),
              (n = 0),
              (r.selectedSheet._freezeHiddenRowCnt = 0),
              (r.selectedSheet._freezeHiddenColumnCnt = 0);
          }
          (r.frozenRows = r.selectedSheet.grid.frozenRows = n),
            (r.frozenColumns = r.selectedSheet.grid.frozenColumns = o),
            setTimeout(function () {
              r._setFlexSheetToDirty(),
                r.invalidate(),
                r.scrollIntoView(r.selection.topRow, r.selection.leftCol);
            }, 10);
        }
      }),
      (t.prototype.showColumnFilter = function () {
        var e = this.selection.col > 0 ? this.selection.col : 0;
        this.columns.length > 0 &&
          this._filter.editColumnFilter(this.columns[e]);
      }),
      (t.prototype.clear = function () {
        this.beginUpdate(),
          (this.selection = new wjcGrid.CellRange()),
          this.sheets.clear(),
          (this._selectedSheetIndex = -1),
          this.columns.clear(),
          this.rows.clear(),
          this.columnHeaders.columns.clear(),
          this.rowHeaders.rows.clear(),
          this._undoStack.clear(),
          (this._ptScrl = new wjcCore.Point()),
          this._clearCalcEngine(),
          this._definedNames.clear(),
          this._tables && this._tables.clear(),
          this.addUnboundSheet(),
          this.endUpdate();
      }),
      (t.prototype.getSelectionFormatState = function () {
        var e,
          t,
          o = this.rows.length,
          n = this.columns.length,
          i = {
            isBold: !1,
            isItalic: !1,
            isUnderline: !1,
            textAlign: 'left',
            isMergedCell: !1,
          };
        if (0 === o || 0 === n) return i;
        if (this.selection) {
          if (
            this.selection.row >= o ||
            this.selection.row2 >= o ||
            this.selection.col >= n ||
            this.selection.col2 >= n
          )
            return i;
          for (e = this.selection.topRow; e <= this.selection.bottomRow; e++)
            for (t = this.selection.leftCol; t <= this.selection.rightCol; t++)
              this._checkCellFormat(e, t, i);
        }
        return i;
      }),
      (t.prototype.insertRows = function (e, t) {
        var o,
          n =
            wjcCore.isNumber(e) && e >= 0
              ? e
              : this.selection && this.selection.topRow > -1
              ? this.selection.topRow
              : 0,
          i = wjcCore.isNumber(t) ? t : 1,
          r = new _RowsChangedAction(this),
          l = this.rows[n];
        if (this.selectedSheet) {
          if (
            (this._clearCalcEngine(),
            this.finishEditing(),
            0 === n && l && l.constructor === HeaderRow && (n = 1),
            this.onPrepareChangingRow(),
            this._updateCellsForUpdatingRow(this.rows.length, n, i),
            (r._affectedFormulas = this._updateAffectedFormula(n, i, !0, !0)),
            (r._affectedDefinedNameVals = this._updateAffectedNamedRanges(
              n,
              i,
              !0,
              !0
            )),
            this.collectionView)
          )
            this.collectionView.beginUpdate(),
              this.itemsSource instanceof wjcCore.CollectionView
                ? this.itemsSource.items.splice(n - 1, 0, {})
                : this.itemsSource.splice(n - 1, 0, {}),
              this.collectionView.endUpdate();
          else {
            for (this.rows.beginUpdate(), o = 0; o < i; o++)
              this.rows.insert(n, new wjcGrid.Row());
            this.rows.endUpdate();
          }
          this._updateTablesForUpdatingRow(n, i),
            (this.selection &&
              -1 !== this.selection.row &&
              -1 !== this.selection.col) ||
              (this.selection = new wjcGrid.CellRange(0, 0)),
            r.saveNewState(),
            this._undoStack._addAction(r),
            this.onRowChanged(new RowColumnChangedEventArgs(n, i, !0));
        }
      }),
      (t.prototype.deleteRows = function (e, t) {
        var o,
          n,
          i =
            wjcCore.isNumber(t) && t >= 0
              ? t
              : this.selection && this.selection.topRow > -1
              ? this.selection.bottomRow - this.selection.topRow + 1
              : 1,
          r =
            wjcCore.isNumber(e) && e >= 0
              ? e
              : this.selection && this.selection.topRow > -1
              ? this.selection.topRow
              : -1,
          l =
            wjcCore.isNumber(e) && e >= 0
              ? e + i - 1
              : this.selection && this.selection.topRow > -1
              ? this.selection.bottomRow
              : -1,
          s = new _RowsChangedAction(this),
          a = !1;
        if (
          this.selectedSheet &&
          (this._clearCalcEngine(), this.finishEditing(), r > -1 && l > -1)
        ) {
          for (
            this.onPrepareChangingRow(),
              this._updateCellsForUpdatingRow(this.rows.length, r, i, !0),
              s._affectedFormulas = this._updateAffectedFormula(
                l,
                l - r + 1,
                !1,
                !0
              ),
              s._affectedDefinedNameVals = this._updateAffectedNamedRanges(
                l,
                l - r + 1,
                !1,
                !0
              ),
              this.rows.beginUpdate();
            l >= r;
            l--
          )
            ((o = this.rows[l]) && o.constructor === HeaderRow) ||
              (o.dataItem && this.collectionView
                ? (this.collectionView.beginUpdate(),
                  this._getCvIndex(l) > -1 &&
                    (this.itemsSource instanceof wjcCore.CollectionView
                      ? this.itemsSource.items.splice(l - 1, 1)
                      : this.itemsSource.splice(l - 1, 1)),
                  this.collectionView.endUpdate())
                : this.rows.removeAt(l),
              (a = !0));
          this.rows.endUpdate(),
            (s._deletedTables = this._updateTablesForUpdatingRow(r, i, !0)),
            (n = this.rows.length),
            this.selectedSheet.selectionRanges.clear(),
            0 === n
              ? (this.select(new wjcGrid.CellRange()),
                'move' === this.hostElement.style.cursor &&
                  (this.hostElement.style.cursor = 'default'))
              : l === n - 1
              ? this.select(
                  new wjcGrid.CellRange(l, 0, l, this.columns.length - 1)
                )
              : this.select(
                  new wjcGrid.CellRange(
                    this.selection.topRow,
                    this.selection.col,
                    this.selection.topRow,
                    this.selection.col2
                  )
                ),
            a &&
              (s.saveNewState(),
              this._undoStack._addAction(s),
              this.onRowChanged(new RowColumnChangedEventArgs(r, i, !1)));
        }
      }),
      (t.prototype.insertColumns = function (e, t) {
        var o,
          n,
          i =
            wjcCore.isNumber(e) && e >= 0
              ? e
              : this.selection && this.selection.leftCol > -1
              ? this.selection.leftCol
              : 0,
          r = wjcCore.isNumber(t) ? t : 1,
          l = new _ColumnsChangedAction(this);
        if (this.selectedSheet && !this.itemsSource) {
          for (
            this._clearCalcEngine(),
              this.finishEditing(),
              this.onPrepareChangingColumn(),
              this._updateCellsForUpdatingColumn(this.columns.length, i, r),
              l._affectedFormulas = this._updateAffectedFormula(i, r, !0, !1),
              l._affectedDefinedNameVals = this._updateAffectedNamedRanges(
                i,
                r,
                !0,
                !1
              ),
              this.columns.beginUpdate(),
              n = 0;
            n < r;
            n++
          )
            ((o = new wjcGrid.Column()).isRequired = !1),
              this.columns.insert(i, o);
          this.columns.endUpdate(),
            this._updateTablesForUpdatingColumn(i, r),
            (this.selection &&
              -1 !== this.selection.row &&
              -1 !== this.selection.col) ||
              (this.selection = new wjcGrid.CellRange(0, 0)),
            l.saveNewState(),
            this._undoStack._addAction(l),
            this.onColumnChanged(new RowColumnChangedEventArgs(i, r, !0));
        }
      }),
      (t.prototype.deleteColumns = function (e, t) {
        var o,
          n =
            wjcCore.isNumber(t) && t >= 0
              ? t
              : this.selection && this.selection.leftCol > -1
              ? this.selection.rightCol - this.selection.leftCol + 1
              : 1,
          i =
            wjcCore.isNumber(e) && e >= 0
              ? e
              : this.selection && this.selection.leftCol > -1
              ? this.selection.leftCol
              : -1,
          r =
            wjcCore.isNumber(e) && e >= 0
              ? e + n - 1
              : this.selection && this.selection.leftCol > -1
              ? this.selection.rightCol
              : -1,
          l = new _ColumnsChangedAction(this);
        if (
          this.selectedSheet &&
          !this.itemsSource &&
          (this._clearCalcEngine(), this.finishEditing(), i > -1 && r > -1)
        ) {
          for (
            this.onPrepareChangingColumn(),
              this._updateCellsForUpdatingColumn(this.columns.length, i, n, !0),
              l._affectedFormulas = this._updateAffectedFormula(
                r,
                r - i + 1,
                !1,
                !1
              ),
              l._affectedDefinedNameVals = this._updateAffectedNamedRanges(
                r,
                r - i + 1,
                !1,
                !1
              ),
              l._deletedTables = this._updateTablesForUpdatingColumn(i, n, !0),
              this.columns.beginUpdate();
            r >= i;
            r--
          )
            this.columns.removeAt(r), this._sortManager.deleteSortLevel(r);
          this.columns.endUpdate(),
            this._sortManager.commitSort(!1),
            (o = this.columns.length),
            this.selectedSheet.selectionRanges.clear(),
            0 === o
              ? (this.select(new wjcGrid.CellRange()),
                'move' === this.hostElement.style.cursor &&
                  (this.hostElement.style.cursor = 'default'))
              : r === o - 1
              ? this.select(
                  new wjcGrid.CellRange(0, r, this.rows.length - 1, r)
                )
              : this.select(
                  new wjcGrid.CellRange(
                    this.selection.row,
                    this.selection.leftCol,
                    this.selection.row2,
                    this.selection.leftCol
                  )
                ),
            l.saveNewState(),
            this._undoStack._addAction(l),
            this.onColumnChanged(new RowColumnChangedEventArgs(i, n, !1));
        }
      }),
      (t.prototype.mergeRange = function (e, t) {
        void 0 === t && (t = !1);
        var o,
          n,
          i,
          r,
          l = e || this.selection,
          s = -1;
        if (this.selectedSheet) {
          if (l) {
            if (1 === l.rowSpan && 1 === l.columnSpan) return;
            for (o = l.topRow; o <= l.bottomRow; o++)
              for (n = l.leftCol; n <= l.rightCol; n++)
                if (this.selectedSheet.findTable(o, n)) return;
            if (
              (e ||
                t ||
                ((r = new _CellMergeAction(this)), this.hostElement.focus()),
              !this._resetMergedRange(l))
            ) {
              for (o = l.topRow; o <= l.bottomRow; o++)
                if ((s < 0 && this.rows[o].visible && (s = o), !(s < 0)))
                  for (n = l.leftCol; n <= l.rightCol; n++)
                    (i = o * this.columns.length + n),
                      (this.selectedSheet._mergedRanges[i] =
                        new wjcGrid.CellRange(
                          s,
                          l.leftCol,
                          l.bottomRow,
                          l.rightCol
                        ));
              e || t || (r.saveNewState(), this._undoStack._addAction(r));
            }
          }
          e || this.refresh();
        }
      }),
      (t.prototype.getMergedRange = function (t, o, n, i) {
        void 0 === i && (i = !0);
        var r,
          l,
          s,
          a,
          h = o * this.columns.length + n,
          c = this.selectedSheet ? this.selectedSheet._mergedRanges[h] : null;
        return t === this.cells && c
          ? !c.isSingleCell &&
            (this.frozenRows > 0 || this.frozenColumns > 0) &&
            ((c.topRow < this.frozenRows && c.bottomRow >= this.frozenRows) ||
              (c.leftCol < this.frozenColumns &&
                c.rightCol >= this.frozenColumns))
            ? ((r = c.topRow),
              (l = c.bottomRow),
              (s = c.leftCol),
              (a = c.rightCol),
              o >= this.frozenRows &&
                c.topRow < this.frozenRows &&
                (r = this.frozenRows),
              o < this.frozenRows &&
                c.bottomRow >= this.frozenRows &&
                (l = this.frozenRows - 1),
              l >= this.rows.length && (l = this.rows.length - 1),
              n >= this.frozenColumns &&
                c.leftCol < this.frozenColumns &&
                (s = this.frozenColumns),
              n < this.frozenColumns &&
                c.rightCol >= this.frozenColumns &&
                (a = this.frozenColumns - 1),
              a >= this.columns.length && (a = this.columns.length - 1),
              new wjcGrid.CellRange(r, s, l, a))
            : c.bottomRow >= this.rows.length
            ? new wjcGrid.CellRange(
                c.topRow,
                c.leftCol,
                this.rows.length - 1,
                c.rightCol
              )
            : c.rightCol >= this.columns.length
            ? new wjcGrid.CellRange(
                c.topRow,
                c.leftCol,
                c.bottomRow,
                this.columns.length - 1
              )
            : c.clone()
          : n >= 0 &&
            this.columns &&
            this.columns.length > n &&
            o >= 0 &&
            this.rows &&
            this.rows.length > o
          ? e.prototype.getMergedRange.call(this, t, o, n, i)
          : null;
      }),
      (t.prototype.evaluate = function (e, t, o) {
        return this._evaluate(e, t, o);
      }),
      (t.prototype.getCellValue = function (e, t, o, n) {
        void 0 === o && (o = !1);
        var i,
          r,
          l =
            n && n !== this.selectedSheet ? n.grid.columns[t] : this.columns[t],
          s = this._getCellStyle(e, t, n);
        return (
          (i = s && s.format ? s.format : ''),
          (r =
            n && n !== this.selectedSheet
              ? n.grid.getCellData(e, t, !1)
              : this.getCellData(e, t, !1)),
          wjcCore.isString(r) &&
            '=' === r[0] &&
            (r = this._evaluate(r, o ? i : '', n, e, t)),
          o
            ? (r = this._formatEvaluatedResult(r, l, i))
            : null == r || wjcCore.isPrimitive(r) || (r = r.value),
          null == r ? '' : r
        );
      }),
      (t.prototype.showFunctionList = function (e) {
        var t,
          o,
          n = this,
          i = n._cumulativeOffset(e),
          r = n._cumulativeOffset(n._root);
        (n._functionTarget = wjcCore.tryCast(e, HTMLInputElement)),
          n._functionTarget &&
          n._functionTarget.value &&
          '=' === n._functionTarget.value[0]
            ? ((n._functionList._cv.filter = function (e) {
                var t,
                  o = e.actualvalue.toLowerCase(),
                  i = n._getCurrentFormulaIndex(n._functionTarget.value);
                return (
                  -1 === i && (i = 0),
                  ((t = n._functionTarget.value
                    .substr(i + 1)
                    .trim()
                    .toLowerCase()).length > 0 &&
                    0 === o.indexOf(t)) ||
                    '=' === n._functionTarget.value
                );
              }),
              (n._functionList.selectedIndex = 0),
              (t =
                i.y +
                e.clientHeight +
                2 +
                (wjcCore.hasClass(e, 'wj-grid-editor') ? this._ptScrl.y : 0)),
              (o =
                i.x +
                (wjcCore.hasClass(e, 'wj-grid-editor') ? this._ptScrl.x : 0)),
              wjcCore.setCss(n._functionListHost, {
                height: n._functionList._cv.items.length > 5 ? '218px' : 'auto',
                display:
                  n._functionList._cv.items.length > 0 ? 'block' : 'none',
                top: '',
                left: '',
              }),
              (n._functionListHost.scrollTop = 0),
              n._functionListHost.offsetHeight + t > r.y + n._root.offsetHeight
                ? (t =
                    t - e.clientHeight - n._functionListHost.offsetHeight - 5)
                : (t += 5),
              n._functionListHost.offsetWidth + o > r.x + n._root.offsetWidth &&
                (o =
                  r.x + n._root.offsetWidth - n._functionListHost.offsetWidth),
              wjcCore.setCss(n._functionListHost, {
                top: t,
                left: o,
              }))
            : n.hideFunctionList();
      }),
      (t.prototype.hideFunctionList = function () {
        this._functionListHost.style.display = 'none';
      }),
      (t.prototype.selectPreviousFunction = function () {
        this._functionList.selectedIndex > 0 &&
          this._functionList.selectedIndex--;
      }),
      (t.prototype.selectNextFunction = function () {
        this._functionList.selectedIndex <
          this._functionList.itemsSource.length &&
          this._functionList.selectedIndex++;
      }),
      (t.prototype.applyFunctionToCell = function () {
        var e,
          t = this;
        t._functionTarget &&
          (-1 === (e = t._getCurrentFormulaIndex(t._functionTarget.value))
            ? (e = t._functionTarget.value.indexOf('='))
            : (e += 1),
          (t._functionTarget.value =
            t._functionTarget.value.substring(0, e) +
            t._functionList.selectedValue +
            '('),
          '=' !== t._functionTarget.value[0] &&
            (t._functionTarget.value = '=' + t._functionTarget.value),
          t._functionTarget.focus(),
          t.hideFunctionList());
      }),
      (t.prototype.save = function (e) {
        var t = this._saveToWorkbook();
        return e && t.save(e), t;
      }),
      (t.prototype.saveAsync = function (e, t, o) {
        var n = this._saveToWorkbook();
        return n.saveAsync(e, t, o), n;
      }),
      (t.prototype.saveToWorkbookOM = function () {
        return this._saveToWorkbook()._serialize();
      }),
      (t.prototype.load = function (e) {
        var t,
          o,
          n = this;
        if (e instanceof Blob)
          ((o = new FileReader()).onload = function () {
            var e = o.result;
            (e = wjcXlsx.Workbook._base64EncArr(new Uint8Array(e))),
              (t = new wjcXlsx.Workbook()).load(e),
              n._loadFromWorkbook(t);
          }),
            o.readAsArrayBuffer(e);
        else if (e instanceof wjcXlsx.Workbook) n._loadFromWorkbook(e);
        else {
          if (e instanceof ArrayBuffer)
            e = wjcXlsx.Workbook._base64EncArr(new Uint8Array(e));
          else if (!wjcCore.isString(e)) throw 'Invalid workbook.';
          (t = new wjcXlsx.Workbook()).load(e), n._loadFromWorkbook(t);
        }
      }),
      (t.prototype.loadAsync = function (e, t, o) {
        var n,
          i,
          r = this;
        if (e instanceof Blob)
          ((i = new FileReader()).onload = function () {
            var e = i.result;
            (e = wjcXlsx.Workbook._base64EncArr(new Uint8Array(e))),
              (n = new wjcXlsx.Workbook()).loadAsync(
                e,
                function (e) {
                  r._loadFromWorkbook(e), t && t(e);
                },
                o
              );
          }),
            i.readAsArrayBuffer(e);
        else if (e instanceof wjcXlsx.Workbook)
          r._loadFromWorkbook(e), t && t(e);
        else {
          if (e instanceof ArrayBuffer)
            e = wjcXlsx.Workbook._base64EncArr(new Uint8Array(e));
          else if (!wjcCore.isString(e)) throw 'Invalid workbook.';
          (n = new wjcXlsx.Workbook()).loadAsync(
            e,
            function (e) {
              r._loadFromWorkbook(e), t && t(e);
            },
            o
          );
        }
      }),
      (t.prototype.loadFromWorkbookOM = function (e) {
        var t;
        e instanceof wjcXlsx.Workbook
          ? (t = e)
          : (t = new wjcXlsx.Workbook())._deserialize(e),
          this._loadFromWorkbook(t);
      }),
      (t.prototype.undo = function () {
        var e = this;
        setTimeout(function () {
          e._undoStack.undo();
        }, 100);
      }),
      (t.prototype.redo = function () {
        var e = this;
        setTimeout(function () {
          e._undoStack.redo();
        }, 100);
      }),
      (t.prototype.select = function (t, o) {
        void 0 === o && (o = !0);
        var n, i, r;
        if (
          (wjcCore.isNumber(t) &&
            wjcCore.isNumber(o) &&
            ((t = new wjcGrid.CellRange(t, o)), (o = !0)),
          t.rowSpan !== this.rows.length &&
            t.columnSpan !== this.columns.length)
        )
          for (i = t.topRow; i <= t.bottomRow; i++)
            for (r = t.leftCol; r <= t.rightCol; r++)
              (n = this.getMergedRange(this.cells, i, r)) &&
                !t.equals(n) &&
                (t.row <= t.row2
                  ? ((t.row = Math.min(t.topRow, n.topRow)),
                    (t.row2 = Math.max(t.bottomRow, n.bottomRow)))
                  : ((t.row = Math.max(t.bottomRow, n.bottomRow)),
                    (t.row2 = Math.min(t.topRow, n.topRow))),
                t.col <= t.col2
                  ? ((t.col = Math.min(t.leftCol, n.leftCol)),
                    (t.col2 = Math.max(t.rightCol, n.rightCol)))
                  : ((t.col = Math.max(t.rightCol, n.rightCol)),
                    (t.col2 = Math.min(t.leftCol, n.leftCol))));
        this.collectionView &&
          0 === t.topRow &&
          t.bottomRow === this.rows.length - 1 &&
          0 === t.leftCol &&
          t.rightCol === this.columns.length - 1 &&
          ((t.row = 1), (t.row2 = this.rows.length - 1)),
          e.prototype.select.call(this, t, o);
      }),
      (t.prototype.addCustomFunction = function (e, t, o, n, i) {
        wjcCore._deprecated('addCustomFunction', 'addFunction'),
          this._calcEngine.addCustomFunction(e, t, n, i),
          this._addCustomFunctionDescription(e, o);
      }),
      (t.prototype.addFunction = function (e, t, o, n, i) {
        this._calcEngine.addFunction(e, t, n, i),
          this._addCustomFunctionDescription(e, o);
      }),
      (t.prototype.dispose = function () {
        var t = window.navigator.userAgent;
        (this._needCopyToSheet = !1),
          document.removeEventListener('mousemove', this._mouseMoveHdl),
          document.body.removeEventListener('click', this._clickHdl),
          (t.match(/iPad/i) || t.match(/iPhone/i)) &&
            (document.body.removeEventListener(
              'touchstart',
              this._touchStartHdl
            ),
            document.body.removeEventListener('touchend', this._touchEndHdl)),
          this.hideFunctionList(),
          e.prototype.dispose.call(this);
      }),
      (t.prototype.getClipString = function (e) {
        var t,
          o,
          n,
          i,
          r = '',
          l = !0;
        if (((this._isCutting = !1), !e)) {
          if (this._isMultipleRowsSelected()) {
            for (
              r = '',
                0 ===
                  (t = this.selectedSheet.selectionRanges.slice(0)).length &&
                  (t = [this.selection]),
                t.sort(this._sortByRow),
                n = 0;
              n < t.length;
              n++
            )
              r && (r += '\n'), (r += this.getClipString(t[n]));
            return r;
          }
          if (this._isMultipleColumnsSelected())
            for (
              r = '',
                0 ===
                  (t = this.selectedSheet.selectionRanges.slice(0)).length &&
                  (t = [this.selection]),
                t.sort(this._sortByColumn),
                o = 0,
                l = !0;
              o < this.rows.length;
              o++
            ) {
              for (l || (r += '\n'), l = !1, n = 0, c = !0; n < t.length; n++)
                c || (r += '\t'), (c = !1), (r += this.getClipString(t[n]));
              return r;
            }
          else
            switch (((e = this.selection), this.selectionMode)) {
              case wjcGrid.SelectionMode.Row:
              case wjcGrid.SelectionMode.RowRange:
                (e.col = 0), (e.col2 = this.columns.length - 1);
                break;
              case wjcGrid.SelectionMode.ListBox:
                (e.col = 0), (e.col2 = this.columns.length - 1);
                for (var s = 0; s < this.rows.length; s++)
                  this.rows[s].isSelected &&
                    this.rows[s].isVisible &&
                    ((e.row = e.row2 = s),
                    r && (r += '\n'),
                    (r += this.getClipString(e)));
                return r;
            }
        }
        if (!(e = wjcCore.asType(e, wjcGrid.CellRange)).isValid) return '';
        for (var a = e.topRow; a <= e.bottomRow; a++)
          if (this.rows[a].isVisible) {
            l || (r += '\n'), (l = !1);
            for (var h = e.leftCol, c = !0; h <= e.rightCol; h++)
              this.columns[h].isVisible &&
                (c || (r += '\t'),
                (c = !1),
                (i = (i = this.getCellValue(a, h, !0).toString()).replace(
                  /\t/g,
                  ' '
                )).indexOf('\n') > -1 &&
                  (i = '"' + i.replace(/"/g, '""') + '"'),
                (r += i));
          }
        return r;
      }),
      (t.prototype.setClipString = function (t, o) {
        var n,
          i,
          r,
          l,
          s,
          a,
          h,
          c,
          d,
          u,
          _,
          g,
          w,
          f,
          p,
          m,
          C,
          b,
          S,
          y,
          v,
          R,
          x,
          T,
          j,
          k = null == o,
          D = !1,
          I = !1;
        if (
          ((o = o ? wjcCore.asType(o, wjcGrid.CellRange) : this.selection),
          (t = wjcCore
            .asString(t)
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')) &&
            '\n' == t[t.length - 1] &&
            (t = t.substring(0, t.length - 1)),
          (T = t),
          (a = this._edtHdl._parseClipString(wjcCore.asString(t))),
          k &&
            !o.isSingleCell &&
            a.length &&
            this._edtHdl._expandClipRows(a, o),
          (I = this._containsMultiLineText(a)),
          (!this._copiedRanges ||
            0 === this._copiedRanges.length ||
            (T.trim() !==
              this._getRangeString(
                this._copiedRanges,
                this._copiedSheet
              ).trim() &&
              !this._containsRandFormula(
                this._copiedRanges,
                this._copiedSheet
              )) ||
            this._cutValue) &&
            !I)
        )
          return (
            T !== this._cutValue &&
              ((this._cutValue = null),
              e.prototype.setClipString.call(this, t)),
            (this._copiedRanges = null),
            void (this._copiedSheet = null)
          );
        if (
          ((n = new wjcGrid.CellRange(o.topRow, o.leftCol)),
          this.beginUpdate(),
          I ||
            !this._copiedRanges ||
            this._copiedRanges.length > 1 ||
            0 === this._copiedRanges.length)
        )
          for (
            i = o.topRow,
              l = (S =
                this._copiedRanges && this._copiedRanges.length > 1
                  ? this._copiedRanges[0]
                  : new wjcGrid.CellRange()).topRow,
              u = 0;
            u < a.length && i < this.rows.length;
            u++, i++
          )
            if (this.rows[i].isVisible) {
              for (
                h = a[u], s = S.leftCol, b = (r = o.leftCol) - s, _ = 0;
                _ < h.length && r < this.columns.length;
                _++, r++
              )
                this.columns[r].isVisible
                  ? ((c = h[_]),
                    this.columns[r].isReadOnly ||
                      this.rows[i].isReadOnly ||
                      ((D = this._postSetClipStringProcess(c, i, r, l, s)),
                      (n.row2 = Math.max(n.row2, i)),
                      (n.col2 = Math.max(n.col2, r))),
                    s >= 0 && s++)
                  : _--;
              l >= 0 && l++;
            } else u--;
        else if (this._copiedRanges && 1 === this._copiedRanges.length)
          for (
            y = 0,
              S = this._copiedRanges[0],
              j = this._getRangeString(
                this._copiedRanges,
                this._copiedSheet,
                !1
              ),
              a = this._edtHdl._parseClipString(j),
              k &&
                !o.isSingleCell &&
                a.length &&
                this._edtHdl._expandClipRows(a, o),
              R = S.rowSpan > o.rowSpan ? S.rowSpan : o.rowSpan,
              x = S.columnSpan > o.columnSpan ? S.columnSpan : o.columnSpan,
              i = o.topRow,
              u = 0;
            u < a.length && i < this.rows.length;
            u++, i++
          )
            if (((v = 0), this.rows[i].isVisible)) {
              for (
                ;
                this._copiedSheet.grid.rows[S.topRow + y] &&
                !this._copiedSheet.grid.rows[S.topRow + y].isVisible;

              )
                y++;
              if (y >= S.rowSpan) {
                if (R % S.rowSpan != 0 || x % S.columnSpan != 0) break;
                y %= S.rowSpan;
              }
              if (!this._copiedSheet.grid.rows[S.topRow + y]) break;
              for (
                C = i - S.topRow - y, h = a[u], r = o.leftCol, _ = 0;
                _ < h.length && r < this.columns.length;
                _++, r++
              )
                if (this.columns[r] && this.columns[r].isVisible) {
                  if (v >= S.columnSpan) {
                    if (R % S.rowSpan != 0 || x % S.columnSpan != 0) break;
                    v %= S.columnSpan;
                  }
                  if (
                    ((b = r - S.leftCol - v),
                    !this.columns[r].isReadOnly && !this.rows[i].isReadOnly)
                  ) {
                    if (
                      (c = h[_]) &&
                      'string' == typeof c &&
                      '=' === c[0] &&
                      (0 !== C || 0 !== b) &&
                      (d = c.match(/((\w+)\!)?\$?[A-Za-z]{1,2}\$?\d+/g)) &&
                      d.length > 0
                    )
                      for (g = 0; g < d.length; g++)
                        (w = d[g]),
                          ((f = c.indexOf(w)) > 0 &&
                            ('"' === c[f - 1] || /[\d\w]/.test(c[f - 1]))) ||
                            (((p = wjcXlsx.Workbook.tableAddress(w)).row +=
                              p.absRow ? 0 : C),
                            (p.col += p.absCol ? 0 : b),
                            (m = wjcXlsx.Workbook.xlsxAddress(
                              p.row,
                              p.col,
                              p.absRow,
                              p.absCol
                            )),
                            (c = c.replace(w, m)));
                    (D = this._postSetClipStringProcess(
                      c,
                      i,
                      r,
                      S.topRow + y,
                      S.leftCol + v
                    )),
                      (n.row2 = Math.max(n.row2, i)),
                      (n.col2 = Math.max(n.col2, r));
                  }
                  v++;
                } else _--;
              y++;
            } else u--;
        this._isCutting &&
          (this._delCutData(),
          (this._isCutting = !1),
          (this._cutValue = T),
          (this._copiedRanges = null),
          (this._copiedSheet = null)),
          this.endUpdate(),
          this.collectionView && D && this.collectionView.refresh(),
          this.select(n);
      }),
      (t.prototype.getBuiltInTableStyle = function (e) {
        var t;
        return (
          null == (t = this._builtInTableStylesCache[e.toLowerCase()]) &&
            ((t = this._createBuiltInTableStyle(e)),
            Object.freeze(t),
            (this._builtInTableStylesCache[e.toLowerCase()] = t)),
          t
        );
      }),
      (t.prototype.addTable = function (e, t, o, n, i, r, l, s) {
        var a = new wjcGrid.CellRange(e, t, e + o - 1, t + n - 1),
          h = null == s ? this : s.grid;
        if (
          !a.isValid ||
          a.bottomRow >= h.rows.length ||
          a.rightCol >= h.columns.length
        )
          throw 'The range of the table is invalid.';
        return this._addTable(a, i, r, null, l, s);
      }),
      (t.prototype.addTableFromDataSource = function (e, t, o, n, i, r, l) {
        var s,
          a,
          h,
          c,
          d,
          u,
          _,
          g = null == l ? this : l.grid;
        if (null == o || 0 === o.length) throw 'Invalid dataSource.';
        if (null == (s = Object.keys(o[0])) || 0 === s.length)
          throw 'Invalid dataSource.';
        var w = null == (r && r.showHeaderRow) || r.showHeaderRow,
          f = !(!r || !r.showTotalRow),
          p = e + (w ? 1 : 0),
          m = p + o.length - 1 + (f ? 1 : 0);
        if (t + s.length > g.columns.length || m >= g.rows.length)
          throw 'The range of the table is out of the range of the sheet.';
        for (g.beginUpdate(), c = 0; c < o.length; c++)
          for (d = 0; d < s.length; d++)
            (u = s[d]), g.setCellData(p + c, t + d, o[c][u]);
        for (a = [], d = 0; d < s.length; d++)
          (u = s[d]),
            w && g.setCellData(e, t + d, u),
            (h = new TableColumn(u)),
            0 === d
              ? (h.totalRowLabel = 'Total')
              : d === s.length - 1 && (h.totalRowFunction = 'Sum'),
            a.push(h);
        return (
          g.endUpdate(),
          (_ = new wjcGrid.CellRange(e, t, m, t + s.length - 1)),
          this._addTable(_, n, i, a, r, l)
        );
      }),
      (t.prototype._getCvIndex = function (t) {
        return t > -1 && this.collectionView
          ? this.rows[t] instanceof HeaderRow
            ? t
            : e.prototype._getCvIndex.call(this, t)
          : -1;
      }),
      (t.prototype._init = function () {
        var e = this,
          t = this,
          o = window.navigator.userAgent,
          n = function (e) {
            document.removeEventListener('mouseup', n), t._mouseUp(e);
          };
        t.hostElement.setAttribute('tabindex', '-1'),
          (t._divContainer = t.hostElement.querySelector(
            '[wj-part="container"]'
          )),
          (t._tabHolder = new _TabHolder(
            t.hostElement.querySelector('[wj-part="tab-holder"]'),
            t
          )),
          (t._contextMenu = new _ContextMenu(
            t.hostElement.querySelector('[wj-part="context-menu"]'),
            t
          )),
          (t._gpCells = new FlexSheetPanel(
            t,
            wjcGrid.CellType.Cell,
            t.rows,
            t.columns,
            t._eCt
          )),
          (t._gpCHdr = new FlexSheetPanel(
            t,
            wjcGrid.CellType.ColumnHeader,
            t._hdrRows,
            t.columns,
            t._eCHdrCt
          )),
          (t._gpRHdr = new FlexSheetPanel(
            t,
            wjcGrid.CellType.RowHeader,
            t.rows,
            t._hdrCols,
            t._eRHdrCt
          )),
          (t._gpTL = new FlexSheetPanel(
            t,
            wjcGrid.CellType.TopLeft,
            t._hdrRows,
            t._hdrCols,
            t._eTLCt
          )),
          (t._sortManager = new SortManager(t)),
          (t._filter = new _FlexSheetFilter(t)),
          t._filter.filterApplied.addHandler(function () {
            t.selectedSheet &&
              ((t.selectedSheet._filterDefinition = t._filter.filterDefinition),
              t.selectedSheet.itemsSource &&
                (t.selectedSheet._storeRowSettings(),
                t.selectedSheet._setRowSettings()));
          }),
          (t._calcEngine = new _CalcEngine(t)),
          t._calcEngine.unknownFunction.addHandler(function (e, o) {
            t.onUnknownFunction(o);
          }, t),
          t._initFuncsList(),
          (t._undoStack = new UndoStack(t)),
          t.loadedRows.addHandler(function () {
            if (t.itemsSource && !(t.rows[0] instanceof HeaderRow)) {
              for (var e, o = new HeaderRow(), n = 0; n < t.columns.length; n++)
                (e = t.columns[n]),
                  o._ubv || (o._ubv = {}),
                  (o._ubv[e._hash] = e.header);
              t.rows[0] instanceof wjcGrid._NewRowTemplate
                ? t.rows.insert(1, o)
                : t.rows.insert(0, o);
            }
            t._filter && t._filter.apply();
          }),
          t.itemsSourceChanged.addHandler(function () {
            var e;
            for (e = 0; e < t.columns.length; e++) t.columns[e].isRequired = !1;
          }),
          t.copied.addHandler(function (e, o) {
            var n;
            (t._copiedSheet = t.selectedSheet),
              (t._needCopyToSheet = !0),
              t._isMultipleRowsSelected()
                ? ((n = t.selectedSheet.selectionRanges.slice(0)).sort(
                    t._sortByRow
                  ),
                  (t._copiedRanges = n))
                : t._isMultipleColumnsSelected()
                ? ((n = t.selectedSheet.selectionRanges.slice(0)).sort(
                    t._sortByColumn
                  ),
                  (t._copiedRanges = n))
                : (t._copiedRanges = [o.range]);
          }),
          t.rows.collectionChanged.addHandler(function (e, o) {
            t._clearForEmptySheet('rows'),
              t.itemsSource ||
                !t.selectedSheet ||
                !t._needCopyToSheet ||
                t._isCopying ||
                t._isUndoing ||
                o.item instanceof wjcGrid._NewRowTemplate ||
                t._copyRowsToSelectedSheet();
          }, t),
          t.columns.collectionChanged.addHandler(function (e, o) {
            t._clearForEmptySheet('columns'),
              t.selectedSheet &&
                t._needCopyToSheet &&
                !t._isCopying &&
                !t._isUndoing &&
                t._copyColumnsToSelectedSheet();
          }, t),
          t.definedNames.collectionChanged.addHandler(function (e, o) {
            if (
              o.action === wjcCore.NotifyCollectionChangedAction.Add ||
              o.action === wjcCore.NotifyCollectionChangedAction.Change
            ) {
              var n =
                o.action === wjcCore.NotifyCollectionChangedAction.Add
                  ? 'inserted'
                  : 'updated';
              if (!(o.item instanceof DefinedName))
                throw (
                  (t.definedNames.remove(o.item),
                  'Invalid defined name item object was ' +
                    n +
                    '.  The DefinedName instance should be ' +
                    n +
                    ' in the definedNames array.')
                );
              if (!o.item || !o.item.name || null == o.item.value)
                throw (
                  (t.definedNames.remove(o.item),
                  'Invalid defined name was ' + n + '.')
                );
              if (
                null != o.item.sheetName &&
                !t._validateSheetName(o.item.sheetName)
              )
                throw (
                  (t.definedNames.remove(o.item),
                  'The sheet name (' +
                    o.item.sheetName +
                    ') does not exist in FlexSheet.')
                );
              if (
                t._checkExistDefinedName(o.item.name, o.item.sheetName, o.index)
              )
                throw (
                  (t.definedNames.remove(o.item),
                  'The ' + o.item.name + ' already existed in definedNames.')
                );
            }
          }),
          t.addEventListener(
            t.hostElement,
            'mousedown',
            function (e) {
              document.addEventListener('mouseup', n),
                t._isDescendant(t._divContainer, e.target) && t._mouseDown(e);
            },
            !0
          ),
          t.addEventListener(t.hostElement, 'drop', function () {
            t._columnHeaderClicked = !1;
          }),
          t.addEventListener(t.hostElement, 'contextmenu', function (o) {
            var n, i, r, l, s, a, h, c, d;
            o.defaultPrevented ||
              t.activeEditor ||
              (t._isContextMenuKeyDown &&
              t.selection.row > -1 &&
              t.selection.col > -1 &&
              t.rows.length > 0 &&
              t.columns.length > 0
                ? ((r = t.columns[t.selection.col]),
                  (i = t.rows[t.selection.row]),
                  (h = t._cumulativeOffset(t.hostElement)),
                  (c = t._cumulativeScrollOffset(t.hostElement)),
                  (l =
                    r.pos +
                    t._eCt.offsetLeft +
                    h.x +
                    r.renderSize / 2 +
                    t._ptScrl.x),
                  (s =
                    i.pos +
                    t._eCt.offsetTop +
                    h.y +
                    i.renderSize / 2 +
                    t._ptScrl.y),
                  (a = new wjcCore.Point(l - c.x, s - c.y)),
                  (n = t.hitTest(l, s)),
                  (t._isContextMenuKeyDown = !1))
                : (n = t.hitTest(o)),
              o.preventDefault(),
              n &&
                n.cellType !== wjcGrid.CellType.None &&
                ((d = new wjcGrid.CellRange(n.row, n.col)),
                n.cellType !== wjcGrid.CellType.Cell ||
                  d.intersects(t.selection) ||
                  (t.selectedSheet && t.selectedSheet.selectionRanges.clear(),
                  (t.selection = d),
                  t.selectedSheet.selectionRanges.push(d)),
                e.itemsSource || t._contextMenu.show(o, a)));
          }),
          t.prepareCellForEdit.addHandler(t._prepareCellForEditHandler, t),
          t.cellEditEnded.addHandler(function (e, o) {
            (!o.data || (46 !== o.data.keyCode && 8 !== o.data.keyCode)) &&
              setTimeout(function () {
                t.hideFunctionList();
              }, 200);
          }),
          t.cellEditEnding.addHandler(function (e, o) {
            (!o.data || (46 !== o.data.keyCode && 8 !== o.data.keyCode)) &&
              t._clearCalcEngine();
          }),
          t.pasting.addHandler(function () {
            (t._needCopyToSheet = !1), (t._isPasting = !0);
          }),
          t.pasted.addHandler(function () {
            var e = t.selection;
            (t._needCopyToSheet = !0),
              (t._isPasting = !1),
              t._clearCalcEngine(),
              t.collectionView &&
                t.deferUpdate(function (o) {
                  var n = t.rows[e.row];
                  n &&
                    n.dataItem &&
                    (t.collectionView.moveCurrentTo(n.dataItem), t.refresh(!0));
                });
          }),
          t.selectionChanged.addHandler(function () {
            t._enableMulSel ||
              t._isCopying ||
              !t.selectedSheet ||
              t.selectedSheet.selectionRanges.clear();
          }),
          t.resizingColumn.addHandler(function () {
            t._resizing = !0;
          }),
          t.resizingRow.addHandler(function () {
            t._resizing = !0;
          }),
          t.resizedColumn.addHandler(function () {
            t._resizing = !1;
          }),
          t.resizedRow.addHandler(function () {
            t._resizing = !1;
          }),
          t.addEventListener(t.hostElement, 'keydown', function (o) {
            var n, i, r;
            if (
              (o.ctrlKey &&
                (89 === o.keyCode &&
                  (t.finishEditing(), t.redo(), o.preventDefault()),
                90 === o.keyCode &&
                  (t.finishEditing(), t.undo(), o.preventDefault()),
                t.selectedSheet &&
                  65 === o.keyCode &&
                  (t.selectedSheet.selectionRanges.clear(),
                  t.selectedSheet.selectionRanges.push(t.selection)),
                (67 !== o.keyCode && 45 != o.keyCode) ||
                  (t.activeEditor &&
                    ((t._copiedRanges = null), (t._copiedSheet = null)),
                  (t._cutValue = null)),
                88 === o.keyCode &&
                  (t.activeEditor ||
                    (t.finishEditing(),
                    (n = new wjcGrid.CellRangeEventArgs(t.cells, t.selection)),
                    t.onCopying(n) &&
                      ((t._cutValue = null),
                      (i = t.getClipString()),
                      (t._isCutting = !0),
                      wjcCore.Clipboard.copy(i),
                      t.onCopied(n)),
                    o.stopPropagation())),
                o.keyCode === wjcCore.Key.Space &&
                  t.selection.isValid &&
                  t.selectionMode === wjcGrid.SelectionMode.CellRange &&
                  t.select(
                    new wjcGrid.CellRange(
                      e.itemsSource ? 1 : 0,
                      t.selection.col,
                      t.rows.length - 1,
                      t.selection.col
                    )
                  )),
              o.keyCode === wjcCore.Key.Escape && t._contextMenu.hide(),
              (93 === o.keyCode || (o.shiftKey && 121 === o.keyCode)) &&
                (t._isContextMenuKeyDown = !0),
              t.selectedSheet && !t._edtHdl.activeEditor)
            )
              switch (o.keyCode) {
                case wjcCore.Key.Left:
                case wjcCore.Key.Right:
                case wjcCore.Key.Up:
                case wjcCore.Key.Down:
                case wjcCore.Key.PageUp:
                case wjcCore.Key.PageDown:
                case wjcCore.Key.Home:
                case wjcCore.Key.End:
                case wjcCore.Key.Tab:
                case wjcCore.Key.Enter:
                  t.scrollIntoView(t.selection.row, t.selection.col),
                    (r = t.selectedSheet.selectionRanges.length) > 0 &&
                      t.selectedSheet.selectionRanges.splice(
                        r - 1,
                        1,
                        t.selection
                      );
              }
          }),
          t.addEventListener(
            document.body,
            'keydown',
            function (e) {
              (!t._isDescendant(t.hostElement, e.target) &&
                t.hostElement !== e.target) ||
                t._edtHdl.activeEditor ||
                (e.keyCode !== wjcCore.Key.Delete &&
                  e.keyCode !== wjcCore.Key.Back) ||
                (t._delSeletionContent(e), e.preventDefault()),
                t._contextMenu.visible &&
                  (e.keyCode === wjcCore.Key.Down &&
                    t._contextMenu.moveToNext(),
                  e.keyCode === wjcCore.Key.Up && t._contextMenu.moveToPrev(),
                  e.keyCode === wjcCore.Key.Home &&
                    t._contextMenu.moveToFirst(),
                  e.keyCode === wjcCore.Key.End && t._contextMenu.moveToLast(),
                  e.keyCode === wjcCore.Key.Enter &&
                    t._contextMenu.handleContextMenu(),
                  e.preventDefault());
            },
            !0
          ),
          document.body.addEventListener('click', t._clickHdl),
          document.addEventListener('mousemove', t._mouseMoveHdl),
          (o.match(/iPad/i) || o.match(/iPhone/i)) &&
            (document.body.addEventListener('touchstart', t._touchStartHdl),
            document.body.addEventListener('touchend', t._touchEndHdl)),
          t.addEventListener(t.hostElement, 'drop', function () {
            t._htDown = null;
          });
      }),
      (t.prototype._initFuncsList = function () {
        var e = this;
        (e._functionListHost = document.createElement('div')),
          wjcCore.addClass(e._functionListHost, 'wj-flexsheet-formula-list'),
          document.querySelector('body').appendChild(e._functionListHost),
          (e._functionListHost.style.display = 'none'),
          (e._functionListHost.style.position = 'absolute'),
          (e._functionList = new wjcInput.ListBox(e._functionListHost)),
          (e._functionList.isContentHtml = !0),
          (e._functionList.itemsSource = e._getFunctions()),
          (e._functionList.displayMemberPath = 'displayValue'),
          (e._functionList.selectedValuePath = 'actualvalue'),
          e.addEventListener(
            e._functionListHost,
            'click',
            e.applyFunctionToCell.bind(e)
          ),
          e.addEventListener(e._functionListHost, 'keydown', function (t) {
            t.keyCode === wjcCore.Key.Escape &&
              (e.hideFunctionList(), e.hostElement.focus(), t.preventDefault()),
              t.keyCode === wjcCore.Key.Enter &&
                (e.applyFunctionToCell(),
                e.hostElement.focus(),
                t.preventDefault(),
                t.stopPropagation());
          });
      }),
      (t.prototype._getFunctions = function () {
        for (var e, t = [], o = 0; o < FlexSheetFunctions.length; o++)
          (e = FlexSheetFunctions[o]),
            t.push({
              displayValue:
                '<div class="wj-flexsheet-formula-name">' +
                e.name +
                '</div><div class="wj-flexsheet-formula-description">' +
                e.description +
                '</div>',
              actualvalue: e.name,
            });
        return t;
      }),
      (t.prototype._addCustomFunctionDescription = function (e, t) {
        for (
          var o = {
              displayValue:
                '<div class="wj-flexsheet-formula-name">' +
                e +
                '</div>' +
                (t
                  ? '<div class="wj-flexsheet-formula-description">' +
                    t +
                    '</div>'
                  : ''),
              actualvalue: e,
            },
            n = this._functionList.itemsSource,
            i = -1,
            r = 0;
          r < n.length;
          r++
        )
          if (n[r].actualvalue === e) {
            i = r;
            break;
          }
        i > -1 ? n.splice(i, 1, o) : n.push(o);
      }),
      (t.prototype._getCurrentFormulaIndex = function (e) {
        var t = -1;
        return (
          ['+', '-', '*', '/', '^', '(', '&'].forEach(function (o) {
            var n = e.lastIndexOf(o);
            n > t && (t = n);
          }),
          t
        );
      }),
      (t.prototype._prepareCellForEditHandler = function () {
        var e = this,
          t = e._edtHdl._edt;
        t &&
          (e.addEventListener(t, 'keydown', function (t) {
            if (e.isFunctionListOpen)
              switch (t.keyCode) {
                case wjcCore.Key.Up:
                  e.selectPreviousFunction(),
                    t.preventDefault(),
                    t.stopPropagation();
                  break;
                case wjcCore.Key.Down:
                  e.selectNextFunction(),
                    t.preventDefault(),
                    t.stopPropagation();
                  break;
                case wjcCore.Key.Tab:
                case wjcCore.Key.Enter:
                  e.applyFunctionToCell(),
                    t.preventDefault(),
                    t.stopPropagation();
                  break;
                case wjcCore.Key.Escape:
                  e.hideFunctionList(), t.preventDefault(), t.stopPropagation();
              }
          }),
          e.addEventListener(t, 'keyup', function (o) {
            (o.keyCode > 40 || o.keyCode < 32) &&
              o.keyCode !== wjcCore.Key.Tab &&
              o.keyCode !== wjcCore.Key.Escape &&
              setTimeout(function () {
                e.showFunctionList(t);
              }, 0);
          }));
      }),
      (t.prototype._addSheet = function (e, t, o, n, i) {
        var r = this,
          l = new Sheet(r, i, e, t, o);
        return (
          r.sheets.isValidSheetName(l) ||
            l._setValidName(r.sheets.getValidSheetName(l)),
          l.nameChanged.addHandler(function (e, t) {
            r._updateDefinedNameWithSheetRefUpdating(t.oldValue, t.newValue);
          }),
          'number' == typeof n
            ? (n < 0 && (n = 0), n >= r.sheets.length && (n = r.sheets.length))
            : (n = r.sheets.length),
          r.sheets.insert(n, l),
          l
        );
      }),
      (t.prototype._showSheet = function (e) {
        !this.sheets ||
          !this.sheets.length ||
          e >= this.sheets.length ||
          e < 0 ||
          e === this.selectedSheetIndex ||
          (this.sheets[e] && !this.sheets[e].visible) ||
          (this.finishEditing(),
          this._clearCalcEngine(),
          this.selectedSheetIndex > -1 &&
            this.selectedSheetIndex < this.sheets.length &&
            (this._copyTo(this.sheets[this.selectedSheetIndex]),
            this._resetFilterDefinition()),
          this.sheets[e] &&
            ((this._selectedSheetIndex = e), this._copyFrom(this.sheets[e])),
          this._filter.closeEditor());
      }),
      (t.prototype._selectedSheetChange = function (e, t) {
        this._showSheet(t.newValue),
          this.invalidate(!0),
          this.onSelectedSheetChanged(t);
      }),
      (t.prototype._sourceChange = function (e, t) {
        if (
          t.action === wjcCore.NotifyCollectionChangedAction.Add ||
          t.action === wjcCore.NotifyCollectionChangedAction.Change
        )
          t.item._attachOwner(this),
            t.action === wjcCore.NotifyCollectionChangedAction.Add
              ? ((this._addingSheet = !0),
                t.index <= this.selectedSheetIndex &&
                  (this._selectedSheetIndex += 1))
              : t.index === this.selectedSheetIndex &&
                this._copyFrom(t.item, !0),
            (this.selectedSheetIndex = t.index);
        else if (t.action === wjcCore.NotifyCollectionChangedAction.Reset) {
          for (var o = 0; o < this.sheets.length; o++)
            this.sheets[o]._attachOwner(this);
          this.sheets.length > 0
            ? (0 === this.selectedSheetIndex &&
                this._copyFrom(this.selectedSheet, !0),
              (this.selectedSheetIndex = 0))
            : (this.rows.clear(),
              this.columns.clear(),
              (this._selectedSheetIndex = -1));
        } else
          this.sheets.length > 0
            ? this.selectedSheetIndex >= this.sheets.length
              ? (this.selectedSheetIndex = 0)
              : this.selectedSheetIndex > t.index &&
                (this._selectedSheetIndex -= 1)
            : (this.rows.clear(),
              this.columns.clear(),
              (this._selectedSheetIndex = -1));
        this.invalidate(!0);
      }),
      (t.prototype._sheetVisibleChange = function (e, t) {
        t.item.visible ||
          (t.index === this.selectedSheetIndex &&
            (this.selectedSheetIndex === this.sheets.length - 1
              ? (this.selectedSheetIndex = t.index - 1)
              : (this.selectedSheetIndex = t.index + 1)));
      }),
      (t.prototype._applyStyleForCell = function (e, t, o) {
        var n,
          i,
          r,
          l = this,
          s = l.rows[e];
        null == s ||
          s instanceof HeaderRow ||
          !s.isVisible ||
          ((r = e * l.columns.length + t),
          (i = l.selectedSheet._mergedRanges[r]) &&
            (r = i.topRow * l.columns.length + i.leftCol),
          (n = l.selectedSheet._styledCells[r])
            ? ((n.className =
                'normal' === o.className ? '' : o.className || n.className),
              (n.textAlign = o.textAlign || n.textAlign),
              (n.verticalAlign = o.verticalAlign || n.verticalAlign),
              (n.fontFamily = o.fontFamily || n.fontFamily),
              (n.fontSize = o.fontSize || n.fontSize),
              (n.backgroundColor = o.backgroundColor || n.backgroundColor),
              (n.color = o.color || n.color),
              (n.fontStyle =
                'none' === o.fontStyle ? '' : o.fontStyle || n.fontStyle),
              (n.fontWeight =
                'none' === o.fontWeight ? '' : o.fontWeight || n.fontWeight),
              (n.textDecoration =
                'none' === o.textDecoration
                  ? ''
                  : o.textDecoration || n.textDecoration),
              (n.format = o.format || n.format),
              (n.whiteSpace = o.whiteSpace || n.whiteSpace))
            : (l.selectedSheet._styledCells[r] = {
                className: o.className,
                textAlign: o.textAlign,
                verticalAlign: o.verticalAlign,
                fontStyle: o.fontStyle,
                fontWeight: o.fontWeight,
                fontFamily: o.fontFamily,
                fontSize: o.fontSize,
                textDecoration: o.textDecoration,
                backgroundColor: o.backgroundColor,
                color: o.color,
                format: o.format,
                whiteSpace: o.whiteSpace,
              }));
      }),
      (t.prototype._checkCellFormat = function (e, t, o) {
        var n,
          i,
          r = e * this.columns.length + t;
        this.selectedSheet &&
          ((n = this.selectedSheet._mergedRanges[r]) &&
            ((o.isMergedCell = !0),
            (r = n.topRow * this.columns.length + n.leftCol)),
          (i = this.selectedSheet._styledCells[r]) &&
            ((o.isBold = o.isBold || 'bold' === i.fontWeight),
            (o.isItalic = o.isItalic || 'italic' === i.fontStyle),
            (o.isUnderline =
              o.isUnderline || 'underline' === i.textDecoration)),
          e === this.selection.row &&
            t === this.selection.col &&
            (i && i.textAlign
              ? (o.textAlign = i.textAlign)
              : t > -1 &&
                (o.textAlign = this.columns[t].getAlignment() || o.textAlign)));
      }),
      (t.prototype._resetMergedRange = function (e) {
        var t,
          o,
          n,
          i,
          r,
          l,
          s,
          a = !1;
        for (t = e.topRow; t <= e.bottomRow; t++)
          for (o = e.leftCol; o <= e.rightCol; o++)
            if (
              ((n = t * this.columns.length + o),
              (s = this.selectedSheet._mergedRanges[n]))
            )
              for (a = !0, i = s.topRow; i <= s.bottomRow; i++)
                for (r = s.leftCol; r <= s.rightCol; r++)
                  (l = i * this.columns.length + r),
                    delete this.selectedSheet._mergedRanges[l];
        return a;
      }),
      (t.prototype._updateCellsForUpdatingRow = function (e, t, o, n) {
        var i,
          r,
          l,
          s,
          a,
          h = this,
          c = {},
          d = e * this.columns.length;
        if (n)
          for (r = i = t * this.columns.length; r < d; r++)
            (l = r - o * this.columns.length),
              (s = this.selectedSheet._styledCells[r]) &&
                (r >= (t + o) * this.columns.length &&
                  (this.selectedSheet._styledCells[l] = s),
                delete this.selectedSheet._styledCells[r]),
              (a = this.selectedSheet._mergedRanges[r]) &&
                (t <= a.topRow && t + o > a.bottomRow
                  ? delete this.selectedSheet._mergedRanges[r]
                  : a.bottomRow < t || a.topRow >= t + o
                  ? (a.topRow > t && (a.row -= o),
                    (a.row2 -= o),
                    (this.selectedSheet._mergedRanges[l] = a),
                    delete this.selectedSheet._mergedRanges[r])
                  : this._updateCellMergeRangeForRow(a, t, o, c, !0));
        else
          for (i = t * this.columns.length - 1, r = d - 1; r > i; r--)
            (l = r + this.columns.length * o),
              (s = this.selectedSheet._styledCells[r]) &&
                ((this.selectedSheet._styledCells[l] = s),
                delete this.selectedSheet._styledCells[r]),
              (a = this.selectedSheet._mergedRanges[r]) &&
                (a.topRow < t && a.bottomRow >= t
                  ? this._updateCellMergeRangeForRow(a, t, o, c)
                  : ((a.row += o),
                    (a.row2 += o),
                    (this.selectedSheet._mergedRanges[l] = a),
                    delete this.selectedSheet._mergedRanges[r]));
        Object.keys(c).forEach(function (e) {
          h.selectedSheet._mergedRanges[e] = c[e];
        });
      }),
      (t.prototype._updateCellMergeRangeForRow = function (e, t, o, n, i) {
        var r, l, s, a, h, c, d;
        if (i)
          for (r = e.topRow; r <= e.bottomRow; r++)
            for (l = e.leftCol; l <= e.rightCol; l++)
              (a = (s = r * this.columns.length + l) - o * this.columns.length),
                (c = this.selectedSheet._mergedRanges[s]) &&
                  ((d = c.clone()).row > t && (d.row -= d.row - t),
                  d.row2 < t + o - 1
                    ? (d.row2 -= d.row2 - t + 1)
                    : (d.row2 -= o),
                  r < t
                    ? (n[s] = d)
                    : (r >= t + o && (n[a] = d),
                      delete this.selectedSheet._mergedRanges[s]));
        else
          for (r = e.bottomRow; r >= e.topRow; r--)
            for (l = e.rightCol; l >= e.leftCol; l--)
              if (
                ((s = r * this.columns.length + l),
                (c = this.selectedSheet._mergedRanges[s]))
              ) {
                for (
                  (d = c.clone()).row2 += o, r < t && (n[s] = d.clone()), h = 1;
                  h <= o;
                  h++
                )
                  n[(a = s + this.columns.length * h)] = d;
                delete this.selectedSheet._mergedRanges[s];
              }
      }),
      (t.prototype._updateCellsForUpdatingColumn = function (e, t, o, n) {
        var i,
          r,
          l,
          s,
          a,
          h = this,
          c = {},
          d = this.rows.length * e;
        if (n)
          for (i = t; i < d; i++)
            (r = i - o * (Math.floor(i / e) + ((s = i % e) >= t ? 1 : 0))),
              (l = this.selectedSheet._styledCells[i]) &&
                ((s < t || s >= t + o) &&
                  (this.selectedSheet._styledCells[r] = l),
                delete this.selectedSheet._styledCells[i]),
              (a = this.selectedSheet._mergedRanges[i]) &&
                (t <= a.leftCol && t + o > a.rightCol
                  ? delete this.selectedSheet._mergedRanges[i]
                  : a.rightCol < t || a.leftCol >= t + o
                  ? (a.leftCol >= t && ((a.col -= o), (a.col2 -= o)),
                    (this.selectedSheet._mergedRanges[r] = a),
                    delete this.selectedSheet._mergedRanges[i])
                  : this._updateCellMergeRangeForColumn(a, t, o, e, c, !0));
        else
          for (i = d - 1; i >= t; i--)
            (r = i + Math.floor(i / e) * o + ((s = i % e) >= t ? 1 : 0)),
              (l = this.selectedSheet._styledCells[i]) &&
                ((this.selectedSheet._styledCells[r] = l),
                delete this.selectedSheet._styledCells[i]),
              (a = this.selectedSheet._mergedRanges[i]) &&
                (a.leftCol < t && a.rightCol >= t
                  ? this._updateCellMergeRangeForColumn(a, t, o, e, c)
                  : (a.leftCol >= t && ((a.col += o), (a.col2 += o)),
                    (this.selectedSheet._mergedRanges[r] = a),
                    delete this.selectedSheet._mergedRanges[i]));
        Object.keys(c).forEach(function (e) {
          h.selectedSheet._mergedRanges[e] = c[e];
        });
      }),
      (t.prototype._updateCellMergeRangeForColumn = function (
        e,
        t,
        o,
        n,
        i,
        r
      ) {
        var l, s, a, h, c, d, u;
        if (r)
          for (l = e.topRow; l <= e.bottomRow; l++)
            for (s = e.leftCol; s <= e.rightCol; s++)
              (h = (a = l * n + s) - o * (l + (s >= t ? 1 : 0))),
                (d = this.selectedSheet._mergedRanges[a]) &&
                  ((u = d.clone()).col > t && (u.col -= u.col - t),
                  u.col2 < t + o - 1
                    ? (u.col2 -= u.col2 - t + 1)
                    : (u.col2 -= o),
                  (s < t || s >= t + o) && (i[h] = u),
                  delete this.selectedSheet._mergedRanges[a]);
        else
          for (l = e.bottomRow; l >= e.topRow; l--)
            for (s = e.rightCol; s >= e.leftCol; s--)
              if (
                ((a = l * n + s),
                (h = a + l * o + (s >= t ? 1 : 0)),
                (d = this.selectedSheet._mergedRanges[a]))
              ) {
                if (
                  ((u = d.clone()),
                  (u.col2 += o),
                  s === t && (i[h - 1] = u.clone()),
                  s >= t)
                )
                  for (c = 0; c < o; c++) i[h + c] = u;
                else i[h] = u;
                delete this.selectedSheet._mergedRanges[a];
              }
      }),
      (t.prototype._cloneMergedCells = function () {
        var e, t;
        if (!this.selectedSheet) return null;
        if (
          null == (t = this.selectedSheet._mergedRanges) ||
          'object' != typeof t
        )
          return t;
        if (t instanceof Object) {
          e = {};
          for (var o in t)
            t.hasOwnProperty(o) && t[o] && t[o].clone && (e[o] = t[o].clone());
          return e;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
      }),
      (t.prototype._evaluate = function (e, t, o, n, i) {
        return e && e.length > 1
          ? ((e = '=' === e[0] ? e : '=' + e),
            this._calcEngine.evaluate(e, t, o, n, i))
          : e;
      }),
      (t.prototype._copyTo = function (e) {
        var t,
          o,
          n,
          i = this,
          r = e.grid.autoGenerateColumns;
        if (
          (e._storeRowSettings(),
          (e.grid.selection = new wjcGrid.CellRange()),
          e.grid.rows.clear(),
          e.grid.columns.clear(),
          e.grid.columnHeaders.columns.clear(),
          e.grid.rowHeaders.rows.clear(),
          i.itemsSource)
        ) {
          if (
            ((e.grid.autoGenerateColumns = !1),
            (e.itemsSource = i.itemsSource),
            e.grid.collectionView.beginUpdate(),
            !(e.grid.itemsSource instanceof wjcCore.CollectionView))
          )
            for (
              e.grid.collectionView.sortDescriptions.clear(), n = 0;
              n < i.collectionView.sortDescriptions.length;
              n++
            )
              e.grid.collectionView.sortDescriptions.push(
                i.collectionView.sortDescriptions[n]
              );
        } else
          for (e.itemsSource = null, o = 0; o < i.rows.length; o++)
            e.grid.rows.push(i.rows[o]);
        for (
          e._filterDefinition = i._filter.filterDefinition, t = 0;
          t < i.columns.length;
          t++
        )
          e.grid.columns.push(i.columns[t]);
        e.grid.collectionView &&
          (i._resetMappedColumns(e.grid), e.grid.collectionView.endUpdate()),
          e._setRowSettings(),
          (e.grid.autoGenerateColumns = r),
          (e.grid.frozenRows = i.frozenRows),
          (e.grid.frozenColumns = i.frozenColumns),
          (e.grid.selection = i.selection),
          (e._scrollPosition = i.scrollPosition),
          setTimeout(function () {
            i._setFlexSheetToDirty(), i.refresh(!0);
          }, 10);
      }),
      (t.prototype._copyFrom = function (e, t) {
        void 0 === t && (t = !0);
        var o,
          n,
          i,
          r,
          l,
          s,
          a = this,
          h = a.autoGenerateColumns;
        if (
          ((a._isCopying = !0),
          (a._dragable = !1),
          (a.itemsSource = null),
          a.rows.clear(),
          a.columns.clear(),
          a.columnHeaders.columns.clear(),
          a.rowHeaders.rows.clear(),
          (a.selection = new wjcGrid.CellRange()),
          e.selectionRanges.length > 1 &&
            a.selectionMode === wjcGrid.SelectionMode.CellRange &&
            (a._enableMulSel = !0),
          e.itemsSource)
        ) {
          if (
            ((a.autoGenerateColumns = !1),
            (a.itemsSource = e.itemsSource),
            a.collectionView.beginUpdate(),
            !(a.itemsSource instanceof wjcCore.CollectionView))
          )
            for (
              a.collectionView.sortDescriptions.clear(), i = 0;
              i < e.grid.collectionView.sortDescriptions.length;
              i++
            )
              a.collectionView.sortDescriptions.push(
                e.grid.collectionView.sortDescriptions[i]
              );
        } else
          for (n = 0; n < e.grid.rows.length; n++) a.rows.push(e.grid.rows[n]);
        for (o = 0; o < e.grid.columns.length; o++)
          ((l = e.grid.columns[o]).isRequired = !1), a.columns.push(l);
        for (
          a.collectionView &&
            (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 &&
              (a.collectionView.useStableSort = !0),
            a._resetMappedColumns(a),
            a.collectionView.endUpdate(),
            a.collectionView.collectionChanged.addHandler(function (e, t) {
              t.action === wjcCore.NotifyCollectionChangedAction.Reset &&
                a.invalidate();
            }, a)),
            a.rows.length &&
              a.columns.length &&
              (a.selection = e.grid.selection),
            e._filterDefinition &&
              (a._filter.filterDefinition = e._filterDefinition),
            n = 0;
          n < a.rows.length;
          n++
        )
          (r = e._rowSettings[n]) &&
            (((s = a.rows[n]).height = r.height),
            (s.allowMerging = r.allowMerging),
            (s.visible = r.visible),
            s instanceof wjcGrid.GroupRow && (s.isCollapsed = r.isCollapsed));
        (a.autoGenerateColumns = h),
          (a.frozenRows = e.grid.frozenRows),
          (a.frozenColumns = e.grid.frozenColumns),
          (a._isCopying = !1),
          a._addingSheet
            ? (a._toRefresh &&
                (clearTimeout(a._toRefresh), (a._toRefresh = null)),
              (a._toRefresh = setTimeout(function () {
                a._setFlexSheetToDirty(), a.invalidate();
              }, 10)),
              (a._addingSheet = !1))
            : t && a.refresh(),
          (a.scrollPosition = e._scrollPosition);
      }),
      (t.prototype._resetMappedColumns = function (e) {
        var t,
          o,
          n = 0;
        if (((e._mappedColumns = null), e.collectionView))
          for (o = e.collectionView.sortDescriptions; n < o.length; n++)
            (t = e.columns.getColumn(o[n].property)) &&
              t.dataMap &&
              (e._mappedColumns || (e._mappedColumns = {}),
              (e._mappedColumns[t.binding] = t.dataMap));
      }),
      (t.prototype._resetFilterDefinition = function () {
        (this._resettingFilter = !0),
          (this._filter.filterDefinition = JSON.stringify({
            defaultFilterType: wjcGridFilter.FilterType.Both,
            filters: [],
          })),
          (this._resettingFilter = !1);
      }),
      (t.prototype._loadFromWorkbook = function (e) {
        var t,
          o,
          n,
          i = 0,
          r = this;
        if (null != e.sheets && 0 !== e.sheets.length) {
          for (
            r.beginUpdate(),
              r.clear(),
              r._reservedContent = e.reservedContent,
              t = e.sheets.length;
            i < t;
            i++
          ) {
            if (
              (i > 0 && r.addUnboundSheet(),
              (r.selectedSheet.grid.wj_sheetInfo = {}),
              wjcGridXlsx.FlexGridXlsxConverter.load(r.selectedSheet.grid, e, {
                sheetIndex: i,
                includeColumnHeaders: !1,
              }),
              (r.selectedSheet.name = r.selectedSheet.grid.wj_sheetInfo.name),
              (r.selectedSheet.visible =
                r.selectedSheet.grid.wj_sheetInfo.visible),
              (r.selectedSheet._styledCells =
                r.selectedSheet.grid.wj_sheetInfo.styledCells),
              (r.selectedSheet._mergedRanges =
                r.selectedSheet.grid.wj_sheetInfo.mergedRanges),
              null != r.selectedSheet.grid.wj_sheetInfo.tableNames &&
                r.selectedSheet.grid.wj_sheetInfo.tableNames.length > 0)
            )
              for (
                n = 0;
                n < r.selectedSheet.grid.wj_sheetInfo.tableNames.length;
                n++
              )
                r.selectedSheet.tableNames[n] =
                  r.selectedSheet.grid.wj_sheetInfo.tableNames[n];
            r._copyFrom(r.selectedSheet, !1);
          }
          if (
            (null != e.activeWorksheet &&
            e.activeWorksheet > -1 &&
            e.activeWorksheet < r.sheets.length
              ? (r.selectedSheetIndex = e.activeWorksheet)
              : (r.selectedSheetIndex = 0),
            e.definedNames && e.definedNames.length > 0)
          )
            for (n = 0; n < e.definedNames.length; n++)
              (o = e.definedNames[n]),
                r.definedNames.push(
                  new DefinedName(r, o.name, o.value, o.sheetName)
                );
          if (e.tables && e.tables.length > 0) {
            var l = r.selectedSheetIndex,
              s = [];
            for (n = 0; n < e.tables.length; n++)
              (r.selectedSheetIndex = r._getTableSheetIndex(e.tables[n].name)),
                (s[n] = this._parseFromWorkbookTable(e.tables[n]));
            (this._tables = new wjcCore.ObservableArray(s)),
              (r.selectedSheetIndex = l);
          }
          if (e.colorThemes && e.colorThemes.length > 0)
            for (n = 0; n < this._colorThemes.length; n++)
              this._colorThemes[n] = e.colorThemes[n];
          r.endUpdate(), r.onLoaded();
        }
      }),
      (t.prototype._saveToWorkbook = function () {
        var e, t, o, n, i, r;
        if (0 === this.sheets.length) throw 'The flexsheet is empty.';
        for (
          n = this.sheets[0],
            0 === this.selectedSheetIndex &&
              (n._storeRowSettings(),
              n.tableNames.length > 0 &&
                (n.grid.wj_sheetInfo.tableNames = n.tableNames)),
            n._setRowSettings(),
            (e = wjcGridXlsx.FlexGridXlsxConverter.save(n.grid, {
              sheetName: n.name,
              sheetVisible: n.visible,
              includeColumnHeaders: !1,
            })).reservedContent = this._reservedContent,
            i = 1;
          i < this.sheets.length;
          i++
        )
          (n = this.sheets[i]),
            this.selectedSheetIndex === i && n._storeRowSettings(),
            n._setRowSettings(),
            n.tableNames.length > 0 &&
              (n.grid.wj_sheetInfo.tableNames = n.tableNames),
            n._setRowSettings(),
            (t = wjcGridXlsx.FlexGridXlsxConverter.save(n.grid, {
              sheetName: n.name,
              sheetVisible: n.visible,
              includeColumnHeaders: !1,
            })),
            e._addWorkSheet(t.sheets[0], i);
        for (
          e.activeWorksheet = this.selectedSheetIndex, r = 0;
          r < this.definedNames.length;
          r++
        ) {
          var l = this.definedNames[r];
          ((o = new wjcXlsx.DefinedName()).name = l.name),
            (o.value = l.value),
            (o.sheetName = l.sheetName),
            e.definedNames.push(o);
        }
        if (this._tables && this._tables.length > 0)
          for (r = 0; r < this._tables.length; r++)
            e.tables.push(this._parseToWorkbookTable(this._tables[r]));
        if (this._colorThemes && this._colorThemes.length > 0)
          for (r = 0; r < this._colorThemes.length; r++)
            e.colorThemes[r] = this._colorThemes[r];
        return e;
      }),
      (t.prototype._mouseDown = function (e) {
        var t,
          o,
          n = window.navigator.userAgent,
          i = this.hitTest(e);
        this.columns;
        if (
          (this.selectedSheet &&
            (this.selectedSheet._scrollPosition = this.scrollPosition),
          (this._wholeColumnsSelected = !1),
          this._dragable)
        )
          return (
            (this._isDragging = !0),
            (this._draggingMarker = document.createElement('div')),
            wjcCore.setCss(this._draggingMarker, {
              position: 'absolute',
              display: 'none',
              borderStyle: 'dotted',
              cursor: 'move',
            }),
            document.body.appendChild(this._draggingMarker),
            (this._draggingTooltip = new wjcCore.Tooltip()),
            (this._draggingCells = this.selection),
            this.selectedSheet && this.selectedSheet.selectionRanges.clear(),
            this.onDraggingRowColumn(
              new DraggingRowColumnEventArgs(this._draggingRow, e.shiftKey)
            ),
            void e.preventDefault()
          );
        if (
          (i.cellType !== wjcGrid.CellType.None && (this._isClicking = !0),
          this.selectionMode === wjcGrid.SelectionMode.CellRange
            ? e.ctrlKey
              ? this._enableMulSel || (this._enableMulSel = !0)
              : i.cellType !== wjcGrid.CellType.None &&
                (this.selectedSheet &&
                  this.selectedSheet.selectionRanges.clear(),
                this._enableMulSel && this.refresh(!1),
                (this._enableMulSel = !1))
            : ((this._enableMulSel = !1),
              this.selectedSheet && this.selectedSheet.selectionRanges.clear()),
          (this._htDown = i),
          0 !== this.rows.length &&
            0 !== this.columns.length &&
            (n.match(/iPad/i) || n.match(/iPhone/i) || this._contextMenu.hide(),
            this.selectionMode === wjcGrid.SelectionMode.CellRange))
        ) {
          if (i.cellType === wjcGrid.CellType.RowHeader && 3 === e.which)
            return (
              (o = new wjcGrid.CellRange(
                i.row,
                0,
                i.row,
                this.columns.length - 1
              )),
              void (this.selection.contains(o) || (this.selection = o))
            );
          if (
            (i.cellType === wjcGrid.CellType.ColumnHeader ||
              i.cellType === wjcGrid.CellType.None) &&
            !(i.col > -1 && this.columns[i.col].isSelected) &&
            wjcCore.hasClass(e.target, 'wj-cell') &&
            !i.edgeRight
          )
            if (
              ((this._columnHeaderClicked = !0),
              (this._wholeColumnsSelected = !0),
              e.shiftKey)
            )
              this._multiSelectColumns(i);
            else {
              if (
                ((t = new wjcGrid.CellRange(
                  this.itemsSource ? 1 : 0,
                  i.col,
                  this.rows.length - 1,
                  i.col
                )),
                3 === e.which && this.selection.contains(t))
              )
                return;
              this.select(t);
            }
        }
      }),
      (t.prototype._mouseMove = function (e) {
        var t,
          o = this.hitTest(e),
          n = this.selection,
          i = this.rows.length,
          r = this.columns.length,
          l = this.hostElement.style.cursor;
        return 0 === this.rows.length || 0 === this.columns.length
          ? ((this._dragable = !1),
            void (
              o.cellType === wjcGrid.CellType.Cell &&
              (this.hostElement.style.cursor = 'default')
            ))
          : this._isDragging
          ? ((this.hostElement.style.cursor = 'move'),
            void this._showDraggingMarker(e))
          : ((t = this.itemsSource
              ? 0 === n.topRow || 1 === n.topRow
              : 0 === n.topRow),
            n &&
              o.cellType !== wjcGrid.CellType.None &&
              !this.itemsSource &&
              ((this._draggingColumn = t && n.bottomRow === i - 1),
              (this._draggingRow = 0 === n.leftCol && n.rightCol === r - 1),
              o.cellType === wjcGrid.CellType.Cell
                ? (this._draggingColumn &&
                    (((o.col === n.leftCol - 1 || o.col === n.rightCol) &&
                      o.edgeRight) ||
                      (o.row === i - 1 && o.edgeBottom)) &&
                    (l = 'move'),
                  this._draggingRow &&
                    !this._containsGroupRows(n) &&
                    (((o.row === n.topRow - 1 || o.row === n.bottomRow) &&
                      o.edgeBottom) ||
                      (o.col === r - 1 && o.edgeRight)) &&
                    (l = 'move'))
                : o.cellType === wjcGrid.CellType.ColumnHeader
                ? o.edgeBottom &&
                  (this._draggingColumn &&
                  o.col >= n.leftCol &&
                  o.col <= n.rightCol
                    ? (l = 'move')
                    : this._draggingRow && 0 === n.topRow && (l = 'move'))
                : o.cellType === wjcGrid.CellType.RowHeader &&
                  o.edgeRight &&
                  (this._draggingColumn && 0 === n.leftCol
                    ? (l = 'move')
                    : this._draggingRow &&
                      o.row >= n.topRow &&
                      o.row <= n.bottomRow &&
                      !this._containsGroupRows(n) &&
                      (l = 'move')),
              (this._dragable = 'move' === l),
              (this.hostElement.style.cursor = l)),
            void (
              this._htDown &&
              this._htDown.panel &&
              ((o = new wjcGrid.HitTestInfo(this._htDown.panel, e)),
              this._multiSelectColumns(o),
              o.cellType === wjcGrid.CellType.Cell &&
                this.scrollIntoView(o.row, o.col))
            ));
      }),
      (t.prototype._mouseUp = function (e) {
        this._isDragging &&
          (this._draggingCells.equals(this._dropRange) ||
            (this._handleDropping(e), this.onDroppingRowColumn()),
          (this._draggingCells = null),
          (this._dropRange = null),
          document.body.removeChild(this._draggingMarker),
          (this._draggingMarker = null),
          this._draggingTooltip.hide(),
          (this._draggingTooltip = null),
          (this._isDragging = !1),
          (this._draggingColumn = !1),
          (this._draggingRow = !1)),
          this._htDown &&
            this._htDown.cellType !== wjcGrid.CellType.None &&
            this.selectedSheet &&
            (this._htDown.cellType === wjcGrid.CellType.TopLeft &&
            this.selectionMode === wjcGrid.SelectionMode.CellRange
              ? ((this.selection = new wjcGrid.CellRange(
                  this.selectedSheet.itemsSource ? 1 : 0,
                  0,
                  this.rows.length - 1,
                  this.columns.length - 1
                )),
                this.selectedSheet.selectionRanges.push(this.selection))
              : this.selection.isValid &&
                this.selectedSheet.selectionRanges.push(this.selection),
            (this._enableMulSel = !1)),
          (this._isClicking = !1),
          (this._columnHeaderClicked = !1),
          (this._htDown = null);
      }),
      (t.prototype._click = function () {
        var e = this,
          t = window.navigator.userAgent;
        t.match(/iPad/i) || t.match(/iPhone/i) || e._contextMenu.hide(),
          setTimeout(function () {
            e.hideFunctionList();
          }, 200);
      }),
      (t.prototype._touchStart = function (e) {
        var t = this;
        wjcCore.hasClass(e.target, 'wj-context-menu-item') ||
          t._contextMenu.hide(),
          (t._longClickTimer = setTimeout(function () {
            var o;
            !(o = t.hitTest(e)) ||
              o.cellType === wjcGrid.CellType.None ||
              t.itemsSource ||
              t._resizing ||
              t._contextMenu.show(
                null,
                new wjcCore.Point(e.pageX + 10, e.pageY + 10)
              );
          }, 500));
      }),
      (t.prototype._touchEnd = function () {
        clearTimeout(this._longClickTimer);
      }),
      (t.prototype._showDraggingMarker = function (e) {
        var o,
          n,
          i,
          r,
          l,
          s,
          a,
          h,
          c,
          d = new wjcGrid.HitTestInfo(this.cells, e),
          u = this.selection,
          _ = this.columns.length,
          g = this.rows.length,
          w = this._cumulativeScrollOffset(this.hostElement),
          f = this._root.getBoundingClientRect(),
          p = f.left + w.x,
          m = f.top + w.y;
        if ((this.scrollIntoView(d.row, d.col), this._draggingColumn)) {
          for (
            n = u.rightCol - u.leftCol + 1,
              l = 0,
              ((i = d.col) < 0 || i + n > _) && (i = _ - n),
              o = this.cells.getCellBoundingRect(0, i),
              s = this._root.offsetHeight - this._eCHdr.offsetHeight,
              r = (r = this.cells.height) > s ? s : r,
              a = 0;
            a < n;
            a++
          )
            l += this.columns[i + a].renderSize;
          (h =
            t.convertNumberToAlpha(i) +
            ' : ' +
            t.convertNumberToAlpha(i + n - 1)),
            this._dropRange
              ? ((this._dropRange.col = i), (this._dropRange.col2 = i + n - 1))
              : (this._dropRange = new wjcGrid.CellRange(
                  0,
                  i,
                  this.rows.length - 1,
                  i + n - 1
                ));
        } else if (this._draggingRow) {
          for (
            n = u.bottomRow - u.topRow + 1,
              r = 0,
              ((i = d.row) < 0 || i + n > g) && (i = g - n),
              o = this.cells.getCellBoundingRect(i, 0),
              s = this._root.offsetWidth - this._eRHdr.offsetWidth,
              a = 0;
            a < n;
            a++
          )
            r += this.rows[i + a].renderSize;
          (l = (l = this.cells.width) > s ? s : l),
            (h = i + 1 + ' : ' + (i + n)),
            this._dropRange
              ? ((this._dropRange.row = i), (this._dropRange.row2 = i + n - 1))
              : (this._dropRange = new wjcGrid.CellRange(
                  i,
                  0,
                  i + n - 1,
                  this.columns.length - 1
                ));
        }
        if (o) {
          if (
            ((c = {
              display: 'inline',
              zIndex: '9999',
              opacity: 0.5,
              top: o.top - (this._draggingColumn ? this._ptScrl.y : 0) + w.y,
              left: o.left - (this._draggingRow ? this._ptScrl.x : 0) + w.x,
              height: r,
              width: l,
            }),
            (o.top = o.top - (this._draggingColumn ? this._ptScrl.y : 0)),
            (o.left = o.left - (this._draggingRow ? this._ptScrl.x : 0)),
            this.rightToLeft &&
              this._draggingRow &&
              ((c.left = c.left - l + o.width + 2 * this._ptScrl.x),
              (o.left = o.left + 2 * this._ptScrl.x)),
            this._draggingRow)
          ) {
            if (
              p + this._eRHdr.offsetWidth !== c.left ||
              m + this._root.offsetHeight + 1 < c.top + c.height
            )
              return;
          } else if (
            m + this._eCHdr.offsetHeight !== c.top ||
            p + this._root.offsetWidth + 1 < c.left + c.width
          )
            return;
          wjcCore.setCss(this._draggingMarker, c),
            this._draggingTooltip.show(this.hostElement, h, o);
        }
      }),
      (t.prototype._handleDropping = function (e) {
        var t,
          o,
          n,
          i,
          r,
          l,
          s,
          a = this;
        if (
          a.selectedSheet &&
          a._draggingCells &&
          a._dropRange &&
          !a._containsMergedCells(a._draggingCells) &&
          !a._containsMergedCells(a._dropRange)
        ) {
          if (
            (a._clearCalcEngine(),
            (a._draggingColumn &&
              a._draggingCells.leftCol > a._dropRange.leftCol) ||
              (a._draggingRow && a._draggingCells.topRow > a._dropRange.topRow))
          )
            if (e.shiftKey) {
              if (a._draggingColumn)
                for (
                  i = a._dropRange.leftCol, o = a._draggingCells.leftCol;
                  o <= a._draggingCells.rightCol;
                  o++
                )
                  a.columns.moveElement(o, i), i++;
              else if (a._draggingRow)
                for (
                  n = a._dropRange.topRow, t = a._draggingCells.topRow;
                  t <= a._draggingCells.bottomRow;
                  t++
                )
                  a.rows.moveElement(t, n), n++;
              a._exchangeCellStyle(!0);
            } else {
              for (
                r = new _MoveCellsAction(
                  a,
                  a._draggingCells,
                  a._dropRange,
                  e.ctrlKey
                ),
                  n = a._dropRange.topRow,
                  t = a._draggingCells.topRow;
                t <= a._draggingCells.bottomRow;
                t++
              ) {
                for (
                  i = a._dropRange.leftCol, o = a._draggingCells.leftCol;
                  o <= a._draggingCells.rightCol;
                  o++
                )
                  a._moveCellContent(t, o, n, i, e.ctrlKey),
                    a._draggingColumn &&
                      n === a._dropRange.topRow &&
                      ((a.columns[i].dataType = a.columns[o].dataType
                        ? a.columns[o].dataType
                        : wjcCore.DataType.Object),
                      (a.columns[i].align = a.columns[o].align),
                      (a.columns[i].format = a.columns[o].format),
                      e.ctrlKey ||
                        ((a.columns[o].dataType = wjcCore.DataType.Object),
                        (a.columns[o].align = null),
                        (a.columns[o].format = null))),
                    i++;
                n++;
              }
              if (a._draggingColumn && !e.ctrlKey)
                for (
                  i = a._dropRange.leftCol, o = a._draggingCells.leftCol;
                  o <= a._draggingCells.rightCol;
                  o++
                )
                  a._updateColumnFiler(o, i), i++;
            }
          else if (
            (a._draggingColumn &&
              a._draggingCells.leftCol < a._dropRange.leftCol) ||
            (a._draggingRow && a._draggingCells.topRow < a._dropRange.topRow)
          )
            if (e.shiftKey) {
              if (a._draggingColumn)
                for (
                  i = a._dropRange.rightCol, o = a._draggingCells.rightCol;
                  o >= a._draggingCells.leftCol;
                  o--
                )
                  a.columns.moveElement(o, i), i--;
              else if (a._draggingRow)
                for (
                  n = a._dropRange.bottomRow, t = a._draggingCells.bottomRow;
                  t >= a._draggingCells.topRow;
                  t--
                )
                  a.rows.moveElement(t, n), n--;
              a._exchangeCellStyle(!1);
            } else {
              for (
                r = new _MoveCellsAction(
                  a,
                  a._draggingCells,
                  a._dropRange,
                  e.ctrlKey
                ),
                  n = a._dropRange.bottomRow,
                  t = a._draggingCells.bottomRow;
                t >= a._draggingCells.topRow;
                t--
              ) {
                for (
                  i = a._dropRange.rightCol, o = a._draggingCells.rightCol;
                  o >= a._draggingCells.leftCol;
                  o--
                )
                  a._moveCellContent(t, o, n, i, e.ctrlKey),
                    a._draggingColumn &&
                      n === a._dropRange.bottomRow &&
                      ((a.columns[i].dataType = a.columns[o].dataType
                        ? a.columns[o].dataType
                        : wjcCore.DataType.Object),
                      (a.columns[i].align = a.columns[o].align),
                      (a.columns[i].format = a.columns[o].format),
                      e.ctrlKey ||
                        ((a.columns[o].dataType = wjcCore.DataType.Object),
                        (a.columns[o].align = null),
                        (a.columns[o].format = null))),
                    i--;
                n--;
              }
              if (a._draggingColumn && !e.ctrlKey)
                for (
                  i = a._dropRange.rightCol, o = a._draggingCells.rightCol;
                  o >= a._draggingCells.leftCol;
                  o--
                )
                  a._updateColumnFiler(o, i), i--;
            }
          e.ctrlKey ||
            ((l = a._updateFormulaForDropping(e.shiftKey)),
            (s = a._updateNamedRangesForDropping())),
            r &&
              r.saveNewState() &&
              ((r._affectedFormulas = l),
              (r._affectedDefinedNameVals = s),
              a._undoStack._addAction(r)),
            a._undoStack._pendingAction &&
              ((a._undoStack._pendingAction._affectedFormulas = l),
              (a._undoStack._pendingAction._affectedDefinedNameVals = s)),
            a.select(a._dropRange),
            a.selectedSheet.selectionRanges.push(a.selection),
            a.hostElement.focus();
        }
      }),
      (t.prototype._moveCellContent = function (e, t, o, n, i) {
        var r,
          l,
          s,
          a,
          h,
          c,
          d = this.getCellData(e, t, !1),
          u = e * this.columns.length + t,
          _ = o * this.columns.length + n,
          g = this.selectedSheet._styledCells[u];
        if (
          (i &&
            d &&
            'string' == typeof d &&
            '=' === d[0] &&
            (r = this._updateCellRefForDropping(d, this.selectedSheetIndex)),
          this.setCellData(o, n, r || d),
          (s = this.selectedSheet.findTable(o, n)) &&
            s.showHeaderRow &&
            o === s.range.topRow &&
            ((h = n - s.range.leftCol),
            (c = s.columns[h].name),
            (s.columns[h].name = r || d)),
          g
            ? (this.selectedSheet._styledCells[_] = JSON.parse(
                JSON.stringify(g)
              ))
            : delete this.selectedSheet._styledCells[_],
          i)
        )
          (l = this.selectedSheet.findTable(e, t)) &&
            l === s &&
            e === o &&
            l.showHeaderRow &&
            e === l.range.topRow &&
            ((a = t - l.range.leftCol), l._updateColumnName(a, r || d));
        else {
          if (
            (delete this.selectedSheet._styledCells[u],
            (l = this.selectedSheet.findTable(e, t)))
          ) {
            if (l === s && e === o && l.showHeaderRow && e === l.range.topRow)
              return (a = t - l.range.leftCol), void l._updateColumnName(a, c);
            if (l.showHeaderRow && e === l.range.topRow) return;
          }
          this.setCellData(e, t, null);
        }
      }),
      (t.prototype._exchangeCellStyle = function (e) {
        var t,
          o,
          n,
          i,
          r,
          l = 0,
          s = [];
        for (
          t = this._draggingCells.topRow;
          t <= this._draggingCells.bottomRow;
          t++
        )
          for (
            o = this._draggingCells.leftCol;
            o <= this._draggingCells.rightCol;
            o++
          )
            (n = t * this.columns.length + o),
              this.selectedSheet._styledCells[n]
                ? (s.push(
                    JSON.parse(
                      JSON.stringify(this.selectedSheet._styledCells[n])
                    )
                  ),
                  delete this.selectedSheet._styledCells[n])
                : s.push(void 0);
        if (e) {
          if (this._draggingColumn)
            for (
              r =
                this._draggingCells.rightCol - this._draggingCells.leftCol + 1,
                o = this._draggingCells.leftCol - 1;
              o >= this._dropRange.leftCol;
              o--
            )
              for (t = 0; t < this.rows.length; t++)
                (n = t * this.columns.length + o),
                  (i = t * this.columns.length + o + r),
                  this.selectedSheet._styledCells[n]
                    ? ((this.selectedSheet._styledCells[i] = JSON.parse(
                        JSON.stringify(this.selectedSheet._styledCells[n])
                      )),
                      delete this.selectedSheet._styledCells[n])
                    : delete this.selectedSheet._styledCells[i];
          else if (this._draggingRow)
            for (
              r =
                this._draggingCells.bottomRow - this._draggingCells.topRow + 1,
                t = this._draggingCells.topRow - 1;
              t >= this._dropRange.topRow;
              t--
            )
              for (o = 0; o < this.columns.length; o++)
                (n = t * this.columns.length + o),
                  (i = (t + r) * this.columns.length + o),
                  this.selectedSheet._styledCells[n]
                    ? ((this.selectedSheet._styledCells[i] = JSON.parse(
                        JSON.stringify(this.selectedSheet._styledCells[n])
                      )),
                      delete this.selectedSheet._styledCells[n])
                    : delete this.selectedSheet._styledCells[i];
        } else if (this._draggingColumn)
          for (
            r = this._draggingCells.rightCol - this._draggingCells.leftCol + 1,
              o = this._draggingCells.rightCol + 1;
            o <= this._dropRange.rightCol;
            o++
          )
            for (t = 0; t < this.rows.length; t++)
              (n = t * this.columns.length + o),
                (i = t * this.columns.length + o - r),
                this.selectedSheet._styledCells[n]
                  ? ((this.selectedSheet._styledCells[i] = JSON.parse(
                      JSON.stringify(this.selectedSheet._styledCells[n])
                    )),
                    delete this.selectedSheet._styledCells[n])
                  : delete this.selectedSheet._styledCells[i];
        else if (this._draggingRow)
          for (
            r = this._draggingCells.bottomRow - this._draggingCells.topRow + 1,
              t = this._draggingCells.bottomRow + 1;
            t <= this._dropRange.bottomRow;
            t++
          )
            for (o = 0; o < this.columns.length; o++)
              (n = t * this.columns.length + o),
                (i = (t - r) * this.columns.length + o),
                this.selectedSheet._styledCells[n]
                  ? ((this.selectedSheet._styledCells[i] = JSON.parse(
                      JSON.stringify(this.selectedSheet._styledCells[n])
                    )),
                    delete this.selectedSheet._styledCells[n])
                  : delete this.selectedSheet._styledCells[i];
        for (t = this._dropRange.topRow; t <= this._dropRange.bottomRow; t++)
          for (o = this._dropRange.leftCol; o <= this._dropRange.rightCol; o++)
            (n = t * this.columns.length + o),
              s[l]
                ? (this.selectedSheet._styledCells[n] = s[l])
                : delete this.selectedSheet._styledCells[n],
              l++;
      }),
      (t.prototype._containsMergedCells = function (e) {
        var t, o, n, i;
        if (!this.selectedSheet) return !1;
        for (t = e.topRow; t <= e.bottomRow; t++)
          for (o = e.leftCol; o <= e.rightCol; o++)
            if (
              ((n = t * this.columns.length + o),
              (i = this.selectedSheet._mergedRanges[n]) &&
                i.isValid &&
                !i.isSingleCell)
            )
              return !0;
        return !1;
      }),
      (t.prototype._multiSelectColumns = function (e) {
        var t;
        e &&
          this._columnHeaderClicked &&
          (((t = new wjcGrid.CellRange(e.row, e.col)).row = this.selectedSheet
            .itemsSource
            ? 1
            : 0),
          (t.row2 = this.rows.length - 1),
          (t.col2 = this.selection.col2),
          this.select(t));
      }),
      (t.prototype._cumulativeOffset = function (e) {
        var t = 0,
          o = 0;
        do {
          (t += e.offsetTop || 0),
            (o += e.offsetLeft || 0),
            (e = e.offsetParent);
        } while (e);
        return new wjcCore.Point(o, t);
      }),
      (t.prototype._cumulativeScrollOffset = function (e) {
        var t = 0,
          o = 0;
        do {
          (t += e.scrollTop || 0),
            (o += e.scrollLeft || 0),
            (e = e.offsetParent);
        } while (e && !(e instanceof HTMLBodyElement));
        return (
          (t += document.body.scrollTop || document.documentElement.scrollTop),
          (o +=
            document.body.scrollLeft || document.documentElement.scrollLeft),
          new wjcCore.Point(o, t)
        );
      }),
      (t.prototype._checkHitWithinSelection = function (e) {
        var t;
        if (null != e && e.cellType === wjcGrid.CellType.Cell) {
          if (
            (t = this.getMergedRange(this.cells, e.row, e.col)) &&
            t.contains(this.selection)
          )
            return !0;
          if (this.selection.row === e.row && this.selection.col === e.col)
            return !0;
        }
        return !1;
      }),
      (t.prototype._clearForEmptySheet = function (e) {
        this.selectedSheet &&
          0 === this[e].length &&
          !0 !== this._isCopying &&
          !0 !== this._isUndoing &&
          ((this.selectedSheet._mergedRanges = null),
          (this.selectedSheet._styledCells = null),
          this.select(new wjcGrid.CellRange()));
      }),
      (t.prototype._containsGroupRows = function (e) {
        var t;
        for (t = e.topRow; t <= e.bottomRow; t++)
          if (this.rows[t] instanceof wjcGrid.GroupRow) return !0;
        return !1;
      }),
      (t.prototype._delSeletionContent = function (e) {
        var t,
          o,
          n,
          i,
          r,
          l,
          s,
          a,
          h,
          c,
          d,
          u = this.selectedSheet.selectionRanges.slice(),
          _ = !1,
          g = new _EditAction(this);
        if (!this.isReadOnly)
          if (
            this.allowDelete &&
            this.selection.isValid &&
            0 === this.selection.leftCol &&
            this.selection.rightCol === this.columns.length - 1
          )
            this.deleteRows(this.selection.topRow, this.selection.rowSpan);
          else {
            for (
              this.beginUpdate(),
                this.selectedSheet.tableNames &&
                  this.selectedSheet.tableNames.length > 0 &&
                  (s = this.selectedSheet.tableNames.slice()),
                (null != u && 0 !== u.length) || (u = [this.selection]),
                n = 0;
              n < u.length;
              n++
            ) {
              if (
                ((t = u[n]),
                (o = new wjcGrid.CellRange()),
                (d = new wjcGrid.CellEditEndingEventArgs(this.cells, o, e)),
                s)
              )
                for (l = 0; l < s.length; l++)
                  (a = s[l]),
                    (h = this._getTable(a)) &&
                      t.contains(h.range) &&
                      (g._storeDeletedTables(h),
                      this.tables.remove(h),
                      this.selectedSheet.tableNames.splice(
                        this.selectedSheet.tableNames.indexOf(a),
                        1
                      ));
              for (r = t.topRow; r <= t.bottomRow; r++)
                if (this.rows[r] && !this.rows[r].isReadOnly)
                  for (i = t.leftCol; i <= t.rightCol; i++)
                    ((!(c = this._getBindingColumn(
                      this.cells,
                      r,
                      this.columns[i]
                    )).isReadOnly &&
                      !1 === c.isRequired) ||
                      (null == c.isRequired &&
                        c.dataType == wjcCore.DataType.String)) &&
                      this.getCellData(r, i, !0) &&
                      (o.setRange(r, i),
                      (d.cancel = !1),
                      this.onBeginningEdit(d) &&
                        (this.setCellData(r, i, '', !0),
                        (_ = !0),
                        this.onCellEditEnding(d),
                        this.onCellEditEnded(d)));
            }
            _ && (g.saveNewState(), this._undoStack._addAction(g)),
              this.endUpdate();
          }
      }),
      (t.prototype._updateAffectedFormula = function (e, t, o, n) {
        var i,
          r,
          l,
          s,
          a,
          h,
          c,
          d,
          u,
          _ = [],
          g = [],
          w = this.selection.clone();
        for (
          this.selectedSheet._storeRowSettings(), this.beginUpdate(), i = 0;
          i < this.sheets.length;
          i++
        )
          for (l = (r = this.sheets[i]).grid, s = 0; s < l.rows.length; s++)
            for (a = 0; a < l.columns.length; a++)
              if (
                (d = l.getCellData(s, a, !1)) &&
                wjcCore.isString(d) &&
                '=' === d[0] &&
                (u = this._updateCellRef(d, i, e, t, o, n))
              ) {
                if (
                  (_.push({
                    sheet: r,
                    point: new wjcCore.Point(s, a),
                    formula: d,
                  }),
                  (h = s),
                  (c = a),
                  i === this.selectedSheetIndex &&
                    (n
                      ? s >= e && (o ? (h += t) : (h -= t))
                      : a >= e && (o ? (c += t) : (c -= t)),
                    !o &&
                      ((n && s <= e && s >= e - t + 1) ||
                        (!n && a <= e && a >= e - t + 1))))
                )
                  continue;
                l.setCellData(s, a, u),
                  g.push({
                    sheet: r,
                    point: new wjcCore.Point(h, c),
                    formula: u,
                  });
              }
        return (
          (this.selection = w),
          this.endUpdate(),
          { oldFormulas: _, newFormulas: g }
        );
      }),
      (t.prototype._updateAffectedNamedRanges = function (e, t, o, n) {
        var i,
          r,
          l,
          s,
          a = [],
          h = [];
        for (i = 0; i < this.definedNames.length; i++)
          (l = (r = this.definedNames[i]).value) &&
            wjcCore.isString(l) &&
            (s = this._updateCellRef(l, this.selectedSheetIndex, e, t, o, n)) &&
            (a.push({ name: r.name, value: l }),
            (r.value = s),
            h.push({ name: r.name, value: s }));
        return { oldDefinedNameVals: a, newDefinedNameVals: h };
      }),
      (t.prototype._updateColumnFiler = function (e, t) {
        for (
          var o = JSON.parse(this._filter.filterDefinition), n = 0;
          n < o.filters.length;
          n++
        ) {
          var i = o.filters[n];
          if (i.columnIndex === e) {
            i.columnIndex = t;
            break;
          }
        }
        this._filter.filterDefinition = JSON.stringify(o);
      }),
      (t.prototype._isDescendant = function (e, t) {
        for (var o = t.parentNode; null != o; ) {
          if (o === e) return !0;
          o = o.parentNode;
        }
        return !1;
      }),
      (t.prototype._clearCalcEngine = function () {
        this._calcEngine._clearExpressionCache();
      }),
      (t.prototype._getRangeString = function (e, t, o) {
        void 0 === o && (o = !0);
        var n,
          i,
          r,
          l,
          s,
          a = '',
          h = !0,
          c = t.grid;
        if (wjcCore.isArray(e) && e.length > 1) {
          if (this._isMultipleRowsSelected(e, t)) {
            for (a = '', i = 0; i < e.length; i++)
              a && (a += '\n'), (a += this._getRangeString(e[i], t));
            return a;
          }
          if (this._isMultipleColumnsSelected(e, t))
            for (a = '', n = 0, h = !0; n < c.rows.length; n++) {
              for (h || (a += '\n'), h = !1, i = 0, g = !0; i < e.length; i++)
                ((r = e[i].clone()).row = r.row2 = n),
                  g || (a += '\t'),
                  (g = !1),
                  (a += this._getRangeString(e[i], t));
              return a;
            }
          else
            switch (((s = e[0]), this.selectionMode)) {
              case wjcGrid.SelectionMode.Row:
              case wjcGrid.SelectionMode.RowRange:
                return (
                  (s.col = 0),
                  (s.col2 = c.columns.length - 1),
                  this._getRangeString(s, t)
                );
              case wjcGrid.SelectionMode.ListBox:
                (s.col = 0), (s.col2 = c.columns.length - 1);
                for (var d = 0; d < c.rows.length; d++)
                  c.rows[d].isSelected &&
                    c.rows[d].isVisible &&
                    ((s.row = s.row2 = d),
                    a && (a += '\n'),
                    (a += this._getRangeString(s, t)));
                return a;
            }
        }
        for (
          var u = (s = wjcCore.asType(
            wjcCore.isArray(e) ? e[0] : e,
            wjcGrid.CellRange
          )).topRow;
          u <= s.bottomRow;
          u++
        )
          if (c.rows[u] && c.rows[u].isVisible) {
            h || (a += '\n'), (h = !1);
            for (var _ = s.leftCol, g = !0; _ <= s.rightCol; _++)
              if (c.columns[_] && c.columns[_].isVisible) {
                if ((g || (a += '\t'), (g = !1), o)) {
                  if (
                    (l = c.getCellData(u, _, !0).toString()) &&
                    '=' === l[0]
                  ) {
                    var w = u * c.columns.length + _,
                      f = t._styledCells[w],
                      p = f ? f.format : '',
                      m = c.columns[_];
                    (l = this.evaluate(l, p, t)),
                      (l =
                        null == (l = this._formatEvaluatedResult(l, m, p))
                          ? ''
                          : l);
                  }
                } else l = c.getCellData(u, _, !0).toString();
                (l = l.replace(/\t/g, ' ')).indexOf('\n') > -1 &&
                  (l = '"' + l.replace(/"/g, '""') + '"'),
                  (a += l);
              }
          }
        return a;
      }),
      (t.prototype._containsRandFormula = function (e, t) {
        for (var o = 0; o < e.length; o++)
          for (
            var n = e[o], i = n.topRow;
            i <= n.bottomRow && i < t.grid.rows.length;
            i++
          )
            for (
              var r = n.leftCol;
              r <= n.rightCol && r < t.grid.columns.length;
              r++
            ) {
              var l = t.grid.getCellData(i, r, !1);
              if (
                wjcCore.isString(l) &&
                '=' === l[0] &&
                -1 !== l.search(/rand/i)
              )
                return !0;
            }
        return !1;
      }),
      (t.prototype._isMultipleRowsSelected = function (e, t) {
        var o, n;
        n =
          e && e.length > 0
            ? e
            : this.selectedSheet.selectionRanges.length > 0
            ? this.selectedSheet.selectionRanges
            : [this.selection];
        for (var i = 0; i < n.length; i++)
          if (((o = n[i]), t)) {
            if (0 !== o.leftCol || o.rightCol !== t.grid.columns.length - 1)
              return !1;
          } else if (0 !== o.leftCol || o.rightCol !== this.columns.length - 1)
            return !1;
        return !0;
      }),
      (t.prototype._isMultipleColumnsSelected = function (e, t) {
        var o, n;
        n =
          e && e.length > 0
            ? e
            : this.selectedSheet.selectionRanges.length > 0
            ? this.selectedSheet.selectionRanges
            : [this.selection];
        for (var i = 0; i < n.length; i++)
          if (((o = n[i]), t)) {
            if (o.bottomRow !== t.grid.rows.length - 1) return !1;
            if (!t.grid.itemsSource && 0 !== o.topRow) return !1;
            if (t.grid.itemsSource && 1 !== o.topRow) return !1;
          } else {
            if (o.bottomRow !== this.rows.length - 1) return !1;
            if (!this.selectedSheet.itemsSource && 0 !== o.topRow) return !1;
            if (this.selectedSheet.itemsSource && 1 !== o.topRow) return !1;
          }
        return !0;
      }),
      (t.prototype._postSetClipStringProcess = function (e, t, o, n, i) {
        var r,
          l,
          s,
          a,
          h,
          c = !1;
        return (
          n >= 0 &&
            i >= 0 &&
            (r = this.getMergedRange(this.cells, n, i)) &&
            r.topRow === n &&
            r.leftCol === i &&
            ((l =
              (l = t + r.rowSpan - 1) < this.rows.length
                ? l
                : this.rows.length - 1),
            (s =
              (s = o + r.columnSpan - 1) < this.columns.length
                ? s
                : this.columns.length - 1),
            this.mergeRange(new wjcGrid.CellRange(t, o, l, s), !0)),
          (a = new wjcGrid.CellRangeEventArgs(
            this.cells,
            new wjcGrid.CellRange(t, o),
            e
          )),
          this.onPastingCell(a) &&
            this.cells.setCellData(t, o, a.data) &&
            ((h = e.match(/\n/g)) &&
              h.length > 0 &&
              (this._applyStyleForCell(t, o, {
                whiteSpace: 'pre',
              }),
              (this.rows[t].height = this.rows.defaultSize * (h.length + 1))),
            this.onPastedCell(a),
            (c = !0)),
          c
        );
      }),
      (t.prototype._delCutData = function () {
        var e,
          t,
          o,
          n = this._copiedRanges[0],
          i =
            this._copiedSheet === this.selectedSheet
              ? this
              : this._copiedSheet.grid;
        for (e = n.topRow; e <= n.bottomRow; e++)
          if (null != i.rows[e])
            for (t = n.leftCol; t <= n.rightCol; t++)
              (this._copiedSheet !== this.selectedSheet ||
                e < this.selection.topRow ||
                e > this.selection.bottomRow ||
                t < this.selection.leftCol ||
                t > this.selection.rightCol) &&
                (0 ==
                  (o = i._getBindingColumn(i.cells, e, i.columns[t]))
                    .isRequired ||
                  (null == o.isRequired &&
                    o.dataType == wjcCore.DataType.String)) &&
                i.getCellData(e, t, !0) &&
                i.setCellData(e, t, '', !0);
      }),
      (t.prototype._containsMultiLineText = function (e) {
        for (var t = 0; t < e.length; t++)
          for (var o = e[t], n = 0; n < o.length; n++)
            if (o[n].indexOf('\n') >= 0) return !0;
        return !1;
      }),
      (t.prototype._sortByRow = function (e, t) {
        return e.topRow > t.topRow ? 1 : e.topRow < t.topRow ? -1 : 0;
      }),
      (t.prototype._sortByColumn = function (e, t) {
        return e.leftCol > t.leftCol ? 1 : e.leftCol < t.leftCol ? -1 : 0;
      }),
      (t.prototype._setFlexSheetToDirty = function () {
        (this.columns._dirty = !0),
          (this.rows._dirty = !0),
          (this.rowHeaders.columns._dirty = !0),
          (this.rowHeaders.rows._dirty = !0),
          (this.columnHeaders.columns._dirty = !0),
          (this.columnHeaders.rows._dirty = !0);
      }),
      (t.convertNumberToAlpha = function (e) {
        var t,
          o,
          n = '';
        if (e >= 0)
          do {
            (t = Math.floor(e / 26)),
              (o = e % 26),
              (n = String.fromCharCode(o + 65) + n),
              (e = t - 1);
          } while (t);
        return n;
      }),
      (t.prototype._updateFormulaForReorderingRows = function (e, t) {
        var o,
          n,
          i,
          r,
          l,
          s,
          a = t - e;
        this.beginUpdate();
        for (var h = 0; h < this.columns.length; h++)
          if (
            (o = this.getCellData(t, h, !1)) &&
            'string' == typeof o &&
            '=' === o[0] &&
            (n = o.match(/(?=\b\D)\$?[A-Za-z]{1,2}\$?\d+/g)) &&
            n.length > 0
          ) {
            for (var c = 0; c < n.length; c++)
              (i = n[c]),
                (s = (l = wjcXlsx.Workbook.tableAddress(i)).row + a) < 0
                  ? (s = 0)
                  : s >= this.rows.length && (s = this.rows.length - 1),
                (l.row = s),
                (r = wjcXlsx.Workbook.xlsxAddress(
                  l.row,
                  l.col,
                  l.absRow,
                  l.absCol
                )),
                (o = o.replace(i, r));
            this.setCellData(t, h, o);
          }
        this.endUpdate();
      }),
      (t.prototype._updateFormulaForDropping = function (e) {
        var t,
          o,
          n,
          i,
          r,
          l,
          s,
          a,
          h,
          c = [],
          d = [];
        for (this.beginUpdate(), n = 0; n < this.sheets.length; n++)
          for (o = (t = this.sheets[n]).grid, i = 0; i < o.rows.length; i++)
            for (l = 0; l < o.columns.length; l++)
              (a = o.getCellData(i, l, !1)) &&
                'string' == typeof a &&
                '=' === a[0] &&
                (h = this._updateCellRefForDropping(a, n)) &&
                (o.setCellData(i, l, h),
                e && n === this.selectedSheetIndex
                  ? ((r = o.rows[i]),
                    (s = o.columns[l]),
                    c.push({
                      sheet: t,
                      row: r,
                      column: s,
                      formula: a,
                    }),
                    d.push({
                      sheet: t,
                      row: r,
                      column: s,
                      formula: h,
                    }))
                  : (c.push({
                      sheet: t,
                      point: new wjcCore.Point(i, l),
                      formula: a,
                    }),
                    d.push({
                      sheet: t,
                      point: new wjcCore.Point(i, l),
                      formula: h,
                    })));
        return this.endUpdate(), { oldFormulas: c, newFormulas: d };
      }),
      (t.prototype._updateNamedRangesForDropping = function () {
        var e,
          t,
          o,
          n,
          i = [],
          r = [];
        for (e = 0; e < this.definedNames.length; e++)
          (o = (t = this.definedNames[e]).value) &&
            wjcCore.isString(o) &&
            (n = this._updateCellRefForDropping(o, this.selectedSheetIndex)) &&
            (i.push({ name: t.name, value: o }),
            (t.value = n),
            r.push({ name: t.name, value: n }));
        return { oldDefinedNameVals: i, newDefinedNameVals: r };
      }),
      (t.prototype._updateCellRefForDropping = function (e, t) {
        var o, n, i, r, l, s, a, h, c, d, u, _, g, w, f, p;
        if (
          (((i = e.match(
            /((\w+)\!)?\$?[A-Za-z]{1,2}\$?\d+:((\w+)\!)?\$?[A-Za-z]{1,2}\$?\d+/g
          )) &&
            0 !== i.length) ||
            (i = e.match(/((\w+)\!)?\$?[A-Za-z]{1,2}\$?\d+/g)),
          i && i.length > 0)
        )
          for (l = 0; l < i.length; l++) {
            if (
              ((u = null),
              (h = null),
              (c = null),
              (g = null),
              (f = null),
              (p = null),
              (r = i[l]).indexOf(':') > 0)
            ) {
              if (
                ((a = r.split(':')),
                (h = a[0]),
                (c = a[1]),
                (d = h.indexOf('!')) >= 0 &&
                  ((u = h.substring(0, d)), (h = h.substring(d + 1))),
                t === this.selectedSheetIndex)
              ) {
                if (
                  u &&
                  u.toLowerCase() !== this.selectedSheet.name.toLowerCase()
                )
                  continue;
              } else if (
                !u ||
                u.toLowerCase() !== this.selectedSheet.name.toLowerCase()
              )
                continue;
              (d = h.indexOf('!')) >= 0 &&
                ((_ = h.substring(0, d)), (c = h.substring(d + 1))),
                (f = wjcXlsx.Workbook.tableAddress(h)),
                (g = new wjcGrid.CellRange(f.row, f.col)),
                (p = wjcXlsx.Workbook.tableAddress(c)),
                (g.row2 = p.row),
                (g.col2 = p.col);
            } else {
              if ((d = r.indexOf('!')) >= 0)
                (u = r.substring(0, d)), (h = r.substring(d + 1));
              else {
                if ((s = e.indexOf(r)) > 0 && /[\d\w]/.test(e[s - 1])) continue;
                h = r;
              }
              if (t === this.selectedSheetIndex) {
                if (
                  u &&
                  u.toLowerCase() !== this.selectedSheet.name.toLowerCase()
                )
                  continue;
              } else if (
                !u ||
                u.toLowerCase() !== this.selectedSheet.name.toLowerCase()
              )
                continue;
              (f = wjcXlsx.Workbook.tableAddress(h)),
                (g = new wjcGrid.CellRange(f.row, f.col));
            }
            g &&
              this._draggingCells.contains(g) &&
              (0 !==
                (n = this._dropRange.leftCol - this._draggingCells.leftCol) &&
                ((g.col += f.absCol ? 0 : n),
                (g.col2 += p ? (p.absCol ? 0 : n) : f.absCol ? 0 : n)),
              0 !== (n = this._dropRange.topRow - this._draggingCells.topRow) &&
                ((g.row += f.absRow ? 0 : n),
                (g.row2 += p ? (p.absRow ? 0 : n) : f.absRow ? 0 : n)),
              null == o && (o = e),
              p
                ? ((w = u ? u + '!' : ''),
                  (w +=
                    wjcXlsx.Workbook.xlsxAddress(
                      g.row,
                      g.col,
                      f.absRow,
                      f.absCol
                    ) + ':'),
                  (w +=
                    (_ ? _ + '!' : '') +
                    wjcXlsx.Workbook.xlsxAddress(
                      g.row2,
                      g.col2,
                      p.absRow,
                      p.absCol
                    )))
                : ((w = u ? u + '!' : ''),
                  (w += wjcXlsx.Workbook.xlsxAddress(
                    g.row,
                    g.col,
                    f.absRow,
                    f.absCol
                  ))),
              (o = o.replace(r, w)));
          }
        return o;
      }),
      (t.prototype._scanFormulas = function () {
        for (var e = [], t = 0; t < this.rows.length; t++)
          for (var o = 0; o < this.columns.length; o++) {
            var n = this.getCellData(t, o, !1);
            n &&
              wjcCore.isString(n) &&
              '=' === n[0] &&
              e.push({ row: t, column: o, formula: n });
          }
        return e;
      }),
      (t.prototype._resetFormulas = function (e) {
        var t = this;
        e &&
          t.deferUpdate(function () {
            for (var o = 0; o < e.length; o++) {
              var n = e[o];
              t.setCellData(n.row, n.column, n.formula);
            }
          });
      }),
      (t.prototype._getCellStyle = function (e, t, o) {
        var n;
        return (o = o || this.selectedSheet)
          ? ((n = e * o.grid.columns.length + t), o._styledCells[n])
          : null;
      }),
      (t.prototype._validateSheetName = function (e) {
        for (var t = 0; t < this.sheets.length; t++)
          if (this.sheets[t].name === e) return !0;
        return !1;
      }),
      (t.prototype._checkExistDefinedName = function (e, t, o) {
        void 0 === o && (o = -1);
        for (var n = 0; n < this.definedNames.length; n++)
          if (
            this.definedNames[n].name === e &&
            this.definedNames[n].sheetName === t &&
            n !== o
          )
            return !0;
        return !1;
      }),
      (t.prototype._updateDefinedNameWithSheetRefUpdating = function (e, t) {
        for (var o, n, i, r = 0; r < this.definedNames.length; r++)
          if (
            ((o = this.definedNames[r]).sheetName === e &&
              null != o.sheetName &&
              (o._sheetName = t),
            (n = o.value.match(/(\w+)\!\$?[A-Za-z]+\$?\d+/g)) && n.length > 0)
          )
            for (var l = 0; l < n.length; l++)
              (i = n[l]).substring(0, i.indexOf('!')) === e &&
                (o.value = o.value.replace(i, i.replace(e, t)));
      }),
      (t.prototype._updateFormulasWithNameUpdating = function (e, t, o) {
        void 0 === o && (o = !1);
        var n,
          i,
          r,
          l,
          s,
          a,
          h,
          c,
          d,
          u,
          _ = this.selection.clone(),
          g = !1;
        for (
          u = o ? /\[/ : /\w/,
            this.selectedSheet._storeRowSettings(),
            this.beginUpdate(),
            n = 0;
          n < this.sheets.length;
          n++
        )
          for (l = this.sheets[n].grid, i = 0; i < l.rows.length; i++)
            for (r = 0; r < l.columns.length; r++)
              if (
                (s = l.getCellData(i, r, !1)) &&
                'string' == typeof s &&
                '=' === s[0]
              ) {
                for (g = !1, a = s.indexOf(e), d = new RegExp(e, 'g'); a > -1; )
                  (h = ''),
                    (c = ''),
                    a > 0 && (h = s[a - 1]),
                    a + e.length < s.length && (c = s[a + e.length]),
                    !/\w/.test(h) &&
                      ((o && u.test(c)) || (!o && !u.test(c))) &&
                      ((s = s.replace(d, function (o, n) {
                        return n === a ? t : e;
                      })),
                      (g = !0)),
                    (a = s.indexOf(e, a + e.length));
                g && l.setCellData(i, r, s);
              }
        (this.selection = _), this.endUpdate();
      }),
      (t.prototype._updateTableNameForSheet = function (e, t) {
        var o, n, i;
        for (o = 0; o < this.sheets.length; o++)
          (n = (i = this.sheets[o]).tableNames.indexOf(e)) > -1 &&
            (i.tableNames[n] = t);
      }),
      (t.prototype._getDefinedNameIndexByName = function (e) {
        for (var t = 0; t < this.definedNames.length; t++)
          if (this.definedNames[t].name === e) return t;
        return -1;
      }),
      (t.prototype._updateTablesForUpdatingRow = function (e, t, o) {
        var n, i, r, l, s, a;
        if ((s = this.selectedSheet.tableNames.slice()) && s.length > 0)
          for (n = 0; n < s.length; n++)
            if (((i = s[n]), (r = this._getTable(i))))
              if (o)
                if ((l = e + t - 1) < r.range.topRow)
                  r._updateTableRange(-t, -t, 0, 0);
                else if (l >= r.range.topRow && l <= r.range.bottomRow)
                  if (e < r.range.topRow)
                    r.showHeaderRow && (r._showHeaderRow = !1),
                      r._updateTableRange(e - r.range.topRow, -t, 0, 0);
                  else {
                    if (e === r.range.topRow && t === r.range.rowSpan) {
                      null == a && (a = []),
                        a.push(r),
                        this.selectedSheet.tableNames.splice(
                          this.selectedSheet.tableNames.indexOf(i),
                          1
                        ),
                        this.tables.remove(r);
                      continue;
                    }
                    e === r.range.topRow &&
                      r.showHeaderRow &&
                      (r._showHeaderRow = !1),
                      l === r.range.bottomRow &&
                        r.showTotalRow &&
                        (r._showTotalRow = !1),
                      r._updateTableRange(0, -t, 0, 0);
                  }
                else
                  e <= r.range.topRow
                    ? (null == a && (a = []),
                      a.push(r),
                      this.selectedSheet.tableNames.splice(
                        this.selectedSheet.tableNames.indexOf(i),
                        1
                      ),
                      this.tables.remove(r))
                    : e <= r.range.bottomRow &&
                      (r.showTotalRow && (r._showTotalRow = !1),
                      r._updateTableRange(0, e - r.range.bottomRow - 1, 0, 0));
              else
                e <= r.range.topRow
                  ? r._updateTableRange(t, t, 0, 0)
                  : e > r.range.topRow &&
                    e <= r.range.bottomRow &&
                    r._updateTableRange(0, t, 0, 0);
        return a;
      }),
      (t.prototype._updateTablesForUpdatingColumn = function (e, t, o) {
        var n, i, r, l, s, a, h, c, d;
        if ((c = this.selectedSheet.tableNames.slice()) && c.length > 0)
          for (n = 0; n < c.length; n++)
            if (((i = c[n]), (r = this._getTable(i))))
              if (o)
                if ((l = e + t - 1) < r.range.leftCol)
                  r._updateTableRange(0, 0, -t, -t);
                else if (l >= r.range.leftCol && l <= r.range.rightCol) {
                  if (e < r.range.leftCol)
                    (s = t - r.range.leftCol + e),
                      (a = r.range.leftCol),
                      r._updateTableRange(0, 0, e - r.range.leftCol, -t);
                  else {
                    if (e === r.range.leftCol && t === r.range.columnSpan) {
                      null == d && (d = []),
                        d.push(r),
                        this.selectedSheet.tableNames.splice(
                          this.selectedSheet.tableNames.indexOf(i),
                          1
                        ),
                        this.tables.remove(r);
                      continue;
                    }
                    (s = t), (a = e), r._updateTableRange(0, 0, 0, -s);
                  }
                  r.columns.splice(a - r.range.leftCol, s);
                } else
                  e <= r.range.leftCol
                    ? (null == d && (d = []),
                      d.push(r),
                      this.selectedSheet.tableNames.splice(
                        this.selectedSheet.tableNames.indexOf(i),
                        1
                      ),
                      this.tables.remove(r))
                    : e <= r.range.rightCol &&
                      ((s = r.range.rightCol - e + 1),
                      r._updateTableRange(0, 0, 0, -s),
                      r.columns.splice(e, s));
              else if (e <= r.range.leftCol) r._updateTableRange(0, 0, t, t);
              else if (e > r.range.leftCol && e <= r.range.rightCol)
                for (
                  r._updateTableRange(0, 0, 0, t),
                    a = e - r.range.leftCol,
                    h = 0;
                  h < t;
                  h++
                )
                  r._addColumn(a + h);
        return d;
      }),
      (t.prototype._isDisableDeleteRow = function (e, t) {
        var o, n, i;
        if (
          this.selectedSheet.tableNames &&
          this.selectedSheet.tableNames.length > 0
        )
          for (o = 0; o < this.selectedSheet.tableNames.length; o++)
            if (
              ((n = this.selectedSheet.tableNames[o]),
              (i = this._getTable(n)) &&
                i.showHeaderRow &&
                i.range.topRow >= e &&
                i.range.topRow <= t)
            )
              return !0;
        return !1;
      }),
      (t.prototype._copy = function (t, o) {
        var n, i;
        if ('columns' == t) {
          if (
            (e.prototype._copy.call(this, t, o),
            this.itemsSource && (n = this.rows[0]) instanceof HeaderRow)
          ) {
            (n._ubv = null), (n._ubv = {});
            for (var r = 0; r < this.columns.length; r++)
              (i = this.columns[r]), (n._ubv[i._hash] = i.header);
          }
          return !0;
        }
        return !1;
      }),
      (t.prototype._getTableSheetIndex = function (e) {
        for (var t = this.sheets, o = 0; o < t.length; o++)
          if (t[o].tableNames.indexOf(e) > -1) return o;
        return -1;
      }),
      (t.prototype._sheetSortConverter = function (t, o, n, i) {
        return (
          (n = e.prototype._sortConverter.call(this, t, o, n, i)),
          wjcCore.isString(n) &&
            n.length > 0 &&
            '=' === n[0] &&
            ((n = this.evaluate(n)),
            !wjcCore.isPrimitive(n) && n && (n = n.value)),
          n
        );
      }),
      (t.prototype._formatEvaluatedResult = function (e, t, o) {
        return (
          wjcCore.isPrimitive(e)
            ? (t.dataMap && (e = t.dataMap.getDisplayValue(e)),
              (e =
                !wjcCore.isInt(e) || t.format || t.dataMap || o
                  ? null != e
                    ? wjcCore.Globalize.format(e, o || t.format)
                    : ''
                  : e.toString()))
            : e &&
              (e =
                !wjcCore.isInt(e.value) ||
                t.format ||
                t.dataMap ||
                o ||
                e.format
                  ? null != e.value
                    ? wjcCore.Globalize.format(
                        e.value,
                        o || e.format || t.format
                      )
                    : ''
                  : e.value.toString()),
          e
        );
      }),
      (t.prototype._updateCellRef = function (e, t, o, n, i, r) {
        var l, s, a, h, c, d, u, _, g, w, f, p, m, C, b, S, y;
        if (
          (((s = e.match(
            /((\w+)\!)?\$?[A-Za-z]{1,2}\$?\d+:((\w+)\!)?\$?[A-Za-z]{1,2}\$?\d+/g
          )) &&
            0 !== s.length) ||
            (s = e.match(/((\w+)\!)?\$?[A-Za-z]{1,2}\$?\d+/g)),
          s && s.length > 0)
        ) {
          for (u = [], a = 0; a < s.length; a++) u[a] = e.indexOf(s[a]);
          for (a = 0; a < s.length; a++) {
            if (
              ((p = null),
              (g = null),
              (w = null),
              (C = null),
              (S = null),
              (y = null),
              (c = s[a]).indexOf(':') > 0)
            ) {
              if (
                ((_ = c.split(':')),
                (g = _[0]),
                (w = _[1]),
                (f = g.indexOf('!')) >= 0 &&
                  ((p = g.substring(0, f)), (g = g.substring(f + 1))),
                t === this.selectedSheetIndex)
              ) {
                if (
                  p &&
                  p.toLowerCase() !== this.selectedSheet.name.toLowerCase()
                )
                  continue;
              } else if (
                !p ||
                p.toLowerCase() !== this.selectedSheet.name.toLowerCase()
              )
                continue;
              (f = w.indexOf('!')) >= 0 &&
                ((m = w.substring(0, f)), (w = w.substring(f + 1))),
                (S = wjcXlsx.Workbook.tableAddress(g)),
                (C = new wjcGrid.CellRange(S.row, S.col)),
                (y = wjcXlsx.Workbook.tableAddress(w)),
                (C.row2 = y.row),
                (C.col2 = y.col);
            } else {
              if ((f = c.indexOf('!')) >= 0)
                (p = c.substring(0, f)), (g = c.substring(f + 1));
              else {
                if ((d = u[a]) > 0 && /[\d\w]/.test(e[d - 1])) continue;
                g = c;
              }
              if (t === this.selectedSheetIndex) {
                if (
                  p &&
                  p.toLowerCase() !== this.selectedSheet.name.toLowerCase()
                )
                  continue;
              } else if (
                !p ||
                p.toLowerCase() !== this.selectedSheet.name.toLowerCase()
              )
                continue;
              (S = wjcXlsx.Workbook.tableAddress(g)),
                (C = new wjcGrid.CellRange(S.row, S.col));
            }
            C &&
              ((h = !1),
              r
                ? i
                  ? C.topRow >= o
                    ? ((C.row += n), (C.row2 += n), (h = !0))
                    : C.topRow < o &&
                      C.bottomRow >= o &&
                      (C.row < C.row2 ? (C.row2 += n) : (C.row += n), (h = !0))
                  : C.topRow > o
                  ? ((C.row -= n), (C.row2 -= n), (h = !0))
                  : C.isSingleCell
                  ? C.row >= o - n + 1 &&
                    ((C.row = o - n + 1), (C.row2 = o - n + 1), (h = !0))
                  : C.topRow >= o - n + 1
                  ? (C.row < C.row2
                      ? ((C.row = o - n + 1), (C.row2 -= n))
                      : ((C.row -= n), (C.row2 = o - n + 1)),
                    (h = !0))
                  : C.topRow < o - n + 1 &&
                    C.bottomRow >= o - n + 1 &&
                    (C.bottomRow > o
                      ? C.row < C.row2
                        ? (C.row2 -= n)
                        : (C.row -= n)
                      : C.row < C.row2
                      ? (C.row2 = o - n)
                      : (C.row = o - n),
                    (h = !0))
                : i
                ? C.leftCol >= o
                  ? ((C.col += n), (C.col2 += n), (h = !0))
                  : C.leftCol < o &&
                    C.rightCol >= o &&
                    (C.col < C.col2 ? (C.col2 += n) : (C.col += n), (h = !0))
                : C.leftCol > o
                ? ((C.col -= n), (C.col2 -= n), (h = !0))
                : C.isSingleCell
                ? C.col >= o - n + 1 &&
                  ((C.col = o - n + 1), (C.col2 = o - n + 1), (h = !0))
                : C.leftCol >= o - n + 1
                ? (C.col < C.col2
                    ? ((C.col = o - n + 1), (C.col2 -= n))
                    : ((C.col -= n), (C.col2 = o - n + 1)),
                  (h = !0))
                : C.leftCol < o - n + 1 &&
                  C.rightCol >= o - n + 1 &&
                  (C.rightCol > o
                    ? C.col < C.col2
                      ? (C.col2 -= n)
                      : (C.col -= n)
                    : C.col < C.col2
                    ? (C.col2 = o - n)
                    : (C.col = o - n),
                  (h = !0)),
              h &&
                (y
                  ? ((b = p ? p + '!' : ''),
                    (b +=
                      wjcXlsx.Workbook.xlsxAddress(
                        C.row,
                        C.col,
                        S.absRow,
                        S.absCol
                      ) + ':'),
                    (b +=
                      (m ? m + '!' : '') +
                      wjcXlsx.Workbook.xlsxAddress(
                        C.row2,
                        C.col2,
                        y.absRow,
                        y.absCol
                      )))
                  : ((b = p ? p + '!' : ''),
                    (b += wjcXlsx.Workbook.xlsxAddress(
                      C.row,
                      C.col,
                      S.absRow,
                      S.absCol
                    ))),
                null == l && (l = e),
                (l = l.replace(
                  new RegExp(c.replace(/\$/g, '\\$'), 'gi'),
                  function (e, t) {
                    return t + e.length >= u[a] ? b : e;
                  }
                ))));
          }
        }
        return l;
      }),
      (t.prototype._copyRowsToSelectedSheet = function () {
        var e,
          t = this;
        if (t.selectedSheet) {
          for (t.selectedSheet.grid.rows.clear(), e = 0; e < t.rows.length; e++)
            t.selectedSheet.grid.rows.push(t.rows[e]);
          setTimeout(function () {
            t._setFlexSheetToDirty(), t.invalidate();
          }, 10);
        }
      }),
      (t.prototype._copyColumnsToSelectedSheet = function () {
        var e,
          t = this;
        if (t.selectedSheet) {
          for (
            t.selectedSheet.grid.columns.clear(), e = 0;
            e < t.columns.length;
            e++
          )
            t.selectedSheet.grid.columns.push(t.columns[e]);
          setTimeout(function () {
            t._setFlexSheetToDirty(), t.invalidate();
          }, 10);
        }
      }),
      (t.prototype._parseFromWorkbookTable = function (e) {
        var t, o, n, i, r, l, s, a, h;
        if (
          ((o = e.ref.split(':')),
          (n = o[0]),
          (i = o[1]),
          (r = wjcXlsx.Workbook.tableAddress(n)),
          (t = new wjcGrid.CellRange(r.row, r.col)),
          (l = wjcXlsx.Workbook.tableAddress(i)),
          (t.row2 = l.row),
          (t.col2 = l.col),
          e.columns && e.columns.length > 0)
        ) {
          s = [];
          for (var c = 0; c < e.columns.length; c++)
            (a = e.columns[c]),
              (s[c] = new TableColumn(
                a.name,
                a.totalRowLabel,
                a.totalRowFunction,
                a.showFilterButton
              ));
        }
        return (
          null != e.style &&
            (h = this._isBuiltInStyleName(e.style.name)
              ? this.getBuiltInTableStyle(e.style.name)
              : this._parseFromWorkbookTableStyle(e.style)),
          new Table(
            this,
            e.name,
            t,
            h,
            s,
            e.showHeaderRow,
            e.showTotalRow,
            e.showBandedColumns,
            e.showBandedRows,
            e.showFirstColumn,
            e.showLastColumn
          )
        );
      }),
      (t.prototype._parseFromWorkbookTableStyle = function (e) {
        var t = new TableStyle(e.name);
        return (
          null != e.firstBandedColumnStyle &&
            (t.firstBandedColumnStyle =
              this._parseFromWorkbookTableStyleElement(
                e.firstBandedColumnStyle
              )),
          null != e.firstBandedRowStyle &&
            (t.firstBandedRowStyle = this._parseFromWorkbookTableStyleElement(
              e.firstBandedRowStyle
            )),
          null != e.firstColumnStyle &&
            (t.firstColumnStyle = this._parseFromWorkbookTableStyleElement(
              e.firstColumnStyle
            )),
          null != e.firstHeaderCellStyle &&
            (t.firstHeaderCellStyle = this._parseFromWorkbookTableStyleElement(
              e.firstHeaderCellStyle
            )),
          null != e.firstTotalCellStyle &&
            (t.firstTotalCellStyle = this._parseFromWorkbookTableStyleElement(
              e.firstTotalCellStyle
            )),
          null != e.headerRowStyle &&
            (t.headerRowStyle = this._parseFromWorkbookTableStyleElement(
              e.headerRowStyle
            )),
          null != e.lastColumnStyle &&
            (t.lastColumnStyle = this._parseFromWorkbookTableStyleElement(
              e.lastColumnStyle
            )),
          null != e.lastHeaderCellStyle &&
            (t.lastHeaderCellStyle = this._parseFromWorkbookTableStyleElement(
              e.lastHeaderCellStyle
            )),
          null != e.lastTotalCellStyle &&
            (t.lastTotalCellStyle = this._parseFromWorkbookTableStyleElement(
              e.lastTotalCellStyle
            )),
          null != e.secondBandedColumnStyle &&
            (t.secondBandedColumnStyle =
              this._parseFromWorkbookTableStyleElement(
                e.secondBandedColumnStyle
              )),
          null != e.secondBandedRowStyle &&
            (t.secondBandedRowStyle = this._parseFromWorkbookTableStyleElement(
              e.secondBandedRowStyle
            )),
          null != e.totalRowStyle &&
            (t.totalRowStyle = this._parseFromWorkbookTableStyleElement(
              e.totalRowStyle
            )),
          null != e.wholeTableStyle &&
            (t.wholeTableStyle = this._parseFromWorkbookTableStyleElement(
              e.wholeTableStyle
            )),
          t
        );
      }),
      (t.prototype._parseFromWorkbookTableStyleElement = function (e) {
        var t;
        return (
          (t = {
            fontWeight: e.font && e.font.bold ? 'bold' : 'none',
            fontStyle: e.font && e.font.italic ? 'italic' : 'none',
            textDecoration: e.font && e.font.underline ? 'underline' : 'none',
            fontFamily: e.font && e.font.family ? e.font.family : '',
            fontSize: e.font && e.font.size ? e.font.size + 'px' : '',
            color: e.font && e.font.color ? e.font.color : '',
            backgroundColor: e.fill && e.fill.color ? e.fill.color : '',
          }),
          e.borders &&
            (e.borders.left &&
              (wjcGridXlsx.FlexGridXlsxConverter._parseBorderStyle(
                e.borders.left.style,
                'Left',
                t
              ),
              (t.borderLeftColor = e.borders.left.color)),
            e.borders.right &&
              (wjcGridXlsx.FlexGridXlsxConverter._parseBorderStyle(
                e.borders.right.style,
                'Right',
                t
              ),
              (t.borderRightColor = e.borders.right.color)),
            e.borders.top &&
              (wjcGridXlsx.FlexGridXlsxConverter._parseBorderStyle(
                e.borders.top.style,
                'Top',
                t
              ),
              (t.borderTopColor = e.borders.top.color)),
            e.borders.bottom &&
              (wjcGridXlsx.FlexGridXlsxConverter._parseBorderStyle(
                e.borders.bottom.style,
                'Bottom',
                t
              ),
              (t.borderBottomColor = e.borders.bottom.color)),
            e.borders.vertical &&
              (wjcGridXlsx.FlexGridXlsxConverter._parseBorderStyle(
                e.borders.vertical.style,
                'Vertical',
                t
              ),
              (t.borderVerticalColor = e.borders.vertical.color)),
            e.borders.horizontal &&
              (wjcGridXlsx.FlexGridXlsxConverter._parseBorderStyle(
                e.borders.horizontal.style,
                'Horizontal',
                t
              ),
              (t.borderHorizontalColor = e.borders.horizontal.color))),
          null != e.size && (t.size = e.size),
          t
        );
      }),
      (t.prototype._parseToWorkbookTable = function (e) {
        var t,
          o,
          n = new wjcXlsx.WorkbookTable(),
          i = e.range;
        (n.name = e.name),
          (t = wjcXlsx.Workbook.xlsxAddress(i.topRow, i.leftCol)),
          (o = wjcXlsx.Workbook.xlsxAddress(i.bottomRow, i.rightCol)),
          (n.ref = t + ':' + o),
          null != e.style &&
            (e.style.isBuiltIn
              ? ((n.style = new wjcXlsx.WorkbookTableStyle()),
                (n.style.name = e.style.name))
              : (n.style = this._parseToWorkbookTableStyle(e.style))),
          (n.showBandedColumns = e.showBandedColumns),
          (n.showBandedRows = e.showBandedRows),
          (n.showHeaderRow = e.showHeaderRow),
          (n.showTotalRow = e.showTotalRow),
          (n.showFirstColumn = e.showFirstColumn),
          (n.showLastColumn = e.showLastColumn);
        for (var r = 0; r < e.columns.length; r++) {
          var l = e.columns[r],
            s = new wjcXlsx.WorkbookTableColumn();
          (s.name = l.name),
            (s.totalRowLabel = l.totalRowLabel),
            (s.totalRowFunction = l.totalRowFunction),
            (s.showFilterButton = l.showFilterButton),
            n.columns.push(s);
        }
        return n;
      }),
      (t.prototype._parseToWorkbookTableStyle = function (e) {
        var t = new wjcXlsx.WorkbookTableStyle();
        return (
          (t.name = e.name),
          null != e.firstBandedColumnStyle &&
            (t.firstBandedColumnStyle = this._parseToWorkbookTableStyleElement(
              e.firstBandedColumnStyle,
              !0
            )),
          null != e.firstBandedRowStyle &&
            (t.firstBandedRowStyle = this._parseToWorkbookTableStyleElement(
              e.firstBandedRowStyle,
              !0
            )),
          null != e.firstColumnStyle &&
            (t.firstColumnStyle = this._parseToWorkbookTableStyleElement(
              e.firstColumnStyle
            )),
          null != e.firstHeaderCellStyle &&
            (t.firstHeaderCellStyle = this._parseToWorkbookTableStyleElement(
              e.firstHeaderCellStyle
            )),
          null != e.firstTotalCellStyle &&
            (t.firstTotalCellStyle = this._parseToWorkbookTableStyleElement(
              e.firstTotalCellStyle
            )),
          null != e.headerRowStyle &&
            (t.headerRowStyle = this._parseToWorkbookTableStyleElement(
              e.headerRowStyle
            )),
          null != e.lastColumnStyle &&
            (t.lastColumnStyle = this._parseToWorkbookTableStyleElement(
              e.lastColumnStyle
            )),
          null != e.lastHeaderCellStyle &&
            (t.lastHeaderCellStyle = this._parseToWorkbookTableStyleElement(
              e.lastHeaderCellStyle
            )),
          null != e.lastTotalCellStyle &&
            (t.lastTotalCellStyle = this._parseToWorkbookTableStyleElement(
              e.lastTotalCellStyle
            )),
          null != e.secondBandedColumnStyle &&
            (t.secondBandedColumnStyle = this._parseToWorkbookTableStyleElement(
              e.secondBandedColumnStyle,
              !0
            )),
          null != e.secondBandedRowStyle &&
            (t.secondBandedRowStyle = this._parseToWorkbookTableStyleElement(
              e.secondBandedRowStyle,
              !0
            )),
          null != e.totalRowStyle &&
            (t.totalRowStyle = this._parseToWorkbookTableStyleElement(
              e.totalRowStyle
            )),
          null != e.wholeTableStyle &&
            (t.wholeTableStyle = this._parseToWorkbookTableStyleElement(
              e.wholeTableStyle
            )),
          t
        );
      }),
      (t.prototype._parseToWorkbookTableStyleElement = function (e, t) {
        void 0 === t && (t = !1);
        var o,
          n = wjcGridXlsx.FlexGridXlsxConverter._parseCellStyle(e, !0);
        return (
          t
            ? ((o = new wjcXlsx.WorkbookTableBandedStyle()).size = e.size)
            : (o = new wjcXlsx.WorkbookTableCommonStyle()),
          o._deserialize(n),
          o
        );
      }),
      (t.prototype._isBuiltInStyleName = function (e) {
        var t;
        if (0 === e.search(/TableStyleLight/i)) {
          if (((t = +e.substring(15)), !isNaN(t) && t >= 1 && t <= 21))
            return !0;
        } else if (0 === e.search(/TableStyleMedium/i)) {
          if (((t = +e.substring(16)), !isNaN(t) && t >= 1 && t <= 28))
            return !0;
        } else if (
          0 === e.search(/TableStyleDark/i) &&
          ((t = +e.substring(14)), !isNaN(t) && t >= 1 && t <= 11)
        )
          return !0;
        return !1;
      }),
      (t.prototype._getTable = function (e) {
        var t;
        if (!this.tables) return null;
        for (var o = 0; o < this.tables.length; o++)
          if ((t = this.tables[o]).name.toLowerCase() === e.toLowerCase())
            return t;
        return null;
      }),
      (t.prototype._addTable = function (e, t, o, n, i, r) {
        var l, s, a, h, c, d, u;
        return (
          (null != t && null == this._getTable(t)) ||
            (t = this._getUniqueTableName()),
          null == i
            ? (l = new Table(this, t, e, o, n))
            : ((s = null == i.showHeaderRow || i.showHeaderRow),
              (a = null != i.showTotalRow && i.showTotalRow),
              (h = null != i.showBandedColumns && i.showBandedColumns),
              (c = null == i.showBandedRows || i.showBandedRows),
              (d = null != i.showFirstColumn && i.showFirstColumn),
              (u = null != i.showLastColumn && i.showLastColumn),
              (l = new Table(this, t, e, o, n, s, a, h, c, d, u))),
          null == this._tables &&
            (this._tables = new wjcCore.ObservableArray()),
          this._tables.push(l),
          r ? r.tableNames.push(t) : this.selectedSheet.tableNames.push(t),
          l
        );
      }),
      (t.prototype._isTableColumnRef = function (e, t) {
        return new RegExp('\\[(\\s*@)?' + t + '\\]', 'i').test(e);
      }),
      (t.prototype._getUniqueTableName = function () {
        for (var e = 'Table1', t = 2; ; ) {
          if (null == this._getTable(e)) break;
          (e = 'Table' + t), (t += 1);
        }
        return e;
      }),
      (t.prototype._getThemeColor = function (e, t) {
        var o,
          n,
          i = this._colorThemes[e];
        return null != t
          ? ((o = new wjcCore.Color('#' + i)),
            (n = o.getHsl()),
            (n[2] =
              t < 0 ? n[2] * (1 + t) : n[2] * (1 - t) + (1 - 1 * (1 - t))),
            (o = wjcCore.Color.fromHsl(n[0], n[1], n[2])).toString())
          : '#' + i;
      }),
      (t.prototype._createBuiltInTableStyle = function (e) {
        var t;
        if (0 === e.search(/TableStyleLight/i)) {
          if (((t = +e.substring(15)), !isNaN(t) && t >= 1 && t <= 21))
            return t <= 7
              ? this._generateTableLightStyle1(t - 1, e, !0)
              : t <= 14
              ? this._generateTableLightStyle2(t - 8, e)
              : this._generateTableLightStyle1(t - 15, e, !1);
        } else if (0 === e.search(/TableStyleMedium/i)) {
          if (((t = +e.substring(16)), !isNaN(t) && t >= 1 && t <= 28))
            return t <= 7
              ? this._generateTableMediumStyle1(t - 1, e)
              : t <= 14
              ? this._generateTableMediumStyle2(t - 8, e)
              : t <= 21
              ? this._generateTableMediumStyle3(t - 15, e)
              : this._generateTableMediumStyle4(t - 22, e);
        } else if (
          0 === e.search(/TableStyleDark/i) &&
          ((t = +e.substring(14)), !isNaN(t) && t >= 1 && t <= 11)
        )
          return t <= 7
            ? this._generateTableDarkStyle1(t - 1, e)
            : this._generateTableDarkStyle2(t - 8, e);
        return null;
      }),
      (t.prototype._generateTableLightStyle1 = function (e, t, o) {
        var n = new TableStyle(t, !0),
          i = 0 === e ? 1 : e + 3,
          r = o ? '1px' : '2px',
          l = o ? 'solid' : 'double',
          s = o ? '1px' : '3px';
        return (
          (n.wholeTableStyle = {
            borderTopColor: { theme: i },
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderBottomColor: { theme: i },
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
          }),
          (n.firstColumnStyle = { fontWeight: 'bold' }),
          (n.lastColumnStyle = { fontWeight: 'bold' }),
          (n.headerRowStyle = {
            borderBottomColor: { theme: i },
            borderBottomStyle: 'solid',
            borderBottomWidth: r,
            fontWeight: 'bold',
          }),
          (n.totalRowStyle = {
            borderTopColor: { theme: i },
            borderTopStyle: l,
            borderTopWidth: s,
            fontWeight: 'bold',
          }),
          0 === e
            ? ((n.wholeTableStyle.color = { theme: i }),
              (n.firstColumnStyle.color = { theme: i }),
              (n.lastColumnStyle.color = { theme: i }),
              (n.headerRowStyle.color = { theme: i }),
              (n.totalRowStyle.color = { theme: i }),
              (n.firstBandedRowStyle = {
                backgroundColor: { theme: 0, tint: -0.15 },
              }),
              (n.firstBandedColumnStyle = {
                backgroundColor: { theme: 0, tint: -0.15 },
              }))
            : (o
                ? ((n.wholeTableStyle.color = {
                    theme: i,
                    tint: -0.25,
                  }),
                  (n.firstColumnStyle.color = {
                    theme: i,
                    tint: -0.25,
                  }),
                  (n.lastColumnStyle.color = {
                    theme: i,
                    tint: -0.25,
                  }),
                  (n.headerRowStyle.color = {
                    theme: i,
                    tint: -0.25,
                  }),
                  (n.totalRowStyle.color = {
                    theme: i,
                    tint: -0.25,
                  }))
                : ((n.wholeTableStyle.color = { theme: 1 }),
                  (n.firstColumnStyle.color = { theme: 1 }),
                  (n.lastColumnStyle.color = { theme: 1 }),
                  (n.headerRowStyle.color = { theme: 1 }),
                  (n.totalRowStyle.color = { theme: 1 })),
              (n.firstBandedRowStyle = {
                backgroundColor: { theme: i, tint: 0.8 },
              }),
              (n.firstBandedColumnStyle = {
                backgroundColor: { theme: i, tint: 0.8 },
              })),
          o ||
            ((n.wholeTableStyle.borderLeftColor = { theme: i }),
            (n.wholeTableStyle.borderLeftStyle = 'solid'),
            (n.wholeTableStyle.borderLeftWidth = '1px'),
            (n.wholeTableStyle.borderRightColor = { theme: i }),
            (n.wholeTableStyle.borderRightStyle = 'solid'),
            (n.wholeTableStyle.borderRightWidth = '1px'),
            (n.wholeTableStyle.borderHorizontalColor = {
              theme: i,
            }),
            (n.wholeTableStyle.borderHorizontalStyle = 'solid'),
            (n.wholeTableStyle.borderHorizontalWidth = '1px'),
            (n.wholeTableStyle.borderVerticalColor = { theme: i }),
            (n.wholeTableStyle.borderVerticalStyle = 'solid'),
            (n.wholeTableStyle.borderVerticalWidth = '1px')),
          n
        );
      }),
      (t.prototype._generateTableLightStyle2 = function (e, t) {
        var o = new TableStyle(t, !0),
          n = 0 === e ? 1 : e + 3;
        return (
          (o.wholeTableStyle = {
            borderTopColor: { theme: n },
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderBottomColor: { theme: n },
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderLeftColor: { theme: n },
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
            borderRightColor: { theme: n },
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            color: { theme: 1 },
          }),
          (o.firstBandedRowStyle = {
            borderTopColor: { theme: n },
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
          }),
          (o.secondBandedRowStyle = {
            borderTopColor: { theme: n },
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
          }),
          (o.firstBandedColumnStyle = {
            borderLeftColor: { theme: n },
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
          }),
          (o.secondBandedColumnStyle = {
            borderLeftColor: { theme: n },
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
          }),
          (o.firstColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          (o.lastColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          (o.headerRowStyle = {
            backgroundColor: { theme: n },
            fontWeight: 'bold',
            color: { theme: 0 },
          }),
          (o.totalRowStyle = {
            borderTopColor: { theme: n },
            borderTopStyle: 'double',
            borderTopWidth: '3px',
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          o
        );
      }),
      (t.prototype._generateTableMediumStyle1 = function (e, t) {
        var o = new TableStyle(t, !0),
          n = 0 === e ? 1 : e + 3;
        return (
          (o.wholeTableStyle = {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderHorizontalStyle: 'solid',
            borderHorizontalWidth: '1px',
            color: { theme: 1 },
          }),
          0 === e
            ? ((o.wholeTableStyle.borderTopColor = { theme: n }),
              (o.wholeTableStyle.borderBottomColor = { theme: n }),
              (o.wholeTableStyle.borderLeftColor = { theme: n }),
              (o.wholeTableStyle.borderRightColor = { theme: n }),
              (o.wholeTableStyle.borderHorizontalColor = {
                theme: n,
              }),
              (o.firstBandedRowStyle = {
                backgroundColor: { theme: 0, tint: -0.15 },
              }),
              (o.firstBandedColumnStyle = {
                backgroundColor: { theme: 0, tint: -0.15 },
              }))
            : ((o.wholeTableStyle.borderTopColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.borderBottomColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.borderLeftColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.borderRightColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.borderHorizontalColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.firstBandedRowStyle = {
                backgroundColor: { theme: n, tint: 0.8 },
              }),
              (o.firstBandedColumnStyle = {
                backgroundColor: { theme: n, tint: 0.8 },
              })),
          (o.firstColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          (o.lastColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          (o.headerRowStyle = {
            backgroundColor: { theme: n },
            fontWeight: 'bold',
            color: { theme: 0 },
          }),
          (o.totalRowStyle = {
            borderTopColor: { theme: n },
            borderTopStyle: 'double',
            borderTopWidth: '3px',
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          o
        );
      }),
      (t.prototype._generateTableMediumStyle2 = function (e, t) {
        var o = new TableStyle(t, !0),
          n = 0 === e ? 1 : e + 3;
        return (
          (o.wholeTableStyle = {
            borderVerticalStyle: 'solid',
            borderVerticalWidth: '1px',
            borderVerticalColor: { theme: 0 },
            borderHorizontalStyle: 'solid',
            borderHorizontalWidth: '1px',
            borderHorizontalColor: { theme: 0 },
            color: { theme: 1 },
          }),
          0 === e
            ? ((o.wholeTableStyle.backgroundColor = {
                theme: 0,
                tint: -0.15,
              }),
              (o.firstBandedRowStyle = {
                backgroundColor: { theme: 0, tint: -0.35 },
              }),
              (o.firstBandedColumnStyle = {
                backgroundColor: { theme: 0, tint: -0.35 },
              }))
            : ((o.wholeTableStyle.backgroundColor = {
                theme: n,
                tint: 0.8,
              }),
              (o.firstBandedRowStyle = {
                backgroundColor: { theme: n, tint: 0.6 },
              }),
              (o.firstBandedColumnStyle = {
                backgroundColor: { theme: n, tint: 0.6 },
              })),
          (o.firstColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 0 },
            backgroundColor: { theme: n },
          }),
          (o.lastColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 0 },
            backgroundColor: { theme: n },
          }),
          (o.headerRowStyle = {
            borderBottomColor: { theme: 0 },
            borderBottomStyle: 'solid',
            borderBottomWidth: '3px',
            backgroundColor: { theme: n },
            fontWeight: 'bold',
            color: { theme: 0 },
          }),
          (o.totalRowStyle = {
            borderTopColor: { theme: 0 },
            borderTopStyle: 'solid',
            borderTopWidth: '3px',
            backgroundColor: { theme: n },
            fontWeight: 'bold',
            color: { theme: 0 },
          }),
          o
        );
      }),
      (t.prototype._generateTableMediumStyle3 = function (e, t) {
        var o = new TableStyle(t, !0),
          n = 0 === e ? 1 : e + 3;
        return (
          (o.wholeTableStyle = {
            borderTopStyle: 'solid',
            borderTopWidth: '2px',
            borderTopColor: { theme: 1 },
            borderBottomStyle: 'solid',
            borderBottomWidth: '2px',
            borderBottomColor: { theme: 1 },
            color: { theme: 1 },
          }),
          0 === e &&
            ((o.wholeTableStyle.borderLeftColor = { theme: 1 }),
            (o.wholeTableStyle.borderLeftStyle = 'solid'),
            (o.wholeTableStyle.borderLeftWidth = '1px'),
            (o.wholeTableStyle.borderRightColor = { theme: 1 }),
            (o.wholeTableStyle.borderRightStyle = 'solid'),
            (o.wholeTableStyle.borderRightWidth = '1px'),
            (o.wholeTableStyle.borderVerticalColor = { theme: 1 }),
            (o.wholeTableStyle.borderVerticalStyle = 'solid'),
            (o.wholeTableStyle.borderVerticalWidth = '1px'),
            (o.wholeTableStyle.borderHorizontalColor = {
              theme: 1,
            }),
            (o.wholeTableStyle.borderHorizontalStyle = 'solid'),
            (o.wholeTableStyle.borderHorizontalWidth = '1px')),
          (o.firstBandedRowStyle = {
            backgroundColor: { theme: 0, tint: -0.35 },
          }),
          (o.firstBandedColumnStyle = {
            backgroundColor: { theme: 0, tint: -0.35 },
          }),
          (o.firstColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 0 },
            backgroundColor: { theme: n },
          }),
          (o.lastColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 0 },
            backgroundColor: { theme: n },
          }),
          (o.headerRowStyle = {
            borderBottomColor: { theme: 1 },
            borderBottomStyle: 'solid',
            borderBottomWidth: '2px',
            backgroundColor: { theme: n },
            fontWeight: 'bold',
            color: { theme: 0 },
          }),
          (o.totalRowStyle = {
            borderTopColor: { theme: 1 },
            borderTopStyle: 'double',
            borderTopWidth: '3px',
          }),
          o
        );
      }),
      (t.prototype._generateTableMediumStyle4 = function (e, t) {
        var o = new TableStyle(t, !0),
          n = 0 === e ? 1 : e + 3;
        return (
          (o.wholeTableStyle = {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
            borderRightStyle: 'solid',
            borderRightWidth: '1px',
            borderVerticalStyle: 'solid',
            borderVerticalWidth: '1px',
            borderHorizontalStyle: 'solid',
            borderHorizontalWidth: '1px',
            color: { theme: 1 },
          }),
          0 === e
            ? ((o.wholeTableStyle.borderTopColor = { theme: n }),
              (o.wholeTableStyle.borderBottomColor = { theme: n }),
              (o.wholeTableStyle.borderLeftColor = { theme: n }),
              (o.wholeTableStyle.borderRightColor = { theme: n }),
              (o.wholeTableStyle.borderVerticalColor = {
                theme: n,
              }),
              (o.wholeTableStyle.borderHorizontalColor = {
                theme: n,
              }),
              (o.wholeTableStyle.backgroundColor = {
                theme: 0,
                tint: -0.15,
              }),
              (o.firstBandedRowStyle = {
                backgroundColor: { theme: 0, tint: -0.35 },
              }),
              (o.firstBandedColumnStyle = {
                backgroundColor: { theme: 0, tint: -0.35 },
              }))
            : ((o.wholeTableStyle.borderTopColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.borderBottomColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.borderLeftColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.borderRightColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.borderVerticalColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.borderHorizontalColor = {
                theme: n,
                tint: 0.4,
              }),
              (o.wholeTableStyle.backgroundColor = {
                theme: n,
                tint: 0.8,
              }),
              (o.firstBandedRowStyle = {
                backgroundColor: { theme: n, tint: 0.6 },
              }),
              (o.firstBandedColumnStyle = {
                backgroundColor: { theme: n, tint: 0.6 },
              })),
          (o.firstColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          (o.lastColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          (o.headerRowStyle = {
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          (o.totalRowStyle = {
            borderTopColor: { theme: n },
            borderTopStyle: 'solid',
            borderTopWidth: '2px',
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          o
        );
      }),
      (t.prototype._generateTableDarkStyle1 = function (e, t) {
        var o = new TableStyle(t, !0),
          n = 0 === e ? 1 : e + 3,
          i = 0 === e ? 0.25 : -0.25;
        return (
          (o.wholeTableStyle = { color: { theme: 0 } }),
          (o.firstBandedRowStyle = {
            backgroundColor: { theme: n, tint: i },
          }),
          (o.firstBandedColumnStyle = {
            backgroundColor: { theme: n, tint: i },
          }),
          (o.firstColumnStyle = {
            borderRightColor: { theme: 0 },
            borderRightStyle: 'solid',
            borderRightWidth: '2px',
            fontWeight: 'bold',
            color: { theme: 0 },
            backgroundColor: { theme: n, tint: i },
          }),
          (o.lastColumnStyle = {
            borderLeftColor: { theme: 0 },
            borderLeftStyle: 'solid',
            borderLeftWidth: '2px',
            fontWeight: 'bold',
            color: { theme: 0 },
            backgroundColor: { theme: n, tint: i },
          }),
          (o.headerRowStyle = {
            borderBottomColor: { theme: 0 },
            borderBottomStyle: 'solid',
            borderBottomWidth: '2px',
            fontWeight: 'bold',
            color: { theme: 0 },
            backgroundColor: { theme: 1 },
          }),
          (o.totalRowStyle = {
            borderTopColor: { theme: 0 },
            borderTopStyle: 'solid',
            borderTopWidth: '2px',
            fontWeight: 'bold',
            color: { theme: 0 },
          }),
          0 === e
            ? ((o.wholeTableStyle.backgroundColor = {
                theme: n,
                tint: 0.5,
              }),
              (o.totalRowStyle.backgroundColor = {
                theme: n,
                tint: 0.15,
              }))
            : ((o.wholeTableStyle.backgroundColor = { theme: n }),
              (o.totalRowStyle.backgroundColor = {
                theme: n,
                tint: -0.5,
              })),
          o
        );
      }),
      (t.prototype._generateTableDarkStyle2 = function (e, t) {
        var o = new TableStyle(t, !0),
          n = 0 === e ? 0 : 2 * e + 2,
          i = 0 === e ? 1 : 2 * e + 3,
          r = 0 === e ? -0.15 : 0.8;
        return (
          (o.wholeTableStyle = {
            backgroundColor: { theme: n, tint: r },
          }),
          (o.firstBandedRowStyle = {
            backgroundColor: { theme: n, tint: r - 0.2 },
          }),
          (o.firstBandedColumnStyle = {
            backgroundColor: { theme: n, tint: r - 0.2 },
          }),
          (o.firstColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          (o.lastColumnStyle = {
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          (o.headerRowStyle = {
            color: { theme: 0 },
            backgroundColor: { theme: i },
          }),
          (o.totalRowStyle = {
            borderTopColor: { theme: 1 },
            borderTopStyle: 'double',
            borderTopWidth: '3px',
            fontWeight: 'bold',
            color: { theme: 1 },
          }),
          o
        );
      }),
      (t.controlTemplate =
        '<div style="width:100%;height:100%"><div wj-part="container" style="width:100%">' +
        wjcGrid.FlexGrid.controlTemplate +
        '</div><div wj-part="tab-holder" style="width:100%; min-width:100px"></div><div wj-part="context-menu" style="display:none;z-index:100"></div></div>'),
      t
    );
  })(wjcGrid.FlexGrid);
exports.FlexSheet = FlexSheet;
var DraggingRowColumnEventArgs = (function (e) {
  function t(t, o) {
    var n = e.call(this) || this;
    return (n._isDraggingRows = t), (n._isShiftKey = o), n;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'isDraggingRows', {
      get: function () {
        return this._isDraggingRows;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isShiftKey', {
      get: function () {
        return this._isShiftKey;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.EventArgs);
exports.DraggingRowColumnEventArgs = DraggingRowColumnEventArgs;
var UnknownFunctionEventArgs = (function (e) {
  function t(t, o) {
    var n = e.call(this) || this;
    return (n._funcName = t), (n._params = o), n;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'funcName', {
      get: function () {
        return this._funcName;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'params', {
      get: function () {
        return this._params;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.EventArgs);
exports.UnknownFunctionEventArgs = UnknownFunctionEventArgs;
var RowColumnChangedEventArgs = (function (e) {
  function t(t, o, n) {
    var i = e.call(this) || this;
    return (i._index = t), (i._count = o), (i._added = n), i;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'index', {
      get: function () {
        return this._index;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'count', {
      get: function () {
        return this._count;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'added', {
      get: function () {
        return this._added;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isAdd', {
      get: function () {
        return (
          wjcCore._deprecated(
            'RowColumnChangedEventArgs.isAdd',
            'RowColumnChangedEventArgs.added'
          ),
          this._added
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.EventArgs);
exports.RowColumnChangedEventArgs = RowColumnChangedEventArgs;
var FlexSheetPanel = (function (e) {
  function t(t, o, n, i, r) {
    return e.call(this, t, o, n, i, r) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.getSelectedState = function (t, o, n) {
      var i, r, l, s, a, h;
      if (this.grid) {
        if (
          ((h = this.grid.getMergedRange(this, t, o)),
          (i = this.grid.selectedSheet
            ? this.grid.selectedSheet.selectionRanges
            : null),
          (a = e.prototype.getSelectedState.call(this, t, o, n)),
          (r = i ? i.length : 0),
          a === wjcGrid.SelectedState.None && r > 0)
        )
          for (l = 0; l < i.length; l++)
            if ((s = i[l]) && s instanceof wjcGrid.CellRange) {
              if (this.cellType === wjcGrid.CellType.Cell) {
                if (h) {
                  if (h.contains(s.row, s.col))
                    return l !== r - 1 || this.grid._isClicking
                      ? wjcGrid.SelectedState.Selected
                      : this.grid.showMarquee
                      ? wjcGrid.SelectedState.None
                      : wjcGrid.SelectedState.Cursor;
                  if (h.intersects(s)) return wjcGrid.SelectedState.Selected;
                }
                if (s.row === t && s.col === o)
                  return l !== r - 1 || this.grid._isClicking
                    ? wjcGrid.SelectedState.Selected
                    : this.grid.showMarquee
                    ? wjcGrid.SelectedState.None
                    : wjcGrid.SelectedState.Cursor;
                if (s.contains(t, o)) return wjcGrid.SelectedState.Selected;
              }
              if (
                this.grid.showSelectedHeaders & wjcGrid.HeadersVisibility.Row &&
                this.cellType === wjcGrid.CellType.RowHeader &&
                s.containsRow(t)
              )
                return wjcGrid.SelectedState.Selected;
              if (
                this.grid.showSelectedHeaders &
                  wjcGrid.HeadersVisibility.Column &&
                this.cellType === wjcGrid.CellType.ColumnHeader &&
                s.containsColumn(o)
              )
                return wjcGrid.SelectedState.Selected;
            }
        return a;
      }
    }),
    (t.prototype.getCellData = function (t, o, n) {
      var i, r, l, s, a;
      if (wjcCore.isString(o) && (o = this.columns.indexOf(o)) < 0)
        throw 'Invalid column name or binding.';
      return t >= this.rows.length ||
        wjcCore.asNumber(o, !1, !0) >= this.columns.length
        ? null
        : ((i = e.prototype.getCellData.call(this, t, o, n)),
          (r = this.columns[wjcCore.asNumber(o, !1, !0)]),
          (l = this.grid ? this.grid._getBindingColumn(this, t, r) : r),
          n &&
            ((a = e.prototype.getCellData.call(this, t, o, !1)),
            (s = this.grid ? this.grid._getCellStyle(t, o) : null),
            !wjcCore.isNumber(a) ||
              0 === a ||
              !l ||
              l.format ||
              l.dataMap ||
              s ||
              (i = a.toString())),
          i);
    }),
    (t.prototype.setCellData = function (t, o, n, i, r) {
      void 0 === i && (i = !0), void 0 === r && (r = !0);
      var l,
        s = this.getCellData(t, o, !1),
        a = this.grid._isPasting;
      return (
        i &&
          n &&
          wjcCore.isString(n) &&
          "'" !== n[0] &&
          (this.grid.columns[o].dataType === wjcCore.DataType.String ||
          wjcCore.isNullOrWhiteSpace(n) ||
          isNaN(+n)
            ? this.grid.columns[o].dataType === wjcCore.DataType.Boolean
              ? (n = wjcCore.changeType(n, wjcCore.DataType.Boolean, null))
              : '=' !== n[0] &&
                (l = wjcCore.Globalize.parseDate(n, '')) &&
                (n = l)
            : (n = +n)),
        ((n && wjcCore.isString(n) && ('=' === n[0] || "'" === n[0])) ||
          wjcCore.isString(s)) &&
          (i = !1),
        e.prototype.setCellData.call(this, t, o, n, i && !a, r)
      );
    }),
    (t.prototype._renderCell = function (t, o, n, i, r, l) {
      var s,
        a,
        h,
        c,
        d = o * this.grid.columns.length + n,
        u = this.grid.getMergedRange(this, o, n);
      return (
        (c = e.prototype._renderCell.call(this, t, o, n, i, r, l)),
        this.cellType !== wjcGrid.CellType.Cell
          ? c
          : u && d > u.topRow * this.grid.columns.length + u.leftCol
          ? c
          : ((s = t.childNodes[l]) &&
              ((null != this.grid.editRange &&
                this.grid.editRange.contains(o, n)) ||
                (this.grid.selectedSheet &&
                  (h = this.grid.selectedSheet.findTable(o, n)) &&
                  h._updateCell(o, n, s)),
              wjcCore.hasClass(s, 'wj-state-selected') ||
              wjcCore.hasClass(s, 'wj-state-multi-selected')
                ? ((s.style.backgroundColor = ''), (s.style.color = ''))
                : this.grid.selectedSheet &&
                  (a = this.grid.selectedSheet._styledCells[d]) &&
                  ('' !== a.backgroundColor &&
                    (s.style.backgroundColor = a.backgroundColor),
                  '' !== a.color && (s.style.color = a.color))),
            c)
      );
    }),
    t
  );
})(wjcGrid.GridPanel);
exports.FlexSheetPanel = FlexSheetPanel;
var HeaderRow = (function (e) {
  function t() {
    var t = e.call(this) || this;
    return (t.isReadOnly = !0), t;
  }
  return __extends(t, e), t;
})(wjcGrid.Row);
exports.HeaderRow = HeaderRow;
var DefinedName = (function () {
  function e(e, t, o, n) {
    if (((this._owner = e), (this._name = t), (this._value = o), null != n)) {
      if (!e._validateSheetName(n))
        throw 'The sheet name:(' + n + ') does not exist in FlexSheet.';
      this._sheetName = n;
    }
  }
  return (
    Object.defineProperty(e.prototype, 'name', {
      get: function () {
        return this._name;
      },
      set: function (e) {
        var t;
        if (this._name !== e) {
          if (this._owner._checkExistDefinedName(name, this._sheetName))
            throw 'The ' + name + ' already existed in definedNames.';
          (t = this._name),
            (this._name = e),
            this._owner._updateFormulasWithNameUpdating(t, this._name);
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'value', {
      get: function () {
        return this._value;
      },
      set: function (e) {
        this._value !== e && (this._value = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'sheetName', {
      get: function () {
        return this._sheetName;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
exports.DefinedName = DefinedName;
var Sheet = (function () {
  function e(e, t, o, n, i) {
    (this._visible = !0),
      (this._unboundSortDesc = new wjcCore.ObservableArray()),
      (this._currentStyledCells = {}),
      (this._currentMergedRanges = {}),
      (this._isEmptyGrid = !1),
      (this._rowSettings = []),
      (this._scrollPosition = new wjcCore.Point()),
      (this._freezeHiddenRowCnt = 0),
      (this._freezeHiddenColumnCnt = 0),
      (this._tableNames = []),
      (this.nameChanged = new wjcCore.Event()),
      (this.visibleChanged = new wjcCore.Event());
    var r = this;
    (r._owner = e),
      (r._name = o),
      wjcCore.isNumber(n) && !isNaN(n) && n >= 0
        ? (r._rowCount = n)
        : (r._rowCount = 200),
      wjcCore.isNumber(i) && !isNaN(i) && i >= 0
        ? (r._columnCount = i)
        : (r._columnCount = 20),
      (r._grid = t || this._createGrid()),
      r._grid.itemsSourceChanged.addHandler(this._gridItemsSourceChanged, this),
      r._addHeaderRow(),
      r._unboundSortDesc.collectionChanged.addHandler(function () {
        var e,
          t,
          o = r._unboundSortDesc;
        for (e = 0; e < o.length; e++)
          if (!wjcCore.tryCast(o[e], _UnboundSortDescription))
            throw 'sortDescriptions array must contain SortDescription objects.';
        if (r._owner) {
          if (
            (r._owner.rows.beginUpdate(),
            r._owner.rows.sort(r._compareRows()),
            !r._owner._isUndoing)
          )
            for (e = 0; e < r._owner.rows.length; e++)
              e !== (t = r._owner.rows[e])._idx &&
                r._owner._updateFormulaForReorderingRows(t._idx, e);
          r._owner.rows.endUpdate(),
            (r._owner.rows._dirty = !0),
            r._owner.rows._update(),
            r._owner.selectedSheet &&
              (r._owner._copyTo(r._owner.selectedSheet),
              r._owner._copyFrom(r._owner.selectedSheet));
        }
      });
  }
  return (
    Object.defineProperty(e.prototype, 'grid', {
      get: function () {
        return (
          null == this._grid.wj_sheetInfo && (this._grid.wj_sheetInfo = {}),
          this._grid
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'name', {
      get: function () {
        return this._name;
      },
      set: function (e) {
        if (
          !wjcCore.isNullOrWhiteSpace(e) &&
          ((this._name && this._name.toLowerCase() !== e.toLowerCase()) ||
            !this._name)
        ) {
          var t = new wjcCore.PropertyChangedEventArgs(
            'sheetName',
            this._name,
            e
          );
          (this._name = e),
            (this.grid.wj_sheetInfo.name = e),
            this.onNameChanged(t);
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'visible', {
      get: function () {
        return this._visible;
      },
      set: function (e) {
        this._visible !== e &&
          ((this._visible = e),
          (this.grid.wj_sheetInfo.visible = e),
          this.onVisibleChanged(new wjcCore.EventArgs()));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'rowCount', {
      get: function () {
        return null != this._grid ? this._grid.rows.length : 0;
      },
      set: function (e) {
        var t;
        if (
          !this.itemsSource &&
          wjcCore.isNumber(e) &&
          !isNaN(e) &&
          e >= 0 &&
          this._rowCount !== e
        ) {
          if (this._rowCount < e)
            for (t = 0; t < e - this._rowCount; t++)
              this.grid.rows.push(new wjcGrid.Row());
          else this.grid.rows.splice(e, this._rowCount - e);
          (this._rowCount = e),
            this._owner &&
              this._owner.selectedSheet &&
              this._name === this._owner.selectedSheet.name &&
              this._owner._copyFrom(this, !0);
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'columnCount', {
      get: function () {
        return null != this._grid ? this._grid.columns.length : 0;
      },
      set: function (e) {
        var t;
        if (
          !this.itemsSource &&
          wjcCore.isNumber(e) &&
          !isNaN(e) &&
          e >= 0 &&
          this._columnCount !== e
        ) {
          if (this._columnCount < e)
            for (t = 0; t < e - this._columnCount; t++)
              this._grid.columns.push(new wjcGrid.Column());
          else this._grid.columns.splice(e, this._columnCount - e);
          (this._columnCount = e),
            this._owner &&
              this._owner.selectedSheet &&
              this._name === this._owner.selectedSheet.name &&
              this._owner._copyFrom(this, !0);
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'selectionRanges', {
      get: function () {
        var e = this;
        return (
          this._selectionRanges ||
            ((this._selectionRanges = new wjcCore.ObservableArray()),
            this._selectionRanges.collectionChanged.addHandler(function () {
              var t, o;
              e._owner &&
                !e._owner._isClicking &&
                ((t = e._selectionRanges.length) > 0 &&
                  (o = e._selectionRanges[t - 1]) &&
                  o instanceof wjcGrid.CellRange &&
                  (e._owner.selection = o),
                t > 1
                  ? ((e._owner._enableMulSel = !0), e._owner.refresh(!1))
                  : e._owner.invalidate(),
                (e._owner._enableMulSel = !1));
            }, this)),
          this._selectionRanges
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'itemsSource', {
      get: function () {
        return null != this._grid ? this._grid.itemsSource : null;
      },
      set: function (e) {
        var t = this;
        null == t._grid &&
          (t._createGrid(),
          t._grid.itemsSourceChanged.addHandler(t._gridItemsSourceChanged, t)),
          t._isEmptyGrid && t._clearGrid(),
          t._grid.loadedRows.addHandler(function () {
            t._addHeaderRow();
          }),
          (t._grid.itemsSource = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_styledCells', {
      get: function () {
        return (
          this._currentStyledCells || (this._currentStyledCells = {}),
          this._currentStyledCells
        );
      },
      set: function (e) {
        this._currentStyledCells = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, '_mergedRanges', {
      get: function () {
        return (
          this._currentMergedRanges || (this._currentMergedRanges = {}),
          this._currentMergedRanges
        );
      },
      set: function (e) {
        this._currentMergedRanges = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'tableNames', {
      get: function () {
        return this._tableNames;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onNameChanged = function (e) {
      this.nameChanged.raise(this, e);
    }),
    (e.prototype.onVisibleChanged = function (e) {
      this.visibleChanged.raise(this, e);
    }),
    (e.prototype.getCellStyle = function (e, t) {
      var o,
        n = this._grid.rows.length,
        i = this._grid.columns.length;
      return e >= n || t >= i ? null : ((o = e * i + t), this._styledCells[o]);
    }),
    (e.prototype.findTable = function (e, t) {
      for (var o, n, i, r = 0; r < this.tableNames.length; r++)
        if (
          ((o = this.tableNames[r]),
          null != (n = this._owner._getTable(o)) &&
            ((i = n.range),
            e >= i.topRow &&
              e <= i.bottomRow &&
              t >= i.leftCol &&
              t <= i.rightCol))
        )
          return n;
      return null;
    }),
    (e.prototype._attachOwner = function (e) {
      this._owner !== e && (this._owner = e);
    }),
    (e.prototype._setValidName = function (e) {
      (this._name = e), (this.grid.wj_sheetInfo.name = e);
    }),
    (e.prototype._storeRowSettings = function () {
      var e,
        t = 0;
      for (this._rowSettings = []; t < this._grid.rows.length; t++)
        (e = this._owner.rows[t]) &&
          (this._rowSettings[t] = {
            height: e.height,
            allowMerging: e.allowMerging,
            isCollapsed: e instanceof wjcGrid.GroupRow ? e.isCollapsed : null,
            visible: e.visible,
          });
    }),
    (e.prototype._setRowSettings = function () {
      for (var e, t, o = 0; o < this._rowSettings.length; o++)
        (t = this._rowSettings[o]) &&
          (((e = this._grid.rows[o]).height = t.height),
          (e.allowMerging = t.allowMerging),
          (e.visible = t.visible),
          e instanceof wjcGrid.GroupRow && (e.isCollapsed = t.isCollapsed));
    }),
    (e.prototype._compareRows = function () {
      var e = this,
        t = this._unboundSortDesc;
      return function (o, n) {
        for (var i = 0; i < t.length; i++) {
          var r = t[i],
            l = o._ubv && r.column ? o._ubv[r.column._hash] : '',
            s = n._ubv && r.column ? n._ubv[r.column._hash] : '';
          if (
            (wjcCore.isString(l) &&
              '=' === l[0] &&
              (null == (l = e._owner.evaluate(l)) ||
                wjcCore.isPrimitive(l) ||
                (l = l.value)),
            wjcCore.isString(s) &&
              '=' === s[0] &&
              (null == (s = e._owner.evaluate(s)) ||
                wjcCore.isPrimitive(s) ||
                (s = s.value)),
            l !== l && (l = null),
            s !== s && (s = null),
            wjcCore.isString(l) && (l = l.toLowerCase() + l),
            wjcCore.isString(s) && (s = s.toLowerCase() + s),
            '' === l || null == l)
          )
            return 1;
          if ('' === s || null == s) return -1;
          var a = l < s ? -1 : l > s ? 1 : 0;
          if (
            (wjcCore.isString(l) && wjcCore.isNumber(s) && (a = 1),
            wjcCore.isString(s) && wjcCore.isNumber(l) && (a = -1),
            0 !== a)
          )
            return r.ascending ? +a : -a;
        }
        return 0;
      };
    }),
    (e.prototype._createGrid = function () {
      var e,
        t,
        o,
        n,
        i = document.createElement('div');
      for (
        this._isEmptyGrid = !0,
          i.style.visibility = 'hidden',
          document.body.appendChild(i),
          e = new wjcGrid.FlexGrid(i),
          document.body.removeChild(i),
          n = 0;
        n < this._rowCount;
        n++
      )
        e.rows.push(new wjcGrid.Row());
      for (o = 0; o < this._columnCount; o++)
        ((t = new wjcGrid.Column()).isRequired = !1), e.columns.push(t);
      return (
        (e.wj_sheetInfo = {
          name: this.name,
          visible: this.visible,
          styledCells: this._styledCells,
          mergedRanges: this._mergedRanges,
        }),
        e
      );
    }),
    (e.prototype._clearGrid = function () {
      this._grid.rows.clear(),
        this._grid.columns.clear(),
        this._grid.columnHeaders.columns.clear(),
        this._grid.rowHeaders.rows.clear();
    }),
    (e.prototype._gridItemsSourceChanged = function () {
      var e = this;
      e._owner &&
        e._owner.selectedSheet &&
        e._name === e._owner.selectedSheet.name &&
        (e._owner._filter.clear(),
        e._owner._copyFrom(e, !1),
        setTimeout(function () {
          e._owner._setFlexSheetToDirty(), e._owner.invalidate();
        }, 10));
    }),
    (e.prototype._addHeaderRow = function () {
      if (
        this._grid.itemsSource &&
        !(this._grid.rows[0] instanceof HeaderRow)
      ) {
        for (
          var e, t = new HeaderRow(), o = 0;
          o < this._grid.columns.length;
          o++
        )
          (e = this._grid.columns[o]),
            t._ubv || (t._ubv = {}),
            (t._ubv[e._hash] = e.header);
        this._grid.rows.insert(0, t);
      }
    }),
    e
  );
})();
exports.Sheet = Sheet;
var SheetCollection = (function (e) {
  function t() {
    var t = (null !== e && e.apply(this, arguments)) || this;
    return (
      (t._current = -1),
      (t.sheetCleared = new wjcCore.Event()),
      (t.selectedSheetChanged = new wjcCore.Event()),
      (t.sheetNameChanged = new wjcCore.Event()),
      (t.sheetVisibleChanged = new wjcCore.Event()),
      t
    );
  }
  return (
    __extends(t, e),
    (t.prototype.onSheetCleared = function () {
      this.sheetCleared.raise(this, new wjcCore.EventArgs());
    }),
    Object.defineProperty(t.prototype, 'selectedIndex', {
      get: function () {
        return this._current;
      },
      set: function (e) {
        this._moveCurrentTo(+e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onSelectedSheetChanged = function (e) {
      this.selectedSheetChanged.raise(this, e);
    }),
    (t.prototype.insert = function (t, o) {
      var n;
      (n = o.name ? this.getValidSheetName(o) : this._getUniqueName()) !==
        o.name && (o.name = n),
        e.prototype.insert.call(this, t, o),
        this._postprocessSheet(o);
    }),
    (t.prototype.push = function () {
      for (var t = [], o = 0; o < arguments.length; o++) t[o] = arguments[o];
      this.length;
      for (var n, i = 0; i < t.length; i++)
        (n = t[i].name
          ? this.getValidSheetName(t[i])
          : this._getUniqueName()) !== t[i].name && (t[i].name = n),
          e.prototype.push.call(this, t[i]),
          this._postprocessSheet(t[i]);
      return this.length;
    }),
    (t.prototype.splice = function (t, o, n) {
      var i;
      return n
        ? ((i = n.name ? this.getValidSheetName(n) : this._getUniqueName()) !==
            n.name && (n.name = i),
          this._postprocessSheet(n),
          e.prototype.splice.call(this, t, o, n))
        : e.prototype.splice.call(this, t, o, n);
    }),
    (t.prototype.removeAt = function (t) {
      this.hide(t) &&
        (e.prototype.removeAt.call(this, t),
        t < this.selectedIndex && (this._current -= 1));
    }),
    (t.prototype.onSheetNameChanged = function (e) {
      this.sheetNameChanged.raise(this, e);
    }),
    (t.prototype.onSheetVisibleChanged = function (e) {
      this.sheetVisibleChanged.raise(this, e);
    }),
    (t.prototype.selectFirst = function () {
      return this._moveCurrentTo(0);
    }),
    (t.prototype.selectLast = function () {
      return this._moveCurrentTo(this.length - 1);
    }),
    (t.prototype.selectPrevious = function () {
      return this._moveCurrentTo(this._current - 1);
    }),
    (t.prototype.selectNext = function () {
      return this._moveCurrentTo(this._current + 1);
    }),
    (t.prototype.hide = function (e) {
      return (
        !(e < 0 && e >= this.length) &&
        !!this[e].visible &&
        ((this[e].visible = !1), !0)
      );
    }),
    (t.prototype.show = function (e) {
      return (
        !(e < 0 && e >= this.length) &&
        ((this[e].visible = !0), this._moveCurrentTo(e), !0)
      );
    }),
    (t.prototype.clear = function () {
      e.prototype.clear.call(this), (this._current = -1), this.onSheetCleared();
    }),
    (t.prototype.isValidSheetName = function (e) {
      var t = this._getSheetIndexFrom(e.name),
        o = this.indexOf(e);
      return -1 === t || t === o;
    }),
    (t.prototype.getValidSheetName = function (e) {
      for (var t, o = e.name, n = 1, i = this.indexOf(e); ; ) {
        if (-1 === (t = this._getSheetIndexFrom(o)) || t === i) break;
        (o = e.name.concat((n + 1).toString())), (n += 1);
      }
      return o;
    }),
    (t.prototype._moveCurrentTo = function (e) {
      var t,
        o = e;
      if (e < 0 || e >= this.length) return !1;
      if (this._current < o || 0 === o)
        for (; o < this.length && !this[o].visible; ) o++;
      else if (this._current > o) for (; o >= 0 && !this[o].visible; ) o--;
      if (o === this.length) for (o = e; o >= 0 && !this[o].visible; ) o--;
      return (
        !(o < 0) &&
        (o !== this._current &&
          ((t = new wjcCore.PropertyChangedEventArgs(
            'sheetIndex',
            this._current,
            o
          )),
          (this._current = o),
          this.onSelectedSheetChanged(t)),
        !0)
      );
    }),
    (t.prototype._getSheetIndexFrom = function (e) {
      var t;
      if (!e) return -1;
      e = e.toLowerCase();
      for (var o = 0; o < this.length; o++)
        if (((t = this[o]), (t.name ? t.name.toLowerCase() : '') === e))
          return o;
      return -1;
    }),
    (t.prototype._postprocessSheet = function (e) {
      var t = this;
      e.nameChanged.addHandler(function () {
        var o,
          n = t._getSheetIndexFrom(e.name);
        t.isValidSheetName(e) || e._setValidName(t.getValidSheetName(e)),
          (o = new wjcCore.NotifyCollectionChangedEventArgs(
            wjcCore.NotifyCollectionChangedAction.Change,
            e,
            wjcCore.isNumber(n) ? n : t.length - 1
          )),
          t.onSheetNameChanged(o);
      }),
        e.visibleChanged.addHandler(function () {
          var o = t._getSheetIndexFrom(e.name),
            n = new wjcCore.NotifyCollectionChangedEventArgs(
              wjcCore.NotifyCollectionChangedAction.Change,
              e,
              wjcCore.isNumber(o) ? o : t.length - 1
            );
          t.onSheetVisibleChanged(n);
        });
    }),
    (t.prototype._getUniqueName = function () {
      for (var e = 'Sheet1', t = 2; ; ) {
        if (-1 === this._getSheetIndexFrom(e)) break;
        (e = 'Sheet' + t), (t += 1);
      }
      return e;
    }),
    t
  );
})(wjcCore.ObservableArray);
exports.SheetCollection = SheetCollection;
var _SheetTabs = (function (e) {
  function t(t, o, n) {
    var i = e.call(this, t, n) || this;
    (i._rtl = !1), (i._sheetTabClicked = !1);
    var r = i;
    return (
      (r._owner = o),
      (r._sheets = o.sheets),
      (r._rtl = 'rtl' == getComputedStyle(r._owner.hostElement).direction),
      r.hostElement.attributes.tabindex &&
        r.hostElement.attributes.removeNamedItem('tabindex'),
      r._initControl(),
      r.deferUpdate(function () {
        n && r.initialize(n);
      }),
      i
    );
  }
  return (
    __extends(t, e),
    (t.prototype.refresh = function (e) {
      (this._tabContainer.innerHTML = ''),
        (this._tabContainer.innerHTML = this._getSheetTabs()),
        this._rtl && this._adjustSheetsPosition(),
        this._adjustSize();
    }),
    (t.prototype._sourceChanged = function (e, t) {
      void 0 === t && (t = wjcCore.NotifyCollectionChangedEventArgs.reset);
      var o = t;
      switch (o.action) {
        case wjcCore.NotifyCollectionChangedAction.Add:
          o.index - 1 < 0 && 0,
            (this._tabContainer.innerHTML = ''),
            (this._tabContainer.innerHTML = this._getSheetTabs()),
            this._rtl && this._adjustSheetsPosition(),
            this._adjustSize();
          break;
        case wjcCore.NotifyCollectionChangedAction.Remove:
          this._tabContainer.removeChild(this._tabContainer.children[o.index]),
            this._tabContainer.hasChildNodes() &&
              this._updateTabActive(o.index, !0),
            this._adjustSize();
          break;
        default:
          this.invalidate();
      }
    }),
    (t.prototype._selectedSheetChanged = function (e, t) {
      this._updateTabActive(t.oldValue, !1),
        this._updateTabActive(t.newValue, !0),
        this._sheetTabClicked
          ? (this._sheetTabClicked = !1)
          : this._scrollToActiveSheet(t.newValue, t.oldValue),
        this._adjustSize();
    }),
    (t.prototype._initControl = function () {
      var e = this;
      e.applyTemplate('', e.getTemplate(), {
        _sheetContainer: 'sheet-container',
        _tabContainer: 'container',
        _sheetPage: 'sheet-page',
        _newSheet: 'new-sheet',
      }),
        e._rtl &&
          ((e._sheetPage.style.right = '0px'),
          (e._tabContainer.parentElement.style.right =
            e._sheetPage.clientWidth + 'px'),
          (e._tabContainer.style.right = '0px'),
          (e._tabContainer.style.cssFloat = 'right'),
          (e._newSheet.style.right =
            e._sheetPage.clientWidth +
            e._tabContainer.parentElement.clientWidth +
            'px')),
        e._adjustNavigationButtons(e._rtl),
        e.addEventListener(e._newSheet, 'click', function (t) {
          var o = e._owner.selectedSheetIndex;
          e._owner.addUnboundSheet(),
            e._scrollToActiveSheet(e._owner.selectedSheetIndex, o);
        }),
        e._sheets.collectionChanged.addHandler(e._sourceChanged, e),
        e._sheets.selectedSheetChanged.addHandler(e._selectedSheetChanged, e),
        e._sheets.sheetNameChanged.addHandler(e._updateSheetName, e),
        e._sheets.sheetVisibleChanged.addHandler(e._updateTabShown, e),
        e._initSheetPage(),
        e._initSheetTab();
    }),
    (t.prototype._initSheetTab = function () {
      var e = this;
      e.addEventListener(e._tabContainer, 'mousedown', function (t) {
        var o,
          n = t.target;
        n instanceof HTMLLIElement &&
          ((e._sheetTabClicked = !0),
          (o = e._getItemIndex(e._tabContainer, n)),
          e._scrollSheetTabContainer(n),
          o > -1 && (e._sheets.selectedIndex = o));
      });
    }),
    (t.prototype._initSheetPage = function () {
      var e = this;
      e.hostElement
        .querySelector('div.wj-sheet-page')
        .addEventListener('click', function (t) {
          var o =
              '[object HTMLButtonElement]' === t.target.toString()
                ? t.target
                : t.target.parentElement,
            n = e._getItemIndex(e._sheetPage, o);
          if (0 !== e._sheets.length)
            switch (n) {
              case 0:
                e._sheets.selectFirst();
                break;
              case 1:
                e._sheets.selectPrevious();
                break;
              case 2:
                e._sheets.selectNext();
                break;
              case 3:
                e._sheets.selectLast();
            }
        });
    }),
    (t.prototype._getSheetTabs = function () {
      var e,
        t = '';
      for (e = 0; e < this._sheets.length; e++)
        t += this._getSheetElement(
          this._sheets[e],
          this._sheets.selectedIndex === e
        );
      return t;
    }),
    (t.prototype._getSheetElement = function (e, t) {
      void 0 === t && (t = !1);
      var o = '<li';
      return (
        e.visible ? t && (o += ' class="active"') : (o += ' class="hidden"'),
        (o += '>' + e.name + '</li>')
      );
    }),
    (t.prototype._updateTabActive = function (e, t) {
      e < 0 ||
        e >= this._tabContainer.children.length ||
        (t
          ? wjcCore.addClass(this._tabContainer.children[e], 'active')
          : wjcCore.removeClass(this._tabContainer.children[e], 'active'));
    }),
    (t.prototype._updateTabShown = function (e, t) {
      t.index < 0 ||
        t.index >= this._tabContainer.children.length ||
        (t.item.visible
          ? wjcCore.removeClass(this._tabContainer.children[t.index], 'hidden')
          : wjcCore.addClass(this._tabContainer.children[t.index], 'hidden'),
        this._adjustSize());
    }),
    (t.prototype._adjustSize = function () {
      var e,
        t,
        o = this._tabContainer.childElementCount,
        n = 0,
        i = 0;
      if ('none' !== this.hostElement.style.display) {
        for (
          i = this._tabContainer.parentElement.scrollLeft,
            this._tabContainer.parentElement.style.width = '',
            this._tabContainer.style.width = '',
            this._sheetPage.parentElement.style.width = '',
            e = 0;
          e < o;
          e++
        )
          n += this._tabContainer.children[e].offsetWidth + 1;
        (t =
          this.hostElement.offsetWidth -
          this._sheetPage.offsetWidth -
          this._newSheet.offsetWidth -
          2),
          (this._tabContainer.parentElement.style.width =
            (n > t ? t : n) + 'px'),
          (this._tabContainer.style.width = n + 'px'),
          (this._sheetPage.parentElement.style.width =
            this._sheetPage.offsetWidth +
            this._newSheet.offsetWidth +
            this._tabContainer.parentElement.offsetWidth +
            3 +
            'px'),
          (this._tabContainer.parentElement.scrollLeft = i);
      }
    }),
    (t.prototype._getItemIndex = function (e, t) {
      for (var o = 0; o < e.children.length; o++)
        if (e.children[o] === t) return o;
      return -1;
    }),
    (t.prototype._updateSheetName = function (e, t) {
      (this._tabContainer.querySelectorAll('li')[t.index].textContent =
        t.item.name),
        this._adjustSize();
    }),
    (t.prototype._scrollSheetTabContainer = function (e) {
      var t,
        o = this._tabContainer.parentElement.scrollLeft,
        n = this._sheetPage.offsetWidth,
        i = this._newSheet.offsetWidth,
        r = this._tabContainer.parentElement.offsetWidth;
      if (this._rtl)
        switch (wjcGrid.FlexGrid._getRtlMode()) {
          case 'rev':
            (t = -this._tabContainer.offsetLeft) +
              e.offsetLeft +
              e.offsetWidth >
            r + o
              ? (this._tabContainer.parentElement.scrollLeft += e.offsetWidth)
              : t + e.offsetLeft < o &&
                (this._tabContainer.parentElement.scrollLeft -= e.offsetWidth);
            break;
          case 'neg':
            e.offsetLeft < o
              ? (this._tabContainer.parentElement.scrollLeft -= e.offsetWidth)
              : e.offsetLeft + e.offsetWidth > r + o &&
                (this._tabContainer.parentElement.scrollLeft += e.offsetWidth);
            break;
          default:
            e.offsetLeft - i + o < 0
              ? (this._tabContainer.parentElement.scrollLeft += e.offsetWidth)
              : e.offsetLeft + e.offsetWidth - i + o > r &&
                (this._tabContainer.parentElement.scrollLeft -= e.offsetWidth);
        }
      else
        e.offsetLeft + e.offsetWidth - n > r + o
          ? (this._tabContainer.parentElement.scrollLeft += e.offsetWidth)
          : e.offsetLeft - n < o &&
            (this._tabContainer.parentElement.scrollLeft -= e.offsetWidth);
    }),
    (t.prototype._adjustSheetsPosition = function () {
      var e,
        t,
        o = this._tabContainer.querySelectorAll('li'),
        n = 0;
      for (t = 0; t < o.length; t++)
        ((e = o[t]).style.cssFloat = 'right'),
          (e.style.right = n + 'px'),
          (n += o[t].clientWidth);
    }),
    (t.prototype._scrollToActiveSheet = function (e, t) {
      var o,
        n,
        i,
        r = this._tabContainer.querySelectorAll('li');
      if (
        ((n =
          this._tabContainer.clientWidth >
          this._tabContainer.parentElement.clientWidth
            ? this._tabContainer.clientWidth -
              this._tabContainer.parentElement.clientWidth
            : 0),
        r.length > 0 && e < r.length && t < r.length)
      ) {
        if ((0 === e && !this._rtl) || (e === r.length - 1 && this._rtl)) {
          if (this._rtl)
            switch (wjcGrid.FlexGrid._getRtlMode()) {
              case 'rev':
                this._tabContainer.parentElement.scrollLeft = 0;
                break;
              case 'neg':
                this._tabContainer.parentElement.scrollLeft = -n;
                break;
              default:
                this._tabContainer.parentElement.scrollLeft = n;
            }
          else this._tabContainer.parentElement.scrollLeft = 0;
          return;
        }
        if ((0 === e && this._rtl) || (e === r.length - 1 && !this._rtl)) {
          if (this._rtl)
            switch (wjcGrid.FlexGrid._getRtlMode()) {
              case 'rev':
                this._tabContainer.parentElement.scrollLeft = n;
                break;
              case 'neg':
              default:
                this._tabContainer.parentElement.scrollLeft = 0;
            }
          else this._tabContainer.parentElement.scrollLeft = n;
          return;
        }
        if (e >= t)
          for (i = t + 1; i <= e; i++)
            (o = r[i]), this._scrollSheetTabContainer(o);
        else
          for (i = t - 1; i >= e; i--)
            (o = r[i]), this._scrollSheetTabContainer(o);
      }
    }),
    (t.prototype._adjustNavigationButtons = function (e) {
      var t,
        o = this.hostElement.querySelectorAll('.wj-sheet-page button');
      o &&
        4 === o.length &&
        (e
          ? ((t = o[0].querySelector('span')),
            wjcCore.removeClass(t, 'wj-glyph-step-backward'),
            wjcCore.addClass(t, 'wj-glyph-step-backward-rtl'),
            (t = o[1].querySelector('span')),
            wjcCore.removeClass(t, 'wj-glyph-left'),
            wjcCore.addClass(t, 'wj-glyph-left-rtl'),
            (t = o[2].querySelector('span')),
            wjcCore.removeClass(t, 'wj-glyph-right'),
            wjcCore.addClass(t, 'wj-glyph-right-rtl'),
            (t = o[3].querySelector('span')),
            wjcCore.removeClass(t, 'wj-glyph-step-forward'),
            wjcCore.addClass(t, 'wj-glyph-step-forward-rtl'))
          : ((t = o[0].querySelector('span')),
            wjcCore.removeClass(t, 'wj-glyph-step-backward-rtl'),
            wjcCore.addClass(t, 'wj-glyph-step-backward'),
            (t = o[1].querySelector('span')),
            wjcCore.removeClass(t, 'wj-glyph-left-rtl'),
            wjcCore.addClass(t, 'wj-glyph-left'),
            (t = o[2].querySelector('span')),
            wjcCore.removeClass(t, 'wj-glyph-right-rtl'),
            wjcCore.addClass(t, 'wj-glyph-right'),
            (t = o[3].querySelector('span')),
            wjcCore.removeClass(t, 'wj-glyph-step-forward-rtl'),
            wjcCore.addClass(t, 'wj-glyph-step-forward')));
    }),
    (t.controlTemplate =
      '<div wj-part="sheet-container" class="wj-sheet" style="height:100%;position:relative"><div wj-part="sheet-page" class="wj-btn-group wj-sheet-page"><button type="button" class="wj-btn wj-btn-default"><span class="wj-sheet-icon wj-glyph-step-backward"></span></button><button type="button" class="wj-btn wj-btn-default"><span class="wj-sheet-icon wj-glyph-left"></span></button><button type="button" class="wj-btn wj-btn-default"><span class="wj-sheet-icon wj-glyph-right"></span></button><button type="button" class="wj-btn wj-btn-default"><span class="wj-sheet-icon wj-glyph-step-forward"></span></button></div><div class="wj-sheet-tab" style="height:100%;overflow:hidden"><ul wj-part="container"></ul></div><div wj-part="new-sheet" class="wj-new-sheet"><span class="wj-sheet-icon wj-glyph-file"></span></div></div>'),
    t
  );
})(wjcCore.Control);
exports._SheetTabs = _SheetTabs;
var _UnboundSortDescription = (function () {
  function e(e, t) {
    (this._column = e), (this._ascending = t);
  }
  return (
    Object.defineProperty(e.prototype, 'column', {
      get: function () {
        return this._column;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'ascending', {
      get: function () {
        return this._ascending;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
exports._UnboundSortDescription = _UnboundSortDescription;
var SortManager = (function () {
  function e(e) {
    (this._owner = e),
      (this._sortDescriptions = new wjcCore.CollectionView()),
      (this._committedList = [new ColumnSortDescription(-1, !0)]),
      (this._sortDescriptions.newItemCreator = function () {
        return new ColumnSortDescription(-1, !0);
      }),
      this._refresh();
  }
  return (
    Object.defineProperty(e.prototype, 'sortDescriptions', {
      get: function () {
        return this._sortDescriptions;
      },
      set: function (e) {
        (this._sortDescriptions = e), this.commitSort(!0), this._refresh();
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.addSortLevel = function (e, t) {
      void 0 === t && (t = !0);
      var o = this._sortDescriptions.addNew();
      null != e && !isNaN(e) && wjcCore.isInt(e) && (o.columnIndex = e),
        (o.ascending = t),
        this._sortDescriptions.commitNew();
    }),
    (e.prototype.deleteSortLevel = function (e) {
      var t;
      (t =
        null != e
          ? this._getSortItem(e)
          : this._sortDescriptions.currentItem) &&
        this._sortDescriptions.remove(t);
    }),
    (e.prototype.copySortLevel = function () {
      var e = this._sortDescriptions.currentItem;
      if (e) {
        var t = this._sortDescriptions.addNew();
        (t.columnIndex = parseInt(e.columnIndex)),
          (t.ascending = e.ascending),
          this._sortDescriptions.commitNew();
      }
    }),
    (e.prototype.editSortLevel = function (e, t) {
      null != e && (this._sortDescriptions.currentItem.columnIndex = e),
        null != t && (this._sortDescriptions.currentItem.ascending = t);
    }),
    (e.prototype.moveSortLevel = function (e) {
      var t = this._sortDescriptions.currentItem;
      if (t) {
        var o = this._sortDescriptions.sourceCollection,
          n = o.indexOf(t),
          i = n + e;
        n > -1 &&
          i > -1 &&
          (o.splice(n, 1),
          o.splice(i, 0, t),
          this._sortDescriptions.refresh(),
          this._sortDescriptions.moveCurrentTo(t));
      }
    }),
    (e.prototype.checkSortItemExists = function (e) {
      for (var t = 0, o = this._sortDescriptions.itemCount; t < o; t++)
        if (+this._sortDescriptions.items[t].columnIndex === e) return t;
      return -1;
    }),
    (e.prototype.commitSort = function (e) {
      var t = this;
      void 0 === e && (e = !0);
      var o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c,
        d =
          this._owner.itemsSource &&
          this._owner.itemsSource instanceof wjcCore.CollectionView;
      if (this._owner.selectedSheet) {
        if (
          ((this._owner._needCopyToSheet = !1),
          (s = this._owner.selectedSheet._unboundSortDesc),
          e && (a = new _SortColumnAction(this._owner)),
          this._sortDescriptions.itemCount > 0
            ? (this._committedList = this._cloneSortList(
                this._sortDescriptions.items
              ))
            : (this._committedList = [new ColumnSortDescription(-1, !0)]),
          this._owner.collectionView)
        ) {
          for (
            (c = this._owner.editableCollectionView) &&
              c.currentEditItem &&
              -1 !== c.items.indexOf(c.currentEditItem) &&
              !this._isEmpty(c.currentEditItem) &&
              c.commitEdit(),
              h = this._scanUnboundRows(),
              this._owner.collectionView.beginUpdate(),
              this._owner.selectedSheet.grid.collectionView.beginUpdate(),
              (i = this._owner.collectionView.sortDescriptions).clear(),
              !1 === d &&
                (r =
                  this._owner.selectedSheet.grid.collectionView
                    .sortDescriptions).clear(),
              l = 0;
            l < this._sortDescriptions.itemCount;
            l++
          )
            (o = this._sortDescriptions.items[l]).columnIndex > -1 &&
              ((n = new wjcCore.SortDescription(
                this._owner.columns[o.columnIndex].binding,
                o.ascending
              )),
              i.push(n),
              !1 === d && r.push(n));
          this._owner.selectedSheet.selectionRanges.clear(),
            this._owner.collectionView.endUpdate(),
            this._owner.selectedSheet.grid.collectionView.endUpdate(),
            h &&
              Object.keys(h).forEach(function (e) {
                t._owner.rows.splice(+e, 0, h[e]);
              });
        } else
          for (s.clear(), l = 0; l < this._sortDescriptions.itemCount; l++)
            (o = this._sortDescriptions.items[l]).columnIndex > -1 &&
              s.push(
                new _UnboundSortDescription(
                  this._owner.columns[o.columnIndex],
                  o.ascending
                )
              );
        e && (a.saveNewState(), this._owner.undoStack._addAction(a)),
          (this._owner._copiedRanges = null),
          (this._owner._needCopyToSheet = !0);
      }
    }),
    (e.prototype.cancelSort = function () {
      (this._sortDescriptions.sourceCollection = this._committedList.slice()),
        this._refresh();
    }),
    (e.prototype.clearSort = function () {
      (this._sortDescriptions.sourceCollection = []), this.commitSort();
    }),
    (e.prototype._refresh = function () {
      var e,
        t,
        o = [];
      if (this._owner.selectedSheet) {
        if (
          this._owner.collectionView &&
          this._owner.collectionView.sortDescriptions.length > 0
        )
          for (
            e = 0;
            e < this._owner.collectionView.sortDescriptions.length;
            e++
          )
            (t = this._owner.collectionView.sortDescriptions[e]),
              o.push(
                new ColumnSortDescription(
                  this._getColumnIndex(t.property),
                  t.ascending
                )
              );
        else if (
          this._owner.selectedSheet &&
          this._owner.selectedSheet._unboundSortDesc.length > 0
        )
          for (
            e = 0;
            e < this._owner.selectedSheet._unboundSortDesc.length;
            e++
          )
            null !=
              (t = this._owner.selectedSheet._unboundSortDesc[e]).column &&
              o.push(new ColumnSortDescription(t.column.index, t.ascending));
        else o.push(new ColumnSortDescription(-1, !0));
        this._sortDescriptions.sourceCollection = o;
      }
    }),
    (e.prototype._getColumnIndex = function (e) {
      for (var t = 0, o = this._owner.columns.length; t < o; t++)
        if (this._owner.columns[t].binding === e) return t;
      return -1;
    }),
    (e.prototype._getSortItem = function (e) {
      var t = this.checkSortItemExists(e);
      if (t > -1) return this._sortDescriptions.items[t];
    }),
    (e.prototype._scanUnboundRows = function () {
      var e, t, o;
      for (e = 0; e < this._owner.rows.length; e++)
        (t = this._owner.rows[e]).dataItem ||
          t instanceof HeaderRow ||
          t instanceof wjcGrid._NewRowTemplate ||
          (o || (o = {}), (o[e] = t));
      return o;
    }),
    (e.prototype._cloneSortList = function (e) {
      for (var t = [], o = 0; o < e.length; o++) t[o] = e[o].clone();
      return t;
    }),
    (e.prototype._isEmpty = function (e) {
      var t = Object.prototype.hasOwnProperty;
      if (null == e) return !0;
      if (e.length > 0) return !1;
      if (0 === e.length) return !0;
      for (var o in e) if (t.call(e, o)) return !1;
      return !0;
    }),
    e
  );
})();
exports.SortManager = SortManager;
var ColumnSortDescription = (function () {
  function e(e, t) {
    (this._columnIndex = e), (this._ascending = t);
  }
  return (
    Object.defineProperty(e.prototype, 'columnIndex', {
      get: function () {
        return this._columnIndex;
      },
      set: function (e) {
        this._columnIndex = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'ascending', {
      get: function () {
        return this._ascending;
      },
      set: function (e) {
        this._ascending = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.clone = function () {
      return new e(this._columnIndex, this._ascending);
    }),
    e
  );
})();
exports.ColumnSortDescription = ColumnSortDescription;
var UndoStack = (function () {
  function e(e) {
    (this.MAX_STACK_SIZE = 500),
      (this._stack = []),
      (this._pointer = -1),
      (this._resizingTriggered = !1),
      (this.undoStackChanged = new wjcCore.Event());
    var t = this;
    (t._owner = e),
      t._owner.prepareCellForEdit.addHandler(t._initCellEditAction, t),
      t._owner.cellEditEnded.addHandler(function (e, o) {
        (!o.data || (46 !== o.data.keyCode && 8 !== o.data.keyCode)) &&
          t._pendingAction instanceof _EditAction &&
          !t._pendingAction.isPaste &&
          t._afterProcessCellEditAction(t);
      }, t),
      t._owner.pasting.addHandler(t._initCellEditActionForPasting, t),
      t._owner.pastingCell.addHandler(function (e, o) {
        t._pendingAction instanceof _EditAction
          ? t._pendingAction.updateForPasting(o.range)
          : t._pendingAction instanceof _CutAction &&
            t._pendingAction.updateForPasting(o.range);
      }, t),
      t._owner.pasted.addHandler(function () {
        t._pendingAction instanceof _EditAction && t._pendingAction.isPaste
          ? t._afterProcessCellEditAction(t)
          : t._pendingAction instanceof _CutAction &&
            (t._pendingAction.saveNewState(),
            t._addAction(t._pendingAction),
            (t._pendingAction = null));
      }, t),
      t._owner.resizingColumn.addHandler(function (e, o) {
        t._resizingTriggered ||
          ((t._pendingAction = new _ColumnResizeAction(
            t._owner,
            o.panel,
            o.col
          )),
          (t._resizingTriggered = !0));
      }, t),
      t._owner.resizedColumn.addHandler(function (e, o) {
        t._pendingAction instanceof _ColumnResizeAction &&
          t._pendingAction.saveNewState() &&
          t._addAction(t._pendingAction),
          (t._pendingAction = null),
          (t._resizingTriggered = !1);
      }, t),
      t._owner.resizingRow.addHandler(function (e, o) {
        t._resizingTriggered ||
          ((t._pendingAction = new _RowResizeAction(t._owner, o.panel, o.row)),
          (t._resizingTriggered = !0));
      }, t),
      t._owner.resizedRow.addHandler(function (e, o) {
        t._pendingAction instanceof _RowResizeAction &&
          t._pendingAction.saveNewState() &&
          t._addAction(t._pendingAction),
          (t._pendingAction = null),
          (t._resizingTriggered = !1);
      }, t),
      t._owner.draggingRowColumn.addHandler(function (e, o) {
        o.isShiftKey &&
          (o.isDraggingRows
            ? (t._pendingAction = new _RowsChangedAction(t._owner))
            : (t._pendingAction = new _ColumnsChangedAction(t._owner)));
      }, t),
      t._owner.droppingRowColumn.addHandler(function () {
        t._pendingAction &&
          t._pendingAction.saveNewState() &&
          t._addAction(t._pendingAction),
          (t._pendingAction = null);
      }, t);
  }
  return (
    Object.defineProperty(e.prototype, 'canUndo', {
      get: function () {
        return this._pointer > -1 && this._pointer < this._stack.length;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'canRedo', {
      get: function () {
        return this._pointer + 1 > -1 && this._pointer + 1 < this._stack.length;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onUndoStackChanged = function () {
      this.undoStackChanged.raise(this);
    }),
    (e.prototype.undo = function () {
      var e;
      this.canUndo &&
        ((e = this._stack[this._pointer]),
        this._beforeUndoRedo(e),
        e.undo(),
        this._pointer--,
        this.onUndoStackChanged());
    }),
    (e.prototype.redo = function () {
      var e;
      this.canRedo &&
        (this._pointer++,
        (e = this._stack[this._pointer]),
        this._beforeUndoRedo(e),
        e.redo(),
        this.onUndoStackChanged());
    }),
    (e.prototype._addAction = function (e) {
      this._stack.length > 0 &&
        this._stack.length > this._pointer + 1 &&
        this._stack.splice(
          this._pointer + 1,
          this._stack.length - this._pointer - 1
        ),
        this._stack.length >= this.MAX_STACK_SIZE &&
          this._stack.splice(0, this._stack.length - this.MAX_STACK_SIZE + 1),
        (this._pointer = this._stack.length),
        this._stack.push(e),
        this.onUndoStackChanged();
    }),
    (e.prototype._pop = function () {
      var e = this._stack[this._pointer];
      return this._pointer--, e;
    }),
    (e.prototype.clear = function () {
      this._stack.length = 0;
    }),
    (e.prototype._initCellEditAction = function (e, t) {
      this._pendingAction = new _EditAction(this._owner, t.range);
    }),
    (e.prototype._initCellEditActionForPasting = function () {
      this._owner._isCutting
        ? (this._pendingAction = new _CutAction(this._owner))
        : ((this._pendingAction = new _EditAction(this._owner)),
          this._pendingAction.markIsPaste());
    }),
    (e.prototype._afterProcessCellEditAction = function (e) {
      e._pendingAction instanceof _EditAction &&
        e._pendingAction.saveNewState() &&
        e._addAction(this._pendingAction),
        (e._pendingAction = null);
    }),
    (e.prototype._beforeUndoRedo = function (e) {
      this._owner.selectedSheetIndex = e.sheetIndex;
    }),
    e
  );
})();
exports.UndoStack = UndoStack;
var Table = (function () {
  function e(e, t, o, n, i, r, l, s, a, h, c) {
    if (
      (void 0 === r && (r = !0),
      void 0 === l && (l = !1),
      void 0 === s && (s = !1),
      void 0 === a && (a = !0),
      void 0 === h && (h = !1),
      void 0 === c && (c = !1),
      (this._owner = e),
      (this._name = t),
      (this._range = o.clone()),
      e._containsMergedCells(o))
    )
      throw 'Table does not allow the merged cell within the table.';
    (this._style = n || e.getBuiltInTableStyle('TableStyleMedium9')),
      null != i && i.length > 0
        ? (this._columns = i)
        : this._generateColumns(r),
      this._owner.beginUpdate(),
      null != r && (this._showHeaderRow = r),
      r && 1 === o.rowSpan && this._adjustTableRangeWithHeaderRow(),
      null != l && (this._showTotalRow = l),
      l && this._adjustTableRangeWithTotalRow(!1),
      this._owner.endUpdate(),
      null != s && (this._showBandedColumns = s),
      null != a && (this._showBandedRows = a),
      null != h && (this._showFirstColumn = h),
      null != c && (this._showLastColumn = c);
  }
  return (
    Object.defineProperty(e.prototype, 'name', {
      get: function () {
        return this._name;
      },
      set: function (e) {
        var t, o;
        if (null == e || '' === e)
          throw 'The name of the Table should not be empty.';
        this._name.toLowerCase() !== e.toLowerCase() &&
          (this._owner._isUndoing ||
            (t = new _TableSettingAction(this._owner, this)),
          (o = this._name),
          (this._name = e),
          this._owner._updateTableNameForSheet(o, e),
          this._owner._updateFormulasWithNameUpdating(o, e, !0),
          this._owner._isUndoing ||
            (t.saveNewState(),
            this._owner.undoStack._addAction(t),
            (t = null)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'sheet', {
      get: function () {
        var e = this._owner,
          t = e._getTableSheetIndex(this.name);
        return t > -1 ? e.sheets[t] : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'range', {
      get: function () {
        return this._range.clone();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'columns', {
      get: function () {
        return this._columns;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'style', {
      get: function () {
        return this._style;
      },
      set: function (e) {
        var t;
        e.name !== this._style.name &&
          (this._owner._isUndoing ||
            (t = new _TableSettingAction(this._owner, this)),
          (this._style = e),
          this._owner._isUndoing ||
            (t.saveNewState(), this._owner.undoStack._addAction(t), (t = null)),
          this._owner.refresh());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showHeaderRow', {
      get: function () {
        return this._showHeaderRow;
      },
      set: function (e) {
        var t;
        e !== this._showHeaderRow &&
          (this._owner._isUndoing ||
            (t = new _TableSettingAction(this._owner, this)),
          (this._showHeaderRow = e),
          this._owner.beginUpdate(),
          this._adjustTableRangeWithHeaderRow(),
          this._owner._isUndoing ||
            (t.saveNewState(), this._owner.undoStack._addAction(t), (t = null)),
          this._owner.endUpdate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showTotalRow', {
      get: function () {
        return this._showTotalRow;
      },
      set: function (e) {
        var t;
        e !== this._showTotalRow &&
          (this._owner._isUndoing ||
            (t = new _TableSettingAction(this._owner, this)),
          (this._showTotalRow = e),
          this._owner.beginUpdate(),
          this._adjustTableRangeWithTotalRow(!0),
          this._owner._isUndoing ||
            (t.saveNewState(), this._owner.undoStack._addAction(t), (t = null)),
          this._owner.endUpdate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showBandedColumns', {
      get: function () {
        return this._showBandedColumns;
      },
      set: function (e) {
        var t;
        e !== this._showBandedColumns &&
          (this._owner._isUndoing ||
            (t = new _TableSettingAction(this._owner, this)),
          (this._showBandedColumns = e),
          this._owner._isUndoing ||
            (t.saveNewState(), this._owner.undoStack._addAction(t), (t = null)),
          this._owner.refresh());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showBandedRows', {
      get: function () {
        return this._showBandedRows;
      },
      set: function (e) {
        var t;
        e !== this._showBandedRows &&
          (this._owner._isUndoing ||
            (t = new _TableSettingAction(this._owner, this)),
          (this._showBandedRows = e),
          this._owner._isUndoing ||
            (t.saveNewState(), this._owner.undoStack._addAction(t), (t = null)),
          this._owner.refresh());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showFirstColumn', {
      get: function () {
        return this._showFirstColumn;
      },
      set: function (e) {
        var t;
        e !== this._showFirstColumn &&
          (this._owner._isUndoing ||
            (t = new _TableSettingAction(this._owner, this)),
          (this._showFirstColumn = e),
          this._owner._isUndoing ||
            (t.saveNewState(), this._owner.undoStack._addAction(t), (t = null)),
          this._owner.refresh());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showLastColumn', {
      get: function () {
        return this._showLastColumn;
      },
      set: function (e) {
        var t;
        e !== this._showLastColumn &&
          (this._owner._isUndoing ||
            (t = new _TableSettingAction(this._owner, this)),
          (this._showLastColumn = e),
          this._owner._isUndoing ||
            (t.saveNewState(), this._owner.undoStack._addAction(t), (t = null)),
          this._owner.refresh());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getColumnRange = function (e) {
      for (var t = 0; t < this._columns.length; t++)
        if (this._columns[t].name.toLowerCase() === e) {
          var o = this._range.topRow,
            n = this._range.bottomRow,
            i = this._range.leftCol + t;
          return (
            this._showHeaderRow && (o += 1),
            this._showTotalRow && (n -= 1),
            new wjcGrid.CellRange(o, i, n, i)
          );
        }
      return null;
    }),
    (e.prototype.getDataRange = function () {
      var e = this._range.topRow,
        t = this._range.bottomRow;
      return (
        this._showHeaderRow && (e += 1),
        this._showTotalRow && (t -= 1),
        new wjcGrid.CellRange(e, this._range.leftCol, t, this._range.rightCol)
      );
    }),
    (e.prototype.getHeaderRange = function () {
      return this._showHeaderRow
        ? new wjcGrid.CellRange(
            this._range.topRow,
            this._range.leftCol,
            this._range.topRow,
            this._range.rightCol
          )
        : null;
    }),
    (e.prototype.getTotalRange = function () {
      return this._showTotalRow
        ? new wjcGrid.CellRange(
            this._range.bottomRow,
            this._range.leftCol,
            this._range.bottomRow,
            this._range.rightCol
          )
        : null;
    }),
    (e.prototype._addColumn = function (e, t) {
      var o;
      if (e <= 0 || e > this._columns.length)
        throw 'The column index is out of range.';
      (t = this._getUniqueColumnName(e, t)),
        (o = new TableColumn(t)),
        this._columns.splice(e, 0, o),
        this.showHeaderRow &&
          this._owner.setCellData(this.range.topRow, this.range.leftCol + e, t);
    }),
    (e.prototype._updateCell = function (e, t, o) {
      var n,
        i = e - this._range.topRow,
        r = t - this._range.leftCol;
      null != this._style &&
        ((n = this._getTableCellAppliedStyles(i, r)),
        this._applyStylesForCell(n, o));
    }),
    (e.prototype._updateTableRange = function (e, t, o, n) {
      this._range.row <= this._range.row2
        ? ((this._range.row += e), (this._range.row2 += t))
        : ((this._range.row2 += e), (this._range.row += t)),
        this._range.col <= this._range.col2
          ? ((this._range.col += o), (this._range.col2 += n))
          : ((this._range.col2 += o), (this._range.col += n));
    }),
    (e.prototype._setTableRange = function (e, t) {
      var o;
      if (((this._range = e), null != t))
        for (
          this._columns.splice(0, this._columns.length), o = 0;
          o < t.length;
          o++
        )
          this._columns.push(t[o]);
    }),
    (e.prototype._updateColumnName = function (e, t) {
      var o = this._columns[e];
      (t = this._getUniqueColumnName(null, t)),
        (o.name = t),
        this._showHeaderRow &&
          this._owner.setCellData(
            this._range.topRow,
            this._range.leftCol + e,
            t
          );
    }),
    (e.prototype._generateColumns = function (e) {
      var t, o;
      if (!this._range.isValid) throw 'The range of the table is invalid.';
      this._columns = [];
      for (var n = 0; n < this._range.columnSpan; n++)
        1 === this._range.rowSpan
          ? (t = this._getUniqueColumnName(n + 1))
          : ((t = this._owner.getCellValue(
              this._range.topRow,
              this._range.leftCol + n,
              !1
            )),
            (t = this._getUniqueColumnName(n + 1, t.toString()))),
          e &&
            this._owner.setCellData(
              this._range.topRow,
              this._range.leftCol + n,
              t
            ),
          (o = new TableColumn(t)),
          0 === n
            ? (o.totalRowLabel = 'Total')
            : n === this._range.columnSpan - 1 && (o.totalRowFunction = 'Sum'),
          this._columns.push(o);
    }),
    (e.prototype._getTableCellAppliedStyles = function (e, t) {
      var o,
        n = {},
        i = !1,
        r = !1,
        l = 0;
      return (
        this._showHeaderRow && (l = 1),
        this._showHeaderRow && 0 === e
          ? (i = !0)
          : this._showTotalRow && e === this._range.rowSpan - 1 && (r = !0),
        this._extendStyle(n, this._style.wholeTableStyle, e, t, i, r),
        i ||
          r ||
          (!this._showBandedColumns ||
            (null == this._style.firstBandedColumnStyle &&
              null == this._style.secondBandedColumnStyle) ||
            (t %
              ((o = this._style.firstBandedColumnStyle
                ? null == this._style.firstBandedColumnStyle.size
                  ? 1
                  : this._style.firstBandedColumnStyle.size
                : 1) +
                (this._style.secondBandedColumnStyle
                  ? null == this._style.secondBandedColumnStyle.size
                    ? 1
                    : this._style.secondBandedColumnStyle.size
                  : 1)) >=
            o
              ? this._style.secondBandedColumnStyle &&
                this._extendStyle(
                  n,
                  this._style.secondBandedRowStyle,
                  e,
                  t,
                  i,
                  r
                )
              : this._style.firstBandedColumnStyle &&
                this._extendStyle(
                  n,
                  this._style.firstBandedColumnStyle,
                  e,
                  t,
                  i,
                  r
                )),
          !this._showBandedRows ||
            (null == this._style.firstBandedRowStyle &&
              null == this._style.secondBandedRowStyle) ||
            ((e - l) %
              ((o = this._style.firstBandedRowStyle
                ? null == this._style.firstBandedRowStyle.size
                  ? 1
                  : this._style.firstBandedRowStyle.size
                : 1) +
                (this._style.secondBandedRowStyle
                  ? null == this._style.secondBandedRowStyle.size
                    ? 1
                    : this._style.secondBandedRowStyle.size
                  : 1)) >=
            o
              ? this._style.secondBandedRowStyle &&
                this._extendStyle(
                  n,
                  this._style.secondBandedRowStyle,
                  e,
                  t,
                  i,
                  r
                )
              : this._style.firstBandedRowStyle &&
                this._extendStyle(
                  n,
                  this._style.firstBandedRowStyle,
                  e,
                  t,
                  i,
                  r
                ))),
        this._showLastColumn &&
          t === this._range.columnSpan - 1 &&
          this._style.lastColumnStyle &&
          this._extendStyle(n, this._style.lastColumnStyle, e, t, i, r),
        this._showFirstColumn &&
          0 === t &&
          this._style.firstColumnStyle &&
          this._extendStyle(n, this._style.firstColumnStyle, e, t, i, r),
        i
          ? (this._style.headerRowStyle &&
              this._extendStyle(n, this._style.headerRowStyle, e, t, i, r),
            t === this._range.columnSpan - 1 &&
              this._style.lastHeaderCellStyle &&
              this._extendStyle(n, this._style.lastHeaderCellStyle, e, t, i, r),
            0 === t &&
              this._style.firstHeaderCellStyle &&
              this._extendStyle(
                n,
                this._style.firstHeaderCellStyle,
                e,
                t,
                i,
                r
              ))
          : r &&
            (this._style.totalRowStyle &&
              this._extendStyle(n, this._style.totalRowStyle, e, t, i, r),
            t === this._range.columnSpan - 1 &&
              this._style.lastTotalCellStyle &&
              this._extendStyle(n, this._style.lastTotalCellStyle, e, t, i, r),
            0 === t &&
              this._style.firstTotalCellStyle &&
              this._extendStyle(
                n,
                this._style.firstTotalCellStyle,
                e,
                t,
                i,
                r
              )),
        n
      );
    }),
    (e.prototype._applyStylesForCell = function (e, t) {
      var o,
        n = t.style;
      for (var i in e)
        (o = e[i]) &&
          (i.toLowerCase().indexOf('color') > -1
            ? (n[i] = this._getStrColor(o))
            : (n[i] = o));
    }),
    (e.prototype._extendStyle = function (e, t, o, n, i, r) {
      var l;
      for (var s in t)
        null !== (l = t[s]) &&
          (s.indexOf('borderTop') > -1
            ? (0 === o || r) &&
              (wjcCore.isObject(l)
                ? ((e[s] = {}), this._cloneThemeColor(e[s], l))
                : (e[s] = l))
            : s.indexOf('borderBottom') > -1
            ? (o === this._range.rowSpan - 1 || i) &&
              (wjcCore.isObject(l)
                ? ((e[s] = {}), this._cloneThemeColor(e[s], l))
                : (e[s] = l))
            : s.indexOf('borderLeft') > -1
            ? 0 === n &&
              (wjcCore.isObject(l)
                ? ((e[s] = {}), this._cloneThemeColor(e[s], l))
                : (e[s] = l))
            : s.indexOf('borderRight') > -1
            ? n === this._range.columnSpan - 1 &&
              (wjcCore.isObject(l)
                ? ((e[s] = {}), this._cloneThemeColor(e[s], l))
                : (e[s] = l))
            : s.indexOf('borderHorizontal') > -1
            ? o < this._range.rowSpan - 1 &&
              ('borderHorizontalStyle' === s
                ? (e.borderBottomStyle = l)
                : 'borderHorizontalWidth' === s
                ? (e.borderBottomWidth = l)
                : wjcCore.isObject(l)
                ? ((e.borderBottomColor = {}),
                  this._cloneThemeColor(e.borderBottomColor, l))
                : (e.borderBottomColor = l))
            : s.indexOf('borderVertical') > -1
            ? n < this._range.columnSpan - 1 &&
              ('borderVerticalStyle' === s
                ? (e.borderRightStyle = l)
                : 'borderVerticalWidth' === s
                ? (e.borderRightWidth = l)
                : wjcCore.isObject(l)
                ? ((e.borderRightColor = {}),
                  this._cloneThemeColor(e.borderRightColor, l))
                : (e.borderRightColor = l))
            : wjcCore.isObject(l)
            ? ((e[s] = {}), this._cloneThemeColor(e[s], l))
            : (e[s] = l));
    }),
    (e.prototype._cloneThemeColor = function (e, t) {
      e && ((e.theme = t.theme), (e.tint = t.tint));
    }),
    (e.prototype._getStrColor = function (e) {
      return wjcCore.isString(e)
        ? e
        : null != e
        ? this._owner._getThemeColor(e.theme, e.tint)
        : '';
    }),
    (e.prototype._getSubtotalFunction = function (e) {
      switch (e) {
        case 'average':
          return '101';
        case 'countnums':
          return '102';
        case 'count':
          return '103';
        case 'max':
          return '104';
        case 'min':
          return '105';
        case 'stddev':
          return '107';
        case 'sum':
          return '109';
        case 'var':
          return '110';
      }
      return null;
    }),
    (e.prototype._moveDownTable = function () {
      var e, t, o;
      for (e = this._range.bottomRow; e >= this._range.topRow; e--)
        for (t = this._range.leftCol; t <= this._range.rightCol; t++)
          (o = this._owner.getCellData(e, t, !1)),
            this._owner.setCellData(e + 1, t, o),
            this._owner.setCellData(e, t, '');
      (this._range.row += 1), (this._range.row2 += 1);
    }),
    (e.prototype._moveDownCellsBelowTable = function () {
      var e, t, o, n, i;
      for (e = this._owner.rows.length - 2; e > this._range.bottomRow; e--)
        for (t = this._range.leftCol; t <= this._range.rightCol; t++)
          (o = this._owner.getCellData(e, t, !1)),
            this._owner.setCellData(e + 1, t, o),
            this._owner.setCellData(e, t, ''),
            (n = this._owner.selectedSheet.getCellStyle(e, t)) &&
              ((i = (e + 1) * this._owner.columns.length + t),
              (this._owner.selectedSheet._styledCells[i] = n),
              (i = e * this._owner.columns.length + t),
              (this._owner.selectedSheet._styledCells[i] = null));
    }),
    (e.prototype._moveUpCellsBelowTable = function () {
      var e, t, o, n, i;
      for (e = this._range.bottomRow + 1; e < this._owner.rows.length; e++)
        for (t = this._range.leftCol; t <= this._range.rightCol; t++)
          (o = this._owner.getCellData(e, t, !1)),
            this._owner.setCellData(e - 1, t, o),
            this._owner.setCellData(e, t, ''),
            (n = this._owner.selectedSheet.getCellStyle(e, t)) &&
              ((i = (e - 1) * this._owner.columns.length + t),
              (this._owner.selectedSheet._styledCells[i] = n),
              (i = e * this._owner.columns.length + t),
              (this._owner.selectedSheet._styledCells[i] = null));
    }),
    (e.prototype._isOtherTableBelow = function () {
      var e, t;
      for (e = this._range.bottomRow + 1; e < this._owner.rows.length; e++)
        for (t = this._range.leftCol; t <= this._range.rightCol; t++)
          if (this._owner.selectedSheet.findTable(e, t)) return !0;
      return !1;
    }),
    (e.prototype._needMoveDownTable = function () {
      var e, t;
      if (0 === this._range.topRow) return !0;
      for (e = 0; e < this._columns.length; e++)
        if (
          null !=
            (t = this._owner.getCellData(
              this._range.topRow - 1,
              this._range.leftCol + e,
              !1
            )) &&
          '' !== t
        )
          return !0;
      return !1;
    }),
    (e.prototype._needAddNewRow = function () {
      var e, t, o;
      for (e = this._range.leftCol; e <= this._range.rightCol; e++)
        if (
          ((t = this._owner.getCellData(this._owner.rows.length - 1, e, !1)),
          (o = this._owner.selectedSheet.getCellStyle(
            this._owner.rows.length - 1,
            e
          )),
          (null != t && '' !== t) || null != o)
        )
          return !0;
      return !1;
    }),
    (e.prototype._checkColumnNameExist = function (e) {
      var t;
      for (t = 0; t < this.columns.length; t++)
        if (this.columns[t].name.toLowerCase() === e.toLowerCase()) return !0;
      return !1;
    }),
    (e.prototype._adjustTableRangeWithHeaderRow = function () {
      var e, t;
      if (this._showHeaderRow) {
        if (this._needMoveDownTable()) {
          if (this._isOtherTableBelow())
            throw 'The operation is not allowed.  The operation is attempting to shift the cells in a table on the current sheet.';
          this._needAddNewRow() && this._owner.rows.push(new wjcGrid.Row()),
            this._moveDownCellsBelowTable(),
            this._moveDownTable();
        }
        for (
          this._range.row <= this._range.row2
            ? (this._range.row -= 1)
            : (this._range.row2 -= 1),
            e = 0;
          e < this._columns.length;
          e++
        )
          (t = this._columns[e]),
            this._owner.setCellData(
              this._range.topRow,
              this._range.leftCol + e,
              t.name
            );
      } else {
        for (e = this._range.leftCol; e <= this._range.rightCol; e++)
          this._owner.setCellData(this._range.topRow, e, '');
        this._range.row <= this._range.row2
          ? (this._range.row += 1)
          : (this._range.row2 += 1);
      }
    }),
    (e.prototype._adjustTableRangeWithTotalRow = function (e) {
      var t;
      if (this._showTotalRow) {
        if (this._isOtherTableBelow())
          throw 'The operation is not allowed.  The operation is attempting to shift the cells in a table on the current sheet.';
        this._needAddNewRow() && this._owner.rows.push(new wjcGrid.Row()),
          this._moveDownCellsBelowTable(),
          e &&
            (this._range.row <= this._range.row2
              ? (this._range.row2 += 1)
              : (this._range.row += 1)),
          this._updateTotalRow();
      } else {
        for (t = this._range.leftCol; t <= this._range.rightCol; t++)
          this._owner.setCellData(this._range.bottomRow, t, '');
        this._moveUpCellsBelowTable(),
          e &&
            (this._range.row <= this._range.row2
              ? (this._range.row2 -= 1)
              : (this._range.row -= 1));
      }
    }),
    (e.prototype._updateTotalRow = function () {
      var e, t, o;
      if (this.showTotalRow)
        for (var n = 0; n < this._columns.length; n++)
          (o = (e = this._columns[n]).totalRowFunction
            ? null !=
              (t = this._getSubtotalFunction(e.totalRowFunction.toLowerCase()))
              ? '=subtotal(' + t + ', [' + e.name + '])'
              : '=' === e.totalRowFunction[0]
              ? e.totalRowFunction
              : '=' + e.totalRowFunction
            : e.totalRowLabel),
            this._owner.setCellData(
              this._range.bottomRow,
              this._range.leftCol + n,
              o
            );
    }),
    (e.prototype._getUniqueColumnName = function (e, t) {
      var o,
        n = 1;
      if ((t || (t = 'Column' + e), this._checkColumnNameExist(t))) {
        for (o = t + n; this._checkColumnNameExist(o); ) o = t + ++n;
        t = o;
      }
      return t;
    }),
    e
  );
})();
exports.Table = Table;
var TableColumn = (function () {
  function e(e, t, o, n) {
    void 0 === n && (n = !0),
      (this._name = e),
      (this._totalRowLabel = t),
      (this._totalRowFunction = o),
      null != n && (this._showFilterButton = n);
  }
  return (
    Object.defineProperty(e.prototype, 'name', {
      get: function () {
        return this._name;
      },
      set: function (e) {
        e !== this._name && (this._name = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'totalRowLabel', {
      get: function () {
        return this._totalRowLabel;
      },
      set: function (e) {
        e !== this._totalRowLabel && (this._totalRowLabel = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'totalRowFunction', {
      get: function () {
        return this._totalRowFunction;
      },
      set: function (e) {
        e !== this._totalRowFunction && (this._totalRowFunction = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showFilterButton', {
      get: function () {
        return this._showFilterButton;
      },
      set: function (e) {
        this._showFilterButton !== e && (this._showFilterButton = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
exports.TableColumn = TableColumn;
var TableStyle = (function () {
  function e(e, t) {
    void 0 === t && (t = !1), (this._name = e), (this._isBuiltIn = t);
  }
  return (
    Object.defineProperty(e.prototype, 'name', {
      get: function () {
        return this._name;
      },
      set: function (e) {
        e !== this._name && (this._name = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'wholeTableStyle', {
      get: function () {
        return this._wholeTableStyle;
      },
      set: function (e) {
        this._wholeTableStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'firstBandedColumnStyle', {
      get: function () {
        return this._firstBandedColumnStyle;
      },
      set: function (e) {
        this._firstBandedColumnStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'secondBandedColumnStyle', {
      get: function () {
        return this._secondBandedColumnStyle;
      },
      set: function (e) {
        this._secondBandedColumnStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'firstBandedRowStyle', {
      get: function () {
        return this._firstBandedRowStyle;
      },
      set: function (e) {
        this._firstBandedRowStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'secondBandedRowStyle', {
      get: function () {
        return this._secondBandedRowStyle;
      },
      set: function (e) {
        this._secondBandedRowStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'firstColumnStyle', {
      get: function () {
        return this._firstColumnStyle;
      },
      set: function (e) {
        this._firstColumnStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'lastColumnStyle', {
      get: function () {
        return this._lastColumnStyle;
      },
      set: function (e) {
        this._lastColumnStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'headerRowStyle', {
      get: function () {
        return this._headerRowStyle;
      },
      set: function (e) {
        this._headerRowStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'totalRowStyle', {
      get: function () {
        return this._totalRowStyle;
      },
      set: function (e) {
        this._totalRowStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'firstHeaderCellStyle', {
      get: function () {
        return this._firstHeaderCellStyle;
      },
      set: function (e) {
        this._firstHeaderCellStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'lastHeaderCellStyle', {
      get: function () {
        return this._lastHeaderCellStyle;
      },
      set: function (e) {
        this._lastHeaderCellStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'firstTotalCellStyle', {
      get: function () {
        return this._firstTotalCellStyle;
      },
      set: function (e) {
        this._firstTotalCellStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'lastTotalCellStyle', {
      get: function () {
        return this._lastTotalCellStyle;
      },
      set: function (e) {
        this._lastTotalCellStyle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isBuiltIn', {
      get: function () {
        return this._isBuiltIn;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
exports.TableStyle = TableStyle;
var _FlexSheetValueFilter = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.apply = function (e) {
      var t = this.column.grid;
      return (
        t instanceof FlexSheet &&
        (!this.showValues ||
          !Object.keys(this.showValues).length ||
          t.rows[e] instanceof wjcGrid._NewRowTemplate ||
          ((e = t.getCellValue(e, this.column.index, !0)),
          void 0 != this.showValues[e]))
      );
    }),
    t
  );
})(wjcGridFilter.ValueFilter);
exports._FlexSheetValueFilter = _FlexSheetValueFilter;
var _FlexSheetValueFilterEditor = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.updateEditor = function () {
      var t,
        o,
        n,
        i,
        r,
        l,
        s,
        a,
        h,
        c = this.filter.column,
        d = c.grid,
        u = c.index,
        _ = [],
        g = {};
      if (
        this.filter.uniqueValues ||
        (null != d.itemsSource && null != d.childItemsPath)
      )
        e.prototype.updateEditor.call(this);
      else {
        for (p = 0; p < d.rows.length; p++)
          (r = this.filter.apply(p)),
            (i = this.filter.showValues),
            (this.filter.showValues = null),
            (l = d._filter._filter(p)),
            (this.filter.showValues = i),
            (!(o = d.getMergedRange(d.cells, p, u)) ||
              (p === o.topRow && u === o.leftCol)) &&
              ((t = d.rows[p]) instanceof HeaderRow ||
                t instanceof wjcGrid.GroupRow ||
                t instanceof wjcGrid._NewRowTemplate ||
                !(t.visible || (!r && l)) ||
                ((n = '' === (n = d.getCellValue(p, u)) ? null : n),
                (s = d.getCellValue(p, u, !0)),
                (a = d.getCellData(p, u, !0)),
                g[s] ||
                  ((g[s] = !0),
                  (h = a && '=' === a[0] ? p + '_' + u : ''),
                  _.push({
                    value: n,
                    text: s,
                    cellRef: h,
                  }))));
        var w = this.filter.showValues;
        if (w && 0 != Object.keys(w).length) {
          for (var f in w)
            for (p = 0; p < _.length; p++)
              if (w[f] && '' !== _[p].cellRef && _[p].cellRef === w[f].cellRef)
                (w[_[p].text] = {
                  show: !0,
                  cellRef: _[p].cellRef,
                }),
                  (_[p].show = !0),
                  delete w[f];
              else if (_[p].text == f) {
                _[p].show = !0;
                break;
              }
        } else for (var p = 0; p < _.length; p++) _[p].show = !0;
        (this._lbValues.isContentHtml = c.isContentHtml),
          (this._cmbFilter.text = this.filter.filterText),
          (this._filterText = this._cmbFilter.text.toLowerCase()),
          (this._view.pageSize = this.filter.maxValues),
          (this._view.sourceCollection = _),
          this._view.moveCurrentToPosition(-1);
      }
    }),
    (t.prototype.updateFilter = function () {
      var e = null,
        t = this._view.items;
      if (this._filterText || this._cbSelectAll.indeterminate) {
        e = {};
        for (var o = 0; o < t.length; o++) {
          var n = t[o];
          n.show && (e[n.text] = { show: !0, cellRef: n.cellRef });
        }
      }
      (this._filter.showValues = e),
        (this._filter.filterText = this._filterText);
    }),
    t
  );
})(wjcGridFilter.ValueFilterEditor);
exports._FlexSheetValueFilterEditor = _FlexSheetValueFilterEditor;
var _FlexSheetConditionFilter = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.apply = function (e) {
      var t,
        o,
        n,
        i = this.column,
        r = i.grid,
        l = this.condition1,
        s = this.condition2;
      if (!(r instanceof FlexSheet)) return !1;
      if (!this.isActive) return !0;
      if (r.rows[e] instanceof wjcGrid._NewRowTemplate) return !0;
      '' === (t = r.getCellValue(e, i.index)) &&
        i.dataType !== wjcCore.DataType.String &&
        (t = null),
        (o = n = t),
        i.dataMap
          ? (o = n = t = i.dataMap.getDisplayValue(t))
          : wjcCore.isDate(t)
          ? (wjcCore.isString(l.value) || wjcCore.isString(s.value)) &&
            (o = n = t = r.getCellValue(e, i.index, !0))
          : wjcCore.isNumber(t) &&
            ((o =
              n =
              t =
                wjcCore.Globalize.parseFloat(r.getCellValue(e, i.index, !0))),
            0 !== t ||
              i.dataType ||
              (l.isActive && '' === l.value && (o = t.toString()),
              s.isActive && '' === s.value && (n = n.toString())));
      var a = l.apply(o),
        h = s.apply(n);
      return l.isActive && s.isActive
        ? this.and
          ? a && h
          : a || h
        : l.isActive
        ? a
        : !s.isActive || h;
    }),
    t
  );
})(wjcGridFilter.ConditionFilter);
exports._FlexSheetConditionFilter = _FlexSheetConditionFilter;
var _FlexSheetColumnFilter = (function (e) {
  function t(t, o) {
    var n = e.call(this, t, o) || this;
    return (
      (n._valueFilter = new _FlexSheetValueFilter(o)),
      (n._conditionFilter = new _FlexSheetConditionFilter(o)),
      n
    );
  }
  return __extends(t, e), t;
})(wjcGridFilter.ColumnFilter);
exports._FlexSheetColumnFilter = _FlexSheetColumnFilter;
var _FlexSheetColumnFilterEditor = (function (e) {
  function t(t, o, n) {
    void 0 === n && (n = !0);
    var i,
      r,
      l = e.call(this, t, o, n) || this,
      s = l;
    return (
      n && (l._divSort.style.display = ''),
      (i = l.cloneElement(l._btnAsc)),
      (r = l.cloneElement(l._btnDsc)),
      l._btnAsc.parentNode.replaceChild(i, l._btnAsc),
      l._btnDsc.parentNode.replaceChild(r, l._btnDsc),
      i.addEventListener('click', function (e) {
        s._sortBtnClick(e, !0);
      }),
      r.addEventListener('click', function (e) {
        s._sortBtnClick(e, !1);
      }),
      l
    );
  }
  return (
    __extends(t, e),
    (t.prototype._showFilter = function (t) {
      t == wjcGridFilter.FilterType.Value &&
        null == this._edtVal &&
        (this._edtVal = new _FlexSheetValueFilterEditor(
          this._divEdtVal,
          this.filter.valueFilter
        )),
        e.prototype._showFilter.call(this, t);
    }),
    (t.prototype._sortBtnClick = function (e, t) {
      var o,
        n,
        i = this.filter.column,
        r = i.grid.sortManager;
      e.preventDefault(),
        e.stopPropagation(),
        (o = r.checkSortItemExists(i.index)) > -1
          ? (r.sortDescriptions.moveCurrentToPosition(o),
            (r.sortDescriptions.currentItem.ascending = t),
            (n = -o))
          : (r.addSortLevel(i.index, t),
            (n = -(r.sortDescriptions.items.length - 1))),
        r.moveSortLevel(n),
        r.commitSort(),
        this.updateEditor(),
        this.onButtonClicked();
    }),
    (t.prototype.cloneElement = function (e) {
      for (var t = e.cloneNode(); e.firstChild; ) t.appendChild(e.lastChild);
      return t;
    }),
    t
  );
})(wjcGridFilter.ColumnFilterEditor);
exports._FlexSheetColumnFilterEditor = _FlexSheetColumnFilterEditor;
var _FlexSheetFilter = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'filterDefinition', {
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
          var o = this._filters[t];
          if (o && o.column)
            if (o.conditionFilter.isActive) {
              var n = o.conditionFilter;
              e.filters.push({
                columnIndex: o.column.index,
                type: 'condition',
                condition1: {
                  operator: n.condition1.operator,
                  value: n.condition1.value,
                },
                and: n.and,
                condition2: {
                  operator: n.condition2.operator,
                  value: n.condition2.value,
                },
              });
            } else if (o.valueFilter.isActive) {
              var i = o.valueFilter;
              e.filters.push({
                columnIndex: o.column.index,
                type: 'value',
                filterText: i.filterText,
                showValues: i.showValues,
              });
            }
        }
        return JSON.stringify(e);
      },
      set: function (e) {
        var t = JSON.parse(wjcCore.asString(e));
        this.clear(), (this.defaultFilterType = t.defaultFilterType);
        for (var o = 0; o < t.filters.length; o++) {
          var n = t.filters[o],
            i = this.grid.columns[n.columnIndex],
            r = this.getColumnFilter(i, !0);
          if (r)
            switch (n.type) {
              case 'condition':
                var l = r.conditionFilter;
                (l.condition1.value =
                  i.dataType == wjcCore.DataType.Date
                    ? wjcCore.changeType(n.condition1.value, i.dataType, null)
                    : n.condition1.value),
                  (l.condition1.operator = n.condition1.operator),
                  (l.and = n.and),
                  (l.condition2.value =
                    i.dataType == wjcCore.DataType.Date
                      ? wjcCore.changeType(n.condition2.value, i.dataType, null)
                      : n.condition2.value),
                  (l.condition2.operator = n.condition2.operator);
                break;
              case 'value':
                var s = r.valueFilter;
                (s.filterText = n.filterText), (s.showValues = n.showValues);
            }
        }
        this.apply();
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.apply = function () {
      var e = this;
      e.grid.deferUpdate(function () {
        for (var t, o, n, i = -1, r = 0; r < e.grid.rows.length; r++)
          if (!((t = e.grid.rows[r]) instanceof HeaderRow || r <= i))
            if (((i = -1), (o = e._filter(r)), t instanceof wjcGrid.GroupRow)) {
              if (
                ((n = t.getCellRange()),
                null == t.dataItem ||
                  t.dataItem instanceof wjcCore.CollectionViewGroup)
              )
                t.visible = e._checkGroupVisible(n);
              else if (((t.visible = o), (i = n.bottomRow), n.isValid))
                for (var l = n.topRow; l <= n.bottomRow; l++)
                  e.grid.rows[l].visible = o;
            } else t.visible = o;
        e.grid._isCopying || e.grid._resettingFilter || e.onFilterApplied();
      });
    }),
    (t.prototype.editColumnFilter = function (e, t) {
      var o = this;
      o.closeEditor(),
        (e = wjcCore.isString(e)
          ? o.grid.columns.getColumn(e)
          : wjcCore.asType(e, wjcGrid.Column, !1));
      var n = new wjcGrid.CellRangeEventArgs(
        o.grid.cells,
        new wjcGrid.CellRange(-1, e.index)
      );
      if ((o.onFilterChanging(n), !n.cancel)) {
        (n.cancel = !0), (o._undoAcion = new _FilteringAction(o.grid));
        var i = document.createElement('div'),
          r = o.getColumnFilter(e),
          l = new _FlexSheetColumnFilterEditor(i, r, o.showSortButtons);
        wjcCore.addClass(i, 'wj-dropdown-panel'),
          o.grid.rightToLeft && (i.dir = 'rtl'),
          l.filterChanged.addHandler(function () {
            (n.cancel = !1),
              o._undoAcion &&
                (o._undoAcion.saveNewState() &&
                  o.grid.undoStack._addAction(o._undoAcion),
                (o._undoAcion = null)),
              setTimeout(function () {
                n.cancel || o.apply();
              });
          }),
          l.buttonClicked.addHandler(function () {
            o.closeEditor(), o.grid.focus(), o.onFilterChanged(n);
          }),
          l.lostFocus.addHandler(function () {
            setTimeout(function () {
              var e = wjcCore.Control.getControl(o._divEdt);
              e && !e.containsFocus() && o.closeEditor();
            }, 10);
          });
        var s = o.grid.columnHeaders,
          a = t ? t.row : s.rows.length - 1,
          h = t ? t.col : e.index,
          c = s.getCellBoundingRect(a, h),
          d = document.elementFromPoint(
            c.left + c.width / 2,
            c.top + c.height / 2
          );
        (d = wjcCore.closest(d, '.wj-cell'))
          ? wjcCore.showPopup(i, d, !1, !1, !1)
          : wjcCore.showPopup(i, c),
          l.focus(),
          (o._divEdt = i),
          (o._edtCol = e);
      }
    }),
    (t.prototype.closeEditor = function () {
      this._undoAcion && (this._undoAcion = null),
        e.prototype.closeEditor.call(this);
    }),
    (t.prototype.getColumnFilter = function (e, t) {
      if (
        (void 0 === t && (t = !0),
        wjcCore.isString(e)
          ? (e = this.grid.columns.getColumn(e))
          : wjcCore.isNumber(e) && (e = this.grid.columns[e]),
        !e)
      )
        return null;
      e = wjcCore.asType(e, wjcGrid.Column);
      for (var o = 0; o < this._filters.length; o++)
        if (this._filters[o].column == e) return this._filters[o];
      if (t) {
        var n = new _FlexSheetColumnFilter(this, e);
        return this._filters.push(n), n;
      }
      return null;
    }),
    (t.prototype._checkGroupVisible = function (e) {
      for (var t, o = !0, n = e.topRow + 1; n <= e.bottomRow; n++)
        if ((t = this.grid.rows[n]))
          if (t instanceof wjcGrid.GroupRow)
            o = this._checkGroupVisible(t.getCellRange());
          else if ((o = this._filter(n))) break;
      return o;
    }),
    t
  );
})(wjcGridFilter.FlexGridFilter);
exports._FlexSheetFilter = _FlexSheetFilter;
