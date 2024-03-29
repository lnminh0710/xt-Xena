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
function useJSZip(e) {
  JSZip = e;
}
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
        for (var l in t) t.hasOwnProperty(l) && (e[l] = t[l]);
      };
    return function (t, l) {
      function o() {
        this.constructor = t;
      }
      e(t, l),
        (t.prototype =
          null === l
            ? Object.create(l)
            : ((o.prototype = l.prototype), new o()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.xlsx');
(window.wijmo = window.wijmo || {}), (window.wijmo.xlsx = wjcSelf);
var JSZip = window.JSZip;
(void 0 !== JSZip && JSZip) ||
  'function' != typeof window.require ||
  (JSZip = window.require('node-zip')),
  (exports.useJSZip = useJSZip);
var _xlsx = (function () {
  function e() {}
  return (
    (e.load = function (e) {
      var t,
        l = Date.now(),
        o = new JSZip(),
        s = { sheets: [], zipTime: Date.now() - l },
        r = Date.now();
      wjcCore.assert(
        null == o.loadAsync,
        'Please use JSZip 2.5 to load excel files synchronously.'
      ),
        (o = o.load(e, { base64: !0 })),
        (e = null),
        (t = o.file('docProps/core.xml')) &&
          this._getCoreSetting(t.asText(), s),
        (t = o.file('xl/workbook.xml')) && this._getWorkbook(t.asText(), s),
        (t = o.file('xl/theme/theme1.xml')) && this._getTheme(t.asText()),
        (s.colorThemes = this._colorThemes),
        (t = o.file('xl/styles.xml')) && this._getStyle(t.asText()),
        (s.styles = this._styles),
        (t = o.file('xl/sharedStrings.xml')) &&
          this._getSharedString(t.asText()),
        (t = o.file('xl/vbaProject.bin')) &&
          (null == s.reservedContent && (s.reservedContent = {}),
          (s.reservedContent.macros = t.asUint8Array()));
      for (var i = s.sheets.length; i--; )
        if (
          ((t = o.file('xl/worksheets/sheet' + (i + 1) + '.xml')),
          this._getSheet(t.asText(), i, s),
          (null != s.sheets[i].tableRIds ||
            null != s.sheets[i].hyperlinkRIds) &&
            null !=
              (t = o.file('xl/worksheets/_rels/sheet' + (i + 1) + '.xml.rels')))
        )
          for (
            var n = t.asText().split('<Relationship '), a = n.length;
            --a;

          ) {
            var h = n[a],
              c = this._getAttr(h, 'Id');
            s.sheets[i].tableRIds && -1 !== s.sheets[i].tableRIds.indexOf(c)
              ? (null == s.sheets[i].tableNames &&
                  (s.sheets[i].tableNames = []),
                s.sheets[i].tableNames.push(
                  this._getSheetRelatedTable(h, s.tables)
                ))
              : s.sheets[i].hyperlinkRIds &&
                this._getSheetRelatedHyperlink(h, c, s.sheets[i]);
          }
      return (s.processTime = Date.now() - r), (o = null), s;
    }),
    (e.loadAsync = function (e) {
      var t = this,
        l = Date.now(),
        o = new _Promise(),
        s = new JSZip(),
        r = { sheets: [] };
      return (
        wjcCore.assert(
          null != s.loadAsync,
          'Please use JSZip 3.0 to load excel files asynchrounously.'
        ),
        s.loadAsync(e, { base64: !0 }).then(function (s) {
          var i = [];
          e = null;
          var n = s.file('xl/theme/theme1.xml');
          n
            ? i.push(
                n.async('string').then(function (e) {
                  t._getTheme(e), (r.colorThemes = t._colorThemes);
                  var l = s.file('xl/styles.xml');
                  l &&
                    l.async('string').then(function (e) {
                      t._getStyle(e),
                        (r.styles = t._styles),
                        null != t._tableStyles &&
                          (r.tableStyles = t._tableStyles);
                    }),
                    (l = s.file('xl/sharedStrings.xml')) &&
                      i.push(
                        l.async('string').then(function (e) {
                          t._getSharedString(e);
                        })
                      );
                })
              )
            : ((n = s.file('xl/styles.xml')) &&
                i.push(
                  n.async('string').then(function (e) {
                    t._getStyle(e), (r.styles = t._styles);
                  })
                ),
              (n = s.file('xl/sharedStrings.xml')) &&
                i.push(
                  n.async('string').then(function (e) {
                    t._getSharedString(e);
                  })
                )),
            (n = s.file('xl/workbook.xml')) &&
              i.push(
                n.async('string').then(function (e) {
                  t._getWorkbook(e, r);
                })
              ),
            new _CompositedPromise(i).then(function (e) {
              var i = [],
                n = s.file('docProps/core.xml');
              n &&
                i.push(
                  n.async('string').then(function (e) {
                    t._getCoreSetting(e, r);
                  })
                );
              var a = s.file('xl/vbaProject.bin');
              a &&
                i.push(
                  a.async('uint8array').then(function (e) {
                    null == r.reservedContent && (r.reservedContent = {}),
                      (r.reservedContent.macros = e);
                  })
                ),
                s.folder('xl/worksheets').forEach(function (e, l) {
                  if (e && -1 === e.indexOf('/')) {
                    var o = t._getSheetIndex(l.name);
                    i.push(
                      l.async('string').then(function (e) {
                        if (
                          (t._getSheet(e, o - 1, r),
                          null != r.sheets[o - 1].tableRIds ||
                            null != r.sheets[o - 1].hyperlinkRIds)
                        ) {
                          var l = s.file(
                            'xl/worksheets/_rels/sheet' + o + '.xml.rels'
                          );
                          l &&
                            l.async('string').then(function (e) {
                              for (
                                var l = e.split('<Relationship '), s = l.length;
                                --s;

                              ) {
                                var i = l[s],
                                  n = t._getAttr(i, 'Id');
                                r.sheets[o - 1].tableRIds &&
                                -1 !== r.sheets[o - 1].tableRIds.indexOf(n)
                                  ? (null == r.sheets[o - 1].tableNames &&
                                      (r.sheets[o - 1].tableNames = []),
                                    r.sheets[o - 1].tableNames.push(
                                      t._getSheetRelatedTable(i, r.tables)
                                    ))
                                  : r.sheets[o - 1].hyperlinkRIds &&
                                    t._getSheetRelatedHyperlink(
                                      i,
                                      n,
                                      r.sheets[o - 1]
                                    );
                              }
                            });
                        }
                      })
                    );
                  }
                }),
                new _CompositedPromise(i).then(function (e) {
                  (r.processTime = Date.now() - l), (s = null), o.resolve(r);
                });
            });
        }),
        o
      );
    }),
    (e.save = function (e) {
      var t = Date.now(),
        l = this._saveWorkbookToZip(e);
      t = Date.now() - t;
      var o = '';
      o = this._macroEnabled
        ? 'application/vnd.ms-excel.sheet.macroEnabled.12;'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
      var s = Date.now(),
        r = l.generate({ compression: 'DEFLATE' });
      return {
        base64: r,
        zipTime: Date.now() - s,
        processTime: t,
        href: function () {
          return 'data:' + o + 'base64,' + r;
        },
      };
    }),
    (e.saveAsync = function (e, t) {
      var l = this._saveWorkbookToZip(e, !0).generateAsync({
        type: 'base64',
        compression: 'DEFLATE',
      });
      return t && l.catch(t), l;
    }),
    (e._saveWorkbookToZip = function (e, t) {
      void 0 === t && (t = !1);
      Date.now();
      var l = new JSZip();
      t
        ? wjcCore.assert(
            null != l.generateAsync,
            'Please use JSZip 3.0 to save excel files asynchrounously.'
          )
        : wjcCore.assert(
            null == l.generateAsync,
            'Please use JSZip 2.5 to save excel files synchronously.'
          ),
        l
          .folder('_rels')
          .file('.rels', this._xmlDescription + this._generateRelsDoc());
      var o = l.folder('docProps'),
        s = l.folder('xl');
      (this._colorThemes = e.colorThemes),
        s
          .folder('theme')
          .file('theme1.xml', this._xmlDescription + this._generateThemeDoc()),
        (this._macroEnabled = !(
          !e.reservedContent || !e.reservedContent.macros
        )),
        this._macroEnabled &&
          s.file('vbaProject.bin', e.reservedContent.macros);
      var r = s.folder('worksheets');
      if (
        (o.file('core.xml', this._xmlDescription + this._generateCoreDoc(e)),
        (this._sharedStrings = [[], 0]),
        (this._styles = new Array(1)),
        (this._borders = new Array(1)),
        (this._fonts = new Array(1)),
        (this._fills = new Array(2)),
        (this._tableStyles = new Array()),
        (this._dxfs = new Array()),
        (this._contentTypes = []),
        (this._props = []),
        (this._xlRels = []),
        (this._worksheets = []),
        (this._tables = []),
        (this._tableStyles = []),
        e.tables && e.tables.length > 0)
      )
        for (var i = s.folder('tables'), n = 0; n < e.tables.length; n++)
          this._generateTable(n, e.tables[n], i);
      for (var a = e.sheets.length; a--; )
        if (
          (this._generateWorkSheet(a, e, r),
          e.sheets[a] &&
            ((e.sheets[a].tableNames && e.sheets[a].tableNames.length > 0) ||
              (e.sheets[a].externalLinks &&
                e.sheets[a].externalLinks.length > 0)))
        ) {
          var h = 0,
            c =
              '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
          e.sheets[a].externalLinks &&
            e.sheets[a].externalLinks.length > 0 &&
            ((c += this._generateHyperlinkRel(e.sheets[a].externalLinks)),
            (h = e.sheets[a].externalLinks.length)),
            e.sheets[a].tableNames &&
              e.sheets[a].tableNames.length > 0 &&
              (c += this._generateTableRel(
                e.tables,
                e.sheets[a].tableNames,
                h
              )),
            (c += '</Relationships>'),
            r
              .folder('_rels')
              .file('sheet' + (a + 1) + '.xml.rels', this._xmlDescription + c);
        }
      s.file('styles.xml', this._xmlDescription + this._generateStyleDoc()),
        l.file(
          '[Content_Types].xml',
          this._xmlDescription + this._generateContentTypesDoc()
        ),
        o.file('app.xml', this._xmlDescription + this._generateAppDoc(e)),
        s
          .folder('_rels')
          .file(
            'workbook.xml.rels',
            this._xmlDescription + this._generateWorkbookRels()
          );
      var u = this._xmlDescription + this._generateSharedStringsDoc();
      return (
        (this._sharedStrings = [[], 0]),
        s.file('sharedStrings.xml', u),
        (u = null),
        s.file(
          'workbook.xml',
          this._xmlDescription + this._generateWorkbook(e)
        ),
        l
      );
    }),
    (e._getSharedString = function (e) {
      var t,
        l,
        o,
        s,
        r,
        i,
        n,
        a = e.split(/<si.*?>/g),
        h = a.length;
      for (this._sharedStrings = []; --h; )
        for (
          t = 1,
            s = !1,
            a[h].search(/<r>/gi) > -1
              ? ((s = !0), (l = a[h].split(/<r>/g)))
              : ((a[h] = a[h].substring(0, a[h].indexOf('</t>'))),
                (l = a[h].split(/<t.*?>/g)));
          t < l.length;

        )
          (i = null),
            s
              ? (-1 !== l[t].indexOf('<rPr>') &&
                  (i = this._getTextRunFont(l[t])),
                (o = l[t].match(/(<t.*?>)(.*)/)) &&
                  3 === o.length &&
                  null != o[2] &&
                  (n = o[2].substring(0, o[2].indexOf('</t>'))),
                (r = { font: i, text: Workbook._unescapeXML(n) }),
                null == this._sharedStrings[h - 1]
                  ? (this._sharedStrings[h - 1] = [r])
                  : this._sharedStrings[h - 1].push(r))
              : (this._sharedStrings[h - 1] = Workbook._unescapeXML(l[t])),
            t++;
    }),
    (e._getInlineString = function (e) {
      for (var t = e.split('<t>'), l = t.length, o = ''; --l; )
        o += t[l].substring(0, t[l].indexOf('</t>'));
      return o;
    }),
    (e._getCoreSetting = function (e, t) {
      var l, o;
      (o = e.indexOf('<dc:creator>')) >= 0 &&
        ((l = e.substr(o + 12)),
        (t.creator = l.substring(0, l.indexOf('</dc:creator>')))),
        (o = e.indexOf('<cp:lastModifiedBy>')) >= 0 &&
          ((l = e.substr(o + 19)),
          (t.lastModifiedBy = l.substring(
            0,
            l.indexOf('</cp:lastModifiedBy>')
          ))),
        (o = e.indexOf('<dcterms:created xsi:type="dcterms:W3CDTF">')) >= 0 &&
          ((l = e.substr(o + 43)),
          (t.created = new Date(
            l.substring(0, l.indexOf('</dcterms:created>'))
          ))),
        (o = e.indexOf('<dcterms:modified xsi:type="dcterms:W3CDTF">')) >= 0 &&
          ((l = e.substr(o + 44)),
          (t.modified = new Date(
            l.substring(0, l.indexOf('</dcterms:modified>'))
          )));
    }),
    (e._getWorkbook = function (e, t) {
      var l,
        o,
        s,
        r,
        i,
        n,
        a,
        h,
        c = e.substring(e.indexOf('<bookViews>'), e.indexOf('</bookViews>')),
        u = '',
        f = e.indexOf('<definedNames>');
      for (
        c && (u = this._getAttr(c, 'activeTab')),
          t.activeWorksheet = +u,
          n = (i = e.split('<sheet ')).length;
        --n;

      )
        (a = this._getAttr(i[n], 'name')),
          (h = 'hidden' !== this._getAttr(i[n], 'state')),
          t.sheets.unshift({
            name: a,
            visible: h,
            columns: [],
            rows: [],
          });
      if (f > -1)
        for (
          t.definedNames = [],
            n = (i = e
              .substring(f, e.indexOf('</definedNames>'))
              .split('<definedName ')).length;
          --n;

        )
          (a = this._getAttr(i[n], 'name')),
            (o = i[n].match(/.*>.+(?=<\/definedName>)/)) &&
              ((o = o[0].replace(/(.*>)(.+)/, '$2')), (o = isNaN(+o) ? o : +o)),
            (l = { name: a, value: o }),
            '' !== (s = this._getAttr(i[n], 'localSheetId')) &&
              (r = t.sheets[+s]) &&
              (l.sheetName = r.name),
            t.definedNames.unshift(l);
    }),
    (e._getTheme = function (e) {
      (e = e.substring(e.indexOf('<a:clrScheme'), e.indexOf('</a:clrScheme>'))),
        (this._colorThemes = this._defaultColorThemes.slice()),
        (this._colorThemes[0] = this._getAttr(
          e.substring(e.indexOf('a:lt1'), e.indexOf('</a:lt1>')),
          'lastClr'
        )),
        (this._colorThemes[1] = this._getAttr(
          e.substring(e.indexOf('a:dk1'), e.indexOf('</a:dk1>')),
          'lastClr'
        )),
        (this._colorThemes[2] = this._getAttr(
          e.substring(e.indexOf('a:lt2'), e.indexOf('</a:lt2>')),
          'val'
        )),
        (this._colorThemes[3] = this._getAttr(
          e.substring(e.indexOf('a:dk2'), e.indexOf('</a:dk2>')),
          'val'
        ));
      for (
        var t = e
            .substring(e.indexOf('<a:accent1'), e.indexOf('</a:accent6>'))
            .split('<a:accent'),
          l = t.length;
        --l;

      )
        this._colorThemes[l + 3] = this._getAttr(t[l], 'val');
    }),
    (e._getStyle = function (e) {
      var t,
        l,
        o,
        s,
        r,
        i = [],
        n = [],
        a = [],
        h = this._numFmts.slice();
      if (((this._styles = []), (o = e.indexOf('<numFmts')) >= 0)) {
        var c = e.substring(o + 8, e.indexOf('</numFmts>')).split('<numFmt');
        for (t = c.length; --t; )
          (l = c[t]),
            (h[+this._getAttr(l, 'numFmtId')] = this._getAttr(l, 'formatCode'));
      }
      if ((o = e.indexOf('<fonts')) >= 0) {
        var u = e.substring(o, e.indexOf('</fonts>')).split('<font>');
        for (t = u.length; --t; )
          (l = u[t]),
            (s = this._getChildNodeValue(l, 'sz')),
            (i[t - 1] = {
              bold: l.indexOf('<b/>') >= 0,
              italic: l.indexOf('<i/>') >= 0,
              underline: l.indexOf('<u/>') >= 0,
              size: Math.round(s ? (96 * +s) / 72 : 14),
              family: this._getChildNodeValue(l, 'name'),
              color: this._getColor(l, !1),
            }),
            (s = null);
      }
      if ((o = e.indexOf('<fills')) >= 0) {
        var f = e.substring(o, e.indexOf('</fills>')).split('<fill>');
        for (t = f.length; --t; ) n[t - 1] = this._getColor(f[t], !0);
      }
      if ((o = e.indexOf('<borders')) >= 0) {
        var d = e.substring(o, e.indexOf('</borders>')).split('<border>');
        for (t = d.length; --t; )
          (l = d[t]),
            (a[t - 1] = {
              left: this._getEdgeBorder(l, 'left'),
              right: this._getEdgeBorder(l, 'right'),
              top: this._getEdgeBorder(l, 'top'),
              bottom: this._getEdgeBorder(l, 'bottom'),
            });
      }
      if ((o = e.indexOf('<cellXfs')) >= 0) {
        var m = e.substring(o, e.indexOf('</cellXfs>')).split('<xf');
        t = m.length;
        for (var p, g, y, _, b, S; --t; )
          (l = m[t]),
            (g = (p = h[(y = +this._getAttr(l, 'numFmtId'))])
              ? /[hsmy\:]/i.test(p)
                ? 'date'
                : p.indexOf('0') > -1
                ? 'number'
                : '@' === p
                ? 'string'
                : 'unknown'
              : 'unknown'),
            (_ = (y = +this._getAttr(l, 'fontId')) > 0 ? i[y] : null),
            (b = (y = +this._getAttr(l, 'fillId')) > 1 ? n[y] : null),
            (S = (y = +this._getAttr(l, 'borderId')) > 0 ? a[y] : null),
            (o = l.indexOf('<alignment')),
            (r = +this._getAttr(l, 'quotePrefix')),
            this._styles.unshift({
              formatCode: p,
              type: g,
              font: _,
              fillColor: b,
              borders: S,
              hAlign:
                o >= 0
                  ? Workbook._parseStringToHAlign(
                      this._getAttr(l, 'horizontal')
                    )
                  : null,
              vAlign:
                o >= 0
                  ? Workbook._parseStringToVAlign(this._getAttr(l, 'vertical'))
                  : null,
              wordWrap: o >= 0 ? '1' === this._getAttr(l, 'wrapText') : null,
              quotePrefix: 1 === r,
            });
      }
      if (e.indexOf('<tableStyle ') > -1) {
        this._tableStyles = [];
        var v = e.substring(
            e.indexOf('<tableStyles '),
            e.indexOf('</tableStyles>')
          ),
          w = e.substring(e.indexOf('<dxfs '), e.indexOf('</dxfs>'));
        this._getTableStyles(v, w.split('<dxf>'));
      }
    }),
    (e._getEdgeBorder = function (e, t) {
      var l,
        o,
        s,
        r,
        i = e.indexOf('<' + t),
        n = e.indexOf('</' + t + '>');
      if (i >= 0) {
        (o = e.substring(i)),
          (o = n >= 0 ? o.substring(0, n) : o.substring(0, o.indexOf('/>')));
        var a = this._getAttr(o, 'style');
        a &&
          ((s = Workbook._parseStringToBorderType(a)),
          (r = this._getColor(o, !1)),
          (s === BorderStyle.Thin &&
            r &&
            wjcCore.isString(r) &&
            '#c6c6c6' === r.toLowerCase()) ||
            (((l = {}).style = s), (l.color = r)));
      }
      return l;
    }),
    (e._getSheet = function (e, t, l) {
      var o,
        s = [];
      if (e.indexOf('<mergeCells') > -1)
        for (
          var r = e
              .substring(e.indexOf('<mergeCells'), e.indexOf('</mergeCells>'))
              .split('<mergeCell '),
            i = r.length;
          --i;

        )
          2 === (o = this._getAttr(r[i], 'ref').split(':')).length &&
            s.unshift({
              topRow: +o[0].match(/\d*/g).join('') - 1,
              leftCol: this._alphaNum(o[0].match(/[a-zA-Z]*/g)[0]),
              bottomRow: +o[1].match(/\d*/g).join('') - 1,
              rightCol: this._alphaNum(o[1].match(/[a-zA-Z]*/g)[0]),
            });
      this._getsBaseSharedFormulas(e);
      var n = e.split('<row '),
        a = l.sheets[t];
      if (n[0].indexOf('<dimension') >= 0) {
        var h = this._getAttr(n[0].substr(n[0].indexOf('<dimension')), 'ref');
        h &&
          ((h = h.substr(h.indexOf(':') + 1)),
          (a.maxCol = this._alphaNum(h.match(/[a-zA-Z]*/g)[0]) + 1),
          (a.maxRow = +h.match(/\d*/g).join('')));
      }
      var c = [],
        u = [],
        f = [],
        d = null,
        m = null;
      if (n.length > 0 && n[0].indexOf('<cols>') > -1)
        for (
          var p =
            (c = n[0]
              .substring(n[0].indexOf('<cols>') + 6, n[0].indexOf('</cols>'))
              .split('<col ')).length - 1;
          p > 0;
          p--
        ) {
          var g = this._parseCharWidthToPixel(+this._getAttr(c[p], 'width'));
          (m = null),
            c[p].indexOf('style') > -1 &&
              (m = this._styles[+this._getAttr(c[p], 'style')] || {
                type: 'General',
                formatCode: null,
              }),
            (d = null),
            m &&
              (m.font ||
                m.fillColor ||
                m.hAlign ||
                m.vAlign ||
                m.wordWrap ||
                m.borders ||
                (m.formatCode && 'General' !== m.formatCode)) &&
              (d = {
                format:
                  m.formatCode && 'General' !== m.formatCode
                    ? m.formatCode
                    : null,
                font: m.font,
                fill: { color: m.fillColor },
                borders: m.borders,
                hAlign: m.hAlign,
                vAlign: m.vAlign,
                wordWrap: m.wordWrap,
              });
          for (
            var y = +this._getAttr(c[p], 'min') - 1;
            y < +this._getAttr(c[p], 'max');
            y++
          )
            u[y] = {
              visible: '1' !== this._getAttr(c[p], 'hidden'),
              autoWidth: '1' === this._getAttr(c[p], 'bestFit'),
              width: g,
              style: d,
            };
        }
      if (
        ((a.columns = u),
        n.length > 0 &&
          n[0].indexOf('<pane') > -1 &&
          'frozen' ===
            this._getAttr(n[0].substr(n[0].indexOf('<pane')), 'state'))
      ) {
        var _ = this._getAttr(n[0].substr(n[0].indexOf('<pane')), 'ySplit'),
          b = this._getAttr(n[0].substr(n[0].indexOf('<pane')), 'xSplit');
        a.frozenPane = { rows: _ ? +_ : NaN, columns: b ? +b : NaN };
      }
      for (
        a.summaryBelow = '0' !== this._getAttr(n[0], 'summaryBelow'),
          i = n.length;
        --i;

      ) {
        var S = (a.rows[+this._getAttr(n[i], 'r') - 1] = {
          visible: !0,
          groupLevel: NaN,
          cells: [],
        });
        if (
          (n[i].substring(0, n[i].indexOf('>')).indexOf('hidden') > -1 &&
            '1' === this._getAttr(n[i], 'hidden') &&
            (S.visible = !1),
          '1' === this._getAttr(n[i], 'customHeight'))
        ) {
          var v = +this._getAttr(
            n[i].substring(0, n[i].indexOf('>')).replace('customHeight', ''),
            'ht'
          );
          S.height = (96 * v) / 72;
        }
        (d = null),
          (m = null),
          '1' === this._getAttr(n[i], 'customFormat') &&
            (d =
              (m = this._styles[
                +this._getAttr(n[i].substring(n[i].indexOf(' s=')), 's')
              ] || { type: 'General', formatCode: null }).font ||
              m.fillColor ||
              m.hAlign ||
              m.vAlign ||
              m.wordWrap ||
              m.borders ||
              (m.formatCode && 'General' !== m.formatCode)
                ? {
                    format:
                      m.formatCode && 'General' !== m.formatCode
                        ? m.formatCode
                        : null,
                    font: m.font,
                    fill: { color: m.fillColor },
                    borders: m.borders,
                    hAlign: m.hAlign,
                    vAlign: m.vAlign,
                    wordWrap: m.wordWrap,
                  }
                : null),
          (S.style = d);
        var w = this._getAttr(n[i], 'outlineLevel');
        (S.groupLevel = w && '' !== w ? +w : NaN),
          (S.collapsed = '1' === this._getAttr(n[i], 'collapsed'));
        for (var C = n[i].split('<c '), x = C.length; --x; ) {
          var k = C[x];
          d =
            (m = this._styles[+this._getAttr(k, 's')] || {
              type: 'General',
              formatCode: null,
            }).font ||
            m.fillColor ||
            m.hAlign ||
            m.vAlign ||
            m.wordWrap ||
            m.borders ||
            (m.formatCode && 'General' !== m.formatCode)
              ? {
                  format:
                    m.formatCode && 'General' !== m.formatCode
                      ? m.formatCode
                      : null,
                  font: m.font,
                  fill: { color: m.fillColor },
                  borders: m.borders,
                  hAlign: m.hAlign,
                  vAlign: m.vAlign,
                  wordWrap: m.wordWrap,
                }
              : null;
          var T = this._getAttr(k.substring(0, k.indexOf('>')), 't') || m.type,
            F = null,
            A = 'inlineStr' === T || k.indexOf('<is>') >= 0;
          A
            ? (F = this._getInlineString(k))
            : k.indexOf('<v>') > -1 &&
              (F = k.substring(k.indexOf('<v>') + 3, k.indexOf('</v>')));
          var z = null,
            R = null,
            W = null;
          k.indexOf('<f') > -1 &&
            (k.indexOf('</f>') > -1
              ? (z = k.match(/<f.*>.+(?=<\/f>)/)) &&
                (z = z[0].replace(/(\<f.*>)(.+)/, '$2'))
              : (R = this._getAttr(k, 'si')) &&
                ((W = this._getAttr(k, 'r')),
                (z = this._getSharedFormula(R, W)))),
            null != z &&
              (z = z.replace(/\[\#This Row\]\s*,\s*\[([^\]]+)\]/gi, '@$1')),
            'str' === T || 'e' === T || A || (F = F ? +F : ''),
            (y = this._alphaNum(this._getAttr(k, 'r').match(/[a-zA-Z]*/g)[0]));
          var N = null;
          switch (T) {
            case 's':
              null != (F = this._sharedStrings[F]) &&
                (wjcCore.isString(F)
                  ? m && m.quotePrefix && "'" !== F[0] && (F = "'" + F)
                  : ((N = F.slice()), (F = this._getTextOfTextRuns(N))));
              break;
            case 'b':
              F = 1 === F;
              break;
            case 'date':
              F = F ? this._convertDate(F) : '';
          }
          wjcCore.isNumber(F) &&
            (null == d && (d = { format: '' }),
            wjcCore.isInt(F)
              ? (d.format = d.format || '#,##0')
              : (d.format = d.format || '#,##0.00')),
            (S.cells[y] = {
              value: F,
              textRuns: N,
              isDate: 'date' === T,
              formula: Workbook._unescapeXML(z),
              style: d,
              visible: -1 === f.indexOf(y),
            });
        }
      }
      var O = e.indexOf('<hyperlinks');
      if (O > -1)
        for (
          var B = e
              .substring(O, e.indexOf('</hyperlinks>'))
              .split('<hyperlink '),
            D = B.length;
          --D;

        )
          this._getHyperlink(a, B[D]);
      if (a.frozenPane) {
        if (!isNaN(a.frozenPane.rows))
          for (i = 0; i < a.rows.length && i < a.frozenPane.rows; i++)
            a.rows[i] && !a.rows[i].visible && a.frozenPane.rows++;
        if (!isNaN(a.frozenPane.columns))
          for (i = 0; i < u.length && i < a.frozenPane.columns; i++)
            u[i] && !u[i].visible && a.frozenPane.columns++;
      }
      var P;
      for (x = 0; x < s.length; x++)
        (P = s[x]),
          (a.rows[P.topRow].cells[P.leftCol].rowSpan =
            P.bottomRow - P.topRow + 1),
          (a.rows[P.topRow].cells[P.leftCol].colSpan =
            P.rightCol - P.leftCol + 1);
    }),
    (e._getTable = function (e) {
      var t = {};
      (t.name = this._getAttr(e, 'name')), (t.ref = this._getAttr(e, 'ref'));
      var l = this._getAttr(e, 'headerRowCount');
      t.showHeaderRow = '' == l || '1' === l;
      var o = this._getAttr(e, 'totalsRowCount');
      t.showTotalRow = '1' === o;
      var s = e.substring(e.indexOf('<tableStyleInfo')),
        r = this._getAttr(s, 'name');
      this._isBuiltInStyleName(r)
        ? (t.style = { name: r })
        : (t.style = this._getTableStyleByName(r)),
        (t.showBandedColumns = '1' === this._getAttr(s, 'showColumnStripes')),
        (t.showBandedRows = '1' === this._getAttr(s, 'showRowStripes')),
        (t.showFirstColumn = '1' === this._getAttr(s, 'showFirstColumn')),
        (t.showLastColumn = '1' === this._getAttr(s, 'showLastColumn'));
      var i = e.split('<tableColumn ');
      t.columns = [];
      for (var n = 1; n < i.length; n++) {
        var a = i[n];
        t.columns.push(this._getTableColumn(a));
      }
      if (e.indexOf('filterColumn') > -1)
        for (
          var h = e
              .substring(e.indexOf('<autoFilter'), e.indexOf('</autoFilter>'))
              .split('<filterColumn'),
            c = 1;
          c < h.length;
          c++
        ) {
          var u = h[c],
            f = +this._getAttr(u, 'colId');
          t.columns[f].showFilterButton =
            '1' !== this._getAttr(u, 'hiddenButton');
        }
      return t;
    }),
    (e._getTableColumn = function (e) {
      var t = {};
      t.name = this._getAttr(e, 'name');
      var l = this._getAttr(e, 'totalsRowLabel');
      if (l) t.totalRowLabel = l;
      else {
        var o = this._getAttr(e, 'totalsRowFunction');
        'custom' === o &&
          (o = e.substring(
            e.indexOf('<totalsRowFormula>') + 2 + 'totalsRowFormula'.length,
            e.indexOf('</totalsRowFormula>')
          )),
          (t.totalRowFunction = o);
      }
      return t;
    }),
    (e._getSheetRelatedTable = function (e, t) {
      var l = this._getAttr(e, 'Target');
      l = l.substring(l.lastIndexOf('/') + 1);
      for (var o = 0; o < t.length; o++) {
        var s = t[o];
        if (l === s.fileName) return s.name;
      }
      return '';
    }),
    (e._getSheetRelatedHyperlink = function (e, t, l) {
      for (var o = 0; o < l.hyperlinkRIds.length; o++) {
        var s = l.hyperlinkRIds[o];
        if (s.rId === t) {
          var r = this._getAttr(e, 'Target');
          l.rows[s.ref.row] &&
            l.rows[s.ref.row].cells[s.ref.col] &&
            (l.rows[s.ref.row].cells[s.ref.col].link = r);
        }
      }
    }),
    (e._getTableStyles = function (e, t) {
      for (var l = e.split('<tableStyle '), o = l.length; --o; ) {
        var s = {},
          r = l[o];
        s.name = this._getAttr(r, 'name');
        for (var i = r.split('<tableStyleElement '), n = i.length; --n; ) {
          var a = i[n],
            h = this._getAttr(a, 'type');
          switch (h) {
            case 'firstRowStripe':
              h = 'firstBandedRowStyle';
              break;
            case 'secondRowStripe':
              h = 'secondBandedRowStyle';
              break;
            case 'firstColumnStripe':
              h = 'firstBandedColumnStyle';
              break;
            case 'secondColumnStripe':
              h = 'secondBandedColumnStyle';
              break;
            default:
              h += 'Style';
          }
          var c = this._getAttr(a, 'dxfId');
          '' !== c && (s[h] = this._getTableStyleElement(t[+c + 1]));
          var u = this._getAttr(a, 'size');
          u && (null == s[h] && (s[h] = {}), (s[h].size = +u));
        }
        this._tableStyles.push(s);
      }
    }),
    (e._getTableStyleElement = function (e) {
      var t = null,
        l = null,
        o = null,
        s = null,
        r = e.indexOf('<font>');
      if (r >= 0) {
        t = e.substring(r, e.indexOf('</font>'));
        var i = this._getChildNodeValue(t, 'sz');
        l = {
          bold: '1' === this._getChildNodeValue(t, 'b'),
          italic: '1' === this._getChildNodeValue(t, 'i'),
          underline: '1' === this._getChildNodeValue(t, 'u'),
          size: Math.round(i ? (96 * +i) / 72 : 14),
          family: this._getChildNodeValue(t, 'name'),
          color: this._getColor(t, !1),
        };
      }
      return (
        (t = null),
        (r = e.indexOf('<fill>')) >= 0 &&
          ((t = e.substring(r, e.indexOf('</fill>'))),
          (o = { color: this._getColor(t, !0) })),
        (t = null),
        (r = e.indexOf('<border>')) >= 0 &&
          ((t = e.substring(r, e.indexOf('</border>'))),
          (s = {
            left: this._getEdgeBorder(t, 'left'),
            right: this._getEdgeBorder(t, 'right'),
            top: this._getEdgeBorder(t, 'top'),
            bottom: this._getEdgeBorder(t, 'bottom'),
            vertical: this._getEdgeBorder(t, 'vertical'),
            horizontal: this._getEdgeBorder(t, 'horizontal'),
          })),
        { font: l, fill: o, borders: s }
      );
    }),
    (e._getTableStyleByName = function (e) {
      var t, l;
      if (null == this._tableStyles || 0 === this._tableStyles.length)
        return null;
      for (t = 0; t < this._tableStyles.length; t++)
        if (
          (l = this._tableStyles[t]) &&
          l.name.toLowerCase() === e.toLowerCase()
        )
          return l;
      return null;
    }),
    (e._getHyperlink = function (e, t) {
      var l, o, s, r, i, n;
      if (null != (l = this._getAttr(t, 'ref'))) {
        (s = l.split(':')),
          null == (i = this._getAttr(t, 'r:id')) &&
            (n = this._getAttr(t, 'location'));
        for (var a = 0; a < s.length; a++)
          (o = s[a]),
            (r = Workbook.tableAddress(o)),
            i
              ? (null == e.hyperlinkRIds && (e.hyperlinkRIds = []),
                e.hyperlinkRIds.push({ ref: r, rId: i }))
              : n &&
                e.rows[r.row] &&
                e.rows[r.row].cells[r.col] &&
                (e.rows[r.row].cells[r.col].link = n);
      }
    }),
    (e._getTextRunFont = function (e) {
      var t = this._getChildNodeValue(e, 'sz');
      return {
        bold: e.indexOf('<b/>') >= 0,
        italic: e.indexOf('<i/>') >= 0,
        underline: e.indexOf('<u/>') >= 0,
        size: Math.round(t ? (96 * +t) / 72 : 14),
        family: this._getChildNodeValue(e, 'name'),
        color: this._getColor(e, !1),
      };
    }),
    (e._getTextOfTextRuns = function (e) {
      var t,
        l,
        o = '';
      for (t = 0; t < e.length; t++) (l = e[t]) && (o += l.text);
      return o;
    }),
    (e._isBuiltInStyleName = function (e) {
      var t;
      if (0 === e.search(/TableStyleLight/i)) {
        if (((t = +e.substring(15)), !isNaN(t) && t >= 1 && t <= 21)) return !0;
      } else if (0 === e.search(/TableStyleMedium/i)) {
        if (((t = +e.substring(16)), !isNaN(t) && t >= 1 && t <= 28)) return !0;
      } else if (
        0 === e.search(/TableStyleDark/i) &&
        ((t = +e.substring(14)), !isNaN(t) && t >= 1 && t <= 11)
      )
        return !0;
      return !1;
    }),
    (e._generateRelsDoc = function () {
      return (
        '<Relationships xmlns="' +
        this._relationshipsNS +
        '"><Relationship Target="docProps/app.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Id="rId3"/><Relationship Target="docProps/core.xml" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Id="rId2"/><Relationship Target="xl/workbook.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Id="rId1"/></Relationships>'
      );
    }),
    (e._generateThemeDoc = function () {
      return (
        '<a:theme name="Office Theme" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:themeElements>' +
        this._generateClrScheme() +
        this._generateFontScheme() +
        this._generateFmtScheme() +
        '</a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>'
      );
    }),
    (e._generateClrScheme = function () {
      return (
        null === this._colorThemes && (this._colorThemes = []),
        '<clrScheme name="Office"><a:dk1><a:sysClr lastClr="' +
          (this._colorThemes[1] || '000000') +
          '" val="windowText"/></a:dk1><a:lt1><a:sysClr lastClr="' +
          (this._colorThemes[0] || 'FFFFFF') +
          '" val="window"/></a:lt1><a:dk2><a:srgbClr val="' +
          (this._colorThemes[3] || '1F497D') +
          '"/></a:dk2><a:lt2><a:srgbClr val="' +
          (this._colorThemes[2] || 'EEECE1') +
          '"/></a:lt2><a:accent1><a:srgbClr val="' +
          (this._colorThemes[4] || '4F81BD') +
          '"/></a:accent1><a:accent2><a:srgbClr val="' +
          (this._colorThemes[5] || 'C0504D') +
          '"/></a:accent2><a:accent3><a:srgbClr val="' +
          (this._colorThemes[6] || '9BBB59') +
          '"/></a:accent3><a:accent4><a:srgbClr val="' +
          (this._colorThemes[7] || '8064A2') +
          '"/></a:accent4><a:accent5><a:srgbClr val="' +
          (this._colorThemes[8] || '4BACC6') +
          '"/></a:accent5><a:accent6><a:srgbClr val="' +
          (this._colorThemes[9] || 'F79646') +
          '"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></clrScheme>'
      );
    }),
    (e._generateFontScheme = function () {
      return '<a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font typeface="ＭＳ Ｐゴシック" script="Jpan"/><a:font typeface="맑은 고딕" script="Hang"/><a:font typeface="宋体" script="Hans"/><a:font typeface="新細明體" script="Hant"/><a:font typeface="Times New Roman" script="Arab"/><a:font typeface="Times New Roman" script="Hebr"/><a:font typeface="Tahoma" script="Thai"/><a:font typeface="Nyala" script="Ethi"/><a:font typeface="Vrinda" script="Beng"/><a:font typeface="Shruti" script="Gujr"/><a:font typeface="MoolBoran" script="Khmr"/><a:font typeface="Tunga" script="Knda"/><a:font typeface="Raavi" script="Guru"/><a:font typeface="Euphemia" script="Cans"/><a:font typeface="Plantagenet Cherokee" script="Cher"/><a:font typeface="Microsoft Yi Baiti" script="Yiii"/><a:font typeface="Microsoft Himalaya" script="Tibt"/><a:font typeface="MV Boli" script="Thaa"/><a:font typeface="Mangal" script="Deva"/><a:font typeface="Gautami" script="Telu"/><a:font typeface="Latha" script="Taml"/><a:font typeface="Estrangelo Edessa" script="Syrc"/><a:font typeface="Kalinga" script="Orya"/><a:font typeface="Kartika" script="Mlym"/><a:font typeface="DokChampa" script="Laoo"/><a:font typeface="Iskoola Pota" script="Sinh"/><a:font typeface="Mongolian Baiti" script="Mong"/><a:font typeface="Times New Roman" script="Viet"/><a:font typeface="Microsoft Uighur" script="Uigh"/><a:font typeface="Sylfaen" script="Geor"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font typeface="ＭＳ Ｐゴシック" script="Jpan"/><a:font typeface="맑은 고딕" script="Hang"/><a:font typeface="宋体" script="Hans"/><a:font typeface="新細明體" script="Hant"/><a:font typeface="Arial" script="Arab"/><a:font typeface="Arial" script="Hebr"/><a:font typeface="Tahoma" script="Thai"/><a:font typeface="Nyala" script="Ethi"/><a:font typeface="Vrinda" script="Beng"/><a:font typeface="Shruti" script="Gujr"/><a:font typeface="DaunPenh" script="Khmr"/><a:font typeface="Tunga" script="Knda"/><a:font typeface="Raavi" script="Guru"/><a:font typeface="Euphemia" script="Cans"/><a:font typeface="Plantagenet Cherokee" script="Cher"/><a:font typeface="Microsoft Yi Baiti" script="Yiii"/><a:font typeface="Microsoft Himalaya" script="Tibt"/><a:font typeface="MV Boli" script="Thaa"/><a:font typeface="Mangal" script="Deva"/><a:font typeface="Gautami" script="Telu"/><a:font typeface="Latha" script="Taml"/><a:font typeface="Estrangelo Edessa" script="Syrc"/><a:font typeface="Kalinga" script="Orya"/><a:font typeface="Kartika" script="Mlym"/><a:font typeface="DokChampa" script="Laoo"/><a:font typeface="Iskoola Pota" script="Sinh"/><a:font typeface="Mongolian Baiti" script="Mong"/><a:font typeface="Arial" script="Viet"/><a:font typeface="Microsoft Uighur" script="Uigh"/><a:font typeface="Sylfaen" script="Geor"/></a:minorFont></a:fontScheme>';
    }),
    (e._generateFmtScheme = function () {
      return (
        '<a:fmtScheme name="Office">' +
        this._generateFillScheme() +
        this._generateLineStyles() +
        this._generateEffectScheme() +
        this._generateBgFillScheme() +
        '</a:fmtScheme>'
      );
    }),
    (e._generateFillScheme = function () {
      return '<a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin scaled="1" ang="16200000"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin scaled="1" ang="16200000"/></a:gradFill></a:fillStyleLst>';
    }),
    (e._generateLineStyles = function () {
      return '<a:lnStyleLst><a:ln algn="ctr" cmpd="sng" cap="flat" w="9525"><a:solidFill><a:schemeClr val="phClr"><a:shade val="9500"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln algn="ctr" cmpd="sng" cap="flat" w="25400"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln algn="ctr" cmpd="sng" cap="flat" w="38100"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst>';
    }),
    (e._generateEffectScheme = function () {
      return '<a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw dir="5400000" rotWithShape="0" dist="23000" blurRad="40000"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw dir="5400000" rotWithShape="0" dist="23000" blurRad="40000"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw dir="5400000" rotWithShape="0" dist="23000" blurRad="40000"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot rev="0" lon="0" lat="0"/></a:camera><a:lightRig dir="t" rig="threePt"><a:rot rev="1200000" lon="0" lat="0"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst>';
    }),
    (e._generateBgFillScheme = function () {
      return '<a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst>';
    }),
    (e._generateCoreDoc = function (e) {
      var t =
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
      return (
        e.creator
          ? (t += '<dc:creator>' + e.creator + '</dc:creator>')
          : (t += '<dc:creator/>'),
        e.lastModifiedBy
          ? (t +=
              '<cp:lastModifiedBy>' + e.lastModifiedBy + '</cp:lastModifiedBy>')
          : (t += '<cp:lastModifiedBy/>'),
        (t +=
          '<dcterms:created xsi:type="dcterms:W3CDTF">' +
          (e.created || new Date()).toISOString() +
          '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' +
          (e.modified || new Date()).toISOString() +
          '</dcterms:modified></cp:coreProperties>')
      );
    }),
    (e._generateSheetGlobalSetting = function (e, t, l) {
      var o =
          t.rows && t.rows[0] && t.rows[0].cells ? t.rows[0].cells.length : 0,
        s =
          ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">';
      return (
        (s += '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>'),
        (s +=
          '<dimension ref="A1' +
          (o > 0 ? ':' + this._numAlpha(o - 1) + t.rows.length : '') +
          '"/>'),
        (s += '<sheetViews><sheetView workbookViewId="0"'),
        e === l.activeWorksheet && (s += ' tabSelected="1"'),
        !t.frozenPane || (0 === t.frozenPane.rows && 0 === t.frozenPane.columns)
          ? (s += '/>')
          : ((s += '>'),
            (s +=
              '<pane state="frozen" activePane="' +
              (0 !== t.frozenPane.rows && 0 !== t.frozenPane.columns
                ? 'bottomRight'
                : 0 !== t.frozenPane.rows
                ? 'bottomLeft'
                : 'topRight') +
              '" topLeftCell="' +
              (this._numAlpha(t.frozenPane.columns) + (t.frozenPane.rows + 1)) +
              '" ySplit="' +
              t.frozenPane.rows.toString() +
              '" xSplit="' +
              t.frozenPane.columns.toString() +
              '"/>'),
            (s += '</sheetView>')),
        (s += '</sheetViews>'),
        (s += '<sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/>')
      );
    }),
    (e._generateCell = function (e, t, l, o, s, r) {
      var i =
        '<c r="' + this._numAlpha(t) + (e + 1) + '" s="' + l.toString() + '"';
      o && (i += ' t="' + o + '"');
      var n = '';
      return (
        r &&
          ((r = r.replace(/\[\@([^\]]+)\]/gi, '[[#This Row], [$1]]')),
          (n += '<f ca="1">' + Workbook._escapeXML(r) + '</f>')),
        null != s && '' !== s && (n += '<v>' + s + '</v>'),
        i + (n ? '>' + n + '</c>' : '/>')
      );
    }),
    (e._generateMergeSetting = function (e) {
      for (
        var t = '<mergeCells count="' + e.length.toString() + '">', l = 0;
        l < e.length;
        l++
      )
        t += '<mergeCell ref="' + e[l].join(':') + '"/>';
      return t + '</mergeCells>';
    }),
    (e._generateStyleDoc = function () {
      var e =
          '<styleSheet xmlns="' +
          this._workbookNS +
          '" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac">',
        t = '',
        l = '',
        o = [],
        s = 0,
        r = 0,
        i = '',
        n = '';
      n = this._generateFontStyle({}, !0);
      var a = '',
        h = '';
      (h += this._generateFillStyle('none', null)),
        (h += this._generateFillStyle('gray125', null));
      var c = '',
        u = '';
      u += this._generateBorderStyle({});
      var f = '',
        d = '';
      for (
        d += this._generateCellXfs(0, 0, 0, 0, {});
        s < this._styles.length;

      ) {
        var m = this._styles[s];
        if (m) {
          var p = 0;
          if (
            (m = JSON.parse(m)).format &&
            'General' !== m.format &&
            (p = this._numFmts.indexOf(m.format)) < 0
          ) {
            var g = o.indexOf(m.format);
            -1 === g
              ? (o.push(m.format),
                (l +=
                  '<numFmt numFmtId="' +
                  (p = 164 + r).toString() +
                  '" formatCode="' +
                  m.format +
                  '"/>'),
                r++)
              : (p = 164 + g);
          }
          var y = 0;
          if (m.borders) {
            var _ = JSON.stringify(m.borders);
            (y = this._borders.indexOf(_)) < 0 &&
              ((y = this._borders.push(_) - 1),
              (u += this._generateBorderStyle(m.borders)));
          }
          var b = 0;
          if (m.font) {
            var S = JSON.stringify(m.font);
            (b = this._fonts.indexOf(S)) < 0 &&
              ((b = this._fonts.push(S) - 1),
              (n += this._generateFontStyle(m.font)));
          }
          var v = 0;
          if (m.fill && m.fill.color) {
            var w = JSON.stringify(m.fill);
            (v = this._fills.indexOf(w)) < 0 &&
              ((v = this._fills.push(w) - 1),
              (h += this._generateFillStyle('solid', m.fill.color)));
          }
          d += this._generateCellXfs(p, y, b, v, m);
        }
        s++;
      }
      (o = null),
        r > 0
          ? ((t = '<numFmts count="' + r + '">'), (t += l), (t += '</numFmts>'))
          : (t = '<numFmts count="0"/>'),
        (e += t),
        (i = '<fonts count="' + this._fonts.length + '" x14ac:knownFonts="1">'),
        (i += n),
        (e += i += '</fonts>'),
        (a = '<fills count="' + this._fills.length + '">'),
        (a += h),
        (e += a += '</fills>'),
        (c = '<borders count="' + this._borders.length + '">'),
        (c += u),
        (e += c += '</borders>'),
        (e +=
          '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'),
        (f = '<cellXfs count="' + this._styles.length + '">'),
        (f += d),
        (f += '</cellXfs>');
      var C = '',
        x = '';
      return (
        this._tableStyles.length > 0 &&
          (this._getDxfs(),
          this._dxfs.length > 0 && (C = this._generateDxfs()),
          (x = this._generateTableStyles())),
        (e +=
          f +
          '<cellStyles count="1"><cellStyle xfId="0" builtinId="0" name="Normal"/></cellStyles>' +
          ('' === C ? '<dxfs count="0"/>' : C) +
          ('' === x
            ? '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16"/>'
            : x) +
          '<extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}"><x14ac:slicerStyles defaultSlicerStyle="SlicerStyleLight1" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"/></ext></extLst></styleSheet>')
      );
    }),
    (e._generateBorderStyle = function (e, t) {
      void 0 === t && (t = !1);
      var l,
        o,
        s,
        r = '<border>';
      for (var i in {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        diagonal: 0,
        vertical: 0,
        horizontal: 0,
      })
        (t || ('vertical' !== i && 'horizontal' !== i)) &&
          (e[i]
            ? ((l = '<' + i + ' style="' + e[i].style + '">'),
              (s = ''),
              (o = e[i].color),
              wjcCore.isString(o)
                ? (6 ===
                    (o = o ? ('#' === o[0] ? o.substring(1) : o) : '').length &&
                    (o = 'FF' + o),
                  o || (o = 'FF000000'),
                  (s = '<color rgb="' + o + '"/>'))
                : null != o &&
                  (s =
                    '<color tint="' + o.tint + '" theme="' + o.theme + '"/>'),
              (l += s),
              (l += '</' + i + '>'))
            : (l = '<' + i + '/>'),
          (r += l));
      return (r += '</border>');
    }),
    (e._generateFontStyle = function (e, t) {
      void 0 === t && (t = !1);
      var l = '<font>';
      return (
        e.bold && (l += '<b/>'),
        e.italic && (l += '<i/>'),
        e.underline && (l += '<u/>'),
        (l +=
          '<sz val="' +
          (e.size ? Math.round((72 * e.size) / 96) : this._defaultFontSize) +
          '"/>'),
        e.color
          ? wjcCore.isString(e.color)
            ? (l +=
                '<color rgb="FF' +
                ('#' === e.color[0] ? e.color.substring(1) : e.color) +
                '"/>')
            : (l +=
                '<color tint="' +
                e.color.tint +
                '" theme="' +
                e.color.theme +
                '"/>')
          : (l += '<color theme="1"/>'),
        (l += '<name val="' + (e.family || this._defaultFontName) + '"/>'),
        (l += '<family val="2"/>'),
        t && (l += '<scheme val="minor"/>'),
        (l += '</font>')
      );
    }),
    (e._generateFillStyle = function (e, t, l) {
      void 0 === l && (l = !1);
      var o,
        s = '<fill><patternFill patternType="' + e + '">';
      return (
        t &&
          ((o = l ? '<bgColor ' : '<fgColor '),
          wjcCore.isString(t)
            ? (o += 'rgb="FF' + ('#' === t[0] ? t.substring(1) : t) + '"/>')
            : (o += 'tint="' + t.tint + '" theme="' + t.theme + '"/>'),
          (s += o)),
        (s += '</patternFill></fill>')
      );
    }),
    (e._generateCellXfs = function (e, t, l, o, s) {
      var r = '<xf xfId="0" ';
      if (
        ((r += 'numFmtId="' + e.toString() + '" '),
        e > 0 && (r += 'applyNumberFormat="1" '),
        (r += 'borderId="' + t.toString() + '" '),
        t > 0 && (r += 'applyBorder="1" '),
        (r += 'fontId="' + l.toString() + '" '),
        l > 0 && (r += 'applyFont="1" '),
        (r += 'fillId="' + o.toString() + '" '),
        o > 0 && (r += 'applyFill="1" '),
        s.quotePrefix && (r += 'quotePrefix="1" '),
        s.hAlign || s.vAlign || s.indent || s.wordWrap)
      ) {
        r += 'applyAlignment="1">';
        var i = '<alignment ';
        s.hAlign && (i += 'horizontal="' + s.hAlign + '" '),
          s.vAlign && (i += 'vertical="' + s.vAlign + '" '),
          s.indent && (i += 'indent="' + s.indent + '" '),
          s.wordWrap && (i += 'wrapText="1"'),
          (r += i += '/>'),
          (r += '</xf>');
      } else r += '/>';
      return r;
    }),
    (e._generateContentTypesDoc = function () {
      var e,
        t =
          '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">';
      for (
        this._macroEnabled &&
          (t +=
            '<Default ContentType="application/vnd.ms-office.vbaProject" Extension="bin"/>'),
          t +=
            '<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/><Default ContentType="application/xml" Extension="xml"/><Override ContentType="' +
            (this._macroEnabled
              ? 'application/vnd.ms-excel.sheet.macroEnabled.main+xml'
              : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml') +
            '" PartName="/xl/workbook.xml"/>',
          e = 0;
        e < this._contentTypes.length;
        e++
      )
        t += this._contentTypes[e];
      for (
        t +=
          '<Override ContentType="application/vnd.openxmlformats-officedocument.theme+xml" PartName="/xl/theme/theme1.xml"/><Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" PartName="/xl/styles.xml"/><Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml" PartName="/xl/sharedStrings.xml"/><Override ContentType="application/vnd.openxmlformats-package.core-properties+xml" PartName="/docProps/core.xml"/><Override ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml" PartName="/docProps/app.xml"/>',
          e = 0;
        e < this._tables.length;
        e++
      )
        t +=
          '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml" PartName="/xl/tables/' +
          this._tables[e] +
          '"/>';
      return (t += '</Types>');
    }),
    (e._generateAppDoc = function (e) {
      for (
        var t =
            '<Properties xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes" xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>' +
            (e.application || 'wijmo.xlsx') +
            '</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector baseType="variant" size="2"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>' +
            this._props.length +
            '</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector baseType="lpstr" size="' +
            this._props.length +
            '">',
          l = 0;
        l < this._props.length;
        l++
      )
        t += '<vt:lpstr>' + this._props[l] + '</vt:lpstr>';
      return (t +=
        '</vt:vector></TitlesOfParts><Manager/><Company>' +
        (e.company || 'GrapeCity, Inc.') +
        '</Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>');
    }),
    (e._generateWorkbookRels = function () {
      for (
        var e = '<Relationships xmlns="' + this._relationshipsNS + '">', t = 0;
        t < this._xlRels.length;
        t++
      )
        e += this._xlRels[t];
      return (
        (e +=
          '<Relationship Target="sharedStrings.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Id="rId' +
          (this._xlRels.length + 1) +
          '"/><Relationship Target="styles.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Id="rId' +
          (this._xlRels.length + 2) +
          '"/><Relationship Target="theme/theme1.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Id="rId' +
          (this._xlRels.length + 3) +
          '"/>'),
        this._macroEnabled &&
          (e +=
            '<Relationship Target="vbaProject.bin" Type="http://schemas.microsoft.com/office/2006/relationships/vbaProject" Id="rId' +
            (this._xlRels.length + 4) +
            '"/>'),
        (e += '</Relationships>')
      );
    }),
    (e._generateWorkbook = function (e) {
      for (
        var t =
            '<workbook xmlns="' +
            this._workbookNS +
            '" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><fileVersion rupBuild="9303" lowestEdited="5" lastEdited="5" appName="xl"/><workbookPr defaultThemeVersion="124226"/><bookViews><workbookView xWindow="480" yWindow="60" windowWidth="18195" windowHeight="8505"' +
            (null != e.activeWorksheet
              ? ' activeTab="' + e.activeWorksheet.toString() + '"'
              : '') +
            '/></bookViews><sheets>',
          l = 0;
        l < this._worksheets.length;
        l++
      )
        t += this._worksheets[l];
      if (((t += '</sheets>'), e.definedNames && e.definedNames.length > 0)) {
        for (t += '<definedNames>', l = 0; l < e.definedNames.length; l++) {
          var o = -1;
          e.definedNames[l].sheetName &&
            (o = this._getSheetIndexBySheetName(
              e,
              e.definedNames[l].sheetName
            )),
            (t +=
              '<definedName name="' +
              e.definedNames[l].name +
              '" ' +
              (o > -1 ? 'localSheetId="' + o + '"' : '') +
              '>' +
              e.definedNames[l].value +
              '</definedName>');
        }
        t += '</definedNames>';
      }
      return (t += '<calcPr fullCalcOnLoad="1"/></workbook>');
    }),
    (e._generateWorkSheet = function (e, t, l) {
      var o,
        s,
        r,
        i,
        n,
        a,
        h,
        c,
        u,
        f,
        d,
        m,
        p,
        g,
        y,
        _,
        b,
        S,
        v,
        w,
        C,
        x,
        k,
        T = 1;
      if (
        ((o = e + 1),
        (s = t.sheets[e]),
        (r = s.columns),
        (i = this._cloneColumnsStyle(r)),
        !s)
      )
        throw 'Worksheet should not be empty!';
      var F =
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
      F += this._generateSheetGlobalSetting(e, s, t);
      var A = '<sheetData>';
      for (
        n = s.style ? this._cloneStyle(s.style) : null,
          '',
          [],
          h = [],
          c = -1,
          u = (a = s.rows) ? a.length : 0;
        ++c < u;

      ) {
        for (
          f = -1,
            d = a[c] && a[c].cells ? a[c].cells.length : 0,
            m = null,
            A += '<row x14ac:dyDescent="0.25" r="' + (c + 1).toString() + '"',
            a[c] &&
              (a[c].height &&
                (A +=
                  ' customHeight="1" ht="' +
                  ((72 * +a[c].height) / 96).toString() +
                  '"'),
              a[c].groupLevel &&
                (A += ' outlineLevel="' + a[c].groupLevel.toString() + '"'),
              (m = a[c].style ? this._cloneStyle(a[c].style) : null) &&
                ((m = this._resolveStyleInheritance(m)).font &&
                  m.font.color &&
                  (m.font.color = this._parseColor(m.font.color)),
                m.fill &&
                  m.fill.color &&
                  (m.fill.color = this._parseColor(m.fill.color)),
                null == m.hAlign ||
                  wjcCore.isString(m.hAlign) ||
                  (m.hAlign = Workbook._parseHAlignToString(
                    wjcCore.asEnum(m.hAlign, HAlign)
                  )),
                null == m.vAlign ||
                  wjcCore.isString(m.vAlign) ||
                  (m.vAlign = Workbook._parseVAlignToString(
                    wjcCore.asEnum(m.vAlign, VAlign)
                  )),
                (p = JSON.stringify(m)),
                (g = this._styles.indexOf(p)) < 0 &&
                  (g = this._styles.push(p) - 1),
                (A += ' customFormat="1" s="' + g.toString() + '"'))),
            a[c] && !1 === a[c].visible && (A += ' hidden="1"'),
            a[c] && !0 === a[c].collapsed && (A += ' collapsed="1"'),
            A += '>';
          ++f < d;

        )
          (_ = null),
            (b = null),
            (S = ''),
            (v = -1),
            (k = (y = a[c].cells[f]) ? y.textRuns : null),
            (_ = y && y.hasOwnProperty('value') ? y.value : y),
            (b = y && y.style ? this._cloneStyle(y.style) : {}),
            (b = this._resolveStyleInheritance(b)),
            (w = i[f]) &&
              ((w = this._resolveStyleInheritance(w)),
              (b = this._extend(b, w))),
            m && (b = this._extend(b, m)),
            n &&
              ((n = this._resolveStyleInheritance(n)),
              (b = this._extend(b, n))),
            null == b.hAlign ||
              wjcCore.isString(b.hAlign) ||
              (b.hAlign = Workbook._parseHAlignToString(
                wjcCore.asEnum(b.hAlign, HAlign)
              )),
            null == b.vAlign ||
              wjcCore.isString(b.vAlign) ||
              (b.vAlign = Workbook._parseVAlignToString(
                wjcCore.asEnum(b.vAlign, VAlign)
              )),
            b.font &&
              b.font.color &&
              (b.font.color = this._parseColor(b.font.color)),
            b.fill &&
              b.fill.color &&
              (b.fill.color = this._parseColor(b.fill.color)),
            this._applyDefaultBorder(b),
            b.borders &&
              ((b.borders = this._extend({}, b.borders)),
              this._parseBorder(b.borders, !!b.fill && !!b.fill.color)),
            !wjcCore.isNumber(_) ||
              (!isNaN(_) && isFinite(_)) ||
              (_ = _.toString()),
            k ||
            (_ &&
              wjcCore.isString(_) &&
              ('@' === b.format || (+_).toString() !== _ || !isFinite(+_)))
              ? (this._sharedStrings[1]++,
                "'" ===
                  (_ = k
                    ? '{RichTextMark}' + JSON.stringify(k)
                    : Workbook._unescapeXML(_))[0] &&
                  ((b.quotePrefix = !0), (_ = _.substring(1))),
                (v = this._sharedStrings[0].indexOf(_)) < 0 &&
                  (v = this._sharedStrings[0].push(_) - 1),
                (_ = v),
                (S = 's'))
              : 'boolean' == typeof _
              ? ((_ = _ ? 1 : 0), (S = 'b'))
              : 'date' === this._typeOf(_) || (y && y.isDate)
              ? ((_ = this._convertDate(_)),
                (b.format = b.format || 'mm-dd-yy'))
              : 'object' == typeof _ && (_ = null),
            (b = JSON.stringify(b)),
            (g = this._styles.indexOf(b)) < 0 && (g = this._styles.push(b) - 1),
            y &&
              ((null != y.colSpan && y.colSpan > 1) ||
                (null != y.rowSpan && y.rowSpan > 1)) &&
              ((y.colSpan = y.colSpan || 1),
              (y.rowSpan = y.rowSpan || 1),
              this._checkValidMergeCell(h, c, y.rowSpan, f, y.colSpan) &&
                h.push([
                  this._numAlpha(f) + (c + 1),
                  this._numAlpha(f + y.colSpan - 1) + (c + y.rowSpan),
                ])),
            y &&
              y.link &&
              (null == x && (x = []),
              x.push({
                ref: Workbook.xlsxAddress(c, f),
                value: _,
                href: y.link,
              })),
            (b = null),
            (A += this._generateCell(
              c,
              f,
              g,
              S,
              _,
              y && y.formula ? y.formula : null
            ));
        A += '</row>';
      }
      if (((A += '</sheetData>'), r && r.length > 0)) {
        for (F += '<cols>', c = 0; c < r.length; c++)
          if (((g = -1), !this._isEmpty(r[c]))) {
            (w = r[c].style) &&
              ((w = this._resolveStyleInheritance(w)).font &&
                w.font.color &&
                (w.font.color = this._parseColor(w.font.color)),
              w.fill &&
                w.fill.color &&
                (w.fill.color = this._parseColor(w.fill.color)),
              null == w.hAlign ||
                wjcCore.isString(w.hAlign) ||
                (w.hAlign = Workbook._parseHAlignToString(
                  wjcCore.asEnum(w.hAlign, HAlign)
                )),
              null == w.vAlign ||
                wjcCore.isString(w.vAlign) ||
                (w.vAlign = Workbook._parseVAlignToString(
                  wjcCore.asEnum(w.vAlign, VAlign)
                )),
              (w = JSON.stringify(w)),
              (g = this._styles.indexOf(w)) < 0 &&
                (g = this._styles.push(w) - 1)),
              (C =
                null != (C = r[c].width)
                  ? 'string' == typeof C && C.indexOf('ch') > -1
                    ? this._parseCharCountToCharWidth(
                        C.substring(0, C.indexOf('ch'))
                      )
                    : this._parsePixelToCharWidth(C)
                  : 8.43);
            var z = (c + 1).toString();
            (F += '<col min="' + z + '" max="' + z + '"'),
              g >= 0 && (F += ' style="' + g.toString() + '"'),
              C && (F += ' width="' + C + '" customWidth="1"'),
              !1 !== r[c].autoWidth && (F += ' bestFit="1"'),
              !1 === r[c].visible && (F += ' hidden="1"'),
              (F += '/>');
          }
        F += '</cols>';
      }
      if (
        ((A = F + A),
        (F = A),
        (A = null),
        h.length > 0 && (F += this._generateMergeSetting(h)),
        x && x.length > 0)
      ) {
        for (F += '<hyperlinks>', c = 0; c < x.length; c++)
          /\'?(\w+)\'?\!\$?[A-Za-z]{1,2}\$?\d+(:\$?[A-Za-z]{1,2}\$?\d+)?/.test(
            x[c].href
          ) ||
          /^\$?[A-Za-z]{1,2}\$?\d+(:\$?[A-Za-z]{1,2}\$?\d+)?$/.test(x[c].href)
            ? (F +=
                '<hyperlink ref="' +
                x[c].ref +
                '" display="' +
                x[c].value +
                '" location="' +
                x[c].href +
                '"/>')
            : (null == s.externalLinks && (s.externalLinks = []),
              s.externalLinks.push(x[c].href),
              (F += '<hyperlink ref="' + x[c].ref + '" r:id="rId' + T + '"/>'),
              T++);
        F += '</hyperlinks>';
      }
      if (
        ((F +=
          '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>'),
        s.tableNames && s.tableNames.length > 0)
      ) {
        for (
          F += '<tableParts count="' + s.tableNames.length + '">', c = 0;
          c < s.tableNames.length;
          c++
        )
          (F += '<tablePart r:id="rId' + T + '"/>'), T++;
        F += '</tableParts>';
      }
      (F += '</worksheet>'),
        l.file('sheet' + o + '.xml', this._xmlDescription + F),
        (F = null);
      var R =
        '<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet' +
        o +
        '.xml"/>';
      this._contentTypes.unshift(R),
        this._props.unshift(Workbook._escapeXML(s.name) || 'Sheet' + o);
      var W =
        '<Relationship Target="worksheets/sheet' +
        o +
        '.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Id="rId' +
        o +
        '"/>';
      this._xlRels.unshift(W);
      var N =
        '<sheet r:id="rId' +
        o +
        '" sheetId="' +
        o +
        '" name="' +
        (Workbook._escapeXML(s.name) || 'Sheet' + o) +
        '"' +
        (!1 === s.visible ? ' state="hidden"' : '') +
        '/>';
      this._worksheets.unshift(N);
    }),
    (e._generateSharedStringsDoc = function () {
      var e,
        t =
          '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' +
          this._sharedStrings[1] +
          '" uniqueCount="' +
          this._sharedStrings[0].length +
          '">';
      for (e = 0; e < this._sharedStrings[0].length; e++) {
        t += '<si>';
        var l = this._sharedStrings[0][e];
        if (l && 0 === l.indexOf('{RichTextMark}'))
          try {
            var o = JSON.parse(l.substring(14));
            if (o && o.length > 0) {
              for (var s = 0; s < o.length; s++) {
                t += '<r>';
                var r = o[s];
                r.font &&
                  (t += this._generateFontStyle(r.font, !0).replace(
                    /font/g,
                    'rPr'
                  )),
                  (t += this._generatePlainText(r.text)),
                  (t += '</r>');
              }
              t += '</si>';
            }
          } catch (e) {
            t += this._generatePlainText(l) + '</si>';
          }
        else t += this._generatePlainText(l) + '</si>';
      }
      return t + '</sst>';
    }),
    (e._generatePlainText = function (e) {
      var t = '<t';
      return (
        (wjcCore.isNullOrWhiteSpace(e) || /^\s+\w*|\w*\s+$/.test(e)) &&
          (t += ' xml:space="preserve"'),
        (t += '>' + Workbook._escapeXML(e) + '</t>')
      );
    }),
    (e._generateTable = function (e, t, l) {
      var o = e + 1,
        s = 'table' + o + '.xml';
      (t.fileName = s), this._tables.push(s);
      var r =
        '<table ref="' +
        t.ref +
        '" displayName="' +
        t.name +
        '" name="' +
        t.name +
        '" id="' +
        o +
        '" ' +
        (!1 === t.showHeaderRow ? 'headerRowCount="0" ' : '') +
        (!0 === t.showTotalRow
          ? 'totalsRowCount="1" '
          : 'totalsRowShown="0" ') +
        ' xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
      !1 !== t.showHeaderRow &&
        (r += this._generateTableFilterSetting(
          t.ref,
          t.showTotalRow,
          t.columns
        )),
        (r += '<tableColumns count="' + t.columns.length + '">');
      for (var i = '', n = 0; n < t.columns.length; n++) {
        var a = t.columns[n];
        (i += '<tableColumn name="' + a.name + '" id="' + (n + 1) + '" '),
          a.totalRowFunction
            ? this._tableColumnFunctions.indexOf(a.totalRowFunction) > -1
              ? (i += 'totalsRowFunction="' + a.totalRowFunction + '"/>')
              : (i +=
                  'totalsRowFunction="custom"><totalsRowFormula>' +
                  a.totalRowFunction +
                  '</totalsRowFormula></tableColumn>')
            : (i +=
                (a.totalRowLabel
                  ? 'totalsRowLabel="' + a.totalRowLabel + '"'
                  : '') + '/>');
      }
      if (
        ((r += i + '</tableColumns>'),
        (r +=
          '<tableStyleInfo name="' +
          t.style.name +
          '" showColumnStripes="' +
          (t.showBandedColumns ? '1' : '0') +
          '" showRowStripes="' +
          (t.showBandedRows ? '1' : '0') +
          '" showLastColumn="' +
          (t.showLastColumn ? '1' : '0') +
          '" showFirstColumn="' +
          (t.showFirstColumn ? '1' : '0') +
          '"/></table>'),
        !this._isBuiltInStyleName(t.style.name))
      ) {
        var h = JSON.stringify(t.style);
        -1 === this._tableStyles.indexOf(h) && this._tableStyles.push(h);
      }
      l.file(s, this._xmlDescription + r), (r = null);
    }),
    (e._generateTableFilterSetting = function (e, t, l) {
      var o = e;
      if (t) {
        var s = o.indexOf(':') + 1,
          r = Workbook.tableAddress(o.substring(o.indexOf(':') + 1));
        (r.row -= 1),
          (o = o.substring(0, s) + Workbook.xlsxAddress(r.row, r.col));
      }
      for (
        var i = '<autoFilter ref="' + o + '"', n = '', a = 0;
        a < l.length;
        a++
      )
        !1 === l[a].showFilterButton &&
          (n += '<filterColumn hiddenButton="1" colId="' + a + '"/>');
      return (i += '' === n ? '/>' : '>' + n + '</autoFilter>');
    }),
    (e._generateHyperlinkRel = function (e) {
      for (var t = '', l = 0; l < e.length; l++)
        t +=
          '<Relationship TargetMode="External" Target="' +
          e[l] +
          '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Id="rId' +
          (l + 1) +
          '"/>';
      return t;
    }),
    (e._generateTableRel = function (e, t, l) {
      for (var o = '', s = 0; s < t.length; s++) {
        var r = this._getTableFileName(e, t[s]);
        '' !== r &&
          (o +=
            '<Relationship Target="../tables/' +
            r +
            '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Id="rId' +
            (s + 1 + l) +
            '"/>');
      }
      return o;
    }),
    (e._getDxfs = function () {
      for (var e, t = this, l = 0; l < this._tableStyles.length; l++)
        (e = JSON.parse(this._tableStyles[l])),
          Object.keys(e).forEach(function (l) {
            var o,
              s,
              r = e[l];
            r &&
              !wjcCore.isString(r) &&
              (t._isEmptyStyleEle(r) ||
                ((o = JSON.stringify(r)),
                -1 === (s = t._dxfs.indexOf(o)) &&
                  ((s = t._dxfs.push(o) - 1), (r.styleIndex = s))));
          }),
          (this._tableStyles[l] = e);
    }),
    (e._generateDxfs = function () {
      for (
        var e, t = '<dxfs count="' + this._dxfs.length + '">', l = 0;
        l < this._dxfs.length;
        l++
      )
        (t += '<dxf>'),
          (e = JSON.parse(this._dxfs[l])).font &&
            (t += this._generateFontStyle(e.font)),
          e.fill &&
            e.fill.color &&
            (t += this._generateFillStyle('solid', e.fill.color, !0)),
          e.borders &&
            !this._isEmpty(e.borders) &&
            ((e.borders = this._extend({}, e.borders)),
            this._parseBorder(e.borders, !1),
            (t += this._generateBorderStyle(e.borders, !0))),
          (t += '</dxf>');
      return (t += '</dxfs>');
    }),
    (e._generateTableStyles = function () {
      for (
        var e,
          t,
          l,
          o,
          s,
          r,
          i =
            '<tableStyles count="' +
            this._tableStyles.length +
            '" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16">',
          n = 0;
        n < this._tableStyles.length;
        n++
      ) {
        (e = this._tableStyles[n]), (t = Object.keys(e)), (s = ''), (r = 0);
        for (var a = 0; a < t.length; a++)
          if (((l = t[a]), (o = e[l]), !wjcCore.isString(o))) {
            switch (
              (r++,
              (s += '<tableStyleElement'),
              null != o.styleIndex && (s += ' dxfId="' + o.styleIndex + '"'),
              l)
            ) {
              case 'firstBandedColumnStyle':
                (s += ' type="firstColumnStripe"'),
                  null != o.size && (s += ' size="' + o.size + '"');
                break;
              case 'secondBandedColumnStyle':
                (s += ' type="secondColumnStripe"'),
                  null != o.size && (s += ' size="' + o.size + '"');
                break;
              case 'firstBandedRowStyle':
                (s += ' type="firstRowStripe"'),
                  null != o.size && (s += ' size="' + o.size + '"');
                break;
              case 'secondBandedRowStyle':
                (s += ' type="secondRowStripe"'),
                  null != o.size && (s += ' size="' + o.size + '"');
                break;
              default:
                s += ' type="' + l.substring(0, l.length - 5) + '"';
            }
            s += '/>';
          }
        r > 0 &&
          ((i +=
            '<tableStyle count="' + r + '" name="' + e.name + '" pivot="0">'),
          (i += s + '</tableStyle>'));
      }
      return (i += '</tableStyles>');
    }),
    (e._isEmptyStyleEle = function (e) {
      return (
        this._isEmpty(e.borders) &&
        (this._isEmpty(e.fill) ||
          null == e.fill.color ||
          (wjcCore.isString(e.fill.color) &&
            wjcCore.isNullOrWhiteSpace(e.fill.color))) &&
        (this._isEmpty(e.font) ||
          (!0 !== e.font.bold &&
            (null == e.font.color ||
              (wjcCore.isString(e.font.color) &&
                wjcCore.isNullOrWhiteSpace(e.font.color))) &&
            wjcCore.isNullOrWhiteSpace(e.font.family) &&
            !0 !== e.font.italic &&
            null == e.font.size &&
            !0 !== e.font.underline))
      );
    }),
    (e._getTableFileName = function (e, t) {
      for (var l = '', o = 0; o < e.length; o++) {
        var s = e[o];
        if (s.name === t) {
          l = s.fileName;
          break;
        }
      }
      return l;
    }),
    (e._getColor = function (e, t) {
      var l, o, s, r, i;
      return (-1 === e.search(/fgcolor/i) &&
        -1 === e.search(/bgcolor/i) &&
        t) ||
        (-1 === e.search(/color/i) && !t)
        ? null
        : (-1 === (l = e.indexOf('<fgColor')) && (l = e.indexOf('<bgColor')),
          -1 !==
          (e = t
            ? e.substring(l, e.indexOf('/>'))
            : e.substring(e.indexOf('<color'))).indexOf('rgb=')
            ? (r = this._getAttr(e, 'rgb')) &&
              8 === r.length &&
              (r = r.substring(2))
            : -1 !== e.indexOf('indexed')
            ? ((s = +this._getAttr(e, 'indexed')),
              (r = this._indexedColors[s] || ''))
            : ((o = +this._getAttr(e, 'theme')),
              -1 !== e.indexOf('tint') && (i = +this._getAttr(e, 'tint')),
              (r = this._getThemeColor(o, i))),
          wjcCore.isString(r) ? (r && '#' === r[0] ? r : '#' + r) : r);
    }),
    (e._getThemeColor = function (e, t) {
      var l,
        o,
        s = this._colorThemes[e];
      return null != t
        ? ((l = new wjcCore.Color('#' + s)),
          (o = l.getHsl()),
          (o[2] = t < 0 ? o[2] * (1 + t) : o[2] * (1 - t) + (1 - 1 * (1 - t))),
          (l = wjcCore.Color.fromHsl(o[0], o[1], o[2])).toString().substring(1))
        : s;
    }),
    (e._parseColor = function (e) {
      var t = new wjcCore.Color(e);
      return t.a < 1 && (t = wjcCore.Color.toOpaque(t)), t.toString();
    }),
    (e._getsBaseSharedFormulas = function (e) {
      var t,
        l,
        o,
        s = e.match(/\<f[^<]*ref[^<]*>[^<]+(?=\<\/f>)/g);
      if (((this._sharedFormulas = []), s && s.length > 0))
        for (var r = 0; r < s.length; r++)
          (t = s[r]),
            (l = this._getAttr(t, 'si')),
            (o = (o = this._getAttr(t, 'ref'))
              ? o.substring(0, o.indexOf(':'))
              : ''),
            (t = t.replace(/(\<f.*>)(.+)/, '$2')),
            (this._sharedFormulas[+l] = this._parseSharedFormulaInfo(o, t));
    }),
    (e._parseSharedFormulaInfo = function (e, t) {
      var l,
        o,
        s,
        r,
        i,
        n = t.match(/(\'?\w+\'?\!)?(\$?[A-Za-z]+)(\$?\d+)/g);
      if (((r = Workbook.tableAddress(e)), n && n.length > 0)) {
        i = [];
        for (var a = 0; a < n.length; a++)
          (l = n[a]),
            (t = t.replace(l, '{' + a + '}')),
            (o = l.indexOf('!')) > 0 &&
              ((s = l.substring(0, o)), (l = l.substring(o + 1))),
            (i[a] = {
              cellAddress: Workbook.tableAddress(l),
              sheetRef: s,
            });
      }
      return { cellRef: r, formula: t, formulaRefs: i };
    }),
    (e._getSharedFormula = function (e, t) {
      var l, o, s, r, i, n, a, h, c, u, f, d;
      if (
        this._sharedFormulas &&
        this._sharedFormulas.length > 0 &&
        (l = this._sharedFormulas[+e])
      ) {
        if (((c = l.formula), (u = l.formulaRefs) && u.length > 0)) {
          (o = Workbook.tableAddress(t)),
            (a = l.cellRef ? l.cellRef.row : 0),
            (h = l.cellRef ? l.cellRef.col : 0),
            (s = o.row - a),
            (r = o.col - h);
          for (var m = 0; m < u.length; m++)
            (i = (f = u[m]).cellAddress.row + (f.cellAddress.absRow ? 0 : s)),
              (n = f.cellAddress.col + (f.cellAddress.absCol ? 0 : r)),
              (d = Workbook.xlsxAddress(
                i,
                n,
                f.cellAddress.absRow,
                f.cellAddress.absCol
              )),
              null != f.sheetRef &&
                '' !== f.sheetRef &&
                (d = f.sheetRef + '!' + d),
              (c = c.replace('{' + m + '}', d));
        }
        return c;
      }
      return '';
    }),
    (e._convertDate = function (e) {
      var t,
        l,
        o = new Date(1900, 0, 0),
        s = '[object Date]' === Object.prototype.toString.call(e),
        r =
          6e4 *
          ((s ? e.getTimezoneOffset() : new Date().getTimezoneOffset()) -
            o.getTimezoneOffset());
      return s
        ? (e.getTime() - o.getTime() - r) / 864e5 + 1
        : wjcCore.isNumber(e)
        ? ((t = e > 59 ? 1 : 0),
          (l = new Date(1e3 * Math.round((+o + 864e5 * (e - t)) / 1e3))),
          0 !== (r = 6e4 * (l.getTimezoneOffset() - o.getTimezoneOffset()))
            ? new Date(1e3 * Math.round((+o + r + 864e5 * (e - t)) / 1e3))
            : l)
        : null;
    }),
    (e._parseBorder = function (e, t) {
      for (var l in {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        diagonal: 0,
      }) {
        var o = e[l];
        o &&
          (wjcCore.isString(o.color) && (o.color = this._parseColor(o.color)),
          null == o.style ||
            wjcCore.isString(o.style) ||
            (o.style = Workbook._parseBorderTypeToString(
              wjcCore.asEnum(o.style, BorderStyle, !1)
            )),
          !t &&
            o.color &&
            '#c6c6c6' === o.color.toLowerCase() &&
            'thin' === o.style &&
            (e[l] = null));
      }
    }),
    (e._applyDefaultBorder = function (e) {
      if (e.fill && e.fill.color) {
        null == e.borders && (e.borders = {});
        for (var t in { left: 0, right: 0, top: 0, bottom: 0 })
          null == e.borders[t] &&
            (e.borders[t] = {
              style: BorderStyle.Thin,
              color: '#C6C6C6',
            });
      }
    }),
    (e._resolveStyleInheritance = function (e) {
      var t;
      if (!e.basedOn) return e;
      for (var l in e.basedOn)
        if ('basedOn' === l) {
          t = this._resolveStyleInheritance(e.basedOn);
          for (l in t) {
            o = t[l];
            e[l] = null == e[l] ? o : this._extend(e[l], o);
          }
        } else {
          var o = e.basedOn[l];
          e[l] = null == e[l] ? o : this._extend(e[l], o);
        }
      return delete e.basedOn, e;
    }),
    (e._parsePixelToCharWidth = function (e) {
      return null == e || isNaN(+e) ? null : (((+e - 5) / 7) * 100 + 0.5) / 100;
    }),
    (e._parseCharWidthToPixel = function (e) {
      return null == e || isNaN(+e) ? null : ((256 * +e + 128 / 7) / 256) * 7;
    }),
    (e._parseCharCountToCharWidth = function (e) {
      return null == e || isNaN(+e) ? null : (((7 * +e + 5) / 7) * 256) / 256;
    }),
    (e._numAlpha = function (e) {
      var t = Math.floor(e / 26) - 1;
      return (t > -1 ? this._numAlpha(t) : '') + this._alphabet.charAt(e % 26);
    }),
    (e._alphaNum = function (e) {
      var t = 0;
      return (
        2 === e.length && (t = this._alphaNum(e.charAt(0)) + 1),
        26 * t + this._alphabet.indexOf(e.substr(-1))
      );
    }),
    (e._typeOf = function (e) {
      return {}.toString
        .call(e)
        .match(/\s([a-zA-Z]+)/)[1]
        .toLowerCase();
    }),
    (e._extend = function (e, t) {
      if (wjcCore.isObject(e) && wjcCore.isObject(t)) {
        for (var l in t) {
          var o = t[l];
          wjcCore.isObject(o) && null != e[l]
            ? this._extend(e[l], o)
            : null != o && null == e[l] && (e[l] = o);
        }
        return e;
      }
      return t;
    }),
    (e._isEmpty = function (e) {
      var t = Object.prototype.hasOwnProperty;
      if (null == e) return !0;
      if (e.length > 0) return !1;
      if (0 === e.length) return !0;
      for (var l in e) if (t.call(e, l)) return !1;
      return !0;
    }),
    (e._cloneStyle = function (e) {
      var t;
      if (null == e || 'object' != typeof e) return e;
      t = {};
      for (var l in e) e.hasOwnProperty(l) && (t[l] = this._cloneStyle(e[l]));
      return t;
    }),
    (e._cloneColumnsStyle = function (e) {
      for (var t, l = [], o = 0; o < e.length; o++)
        (t = e[o]) && t.style && (l[o] = this._cloneStyle(t.style));
      return l;
    }),
    (e._getSheetIndex = function (e) {
      return (
        (e = e.substring(0, e.lastIndexOf('.xml'))),
        +e.substring(e.lastIndexOf('sheet') + 5)
      );
    }),
    (e._checkValidMergeCell = function (e, t, l, o, s) {
      for (var r = 0; r < e.length; r++) {
        var i = e[r],
          n = +i[0].match(/\d*/g).join('') - 1,
          a = this._alphaNum(i[0].match(/[a-zA-Z]*/g)[0]),
          h = +i[1].match(/\d*/g).join('') - 1,
          c = this._alphaNum(i[1].match(/[a-zA-Z]*/g)[0]);
        if (!(t > h || t + l - 1 < n || o > c || o + s - 1 < a)) return !1;
      }
      return !0;
    }),
    (e._getAttr = function (e, t) {
      var l = e.indexOf(t + '="');
      return l >= 0
        ? (e = e.substr(l + t.length + 2)).substring(0, e.indexOf('"'))
        : '';
    }),
    (e._getChildNodeValue = function (e, t) {
      var l = e.indexOf(t + ' val="');
      return l >= 0
        ? (e = e.substr(l + t.length + 6)).substring(0, e.indexOf('"'))
        : '';
    }),
    (e._getSheetIndexBySheetName = function (e, t) {
      for (var l = 0; l < e.sheets.length; l++)
        if (e.sheets[l].name === t) return l;
      return -1;
    }),
    (e._alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    (e._indexedColors = [
      '000000',
      'FFFFFF',
      'FF0000',
      '00FF00',
      '0000FF',
      'FFFF00',
      'FF00FF',
      '00FFFF',
      '000000',
      'FFFFFF',
      'FF0000',
      '00FF00',
      '0000FF',
      'FFFF00',
      'FF00FF',
      '00FFFF',
      '800000',
      '008000',
      '000080',
      '808000',
      '800080',
      '008080',
      'C0C0C0',
      '808080',
      '9999FF',
      '993366',
      'FFFFCC',
      'CCFFFF',
      '660066',
      'FF8080',
      '0066CC',
      'CCCCFF',
      '000080',
      'FF00FF',
      'FFFF00',
      '00FFFF',
      '800080',
      '800000',
      '008080',
      '0000FF',
      '00CCFF',
      'CCFFFF',
      'CCFFCC',
      'FFFF99',
      '99CCFF',
      'FF99CC',
      'CC99FF',
      'FFCC99',
      '3366FF',
      '33CCCC',
      '99CC00',
      'FFCC00',
      'FF9900',
      'FF6600',
      '666699',
      '969696',
      '003366',
      '339966',
      '003300',
      '333300',
      '993300',
      '993366',
      '333399',
      '333333',
      '000000',
      'FFFFFF',
    ]),
    (e._numFmts = [
      'General',
      '0',
      '0.00',
      '#,##0',
      '#,##0.00',
      ,
      ,
      '$#,##0.00_);($#,##0.00)',
      ,
      '0%',
      '0.00%',
      '0.00E+00',
      '# ?/?',
      '# ??/??',
      'm/d/yyyy',
      'd-mmm-yy',
      'd-mmm',
      'mmm-yy',
      'h:mm AM/PM',
      'h:mm:ss AM/PM',
      'h:mm',
      'h:mm:ss',
      'm/d/yy h:mm',
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      '#,##0 ;(#,##0)',
      '#,##0 ;[Red](#,##0)',
      '#,##0.00;(#,##0.00)',
      '#,##0.00;[Red](#,##0.00)',
      ,
      ,
      ,
      ,
      'mm:ss',
      '[h]:mm:ss',
      'mmss.0',
      '##0.0E+0',
      '@',
    ]),
    (e._tableColumnFunctions =
      'average, count, countNums, max, min, stdDev, sum, var'),
    (e._xmlDescription =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'),
    (e._workbookNS =
      'http://schemas.openxmlformats.org/spreadsheetml/2006/main'),
    (e._relationshipsNS =
      'http://schemas.openxmlformats.org/package/2006/relationships'),
    (e._defaultFontName = 'Calibri'),
    (e._defaultFontSize = 11),
    (e._macroEnabled = !1),
    (e._defaultColorThemes = [
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
    e
  );
})();
exports._xlsx = _xlsx;
var _Promise = (function () {
  function e() {
    this._callbacks = [];
  }
  return (
    (e.prototype.then = function (e, t) {
      return this._callbacks.push({ onFulfilled: e, onRejected: t }), this;
    }),
    (e.prototype.catch = function (e) {
      return this.then(null, e);
    }),
    (e.prototype.resolve = function (e) {
      var t = this;
      setTimeout(function () {
        try {
          t._onFulfilled(e);
        } catch (e) {
          t._onRejected(e);
        }
      }, 0);
    }),
    (e.prototype.reject = function (e) {
      var t = this;
      setTimeout(function () {
        t._onRejected(e);
      }, 0);
    }),
    (e.prototype._onFulfilled = function (e) {
      for (var t; (t = this._callbacks.shift()); )
        if (t.onFulfilled) {
          var l = t.onFulfilled(e);
          void 0 !== l && (e = l);
        }
    }),
    (e.prototype._onRejected = function (e) {
      for (var t; (t = this._callbacks.shift()); )
        if (t.onRejected) {
          var l = t.onRejected(e);
          return void this._onFulfilled(l);
        }
      throw e;
    }),
    e
  );
})();
exports._Promise = _Promise;
var _CompositedPromise = (function (e) {
  function t(t) {
    var l = e.call(this) || this;
    return (l._promises = t), l._init(), l;
  }
  return (
    __extends(t, e),
    (t.prototype._init = function () {
      var e = this;
      if (this._promises && this._promises.length) {
        var t = this._promises.length,
          l = 0,
          o = [],
          s = !1;
        this._promises.some(function (r) {
          return (
            r
              .then(function (r) {
                s || (o.push(r), ++l >= t && e.resolve(o));
              })
              .catch(function (t) {
                (s = !0), e.reject(t);
              }),
            s
          );
        });
      } else this.reject('No promises in current composited promise.');
    }),
    t
  );
})(_Promise);
exports._CompositedPromise = _CompositedPromise;
var Workbook = (function () {
  function e() {}
  return (
    Object.defineProperty(e.prototype, 'sheets', {
      get: function () {
        return null == this._sheets && (this._sheets = []), this._sheets;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'styles', {
      get: function () {
        return null == this._styles && (this._styles = []), this._styles;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'definedNames', {
      get: function () {
        return (
          null == this._definedNames && (this._definedNames = []),
          this._definedNames
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'tables', {
      get: function () {
        return null == this._tables && (this._tables = []), this._tables;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'colorThemes', {
      get: function () {
        return (
          null == this._colorThemes && (this._colorThemes = []),
          this._colorThemes
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'reservedContent', {
      get: function () {
        return (
          null == this._reservedContent && (this._reservedContent = {}),
          this._reservedContent
        );
      },
      set: function (e) {
        this._reservedContent = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.save = function (e) {
      var t = _xlsx.save(this);
      return e && this._saveToFile(t.base64, e), t.base64;
    }),
    (e.prototype.saveAsync = function (e, t, l) {
      var o = this;
      _xlsx.saveAsync(o, l).then(function (l) {
        e && o._saveToFile(l, e), t && t(l);
      });
    }),
    (e.prototype.load = function (e) {
      var t = _xlsx.load(this._getBase64String(e));
      this._deserialize(t), (t = null);
    }),
    (e.prototype.loadAsync = function (e, t, l) {
      var o = this;
      _xlsx
        .loadAsync(o._getBase64String(e))
        .then(function (e) {
          o._deserialize(e), (e = null), t(o);
        })
        .catch(l);
    }),
    (e.prototype._serialize = function () {
      var e = { sheets: [] };
      return (
        (e.sheets = this._serializeWorkSheets()),
        this._styles &&
          this._styles.length > 0 &&
          (e.styles = this._serializeWorkbookStyles()),
        this._reservedContent && (e.reservedContent = this._reservedContent),
        null != this.activeWorksheet &&
          !isNaN(this.activeWorksheet) &&
          this.activeWorksheet >= 0 &&
          (e.activeWorksheet = this.activeWorksheet),
        this.application && (e.application = this.application),
        this.company && (e.company = this.company),
        null != this.created && (e.created = this.created),
        this.creator && (e.creator = this.creator),
        this.lastModifiedBy && (e.lastModifiedBy = this.lastModifiedBy),
        null != this.modified && (e.modified = this.modified),
        this._definedNames &&
          this._definedNames.length > 0 &&
          (e.definedNames = this._serializeDefinedNames()),
        this._tables &&
          this._tables.length > 0 &&
          (e.tables = this._serializeTables()),
        this._colorThemes &&
          this._colorThemes.length > 0 &&
          (e.colorThemes = this._colorThemes.slice()),
        e
      );
    }),
    (e.prototype._deserialize = function (e) {
      this._deserializeWorkSheets(e.sheets),
        e.styles &&
          e.styles.length > 0 &&
          this._deserializeWorkbookStyles(e.styles),
        (this.activeWorksheet = e.activeWorksheet),
        (this.application = e.application),
        (this.company = e.company),
        (this.created = e.created),
        (this.creator = e.creator),
        (this.lastModifiedBy = e.lastModifiedBy),
        (this.modified = e.modified),
        (this.reservedContent = e.reservedContent),
        e.definedNames &&
          e.definedNames.length > 0 &&
          this._deserializeDefinedNames(e.definedNames),
        e.tables && e.tables.length > 0 && this._deserializeTables(e.tables),
        e.colorThemes &&
          e.colorThemes.length > 0 &&
          (this._colorThemes = e.colorThemes.slice());
    }),
    (e.prototype._addWorkSheet = function (e, t) {
      null == this._sheets && (this._sheets = []),
        null == t || isNaN(t) ? this._sheets.push(e) : (this._sheets[t] = e);
    }),
    (e.prototype._saveToFile = function (t, l) {
      var o,
        s,
        r,
        i,
        n,
        a,
        h = window.document,
        c =
          this._reservedContent && this._reservedContent.macros
            ? 'xlsm'
            : 'xlsx',
        u =
          'xlsm' === c
            ? 'application/vnd.ms-excel.sheet.macroEnabled.12'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if ((s = l.lastIndexOf('.')) < 0) l += '.' + c;
      else {
        if (0 === s) throw 'Invalid file name.';
        '' === (o = l.substring(s + 1))
          ? (l += '.' + c)
          : o !== c && (l += '.' + c);
      }
      (r = new Blob([e._base64DecToArr(t)], { type: u })),
        navigator.msSaveBlob
          ? navigator.msSaveBlob(r, l)
          : URL.createObjectURL
          ? ((n = h.createElement('a')),
            (a = function (e) {
              var t = h.createEvent('MouseEvents');
              t.initMouseEvent(
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
                e.dispatchEvent(t);
            }),
            (n.download = l),
            (n.href = URL.createObjectURL(r)),
            a(n),
            (n = null))
          : ((i = new FileReader()),
            (n = h.createElement('a')),
            (a = function (e) {
              var t = h.createEvent('MouseEvents');
              t.initMouseEvent(
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
                e.dispatchEvent(t);
            }),
            (i.onload = function () {
              (n.download = l), (n.href = i.result), a(n), (n = null);
            }),
            i.readAsDataURL(r));
    }),
    (e.prototype._getBase64String = function (e) {
      var t;
      if (null == e || 0 === e.length) throw 'Invalid xlsx file content.';
      return -1 !== (t = e.search(/base64,/i)) && (e = e.substring(t + 7)), e;
    }),
    (e.toXlsxDateFormat = function (e) {
      var t;
      if (1 === e.length)
        switch (e) {
          case 'r':
          case 'R':
            return 'ddd, dd MMM yyyy HH:mm:ss &quot;GMT&quot;';
          case 'u':
            return 'yyyy-MM-dd&quot;T&quot;HH:mm:ss&quot;Z&quot;';
          case 'o':
          case 'O':
            t = (t = wjcCore.culture.Globalize.calendar.patterns[e]).replace(
              /f+k/gi,
              '000'
            );
            break;
          default:
            t = wjcCore.culture.Globalize.calendar.patterns[e];
        }
      return (
        t || (t = e),
        (t = t
          .replace(/"/g, '')
          .replace(/tt/, 'AM/PM')
          .replace(/t/, 'A/P')
          .replace(/M+/gi, function (e) {
            return e.toLowerCase();
          })
          .replace(/g+y+/gi, function (e) {
            return e.substring(0, e.indexOf('y')) + 'e';
          })),
        /FY|Q/i.test(t) ? 'General' : t
      );
    }),
    (e.toXlsxNumberFormat = function (e) {
      var t,
        l,
        o,
        s,
        r,
        i,
        n = -1,
        a = e ? e.toLowerCase() : '',
        h = [];
      if (
        (/^[ncpfdg]\d*,*$/.test(a) && ((t = a[0]), (l = this._formatMap[t])), l)
      ) {
        if (
          ((o = wjcCore.culture.Globalize.numberFormat.currency.symbol),
          (s = a.split(',')),
          'c' === t && (l = l.replace(/\{1\}/g, o)),
          a.length > 1 ? (n = parseInt(s[0].substr(1))) : 'd' !== t && (n = 2),
          !isNaN(n))
        )
          for (i = 0; i < n; i++) h.push(0);
        for (i = 0; i < s.length - 1; i++) h.push(',');
        r =
          h.length > 0
            ? 'd' === t
              ? l.replace(/\{0\}/g, h.join(''))
              : l.replace(
                  /\{0\}/g,
                  (!isNaN(n) && n > 0 ? '.' : '') + h.join('')
                )
            : 'd' === t
            ? l.replace(/\{0\}/g, '0')
            : l.replace(/\{0\}/g, '');
      } else r = a;
      return r;
    }),
    (e.fromXlsxFormat = function (e) {
      var t,
        l,
        o,
        s,
        r,
        i,
        n,
        a,
        h,
        c = [],
        u = wjcCore.culture.Globalize.numberFormat.currency.symbol;
      if (!e || 'General' === e) return [''];
      for (
        l = (e = e.replace(/;@/g, '').replace(/&quot;?/g, '')).split(';'),
          s = 0;
        s < l.length;
        s++
      ) {
        if (((o = l[s]), /[hsmy\:]/i.test(o)))
          t = o
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
        else if (
          ((i = o.lastIndexOf('.')),
          (n = o.lastIndexOf('0')),
          (a = o.lastIndexOf(',')),
          (t =
            o.search(/\[\$([^\-\]]+)[^\]]*\]/) > -1 ||
            (o.indexOf(u) > -1 && -1 === o.search(/\[\$([\-\]]+)[^\]]*\]/))
              ? 'c'
              : '%' === o[e.length - 1]
              ? 'p'
              : 'n'),
          (t += i > -1 && i < n ? o.substring(i, n).length : '0'),
          /^0+,*$/.test(o) && (t = 'd' + ((n = o.lastIndexOf('0')) + 1)),
          a > -1 && n > -1 && n < a)
        )
          for (
            h = o.substring(n + 1, a + 1).split(''), r = 0;
            r < h.length;
            r++
          )
            t += ',';
        c.push(t);
      }
      return c;
    }),
    (e._parseCellFormat = function (e, t) {
      return t ? this.toXlsxDateFormat(e) : this.toXlsxNumberFormat(e);
    }),
    (e._parseExcelFormat = function (e) {
      if (
        void 0 !== e &&
        null !== e &&
        void 0 !== e.value &&
        null !== e.value &&
        !isNaN(e.value)
      ) {
        var t = e.style && e.style.format ? e.style.format : '';
        return e.isDate || wjcCore.isDate(e.value)
          ? this.fromXlsxFormat(t)[0]
          : !wjcCore.isNumber(e.value) || (t && 'General' !== t)
          ? wjcCore.isNumber(e.value) || '' === e.value
            ? this.fromXlsxFormat(t)[0]
            : t
          : wjcCore.isInt(e.value)
          ? 'd'
          : 'f2';
      }
    }),
    (e.xlsxAddress = function (e, t, l, o) {
      var s = l ? '$' : '',
        r = null == o ? s : o ? '$' : '';
      return (
        (isNaN(t) ? '' : r + this._numAlpha(t)) +
        (isNaN(e) ? '' : s + (e + 1).toString())
      );
    }),
    (e.tableAddress = function (e) {
      var t = /^((\$?)([A-Za-z]+))?((\$?)(\d+))?$/,
        l = e && t.exec(e),
        o = {};
      return l
        ? (l[3] && ((o.col = this._alphaNum(l[3])), (o.absCol = !!l[2])),
          l[6] && ((o.row = +l[6] - 1), (o.absRow = !!l[5])),
          o)
        : null;
    }),
    (e._parseHAlignToString = function (e) {
      switch (e) {
        case HAlign.Left:
          return 'left';
        case HAlign.Center:
          return 'center';
        case HAlign.Right:
          return 'right';
        default:
          return null;
      }
    }),
    (e._parseStringToHAlign = function (e) {
      var t = e ? e.toLowerCase() : '';
      return 'left' === t
        ? HAlign.Left
        : 'center' === t
        ? HAlign.Center
        : 'right' === t
        ? HAlign.Right
        : null;
    }),
    (e._parseVAlignToString = function (e) {
      switch (e) {
        case VAlign.Bottom:
          return 'bottom';
        case VAlign.Center:
          return 'center';
        case VAlign.Top:
          return 'top';
        default:
          return null;
      }
    }),
    (e._parseStringToVAlign = function (e) {
      var t = e ? e.toLowerCase() : '';
      return 'top' === t
        ? VAlign.Top
        : 'center' === t
        ? VAlign.Center
        : 'bottom' === t
        ? VAlign.Bottom
        : null;
    }),
    (e._parseBorderTypeToString = function (e) {
      switch (e) {
        case BorderStyle.Dashed:
          return 'dashed';
        case BorderStyle.Dotted:
          return 'dotted';
        case BorderStyle.Double:
          return 'double';
        case BorderStyle.Hair:
          return 'hair';
        case BorderStyle.Medium:
          return 'medium';
        case BorderStyle.MediumDashDotDotted:
          return 'mediumDashDotDot';
        case BorderStyle.MediumDashDotted:
          return 'mediumDashDot';
        case BorderStyle.MediumDashed:
          return 'mediumDashed';
        case BorderStyle.SlantedMediumDashDotted:
          return 'slantDashDot';
        case BorderStyle.Thick:
          return 'thick';
        case BorderStyle.Thin:
          return 'thin';
        case BorderStyle.ThinDashDotDotted:
          return 'dashDotDot';
        case BorderStyle.ThinDashDotted:
          return 'dashDot';
        case BorderStyle.None:
        default:
          return 'none';
      }
    }),
    (e._parseStringToBorderType = function (e) {
      return 'dashed' === e
        ? BorderStyle.Dashed
        : 'dotted' === e
        ? BorderStyle.Dotted
        : 'double' === e
        ? BorderStyle.Double
        : 'hair' === e
        ? BorderStyle.Hair
        : 'medium' === e
        ? BorderStyle.Medium
        : 'mediumDashDotDot' === e
        ? BorderStyle.MediumDashDotDotted
        : 'mediumDashDot' === e
        ? BorderStyle.MediumDashDotted
        : 'mediumDashed' === e
        ? BorderStyle.MediumDashed
        : 'slantDashDot' === e
        ? BorderStyle.SlantedMediumDashDotted
        : 'thick' === e
        ? BorderStyle.Thick
        : 'thin' === e
        ? BorderStyle.Thin
        : 'dashDotDot' === e
        ? BorderStyle.ThinDashDotDotted
        : 'dashDot' === e
        ? BorderStyle.ThinDashDotted
        : null;
    }),
    (e._escapeXML = function (e) {
      return 'string' == typeof e
        ? e
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
        : '';
    }),
    (e._unescapeXML = function (e) {
      return 'string' == typeof e
        ? e
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, '/')
        : '';
    }),
    (e._numAlpha = function (e) {
      var t = Math.floor(e / 26) - 1;
      return (t > -1 ? this._numAlpha(t) : '') + this._alphabet.charAt(e % 26);
    }),
    (e._alphaNum = function (e) {
      var t = 0;
      return (
        e && (e = e.toUpperCase()),
        2 === e.length && (t = this._alphaNum(e.charAt(0)) + 1),
        26 * t + this._alphabet.indexOf(e.substr(-1))
      );
    }),
    (e._b64ToUint6 = function (e) {
      return e > 64 && e < 91
        ? e - 65
        : e > 96 && e < 123
        ? e - 71
        : e > 47 && e < 58
        ? e + 4
        : 43 === e
        ? 62
        : 47 === e
        ? 63
        : 0;
    }),
    (e._base64DecToArr = function (e, t) {
      for (
        var l,
          o,
          s = e.replace(/[^A-Za-z0-9\+\/]/g, ''),
          r = s.length,
          i = t ? Math.ceil(((3 * r + 1) >> 2) / t) * t : (3 * r + 1) >> 2,
          n = new Uint8Array(i),
          a = 0,
          h = 0,
          c = 0;
        c < r;
        c++
      )
        if (
          ((o = 3 & c),
          (a |= this._b64ToUint6(s.charCodeAt(c)) << (18 - 6 * o)),
          3 === o || r - c == 1)
        ) {
          for (l = 0; l < 3 && h < i; l++, h++)
            n[h] = (a >>> ((16 >>> l) & 24)) & 255;
          a = 0;
        }
      return n;
    }),
    (e._uint6ToB64 = function (e) {
      return e < 26
        ? e + 65
        : e < 52
        ? e + 71
        : e < 62
        ? e - 4
        : 62 === e
        ? 43
        : 63 === e
        ? 47
        : 65;
    }),
    (e._base64EncArr = function (e) {
      for (var t = 2, l = '', o = e.length, s = 0, r = 0; r < o; r++)
        (t = r % 3),
          r > 0 && ((4 * r) / 3) % 76 == 0 && (l += '\r\n'),
          (s |= e[r] << ((16 >>> t) & 24)),
          (2 !== t && e.length - r != 1) ||
            ((l += String.fromCharCode(
              this._uint6ToB64((s >>> 18) & 63),
              this._uint6ToB64((s >>> 12) & 63),
              this._uint6ToB64((s >>> 6) & 63),
              this._uint6ToB64(63 & s)
            )),
            (s = 0));
      return (
        l.substr(0, l.length - 2 + t) + (2 === t ? '' : 1 === t ? '=' : '==')
      );
    }),
    (e.prototype._serializeWorkSheets = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this._sheets.length; t++)
        (e = this._sheets[t]) && (l[t] = e._serialize());
      return l;
    }),
    (e.prototype._serializeWorkbookStyles = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this._styles.length; t++)
        (e = this._styles[t]) && (l[t] = e._serialize());
      return l;
    }),
    (e.prototype._serializeDefinedNames = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this._definedNames.length; t++)
        (e = this._definedNames[t]) && (l[t] = e._serialize());
      return l;
    }),
    (e.prototype._serializeTables = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this._tables.length; t++)
        (e = this._tables[t]) && (l[t] = e._serialize());
      return l;
    }),
    (e.prototype._serializeTableStyles = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this._tableStyles.length; t++)
        (e = this._tableStyles[t]) && (l[t] = e._serialize());
      return l;
    }),
    (e.prototype._deserializeWorkSheets = function (e) {
      var t, l, o;
      for (
        this._sheets = [],
          wjcCore.assert(null != e, 'workSheets should not be null.'),
          o = 0;
        o < e.length;
        o++
      )
        (l = e[o]) &&
          ((t = new WorkSheet())._deserialize(l), (this._sheets[o] = t));
    }),
    (e.prototype._deserializeWorkbookStyles = function (e) {
      var t, l, o;
      for (this._styles = [], o = 0; o < e.length; o++)
        (l = e[o]) &&
          ((t = new WorkbookStyle())._deserialize(l), (this._styles[o] = t));
    }),
    (e.prototype._deserializeDefinedNames = function (e) {
      var t, l, o;
      for (this._definedNames = [], o = 0; o < e.length; o++)
        (l = e[o]) &&
          ((t = new DefinedName())._deserialize(l),
          (this._definedNames[o] = t));
    }),
    (e.prototype._deserializeTables = function (e) {
      var t, l, o;
      for (this._tables = [], o = 0; o < e.length; o++)
        (l = e[o]) &&
          ((t = new WorkbookTable())._deserialize(l), (this._tables[o] = t));
    }),
    (e.prototype._deserializeTableStyles = function (e) {
      var t, l, o;
      for (this._tableStyles = [], o = 0; o < e.length; o++)
        (l = e[o]) &&
          ((t = new WorkbookTableStyle())._deserialize(l),
          (this._tableStyles[o] = t));
    }),
    (e._alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
    (e._formatMap = {
      n: '#,##0{0}',
      c: '{1}#,##0{0}_);({1}#,##0{0})',
      p: '#,##0{0}%',
      f: '0{0}',
      d: '{0}',
      g: '0{0}',
    }),
    e
  );
})();
exports.Workbook = Workbook;
var WorkSheet = (function () {
  function e() {}
  return (
    Object.defineProperty(e.prototype, 'columns', {
      get: function () {
        return null == this._columns && (this._columns = []), this._columns;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'rows', {
      get: function () {
        return null == this._rows && (this._rows = []), this._rows;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'tableNames', {
      get: function () {
        return (
          null == this._tableNames && (this._tableNames = []), this._tableNames
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._serialize = function () {
      var e;
      return this._checkEmptyWorkSheet()
        ? null
        : ((e = {}),
          this.style && (e.style = this.style._serialize()),
          this._columns &&
            this._columns.length > 0 &&
            (e.columns = this._serializeWorkbookColumns()),
          this._rows &&
            this._rows.length > 0 &&
            (e.rows = this._serializeWorkbookRows()),
          this.frozenPane && (e.frozenPane = this.frozenPane._serialize()),
          this.name && (e.name = this.name),
          null != this.summaryBelow && (e.summaryBelow = this.summaryBelow),
          null != this.visible && (e.visible = this.visible),
          null != this._tableNames &&
            this._tableNames.length > 0 &&
            (e.tableNames = this._tableNames.slice()),
          e);
    }),
    (e.prototype._deserialize = function (e) {
      var t, l;
      e.style &&
        ((l = new WorkbookStyle())._deserialize(e.style), (this.style = l)),
        e.columns &&
          e.columns.length > 0 &&
          this._deserializeWorkbookColumns(e.columns),
        e.rows && e.rows.length > 0 && this._deserializeWorkbookRows(e.rows),
        e.frozenPane &&
          ((t = new WorkbookFrozenPane())._deserialize(e.frozenPane),
          (this.frozenPane = t)),
        (this.name = e.name),
        (this.summaryBelow = e.summaryBelow),
        (this.visible = e.visible),
        e.tableNames &&
          e.tableNames.length > 0 &&
          (this._tableNames = e.tableNames.slice());
    }),
    (e.prototype._addWorkbookColumn = function (e, t) {
      null == this._columns && (this._columns = []),
        null == t || isNaN(t) ? this._columns.push(e) : (this._columns[t] = e);
    }),
    (e.prototype._addWorkbookRow = function (e, t) {
      null == this._rows && (this._rows = []),
        null == t || isNaN(t) ? this._rows.push(e) : (this._rows[t] = e);
    }),
    (e.prototype._serializeWorkbookColumns = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this._columns.length; t++)
        (e = this._columns[t]) && (l[t] = e._serialize());
      return l;
    }),
    (e.prototype._serializeWorkbookRows = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this._rows.length; t++)
        (e = this._rows[t]) && (l[t] = e._serialize());
      return l;
    }),
    (e.prototype._deserializeWorkbookColumns = function (e) {
      var t, l, o;
      for (this._columns = [], o = 0; o < e.length; o++)
        (t = e[o]) &&
          ((l = new WorkbookColumn())._deserialize(t), (this._columns[o] = l));
    }),
    (e.prototype._deserializeWorkbookRows = function (e) {
      var t, l, o;
      for (this._rows = [], o = 0; o < e.length; o++)
        (t = e[o]) &&
          ((l = new WorkbookRow())._deserialize(t), (this._rows[o] = l));
    }),
    (e.prototype._checkEmptyWorkSheet = function () {
      return !(
        null != this._rows ||
        null != this._columns ||
        null != this.visible ||
        null != this.summaryBelow ||
        null != this.frozenPane ||
        null != this.style ||
        (null != this.name && '' !== this.name) ||
        (null != this._tableNames && 0 != this._tableNames.length)
      );
    }),
    e
  );
})();
exports.WorkSheet = WorkSheet;
var WorkbookColumn = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      var e;
      return this._checkEmptyWorkbookColumn()
        ? null
        : ((e = {}),
          this.style && (e.style = this.style._serialize()),
          null != this.autoWidth && (e.autoWidth = this.autoWidth),
          null != this.width && (e.width = this.width),
          null != this.visible && (e.visible = this.visible),
          e);
    }),
    (e.prototype._deserialize = function (e) {
      var t;
      e.style &&
        ((t = new WorkbookStyle())._deserialize(e.style), (this.style = t)),
        (this.autoWidth = e.autoWidth),
        (this.visible = e.visible),
        (this.width = e.width);
    }),
    (e.prototype._checkEmptyWorkbookColumn = function () {
      return (
        null == this.style &&
        null == this.width &&
        null == this.autoWidth &&
        null == this.visible
      );
    }),
    e
  );
})();
exports.WorkbookColumn = WorkbookColumn;
var WorkbookRow = (function () {
  function e() {}
  return (
    Object.defineProperty(e.prototype, 'cells', {
      get: function () {
        return null == this._cells && (this._cells = []), this._cells;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._serialize = function () {
      var e;
      return this._checkEmptyWorkbookRow()
        ? null
        : ((e = {}),
          this._cells &&
            this._cells.length > 0 &&
            (e.cells = this._serializeWorkbookCells()),
          this.style && (e.style = this.style._serialize()),
          null != this.collapsed && (e.collapsed = this.collapsed),
          null == this.groupLevel ||
            isNaN(this.groupLevel) ||
            (e.groupLevel = this.groupLevel),
          null == this.height || isNaN(this.height) || (e.height = this.height),
          null != this.visible && (e.visible = this.visible),
          e);
    }),
    (e.prototype._deserialize = function (e) {
      var t;
      e.cells && e.cells.length > 0 && this._deserializeWorkbookCells(e.cells),
        e.style &&
          ((t = new WorkbookStyle())._deserialize(e.style), (this.style = t)),
        (this.collapsed = e.collapsed),
        (this.groupLevel = e.groupLevel),
        (this.height = e.height),
        (this.visible = e.visible);
    }),
    (e.prototype._addWorkbookCell = function (e, t) {
      null == this._cells && (this._cells = []),
        null == t || isNaN(t) ? this._cells.push(e) : (this._cells[t] = e);
    }),
    (e.prototype._serializeWorkbookCells = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this._cells.length; t++)
        (e = this._cells[t]) && (l[t] = e._serialize());
      return l;
    }),
    (e.prototype._deserializeWorkbookCells = function (e) {
      var t, l, o;
      for (this._cells = [], o = 0; o < e.length; o++)
        (t = e[o]) &&
          ((l = new WorkbookCell())._deserialize(t), (this._cells[o] = l));
    }),
    (e.prototype._checkEmptyWorkbookRow = function () {
      return (
        null == this._cells &&
        null == this.style &&
        null == this.collapsed &&
        null == this.visible &&
        (null == this.height || isNaN(this.height)) &&
        (null == this.groupLevel || isNaN(this.groupLevel))
      );
    }),
    e
  );
})();
exports.WorkbookRow = WorkbookRow;
var WorkbookCell = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      var e;
      return this._checkEmptyWorkbookCell()
        ? null
        : ((e = {}),
          this.style && (e.style = this.style._serialize()),
          null != this.value && (e.value = this.value),
          this.formula && (e.formula = this.formula),
          null != this.isDate && (e.isDate = this.isDate),
          null != this.colSpan &&
            !isNaN(this.colSpan) &&
            this.colSpan > 1 &&
            (e.colSpan = this.colSpan),
          null != this.rowSpan &&
            !isNaN(this.rowSpan) &&
            this.rowSpan > 1 &&
            (e.rowSpan = this.rowSpan),
          this.link && (e.link = this.link),
          this.textRuns &&
            this.textRuns.length > 0 &&
            (e.textRuns = this._serializeTextRuns()),
          e);
    }),
    (e.prototype._deserialize = function (e) {
      var t;
      e.style &&
        ((t = new WorkbookStyle())._deserialize(e.style), (this.style = t)),
        (this.value = e.value),
        (this.formula = e.formula),
        (this.isDate = e.isDate),
        (this.colSpan = e.colSpan),
        (this.rowSpan = e.rowSpan),
        (this.link = e.link),
        e.textRuns &&
          e.textRuns.length > 0 &&
          this._deserializeTextRuns(e.textRuns);
    }),
    (e.prototype._serializeTextRuns = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this.textRuns.length; t++)
        (e = this.textRuns[t]), l.push(e._serialize());
      return l;
    }),
    (e.prototype._deserializeTextRuns = function (e) {
      var t, l, o;
      for (this.textRuns = [], o = 0; o < e.length; o++)
        (l = new WorkbookTextRun()),
          (t = e[o]),
          l._deserialize(t),
          this.textRuns.push(l);
    }),
    (e.prototype._checkEmptyWorkbookCell = function () {
      return (
        null == this.style &&
        null == this.value &&
        null == this.isDate &&
        (null == this.formula || '' === this.formula) &&
        (null == this.colSpan || isNaN(this.colSpan) || this.colSpan <= 1) &&
        (null == this.rowSpan || isNaN(this.rowSpan) || this.rowSpan <= 1) &&
        (null == this.link || '' === this.link)
      );
    }),
    e
  );
})();
exports.WorkbookCell = WorkbookCell;
var WorkbookFrozenPane = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      return (null != this.columns &&
        !isNaN(this.columns) &&
        0 !== this.columns) ||
        (null != this.rows && !isNaN(this.rows) && 0 !== this.rows)
        ? { columns: this.columns, rows: this.rows }
        : null;
    }),
    (e.prototype._deserialize = function (e) {
      (this.columns = e.columns), (this.rows = e.rows);
    }),
    e
  );
})();
exports.WorkbookFrozenPane = WorkbookFrozenPane;
var WorkbookStyle = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      var e;
      return this._checkEmptyWorkbookStyle()
        ? null
        : ((e = {}),
          this.basedOn && (e.basedOn = this.basedOn._serialize()),
          this.fill && (e.fill = this.fill._serialize()),
          this.font && (e.font = this.font._serialize()),
          this.borders && (e.borders = this.borders._serialize()),
          this.format && (e.format = this.format),
          null != this.hAlign &&
            (e.hAlign = wjcCore.asEnum(this.hAlign, HAlign, !1)),
          null != this.vAlign &&
            (e.vAlign = wjcCore.asEnum(this.vAlign, VAlign, !1)),
          null == this.indent || isNaN(this.indent) || (e.indent = this.indent),
          this.wordWrap && (e.wordWrap = this.wordWrap),
          e);
    }),
    (e.prototype._deserialize = function (t) {
      var l, o, s, r;
      t.basedOn && ((l = new e())._deserialize(t.basedOn), (this.basedOn = l)),
        t.fill &&
          ((o = new WorkbookFill())._deserialize(t.fill), (this.fill = o)),
        t.font &&
          ((s = new WorkbookFont())._deserialize(t.font), (this.font = s)),
        t.borders &&
          ((r = new WorkbookBorder())._deserialize(t.borders),
          (this.borders = r)),
        (this.format = t.format),
        null != t.hAlign &&
          (this.hAlign = wjcCore.asEnum(t.hAlign, HAlign, !1)),
        null != t.vAlign &&
          (this.vAlign = wjcCore.asEnum(t.vAlign, VAlign, !1)),
        null == t.indent || isNaN(t.indent) || (this.indent = t.indent),
        t.wordWrap && (this.wordWrap = t.wordWrap);
    }),
    (e.prototype._checkEmptyWorkbookStyle = function () {
      return (
        null == this.basedOn &&
        null == this.fill &&
        null == this.font &&
        null == this.borders &&
        (null == this.format || '' === this.format) &&
        null == this.hAlign &&
        null == this.vAlign &&
        null == this.wordWrap
      );
    }),
    e
  );
})();
exports.WorkbookStyle = WorkbookStyle;
var WorkbookFont = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      var e;
      return this._checkEmptyWorkbookFont()
        ? null
        : ((e = {}),
          null != this.bold && (e.bold = this.bold),
          null != this.italic && (e.italic = this.italic),
          null != this.underline && (e.underline = this.underline),
          this.color &&
            (wjcCore.isString(this.color)
              ? (e.color = this.color)
              : (e.color = {
                  theme: this.color.theme,
                  tint: this.color.tint,
                })),
          this.family && (e.family = this.family),
          null == this.size || isNaN(this.size) || (e.size = this.size),
          e);
    }),
    (e.prototype._deserialize = function (e) {
      (this.bold = e.bold),
        null != e.color &&
          (wjcCore.isString(e.color)
            ? (this.color = e.color)
            : (this.color = {
                theme: e.color.theme,
                tint: e.color.tint,
              })),
        (this.family = e.family),
        (this.italic = e.italic),
        (this.size = e.size),
        (this.underline = e.underline);
    }),
    (e.prototype._checkEmptyWorkbookFont = function () {
      return (
        null == this.bold &&
        null == this.italic &&
        null == this.underline &&
        (null == this.color || '' === this.color) &&
        (null == this.family || '' === this.family) &&
        (null == this.size || isNaN(this.size))
      );
    }),
    e
  );
})();
exports.WorkbookFont = WorkbookFont;
var WorkbookFill = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      return this.color
        ? wjcCore.isString(this.color)
          ? { color: this.color }
          : {
              color: {
                theme: this.color.theme,
                tint: this.color.tint,
              },
            }
        : null;
    }),
    (e.prototype._deserialize = function (e) {
      null != e.color &&
        (wjcCore.isString(e.color)
          ? (this.color = e.color)
          : (this.color = {
              theme: e.color.theme,
              tint: e.color.tint,
            }));
    }),
    e
  );
})();
exports.WorkbookFill = WorkbookFill;
var WorkbookBorder = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      var e;
      return this._checkEmptyWorkbookBorder()
        ? null
        : ((e = {}),
          this.top && (e.top = this.top._serialize()),
          this.bottom && (e.bottom = this.bottom._serialize()),
          this.left && (e.left = this.left._serialize()),
          this.right && (e.right = this.right._serialize()),
          this.diagonal && (e.diagonal = this.diagonal._serialize()),
          e);
    }),
    (e.prototype._deserialize = function (e) {
      var t, l, o, s, r;
      e.top &&
        ((t = new WorkbookBorderSetting())._deserialize(e.top), (this.top = t)),
        e.bottom &&
          ((l = new WorkbookBorderSetting())._deserialize(e.bottom),
          (this.bottom = l)),
        e.left &&
          ((o = new WorkbookBorderSetting())._deserialize(e.left),
          (this.left = o)),
        e.right &&
          ((s = new WorkbookBorderSetting())._deserialize(e.right),
          (this.right = s)),
        e.diagonal &&
          ((r = new WorkbookBorderSetting())._deserialize(e.diagonal),
          (this.diagonal = r));
    }),
    (e.prototype._checkEmptyWorkbookBorder = function () {
      return (
        null == this.top &&
        null == this.bottom &&
        null == this.left &&
        null == this.right &&
        null == this.diagonal
      );
    }),
    e
  );
})();
exports.WorkbookBorder = WorkbookBorder;
var WorkbookBorderSetting = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      var e;
      return (null != this.color && '' !== this.color) || null != this.style
        ? ((e = {}),
          this.color &&
            (wjcCore.isString(this.color)
              ? (e.color = this.color)
              : (e.color = {
                  theme: this.color.theme,
                  tint: this.color.tint,
                })),
          null != this.style &&
            (e.style = wjcCore.asEnum(this.style, BorderStyle, !1)),
          e)
        : null;
    }),
    (e.prototype._deserialize = function (e) {
      null != e.color &&
        (wjcCore.isString(e.color)
          ? (this.color = e.color)
          : (this.color = {
              theme: e.color.theme,
              tint: e.color.tint,
            }),
        null != e.style &&
          (this.style = wjcCore.asEnum(e.style, BorderStyle, !1)));
    }),
    e
  );
})();
exports.WorkbookBorderSetting = WorkbookBorderSetting;
var DefinedName = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      var e;
      return null == this.name
        ? null
        : ((e = { name: this.name, value: this.value }),
          null != this.sheetName && (e.sheetName = this.sheetName),
          e);
    }),
    (e.prototype._deserialize = function (e) {
      (this.name = e.name),
        (this.value = e.value),
        (this.sheetName = e.sheetName);
    }),
    e
  );
})();
exports.DefinedName = DefinedName;
var WorkbookTable = (function () {
  function e() {}
  return (
    Object.defineProperty(e.prototype, 'columns', {
      get: function () {
        return null == this._columns && (this._columns = []), this._columns;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._serialize = function () {
      var e, t;
      return null == this.name || null == this.ref || null == this._columns
        ? null
        : (null != this.style && (t = this.style._serialize()),
          (e = {
            name: this.name,
            ref: this.ref,
            showHeaderRow: this.showHeaderRow,
            showTotalRow: this.showTotalRow,
            style: t,
            showBandedColumns: this.showBandedColumns,
            showBandedRows: this.showBandedRows,
            showFirstColumn: this.showFirstColumn,
            showLastColumn: this.showLastColumn,
            columns: [],
          }),
          (e.columns = this._serializeTableColumns()),
          e);
    }),
    (e.prototype._deserialize = function (e) {
      var t;
      (this.name = e.name),
        (this.ref = e.ref),
        (this.showHeaderRow = e.showHeaderRow),
        (this.showTotalRow = e.showTotalRow),
        null != e.style &&
          ((t = new WorkbookTableStyle())._deserialize(e.style),
          (this.style = t)),
        (this.showBandedColumns = e.showBandedColumns),
        (this.showBandedRows = e.showBandedRows),
        (this.showFirstColumn = e.showFirstColumn),
        (this.showLastColumn = e.showLastColumn),
        this._deserializeTableColumns(e.columns);
    }),
    (e.prototype._serializeTableColumns = function () {
      var e,
        t,
        l = [];
      for (t = 0; t < this._columns.length; t++)
        (e = this._columns[t]) && (l[t] = e._serialize());
      return l;
    }),
    (e.prototype._deserializeTableColumns = function (e) {
      var t, l, o;
      for (
        wjcCore.assert(null != e, 'table Columns should not be null.'),
          this._columns = [],
          o = 0;
        o < e.length;
        o++
      )
        (l = e[o]) &&
          ((t = new WorkbookTableColumn())._deserialize(l),
          (this._columns[o] = t));
    }),
    e
  );
})();
exports.WorkbookTable = WorkbookTable;
var WorkbookTableColumn = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      return null == this.name
        ? null
        : {
            name: this.name,
            totalRowLabel: this.totalRowLabel,
            totalRowFunction: this.totalRowFunction,
            showFilterButton: this.showFilterButton,
          };
    }),
    (e.prototype._deserialize = function (e) {
      (this.name = e.name),
        (this.totalRowLabel = e.totalRowLabel),
        (this.totalRowFunction = e.totalRowFunction),
        (this.showFilterButton = e.showFilterButton);
    }),
    e
  );
})();
exports.WorkbookTableColumn = WorkbookTableColumn;
var WorkbookTableStyle = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      var e;
      return this._checkEmptyWorkbookTableStyle()
        ? null
        : ((e = { name: this.name }),
          this.wholeTableStyle &&
            (e.wholeTableStyle = this.wholeTableStyle._serialize()),
          this.firstBandedColumnStyle &&
            (e.firstBandedColumnStyle =
              this.firstBandedColumnStyle._serialize()),
          this.firstBandedRowStyle &&
            (e.firstBandedRowStyle = this.firstBandedRowStyle._serialize()),
          this.secondBandedColumnStyle &&
            (e.secondBandedColumnStyle =
              this.secondBandedColumnStyle._serialize()),
          this.secondBandedRowStyle &&
            (e.secondBandedRowStyle = this.secondBandedRowStyle._serialize()),
          this.headerRowStyle &&
            (e.headerRowStyle = this.headerRowStyle._serialize()),
          this.totalRowStyle &&
            (e.totalRowStyle = this.totalRowStyle._serialize()),
          this.firstColumnStyle &&
            (e.firstColumnStyle = this.firstColumnStyle._serialize()),
          this.lastColumnStyle &&
            (e.lastColumnStyle = this.lastColumnStyle._serialize()),
          this.firstHeaderCellStyle &&
            (e.firstHeaderCellStyle = this.firstHeaderCellStyle._serialize()),
          this.lastHeaderCellStyle &&
            (e.lastHeaderCellStyle = this.lastHeaderCellStyle._serialize()),
          this.firstTotalCellStyle &&
            (e.firstTotalCellStyle = this.firstTotalCellStyle._serialize()),
          this.lastTotalCellStyle &&
            (e.lastTotalCellStyle = this.lastTotalCellStyle._serialize()),
          e);
    }),
    (e.prototype._deserialize = function (e) {
      (this.name = e.name),
        e.wholeTableStyle &&
          ((this.wholeTableStyle = new WorkbookTableCommonStyle()),
          this.wholeTableStyle._deserialize(e.wholeTableStyle)),
        e.firstBandedColumnStyle &&
          ((this.firstBandedColumnStyle = new WorkbookTableBandedStyle()),
          this.firstBandedColumnStyle._deserialize(e.firstBandedColumnStyle)),
        e.firstBandedRowStyle &&
          ((this.firstBandedRowStyle = new WorkbookTableBandedStyle()),
          this.firstBandedRowStyle._deserialize(e.firstBandedRowStyle)),
        e.secondBandedColumnStyle &&
          ((this.secondBandedColumnStyle = new WorkbookTableBandedStyle()),
          this.secondBandedColumnStyle._deserialize(e.secondBandedColumnStyle)),
        e.secondBandedRowStyle &&
          ((this.secondBandedRowStyle = new WorkbookTableBandedStyle()),
          this.secondBandedRowStyle._deserialize(e.secondBandedRowStyle)),
        e.headerRowStyle &&
          ((this.headerRowStyle = new WorkbookTableCommonStyle()),
          this.headerRowStyle._deserialize(e.headerRowStyle)),
        e.totalRowStyle &&
          ((this.totalRowStyle = new WorkbookTableCommonStyle()),
          this.totalRowStyle._deserialize(e.totalRowStyle)),
        e.firstColumnStyle &&
          ((this.firstColumnStyle = new WorkbookTableCommonStyle()),
          this.firstColumnStyle._deserialize(e.firstColumnStyle)),
        e.lastColumnStyle &&
          ((this.lastColumnStyle = new WorkbookTableCommonStyle()),
          this.lastColumnStyle._deserialize(e.lastColumnStyle)),
        e.firstHeaderCellStyle &&
          ((this.firstHeaderCellStyle = new WorkbookTableCommonStyle()),
          this.firstHeaderCellStyle._deserialize(e.firstHeaderCellStyle)),
        e.lastHeaderCellStyle &&
          ((this.lastHeaderCellStyle = new WorkbookTableCommonStyle()),
          this.lastHeaderCellStyle._deserialize(e.lastHeaderCellStyle)),
        e.firstTotalCellStyle &&
          ((this.firstTotalCellStyle = new WorkbookTableCommonStyle()),
          this.firstTotalCellStyle._deserialize(e.firstTotalCellStyle)),
        e.lastTotalCellStyle &&
          ((this.lastTotalCellStyle = new WorkbookTableCommonStyle()),
          this.lastTotalCellStyle._deserialize(e.lastTotalCellStyle));
    }),
    (e.prototype._checkEmptyWorkbookTableStyle = function () {
      return (
        null == this.name ||
        (null == this.wholeTableStyle &&
          null == this.firstBandedColumnStyle &&
          null == this.firstBandedRowStyle &&
          null == this.secondBandedColumnStyle &&
          null == this.secondBandedRowStyle &&
          null == this.headerRowStyle &&
          null == this.totalRowStyle &&
          null == this.firstColumnStyle &&
          null == this.lastColumnStyle &&
          null == this.firstHeaderCellStyle &&
          null == this.lastHeaderCellStyle &&
          null == this.firstTotalCellStyle &&
          null == this.lastTotalCellStyle)
      );
    }),
    e
  );
})();
exports.WorkbookTableStyle = WorkbookTableStyle;
var WorkbookTableCommonStyle = (function (e) {
  function t() {
    return e.call(this) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._deserialize = function (t) {
      var l;
      e.prototype._deserialize.call(this, t),
        t.borders &&
          ((l = new WorkbookTableBorder())._deserialize(t.borders),
          (this.borders = l));
    }),
    t
  );
})(WorkbookStyle);
exports.WorkbookTableCommonStyle = WorkbookTableCommonStyle;
var WorkbookTableBandedStyle = (function (e) {
  function t() {
    return e.call(this) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._serialize = function () {
      var t;
      return (t = e.prototype._serialize.call(this)), (t.size = this.size), t;
    }),
    (t.prototype._deserialize = function (t) {
      e.prototype._deserialize.call(this, t),
        null != t.size && (this.size = t.size);
    }),
    t
  );
})(WorkbookTableCommonStyle);
exports.WorkbookTableBandedStyle = WorkbookTableBandedStyle;
var WorkbookTableBorder = (function (e) {
  function t() {
    return e.call(this) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._serialize = function () {
      var t;
      return (
        null != (t = e.prototype._serialize.call(this)) ||
          (this.vertical && this.horizontal) ||
          (t = {}),
        this.vertical && (t.vertical = this.vertical._serialize()),
        this.horizontal && (t.horizontal = this.horizontal._serialize()),
        t
      );
    }),
    (t.prototype._deserialize = function (t) {
      var l, o;
      e.prototype._deserialize.call(this, t),
        t.vertical &&
          ((l = new WorkbookBorderSetting())._deserialize(t.vertical),
          (this.vertical = l)),
        t.horizontal &&
          ((o = new WorkbookBorderSetting())._deserialize(t.horizontal),
          (this.horizontal = o));
    }),
    t
  );
})(WorkbookBorder);
exports.WorkbookTableBorder = WorkbookTableBorder;
var WorkbookTextRun = (function () {
  function e() {}
  return (
    (e.prototype._serialize = function () {
      var e = { text: this.text };
      return this.font && (e.font = this.font._serialize()), e;
    }),
    (e.prototype._deserialize = function (e) {
      e.font &&
        ((this.font = new WorkbookFont()), this.font._deserialize(e.font)),
        (this.text = e.text);
    }),
    e
  );
})();
exports.WorkbookTextRun = WorkbookTextRun;
var HAlign;
!(function (e) {
  (e[(e.General = 0)] = 'General'),
    (e[(e.Left = 1)] = 'Left'),
    (e[(e.Center = 2)] = 'Center'),
    (e[(e.Right = 3)] = 'Right'),
    (e[(e.Fill = 4)] = 'Fill'),
    (e[(e.Justify = 5)] = 'Justify');
})((HAlign = exports.HAlign || (exports.HAlign = {})));
var VAlign;
!(function (e) {
  (e[(e.Top = 0)] = 'Top'),
    (e[(e.Center = 1)] = 'Center'),
    (e[(e.Bottom = 2)] = 'Bottom'),
    (e[(e.Justify = 3)] = 'Justify');
})((VAlign = exports.VAlign || (exports.VAlign = {})));
var BorderStyle;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Thin = 1)] = 'Thin'),
    (e[(e.Medium = 2)] = 'Medium'),
    (e[(e.Dashed = 3)] = 'Dashed'),
    (e[(e.Dotted = 4)] = 'Dotted'),
    (e[(e.Thick = 5)] = 'Thick'),
    (e[(e.Double = 6)] = 'Double'),
    (e[(e.Hair = 7)] = 'Hair'),
    (e[(e.MediumDashed = 8)] = 'MediumDashed'),
    (e[(e.ThinDashDotted = 9)] = 'ThinDashDotted'),
    (e[(e.MediumDashDotted = 10)] = 'MediumDashDotted'),
    (e[(e.ThinDashDotDotted = 11)] = 'ThinDashDotDotted'),
    (e[(e.MediumDashDotDotted = 12)] = 'MediumDashDotDotted'),
    (e[(e.SlantedMediumDashDotted = 13)] = 'SlantedMediumDashDotted');
})((BorderStyle = exports.BorderStyle || (exports.BorderStyle = {})));
