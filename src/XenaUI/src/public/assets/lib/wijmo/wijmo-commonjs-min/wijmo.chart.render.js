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
var wjcChart = require('wijmo/wijmo.chart'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.chart.render');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.chart = window.wijmo.chart || {}),
  (window.wijmo.chart.render = wjcSelf);
var _CanvasRenderEngine = (function () {
  function t(t, e) {
    void 0 === e && (e = !1),
      (this._strokeWidth = 1),
      (this._fontSize = null),
      (this._fontFamily = null),
      (this._applyCanvasClip = function (t, e) {
        var n = this._canvasRect[e];
        n &&
          (t.beginPath(),
          t.rect(n.left, n.top, n.width, n.height),
          t.clip(),
          t.closePath());
      }),
      (this._applyCanvasStyles = function (t, e, n, i, r) {
        var a,
          o,
          l,
          s = this,
          p = s._canvas.getContext('2d'),
          h = s.stroke,
          c = s.fill,
          f = s.strokeWidth;
        e && void 0 !== e.stroke && (h = e.stroke),
          e &&
            void 0 !== e.fill &&
            (c = s._getOpacityColor(e.fill, e['fill-opacity'])),
          t && ((o = window.getComputedStyle(t)), (l = t.getBBox())),
          r
            ? o
              ? ((p.fillStyle = o.fill),
                (a = o.fontStyle + ' ' + o.fontSize + ' ' + o.fontFamily),
                (p.font = a),
                p.font.replace(/\"/g, "'") !== a.replace(/\"/g, "'") &&
                  ((a =
                    o.fontStyle +
                    ' ' +
                    o.fontSize +
                    ' ' +
                    (p.font.split(' ')[1] || 'sans-serif')),
                  (p.font = a)))
              : s.fontSize
              ? ((p.fillStyle = s.textFill),
                (p.font = s.fontSize + ' ' + (s.fontFamily || 'sans-serif')))
              : s._canvasDefaultFont &&
                ((p.fillStyle = s._canvasDefaultFont.textFill),
                (a =
                  s._canvasDefaultFont.fontSize +
                  ' ' +
                  s._canvasDefaultFont.fontFamily),
                (p.font = a),
                p.font.replace(/\"/g, "'") !== a.replace(/\"/g, "'") &&
                  ((a =
                    s._canvasDefaultFont.fontSize +
                    ' ' +
                    (p.font.split(' ')[1] || 'sans-serif')),
                  (p.font = a)))
            : (o &&
                ((h = o.stroke && 'none' !== o.stroke ? o.stroke : h),
                (c =
                  o.fill && 'none' !== o.fill
                    ? s._getOpacityColor(o.fill, o['fill-opacity'])
                    : c),
                (f = o.strokeWidth ? o.strokeWidth : f)),
              'none' !== h &&
                null != h &&
                (this._applyColor('strokeStyle', h, l),
                (p.lineWidth = +f.replace(/px/g, '')),
                p.stroke()),
              i &&
                null != c &&
                'transparent' !== c &&
                'none' !== c &&
                (this._applyColor('fillStyle', c, l), p.fill()));
      });
    var n = this;
    (n._element = t),
      (n._canvas = document.createElement('canvas')),
      (n._svgEngine = new wjcChart._SvgRenderEngine(t)),
      n._element.appendChild(n._canvas),
      (n._applyCSSStyles = e);
  }
  return (
    (t.prototype.beginRender = function () {
      var t,
        e = this,
        n = e._svgEngine.element,
        i = e._element;
      e._applyCSSStyles && (e._svgEngine.beginRender(), (i = n)),
        e._element.appendChild(n),
        (e._canvasRect = {}),
        (t = window.getComputedStyle(i)),
        (e._canvasDefaultFont = {
          fontSize: t.fontSize,
          fontFamily: t.fontFamily,
          textFill: t.color,
        });
    }),
    (t.prototype.endRender = function () {
      this._applyCSSStyles && this._svgEngine.endRender(),
        this._svgEngine.element.parentNode.removeChild(this._svgEngine.element);
    }),
    (t.prototype.setViewportSize = function (t, e) {
      var n,
        i,
        r = this,
        a = r._canvas,
        o = (a.getContext('2d'), r.fill);
      r._applyCSSStyles && r._svgEngine.setViewportSize(t, e),
        (a.width = t),
        (a.height = e),
        (n = window.getComputedStyle(r._element).backgroundColor),
        (i = r.stroke),
        n &&
          ((r.stroke = null),
          (r.fill = n),
          r.drawRect(0, 0, t, e),
          (r.fill = o),
          (r.stroke = i));
    }),
    Object.defineProperty(t.prototype, 'element', {
      get: function () {
        return this._canvas;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'fill', {
      get: function () {
        return this._fill;
      },
      set: function (t) {
        (this._svgEngine.fill = t), (this._fill = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'fontSize', {
      get: function () {
        return this._fontSize;
      },
      set: function (t) {
        this._svgEngine.fontSize = t;
        var e = null == t || isNaN(t) ? t : t + 'px';
        this._fontSize = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'fontFamily', {
      get: function () {
        return this._fontFamily;
      },
      set: function (t) {
        (this._svgEngine.fontFamily = t), (this._fontFamily = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'stroke', {
      get: function () {
        return this._stroke;
      },
      set: function (t) {
        (this._svgEngine.stroke = t), (this._stroke = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'strokeWidth', {
      get: function () {
        return this._strokeWidth;
      },
      set: function (t) {
        (this._svgEngine.strokeWidth = t), (this._strokeWidth = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'textFill', {
      get: function () {
        return this._textFill;
      },
      set: function (t) {
        (this._svgEngine.textFill = t), (this._textFill = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.addClipRect = function (t, e) {
      t &&
        e &&
        (this._applyCSSStyles && this._svgEngine.addClipRect(t, e),
        (this._canvasRect[e] = t.clone()));
    }),
    (t.prototype.drawEllipse = function (t, e, n, i, r, a) {
      var o,
        l = this._canvas.getContext('2d');
      return (
        this._applyCSSStyles &&
          (o = this._svgEngine.drawEllipse(t, e, n, i, r, a)),
        l.save(),
        l.beginPath(),
        l.ellipse
          ? l.ellipse(t, e, n, i, 0, 0, 2 * Math.PI)
          : (l.translate(t, e),
            l.scale(1, i / n),
            l.translate(-t, -e),
            l.arc(t, e, n, 0, 2 * Math.PI),
            l.scale(1, 1)),
        this._applyCanvasStyles(o, a, r, !0),
        l.restore(),
        o
      );
    }),
    (t.prototype.drawRect = function (t, e, n, i, r, a, o) {
      var l,
        s = this._canvas.getContext('2d');
      return (
        this._applyCSSStyles &&
          (l = this._svgEngine.drawRect(t, e, n, i, r, a, o)),
        s.save(),
        this._applyCanvasClip(s, o),
        s.beginPath(),
        s.rect(t, e, n, i),
        this._applyCanvasStyles(l, a, r, !0),
        s.restore(),
        l
      );
    }),
    (t.prototype.drawLine = function (t, e, n, i, r, a) {
      var o,
        l = this._canvas.getContext('2d');
      return (
        this._applyCSSStyles &&
          (o = this._svgEngine.drawLine(t, e, n, i, r, a)),
        l.save(),
        l.beginPath(),
        l.moveTo(t, e),
        l.lineTo(n, i),
        this._applyCanvasStyles(o, a, r),
        l.restore(),
        o
      );
    }),
    (t.prototype.drawLines = function (t, e, n, i, r) {
      if (t && e && 0 !== t.length && 0 !== e.length) {
        var a,
          o,
          l = this._canvas.getContext('2d'),
          s = Math.min(t.length, e.length);
        for (
          this._applyCSSStyles &&
            (a = this._svgEngine.drawLines([0, 1], [1, 0], n, i, r)),
            l.save(),
            this._applyCanvasClip(l, r),
            l.beginPath(),
            l.moveTo(t[0], e[0]),
            o = 1;
          o < s;
          o++
        )
          l.lineTo(t[o], e[o]);
        return this._applyCanvasStyles(a, i, n), l.restore(), a;
      }
    }),
    (t.prototype.drawSplines = function (t, e, n, i, r) {
      if (t && e && 0 !== t.length && 0 !== e.length) {
        var a,
          o,
          l = this._canvas.getContext('2d'),
          s = new wjcChart._Spline(t, e).calculate(),
          p = s.xs,
          h = s.ys,
          c = Math.min(p.length, h.length);
        for (
          this._applyCSSStyles &&
            (a = this._svgEngine.drawSplines([0, 1], [1, 0], n, i, r)),
            l.save(),
            this._applyCanvasClip(l, r),
            l.beginPath(),
            l.moveTo(p[0], h[0]),
            o = 1;
          o < c;
          o++
        )
          l.lineTo(p[o], h[o]);
        return this._applyCanvasStyles(a, i, n), l.restore(), a;
      }
    }),
    (t.prototype.drawPolygon = function (t, e, n, i, r) {
      if (t && e && 0 !== t.length && 0 !== e.length) {
        var a,
          o,
          l = this._canvas.getContext('2d'),
          s = Math.min(t.length, e.length);
        for (
          this._applyCSSStyles &&
            (a = this._svgEngine.drawPolygon(t, e, n, i, r)),
            l.save(),
            this._applyCanvasClip(l, r),
            l.beginPath(),
            l.moveTo(t[0], e[0]),
            o = 1;
          o < s;
          o++
        )
          l.lineTo(t[o], e[o]);
        return (
          l.closePath(), this._applyCanvasStyles(a, i, n, !0), l.restore(), a
        );
      }
    }),
    (t.prototype.drawPieSegment = function (t, e, n, i, r, a, o, l) {
      var s,
        p = this._canvas.getContext('2d'),
        h = i,
        c = i + r;
      return (
        this._applyCSSStyles &&
          (s = this._svgEngine.drawPieSegment(t, e, n, i, r, a, o, l)),
        p.save(),
        this._applyCanvasClip(p, l),
        p.beginPath(),
        p.moveTo(t, e),
        p.arc(t, e, n, h, c, !1),
        p.lineTo(t, e),
        this._applyCanvasStyles(s, o, a, !0),
        p.restore(),
        s
      );
    }),
    (t.prototype.drawDonutSegment = function (t, e, n, i, r, a, o, l, s) {
      var p,
        h,
        c,
        f = this._canvas.getContext('2d'),
        y = r,
        g = r + a;
      return (
        this._applyCSSStyles &&
          (p = this._svgEngine.drawDonutSegment(t, e, n, i, r, a, o, l, s)),
        (h = new wjcCore.Point(t, e)),
        (h.x += i * Math.cos(y)),
        (h.y += i * Math.sin(y)),
        (c = new wjcCore.Point(t, e)),
        (c.x += i * Math.cos(g)),
        (c.y += i * Math.sin(g)),
        f.save(),
        this._applyCanvasClip(f, s),
        f.beginPath(),
        f.moveTo(h.x, h.y),
        f.arc(t, e, n, y, g, !1),
        f.lineTo(c.x, c.y),
        f.arc(t, e, i, g, y, !0),
        this._applyCanvasStyles(p, l, o, !0),
        f.restore(),
        p
      );
    }),
    (t.prototype.drawString = function (t, e, n, i) {
      var r,
        a = this._canvas.getContext('2d');
      return (
        this._applyCSSStyles && (r = this._svgEngine.drawString(t, e, n, i)),
        a.save(),
        (a.textBaseline = 'bottom'),
        this._applyCanvasStyles(r, i, n, !0, !0),
        a.fillText(t, e.x, e.y),
        a.restore(),
        r
      );
    }),
    (t.prototype.drawStringRotated = function (t, e, n, i, r, a) {
      var o,
        l = this._canvas.getContext('2d');
      l.measureText(t);
      return (
        this._applyCSSStyles &&
          (o = this._svgEngine.drawStringRotated(t, e, n, i, r, a)),
        l.save(),
        (l.textBaseline = 'bottom'),
        l.translate(n.x, n.y),
        l.rotate((Math.PI / 180) * i),
        l.translate(-n.x, -n.y),
        this._applyCanvasStyles(o, a, r, !0, !0),
        l.fillText(t, e.x, e.y),
        l.restore(),
        o
      );
    }),
    (t.prototype.measureString = function (t, e, n, i) {
      var r,
        a = (a = this._canvas.getContext('2d'));
      return this._applyCSSStyles
        ? this._svgEngine.measureString(t, e, n, i)
        : (this._applyCanvasStyles(null, null, e, !0, !0),
          (r = a.measureText(t).width),
          new wjcCore.Size(r, 1.5 * parseInt(a.font)));
    }),
    (t.prototype.startGroup = function (t, e, n) {
      void 0 === n && (n = !1);
      var i,
        r = this._canvas.getContext('2d');
      return (
        this._applyCSSStyles && (i = this._svgEngine.startGroup(t, e, n)),
        r.save(),
        this._applyCanvasClip(r, e),
        i
      );
    }),
    (t.prototype.endGroup = function () {
      this._applyCSSStyles && this._svgEngine.endGroup(),
        this._canvas.getContext('2d').restore();
    }),
    (t.prototype.drawImage = function (t, e, n, i, r) {
      var a,
        o = this._canvas.getContext('2d'),
        l = new Image();
      return (
        this._applyCSSStyles && (a = this._svgEngine.drawImage(t, e, n, i, r)),
        (l.onload = function () {
          o.drawImage(l, e, n, i, r);
        }),
        (l.src = t),
        a
      );
    }),
    (t.prototype._getOpacityColor = function (t, e) {
      var n = new wjcCore.Color(t);
      return t.indexOf('url') > -1
        ? this.fill
        : t.indexOf('-') > -1
        ? ((this.fill = t), t)
        : (null != e && 1 === n.a && (n.a = isNaN(e) ? 1 : Number(e)),
          n.toString());
    }),
    (t.prototype._applyColor = function (t, e, n) {
      var i = _GradientColorUtil.tryParse(e),
        r = this._canvas.getContext('2d');
      if (null != i)
        if (wjcCore.isString(i) || null == n) r[t] = i;
        else {
          var a;
          if (null != i.x1)
            a = i.relative
              ? r.createLinearGradient(
                  n.x + i.x1 * n.width,
                  n.y + i.y1 * n.height,
                  n.x + i.x2 * n.width,
                  n.y + i.y2 * n.height
                )
              : r.createLinearGradient(i.x1, i.y1, i.x2, i.y2);
          else if (null != i.r)
            if (i.relative) {
              var o = n.x + i.cx * n.width,
                l = n.y + i.cy * n.height,
                s = i.r * n.width,
                p = (i.r * n.height) / s,
                h = n.x + (null == i.fx ? i.cx : i.fx) * n.width,
                c = n.y + (null == i.fy ? i.cy : i.fy) * n.height,
                f = (null == i.fr ? 0 : i.fr) * n.width,
                y = (null == i.fr ? 0 : i.fr) * n.height,
                g = Math.min(f, y);
              (a = r.createRadialGradient(h, c / p, g, o, l / p, s)),
                r.setTransform(1, 0, 0, p, 0, 0);
            } else
              a = r.createRadialGradient(
                null == i.fx ? i.cx : i.fx,
                null == i.fy ? i.cy : i.fy,
                i.fr || 0,
                i.cx,
                i.cy,
                i.r
              );
          i.colors &&
            i.colors.length > 0 &&
            null != a &&
            i.colors.forEach(function (t) {
              var e = new wjcCore.Color('#000000');
              null != t.color && (e = t.color),
                null != t.opacity && (e.a = t.opacity),
                a.addColorStop(t.offset, e.toString());
            }),
            (r[t] = a);
        }
    }),
    t
  );
})();
exports._CanvasRenderEngine = _CanvasRenderEngine;
var _GradientColorUtil = (function () {
  function t() {}
  return (
    (t.tryParse = function (e) {
      if (t.parsedColor[e]) return t.parsedColor[e];
      if (null == e || -1 === e.indexOf('-')) return e;
      var n,
        i = e.replace(/\s+/g, '').split(/\-/g),
        r = i[0][0],
        a = !1,
        o = i[0]
          .match(/\(\S+\)/)[0]
          .replace(/[\(\\)]/g, '')
          .split(/\,/g);
      'l' === r || 'L' === r
        ? ((n = { x1: '0', y1: '0', x2: '0', y2: '0', colors: [] }),
          'l' === r && (a = !0),
          ['x1', 'y1', 'x2', 'y2'].forEach(function (t, e) {
            null != o[e] && (n[t] = +o[e]);
          }))
        : ('r' !== r && 'R' !== r) ||
          ((n = { cx: '0', cy: '0', r: '0', colors: [] }),
          'r' === r && (a = !0),
          ['cx', 'cy', 'r', 'fx', 'fy', 'fr'].forEach(function (t, e) {
            null != o[e] && '' !== o[e] && (n[t] = +o[e]);
          })),
        (n.relative = a),
        (t.parsedColor[e] = n);
      var l = i.length - 1;
      return (
        i.forEach(function (t, e) {
          t.indexOf(')') > -1 && (t = t.match(/\)\S+/)[0].replace(')', ''));
          var i = t.split(':'),
            r = { color: new wjcCore.Color('#000000') };
          null != i[0] && (r.color = wjcCore.Color.fromString(i[0])),
            null != i[1] ? (r.offset = +i[1]) : (r.offset = e / l),
            null != i[2] && (r.opacity = +i[2]),
            n.colors.push(r);
        }),
        n
      );
    }),
    (t.parsedColor = {}),
    t
  );
})();
if (
  wjcChart.FlexChartBase &&
  wjcChart.FlexChartBase.prototype &&
  wjcChart.FlexChartBase.prototype._exportToImage
) {
  var _exportFn = wjcChart.FlexChartBase.prototype._exportToImage;
  wjcChart.FlexChartBase.prototype._exportToImage = function (t, e) {
    if ('svg' !== t) {
      var n,
        i,
        r = new _CanvasRenderEngine(this.hostElement, !0),
        a = this.rendered;
      (this.rendered = new wjcCore.Event()),
        this._render(r, !1),
        (i = r.element).parentNode.removeChild(i),
        (n = i.toDataURL('image/' + t)),
        e.call(null, n),
        (i = null),
        (r = null),
        (this.rendered = a);
    } else _exportFn.call(this, t, e);
  };
}
