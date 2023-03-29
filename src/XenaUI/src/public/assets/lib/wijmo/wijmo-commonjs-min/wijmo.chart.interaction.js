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
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcChart = require('wijmo/wijmo.chart'),
  wjcSelf = require('wijmo/wijmo.chart.interaction');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.chart = window.wijmo.chart || {}),
  (window.wijmo.chart.interaction = wjcSelf);
var _RangeSlider = (function () {
  function t(t, e, i, s) {
    (this._isVisible = !0),
      (this._buttonsVisible = !0),
      (this._minScale = 0),
      (this._maxScale = 1),
      (this._seamless = !1),
      (this._rsContainer = null),
      (this._rsEle = null),
      (this._decBtn = null),
      (this._incBtn = null),
      (this._rsContent = null),
      (this._minHandler = null),
      (this._rangeHandler = null),
      (this._maxHandler = null),
      (this._wrapperSliderMousedown = null),
      (this._wrapperDocMouseMove = null),
      (this._wrapperDocMouseup = null),
      (this._wrapperBtnMousedown = null),
      (this._wrapperRangeSpaceMousedown = null),
      (this._wrapperRangeMouseleave = null),
      (this._isTouch = !1),
      (this._slidingInterval = null),
      (this._rangeSliderRect = null),
      (this._isHorizontal = !0),
      (this._isBtnMousedown = !1),
      (this._needSpaceClick = !1),
      (this._hasButtons = !0),
      (this._movingEle = null),
      (this._movingOffset = null),
      (this._range = null),
      (this._startPt = null),
      (this._minPos = 0),
      (this._maxPos = 1),
      (this.rangeChanged = new wjcCore.Event()),
      (this.rangeChanging = new wjcCore.Event()),
      t || wjcCore.assert(!1, 'The container cannot be null.'),
      (this._isTouch = 'ontouchstart' in window),
      (this._needSpaceClick = e),
      (this._hasButtons = i),
      wjcCore.copy(this, s),
      this._createSlider(t);
  }
  return (
    Object.defineProperty(t.prototype, 'buttonsVisible', {
      get: function () {
        return this._buttonsVisible;
      },
      set: function (t) {
        if (t != this._buttonsVisible) {
          if (
            ((this._buttonsVisible = wjcCore.asBoolean(t)),
            !this._rsContainer || !this._hasButtons)
          )
            return;
          this._refresh();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isHorizontal', {
      get: function () {
        return this._isHorizontal;
      },
      set: function (t) {
        if (t != this._isHorizontal) {
          if (((this._isHorizontal = wjcCore.asBoolean(t)), !this._rsContainer))
            return;
          this._invalidate();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isVisible', {
      get: function () {
        return this._isVisible;
      },
      set: function (t) {
        if (t != this._isVisible) {
          if (((this._isVisible = wjcCore.asBoolean(t)), !this._rsContainer))
            return;
          this._rsContainer.style.visibility = this._isVisible
            ? 'visible'
            : 'hidden';
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'minScale', {
      get: function () {
        return this._minScale;
      },
      set: function (t) {
        t >= 0 && t != this._minScale && (this._minScale = wjcCore.asNumber(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'maxScale', {
      get: function () {
        return this._maxScale;
      },
      set: function (t) {
        t >= 0 && t != this._maxScale && (this._maxScale = wjcCore.asNumber(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'seamless', {
      get: function () {
        return this._seamless;
      },
      set: function (t) {
        t != this._seamless && (this._seamless = wjcCore.asBoolean(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onRangeChanged = function (t) {
      this.rangeChanged.raise(this, t);
    }),
    (t.prototype.onRangeChanging = function (t) {
      this.rangeChanging.raise(this, t);
    }),
    Object.defineProperty(t.prototype, '_isSliding', {
      get: function () {
        return null !== this._startPt;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_handleWidth', {
      get: function () {
        return this._minHandler.offsetWidth;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._createSlider = function (e) {
      var i = this._isHorizontal ? t._HRANGESLIDER : t._VRANGESLIDER,
        s = this._isHorizontal ? 'wj-glyph-left' : 'wj-glyph-down',
        n = this._isHorizontal ? 'wj-glyph-right' : 'wj-glyph-up';
      (this._rsContainer = e),
        (this._rsContainer.style.visibility = this._isVisible
          ? 'visible'
          : 'hidden'),
        (this._rsEle = wjcCore.createElement(
          '<div class="wj-chart-rangeslider ' + i + '"></div>'
        )),
        this._rsContainer.appendChild(this._rsEle),
        this._hasButtons &&
          ((this._decBtn = wjcCore.createElement(
            '<button class="wj-rangeslider-decbtn wj-btn wj-btn-default" type="button" tabindex="-1"><span class="' +
              s +
              ' ' +
              t._RANGESLIDER_DECBTN +
              '"></span></button>'
          )),
          this._rsEle.appendChild(this._decBtn),
          (this._incBtn = wjcCore.createElement(
            '<button class="wj-rangeslider-incbtn wj-btn wj-btn-default" type="button" tabindex="-1"><span class="' +
              n +
              ' ' +
              t._RANGESLIDER_INCBTN +
              '"></span></button>'
          )),
          this._rsEle.appendChild(this._incBtn)),
        (this._rsContent = wjcCore.createElement(
          '<div class="wj-rangeslider-content"><div class="wj-rangeslider-rangehandle"></div><div class="wj-rangeslider-minhandle"></div><div class="wj-rangeslider-maxhandle"></div>'
        )),
        this._rsEle.appendChild(this._rsContent),
        (this._minHandler = this._rsContent.querySelector(
          '.' + t._RANGESLIDER_MINHANDLE
        )),
        (this._rangeHandler = this._rsContent.querySelector(
          '.' + t._RANGESLIDER_RANGEHANDLE
        )),
        (this._maxHandler = this._rsContent.querySelector(
          '.' + t._RANGESLIDER_MAXHANDLE
        )),
        (this._wrapperSliderMousedown = this._onSliderMousedown.bind(this)),
        (this._wrapperDocMouseMove = this._onDocMouseMove.bind(this)),
        (this._wrapperDocMouseup = this._onDocMouseup.bind(this)),
        (this._wrapperRangeSpaceMousedown =
          this._onRangeSpaceMousedown.bind(this)),
        (this._wrapperRangeMouseleave = this._onRangeMouseleave.bind(this)),
        (this._wrapperBtnMousedown = this._onBtnMousedown.bind(this)),
        this._switchEvent(!0);
    }),
    (t.prototype._switchEvent = function (t) {
      var e = t ? 'addEventListener' : 'removeEventListener';
      this._rsContainer &&
        (this._needSpaceClick &&
          this._rsEle[e]('mousedown', this._wrapperRangeSpaceMousedown),
        this._rsEle[e]('mouseleave', this._wrapperRangeMouseleave),
        this._rsContent[e]('mousedown', this._wrapperSliderMousedown),
        this._hasButtons &&
          (this._decBtn[e]('mousedown', this._wrapperBtnMousedown),
          this._incBtn[e]('mousedown', this._wrapperBtnMousedown)),
        document[e]('mousemove', this._wrapperDocMouseMove),
        document[e]('mouseup', this._wrapperDocMouseup),
        'ontouchstart' in window &&
          (this._needSpaceClick &&
            this._rsEle[e]('touchstart', this._wrapperRangeSpaceMousedown),
          this._rsContent[e]('touchstart', this._wrapperSliderMousedown),
          this._hasButtons &&
            (this._decBtn[e]('touchstart', this._wrapperBtnMousedown),
            this._incBtn[e]('touchstart', this._wrapperBtnMousedown)),
          document[e]('touchmove', this._wrapperDocMouseMove),
          document[e]('touchend', this._wrapperDocMouseup)));
    }),
    (t.prototype._onSliderMousedown = function (e) {
      this._isVisible &&
        ((this._movingEle = e.srcElement || e.target),
        (this._startPt =
          e instanceof MouseEvent
            ? new wjcCore.Point(e.pageX, e.pageY)
            : new wjcCore.Point(
                e.changedTouches[0].pageX,
                e.changedTouches[0].pageY
              )),
        wjcCore.removeClass(this._minHandler, t._RANGESLIDER_HANDLE_ACTIVE),
        wjcCore.removeClass(this._maxHandler, t._RANGESLIDER_HANDLE_ACTIVE),
        (this._movingOffset = wjcCore.getElementRect(this._movingEle)),
        this._movingEle != this._rangeHandler
          ? (this._isHorizontal
              ? (this._movingOffset.left += 0.5 * this._movingEle.offsetWidth)
              : (this._movingOffset.top += 0.5 * this._movingEle.offsetHeight),
            wjcCore.addClass(this._movingEle, t._RANGESLIDER_HANDLE_ACTIVE))
          : (this._range = this._maxPos - this._minPos),
        e.preventDefault());
    }),
    (t.prototype._onDocMouseMove = function (t) {
      if (this._isVisible && this._startPt) {
        var e =
          t instanceof MouseEvent
            ? new wjcCore.Point(t.pageX, t.pageY)
            : new wjcCore.Point(
                t.changedTouches[0].pageX,
                t.changedTouches[0].pageY
              );
        this._onMove(e);
      }
    }),
    (t.prototype._onMove = function (e) {
      var i,
        s = this,
        n = this._startPt,
        o = this._movingOffset,
        a = this._plotBox,
        r = this._range,
        h = this._movingEle,
        _ = this._minHandler,
        l = this._rangeHandler,
        c = this._maxHandler;
      n &&
        o &&
        ((i = this._isHorizontal
          ? (o.left + e.x - n.x - a.x) / a.width
          : 1 - (o.top + e.y - n.y - a.y) / a.height) < 0
          ? (i = 0)
          : i > 1 && (i = 1),
        h === _
          ? this._seamless && 0 === this._minScale && i >= this._maxPos
            ? ((s._minPos = s._maxPos),
              (s._movingEle = c),
              wjcCore.removeClass(
                this._minHandler,
                t._RANGESLIDER_HANDLE_ACTIVE
              ),
              wjcCore.addClass(this._maxHandler, t._RANGESLIDER_HANDLE_ACTIVE))
            : (i > this._maxPos - this._minScale &&
                (i = this._maxPos - this._minScale),
              i < this._maxPos - this._maxScale &&
                (i = this._maxPos - this._maxScale),
              (this._minPos = i))
          : h === c
          ? this._seamless && 0 === this._minScale && i <= this._minPos
            ? ((s._maxPos = s._minPos),
              (s._movingEle = _),
              wjcCore.removeClass(
                this._maxHandler,
                t._RANGESLIDER_HANDLE_ACTIVE
              ),
              wjcCore.addClass(this._minHandler, t._RANGESLIDER_HANDLE_ACTIVE))
            : (i < this._minPos + this._minScale &&
                (i = this._minPos + this._minScale),
              i > this._minPos + this._maxScale &&
                (i = this._minPos + this._maxScale),
              (this._maxPos = i))
          : h === l &&
            (this._isHorizontal
              ? ((this._minPos = i),
                (this._maxPos = this._minPos + r),
                this._maxPos >= 1 &&
                  ((this._maxPos = 1), (this._minPos = this._maxPos - r)))
              : ((this._maxPos = i),
                (this._minPos = this._maxPos - r),
                this._minPos <= 0 &&
                  ((this._minPos = 0), (this._maxPos = this._minPos + r)))),
        this._updateElesPosition(),
        this.onRangeChanging());
    }),
    (t.prototype._onDocMouseup = function (e) {
      this._isVisible &&
        (this._clearInterval(),
        (this._isBtnMousedown = !1),
        this._startPt &&
          (this.onRangeChanged(),
          (this._startPt = null),
          (this._movingOffset = null)),
        wjcCore.removeClass(this._minHandler, t._RANGESLIDER_HANDLE_ACTIVE),
        wjcCore.removeClass(this._maxHandler, t._RANGESLIDER_HANDLE_ACTIVE));
    }),
    (t.prototype._onRangeSpaceMousedown = function (t) {
      var e =
          t instanceof MouseEvent
            ? new wjcCore.Point(t.pageX, t.pageY)
            : new wjcCore.Point(
                t.changedTouches[0].pageX,
                t.changedTouches[0].pageY
              ),
        i = wjcCore.getElementRect(this._rsContent),
        s = wjcCore.getElementRect(this._rangeHandler),
        n = t.srcElement || t.target,
        o = 0;
      t.stopPropagation(),
        t.preventDefault(),
        (n !== this._rsContent && n !== this._rsEle) ||
          (this._isHorizontal
            ? ((o = s.width / i.width),
              e.x < s.left ? (o *= -1) : e.x > s.left + s.width && (o *= 1))
            : ((o = s.height / i.height),
              e.y < s.top ? (o *= 1) : e.y > s.top + s.height && (o *= -1)),
          0 !== o && this._doSliding(o, e));
    }),
    (t.prototype._onRangeMouseleave = function (t) {
      t.stopPropagation(),
        t.preventDefault(),
        this._isBtnMousedown && (this._clearInterval(), this.onRangeChanged());
    }),
    (t.prototype._onBtnMousedown = function (e) {
      var i = e.srcElement || e.target,
        s = 0;
      if (
        (e.stopPropagation(),
        e.preventDefault(),
        wjcCore.hasClass(i, t._RANGESLIDER_DECBTN))
      ) {
        if (0 === this._minPos) return;
        s = -0.05;
      } else if (wjcCore.hasClass(i, t._RANGESLIDER_INCBTN)) {
        if (1 === this._maxPos) return;
        s = 0.05;
      }
      (this._isBtnMousedown = !0), 0 !== s && this._doSliding(s);
    }),
    (t.prototype._refresh = function (t) {
      var e,
        i,
        s = 0,
        n = wjcCore.getElementRect(this._rsContainer);
      t && (this._rangeSliderRect = t),
        this._rangeSliderRect &&
          (this._hasButtons && this._buttonsVisible
            ? ((this._decBtn.style.display = 'block'),
              (this._incBtn.style.display = 'block'),
              (s = this._isHorizontal
                ? this._decBtn.offsetWidth + this._minHandler.offsetWidth / 2
                : this._decBtn.offsetHeight +
                  this._minHandler.offsetHeight / 2))
            : (this._hasButtons &&
                ((this._decBtn.style.display = 'none'),
                (this._incBtn.style.display = 'none')),
              (s = this._isHorizontal
                ? this._minHandler.offsetWidth / 2
                : this._minHandler.offsetHeight / 2)),
          (e = this._getRsRect()),
          this._isHorizontal
            ? ((e.left -= this._minHandler.offsetWidth / 2),
              (e.width += this._minHandler.offsetWidth),
              (i = { left: s, width: e.width - 2 * s }))
            : ((e.top -= this._minHandler.offsetHeight / 2),
              (e.height += this._minHandler.offsetHeight),
              (i = { top: s, height: e.height - 2 * s })),
          wjcCore.setCss(this._rsEle, e),
          wjcCore.setCss(this._rsContent, i),
          (n = wjcCore.getElementRect(this._rsContent)),
          (this._plotBox = {
            x: n.left,
            y: n.top,
            width: n.width,
            height: n.height,
          }),
          this._updateElesPosition());
    }),
    (t.prototype._updateElesPosition = function () {
      var t,
        e,
        i,
        s = this._minHandler,
        n = (this._rangeHandler, this._maxHandler),
        o = this._plotBox,
        a = this._isHorizontal;
      o &&
        ((t = a
          ? { left: this._minPos * o.width - 0.5 * s.offsetWidth }
          : {
              top: (1 - this._minPos) * o.height - 0.5 * n.offsetHeight,
            }),
        (e = a
          ? {
              left: this._minPos * o.width,
              width: (this._maxPos - this._minPos) * o.width,
            }
          : {
              top: (1 - this._maxPos) * o.height,
              height: (this._maxPos - this._minPos) * o.height,
            }),
        (i = a
          ? { left: this._maxPos * o.width - 0.5 * n.offsetWidth }
          : {
              top: (1 - this._maxPos) * o.height - 0.5 * s.offsetHeight,
            }),
        this._refreshSlider(t, e, i));
    }),
    (t.prototype._refreshSlider = function (t, e, i) {
      wjcCore.setCss(this._minHandler, t),
        wjcCore.setCss(this._rangeHandler, e),
        wjcCore.setCss(this._maxHandler, i);
    }),
    (t.prototype._invalidate = function () {
      var e, i;
      this._rsContainer &&
        ((e = this._isHorizontal ? t._HRANGESLIDER : t._VRANGESLIDER),
        (i = this._isHorizontal ? t._VRANGESLIDER : t._HRANGESLIDER),
        wjcCore.removeClass(this._rsEle, i),
        wjcCore.addClass(this._rsEle, e),
        [
          this._rsEle,
          this._rsContent,
          this._minHandler,
          this._maxHandler,
          this._rangeHandler,
        ].forEach(function (t) {
          t.removeAttribute('style');
        }),
        this._refresh());
    }),
    (t.prototype._changeRange = function (t) {
      var e = this._maxPos - this._minPos;
      (t < 0 && 0 === this._minPos) ||
        (t > 0 && 1 === this._maxPos) ||
        (t < 0
          ? ((this._minPos += t),
            (this._minPos = this._minPos < 0 ? 0 : this._minPos),
            (this._maxPos = this._minPos + e))
          : ((this._maxPos += t),
            (this._maxPos = this._maxPos > 1 ? 1 : this._maxPos),
            (this._minPos = this._maxPos - e)),
        this._updateElesPosition());
    }),
    (t.prototype._doSliding = function (t, e) {
      wjcCore.getElementRect(this._rsContent),
        wjcCore.getElementRect(this._rangeHandler);
      this._clearInterval(),
        (this._startPt = new wjcCore.Point()),
        this._changeRange(t),
        this.onRangeChanged(),
        this._setSlidingInterval(t, e);
    }),
    (t.prototype._setSlidingInterval = function (t, e) {
      var i,
        s,
        n = this;
      this._slidingInterval = window.setInterval(function () {
        if (e)
          if (
            ((i = wjcCore.getElementRect(n._rsContent)),
            (s = wjcCore.getElementRect(n._rangeHandler)),
            n._isHorizontal)
          ) {
            if (e.x >= s.left && e.x <= s.left + s.width)
              return void n._clearInterval();
          } else if (e.y >= s.top && e.y <= s.top + s.height)
            return void n._clearInterval();
        n._changeRange(t), n.onRangeChanged();
      }, 200);
    }),
    (t.prototype._clearInterval = function () {
      this._slidingInterval && window.clearInterval(this._slidingInterval);
    }),
    (t.prototype._getRsRect = function () {
      var t = this._rangeSliderRect,
        e = {};
      if (t)
        return (
          ['left', 'top', 'width', 'height'].forEach(function (i) {
            t[i] && (e[i] = t[i]);
          }),
          e
        );
    }),
    (t._HRANGESLIDER = 'wj-chart-hrangeslider'),
    (t._VRANGESLIDER = 'wj-chart-vrangeslider'),
    (t._RANGESLIDER_DECBTN = 'wj-rangeslider-decbtn'),
    (t._RANGESLIDER_INCBTN = 'wj-rangeslider-incbtn'),
    (t._RANGESLIDER_RANGEHANDLE = 'wj-rangeslider-rangehandle'),
    (t._RANGESLIDER_MINHANDLE = 'wj-rangeslider-minhandle'),
    (t._RANGESLIDER_MAXHANDLE = 'wj-rangeslider-maxhandle'),
    (t._RANGESLIDER_HANDLE_ACTIVE = 'wj-rangeslider-handle-active'),
    t
  );
})();
exports._RangeSlider = _RangeSlider;
var Orientation;
!(function (t) {
  (t[(t.X = 0)] = 'X'), (t[(t.Y = 1)] = 'Y');
})((Orientation = exports.Orientation || (exports.Orientation = {})));
var RangeSelector = (function () {
  function t(t, e) {
    (this._isVisible = !0),
      (this._orientation = Orientation.X),
      (this._seamless = !1),
      (this._minScale = 0),
      (this._maxScale = 1),
      (this.rangeChanged = new wjcCore.Event()),
      (this._chart = wjcCore.asType(t, wjcChart.FlexChartCore, !1)),
      this._createRangeSelector(),
      wjcCore.copy(this, e);
  }
  return (
    Object.defineProperty(t.prototype, 'isVisible', {
      get: function () {
        return this._isVisible;
      },
      set: function (t) {
        t != this._isVisible &&
          ((this._isVisible = wjcCore.asBoolean(t)),
          this._rangeSlider && (this._rangeSlider.isVisible = t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'min', {
      get: function () {
        return this._min;
      },
      set: function (t) {
        if ((t = wjcCore.asNumber(t, !0, !1)) != this._min) {
          var e = !1;
          null == t || void 0 === t || isNaN(t) || null == this._max
            ? ((this._min = t), (e = !0))
            : t <= this._max && ((this._min = t), (e = !0)),
            this._rangeSlider && e && this._changeRange();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'max', {
      get: function () {
        return this._max;
      },
      set: function (t) {
        if ((t = wjcCore.asNumber(t, !0, !1)) != this._max) {
          var e = !1;
          null == t || isNaN(t)
            ? ((this._max = t), (e = !0))
            : t >= this._min && ((this._max = t), (e = !0)),
            this._rangeSlider && e && this._changeRange();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'orientation', {
      get: function () {
        return this._orientation;
      },
      set: function (t) {
        if ((t = wjcCore.asEnum(t, Orientation)) !== this._orientation) {
          if (((this._orientation = t), !this._rangeSlider)) return;
          this._rangeSlider.isHorizontal = t == Orientation.X;
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'seamless', {
      get: function () {
        return this._seamless;
      },
      set: function (t) {
        (t = wjcCore.asBoolean(t, !0)) != this._seamless &&
          ((this._seamless = t),
          this._rangeSlider && (this._rangeSlider.seamless = t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'minScale', {
      get: function () {
        return this._minScale;
      },
      set: function (t) {
        (t = wjcCore.asNumber(t)) <= 1 &&
          t >= 0 &&
          t != this._minScale &&
          t < this._maxScale &&
          ((this._minScale = t),
          this._rangeSlider &&
            ((this._rangeSlider.minScale = wjcCore.asNumber(t)),
            this._updateMinAndMaxWithScale(!0)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'maxScale', {
      get: function () {
        return this._maxScale;
      },
      set: function (t) {
        (t = wjcCore.asNumber(t)) <= 1 &&
          t >= 0 &&
          t != this._maxScale &&
          t > this._minScale &&
          ((this._maxScale = t),
          this._rangeSlider &&
            ((this._rangeSlider.maxScale = wjcCore.asNumber(t)),
            this._updateMinAndMaxWithScale(!0)));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.remove = function () {
      this._rangeSelectorEle &&
        (this._chart.hostElement.removeChild(this._rangeSelectorEle),
        this._switchEvent(!1),
        (this._rangeSelectorEle = null),
        (this._rangeSlider = null));
    }),
    (t.prototype.onRangeChanged = function (t) {
      this.rangeChanged.raise(this, t);
    }),
    (t.prototype._createRangeSelector = function () {
      var t = this._chart.hostElement,
        e = this._orientation === Orientation.X;
      (this._rangeSelectorEle = wjcCore.createElement(
        '<div class="wj-chart-rangeselector-container"></div>'
      )),
        (this._rangeSlider = new _RangeSlider(this._rangeSelectorEle, !1, !1, {
          isHorizontal: e,
          isVisible: this._isVisible,
          seamless: this._seamless,
        })),
        t.appendChild(this._rangeSelectorEle),
        this._switchEvent(!0);
    }),
    (t.prototype._switchEvent = function (t) {
      var e = t ? 'addHandler' : 'removeHandler';
      this._chart.hostElement &&
        (this._rangeSlider.rangeChanged[e](this._updateRange, this),
        this._chart.rendered[e](this._refresh, this));
    }),
    (t.prototype._refresh = function () {
      var t,
        e,
        i,
        s = this._chart.hostElement,
        n = wjcCore.getElementRect(this._rangeSelectorEle);
      (t = s.querySelector('.' + wjcChart.FlexChart._CSS_PLOT_AREA)),
        (e = wjcCore.getElementRect(t)),
        (i = t.getBBox()) &&
          i.width &&
          i.height &&
          (this._adjustMinAndMax(),
          this._rangeSlider._refresh({
            left: i.x,
            top: e.top - n.top,
            width: i.width,
            height: i.height,
          }));
    }),
    (t.prototype._adjustMinAndMax = function () {
      var t = this,
        e = t._chart,
        i = t._rangeSlider,
        s = t._min,
        n = t._max,
        o = t._orientation === Orientation.X ? e.axisX : e.axisY,
        a = wjcCore.isDate(o.actualMin) ? o.actualMin.valueOf() : o.actualMin,
        r = wjcCore.isDate(o.actualMax) ? o.actualMax.valueOf() : o.actualMax;
      (t._min =
        null === s || isNaN(s) || void 0 === s || s < a || s > r ? a : s),
        (t._max =
          null === n || isNaN(n) || void 0 === n || n < a || n > r ? r : n);
      var h = this._chart._plotRect;
      if (h) {
        if (this._orientation === Orientation.X) {
          var _ = (o.convert(t._min) - h.left) / h.width,
            l = (o.convert(t._max) - h.left) / h.width;
          (i._minPos = _), (i._maxPos = l);
        } else {
          var _ = (h.top - o.convert(t._min)) / h.height + 1,
            l = (h.top - o.convert(t._max)) / h.height + 1;
          (i._minPos = _), (i._maxPos = l);
        }
        this._updateMinAndMaxWithScale(!1);
      }
    }),
    (t.prototype._updateMinAndMaxWithScale = function (t) {
      var e,
        i = this._rangeSlider,
        s = !1;
      if (
        (0 !== this._minScale &&
          i._minPos + this._minScale > i._maxPos &&
          ((e = i._minPos + this._minScale) > 1
            ? ((i._maxPos = 1), (i._minPos = 1 - this._minScale))
            : (i._maxPos = e),
          (s = !0)),
        1 !== this._maxScale &&
          i._minPos + this._maxScale < i._maxPos &&
          ((e = i._minPos + this._maxScale) > 1
            ? ((i._maxPos = 1), (i._minPos = 1 - this._maxScale))
            : (i._maxPos = e),
          (s = !0)),
        s)
      ) {
        var n = this._getMinAndMax();
        (this._min = n.min),
          (this._max = n.max),
          t &&
            this._rangeSelectorEle &&
            (this._rangeSlider._refresh(), this.onRangeChanged());
      }
    }),
    (t.prototype._changeRange = function () {
      this._adjustMinAndMax(),
        this._rangeSelectorEle &&
          (this._rangeSlider._refresh(), this.onRangeChanged());
    }),
    (t.prototype._updateRange = function () {
      var t;
      this._rangeSlider;
      (t = this._chart),
        this._orientation === Orientation.X ? t.axisX : t.axisY;
      var e = this._getMinAndMax();
      (this._min = e.min), (this._max = e.max), this.onRangeChanged();
    }),
    (t.prototype._getMinAndMax = function () {
      var t = this._rangeSlider,
        e = this._chart,
        i = e._plotRect,
        s = null,
        n = null;
      return (
        i &&
          (this._orientation === Orientation.X
            ? ((s = e.axisX.convertBack(i.left + t._minPos * i.width)),
              (n = e.axisX.convertBack(i.left + t._maxPos * i.width)))
            : ((s = e.axisY.convertBack(i.top + (1 - t._minPos) * i.height)),
              (n = e.axisY.convertBack(i.top + (1 - t._maxPos) * i.height)))),
        { min: s, max: n }
      );
    }),
    t
  );
})();
exports.RangeSelector = RangeSelector;
var MouseAction;
!(function (t) {
  (t[(t.Zoom = 0)] = 'Zoom'), (t[(t.Pan = 1)] = 'Pan');
})((MouseAction = exports.MouseAction || (exports.MouseAction = {})));
var InteractiveAxes;
!(function (t) {
  (t[(t.X = 0)] = 'X'), (t[(t.Y = 1)] = 'Y'), (t[(t.XY = 2)] = 'XY');
})(
  (InteractiveAxes = exports.InteractiveAxes || (exports.InteractiveAxes = {}))
);
var ChartGestures = (function () {
  function t(t, e) {
    (this._chart = null),
      (this._zoomEle = null),
      (this._overlayEle = null),
      (this._wrapperMousedown = null),
      (this._wrapperMouseMove = null),
      (this._wrapperMouseup = null),
      (this._wrapperPointerdown = null),
      (this._wrapperPointerMove = null),
      (this._wrapperPointerup = null),
      (this._wrapperTouchStart = null),
      (this._wrapperTouchMove = null),
      (this._wrapperTouchEnd = null),
      (this._wrapperMouseWheel = null),
      (this._startFirstPt = null),
      (this._minX = null),
      (this._maxX = null),
      (this._minY = null),
      (this._maxY = null),
      (this._threadHold = 20),
      (this._clip = {}),
      (this._selection = {}),
      (this._startPointers = []),
      (this._mvPointers = []),
      (this._pinchStartEvents = []),
      (this._minXRange = null),
      (this._minYRange = null),
      (this._innerUpdating = !1),
      (this._lastMinX = null),
      (this._lastMaxX = null),
      (this._lastMinY = null),
      (this._lastMaxY = null),
      (this._mouseAction = MouseAction.Zoom),
      (this._interactiveAxes = InteractiveAxes.X),
      (this._enable = !0),
      (this._scaleX = 1),
      (this._scaleY = 1),
      (this._posX = 0),
      (this._posY = 0),
      t || wjcCore.assert(!1, 'The FlexChart cannot be null.'),
      (this._chart = t),
      wjcCore.copy(this, e),
      this._initialize();
  }
  return (
    Object.defineProperty(t.prototype, 'mouseAction', {
      get: function () {
        return this._mouseAction;
      },
      set: function (t) {
        t !== this._mouseAction &&
          (this._mouseAction = wjcCore.asEnum(t, MouseAction));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'interactiveAxes', {
      get: function () {
        return this._interactiveAxes;
      },
      set: function (t) {
        t !== this._interactiveAxes &&
          (this._interactiveAxes = wjcCore.asEnum(t, InteractiveAxes));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'enable', {
      get: function () {
        return this._enable;
      },
      set: function (t) {
        t !== this._enable && (this._enable = wjcCore.asBoolean(t, !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'scaleX', {
      get: function () {
        return this._scaleX;
      },
      set: function (t) {
        t !== this._scaleX &&
          ((this._scaleX = t < 0 ? 0 : t > 1 ? 1 : wjcCore.asNumber(t)),
          this._seriesGroup && this._initAxisRangeWithPosAndScale(!0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'scaleY', {
      get: function () {
        return this._scaleY;
      },
      set: function (t) {
        t !== this._scaleY &&
          ((this._scaleY = t < 0 ? 0 : t > 1 ? 1 : wjcCore.asNumber(t)),
          this._seriesGroup && this._initAxisRangeWithPosAndScale(!1));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'posX', {
      get: function () {
        return this._posX;
      },
      set: function (t) {
        t !== this._posX &&
          ((this._posX = t < 0 ? 0 : t > 1 ? 1 : wjcCore.asNumber(t)),
          this._seriesGroup && this._initAxisRangeWithPosAndScale(!0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'posY', {
      get: function () {
        return this._posY;
      },
      set: function (t) {
        t !== this._posY &&
          ((this._posY = t < 0 ? 0 : t > 1 ? 1 : wjcCore.asNumber(t)),
          this._seriesGroup && this._initAxisRangeWithPosAndScale(!1));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.remove = function () {
      this._zoomEle &&
        (this._chart.hostElement.removeChild(this._zoomEle),
        (this._zoomEle = null)),
        wjcCore.removeClass(this._chart.hostElement, t._CSS_TOUCH_DISABLED),
        this._switchEvent(!1),
        (this._wrapperMousedown = null),
        (this._wrapperMouseMove = null),
        (this._wrapperMouseup = null),
        (this._wrapperPointerdown = null),
        (this._wrapperPointerMove = null),
        (this._wrapperPointerup = null),
        (this._wrapperTouchStart = null),
        (this._wrapperTouchMove = null),
        (this._wrapperTouchEnd = null),
        (this._wrapperMouseWheel = null);
    }),
    (t.prototype.reset = function () {
      var t = this._chart,
        e = t.axisX,
        i = t.axisY;
      this._maxX && (e.max = this._maxX),
        this._minX && (e.min = this._minX),
        this._maxY && (i.max = this._maxY),
        this._minY && (i.min = this._minY),
        this._initAxisRangeWithPosAndScale(!0),
        this._initAxisRangeWithPosAndScale(!1);
    }),
    (t.prototype._refreshChart = function () {
      var t = this._chart,
        e = t.axisX,
        i = t.axisY;
      (this._minX = this._getAxisMin(e)),
        (this._maxX = this._getAxisMax(e)),
        (this._minY = this._getAxisMin(i)),
        (this._maxY = this._getAxisMax(i)),
        (this._minXRange = 0.005 * (this._maxX - this._minX)),
        (this._minYRange = 0.005 * (this._maxY - this._minY)),
        this._initAxisRangeWithPosAndScale(!0),
        this._initAxisRangeWithPosAndScale(!1);
    }),
    (t.prototype._initialize = function () {
      var e = this._chart.hostElement;
      (this._zoomEle = wjcCore.createElement(
        '<div class="' +
          t._CSS_ZOOM +
          '"><div class="' +
          t._CSS_ZOOM_OVERLAY +
          '"></div>'
      )),
        (this._zoomEle.style.visibility = 'visible'),
        e.appendChild(this._zoomEle),
        wjcCore.addClass(e, t._CSS_TOUCH_DISABLED),
        (this._overlayEle = this._zoomEle.querySelector(
          '.' + t._CSS_ZOOM_OVERLAY
        )),
        (this._wrapperMousedown = this._onMousedown.bind(this)),
        (this._wrapperMouseMove = this._onMouseMove.bind(this)),
        (this._wrapperMouseup = this._onMouseup.bind(this)),
        (this._wrapperPointerdown = this._onPointerdown.bind(this)),
        (this._wrapperPointerMove = this._onPointerMove.bind(this)),
        (this._wrapperPointerup = this._onPointerup.bind(this)),
        (this._wrapperMouseWheel = this._onMouseWheel.bind(this)),
        (this._wrapperTouchStart = this._onTouchStart.bind(this)),
        (this._wrapperTouchMove = this._onTouchMove.bind(this)),
        (this._wrapperTouchEnd = this._onTouchEnd.bind(this)),
        this._switchEvent(!0);
    }),
    (t.prototype._switchEvent = function (t) {
      var e = this._chart.hostElement,
        i = t ? 'addEventListener' : 'removeEventListener',
        s = t ? 'addHandler' : 'removeHandler';
      e &&
        (e[i]('mousedown', this._wrapperMousedown),
        e[i]('mousemove', this._wrapperMouseMove),
        document[i]('mouseup', this._wrapperMouseup),
        'onpointerdown' in window &&
          (e[i]('pointerdown', this._wrapperPointerdown),
          e[i]('pointermove', this._wrapperPointerMove),
          document[i]('pointerup', this._wrapperPointerup)),
        e[i]('wheel', this._wrapperMouseWheel),
        'ontouchstart' in window &&
          (e[i]('touchstart', this._wrapperTouchStart),
          e[i]('touchmove', this._wrapperTouchMove),
          document[i]('touchend', this._wrapperTouchEnd)),
        this._chart.rendered[s](this._refresh, this));
    }),
    (t.prototype._refresh = function () {
      var t,
        e,
        i,
        s = this._chart,
        n = s.axisX,
        o = s.axisY,
        a = s.hostElement;
      (this._seriesGroup = a.querySelector('.wj-series-group')),
        (t = a.querySelector('.' + wjcChart.FlexChart._CSS_PLOT_AREA)),
        (this._plotOffset = wjcCore.getElementRect(t)),
        (this._plotBox = t.getBBox()),
        (this._zoomEleOffset = wjcCore.getElementRect(this._zoomEle)),
        this._overlayEle && this._overlayEle.removeAttribute('style'),
        this._innerUpdating
          ? (this._innerUpdating = !1)
          : ((e = !1),
            (i = !1),
            (null === this._minX ||
              isNaN(this._minX) ||
              0 === this._minX ||
              -1 === this._minX ||
              this._lastMinX !== this._getAxisMin(n)) &&
              ((this._minX = this._getAxisMin(n)),
              null === this._minX ||
                isNaN(this._minX) ||
                0 === this._minX ||
                -1 === this._minX ||
                (e = !0)),
            (null === this._maxX ||
              isNaN(this._maxX) ||
              0 === this._maxX ||
              -1 === this._maxX ||
              this._lastMaxX !== this._getAxisMax(n)) &&
              ((this._maxX = this._getAxisMax(n)),
              null === this._maxX ||
                isNaN(this._maxX) ||
                0 === this._maxX ||
                -1 === this._maxX ||
                (e = !0)),
            (null === this._minY ||
              isNaN(this._minY) ||
              this._lastMinY !== this._getAxisMin(o)) &&
              ((this._minY = this._getAxisMin(o)),
              isNaN(this._minY) || (i = !0)),
            (null === this._maxY ||
              isNaN(this._maxY) ||
              this._lastMaxY !== this._getAxisMax(o)) &&
              ((this._maxY = this._getAxisMax(o)),
              isNaN(this._maxY) || (i = !0)),
            (this._minXRange = 0.005 * (this._maxX - this._minX)),
            (this._minYRange = 0.005 * (this._maxY - this._minY)),
            e &&
              null !== this._scaleX &&
              void 0 !== this._scaleX &&
              1 !== this._scaleX &&
              null !== this._posX &&
              void 0 !== this._posX &&
              0 !== this._posX &&
              this._initAxisRangeWithPosAndScale(!0),
            i &&
              null !== this._scaleY &&
              void 0 !== this._scaleY &&
              1 !== this._scaleY &&
              null !== this._posY &&
              void 0 !== this._posY &&
              0 !== this._posY &&
              this._initAxisRangeWithPosAndScale(!1));
    }),
    (t.prototype._onMousedown = function (t) {
      this._enable &&
        (this._disabledOthersInteraction(!0),
        this._mouseDown(t),
        t.preventDefault());
    }),
    (t.prototype._onMouseMove = function (t) {
      this._enable && (this._mouseMove(t), t.preventDefault());
    }),
    (t.prototype._onMouseup = function (t) {
      this._enable && (this._mouseup(t), this._disabledOthersInteraction(!1));
    }),
    (t.prototype._onMouseWheel = function (t) {
      var e = -t.deltaY > 0 ? 0.05 : -0.05;
      this._enable &&
        ((this._scaling = !0),
        (this._interactiveAxes !== InteractiveAxes.X &&
          this._interactiveAxes !== InteractiveAxes.XY) ||
          this._updateAxisByChg(!0, e, -e),
        (this._interactiveAxes !== InteractiveAxes.Y &&
          this._interactiveAxes !== InteractiveAxes.XY) ||
          this._updateAxisByChg(!1, e, -e),
        (this._scaling = !1),
        t.preventDefault());
    }),
    (t.prototype._mouseDown = function (e) {
      (this._startFirstPt = this._getPoint(e)),
        this._updatePoint(this._startFirstPt),
        this._mouseAction === MouseAction.Zoom
          ? this._initOverlay()
          : (this._seriesGroup.setAttribute(
              'clip-path',
              'url(#' + this._chart._plotrectId + ')'
            ),
            wjcCore.toggleClass(
              this._chart.hostElement,
              t._CSS_PANABLE,
              this._mouseAction === MouseAction.Pan
            ));
    }),
    (t.prototype._mouseMove = function (t) {
      var e;
      this._startFirstPt &&
        ((e = this._getPoint(t)),
        this._updatePoint(e),
        (this._endPoint = new wjcCore.Point(e.x, e.y)),
        this._mouseAction === MouseAction.Zoom
          ? this._updateOverLay(e)
          : ((this._panning = !0),
            this._panningChart(
              e.x - this._startFirstPt.x,
              e.y - this._startFirstPt.y
            )));
    }),
    (t.prototype._mouseup = function (e) {
      var i = this._endPoint;
      this._chart.axisX;
      if (!this._startFirstPt || !i)
        return (
          wjcCore.removeClass(this._chart.hostElement, t._CSS_PANABLE),
          void this._reset()
        );
      this._mouseAction === MouseAction.Zoom
        ? (this._zoomedChart(i), this._reset())
        : (this._pannedChart(
            i.x - this._startFirstPt.x,
            i.y - this._startFirstPt.y
          ),
          this._reset()),
        wjcCore.removeClass(this._chart.hostElement, t._CSS_PANABLE);
    }),
    (t.prototype._onPointerdown = function (t) {
      if (this._enable) {
        switch ((this._disabledOthersInteraction(!0), t.pointerType)) {
          case 'touch':
            this._pointerDown(t);
            break;
          case 'mouse':
            this._mouseDown(t);
        }
        t.preventDefault();
      }
    }),
    (t.prototype._onPointerMove = function (t) {
      if (this._enable) {
        switch (t.pointerType) {
          case 'touch':
            this._pointerMove(t);
            break;
          case 'mouse':
            this._mouseMove(t);
        }
        t.preventDefault();
      }
    }),
    (t.prototype._onPointerup = function (t) {
      if (this._enable) {
        switch (t.pointerType) {
          case 'touch':
            this._pointerUp(t);
            break;
          case 'mouse':
            this._mouseup(t);
        }
        this._disabledOthersInteraction(!1), t.preventDefault();
      }
    }),
    (t.prototype._pointerDown = function (t) {
      t.preventManipulation && t.preventManipulation(),
        this._seriesGroup.setAttribute(
          'clip-path',
          'url(#' + this._chart._plotrectId + ')'
        ),
        this._startPointers.push({
          id: t.pointerId,
          x: t.pageX,
          y: t.pageY,
        }),
        1 === this._startPointers.length
          ? ((this._scaling = !1), (this._panning = !0))
          : 2 === this._startPointers.length &&
            ((this._panning = !1),
            (this._scaling = !0),
            (this._startDistance = {
              x: this._startPointers[0].x - this._startPointers[1].x,
              y: this._startPointers[0].y - this._startPointers[1].y,
            }));
    }),
    (t.prototype._pointerMove = function (t) {
      var e,
        i,
        s,
        n,
        o = new wjcCore.Point(t.pageX, t.pageY),
        a = {},
        r = {};
      if ((t.preventManipulation && t.preventManipulation(), this._panning)) {
        if (!this._pointInPlotArea(o)) return;
        (this._endPoint = new wjcCore.Point(t.pageX, t.pageY)),
          this._panningChart(
            this._endPoint.x - this._startPointers[0].x,
            this._endPoint.y - this._startPointers[0].y
          );
      } else
        this._scaling &&
          ((e = this._startPointers[0].id + ''),
          (i = this._startPointers[1].id + ''),
          (this._mvPointers[t.pointerId + ''] = {
            x: t.pageX,
            y: t.pageY,
          }),
          this._mvPointers[e] &&
            this._mvPointers[i] &&
            (Math.abs(this._startDistance.x) > this._threadHold &&
              this._interactiveAxes !== InteractiveAxes.Y &&
              ((s = this._mvPointers[e].x - this._plotOffset.left),
              (n = this._startPointers[0].x - this._plotOffset.left),
              (r.x = Math.abs(
                (this._mvPointers[e].x - this._mvPointers[i].x) /
                  this._startDistance.x
              )),
              (a.x = s - r.x * n),
              (this._clip.x = (this._plotBox.x - s) / r.x + n),
              (this._selection.w = this._plotBox.width / r.x)),
            Math.abs(this._startDistance.y) > this._threadHold &&
              this._interactiveAxes !== InteractiveAxes.X &&
              ((s = this._mvPointers[e].y - this._plotOffset.top),
              (n = this._startPointers[0].y - this._plotOffset.top),
              (r.y = Math.abs(
                (this._mvPointers[e].y - this._mvPointers[i].y) /
                  this._startDistance.y
              )),
              (a.y = s - r.y * n),
              (this._clip.y = (this._plotBox.y - s) / r.y + n),
              (this._selection.h = this._plotBox.height / r.y)),
            this._scalingChart(r, a)));
    }),
    (t.prototype._pointerUp = function (t) {
      t.preventManipulation && t.preventManipulation(),
        this._panning
          ? (this._endPoint &&
              this._pannedChart(
                this._endPoint.x - this._startPointers[0].x,
                this._endPoint.y - this._startPointers[0].y
              ),
            this._reset())
          : this._scaling && (this._scaledChart(t), this._reset());
    }),
    (t.prototype._onTouchStart = function (t) {
      if (this._enable)
        return (
          this._disabledOthersInteraction(!0),
          1 == t.touches.length
            ? ((this._scaling = !1),
              (this._panning = !0),
              (this._startFirstPt = this._getPoint(t)))
            : 2 == t.touches.length &&
              ((this._pinchStartEvents = this._getTouchPair(t)),
              (this._startDistance = this._touchDistance(t)),
              (this._panning = !1),
              (this._scaling = !0)),
          this._seriesGroup &&
            this._seriesGroup.setAttribute(
              'clip-path',
              'url(#' + this._chart._plotrectId + ')'
            ),
          this._chart._hideToolTip(),
          !0
        );
    }),
    (t.prototype._onTouchMove = function (t) {
      if (this._enable) {
        var e,
          i,
          s,
          n,
          o,
          a = {},
          r = {},
          h = t.touches[0],
          _ = new wjcCore.Point(h.pageX, h.pageY);
        if ((t.preventDefault(), this._panning)) {
          if (this._startFirstPt) {
            if (!this._pointInPlotArea(_)) return;
            (this._endPoint = new wjcCore.Point(h.pageX, h.pageY)),
              this._panningChart(
                this._endPoint.x - this._startFirstPt.x,
                this._endPoint.y - this._startFirstPt.y
              );
          }
        } else
          this._scaling &&
            ((s = this._touchDistance(t)),
            (n = this._getTouchPair(t)[0]),
            (o = this._pinchStartEvents[0]),
            Math.abs(this._startDistance.x) > this._threadHold &&
              this._interactiveAxes !== InteractiveAxes.Y &&
              ((e = n.pageX - this._plotOffset.left),
              (i = o.pageX - this._plotOffset.left),
              (a.x = Math.abs(s.x / this._startDistance.x)),
              (r.x = e - a.x * i),
              (this._clip.x = (this._plotBox.x - e) / a.x + i),
              (this._selection.w = this._plotBox.width / a.x)),
            Math.abs(this._startDistance.y) > this._threadHold &&
              this._interactiveAxes !== InteractiveAxes.X &&
              ((e = n.pageY - this._plotOffset.top),
              (i = o.pageY - this._plotOffset.top),
              (a.y = Math.abs(s.y / this._startDistance.y)),
              (r.y = e - a.y * i),
              (this._clip.y = (this._plotBox.y - e) / a.y + i),
              (this._selection.h = this._plotBox.height / a.y)),
            this._scalingChart(a, r));
        return !0;
      }
    }),
    (t.prototype._onTouchEnd = function (t) {
      if (this._enable) {
        var e = this._endPoint;
        if (this._panning) {
          if (!this._startFirstPt || !e) return void this._reset();
          this._pannedChart(
            e.x - this._startFirstPt.x,
            e.y - this._startFirstPt.y
          );
        } else this._scaling && this._scaledChart(t);
        return this._reset(), this._disabledOthersInteraction(!1), !0;
      }
    }),
    (t.prototype._initOverlay = function () {
      switch (
        ((this._zoomEle.style.visibility = 'visible'), this._interactiveAxes)
      ) {
        case InteractiveAxes.X:
          (this._overlayEle.style.left =
            this._startFirstPt.x - this._zoomEleOffset.left + 'px'),
            (this._overlayEle.style.top =
              this._plotOffset.top - this._zoomEleOffset.top + 'px');
          break;
        case InteractiveAxes.Y:
          (this._overlayEle.style.left = this._plotBox.x + 'px'),
            (this._overlayEle.style.top =
              this._startFirstPt.y - this._zoomEleOffset.top + 'px');
          break;
        case InteractiveAxes.XY:
          (this._overlayEle.style.left =
            this._startFirstPt.x - this._zoomEleOffset.left + 'px'),
            (this._overlayEle.style.top =
              this._startFirstPt.y - this._zoomEleOffset.top + 'px');
      }
    }),
    (t.prototype._updateOverLay = function (t) {
      var e = this._startFirstPt.x - t.x,
        i = this._startFirstPt.y - t.y,
        s = {};
      switch (this._interactiveAxes) {
        case InteractiveAxes.X:
          if (Math.abs(e) < this._threadHold) return;
          s =
            e <= 0
              ? {
                  width: Math.abs(e) + 'px',
                  height: this._plotBox.height + 'px',
                }
              : {
                  left: t.x - this._zoomEleOffset.left + 'px',
                  width: e + 'px',
                  height: this._plotBox.height + 'px',
                };
          break;
        case InteractiveAxes.Y:
          if (Math.abs(i) < this._threadHold) return;
          s =
            i <= 0
              ? {
                  height: Math.abs(i) + 'px',
                  width: this._plotBox.width + 'px',
                }
              : {
                  top: t.y - this._zoomEleOffset.top + 'px',
                  height: i + 'px',
                  width: this._plotBox.width + 'px',
                };
          break;
        case InteractiveAxes.XY:
          Math.abs(e) >= this._threadHold &&
            ((s.width = Math.abs(e) + 'px'),
            e > 0 && (s.left = t.x - this._zoomEleOffset.left + 'px')),
            Math.abs(i) >= this._threadHold &&
              ((s.height = Math.abs(i) + 'px'),
              i > 0 && (s.top = t.y - this._zoomEleOffset.top + 'px'));
      }
      wjcCore.setCss(this._overlayEle, s);
    }),
    (t.prototype._updatePoint = function (t) {
      var e = this._plotOffset;
      t.x < e.left && (t.x = e.left),
        t.x > e.left + e.width && (t.x = e.left + e.width),
        t.y < e.top && (t.y = e.top),
        t.y > e.top + e.height && (t.y = e.top + e.height);
    }),
    (t.prototype._pointInPlotArea = function (t) {
      var e = this._plotOffset;
      return (
        t.x >= e.left &&
        t.x <= e.left + e.width &&
        t.y >= e.top &&
        t.y <= e.top + e.height
      );
    }),
    (t.prototype._zoomedChart = function (t) {
      t &&
        ((this._interactiveAxes !== InteractiveAxes.X &&
          this._interactiveAxes !== InteractiveAxes.XY) ||
          this._zoomedAxis(t, !0),
        (this._interactiveAxes !== InteractiveAxes.Y &&
          this._interactiveAxes !== InteractiveAxes.XY) ||
          this._zoomedAxis(t, !1),
        (this._startFirstPt = null));
    }),
    (t.prototype._zoomedAxis = function (t, e) {
      var i,
        s,
        n = e ? this._chart.axisX : this._chart.axisY,
        o = e ? 'x' : 'y',
        a = e ? 'left' : 'top';
      t &&
        Math.abs(this._startFirstPt[o] - t[o]) > this._threadHold &&
        ((i = n.convertBack(
          this._startFirstPt[o] - this._plotOffset[a] + this._plotBox[o]
        )),
        (s = n.convertBack(t[o] - this._plotOffset[a] + this._plotBox[o])) -
          i !=
          0 && this._updateAxisRange(n, Math.min(i, s), Math.max(i, s)));
    }),
    (t.prototype._panningChart = function (t, e) {
      var i = this._chart.axisX,
        s = this._chart.axisY,
        n = this._getTransFormGroups();
      (t = Math.abs(t) < this._threadHold ? 0 : t),
        (e = Math.abs(e) < this._threadHold ? 0 : e),
        this._interactiveAxes === InteractiveAxes.X && (e = 0),
        this._interactiveAxes === InteractiveAxes.Y && (t = 0),
        t > 0 && i.actualMin.valueOf() === this._minX && (t = 0),
        t < 0 && i.actualMax.valueOf() === this._maxX && (t = 0),
        e > 0 && s.actualMax.valueOf() === this._maxY && (e = 0),
        e < 0 && s.actualMin.valueOf() === this._minY && (e = 0);
      for (var o = 0; o < n.length; o++)
        n[o].setAttribute('transform', 'translate(' + t + ',' + e + ')');
    }),
    (t.prototype._pannedChart = function (t, e) {
      (this._interactiveAxes !== InteractiveAxes.X &&
        this._interactiveAxes !== InteractiveAxes.XY) ||
        this._updateAxisByDistance(!0, t),
        (this._interactiveAxes !== InteractiveAxes.Y &&
          this._interactiveAxes !== InteractiveAxes.XY) ||
          this._updateAxisByDistance(!1, -e);
    }),
    (t.prototype._scalingChart = function (t, e) {
      var i,
        s,
        n,
        o = this._chart.axisX,
        a = this._chart.axisY,
        r = void 0 !== e.x ? e.x : 0,
        h = void 0 !== e.y ? e.y : 0;
      if (t) {
        (i = this._getTransFormGroups()),
          void 0 !== t.x &&
            t.x < 1 &&
            o.actualMin.valueOf() === this._minX &&
            o.actualMax.valueOf() === this._maxX &&
            ((t.x = 1), (r = 0)),
          void 0 !== t.y &&
            t.y < 1 &&
            a.actualMin.valueOf() === this._minY &&
            a.actualMax.valueOf() === this._maxY &&
            ((t.y = 1), (h = 0)),
          (s = void 0 !== t.x ? t.x : 1),
          (n = void 0 !== t.y ? t.y : 1);
        for (var _ = 0; _ < i.length; _++)
          i[_].setAttribute(
            'transform',
            'translate(' + r + ', ' + h + ') scale(' + s + ', ' + n + ')'
          );
      }
    }),
    (t.prototype._scaledChart = function (t) {
      var e,
        i,
        s = this._chart,
        n = s.axisX,
        o = s.axisY;
      this._clip &&
        (this._interactiveAxes !== InteractiveAxes.Y &&
          void 0 !== this._clip.x &&
          (e = Math.max(this._minX, n.convertBack(this._clip.x))) -
            (i = Math.min(
              this._maxX,
              n.convertBack(this._clip.x + this._selection.w)
            )) !=
            0 &&
          this._updateAxisRange(n, e, i),
        this._interactiveAxes !== InteractiveAxes.X &&
          void 0 !== this._clip.y &&
          ((i = Math.min(this._maxY, o.convertBack(this._clip.y))),
          (e = Math.max(
            this._minY,
            o.convertBack(this._clip.y + this._selection.h)
          )) -
            i !=
            0 && this._updateAxisRange(o, e, i)));
    }),
    (t.prototype._updateAxisByDistance = function (t, e) {
      var i,
        s = t ? this._chart.axisX : this._chart.axisY,
        n = t ? this._minX : this._minY,
        o = t ? this._maxX : this._maxY,
        a = s.actualMin.valueOf(),
        r = s.actualMax.valueOf();
      if (0 !== e) {
        if ((e > 0 && n === a) || (e < 0 && o === r))
          return (this._innerUpdating = !0), void this._chart.invalidate();
        (i = e / (t ? this._plotBox.width : this._plotBox.height)),
          this._updateAxisByChg(t, -i, -i);
      }
    }),
    (t.prototype._updateAxisByChg = function (t, e, i) {
      var s,
        n,
        o = t ? this._chart.axisX : this._chart.axisY,
        a = t ? this._minX : this._minY,
        r = t ? this._maxX : this._maxY,
        h = o.actualMin.valueOf(),
        _ = (o.actualMax.valueOf(), this._chart._plotRect),
        l = t ? _.left : _.top,
        c = t ? _.width : _.height,
        p = t ? this._minXRange : this._minYRange;
      isNaN(e) ||
        isNaN(i) ||
        (this._panning
          ? e < 0
            ? (s = t
                ? o.convertBack(l + e * c)
                : o.convertBack(l + c - e * c)) < a
              ? ((s = a),
                (n = t
                  ? o.convertBack(o.convert(s) + c)
                  : o.convertBack(o.convert(s) - c)))
              : (n = t
                  ? o.convertBack(l + c + i * c)
                  : o.convertBack(l - i * c))
            : (n = t
                ? o.convertBack(l + c + i * c)
                : o.convertBack(l - i * c)) > r
            ? ((n = r),
              (s = t
                ? o.convertBack(o.convert(n) - c)
                : o.convertBack(o.convert(n) + c)))
            : (s = t ? o.convertBack(l + e * c) : o.convertBack(l + c - e * c))
          : this._scaling &&
            ((s = t ? o.convertBack(l + e * c) : o.convertBack(l + c - e * c)),
            (n = t ? o.convertBack(l + c + i * c) : o.convertBack(l - i * c)),
            s < a && (s = a),
            n > r && (n = r),
            n - s < p && (s = n - p)),
        this._updateAxisRange(o, s, n));
    }),
    (t.prototype._initAxisRangeWithPosAndScale = function (t) {
      var e, i, s, n;
      t
        ? ((i = (e = this._maxX - this._minX) * this._scaleX),
          (n = (s = this._minX + this._posX * (e - i)) + i),
          (this._innerUpdating = !0),
          (this._chart.axisX.min = s),
          (this._chart.axisX.max = n),
          (this._lastMinX = s),
          (this._lastMaxX = n))
        : ((i = (e = this._maxY - this._minY) * this._scaleY),
          (n = (s = this._minY + this._posY * (e - i)) + i),
          (this._innerUpdating = !0),
          (this._chart.axisY.min = s),
          (this._chart.axisY.max = n),
          (this._lastMinY = s),
          (this._lastMaxY = n));
    }),
    (t.prototype._updateAxisRange = function (t, e, i) {
      this._chart.beginUpdate(),
        (t.min = e),
        (t.max = i),
        t === this._chart.axisX
          ? ((this._lastMinX = e), (this._lastMaxX = i))
          : ((this._lastMinY = e), (this._lastMaxY = i)),
        (this._innerUpdating = !0),
        this._chart.endUpdate();
    }),
    (t.prototype._reset = function () {
      (this._scaling = !1),
        (this._panning = !1),
        (this._startDistance = 0),
        (this._startFirstPt = null),
        (this._pinchStartEvents = []),
        (this._startPointers = []),
        (this._mvPointers = []),
        (this._endPoint = null),
        (this._clip = {}),
        (this._selection = {});
    }),
    (t.prototype._getAxisMin = function (t) {
      return wjcCore.isDate(t.actualMin) ? t.actualMin.valueOf() : t.actualMin;
    }),
    (t.prototype._getAxisMax = function (t) {
      return wjcCore.isDate(t.actualMax) ? t.actualMax.valueOf() : t.actualMax;
    }),
    (t.prototype._getTransFormGroups = function () {
      var t = this._seriesGroup.querySelectorAll('g[clip-path]');
      return 0 === t.length && (t = this._seriesGroup.querySelectorAll('g')), t;
    }),
    (t.prototype._disabledOthersInteraction = function (e) {
      var i = this._chart.hostElement;
      if (null !== i && void 0 !== i)
        for (
          var s = i.querySelectorAll('.wj-chart-linemarker-container'), n = 0;
          n < s.length;
          n++
        )
          e
            ? wjcCore.addClass(s[n], t._CSS_BLOCK_INTERACTION)
            : wjcCore.removeClass(s[n], t._CSS_BLOCK_INTERACTION);
    }),
    (t.prototype._getPoint = function (t) {
      return t instanceof MouseEvent
        ? new wjcCore.Point(t.pageX, t.pageY)
        : new wjcCore.Point(
            t.changedTouches[0].pageX,
            t.changedTouches[0].pageY
          );
    }),
    (t.prototype._getTouchPair = function (t) {
      var e = [];
      return (
        wjcCore.isArray(t)
          ? ((e[0] = t[0]), (e[1] = t[1]))
          : 'touchend' === t.type
          ? 1 === t.touches.length
            ? ((e[0] = t.touches[0]), (e[1] = t.changedTouches[0]))
            : 0 === t.touches.length &&
              ((e[0] = t.changedTouches[0]), (e[1] = t.changedTouches[1]))
          : ((e[0] = t.touches[0]), (e[1] = t.touches[1])),
        e
      );
    }),
    (t.prototype._touchDistance = function (t) {
      var e = this._getTouchPair(t),
        i = 0,
        s = 0;
      return (
        e[0] &&
          void 0 !== e[0].pageX &&
          e[1] &&
          void 0 !== e[1].pageX &&
          (i = e[0].pageX - e[1].pageX),
        e[0] &&
          void 0 !== e[0].pageY &&
          e[1] &&
          void 0 !== e[1].pageY &&
          (s = e[0].pageY - e[1].pageY),
        { x: i, y: s }
      );
    }),
    (t._CSS_ZOOM = 'wj-zoom'),
    (t._CSS_ZOOM_OVERLAY = 'wj-zoom-overlay'),
    (t._CSS_PANABLE = 'wj-panable'),
    (t._CSS_TOUCH_DISABLED = 'wj-flexchart-touch-disabled'),
    (t._CSS_BLOCK_INTERACTION = 'wj-block-other-interaction'),
    t
  );
})();
exports.ChartGestures = ChartGestures;
