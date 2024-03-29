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
function saveBlob(t, e) {
  if (t && t instanceof Blob && e)
    if (navigator.msSaveBlob) navigator.msSaveBlob(t, e);
    else {
      var r = document.createElement('a'),
        n = function (t) {
          var e = document.createEvent('MouseEvents');
          e.initMouseEvent(
            'click',
            !0,
            !1,
            window,
            0,
            0,
            0,
            0,
            0,
            !1,
            !1,
            !1,
            !1,
            0,
            null
          ),
            t.dispatchEvent(e);
        };
      if ('download' in r) {
        var i = window.URL || window.webkitURL || window,
          o = i.createObjectURL(t);
        (r.href = o),
          (r.download = e),
          n(r),
          (r = null),
          window.setTimeout(function () {
            i.revokeObjectURL(o);
          }, 3e4);
      } else {
        var a = new FileReader();
        (a.onloadend = function (t) {
          (r.download = e), (r.href = a.result), n(r), (r = null);
        }),
          a.readAsDataURL(t);
      }
    }
}
function ptToPx(t) {
  return wjcCore.asNumber(t) / 0.75;
}
function pxToPt(t) {
  return 0.75 * wjcCore.asNumber(t);
}
function _asColor(t, e) {
  void 0 === e && (e = !0);
  var r;
  return (
    (r = t
      ? t instanceof wjcCore.Color
        ? e
          ? wjcCore.Color.fromRgba(t.r, t.g, t.b, t.a)
          : t
        : wjcCore.Color.fromString(t)
      : wjcCore.Color.fromRgba(0, 0, 0)),
    wjcCore.assert(
      r instanceof wjcCore.Color,
      exports._Errors.InvalidArg('colorOrString')
    ),
    r
  );
}
function _asPdfPen(t, e) {
  return (
    void 0 === e && (e = !0),
    (wjcCore.isString(t) || t instanceof wjcCore.Color) && (t = new PdfPen(t)),
    wjcCore.assert(
      (null == t && e) || t instanceof PdfPen,
      exports._Errors.InvalidArg('penOrColor')
    ),
    t
  );
}
function _asPdfBrush(t, e) {
  return (
    void 0 === e && (e = !0),
    (wjcCore.isString(t) || t instanceof wjcCore.Color) &&
      (t = new PdfSolidBrush(t)),
    wjcCore.assert(
      (null == t && e) || t instanceof PdfBrush,
      exports._Errors.InvalidArg('brushOrColor')
    ),
    t
  );
}
function _asPdfFont(t, e) {
  return (
    void 0 === e && (e = !0),
    wjcCore.assert(
      (null == t && e) || t instanceof PdfFont,
      exports._Errors.InvalidArg('font')
    ),
    t
  );
}
function _asPt(t, e, r) {
  void 0 === e && (e = !0), void 0 === r && (r = 0);
  var n = !t && 0 !== t;
  if ((wjcCore.assert(!n || e, exports._Errors.ValueCannotBeEmpty('value')), n))
    return r;
  if (wjcCore.isNumber(t)) {
    if (t === t) return t;
  } else if (wjcCore.isString(t)) {
    if (_FontSizePt[t]) return _FontSizePt[t];
    var i = parseFloat(t);
    if (i === i) {
      if (t.match(/(px)$/i)) return pxToPt(i);
      if (t == i || t.match(/(pt)$/i)) return i;
    }
  }
  wjcCore.assert(!1, exports._Errors.InvalidFormat(t));
}
function _formatMacros(t, e) {
  var r = {},
    n = 0;
  return (
    (t = t.replace(/&&/g, function (t, e, i) {
      return (r[e - 2 * n + n] = !0), n++, '&';
    })),
    (t = t.replace(/&\[(\S+?)\]/g, function (t, n, i, o) {
      var a = e[n];
      return a && !r[i] ? a : t;
    }))
  );
}
function _compare(t, e) {
  if (wjcCore.isObject(t) && wjcCore.isObject(e)) {
    for (var r in t)
      if (!r || '_' !== r[0]) {
        var n = t[r];
        if (
          !(n && wjcCore.isFunction(n.equals)
            ? n.equals(e[r])
            : _compare(n, e[r]))
        )
          return !1;
      }
    return !0;
  }
  if (wjcCore.isArray(t) && wjcCore.isArray(e)) {
    if (t.length !== e.length) return !1;
    for (var i = 0; i < t.length; i++) if (!_compare(t[i], e[i])) return !1;
    return !0;
  }
  return t === e;
}
function _shallowCopy(t) {
  var e = {};
  if (t) for (var r in t) e[r] = t[r];
  return e;
}
function _toTitleCase(t) {
  return t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : t;
}
function _compressSpaces(t) {
  return t && (t = t.trim().replace(/\s+/gm, ' ')), t;
}
function _resolveUrlIfRelative(t, e) {
  return t && e && !/(^[a-z][a-z0-9]*:)?\/\//i.test(t) && (t = e(t)), t;
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
        for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
      };
    return function (e, r) {
      function n() {
        this.constructor = e;
      }
      t(e, r),
        (e.prototype =
          null === r
            ? Object.create(r)
            : ((n.prototype = r.prototype), new n()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.pdf');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.pdf = wjcSelf),
  (function (t) {
    if ('object' == typeof localExports && 'undefined' != typeof localModule)
      localModule.localExports = t();
    else if ('function' == typeof localDefine && localDefine.amd)
      localDefine([], t);
    else {
      ('undefined' != typeof window
        ? window
        : 'undefined' != typeof global
        ? global
        : 'undefined' != typeof self
        ? self
        : this
      ).PDFDocument = t();
    }
  })(function () {
    return (function t(e, r, n) {
      function i(a, s) {
        if (!r[a]) {
          if (!e[a]) {
            var u = 'function' == typeof localRequire && localRequire;
            if (!s && u) return u(a, !0);
            if (o) return o(a, !0);
            var l = new Error("Cannot find localModule '" + a + "'");
            throw ((l.code = 'localModule_NOT_FOUND'), l);
          }
          var c = (r[a] = { localExports: {} });
          e[a][0].call(
            c.localExports,
            function (t) {
              var r = e[a][1][t];
              return i(r || t);
            },
            c,
            c.localExports,
            t,
            e,
            r,
            n
          );
        }
        return r[a].localExports;
      }
      for (
        var o = 'function' == typeof localRequire && localRequire, a = 0;
        a < n.length;
        a++
      )
        i(n[a]);
      return i;
    })(
      {
        1: [
          function (t, e, r) {
            var n;
            (n = (function () {
              function t(t) {
                (this.data = null != t ? t : []),
                  (this.pos = 0),
                  (this.length = this.data.length);
              }
              return (
                (t.prototype.readByte = function () {
                  return this.data[this.pos++];
                }),
                (t.prototype.writeByte = function (t) {
                  return (this.data[this.pos++] = t);
                }),
                (t.prototype.byteAt = function (t) {
                  return this.data[t];
                }),
                (t.prototype.readBool = function () {
                  return !!this.readByte();
                }),
                (t.prototype.writeBool = function (t) {
                  return this.writeByte(t ? 1 : 0);
                }),
                (t.prototype.readUInt32 = function () {
                  var t, e, r, n;
                  return (
                    (t = 16777216 * this.readByte()),
                    (e = this.readByte() << 16),
                    (r = this.readByte() << 8),
                    (n = this.readByte()),
                    t + e + r + n
                  );
                }),
                (t.prototype.writeUInt32 = function (t) {
                  return (
                    this.writeByte((t >>> 24) & 255),
                    this.writeByte((t >> 16) & 255),
                    this.writeByte((t >> 8) & 255),
                    this.writeByte(255 & t)
                  );
                }),
                (t.prototype.readInt32 = function () {
                  var t;
                  return (t = this.readUInt32()) >= 2147483648
                    ? t - 4294967296
                    : t;
                }),
                (t.prototype.writeInt32 = function (t) {
                  return t < 0 && (t += 4294967296), this.writeUInt32(t);
                }),
                (t.prototype.readUInt16 = function () {
                  var t, e;
                  return (
                    (t = this.readByte() << 8), (e = this.readByte()), t | e
                  );
                }),
                (t.prototype.writeUInt16 = function (t) {
                  return (
                    this.writeByte((t >> 8) & 255), this.writeByte(255 & t)
                  );
                }),
                (t.prototype.readInt16 = function () {
                  var t;
                  return (t = this.readUInt16()) >= 32768 ? t - 65536 : t;
                }),
                (t.prototype.writeInt16 = function (t) {
                  return t < 0 && (t += 65536), this.writeUInt16(t);
                }),
                (t.prototype.readString = function (t) {
                  var e, r, n;
                  for (
                    r = [], e = n = 0;
                    0 <= t ? n < t : n > t;
                    e = 0 <= t ? ++n : --n
                  )
                    r[e] = String.fromCharCode(this.readByte());
                  return r.join('');
                }),
                (t.prototype.writeString = function (t) {
                  var e, r, n, i;
                  for (
                    i = [], e = r = 0, n = t.length;
                    0 <= n ? r < n : r > n;
                    e = 0 <= n ? ++r : --r
                  )
                    i.push(this.writeByte(t.charCodeAt(e)));
                  return i;
                }),
                (t.prototype.stringAt = function (t, e) {
                  return (this.pos = t), this.readString(e);
                }),
                (t.prototype.readShort = function () {
                  return this.readInt16();
                }),
                (t.prototype.writeShort = function (t) {
                  return this.writeInt16(t);
                }),
                (t.prototype.readLongLong = function () {
                  var t, e, r, n, i, o, a, s;
                  return (
                    (t = this.readByte()),
                    (e = this.readByte()),
                    (r = this.readByte()),
                    (n = this.readByte()),
                    (i = this.readByte()),
                    (o = this.readByte()),
                    (a = this.readByte()),
                    (s = this.readByte()),
                    128 & t
                      ? -1 *
                        (72057594037927940 * (255 ^ t) +
                          281474976710656 * (255 ^ e) +
                          1099511627776 * (255 ^ r) +
                          4294967296 * (255 ^ n) +
                          16777216 * (255 ^ i) +
                          65536 * (255 ^ o) +
                          256 * (255 ^ a) +
                          (255 ^ s) +
                          1)
                      : 72057594037927940 * t +
                        281474976710656 * e +
                        1099511627776 * r +
                        4294967296 * n +
                        16777216 * i +
                        65536 * o +
                        256 * a +
                        s
                  );
                }),
                (t.prototype.writeLongLong = function (t) {
                  var e, r;
                  return (
                    (e = Math.floor(t / 4294967296)),
                    (r = 4294967295 & t),
                    this.writeByte((e >> 24) & 255),
                    this.writeByte((e >> 16) & 255),
                    this.writeByte((e >> 8) & 255),
                    this.writeByte(255 & e),
                    this.writeByte((r >> 24) & 255),
                    this.writeByte((r >> 16) & 255),
                    this.writeByte((r >> 8) & 255),
                    this.writeByte(255 & r)
                  );
                }),
                (t.prototype.readInt = function () {
                  return this.readInt32();
                }),
                (t.prototype.writeInt = function (t) {
                  return this.writeInt32(t);
                }),
                (t.prototype.slice = function (t, e) {
                  return this.data.slice(t, e);
                }),
                (t.prototype.read = function (t) {
                  var e, r;
                  for (
                    e = [], r = 0;
                    0 <= t ? r < t : r > t;
                    0 <= t ? ++r : --r
                  )
                    e.push(this.readByte());
                  return e;
                }),
                (t.prototype.write = function (t) {
                  var e, r, n, i;
                  for (i = [], r = 0, n = t.length; r < n; r++)
                    (e = t[r]), i.push(this.writeByte(e));
                  return i;
                }),
                t
              );
            })()),
              (e.localExports = n);
          },
          {},
        ],
        2: [
          function (t, e, r) {
            (function (r) {
              var n,
                i,
                o,
                a,
                s,
                u,
                l = {}.hasOwnProperty,
                c = function (t, e) {
                  function r() {
                    this.constructor = t;
                  }
                  for (var n in e) l.call(e, n) && (t[n] = e[n]);
                  return (
                    (r.prototype = e.prototype),
                    (t.prototype = new r()),
                    (t.__super__ = e.prototype),
                    t
                  );
                };
              (u = t('stream')),
                (s = t('fs')),
                (i = t('./object')),
                (a = t('./reference')),
                (o = t('./page')),
                (n = (function (e) {
                  function n(t) {
                    var e, r, i, o;
                    if (
                      ((this.options = null != t ? t : {}),
                      n.__super__.constructor.apply(this, arguments),
                      (this.version = 1.3),
                      (this.compress =
                        null == (i = this.options.compress) || i),
                      (this._pageBuffer = []),
                      (this._pageBufferStart = 0),
                      (this._offsets = []),
                      (this._waiting = 0),
                      (this._ended = !1),
                      (this._offset = 0),
                      (this._root = this.ref({
                        Type: 'Catalog',
                        Pages: this.ref({
                          Type: 'Pages',
                          Count: 0,
                          Kids: [],
                        }),
                      })),
                      (this.page = null),
                      this.initColor(),
                      this.initVector(),
                      this.initFonts(),
                      this.initText(),
                      this.initImages(),
                      (this.info = {
                        Producer: 'PDFKit',
                        Creator: 'PDFKit',
                        CreationDate: new Date(),
                      }),
                      this.options.info)
                    ) {
                      o = this.options.info;
                      for (e in o) (r = o[e]), (this.info[e] = r);
                    }
                    this._write('%PDF-' + this.version),
                      this._write('%ÿÿÿÿ'),
                      this.options.pageAdding &&
                        this.on('pageAdding', this.options.pageAdding),
                      this.options.pageAdded &&
                        this.on('pageAdded', this.options.pageAdded),
                      !1 !== this.options.autoFirstPage && this.addPage();
                  }
                  var u;
                  return (
                    c(n, e),
                    (u = function (t) {
                      var e, r, i;
                      i = [];
                      for (r in t) (e = t[r]), i.push((n.prototype[r] = e));
                      return i;
                    })(t('./mixins/color')),
                    u(t('./mixins/vector')),
                    u(t('./mixins/fonts')),
                    u(t('./mixins/text')),
                    u(t('./mixins/images')),
                    u(t('./mixins/annotations')),
                    (n.prototype.addPage = function (t) {
                      var e;
                      return (
                        null == t && (t = this.options),
                        this.emit('pageAdding', this, t),
                        this.options.bufferPages || this.flushPages(),
                        (this.page = new o(this, t)),
                        this._pageBuffer.push(this.page),
                        (e = this._root.data.Pages.data).Kids.push(
                          this.page.dictionary
                        ),
                        e.Count++,
                        (this.x = this.page.margins.left),
                        (this.y = this.page.margins.top),
                        (this._ctm = [1, 0, 0, 1, 0, 0]),
                        this.transform(1, 0, 0, -1, 0, this.page.height),
                        this.emit('pageAdded', this),
                        this
                      );
                    }),
                    (n.prototype.bufferedPageRange = function () {
                      return {
                        start: this._pageBufferStart,
                        count: this._pageBuffer.length,
                      };
                    }),
                    (n.prototype.switchToPage = function (t) {
                      var e;
                      if (!(e = this._pageBuffer[t - this._pageBufferStart]))
                        throw new Error(
                          'switchToPage(' +
                            t +
                            ') out of bounds, current buffer covers pages ' +
                            this._pageBufferStart +
                            ' to ' +
                            (this._pageBufferStart +
                              this._pageBuffer.length -
                              1)
                        );
                      return (this.page = e);
                    }),
                    (n.prototype.flushPages = function () {
                      var t, e, r;
                      for (
                        t = this._pageBuffer,
                          this._pageBuffer = [],
                          this._pageBufferStart += t.length,
                          e = 0,
                          r = t.length;
                        e < r;
                        e++
                      )
                        t[e].end();
                    }),
                    (n.prototype.ref = function (t) {
                      var e;
                      return (
                        (e = new a(this, this._offsets.length + 1, t)),
                        this._offsets.push(null),
                        this._waiting++,
                        e
                      );
                    }),
                    (n.prototype._read = function () {}),
                    (n.prototype._write = function (t) {
                      return (
                        r.isBuffer(t) || (t = new r(t + '\n', 'binary')),
                        this.push(t),
                        (this._offset += t.length)
                      );
                    }),
                    (n.prototype.addContent = function (t) {
                      return this.page.write(t), this;
                    }),
                    (n.prototype._refEnd = function (t) {
                      if (
                        ((this._offsets[t.id - 1] = t.offset),
                        0 == --this._waiting && this._ended)
                      )
                        return this._finalize(), (this._ended = !1);
                    }),
                    (n.prototype.write = function (t, e) {
                      var r;
                      return (
                        (r = new Error(
                          'PDFDocument#write is deprecated, and will be removed in a future version of PDFKit. Please pipe the document into a Node stream.'
                        )),
                        console.warn(r.stack),
                        this.pipe(s.createWriteStream(t)),
                        this.end(),
                        this.once('end', e)
                      );
                    }),
                    (n.prototype.output = function (t) {
                      throw new Error(
                        'PDFDocument#output is deprecated, and has been removed from PDFKit. Please pipe the document into a Node stream.'
                      );
                    }),
                    (n.prototype.end = function () {
                      var t, e, r, n, i;
                      this.emit('ending'),
                        this.flushPages(),
                        (this._info = this.ref()),
                        (n = this.info);
                      for (t in n)
                        'string' == typeof (r = n[t]) && (r = new String(r)),
                          (this._info.data[t] = r);
                      this._info.end(), (i = this._fontFamilies);
                      for (e in i) i[e].finalize();
                      return (
                        this._root.end(),
                        this._root.data.Pages.end(),
                        0 === this._waiting
                          ? this._finalize()
                          : (this._ended = !0)
                      );
                    }),
                    (n.prototype._finalize = function (t) {
                      var e, r, n, o, a;
                      for (
                        r = this._offset,
                          this._write('xref'),
                          this._write('0 ' + (this._offsets.length + 1)),
                          this._write('0000000000 65535 f '),
                          n = 0,
                          o = (a = this._offsets).length;
                        n < o;
                        n++
                      )
                        (e = ('0000000000' + (e = a[n])).slice(-10)),
                          this._write(e + ' 00000 n ');
                      return (
                        this._write('trailer'),
                        this._write(
                          i.convert({
                            Size: this._offsets.length + 1,
                            Root: this._root,
                            Info: this._info,
                          })
                        ),
                        this._write('startxref'),
                        this._write('' + r),
                        this._write('%%EOF'),
                        this.push(null)
                      );
                    }),
                    (n.prototype.toString = function () {
                      return '[object PDFDocument]';
                    }),
                    n
                  );
                })(u.Readable)),
                (e.localExports = n);
            }).call(this, t('buffer').Buffer);
          },
          {
            './mixins/annotations': 12,
            './mixins/color': 13,
            './mixins/fonts': 14,
            './mixins/images': 15,
            './mixins/text': 16,
            './mixins/vector': 17,
            './object': 18,
            './page': 19,
            './reference': 21,
            buffer: 60,
            fs: 59,
            stream: 216,
          },
        ],
        3: [
          function (t, e, r) {
            (function (r) {
              var n, i, o, a;
              (a = t('fontkit')),
                (i = (function () {
                  function t() {
                    throw new Error('Cannot construct a PDFFont directly.');
                  }
                  return (
                    (t.open = function (t, e, i, s) {
                      var u;
                      if ('string' == typeof e) {
                        if (o.isStandardFont(e)) return new o(t, e, s);
                      } else
                        r.isBuffer(e)
                          ? (u = a.create(e, i))
                          : e instanceof Uint8Array
                          ? (u = a.create(new r(e), i))
                          : e instanceof ArrayBuffer &&
                            (u = a.create(new r(new Uint8Array(e)), i));
                      if (null == u)
                        throw new Error(
                          'Not a supported font format or standard PDF font.'
                        );
                      return new n(t, u, s);
                    }),
                    (t.prototype.encode = function (t) {
                      throw new Error('Must be implemented by subclasses');
                    }),
                    (t.prototype.widthOfString = function (t) {
                      throw new Error('Must be implemented by subclasses');
                    }),
                    (t.prototype.ref = function () {
                      return null != this.dictionary
                        ? this.dictionary
                        : (this.dictionary = this.document.ref());
                    }),
                    (t.prototype.finalize = function () {
                      if (!this.embedded && null != this.dictionary)
                        return this.embed(), (this.embedded = !0);
                    }),
                    (t.prototype.embed = function () {
                      throw new Error('Must be implemented by subclasses');
                    }),
                    (t.prototype.lineHeight = function (t, e) {
                      var r;
                      return (
                        null == e && (e = !1),
                        (r = e ? this.lineGap : 0),
                        ((this.ascender + r - this.descender) / 1e3) * t
                      );
                    }),
                    (t.prototype.getAscender = function (t) {
                      return (this.ascender / 1e3) * t;
                    }),
                    (t.prototype.getBBox = function (t) {
                      return {
                        llx: (this.bbox[0] / 1e3) * t,
                        lly: (this.bbox[1] / 1e3) * t,
                        urx: (this.bbox[2] / 1e3) * t,
                        ury: (this.bbox[3] / 1e3) * t,
                      };
                    }),
                    t
                  );
                })()),
                (e.localExports = i),
                (o = t('./font/standard')),
                (n = t('./font/embedded'));
            }).call(this, t('buffer').Buffer);
          },
          {
            './font/embedded': 5,
            './font/standard': 6,
            buffer: 60,
            fontkit: 165,
          },
        ],
        4: [
          function (t, e, r) {
            var n;
            t('base64-js');
            (n = (function () {
              function t(t) {
                (this.bbox = this._parseFontBBox(t[1])),
                  (this.ascender = t[4]),
                  (this.descender = t[5]),
                  (this.glyphWidths = this._parseGlyphWidths(t[6])),
                  (this.charWidths = this._getCharWidths()),
                  (this.kernPairs = this._parseKerningPairs(t[7])),
                  (this.lineGap =
                    this.bbox[3] -
                    this.bbox[1] -
                    (this.ascender - this.descender));
              }
              var e = {
                  402: 131,
                  8211: 150,
                  8212: 151,
                  8216: 145,
                  8217: 146,
                  8218: 130,
                  8220: 147,
                  8221: 148,
                  8222: 132,
                  8224: 134,
                  8225: 135,
                  8226: 149,
                  8230: 133,
                  8364: 128,
                  8240: 137,
                  8249: 139,
                  8250: 155,
                  710: 136,
                  8482: 153,
                  338: 140,
                  339: 156,
                  732: 152,
                  352: 138,
                  353: 154,
                  376: 159,
                  381: 142,
                  382: 158,
                },
                r =
                  'space:exclam:quotedbl:numbersign:dollar:percent:ampersand:quoteright:parenleft:parenright:asterisk:plus:comma:hyphen:period:slash:zero:one:two:three:four:five:six:seven:eight:nine:colon:semicolon:less:equal:greater:question:at:A:B:C:D:E:F:G:H:I:J:K:L:M:N:O:P:Q:R:S:T:U:V:W:X:Y:Z:bracketleft:backslash:bracketright:asciicircum:underscore:quoteleft:a:b:c:d:e:f:g:h:i:j:k:l:m:n:o:p:q:r:s:t:u:v:w:x:y:z:braceleft:bar:braceright:asciitilde:exclamdown:cent:sterling:fraction:yen:florin:section:currency:quotesingle:quotedblleft:guillemotleft:guilsinglleft:guilsinglright:fi:fl:endash:dagger:daggerdbl:periodcentered:paragraph:bullet:quotesinglbase:quotedblbase:quotedblright:guillemotright:ellipsis:perthousand:questiondown:grave:acute:circumflex:tilde:macron:breve:dotaccent:dieresis:ring:cedilla:hungarumlaut:ogonek:caron:emdash:AE:ordfeminine:Lslash:Oslash:OE:ordmasculine:ae:dotlessi:lslash:oslash:oe:germandbls:Idieresis:eacute:abreve:uhungarumlaut:ecaron:Ydieresis:divide:Yacute:Acircumflex:aacute:Ucircumflex:yacute:scommaaccent:ecircumflex:Uring:Udieresis:aogonek:Uacute:uogonek:Edieresis:Dcroat:commaaccent:copyright:Emacron:ccaron:aring:Ncommaaccent:lacute:agrave:Tcommaaccent:Cacute:atilde:Edotaccent:scaron:scedilla:iacute:lozenge:Rcaron:Gcommaaccent:ucircumflex:acircumflex:Amacron:rcaron:ccedilla:Zdotaccent:Thorn:Omacron:Racute:Sacute:dcaron:Umacron:uring:threesuperior:Ograve:Agrave:Abreve:multiply:uacute:Tcaron:partialdiff:ydieresis:Nacute:icircumflex:Ecircumflex:adieresis:edieresis:cacute:nacute:umacron:Ncaron:Iacute:plusminus:brokenbar:registered:Gbreve:Idotaccent:summation:Egrave:racute:omacron:Zacute:Zcaron:greaterequal:Eth:Ccedilla:lcommaaccent:tcaron:eogonek:Uogonek:Aacute:Adieresis:egrave:zacute:iogonek:Oacute:oacute:amacron:sacute:idieresis:Ocircumflex:Ugrave:Delta:thorn:twosuperior:Odieresis:mu:igrave:ohungarumlaut:Eogonek:dcroat:threequarters:Scedilla:lcaron:Kcommaaccent:Lacute:trademark:edotaccent:Igrave:Imacron:Lcaron:onehalf:lessequal:ocircumflex:ntilde:Uhungarumlaut:Eacute:emacron:gbreve:onequarter:Scaron:Scommaaccent:Ohungarumlaut:degree:ograve:Ccaron:ugrave:radical:Dcaron:rcommaaccent:Ntilde:otilde:Rcommaaccent:Lcommaaccent:Atilde:Aogonek:Aring:Otilde:zdotaccent:Ecaron:Iogonek:kcommaaccent:minus:Icircumflex:ncaron:tcommaaccent:logicalnot:odieresis:udieresis:notequal:gcommaaccent:eth:zcaron:ncommaaccent:onesuperior:imacron:Euro:universal:existential:suchthat:asteriskmath:congruent:Alpha:Beta:Chi:Epsilon:Phi:Gamma:Eta:Iota:theta1:Kappa:Lambda:Mu:Nu:Omicron:Pi:Theta:Rho:Sigma:Tau:Upsilon:sigma1:Omega:Xi:Psi:Zeta:therefore:perpendicular:radicalex:alpha:beta:chi:delta:epsilon:phi:gamma:eta:iota:phi1:kappa:lambda:nu:omicron:pi:theta:rho:sigma:tau:upsilon:omega1:omega:xi:psi:zeta:similar:Upsilon1:minute:infinity:club:diamond:heart:spade:arrowboth:arrowleft:arrowup:arrowright:arrowdown:second:proportional:equivalence:approxequal:arrowvertex:arrowhorizex:carriagereturn:aleph:Ifraktur:Rfraktur:weierstrass:circlemultiply:circleplus:emptyset:intersection:union:propersuperset:reflexsuperset:notsubset:propersubset:reflexsubset:element:notelement:angle:gradient:registerserif:copyrightserif:trademarkserif:product:dotmath:logicaland:logicalor:arrowdblboth:arrowdblleft:arrowdblup:arrowdblright:arrowdbldown:angleleft:registersans:copyrightsans:trademarksans:parenlefttp:parenleftex:parenleftbt:bracketlefttp:bracketleftex:bracketleftbt:bracelefttp:braceleftmid:braceleftbt:braceex:angleright:integral:integraltp:integralex:integralbt:parenrighttp:parenrightex:parenrightbt:bracketrighttp:bracketrightex:bracketrightbt:bracerighttp:bracerightmid:bracerightbt:apple:a1:a2:a202:a3:a4:a5:a119:a118:a117:a11:a12:a13:a14:a15:a16:a105:a17:a18:a19:a20:a21:a22:a23:a24:a25:a26:a27:a28:a6:a7:a8:a9:a10:a29:a30:a31:a32:a33:a34:a35:a36:a37:a38:a39:a40:a41:a42:a43:a44:a45:a46:a47:a48:a49:a50:a51:a52:a53:a54:a55:a56:a57:a58:a59:a60:a61:a62:a63:a64:a65:a66:a67:a68:a69:a70:a71:a72:a73:a74:a203:a75:a204:a76:a77:a78:a79:a81:a82:a83:a84:a97:a98:a99:a100:a89:a90:a93:a94:a91:a92:a205:a85:a206:a86:a87:a88:a95:a96:a101:a102:a103:a104:a106:a107:a108:a112:a111:a110:a109:a120:a121:a122:a123:a124:a125:a126:a127:a128:a129:a130:a131:a132:a133:a134:a135:a136:a137:a138:a139:a140:a141:a142:a143:a144:a145:a146:a147:a148:a149:a150:a151:a152:a153:a154:a155:a156:a157:a158:a159:a160:a161:a163:a164:a196:a165:a192:a166:a167:a168:a169:a170:a171:a172:a173:a162:a174:a175:a176:a177:a178:a179:a193:a180:a199:a181:a200:a182:a201:a183:a184:a197:a185:a194:a198:a186:a195:a187:a188:a189:a190:a191'.split(
                    ':'
                  ),
                n =
                  '.notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef .notdef space exclam quotedbl numbersign dollar percent ampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash zero one two three four five six seven eight nine colon semicolon less equal greater question at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z bracketleft backslash bracketright asciicircum underscore grave a b c d e f g h i j k l m n o p q r s t u v w x y z braceleft bar braceright asciitilde .notdef Euro .notdef quotesinglbase florin quotedblbase ellipsis dagger daggerdbl circumflex perthousand Scaron guilsinglleft OE .notdef Zcaron .notdef .notdef quoteleft quoteright quotedblleft quotedblright bullet endash emdash tilde trademark scaron guilsinglright oe .notdef zcaron ydieresis space exclamdown cent sterling currency yen brokenbar section dieresis copyright ordfeminine guillemotleft logicalnot hyphen registered macron degree plusminus twosuperior threesuperior acute mu paragraph periodcentered cedilla onesuperior ordmasculine guillemotright onequarter onehalf threequarters questiondown Agrave Aacute Acircumflex Atilde Adieresis Aring AE Ccedilla Egrave Eacute Ecircumflex Edieresis Igrave Iacute Icircumflex Idieresis Eth Ntilde Ograve Oacute Ocircumflex Otilde Odieresis multiply Oslash Ugrave Uacute Ucircumflex Udieresis Yacute Thorn germandbls agrave aacute acircumflex atilde adieresis aring ae ccedilla egrave eacute ecircumflex edieresis igrave iacute icircumflex idieresis eth ntilde ograve oacute ocircumflex otilde odieresis divide oslash ugrave uacute ucircumflex udieresis yacute thorn ydieresis'.split(
                    ' '
                  );
              return (
                (t.prototype.encodeText = function (t) {
                  for (var r = [], n = 0; n < t.length; n++) {
                    var i = t.charCodeAt(n);
                    (i = e[i] || i), r.push(i.toString(16));
                  }
                  return r;
                }),
                (t.prototype.glyphsForString = function (t) {
                  for (var e = [], r = 0; r < t.length; r++) {
                    var n = t.charCodeAt(r);
                    e.push(this.characterToGlyph(n));
                  }
                  return e;
                }),
                (t.prototype.characterToGlyph = function (t) {
                  return n[e[t] || t] || '.notdef';
                }),
                (t.prototype.widthOfGlyph = function (t) {
                  return this.glyphWidths[t] || 0;
                }),
                (t.prototype.getKernPair = function (t, e) {
                  return this.kernPairs[t + '\0' + e] || 0;
                }),
                (t.prototype.advancesForGlyphs = function (t) {
                  for (var e = [], r = 0; r < t.length; r++) {
                    var n = t[r],
                      i = t[r + 1];
                    e.push(this.widthOfGlyph(n) + this.getKernPair(n, i));
                  }
                  return e;
                }),
                (t.prototype._parseFontBBox = function (t) {
                  for (var e = t.split(':'), r = [], n = 0; n < e.length; n++)
                    r.push(parseInt(e[n]));
                  return r;
                }),
                (t.prototype._getCharWidths = function () {
                  for (var t = [], e = 0; e <= 255; e++)
                    t.push(this.glyphWidths[n[e]]);
                  return t;
                }),
                (t.prototype._parseGlyphWidths = function (t) {
                  var e,
                    n = t.split(','),
                    i = {};
                  if (1 === n.length) {
                    var o = n[0].match(/(^\d+)-(\d+):(\d+)$/),
                      a = parseInt(o[1]),
                      s = parseInt(o[2]);
                    e = parseInt(o[3]);
                    for (l = a; l <= s; l++) i[r[l]] = e;
                  } else
                    for (var u = 0, l = 0; l < n.length; l++) {
                      var c = n[l].split(':');
                      1 == c.length
                        ? (e = parseInt(c[0]))
                        : ((u = parseInt(c[0])), (e = parseInt(c[1]))),
                        (i[r[u++]] = e);
                    }
                  return i;
                }),
                (t.prototype._parseKerningPairs = function (t) {
                  return {};
                }),
                t
              );
            })()),
              (e.localExports = n);
          },
          { 'base64-js': 45 },
        ],
        5: [
          function (t, e, r) {
            var n,
              i,
              o = {}.hasOwnProperty,
              a = function (t, e) {
                function r() {
                  this.constructor = t;
                }
                for (var n in e) o.call(e, n) && (t[n] = e[n]);
                return (
                  (r.prototype = e.prototype),
                  (t.prototype = new r()),
                  (t.__super__ = e.prototype),
                  t
                );
              },
              s = [].slice;
            (i = t('../font')),
              t('../object'),
              (n = (function (t) {
                function e(t, e, r) {
                  (this.document = t),
                    (this.font = e),
                    (this.id = r),
                    (this.subset = this.font.createSubset()),
                    (this.unicode = [[0]]),
                    (this.widths = [this.font.getGlyph(0).advanceWidth]),
                    (this.name = this.font.postscriptName),
                    (this.scale = 1e3 / this.font.unitsPerEm),
                    (this.ascender = this.font.ascent * this.scale),
                    (this.descender = this.font.descent * this.scale),
                    (this.lineGap = this.font.lineGap * this.scale),
                    (this.bbox = this.font.bbox);
                }
                var r;
                return (
                  a(e, i),
                  (e.prototype.encode = function (t, e) {
                    var r, n, i, o, a, s, u, l, c, h, f, d;
                    for (
                      i = (d = this.font.layout(t, e)).glyphs,
                        s = d.positions,
                        u = [],
                        o = h = 0,
                        f = i.length;
                      h < f;
                      o = ++h
                    ) {
                      (n = i[o]),
                        (r = this.subset.includeGlyph(n.id)),
                        u.push(('0000' + r.toString(16)).slice(-4)),
                        null == (l = this.widths)[r] &&
                          (l[r] = n.advanceWidth * this.scale),
                        null == (c = this.unicode)[r] && (c[r] = n.codePoints);
                      for (a in s[o]) s[o][a] *= this.scale;
                      s[o].advanceWidth = n.advanceWidth * this.scale;
                    }
                    return [u, s];
                  }),
                  (e.prototype.widthOfString = function (t, e, r) {
                    var n, i;
                    return (
                      (i = this.font.layout(t, r).advanceWidth),
                      (n = e / this.font.unitsPerEm),
                      i * n
                    );
                  }),
                  (e.prototype.embed = function () {
                    var t, e, r, n, i, o, a, s, u, l;
                    return (
                      (o = this.document.ref()),
                      this.subset.encodeStream().pipe(o),
                      (n =
                        ((null != (l = this.font['OS/2'])
                          ? l.sFamilyClass
                          : void 0) || 0) >> 8),
                      (i = 0),
                      this.font.post.isFixedPitch && (i |= 1),
                      1 <= n && n <= 7 && (i |= 2),
                      (i |= 4),
                      10 === n && (i |= 8),
                      this.font.head.macStyle.italic && (i |= 64),
                      (u = (function () {
                        var t, e;
                        for (e = [], a = t = 0; t < 6; a = ++t)
                          e.push(String.fromCharCode(26 * Math.random() + 65));
                        return e;
                      })().join('')),
                      (s = u + '+' + this.font.postscriptName),
                      (t = this.font.bbox),
                      (r = this.document.ref({
                        Type: 'FontDescriptor',
                        FontName: s,
                        Flags: i,
                        FontBBox: [
                          t.minX * this.scale,
                          t.minY * this.scale,
                          t.maxX * this.scale,
                          t.maxY * this.scale,
                        ],
                        ItalicAngle: this.font.italicAngle,
                        Ascent: this.ascender,
                        Descent: this.descender,
                        CapHeight:
                          (this.font.capHeight || this.font.ascent) *
                          this.scale,
                        XHeight: (this.font.xHeight || 0) * this.scale,
                        StemV: 0,
                      })),
                      (r.data.FontFile2 = o),
                      r.end(),
                      (e = this.document.ref({
                        Type: 'Font',
                        Subtype: 'CIDFontType2',
                        BaseFont: s,
                        CIDSystemInfo: {
                          Registry: new String('Adobe'),
                          Ordering: new String('Identity'),
                          Supplement: 0,
                        },
                        FontDescriptor: r,
                        W: [0, this.widths],
                      })).end(),
                      (this.dictionary.data = {
                        Type: 'Font',
                        Subtype: 'Type0',
                        BaseFont: s,
                        Encoding: 'Identity-H',
                        DescendantFonts: [e],
                        ToUnicode: this.toUnicodeCmap(),
                      }),
                      this.dictionary.end()
                    );
                  }),
                  (r = function () {
                    var t, e;
                    return (
                      (e = 1 <= arguments.length ? s.call(arguments, 0) : []),
                      (function () {
                        var r, n, i;
                        for (i = [], r = 0, n = e.length; r < n; r++)
                          (t = e[r]),
                            i.push(('0000' + t.toString(16)).slice(-4));
                        return i;
                      })().join('')
                    );
                  }),
                  (e.prototype.toUnicodeCmap = function () {
                    var t, e, n, i, o, a, s, u, l, c;
                    for (
                      t = this.document.ref(),
                        i = [],
                        a = 0,
                        u = (c = this.unicode).length;
                      a < u;
                      a++
                    ) {
                      for (n = [], s = 0, l = (e = c[a]).length; s < l; s++)
                        (o = e[s]) > 65535 &&
                          ((o -= 65536),
                          n.push(r(((o >>> 10) & 1023) | 55296)),
                          (o = 56320 | (1023 & o))),
                          n.push(r(o));
                      i.push('<' + n.join(' ') + '>');
                    }
                    return (
                      t.end(
                        '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000><ffff>\nendcodespacerange\n1 beginbfrange\n<0000> <' +
                          r(i.length - 1) +
                          '> [' +
                          i.join(' ') +
                          ']\nendbfrange\nendcmap\nCMapName currentdict /CMap defineresource pop\nend\nend'
                      ),
                      t
                    );
                  }),
                  e
                );
              })()),
              (e.localExports = n);
          },
          { '../font': 3, '../object': 18 },
        ],
        6: [
          function (t, e, r) {
            var n,
              i,
              o,
              a = {}.hasOwnProperty,
              s = function (t, e) {
                function r() {
                  this.constructor = t;
                }
                for (var n in e) a.call(e, n) && (t[n] = e[n]);
                return (
                  (r.prototype = e.prototype),
                  (t.prototype = new r()),
                  (t.__super__ = e.prototype),
                  t
                );
              };
            (n = t('./afm')),
              (i = t('../font')),
              t('fs'),
              (o = (function (t) {
                function e(t, e, i) {
                  var o;
                  (this.document = t),
                    (this.name = e),
                    (this.id = i),
                    (this.font = new n(r[this.name]())),
                    (o = this.font),
                    (this.ascender = o.ascender),
                    (this.descender = o.descender),
                    (this.bbox = o.bbox),
                    (this.lineGap = o.lineGap);
                }
                var r;
                return (
                  s(e, i),
                  (e.prototype.embed = function () {
                    return (
                      (this.dictionary.data = {
                        Type: 'Font',
                        BaseFont: this.name,
                        Subtype: 'Type1',
                        Encoding: 'WinAnsiEncoding',
                      }),
                      this.dictionary.end()
                    );
                  }),
                  (e.prototype.encode = function (t) {
                    var e, r, n, i, o, a, s, u;
                    for (
                      r = this.font.encodeText(t),
                        i = this.font.glyphsForString('' + t),
                        e = this.font.advancesForGlyphs(i),
                        a = [],
                        o = s = 0,
                        u = i.length;
                      s < u;
                      o = ++s
                    )
                      (n = i[o]),
                        a.push({
                          xAdvance: e[o],
                          yAdvance: 0,
                          xOffset: 0,
                          yOffset: 0,
                          advanceWidth: this.font.widthOfGlyph(n),
                        });
                    return [r, a];
                  }),
                  (e.prototype.widthOfString = function (t, e) {
                    var r, n, i, o, a, s;
                    for (
                      n = this.font.glyphsForString('' + t),
                        o = 0,
                        a = 0,
                        s = (r = this.font.advancesForGlyphs(n)).length;
                      a < s;
                      a++
                    )
                      o += r[a];
                    return (i = e / 1e3), o * i;
                  }),
                  (e.isStandardFont = function (t) {
                    return t in r;
                  }),
                  (r = {
                    Courier: function () {
                      return [
                        0,
                        '-23:-250:715:805',
                        562,
                        426,
                        629,
                        -157,
                        '0-314:600',
                      ];
                    },
                    'Courier-Bold': function () {
                      return [
                        0,
                        '-113:-250:749:801',
                        562,
                        439,
                        629,
                        -157,
                        '0-314:600',
                      ];
                    },
                    'Courier-Oblique': function () {
                      return [
                        -12,
                        '-27:-250:849:805',
                        562,
                        426,
                        629,
                        -157,
                        '0-314:600',
                      ];
                    },
                    'Courier-BoldOblique': function () {
                      return [
                        -12,
                        '-57:-250:869:801',
                        562,
                        439,
                        629,
                        -157,
                        '0-314:600',
                      ];
                    },
                    Helvetica: function () {
                      return [
                        0,
                        '-166:-225:1000:931',
                        718,
                        523,
                        718,
                        -207,
                        '278,278,355,556,556,889,667,222,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,222,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584,333,556,556,167,556,556,556,556,191,333,556,333,333,500,500,556,556,556,278,537,350,222,333,333,556,1000,1000,611,333,333,333,333,333,333,333,333,333,333,333,333,333,1000,1000,370,556,778,1000,365,889,278,222,611,944,611,278,556,556,556,556,667,584,667,667,556,722,500,500,556,722,722,556,722,556,667,722,250,737,667,500,556,722,222,556,611,722,556,667,500,500,278,471,722,778,556,556,667,333,500,611,667,778,722,667,643,722,556,333,778,667,667,584,556,611,476,500,722,278,667,556,556,500,556,556,722,278,584,260,737,778,278,600,667,333,556,611,611,549,722,722,222,317,556,722,667,667,556,500,222,778,556,556,500,278,778,722,612,556,333,778,556,278,556,667,556,834,667,299,667,556,1000,556,278,278,556,834,549,556,556,722,667,556,556,834,667,667,778,400,556,722,556,453,722,333,722,556,722,556,667,667,667,778,500,667,278,500,584,278,556,278,584,556,556,549,556,556,500,556,333,278,556',
                      ];
                    },
                    'Helvetica-Bold': function () {
                      return [
                        0,
                        '-170:-228:1003:962',
                        718,
                        532,
                        718,
                        -207,
                        '278,333,474,556,556,889,722,278,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,278,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584,333,556,556,167,556,556,556,556,238,500,556,333,333,611,611,556,556,556,278,556,350,278,500,500,556,1000,1000,611,333,333,333,333,333,333,333,333,333,333,333,333,333,1000,1000,370,611,778,1000,365,889,278,278,611,944,611,278,556,556,611,556,667,584,667,722,556,722,556,556,556,722,722,556,722,611,667,722,250,737,667,556,556,722,278,556,611,722,556,667,556,556,278,494,722,778,611,556,722,389,556,611,667,778,722,667,743,722,611,333,778,722,722,584,611,611,494,556,722,278,667,556,556,556,611,611,722,278,584,280,737,778,278,600,667,389,611,611,611,549,722,722,278,389,556,722,722,722,556,500,278,778,611,556,556,278,778,722,612,611,333,778,611,278,611,667,611,834,667,400,722,611,1000,556,278,278,611,834,549,611,611,722,667,556,611,834,667,667,778,400,611,722,611,549,722,389,722,611,722,611,722,722,722,778,500,667,278,556,584,278,611,333,584,611,611,549,611,611,500,611,333,278,556',
                      ];
                    },
                    'Helvetica-Oblique': function () {
                      return [
                        -12,
                        '-170:-225:1116:931',
                        718,
                        523,
                        718,
                        -207,
                        '278,278,355,556,556,889,667,222,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,222,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584,333,556,556,167,556,556,556,556,191,333,556,333,333,500,500,556,556,556,278,537,350,222,333,333,556,1000,1000,611,333,333,333,333,333,333,333,333,333,333,333,333,333,1000,1000,370,556,778,1000,365,889,278,222,611,944,611,278,556,556,556,556,667,584,667,667,556,722,500,500,556,722,722,556,722,556,667,722,250,737,667,500,556,722,222,556,611,722,556,667,500,500,278,471,722,778,556,556,667,333,500,611,667,778,722,667,643,722,556,333,778,667,667,584,556,611,476,500,722,278,667,556,556,500,556,556,722,278,584,260,737,778,278,600,667,333,556,611,611,549,722,722,222,317,556,722,667,667,556,500,222,778,556,556,500,278,778,722,612,556,333,778,556,278,556,667,556,834,667,299,667,556,1000,556,278,278,556,834,549,556,556,722,667,556,556,834,667,667,778,400,556,722,556,453,722,333,722,556,722,556,667,667,667,778,500,667,278,500,584,278,556,278,584,556,556,549,556,556,500,556,333,278,556',
                      ];
                    },
                    'Helvetica-BoldOblique': function () {
                      return [
                        -12,
                        '-174:-228:1114:962',
                        718,
                        532,
                        718,
                        -207,
                        '278,333,474,556,556,889,722,278,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,278,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584,333,556,556,167,556,556,556,556,238,500,556,333,333,611,611,556,556,556,278,556,350,278,500,500,556,1000,1000,611,333,333,333,333,333,333,333,333,333,333,333,333,333,1000,1000,370,611,778,1000,365,889,278,278,611,944,611,278,556,556,611,556,667,584,667,722,556,722,556,556,556,722,722,556,722,611,667,722,250,737,667,556,556,722,278,556,611,722,556,667,556,556,278,494,722,778,611,556,722,389,556,611,667,778,722,667,743,722,611,333,778,722,722,584,611,611,494,556,722,278,667,556,556,556,611,611,722,278,584,280,737,778,278,600,667,389,611,611,611,549,722,722,278,389,556,722,722,722,556,500,278,778,611,556,556,278,778,722,612,611,333,778,611,278,611,667,611,834,667,400,722,611,1000,556,278,278,611,834,549,611,611,722,667,556,611,834,667,667,778,400,611,722,611,549,722,389,722,611,722,611,722,722,722,778,500,667,278,556,584,278,611,333,584,611,611,549,611,611,500,611,333,278,556',
                      ];
                    },
                    'Times-Roman': function () {
                      return [
                        0,
                        '-168:-218:1000:898',
                        662,
                        450,
                        683,
                        -217,
                        '250,333,408,500,500,833,778,333,333,333,500,564,250,333,250,278,500,500,500,500,500,500,500,500,500,500,278,278,564,564,564,444,921,722,667,667,722,611,556,722,722,333,389,722,611,889,722,722,556,722,667,556,611,722,722,944,722,722,611,333,278,333,469,500,333,444,500,444,500,444,333,500,500,278,278,500,278,778,500,500,500,500,333,389,278,500,500,722,500,500,444,480,200,480,541,333,500,500,167,500,500,500,500,180,444,500,333,333,556,556,500,500,500,250,453,350,333,444,444,500,1000,1000,444,333,333,333,333,333,333,333,333,333,333,333,333,333,1000,889,276,611,722,889,310,667,278,278,500,722,500,333,444,444,500,444,722,564,722,722,444,722,500,389,444,722,722,444,722,500,611,722,250,760,611,444,444,722,278,444,611,667,444,611,389,389,278,471,667,722,500,444,722,333,444,611,556,722,667,556,588,722,500,300,722,722,722,564,500,611,476,500,722,278,611,444,444,444,500,500,722,333,564,200,760,722,333,600,611,333,500,611,611,549,722,667,278,326,444,722,722,722,444,444,278,722,500,444,389,278,722,722,612,500,300,722,500,278,500,611,500,750,556,344,722,611,980,444,333,333,611,750,549,500,500,722,611,444,500,750,556,556,722,400,500,667,500,453,722,333,722,500,667,611,722,722,722,722,444,611,333,500,564,333,500,278,564,500,500,549,500,500,444,500,300,278,500',
                      ];
                    },
                    'Times-Bold': function () {
                      return [
                        0,
                        '-168:-218:1000:935',
                        676,
                        461,
                        683,
                        -217,
                        '250,333,555,500,500,1000,833,333,333,333,500,570,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,570,570,570,500,930,722,667,722,722,667,611,778,778,389,500,778,667,944,722,778,611,778,722,556,667,722,722,1000,722,722,667,333,278,333,581,500,333,500,556,444,556,444,333,500,556,278,333,556,278,833,556,500,556,556,444,389,333,556,500,722,500,500,444,394,220,394,520,333,500,500,167,500,500,500,500,278,500,500,333,333,556,556,500,500,500,250,540,350,333,500,500,500,1000,1000,500,333,333,333,333,333,333,333,333,333,333,333,333,333,1000,1000,300,667,778,1000,330,722,278,278,500,722,556,389,444,500,556,444,722,570,722,722,500,722,500,389,444,722,722,500,722,556,667,722,250,747,667,444,500,722,278,500,667,722,500,667,389,389,278,494,722,778,556,500,722,444,444,667,611,778,722,556,672,722,556,300,778,722,722,570,556,667,494,500,722,278,667,500,444,444,556,556,722,389,570,220,747,778,389,600,667,444,500,667,667,549,722,722,278,416,444,722,722,722,444,444,278,778,500,500,389,278,778,722,612,556,300,778,556,278,500,667,556,750,556,394,778,667,1000,444,389,389,667,750,549,500,556,722,667,444,500,750,556,556,778,400,500,722,556,549,722,444,722,500,722,667,722,722,722,778,444,667,389,556,570,389,556,333,570,500,556,549,500,500,444,556,300,278,500',
                      ];
                    },
                    'Times-Italic': function () {
                      return [
                        -15.5,
                        '-169:-217:1010:883',
                        653,
                        441,
                        683,
                        -217,
                        '250,333,420,500,500,833,778,333,333,333,500,675,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,675,675,675,500,920,611,611,667,722,611,611,722,722,333,444,667,556,833,667,722,611,722,611,500,556,722,611,833,611,556,556,389,278,389,422,500,333,500,500,444,500,444,278,500,500,278,278,444,278,722,500,500,500,500,389,389,278,500,444,667,444,444,389,400,275,400,541,389,500,500,167,500,500,500,500,214,556,500,333,333,500,500,500,500,500,250,523,350,333,556,556,500,889,1000,500,333,333,333,333,333,333,333,333,333,333,333,333,333,889,889,276,556,722,944,310,667,278,278,500,667,500,333,444,500,500,444,556,675,556,611,500,722,444,389,444,722,722,500,722,500,611,722,250,760,611,444,500,667,278,500,556,667,500,611,389,389,278,471,611,722,500,500,611,389,444,556,611,722,611,500,544,722,500,300,722,611,611,675,500,556,476,444,667,278,611,500,444,444,500,500,667,333,675,275,760,722,333,600,611,389,500,556,556,549,722,667,278,300,444,722,611,611,444,389,278,722,500,500,389,278,722,722,612,500,300,722,500,278,500,611,500,750,500,300,667,556,980,444,333,333,611,750,549,500,500,722,611,444,500,750,500,500,722,400,500,667,500,453,722,389,667,500,611,556,611,611,611,722,389,611,333,444,675,333,500,278,675,500,500,549,500,500,389,500,300,278,500',
                      ];
                    },
                    'Times-BoldItalic': function () {
                      return [
                        -15,
                        '-200:-218:996:921',
                        669,
                        462,
                        683,
                        -217,
                        '250,389,555,500,500,833,778,333,333,333,500,570,250,333,250,278,500,500,500,500,500,500,500,500,500,500,333,333,570,570,570,500,832,667,667,667,722,667,667,722,778,389,500,667,611,889,722,722,611,722,667,556,611,722,667,889,667,611,611,333,278,333,570,500,333,500,500,444,500,444,333,500,556,278,278,500,278,778,556,500,500,500,389,389,278,556,444,667,500,444,389,348,220,348,570,389,500,500,167,500,500,500,500,278,500,500,333,333,556,556,500,500,500,250,500,350,333,500,500,500,1000,1000,500,333,333,333,333,333,333,333,333,333,333,333,333,333,1000,944,266,611,722,944,300,722,278,278,500,722,500,389,444,500,556,444,611,570,611,667,500,722,444,389,444,722,722,500,722,556,667,722,250,747,667,444,500,722,278,500,611,667,500,667,389,389,278,494,667,722,556,500,667,389,444,611,611,722,667,556,608,722,556,300,722,667,667,570,556,611,494,444,722,278,667,500,444,444,556,556,722,389,570,220,747,722,389,600,667,389,500,611,611,549,722,667,278,366,444,722,667,667,444,389,278,722,500,500,389,278,722,722,612,500,300,722,576,278,500,667,500,750,556,382,667,611,1000,444,389,389,611,750,549,500,556,722,667,444,500,750,556,556,722,400,500,667,556,549,722,389,722,500,667,611,667,667,667,722,389,667,389,500,606,389,556,278,606,500,556,549,500,500,389,556,300,278,500',
                      ];
                    },
                    Symbol: function () {
                      return [
                        0,
                        '-180:-293:1090:1010',
                        0,
                        0,
                        0,
                        0,
                        '250,333,315:713,3:500,316:549,5:833,778,317:439,8:333,333,318:500,11:549,250,300:549,14:250,278,500,500,500,500,500,500,500,500,500,500,278,278,549,549,549,444,319:549,722,667,722,250:612,323:611,763,603,722,333,631,722,686,889,722,722,768,741,556,592,611,690,439,768,645,795,611,59:333,345:863,61:333,346:658,63:500,347:500,631,549,549,494,439,521,411,603,329,603,549,549,254:576,360:521,549,549,521,549,603,439,576,713,686,493,686,494,91:480,200,480,373:549,314:750,374:620,247,270:549,98:167,376:713,100:500,377:753,753,753,753,1042,987,603,987,603,281:400,220:549,386:411,231:549,205:549,387:713,208:494,115:460,155:549,307:549,388:549,549,120:1000,390:603,1000,658,823,686,795,987,768,768,823,768,768,713,713,713,713,713,713,713,768,713,790,790,890,823,285:549,415:250,304:713,416:603,603,1042,987,603,987,603,185:494,423:329,790,790,786,225:713,427:384,384,384,384,384,384,494,494,494,494,329,274,686,686,686,384,384,384,384,384,384,494,494,494,790',
                      ];
                    },
                    ZapfDingbats: function () {
                      return [
                        0,
                        '-1:-143:981:820',
                        0,
                        0,
                        0,
                        0,
                        '278,452:974,961,974,980,719,789,790,791,690,960,939,549,855,911,933,911,945,974,755,846,762,761,571,677,763,760,759,754,494,552,537,577,692,786,788,788,790,793,794,816,823,789,841,823,833,816,831,923,744,723,749,790,792,695,776,768,792,759,707,708,682,701,826,815,789,789,707,687,696,689,786,787,713,791,785,791,873,761,762,762,759,759,892,892,788,784,438,138,277,415,392,392,668,668,390,390,317,317,276,276,509,509,410,410,234,234,334,334,732,544,544,910,667,760,760,776,595,694,626,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,788,894,838,1016,458,748,924,748,918,927,928,928,834,873,828,924,924,917,930,931,463,883,836,836,867,867,696,696,874,874,760,946,771,865,771,888,967,888,831,873,927,970,918',
                      ];
                    },
                  }),
                  e
                );
              })()),
              (e.localExports = o);
          },
          { '../font': 3, './afm': 4, fs: 59 },
        ],
        7: [
          function (t, e, r) {
            var n,
              i,
              o,
              a = {}.hasOwnProperty,
              s = function (t, e) {
                function r() {
                  this.constructor = t;
                }
                for (var n in e) a.call(e, n) && (t[n] = e[n]);
                return (
                  (r.prototype = e.prototype),
                  (t.prototype = new r()),
                  (t.__super__ = e.prototype),
                  t
                );
              };
            (n = (function () {
              function t(t) {
                (this.doc = t),
                  (this.stops = []),
                  (this.embedded = !1),
                  (this.transform = [1, 0, 0, 1, 0, 0]),
                  (this._colorSpace = 'DeviceRGB');
              }
              return (
                (t.prototype.stop = function (t, e, r) {
                  return (
                    null == r && (r = 1),
                    (r = Math.max(0, Math.min(1, r))),
                    this.stops.push([t, this.doc._normalizeColor(e), r]),
                    this
                  );
                }),
                (t.prototype.embed = function () {
                  var t,
                    e,
                    r,
                    n,
                    i,
                    o,
                    a,
                    s,
                    u,
                    l,
                    c,
                    h,
                    f,
                    d,
                    p,
                    g,
                    _,
                    v,
                    m,
                    y,
                    b,
                    w,
                    x,
                    S,
                    C,
                    k,
                    E,
                    A,
                    P,
                    j,
                    I,
                    T,
                    B,
                    L,
                    O,
                    N;
                  if (!this.embedded && 0 !== this.stops.length) {
                    for (
                      this.embedded = !0,
                        (c = this.stops[this.stops.length - 1])[0] < 1 &&
                          this.stops.push([1, c[1], c[2]]),
                        t = [],
                        n = [],
                        P = [],
                        l = I = 0,
                        L = this.stops.length - 1;
                      0 <= L ? I < L : I > L;
                      l = 0 <= L ? ++I : --I
                    )
                      n.push(0, 1),
                        l + 2 !== this.stops.length &&
                          t.push(this.stops[l + 1][0]),
                        (i = this.doc.ref({
                          FunctionType: 2,
                          Domain: [0, 1],
                          C0: this.stops[l + 0][1],
                          C1: this.stops[l + 1][1],
                          N: 1,
                        })),
                        P.push(i),
                        i.end();
                    if (
                      (1 === P.length
                        ? (i = P[0])
                        : (i = this.doc.ref({
                            FunctionType: 3,
                            Domain: [0, 1],
                            Functions: P,
                            Bounds: t,
                            Encode: n,
                          })).end(),
                      (this.id = 'Sh' + ++this.doc._gradCount),
                      (h = this.doc._ctm.slice()),
                      (f = h[0]),
                      (d = h[1]),
                      (_ = h[2]),
                      (y = h[3]),
                      (b = h[4]),
                      (w = h[5]),
                      (O = this.transform),
                      (p = O[0]),
                      (g = O[1]),
                      (v = O[2]),
                      (m = O[3]),
                      (e = O[4]),
                      (r = O[5]),
                      (h[0] = f * p + _ * g),
                      (h[1] = d * p + y * g),
                      (h[2] = f * v + _ * m),
                      (h[3] = d * v + y * m),
                      (h[4] = f * e + _ * r + b),
                      (h[5] = d * e + y * r + w),
                      (E = this.shader(i)).end(),
                      (S = this.doc.ref({
                        Type: 'Pattern',
                        PatternType: 2,
                        Shading: E,
                        Matrix: (function () {
                          var t, e, r;
                          for (r = [], t = 0, e = h.length; t < e; t++)
                            (j = h[t]), r.push(+j.toFixed(5));
                          return r;
                        })(),
                      })),
                      (this.doc.page.patterns[this.id] = S),
                      S.end(),
                      this.stops.some(function (t) {
                        return t[2] < 1;
                      }))
                    ) {
                      for (
                        (a = this.opacityGradient())._colorSpace = 'DeviceGray',
                          T = 0,
                          B = (N = this.stops).length;
                        T < B;
                        T++
                      )
                        (A = N[T]), a.stop(A[0], [A[2]]);
                      (a = a.embed()),
                        (s = this.doc.ref({
                          Type: 'Group',
                          S: 'Transparency',
                          CS: 'DeviceGray',
                        })).end(),
                        (C = this.doc.ref({
                          ProcSet: [
                            'PDF',
                            'Text',
                            'ImageB',
                            'ImageC',
                            'ImageI',
                          ],
                          Shading: {
                            Sh1: a.data.Shading,
                          },
                        })).end(),
                        (o = this.doc.ref({
                          Type: 'XObject',
                          Subtype: 'Form',
                          FormType: 1,
                          BBox: [
                            0,
                            0,
                            this.doc.page.width,
                            this.doc.page.height,
                          ],
                          Group: s,
                          Resources: C,
                        })).end('/Sh1 sh'),
                        (k = this.doc.ref({
                          Type: 'Mask',
                          S: 'Luminosity',
                          G: o,
                        })).end(),
                        (u = this.doc.ref({
                          Type: 'ExtGState',
                          SMask: k,
                        })),
                        (this.opacity_id = ++this.doc._opacityCount),
                        (x = 'Gs' + this.opacity_id),
                        (this.doc.page.ext_gstates[x] = u),
                        u.end();
                    }
                    return S;
                  }
                }),
                (t.prototype.apply = function (t) {
                  if (
                    (this.embedded || this.embed(),
                    this.doc.addContent('/' + this.id + ' ' + t),
                    this.opacity_id)
                  )
                    return (
                      this.doc.addContent('/Gs' + this.opacity_id + ' gs'),
                      (this.doc._sMasked = !0)
                    );
                }),
                t
              );
            })()),
              (i = (function (t) {
                function e(t, r, n, i, o) {
                  (this.doc = t),
                    (this.x1 = r),
                    (this.y1 = n),
                    (this.x2 = i),
                    (this.y2 = o),
                    e.__super__.constructor.apply(this, arguments);
                }
                return (
                  s(e, n),
                  (e.prototype.shader = function (t) {
                    return this.doc.ref({
                      ShadingType: 2,
                      ColorSpace: this._colorSpace,
                      Coords: [this.x1, this.y1, this.x2, this.y2],
                      Function: t,
                      Extend: [!0, !0],
                    });
                  }),
                  (e.prototype.opacityGradient = function () {
                    return new e(this.doc, this.x1, this.y1, this.x2, this.y2);
                  }),
                  e
                );
              })()),
              (o = (function (t) {
                function e(t, r, n, i, o, a, s) {
                  (this.doc = t),
                    (this.x1 = r),
                    (this.y1 = n),
                    (this.r1 = i),
                    (this.x2 = o),
                    (this.y2 = a),
                    (this.r2 = s),
                    e.__super__.constructor.apply(this, arguments);
                }
                return (
                  s(e, n),
                  (e.prototype.shader = function (t) {
                    return this.doc.ref({
                      ShadingType: 3,
                      ColorSpace: this._colorSpace,
                      Coords: [
                        this.x1,
                        this.y1,
                        this.r1,
                        this.x2,
                        this.y2,
                        this.r2,
                      ],
                      Function: t,
                      Extend: [!0, !0],
                    });
                  }),
                  (e.prototype.opacityGradient = function () {
                    return new e(
                      this.doc,
                      this.x1,
                      this.y1,
                      this.r1,
                      this.x2,
                      this.y2,
                      this.r2
                    );
                  }),
                  e
                );
              })()),
              (e.localExports = {
                PDFGradient: n,
                PDFLinearGradient: i,
                PDFRadialGradient: o,
              });
          },
          {},
        ],
        8: [
          function (t, e, r) {
            (function (r) {
              var n, i, o, a;
              (a = t('fs')),
                t('./data'),
                (n = t('./image/jpeg')),
                (o = t('./image/png')),
                (i = (function () {
                  function t() {}
                  return (
                    (t.open = function (t, e) {
                      var i, s;
                      if (r.isBuffer(t)) i = t;
                      else if (t instanceof ArrayBuffer)
                        i = new r(new Uint8Array(t));
                      else if ((s = /^data:.+;base64,(.*)$/.exec(t)))
                        i = new r(s[1], 'base64');
                      else if (!(i = a.readFileSync(t))) return;
                      if (255 === i[0] && 216 === i[1]) return new n(i, e);
                      if (137 === i[0] && 'PNG' === i.toString('ascii', 1, 4))
                        return new o(i, e);
                      throw new Error('Unknown image format.');
                    }),
                    t
                  );
                })()),
                (e.localExports = i);
            }).call(this, t('buffer').Buffer);
          },
          {
            './data': 1,
            './image/jpeg': 9,
            './image/png': 10,
            buffer: 60,
            fs: 59,
          },
        ],
        9: [
          function (t, e, r) {
            var n,
              i =
                [].indexOf ||
                function (t) {
                  for (var e = 0, r = this.length; e < r; e++)
                    if (e in this && this[e] === t) return e;
                  return -1;
                };
            t('fs'),
              (n = (function () {
                function t(t, r) {
                  var n, o, a;
                  if (
                    ((this.data = t),
                    (this.label = r),
                    65496 !== this.data.readUInt16BE(0))
                  )
                    throw 'SOI not found in JPEG';
                  for (
                    a = 2;
                    a < this.data.length &&
                    ((o = this.data.readUInt16BE(a)),
                    (a += 2),
                    !(i.call(e, o) >= 0));

                  )
                    a += this.data.readUInt16BE(a);
                  if (i.call(e, o) < 0) throw 'Invalid JPEG.';
                  (a += 2),
                    (this.bits = this.data[a++]),
                    (this.height = this.data.readUInt16BE(a)),
                    (a += 2),
                    (this.width = this.data.readUInt16BE(a)),
                    (a += 2),
                    (n = this.data[a++]),
                    (this.colorSpace = (function () {
                      switch (n) {
                        case 1:
                          return 'DeviceGray';
                        case 3:
                          return 'DeviceRGB';
                        case 4:
                          return 'DeviceCMYK';
                      }
                    })()),
                    (this.obj = null);
                }
                var e;
                return (
                  (e = [
                    65472, 65473, 65474, 65475, 65477, 65478, 65479, 65480,
                    65481, 65482, 65483, 65484, 65485, 65486, 65487,
                  ]),
                  (t.prototype.embed = function (t) {
                    if (!this.obj)
                      return (
                        (this.obj = t.ref({
                          Type: 'XObject',
                          Subtype: 'Image',
                          BitsPerComponent: this.bits,
                          Width: this.width,
                          Height: this.height,
                          ColorSpace: this.colorSpace,
                          Filter: 'DCTDecode',
                        })),
                        'DeviceCMYK' === this.colorSpace &&
                          (this.obj.data.Decode = [1, 0, 1, 0, 1, 0, 1, 0]),
                        this.obj.end(this.data),
                        (this.data = null)
                      );
                  }),
                  t
                );
              })()),
              (e.localExports = n);
          },
          { fs: 59 },
        ],
        10: [
          function (t, e, r) {
            (function (r) {
              var n, i, o;
              (o = t('zlib')),
                (n = t('png-js')),
                (i = (function () {
                  function t(t, e) {
                    (this.label = e),
                      (this.image = new n(t)),
                      (this.width = this.image.width),
                      (this.height = this.image.height),
                      (this.imgData = this.image.imgData),
                      (this.obj = null);
                  }
                  return (
                    (t.prototype.embed = function (t) {
                      var e, n, i, o, a, s, u, l;
                      if (((this.document = t), !this.obj)) {
                        if (
                          ((this.obj = this.document.ref({
                            Type: 'XObject',
                            Subtype: 'Image',
                            BitsPerComponent: this.image.bits,
                            Width: this.width,
                            Height: this.height,
                            Filter: 'FlateDecode',
                          })),
                          this.image.hasAlphaChannel ||
                            ((i = this.document.ref({
                              Predictor: 15,
                              Colors: this.image.colors,
                              BitsPerComponent: this.image.bits,
                              Columns: this.width,
                            })),
                            (this.obj.data.DecodeParms = i),
                            i.end()),
                          0 === this.image.palette.length
                            ? (this.obj.data.ColorSpace = this.image.colorSpace)
                            : ((n = this.document.ref()).end(
                                new r(this.image.palette)
                              ),
                              (this.obj.data.ColorSpace = [
                                'Indexed',
                                'DeviceRGB',
                                this.image.palette.length / 3 - 1,
                                n,
                              ])),
                          this.image.transparency.grayscale)
                        )
                          return (
                            (a = this.image.transparency.greyscale),
                            (this.obj.data.Mask = [a, a])
                          );
                        if (this.image.transparency.rgb) {
                          for (
                            e = [],
                              u = 0,
                              l = (o = this.image.transparency.rgb).length;
                            u < l;
                            u++
                          )
                            (s = o[u]), e.push(s, s);
                          return (this.obj.data.Mask = e);
                        }
                        return this.image.transparency.indexed
                          ? this.loadIndexedAlphaChannel()
                          : this.image.hasAlphaChannel
                          ? this.splitAlphaChannel()
                          : this.finalize();
                      }
                    }),
                    (t.prototype.finalize = function () {
                      var t;
                      return (
                        this.alphaChannel &&
                          ((t = this.document.ref({
                            Type: 'XObject',
                            Subtype: 'Image',
                            Height: this.height,
                            Width: this.width,
                            BitsPerComponent: 8,
                            Filter: 'FlateDecode',
                            ColorSpace: 'DeviceGray',
                            Decode: [0, 1],
                          })).end(this.alphaChannel),
                          (this.obj.data.SMask = t)),
                        this.obj.end(this.imgData),
                        (this.image = null),
                        (this.imgData = null)
                      );
                    }),
                    (t.prototype.splitAlphaChannel = function () {
                      return this.image.decodePixels(
                        (function (t) {
                          return function (e) {
                            var n, i, a, s, u, l, c, h, f;
                            for (
                              a = (t.image.colors * t.image.bits) / 8,
                                f = t.width * t.height,
                                l = new r(f * a),
                                i = new r(f),
                                u = h = n = 0,
                                c = e.length;
                              u < c;

                            )
                              (l[h++] = e[u++]),
                                (l[h++] = e[u++]),
                                (l[h++] = e[u++]),
                                (i[n++] = e[u++]);
                            return (
                              (s = 0),
                              o.deflate(l, function (e, r) {
                                if (((t.imgData = r), e)) throw e;
                                if (2 == ++s) return t.finalize();
                              }),
                              o.deflate(i, function (e, r) {
                                if (((t.alphaChannel = r), e)) throw e;
                                if (2 == ++s) return t.finalize();
                              })
                            );
                          };
                        })(this)
                      );
                    }),
                    (t.prototype.loadIndexedAlphaChannel = function (t) {
                      var e;
                      return (
                        (e = this.image.transparency.indexed),
                        this.image.decodePixels(
                          (function (t) {
                            return function (n) {
                              var i, a, s, u, l;
                              for (
                                i = new r(t.width * t.height),
                                  a = 0,
                                  s = u = 0,
                                  l = n.length;
                                u < l;
                                s = u += 1
                              )
                                i[a++] = e[n[s]];
                              return o.deflate(i, function (e, r) {
                                if (((t.alphaChannel = r), e)) throw e;
                                return t.finalize();
                              });
                            };
                          })(this)
                        )
                      );
                    }),
                    t
                  );
                })()),
                (e.localExports = i);
            }).call(this, t('buffer').Buffer);
          },
          { buffer: 60, 'png-js': 186, zlib: 58 },
        ],
        11: [
          function (t, e, r) {
            var n,
              i,
              o,
              a = {}.hasOwnProperty,
              s = function (t, e) {
                function r() {
                  this.constructor = t;
                }
                for (var n in e) a.call(e, n) && (t[n] = e[n]);
                return (
                  (r.prototype = e.prototype),
                  (t.prototype = new r()),
                  (t.__super__ = e.prototype),
                  t
                );
              };
            (n = t('events').EventEmitter),
              (i = t('linebreak')),
              (o = (function (t) {
                function e(t, e) {
                  var r;
                  (this.document = t),
                    (this.indent = e.indent || 0),
                    (this.characterSpacing = e.characterSpacing || 0),
                    (this.wordSpacing = 0 === e.wordSpacing),
                    (this.columns = e.columns || 1),
                    (this.columnGap = null != (r = e.columnGap) ? r : 18),
                    (this.lineWidth =
                      (e.width - this.columnGap * (this.columns - 1)) /
                      this.columns),
                    (this.spaceLeft = this.lineWidth),
                    (this.startX = this.document.x),
                    (this.startY = this.document.y),
                    (this.column = 1),
                    (this.ellipsis = e.ellipsis),
                    (this.continuedX = 0),
                    (this.features = e.features),
                    null != e.height
                      ? ((this.height = e.height),
                        (this.maxY = this.startY + e.height))
                      : (this.maxY = this.document.page.maxY()),
                    this.on(
                      'firstLine',
                      (function (t) {
                        return function (e) {
                          var r;
                          return (
                            (r = t.continuedX || t.indent),
                            (t.document.x += r),
                            (t.lineWidth -= r),
                            t.once('line', function () {
                              if (
                                ((t.document.x -= r),
                                (t.lineWidth += r),
                                e.continued &&
                                  !t.continuedX &&
                                  (t.continuedX = t.indent),
                                !e.continued)
                              )
                                return (t.continuedX = 0);
                            })
                          );
                        };
                      })(this)
                    ),
                    this.on(
                      'lastLine',
                      (function (t) {
                        return function (e) {
                          var r;
                          return (
                            'justify' === (r = e.align) && (e.align = 'left'),
                            (t.lastLine = !0),
                            t.once('line', function () {
                              return (
                                (t.document.y += e.paragraphGap || 0),
                                (e.align = r),
                                (t.lastLine = !1)
                              );
                            })
                          );
                        };
                      })(this)
                    );
                }
                return (
                  s(e, n),
                  (e.prototype.wordWidth = function (t) {
                    return (
                      this.document.widthOfString(t, this) +
                      this.characterSpacing +
                      this.wordSpacing
                    );
                  }),
                  (e.prototype.eachWord = function (t, e) {
                    var r, n, o, a, s, u, l, c, h, f;
                    for (
                      n = new i(t), s = null, f = Object.create(null);
                      (r = n.nextBreak());

                    ) {
                      if (
                        ((h = t.slice(
                          (null != s ? s.position : void 0) || 0,
                          r.position
                        )),
                        (c = null != f[h] ? f[h] : (f[h] = this.wordWidth(h))) >
                          this.lineWidth + this.continuedX)
                      )
                        for (u = s, o = {}; h.length; ) {
                          for (a = h.length; c > this.spaceLeft; )
                            c = this.wordWidth(h.slice(0, --a));
                          if (
                            ((o.required = a < h.length),
                            (l = e(h.slice(0, a), c, o, u)),
                            (u = { required: !1 }),
                            (h = h.slice(a)),
                            (c = this.wordWidth(h)),
                            !1 === l)
                          )
                            break;
                        }
                      else l = e(h, c, r, s);
                      if (!1 === l) break;
                      s = r;
                    }
                  }),
                  (e.prototype.wrap = function (t, e) {
                    var r, n, i, o, a, s, u;
                    return (
                      null != e.indent && (this.indent = e.indent),
                      null != e.characterSpacing &&
                        (this.characterSpacing = e.characterSpacing),
                      null != e.wordSpacing &&
                        (this.wordSpacing = e.wordSpacing),
                      null != e.ellipsis && (this.ellipsis = e.ellipsis),
                      (o =
                        this.document.y + this.document.currentLineHeight(!0)),
                      (this.document.y > this.maxY || o > this.maxY) &&
                        this.nextSection(),
                      (r = ''),
                      (a = 0),
                      (s = 0),
                      (i = 0),
                      (u = this.document.y),
                      (n = (function (t) {
                        return function () {
                          return (
                            (e.textWidth = a + t.wordSpacing * (s - 1)),
                            (e.wordCount = s),
                            (e.lineWidth = t.lineWidth),
                            (u = t.document.y),
                            t.emit('line', r, e, t),
                            i++
                          );
                        };
                      })(this)),
                      this.emit('sectionStart', e, this),
                      this.eachWord(
                        t,
                        (function (t) {
                          return function (i, o, u, l) {
                            var c;
                            if (
                              ((null == l || l.required) &&
                                (t.emit('firstLine', e, t),
                                (t.spaceLeft = t.lineWidth)),
                              o <= t.spaceLeft && ((r += i), (a += o), s++),
                              u.required || o > t.spaceLeft)
                            ) {
                              if (
                                (u.required && t.emit('lastLine', e, t),
                                (c = t.document.currentLineHeight(!0)),
                                null != t.height &&
                                  t.ellipsis &&
                                  t.document.y + 2 * c > t.maxY &&
                                  t.column >= t.columns)
                              ) {
                                for (
                                  !0 === t.ellipsis && (t.ellipsis = 'вЂ¦'),
                                    r = r.replace(/\s+$/, ''),
                                    a = t.wordWidth(r + t.ellipsis);
                                  a > t.lineWidth;

                                )
                                  (r = r.slice(0, -1).replace(/\s+$/, '')),
                                    (a = t.wordWidth(r + t.ellipsis));
                                r += t.ellipsis;
                              }
                              return (
                                n(),
                                t.maxY - (t.document.y + c) < -1e-6 &&
                                !t.nextSection()
                                  ? ((s = 0), (r = ''), !1)
                                  : u.required
                                  ? (o > t.spaceLeft &&
                                      ((r = i), (a = o), (s = 1), n()),
                                    (t.spaceLeft = t.lineWidth),
                                    (r = ''),
                                    (a = 0),
                                    (s = 0))
                                  : ((t.spaceLeft = t.lineWidth - o),
                                    (r = i),
                                    (a = o),
                                    (s = 1))
                              );
                            }
                            return (t.spaceLeft -= o);
                          };
                        })(this)
                      ),
                      s > 0 && (this.emit('lastLine', e, this), n()),
                      this.emit('sectionEnd', e, this),
                      !0 === e.continued
                        ? (i > 1 && (this.continuedX = 0),
                          (this.continuedX += e.textWidth),
                          (this.document.y = u))
                        : (this.document.x = this.startX)
                    );
                  }),
                  (e.prototype.nextSection = function (t) {
                    var e;
                    if (
                      (this.emit('sectionEnd', t, this),
                      ++this.column > this.columns)
                    ) {
                      if (null != this.height) return !1;
                      this.document.addPage(),
                        (this.column = 1),
                        (this.startY = this.document.page.margins.top),
                        (this.maxY = this.document.page.maxY()),
                        (this.document.x = this.startX),
                        this.document._fillColor &&
                          (e = this.document).fillColor.apply(
                            e,
                            this.document._fillColor
                          ),
                        this.emit('pageBreak', t, this);
                    } else
                      (this.document.x += this.lineWidth + this.columnGap),
                        (this.document.y = this.startY),
                        this.emit('columnBreak', t, this);
                    return this.emit('sectionStart', t, this), !0;
                  }),
                  e
                );
              })()),
              (e.localExports = o);
          },
          { events: 164, linebreak: 173 },
        ],
        12: [
          function (t, e, r) {
            e.localExports = {
              annotate: function (t, e, r, n, i) {
                var o, a, s;
                (i.Type = 'Annot'),
                  (i.Rect = this._convertRect(t, e, r, n)),
                  (i.Border = [0, 0, 0]),
                  'Link' !== i.Subtype &&
                    null == i.C &&
                    (i.C = this._normalizeColor(i.color || [0, 0, 0])),
                  delete i.color,
                  'string' == typeof i.Dest && (i.Dest = new String(i.Dest));
                for (o in i)
                  (s = i[o]), (i[o[0].toUpperCase() + o.slice(1)] = s);
                return (
                  (a = this.ref(i)),
                  this.page.annotations.push(a),
                  a.end(),
                  this
                );
              },
              note: function (t, e, r, n, i, o) {
                return (
                  null == o && (o = {}),
                  (o.Subtype = 'Text'),
                  (o.Contents = new String(i)),
                  (o.Name = 'Comment'),
                  null == o.color && (o.color = [243, 223, 92]),
                  this.annotate(t, e, r, n, o)
                );
              },
              link: function (t, e, r, n, i, o) {
                return (
                  null == o && (o = {}),
                  (o.Subtype = 'Link'),
                  (o.A = this.ref({
                    S: 'URI',
                    URI: new String(i),
                  })),
                  o.A.end(),
                  this.annotate(t, e, r, n, o)
                );
              },
              _markup: function (t, e, r, n, i) {
                var o, a, s, u, l;
                return (
                  null == i && (i = {}),
                  (l = this._convertRect(t, e, r, n)),
                  (o = l[0]),
                  (s = l[1]),
                  (a = l[2]),
                  (u = l[3]),
                  (i.QuadPoints = [o, u, a, u, o, s, a, s]),
                  (i.Contents = new String()),
                  this.annotate(t, e, r, n, i)
                );
              },
              highlight: function (t, e, r, n, i) {
                return (
                  null == i && (i = {}),
                  (i.Subtype = 'Highlight'),
                  null == i.color && (i.color = [241, 238, 148]),
                  this._markup(t, e, r, n, i)
                );
              },
              underline: function (t, e, r, n, i) {
                return (
                  null == i && (i = {}),
                  (i.Subtype = 'Underline'),
                  this._markup(t, e, r, n, i)
                );
              },
              strike: function (t, e, r, n, i) {
                return (
                  null == i && (i = {}),
                  (i.Subtype = 'StrikeOut'),
                  this._markup(t, e, r, n, i)
                );
              },
              lineAnnotation: function (t, e, r, n, i) {
                return (
                  null == i && (i = {}),
                  (i.Subtype = 'Line'),
                  (i.Contents = new String()),
                  (i.L = [t, this.page.height - e, r, this.page.height - n]),
                  this.annotate(t, e, r, n, i)
                );
              },
              rectAnnotation: function (t, e, r, n, i) {
                return (
                  null == i && (i = {}),
                  (i.Subtype = 'Square'),
                  (i.Contents = new String()),
                  this.annotate(t, e, r, n, i)
                );
              },
              ellipseAnnotation: function (t, e, r, n, i) {
                return (
                  null == i && (i = {}),
                  (i.Subtype = 'Circle'),
                  (i.Contents = new String()),
                  this.annotate(t, e, r, n, i)
                );
              },
              textAnnotation: function (t, e, r, n, i, o) {
                return (
                  null == o && (o = {}),
                  (o.Subtype = 'FreeText'),
                  (o.Contents = new String(i)),
                  (o.DA = new String()),
                  this.annotate(t, e, r, n, o)
                );
              },
              _convertRect: function (t, e, r, n) {
                var i, o, a, s, u, l, c, h, f;
                return (
                  (h = e),
                  (e += n),
                  (c = t + r),
                  (f = this._ctm),
                  (i = f[0]),
                  (o = f[1]),
                  (a = f[2]),
                  (s = f[3]),
                  (u = f[4]),
                  (l = f[5]),
                  (t = i * t + a * e + u),
                  (e = o * t + s * e + l),
                  (c = i * c + a * h + u),
                  (h = o * c + s * h + l),
                  [t, e, c, h]
                );
              },
            };
          },
          {},
        ],
        13: [
          function (t, e, r) {
            var n, i, o, a, s;
            (s = t('../gradient')),
              (n = s.PDFGradient),
              (i = s.PDFLinearGradient),
              (o = s.PDFRadialGradient),
              (e.localExports = {
                initColor: function () {
                  return (
                    (this._opacityRegistry = {}),
                    (this._opacityCount = 0),
                    (this._gradCount = 0)
                  );
                },
                _normalizeColor: function (t) {
                  var e, r;
                  return t instanceof n
                    ? t
                    : ('string' == typeof t &&
                        ('#' === t.charAt(0)
                          ? (4 === t.length &&
                              (t = t.replace(
                                /#([0-9A-F])([0-9A-F])([0-9A-F])/i,
                                '#$1$1$2$2$3$3'
                              )),
                            (e = parseInt(t.slice(1), 16)),
                            (t = [e >> 16, (e >> 8) & 255, 255 & e]))
                          : a[t] && (t = a[t])),
                      Array.isArray(t)
                        ? (3 === t.length
                            ? (t = (function () {
                                var e, n, i;
                                for (i = [], e = 0, n = t.length; e < n; e++)
                                  (r = t[e]), i.push(r / 255);
                                return i;
                              })())
                            : 4 === t.length &&
                              (t = (function () {
                                var e, n, i;
                                for (i = [], e = 0, n = t.length; e < n; e++)
                                  (r = t[e]), i.push(r / 100);
                                return i;
                              })()),
                          t)
                        : null);
                },
                _setColor: function (t, e) {
                  var r, i, o, a;
                  return (
                    !!(t = this._normalizeColor(t)) &&
                    (this._sMasked &&
                      ((r = this.ref({
                        Type: 'ExtGState',
                        SMask: 'None',
                      })).end(),
                      (i = 'Gs' + ++this._opacityCount),
                      (this.page.ext_gstates[i] = r),
                      this.addContent('/' + i + ' gs'),
                      (this._sMasked = !1)),
                    (o = e ? 'SCN' : 'scn'),
                    t instanceof n
                      ? (this._setColorSpace('Pattern', e), t.apply(o))
                      : ((a = 4 === t.length ? 'DeviceCMYK' : 'DeviceRGB'),
                        this._setColorSpace(a, e),
                        (t = t.join(' ')),
                        this.addContent(t + ' ' + o)),
                    !0)
                  );
                },
                _setColorSpace: function (t, e) {
                  var r;
                  return (
                    (r = e ? 'CS' : 'cs'), this.addContent('/' + t + ' ' + r)
                  );
                },
                fillColor: function (t, e) {
                  return (
                    null == e && (e = 1),
                    this._setColor(t, !1) && this.fillOpacity(e),
                    (this._fillColor = [t, e]),
                    this
                  );
                },
                strokeColor: function (t, e) {
                  return (
                    null == e && (e = 1),
                    this._setColor(t, !0) && this.strokeOpacity(e),
                    this
                  );
                },
                opacity: function (t) {
                  return this._doOpacity(t, t), this;
                },
                fillOpacity: function (t) {
                  return this._doOpacity(t, null), this;
                },
                strokeOpacity: function (t) {
                  return this._doOpacity(null, t), this;
                },
                _doOpacity: function (t, e) {
                  var r, n, i, o;
                  if (null != t || null != e)
                    return (
                      null != t && (t = Math.max(0, Math.min(1, t))),
                      null != e && (e = Math.max(0, Math.min(1, e))),
                      (n = t + '_' + e),
                      this._opacityRegistry[n]
                        ? ((r = (o = this._opacityRegistry[n])[0]), (i = o[1]))
                        : ((r = { Type: 'ExtGState' }),
                          null != t && (r.ca = t),
                          null != e && (r.CA = e),
                          (r = this.ref(r)).end(),
                          (i = 'Gs' + ++this._opacityCount),
                          (this._opacityRegistry[n] = [r, i])),
                      (this.page.ext_gstates[i] = r),
                      this.addContent('/' + i + ' gs')
                    );
                },
                linearGradient: function (t, e, r, n) {
                  return new i(this, t, e, r, n);
                },
                radialGradient: function (t, e, r, n, i, a) {
                  return new o(this, t, e, r, n, i, a);
                },
              }),
              (a = {
                aliceblue: [240, 248, 255],
                antiquewhite: [250, 235, 215],
                aqua: [0, 255, 255],
                aquamarine: [127, 255, 212],
                azure: [240, 255, 255],
                beige: [245, 245, 220],
                bisque: [255, 228, 196],
                black: [0, 0, 0],
                blanchedalmond: [255, 235, 205],
                blue: [0, 0, 255],
                blueviolet: [138, 43, 226],
                brown: [165, 42, 42],
                burlywood: [222, 184, 135],
                cadetblue: [95, 158, 160],
                chartreuse: [127, 255, 0],
                chocolate: [210, 105, 30],
                coral: [255, 127, 80],
                cornflowerblue: [100, 149, 237],
                cornsilk: [255, 248, 220],
                crimson: [220, 20, 60],
                cyan: [0, 255, 255],
                darkblue: [0, 0, 139],
                darkcyan: [0, 139, 139],
                darkgoldenrod: [184, 134, 11],
                darkgray: [169, 169, 169],
                darkgreen: [0, 100, 0],
                darkgrey: [169, 169, 169],
                darkkhaki: [189, 183, 107],
                darkmagenta: [139, 0, 139],
                darkolivegreen: [85, 107, 47],
                darkorange: [255, 140, 0],
                darkorchid: [153, 50, 204],
                darkred: [139, 0, 0],
                darksalmon: [233, 150, 122],
                darkseagreen: [143, 188, 143],
                darkslateblue: [72, 61, 139],
                darkslategray: [47, 79, 79],
                darkslategrey: [47, 79, 79],
                darkturquoise: [0, 206, 209],
                darkviolet: [148, 0, 211],
                deeppink: [255, 20, 147],
                deepskyblue: [0, 191, 255],
                dimgray: [105, 105, 105],
                dimgrey: [105, 105, 105],
                dodgerblue: [30, 144, 255],
                firebrick: [178, 34, 34],
                floralwhite: [255, 250, 240],
                forestgreen: [34, 139, 34],
                fuchsia: [255, 0, 255],
                gainsboro: [220, 220, 220],
                ghostwhite: [248, 248, 255],
                gold: [255, 215, 0],
                goldenrod: [218, 165, 32],
                gray: [128, 128, 128],
                grey: [128, 128, 128],
                green: [0, 128, 0],
                greenyellow: [173, 255, 47],
                honeydew: [240, 255, 240],
                hotpink: [255, 105, 180],
                indianred: [205, 92, 92],
                indigo: [75, 0, 130],
                ivory: [255, 255, 240],
                khaki: [240, 230, 140],
                lavender: [230, 230, 250],
                lavenderblush: [255, 240, 245],
                lawngreen: [124, 252, 0],
                lemonchiffon: [255, 250, 205],
                lightblue: [173, 216, 230],
                lightcoral: [240, 128, 128],
                lightcyan: [224, 255, 255],
                lightgoldenrodyellow: [250, 250, 210],
                lightgray: [211, 211, 211],
                lightgreen: [144, 238, 144],
                lightgrey: [211, 211, 211],
                lightpink: [255, 182, 193],
                lightsalmon: [255, 160, 122],
                lightseagreen: [32, 178, 170],
                lightskyblue: [135, 206, 250],
                lightslategray: [119, 136, 153],
                lightslategrey: [119, 136, 153],
                lightsteelblue: [176, 196, 222],
                lightyellow: [255, 255, 224],
                lime: [0, 255, 0],
                limegreen: [50, 205, 50],
                linen: [250, 240, 230],
                magenta: [255, 0, 255],
                maroon: [128, 0, 0],
                mediumaquamarine: [102, 205, 170],
                mediumblue: [0, 0, 205],
                mediumorchid: [186, 85, 211],
                mediumpurple: [147, 112, 219],
                mediumseagreen: [60, 179, 113],
                mediumslateblue: [123, 104, 238],
                mediumspringgreen: [0, 250, 154],
                mediumturquoise: [72, 209, 204],
                mediumvioletred: [199, 21, 133],
                midnightblue: [25, 25, 112],
                mintcream: [245, 255, 250],
                mistyrose: [255, 228, 225],
                moccasin: [255, 228, 181],
                navajowhite: [255, 222, 173],
                navy: [0, 0, 128],
                oldlace: [253, 245, 230],
                olive: [128, 128, 0],
                olivedrab: [107, 142, 35],
                orange: [255, 165, 0],
                orangered: [255, 69, 0],
                orchid: [218, 112, 214],
                palegoldenrod: [238, 232, 170],
                palegreen: [152, 251, 152],
                paleturquoise: [175, 238, 238],
                palevioletred: [219, 112, 147],
                papayawhip: [255, 239, 213],
                peachpuff: [255, 218, 185],
                peru: [205, 133, 63],
                pink: [255, 192, 203],
                plum: [221, 160, 221],
                powderblue: [176, 224, 230],
                purple: [128, 0, 128],
                red: [255, 0, 0],
                rosybrown: [188, 143, 143],
                royalblue: [65, 105, 225],
                saddlebrown: [139, 69, 19],
                salmon: [250, 128, 114],
                sandybrown: [244, 164, 96],
                seagreen: [46, 139, 87],
                seashell: [255, 245, 238],
                sienna: [160, 82, 45],
                silver: [192, 192, 192],
                skyblue: [135, 206, 235],
                slateblue: [106, 90, 205],
                slategray: [112, 128, 144],
                slategrey: [112, 128, 144],
                snow: [255, 250, 250],
                springgreen: [0, 255, 127],
                steelblue: [70, 130, 180],
                tan: [210, 180, 140],
                teal: [0, 128, 128],
                thistle: [216, 191, 216],
                tomato: [255, 99, 71],
                turquoise: [64, 224, 208],
                violet: [238, 130, 238],
                wheat: [245, 222, 179],
                white: [255, 255, 255],
                whitesmoke: [245, 245, 245],
                yellow: [255, 255, 0],
                yellowgreen: [154, 205, 50],
              });
          },
          { '../gradient': 7 },
        ],
        14: [
          function (t, e, r) {
            var n;
            (n = t('../font')),
              (e.localExports = {
                initFonts: function () {
                  return (
                    (this._fontFamilies = {}),
                    (this._fontCount = 0),
                    (this._fontSize = 12),
                    (this._font = null),
                    (this._registeredFonts = {}),
                    this.font('Helvetica')
                  );
                },
                font: function (t, e, r) {
                  var i, o, a, s;
                  return (
                    'number' == typeof e && ((r = e), (e = null)),
                    'string' == typeof t && this._registeredFonts[t]
                      ? ((i = t),
                        (t = (s = this._registeredFonts[t]).src),
                        (e = s.family))
                      : 'string' != typeof (i = e || t) && (i = null),
                    null != r && this.fontSize(r),
                    (o = this._fontFamilies[i])
                      ? ((this._font = o), this)
                      : ((a = 'F' + ++this._fontCount),
                        (this._font = n.open(this, t, e, a)),
                        (o = this._fontFamilies[this._font.name])
                          ? ((this._font = o), this)
                          : (i && (this._fontFamilies[i] = this._font),
                            (this._fontFamilies[this._font.name] = this._font),
                            this))
                  );
                },
                fontSize: function (t) {
                  return (this._fontSize = t), this;
                },
                currentLineHeight: function (t) {
                  return (
                    null == t && (t = !1),
                    this._font.lineHeight(this._fontSize, t)
                  );
                },
                currentFontAscender: function () {
                  return this._font.getAscender(this._fontSize);
                },
                currentFontBBox: function () {
                  return this._font.getBBox(this._fontSize);
                },
                currentFontSize: function () {
                  return this._fontSize;
                },
                registerFont: function (t, e, r) {
                  return (
                    (this._registeredFonts[t] = {
                      src: e,
                      family: r,
                    }),
                    this
                  );
                },
              });
          },
          { '../font': 3 },
        ],
        15: [
          function (t, e, r) {
            (function (r) {
              var n;
              (n = t('../image')),
                (e.localExports = {
                  initImages: function () {
                    return (this._imageRegistry = {}), (this._imageCount = 0);
                  },
                  image: function (t, e, i, o) {
                    var a, s, u, l, c, h, f, d, p, g, _, v, m;
                    null == o && (o = {}),
                      'object' == typeof e && ((o = e), (e = null)),
                      (e = null != (_ = null != e ? e : o.x) ? _ : this.x),
                      (i = null != (v = null != i ? i : o.y) ? v : this.y),
                      r.isBuffer(t) || (c = this._imageRegistry[t]),
                      c ||
                        ((c = n.open(t, 'I' + ++this._imageCount)).embed(this),
                        r.isBuffer(t) || (this._imageRegistry[t] = c)),
                      null == (p = this.page.xobjects)[(g = c.label)] &&
                        (p[g] = c.obj);
                    var y = 0.75 * c.width,
                      b = 0.75 * c.height;
                    return (
                      (f = o.width || y),
                      (u = o.height || b),
                      o.width && !o.height
                        ? ((f = y * (d = f / y)), (u = b * d))
                        : o.height && !o.width
                        ? ((f = y * (l = u / b)), (u = b * l))
                        : o.scale
                        ? ((f = y * o.scale), (u = b * o.scale))
                        : o.fit &&
                          ((h = y / b) > (s = (m = o.fit)[0]) / (a = m[1])
                            ? ((f = s), (u = s / h))
                            : ((u = a), (f = a * h)),
                          'center' === o.align
                            ? (e = e + s / 2 - f / 2)
                            : 'right' === o.align && (e = e + s - f),
                          'center' === o.valign
                            ? (i = i + a / 2 - u / 2)
                            : 'bottom' === o.valign && (i = i + a - u)),
                      this.y === i && (this.y += u),
                      this.save(),
                      this.transform(f, 0, 0, -u, e, i + u),
                      this.addContent('/' + c.label + ' Do'),
                      this.restore(),
                      this
                    );
                  },
                });
            }).call(this, {
              isBuffer: t('../../node_modules/is-buffer/index.js'),
            });
          },
          {
            '../../node_modules/is-buffer/index.js': 168,
            '../image': 8,
          },
        ],
        16: [
          function (t, e, r) {
            var n;
            (n = t('../line_wrapper')),
              (e.localExports = {
                initText: function () {
                  return (this.x = 0), (this.y = 0), (this._lineGap = 0);
                },
                currentLineGap: function () {
                  return this._lineGap;
                },
                lineGap: function (t) {
                  return (this._lineGap = t), this;
                },
                moveDown: function (t) {
                  return (
                    null == t && (t = 1),
                    (this.y += this.currentLineHeight(!0) * t + this._lineGap),
                    this
                  );
                },
                moveUp: function (t) {
                  return (
                    null == t && (t = 1),
                    (this.y -= this.currentLineHeight(!0) * t + this._lineGap),
                    this
                  );
                },
                _text: function (t, e, r, i, o) {
                  var a, s, u, l;
                  if (
                    ((i = this._initOptions(e, r, i)),
                    (t = '' + t),
                    i.wordSpacing && (t = t.replace(/\s{2,}/g, ' ')),
                    i.width)
                  )
                    (a = this._wrapper) || (a = new n(this, i)).on('line', o),
                      (this._wrapper = i.continued ? a : null),
                      (this._textOptions = i.continued ? i : null),
                      a.wrap(t, i);
                  else
                    for (s = 0, u = (l = t.split('\n')).length; s < u; s++)
                      o(l[s], i);
                  return this;
                },
                text: function (t, e, r, n) {
                  return this._text(t, e, r, n, this._line.bind(this));
                },
                widthOfString: function (t, e) {
                  return (
                    null == e && (e = {}),
                    this._font.widthOfString(t, this._fontSize, e.features) +
                      (e.characterSpacing || 0) * (t.length - 1)
                  );
                },
                heightOfString: function (t, e) {
                  var r, n, i, o;
                  return (
                    null == e && (e = {}),
                    (i = this.x),
                    (o = this.y),
                    (e = this._initOptions(e)),
                    (e.height = 1 / 0),
                    (n = e.lineGap || this._lineGap || 0),
                    this._text(
                      t,
                      this.x,
                      this.y,
                      e,
                      (function (t) {
                        return function (e, r) {
                          return (t.y += t.currentLineHeight(!0) + n);
                        };
                      })(this)
                    ),
                    (r = this.y - o),
                    (this.x = i),
                    (this.y = o),
                    r
                  );
                },
                textAndMeasure: function (t, e, r, n, i) {
                  (n = n || {}), null == e && ((e = this.x), (r = this.y));
                  var o = this,
                    a = this.x,
                    s = this.y,
                    u = {
                      width: 0,
                      height: 0,
                      charCount: 0,
                    },
                    l = n.lineGap || this._lineGap || 0,
                    c = n.columnGap || 18,
                    h = null == e ? this.x : e,
                    f = [],
                    d = 0;
                  return (
                    i && null == n.height && (n.height = 1 / 0),
                    this._text(t, e, r, n, function (r, n, a) {
                      (u.charCount += r.length),
                        o.x === e && (u.height += o.currentLineHeight(!0) + l),
                        n.textWidth &&
                          (o.x > h && ((h = o.x), (f[d++] = n.lineWidth)),
                          (f[d] = Math.max(f[d] || 0, n.textWidth))),
                        i
                          ? a
                            ? (o.y += o.currentLineHeight(!0) + l)
                            : (o.x += o.widthOfString(t))
                          : o._line.apply(o, arguments);
                    }),
                    f.length
                      ? (f.forEach(function (t) {
                          u.width += t + c;
                        }),
                        (u.width -= c))
                      : (u.width = this.x - a),
                    !1 === n.includeLastLineExternalLeading &&
                      (u.height -=
                        this.currentLineHeight(!0) -
                        this.currentLineHeight(!1)),
                    (u.height = Math.max(0, u.height)),
                    i && ((this.x = a), (this.y = s)),
                    u
                  );
                },
                list: function (t, e, r, i, o) {
                  var a, s, u, l, c, h, f, d;
                  return (
                    (i = this._initOptions(e, r, i)),
                    (d = Math.round(
                      ((this._font.ascender / 1e3) * this._fontSize) / 3
                    )),
                    (u = i.textIndent || 5 * d),
                    (l = i.bulletIndent || 8 * d),
                    (h = 1),
                    (c = []),
                    (f = []),
                    (a = function (t) {
                      var e, r, n, i, o;
                      for (o = [], e = n = 0, i = t.length; n < i; e = ++n)
                        (r = t[e]),
                          Array.isArray(r)
                            ? (h++, a(r), o.push(h--))
                            : (c.push(r), o.push(f.push(h)));
                      return o;
                    })(t),
                    (o = new n(this, i)).on('line', this._line.bind(this)),
                    (h = 1),
                    (s = 0),
                    o.on(
                      'firstLine',
                      (function (t) {
                        return function () {
                          var e, r;
                          return (
                            (r = f[s++]) !== h &&
                              ((e = l * (r - h)),
                              (t.x += e),
                              (o.lineWidth -= e),
                              (h = r)),
                            t.circle(t.x - u + d, t.y + d + d / 2, d),
                            t.fill()
                          );
                        };
                      })(this)
                    ),
                    o.on(
                      'sectionStart',
                      (function (t) {
                        return function () {
                          var e;
                          return (
                            (e = u + l * (h - 1)),
                            (t.x += e),
                            (o.lineWidth -= e)
                          );
                        };
                      })(this)
                    ),
                    o.on(
                      'sectionEnd',
                      (function (t) {
                        return function () {
                          var e;
                          return (
                            (e = u + l * (h - 1)),
                            (t.x -= e),
                            (o.lineWidth += e)
                          );
                        };
                      })(this)
                    ),
                    o.wrap(c.join('\n'), i),
                    this
                  );
                },
                _initOptions: function (t, e, r) {
                  var n, i, o, a;
                  if (
                    (null == t && (t = {}),
                    null == r && (r = {}),
                    'object' == typeof t && ((r = t), (t = null)),
                    (r = (function () {
                      var t, e, n;
                      e = {};
                      for (t in r) (n = r[t]), (e[t] = n);
                      return e;
                    })()),
                    this._textOptions)
                  ) {
                    a = this._textOptions;
                    for (n in a)
                      (o = a[n]),
                        'continued' !== n && null == r[n] && (r[n] = o);
                  }
                  return (
                    null != t && (this.x = t),
                    null != e && (this.y = e),
                    !1 !== r.lineBreak &&
                      ((i = this.page.margins),
                      null == r.width &&
                        ((r.width = this.page.width - this.x - i.right),
                        (r.width = Math.max(r.width, 0)))),
                    r.columns || (r.columns = 0),
                    null == r.columnGap && (r.columnGap = 18),
                    r
                  );
                },
                _line: function (t, e, r) {
                  var n;
                  return (
                    null == e && (e = {}),
                    this._fragment(t, this.x, this.y, e),
                    (n = e.lineGap || this._lineGap || 0),
                    r
                      ? (this.y += this.currentLineHeight(!0) + n)
                      : (this.x += this.widthOfString(t))
                  );
                },
                _fragment: function (t, e, r, n) {
                  var i,
                    o,
                    a,
                    s,
                    u,
                    l,
                    c,
                    h,
                    f,
                    d,
                    p,
                    g,
                    _,
                    v,
                    m,
                    y,
                    b,
                    w,
                    x,
                    S,
                    C,
                    k,
                    E,
                    A,
                    P,
                    j,
                    I,
                    T,
                    B,
                    L,
                    O,
                    N;
                  if (0 !== (t = ('' + t).replace(/\n/g, '')).length) {
                    if (
                      ((o = n.align || 'left'),
                      (E = n.wordSpacing || 0),
                      (a = n.characterSpacing || 0),
                      n.width)
                    )
                      switch (o) {
                        case 'right':
                          (C = this.widthOfString(t.replace(/\s+$/, ''), n)),
                            (e += n.lineWidth - C);
                          break;
                        case 'center':
                          e += n.lineWidth / 2 - n.textWidth / 2;
                          break;
                        case 'justify':
                          (A = t.trim().split(/\s+/)),
                            (C = this.widthOfString(t.replace(/\s+/g, ''), n)),
                            (S = this.widthOfString(' ') + a),
                            (E = Math.max(
                              0,
                              (n.lineWidth - C) / Math.max(1, A.length - 1) - S
                            ));
                      }
                    if (
                      ((w =
                        n.textWidth +
                        E * (n.wordCount - 1) +
                        a * (t.length - 1)),
                      n.link &&
                        this.link(e, r, w, this.currentLineHeight(), n.link),
                      (n.underline || n.strike) &&
                        (this.save(),
                        n.stroke ||
                          this.strokeColor.apply(this, this._fillColor),
                        (g =
                          this._fontSize < 10
                            ? 0.5
                            : Math.floor(this._fontSize / 10)),
                        this.lineWidth(g),
                        (u = n.underline ? 1 : 2),
                        (_ = r + this.currentLineHeight() / u),
                        n.underline && (_ -= g),
                        this.moveTo(e, _),
                        this.lineTo(e + w, _),
                        this.stroke(),
                        this.restore()),
                      this.save(),
                      this.transform(1, 0, 0, -1, 0, this.page.height),
                      (r =
                        this.page.height -
                        r -
                        (this._font.ascender / 1e3) * this._fontSize),
                      null == (P = this.page.fonts)[(L = this._font.id)] &&
                        (P[L] = this._font.ref()),
                      this.addContent('BT'),
                      this.addContent('1 0 0 1 ' + e + ' ' + r + ' Tm'),
                      this.addContent(
                        '/' + this._font.id + ' ' + this._fontSize + ' Tf'
                      ),
                      (v = n.fill && n.stroke ? 2 : n.stroke ? 1 : 0) &&
                        this.addContent(v + ' Tr'),
                      a && this.addContent(a + ' Tc'),
                      E)
                    )
                      for (
                        A = t.trim().split(/\s+/),
                          E += this.widthOfString(' ') + a,
                          E *= 1e3 / this._fontSize,
                          l = [],
                          y = [],
                          j = 0,
                          T = A.length;
                        j < T;
                        j++
                      )
                        (k = A[j]),
                          (c = (O = this._font.encode(k, n.features))[0]),
                          (b = O[1]),
                          l.push.apply(l, c),
                          y.push.apply(y, b),
                          (y[y.length - 1].xAdvance += E);
                    else
                      (N = this._font.encode(t, n.features)),
                        (l = N[0]),
                        (y = N[1]);
                    for (
                      x = this._fontSize / 1e3,
                        s = [],
                        p = 0,
                        f = !1,
                        i = function (t) {
                          var e, r;
                          return (
                            p < t &&
                              ((r = l.slice(p, t).join('')),
                              (e = y[t - 1].xAdvance - y[t - 1].advanceWidth),
                              s.push('<' + r + '> ' + -e)),
                            (p = t)
                          );
                        },
                        h = (function (t) {
                          return function (e) {
                            if ((i(e), s.length > 0))
                              return (
                                t.addContent('[' + s.join(' ') + '] TJ'),
                                (s.length = 0)
                              );
                          };
                        })(this),
                        d = I = 0,
                        B = y.length;
                      I < B;
                      d = ++I
                    )
                      (m = y[d]).xOffset || m.yOffset
                        ? (h(d),
                          this.addContent(
                            '1 0 0 1 ' +
                              (e + m.xOffset * x) +
                              ' ' +
                              (r + m.yOffset * x) +
                              ' Tm'
                          ),
                          h(d + 1),
                          (f = !0))
                        : (f &&
                            (this.addContent('1 0 0 1 ' + e + ' ' + r + ' Tm'),
                            (f = !1)),
                          m.xAdvance - m.advanceWidth != 0 && i(d + 1)),
                        (e += m.xAdvance * x);
                    return h(d), this.addContent('ET'), this.restore();
                  }
                },
              });
          },
          { '../line_wrapper': 11 },
        ],
        17: [
          function (t, e, r) {
            var n,
              i,
              o = [].slice;
            (i = t('../path')),
              (n = ((Math.sqrt(2) - 1) / 3) * 4),
              (e.localExports = {
                initVector: function () {
                  return (
                    (this._ctm = [1, 0, 0, 1, 0, 0]), (this._ctmStack = [])
                  );
                },
                save: function () {
                  return (
                    this._ctmStack.push(this._ctm.slice()), this.addContent('q')
                  );
                },
                restore: function () {
                  return (
                    (this._ctm = this._ctmStack.pop() || [1, 0, 0, 1, 0, 0]),
                    this.addContent('Q')
                  );
                },
                closePath: function () {
                  return this.addContent('h');
                },
                lineWidth: function (t) {
                  return this.addContent(t + ' w');
                },
                _CAP_STYLES: { BUTT: 0, ROUND: 1, SQUARE: 2 },
                lineCap: function (t) {
                  return (
                    'string' == typeof t &&
                      (t = this._CAP_STYLES[t.toUpperCase()]),
                    this.addContent(t + ' J')
                  );
                },
                _JOIN_STYLES: { MITER: 0, ROUND: 1, BEVEL: 2 },
                lineJoin: function (t) {
                  return (
                    'string' == typeof t &&
                      (t = this._JOIN_STYLES[t.toUpperCase()]),
                    this.addContent(t + ' j')
                  );
                },
                miterLimit: function (t) {
                  return this.addContent(t + ' M');
                },
                dash: function (t, e) {
                  var r, n, i;
                  return (
                    null == e && (e = {}),
                    null == t
                      ? this
                      : ((n = null != (i = e.space) ? i : t),
                        (r = e.phase || 0),
                        this.addContent('[' + t + ' ' + n + '] ' + r + ' d'))
                  );
                },
                undash: function () {
                  return this.addContent('[] 0 d');
                },
                moveTo: function (t, e) {
                  return this.addContent(t + ' ' + e + ' m');
                },
                lineTo: function (t, e) {
                  return this.addContent(t + ' ' + e + ' l');
                },
                bezierCurveTo: function (t, e, r, n, i, o) {
                  return this.addContent(
                    t + ' ' + e + ' ' + r + ' ' + n + ' ' + i + ' ' + o + ' c'
                  );
                },
                quadraticCurveTo: function (t, e, r, n) {
                  return this.addContent(
                    t + ' ' + e + ' ' + r + ' ' + n + ' v'
                  );
                },
                rect: function (t, e, r, n) {
                  return this.addContent(
                    t + ' ' + e + ' ' + r + ' ' + n + ' re'
                  );
                },
                roundedRect: function (t, e, r, n, i) {
                  return (
                    null == i && (i = 0),
                    this.moveTo(t + i, e),
                    this.lineTo(t + r - i, e),
                    this.quadraticCurveTo(t + r, e, t + r, e + i),
                    this.lineTo(t + r, e + n - i),
                    this.quadraticCurveTo(t + r, e + n, t + r - i, e + n),
                    this.lineTo(t + i, e + n),
                    this.quadraticCurveTo(t, e + n, t, e + n - i),
                    this.lineTo(t, e + i),
                    this.quadraticCurveTo(t, e, t + i, e)
                  );
                },
                ellipse: function (t, e, r, i) {
                  var o, a, s, u, l, c;
                  return (
                    null == i && (i = r),
                    (t -= r),
                    (e -= i),
                    (o = r * n),
                    (a = i * n),
                    (s = t + 2 * r),
                    (l = e + 2 * i),
                    (u = t + r),
                    (c = e + i),
                    this.moveTo(t, c),
                    this.bezierCurveTo(t, c - a, u - o, e, u, e),
                    this.bezierCurveTo(u + o, e, s, c - a, s, c),
                    this.bezierCurveTo(s, c + a, u + o, l, u, l),
                    this.bezierCurveTo(u - o, l, t, c + a, t, c),
                    this.closePath()
                  );
                },
                circle: function (t, e, r) {
                  return this.ellipse(t, e, r);
                },
                polygon: function () {
                  var t, e, r, n;
                  for (
                    e = 1 <= arguments.length ? o.call(arguments, 0) : [],
                      this.moveTo.apply(this, e.shift()),
                      r = 0,
                      n = e.length;
                    r < n;
                    r++
                  )
                    (t = e[r]), this.lineTo.apply(this, t);
                  return this.closePath();
                },
                path: function (t) {
                  return i.apply(this, t), this;
                },
                _windingRule: function (t) {
                  return /even-?odd/.test(t) ? '*' : '';
                },
                fill: function (t, e) {
                  return (
                    /(even-?odd)|(non-?zero)/.test(t) && ((e = t), (t = null)),
                    t && this.fillColor(t),
                    this.addContent('f' + this._windingRule(e))
                  );
                },
                stroke: function (t) {
                  return t && this.strokeColor(t), this.addContent('S');
                },
                fillAndStroke: function (t, e, r) {
                  var n;
                  return (
                    null == e && (e = t),
                    (n = /(even-?odd)|(non-?zero)/).test(t) &&
                      ((r = t), (t = null)),
                    n.test(e) && ((r = e), (e = t)),
                    t && (this.fillColor(t), this.strokeColor(e)),
                    this.addContent('B' + this._windingRule(r))
                  );
                },
                clip: function (t) {
                  return this.addContent('W' + this._windingRule(t) + ' n');
                },
                transform: function (t, e, r, n, i, o) {
                  var a, s, u, l, c, h, f, d, p;
                  return (
                    (a = this._ctm),
                    (s = a[0]),
                    (u = a[1]),
                    (l = a[2]),
                    (c = a[3]),
                    (h = a[4]),
                    (f = a[5]),
                    (a[0] = s * t + l * e),
                    (a[1] = u * t + c * e),
                    (a[2] = s * r + l * n),
                    (a[3] = u * r + c * n),
                    (a[4] = s * i + l * o + h),
                    (a[5] = u * i + c * o + f),
                    (p = (function () {
                      var a, s, u, l;
                      for (
                        l = [], a = 0, s = (u = [t, e, r, n, i, o]).length;
                        a < s;
                        a++
                      )
                        (d = u[a]), l.push(+d.toFixed(5));
                      return l;
                    })().join(' ')),
                    this.addContent(p + ' cm')
                  );
                },
                translate: function (t, e) {
                  return this.transform(1, 0, 0, 1, t, e);
                },
                rotate: function (t, e) {
                  var r, n, i, o, a, s, u;
                  return (
                    null == e && (e = {}),
                    (n = (t * Math.PI) / 180),
                    (r = Math.cos(n)),
                    (i = Math.sin(n)),
                    (o = a = 0),
                    null != e.origin &&
                      ((s = (o = (u = e.origin)[0]) * i + (a = u[1]) * r),
                      (o -= o * r - a * i),
                      (a -= s)),
                    this.transform(r, i, -i, r, o, a)
                  );
                },
                scale: function (t, e, r) {
                  var n, i, o;
                  return (
                    null == e && (e = t),
                    null == r && (r = {}),
                    2 === arguments.length && (r = e = t),
                    (n = i = 0),
                    null != r.origin &&
                      ((n = (o = r.origin)[0]),
                      (i = o[1]),
                      (n -= t * n),
                      (i -= e * i)),
                    this.transform(t, 0, 0, e, n, i)
                  );
                },
              });
          },
          { '../path': 20 },
        ],
        18: [
          function (t, e, r) {
            (function (r) {
              var n, i;
              (n = (function () {
                function t() {}
                var e, n, o, a;
                return (
                  (o = function (t, e) {
                    return (Array(e + 1).join('0') + t).slice(-e);
                  }),
                  (n = /[\n\r\t\b\f\(\)\\]/g),
                  (e = {
                    '\n': '\\n',
                    '\r': '\\r',
                    '\t': '\\t',
                    '\b': '\\b',
                    '\f': '\\f',
                    '\\': '\\\\',
                    '(': '\\(',
                    ')': '\\)',
                  }),
                  (a = function (t) {
                    var e, r, n, i, o;
                    if (1 & (n = t.length))
                      throw new Error('Buffer length must be even');
                    for (r = i = 0, o = n - 1; i < o; r = i += 2)
                      (e = t[r]), (t[r] = t[r + 1]), (t[r + 1] = e);
                    return t;
                  }),
                  (t.convert = function (s) {
                    var u, l, c, h, f, d, p, g, _;
                    if ('string' == typeof s) return '/' + s;
                    if (s instanceof String) {
                      for (
                        c = !1,
                          l = g = 0,
                          _ = (d = s.replace(n, function (t) {
                            return e[t];
                          })).length;
                        g < _;
                        l = g += 1
                      )
                        if (d.charCodeAt(l) > 127) {
                          c = !0;
                          break;
                        }
                      return (
                        c &&
                          (d = a(new r('\ufeff' + d, 'utf16le')).toString(
                            'binary'
                          )),
                        '(' + d + ')'
                      );
                    }
                    if (r.isBuffer(s)) return '<' + s.toString('hex') + '>';
                    if (s instanceof i) return s.toString();
                    if (s instanceof Date)
                      return (
                        '(D:' +
                        o(s.getUTCFullYear(), 4) +
                        o(s.getUTCMonth() + 1, 2) +
                        o(s.getUTCDate(), 2) +
                        o(s.getUTCHours(), 2) +
                        o(s.getUTCMinutes(), 2) +
                        o(s.getUTCSeconds(), 2) +
                        'Z)'
                      );
                    if (Array.isArray(s))
                      return (
                        '[' +
                        (function () {
                          var e, r, n;
                          for (n = [], e = 0, r = s.length; e < r; e++)
                            (u = s[e]), n.push(t.convert(u));
                          return n;
                        })().join(' ') +
                        ']'
                      );
                    if ('[object Object]' === {}.toString.call(s)) {
                      f = ['<<'];
                      for (h in s)
                        (p = s[h]), f.push('/' + h + ' ' + t.convert(p));
                      return f.push('>>'), f.join('\n');
                    }
                    return '' + s;
                  }),
                  t
                );
              })()),
                (e.localExports = n),
                (i = t('./reference'));
            }).call(this, t('buffer').Buffer);
          },
          { './reference': 21, buffer: 60 },
        ],
        19: [
          function (t, e, r) {
            var n;
            (n = (function () {
              function t(t, n) {
                var i;
                (this.document = t),
                  null == n && (n = {}),
                  (this.size = n.size || 'letter'),
                  (this.layout = n.layout || 'portrait'),
                  'number' == typeof n.margin
                    ? (this.margins = {
                        top: n.margin,
                        left: n.margin,
                        bottom: n.margin,
                        right: n.margin,
                      })
                    : ((this.margins = n.margins || e),
                      (this.margins = {
                        top: this.margins.top,
                        left: this.margins.left,
                        bottom: this.margins.bottom,
                        right: this.margins.right,
                      })),
                  (i = Array.isArray(this.size)
                    ? this.size
                    : r[this.size.toUpperCase()]),
                  (this.width = i['portrait' === this.layout ? 0 : 1]),
                  (this.height = i['portrait' === this.layout ? 1 : 0]),
                  (this.content = this.document.ref()),
                  (this.resources = this.document.ref({
                    ProcSet: ['PDF', 'Text', 'ImageB', 'ImageC', 'ImageI'],
                  })),
                  Object.defineProperties(this, {
                    fonts: {
                      get: (function (t) {
                        return function () {
                          var e;
                          return null != (e = t.resources.data).Font
                            ? e.Font
                            : (e.Font = {});
                        };
                      })(this),
                    },
                    xobjects: {
                      get: (function (t) {
                        return function () {
                          var e;
                          return null != (e = t.resources.data).XObject
                            ? e.XObject
                            : (e.XObject = {});
                        };
                      })(this),
                    },
                    ext_gstates: {
                      get: (function (t) {
                        return function () {
                          var e;
                          return null != (e = t.resources.data).ExtGState
                            ? e.ExtGState
                            : (e.ExtGState = {});
                        };
                      })(this),
                    },
                    patterns: {
                      get: (function (t) {
                        return function () {
                          var e;
                          return null != (e = t.resources.data).Pattern
                            ? e.Pattern
                            : (e.Pattern = {});
                        };
                      })(this),
                    },
                    annotations: {
                      get: (function (t) {
                        return function () {
                          var e;
                          return null != (e = t.dictionary.data).Annots
                            ? e.Annots
                            : (e.Annots = []);
                        };
                      })(this),
                    },
                  }),
                  (this.dictionary = this.document.ref({
                    Type: 'Page',
                    Parent: this.document._root.data.Pages,
                    MediaBox: [0, 0, this.width, this.height],
                    Contents: this.content,
                    Resources: this.resources,
                  }));
              }
              var e, r;
              return (
                (t.prototype.maxY = function () {
                  return this.height - this.margins.bottom;
                }),
                (t.prototype.write = function (t) {
                  return this.content.write(t);
                }),
                (t.prototype.end = function () {
                  return (
                    this.dictionary.end(),
                    this.resources.end(),
                    this.content.end()
                  );
                }),
                (e = {
                  top: 72,
                  left: 72,
                  bottom: 72,
                  right: 72,
                }),
                (r = {
                  '4A0': [4767.87, 6740.79],
                  '2A0': [3370.39, 4767.87],
                  A0: [2383.94, 3370.39],
                  A1: [1683.78, 2383.94],
                  A2: [1190.55, 1683.78],
                  A3: [841.89, 1190.55],
                  A4: [595.28, 841.89],
                  A5: [419.53, 595.28],
                  A6: [297.64, 419.53],
                  A7: [209.76, 297.64],
                  A8: [147.4, 209.76],
                  A9: [104.88, 147.4],
                  A10: [73.7, 104.88],
                  B0: [2834.65, 4008.19],
                  B1: [2004.09, 2834.65],
                  B2: [1417.32, 2004.09],
                  B3: [1000.63, 1417.32],
                  B4: [708.66, 1000.63],
                  B5: [498.9, 708.66],
                  B6: [354.33, 498.9],
                  B7: [249.45, 354.33],
                  B8: [175.75, 249.45],
                  B9: [124.72, 175.75],
                  B10: [87.87, 124.72],
                  C0: [2599.37, 3676.54],
                  C1: [1836.85, 2599.37],
                  C2: [1298.27, 1836.85],
                  C3: [918.43, 1298.27],
                  C4: [649.13, 918.43],
                  C5: [459.21, 649.13],
                  C6: [323.15, 459.21],
                  C7: [229.61, 323.15],
                  C8: [161.57, 229.61],
                  C9: [113.39, 161.57],
                  C10: [79.37, 113.39],
                  RA0: [2437.8, 3458.27],
                  RA1: [1729.13, 2437.8],
                  RA2: [1218.9, 1729.13],
                  RA3: [864.57, 1218.9],
                  RA4: [609.45, 864.57],
                  SRA0: [2551.18, 3628.35],
                  SRA1: [1814.17, 2551.18],
                  SRA2: [1275.59, 1814.17],
                  SRA3: [907.09, 1275.59],
                  SRA4: [637.8, 907.09],
                  EXECUTIVE: [521.86, 756],
                  FOLIO: [612, 936],
                  LEGAL: [612, 1008],
                  LETTER: [612, 792],
                  TABLOID: [792, 1224],
                }),
                t
              );
            })()),
              (e.localExports = n);
          },
          {},
        ],
        20: [
          function (t, e, r) {
            var n;
            (n = (function () {
              function t() {}
              var e, r, n, i, o, a, s, u, l, c, h, f, d, p;
              return (
                (t.apply = function (t, r) {
                  var n;
                  return (n = s(r)), e(n, t);
                }),
                (a = {
                  A: 7,
                  a: 7,
                  C: 6,
                  c: 6,
                  H: 1,
                  h: 1,
                  L: 2,
                  l: 2,
                  M: 2,
                  m: 2,
                  Q: 4,
                  q: 4,
                  S: 4,
                  s: 4,
                  T: 2,
                  t: 2,
                  V: 1,
                  v: 1,
                  Z: 0,
                  z: 0,
                }),
                (s = function (t) {
                  var e, r, n, i, o, s, u, l, c;
                  for (
                    u = [], e = [], i = '', o = !1, s = 0, l = 0, c = t.length;
                    l < c;
                    l++
                  )
                    if (((r = t[l]), null != a[r]))
                      (s = a[r]),
                        n &&
                          (i.length > 0 && (e[e.length] = +i),
                          (u[u.length] = {
                            cmd: n,
                            args: e,
                          }),
                          (e = []),
                          (i = ''),
                          (o = !1)),
                        (n = r);
                    else if (
                      ' ' === r ||
                      ',' === r ||
                      ('-' === r && i.length > 0 && 'e' !== i[i.length - 1]) ||
                      ('.' === r && o)
                    ) {
                      if (0 === i.length) continue;
                      e.length === s
                        ? ((u[u.length] = {
                            cmd: n,
                            args: e,
                          }),
                          (e = [+i]),
                          'M' === n && (n = 'L'),
                          'm' === n && (n = 'l'))
                        : (e[e.length] = +i),
                        (o = '.' === r),
                        (i = '-' === r || '.' === r ? r : '');
                    } else (i += r), '.' === r && (o = !0);
                  return (
                    i.length > 0 &&
                      (e.length === s
                        ? ((u[u.length] = {
                            cmd: n,
                            args: e,
                          }),
                          (e = [+i]),
                          'M' === n && (n = 'L'),
                          'm' === n && (n = 'l'))
                        : (e[e.length] = +i)),
                    (u[u.length] = { cmd: n, args: e }),
                    u
                  );
                }),
                (n = i = u = l = d = p = 0),
                (e = function (t, e) {
                  var r, o, a, s, h;
                  for (
                    n = i = u = l = d = p = 0, o = a = 0, s = t.length;
                    a < s;
                    o = ++a
                  )
                    (r = t[o]),
                      'function' == typeof c[(h = r.cmd)] && c[h](e, r.args);
                  return (n = i = u = l = 0);
                }),
                (c = {
                  M: function (t, e) {
                    return (
                      (n = e[0]),
                      (i = e[1]),
                      (u = l = null),
                      (d = n),
                      (p = i),
                      t.moveTo(n, i)
                    );
                  },
                  m: function (t, e) {
                    return (
                      (n += e[0]),
                      (i += e[1]),
                      (u = l = null),
                      (d = n),
                      (p = i),
                      t.moveTo(n, i)
                    );
                  },
                  C: function (t, e) {
                    return (
                      (n = e[4]),
                      (i = e[5]),
                      (u = e[2]),
                      (l = e[3]),
                      t.bezierCurveTo.apply(t, e)
                    );
                  },
                  c: function (t, e) {
                    return (
                      t.bezierCurveTo(
                        e[0] + n,
                        e[1] + i,
                        e[2] + n,
                        e[3] + i,
                        e[4] + n,
                        e[5] + i
                      ),
                      (u = n + e[2]),
                      (l = i + e[3]),
                      (n += e[4]),
                      (i += e[5])
                    );
                  },
                  S: function (t, e) {
                    return (
                      null === u && ((u = n), (l = i)),
                      t.bezierCurveTo(
                        n - (u - n),
                        i - (l - i),
                        e[0],
                        e[1],
                        e[2],
                        e[3]
                      ),
                      (u = e[0]),
                      (l = e[1]),
                      (n = e[2]),
                      (i = e[3])
                    );
                  },
                  s: function (t, e) {
                    return (
                      null === u && ((u = n), (l = i)),
                      t.bezierCurveTo(
                        n - (u - n),
                        i - (l - i),
                        n + e[0],
                        i + e[1],
                        n + e[2],
                        i + e[3]
                      ),
                      (u = n + e[0]),
                      (l = i + e[1]),
                      (n += e[2]),
                      (i += e[3])
                    );
                  },
                  Q: function (t, e) {
                    return (
                      (u = e[0]),
                      (l = e[1]),
                      (n = e[2]),
                      (i = e[3]),
                      t.quadraticCurveTo(e[0], e[1], n, i)
                    );
                  },
                  q: function (t, e) {
                    return (
                      t.quadraticCurveTo(
                        e[0] + n,
                        e[1] + i,
                        e[2] + n,
                        e[3] + i
                      ),
                      (u = n + e[0]),
                      (l = i + e[1]),
                      (n += e[2]),
                      (i += e[3])
                    );
                  },
                  T: function (t, e) {
                    return (
                      null === u
                        ? ((u = n), (l = i))
                        : ((u = n - (u - n)), (l = i - (l - i))),
                      t.quadraticCurveTo(u, l, e[0], e[1]),
                      (u = n - (u - n)),
                      (l = i - (l - i)),
                      (n = e[0]),
                      (i = e[1])
                    );
                  },
                  t: function (t, e) {
                    return (
                      null === u
                        ? ((u = n), (l = i))
                        : ((u = n - (u - n)), (l = i - (l - i))),
                      t.quadraticCurveTo(u, l, n + e[0], i + e[1]),
                      (n += e[0]),
                      (i += e[1])
                    );
                  },
                  A: function (t, e) {
                    return f(t, n, i, e), (n = e[5]), (i = e[6]);
                  },
                  a: function (t, e) {
                    return (
                      (e[5] += n),
                      (e[6] += i),
                      f(t, n, i, e),
                      (n = e[5]),
                      (i = e[6])
                    );
                  },
                  L: function (t, e) {
                    return (
                      (n = e[0]), (i = e[1]), (u = l = null), t.lineTo(n, i)
                    );
                  },
                  l: function (t, e) {
                    return (
                      (n += e[0]), (i += e[1]), (u = l = null), t.lineTo(n, i)
                    );
                  },
                  H: function (t, e) {
                    return (n = e[0]), (u = l = null), t.lineTo(n, i);
                  },
                  h: function (t, e) {
                    return (n += e[0]), (u = l = null), t.lineTo(n, i);
                  },
                  V: function (t, e) {
                    return (i = e[0]), (u = l = null), t.lineTo(n, i);
                  },
                  v: function (t, e) {
                    return (i += e[0]), (u = l = null), t.lineTo(n, i);
                  },
                  Z: function (t) {
                    return t.closePath(), (n = d), (i = p);
                  },
                  z: function (t) {
                    return t.closePath(), (n = d), (i = p);
                  },
                }),
                (f = function (t, e, n, i) {
                  var o, a, s, u, l, c, f, d, p, g, _, v, m;
                  for (
                    c = i[0],
                      f = i[1],
                      l = i[2],
                      u = i[3],
                      g = i[4],
                      a = i[5],
                      s = i[6],
                      m = [],
                      _ = 0,
                      v = (p = r(a, s, c, f, u, g, l, e, n)).length;
                    _ < v;
                    _++
                  )
                    (d = p[_]),
                      (o = h.apply(null, d)),
                      m.push(t.bezierCurveTo.apply(t, o));
                  return m;
                }),
                (r = function (t, e, r, n, i, o, a, s, c) {
                  var h,
                    f,
                    d,
                    p,
                    g,
                    _,
                    v,
                    m,
                    y,
                    b,
                    w,
                    x,
                    S,
                    C,
                    k,
                    E,
                    A,
                    P,
                    j,
                    I,
                    T,
                    B,
                    L,
                    O;
                  for (
                    S = a * (Math.PI / 180),
                      x = Math.sin(S),
                      g = Math.cos(S),
                      r = Math.abs(r),
                      n = Math.abs(n),
                      (v =
                        ((u = g * (s - t) * 0.5 + x * (c - e) * 0.5) * u) /
                          (r * r) +
                        ((l = g * (c - e) * 0.5 - x * (s - t) * 0.5) * l) /
                          (n * n)) > 1 && ((r *= v = Math.sqrt(v)), (n *= v)),
                      (w =
                        1 /
                          (((j = (h = g / r) * t + (f = x / r) * e) -
                            (P = h * s + f * c)) *
                            (j - P) +
                            ((B = (d = -x / n) * t + (p = g / n) * e) -
                              (T = d * s + p * c)) *
                              (B - T)) -
                        0.25) < 0 && (w = 0),
                      b = Math.sqrt(w),
                      o === i && (b = -b),
                      I = 0.5 * (P + j) - b * (B - T),
                      L = 0.5 * (T + B) + b * (j - P),
                      C = Math.atan2(T - L, P - I),
                      (A = Math.atan2(B - L, j - I) - C) < 0 && 1 === o
                        ? (A += 2 * Math.PI)
                        : A > 0 && 0 === o && (A -= 2 * Math.PI),
                      y = Math.ceil(Math.abs(A / (0.5 * Math.PI + 0.001))),
                      m = [],
                      _ = O = 0;
                    0 <= y ? O < y : O > y;
                    _ = 0 <= y ? ++O : --O
                  )
                    (k = C + (_ * A) / y),
                      (E = C + ((_ + 1) * A) / y),
                      (m[_] = [I, L, k, E, r, n, x, g]);
                  return m;
                }),
                (h = function (t, e, r, n, i, a, s, u) {
                  var l, c, h, f, d, p, g, _, v, m, y, b;
                  return (
                    (l = u * i),
                    (c = -s * a),
                    (h = s * i),
                    (f = u * a),
                    (p = 0.5 * (n - r)),
                    (d =
                      ((8 / 3) * Math.sin(0.5 * p) * Math.sin(0.5 * p)) /
                      Math.sin(p)),
                    (g = o(t + Math.cos(r) - d * Math.sin(r))),
                    (m = o(e + Math.sin(r) + d * Math.cos(r))),
                    (v = o(t + Math.cos(n))),
                    (b = o(e + Math.sin(n))),
                    (_ = o(v + d * Math.sin(n))),
                    (y = o(b - d * Math.cos(n))),
                    [
                      l * g + c * m,
                      h * g + f * m,
                      l * _ + c * y,
                      h * _ + f * y,
                      l * v + c * b,
                      h * v + f * b,
                    ]
                  );
                }),
                (o = function (t) {
                  return Math.abs(Math.round(t) - t) < 1e-13
                    ? Math.round(t)
                    : t;
                }),
                t
              );
            })()),
              (e.localExports = n);
          },
          {},
        ],
        21: [
          function (t, e, r) {
            (function (r) {
              var n,
                i,
                o,
                a = function (t, e) {
                  return function () {
                    return t.apply(e, arguments);
                  };
                },
                s = {}.hasOwnProperty,
                u = function (t, e) {
                  function r() {
                    this.constructor = t;
                  }
                  for (var n in e) s.call(e, n) && (t[n] = e[n]);
                  return (
                    (r.prototype = e.prototype),
                    (t.prototype = new r()),
                    (t.__super__ = e.prototype),
                    t
                  );
                };
              (o = t('zlib')),
                (i = (function (t) {
                  function e(t, r, n) {
                    (this.document = t),
                      (this.id = r),
                      (this.data = null != n ? n : {}),
                      (this.finalize = a(this.finalize, this)),
                      e.__super__.constructor.call(this, {
                        decodeStrings: !1,
                      }),
                      (this.gen = 0),
                      (this.deflate = null),
                      (this.compress =
                        this.document.compress && !this.data.Filter),
                      (this.uncompressedLength = 0),
                      (this.chunks = []);
                  }
                  return (
                    u(e, t),
                    (e.prototype.initDeflate = function () {
                      return (
                        (this.data.Filter = 'FlateDecode'),
                        (this.deflate = o.createDeflate()),
                        this.deflate.on(
                          'data',
                          (function (t) {
                            return function (e) {
                              return (
                                t.chunks.push(e), (t.data.Length += e.length)
                              );
                            };
                          })(this)
                        ),
                        this.deflate.on('end', this.finalize)
                      );
                    }),
                    (e.prototype._write = function (t, e, n) {
                      var i;
                      return (
                        r.isBuffer(t) || (t = new r(t + '\n', 'binary')),
                        (this.uncompressedLength += t.length),
                        null == (i = this.data).Length && (i.Length = 0),
                        this.compress
                          ? (this.deflate || this.initDeflate(),
                            this.deflate.write(t))
                          : (this.chunks.push(t),
                            (this.data.Length += t.length)),
                        n()
                      );
                    }),
                    (e.prototype.end = function (t) {
                      return (
                        e.__super__.end.apply(this, arguments),
                        this.deflate ? this.deflate.end() : this.finalize()
                      );
                    }),
                    (e.prototype.finalize = function () {
                      var t, e, r, i;
                      if (
                        ((this.offset = this.document._offset),
                        this.document._write(this.id + ' ' + this.gen + ' obj'),
                        this.document._write(n.convert(this.data)),
                        this.chunks.length)
                      ) {
                        for (
                          this.document._write('stream'),
                            e = 0,
                            r = (i = this.chunks).length;
                          e < r;
                          e++
                        )
                          (t = i[e]), this.document._write(t);
                        (this.chunks.length = 0),
                          this.document._write('\nendstream');
                      }
                      return (
                        this.document._write('endobj'),
                        this.document._refEnd(this)
                      );
                    }),
                    (e.prototype.toString = function () {
                      return this.id + ' ' + this.gen + ' R';
                    }),
                    e
                  );
                })(t('stream').Writable)),
                (e.localExports = i),
                (n = t('./object'));
            }).call(this, t('buffer').Buffer);
          },
          { './object': 18, buffer: 60, stream: 216, zlib: 58 },
        ],
        22: [
          function (t, e, r) {
            function n(t, e) {
              return d.isUndefined(e)
                ? '' + e
                : d.isNumber(e) && !isFinite(e)
                ? e.toString()
                : d.isFunction(e) || d.isRegExp(e)
                ? e.toString()
                : e;
            }
            function i(t, e) {
              return d.isString(t) ? (t.length < e ? t : t.slice(0, e)) : t;
            }
            function o(t) {
              return (
                i(JSON.stringify(t.actual, n), 128) +
                ' ' +
                t.operator +
                ' ' +
                i(JSON.stringify(t.expected, n), 128)
              );
            }
            function a(t, e, r, n, i) {
              throw new _.AssertionError({
                message: r,
                actual: t,
                expected: e,
                operator: n,
                stackStartFunction: i,
              });
            }
            function s(t, e) {
              t || a(t, !0, e, '==', _.ok);
            }
            function u(t, e) {
              if (t === e) return !0;
              if (d.isBuffer(t) && d.isBuffer(e)) {
                if (t.length != e.length) return !1;
                for (var r = 0; r < t.length; r++) if (t[r] !== e[r]) return !1;
                return !0;
              }
              return d.isDate(t) && d.isDate(e)
                ? t.getTime() === e.getTime()
                : d.isRegExp(t) && d.isRegExp(e)
                ? t.source === e.source &&
                  t.global === e.global &&
                  t.multiline === e.multiline &&
                  t.lastIndex === e.lastIndex &&
                  t.ignoreCase === e.ignoreCase
                : d.isObject(t) || d.isObject(e)
                ? c(t, e)
                : t == e;
            }
            function l(t) {
              return '[object Arguments]' == Object.prototype.toString.call(t);
            }
            function c(t, e) {
              if (d.isNullOrUndefined(t) || d.isNullOrUndefined(e)) return !1;
              if (t.prototype !== e.prototype) return !1;
              if (d.isPrimitive(t) || d.isPrimitive(e)) return t === e;
              var r = l(t),
                n = l(e);
              if ((r && !n) || (!r && n)) return !1;
              if (r) return (t = p.call(t)), (e = p.call(e)), u(t, e);
              var i,
                o,
                a = v(t),
                s = v(e);
              if (a.length != s.length) return !1;
              for (a.sort(), s.sort(), o = a.length - 1; o >= 0; o--)
                if (a[o] != s[o]) return !1;
              for (o = a.length - 1; o >= 0; o--)
                if (((i = a[o]), !u(t[i], e[i]))) return !1;
              return !0;
            }
            function h(t, e) {
              return (
                !(!t || !e) &&
                ('[object RegExp]' == Object.prototype.toString.call(e)
                  ? e.test(t)
                  : t instanceof e || !0 === e.call({}, t))
              );
            }
            function f(t, e, r, n) {
              var i;
              d.isString(r) && ((n = r), (r = null));
              try {
                e();
              } catch (t) {
                i = t;
              }
              if (
                ((n =
                  (r && r.name ? ' (' + r.name + ').' : '.') +
                  (n ? ' ' + n : '.')),
                t && !i && a(i, r, 'Missing expected exception' + n),
                !t && h(i, r) && a(i, r, 'Got unwanted exception' + n),
                (t && i && r && !h(i, r)) || (!t && i))
              )
                throw i;
            }
            var d = t('util/'),
              p = Array.prototype.slice,
              g = Object.prototype.hasOwnProperty,
              _ = (e.localExports = s);
            (_.AssertionError = function (t) {
              (this.name = 'AssertionError'),
                (this.actual = t.actual),
                (this.expected = t.expected),
                (this.operator = t.operator),
                t.message
                  ? ((this.message = t.message), (this.generatedMessage = !1))
                  : ((this.message = o(this)), (this.generatedMessage = !0));
              var e = t.stackStartFunction || a;
              if (Error.captureStackTrace) Error.captureStackTrace(this, e);
              else {
                var r = new Error();
                if (r.stack) {
                  var n = r.stack,
                    i = e.name,
                    s = n.indexOf('\n' + i);
                  if (s >= 0) {
                    var u = n.indexOf('\n', s + 1);
                    n = n.substring(u + 1);
                  }
                  this.stack = n;
                }
              }
            }),
              d.inherits(_.AssertionError, Error),
              (_.fail = a),
              (_.ok = s),
              (_.equal = function (t, e, r) {
                t != e && a(t, e, r, '==', _.equal);
              }),
              (_.notEqual = function (t, e, r) {
                t == e && a(t, e, r, '!=', _.notEqual);
              }),
              (_.deepEqual = function (t, e, r) {
                u(t, e) || a(t, e, r, 'deepEqual', _.deepEqual);
              }),
              (_.notDeepEqual = function (t, e, r) {
                u(t, e) && a(t, e, r, 'notDeepEqual', _.notDeepEqual);
              }),
              (_.strictEqual = function (t, e, r) {
                t !== e && a(t, e, r, '===', _.strictEqual);
              }),
              (_.notStrictEqual = function (t, e, r) {
                t === e && a(t, e, r, '!==', _.notStrictEqual);
              }),
              (_.throws = function (t, e, r) {
                f.apply(this, [!0].concat(p.call(arguments)));
              }),
              (_.doesNotThrow = function (t, e) {
                f.apply(this, [!1].concat(p.call(arguments)));
              }),
              (_.ifError = function (t) {
                if (t) throw t;
              });
            var v =
              Object.keys ||
              function (t) {
                var e = [];
                for (var r in t) g.call(t, r) && e.push(r);
                return e;
              };
          },
          { 'util/': 224 },
        ],
        23: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/array/from'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/array/from': 62 },
        ],
        24: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/get-iterator'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/get-iterator': 63 },
        ],
        25: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/is-iterable'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/is-iterable': 64 },
        ],
        26: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/object/assign'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/object/assign': 65 },
        ],
        27: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/object/create'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/object/create': 66 },
        ],
        28: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/object/define-properties'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/object/define-properties': 67 },
        ],
        29: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/object/define-property'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/object/define-property': 68 },
        ],
        30: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/object/freeze'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/object/freeze': 69 },
        ],
        31: [
          function (t, e, r) {
            e.localExports = {
              default: t(
                'core-js/library/fn/object/get-own-property-descriptor'
              ),
              __esModule: !0,
            };
          },
          {
            'core-js/library/fn/object/get-own-property-descriptor': 70,
          },
        ],
        32: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/object/get-prototype-of'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/object/get-prototype-of': 71 },
        ],
        33: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/object/keys'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/object/keys': 72 },
        ],
        34: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/object/set-prototype-of'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/object/set-prototype-of': 73 },
        ],
        35: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/symbol'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/symbol': 74 },
        ],
        36: [
          function (t, e, r) {
            e.localExports = {
              default: t('core-js/library/fn/symbol/iterator'),
              __esModule: !0,
            };
          },
          { 'core-js/library/fn/symbol/iterator': 75 },
        ],
        37: [
          function (t, e, r) {
            (r.__esModule = !0),
              (r.default = function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError('Cannot call a class as a function');
              });
          },
          {},
        ],
        38: [
          function (t, e, r) {
            r.__esModule = !0;
            var n = (function (t) {
              return t && t.__esModule ? t : { default: t };
            })(t('../core-js/object/define-property'));
            r.default = (function () {
              function t(t, e) {
                for (var r = 0; r < e.length; r++) {
                  var i = e[r];
                  (i.enumerable = i.enumerable || !1),
                    (i.configurable = !0),
                    'value' in i && (i.writable = !0),
                    n.default(t, i.key, i);
                }
              }
              return function (e, r, n) {
                return r && t(e.prototype, r), n && t(e, n), e;
              };
            })();
          },
          { '../core-js/object/define-property': 29 },
        ],
        39: [
          function (t, e, r) {
            function n(t) {
              return t && t.__esModule ? t : { default: t };
            }
            r.__esModule = !0;
            var i = n(t('../core-js/object/get-prototype-of')),
              o = n(t('../core-js/object/get-own-property-descriptor'));
            r.default = function t(e, r, n) {
              null === e && (e = Function.prototype);
              var a = o.default(e, r);
              if (void 0 === a) {
                var s = i.default(e);
                return null === s ? void 0 : t(s, r, n);
              }
              if ('value' in a) return a.value;
              var u = a.get;
              if (void 0 !== u) return u.call(n);
            };
          },
          {
            '../core-js/object/get-own-property-descriptor': 31,
            '../core-js/object/get-prototype-of': 32,
          },
        ],
        40: [
          function (t, e, r) {
            function n(t) {
              return t && t.__esModule ? t : { default: t };
            }
            r.__esModule = !0;
            var i = n(t('../core-js/object/set-prototype-of')),
              o = n(t('../core-js/object/create')),
              a = n(t('../helpers/typeof'));
            r.default = function (t, e) {
              if ('function' != typeof e && null !== e)
                throw new TypeError(
                  'Super expression must either be null or a function, not ' +
                    (void 0 === e ? 'undefined' : a.default(e))
                );
              (t.prototype = o.default(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
                e && (i.default ? i.default(t, e) : (t.__proto__ = e));
            };
          },
          {
            '../core-js/object/create': 27,
            '../core-js/object/set-prototype-of': 34,
            '../helpers/typeof': 44,
          },
        ],
        41: [
          function (t, e, r) {
            r.__esModule = !0;
            var n = (function (t) {
              return t && t.__esModule ? t : { default: t };
            })(t('../helpers/typeof'));
            r.default = function (t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e ||
                ('object' !== (void 0 === e ? 'undefined' : n.default(e)) &&
                  'function' != typeof e)
                ? t
                : e;
            };
          },
          { '../helpers/typeof': 44 },
        ],
        42: [
          function (t, e, r) {
            function n(t) {
              return t && t.__esModule ? t : { default: t };
            }
            r.__esModule = !0;
            var i = n(t('../core-js/is-iterable')),
              o = n(t('../core-js/get-iterator'));
            r.default = (function () {
              function t(t, e) {
                var r = [],
                  n = !0,
                  i = !1,
                  a = void 0;
                try {
                  for (
                    var s, u = o.default(t);
                    !(n = (s = u.next()).done) &&
                    (r.push(s.value), !e || r.length !== e);
                    n = !0
                  );
                } catch (t) {
                  (i = !0), (a = t);
                } finally {
                  try {
                    !n && u.return && u.return();
                  } finally {
                    if (i) throw a;
                  }
                }
                return r;
              }
              return function (e, r) {
                if (Array.isArray(e)) return e;
                if (i.default(Object(e))) return t(e, r);
                throw new TypeError(
                  'Invalid attempt to destructure non-iterable instance'
                );
              };
            })();
          },
          {
            '../core-js/get-iterator': 24,
            '../core-js/is-iterable': 25,
          },
        ],
        43: [
          function (t, e, r) {
            r.__esModule = !0;
            var n = (function (t) {
              return t && t.__esModule ? t : { default: t };
            })(t('../core-js/array/from'));
            r.default = function (t) {
              if (Array.isArray(t)) {
                for (var e = 0, r = Array(t.length); e < t.length; e++)
                  r[e] = t[e];
                return r;
              }
              return n.default(t);
            };
          },
          { '../core-js/array/from': 23 },
        ],
        44: [
          function (t, e, r) {
            function n(t) {
              return t && t.__esModule ? t : { default: t };
            }
            r.__esModule = !0;
            var i = n(t('../core-js/symbol/iterator')),
              o = n(t('../core-js/symbol')),
              a =
                'function' == typeof o.default && 'symbol' == typeof i.default
                  ? function (t) {
                      return typeof t;
                    }
                  : function (t) {
                      return t &&
                        'function' == typeof o.default &&
                        t.constructor === o.default
                        ? 'symbol'
                        : typeof t;
                    };
            r.default =
              'function' == typeof o.default && 'symbol' === a(i.default)
                ? function (t) {
                    return void 0 === t ? 'undefined' : a(t);
                  }
                : function (t) {
                    return t &&
                      'function' == typeof o.default &&
                      t.constructor === o.default
                      ? 'symbol'
                      : void 0 === t
                      ? 'undefined'
                      : a(t);
                  };
          },
          {
            '../core-js/symbol': 35,
            '../core-js/symbol/iterator': 36,
          },
        ],
        45: [
          function (t, e, r) {
            function n(t) {
              return (
                o[(t >> 18) & 63] +
                o[(t >> 12) & 63] +
                o[(t >> 6) & 63] +
                o[63 & t]
              );
            }
            function i(t, e, r) {
              for (var i, o = [], a = e; a < r; a += 3)
                (i = (t[a] << 16) + (t[a + 1] << 8) + t[a + 2]), o.push(n(i));
              return o.join('');
            }
            (r.toByteArray = function (t) {
              var e,
                r,
                n,
                i,
                o,
                u,
                l = t.length;
              if (l % 4 > 0)
                throw new Error(
                  'Invalid string. Length must be a multiple of 4'
                );
              (o = '=' === t[l - 2] ? 2 : '=' === t[l - 1] ? 1 : 0),
                (u = new s((3 * l) / 4 - o)),
                (n = o > 0 ? l - 4 : l);
              var c = 0;
              for (e = 0, r = 0; e < n; e += 4, r += 3)
                (i =
                  (a[t.charCodeAt(e)] << 18) |
                  (a[t.charCodeAt(e + 1)] << 12) |
                  (a[t.charCodeAt(e + 2)] << 6) |
                  a[t.charCodeAt(e + 3)]),
                  (u[c++] = (i >> 16) & 255),
                  (u[c++] = (i >> 8) & 255),
                  (u[c++] = 255 & i);
              return (
                2 === o
                  ? ((i =
                      (a[t.charCodeAt(e)] << 2) |
                      (a[t.charCodeAt(e + 1)] >> 4)),
                    (u[c++] = 255 & i))
                  : 1 === o &&
                    ((i =
                      (a[t.charCodeAt(e)] << 10) |
                      (a[t.charCodeAt(e + 1)] << 4) |
                      (a[t.charCodeAt(e + 2)] >> 2)),
                    (u[c++] = (i >> 8) & 255),
                    (u[c++] = 255 & i)),
                u
              );
            }),
              (r.fromByteArray = function (t) {
                for (
                  var e,
                    r = t.length,
                    n = r % 3,
                    a = '',
                    s = [],
                    u = 0,
                    l = r - n;
                  u < l;
                  u += 16383
                )
                  s.push(i(t, u, u + 16383 > l ? l : u + 16383));
                return (
                  1 === n
                    ? ((e = t[r - 1]),
                      (a += o[e >> 2]),
                      (a += o[(e << 4) & 63]),
                      (a += '=='))
                    : 2 === n &&
                      ((e = (t[r - 2] << 8) + t[r - 1]),
                      (a += o[e >> 10]),
                      (a += o[(e >> 4) & 63]),
                      (a += o[(e << 2) & 63]),
                      (a += '=')),
                  s.push(a),
                  s.join('')
                );
              });
            var o = [],
              a = [],
              s = 'undefined' != typeof Uint8Array ? Uint8Array : Array;
            !(function () {
              for (
                var t =
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
                  e = 0,
                  r = t.length;
                e < r;
                ++e
              )
                (o[e] = t[e]), (a[t.charCodeAt(e)] = e);
              (a['-'.charCodeAt(0)] = 62), (a['_'.charCodeAt(0)] = 63);
            })();
          },
          {},
        ],
        56: [function (t, e, r) {}, {}],
        57: [
          function (t, e, r) {
            (function (e, n) {
              function i(t) {
                if (t < r.DEFLATE || t > r.UNZIP)
                  throw new TypeError('Bad argument');
                (this.mode = t),
                  (this.init_done = !1),
                  (this.write_in_progress = !1),
                  (this.pending_close = !1),
                  (this.windowBits = 0),
                  (this.level = 0),
                  (this.memLevel = 0),
                  (this.strategy = 0),
                  (this.dictionary = null);
              }
              function o(t, e) {
                for (var r = 0; r < t.length; r++) this[e + r] = t[r];
              }
              var a = t('pako/lib/zlib/messages'),
                s = t('pako/lib/zlib/zstream'),
                u = t('pako/lib/zlib/deflate.js'),
                l = t('pako/lib/zlib/inflate.js'),
                c = t('pako/lib/zlib/constants');
              for (var h in c) r[h] = c[h];
              (r.NONE = 0),
                (r.DEFLATE = 1),
                (r.INFLATE = 2),
                (r.GZIP = 3),
                (r.GUNZIP = 4),
                (r.DEFLATERAW = 5),
                (r.INFLATERAW = 6),
                (r.UNZIP = 7),
                (i.prototype.init = function (t, e, n, i, o) {
                  switch (
                    ((this.windowBits = t),
                    (this.level = e),
                    (this.memLevel = n),
                    (this.strategy = i),
                    (this.mode !== r.GZIP && this.mode !== r.GUNZIP) ||
                      (this.windowBits += 16),
                    this.mode === r.UNZIP && (this.windowBits += 32),
                    (this.mode !== r.DEFLATERAW &&
                      this.mode !== r.INFLATERAW) ||
                      (this.windowBits = -this.windowBits),
                    (this.strm = new s()),
                    this.mode)
                  ) {
                    case r.DEFLATE:
                    case r.GZIP:
                    case r.DEFLATERAW:
                      a = u.deflateInit2(
                        this.strm,
                        this.level,
                        r.Z_DEFLATED,
                        this.windowBits,
                        this.memLevel,
                        this.strategy
                      );
                      break;
                    case r.INFLATE:
                    case r.GUNZIP:
                    case r.INFLATERAW:
                    case r.UNZIP:
                      var a = l.inflateInit2(this.strm, this.windowBits);
                      break;
                    default:
                      throw new Error('Unknown mode ' + this.mode);
                  }
                  a === r.Z_OK
                    ? ((this.write_in_progress = !1), (this.init_done = !0))
                    : this._error(a);
                }),
                (i.prototype.params = function () {
                  throw new Error('deflateParams Not supported');
                }),
                (i.prototype._writeCheck = function () {
                  if (!this.init_done) throw new Error('write before init');
                  if (this.mode === r.NONE)
                    throw new Error('already finalized');
                  if (this.write_in_progress)
                    throw new Error('write already in progress');
                  if (this.pending_close) throw new Error('close is pending');
                }),
                (i.prototype.write = function (t, r, n, i, o, a, s) {
                  this._writeCheck(), (this.write_in_progress = !0);
                  var u = this;
                  return (
                    e.nextTick(function () {
                      u.write_in_progress = !1;
                      var e = u._write(t, r, n, i, o, a, s);
                      u.callback(e[0], e[1]), u.pending_close && u.close();
                    }),
                    this
                  );
                }),
                (i.prototype.writeSync = function (t, e, r, n, i, o, a) {
                  return this._writeCheck(), this._write(t, e, r, n, i, o, a);
                }),
                (i.prototype._write = function (t, e, i, a, s, c, h) {
                  if (
                    ((this.write_in_progress = !0),
                    t !== r.Z_NO_FLUSH &&
                      t !== r.Z_PARTIAL_FLUSH &&
                      t !== r.Z_SYNC_FLUSH &&
                      t !== r.Z_FULL_FLUSH &&
                      t !== r.Z_FINISH &&
                      t !== r.Z_BLOCK)
                  )
                    throw new Error('Invalid flush value');
                  null == e && ((e = new n(0)), (a = 0), (i = 0)),
                    s._set ? (s.set = s._set) : (s.set = o);
                  var f = this.strm;
                  switch (
                    ((f.avail_in = a),
                    (f.input = e),
                    (f.next_in = i),
                    (f.avail_out = h),
                    (f.output = s),
                    (f.next_out = c),
                    this.mode)
                  ) {
                    case r.DEFLATE:
                    case r.GZIP:
                    case r.DEFLATERAW:
                      d = u.deflate(f, t);
                      break;
                    case r.UNZIP:
                    case r.INFLATE:
                    case r.GUNZIP:
                    case r.INFLATERAW:
                      var d = l.inflate(f, t);
                      break;
                    default:
                      throw new Error('Unknown mode ' + this.mode);
                  }
                  return (
                    d !== r.Z_STREAM_END && d !== r.Z_OK && this._error(d),
                    (this.write_in_progress = !1),
                    [f.avail_in, f.avail_out]
                  );
                }),
                (i.prototype.close = function () {
                  this.write_in_progress
                    ? (this.pending_close = !0)
                    : ((this.pending_close = !1),
                      this.mode === r.DEFLATE ||
                      this.mode === r.GZIP ||
                      this.mode === r.DEFLATERAW
                        ? u.deflateEnd(this.strm)
                        : l.inflateEnd(this.strm),
                      (this.mode = r.NONE));
                }),
                (i.prototype.reset = function () {
                  switch (this.mode) {
                    case r.DEFLATE:
                    case r.DEFLATERAW:
                      t = u.deflateReset(this.strm);
                      break;
                    case r.INFLATE:
                    case r.INFLATERAW:
                      var t = l.inflateReset(this.strm);
                  }
                  t !== r.Z_OK && this._error(t);
                }),
                (i.prototype._error = function (t) {
                  this.onerror(a[t] + ': ' + this.strm.msg, t),
                    (this.write_in_progress = !1),
                    this.pending_close && this.close();
                }),
                (r.Zlib = i);
            }).call(this, t('_process'), t('buffer').Buffer);
          },
          {
            _process: 188,
            buffer: 60,
            'pako/lib/zlib/constants': 177,
            'pako/lib/zlib/deflate.js': 179,
            'pako/lib/zlib/inflate.js': 181,
            'pako/lib/zlib/messages': 183,
            'pako/lib/zlib/zstream': 185,
          },
        ],
        58: [
          function (t, e, r) {
            (function (e, n) {
              function i(t, e, r) {
                function i() {
                  for (var e; null !== (e = t.read()); )
                    a.push(e), (s += e.length);
                  t.once('readable', i);
                }
                function o() {
                  var e = n.concat(a, s);
                  (a = []), r(null, e), t.close();
                }
                var a = [],
                  s = 0;
                t.on('error', function (e) {
                  t.removeListener('end', o),
                    t.removeListener('readable', i),
                    r(e);
                }),
                  t.on('end', o),
                  t.end(e),
                  i();
              }
              function o(t, e) {
                if (('string' == typeof e && (e = new n(e)), !n.isBuffer(e)))
                  throw new TypeError('Not a string or buffer');
                var r = g.Z_FINISH;
                return t._processChunk(e, r);
              }
              function a(t) {
                if (!(this instanceof a)) return new a(t);
                d.call(this, t, g.DEFLATE);
              }
              function s(t) {
                if (!(this instanceof s)) return new s(t);
                d.call(this, t, g.INFLATE);
              }
              function u(t) {
                if (!(this instanceof u)) return new u(t);
                d.call(this, t, g.GZIP);
              }
              function l(t) {
                if (!(this instanceof l)) return new l(t);
                d.call(this, t, g.GUNZIP);
              }
              function c(t) {
                if (!(this instanceof c)) return new c(t);
                d.call(this, t, g.DEFLATERAW);
              }
              function h(t) {
                if (!(this instanceof h)) return new h(t);
                d.call(this, t, g.INFLATERAW);
              }
              function f(t) {
                if (!(this instanceof f)) return new f(t);
                d.call(this, t, g.UNZIP);
              }
              function d(t, e) {
                if (
                  ((this._opts = t = t || {}),
                  (this._chunkSize = t.chunkSize || r.Z_DEFAULT_CHUNK),
                  p.call(this, t),
                  t.flush &&
                    t.flush !== g.Z_NO_FLUSH &&
                    t.flush !== g.Z_PARTIAL_FLUSH &&
                    t.flush !== g.Z_SYNC_FLUSH &&
                    t.flush !== g.Z_FULL_FLUSH &&
                    t.flush !== g.Z_FINISH &&
                    t.flush !== g.Z_BLOCK)
                )
                  throw new Error('Invalid flush flag: ' + t.flush);
                if (
                  ((this._flushFlag = t.flush || g.Z_NO_FLUSH),
                  t.chunkSize &&
                    (t.chunkSize < r.Z_MIN_CHUNK ||
                      t.chunkSize > r.Z_MAX_CHUNK))
                )
                  throw new Error('Invalid chunk size: ' + t.chunkSize);
                if (
                  t.windowBits &&
                  (t.windowBits < r.Z_MIN_WINDOWBITS ||
                    t.windowBits > r.Z_MAX_WINDOWBITS)
                )
                  throw new Error('Invalid windowBits: ' + t.windowBits);
                if (
                  t.level &&
                  (t.level < r.Z_MIN_LEVEL || t.level > r.Z_MAX_LEVEL)
                )
                  throw new Error('Invalid compression level: ' + t.level);
                if (
                  t.memLevel &&
                  (t.memLevel < r.Z_MIN_MEMLEVEL ||
                    t.memLevel > r.Z_MAX_MEMLEVEL)
                )
                  throw new Error('Invalid memLevel: ' + t.memLevel);
                if (
                  t.strategy &&
                  t.strategy != r.Z_FILTERED &&
                  t.strategy != r.Z_HUFFMAN_ONLY &&
                  t.strategy != r.Z_RLE &&
                  t.strategy != r.Z_FIXED &&
                  t.strategy != r.Z_DEFAULT_STRATEGY
                )
                  throw new Error('Invalid strategy: ' + t.strategy);
                if (t.dictionary && !n.isBuffer(t.dictionary))
                  throw new Error(
                    'Invalid dictionary: it should be a Buffer instance'
                  );
                this._binding = new g.Zlib(e);
                var i = this;
                (this._hadError = !1),
                  (this._binding.onerror = function (t, e) {
                    (i._binding = null), (i._hadError = !0);
                    var n = new Error(t);
                    (n.errno = e), (n.code = r.codes[e]), i.emit('error', n);
                  });
                var o = r.Z_DEFAULT_COMPRESSION;
                'number' == typeof t.level && (o = t.level);
                var a = r.Z_DEFAULT_STRATEGY;
                'number' == typeof t.strategy && (a = t.strategy),
                  this._binding.init(
                    t.windowBits || r.Z_DEFAULT_WINDOWBITS,
                    o,
                    t.memLevel || r.Z_DEFAULT_MEMLEVEL,
                    a,
                    t.dictionary
                  ),
                  (this._buffer = new n(this._chunkSize)),
                  (this._offset = 0),
                  (this._closed = !1),
                  (this._level = o),
                  (this._strategy = a),
                  this.once('end', this.close);
              }
              var p = t('_stream_transform'),
                g = t('./binding'),
                _ = t('util'),
                v = t('assert').ok;
              (g.Z_MIN_WINDOWBITS = 8),
                (g.Z_MAX_WINDOWBITS = 15),
                (g.Z_DEFAULT_WINDOWBITS = 15),
                (g.Z_MIN_CHUNK = 64),
                (g.Z_MAX_CHUNK = 1 / 0),
                (g.Z_DEFAULT_CHUNK = 16384),
                (g.Z_MIN_MEMLEVEL = 1),
                (g.Z_MAX_MEMLEVEL = 9),
                (g.Z_DEFAULT_MEMLEVEL = 8),
                (g.Z_MIN_LEVEL = -1),
                (g.Z_MAX_LEVEL = 9),
                (g.Z_DEFAULT_LEVEL = g.Z_DEFAULT_COMPRESSION),
                Object.keys(g).forEach(function (t) {
                  t.match(/^Z/) && (r[t] = g[t]);
                }),
                (r.codes = {
                  Z_OK: g.Z_OK,
                  Z_STREAM_END: g.Z_STREAM_END,
                  Z_NEED_DICT: g.Z_NEED_DICT,
                  Z_ERRNO: g.Z_ERRNO,
                  Z_STREAM_ERROR: g.Z_STREAM_ERROR,
                  Z_DATA_ERROR: g.Z_DATA_ERROR,
                  Z_MEM_ERROR: g.Z_MEM_ERROR,
                  Z_BUF_ERROR: g.Z_BUF_ERROR,
                  Z_VERSION_ERROR: g.Z_VERSION_ERROR,
                }),
                Object.keys(r.codes).forEach(function (t) {
                  r.codes[r.codes[t]] = t;
                }),
                (r.Deflate = a),
                (r.Inflate = s),
                (r.Gzip = u),
                (r.Gunzip = l),
                (r.DeflateRaw = c),
                (r.InflateRaw = h),
                (r.Unzip = f),
                (r.createDeflate = function (t) {
                  return new a(t);
                }),
                (r.createInflate = function (t) {
                  return new s(t);
                }),
                (r.createDeflateRaw = function (t) {
                  return new c(t);
                }),
                (r.createInflateRaw = function (t) {
                  return new h(t);
                }),
                (r.createGzip = function (t) {
                  return new u(t);
                }),
                (r.createGunzip = function (t) {
                  return new l(t);
                }),
                (r.createUnzip = function (t) {
                  return new f(t);
                }),
                (r.deflate = function (t, e, r) {
                  return (
                    'function' == typeof e && ((r = e), (e = {})),
                    i(new a(e), t, r)
                  );
                }),
                (r.deflateSync = function (t, e) {
                  return o(new a(e), t);
                }),
                (r.gzip = function (t, e, r) {
                  return (
                    'function' == typeof e && ((r = e), (e = {})),
                    i(new u(e), t, r)
                  );
                }),
                (r.gzipSync = function (t, e) {
                  return o(new u(e), t);
                }),
                (r.deflateRaw = function (t, e, r) {
                  return (
                    'function' == typeof e && ((r = e), (e = {})),
                    i(new c(e), t, r)
                  );
                }),
                (r.deflateRawSync = function (t, e) {
                  return o(new c(e), t);
                }),
                (r.unzip = function (t, e, r) {
                  return (
                    'function' == typeof e && ((r = e), (e = {})),
                    i(new f(e), t, r)
                  );
                }),
                (r.unzipSync = function (t, e) {
                  return o(new f(e), t);
                }),
                (r.inflate = function (t, e, r) {
                  return (
                    'function' == typeof e && ((r = e), (e = {})),
                    i(new s(e), t, r)
                  );
                }),
                (r.inflateSync = function (t, e) {
                  return o(new s(e), t);
                }),
                (r.gunzip = function (t, e, r) {
                  return (
                    'function' == typeof e && ((r = e), (e = {})),
                    i(new l(e), t, r)
                  );
                }),
                (r.gunzipSync = function (t, e) {
                  return o(new l(e), t);
                }),
                (r.inflateRaw = function (t, e, r) {
                  return (
                    'function' == typeof e && ((r = e), (e = {})),
                    i(new h(e), t, r)
                  );
                }),
                (r.inflateRawSync = function (t, e) {
                  return o(new h(e), t);
                }),
                _.inherits(d, p),
                (d.prototype.params = function (t, n, i) {
                  if (t < r.Z_MIN_LEVEL || t > r.Z_MAX_LEVEL)
                    throw new RangeError('Invalid compression level: ' + t);
                  if (
                    n != r.Z_FILTERED &&
                    n != r.Z_HUFFMAN_ONLY &&
                    n != r.Z_RLE &&
                    n != r.Z_FIXED &&
                    n != r.Z_DEFAULT_STRATEGY
                  )
                    throw new TypeError('Invalid strategy: ' + n);
                  if (this._level !== t || this._strategy !== n) {
                    var o = this;
                    this.flush(g.Z_SYNC_FLUSH, function () {
                      o._binding.params(t, n),
                        o._hadError ||
                          ((o._level = t), (o._strategy = n), i && i());
                    });
                  } else e.nextTick(i);
                }),
                (d.prototype.reset = function () {
                  return this._binding.reset();
                }),
                (d.prototype._flush = function (t) {
                  this._transform(new n(0), '', t);
                }),
                (d.prototype.flush = function (t, r) {
                  var i = this._writableState;
                  if (
                    (('function' == typeof t || (void 0 === t && !r)) &&
                      ((r = t), (t = g.Z_FULL_FLUSH)),
                    i.ended)
                  )
                    r && e.nextTick(r);
                  else if (i.ending) r && this.once('end', r);
                  else if (i.needDrain) {
                    var o = this;
                    this.once('drain', function () {
                      o.flush(r);
                    });
                  } else (this._flushFlag = t), this.write(new n(0), '', r);
                }),
                (d.prototype.close = function (t) {
                  if ((t && e.nextTick(t), !this._closed)) {
                    (this._closed = !0), this._binding.close();
                    var r = this;
                    e.nextTick(function () {
                      r.emit('close');
                    });
                  }
                }),
                (d.prototype._transform = function (t, e, r) {
                  var i,
                    o = this._writableState,
                    a = (o.ending || o.ended) && (!t || o.length === t.length);
                  if (null === !t && !n.isBuffer(t))
                    return r(new Error('invalid input'));
                  a
                    ? (i = g.Z_FINISH)
                    : ((i = this._flushFlag),
                      t.length >= o.length &&
                        (this._flushFlag = this._opts.flush || g.Z_NO_FLUSH));
                  this._processChunk(t, i, r);
                }),
                (d.prototype._processChunk = function (t, e, r) {
                  function i(c, d) {
                    if (!u._hadError) {
                      var p = a - d;
                      if ((v(p >= 0, 'have should not go down'), p > 0)) {
                        var g = u._buffer.slice(u._offset, u._offset + p);
                        (u._offset += p),
                          l ? u.push(g) : (h.push(g), (f += g.length));
                      }
                      if (
                        ((0 === d || u._offset >= u._chunkSize) &&
                          ((a = u._chunkSize),
                          (u._offset = 0),
                          (u._buffer = new n(u._chunkSize))),
                        0 === d)
                      ) {
                        if (((s += o - c), (o = c), !l)) return !0;
                        var _ = u._binding.write(
                          e,
                          t,
                          s,
                          o,
                          u._buffer,
                          u._offset,
                          u._chunkSize
                        );
                        return (_.callback = i), void (_.buffer = t);
                      }
                      if (!l) return !1;
                      r();
                    }
                  }
                  var o = t && t.length,
                    a = this._chunkSize - this._offset,
                    s = 0,
                    u = this,
                    l = 'function' == typeof r;
                  if (!l) {
                    var c,
                      h = [],
                      f = 0;
                    this.on('error', function (t) {
                      c = t;
                    });
                    do {
                      var d = this._binding.writeSync(
                        e,
                        t,
                        s,
                        o,
                        this._buffer,
                        this._offset,
                        a
                      );
                    } while (!this._hadError && i(d[0], d[1]));
                    if (this._hadError) throw c;
                    var p = n.concat(h, f);
                    return this.close(), p;
                  }
                  var g = this._binding.write(
                    e,
                    t,
                    s,
                    o,
                    this._buffer,
                    this._offset,
                    a
                  );
                  (g.buffer = t), (g.callback = i);
                }),
                _.inherits(a, d),
                _.inherits(s, d),
                _.inherits(u, d),
                _.inherits(l, d),
                _.inherits(c, d),
                _.inherits(h, d),
                _.inherits(f, d);
            }).call(this, t('_process'), t('buffer').Buffer);
          },
          {
            './binding': 57,
            _process: 188,
            _stream_transform: 197,
            assert: 22,
            buffer: 60,
            util: 224,
          },
        ],
        59: [
          function (t, e, r) {
            arguments[4][56][0].apply(r, arguments);
          },
          { dup: 56 },
        ],
        60: [
          function (t, e, r) {
            (function (e) {
              function n() {
                return o.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
              }
              function i(t, e) {
                if (n() < e) throw new RangeError('Invalid typed array length');
                return (
                  o.TYPED_ARRAY_SUPPORT
                    ? ((t = new Uint8Array(e)).__proto__ = o.prototype)
                    : (null === t && (t = new o(e)), (t.length = e)),
                  t
                );
              }
              function o(t, e, r) {
                if (!(o.TYPED_ARRAY_SUPPORT || this instanceof o))
                  return new o(t, e, r);
                if ('number' == typeof t) {
                  if ('string' == typeof e)
                    throw new Error(
                      'If encoding is specified then the first argument must be a string'
                    );
                  return l(this, t);
                }
                return a(this, t, e, r);
              }
              function a(t, e, r, n) {
                if ('number' == typeof e)
                  throw new TypeError('"value" argument must not be a number');
                return 'undefined' != typeof ArrayBuffer &&
                  e instanceof ArrayBuffer
                  ? f(t, e, r, n)
                  : 'string' == typeof e
                  ? c(t, e, r)
                  : d(t, e);
              }
              function s(t) {
                if ('number' != typeof t)
                  throw new TypeError('"size" argument must be a number');
                if (t < 0)
                  throw new RangeError('"size" argument must not be negative');
              }
              function u(t, e, r, n) {
                return (
                  s(e),
                  e <= 0
                    ? i(t, e)
                    : void 0 !== r
                    ? 'string' == typeof n
                      ? i(t, e).fill(r, n)
                      : i(t, e).fill(r)
                    : i(t, e)
                );
              }
              function l(t, e) {
                if (
                  (s(e),
                  (t = i(t, e < 0 ? 0 : 0 | p(e))),
                  !o.TYPED_ARRAY_SUPPORT)
                )
                  for (var r = 0; r < e; ++r) t[r] = 0;
                return t;
              }
              function c(t, e, r) {
                if (
                  (('string' == typeof r && '' !== r) || (r = 'utf8'),
                  !o.isEncoding(r))
                )
                  throw new TypeError(
                    '"encoding" must be a valid string encoding'
                  );
                var n = 0 | g(e, r),
                  a = (t = i(t, n)).write(e, r);
                return a !== n && (t = t.slice(0, a)), t;
              }
              function h(t, e) {
                var r = e.length < 0 ? 0 : 0 | p(e.length);
                t = i(t, r);
                for (var n = 0; n < r; n += 1) t[n] = 255 & e[n];
                return t;
              }
              function f(t, e, r, n) {
                if ((e.byteLength, r < 0 || e.byteLength < r))
                  throw new RangeError("'offset' is out of bounds");
                if (e.byteLength < r + (n || 0))
                  throw new RangeError("'length' is out of bounds");
                return (
                  (e =
                    void 0 === r && void 0 === n
                      ? new Uint8Array(e)
                      : void 0 === n
                      ? new Uint8Array(e, r)
                      : new Uint8Array(e, r, n)),
                  o.TYPED_ARRAY_SUPPORT
                    ? ((t = e).__proto__ = o.prototype)
                    : (t = h(t, e)),
                  t
                );
              }
              function d(t, e) {
                if (o.isBuffer(e)) {
                  var r = 0 | p(e.length);
                  return 0 === (t = i(t, r)).length
                    ? t
                    : (e.copy(t, 0, 0, r), t);
                }
                if (e) {
                  if (
                    ('undefined' != typeof ArrayBuffer &&
                      e.buffer instanceof ArrayBuffer) ||
                    'length' in e
                  )
                    return 'number' != typeof e.length || V(e.length)
                      ? i(t, 0)
                      : h(t, e);
                  if ('Buffer' === e.type && J(e.data)) return h(t, e.data);
                }
                throw new TypeError(
                  'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.'
                );
              }
              function p(t) {
                if (t >= n())
                  throw new RangeError(
                    'Attempt to allocate Buffer larger than maximum size: 0x' +
                      n().toString(16) +
                      ' bytes'
                  );
                return 0 | t;
              }
              function g(t, e) {
                if (o.isBuffer(t)) return t.length;
                if (
                  'undefined' != typeof ArrayBuffer &&
                  'function' == typeof ArrayBuffer.isView &&
                  (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)
                )
                  return t.byteLength;
                'string' != typeof t && (t = '' + t);
                var r = t.length;
                if (0 === r) return 0;
                for (var n = !1; ; )
                  switch (e) {
                    case 'ascii':
                    case 'latin1':
                    case 'binary':
                      return r;
                    case 'utf8':
                    case 'utf-8':
                    case void 0:
                      return G(t).length;
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                      return 2 * r;
                    case 'hex':
                      return r >>> 1;
                    case 'base64':
                      return W(t).length;
                    default:
                      if (n) return G(t).length;
                      (e = ('' + e).toLowerCase()), (n = !0);
                  }
              }
              function _(t, e, r) {
                var n = !1;
                if (((void 0 === e || e < 0) && (e = 0), e > this.length))
                  return '';
                if (
                  ((void 0 === r || r > this.length) && (r = this.length),
                  r <= 0)
                )
                  return '';
                if (((r >>>= 0), (e >>>= 0), r <= e)) return '';
                for (t || (t = 'utf8'); ; )
                  switch (t) {
                    case 'hex':
                      return T(this, e, r);
                    case 'utf8':
                    case 'utf-8':
                      return A(this, e, r);
                    case 'ascii':
                      return j(this, e, r);
                    case 'latin1':
                    case 'binary':
                      return I(this, e, r);
                    case 'base64':
                      return E(this, e, r);
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                      return B(this, e, r);
                    default:
                      if (n) throw new TypeError('Unknown encoding: ' + t);
                      (t = (t + '').toLowerCase()), (n = !0);
                  }
              }
              function v(t, e, r) {
                var n = t[e];
                (t[e] = t[r]), (t[r] = n);
              }
              function m(t, e, r, n, i) {
                if (0 === t.length) return -1;
                if (
                  ('string' == typeof r
                    ? ((n = r), (r = 0))
                    : r > 2147483647
                    ? (r = 2147483647)
                    : r < -2147483648 && (r = -2147483648),
                  (r = +r),
                  isNaN(r) && (r = i ? 0 : t.length - 1),
                  r < 0 && (r = t.length + r),
                  r >= t.length)
                ) {
                  if (i) return -1;
                  r = t.length - 1;
                } else if (r < 0) {
                  if (!i) return -1;
                  r = 0;
                }
                if (('string' == typeof e && (e = o.from(e, n)), o.isBuffer(e)))
                  return 0 === e.length ? -1 : y(t, e, r, n, i);
                if ('number' == typeof e)
                  return (
                    (e &= 255),
                    o.TYPED_ARRAY_SUPPORT &&
                    'function' == typeof Uint8Array.prototype.indexOf
                      ? i
                        ? Uint8Array.prototype.indexOf.call(t, e, r)
                        : Uint8Array.prototype.lastIndexOf.call(t, e, r)
                      : y(t, [e], r, n, i)
                  );
                throw new TypeError('val must be string, number or Buffer');
              }
              function y(t, e, r, n, i) {
                function o(t, e) {
                  return 1 === a ? t[e] : t.readUInt16BE(e * a);
                }
                var a = 1,
                  s = t.length,
                  u = e.length;
                if (
                  void 0 !== n &&
                  ('ucs2' === (n = String(n).toLowerCase()) ||
                    'ucs-2' === n ||
                    'utf16le' === n ||
                    'utf-16le' === n)
                ) {
                  if (t.length < 2 || e.length < 2) return -1;
                  (a = 2), (s /= 2), (u /= 2), (r /= 2);
                }
                var l;
                if (i) {
                  var c = -1;
                  for (l = r; l < s; l++)
                    if (o(t, l) === o(e, -1 === c ? 0 : l - c)) {
                      if ((-1 === c && (c = l), l - c + 1 === u)) return c * a;
                    } else -1 !== c && (l -= l - c), (c = -1);
                } else
                  for (r + u > s && (r = s - u), l = r; l >= 0; l--) {
                    for (var h = !0, f = 0; f < u; f++)
                      if (o(t, l + f) !== o(e, f)) {
                        h = !1;
                        break;
                      }
                    if (h) return l;
                  }
                return -1;
              }
              function b(t, e, r, n) {
                r = Number(r) || 0;
                var i = t.length - r;
                n ? (n = Number(n)) > i && (n = i) : (n = i);
                var o = e.length;
                if (o % 2 != 0) throw new TypeError('Invalid hex string');
                n > o / 2 && (n = o / 2);
                for (var a = 0; a < n; ++a) {
                  var s = parseInt(e.substr(2 * a, 2), 16);
                  if (isNaN(s)) return a;
                  t[r + a] = s;
                }
                return a;
              }
              function w(t, e, r, n) {
                return Y(G(e, t.length - r), t, r, n);
              }
              function x(t, e, r, n) {
                return Y(q(e), t, r, n);
              }
              function S(t, e, r, n) {
                return x(t, e, r, n);
              }
              function C(t, e, r, n) {
                return Y(W(e), t, r, n);
              }
              function k(t, e, r, n) {
                return Y(Z(e, t.length - r), t, r, n);
              }
              function E(t, e, r) {
                return 0 === e && r === t.length
                  ? K.fromByteArray(t)
                  : K.fromByteArray(t.slice(e, r));
              }
              function A(t, e, r) {
                r = Math.min(t.length, r);
                for (var n = [], i = e; i < r; ) {
                  var o = t[i],
                    a = null,
                    s = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
                  if (i + s <= r) {
                    var u, l, c, h;
                    switch (s) {
                      case 1:
                        o < 128 && (a = o);
                        break;
                      case 2:
                        128 == (192 & (u = t[i + 1])) &&
                          (h = ((31 & o) << 6) | (63 & u)) > 127 &&
                          (a = h);
                        break;
                      case 3:
                        (u = t[i + 1]),
                          (l = t[i + 2]),
                          128 == (192 & u) &&
                            128 == (192 & l) &&
                            (h =
                              ((15 & o) << 12) | ((63 & u) << 6) | (63 & l)) >
                              2047 &&
                            (h < 55296 || h > 57343) &&
                            (a = h);
                        break;
                      case 4:
                        (u = t[i + 1]),
                          (l = t[i + 2]),
                          (c = t[i + 3]),
                          128 == (192 & u) &&
                            128 == (192 & l) &&
                            128 == (192 & c) &&
                            (h =
                              ((15 & o) << 18) |
                              ((63 & u) << 12) |
                              ((63 & l) << 6) |
                              (63 & c)) > 65535 &&
                            h < 1114112 &&
                            (a = h);
                    }
                  }
                  null === a
                    ? ((a = 65533), (s = 1))
                    : a > 65535 &&
                      ((a -= 65536),
                      n.push(((a >>> 10) & 1023) | 55296),
                      (a = 56320 | (1023 & a))),
                    n.push(a),
                    (i += s);
                }
                return P(n);
              }
              function P(t) {
                var e = t.length;
                if (e <= Q) return String.fromCharCode.apply(String, t);
                for (var r = '', n = 0; n < e; )
                  r += String.fromCharCode.apply(String, t.slice(n, (n += Q)));
                return r;
              }
              function j(t, e, r) {
                var n = '';
                r = Math.min(t.length, r);
                for (var i = e; i < r; ++i)
                  n += String.fromCharCode(127 & t[i]);
                return n;
              }
              function I(t, e, r) {
                var n = '';
                r = Math.min(t.length, r);
                for (var i = e; i < r; ++i) n += String.fromCharCode(t[i]);
                return n;
              }
              function T(t, e, r) {
                var n = t.length;
                (!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n);
                for (var i = '', o = e; o < r; ++o) i += H(t[o]);
                return i;
              }
              function B(t, e, r) {
                for (var n = t.slice(e, r), i = '', o = 0; o < n.length; o += 2)
                  i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                return i;
              }
              function L(t, e, r) {
                if (t % 1 != 0 || t < 0)
                  throw new RangeError('offset is not uint');
                if (t + e > r)
                  throw new RangeError('Trying to access beyond buffer length');
              }
              function O(t, e, r, n, i, a) {
                if (!o.isBuffer(t))
                  throw new TypeError(
                    '"buffer" argument must be a Buffer instance'
                  );
                if (e > i || e < a)
                  throw new RangeError('"value" argument is out of bounds');
                if (r + n > t.length)
                  throw new RangeError('Index out of range');
              }
              function N(t, e, r, n) {
                e < 0 && (e = 65535 + e + 1);
                for (var i = 0, o = Math.min(t.length - r, 2); i < o; ++i)
                  t[r + i] =
                    (e & (255 << (8 * (n ? i : 1 - i)))) >>>
                    (8 * (n ? i : 1 - i));
              }
              function R(t, e, r, n) {
                e < 0 && (e = 4294967295 + e + 1);
                for (var i = 0, o = Math.min(t.length - r, 4); i < o; ++i)
                  t[r + i] = (e >>> (8 * (n ? i : 3 - i))) & 255;
              }
              function M(t, e, r, n, i, o) {
                if (r + n > t.length)
                  throw new RangeError('Index out of range');
                if (r < 0) throw new RangeError('Index out of range');
              }
              function F(t, e, r, n, i) {
                return (
                  i ||
                    M(
                      t,
                      e,
                      r,
                      4,
                      3.4028234663852886e38,
                      -3.4028234663852886e38
                    ),
                  X.write(t, e, r, n, 23, 4),
                  r + 4
                );
              }
              function D(t, e, r, n, i) {
                return (
                  i ||
                    M(
                      t,
                      e,
                      r,
                      8,
                      1.7976931348623157e308,
                      -1.7976931348623157e308
                    ),
                  X.write(t, e, r, n, 52, 8),
                  r + 8
                );
              }
              function z(t) {
                if ((t = U(t).replace($, '')).length < 2) return '';
                for (; t.length % 4 != 0; ) t += '=';
                return t;
              }
              function U(t) {
                return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, '');
              }
              function H(t) {
                return t < 16 ? '0' + t.toString(16) : t.toString(16);
              }
              function G(t, e) {
                e = e || 1 / 0;
                for (var r, n = t.length, i = null, o = [], a = 0; a < n; ++a) {
                  if ((r = t.charCodeAt(a)) > 55295 && r < 57344) {
                    if (!i) {
                      if (r > 56319) {
                        (e -= 3) > -1 && o.push(239, 191, 189);
                        continue;
                      }
                      if (a + 1 === n) {
                        (e -= 3) > -1 && o.push(239, 191, 189);
                        continue;
                      }
                      i = r;
                      continue;
                    }
                    if (r < 56320) {
                      (e -= 3) > -1 && o.push(239, 191, 189), (i = r);
                      continue;
                    }
                    r = 65536 + (((i - 55296) << 10) | (r - 56320));
                  } else i && (e -= 3) > -1 && o.push(239, 191, 189);
                  if (((i = null), r < 128)) {
                    if ((e -= 1) < 0) break;
                    o.push(r);
                  } else if (r < 2048) {
                    if ((e -= 2) < 0) break;
                    o.push((r >> 6) | 192, (63 & r) | 128);
                  } else if (r < 65536) {
                    if ((e -= 3) < 0) break;
                    o.push(
                      (r >> 12) | 224,
                      ((r >> 6) & 63) | 128,
                      (63 & r) | 128
                    );
                  } else {
                    if (!(r < 1114112)) throw new Error('Invalid code point');
                    if ((e -= 4) < 0) break;
                    o.push(
                      (r >> 18) | 240,
                      ((r >> 12) & 63) | 128,
                      ((r >> 6) & 63) | 128,
                      (63 & r) | 128
                    );
                  }
                }
                return o;
              }
              function q(t) {
                for (var e = [], r = 0; r < t.length; ++r)
                  e.push(255 & t.charCodeAt(r));
                return e;
              }
              function Z(t, e) {
                for (
                  var r, n, i, o = [], a = 0;
                  a < t.length && !((e -= 2) < 0);
                  ++a
                )
                  (n = (r = t.charCodeAt(a)) >> 8),
                    (i = r % 256),
                    o.push(i),
                    o.push(n);
                return o;
              }
              function W(t) {
                return K.toByteArray(z(t));
              }
              function Y(t, e, r, n) {
                for (
                  var i = 0;
                  i < n && !(i + r >= e.length || i >= t.length);
                  ++i
                )
                  e[i + r] = t[i];
                return i;
              }
              function V(t) {
                return t !== t;
              }
              var K = t('base64-js'),
                X = t('ieee754'),
                J = t('isarray');
              (r.Buffer = o),
                (r.SlowBuffer = function (t) {
                  return +t != t && (t = 0), o.alloc(+t);
                }),
                (r.INSPECT_MAX_BYTES = 50),
                (o.TYPED_ARRAY_SUPPORT =
                  void 0 !== e.TYPED_ARRAY_SUPPORT
                    ? e.TYPED_ARRAY_SUPPORT
                    : (function () {
                        try {
                          var t = new Uint8Array(1);
                          return (
                            (t.__proto__ = {
                              __proto__: Uint8Array.prototype,
                              foo: function () {
                                return 42;
                              },
                            }),
                            42 === t.foo() &&
                              'function' == typeof t.subarray &&
                              0 === t.subarray(1, 1).byteLength
                          );
                        } catch (t) {
                          return !1;
                        }
                      })()),
                (r.kMaxLength = n()),
                (o.poolSize = 8192),
                (o._augment = function (t) {
                  return (t.__proto__ = o.prototype), t;
                }),
                (o.from = function (t, e, r) {
                  return a(null, t, e, r);
                }),
                o.TYPED_ARRAY_SUPPORT &&
                  ((o.prototype.__proto__ = Uint8Array.prototype),
                  (o.__proto__ = Uint8Array),
                  'undefined' != typeof Symbol &&
                    Symbol.species &&
                    o[Symbol.species] === o &&
                    Object.defineProperty(o, Symbol.species, {
                      value: null,
                      configurable: !0,
                    })),
                (o.alloc = function (t, e, r) {
                  return u(null, t, e, r);
                }),
                (o.allocUnsafe = function (t) {
                  return l(null, t);
                }),
                (o.allocUnsafeSlow = function (t) {
                  return l(null, t);
                }),
                (o.isBuffer = function (t) {
                  return !(null == t || !t._isBuffer);
                }),
                (o.compare = function (t, e) {
                  if (!o.isBuffer(t) || !o.isBuffer(e))
                    throw new TypeError('Arguments must be Buffers');
                  if (t === e) return 0;
                  for (
                    var r = t.length, n = e.length, i = 0, a = Math.min(r, n);
                    i < a;
                    ++i
                  )
                    if (t[i] !== e[i]) {
                      (r = t[i]), (n = e[i]);
                      break;
                    }
                  return r < n ? -1 : n < r ? 1 : 0;
                }),
                (o.isEncoding = function (t) {
                  switch (String(t).toLowerCase()) {
                    case 'hex':
                    case 'utf8':
                    case 'utf-8':
                    case 'ascii':
                    case 'latin1':
                    case 'binary':
                    case 'base64':
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                      return !0;
                    default:
                      return !1;
                  }
                }),
                (o.concat = function (t, e) {
                  if (!J(t))
                    throw new TypeError(
                      '"list" argument must be an Array of Buffers'
                    );
                  if (0 === t.length) return o.alloc(0);
                  var r;
                  if (void 0 === e)
                    for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
                  var n = o.allocUnsafe(e),
                    i = 0;
                  for (r = 0; r < t.length; ++r) {
                    var a = t[r];
                    if (!o.isBuffer(a))
                      throw new TypeError(
                        '"list" argument must be an Array of Buffers'
                      );
                    a.copy(n, i), (i += a.length);
                  }
                  return n;
                }),
                (o.byteLength = g),
                (o.prototype._isBuffer = !0),
                (o.prototype.swap16 = function () {
                  var t = this.length;
                  if (t % 2 != 0)
                    throw new RangeError(
                      'Buffer size must be a multiple of 16-bits'
                    );
                  for (var e = 0; e < t; e += 2) v(this, e, e + 1);
                  return this;
                }),
                (o.prototype.swap32 = function () {
                  var t = this.length;
                  if (t % 4 != 0)
                    throw new RangeError(
                      'Buffer size must be a multiple of 32-bits'
                    );
                  for (var e = 0; e < t; e += 4)
                    v(this, e, e + 3), v(this, e + 1, e + 2);
                  return this;
                }),
                (o.prototype.swap64 = function () {
                  var t = this.length;
                  if (t % 8 != 0)
                    throw new RangeError(
                      'Buffer size must be a multiple of 64-bits'
                    );
                  for (var e = 0; e < t; e += 8)
                    v(this, e, e + 7),
                      v(this, e + 1, e + 6),
                      v(this, e + 2, e + 5),
                      v(this, e + 3, e + 4);
                  return this;
                }),
                (o.prototype.toString = function () {
                  var t = 0 | this.length;
                  return 0 === t
                    ? ''
                    : 0 === arguments.length
                    ? A(this, 0, t)
                    : _.apply(this, arguments);
                }),
                (o.prototype.equals = function (t) {
                  if (!o.isBuffer(t))
                    throw new TypeError('Argument must be a Buffer');
                  return this === t || 0 === o.compare(this, t);
                }),
                (o.prototype.inspect = function () {
                  var t = '',
                    e = r.INSPECT_MAX_BYTES;
                  return (
                    this.length > 0 &&
                      ((t = this.toString('hex', 0, e)
                        .match(/.{2}/g)
                        .join(' ')),
                      this.length > e && (t += ' ... ')),
                    '<Buffer ' + t + '>'
                  );
                }),
                (o.prototype.compare = function (t, e, r, n, i) {
                  if (!o.isBuffer(t))
                    throw new TypeError('Argument must be a Buffer');
                  if (
                    (void 0 === e && (e = 0),
                    void 0 === r && (r = t ? t.length : 0),
                    void 0 === n && (n = 0),
                    void 0 === i && (i = this.length),
                    e < 0 || r > t.length || n < 0 || i > this.length)
                  )
                    throw new RangeError('out of range index');
                  if (n >= i && e >= r) return 0;
                  if (n >= i) return -1;
                  if (e >= r) return 1;
                  if (
                    ((e >>>= 0), (r >>>= 0), (n >>>= 0), (i >>>= 0), this === t)
                  )
                    return 0;
                  for (
                    var a = i - n,
                      s = r - e,
                      u = Math.min(a, s),
                      l = this.slice(n, i),
                      c = t.slice(e, r),
                      h = 0;
                    h < u;
                    ++h
                  )
                    if (l[h] !== c[h]) {
                      (a = l[h]), (s = c[h]);
                      break;
                    }
                  return a < s ? -1 : s < a ? 1 : 0;
                }),
                (o.prototype.includes = function (t, e, r) {
                  return -1 !== this.indexOf(t, e, r);
                }),
                (o.prototype.indexOf = function (t, e, r) {
                  return m(this, t, e, r, !0);
                }),
                (o.prototype.lastIndexOf = function (t, e, r) {
                  return m(this, t, e, r, !1);
                }),
                (o.prototype.write = function (t, e, r, n) {
                  if (void 0 === e) (n = 'utf8'), (r = this.length), (e = 0);
                  else if (void 0 === r && 'string' == typeof e)
                    (n = e), (r = this.length), (e = 0);
                  else {
                    if (!isFinite(e))
                      throw new Error(
                        'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                      );
                    (e |= 0),
                      isFinite(r)
                        ? ((r |= 0), void 0 === n && (n = 'utf8'))
                        : ((n = r), (r = void 0));
                  }
                  var i = this.length - e;
                  if (
                    ((void 0 === r || r > i) && (r = i),
                    (t.length > 0 && (r < 0 || e < 0)) || e > this.length)
                  )
                    throw new RangeError(
                      'Attempt to write outside buffer bounds'
                    );
                  n || (n = 'utf8');
                  for (var o = !1; ; )
                    switch (n) {
                      case 'hex':
                        return b(this, t, e, r);
                      case 'utf8':
                      case 'utf-8':
                        return w(this, t, e, r);
                      case 'ascii':
                        return x(this, t, e, r);
                      case 'latin1':
                      case 'binary':
                        return S(this, t, e, r);
                      case 'base64':
                        return C(this, t, e, r);
                      case 'ucs2':
                      case 'ucs-2':
                      case 'utf16le':
                      case 'utf-16le':
                        return k(this, t, e, r);
                      default:
                        if (o) throw new TypeError('Unknown encoding: ' + n);
                        (n = ('' + n).toLowerCase()), (o = !0);
                    }
                }),
                (o.prototype.toJSON = function () {
                  return {
                    type: 'Buffer',
                    data: Array.prototype.slice.call(this._arr || this, 0),
                  };
                });
              var Q = 4096;
              (o.prototype.slice = function (t, e) {
                var r = this.length;
                (t = ~~t),
                  (e = void 0 === e ? r : ~~e),
                  t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
                  e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r),
                  e < t && (e = t);
                var n;
                if (o.TYPED_ARRAY_SUPPORT)
                  (n = this.subarray(t, e)).__proto__ = o.prototype;
                else {
                  var i = e - t;
                  n = new o(i, void 0);
                  for (var a = 0; a < i; ++a) n[a] = this[a + t];
                }
                return n;
              }),
                (o.prototype.readUIntLE = function (t, e, r) {
                  (t |= 0), (e |= 0), r || L(t, e, this.length);
                  for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256); )
                    n += this[t + o] * i;
                  return n;
                }),
                (o.prototype.readUIntBE = function (t, e, r) {
                  (t |= 0), (e |= 0), r || L(t, e, this.length);
                  for (var n = this[t + --e], i = 1; e > 0 && (i *= 256); )
                    n += this[t + --e] * i;
                  return n;
                }),
                (o.prototype.readUInt8 = function (t, e) {
                  return e || L(t, 1, this.length), this[t];
                }),
                (o.prototype.readUInt16LE = function (t, e) {
                  return (
                    e || L(t, 2, this.length), this[t] | (this[t + 1] << 8)
                  );
                }),
                (o.prototype.readUInt16BE = function (t, e) {
                  return (
                    e || L(t, 2, this.length), (this[t] << 8) | this[t + 1]
                  );
                }),
                (o.prototype.readUInt32LE = function (t, e) {
                  return (
                    e || L(t, 4, this.length),
                    (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                      16777216 * this[t + 3]
                  );
                }),
                (o.prototype.readUInt32BE = function (t, e) {
                  return (
                    e || L(t, 4, this.length),
                    16777216 * this[t] +
                      ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
                  );
                }),
                (o.prototype.readIntLE = function (t, e, r) {
                  (t |= 0), (e |= 0), r || L(t, e, this.length);
                  for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256); )
                    n += this[t + o] * i;
                  return (i *= 128), n >= i && (n -= Math.pow(2, 8 * e)), n;
                }),
                (o.prototype.readIntBE = function (t, e, r) {
                  (t |= 0), (e |= 0), r || L(t, e, this.length);
                  for (
                    var n = e, i = 1, o = this[t + --n];
                    n > 0 && (i *= 256);

                  )
                    o += this[t + --n] * i;
                  return (i *= 128), o >= i && (o -= Math.pow(2, 8 * e)), o;
                }),
                (o.prototype.readInt8 = function (t, e) {
                  return (
                    e || L(t, 1, this.length),
                    128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
                  );
                }),
                (o.prototype.readInt16LE = function (t, e) {
                  e || L(t, 2, this.length);
                  var r = this[t] | (this[t + 1] << 8);
                  return 32768 & r ? 4294901760 | r : r;
                }),
                (o.prototype.readInt16BE = function (t, e) {
                  e || L(t, 2, this.length);
                  var r = this[t + 1] | (this[t] << 8);
                  return 32768 & r ? 4294901760 | r : r;
                }),
                (o.prototype.readInt32LE = function (t, e) {
                  return (
                    e || L(t, 4, this.length),
                    this[t] |
                      (this[t + 1] << 8) |
                      (this[t + 2] << 16) |
                      (this[t + 3] << 24)
                  );
                }),
                (o.prototype.readInt32BE = function (t, e) {
                  return (
                    e || L(t, 4, this.length),
                    (this[t] << 24) |
                      (this[t + 1] << 16) |
                      (this[t + 2] << 8) |
                      this[t + 3]
                  );
                }),
                (o.prototype.readFloatLE = function (t, e) {
                  return e || L(t, 4, this.length), X.read(this, t, !0, 23, 4);
                }),
                (o.prototype.readFloatBE = function (t, e) {
                  return e || L(t, 4, this.length), X.read(this, t, !1, 23, 4);
                }),
                (o.prototype.readDoubleLE = function (t, e) {
                  return e || L(t, 8, this.length), X.read(this, t, !0, 52, 8);
                }),
                (o.prototype.readDoubleBE = function (t, e) {
                  return e || L(t, 8, this.length), X.read(this, t, !1, 52, 8);
                }),
                (o.prototype.writeUIntLE = function (t, e, r, n) {
                  (t = +t),
                    (e |= 0),
                    (r |= 0),
                    n || O(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                  var i = 1,
                    o = 0;
                  for (this[e] = 255 & t; ++o < r && (i *= 256); )
                    this[e + o] = (t / i) & 255;
                  return e + r;
                }),
                (o.prototype.writeUIntBE = function (t, e, r, n) {
                  (t = +t),
                    (e |= 0),
                    (r |= 0),
                    n || O(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                  var i = r - 1,
                    o = 1;
                  for (this[e + i] = 255 & t; --i >= 0 && (o *= 256); )
                    this[e + i] = (t / o) & 255;
                  return e + r;
                }),
                (o.prototype.writeUInt8 = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 1, 255, 0),
                    o.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                    (this[e] = 255 & t),
                    e + 1
                  );
                }),
                (o.prototype.writeUInt16LE = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 2, 65535, 0),
                    o.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                      : N(this, t, e, !0),
                    e + 2
                  );
                }),
                (o.prototype.writeUInt16BE = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 2, 65535, 0),
                    o.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                      : N(this, t, e, !1),
                    e + 2
                  );
                }),
                (o.prototype.writeUInt32LE = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 4, 4294967295, 0),
                    o.TYPED_ARRAY_SUPPORT
                      ? ((this[e + 3] = t >>> 24),
                        (this[e + 2] = t >>> 16),
                        (this[e + 1] = t >>> 8),
                        (this[e] = 255 & t))
                      : R(this, t, e, !0),
                    e + 4
                  );
                }),
                (o.prototype.writeUInt32BE = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 4, 4294967295, 0),
                    o.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = t >>> 24),
                        (this[e + 1] = t >>> 16),
                        (this[e + 2] = t >>> 8),
                        (this[e + 3] = 255 & t))
                      : R(this, t, e, !1),
                    e + 4
                  );
                }),
                (o.prototype.writeIntLE = function (t, e, r, n) {
                  if (((t = +t), (e |= 0), !n)) {
                    var i = Math.pow(2, 8 * r - 1);
                    O(this, t, e, r, i - 1, -i);
                  }
                  var o = 0,
                    a = 1,
                    s = 0;
                  for (this[e] = 255 & t; ++o < r && (a *= 256); )
                    t < 0 && 0 === s && 0 !== this[e + o - 1] && (s = 1),
                      (this[e + o] = (((t / a) >> 0) - s) & 255);
                  return e + r;
                }),
                (o.prototype.writeIntBE = function (t, e, r, n) {
                  if (((t = +t), (e |= 0), !n)) {
                    var i = Math.pow(2, 8 * r - 1);
                    O(this, t, e, r, i - 1, -i);
                  }
                  var o = r - 1,
                    a = 1,
                    s = 0;
                  for (this[e + o] = 255 & t; --o >= 0 && (a *= 256); )
                    t < 0 && 0 === s && 0 !== this[e + o + 1] && (s = 1),
                      (this[e + o] = (((t / a) >> 0) - s) & 255);
                  return e + r;
                }),
                (o.prototype.writeInt8 = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 1, 127, -128),
                    o.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                    t < 0 && (t = 255 + t + 1),
                    (this[e] = 255 & t),
                    e + 1
                  );
                }),
                (o.prototype.writeInt16LE = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 2, 32767, -32768),
                    o.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                      : N(this, t, e, !0),
                    e + 2
                  );
                }),
                (o.prototype.writeInt16BE = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 2, 32767, -32768),
                    o.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                      : N(this, t, e, !1),
                    e + 2
                  );
                }),
                (o.prototype.writeInt32LE = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 4, 2147483647, -2147483648),
                    o.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = 255 & t),
                        (this[e + 1] = t >>> 8),
                        (this[e + 2] = t >>> 16),
                        (this[e + 3] = t >>> 24))
                      : R(this, t, e, !0),
                    e + 4
                  );
                }),
                (o.prototype.writeInt32BE = function (t, e, r) {
                  return (
                    (t = +t),
                    (e |= 0),
                    r || O(this, t, e, 4, 2147483647, -2147483648),
                    t < 0 && (t = 4294967295 + t + 1),
                    o.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = t >>> 24),
                        (this[e + 1] = t >>> 16),
                        (this[e + 2] = t >>> 8),
                        (this[e + 3] = 255 & t))
                      : R(this, t, e, !1),
                    e + 4
                  );
                }),
                (o.prototype.writeFloatLE = function (t, e, r) {
                  return F(this, t, e, !0, r);
                }),
                (o.prototype.writeFloatBE = function (t, e, r) {
                  return F(this, t, e, !1, r);
                }),
                (o.prototype.writeDoubleLE = function (t, e, r) {
                  return D(this, t, e, !0, r);
                }),
                (o.prototype.writeDoubleBE = function (t, e, r) {
                  return D(this, t, e, !1, r);
                }),
                (o.prototype.copy = function (t, e, r, n) {
                  if (
                    (r || (r = 0),
                    n || 0 === n || (n = this.length),
                    e >= t.length && (e = t.length),
                    e || (e = 0),
                    n > 0 && n < r && (n = r),
                    n === r)
                  )
                    return 0;
                  if (0 === t.length || 0 === this.length) return 0;
                  if (e < 0) throw new RangeError('targetStart out of bounds');
                  if (r < 0 || r >= this.length)
                    throw new RangeError('sourceStart out of bounds');
                  if (n < 0) throw new RangeError('sourceEnd out of bounds');
                  n > this.length && (n = this.length),
                    t.length - e < n - r && (n = t.length - e + r);
                  var i,
                    a = n - r;
                  if (this === t && r < e && e < n)
                    for (i = a - 1; i >= 0; --i) t[i + e] = this[i + r];
                  else if (a < 1e3 || !o.TYPED_ARRAY_SUPPORT)
                    for (i = 0; i < a; ++i) t[i + e] = this[i + r];
                  else
                    Uint8Array.prototype.set.call(
                      t,
                      this.subarray(r, r + a),
                      e
                    );
                  return a;
                }),
                (o.prototype.fill = function (t, e, r, n) {
                  if ('string' == typeof t) {
                    if (
                      ('string' == typeof e
                        ? ((n = e), (e = 0), (r = this.length))
                        : 'string' == typeof r && ((n = r), (r = this.length)),
                      1 === t.length)
                    ) {
                      var i = t.charCodeAt(0);
                      i < 256 && (t = i);
                    }
                    if (void 0 !== n && 'string' != typeof n)
                      throw new TypeError('encoding must be a string');
                    if ('string' == typeof n && !o.isEncoding(n))
                      throw new TypeError('Unknown encoding: ' + n);
                  } else 'number' == typeof t && (t &= 255);
                  if (e < 0 || this.length < e || this.length < r)
                    throw new RangeError('Out of range index');
                  if (r <= e) return this;
                  (e >>>= 0),
                    (r = void 0 === r ? this.length : r >>> 0),
                    t || (t = 0);
                  var a;
                  if ('number' == typeof t) for (a = e; a < r; ++a) this[a] = t;
                  else {
                    var s = o.isBuffer(t) ? t : G(new o(t, n).toString()),
                      u = s.length;
                    for (a = 0; a < r - e; ++a) this[a + e] = s[a % u];
                  }
                  return this;
                });
              var $ = /[^+\/0-9A-Za-z-_]/g;
            }).call(
              this,
              'undefined' != typeof global
                ? global
                : 'undefined' != typeof self
                ? self
                : 'undefined' != typeof window
                ? window
                : {}
            );
          },
          { 'base64-js': 45, ieee754: 166, isarray: 169 },
        ],
        61: [
          function (t, e, r) {
            (function (t) {
              var r = (function () {
                function e(r, i, o, a) {
                  function s(r, o) {
                    if (null === r) return null;
                    if (0 == o) return r;
                    var h, f;
                    if ('object' != typeof r) return r;
                    if (e.__isArray(r)) h = [];
                    else if (e.__isRegExp(r))
                      (h = new RegExp(r.source, n(r))),
                        r.lastIndex && (h.lastIndex = r.lastIndex);
                    else if (e.__isDate(r)) h = new Date(r.getTime());
                    else {
                      if (c && t.isBuffer(r))
                        return (h = new t(r.length)), r.copy(h), h;
                      void 0 === a
                        ? ((f = Object.getPrototypeOf(r)),
                          (h = Object.create(f)))
                        : ((h = Object.create(a)), (f = a));
                    }
                    if (i) {
                      var d = u.indexOf(r);
                      if (-1 != d) return l[d];
                      u.push(r), l.push(h);
                    }
                    for (var p in r) {
                      var g;
                      f && (g = Object.getOwnPropertyDescriptor(f, p)),
                        (g && null == g.set) || (h[p] = s(r[p], o - 1));
                    }
                    return h;
                  }
                  'object' == typeof i &&
                    ((o = i.depth),
                    (a = i.prototype),
                    i.filter,
                    (i = i.circular));
                  var u = [],
                    l = [],
                    c = void 0 !== t;
                  return (
                    void 0 === i && (i = !0),
                    void 0 === o && (o = 1 / 0),
                    s(r, o)
                  );
                }
                function r(t) {
                  return Object.prototype.toString.call(t);
                }
                function n(t) {
                  var e = '';
                  return (
                    t.global && (e += 'g'),
                    t.ignoreCase && (e += 'i'),
                    t.multiline && (e += 'm'),
                    e
                  );
                }
                return (
                  (e.clonePrototype = function (t) {
                    if (null === t) return null;
                    var e = function () {};
                    return (e.prototype = t), new e();
                  }),
                  (e.__objToStr = r),
                  (e.__isDate = function (t) {
                    return 'object' == typeof t && '[object Date]' === r(t);
                  }),
                  (e.__isArray = function (t) {
                    return 'object' == typeof t && '[object Array]' === r(t);
                  }),
                  (e.__isRegExp = function (t) {
                    return 'object' == typeof t && '[object RegExp]' === r(t);
                  }),
                  (e.__getRegExpFlags = n),
                  e
                );
              })();
              'object' == typeof e && e.localExports && (e.localExports = r);
            }).call(this, t('buffer').Buffer);
          },
          { buffer: 60 },
        ],
        62: [
          function (t, e, r) {
            t('../../modules/es6.string.iterator'),
              t('../../modules/es6.array.from'),
              (e.localExports = t('../../modules/_core').Array.from);
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.array.from': 143,
            '../../modules/es6.string.iterator': 155,
          },
        ],
        63: [
          function (t, e, r) {
            t('../modules/web.dom.iterable'),
              t('../modules/es6.string.iterator'),
              (e.localExports = t('../modules/core.get-iterator'));
          },
          {
            '../modules/core.get-iterator': 141,
            '../modules/es6.string.iterator': 155,
            '../modules/web.dom.iterable': 159,
          },
        ],
        64: [
          function (t, e, r) {
            t('../modules/web.dom.iterable'),
              t('../modules/es6.string.iterator'),
              (e.localExports = t('../modules/core.is-iterable'));
          },
          {
            '../modules/core.is-iterable': 142,
            '../modules/es6.string.iterator': 155,
            '../modules/web.dom.iterable': 159,
          },
        ],
        65: [
          function (t, e, r) {
            t('../../modules/es6.object.assign'),
              (e.localExports = t('../../modules/_core').Object.assign);
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.assign': 145,
          },
        ],
        66: [
          function (t, e, r) {
            t('../../modules/es6.object.create');
            var n = t('../../modules/_core').Object;
            e.localExports = function (t, e) {
              return n.create(t, e);
            };
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.create': 146,
          },
        ],
        67: [
          function (t, e, r) {
            t('../../modules/es6.object.define-properties');
            var n = t('../../modules/_core').Object;
            e.localExports = function (t, e) {
              return n.defineProperties(t, e);
            };
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.define-properties': 147,
          },
        ],
        68: [
          function (t, e, r) {
            t('../../modules/es6.object.define-property');
            var n = t('../../modules/_core').Object;
            e.localExports = function (t, e, r) {
              return n.defineProperty(t, e, r);
            };
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.define-property': 148,
          },
        ],
        69: [
          function (t, e, r) {
            t('../../modules/es6.object.freeze'),
              (e.localExports = t('../../modules/_core').Object.freeze);
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.freeze': 149,
          },
        ],
        70: [
          function (t, e, r) {
            t('../../modules/es6.object.get-own-property-descriptor');
            var n = t('../../modules/_core').Object;
            e.localExports = function (t, e) {
              return n.getOwnPropertyDescriptor(t, e);
            };
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.get-own-property-descriptor': 150,
          },
        ],
        71: [
          function (t, e, r) {
            t('../../modules/es6.object.get-prototype-of'),
              (e.localExports = t('../../modules/_core').Object.getPrototypeOf);
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.get-prototype-of': 151,
          },
        ],
        72: [
          function (t, e, r) {
            t('../../modules/es6.object.keys'),
              (e.localExports = t('../../modules/_core').Object.keys);
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.keys': 152,
          },
        ],
        73: [
          function (t, e, r) {
            t('../../modules/es6.object.set-prototype-of'),
              (e.localExports = t('../../modules/_core').Object.setPrototypeOf);
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.set-prototype-of': 153,
          },
        ],
        74: [
          function (t, e, r) {
            t('../../modules/es6.symbol'),
              t('../../modules/es6.object.to-string'),
              t('../../modules/es7.symbol.async-iterator'),
              t('../../modules/es7.symbol.observable'),
              (e.localExports = t('../../modules/_core').Symbol);
          },
          {
            '../../modules/_core': 82,
            '../../modules/es6.object.to-string': 154,
            '../../modules/es6.symbol': 156,
            '../../modules/es7.symbol.async-iterator': 157,
            '../../modules/es7.symbol.observable': 158,
          },
        ],
        75: [
          function (t, e, r) {
            t('../../modules/es6.string.iterator'),
              t('../../modules/web.dom.iterable'),
              (e.localExports = t('../../modules/_wks-ext').f('iterator'));
          },
          {
            '../../modules/_wks-ext': 138,
            '../../modules/es6.string.iterator': 155,
            '../../modules/web.dom.iterable': 159,
          },
        ],
        76: [
          function (t, e, r) {
            e.localExports = function (t) {
              if ('function' != typeof t)
                throw TypeError(t + ' is not a function!');
              return t;
            };
          },
          {},
        ],
        77: [
          function (t, e, r) {
            e.localExports = function () {};
          },
          {},
        ],
        78: [
          function (t, e, r) {
            var n = t('./_is-object');
            e.localExports = function (t) {
              if (!n(t)) throw TypeError(t + ' is not an object!');
              return t;
            };
          },
          { './_is-object': 100 },
        ],
        79: [
          function (t, e, r) {
            var n = t('./_to-iobject'),
              i = t('./_to-length'),
              o = t('./_to-index');
            e.localExports = function (t) {
              return function (e, r, a) {
                var s,
                  u = n(e),
                  l = i(u.length),
                  c = o(a, l);
                if (t && r != r) {
                  for (; l > c; ) if ((s = u[c++]) != s) return !0;
                } else
                  for (; l > c; c++)
                    if ((t || c in u) && u[c] === r) return t || c || 0;
                return !t && -1;
              };
            };
          },
          {
            './_to-index': 130,
            './_to-iobject': 132,
            './_to-length': 133,
          },
        ],
        80: [
          function (t, e, r) {
            var n = t('./_cof'),
              i = t('./_wks')('toStringTag'),
              o =
                'Arguments' ==
                n(
                  (function () {
                    return arguments;
                  })()
                ),
              a = function (t, e) {
                try {
                  return t[e];
                } catch (t) {}
              };
            e.localExports = function (t) {
              var e, r, s;
              return void 0 === t
                ? 'Undefined'
                : null === t
                ? 'Null'
                : 'string' == typeof (r = a((e = Object(t)), i))
                ? r
                : o
                ? n(e)
                : 'Object' == (s = n(e)) && 'function' == typeof e.callee
                ? 'Arguments'
                : s;
            };
          },
          { './_cof': 81, './_wks': 139 },
        ],
        81: [
          function (t, e, r) {
            var n = {}.toString;
            e.localExports = function (t) {
              return n.call(t).slice(8, -1);
            };
          },
          {},
        ],
        82: [
          function (t, e, r) {
            var n,
              i = (e.localExports = { version: '2.4.0' });
            'number' == typeof n && (n = i);
          },
          {},
        ],
        83: [
          function (t, e, r) {
            var n = t('./_object-dp'),
              i = t('./_property-desc');
            e.localExports = function (t, e, r) {
              e in t ? n.f(t, e, i(0, r)) : (t[e] = r);
            };
          },
          { './_object-dp': 112, './_property-desc': 123 },
        ],
        84: [
          function (t, e, r) {
            var n = t('./_a-function');
            e.localExports = function (t, e, r) {
              if ((n(t), void 0 === e)) return t;
              switch (r) {
                case 1:
                  return function (r) {
                    return t.call(e, r);
                  };
                case 2:
                  return function (r, n) {
                    return t.call(e, r, n);
                  };
                case 3:
                  return function (r, n, i) {
                    return t.call(e, r, n, i);
                  };
              }
              return function () {
                return t.apply(e, arguments);
              };
            };
          },
          { './_a-function': 76 },
        ],
        85: [
          function (t, e, r) {
            e.localExports = function (t) {
              if (void 0 == t) throw TypeError("Can't call method on  " + t);
              return t;
            };
          },
          {},
        ],
        86: [
          function (t, e, r) {
            e.localExports = !t('./_fails')(function () {
              return (
                7 !=
                Object.defineProperty({}, 'a', {
                  get: function () {
                    return 7;
                  },
                }).a
              );
            });
          },
          { './_fails': 91 },
        ],
        87: [
          function (t, e, r) {
            var n = t('./_is-object'),
              i = t('./_global').document,
              o = n(i) && n(i.createElement);
            e.localExports = function (t) {
              return o ? i.createElement(t) : {};
            };
          },
          { './_global': 92, './_is-object': 100 },
        ],
        88: [
          function (t, e, r) {
            e.localExports =
              'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(
                ','
              );
          },
          {},
        ],
        89: [
          function (t, e, r) {
            var n = t('./_object-keys'),
              i = t('./_object-gops'),
              o = t('./_object-pie');
            e.localExports = function (t) {
              var e = n(t),
                r = i.f;
              if (r)
                for (var a, s = r(t), u = o.f, l = 0; s.length > l; )
                  u.call(t, (a = s[l++])) && e.push(a);
              return e;
            };
          },
          {
            './_object-gops': 117,
            './_object-keys': 120,
            './_object-pie': 121,
          },
        ],
        90: [
          function (t, e, r) {
            var n = t('./_global'),
              i = t('./_core'),
              o = t('./_ctx'),
              a = t('./_hide'),
              s = function (t, e, r) {
                var u,
                  l,
                  c,
                  h = t & s.F,
                  f = t & s.G,
                  d = t & s.S,
                  p = t & s.P,
                  g = t & s.B,
                  _ = t & s.W,
                  v = f ? i : i[e] || (i[e] = {}),
                  m = v.prototype,
                  y = f ? n : d ? n[e] : (n[e] || {}).prototype;
                f && (r = e);
                for (u in r)
                  ((l = !h && y && void 0 !== y[u]) && u in v) ||
                    ((c = l ? y[u] : r[u]),
                    (v[u] =
                      f && 'function' != typeof y[u]
                        ? r[u]
                        : g && l
                        ? o(c, n)
                        : _ && y[u] == c
                        ? (function (t) {
                            var e = function (e, r, n) {
                              if (this instanceof t) {
                                switch (arguments.length) {
                                  case 0:
                                    return new t();
                                  case 1:
                                    return new t(e);
                                  case 2:
                                    return new t(e, r);
                                }
                                return new t(e, r, n);
                              }
                              return t.apply(this, arguments);
                            };
                            return (e.prototype = t.prototype), e;
                          })(c)
                        : p && 'function' == typeof c
                        ? o(Function.call, c)
                        : c),
                    p &&
                      (((v.virtual || (v.virtual = {}))[u] = c),
                      t & s.R && m && !m[u] && a(m, u, c)));
              };
            (s.F = 1),
              (s.G = 2),
              (s.S = 4),
              (s.P = 8),
              (s.B = 16),
              (s.W = 32),
              (s.U = 64),
              (s.R = 128),
              (e.localExports = s);
          },
          {
            './_core': 82,
            './_ctx': 84,
            './_global': 92,
            './_hide': 94,
          },
        ],
        91: [
          function (t, e, r) {
            e.localExports = function (t) {
              try {
                return !!t();
              } catch (t) {
                return !0;
              }
            };
          },
          {},
        ],
        92: [
          function (t, e, r) {
            var n,
              i = (e.localExports =
                'undefined' != typeof window && window.Math == Math
                  ? window
                  : 'undefined' != typeof self && self.Math == Math
                  ? self
                  : Function('return this')());
            'number' == typeof n && (n = i);
          },
          {},
        ],
        93: [
          function (t, e, r) {
            var n = {}.hasOwnProperty;
            e.localExports = function (t, e) {
              return n.call(t, e);
            };
          },
          {},
        ],
        94: [
          function (t, e, r) {
            var n = t('./_object-dp'),
              i = t('./_property-desc');
            e.localExports = t('./_descriptors')
              ? function (t, e, r) {
                  return n.f(t, e, i(1, r));
                }
              : function (t, e, r) {
                  return (t[e] = r), t;
                };
          },
          {
            './_descriptors': 86,
            './_object-dp': 112,
            './_property-desc': 123,
          },
        ],
        95: [
          function (t, e, r) {
            e.localExports =
              t('./_global').document && document.documentElement;
          },
          { './_global': 92 },
        ],
        96: [
          function (t, e, r) {
            e.localExports =
              !t('./_descriptors') &&
              !t('./_fails')(function () {
                return (
                  7 !=
                  Object.defineProperty(t('./_dom-create')('div'), 'a', {
                    get: function () {
                      return 7;
                    },
                  }).a
                );
              });
          },
          {
            './_descriptors': 86,
            './_dom-create': 87,
            './_fails': 91,
          },
        ],
        97: [
          function (t, e, r) {
            var n = t('./_cof');
            e.localExports = Object('z').propertyIsEnumerable(0)
              ? Object
              : function (t) {
                  return 'String' == n(t) ? t.split('') : Object(t);
                };
          },
          { './_cof': 81 },
        ],
        98: [
          function (t, e, r) {
            var n = t('./_iterators'),
              i = t('./_wks')('iterator'),
              o = Array.prototype;
            e.localExports = function (t) {
              return void 0 !== t && (n.Array === t || o[i] === t);
            };
          },
          { './_iterators': 106, './_wks': 139 },
        ],
        99: [
          function (t, e, r) {
            var n = t('./_cof');
            e.localExports =
              Array.isArray ||
              function (t) {
                return 'Array' == n(t);
              };
          },
          { './_cof': 81 },
        ],
        100: [
          function (t, e, r) {
            e.localExports = function (t) {
              return 'object' == typeof t ? null !== t : 'function' == typeof t;
            };
          },
          {},
        ],
        101: [
          function (t, e, r) {
            var n = t('./_an-object');
            e.localExports = function (t, e, r, i) {
              try {
                return i ? e(n(r)[0], r[1]) : e(r);
              } catch (e) {
                var o = t.return;
                throw (void 0 !== o && n(o.call(t)), e);
              }
            };
          },
          { './_an-object': 78 },
        ],
        102: [
          function (t, e, r) {
            var n = t('./_object-create'),
              i = t('./_property-desc'),
              o = t('./_set-to-string-tag'),
              a = {};
            t('./_hide')(a, t('./_wks')('iterator'), function () {
              return this;
            }),
              (e.localExports = function (t, e, r) {
                (t.prototype = n(a, { next: i(1, r) })), o(t, e + ' Iterator');
              });
          },
          {
            './_hide': 94,
            './_object-create': 111,
            './_property-desc': 123,
            './_set-to-string-tag': 126,
            './_wks': 139,
          },
        ],
        103: [
          function (t, e, r) {
            var n = t('./_library'),
              i = t('./_export'),
              o = t('./_redefine'),
              a = t('./_hide'),
              s = t('./_has'),
              u = t('./_iterators'),
              l = t('./_iter-create'),
              c = t('./_set-to-string-tag'),
              h = t('./_object-gpo'),
              f = t('./_wks')('iterator'),
              d = !([].keys && 'next' in [].keys()),
              p = function () {
                return this;
              };
            e.localExports = function (t, e, r, g, _, v, m) {
              l(r, e, g);
              var y,
                b,
                w,
                x = function (t) {
                  if (!d && t in E) return E[t];
                  switch (t) {
                    case 'keys':
                    case 'values':
                      return function () {
                        return new r(this, t);
                      };
                  }
                  return function () {
                    return new r(this, t);
                  };
                },
                S = e + ' Iterator',
                C = 'values' == _,
                k = !1,
                E = t.prototype,
                A = E[f] || E['@@iterator'] || (_ && E[_]),
                P = A || x(_),
                j = _ ? (C ? x('entries') : P) : void 0,
                I = 'Array' == e ? E.entries || A : A;
              if (
                (I &&
                  (w = h(I.call(new t()))) !== Object.prototype &&
                  (c(w, S, !0), n || s(w, f) || a(w, f, p)),
                C &&
                  A &&
                  'values' !== A.name &&
                  ((k = !0),
                  (P = function () {
                    return A.call(this);
                  })),
                (n && !m) || (!d && !k && E[f]) || a(E, f, P),
                (u[e] = P),
                (u[S] = p),
                _)
              )
                if (
                  ((y = {
                    values: C ? P : x('values'),
                    keys: v ? P : x('keys'),
                    entries: j,
                  }),
                  m)
                )
                  for (b in y) b in E || o(E, b, y[b]);
                else i(i.P + i.F * (d || k), e, y);
              return y;
            };
          },
          {
            './_export': 90,
            './_has': 93,
            './_hide': 94,
            './_iter-create': 102,
            './_iterators': 106,
            './_library': 108,
            './_object-gpo': 118,
            './_redefine': 124,
            './_set-to-string-tag': 126,
            './_wks': 139,
          },
        ],
        104: [
          function (t, e, r) {
            var n = t('./_wks')('iterator'),
              i = !1;
            try {
              var o = [7][n]();
              (o.return = function () {
                i = !0;
              }),
                Array.from(o, function () {
                  throw 2;
                });
            } catch (t) {}
            e.localExports = function (t, e) {
              if (!e && !i) return !1;
              var r = !1;
              try {
                var o = [7],
                  a = o[n]();
                (a.next = function () {
                  return { done: (r = !0) };
                }),
                  (o[n] = function () {
                    return a;
                  }),
                  t(o);
              } catch (t) {}
              return r;
            };
          },
          { './_wks': 139 },
        ],
        105: [
          function (t, e, r) {
            e.localExports = function (t, e) {
              return { value: e, done: !!t };
            };
          },
          {},
        ],
        106: [
          function (t, e, r) {
            e.localExports = {};
          },
          {},
        ],
        107: [
          function (t, e, r) {
            var n = t('./_object-keys'),
              i = t('./_to-iobject');
            e.localExports = function (t, e) {
              for (var r, o = i(t), a = n(o), s = a.length, u = 0; s > u; )
                if (o[(r = a[u++])] === e) return r;
            };
          },
          { './_object-keys': 120, './_to-iobject': 132 },
        ],
        108: [
          function (t, e, r) {
            e.localExports = !0;
          },
          {},
        ],
        109: [
          function (t, e, r) {
            var n = t('./_uid')('meta'),
              i = t('./_is-object'),
              o = t('./_has'),
              a = t('./_object-dp').f,
              s = 0,
              u =
                Object.isExtensible ||
                function () {
                  return !0;
                },
              l = !t('./_fails')(function () {
                return u(Object.preventExtensions({}));
              }),
              c = function (t) {
                a(t, n, { value: { i: 'O' + ++s, w: {} } });
              },
              h = (e.localExports = {
                KEY: n,
                NEED: !1,
                fastKey: function (t, e) {
                  if (!i(t))
                    return 'symbol' == typeof t
                      ? t
                      : ('string' == typeof t ? 'S' : 'P') + t;
                  if (!o(t, n)) {
                    if (!u(t)) return 'F';
                    if (!e) return 'E';
                    c(t);
                  }
                  return t[n].i;
                },
                getWeak: function (t, e) {
                  if (!o(t, n)) {
                    if (!u(t)) return !0;
                    if (!e) return !1;
                    c(t);
                  }
                  return t[n].w;
                },
                onFreeze: function (t) {
                  return l && h.NEED && u(t) && !o(t, n) && c(t), t;
                },
              });
          },
          {
            './_fails': 91,
            './_has': 93,
            './_is-object': 100,
            './_object-dp': 112,
            './_uid': 136,
          },
        ],
        110: [
          function (t, e, r) {
            var n = t('./_object-keys'),
              i = t('./_object-gops'),
              o = t('./_object-pie'),
              a = t('./_to-object'),
              s = t('./_iobject'),
              u = Object.assign;
            e.localExports =
              !u ||
              t('./_fails')(function () {
                var t = {},
                  e = {},
                  r = Symbol(),
                  n = 'abcdefghijklmnopqrst';
                return (
                  (t[r] = 7),
                  n.split('').forEach(function (t) {
                    e[t] = t;
                  }),
                  7 != u({}, t)[r] || Object.keys(u({}, e)).join('') != n
                );
              })
                ? function (t, e) {
                    for (
                      var r = a(t),
                        u = arguments.length,
                        l = 1,
                        c = i.f,
                        h = o.f;
                      u > l;

                    )
                      for (
                        var f,
                          d = s(arguments[l++]),
                          p = c ? n(d).concat(c(d)) : n(d),
                          g = p.length,
                          _ = 0;
                        g > _;

                      )
                        h.call(d, (f = p[_++])) && (r[f] = d[f]);
                    return r;
                  }
                : u;
          },
          {
            './_fails': 91,
            './_iobject': 97,
            './_object-gops': 117,
            './_object-keys': 120,
            './_object-pie': 121,
            './_to-object': 134,
          },
        ],
        111: [
          function (t, e, r) {
            var n = t('./_an-object'),
              i = t('./_object-dps'),
              o = t('./_enum-bug-keys'),
              a = t('./_shared-key')('IE_PROTO'),
              s = function () {},
              u = function () {
                var e,
                  r = t('./_dom-create')('iframe'),
                  n = o.length;
                for (
                  r.style.display = 'none',
                    t('./_html').appendChild(r),
                    r.src = 'javascript:',
                    (e = r.contentWindow.document).open(),
                    e.write('<script>document.F=Object</script>'),
                    e.close(),
                    u = e.F;
                  n--;

                )
                  delete u.prototype[o[n]];
                return u();
              };
            e.localExports =
              Object.create ||
              function (t, e) {
                var r;
                return (
                  null !== t
                    ? ((s.prototype = n(t)),
                      (r = new s()),
                      (s.prototype = null),
                      (r[a] = t))
                    : (r = u()),
                  void 0 === e ? r : i(r, e)
                );
              };
          },
          {
            './_an-object': 78,
            './_dom-create': 87,
            './_enum-bug-keys': 88,
            './_html': 95,
            './_object-dps': 113,
            './_shared-key': 127,
          },
        ],
        112: [
          function (t, e, r) {
            var n = t('./_an-object'),
              i = t('./_ie8-dom-define'),
              o = t('./_to-primitive'),
              a = Object.defineProperty;
            r.f = t('./_descriptors')
              ? Object.defineProperty
              : function (t, e, r) {
                  if ((n(t), (e = o(e, !0)), n(r), i))
                    try {
                      return a(t, e, r);
                    } catch (t) {}
                  if ('get' in r || 'set' in r)
                    throw TypeError('Accessors not supported!');
                  return 'value' in r && (t[e] = r.value), t;
                };
          },
          {
            './_an-object': 78,
            './_descriptors': 86,
            './_ie8-dom-define': 96,
            './_to-primitive': 135,
          },
        ],
        113: [
          function (t, e, r) {
            var n = t('./_object-dp'),
              i = t('./_an-object'),
              o = t('./_object-keys');
            e.localExports = t('./_descriptors')
              ? Object.defineProperties
              : function (t, e) {
                  i(t);
                  for (var r, a = o(e), s = a.length, u = 0; s > u; )
                    n.f(t, (r = a[u++]), e[r]);
                  return t;
                };
          },
          {
            './_an-object': 78,
            './_descriptors': 86,
            './_object-dp': 112,
            './_object-keys': 120,
          },
        ],
        114: [
          function (t, e, r) {
            var n = t('./_object-pie'),
              i = t('./_property-desc'),
              o = t('./_to-iobject'),
              a = t('./_to-primitive'),
              s = t('./_has'),
              u = t('./_ie8-dom-define'),
              l = Object.getOwnPropertyDescriptor;
            r.f = t('./_descriptors')
              ? l
              : function (t, e) {
                  if (((t = o(t)), (e = a(e, !0)), u))
                    try {
                      return l(t, e);
                    } catch (t) {}
                  if (s(t, e)) return i(!n.f.call(t, e), t[e]);
                };
          },
          {
            './_descriptors': 86,
            './_has': 93,
            './_ie8-dom-define': 96,
            './_object-pie': 121,
            './_property-desc': 123,
            './_to-iobject': 132,
            './_to-primitive': 135,
          },
        ],
        115: [
          function (t, e, r) {
            var n = t('./_to-iobject'),
              i = t('./_object-gopn').f,
              o = {}.toString,
              a =
                'object' == typeof window &&
                window &&
                Object.getOwnPropertyNames
                  ? Object.getOwnPropertyNames(window)
                  : [],
              s = function (t) {
                try {
                  return i(t);
                } catch (t) {
                  return a.slice();
                }
              };
            e.localExports.f = function (t) {
              return a && '[object Window]' == o.call(t) ? s(t) : i(n(t));
            };
          },
          { './_object-gopn': 116, './_to-iobject': 132 },
        ],
        116: [
          function (t, e, r) {
            var n = t('./_object-keys-internal'),
              i = t('./_enum-bug-keys').concat('length', 'prototype');
            r.f =
              Object.getOwnPropertyNames ||
              function (t) {
                return n(t, i);
              };
          },
          { './_enum-bug-keys': 88, './_object-keys-internal': 119 },
        ],
        117: [
          function (t, e, r) {
            r.f = Object.getOwnPropertySymbols;
          },
          {},
        ],
        118: [
          function (t, e, r) {
            var n = t('./_has'),
              i = t('./_to-object'),
              o = t('./_shared-key')('IE_PROTO'),
              a = Object.prototype;
            e.localExports =
              Object.getPrototypeOf ||
              function (t) {
                return (
                  (t = i(t)),
                  n(t, o)
                    ? t[o]
                    : 'function' == typeof t.constructor &&
                      t instanceof t.constructor
                    ? t.constructor.prototype
                    : t instanceof Object
                    ? a
                    : null
                );
              };
          },
          { './_has': 93, './_shared-key': 127, './_to-object': 134 },
        ],
        119: [
          function (t, e, r) {
            var n = t('./_has'),
              i = t('./_to-iobject'),
              o = t('./_array-includes')(!1),
              a = t('./_shared-key')('IE_PROTO');
            e.localExports = function (t, e) {
              var r,
                s = i(t),
                u = 0,
                l = [];
              for (r in s) r != a && n(s, r) && l.push(r);
              for (; e.length > u; )
                n(s, (r = e[u++])) && (~o(l, r) || l.push(r));
              return l;
            };
          },
          {
            './_array-includes': 79,
            './_has': 93,
            './_shared-key': 127,
            './_to-iobject': 132,
          },
        ],
        120: [
          function (t, e, r) {
            var n = t('./_object-keys-internal'),
              i = t('./_enum-bug-keys');
            e.localExports =
              Object.keys ||
              function (t) {
                return n(t, i);
              };
          },
          { './_enum-bug-keys': 88, './_object-keys-internal': 119 },
        ],
        121: [
          function (t, e, r) {
            r.f = {}.propertyIsEnumerable;
          },
          {},
        ],
        122: [
          function (t, e, r) {
            var n = t('./_export'),
              i = t('./_core'),
              o = t('./_fails');
            e.localExports = function (t, e) {
              var r = (i.Object || {})[t] || Object[t],
                a = {};
              (a[t] = e(r)),
                n(
                  n.S +
                    n.F *
                      o(function () {
                        r(1);
                      }),
                  'Object',
                  a
                );
            };
          },
          { './_core': 82, './_export': 90, './_fails': 91 },
        ],
        123: [
          function (t, e, r) {
            e.localExports = function (t, e) {
              return {
                enumerable: !(1 & t),
                configurable: !(2 & t),
                writable: !(4 & t),
                value: e,
              };
            };
          },
          {},
        ],
        124: [
          function (t, e, r) {
            e.localExports = t('./_hide');
          },
          { './_hide': 94 },
        ],
        125: [
          function (t, e, r) {
            var n = t('./_is-object'),
              i = t('./_an-object'),
              o = function (t, e) {
                if ((i(t), !n(e) && null !== e))
                  throw TypeError(e + ": can't set as prototype!");
              };
            e.localExports = {
              set:
                Object.setPrototypeOf ||
                ('__proto__' in {}
                  ? (function (e, r, n) {
                      try {
                        (n = t('./_ctx')(
                          Function.call,
                          t('./_object-gopd').f(Object.prototype, '__proto__')
                            .set,
                          2
                        ))(e, []),
                          (r = !(e instanceof Array));
                      } catch (t) {
                        r = !0;
                      }
                      return function (t, e) {
                        return o(t, e), r ? (t.__proto__ = e) : n(t, e), t;
                      };
                    })({}, !1)
                  : void 0),
              check: o,
            };
          },
          {
            './_an-object': 78,
            './_ctx': 84,
            './_is-object': 100,
            './_object-gopd': 114,
          },
        ],
        126: [
          function (t, e, r) {
            var n = t('./_object-dp').f,
              i = t('./_has'),
              o = t('./_wks')('toStringTag');
            e.localExports = function (t, e, r) {
              t &&
                !i((t = r ? t : t.prototype), o) &&
                n(t, o, { configurable: !0, value: e });
            };
          },
          { './_has': 93, './_object-dp': 112, './_wks': 139 },
        ],
        127: [
          function (t, e, r) {
            var n = t('./_shared')('keys'),
              i = t('./_uid');
            e.localExports = function (t) {
              return n[t] || (n[t] = i(t));
            };
          },
          { './_shared': 128, './_uid': 136 },
        ],
        128: [
          function (t, e, r) {
            var n = t('./_global'),
              i = n['__core-js_shared__'] || (n['__core-js_shared__'] = {});
            e.localExports = function (t) {
              return i[t] || (i[t] = {});
            };
          },
          { './_global': 92 },
        ],
        129: [
          function (t, e, r) {
            var n = t('./_to-integer'),
              i = t('./_defined');
            e.localExports = function (t) {
              return function (e, r) {
                var o,
                  a,
                  s = String(i(e)),
                  u = n(r),
                  l = s.length;
                return u < 0 || u >= l
                  ? t
                    ? ''
                    : void 0
                  : (o = s.charCodeAt(u)) < 55296 ||
                    o > 56319 ||
                    u + 1 === l ||
                    (a = s.charCodeAt(u + 1)) < 56320 ||
                    a > 57343
                  ? t
                    ? s.charAt(u)
                    : o
                  : t
                  ? s.slice(u, u + 2)
                  : a - 56320 + ((o - 55296) << 10) + 65536;
              };
            };
          },
          { './_defined': 85, './_to-integer': 131 },
        ],
        130: [
          function (t, e, r) {
            var n = t('./_to-integer'),
              i = Math.max,
              o = Math.min;
            e.localExports = function (t, e) {
              return (t = n(t)) < 0 ? i(t + e, 0) : o(t, e);
            };
          },
          { './_to-integer': 131 },
        ],
        131: [
          function (t, e, r) {
            var n = Math.ceil,
              i = Math.floor;
            e.localExports = function (t) {
              return isNaN((t = +t)) ? 0 : (t > 0 ? i : n)(t);
            };
          },
          {},
        ],
        132: [
          function (t, e, r) {
            var n = t('./_iobject'),
              i = t('./_defined');
            e.localExports = function (t) {
              return n(i(t));
            };
          },
          { './_defined': 85, './_iobject': 97 },
        ],
        133: [
          function (t, e, r) {
            var n = t('./_to-integer'),
              i = Math.min;
            e.localExports = function (t) {
              return t > 0 ? i(n(t), 9007199254740991) : 0;
            };
          },
          { './_to-integer': 131 },
        ],
        134: [
          function (t, e, r) {
            var n = t('./_defined');
            e.localExports = function (t) {
              return Object(n(t));
            };
          },
          { './_defined': 85 },
        ],
        135: [
          function (t, e, r) {
            var n = t('./_is-object');
            e.localExports = function (t, e) {
              if (!n(t)) return t;
              var r, i;
              if (
                e &&
                'function' == typeof (r = t.toString) &&
                !n((i = r.call(t)))
              )
                return i;
              if ('function' == typeof (r = t.valueOf) && !n((i = r.call(t))))
                return i;
              if (
                !e &&
                'function' == typeof (r = t.toString) &&
                !n((i = r.call(t)))
              )
                return i;
              throw TypeError("Can't convert object to primitive value");
            };
          },
          { './_is-object': 100 },
        ],
        136: [
          function (t, e, r) {
            var n = 0,
              i = Math.random();
            e.localExports = function (t) {
              return 'Symbol('.concat(
                void 0 === t ? '' : t,
                ')_',
                (++n + i).toString(36)
              );
            };
          },
          {},
        ],
        137: [
          function (t, e, r) {
            var n = t('./_global'),
              i = t('./_core'),
              o = t('./_library'),
              a = t('./_wks-ext'),
              s = t('./_object-dp').f;
            e.localExports = function (t) {
              var e = i.Symbol || (i.Symbol = o ? {} : n.Symbol || {});
              '_' == t.charAt(0) || t in e || s(e, t, { value: a.f(t) });
            };
          },
          {
            './_core': 82,
            './_global': 92,
            './_library': 108,
            './_object-dp': 112,
            './_wks-ext': 138,
          },
        ],
        138: [
          function (t, e, r) {
            r.f = t('./_wks');
          },
          { './_wks': 139 },
        ],
        139: [
          function (t, e, r) {
            var n = t('./_shared')('wks'),
              i = t('./_uid'),
              o = t('./_global').Symbol,
              a = 'function' == typeof o;
            (e.localExports = function (t) {
              return n[t] || (n[t] = (a && o[t]) || (a ? o : i)('Symbol.' + t));
            }).store = n;
          },
          { './_global': 92, './_shared': 128, './_uid': 136 },
        ],
        140: [
          function (t, e, r) {
            var n = t('./_classof'),
              i = t('./_wks')('iterator'),
              o = t('./_iterators');
            e.localExports = t('./_core').getIteratorMethod = function (t) {
              if (void 0 != t) return t[i] || t['@@iterator'] || o[n(t)];
            };
          },
          {
            './_classof': 80,
            './_core': 82,
            './_iterators': 106,
            './_wks': 139,
          },
        ],
        141: [
          function (t, e, r) {
            var n = t('./_an-object'),
              i = t('./core.get-iterator-method');
            e.localExports = t('./_core').getIterator = function (t) {
              var e = i(t);
              if ('function' != typeof e)
                throw TypeError(t + ' is not iterable!');
              return n(e.call(t));
            };
          },
          {
            './_an-object': 78,
            './_core': 82,
            './core.get-iterator-method': 140,
          },
        ],
        142: [
          function (t, e, r) {
            var n = t('./_classof'),
              i = t('./_wks')('iterator'),
              o = t('./_iterators');
            e.localExports = t('./_core').isIterable = function (t) {
              var e = Object(t);
              return (
                void 0 !== e[i] || '@@iterator' in e || o.hasOwnProperty(n(e))
              );
            };
          },
          {
            './_classof': 80,
            './_core': 82,
            './_iterators': 106,
            './_wks': 139,
          },
        ],
        143: [
          function (t, e, r) {
            var n = t('./_ctx'),
              i = t('./_export'),
              o = t('./_to-object'),
              a = t('./_iter-call'),
              s = t('./_is-array-iter'),
              u = t('./_to-length'),
              l = t('./_create-property'),
              c = t('./core.get-iterator-method');
            i(
              i.S +
                i.F *
                  !t('./_iter-detect')(function (t) {
                    Array.from(t);
                  }),
              'Array',
              {
                from: function (t) {
                  var e,
                    r,
                    i,
                    h,
                    f = o(t),
                    d = 'function' == typeof this ? this : Array,
                    p = arguments.length,
                    g = p > 1 ? arguments[1] : void 0,
                    _ = void 0 !== g,
                    v = 0,
                    m = c(f);
                  if (
                    (_ && (g = n(g, p > 2 ? arguments[2] : void 0, 2)),
                    void 0 == m || (d == Array && s(m)))
                  )
                    for (r = new d((e = u(f.length))); e > v; v++)
                      l(r, v, _ ? g(f[v], v) : f[v]);
                  else
                    for (h = m.call(f), r = new d(); !(i = h.next()).done; v++)
                      l(r, v, _ ? a(h, g, [i.value, v], !0) : i.value);
                  return (r.length = v), r;
                },
              }
            );
          },
          {
            './_create-property': 83,
            './_ctx': 84,
            './_export': 90,
            './_is-array-iter': 98,
            './_iter-call': 101,
            './_iter-detect': 104,
            './_to-length': 133,
            './_to-object': 134,
            './core.get-iterator-method': 140,
          },
        ],
        144: [
          function (t, e, r) {
            var n = t('./_add-to-unscopables'),
              i = t('./_iter-step'),
              o = t('./_iterators'),
              a = t('./_to-iobject');
            (e.localExports = t('./_iter-define')(
              Array,
              'Array',
              function (t, e) {
                (this._t = a(t)), (this._i = 0), (this._k = e);
              },
              function () {
                var t = this._t,
                  e = this._k,
                  r = this._i++;
                return !t || r >= t.length
                  ? ((this._t = void 0), i(1))
                  : 'keys' == e
                  ? i(0, r)
                  : 'values' == e
                  ? i(0, t[r])
                  : i(0, [r, t[r]]);
              },
              'values'
            )),
              (o.Arguments = o.Array),
              n('keys'),
              n('values'),
              n('entries');
          },
          {
            './_add-to-unscopables': 77,
            './_iter-define': 103,
            './_iter-step': 105,
            './_iterators': 106,
            './_to-iobject': 132,
          },
        ],
        145: [
          function (t, e, r) {
            var n = t('./_export');
            n(n.S + n.F, 'Object', {
              assign: t('./_object-assign'),
            });
          },
          { './_export': 90, './_object-assign': 110 },
        ],
        146: [
          function (t, e, r) {
            var n = t('./_export');
            n(n.S, 'Object', { create: t('./_object-create') });
          },
          { './_export': 90, './_object-create': 111 },
        ],
        147: [
          function (t, e, r) {
            var n = t('./_export');
            n(n.S + n.F * !t('./_descriptors'), 'Object', {
              defineProperties: t('./_object-dps'),
            });
          },
          {
            './_descriptors': 86,
            './_export': 90,
            './_object-dps': 113,
          },
        ],
        148: [
          function (t, e, r) {
            var n = t('./_export');
            n(n.S + n.F * !t('./_descriptors'), 'Object', {
              defineProperty: t('./_object-dp').f,
            });
          },
          {
            './_descriptors': 86,
            './_export': 90,
            './_object-dp': 112,
          },
        ],
        149: [
          function (t, e, r) {
            var n = t('./_is-object'),
              i = t('./_meta').onFreeze;
            t('./_object-sap')('freeze', function (t) {
              return function (e) {
                return t && n(e) ? t(i(e)) : e;
              };
            });
          },
          {
            './_is-object': 100,
            './_meta': 109,
            './_object-sap': 122,
          },
        ],
        150: [
          function (t, e, r) {
            var n = t('./_to-iobject'),
              i = t('./_object-gopd').f;
            t('./_object-sap')('getOwnPropertyDescriptor', function () {
              return function (t, e) {
                return i(n(t), e);
              };
            });
          },
          {
            './_object-gopd': 114,
            './_object-sap': 122,
            './_to-iobject': 132,
          },
        ],
        151: [
          function (t, e, r) {
            var n = t('./_to-object'),
              i = t('./_object-gpo');
            t('./_object-sap')('getPrototypeOf', function () {
              return function (t) {
                return i(n(t));
              };
            });
          },
          {
            './_object-gpo': 118,
            './_object-sap': 122,
            './_to-object': 134,
          },
        ],
        152: [
          function (t, e, r) {
            var n = t('./_to-object'),
              i = t('./_object-keys');
            t('./_object-sap')('keys', function () {
              return function (t) {
                return i(n(t));
              };
            });
          },
          {
            './_object-keys': 120,
            './_object-sap': 122,
            './_to-object': 134,
          },
        ],
        153: [
          function (t, e, r) {
            var n = t('./_export');
            n(n.S, 'Object', {
              setPrototypeOf: t('./_set-proto').set,
            });
          },
          { './_export': 90, './_set-proto': 125 },
        ],
        154: [
          function (t, e, r) {
            arguments[4][56][0].apply(r, arguments);
          },
          { dup: 56 },
        ],
        155: [
          function (t, e, r) {
            var n = t('./_string-at')(!0);
            t('./_iter-define')(
              String,
              'String',
              function (t) {
                (this._t = String(t)), (this._i = 0);
              },
              function () {
                var t,
                  e = this._t,
                  r = this._i;
                return r >= e.length
                  ? { value: void 0, done: !0 }
                  : ((t = n(e, r)),
                    (this._i += t.length),
                    { value: t, done: !1 });
              }
            );
          },
          { './_iter-define': 103, './_string-at': 129 },
        ],
        156: [
          function (t, e, r) {
            var n = t('./_global'),
              i = t('./_has'),
              o = t('./_descriptors'),
              a = t('./_export'),
              s = t('./_redefine'),
              u = t('./_meta').KEY,
              l = t('./_fails'),
              c = t('./_shared'),
              h = t('./_set-to-string-tag'),
              f = t('./_uid'),
              d = t('./_wks'),
              p = t('./_wks-ext'),
              g = t('./_wks-define'),
              _ = t('./_keyof'),
              v = t('./_enum-keys'),
              m = t('./_is-array'),
              y = t('./_an-object'),
              b = t('./_to-iobject'),
              w = t('./_to-primitive'),
              x = t('./_property-desc'),
              S = t('./_object-create'),
              C = t('./_object-gopn-ext'),
              k = t('./_object-gopd'),
              E = t('./_object-dp'),
              A = t('./_object-keys'),
              P = k.f,
              j = E.f,
              I = C.f,
              T = n.Symbol,
              B = n.JSON,
              L = B && B.stringify,
              O = d('_hidden'),
              N = d('toPrimitive'),
              R = {}.propertyIsEnumerable,
              M = c('symbol-registry'),
              F = c('symbols'),
              D = c('op-symbols'),
              z = Object.prototype,
              U = 'function' == typeof T,
              H = n.QObject,
              G = !H || !H.prototype || !H.prototype.findChild,
              q =
                o &&
                l(function () {
                  return (
                    7 !=
                    S(
                      j({}, 'a', {
                        get: function () {
                          return j(this, 'a', {
                            value: 7,
                          }).a;
                        },
                      })
                    ).a
                  );
                })
                  ? function (t, e, r) {
                      var n = P(z, e);
                      n && delete z[e], j(t, e, r), n && t !== z && j(z, e, n);
                    }
                  : j,
              Z = function (t) {
                var e = (F[t] = S(T.prototype));
                return (e._k = t), e;
              },
              W =
                U && 'symbol' == typeof T.iterator
                  ? function (t) {
                      return 'symbol' == typeof t;
                    }
                  : function (t) {
                      return t instanceof T;
                    },
              Y = function (t, e, r) {
                return (
                  t === z && Y(D, e, r),
                  y(t),
                  (e = w(e, !0)),
                  y(r),
                  i(F, e)
                    ? (r.enumerable
                        ? (i(t, O) && t[O][e] && (t[O][e] = !1),
                          (r = S(r, {
                            enumerable: x(0, !1),
                          })))
                        : (i(t, O) || j(t, O, x(1, {})), (t[O][e] = !0)),
                      q(t, e, r))
                    : j(t, e, r)
                );
              },
              V = function (t, e) {
                y(t);
                for (var r, n = v((e = b(e))), i = 0, o = n.length; o > i; )
                  Y(t, (r = n[i++]), e[r]);
                return t;
              },
              K = function (t) {
                var e = R.call(this, (t = w(t, !0)));
                return (
                  !(this === z && i(F, t) && !i(D, t)) &&
                  (!(
                    e ||
                    !i(this, t) ||
                    !i(F, t) ||
                    (i(this, O) && this[O][t])
                  ) ||
                    e)
                );
              },
              X = function (t, e) {
                if (
                  ((t = b(t)), (e = w(e, !0)), t !== z || !i(F, e) || i(D, e))
                ) {
                  var r = P(t, e);
                  return (
                    !r ||
                      !i(F, e) ||
                      (i(t, O) && t[O][e]) ||
                      (r.enumerable = !0),
                    r
                  );
                }
              },
              J = function (t) {
                for (var e, r = I(b(t)), n = [], o = 0; r.length > o; )
                  i(F, (e = r[o++])) || e == O || e == u || n.push(e);
                return n;
              },
              Q = function (t) {
                for (
                  var e, r = t === z, n = I(r ? D : b(t)), o = [], a = 0;
                  n.length > a;

                )
                  !i(F, (e = n[a++])) || (r && !i(z, e)) || o.push(F[e]);
                return o;
              };
            U ||
              (s(
                (T = function () {
                  if (this instanceof T)
                    throw TypeError('Symbol is not a constructor!');
                  var t = f(arguments.length > 0 ? arguments[0] : void 0),
                    e = function (r) {
                      this === z && e.call(D, r),
                        i(this, O) && i(this[O], t) && (this[O][t] = !1),
                        q(this, t, x(1, r));
                    };
                  return (
                    o &&
                      G &&
                      q(z, t, {
                        configurable: !0,
                        set: e,
                      }),
                    Z(t)
                  );
                }).prototype,
                'toString',
                function () {
                  return this._k;
                }
              ),
              (k.f = X),
              (E.f = Y),
              (t('./_object-gopn').f = C.f = J),
              (t('./_object-pie').f = K),
              (t('./_object-gops').f = Q),
              o && !t('./_library') && s(z, 'propertyIsEnumerable', K, !0),
              (p.f = function (t) {
                return Z(d(t));
              })),
              a(a.G + a.W + a.F * !U, { Symbol: T });
            for (
              var $ =
                  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(
                    ','
                  ),
                tt = 0;
              $.length > tt;

            )
              d($[tt++]);
            for (var $ = A(d.store), tt = 0; $.length > tt; ) g($[tt++]);
            a(a.S + a.F * !U, 'Symbol', {
              for: function (t) {
                return i(M, (t += '')) ? M[t] : (M[t] = T(t));
              },
              keyFor: function (t) {
                if (W(t)) return _(M, t);
                throw TypeError(t + ' is not a symbol!');
              },
              useSetter: function () {
                G = !0;
              },
              useSimple: function () {
                G = !1;
              },
            }),
              a(a.S + a.F * !U, 'Object', {
                create: function (t, e) {
                  return void 0 === e ? S(t) : V(S(t), e);
                },
                defineProperty: Y,
                defineProperties: V,
                getOwnPropertyDescriptor: X,
                getOwnPropertyNames: J,
                getOwnPropertySymbols: Q,
              }),
              B &&
                a(
                  a.S +
                    a.F *
                      (!U ||
                        l(function () {
                          var t = T();
                          return (
                            '[null]' != L([t]) ||
                            '{}' != L({ a: t }) ||
                            '{}' != L(Object(t))
                          );
                        })),
                  'JSON',
                  {
                    stringify: function (t) {
                      if (void 0 !== t && !W(t)) {
                        for (var e, r, n = [t], i = 1; arguments.length > i; )
                          n.push(arguments[i++]);
                        return (
                          'function' == typeof (e = n[1]) && (r = e),
                          (!r && m(e)) ||
                            (e = function (t, e) {
                              if ((r && (e = r.call(this, t, e)), !W(e)))
                                return e;
                            }),
                          (n[1] = e),
                          L.apply(B, n)
                        );
                      }
                    },
                  }
                ),
              T.prototype[N] ||
                t('./_hide')(T.prototype, N, T.prototype.valueOf),
              h(T, 'Symbol'),
              h(Math, 'Math', !0),
              h(n.JSON, 'JSON', !0);
          },
          {
            './_an-object': 78,
            './_descriptors': 86,
            './_enum-keys': 89,
            './_export': 90,
            './_fails': 91,
            './_global': 92,
            './_has': 93,
            './_hide': 94,
            './_is-array': 99,
            './_keyof': 107,
            './_library': 108,
            './_meta': 109,
            './_object-create': 111,
            './_object-dp': 112,
            './_object-gopd': 114,
            './_object-gopn': 116,
            './_object-gopn-ext': 115,
            './_object-gops': 117,
            './_object-keys': 120,
            './_object-pie': 121,
            './_property-desc': 123,
            './_redefine': 124,
            './_set-to-string-tag': 126,
            './_shared': 128,
            './_to-iobject': 132,
            './_to-primitive': 135,
            './_uid': 136,
            './_wks': 139,
            './_wks-define': 137,
            './_wks-ext': 138,
          },
        ],
        157: [
          function (t, e, r) {
            t('./_wks-define')('asyncIterator');
          },
          { './_wks-define': 137 },
        ],
        158: [
          function (t, e, r) {
            t('./_wks-define')('observable');
          },
          { './_wks-define': 137 },
        ],
        159: [
          function (t, e, r) {
            t('./es6.array.iterator');
            for (
              var n = t('./_global'),
                i = t('./_hide'),
                o = t('./_iterators'),
                a = t('./_wks')('toStringTag'),
                s = [
                  'NodeList',
                  'DOMTokenList',
                  'MediaList',
                  'StyleSheetList',
                  'CSSRuleList',
                ],
                u = 0;
              u < 5;
              u++
            ) {
              var l = s[u],
                c = n[l],
                h = c && c.prototype;
              h && !h[a] && i(h, a, l), (o[l] = o.Array);
            }
          },
          {
            './_global': 92,
            './_hide': 94,
            './_iterators': 106,
            './_wks': 139,
            './es6.array.iterator': 144,
          },
        ],
        160: [
          function (t, e, r) {
            (function (t) {
              function e(t) {
                return Object.prototype.toString.call(t);
              }
              (r.isArray = function (t) {
                return Array.isArray
                  ? Array.isArray(t)
                  : '[object Array]' === e(t);
              }),
                (r.isBoolean = function (t) {
                  return 'boolean' == typeof t;
                }),
                (r.isNull = function (t) {
                  return null === t;
                }),
                (r.isNullOrUndefined = function (t) {
                  return null == t;
                }),
                (r.isNumber = function (t) {
                  return 'number' == typeof t;
                }),
                (r.isString = function (t) {
                  return 'string' == typeof t;
                }),
                (r.isSymbol = function (t) {
                  return 'symbol' == typeof t;
                }),
                (r.isUndefined = function (t) {
                  return void 0 === t;
                }),
                (r.isRegExp = function (t) {
                  return '[object RegExp]' === e(t);
                }),
                (r.isObject = function (t) {
                  return 'object' == typeof t && null !== t;
                }),
                (r.isDate = function (t) {
                  return '[object Date]' === e(t);
                }),
                (r.isError = function (t) {
                  return '[object Error]' === e(t) || t instanceof Error;
                }),
                (r.isFunction = function (t) {
                  return 'function' == typeof t;
                }),
                (r.isPrimitive = function (t) {
                  return (
                    null === t ||
                    'boolean' == typeof t ||
                    'number' == typeof t ||
                    'string' == typeof t ||
                    'symbol' == typeof t ||
                    void 0 === t
                  );
                }),
                (r.isBuffer = t.isBuffer);
            }).call(this, {
              isBuffer: t('../../is-buffer/index.js'),
            });
          },
          { '../../is-buffer/index.js': 168 },
        ],
        164: [
          function (t, e, r) {
            function n() {
              (this._events = this._events || {}),
                (this._maxListeners = this._maxListeners || void 0);
            }
            function i(t) {
              return 'function' == typeof t;
            }
            function o(t) {
              return 'number' == typeof t;
            }
            function a(t) {
              return 'object' == typeof t && null !== t;
            }
            function s(t) {
              return void 0 === t;
            }
            (e.localExports = n),
              (n.EventEmitter = n),
              (n.prototype._events = void 0),
              (n.prototype._maxListeners = void 0),
              (n.defaultMaxListeners = 10),
              (n.prototype.setMaxListeners = function (t) {
                if (!o(t) || t < 0 || isNaN(t))
                  throw TypeError('n must be a positive number');
                return (this._maxListeners = t), this;
              }),
              (n.prototype.emit = function (t) {
                var e, r, n, o, u, l;
                if (
                  (this._events || (this._events = {}),
                  'error' === t &&
                    (!this._events.error ||
                      (a(this._events.error) && !this._events.error.length)))
                ) {
                  if ((e = arguments[1]) instanceof Error) throw e;
                  var c = new Error(
                    'Uncaught, unspecified "error" event. (' + e + ')'
                  );
                  throw ((c.context = e), c);
                }
                if (((r = this._events[t]), s(r))) return !1;
                if (i(r))
                  switch (arguments.length) {
                    case 1:
                      r.call(this);
                      break;
                    case 2:
                      r.call(this, arguments[1]);
                      break;
                    case 3:
                      r.call(this, arguments[1], arguments[2]);
                      break;
                    default:
                      (o = Array.prototype.slice.call(arguments, 1)),
                        r.apply(this, o);
                  }
                else if (a(r))
                  for (
                    o = Array.prototype.slice.call(arguments, 1),
                      n = (l = r.slice()).length,
                      u = 0;
                    u < n;
                    u++
                  )
                    l[u].apply(this, o);
                return !0;
              }),
              (n.prototype.addListener = function (t, e) {
                var r;
                if (!i(e)) throw TypeError('listener must be a function');
                return (
                  this._events || (this._events = {}),
                  this._events.newListener &&
                    this.emit('newListener', t, i(e.listener) ? e.listener : e),
                  this._events[t]
                    ? a(this._events[t])
                      ? this._events[t].push(e)
                      : (this._events[t] = [this._events[t], e])
                    : (this._events[t] = e),
                  a(this._events[t]) &&
                    !this._events[t].warned &&
                    (r = s(this._maxListeners)
                      ? n.defaultMaxListeners
                      : this._maxListeners) &&
                    r > 0 &&
                    this._events[t].length > r &&
                    ((this._events[t].warned = !0),
                    console.error(
                      '(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',
                      this._events[t].length
                    ),
                    'function' == typeof console.trace && console.trace()),
                  this
                );
              }),
              (n.prototype.on = n.prototype.addListener),
              (n.prototype.once = function (t, e) {
                function r() {
                  this.removeListener(t, r),
                    n || ((n = !0), e.apply(this, arguments));
                }
                if (!i(e)) throw TypeError('listener must be a function');
                var n = !1;
                return (r.listener = e), this.on(t, r), this;
              }),
              (n.prototype.removeListener = function (t, e) {
                var r, n, o, s;
                if (!i(e)) throw TypeError('listener must be a function');
                if (!this._events || !this._events[t]) return this;
                if (
                  ((r = this._events[t]),
                  (o = r.length),
                  (n = -1),
                  r === e || (i(r.listener) && r.listener === e))
                )
                  delete this._events[t],
                    this._events.removeListener &&
                      this.emit('removeListener', t, e);
                else if (a(r)) {
                  for (s = o; s-- > 0; )
                    if (r[s] === e || (r[s].listener && r[s].listener === e)) {
                      n = s;
                      break;
                    }
                  if (n < 0) return this;
                  1 === r.length
                    ? ((r.length = 0), delete this._events[t])
                    : r.splice(n, 1),
                    this._events.removeListener &&
                      this.emit('removeListener', t, e);
                }
                return this;
              }),
              (n.prototype.removeAllListeners = function (t) {
                var e, r;
                if (!this._events) return this;
                if (!this._events.removeListener)
                  return (
                    0 === arguments.length
                      ? (this._events = {})
                      : this._events[t] && delete this._events[t],
                    this
                  );
                if (0 === arguments.length) {
                  for (e in this._events)
                    'removeListener' !== e && this.removeAllListeners(e);
                  return (
                    this.removeAllListeners('removeListener'),
                    (this._events = {}),
                    this
                  );
                }
                if (((r = this._events[t]), i(r))) this.removeListener(t, r);
                else if (r)
                  for (; r.length; ) this.removeListener(t, r[r.length - 1]);
                return delete this._events[t], this;
              }),
              (n.prototype.listeners = function (t) {
                return this._events && this._events[t]
                  ? i(this._events[t])
                    ? [this._events[t]]
                    : this._events[t].slice()
                  : [];
              }),
              (n.prototype.listenerCount = function (t) {
                if (this._events) {
                  var e = this._events[t];
                  if (i(e)) return 1;
                  if (e) return e.length;
                }
                return 0;
              }),
              (n.listenerCount = function (t, e) {
                return t.listenerCount(e);
              });
          },
          {},
        ],
        165: [
          function (t, e, r) {
            (function (r, n) {
              function i(t) {
                return t && 'object' == typeof t && 'default' in t
                  ? t.default
                  : t;
              }
              function o(t, e, r) {
                var n = r.get;
                r.get = function () {
                  var t = n.call(this);
                  return m(this, e, { value: t }), t;
                };
              }
              function a(t, e) {
                for (var r = []; t < e; ) r.push(t++);
                return r;
              }
              function s(t) {
                for (var e = t.length, r = 0; r < e; ) {
                  var n = t.charCodeAt(r++);
                  if (55296 <= n && n <= 56319 && r < e) {
                    var i = t.charCodeAt(r);
                    56320 <= i &&
                      i <= 57343 &&
                      (r++, (n = ((1023 & n) << 10) + (1023 & i) + 65536));
                  }
                  var o = A.getScript(n);
                  if ('Common' !== o && 'Inherited' !== o && 'Unknown' !== o)
                    return st[o];
                }
                return st.Unknown;
              }
              function u(t) {
                for (var e = 0; e < t.length; e++) {
                  var r = t[e],
                    n = A.getScript(r);
                  if ('Common' !== n && 'Inherited' !== n && 'Unknown' !== n)
                    return st[n];
                }
                return st.Unknown;
              }
              function l(t) {
                return 'ltr';
              }
              function c(t) {
                var e = gt[t];
                return e || dt;
              }
              function h(t, e, r, n, i) {
                var o = {};
                return (
                  Object.keys(n).forEach(function (t) {
                    o[t] = n[t];
                  }),
                  (o.enumerable = !!o.enumerable),
                  (o.configurable = !!o.configurable),
                  ('value' in o || o.initializer) && (o.writable = !0),
                  (o = r
                    .slice()
                    .reverse()
                    .reduce(function (r, n) {
                      return n(t, e, r) || r;
                    }, o)),
                  i &&
                    void 0 !== o.initializer &&
                    ((o.value = o.initializer ? o.initializer.call(i) : void 0),
                    (o.initializer = void 0)),
                  void 0 === o.initializer &&
                    (Object.defineProperty(t, e, o), (o = null)),
                  o
                );
              }
              function f(t, e, r, n, i) {
                var o = {};
                return (
                  Object.keys(n).forEach(function (t) {
                    o[t] = n[t];
                  }),
                  (o.enumerable = !!o.enumerable),
                  (o.configurable = !!o.configurable),
                  ('value' in o || o.initializer) && (o.writable = !0),
                  (o = r
                    .slice()
                    .reverse()
                    .reduce(function (r, n) {
                      return n(t, e, r) || r;
                    }, o)),
                  i &&
                    void 0 !== o.initializer &&
                    ((o.value = o.initializer ? o.initializer.call(i) : void 0),
                    (o.initializer = void 0)),
                  void 0 === o.initializer &&
                    (Object.defineProperty(t, e, o), (o = null)),
                  o
                );
              }
              var d = i(t('restructure')),
                p = i(
                  t('babel-runtime/core-js/object/get-own-property-descriptor')
                ),
                g = i(t('babel-runtime/core-js/object/freeze')),
                _ = i(t('babel-runtime/core-js/object/keys')),
                v = i(t('babel-runtime/helpers/typeof')),
                m = i(t('babel-runtime/core-js/object/define-property')),
                y = i(t('babel-runtime/helpers/classCallCheck')),
                b = i(t('babel-runtime/helpers/createClass')),
                w = i(t('babel-runtime/core-js/object/get-prototype-of')),
                x = i(t('babel-runtime/helpers/possibleConstructorReturn')),
                S = i(t('babel-runtime/helpers/inherits')),
                C =
                  (i(t('babel-runtime/core-js/object/define-properties')),
                  i(t('babel-runtime/helpers/get'))),
                k = i(t('babel-runtime/core-js/object/assign')),
                E = i(t('babel-runtime/helpers/toConsumableArray')),
                A = i(t('unicode-properties')),
                P = i(t('babel-runtime/helpers/slicedToArray')),
                j = i(t('clone')),
                I = {};
              I.logErrors = !1;
              var T = [];
              (I.registerFormat = function (t) {
                T.push(t);
              }),
                (I.create = function (t, e) {
                  for (var r = 0; r < T.length; r++) {
                    var n = T[r];
                    if (n.probe(t)) {
                      var i = new n(new d.DecodeStream(t));
                      return e ? i.getFont(e) : i;
                    }
                  }
                  throw new Error('Unknown font format');
                });
              var B = new d.Struct({
                  firstCode: d.uint16,
                  entryCount: d.uint16,
                  idDelta: d.int16,
                  idRangeOffset: d.uint16,
                }),
                L = new d.Struct({
                  startCharCode: d.uint32,
                  endCharCode: d.uint32,
                  glyphID: d.uint32,
                }),
                O =
                  (new d.Struct({
                    startUnicodeValue: d.uint24,
                    additionalCount: d.uint8,
                  }),
                  new d.Struct({
                    unicodeValue: d.uint24,
                    glyphID: d.uint16,
                  }),
                  new d.VersionedStruct(d.uint16, {
                    0: {
                      length: d.uint16,
                      language: d.uint16,
                      codeMap: new d.LazyArray(d.uint8, 256),
                    },
                    2: {
                      length: d.uint16,
                      language: d.uint16,
                      subHeaderKeys: new d.Array(d.uint16, 256),
                      subHeaderCount: function (t) {
                        return Math.max.apply(Math, t.subHeaderKeys);
                      },
                      subHeaders: new d.LazyArray(B, 'subHeaderCount'),
                      glyphIndexArray: new d.LazyArray(
                        d.uint16,
                        'subHeaderCount'
                      ),
                    },
                    4: {
                      length: d.uint16,
                      language: d.uint16,
                      segCountX2: d.uint16,
                      segCount: function (t) {
                        return t.segCountX2 >> 1;
                      },
                      searchRange: d.uint16,
                      entrySelector: d.uint16,
                      rangeShift: d.uint16,
                      endCode: new d.LazyArray(d.uint16, 'segCount'),
                      reservedPad: new d.Reserved(d.uint16),
                      startCode: new d.LazyArray(d.uint16, 'segCount'),
                      idDelta: new d.LazyArray(d.int16, 'segCount'),
                      idRangeOffset: new d.LazyArray(d.uint16, 'segCount'),
                      glyphIndexArray: new d.LazyArray(d.uint16, function (t) {
                        return (t.length - t._currentOffset) / 2;
                      }),
                    },
                    6: {
                      length: d.uint16,
                      language: d.uint16,
                      firstCode: d.uint16,
                      entryCount: d.uint16,
                      glyphIndices: new d.LazyArray(d.uint16, 'entryCount'),
                    },
                    8: {
                      reserved: new d.Reserved(d.uint16),
                      length: d.uint32,
                      language: d.uint16,
                      is32: new d.LazyArray(d.uint8, 8192),
                      nGroups: d.uint32,
                      groups: new d.LazyArray(L, 'nGroups'),
                    },
                    10: {
                      reserved: new d.Reserved(d.uint16),
                      length: d.uint32,
                      language: d.uint32,
                      firstCode: d.uint32,
                      entryCount: d.uint32,
                      glyphIndices: new d.LazyArray(d.uint16, 'numChars'),
                    },
                    12: {
                      reserved: new d.Reserved(d.uint16),
                      length: d.uint32,
                      language: d.uint32,
                      nGroups: d.uint32,
                      groups: new d.LazyArray(L, 'nGroups'),
                    },
                    13: {
                      reserved: new d.Reserved(d.uint16),
                      length: d.uint32,
                      language: d.uint32,
                      nGroups: d.uint32,
                      groups: new d.LazyArray(L, 'nGroups'),
                    },
                  })),
                N = new d.Struct({
                  platformID: d.uint16,
                  encodingID: d.uint16,
                  table: new d.Pointer(d.uint32, O, {
                    type: 'parent',
                    lazy: !0,
                  }),
                }),
                R = new d.Struct({
                  version: d.uint16,
                  numSubtables: d.uint16,
                  tables: new d.Array(N, 'numSubtables'),
                }),
                M = new d.Struct({
                  version: d.int32,
                  revision: d.int32,
                  checkSumAdjustment: d.uint32,
                  magicNumber: d.uint32,
                  flags: d.uint16,
                  unitsPerEm: d.uint16,
                  created: new d.Array(d.int32, 2),
                  modified: new d.Array(d.int32, 2),
                  xMin: d.int16,
                  yMin: d.int16,
                  xMax: d.int16,
                  yMax: d.int16,
                  macStyle: new d.Bitfield(d.uint16, [
                    'bold',
                    'italic',
                    'underline',
                    'outline',
                    'shadow',
                    'condensed',
                    'extended',
                  ]),
                  lowestRecPPEM: d.uint16,
                  fontDirectionHint: d.int16,
                  indexToLocFormat: d.int16,
                  glyphDataFormat: d.int16,
                }),
                F = new d.Struct({
                  version: d.int32,
                  ascent: d.int16,
                  descent: d.int16,
                  lineGap: d.int16,
                  advanceWidthMax: d.uint16,
                  minLeftSideBearing: d.int16,
                  minRightSideBearing: d.int16,
                  xMaxExtent: d.int16,
                  caretSlopeRise: d.int16,
                  caretSlopeRun: d.int16,
                  caretOffset: d.int16,
                  reserved: new d.Reserved(d.int16, 4),
                  metricDataFormat: d.int16,
                  numberOfMetrics: d.uint16,
                }),
                D = new d.Struct({
                  advance: d.uint16,
                  bearing: d.int16,
                }),
                z = new d.Struct({
                  metrics: new d.LazyArray(D, function (t) {
                    return t.parent.hhea.numberOfMetrics;
                  }),
                  bearings: new d.LazyArray(d.int16, function (t) {
                    return (
                      t.parent.maxp.numGlyphs - t.parent.hhea.numberOfMetrics
                    );
                  }),
                }),
                U = new d.Struct({
                  version: d.int32,
                  numGlyphs: d.uint16,
                  maxPoints: d.uint16,
                  maxContours: d.uint16,
                  maxComponentPoints: d.uint16,
                  maxComponentContours: d.uint16,
                  maxZones: d.uint16,
                  maxTwilightPoints: d.uint16,
                  maxStorage: d.uint16,
                  maxFunctionDefs: d.uint16,
                  maxInstructionDefs: d.uint16,
                  maxStackElements: d.uint16,
                  maxSizeOfInstructions: d.uint16,
                  maxComponentElements: d.uint16,
                  maxComponentDepth: d.uint16,
                }),
                H = new d.Struct({
                  platformID: d.uint16,
                  encodingID: d.uint16,
                  languageID: d.uint16,
                  nameID: d.uint16,
                  length: d.uint16,
                  string: new d.Pointer(
                    d.uint16,
                    new d.String('length', function (t) {
                      return W[t.platformID][t.encodingID];
                    }),
                    {
                      type: 'parent',
                      relativeTo: 'parent.stringOffset',
                      allowNull: !1,
                    }
                  ),
                }),
                G = new d.Struct({
                  length: d.uint16,
                  tag: new d.Pointer(
                    d.uint16,
                    new d.String('length', 'utf16be'),
                    {
                      type: 'parent',
                      relativeTo: 'stringOffset',
                    }
                  ),
                }),
                q = new d.VersionedStruct(d.uint16, {
                  0: {
                    count: d.uint16,
                    stringOffset: d.uint16,
                    records: new d.Array(H, 'count'),
                  },
                  1: {
                    count: d.uint16,
                    stringOffset: d.uint16,
                    records: new d.Array(H, 'count'),
                    langTagCount: d.uint16,
                    langTags: new d.Array(G, 'langTagCount'),
                  },
                }),
                Z = [
                  'copyright',
                  'fontFamily',
                  'fontSubfamily',
                  'uniqueSubfamily',
                  'fullName',
                  'version',
                  'postscriptName',
                  'trademark',
                  'manufacturer',
                  'designer',
                  'description',
                  'vendorURL',
                  'designerURL',
                  'license',
                  'licenseURL',
                  null,
                  'preferredFamily',
                  'preferredSubfamily',
                  'compatibleFull',
                  'sampleText',
                  'postscriptCIDFontName',
                  'wwsFamilyName',
                  'wwsSubfamilyName',
                ],
                W = [
                  [
                    'utf16be',
                    'utf16be',
                    'utf16be',
                    'utf16be',
                    'utf16be',
                    'utf16be',
                  ],
                  [
                    'macroman',
                    'shift-jis',
                    'big5',
                    'euc-kr',
                    'iso-8859-6',
                    'iso-8859-8',
                    'macgreek',
                    'maccyrillic',
                    'symbol',
                    'Devanagari',
                    'Gurmukhi',
                    'Gujarati',
                    'Oriya',
                    'Bengali',
                    'Tamil',
                    'Telugu',
                    'Kannada',
                    'Malayalam',
                    'Sinhalese',
                    'Burmese',
                    'Khmer',
                    'macthai',
                    'Laotian',
                    'Georgian',
                    'Armenian',
                    'gb-2312-80',
                    'Tibetan',
                    'Mongolian',
                    'Geez',
                    'maccyrillic',
                    'Vietnamese',
                    'Sindhi',
                  ],
                  ['ascii'],
                  [
                    'symbol',
                    'utf16be',
                    'shift-jis',
                    'gb18030',
                    'big5',
                    'wansung',
                    'johab',
                    null,
                    null,
                    null,
                    'ucs-4',
                  ],
                ],
                Y = [
                  [],
                  {
                    0: 'English',
                    59: 'Pashto',
                    1: 'French',
                    60: 'Kurdish',
                    2: 'German',
                    61: 'Kashmiri',
                    3: 'Italian',
                    62: 'Sindhi',
                    4: 'Dutch',
                    63: 'Tibetan',
                    5: 'Swedish',
                    64: 'Nepali',
                    6: 'Spanish',
                    65: 'Sanskrit',
                    7: 'Danish',
                    66: 'Marathi',
                    8: 'Portuguese',
                    67: 'Bengali',
                    9: 'Norwegian',
                    68: 'Assamese',
                    10: 'Hebrew',
                    69: 'Gujarati',
                    11: 'Japanese',
                    70: 'Punjabi',
                    12: 'Arabic',
                    71: 'Oriya',
                    13: 'Finnish',
                    72: 'Malayalam',
                    14: 'Greek',
                    73: 'Kannada',
                    15: 'Icelandic',
                    74: 'Tamil',
                    16: 'Maltese',
                    75: 'Telugu',
                    17: 'Turkish',
                    76: 'Sinhalese',
                    18: 'Croatian',
                    77: 'Burmese',
                    19: 'Chinese (Traditional)',
                    78: 'Khmer',
                    20: 'Urdu',
                    79: 'Lao',
                    21: 'Hindi',
                    80: 'Vietnamese',
                    22: 'Thai',
                    81: 'Indonesian',
                    23: 'Korean',
                    82: 'Tagalong',
                    24: 'Lithuanian',
                    83: 'Malay (Roman script)',
                    25: 'Polish',
                    84: 'Malay (Arabic script)',
                    26: 'Hungarian',
                    85: 'Amharic',
                    27: 'Estonian',
                    86: 'Tigrinya',
                    28: 'Latvian',
                    87: 'Galla',
                    29: 'Sami',
                    88: 'Somali',
                    30: 'Faroese',
                    89: 'Swahili',
                    31: 'Farsi/Persian',
                    90: 'Kinyarwanda/Ruanda',
                    32: 'Russian',
                    91: 'Rundi',
                    33: 'Chinese (Simplified)',
                    92: 'Nyanja/Chewa',
                    34: 'Flemish',
                    93: 'Malagasy',
                    35: 'Irish Gaelic',
                    94: 'Esperanto',
                    36: 'Albanian',
                    128: 'Welsh',
                    37: 'Romanian',
                    129: 'Basque',
                    38: 'Czech',
                    130: 'Catalan',
                    39: 'Slovak',
                    131: 'Latin',
                    40: 'Slovenian',
                    132: 'Quenchua',
                    41: 'Yiddish',
                    133: 'Guarani',
                    42: 'Serbian',
                    134: 'Aymara',
                    43: 'Macedonian',
                    135: 'Tatar',
                    44: 'Bulgarian',
                    136: 'Uighur',
                    45: 'Ukrainian',
                    137: 'Dzongkha',
                    46: 'Byelorussian',
                    138: 'Javanese (Roman script)',
                    47: 'Uzbek',
                    139: 'Sundanese (Roman script)',
                    48: 'Kazakh',
                    140: 'Galician',
                    49: 'Azerbaijani (Cyrillic script)',
                    141: 'Afrikaans',
                    50: 'Azerbaijani (Arabic script)',
                    142: 'Breton',
                    51: 'Armenian',
                    143: 'Inuktitut',
                    52: 'Georgian',
                    144: 'Scottish Gaelic',
                    53: 'Moldavian',
                    145: 'Manx Gaelic',
                    54: 'Kirghiz',
                    146: 'Irish Gaelic (with dot above)',
                    55: 'Tajiki',
                    147: 'Tongan',
                    56: 'Turkmen',
                    148: 'Greek (polytonic)',
                    57: 'Mongolian (Mongolian script)',
                    149: 'Greenlandic',
                    58: 'Mongolian (Cyrillic script)',
                    150: 'Azerbaijani (Roman script)',
                  },
                  [],
                  {
                    1078: 'Afrikaans',
                    1107: 'Khmer',
                    1052: 'Albanian',
                    1158: "K'iche",
                    1156: 'Alsatian',
                    1159: 'Kinyarwanda',
                    1118: 'Amharic',
                    1089: 'Kiswahili',
                    5121: 'Arabic',
                    1111: 'Konkani',
                    15361: 'Arabic',
                    1042: 'Korean',
                    3073: 'Arabic',
                    1088: 'Kyrgyz',
                    2049: 'Arabic',
                    1108: 'Lao',
                    11265: 'Arabic',
                    1062: 'Latvian',
                    13313: 'Arabic',
                    1063: 'Lithuanian',
                    12289: 'Arabic',
                    2094: 'Lower Sorbian',
                    4097: 'Arabic',
                    1134: 'Luxembourgish',
                    6145: 'Arabic',
                    1071: 'Macedonian (FYROM)',
                    8193: 'Arabic',
                    2110: 'Malay',
                    16385: 'Arabic',
                    1086: 'Malay',
                    1025: 'Arabic',
                    1100: 'Malayalam',
                    10241: 'Arabic',
                    1082: 'Maltese',
                    7169: 'Arabic',
                    1153: 'Maori',
                    14337: 'Arabic',
                    1146: 'Mapudungun',
                    9217: 'Arabic',
                    1102: 'Marathi',
                    1067: 'Armenian',
                    1148: 'Mohawk',
                    1101: 'Assamese',
                    1104: 'Mongolian (Cyrillic)',
                    2092: 'Azeri (Cyrillic)',
                    2128: 'Mongolian (Traditional)',
                    1068: 'Azeri (Latin)',
                    1121: 'Nepali',
                    1133: 'Bashkir',
                    1044: 'Norwegian (Bokmal)',
                    1069: 'Basque',
                    2068: 'Norwegian (Nynorsk)',
                    1059: 'Belarusian',
                    1154: 'Occitan',
                    2117: 'Bengali',
                    1096: 'Odia (formerly Oriya)',
                    1093: 'Bengali',
                    1123: 'Pashto',
                    8218: 'Bosnian (Cyrillic)',
                    1045: 'Polish',
                    5146: 'Bosnian (Latin)',
                    1046: 'Portuguese',
                    1150: 'Breton',
                    2070: 'Portuguese',
                    1026: 'Bulgarian',
                    1094: 'Punjabi',
                    1027: 'Catalan',
                    1131: 'Quechua',
                    3076: 'Chinese',
                    2155: 'Quechua',
                    5124: 'Chinese',
                    3179: 'Quechua',
                    2052: 'Chinese',
                    1048: 'Romanian',
                    4100: 'Chinese',
                    1047: 'Romansh',
                    1028: 'Chinese',
                    1049: 'Russian',
                    1155: 'Corsican',
                    9275: 'Sami (Inari)',
                    1050: 'Croatian',
                    4155: 'Sami (Lule)',
                    4122: 'Croatian (Latin)',
                    5179: 'Sami (Lule)',
                    1029: 'Czech',
                    3131: 'Sami (Northern)',
                    1030: 'Danish',
                    1083: 'Sami (Northern)',
                    1164: 'Dari',
                    2107: 'Sami (Northern)',
                    1125: 'Divehi',
                    8251: 'Sami (Skolt)',
                    2067: 'Dutch',
                    6203: 'Sami (Southern)',
                    1043: 'Dutch',
                    7227: 'Sami (Southern)',
                    3081: 'English',
                    1103: 'Sanskrit',
                    10249: 'English',
                    7194: 'Serbian (Cyrillic)',
                    4105: 'English',
                    3098: 'Serbian (Cyrillic)',
                    9225: 'English',
                    6170: 'Serbian (Latin)',
                    16393: 'English',
                    2074: 'Serbian (Latin)',
                    6153: 'English',
                    1132: 'Sesotho sa Leboa',
                    8201: 'English',
                    1074: 'Setswana',
                    17417: 'English',
                    1115: 'Sinhala',
                    5129: 'English',
                    1051: 'Slovak',
                    13321: 'English',
                    1060: 'Slovenian',
                    18441: 'English',
                    11274: 'Spanish',
                    7177: 'English',
                    16394: 'Spanish',
                    11273: 'English',
                    13322: 'Spanish',
                    2057: 'English',
                    9226: 'Spanish',
                    1033: 'English',
                    5130: 'Spanish',
                    12297: 'English',
                    7178: 'Spanish',
                    1061: 'Estonian',
                    12298: 'Spanish',
                    1080: 'Faroese',
                    17418: 'Spanish',
                    1124: 'Filipino',
                    4106: 'Spanish',
                    1035: 'Finnish',
                    18442: 'Spanish',
                    2060: 'French',
                    2058: 'Spanish',
                    3084: 'French',
                    19466: 'Spanish',
                    1036: 'French',
                    6154: 'Spanish',
                    5132: 'French',
                    15370: 'Spanish',
                    6156: 'French',
                    10250: 'Spanish',
                    4108: 'French',
                    20490: 'Spanish',
                    1122: 'Frisian',
                    3082: 'Spanish (Modern Sort)',
                    1110: 'Galician',
                    1034: 'Spanish (Traditional Sort)',
                    1079: 'Georgian',
                    21514: 'Spanish',
                    3079: 'German',
                    14346: 'Spanish',
                    1031: 'German',
                    8202: 'Spanish',
                    5127: 'German',
                    2077: 'Sweden',
                    4103: 'German',
                    1053: 'Swedish',
                    2055: 'German',
                    1114: 'Syriac',
                    1032: 'Greek',
                    1064: 'Tajik (Cyrillic)',
                    1135: 'Greenlandic',
                    2143: 'Tamazight (Latin)',
                    1095: 'Gujarati',
                    1097: 'Tamil',
                    1128: 'Hausa (Latin)',
                    1092: 'Tatar',
                    1037: 'Hebrew',
                    1098: 'Telugu',
                    1081: 'Hindi',
                    1054: 'Thai',
                    1038: 'Hungarian',
                    1105: 'Tibetan',
                    1039: 'Icelandic',
                    1055: 'Turkish',
                    1136: 'Igbo',
                    1090: 'Turkmen',
                    1057: 'Indonesian',
                    1152: 'Uighur',
                    1117: 'Inuktitut',
                    1058: 'Ukrainian',
                    2141: 'Inuktitut (Latin)',
                    1070: 'Upper Sorbian',
                    2108: 'Irish',
                    1056: 'Urdu',
                    1076: 'isiXhosa',
                    2115: 'Uzbek (Cyrillic)',
                    1077: 'isiZulu',
                    1091: 'Uzbek (Latin)',
                    1040: 'Italian',
                    1066: 'Vietnamese',
                    2064: 'Italian',
                    1106: 'Welsh',
                    1041: 'Japanese',
                    1160: 'Wolof',
                    1099: 'Kannada',
                    1157: 'Yakut',
                    1087: 'Kazakh',
                    1144: 'Yi',
                    1130: 'Yoruba',
                  },
                ];
              (q.process = function (t) {
                for (
                  var e = {}, r = 0, n = Object.keys(this.records);
                  r < n.length;
                  r++
                ) {
                  var i = this.records[n[r]],
                    o = Y[i.platformID][i.languageID];
                  if (
                    (null == o &&
                      null != this.langTags &&
                      i.languageID >= 32768 &&
                      (o = this.langTags[i.languageID - 32768].tag),
                    null == o && (o = i.platformID + '-' + i.languageID),
                    i.nameID >= 256)
                  )
                    null == e.fontFeatures && (e.fontFeatures = {}),
                      ((null != e.fontFeatures[o]
                        ? e.fontFeatures[o]
                        : (e.fontFeatures[o] = {}))[i.nameID] = i.string);
                  else {
                    var a = Z[i.nameID] || i.nameID;
                    null == e[a] && (e[a] = {}), (e[a][o] = i.string);
                  }
                }
                this.records = e;
              }),
                (q.preEncode = function () {
                  if (!Array.isArray(this.records)) {
                    this.version = 0;
                    var t = [];
                    for (var r in this.records) {
                      var i = this.records[r];
                      'fontFeatures' !== r &&
                        (t.push({
                          platformID: 3,
                          encodingID: 1,
                          languageID: 1033,
                          nameID: Z.indexOf(r),
                          length: n.byteLength(i.English, 'utf16le'),
                          string: i.English,
                        }),
                        'postscriptName' === r &&
                          t.push({
                            platformID: 1,
                            encodingID: 0,
                            languageID: 0,
                            nameID: Z.indexOf(r),
                            length: i.English.length,
                            string: i.English,
                          }));
                    }
                    (this.records = t),
                      (this.count = t.length),
                      (this.stringOffset = e.localExports.size(this, null, !1));
                  }
                });
              var V = new d.VersionedStruct(d.uint16, {
                  header: {
                    xAvgCharWidth: d.int16,
                    usWeightClass: d.uint16,
                    usWidthClass: d.uint16,
                    fsType: new d.Bitfield(d.uint16, [
                      null,
                      'noEmbedding',
                      'viewOnly',
                      'editable',
                      null,
                      null,
                      null,
                      null,
                      'noSubsetting',
                      'bitmapOnly',
                    ]),
                    ySubscriptXSize: d.int16,
                    ySubscriptYSize: d.int16,
                    ySubscriptXOffset: d.int16,
                    ySubscriptYOffset: d.int16,
                    ySuperscriptXSize: d.int16,
                    ySuperscriptYSize: d.int16,
                    ySuperscriptXOffset: d.int16,
                    ySuperscriptYOffset: d.int16,
                    yStrikeoutSize: d.int16,
                    yStrikeoutPosition: d.int16,
                    sFamilyClass: d.int16,
                    panose: new d.Array(d.uint8, 10),
                    ulCharRange: new d.Array(d.uint32, 4),
                    vendorID: new d.String(4),
                    fsSelection: new d.Bitfield(d.uint16, [
                      'italic',
                      'underscore',
                      'negative',
                      'outlined',
                      'strikeout',
                      'bold',
                      'regular',
                      'useTypoMetrics',
                      'wws',
                      'oblique',
                    ]),
                    usFirstCharIndex: d.uint16,
                    usLastCharIndex: d.uint16,
                  },
                  0: {},
                  1: {
                    typoAscender: d.int16,
                    typoDescender: d.int16,
                    typoLineGap: d.int16,
                    winAscent: d.uint16,
                    winDescent: d.uint16,
                    codePageRange: new d.Array(d.uint32, 2),
                  },
                  2: {
                    typoAscender: d.int16,
                    typoDescender: d.int16,
                    typoLineGap: d.int16,
                    winAscent: d.uint16,
                    winDescent: d.uint16,
                    codePageRange: new d.Array(d.uint32, 2),
                    xHeight: d.int16,
                    capHeight: d.int16,
                    defaultChar: d.uint16,
                    breakChar: d.uint16,
                    maxContent: d.uint16,
                  },
                  5: {
                    typoAscender: d.int16,
                    typoDescender: d.int16,
                    typoLineGap: d.int16,
                    winAscent: d.uint16,
                    winDescent: d.uint16,
                    codePageRange: new d.Array(d.uint32, 2),
                    xHeight: d.int16,
                    capHeight: d.int16,
                    defaultChar: d.uint16,
                    breakChar: d.uint16,
                    maxContent: d.uint16,
                    usLowerOpticalPointSize: d.uint16,
                    usUpperOpticalPointSize: d.uint16,
                  },
                }),
                K = V.versions;
              K[3] = K[4] = K[2];
              var X = new d.VersionedStruct(d.fixed32, {
                  header: {
                    italicAngle: d.fixed32,
                    underlinePosition: d.int16,
                    underlineThickness: d.int16,
                    isFixedPitch: d.uint32,
                    minMemType42: d.uint32,
                    maxMemType42: d.uint32,
                    minMemType1: d.uint32,
                    maxMemType1: d.uint32,
                  },
                  1: {},
                  2: {
                    numberOfGlyphs: d.uint16,
                    glyphNameIndex: new d.Array(d.uint16, 'numberOfGlyphs'),
                    names: new d.Array(new d.String(d.uint8)),
                  },
                  2.5: {
                    numberOfGlyphs: d.uint16,
                    offsets: new d.Array(d.uint8, 'numberOfGlyphs'),
                  },
                  3: {},
                  4: {
                    map: new d.Array(d.uint32, function (t) {
                      return t.parent.maxp.numGlyphs;
                    }),
                  },
                }),
                J = new d.VersionedStruct('head.indexToLocFormat', {
                  0: { offsets: new d.Array(d.uint16) },
                  1: { offsets: new d.Array(d.uint32) },
                });
              (J.process = function () {
                if (0 === this.version)
                  for (var t = 0; t < this.offsets.length; t++)
                    this.offsets[t] <<= 1;
              }),
                (J.preEncode = function () {
                  if (
                    null == this.version &&
                    ((this.version =
                      this.offsets[this.offsets.length - 1] > 65535 ? 1 : 0),
                    0 === this.version)
                  )
                    for (var t = 0; t < this.offsets.length; t++)
                      this.offsets[t] >>>= 1;
                });
              var Q = new d.Array(new d.Buffer()),
                $ = {};
              ($.cmap = R),
                ($.head = M),
                ($.hhea = F),
                ($.hmtx = z),
                ($.maxp = U),
                ($.name = q),
                ($['OS/2'] = V),
                ($.post = X),
                ($.loca = J),
                ($.glyf = Q);
              var tt = new d.Struct({
                  tag: new d.String(4),
                  checkSum: d.uint32,
                  offset: new d.Pointer(d.uint32, 'void', {
                    type: 'global',
                  }),
                  length: d.uint32,
                }),
                et = new d.Struct({
                  tag: new d.String(4),
                  numTables: d.uint16,
                  searchRange: d.uint16,
                  entrySelector: d.uint16,
                  rangeShift: d.uint16,
                  tables: new d.Array(tt, 'numTables'),
                });
              (et.process = function () {
                var t = this,
                  e = {};
                Object.keys(this.tables).forEach(function (r) {
                  var n = t.tables[r];
                  e[n.tag] = n;
                }),
                  (this.tables = e);
              }),
                (et.preEncode = function (t) {
                  var e = [];
                  for (var r in this.tables) {
                    var n = this.tables[r];
                    n &&
                      e.push({
                        tag: r,
                        checkSum: 0,
                        offset: new d.VoidPointer($[r], n),
                        length: $[r].size(n),
                      });
                  }
                  (this.tag = 'true'),
                    (this.numTables = e.length),
                    (this.tables = e),
                    (this.searchRange =
                      16 * Math.floor(Math.log(this.numTables) / Math.LN2)),
                    (this.entrySelector = Math.floor(
                      this.searchRange / Math.LN2
                    )),
                    (this.rangeShift = 16 * this.numTables - this.searchRange);
                });
              for (
                var rt = (function () {
                    function t(e) {
                      y(this, t), (this._characterSet = null);
                      for (
                        var r = Object.keys(e.tables), n = 0;
                        n < r.length;
                        n++
                      )
                        if (
                          (0 === (R = e.tables[r[n]]).platformID &&
                            (4 === R.encodingID || 6 === R.encodingID)) ||
                          (3 === R.platformID && 10 === R.encodingID)
                        )
                          return void (this.cmap = R.table);
                      for (n = 0; n < r.length; n++)
                        if (
                          0 === (R = e.tables[r[n]]).platformID ||
                          (3 === R.platformID && 1 === R.encodingID)
                        )
                          return void (this.cmap = R.table);
                      throw new Error('Could not find a unicode cmap');
                    }
                    return (
                      b(t, [
                        {
                          key: 'lookup',
                          value: function (t) {
                            var e = this.cmap;
                            switch (e.version) {
                              case 0:
                                return e.codeMap.get(t) || 0;
                              case 4:
                                for (var r = 0, n = e.segCount - 1; r <= n; ) {
                                  var i = (r + n) >> 1;
                                  if (t < e.startCode.get(i)) n = i - 1;
                                  else {
                                    if (!(t > e.endCode.get(i))) {
                                      var o = e.idRangeOffset.get(i),
                                        a = void 0;
                                      if (0 === o) a = t + e.idDelta.get(i);
                                      else {
                                        var s =
                                          o / 2 +
                                          (t - e.startCode.get(i)) -
                                          (e.segCount - i);
                                        0 !==
                                          (a = e.glyphIndexArray.get(s) || 0) &&
                                          (a += e.idDelta.get(i));
                                      }
                                      return 65535 & a;
                                    }
                                    r = i + 1;
                                  }
                                }
                                return 0;
                              case 8:
                                throw new Error('TODO: cmap format 8');
                              case 6:
                              case 10:
                                return e.glyphIndices.get(t - e.firstCode) || 0;
                              case 12:
                              case 13:
                                for (var u = 0, l = e.nGroups - 1; u <= l; ) {
                                  var c = (u + l) >> 1,
                                    h = e.groups.get(c);
                                  if (t < h.startCharCode) l = c - 1;
                                  else {
                                    if (!(t > h.endCharCode))
                                      return 12 === e.version
                                        ? h.glyphID + (t - h.startCharCode)
                                        : h.glyphID;
                                    u = c + 1;
                                  }
                                }
                                return 0;
                              case 14:
                                throw new Error('TODO: cmap format 14');
                              default:
                                throw new Error(
                                  'Unknown cmap format ' + e.version
                                );
                            }
                          },
                        },
                        {
                          key: 'getCharacterSet',
                          value: function () {
                            if (this._characterSet) return this._characterSet;
                            var t = this.cmap;
                            switch (t.version) {
                              case 0:
                                return (this._characterSet = a(
                                  0,
                                  t.codeMap.length
                                ));
                              case 4:
                                for (
                                  var e = [], r = t.endCode.toArray(), n = 0;
                                  n < r.length;
                                  n++
                                ) {
                                  var i = r[n] + 1,
                                    o = t.startCode.get(n);
                                  e.push.apply(e, E(a(o, i)));
                                }
                                return (this._characterSet = e);
                              case 8:
                                throw new Error('TODO: cmap format 8');
                              case 6:
                              case 10:
                                return (this._characterSet = a(
                                  t.firstCode,
                                  t.firstCode + t.glyphIndices.length
                                ));
                              case 12:
                              case 13:
                                for (
                                  var s = [], u = t.groups.toArray(), n = 0;
                                  n < u.length;
                                  n++
                                ) {
                                  var l = u[n];
                                  s.push.apply(
                                    s,
                                    E(a(l.startCharCode, l.endCharCode + 1))
                                  );
                                }
                                return (this._characterSet = s);
                              case 14:
                                throw new Error('TODO: cmap format 14');
                              default:
                                throw new Error(
                                  'Unknown cmap format ' + t.version
                                );
                            }
                          },
                        },
                      ]),
                      t
                    );
                  })(),
                  nt = (function () {
                    function t(e) {
                      y(this, t), (this.font = e);
                    }
                    return (
                      b(t, [
                        {
                          key: 'positionGlyphs',
                          value: function (t, e) {
                            for (var r = 0, n = 0, i = 0; i < t.length; i++)
                              t[i].isMark
                                ? (n = i)
                                : (r !== n && this.positionCluster(t, e, r, n),
                                  (r = n = i));
                            return (
                              r !== n && this.positionCluster(t, e, r, n), e
                            );
                          },
                        },
                        {
                          key: 'positionCluster',
                          value: function (t, e, r, n) {
                            var i = t[r],
                              o = i.cbox.copy();
                            i.codePoints.length > 1 &&
                              (o.minX +=
                                ((i.codePoints.length - 1) * o.width) /
                                i.codePoints.length);
                            for (
                              var a = -e[r].xAdvance,
                                s = 0,
                                u = this.font.unitsPerEm / 16,
                                l = r + 1;
                              l <= n;
                              l++
                            ) {
                              var c = t[l],
                                h = c.cbox,
                                f = e[l],
                                d = this.getCombiningClass(c.codePoints[0]);
                              if ('Not_Reordered' !== d) {
                                switch (((f.xOffset = f.yOffset = 0), d)) {
                                  case 'Double_Above':
                                  case 'Double_Below':
                                    f.xOffset += o.minX - h.width / 2 - h.minX;
                                    break;
                                  case 'Attached_Below_Left':
                                  case 'Below_Left':
                                  case 'Above_Left':
                                    f.xOffset += o.minX - h.minX;
                                    break;
                                  case 'Attached_Above_Right':
                                  case 'Below_Right':
                                  case 'Above_Right':
                                    f.xOffset += o.maxX - h.width - h.minX;
                                    break;
                                  default:
                                    f.xOffset +=
                                      o.minX + (o.width - h.width) / 2 - h.minX;
                                }
                                switch (d) {
                                  case 'Double_Below':
                                  case 'Below_Left':
                                  case 'Below':
                                  case 'Below_Right':
                                  case 'Attached_Below_Left':
                                  case 'Attached_Below':
                                    ('Attached_Below_Left' !== d &&
                                      'Attached_Below' !== d) ||
                                      (o.minY += u),
                                      (f.yOffset = -o.minY - h.maxY),
                                      (o.minY += h.height);
                                    break;
                                  case 'Double_Above':
                                  case 'Above_Left':
                                  case 'Above':
                                  case 'Above_Right':
                                  case 'Attached_Above':
                                  case 'Attached_Above_Right':
                                    ('Attached_Above' !== d &&
                                      'Attached_Above_Right' !== d) ||
                                      (o.maxY += u),
                                      (f.yOffset = o.maxY - h.minY),
                                      (o.maxY += h.height);
                                }
                                (f.xAdvance = f.yAdvance = 0),
                                  (f.xOffset += a),
                                  (f.yOffset += s);
                              } else (a -= f.xAdvance), (s -= f.yAdvance);
                            }
                          },
                        },
                        {
                          key: 'getCombiningClass',
                          value: function (t) {
                            var e = A.getCombiningClass(t);
                            if (3584 == (-256 & t))
                              if ('Not_Reordered' === e)
                                switch (t) {
                                  case 3633:
                                  case 3636:
                                  case 3637:
                                  case 3638:
                                  case 3639:
                                  case 3655:
                                  case 3660:
                                  case 3645:
                                  case 3662:
                                    return 'Above_Right';
                                  case 3761:
                                  case 3764:
                                  case 3765:
                                  case 3766:
                                  case 3767:
                                  case 3771:
                                  case 3788:
                                  case 3789:
                                    return 'Above';
                                  case 3772:
                                    return 'Below';
                                }
                              else if (3642 === t) return 'Below_Right';
                            switch (e) {
                              case 'CCC10':
                              case 'CCC11':
                              case 'CCC12':
                              case 'CCC13':
                              case 'CCC14':
                              case 'CCC15':
                              case 'CCC16':
                              case 'CCC17':
                              case 'CCC18':
                              case 'CCC20':
                              case 'CCC22':
                                return 'Below';
                              case 'CCC23':
                                return 'Attached_Above';
                              case 'CCC24':
                                return 'Above_Right';
                              case 'CCC25':
                              case 'CCC19':
                                return 'Above_Left';
                              case 'CCC26':
                                return 'Above';
                              case 'CCC21':
                                break;
                              case 'CCC27':
                              case 'CCC28':
                              case 'CCC30':
                              case 'CCC31':
                              case 'CCC33':
                              case 'CCC34':
                              case 'CCC35':
                              case 'CCC36':
                                return 'Above';
                              case 'CCC29':
                              case 'CCC32':
                                return 'Below';
                              case 'CCC103':
                                return 'Below_Right';
                              case 'CCC107':
                                return 'Above_Right';
                              case 'CCC118':
                                return 'Below';
                              case 'CCC122':
                                return 'Above';
                              case 'CCC129':
                              case 'CCC132':
                                return 'Below';
                              case 'CCC130':
                                return 'Above';
                            }
                            return e;
                          },
                        },
                      ]),
                      t
                    );
                  })(),
                  it = (function () {
                    function t(e, r, n, i) {
                      var o =
                          arguments.length <= 0 || void 0 === arguments[0]
                            ? 1 / 0
                            : arguments[0],
                        a =
                          arguments.length <= 1 || void 0 === arguments[1]
                            ? 1 / 0
                            : arguments[1],
                        s =
                          arguments.length <= 2 || void 0 === arguments[2]
                            ? -1 / 0
                            : arguments[2],
                        u =
                          arguments.length <= 3 || void 0 === arguments[3]
                            ? -1 / 0
                            : arguments[3];
                      y(this, t),
                        (this.minX = o),
                        (this.minY = a),
                        (this.maxX = s),
                        (this.maxY = u);
                    }
                    return (
                      b(t, [
                        {
                          key: 'addPoint',
                          value: function (t, e) {
                            t < this.minX && (this.minX = t),
                              e < this.minY && (this.minY = e),
                              t > this.maxX && (this.maxX = t),
                              e > this.maxY && (this.maxY = e);
                          },
                        },
                        {
                          key: 'copy',
                          value: function () {
                            return new t(
                              this.minX,
                              this.minY,
                              this.maxX,
                              this.maxY
                            );
                          },
                        },
                        {
                          key: 'width',
                          get: function () {
                            return this.maxX - this.minX;
                          },
                        },
                        {
                          key: 'height',
                          get: function () {
                            return this.maxY - this.minY;
                          },
                        },
                      ]),
                      t
                    );
                  })(),
                  ot = (function () {
                    function t(e, r) {
                      y(this, t), (this.glyphs = e), (this.positions = r);
                    }
                    return (
                      b(t, [
                        {
                          key: 'advanceWidth',
                          get: function () {
                            var t = this,
                              e = 0;
                            return (
                              Object.keys(this.positions).forEach(function (r) {
                                e += t.positions[r].xAdvance;
                              }),
                              e
                            );
                          },
                        },
                        {
                          key: 'advanceHeight',
                          get: function () {
                            var t = this,
                              e = 0;
                            return (
                              Object.keys(this.positions).forEach(function (r) {
                                e += t.positions[r].yAdvance;
                              }),
                              e
                            );
                          },
                        },
                        {
                          key: 'bbox',
                          get: function () {
                            for (
                              var t = new it(), e = 0, r = 0, n = 0;
                              n < this.glyphs.length;
                              n++
                            ) {
                              var i = this.glyphs[n],
                                o = this.positions[n],
                                a = i.bbox;
                              t.addPoint(
                                a.minX + e + o.xOffset,
                                a.minY + r + o.yOffset
                              ),
                                t.addPoint(
                                  a.maxX + e + o.xOffset,
                                  a.maxY + r + o.yOffset
                                ),
                                (e += o.xAdvance),
                                (r += o.yAdvance);
                            }
                            return t;
                          },
                        },
                      ]),
                      t
                    );
                  })(),
                  at = function t() {
                    var e =
                        arguments.length <= 0 || void 0 === arguments[0]
                          ? 0
                          : arguments[0],
                      r =
                        arguments.length <= 1 || void 0 === arguments[1]
                          ? 0
                          : arguments[1],
                      n =
                        arguments.length <= 2 || void 0 === arguments[2]
                          ? 0
                          : arguments[2],
                      i =
                        arguments.length <= 3 || void 0 === arguments[3]
                          ? 0
                          : arguments[3];
                    y(this, t),
                      (this.xAdvance = e),
                      (this.yAdvance = r),
                      (this.xOffset = n),
                      (this.yOffset = i);
                  },
                  st = {
                    Caucasian_Albanian: 'aghb',
                    Arabic: 'arab',
                    Imperial_Aramaic: 'armi',
                    Armenian: 'armn',
                    Avestan: 'avst',
                    Balinese: 'bali',
                    Bamum: 'bamu',
                    Bassa_Vah: 'bass',
                    Batak: 'batk',
                    Bengali: ['bng2', 'beng'],
                    Bopomofo: 'bopo',
                    Brahmi: 'brah',
                    Braille: 'brai',
                    Buginese: 'bugi',
                    Buhid: 'buhd',
                    Chakma: 'cakm',
                    Canadian_Aboriginal: 'cans',
                    Carian: 'cari',
                    Cham: 'cham',
                    Cherokee: 'cher',
                    Coptic: 'copt',
                    Cypriot: 'cprt',
                    Cyrillic: 'cyrl',
                    Devanagari: ['dev2', 'deva'],
                    Deseret: 'dsrt',
                    Duployan: 'dupl',
                    Egyptian_Hieroglyphs: 'egyp',
                    Elbasan: 'elba',
                    Ethiopic: 'ethi',
                    Georgian: 'geor',
                    Glagolitic: 'glag',
                    Gothic: 'goth',
                    Grantha: 'gran',
                    Greek: 'grek',
                    Gujarati: ['gjr2', 'gujr'],
                    Gurmukhi: ['gur2', 'guru'],
                    Hangul: 'hang',
                    Han: 'hani',
                    Hanunoo: 'hano',
                    Hebrew: 'hebr',
                    Hiragana: 'hira',
                    Pahawh_Hmong: 'hmng',
                    Katakana_Or_Hiragana: 'hrkt',
                    Old_Italic: 'ital',
                    Javanese: 'java',
                    Kayah_Li: 'kali',
                    Katakana: 'kana',
                    Kharoshthi: 'khar',
                    Khmer: 'khmr',
                    Khojki: 'khoj',
                    Kannada: ['knd2', 'knda'],
                    Kaithi: 'kthi',
                    Tai_Tham: 'lana',
                    Lao: 'lao ',
                    Latin: 'latn',
                    Lepcha: 'lepc',
                    Limbu: 'limb',
                    Linear_A: 'lina',
                    Linear_B: 'linb',
                    Lisu: 'lisu',
                    Lycian: 'lyci',
                    Lydian: 'lydi',
                    Mahajani: 'mahj',
                    Mandaic: 'mand',
                    Manichaean: 'mani',
                    Mende_Kikakui: 'mend',
                    Meroitic_Cursive: 'merc',
                    Meroitic_Hieroglyphs: 'mero',
                    Malayalam: ['mlm2', 'mlym'],
                    Modi: 'modi',
                    Mongolian: 'mong',
                    Mro: 'mroo',
                    Meetei_Mayek: 'mtei',
                    Myanmar: ['mym2', 'mymr'],
                    Old_North_Arabian: 'narb',
                    Nabataean: 'nbat',
                    Nko: 'nko ',
                    Ogham: 'ogam',
                    Ol_Chiki: 'olck',
                    Old_Turkic: 'orkh',
                    Oriya: 'orya',
                    Osmanya: 'osma',
                    Palmyrene: 'palm',
                    Pau_Cin_Hau: 'pauc',
                    Old_Permic: 'perm',
                    Phags_Pa: 'phag',
                    Inscriptional_Pahlavi: 'phli',
                    Psalter_Pahlavi: 'phlp',
                    Phoenician: 'phnx',
                    Miao: 'plrd',
                    Inscriptional_Parthian: 'prti',
                    Rejang: 'rjng',
                    Runic: 'runr',
                    Samaritan: 'samr',
                    Old_South_Arabian: 'sarb',
                    Saurashtra: 'saur',
                    Shavian: 'shaw',
                    Sharada: 'shrd',
                    Siddham: 'sidd',
                    Khudawadi: 'sind',
                    Sinhala: 'sinh',
                    Sora_Sompeng: 'sora',
                    Sundanese: 'sund',
                    Syloti_Nagri: 'sylo',
                    Syriac: 'syrc',
                    Tagbanwa: 'tagb',
                    Takri: 'takr',
                    Tai_Le: 'tale',
                    New_Tai_Lue: 'talu',
                    Tamil: 'taml',
                    Tai_Viet: 'tavt',
                    Telugu: ['tel2', 'telu'],
                    Tifinagh: 'tfng',
                    Tagalog: 'tglg',
                    Thaana: 'thaa',
                    Thai: 'thai',
                    Tibetan: 'tibt',
                    Tirhuta: 'tirh',
                    Ugaritic: 'ugar',
                    Vai: 'vai ',
                    Warang_Citi: 'wara',
                    Old_Persian: 'xpeo',
                    Cuneiform: 'xsux',
                    Yi: 'yi  ',
                    Inherited: 'zinh',
                    Common: 'zyyy',
                    Unknown: 'zzzz',
                  },
                  ut = (function () {
                    function t(e, r, n) {
                      y(this, t),
                        (this.font = e),
                        (this.script = r),
                        (this.language = n),
                        (this.direction = l(r)),
                        (this.stages = []),
                        (this.globalFeatures = {}),
                        (this.allFeatures = {});
                    }
                    return (
                      b(t, [
                        {
                          key: '_addFeatures',
                          value: function (t) {
                            var e = this,
                              r = this.stages[this.stages.length - 1];
                            Object.keys(t).forEach(function (n) {
                              var i = t[n];
                              e.allFeatures[i] ||
                                (r.push(i), (e.allFeatures[i] = !0));
                            });
                          },
                        },
                        {
                          key: '_addGlobal',
                          value: function (t) {
                            var e = this;
                            Object.keys(t).forEach(function (r) {
                              var n = t[r];
                              e.globalFeatures[n] = !0;
                            });
                          },
                        },
                        {
                          key: 'add',
                          value: function (t) {
                            var e =
                              arguments.length <= 1 ||
                              void 0 === arguments[1] ||
                              arguments[1];
                            if (
                              (0 === this.stages.length && this.stages.push([]),
                              'string' == typeof t && (t = [t]),
                              Array.isArray(t))
                            )
                              this._addFeatures(t), e && this._addGlobal(t);
                            else {
                              if (
                                'object' !== (void 0 === t ? 'undefined' : v(t))
                              )
                                throw new Error(
                                  'Unsupported argument to ShapingPlan#add'
                                );
                              var r = (t.global || []).concat(t.local || []);
                              this._addFeatures(r),
                                t.global && this._addGlobal(t.global);
                            }
                          },
                        },
                        {
                          key: 'addStage',
                          value: function (t, e) {
                            'function' == typeof t
                              ? this.stages.push(t, [])
                              : (this.stages.push([]), this.add(t, e));
                          },
                        },
                        {
                          key: 'assignGlobalFeatures',
                          value: function (t) {
                            var e = this;
                            Object.keys(t).forEach(function (r) {
                              var n = t[r];
                              for (var i in e.globalFeatures)
                                n.features[i] = !0;
                            });
                          },
                        },
                        {
                          key: 'process',
                          value: function (t, e, r) {
                            var n = this;
                            t.selectScript(this.script, this.language),
                              Object.keys(this.stages).forEach(function (i) {
                                var o = n.stages[i];
                                'function' == typeof o
                                  ? o(e, r)
                                  : o.length > 0 && t.applyFeatures(o, e, r);
                              });
                          },
                        },
                      ]),
                      t
                    );
                  })(),
                  lt = ['ccmp', 'locl', 'rlig', 'mark', 'mkmk'],
                  ct = ['frac', 'numr', 'dnom'],
                  ht = ['calt', 'clig', 'liga', 'rclt', 'curs', 'kern'],
                  ft = {
                    ltr: ['ltra', 'ltrm'],
                    rtl: ['rtla', 'rtlm'],
                  },
                  dt = (function () {
                    function t() {
                      y(this, t);
                    }
                    return (
                      b(t, null, [
                        {
                          key: 'plan',
                          value: function (t, e, r) {
                            this.planPreprocessing(t),
                              this.planFeatures(t),
                              this.planPostprocessing(t, r),
                              t.assignGlobalFeatures(e),
                              this.assignFeatures(t, e);
                          },
                        },
                        {
                          key: 'planPreprocessing',
                          value: function (t) {
                            t.add({
                              global: ft[t.direction],
                              local: ct,
                            });
                          },
                        },
                        {
                          key: 'planFeatures',
                          value: function (t) {},
                        },
                        {
                          key: 'planPostprocessing',
                          value: function (t, e) {
                            t.add([].concat(lt, ht, E(e)));
                          },
                        },
                        {
                          key: 'assignFeatures',
                          value: function (t, e) {
                            for (var r = 0; r < e.length; ) {
                              var n = e[r];
                              if (8260 === n.codePoints[0]) {
                                for (
                                  var i = r - 1, o = r + 1;
                                  i >= 0 && A.isDigit(e[i].codePoints[0]);

                                )
                                  (e[i].features.numr = !0),
                                    (e[i].features.frac = !0),
                                    i--;
                                for (
                                  ;
                                  o < e.length && A.isDigit(e[o].codePoints[0]);

                                )
                                  (e[o].features.dnom = !0),
                                    (e[o].features.frac = !0),
                                    o++;
                                (n.features.frac = !0), (r = o - 1);
                              } else r++;
                            }
                          },
                        },
                      ]),
                      t
                    );
                  })(),
                  pt = function t(e) {
                    var r =
                        arguments.length <= 1 || void 0 === arguments[1]
                          ? []
                          : arguments[1],
                      n =
                        arguments.length <= 2 || void 0 === arguments[2]
                          ? []
                          : arguments[2];
                    if (
                      (y(this, t),
                      (this.id = e),
                      (this.codePoints = r),
                      (this.isMark = this.codePoints.every(A.isMark)),
                      (this.isLigature = this.codePoints.length > 1),
                      (this.features = {}),
                      Array.isArray(n))
                    )
                      for (var i = 0; i < n.length; i++) {
                        var o = n[i];
                        this.features[o] = !0;
                      }
                    else
                      'object' === (void 0 === n ? 'undefined' : v(n)) &&
                        k(this.features, n);
                    (this.ligatureID = null),
                      (this.ligatureComponent = null),
                      (this.cursiveAttachment = null),
                      (this.markAttachment = null);
                  },
                  gt = { latn: dt, DFLT: dt },
                  _t = (function () {
                    function t(e, r) {
                      y(this, t), (this.glyphs = e), this.reset(r);
                    }
                    return (
                      b(t, [
                        {
                          key: 'reset',
                          value: function () {
                            var t =
                              arguments.length <= 0 || void 0 === arguments[0]
                                ? {}
                                : arguments[0];
                            (this.flags = t), (this.index = 0);
                          },
                        },
                        {
                          key: 'shouldIgnore',
                          value: function (t, e) {
                            return (
                              (e.ignoreMarks && t.isMark) ||
                              (e.ignoreBaseGlyphs && !t.isMark) ||
                              (e.ignoreLigatures && t.isLigature)
                            );
                          },
                        },
                        {
                          key: 'move',
                          value: function (t) {
                            for (
                              this.index += t;
                              0 <= this.index &&
                              this.index < this.glyphs.length &&
                              this.shouldIgnore(
                                this.glyphs[this.index],
                                this.flags
                              );

                            )
                              this.index += t;
                            return 0 > this.index ||
                              this.index >= this.glyphs.length
                              ? null
                              : this.glyphs[this.index];
                          },
                        },
                        {
                          key: 'next',
                          value: function () {
                            return this.move(1);
                          },
                        },
                        {
                          key: 'prev',
                          value: function () {
                            return this.move(-1);
                          },
                        },
                        {
                          key: 'peek',
                          value: function () {
                            var t =
                                arguments.length <= 0 || void 0 === arguments[0]
                                  ? 1
                                  : arguments[0],
                              e = this.index,
                              r = this.increment(t);
                            return (this.index = e), r;
                          },
                        },
                        {
                          key: 'peekIndex',
                          value: function () {
                            var t =
                                arguments.length <= 0 || void 0 === arguments[0]
                                  ? 1
                                  : arguments[0],
                              e = this.index;
                            this.increment(t);
                            var r = this.index;
                            return (this.index = e), r;
                          },
                        },
                        {
                          key: 'increment',
                          value: function () {
                            var t =
                                arguments.length <= 0 || void 0 === arguments[0]
                                  ? 1
                                  : arguments[0],
                              e = t < 0 ? -1 : 1;
                            for (t = Math.abs(t); t--; ) this.move(e);
                            return this.glyphs[this.index];
                          },
                        },
                        {
                          key: 'cur',
                          get: function () {
                            return this.glyphs[this.index] || null;
                          },
                        },
                      ]),
                      t
                    );
                  })(),
                  vt = ['DFLT', 'dflt', 'latn'],
                  mt =
                    ((function () {
                      function t(e, r) {
                        y(this, t),
                          (this.font = e),
                          (this.table = r),
                          (this.script = null),
                          (this.scriptTag = null),
                          (this.language = null),
                          (this.languageTag = null),
                          (this.features = {}),
                          (this.lookups = {}),
                          this.selectScript(),
                          (this.glyphs = []),
                          (this.positions = []),
                          (this.ligatureID = 1);
                      }
                      b(t, [
                        {
                          key: 'findScript',
                          value: function (t) {
                            if (null == this.table.scriptList) return null;
                            Array.isArray(t) || (t = [t]);
                            for (
                              var e = 0, r = Object.keys(this.table.scriptList);
                              e < r.length;
                              e++
                            )
                              for (
                                var n = this.table.scriptList[r[e]],
                                  i = 0,
                                  o = Object.keys(t);
                                i < o.length;
                                i++
                              ) {
                                var a = t[o[i]];
                                if (n.tag === a) return n;
                              }
                            return null;
                          },
                        },
                        {
                          key: 'selectScript',
                          value: function (t, e) {
                            var r = this,
                              n = !1,
                              i = void 0;
                            if (!this.script || t !== this.scriptTag) {
                              if (
                                ((i = this.findScript(t)),
                                t && (i = this.findScript(t)),
                                i || (i = this.findScript(vt)),
                                !i)
                              )
                                return;
                              (this.scriptTag = i.tag),
                                (this.script = i.script),
                                (this.direction = l(t)),
                                (this.language = null),
                                (n = !0);
                            }
                            if (!e && e !== this.langugeTag)
                              for (
                                var o = 0,
                                  a = Object.keys(this.script.langSysRecords);
                                o < a.length;
                                o++
                              ) {
                                var s = this.script.langSysRecords[a[o]];
                                if (s.tag === e) {
                                  (this.language = s.langSys),
                                    (this.langugeTag = s.tag),
                                    (n = !0);
                                  break;
                                }
                              }
                            this.language ||
                              (this.language = this.script.defaultLangSys),
                              n &&
                                ((this.features = {}),
                                this.language &&
                                  Object.keys(
                                    this.language.featureIndexes
                                  ).forEach(function (t) {
                                    var e = r.language.featureIndexes[t],
                                      n = r.table.featureList[e];
                                    r.features[n.tag] = n.feature;
                                  }));
                          },
                        },
                        {
                          key: 'lookupsForFeatures',
                          value: function () {
                            for (
                              var t =
                                  arguments.length <= 0 ||
                                  void 0 === arguments[0]
                                    ? []
                                    : arguments[0],
                                e = arguments[1],
                                r = [],
                                n = 0,
                                i = Object.keys(t);
                              n < i.length;
                              n++
                            ) {
                              var o = t[i[n]],
                                a = this.features[o];
                              if (a)
                                for (
                                  var s = 0,
                                    u = Object.keys(a.lookupListIndexes);
                                  s < u.length;
                                  s++
                                ) {
                                  var l = a.lookupListIndexes[u[s]];
                                  (e && -1 !== e.indexOf(l)) ||
                                    r.push({
                                      feature: o,
                                      index: l,
                                      lookup: this.table.lookupList.get(l),
                                    });
                                }
                            }
                            return (
                              r.sort(function (t, e) {
                                return t.index - e.index;
                              }),
                              r
                            );
                          },
                        },
                        {
                          key: 'applyFeatures',
                          value: function (t, e, r) {
                            var n = this.lookupsForFeatures(t);
                            this.applyLookups(n, e, r);
                          },
                        },
                        {
                          key: 'applyLookups',
                          value: function (t, e, r) {
                            (this.glyphs = e),
                              (this.positions = r),
                              (this.glyphIterator = new _t(e));
                            for (
                              var n = 0, i = Object.keys(t);
                              n < i.length;
                              n++
                            ) {
                              var o = t[i[n]],
                                a = o.feature,
                                s = o.lookup;
                              for (
                                this.glyphIterator.reset(s.flags);
                                this.glyphIterator.index < e.length;

                              )
                                if ((a in this.glyphIterator.cur.features)) {
                                  for (
                                    var u = 0, l = Object.keys(s.subTables);
                                    u < l.length;
                                    u++
                                  ) {
                                    var c = s.subTables[l[u]];
                                    if (this.applyLookup(s.lookupType, c))
                                      break;
                                  }
                                  this.glyphIterator.index++;
                                } else this.glyphIterator.index++;
                            }
                          },
                        },
                        {
                          key: 'applyLookup',
                          value: function (t, e) {
                            throw new Error(
                              'applyLookup must be implemented by subclasses'
                            );
                          },
                        },
                        {
                          key: 'applyLookupList',
                          value: function (t) {
                            var e = this,
                              r = this.glyphIterator.index;
                            Object.keys(t).forEach(function (n) {
                              var i = t[n];
                              e.glyphIterator.index = r + i.sequenceIndex;
                              var o = e.table.lookupList.get(i.lookupListIndex);
                              Object.keys(o.subTables).forEach(function (t) {
                                var r = o.subTables[t];
                                e.applyLookup(o.lookupType, r);
                              });
                            }),
                              (this.glyphIterator.index = r);
                          },
                        },
                        {
                          key: 'coverageIndex',
                          value: function (t, e) {
                            switch (
                              (null == e && (e = this.glyphIterator.cur.id),
                              t.version)
                            ) {
                              case 1:
                                return t.glyphs.indexOf(e);
                              case 2:
                                for (
                                  var r = 0, n = Object.keys(t.rangeRecords);
                                  r < n.length;
                                  r++
                                ) {
                                  var i = t.rangeRecords[n[r]];
                                  if (i.start <= e && e <= i.end)
                                    return i.startCoverageIndex + e - i.start;
                                }
                            }
                            return -1;
                          },
                        },
                        {
                          key: 'match',
                          value: function (t, e, r, n) {
                            for (
                              var i = this.glyphIterator.index,
                                o = this.glyphIterator.increment(t),
                                a = 0;
                              a < e.length && o && r(e[a], o.id);

                            )
                              n && n.push(this.glyphIterator.index),
                                a++,
                                (o = this.glyphIterator.next());
                            return (
                              (this.glyphIterator.index = i),
                              !(a < e.length) && (n || !0)
                            );
                          },
                        },
                        {
                          key: 'sequenceMatches',
                          value: function (t, e) {
                            return this.match(t, e, function (t, e) {
                              return t === e;
                            });
                          },
                        },
                        {
                          key: 'sequenceMatchIndices',
                          value: function (t, e) {
                            return this.match(
                              t,
                              e,
                              function (t, e) {
                                return t === e;
                              },
                              []
                            );
                          },
                        },
                        {
                          key: 'coverageSequenceMatches',
                          value: function (t, e) {
                            var r = this;
                            return this.match(t, e, function (t, e) {
                              return r.coverageIndex(t, e) >= 0;
                            });
                          },
                        },
                        {
                          key: 'getClassID',
                          value: function (t, e) {
                            switch (e.version) {
                              case 1:
                                for (
                                  var r = e.startGlyph,
                                    n = 0,
                                    i = Object.keys(e.classValueArray);
                                  n < i.length;
                                  n++
                                ) {
                                  var o = e.classValueArray[i[n]];
                                  if (t === r++) return o;
                                }
                                break;
                              case 2:
                                for (
                                  var n = 0,
                                    i = Object.keys(e.classRangeRecord);
                                  n < i.length;
                                  n++
                                ) {
                                  var a = e.classRangeRecord[i[n]];
                                  if (a.start <= t && t <= a.end)
                                    return a.class;
                                }
                            }
                            return -1;
                          },
                        },
                        {
                          key: 'classSequenceMatches',
                          value: function (t, e, r) {
                            var n = this;
                            return this.match(t, e, function (t, e) {
                              return t === n.getClassID(e, r);
                            });
                          },
                        },
                        {
                          key: 'applyContext',
                          value: function (t) {
                            switch (t.version) {
                              case 1:
                                var e = this.coverageIndex(t.coverage);
                                if (-1 === e) return;
                                for (
                                  var r = t.ruleSets[e],
                                    n = 0,
                                    i = Object.keys(r);
                                  n < i.length;
                                  n++
                                ) {
                                  o = r[i[n]];
                                  if (this.sequenceMatches(1, o.input))
                                    return this.applyLookupList(
                                      o.lookupRecords
                                    );
                                }
                                break;
                              case 2:
                                if (-1 === this.coverageIndex(t.coverage))
                                  return;
                                if (
                                  -1 ===
                                  (e = this.getClassID(
                                    this.glyphIterator.cur.id,
                                    t.classDef
                                  ))
                                )
                                  return;
                                r = t.classSet[e];
                                for (
                                  var n = 0, i = Object.keys(r);
                                  n < i.length;
                                  n++
                                ) {
                                  var o = r[i[n]];
                                  if (
                                    this.classSequenceMatches(
                                      1,
                                      o.classes,
                                      t.classDef
                                    )
                                  )
                                    return this.applyLookupList(
                                      o.lookupRecords
                                    );
                                }
                                break;
                              case 3:
                                if (
                                  this.coverageSequenceMatches(0, t.coverages)
                                )
                                  return this.applyLookupList(t.lookupRecords);
                            }
                          },
                        },
                        {
                          key: 'applyChainingContext',
                          value: function (t) {
                            switch (t.version) {
                              case 1:
                                var e = this.coverageIndex(t.coverage);
                                if (-1 === e) return;
                                for (
                                  var r = t.chainRuleSets[e],
                                    n = 0,
                                    i = Object.keys(r);
                                  n < i.length;
                                  n++
                                ) {
                                  a = r[i[n]];
                                  if (
                                    this.sequenceMatches(
                                      -a.backtrack.length,
                                      a.backtrack
                                    ) &&
                                    this.sequenceMatches(1, a.input) &&
                                    this.sequenceMatches(
                                      1 + a.input.length,
                                      a.lookahead
                                    )
                                  )
                                    return this.applyLookupList(
                                      a.lookupRecords
                                    );
                                }
                                break;
                              case 2:
                                if (-1 === this.coverageIndex(t.coverage))
                                  return;
                                if (
                                  -1 ===
                                  (e = this.getClassID(
                                    this.glyphIterator.cur.id,
                                    t.inputClassDef
                                  ))
                                )
                                  return;
                                for (
                                  var o = t.chainClassSet[e],
                                    n = 0,
                                    i = Object.keys(o);
                                  n < i.length;
                                  n++
                                ) {
                                  var a = o[i[n]];
                                  if (
                                    this.classSequenceMatches(
                                      -a.backtrack.length,
                                      a.backtrack,
                                      t.backtrackClassDef
                                    ) &&
                                    this.classSequenceMatches(
                                      1,
                                      a.input,
                                      t.inputClassDef
                                    ) &&
                                    this.classSequenceMatches(
                                      1 + a.input.length,
                                      a.lookahead,
                                      t.lookaheadClassDef
                                    )
                                  )
                                    return this.applyLookupList(
                                      a.lookupRecords
                                    );
                                }
                                break;
                              case 3:
                                if (
                                  this.coverageSequenceMatches(
                                    -t.backtrackGlyphCount,
                                    t.backtrackCoverage
                                  ) &&
                                  this.coverageSequenceMatches(
                                    0,
                                    t.inputCoverage
                                  ) &&
                                  this.coverageSequenceMatches(
                                    t.inputGlyphCount,
                                    t.lookaheadCoverage
                                  )
                                )
                                  return this.applyLookupList(t.lookupRecords);
                            }
                          },
                        },
                      ]);
                    })(),
                    (function () {
                      function t(e) {
                        y(this, t),
                          (this.font = e),
                          (this.glyphInfos = null),
                          (this.plan = null);
                      }
                      b(t, [
                        {
                          key: 'setup',
                          value: function (t, e, r, n) {
                            this.glyphInfos = t.map(function (t) {
                              return new pt(t.id, [].concat(E(t.codePoints)));
                            });
                            var i = c(r);
                            return (
                              (this.plan = new ut(this.font, r, n)),
                              i.plan(this.plan, this.glyphInfos, e)
                            );
                          },
                        },
                        {
                          key: 'substitute',
                          value: function (t) {
                            return t;
                          },
                        },
                        {
                          key: 'position',
                          value: function (t, e) {
                            return (
                              'rtl' === this.plan.direction &&
                                (t.reverse(), e.reverse()),
                              this.GPOSProcessor && this.GPOSProcessor.features
                            );
                          },
                        },
                        {
                          key: 'cleanup',
                          value: function () {
                            (this.glyphInfos = null), (this.plan = null);
                          },
                        },
                        {
                          key: 'getAvailableFeatures',
                          value: function (t, e) {
                            return [];
                          },
                        },
                      ]);
                    })(),
                    (function () {
                      function t(e) {
                        y(this, t),
                          (this.font = e),
                          (this.unicodeLayoutEngine = null);
                      }
                      return (
                        b(t, [
                          {
                            key: 'layout',
                            value: function (t) {
                              var e =
                                  arguments.length <= 1 ||
                                  void 0 === arguments[1]
                                    ? []
                                    : arguments[1],
                                r = arguments[2],
                                n = arguments[3];
                              if (
                                ('string' == typeof e &&
                                  ((n = r = e), (e = [])),
                                'string' == typeof t)
                              ) {
                                null == r && (r = s(t));
                                c = this.font.glyphsForString(t);
                              } else {
                                if (null == r) {
                                  for (
                                    var i = [], o = 0, a = Object.keys(t);
                                    o < a.length;
                                    o++
                                  ) {
                                    var l = t[a[o]];
                                    i.push.apply(i, E(l.codePoints));
                                  }
                                  r = u(i);
                                }
                                var c = t;
                              }
                              if (0 === c.length) return new ot(c, []);
                              c = this.substitute(c, e, r, n);
                              var h = this.position(c, e, r, n);
                              return new ot(c, h);
                            },
                          },
                          {
                            key: 'substitute',
                            value: function (t, e, r, n) {
                              return t;
                            },
                          },
                          {
                            key: 'position',
                            value: function (t, e, r, n) {
                              var i = t.map(function (t) {
                                return new at(t.advanceWidth);
                              });
                              return (
                                this.unicodeLayoutEngine ||
                                  (this.unicodeLayoutEngine = new nt(
                                    this.font
                                  )),
                                this.unicodeLayoutEngine.positionGlyphs(t, i),
                                i
                              );
                            },
                          },
                          {
                            key: 'getAvailableFeatures',
                            value: function (t, e) {
                              return [];
                            },
                          },
                        ]),
                        t
                      );
                    })()),
                  yt = (function () {
                    function t() {
                      y(this, t),
                        (this.commands = []),
                        (this._bbox = null),
                        (this._cbox = null);
                    }
                    return (
                      b(t, [
                        {
                          key: 'toFunction',
                          value: function () {
                            var t = this.commands.map(function (t) {
                              return (
                                '  ctx.' +
                                t.command +
                                '(' +
                                t.args.join(', ') +
                                ');'
                              );
                            });
                            return new Function('ctx', t.join('\n'));
                          },
                        },
                        {},
                        {
                          key: 'cbox',
                          get: function () {
                            if (!this._cbox) {
                              for (
                                var t = new it(),
                                  e = 0,
                                  r = Object.keys(this.commands);
                                e < r.length;
                                e++
                              )
                                for (
                                  var n = this.commands[e], i = 0;
                                  i < n.args.length;
                                  i += 2
                                )
                                  t.addPoint(n.args[i], n.args[i + 1]);
                              this._cbox = g(t);
                            }
                            return this._cbox;
                          },
                        },
                        {
                          key: 'bbox',
                          get: function () {
                            if (this._bbox) return this._bbox;
                            for (
                              var t = new it(),
                                e = 0,
                                r = 0,
                                n = function (t) {
                                  return (
                                    Math.pow(1 - t, 3) * w[i] +
                                    3 * Math.pow(1 - t, 2) * t * x[i] +
                                    3 * (1 - t) * Math.pow(t, 2) * S[i] +
                                    Math.pow(t, 3) * C[i]
                                  );
                                },
                                i = 0,
                                o = Object.keys(this.commands);
                              i < o.length;
                              i++
                            ) {
                              var a = this.commands[o[i]];
                              switch (a.command) {
                                case 'moveTo':
                                case 'lineTo':
                                  var s = P(a.args, 2),
                                    u = s[0],
                                    l = s[1];
                                  t.addPoint(u, l), (e = u), (r = l);
                                  break;
                                case 'quadraticCurveTo':
                                case 'bezierCurveTo':
                                  if ('quadraticCurveTo' === a.command)
                                    var c = P(a.args, 4),
                                      h = c[0],
                                      f = c[1],
                                      d = e + (2 / 3) * (h - e),
                                      p = r + (2 / 3) * (f - r),
                                      _ = (y = c[2]) + (2 / 3) * (h - y),
                                      v = (b = c[3]) + (2 / 3) * (f - b);
                                  else
                                    var m = P(a.args, 6),
                                      d = m[0],
                                      p = m[1],
                                      _ = m[2],
                                      v = m[3],
                                      y = m[4],
                                      b = m[5];
                                  t.addPoint(y, b);
                                  for (
                                    var w = [e, r],
                                      x = [d, p],
                                      S = [_, v],
                                      C = [y, b],
                                      k = 0;
                                    k <= 1;
                                    k++
                                  ) {
                                    var E = 6 * w[k] - 12 * x[k] + 6 * S[k],
                                      A =
                                        -3 * w[k] +
                                        9 * x[k] -
                                        9 * S[k] +
                                        3 * C[k],
                                      i = k;
                                    if (((a = 3 * x[k] - 3 * w[k]), 0 !== A)) {
                                      var j = Math.pow(E, 2) - 4 * a * A;
                                      if (!(j < 0)) {
                                        var I = (-E + Math.sqrt(j)) / (2 * A);
                                        0 < I &&
                                          I < 1 &&
                                          (0 === k
                                            ? t.addPoint(n(I), t.maxY)
                                            : 1 === k &&
                                              t.addPoint(t.maxX, n(I)));
                                        var T = (-E - Math.sqrt(j)) / (2 * A);
                                        0 < T &&
                                          T < 1 &&
                                          (0 === k
                                            ? t.addPoint(n(T), t.maxY)
                                            : 1 === k &&
                                              t.addPoint(t.maxX, n(T)));
                                      }
                                    } else {
                                      if (0 === E) continue;
                                      var B = -a / E;
                                      0 < B &&
                                        B < 1 &&
                                        (0 === k
                                          ? t.addPoint(n(B), t.maxY)
                                          : 1 === k &&
                                            t.addPoint(t.maxX, n(B)));
                                    }
                                  }
                                  (e = y), (r = b);
                              }
                            }
                            return (this._bbox = g(t));
                          },
                        },
                      ]),
                      t
                    );
                  })(),
                  bt = [
                    'moveTo',
                    'lineTo',
                    'quadraticCurveTo',
                    'bezierCurveTo',
                    'closePath',
                  ],
                  wt = 0;
                wt < bt.length;
                wt++
              )
                !(function () {
                  var t = bt[wt];
                  yt.prototype[t] = function () {
                    for (
                      var e = arguments.length, r = Array(e), n = 0;
                      n < e;
                      n++
                    )
                      r[n] = arguments[n];
                    return (
                      (this._bbox = this._cbox = null),
                      this.commands.push({
                        command: t,
                        args: r,
                      }),
                      this
                    );
                  };
                })();
              var xt,
                St,
                Ct = [
                  '.notdef',
                  '.null',
                  'nonmarkingreturn',
                  'space',
                  'exclam',
                  'quotedbl',
                  'numbersign',
                  'dollar',
                  'percent',
                  'ampersand',
                  'quotesingle',
                  'parenleft',
                  'parenright',
                  'asterisk',
                  'plus',
                  'comma',
                  'hyphen',
                  'period',
                  'slash',
                  'zero',
                  'one',
                  'two',
                  'three',
                  'four',
                  'five',
                  'six',
                  'seven',
                  'eight',
                  'nine',
                  'colon',
                  'semicolon',
                  'less',
                  'equal',
                  'greater',
                  'question',
                  'at',
                  'A',
                  'B',
                  'C',
                  'D',
                  'E',
                  'F',
                  'G',
                  'H',
                  'I',
                  'J',
                  'K',
                  'L',
                  'M',
                  'N',
                  'O',
                  'P',
                  'Q',
                  'R',
                  'S',
                  'T',
                  'U',
                  'V',
                  'W',
                  'X',
                  'Y',
                  'Z',
                  'bracketleft',
                  'backslash',
                  'bracketright',
                  'asciicircum',
                  'underscore',
                  'grave',
                  'a',
                  'b',
                  'c',
                  'd',
                  'e',
                  'f',
                  'g',
                  'h',
                  'i',
                  'j',
                  'k',
                  'l',
                  'm',
                  'n',
                  'o',
                  'p',
                  'q',
                  'r',
                  's',
                  't',
                  'u',
                  'v',
                  'w',
                  'x',
                  'y',
                  'z',
                  'braceleft',
                  'bar',
                  'braceright',
                  'asciitilde',
                  'Adieresis',
                  'Aring',
                  'Ccedilla',
                  'Eacute',
                  'Ntilde',
                  'Odieresis',
                  'Udieresis',
                  'aacute',
                  'agrave',
                  'acircumflex',
                  'adieresis',
                  'atilde',
                  'aring',
                  'ccedilla',
                  'eacute',
                  'egrave',
                  'ecircumflex',
                  'edieresis',
                  'iacute',
                  'igrave',
                  'icircumflex',
                  'idieresis',
                  'ntilde',
                  'oacute',
                  'ograve',
                  'ocircumflex',
                  'odieresis',
                  'otilde',
                  'uacute',
                  'ugrave',
                  'ucircumflex',
                  'udieresis',
                  'dagger',
                  'degree',
                  'cent',
                  'sterling',
                  'section',
                  'bullet',
                  'paragraph',
                  'germandbls',
                  'registered',
                  'copyright',
                  'trademark',
                  'acute',
                  'dieresis',
                  'notequal',
                  'AE',
                  'Oslash',
                  'infinity',
                  'plusminus',
                  'lessequal',
                  'greaterequal',
                  'yen',
                  'mu',
                  'partialdiff',
                  'summation',
                  'product',
                  'pi',
                  'integral',
                  'ordfeminine',
                  'ordmasculine',
                  'Omega',
                  'ae',
                  'oslash',
                  'questiondown',
                  'exclamdown',
                  'logicalnot',
                  'radical',
                  'florin',
                  'approxequal',
                  'Delta',
                  'guillemotleft',
                  'guillemotright',
                  'ellipsis',
                  'nonbreakingspace',
                  'Agrave',
                  'Atilde',
                  'Otilde',
                  'OE',
                  'oe',
                  'endash',
                  'emdash',
                  'quotedblleft',
                  'quotedblright',
                  'quoteleft',
                  'quoteright',
                  'divide',
                  'lozenge',
                  'ydieresis',
                  'Ydieresis',
                  'fraction',
                  'currency',
                  'guilsinglleft',
                  'guilsinglright',
                  'fi',
                  'fl',
                  'daggerdbl',
                  'periodcentered',
                  'quotesinglbase',
                  'quotedblbase',
                  'perthousand',
                  'Acircumflex',
                  'Ecircumflex',
                  'Aacute',
                  'Edieresis',
                  'Egrave',
                  'Iacute',
                  'Icircumflex',
                  'Idieresis',
                  'Igrave',
                  'Oacute',
                  'Ocircumflex',
                  'apple',
                  'Ograve',
                  'Uacute',
                  'Ucircumflex',
                  'Ugrave',
                  'dotlessi',
                  'circumflex',
                  'tilde',
                  'macron',
                  'breve',
                  'dotaccent',
                  'ring',
                  'cedilla',
                  'hungarumlaut',
                  'ogonek',
                  'caron',
                  'Lslash',
                  'lslash',
                  'Scaron',
                  'scaron',
                  'Zcaron',
                  'zcaron',
                  'brokenbar',
                  'Eth',
                  'eth',
                  'Yacute',
                  'yacute',
                  'Thorn',
                  'thorn',
                  'minus',
                  'multiply',
                  'onesuperior',
                  'twosuperior',
                  'threesuperior',
                  'onehalf',
                  'onequarter',
                  'threequarters',
                  'franc',
                  'Gbreve',
                  'gbreve',
                  'Idotaccent',
                  'Scedilla',
                  'scedilla',
                  'Cacute',
                  'cacute',
                  'Ccaron',
                  'ccaron',
                  'dcroat',
                ],
                kt =
                  ((xt = (function () {
                    function t(e, r, n) {
                      y(this, t),
                        (this.id = e),
                        (this.codePoints = r),
                        (this._font = n),
                        (this.isMark = this.codePoints.every(A.isMark)),
                        (this.isLigature = this.codePoints.length > 1);
                    }
                    return (
                      b(t, [
                        {
                          key: '_getPath',
                          value: function () {
                            return new yt();
                          },
                        },
                        {
                          key: '_getCBox',
                          value: function () {
                            return this.path.cbox;
                          },
                        },
                        {
                          key: '_getBBox',
                          value: function () {
                            return this.path.bbox;
                          },
                        },
                        {
                          key: '_getTableMetrics',
                          value: function (t) {
                            if (this.id < t.metrics.length)
                              return t.metrics.get(this.id);
                            var e = t.metrics.get(t.metrics.length - 1);
                            return {
                              advance: e ? e.advance : 0,
                              bearing:
                                t.bearings.get(this.id - t.metrics.length) || 0,
                            };
                          },
                        },
                        {
                          key: '_getMetrics',
                          value: function (t) {
                            if (this._metrics) return this._metrics;
                            var e = this._getTableMetrics(this._font.hmtx),
                              r = e.advance,
                              n = e.bearing,
                              i = void 0;
                            if (
                              ((void 0 !== t && null !== t) || (t = this.cbox),
                              (i = this._font['OS/2']) && i.version > 0)
                            )
                              var o = Math.abs(
                                  i.typoAscender - i.typoDescender
                                ),
                                a = i.typoAscender - t.maxY;
                            else
                              var s = this._font.hhea,
                                o = Math.abs(s.ascent - s.descent),
                                a = s.ascent - t.maxY;
                            return (this._metrics = {
                              advanceWidth: r,
                              advanceHeight: o,
                              leftBearing: n,
                              topBearing: a,
                            });
                          },
                        },
                        {
                          key: '_getName',
                          value: function () {
                            var t = this._font.post;
                            if (!t) return null;
                            switch (t.version) {
                              case 1:
                                return Ct[this.id];
                              case 2:
                                var e = t.glyphNameIndex[this.id];
                                return e < Ct.length
                                  ? Ct[e]
                                  : t.names[e - Ct.length];
                              case 2.5:
                                return Ct[this.id + t.offsets[this.id]];
                              case 4:
                                return String.fromCharCode(t.map[this.id]);
                            }
                          },
                        },
                        {
                          key: 'cbox',
                          get: function () {
                            return this._getCBox();
                          },
                        },
                        {
                          key: 'bbox',
                          get: function () {
                            return this._getBBox();
                          },
                        },
                        {
                          key: 'path',
                          get: function () {
                            return this._getPath();
                          },
                        },
                        {
                          key: 'advanceWidth',
                          get: function () {
                            return this._getMetrics().advanceWidth;
                          },
                        },
                        {
                          key: 'advanceHeight',
                          get: function () {
                            return this._getMetrics().advanceHeight;
                          },
                        },
                        {
                          key: 'ligatureCaretPositions',
                          get: function () {},
                        },
                        {
                          key: 'name',
                          get: function () {
                            return this._getName();
                          },
                        },
                      ]),
                      t
                    );
                  })()),
                  h(
                    xt.prototype,
                    'cbox',
                    [o],
                    p(xt.prototype, 'cbox'),
                    xt.prototype
                  ),
                  h(
                    xt.prototype,
                    'bbox',
                    [o],
                    p(xt.prototype, 'bbox'),
                    xt.prototype
                  ),
                  h(
                    xt.prototype,
                    'path',
                    [o],
                    p(xt.prototype, 'path'),
                    xt.prototype
                  ),
                  h(
                    xt.prototype,
                    'advanceWidth',
                    [o],
                    p(xt.prototype, 'advanceWidth'),
                    xt.prototype
                  ),
                  h(
                    xt.prototype,
                    'advanceHeight',
                    [o],
                    p(xt.prototype, 'advanceHeight'),
                    xt.prototype
                  ),
                  h(
                    xt.prototype,
                    'name',
                    [o],
                    p(xt.prototype, 'name'),
                    xt.prototype
                  ),
                  xt),
                Et = new d.Struct({
                  numberOfContours: d.int16,
                  xMin: d.int16,
                  yMin: d.int16,
                  xMax: d.int16,
                  yMax: d.int16,
                }),
                At = (function () {
                  function t(e, r, n, i) {
                    var o =
                        arguments.length <= 2 || void 0 === arguments[2]
                          ? 0
                          : arguments[2],
                      a =
                        arguments.length <= 3 || void 0 === arguments[3]
                          ? 0
                          : arguments[3];
                    y(this, t),
                      (this.onCurve = e),
                      (this.endContour = r),
                      (this.x = o),
                      (this.y = a);
                  }
                  return (
                    b(t, [
                      {
                        key: 'copy',
                        value: function () {
                          return new t(
                            this.onCurve,
                            this.endContour,
                            this.x,
                            this.y
                          );
                        },
                      },
                    ]),
                    t
                  );
                })(),
                Pt = function t(e, r, n) {
                  y(this, t),
                    (this.glyphID = e),
                    (this.dx = r),
                    (this.dy = n),
                    (this.pos = 0),
                    (this.scale =
                      this.xScale =
                      this.yScale =
                      this.scale01 =
                      this.scale10 =
                        null);
                },
                jt = (function (t) {
                  function e() {
                    return (
                      y(this, e),
                      x(this, (e.__proto__ || w(e)).apply(this, arguments))
                    );
                  }
                  return (
                    S(e, kt),
                    b(e, [
                      {
                        key: '_getCBox',
                        value: function (t) {
                          var e = this._font._getTableStream('glyf');
                          e.pos += this._font.loca.offsets[this.id];
                          var r = Et.decode(e),
                            n = new it(r.xMin, r.yMin, r.xMax, r.yMax);
                          return g(n);
                        },
                      },
                      {
                        key: '_parseGlyphCoord',
                        value: function (t, e, r, n) {
                          if (r) {
                            i = t.readUInt8();
                            n || (i = -i), (i += e);
                          } else if (n) i = e;
                          else var i = e + t.readInt16BE();
                          return i;
                        },
                      },
                      {
                        key: '_decode',
                        value: function () {
                          var t = this._font.loca.offsets[this.id];
                          if (t === this._font.loca.offsets[this.id + 1])
                            return null;
                          var e = this._font._getTableStream('glyf');
                          e.pos += t;
                          var r = e.pos,
                            n = Et.decode(e);
                          return (
                            n.numberOfContours > 0
                              ? this._decodeSimple(n, e)
                              : n.numberOfContours < 0 &&
                                this._decodeComposite(n, e, r),
                            n
                          );
                        },
                      },
                      {
                        key: '_decodeSimple',
                        value: function (t, e) {
                          t.points = [];
                          for (
                            var r = new d.Array(
                                d.uint16,
                                t.numberOfContours
                              ).decode(e),
                              n =
                                (new d.Array(d.uint8, d.uint16).decode(e), []),
                              i = r[r.length - 1] + 1;
                            n.length < i;

                          ) {
                            s = e.readUInt8();
                            if ((n.push(s), 8 & s))
                              for (var o = e.readUInt8(), a = 0; a < o; a++)
                                n.push(s);
                          }
                          for (c = 0; c < n.length; c++) {
                            var s = n[c],
                              u = new At(!!(1 & s), r.indexOf(c) >= 0, 0, 0);
                            t.points.push(u);
                          }
                          for (var l = 0, c = 0; c < n.length; c++) {
                            s = n[c];
                            t.points[c].x = l = this._parseGlyphCoord(
                              e,
                              l,
                              2 & s,
                              16 & s
                            );
                          }
                          for (var h = 0, c = 0; c < n.length; c++) {
                            s = n[c];
                            t.points[c].y = h = this._parseGlyphCoord(
                              e,
                              h,
                              4 & s,
                              32 & s
                            );
                          }
                        },
                      },
                      {
                        key: '_decodeComposite',
                        value: function (t, e) {
                          var r =
                            arguments.length <= 2 || void 0 === arguments[2]
                              ? 0
                              : arguments[2];
                          t.components = [];
                          for (var n = !1, i = 32; 32 & i; ) {
                            i = e.readUInt16BE();
                            var o = e.pos - r,
                              a = e.readUInt16BE();
                            if ((n || (n = 0 != (256 & i)), 1 & i))
                              var s = e.readInt16BE(),
                                u = e.readInt16BE();
                            else
                              var s = e.readInt8(),
                                u = e.readInt8();
                            var l = new Pt(a, s, u);
                            (l.pos = o),
                              (l.scaleX = l.scaleY = 1),
                              (l.scale01 = l.scale10 = 0),
                              8 & i
                                ? (l.scaleX = l.scaleY =
                                    ((e.readUInt8() << 24) |
                                      (e.readUInt8() << 16)) /
                                    1073741824)
                                : 64 & i
                                ? ((l.scaleX =
                                    ((e.readUInt8() << 24) |
                                      (e.readUInt8() << 16)) /
                                    1073741824),
                                  (l.scaleY =
                                    ((e.readUInt8() << 24) |
                                      (e.readUInt8() << 16)) /
                                    1073741824))
                                : 128 & i &&
                                  ((l.scaleX =
                                    ((e.readUInt8() << 24) |
                                      (e.readUInt8() << 16)) /
                                    1073741824),
                                  (l.scale01 =
                                    ((e.readUInt8() << 24) |
                                      (e.readUInt8() << 16)) /
                                    1073741824),
                                  (l.scale10 =
                                    ((e.readUInt8() << 24) |
                                      (e.readUInt8() << 16)) /
                                    1073741824),
                                  (l.scaleY =
                                    ((e.readUInt8() << 24) |
                                      (e.readUInt8() << 16)) /
                                    1073741824)),
                              t.components.push(l);
                          }
                          return n;
                        },
                      },
                      {
                        key: '_getPhantomPoints',
                        value: function (t) {
                          var e = this._getCBox(!0);
                          null == this._metrics &&
                            (this._metrics = kt.prototype._getMetrics.call(
                              this,
                              e
                            ));
                          var r = this._metrics,
                            n = r.advanceWidth,
                            i = r.advanceHeight,
                            o = r.leftBearing,
                            a = r.topBearing;
                          return [
                            new At(!1, !0, t.xMin - o, 0),
                            new At(!1, !0, t.xMin - o + n, 0),
                            new At(!1, !0, 0, t.yMax + a),
                            new At(!1, !0, 0, t.yMax + a + i),
                          ];
                        },
                      },
                      {
                        key: '_getContours',
                        value: function () {
                          var t = this._decode();
                          if (!t) return [];
                          if (t.numberOfContours < 0)
                            for (
                              var e = [], r = 0, n = Object.keys(t.components);
                              r < n.length;
                              r++
                            )
                              for (
                                var i = t.components[n[r]],
                                  o = 0,
                                  a = Object.keys(t.points);
                                o < a.length;
                                o++
                              ) {
                                c = t.points[n[o]];
                                e.push(
                                  new At(
                                    c.onCurve,
                                    c.endContour,
                                    c.x + i.dx,
                                    c.y + i.dy
                                  )
                                );
                              }
                          else e = t.points;
                          for (var s = [], u = [], l = 0; l < e.length; l++) {
                            var c = e[l];
                            u.push(c), c.endContour && (s.push(u), (u = []));
                          }
                          return s;
                        },
                      },
                      {
                        key: '_getMetrics',
                        value: function () {
                          if (this._metrics) return this._metrics;
                          var t = this._getCBox(!0);
                          return (
                            C(
                              e.prototype.__proto__ || w(e.prototype),
                              '_getMetrics',
                              this
                            ).call(this, t),
                            this._metrics
                          );
                        },
                      },
                      {
                        key: '_getPath',
                        value: function () {
                          for (
                            var t = this._getContours(), e = new yt(), r = 0;
                            r < t.length;
                            r++
                          ) {
                            var n = t[r],
                              i = n[0],
                              o = n[n.length - 1],
                              a = 0;
                            if (i.onCurve) {
                              f = null;
                              a = 1;
                            } else
                              f = i = o.onCurve
                                ? o
                                : new At(
                                    !1,
                                    !1,
                                    (i.x + o.x) / 2,
                                    (i.y + o.y) / 2
                                  );
                            e.moveTo(i.x, i.y);
                            for (var s = a; s < n.length; s++) {
                              var u = n[s],
                                l = 0 === s ? i : n[s - 1];
                              if (l.onCurve && u.onCurve) e.lineTo(u.x, u.y);
                              else if (l.onCurve && !u.onCurve) f = u;
                              else if (l.onCurve || u.onCurve) {
                                if (l.onCurve || !u.onCurve)
                                  throw new Error('Unknown TTF path state');
                                e.quadraticCurveTo(f.x, f.y, u.x, u.y);
                                f = null;
                              } else {
                                var c = (l.x + u.x) / 2,
                                  h = (l.y + u.y) / 2;
                                e.quadraticCurveTo(l.x, l.y, c, h);
                                var f = u;
                              }
                            }
                            i !== o &&
                              (f
                                ? e.quadraticCurveTo(f.x, f.y, i.x, i.y)
                                : e.lineTo(i.x, i.y));
                          }
                          return e.closePath(), e;
                        },
                      },
                    ]),
                    e
                  );
                })(),
                It = (function () {
                  function t(e) {
                    y(this, t),
                      (this.font = e),
                      (this.glyphs = []),
                      (this.mapping = {}),
                      this.includeGlyph(0);
                  }
                  return (
                    b(t, [
                      {
                        key: 'includeGlyph',
                        value: function (t) {
                          return (
                            'object' === (void 0 === t ? 'undefined' : v(t)) &&
                              (t = t.id),
                            null == this.mapping[t] &&
                              (this.glyphs.push(t),
                              (this.mapping[t] = this.glyphs.length - 1)),
                            this.mapping[t]
                          );
                        },
                      },
                      {
                        key: 'encodeStream',
                        value: function () {
                          var t = this,
                            e = new d.EncodeStream();
                          return (
                            r.nextTick(function () {
                              return t.encode(e), e.end();
                            }),
                            e
                          );
                        },
                      },
                    ]),
                    t
                  );
                })(),
                Tt = (function (t) {
                  function e() {
                    return (
                      y(this, e),
                      x(this, (e.__proto__ || w(e)).apply(this, arguments))
                    );
                  }
                  return (
                    S(e, It),
                    b(e, [
                      {
                        key: '_addGlyph',
                        value: function (t) {
                          var e = this.font.getGlyph(t)._decode(),
                            r = this.font.loca.offsets[t],
                            i = this.font.loca.offsets[t + 1],
                            o = this.font._getTableStream('glyf');
                          o.pos += r;
                          var a = o.readBuffer(i - r);
                          if (e && e.numberOfContours < 0) {
                            a = new n(a);
                            for (
                              var s = 0, u = Object.keys(e.components);
                              s < u.length;
                              s++
                            ) {
                              var l = e.components[u[s]];
                              (t = this.includeGlyph(l.glyphID)),
                                a.writeUInt16BE(t, l.pos);
                            }
                          }
                          return (
                            this.glyf.push(a),
                            this.loca.offsets.push(this.offset),
                            t < this.font.hmtx.metrics.length
                              ? this.hmtx.metrics.push(
                                  this.font.hmtx.metrics.get(t)
                                )
                              : this.hmtx.metrics.push({
                                  advance: this.font.hmtx.metrics.get(
                                    this.font.hmtx.metrics.length - 1
                                  ).advance,
                                  bearing: this.font.hmtx.bearings.get(
                                    t - this.font.hmtx.metrics.length
                                  ),
                                }),
                            (this.offset += a.length),
                            this.glyf.length - 1
                          );
                        },
                      },
                      {
                        key: 'encode',
                        value: function (t) {
                          (this.glyf = []),
                            (this.offset = 0),
                            (this.loca = {
                              offsets: [],
                            }),
                            (this.hmtx = {
                              metrics: [],
                              bearings: [],
                            });
                          for (var e = 0; e < this.glyphs.length; )
                            this._addGlyph(this.glyphs[e++]);
                          var r = j(this.font.maxp);
                          (r.numGlyphs = this.glyf.length),
                            this.loca.offsets.push(this.offset),
                            $.loca.preEncode.call(this.loca);
                          var n = j(this.font.head);
                          n.indexToLocFormat = this.loca.version;
                          var i = j(this.font.hhea);
                          (i.numberOfMetrics = this.hmtx.metrics.length),
                            et.encode(t, {
                              tables: {
                                head: n,
                                hhea: i,
                                loca: this.loca,
                                maxp: r,
                                'cvt ': this.font['cvt '],
                                prep: this.font.prep,
                                glyf: this.glyf,
                                hmtx: this.hmtx,
                                fpgm: this.font.fpgm,
                              },
                            });
                        },
                      },
                    ]),
                    e
                  );
                })(),
                Bt =
                  ((St = (function () {
                    function t(e, r) {
                      arguments.length <= 1 ||
                        void 0 === arguments[1] ||
                        arguments[1];
                      y(this, t),
                        (this.stream = e),
                        (this._directoryPos = this.stream.pos),
                        (this._tables = {}),
                        (this._glyphs = {}),
                        this._decodeDirectory();
                      for (var n in this.directory.tables) {
                        var i = this.directory.tables[n];
                        $[n] &&
                          i.length > 0 &&
                          m(this, n, {
                            get: this._getTable.bind(this, i),
                          });
                      }
                    }
                    return (
                      b(t, null, [
                        {
                          key: 'probe',
                          value: function (t) {
                            var e = t.toString('ascii', 0, 4);
                            return (
                              'true' === e ||
                              'OTTO' === e ||
                              e === String.fromCharCode(0, 1, 0, 0)
                            );
                          },
                        },
                      ]),
                      b(t, [
                        {
                          key: '_getTable',
                          value: function (t) {
                            if (!(t.tag in this._tables))
                              try {
                                this._tables[t.tag] = this._decodeTable(t);
                              } catch (e) {
                                I.logErrors &&
                                  (console.error(
                                    'Error decoding table ' + t.tag
                                  ),
                                  console.error(e.stack));
                              }
                            return this._tables[t.tag];
                          },
                        },
                        {
                          key: '_getTableStream',
                          value: function (t) {
                            var e = this.directory.tables[t];
                            return e
                              ? ((this.stream.pos = e.offset), this.stream)
                              : null;
                          },
                        },
                        {
                          key: '_decodeDirectory',
                          value: function () {
                            return (this.directory = et.decode(this.stream, {
                              _startOffset: 0,
                            }));
                          },
                        },
                        {
                          key: '_decodeTable',
                          value: function (t) {
                            var e = this.stream.pos,
                              r = this._getTableStream(t.tag),
                              n = $[t.tag].decode(r, this, t.length);
                            return (this.stream.pos = e), n;
                          },
                        },
                        {
                          key: 'getName',
                          value: function (t) {
                            var e =
                                arguments.length <= 1 || void 0 === arguments[1]
                                  ? 'English'
                                  : arguments[1],
                              r = this.name.records[t];
                            return r ? r[e] : null;
                          },
                        },
                        {
                          key: 'hasGlyphForCodePoint',
                          value: function (t) {
                            return !!this._cmapProcessor.lookup(t);
                          },
                        },
                        {
                          key: 'glyphForCodePoint',
                          value: function (t) {
                            return this.getGlyph(
                              this._cmapProcessor.lookup(t),
                              [t]
                            );
                          },
                        },
                        {
                          key: 'glyphsForString',
                          value: function (t) {
                            for (var e = [], r = t.length, n = 0; n < r; ) {
                              var i = t.charCodeAt(n++);
                              if (55296 <= i && i <= 56319 && n < r) {
                                var o = t.charCodeAt(n);
                                56320 <= o &&
                                  o <= 57343 &&
                                  (n++,
                                  (i =
                                    ((1023 & i) << 10) + (1023 & o) + 65536));
                              }
                              e.push(this.glyphForCodePoint(i));
                            }
                            return e;
                          },
                        },
                        {
                          key: 'layout',
                          value: function (t, e, r, n) {
                            return this._layoutEngine.layout(t, e, r, n);
                          },
                        },
                        {
                          key: '_getBaseGlyph',
                          value: function (t) {
                            var e =
                              arguments.length <= 1 || void 0 === arguments[1]
                                ? []
                                : arguments[1];
                            return (
                              this._glyphs[t] ||
                                (this.directory.tables.glyf &&
                                  (this._glyphs[t] = new jt(t, e, this))),
                              this._glyphs[t] || null
                            );
                          },
                        },
                        {
                          key: 'getGlyph',
                          value: function (t) {
                            var e =
                              arguments.length <= 1 || void 0 === arguments[1]
                                ? []
                                : arguments[1];
                            return (
                              this._glyphs[t] || this._getBaseGlyph(t, e),
                              this._glyphs[t] || null
                            );
                          },
                        },
                        {
                          key: 'createSubset',
                          value: function () {
                            return new Tt(this);
                          },
                        },
                        {
                          key: 'getVariation',
                          value: function (e) {
                            if (
                              !this.directory.tables.fvar ||
                              !this.directory.tables.gvar ||
                              !this.directory.tables.glyf
                            )
                              throw new Error(
                                'Variations require a font with the fvar, gvar, and glyf tables.'
                              );
                            if (
                              ('string' == typeof e &&
                                (e = this.namedVariations[e]),
                              'object' !== (void 0 === e ? 'undefined' : v(e)))
                            )
                              throw new Error(
                                'Variation settings must be either a variation name or settings object.'
                              );
                            var r = new d.DecodeStream(this.stream.buffer);
                            r.pos = this._directoryPos;
                            var n = new t(r);
                            return (n._tables = this._tables), n;
                          },
                        },
                        {
                          key: 'getFont',
                          value: function (t) {
                            return this.getVariation(t);
                          },
                        },
                        {
                          key: 'postscriptName',
                          get: function () {
                            var t = this.name.records.postscriptName;
                            return t[_(t)[0]];
                          },
                        },
                        {
                          key: 'fullName',
                          get: function () {
                            return this.getName('fullName');
                          },
                        },
                        {
                          key: 'familyName',
                          get: function () {
                            return this.getName('fontFamily');
                          },
                        },
                        {
                          key: 'subfamilyName',
                          get: function () {
                            return this.getName('fontSubfamily');
                          },
                        },
                        {
                          key: 'copyright',
                          get: function () {
                            return this.getName('copyright');
                          },
                        },
                        {
                          key: 'version',
                          get: function () {
                            return this.getName('version');
                          },
                        },
                        {
                          key: 'ascent',
                          get: function () {
                            return this.hhea.ascent;
                          },
                        },
                        {
                          key: 'descent',
                          get: function () {
                            return this.hhea.descent;
                          },
                        },
                        {
                          key: 'lineGap',
                          get: function () {
                            return this.hhea.lineGap;
                          },
                        },
                        {
                          key: 'underlinePosition',
                          get: function () {
                            return this.post.underlinePosition;
                          },
                        },
                        {
                          key: 'underlineThickness',
                          get: function () {
                            return this.post.underlineThickness;
                          },
                        },
                        {
                          key: 'italicAngle',
                          get: function () {
                            return this.post.italicAngle;
                          },
                        },
                        {
                          key: 'capHeight',
                          get: function () {
                            var t = this['OS/2'];
                            return t ? t.capHeight : this.ascent;
                          },
                        },
                        {
                          key: 'xHeight',
                          get: function () {
                            var t = this['OS/2'];
                            return t ? t.xHeight : 0;
                          },
                        },
                        {
                          key: 'numGlyphs',
                          get: function () {
                            return this.maxp.numGlyphs;
                          },
                        },
                        {
                          key: 'unitsPerEm',
                          get: function () {
                            return this.head.unitsPerEm;
                          },
                        },
                        {
                          key: 'bbox',
                          get: function () {
                            return g(
                              new it(
                                this.head.xMin,
                                this.head.yMin,
                                this.head.xMax,
                                this.head.yMax
                              )
                            );
                          },
                        },
                        {
                          key: '_cmapProcessor',
                          get: function () {
                            return new rt(this.cmap);
                          },
                        },
                        {
                          key: 'characterSet',
                          get: function () {
                            return this._cmapProcessor.getCharacterSet();
                          },
                        },
                        {
                          key: '_layoutEngine',
                          get: function () {
                            return new mt(this);
                          },
                        },
                        {
                          key: 'availableFeatures',
                          get: function () {
                            return this._layoutEngine.getAvailableFeatures();
                          },
                        },
                        {
                          key: 'variationAxes',
                          get: function () {
                            return {};
                          },
                        },
                        {
                          key: 'namedVariations',
                          get: function () {
                            return {};
                          },
                        },
                      ]),
                      t
                    );
                  })()),
                  f(
                    St.prototype,
                    'bbox',
                    [o],
                    p(St.prototype, 'bbox'),
                    St.prototype
                  ),
                  f(
                    St.prototype,
                    '_cmapProcessor',
                    [o],
                    p(St.prototype, '_cmapProcessor'),
                    St.prototype
                  ),
                  f(
                    St.prototype,
                    'characterSet',
                    [o],
                    p(St.prototype, 'characterSet'),
                    St.prototype
                  ),
                  f(
                    St.prototype,
                    '_layoutEngine',
                    [o],
                    p(St.prototype, '_layoutEngine'),
                    St.prototype
                  ),
                  St),
                Lt = new d.VersionedStruct(d.uint32, {
                  65536: {
                    numFonts: d.uint32,
                    offsets: new d.Array(d.uint32, 'numFonts'),
                  },
                  131072: {
                    numFonts: d.uint32,
                    offsets: new d.Array(d.uint32, 'numFonts'),
                    dsigTag: d.uint32,
                    dsigLength: d.uint32,
                    dsigOffset: d.uint32,
                  },
                }),
                Ot = (function () {
                  function t(e) {
                    if (
                      (y(this, t),
                      (this.stream = e),
                      'ttcf' !== e.readString(4))
                    )
                      throw new Error('Not a TrueType collection');
                    this.header = Lt.decode(e);
                  }
                  return (
                    b(t, null, [
                      {
                        key: 'probe',
                        value: function (t) {
                          return 'ttcf' === t.toString('ascii', 0, 4);
                        },
                      },
                    ]),
                    b(t, [
                      {
                        key: 'getFont',
                        value: function (t) {
                          for (
                            var e = 0, r = Object.keys(this.header.offsets);
                            e < r.length;
                            e++
                          ) {
                            var n = this.header.offsets[r[e]],
                              i = new d.DecodeStream(this.stream.buffer);
                            i.pos = n;
                            var o = new Bt(i);
                            if (o.postscriptName === t) return o;
                          }
                          return null;
                        },
                      },
                      {
                        key: 'fonts',
                        get: function () {
                          for (
                            var t = [],
                              e = 0,
                              r = Object.keys(this.header.offsets);
                            e < r.length;
                            e++
                          ) {
                            var n = this.header.offsets[r[e]],
                              i = new d.DecodeStream(this.stream.buffer);
                            (i.pos = n), t.push(new Bt(i));
                          }
                          return t;
                        },
                      },
                    ]),
                    t
                  );
                })(),
                Nt = new d.String(d.uint8),
                Rt =
                  (new d.Struct({
                    len: d.uint32,
                    buf: new d.Buffer('len'),
                  }),
                  new d.Struct({
                    id: d.uint16,
                    nameOffset: d.int16,
                    attr: d.uint8,
                    dataOffset: d.uint24,
                    handle: d.uint32,
                  })),
                Mt = new d.Struct({
                  name: new d.String(4),
                  maxTypeIndex: d.uint16,
                  refList: new d.Pointer(
                    d.uint16,
                    new d.Array(Rt, function (t) {
                      return t.maxTypeIndex + 1;
                    }),
                    { type: 'parent' }
                  ),
                }),
                Ft = new d.Struct({
                  length: d.uint16,
                  types: new d.Array(Mt, function (t) {
                    return t.length + 1;
                  }),
                }),
                Dt = new d.Struct({
                  reserved: new d.Reserved(d.uint8, 24),
                  typeList: new d.Pointer(d.uint16, Ft),
                  nameListOffset: new d.Pointer(d.uint16, 'void'),
                }),
                zt = new d.Struct({
                  dataOffset: d.uint32,
                  map: new d.Pointer(d.uint32, Dt),
                  dataLength: d.uint32,
                  mapLength: d.uint32,
                }),
                Ut = (function () {
                  function t(e) {
                    y(this, t),
                      (this.stream = e),
                      (this.header = zt.decode(this.stream));
                    for (
                      var r = 0,
                        n = Object.keys(this.header.map.typeList.types);
                      r < n.length;
                      r++
                    ) {
                      for (
                        var i = this.header.map.typeList.types[n[r]],
                          o = 0,
                          a = Object.keys(i.refList);
                        o < a.length;
                        o++
                      ) {
                        var s = i.refList[a[o]];
                        s.nameOffset >= 0
                          ? ((this.stream.pos =
                              s.nameOffset + this.header.map.nameListOffset),
                            (s.name = Nt.decode(this.stream)))
                          : (s.name = null);
                      }
                      'sfnt' === i.name && (this.sfnt = i);
                    }
                  }
                  return (
                    b(t, null, [
                      {
                        key: 'probe',
                        value: function (t) {
                          var e = new d.DecodeStream(t);
                          try {
                            var r = zt.decode(e);
                          } catch (t) {
                            return !1;
                          }
                          for (
                            var n = 0, i = Object.keys(r.map.typeList.types);
                            n < i.length;
                            n++
                          )
                            if ('sfnt' === r.map.typeList.types[i[n]].name)
                              return !0;
                          return !1;
                        },
                      },
                    ]),
                    b(t, [
                      {
                        key: 'getFont',
                        value: function (t) {
                          if (!this.sfnt) return null;
                          for (
                            var e = 0, r = Object.keys(this.sfnt.refList);
                            e < r.length;
                            e++
                          ) {
                            var n = this.sfnt.refList[r[e]],
                              i = this.header.dataOffset + n.dataOffset + 4,
                              o = new d.DecodeStream(
                                this.stream.buffer.slice(i)
                              ),
                              a = new Bt(o);
                            if (a.postscriptName === t) return a;
                          }
                          return null;
                        },
                      },
                      {
                        key: 'fonts',
                        get: function () {
                          for (
                            var t = [],
                              e = 0,
                              r = Object.keys(this.sfnt.refList);
                            e < r.length;
                            e++
                          ) {
                            var n = this.sfnt.refList[r[e]],
                              i = this.header.dataOffset + n.dataOffset + 4,
                              o = new d.DecodeStream(
                                this.stream.buffer.slice(i)
                              );
                            t.push(new Bt(o));
                          }
                          return t;
                        },
                      },
                    ]),
                    t
                  );
                })();
              I.registerFormat(Bt),
                I.registerFormat(Ot),
                I.registerFormat(Ut),
                (e.localExports = I);
            }).call(this, t('_process'), t('buffer').Buffer);
          },
          {
            _process: 188,
            'babel-runtime/core-js/get-iterator': 24,
            'babel-runtime/core-js/object/assign': 26,
            'babel-runtime/core-js/object/define-properties': 28,
            'babel-runtime/core-js/object/define-property': 29,
            'babel-runtime/core-js/object/freeze': 30,
            'babel-runtime/core-js/object/get-own-property-descriptor': 31,
            'babel-runtime/core-js/object/get-prototype-of': 32,
            'babel-runtime/core-js/object/keys': 33,
            'babel-runtime/helpers/classCallCheck': 37,
            'babel-runtime/helpers/createClass': 38,
            'babel-runtime/helpers/get': 39,
            'babel-runtime/helpers/inherits': 40,
            'babel-runtime/helpers/possibleConstructorReturn': 41,
            'babel-runtime/helpers/slicedToArray': 42,
            'babel-runtime/helpers/toConsumableArray': 43,
            'babel-runtime/helpers/typeof': 44,
            buffer: 60,
            clone: 61,
            restructure: 199,
            'restructure/src/utils': 215,
            'tiny-inflate': 218,
            'unicode-properties': 220,
            'unicode-trie': 221,
          },
        ],
        166: [
          function (t, e, r) {
            (r.read = function (t, e, r, n, i) {
              var o,
                a,
                s = 8 * i - n - 1,
                u = (1 << s) - 1,
                l = u >> 1,
                c = -7,
                h = r ? i - 1 : 0,
                f = r ? -1 : 1,
                d = t[e + h];
              for (
                h += f, o = d & ((1 << -c) - 1), d >>= -c, c += s;
                c > 0;
                o = 256 * o + t[e + h], h += f, c -= 8
              );
              for (
                a = o & ((1 << -c) - 1), o >>= -c, c += n;
                c > 0;
                a = 256 * a + t[e + h], h += f, c -= 8
              );
              if (0 === o) o = 1 - l;
              else {
                if (o === u) return a ? NaN : (1 / 0) * (d ? -1 : 1);
                (a += Math.pow(2, n)), (o -= l);
              }
              return (d ? -1 : 1) * a * Math.pow(2, o - n);
            }),
              (r.write = function (t, e, r, n, i, o) {
                var a,
                  s,
                  u,
                  l = 8 * o - i - 1,
                  c = (1 << l) - 1,
                  h = c >> 1,
                  f = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                  d = n ? 0 : o - 1,
                  p = n ? 1 : -1,
                  g = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0;
                for (
                  e = Math.abs(e),
                    isNaN(e) || e === 1 / 0
                      ? ((s = isNaN(e) ? 1 : 0), (a = c))
                      : ((a = Math.floor(Math.log(e) / Math.LN2)),
                        e * (u = Math.pow(2, -a)) < 1 && (a--, (u *= 2)),
                        (e += a + h >= 1 ? f / u : f * Math.pow(2, 1 - h)) *
                          u >=
                          2 && (a++, (u /= 2)),
                        a + h >= c
                          ? ((s = 0), (a = c))
                          : a + h >= 1
                          ? ((s = (e * u - 1) * Math.pow(2, i)), (a += h))
                          : ((s = e * Math.pow(2, h - 1) * Math.pow(2, i)),
                            (a = 0)));
                  i >= 8;
                  t[r + d] = 255 & s, d += p, s /= 256, i -= 8
                );
                for (
                  a = (a << i) | s, l += i;
                  l > 0;
                  t[r + d] = 255 & a, d += p, a /= 256, l -= 8
                );
                t[r + d - p] |= 128 * g;
              });
          },
          {},
        ],
        167: [
          function (t, e, r) {
            'function' == typeof Object.create
              ? (e.localExports = function (t, e) {
                  (t.super_ = e),
                    (t.prototype = Object.create(e.prototype, {
                      constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0,
                      },
                    }));
                })
              : (e.localExports = function (t, e) {
                  t.super_ = e;
                  var r = function () {};
                  (r.prototype = e.prototype),
                    (t.prototype = new r()),
                    (t.prototype.constructor = t);
                });
          },
          {},
        ],
        168: [
          function (t, e, r) {
            function n(t) {
              return (
                !!t.constructor &&
                'function' == typeof t.constructor.isBuffer &&
                t.constructor.isBuffer(t)
              );
            }
            function i(t) {
              return (
                'function' == typeof t.readFloatLE &&
                'function' == typeof t.slice &&
                n(t.slice(0, 0))
              );
            }
            e.localExports = function (t) {
              return null != t && (n(t) || i(t) || !!t._isBuffer);
            };
          },
          {},
        ],
        169: [
          function (t, e, r) {
            var n = {}.toString;
            e.localExports =
              Array.isArray ||
              function (t) {
                return '[object Array]' == n.call(t);
              };
          },
          {},
        ],
        172: [
          function (t, e, r) {
            (function () {
              (r.OP = 0),
                (r.CL = 1),
                (r.CP = 2),
                (r.QU = 3),
                (r.GL = 4),
                (r.NS = 5),
                (r.EX = 6),
                (r.SY = 7),
                (r.IS = 8),
                (r.PR = 9),
                (r.PO = 10),
                (r.NU = 11),
                (r.AL = 12),
                (r.HL = 13),
                (r.ID = 14),
                (r.IN = 15),
                (r.HY = 16),
                (r.BA = 17),
                (r.BB = 18),
                (r.B2 = 19),
                (r.ZW = 20),
                (r.CM = 21),
                (r.WJ = 22),
                (r.H2 = 23),
                (r.H3 = 24),
                (r.JL = 25),
                (r.JV = 26),
                (r.JT = 27),
                (r.RI = 28),
                (r.AI = 29),
                (r.BK = 30),
                (r.CB = 31),
                (r.CJ = 32),
                (r.CR = 33),
                (r.LF = 34),
                (r.NL = 35),
                (r.SA = 36),
                (r.SG = 37),
                (r.SP = 38),
                (r.XX = 39);
            }).call(this);
          },
          {},
        ],
        173: [
          function (t, e, r) {
            (function () {
              var r,
                n,
                i,
                o,
                a,
                s,
                u,
                l,
                c,
                h,
                f,
                d,
                p,
                g,
                _,
                v,
                m,
                y,
                b,
                w,
                x,
                S,
                C,
                k,
                E;
              b = t('unicode-trie');
              var A = t('buffer').Buffer;
              (S = new b(
                new A(
                  'AA4IAAAAAAAAAf2g3VZ7PNP7//+ebiriUKKwnRJyieRSxrZzoiS3IypilJ3KbW4rWjM7HURuK9cuNKUyHXeOhbGkTKGR+4ZhMWFbjA27fH7U+f31ezx+v/7+Pf95f96Px/N1eb5ez8f78eGOwO8yBn+iRSQBb4PFc2MpJuMfg73V9I5mfUfHsyfPvqE3NeX3M99whH07I8PY752rV77Lhm37Hl/EP15RCFD7IlqUnXJNetcDzz1t1lH5erf1nFusm8HIk78MNHt/t9/oXNN1Ug6x2EX7j23q4dZNxi/uX0rfnON5KW1H7eAlwoLWCqlgu5xFb/evOw/VdP+mBl00ff2zdqrprRT9K/eRt3TOeSKRIY2Xy0E3hgslGZEFP5bVcMHtN1XFIFLhLd0L5U25dZ1IOUT1MLuS8NNt9Uupd1YaxTMN6/mVKxQ89wSHpKKOr3ctHVNU9aC3/db5LS6gEHmt2xYcd3ffyVb1na/ub+k4TNvgiEywsCynDpRebRdoCUdhwGtY4b8tdYJB/cHzlDSX1LLu9oLvlbb5OJm2aMobVS58SPzemYZQXtVjvODKmmCz4/KowrjQU0o45J/7TqojN6i5fytRUtG6xXuuwn7l0KTd5rPHSM89vul1IQmET1Bx9WHspS4l9YsB67pDLzJ7yF++R1FQl+IORcnNucnao6NJSW0nPHbY263hQMLemc29v+4s1WZMF6SAVtXVbVPT/2e1ujcW5WtDczm147q5v3n3cQ2tdfUbFUzfrIv3v22129N/TfugfyL0A/8g2ID05rc1ZpedPOpa1wklnMLht1uRTmP+yXumPC/eUe0fvJiiJTwInIL9IDE7xuP3hLi9MwEFd3b/2+fFJOXW+6/f7Vp3lYphSWXzN2u5/mhGux8lpv1gaZn1/+3VtQ0MFvrogNd3fBuyN+BpgiVk+mkibIu6f7ypbrjpOwW0UcXb7cEhFe8UsVl43R8l7vtBIvwuYfvL8N9ttXaYw+2oeliHUqWooVH8vf3B+LYXccY3p4kBa17b9+8Uflp3ZqvV96WKhAS4HwwnUmVROETH53i2YdN4SsuRpgmNJsmH70fc5Zh3R2NW3ny/ZX6/qbUvJ4eFd0hv8h9LAB7wyJ42bBvdiQulDZtFdUpHOkcujTaOjEUerZh7iCUB2Py6gS8PxdnpdSLOQ2x4el1tRKdFErJsp48ZK7qDMmIhCKN1FCLMwFEdlH4LgTutwwxh5netg0K3EByldbT4mBEjOyhtFgINWof7Wkx4B6XZgoOn5dEQaFiUExDtDKCn0YhXg8Pgcnvle96TMTVwWiWXB/Pd3Cfmc9IO/iOGh5bH4j03Oofx4qLi063sEUEAVsRaMk06/Hb6T1PdqTxImmmLZMNuvV5mxvVzozevuHwb7R5wNKkgqDX56JUgktq1OfOD53eWxk8G443S0xMg3Fgbwrpv1JHxlUlJST4da08SGI+XEXEUSV7hqSlwpvfFO9nnr+7TCClvUxRrBIgXim5EE9PL/VZ20cW4bPt1W20NqX4v6N/GmNb8b7eyd+m+yOMVyfUkrd7HqSj/73i05mrM0z49MQv4ZUjCoU8CWD8DrbPN5csBx7b1O8z43UjXu5FmTTGnNxIxgGzX8oi85J1NleHz89saD/vK2Sgd4pT+IRx3VetQ4GBRXpbtfMdVEVNbzUIXUBYIbGwsuGNpKw3/KcePasjQgLqbPnQxEA8F/uEfn90C3XYo9/RKOlmcR/ZbjFFWvhf8ma73F3oL3mr5IZK5dXuZgNdWnxtejBk9dPPmBCTCRb+lmMtDyNsjlAZ5hP3+9iDaHuU639G8148MPU7j8wyHsydYtkb1p7+MvxLCJlbQghtz0h7w9gPlsK9HfokB6zjnwwkXG/BF9+zhTjeBmctjmFdOtbMnQMs4yHsfgy/8Qt9Zqm4g8B5NRAmbHR+bXUvz6YjCIU5H081IW9mcvOsqvjTr88xj9JPZhoErmSXRzsj5C+1anE9E+1cHmNexd2Dqvh8v+HFIrsCSKvsMbTKc2CCsxATApTiovViOjAkw0muk/gyDvUDhgVXzIKaMzj9NI1gRnkgF4SSwpqF7DsarN0J3NnYw9G8KEx6stZkp9plsPyJjty7poxX/wTfREmwY8Pexel821jKnVbj4MsGvFdCePCATwpHQAZt5JAi4lLtXHNieWSslLBU+Y0/0M1mt83Dnhj8Cga+wKw82DgeJaX2i4oze6Aw2vl8I72dBIwYSxiPm7zPgd9Af1Yx1HKgK4oVT8SKxMVtIqXeBuEhFSyC0lNOdE8hxcEMtGx9Yri66xVGt1lyySi+60vi18cXYq9RIngjTQpydBzfiJ1+zKyNVh+rKJg22xYKyw8TqxL6w54lsNx8tPa5Gc6WySKTpmrYfJP4EoraIrzRIanVKqa+WUGDHlzlSn3Dq8DGmlN6KMYtpDJ+2+aVoAK1CaOSZ1AGj1EiSDMXHM+ohlmHVOjZUJwOCxHaAgeEU4fiTmkPjIj5IgIXHMuHyRmKk3nIsvZgP/tyHl4iUJQtUeanNMI24u0SCAXuH5I7nDMb4Wb8ENudKZY+X6hf636axgqmyjz1PZBxqa1QDY87RF3eAC/fKx8ruRT3eqfeSMMgjc3iCQB1o9DMr2aZyb4PnPWWXq3KgQeDkLp4XY3pYREie8BGkBD/iT1mxthMazPFXVc4nDjCADBD2Ux58IYBKYp8ZpoeAacldLDqmrOGsDCsfQdvE6ula8NOeMZHUgx2pQBlV73ki3xSvUqkZU8pB/UmGAtYDhYyP7TiMXYWC70cz7bJQ3/tV2RvLoYurxxKnIM2TxP39zhBXHLjSJYNvIxSZLONSx/kBTlWyYk7PWOyI1s8ylznzp/3QAYu4TpGrywPBgXylFbbOsJwiLtb84KtRxJvrf0lNOoUpM11NdriwoF5RDVglNzeq0V2oL8/kRt6JoubA9p7nhQ+1wFNWGwF1GV5+IvLpqruPFmjGMbHVM2M+ozZ2IocgtXkvzOzvfDKJXoxDo+CB+ToIuMmA5bnquXYNdhYKC3zQK8POjsb/8QCvigAJOOiOQ2V9sxuyxrOOyA0Zu2YcAUWWlbi3360xeTbk0rtQXC5PtZyV6aISn83+0bkDTGXPTHtCb5M5gMzZySVHEJGDS/27Bd17OSeKMIOOlZ5onNK83OQhBTP5jimzKRFvkGYvXVk0CizIJh6vphkdsbTrbDqJa5et91Ih8UCxobd06mE8U+Bw6mt0BCuRKzUkfr2xA014ujBbsfXyMWFAQ1nIHJphzxSffQY5dBoTkqvt6kZ7530D0J7rwg0WjHFWpdjXdMf3MPyZaw7AR13eaDF3gekRL6aNW3mdSYQdVZHk2RYvimNBj8Wb4UqR05q7R5vg51NXfU54IICAePFFRvATm6wd+BWvsZXKm/oJ/VBh/dVbnOal9Duz8EBhD2Dk/PWqr0aMJZ0AneKesaItZM6JKlk4Y+m8mQH9uMTSTcpxB8aJ4utaForJ+7lWEvTJWpHoPnJAXNuem821usuV0m3daFEXyFEAhERiFd6tmePUx1L6qayDf5Ho/mpcvmKodNXak+g28GQgUrKdfMKD+XnEF7PY84yoRVWVifatiqozZNI/uZGcocSFZextIzxV/SzgpVNKDI91o1NpQpGKoIgC7G5tr5jPJySuErnzwcg5GsrkffSmPIgMNdCnM2PBXfLOkKmNRjFWlch/c/nH3zMU3aRm3Mq2KMAg+QAnr0RqMhe2LN6s74r54P54IavIZvL//edo6Wdpzie61far0siNb8SLru2jnkLIVTecUI5ylOBAcZlnOLY3yEKzReU+p/EU+epG8MDUc8ziLB930sTJOqcTTUe3hLHJcgx+V21mDb7XtJMOXTKl5NvS6JFj3YZ0s5byONtJh5upTYa4MPJRZXFYAxyhTeXFHiHEWifMQl4qZdkSHFak+5erOfrke2e/vK3iZPMHUFaLkgeBRfRtQzzXoq/iOG7koCYeFFaCQRrHUBoMteBNOvnam+j6xHC/m3k0Oqm+eNP0cOSe5ro0btXghAjKnGyb2S1sPifG+upkLUHmKxHw0Q/LH/5mqRbHVvngmcbiJ6vOC7LjDK7WQ6pdJQJ8IkCuzzVGSxVjlG+bg0zphEUWY5r/IQPFnOSvEQVtgiLbFS+xwz0m0Bvx6IXvxz4l0OyytT02gbzThgcKziyRsqLyJxFU2iqxDA7OOyMroSkx134qxqiRa65NSGj/nEveNW/twJJLZvA4dyf3snPyzkTLoOWO9IbkGAn0HBlDZtUxjxEglSMnMTwit2qXFwMT3D1URkeTHS9YwhJ3XsM/l0DIiHRHXpgHvBpRZv4pNUVJzR8rmWzmG0ZQqxFNpIV4cE+Zd43UoOqZAEDXcPWNH2Qv2YQ2HDLptgcxl4pW6ZfFuVwRqmyojsbG//Rf',
                  'base64'
                )
              )),
                (k = t('./classes')),
                (o = k.BK),
                (c = k.CR),
                (d = k.LF),
                (g = k.NL),
                (a = k.CB),
                (i = k.BA),
                (y = k.SP),
                (w = k.WJ),
                (y = k.SP),
                (o = k.BK),
                (d = k.LF),
                (g = k.NL),
                (r = k.AI),
                (n = k.AL),
                (v = k.SA),
                (m = k.SG),
                (x = k.XX),
                (u = k.CJ),
                k.ID,
                (_ = k.NS),
                k.characterClasses,
                (E = t('./pairs')),
                (h = E.DI_BRK),
                (f = E.IN_BRK),
                (s = E.CI_BRK),
                (l = E.CP_BRK),
                E.PR_BRK,
                (C = E.pairTable),
                (p = (function () {
                  function t(t) {
                    (this.string = t),
                      (this.pos = 0),
                      (this.lastPos = 0),
                      (this.curClass = null),
                      (this.nextClass = null);
                  }
                  var e, p, b;
                  return (
                    (t.prototype.nextCodePoint = function () {
                      var t, e;
                      return (
                        (t = this.string.charCodeAt(this.pos++)),
                        (e = this.string.charCodeAt(this.pos)),
                        55296 <= t && t <= 56319 && 56320 <= e && e <= 57343
                          ? (this.pos++,
                            1024 * (t - 55296) + (e - 56320) + 65536)
                          : t
                      );
                    }),
                    (p = function (t) {
                      switch (t) {
                        case r:
                          return n;
                        case v:
                        case m:
                        case x:
                          return n;
                        case u:
                          return _;
                        default:
                          return t;
                      }
                    }),
                    (b = function (t) {
                      switch (t) {
                        case d:
                        case g:
                          return o;
                        case a:
                          return i;
                        case y:
                          return w;
                        default:
                          return t;
                      }
                    }),
                    (t.prototype.nextCharClass = function (t) {
                      return (
                        null == t && (t = !1), p(S.get(this.nextCodePoint()))
                      );
                    }),
                    (e = (function () {
                      return function (t, e) {
                        (this.position = t), (this.required = null != e && e);
                      };
                    })()),
                    (t.prototype.nextBreak = function () {
                      var t, r, n;
                      for (
                        null == this.curClass &&
                        (this.curClass = b(this.nextCharClass()));
                        this.pos < this.string.length;

                      ) {
                        if (
                          ((this.lastPos = this.pos),
                          (r = this.nextClass),
                          (this.nextClass = this.nextCharClass()),
                          this.curClass === o ||
                            (this.curClass === c && this.nextClass !== d))
                        )
                          return (
                            (this.curClass = b(p(this.nextClass))),
                            new e(this.lastPos, !0)
                          );
                        if (
                          null ==
                          (t = function () {
                            switch (this.nextClass) {
                              case y:
                                return this.curClass;
                              case o:
                              case d:
                              case g:
                                return o;
                              case c:
                                return c;
                              case a:
                                return i;
                            }
                          }.call(this))
                        ) {
                          switch (
                            ((n = !1), C[this.curClass][this.nextClass])
                          ) {
                            case h:
                              n = !0;
                              break;
                            case f:
                              n = r === y;
                              break;
                            case s:
                              if (!(n = r === y)) continue;
                              break;
                            case l:
                              if (r !== y) continue;
                          }
                          if (((this.curClass = this.nextClass), n))
                            return new e(this.lastPos);
                        } else if (((this.curClass = t), this.nextClass === a))
                          return new e(this.lastPos);
                      }
                      if (this.pos >= this.string.length)
                        return this.lastPos < this.string.length
                          ? ((this.lastPos = this.string.length),
                            new e(this.string.length))
                          : null;
                    }),
                    t
                  );
                })()),
                (e.localExports = p);
            }).call(this);
          },
          {
            buffer: 60,
            './classes': 172,
            './pairs': 174,
            'unicode-trie': 221,
          },
        ],
        174: [
          function (t, e, r) {
            (function () {
              (r.DI_BRK = 0),
                (r.IN_BRK = 1),
                (r.CI_BRK = 2),
                (r.CP_BRK = 3),
                (r.PR_BRK = 4),
                (r.pairTable = [
                  [
                    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
                    4, 3, 4, 4, 4, 4, 4, 4, 4,
                  ],
                  [
                    0, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    4, 4, 4, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    4, 2, 4, 1, 1, 1, 1, 1, 1,
                  ],
                  [
                    1, 4, 4, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    4, 2, 4, 1, 1, 1, 1, 1, 1,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    1, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0,
                    4, 2, 4, 1, 1, 1, 1, 1, 0,
                  ],
                  [
                    1, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    1, 4, 4, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    1, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    1, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    0, 4, 4, 1, 0, 1, 4, 4, 4, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    0, 4, 4, 1, 0, 1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    1, 4, 4, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    4, 2, 4, 1, 1, 1, 1, 1, 1,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 4,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    4, 0, 0, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    1, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 0,
                  ],
                  [
                    1, 4, 4, 1, 1, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    4, 2, 4, 1, 1, 1, 1, 1, 1,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 1, 1, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 1, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 1, 1, 1, 1, 0, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 1, 1, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 1, 0,
                  ],
                  [
                    0, 4, 4, 1, 1, 1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
                    4, 2, 4, 0, 0, 0, 0, 0, 1,
                  ],
                ]);
            }).call(this);
          },
          {},
        ],
        175: [
          function (t, e, r) {
            var n =
              'undefined' != typeof Uint8Array &&
              'undefined' != typeof Uint16Array &&
              'undefined' != typeof Int32Array;
            (r.assign = function (t) {
              for (
                var e = Array.prototype.slice.call(arguments, 1);
                e.length;

              ) {
                var r = e.shift();
                if (r) {
                  if ('object' != typeof r)
                    throw new TypeError(r + 'must be non-object');
                  for (var n in r) r.hasOwnProperty(n) && (t[n] = r[n]);
                }
              }
              return t;
            }),
              (r.shrinkBuf = function (t, e) {
                return t.length === e
                  ? t
                  : t.subarray
                  ? t.subarray(0, e)
                  : ((t.length = e), t);
              });
            var i = {
                arraySet: function (t, e, r, n, i) {
                  if (e.subarray && t.subarray) t.set(e.subarray(r, r + n), i);
                  else for (var o = 0; o < n; o++) t[i + o] = e[r + o];
                },
                flattenChunks: function (t) {
                  var e, r, n, i, o, a;
                  for (n = 0, e = 0, r = t.length; e < r; e++) n += t[e].length;
                  for (
                    a = new Uint8Array(n), i = 0, e = 0, r = t.length;
                    e < r;
                    e++
                  )
                    (o = t[e]), a.set(o, i), (i += o.length);
                  return a;
                },
              },
              o = {
                arraySet: function (t, e, r, n, i) {
                  for (var o = 0; o < n; o++) t[i + o] = e[r + o];
                },
                flattenChunks: function (t) {
                  return [].concat.apply([], t);
                },
              };
            (r.setTyped = function (t) {
              t
                ? ((r.Buf8 = Uint8Array),
                  (r.Buf16 = Uint16Array),
                  (r.Buf32 = Int32Array),
                  r.assign(r, i))
                : ((r.Buf8 = Array),
                  (r.Buf16 = Array),
                  (r.Buf32 = Array),
                  r.assign(r, o));
            }),
              r.setTyped(n);
          },
          {},
        ],
        176: [
          function (t, e, r) {
            e.localExports = function (t, e, r, n) {
              for (
                var i = (65535 & t) | 0, o = ((t >>> 16) & 65535) | 0, a = 0;
                0 !== r;

              ) {
                r -= a = r > 2e3 ? 2e3 : r;
                do {
                  o = (o + (i = (i + e[n++]) | 0)) | 0;
                } while (--a);
                (i %= 65521), (o %= 65521);
              }
              return i | (o << 16) | 0;
            };
          },
          {},
        ],
        177: [
          function (t, e, r) {
            e.localExports = {
              Z_NO_FLUSH: 0,
              Z_PARTIAL_FLUSH: 1,
              Z_SYNC_FLUSH: 2,
              Z_FULL_FLUSH: 3,
              Z_FINISH: 4,
              Z_BLOCK: 5,
              Z_TREES: 6,
              Z_OK: 0,
              Z_STREAM_END: 1,
              Z_NEED_DICT: 2,
              Z_ERRNO: -1,
              Z_STREAM_ERROR: -2,
              Z_DATA_ERROR: -3,
              Z_BUF_ERROR: -5,
              Z_NO_COMPRESSION: 0,
              Z_BEST_SPEED: 1,
              Z_BEST_COMPRESSION: 9,
              Z_DEFAULT_COMPRESSION: -1,
              Z_FILTERED: 1,
              Z_HUFFMAN_ONLY: 2,
              Z_RLE: 3,
              Z_FIXED: 4,
              Z_DEFAULT_STRATEGY: 0,
              Z_BINARY: 0,
              Z_TEXT: 1,
              Z_UNKNOWN: 2,
              Z_DEFLATED: 8,
            };
          },
          {},
        ],
        178: [
          function (t, e, r) {
            var n = (function () {
              for (var t, e = [], r = 0; r < 256; r++) {
                t = r;
                for (var n = 0; n < 8; n++)
                  t = 1 & t ? 3988292384 ^ (t >>> 1) : t >>> 1;
                e[r] = t;
              }
              return e;
            })();
            e.localExports = function (t, e, r, i) {
              var o = n,
                a = i + r;
              t ^= -1;
              for (var s = i; s < a; s++) t = (t >>> 8) ^ o[255 & (t ^ e[s])];
              return -1 ^ t;
            };
          },
          {},
        ],
        179: [
          function (t, e, r) {
            function n(t, e) {
              return (t.msg = P[e]), e;
            }
            function i(t) {
              return (t << 1) - (t > 4 ? 9 : 0);
            }
            function o(t) {
              for (var e = t.length; --e >= 0; ) t[e] = 0;
            }
            function a(t) {
              var e = t.state,
                r = e.pending;
              r > t.avail_out && (r = t.avail_out),
                0 !== r &&
                  (C.arraySet(
                    t.output,
                    e.pending_buf,
                    e.pending_out,
                    r,
                    t.next_out
                  ),
                  (t.next_out += r),
                  (e.pending_out += r),
                  (t.total_out += r),
                  (t.avail_out -= r),
                  (e.pending -= r),
                  0 === e.pending && (e.pending_out = 0));
            }
            function s(t, e) {
              k._tr_flush_block(
                t,
                t.block_start >= 0 ? t.block_start : -1,
                t.strstart - t.block_start,
                e
              ),
                (t.block_start = t.strstart),
                a(t.strm);
            }
            function u(t, e) {
              t.pending_buf[t.pending++] = e;
            }
            function l(t, e) {
              (t.pending_buf[t.pending++] = (e >>> 8) & 255),
                (t.pending_buf[t.pending++] = 255 & e);
            }
            function c(t, e, r, n) {
              var i = t.avail_in;
              return (
                i > n && (i = n),
                0 === i
                  ? 0
                  : ((t.avail_in -= i),
                    C.arraySet(e, t.input, t.next_in, i, r),
                    1 === t.state.wrap
                      ? (t.adler = E(t.adler, e, i, r))
                      : 2 === t.state.wrap && (t.adler = A(t.adler, e, i, r)),
                    (t.next_in += i),
                    (t.total_in += i),
                    i)
              );
            }
            function h(t, e) {
              var r,
                n,
                i = t.max_chain_length,
                o = t.strstart,
                a = t.prev_length,
                s = t.nice_match,
                u =
                  t.strstart > t.w_size - nt ? t.strstart - (t.w_size - nt) : 0,
                l = t.window,
                c = t.w_mask,
                h = t.prev,
                f = t.strstart + rt,
                d = l[o + a - 1],
                p = l[o + a];
              t.prev_length >= t.good_match && (i >>= 2),
                s > t.lookahead && (s = t.lookahead);
              do {
                if (
                  ((r = e),
                  l[r + a] === p &&
                    l[r + a - 1] === d &&
                    l[r] === l[o] &&
                    l[++r] === l[o + 1])
                ) {
                  (o += 2), r++;
                  do {} while (
                    l[++o] === l[++r] &&
                    l[++o] === l[++r] &&
                    l[++o] === l[++r] &&
                    l[++o] === l[++r] &&
                    l[++o] === l[++r] &&
                    l[++o] === l[++r] &&
                    l[++o] === l[++r] &&
                    l[++o] === l[++r] &&
                    o < f
                  );
                  if (((n = rt - (f - o)), (o = f - rt), n > a)) {
                    if (((t.match_start = e), (a = n), n >= s)) break;
                    (d = l[o + a - 1]), (p = l[o + a]);
                  }
                }
              } while ((e = h[e & c]) > u && 0 != --i);
              return a <= t.lookahead ? a : t.lookahead;
            }
            function f(t) {
              var e,
                r,
                n,
                i,
                o,
                a = t.w_size;
              do {
                if (
                  ((i = t.window_size - t.lookahead - t.strstart),
                  t.strstart >= a + (a - nt))
                ) {
                  C.arraySet(t.window, t.window, a, a, 0),
                    (t.match_start -= a),
                    (t.strstart -= a),
                    (t.block_start -= a),
                    (e = r = t.hash_size);
                  do {
                    (n = t.head[--e]), (t.head[e] = n >= a ? n - a : 0);
                  } while (--r);
                  e = r = a;
                  do {
                    (n = t.prev[--e]), (t.prev[e] = n >= a ? n - a : 0);
                  } while (--r);
                  i += a;
                }
                if (0 === t.strm.avail_in) break;
                if (
                  ((r = c(t.strm, t.window, t.strstart + t.lookahead, i)),
                  (t.lookahead += r),
                  t.lookahead + t.insert >= et)
                )
                  for (
                    o = t.strstart - t.insert,
                      t.ins_h = t.window[o],
                      t.ins_h =
                        ((t.ins_h << t.hash_shift) ^ t.window[o + 1]) &
                        t.hash_mask;
                    t.insert &&
                    ((t.ins_h =
                      ((t.ins_h << t.hash_shift) ^ t.window[o + et - 1]) &
                      t.hash_mask),
                    (t.prev[o & t.w_mask] = t.head[t.ins_h]),
                    (t.head[t.ins_h] = o),
                    o++,
                    t.insert--,
                    !(t.lookahead + t.insert < et));

                  );
              } while (t.lookahead < nt && 0 !== t.strm.avail_in);
            }
            function d(t, e) {
              for (var r, n; ; ) {
                if (t.lookahead < nt) {
                  if ((f(t), t.lookahead < nt && e === j)) return ft;
                  if (0 === t.lookahead) break;
                }
                if (
                  ((r = 0),
                  t.lookahead >= et &&
                    ((t.ins_h =
                      ((t.ins_h << t.hash_shift) ^
                        t.window[t.strstart + et - 1]) &
                      t.hash_mask),
                    (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                    (t.head[t.ins_h] = t.strstart)),
                  0 !== r &&
                    t.strstart - r <= t.w_size - nt &&
                    (t.match_length = h(t, r)),
                  t.match_length >= et)
                )
                  if (
                    ((n = k._tr_tally(
                      t,
                      t.strstart - t.match_start,
                      t.match_length - et
                    )),
                    (t.lookahead -= t.match_length),
                    t.match_length <= t.max_lazy_match && t.lookahead >= et)
                  ) {
                    t.match_length--;
                    do {
                      t.strstart++,
                        (t.ins_h =
                          ((t.ins_h << t.hash_shift) ^
                            t.window[t.strstart + et - 1]) &
                          t.hash_mask),
                        (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                        (t.head[t.ins_h] = t.strstart);
                    } while (0 != --t.match_length);
                    t.strstart++;
                  } else
                    (t.strstart += t.match_length),
                      (t.match_length = 0),
                      (t.ins_h = t.window[t.strstart]),
                      (t.ins_h =
                        ((t.ins_h << t.hash_shift) ^ t.window[t.strstart + 1]) &
                        t.hash_mask);
                else
                  (n = k._tr_tally(t, 0, t.window[t.strstart])),
                    t.lookahead--,
                    t.strstart++;
                if (n && (s(t, !1), 0 === t.strm.avail_out)) return ft;
              }
              return (
                (t.insert = t.strstart < et - 1 ? t.strstart : et - 1),
                e === B
                  ? (s(t, !0), 0 === t.strm.avail_out ? pt : gt)
                  : t.last_lit && (s(t, !1), 0 === t.strm.avail_out)
                  ? ft
                  : dt
              );
            }
            function p(t, e) {
              for (var r, n, i; ; ) {
                if (t.lookahead < nt) {
                  if ((f(t), t.lookahead < nt && e === j)) return ft;
                  if (0 === t.lookahead) break;
                }
                if (
                  ((r = 0),
                  t.lookahead >= et &&
                    ((t.ins_h =
                      ((t.ins_h << t.hash_shift) ^
                        t.window[t.strstart + et - 1]) &
                      t.hash_mask),
                    (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                    (t.head[t.ins_h] = t.strstart)),
                  (t.prev_length = t.match_length),
                  (t.prev_match = t.match_start),
                  (t.match_length = et - 1),
                  0 !== r &&
                    t.prev_length < t.max_lazy_match &&
                    t.strstart - r <= t.w_size - nt &&
                    ((t.match_length = h(t, r)),
                    t.match_length <= 5 &&
                      (t.strategy === z ||
                        (t.match_length === et &&
                          t.strstart - t.match_start > 4096)) &&
                      (t.match_length = et - 1)),
                  t.prev_length >= et && t.match_length <= t.prev_length)
                ) {
                  (i = t.strstart + t.lookahead - et),
                    (n = k._tr_tally(
                      t,
                      t.strstart - 1 - t.prev_match,
                      t.prev_length - et
                    )),
                    (t.lookahead -= t.prev_length - 1),
                    (t.prev_length -= 2);
                  do {
                    ++t.strstart <= i &&
                      ((t.ins_h =
                        ((t.ins_h << t.hash_shift) ^
                          t.window[t.strstart + et - 1]) &
                        t.hash_mask),
                      (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                      (t.head[t.ins_h] = t.strstart));
                  } while (0 != --t.prev_length);
                  if (
                    ((t.match_available = 0),
                    (t.match_length = et - 1),
                    t.strstart++,
                    n && (s(t, !1), 0 === t.strm.avail_out))
                  )
                    return ft;
                } else if (t.match_available) {
                  if (
                    ((n = k._tr_tally(t, 0, t.window[t.strstart - 1])) &&
                      s(t, !1),
                    t.strstart++,
                    t.lookahead--,
                    0 === t.strm.avail_out)
                  )
                    return ft;
                } else (t.match_available = 1), t.strstart++, t.lookahead--;
              }
              return (
                t.match_available &&
                  ((n = k._tr_tally(t, 0, t.window[t.strstart - 1])),
                  (t.match_available = 0)),
                (t.insert = t.strstart < et - 1 ? t.strstart : et - 1),
                e === B
                  ? (s(t, !0), 0 === t.strm.avail_out ? pt : gt)
                  : t.last_lit && (s(t, !1), 0 === t.strm.avail_out)
                  ? ft
                  : dt
              );
            }
            function g(t, e) {
              for (var r, n, i, o, a = t.window; ; ) {
                if (t.lookahead <= rt) {
                  if ((f(t), t.lookahead <= rt && e === j)) return ft;
                  if (0 === t.lookahead) break;
                }
                if (
                  ((t.match_length = 0),
                  t.lookahead >= et &&
                    t.strstart > 0 &&
                    ((i = t.strstart - 1),
                    (n = a[i]) === a[++i] && n === a[++i] && n === a[++i]))
                ) {
                  o = t.strstart + rt;
                  do {} while (
                    n === a[++i] &&
                    n === a[++i] &&
                    n === a[++i] &&
                    n === a[++i] &&
                    n === a[++i] &&
                    n === a[++i] &&
                    n === a[++i] &&
                    n === a[++i] &&
                    i < o
                  );
                  (t.match_length = rt - (o - i)),
                    t.match_length > t.lookahead &&
                      (t.match_length = t.lookahead);
                }
                if (
                  (t.match_length >= et
                    ? ((r = k._tr_tally(t, 1, t.match_length - et)),
                      (t.lookahead -= t.match_length),
                      (t.strstart += t.match_length),
                      (t.match_length = 0))
                    : ((r = k._tr_tally(t, 0, t.window[t.strstart])),
                      t.lookahead--,
                      t.strstart++),
                  r && (s(t, !1), 0 === t.strm.avail_out))
                )
                  return ft;
              }
              return (
                (t.insert = 0),
                e === B
                  ? (s(t, !0), 0 === t.strm.avail_out ? pt : gt)
                  : t.last_lit && (s(t, !1), 0 === t.strm.avail_out)
                  ? ft
                  : dt
              );
            }
            function _(t, e) {
              for (var r; ; ) {
                if (0 === t.lookahead && (f(t), 0 === t.lookahead)) {
                  if (e === j) return ft;
                  break;
                }
                if (
                  ((t.match_length = 0),
                  (r = k._tr_tally(t, 0, t.window[t.strstart])),
                  t.lookahead--,
                  t.strstart++,
                  r && (s(t, !1), 0 === t.strm.avail_out))
                )
                  return ft;
              }
              return (
                (t.insert = 0),
                e === B
                  ? (s(t, !0), 0 === t.strm.avail_out ? pt : gt)
                  : t.last_lit && (s(t, !1), 0 === t.strm.avail_out)
                  ? ft
                  : dt
              );
            }
            function v(t, e, r, n, i) {
              (this.good_length = t),
                (this.max_lazy = e),
                (this.nice_length = r),
                (this.max_chain = n),
                (this.func = i);
            }
            function m(t) {
              (t.window_size = 2 * t.w_size),
                o(t.head),
                (t.max_lazy_match = S[t.level].max_lazy),
                (t.good_match = S[t.level].good_length),
                (t.nice_match = S[t.level].nice_length),
                (t.max_chain_length = S[t.level].max_chain),
                (t.strstart = 0),
                (t.block_start = 0),
                (t.lookahead = 0),
                (t.insert = 0),
                (t.match_length = t.prev_length = et - 1),
                (t.match_available = 0),
                (t.ins_h = 0);
            }
            function y() {
              (this.strm = null),
                (this.status = 0),
                (this.pending_buf = null),
                (this.pending_buf_size = 0),
                (this.pending_out = 0),
                (this.pending = 0),
                (this.wrap = 0),
                (this.gzhead = null),
                (this.gzindex = 0),
                (this.method = W),
                (this.last_flush = -1),
                (this.w_size = 0),
                (this.w_bits = 0),
                (this.w_mask = 0),
                (this.window = null),
                (this.window_size = 0),
                (this.prev = null),
                (this.head = null),
                (this.ins_h = 0),
                (this.hash_size = 0),
                (this.hash_bits = 0),
                (this.hash_mask = 0),
                (this.hash_shift = 0),
                (this.block_start = 0),
                (this.match_length = 0),
                (this.prev_match = 0),
                (this.match_available = 0),
                (this.strstart = 0),
                (this.match_start = 0),
                (this.lookahead = 0),
                (this.prev_length = 0),
                (this.max_chain_length = 0),
                (this.max_lazy_match = 0),
                (this.level = 0),
                (this.strategy = 0),
                (this.good_match = 0),
                (this.nice_match = 0),
                (this.dyn_ltree = new C.Buf16(2 * $)),
                (this.dyn_dtree = new C.Buf16(2 * (2 * J + 1))),
                (this.bl_tree = new C.Buf16(2 * (2 * Q + 1))),
                o(this.dyn_ltree),
                o(this.dyn_dtree),
                o(this.bl_tree),
                (this.l_desc = null),
                (this.d_desc = null),
                (this.bl_desc = null),
                (this.bl_count = new C.Buf16(tt + 1)),
                (this.heap = new C.Buf16(2 * X + 1)),
                o(this.heap),
                (this.heap_len = 0),
                (this.heap_max = 0),
                (this.depth = new C.Buf16(2 * X + 1)),
                o(this.depth),
                (this.l_buf = 0),
                (this.lit_bufsize = 0),
                (this.last_lit = 0),
                (this.d_buf = 0),
                (this.opt_len = 0),
                (this.static_len = 0),
                (this.matches = 0),
                (this.insert = 0),
                (this.bi_buf = 0),
                (this.bi_valid = 0);
            }
            function b(t) {
              var e;
              return t && t.state
                ? ((t.total_in = t.total_out = 0),
                  (t.data_type = Z),
                  (e = t.state),
                  (e.pending = 0),
                  (e.pending_out = 0),
                  e.wrap < 0 && (e.wrap = -e.wrap),
                  (e.status = e.wrap ? ot : ct),
                  (t.adler = 2 === e.wrap ? 0 : 1),
                  (e.last_flush = j),
                  k._tr_init(e),
                  O)
                : n(t, R);
            }
            function w(t) {
              var e = b(t);
              return e === O && m(t.state), e;
            }
            function x(t, e, r, i, o, a) {
              if (!t) return R;
              var s = 1;
              if (
                (e === D && (e = 6),
                i < 0 ? ((s = 0), (i = -i)) : i > 15 && ((s = 2), (i -= 16)),
                o < 1 ||
                  o > Y ||
                  r !== W ||
                  i < 8 ||
                  i > 15 ||
                  e < 0 ||
                  e > 9 ||
                  a < 0 ||
                  a > G)
              )
                return n(t, R);
              8 === i && (i = 9);
              var u = new y();
              return (
                (t.state = u),
                (u.strm = t),
                (u.wrap = s),
                (u.gzhead = null),
                (u.w_bits = i),
                (u.w_size = 1 << u.w_bits),
                (u.w_mask = u.w_size - 1),
                (u.hash_bits = o + 7),
                (u.hash_size = 1 << u.hash_bits),
                (u.hash_mask = u.hash_size - 1),
                (u.hash_shift = ~~((u.hash_bits + et - 1) / et)),
                (u.window = new C.Buf8(2 * u.w_size)),
                (u.head = new C.Buf16(u.hash_size)),
                (u.prev = new C.Buf16(u.w_size)),
                (u.lit_bufsize = 1 << (o + 6)),
                (u.pending_buf_size = 4 * u.lit_bufsize),
                (u.pending_buf = new C.Buf8(u.pending_buf_size)),
                (u.d_buf = 1 * u.lit_bufsize),
                (u.l_buf = 3 * u.lit_bufsize),
                (u.level = e),
                (u.strategy = a),
                (u.method = r),
                w(t)
              );
            }
            var S,
              C = t('../utils/common'),
              k = t('./trees'),
              E = t('./adler32'),
              A = t('./crc32'),
              P = t('./messages'),
              j = 0,
              I = 1,
              T = 3,
              B = 4,
              L = 5,
              O = 0,
              N = 1,
              R = -2,
              M = -3,
              F = -5,
              D = -1,
              z = 1,
              U = 2,
              H = 3,
              G = 4,
              q = 0,
              Z = 2,
              W = 8,
              Y = 9,
              V = 15,
              K = 8,
              X = 286,
              J = 30,
              Q = 19,
              $ = 2 * X + 1,
              tt = 15,
              et = 3,
              rt = 258,
              nt = rt + et + 1,
              it = 32,
              ot = 42,
              at = 69,
              st = 73,
              ut = 91,
              lt = 103,
              ct = 113,
              ht = 666,
              ft = 1,
              dt = 2,
              pt = 3,
              gt = 4,
              _t = 3;
            (S = [
              new v(0, 0, 0, 0, function (t, e) {
                var r = 65535;
                for (
                  r > t.pending_buf_size - 5 && (r = t.pending_buf_size - 5);
                  ;

                ) {
                  if (t.lookahead <= 1) {
                    if ((f(t), 0 === t.lookahead && e === j)) return ft;
                    if (0 === t.lookahead) break;
                  }
                  (t.strstart += t.lookahead), (t.lookahead = 0);
                  var n = t.block_start + r;
                  if (
                    (0 === t.strstart || t.strstart >= n) &&
                    ((t.lookahead = t.strstart - n),
                    (t.strstart = n),
                    s(t, !1),
                    0 === t.strm.avail_out)
                  )
                    return ft;
                  if (
                    t.strstart - t.block_start >= t.w_size - nt &&
                    (s(t, !1), 0 === t.strm.avail_out)
                  )
                    return ft;
                }
                return (
                  (t.insert = 0),
                  e === B
                    ? (s(t, !0), 0 === t.strm.avail_out ? pt : gt)
                    : (t.strstart > t.block_start &&
                        (s(t, !1), t.strm.avail_out),
                      ft)
                );
              }),
              new v(4, 4, 8, 4, d),
              new v(4, 5, 16, 8, d),
              new v(4, 6, 32, 32, d),
              new v(4, 4, 16, 16, p),
              new v(8, 16, 32, 32, p),
              new v(8, 16, 128, 128, p),
              new v(8, 32, 128, 256, p),
              new v(32, 128, 258, 1024, p),
              new v(32, 258, 258, 4096, p),
            ]),
              (r.deflateInit = function (t, e) {
                return x(t, e, W, V, K, q);
              }),
              (r.deflateInit2 = x),
              (r.deflateReset = w),
              (r.deflateResetKeep = b),
              (r.deflateSetHeader = function (t, e) {
                return t && t.state
                  ? 2 !== t.state.wrap
                    ? R
                    : ((t.state.gzhead = e), O)
                  : R;
              }),
              (r.deflate = function (t, e) {
                var r, s, c, h;
                if (!t || !t.state || e > L || e < 0) return t ? n(t, R) : R;
                if (
                  ((s = t.state),
                  !t.output ||
                    (!t.input && 0 !== t.avail_in) ||
                    (s.status === ht && e !== B))
                )
                  return n(t, 0 === t.avail_out ? F : R);
                if (
                  ((s.strm = t),
                  (r = s.last_flush),
                  (s.last_flush = e),
                  s.status === ot)
                )
                  if (2 === s.wrap)
                    (t.adler = 0),
                      u(s, 31),
                      u(s, 139),
                      u(s, 8),
                      s.gzhead
                        ? (u(
                            s,
                            (s.gzhead.text ? 1 : 0) +
                              (s.gzhead.hcrc ? 2 : 0) +
                              (s.gzhead.extra ? 4 : 0) +
                              (s.gzhead.name ? 8 : 0) +
                              (s.gzhead.comment ? 16 : 0)
                          ),
                          u(s, 255 & s.gzhead.time),
                          u(s, (s.gzhead.time >> 8) & 255),
                          u(s, (s.gzhead.time >> 16) & 255),
                          u(s, (s.gzhead.time >> 24) & 255),
                          u(
                            s,
                            9 === s.level
                              ? 2
                              : s.strategy >= U || s.level < 2
                              ? 4
                              : 0
                          ),
                          u(s, 255 & s.gzhead.os),
                          s.gzhead.extra &&
                            s.gzhead.extra.length &&
                            (u(s, 255 & s.gzhead.extra.length),
                            u(s, (s.gzhead.extra.length >> 8) & 255)),
                          s.gzhead.hcrc &&
                            (t.adler = A(t.adler, s.pending_buf, s.pending, 0)),
                          (s.gzindex = 0),
                          (s.status = at))
                        : (u(s, 0),
                          u(s, 0),
                          u(s, 0),
                          u(s, 0),
                          u(s, 0),
                          u(
                            s,
                            9 === s.level
                              ? 2
                              : s.strategy >= U || s.level < 2
                              ? 4
                              : 0
                          ),
                          u(s, _t),
                          (s.status = ct));
                  else {
                    var f = (W + ((s.w_bits - 8) << 4)) << 8;
                    (f |=
                      (s.strategy >= U || s.level < 2
                        ? 0
                        : s.level < 6
                        ? 1
                        : 6 === s.level
                        ? 2
                        : 3) << 6),
                      0 !== s.strstart && (f |= it),
                      (f += 31 - (f % 31)),
                      (s.status = ct),
                      l(s, f),
                      0 !== s.strstart &&
                        (l(s, t.adler >>> 16), l(s, 65535 & t.adler)),
                      (t.adler = 1);
                  }
                if (s.status === at)
                  if (s.gzhead.extra) {
                    for (
                      c = s.pending;
                      s.gzindex < (65535 & s.gzhead.extra.length) &&
                      (s.pending !== s.pending_buf_size ||
                        (s.gzhead.hcrc &&
                          s.pending > c &&
                          (t.adler = A(
                            t.adler,
                            s.pending_buf,
                            s.pending - c,
                            c
                          )),
                        a(t),
                        (c = s.pending),
                        s.pending !== s.pending_buf_size));

                    )
                      u(s, 255 & s.gzhead.extra[s.gzindex]), s.gzindex++;
                    s.gzhead.hcrc &&
                      s.pending > c &&
                      (t.adler = A(t.adler, s.pending_buf, s.pending - c, c)),
                      s.gzindex === s.gzhead.extra.length &&
                        ((s.gzindex = 0), (s.status = st));
                  } else s.status = st;
                if (s.status === st)
                  if (s.gzhead.name) {
                    c = s.pending;
                    do {
                      if (
                        s.pending === s.pending_buf_size &&
                        (s.gzhead.hcrc &&
                          s.pending > c &&
                          (t.adler = A(
                            t.adler,
                            s.pending_buf,
                            s.pending - c,
                            c
                          )),
                        a(t),
                        (c = s.pending),
                        s.pending === s.pending_buf_size)
                      ) {
                        h = 1;
                        break;
                      }
                      (h =
                        s.gzindex < s.gzhead.name.length
                          ? 255 & s.gzhead.name.charCodeAt(s.gzindex++)
                          : 0),
                        u(s, h);
                    } while (0 !== h);
                    s.gzhead.hcrc &&
                      s.pending > c &&
                      (t.adler = A(t.adler, s.pending_buf, s.pending - c, c)),
                      0 === h && ((s.gzindex = 0), (s.status = ut));
                  } else s.status = ut;
                if (s.status === ut)
                  if (s.gzhead.comment) {
                    c = s.pending;
                    do {
                      if (
                        s.pending === s.pending_buf_size &&
                        (s.gzhead.hcrc &&
                          s.pending > c &&
                          (t.adler = A(
                            t.adler,
                            s.pending_buf,
                            s.pending - c,
                            c
                          )),
                        a(t),
                        (c = s.pending),
                        s.pending === s.pending_buf_size)
                      ) {
                        h = 1;
                        break;
                      }
                      (h =
                        s.gzindex < s.gzhead.comment.length
                          ? 255 & s.gzhead.comment.charCodeAt(s.gzindex++)
                          : 0),
                        u(s, h);
                    } while (0 !== h);
                    s.gzhead.hcrc &&
                      s.pending > c &&
                      (t.adler = A(t.adler, s.pending_buf, s.pending - c, c)),
                      0 === h && (s.status = lt);
                  } else s.status = lt;
                if (
                  (s.status === lt &&
                    (s.gzhead.hcrc
                      ? (s.pending + 2 > s.pending_buf_size && a(t),
                        s.pending + 2 <= s.pending_buf_size &&
                          (u(s, 255 & t.adler),
                          u(s, (t.adler >> 8) & 255),
                          (t.adler = 0),
                          (s.status = ct)))
                      : (s.status = ct)),
                  0 !== s.pending)
                ) {
                  if ((a(t), 0 === t.avail_out)) return (s.last_flush = -1), O;
                } else if (0 === t.avail_in && i(e) <= i(r) && e !== B)
                  return n(t, F);
                if (s.status === ht && 0 !== t.avail_in) return n(t, F);
                if (
                  0 !== t.avail_in ||
                  0 !== s.lookahead ||
                  (e !== j && s.status !== ht)
                ) {
                  var d =
                    s.strategy === U
                      ? _(s, e)
                      : s.strategy === H
                      ? g(s, e)
                      : S[s.level].func(s, e);
                  if (
                    ((d !== pt && d !== gt) || (s.status = ht),
                    d === ft || d === pt)
                  )
                    return 0 === t.avail_out && (s.last_flush = -1), O;
                  if (
                    d === dt &&
                    (e === I
                      ? k._tr_align(s)
                      : e !== L &&
                        (k._tr_stored_block(s, 0, 0, !1),
                        e === T &&
                          (o(s.head),
                          0 === s.lookahead &&
                            ((s.strstart = 0),
                            (s.block_start = 0),
                            (s.insert = 0)))),
                    a(t),
                    0 === t.avail_out)
                  )
                    return (s.last_flush = -1), O;
                }
                return e !== B
                  ? O
                  : s.wrap <= 0
                  ? N
                  : (2 === s.wrap
                      ? (u(s, 255 & t.adler),
                        u(s, (t.adler >> 8) & 255),
                        u(s, (t.adler >> 16) & 255),
                        u(s, (t.adler >> 24) & 255),
                        u(s, 255 & t.total_in),
                        u(s, (t.total_in >> 8) & 255),
                        u(s, (t.total_in >> 16) & 255),
                        u(s, (t.total_in >> 24) & 255))
                      : (l(s, t.adler >>> 16), l(s, 65535 & t.adler)),
                    a(t),
                    s.wrap > 0 && (s.wrap = -s.wrap),
                    0 !== s.pending ? O : N);
              }),
              (r.deflateEnd = function (t) {
                var e;
                return t && t.state
                  ? (e = t.state.status) !== ot &&
                    e !== at &&
                    e !== st &&
                    e !== ut &&
                    e !== lt &&
                    e !== ct &&
                    e !== ht
                    ? n(t, R)
                    : ((t.state = null), e === ct ? n(t, M) : O)
                  : R;
              }),
              (r.deflateSetDictionary = function (t, e) {
                var r,
                  n,
                  i,
                  a,
                  s,
                  u,
                  l,
                  c,
                  h = e.length;
                if (!t || !t.state) return R;
                if (
                  ((r = t.state),
                  2 === (a = r.wrap) ||
                    (1 === a && r.status !== ot) ||
                    r.lookahead)
                )
                  return R;
                for (
                  1 === a && (t.adler = E(t.adler, e, h, 0)),
                    r.wrap = 0,
                    h >= r.w_size &&
                      (0 === a &&
                        (o(r.head),
                        (r.strstart = 0),
                        (r.block_start = 0),
                        (r.insert = 0)),
                      (c = new C.Buf8(r.w_size)),
                      C.arraySet(c, e, h - r.w_size, r.w_size, 0),
                      (e = c),
                      (h = r.w_size)),
                    s = t.avail_in,
                    u = t.next_in,
                    l = t.input,
                    t.avail_in = h,
                    t.next_in = 0,
                    t.input = e,
                    f(r);
                  r.lookahead >= et;

                ) {
                  (n = r.strstart), (i = r.lookahead - (et - 1));
                  do {
                    (r.ins_h =
                      ((r.ins_h << r.hash_shift) ^ r.window[n + et - 1]) &
                      r.hash_mask),
                      (r.prev[n & r.w_mask] = r.head[r.ins_h]),
                      (r.head[r.ins_h] = n),
                      n++;
                  } while (--i);
                  (r.strstart = n), (r.lookahead = et - 1), f(r);
                }
                return (
                  (r.strstart += r.lookahead),
                  (r.block_start = r.strstart),
                  (r.insert = r.lookahead),
                  (r.lookahead = 0),
                  (r.match_length = r.prev_length = et - 1),
                  (r.match_available = 0),
                  (t.next_in = u),
                  (t.input = l),
                  (t.avail_in = s),
                  (r.wrap = a),
                  O
                );
              }),
              (r.deflateInfo = 'pako deflate (from Nodeca project)');
          },
          {
            '../utils/common': 175,
            './adler32': 176,
            './crc32': 178,
            './messages': 183,
            './trees': 184,
          },
        ],
        180: [
          function (t, e, r) {
            e.localExports = function (t, e) {
              var r,
                n,
                i,
                o,
                a,
                s,
                u,
                l,
                c,
                h,
                f,
                d,
                p,
                g,
                _,
                v,
                m,
                y,
                b,
                w,
                x,
                S,
                C,
                k,
                E;
              (r = t.state),
                (n = t.next_in),
                (k = t.input),
                (i = n + (t.avail_in - 5)),
                (o = t.next_out),
                (E = t.output),
                (a = o - (e - t.avail_out)),
                (s = o + (t.avail_out - 257)),
                (u = r.dmax),
                (l = r.wsize),
                (c = r.whave),
                (h = r.wnext),
                (f = r.window),
                (d = r.hold),
                (p = r.bits),
                (g = r.lencode),
                (_ = r.distcode),
                (v = (1 << r.lenbits) - 1),
                (m = (1 << r.distbits) - 1);
              t: do {
                p < 15 &&
                  ((d += k[n++] << p), (p += 8), (d += k[n++] << p), (p += 8)),
                  (y = g[d & v]);
                e: for (;;) {
                  if (
                    ((b = y >>> 24),
                    (d >>>= b),
                    (p -= b),
                    0 === (b = (y >>> 16) & 255))
                  )
                    E[o++] = 65535 & y;
                  else {
                    if (!(16 & b)) {
                      if (0 == (64 & b)) {
                        y = g[(65535 & y) + (d & ((1 << b) - 1))];
                        continue e;
                      }
                      if (32 & b) {
                        r.mode = 12;
                        break t;
                      }
                      (t.msg = 'invalid literal/length code'), (r.mode = 30);
                      break t;
                    }
                    (w = 65535 & y),
                      (b &= 15) &&
                        (p < b && ((d += k[n++] << p), (p += 8)),
                        (w += d & ((1 << b) - 1)),
                        (d >>>= b),
                        (p -= b)),
                      p < 15 &&
                        ((d += k[n++] << p),
                        (p += 8),
                        (d += k[n++] << p),
                        (p += 8)),
                      (y = _[d & m]);
                    r: for (;;) {
                      if (
                        ((b = y >>> 24),
                        (d >>>= b),
                        (p -= b),
                        !(16 & (b = (y >>> 16) & 255)))
                      ) {
                        if (0 == (64 & b)) {
                          y = _[(65535 & y) + (d & ((1 << b) - 1))];
                          continue r;
                        }
                        (t.msg = 'invalid distance code'), (r.mode = 30);
                        break t;
                      }
                      if (
                        ((x = 65535 & y),
                        (b &= 15),
                        p < b &&
                          ((d += k[n++] << p),
                          (p += 8) < b && ((d += k[n++] << p), (p += 8))),
                        (x += d & ((1 << b) - 1)) > u)
                      ) {
                        (t.msg = 'invalid distance too far back'),
                          (r.mode = 30);
                        break t;
                      }
                      if (((d >>>= b), (p -= b), (b = o - a), x > b)) {
                        if ((b = x - b) > c && r.sane) {
                          (t.msg = 'invalid distance too far back'),
                            (r.mode = 30);
                          break t;
                        }
                        if (((S = 0), (C = f), 0 === h)) {
                          if (((S += l - b), b < w)) {
                            w -= b;
                            do {
                              E[o++] = f[S++];
                            } while (--b);
                            (S = o - x), (C = E);
                          }
                        } else if (h < b) {
                          if (((S += l + h - b), (b -= h) < w)) {
                            w -= b;
                            do {
                              E[o++] = f[S++];
                            } while (--b);
                            if (((S = 0), h < w)) {
                              w -= b = h;
                              do {
                                E[o++] = f[S++];
                              } while (--b);
                              (S = o - x), (C = E);
                            }
                          }
                        } else if (((S += h - b), b < w)) {
                          w -= b;
                          do {
                            E[o++] = f[S++];
                          } while (--b);
                          (S = o - x), (C = E);
                        }
                        for (; w > 2; )
                          (E[o++] = C[S++]),
                            (E[o++] = C[S++]),
                            (E[o++] = C[S++]),
                            (w -= 3);
                        w && ((E[o++] = C[S++]), w > 1 && (E[o++] = C[S++]));
                      } else {
                        S = o - x;
                        do {
                          (E[o++] = E[S++]),
                            (E[o++] = E[S++]),
                            (E[o++] = E[S++]),
                            (w -= 3);
                        } while (w > 2);
                        w && ((E[o++] = E[S++]), w > 1 && (E[o++] = E[S++]));
                      }
                      break;
                    }
                  }
                  break;
                }
              } while (n < i && o < s);
              (n -= w = p >> 3),
                (d &= (1 << (p -= w << 3)) - 1),
                (t.next_in = n),
                (t.next_out = o),
                (t.avail_in = n < i ? i - n + 5 : 5 - (n - i)),
                (t.avail_out = o < s ? s - o + 257 : 257 - (o - s)),
                (r.hold = d),
                (r.bits = p);
            };
          },
          {},
        ],
        181: [
          function (t, e, r) {
            function n(t) {
              return (
                ((t >>> 24) & 255) +
                ((t >>> 8) & 65280) +
                ((65280 & t) << 8) +
                ((255 & t) << 24)
              );
            }
            function i() {
              (this.mode = 0),
                (this.last = !1),
                (this.wrap = 0),
                (this.havedict = !1),
                (this.flags = 0),
                (this.dmax = 0),
                (this.check = 0),
                (this.total = 0),
                (this.head = null),
                (this.wbits = 0),
                (this.wsize = 0),
                (this.whave = 0),
                (this.wnext = 0),
                (this.window = null),
                (this.hold = 0),
                (this.bits = 0),
                (this.length = 0),
                (this.offset = 0),
                (this.extra = 0),
                (this.lencode = null),
                (this.distcode = null),
                (this.lenbits = 0),
                (this.distbits = 0),
                (this.ncode = 0),
                (this.nlen = 0),
                (this.ndist = 0),
                (this.have = 0),
                (this.next = null),
                (this.lens = new d.Buf16(320)),
                (this.work = new d.Buf16(288)),
                (this.lendyn = null),
                (this.distdyn = null),
                (this.sane = 0),
                (this.back = 0),
                (this.was = 0);
            }
            function o(t) {
              var e;
              return t && t.state
                ? ((e = t.state),
                  (t.total_in = t.total_out = e.total = 0),
                  (t.msg = ''),
                  e.wrap && (t.adler = 1 & e.wrap),
                  (e.mode = B),
                  (e.last = 0),
                  (e.havedict = 0),
                  (e.dmax = 32768),
                  (e.head = null),
                  (e.hold = 0),
                  (e.bits = 0),
                  (e.lencode = e.lendyn = new d.Buf32(ct)),
                  (e.distcode = e.distdyn = new d.Buf32(ht)),
                  (e.sane = 1),
                  (e.back = -1),
                  C)
                : A;
            }
            function a(t) {
              var e;
              return t && t.state
                ? ((e = t.state),
                  (e.wsize = 0),
                  (e.whave = 0),
                  (e.wnext = 0),
                  o(t))
                : A;
            }
            function s(t, e) {
              var r, n;
              return t && t.state
                ? ((n = t.state),
                  e < 0
                    ? ((r = 0), (e = -e))
                    : ((r = 1 + (e >> 4)), e < 48 && (e &= 15)),
                  e && (e < 8 || e > 15)
                    ? A
                    : (null !== n.window && n.wbits !== e && (n.window = null),
                      (n.wrap = r),
                      (n.wbits = e),
                      a(t)))
                : A;
            }
            function u(t, e) {
              var r, n;
              return t
                ? ((n = new i()),
                  (t.state = n),
                  (n.window = null),
                  (r = s(t, e)) !== C && (t.state = null),
                  r)
                : A;
            }
            function l(t) {
              if (dt) {
                var e;
                for (
                  h = new d.Buf32(512), f = new d.Buf32(32), e = 0;
                  e < 144;

                )
                  t.lens[e++] = 8;
                for (; e < 256; ) t.lens[e++] = 9;
                for (; e < 280; ) t.lens[e++] = 7;
                for (; e < 288; ) t.lens[e++] = 8;
                for (
                  v(y, t.lens, 0, 288, h, 0, t.work, {
                    bits: 9,
                  }),
                    e = 0;
                  e < 32;

                )
                  t.lens[e++] = 5;
                v(b, t.lens, 0, 32, f, 0, t.work, { bits: 5 }), (dt = !1);
              }
              (t.lencode = h),
                (t.lenbits = 9),
                (t.distcode = f),
                (t.distbits = 5);
            }
            function c(t, e, r, n) {
              var i,
                o = t.state;
              return (
                null === o.window &&
                  ((o.wsize = 1 << o.wbits),
                  (o.wnext = 0),
                  (o.whave = 0),
                  (o.window = new d.Buf8(o.wsize))),
                n >= o.wsize
                  ? (d.arraySet(o.window, e, r - o.wsize, o.wsize, 0),
                    (o.wnext = 0),
                    (o.whave = o.wsize))
                  : ((i = o.wsize - o.wnext) > n && (i = n),
                    d.arraySet(o.window, e, r - n, i, o.wnext),
                    (n -= i)
                      ? (d.arraySet(o.window, e, r - n, n, 0),
                        (o.wnext = n),
                        (o.whave = o.wsize))
                      : ((o.wnext += i),
                        o.wnext === o.wsize && (o.wnext = 0),
                        o.whave < o.wsize && (o.whave += i))),
                0
              );
            }
            var h,
              f,
              d = t('../utils/common'),
              p = t('./adler32'),
              g = t('./crc32'),
              _ = t('./inffast'),
              v = t('./inftrees'),
              m = 0,
              y = 1,
              b = 2,
              w = 4,
              x = 5,
              S = 6,
              C = 0,
              k = 1,
              E = 2,
              A = -2,
              P = -3,
              j = -4,
              I = -5,
              T = 8,
              B = 1,
              L = 2,
              O = 3,
              N = 4,
              R = 5,
              M = 6,
              F = 7,
              D = 8,
              z = 9,
              U = 10,
              H = 11,
              G = 12,
              q = 13,
              Z = 14,
              W = 15,
              Y = 16,
              V = 17,
              K = 18,
              X = 19,
              J = 20,
              Q = 21,
              $ = 22,
              tt = 23,
              et = 24,
              rt = 25,
              nt = 26,
              it = 27,
              ot = 28,
              at = 29,
              st = 30,
              ut = 31,
              lt = 32,
              ct = 852,
              ht = 592,
              ft = 15,
              dt = !0;
            (r.inflateReset = a),
              (r.inflateReset2 = s),
              (r.inflateResetKeep = o),
              (r.inflateInit = function (t) {
                return u(t, ft);
              }),
              (r.inflateInit2 = u),
              (r.inflate = function (t, e) {
                var r,
                  i,
                  o,
                  a,
                  s,
                  u,
                  h,
                  f,
                  ct,
                  ht,
                  ft,
                  dt,
                  pt,
                  gt,
                  _t,
                  vt,
                  mt,
                  yt,
                  bt,
                  wt,
                  xt,
                  St,
                  Ct,
                  kt,
                  Et = 0,
                  At = new d.Buf8(4),
                  Pt = [
                    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14,
                    1, 15,
                  ];
                if (
                  !t ||
                  !t.state ||
                  !t.output ||
                  (!t.input && 0 !== t.avail_in)
                )
                  return A;
                (r = t.state).mode === G && (r.mode = q),
                  (s = t.next_out),
                  (o = t.output),
                  (h = t.avail_out),
                  (a = t.next_in),
                  (i = t.input),
                  (u = t.avail_in),
                  (f = r.hold),
                  (ct = r.bits),
                  (ht = u),
                  (ft = h),
                  (St = C);
                t: for (;;)
                  switch (r.mode) {
                    case B:
                      if (0 === r.wrap) {
                        r.mode = q;
                        break;
                      }
                      for (; ct < 16; ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      if (2 & r.wrap && 35615 === f) {
                        (r.check = 0),
                          (At[0] = 255 & f),
                          (At[1] = (f >>> 8) & 255),
                          (r.check = g(r.check, At, 2, 0)),
                          (f = 0),
                          (ct = 0),
                          (r.mode = L);
                        break;
                      }
                      if (
                        ((r.flags = 0),
                        r.head && (r.head.done = !1),
                        !(1 & r.wrap) || (((255 & f) << 8) + (f >> 8)) % 31)
                      ) {
                        (t.msg = 'incorrect header check'), (r.mode = st);
                        break;
                      }
                      if ((15 & f) !== T) {
                        (t.msg = 'unknown compression method'), (r.mode = st);
                        break;
                      }
                      if (
                        ((f >>>= 4),
                        (ct -= 4),
                        (xt = 8 + (15 & f)),
                        0 === r.wbits)
                      )
                        r.wbits = xt;
                      else if (xt > r.wbits) {
                        (t.msg = 'invalid window size'), (r.mode = st);
                        break;
                      }
                      (r.dmax = 1 << xt),
                        (t.adler = r.check = 1),
                        (r.mode = 512 & f ? U : G),
                        (f = 0),
                        (ct = 0);
                      break;
                    case L:
                      for (; ct < 16; ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      if (((r.flags = f), (255 & r.flags) !== T)) {
                        (t.msg = 'unknown compression method'), (r.mode = st);
                        break;
                      }
                      if (57344 & r.flags) {
                        (t.msg = 'unknown header flags set'), (r.mode = st);
                        break;
                      }
                      r.head && (r.head.text = (f >> 8) & 1),
                        512 & r.flags &&
                          ((At[0] = 255 & f),
                          (At[1] = (f >>> 8) & 255),
                          (r.check = g(r.check, At, 2, 0))),
                        (f = 0),
                        (ct = 0),
                        (r.mode = O);
                    case O:
                      for (; ct < 32; ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      r.head && (r.head.time = f),
                        512 & r.flags &&
                          ((At[0] = 255 & f),
                          (At[1] = (f >>> 8) & 255),
                          (At[2] = (f >>> 16) & 255),
                          (At[3] = (f >>> 24) & 255),
                          (r.check = g(r.check, At, 4, 0))),
                        (f = 0),
                        (ct = 0),
                        (r.mode = N);
                    case N:
                      for (; ct < 16; ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      r.head &&
                        ((r.head.xflags = 255 & f), (r.head.os = f >> 8)),
                        512 & r.flags &&
                          ((At[0] = 255 & f),
                          (At[1] = (f >>> 8) & 255),
                          (r.check = g(r.check, At, 2, 0))),
                        (f = 0),
                        (ct = 0),
                        (r.mode = R);
                    case R:
                      if (1024 & r.flags) {
                        for (; ct < 16; ) {
                          if (0 === u) break t;
                          u--, (f += i[a++] << ct), (ct += 8);
                        }
                        (r.length = f),
                          r.head && (r.head.extra_len = f),
                          512 & r.flags &&
                            ((At[0] = 255 & f),
                            (At[1] = (f >>> 8) & 255),
                            (r.check = g(r.check, At, 2, 0))),
                          (f = 0),
                          (ct = 0);
                      } else r.head && (r.head.extra = null);
                      r.mode = M;
                    case M:
                      if (
                        1024 & r.flags &&
                        ((dt = r.length) > u && (dt = u),
                        dt &&
                          (r.head &&
                            ((xt = r.head.extra_len - r.length),
                            r.head.extra ||
                              (r.head.extra = new Array(r.head.extra_len)),
                            d.arraySet(r.head.extra, i, a, dt, xt)),
                          512 & r.flags && (r.check = g(r.check, i, dt, a)),
                          (u -= dt),
                          (a += dt),
                          (r.length -= dt)),
                        r.length)
                      )
                        break t;
                      (r.length = 0), (r.mode = F);
                    case F:
                      if (2048 & r.flags) {
                        if (0 === u) break t;
                        dt = 0;
                        do {
                          (xt = i[a + dt++]),
                            r.head &&
                              xt &&
                              r.length < 65536 &&
                              (r.head.name += String.fromCharCode(xt));
                        } while (xt && dt < u);
                        if (
                          (512 & r.flags && (r.check = g(r.check, i, dt, a)),
                          (u -= dt),
                          (a += dt),
                          xt)
                        )
                          break t;
                      } else r.head && (r.head.name = null);
                      (r.length = 0), (r.mode = D);
                    case D:
                      if (4096 & r.flags) {
                        if (0 === u) break t;
                        dt = 0;
                        do {
                          (xt = i[a + dt++]),
                            r.head &&
                              xt &&
                              r.length < 65536 &&
                              (r.head.comment += String.fromCharCode(xt));
                        } while (xt && dt < u);
                        if (
                          (512 & r.flags && (r.check = g(r.check, i, dt, a)),
                          (u -= dt),
                          (a += dt),
                          xt)
                        )
                          break t;
                      } else r.head && (r.head.comment = null);
                      r.mode = z;
                    case z:
                      if (512 & r.flags) {
                        for (; ct < 16; ) {
                          if (0 === u) break t;
                          u--, (f += i[a++] << ct), (ct += 8);
                        }
                        if (f !== (65535 & r.check)) {
                          (t.msg = 'header crc mismatch'), (r.mode = st);
                          break;
                        }
                        (f = 0), (ct = 0);
                      }
                      r.head &&
                        ((r.head.hcrc = (r.flags >> 9) & 1),
                        (r.head.done = !0)),
                        (t.adler = r.check = 0),
                        (r.mode = G);
                      break;
                    case U:
                      for (; ct < 32; ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      (t.adler = r.check = n(f)),
                        (f = 0),
                        (ct = 0),
                        (r.mode = H);
                    case H:
                      if (0 === r.havedict)
                        return (
                          (t.next_out = s),
                          (t.avail_out = h),
                          (t.next_in = a),
                          (t.avail_in = u),
                          (r.hold = f),
                          (r.bits = ct),
                          E
                        );
                      (t.adler = r.check = 1), (r.mode = G);
                    case G:
                      if (e === x || e === S) break t;
                    case q:
                      if (r.last) {
                        (f >>>= 7 & ct), (ct -= 7 & ct), (r.mode = it);
                        break;
                      }
                      for (; ct < 3; ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      switch (
                        ((r.last = 1 & f), (f >>>= 1), (ct -= 1), 3 & f)
                      ) {
                        case 0:
                          r.mode = Z;
                          break;
                        case 1:
                          if ((l(r), (r.mode = J), e === S)) {
                            (f >>>= 2), (ct -= 2);
                            break t;
                          }
                          break;
                        case 2:
                          r.mode = V;
                          break;
                        case 3:
                          (t.msg = 'invalid block type'), (r.mode = st);
                      }
                      (f >>>= 2), (ct -= 2);
                      break;
                    case Z:
                      for (f >>>= 7 & ct, ct -= 7 & ct; ct < 32; ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      if ((65535 & f) != ((f >>> 16) ^ 65535)) {
                        (t.msg = 'invalid stored block lengths'), (r.mode = st);
                        break;
                      }
                      if (
                        ((r.length = 65535 & f),
                        (f = 0),
                        (ct = 0),
                        (r.mode = W),
                        e === S)
                      )
                        break t;
                    case W:
                      r.mode = Y;
                    case Y:
                      if ((dt = r.length)) {
                        if ((dt > u && (dt = u), dt > h && (dt = h), 0 === dt))
                          break t;
                        d.arraySet(o, i, a, dt, s),
                          (u -= dt),
                          (a += dt),
                          (h -= dt),
                          (s += dt),
                          (r.length -= dt);
                        break;
                      }
                      r.mode = G;
                      break;
                    case V:
                      for (; ct < 14; ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      if (
                        ((r.nlen = 257 + (31 & f)),
                        (f >>>= 5),
                        (ct -= 5),
                        (r.ndist = 1 + (31 & f)),
                        (f >>>= 5),
                        (ct -= 5),
                        (r.ncode = 4 + (15 & f)),
                        (f >>>= 4),
                        (ct -= 4),
                        r.nlen > 286 || r.ndist > 30)
                      ) {
                        (t.msg = 'too many length or distance symbols'),
                          (r.mode = st);
                        break;
                      }
                      (r.have = 0), (r.mode = K);
                    case K:
                      for (; r.have < r.ncode; ) {
                        for (; ct < 3; ) {
                          if (0 === u) break t;
                          u--, (f += i[a++] << ct), (ct += 8);
                        }
                        (r.lens[Pt[r.have++]] = 7 & f), (f >>>= 3), (ct -= 3);
                      }
                      for (; r.have < 19; ) r.lens[Pt[r.have++]] = 0;
                      if (
                        ((r.lencode = r.lendyn),
                        (r.lenbits = 7),
                        (Ct = { bits: r.lenbits }),
                        (St = v(m, r.lens, 0, 19, r.lencode, 0, r.work, Ct)),
                        (r.lenbits = Ct.bits),
                        St)
                      ) {
                        (t.msg = 'invalid code lengths set'), (r.mode = st);
                        break;
                      }
                      (r.have = 0), (r.mode = X);
                    case X:
                      for (; r.have < r.nlen + r.ndist; ) {
                        for (
                          ;
                          (Et = r.lencode[f & ((1 << r.lenbits) - 1)]),
                            (_t = Et >>> 24),
                            (vt = (Et >>> 16) & 255),
                            (mt = 65535 & Et),
                            !(_t <= ct);

                        ) {
                          if (0 === u) break t;
                          u--, (f += i[a++] << ct), (ct += 8);
                        }
                        if (mt < 16)
                          (f >>>= _t), (ct -= _t), (r.lens[r.have++] = mt);
                        else {
                          if (16 === mt) {
                            for (kt = _t + 2; ct < kt; ) {
                              if (0 === u) break t;
                              u--, (f += i[a++] << ct), (ct += 8);
                            }
                            if (((f >>>= _t), (ct -= _t), 0 === r.have)) {
                              (t.msg = 'invalid bit length repeat'),
                                (r.mode = st);
                              break;
                            }
                            (xt = r.lens[r.have - 1]),
                              (dt = 3 + (3 & f)),
                              (f >>>= 2),
                              (ct -= 2);
                          } else if (17 === mt) {
                            for (kt = _t + 3; ct < kt; ) {
                              if (0 === u) break t;
                              u--, (f += i[a++] << ct), (ct += 8);
                            }
                            (ct -= _t),
                              (xt = 0),
                              (dt = 3 + (7 & (f >>>= _t))),
                              (f >>>= 3),
                              (ct -= 3);
                          } else {
                            for (kt = _t + 7; ct < kt; ) {
                              if (0 === u) break t;
                              u--, (f += i[a++] << ct), (ct += 8);
                            }
                            (ct -= _t),
                              (xt = 0),
                              (dt = 11 + (127 & (f >>>= _t))),
                              (f >>>= 7),
                              (ct -= 7);
                          }
                          if (r.have + dt > r.nlen + r.ndist) {
                            (t.msg = 'invalid bit length repeat'),
                              (r.mode = st);
                            break;
                          }
                          for (; dt--; ) r.lens[r.have++] = xt;
                        }
                      }
                      if (r.mode === st) break;
                      if (0 === r.lens[256]) {
                        (t.msg = 'invalid code -- missing end-of-block'),
                          (r.mode = st);
                        break;
                      }
                      if (
                        ((r.lenbits = 9),
                        (Ct = { bits: r.lenbits }),
                        (St = v(
                          y,
                          r.lens,
                          0,
                          r.nlen,
                          r.lencode,
                          0,
                          r.work,
                          Ct
                        )),
                        (r.lenbits = Ct.bits),
                        St)
                      ) {
                        (t.msg = 'invalid literal/lengths set'), (r.mode = st);
                        break;
                      }
                      if (
                        ((r.distbits = 6),
                        (r.distcode = r.distdyn),
                        (Ct = { bits: r.distbits }),
                        (St = v(
                          b,
                          r.lens,
                          r.nlen,
                          r.ndist,
                          r.distcode,
                          0,
                          r.work,
                          Ct
                        )),
                        (r.distbits = Ct.bits),
                        St)
                      ) {
                        (t.msg = 'invalid distances set'), (r.mode = st);
                        break;
                      }
                      if (((r.mode = J), e === S)) break t;
                    case J:
                      r.mode = Q;
                    case Q:
                      if (u >= 6 && h >= 258) {
                        (t.next_out = s),
                          (t.avail_out = h),
                          (t.next_in = a),
                          (t.avail_in = u),
                          (r.hold = f),
                          (r.bits = ct),
                          _(t, ft),
                          (s = t.next_out),
                          (o = t.output),
                          (h = t.avail_out),
                          (a = t.next_in),
                          (i = t.input),
                          (u = t.avail_in),
                          (f = r.hold),
                          (ct = r.bits),
                          r.mode === G && (r.back = -1);
                        break;
                      }
                      for (
                        r.back = 0;
                        (Et = r.lencode[f & ((1 << r.lenbits) - 1)]),
                          (_t = Et >>> 24),
                          (vt = (Et >>> 16) & 255),
                          (mt = 65535 & Et),
                          !(_t <= ct);

                      ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      if (vt && 0 == (240 & vt)) {
                        for (
                          yt = _t, bt = vt, wt = mt;
                          (Et =
                            r.lencode[
                              wt + ((f & ((1 << (yt + bt)) - 1)) >> yt)
                            ]),
                            (_t = Et >>> 24),
                            (vt = (Et >>> 16) & 255),
                            (mt = 65535 & Et),
                            !(yt + _t <= ct);

                        ) {
                          if (0 === u) break t;
                          u--, (f += i[a++] << ct), (ct += 8);
                        }
                        (f >>>= yt), (ct -= yt), (r.back += yt);
                      }
                      if (
                        ((f >>>= _t),
                        (ct -= _t),
                        (r.back += _t),
                        (r.length = mt),
                        0 === vt)
                      ) {
                        r.mode = nt;
                        break;
                      }
                      if (32 & vt) {
                        (r.back = -1), (r.mode = G);
                        break;
                      }
                      if (64 & vt) {
                        (t.msg = 'invalid literal/length code'), (r.mode = st);
                        break;
                      }
                      (r.extra = 15 & vt), (r.mode = $);
                    case $:
                      if (r.extra) {
                        for (kt = r.extra; ct < kt; ) {
                          if (0 === u) break t;
                          u--, (f += i[a++] << ct), (ct += 8);
                        }
                        (r.length += f & ((1 << r.extra) - 1)),
                          (f >>>= r.extra),
                          (ct -= r.extra),
                          (r.back += r.extra);
                      }
                      (r.was = r.length), (r.mode = tt);
                    case tt:
                      for (
                        ;
                        (Et = r.distcode[f & ((1 << r.distbits) - 1)]),
                          (_t = Et >>> 24),
                          (vt = (Et >>> 16) & 255),
                          (mt = 65535 & Et),
                          !(_t <= ct);

                      ) {
                        if (0 === u) break t;
                        u--, (f += i[a++] << ct), (ct += 8);
                      }
                      if (0 == (240 & vt)) {
                        for (
                          yt = _t, bt = vt, wt = mt;
                          (Et =
                            r.distcode[
                              wt + ((f & ((1 << (yt + bt)) - 1)) >> yt)
                            ]),
                            (_t = Et >>> 24),
                            (vt = (Et >>> 16) & 255),
                            (mt = 65535 & Et),
                            !(yt + _t <= ct);

                        ) {
                          if (0 === u) break t;
                          u--, (f += i[a++] << ct), (ct += 8);
                        }
                        (f >>>= yt), (ct -= yt), (r.back += yt);
                      }
                      if (((f >>>= _t), (ct -= _t), (r.back += _t), 64 & vt)) {
                        (t.msg = 'invalid distance code'), (r.mode = st);
                        break;
                      }
                      (r.offset = mt), (r.extra = 15 & vt), (r.mode = et);
                    case et:
                      if (r.extra) {
                        for (kt = r.extra; ct < kt; ) {
                          if (0 === u) break t;
                          u--, (f += i[a++] << ct), (ct += 8);
                        }
                        (r.offset += f & ((1 << r.extra) - 1)),
                          (f >>>= r.extra),
                          (ct -= r.extra),
                          (r.back += r.extra);
                      }
                      if (r.offset > r.dmax) {
                        (t.msg = 'invalid distance too far back'),
                          (r.mode = st);
                        break;
                      }
                      r.mode = rt;
                    case rt:
                      if (0 === h) break t;
                      if (((dt = ft - h), r.offset > dt)) {
                        if ((dt = r.offset - dt) > r.whave && r.sane) {
                          (t.msg = 'invalid distance too far back'),
                            (r.mode = st);
                          break;
                        }
                        dt > r.wnext
                          ? ((dt -= r.wnext), (pt = r.wsize - dt))
                          : (pt = r.wnext - dt),
                          dt > r.length && (dt = r.length),
                          (gt = r.window);
                      } else (gt = o), (pt = s - r.offset), (dt = r.length);
                      dt > h && (dt = h), (h -= dt), (r.length -= dt);
                      do {
                        o[s++] = gt[pt++];
                      } while (--dt);
                      0 === r.length && (r.mode = Q);
                      break;
                    case nt:
                      if (0 === h) break t;
                      (o[s++] = r.length), h--, (r.mode = Q);
                      break;
                    case it:
                      if (r.wrap) {
                        for (; ct < 32; ) {
                          if (0 === u) break t;
                          u--, (f |= i[a++] << ct), (ct += 8);
                        }
                        if (
                          ((ft -= h),
                          (t.total_out += ft),
                          (r.total += ft),
                          ft &&
                            (t.adler = r.check =
                              r.flags
                                ? g(r.check, o, ft, s - ft)
                                : p(r.check, o, ft, s - ft)),
                          (ft = h),
                          (r.flags ? f : n(f)) !== r.check)
                        ) {
                          (t.msg = 'incorrect data check'), (r.mode = st);
                          break;
                        }
                        (f = 0), (ct = 0);
                      }
                      r.mode = ot;
                    case ot:
                      if (r.wrap && r.flags) {
                        for (; ct < 32; ) {
                          if (0 === u) break t;
                          u--, (f += i[a++] << ct), (ct += 8);
                        }
                        if (f !== (4294967295 & r.total)) {
                          (t.msg = 'incorrect length check'), (r.mode = st);
                          break;
                        }
                        (f = 0), (ct = 0);
                      }
                      r.mode = at;
                    case at:
                      St = k;
                      break t;
                    case st:
                      St = P;
                      break t;
                    case ut:
                      return j;
                    case lt:
                    default:
                      return A;
                  }
                return (
                  (t.next_out = s),
                  (t.avail_out = h),
                  (t.next_in = a),
                  (t.avail_in = u),
                  (r.hold = f),
                  (r.bits = ct),
                  (r.wsize ||
                    (ft !== t.avail_out &&
                      r.mode < st &&
                      (r.mode < it || e !== w))) &&
                  c(t, t.output, t.next_out, ft - t.avail_out)
                    ? ((r.mode = ut), j)
                    : ((ht -= t.avail_in),
                      (ft -= t.avail_out),
                      (t.total_in += ht),
                      (t.total_out += ft),
                      (r.total += ft),
                      r.wrap &&
                        ft &&
                        (t.adler = r.check =
                          r.flags
                            ? g(r.check, o, ft, t.next_out - ft)
                            : p(r.check, o, ft, t.next_out - ft)),
                      (t.data_type =
                        r.bits +
                        (r.last ? 64 : 0) +
                        (r.mode === G ? 128 : 0) +
                        (r.mode === J || r.mode === W ? 256 : 0)),
                      ((0 === ht && 0 === ft) || e === w) &&
                        St === C &&
                        (St = I),
                      St)
                );
              }),
              (r.inflateEnd = function (t) {
                if (!t || !t.state) return A;
                var e = t.state;
                return e.window && (e.window = null), (t.state = null), C;
              }),
              (r.inflateGetHeader = function (t, e) {
                var r;
                return t && t.state
                  ? 0 == (2 & (r = t.state).wrap)
                    ? A
                    : ((r.head = e), (e.done = !1), C)
                  : A;
              }),
              (r.inflateSetDictionary = function (t, e) {
                var r,
                  n,
                  i = e.length;
                return t && t.state
                  ? 0 !== (r = t.state).wrap && r.mode !== H
                    ? A
                    : r.mode === H && ((n = 1), (n = p(n, e, i, 0)) !== r.check)
                    ? P
                    : c(t, e, i, i)
                    ? ((r.mode = ut), j)
                    : ((r.havedict = 1), C)
                  : A;
              }),
              (r.inflateInfo = 'pako inflate (from Nodeca project)');
          },
          {
            '../utils/common': 175,
            './adler32': 176,
            './crc32': 178,
            './inffast': 180,
            './inftrees': 182,
          },
        ],
        182: [
          function (t, e, r) {
            var n = t('../utils/common'),
              i = [
                3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43,
                51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
              ],
              o = [
                16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
                19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78,
              ],
              a = [
                1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257,
                385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289,
                16385, 24577, 0, 0,
              ],
              s = [
                16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
                23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64,
              ];
            e.localExports = function (t, e, r, u, l, c, h, f) {
              var d,
                p,
                g,
                _,
                v,
                m,
                y,
                b,
                w,
                x = f.bits,
                S = 0,
                C = 0,
                k = 0,
                E = 0,
                A = 0,
                P = 0,
                j = 0,
                I = 0,
                T = 0,
                B = 0,
                L = null,
                O = 0,
                N = new n.Buf16(16),
                R = new n.Buf16(16),
                M = null,
                F = 0;
              for (S = 0; S <= 15; S++) N[S] = 0;
              for (C = 0; C < u; C++) N[e[r + C]]++;
              for (A = x, E = 15; E >= 1 && 0 === N[E]; E--);
              if ((A > E && (A = E), 0 === E))
                return (
                  (l[c++] = 20971520), (l[c++] = 20971520), (f.bits = 1), 0
                );
              for (k = 1; k < E && 0 === N[k]; k++);
              for (A < k && (A = k), I = 1, S = 1; S <= 15; S++)
                if (((I <<= 1), (I -= N[S]) < 0)) return -1;
              if (I > 0 && (0 === t || 1 !== E)) return -1;
              for (R[1] = 0, S = 1; S < 15; S++) R[S + 1] = R[S] + N[S];
              for (C = 0; C < u; C++) 0 !== e[r + C] && (h[R[e[r + C]]++] = C);
              if (
                (0 === t
                  ? ((L = M = h), (m = 19))
                  : 1 === t
                  ? ((L = i), (O -= 257), (M = o), (F -= 257), (m = 256))
                  : ((L = a), (M = s), (m = -1)),
                (B = 0),
                (C = 0),
                (S = k),
                (v = c),
                (P = A),
                (j = 0),
                (g = -1),
                (T = 1 << A),
                (_ = T - 1),
                (1 === t && T > 852) || (2 === t && T > 592))
              )
                return 1;
              for (;;) {
                0,
                  (y = S - j),
                  h[C] < m
                    ? ((b = 0), (w = h[C]))
                    : h[C] > m
                    ? ((b = M[F + h[C]]), (w = L[O + h[C]]))
                    : ((b = 96), (w = 0)),
                  (d = 1 << (S - j)),
                  (k = p = 1 << P);
                do {
                  l[v + (B >> j) + (p -= d)] = (y << 24) | (b << 16) | w | 0;
                } while (0 !== p);
                for (d = 1 << (S - 1); B & d; ) d >>= 1;
                if (
                  (0 !== d ? ((B &= d - 1), (B += d)) : (B = 0),
                  C++,
                  0 == --N[S])
                ) {
                  if (S === E) break;
                  S = e[r + h[C]];
                }
                if (S > A && (B & _) !== g) {
                  for (
                    0 === j && (j = A), v += k, I = 1 << (P = S - j);
                    P + j < E && !((I -= N[P + j]) <= 0);

                  )
                    P++, (I <<= 1);
                  if (
                    ((T += 1 << P),
                    (1 === t && T > 852) || (2 === t && T > 592))
                  )
                    return 1;
                  l[(g = B & _)] = (A << 24) | (P << 16) | (v - c) | 0;
                }
              }
              return (
                0 !== B && (l[v + B] = ((S - j) << 24) | (64 << 16) | 0),
                (f.bits = A),
                0
              );
            };
          },
          { '../utils/common': 175 },
        ],
        183: [
          function (t, e, r) {
            e.localExports = {
              2: 'need dictionary',
              1: 'stream end',
              0: '',
              '-1': 'file error',
              '-2': 'stream error',
              '-3': 'data error',
              '-4': 'insufficient memory',
              '-5': 'buffer error',
              '-6': 'incompatible version',
            };
          },
          {},
        ],
        184: [
          function (t, e, r) {
            function n(t) {
              for (var e = t.length; --e >= 0; ) t[e] = 0;
            }
            function i(t, e, r, n, i) {
              (this.static_tree = t),
                (this.extra_bits = e),
                (this.extra_base = r),
                (this.elems = n),
                (this.max_length = i),
                (this.has_stree = t && t.length);
            }
            function o(t, e) {
              (this.dyn_tree = t), (this.max_code = 0), (this.stat_desc = e);
            }
            function a(t) {
              return t < 256 ? et[t] : et[256 + (t >>> 7)];
            }
            function s(t, e) {
              (t.pending_buf[t.pending++] = 255 & e),
                (t.pending_buf[t.pending++] = (e >>> 8) & 255);
            }
            function u(t, e, r) {
              t.bi_valid > G - r
                ? ((t.bi_buf |= (e << t.bi_valid) & 65535),
                  s(t, t.bi_buf),
                  (t.bi_buf = e >> (G - t.bi_valid)),
                  (t.bi_valid += r - G))
                : ((t.bi_buf |= (e << t.bi_valid) & 65535), (t.bi_valid += r));
            }
            function l(t, e, r) {
              u(t, r[2 * e], r[2 * e + 1]);
            }
            function c(t, e) {
              var r = 0;
              do {
                (r |= 1 & t), (t >>>= 1), (r <<= 1);
              } while (--e > 0);
              return r >>> 1;
            }
            function h(t) {
              16 === t.bi_valid
                ? (s(t, t.bi_buf), (t.bi_buf = 0), (t.bi_valid = 0))
                : t.bi_valid >= 8 &&
                  ((t.pending_buf[t.pending++] = 255 & t.bi_buf),
                  (t.bi_buf >>= 8),
                  (t.bi_valid -= 8));
            }
            function f(t, e) {
              var r,
                n,
                i,
                o,
                a,
                s,
                u = e.dyn_tree,
                l = e.max_code,
                c = e.stat_desc.static_tree,
                h = e.stat_desc.has_stree,
                f = e.stat_desc.extra_bits,
                d = e.stat_desc.extra_base,
                p = e.stat_desc.max_length,
                g = 0;
              for (o = 0; o <= H; o++) t.bl_count[o] = 0;
              for (
                u[2 * t.heap[t.heap_max] + 1] = 0, r = t.heap_max + 1;
                r < U;
                r++
              )
                (o = u[2 * u[2 * (n = t.heap[r]) + 1] + 1] + 1) > p &&
                  ((o = p), g++),
                  (u[2 * n + 1] = o),
                  n > l ||
                    (t.bl_count[o]++,
                    (a = 0),
                    n >= d && (a = f[n - d]),
                    (s = u[2 * n]),
                    (t.opt_len += s * (o + a)),
                    h && (t.static_len += s * (c[2 * n + 1] + a)));
              if (0 !== g) {
                do {
                  for (o = p - 1; 0 === t.bl_count[o]; ) o--;
                  t.bl_count[o]--,
                    (t.bl_count[o + 1] += 2),
                    t.bl_count[p]--,
                    (g -= 2);
                } while (g > 0);
                for (o = p; 0 !== o; o--)
                  for (n = t.bl_count[o]; 0 !== n; )
                    (i = t.heap[--r]) > l ||
                      (u[2 * i + 1] !== o &&
                        ((t.opt_len += (o - u[2 * i + 1]) * u[2 * i]),
                        (u[2 * i + 1] = o)),
                      n--);
              }
            }
            function d(t, e, r) {
              var n,
                i,
                o = new Array(H + 1),
                a = 0;
              for (n = 1; n <= H; n++) o[n] = a = (a + r[n - 1]) << 1;
              for (i = 0; i <= e; i++) {
                var s = t[2 * i + 1];
                0 !== s && (t[2 * i] = c(o[s]++, s));
              }
            }
            function p() {
              var t,
                e,
                r,
                n,
                o,
                a = new Array(H + 1);
              for (r = 0, n = 0; n < R - 1; n++)
                for (nt[n] = r, t = 0; t < 1 << K[n]; t++) rt[r++] = n;
              for (rt[r - 1] = n, o = 0, n = 0; n < 16; n++)
                for (it[n] = o, t = 0; t < 1 << X[n]; t++) et[o++] = n;
              for (o >>= 7; n < D; n++)
                for (it[n] = o << 7, t = 0; t < 1 << (X[n] - 7); t++)
                  et[256 + o++] = n;
              for (e = 0; e <= H; e++) a[e] = 0;
              for (t = 0; t <= 143; ) ($[2 * t + 1] = 8), t++, a[8]++;
              for (; t <= 255; ) ($[2 * t + 1] = 9), t++, a[9]++;
              for (; t <= 279; ) ($[2 * t + 1] = 7), t++, a[7]++;
              for (; t <= 287; ) ($[2 * t + 1] = 8), t++, a[8]++;
              for (d($, F + 1, a), t = 0; t < D; t++)
                (tt[2 * t + 1] = 5), (tt[2 * t] = c(t, 5));
              (ot = new i($, K, M + 1, F, H)),
                (at = new i(tt, X, 0, D, H)),
                (st = new i(new Array(0), J, 0, z, q));
            }
            function g(t) {
              var e;
              for (e = 0; e < F; e++) t.dyn_ltree[2 * e] = 0;
              for (e = 0; e < D; e++) t.dyn_dtree[2 * e] = 0;
              for (e = 0; e < z; e++) t.bl_tree[2 * e] = 0;
              (t.dyn_ltree[2 * Z] = 1),
                (t.opt_len = t.static_len = 0),
                (t.last_lit = t.matches = 0);
            }
            function _(t) {
              t.bi_valid > 8
                ? s(t, t.bi_buf)
                : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf),
                (t.bi_buf = 0),
                (t.bi_valid = 0);
            }
            function v(t, e, r, n) {
              _(t),
                n && (s(t, r), s(t, ~r)),
                P.arraySet(t.pending_buf, t.window, e, r, t.pending),
                (t.pending += r);
            }
            function m(t, e, r, n) {
              var i = 2 * e,
                o = 2 * r;
              return t[i] < t[o] || (t[i] === t[o] && n[e] <= n[r]);
            }
            function y(t, e, r) {
              for (
                var n = t.heap[r], i = r << 1;
                i <= t.heap_len &&
                (i < t.heap_len &&
                  m(e, t.heap[i + 1], t.heap[i], t.depth) &&
                  i++,
                !m(e, n, t.heap[i], t.depth));

              )
                (t.heap[r] = t.heap[i]), (r = i), (i <<= 1);
              t.heap[r] = n;
            }
            function b(t, e, r) {
              var n,
                i,
                o,
                s,
                c = 0;
              if (0 !== t.last_lit)
                do {
                  (n =
                    (t.pending_buf[t.d_buf + 2 * c] << 8) |
                    t.pending_buf[t.d_buf + 2 * c + 1]),
                    (i = t.pending_buf[t.l_buf + c]),
                    c++,
                    0 === n
                      ? l(t, i, e)
                      : (l(t, (o = rt[i]) + M + 1, e),
                        0 !== (s = K[o]) && u(t, (i -= nt[o]), s),
                        l(t, (o = a(--n)), r),
                        0 !== (s = X[o]) && u(t, (n -= it[o]), s));
                } while (c < t.last_lit);
              l(t, Z, e);
            }
            function w(t, e) {
              var r,
                n,
                i,
                o = e.dyn_tree,
                a = e.stat_desc.static_tree,
                s = e.stat_desc.has_stree,
                u = e.stat_desc.elems,
                l = -1;
              for (t.heap_len = 0, t.heap_max = U, r = 0; r < u; r++)
                0 !== o[2 * r]
                  ? ((t.heap[++t.heap_len] = l = r), (t.depth[r] = 0))
                  : (o[2 * r + 1] = 0);
              for (; t.heap_len < 2; )
                (o[2 * (i = t.heap[++t.heap_len] = l < 2 ? ++l : 0)] = 1),
                  (t.depth[i] = 0),
                  t.opt_len--,
                  s && (t.static_len -= a[2 * i + 1]);
              for (e.max_code = l, r = t.heap_len >> 1; r >= 1; r--) y(t, o, r);
              i = u;
              do {
                (r = t.heap[1]),
                  (t.heap[1] = t.heap[t.heap_len--]),
                  y(t, o, 1),
                  (n = t.heap[1]),
                  (t.heap[--t.heap_max] = r),
                  (t.heap[--t.heap_max] = n),
                  (o[2 * i] = o[2 * r] + o[2 * n]),
                  (t.depth[i] =
                    (t.depth[r] >= t.depth[n] ? t.depth[r] : t.depth[n]) + 1),
                  (o[2 * r + 1] = o[2 * n + 1] = i),
                  (t.heap[1] = i++),
                  y(t, o, 1);
              } while (t.heap_len >= 2);
              (t.heap[--t.heap_max] = t.heap[1]), f(t, e), d(o, l, t.bl_count);
            }
            function x(t, e, r) {
              var n,
                i,
                o = -1,
                a = e[1],
                s = 0,
                u = 7,
                l = 4;
              for (
                0 === a && ((u = 138), (l = 3)),
                  e[2 * (r + 1) + 1] = 65535,
                  n = 0;
                n <= r;
                n++
              )
                (i = a),
                  (a = e[2 * (n + 1) + 1]),
                  (++s < u && i === a) ||
                    (s < l
                      ? (t.bl_tree[2 * i] += s)
                      : 0 !== i
                      ? (i !== o && t.bl_tree[2 * i]++, t.bl_tree[2 * W]++)
                      : s <= 10
                      ? t.bl_tree[2 * Y]++
                      : t.bl_tree[2 * V]++,
                    (s = 0),
                    (o = i),
                    0 === a
                      ? ((u = 138), (l = 3))
                      : i === a
                      ? ((u = 6), (l = 3))
                      : ((u = 7), (l = 4)));
            }
            function S(t, e, r) {
              var n,
                i,
                o = -1,
                a = e[1],
                s = 0,
                c = 7,
                h = 4;
              for (0 === a && ((c = 138), (h = 3)), n = 0; n <= r; n++)
                if (
                  ((i = a), (a = e[2 * (n + 1) + 1]), !(++s < c && i === a))
                ) {
                  if (s < h)
                    do {
                      l(t, i, t.bl_tree);
                    } while (0 != --s);
                  else
                    0 !== i
                      ? (i !== o && (l(t, i, t.bl_tree), s--),
                        l(t, W, t.bl_tree),
                        u(t, s - 3, 2))
                      : s <= 10
                      ? (l(t, Y, t.bl_tree), u(t, s - 3, 3))
                      : (l(t, V, t.bl_tree), u(t, s - 11, 7));
                  (s = 0),
                    (o = i),
                    0 === a
                      ? ((c = 138), (h = 3))
                      : i === a
                      ? ((c = 6), (h = 3))
                      : ((c = 7), (h = 4));
                }
            }
            function C(t) {
              var e;
              for (
                x(t, t.dyn_ltree, t.l_desc.max_code),
                  x(t, t.dyn_dtree, t.d_desc.max_code),
                  w(t, t.bl_desc),
                  e = z - 1;
                e >= 3 && 0 === t.bl_tree[2 * Q[e] + 1];
                e--
              );
              return (t.opt_len += 3 * (e + 1) + 5 + 5 + 4), e;
            }
            function k(t, e, r, n) {
              var i;
              for (
                u(t, e - 257, 5), u(t, r - 1, 5), u(t, n - 4, 4), i = 0;
                i < n;
                i++
              )
                u(t, t.bl_tree[2 * Q[i] + 1], 3);
              S(t, t.dyn_ltree, e - 1), S(t, t.dyn_dtree, r - 1);
            }
            function E(t) {
              var e,
                r = 4093624447;
              for (e = 0; e <= 31; e++, r >>>= 1)
                if (1 & r && 0 !== t.dyn_ltree[2 * e]) return I;
              if (
                0 !== t.dyn_ltree[18] ||
                0 !== t.dyn_ltree[20] ||
                0 !== t.dyn_ltree[26]
              )
                return T;
              for (e = 32; e < M; e++) if (0 !== t.dyn_ltree[2 * e]) return T;
              return I;
            }
            function A(t, e, r, n) {
              u(t, (L << 1) + (n ? 1 : 0), 3), v(t, e, r, !0);
            }
            var P = t('../utils/common'),
              j = 4,
              I = 0,
              T = 1,
              B = 2,
              L = 0,
              O = 1,
              N = 2,
              R = 29,
              M = 256,
              F = M + 1 + R,
              D = 30,
              z = 19,
              U = 2 * F + 1,
              H = 15,
              G = 16,
              q = 7,
              Z = 256,
              W = 16,
              Y = 17,
              V = 18,
              K = [
                0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4,
                4, 4, 4, 5, 5, 5, 5, 0,
              ],
              X = [
                0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9,
                9, 10, 10, 11, 11, 12, 12, 13, 13,
              ],
              J = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
              Q = [
                16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
                15,
              ],
              $ = new Array(2 * (F + 2));
            n($);
            var tt = new Array(2 * D);
            n(tt);
            var et = new Array(512);
            n(et);
            var rt = new Array(256);
            n(rt);
            var nt = new Array(R);
            n(nt);
            var it = new Array(D);
            n(it);
            var ot,
              at,
              st,
              ut = !1;
            (r._tr_init = function (t) {
              ut || (p(), (ut = !0)),
                (t.l_desc = new o(t.dyn_ltree, ot)),
                (t.d_desc = new o(t.dyn_dtree, at)),
                (t.bl_desc = new o(t.bl_tree, st)),
                (t.bi_buf = 0),
                (t.bi_valid = 0),
                g(t);
            }),
              (r._tr_stored_block = A),
              (r._tr_flush_block = function (t, e, r, n) {
                var i,
                  o,
                  a = 0;
                t.level > 0
                  ? (t.strm.data_type === B && (t.strm.data_type = E(t)),
                    w(t, t.l_desc),
                    w(t, t.d_desc),
                    (a = C(t)),
                    (i = (t.opt_len + 3 + 7) >>> 3),
                    (o = (t.static_len + 3 + 7) >>> 3) <= i && (i = o))
                  : (i = o = r + 5),
                  r + 4 <= i && -1 !== e
                    ? A(t, e, r, n)
                    : t.strategy === j || o === i
                    ? (u(t, (O << 1) + (n ? 1 : 0), 3), b(t, $, tt))
                    : (u(t, (N << 1) + (n ? 1 : 0), 3),
                      k(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, a + 1),
                      b(t, t.dyn_ltree, t.dyn_dtree)),
                  g(t),
                  n && _(t);
              }),
              (r._tr_tally = function (t, e, r) {
                return (
                  (t.pending_buf[t.d_buf + 2 * t.last_lit] = (e >>> 8) & 255),
                  (t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e),
                  (t.pending_buf[t.l_buf + t.last_lit] = 255 & r),
                  t.last_lit++,
                  0 === e
                    ? t.dyn_ltree[2 * r]++
                    : (t.matches++,
                      e--,
                      t.dyn_ltree[2 * (rt[r] + M + 1)]++,
                      t.dyn_dtree[2 * a(e)]++),
                  t.last_lit === t.lit_bufsize - 1
                );
              }),
              (r._tr_align = function (t) {
                u(t, O << 1, 3), l(t, Z, $), h(t);
              });
          },
          { '../utils/common': 175 },
        ],
        185: [
          function (t, e, r) {
            e.localExports = function () {
              (this.input = null),
                (this.next_in = 0),
                (this.avail_in = 0),
                (this.total_in = 0),
                (this.output = null),
                (this.next_out = 0),
                (this.avail_out = 0),
                (this.total_out = 0),
                (this.msg = ''),
                (this.state = null),
                (this.data_type = 2),
                (this.adler = 0);
            };
          },
          {},
        ],
        186: [
          function (t, e, r) {
            (function (r) {
              (function () {
                var n, i;
                (n = t('fs')),
                  (i = t('zlib')),
                  (e.localExports = (function () {
                    function t(t) {
                      var e, n, i, o, a, s, u, l, c, h;
                      for (
                        this.data = t,
                          this.pos = 8,
                          this.palette = [],
                          this.imgData = [],
                          this.transparency = {},
                          this.text = {};
                        ;

                      ) {
                        switch (
                          ((e = this.readUInt32()),
                          function () {
                            var t, e;
                            for (e = [], i = t = 0; t < 4; i = ++t)
                              e.push(
                                String.fromCharCode(this.data[this.pos++])
                              );
                            return e;
                          }
                            .call(this)
                            .join(''))
                        ) {
                          case 'IHDR':
                            (this.width = this.readUInt32()),
                              (this.height = this.readUInt32()),
                              (this.bits = this.data[this.pos++]),
                              (this.colorType = this.data[this.pos++]),
                              (this.compressionMethod = this.data[this.pos++]),
                              (this.filterMethod = this.data[this.pos++]),
                              (this.interlaceMethod = this.data[this.pos++]);
                            break;
                          case 'PLTE':
                            this.palette = this.read(e);
                            break;
                          case 'IDAT':
                            for (i = l = 0; l < e; i = l += 1)
                              this.imgData.push(this.data[this.pos++]);
                            break;
                          case 'tRNS':
                            switch (
                              ((this.transparency = {}), this.colorType)
                            ) {
                              case 3:
                                if (
                                  ((this.transparency.indexed = this.read(e)),
                                  (s = 255 - this.transparency.indexed.length) >
                                    0)
                                )
                                  for (
                                    i = c = 0;
                                    0 <= s ? c < s : c > s;
                                    i = 0 <= s ? ++c : --c
                                  )
                                    this.transparency.indexed.push(255);
                                break;
                              case 0:
                                this.transparency.grayscale = this.read(e)[0];
                                break;
                              case 2:
                                this.transparency.rgb = this.read(e);
                            }
                            break;
                          case 'tEXt':
                            (o = (u = this.read(e)).indexOf(0)),
                              (a = String.fromCharCode.apply(
                                String,
                                u.slice(0, o)
                              )),
                              (this.text[a] = String.fromCharCode.apply(
                                String,
                                u.slice(o + 1)
                              ));
                            break;
                          case 'IEND':
                            return (
                              (this.colors = function () {
                                switch (this.colorType) {
                                  case 0:
                                  case 3:
                                  case 4:
                                    return 1;
                                  case 2:
                                  case 6:
                                    return 3;
                                }
                              }.call(this)),
                              (this.hasAlphaChannel =
                                4 === (h = this.colorType) || 6 === h),
                              (n =
                                this.colors + (this.hasAlphaChannel ? 1 : 0)),
                              (this.pixelBitlength = this.bits * n),
                              (this.colorSpace = function () {
                                switch (this.colors) {
                                  case 1:
                                    return 'DeviceGray';
                                  case 3:
                                    return 'DeviceRGB';
                                }
                              }.call(this)),
                              void (this.imgData = new r(this.imgData))
                            );
                          default:
                            this.pos += e;
                        }
                        if (((this.pos += 4), this.pos > this.data.length))
                          throw new Error('Incomplete or corrupt PNG file');
                      }
                    }
                    return (
                      (t.decode = function (e, r) {
                        return n.readFile(e, function (e, n) {
                          return new t(n).decode(function (t) {
                            return r(t);
                          });
                        });
                      }),
                      (t.load = function (e) {
                        var r;
                        return (r = n.readFileSync(e)), new t(r);
                      }),
                      (t.prototype.read = function (t) {
                        var e, r;
                        for (
                          r = [], e = 0;
                          0 <= t ? e < t : e > t;
                          0 <= t ? ++e : --e
                        )
                          r.push(this.data[this.pos++]);
                        return r;
                      }),
                      (t.prototype.readUInt32 = function () {
                        var t, e, r, n;
                        return (
                          (t = this.data[this.pos++] << 24),
                          (e = this.data[this.pos++] << 16),
                          (r = this.data[this.pos++] << 8),
                          (n = this.data[this.pos++]),
                          t | e | r | n
                        );
                      }),
                      (t.prototype.readUInt16 = function () {
                        var t, e;
                        return (
                          (t = this.data[this.pos++] << 8),
                          (e = this.data[this.pos++]),
                          t | e
                        );
                      }),
                      (t.prototype.decodePixels = function (t) {
                        var e = this;
                        return i.inflate(this.imgData, function (n, i) {
                          var o,
                            a,
                            s,
                            u,
                            l,
                            c,
                            h,
                            f,
                            d,
                            p,
                            g,
                            _,
                            v,
                            m,
                            y,
                            b,
                            w,
                            x,
                            S,
                            C,
                            k,
                            E,
                            A;
                          if (n) throw n;
                          for (
                            b = (_ = e.pixelBitlength / 8) * e.width,
                              v = new r(b * e.height),
                              c = i.length,
                              y = 0,
                              m = 0,
                              a = 0;
                            m < c;

                          ) {
                            switch (i[m++]) {
                              case 0:
                                for (u = S = 0; S < b; u = S += 1)
                                  v[a++] = i[m++];
                                break;
                              case 1:
                                for (u = C = 0; C < b; u = C += 1)
                                  (o = i[m++]),
                                    (l = u < _ ? 0 : v[a - _]),
                                    (v[a++] = (o + l) % 256);
                                break;
                              case 2:
                                for (u = k = 0; k < b; u = k += 1)
                                  (o = i[m++]),
                                    (s = (u - (u % _)) / _),
                                    (w = y && v[(y - 1) * b + s * _ + (u % _)]),
                                    (v[a++] = (w + o) % 256);
                                break;
                              case 3:
                                for (u = E = 0; E < b; u = E += 1)
                                  (o = i[m++]),
                                    (s = (u - (u % _)) / _),
                                    (l = u < _ ? 0 : v[a - _]),
                                    (w = y && v[(y - 1) * b + s * _ + (u % _)]),
                                    (v[a++] =
                                      (o + Math.floor((l + w) / 2)) % 256);
                                break;
                              case 4:
                                for (u = A = 0; A < b; u = A += 1)
                                  (o = i[m++]),
                                    (s = (u - (u % _)) / _),
                                    (l = u < _ ? 0 : v[a - _]),
                                    0 === y
                                      ? (w = x = 0)
                                      : ((w = v[(y - 1) * b + s * _ + (u % _)]),
                                        (x =
                                          s &&
                                          v[
                                            (y - 1) * b + (s - 1) * _ + (u % _)
                                          ])),
                                    (h = l + w - x),
                                    (f = Math.abs(h - l)),
                                    (p = Math.abs(h - w)),
                                    (g = Math.abs(h - x)),
                                    (d = f <= p && f <= g ? l : p <= g ? w : x),
                                    (v[a++] = (o + d) % 256);
                                break;
                              default:
                                throw new Error(
                                  'Invalid filter algorithm: ' + i[m - 1]
                                );
                            }
                            y++;
                          }
                          return t(v);
                        });
                      }),
                      (t.prototype.decodePalette = function () {
                        var t, e, n, i, o, a, s, u, l;
                        for (
                          n = this.palette,
                            a = this.transparency.indexed || [],
                            o = new r(a.length + n.length),
                            i = 0,
                            n.length,
                            t = 0,
                            e = s = 0,
                            u = n.length;
                          s < u;
                          e = s += 3
                        )
                          (o[i++] = n[e]),
                            (o[i++] = n[e + 1]),
                            (o[i++] = n[e + 2]),
                            (o[i++] = null != (l = a[t++]) ? l : 255);
                        return o;
                      }),
                      (t.prototype.copyToImageData = function (t, e) {
                        var r, n, i, o, a, s, u, l, c, h, f;
                        if (
                          ((n = this.colors),
                          (c = null),
                          (r = this.hasAlphaChannel),
                          this.palette.length &&
                            ((c =
                              null != (f = this._decodedPalette)
                                ? f
                                : (this._decodedPalette =
                                    this.decodePalette())),
                            (n = 4),
                            (r = !0)),
                          (i = (null != t ? t.data : void 0) || t),
                          (l = i.length),
                          (a = c || e),
                          (o = s = 0),
                          1 === n)
                        )
                          for (; o < l; )
                            (u = c ? 4 * e[o / 4] : s),
                              (h = a[u++]),
                              (i[o++] = h),
                              (i[o++] = h),
                              (i[o++] = h),
                              (i[o++] = r ? a[u++] : 255),
                              (s = u);
                        else
                          for (; o < l; )
                            (u = c ? 4 * e[o / 4] : s),
                              (i[o++] = a[u++]),
                              (i[o++] = a[u++]),
                              (i[o++] = a[u++]),
                              (i[o++] = r ? a[u++] : 255),
                              (s = u);
                      }),
                      (t.prototype.decode = function (t) {
                        var e,
                          n = this;
                        return (
                          (e = new r(this.width * this.height * 4)),
                          this.decodePixels(function (r) {
                            return n.copyToImageData(e, r), t(e);
                          })
                        );
                      }),
                      t
                    );
                  })());
              }).call(this);
            }).call(this, t('buffer').Buffer);
          },
          { buffer: 60, fs: 59, zlib: 58 },
        ],
        187: [
          function (t, e, r) {
            (function (t) {
              !t.version ||
              0 === t.version.indexOf('v0.') ||
              (0 === t.version.indexOf('v1.') &&
                0 !== t.version.indexOf('v1.8.'))
                ? (e.localExports = function (e, r, n, i) {
                    if ('function' != typeof e)
                      throw new TypeError(
                        '"callback" argument must be a function'
                      );
                    var o,
                      a,
                      s = arguments.length;
                    switch (s) {
                      case 0:
                      case 1:
                        return t.nextTick(e);
                      case 2:
                        return t.nextTick(function () {
                          e.call(null, r);
                        });
                      case 3:
                        return t.nextTick(function () {
                          e.call(null, r, n);
                        });
                      case 4:
                        return t.nextTick(function () {
                          e.call(null, r, n, i);
                        });
                      default:
                        for (o = new Array(s - 1), a = 0; a < o.length; )
                          o[a++] = arguments[a];
                        return t.nextTick(function () {
                          e.apply(null, o);
                        });
                    }
                  })
                : (e.localExports = t.nextTick);
            }).call(this, t('_process'));
          },
          { _process: 188 },
        ],
        188: [
          function (t, e, r) {
            function n(t) {
              if (l === setTimeout) return setTimeout(t, 0);
              try {
                return l(t, 0);
              } catch (e) {
                try {
                  return l.call(null, t, 0);
                } catch (e) {
                  return l.call(this, t, 0);
                }
              }
            }
            function i(t) {
              if (c === clearTimeout) return clearTimeout(t);
              try {
                return c(t);
              } catch (e) {
                try {
                  return c.call(null, t);
                } catch (e) {
                  return c.call(this, t);
                }
              }
            }
            function o() {
              p &&
                f &&
                ((p = !1),
                f.length ? (d = f.concat(d)) : (g = -1),
                d.length && a());
            }
            function a() {
              if (!p) {
                var t = n(o);
                p = !0;
                for (var e = d.length; e; ) {
                  for (f = d, d = []; ++g < e; ) f && f[g].run();
                  (g = -1), (e = d.length);
                }
                (f = null), (p = !1), i(t);
              }
            }
            function s(t, e) {
              (this.fun = t), (this.array = e);
            }
            function u() {}
            var l,
              c,
              h = (e.localExports = {});
            !(function () {
              try {
                l = setTimeout;
              } catch (t) {
                l = function () {
                  throw new Error('setTimeout is not defined');
                };
              }
              try {
                c = clearTimeout;
              } catch (t) {
                c = function () {
                  throw new Error('clearTimeout is not defined');
                };
              }
            })();
            var f,
              d = [],
              p = !1,
              g = -1;
            (h.nextTick = function (t) {
              var e = new Array(arguments.length - 1);
              if (arguments.length > 1)
                for (var r = 1; r < arguments.length; r++)
                  e[r - 1] = arguments[r];
              d.push(new s(t, e)), 1 !== d.length || p || n(a);
            }),
              (s.prototype.run = function () {
                this.fun.apply(null, this.array);
              }),
              (h.title = 'browser'),
              (h.browser = !0),
              (h.env = {}),
              (h.argv = []),
              (h.version = ''),
              (h.versions = {}),
              (h.on = u),
              (h.addListener = u),
              (h.once = u),
              (h.off = u),
              (h.removeListener = u),
              (h.removeAllListeners = u),
              (h.emit = u),
              (h.binding = function (t) {
                throw new Error('process.binding is not supported');
              }),
              (h.cwd = function () {
                return '/';
              }),
              (h.chdir = function (t) {
                throw new Error('process.chdir is not supported');
              }),
              (h.umask = function () {
                return 0;
              });
          },
          {},
        ],
        189: [
          function (t, e, r) {
            e.localExports = t('./lib/_stream_duplex.js');
          },
          { './lib/_stream_duplex.js': 190 },
        ],
        190: [
          function (t, e, r) {
            function n(t) {
              if (!(this instanceof n)) return new n(t);
              l.call(this, t),
                c.call(this, t),
                t && !1 === t.readable && (this.readable = !1),
                t && !1 === t.writable && (this.writable = !1),
                (this.allowHalfOpen = !0),
                t && !1 === t.allowHalfOpen && (this.allowHalfOpen = !1),
                this.once('end', i);
            }
            function i() {
              this.allowHalfOpen || this._writableState.ended || s(o, this);
            }
            function o(t) {
              t.end();
            }
            var a =
              Object.keys ||
              function (t) {
                var e = [];
                for (var r in t) e.push(r);
                return e;
              };
            e.localExports = n;
            var s = t('process-nextick-args'),
              u = t('core-util-is');
            u.inherits = t('inherits');
            var l = t('./_stream_readable'),
              c = t('./_stream_writable');
            u.inherits(n, l);
            for (var h = a(c.prototype), f = 0; f < h.length; f++) {
              var d = h[f];
              n.prototype[d] || (n.prototype[d] = c.prototype[d]);
            }
          },
          {
            './_stream_readable': 192,
            './_stream_writable': 194,
            'core-util-is': 160,
            inherits: 167,
            'process-nextick-args': 187,
          },
        ],
        191: [
          function (t, e, r) {
            function n(t) {
              if (!(this instanceof n)) return new n(t);
              i.call(this, t);
            }
            e.localExports = n;
            var i = t('./_stream_transform'),
              o = t('core-util-is');
            (o.inherits = t('inherits')),
              o.inherits(n, i),
              (n.prototype._transform = function (t, e, r) {
                r(null, t);
              });
          },
          {
            './_stream_transform': 193,
            'core-util-is': 160,
            inherits: 167,
          },
        ],
        192: [
          function (t, e, r) {
            (function (r) {
              function n(e, r) {
                (O = O || t('./_stream_duplex')),
                  (e = e || {}),
                  (this.objectMode = !!e.objectMode),
                  r instanceof O &&
                    (this.objectMode =
                      this.objectMode || !!e.readableObjectMode);
                var n = e.highWaterMark,
                  i = this.objectMode ? 16 : 16384;
                (this.highWaterMark = n || 0 === n ? n : i),
                  (this.highWaterMark = ~~this.highWaterMark),
                  (this.buffer = []),
                  (this.length = 0),
                  (this.pipes = null),
                  (this.pipesCount = 0),
                  (this.flowing = null),
                  (this.ended = !1),
                  (this.endEmitted = !1),
                  (this.reading = !1),
                  (this.sync = !0),
                  (this.needReadable = !1),
                  (this.emittedReadable = !1),
                  (this.readableListening = !1),
                  (this.resumeScheduled = !1),
                  (this.defaultEncoding = e.defaultEncoding || 'utf8'),
                  (this.ranOut = !1),
                  (this.awaitDrain = 0),
                  (this.readingMore = !1),
                  (this.decoder = null),
                  (this.encoding = null),
                  e.encoding &&
                    (L || (L = t('string_decoder/').StringDecoder),
                    (this.decoder = new L(e.encoding)),
                    (this.encoding = e.encoding));
              }
              function i(e) {
                if (((O = O || t('./_stream_duplex')), !(this instanceof i)))
                  return new i(e);
                (this._readableState = new n(e, this)),
                  (this.readable = !0),
                  e && 'function' == typeof e.read && (this._read = e.read),
                  P.call(this);
              }
              function o(t, e, r, n, i) {
                var o = l(e, r);
                if (o) t.emit('error', o);
                else if (null === r) (e.reading = !1), c(t, e);
                else if (e.objectMode || (r && r.length > 0))
                  if (e.ended && !i) {
                    s = new Error('stream.push() after EOF');
                    t.emit('error', s);
                  } else if (e.endEmitted && i) {
                    var s = new Error('stream.unshift() after end event');
                    t.emit('error', s);
                  } else {
                    var u;
                    !e.decoder ||
                      i ||
                      n ||
                      ((r = e.decoder.write(r)),
                      (u = !e.objectMode && 0 === r.length)),
                      i || (e.reading = !1),
                      u ||
                        (e.flowing && 0 === e.length && !e.sync
                          ? (t.emit('data', r), t.read(0))
                          : ((e.length += e.objectMode ? 1 : r.length),
                            i ? e.buffer.unshift(r) : e.buffer.push(r),
                            e.needReadable && h(t))),
                      d(t, e);
                  }
                else i || (e.reading = !1);
                return a(e);
              }
              function a(t) {
                return (
                  !t.ended &&
                  (t.needReadable ||
                    t.length < t.highWaterMark ||
                    0 === t.length)
                );
              }
              function s(t) {
                return (
                  t >= N
                    ? (t = N)
                    : (t--,
                      (t |= t >>> 1),
                      (t |= t >>> 2),
                      (t |= t >>> 4),
                      (t |= t >>> 8),
                      (t |= t >>> 16),
                      t++),
                  t
                );
              }
              function u(t, e) {
                return 0 === e.length && e.ended
                  ? 0
                  : e.objectMode
                  ? 0 === t
                    ? 0
                    : 1
                  : null === t || isNaN(t)
                  ? e.flowing && e.buffer.length
                    ? e.buffer[0].length
                    : e.length
                  : t <= 0
                  ? 0
                  : (t > e.highWaterMark && (e.highWaterMark = s(t)),
                    t > e.length
                      ? e.ended
                        ? e.length
                        : ((e.needReadable = !0), 0)
                      : t);
              }
              function l(t, e) {
                var r = null;
                return (
                  A.isBuffer(e) ||
                    'string' == typeof e ||
                    null === e ||
                    void 0 === e ||
                    t.objectMode ||
                    (r = new TypeError('Invalid non-string/buffer chunk')),
                  r
                );
              }
              function c(t, e) {
                if (!e.ended) {
                  if (e.decoder) {
                    var r = e.decoder.end();
                    r &&
                      r.length &&
                      (e.buffer.push(r),
                      (e.length += e.objectMode ? 1 : r.length));
                  }
                  (e.ended = !0), h(t);
                }
              }
              function h(t, e) {
                var r = t._readableState;
                (r.needReadable = !1),
                  r.emittedReadable ||
                    (B('emitReadable', r.flowing),
                    (r.emittedReadable = !0),
                    r.sync ? k(f, t) : f(t));
              }
              function f(t) {
                B('emit readable'), t.emit('readable'), y(t);
              }
              function d(t, e) {
                e.readingMore || ((e.readingMore = !0), k(p, t, e));
              }
              function p(t, e) {
                for (
                  var r = e.length;
                  !e.reading &&
                  !e.flowing &&
                  !e.ended &&
                  e.length < e.highWaterMark &&
                  (B('maybeReadMore read 0'), t.read(0), r !== e.length);

                )
                  r = e.length;
                e.readingMore = !1;
              }
              function g(t) {
                return function () {
                  var e = t._readableState;
                  B('pipeOnDrain', e.awaitDrain),
                    e.awaitDrain && e.awaitDrain--,
                    0 === e.awaitDrain &&
                      j(t, 'data') &&
                      ((e.flowing = !0), y(t));
                };
              }
              function _(t) {
                B('readable nexttick read 0'), t.read(0);
              }
              function v(t, e) {
                e.resumeScheduled || ((e.resumeScheduled = !0), k(m, t, e));
              }
              function m(t, e) {
                e.reading || (B('resume read 0'), t.read(0)),
                  (e.resumeScheduled = !1),
                  t.emit('resume'),
                  y(t),
                  e.flowing && !e.reading && t.read(0);
              }
              function y(t) {
                var e = t._readableState;
                if ((B('flow', e.flowing), e.flowing))
                  do {
                    var r = t.read();
                  } while (null !== r && e.flowing);
              }
              function b(t, e) {
                var r,
                  n = e.buffer,
                  i = e.length,
                  o = !!e.decoder,
                  a = !!e.objectMode;
                if (0 === n.length) return null;
                if (0 === i) r = null;
                else if (a) r = n.shift();
                else if (!t || t >= i)
                  (r = o ? n.join('') : 1 === n.length ? n[0] : A.concat(n, i)),
                    (n.length = 0);
                else if (t < n[0].length)
                  (r = (c = n[0]).slice(0, t)), (n[0] = c.slice(t));
                else if (t === n[0].length) r = n.shift();
                else {
                  r = o ? '' : new A(t);
                  for (var s = 0, u = 0, l = n.length; u < l && s < t; u++) {
                    var c = n[0],
                      h = Math.min(t - s, c.length);
                    o ? (r += c.slice(0, h)) : c.copy(r, s, 0, h),
                      h < c.length ? (n[0] = c.slice(h)) : n.shift(),
                      (s += h);
                  }
                }
                return r;
              }
              function w(t) {
                var e = t._readableState;
                if (e.length > 0)
                  throw new Error('endReadable called on non-empty stream');
                e.endEmitted || ((e.ended = !0), k(x, e, t));
              }
              function x(t, e) {
                t.endEmitted ||
                  0 !== t.length ||
                  ((t.endEmitted = !0), (e.readable = !1), e.emit('end'));
              }
              function S(t, e) {
                for (var r = 0, n = t.length; r < n; r++) e(t[r], r);
              }
              function C(t, e) {
                for (var r = 0, n = t.length; r < n; r++)
                  if (t[r] === e) return r;
                return -1;
              }
              e.localExports = i;
              var k = t('process-nextick-args'),
                E = t('isarray'),
                A = t('buffer').Buffer;
              i.ReadableState = n;
              t('events');
              var P,
                j = function (t, e) {
                  return t.listeners(e).length;
                };
              !(function () {
                try {
                  P = t('stream');
                } catch (t) {
                } finally {
                  P || (P = t('events').EventEmitter);
                }
              })();
              var A = t('buffer').Buffer,
                I = t('core-util-is');
              I.inherits = t('inherits');
              var T = t('util'),
                B = void 0;
              B = T && T.debuglog ? T.debuglog('stream') : function () {};
              var L;
              I.inherits(i, P);
              var O;
              (i.prototype.push = function (t, e) {
                var r = this._readableState;
                return (
                  r.objectMode ||
                    'string' != typeof t ||
                    ((e = e || r.defaultEncoding) !== r.encoding &&
                      ((t = new A(t, e)), (e = ''))),
                  o(this, r, t, e, !1)
                );
              }),
                (i.prototype.unshift = function (t) {
                  return o(this, this._readableState, t, '', !0);
                }),
                (i.prototype.isPaused = function () {
                  return !1 === this._readableState.flowing;
                }),
                (i.prototype.setEncoding = function (e) {
                  return (
                    L || (L = t('string_decoder/').StringDecoder),
                    (this._readableState.decoder = new L(e)),
                    (this._readableState.encoding = e),
                    this
                  );
                });
              var N = 8388608;
              (i.prototype.read = function (t) {
                B('read', t);
                var e = this._readableState,
                  r = t;
                if (
                  (('number' != typeof t || t > 0) && (e.emittedReadable = !1),
                  0 === t &&
                    e.needReadable &&
                    (e.length >= e.highWaterMark || e.ended))
                )
                  return (
                    B('read: emitReadable', e.length, e.ended),
                    0 === e.length && e.ended ? w(this) : h(this),
                    null
                  );
                if (0 === (t = u(t, e)) && e.ended)
                  return 0 === e.length && w(this), null;
                var n = e.needReadable;
                B('need readable', n),
                  (0 === e.length || e.length - t < e.highWaterMark) &&
                    B('length less than watermark', (n = !0)),
                  (e.ended || e.reading) && B('reading or ended', (n = !1)),
                  n &&
                    (B('do read'),
                    (e.reading = !0),
                    (e.sync = !0),
                    0 === e.length && (e.needReadable = !0),
                    this._read(e.highWaterMark),
                    (e.sync = !1)),
                  n && !e.reading && (t = u(r, e));
                var i;
                return (
                  null === (i = t > 0 ? b(t, e) : null) &&
                    ((e.needReadable = !0), (t = 0)),
                  (e.length -= t),
                  0 !== e.length || e.ended || (e.needReadable = !0),
                  r !== t && e.ended && 0 === e.length && w(this),
                  null !== i && this.emit('data', i),
                  i
                );
              }),
                (i.prototype._read = function (t) {
                  this.emit('error', new Error('not implemented'));
                }),
                (i.prototype.pipe = function (t, e) {
                  function n(t) {
                    B('onunpipe'), t === h && o();
                  }
                  function i() {
                    B('onend'), t.end();
                  }
                  function o() {
                    B('cleanup'),
                      t.removeListener('close', u),
                      t.removeListener('finish', l),
                      t.removeListener('drain', p),
                      t.removeListener('error', s),
                      t.removeListener('unpipe', n),
                      h.removeListener('end', i),
                      h.removeListener('end', o),
                      h.removeListener('data', a),
                      (_ = !0),
                      !f.awaitDrain ||
                        (t._writableState && !t._writableState.needDrain) ||
                        p();
                  }
                  function a(e) {
                    B('ondata'),
                      !1 === t.write(e) &&
                        (1 !== f.pipesCount ||
                          f.pipes[0] !== t ||
                          1 !== h.listenerCount('data') ||
                          _ ||
                          (B(
                            'false write response, pause',
                            h._readableState.awaitDrain
                          ),
                          h._readableState.awaitDrain++),
                        h.pause());
                  }
                  function s(e) {
                    B('onerror', e),
                      c(),
                      t.removeListener('error', s),
                      0 === j(t, 'error') && t.emit('error', e);
                  }
                  function u() {
                    t.removeListener('finish', l), c();
                  }
                  function l() {
                    B('onfinish'), t.removeListener('close', u), c();
                  }
                  function c() {
                    B('unpipe'), h.unpipe(t);
                  }
                  var h = this,
                    f = this._readableState;
                  switch (f.pipesCount) {
                    case 0:
                      f.pipes = t;
                      break;
                    case 1:
                      f.pipes = [f.pipes, t];
                      break;
                    default:
                      f.pipes.push(t);
                  }
                  (f.pipesCount += 1),
                    B('pipe count=%d opts=%j', f.pipesCount, e);
                  var d =
                    (!e || !1 !== e.end) && t !== r.stdout && t !== r.stderr
                      ? i
                      : o;
                  f.endEmitted ? k(d) : h.once('end', d), t.on('unpipe', n);
                  var p = g(h);
                  t.on('drain', p);
                  var _ = !1;
                  return (
                    h.on('data', a),
                    t._events && t._events.error
                      ? E(t._events.error)
                        ? t._events.error.unshift(s)
                        : (t._events.error = [s, t._events.error])
                      : t.on('error', s),
                    t.once('close', u),
                    t.once('finish', l),
                    t.emit('pipe', h),
                    f.flowing || (B('pipe resume'), h.resume()),
                    t
                  );
                }),
                (i.prototype.unpipe = function (t) {
                  var e = this._readableState;
                  if (0 === e.pipesCount) return this;
                  if (1 === e.pipesCount)
                    return t && t !== e.pipes
                      ? this
                      : (t || (t = e.pipes),
                        (e.pipes = null),
                        (e.pipesCount = 0),
                        (e.flowing = !1),
                        t && t.emit('unpipe', this),
                        this);
                  if (!t) {
                    var r = e.pipes,
                      n = e.pipesCount;
                    (e.pipes = null), (e.pipesCount = 0), (e.flowing = !1);
                    for (var i = 0; i < n; i++) r[i].emit('unpipe', this);
                    return this;
                  }
                  var o = C(e.pipes, t);
                  return -1 === o
                    ? this
                    : (e.pipes.splice(o, 1),
                      (e.pipesCount -= 1),
                      1 === e.pipesCount && (e.pipes = e.pipes[0]),
                      t.emit('unpipe', this),
                      this);
                }),
                (i.prototype.on = function (t, e) {
                  var r = P.prototype.on.call(this, t, e);
                  if (
                    ('data' === t &&
                      !1 !== this._readableState.flowing &&
                      this.resume(),
                    'readable' === t && !this._readableState.endEmitted)
                  ) {
                    var n = this._readableState;
                    n.readableListening ||
                      ((n.readableListening = !0),
                      (n.emittedReadable = !1),
                      (n.needReadable = !0),
                      n.reading ? n.length && h(this) : k(_, this));
                  }
                  return r;
                }),
                (i.prototype.addListener = i.prototype.on),
                (i.prototype.resume = function () {
                  var t = this._readableState;
                  return (
                    t.flowing || (B('resume'), (t.flowing = !0), v(this, t)),
                    this
                  );
                }),
                (i.prototype.pause = function () {
                  return (
                    B('call pause flowing=%j', this._readableState.flowing),
                    !1 !== this._readableState.flowing &&
                      (B('pause'),
                      (this._readableState.flowing = !1),
                      this.emit('pause')),
                    this
                  );
                }),
                (i.prototype.wrap = function (t) {
                  var e = this._readableState,
                    r = !1,
                    n = this;
                  t.on('end', function () {
                    if ((B('wrapped end'), e.decoder && !e.ended)) {
                      var t = e.decoder.end();
                      t && t.length && n.push(t);
                    }
                    n.push(null);
                  }),
                    t.on('data', function (i) {
                      B('wrapped data'),
                        e.decoder && (i = e.decoder.write(i)),
                        (!e.objectMode || (null !== i && void 0 !== i)) &&
                          (e.objectMode || (i && i.length)) &&
                          (n.push(i) || ((r = !0), t.pause()));
                    });
                  for (var i in t)
                    void 0 === this[i] &&
                      'function' == typeof t[i] &&
                      (this[i] = (function (e) {
                        return function () {
                          return t[e].apply(t, arguments);
                        };
                      })(i));
                  return (
                    S(
                      ['error', 'close', 'destroy', 'pause', 'resume'],
                      function (e) {
                        t.on(e, n.emit.bind(n, e));
                      }
                    ),
                    (n._read = function (e) {
                      B('wrapped _read', e), r && ((r = !1), t.resume());
                    }),
                    n
                  );
                }),
                (i._fromList = b);
            }).call(this, t('_process'));
          },
          {
            './_stream_duplex': 190,
            _process: 188,
            buffer: 60,
            'core-util-is': 160,
            events: 164,
            inherits: 167,
            isarray: 169,
            'process-nextick-args': 187,
            'string_decoder/': 217,
            util: 56,
          },
        ],
        193: [
          function (t, e, r) {
            function n(t) {
              (this.afterTransform = function (e, r) {
                return i(t, e, r);
              }),
                (this.needTransform = !1),
                (this.transforming = !1),
                (this.writecb = null),
                (this.writechunk = null),
                (this.writeencoding = null);
            }
            function i(t, e, r) {
              var n = t._transformState;
              n.transforming = !1;
              var i = n.writecb;
              if (!i)
                return t.emit(
                  'error',
                  new Error('no writecb in Transform class')
                );
              (n.writechunk = null),
                (n.writecb = null),
                null !== r && void 0 !== r && t.push(r),
                i(e);
              var o = t._readableState;
              (o.reading = !1),
                (o.needReadable || o.length < o.highWaterMark) &&
                  t._read(o.highWaterMark);
            }
            function o(t) {
              if (!(this instanceof o)) return new o(t);
              s.call(this, t), (this._transformState = new n(this));
              var e = this;
              (this._readableState.needReadable = !0),
                (this._readableState.sync = !1),
                t &&
                  ('function' == typeof t.transform &&
                    (this._transform = t.transform),
                  'function' == typeof t.flush && (this._flush = t.flush)),
                this.once('prefinish', function () {
                  'function' == typeof this._flush
                    ? this._flush(function (t) {
                        a(e, t);
                      })
                    : a(e);
                });
            }
            function a(t, e) {
              if (e) return t.emit('error', e);
              var r = t._writableState,
                n = t._transformState;
              if (r.length)
                throw new Error('calling transform done when ws.length != 0');
              if (n.transforming)
                throw new Error(
                  'calling transform done when still transforming'
                );
              return t.push(null);
            }
            e.localExports = o;
            var s = t('./_stream_duplex'),
              u = t('core-util-is');
            (u.inherits = t('inherits')),
              u.inherits(o, s),
              (o.prototype.push = function (t, e) {
                return (
                  (this._transformState.needTransform = !1),
                  s.prototype.push.call(this, t, e)
                );
              }),
              (o.prototype._transform = function (t, e, r) {
                throw new Error('not implemented');
              }),
              (o.prototype._write = function (t, e, r) {
                var n = this._transformState;
                if (
                  ((n.writecb = r),
                  (n.writechunk = t),
                  (n.writeencoding = e),
                  !n.transforming)
                ) {
                  var i = this._readableState;
                  (n.needTransform ||
                    i.needReadable ||
                    i.length < i.highWaterMark) &&
                    this._read(i.highWaterMark);
                }
              }),
              (o.prototype._read = function (t) {
                var e = this._transformState;
                null !== e.writechunk && e.writecb && !e.transforming
                  ? ((e.transforming = !0),
                    this._transform(
                      e.writechunk,
                      e.writeencoding,
                      e.afterTransform
                    ))
                  : (e.needTransform = !0);
              });
          },
          {
            './_stream_duplex': 190,
            'core-util-is': 160,
            inherits: 167,
          },
        ],
        194: [
          function (t, e, r) {
            (function (r) {
              function n() {}
              function i(t, e, r) {
                (this.chunk = t),
                  (this.encoding = e),
                  (this.callback = r),
                  (this.next = null);
              }
              function o(e, r) {
                (j = j || t('./_stream_duplex')),
                  (e = e || {}),
                  (this.objectMode = !!e.objectMode),
                  r instanceof j &&
                    (this.objectMode =
                      this.objectMode || !!e.writableObjectMode);
                var n = e.highWaterMark,
                  i = this.objectMode ? 16 : 16384;
                (this.highWaterMark = n || 0 === n ? n : i),
                  (this.highWaterMark = ~~this.highWaterMark),
                  (this.needDrain = !1),
                  (this.ending = !1),
                  (this.ended = !1),
                  (this.finished = !1);
                var o = !1 === e.decodeStrings;
                (this.decodeStrings = !o),
                  (this.defaultEncoding = e.defaultEncoding || 'utf8'),
                  (this.length = 0),
                  (this.writing = !1),
                  (this.corked = 0),
                  (this.sync = !0),
                  (this.bufferProcessing = !1),
                  (this.onwrite = function (t) {
                    p(r, t);
                  }),
                  (this.writecb = null),
                  (this.writelen = 0),
                  (this.bufferedRequest = null),
                  (this.lastBufferedRequest = null),
                  (this.pendingcb = 0),
                  (this.prefinished = !1),
                  (this.errorEmitted = !1),
                  (this.bufferedRequestCount = 0),
                  (this.corkedRequestsFree = new x(this)),
                  (this.corkedRequestsFree.next = new x(this));
              }
              function a(e) {
                if (
                  ((j = j || t('./_stream_duplex')),
                  !(this instanceof a || this instanceof j))
                )
                  return new a(e);
                (this._writableState = new o(e, this)),
                  (this.writable = !0),
                  e &&
                    ('function' == typeof e.write && (this._write = e.write),
                    'function' == typeof e.writev && (this._writev = e.writev)),
                  A.call(this);
              }
              function s(t, e) {
                var r = new Error('write after end');
                t.emit('error', r), S(e, r);
              }
              function u(t, e, r, n) {
                var i = !0;
                if (
                  !k.isBuffer(r) &&
                  'string' != typeof r &&
                  null !== r &&
                  void 0 !== r &&
                  !e.objectMode
                ) {
                  var o = new TypeError('Invalid non-string/buffer chunk');
                  t.emit('error', o), S(n, o), (i = !1);
                }
                return i;
              }
              function l(t, e, r) {
                return (
                  t.objectMode ||
                    !1 === t.decodeStrings ||
                    'string' != typeof e ||
                    (e = new k(e, r)),
                  e
                );
              }
              function c(t, e, r, n, o) {
                (r = l(e, r, n)), k.isBuffer(r) && (n = 'buffer');
                var a = e.objectMode ? 1 : r.length;
                e.length += a;
                var s = e.length < e.highWaterMark;
                if ((s || (e.needDrain = !0), e.writing || e.corked)) {
                  var u = e.lastBufferedRequest;
                  (e.lastBufferedRequest = new i(r, n, o)),
                    u
                      ? (u.next = e.lastBufferedRequest)
                      : (e.bufferedRequest = e.lastBufferedRequest),
                    (e.bufferedRequestCount += 1);
                } else h(t, e, !1, a, r, n, o);
                return s;
              }
              function h(t, e, r, n, i, o, a) {
                (e.writelen = n),
                  (e.writecb = a),
                  (e.writing = !0),
                  (e.sync = !0),
                  r ? t._writev(i, e.onwrite) : t._write(i, o, e.onwrite),
                  (e.sync = !1);
              }
              function f(t, e, r, n, i) {
                --e.pendingcb,
                  r ? S(i, n) : i(n),
                  (t._writableState.errorEmitted = !0),
                  t.emit('error', n);
              }
              function d(t) {
                (t.writing = !1),
                  (t.writecb = null),
                  (t.length -= t.writelen),
                  (t.writelen = 0);
              }
              function p(t, e) {
                var r = t._writableState,
                  n = r.sync,
                  i = r.writecb;
                if ((d(r), e)) f(t, r, n, e, i);
                else {
                  var o = m(r);
                  o ||
                    r.corked ||
                    r.bufferProcessing ||
                    !r.bufferedRequest ||
                    v(t, r),
                    n ? C(g, t, r, o, i) : g(t, r, o, i);
                }
              }
              function g(t, e, r, n) {
                r || _(t, e), e.pendingcb--, n(), b(t, e);
              }
              function _(t, e) {
                0 === e.length &&
                  e.needDrain &&
                  ((e.needDrain = !1), t.emit('drain'));
              }
              function v(t, e) {
                e.bufferProcessing = !0;
                var r = e.bufferedRequest;
                if (t._writev && r && r.next) {
                  var n = e.bufferedRequestCount,
                    i = new Array(n),
                    o = e.corkedRequestsFree;
                  o.entry = r;
                  for (var a = 0; r; ) (i[a] = r), (r = r.next), (a += 1);
                  h(t, e, !0, e.length, i, '', o.finish),
                    e.pendingcb++,
                    (e.lastBufferedRequest = null),
                    (e.corkedRequestsFree = o.next),
                    (o.next = null);
                } else {
                  for (; r; ) {
                    var s = r.chunk,
                      u = r.encoding,
                      l = r.callback;
                    if (
                      (h(t, e, !1, e.objectMode ? 1 : s.length, s, u, l),
                      (r = r.next),
                      e.writing)
                    )
                      break;
                  }
                  null === r && (e.lastBufferedRequest = null);
                }
                (e.bufferedRequestCount = 0),
                  (e.bufferedRequest = r),
                  (e.bufferProcessing = !1);
              }
              function m(t) {
                return (
                  t.ending &&
                  0 === t.length &&
                  null === t.bufferedRequest &&
                  !t.finished &&
                  !t.writing
                );
              }
              function y(t, e) {
                e.prefinished || ((e.prefinished = !0), t.emit('prefinish'));
              }
              function b(t, e) {
                var r = m(e);
                return (
                  r &&
                    (0 === e.pendingcb
                      ? (y(t, e), (e.finished = !0), t.emit('finish'))
                      : y(t, e)),
                  r
                );
              }
              function w(t, e, r) {
                (e.ending = !0),
                  b(t, e),
                  r && (e.finished ? S(r) : t.once('finish', r)),
                  (e.ended = !0),
                  (t.writable = !1);
              }
              function x(t) {
                var e = this;
                (this.next = null),
                  (this.entry = null),
                  (this.finish = function (r) {
                    var n = e.entry;
                    for (e.entry = null; n; ) {
                      var i = n.callback;
                      t.pendingcb--, i(r), (n = n.next);
                    }
                    t.corkedRequestsFree
                      ? (t.corkedRequestsFree.next = e)
                      : (t.corkedRequestsFree = e);
                  });
              }
              e.localExports = a;
              var S = t('process-nextick-args'),
                C =
                  !r.browser &&
                  ['v0.10', 'v0.9.'].indexOf(r.version.slice(0, 5)) > -1
                    ? setImmediate
                    : S,
                k = t('buffer').Buffer;
              a.WritableState = o;
              var E = t('core-util-is');
              E.inherits = t('inherits');
              var A,
                P = { deprecate: t('util-deprecate') };
              !(function () {
                try {
                  A = t('stream');
                } catch (t) {
                } finally {
                  A || (A = t('events').EventEmitter);
                }
              })();
              k = t('buffer').Buffer;
              E.inherits(a, A);
              (o.prototype.getBuffer = function () {
                for (var t = this.bufferedRequest, e = []; t; )
                  e.push(t), (t = t.next);
                return e;
              }),
                (function () {
                  try {
                    Object.defineProperty(o.prototype, 'buffer', {
                      get: P.deprecate(function () {
                        return this.getBuffer();
                      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer instead.'),
                    });
                  } catch (t) {}
                })();
              var j;
              (a.prototype.pipe = function () {
                this.emit('error', new Error('Cannot pipe. Not readable.'));
              }),
                (a.prototype.write = function (t, e, r) {
                  var i = this._writableState,
                    o = !1;
                  return (
                    'function' == typeof e && ((r = e), (e = null)),
                    k.isBuffer(t)
                      ? (e = 'buffer')
                      : e || (e = i.defaultEncoding),
                    'function' != typeof r && (r = n),
                    i.ended
                      ? s(this, r)
                      : u(this, i, t, r) &&
                        (i.pendingcb++, (o = c(this, i, t, e, r))),
                    o
                  );
                }),
                (a.prototype.cork = function () {
                  this._writableState.corked++;
                }),
                (a.prototype.uncork = function () {
                  var t = this._writableState;
                  t.corked &&
                    (t.corked--,
                    t.writing ||
                      t.corked ||
                      t.finished ||
                      t.bufferProcessing ||
                      !t.bufferedRequest ||
                      v(this, t));
                }),
                (a.prototype.setDefaultEncoding = function (t) {
                  if (
                    ('string' == typeof t && (t = t.toLowerCase()),
                    !(
                      [
                        'hex',
                        'utf8',
                        'utf-8',
                        'ascii',
                        'binary',
                        'base64',
                        'ucs2',
                        'ucs-2',
                        'utf16le',
                        'utf-16le',
                        'raw',
                      ].indexOf((t + '').toLowerCase()) > -1
                    ))
                  )
                    throw new TypeError('Unknown encoding: ' + t);
                  this._writableState.defaultEncoding = t;
                }),
                (a.prototype._write = function (t, e, r) {
                  r(new Error('not implemented'));
                }),
                (a.prototype._writev = null),
                (a.prototype.end = function (t, e, r) {
                  var n = this._writableState;
                  'function' == typeof t
                    ? ((r = t), (t = null), (e = null))
                    : 'function' == typeof e && ((r = e), (e = null)),
                    null !== t && void 0 !== t && this.write(t, e),
                    n.corked && ((n.corked = 1), this.uncork()),
                    n.ending || n.finished || w(this, n, r);
                });
            }).call(this, t('_process'));
          },
          {
            './_stream_duplex': 190,
            _process: 188,
            buffer: 60,
            'core-util-is': 160,
            events: 164,
            inherits: 167,
            'process-nextick-args': 187,
            'util-deprecate': 222,
          },
        ],
        195: [
          function (t, e, r) {
            e.localExports = t('./lib/_stream_passthrough.js');
          },
          { './lib/_stream_passthrough.js': 191 },
        ],
        196: [
          function (t, e, r) {
            var n = (function () {
              try {
                return t('stream');
              } catch (t) {}
            })();
            ((r = e.localExports = t('./lib/_stream_readable.js')).Stream =
              n || r),
              (r.Readable = r),
              (r.Writable = t('./lib/_stream_writable.js')),
              (r.Duplex = t('./lib/_stream_duplex.js')),
              (r.Transform = t('./lib/_stream_transform.js')),
              (r.PassThrough = t('./lib/_stream_passthrough.js'));
          },
          {
            './lib/_stream_duplex.js': 190,
            './lib/_stream_passthrough.js': 191,
            './lib/_stream_readable.js': 192,
            './lib/_stream_transform.js': 193,
            './lib/_stream_writable.js': 194,
          },
        ],
        197: [
          function (t, e, r) {
            e.localExports = t('./lib/_stream_transform.js');
          },
          { './lib/_stream_transform.js': 193 },
        ],
        198: [
          function (t, e, r) {
            e.localExports = t('./lib/_stream_writable.js');
          },
          { './lib/_stream_writable.js': 194 },
        ],
        199: [
          function (t, e, r) {
            (function () {
              var e, n, i, o;
              (r.EncodeStream = t('./src/EncodeStream')),
                (r.DecodeStream = t('./src/DecodeStream')),
                (r.Array = t('./src/Array')),
                (r.LazyArray = t('./src/LazyArray')),
                (r.Bitfield = t('./src/Bitfield')),
                (r.Boolean = t('./src/Boolean')),
                (r.Buffer = t('./src/Buffer')),
                (r.Enum = t('./src/Enum')),
                (r.Optional = t('./src/Optional')),
                (r.Reserved = t('./src/Reserved')),
                (r.String = t('./src/String')),
                (r.Struct = t('./src/Struct')),
                (r.VersionedStruct = t('./src/VersionedStruct')),
                (i = t('./src/Number'));
              for (e in i) (n = i[e]), (r[e] = n);
              o = t('./src/Pointer');
              for (e in o) (n = o[e]), (r[e] = n);
            }).call(this);
          },
          {
            './src/Array': 200,
            './src/Bitfield': 201,
            './src/Boolean': 202,
            './src/Buffer': 203,
            './src/DecodeStream': 204,
            './src/EncodeStream': 205,
            './src/Enum': 206,
            './src/LazyArray': 207,
            './src/Number': 208,
            './src/Optional': 209,
            './src/Pointer': 210,
            './src/Reserved': 211,
            './src/String': 212,
            './src/Struct': 213,
            './src/VersionedStruct': 214,
          },
        ],
        200: [
          function (t, e, r) {
            (function () {
              var r, n, i;
              (n = t('./Number').Number),
                (i = t('./utils')),
                (r = (function () {
                  function t(t, e, r) {
                    (this.type = t),
                      (this.length = e),
                      (this.lengthType = null != r ? r : 'count');
                  }
                  return (
                    (t.prototype.decode = function (t, e) {
                      var r, o, a, s, u, l;
                      if (
                        ((a = t.pos),
                        (s = []),
                        (r = e),
                        null != this.length &&
                          (o = i.resolveLength(this.length, t, e)),
                        this.length instanceof n &&
                          (Object.defineProperties(s, {
                            parent: {
                              value: e,
                            },
                            _startOffset: {
                              value: a,
                            },
                            _currentOffset: {
                              value: 0,
                              writable: !0,
                            },
                            _length: {
                              value: o,
                            },
                          }),
                          (r = s)),
                        null == o || 'bytes' === this.lengthType)
                      )
                        for (
                          u =
                            null != o
                              ? t.pos + o
                              : (null != e ? e._length : void 0)
                              ? e._startOffset + e._length
                              : t.length;
                          t.pos < u;

                        )
                          s.push(this.type.decode(t, r));
                      else
                        for (l = 0; l < o; l += 1)
                          s.push(this.type.decode(t, r));
                      return s;
                    }),
                    (t.prototype.size = function (t, e) {
                      var r, o, a, s;
                      if (!t)
                        return (
                          this.type.size(null, e) *
                          i.resolveLength(this.length, null, e)
                        );
                      for (
                        o = 0,
                          this.length instanceof n &&
                            ((o += this.length.size()), (e = { parent: e })),
                          a = 0,
                          s = t.length;
                        a < s;
                        a++
                      )
                        (r = t[a]), (o += this.type.size(r, e));
                      return o;
                    }),
                    (t.prototype.encode = function (t, e, r) {
                      var i, o, a, s, u, l;
                      for (
                        i = r,
                          this.length instanceof n &&
                            (((i = {
                              pointers: [],
                              startOffset: t.pos,
                              parent: r,
                            }).pointerOffset = t.pos + this.size(e, i)),
                            this.length.encode(t, e.length)),
                          u = 0,
                          l = e.length;
                        u < l;
                        u++
                      )
                        (a = e[u]), this.type.encode(t, a, i);
                      if (this.length instanceof n)
                        for (o = 0; o < i.pointers.length; )
                          (s = i.pointers[o++]).type.encode(t, s.val);
                    }),
                    t
                  );
                })()),
                (e.localExports = r);
            }).call(this);
          },
          { './Number': 208, './utils': 215 },
        ],
        201: [
          function (t, e, r) {
            (function () {
              var t;
              (t = (function () {
                function t(t, e) {
                  (this.type = t), (this.flags = null != e ? e : []);
                }
                return (
                  (t.prototype.decode = function (t) {
                    var e, r, n, i, o, a, s;
                    for (
                      i = this.type.decode(t),
                        n = {},
                        r = o = 0,
                        a = (s = this.flags).length;
                      o < a;
                      r = ++o
                    )
                      null != (e = s[r]) && (n[e] = !!(i & (1 << r)));
                    return n;
                  }),
                  (t.prototype.size = function () {
                    return this.type.size();
                  }),
                  (t.prototype.encode = function (t, e) {
                    var r, n, i, o, a, s;
                    for (
                      i = 0, n = o = 0, a = (s = this.flags).length;
                      o < a;
                      n = ++o
                    )
                      null != (r = s[n]) && e[r] && (i |= 1 << n);
                    return this.type.encode(t, i);
                  }),
                  t
                );
              })()),
                (e.localExports = t);
            }).call(this);
          },
          {},
        ],
        202: [
          function (t, e, r) {
            (function () {
              var t;
              (t = (function () {
                function t(t) {
                  this.type = t;
                }
                return (
                  (t.prototype.decode = function (t, e) {
                    return !!this.type.decode(t, e);
                  }),
                  (t.prototype.size = function (t, e) {
                    return this.type.size(t, e);
                  }),
                  (t.prototype.encode = function (t, e, r) {
                    return this.type.encode(t, +e, r);
                  }),
                  t
                );
              })()),
                (e.localExports = t);
            }).call(this);
          },
          {},
        ],
        203: [
          function (t, e, r) {
            (function () {
              var r, n, i;
              (i = t('./utils')),
                (n = t('./Number').Number),
                (r = (function () {
                  function t(t) {
                    this.length = t;
                  }
                  return (
                    (t.prototype.decode = function (t, e) {
                      var r;
                      return (
                        (r = i.resolveLength(this.length, t, e)),
                        t.readBuffer(r)
                      );
                    }),
                    (t.prototype.size = function (t, e) {
                      return t
                        ? t.length
                        : i.resolveLength(this.length, null, e);
                    }),
                    (t.prototype.encode = function (t, e, r) {
                      return (
                        this.length instanceof n &&
                          this.length.encode(t, e.length),
                        t.writeBuffer(e)
                      );
                    }),
                    t
                  );
                })()),
                (e.localExports = r);
            }).call(this);
          },
          { './Number': 208, './utils': 215 },
        ],
        204: [
          function (t, e, r) {
            (function (t) {
              (function () {
                var r, n;
                try {
                  n = (function () {
                    throw new Error(
                      "Cannot find module 'iconv-lite' from '/Users/devongovett/projects/PDFKit/node_modules/restructure/src'"
                    );
                  })();
                } catch (t) {}
                (r = (function () {
                  function e(t) {
                    (this.buffer = t),
                      (this.pos = 0),
                      (this.length = this.buffer.length);
                  }
                  var r;
                  e.TYPES = {
                    UInt8: 1,
                    UInt16: 2,
                    UInt24: 3,
                    UInt32: 4,
                    Int8: 1,
                    Int16: 2,
                    Int24: 3,
                    Int32: 4,
                    Float: 4,
                    Double: 8,
                  };
                  for (r in t.prototype)
                    'read' === r.slice(0, 4) &&
                      (function (t) {
                        var r;
                        (r = e.TYPES[t.replace(/read|[BL]E/g, '')]),
                          (e.prototype[t] = function () {
                            var e;
                            return (
                              (e = this.buffer[t](this.pos)), (this.pos += r), e
                            );
                          });
                      })(r);
                  return (
                    (e.prototype.readString = function (e, r) {
                      var i, o, a, s, u;
                      switch ((null == r && (r = 'ascii'), r)) {
                        case 'utf16le':
                        case 'ucs2':
                        case 'utf8':
                        case 'ascii':
                          return this.buffer.toString(
                            r,
                            this.pos,
                            (this.pos += e)
                          );
                        case 'utf16be':
                          for (
                            a = s = 0,
                              u = (i = new t(this.readBuffer(e))).length - 1;
                            s < u;
                            a = s += 2
                          )
                            (o = i[a]), (i[a] = i[a + 1]), (i[a + 1] = o);
                          return i.toString('utf16le');
                        default:
                          return (
                            (i = this.readBuffer(e)), n ? n.decode(i, r) : i
                          );
                      }
                    }),
                    (e.prototype.readBuffer = function (t) {
                      return this.buffer.slice(this.pos, (this.pos += t));
                    }),
                    (e.prototype.readUInt24BE = function () {
                      return (this.readUInt16BE() << 8) + this.readUInt8();
                    }),
                    (e.prototype.readUInt24LE = function () {
                      return this.readUInt16LE() + (this.readUInt8() << 16);
                    }),
                    (e.prototype.readInt24BE = function () {
                      return (this.readInt16BE() << 8) + this.readUInt8();
                    }),
                    (e.prototype.readInt24LE = function () {
                      return this.readUInt16LE() + (this.readInt8() << 16);
                    }),
                    e
                  );
                })()),
                  (e.localExports = r);
              }).call(this);
            }).call(this, t('buffer').Buffer);
          },
          { buffer: 60 },
        ],
        205: [
          function (t, e, r) {
            (function (r) {
              (function () {
                var n,
                  i,
                  o,
                  a,
                  s = {}.hasOwnProperty,
                  u = function (t, e) {
                    function r() {
                      this.constructor = t;
                    }
                    for (var n in e) s.call(e, n) && (t[n] = e[n]);
                    return (
                      (r.prototype = e.prototype),
                      (t.prototype = new r()),
                      (t.__super__ = e.prototype),
                      t
                    );
                  };
                (a = t('stream')), (n = t('./DecodeStream'));
                try {
                  o = (function () {
                    throw new Error(
                      "Cannot find module 'iconv-lite' from '/Users/devongovett/projects/PDFKit/node_modules/restructure/src'"
                    );
                  })();
                } catch (t) {}
                (i = (function (t) {
                  function e() {
                    e.__super__.constructor.apply(this, arguments),
                      (this.pos = 0);
                  }
                  var i;
                  u(e, t);
                  for (i in r.prototype)
                    'write' === i.slice(0, 5) &&
                      (function (t) {
                        var i;
                        (i = n.TYPES[t.replace(/write|[BL]E/g, '')]),
                          (e.prototype[t] = function (e) {
                            var n;
                            return (
                              (n = new r(+i))[t](e, 0), this.writeBuffer(n)
                            );
                          });
                      })(i);
                  return (
                    (e.prototype._read = function () {}),
                    (e.prototype.writeBuffer = function (t) {
                      return this.push(t), (this.pos += t.length);
                    }),
                    (e.prototype.writeString = function (t, e) {
                      var n, i, a, s, u;
                      switch ((null == e && (e = 'ascii'), e)) {
                        case 'utf16le':
                        case 'ucs2':
                        case 'utf8':
                        case 'ascii':
                          return this.writeBuffer(new r(t, e));
                        case 'utf16be':
                          for (
                            a = s = 0, u = (n = new r(t, 'utf16le')).length - 1;
                            s < u;
                            a = s += 2
                          )
                            (i = n[a]), (n[a] = n[a + 1]), (n[a + 1] = i);
                          return this.writeBuffer(n);
                        default:
                          if (o) return this.writeBuffer(o.encode(t, e));
                          throw new Error(
                            'Install iconv-lite to enable additional string encodings.'
                          );
                      }
                    }),
                    (e.prototype.writeUInt24BE = function (t) {
                      var e;
                      return (
                        (e = new r(3)),
                        (e[0] = (t >>> 16) & 255),
                        (e[1] = (t >>> 8) & 255),
                        (e[2] = 255 & t),
                        this.writeBuffer(e)
                      );
                    }),
                    (e.prototype.writeUInt24LE = function (t) {
                      var e;
                      return (
                        (e = new r(3)),
                        (e[0] = 255 & t),
                        (e[1] = (t >>> 8) & 255),
                        (e[2] = (t >>> 16) & 255),
                        this.writeBuffer(e)
                      );
                    }),
                    (e.prototype.writeInt24BE = function (t) {
                      return t >= 0
                        ? this.writeUInt24BE(t)
                        : this.writeUInt24BE(t + 16777215 + 1);
                    }),
                    (e.prototype.writeInt24LE = function (t) {
                      return t >= 0
                        ? this.writeUInt24LE(t)
                        : this.writeUInt24LE(t + 16777215 + 1);
                    }),
                    (e.prototype.fill = function (t, e) {
                      var n;
                      return (n = new r(e)).fill(t), this.writeBuffer(n);
                    }),
                    (e.prototype.end = function () {
                      return this.push(null);
                    }),
                    e
                  );
                })(a.Readable)),
                  (e.localExports = i);
              }).call(this);
            }).call(this, t('buffer').Buffer);
          },
          { './DecodeStream': 204, buffer: 60, stream: 216 },
        ],
        206: [
          function (t, e, r) {
            (function () {
              var t;
              (t = (function () {
                function t(t, e) {
                  (this.type = t), (this.options = null != e ? e : []);
                }
                return (
                  (t.prototype.decode = function (t) {
                    var e;
                    return (e = this.type.decode(t)), this.options[e] || e;
                  }),
                  (t.prototype.size = function () {
                    return this.type.size();
                  }),
                  (t.prototype.encode = function (t, e) {
                    var r;
                    if (-1 === (r = this.options.indexOf(e)))
                      throw new Error('Unknown option in enum: ' + e);
                    return this.type.encode(t, r);
                  }),
                  t
                );
              })()),
                (e.localExports = t);
            }).call(this);
          },
          {},
        ],
        207: [
          function (t, e, r) {
            (function () {
              var r,
                n,
                i,
                o,
                a,
                s,
                u = {}.hasOwnProperty,
                l = function (t, e) {
                  function r() {
                    this.constructor = t;
                  }
                  for (var n in e) u.call(e, n) && (t[n] = e[n]);
                  return (
                    (r.prototype = e.prototype),
                    (t.prototype = new r()),
                    (t.__super__ = e.prototype),
                    t
                  );
                };
              (r = t('./Array')),
                (o = t('./Number').Number),
                (s = t('./utils')),
                (a = t('util').inspect),
                (i = (function (t) {
                  function e() {
                    return e.__super__.constructor.apply(this, arguments);
                  }
                  return (
                    l(e, r),
                    (e.prototype.decode = function (t, e) {
                      var r, i, a;
                      return (
                        (i = t.pos),
                        (r = s.resolveLength(this.length, t, e)),
                        this.length instanceof o &&
                          (e = {
                            parent: e,
                            _startOffset: i,
                            _currentOffset: 0,
                            _length: r,
                          }),
                        (a = new n(this.type, r, t, e)),
                        (t.pos += r * this.type.size(null, e)),
                        a
                      );
                    }),
                    (e.prototype.size = function (t, r) {
                      return (
                        t instanceof n && (t = t.toArray()),
                        e.__super__.size.call(this, t, r)
                      );
                    }),
                    (e.prototype.encode = function (t, r, i) {
                      return (
                        r instanceof n && (r = r.toArray()),
                        e.__super__.encode.call(this, t, r, i)
                      );
                    }),
                    e
                  );
                })()),
                (n = (function () {
                  function t(t, e, r, n) {
                    (this.type = t),
                      (this.length = e),
                      (this.stream = r),
                      (this.ctx = n),
                      (this.base = this.stream.pos),
                      (this.items = []);
                  }
                  return (
                    (t.prototype.get = function (t) {
                      var e;
                      if (!(t < 0 || t >= this.length))
                        return (
                          null == this.items[t] &&
                            ((e = this.stream.pos),
                            (this.stream.pos =
                              this.base + this.type.size(null, this.ctx) * t),
                            (this.items[t] = this.type.decode(
                              this.stream,
                              this.ctx
                            )),
                            (this.stream.pos = e)),
                          this.items[t]
                        );
                    }),
                    (t.prototype.toArray = function () {
                      var t, e, r, n;
                      for (
                        n = [], t = e = 0, r = this.length;
                        e < r;
                        t = e += 1
                      )
                        n.push(this.get(t));
                      return n;
                    }),
                    (t.prototype.inspect = function () {
                      return a(this.toArray());
                    }),
                    t
                  );
                })()),
                (e.localExports = i);
            }).call(this);
          },
          {
            './Array': 200,
            './Number': 208,
            './utils': 215,
            util: 224,
          },
        ],
        208: [
          function (t, e, r) {
            (function () {
              var e,
                n,
                i,
                o = {}.hasOwnProperty,
                a = function (t, e) {
                  function r() {
                    this.constructor = t;
                  }
                  for (var n in e) o.call(e, n) && (t[n] = e[n]);
                  return (
                    (r.prototype = e.prototype),
                    (t.prototype = new r()),
                    (t.__super__ = e.prototype),
                    t
                  );
                };
              (e = t('./DecodeStream')),
                (i = (function () {
                  function t(t, e) {
                    (this.type = t),
                      (this.endian = null != e ? e : 'BE'),
                      (this.fn = this.type),
                      '8' !== this.type[this.type.length - 1] &&
                        (this.fn += this.endian);
                  }
                  return (
                    (t.prototype.size = function () {
                      return e.TYPES[this.type];
                    }),
                    (t.prototype.decode = function (t) {
                      return t['read' + this.fn]();
                    }),
                    (t.prototype.encode = function (t, e) {
                      return t['write' + this.fn](e);
                    }),
                    t
                  );
                })()),
                (r.Number = i),
                (r.uint8 = new i('UInt8')),
                (r.uint16be = r.uint16 = new i('UInt16', 'BE')),
                (r.uint16le = new i('UInt16', 'LE')),
                (r.uint24be = r.uint24 = new i('UInt24', 'BE')),
                (r.uint24le = new i('UInt24', 'LE')),
                (r.uint32be = r.uint32 = new i('UInt32', 'BE')),
                (r.uint32le = new i('UInt32', 'LE')),
                (r.int8 = new i('Int8')),
                (r.int16be = r.int16 = new i('Int16', 'BE')),
                (r.int16le = new i('Int16', 'LE')),
                (r.int24be = r.int24 = new i('Int24', 'BE')),
                (r.int24le = new i('Int24', 'LE')),
                (r.int32be = r.int32 = new i('Int32', 'BE')),
                (r.int32le = new i('Int32', 'LE')),
                (r.floatbe = r.float = new i('Float', 'BE')),
                (r.floatle = new i('Float', 'LE')),
                (r.doublebe = r.double = new i('Double', 'BE')),
                (r.doublele = new i('Double', 'LE')),
                (n = (function (t) {
                  function e(t, r, n) {
                    null == n && (n = t >> 1),
                      e.__super__.constructor.call(this, 'Int' + t, r),
                      (this._point = 1 << n);
                  }
                  return (
                    a(e, i),
                    (e.prototype.decode = function (t) {
                      return e.__super__.decode.call(this, t) / this._point;
                    }),
                    (e.prototype.encode = function (t, r) {
                      return e.__super__.encode.call(
                        this,
                        t,
                        (r * this._point) | 0
                      );
                    }),
                    e
                  );
                })()),
                (r.Fixed = n),
                (r.fixed16be = r.fixed16 = new n(16, 'BE')),
                (r.fixed16le = new n(16, 'LE')),
                (r.fixed32be = r.fixed32 = new n(32, 'BE')),
                (r.fixed32le = new n(32, 'LE'));
            }).call(this);
          },
          { './DecodeStream': 204 },
        ],
        209: [
          function (t, e, r) {
            (function () {
              var t;
              (t = (function () {
                function t(t, e) {
                  (this.type = t), (this.condition = null == e || e);
                }
                return (
                  (t.prototype.decode = function (t, e) {
                    var r;
                    if (
                      ('function' == typeof (r = this.condition) &&
                        (r = r.call(e, e)),
                      r)
                    )
                      return this.type.decode(t, e);
                  }),
                  (t.prototype.size = function (t, e) {
                    var r;
                    return (
                      'function' == typeof (r = this.condition) &&
                        (r = r.call(e, e)),
                      r ? this.type.size(t, e) : 0
                    );
                  }),
                  (t.prototype.encode = function (t, e, r) {
                    var n;
                    if (
                      ('function' == typeof (n = this.condition) &&
                        (n = n.call(r, r)),
                      n)
                    )
                      return this.type.encode(t, e, r);
                  }),
                  t
                );
              })()),
                (e.localExports = t);
            }).call(this);
          },
          {},
        ],
        210: [
          function (t, e, r) {
            (function () {
              var e, n, i;
              (i = t('./utils')),
                (e = (function () {
                  function t(t, e, r) {
                    var n, i, o, a;
                    (this.offsetType = t),
                      (this.type = e),
                      (this.options = null != r ? r : {}),
                      'void' === this.type && (this.type = null),
                      null == (n = this.options).type && (n.type = 'local'),
                      null == (i = this.options).allowNull &&
                        (i.allowNull = !0),
                      null == (o = this.options).nullValue && (o.nullValue = 0),
                      null == (a = this.options).lazy && (a.lazy = !1),
                      this.options.relativeTo &&
                        (this.relativeToGetter = new Function(
                          'ctx',
                          'return ctx.' + this.options.relativeTo
                        ));
                  }
                  return (
                    (t.prototype.decode = function (t, e) {
                      var r, n, o, a, s, u;
                      return (o = this.offsetType.decode(t)) ===
                        this.options.nullValue && this.options.allowNull
                        ? null
                        : ((s = function () {
                            switch (this.options.type) {
                              case 'local':
                                return e._startOffset;
                              case 'immediate':
                                return t.pos - this.offsetType.size();
                              case 'parent':
                                return e.parent._startOffset;
                              default:
                                for (r = e; r.parent; ) r = r.parent;
                                return r._startOffset || 0;
                            }
                          }.call(this)),
                          this.options.relativeTo &&
                            (s += this.relativeToGetter(e)),
                          (a = o + s),
                          null != this.type
                            ? ((u = null),
                              (n = (function (r) {
                                return function () {
                                  var n;
                                  return null != u
                                    ? u
                                    : ((n = t.pos),
                                      (t.pos = a),
                                      (u = r.type.decode(t, e)),
                                      (t.pos = n),
                                      u);
                                };
                              })(this)),
                              this.options.lazy
                                ? new i.PropertyDescriptor({ get: n })
                                : n())
                            : a);
                    }),
                    (t.prototype.size = function (t, e) {
                      var r, i;
                      switch (((r = e), this.options.type)) {
                        case 'local':
                        case 'immediate':
                          break;
                        case 'parent':
                          e = e.parent;
                          break;
                        default:
                          for (; e.parent; ) e = e.parent;
                      }
                      if (null == (i = this.type)) {
                        if (!(t instanceof n))
                          throw new Error('Must be a VoidPointer');
                        (i = t.type), (t = t.value);
                      }
                      return (
                        t && e && (e.pointerSize += i.size(t, r)),
                        this.offsetType.size()
                      );
                    }),
                    (t.prototype.encode = function (t, e, r) {
                      var i, o, a;
                      i = r;
                      if (null != e) {
                        switch (this.options.type) {
                          case 'local':
                            o = r.startOffset;
                            break;
                          case 'immediate':
                            o = t.pos + this.offsetType.size(e, i);
                            break;
                          case 'parent':
                            o = (r = r.parent).startOffset;
                            break;
                          default:
                            for (o = 0; r.parent; ) r = r.parent;
                        }
                        if (
                          (this.options.relativeTo &&
                            (o += this.relativeToGetter(i.val)),
                          this.offsetType.encode(t, r.pointerOffset - o),
                          null == (a = this.type))
                        ) {
                          if (!(e instanceof n))
                            throw new Error('Must be a VoidPointer');
                          (a = e.type), (e = e.value);
                        }
                        return (
                          r.pointers.push({
                            type: a,
                            val: e,
                            parent: i,
                          }),
                          (r.pointerOffset += a.size(e, i))
                        );
                      }
                      this.offsetType.encode(t, this.options.nullValue);
                    }),
                    t
                  );
                })()),
                (n = (function () {
                  return function (t, e) {
                    (this.type = t), (this.value = e);
                  };
                })()),
                (r.Pointer = e),
                (r.VoidPointer = n);
            }).call(this);
          },
          { './utils': 215 },
        ],
        211: [
          function (t, e, r) {
            (function () {
              var r, n;
              (n = t('./utils')),
                (r = (function () {
                  function t(t, e) {
                    (this.type = t), (this.count = null != e ? e : 1);
                  }
                  return (
                    (t.prototype.decode = function (t, e) {
                      t.pos += this.size(null, e);
                    }),
                    (t.prototype.size = function (t, e) {
                      var r;
                      return (
                        (r = n.resolveLength(this.count, null, e)),
                        this.type.size() * r
                      );
                    }),
                    (t.prototype.encode = function (t, e, r) {
                      return t.fill(0, this.size(e, r));
                    }),
                    t
                  );
                })()),
                (e.localExports = r);
            }).call(this);
          },
          { './utils': 215 },
        ],
        212: [
          function (t, e, r) {
            (function (r) {
              (function () {
                var n, i, o;
                (n = t('./Number').Number),
                  (o = t('./utils')),
                  (i = (function () {
                    function t(t, e) {
                      (this.length = t),
                        (this.encoding = null != e ? e : 'ascii');
                    }
                    return (
                      (t.prototype.decode = function (t, e) {
                        var r, n, i, a, s;
                        return (
                          (i = function () {
                            if (null != this.length)
                              return o.resolveLength(this.length, t, e);
                            for (
                              r = t.buffer, i = t.length, a = t.pos;
                              a < i && 0 !== r[a];

                            )
                              ++a;
                            return a - t.pos;
                          }.call(this)),
                          'function' == typeof (n = this.encoding) &&
                            (n = n.call(e, e) || 'ascii'),
                          (s = t.readString(i, n)),
                          null == this.length && t.pos < t.length && t.pos++,
                          s
                        );
                      }),
                      (t.prototype.size = function (t, e) {
                        var i, a;
                        return t
                          ? ('function' == typeof (i = this.encoding) &&
                              (i =
                                i.call(
                                  null != e ? e.val : void 0,
                                  null != e ? e.val : void 0
                                ) || 'ascii'),
                            'utf16be' === i && (i = 'utf16le'),
                            (a = r.byteLength(t, i)),
                            this.length instanceof n &&
                              (a += this.length.size()),
                            null == this.length && a++,
                            a)
                          : o.resolveLength(this.length, null, e);
                      }),
                      (t.prototype.encode = function (t, e, i) {
                        var o;
                        if (
                          ('function' == typeof (o = this.encoding) &&
                            (o =
                              o.call(
                                null != i ? i.val : void 0,
                                null != i ? i.val : void 0
                              ) || 'ascii'),
                          this.length instanceof n &&
                            this.length.encode(t, r.byteLength(e, o)),
                          t.writeString(e, o),
                          null == this.length)
                        )
                          return t.writeUInt8(0);
                      }),
                      t
                    );
                  })()),
                  (e.localExports = i);
              }).call(this);
            }).call(this, t('buffer').Buffer);
          },
          { './Number': 208, './utils': 215, buffer: 60 },
        ],
        213: [
          function (t, e, r) {
            (function () {
              var r, n;
              (n = t('./utils')),
                (r = (function () {
                  function t(t) {
                    this.fields = null != t ? t : {};
                  }
                  return (
                    (t.prototype.decode = function (t, e, r) {
                      var n, i;
                      return (
                        null == r && (r = 0),
                        (n = this._setup(t, e, r)),
                        this._parseFields(t, n, this.fields),
                        null != (i = this.process) && i.call(n, t),
                        n
                      );
                    }),
                    (t.prototype._setup = function (t, e, r) {
                      var n;
                      return (
                        (n = {}),
                        Object.defineProperties(n, {
                          parent: { value: e },
                          _startOffset: {
                            value: t.pos,
                          },
                          _currentOffset: {
                            value: 0,
                            writable: !0,
                          },
                          _length: { value: r },
                        }),
                        n
                      );
                    }),
                    (t.prototype._parseFields = function (t, e, r) {
                      var i, o, a;
                      for (i in r)
                        void 0 !==
                          (a =
                            'function' == typeof (o = r[i])
                              ? o.call(e, e)
                              : o.decode(t, e)) &&
                          (a instanceof n.PropertyDescriptor
                            ? Object.defineProperty(e, i, a)
                            : (e[i] = a)),
                          (e._currentOffset = t.pos - e._startOffset);
                    }),
                    (t.prototype.size = function (t, e, r) {
                      var n, i, o, a, s;
                      null == t && (t = {}),
                        null == r && (r = !0),
                        (n = {
                          parent: e,
                          val: t,
                          pointerSize: 0,
                        }),
                        (o = 0),
                        (s = this.fields);
                      for (i in s)
                        null != (a = s[i]).size && (o += a.size(t[i], n));
                      return r && (o += n.pointerSize), o;
                    }),
                    (t.prototype.encode = function (t, e, r) {
                      var n, i, o, a, s, u, l;
                      null != (u = this.preEncode) && u.call(e, t),
                        ((n = {
                          pointers: [],
                          startOffset: t.pos,
                          parent: r,
                          val: e,
                          pointerSize: 0,
                        }).pointerOffset = t.pos + this.size(e, n, !1)),
                        (l = this.fields);
                      for (o in l)
                        null != (s = l[o]).encode && s.encode(t, e[o], n);
                      for (i = 0; i < n.pointers.length; )
                        (a = n.pointers[i++]).type.encode(t, a.val, a.parent);
                    }),
                    t
                  );
                })()),
                (e.localExports = r);
            }).call(this);
          },
          { './utils': 215 },
        ],
        214: [
          function (t, e, r) {
            (function () {
              var r,
                n,
                i = {}.hasOwnProperty,
                o = function (t, e) {
                  function r() {
                    this.constructor = t;
                  }
                  for (var n in e) i.call(e, n) && (t[n] = e[n]);
                  return (
                    (r.prototype = e.prototype),
                    (t.prototype = new r()),
                    (t.__super__ = e.prototype),
                    t
                  );
                };
              (r = t('./Struct')),
                (n = (function (t) {
                  function e(t, e) {
                    (this.type = t),
                      (this.versions = null != e ? e : {}),
                      'string' == typeof this.type &&
                        ((this.versionGetter = new Function(
                          'parent',
                          'return parent.' + this.type
                        )),
                        (this.versionSetter = new Function(
                          'parent',
                          'version',
                          'return parent.' + this.type + ' = version'
                        )));
                  }
                  return (
                    o(e, r),
                    (e.prototype.decode = function (t, r, n) {
                      var i, o, a;
                      if (
                        (null == n && (n = 0),
                        (o = this._setup(t, r, n)),
                        'string' == typeof this.type
                          ? (o.version = this.versionGetter(r))
                          : (o.version = this.type.decode(t)),
                        this.versions.header &&
                          this._parseFields(t, o, this.versions.header),
                        null == (i = this.versions[o.version]))
                      )
                        throw new Error('Unknown version ' + o.version);
                      return i instanceof e
                        ? i.decode(t, r)
                        : (this._parseFields(t, o, i),
                          null != (a = this.process) && a.call(o, t),
                          o);
                    }),
                    (e.prototype.size = function (t, e, r) {
                      var n, i, o, a, s, u;
                      if ((null == r && (r = !0), !t))
                        throw new Error('Not a fixed size');
                      if (
                        ((n = {
                          parent: e,
                          val: t,
                          pointerSize: 0,
                        }),
                        (a = 0),
                        'string' != typeof this.type &&
                          (a += this.type.size(t.version, n)),
                        this.versions.header)
                      ) {
                        u = this.versions.header;
                        for (o in u)
                          null != (s = u[o]).size && (a += s.size(t[o], n));
                      }
                      if (null == (i = this.versions[t.version]))
                        throw new Error('Unknown version ' + t.version);
                      for (o in i)
                        null != (s = i[o]).size && (a += s.size(t[o], n));
                      return r && (a += n.pointerSize), a;
                    }),
                    (e.prototype.encode = function (t, e, r) {
                      var n, i, o, a, s, u, l, c;
                      if (
                        (null != (l = this.preEncode) && l.call(e, t),
                        (n = {
                          pointers: [],
                          startOffset: t.pos,
                          parent: r,
                          val: e,
                          pointerSize: 0,
                        }),
                        (n.pointerOffset = t.pos + this.size(e, n, !1)),
                        'string' != typeof this.type &&
                          this.type.encode(t, e.version),
                        this.versions.header)
                      ) {
                        c = this.versions.header;
                        for (a in c)
                          null != (u = c[a]).encode && u.encode(t, e[a], n);
                      }
                      i = this.versions[e.version];
                      for (a in i)
                        null != (u = i[a]).encode && u.encode(t, e[a], n);
                      for (o = 0; o < n.pointers.length; )
                        (s = n.pointers[o++]).type.encode(t, s.val, s.parent);
                    }),
                    e
                  );
                })()),
                (e.localExports = n);
            }).call(this);
          },
          { './Struct': 213 },
        ],
        215: [
          function (t, e, r) {
            (function () {
              var e, n;
              (e = t('./Number').Number),
                (r.resolveLength = function (t, r, n) {
                  var i;
                  if (
                    ('number' == typeof t
                      ? (i = t)
                      : 'function' == typeof t
                      ? (i = t.call(n, n))
                      : n && 'string' == typeof t
                      ? (i = n[t])
                      : r && t instanceof e && (i = t.decode(r)),
                    isNaN(i))
                  )
                    throw new Error('Not a fixed size');
                  return i;
                }),
                (n = (function () {
                  return function (t) {
                    var e, r;
                    null == t && (t = {}),
                      (this.enumerable = !0),
                      (this.configurable = !0);
                    for (e in t) (r = t[e]), (this[e] = r);
                  };
                })()),
                (r.PropertyDescriptor = n);
            }).call(this);
          },
          { './Number': 208 },
        ],
        216: [
          function (t, e, r) {
            function n() {
              i.call(this);
            }
            e.localExports = n;
            var i = t('events').EventEmitter;
            t('inherits')(n, i),
              (n.Readable = t('readable-stream/readable.js')),
              (n.Writable = t('readable-stream/writable.js')),
              (n.Duplex = t('readable-stream/duplex.js')),
              (n.Transform = t('readable-stream/transform.js')),
              (n.PassThrough = t('readable-stream/passthrough.js')),
              (n.Stream = n),
              (n.prototype.pipe = function (t, e) {
                function r(e) {
                  t.writable && !1 === t.write(e) && l.pause && l.pause();
                }
                function n() {
                  l.readable && l.resume && l.resume();
                }
                function o() {
                  c || ((c = !0), t.end());
                }
                function a() {
                  c ||
                    ((c = !0), 'function' == typeof t.destroy && t.destroy());
                }
                function s(t) {
                  if ((u(), 0 === i.listenerCount(this, 'error'))) throw t;
                }
                function u() {
                  l.removeListener('data', r),
                    t.removeListener('drain', n),
                    l.removeListener('end', o),
                    l.removeListener('close', a),
                    l.removeListener('error', s),
                    t.removeListener('error', s),
                    l.removeListener('end', u),
                    l.removeListener('close', u),
                    t.removeListener('close', u);
                }
                var l = this;
                l.on('data', r),
                  t.on('drain', n),
                  t._isStdio ||
                    (e && !1 === e.end) ||
                    (l.on('end', o), l.on('close', a));
                var c = !1;
                return (
                  l.on('error', s),
                  t.on('error', s),
                  l.on('end', u),
                  l.on('close', u),
                  t.on('close', u),
                  t.emit('pipe', l),
                  t
                );
              });
          },
          {
            events: 164,
            inherits: 167,
            'readable-stream/duplex.js': 189,
            'readable-stream/passthrough.js': 195,
            'readable-stream/readable.js': 196,
            'readable-stream/transform.js': 197,
            'readable-stream/writable.js': 198,
          },
        ],
        217: [
          function (t, e, r) {
            function n(t) {
              if (t && !u(t)) throw new Error('Unknown encoding: ' + t);
            }
            function i(t) {
              return t.toString(this.encoding);
            }
            function o(t) {
              (this.charReceived = t.length % 2),
                (this.charLength = this.charReceived ? 2 : 0);
            }
            function a(t) {
              (this.charReceived = t.length % 3),
                (this.charLength = this.charReceived ? 3 : 0);
            }
            var s = t('buffer').Buffer,
              u =
                s.isEncoding ||
                function (t) {
                  switch (t && t.toLowerCase()) {
                    case 'hex':
                    case 'utf8':
                    case 'utf-8':
                    case 'ascii':
                    case 'binary':
                    case 'base64':
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                    case 'raw':
                      return !0;
                    default:
                      return !1;
                  }
                },
              l = (r.StringDecoder = function (t) {
                switch (
                  ((this.encoding = (t || 'utf8')
                    .toLowerCase()
                    .replace(/[-_]/, '')),
                  n(t),
                  this.encoding)
                ) {
                  case 'utf8':
                    this.surrogateSize = 3;
                    break;
                  case 'ucs2':
                  case 'utf16le':
                    (this.surrogateSize = 2), (this.detectIncompleteChar = o);
                    break;
                  case 'base64':
                    (this.surrogateSize = 3), (this.detectIncompleteChar = a);
                    break;
                  default:
                    return void (this.write = i);
                }
                (this.charBuffer = new s(6)),
                  (this.charReceived = 0),
                  (this.charLength = 0);
              });
            (l.prototype.write = function (t) {
              for (var e = ''; this.charLength; ) {
                var r =
                  t.length >= this.charLength - this.charReceived
                    ? this.charLength - this.charReceived
                    : t.length;
                if (
                  (t.copy(this.charBuffer, this.charReceived, 0, r),
                  (this.charReceived += r),
                  this.charReceived < this.charLength)
                )
                  return '';
                if (
                  ((t = t.slice(r, t.length)),
                  !(
                    (i = (e = this.charBuffer
                      .slice(0, this.charLength)
                      .toString(this.encoding)).charCodeAt(e.length - 1)) >=
                      55296 && i <= 56319
                  ))
                ) {
                  if (
                    ((this.charReceived = this.charLength = 0), 0 === t.length)
                  )
                    return e;
                  break;
                }
                (this.charLength += this.surrogateSize), (e = '');
              }
              this.detectIncompleteChar(t);
              n = t.length;
              this.charLength &&
                (t.copy(this.charBuffer, 0, t.length - this.charReceived, n),
                (n -= this.charReceived));
              var n = (e += t.toString(this.encoding, 0, n)).length - 1,
                i = e.charCodeAt(n);
              if (i >= 55296 && i <= 56319) {
                var o = this.surrogateSize;
                return (
                  (this.charLength += o),
                  (this.charReceived += o),
                  this.charBuffer.copy(this.charBuffer, o, 0, o),
                  t.copy(this.charBuffer, 0, 0, o),
                  e.substring(0, n)
                );
              }
              return e;
            }),
              (l.prototype.detectIncompleteChar = function (t) {
                for (var e = t.length >= 3 ? 3 : t.length; e > 0; e--) {
                  var r = t[t.length - e];
                  if (1 == e && r >> 5 == 6) {
                    this.charLength = 2;
                    break;
                  }
                  if (e <= 2 && r >> 4 == 14) {
                    this.charLength = 3;
                    break;
                  }
                  if (e <= 3 && r >> 3 == 30) {
                    this.charLength = 4;
                    break;
                  }
                }
                this.charReceived = e;
              }),
              (l.prototype.end = function (t) {
                var e = '';
                if ((t && t.length && (e = this.write(t)), this.charReceived)) {
                  var r = this.charReceived,
                    n = this.charBuffer,
                    i = this.encoding;
                  e += n.slice(0, r).toString(i);
                }
                return e;
              });
          },
          { buffer: 60 },
        ],
        218: [
          function (t, e, r) {
            function n() {
              (this.table = new Uint16Array(16)),
                (this.trans = new Uint16Array(288));
            }
            function i(t, e) {
              (this.source = t),
                (this.sourceIndex = 0),
                (this.tag = 0),
                (this.bitcount = 0),
                (this.dest = e),
                (this.destLen = 0),
                (this.ltree = new n()),
                (this.dtree = new n());
            }
            function o(t, e, r, n) {
              var i, o;
              for (i = 0; i < r; ++i) t[i] = 0;
              for (i = 0; i < 30 - r; ++i) t[i + r] = (i / r) | 0;
              for (o = n, i = 0; i < 30; ++i) (e[i] = o), (o += 1 << t[i]);
            }
            function a(t, e, r, n) {
              var i, o;
              for (i = 0; i < 16; ++i) t.table[i] = 0;
              for (i = 0; i < n; ++i) t.table[e[r + i]]++;
              for (t.table[0] = 0, o = 0, i = 0; i < 16; ++i)
                (C[i] = o), (o += t.table[i]);
              for (i = 0; i < n; ++i) e[r + i] && (t.trans[C[e[r + i]]++] = i);
            }
            function s(t) {
              t.bitcount-- ||
                ((t.tag = t.source[t.sourceIndex++]), (t.bitcount = 7));
              var e = 1 & t.tag;
              return (t.tag >>>= 1), e;
            }
            function u(t, e, r) {
              if (!e) return r;
              for (; t.bitcount < 24; )
                (t.tag |= t.source[t.sourceIndex++] << t.bitcount),
                  (t.bitcount += 8);
              var n = t.tag & (65535 >>> (16 - e));
              return (t.tag >>>= e), (t.bitcount -= e), n + r;
            }
            function l(t, e) {
              for (; t.bitcount < 24; )
                (t.tag |= t.source[t.sourceIndex++] << t.bitcount),
                  (t.bitcount += 8);
              var r = 0,
                n = 0,
                i = 0,
                o = t.tag;
              do {
                (n = 2 * n + (1 & o)),
                  (o >>>= 1),
                  ++i,
                  (r += e.table[i]),
                  (n -= e.table[i]);
              } while (n >= 0);
              return (t.tag = o), (t.bitcount -= i), e.trans[r + n];
            }
            function c(t, e, r) {
              var n, i, o, s, c, h;
              for (
                n = u(t, 5, 257), i = u(t, 5, 1), o = u(t, 4, 4), s = 0;
                s < 19;
                ++s
              )
                S[s] = 0;
              for (s = 0; s < o; ++s) {
                var f = u(t, 3, 0);
                S[w[s]] = f;
              }
              for (a(x, S, 0, 19), c = 0; c < n + i; ) {
                var d = l(t, x);
                switch (d) {
                  case 16:
                    var p = S[c - 1];
                    for (h = u(t, 2, 3); h; --h) S[c++] = p;
                    break;
                  case 17:
                    for (h = u(t, 3, 3); h; --h) S[c++] = 0;
                    break;
                  case 18:
                    for (h = u(t, 7, 11); h; --h) S[c++] = 0;
                    break;
                  default:
                    S[c++] = d;
                }
              }
              a(e, S, 0, n), a(r, S, n, i);
            }
            function h(t, e, r) {
              for (;;) {
                var n = l(t, e);
                if (256 === n) return d;
                if (n < 256) t.dest[t.destLen++] = n;
                else {
                  var i, o, a, s;
                  for (
                    i = u(t, v[(n -= 257)], m[n]),
                      o = l(t, r),
                      s = a = t.destLen - u(t, y[o], b[o]);
                    s < a + i;
                    ++s
                  )
                    t.dest[t.destLen++] = t.dest[s];
                }
              }
            }
            function f(t) {
              for (var e, r, n; t.bitcount > 8; )
                t.sourceIndex--, (t.bitcount -= 8);
              if (
                ((e = t.source[t.sourceIndex + 1]),
                (e = 256 * e + t.source[t.sourceIndex]),
                (r = t.source[t.sourceIndex + 3]),
                (r = 256 * r + t.source[t.sourceIndex + 2]),
                e !== (65535 & ~r))
              )
                return p;
              for (t.sourceIndex += 4, n = e; n; --n)
                t.dest[t.destLen++] = t.source[t.sourceIndex++];
              return (t.bitcount = 0), d;
            }
            var d = 0,
              p = -3,
              g = new n(),
              _ = new n(),
              v = new Uint8Array(30),
              m = new Uint16Array(30),
              y = new Uint8Array(30),
              b = new Uint16Array(30),
              w = new Uint8Array([
                16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
                15,
              ]),
              x = new n(),
              S = new Uint8Array(320),
              C = new Uint16Array(16);
            !(function (t, e) {
              var r;
              for (r = 0; r < 7; ++r) t.table[r] = 0;
              for (
                t.table[7] = 24, t.table[8] = 152, t.table[9] = 112, r = 0;
                r < 24;
                ++r
              )
                t.trans[r] = 256 + r;
              for (r = 0; r < 144; ++r) t.trans[24 + r] = r;
              for (r = 0; r < 8; ++r) t.trans[168 + r] = 280 + r;
              for (r = 0; r < 112; ++r) t.trans[176 + r] = 144 + r;
              for (r = 0; r < 5; ++r) e.table[r] = 0;
              for (e.table[5] = 32, r = 0; r < 32; ++r) e.trans[r] = r;
            })(g, _),
              o(v, m, 4, 3),
              o(y, b, 2, 1),
              (v[28] = 0),
              (m[28] = 258),
              (e.localExports = function (t, e) {
                var r,
                  n,
                  o = new i(t, e);
                do {
                  switch (((r = s(o)), u(o, 2, 0))) {
                    case 0:
                      n = f(o);
                      break;
                    case 1:
                      n = h(o, g, _);
                      break;
                    case 2:
                      c(o, o.ltree, o.dtree), (n = h(o, o.ltree, o.dtree));
                      break;
                    default:
                      n = p;
                  }
                  if (n !== d) throw new Error('Data error');
                } while (!r);
                return o.destLen < o.dest.length
                  ? 'function' == typeof o.dest.slice
                    ? o.dest.slice(0, o.destLen)
                    : o.dest.subarray(0, o.destLen)
                  : o.dest;
              });
          },
          {},
        ],
        219: [
          function (t, e, r) {
            e.localExports = {
              categories: [
                'Cc',
                'Zs',
                'Po',
                'Sc',
                'Ps',
                'Pe',
                'Sm',
                'Pd',
                'Nd',
                'Lu',
                'Sk',
                'Pc',
                'Ll',
                'So',
                'Lo',
                'Pi',
                'Cf',
                'No',
                'Pf',
                'Lt',
                'Lm',
                'Mn',
                'Me',
                'Mc',
                'Nl',
                'Zl',
                'Zp',
                'Cs',
                'Co',
              ],
              combiningClasses: [
                'Not_Reordered',
                'Above',
                'Above_Right',
                'Below',
                'Attached_Above_Right',
                'Attached_Below',
                'Overlay',
                'Iota_Subscript',
                'Double_Below',
                'Double_Above',
                'Below_Right',
                'Above_Left',
                'CCC10',
                'CCC11',
                'CCC12',
                'CCC13',
                'CCC14',
                'CCC15',
                'CCC16',
                'CCC17',
                'CCC18',
                'CCC19',
                'CCC20',
                'CCC21',
                'CCC22',
                'CCC23',
                'CCC24',
                'CCC25',
                'CCC30',
                'CCC31',
                'CCC32',
                'CCC27',
                'CCC28',
                'CCC29',
                'CCC33',
                'CCC34',
                'CCC35',
                'CCC36',
                'Nukta',
                'Virama',
                'CCC84',
                'CCC91',
                'CCC103',
                'CCC107',
                'CCC118',
                'CCC122',
                'CCC129',
                'CCC130',
                'CCC132',
                'Attached_Above',
                'Below_Left',
                'Left',
                'Kana_Voicing',
                'CCC26',
                'Right',
              ],
              scripts: [
                'Common',
                'Latin',
                'Bopomofo',
                'Inherited',
                'Greek',
                'Coptic',
                'Cyrillic',
                'Armenian',
                'Hebrew',
                'Arabic',
                'Syriac',
                'Thaana',
                'Nko',
                'Samaritan',
                'Mandaic',
                'Devanagari',
                'Bengali',
                'Gurmukhi',
                'Gujarati',
                'Oriya',
                'Tamil',
                'Telugu',
                'Kannada',
                'Malayalam',
                'Sinhala',
                'Thai',
                'Lao',
                'Tibetan',
                'Myanmar',
                'Georgian',
                'Hangul',
                'Ethiopic',
                'Cherokee',
                'Canadian_Aboriginal',
                'Ogham',
                'Runic',
                'Tagalog',
                'Hanunoo',
                'Buhid',
                'Tagbanwa',
                'Khmer',
                'Mongolian',
                'Limbu',
                'Tai_Le',
                'New_Tai_Lue',
                'Buginese',
                'Tai_Tham',
                'Balinese',
                'Sundanese',
                'Batak',
                'Lepcha',
                'Ol_Chiki',
                'Braille',
                'Glagolitic',
                'Tifinagh',
                'Han',
                'Hiragana',
                'Katakana',
                'Yi',
                'Lisu',
                'Vai',
                'Bamum',
                'Syloti_Nagri',
                'Phags_Pa',
                'Saurashtra',
                'Kayah_Li',
                'Rejang',
                'Javanese',
                'Cham',
                'Tai_Viet',
                'Meetei_Mayek',
                'null',
                'Linear_B',
                'Lycian',
                'Carian',
                'Old_Italic',
                'Gothic',
                'Old_Permic',
                'Ugaritic',
                'Old_Persian',
                'Deseret',
                'Shavian',
                'Osmanya',
                'Elbasan',
                'Caucasian_Albanian',
                'Linear_A',
                'Cypriot',
                'Imperial_Aramaic',
                'Palmyrene',
                'Nabataean',
                'Hatran',
                'Phoenician',
                'Lydian',
                'Meroitic_Hieroglyphs',
                'Meroitic_Cursive',
                'Kharoshthi',
                'Old_South_Arabian',
                'Old_North_Arabian',
                'Manichaean',
                'Avestan',
                'Inscriptional_Parthian',
                'Inscriptional_Pahlavi',
                'Psalter_Pahlavi',
                'Old_Turkic',
                'Old_Hungarian',
                'Brahmi',
                'Kaithi',
                'Sora_Sompeng',
                'Chakma',
                'Mahajani',
                'Sharada',
                'Khojki',
                'Multani',
                'Khudawadi',
                'Grantha',
                'Tirhuta',
                'Siddham',
                'Modi',
                'Takri',
                'Ahom',
                'Warang_Citi',
                'Pau_Cin_Hau',
                'Cuneiform',
                'Egyptian_Hieroglyphs',
                'Anatolian_Hieroglyphs',
                'Mro',
                'Bassa_Vah',
                'Pahawh_Hmong',
                'Miao',
                'Duployan',
                'SignWriting',
                'Mende_Kikakui',
              ],
              eaw: ['N', 'Na', 'A', 'W', 'H', 'F'],
            };
          },
          {},
        ],
        220: [
          function (t, e, r) {
            (function (e) {
              var n, i, o, a, s, u, l, c, h, f, d, p, g, _, v, m;
              (p = t('unicode-trie')),
                (_ = t('./data.json')),
                (m = new p(
                  e(
                    'ABEAAAAAAAAAEKiQ5ZlpWFPX2vd73lPrafWIdQBlirUqKggKIqOkWhVxgGJFZIyCiMgQIUCAQNIjRxEZoqIiQogaBgcGAZkhEZFEQIiMAQKJECHGEEIImciwX2x7TrGnp+u9ng/vl2dfXNlJdvZa6/7t//rf91pMDqHfPNNQBgL8sjccSNRdbRc9uWHX5MnvbXfYXDWY/3CyInqFXvTkQJk/Lf3j549vpiQStB13g03WhrM3LLJscN7NU6x2ssNko8yCPlOg8t3zg2vP9u3mOyqelpehLkSEi6dXxAvXyXP/ue/lhrwz71bdPN6781lk/Pu1a7LueJwcHLCxrq2JjfkS65ywd73fimPmEV8d2npe19PWgS33ZXfjRgxDHDed1T6xK3qZs2mYoe9Fof+2P2uKQq/uVw2QP4czqqdwLsxrV+788+Ykn1sbusdp/9HvD8s6UP/Rc1jwug3rN32z8dvCe3kPCu7nc76nP3/18vWLNmpnU2tLR/Ph6QTJl8lXnA62vtqy+dHDoHM8+RuLBRHi2EjIZHcY5fP7UctXfJ1x7cb1H//JJiN40b90SOf9vkNDPqhD8YeVv7b0wzHXnjfdovuBp874nT0d4M99+25sYnSjXDH7Z0P6CB3+e6CzS1OPvDZhC72I2X3RvzVU/I+fIaXmXLxx9e7l2+lau//67UqLJcZ6douNdKy0zJrM7rkc3Hdk76EDzr8wpCXl/uN6ctalW2mExIyU7KTMtzq9Rn8e0HIeKJ5LoHhUL+ZAEvr6jyMuCpnUz/Eetm/4nPLQ4Zuvd3y5Za3Noo2rLf++zQAW98WBT9SFOEIE0SgB0ch8A6LBB9HY+KeC+0jjGJBGEJBGKpDGCSCNQiANBoDGtfcgGquB2rgKpLERSKMcSGM/iEbpYxAN9x4QDeDM18yxIS+2zvfMhWOZyk74D5v5yXL5nzal/gvbVvrWvfoLEJnLQDI/Asnkg8gw+kFkgB4SBdRJHVAnu4E6IYNosL8D0UA+BNGwmpOKBWw3cuCUHBASFRjSSmBIj4AhAW0RCbTFapAtTv/1v7ie5jlSnYCs+rWrPaf//ucRU4KUVts/6Uo5wXb+fUgqL+5V8nUcgTFI7qS/Q3A9qkrFGxWMWLyAr9qviTL0U9oSr+EIOgNkMpuLYPdUlwqZCoZsQsBXIjWS3VJxVOie6ai051aMv8Sjil9IK9VnbxNxQuJztHTA5a3YshCCpnAWeOhsvwbSTAaHGcZ3UOAI1OTbYEO14q7xYgRqlM7wtpLfpWPJE0VNjIZZsaVsKXkik1hqc2ba0kV19qycUByudLLXjJCZaGUYW1BIQZa0yE19mhkSfSYjaq2CIVk9f14xf142f14yf148f/58/vwZk+ENh+7SkQiUVBXsS07oaBSXKiRSy6ROykTr/EVr6K4wDIEaUgWz6hI6js5f5Eotaa8pE9fnL+6A7mrNXyTP31md0DEyU6oYlFouVpZoNDKfbfI9Gq2D8kRyFLw87beHhXvjooobscJ3/UufOAFmIPejvNijUYmwkIR/7oPLjaZaDA//9nzJGWq4If/jw6PkVg+UhLBPU0YEv6ol6SRfS9Ev3vury40lxSv5t8LcexF4y6ptI1Yy3CuXOZmUwMNtJUJpTQ6filErqmi+u1k7lcOw8y/dYd+7YHdXcnc+gydzo9n2zpBE3BR9Zq4OzjQtQsismOrCe0oDg1xchPr4lMxgRJqA1ZVCa8crqW+TFD4r/qvvqE7DsVAE9NF8Rvv3fpwAc824OX3cRBTql8lWh6z7/WyDv9jx9S8NQleEc/Qm9K0XZZk/C5ndYLTgxxCc3dyO/Sh4Hnr/J3PLHZvEiK7/eRRbcEOsUqLnE9b8JFKsnC0lNvEVYXAyUwnNW8NB4u4XMIVFCSyoZcF0YRelfZyaCqOyiRaOsZ4SPZPT7P/rJOY1gipT0u88FtuLVnM/FN6plP48cniGfvN5wscHwWAMCYkX/WPsuRvlXVj2v6csfI4pKx4umVfMLFozN6+Ynt8XrtmVX/8BcE1VKcWF+dFOxExygppRrZbTULgRHFlgBLE0r99G6Tchx9UbAcP3ApVeD4E5ZBfQcL2AhksAGq4vyHCFwKocDarKp+1AKfUhsA7tBNLQAdJ4AqRxFEgDmH5kwPSDAZVe54Da8AXSQAJp4IE03IE0gFW5DFSVTy8GleXngNr4B4iGZh2IBu4piAZ8H4gGDFiVa4Gq8ukkkG+8B2rjayCNg0AaN4E0PIE0SCAa+D4QDf8/DBa6Uyqur/qtJ5ru3wBIwoFIYoBILgKRuIKQEPNASFxAi5PpQtB0eQ+cLif/IFa4tDBeYxE7tbArTlHGtStyWgKD/hTruaGfeOM6zoh2LKbo11K3Fp4BU1rF0X63Cad65LAERHsnkHYdkPb3QNqPALRPAZ06ELgUrADStgFqzxtIIxdIAwGigQCl8VPALK4D3DJIAZpTC5DGCiAN4CqSAlxFIkBp/FQ3iIY7cDvJGKgNNyCN80AaaUAawM01BCiNnwLaEgO41agH1EYakMYmII0KIA3g5hoblMZPdYFoVAN9gwnUhgGQxn/8J+M/aGQCaXgBaYDS+ClgFpcBfUMJ1IYaSOMvIBrQPRAN3EEQDXgRiAawwsMDfcMRqA1/II1wII1/AmkcA9IAbbaeAlb/LkDfCARqowJIwwZIowFIYw+IBgW42QqsN8yAvpEJ1IYxkIYbkMZdIA0fII37IBrAegMJ9I1qoDaYQBoGQBolQBouQBqlIBrAegMG9A0toDYcgTT8gTSSQTSg4yAauAIQDWC9QQT6hhlQG5lAGsZAGpVAGgeANJ6AaADrDTbQN4RAbWgBaTgCaWQAaXiAaEAPQDSA9QYF6BtsoDaEQBpaQBqFQBqHgTSKATTWyQ2bZBsAQHYDwzUB7ieeAIULzwaFSwQmDfrCpNEB9bDUL63jWLF+RikmN9zCnHJ8kFUZR9e3WWQIOmLQmMRF69ctdrX425vvpPeGP3+3ro362aJJ/a1Wf7WpeVfb21WrOBsn2xswdBn1JLGswP7Vi+826QXfTGt8dX9gZnLfq7gvVlp/98WrPYoZRN9hbY8NfNgTTyKCQ+ImEGUKiGymIPeNfEi0TkW+dNWnVXPsutJ8VdudH8DgacQWM7/lxBZEC8LxUa6GtBZPWu0yFtSwVhCjLXxZ35UMuimMfOzbuyJrT9GGXGp2V3qgyLlBj2B9pVl+QL8lPN6OvHLkfYsWZ8OcqEfuoVr/hchD5aaKuintxu3khD8bc7JPsyIZ0McIMVa24cuTRGnWVzny6Hijuq4UGNVpllMoqpDvXzpWIX8i528WFELnqJxzLRkxusgDdrktdqKwyLF1yzh64au88OcdXjxR/A0uiwmjrHbZxHQx4mX3cMbPO0w8WNE3kObZS/oaUwa7JM3VThVjjREr0aftMyfOOMyHSJqtnumL1KGq4YRZKJJZ6Htl37eUApmaEwLPDYGlzug1465vZrpchjI77av+Xso8YDii26rHsktzrS28dYDc5n+MbPHI7jHF4jWMAUmNBjXW2N2mzNcGopD7RodnrLZkhm/brTmThyqw5Dp9k1B+CudR66fH0Zj1IztuJuwaxEZXUYLmznRE7+JxWy/OtH+AexzTxOdmykTvbtjklLLHxd79kFvP0QmKrU90UcWD1yppxaIo7VteJwI9sqJojVNy7Vtrbb235zbbNHPYW3oRDbtx20Jus4ajymNynvS/C3DO9Ige2eZVIVF6zSoak/n9FMQyYQ1l6lB+ZYNF95285gbqu5Oke3fg9erOvWk2+bWRohizqp5ca2FwLDHb+pwkzNfOFnU51nHJTFLdSv4EooDyPD7LjQM70h0QVRCbv1HRYiuoVXcnORmZhiDJ/Y4Kfdu2hO1Hkxgtrp18hcY6/YCCYJFvr1zW/prW9a5uDSzYeSg2+kTVHWeltXOcT3PNZEwZJZZmdcrNLmWOYEAv3+HgZSzYJPD9xsehoBCVYGIYDMfaOpWOFXoxBh9jv2m8GyjbsHuzRBxr3pu1RpCJtS4TiEbOxvXVMQ2rI9ckhrAde9a8y4i7JuzeT6XZyfqtL/snVGwnJibTOKkyTH63HmpCzNJcCK/1U+zXrrQ6z28WSRc7UXRgLSmbIa1WfDVHLV9HthK5NlyZge2fEFO3d9jE2PGUGYIgRLPg9Iibq0ODnbESmR66vHima1FzYf0JRdAe1JjovecaJCw1oNFU0gS75clOwWvOHUcPSGvYE3nFzcW6DmalXlUWctLw13TxyBrHwakD8KFBoT1cyZp850GRaG5IYnBn64e3VqM/0Sxqu+Xani5xcek3+zNQqNbdO8gU7WG7nmDSsEH2hFY7Ge4eNsz+guESnpqBsWIKUmVbL3d1Bu7HDFBlufie0FdxzyoMSZFdUuWlBoXASrvX63Z6p1eQuVCsqcY1+rhwWR9CT7WiOR82w8Y1yYeO+1udd8UfmGzB3kzvpvWP63p/UDvdpaeVJZ7TjtQx/c5KwLqaGnBgjnKt+lV87UZJJ43dUH561qLfKxNlYZmmyYOiprqO+liaxtNMhnKnXBpfVfjY0Nch7SmTNoE88Zt73pErkswetaoc4hwG4VvuIJL2849Nj8WehqYns1DT1JdHRo5SrRocHOnj43scdEgLSDzKQDcPk9x9Mrs7f5gbsVmrR+0cHS8oC4EKis9j4hrWtFNVGdyMhoyLrKKKXV8FHxuGZhUtGu39ZVMPLLPXco6wx7udMUZbXdNGHu7frVumo3R9CMW8f/YMpRLL7R2SETTkvnSD1HaTKyfmDOyyJmGmkWWsEE15HKPysUBRZsI0FGjRoc1Q3il7KIAfcZrgkIC9PxxQFtKQua/2lhh26yE1rPeBYdpAinpzTr0fLBMf6DC0BR5tPgj3DiIP10lK/NyYLZz2ttwOSy4uB33sTf0pUd2RNp1OXJngyUvFGrry6Lse3OyTT0KWNW2USer8J/PYzhN9Wa8rMmYybUqrY36OGWuSmW7zc1N30EiqIr6TkVfDzqqHzLx6UhTtVJsedG1GxcJxHSQknla72NrRYLRSzk6sIRF9magMprrOOdxNDb5jau6F3YUjlPcIFA37x29LKjbjDHS4GPMuO6ZvvOrdC43rqMrsfP0AdTUp/uYn8VqrT3FjlputVxuYiGJuml4Nm2B3WBdSY5My75pVOBP4NcnSQG68dZas14k3ppsDI7KFJTVQvR3bLIoyo77EjyybHH0dU8ClZH/SbE2kPic6vaczfMimpDO0kCKy7HKhqF/Xw7MwcE7t6/isqA/etE0CM2O7NKwDRIs1shCbejZsMuJGnciB/BrHAyZoQ3pZudXYTtzxB7r1rilxO/3MpP4FaU+o69TLzFlNZ14nPovKUpjze2u1OrmYmF3sMlZqeJaYI1YmzreAaWdIZoJPRcdzE4za5r94uM8ymqQtOffSd5LGS4nX0FLkZ64F/iSXnJrC4K4p4/vu3txq5E8SNGe7pmafF5eTd22p7qy5KmpfJFNFdhyI4x6gxS1pM3lq3ZZvr3Dc+LhMr/Kh47dSP7h2an5tUUd+V5s3rIo1HN0kTMCFdCmMd5PzOqZqNAwKPLhAfXZeY6sWwFlz28BjlWCWkeuN7Il005Tf6c8qrX+tEvkpM9MCTiDD6t9qUeDmJQw74/qQBm5CJI0HhzRFTnoZm/Gsa8YkxL9FxjYdNhInRB1Y9tVdxoUfDhqRWXrZPM6R2gzRwiE6TB1Ph4TyNJkxDdqs4cuRHAoe2uFgWGCDZQXuUDefHrpqdGn2zNj0seaTbhMlHY5cPAXxQWW+tTlWc+pGp2JcFpg249JZjUOtJ64koaxHENaXFwnMdvhSJO3sS6I72r74/Cx+dGvZ4JyOMHGUrbPNlk5Z4+hBT+KceWAV6OqrEolFZd4/fqvzAXYbHwEtHNuxqtqXdf4EOCvbLvrYdjZ1ffuQZy/DNi4/xd+3W8agUxua5givK3Hbu4vt6zMv7zjKJd1hd9jar8o/ZhGE3iR0GXjsENL1063LZZuRrpoHce7FOMSwTMRmiFGIfi65BNLpGLz7rlF6hPXNiYG1x9ONf7OQ8LkHEarYBk3QuLw4xoy8lp0GowUtjVD13Im93ahpWNZfvvMxvebvgXymR8iK4g/Z4X/77Hljf04N1ktw/ttlwoPGua/tNegb9LhD+RO97PfHlTgLsn5wr5ehow35UYskzh9XNUc/q0PKrrMiWe36gKtzfkIifnxfHrT0GPpHsYSqbLye5i+b3tiTbb0lxCyifC8yDHMJp4wvHzF53ymAG+JF1XRIdSSounHlAvWcjJYeg6wl+B//4CWzz6zSvOQ+b7fFSJiAHBs96V369lwvzpiDX5AdghXyns7R3d2Ni/1rPJ74MTle7UJcTaRpcbwmvKuuq7MurL0G8m1qzUlR6NAQJnYI3BhF9bS3MzBMKTPDwqvQWhPS7O/Hu9hypoE6mXp+Ka7vV++MMseH3qEG0PqTSTdxB6ssNRtdHdqiViwYfHjWoPAtyRv9ff42/tmw6k0yb6uPf28HFGpGR8KuXpfaTLrT7Fc8v+b33NrwKtV41Nn2jmx9SNB+lAQpGyPgjLML/ECZaY/zrcBSmQ370LyyoMivIEr/GIQLuz8m6tZylCz2KPUwCpdfULvQjVB3iO6l13DlzzdAbM37bimXDq3jwhdklOt1HYf1i4wYU+uIRqTILMuhrGRP5Hq6dmXzNpstqSTr3L0aIrQ5Vycd/+H24coGeP+M5mS70j/3hwe/2ko32UvWR4nPnd0Qt9JoUWOt/3XJWs/VxZ6oA3YJI2ZGxrMnNt9UZlbAU4LxE3Yk+zmKZ+8BXHChbdyL4jRs38/TuaSSO2Sjh6zNmHNNPj95YNuHriuNA/hjRuPVpPp9qLxnbVc3Y4VLcWHdvFLRiEUmYishlb/NVVfN9OFelkyIL4emDgWtxt/6yt8rAv4ue9rB1vMe3LY/YTpd+2Tp6wn+AMWvkVmmrpxfXmQpI7oq3r3gwKha1NiR1ZKqMzyuG69ZXLsUgnfkh0IYt+5MC58AJidjWQ/pVm7x0xrWztt9dnCsnZqdKXJhnrzN0qjcO5Bug8KiC9AHemcwtvFyFCtLH1N4qmdOh7/Nl5HC6AiQMOwgrkSHQIuiwdOpX3R6bTu68wBk2nbSnyqXXdfLR76sdkTq5ndJVVjxkUdPE3JlPfJBD1yFrs6HW1/xaucvB87QmELnVe0OhFRBq7dm6/zqIB6TGWSS5R7kpFk0PkrRZeiqva6QBkJvpge3PnHUhbNS1KezRPICqhhz7MMyvjCvc5aNZz3EBj3rGxkIsfd95DEQVuSKTWDgKwKneMo5VUUMrqmsWyuwg7u6HT0x5CEXJ/JfNr2cZvMNkVZfxXKVhFbNce5eX/9ncGa/PC626nlTFvWiA57eltozKm7LWCKhK5EdqcGawG8Je3FiDrbuu3AsYa+6MFDwjBoLYabSEC8pyfCORnGQCjmoqZDjHniaGkD8PJwxj46ahNIoje62Grp/YIxw9xbJJw4lO6R2dEIky8jHPmixNkvsnBAbfOqxxhIvHb5WI1HgkuFM/JKfEYFIQWyiDK8ZgXok2WmjlDJsV9MibjBmO5eny0wpsiW/H6pzqhAHHanSC04PHilDJHjzg1Z1Uy/6py0K0OnzuUkxQWriPPpZY8HBsbDMysYQZ34JPQBVb4IjSBk+2e3SUv4mJgLd0V+M85p6TFSG9nGdnuzE9mcXWCk8ogZlL2odecqujQkVvDhkhTAUQWdWdYSbXQ0tpRVwGnkDH2JMGzCOv4R0F33pY0TunMpzVORL9hXKWkQ6Xabd0M6ukGqT9Z52T3N3WiV0HhBGyU6FabWpAl9U0SrOxz8ZPo5zN3AsU0VNVMbY61DcrbZZIaR1Yh+ZfZFXYFRtBzHTNFtWbv5khsusS7as/5JpSC/n4wYtd9Srl+ei3elKBwmllcs6igtDBNqjJQki85onsewj8OLuSTqi/xAj4Qt9jeG+ALlyVZmXpwqDKxyXtIeqh8PCutBjkduqZaja89QfOtbczreypJKG/jK9qFLNxr3VnLt1aAnFvyQ7DOPLRPQoK7RlAfrPpaFKNX8Xix12/mhJ1Vmm2qZ9Z1WC71S79QQNdWtH8Y/ckrGzSkF/7u6THBHasOj0a01CUeAltRsOHUxWPYhLOQLpa2rC0HnfNlrx3jStQAV4NaIyGi7JYh55zIZXR8aTEbzhw6Rw99uvC6+xSw3IvaYp2GK9jsPt3p4QnchupaBRHkWPoXKYkMsaKVBQvkXn7tLRz2b7jncsYoolhcri7nH49569WHRH+BElDuWERXXTR2il5xejx0yVc+vrS7kw8sGprYa3lu0yhyFMLW+wTdakU7Jnn6qeeEKTQnKRc2FC0VbZ2dOY40gj9QJDTuLIE6Vah3BvFNuDzBxM1K0MqOVVTePU/yGJcjT7i6H5dJsZ5G9eWhHrjMOKHmJfbbtDhemrT71z5RHK4tBjFyI15Ls3mVbkqfrBXE9V+qxLBH4Y3TIgpdzX7HeTawZjj9uWzJdy/gIhKdTHwl2taQjNpkbBV2ryIp5aJiv4Bf+q8Yz1vF2sQuSBx5NwhTyJulvkJfKNtyDrwVkwPJ/dvgaKtk/HwTWJcjsRjIpbBYU3aM7zam7NpskPqc6q+qcdBifmzGqQQuZcKafaggpt0ITZJ1eX90NB3ezkUiobj1sObc+lwq9CJiyM5IsJSd9cs6VGNaCx9j0re6v5KR/rZvf5Z//l+MmCT2vSGaqir/xvv/ifHs+PellpnNTT2pHIRz4fv5h6MUnHL/P15O8z4odTojLPpevnL30eV9dlUnMCM06K+2RVFX6CW0BCxGkTFt8xvD1X7NsN095Ji+Wvub0tqnr71NTAGf2RnB9NB3j9yoUrJsdHSjTGv1ZHx8NAOPxgSpca4FXr4FnrsMvFzr1IVp43Uht18ozriGSIotI3YIkU1lZpClUKh+2byij0snZM0pnl/9j4IlpFpAfKdG7VhhutbEwelTal1srzjttqrLEGhaL5VV7E+1Njog0++omzyoigzpNr0zKSmzNftkripfGN2U+69Ldm6goIC8v8Gb4wjdWxGWbaZWJtf9jINSxA9UlWNQ7GVMfpGOQYjyvKbqHeOA8ye5jPnR6pB/H99dGbujrlUF5EDPdqV+sAnfBytFnSw82wyXnd8cQqExdhyi3KED99FB7ZThiGL2hVaFIDFQr0x+O9e1OmbvhbtDneaqCcmNF4Brn/u/wyKYKnkoqYaobX2Bk/kcY2vIwYRY2IkCpiP12ZkV4o4Lq54gd93JhL7SUZiRdHNa3vhmxtjHtC7S+4xHF5b/YgpQMZrJm4lrq0bGiwMz5Hxk6bOAhX8tvFF0ooZRnJEy+nY9DrFXwH2oYvapdp1z7iuPMwnrg+UZ8wV0aTG1TZcf1qSUdZek8MSk5XKIVVR4U81g3BhKrRZ4qrXKgM9WEWvEqk+vL/XYnT5gM75x6hvKbKS+vNYYlUs39pf/FUBfW/3lXzANG3LHbNY+N0oqalpaFt9xqZz2ZkmXDOO469rc455lRBmSD86aDiLv7Eo4regh0HCbFLSDmieOFiTuQ2F6vNXtsFwR5YkbxcsNpzeKXQu/3oSynjs5/cDuUbNbuEEBUMX1omxmAKE+JQSAu/cAK611t/2zF/YqOn6MyzRhPbYlYEYXyuuCwcjnRusNshkD3mtYjocdVv7XFrdNrJtQfg37sYBRBzbZBC0RHYk06or2QJeXMn59ws24xbZ/u7LUyzzCG7hZLbi3FZMl8Q1MxOOqdyu3Necwkx6JsazjGuc6oSZ8uDeINDuxwpnjtGwm7n9msxuk2iGKYY4lLa7tmKttH+Vf5uWdn2vqkitTQmYvfS0tbEiobTOyuIT053Nr2aCz9+4Yfzq/hTBmETW6NKPhQot1ahR6pK67BWbsSkwNM7l5z1K/zFO/81P4JqI+eXP+QfbbHGrBQkFc2hhesm6rv404rPORqlP9BTj4pirpuP5yFfMkXY+OXsFPxlGqfn5qDT3C35iNwz3ljjoToTYz9RcOFpm5FjvoZWtrIyRuiVjzVi4UsTgnPQc03WuOkm+UCKFpWWaaCcTQwfGS0jkFC3bHrmxL5Qf03Hg9PK4taBidU0C5Nshb5Wgi4lPf6Dobe7jSDePDS42TLXQk+HiTlXxlNVI+Ua27QTDjpTnjuGBnHvS1ba6KAVNpgyKBWXEm2LoVVaJ+CE8sZSgY8++7H1ITtG5Fxxo+axeeLprP1dHSIMTygxPblKfXPkcji7o3sdU9YaX1TSM7x2UmIcPudXCsUu9TWpPaFN1VRgSlCllVIt2DPp7SMPhllI4b7f1qvyYDU/tvn9GRPZ4HwnWZmtm8Kf4UYJ4Zz3BS4/ZXbsgkNhH8SyKhLRQXuLIaVoOMFNX6yKT2EmepmnNmFRgU9x3snnc8gDcI39F6L1DmnHeIeTqt+fOlc4m8/5eYUW7qnpFnFdz+cPVxVdIZygGvQNEB628PTWYpaODTFwdpyaLS1S7Y5CgojGY67FLX3Q6zTo9bTHCS4sJK7Zt1HZ1zkcF0XuNTHIV/mcXOXIo2T7M3spASgRO2G+C7zSRiuDYzf4iQw+xBuWQu8O05AtGFGHfMqlk85dRzs8iNxvZxu+auQ9bZ1v3hEbnp4ougEGeykbI42K5DsDom9gN2KtyNrsqzht+FpDPKLgyEYekipsYXC0OEQaTAtPg66HQ/VyaOzwFgg9hh6jXIG2arLlhc07tMqXJZpJOlM3/TiQi+8qw9lugewandQojnm7DMm8JFpGk8PxtPjRAQqGbPHK84BlNGd2f2fU0rGWFEsH9he1SSdqdxoasCoJ3SSOLNowIAx/N//EzNSAM9+V/L3huN0G/3NGwojFwTdrTyMEt4ZwF0bjBoPgbTJHqiaaaphY7chBmlY6R3az289Fp3fkpx+T7jpCH+wi/fwEnOGvalP2NFw5ZhWAbLs4wCuA5h05B2umnuew7xExzmq0/H0gIWVXKgE7sbxvIK0Hb560Jn72/Rwdl5hKaB853zAzOR6er0D7Grb7F84eYtkhWjFcY8UUbjzm2uz+yWdtsTRjrkFpjqw+giVso/1aruiNx7tn4hHQIcUnmxENN5+tFrx/6RpJgtsbwgqLXcZcOD1r/l4kaXOa3cQbPfwQbYkT2QehHinEzLiNXNGtHJp7hCGqhPTL3l4C55cvEK2xr6OWs1OFVDxn5xc2mvVtxe5DQRWEXcz/eGmk/r3K/jIqJLDEf37p/Blh1ezEkZkksQpxGRXqrL+6ilaiS0gdrfJZMe5ckrEg3aJNa53TNVih91wdIm5JjkkrPod7f7ROP8Bn4Y74I0bO/DLdohPzLSPGCrXGS1ibT4zSs0tuXjyVd6/68k1lCmzbucJY135pA2sw6tgU1zZlwcbFqiFCKGVn/K6H+u6/lZycZ942Gntf9iN9ymphixWnXsSxTtuTTrmSVsLeQ0WtDCsvbp+P4quvYm0KE3NKw7Go+xUxkgu1PNH+8RN9PgGkuXZ4pqeN5sK4Db8v4yLLD9pK98Mp4rtm24vdxTmz53MzfDtQ3U9ineMs6U6lEza8PnujxrvcvJ8vYnhzlT2agdZX1sLpY9woHSH7mVsoHT/evSNwGy12vpJ5IVXopjI9GtiadljH61jFUK5JK2Invpas2YN8lFV1Qh+xmjCrfjo/wtvWW/JS2gLtZO5GDGpsfYdr3fo2wjBuYXXhHQEZ5OOT+Hn3rDjxWKPDbQF2wdiblvA2T3auYgc9vTS7IUkwD3JvmXd3ERRT7/G0i65sG/GGFjbiG6GW9bCbrweyi5ixtiO+69hfq3GV03aYs+o5D8qCRyoz86DwqevEdUsqEqRfOW+KWzLDnTF1+OutxZ/8jMZLccfD8c96TKw33/LFVAUQQrdm+gYvtE24c3vpuJpf2YBrvC0rZcxoJJ4sim+7khEcC8VtEyJKfUZlfr7tFtM6zwO6OsM/1gFbDj/oxhYj/l2AGKdva2cnuwlMt1qMIKp9y4Y7hRvVjeO0FOX+HqneJWxBwuptd+kq/QLaVVTWbUWPfKemn8llwvEuYwiX7vv4JQHsuRHGnFA9NVN5R6W6F9u0qUzAXzGVUZ/uPPexUK8pDVuf3r3ss8/80V+PzH3z2fPD3G4u0T4w9HCQXFaI+DQe7dR6m3LB+0BD5oV+CBqqP5cYtTaveLEAJr3dbusdub3QLtD7bMdmrQj1gd/uwm0nY10QDdH2V1w49DE6p0JO8T2imZoOLaKHEsXBjuJrsXql7NbmSEFwoVVhfVnphFLUdVX4ipl6ohOm1XyUQDnKZ7+UoHw16+Ly++kPbOKdre+iGOGfNUT2p4XiUQSbEIw+evL9mbweISHLhgXpBAac9ZabZvXxZk0tQyk9H3x2uk+UdOAD+dz3ziO++vkJ6xm9WV6+4sEBaaXE3GutXX53+CdPLZ9D50gIvy2e0ntOFpZuFE2mR069SrjjwtuYTT8at8uDGHhJ0H1RsF/ZojrK/fHu4UyPqPiueN8qcUVI2uHDM1a74fmYncR2KiJVuYuYKYizgIl3wMRZd6k+rwU8gw5eOfZ1j32HGEtH3Ul/4L21UjzFKtnHGmHGopHckUYCWhb97cwUq7MeoyRnGldmL/7suY6zcKO0vDOKgKqbUlCKwsQX+S8f1Jq0IxhRpB77z7/aVNYTZLjAJUi9NpPbKp2ftSVZaI+PFPjhegRjA7vW0gPEWUhMl61Ju9fNMFtN1JDXcVwGqiKMkO3JfJIr3M9veExkTkK2XVvhBrVx+vbbtRJUZvVHOZvm6sL0mEWUPvEPYTfTk6IXeBzcxF03O+jedXLVaVtaqIRCUPjalzINGWdRAxumJhxij+O7B9z8PGXf1HyQM7KgPn8mMeP5SEzgP0LxX/7EdKtb7B+TRf1yeyShJgzHMGivYqRnVwaFYBrMSEfH6kKRmBKmbzu/qkKgGOlTCeO80asZBvwqbtVIpcpNsPx/vnD8/3jsKncOwaT+7svn7UEZA9KToymv1Iv/8K4L9VWrmblWWkOa3Wv++pnWqxD9UE5X4RsrZsQPH/6i1RvF+ZNVxf+K49QZXabhH7P733JcwJkkQ7D/Cw==',
                    'base64'
                  )
                )),
                (v =
                  Math.log2 ||
                  function (t) {
                    return Math.log(t) / Math.LN2;
                  }),
                (n = (g = function (t) {
                  return (v(t) + 1) | 0;
                })(_.categories.length - 1)),
                (a = g(_.combiningClasses.length - 1)),
                (h = g(_.scripts.length - 1)),
                (l = g(_.eaw.length - 1)),
                (o = a + h + l + 10),
                (u = h + l + 10),
                (d = l + 10),
                (i = (1 << n) - 1),
                (s = (1 << a) - 1),
                (f = (1 << h) - 1),
                (c = (1 << l) - 1),
                (r.getCategory = function (t) {
                  var e;
                  return (e = m.get(t)), _.categories[(e >> o) & i];
                }),
                (r.getCombiningClass = function (t) {
                  var e;
                  return (e = m.get(t)), _.combiningClasses[(e >> u) & s];
                }),
                (r.getScript = function (t) {
                  var e;
                  return (e = m.get(t)), _.scripts[(e >> d) & f];
                }),
                (r.getEastAsianWidth = function (t) {
                  var e;
                  return (e = m.get(t)), _.eaw[(e >> 10) & c];
                }),
                (r.getNumericValue = function (t) {
                  var e, r, n, i, o;
                  if (((o = m.get(t)), 0 === (n = 1023 & o))) return null;
                  if (n <= 50) return n - 1;
                  if (n < 480)
                    return (i = (n >> 4) - 12), (e = 1 + (15 & n)), i / e;
                  if (n < 768) {
                    for (o = (n >> 5) - 14, r = 2 + (31 & n); r > 0; )
                      (o *= 10), r--;
                    return o;
                  }
                  for (o = (n >> 2) - 191, r = 1 + (3 & n); r > 0; )
                    (o *= 60), r--;
                  return o;
                }),
                (r.isAlphabetic = function (t) {
                  var e;
                  return (
                    'Lu' === (e = r.getCategory(t)) ||
                    'Ll' === e ||
                    'Lt' === e ||
                    'Lm' === e ||
                    'Lo' === e ||
                    'Nl' === e
                  );
                }),
                (r.isDigit = function (t) {
                  return 'Nd' === r.getCategory(t);
                }),
                (r.isPunctuation = function (t) {
                  var e;
                  return (
                    'Pc' === (e = r.getCategory(t)) ||
                    'Pd' === e ||
                    'Pe' === e ||
                    'Pf' === e ||
                    'Pi' === e ||
                    'Po' === e ||
                    'Ps' === e
                  );
                }),
                (r.isLowerCase = function (t) {
                  return 'Ll' === r.getCategory(t);
                }),
                (r.isUpperCase = function (t) {
                  return 'Lu' === r.getCategory(t);
                }),
                (r.isTitleCase = function (t) {
                  return 'Lt' === r.getCategory(t);
                }),
                (r.isWhiteSpace = function (t) {
                  var e;
                  return (
                    'Zs' === (e = r.getCategory(t)) || 'Zl' === e || 'Zp' === e
                  );
                }),
                (r.isBaseForm = function (t) {
                  var e;
                  return (
                    'Nd' === (e = r.getCategory(t)) ||
                    'No' === e ||
                    'Nl' === e ||
                    'Lu' === e ||
                    'Ll' === e ||
                    'Lt' === e ||
                    'Lm' === e ||
                    'Lo' === e ||
                    'Me' === e ||
                    'Mc' === e
                  );
                }),
                (r.isMark = function (t) {
                  var e;
                  return (
                    'Mn' === (e = r.getCategory(t)) || 'Me' === e || 'Mc' === e
                  );
                });
            }).call(this, t('buffer').Buffer);
          },
          { './data.json': 219, buffer: 60, 'unicode-trie': 221 },
        ],
        221: [
          function (t, e, r) {
            var n, i;
            (i = t('tiny-inflate')),
              (n = (function () {
                function t(t) {
                  var e, r, n;
                  (e =
                    'function' == typeof t.readUInt32BE &&
                    'function' == typeof t.slice) || t instanceof Uint8Array
                    ? (e
                        ? ((this.highStart = t.readUInt32BE(0)),
                          (this.errorValue = t.readUInt32BE(4)),
                          (r = t.readUInt32BE(8)),
                          (t = t.slice(12)))
                        : ((n = new DataView(t.buffer)),
                          (this.highStart = n.getUint32(0)),
                          (this.errorValue = n.getUint32(4)),
                          (r = n.getUint32(8)),
                          (t = t.subarray(12))),
                      (t = i(t, new Uint8Array(r))),
                      (t = i(t, new Uint8Array(r))),
                      (this.data = new Uint32Array(t.buffer)))
                    : ((this.data = t.data),
                      (this.highStart = t.highStart),
                      (this.errorValue = t.errorValue));
                }
                return (
                  11,
                  5,
                  6,
                  32,
                  64,
                  63,
                  2,
                  32,
                  31,
                  2048,
                  32,
                  2080,
                  2080,
                  32,
                  2112,
                  4,
                  (t.prototype.get = function (t) {
                    var e;
                    return t < 0 || t > 1114111
                      ? this.errorValue
                      : t < 55296 || (t > 56319 && t <= 65535)
                      ? ((e = (this.data[t >> 5] << 2) + (31 & t)),
                        this.data[e])
                      : t <= 65535
                      ? ((e =
                          (this.data[2048 + ((t - 55296) >> 5)] << 2) +
                          (31 & t)),
                        this.data[e])
                      : t < this.highStart
                      ? ((e = this.data[2080 + (t >> 11)]),
                        (e = this.data[e + ((t >> 5) & 63)]),
                        (e = (e << 2) + (31 & t)),
                        this.data[e])
                      : this.data[this.data.length - 4];
                  }),
                  t
                );
              })()),
              (e.localExports = n);
          },
          { 'tiny-inflate': 218 },
        ],
        222: [
          function (t, e, r) {
            (function (t) {
              function r(e) {
                try {
                  if (!t.localStorage) return !1;
                } catch (t) {
                  return !1;
                }
                var r = t.localStorage[e];
                return null != r && 'true' === String(r).toLowerCase();
              }
              e.localExports = function (t, e) {
                if (r('noDeprecation')) return t;
                var n = !1;
                return function () {
                  if (!n) {
                    if (r('throwDeprecation')) throw new Error(e);
                    r('traceDeprecation') ? console.trace(e) : console.warn(e),
                      (n = !0);
                  }
                  return t.apply(this, arguments);
                };
              };
            }).call(
              this,
              'undefined' != typeof global
                ? global
                : 'undefined' != typeof self
                ? self
                : 'undefined' != typeof window
                ? window
                : {}
            );
          },
          {},
        ],
        223: [
          function (t, e, r) {
            e.localExports = function (t) {
              return (
                t &&
                'object' == typeof t &&
                'function' == typeof t.copy &&
                'function' == typeof t.fill &&
                'function' == typeof t.readUInt8
              );
            };
          },
          {},
        ],
        224: [
          function (t, e, r) {
            (function (e, n) {
              function i(t, e) {
                var n = { seen: [], stylize: a };
                return (
                  arguments.length >= 3 && (n.depth = arguments[2]),
                  arguments.length >= 4 && (n.colors = arguments[3]),
                  g(e) ? (n.showHidden = e) : e && r._extend(n, e),
                  y(n.showHidden) && (n.showHidden = !1),
                  y(n.depth) && (n.depth = 2),
                  y(n.colors) && (n.colors = !1),
                  y(n.customInspect) && (n.customInspect = !0),
                  n.colors && (n.stylize = o),
                  u(n, t, n.depth)
                );
              }
              function o(t, e) {
                var r = i.styles[e];
                return r
                  ? '[' + i.colors[r][0] + 'm' + t + '[' + i.colors[r][1] + 'm'
                  : t;
              }
              function a(t, e) {
                return t;
              }
              function s(t) {
                var e = {};
                return (
                  t.forEach(function (t, r) {
                    e[t] = !0;
                  }),
                  e
                );
              }
              function u(t, e, n) {
                if (
                  t.customInspect &&
                  e &&
                  C(e.inspect) &&
                  e.inspect !== r.inspect &&
                  (!e.constructor || e.constructor.prototype !== e)
                ) {
                  var i = e.inspect(n, t);
                  return m(i) || (i = u(t, i, n)), i;
                }
                var o = l(t, e);
                if (o) return o;
                var a = Object.keys(e),
                  g = s(a);
                if (
                  (t.showHidden && (a = Object.getOwnPropertyNames(e)),
                  S(e) &&
                    (a.indexOf('message') >= 0 ||
                      a.indexOf('description') >= 0))
                )
                  return c(e);
                if (0 === a.length) {
                  if (C(e)) {
                    var _ = e.name ? ': ' + e.name : '';
                    return t.stylize('[Function' + _ + ']', 'special');
                  }
                  if (b(e))
                    return t.stylize(
                      RegExp.prototype.toString.call(e),
                      'regexp'
                    );
                  if (x(e))
                    return t.stylize(Date.prototype.toString.call(e), 'date');
                  if (S(e)) return c(e);
                }
                var v = '',
                  y = !1,
                  w = ['{', '}'];
                if (
                  (p(e) && ((y = !0), (w = ['[', ']'])),
                  C(e) &&
                    (v = ' [Function' + (e.name ? ': ' + e.name : '') + ']'),
                  b(e) && (v = ' ' + RegExp.prototype.toString.call(e)),
                  x(e) && (v = ' ' + Date.prototype.toUTCString.call(e)),
                  S(e) && (v = ' ' + c(e)),
                  0 === a.length && (!y || 0 == e.length))
                )
                  return w[0] + v + w[1];
                if (n < 0)
                  return b(e)
                    ? t.stylize(RegExp.prototype.toString.call(e), 'regexp')
                    : t.stylize('[Object]', 'special');
                t.seen.push(e);
                var k;
                return (
                  (k = y
                    ? h(t, e, n, g, a)
                    : a.map(function (r) {
                        return f(t, e, n, g, r, y);
                      })),
                  t.seen.pop(),
                  d(k, v, w)
                );
              }
              function l(t, e) {
                if (y(e)) return t.stylize('undefined', 'undefined');
                if (m(e)) {
                  var r =
                    "'" +
                    JSON.stringify(e)
                      .replace(/^"|"$/g, '')
                      .replace(/'/g, "\\'")
                      .replace(/\\"/g, '"') +
                    "'";
                  return t.stylize(r, 'string');
                }
                return v(e)
                  ? t.stylize('' + e, 'number')
                  : g(e)
                  ? t.stylize('' + e, 'boolean')
                  : _(e)
                  ? t.stylize('null', 'null')
                  : void 0;
              }
              function c(t) {
                return '[' + Error.prototype.toString.call(t) + ']';
              }
              function h(t, e, r, n, i) {
                for (var o = [], a = 0, s = e.length; a < s; ++a)
                  P(e, String(a))
                    ? o.push(f(t, e, r, n, String(a), !0))
                    : o.push('');
                return (
                  i.forEach(function (i) {
                    i.match(/^\d+$/) || o.push(f(t, e, r, n, i, !0));
                  }),
                  o
                );
              }
              function f(t, e, r, n, i, o) {
                var a, s, l;
                if (
                  ((l = Object.getOwnPropertyDescriptor(e, i) || {
                    value: e[i],
                  }).get
                    ? (s = l.set
                        ? t.stylize('[Getter/Setter]', 'special')
                        : t.stylize('[Getter]', 'special'))
                    : l.set && (s = t.stylize('[Setter]', 'special')),
                  P(n, i) || (a = '[' + i + ']'),
                  s ||
                    (t.seen.indexOf(l.value) < 0
                      ? (s = _(r)
                          ? u(t, l.value, null)
                          : u(t, l.value, r - 1)).indexOf('\n') > -1 &&
                        (s = o
                          ? s
                              .split('\n')
                              .map(function (t) {
                                return '  ' + t;
                              })
                              .join('\n')
                              .substr(2)
                          : '\n' +
                            s
                              .split('\n')
                              .map(function (t) {
                                return '   ' + t;
                              })
                              .join('\n'))
                      : (s = t.stylize('[Circular]', 'special'))),
                  y(a))
                ) {
                  if (o && i.match(/^\d+$/)) return s;
                  (a = JSON.stringify('' + i)).match(
                    /^"([a-zA-Z_][a-zA-Z_0-9]*)"$/
                  )
                    ? ((a = a.substr(1, a.length - 2)),
                      (a = t.stylize(a, 'name')))
                    : ((a = a
                        .replace(/'/g, "\\'")
                        .replace(/\\"/g, '"')
                        .replace(/(^"|"$)/g, "'")),
                      (a = t.stylize(a, 'string')));
                }
                return a + ': ' + s;
              }
              function d(t, e, r) {
                var n = 0;
                return t.reduce(function (t, e) {
                  return (
                    n++,
                    e.indexOf('\n') >= 0 && n++,
                    t + e.replace(/\u001b\[\d\d?m/g, '').length + 1
                  );
                }, 0) > 60
                  ? r[0] +
                      ('' === e ? '' : e + '\n ') +
                      ' ' +
                      t.join(',\n  ') +
                      ' ' +
                      r[1]
                  : r[0] + e + ' ' + t.join(', ') + ' ' + r[1];
              }
              function p(t) {
                return Array.isArray(t);
              }
              function g(t) {
                return 'boolean' == typeof t;
              }
              function _(t) {
                return null === t;
              }
              function v(t) {
                return 'number' == typeof t;
              }
              function m(t) {
                return 'string' == typeof t;
              }
              function y(t) {
                return void 0 === t;
              }
              function b(t) {
                return w(t) && '[object RegExp]' === k(t);
              }
              function w(t) {
                return 'object' == typeof t && null !== t;
              }
              function x(t) {
                return w(t) && '[object Date]' === k(t);
              }
              function S(t) {
                return (
                  w(t) && ('[object Error]' === k(t) || t instanceof Error)
                );
              }
              function C(t) {
                return 'function' == typeof t;
              }
              function k(t) {
                return Object.prototype.toString.call(t);
              }
              function E(t) {
                return t < 10 ? '0' + t.toString(10) : t.toString(10);
              }
              function A() {
                var t = new Date(),
                  e = [
                    E(t.getHours()),
                    E(t.getMinutes()),
                    E(t.getSeconds()),
                  ].join(':');
                return [t.getDate(), B[t.getMonth()], e].join(' ');
              }
              function P(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e);
              }
              var j = /%[sdj%]/g;
              (r.format = function (t) {
                if (!m(t)) {
                  for (var e = [], r = 0; r < arguments.length; r++)
                    e.push(i(arguments[r]));
                  return e.join(' ');
                }
                for (
                  var r = 1,
                    n = arguments,
                    o = n.length,
                    a = String(t).replace(j, function (t) {
                      if ('%%' === t) return '%';
                      if (r >= o) return t;
                      switch (t) {
                        case '%s':
                          return String(n[r++]);
                        case '%d':
                          return Number(n[r++]);
                        case '%j':
                          try {
                            return JSON.stringify(n[r++]);
                          } catch (t) {
                            return '[Circular]';
                          }
                        default:
                          return t;
                      }
                    }),
                    s = n[r];
                  r < o;
                  s = n[++r]
                )
                  _(s) || !w(s) ? (a += ' ' + s) : (a += ' ' + i(s));
                return a;
              }),
                (r.deprecate = function (t, i) {
                  if (y(n.process))
                    return function () {
                      return r.deprecate(t, i).apply(this, arguments);
                    };
                  if (!0 === e.noDeprecation) return t;
                  var o = !1;
                  return function () {
                    if (!o) {
                      if (e.throwDeprecation) throw new Error(i);
                      e.traceDeprecation ? console.trace(i) : console.error(i),
                        (o = !0);
                    }
                    return t.apply(this, arguments);
                  };
                });
              var I,
                T = {};
              (r.debuglog = function (t) {
                if (
                  (y(I) && (I = e.env.NODE_DEBUG || ''),
                  (t = t.toUpperCase()),
                  !T[t])
                )
                  if (new RegExp('\\b' + t + '\\b', 'i').test(I)) {
                    var n = e.pid;
                    T[t] = function () {
                      var e = r.format.apply(r, arguments);
                      console.error('%s %d: %s', t, n, e);
                    };
                  } else T[t] = function () {};
                return T[t];
              }),
                (r.inspect = i),
                (i.colors = {
                  bold: [1, 22],
                  italic: [3, 23],
                  underline: [4, 24],
                  inverse: [7, 27],
                  white: [37, 39],
                  grey: [90, 39],
                  black: [30, 39],
                  blue: [34, 39],
                  cyan: [36, 39],
                  green: [32, 39],
                  magenta: [35, 39],
                  red: [31, 39],
                  yellow: [33, 39],
                }),
                (i.styles = {
                  special: 'cyan',
                  number: 'yellow',
                  boolean: 'yellow',
                  undefined: 'grey',
                  null: 'bold',
                  string: 'green',
                  date: 'magenta',
                  regexp: 'red',
                }),
                (r.isArray = p),
                (r.isBoolean = g),
                (r.isNull = _),
                (r.isNullOrUndefined = function (t) {
                  return null == t;
                }),
                (r.isNumber = v),
                (r.isString = m),
                (r.isSymbol = function (t) {
                  return 'symbol' == typeof t;
                }),
                (r.isUndefined = y),
                (r.isRegExp = b),
                (r.isObject = w),
                (r.isDate = x),
                (r.isError = S),
                (r.isFunction = C),
                (r.isPrimitive = function (t) {
                  return (
                    null === t ||
                    'boolean' == typeof t ||
                    'number' == typeof t ||
                    'string' == typeof t ||
                    'symbol' == typeof t ||
                    void 0 === t
                  );
                }),
                (r.isBuffer = t('./support/isBuffer'));
              var B = [
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
              (r.log = function () {
                console.log('%s - %s', A(), r.format.apply(r, arguments));
              }),
                (r.inherits = t('inherits')),
                (r._extend = function (t, e) {
                  if (!e || !w(e)) return t;
                  for (var r = Object.keys(e), n = r.length; n--; )
                    t[r[n]] = e[r[n]];
                  return t;
                });
            }).call(
              this,
              t('_process'),
              'undefined' != typeof global
                ? global
                : 'undefined' != typeof self
                ? self
                : 'undefined' != typeof window
                ? window
                : {}
            );
          },
          { './support/isBuffer': 223, _process: 188, inherits: 167 },
        ],
      },
      {},
      [2]
    )(2);
  });
var PdfLineCapStyle;
!(function (t) {
  (t[(t.Butt = 0)] = 'Butt'),
    (t[(t.Round = 1)] = 'Round'),
    (t[(t.Square = 2)] = 'Square');
})(
  (PdfLineCapStyle = exports.PdfLineCapStyle || (exports.PdfLineCapStyle = {}))
);
var PdfLineJoinStyle;
!(function (t) {
  (t[(t.Miter = 0)] = 'Miter'),
    (t[(t.Round = 1)] = 'Round'),
    (t[(t.Bevel = 2)] = 'Bevel');
})(
  (PdfLineJoinStyle =
    exports.PdfLineJoinStyle || (exports.PdfLineJoinStyle = {}))
);
var PdfFillRule;
!(function (t) {
  (t[(t.NonZero = 0)] = 'NonZero'), (t[(t.EvenOdd = 1)] = 'EvenOdd');
})((PdfFillRule = exports.PdfFillRule || (exports.PdfFillRule = {})));
var PdfPageOrientation;
!(function (t) {
  (t[(t.Portrait = 0)] = 'Portrait'), (t[(t.Landscape = 1)] = 'Landscape');
})(
  (PdfPageOrientation =
    exports.PdfPageOrientation || (exports.PdfPageOrientation = {}))
);
var PdfImageHorizontalAlign;
!(function (t) {
  (t[(t.Left = 0)] = 'Left'),
    (t[(t.Center = 1)] = 'Center'),
    (t[(t.Right = 2)] = 'Right');
})(
  (PdfImageHorizontalAlign =
    exports.PdfImageHorizontalAlign || (exports.PdfImageHorizontalAlign = {}))
);
var PdfImageVerticalAlign;
!(function (t) {
  (t[(t.Top = 0)] = 'Top'),
    (t[(t.Center = 1)] = 'Center'),
    (t[(t.Bottom = 2)] = 'Bottom');
})(
  (PdfImageVerticalAlign =
    exports.PdfImageVerticalAlign || (exports.PdfImageVerticalAlign = {}))
);
var PdfTextHorizontalAlign;
!(function (t) {
  (t[(t.Left = 0)] = 'Left'),
    (t[(t.Center = 1)] = 'Center'),
    (t[(t.Right = 2)] = 'Right'),
    (t[(t.Justify = 3)] = 'Justify');
})(
  (PdfTextHorizontalAlign =
    exports.PdfTextHorizontalAlign || (exports.PdfTextHorizontalAlign = {}))
);
var _PdfTextBaseline;
!(function (t) {
  (t[(t.Top = 0)] = 'Top'), (t[(t.Alphabetic = 1)] = 'Alphabetic');
})(
  (_PdfTextBaseline =
    exports._PdfTextBaseline || (exports._PdfTextBaseline = {}))
);
var PdfPageSize;
!(function (t) {
  (t[(t.A0 = 0)] = 'A0'),
    (t[(t.A1 = 1)] = 'A1'),
    (t[(t.A2 = 2)] = 'A2'),
    (t[(t.A3 = 3)] = 'A3'),
    (t[(t.A4 = 4)] = 'A4'),
    (t[(t.A5 = 5)] = 'A5'),
    (t[(t.A6 = 6)] = 'A6'),
    (t[(t.A7 = 7)] = 'A7'),
    (t[(t.A8 = 8)] = 'A8'),
    (t[(t.A9 = 9)] = 'A9'),
    (t[(t.A10 = 10)] = 'A10'),
    (t[(t.B0 = 11)] = 'B0'),
    (t[(t.B1 = 12)] = 'B1'),
    (t[(t.B2 = 13)] = 'B2'),
    (t[(t.B3 = 14)] = 'B3'),
    (t[(t.B4 = 15)] = 'B4'),
    (t[(t.B5 = 16)] = 'B5'),
    (t[(t.B6 = 17)] = 'B6'),
    (t[(t.B7 = 18)] = 'B7'),
    (t[(t.B8 = 19)] = 'B8'),
    (t[(t.B9 = 20)] = 'B9'),
    (t[(t.B10 = 21)] = 'B10'),
    (t[(t.C0 = 22)] = 'C0'),
    (t[(t.C1 = 23)] = 'C1'),
    (t[(t.C2 = 24)] = 'C2'),
    (t[(t.C3 = 25)] = 'C3'),
    (t[(t.C4 = 26)] = 'C4'),
    (t[(t.C5 = 27)] = 'C5'),
    (t[(t.C6 = 28)] = 'C6'),
    (t[(t.C7 = 29)] = 'C7'),
    (t[(t.C8 = 30)] = 'C8'),
    (t[(t.C9 = 31)] = 'C9'),
    (t[(t.C10 = 32)] = 'C10'),
    (t[(t.RA0 = 33)] = 'RA0'),
    (t[(t.RA1 = 34)] = 'RA1'),
    (t[(t.RA2 = 35)] = 'RA2'),
    (t[(t.RA3 = 36)] = 'RA3'),
    (t[(t.RA4 = 37)] = 'RA4'),
    (t[(t.SRA0 = 38)] = 'SRA0'),
    (t[(t.SRA1 = 39)] = 'SRA1'),
    (t[(t.SRA2 = 40)] = 'SRA2'),
    (t[(t.SRA3 = 41)] = 'SRA3'),
    (t[(t.SRA4 = 42)] = 'SRA4'),
    (t[(t.Executive = 43)] = 'Executive'),
    (t[(t.Folio = 44)] = 'Folio'),
    (t[(t.Legal = 45)] = 'Legal'),
    (t[(t.Letter = 46)] = 'Letter'),
    (t[(t.Tabloid = 47)] = 'Tabloid');
})((PdfPageSize = exports.PdfPageSize || (exports.PdfPageSize = {}))),
  (exports._Errors = {
    InvalidArg: function (t) {
      return 'Invalid argument: "' + t + '".';
    },
    InvalidFormat: function (t) {
      return '"' + t + '" is not in the correct format.';
    },
    ValueCannotBeEmpty: function (t) {
      return 'Value cannot be empty: "' + t + '".';
    },
    PathStarted:
      'This method can not be used until the current path is finished.',
    BufferPagesMustBeEnabled:
      'The bufferPages property must be enabled to render headers and footers.',
    AbstractMethod: 'This is an abstract method, it should not be called.',
    FontNameMustBeSet: 'The font name must be set.',
    FontSourceMustBeStringArrayBuffer:
      'The font source must be of type string or ArrayBuffer.',
    FontSourceMustBeString: 'The font source must be of type string.',
    FontSourceMustBeArrayBuffer: 'The font source must be of type ArrayBuffer.',
    EmptyUrl: 'URL can not be empty.',
    UndefinedMimeType: 'MIME-type must be set.',
    InvalidImageDataUri:
      'Invalid Data URI. It should be base64 encoded string that represents JPG or PNG image.',
    InvalidImageFormat:
      'Invalid image format. Only JPG and PNG formats are supported.',
  }),
  (exports._IE = 'ActiveXObject' in window);
var _FontSizePt = {
  'xx-small': 7,
  'x-small': 7.5,
  small: 10,
  medium: 12,
  large: 13.5,
  'x-large': 18,
  'xx-large': 24,
};
(exports.saveBlob = saveBlob),
  (exports.ptToPx = ptToPx),
  (exports.pxToPt = pxToPt),
  (exports._asColor = _asColor),
  (exports._asPdfPen = _asPdfPen),
  (exports._asPdfBrush = _asPdfBrush),
  (exports._asPdfFont = _asPdfFont),
  (exports._asPt = _asPt),
  (exports._formatMacros = _formatMacros),
  (exports._compare = _compare),
  (exports._shallowCopy = _shallowCopy),
  (exports._toTitleCase = _toTitleCase);
var PdfDashPattern = (function () {
  function t(t, e, r) {
    void 0 === t && (t = null),
      void 0 === e && (e = t),
      void 0 === r && (r = 0),
      (this.dash = t),
      (this.gap = e),
      (this.phase = r);
  }
  return (
    Object.defineProperty(t.prototype, 'dash', {
      get: function () {
        return this._dash;
      },
      set: function (t) {
        this._dash = wjcCore.asNumber(t, !0, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'gap', {
      get: function () {
        return this._gap;
      },
      set: function (t) {
        this._gap = wjcCore.asNumber(t, !0, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'phase', {
      get: function () {
        return this._phase;
      },
      set: function (t) {
        this._phase = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.clone = function () {
      return new t(this._dash, this._gap, this._phase);
    }),
    (t.prototype.equals = function (e) {
      return (
        e instanceof t &&
        this._dash === e.dash &&
        this._gap === e.gap &&
        this._phase === e.phase
      );
    }),
    t
  );
})();
exports.PdfDashPattern = PdfDashPattern;
var PdfBrush = (function () {
  function t() {}
  return (
    (t.prototype.clone = function () {
      throw exports._Errors.AbstractMethod;
    }),
    (t.prototype.equals = function (t) {
      throw exports._Errors.AbstractMethod;
    }),
    (t.prototype._getBrushObject = function (t) {
      throw exports._Errors.AbstractMethod;
    }),
    t
  );
})();
exports.PdfBrush = PdfBrush;
var PdfGradientStop = (function () {
  function t(t, e, r) {
    (this.offset = t || 0),
      (this.color = e || wjcCore.Color.fromRgba(0, 0, 0)),
      (this.opacity = null == r ? 1 : r);
  }
  return (
    Object.defineProperty(t.prototype, 'offset', {
      get: function () {
        return this._offset;
      },
      set: function (t) {
        this._offset = wjcCore.clamp(wjcCore.asNumber(t, !1, !0), 0, 1);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'color', {
      get: function () {
        return this._color;
      },
      set: function (t) {
        this._color = _asColor(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'opacity', {
      get: function () {
        return this._opacity;
      },
      set: function (t) {
        this._opacity = wjcCore.clamp(wjcCore.asNumber(t, !1, !0), 0, 1);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.clone = function () {
      return new t(this.offset, this.color, this.opacity);
    }),
    (t.prototype.equals = function (e) {
      return (
        e instanceof t &&
        this._offset === e._offset &&
        this._color.equals(e._color) &&
        this._opacity === e._opacity
      );
    }),
    t
  );
})();
exports.PdfGradientStop = PdfGradientStop;
var PdfGradientBrush = (function (t) {
  function e(e, r) {
    var n = t.call(this) || this;
    return (n.stops = e || []), (n.opacity = null == r ? 1 : r), n;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'opacity', {
      get: function () {
        return this._opacity;
      },
      set: function (t) {
        this._opacity = wjcCore.clamp(wjcCore.asNumber(t, !1, !0), 0, 1);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'stops', {
      get: function () {
        return this._stops;
      },
      set: function (t) {
        wjcCore.assert(wjcCore.isArray(t), exports._Errors.InvalidArg('value')),
          (this._stops = this._cloneStopsArray(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.equals = function (t) {
      return (
        t instanceof e &&
        this._opacity === t.opacity &&
        _compare(this._stops, t._stops)
      );
    }),
    (e.prototype._cloneStopsArray = function (t) {
      for (var e = [], r = 0; r < t.length; r++) {
        var n = t[r];
        wjcCore.assert(
          n instanceof PdfGradientStop,
          exports._Errors.InvalidArg('stops[' + r + ']')
        ),
          e.push(t[r].clone());
      }
      return e;
    }),
    e
  );
})(PdfBrush);
exports.PdfGradientBrush = PdfGradientBrush;
var PdfLinearGradientBrush = (function (t) {
  function e(e, r, n, i, o, a) {
    var s = t.call(this, o, a) || this;
    return (s.x1 = e), (s.y1 = r), (s.x2 = n), (s.y2 = i), s;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'x1', {
      get: function () {
        return this._x1;
      },
      set: function (t) {
        this._x1 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'y1', {
      get: function () {
        return this._y1;
      },
      set: function (t) {
        this._y1 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'x2', {
      get: function () {
        return this._x2;
      },
      set: function (t) {
        this._x2 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'y2', {
      get: function () {
        return this._y2;
      },
      set: function (t) {
        this._y2 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.clone = function () {
      return new e(
        this._x1,
        this._y1,
        this._x2,
        this._y2,
        this.stops,
        this.opacity
      );
    }),
    (e.prototype.equals = function (r) {
      return (
        r instanceof e &&
        this._x1 === r._x1 &&
        this._y1 === r._y1 &&
        this._x2 === r._x2 &&
        this._y2 === r._y2 &&
        t.prototype.equals.call(this, r)
      );
    }),
    (e.prototype._getBrushObject = function (t) {
      for (
        var e = t._pdfdoc._document.linearGradient(
            this._x1 + t._offset.x,
            this._y1 + t._offset.y,
            this._x2 + t._offset.x,
            this._y2 + t._offset.y
          ),
          r = this.stops,
          n = 0;
        n < r.length;
        n++
      ) {
        var i = r[n];
        i && e.stop(i.offset, [i.color.r, i.color.g, i.color.b], i.color.a);
      }
      return e;
    }),
    e
  );
})(PdfGradientBrush);
exports.PdfLinearGradientBrush = PdfLinearGradientBrush;
var PdfRadialGradientBrush = (function (t) {
  function e(e, r, n, i, o, a, s, u) {
    var l = t.call(this, s, u) || this;
    return (
      (l.x1 = e), (l.y1 = r), (l.r1 = n), (l.x2 = i), (l.y2 = o), (l.r2 = a), l
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'x1', {
      get: function () {
        return this._x1;
      },
      set: function (t) {
        this._x1 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'y1', {
      get: function () {
        return this._y1;
      },
      set: function (t) {
        this._y1 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'r1', {
      get: function () {
        return this._r1;
      },
      set: function (t) {
        this._r1 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'x2', {
      get: function () {
        return this._x2;
      },
      set: function (t) {
        this._x2 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'y2', {
      get: function () {
        return this._y2;
      },
      set: function (t) {
        this._y2 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'r2', {
      get: function () {
        return this._r2;
      },
      set: function (t) {
        this._r2 = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.clone = function () {
      return new e(
        this._x1,
        this._y1,
        this._r1,
        this._x2,
        this._y2,
        this._r2,
        this.stops,
        this.opacity
      );
    }),
    (e.prototype.equals = function (r) {
      return (
        r instanceof e &&
        this._x1 === r._x1 &&
        this._y1 === r._y1 &&
        this._r1 === r._r1 &&
        this._x2 === r._x2 &&
        this._y2 === r._y2 &&
        this._r2 === r._r2 &&
        t.prototype.equals.call(this, r)
      );
    }),
    (e.prototype._getBrushObject = function (t) {
      for (
        var e = t._pdfdoc._document.radialGradient(
            this._x1 + t._offset.x,
            this._y2 + t._offset.y,
            this._r1,
            this._x2 + t._offset.x,
            this._y2 + t._offset.y,
            this._r2
          ),
          r = this.stops,
          n = 0;
        n < r.length;
        n++
      ) {
        var i = r[n];
        i && e.stop(i.offset, [i.color.r, i.color.g, i.color.b], i.color.a);
      }
      return e;
    }),
    e
  );
})(PdfGradientBrush);
exports.PdfRadialGradientBrush = PdfRadialGradientBrush;
var PdfSolidBrush = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    return (r.color = e || wjcCore.Color.fromRgba(0, 0, 0)), r;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'color', {
      get: function () {
        return this._color;
      },
      set: function (t) {
        this._color = _asColor(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.clone = function () {
      return new e(this._color);
    }),
    (e.prototype.equals = function (t) {
      return t instanceof e && this._color.equals(t._color);
    }),
    (e.prototype._getBrushObject = function (t) {
      return this._color;
    }),
    e
  );
})(PdfBrush);
exports.PdfSolidBrush = PdfSolidBrush;
var PdfPen = (function () {
  function t(t, e, r, n, i, o) {
    if (
      (null == t && (t = wjcCore.Color.fromRgba(0, 0, 0)),
      null == e && (e = 1),
      null == r && (r = new PdfDashPattern(null, null, 0)),
      null == n && (n = PdfLineCapStyle.Butt),
      null == i && (i = PdfLineJoinStyle.Miter),
      null == o && (o = 10),
      !wjcCore.isObject(t) ||
        t instanceof wjcCore.Color ||
        t instanceof PdfBrush)
    )
      t instanceof PdfBrush ? (this.brush = t) : (this.color = t),
        (this.width = e),
        (this.cap = n),
        (this.join = i),
        (this.miterLimit = o),
        (this.dashPattern = r);
    else {
      var a = t;
      (this.color = a.color),
        (this.brush = a.brush),
        (this.width = null != a.width ? a.width : e),
        (this.cap = null != a.cap ? a.cap : n),
        (this.join = null != a.join ? a.join : i),
        (this.miterLimit = null != a.miterLimit ? a.miterLimit : o),
        (this.dashPattern = a.dashPattern || r);
    }
    this._color = this._color || wjcCore.Color.fromRgba(0, 0, 0);
  }
  return (
    Object.defineProperty(t.prototype, 'color', {
      get: function () {
        return this._color;
      },
      set: function (t) {
        this._color = _asColor(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'brush', {
      get: function () {
        return this._brush;
      },
      set: function (t) {
        (t = _asPdfBrush(t, !0)), (this._brush = t ? t.clone() : null);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'width', {
      get: function () {
        return this._width;
      },
      set: function (t) {
        this._width = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'cap', {
      get: function () {
        return this._cap;
      },
      set: function (t) {
        this._cap = wjcCore.asEnum(t, PdfLineCapStyle);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'join', {
      get: function () {
        return this._join;
      },
      set: function (t) {
        this._join = wjcCore.asEnum(t, PdfLineJoinStyle);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'miterLimit', {
      get: function () {
        return this._miterLimit;
      },
      set: function (t) {
        this._miterLimit = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dashPattern', {
      get: function () {
        return this._dashPattern;
      },
      set: function (t) {
        wjcCore.assert(
          t instanceof PdfDashPattern,
          exports._Errors.InvalidArg('value')
        ),
          (this._dashPattern = t.clone());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.clone = function () {
      var e = new t(
        this._color,
        this._width,
        this._dashPattern,
        this._cap,
        this._join,
        this._miterLimit
      );
      return (e.brush = this._brush), e;
    }),
    (t.prototype.equals = function (e) {
      return (
        e instanceof t &&
        this._color.equals(e._color) &&
        (this._brush
          ? this._brush.equals(e._brush)
          : this._brush === e._brush) &&
        this._width === e._width &&
        this._cap === e._cap &&
        this._join === e._join &&
        this._miterLimit === e._miterLimit &&
        this._dashPattern.equals(e._dashPattern)
      );
    }),
    t
  );
})();
exports.PdfPen = PdfPen;
var PdfFont = (function () {
  function t(t, e, r, n) {
    void 0 === t && (t = 'times'),
      void 0 === e && (e = 10),
      void 0 === r && (r = 'normal'),
      void 0 === n && (n = 'normal'),
      (this.family = t),
      (this.size = e),
      (this.style = r),
      (this.weight = n);
  }
  return (
    Object.defineProperty(t.prototype, 'family', {
      get: function () {
        return this._family;
      },
      set: function (t) {
        this._family = wjcCore.asString(t, !1);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'size', {
      get: function () {
        return this._size;
      },
      set: function (t) {
        this._size = wjcCore.asNumber(t, !1, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'style', {
      get: function () {
        return this._style;
      },
      set: function (e) {
        (e = wjcCore.asString(e, !1)) &&
          wjcCore.assert(
            !!t._KNOWN_STYLES[(e || '').toLowerCase()],
            exports._Errors.InvalidArg('value')
          ),
          (this._style = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'weight', {
      get: function () {
        return this._weight;
      },
      set: function (e) {
        (e = wjcCore.asString(e, !1)) &&
          wjcCore.assert(
            !!t._KNOWN_WEIGHTS[(e || '').toLowerCase()],
            exports._Errors.InvalidArg('value')
          ),
          (this._weight = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.clone = function () {
      return new t(this.family, this.size, this.style, this.weight);
    }),
    (t.prototype.equals = function (e) {
      return (
        e instanceof t &&
        this._family === e._family &&
        this._size === e._size &&
        this._style === e._style &&
        this._weight === e._weight
      );
    }),
    (t._DEF_NATIVE_NAME = 'Times-Roman'),
    (t._DEF_FAMILY_NAME = 'times'),
    (t._KNOWN_WEIGHTS = {
      normal: 1,
      bold: 1,
      100: 1,
      200: 1,
      300: 1,
      400: 1,
      500: 1,
      600: 1,
      700: 1,
      800: 1,
      900: 1,
    }),
    (t._KNOWN_STYLES = { normal: 1, italic: 1, oblique: 1 }),
    (t._DEF_PDFKIT_FONT = new t('helvetica', 12)),
    (t._DEF_FONT = new t()),
    t
  );
})();
exports.PdfFont = PdfFont;
var _OrderedDictionary = (function () {
    function t(t) {
      if (((this._values = []), (this._keys = {}), t))
        for (var e = 0; e < t.length; e++) {
          var r = t[e];
          (this._keys[r.key] = e),
            this._values.push({ key: r.key, value: r.value });
        }
    }
    return (
      (t.prototype.hasKey = function (t) {
        var e = this._keys[t];
        return void 0 !== e ? this._values[e].value : null;
      }),
      (t.prototype.add = function (t, e) {
        return this.hasKey(t)
          ? null
          : ((this._keys[t] = this._values.length),
            this._values.push({ key: t, value: e }),
            e);
      }),
      (t.prototype.each = function (t) {
        if (t)
          for (var e = 0; e < this._values.length; e++) {
            var r = this._values[e];
            if (!1 === t(r.key, r.value)) break;
          }
      }),
      (t.prototype.eachReverse = function (t) {
        if (t)
          for (var e = this._values.length - 1; e >= 0; e--) {
            var r = this._values[e];
            if (!1 === t(r.key, r.value)) break;
          }
      }),
      t
    );
  })(),
  _PdfFontRegistrar = (function () {
    function t(t) {
      var e = this;
      (this._fonts = new _OrderedDictionary([
        {
          key: 'zapfdingbats',
          value: {
            attributes: { fantasy: !0 },
            normal: { 400: 'ZapfDingbats' },
          },
        },
        {
          key: 'symbol',
          value: {
            attributes: { serif: !0 },
            normal: { 400: 'Symbol' },
          },
        },
        {
          key: 'courier',
          value: {
            attributes: { serif: !0, monospace: !0 },
            normal: { 400: 'Courier', 700: 'Courier-Bold' },
            oblique: {
              400: 'Courier-Oblique',
              700: 'Courier-BoldOblique',
            },
          },
        },
        {
          key: 'helvetica',
          value: {
            attributes: { sansSerif: !0 },
            normal: { 400: 'Helvetica', 700: 'Helvetica-Bold' },
            oblique: {
              400: 'Helvetica-Oblique',
              700: 'Helvetica-BoldOblique',
            },
          },
        },
        {
          key: 'times',
          value: {
            attributes: { serif: !0 },
            normal: { 400: 'Times-Roman', 700: 'Times-Bold' },
            italic: {
              400: 'Times-Italic',
              700: 'Times-BoldItalic',
            },
          },
        },
      ])),
        (this._weightNameToNum = { normal: 400, bold: 700 }),
        (this._findFontCache = {}),
        (this._internalFontNames = {}),
        (this._doc = t),
        this._fonts.each(function (t, r) {
          var n = function (t) {
            for (var r in t) e._internalFontNames[t[r]] = 1;
          };
          n(r.normal) || n(r.italic) || n(r.oblique);
        });
    }
    return (
      (t.prototype.registerFont = function (t) {
        wjcCore.assert(!!t, exports._Errors.ValueCannotBeEmpty('font')),
          wjcCore.asString(t.name),
          wjcCore.assert(
            t.source instanceof ArrayBuffer,
            exports._Errors.FontSourceMustBeArrayBuffer
          ),
          (t = _shallowCopy(t));
        var e = this._normalizeFontSelector(t.name, t.style, t.weight),
          r = this._fonts.hasKey(e.name);
        r || (r = this._fonts.add(e.name, { attributes: t }));
        var n = r[e.style];
        n || (n = r[e.style] = {});
        var i = this._makeInternalName(e);
        return (
          n[e.weight] ||
            (this._doc.registerFont(i, t.source, t.family),
            (this._findFontCache = {}),
            (n[e.weight] = i),
            (this._internalFontNames[i] = 1)),
          i
        );
      }),
      (t.prototype.findFont = function (t, e, r) {
        var n = this._normalizeFontSelector(t, e, r),
          i = this._makeInternalName(n);
        if (this._findFontCache[i]) return this._findFontCache[i];
        n.name += ',' + PdfFont._DEF_FAMILY_NAME;
        for (var o = 0, a = n.name.split(','); o < a.length; o++) {
          var s = this._findFont(
            a[o].replace(/["']/g, '').trim(),
            n.style,
            n.weight
          );
          if (s) return (this._findFontCache[i] = s);
        }
        return (this._findFontCache[i] = this._internalFontNames[t]
          ? t
          : PdfFont._DEF_NATIVE_NAME);
      }),
      (t.prototype._normalizeFontSelector = function (t, e, r) {
        return {
          name: (t || '').toLowerCase(),
          style: (e || PdfFont._DEF_FONT.style).toLowerCase(),
          weight:
            parseInt(this._weightNameToNum[r] || r) ||
            parseInt(this._weightNameToNum[PdfFont._DEF_FONT.weight]),
        };
      }),
      (t.prototype._findFont = function (t, e, r) {
        var n,
          i = this,
          o = [];
        switch (e) {
          case 'italic':
            o = ['italic', 'oblique', 'normal'];
            break;
          case 'oblique':
            o = ['oblique', 'italic', 'normal'];
            break;
          default:
            o = ['normal', 'oblique', 'italic'];
        }
        switch (t) {
          case 'cursive':
          case 'fantasy':
          case 'monospace':
          case 'serif':
          case 'sans-serif':
            this._fonts.eachReverse(function (e, a) {
              var s = 'sans-serif' === t ? 'sansSerif' : t;
              if (a.attributes[s])
                for (var u = 0; u < o.length; u++)
                  if ((n = i._findFontWeightFallback(e, o[u], r))) return !1;
            });
            break;
          default:
            if (this._fonts.hasKey(t))
              for (var a = 0; a < o.length && !n; a++)
                n = this._findFontWeightFallback(t, o[a], r);
        }
        return n;
      }),
      (t.prototype._findFontWeightFallback = function (t, e, r, n) {
        var i = this._fonts.hasKey(t);
        if (i && i[e]) {
          var o = i[e];
          if (o[r]) return o[r];
          if (!n) {
            n = [];
            for (var a in o) n.push(parseFloat(a));
            n.sort(function (t, e) {
              return t - e;
            });
          }
          if (r > 500) {
            for (var s = 0, u = 0; u < n.length; u++) {
              if ((c = n[u]) > r) return o[c];
              s = c;
            }
            if (s) return o[s];
          } else {
            if (!(r < 400))
              return 400 == r
                ? o[500]
                  ? o[500]
                  : this._findFontWeightFallback(t, e, 300, n)
                : o[400]
                ? o[400]
                : this._findFontWeightFallback(t, e, 300, n);
            for (var l = 0, u = n.length - 1; u >= 0; u--) {
              var c = n[u];
              if (c < r) return o[c];
              l = c;
            }
            if (l) return o[l];
          }
        }
        return null;
      }),
      (t.prototype._makeInternalName = function (t) {
        return t.name + '-' + t.style + '-' + t.weight;
      }),
      t
    );
  })();
exports._PdfFontRegistrar = _PdfFontRegistrar;
var PdfPageArea = (function () {
  function t() {
    this._ctxProps = { xo: 0, yo: 0, lineGap: 0 };
  }
  return (
    Object.defineProperty(t.prototype, 'x', {
      get: function () {
        this._switchCtx();
        var t = this._pdfdoc._document.x - this._offset.x;
        return this._saveCtx(), t;
      },
      set: function (t) {
        (t = wjcCore.asNumber(t)),
          this._switchCtx(),
          (this._pdfdoc._document.x = t + this._offset.x),
          this._saveCtx();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'y', {
      get: function () {
        this._switchCtx();
        var t = this._pdfdoc._document.y - this._offset.y;
        return this._saveCtx(), t;
      },
      set: function (t) {
        (t = wjcCore.asNumber(t)),
          this._switchCtx(),
          (this._pdfdoc._document.y = t + this._offset.y),
          this._saveCtx();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'lineGap', {
      get: function () {
        return this._ctxProps.lineGap;
      },
      set: function (t) {
        (this._ctxProps.lineGap = t = wjcCore.asNumber(t, !1, !0)),
          this._pdfdoc &&
            this._pdfdoc._document &&
            (this._switchCtx(),
            this._pdfdoc._document.lineGap(t),
            this._saveCtx());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'height', {
      get: function () {
        var t = this._pdfdoc._document.page;
        return Math.max(0, t.height - t.margins.top - t.margins.bottom);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'width', {
      get: function () {
        var t = this._pdfdoc._document.page;
        return Math.max(t.width - t.margins.left - t.margins.right);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'paths', {
      get: function () {
        return this._graphics;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.drawText = function (t, e, r, n) {
      if ((this._assertPathStarted(), (t = wjcCore.asString(t)))) {
        n = n || {};
        var i,
          o = this._pdfdoc,
          a = o._document,
          s = n.stroke && n.fill ? 2 : n.stroke ? 1 : 0;
        (!n.strike && !n.underline) || n.stroke || (s = 2), this._switchCtx();
        try {
          (this._drawingText = !0),
            1 & s || o._toggleBrush(_asPdfBrush(n.brush)),
            3 & s && o._togglePen(_asPdfPen(n.pen)),
            o._toggleFont(_asPdfFont(n.font));
          var u = this._textOptionsToNative(n),
            l =
              n._baseline === _PdfTextBaseline.Alphabetic
                ? a.currentFontAscender()
                : 0;
          null == e
            ? ((a.y -= l), (i = a.textAndMeasure(t, null, null, u)))
            : (i = a.textAndMeasure(
                t,
                wjcCore.asNumber(e) + this._offset.x,
                wjcCore.asNumber(r) + this._offset.y - l,
                u
              ));
        } finally {
          (this._drawingText = !1), this._saveCtx();
        }
        return {
          charCount: i.charCount || 0,
          size: new wjcCore.Size(i.width || 0, i.height || 0),
        };
      }
    }),
    (t.prototype.drawImage = function (t, e, r, n) {
      if ((this._assertPathStarted(), !(t = wjcCore.asString(t)))) return this;
      var i = _PdfImageHelper.getDataUri(t);
      this._switchCtx();
      try {
        var o = {};
        if (n) {
          switch (wjcCore.asEnum(n.align, PdfImageHorizontalAlign, !0)) {
            case PdfImageHorizontalAlign.Center:
              o.align = 'center';
              break;
            case PdfImageHorizontalAlign.Right:
              o.align = 'right';
              break;
            default:
              o.align = 'left';
          }
          switch (wjcCore.asEnum(n.vAlign, PdfImageVerticalAlign, !0)) {
            case PdfImageVerticalAlign.Center:
              o.valign = 'center';
              break;
            case PdfImageVerticalAlign.Bottom:
              o.valign = 'bottom';
              break;
            default:
              o.valign = 'top';
          }
          var a = wjcCore.asNumber(n.width, !0, !0),
            s = wjcCore.asNumber(n.height, !0, !0);
          a && s && wjcCore.asBoolean(n.stretchProportionally, !0)
            ? (o.fit = [a, s])
            : ((o.width = a), (o.height = s));
        }
        null == e
          ? this._pdfdoc._document.image(i, o)
          : this._pdfdoc._document.image(
              i,
              wjcCore.asNumber(e) + this._offset.x,
              wjcCore.asNumber(r) + this._offset.y,
              o
            );
      } finally {
        this._saveCtx();
      }
      return this;
    }),
    (t.prototype.drawSvg = function (t, e, r, n) {
      if (
        ((n = n || {}), this._assertPathStarted(), !(t = wjcCore.asString(t)))
      )
        return this;
      var i;
      if (t.indexOf('data:image/svg') >= 0)
        i = (function (t) {
          return decodeURIComponent(
            Array.prototype.map
              .call(atob(t), function (t) {
                return '%' + ('00' + t.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
          );
        })(t.substring(t.indexOf(',') + 1));
      else {
        var o;
        (i = _XhrHelper.text(t, function (t) {
          return (o = t.statusText);
        })),
          wjcCore.assert(null == o, o);
      }
      if (!i) return this;
      var a,
        s,
        u = new _SvgRenderer(i, this, wjcCore.asFunction(n.urlResolver)),
        l = null == r,
        e = null != e ? e : this.x,
        r = null != r ? r : this.y,
        c = this.y,
        h = this.x,
        f = wjcCore.asNumber(n.width, !0, !0),
        d = wjcCore.asNumber(n.height, !0, !0),
        p = u.root.width.hasVal ? u.root.width.val : void 0,
        g = u.root.height.hasVal ? u.root.height.val : void 0;
      if ((f || d) && p && g)
        if (((a = f / p), (s = d / g), f && d)) {
          if (n.stretchProportionally) {
            var _ = Math.min(a, s);
            if (a === _)
              switch (wjcCore.asEnum(n.vAlign, PdfImageVerticalAlign, !0)) {
                case PdfImageVerticalAlign.Center:
                  r += d / 2 - (g * a) / 2;
                  break;
                case PdfImageVerticalAlign.Bottom:
                  r += d - g * a;
              }
            if (s === _)
              switch (wjcCore.asEnum(n.align, PdfImageHorizontalAlign, !0)) {
                case PdfImageHorizontalAlign.Center:
                  e += f / 2 - (p * s) / 2;
                  break;
                case PdfImageHorizontalAlign.Right:
                  e += f - p * s;
              }
            a = s = _;
          }
        } else n.width ? (s = a) : (a = s);
      (a = a || 1), (s = s || 1), this._switchCtx(), this._pdfdoc.saveState();
      try {
        this.translate(e, r), this.scale(a, s), u.render();
      } finally {
        this._pdfdoc.restoreState(), this._saveCtx();
      }
      if (((this.x = h), (this.y = c), l)) {
        var v = null != d ? d : null != g ? g * s : void 0;
        this.y += v || 0;
      }
      return this;
    }),
    (t.prototype.lineHeight = function (t) {
      var e = this._pdfdoc;
      e._toggleFont(_asPdfFont(t)), this._switchCtx();
      var r = e._document.currentLineHeight();
      return this._saveCtx(), r;
    }),
    (t.prototype.measureText = function (t, e, r) {
      var n = {};
      if ((t = wjcCore.asString(t))) {
        var i = this._pdfdoc;
        i._toggleFont(_asPdfFont(e)), this._switchCtx();
        try {
          n = i._document.textAndMeasure(
            t,
            null,
            null,
            this._textOptionsToNative(r),
            !0
          );
        } finally {
          this._saveCtx();
        }
      }
      return {
        charCount: n.charCount || 0,
        size: new wjcCore.Size(n.width || 0, n.height || 0),
      };
    }),
    (t.prototype.moveDown = function (t, e) {
      if ((void 0 === t && (t = 1), (t = wjcCore.asNumber(t, !1, !0)))) {
        var r = this._pdfdoc;
        r._toggleFont(_asPdfFont(e)), this._switchCtx();
        try {
          r._document.moveDown(t);
        } finally {
          this._saveCtx();
        }
      }
      return this;
    }),
    (t.prototype.moveUp = function (t, e) {
      if ((void 0 === t && (t = 1), (t = wjcCore.asNumber(t, !1, !0)))) {
        var r = this._pdfdoc;
        r._toggleFont(_asPdfFont(e)), this._switchCtx();
        try {
          r._document.moveUp(t);
        } finally {
          this._saveCtx();
        }
      }
      return this;
    }),
    (t.prototype.scale = function (t, e, r) {
      void 0 === e && (e = t),
        this._assertPathStarted(),
        (r = r || new wjcCore.Point(0, 0));
      var n = wjcCore.asNumber(r.x) + this._offset.x,
        i = wjcCore.asNumber(r.y) + this._offset.y;
      return (
        (t = wjcCore.asNumber(t, !1)),
        (e = wjcCore.asNumber(e, !1)),
        this._pdfdoc._document.scale(t, e, { origin: [n, i] }),
        this
      );
    }),
    (t.prototype.translate = function (t, e) {
      return (
        this._assertPathStarted(),
        (t = wjcCore.asNumber(t)),
        (e = wjcCore.asNumber(e)),
        this._pdfdoc._document.translate(t, e),
        this
      );
    }),
    (t.prototype.transform = function (t, e, r, n, i, o) {
      this._assertPathStarted(),
        (t = wjcCore.asNumber(t)),
        (e = wjcCore.asNumber(e)),
        (r = wjcCore.asNumber(r)),
        (n = wjcCore.asNumber(n)),
        (i = wjcCore.asNumber(i)),
        (o = wjcCore.asNumber(o));
      var a = this._offset.x,
        s = this._offset.y;
      return (
        this._pdfdoc._document.transform(
          t,
          e,
          r,
          n,
          i - t * a + a - r * s,
          o - e * a - n * s + s
        ),
        this
      );
    }),
    (t.prototype.rotate = function (t, e) {
      this._assertPathStarted(), (e = e || new wjcCore.Point(0, 0));
      var r = wjcCore.asNumber(e.x) + this._offset.x,
        n = wjcCore.asNumber(e.y) + this._offset.y;
      return (
        (t = wjcCore.asNumber(t)),
        this._pdfdoc._document.rotate(t, { origin: [r, n] }),
        this
      );
    }),
    (t.prototype._assertPathStarted = function () {
      wjcCore.assert(!this.paths._hasPathBuffer(), exports._Errors.PathStarted);
    }),
    (t.prototype._initialize = function (t, e, r) {
      (this._pdfdoc = t),
        (this._offset = new wjcCore.Point(e, r)),
        (this._ctxProps = {
          xo: e,
          yo: r,
          lineGap: this._ctxProps.lineGap,
        }),
        (this._graphics = new PdfPaths(this._pdfdoc, this._offset));
    }),
    (t.prototype._isDrawingText = function () {
      return this._drawingText;
    }),
    (t.prototype._switchCtx = function () {
      this._pdfdoc._switchTextFlowCtx(this._ctxProps);
    }),
    (t.prototype._saveCtx = function () {
      this._ctxProps = this._pdfdoc._getTextFlowCtxState();
    }),
    (t.prototype._textOptionsToNative = function (t) {
      var e = _shallowCopy((t = t || {}));
      return (
        null != t.align &&
          (e.align = (
            PdfTextHorizontalAlign[
              wjcCore.asEnum(t.align, PdfTextHorizontalAlign)
            ] || ''
          ).toLowerCase()),
        e
      );
    }),
    t
  );
})();
exports.PdfPageArea = PdfPageArea;
var PdfRunningTitleDeclarativeContent = (function () {
  function t(t, e, r) {
    (this.text = t || ''),
      (this.font = e || new PdfFont()),
      (this.brush = r || new PdfSolidBrush());
  }
  return (
    Object.defineProperty(t.prototype, 'font', {
      get: function () {
        return this._font;
      },
      set: function (t) {
        (t = _asPdfFont(t, !0)), (this._font = t ? t.clone() : t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'text', {
      get: function () {
        return this._text;
      },
      set: function (t) {
        this._text = wjcCore.asString(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'brush', {
      get: function () {
        return this._brush;
      },
      set: function (t) {
        (t = _asPdfBrush(t)), (this._brush = t ? t.clone() : t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.clone = function () {
      return new t(this.text, this.font, this.brush);
    }),
    (t.prototype.equals = function (e) {
      return (
        e instanceof t &&
        this._text === e.text &&
        (this._brush
          ? this._brush.equals(e._brush)
          : this._brush === e._brush) &&
        (this._font ? this._font.equals(e._font) : this._font === e._font)
      );
    }),
    t
  );
})();
exports.PdfRunningTitleDeclarativeContent = PdfRunningTitleDeclarativeContent;
var PdfRunningTitle = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    return (
      (r._height = 24),
      (r._declarative = new PdfRunningTitleDeclarativeContent()),
      (r._heightChanged = new wjcCore.Event()),
      wjcCore.copy(r, e),
      r
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'declarative', {
      get: function () {
        return this._declarative;
      },
      set: function (t) {
        null != t &&
          (wjcCore.assert(
            t instanceof PdfRunningTitleDeclarativeContent,
            exports._Errors.InvalidArg('value')
          ),
          (t = t.clone())),
          (this._declarative = t);
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
          ((this._height = wjcCore.asNumber(t, !1, !0)),
          this._heightChanged.raise(this, wjcCore.EventArgs.empty));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.drawText = function (e, r, n, i) {
      return (
        (i = i || {}),
        (i.height = 1 / 0),
        t.prototype.drawText.call(this, e, r, n, i)
      );
    }),
    e
  );
})(PdfPageArea);
exports.PdfRunningTitle = PdfRunningTitle;
var _PdfImageHelper = (function () {
  function t() {}
  return (
    (t.getDataUri = function (e) {
      if (
        (wjcCore.assert(!!(e = wjcCore.asString(e)), exports._Errors.EmptyUrl),
        t.DATAURI_CACHE[e])
      )
        return t.DATAURI_CACHE[e];
      var r = '';
      if (0 === e.indexOf('data:'))
        wjcCore.assert(
          !!e.match(/^data:image\/(png|jpeg|jpg);base64,/),
          exports._Errors.InvalidImageDataUri
        ),
          (r = e);
      else {
        var n,
          i = _XhrHelper.arrayBuffer(e, function (t) {
            return (n = t.statusText);
          });
        wjcCore.assert(null == n, n);
        try {
          var o = new Uint16Array(i, 0, 2);
          if (55551 !== o[0] && (20617 !== o[0] || 18254 !== o[1])) throw '';
          var a = t._toBase64(i);
          r =
            'data:' +
            (55551 === o[0] ? 'image/jpeg' : 'image/png') +
            ';base64,' +
            a;
        } catch (t) {
          wjcCore.assert(!1, exports._Errors.InvalidImageFormat);
        }
      }
      return (t.DATAURI_CACHE[e] = r);
    }),
    (t._toBase64 = function (t) {
      for (var e = '', r = new Uint8Array(t), n = 0; n < r.byteLength; n++)
        e += String.fromCharCode(r[n]);
      return window.btoa(e);
    }),
    (t.DATAURI_CACHE = {}),
    t
  );
})();
exports._PdfImageHelper = _PdfImageHelper;
var PdfPaths = (function () {
  function t(t, e) {
    (this._pathBuffer = []), (this._doc = t), (this._offset = e);
  }
  return (
    (t.prototype.moveTo = function (t, e) {
      return (
        this._pathBuffer.push({
          func: this._doc._document.moveTo,
          params: [
            wjcCore.asNumber(t) + this._offset.x,
            wjcCore.asNumber(e) + this._offset.y,
          ],
        }),
        this
      );
    }),
    (t.prototype.lineTo = function (t, e) {
      return (
        this._pathBuffer.push({
          func: this._doc._document.lineTo,
          params: [
            wjcCore.asNumber(t) + this._offset.x,
            wjcCore.asNumber(e) + this._offset.y,
          ],
        }),
        this
      );
    }),
    (t.prototype.quadraticCurveTo = function (t, e, r, n) {
      return (
        this._pathBuffer.push({
          func: this._doc._document.quadraticCurveTo,
          params: [
            wjcCore.asNumber(t) + this._offset.x,
            wjcCore.asNumber(e) + this._offset.y,
            wjcCore.asNumber(r) + this._offset.x,
            wjcCore.asNumber(n) + this._offset.y,
          ],
        }),
        this
      );
    }),
    (t.prototype.bezierCurveTo = function (t, e, r, n, i, o) {
      return (
        this._pathBuffer.push({
          func: this._doc._document.bezierCurveTo,
          params: [
            wjcCore.asNumber(t) + this._offset.x,
            wjcCore.asNumber(e) + this._offset.y,
            wjcCore.asNumber(r) + this._offset.x,
            wjcCore.asNumber(n) + this._offset.y,
            wjcCore.asNumber(i) + this._offset.x,
            wjcCore.asNumber(o) + this._offset.y,
          ],
        }),
        this
      );
    }),
    (t.prototype.svgPath = function (t) {
      if (t) {
        var e = _PdfSvgPathHelper.offset(wjcCore.asString(t), this._offset);
        this._pathBuffer.push({
          func: this._doc._document.path,
          params: [wjcCore.asString(e)],
        });
      }
      return this;
    }),
    (t.prototype.closePath = function () {
      return this._writePathBuffer(), this._doc._document.closePath(), this;
    }),
    (t.prototype.rect = function (t, e, r, n) {
      return (
        this._pathBuffer.push({
          func: this._doc._document.rect,
          params: [
            wjcCore.asNumber(t) + this._offset.x,
            wjcCore.asNumber(e) + this._offset.y,
            wjcCore.asNumber(r, !1, !0),
            wjcCore.asNumber(n, !1, !0),
          ],
        }),
        this
      );
    }),
    (t.prototype.roundedRect = function (t, e, r, n, i) {
      return (
        void 0 === i && (i = 0),
        this._pathBuffer.push({
          func: this._doc._document.roundedRect,
          params: [
            wjcCore.asNumber(t) + this._offset.x,
            wjcCore.asNumber(e) + this._offset.y,
            wjcCore.asNumber(r, !1, !0),
            wjcCore.asNumber(n, !1, !0),
            wjcCore.asNumber(i, !1, !0),
          ],
        }),
        this
      );
    }),
    (t.prototype.ellipse = function (t, e, r, n) {
      return (
        void 0 === n && (n = r),
        this._pathBuffer.push({
          func: this._doc._document.ellipse,
          params: [
            wjcCore.asNumber(t) + this._offset.x,
            wjcCore.asNumber(e) + this._offset.y,
            wjcCore.asNumber(r, !1, !0),
            wjcCore.asNumber(n, !1, !0),
          ],
        }),
        this
      );
    }),
    (t.prototype.circle = function (t, e, r) {
      return (
        this._pathBuffer.push({
          func: this._doc._document.circle,
          params: [
            wjcCore.asNumber(t) + this._offset.x,
            wjcCore.asNumber(e) + this._offset.y,
            wjcCore.asNumber(r, !1, !0),
          ],
        }),
        this
      );
    }),
    (t.prototype.polygon = function (t) {
      if (t)
        for (var e = 0; e < t.length; e++) {
          var r = t[e];
          (r[0] = r[0] + this._offset.x), (r[1] = r[1] + this._offset.y);
        }
      return (
        this._pathBuffer.push({
          func: this._doc._document.polygon,
          params: t,
        }),
        this
      );
    }),
    (t.prototype.clip = function (t) {
      return (
        void 0 === t && (t = PdfFillRule.NonZero),
        this._writePathBuffer(),
        this._doc._document.clip(
          t === PdfFillRule.EvenOdd ? 'even-odd' : 'non-zero'
        ),
        this
      );
    }),
    (t.prototype.fill = function (t, e) {
      return (
        this._doc._toggleBrush(_asPdfBrush(t)),
        this._writePathBuffer(),
        this._doc._document.fill(
          e === PdfFillRule.EvenOdd ? 'even-odd' : 'non-zero'
        ),
        this
      );
    }),
    (t.prototype.fillAndStroke = function (t, e, r) {
      return (
        this._doc._toggleBrush(_asPdfBrush(t)),
        this._doc._togglePen(_asPdfPen(e)),
        this._writePathBuffer(),
        this._doc._document.fillAndStroke(
          r === PdfFillRule.EvenOdd ? 'even-odd' : 'non-zero'
        ),
        this
      );
    }),
    (t.prototype.stroke = function (t) {
      return (
        this._doc._togglePen(_asPdfPen(t)),
        this._writePathBuffer(),
        this._doc._document.stroke(),
        this
      );
    }),
    (t.prototype._hasPathBuffer = function () {
      return this._pathBuffer.length > 0;
    }),
    (t.prototype._writePathBuffer = function () {
      for (
        var t = this._doc._document, e = 0;
        e < this._pathBuffer.length;
        e++
      ) {
        var r = this._pathBuffer[e];
        r.func.apply(t, r.params);
      }
      this._pathBuffer = [];
    }),
    t
  );
})();
exports.PdfPaths = PdfPaths;
var _PdfSvgPathHelper = (function () {
  function t() {}
  return (
    (t.offset = function (t, e) {
      var r = this;
      return this._processPath(t, function (t, n, i, o) {
        return (t = r._updateOffset(t, e, n, i, o));
      });
    }),
    (t.scale = function (t, e) {
      return this._processPath(t, function (t, r, n, i) {
        if ('a' === r || 'A' === r) {
          var o = i % 7;
          if (o >= 2 && o <= 4) return t;
        }
        return t * e;
      });
    }),
    (t._processPath = function (t, e) {
      for (
        var r, n = this._getTokenizer(t), i = '', o = '', a = -1, s = -1;
        (r = n());

      ) {
        if (1 === r.length && /[a-zA-Z]/.test(r)) s++, (i = r), (a = -1);
        else {
          a++;
          var u = e(parseFloat(r), i, s, a);
          r = wjcCore.toFixed(u, 7, !1) + '';
        }
        o += r + ' ';
      }
      return o;
    }),
    (t._getTokenizer = function (t) {
      var e = t.length,
        r = 0;
      return function () {
        if (r >= e) return '';
        for (; r < e && (/\s/.test(t[r]) || ',' == t[r]); ) r++;
        for (var n = r; r < e && /[0-9\.\-eE\+]/.test(t[r]); ) r++;
        return r != n ? t.substr(n, r - n) : t.substr(r++, 1);
      };
    }),
    (t._updateOffset = function (t, e, r, n, i) {
      var o = 0;
      switch (r) {
        case 'm':
          0 === n && (0 === i ? (o = -1) : 1 === i && (o = 1));
          break;
        case 'L':
        case 'M':
        case 'C':
        case 'S':
        case 'Q':
        case 'T':
          o = i % 2 == 0 ? -1 : 1;
          break;
        case 'A':
          i % 7 == 5 ? (o = -1) : i % 7 == 6 && (o = 1);
          break;
        case 'H':
          o = -1;
          break;
        case 'V':
          o = 1;
      }
      return o ? (-1 === o ? t + e.x : t + e.y) : t;
    }),
    t
  );
})();
exports._PdfSvgPathHelper = _PdfSvgPathHelper;
var _XhrOverrideMimeTypeSupported = !!new XMLHttpRequest().overrideMimeType,
  _XhrHelper = (function () {
    function t() {}
    return (
      (t.arrayBufferAsync = function (t, e, r) {
        var n = {
          method: 'GET',
          responseType: 'arraybuffer',
          async: !0,
        };
        this._getData(t, n, e, r);
      }),
      (t.arrayBuffer = function (t, e) {
        var r,
          n = { method: 'GET', async: !1 };
        return (
          exports._IE || !_XhrOverrideMimeTypeSupported
            ? ((n.responseType = 'arraybuffer'),
              this._getData(
                t,
                n,
                function (t, e) {
                  r = e;
                },
                e
              ))
            : ((n.overrideMimeType = 'text/plain; charset=x-user-defined'),
              this._getData(
                t,
                n,
                function (t, e) {
                  r = new ArrayBuffer(e.length);
                  for (
                    var n = new Uint8Array(r), i = 0, o = e.length;
                    i < o;
                    i++
                  )
                    n[i] = 255 & e.charCodeAt(i);
                },
                e
              )),
          r
        );
      }),
      (t.text = function (t, e) {
        var r = { method: 'GET', async: !1 },
          n = '';
        return (
          this._getData(
            t,
            r,
            function (t, e) {
              return (n = e);
            },
            e
          ),
          n
        );
      }),
      (t._getData = function (t, e, r, n) {
        var i = new XMLHttpRequest();
        if (
          ((e = e || {}),
          i.open(e.method, t, e.async, e.user, e.password),
          i.addEventListener('load', function () {
            if (4 === i.readyState) {
              var t = i.status;
              (t >= 200 && t < 300) || 304 === t
                ? r && r(i, i.response)
                : n && n(i);
            }
          }),
          e.headers)
        )
          for (var o in e.headers) i.setRequestHeader(o, e.headers[o]);
        e.responseType && (i.responseType = e.responseType),
          e.overrideMimeType &&
            i.overrideMimeType &&
            i.overrideMimeType(e.overrideMimeType),
          i.send(e.data);
      }),
      t
    );
  })();
exports._XhrHelper = _XhrHelper;
var PdfDocumentEndedEventArgs = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    return (r._chunks = e), r;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'blob', {
      get: function () {
        return (
          this._blob ||
            (this._blob = new Blob(this._chunks, {
              type: 'application/pdf',
            })),
          this._blob
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'chunks', {
      get: function () {
        return this._chunks;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(wjcCore.EventArgs);
exports.PdfDocumentEndedEventArgs = PdfDocumentEndedEventArgs;
var PdfDocument = (function (t) {
  function e(e) {
    var r = t.call(this) || this;
    (r._docInitialized = !1),
      (r._compress = !0),
      (r._bufferPages = !0),
      (r._chunks = []),
      (r._pageIndex = -1),
      (r._graphicsStack = []),
      (r._currentGS = {}),
      (r.info = {
        author: void 0,
        creationDate: void 0,
        keywords: void 0,
        modDate: void 0,
        subject: void 0,
        title: void 0,
      }),
      (r.pageSettings = {
        layout: PdfPageOrientation.Portrait,
        size: PdfPageSize.Letter,
        margins: { top: 72, left: 72, bottom: 72, right: 72 },
        _copy: function (t, e) {
          if ('size' === t) return (this.size = e), !0;
        },
      }),
      (r.ended = new wjcCore.Event()),
      (r.pageAdded = new wjcCore.Event()),
      (r._runtimeProperties = ['pageIndex', 'x', 'y']),
      wjcCore.copy(r, e);
    var n = function (t) {
        (r._doc = t), (r._fontReg = new _PdfFontRegistrar(r._doc));
      },
      i = function () {
        r.setPen(r._currentGS[r._pageIndex].pen),
          r.setBrush(r._currentGS[r._pageIndex].brush),
          (r._curFont = PdfFont._DEF_PDFKIT_FONT),
          r.setFont(new PdfFont());
      },
      o = !1,
      a = {
        compress: r._compress,
        bufferPages: r._bufferPages,
        pageAdding: (r._ehOnPageAdding = function (t, e) {
          r._docInitialized || ((o = !0), n(t)), r._onPageAdding(t, e);
        }),
        pageAdded: (r._ehOnPageAdded = function (t) {
          var e = r._isDrawingText()
            ? r._currentGS[r._pageIndex].brush
            : new PdfSolidBrush();
          (r._currentGS[++r._pageIndex] = {
            pen: new PdfPen(),
            brush: e,
          }),
            r._docInitialized || i(),
            r._onPageAdded(t);
        }),
      };
    return (
      (r._doc = new PDFDocument(a)),
      o || (n(r._doc), i()),
      r._doc
        .on(
          'data',
          (r._ehOnDocData = function (t) {
            r._onDocData(t);
          })
        )
        .on(
          'ending',
          (r._ehOnDocEnding = function () {
            r._onDocEnding();
          })
        )
        .on(
          'end',
          (r._ehOnDocEnded = function () {
            r._onDocEnded();
          })
        ),
      (r._docInitialized = !0),
      r
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'compress', {
      get: function () {
        return this._compress;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'bufferPages', {
      get: function () {
        return this._bufferPages;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'header', {
      get: function () {
        var t = this;
        return (
          this._header ||
            (this._header = new PdfRunningTitle({
              _heightChanged: function () {
                t._docInitialized && t._resetAreasOffset(t._doc);
              },
            })),
          this._header
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'footer', {
      get: function () {
        var t = this;
        return (
          this._footer ||
            (this._footer = new PdfRunningTitle({
              _heightChanged: function () {
                t._docInitialized && t._resetAreasOffset(t._doc);
              },
            })),
          this._footer
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'pageIndex', {
      get: function () {
        return this._pageIndex;
      },
      set: function (t) {
        (t = wjcCore.asNumber(t, !1, !0)),
          this._pageIndex !== t &&
            (this._doc.switchToPage(t), (this._pageIndex = t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onEnded = function (t) {
      this.ended && this.ended.raise(this, t);
    }),
    (e.prototype.onPageAdded = function (t) {
      this.pageAdded && this.pageAdded.raise(this, t);
    }),
    (e.prototype.dispose = function () {
      this._doc &&
        (this._doc
          .removeEventListener('data', this._ehOnDocData)
          .removeEventListener('ending', this._ehOnDocEnding)
          .removeEventListener('end', this._ehOnDocEnded)
          .removeEventListener('pageAdding', this._ehOnPageAdding)
          .removeEventListener('pageAdded', this._ehOnPageAdded),
        (this._doc = null),
        (this._chunks = null));
    }),
    Object.defineProperty(e.prototype, 'currentPageSettings', {
      get: function () {
        var t = this._doc.page;
        return {
          layout:
            'landscape' === t.layout
              ? PdfPageOrientation.Landscape
              : PdfPageOrientation.Portrait,
          size: wjcCore.isArray(t.size)
            ? new wjcCore.Size(t.size[0], t.size[1])
            : PdfPageSize[t.size.match(/\d+/) ? t.size : _toTitleCase(t.size)],
          margins: {
            left: t.margins.left,
            right: t.margins.right,
            top: t.margins.top - this.header.height,
            bottom: t.margins.bottom - this.footer.height,
          },
        };
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.addPage = function (t) {
      var e = this._pageSettingsToNative(t || this.pageSettings);
      return this._doc.addPage(e), this;
    }),
    (e.prototype.bufferedPageRange = function () {
      return this._doc.bufferedPageRange();
    }),
    (e.prototype.end = function () {
      this._doc.end();
    }),
    (e.prototype.setBrush = function (t) {
      return (
        this._assertAreasPathStarted(),
        this._setCurBrush((this._defBrush = _asPdfBrush(t, !1).clone())),
        this
      );
    }),
    (e.prototype.setPen = function (t) {
      return (
        this._assertAreasPathStarted(),
        this._setCurPen((this._defPen = _asPdfPen(t, !1).clone())),
        this
      );
    }),
    (e.prototype.setFont = function (t) {
      return (
        this._setCurFont((this._defFont = _asPdfFont(t, !1).clone())), this
      );
    }),
    (e.prototype._getFont = function () {
      return this._curFont;
    }),
    (e.prototype.registerFont = function (t) {
      wjcCore.assert(!!t, exports._Errors.ValueCannotBeEmpty('font'));
      var e;
      if (wjcCore.isString(t.source)) {
        var r;
        (e = _XhrHelper.arrayBuffer(t.source, function (t) {
          return (r = t.statusText);
        })),
          wjcCore.assert(null == r, r);
      } else
        t.source instanceof ArrayBuffer
          ? (e = t.source)
          : wjcCore.assert(
              !1,
              exports._Errors.FontSourceMustBeStringArrayBuffer
            );
      return (
        (t = _shallowCopy(t)),
        (t.source = e),
        this._fontReg.registerFont(t),
        this
      );
    }),
    (e.prototype.registerFontAsync = function (t, e) {
      var r = this;
      wjcCore.assert(
        'string' == typeof t.source,
        exports._Errors.FontSourceMustBeString
      ),
        wjcCore.asFunction(e, !1),
        _XhrHelper.arrayBufferAsync(t.source, function (n, i) {
          var o = _shallowCopy(t);
          (o.source = i), r._fontReg.registerFont(o), e(t);
        });
    }),
    (e.prototype.saveState = function () {
      return (
        this._assertAreasPathStarted(),
        this._graphicsStack.push(
          this._currentGS[this._pageIndex].pen.clone(),
          this._defPen.clone(),
          this._currentGS[this._pageIndex].brush.clone(),
          this._defBrush.clone()
        ),
        this._pdfdoc._document.save(),
        this
      );
    }),
    (e.prototype.restoreState = function () {
      return (
        this._assertAreasPathStarted(),
        this._graphicsStack.length &&
          ((this._defBrush = this._graphicsStack.pop()),
          (this._currentGS[this._pageIndex].brush = this._graphicsStack.pop()),
          (this._defPen = this._graphicsStack.pop()),
          (this._currentGS[this._pageIndex].pen = this._graphicsStack.pop())),
        this._pdfdoc._document.restore(),
        this
      );
    }),
    (e.prototype._copy = function (t, e) {
      return 'compress' === t
        ? ((this._compress = wjcCore.asBoolean(e)), !0)
        : 'bufferPages' === t
        ? ((this._bufferPages = wjcCore.asBoolean(e)), !0)
        : this._runtimeProperties.indexOf(t) >= 0;
    }),
    Object.defineProperty(e.prototype, '_document', {
      get: function () {
        return this._doc;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._switchTextFlowCtx = function (t) {
      (this._doc.x = t.xo), (this._doc.y = t.yo), this._doc.lineGap(t.lineGap);
    }),
    (e.prototype._getTextFlowCtxState = function () {
      return {
        xo: this._doc.x,
        yo: this._doc.y,
        lineGap: this._doc.currentLineGap(),
      };
    }),
    (e.prototype._toggleBrush = function (t) {
      t ? this._setCurBrush(t) : this._setCurBrush(this._defBrush);
    }),
    (e.prototype._togglePen = function (t) {
      t ? this._setCurPen(t) : this._setCurPen(this._defPen);
    }),
    (e.prototype._toggleFont = function (t) {
      t ? this._setCurFont(t) : this._setCurFont(this._defFont);
    }),
    (e.prototype._onDocData = function (t) {
      this._chunks.push(t);
    }),
    (e.prototype._onDocEnding = function () {
      if ((this._processHeadersFooters(), this.info)) {
        var t;
        (t = this.info.author) && (this._doc.info.Author = t),
          (t = this.info.creationDate) && (this._doc.info.CreationDate = t),
          (t = this.info.keywords) && (this._doc.info.Keywords = t),
          (t = this.info.modDate) && (this._doc.info.ModDate = t),
          (t = this.info.subject) && (this._doc.info.Subject = t),
          (t = this.info.title) && (this._doc.info.Title = t);
      }
    }),
    (e.prototype._onDocEnded = function () {
      if (exports._IE && this._chunks.length && !this._chunks[0].buffer)
        for (var t = 0; t < this._chunks.length; t++) {
          for (
            var e = this._chunks[t], r = new Uint8Array(e.length), n = 0;
            n < e.length;
            n++
          )
            r[n] = e[n];
          this._chunks[t] = r.buffer;
        }
      this.onEnded(new PdfDocumentEndedEventArgs(this._chunks)),
        (this._chunks = []);
    }),
    (e.prototype._onPageAdding = function (t, e) {
      if (this.pageSettings) {
        var r = this._pageSettingsToNative(this.pageSettings);
        (e.layout = t.options.layout = r.layout),
          (e.margins = t.options.margins = r.margins),
          (e.size = t.options.size = r.size);
      }
    }),
    (e.prototype._onPageAdded = function (t) {
      (t.page.originalMargins = _shallowCopy(t.page.margins)),
        this._resetAreasOffset(t),
        this.onPageAdded(wjcCore.EventArgs.empty);
    }),
    (e.prototype._assertAreasPathStarted = function () {
      this._docInitialized &&
        (this._assertPathStarted(),
        this.header._assertPathStarted(),
        this.footer._assertPathStarted());
    }),
    (e.prototype._pageSettingsToNative = function (t) {
      var e = {};
      if (t) {
        var r = wjcCore.asEnum(t.layout, PdfPageOrientation, !0);
        null != r && (e.layout = (PdfPageOrientation[r] || '').toLowerCase());
        var n = t.margins;
        n &&
          (e.margins = {
            left: wjcCore.asNumber(n.left, !1, !0),
            right: wjcCore.asNumber(n.right, !1, !0),
            top: wjcCore.asNumber(n.top, !1, !0),
            bottom: wjcCore.asNumber(n.bottom, !1, !0),
          });
        var i = t.size;
        null != i &&
          (i instanceof wjcCore.Size
            ? (e.size = [
                wjcCore.asNumber(i.width, !1, !0),
                wjcCore.asNumber(i.height, !1, !0),
              ])
            : ((i = wjcCore.asEnum(i, PdfPageSize)),
              (e.size = (PdfPageSize[i] || '').toUpperCase())));
      }
      return e;
    }),
    (e.prototype._processHeadersFooters = function () {
      var t = this.header,
        e = this.footer;
      if (t.height > 0 || e.height > 0) {
        var r = this._doc;
        wjcCore.assert(
          r.options.bufferPages,
          exports._Errors.BufferPagesMustBeEnabled
        );
        for (var n = r.bufferedPageRange(), i = n.start; i < n.count; i++) {
          var o = { Page: i + 1, Pages: n.count };
          (this.pageIndex = i),
            this._renderHeaderFooter(t, o, !0),
            this._renderHeaderFooter(e, o, !1);
        }
      }
    }),
    (e.prototype._renderHeaderFooter = function (t, e, r) {
      if (t.height > 0 && t.declarative && t.declarative.text) {
        var n = _formatMacros(t.declarative.text, e).split('\t');
        n.length > 0 &&
          n[0] &&
          this._renderHeaderFooterPart(t, n[0], PdfTextHorizontalAlign.Left, r),
          n.length > 1 &&
            n[1] &&
            this._renderHeaderFooterPart(
              t,
              n[1],
              PdfTextHorizontalAlign.Center,
              r
            ),
          n.length > 2 &&
            n[2] &&
            this._renderHeaderFooterPart(
              t,
              n[2],
              PdfTextHorizontalAlign.Right,
              r
            );
      }
    }),
    (e.prototype._renderHeaderFooterPart = function (t, e, r, n) {
      var i = {
        font: t.declarative.font,
        brush: t.declarative.brush,
        width: t.width,
        height: t.height,
        align: r,
      };
      if (n) this.header.drawText(e, 0, 0, i);
      else {
        i.includeLastLineExternalLeading = !1;
        var o = this.footer.measureText(e, i.font, i);
        this.footer.drawText(e, 0, this.footer.height - o.size.height, i);
      }
    }),
    (e.prototype._setCurBrush = function (t) {
      this._currentGS[this.pageIndex].brush.equals(t) ||
        (this._setNativeDocBrush(t, !1),
        (this._currentGS[this.pageIndex].brush = t.clone()));
    }),
    (e.prototype._setCurFont = function (t) {
      if (!this._curFont.equals(t)) {
        var e = this._fontReg.findFont(t.family, t.style, t.weight);
        this._doc.font(e, t.size || PdfFont._DEF_FONT.size),
          (this._curFont = t.clone());
      }
    }),
    (e.prototype._setCurPen = function (t) {
      var e = this._doc,
        r = this._currentGS[this.pageIndex].pen;
      !t.brush || (r.brush && r.brush.equals(t.brush))
        ? ((r.brush && !t.brush) || (!r.brush && !r.color.equals(t.color))) &&
          e.strokeColor([t.color.r, t.color.g, t.color.b], t.color.a)
        : this._setNativeDocBrush(t.brush, !0),
        r.width !== t.width && e.lineWidth(t.width),
        r.miterLimit !== t.miterLimit && e.miterLimit(t.miterLimit),
        r.cap !== t.cap && e.lineCap(t.cap),
        r.join !== t.join && e.lineJoin(t.join),
        r.dashPattern.equals(t.dashPattern) ||
          (null != t.dashPattern.dash
            ? e.dash(t.dashPattern.dash, {
                space: t.dashPattern.gap,
                phase: t.dashPattern.phase,
              })
            : null != r.dashPattern.dash && e.undash()),
        (this._currentGS[this.pageIndex].pen = t.clone());
    }),
    (e.prototype._setNativeDocBrush = function (t, e) {
      var r = this._doc,
        n = t._getBrushObject(this),
        i = 1;
      n instanceof wjcCore.Color
        ? ((i = n.a), (n = [n.r, n.g, n.b]))
        : t instanceof PdfGradientBrush && (i = t.opacity),
        e ? r.strokeColor(n, i) : r.fillColor(n, i);
    }),
    (e.prototype._resetAreasOffset = function (t) {
      (t.page.margins.top = t.page.originalMargins.top + this.header.height),
        (t.y = t.page.margins.top),
        (t.page.margins.bottom =
          t.page.originalMargins.bottom + this.footer.height),
        this._header._initialize(
          this,
          t.page.margins.left,
          t.page.originalMargins.top
        ),
        this._initialize(this, t.page.margins.left, t.page.margins.top),
        this._footer._initialize(
          this,
          t.page.margins.left,
          t.page.height - t.page.margins.bottom
        );
    }),
    e
  );
})(PdfPageArea);
(exports.PdfDocument = PdfDocument),
  (exports._compressSpaces = _compressSpaces),
  (exports._resolveUrlIfRelative = _resolveUrlIfRelative);
var _SvgCssRule = (function () {
  function t(t, e) {
    (this.selector = t), (this.declarations = {}), this._fillDeclarations(e);
  }
  return (
    (t.prototype._fillDeclarations = function (t) {
      var e = this;
      t &&
        t.split(';').forEach(function (t) {
          if (t) {
            var r = t.split(':');
            if (2 === r.length) {
              var n = r[0].trim().toLowerCase(),
                i = r[1].trim();
              if (n && i) {
                var o = /!important$/i.test(i);
                o && (i = i.replace(/!important$/i, '').trim()),
                  i &&
                    (e.declarations[n] = {
                      value: i,
                      important: o,
                    });
              }
            }
          }
        });
    }),
    t
  );
})();
exports._SvgCssRule = _SvgCssRule;
var _SvgCssHelper = (function () {
  function t() {}
  return (
    (t.matchesSelector = function (t, e) {
      var r = !1;
      try {
        r = (
          t.matches ||
          t.msMatchesSelector ||
          t.webkitMatchesSelector ||
          t.mozMatchesSelector
        ).call(t, e);
      } catch (t) {}
      return r;
    }),
    (t.getSpecificity = function (t) {
      var e = 0,
        r = 0,
        n = 0,
        i = function (e) {
          var r = (t.match(e) || []).length;
          return r && (t = t.replace(e, '')), r;
        };
      return (
        (t = t.replace(/:not\(([^\)]*)\)/g, function (t, e) {
          return ' ' + e + ' ';
        })),
        (r += i(/(\[[^\]]+\])/g)),
        (e += i(/(#[^\s\+>~\.\[:]+)/g)),
        (r += i(/(\.[^\s\+>~\.\[:]+)/g)),
        (n += i(
          /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi
        )),
        (r += i(/(:[\w-]+\([^\)]*\))/gi)),
        (r += i(/(:[^\s\+>~\.\[:]+)/g)),
        (t = t.replace(/[\*\s\+>~]/g, ' ')),
        (t = t.replace(/[#\.]/g, ' ')),
        (n += i(/([^\s\+>~\.\[:]+)/g)),
        (e << 16) | (r << 8) | n
      );
    }),
    (t.getComputedStyle = function (t, e) {
      var r = this,
        n = {},
        i = [];
      if (t.className)
        for (var i = [], o = 0, a = Object.keys(e); o < a.length; o++) {
          var s = a[o];
          this.matchesSelector(t, s) && i.push(e[s]);
        }
      i.sort(function (t, e) {
        return r.getSpecificity(t.selector) - r.getSpecificity(e.selector);
      });
      var u = t.getAttribute('style');
      u && i.push(new _SvgCssRule('_inline_', _compressSpaces(u)));
      for (o = 0; o < i.length; o++)
        for (
          var l = i[o], c = 0, a = Object.keys(l.declarations);
          c < a.length;
          c++
        ) {
          var h = a[c],
            f = l.declarations[h];
          (null != n[h] && !f.important && n[h].important) || (n[h] = f);
        }
      for (var d = {}, o = 0, a = Object.keys(n); o < a.length; o++)
        d[(h = a[o])] = n[h].value;
      return d;
    }),
    (t.registerFontFace = function (t, e, r) {
      var n = e.declarations;
      n['font-family'] &&
        n.src &&
        n.src.value.split(',').every(function (e) {
          if (e.match(/format\(\s*['"]?truetype['"]?\s*\)/i)) {
            var i = e.match(/url\(\s*['"]?([^'"\)]+)['"]?\s*\)/i);
            if (i) {
              var o = i[1].trim(),
                a = !1;
              if ((o = _resolveUrlIfRelative(o, r))) {
                var s = {
                  name: n['font-family'].value,
                  source: o,
                  weight: n['font-weight']
                    ? n['font-weight'].value.toLowerCase()
                    : 'normal',
                  style: n['font-style']
                    ? n['font-style'].value.toLowerCase()
                    : 'normal',
                };
                try {
                  t.registerFont(s), (a = !0);
                } catch (t) {}
              }
              return !a;
            }
          }
          return !0;
        });
    }),
    t
  );
})();
exports._SvgCssHelper = _SvgCssHelper;
var _SvgNumConversion;
!(function (t) {
  (t[(t.Default = 1)] = 'Default'),
    (t[(t.None = 2)] = 'None'),
    (t[(t.Px = 3)] = 'Px');
})(
  (_SvgNumConversion =
    exports._SvgNumConversion || (exports._SvgNumConversion = {}))
);
var _SvgLengthContext;
!(function (t) {
  (t[(t.Width = 1)] = 'Width'),
    (t[(t.Height = 2)] = 'Height'),
    (t[(t.Other = 3)] = 'Other');
})(
  (_SvgLengthContext =
    exports._SvgLengthContext || (exports._SvgLengthContext = {}))
);
var _SvgAttrType;
!(function (t) {
  (t[(t.Number = 1)] = 'Number'), (t[(t.String = 2)] = 'String');
})((_SvgAttrType = exports._SvgAttrType || (exports._SvgAttrType = {})));
var _SvgAttr = (function () {
  function t(t, e, r, n, i, o, a) {
    void 0 === n && (n = void 0),
      void 0 === i && (i = _SvgNumConversion.Default),
      void 0 === o && (o = _SvgLengthContext.Other),
      void 0 === a && (a = !1),
      wjcCore.assert(!!t, exports._Errors.ValueCannotBeEmpty('owner')),
      wjcCore.assert(!!e, exports._Errors.ValueCannotBeEmpty('propName')),
      (this._owner = t),
      (this._propName = e),
      (this._propType = r),
      (this._defValue = n),
      (this._inheritable = a),
      (this._nc = i),
      (this._pCtx = o),
      (this._searchValue = !0);
  }
  return (
    (t.parseValue = function (t, e, r, n, i) {
      if (null == t) return t;
      if (e & _SvgAttrType.Number) {
        var o, a;
        if ('number' == typeof t) o = t;
        else {
          var s = t.match(/^([\+-]?[\d\.]+)(em|ex|px|pt|pc|cm|mm|in|%)?$/);
          s && ((o = parseFloat(s[1])), (a = s[2]));
        }
        if (null != o && o === o) {
          if (
            i !== _SvgNumConversion.Default &&
            (wjcCore.assert(!a, exports._Errors.InvalidFormat(t)),
            i === _SvgNumConversion.None)
          )
            return o;
          switch (a) {
            case 'mm':
              return (72 * o) / 25.4;
            case 'cm':
              return (72 * o) / 2.54;
            case 'in':
              return 72 * o;
            case 'pt':
              return o;
            case 'pc':
              return 12 * o;
            case '%':
              switch (n) {
                case _SvgLengthContext.Height:
                  o *= r.height / 100;
                  break;
                case _SvgLengthContext.Width:
                  o *= r.width / 100;
                  break;
                case _SvgLengthContext.Other:
                  o *=
                    Math.sqrt(r.width * r.width + r.height * r.height) /
                    Math.sqrt(2) /
                    100;
              }
              return o;
            case 'px':
            default:
              return 0.75 * o;
          }
        }
      }
      if (e & _SvgAttrType.String) return t + '';
      wjcCore.assert(!1, exports._Errors.InvalidFormat(t));
    }),
    Object.defineProperty(t.prototype, 'hasVal', {
      get: function () {
        return null != this._val;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'val', {
      get: function () {
        if (null != this._val) return this._val;
        var t = wjcCore.isFunction(this._defValue)
          ? this._defValue.call(this, this._owner.ctx)
          : this._defValue;
        return this._parse(t);
      },
      set: function (t) {
        (this._searchValue = !1), (this._value = t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_val', {
      get: function () {
        if (this._searchValue) {
          this._searchValue = !1;
          for (
            var t, e = this._owner;
            e &&
            ((t = e.attr(this._propName)),
            this._inheritable && (null == t || 'inherit' == t));
            e = e.parent
          );
          this._value = 'inherit' === t ? void 0 : this._parse(t);
        }
        return this._value;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.reset = function () {
      (this._value = void 0), (this._searchValue = !0);
    }),
    (t.prototype._parse = function (e, r) {
      return (e = t.parseValue(
        e,
        this._propType,
        this._owner.viewport,
        this._pCtx,
        r || this._nc
      ));
    }),
    t
  );
})();
exports._SvgAttr = _SvgAttr;
var _SvgNumAttr = (function (t) {
  function e(e, r, n, i, o, a) {
    return (
      void 0 === n && (n = void 0),
      void 0 === i && (i = _SvgNumConversion.Default),
      void 0 === o && (o = _SvgLengthContext.Other),
      t.call(this, e, r, _SvgAttrType.Number, n, i, o, a) || this
    );
  }
  return __extends(e, t), e;
})(_SvgAttr);
exports._SvgNumAttr = _SvgNumAttr;
var _SvgStrAttr = (function (t) {
  function e(e, r, n, i) {
    return (
      t.call(this, e, r, _SvgAttrType.String, n, void 0, void 0, i) || this
    );
  }
  return __extends(e, t), e;
})(_SvgAttr);
exports._SvgStrAttr = _SvgStrAttr;
var _SvgColorAttr = (function (t) {
  function e(e, r, n, i) {
    return (
      void 0 === n && (n = void 0),
      void 0 === i && (i = !0),
      t.call(
        this,
        e,
        r,
        _SvgAttrType.String,
        n,
        _SvgNumConversion.None,
        _SvgLengthContext.Other,
        i
      ) || this
    );
  }
  return (
    __extends(e, t),
    (e.prototype.asHref = function () {
      var t = this.val.match(/url\((.+)\)/);
      return t ? t[1] : null;
    }),
    (e.prototype._parse = function (e) {
      if ('' !== e && 'null' !== e && 'undefined' !== e)
        return t.prototype._parse.call(this, e);
    }),
    e
  );
})(_SvgAttr);
exports._SvgColorAttr = _SvgColorAttr;
var _SvgDashArrayAttr = (function (t) {
  function e(e) {
    return (
      t.call(
        this,
        e,
        'stroke-dasharray',
        _SvgAttrType.Number,
        void 0,
        _SvgNumConversion.Px,
        _SvgLengthContext.Other,
        !0
      ) || this
    );
  }
  return (
    __extends(e, t),
    (e.prototype._parse = function (e) {
      var r,
        n = (e || '').trim().split(/[\s,]+/);
      if (n.length) {
        r = [];
        try {
          for (var i = 0; i < n.length; i++)
            n[i] && r.push(t.prototype._parse.call(this, n[i]));
        } catch (t) {
          return;
        }
        return r.length ? r : void 0;
      }
      return r;
    }),
    e
  );
})(_SvgAttr);
exports._SvgDashArrayAttr = _SvgDashArrayAttr;
var _SvgFillRuleAttr = (function (t) {
  function e(e, r) {
    return (
      t.call(
        this,
        e,
        r,
        _SvgAttrType.String,
        PdfFillRule.NonZero,
        void 0,
        void 0,
        !0
      ) || this
    );
  }
  return (
    __extends(e, t),
    (e.prototype._parse = function (t) {
      if (wjcCore.isNumber(t)) return t;
      var e = (t || '').match(/(nonzero|evenodd)/i);
      return e
        ? 'nonzero' === e[1]
          ? PdfFillRule.NonZero
          : PdfFillRule.EvenOdd
        : void 0;
    }),
    e
  );
})(_SvgAttr);
exports._SvgFillRuleAttr = _SvgFillRuleAttr;
var _SvgHRefAttr = (function (t) {
  function e(e, r) {
    return t.call(this, e, r) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._parse = function (t) {
      var e = (t = (t || '').trim()).match(/url\((.+)\)/);
      return e && (t = e[1].trim()), (t = t.replace(/["']/g, ''));
    }),
    e
  );
})(_SvgStrAttr);
exports._SvgHRefAttr = _SvgHRefAttr;
var _SvgIdRefAttr = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._parse = function (e) {
      if ((e = t.prototype._parse.call(this, e)) && '#' === e[0])
        return e.substring(1);
    }),
    e
  );
})(_SvgHRefAttr);
exports._SvgIdRefAttr = _SvgIdRefAttr;
var _SvgPointsArrayAttr = (function (t) {
  function e(e, r) {
    return (
      t.call(this, e, r, _SvgAttrType.Number, void 0, _SvgNumConversion.Px) ||
      this
    );
  }
  return (
    __extends(e, t),
    (e.prototype._parse = function (e) {
      var r,
        n = (e || '').trim().split(/[\s,]+/),
        i = 2 * Math.floor(n.length / 2);
      if (i) {
        r = [];
        try {
          for (var o = 0; o < i - 1; o += 2)
            r.push(
              new wjcCore.Point(
                t.prototype._parse.call(this, n[o]),
                t.prototype._parse.call(this, n[o + 1])
              )
            );
        } catch (t) {
          return;
        }
      }
      return r;
    }),
    e
  );
})(_SvgAttr);
exports._SvgPointsArrayAttr = _SvgPointsArrayAttr;
var _SvgTransformAttr = (function (t) {
  function e(e) {
    return (
      t.call(
        this,
        e,
        'transform',
        _SvgAttrType.Number,
        void 0,
        _SvgNumConversion.None
      ) || this
    );
  }
  return (
    __extends(e, t),
    (e.prototype.apply = function (t) {
      var e = t.ctx.area;
      this.hasVal &&
        this.val.forEach(function (t) {
          t(e);
        });
    }),
    (e.prototype._parse = function (e) {
      var r = this,
        n = [],
        i = (e || '').match(
          /((matrix|translate|scale|rotate|skewX|skewY)\([^\)]+\))+/g
        );
      if (i)
        for (var o = 0; o < i.length; o++) {
          var a = i[o].match(/(\w+)\(([^\)]+)\)/),
            s = [];
          try {
            a[2]
              .trim()
              .split(/[\s,]+/)
              .forEach(function (e) {
                e &&
                  s.push(t.prototype._parse.call(r, e, _SvgNumConversion.None));
              });
          } catch (t) {
            return;
          }
          if (s.length)
            switch (a[1]) {
              case 'matrix':
                n.push(
                  (function (t, e, r, n, i, o) {
                    return function (a) {
                      a.transform(t, e, r, n, i, o);
                    };
                  })(
                    s[0],
                    s[1],
                    s[2],
                    s[3],
                    t.prototype._parse.call(this, s[4], _SvgNumConversion.Px),
                    t.prototype._parse.call(this, s[5], _SvgNumConversion.Px)
                  )
                );
                break;
              case 'translate':
                n.push(
                  (function (t, e) {
                    return function (r) {
                      r.translate(t, e);
                    };
                  })(
                    t.prototype._parse.call(this, s[0], _SvgNumConversion.Px),
                    t.prototype._parse.call(
                      this,
                      s[1] || 0,
                      _SvgNumConversion.Px
                    )
                  )
                );
                break;
              case 'scale':
                n.push(
                  (function (t, e) {
                    return function (r) {
                      r.scale(t, e);
                    };
                  })(s[0], s[1])
                );
                break;
              case 'rotate':
                n.push(
                  (function (t, e) {
                    return function (r) {
                      r.rotate(t, e);
                    };
                  })(
                    s[0],
                    new wjcCore.Point(
                      t.prototype._parse.call(
                        this,
                        s[1] || 0,
                        _SvgNumConversion.Px
                      ),
                      t.prototype._parse.call(
                        this,
                        s[2] || 0,
                        _SvgNumConversion.Px
                      )
                    )
                  )
                );
                break;
              case 'skewX':
                n.push(
                  (function (t) {
                    return function (e) {
                      e.transform(1, 0, t, 1, 0, 0);
                    };
                  })(Math.tan((s[0] * Math.PI) / 180))
                );
                break;
              case 'skewY':
                n.push(
                  (function (t) {
                    return function (e) {
                      e.transform(1, t, 0, 1, 0, 0);
                    };
                  })(Math.tan((s[0] * Math.PI) / 180))
                );
            }
        }
      return n.length ? n : void 0;
    }),
    e
  );
})(_SvgAttr);
exports._SvgTransformAttr = _SvgTransformAttr;
var _SvgTextDecorationAttr = (function (t) {
  function e(e) {
    return (
      t.call(
        this,
        e,
        'text-decoration',
        _SvgAttrType.String,
        void 0,
        _SvgNumConversion.None
      ) || this
    );
  }
  return (
    __extends(e, t),
    (e.prototype._parse = function (t) {
      var e,
        r = (t || '')
          .trim()
          .toLowerCase()
          .split(/[\s,]+/);
      if (r.length) {
        e = [];
        for (var n = 0; n < r.length; n++)
          /line-through|overline|underline/.test(r[n]) && e.push(r[n]);
      }
      return e && e.length ? e : void 0;
    }),
    e
  );
})(_SvgAttr);
exports._SvgTextDecorationAttr = _SvgTextDecorationAttr;
var _SvgViewboxAttr = (function (t) {
  function e(e) {
    return (
      t.call(
        this,
        e,
        'viewBox',
        _SvgAttrType.Number,
        void 0,
        _SvgNumConversion.Px
      ) || this
    );
  }
  return (
    __extends(e, t),
    (e.prototype._parse = function (e) {
      var r,
        n = (e || '').trim().split(/[\s,]+/);
      return (
        4 === n.length &&
          (r = {
            minX: t.prototype._parse.call(this, n[0]),
            minY: t.prototype._parse.call(this, n[1]),
            width: t.prototype._parse.call(this, n[2]),
            height: t.prototype._parse.call(this, n[3]),
          }),
        r
      );
    }),
    e
  );
})(_SvgAttr);
exports._SvgViewboxAttr = _SvgViewboxAttr;
var _SvgPreserveAspectRatioAttr = (function (t) {
  function e(e) {
    return (
      t.call(
        this,
        e,
        'preserveAspectRatio',
        _SvgAttrType.Number,
        'xMidYMid meet'
      ) || this
    );
  }
  return (
    __extends(e, t),
    (e.prototype._parse = function (t) {
      var e;
      if ('string' == typeof t) {
        var r = t
          .replace(/^defer\s+/, '')
          .trim()
          .split(/\s+/);
        e = { align: r[0], meet: !r[1] || 'meet' === r[1] };
      } else e = t;
      return e;
    }),
    e
  );
})(_SvgAttr);
exports._SvgPreserveAspectRatioAttr = _SvgPreserveAspectRatioAttr;
var _SvgScaleAttributes = (function () {
  function t(t) {
    (this._owner = t),
      (this.aspect = new _SvgPreserveAspectRatioAttr(this._owner)),
      (this.viewBox = new _SvgViewboxAttr(this._owner));
  }
  return (
    (t.prototype.apply = function (t) {
      var e = t.ctx.area,
        r = t.viewport,
        n = this.viewBox.val;
      if (r && n) {
        if (n.width && n.height) {
          var i = this.aspect.val,
            o = r.width / n.width,
            a = r.height / n.height,
            s = Math.min(o, a),
            u = Math.max(o, a),
            l = n.width * (i.meet ? s : u),
            c = n.height * (i.meet ? s : u);
          if ('none' === i.align) e.scale(o, a);
          else {
            var h = i.meet ? s : u,
              f = 0,
              d = 0;
            i.align.match(/^xMid/) && h === a
              ? (f = r.width / 2 - l / 2)
              : i.align.match(/^xMax/) && h === a && (f = r.width - l),
              i.align.match(/YMid$/) && h === o
                ? (d = r.height / 2 - c / 2)
                : i.align.match(/YMax$/) && h === o && (d = r.height - c),
              (f || d) && e.translate(f, d),
              i.meet ? e.scale(s, s) : e.scale(u, u),
              (n.minX || n.minY) && e.translate(-n.minX, -n.minY);
          }
        }
        return new wjcCore.Size(n.width, n.height);
      }
      return r;
    }),
    t
  );
})();
exports._SvgScaleAttributes = _SvgScaleAttributes;
var _SvgStrokeAttributes = (function () {
  function t(t) {
    (this._owner = t),
      (this.color = new _SvgColorAttr(this._owner, 'stroke', 'none')),
      (this.dashArray = new _SvgDashArrayAttr(this._owner)),
      (this.dashOffset = new _SvgNumAttr(
        this._owner,
        'stroke-dashoffset',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Other,
        !0
      )),
      (this.lineCap = new _SvgStrAttr(
        this._owner,
        'stroke-linecap',
        'butt',
        !0
      )),
      (this.lineJoin = new _SvgStrAttr(
        this._owner,
        'stroke-linejoin',
        'miter',
        !0
      )),
      (this.miterLimit = new _SvgNumAttr(
        this._owner,
        'stroke-miterlimit',
        4,
        _SvgNumConversion.None,
        _SvgLengthContext.Other,
        !0
      )),
      (this.opacity = new _SvgNumAttr(
        this._owner,
        'stroke-opacity',
        1,
        _SvgNumConversion.None,
        _SvgLengthContext.Other,
        !0
      )),
      (this.width = new _SvgNumAttr(
        this._owner,
        'stroke-width',
        1,
        _SvgNumConversion.Default,
        _SvgLengthContext.Other,
        !0
      ));
  }
  return (
    (t.prototype.toPen = function (t) {
      var e = new wjcCore.Color(this.color.val);
      this.opacity.hasVal && (e.a = this.opacity.val);
      var r = new PdfPen(e, this.width.val);
      if (this.dashArray.hasVal) {
        var n = this.dashArray.val;
        n.length &&
          (r.dashPattern = new PdfDashPattern(
            n[0],
            n.length > 1 ? n[1] : void 0,
            this.dashOffset.val
          ));
      }
      switch (this.lineCap.val) {
        case 'butt':
          r.cap = PdfLineCapStyle.Butt;
          break;
        case 'round':
          r.cap = PdfLineCapStyle.Round;
          break;
        case 'square':
          r.cap = PdfLineCapStyle.Square;
      }
      switch (this.lineJoin.val) {
        case 'miter':
          r.join = PdfLineJoinStyle.Miter;
          break;
        case 'round':
          r.join = PdfLineJoinStyle.Round;
          break;
        case 'bevel':
          r.join = PdfLineJoinStyle.Bevel;
      }
      return (r.miterLimit = this.miterLimit.val), r;
    }),
    t
  );
})();
exports._SvgStrokeAttributes = _SvgStrokeAttributes;
var _SvgFillAttributes = (function () {
  function t(t) {
    (this._owner = t),
      (this.color = new _SvgColorAttr(this._owner, 'fill', 'black')),
      (this.opacity = new _SvgNumAttr(
        this._owner,
        'fill-opacity',
        1,
        _SvgNumConversion.None,
        void 0,
        !0
      )),
      (this.rule = new _SvgFillRuleAttr(this._owner, 'fill-rule'));
  }
  return (
    (t.prototype.toBrush = function (t) {
      var e,
        r = this.color.asHref();
      if (r && t) {
        var n = t.ctx.getElement(r);
        if (n instanceof _SvgLinearGradientElementImpl) return n.toBrush(t);
      }
      return (
        (e = new wjcCore.Color(this.color.val)),
        this.opacity.hasVal && (e.a = this.opacity.val),
        new PdfSolidBrush(e)
      );
    }),
    t
  );
})();
exports._SvgFillAttributes = _SvgFillAttributes;
var _SvgFontAttributes = (function () {
  function t(t) {
    (this._owner = t),
      (this.family = new _SvgStrAttr(
        this._owner,
        'font-family',
        function (t) {
          var e = t.area._pdfdoc._getFont();
          return e ? e.family : void 0;
        },
        !0
      )),
      (this.size = new _SvgAttr(
        this._owner,
        'font-size',
        _SvgAttrType.Number | _SvgAttrType.String,
        'medium',
        void 0,
        _SvgLengthContext.Other,
        !0
      )),
      (this.style = new _SvgStrAttr(this._owner, 'font-style', 'normal', !0)),
      (this.weight = new _SvgStrAttr(this._owner, 'font-weight', 'normal', !0));
  }
  return (
    (t.prototype.toFont = function () {
      var t = _asPt(this.size.val);
      return new PdfFont(this.family.val, t, this.style.val, this.weight.val);
    }),
    t
  );
})();
exports._SvgFontAttributes = _SvgFontAttributes;
var _SvgStyleAttributes = (function () {
  function t(t) {
    (this._owner = t),
      (this.clipRule = new _SvgFillRuleAttr(this._owner, 'clip-rule')),
      (this.fill = new _SvgFillAttributes(this._owner)),
      (this.font = new _SvgFontAttributes(this._owner)),
      (this.stroke = new _SvgStrokeAttributes(this._owner));
  }
  return (
    (t.prototype.apply = function (t, e, r) {
      var n = t.ctx.area;
      t.renderMode === _SvgRenderMode.Clip ||
        (e &&
        r &&
        'none' !== this.fill.color.val &&
        'none' !== this.stroke.color.val
          ? n.paths.fillAndStroke(
              this.fill.toBrush(t),
              this.stroke.toPen(t),
              this.fill.rule.val
            )
          : e && 'none' !== this.fill.color.val
          ? n.paths.fill(this.fill.toBrush(t), this.fill.rule.val)
          : r && 'none' !== this.stroke.color.val
          ? n.paths.stroke(this.stroke.toPen(t))
          : n.paths.stroke(wjcCore.Color.fromRgba(0, 0, 0, 0)));
    }),
    t
  );
})();
exports._SvgStyleAttributes = _SvgStyleAttributes;
var _SvgRenderMode;
!(function (t) {
  (t[(t.Render = 0)] = 'Render'),
    (t[(t.Ignore = 1)] = 'Ignore'),
    (t[(t.Clip = 2)] = 'Clip');
})((_SvgRenderMode = exports._SvgRenderMode || (exports._SvgRenderMode = {})));
var _SvgElementBase = (function () {
  function t(t, e, r) {
    void 0 === r && (r = _SvgRenderMode.Render),
      (this._children = []),
      (this._attributes = {}),
      (this._defRenderMode = r),
      (this._ctx = t);
  }
  return (
    Object.defineProperty(t.prototype, 'children', {
      get: function () {
        return this._children;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'ctx', {
      get: function () {
        return this._ctx;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'parent', {
      get: function () {
        return this._parent;
      },
      set: function (t) {
        this._parent = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'style', {
      get: function () {
        return (
          this._style || (this._style = new _SvgStyleAttributes(this)),
          this._style
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'viewport', {
      get: function () {
        return this._viewport;
      },
      set: function (t) {
        this._viewport = t.clone();
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.attr = function (t, e) {
      return (
        (t = t.toLowerCase()),
        arguments.length > 1 && (this._attributes[t] = e),
        this._attributes[t]
      );
    }),
    (t.prototype.appendNode = function (t) {
      t &&
        t !== this &&
        t.parent !== this &&
        (t.remove(), this.children.push(t), (t.parent = this));
    }),
    (t.prototype.copyAttributesFrom = function (t, e) {
      if (t) {
        var r = t._attributes,
          n = this._attributes;
        for (var i in r)
          r.hasOwnProperty(i) &&
            null == n[i] &&
            (!e || e.indexOf(i) < 0) &&
            (n[i] = r[i]);
      }
    }),
    (t.prototype.clone = function () {
      var t = new (Function.prototype.bind.call(
        this.constructor,
        null,
        this.ctx,
        null
      ))();
      return (
        t.copyAttributesFrom(this),
        this._children.forEach(function (e) {
          t.appendNode(e.clone());
        }),
        t
      );
    }),
    (t.prototype.remove = function () {
      var t = this.parent;
      if (t) {
        for (var e = 0; e < t.children.length; e++)
          if (t.children[e] === this) {
            t.children.splice(e, 1);
            break;
          }
        this.parent = null;
      }
    }),
    (t.prototype.clearAttr = function (t) {
      delete this._attributes[t.toLowerCase()];
    }),
    (t.prototype.render = function (t, e) {
      (this._viewport = t.clone()),
        (this._curRenderMode = e || this._defRenderMode) !==
          _SvgRenderMode.Ignore && this._render();
    }),
    Object.defineProperty(t.prototype, 'renderMode', {
      get: function () {
        return this._curRenderMode;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._render = function () {
      this._renderContent();
    }),
    (t.prototype._renderContent = function () {
      for (var t = 0; t < this._children.length; t++)
        this._children[t].render(this.viewport, this.renderMode);
    }),
    t
  );
})();
exports._SvgElementBase = _SvgElementBase;
var _SvgClippableElementBase = (function (t) {
  function e(e, r, n) {
    void 0 === n && (n = _SvgRenderMode.Render);
    var i = t.call(this, e, r, n) || this;
    return (i._clipPath = new _SvgIdRefAttr(i, 'clip-path')), i;
  }
  return (
    __extends(e, t),
    (e.prototype._render = function () {
      var e,
        r = this.ctx.area;
      if (this._clipPath.val) {
        var n = this.ctx.getElement(this._clipPath.val);
        (e = !!(n && n instanceof _SvgClipPathElementImpl)) &&
          (r._pdfdoc.saveState(),
          n.render(this.viewport, _SvgRenderMode.Clip),
          r.paths.clip(this.style.clipRule.val));
      }
      t.prototype._render.call(this), e && r._pdfdoc.restoreState();
    }),
    e
  );
})(_SvgElementBase);
exports._SvgClippableElementBase = _SvgClippableElementBase;
var _SvgTransformableElementBase = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r) || this;
    return (n._transform = new _SvgTransformAttr(n)), n;
  }
  return (
    __extends(e, t),
    (e.prototype._render = function () {
      var e = this._transform.hasVal && this.renderMode !== _SvgRenderMode.Clip;
      e && (this.ctx.area._pdfdoc.saveState(), this._transform.apply(this)),
        t.prototype._render.call(this),
        e && this.ctx.area._pdfdoc.restoreState();
    }),
    e
  );
})(_SvgClippableElementBase);
exports._SvgTransformableElementBase = _SvgTransformableElementBase;
var _SvgShapeElementBase = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (e._fill = !0), (e._stroke = !0), e;
  }
  return (
    __extends(e, t),
    (e.prototype._renderContent = function () {
      this._draw(), this.style.apply(this, this._fill, this._stroke);
    }),
    (e.prototype._draw = function () {
      wjcCore.assert(!1, exports._Errors.AbstractMethod);
    }),
    e
  );
})(_SvgTransformableElementBase);
exports._SvgShapeElementBase = _SvgShapeElementBase;
var _SvgCircleElementImpl = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._draw = function () {
      var t = new _SvgNumAttr(this, 'r', 0).val;
      if (t > 0) {
        var e = new _SvgNumAttr(
            this,
            'cx',
            0,
            _SvgNumConversion.Default,
            _SvgLengthContext.Width
          ).val,
          r = new _SvgNumAttr(
            this,
            'cy',
            0,
            _SvgNumConversion.Default,
            _SvgLengthContext.Height
          ).val;
        this.ctx.area.paths.circle(e, r, t);
      }
    }),
    e
  );
})(_SvgShapeElementBase);
exports._SvgCircleElementImpl = _SvgCircleElementImpl;
var _SvgEllipseElementImpl = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._draw = function () {
      var t = new _SvgNumAttr(
          this,
          'rx',
          0,
          _SvgNumConversion.Default,
          _SvgLengthContext.Width
        ).val,
        e = new _SvgNumAttr(
          this,
          'ry',
          0,
          _SvgNumConversion.Default,
          _SvgLengthContext.Height
        ).val;
      if (t > 0 && e > 0) {
        var r = new _SvgNumAttr(
            this,
            'cx',
            0,
            _SvgNumConversion.Default,
            _SvgLengthContext.Width
          ).val,
          n = new _SvgNumAttr(
            this,
            'cy',
            0,
            _SvgNumConversion.Default,
            _SvgLengthContext.Height
          ).val;
        this.ctx.area.paths.ellipse(r, n, t, e);
      }
    }),
    e
  );
})(_SvgShapeElementBase);
exports._SvgEllipseElementImpl = _SvgEllipseElementImpl;
var _SvgLineElementImpl = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r) || this;
    return (n._fill = !1), n;
  }
  return (
    __extends(e, t),
    (e.prototype._draw = function () {
      var t = new _SvgNumAttr(
          this,
          'x1',
          0,
          _SvgNumConversion.Default,
          _SvgLengthContext.Width
        ).val,
        e = new _SvgNumAttr(
          this,
          'y1',
          0,
          _SvgNumConversion.Default,
          _SvgLengthContext.Height
        ).val,
        r = new _SvgNumAttr(
          this,
          'x2',
          0,
          _SvgNumConversion.Default,
          _SvgLengthContext.Width
        ).val,
        n = new _SvgNumAttr(
          this,
          'y2',
          0,
          _SvgNumConversion.Default,
          _SvgLengthContext.Height
        ).val;
      this.ctx.area.paths.moveTo(t, e).lineTo(r, n);
    }),
    e
  );
})(_SvgShapeElementBase);
exports._SvgLineElementImpl = _SvgLineElementImpl;
var _SvgPathElementImpl = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r) || this;
    return (n._d = new _SvgStrAttr(n, 'd')), n;
  }
  return (
    __extends(e, t),
    (e.prototype._renderContent = function () {
      var e = this.ctx.area;
      if (this.renderMode === _SvgRenderMode.Clip) {
        if (this._d.hasVal) {
          var r = _PdfSvgPathHelper.scale(this._d.val, 0.75);
          this.attr('d', r), this._d.reset();
        }
        t.prototype._renderContent.call(this);
      } else
        e._pdfdoc.saveState(),
          e.scale(0.75),
          t.prototype._renderContent.call(this),
          e._pdfdoc.restoreState();
    }),
    (e.prototype._draw = function () {
      this._d.hasVal && this.ctx.area.paths.svgPath(this._d.val);
    }),
    e
  );
})(_SvgShapeElementBase);
exports._SvgPathElementImpl = _SvgPathElementImpl;
var _SvgPolylineElementImpl = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._draw = function () {
      var t = new _SvgPointsArrayAttr(this, 'points');
      if (t.hasVal) {
        var e = t.val,
          r = this.ctx.area;
        if (e.length > 1) {
          for (var n = 0; n < e.length; n++)
            0 == n
              ? r.paths.moveTo(e[n].x, e[n].y)
              : r.paths.lineTo(e[n].x, e[n].y);
          return !0;
        }
      }
      return !1;
    }),
    e
  );
})(_SvgShapeElementBase);
exports._SvgPolylineElementImpl = _SvgPolylineElementImpl;
var _SvgPolygonElementImpl = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._draw = function () {
      return (
        !!t.prototype._draw.call(this) && (this.ctx.area.paths.closePath(), !0)
      );
    }),
    e
  );
})(_SvgPolylineElementImpl);
exports._SvgPolygonElementImpl = _SvgPolygonElementImpl;
var _SvgRectElementImpl = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return (
    __extends(e, t),
    (e.prototype._draw = function () {
      var t = new _SvgNumAttr(
          this,
          'width',
          0,
          _SvgNumConversion.Default,
          _SvgLengthContext.Width
        ).val,
        e = new _SvgNumAttr(
          this,
          'height',
          0,
          _SvgNumConversion.Default,
          _SvgLengthContext.Height
        ).val;
      if (t > 0 && e > 0) {
        var r = new _SvgNumAttr(
            this,
            'x',
            0,
            _SvgNumConversion.Default,
            _SvgLengthContext.Width
          ).val,
          n = new _SvgNumAttr(
            this,
            'y',
            0,
            _SvgNumConversion.Default,
            _SvgLengthContext.Height
          ).val,
          i = Math.max(
            new _SvgNumAttr(
              this,
              'rx',
              0,
              _SvgNumConversion.Default,
              _SvgLengthContext.Width
            ).val,
            0
          ),
          o = Math.max(
            new _SvgNumAttr(
              this,
              'ry',
              0,
              _SvgNumConversion.Default,
              _SvgLengthContext.Height
            ).val,
            0
          ),
          a = this.ctx.area.paths;
        i || o
          ? ((i = Math.min(i || o, t / 2)),
            (o = Math.min(o || i, e / 2)),
            a.moveTo(r + i, n),
            a.lineTo(r + t - i, n),
            a.quadraticCurveTo(r + t, n, r + t, n + o),
            a.lineTo(r + t, n + e - o),
            a.quadraticCurveTo(r + t, n + e, r + t - i, n + e),
            a.lineTo(r + i, n + e),
            a.quadraticCurveTo(r, n + e, r, n + e - o),
            a.lineTo(r, n + o),
            a.quadraticCurveTo(r, n, r + i, n))
          : a.rect(r, n, t, e);
      }
    }),
    e
  );
})(_SvgShapeElementBase);
exports._SvgRectElementImpl = _SvgRectElementImpl;
var _SvgClipPathElementImpl = (function (t) {
  function e(e, r) {
    return t.call(this, e, r, _SvgRenderMode.Ignore) || this;
  }
  return __extends(e, t), e;
})(_SvgElementBase);
exports._SvgClipPathElementImpl = _SvgClipPathElementImpl;
var _SvgDefsElementImpl = (function (t) {
  function e(e, r) {
    return t.call(this, e, r, _SvgRenderMode.Ignore) || this;
  }
  return __extends(e, t), e;
})(_SvgClippableElementBase);
exports._SvgDefsElementImpl = _SvgDefsElementImpl;
var _SvgGElementImpl = (function (t) {
  function e() {
    return (null !== t && t.apply(this, arguments)) || this;
  }
  return __extends(e, t), e;
})(_SvgTransformableElementBase);
exports._SvgGElementImpl = _SvgGElementImpl;
var _SvgLinearGradientElementImpl = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r, _SvgRenderMode.Ignore) || this;
    return (
      (n._x1 = new _SvgStrAttr(n, 'x1', '0%')),
      (n._x2 = new _SvgStrAttr(n, 'x2', '100%')),
      (n._y1 = new _SvgStrAttr(n, 'y1', '0%')),
      (n._y2 = new _SvgStrAttr(n, 'y2', '0%')),
      (n._gradientUnits = new _SvgStrAttr(
        n,
        'gradientUnits',
        'objectBoundingBox'
      )),
      n
    );
  }
  return (
    __extends(e, t),
    (e.prototype.toBrush = function (t) {
      for (
        var e = new wjcCore.Rect(
            new _SvgNumAttr(
              t,
              'x',
              0,
              _SvgNumConversion.Default,
              _SvgLengthContext.Width
            ).val,
            new _SvgNumAttr(
              t,
              'y',
              0,
              _SvgNumConversion.Default,
              _SvgLengthContext.Height
            ).val,
            new _SvgNumAttr(
              t,
              'width',
              0,
              _SvgNumConversion.Default,
              _SvgLengthContext.Width
            ).val,
            new _SvgNumAttr(
              t,
              'height',
              0,
              _SvgNumConversion.Default,
              _SvgLengthContext.Height
            ).val
          ),
          r =
            'objectBoundingBox' === this._gradientUnits.val
              ? new wjcCore.Size(e.width, e.height)
              : t.viewport.clone(),
          n = _SvgNumAttr.parseValue(
            this._x1.val,
            _SvgAttrType.Number,
            r,
            _SvgLengthContext.Width,
            _SvgNumConversion.Default
          ),
          i = _SvgNumAttr.parseValue(
            this._x2.val,
            _SvgAttrType.Number,
            r,
            _SvgLengthContext.Width,
            _SvgNumConversion.Default
          ),
          o = _SvgNumAttr.parseValue(
            this._y1.val,
            _SvgAttrType.Number,
            r,
            _SvgLengthContext.Height,
            _SvgNumConversion.Default
          ),
          a = _SvgNumAttr.parseValue(
            this._y2.val,
            _SvgAttrType.Number,
            r,
            _SvgLengthContext.Height,
            _SvgNumConversion.Default
          ),
          s = [],
          u = 0;
        u < this.children.length;
        u++
      )
        if (this.children[u] instanceof _SvgStopElementImpl) {
          var l = this.children[u];
          s.push(
            new PdfGradientStop(
              _SvgNumAttr.parseValue(
                l.offset.val,
                _SvgAttrType.Number,
                r,
                _SvgLengthContext.Other,
                _SvgNumConversion.Default
              ),
              l.color.val,
              l.opacity.val
            )
          );
        }
      return new PdfLinearGradientBrush(
        e.left + n,
        e.top + o,
        e.left + i,
        e.top + a,
        s
      );
    }),
    e
  );
})(_SvgElementBase);
exports._SvgLinearGradientElementImpl = _SvgLinearGradientElementImpl;
var _SvgStopElementImpl = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r, _SvgRenderMode.Ignore) || this;
    return (
      (n.color = new _SvgColorAttr(n, 'stop-color', 'black')),
      (n.opacity = new _SvgNumAttr(
        n,
        'stop-opacity',
        1,
        _SvgNumConversion.None,
        void 0,
        !0
      )),
      (n.offset = new _SvgStrAttr(n, 'offset', '0')),
      n
    );
  }
  return __extends(e, t), e;
})(_SvgElementBase);
exports._SvgStopElementImpl = _SvgStopElementImpl;
var _SvgImageElementImpl = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r) || this;
    return (
      (n._x = new _SvgNumAttr(
        n,
        'x',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Width
      )),
      (n._y = new _SvgNumAttr(
        n,
        'y',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Height
      )),
      (n._width = new _SvgNumAttr(
        n,
        'width',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Width
      )),
      (n._height = new _SvgNumAttr(
        n,
        'height',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Height
      )),
      (n._href = new _SvgHRefAttr(n, 'xlink:href')),
      (n._par = new _SvgPreserveAspectRatioAttr(n)),
      n
    );
  }
  return (
    __extends(e, t),
    (e.prototype._renderContent = function () {
      var t = this._width.val,
        e = this._height.val;
      if (t > 0 && e > 0 && this._href.hasVal) {
        var r = _resolveUrlIfRelative(this._href.val, this.ctx.urlResolver);
        if (r) {
          this.ctx.area._pdfdoc.saveState(),
            (this._x.val || this._y.val) &&
              this.ctx.area.translate(this._x.val, this._y.val),
            (this.viewport = new wjcCore.Size(t, e));
          try {
            this._href.val.match(/\.svg$/i)
              ? this._renderSvgImage(r)
              : this._renderRasterImage(r);
          } catch (t) {}
          this.ctx.area._pdfdoc.restoreState();
        }
      }
    }),
    (e.prototype._renderSvgImage = function (t) {
      var e,
        r = _XhrHelper.text(t, function (t) {
          return (e = t.statusText);
        });
      wjcCore.assert(null == e, e);
      var n = new _SvgRenderer(r, this.ctx.area),
        i = n.root;
      this.attr('viewBox', i.attr('viewBox')),
        i.clearAttr('viewBox'),
        i.clearAttr('x'),
        i.clearAttr('y'),
        i.clearAttr('width'),
        i.clearAttr('height'),
        i.clearAttr('preserveAspectRatio'),
        i.clearAttr('clip'),
        i.clearAttr('overflow'),
        this.ctx.area.paths
          .rect(0, 0, this.viewport.width, this.viewport.height)
          .clip();
      var o = new _SvgScaleAttributes(this);
      n.render(o.apply(this));
    }),
    (e.prototype._renderRasterImage = function (t) {
      var e = _PdfImageHelper.getDataUri(t),
        r = this._par.val,
        n = {
          width: this.viewport.width,
          height: this.viewport.height,
          align: PdfImageHorizontalAlign.Left,
          vAlign: PdfImageVerticalAlign.Top,
        };
      'none' === r.align
        ? (n.stretchProportionally = !1)
        : ((n.stretchProportionally = !0),
          r.align.match(/^xMid/)
            ? (n.align = PdfImageHorizontalAlign.Center)
            : r.align.match(/^xMax/) &&
              (n.align = PdfImageHorizontalAlign.Right),
          r.align.match(/YMid$/)
            ? (n.vAlign = PdfImageVerticalAlign.Center)
            : r.align.match(/YMax$/) &&
              (n.vAlign = PdfImageVerticalAlign.Bottom)),
        this.ctx.area.drawImage(e, 0, 0, n);
    }),
    e
  );
})(_SvgTransformableElementBase);
exports._SvgImageElementImpl = _SvgImageElementImpl;
var _SvgStyleElementImpl = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r, _SvgRenderMode.Ignore) || this;
    if (r && (!r.type || 'text/css' === r.type)) {
      for (var i = '', o = 0; o < r.childNodes.length; o++)
        i += r.childNodes[o].textContent;
      var a = (i = (i = _compressSpaces(i)).replace(
        /\/\*([^*]|\*+[^*/])*\*+\//gm,
        ''
      )).match(/[^{}]*{[^}]*}/g);
      if (a)
        for (o = 0; o < a.length; o++) {
          var s = a[o].match(/([^{}]*){([^}]*)}/);
          if (s) {
            var u = s[1].trim().split(','),
              l = s[2].trim();
            u.length &&
              l &&
              u.forEach(function (t) {
                (t = t.trim()) && n.ctx.registerCssRule(new _SvgCssRule(t, l));
              });
          }
        }
    }
    return n;
  }
  return __extends(e, t), e;
})(_SvgElementBase);
exports._SvgStyleElementImpl = _SvgStyleElementImpl;
var _SvgSvgElementImpl = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r) || this;
    return (
      (n._x = new _SvgNumAttr(
        n,
        'x',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Width
      )),
      (n._y = new _SvgNumAttr(
        n,
        'y',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Height
      )),
      (n._width = new _SvgNumAttr(
        n,
        'width',
        '100%',
        _SvgNumConversion.Default,
        _SvgLengthContext.Width
      )),
      (n._height = new _SvgNumAttr(
        n,
        'height',
        '100%',
        _SvgNumConversion.Default,
        _SvgLengthContext.Height
      )),
      (n._scale = new _SvgScaleAttributes(n)),
      (n._overflow = new _SvgStrAttr(n, 'overflow', 'hidden')),
      n
    );
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'width', {
      get: function () {
        return this._width;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'height', {
      get: function () {
        return this._height;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._render = function () {
      var e = this.ctx.area;
      e._pdfdoc.saveState();
      var r = this._width.val,
        n = this._height.val,
        i = this._x.val,
        o = this._y.val;
      this.parent && (i || o) && e.translate(i, o),
        (this.viewport = new wjcCore.Size(r, n)),
        'visible' !== this._overflow.val && e.paths.rect(0, 0, r, n).clip(),
        (this.viewport = this._scale.apply(this)),
        this.viewport.width > 0 &&
          this.viewport.height > 0 &&
          t.prototype._render.call(this),
        e._pdfdoc.restoreState();
    }),
    e
  );
})(_SvgClippableElementBase);
exports._SvgSvgElementImpl = _SvgSvgElementImpl;
var _SvgSymbolElementImpl = (function (t) {
  function e(e, r) {
    return t.call(this, e, r, _SvgRenderMode.Ignore) || this;
  }
  return __extends(e, t), e;
})(_SvgClippableElementBase);
exports._SvgSymbolElementImpl = _SvgSymbolElementImpl;
var _SvgUseElementImpl = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r) || this;
    return (n._xlink = new _SvgIdRefAttr(n, 'xlink:href')), n;
  }
  return (
    __extends(e, t),
    (e.prototype._render = function () {
      var t, e;
      if (this._xlink.hasVal && (t = this.ctx.getElement(this._xlink.val))) {
        var r = new _SvgGElementImpl(this.ctx, null);
        if (
          ((r.parent = this.parent),
          r.copyAttributesFrom(this, [
            'x',
            'y',
            'width',
            'height',
            'xlink:href',
          ]),
          null != this.attr('x') || null != this.attr('y'))
        ) {
          var n = wjcCore.format('translate({x},{y})', {
            x: this.attr('x') || 0,
            y: this.attr('y') || 0,
          });
          r.attr('transform', (e = r.attr('transform')) ? e + ' ' + n : n);
        }
        if (t instanceof _SvgSymbolElementImpl) {
          var i = new _SvgSvgElementImpl(this.ctx, null);
          i.copyAttributesFrom(t);
          for (var o = 0; o < t.children.length; o++)
            i.appendNode(t.children[o].clone());
          r.appendNode(i),
            i.attr('width', this.attr('width') || '100%'),
            i.attr('height', this.attr('height') || '100%');
        } else
          (t = t.clone()),
            r.appendNode(t),
            t instanceof _SvgSvgElementImpl &&
              (null != (e = this.attr('width')) && t.attr('width', e),
              null != (e = this.attr('height')) && t.attr('height', e));
        r.render(this.viewport, this.renderMode);
      }
    }),
    e
  );
})(_SvgElementBase);
exports._SvgUseElementImpl = _SvgUseElementImpl;
var _SvgTextElementImpl = (function (t) {
  function e(e, r) {
    var n = t.call(this, e, r) || this;
    return (
      (n._x = new _SvgNumAttr(
        n,
        'x',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Width
      )),
      (n._y = new _SvgNumAttr(
        n,
        'y',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Height
      )),
      (n._dx = new _SvgNumAttr(
        n,
        'dx',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Width
      )),
      (n._dy = new _SvgNumAttr(
        n,
        'dy',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Height
      )),
      (n._textDecoration = new _SvgTextDecorationAttr(n)),
      n
    );
  }
  return (
    __extends(e, t),
    (e.prototype._render = function () {
      this.renderMode === _SvgRenderMode.Render &&
        t.prototype._render.call(this);
    }),
    (e.prototype._renderContent = function () {
      var t = this;
      this._prepareNodes();
      for (
        var e = this._x.val + this._dx.val,
          r = this._y.val + this._dy.val,
          n = function (i, o) {
            if (
              (i._x.hasVal && (e = i._x.val),
              i._y.hasVal && (r = i._y.val),
              (e += i._dx.val),
              (r += i._dy.val),
              i._text)
            )
              (i._cx = e),
                (i._cy = r),
                i._setDecorators(o),
                i.render(t.viewport, t.renderMode),
                (e += t.ctx.area.measureText(i._text, i.style.font.toFont(), {
                  width: 1 / 0,
                  height: 1 / 0,
                  includeLastLineExternalLeading: !1,
                }).size.width);
            else
              for (var a = 0; a < i.children.length; a++) {
                var s = o.slice();
                s.push({
                  decoration: i._textDecoration,
                  style: i.style,
                }),
                  n(i.children[a], s);
              }
          },
          i = 0;
        i < this.children.length;
        i++
      )
        n(this.children[i], [
          { decoration: this._textDecoration, style: this.style },
        ]);
    }),
    (e.prototype._prepareNodes = function () {
      var t = function (e) {
          for (var r = 0; r < e.children.length; r++) {
            var n = e.children[r];
            !n._text && t(n) && n.remove();
          }
          return 0 === e.children.length;
        },
        e = [],
        r = function (t) {
          for (var n = 0; n < t.children.length; n++) {
            var i = t.children[n];
            i._text ? e.push(i) : r(i);
          }
        };
      t(this), r(this);
      for (var n = 0; n < e.length; n++) {
        var i = e.length;
        ' ' === e[n]._text &&
          (0 === n || n === i - 1 || (n < i - 1 && ' ' === e[n + 1]._text)) &&
          (e[n].remove(), e.splice(n, 1), n--);
      }
    }),
    e
  );
})(_SvgTransformableElementBase);
exports._SvgTextElementImpl = _SvgTextElementImpl;
var _SvgTspanElementImpl = (function (t) {
  function e(e, r, n) {
    var i = t.call(this, e, r) || this;
    return (
      (i._textDecoration = new _SvgTextDecorationAttr(i)),
      (i._text = wjcCore.asString(n)),
      (i._x = new _SvgNumAttr(
        i,
        'x',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Width
      )),
      (i._y = new _SvgNumAttr(
        i,
        'y',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Height
      )),
      (i._dx = new _SvgNumAttr(
        i,
        'dx',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Width
      )),
      (i._dy = new _SvgNumAttr(
        i,
        'dy',
        0,
        _SvgNumConversion.Default,
        _SvgLengthContext.Height
      )),
      (i._textDecoration = new _SvgTextDecorationAttr(i)),
      i
    );
  }
  return (
    __extends(e, t),
    (e.prototype.clone = function () {
      var e = t.prototype.clone.call(this);
      return (e._text = this._text), e;
    }),
    (e.prototype._setDecorators = function (t) {
      this._decorators = t;
    }),
    (e.prototype._renderContent = function () {
      if (this._text) {
        var t = {
          font: this.style.font.toFont(),
          width: 1 / 0,
          height: 1 / 0,
          lineBreak: !1,
          fill: 'none' !== this.style.fill.color.val,
          stroke: 'none' !== this.style.stroke.color.val,
          _baseline: _PdfTextBaseline.Alphabetic,
        };
        this._decorate(),
          (t.fill || t.stroke) &&
            (t.fill && (t.brush = this.style.fill.toBrush(this)),
            t.stroke && (t.pen = this.style.stroke.toPen(this)),
            this.ctx.area.drawText(this._text, this._cx, this._cy, t));
      }
    }),
    (e.prototype._decorate = function () {
      var t = this.ctx.area,
        e = !1;
      this._decorators.push({
        decoration: this._textDecoration,
        style: this.style,
      });
      for (var r = 0; r < this._decorators.length && !e; r++)
        e = null != this._decorators[r].decoration.val;
      if (e) {
        t._pdfdoc.saveState();
        for (
          var n,
            i = t._pdfdoc._document,
            o = t.measureText(this._text, this.style.font.toFont(), {
              width: 1 / 0,
              height: 1 / 0,
              includeLastLineExternalLeading: !1,
            }).size,
            a = Math.max(i.currentFontSize() / 20, 0.1),
            s = i.currentFontAscender(),
            u = this._cx;
          (n = this._decorators.shift());

        ) {
          var l = n.decoration.val;
          if (l) {
            for (var c = 0; c < l.length; c++) {
              var h = this._cy - s;
              switch (l[c]) {
                case 'line-through':
                  h = h + o.height / 2 - a / 2;
                  break;
                case 'overline':
                  h -= i.currentFontBBox().ury - i.currentFontAscender();
                  break;
                case 'underline':
                  h = h + o.height - 1.5 * a;
              }
              t.paths.rect(u, h, o.width, a);
            }
            n.style.apply(this, !0, !0);
          }
        }
        t._pdfdoc.restoreState();
      }
    }),
    e
  );
})(_SvgClippableElementBase);
exports._SvgTspanElementImpl = _SvgTspanElementImpl;
var _SvgRenderer = (function () {
  function t(t, e, r) {
    var n = this;
    (this._elementsById = {}),
      (this._registeredCssRules = {}),
      wjcCore.assert(
        null != e,
        exports._Errors.ValueCannotBeEmpty('svgString')
      ),
      (this._doc = e._pdfdoc);
    var i = this._parse(t);
    i &&
      ((this._svg = new _SvgSvgElementImpl(
        {
          area: e,
          urlResolver: r,
          getElement: this._getElementById.bind(this),
          registerCssRule: function (t) {
            n._registerCssRule(t, r);
          },
        },
        null
      )),
      this._copyAttributes(i, this._svg),
      this._buildTree(i, this._svg),
      (this._svg.viewport = new wjcCore.Size(e.width, e.height)));
  }
  return (
    Object.defineProperty(t.prototype, 'root', {
      get: function () {
        return this._svg;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.render = function (t) {
      this._svg && this._svg.render(t || this._svg.viewport);
    }),
    (t.prototype._parse = function (t) {
      if (t) {
        var e = new DOMParser();
        return (
          (e.async = !1),
          e.parseFromString(t, 'text/xml').getElementsByTagName('svg')[0]
        );
      }
    }),
    (t.prototype._buildTree = function (t, e, r) {
      for (var n = 0; t.childNodes && n < t.childNodes.length; n++) {
        var i = t.childNodes.item(n),
          o = i.nodeName;
        if (1 === i.nodeType) {
          var a = this._getClassName(o);
          if (wjcSelf[a]) {
            var s = new wjcSelf[a](e.ctx, i);
            this._copyAttributes(i, s), e.appendNode(s);
            var u;
            (u = i.getAttribute('id')) && (this._elementsById[u] = s),
              this._buildTree(i, s, 'text' === o || (r && 'tspan' === o));
          }
        } else if (3 === i.nodeType && r) {
          var l = i.textContent.trim();
          if (l) {
            0 != n &&
              1 === t.childNodes[n - 1].nodeType &&
              i.textContent.match(/^\s/) &&
              e.appendNode(new _SvgTspanElementImpl(e.ctx, null, ' '));
            var c = _compressSpaces(i.textContent);
            e.appendNode(new _SvgTspanElementImpl(e.ctx, null, c));
          }
          (l && !i.textContent.match(/\s$/)) ||
            e.appendNode(new _SvgTspanElementImpl(e.ctx, null, ' '));
        }
      }
    }),
    (t.prototype._getClassName = function (t) {
      return (
        '_Svg' + t.charAt(0).toUpperCase() + t.substring(1) + 'ElementImpl'
      );
    }),
    (t.prototype._copyAttributes = function (t, e) {
      for (i = 0; i < t.attributes.length; i++) {
        var r = t.attributes.item(i);
        e.attr(r.name, r.value);
      }
      for (
        var n = _SvgCssHelper.getComputedStyle(t, this._registeredCssRules),
          i = 0,
          o = Object.keys(n);
        i < o.length;
        i++
      ) {
        var a = o[i];
        e.attr(a, n[a]);
      }
    }),
    (t.prototype._getElementById = function (t) {
      return (t = (t || '').replace('#', '')), this._elementsById[t];
    }),
    (t.prototype._registerCssRule = function (t, e) {
      '@' !== t.selector[0]
        ? (this._registeredCssRules[t.selector] = t)
        : '@font-face' === t.selector &&
          _SvgCssHelper.registerFontFace(this._doc, t, e);
    }),
    t
  );
})();
exports._SvgRenderer = _SvgRenderer;
