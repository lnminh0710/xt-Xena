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
      function n() {
        this.constructor = e;
      }
      t(e, i),
        (e.prototype =
          null === i
            ? Object.create(i)
            : ((n.prototype = i.prototype), new n()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.gauge');
(window.wijmo = window.wijmo || {}), (window.wijmo.gauge = wjcSelf);
var ShowText;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Value = 1)] = 'Value'),
    (t[(t.MinMax = 2)] = 'MinMax'),
    (t[(t.All = 3)] = 'All');
})((ShowText = exports.ShowText || (exports.ShowText = {})));
var Gauge = (function (t) {
  function e(i, n) {
    var r = t.call(this, i, null, !0) || this;
    (r._ranges = new wjcCore.ObservableArray()),
      (r._rngElements = []),
      (r._format = 'n0'),
      (r._showRanges = !0),
      (r._shadow = !0),
      (r._animated = !0),
      (r._readOnly = !0),
      (r._step = 1),
      (r._showText = ShowText.None),
      (r._showTicks = !1),
      (r._thickness = 0.8),
      (r._initialized = !1),
      (r.valueChanged = new wjcCore.Event()),
      (r._getPercent = function (t) {
        var e =
          this.max > this.min ? (t - this.min) / (this.max - this.min) : 0;
        return Math.max(0, Math.min(1, e));
      }),
      e._ctr++;
    var o = r.hostElement;
    wjcCore.setAttribute(o, 'role', 'slider', !0);
    var s = r.getTemplate();
    return (
      r.applyTemplate('wj-control wj-gauge', s, {
        _dSvg: 'dsvg',
        _svg: 'svg',
        _filter: 'filter',
        _gFace: 'gface',
        _gRanges: 'granges',
        _gPointer: 'gpointer',
        _gCover: 'gcover',
        _pFace: 'pface',
        _pPointer: 'ppointer',
        _cValue: 'cvalue',
        _tValue: 'value',
        _tMin: 'min',
        _tMax: 'max',
        _pTicks: 'pticks',
      }),
      (r._filterID = 'wj-gauge-filter-' + e._ctr.toString(36)),
      r._filter.setAttribute('id', r._filterID),
      (r.face = new Range()),
      (r.pointer = new Range()),
      r._ranges.collectionChanged.addHandler(function () {
        for (var t = r._ranges, e = 0; e < t.length; e++)
          if (!wjcCore.tryCast(t[e], Range))
            throw 'ranges array must contain Range objects.';
        (r._rangesDirty = !0), r.invalidate();
      }),
      r.addEventListener(o, 'keydown', r._keydown.bind(r)),
      r.addEventListener(o, 'click', function (t) {
        0 == t.button && (r.focus(), r._applyMouseValue(t));
      }),
      r.addEventListener(o, 'mousedown', function (t) {
        0 == t.button && (r.focus(), (r._dragging = !0), r._applyMouseValue(t));
      }),
      r.addEventListener(o, 'mousemove', function (t) {
        r._dragging && r.containsFocus() && r._applyMouseValue(t, !0);
      }),
      r.addEventListener(o, 'mouseup', function (t) {
        r._dragging = !1;
      }),
      r.addEventListener(o, 'mouseleave', function (t) {
        t.target == o && (r._dragging = !1);
      }),
      'ontouchstart' in window &&
        (r.addEventListener(o, 'touchstart', function (t) {
          r.focus(),
            !t.defaultPrevented &&
              r._applyMouseValue(t, !0) &&
              t.preventDefault();
        }),
        r.addEventListener(o, 'touchmove', function (t) {
          !t.defaultPrevented &&
            r._applyMouseValue(t, !0) &&
            t.preventDefault();
        })),
      r.addEventListener(o, 'wheel', function (t) {
        if (
          !t.defaultPrevented &&
          !r.isReadOnly &&
          r.containsFocus() &&
          null != r.value &&
          r.hitTest(t)
        ) {
          var e = wjcCore.clamp(-t.deltaY, -1, 1);
          (r.value = wjcCore.clamp(r.value + (r.step || 1) * e, r.min, r.max)),
            t.preventDefault();
        }
      }),
      r.initialize(n),
      r.invalidate(),
      r
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'value', {
      get: function () {
        return this._pointer.max;
      },
      set: function (t) {
        t != this.value &&
          ((this._pointer.max = wjcCore.asNumber(t, !0)), this._updateAria());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'min', {
      get: function () {
        return this._face.min;
      },
      set: function (t) {
        t != this.min &&
          ((this._face.min = wjcCore.asNumber(t)), this._updateAria());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'max', {
      get: function () {
        return this._face.max;
      },
      set: function (t) {
        t != this.max &&
          ((this._face.max = wjcCore.asNumber(t)), this._updateAria());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'origin', {
      get: function () {
        return this._origin;
      },
      set: function (t) {
        t != this._origin &&
          ((this._origin = wjcCore.asNumber(t, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isReadOnly', {
      get: function () {
        return this._readOnly;
      },
      set: function (t) {
        (this._readOnly = wjcCore.asBoolean(t)),
          this._setAttribute(
            this._svg,
            'cursor',
            this._readOnly ? null : 'pointer'
          ),
          wjcCore.toggleClass(
            this.hostElement,
            'wj-state-readonly',
            this.isReadOnly
          );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'step', {
      get: function () {
        return this._step;
      },
      set: function (t) {
        t != this._step &&
          ((this._step = wjcCore.asNumber(t, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'format', {
      get: function () {
        return this._format;
      },
      set: function (t) {
        t != this._format &&
          ((this._format = wjcCore.asString(t)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'getText', {
      get: function () {
        return this._getText;
      },
      set: function (t) {
        t != this._getText &&
          ((this._getText = wjcCore.asFunction(t)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'thickness', {
      get: function () {
        return this._thickness;
      },
      set: function (t) {
        t != this._thickness &&
          ((this._thickness = wjcCore.clamp(wjcCore.asNumber(t, !1), 0, 1)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'face', {
      get: function () {
        return this._face;
      },
      set: function (t) {
        t != this._face &&
          (this._face &&
            this._face.propertyChanged.removeHandler(this._rangeChanged),
          (this._face = wjcCore.asType(t, Range)),
          this._face &&
            this._face.propertyChanged.addHandler(this._rangeChanged, this),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'pointer', {
      get: function () {
        return this._pointer;
      },
      set: function (t) {
        if (t != this._pointer) {
          var e = null;
          this._pointer &&
            ((e = this.value),
            this._pointer.propertyChanged.removeHandler(this._rangeChanged)),
            (this._pointer = wjcCore.asType(t, Range)),
            this._pointer &&
              (e && (this.value = e),
              this._pointer.propertyChanged.addHandler(
                this._rangeChanged,
                this
              )),
            this.invalidate();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showText', {
      get: function () {
        return this._showText;
      },
      set: function (t) {
        t != this._showText &&
          ((this._showText = wjcCore.asEnum(t, ShowText)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showTicks', {
      get: function () {
        return this._showTicks;
      },
      set: function (t) {
        t != this._showTicks &&
          ((this._showTicks = wjcCore.asBoolean(t)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'tickSpacing', {
      get: function () {
        return this._tickSpacing;
      },
      set: function (t) {
        t != this._tickSpacing &&
          ((this._tickSpacing = wjcCore.asNumber(t, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'thumbSize', {
      get: function () {
        return this._thumbSize;
      },
      set: function (t) {
        t != this._thumbSize &&
          ((this._thumbSize = wjcCore.asNumber(t, !0, !0)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'showRanges', {
      get: function () {
        return this._showRanges;
      },
      set: function (t) {
        t != this._showRanges &&
          ((this._showRanges = wjcCore.asBoolean(t)),
          (this._animColor = null),
          (this._rangesDirty = !0),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'hasShadow', {
      get: function () {
        return this._shadow;
      },
      set: function (t) {
        t != this._shadow &&
          ((this._shadow = wjcCore.asBoolean(t)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isAnimated', {
      get: function () {
        return this._animated;
      },
      set: function (t) {
        this._animated = wjcCore.asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'ranges', {
      get: function () {
        return this._ranges;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onValueChanged = function (t) {
      this.valueChanged.raise(this, t);
    }),
    (e.prototype.refresh = function (e) {
      if (
        (void 0 === e && (e = !0),
        t.prototype.refresh.call(this, e),
        this._rangesDirty)
      ) {
        this._rangesDirty = !1;
        for (var i = this._gRanges, n = 0; n < this._rngElements.length; n++)
          this._rngElements[n].rng.propertyChanged.removeHandler(
            this._rangeChanged
          );
        for (; i.lastChild; ) i.removeChild(i.lastChild);
        if (((this._rngElements = []), this._showRanges))
          for (n = 0; n < this.ranges.length; n++) {
            var r = this.ranges[n];
            r.propertyChanged.addHandler(this._rangeChanged, this),
              this._rngElements.push({
                rng: r,
                el: this._createElement('path', i),
              });
          }
      }
      this._showElement(this._tValue, 0 != (this.showText & ShowText.Value)),
        this._showElement(this._tMin, 0 != (this.showText & ShowText.MinMax)),
        this._showElement(this._tMax, 0 != (this.showText & ShowText.MinMax)),
        this._showElement(
          this._cValue,
          0 != (this.showText & ShowText.Value) || this._thumbSize > 0
        ),
        this._updateText();
      var o = this._getFilterUrl();
      this._setAttribute(this._pFace, 'filter', o),
        this._setAttribute(this._pPointer, 'filter', o),
        this._updateRange(this._face),
        this._updateRange(this._pointer),
        this._updateTicks();
      for (n = 0; n < this.ranges.length; n++)
        this._updateRange(this.ranges[n]);
      this._initialized = !0;
    }),
    (e.prototype.hitTest = function (t, e) {
      wjcCore.isNumber(t) && wjcCore.isNumber(e)
        ? (t = new wjcCore.Point(t, e))
        : t instanceof wjcCore.Point || (t = wjcCore.mouseToPage(t)),
        (t = wjcCore.asType(t, wjcCore.Point));
      var i = wjcCore.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());
      return (
        (t.x -= i.left + pageXOffset),
        (t.y -= i.top + pageYOffset),
        this._getValueFromPoint(t)
      );
    }),
    (e._getBBox = function (t) {
      try {
        return t.getBBox();
      } catch (t) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }
    }),
    (e.prototype._getFilterUrl = function () {
      return this.hasShadow ? 'url(#' + this._filterID + ')' : null;
    }),
    (e.prototype._getRangeElement = function (t) {
      if (t == this._face) return this._pFace;
      if (t == this._pointer) return this._pPointer;
      for (var e = 0; e < this._rngElements.length; e++) {
        var i = this._rngElements[e];
        if (i.rng == t) return i.el;
      }
      return null;
    }),
    (e.prototype._rangeChanged = function (t, e) {
      var i = this;
      if (
        (t == this._pointer &&
          'max' == e.propertyName &&
          (this.onValueChanged(), this._updateText()),
        t != this._face)
      )
        if (
          t == this._pointer &&
          'max' == e.propertyName &&
          (this._animInterval && clearInterval(this._animInterval),
          this.isAnimated && !this.isUpdating && this._initialized)
        ) {
          var n = this._getPointerColor(e.oldValue),
            r = this._getPointerColor(e.newValue),
            o = n ? new wjcCore.Color(n) : null,
            s = r ? new wjcCore.Color(r) : null;
          this._animInterval = wjcCore.animate(function (n) {
            (i._animColor =
              o && s ? wjcCore.Color.interpolate(o, s, n).toString() : null),
              i._updateRange(t, e.oldValue + n * (e.newValue - e.oldValue)),
              n >= 1 &&
                ((i._animColor = null),
                (i._animInterval = null),
                i._updateRange(t),
                i._updateText());
          });
        } else this._updateRange(t);
      else this.invalidate();
    }),
    (e.prototype._createElement = function (t, i, n) {
      var r = document.createElementNS(e._SVGNS, t);
      return n && r.setAttribute('class', n), i.appendChild(r), r;
    }),
    (e.prototype._centerText = function (t, i, n) {
      if ('none' != t.getAttribute('display')) {
        var r = wjcCore.Globalize.format(i, this.format);
        if (wjcCore.isFunction(this.getText)) {
          var o =
            t == this._tValue
              ? 'value'
              : t == this._tMin
              ? 'min'
              : t == this._tMax
              ? 'max'
              : null;
          wjcCore.assert(null != o, 'unknown element'),
            (r = this.getText(this, o, i, r));
        }
        t.textContent = r;
        var s = wjcCore.Rect.fromBoundingRect(e._getBBox(t)),
          a = n.x - s.width / 2,
          h = n.y + s.height / 4;
        t.setAttribute('x', this._fix(a)), t.setAttribute('y', this._fix(h));
      }
    }),
    (e.prototype._copy = function (t, e) {
      if ('ranges' == t) {
        for (var i = wjcCore.asArray(e), n = 0; n < i.length; n++) {
          var r = new Range();
          wjcCore.copy(r, i[n]), this.ranges.push(r);
        }
        return !0;
      }
      return 'pointer' == t && (wjcCore.copy(this.pointer, e), !0);
    }),
    (e.prototype._showElement = function (t, e) {
      this._setAttribute(t, 'display', e ? '' : 'none');
    }),
    (e.prototype._setAttribute = function (t, e, i) {
      i ? t.setAttribute(e, i) : t.removeAttribute(e);
    }),
    (e.prototype._updateRange = function (t, e) {
      void 0 === e && (e = t.max),
        t == this._pointer &&
          (t.min =
            null != this.origin
              ? this.origin
              : this.min < 0 && this.max > 0
              ? 0
              : this.min);
      var i = this._getRangeElement(t);
      if (i) {
        this._updateRangeElement(i, t, e);
        var n = t.color;
        t == this._pointer &&
          (n = this._animColor
            ? this._animColor
            : this._getPointerColor(t.max)),
          this._setAttribute(i, 'style', n ? 'fill:' + n : null);
      }
    }),
    (e.prototype._getPointerColor = function (t) {
      if (!this._showRanges) {
        for (var e, i = 0; i < this._ranges.length; i++) {
          var n = this._ranges[i];
          if (t >= n.min && t <= n.max) {
            e = n;
            break;
          }
        }
        if (e) return e.color;
      }
      return this._pointer.color;
    }),
    (e.prototype._keydown = function (t) {
      if (!this._readOnly && this._step) {
        var e = !0;
        switch (this._getKey(t.keyCode)) {
          case wjcCore.Key.Left:
          case wjcCore.Key.Down:
            this.value = wjcCore.clamp(
              this.value - this.step,
              this.min,
              this.max
            );
            break;
          case wjcCore.Key.Right:
          case wjcCore.Key.Up:
            this.value = wjcCore.clamp(
              this.value + this.step,
              this.min,
              this.max
            );
            break;
          case wjcCore.Key.Home:
            this.value = this.min;
            break;
          case wjcCore.Key.End:
            this.value = this.max;
            break;
          default:
            e = !1;
        }
        e && t.preventDefault();
      }
    }),
    (e.prototype._getKey = function (t) {
      return t;
    }),
    (e.prototype._applyMouseValue = function (t, e) {
      if (!this.isReadOnly && this.containsFocus()) {
        var i = this.hitTest(t);
        if (null != i) {
          var n = this._animated;
          return (
            e && (this._animated = !1),
            null != this._step && (i = Math.round(i / this._step) * this._step),
            (this.value = wjcCore.clamp(i, this.min, this.max)),
            (this._animated = n),
            !0
          );
        }
      }
      return !1;
    }),
    (e.prototype._updateRangeElement = function (t, e, i) {
      wjcCore.assert(!1, 'Gauge is an abstract class.');
    }),
    (e.prototype._updateText = function () {
      wjcCore.assert(!1, 'Gauge is an abstract class.');
    }),
    (e.prototype._updateTicks = function () {
      wjcCore.assert(!1, 'Gauge is an abstract class.');
    }),
    (e.prototype._getValueFromPoint = function (t) {
      return null;
    }),
    (e.prototype._fix = function (t) {
      return wjcCore.isNumber(t)
        ? parseFloat(t.toFixed(4)).toString()
        : this._fix(t.x) + ' ' + this._fix(t.y);
    }),
    (e.prototype._updateAria = function () {
      var t = this.hostElement;
      t &&
        (wjcCore.setAttribute(t, 'aria-valuemin', this.min),
        wjcCore.setAttribute(t, 'aria-valuemax', this.max),
        wjcCore.setAttribute(t, 'aria-valuenow', this.value));
    }),
    (e._SVGNS = 'http://www.w3.org/2000/svg'),
    (e._ctr = 0),
    (e.controlTemplate =
      '<div wj-part="dsvg" style="width:100%;height:100%"><svg wj-part="svg" width="100%" height="100%" style="overflow:visible"><defs><filter wj-part="filter"><feOffset dx="3" dy="3"></feOffset><feGaussianBlur result="offset-blur" stdDeviation="5"></feGaussianBlur><feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"></feComposite><feFlood flood-color="black" flood-opacity="0.2" result="color"></feFlood><feComposite operator="in" in="color" in2="inverse" result="shadow"></feComposite><feComposite operator="over" in="shadow" in2="SourceGraphic"></feComposite></filter></defs><g wj-part="gface" class="wj-face" style="cursor:inherit"><path wj-part="pface"/></g><g wj-part="granges" class="wj-ranges" style="cursor:inherit"/><g wj-part="gpointer" class="wj-pointer" style="cursor:inherit"><path wj-part="ppointer"/></g><g wj-part="gcover" class="wj-cover" style="cursor:inherit"><path wj-part="pticks" class="wj-ticks"/><circle wj-part="cvalue" class="wj-pointer wj-thumb"/><text wj-part="value" class="wj-value"/><text wj-part="min" class="wj-min" aria-hidden="true"/><text wj-part="max" class="wj-max" aria-hidden="true"/></g></svg></div>'),
    e
  );
})(wjcCore.Control);
exports.Gauge = Gauge;
var GaugeDirection;
!(function (t) {
  (t[(t.Right = 0)] = 'Right'),
    (t[(t.Left = 1)] = 'Left'),
    (t[(t.Up = 2)] = 'Up'),
    (t[(t.Down = 3)] = 'Down');
})((GaugeDirection = exports.GaugeDirection || (exports.GaugeDirection = {})));
var LinearGauge = (function (t) {
  function e(e, i) {
    var n = t.call(this, e, null) || this;
    return (
      (n._direction = GaugeDirection.Right),
      wjcCore.addClass(n.hostElement, 'wj-lineargauge'),
      n.initialize(i),
      n
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'direction', {
      get: function () {
        return this._direction;
      },
      set: function (t) {
        t != this._direction &&
          ((this._direction = wjcCore.asEnum(t, GaugeDirection)),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._updateRangeElement = function (t, e, i) {
      var n = this._getRangeRect(e, i);
      this._updateSegment(t, n);
      var r = e == this._pointer && 0 != (this.showText & ShowText.Value),
        o = r || (e == this._pointer && this.thumbSize > 0),
        s = n.left + n.width / 2,
        a = n.top + n.height / 2;
      switch (this._getDirection()) {
        case GaugeDirection.Right:
          s = n.right;
          break;
        case GaugeDirection.Left:
          s = n.left;
          break;
        case GaugeDirection.Up:
          a = n.top;
          break;
        case GaugeDirection.Down:
          a = n.bottom;
      }
      if (
        (r && this._centerText(this._tValue, i, new wjcCore.Point(s, a)),
        r || o)
      ) {
        n = wjcCore.Rect.fromBoundingRect(Gauge._getBBox(this._tValue));
        var h = this._animColor
            ? this._animColor
            : this._getPointerColor(e.max),
          c =
            null != this.thumbSize
              ? this.thumbSize / 2
              : 0.8 * Math.max(n.width, n.height),
          u = this._cValue;
        this._setAttribute(u, 'cx', this._fix(s)),
          this._setAttribute(u, 'cy', this._fix(a)),
          this._setAttribute(u, 'style', h ? 'fill:' + h : null),
          this._setAttribute(u, 'r', this._fix(c));
      }
    }),
    (e.prototype._updateText = function () {
      var t = this._getRangeRect(this._face);
      switch (this._getDirection()) {
        case GaugeDirection.Right:
          this._setText(this._tMin, this.min, t, 'left'),
            this._setText(this._tMax, this.max, t, 'right');
          break;
        case GaugeDirection.Left:
          this._setText(this._tMin, this.min, t, 'right'),
            this._setText(this._tMax, this.max, t, 'left');
          break;
        case GaugeDirection.Up:
          this._setText(this._tMin, this.min, t, 'bottom'),
            this._setText(this._tMax, this.max, t, 'top');
          break;
        case GaugeDirection.Down:
          this._setText(this._tMin, this.min, t, 'top'),
            this._setText(this._tMax, this.max, t, 'bottom');
      }
    }),
    (e.prototype._updateTicks = function () {
      var t =
          this.tickSpacing && this.tickSpacing > 0
            ? this.tickSpacing
            : this.step,
        e = '';
      if (this.showTicks && t > 0)
        for (
          var i = this._getRangeRect(this._face), n = void 0, r = this.min + t;
          r < this.max;
          r += t
        )
          switch (this._getDirection()) {
            case GaugeDirection.Right:
              e +=
                'M ' +
                (n = this._fix(i.left + i.width * this._getPercent(r))) +
                ' ' +
                this._fix(i.top) +
                ' L ' +
                n +
                ' ' +
                this._fix(i.bottom) +
                ' ';
              break;
            case GaugeDirection.Left:
              e +=
                'M ' +
                (n = this._fix(i.right - i.width * this._getPercent(r))) +
                ' ' +
                i.top.toFixed(2) +
                ' L ' +
                n +
                ' ' +
                i.bottom.toFixed(2) +
                ' ';
              break;
            case GaugeDirection.Up:
              (n = (i.bottom - i.height * this._getPercent(r)).toFixed(2)),
                (e +=
                  'M ' +
                  this._fix(i.left) +
                  ' ' +
                  n +
                  ' L ' +
                  this._fix(i.right) +
                  ' ' +
                  n +
                  ' ');
              break;
            case GaugeDirection.Down:
              (n = (i.top + i.height * this._getPercent(r)).toFixed(2)),
                (e +=
                  'M ' +
                  i.left.toFixed(2) +
                  ' ' +
                  n +
                  ' L ' +
                  i.right.toFixed(2) +
                  ' ' +
                  n +
                  ' ');
          }
      this._pTicks.setAttribute('d', e);
    }),
    (e.prototype._updateSegment = function (t, e) {
      var i = {
          p1: this._fix(new wjcCore.Point(e.left, e.top)),
          p2: this._fix(new wjcCore.Point(e.right, e.top)),
          p3: this._fix(new wjcCore.Point(e.right, e.bottom)),
          p4: this._fix(new wjcCore.Point(e.left, e.bottom)),
        },
        n = wjcCore.format('M {p1} L {p2} L {p3} L {p4} Z', i);
      t.setAttribute('d', n);
    }),
    (e.prototype._setText = function (t, e, i, n) {
      if ('none' != t.getAttribute('display')) {
        var r = wjcCore.Globalize.format(e, this.format);
        if (wjcCore.isFunction(this.getText)) {
          var o =
            t == this._tValue
              ? 'value'
              : t == this._tMin
              ? 'min'
              : t == this._tMax
              ? 'max'
              : null;
          wjcCore.assert(null != o, 'unknown element'),
            (r = this.getText(this, o, e, r));
        }
        t.textContent = r;
        var s = wjcCore.Rect.fromBoundingRect(Gauge._getBBox(t)),
          a = new wjcCore.Point(
            i.left + i.width / 2 - s.width / 2,
            i.top + i.height / 2 + s.height / 2
          );
        switch (n) {
          case 'top':
            a.y = i.top - 4;
            break;
          case 'left':
            a.x = i.left - 4 - s.width;
            break;
          case 'right':
            a.x = i.right + 4;
            break;
          case 'bottom':
            a.y = i.bottom + 4 + s.height;
        }
        t.setAttribute('x', this._fix(a.x)),
          t.setAttribute('y', this._fix(a.y));
      }
    }),
    (e.prototype._getRangeRect = function (t, e) {
      void 0 === e && (e = t.max);
      var i = new wjcCore.Rect(
          0,
          0,
          this.hostElement.clientWidth,
          this.hostElement.clientHeight
        ),
        n = this.thumbSize ? Math.ceil(this.thumbSize / 2) : 0;
      if (this.showText != ShowText.None) {
        var r = parseInt(getComputedStyle(this.hostElement).fontSize);
        isNaN(r) || (n = Math.max(n, 3 * r));
      }
      switch (this._getDirection()) {
        case GaugeDirection.Right:
        case GaugeDirection.Left:
          i = i.inflate(
            -n,
            (-i.height * (1 - this.thickness * t.thickness)) / 2
          );
          break;
        case GaugeDirection.Up:
        case GaugeDirection.Down:
          i = i.inflate(
            (-i.width * (1 - this.thickness * t.thickness)) / 2,
            -n
          );
      }
      var o = t == this._face,
        s = o ? 0 : this._getPercent(t.min),
        a = o ? 1 : this._getPercent(e);
      switch (this._getDirection()) {
        case GaugeDirection.Right:
          (i.left += i.width * s), (i.width *= a - s);
          break;
        case GaugeDirection.Left:
          (i.left = i.right - i.width * a), (i.width = i.width * (a - s));
          break;
        case GaugeDirection.Down:
          (i.top += i.height * s), (i.height *= a - s);
          break;
        case GaugeDirection.Up:
          (i.top = i.bottom - i.height * a), (i.height = i.height * (a - s));
      }
      return i;
    }),
    (e.prototype._getValueFromPoint = function (t) {
      var e = this._getRangeRect(this._face),
        i = 0;
      switch (this._getDirection()) {
        case GaugeDirection.Right:
          i = e.width > 0 ? (t.x - e.left) / e.width : 0;
          break;
        case GaugeDirection.Left:
          i = e.width > 0 ? (e.right - t.x) / e.width : 0;
          break;
        case GaugeDirection.Up:
          i = e.height > 0 ? (e.bottom - t.y) / e.height : 0;
          break;
        case GaugeDirection.Down:
          i = e.height > 0 ? (t.y - e.top) / e.height : 0;
      }
      return this.min + i * (this.max - this.min);
    }),
    (e.prototype._getDirection = function () {
      var t = this._direction;
      if (this.rightToLeft)
        switch (t) {
          case GaugeDirection.Left:
            t = GaugeDirection.Right;
            break;
          case GaugeDirection.Right:
            t = GaugeDirection.Left;
        }
      return t;
    }),
    (e.prototype._getKey = function (t) {
      switch (this._getDirection()) {
        case GaugeDirection.Left:
          switch (t) {
            case wjcCore.Key.Left:
              t = wjcCore.Key.Right;
              break;
            case wjcCore.Key.Right:
              t = wjcCore.Key.Left;
          }
          break;
        case GaugeDirection.Down:
          switch (t) {
            case wjcCore.Key.Up:
              t = wjcCore.Key.Down;
              break;
            case wjcCore.Key.Down:
              t = wjcCore.Key.Up;
          }
      }
      return t;
    }),
    e
  );
})(Gauge);
exports.LinearGauge = LinearGauge;
var RadialGauge = (function (t) {
  function e(e, i) {
    var n = t.call(this, e, null) || this;
    return (
      (n._startAngle = 0),
      (n._sweepAngle = 180),
      (n._autoScale = !0),
      wjcCore.addClass(n.hostElement, 'wj-radialgauge'),
      (n._thickness = 0.4),
      (n.showText = ShowText.All),
      n.initialize(i),
      n
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'startAngle', {
      get: function () {
        return this._startAngle;
      },
      set: function (t) {
        t != this._startAngle &&
          ((this._startAngle = wjcCore.clamp(
            wjcCore.asNumber(t, !1),
            -360,
            360
          )),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'sweepAngle', {
      get: function () {
        return this._sweepAngle;
      },
      set: function (t) {
        t != this._sweepAngle &&
          ((this._sweepAngle = wjcCore.clamp(
            wjcCore.asNumber(t, !1),
            -360,
            360
          )),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'autoScale', {
      get: function () {
        return this._autoScale;
      },
      set: function (t) {
        t != this._autoScale &&
          ((this._autoScale = wjcCore.asBoolean(t)), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'clientSize', {
      get: function () {
        var t = this._rcSvg;
        return t ? new wjcCore.Size(t.width, t.height) : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.refresh = function (e) {
      if (
        (void 0 === e && (e = !0),
        this._setAttribute(this._svg, 'viewBox', null),
        (this._rcSvg = wjcCore.Rect.fromBoundingRect(
          this._dSvg.getBoundingClientRect()
        )),
        t.prototype.refresh.call(this, e),
        (this._ctmInv = null),
        (this._ptSvg = null),
        this._autoScale)
      ) {
        this._setAttribute(this._svg, 'viewBox', '');
        var i = wjcCore.Rect.fromBoundingRect(Gauge._getBBox(this._pFace));
        0 != (this.showText & ShowText.Value) &&
          (i = wjcCore.Rect.union(
            i,
            wjcCore.Rect.fromBoundingRect(Gauge._getBBox(this._tValue))
          )),
          0 != (this.showText & ShowText.MinMax) &&
            ((i = wjcCore.Rect.union(
              i,
              wjcCore.Rect.fromBoundingRect(Gauge._getBBox(this._tMin))
            )),
            (i = wjcCore.Rect.union(
              i,
              wjcCore.Rect.fromBoundingRect(Gauge._getBBox(this._tMax))
            )));
        var n = [
          this._fix(i.left),
          this._fix(i.top),
          this._fix(i.width),
          this._fix(i.height),
        ].join(' ');
        this._setAttribute(this._svg, 'viewBox', n);
        var r = this._pFace.getCTM();
        (this._ctmInv = r ? r.inverse() : null),
          (this._ptSvg = this._svg.createSVGPoint());
      }
    }),
    (e.prototype._updateRangeElement = function (t, e, i) {
      if (this._rcSvg) {
        var n = this._rcSvg,
          r = new wjcCore.Point(n.width / 2, n.height / 2),
          o = Math.min(n.width, n.height) / 2,
          s = o * this.thickness,
          a = s * e.thickness,
          h = o - (s - a) / 2,
          c = h - a,
          u = this.startAngle + 180,
          g = this.sweepAngle,
          l = e == this._face,
          p = l ? 0 : this._getPercent(e.min),
          _ = u + g * p,
          f = g * ((l ? 1 : this._getPercent(i)) - p);
        if (
          (this._updateSegment(t, r, h, c, _, f),
          e == this._pointer && this.thumbSize > 0)
        ) {
          var w = this._animColor
              ? this._animColor
              : this._getPointerColor(e.max),
            d = this._getPoint(r, u + g * this._getPercent(i), (h + c) / 2),
            m = this._cValue;
          this._setAttribute(m, 'cx', this._fix(d.x)),
            this._setAttribute(m, 'cy', this._fix(d.y)),
            this._setAttribute(m, 'style', w ? 'fill:' + w : null),
            this._setAttribute(m, 'r', this._fix(this.thumbSize / 2));
        }
      }
    }),
    (e.prototype._updateText = function () {
      if (this._rcSvg) {
        var t = this._rcSvg,
          e = new wjcCore.Point(t.width / 2, t.height / 2),
          i = Math.min(t.width, t.height) / 2,
          n = Math.max(0, i * (1 - this.thickness)),
          r = this.startAngle + 180,
          o = this.sweepAngle;
        this._showElement(this._cValue, this.thumbSize > 0);
        var s = 0 != (this.showText & ShowText.MinMax) && Math.abs(o) <= 300;
        this._showElement(this._tMin, s),
          this._showElement(this._tMax, s),
          this._centerText(this._tValue, this.value, e);
        var a = 10 * (this.sweepAngle < 0 ? -1 : 1);
        this._centerText(
          this._tMin,
          this.min,
          this._getPoint(e, r - a, (i + n) / 2)
        ),
          this._centerText(
            this._tMax,
            this.max,
            this._getPoint(e, r + o + a, (i + n) / 2)
          );
      }
    }),
    (e.prototype._updateTicks = function () {
      var t =
          this.tickSpacing && this.tickSpacing > 0
            ? this.tickSpacing
            : this.step,
        e = '';
      if (this.showTicks && t > 0)
        for (
          var i = this._rcSvg,
            n = new wjcCore.Point(i.width / 2, i.height / 2),
            r = Math.min(i.width, i.height) / 2,
            o = r * this.thickness,
            s = o * this._face.thickness,
            a = r - (o - s) / 2,
            h = a - s,
            c = this.min + t;
          c < this.max;
          c += t
        ) {
          var u = this.startAngle + 180 + this.sweepAngle * this._getPercent(c);
          e +=
            'M ' +
            this._fix(this._getPoint(n, u, h)) +
            ' L ' +
            this._fix(this._getPoint(n, u, a)) +
            ' ';
        }
      this._pTicks.setAttribute('d', e);
    }),
    (e.prototype._updateSegment = function (t, e, i, n, r, o) {
      o = Math.min(Math.max(o, -359.99), 359.99);
      var s = this._getPoint(e, r, n),
        a = this._getPoint(e, r, i),
        h = this._getPoint(e, r + o, i),
        c = this._getPoint(e, r + o, n),
        u = {
          large: Math.abs(o) > 180 ? 1 : 0,
          cw: o > 0 ? 1 : 0,
          ccw: o > 0 ? 0 : 1,
          or: this._fix(i),
          ir: this._fix(n),
          p1: this._fix(s),
          p2: this._fix(a),
          p3: this._fix(h),
          p4: this._fix(c),
        },
        g = wjcCore.format(
          'M {p1} L {p2} A {or} {or} 0 {large} {cw} {p3} L {p4} A {ir} {ir} 0 {large} {ccw} {p1} Z',
          u
        );
      t.setAttribute('d', g);
    }),
    (e.prototype._getPoint = function (t, e, i) {
      return (
        (e = (e * Math.PI) / 180),
        new wjcCore.Point(t.x + i * Math.cos(e), t.y + i * Math.sin(e))
      );
    }),
    (e.prototype._getValueFromPoint = function (t) {
      if (
        (this.autoScale &&
          this._ctmInv &&
          ((this._ptSvg.x = t.x),
          (this._ptSvg.y = t.y),
          (this._ptSvg = this._ptSvg.matrixTransform(this._ctmInv)),
          (t.x = this._ptSvg.x),
          (t.y = this._ptSvg.y)),
        !this._rcSvg)
      )
        return null;
      var e = this._rcSvg,
        i = new wjcCore.Point(e.width / 2, e.height / 2),
        n = Math.min(e.width, e.height) / 2,
        r = n * (1 - this.thickness),
        o = t.x - i.x,
        s = t.y - i.y,
        a = s * s + o * o;
      if (a > n * n + 16 || a < r * r - 16) return null;
      var h = (180 * (Math.PI - Math.atan2(-s, o))) / Math.PI,
        c = this.startAngle,
        u = this.sweepAngle;
      if (u > 0) {
        for (; h < c; ) h += 360;
        for (; h > c + u; ) h -= 360;
      } else {
        for (; h < c + u; ) h += 360;
        for (; h > c; ) h -= 360;
      }
      var g = Math.abs(h - c) / Math.abs(u);
      return this.min + g * (this.max - this.min);
    }),
    e
  );
})(Gauge);
exports.RadialGauge = RadialGauge;
var BulletGraph = (function (t) {
  function e(e, i) {
    var n = t.call(this, e, null) || this;
    return (
      wjcCore.addClass(n.hostElement, 'wj-bulletgraph'),
      (n._pointer.thickness = 0.35),
      (n._rngTarget = new Range('target')),
      (n._rngTarget.thickness = 0.8),
      (n._rngTarget.color = 'black'),
      (n._rngGood = new Range('good')),
      (n._rngGood.color = 'rgba(0,0,0,.15)'),
      (n._rngBad = new Range('bad')),
      (n._rngBad.color = 'rgba(0,0,0,.3)'),
      n.ranges.push(n._rngBad),
      n.ranges.push(n._rngGood),
      n.ranges.push(n._rngTarget),
      n.initialize(i),
      n
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'target', {
      get: function () {
        return this._rngTarget.max;
      },
      set: function (t) {
        this._rngTarget.max = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'good', {
      get: function () {
        return this._rngGood.max;
      },
      set: function (t) {
        this._rngGood.max = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'bad', {
      get: function () {
        return this._rngBad.max;
      },
      set: function (t) {
        this._rngBad.max = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._getRangeRect = function (e, i) {
      void 0 === i && (i = e.max);
      var n = t.prototype._getRangeRect.call(this, e, i);
      if (e == this._rngTarget)
        switch (this.direction) {
          case GaugeDirection.Right:
            (n.left = n.right - 1), (n.width = 3);
            break;
          case GaugeDirection.Left:
            n.width = 3;
            break;
          case GaugeDirection.Up:
            n.height = 3;
            break;
          case GaugeDirection.Down:
            (n.top = n.bottom - 1), (n.height = 3);
        }
      return n;
    }),
    e
  );
})(LinearGauge);
exports.BulletGraph = BulletGraph;
var Range = (function () {
  function t(t) {
    (this._min = 0),
      (this._max = 100),
      (this._thickness = 1),
      (this.propertyChanged = new wjcCore.Event()),
      (this._name = t);
  }
  return (
    Object.defineProperty(t.prototype, 'min', {
      get: function () {
        return this._min;
      },
      set: function (t) {
        this._setProp('_min', wjcCore.asNumber(t, !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'max', {
      get: function () {
        return this._max;
      },
      set: function (t) {
        this._setProp('_max', wjcCore.asNumber(t, !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'color', {
      get: function () {
        return this._color;
      },
      set: function (t) {
        this._setProp('_color', wjcCore.asString(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'thickness', {
      get: function () {
        return this._thickness;
      },
      set: function (t) {
        this._setProp('_thickness', wjcCore.clamp(wjcCore.asNumber(t), 0, 1));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'name', {
      get: function () {
        return this._name;
      },
      set: function (t) {
        this._setProp('_name', wjcCore.asString(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onPropertyChanged = function (t) {
      this.propertyChanged.raise(this, t);
    }),
    (t.prototype._setProp = function (t, e) {
      var i = this[t];
      if (e != i) {
        this[t] = e;
        var n = new wjcCore.PropertyChangedEventArgs(t.substr(1), i, e);
        this.onPropertyChanged(n);
      }
    }),
    (t._ctr = 0),
    t
  );
})();
exports.Range = Range;
