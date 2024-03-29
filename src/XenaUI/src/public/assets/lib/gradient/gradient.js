function GradientCanvas(t, e, n) {
  (this._colorStops = []),
    (this._alphaStops = []),
    (this.angle = n || 0 == n ? n : 90),
    (t = t || []);
  for (var r = 0; t.length > r; r++) this.addColorStop(t[r].offset, t[r].color);
  e = e || [];
  for (var r = 0; e.length > r; r++) this.addAlphaStop(e[r].offset, e[r].alpha);
}
function pickHex(t, e, n) {
  var r = n,
    o = 2 * r - 1,
    i = (o / 1 + 1) / 2,
    a = 1 - i;
  return [
    Math.round(t[0] * i + e[0] * a),
    Math.round(t[1] * i + e[1] * a),
    Math.round(t[2] * i + e[2] * a),
  ];
}
!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t.one = t.one || {}), (t.one.color = e()));
})(this, function () {
  'use strict';
  function t(e) {
    if (Array.isArray(e)) {
      if ('string' == typeof e[0] && 'function' == typeof t[e[0]])
        return new t[e[0]](e.slice(1, e.length));
      if (4 === e.length)
        return new t.RGB(e[0] / 255, e[1] / 255, e[2] / 255, e[3] / 255);
    } else if ('string' == typeof e) {
      var r = e.toLowerCase();
      t.namedColors[r] && (e = '#' + t.namedColors[r]),
        'transparent' === r && (e = 'rgba(0,0,0,0)');
      var a = e.match(i);
      if (a) {
        var s = a[1].toUpperCase(),
          c = n(a[8]) ? a[8] : parseFloat(a[8]),
          l = 'H' === s[0],
          u = a[3] ? 100 : l ? 360 : 255,
          p = a[5] || l ? 100 : 255,
          d = a[7] || l ? 100 : 255;
        if (n(t[s])) throw new Error('color.' + s + ' is not installed.');
        return new t[s](
          parseFloat(a[2]) / u,
          parseFloat(a[4]) / p,
          parseFloat(a[6]) / d,
          c
        );
      }
      e.length < 6 &&
        (e = e.replace(/^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3'));
      var f = e.match(
        /^#?([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])$/i
      );
      if (f)
        return new t.RGB(
          parseInt(f[1], 16) / 255,
          parseInt(f[2], 16) / 255,
          parseInt(f[3], 16) / 255
        );
      if (t.CMYK) {
        var h = e.match(
          new RegExp(
            '^cmyk\\(' +
              o.source +
              ',' +
              o.source +
              ',' +
              o.source +
              ',' +
              o.source +
              '\\)$',
            'i'
          )
        );
        if (h)
          return new t.CMYK(
            parseFloat(h[1]) / 100,
            parseFloat(h[2]) / 100,
            parseFloat(h[3]) / 100,
            parseFloat(h[4]) / 100
          );
      }
    } else if ('object' == typeof e && e.isColor) return e;
    return !1;
  }
  var e = [],
    n = function (t) {
      return void 0 === t;
    },
    r = /\s*(\.\d+|\d+(?:\.\d+)?)(%)?\s*/,
    o = /\s*(\.\d+|100|\d?\d(?:\.\d+)?)%\s*/,
    i = new RegExp(
      '^(rgb|hsl|hsv)a?\\(' +
        r.source +
        ',' +
        r.source +
        ',' +
        r.source +
        '(?:,' +
        /\s*(\.\d+|\d+(?:\.\d+)?)\s*/.source +
        ')?\\)$',
      'i'
    );
  (t.namedColors = {}),
    (t.installColorSpace = function (r, o, i) {
      function a(e, n) {
        var r = {};
        (r[n.toLowerCase()] = function () {
          return this.rgb()[n.toLowerCase()]();
        }),
          t[n].propertyNames.forEach(function (t) {
            var e = 'black' === t ? 'k' : t.charAt(0);
            r[t] = r[e] = function (e, r) {
              return this[n.toLowerCase()]()[t](e, r);
            };
          });
        for (var o in r)
          r.hasOwnProperty(o) &&
            void 0 === t[e].prototype[o] &&
            (t[e].prototype[o] = r[o]);
      }
      (t[r] = function (t) {
        var e = Array.isArray(t) ? t : arguments;
        o.forEach(function (t, n) {
          var i = e[n];
          if ('alpha' === t)
            this._alpha = isNaN(i) || i > 1 ? 1 : i < 0 ? 0 : i;
          else {
            if (isNaN(i))
              throw new Error(
                '[' + r + ']: Invalid color: (' + o.join(',') + ')'
              );
            'hue' === t
              ? (this._hue = i < 0 ? i - Math.floor(i) : i % 1)
              : (this['_' + t] = i < 0 ? 0 : i > 1 ? 1 : i);
          }
        }, this);
      }),
        (t[r].propertyNames = o);
      var s = t[r].prototype;
      ['valueOf', 'hex', 'hexa', 'css', 'cssa'].forEach(function (t) {
        s[t] =
          s[t] ||
          ('RGB' === r
            ? s.hex
            : function () {
                return this.rgb()[t]();
              });
      }),
        (s.isColor = !0),
        (s.equals = function (t, e) {
          n(e) && (e = 1e-10), (t = t[r.toLowerCase()]());
          for (var i = 0; i < o.length; i += 1)
            if (Math.abs(this['_' + o[i]] - t['_' + o[i]]) > e) return !1;
          return !0;
        }),
        (s.toJSON = function () {
          return [r].concat(
            o.map(function (t) {
              return this['_' + t];
            }, this)
          );
        });
      for (var c in i)
        if (i.hasOwnProperty(c)) {
          var l = c.match(/^from(.*)$/);
          l
            ? (t[l[1].toUpperCase()].prototype[r.toLowerCase()] = i[c])
            : (s[c] = i[c]);
        }
      return (
        (s[r.toLowerCase()] = function () {
          return this;
        }),
        (s.toString = function () {
          return (
            '[' +
            r +
            ' ' +
            o
              .map(function (t) {
                return this['_' + t];
              }, this)
              .join(', ') +
            ']'
          );
        }),
        o.forEach(function (t) {
          var e = 'black' === t ? 'k' : t.charAt(0);
          s[t] = s[e] = function (e, n) {
            return void 0 === e
              ? this['_' + t]
              : n
              ? new this.constructor(
                  o.map(function (n) {
                    return this['_' + n] + (t === n ? e : 0);
                  }, this)
                )
              : new this.constructor(
                  o.map(function (n) {
                    return t === n ? e : this['_' + n];
                  }, this)
                );
          };
        }),
        e.forEach(function (t) {
          a(r, t), a(t, r);
        }),
        e.push(r),
        t
      );
    }),
    (t.pluginList = []),
    (t.use = function (e) {
      return (
        -1 === t.pluginList.indexOf(e) && (this.pluginList.push(e), e(t)), t
      );
    }),
    (t.installMethod = function (n, r) {
      return (
        e.forEach(function (e) {
          t[e].prototype[n] = r;
        }),
        this
      );
    }),
    t.installColorSpace('RGB', ['red', 'green', 'blue', 'alpha'], {
      hex: function () {
        var t = (
          65536 * Math.round(255 * this._red) +
          256 * Math.round(255 * this._green) +
          Math.round(255 * this._blue)
        ).toString(16);
        return '#' + '00000'.substr(0, 6 - t.length) + t;
      },
      hexa: function () {
        var t = Math.round(255 * this._alpha).toString(16);
        return '#' + '00'.substr(0, 2 - t.length) + t + this.hex().substr(1, 6);
      },
      css: function () {
        return (
          'rgb(' +
          Math.round(255 * this._red) +
          ',' +
          Math.round(255 * this._green) +
          ',' +
          Math.round(255 * this._blue) +
          ')'
        );
      },
      cssa: function () {
        return (
          'rgba(' +
          Math.round(255 * this._red) +
          ',' +
          Math.round(255 * this._green) +
          ',' +
          Math.round(255 * this._blue) +
          ',' +
          this._alpha +
          ')'
        );
      },
    });
  var a = t,
    s = function (t) {
      t.installColorSpace('HSV', ['hue', 'saturation', 'value', 'alpha'], {
        rgb: function () {
          var e,
            n,
            r,
            o = this._hue,
            i = this._saturation,
            a = this._value,
            s = Math.min(5, Math.floor(6 * o)),
            c = 6 * o - s,
            l = a * (1 - i),
            u = a * (1 - c * i),
            p = a * (1 - (1 - c) * i);
          switch (s) {
            case 0:
              (e = a), (n = p), (r = l);
              break;
            case 1:
              (e = u), (n = a), (r = l);
              break;
            case 2:
              (e = l), (n = a), (r = p);
              break;
            case 3:
              (e = l), (n = u), (r = a);
              break;
            case 4:
              (e = p), (n = l), (r = a);
              break;
            case 5:
              (e = a), (n = l), (r = u);
          }
          return new t.RGB(e, n, r, this._alpha);
        },
        hsl: function () {
          var e,
            n = (2 - this._saturation) * this._value,
            r = this._saturation * this._value,
            o = n <= 1 ? n : 2 - n;
          return (
            (e = o < 1e-9 ? 0 : r / o),
            new t.HSL(this._hue, e, n / 2, this._alpha)
          );
        },
        fromRgb: function () {
          var e,
            n = this._red,
            r = this._green,
            o = this._blue,
            i = Math.max(n, r, o),
            a = Math.min(n, r, o),
            s = i - a,
            c = 0 === i ? 0 : s / i,
            l = i;
          if (0 === s) e = 0;
          else
            switch (i) {
              case n:
                e = (r - o) / s / 6 + (r < o ? 1 : 0);
                break;
              case r:
                e = (o - n) / s / 6 + 1 / 3;
                break;
              case o:
                e = (n - r) / s / 6 + 2 / 3;
            }
          return new t.HSV(e, c, l, this._alpha);
        },
      });
    },
    c = function (t) {
      t.use(s),
        t.installColorSpace(
          'HSL',
          ['hue', 'saturation', 'lightness', 'alpha'],
          {
            hsv: function () {
              var e,
                n = 2 * this._lightness,
                r = this._saturation * (n <= 1 ? n : 2 - n);
              return (
                (e = n + r < 1e-9 ? 0 : (2 * r) / (n + r)),
                new t.HSV(this._hue, e, (n + r) / 2, this._alpha)
              );
            },
            rgb: function () {
              return this.hsv().rgb();
            },
            fromRgb: function () {
              return this.hsv().hsl();
            },
          }
        );
    };
  return a.use(s).use(c);
}),
  (function (t, e) {
    'object' == typeof exports
      ? (module.exports = e(require('onecolor')))
      : 'function' == typeof define && define.amd
      ? define(['onecolor'], e)
      : (t.colorjoe = e(t.one.color));
  })(this, function (t) {
    function e(t, e, n) {
      var r = document.createElement(t);
      return (r.className = e), n.appendChild(r), r;
    }
    function n(t) {
      var e = Array.prototype.slice,
        n = e.apply(arguments, [1]);
      return function () {
        return t.apply(null, n.concat(e.apply(arguments)));
      };
    }
    function r(t, e, n, r) {
      var a = 'colorPickerInput' + Math.floor(1001 * Math.random()),
        s = A(t, n),
        c = i('text', s, r, a);
      return { label: o(e, s, a), input: c };
    }
    function o(t, n, r) {
      var o = e('label', '', n);
      return (o.innerHTML = t), r && o.setAttribute('for', r), o;
    }
    function i(t, n, r, o) {
      var i = e('input', '', n);
      return (
        (i.type = t),
        r && (i.maxLength = r),
        o && i.setAttribute('id', o),
        r && (i.maxLength = r),
        i
      );
    }
    function a(t, e) {
      t.style.left = l(100 * e, 0, 100) + '%';
    }
    function s(t, e) {
      t.style.top = l(100 * e, 0, 100) + '%';
    }
    function c(t, e) {
      t.style.background = e;
    }
    function l(t, e, n) {
      return Math.min(Math.max(t, e), n);
    }
    function u(t) {
      var e = P.div('currentColorContainer', t),
        n = P.div('currentColor', e);
      return {
        change: function (t) {
          P.BG(n, t.cssa());
        },
      };
    }
    function p(t, e, n) {
      function r() {
        e.done();
      }
      function o(t) {
        t.ctrlKey ||
          t.altKey ||
          !/^[a-zA-Z]$/.test(t.key) ||
          t.preventDefault();
      }
      function i() {
        var t = [a];
        f.forEach(function (e, n) {
          s instanceof Array
            ? t.push(e.e.input.value / s[n])
            : t.push(e.e.input.value / s);
        }),
          p || t.push(e.getAlpha()),
          e.set(t);
      }
      var a = n.space,
        s = n.limit || 255,
        c = n.fix >= 0 ? n.fix : 0,
        l = E(s) ? ('' + s).length + c : 4;
      l = c ? l + 1 : l;
      var u = a.split(''),
        p = 'A' == a[a.length - 1];
      if (
        ((a = p ? a.slice(0, -1) : a),
        ['RGB', 'RGBA', 'HSL', 'HSV', 'CMYK'].indexOf(a) < 0)
      )
        return console.warn('Invalid field names', a);
      var d = P.div('colorFields', t),
        f = u.map(function (t) {
          t = t.toLowerCase();
          var e = P.labelInput('color ' + t, t, d, l);
          return (
            (e.input.onblur = r),
            (e.input.onkeydown = o),
            (e.input.onkeyup = i),
            { name: t, e: e }
          );
        });
      return {
        change: function (t) {
          f.forEach(function (e, n) {
            s instanceof Array
              ? (e.e.input.value = (t[e.name]() * s[n]).toFixed(c))
              : (e.e.input.value = (t[e.name]() * s).toFixed(c));
          });
        },
      };
    }
    function d(t, e) {
      function n() {
        e.done();
      }
      function r(t) {
        var n = P.clamp(t.x, 0, 1);
        P.X(t.pointer, n), e.setAlpha(1 - n);
      }
      var o = O.slider({
        parent: t,
        class: 'oned alpha',
        cbs: { begin: r, change: r, end: n },
      });
      return {
        change: function (t) {
          P.X(o.pointer, 1 - t.alpha());
        },
      };
    }
    function f(t, e, n) {
      var r = P.labelInput('hex', n.label || 'hex', t, 7);
      return (
        (r.input.value = '#'),
        (r.input.onkeyup = function (t) {
          var n = t.keyCode || t.which,
            r = t.target.value;
          (r = '#' == r[0] ? r : '#' + r),
            (r = g(r, 7, '0')),
            13 == n && e.set(r);
        }),
        (r.input.onblur = function (t) {
          e.set(t.target.value), e.done();
        }),
        {
          change: function (t) {
            (r.input.value = '#' == r.input.value[0] ? '#' : ''),
              (r.input.value += t.hex().slice(1));
          },
        }
      );
    }
    function h(t, e, n) {
      var r = P.e('a', n['class'] || 'close', t);
      (r.href = '#'),
        (r.innerHTML = n.label || 'Close'),
        (r.onclick = function (t) {
          t.preventDefault(), e.hide();
        });
    }
    function g(t, e, n) {
      for (var r = t, o = t.length; o < e; o++) r += n;
      return r;
    }
    function v(e, n) {
      P.BG(e, new t.HSV(n, 1, 1).cssa());
    }
    function m(t) {
      function e(t) {
        (f = c.xy(f, { x: P.clamp(t.x, 0, 1), y: P.clamp(t.y, 0, 1) }, l, d)),
          r();
      }
      function n(t) {
        (f = c.z(f, P.clamp(t.x, 0, 1), l, d)), r();
      }
      function r(t) {
        t = E(t) ? t : [];
        for (var e, n = a.change, r = 0, o = n.length; r < o; r++)
          (e = n[r]), -1 == t.indexOf(e.name) && e.fn(f);
      }
      function o() {
        if (!i.equals(f)) {
          for (var t = 0, e = a.done.length; t < e; t++) a.done[t].fn(f);
          i = f;
        }
      }
      if (!t.e) return console.warn('colorjoe: missing element');
      var i = y(t.color),
        a = { change: [], done: [] },
        s = T(t.e) ? document.getElementById(t.e) : t.e;
      s.className = 'colorPicker';
      var c = t.cbs,
        l = O.xyslider({
          parent: s,
          class: 'twod',
          cbs: { begin: e, change: e, end: o },
        }),
        u = document.querySelector('.js-controls');
      P.div('controls-title', u).innerHTML = 'Color Code';
      var p = {
        e: s,
        done: function () {
          return o(), this;
        },
        update: function (t) {
          return r(t), this;
        },
        hide: function () {
          return (s.style.display = 'none'), this;
        },
        show: function () {
          return (s.style.display = ''), this;
        },
        get: function () {
          return f;
        },
        set: function (t) {
          var e = this.get();
          return (f = c.init(y(t), l, d)), e.equals(f) || this.update(), this;
        },
        getAlpha: function () {
          return f.alpha();
        },
        setAlpha: function (t) {
          return (f = f.alpha(t)), this.update(), this;
        },
        on: function (t, e, n) {
          return (
            'change' == t || 'done' == t
              ? a[t].push({ name: n, fn: e })
              : console.warn(
                  'Passed invalid evt name "' + t + '" to colorjoe.on'
                ),
            this
          );
        },
        removeAllListeners: function (t) {
          if (t) delete a[t];
          else for (var e in a) delete a[e];
          return this;
        },
      };
      b(u, p, t.extras);
      var d = O.slider({
        parent: u,
        class: 'oned',
        cbs: { begin: n, change: n, end: o },
      });
      x(u, p, t.extras);
      var f = c.init(i, l, d);
      return r(), p;
    }
    function y(e) {
      if (!M(e)) return t('#000');
      if (e.isColor) return e;
      var n = t(e);
      return (
        n ||
        (M(e) &&
          console.warn('Passed invalid color to colorjoe, using black instead'),
        t('#000'))
      );
    }
    function x(t, n) {
      var r,
        o = e,
        i = {};
      r = (0, D._extras.alpha)(t, w(n, o + 0), i);
      for (var a in r) n.on(a, r[a], o);
    }
    function b(t, e, n) {
      if (n) {
        var r,
          o,
          i,
          a = P.div('extras', t);
        n.forEach(function (t, n) {
          if ('alpha' !== t) {
            E(t)
              ? ((o = t[0]), (i = t.length > 1 ? t[1] : {}))
              : ((o = t), (i = {}));
            var s = o in D._extras ? D._extras[o] : null;
            if (s) {
              r = s(a, w(e, o + n), i);
              for (var c in r) e.on(c, r[c], o);
            }
          }
        });
      }
    }
    function w(t, e) {
      var n = S(t);
      return (
        (n.update = function () {
          t.update([e]);
        }),
        n
      );
    }
    function S(t) {
      var e = {};
      for (var n in t) e[n] = t[n];
      return e;
    }
    function C(t, e) {
      return e.map(t).filter(I).length == e.length;
    }
    function E(t) {
      return '[object Array]' === Object.prototype.toString.call(t);
    }
    function T(t) {
      return 'string' == typeof t;
    }
    function M(t) {
      return void 0 !== t;
    }
    function k(t) {
      return 'function' == typeof t;
    }
    function I(t) {
      return t;
    } /*! colorjoe - v2.0.0 - Juho Vepsalainen <bebraw@gmail.com> - MIT
https://bebraw.github.com/colorjoe - 2016-08-12 */
    /*! dragjs - v0.7.0 - Juho Vepsalainen <bebraw@gmail.com> - MIT
    https://bebraw.github.com/dragjs - 2016-08-12 */
    var O = (function () {
        function t(t, e) {
          if (!t) return void console.warn('drag is missing elem!');
          a(t, e, 'touchstart', 'touchmove', 'touchend'),
            a(t, e, 'mousedown', 'mousemove', 'mouseup');
        }
        function e(e) {
          var n = o(e['class'] || '', e.parent),
            i = o('pointer', n);
          return (
            o('shape shape1', i),
            o('shape shape2', i),
            o('bg bg1', n),
            o('bg bg2', n),
            t(n, r(e.cbs, i)),
            { background: n, pointer: i }
          );
        }
        function n(e) {
          var n = o(e['class'], e.parent),
            i = o('pointer', n);
          o('shape', i);
          var a = o('bg', n);
          return (
            e && 'oned alpha' === e['class'] && o('bg-color js-alpha-color', a),
            t(n, r(e.cbs, i)),
            { background: n, pointer: i }
          );
        }
        function r(t, e) {
          function n(t) {
            return function (n) {
              (n.pointer = e), t(n);
            };
          }
          var r = {};
          for (var o in t) r[o] = n(t[o]);
          return r;
        }
        function o(t, e) {
          return i('div', t, e);
        }
        function i(t, e, n) {
          var r = document.createElement(t);
          return e && (r.className = e), n.appendChild(r), r;
        }
        function a(t, e, n, r, o) {
          var i = !1;
          e = l(e);
          var a = e.begin,
            u = e.change,
            p = e.end;
          s(t, n, function (e) {
            function n() {
              (i = !1), c(document, r, l), c(document, o, n), d(p, t, e);
            }
            i = !0;
            var l = f(d, u, t);
            s(document, r, l), s(document, o, n), d(a, t, e);
          });
        }
        function s(t, e, n) {
          t.addEventListener(e, n, !1);
        }
        function c(t, e, n) {
          t.removeEventListener(e, n, !1);
        }
        function l(t) {
          if (t)
            return {
              begin: t.begin || p,
              change: t.change || p,
              end: t.end || p,
            };
          var e, n;
          return {
            begin: function (t) {
              (e = { x: t.elem.offsetLeft, y: t.elem.offsetTop }),
                (n = t.cursor);
            },
            change: function (t) {
              u(t.elem, 'left', e.x + t.cursor.x - n.x + 'px'),
                u(t.elem, 'top', e.y + t.cursor.y - n.y + 'px');
            },
            end: p,
          };
        }
        function u(t, e, n) {
          t.style[e] = n;
        }
        function p() {}
        function d(t, e, n) {
          n.preventDefault();
          var r = h(e),
            o = e.clientWidth,
            i = e.clientHeight,
            a = { x: g(e, n), y: v(e, n) },
            s = (a.x - r.x) / o,
            c = (a.y - r.y) / i;
          t({
            x: isNaN(s) ? 0 : s,
            y: isNaN(c) ? 0 : c,
            cursor: a,
            elem: e,
            e: n,
          });
        }
        function f(t) {
          var e = Array.prototype.slice,
            n = e.apply(arguments, [1]);
          return function () {
            return t.apply(null, n.concat(e.apply(arguments)));
          };
        }
        function h(t) {
          var e = t.getBoundingClientRect();
          return { x: e.left, y: e.top };
        }
        function g(t, e) {
          return (e.touches ? e.touches[e.touches.length - 1] : e).clientX;
        }
        function v(t, e) {
          return (e.touches ? e.touches[e.touches.length - 1] : e).clientY;
        }
        return (t.xyslider = e), (t.slider = n), t;
      })(),
      A = n(e, 'div'),
      P = {
        clamp: l,
        e: e,
        div: A,
        partial: n,
        labelInput: r,
        X: a,
        Y: s,
        BG: c,
      },
      _ = { currentColor: u, fields: p, hex: f, alpha: d, close: h },
      D = function (t) {
        return C(k, [t.init, t.xy, t.z])
          ? function (e, n, r) {
              return m({ e: e, color: n, cbs: t, extras: r });
            }
          : console.warn('colorjoe: missing cb');
      };
    (D.rgb = D({
      init: function (e, n, r) {
        var o = t(e).hsv();
        return (
          this.xy(o, { x: o.saturation(), y: 1 - o.value() }, n, r),
          this.z(o, o.hue(), n, r),
          o
        );
      },
      xy: function (t, e, n) {
        return (
          P.X(n.pointer, e.x),
          P.Y(n.pointer, e.y),
          t.saturation(e.x).value(1 - e.y)
        );
      },
      z: function (t, e, n, r) {
        return P.X(r.pointer, e), v(n.background, e), t.hue(e);
      },
    })),
      (D.hsl = D({
        init: function (e, n, r) {
          var o = t(e).hsl();
          return (
            this.xy(o, { x: o.hue(), y: 1 - o.saturation() }, n, r),
            this.z(o, 1 - o.lightness(), n, r),
            o
          );
        },
        xy: function (t, e, n, r) {
          return (
            P.X(n.pointer, e.x),
            P.Y(n.pointer, e.y),
            v(r.background, e.x),
            t.hue(e.x).saturation(1 - e.y)
          );
        },
        z: function (t, e, n, r) {
          return P.Y(r.pointer, e), t.lightness(1 - e);
        },
      })),
      (D._extras = {}),
      (D.registerExtra = function (t, e) {
        t in D._extras &&
          console.warn('Extra "' + t + '"has been registered already!'),
          (D._extras[t] = e);
      });
    for (var R in _) D.registerExtra(R, _[R]);
    return D;
  }),
  /**
   * interact.js v1.3.0
   *
   * Copyright (c) 2012-2017 Taye Adeyemi <dev@taye.me>
   * Released under the MIT License.
   * https://raw.github.com/taye/interact.js/master/LICENSE
   */ (function (t) {
    if ('object' == typeof exports && 'undefined' != typeof module)
      module.exports = t();
    else if ('function' == typeof define && define.amd) define([], t);
    else {
      var e;
      (e =
        'undefined' != typeof window
          ? window
          : 'undefined' != typeof global
          ? global
          : 'undefined' != typeof self
          ? self
          : this),
        (e.interact = t());
    }
  })(function () {
    return (function t(e, n, r) {
      function o(a, s) {
        if (!n[a]) {
          if (!e[a]) {
            var c = 'function' == typeof require && require;
            if (!s && c) return c(a, !0);
            if (i) return i(a, !0);
            var l = new Error("Cannot find module '" + a + "'");
            throw ((l.code = 'MODULE_NOT_FOUND'), l);
          }
          var u = (n[a] = { exports: {} });
          e[a][0].call(
            u.exports,
            function (t) {
              var n = e[a][1][t];
              return o(n || t);
            },
            u,
            u.exports,
            t,
            e,
            n,
            r
          );
        }
        return n[a].exports;
      }
      for (
        var i = 'function' == typeof require && require, a = 0;
        a < r.length;
        a++
      )
        o(r[a]);
      return o;
    })(
      {
        1: [
          function (t, e) {
            'use strict';
            'undefined' == typeof window
              ? (e.exports = function (e) {
                  return t('./src/utils/window').init(e), t('./src/index');
                })
              : (e.exports = t('./src/index'));
          },
          { './src/index': 19, './src/utils/window': 51 },
        ],
        2: [
          function (t, e) {
            'use strict';
            function n(t, e) {
              if (!(t instanceof e))
                throw new TypeError('Cannot call a class as a function');
            }
            function r(t, e) {
              for (var n = 0; n < e.length; n++) {
                var r;
                r = e[n];
                var o = r;
                if (t.immediatePropagationStopped) break;
                o(t);
              }
            }
            var o = t('./utils/extend.js'),
              i = (function () {
                function t(e) {
                  n(this, t), (this.options = o({}, e || {}));
                }
                return (
                  (t.prototype.fire = function (t) {
                    var e = void 0,
                      n = 'on' + t.type,
                      o = this.global;
                    (e = this[t.type]) && r(t, e),
                      this[n] && this[n](t),
                      !t.propagationStopped && o && (e = o[t.type]) && r(t, e);
                  }),
                  (t.prototype.on = function (t, e) {
                    this[t] ? this[t].push(e) : (this[t] = [e]);
                  }),
                  (t.prototype.off = function (t, e) {
                    var n = this[t],
                      r = n ? n.indexOf(e) : -1;
                    -1 !== r && n.splice(r, 1),
                      ((n && 0 === n.length) || !e) && (this[t] = undefined);
                  }),
                  t
                );
              })();
            e.exports = i;
          },
          { './utils/extend.js': 40 },
        ],
        3: [
          function (t, e) {
            'use strict';
            function n(t, e) {
              if (!(t instanceof e))
                throw new TypeError('Cannot call a class as a function');
            }
            var r = t('./utils/extend'),
              o = t('./utils/getOriginXY'),
              i = t('./defaultOptions'),
              a = t('./utils/Signals')['new'](),
              s = (function () {
                function t(e, s, c, l, u, p) {
                  var d =
                    arguments.length > 6 &&
                    arguments[6] !== undefined &&
                    arguments[6];
                  n(this, t);
                  var f = e.target,
                    h = ((f && f.options) || i).deltaSource,
                    g = o(f, u, c),
                    v = 'start' === l,
                    m = 'end' === l,
                    y = v ? e.startCoords : e.curCoords,
                    x = e.prevEvent;
                  u = u || e.element;
                  var b = r({}, y.page),
                    w = r({}, y.client);
                  (b.x -= g.x),
                    (b.y -= g.y),
                    (w.x -= g.x),
                    (w.y -= g.y),
                    (this.ctrlKey = s.ctrlKey),
                    (this.altKey = s.altKey),
                    (this.shiftKey = s.shiftKey),
                    (this.metaKey = s.metaKey),
                    (this.button = s.button),
                    (this.buttons = s.buttons),
                    (this.target = u),
                    (this.currentTarget = u),
                    (this.relatedTarget = p || null),
                    (this.preEnd = d),
                    (this.type = c + (l || '')),
                    (this.interaction = e),
                    (this.interactable = f),
                    (this.t0 = v ? e.downTimes[e.downTimes.length - 1] : x.t0);
                  var S = {
                    interaction: e,
                    event: s,
                    action: c,
                    phase: l,
                    element: u,
                    related: p,
                    page: b,
                    client: w,
                    coords: y,
                    starting: v,
                    ending: m,
                    deltaSource: h,
                    iEvent: this,
                  };
                  a.fire('set-xy', S),
                    m
                      ? ((this.pageX = x.pageX),
                        (this.pageY = x.pageY),
                        (this.clientX = x.clientX),
                        (this.clientY = x.clientY))
                      : ((this.pageX = b.x),
                        (this.pageY = b.y),
                        (this.clientX = w.x),
                        (this.clientY = w.y)),
                    (this.x0 = e.startCoords.page.x - g.x),
                    (this.y0 = e.startCoords.page.y - g.y),
                    (this.clientX0 = e.startCoords.client.x - g.x),
                    (this.clientY0 = e.startCoords.client.y - g.y),
                    a.fire('set-delta', S),
                    (this.timeStamp = y.timeStamp),
                    (this.dt = e.pointerDelta.timeStamp),
                    (this.duration = this.timeStamp - this.t0),
                    (this.speed = e.pointerDelta[h].speed),
                    (this.velocityX = e.pointerDelta[h].vx),
                    (this.velocityY = e.pointerDelta[h].vy),
                    (this.swipe =
                      m || 'inertiastart' === l ? this.getSwipe() : null),
                    a.fire('new', S);
                }
                return (
                  (t.prototype.getSwipe = function () {
                    var t = this.interaction;
                    if (
                      t.prevEvent.speed < 600 ||
                      this.timeStamp - t.prevEvent.timeStamp > 150
                    )
                      return null;
                    var e =
                        (180 *
                          Math.atan2(
                            t.prevEvent.velocityY,
                            t.prevEvent.velocityX
                          )) /
                        Math.PI,
                      n = 22.5;
                    e < 0 && (e += 360);
                    var r = 135 - n <= e && e < 225 + n,
                      o = 225 - n <= e && e < 315 + n,
                      i = !r && (315 - n <= e || e < 45 + n);
                    return {
                      up: o,
                      down: !o && 45 - n <= e && e < 135 + n,
                      left: r,
                      right: i,
                      angle: e,
                      speed: t.prevEvent.speed,
                      velocity: {
                        x: t.prevEvent.velocityX,
                        y: t.prevEvent.velocityY,
                      },
                    };
                  }),
                  (t.prototype.preventDefault = function () {}),
                  (t.prototype.stopImmediatePropagation = function () {
                    this.immediatePropagationStopped = this.propagationStopped =
                      !0;
                  }),
                  (t.prototype.stopPropagation = function () {
                    this.propagationStopped = !0;
                  }),
                  t
                );
              })();
            a.on('set-delta', function (t) {
              var e = t.iEvent,
                n = t.interaction,
                r = t.starting,
                o = t.deltaSource,
                i = r ? e : n.prevEvent;
              'client' === o
                ? ((e.dx = e.clientX - i.clientX),
                  (e.dy = e.clientY - i.clientY))
                : ((e.dx = e.pageX - i.pageX), (e.dy = e.pageY - i.pageY));
            }),
              (s.signals = a),
              (e.exports = s);
          },
          {
            './defaultOptions': 18,
            './utils/Signals': 34,
            './utils/extend': 40,
            './utils/getOriginXY': 41,
          },
        ],
        4: [
          function (t, e) {
            'use strict';
            function n(t, e) {
              if (!(t instanceof e))
                throw new TypeError('Cannot call a class as a function');
            }
            var r = t('./utils/is'),
              o = t('./utils/events'),
              i = t('./utils/extend'),
              a = t('./actions/base'),
              s = t('./scope'),
              c = t('./Eventable'),
              l = t('./defaultOptions'),
              u = t('./utils/Signals')['new'](),
              p = t('./utils/domUtils'),
              d = p.getElementRect,
              f = p.nodeContains,
              h = p.trySelector,
              g = p.matchesSelector,
              v = t('./utils/window'),
              m = v.getWindow,
              y = t('./utils/arr'),
              x = y.contains,
              b = t('./utils/browser'),
              w = b.wheelEvent;
            s.interactables = [];
            var S = (function () {
              function t(e, r) {
                n(this, t),
                  (r = r || {}),
                  (this.target = e),
                  (this.events = new c()),
                  (this._context = r.context || s.document),
                  (this._win = m(h(e) ? this._context : e)),
                  (this._doc = this._win.document),
                  u.fire('new', {
                    target: e,
                    options: r,
                    interactable: this,
                    win: this._win,
                  }),
                  s.addDocument(this._doc, this._win),
                  s.interactables.push(this),
                  this.set(r);
              }
              return (
                (t.prototype.setOnEvents = function (t, e) {
                  var n = 'on' + t;
                  return (
                    r['function'](e.onstart) &&
                      (this.events[n + 'start'] = e.onstart),
                    r['function'](e.onmove) &&
                      (this.events[n + 'move'] = e.onmove),
                    r['function'](e.onend) &&
                      (this.events[n + 'end'] = e.onend),
                    r['function'](e.oninertiastart) &&
                      (this.events[n + 'inertiastart'] = e.oninertiastart),
                    this
                  );
                }),
                (t.prototype.setPerAction = function (t, e) {
                  for (var n in e)
                    n in l[t] &&
                      (r.object(e[n])
                        ? ((this.options[t][n] = i(
                            this.options[t][n] || {},
                            e[n]
                          )),
                          r.object(l.perAction[n]) &&
                            'enabled' in l.perAction[n] &&
                            (this.options[t][n].enabled = !1 !== e[n].enabled))
                        : r.bool(e[n]) && r.object(l.perAction[n])
                        ? (this.options[t][n].enabled = e[n])
                        : e[n] !== undefined && (this.options[t][n] = e[n]));
                }),
                (t.prototype.getRect = function (t) {
                  return (
                    (t = t || this.target),
                    r.string(this.target) &&
                      !r.element(t) &&
                      (t = this._context.querySelector(this.target)),
                    d(t)
                  );
                }),
                (t.prototype.rectChecker = function (t) {
                  return r['function'](t)
                    ? ((this.getRect = t), this)
                    : null === t
                    ? (delete this.options.getRect, this)
                    : this.getRect;
                }),
                (t.prototype._backCompatOption = function (t, e) {
                  if (h(e) || r.object(e)) {
                    this.options[t] = e;
                    for (var n = 0; n < a.names.length; n++) {
                      var o;
                      o = a.names[n];
                      var i = o;
                      this.options[i][t] = e;
                    }
                    return this;
                  }
                  return this.options[t];
                }),
                (t.prototype.origin = function (t) {
                  return this._backCompatOption('origin', t);
                }),
                (t.prototype.deltaSource = function (t) {
                  return 'page' === t || 'client' === t
                    ? ((this.options.deltaSource = t), this)
                    : this.options.deltaSource;
                }),
                (t.prototype.context = function () {
                  return this._context;
                }),
                (t.prototype.inContext = function (t) {
                  return (
                    this._context === t.ownerDocument || f(this._context, t)
                  );
                }),
                (t.prototype.fire = function (t) {
                  return this.events.fire(t), this;
                }),
                (t.prototype._onOffMultiple = function (t, e, n, o) {
                  if (
                    (r.string(e) &&
                      -1 !== e.search(' ') &&
                      (e = e.trim().split(/ +/)),
                    r.array(e))
                  ) {
                    for (var i = 0; i < e.length; i++) {
                      var a;
                      a = e[i];
                      var s = a;
                      this[t](s, n, o);
                    }
                    return !0;
                  }
                  if (r.object(e)) {
                    for (var c in e) this[t](c, e[c], n);
                    return !0;
                  }
                }),
                (t.prototype.on = function (e, n, i) {
                  return this._onOffMultiple('on', e, n, i)
                    ? this
                    : ('wheel' === e && (e = w),
                      x(t.eventTypes, e)
                        ? this.events.on(e, n)
                        : r.string(this.target)
                        ? o.addDelegate(this.target, this._context, e, n, i)
                        : o.add(this.target, e, n, i),
                      this);
                }),
                (t.prototype.off = function (e, n, i) {
                  return this._onOffMultiple('off', e, n, i)
                    ? this
                    : ('wheel' === e && (e = w),
                      x(t.eventTypes, e)
                        ? this.events.off(e, n)
                        : r.string(this.target)
                        ? o.removeDelegate(this.target, this._context, e, n, i)
                        : o.remove(this.target, e, n, i),
                      this);
                }),
                (t.prototype.set = function (e) {
                  r.object(e) || (e = {}), (this.options = i({}, l.base));
                  var n = i({}, l.perAction);
                  for (var o in a.methodDict) {
                    var s = a.methodDict[o];
                    (this.options[o] = i({}, l[o])),
                      this.setPerAction(o, n),
                      this[s](e[o]);
                  }
                  for (var c = 0; c < t.settingsMethods.length; c++) {
                    var p;
                    p = t.settingsMethods[c];
                    var d = p;
                    (this.options[d] = l.base[d]), d in e && this[d](e[d]);
                  }
                  return (
                    u.fire('set', {
                      options: e,
                      interactable: this,
                    }),
                    this
                  );
                }),
                (t.prototype.unset = function () {
                  if ((o.remove(this.target, 'all'), r.string(this.target)))
                    for (var t in o.delegatedEvents) {
                      var e = o.delegatedEvents[t];
                      e.selectors[0] === this.target &&
                        e.contexts[0] === this._context &&
                        (e.selectors.splice(0, 1),
                        e.contexts.splice(0, 1),
                        e.listeners.splice(0, 1),
                        e.selectors.length || (e[t] = null)),
                        o.remove(this._context, t, o.delegateListener),
                        o.remove(this._context, t, o.delegateUseCapture, !0);
                    }
                  else o.remove(this, 'all');
                  u.fire('unset', { interactable: this }),
                    s.interactables.splice(s.interactables.indexOf(this), 1);
                  for (var n = 0; n < (s.interactions || []).length; n++) {
                    var i;
                    i = (s.interactions || [])[n];
                    var a = i;
                    a.target === this && a.interacting() && a.stop();
                  }
                  return s.interact;
                }),
                t
              );
            })();
            (s.interactables.indexOfElement = function (t, e) {
              e = e || s.document;
              for (var n = 0; n < this.length; n++) {
                var r = this[n];
                if (r.target === t && r._context === e) return n;
              }
              return -1;
            }),
              (s.interactables.get = function (t, e, n) {
                var o = this[this.indexOfElement(t, e && e.context)];
                return o && (r.string(t) || n || o.inContext(t)) ? o : null;
              }),
              (s.interactables.forEachMatch = function (t, e) {
                for (var n = 0; n < this.length; n++) {
                  var o;
                  o = this[n];
                  var i = o,
                    a = void 0;
                  if (
                    ((r.string(i.target)
                      ? r.element(t) && g(t, i.target)
                      : t === i.target) &&
                      i.inContext(t) &&
                      (a = e(i)),
                    a !== undefined)
                  )
                    return a;
                }
              }),
              (S.eventTypes = s.eventTypes = []),
              (S.signals = u),
              (S.settingsMethods = [
                'deltaSource',
                'origin',
                'preventDefault',
                'rectChecker',
              ]),
              (e.exports = S);
          },
          {
            './Eventable': 2,
            './actions/base': 6,
            './defaultOptions': 18,
            './scope': 33,
            './utils/Signals': 34,
            './utils/arr': 35,
            './utils/browser': 36,
            './utils/domUtils': 38,
            './utils/events': 39,
            './utils/extend': 40,
            './utils/is': 45,
            './utils/window': 51,
          },
        ],
        5: [
          function (t, e) {
            'use strict';
            function n(t, e) {
              if (!(t instanceof e))
                throw new TypeError('Cannot call a class as a function');
            }
            function r(t) {
              return function (e) {
                var n = s.getPointerType(e),
                  r = s.getEventTargets(e),
                  o = r[0],
                  i = r[1],
                  c = [];
                if (l.supportsTouch && /touch/.test(e.type)) {
                  g = new Date().getTime();
                  for (var u = 0; u < e.changedTouches.length; u++) {
                    var d;
                    d = e.changedTouches[u];
                    var f = d,
                      h = f,
                      m = p.search(h, e.type, o);
                    c.push([h, m || new v({ pointerType: n })]);
                  }
                } else {
                  var y = !1;
                  if (!l.supportsPointerEvent && /mouse/.test(e.type)) {
                    for (var x = 0; x < a.interactions.length && !y; x++)
                      y =
                        'mouse' !== a.interactions[x].pointerType &&
                        a.interactions[x].pointerIsDown;
                    y =
                      y || new Date().getTime() - g < 500 || 0 === e.timeStamp;
                  }
                  if (!y) {
                    var b = p.search(e, e.type, o);
                    b || (b = new v({ pointerType: n })), c.push([e, b]);
                  }
                }
                for (var w = 0; w < c.length; w++) {
                  var S = c[w],
                    C = S[0],
                    E = S[1];
                  E._updateEventTargets(o, i), E[t](C, e, o, i);
                }
              };
            }
            function o(t) {
              for (var e = 0; e < a.interactions.length; e++) {
                var n;
                n = a.interactions[e];
                var r = n;
                r.end(t),
                  d.fire('endall', {
                    event: t,
                    interaction: r,
                  });
              }
            }
            function i(t, e) {
              var n = t.doc,
                r = 0 === e.indexOf('add') ? c.add : c.remove;
              for (var o in a.delegatedEvents)
                r(n, o, c.delegateListener), r(n, o, c.delegateUseCapture, !0);
              for (var i in x) r(n, i, x[i]);
            }
            var a = t('./scope'),
              s = t('./utils'),
              c = t('./utils/events'),
              l = t('./utils/browser'),
              u = t('./utils/domObjects'),
              p = t('./utils/interactionFinder'),
              d = t('./utils/Signals')['new'](),
              f = {},
              h = [
                'pointerDown',
                'pointerMove',
                'pointerUp',
                'updatePointer',
                'removePointer',
              ],
              g = 0;
            a.interactions = [];
            for (
              var v = (function () {
                  function t(e) {
                    var r = e.pointerType;
                    n(this, t),
                      (this.target = null),
                      (this.element = null),
                      (this.prepared = {
                        name: null,
                        axis: null,
                        edges: null,
                      }),
                      (this.pointers = []),
                      (this.pointerIds = []),
                      (this.downTargets = []),
                      (this.downTimes = []),
                      (this.prevCoords = {
                        page: { x: 0, y: 0 },
                        client: { x: 0, y: 0 },
                        timeStamp: 0,
                      }),
                      (this.curCoords = {
                        page: { x: 0, y: 0 },
                        client: { x: 0, y: 0 },
                        timeStamp: 0,
                      }),
                      (this.startCoords = {
                        page: { x: 0, y: 0 },
                        client: { x: 0, y: 0 },
                        timeStamp: 0,
                      }),
                      (this.pointerDelta = {
                        page: {
                          x: 0,
                          y: 0,
                          vx: 0,
                          vy: 0,
                          speed: 0,
                        },
                        client: {
                          x: 0,
                          y: 0,
                          vx: 0,
                          vy: 0,
                          speed: 0,
                        },
                        timeStamp: 0,
                      }),
                      (this.downEvent = null),
                      (this.downPointer = {}),
                      (this._eventTarget = null),
                      (this._curEventTarget = null),
                      (this.prevEvent = null),
                      (this.pointerIsDown = !1),
                      (this.pointerWasMoved = !1),
                      (this._interacting = !1),
                      (this.pointerType = r),
                      d.fire('new', this),
                      a.interactions.push(this);
                  }
                  return (
                    (t.prototype.pointerDown = function (t, e, n) {
                      var r = this.updatePointer(t, e, !0);
                      d.fire('down', {
                        pointer: t,
                        event: e,
                        eventTarget: n,
                        pointerIndex: r,
                        interaction: this,
                      });
                    }),
                    (t.prototype.start = function (t, e, n) {
                      this.interacting() ||
                        !this.pointerIsDown ||
                        this.pointerIds.length <
                          ('gesture' === t.name ? 2 : 1) ||
                        (-1 === a.interactions.indexOf(this) &&
                          a.interactions.push(this),
                        s.copyAction(this.prepared, t),
                        (this.target = e),
                        (this.element = n),
                        d.fire('action-start', {
                          interaction: this,
                          event: this.downEvent,
                        }));
                    }),
                    (t.prototype.pointerMove = function (e, n, r) {
                      this.simulation ||
                        (this.updatePointer(e),
                        s.setCoords(this.curCoords, this.pointers));
                      var o =
                          this.curCoords.page.x === this.prevCoords.page.x &&
                          this.curCoords.page.y === this.prevCoords.page.y &&
                          this.curCoords.client.x ===
                            this.prevCoords.client.x &&
                          this.curCoords.client.y === this.prevCoords.client.y,
                        i = void 0,
                        a = void 0;
                      this.pointerIsDown &&
                        !this.pointerWasMoved &&
                        ((i =
                          this.curCoords.client.x - this.startCoords.client.x),
                        (a =
                          this.curCoords.client.y - this.startCoords.client.y),
                        (this.pointerWasMoved =
                          s.hypot(i, a) > t.pointerMoveTolerance));
                      var c = {
                        pointer: e,
                        pointerIndex: this.getPointerIndex(e),
                        event: n,
                        eventTarget: r,
                        dx: i,
                        dy: a,
                        duplicate: o,
                        interaction: this,
                        interactingBeforeMove: this.interacting(),
                      };
                      o ||
                        s.setCoordDeltas(
                          this.pointerDelta,
                          this.prevCoords,
                          this.curCoords
                        ),
                        d.fire('move', c),
                        o ||
                          (this.interacting() && this.doMove(c),
                          this.pointerWasMoved &&
                            s.copyCoords(this.prevCoords, this.curCoords));
                    }),
                    (t.prototype.doMove = function (t) {
                      (t = s.extend(
                        {
                          pointer: this.pointers[0],
                          event: this.prevEvent,
                          eventTarget: this._eventTarget,
                          interaction: this,
                        },
                        t || {}
                      )),
                        d.fire('before-action-move', t),
                        this._dontFireMove || d.fire('action-move', t),
                        (this._dontFireMove = !1);
                    }),
                    (t.prototype.pointerUp = function (t, e, n, r) {
                      var o = this.getPointerIndex(t);
                      d.fire(/cancel$/i.test(e.type) ? 'cancel' : 'up', {
                        pointer: t,
                        pointerIndex: o,
                        event: e,
                        eventTarget: n,
                        curEventTarget: r,
                        interaction: this,
                      }),
                        this.simulation || this.end(e),
                        (this.pointerIsDown = !1),
                        this.removePointer(t, e);
                    }),
                    (t.prototype.end = function (t) {
                      (t = t || this.prevEvent),
                        this.interacting() &&
                          d.fire('action-end', {
                            event: t,
                            interaction: this,
                          }),
                        this.stop();
                    }),
                    (t.prototype.currentAction = function () {
                      return this._interacting ? this.prepared.name : null;
                    }),
                    (t.prototype.interacting = function () {
                      return this._interacting;
                    }),
                    (t.prototype.stop = function () {
                      d.fire('stop', {
                        interaction: this,
                      }),
                        this._interacting &&
                          (d.fire('stop-active', {
                            interaction: this,
                          }),
                          d.fire('stop-' + this.prepared.name, {
                            interaction: this,
                          })),
                        (this.target = this.element = null),
                        (this._interacting = !1),
                        (this.prepared.name = this.prevEvent = null);
                    }),
                    (t.prototype.getPointerIndex = function (t) {
                      return 'mouse' === this.pointerType ||
                        'pen' === this.pointerType
                        ? 0
                        : this.pointerIds.indexOf(s.getPointerId(t));
                    }),
                    (t.prototype.updatePointer = function (t, e) {
                      var n =
                          arguments.length > 2 && arguments[2] !== undefined
                            ? arguments[2]
                            : e && /(down|start)$/i.test(e.type),
                        r = s.getPointerId(t),
                        o = this.getPointerIndex(t);
                      return (
                        -1 === o &&
                          ((o = this.pointerIds.length),
                          (this.pointerIds[o] = r)),
                        n &&
                          d.fire('update-pointer-down', {
                            pointer: t,
                            event: e,
                            down: n,
                            pointerId: r,
                            pointerIndex: o,
                            interaction: this,
                          }),
                        (this.pointers[o] = t),
                        o
                      );
                    }),
                    (t.prototype.removePointer = function (t, e) {
                      var n = this.getPointerIndex(t);
                      -1 !== n &&
                        (d.fire('remove-pointer', {
                          pointer: t,
                          event: e,
                          pointerIndex: n,
                          interaction: this,
                        }),
                        this.pointers.splice(n, 1),
                        this.pointerIds.splice(n, 1),
                        this.downTargets.splice(n, 1),
                        this.downTimes.splice(n, 1));
                    }),
                    (t.prototype._updateEventTargets = function (t, e) {
                      (this._eventTarget = t), (this._curEventTarget = e);
                    }),
                    t
                  );
                })(),
                m = 0;
              m < h.length;
              m++
            ) {
              var y = h[m];
              f[y] = r(y);
            }
            var x = {},
              b = l.pEventTypes;
            u.PointerEvent
              ? ((x[b.down] = f.pointerDown),
                (x[b.move] = f.pointerMove),
                (x[b.up] = f.pointerUp),
                (x[b.cancel] = f.pointerUp))
              : ((x.mousedown = f.pointerDown),
                (x.mousemove = f.pointerMove),
                (x.mouseup = f.pointerUp),
                (x.touchstart = f.pointerDown),
                (x.touchmove = f.pointerMove),
                (x.touchend = f.pointerUp),
                (x.touchcancel = f.pointerUp)),
              (x.blur = o),
              d.on('update-pointer-down', function (t) {
                var e = t.interaction,
                  n = t.pointer,
                  r = t.pointerId,
                  o = t.pointerIndex,
                  i = t.event,
                  a = t.eventTarget,
                  c = t.down;
                (e.pointerIds[o] = r),
                  (e.pointers[o] = n),
                  c && (e.pointerIsDown = !0),
                  e.interacting() ||
                    (s.setCoords(e.startCoords, e.pointers),
                    s.copyCoords(e.curCoords, e.startCoords),
                    s.copyCoords(e.prevCoords, e.startCoords),
                    (e.downEvent = i),
                    (e.downTimes[o] = e.curCoords.timeStamp),
                    (e.downTargets[o] = a || (i && s.getEventTargets(i)[0])),
                    (e.pointerWasMoved = !1),
                    s.pointerExtend(e.downPointer, n));
              }),
              a.signals.on('add-document', i),
              a.signals.on('remove-document', i),
              (v.pointerMoveTolerance = 1),
              (v.doOnInteractions = r),
              (v.endAll = o),
              (v.signals = d),
              (v.docEvents = x),
              (a.endAllInteractions = o),
              (e.exports = v);
          },
          {
            './scope': 33,
            './utils': 43,
            './utils/Signals': 34,
            './utils/browser': 36,
            './utils/domObjects': 37,
            './utils/events': 39,
            './utils/interactionFinder': 44,
          },
        ],
        6: [
          function (t, e) {
            'use strict';
            function n(t, e, n, r) {
              var i = t.prepared.name,
                a = new o(t, e, i, n, t.element, null, r);
              t.target.fire(a), (t.prevEvent = a);
            }
            var r = t('../Interaction'),
              o = t('../InteractEvent'),
              i = { firePrepared: n, names: [], methodDict: {} };
            r.signals.on('action-start', function (t) {
              var e = t.interaction,
                r = t.event;
              (e._interacting = !0), n(e, r, 'start');
            }),
              r.signals.on('action-move', function (t) {
                var e = t.interaction;
                if ((n(e, t.event, 'move', t.preEnd), !e.interacting()))
                  return !1;
              }),
              r.signals.on('action-end', function (t) {
                n(t.interaction, t.event, 'end');
              }),
              (e.exports = i);
          },
          { '../InteractEvent': 3, '../Interaction': 5 },
        ],
        7: [
          function (t, e) {
            'use strict';
            var n = t('./base'),
              r = t('../utils'),
              o = t('../InteractEvent'),
              i = t('../Interactable'),
              a = t('../Interaction'),
              s = t('../defaultOptions'),
              c = {
                defaults: {
                  enabled: !1,
                  mouseButtons: null,
                  origin: null,
                  snap: null,
                  restrict: null,
                  inertia: null,
                  autoScroll: null,
                  startAxis: 'xy',
                  lockAxis: 'xy',
                },
                checker: function (t, e, n) {
                  var r = n.options.drag;
                  return r.enabled
                    ? {
                        name: 'drag',
                        axis: 'start' === r.lockAxis ? r.startAxis : r.lockAxis,
                      }
                    : null;
                },
                getCursor: function () {
                  return 'move';
                },
              };
            a.signals.on('before-action-move', function (t) {
              var e = t.interaction;
              if ('drag' === e.prepared.name) {
                var n = e.prepared.axis;
                'x' === n
                  ? ((e.curCoords.page.y = e.startCoords.page.y),
                    (e.curCoords.client.y = e.startCoords.client.y),
                    (e.pointerDelta.page.speed = Math.abs(
                      e.pointerDelta.page.vx
                    )),
                    (e.pointerDelta.client.speed = Math.abs(
                      e.pointerDelta.client.vx
                    )),
                    (e.pointerDelta.client.vy = 0),
                    (e.pointerDelta.page.vy = 0))
                  : 'y' === n &&
                    ((e.curCoords.page.x = e.startCoords.page.x),
                    (e.curCoords.client.x = e.startCoords.client.x),
                    (e.pointerDelta.page.speed = Math.abs(
                      e.pointerDelta.page.vy
                    )),
                    (e.pointerDelta.client.speed = Math.abs(
                      e.pointerDelta.client.vy
                    )),
                    (e.pointerDelta.client.vx = 0),
                    (e.pointerDelta.page.vx = 0));
              }
            }),
              o.signals.on('new', function (t) {
                var e = t.iEvent,
                  n = t.interaction;
                if ('dragmove' === e.type) {
                  var r = n.prepared.axis;
                  'x' === r
                    ? ((e.pageY = n.startCoords.page.y),
                      (e.clientY = n.startCoords.client.y),
                      (e.dy = 0))
                    : 'y' === r &&
                      ((e.pageX = n.startCoords.page.x),
                      (e.clientX = n.startCoords.client.x),
                      (e.dx = 0));
                }
              }),
              (i.prototype.draggable = function (t) {
                return r.is.object(t)
                  ? ((this.options.drag.enabled = !1 !== t.enabled),
                    this.setPerAction('drag', t),
                    this.setOnEvents('drag', t),
                    /^(xy|x|y|start)$/.test(t.lockAxis) &&
                      (this.options.drag.lockAxis = t.lockAxis),
                    /^(xy|x|y)$/.test(t.startAxis) &&
                      (this.options.drag.startAxis = t.startAxis),
                    this)
                  : r.is.bool(t)
                  ? ((this.options.drag.enabled = t),
                    t ||
                      (this.ondragstart =
                        this.ondragstart =
                        this.ondragend =
                          null),
                    this)
                  : this.options.drag;
              }),
              (n.drag = c),
              n.names.push('drag'),
              r.merge(i.eventTypes, [
                'dragstart',
                'dragmove',
                'draginertiastart',
                'draginertiaresume',
                'dragend',
              ]),
              (n.methodDict.drag = 'draggable'),
              (s.drag = c.defaults),
              (e.exports = c);
          },
          {
            '../InteractEvent': 3,
            '../Interactable': 4,
            '../Interaction': 5,
            '../defaultOptions': 18,
            '../utils': 43,
            './base': 6,
          },
        ],
        8: [
          function (t, e) {
            'use strict';
            function n(t, e) {
              var n = [],
                r = [];
              e = e || t.element;
              for (var o = 0; o < u.interactables.length; o++) {
                var i;
                i = u.interactables[o];
                var a = i;
                if (a.options.drop.enabled) {
                  var s = a.options.drop.accept;
                  if (
                    !(
                      (l.is.element(s) && s !== e) ||
                      (l.is.string(s) && !l.matchesSelector(e, s))
                    )
                  )
                    for (
                      var c = l.is.string(a.target)
                          ? a._context.querySelectorAll(a.target)
                          : [a.target],
                        p = 0;
                      p < c.length;
                      p++
                    ) {
                      var d;
                      d = c[p];
                      var f = d;
                      f !== e && (n.push(a), r.push(f));
                    }
                }
              }
              return { elements: r, dropzones: n };
            }
            function r(t, e) {
              for (
                var n = void 0, r = 0;
                r < t.activeDrops.dropzones.length;
                r++
              ) {
                var o = t.activeDrops.dropzones[r],
                  i = t.activeDrops.elements[r];
                i !== n && ((e.target = i), o.fire(e)), (n = i);
              }
            }
            function o(t, e) {
              var r = n(t, e, !0);
              (t.activeDrops.dropzones = r.dropzones),
                (t.activeDrops.elements = r.elements),
                (t.activeDrops.rects = []);
              for (var o = 0; o < t.activeDrops.dropzones.length; o++)
                t.activeDrops.rects[o] = t.activeDrops.dropzones[o].getRect(
                  t.activeDrops.elements[o]
                );
            }
            function i(t, e, n) {
              var r = t.interaction,
                i = [];
              m && o(r, n);
              for (var a = 0; a < r.activeDrops.dropzones.length; a++) {
                var s = r.activeDrops.dropzones[a],
                  c = r.activeDrops.elements[a],
                  u = r.activeDrops.rects[a];
                i.push(s.dropCheck(t, e, r.target, n, c, u) ? c : null);
              }
              var p = l.indexOfDeepestElement(i);
              return {
                dropzone: r.activeDrops.dropzones[p] || null,
                element: r.activeDrops.elements[p] || null,
              };
            }
            function a(t, e, n) {
              var r = {
                  enter: null,
                  leave: null,
                  activate: null,
                  deactivate: null,
                  move: null,
                  drop: null,
                },
                o = {
                  dragEvent: n,
                  interaction: t,
                  target: t.dropElement,
                  dropzone: t.dropTarget,
                  relatedTarget: n.target,
                  draggable: n.interactable,
                  timeStamp: n.timeStamp,
                };
              return (
                t.dropElement !== t.prevDropElement &&
                  (t.prevDropTarget &&
                    ((r.leave = l.extend({ type: 'dragleave' }, o)),
                    (n.dragLeave = r.leave.target = t.prevDropElement),
                    (n.prevDropzone = r.leave.dropzone = t.prevDropTarget)),
                  t.dropTarget &&
                    ((r.enter = {
                      dragEvent: n,
                      interaction: t,
                      target: t.dropElement,
                      dropzone: t.dropTarget,
                      relatedTarget: n.target,
                      draggable: n.interactable,
                      timeStamp: n.timeStamp,
                      type: 'dragenter',
                    }),
                    (n.dragEnter = t.dropElement),
                    (n.dropzone = t.dropTarget))),
                'dragend' === n.type &&
                  t.dropTarget &&
                  ((r.drop = l.extend({ type: 'drop' }, o)),
                  (n.dropzone = t.dropTarget),
                  (n.relatedTarget = t.dropElement)),
                'dragstart' === n.type &&
                  ((r.activate = l.extend({ type: 'dropactivate' }, o)),
                  (r.activate.target = null),
                  (r.activate.dropzone = null)),
                'dragend' === n.type &&
                  ((r.deactivate = l.extend({ type: 'dropdeactivate' }, o)),
                  (r.deactivate.target = null),
                  (r.deactivate.dropzone = null)),
                'dragmove' === n.type &&
                  t.dropTarget &&
                  ((r.move = l.extend({ dragmove: n, type: 'dropmove' }, o)),
                  (n.dropzone = t.dropTarget)),
                r
              );
            }
            function s(t, e) {
              e.leave && t.prevDropTarget.fire(e.leave),
                e.move && t.dropTarget.fire(e.move),
                e.enter && t.dropTarget.fire(e.enter),
                e.drop && t.dropTarget.fire(e.drop),
                e.deactivate && r(t, e.deactivate),
                (t.prevDropTarget = t.dropTarget),
                (t.prevDropElement = t.dropElement);
            }
            var c = t('./base'),
              l = t('../utils'),
              u = t('../scope'),
              p = t('../interact'),
              d = t('../InteractEvent'),
              f = t('../Interactable'),
              h = t('../Interaction'),
              g = t('../defaultOptions'),
              v = {
                defaults: {
                  enabled: !1,
                  accept: null,
                  overlap: 'pointer',
                },
              },
              m = !1;
            h.signals.on('action-start', function (t) {
              var e = t.interaction,
                n = t.event;
              if ('drag' === e.prepared.name) {
                (e.activeDrops.dropzones = []),
                  (e.activeDrops.elements = []),
                  (e.activeDrops.rects = []),
                  (e.dropEvents = null),
                  e.dynamicDrop || o(e, e.element);
                var i = e.prevEvent,
                  s = a(e, n, i);
                s.activate && r(e, s.activate);
              }
            }),
              d.signals.on('new', function (t) {
                var e = t.interaction,
                  n = t.iEvent,
                  r = t.event;
                if ('dragmove' === n.type || 'dragend' === n.type) {
                  var o = e.element,
                    s = n,
                    c = i(s, r, o);
                  (e.dropTarget = c.dropzone),
                    (e.dropElement = c.element),
                    (e.dropEvents = a(e, r, s));
                }
              }),
              h.signals.on('action-move', function (t) {
                var e = t.interaction;
                'drag' === e.prepared.name && s(e, e.dropEvents);
              }),
              h.signals.on('action-end', function (t) {
                var e = t.interaction;
                'drag' === e.prepared.name && s(e, e.dropEvents);
              }),
              h.signals.on('stop-drag', function (t) {
                var e = t.interaction;
                e.activeDrops.dropzones =
                  e.activeDrops.elements =
                  e.activeDrops.rects =
                  e.dropEvents =
                    null;
              }),
              (f.prototype.dropzone = function (t) {
                return l.is.object(t)
                  ? ((this.options.drop.enabled = !1 !== t.enabled),
                    l.is['function'](t.ondrop) &&
                      (this.events.ondrop = t.ondrop),
                    l.is['function'](t.ondropactivate) &&
                      (this.events.ondropactivate = t.ondropactivate),
                    l.is['function'](t.ondropdeactivate) &&
                      (this.events.ondropdeactivate = t.ondropdeactivate),
                    l.is['function'](t.ondragenter) &&
                      (this.events.ondragenter = t.ondragenter),
                    l.is['function'](t.ondragleave) &&
                      (this.events.ondragleave = t.ondragleave),
                    l.is['function'](t.ondropmove) &&
                      (this.events.ondropmove = t.ondropmove),
                    /^(pointer|center)$/.test(t.overlap)
                      ? (this.options.drop.overlap = t.overlap)
                      : l.is.number(t.overlap) &&
                        (this.options.drop.overlap = Math.max(
                          Math.min(1, t.overlap),
                          0
                        )),
                    'accept' in t && (this.options.drop.accept = t.accept),
                    'checker' in t && (this.options.drop.checker = t.checker),
                    this)
                  : l.is.bool(t)
                  ? ((this.options.drop.enabled = t),
                    t ||
                      (this.ondragenter =
                        this.ondragleave =
                        this.ondrop =
                        this.ondropactivate =
                        this.ondropdeactivate =
                          null),
                    this)
                  : this.options.drop;
              }),
              (f.prototype.dropCheck = function (t, e, n, r, o, i) {
                var a = !1;
                if (!(i = i || this.getRect(o)))
                  return (
                    !!this.options.drop.checker &&
                    this.options.drop.checker(t, e, a, this, o, n, r)
                  );
                var s = this.options.drop.overlap;
                if ('pointer' === s) {
                  var c = l.getOriginXY(n, r, 'drag'),
                    u = l.getPageXY(t);
                  (u.x += c.x), (u.y += c.y);
                  var p = u.x > i.left && u.x < i.right,
                    d = u.y > i.top && u.y < i.bottom;
                  a = p && d;
                }
                var f = n.getRect(r);
                if (f && 'center' === s) {
                  var h = f.left + f.width / 2,
                    g = f.top + f.height / 2;
                  a =
                    h >= i.left && h <= i.right && g >= i.top && g <= i.bottom;
                }
                if (f && l.is.number(s)) {
                  a =
                    (Math.max(
                      0,
                      Math.min(i.right, f.right) - Math.max(i.left, f.left)
                    ) *
                      Math.max(
                        0,
                        Math.min(i.bottom, f.bottom) - Math.max(i.top, f.top)
                      )) /
                      (f.width * f.height) >=
                    s;
                }
                return (
                  this.options.drop.checker &&
                    (a = this.options.drop.checker(t, e, a, this, o, n, r)),
                  a
                );
              }),
              f.signals.on('unset', function (t) {
                t.interactable.dropzone(!1);
              }),
              f.settingsMethods.push('dropChecker'),
              h.signals.on('new', function (t) {
                (t.dropTarget = null),
                  (t.dropElement = null),
                  (t.prevDropTarget = null),
                  (t.prevDropElement = null),
                  (t.dropEvents = null),
                  (t.activeDrops = {
                    dropzones: [],
                    elements: [],
                    rects: [],
                  });
              }),
              h.signals.on('stop', function (t) {
                var e = t.interaction;
                e.dropTarget =
                  e.dropElement =
                  e.prevDropTarget =
                  e.prevDropElement =
                    null;
              }),
              (p.dynamicDrop = function (t) {
                return l.is.bool(t) ? ((m = t), p) : m;
              }),
              l.merge(f.eventTypes, [
                'dragenter',
                'dragleave',
                'dropactivate',
                'dropdeactivate',
                'dropmove',
                'drop',
              ]),
              (c.methodDict.drop = 'dropzone'),
              (g.drop = v.defaults),
              (e.exports = v);
          },
          {
            '../InteractEvent': 3,
            '../Interactable': 4,
            '../Interaction': 5,
            '../defaultOptions': 18,
            '../interact': 21,
            '../scope': 33,
            '../utils': 43,
            './base': 6,
          },
        ],
        9: [
          function (t, e) {
            'use strict';
            var n = t('./base'),
              r = t('../utils'),
              o = t('../InteractEvent'),
              i = t('../Interactable'),
              a = t('../Interaction'),
              s = t('../defaultOptions'),
              c = {
                defaults: {
                  enabled: !1,
                  origin: null,
                  restrict: null,
                },
                checker: function (t, e, n, r, o) {
                  return o.pointerIds.length >= 2 ? { name: 'gesture' } : null;
                },
                getCursor: function () {
                  return '';
                },
              };
            o.signals.on('new', function (t) {
              var e = t.iEvent,
                n = t.interaction;
              'gesturestart' === e.type &&
                ((e.ds = 0),
                (n.gesture.startDistance = n.gesture.prevDistance = e.distance),
                (n.gesture.startAngle = n.gesture.prevAngle = e.angle),
                (n.gesture.scale = 1));
            }),
              o.signals.on('new', function (t) {
                var e = t.iEvent,
                  n = t.interaction;
                'gesturemove' === e.type &&
                  ((e.ds = e.scale - n.gesture.scale),
                  n.target.fire(e),
                  (n.gesture.prevAngle = e.angle),
                  (n.gesture.prevDistance = e.distance),
                  e.scale === Infinity ||
                    null === e.scale ||
                    e.scale === undefined ||
                    isNaN(e.scale) ||
                    (n.gesture.scale = e.scale));
              }),
              (i.prototype.gesturable = function (t) {
                return r.is.object(t)
                  ? ((this.options.gesture.enabled = !1 !== t.enabled),
                    this.setPerAction('gesture', t),
                    this.setOnEvents('gesture', t),
                    this)
                  : r.is.bool(t)
                  ? ((this.options.gesture.enabled = t),
                    t ||
                      (this.ongesturestart =
                        this.ongesturestart =
                        this.ongestureend =
                          null),
                    this)
                  : this.options.gesture;
              }),
              o.signals.on('set-delta', function (t) {
                var e = t.interaction,
                  n = t.iEvent,
                  i = t.action,
                  a = t.event,
                  s = t.starting,
                  c = t.ending,
                  l = t.deltaSource;
                if ('gesture' === i) {
                  var u = e.pointers;
                  (n.touches = [u[0], u[1]]),
                    s
                      ? ((n.distance = r.touchDistance(u, l)),
                        (n.box = r.touchBBox(u)),
                        (n.scale = 1),
                        (n.ds = 0),
                        (n.angle = r.touchAngle(u, undefined, l)),
                        (n.da = 0))
                      : c || a instanceof o
                      ? ((n.distance = e.prevEvent.distance),
                        (n.box = e.prevEvent.box),
                        (n.scale = e.prevEvent.scale),
                        (n.ds = n.scale - 1),
                        (n.angle = e.prevEvent.angle),
                        (n.da = n.angle - e.gesture.startAngle))
                      : ((n.distance = r.touchDistance(u, l)),
                        (n.box = r.touchBBox(u)),
                        (n.scale = n.distance / e.gesture.startDistance),
                        (n.angle = r.touchAngle(u, e.gesture.prevAngle, l)),
                        (n.ds = n.scale - e.gesture.prevScale),
                        (n.da = n.angle - e.gesture.prevAngle));
                }
              }),
              a.signals.on('new', function (t) {
                t.gesture = {
                  start: { x: 0, y: 0 },
                  startDistance: 0,
                  prevDistance: 0,
                  distance: 0,
                  scale: 1,
                  startAngle: 0,
                  prevAngle: 0,
                };
              }),
              (n.gesture = c),
              n.names.push('gesture'),
              r.merge(i.eventTypes, [
                'gesturestart',
                'gesturemove',
                'gestureend',
              ]),
              (n.methodDict.gesture = 'gesturable'),
              (s.gesture = c.defaults),
              (e.exports = c);
          },
          {
            '../InteractEvent': 3,
            '../Interactable': 4,
            '../Interaction': 5,
            '../defaultOptions': 18,
            '../utils': 43,
            './base': 6,
          },
        ],
        10: [
          function (t, e) {
            'use strict';
            function n(t, e, n, r, i, a, s) {
              if (!e) return !1;
              if (!0 === e) {
                var c = o.is.number(a.width) ? a.width : a.right - a.left,
                  l = o.is.number(a.height) ? a.height : a.bottom - a.top;
                if (
                  (c < 0 &&
                    ('left' === t
                      ? (t = 'right')
                      : 'right' === t && (t = 'left')),
                  l < 0 &&
                    ('top' === t
                      ? (t = 'bottom')
                      : 'bottom' === t && (t = 'top')),
                  'left' === t)
                )
                  return n.x < (c >= 0 ? a.left : a.right) + s;
                if ('top' === t) return n.y < (l >= 0 ? a.top : a.bottom) + s;
                if ('right' === t) return n.x > (c >= 0 ? a.right : a.left) - s;
                if ('bottom' === t)
                  return n.y > (l >= 0 ? a.bottom : a.top) - s;
              }
              return (
                !!o.is.element(r) &&
                (o.is.element(e) ? e === r : o.matchesUpTo(r, e, i))
              );
            }
            var r = t('./base'),
              o = t('../utils'),
              i = t('../utils/browser'),
              a = t('../InteractEvent'),
              s = t('../Interactable'),
              c = t('../Interaction'),
              l = t('../defaultOptions'),
              u = i.supportsTouch || i.supportsPointerEvent ? 20 : 10,
              p = {
                defaults: {
                  enabled: !1,
                  mouseButtons: null,
                  origin: null,
                  snap: null,
                  restrict: null,
                  inertia: null,
                  autoScroll: null,
                  square: !1,
                  preserveAspectRatio: !1,
                  axis: 'xy',
                  margin: NaN,
                  edges: null,
                  invert: 'none',
                },
                checker: function (t, e, r, i, a, s) {
                  if (!s) return null;
                  var c = o.extend({}, a.curCoords.page),
                    l = r.options;
                  if (l.resize.enabled) {
                    var p = l.resize,
                      d = {
                        left: !1,
                        right: !1,
                        top: !1,
                        bottom: !1,
                      };
                    if (o.is.object(p.edges)) {
                      for (var f in d)
                        d[f] = n(
                          f,
                          p.edges[f],
                          c,
                          a._eventTarget,
                          i,
                          s,
                          p.margin || u
                        );
                      if (
                        ((d.left = d.left && !d.right),
                        (d.top = d.top && !d.bottom),
                        d.left || d.right || d.top || d.bottom)
                      )
                        return {
                          name: 'resize',
                          edges: d,
                        };
                    } else {
                      var h = 'y' !== l.resize.axis && c.x > s.right - u,
                        g = 'x' !== l.resize.axis && c.y > s.bottom - u;
                      if (h || g)
                        return {
                          name: 'resize',
                          axes: (h ? 'x' : '') + (g ? 'y' : ''),
                        };
                    }
                  }
                  return null;
                },
                cursors: i.isIe9
                  ? {
                      x: 'e-resize',
                      y: 's-resize',
                      xy: 'se-resize',
                      top: 'n-resize',
                      left: 'w-resize',
                      bottom: 's-resize',
                      right: 'e-resize',
                      topleft: 'se-resize',
                      bottomright: 'se-resize',
                      topright: 'ne-resize',
                      bottomleft: 'ne-resize',
                    }
                  : {
                      x: 'ew-resize',
                      y: 'ns-resize',
                      xy: 'nwse-resize',
                      top: 'ns-resize',
                      left: 'ew-resize',
                      bottom: 'ns-resize',
                      right: 'ew-resize',
                      topleft: 'nwse-resize',
                      bottomright: 'nwse-resize',
                      topright: 'nesw-resize',
                      bottomleft: 'nesw-resize',
                    },
                getCursor: function (t) {
                  if (t.axis) return p.cursors[t.name + t.axis];
                  if (t.edges) {
                    for (
                      var e = '', n = ['top', 'bottom', 'left', 'right'], r = 0;
                      r < 4;
                      r++
                    )
                      t.edges[n[r]] && (e += n[r]);
                    return p.cursors[e];
                  }
                },
              };
            a.signals.on('new', function (t) {
              var e = t.iEvent,
                n = t.interaction;
              if ('resizestart' === e.type && n.prepared.edges) {
                var r = n.target.getRect(n.element),
                  i = n.target.options.resize;
                if (i.square || i.preserveAspectRatio) {
                  var a = o.extend({}, n.prepared.edges);
                  (a.top = a.top || (a.left && !a.bottom)),
                    (a.left = a.left || (a.top && !a.right)),
                    (a.bottom = a.bottom || (a.right && !a.top)),
                    (a.right = a.right || (a.bottom && !a.left)),
                    (n.prepared._linkedEdges = a);
                } else n.prepared._linkedEdges = null;
                i.preserveAspectRatio &&
                  (n.resizeStartAspectRatio = r.width / r.height),
                  (n.resizeRects = {
                    start: r,
                    current: o.extend({}, r),
                    inverted: o.extend({}, r),
                    previous: o.extend({}, r),
                    delta: {
                      left: 0,
                      right: 0,
                      width: 0,
                      top: 0,
                      bottom: 0,
                      height: 0,
                    },
                  }),
                  (e.rect = n.resizeRects.inverted),
                  (e.deltaRect = n.resizeRects.delta);
              }
            }),
              a.signals.on('new', function (t) {
                var e = t.iEvent,
                  n = t.phase,
                  r = t.interaction;
                if ('move' === n && r.prepared.edges) {
                  var i = r.target.options.resize,
                    a = i.invert,
                    s = 'reposition' === a || 'negate' === a,
                    c = r.prepared.edges,
                    l = r.resizeRects.start,
                    u = r.resizeRects.current,
                    p = r.resizeRects.inverted,
                    d = r.resizeRects.delta,
                    f = o.extend(r.resizeRects.previous, p),
                    h = c,
                    g = e.dx,
                    v = e.dy;
                  if (i.preserveAspectRatio || i.square) {
                    var m = i.preserveAspectRatio
                      ? r.resizeStartAspectRatio
                      : 1;
                    (c = r.prepared._linkedEdges),
                      (h.left && h.bottom) || (h.right && h.top)
                        ? (v = -g / m)
                        : h.left || h.right
                        ? (v = g / m)
                        : (h.top || h.bottom) && (g = v * m);
                  }
                  if (
                    (c.top && (u.top += v),
                    c.bottom && (u.bottom += v),
                    c.left && (u.left += g),
                    c.right && (u.right += g),
                    s)
                  ) {
                    if ((o.extend(p, u), 'reposition' === a)) {
                      var y = void 0;
                      p.top > p.bottom &&
                        ((y = p.top), (p.top = p.bottom), (p.bottom = y)),
                        p.left > p.right &&
                          ((y = p.left), (p.left = p.right), (p.right = y));
                    }
                  } else
                    (p.top = Math.min(u.top, l.bottom)),
                      (p.bottom = Math.max(u.bottom, l.top)),
                      (p.left = Math.min(u.left, l.right)),
                      (p.right = Math.max(u.right, l.left));
                  (p.width = p.right - p.left), (p.height = p.bottom - p.top);
                  for (var x in p) d[x] = p[x] - f[x];
                  (e.edges = r.prepared.edges), (e.rect = p), (e.deltaRect = d);
                }
              }),
              (s.prototype.resizable = function (t) {
                return o.is.object(t)
                  ? ((this.options.resize.enabled = !1 !== t.enabled),
                    this.setPerAction('resize', t),
                    this.setOnEvents('resize', t),
                    /^x$|^y$|^xy$/.test(t.axis)
                      ? (this.options.resize.axis = t.axis)
                      : null === t.axis &&
                        (this.options.resize.axis = l.resize.axis),
                    o.is.bool(t.preserveAspectRatio)
                      ? (this.options.resize.preserveAspectRatio =
                          t.preserveAspectRatio)
                      : o.is.bool(t.square) &&
                        (this.options.resize.square = t.square),
                    this)
                  : o.is.bool(t)
                  ? ((this.options.resize.enabled = t),
                    t ||
                      (this.onresizestart =
                        this.onresizestart =
                        this.onresizeend =
                          null),
                    this)
                  : this.options.resize;
              }),
              c.signals.on('new', function (t) {
                t.resizeAxes = 'xy';
              }),
              a.signals.on('set-delta', function (t) {
                var e = t.interaction,
                  n = t.iEvent;
                'resize' === t.action &&
                  e.resizeAxes &&
                  (e.target.options.resize.square
                    ? ('y' === e.resizeAxes ? (n.dx = n.dy) : (n.dy = n.dx),
                      (n.axes = 'xy'))
                    : ((n.axes = e.resizeAxes),
                      'x' === e.resizeAxes
                        ? (n.dy = 0)
                        : 'y' === e.resizeAxes && (n.dx = 0)));
              }),
              (r.resize = p),
              r.names.push('resize'),
              o.merge(s.eventTypes, [
                'resizestart',
                'resizemove',
                'resizeinertiastart',
                'resizeinertiaresume',
                'resizeend',
              ]),
              (r.methodDict.resize = 'resizable'),
              (l.resize = p.defaults),
              (e.exports = p);
          },
          {
            '../InteractEvent': 3,
            '../Interactable': 4,
            '../Interaction': 5,
            '../defaultOptions': 18,
            '../utils': 43,
            '../utils/browser': 36,
            './base': 6,
          },
        ],
        11: [
          function (t, e) {
            'use strict';
            var n = t('./utils/raf'),
              r = t('./utils/window').getWindow,
              o = t('./utils/is'),
              i = t('./utils/domUtils'),
              a = t('./Interaction'),
              s = t('./defaultOptions'),
              c = {
                defaults: {
                  enabled: !1,
                  container: null,
                  margin: 60,
                  speed: 300,
                },
                interaction: null,
                i: null,
                x: 0,
                y: 0,
                isScrolling: !1,
                prevTime: 0,
                start: function (t) {
                  (c.isScrolling = !0),
                    n.cancel(c.i),
                    (c.interaction = t),
                    (c.prevTime = new Date().getTime()),
                    (c.i = n.request(c.scroll));
                },
                stop: function () {
                  (c.isScrolling = !1), n.cancel(c.i);
                },
                scroll: function () {
                  var t =
                      c.interaction.target.options[c.interaction.prepared.name]
                        .autoScroll,
                    e = t.container || r(c.interaction.element),
                    i = new Date().getTime(),
                    a = (i - c.prevTime) / 1e3,
                    s = t.speed * a;
                  s >= 1 &&
                    (o.window(e)
                      ? e.scrollBy(c.x * s, c.y * s)
                      : e && (e.scrollLeft += c.x * s),
                    (c.prevTime = i)),
                    c.isScrolling &&
                      (n.cancel(c.i), (c.i = n.request(c.scroll)));
                },
                check: function (t, e) {
                  var n = t.options;
                  return n[e].autoScroll && n[e].autoScroll.enabled;
                },
                onInteractionMove: function (t) {
                  var e = t.interaction,
                    n = t.pointer;
                  if (e.interacting() && c.check(e.target, e.prepared.name)) {
                    if (e.simulation) return void (c.x = c.y = 0);
                    var a = void 0,
                      s = void 0,
                      l = void 0,
                      u = void 0,
                      p = e.target.options[e.prepared.name].autoScroll,
                      d = p.container || r(e.element);
                    if (o.window(d))
                      (u = n.clientX < c.margin),
                        (a = n.clientY < c.margin),
                        (s = n.clientX > d.innerWidth - c.margin),
                        (l = n.clientY > d.innerHeight - c.margin);
                    else {
                      var f = i.getElementClientRect(d);
                      (u = n.clientX < f.left + c.margin),
                        (a = n.clientY < f.top + c.margin),
                        (s = n.clientX > f.right - c.margin),
                        (l = n.clientY > f.bottom - c.margin);
                    }
                    (c.x = s ? 1 : u ? -1 : 0),
                      (c.y = l ? 1 : a ? -1 : 0),
                      c.isScrolling ||
                        ((c.margin = p.margin),
                        (c.speed = p.speed),
                        c.start(e));
                  }
                },
              };
            a.signals.on('stop-active', function () {
              c.stop();
            }),
              a.signals.on('action-move', c.onInteractionMove),
              (s.perAction.autoScroll = c.defaults),
              (e.exports = c);
          },
          {
            './Interaction': 5,
            './defaultOptions': 18,
            './utils/domUtils': 38,
            './utils/is': 45,
            './utils/raf': 49,
            './utils/window': 51,
          },
        ],
        12: [
          function (t) {
            'use strict';
            var e = t('../Interactable'),
              n = t('../actions/base'),
              r = t('../utils/is'),
              o = t('../utils/domUtils'),
              i = t('../utils'),
              a = i.warnOnce;
            (e.prototype.getAction = function (t, e, n, r) {
              var o = this.defaultActionChecker(t, e, n, r);
              return this.options.actionChecker
                ? this.options.actionChecker(t, e, o, this, r, n)
                : o;
            }),
              (e.prototype.ignoreFrom = a(function (t) {
                return this._backCompatOption('ignoreFrom', t);
              }, 'Interactable.ignoreForm() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue}).')),
              (e.prototype.allowFrom = a(function (t) {
                return this._backCompatOption('allowFrom', t);
              }, 'Interactable.allowForm() has been deprecated. Use Interactble.draggable({allowFrom: newValue}).')),
              (e.prototype.testIgnore = function (t, e, n) {
                return (
                  !(!t || !r.element(n)) &&
                  (r.string(t)
                    ? o.matchesUpTo(n, t, e)
                    : !!r.element(t) && o.nodeContains(t, n))
                );
              }),
              (e.prototype.testAllow = function (t, e, n) {
                return (
                  !t ||
                  (!!r.element(n) &&
                    (r.string(t)
                      ? o.matchesUpTo(n, t, e)
                      : !!r.element(t) && o.nodeContains(t, n)))
                );
              }),
              (e.prototype.testIgnoreAllow = function (t, e, n) {
                return (
                  !this.testIgnore(t.ignoreFrom, e, n) &&
                  this.testAllow(t.allowFrom, e, n)
                );
              }),
              (e.prototype.actionChecker = function (t) {
                return r['function'](t)
                  ? ((this.options.actionChecker = t), this)
                  : null === t
                  ? (delete this.options.actionChecker, this)
                  : this.options.actionChecker;
              }),
              (e.prototype.styleCursor = function (t) {
                return r.bool(t)
                  ? ((this.options.styleCursor = t), this)
                  : null === t
                  ? (delete this.options.styleCursor, this)
                  : this.options.styleCursor;
              }),
              (e.prototype.defaultActionChecker = function (t, e, r, o) {
                for (
                  var i = this.getRect(o),
                    a = e.buttons || { 0: 1, 1: 4, 3: 8, 4: 16 }[e.button],
                    s = null,
                    c = 0;
                  c < n.names.length;
                  c++
                ) {
                  var l;
                  l = n.names[c];
                  var u = l;
                  if (
                    (!r.pointerIsDown ||
                      !/mouse|pointer/.test(r.pointerType) ||
                      0 != (a & this.options[u].mouseButtons)) &&
                    (s = n[u].checker(t, e, this, o, r, i))
                  )
                    return s;
                }
              });
          },
          {
            '../Interactable': 4,
            '../actions/base': 6,
            '../utils': 43,
            '../utils/domUtils': 38,
            '../utils/is': 45,
          },
        ],
        13: [
          function (t, e) {
            'use strict';
            function n(t, e, n, r) {
              return f.is.object(t) &&
                e.testIgnoreAllow(e.options[t.name], n, r) &&
                e.options[t.name].enabled &&
                a(e, n, t)
                ? t
                : null;
            }
            function r(t, e, r, o, i, a) {
              for (var s = 0, c = o.length; s < c; s++) {
                var l = o[s],
                  u = i[s],
                  p = n(l.getAction(e, r, t, u), l, u, a);
                if (p) return { action: p, target: l, element: u };
              }
              return {};
            }
            function o(t, e, n, o) {
              function i(t) {
                a.push(t), s.push(c);
              }
              for (var a = [], s = [], c = o; f.is.element(c); ) {
                (a = []), (s = []), d.interactables.forEachMatch(c, i);
                var l = r(t, e, n, a, s, o);
                if (l.action && !l.target.options[l.action.name].manualStart)
                  return l;
                c = f.parentNode(c);
              }
              return {};
            }
            function i(t, e) {
              var n = e.action,
                r = e.target,
                o = e.element;
              if (
                ((n = n || {}),
                t.target &&
                  t.target.options.styleCursor &&
                  (t.target._doc.documentElement.style.cursor = ''),
                (t.target = r),
                (t.element = o),
                f.copyAction(t.prepared, n),
                r && r.options.styleCursor)
              ) {
                var i = n ? u[n.name].getCursor(n) : '';
                t.target._doc.documentElement.style.cursor = i;
              }
              h.fire('prepared', { interaction: t });
            }
            function a(t, e, n) {
              var r = t.options,
                o = r[n.name].max,
                i = r[n.name].maxPerElement,
                a = 0,
                s = 0,
                c = 0;
              if (o && i && g.maxInteractions) {
                for (var l = 0; l < d.interactions.length; l++) {
                  var u;
                  u = d.interactions[l];
                  var p = u,
                    f = p.prepared.name;
                  if (p.interacting()) {
                    if (++a >= g.maxInteractions) return !1;
                    if (p.target === t) {
                      if ((s += (f === n.name) | 0) >= o) return !1;
                      if (p.element === e && (c++, f !== n.name || c >= i))
                        return !1;
                    }
                  }
                }
                return g.maxInteractions > 0;
              }
            }
            var s = t('../interact'),
              c = t('../Interactable'),
              l = t('../Interaction'),
              u = t('../actions/base'),
              p = t('../defaultOptions'),
              d = t('../scope'),
              f = t('../utils'),
              h = t('../utils/Signals')['new']();
            t('./InteractableMethods');
            var g = {
              signals: h,
              withinInteractionLimit: a,
              maxInteractions: Infinity,
              defaults: {
                perAction: {
                  manualStart: !1,
                  max: Infinity,
                  maxPerElement: 1,
                  allowFrom: null,
                  ignoreFrom: null,
                  mouseButtons: 1,
                },
              },
              setActionDefaults: function (t) {
                f.extend(t.defaults, g.defaults.perAction);
              },
              validateAction: n,
            };
            l.signals.on('down', function (t) {
              var e = t.interaction,
                n = t.pointer,
                r = t.event,
                a = t.eventTarget;
              if (!e.interacting()) {
                i(e, o(e, n, r, a));
              }
            }),
              l.signals.on('move', function (t) {
                var e = t.interaction,
                  n = t.pointer,
                  r = t.event,
                  a = t.eventTarget;
                if (
                  'mouse' === e.pointerType &&
                  !e.pointerIsDown &&
                  !e.interacting()
                ) {
                  i(e, o(e, n, r, a));
                }
              }),
              l.signals.on('move', function (t) {
                var e = t.interaction,
                  n = t.event;
                if (
                  e.pointerIsDown &&
                  !e.interacting() &&
                  e.pointerWasMoved &&
                  e.prepared.name
                ) {
                  h.fire('before-start', t);
                  var r = e.target;
                  e.prepared.name &&
                    r &&
                    (r.options[e.prepared.name].manualStart ||
                    !a(r, e.element, e.prepared)
                      ? e.stop(n)
                      : e.start(e.prepared, r, e.element));
                }
              }),
              l.signals.on('stop', function (t) {
                var e = t.interaction,
                  n = e.target;
                n &&
                  n.options.styleCursor &&
                  (n._doc.documentElement.style.cursor = '');
              }),
              (s.maxInteractions = function (t) {
                return f.is.number(t)
                  ? ((g.maxInteractions = t), s)
                  : g.maxInteractions;
              }),
              c.settingsMethods.push('styleCursor'),
              c.settingsMethods.push('actionChecker'),
              c.settingsMethods.push('ignoreFrom'),
              c.settingsMethods.push('allowFrom'),
              (p.base.actionChecker = null),
              (p.base.styleCursor = !0),
              f.extend(p.perAction, g.defaults.perAction),
              (e.exports = g);
          },
          {
            '../Interactable': 4,
            '../Interaction': 5,
            '../actions/base': 6,
            '../defaultOptions': 18,
            '../interact': 21,
            '../scope': 33,
            '../utils': 43,
            '../utils/Signals': 34,
            './InteractableMethods': 12,
          },
        ],
        14: [
          function (t) {
            'use strict';
            function e(t, e) {
              if (!e) return !1;
              var n = e.options.drag.startAxis;
              return 'xy' === t || 'xy' === n || n === t;
            }
            var n = t('./base'),
              r = t('../scope'),
              o = t('../utils/is'),
              i = t('../utils/domUtils'),
              a = i.parentNode;
            n.setActionDefaults(t('../actions/drag')),
              n.signals.on('before-start', function (t) {
                var i = t.interaction,
                  s = t.eventTarget,
                  c = t.dx,
                  l = t.dy;
                if ('drag' === i.prepared.name) {
                  var u = Math.abs(c),
                    p = Math.abs(l),
                    d = i.target.options.drag,
                    f = d.startAxis,
                    h = u > p ? 'x' : u < p ? 'y' : 'xy';
                  if (
                    ((i.prepared.axis =
                      'start' === d.lockAxis ? h[0] : d.lockAxis),
                    'xy' !== h && 'xy' !== f && f !== h)
                  ) {
                    i.prepared.name = null;
                    for (
                      var g = s,
                        v = function (t) {
                          if (t !== i.target) {
                            var r = i.target.options.drag;
                            if (!r.manualStart && t.testIgnoreAllow(r, g, s)) {
                              var o = t.getAction(
                                i.downPointer,
                                i.downEvent,
                                i,
                                g
                              );
                              if (
                                o &&
                                'drag' === o.name &&
                                e(h, t) &&
                                n.validateAction(o, t, g, s)
                              )
                                return t;
                            }
                          }
                        };
                      o.element(g);

                    ) {
                      var m = r.interactables.forEachMatch(g, v);
                      if (m) {
                        (i.prepared.name = 'drag'),
                          (i.target = m),
                          (i.element = g);
                        break;
                      }
                      g = a(g);
                    }
                  }
                }
              });
          },
          {
            '../actions/drag': 7,
            '../scope': 33,
            '../utils/domUtils': 38,
            '../utils/is': 45,
            './base': 13,
          },
        ],
        15: [
          function (t) {
            'use strict';
            t('./base').setActionDefaults(t('../actions/gesture'));
          },
          { '../actions/gesture': 9, './base': 13 },
        ],
        16: [
          function (t, e) {
            'use strict';
            function n(t) {
              var e = t.prepared && t.prepared.name;
              if (!e) return null;
              var n = t.target.options;
              return n[e].hold || n[e].delay;
            }
            var r = t('./base'),
              o = t('../Interaction');
            (r.defaults.perAction.hold = 0),
              (r.defaults.perAction.delay = 0),
              o.signals.on('new', function (t) {
                t.autoStartHoldTimer = null;
              }),
              r.signals.on('prepared', function (t) {
                var e = t.interaction,
                  r = n(e);
                r > 0 &&
                  (e.autoStartHoldTimer = setTimeout(function () {
                    e.start(e.prepared, e.target, e.element);
                  }, r));
              }),
              o.signals.on('move', function (t) {
                var e = t.interaction,
                  n = t.duplicate;
                e.pointerWasMoved && !n && clearTimeout(e.autoStartHoldTimer);
              }),
              r.signals.on('before-start', function (t) {
                var e = t.interaction;
                n(e) > 0 && (e.prepared.name = null);
              }),
              (e.exports = { getHoldDuration: n });
          },
          { '../Interaction': 5, './base': 13 },
        ],
        17: [
          function (t) {
            'use strict';
            t('./base').setActionDefaults(t('../actions/resize'));
          },
          { '../actions/resize': 10, './base': 13 },
        ],
        18: [
          function (t, e) {
            'use strict';
            e.exports = {
              base: {
                accept: null,
                preventDefault: 'auto',
                deltaSource: 'page',
              },
              perAction: {
                origin: { x: 0, y: 0 },
                inertia: {
                  enabled: !1,
                  resistance: 10,
                  minSpeed: 100,
                  endSpeed: 10,
                  allowResume: !0,
                  smoothEndDuration: 300,
                },
              },
            };
          },
          {},
        ],
        19: [
          function (t, e) {
            'use strict';
            t('./inertia'),
              t('./modifiers/snap'),
              t('./modifiers/restrict'),
              t('./pointerEvents/base'),
              t('./pointerEvents/holdRepeat'),
              t('./pointerEvents/interactableTargets'),
              t('./autoStart/hold'),
              t('./actions/gesture'),
              t('./actions/resize'),
              t('./actions/drag'),
              t('./actions/drop'),
              t('./modifiers/snapSize'),
              t('./modifiers/restrictEdges'),
              t('./modifiers/restrictSize'),
              t('./autoStart/gesture'),
              t('./autoStart/resize'),
              t('./autoStart/drag'),
              t('./interactablePreventDefault.js'),
              t('./autoScroll'),
              (e.exports = t('./interact'));
          },
          {
            './actions/drag': 7,
            './actions/drop': 8,
            './actions/gesture': 9,
            './actions/resize': 10,
            './autoScroll': 11,
            './autoStart/drag': 14,
            './autoStart/gesture': 15,
            './autoStart/hold': 16,
            './autoStart/resize': 17,
            './inertia': 20,
            './interact': 21,
            './interactablePreventDefault.js': 22,
            './modifiers/restrict': 24,
            './modifiers/restrictEdges': 25,
            './modifiers/restrictSize': 26,
            './modifiers/snap': 27,
            './modifiers/snapSize': 28,
            './pointerEvents/base': 30,
            './pointerEvents/holdRepeat': 31,
            './pointerEvents/interactableTargets': 32,
          },
        ],
        20: [
          function (t) {
            'use strict';
            function e(t, e) {
              var n = t.target.options[t.prepared.name].inertia,
                r = n.resistance,
                o = -Math.log(n.endSpeed / e.v0) / r;
              (e.x0 = t.prevEvent.pageX),
                (e.y0 = t.prevEvent.pageY),
                (e.t0 = e.startEvent.timeStamp / 1e3),
                (e.sx = e.sy = 0),
                (e.modifiedXe = e.xe = (e.vx0 - o) / r),
                (e.modifiedYe = e.ye = (e.vy0 - o) / r),
                (e.te = o),
                (e.lambda_v0 = r / e.v0),
                (e.one_ve_v0 = 1 - n.endSpeed / e.v0);
            }
            function n() {
              o(this),
                c.setCoordDeltas(
                  this.pointerDelta,
                  this.prevCoords,
                  this.curCoords
                );
              var t = this.inertiaStatus,
                e = this.target.options[this.prepared.name].inertia,
                n = e.resistance,
                r = new Date().getTime() / 1e3 - t.t0;
              if (r < t.te) {
                var i = 1 - (Math.exp(-n * r) - t.lambda_v0) / t.one_ve_v0;
                if (t.modifiedXe === t.xe && t.modifiedYe === t.ye)
                  (t.sx = t.xe * i), (t.sy = t.ye * i);
                else {
                  var a = c.getQuadraticCurvePoint(
                    0,
                    0,
                    t.xe,
                    t.ye,
                    t.modifiedXe,
                    t.modifiedYe,
                    i
                  );
                  (t.sx = a.x), (t.sy = a.y);
                }
                this.doMove(), (t.i = l.request(this.boundInertiaFrame));
              } else
                (t.sx = t.modifiedXe),
                  (t.sy = t.modifiedYe),
                  this.doMove(),
                  this.end(t.startEvent),
                  (t.active = !1),
                  (this.simulation = null);
              c.copyCoords(this.prevCoords, this.curCoords);
            }
            function r() {
              o(this);
              var t = this.inertiaStatus,
                e = new Date().getTime() - t.t0,
                n =
                  this.target.options[this.prepared.name].inertia
                    .smoothEndDuration;
              e < n
                ? ((t.sx = c.easeOutQuad(e, 0, t.xe, n)),
                  (t.sy = c.easeOutQuad(e, 0, t.ye, n)),
                  this.pointerMove(t.startEvent, t.startEvent),
                  (t.i = l.request(this.boundSmoothEndFrame)))
                : ((t.sx = t.xe),
                  (t.sy = t.ye),
                  this.pointerMove(t.startEvent, t.startEvent),
                  this.end(t.startEvent),
                  (t.smoothEnd = t.active = !1),
                  (this.simulation = null));
            }
            function o(t) {
              var e = t.inertiaStatus;
              if (e.active) {
                var n = e.upCoords.page,
                  r = e.upCoords.client;
                c.setCoords(t.curCoords, [
                  {
                    pageX: n.x + e.sx,
                    pageY: n.y + e.sy,
                    clientX: r.x + e.sx,
                    clientY: r.y + e.sy,
                  },
                ]);
              }
            }
            var i = t('./InteractEvent'),
              a = t('./Interaction'),
              s = t('./modifiers/base'),
              c = t('./utils'),
              l = t('./utils/raf');
            a.signals.on('new', function (t) {
              (t.inertiaStatus = {
                active: !1,
                smoothEnd: !1,
                allowResume: !1,
                startEvent: null,
                upCoords: {},
                xe: 0,
                ye: 0,
                sx: 0,
                sy: 0,
                t0: 0,
                vx0: 0,
                vys: 0,
                duration: 0,
                lambda_v0: 0,
                one_ve_v0: 0,
                i: null,
              }),
                (t.boundInertiaFrame = function () {
                  return n.apply(t);
                }),
                (t.boundSmoothEndFrame = function () {
                  return r.apply(t);
                });
            }),
              a.signals.on('down', function (t) {
                var e = t.interaction,
                  n = t.event,
                  r = t.pointer,
                  o = t.eventTarget,
                  u = e.inertiaStatus;
                if (u.active)
                  for (var p = o; c.is.element(p); ) {
                    if (p === e.element) {
                      l.cancel(u.i),
                        (u.active = !1),
                        (e.simulation = null),
                        e.updatePointer(r),
                        c.setCoords(e.curCoords, e.pointers);
                      var d = { interaction: e };
                      a.signals.fire('before-action-move', d),
                        a.signals.fire('action-resume', d);
                      var f = new i(
                        e,
                        n,
                        e.prepared.name,
                        'inertiaresume',
                        e.element
                      );
                      e.target.fire(f),
                        (e.prevEvent = f),
                        s.resetStatuses(e.modifierStatuses),
                        c.copyCoords(e.prevCoords, e.curCoords);
                      break;
                    }
                    p = c.parentNode(p);
                  }
              }),
              a.signals.on('up', function (t) {
                var n = t.interaction,
                  r = t.event,
                  o = n.inertiaStatus;
                if (n.interacting() && !o.active) {
                  var a = n.target,
                    u = a && a.options,
                    p = u && n.prepared.name && u[n.prepared.name].inertia,
                    d = new Date().getTime(),
                    f = {},
                    h = c.extend({}, n.curCoords.page),
                    g = n.pointerDelta.client.speed,
                    v = !1,
                    m = void 0,
                    y =
                      p &&
                      p.enabled &&
                      'gesture' !== n.prepared.name &&
                      r !== o.startEvent,
                    x =
                      y &&
                      d - n.curCoords.timeStamp < 50 &&
                      g > p.minSpeed &&
                      g > p.endSpeed,
                    b = {
                      interaction: n,
                      pageCoords: h,
                      statuses: f,
                      preEnd: !0,
                      requireEndOnly: !0,
                    };
                  y &&
                    !x &&
                    (s.resetStatuses(f),
                    (m = s.setAll(b)),
                    m.shouldMove && m.locked && (v = !0)),
                    (x || v) &&
                      (c.copyCoords(o.upCoords, n.curCoords),
                      (n.pointers[0] = o.startEvent =
                        new i(
                          n,
                          r,
                          n.prepared.name,
                          'inertiastart',
                          n.element
                        )),
                      (o.t0 = d),
                      (o.active = !0),
                      (o.allowResume = p.allowResume),
                      (n.simulation = o),
                      a.fire(o.startEvent),
                      x
                        ? ((o.vx0 = n.pointerDelta.client.vx),
                          (o.vy0 = n.pointerDelta.client.vy),
                          (o.v0 = g),
                          e(n, o),
                          c.extend(h, n.curCoords.page),
                          (h.x += o.xe),
                          (h.y += o.ye),
                          s.resetStatuses(f),
                          (m = s.setAll(b)),
                          (o.modifiedXe += m.dx),
                          (o.modifiedYe += m.dy),
                          (o.i = l.request(n.boundInertiaFrame)))
                        : ((o.smoothEnd = !0),
                          (o.xe = m.dx),
                          (o.ye = m.dy),
                          (o.sx = o.sy = 0),
                          (o.i = l.request(n.boundSmoothEndFrame))));
                }
              }),
              a.signals.on('stop-active', function (t) {
                var e = t.interaction,
                  n = e.inertiaStatus;
                n.active &&
                  (l.cancel(n.i), (n.active = !1), (e.simulation = null));
              });
          },
          {
            './InteractEvent': 3,
            './Interaction': 5,
            './modifiers/base': 23,
            './utils': 43,
            './utils/raf': 49,
          },
        ],
        21: [
          function (t, e) {
            'use strict';
            function n(t, e) {
              var n = a.interactables.get(t, e);
              return n || ((n = new s(t, e)), (n.events.global = l)), n;
            }
            var r = t('./utils/browser'),
              o = t('./utils/events'),
              i = t('./utils'),
              a = t('./scope'),
              s = t('./Interactable'),
              c = t('./Interaction'),
              l = {};
            (n.isSet = function (t, e) {
              return -1 !== a.interactables.indexOfElement(t, e && e.context);
            }),
              (n.on = function (t, e, r) {
                if (
                  (i.is.string(t) &&
                    -1 !== t.search(' ') &&
                    (t = t.trim().split(/ +/)),
                  i.is.array(t))
                ) {
                  for (var c = 0; c < t.length; c++) {
                    var u;
                    u = t[c];
                    var p = u;
                    n.on(p, e, r);
                  }
                  return n;
                }
                if (i.is.object(t)) {
                  for (var d in t) n.on(d, t[d], e);
                  return n;
                }
                return (
                  i.contains(s.eventTypes, t)
                    ? l[t]
                      ? l[t].push(e)
                      : (l[t] = [e])
                    : o.add(a.document, t, e, {
                        options: r,
                      }),
                  n
                );
              }),
              (n.off = function (t, e, r) {
                if (
                  (i.is.string(t) &&
                    -1 !== t.search(' ') &&
                    (t = t.trim().split(/ +/)),
                  i.is.array(t))
                ) {
                  for (var c = 0; c < t.length; c++) {
                    var u;
                    u = t[c];
                    var p = u;
                    n.off(p, e, r);
                  }
                  return n;
                }
                if (i.is.object(t)) {
                  for (var d in t) n.off(d, t[d], e);
                  return n;
                }
                if (i.contains(s.eventTypes, t)) {
                  var f = void 0;
                  t in l && -1 !== (f = l[t].indexOf(e)) && l[t].splice(f, 1);
                } else o.remove(a.document, t, e, r);
                return n;
              }),
              (n.debug = function () {
                return a;
              }),
              (n.getPointerAverage = i.pointerAverage),
              (n.getTouchBBox = i.touchBBox),
              (n.getTouchDistance = i.touchDistance),
              (n.getTouchAngle = i.touchAngle),
              (n.getElementRect = i.getElementRect),
              (n.getElementClientRect = i.getElementClientRect),
              (n.matchesSelector = i.matchesSelector),
              (n.closest = i.closest),
              (n.supportsTouch = function () {
                return r.supportsTouch;
              }),
              (n.supportsPointerEvent = function () {
                return r.supportsPointerEvent;
              }),
              (n.stop = function (t) {
                for (var e = a.interactions.length - 1; e >= 0; e--)
                  a.interactions[e].stop(t);
                return n;
              }),
              (n.pointerMoveTolerance = function (t) {
                return i.is.number(t)
                  ? ((c.pointerMoveTolerance = t), n)
                  : c.pointerMoveTolerance;
              }),
              (n.addDocument = a.addDocument),
              (n.removeDocument = a.removeDocument),
              (a.interact = n),
              (e.exports = n);
          },
          {
            './Interactable': 4,
            './Interaction': 5,
            './scope': 33,
            './utils': 43,
            './utils/browser': 36,
            './utils/events': 39,
          },
        ],
        22: [
          function (t) {
            'use strict';
            function e(t) {
              var e = t.interaction,
                n = t.event;
              e.target && e.target.checkAndPreventDefault(n);
            }
            var n = t('./Interactable'),
              r = t('./Interaction'),
              o = t('./scope'),
              i = t('./utils/is'),
              a = t('./utils/events'),
              s = t('./utils/domUtils'),
              c = s.nodeContains,
              l = s.matchesSelector;
            (n.prototype.preventDefault = function (t) {
              return /^(always|never|auto)$/.test(t)
                ? ((this.options.preventDefault = t), this)
                : i.bool(t)
                ? ((this.options.preventDefault = t ? 'always' : 'never'), this)
                : this.options.preventDefault;
            }),
              (n.prototype.checkAndPreventDefault = function (t) {
                var e = this.options.preventDefault;
                if ('never' !== e)
                  return 'always' === e
                    ? void t.preventDefault()
                    : void (
                        (a.supportsOptions &&
                          /^touch(start|move)$/.test(t.type)) ||
                        /^(mouse|pointer|touch)*(down|start)/i.test(t.type) ||
                        (i.element(t.target) &&
                          l(
                            t.target,
                            'input,select,textarea,[contenteditable=true],[contenteditable=true] *'
                          )) ||
                        t.preventDefault()
                      );
              });
            for (
              var u = ['down', 'move', 'up', 'cancel'], p = 0;
              p < u.length;
              p++
            ) {
              var d = u[p];
              r.signals.on(d, e);
            }
            r.docEvents.dragstart = function (t) {
              for (var e = 0; e < o.interactions.length; e++) {
                var n;
                n = o.interactions[e];
                var r = n;
                if (
                  r.element &&
                  (r.element === t.target || c(r.element, t.target))
                )
                  return void r.target.checkAndPreventDefault(t);
              }
            };
          },
          {
            './Interactable': 4,
            './Interaction': 5,
            './scope': 33,
            './utils/domUtils': 38,
            './utils/events': 39,
            './utils/is': 45,
          },
        ],
        23: [
          function (t, e) {
            'use strict';
            function n(t, e, n) {
              return t && t.enabled && (e || !t.endOnly) && (!n || t.endOnly);
            }
            var r = t('../InteractEvent'),
              o = t('../Interaction'),
              i = t('../utils/extend'),
              a = {
                names: [],
                setOffsets: function (t) {
                  var e = t.interaction,
                    n = t.pageCoords,
                    r = e.target,
                    o = e.element,
                    i = e.startOffset,
                    s = r.getRect(o);
                  s
                    ? ((i.left = n.x - s.left),
                      (i.top = n.y - s.top),
                      (i.right = s.right - n.x),
                      (i.bottom = s.bottom - n.y),
                      'width' in s || (s.width = s.right - s.left),
                      'height' in s || (s.height = s.bottom - s.top))
                    : (i.left = i.top = i.right = i.bottom = 0),
                    (t.rect = s),
                    (t.interactable = r),
                    (t.element = o);
                  for (var c = 0; c < a.names.length; c++) {
                    var l;
                    l = a.names[c];
                    var u = l;
                    (t.options = r.options[e.prepared.name][u]),
                      t.options && (e.modifierOffsets[u] = a[u].setOffset(t));
                  }
                },
                setAll: function (t) {
                  var e = t.interaction,
                    r = t.statuses,
                    o = t.preEnd,
                    s = t.requireEndOnly,
                    c = {
                      dx: 0,
                      dy: 0,
                      changed: !1,
                      locked: !1,
                      shouldMove: !0,
                    };
                  t.modifiedCoords = i({}, t.pageCoords);
                  for (var l = 0; l < a.names.length; l++) {
                    var u;
                    u = a.names[l];
                    var p = u,
                      d = a[p],
                      f = e.target.options[e.prepared.name][p];
                    n(f, o, s) &&
                      ((t.status = t.status = r[p]),
                      (t.options = f),
                      (t.offset = t.interaction.modifierOffsets[p]),
                      d.set(t),
                      t.status.locked &&
                        ((t.modifiedCoords.x += t.status.dx),
                        (t.modifiedCoords.y += t.status.dy),
                        (c.dx += t.status.dx),
                        (c.dy += t.status.dy),
                        (c.locked = !0)));
                  }
                  return (
                    (c.shouldMove = !t.status || !c.locked || t.status.changed),
                    c
                  );
                },
                resetStatuses: function (t) {
                  for (var e = 0; e < a.names.length; e++) {
                    var n;
                    n = a.names[e];
                    var r = n,
                      o = t[r] || {};
                    (o.dx = o.dy = 0),
                      (o.modifiedX = o.modifiedY = NaN),
                      (o.locked = !1),
                      (o.changed = !0),
                      (t[r] = o);
                  }
                  return t;
                },
                start: function (t, e) {
                  var n = t.interaction,
                    r = {
                      interaction: n,
                      pageCoords: ('action-resume' === e
                        ? n.curCoords
                        : n.startCoords
                      ).page,
                      startOffset: n.startOffset,
                      statuses: n.modifierStatuses,
                      preEnd: !1,
                      requireEndOnly: !1,
                    };
                  a.setOffsets(r),
                    a.resetStatuses(r.statuses),
                    (r.pageCoords = i({}, n.startCoords.page)),
                    (n.modifierResult = a.setAll(r));
                },
                beforeMove: function (t) {
                  var e = t.interaction,
                    n = t.preEnd,
                    r = t.interactingBeforeMove,
                    o = a.setAll({
                      interaction: e,
                      preEnd: n,
                      pageCoords: e.curCoords.page,
                      statuses: e.modifierStatuses,
                      requireEndOnly: !1,
                    });
                  !o.shouldMove && r && (e._dontFireMove = !0),
                    (e.modifierResult = o);
                },
                end: function (t) {
                  for (
                    var e = t.interaction, r = t.event, o = 0;
                    o < a.names.length;
                    o++
                  ) {
                    var i;
                    i = a.names[o];
                    var s = i;
                    if (n(e.target.options[e.prepared.name][s], !0, !0)) {
                      e.doMove({ event: r, preEnd: !0 });
                      break;
                    }
                  }
                },
                setXY: function (t) {
                  for (
                    var e = t.iEvent, n = t.interaction, r = i({}, t), o = 0;
                    o < a.names.length;
                    o++
                  ) {
                    var s = a.names[o];
                    if (
                      ((r.options = n.target.options[n.prepared.name][s]),
                      r.options)
                    ) {
                      var c = a[s];
                      (r.status = n.modifierStatuses[s]),
                        (e[s] = c.modifyCoords(r));
                    }
                  }
                },
              };
            o.signals.on('new', function (t) {
              (t.startOffset = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }),
                (t.modifierOffsets = {}),
                (t.modifierStatuses = a.resetStatuses({})),
                (t.modifierResult = null);
            }),
              o.signals.on('action-start', a.start),
              o.signals.on('action-resume', a.start),
              o.signals.on('before-action-move', a.beforeMove),
              o.signals.on('action-end', a.end),
              r.signals.on('set-xy', a.setXY),
              (e.exports = a);
          },
          {
            '../InteractEvent': 3,
            '../Interaction': 5,
            '../utils/extend': 40,
          },
        ],
        24: [
          function (t, e) {
            'use strict';
            function n(t, e, n) {
              return o.is['function'](t)
                ? o.resolveRectLike(t, e.target, e.element, [n.x, n.y, e])
                : o.resolveRectLike(t, e.target, e.element);
            }
            var r = t('./base'),
              o = t('../utils'),
              i = t('../defaultOptions'),
              a = {
                defaults: {
                  enabled: !1,
                  endOnly: !1,
                  restriction: null,
                  elementRect: null,
                },
                setOffset: function (t) {
                  var e = t.rect,
                    n = t.startOffset,
                    r = t.options,
                    o = r && r.elementRect,
                    i = {};
                  return (
                    e && o
                      ? ((i.left = n.left - e.width * o.left),
                        (i.top = n.top - e.height * o.top),
                        (i.right = n.right - e.width * (1 - o.right)),
                        (i.bottom = n.bottom - e.height * (1 - o.bottom)))
                      : (i.left = i.top = i.right = i.bottom = 0),
                    i
                  );
                },
                set: function (t) {
                  var e = t.modifiedCoords,
                    r = t.interaction,
                    i = t.status,
                    a = t.options;
                  if (!a) return i;
                  var s = i.useStatusXY ? { x: i.x, y: i.y } : o.extend({}, e),
                    c = n(a.restriction, r, s);
                  if (!c) return i;
                  (i.dx = 0), (i.dy = 0), (i.locked = !1);
                  var l = c,
                    u = s.x,
                    p = s.y,
                    d = r.modifierOffsets.restrict;
                  'string' != typeof c &&
                    ('x' in c && 'y' in c
                      ? ((u = Math.max(
                          Math.min(l.x + l.width - d.right, s.x),
                          l.x + d.left
                        )),
                        (p = Math.max(
                          Math.min(l.y + l.height - d.bottom, s.y),
                          l.y + d.top
                        )))
                      : ((u = Math.max(
                          Math.min(l.right - d.right, s.x),
                          l.left + d.left
                        )),
                        (p = Math.max(
                          Math.min(l.bottom - d.bottom, s.y),
                          l.top + d.top
                        ))),
                    (i.dx = u - s.x),
                    (i.dy = p - s.y),
                    (i.changed = i.modifiedX !== u || i.modifiedY !== p),
                    (i.locked = !(!i.dx && !i.dy)),
                    (i.modifiedX = u),
                    (i.modifiedY = p));
                },
                modifyCoords: function (t) {
                  var e = t.page,
                    n = t.client,
                    r = t.status,
                    o = t.phase,
                    i = t.options,
                    a = i && i.elementRect;
                  if (
                    i &&
                    i.enabled &&
                    ('start' !== o || !a || !r.locked) &&
                    r.locked
                  )
                    return (
                      (e.x += r.dx),
                      (e.y += r.dy),
                      (n.x += r.dx),
                      (n.y += r.dy),
                      { dx: r.dx, dy: r.dy }
                    );
                },
                getRestrictionRect: n,
              };
            (r.restrict = a),
              r.names.push('restrict'),
              (i.perAction.restrict = a.defaults),
              (e.exports = a);
          },
          { '../defaultOptions': 18, '../utils': 43, './base': 23 },
        ],
        25: [
          function (t, e) {
            'use strict';
            var n = t('./base'),
              r = t('../utils'),
              o = t('../utils/rect'),
              i = t('../defaultOptions'),
              a = t('../actions/resize'),
              s = t('./restrict'),
              c = s.getRestrictionRect,
              l = {
                top: +Infinity,
                left: +Infinity,
                bottom: -Infinity,
                right: -Infinity,
              },
              u = {
                top: -Infinity,
                left: -Infinity,
                bottom: +Infinity,
                right: +Infinity,
              },
              p = {
                defaults: {
                  enabled: !1,
                  endOnly: !1,
                  min: null,
                  max: null,
                  offset: null,
                },
                setOffset: function (t) {
                  var e = t.interaction,
                    n = t.startOffset,
                    o = t.options;
                  if (!o) return r.extend({}, n);
                  var i = c(o.offset, e, e.startCoords.page);
                  return i
                    ? {
                        top: n.top + i.y,
                        left: n.left + i.x,
                        bottom: n.bottom + i.y,
                        right: n.right + i.x,
                      }
                    : n;
                },
                set: function (t) {
                  var e = t.modifiedCoords,
                    n = t.interaction,
                    i = t.status,
                    a = t.offset,
                    s = t.options,
                    p = n.prepared.linkedEdges || n.prepared.edges;
                  if (n.interacting() && p) {
                    var d = i.useStatusXY
                        ? { x: i.x, y: i.y }
                        : r.extend({}, e),
                      f = o.xywhToTlbr(c(s.inner, n, d)) || l,
                      h = o.xywhToTlbr(c(s.outer, n, d)) || u,
                      g = d.x,
                      v = d.y;
                    (i.dx = 0),
                      (i.dy = 0),
                      (i.locked = !1),
                      p.top
                        ? (v = Math.min(
                            Math.max(h.top + a.top, d.y),
                            f.top + a.top
                          ))
                        : p.bottom &&
                          (v = Math.max(
                            Math.min(h.bottom - a.bottom, d.y),
                            f.bottom - a.bottom
                          )),
                      p.left
                        ? (g = Math.min(
                            Math.max(h.left + a.left, d.x),
                            f.left + a.left
                          ))
                        : p.right &&
                          (g = Math.max(
                            Math.min(h.right - a.right, d.x),
                            f.right - a.right
                          )),
                      (i.dx = g - d.x),
                      (i.dy = v - d.y),
                      (i.changed = i.modifiedX !== g || i.modifiedY !== v),
                      (i.locked = !(!i.dx && !i.dy)),
                      (i.modifiedX = g),
                      (i.modifiedY = v);
                  }
                },
                modifyCoords: function (t) {
                  var e = t.page,
                    n = t.client,
                    r = t.status,
                    o = t.phase,
                    i = t.options;
                  if (
                    i &&
                    i.enabled &&
                    ('start' !== o || !r.locked) &&
                    r.locked
                  )
                    return (
                      (e.x += r.dx),
                      (e.y += r.dy),
                      (n.x += r.dx),
                      (n.y += r.dy),
                      { dx: r.dx, dy: r.dy }
                    );
                },
                noInner: l,
                noOuter: u,
                getRestrictionRect: c,
              };
            (n.restrictEdges = p),
              n.names.push('restrictEdges'),
              (i.perAction.restrictEdges = p.defaults),
              (a.defaults.restrictEdges = p.defaults),
              (e.exports = p);
          },
          {
            '../actions/resize': 10,
            '../defaultOptions': 18,
            '../utils': 43,
            '../utils/rect': 50,
            './base': 23,
            './restrict': 24,
          },
        ],
        26: [
          function (t, e) {
            'use strict';
            var n = t('./base'),
              r = t('./restrictEdges'),
              o = t('../utils'),
              i = t('../utils/rect'),
              a = t('../defaultOptions'),
              s = t('../actions/resize'),
              c = { width: -Infinity, height: -Infinity },
              l = { width: +Infinity, height: +Infinity },
              u = {
                defaults: {
                  enabled: !1,
                  endOnly: !1,
                  min: null,
                  max: null,
                },
                setOffset: function (t) {
                  return t.interaction.startOffset;
                },
                set: function (t) {
                  var e = t.interaction,
                    n = t.options,
                    a = e.prepared.linkedEdges || e.prepared.edges;
                  if (e.interacting() && a) {
                    var s = i.xywhToTlbr(e.resizeRects.inverted),
                      u = i.tlbrToXywh(r.getRestrictionRect(n.min, e)) || c,
                      p = i.tlbrToXywh(r.getRestrictionRect(n.max, e)) || l;
                    (t.options = {
                      enabled: n.enabled,
                      endOnly: n.endOnly,
                      inner: o.extend({}, r.noInner),
                      outer: o.extend({}, r.noOuter),
                    }),
                      a.top
                        ? ((t.options.inner.top = s.bottom - u.height),
                          (t.options.outer.top = s.bottom - p.height))
                        : a.bottom &&
                          ((t.options.inner.bottom = s.top + u.height),
                          (t.options.outer.bottom = s.top + p.height)),
                      a.left
                        ? ((t.options.inner.left = s.right - u.width),
                          (t.options.outer.left = s.right - p.width))
                        : a.right &&
                          ((t.options.inner.right = s.left + u.width),
                          (t.options.outer.right = s.left + p.width)),
                      r.set(t);
                  }
                },
                modifyCoords: r.modifyCoords,
              };
            (n.restrictSize = u),
              n.names.push('restrictSize'),
              (a.perAction.restrictSize = u.defaults),
              (s.defaults.restrictSize = u.defaults),
              (e.exports = u);
          },
          {
            '../actions/resize': 10,
            '../defaultOptions': 18,
            '../utils': 43,
            '../utils/rect': 50,
            './base': 23,
            './restrictEdges': 25,
          },
        ],
        27: [
          function (t, e) {
            'use strict';
            var n = t('./base'),
              r = t('../interact'),
              o = t('../utils'),
              i = t('../defaultOptions'),
              a = {
                defaults: {
                  enabled: !1,
                  endOnly: !1,
                  range: Infinity,
                  targets: null,
                  offsets: null,
                  relativePoints: null,
                },
                setOffset: function (t) {
                  var e = t.interaction,
                    n = t.interactable,
                    r = t.element,
                    i = t.rect,
                    a = t.startOffset,
                    s = t.options,
                    c = [],
                    l = o.rectToXY(o.resolveRectLike(s.origin)),
                    u = l || o.getOriginXY(n, r, e.prepared.name);
                  s = s || n.options[e.prepared.name].snap || {};
                  var p = void 0;
                  if ('startCoords' === s.offset)
                    p = {
                      x: e.startCoords.page.x - u.x,
                      y: e.startCoords.page.y - u.y,
                    };
                  else {
                    var d = o.resolveRectLike(s.offset, n, r, [e]);
                    p = o.rectToXY(d) || { x: 0, y: 0 };
                  }
                  if (i && s.relativePoints && s.relativePoints.length)
                    for (var f = 0; f < s.relativePoints.length; f++) {
                      var h;
                      h = s.relativePoints[f];
                      var g = h,
                        v = g.x,
                        m = g.y;
                      c.push({
                        x: a.left - i.width * v + p.x,
                        y: a.top - i.height * m + p.y,
                      });
                    }
                  else c.push(p);
                  return c;
                },
                set: function (t) {
                  var e = t.interaction,
                    n = t.modifiedCoords,
                    r = t.status,
                    i = t.options,
                    a = t.offset,
                    s = [],
                    c = void 0,
                    l = void 0,
                    u = void 0;
                  if (r.useStatusXY) l = { x: r.x, y: r.y };
                  else {
                    var p = o.getOriginXY(e.target, e.element, e.prepared.name);
                    (l = o.extend({}, n)), (l.x -= p.x), (l.y -= p.y);
                  }
                  (r.realX = l.x), (r.realY = l.y);
                  for (
                    var d = i.targets ? i.targets.length : 0, f = 0;
                    f < a.length;
                    f++
                  ) {
                    var h;
                    h = a[f];
                    for (
                      var g = h,
                        v = g.x,
                        m = g.y,
                        y = l.x - v,
                        x = l.y - m,
                        b = 0;
                      b < i.targets.length;
                      b++
                    ) {
                      var w;
                      w = i.targets[b];
                      var S = w;
                      (c = o.is['function'](S) ? S(y, x, e) : S),
                        c &&
                          s.push({
                            x: o.is.number(c.x) ? c.x + v : y,
                            y: o.is.number(c.y) ? c.y + m : x,
                            range: o.is.number(c.range) ? c.range : i.range,
                          });
                    }
                  }
                  var C = {
                    target: null,
                    inRange: !1,
                    distance: 0,
                    range: 0,
                    dx: 0,
                    dy: 0,
                  };
                  for (u = 0, d = s.length; u < d; u++) {
                    c = s[u];
                    var E = c.range,
                      T = c.x - l.x,
                      M = c.y - l.y,
                      k = o.hypot(T, M),
                      I = k <= E;
                    E === Infinity &&
                      C.inRange &&
                      C.range !== Infinity &&
                      (I = !1),
                      (C.target &&
                        !(I
                          ? C.inRange && E !== Infinity
                            ? k / E < C.distance / C.range
                            : (E === Infinity && C.range !== Infinity) ||
                              k < C.distance
                          : !C.inRange && k < C.distance)) ||
                        ((C.target = c),
                        (C.distance = k),
                        (C.range = E),
                        (C.inRange = I),
                        (C.dx = T),
                        (C.dy = M),
                        (r.range = E));
                  }
                  var O = void 0;
                  C.target
                    ? ((O =
                        r.modifiedX !== C.target.x ||
                        r.modifiedY !== C.target.y),
                      (r.modifiedX = C.target.x),
                      (r.modifiedY = C.target.y))
                    : ((O = !0), (r.modifiedX = NaN), (r.modifiedY = NaN)),
                    (r.dx = C.dx),
                    (r.dy = C.dy),
                    (r.changed = O || (C.inRange && !r.locked)),
                    (r.locked = C.inRange);
                },
                modifyCoords: function (t) {
                  var e = t.page,
                    n = t.client,
                    r = t.status,
                    o = t.phase,
                    i = t.options,
                    a = i && i.relativePoints;
                  if (i && i.enabled && ('start' !== o || !a || !a.length))
                    return (
                      r.locked &&
                        ((e.x += r.dx),
                        (e.y += r.dy),
                        (n.x += r.dx),
                        (n.y += r.dy)),
                      {
                        range: r.range,
                        locked: r.locked,
                        x: r.modifiedX,
                        y: r.modifiedY,
                        realX: r.realX,
                        realY: r.realY,
                        dx: r.dx,
                        dy: r.dy,
                      }
                    );
                },
              };
            (r.createSnapGrid = function (t) {
              return function (e, n) {
                var r = t.limits || {
                    left: -Infinity,
                    right: Infinity,
                    top: -Infinity,
                    bottom: Infinity,
                  },
                  i = 0,
                  a = 0;
                o.is.object(t.offset) && ((i = t.offset.x), (a = t.offset.y));
                var s = Math.round((e - i) / t.x),
                  c = Math.round((n - a) / t.y);
                return {
                  x: Math.max(r.left, Math.min(r.right, s * t.x + i)),
                  y: Math.max(r.top, Math.min(r.bottom, c * t.y + a)),
                  range: t.range,
                };
              };
            }),
              (n.snap = a),
              n.names.push('snap'),
              (i.perAction.snap = a.defaults),
              (e.exports = a);
          },
          {
            '../defaultOptions': 18,
            '../interact': 21,
            '../utils': 43,
            './base': 23,
          },
        ],
        28: [
          function (t, e) {
            'use strict';
            var n = t('./base'),
              r = t('./snap'),
              o = t('../defaultOptions'),
              i = t('../actions/resize'),
              a = t('../utils/'),
              s = {
                defaults: {
                  enabled: !1,
                  endOnly: !1,
                  range: Infinity,
                  targets: null,
                  offsets: null,
                },
                setOffset: function (t) {
                  var e = t.interaction,
                    n = t.options,
                    o = e.prepared.edges;
                  if (o) {
                    t.options = {
                      relativePoints: [
                        {
                          x: o.left ? 0 : 1,
                          y: o.top ? 0 : 1,
                        },
                      ],
                      origin: { x: 0, y: 0 },
                      offset: 'self',
                      range: n.range,
                    };
                    var i = r.setOffset(t);
                    return (t.options = n), i;
                  }
                },
                set: function (t) {
                  var e = t.interaction,
                    n = t.options,
                    o = t.offset,
                    i = t.modifiedCoords,
                    s = a.extend({}, i),
                    c = s.x - o[0].x,
                    l = s.y - o[0].y;
                  (t.options = a.extend({}, n)), (t.options.targets = []);
                  for (var u = 0; u < n.targets.length; u++) {
                    var p;
                    p = n.targets[u];
                    var d = p,
                      f = void 0;
                    (f = a.is['function'](d) ? d(c, l, e) : d),
                      f &&
                        ('width' in f &&
                          'height' in f &&
                          ((f.x = f.width), (f.y = f.height)),
                        t.options.targets.push(f));
                  }
                  r.set(t);
                },
                modifyCoords: function (t) {
                  var e = t.options;
                  (t.options = a.extend({}, e)),
                    (t.options.enabled = e.enabled),
                    (t.options.relativePoints = [null]),
                    r.modifyCoords(t);
                },
              };
            (n.snapSize = s),
              n.names.push('snapSize'),
              (o.perAction.snapSize = s.defaults),
              (i.defaults.snapSize = s.defaults),
              (e.exports = s);
          },
          {
            '../actions/resize': 10,
            '../defaultOptions': 18,
            '../utils/': 43,
            './base': 23,
            './snap': 27,
          },
        ],
        29: [
          function (t, e) {
            'use strict';
            function n(t, e) {
              if (!(t instanceof e))
                throw new TypeError('Cannot call a class as a function');
            }
            var r = t('../utils/pointerUtils');
            e.exports = (function () {
              function t(e, o, i, a, s) {
                if (
                  (n(this, t),
                  r.pointerExtend(this, i),
                  i !== o && r.pointerExtend(this, o),
                  (this.interaction = s),
                  (this.timeStamp = new Date().getTime()),
                  (this.originalEvent = i),
                  (this.type = e),
                  (this.pointerId = r.getPointerId(o)),
                  (this.pointerType = r.getPointerType(o)),
                  (this.target = a),
                  (this.currentTarget = null),
                  'tap' === e)
                ) {
                  var c = s.getPointerIndex(o);
                  this.dt = this.timeStamp - s.downTimes[c];
                  var l = this.timeStamp - s.tapTime;
                  this['double'] = !!(
                    s.prevTap &&
                    'doubletap' !== s.prevTap.type &&
                    s.prevTap.target === this.target &&
                    l < 500
                  );
                } else 'doubletap' === e && (this.dt = o.timeStamp - s.tapTime);
              }
              return (
                (t.prototype.subtractOrigin = function (t) {
                  var e = t.x,
                    n = t.y;
                  return (
                    (this.pageX -= e),
                    (this.pageY -= n),
                    (this.clientX -= e),
                    (this.clientY -= n),
                    this
                  );
                }),
                (t.prototype.addOrigin = function (t) {
                  var e = t.x,
                    n = t.y;
                  return (
                    (this.pageX += e),
                    (this.pageY += n),
                    (this.clientX += e),
                    (this.clientY += n),
                    this
                  );
                }),
                (t.prototype.preventDefault = function () {
                  this.originalEvent.preventDefault();
                }),
                (t.prototype.stopPropagation = function () {
                  this.propagationStopped = !0;
                }),
                (t.prototype.stopImmediatePropagation = function () {
                  this.immediatePropagationStopped = this.propagationStopped =
                    !0;
                }),
                t
              );
            })();
          },
          { '../utils/pointerUtils': 48 },
        ],
        30: [
          function (t, e) {
            'use strict';
            function n(t) {
              for (
                var e = t.interaction,
                  o = t.pointer,
                  a = t.event,
                  c = t.eventTarget,
                  u = t.type,
                  p = u === undefined ? t.pointerEvent.type : u,
                  d = t.targets,
                  f = d === undefined ? r(t) : d,
                  h = t.pointerEvent,
                  g = h === undefined ? new i(p, o, a, c, e) : h,
                  v = {
                    interaction: e,
                    pointer: o,
                    event: a,
                    eventTarget: c,
                    targets: f,
                    type: p,
                    pointerEvent: g,
                  },
                  m = 0;
                m < f.length;
                m++
              ) {
                var y = f[m];
                for (var x in y.props || {}) g[x] = y.props[x];
                var b = s.getOriginXY(y.eventable, y.element);
                if (
                  (g.subtractOrigin(b),
                  (g.eventable = y.eventable),
                  (g.currentTarget = y.element),
                  y.eventable.fire(g),
                  g.addOrigin(b),
                  g.immediatePropagationStopped ||
                    (g.propagationStopped &&
                      m + 1 < f.length &&
                      f[m + 1].element !== g.currentTarget))
                )
                  break;
              }
              if ((l.fire('fired', v), 'tap' === p)) {
                var w = g['double']
                  ? n({
                      interaction: e,
                      pointer: o,
                      event: a,
                      eventTarget: c,
                      type: 'doubletap',
                    })
                  : g;
                (e.prevTap = w), (e.tapTime = w.timeStamp);
              }
              return g;
            }
            function r(t) {
              var e = t.interaction,
                n = t.pointer,
                r = t.event,
                o = t.eventTarget,
                i = t.type,
                a = e.getPointerIndex(n);
              if (
                'tap' === i &&
                (e.pointerWasMoved ||
                  !e.downTargets[a] ||
                  e.downTargets[a] !== o)
              )
                return [];
              for (
                var c = s.getPath(o),
                  u = {
                    interaction: e,
                    pointer: n,
                    event: r,
                    eventTarget: o,
                    type: i,
                    path: c,
                    targets: [],
                    element: null,
                  },
                  p = 0;
                p < c.length;
                p++
              ) {
                var d;
                d = c[p];
                var f = d;
                (u.element = f), l.fire('collect-targets', u);
              }
              return (
                'hold' === i &&
                  (u.targets = u.targets.filter(function (t) {
                    return (
                      t.eventable.options.holdDuration ===
                      e.holdTimers[a].duration
                    );
                  })),
                u.targets
              );
            }
            function o(t) {
              return function (e) {
                var r = e.interaction,
                  o = e.pointer,
                  i = e.event;
                n({
                  interaction: r,
                  eventTarget: e.eventTarget,
                  pointer: o,
                  event: i,
                  type: t,
                });
              };
            }
            var i = t('./PointerEvent'),
              a = t('../Interaction'),
              s = t('../utils'),
              c = t('../defaultOptions'),
              l = t('../utils/Signals')['new'](),
              u = ['down', 'up', 'cancel'],
              p = ['down', 'up', 'cancel'],
              d = {
                PointerEvent: i,
                fire: n,
                collectEventTargets: r,
                signals: l,
                defaults: {
                  holdDuration: 600,
                  ignoreFrom: null,
                  allowFrom: null,
                  origin: { x: 0, y: 0 },
                },
                types: [
                  'down',
                  'move',
                  'up',
                  'cancel',
                  'tap',
                  'doubletap',
                  'hold',
                ],
              };
            a.signals.on('update-pointer-down', function (t) {
              var e = t.interaction,
                n = t.pointerIndex;
              e.holdTimers[n] = {
                duration: Infinity,
                timeout: null,
              };
            }),
              a.signals.on('remove-pointer', function (t) {
                var e = t.interaction,
                  n = t.pointerIndex;
                e.holdTimers.splice(n, 1);
              }),
              a.signals.on('move', function (t) {
                var e = t.interaction,
                  r = t.pointer,
                  o = t.event,
                  i = t.eventTarget,
                  a = t.duplicateMove,
                  s = e.getPointerIndex(r);
                a ||
                  (e.pointerIsDown && !e.pointerWasMoved) ||
                  (e.pointerIsDown && clearTimeout(e.holdTimers[s].timeout),
                  n({
                    interaction: e,
                    pointer: r,
                    event: o,
                    eventTarget: i,
                    type: 'move',
                  }));
              }),
              a.signals.on('down', function (t) {
                for (
                  var e = t.interaction,
                    r = t.pointer,
                    o = t.event,
                    i = t.eventTarget,
                    a = t.pointerIndex,
                    c = e.holdTimers[a],
                    u = s.getPath(i),
                    p = {
                      interaction: e,
                      pointer: r,
                      event: o,
                      eventTarget: i,
                      type: 'hold',
                      targets: [],
                      path: u,
                      element: null,
                    },
                    d = 0;
                  d < u.length;
                  d++
                ) {
                  var f;
                  f = u[d];
                  var h = f;
                  (p.element = h), l.fire('collect-targets', p);
                }
                if (p.targets.length) {
                  for (var g = Infinity, v = 0; v < p.targets.length; v++) {
                    var m;
                    m = p.targets[v];
                    var y = m,
                      x = y.eventable.options.holdDuration;
                    x < g && (g = x);
                  }
                  (c.duration = g),
                    (c.timeout = setTimeout(function () {
                      n({
                        interaction: e,
                        eventTarget: i,
                        pointer: r,
                        event: o,
                        type: 'hold',
                      });
                    }, g));
                }
              }),
              a.signals.on('up', function (t) {
                var e = t.interaction,
                  r = t.pointer,
                  o = t.event,
                  i = t.eventTarget;
                e.pointerWasMoved ||
                  n({
                    interaction: e,
                    eventTarget: i,
                    pointer: r,
                    event: o,
                    type: 'tap',
                  });
              });
            for (var f = ['up', 'cancel'], h = 0; h < f.length; h++) {
              var g = f[h];
              a.signals.on(g, function (t) {
                var e = t.interaction,
                  n = t.pointerIndex;
                e.holdTimers[n] && clearTimeout(e.holdTimers[n].timeout);
              });
            }
            for (var v = 0; v < u.length; v++) a.signals.on(u[v], o(p[v]));
            a.signals.on('new', function (t) {
              (t.prevTap = null), (t.tapTime = 0), (t.holdTimers = []);
            }),
              (c.pointerEvents = d.defaults),
              (e.exports = d);
          },
          {
            '../Interaction': 5,
            '../defaultOptions': 18,
            '../utils': 43,
            '../utils/Signals': 34,
            './PointerEvent': 29,
          },
        ],
        31: [
          function (t, e) {
            'use strict';
            function n(t) {
              var e = t.pointerEvent;
              'hold' === e.type && (e.count = (e.count || 0) + 1);
            }
            function r(t) {
              var e = t.interaction,
                n = t.pointerEvent,
                r = t.eventTarget,
                o = t.targets;
              if ('hold' === n.type && o.length) {
                var a = o[0].eventable.options.holdRepeatInterval;
                a <= 0 ||
                  (e.holdIntervalHandle = setTimeout(function () {
                    i.fire({
                      interaction: e,
                      eventTarget: r,
                      type: 'hold',
                      pointer: n,
                      event: n,
                    });
                  }, a));
              }
            }
            function o(t) {
              var e = t.interaction;
              e.holdIntervalHandle &&
                (clearInterval(e.holdIntervalHandle),
                (e.holdIntervalHandle = null));
            }
            var i = t('./base'),
              a = t('../Interaction');
            i.signals.on('new', n), i.signals.on('fired', r);
            for (
              var s = ['move', 'up', 'cancel', 'endall'], c = 0;
              c < s.length;
              c++
            ) {
              var l = s[c];
              a.signals.on(l, o);
            }
            (i.defaults.holdRepeatInterval = 0),
              i.types.push('holdrepeat'),
              (e.exports = {
                onNew: n,
                onFired: r,
                endHoldRepeat: o,
              });
          },
          { '../Interaction': 5, './base': 30 },
        ],
        32: [
          function (t) {
            'use strict';
            var e = t('./base'),
              n = t('../Interactable'),
              r = t('../utils/is'),
              o = t('../scope'),
              i = t('../utils/extend'),
              a = t('../utils/arr'),
              s = a.merge;
            e.signals.on('collect-targets', function (t) {
              var e = t.targets,
                n = t.element,
                i = t.type,
                a = t.eventTarget;
              o.interactables.forEachMatch(n, function (t) {
                var o = t.events,
                  s = o.options;
                o[i] &&
                  r.element(n) &&
                  t.testIgnoreAllow(s, n, a) &&
                  e.push({
                    element: n,
                    eventable: o,
                    props: { interactable: t },
                  });
              });
            }),
              n.signals.on('new', function (t) {
                var e = t.interactable;
                e.events.getRect = function (t) {
                  return e.getRect(t);
                };
              }),
              n.signals.on('set', function (t) {
                var n = t.interactable,
                  r = t.options;
                i(n.events.options, e.defaults), i(n.events.options, r);
              }),
              s(n.eventTypes, e.types),
              (n.prototype.pointerEvents = function (t) {
                return i(this.events.options, t), this;
              });
            var c = n.prototype._backCompatOption;
            (n.prototype._backCompatOption = function (t, e) {
              var n = c.call(this, t, e);
              return n === this && (this.events.options[t] = e), n;
            }),
              n.settingsMethods.push('pointerEvents');
          },
          {
            '../Interactable': 4,
            '../scope': 33,
            '../utils/arr': 35,
            '../utils/extend': 40,
            '../utils/is': 45,
            './base': 30,
          },
        ],
        33: [
          function (t, e) {
            'use strict';
            var n = t('./utils'),
              r = t('./utils/events'),
              o = t('./utils/Signals')['new'](),
              i = t('./utils/window'),
              a = i.getWindow,
              s = {
                signals: o,
                events: r,
                utils: n,
                document: t('./utils/domObjects').document,
                documents: [],
                addDocument: function (t, e) {
                  if (n.contains(s.documents, t)) return !1;
                  (e = e || a(t)),
                    s.documents.push(t),
                    r.documents.push(t),
                    t !== s.document && r.add(e, 'unload', s.onWindowUnload),
                    o.fire('add-document', {
                      doc: t,
                      win: e,
                    });
                },
                removeDocument: function (t, e) {
                  var n = s.documents.indexOf(t);
                  (e = e || a(t)),
                    r.remove(e, 'unload', s.onWindowUnload),
                    s.documents.splice(n, 1),
                    r.documents.splice(n, 1),
                    o.fire('remove-document', {
                      win: e,
                      doc: t,
                    });
                },
                onWindowUnload: function () {
                  s.removeDocument(this.document, this);
                },
              };
            e.exports = s;
          },
          {
            './utils': 43,
            './utils/Signals': 34,
            './utils/domObjects': 37,
            './utils/events': 39,
            './utils/window': 51,
          },
        ],
        34: [
          function (t, e) {
            'use strict';
            function n(t, e) {
              if (!(t instanceof e))
                throw new TypeError('Cannot call a class as a function');
            }
            var r = (function () {
              function t() {
                n(this, t), (this.listeners = {});
              }
              return (
                (t.prototype.on = function (t, e) {
                  if (!this.listeners[t]) return void (this.listeners[t] = [e]);
                  this.listeners[t].push(e);
                }),
                (t.prototype.off = function (t, e) {
                  if (this.listeners[t]) {
                    var n = this.listeners[t].indexOf(e);
                    -1 !== n && this.listeners[t].splice(n, 1);
                  }
                }),
                (t.prototype.fire = function (t, e) {
                  var n = this.listeners[t];
                  if (n)
                    for (var r = 0; r < n.length; r++) {
                      var o;
                      o = n[r];
                      var i = o;
                      if (!1 === i(e, t)) return;
                    }
                }),
                t
              );
            })();
            (r['new'] = function () {
              return new r();
            }),
              (e.exports = r);
          },
          {},
        ],
        35: [
          function (t, e) {
            'use strict';
            function n(t, e) {
              return -1 !== t.indexOf(e);
            }
            function r(t, e) {
              for (var n = 0; n < e.length; n++) {
                var r;
                r = e[n];
                var o = r;
                t.push(o);
              }
              return t;
            }
            e.exports = { contains: n, merge: r };
          },
          {},
        ],
        36: [
          function (t, e) {
            'use strict';
            var n = t('./window'),
              r = n.window,
              o = t('./is'),
              i = t('./domObjects'),
              a = i.Element,
              s = r.navigator,
              c = {
                supportsTouch: !!(
                  'ontouchstart' in r ||
                  (o['function'](r.DocumentTouch) &&
                    i.document instanceof r.DocumentTouch)
                ),
                supportsPointerEvent: !!i.PointerEvent,
                isIOS7:
                  /iP(hone|od|ad)/.test(s.platform) &&
                  /OS 7[^\d]/.test(s.appVersion),
                isIe9: /MSIE 9/.test(s.userAgent),
                prefixedMatchesSelector:
                  'matches' in a.prototype
                    ? 'matches'
                    : 'webkitMatchesSelector' in a.prototype
                    ? 'webkitMatchesSelector'
                    : 'mozMatchesSelector' in a.prototype
                    ? 'mozMatchesSelector'
                    : 'oMatchesSelector' in a.prototype
                    ? 'oMatchesSelector'
                    : 'msMatchesSelector',
                pEventTypes: i.PointerEvent
                  ? i.PointerEvent === r.MSPointerEvent
                    ? {
                        up: 'MSPointerUp',
                        down: 'MSPointerDown',
                        over: 'mouseover',
                        out: 'mouseout',
                        move: 'MSPointerMove',
                        cancel: 'MSPointerCancel',
                      }
                    : {
                        up: 'pointerup',
                        down: 'pointerdown',
                        over: 'pointerover',
                        out: 'pointerout',
                        move: 'pointermove',
                        cancel: 'pointercancel',
                      }
                  : null,
                wheelEvent:
                  'onmousewheel' in i.document ? 'mousewheel' : 'wheel',
              };
            (c.isOperaMobile =
              'Opera' === s.appName &&
              c.supportsTouch &&
              s.userAgent.match('Presto')),
              (e.exports = c);
          },
          { './domObjects': 37, './is': 45, './window': 51 },
        ],
        37: [
          function (t, e) {
            'use strict';
            function n() {}
            var r = {},
              o = t('./window').window;
            (r.document = o.document),
              (r.DocumentFragment = o.DocumentFragment || n),
              (r.SVGElement = o.SVGElement || n),
              (r.SVGSVGElement = o.SVGSVGElement || n),
              (r.SVGElementInstance = o.SVGElementInstance || n),
              (r.Element = o.Element || n),
              (r.HTMLElement = o.HTMLElement || r.Element),
              (r.Event = o.Event),
              (r.Touch = o.Touch || n),
              (r.PointerEvent = o.PointerEvent || o.MSPointerEvent),
              (e.exports = r);
          },
          { './window': 51 },
        ],
        38: [
          function (t, e) {
            'use strict';
            var n = t('./window'),
              r = t('./browser'),
              o = t('./is'),
              i = t('./domObjects'),
              a = {
                nodeContains: function (t, e) {
                  for (; e; ) {
                    if (e === t) return !0;
                    e = e.parentNode;
                  }
                  return !1;
                },
                closest: function (t, e) {
                  for (; o.element(t); ) {
                    if (a.matchesSelector(t, e)) return t;
                    t = a.parentNode(t);
                  }
                  return null;
                },
                parentNode: function (t) {
                  var e = t.parentNode;
                  if (o.docFrag(e)) {
                    for (; (e = e.host) && o.docFrag(e); );
                    return e;
                  }
                  return e;
                },
                matchesSelector: function (t, e) {
                  return (
                    n.window !== n.realWindow &&
                      (e = e.replace(/\/deep\//g, ' ')),
                    t[r.prefixedMatchesSelector](e)
                  );
                },
                indexOfDeepestElement: function (t) {
                  var e = [],
                    n = [],
                    r = void 0,
                    o = t[0],
                    a = o ? 0 : -1,
                    s = void 0,
                    c = void 0,
                    l = void 0,
                    u = void 0;
                  for (l = 1; l < t.length; l++)
                    if ((r = t[l]) && r !== o)
                      if (o) {
                        if (r.parentNode !== r.ownerDocument)
                          if (o.parentNode !== r.ownerDocument) {
                            if (!e.length)
                              for (
                                s = o;
                                s.parentNode &&
                                s.parentNode !== s.ownerDocument;

                              )
                                e.unshift(s), (s = s.parentNode);
                            if (
                              o instanceof i.HTMLElement &&
                              r instanceof i.SVGElement &&
                              !(r instanceof i.SVGSVGElement)
                            ) {
                              if (r === o.parentNode) continue;
                              s = r.ownerSVGElement;
                            } else s = r;
                            for (n = []; s.parentNode !== s.ownerDocument; )
                              n.unshift(s), (s = s.parentNode);
                            for (u = 0; n[u] && n[u] === e[u]; ) u++;
                            var p = [n[u - 1], n[u], e[u]];
                            for (c = p[0].lastChild; c; ) {
                              if (c === p[1]) {
                                (o = r), (a = l), (e = []);
                                break;
                              }
                              if (c === p[2]) break;
                              c = c.previousSibling;
                            }
                          } else (o = r), (a = l);
                      } else (o = r), (a = l);
                  return a;
                },
                matchesUpTo: function (t, e, n) {
                  for (; o.element(t); ) {
                    if (a.matchesSelector(t, e)) return !0;
                    if ((t = a.parentNode(t)) === n)
                      return a.matchesSelector(t, e);
                  }
                  return !1;
                },
                getActualElement: function (t) {
                  return t instanceof i.SVGElementInstance
                    ? t.correspondingUseElement
                    : t;
                },
                getScrollXY: function (t) {
                  return (
                    (t = t || n.window),
                    {
                      x: t.scrollX || t.document.documentElement.scrollLeft,
                      y: t.scrollY || t.document.documentElement.scrollTop,
                    }
                  );
                },
                getElementClientRect: function (t) {
                  var e =
                    t instanceof i.SVGElement
                      ? t.getBoundingClientRect()
                      : t.getClientRects()[0];
                  return (
                    e && {
                      left: e.left,
                      right: e.right,
                      top: e.top,
                      bottom: e.bottom,
                      width: e.width || e.right - e.left,
                      height: e.height || e.bottom - e.top,
                    }
                  );
                },
                getElementRect: function (t) {
                  var e = a.getElementClientRect(t);
                  if (!r.isIOS7 && e) {
                    var o = a.getScrollXY(n.getWindow(t));
                    (e.left += o.x),
                      (e.right += o.x),
                      (e.top += o.y),
                      (e.bottom += o.y);
                  }
                  return e;
                },
                getPath: function (t) {
                  for (var e = []; t; ) e.push(t), (t = a.parentNode(t));
                  return e;
                },
                trySelector: function (t) {
                  return !!o.string(t) && (i.document.querySelector(t), !0);
                },
              };
            e.exports = a;
          },
          {
            './browser': 36,
            './domObjects': 37,
            './is': 45,
            './window': 51,
          },
        ],
        39: [
          function (t, e) {
            'use strict';
            function n(t, e, n, r) {
              var o = l(r),
                i = y.indexOf(t),
                a = x[i];
              a ||
                ((a = { events: {}, typeCount: 0 }),
                (i = y.push(t) - 1),
                x.push(a)),
                a.events[e] || ((a.events[e] = []), a.typeCount++),
                m(a.events[e], n) ||
                  (t.addEventListener(e, n, S ? o : !!o.capture),
                  a.events[e].push(n));
            }
            function r(t, e, n, o) {
              var i = l(o),
                a = y.indexOf(t),
                s = x[a];
              if (s && s.events)
                if ('all' !== e) {
                  if (s.events[e]) {
                    var c = s.events[e].length;
                    if ('all' === n) {
                      for (var u = 0; u < c; u++) r(t, e, s.events[e][u], i);
                      return;
                    }
                    for (var p = 0; p < c; p++)
                      if (s.events[e][p] === n) {
                        t.removeEventListener('on' + e, n, S ? i : !!i.capture),
                          s.events[e].splice(p, 1);
                        break;
                      }
                    s.events[e] &&
                      0 === s.events[e].length &&
                      ((s.events[e] = null), s.typeCount--);
                  }
                  s.typeCount || (x.splice(a, 1), y.splice(a, 1));
                } else
                  for (e in s.events)
                    s.events.hasOwnProperty(e) && r(t, e, 'all');
            }
            function o(t, e, r, o, i) {
              var c = l(i);
              if (!b[r]) {
                b[r] = {
                  selectors: [],
                  contexts: [],
                  listeners: [],
                };
                for (var u = 0; u < w.length; u++) {
                  var p = w[u];
                  n(p, r, a), n(p, r, s, !0);
                }
              }
              var d = b[r],
                f = void 0;
              for (
                f = d.selectors.length - 1;
                f >= 0 && (d.selectors[f] !== t || d.contexts[f] !== e);
                f--
              );
              -1 === f &&
                ((f = d.selectors.length),
                d.selectors.push(t),
                d.contexts.push(e),
                d.listeners.push([])),
                d.listeners[f].push([o, !!c.capture, c.passive]);
            }
            function i(t, e, n, o, i) {
              var c = l(i),
                u = b[n],
                p = !1,
                d = void 0;
              if (u)
                for (d = u.selectors.length - 1; d >= 0; d--)
                  if (u.selectors[d] === t && u.contexts[d] === e) {
                    for (
                      var f = u.listeners[d], h = f.length - 1;
                      h >= 0;
                      h--
                    ) {
                      var g = f[h],
                        v = g[0],
                        m = g[1],
                        y = g[2];
                      if (v === o && m === !!c.capture && y === c.passive) {
                        f.splice(h, 1),
                          f.length ||
                            (u.selectors.splice(d, 1),
                            u.contexts.splice(d, 1),
                            u.listeners.splice(d, 1),
                            r(e, n, a),
                            r(e, n, s, !0),
                            u.selectors.length || (b[n] = null)),
                          (p = !0);
                        break;
                      }
                    }
                    if (p) break;
                  }
            }
            function a(t, e) {
              var n = l(e),
                r = {},
                o = b[t.type],
                i = d.getEventTargets(t),
                a = i[0],
                s = a;
              for (
                f(r, t), r.originalEvent = t, r.preventDefault = c;
                u.element(s);

              ) {
                for (var h = 0; h < o.selectors.length; h++) {
                  var g = o.selectors[h],
                    v = o.contexts[h];
                  if (
                    p.matchesSelector(s, g) &&
                    p.nodeContains(v, a) &&
                    p.nodeContains(v, s)
                  ) {
                    var m = o.listeners[h];
                    r.currentTarget = s;
                    for (var y = 0; y < m.length; y++) {
                      var x = m[y],
                        w = x[0],
                        S = x[1],
                        C = x[2];
                      S === !!n.capture && C === n.passive && w(r);
                    }
                  }
                }
                s = p.parentNode(s);
              }
            }
            function s(t) {
              return a.call(this, t, !0);
            }
            function c() {
              this.originalEvent.preventDefault();
            }
            function l(t) {
              return u.object(t) ? t : { capture: t };
            }
            var u = t('./is'),
              p = t('./domUtils'),
              d = t('./pointerUtils'),
              f = t('./pointerExtend'),
              h = t('./window'),
              g = h.window,
              v = t('./arr'),
              m = v.contains,
              y = [],
              x = [],
              b = {},
              w = [],
              S = (function () {
                var t = !1;
                return (
                  g.document
                    .createElement('div')
                    .addEventListener('test', null, {
                      get capture() {
                        t = !0;
                      },
                    }),
                  t
                );
              })();
            e.exports = {
              add: n,
              remove: r,
              addDelegate: o,
              removeDelegate: i,
              delegateListener: a,
              delegateUseCapture: s,
              delegatedEvents: b,
              documents: w,
              supportsOptions: S,
              _elements: y,
              _targets: x,
            };
          },
          {
            './arr': 35,
            './domUtils': 38,
            './is': 45,
            './pointerExtend': 47,
            './pointerUtils': 48,
            './window': 51,
          },
        ],
        40: [
          function (t, e) {
            'use strict';
            e.exports = function (t, e) {
              for (var n in e) t[n] = e[n];
              return t;
            };
          },
          {},
        ],
        41: [
          function (t, e) {
            'use strict';
            var n = t('./rect'),
              r = n.resolveRectLike,
              o = n.rectToXY;
            e.exports = function (t, e, n) {
              var i = t.options[n],
                a = i && i.origin,
                s = a || t.options.origin,
                c = r(s, t, e, [t && e]);
              return o(c) || { x: 0, y: 0 };
            };
          },
          { './rect': 50 },
        ],
        42: [
          function (t, e) {
            'use strict';
            e.exports = function (t, e) {
              return Math.sqrt(t * t + e * e);
            };
          },
          {},
        ],
        43: [
          function (t, e) {
            'use strict';
            var n = t('./extend'),
              r = t('./window'),
              o = {
                warnOnce: function (t, e) {
                  var n = !1;
                  return function () {
                    return (
                      n || (r.window.console.warn(e), (n = !0)),
                      t.apply(this, arguments)
                    );
                  };
                },
                _getQBezierValue: function (t, e, n, r) {
                  var o = 1 - t;
                  return o * o * e + 2 * o * t * n + t * t * r;
                },
                getQuadraticCurvePoint: function (t, e, n, r, i, a, s) {
                  return {
                    x: o._getQBezierValue(s, t, n, i),
                    y: o._getQBezierValue(s, e, r, a),
                  };
                },
                easeOutQuad: function (t, e, n, r) {
                  return (t /= r), -n * t * (t - 2) + e;
                },
                copyAction: function (t, e) {
                  return (
                    (t.name = e.name), (t.axis = e.axis), (t.edges = e.edges), t
                  );
                },
                is: t('./is'),
                extend: n,
                hypot: t('./hypot'),
                getOriginXY: t('./getOriginXY'),
              };
            n(o, t('./arr')),
              n(o, t('./domUtils')),
              n(o, t('./pointerUtils')),
              n(o, t('./rect')),
              (e.exports = o);
          },
          {
            './arr': 35,
            './domUtils': 38,
            './extend': 40,
            './getOriginXY': 41,
            './hypot': 42,
            './is': 45,
            './pointerUtils': 48,
            './rect': 50,
            './window': 51,
          },
        ],
        44: [
          function (t, e) {
            'use strict';
            var n = t('../scope'),
              r = t('./index'),
              o = {
                methodOrder: [
                  'simulationResume',
                  'mouseOrPen',
                  'hasPointer',
                  'idle',
                ],
                search: function (t, e, n) {
                  for (
                    var i = r.getPointerType(t),
                      a = r.getPointerId(t),
                      s = {
                        pointer: t,
                        pointerId: a,
                        pointerType: i,
                        eventType: e,
                        eventTarget: n,
                      },
                      c = 0;
                    c < o.methodOrder.length;
                    c++
                  ) {
                    var l;
                    l = o.methodOrder[c];
                    var u = l,
                      p = o[u](s);
                    if (p) return p;
                  }
                },
                simulationResume: function (t) {
                  var e = t.pointerType,
                    o = t.eventType,
                    i = t.eventTarget;
                  if (!/down|start/i.test(o)) return null;
                  for (var a = 0; a < n.interactions.length; a++) {
                    var s;
                    s = n.interactions[a];
                    var c = s,
                      l = i;
                    if (
                      c.simulation &&
                      c.simulation.allowResume &&
                      c.pointerType === e
                    )
                      for (; l; ) {
                        if (l === c.element) return c;
                        l = r.parentNode(l);
                      }
                  }
                  return null;
                },
                mouseOrPen: function (t) {
                  var e = t.pointerId,
                    o = t.pointerType,
                    i = t.eventType;
                  if ('mouse' !== o && 'pen' !== o) return null;
                  for (var a = void 0, s = 0; s < n.interactions.length; s++) {
                    var c;
                    c = n.interactions[s];
                    var l = c;
                    if (l.pointerType === o) {
                      if (l.simulation && !r.contains(l.pointerIds, e))
                        continue;
                      if (l.interacting()) return l;
                      a || (a = l);
                    }
                  }
                  if (a) return a;
                  for (var u = 0; u < n.interactions.length; u++) {
                    var p;
                    p = n.interactions[u];
                    var d = p;
                    if (
                      !(
                        d.pointerType !== o ||
                        (/down/i.test(i) && d.simulation)
                      )
                    )
                      return d;
                  }
                  return null;
                },
                hasPointer: function (t) {
                  for (
                    var e = t.pointerId, o = 0;
                    o < n.interactions.length;
                    o++
                  ) {
                    var i;
                    i = n.interactions[o];
                    var a = i;
                    if (r.contains(a.pointerIds, e)) return a;
                  }
                },
                idle: function (t) {
                  for (
                    var e = t.pointerType, r = 0;
                    r < n.interactions.length;
                    r++
                  ) {
                    var o;
                    o = n.interactions[r];
                    var i = o;
                    if (1 === i.pointerIds.length) {
                      var a = i.target;
                      if (a && !a.options.gesture.enabled) continue;
                    } else if (i.pointerIds.length >= 2) continue;
                    if (!i.interacting() && e === i.pointerType) return i;
                  }
                  return null;
                },
              };
            e.exports = o;
          },
          { '../scope': 33, './index': 43 },
        ],
        45: [
          function (t, e) {
            'use strict';
            var n =
                'function' == typeof Symbol &&
                'symbol' == typeof Symbol.iterator
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        'function' == typeof Symbol &&
                        t.constructor === Symbol &&
                        t !== Symbol.prototype
                        ? 'symbol'
                        : typeof t;
                    },
              r = t('./window'),
              o = t('./isWindow'),
              i = {
                array: function () {},
                window: function (t) {
                  return t === r.window || o(t);
                },
                docFrag: function (t) {
                  return i.object(t) && 11 === t.nodeType;
                },
                object: function (t) {
                  return (
                    !!t && 'object' === (void 0 === t ? 'undefined' : n(t))
                  );
                },
                function: function (t) {
                  return 'function' == typeof t;
                },
                number: function (t) {
                  return 'number' == typeof t;
                },
                bool: function (t) {
                  return 'boolean' == typeof t;
                },
                string: function (t) {
                  return 'string' == typeof t;
                },
                element: function (t) {
                  if (!t || 'object' !== (void 0 === t ? 'undefined' : n(t)))
                    return !1;
                  var e = r.getWindow(t) || r.window;
                  return /object|function/.test(n(e.Element))
                    ? t instanceof e.Element
                    : 1 === t.nodeType && 'string' == typeof t.nodeName;
                },
              };
            (i.array = function (t) {
              return (
                i.object(t) &&
                'undefined' != typeof t.length &&
                i['function'](t.splice)
              );
            }),
              (e.exports = i);
          },
          { './isWindow': 46, './window': 51 },
        ],
        46: [
          function (t, e) {
            'use strict';
            e.exports = function (t) {
              return !(!t || !t.Window) && t instanceof t.Window;
            };
          },
          {},
        ],
        47: [
          function (t, e) {
            'use strict';
            function n(t, n) {
              for (var r in n) {
                var o = e.exports.prefixedPropREs,
                  i = !1;
                for (var a in o)
                  if (0 === r.indexOf(a) && o[a].test(r)) {
                    i = !0;
                    break;
                  }
                i || 'function' == typeof n[r] || (t[r] = n[r]);
              }
              return t;
            }
            (n.prefixedPropREs = {
              webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/,
            }),
              (e.exports = n);
          },
          {},
        ],
        48: [
          function (t, e) {
            'use strict';
            var n = t('./hypot'),
              r = t('./browser'),
              o = t('./domObjects'),
              i = t('./domUtils'),
              a = t('./domObjects'),
              s = t('./is'),
              c = t('./pointerExtend'),
              l = {
                copyCoords: function (t, e) {
                  (t.page = t.page || {}),
                    (t.page.x = e.page.x),
                    (t.page.y = e.page.y),
                    (t.client = t.client || {}),
                    (t.client.x = e.client.x),
                    (t.client.y = e.client.y),
                    (t.timeStamp = e.timeStamp);
                },
                setCoordDeltas: function (t, e, r) {
                  (t.page.x = r.page.x - e.page.x),
                    (t.page.y = r.page.y - e.page.y),
                    (t.client.x = r.client.x - e.client.x),
                    (t.client.y = r.client.y - e.client.y),
                    (t.timeStamp = r.timeStamp - e.timeStamp);
                  var o = Math.max(t.timeStamp / 1e3, 0.001);
                  (t.page.speed = n(t.page.x, t.page.y) / o),
                    (t.page.vx = t.page.x / o),
                    (t.page.vy = t.page.y / o),
                    (t.client.speed = n(t.client.x, t.page.y) / o),
                    (t.client.vx = t.client.x / o),
                    (t.client.vy = t.client.y / o);
                },
                isNativePointer: function (t) {
                  return t instanceof o.Event || t instanceof o.Touch;
                },
                getXY: function (t, e, n) {
                  return (
                    (n = n || {}),
                    (t = t || 'page'),
                    (n.x = e[t + 'X']),
                    (n.y = e[t + 'Y']),
                    n
                  );
                },
                getPageXY: function (t, e) {
                  return (
                    (e = e || {}),
                    r.isOperaMobile && l.isNativePointer(t)
                      ? (l.getXY('screen', t, e),
                        (e.x += window.scrollX),
                        (e.y += window.scrollY))
                      : l.getXY('page', t, e),
                    e
                  );
                },
                getClientXY: function (t, e) {
                  return (
                    (e = e || {}),
                    r.isOperaMobile && l.isNativePointer(t)
                      ? l.getXY('screen', t, e)
                      : l.getXY('client', t, e),
                    e
                  );
                },
                getPointerId: function (t) {
                  return s.number(t.pointerId) ? t.pointerId : t.identifier;
                },
                setCoords: function (t, e, n) {
                  var r = e.length > 1 ? l.pointerAverage(e) : e[0],
                    o = {};
                  l.getPageXY(r, o),
                    (t.page.x = o.x),
                    (t.page.y = o.y),
                    l.getClientXY(r, o),
                    (t.client.x = o.x),
                    (t.client.y = o.y),
                    (t.timeStamp = s.number(n) ? n : new Date().getTime());
                },
                pointerExtend: c,
                getTouchPair: function (t) {
                  var e = [];
                  return (
                    s.array(t)
                      ? ((e[0] = t[0]), (e[1] = t[1]))
                      : 'touchend' === t.type
                      ? 1 === t.touches.length
                        ? ((e[0] = t.touches[0]), (e[1] = t.changedTouches[0]))
                        : 0 === t.touches.length &&
                          ((e[0] = t.changedTouches[0]),
                          (e[1] = t.changedTouches[1]))
                      : ((e[0] = t.touches[0]), (e[1] = t.touches[1])),
                    e
                  );
                },
                pointerAverage: function (t) {
                  for (
                    var e = {
                        pageX: 0,
                        pageY: 0,
                        clientX: 0,
                        clientY: 0,
                        screenX: 0,
                        screenY: 0,
                      },
                      n = 0;
                    n < t.length;
                    n++
                  ) {
                    var r;
                    r = t[n];
                    var o = r;
                    for (var i in e) e[i] += o[i];
                  }
                  for (var a in e) e[a] /= t.length;
                  return e;
                },
                touchBBox: function (t) {
                  if (t.length || (t.touches && t.touches.length > 1)) {
                    var e = l.getTouchPair(t),
                      n = Math.min(e[0].pageX, e[1].pageX),
                      r = Math.min(e[0].pageY, e[1].pageY);
                    return {
                      x: n,
                      y: r,
                      left: n,
                      top: r,
                      width: Math.max(e[0].pageX, e[1].pageX) - n,
                      height: Math.max(e[0].pageY, e[1].pageY) - r,
                    };
                  }
                },
                touchDistance: function (t, e) {
                  var r = e + 'X',
                    o = e + 'Y',
                    i = l.getTouchPair(t),
                    a = i[0][r] - i[1][r],
                    s = i[0][o] - i[1][o];
                  return n(a, s);
                },
                touchAngle: function (t, e, n) {
                  var r = n + 'X',
                    o = n + 'Y',
                    i = l.getTouchPair(t),
                    a = i[1][r] - i[0][r],
                    s = i[1][o] - i[0][o];
                  return (180 * Math.atan2(s, a)) / Math.PI;
                },
                getPointerType: function (t) {
                  return s.string(t.pointerType)
                    ? t.pointerType
                    : s.number(t.pointerType)
                    ? [undefined, undefined, 'touch', 'pen', 'mouse'][
                        t.pointerType
                      ]
                    : /touch/.test(t.type) || t instanceof a.Touch
                    ? 'touch'
                    : 'mouse';
                },
                getEventTargets: function (t) {
                  var e = s['function'](t.composedPath)
                    ? t.composedPath()
                    : t.path;
                  return [
                    i.getActualElement(e ? e[0] : t.target),
                    i.getActualElement(t.currentTarget),
                  ];
                },
              };
            e.exports = l;
          },
          {
            './browser': 36,
            './domObjects': 37,
            './domUtils': 38,
            './hypot': 42,
            './is': 45,
            './pointerExtend': 47,
          },
        ],
        49: [
          function (t, e) {
            'use strict';
            for (
              var n = t('./window'),
                r = n.window,
                o = ['ms', 'moz', 'webkit', 'o'],
                i = 0,
                a = void 0,
                s = void 0,
                c = 0;
              c < o.length && !r.requestAnimationFrame;
              c++
            )
              (a = r[o[c] + 'RequestAnimationFrame']),
                (s =
                  r[o[c] + 'CancelAnimationFrame'] ||
                  r[o[c] + 'CancelRequestAnimationFrame']);
            a ||
              (a = function (t) {
                var e = new Date().getTime(),
                  n = Math.max(0, 16 - (e - i)),
                  r = setTimeout(function () {
                    t(e + n);
                  }, n);
                return (i = e + n), r;
              }),
              s ||
                (s = function (t) {
                  clearTimeout(t);
                }),
              (e.exports = { request: a, cancel: s });
          },
          { './window': 51 },
        ],
        50: [
          function (t, e) {
            'use strict';
            var n = t('./extend'),
              r = t('./is'),
              o = t('./domUtils'),
              i = o.closest,
              a = o.parentNode,
              s = o.getElementRect,
              c = {
                getStringOptionResult: function (t, e, n) {
                  return r.string(t)
                    ? (t =
                        'parent' === t
                          ? a(n)
                          : 'self' === t
                          ? e.getRect(n)
                          : i(n, t))
                    : null;
                },
                resolveRectLike: function (t, e, n, o) {
                  return (
                    (t = c.getStringOptionResult(t, e, n) || t),
                    r['function'](t) && (t = t.apply(null, o)),
                    r.element(t) && (t = s(t)),
                    t
                  );
                },
                rectToXY: function (t) {
                  return (
                    t && {
                      x: 'x' in t ? t.x : t.left,
                      y: 'y' in t ? t.y : t.top,
                    }
                  );
                },
                xywhToTlbr: function (t) {
                  return (
                    !t ||
                      ('left' in t && 'top' in t) ||
                      ((t = n({}, t)),
                      (t.left = t.x || 0),
                      (t.top = t.y || 0),
                      (t.right = t.right || t.left + t.width),
                      (t.bottom = t.bottom || t.top + t.height)),
                    t
                  );
                },
                tlbrToXywh: function (t) {
                  return (
                    !t ||
                      ('x' in t && 'y' in t) ||
                      ((t = n({}, t)),
                      (t.x = t.left || 0),
                      (t.top = t.top || 0),
                      (t.width = t.width || t.right - t.x),
                      (t.height = t.height || t.bottom - t.y)),
                    t
                  );
                },
              };
            e.exports = c;
          },
          { './domUtils': 38, './extend': 40, './is': 45 },
        ],
        51: [
          function (t, e) {
            'use strict';
            function n(t) {
              r.realWindow = t;
              var e = t.document.createTextNode('');
              e.ownerDocument !== t.document &&
                'function' == typeof t.wrap &&
                t.wrap(e) === e &&
                (t = t.wrap(t)),
                (r.window = t);
            }
            var r = e.exports,
              o = t('./isWindow');
            'undefined' == typeof window
              ? ((r.window = undefined), (r.realWindow = undefined))
              : n(window),
              (r.getWindow = function (t) {
                if (o(t)) return t;
                var e = t.ownerDocument || t;
                return e.defaultView || e.parentWindow || r.window;
              }),
              (r.init = n);
          },
          { './isWindow': 46 },
        ],
      },
      {},
      [1]
    )(1);
  }),
  (function (t, e) {
    'object' == typeof exports && 'object' == typeof module
      ? (module.exports = e())
      : 'function' == typeof define && define.amd
      ? define([], e)
      : 'object' == typeof exports
      ? (exports.ClipboardJS = e())
      : (t.ClipboardJS = e());
  })(this, function () {
    return (function (t) {
      function e(r) {
        if (n[r]) return n[r].exports;
        var o = (n[r] = { i: r, l: !1, exports: {} });
        return t[r].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
      }
      var n = {};
      return (
        (e.m = t),
        (e.c = n),
        (e.i = function (t) {
          return t;
        }),
        (e.d = function (t, n, r) {
          e.o(t, n) ||
            Object.defineProperty(t, n, {
              configurable: !1,
              enumerable: !0,
              get: r,
            });
        }),
        (e.n = function (t) {
          var n =
            t && t.__esModule
              ? function () {
                  return t['default'];
                }
              : function () {
                  return t;
                };
          return e.d(n, 'a', n), n;
        }),
        (e.o = function (t, e) {
          return Object.prototype.hasOwnProperty.call(t, e);
        }),
        (e.p = ''),
        e((e.s = 3))
      );
    })([
      function (t, e, n) {
        var r, o, i;
        !(function (a, s) {
          (o = [t, n(7)]),
            (r = s),
            void 0 !== (i = 'function' == typeof r ? r.apply(e, o) : r) &&
              (t.exports = i);
        })(0, function (t, e) {
          'use strict';
          function n(t, e) {
            if (!(t instanceof e))
              throw new TypeError('Cannot call a class as a function');
          }
          var r = (function (t) {
              return t && t.__esModule ? t : { default: t };
            })(e),
            o =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      'function' == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  },
            i = (function () {
              function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                  var r = e[n];
                  (r.enumerable = r.enumerable || !1),
                    (r.configurable = !0),
                    'value' in r && (r.writable = !0),
                    Object.defineProperty(t, r.key, r);
                }
              }
              return function (e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e;
              };
            })(),
            a = (function () {
              function t(e) {
                n(this, t), this.resolveOptions(e), this.initSelection();
              }
              return (
                i(t, [
                  {
                    key: 'resolveOptions',
                    value: function () {
                      var t =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : {};
                      (this.action = t.action),
                        (this.container = t.container),
                        (this.emitter = t.emitter),
                        (this.target = t.target),
                        (this.text = t.text),
                        (this.trigger = t.trigger),
                        (this.selectedText = '');
                    },
                  },
                  {
                    key: 'initSelection',
                    value: function () {
                      this.text
                        ? this.selectFake()
                        : this.target && this.selectTarget();
                    },
                  },
                  {
                    key: 'selectFake',
                    value: function () {
                      var t = this,
                        e =
                          'rtl' == document.documentElement.getAttribute('dir');
                      this.removeFake(),
                        (this.fakeHandlerCallback = function () {
                          return t.removeFake();
                        }),
                        (this.fakeHandler =
                          this.container.addEventListener(
                            'click',
                            this.fakeHandlerCallback
                          ) || !0),
                        (this.fakeElem = document.createElement('textarea')),
                        (this.fakeElem.style.fontSize = '12pt'),
                        (this.fakeElem.style.border = '0'),
                        (this.fakeElem.style.padding = '0'),
                        (this.fakeElem.style.margin = '0'),
                        (this.fakeElem.style.position = 'absolute'),
                        (this.fakeElem.style[e ? 'right' : 'left'] = '-9999px');
                      var n =
                        window.pageYOffset ||
                        document.documentElement.scrollTop;
                      (this.fakeElem.style.top = n + 'px'),
                        this.fakeElem.setAttribute('readonly', ''),
                        (this.fakeElem.value = this.text),
                        this.container.appendChild(this.fakeElem),
                        (this.selectedText = (0, r['default'])(this.fakeElem)),
                        this.copyText();
                    },
                  },
                  {
                    key: 'removeFake',
                    value: function () {
                      this.fakeHandler &&
                        (this.container.removeEventListener(
                          'click',
                          this.fakeHandlerCallback
                        ),
                        (this.fakeHandler = null),
                        (this.fakeHandlerCallback = null)),
                        this.fakeElem &&
                          (this.container.removeChild(this.fakeElem),
                          (this.fakeElem = null));
                    },
                  },
                  {
                    key: 'selectTarget',
                    value: function () {
                      (this.selectedText = (0, r['default'])(this.target)),
                        this.copyText();
                    },
                  },
                  {
                    key: 'copyText',
                    value: function () {
                      var t = void 0;
                      try {
                        t = document.execCommand(this.action);
                      } catch (e) {
                        t = !1;
                      }
                      this.handleResult(t);
                    },
                  },
                  {
                    key: 'handleResult',
                    value: function (t) {
                      this.emitter.emit(t ? 'success' : 'error', {
                        action: this.action,
                        text: this.selectedText,
                        trigger: this.trigger,
                        clearSelection: this.clearSelection.bind(this),
                      });
                    },
                  },
                  {
                    key: 'clearSelection',
                    value: function () {
                      this.trigger && this.trigger.focus(),
                        window.getSelection().removeAllRanges();
                    },
                  },
                  {
                    key: 'destroy',
                    value: function () {
                      this.removeFake();
                    },
                  },
                  {
                    key: 'action',
                    set: function () {
                      var t =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : 'copy';
                      if (
                        ((this._action = t),
                        'copy' !== this._action && 'cut' !== this._action)
                      )
                        throw new Error(
                          'Invalid "action" value, use either "copy" or "cut"'
                        );
                    },
                    get: function () {
                      return this._action;
                    },
                  },
                  {
                    key: 'target',
                    set: function (t) {
                      if (void 0 !== t) {
                        if (
                          !t ||
                          'object' !== (void 0 === t ? 'undefined' : o(t)) ||
                          1 !== t.nodeType
                        )
                          throw new Error(
                            'Invalid "target" value, use a valid Element'
                          );
                        if (
                          'copy' === this.action &&
                          t.hasAttribute('disabled')
                        )
                          throw new Error(
                            'Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute'
                          );
                        if (
                          'cut' === this.action &&
                          (t.hasAttribute('readonly') ||
                            t.hasAttribute('disabled'))
                        )
                          throw new Error(
                            'Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes'
                          );
                        this._target = t;
                      }
                    },
                    get: function () {
                      return this._target;
                    },
                  },
                ]),
                t
              );
            })();
          t.exports = a;
        });
      },
      function (t, e, n) {
        function r(t, e, n) {
          if (!t && !e && !n) throw new Error('Missing required arguments');
          if (!s.string(e))
            throw new TypeError('Second argument must be a String');
          if (!s.fn(n))
            throw new TypeError('Third argument must be a Function');
          if (s.node(t)) return o(t, e, n);
          if (s.nodeList(t)) return i(t, e, n);
          if (s.string(t)) return a(t, e, n);
          throw new TypeError(
            'First argument must be a String, HTMLElement, HTMLCollection, or NodeList'
          );
        }
        function o(t, e, n) {
          return (
            t.addEventListener(e, n),
            {
              destroy: function () {
                t.removeEventListener(e, n);
              },
            }
          );
        }
        function i(t, e, n) {
          return (
            Array.prototype.forEach.call(t, function (t) {
              t.addEventListener(e, n);
            }),
            {
              destroy: function () {
                Array.prototype.forEach.call(t, function (t) {
                  t.removeEventListener(e, n);
                });
              },
            }
          );
        }
        function a(t, e, n) {
          return c(document.body, t, e, n);
        }
        var s = n(6),
          c = n(5);
        t.exports = r;
      },
      function (t) {
        function e() {}
        (e.prototype = {
          on: function (t, e, n) {
            var r = this.e || (this.e = {});
            return (r[t] || (r[t] = [])).push({ fn: e, ctx: n }), this;
          },
          once: function (t, e, n) {
            function r() {
              o.off(t, r), e.apply(n, arguments);
            }
            var o = this;
            return (r._ = e), this.on(t, r, n);
          },
          emit: function (t) {
            var e = [].slice.call(arguments, 1),
              n = ((this.e || (this.e = {}))[t] || []).slice(),
              r = 0,
              o = n.length;
            for (r; r < o; r++) n[r].fn.apply(n[r].ctx, e);
            return this;
          },
          off: function (t, e) {
            var n = this.e || (this.e = {}),
              r = n[t],
              o = [];
            if (r && e)
              for (var i = 0, a = r.length; i < a; i++)
                r[i].fn !== e && r[i].fn._ !== e && o.push(r[i]);
            return o.length ? (n[t] = o) : delete n[t], this;
          },
        }),
          (t.exports = e);
      },
      function (t, e, n) {
        var r, o, i;
        !(function (a, s) {
          (o = [t, n(0), n(2), n(1)]),
            (r = s),
            void 0 !== (i = 'function' == typeof r ? r.apply(e, o) : r) &&
              (t.exports = i);
        })(0, function (t, e, n, r) {
          'use strict';
          function o(t) {
            return t && t.__esModule ? t : { default: t };
          }
          function i(t, e) {
            if (!(t instanceof e))
              throw new TypeError('Cannot call a class as a function');
          }
          function a(t, e) {
            if (!t)
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            return !e || ('object' != typeof e && 'function' != typeof e)
              ? t
              : e;
          }
          function s(t, e) {
            if ('function' != typeof e && null !== e)
              throw new TypeError(
                'Super expression must either be null or a function, not ' +
                  typeof e
              );
            (t.prototype = Object.create(e && e.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
              e &&
                (Object.setPrototypeOf
                  ? Object.setPrototypeOf(t, e)
                  : (t.__proto__ = e));
          }
          function c(t, e) {
            var n = 'data-clipboard-' + t;
            if (e.hasAttribute(n)) return e.getAttribute(n);
          }
          var l = o(e),
            u = o(n),
            p = o(r),
            d =
              'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                ? function (t) {
                    return typeof t;
                  }
                : function (t) {
                    return t &&
                      'function' == typeof Symbol &&
                      t.constructor === Symbol &&
                      t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
                  },
            f = (function () {
              function t(t, e) {
                for (var n = 0; n < e.length; n++) {
                  var r = e[n];
                  (r.enumerable = r.enumerable || !1),
                    (r.configurable = !0),
                    'value' in r && (r.writable = !0),
                    Object.defineProperty(t, r.key, r);
                }
              }
              return function (e, n, r) {
                return n && t(e.prototype, n), r && t(e, r), e;
              };
            })(),
            h = (function (t) {
              function e(t, n) {
                i(this, e);
                var r = a(
                  this,
                  (e.__proto__ || Object.getPrototypeOf(e)).call(this)
                );
                return r.resolveOptions(n), r.listenClick(t), r;
              }
              return (
                s(e, t),
                f(
                  e,
                  [
                    {
                      key: 'resolveOptions',
                      value: function () {
                        var t =
                          arguments.length > 0 && void 0 !== arguments[0]
                            ? arguments[0]
                            : {};
                        (this.action =
                          'function' == typeof t.action
                            ? t.action
                            : this.defaultAction),
                          (this.target =
                            'function' == typeof t.target
                              ? t.target
                              : this.defaultTarget),
                          (this.text =
                            'function' == typeof t.text
                              ? t.text
                              : this.defaultText),
                          (this.container =
                            'object' === d(t.container)
                              ? t.container
                              : document.body);
                      },
                    },
                    {
                      key: 'listenClick',
                      value: function (t) {
                        var e = this;
                        this.listener = (0, p['default'])(
                          t,
                          'click',
                          function (t) {
                            return e.onClick(t);
                          }
                        );
                      },
                    },
                    {
                      key: 'onClick',
                      value: function (t) {
                        var e = t.delegateTarget || t.currentTarget;
                        this.clipboardAction && (this.clipboardAction = null),
                          (this.clipboardAction = new l['default']({
                            action: this.action(e),
                            target: this.target(e),
                            text: this.text(e),
                            container: this.container,
                            trigger: e,
                            emitter: this,
                          }));
                      },
                    },
                    {
                      key: 'defaultAction',
                      value: function (t) {
                        return c('action', t);
                      },
                    },
                    {
                      key: 'defaultTarget',
                      value: function (t) {
                        var e = c('target', t);
                        if (e) return document.querySelector(e);
                      },
                    },
                    {
                      key: 'defaultText',
                      value: function (t) {
                        return c('text', t);
                      },
                    },
                    {
                      key: 'destroy',
                      value: function () {
                        this.listener.destroy(),
                          this.clipboardAction &&
                            (this.clipboardAction.destroy(),
                            (this.clipboardAction = null));
                      },
                    },
                  ],
                  [
                    {
                      key: 'isSupported',
                      value: function () {
                        var t =
                            arguments.length > 0 && void 0 !== arguments[0]
                              ? arguments[0]
                              : ['copy', 'cut'],
                          e = 'string' == typeof t ? [t] : t,
                          n = !!document.queryCommandSupported;
                        return (
                          e.forEach(function (t) {
                            n = n && !!document.queryCommandSupported(t);
                          }),
                          n
                        );
                      },
                    },
                  ]
                ),
                e
              );
            })(u['default']);
          t.exports = h;
        });
      },
      function (t) {
        function e(t, e) {
          for (; t && t.nodeType !== n; ) {
            if ('function' == typeof t.matches && t.matches(e)) return t;
            t = t.parentNode;
          }
        }
        var n = 9;
        if ('undefined' != typeof Element && !Element.prototype.matches) {
          var r = Element.prototype;
          r.matches =
            r.matchesSelector ||
            r.mozMatchesSelector ||
            r.msMatchesSelector ||
            r.oMatchesSelector ||
            r.webkitMatchesSelector;
        }
        t.exports = e;
      },
      function (t, e, n) {
        function r(t, e, n, r, o) {
          var a = i.apply(this, arguments);
          return (
            t.addEventListener(n, a, o),
            {
              destroy: function () {
                t.removeEventListener(n, a, o);
              },
            }
          );
        }
        function o(t, e, n, o, i) {
          return 'function' == typeof t.addEventListener
            ? r.apply(null, arguments)
            : 'function' == typeof n
            ? r.bind(null, document).apply(null, arguments)
            : ('string' == typeof t && (t = document.querySelectorAll(t)),
              Array.prototype.map.call(t, function (t) {
                return r(t, e, n, o, i);
              }));
        }
        function i(t, e, n, r) {
          return function (n) {
            (n.delegateTarget = a(n.target, e)),
              n.delegateTarget && r.call(t, n);
          };
        }
        var a = n(4);
        t.exports = o;
      },
      function (t, e) {
        (e.node = function (t) {
          return void 0 !== t && t instanceof HTMLElement && 1 === t.nodeType;
        }),
          (e.nodeList = function (t) {
            var n = Object.prototype.toString.call(t);
            return (
              void 0 !== t &&
              ('[object NodeList]' === n || '[object HTMLCollection]' === n) &&
              'length' in t &&
              (0 === t.length || e.node(t[0]))
            );
          }),
          (e.string = function (t) {
            return 'string' == typeof t || t instanceof String;
          }),
          (e.fn = function (t) {
            return '[object Function]' === Object.prototype.toString.call(t);
          });
      },
      function (t) {
        function e(t) {
          var e;
          if ('SELECT' === t.nodeName) t.focus(), (e = t.value);
          else if ('INPUT' === t.nodeName || 'TEXTAREA' === t.nodeName) {
            var n = t.hasAttribute('readonly');
            n || t.setAttribute('readonly', ''),
              t.select(),
              t.setSelectionRange(0, t.value.length),
              n || t.removeAttribute('readonly'),
              (e = t.value);
          } else {
            t.hasAttribute('contenteditable') && t.focus();
            var r = window.getSelection(),
              o = document.createRange();
            o.selectNodeContents(t),
              r.removeAllRanges(),
              r.addRange(o),
              (e = r.toString());
          }
          return e;
        }
        t.exports = e;
      },
    ]);
  }),
  (function (t) {
    function e(t, e) {
      return (e = e || 0), Math.round(t * Math.pow(10, e)) / Math.pow(10, e);
    }
    function n(t, e) {
      for (var n = {}, r = [], o = 0, i = t.length; o < i; ++o) {
        var a = e ? e(t[o]) : t[o];
        n.hasOwnProperty(a) || (r.push(t[o]), (n[a] = 1));
      }
      return r;
    }
    function r(t) {
      for (var e = [], n = 0, o = t.length; n < o; n++)
        e = e.concat(t[n].length ? r(t[n]) : t[n]);
      return e;
    }
    function o(t, e) {
      for (var n = 0; n < t.length; n++) e[n] = t[n];
    }
    function i(t, e, n) {
      (this.stops = t), (this.angle = e), (this.colorarray = n);
    }
    function a(t, e, n) {
      return new b(n === undefined ? t[e] : t[n][e]);
    }
    function s(t, e, n) {
      return 1 === t.length
        ? new b(t[0])
        : ((e = e || 0),
          (n = (n || t.length) - e),
          (t = t.slice(e)),
          n % 2 == 0
            ? a(t, n / 2)
            : b.getAvg(a(t, Math.floor(n / 2)), a(t, Math.ceil(n / 2))));
    }
    function c(t, e) {
      function n(t) {
        function e(t) {
          return (t * Math.PI) / 180;
        }
        return {
          x: Math.max(Math.cos(e(t)), 0),
          y: Math.max(Math.sin(e(t)), 0),
        };
      }
      t %= 360;
      var r = n(180 - t),
        o = n(0 - t);
      return { x1: r.x * e, y1: r.y * e, x2: o.x * e, y2: o.y * e };
    }
    function l(t) {
      for (var e, n = [], r = 0; r < t.length; r++)
        t[r] !== e && (n.push(t[r]), (e = t[r]));
      return n;
    }
    function u(t) {
      function e(t) {
        for (var e = [], n = 0; n <= 180; n++) {
          var r = p(t, n).map(function (t) {
            return t.join();
          });
          if (r[0] === r[r.length - 1]) e.push(n);
          else
            for (var o = l(r), i = o[0], a = 1; a < o.length && x(i, o[a]); a++)
              a === o.length - 1 && e.push(n);
        }
        return e;
      }
      function n(t, e) {
        var n = e.map(function (e) {
          return { angle: e, stops: h(p(t, e)) };
        });
        if (
          ((n = n.sort(function (t, e) {
            return t.stops.length === e.stops.length
              ? 90 === t.angle || 0 === t.angle || -90 === t.angle
                ? -1
                : 90 === e.angle || 0 === e.angle || -90 === e.angle
                ? 1
                : t.angle - e.angle
              : 1 === t.stops.length
              ? 1
              : 1 === e.stops.length
              ? -1
              : t.angle - e.angle;
          })),
          0 === n.length)
        )
          throw "Couldn't find gradient angle";
        return n[0].angle;
      }
      return n(
        t,
        e(t).map(function (t) {
          return t - 90;
        })
      );
    }
    function p(t, n) {
      for (
        var r = t[0].length,
          o = t.length,
          i = Math.sqrt(Math.pow(r, 2) + Math.pow(o, 2)),
          a = c(n, i),
          s = d(e(a.x1), e(a.y1), e(a.x2), e(a.y2)),
          l = [],
          u = 0;
        u < s.length;
        u++
      ) {
        var p = s[u][0],
          f = s[u][1];
        'undefined' != typeof t[f] &&
          'undefined' != typeof t[f][p] &&
          l.push(t[f][p]);
      }
      return l;
    }
    function d(t, e, n, r) {
      if (
        ((t = parseFloat(t)),
        (e = parseFloat(e)),
        (n = parseFloat(n)),
        (r = parseFloat(r)),
        isNaN(t) || isNaN(e) || isNaN(n) || isNaN(r))
      )
        throw "Invalid coordinates for Bresenham's";
      (t = Math.round(t)),
        (e = Math.round(e)),
        (n = Math.round(n)),
        (r = Math.round(r));
      var o = [],
        i = Math.abs(n - t),
        a = Math.abs(r - e),
        s = t < n ? 1 : -1,
        c = e < r ? 1 : -1,
        l = i - a;
      for (o.push([t, e]); t !== n || e !== r; ) {
        var u = 2 * l;
        u > -a && ((l -= a), (t += s)),
          u < i && ((l += i), (e += c)),
          o.push([t, e]);
      }
      return o;
    }
    function f(t, n, r) {
      for (var o = a(t, n), i = e(t.length / 5), c = r; c > n; c -= i) {
        var l = a(t, c),
          u = b.getAvg(o, l),
          p = s(t, n, r);
        if (!u.equals(p)) return !1;
      }
      return !0;
    }
    function h(t, e, n) {
      (e = e || 0), (n = n || t.length - 1);
      var r = [];
      return (
        f(t, e, n)
          ? (r.push(e),
            n !== t.length - 1
              ? (r = r.concat(h(t, n, t.length - 1)))
              : n !== t.length - 1 ||
                (1 === r.length && a(t, 0).equals(a(t, n))) ||
                r.push(n))
          : (r = r.concat(h(t, e, n - 1))),
        r
      );
    }
    function g(t) {
      try {
        var n = u(t),
          r = p(t, n);
        return new i(
          h(r).map(function (t) {
            return {
              idx: e(t / (r.length - 1), 2),
              color: a(r, t),
            };
          }),
          n,
          t
        );
      } catch (t) {
        return !1;
      }
    }
    function v(t) {
      for (
        var e = t.getImageData(0, 0, t.canvas.width, t.canvas.height),
          n = e.width,
          r = e.height,
          o = e.data,
          i = [],
          a = 0;
        a < r;
        a++
      ) {
        for (var s = [], c = 0; c < n; c++) {
          var l = 4 * (n * a + c),
            u = o[l],
            p = o[l + 1],
            d = o[l + 2],
            f = o[l + 3];
          s.push([u, p, d, f]);
        }
        i[a] = s;
      }
      return i;
    }
    function m(t) {
      return g(v(t.getContext('2d')));
    }
    function y(t, e) {
      var n = new Image();
      (n.src = t),
        (n.onload = function () {
          var t = this,
            n = document.createElement('canvas'),
            r = n.getContext('2d');
          (n.width = t.width),
            (n.height = t.height),
            r.drawImage(t, 0, 0),
            e(m(n));
        });
    }
    function x(t, e) {
      var n = t,
        r = e;
      return (
        t.length && (n = new b(t)),
        e.length && (r = new b(e)),
        b.prototype.equals.apply(n, [r])
      );
    }
    var b = function (t) {
      if (
        ('string' == typeof t && (t = t.split(',')),
        (this.r = t[0]),
        (this.g = t[1]),
        (this.b = t[2]),
        (this.a = 4 === t.length ? t[3] : 255),
        'undefined' == typeof this.r ||
          'undefined' == typeof this.g ||
          'undefined' == typeof this.b)
      )
        throw 'Invalid Color Array passed in';
    };
    (b.getAvg = function (t, e) {
      var n = [(t.r + e.r) / 2, (t.g + e.g) / 2, (t.b + e.b) / 2];
      return (
        ('undefined' == typeof t.a && (e.a, 0)) ||
          ((t.a = 'undefined' == typeof t.a ? 255 : t.a),
          (e.a = 'undefined' == typeof e.a ? 255 : e.a),
          n.push((t.a + e.a) / 2)),
        new b(n)
      );
    }),
      (b.prototype.equals = function (t, e) {
        if (((e = void 0 === e ? 70 : e), Math.abs(this.r - t.r) > e))
          return !1;
        if (Math.abs(this.g - t.g) > e) return !1;
        if (Math.abs(this.b - t.b) > e) return !1;
        var n = 'undefined' == typeof this.a ? 255 : this.a,
          r = 'undefined' == typeof t.a ? 255 : t.a;
        return !(Math.abs(n - r) > e);
      }),
      (b.prototype.toString = function () {
        return 255 === this.a
          ? 'rgb(' + e(this.r) + ', ' + e(this.g) + ', ' + e(this.b) + ')'
          : 'rgba(' +
              e(this.r) +
              ', ' +
              e(this.g) +
              ', ' +
              e(this.b) +
              ', ' +
              e(this.a / 255, 2) +
              ')';
      }),
      (i.prototype.toCanvas = function () {
        var t = document.createElement('canvas');
        (t.width = this.colorarray[0].length),
          (t.height = this.colorarray.length);
        var e = t.getContext('2d'),
          n = e.createImageData(t.width, t.height);
        return (
          o(r(this.colorarray), n.data),
          e.clearRect(0, 0, t.width, t.height),
          e.putImageData(n, 0, 0),
          t
        );
      }),
      (i.prototype.toCss = function () {
        if (1 === this.stops.length)
          return 'background-color: ' + this.stops[0].color.toString();
        var t = n(this.stops, function (t) {
          return e(100 * t.idx);
        });
        t = t.map(function (t) {
          return t.color.toString() + ' ' + e(100 * t.idx) + '%';
        });
        var r = this.angle + 'deg, ' + t.join(','),
          o = Math.abs(this.angle - 450) % 360;
        t.join(',');
        return (
          'background: -webkit-linear-gradient(' +
          r +
          ');\nbackground: -o-linear-gradient(' +
          r +
          ');\nbackground: -ms-linear-gradient(' +
          r +
          ');\nbackground: -moz-linear-gradient(' +
          r +
          ');\nbackground: linear-gradient(' +
          r +
          ');\n'
        );
      }),
      (t.GradientFinder = {
        fromUrl: y,
        fromCanvas: m,
        colorsEqual: x,
        Gradient: i,
        Color: b,
      });
  })(window),
  (GradientCanvas.fromExportable = function (t) {
    return new GradientCanvas(
      t.colors.map(function (t) {
        return { offset: t[0], color: tinycolor(t[1]).toRgbString() };
      }),
      t.alphas.map(function (t) {
        return { offset: t[0], alpha: t[1] };
      }),
      t.angle
    );
  }),
  (GradientCanvas.prototype.toExportable = function () {
    return {
      colors: this.getColorStops().map(function (t) {
        return [t.getOffset(), tinycolor(t.color).toHex()];
      }),
      alphas: this.getAlphaStops().map(function (t) {
        return [t.getOffset(), t.alpha];
      }),
      angle: this.angle,
    };
  }),
  (GradientCanvas.prototype.stopsToCSS = function (t, e) {
    if (0 === e.length) return 'transparent';
    if (1 === e.length) return [e[0].color];
    var n = e.map(function (t) {
      return (
        t.color + ' ' + Math.max(0, Math.min(parseInt(100 * t.offset))) + '%'
      );
    });
    return (
      'linear-gradient(' + this.angleToCSSValue(t) + ', ' + n.join(', ') + ')'
    );
  }),
  (GradientCanvas.prototype.stopsToW3cCSS = function (t, e) {
    if (0 === e.length) return 'transparent';
    if (1 === e.length) return [e[0].color];
    var n = e.map(function (t) {
      return (
        t.color + ' ' + Math.max(0, Math.min(parseInt(100 * t.offset))) + '%'
      );
    });
    return (
      'linear-gradient(' +
      this.angleToW3cCSSValue(t) +
      ', ' +
      n.join(', ') +
      ')'
    );
  }),
  (GradientCanvas.prototype.angleToW3cCSSValue = function (t) {
    var e = t || this.angle;
    void 0 === e && (e = 'top'), 0 > e && (e += 360);
    var n = {
        0: 'to right',
        90: 'to top',
        180: 'to left',
        270: 'to bottom',
      },
      r = Math.abs(e - 450) % 360;
    return n[e] && (e = n[e]), isNaN(parseInt(e)) || (e = r + 'deg'), e;
  }),
  (GradientCanvas.prototype.angleToCSSValue = function (t) {
    var e = t || this.angle;
    void 0 === e && (e = 'top'), 0 > e && (e += 360);
    var n = { 0: 'left', 90: 'bottom', 180: 'right', 270: 'top' };
    return n[e] && (e = n[e]), isNaN(parseInt(e)) || (e += 'deg'), e;
  }),
  (GradientCanvas.prototype.angleToGradientVector = function () {
    function t(t) {
      return { x: Math.cos(t), y: Math.sin(t) };
    }
    function e(t) {
      return (t * Math.PI) / 180;
    }
    var n = this.getAngle(),
      r = Math.pow(2, -52),
      o = n % 360,
      i = t(e(180 - o)),
      a = t(e(360 - o));
    return (
      0 >= i.x || r >= Math.abs(i.x)
        ? (i.x = 0)
        : ((o > 90 && 180 > o) || (o > 270 && 360 > o)) &&
          (i.x = parseFloat(i.x + 0.3)),
      0 >= i.y || r >= Math.abs(i.y)
        ? (i.y = 0)
        : ((o > 90 && 180 > o) || (o > 270 && 360 > o)) &&
          (i.y = parseFloat(i.y + 0.3)),
      0 >= a.x || r >= Math.abs(a.x)
        ? (a.x = 0)
        : ((o > 90 && 180 > o) || (o > 270 && 360 > o)) &&
          (a.x = parseFloat(a.x + 0.3)),
      0 >= a.y || r >= Math.abs(a.y)
        ? (a.y = 0)
        : ((o > 90 && 180 > o) || (o > 270 && 360 > o)) &&
          (a.y = parseFloat(a.y + 0.3)),
      {
        x1: parseInt(100 * i.x),
        y1: parseInt(100 * i.y),
        x2: parseInt(100 * a.x),
        y2: parseInt(100 * a.y),
      }
    );
  }),
  (GradientCanvas.prototype.toCSSAlpha = function (t) {
    var e = this.getAlphaStopsBlack();
    return (
      0 === e.length && (e = [{ color: '#000', offset: 1 }]),
      this.stopsToCSS(t, e)
    );
  }),
  (GradientCanvas.prototype.toSVG = function () {
    var t = this.getAllStops(),
      e = t.map(function (t) {
        return (
          '<stop offset="' +
          t.percent +
          '" style="stop-color:' +
          t.color +
          ';stop-opacity:' +
          t.alpha +
          ';" />'
        );
      }),
      n = this.angleToGradientVector();
    return [
      '<linearGradient spreadMethod="pad" id="gradient" x1="' +
        n.x1 +
        '%" y1="' +
        n.y1 +
        '%" x2="' +
        n.x2 +
        '%" y2="' +
        n.y2 +
        '%">',
      e.join('\n '),
      '</linearGradient>',
    ].join('\n');
  }),
  (GradientCanvas.prototype.getAngle = function () {
    for (; 0 > this.angle; ) this.angle += 360;
    return this.angle % 360;
  }),
  (GradientCanvas.prototype.toCSSColor = function (t) {
    return this.stopsToCSS(t, this.getColorStops());
  }),
  (GradientCanvas.prototype.toCSS = function (t) {
    return this.stopsToCSS(t, this.getAllStops());
  }),
  (GradientCanvas.prototype.toW3cCSS = function (t) {
    return this.stopsToW3cCSS(t, this.getAllStops());
  }),
  (GradientCanvas.prototype.removeStop = function (t) {
    this.removeColorStop(t), this.removeAlphaStop(t);
  }),
  (GradientCanvas.prototype.removeColorStop = function (t) {
    var e = this._colorStops.indexOf(t);
    -1 != e && this._colorStops.splice(e, 1);
  }),
  (GradientCanvas.prototype.removeAlphaStop = function (t) {
    var e = this._alphaStops.indexOf(t);
    -1 != e && this._alphaStops.splice(e, 1);
  }),
  (GradientCanvas.prototype.getAllStops = function () {
    var t = this,
      e = this.getColorStops().map(function (e) {
        var n = t.getInterpolatedAlphaAtOffset(e.offset),
          r = tinycolor(e.color);
        return (
          r.setAlpha(n),
          {
            color: r.toString('rgb'),
            hex: r.toString('hex'),
            offset: e.offset,
            percent: e.getPercentOffset(),
            alpha: n,
          }
        );
      }),
      n = this.getAlphaStops().map(function (e) {
        var n = tinycolor(t.getInterpolatedColorAtOffset(e.offset));
        return (
          n.setAlpha(e.alpha),
          {
            color: n.toString('rgb'),
            hex: n.toString('hex'),
            offset: e.offset,
            percent: e.getPercentOffset(),
            alpha: e.alpha,
          }
        );
      });
    return (
      2 > n.length && (n = []),
      e
        .concat(n)
        .unique(function (t) {
          return t.offset;
        })
        .sort(function (t, e) {
          return t.offset - e.offset;
        })
    );
  }),
  (GradientCanvas.prototype.getColorStops = function () {
    return this._colorStops.sort(function (t, e) {
      return t.offset - e.offset;
    });
  }),
  (GradientCanvas.prototype.getAlphaStops = function () {
    return this._alphaStops.sort(function (t, e) {
      return t.offset - e.offset;
    });
  }),
  (GradientCanvas.prototype.getAlphaStopsBlack = function () {
    return this.getAlphaStops().map(function (t) {
      return {
        color: 'rgba(0, 0, 0, ' + t.alpha + ')',
        offset: Math.max(0, Math.min(1, t.offset)),
      };
    });
  }),
  (GradientCanvas.prototype.toCanvas = function (t, e, n, r) {
    (t = t || 100), (e = e || 100);
    var o = document.createElement('canvas'),
      i = o.getContext('2d');
    (o.width = t), (o.height = e);
    var a = { x1: 0, x2: 100, y1: 0, y2: 0 };
    r || (a = this.angleToGradientVector(this.angle)),
      (a.x1 = (a.x1 / 100) * t),
      (a.x2 = (a.x2 / 100) * t),
      (a.y1 = (a.y1 / 100) * e),
      (a.y2 = (a.y2 / 100) * e);
    for (
      var s = i.createLinearGradient(a.x1, a.y1, a.x2, a.y2),
        c = n || this.getAllStops(),
        l = 0;
      c.length > l;
      l++
    )
      s.addColorStop(Math.max(0, Math.min(1, c[l].offset)), c[l].color);
    return (i.fillStyle = s), i.fillRect(0, 0, t, e), o;
  }),
  (GradientCanvas.prototype.toCanvasRules = function (t, e) {
    var n = this.angleToGradientVector(this.angle);
    (n.x1 = (n.x1 / 100) * t),
      (n.x2 = (n.x2 / 100) * t),
      (n.y1 = (n.y1 / 100) * e),
      (n.y2 = (n.y2 / 100) * e);
    var r = this.getAllStops().map(function (t) {
      return (
        'gradient.addColorStop(' +
        Math.max(0, Math.min(1, t.offset)) +
        ', "' +
        t.color +
        '");'
      );
    });
    return [
      "var canvas = document.createElement('canvas');",
      "var context = canvas.getContext('2d')",
      'canvas.width = ' + t + ';',
      'canvas.height = ' + e + ';',
      'var gradient = context.createLinearGradient(' +
        n.x1 +
        ', ' +
        n.y1 +
        ', ' +
        n.x2 +
        ', ' +
        n.y2 +
        ');',
      r.join('\n'),
      'context.fillStyle = gradient;',
      'context.fillRect(0, 0, ' + t + ', ' + e + ');',
    ].join('\n');
  }),
  (GradientCanvas.prototype.getInterpolatedColorAtOffset = function (t) {
    var e = this.toCanvas(100, 1, this.getColorStops(), !0),
      n = e.getContext('2d'),
      r = Math.max(0, Math.min(99, parseInt(100 * t))),
      o = n.getImageData(r, 0, 1, 1).data;
    return tinycolor({ r: o[0], g: o[1], b: o[2] }).toHexString();
  }),
  (GradientCanvas.prototype.getInterpolatedAlphaAtOffset = function (t) {
    var e = this.getAlphaStopsBlack();
    if (0 === e.length) return 1;
    var n = this.toCanvas(100, 1, e, !0),
      r = n.getContext('2d'),
      o = Math.max(0, Math.min(99, parseInt(100 * t))),
      i = r.getImageData(o, 0, 1, 1).data;
    return Math.round((i[3] / 255) * 100) / 100;
  }),
  (GradientCanvas.prototype.cloneStop = function (t, e) {
    var n = t.offset,
      r = t.hasOwnProperty('alpha');
    if (e) {
      var o = Math.random() / 5,
        i = r ? this.getAlphaStops() : this.getColorStops(),
        a = i.indexOf(t),
        s = 0.5 > n ? n + o : n - o,
        c = a > 0 ? i[a - 1].offset : 0,
        l = i.length - 1 > a ? i[a + 1].offset : 1;
      Math.abs(n - s) < Math.abs(n - c) && (s = c),
        Math.abs(n - s) < Math.abs(n - l) && (s = l),
        (n = (n + s) / 2);
    }
    return r ? this.addAlphaStop(n, t.alpha) : this.addColorStop(n, t.color);
  }),
  (GradientCanvas.prototype.addColorStop = function (t, e) {
    var n = tinycolor(e || this.getInterpolatedColorAtOffset(t));
    1 > n.alpha && (this.addAlphaStop(t, n.alpha), n.setAlpha(1));
    var r = {
      offset: t,
      color: '' + n,
      hex: n.toHexString(),
      getOffset: function () {
        return Math.min(1, Math.max(0, Math.round(100 * this.offset) / 100));
      },
      getPercentOffset: function () {
        return 100 * r.getOffset() + '%';
      },
      setOffset: function (t) {
        r.offset = Math.min(1, Math.max(0, t));
      },
    };
    return this._colorStops.push(r), this.getColorStops().indexOf(r);
  }),
  (GradientCanvas.prototype.addAlphaStop = function (t, e) {
    e = e || this.getInterpolatedAlphaAtOffset(t);
    var n = {
      offset: t,
      alpha: e,
      getOffset: function () {
        return Math.min(1, Math.max(0, Math.round(100 * this.offset) / 100));
      },
      getPercentOffset: function () {
        return 100 * n.getOffset();
      },
      setOffset: function (t) {
        n.offset = Math.min(1, Math.max(0, t));
      },
    };
    return this._alphaStops.push(n), this.getAlphaStops().indexOf(n);
  }),
  (window.$ = document.querySelectorAll.bind(document)),
  (Node.prototype.on = window.on =
    function (t, e) {
      this.addEventListener(t, e);
    }),
  (NodeList.prototype.__proto__ = Array.prototype),
  (NodeList.prototype.on = NodeList.prototype.addEventListener =
    function (t, e) {
      this.forEach(function (n) {
        n.on(t, e);
      });
    });
