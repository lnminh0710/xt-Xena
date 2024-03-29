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
        for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
      };
    return function (e, n) {
      function o() {
        this.constructor = e;
      }
      t(e, n),
        (e.prototype =
          null === n
            ? Object.create(n)
            : ((o.prototype = n.prototype), new o()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcChart = require('wijmo/wijmo.chart'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.chart.annotation');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.chart = window.wijmo.chart || {}),
  (window.wijmo.chart.annotation = wjcSelf);
var AnnotationAttachment;
!(function (t) {
  (t[(t.DataIndex = 0)] = 'DataIndex'),
    (t[(t.DataCoordinate = 1)] = 'DataCoordinate'),
    (t[(t.Relative = 2)] = 'Relative'),
    (t[(t.Absolute = 3)] = 'Absolute');
})(
  (AnnotationAttachment =
    exports.AnnotationAttachment || (exports.AnnotationAttachment = {}))
);
var AnnotationPosition;
!(function (t) {
  (t[(t.Center = 0)] = 'Center'),
    (t[(t.Top = 1)] = 'Top'),
    (t[(t.Bottom = 2)] = 'Bottom'),
    (t[(t.Left = 4)] = 'Left'),
    (t[(t.Right = 8)] = 'Right');
})(
  (AnnotationPosition =
    exports.AnnotationPosition || (exports.AnnotationPosition = {}))
);
var AnnotationBase = (function () {
  function t(t) {
    this._resetDefaultValue(), t && this._copy(this, t);
  }
  return (
    Object.defineProperty(t.prototype, 'attachment', {
      get: function () {
        return this._attachment;
      },
      set: function (t) {
        (t = wjcCore.asEnum(t, AnnotationAttachment)) != this._attachment &&
          ((this._attachment = t), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'point', {
      get: function () {
        return this._point;
      },
      set: function (t) {
        null != t.x &&
          null != t.y &&
          ((t.x === this._point.x && t.y === this._point.y) ||
            ((this._point = t), this._repaint()));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'seriesIndex', {
      get: function () {
        return this._seriesIndex;
      },
      set: function (t) {
        (t = wjcCore.asNumber(t, !1, !0)) != this._seriesIndex &&
          ((this._seriesIndex = t), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pointIndex', {
      get: function () {
        return this._pointIndex;
      },
      set: function (t) {
        t !== this._pointIndex &&
          ((this._pointIndex = wjcCore.asNumber(t, !1, !0)), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'position', {
      get: function () {
        return this._position;
      },
      set: function (t) {
        t != this._position && ((this._position = t), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'offset', {
      get: function () {
        return this._offset;
      },
      set: function (t) {
        null != t.x &&
          null != t.y &&
          ((t.x === this._offset.x && t.y === this._offset.y) ||
            ((this._offset = t), this._repaint()));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'style', {
      get: function () {
        return null == this._style && (this._style = {}), this._style;
      },
      set: function (t) {
        t != this._style && ((this._style = t), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isVisible', {
      get: function () {
        return this._isVisible;
      },
      set: function (t) {
        (t = wjcCore.asBoolean(t, !1)) != this._isVisible &&
          ((this._isVisible = t), this._toggleVisibility(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'tooltip', {
      get: function () {
        return this._tooltip;
      },
      set: function (t) {
        this._tooltip = t;
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
    (t.prototype.render = function (e) {
      var n,
        o = this;
      (o._element = e.startGroup(o._getCSSClass())),
        (e.fill = '#88bde6'),
        (e.strokeWidth = 1),
        (e.stroke = '#000000'),
        o._render(e),
        e.endGroup(),
        (o._element[t._DATA_KEY] = this),
        o._isVisible
          ? o._attachment === AnnotationAttachment.DataIndex &&
            (!(n = o._layer._chart.series[o._seriesIndex]) ||
              (n.visibility !== wjcChart.SeriesVisibility.Legend &&
                n.visibility !== wjcChart.SeriesVisibility.Hidden) ||
              o._toggleVisibility(!1))
          : o._toggleVisibility(!1);
    }),
    (t.prototype.destroy = function () {}),
    (t.prototype._copy = function (t, e) {
      for (var n in e) n in t && this._processOptions(n, t, e);
    }),
    (t.prototype._processOptions = function (t, e, n) {
      e[t] = n[t];
    }),
    (t.prototype._resetDefaultValue = function () {
      var t = this;
      (t._attachment = AnnotationAttachment.Absolute),
        (t._point = new wjcChart.DataPoint(0, 0)),
        (t._seriesIndex = 0),
        (t._pointIndex = 0),
        (t._position = AnnotationPosition.Center),
        (t._offset = new wjcCore.Point(0, 0)),
        (t._isVisible = !0),
        (t._tooltip = '');
    }),
    (t.prototype._toggleVisibility = function (t) {
      var e = t ? 'visible' : 'hidden';
      this._element && this._element.setAttribute('visibility', e);
    }),
    (t.prototype._getCSSClass = function () {
      return t._CSS_ANNOTATION;
    }),
    (t.prototype._render = function (t) {
      this._element = null;
    }),
    (t.prototype._repaint = function () {
      this._layer && this._layer._renderAnnotation(this);
    }),
    (t.prototype._convertPoint = function (t) {
      var e,
        n,
        o,
        i,
        r,
        s,
        a,
        _ = this,
        p = _._attachment,
        h = new wjcCore.Point();
      switch (
        (_._layer && _._layer._chart && (n = (e = _._layer._chart)._plotRect),
        p)
      ) {
        case AnnotationAttachment.DataIndex:
          if (!e.series || e.series.length <= _.seriesIndex) break;
          if (((r = e.series[_.seriesIndex]), !(s = r._getItem(_.pointIndex))))
            break;
          (o = r.axisX || e.axisX),
            (i = r.axisY || e.axisY),
            'string' == typeof (a = s[r.bindingX] || s.x) && (a = _.pointIndex),
            (h.x = _._convertDataToLen(n.width, o, a)),
            (h.y = _._convertDataToLen(
              n.height,
              i,
              s[r._getBinding(0)] || i.actualMin + 0.25,
              !0
            ));
          break;
        case AnnotationAttachment.DataCoordinate:
          (o = e.axisX),
            (i = e.axisY),
            (h.x = _._convertDataToLen(n.width, o, t.x)),
            (h.y = _._convertDataToLen(n.height, i, t.y, !0));
          break;
        case AnnotationAttachment.Relative:
          (h.x = n.width * t.x), (h.y = n.height * t.y);
          break;
        case AnnotationAttachment.Absolute:
        default:
          (h.x = t.x), (h.y = t.y);
      }
      return h;
    }),
    (t.prototype._convertDataToLen = function (t, e, n, o) {
      void 0 === o && (o = !1);
      var i = null == e.min ? e.actualMin : e.min,
        r = null == e.max ? e.actualMax : e.max;
      return o ? t * (1 - (n - i) / (r - i)) : (t * (n - i)) / (r - i);
    }),
    (t.prototype._renderCenteredText = function (t, e, n, o, i, r) {
      var s, a;
      this._isValidPoint(n) &&
        (i ? e.drawStringRotated(t, n, n, i, o, r) : e.drawString(t, n, o, r),
        (s = this._element.querySelector('text')) &&
          ((a = s.getBBox()),
          s.setAttribute('x', (n.x - a.width / 2).toFixed(1)),
          s.setAttribute('y', (n.y + a.height / 6).toFixed(1))));
    }),
    (t.prototype._adjustOffset = function (t, e) {
      (t.x = t.x + e.x), (t.y = t.y + e.y);
    }),
    (t.prototype._getOffset = function (t) {
      var e = this._getPositionOffset(t);
      return new wjcCore.Point(this._offset.x + e.x, this._offset.y + e.y);
    }),
    (t.prototype._getPositionOffset = function (t) {
      var e = new wjcCore.Point(0, 0),
        n = this.position,
        o = this._getSize(t);
      return (
        (n & AnnotationPosition.Top) === AnnotationPosition.Top
          ? (e.y -= o.height / 2)
          : (n & AnnotationPosition.Bottom) === AnnotationPosition.Bottom &&
            (e.y += o.height / 2),
        (n & AnnotationPosition.Left) === AnnotationPosition.Left
          ? (e.x -= o.width / 2)
          : (n & AnnotationPosition.Right) === AnnotationPosition.Right &&
            (e.x += o.width / 2),
        e
      );
    }),
    (t.prototype._getSize = function (t) {
      return new wjcCore.Size();
    }),
    (t.prototype._isValidPoint = function (t) {
      return isFinite(t.x) && isFinite(t.y);
    }),
    (t.prototype._measureString = function (t, e, n) {
      var o,
        i = t;
      return (
        i._textGroup && null == i._textGroup.parentNode
          ? (i._svg.appendChild(i._textGroup),
            (o = i.measureString(e, n, null, this.style)),
            i.endRender())
          : (o = i.measureString(e, n, null, this.style)),
        o
      );
    }),
    (t._DATA_KEY = 'wj-chart-annotation'),
    (t._CSS_ANNOTATION = 'wjchart-annotation'),
    (t._CSS_ANNO_TEXT = 'anno-text'),
    (t._CSS_ANNO_SHAPE = 'anno-shape'),
    t
  );
})();
exports.AnnotationBase = AnnotationBase;
var Text = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._resetDefaultValue = function () {
      t.prototype._resetDefaultValue.call(this),
        (this._text = ''),
        (this.position = AnnotationPosition.Top);
    }),
    (e.prototype._getCSSClass = function () {
      return t.prototype._getCSSClass.call(this) + ' ' + e._CSS_TEXT;
    }),
    Object.defineProperty(e.prototype, 'text', {
      get: function () {
        return this._text;
      },
      set: function (t) {
        var e = this;
        t !== e._text && ((e._text = t), e._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._render = function (t) {
      var e,
        n = this,
        o = n._convertPoint(n.point);
      (e = n._getOffset(t)),
        n._adjustOffset(o, e),
        n._renderCenteredText(
          n._text,
          t,
          o,
          AnnotationBase._CSS_ANNO_TEXT,
          null,
          n.style
        );
    }),
    (e.prototype._getSize = function (t) {
      return t
        ? this._measureString(t, this._text, AnnotationBase._CSS_ANNO_TEXT)
        : new wjcCore.Size();
    }),
    (e._CSS_TEXT = 'wjchart-anno-text'),
    e
  );
})(AnnotationBase);
exports.Text = Text;
var Shape = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._resetDefaultValue = function () {
      t.prototype._resetDefaultValue.call(this), (this._content = '');
    }),
    (e.prototype._getCSSClass = function () {
      return t.prototype._getCSSClass.call(this) + ' ' + e._CSS_SHAPE;
    }),
    Object.defineProperty(e.prototype, 'content', {
      get: function () {
        return this._content;
      },
      set: function (t) {
        var e = this;
        t !== e._content && ((e._content = t), e._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._render = function (t) {
      var e = this;
      (e._shapeContainer = t.startGroup()),
        (t.stroke = '#000'),
        e._renderShape(t),
        (t.stroke = null),
        t.endGroup(),
        e._content && e._renderText(t);
    }),
    (e.prototype._getContentCenter = function () {
      return this.point;
    }),
    (e.prototype._renderShape = function (t) {}),
    (e.prototype._renderText = function (t) {
      var e,
        n,
        o = this;
      (e = o._convertPoint(o._getContentCenter())),
        o._isValidPoint(e) &&
          ((n = o._getOffset()),
          o._adjustOffset(e, n),
          o._renderCenteredText(
            o._content,
            t,
            e,
            AnnotationBase._CSS_ANNO_TEXT
          ));
    }),
    (e._CSS_SHAPE = 'wjchart-anno-shape'),
    e
  );
})(AnnotationBase);
exports.Shape = Shape;
var Ellipse = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'width', {
      get: function () {
        return this._width;
      },
      set: function (t) {
        t !== this._width &&
          ((this._width = wjcCore.asNumber(t, !1, !0)), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'height', {
      get: function () {
        return this._height;
      },
      set: function (t) {
        t !== this._height &&
          ((this._height = wjcCore.asNumber(t, !1, !0)), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._resetDefaultValue = function () {
      t.prototype._resetDefaultValue.call(this),
        (this._width = 100),
        (this._height = 80);
    }),
    (e.prototype._getCSSClass = function () {
      return t.prototype._getCSSClass.call(this) + ' ' + e._CSS_ELLIPSE;
    }),
    (e.prototype._renderShape = function (e) {
      t.prototype._renderShape.call(this, e);
      var n = this,
        o = n._convertPoint(n.point),
        i = n._width,
        r = n._height,
        s = n._getOffset();
      n._adjustOffset(o, s),
        n._isValidPoint(o) &&
          e.drawEllipse(
            o.x,
            o.y,
            i / 2,
            r / 2,
            AnnotationBase._CSS_ANNO_SHAPE,
            n.style
          );
    }),
    (e.prototype._getSize = function () {
      return new wjcCore.Size(this.width, this.height);
    }),
    (e._CSS_ELLIPSE = 'wjchart-anno-ellipse'),
    e
  );
})(Shape);
exports.Ellipse = Ellipse;
var Rectangle = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'width', {
      get: function () {
        return this._width;
      },
      set: function (t) {
        t !== this._width &&
          ((this._width = wjcCore.asNumber(t, !1, !0)), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'height', {
      get: function () {
        return this._height;
      },
      set: function (t) {
        t !== this._height &&
          ((this._height = wjcCore.asNumber(t, !1, !0)), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._resetDefaultValue = function () {
      t.prototype._resetDefaultValue.call(this),
        (this._width = 100),
        (this._height = 80);
    }),
    (e.prototype._getCSSClass = function () {
      return t.prototype._getCSSClass.call(this) + ' ' + e._CSS_RECTANGLE;
    }),
    (e.prototype._renderShape = function (e) {
      t.prototype._renderShape.call(this, e);
      var n = this,
        o = n._convertPoint(n.point),
        i = n._width,
        r = n._height,
        s = n._getOffset();
      n._adjustOffset(o, s),
        n._isValidPoint(o) &&
          e.drawRect(
            o.x - i / 2,
            o.y - r / 2,
            n._width,
            n._height,
            AnnotationBase._CSS_ANNO_SHAPE,
            n.style
          );
    }),
    (e.prototype._getSize = function () {
      return new wjcCore.Size(this.width, this.height);
    }),
    (e._CSS_RECTANGLE = 'wjchart-anno-rectangle'),
    e
  );
})(Shape);
exports.Rectangle = Rectangle;
var Line = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'start', {
      get: function () {
        return this._start;
      },
      set: function (t) {
        var e = this;
        null != t.x &&
          null != t.y &&
          ((t.x === e._start.x && t.y === e._start.y) ||
            ((e._start = t), e._repaint()));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'end', {
      get: function () {
        return this._end;
      },
      set: function (t) {
        var e = this;
        null != t.x &&
          null != t.y &&
          ((t.x === e._end.x && t.y === e._end.y) ||
            ((e._end = t), e._repaint()));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._resetDefaultValue = function () {
      t.prototype._resetDefaultValue.call(this),
        (this._start = new wjcChart.DataPoint(0, 0)),
        (this._end = new wjcChart.DataPoint(0, 0)),
        (this.position = AnnotationPosition.Top);
    }),
    (e.prototype._getCSSClass = function () {
      return t.prototype._getCSSClass.call(this) + ' ' + e._CSS_LINE;
    }),
    (e.prototype._getContentCenter = function () {
      var t = this.start,
        e = this.end;
      return new wjcChart.DataPoint((t.x + e.x) / 2, (t.y + e.y) / 2);
    }),
    (e.prototype._renderShape = function (e) {
      t.prototype._renderShape.call(this, e);
      var n,
        o = this,
        i = o._convertPoint(o._start),
        r = o._convertPoint(o._end);
      (o._cS = i),
        (o._cE = r),
        (n = o._getOffset()),
        o._adjustOffset(i, n),
        o._adjustOffset(r, n),
        o._isValidPoint(i) &&
          o._isValidPoint(r) &&
          e.drawLine(
            i.x,
            i.y,
            r.x,
            r.y,
            AnnotationBase._CSS_ANNO_SHAPE,
            o.style
          );
    }),
    (e.prototype._getSize = function () {
      var t = this._cS,
        e = this._cE;
      return new wjcCore.Size(Math.abs(t.x - e.x), Math.abs(t.y - e.y));
    }),
    (e.prototype._renderText = function (t) {
      var e,
        n,
        o,
        i = this,
        r = i._cS,
        s = i._cE;
      (e = i._convertPoint(i._getContentCenter())),
        (n = i._getOffset()),
        i._adjustOffset(e, n),
        i._isValidPoint(e) &&
          ((o =
            (o = (180 * Math.atan2(s.y - r.y, s.x - r.x)) / Math.PI) < -90
              ? o + 180
              : o > 90
              ? o - 180
              : o),
          i._renderCenteredText(
            i.content,
            t,
            e,
            AnnotationBase._CSS_ANNO_TEXT,
            o
          ));
    }),
    (e.prototype._renderCenteredText = function (e, n, o, i, r, s) {
      if (null != r) {
        var a, _, p, h;
        (p = this._measureString(n, e, i).height / 2),
          (h = (r * Math.PI) / 180),
          (a = p * Math.sin(h)),
          (_ = p * Math.cos(h)),
          (o.x = o.x + a),
          (o.y = o.y - _);
      }
      t.prototype._renderCenteredText.call(this, e, n, o, i, r, s);
    }),
    (e._CSS_LINE = 'wjchart-anno-line'),
    e
  );
})(Shape);
exports.Line = Line;
var Polygon = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._processOptions = function (e, n, o) {
      var i = this;
      if ('points' === e) {
        var r = o[e];
        wjcCore.isArray(r) &&
          r.forEach(function (t) {
            i.points.push(t);
          });
      } else t.prototype._processOptions.call(this, e, n, o);
    }),
    Object.defineProperty(e.prototype, 'points', {
      get: function () {
        return this._points;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._resetDefaultValue = function () {
      var e = this;
      t.prototype._resetDefaultValue.call(this),
        (e._points = new wjcCore.ObservableArray()),
        e._points.collectionChanged.addHandler(function () {
          e._element && e._repaint();
        });
    }),
    (e.prototype._getCSSClass = function () {
      return t.prototype._getCSSClass.call(this) + ' ' + e._CSS_POLYGON;
    }),
    (e.prototype._getContentCenter = function () {
      var t,
        e = this.points,
        n = e.length,
        o = 0,
        i = 0;
      for (t = 0; t < n; t++) (o += e[t].x), (i += e[t].y);
      return new wjcChart.DataPoint(o / n, i / n);
    }),
    (e.prototype._renderShape = function (e) {
      t.prototype._renderShape.call(this, e);
      var n,
        o,
        i = this,
        r = [],
        s = [],
        a = i._points,
        _ = a.length,
        p = i._getOffset();
      for (n = 0; n < _; n++) {
        if (((o = i._convertPoint(a[n])), !i._isValidPoint(o))) return;
        i._adjustOffset(o, p), r.push(o.x), s.push(o.y);
      }
      e.drawPolygon(r, s, AnnotationBase._CSS_ANNO_SHAPE, i.style);
    }),
    (e.prototype._getSize = function () {
      var t,
        e,
        n,
        o,
        i,
        r,
        s,
        a = this,
        _ = a._points.length;
      for (
        s = [].map.call(a._points, function (t) {
          return a._convertPoint(t);
        }),
          i = 0;
        i < _;
        i++
      )
        (r = s[i]),
          0 !== i
            ? (r.x < t ? (t = r.x) : r.x > e && (e = r.x),
              r.y < n ? (n = r.y) : r.y > o && (o = r.y))
            : ((t = e = r.x), (n = o = r.y));
      return new wjcCore.Size(e - t, o - n);
    }),
    (e._CSS_POLYGON = 'wjchart-anno-polygon'),
    e
  );
})(Shape);
exports.Polygon = Polygon;
var Circle = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'radius', {
      get: function () {
        return this._radius;
      },
      set: function (t) {
        t !== this._radius &&
          ((this._radius = wjcCore.asNumber(t, !1, !0)), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._resetDefaultValue = function () {
      t.prototype._resetDefaultValue.call(this), (this._radius = 100);
    }),
    (e.prototype._getCSSClass = function () {
      return t.prototype._getCSSClass.call(this) + ' ' + e._CSS_CIRCLE;
    }),
    (e.prototype._renderShape = function (e) {
      t.prototype._renderShape.call(this, e);
      var n = this,
        o = n._convertPoint(n.point),
        i = n._getOffset();
      n._adjustOffset(o, i),
        n._isValidPoint(o) &&
          e.drawPieSegment(
            o.x,
            o.y,
            n.radius,
            0,
            360,
            AnnotationBase._CSS_ANNO_SHAPE,
            n.style
          );
    }),
    (e.prototype._getSize = function () {
      var t = 2 * this.radius;
      return new wjcCore.Size(t, t);
    }),
    (e._CSS_CIRCLE = 'wjchart-anno-circle'),
    e
  );
})(Shape);
exports.Circle = Circle;
var Square = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'length', {
      get: function () {
        return this._length;
      },
      set: function (t) {
        t !== this._length &&
          ((this._length = wjcCore.asNumber(t, !1, !0)), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._resetDefaultValue = function () {
      t.prototype._resetDefaultValue.call(this), (this._length = 100);
    }),
    (e.prototype._getCSSClass = function () {
      return t.prototype._getCSSClass.call(this) + ' ' + e._CSS_SQUARE;
    }),
    (e.prototype._renderShape = function (e) {
      t.prototype._renderShape.call(this, e);
      var n = this,
        o = n._convertPoint(n.point),
        i = n.length,
        r = n._getOffset();
      n._adjustOffset(o, r),
        n._isValidPoint(o) &&
          e.drawRect(
            o.x - i / 2,
            o.y - i / 2,
            i,
            i,
            AnnotationBase._CSS_ANNO_SHAPE,
            n.style
          );
    }),
    (e.prototype._getSize = function () {
      return new wjcCore.Size(this.length, this.length);
    }),
    (e._CSS_SQUARE = 'wjchart-anno-square'),
    e
  );
})(Shape);
exports.Square = Square;
var Image = (function (t) {
  function e(e) {
    return t.call(this, e) || this;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'width', {
      get: function () {
        return this._width;
      },
      set: function (t) {
        t !== this._width &&
          ((this._width = wjcCore.asNumber(t, !1, !0)), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'height', {
      get: function () {
        return this._height;
      },
      set: function (t) {
        t !== this._height &&
          ((this._height = wjcCore.asNumber(t, !1, !0)), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'href', {
      get: function () {
        return this._href;
      },
      set: function (t) {
        t !== this._href && ((this._href = t), this._repaint());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._resetDefaultValue = function () {
      t.prototype._resetDefaultValue.call(this),
        (this._width = 100),
        (this._height = 100),
        (this._href = '');
    }),
    (e.prototype._getCSSClass = function () {
      return t.prototype._getCSSClass.call(this) + ' ' + e._CSS_IMAGE;
    }),
    (e.prototype._renderShape = function (e) {
      t.prototype._renderShape.call(this, e);
      var n = this,
        o = n._convertPoint(n.point),
        i = n._href,
        r = n.width,
        s = n.height,
        a = n._getOffset();
      i.length > 0 &&
        n._isValidPoint(o) &&
        (n._adjustOffset(o, a), e.drawImage(i, o.x - r / 2, o.y - s / 2, r, s)),
        n._applyStyle(n._element, n.style);
    }),
    (e.prototype._getSize = function () {
      return new wjcCore.Size(this.width, this.height);
    }),
    (e.prototype._applyStyle = function (t, e) {
      if (e) for (var n in e) t.setAttribute(this._deCase(n), e[n]);
    }),
    (e.prototype._deCase = function (t) {
      return t.replace(/[A-Z]/g, function (t) {
        return '-' + t.toLowerCase();
      });
    }),
    (e._CSS_IMAGE = 'wjchart-anno-image'),
    e
  );
})(Shape);
exports.Image = Image;
var AnnotationLayer = (function () {
  function t(t, e) {
    var n = this;
    n._init(t),
      n._renderGroup(),
      n._bindTooltip(),
      e &&
        wjcCore.isArray(e) &&
        e.forEach(function (t) {
          var e,
            o = t.type || 'Circle';
          wjcSelf[o] && ((e = new wjcSelf[o](t)), n._items.push(e));
        });
  }
  return (
    (t.prototype._init = function (t) {
      var e = this;
      (e._items = new wjcCore.ObservableArray()),
        e._items.collectionChanged.addHandler(e._itemsChanged, e),
        (e._chart = t),
        (e._forceTTShowing = !1),
        (e._annoTTShowing = !1),
        (e._engine = t._currentRenderEngine),
        t.rendered.addHandler(e._renderAnnotations, e),
        t.lostFocus.addHandler(e._lostFocus, e);
    }),
    (t.prototype._lostFocus = function (t) {
      this._toggleTooltip(this._tooltip, t, this._chart.hostElement);
    }),
    Object.defineProperty(t.prototype, 'items', {
      get: function () {
        return this._items;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getItem = function (t) {
      var e = this.getItems(t);
      return e.length > 0 ? e[0] : null;
    }),
    (t.prototype.getItems = function (t) {
      var e = [];
      if (0 === this._items.length || !t || '' === t) return e;
      for (var n = 0; n < this._items.length; n++)
        t === this._items[n].name && e.push(this._items[n]);
      return e;
    }),
    (t.prototype._bindTooltip = function () {
      var t,
        e = this,
        n = e._chart.hostElement,
        o = e._tooltip;
      o ||
        ((o = e._tooltip = new wjcChart.ChartTooltip()),
        (t = wjcCore.Tooltip.prototype.hide),
        (wjcCore.Tooltip.prototype.hide = function () {
          e._forceTTShowing || t.call(o);
        })),
        n &&
          (n.addEventListener('click', function (t) {
            e._toggleTooltip(o, t, n);
          }),
          n.addEventListener('mousemove', function (t) {
            e._showTooltip() && e._toggleTooltip(o, t, n);
          }));
    }),
    (t.prototype._showTooltip = function () {
      return !this._chart.isTouching;
    }),
    (t.prototype._toggleTooltip = function (t, e, n) {
      var o = this,
        i = o._getAnnotation(e.target, n);
      if (i && i.tooltip)
        (o._forceTTShowing = !0),
          (o._annoTTShowing = !0),
          t.show(
            o._layerEle,
            i.tooltip,
            new wjcCore.Rect(e.clientX, e.clientY, 5, 5)
          );
      else {
        if (!o._annoTTShowing) return;
        (o._annoTTShowing = !1), (o._forceTTShowing = !1), t.hide();
      }
    }),
    (t.prototype._getAnnotation = function (t, e) {
      var n = this._getAnnotationElement(t, e);
      return null == n ? null : n[AnnotationBase._DATA_KEY];
    }),
    (t.prototype._getAnnotationElement = function (t, e) {
      if (!t || !e) return null;
      var n = t.parentNode;
      return wjcCore.hasClass(t, AnnotationBase._CSS_ANNOTATION)
        ? t
        : null == n || n === document.body || n === document || n === e
        ? null
        : this._getAnnotationElement(n, e);
    }),
    (t.prototype._itemsChanged = function (t, e) {
      var n = e.action,
        o = e.item;
      switch (n) {
        case wjcCore.NotifyCollectionChangedAction.Add:
        case wjcCore.NotifyCollectionChangedAction.Change:
          (o._layer = this), this._renderAnnotation(o);
          break;
        case wjcCore.NotifyCollectionChangedAction.Remove:
          this._destroyAnnotation(o);
      }
    }),
    (t.prototype._renderAnnotations = function () {
      var t,
        e = this.items,
        n = e.length;
      for (this._renderGroup(), t = 0; t < n; t++) this._renderAnnotation(e[t]);
    }),
    (t.prototype._renderGroup = function () {
      var e = this,
        n = e._engine,
        o = e._chart._plotRect;
      o &&
        ((e._layerEle && null != e._layerEle.parentNode) ||
          ((e._plotrectId = 'plotRect' + (1e6 * Math.random()).toFixed()),
          n.addClipRect(
            { left: 0, top: 0, width: o.width, height: o.height },
            e._plotrectId
          ),
          (e._layerEle = n.startGroup(t._CSS_Layer, e._plotrectId)),
          e._layerEle.setAttribute(
            'transform',
            'translate(' + o.left + ', ' + o.top + ')'
          ),
          n.endGroup()));
    }),
    (t.prototype._renderAnnotation = function (t) {
      this._layerEle &&
        null != this._layerEle.parentNode &&
        (t._element &&
          t._element.parentNode == this._layerEle &&
          this._layerEle.removeChild(t._element),
        t.render(this._engine),
        this._layerEle.appendChild(t._element));
    }),
    (t.prototype._destroyAnnotations = function () {
      var t,
        e = this.items,
        n = e.length;
      for (t = 0; t < n; t++) this._destroyAnnotation(e[t]);
    }),
    (t.prototype._destroyAnnotation = function (t) {
      this._layerEle && this._layerEle.removeChild(t._element), t.destroy();
    }),
    (t._CSS_Layer = 'wj-chart-annotationlayer'),
    t
  );
})();
exports.AnnotationLayer = AnnotationLayer;