var isMobile = window.matchMedia('(max-width: 640px)').matches,
  ColorPicker = function (t) {
    var e = Object.create(ColorPicker.prototype);
    (e.gradient = t), e.joe, e.alpha;
    var n = function () {
        var t = r(STOPS[0][0][1][0]),
          n = $('.js-picker')[0];
        (e.joe = colorjoe.rgb(n, t, [
          'alpha',
          'hex',
          ['fields', { space: 'RGBA', limit: [255, 255, 255, 100] }],
        ])),
          (e.alpha = $('.js-alpha-color')[0]),
          o();
      },
      r = function (t) {
        return (
          'rgba(' +
          t[0][0] +
          ',' +
          t[0][1] +
          ',' +
          t[0][2] +
          ',' +
          t[0][3] +
          ')'
        );
      },
      o = function () {
        e.joe.on('change', function (t) {
          var n = t.cssa().replace('rgba(', '').replace(')', '').split(','),
            r = n.map(function (t) {
              return parseFloat(t);
            });
          e.gradient.updateColor(r);
        });
      };
    return (
      (e.setAlphaColor = function (t) {
        var n = t.color[0],
          r = t.color[1],
          o = t.color[2],
          i = 'rgba(' + n + ',' + r + ',' + o + ',1)',
          a = 'rgba(' + n + ',' + r + ',' + o + ',0)',
          s = 'linear-gradient(to right, ' + i + ' 0%, ' + a + ' 100%)';
        e.alpha.style.background = s;
      }),
      (e.setColor = function (t) {
        var n = t.color[0],
          r = t.color[1],
          o = t.color[2],
          i = t.color[3],
          a = 'rgba(' + n + ',' + r + ',' + o + ',' + i + ')';
        e.joe.set(a), e.setAlphaColor(t);
      }),
      n(),
      e
    );
  },
  AnglePicker = function (t, e) {
    var n = Object.create(AnglePicker.prototype);
    (n.gradient = t),
      (n.angle = e),
      (n.angleContainer = $('.js-angle')[0]),
      (n.pointer = $('.js-pointer')[0]),
      (n.input = $('.js-angle-input')[0]),
      (n.dragging = !1),
      (n.x = 0),
      (n.y = 0);
    var r = function () {
        (n.pointer.style.transform =
          'translateZ(0px) rotate(' + n.angle + 'deg)'),
          (n.input.value = n.angle + '\xb0'),
          o();
      },
      o = function () {
        n.input.on('change', a);
      };
    'ontouchstart' in document.documentElement
      ? (n.angleContainer.on('touchstart', function (t) {
          t.preventDefault(),
            t.stopPropagation(),
            (n.x = t.offsetX || t.layerX),
            (n.y = t.offsetY || t.layerY),
            s();
        }),
        n.angleContainer.on('touchmove', function (t) {
          t.preventDefault(),
            t.stopPropagation(),
            (n.dragging = !0),
            (n.x = t.offsetX || t.layerX),
            (n.y = t.offsetY || t.layerY);
        }),
        n.angleContainer.on('touchend', function (t) {
          t.preventDefault(), t.stopPropagation(), (n.dragging = !1);
        }))
      : (n.angleContainer.on('mousedown', function (t) {
          (n.dragging = !0), (n.x = t.offsetX), (n.y = t.offsetY), s();
        }),
        n.angleContainer.on('mousemove', function (t) {
          (n.x = t.offsetX), (n.y = t.offsetY);
        }),
        n.angleContainer.on('mouseup', function () {
          n.dragging = !1;
        }));
    var i = function () {
        (n.pointer.style.transform =
          'translateZ(0px) rotate(' + n.angle + 'deg)'),
          (n.input.value = n.angle + '\xb0'),
          n.gradient.updateAngle(n.angle);
      },
      a = function (t) {
        (n.angle = Math.round(parseInt(t.target.value))), i();
      },
      s = function () {
        (x2 = n.x),
          (y2 = n.y),
          (radians = Math.atan2(y2 - 15, x2 - 15)),
          (e = radians * (180 / Math.PI)),
          (e = 90 + e),
          e < 0 && (e = 360 + e),
          (e = Math.round(e)),
          (n.pointer.style.transform = 'translateZ(0px) rotate(' + e + 'deg)'),
          (n.input.value = Math.round(e) + '\xb0'),
          n.gradient.updateAngle(e);
      };
    n.setAngle = function (t) {
      (n.input.value = Math.round(t) + '\xb0'), i();
    };
    var c = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
      l = function () {
        !0 === n.dragging && s(), c(l);
      };
    return l(), r(), n;
  },
  Drag = function (t, e, n) {
    var r = Object.create(Drag.prototype);
    (r.point = t), (r.dom = e), (r.width = n);
    var o = function () {},
      i = function (t) {
        var e = t.target,
          n = (parseFloat(e.getAttribute('data-x')) || 0) + t.dx;
        if ('undefined' != typeof t.restrict && Math.abs(t.restrict.dy) > 120)
          return void r.point.destroy();
        (e.style.webkitTransform = e.style.transform =
          'translateX(' + n + 'px)'),
          e.setAttribute('data-x', n);
        var o = Math.round((n / (r.width - 28)) * 100);
        o > 100 && (o = 100), r.point.setPosition(o);
      },
      a = function () {
        r.point.updateStop();
      };
    return (
      interact(r.dom).draggable({
        inertia: { resistance: 5, minSpeed: 200 },
        restrict: {
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
        },
        onstart: o,
        onmove: i,
        onend: a,
      }),
      r
    );
  },
  Point = function (t, e, n) {
    var r = Object.create(Point.prototype);
    (r.gradient = t),
      (r.color = e ? e[0] : [0, 0, 0, 0]),
      (r.position = e ? e[1] : 0),
      (r.isActive = !1),
      r.input,
      r.pointBG,
      r.stop,
      r.tile,
      r.inputHex,
      r.inputPosition,
      r.deleteButton;
    var o = function () {
        (r.dom = document.createElement('div')),
          r.dom.classList.add('js-draggable'),
          r.dom.classList.add('app-gradient__point'),
          p(),
          l(),
          f(),
          h();
      },
      i = function () {
        var t = a();
        return one.color(t).hex();
      },
      a = function () {
        return 'rgb(' + r.color[0] + ',' + r.color[1] + ',' + r.color[2] + ')';
      },
      s = function () {
        r.setActive();
        r.color[0], r.color[1], r.color[2], r.color[3];
      },
      c = function () {
        (r.position = this.value), r.setPosition(r.position);
        var t = Math.round(0.01 * r.position * (r.gradient.width - 28));
        (r.dom.dataset.x = t),
          (r.dom.style.transform = 'translateX(' + t + 'px)');
      },
      l = function () {
        r.inputHex.value = i();
        var t = a();
        (r.pointBG.style.backgroundColor = t),
          (r.tile.style.backgroundColor = t);
      },
      u = function () {
        var t = document.createElement('label');
        t.classList.add('app-gradient__point-label');
        var e = document.createElement('div');
        return (
          e.classList.add('app-gradient__point-label-bg'),
          (r.input = document.createElement('input')),
          r.input.classList.add('app-gradient__point-input'),
          (r.input.value = r.position),
          t.appendChild(e),
          t.appendChild(r.input),
          t
        );
      },
      p = function () {
        var t = Math.round(0.01 * r.position * (r.gradient.width - 28));
        (r.dom.dataset.x = t),
          (r.dom.style.transform = 'translateX(' + t + 'px)'),
          r.dom.setAttribute('touch-action', 'none');
        var e = document.createElement('div');
        e.classList.add('app-gradient__point-background');
        var n = document.createElement('div');
        n.classList.add('app-gradient__point-visual'),
          (r.pointBG = document.createElement('div')),
          r.pointBG.classList.add('app-gradient__point-color'),
          r.dom.appendChild(e),
          r.dom.appendChild(n),
          r.dom.appendChild(r.pointBG),
          r.dom.appendChild(u()),
          r.gradient.container.appendChild(r.dom),
          d();
      },
      d = function () {
        var t = $('.js-stops')[0];
        (r.stop = document.createElement('div')),
          r.stop.classList.add('app-color__stop'),
          r.isActive && r.stop.classList.add('is-active');
        var e = document.createElement('div');
        e.classList.add('app-color__stop-color');
        var o = document.createElement('div');
        o.classList.add('app-color__stop-color-bg'),
          (r.tile = document.createElement('div')),
          r.tile.classList.add('app-color__stop-color-tile'),
          (r.tile.style.backgroundColor = a()),
          o.appendChild(r.tile),
          e.appendChild(o);
        var s = document.createElement('div');
        s.classList.add('app-color__stop-hex'),
          (r.inputHex = document.createElement('input')),
          (r.inputHex.value = i()),
          s.appendChild(r.inputHex);
        var c = document.createElement('div');
        c.classList.add('app-color__stop-position'),
          (r.inputPosition = document.createElement('input')),
          (r.inputPosition.value = r.position),
          c.appendChild(r.inputPosition);
        var l = document.createElement('div');
        l.classList.add('app-color__stop-action'),
          (r.deleteButton = document.createElement('button')),
          r.deleteButton.classList.add('app-color__stop-action-button'),
          (r.deleteButton.innerHTML = '&times'),
          l.appendChild(r.deleteButton),
          r.stop.appendChild(e),
          r.stop.appendChild(s),
          r.stop.appendChild(c),
          r.stop.appendChild(l),
          n
            ? (t.insertBefore(r.stop, n.stop), (n = null))
            : t.appendChild(r.stop),
          h();
      },
      f = function () {
        Drag(r, r.dom, r.gradient.width);
        r.dom.on('pointerdown', s), r.input.on('change', c);
      },
      h = function () {
        r.tile.on('click', r.setActive),
          r.inputHex.on('change', r.setHex),
          r.inputHex.on('focus', r.setActive),
          r.inputPosition.on('change', c),
          r.inputPosition.on('focus', r.setActive),
          r.deleteButton.on('click', r.destroy);
      };
    return (
      (r.renderStop = d),
      (r.updateStop = r.gradient.renderStops),
      (r.setActive = function () {
        (r.isActive = !0),
          r.dom.classList.add('is-active'),
          r.stop.classList.add('is-active'),
          r.gradient.setCurrentPoint(r);
      }),
      (r.removeActive = function () {
        (r.isActive = !1),
          r.dom.classList.remove('is-active'),
          r.stop.classList.remove('is-active');
      }),
      (r.setHex = function (t) {
        var e = t.target.value;
        '#' !== e.charAt(0) && (e = '#' + e);
        var n = one.color(e);
        if (n) var o = n.hex();
        else var o = '#000000';
        t.target.value = o;
        var i = one
            .color(o)
            .cssa()
            .replace('rgba(', '')
            .replace(')', '')
            .split(','),
          a = i.map(function (t) {
            return parseFloat(t);
          });
        r.setColor(a), r.gradient.updatePicker();
      }),
      (r.setColor = function (t) {
        (r.color = t), l();
      }),
      (r.setPosition = function (t) {
        (r.position = t),
          (r.input.value = t),
          (r.inputPosition.value = t),
          r.gradient.updateGradient(r),
          r.updateStop();
      }),
      (r.checkDelete = function () {
        'INPUT' !== document.activeElement.tagName && r.isActive && r.destroy();
      }),
      (r.destroy = function () {
        if (r.gradient.points.length <= 2)
          return void console.warn('You must have at least 2 points');
        r.dom.parentNode.removeChild(r.dom),
          r.stop.parentNode.removeChild(r.stop),
          r.gradient.removePoint(r);
      }),
      (r.clear = function () {
        r.dom.parentNode.removeChild(r.dom),
          r.stop.parentNode.removeChild(r.stop);
      }),
      o(),
      r
    );
  },
  Gradient = function (t, e, n, r) {
    var o = Object.create(Gradient.prototype);
    (o.stops = t),
      (o.type = e),
      (o.angle = n),
      (o.index = r),
      (o.points = []),
      o.currentPoint,
      o.colorPicker,
      (o.gradientBackground = $('.js-header')[0]),
      (o.gradientToolBackground = $('.js-background')[0]),
      (o.gradientCopyButton = $('.js-button-copy')[0]),
      (o.stopsDOM = $('.js-stops')[0]),
      (o.container = $('.js-drag')[0]),
      (o.width = o.container.scrollWidth),
      (o.code = $('.js-code')[0]),
      (o.buttonLinear = $('.js-button-linear')[0]),
      (o.buttonRadial = $('.js-button-radial')[0]),
      (o.swatch = $('.js-swatch')[r]);
    var i = function () {
        (o.colorPicker = ColorPicker(o)),
          (o.anglePicker = AnglePicker(o, o.angle)),
          t.forEach(function (t) {
            var e = Point(o, t);
            o.points.push(e);
          }),
          o.points[1].setActive(!0),
          'linear-gradient' === o.type ? c(null, !0) : l(null, !0),
          m();
      },
      a = function (t) {
        (8 !== t.keyCode && 46 != t.keyCode) || o.currentPoint.checkDelete();
      },
      s = function (t) {
        if (t.target.classList.contains('js-drag')) {
          var e,
            n,
            r,
            i = Math.round((t.offsetX / o.width) * 100);
          if (
            (o.points.some(function (t) {
              if (t.position <= i) e = t;
              else if (t.position >= i) return (n = t), !0;
            }),
            e && n)
          ) {
            var a = (i - e.position) / (n.position - e.position),
              s = pickHex(e.color, n.color, 1 - a);
            s.push(1), (r = [s, i]);
          } else {
            r = [(e || n).color, i];
          }
          var c = Point(o, r, n);
          o.points.push(c), c.setActive(), o.setCurrentPoint(c), p();
        }
      },
      c = function (t, e) {
        o.buttonRadial.classList.remove('is-active'),
          o.buttonLinear.classList.add('is-active'),
          (o.type = 'linear-gradient'),
          ($('.app-option')[1].style.display = 'block'),
          e || p();
      },
      l = function (t, e) {
        o.buttonLinear.classList.remove('is-active'),
          o.buttonRadial.classList.add('is-active'),
          (o.type = 'radial-gradient'),
          ($('.app-option')[1].style.display = 'none'),
          e || p();
      },
      u = function () {
        var t = 'linear-gradient(90deg, ';
        return (
          o.points.forEach(function (e, n) {
            var r = e.color[0],
              i = e.color[1],
              a = e.color[2],
              s = 'rgb(' + r + ',' + i + ',' + a + ') ' + e.position + '%';
            n < o.points.length - 1 && (s += ', '), (t += s);
          }),
          (t += ')')
        );
      },
      p = function () {
        o.points.sort(function (t, e) {
          return t.position - e.position;
        });
        var t;
        (t =
          'linear-gradient' === o.type
            ? o.type + '(' + o.angle + 'deg, '
            : o.type + '(circle, '),
          (t += d()),
          (o.gradientBackground.style.backgroundImage = t),
          (o.gradientToolBackground.style.backgroundImage = u()),
          (o.swatch.childNodes[1].style.backgroundImage = t),
          (o.gradientCopyButton.style.backgroundImage = t),
          f(),
          v();
      },
      d = function () {
        var t = '';
        return (
          o.points.forEach(function (e, n) {
            var r = e.color[0],
              i = e.color[1],
              a = e.color[2],
              s = e.color[3],
              c =
                'rgba(' +
                r +
                ',' +
                i +
                ',' +
                a +
                ',' +
                s +
                ') ' +
                e.position +
                '%';
            n < o.points.length - 1 && (c += ', '), (t += c);
          }),
          (t += ')')
        );
      },
      f = function () {
        if (0 !== o.points.length) {
          var t =
            (o.points[0].color[0],
            o.points[0].color[1],
            o.points[0].color[2],
            window.isCompat ? g : h);
          o.code.innerHTML = t();
        }
      },
      h = function () {
        var t = '',
          e = o.points[0].color[0],
          n = o.points[0].color[1],
          r = o.points[0].color[2];
        t =
          'linear-gradient' === o.type
            ? o.type + '(' + o.angle + 'deg, '
            : o.type + '(circle, ';
        var i =
          '<span class="blue">background</span>: rgb(' +
          e +
          ',' +
          n +
          ',' +
          r +
          ');<br>';
        return (
          (i += '<span class="blue">background</span>: '), (i += t + d() + ';')
        );
      },
      g = function () {
        var t = '',
          e = o.points[0].color[0],
          n = o.points[0].color[1],
          r = o.points[0].color[2];
        t =
          'linear-gradient' === o.type
            ? o.type + '(' + o.angle + 'deg, '
            : o.type + '(circle, ';
        var i = 'rgb(' + e + ',' + n + ',' + r + ')',
          a = one.color(i).hex(),
          s = o.points.length - 1,
          c = o.points[s].color[0],
          l = o.points[s].color[1],
          u = o.points[s].color[2],
          p = 'rgb(' + c + ',' + l + ',' + u + ')',
          f = one.color(p).hex(),
          h =
            '<span class="blue">background</span>: rgb(' +
            e +
            ',' +
            n +
            ',' +
            r +
            ');<br>';
        return (
          (h += '<span class="blue">background</span>: '),
          (h += '-moz-' + t + d() + ';<br>'),
          (h += '<span class="blue">background</span>: '),
          (h += '-webkit-' + t + d() + ';<br>'),
          (h += '<span class="blue">background</span>: '),
          (h += t + d() + ';<br>'),
          (h +=
            '<span class="blue">filter</span>: progid:DXImageTransform.Microsoft.gradient(startColorstr="' +
            a +
            '",endColorstr="' +
            f +
            '",GradientType=1);')
        );
      },
      v = function () {
        var t = [],
          e = [];
        o.points.forEach(function (t) {
          var n = [t.color, t.position];
          e.push(n);
        }),
          t.push(e),
          t.push(o.type),
          t.push(o.angle),
          (STOPS[o.index] = t),
          localStorage.setItem('STOPS', JSON.stringify(STOPS));
      },
      m = function () {
        o.container.on('click', s),
          document.on('keyup', a),
          o.buttonLinear.on('click', c),
          o.buttonRadial.on('click', l);
      };
    return (
      (o.renderStops = function () {
        (o.stopsDOM.innerHTML = ''),
          o.points.forEach(function (t) {
            t.renderStop();
          });
      }),
      (o.setCurrentPoint = function (t) {
        var e = o.points.indexOf(t);
        o.points.map(function (t, n) {
          n != e && t.removeActive();
        }),
          (o.currentPoint = t),
          o.colorPicker.setColor(t);
      }),
      (o.updatePicker = function () {
        o.colorPicker.setColor(o.currentPoint);
      }),
      (o.updateColor = function (t) {
        o.currentPoint.setColor(t),
          o.colorPicker.setAlphaColor(o.currentPoint),
          p();
      }),
      (o.updateGradient = function () {
        p();
      }),
      (o.updateAngle = function (t) {
        (o.angle = t), p();
      }),
      (o.removePoint = function (t) {
        var e = o.points.indexOf(t);
        e > -1 && o.points.splice(e, 1);
        var n = o.points[Math.floor(o.points.length / 2)];
        n.setActive(), o.setCurrentPoint(n), p();
      }),
      (o.rerender = function (t, e, n, r) {
        (o.stops = t),
          (o.type = e),
          (o.angle = n),
          (o.index = r),
          (o.swatch = $('.js-swatch')[r]),
          (o.anglePicker = AnglePicker(o, o.angle)),
          o.points.forEach(function (t) {
            t.clear();
          }),
          (o.points = []),
          o.stops.forEach(function (t) {
            var e = Point(o, t);
            o.points.push(e);
          }),
          o.points[1].setActive(!0),
          'linear-gradient' === o.type ? c(null, !0) : l(null, !0);
      }),
      (o.rerenderCode = f),
      i(),
      o
    );
  },
  App = function () {
    var t = Object.create(App.prototype);
    (t.swatches = $('.js-swatch')),
      (t.upload = $('.js-upload')[0]),
      (t.compat = $('.js-compat')[0]),
      (t.gradient = null),
      (window.isCompat = JSON.parse(localStorage.getItem('isCompat')) || !1);
    var e = function () {
        n(),
          t.swatches.forEach(function (t, e) {
            (t.childNodes[1].style.backgroundImage = r(STOPS[e])),
              e === CURRENT_STOP && t.classList.add('is-active');
          });
        var e = STOPS[CURRENT_STOP][0],
          o = STOPS[CURRENT_STOP][1],
          i = STOPS[CURRENT_STOP][2];
        (t.gradient = Gradient(e, o, i, CURRENT_STOP)),
          window.isCompat
            ? ((t.compat.checked = !0),
              ($('.code-editor__column-numbers')[0].innerHTML =
                '1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>'))
            : ($('.code-editor__column-numbers')[0].innerHTML =
                '1<br>2<br>3<br>4<br>5<br>6<br>'),
          c();
      },
      n = function () {
        new ClipboardJS('.js-copy').on('success', function (t) {
          var e = $('.js-button-copy')[0];
          (e.style.transition = 'all 250ms ease-in-out'),
            (e.style.transform = 'translateY(0) scaleX(0.02) scaleY(0.5)'),
            setTimeout(function () {
              e.style.opacity = 0;
            }, 200),
            setTimeout(function () {
              (e.style.transition = 'all 1ms linear'), (e.style.transform = '');
            }, 500),
            setTimeout(function () {
              (e.style.opacity = 1),
                (e.style.transition = 'all 150ms ease-in-out');
            }, 600),
            t.clearSelection();
        });
      },
      r = function (t) {
        var e,
          n = t[0];
        return (
          (e =
            'linear-gradient' === t[1]
              ? 'linear-gradient(' + t[2] + 'deg, '
              : 'radial-gradient(circle, '),
          n.forEach(function (t, r) {
            var o = t[0][0],
              i = t[0][1],
              a = t[0][2],
              s = t[0][3],
              c = 'rgba(' + o + ',' + i + ',' + a + ',' + s + ') ' + t[1] + '%';
            r < n.length - 1 && (c += ', '), (e += c);
          }),
          (e += ')')
        );
      },
      o = function () {
        t.swatches.forEach(function (t) {
          t.classList.remove('is-active');
        }),
          this.classList.add('is-active');
        var e = t.swatches.indexOf(this),
          n = STOPS[e][0],
          r = STOPS[e][1],
          o = STOPS[e][2];
        t.gradient.rerender(n, r, o, e),
          (CURRENT_STOP = e),
          localStorage.setItem('CURRENT_STOP', JSON.stringify(CURRENT_STOP));
      },
      i = function (e) {
        var n = [[], 'linear-gradient', 0];
        GradientFinder.fromUrl(e, function (e) {
          (n[2] = e.angle),
            e.stops.forEach(function (t) {
              var e = t.color,
                r = [e.r, e.g, e.b, 1],
                o = [r, 100 * t.idx];
              n[0].push(o);
            });
          var r = n[0],
            o = n[1],
            i = 90 - n[2];
          t.gradient.rerender(r, o, i, CURRENT_STOP);
        });
      },
      a = function () {
        var e = t.upload.files[0];
        console.log(e);
        var n = new FileReader();
        (n.onload = function (t) {
          var e = t.target.result;
          i(e);
        }),
          n.readAsDataURL(e);
      },
      s = function (e) {
        (window.isCompat = e.target.checked),
          window.isCompat
            ? ($('.code-editor__column-numbers')[0].innerHTML =
                '1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>')
            : ($('.code-editor__column-numbers')[0].innerHTML =
                '1<br>2<br>3<br>4<br>5<br>6<br>'),
          localStorage.setItem('isCompat', JSON.stringify(window.isCompat)),
          t.gradient.rerenderCode();
      },
      c = function () {
        t.swatches.on('click', o),
          t.upload.on('change', a),
          t.compat.on('change', s);
      };
    return (
      (window.STOPS = [
        [
          [
            [[2, 0, 36, 1], 0],
            [[9, 9, 121, 1], 35],
            [[0, 212, 255, 1], 100],
          ],
          'linear-gradient',
          90,
        ],
        [
          [
            [[34, 193, 195, 1], 0],
            [[253, 187, 45, 1], 100],
          ],
          'linear-gradient',
          0,
        ],
        [
          [
            [[63, 94, 251, 1], 0],
            [[252, 70, 107, 1], 100],
          ],
          'radial-gradient',
          90,
        ],
        [
          [
            [[131, 58, 180, 1], 0],
            [[253, 29, 29, 1], 50],
            [[252, 176, 69, 1], 100],
          ],
          'linear-gradient',
          90,
        ],
        [
          [
            [[238, 174, 202, 1], 0],
            [[148, 187, 233, 1], 100],
          ],
          'radial-gradient',
          90,
        ],
      ]),
      (STOPS = JSON.parse(localStorage.getItem('STOPS')) || STOPS),
      localStorage.setItem('STOPS', JSON.stringify(STOPS)),
      (window.CURRENT_STOP =
        JSON.parse(localStorage.getItem('CURRENT_STOP')) || 0),
      e(),
      t
    );
  },
  Backgrounds = function () {
    var t = Object.create(Backgrounds.prototype),
      e = function () {
        (t.links = $('.js-backgrounds-link')),
          (t.shades = $('.js-backgrounds-shade')),
          (t.iframe = $('.js-iframe')[0]),
          o(t.links[1]),
          i(),
          a();
      },
      n = function (e) {
        e.preventDefault(),
          t.links.forEach(function (t) {
            t.classList.remove('is-active');
          }),
          (this.querySelector(
            '.sidenav-backgrounds__background'
          ).style.transform = ''),
          this.classList.add('is-active'),
          isMobile ? window.open(this.href) : (o(this), r(this.href));
      },
      r = function (e) {
        t.shades.forEach(function (t) {
          setTimeout(function () {
            (t.style.visibility = 'visible'),
              (t.style.transform = 'scaleX(1) scaleY(1)');
          }, 300 * Math.random());
        }),
          setTimeout(function () {
            t.iframe.src = 'about:blank';
          }, 750),
          setTimeout(function () {
            t.iframe.src = e;
          }, 800),
          setTimeout(function () {
            t.shades.forEach(function (t) {
              t.style.transform = 'scaleX(0) scaleY(1)';
            });
          }, 1300),
          setTimeout(function () {
            t.shades.forEach(function (t) {
              (t.style.transition = 'all 0ms linear'),
                (t.style.transform = 'scaleX(1) scaleY(0)');
            });
          }, 2200),
          setTimeout(function () {
            t.shades.forEach(function (t) {
              (t.style.visibility = 'hidden'), (t.style.transition = '');
            });
          }, 2250);
      },
      o = function (e) {
        var n = t.links.indexOf(e);
        t.links.forEach(function (t, e) {
          var r = t.querySelector('.sidenav-backgrounds__background'),
            o = Math.abs(n - e),
            i = (110 - 4 * Math.abs(n - e)) / 100;
          r.parentNode.classList.contains('is-active') ||
            setTimeout(function () {
              r.style.transform = 'scaleX(' + i + ')';
            }, 50 * o);
        });
      },
      i = function () {
        setTimeout(function () {
          $('#ad_iframe')[0]
            ? (console.log('ad loaded'),
              $('#ad_iframe')[0].getAttribute('height'))
            : console.log('ad failed to load');
        }, 1500);
      },
      a = function () {
        t.links.on('click', n);
      };
    return (t.add = function () {}), e(), t;
  };
if (document.body.classList.contains('index')) var app = App();
if (document.body.classList.contains('swatches')) {
  var clipboard = new ClipboardJS('.js-copy');
  clipboard.on('success', function (t) {
    var e = t.trigger.parentNode.parentNode,
      n = e.querySelector('.swatch-card__copy-alert');
    n.classList.add('is-copied'),
      setTimeout(function () {
        n.classList.remove('is-copied');
      }, 1200);
  });
}
if (document.body.classList.contains('gradient-backgrounds'))
  var backgrounds = Backgrounds();
!(function () {
  $('.js-year')[0].innerText = new Date().getFullYear();
  var t = $('.js-mobile-button')[0],
    e = $('.js-mobile-nav')[0];
  t.on('click', function (t) {
    t.preventDefault(), e.classList.toggle('is-active');
  });
})();
