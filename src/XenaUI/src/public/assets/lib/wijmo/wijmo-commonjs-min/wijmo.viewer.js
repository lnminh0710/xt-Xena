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
function isIOS() {
  return _isIOS;
}
function _pointMove(e, t, o, n) {
  var r,
    i = e ? 1 : -1;
  return (
    o instanceof wjcCore.Point
      ? ((r = o.x), (n = o.y))
      : ((r = o), (n = n || 0)),
    new wjcCore.Point(t.x + i * r, t.y + i * n)
  );
}
function _createSvgBtn(e) {
  var t = _toDOM(_svgStart + e + _svgEnd);
  wjcCore.addClass(t, 'wj-svg-btn');
  var o = document.createElement('a');
  return o.appendChild(t), wjcCore.addClass(o, 'wj-btn'), (o.tabIndex = 0), o;
}
function _setLandscape(e, t) {
  if (e.landscape !== t) {
    e.landscape = t;
    var o = e.width;
    (e.width = e.height), (e.height = o);
    var n = e.leftMargin;
    t
      ? ((e.leftMargin = e.bottomMargin),
        (e.bottomMargin = e.rightMargin),
        (e.rightMargin = e.topMargin),
        (e.topMargin = n))
      : ((e.leftMargin = e.topMargin),
        (e.topMargin = e.rightMargin),
        (e.rightMargin = e.bottomMargin),
        (e.bottomMargin = n));
  }
}
function _clonePageSettings(e) {
  if (!e) return null;
  var t = {};
  return (
    (t.height = e.height ? new _Unit(e.height) : null),
    (t.width = e.width ? new _Unit(e.width) : null),
    (t.bottomMargin = e.bottomMargin ? new _Unit(e.bottomMargin) : null),
    (t.leftMargin = e.leftMargin ? new _Unit(e.leftMargin) : null),
    (t.rightMargin = e.rightMargin ? new _Unit(e.rightMargin) : null),
    (t.topMargin = e.topMargin ? new _Unit(e.topMargin) : null),
    (t.landscape = e.landscape),
    (t.paperSize = e.paperSize),
    t
  );
}
function _enumToArray(e) {
  var t = [];
  for (var o in e)
    o &&
      o.length &&
      '_' != o[0] &&
      !isNaN(parseInt(o)) &&
      t.push({ text: e[o], value: o });
  return t;
}
function _removeChildren(e, t) {
  if (e && e.children)
    for (var o = e.children, n = o.length - 1; n > -1; n--) {
      var r = o[n];
      if (null == t || t(r)) {
        var i = r.querySelector('.wj-control');
        i && (i = wjcCore.Control.getControl(i)) && i.dispose(),
          e.removeChild(r);
      }
    }
}
function _toDOMs(e) {
  var t,
    o = document.createElement('div'),
    n = document.createDocumentFragment();
  for (o.innerHTML = e; (t = o.firstChild); ) n.appendChild(t);
  return n;
}
function _toDOM(e) {
  return _toDOMs(e).firstChild;
}
function _addEvent(e, t, o, n) {
  for (var r, i = t.split(','), a = 0; a < i.length; a++)
    (r = i[a].trim()),
      e.addEventListener
        ? e.addEventListener(r, o, n)
        : e.attachEvent
        ? e.attachEvent('on' + r, o)
        : (e['on' + r] = o);
}
function _removeEvent(e, t, o) {
  for (var n, r = t.split(','), i = 0; i < r.length; i++)
    (n = r[i].trim()),
      e.removeEventListener
        ? e.removeEventListener(n, o)
        : e.detachEvent
        ? e.detachEvent('on' + n, o)
        : (e['on' + n] = null);
}
function _checkImageButton(e, t) {
  t ? wjcCore.addClass(e, _checkedCss) : wjcCore.removeClass(e, _checkedCss);
}
function _disableImageButton(e, t) {
  t ? wjcCore.addClass(e, _disabledCss) : wjcCore.removeClass(e, _disabledCss);
}
function _showImageButton(e, t) {
  t
    ? wjcCore.removeClass(e, exports._hiddenCss)
    : wjcCore.addClass(e, exports._hiddenCss);
}
function _isDisabledImageButton(e) {
  return wjcCore.hasClass(e, _disabledCss);
}
function _isCheckedImageButton(e) {
  return wjcCore.hasClass(e, _checkedCss);
}
function _addWjHandler(e, t, o, n) {
  if (e) {
    var r = t[wjEventsName];
    r || (r = t[wjEventsName] = {});
    var i = r[e];
    i || (i = r[e] = []), i.push(o);
  }
  t.addHandler(o, n);
}
function _removeAllWjHandlers(e, t) {
  if (e) {
    var o = t[wjEventsName];
    if (o) {
      var n = o[e];
      n &&
        n.forEach(function (e) {
          return t.removeHandler(e);
        });
    }
  }
}
function _getErrorMessage(e) {
  var t = e || wjcCore.culture.Viewer.errorOccured;
  return (
    e.Message &&
      ((t = e.Message),
      e.ExceptionMessage && (t += '<br/>' + e.ExceptionMessage)),
    t
  );
}
function _checkSeparatorShown(e) {
  for (var t, o, n, r, i = !0, a = 0; a < e.children.length; a++)
    (o = e.children[a]),
      (t = wjcCore.hasClass(o, 'wj-separator')),
      (n = wjcCore.hasClass(o, exports._hiddenCss)),
      t || n
        ? t &&
          (i
            ? n || wjcCore.addClass(o, exports._hiddenCss)
            : (n && wjcCore.removeClass(o, exports._hiddenCss), (r = o)),
          (i = !0))
        : (i = !1);
  i && r && wjcCore.addClass(r, 'hidden');
}
function _twipToPixel(e) {
  return _Unit.convertValue(e, _UnitType.Twip, _UnitType.Dip);
}
function _pixelToTwip(e) {
  return _Unit.convertValue(e, _UnitType.Dip, _UnitType.Twip);
}
function _hasScrollbar(e, t) {
  return t ? e.scrollWidth > e.clientWidth : e.scrollHeight > e.clientHeight;
}
function _transformSvg(e, t, o, n, r) {
  n = null == n ? 1 : n;
  var i = e.querySelector('g');
  if (i) {
    var a = 'scale(' + n + ')';
    if (null != r)
      switch (r) {
        case _RotateAngle.Rotation90:
          (a += ' rotate(90)'), (a += ' translate(0 ' + -o + ')');
          break;
        case _RotateAngle.Rotation180:
          (a += ' rotate(180)'), (a += ' translate(' + -t + ' ' + -o + ')');
          break;
        case _RotateAngle.Rotation270:
          (a += ' rotate(270)'), (a += ' translate(' + -t + ' 0)');
      }
    i.setAttribute('transform', a),
      wjcCore.isIE && ((e = i.parentNode).removeChild(i), e.appendChild(i));
  }
  return e;
}
function _getTransformedPosition(e, t, o, n) {
  var r,
    i,
    a = {
      x: _twipToPixel(e.x),
      y: _twipToPixel(e.y),
      width: _twipToPixel(e.width),
      height: _twipToPixel(e.height),
    };
  switch (o) {
    case _RotateAngle.NoRotate:
      (r = a.y), (i = a.x);
      break;
    case _RotateAngle.Rotation90:
      (r = a.x), (i = t.height.valueInPixel - a.y - a.height);
      break;
    case _RotateAngle.Rotation180:
      (r = t.height.valueInPixel - a.y - a.height),
        (i = t.width.valueInPixel - a.x - a.width);
      break;
    case _RotateAngle.Rotation270:
      (r = t.width.valueInPixel - a.x - a.width), (i = a.y);
  }
  return new wjcCore.Point(i * n, r * n);
}
function _getRotatedSize(e, t) {
  return t === _RotateAngle.NoRotate || t === _RotateAngle.Rotation180
    ? e
    : { width: e.height, height: e.width };
}
function _getPositionByHitTestInfo(e) {
  return e
    ? {
        pageIndex: e.pageIndex,
        pageBounds: { x: e.x, y: e.y, width: 0, height: 0 },
      }
    : { pageIndex: 0, pageBounds: { x: 0, y: 0, width: 0, height: 0 } };
}
function _statusJsonReviver(e, t) {
  if (wjcCore.isString(t)) {
    if (_strEndsWith(e, 'DateTime')) return new Date(t);
    if ('width' === e || 'height' === e || _strEndsWith(e, 'Margin'))
      return new _Unit(t);
  }
  return t;
}
function _pageSettingsJsonReviver(e, t) {
  return wjcCore.isString(t) &&
    ('width' === e || 'height' === e || _strEndsWith(e, 'Margin'))
    ? new _Unit(t)
    : t;
}
function _strEndsWith(e, t) {
  return e.slice(-t.length) === t;
}
function _appendQueryString(e, t) {
  t = t || {};
  var o = [];
  for (var n in t) o.push(n + '=' + t[n]);
  return o.length && (e += (e.indexOf('?') < 0 ? '?' : '&') + o.join('&')), e;
}
function _joinUrl() {
  for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
  for (var o = [], n = 0, r = e.length; n < r; n++) {
    var i = e[n];
    i &&
      ('string' != typeof i
        ? (o = o.concat(_joinStringUrl(i)))
        : o.push(_prepareStringUrl(i).join('/')));
  }
  return o.join('/');
}
function _joinStringUrl(e) {
  if (null == e) return null;
  for (var t = [], o = 0, n = e.length; o < n; o++)
    t = t.concat(_prepareStringUrl(e[o]));
  return t;
}
function _prepareStringUrl(e) {
  var t = e.split('/');
  return t.length > 0 && !t[t.length - 1].length && t.splice(t.length - 1), t;
}
function _httpRequest(e, t) {
  if (
    ((t && t.cache) || (e = _disableCache(e)),
    t && 'GET' !== (t.method || 'GET').toUpperCase())
  ) {
    if (t.data) {
      var o = _objToParams(t.data);
      null != o && (t.data = o);
    }
    t.requestHeaders
      ? t.requestHeaders['Content-Type'] ||
        (t.requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded')
      : (t.requestHeaders = {
          'Content-Type': 'application/x-www-form-urlencoded',
        });
  }
  return wjcCore.httpRequest(e, t);
}
function _objToParams(e) {
  var t = [];
  e = e || {};
  for (var o in e)
    if (null !== e[o] && void 0 !== e[o])
      if (wjcCore.isArray(e[o]))
        if (e[o].length > 0)
          for (var n = 0; n < e[o].length; n++)
            t.push(o + '=' + encodeURIComponent(e[o][n]));
        else t.push(o + '=');
      else t.push(o + '=' + encodeURIComponent(e[o]));
  return t.join('&');
}
function _disableCache(e) {
  return e + (-1 == e.indexOf('?') ? '?' : '&') + '_=' + new Date().getTime();
}
function _parseReportExecutionInfo(e) {
  return JSON.parse(e, _statusJsonReviver);
}
function _parseExecutionInfo(e) {
  return JSON.parse(e, _statusJsonReviver);
}
function _getTouchEventMap() {
  return 'ontouchstart' in window ? _touchEventsMap : _pointerEventsMap;
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
  wjcInput = require('wijmo/wijmo.input'),
  wjcGrid = require('wijmo/wijmo.grid'),
  wjcSelf = require('wijmo/wijmo.viewer');
(window.wijmo = window.wijmo || {}), (window.wijmo.viewer = wjcSelf);
var _isIOS = null != navigator.userAgent.match(/iPhone|iPad|iPod/i);
exports.isIOS = isIOS;
var _svgStart =
    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve">',
  _svgEnd = '</svg>';
(exports.icons = {
  paginated:
    '<rect x="16" y= "1" width="1" height="1" /><rect x="17" y= "2" width="1" height="1" /><rect x="18" y= "3" width="1" height="1" /><path d= "M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M5,22.1V2h8v5h1h1h3v15.1H5z" /><rect x="6" y= "8" width="10" height="1" /><rect x="6" y= "5" width="5" height="1" /><rect x="6" y= "11" width="10" height="1" /><rect x="6" y= "14" width="10" height="1" /><rect x="6" y= "17" width="10" height="1" /><rect x="6" y= "20" width="10" height="1" />',
  print:
    '<rect x="5" y= "1" width="14" height="4" /><polygon points= "22,8 22,7 19,7 19,6 5,6 5,7 2,7 2,8 1,8 1,11 1,20 2,20 2,21 5,21 5,11 19,11 19,21 22,21 22,20 23,20 23, 11 23, 8 "/><path d="M6,12v11h12V12H6z M16,21H8v-1h8V21z M16,18H8v-1h8V18z M16,15H8v-1h8V15z" />',
  exports:
    '<path d="M19.6,23"/><polyline points="5,19 5,2 13,2 13,7 14.3,7 15,7 18,7 18,9 20,9 20,7 20,6.4 20,5 20,4 19,4 19,5 15,5 15,2 15,1 16,1 16,0 15,0 5,0 3,0 3,2 3,19 3,21 5,21 "/><rect x="18" y="3" width="1" height="1"/><rect x="17" y="2" width="1" height="1"/><rect x="16" y="1" width="1" height="1"/><polygon points="17,16.6 20,14.1 17,11.6 17,13.6 13,13.6 13,14.6 17,14.6 "/><rect x="3" y="20.9" width="2" height="3.1"/><rect x="4.5" y="22" width="15.6" height="2"/><rect x="18" y="8.4" width="2" height="1.6"/><rect x="18" y="18" width="2.1" height="6"/>',
  portrait:
    '<path d="M19,0L19,0L5,0v0H3v24h0.1H5h14h1.7H21V0H19z M12.5,23h-1v-1h1V23z M19,21H5V2h14V21z"/>',
  landscape:
    '<path d="M24,19L24,19l0-14h0V3H0v0.1V5v14v1.7V21h24V19z M1,12.5v-1h1v1H1z M3,19V5h19v14H3z"/>',
  pageSetup:
    '<rect x="18" y="1" width="1" height="1"/><rect x="19" y="2" width="1" height="1"/><rect x="20" y="3" width="1" height="1"/><polygon points="22,5 22,4 21,4 21,5 20.4,5 20,5 17,5 17,2 17,1.3 17,1 18,1 18,0 17,0 17,0 7,0 6,0 5,0 5,5 7,5 7,2 15,2 15,7 16,7 17,7 20,7 20,22.1 7,22.1 7,19 5,19 5,24 5.9,24 7,24 20,24 21.1,24 22,24 22,5 "/><rect x="5" y="7" width="2" height="2"/><rect x="5" y="11" width="2" height="2"/><rect x="5" y="15" width="2" height="2"/><rect x="9" y="11" width="2" height="2"/><rect x="1" y="11" width="2" height="2"/><polygon points="9,8 9,8 8,8 8,9 9,9 9,10 10,10 10,8 "/><polygon points="2,9 2,9 2,10 3,10 3,9 4,9 4,8 2,8 "/><polygon points="3,16 3,16 4,16 4,15 3,15 3,14 2,14 2,16 "/><polygon points="10,15 10,15 10,14 9,14 9,15 8,15 8,16 10,16 "/>',
  previousPage:
    '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="5.6,10.7 12,4.4 18.4,10.7 18.4,15 13.5,10.1 13.5,19.6 10.4,19.6 10.4,10.1 5.6,15 " />',
  nextPage:
    '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="18.4,13.3 12,19.6 5.6,13.3 5.6,9 10.5,13.9 10.5,4.4 13.6,4.4 13.6,13.9 18.4,9 " />',
  firstPage:
    '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="6.5,13.1 12,7.8 17.5,13.1 17.5,17.5 13.5,13.5 13.5,19.6 10.4,19.6 10.4,13.5 6.5,17.5 " /><rect x="6.5" y= "4.4" width="10.9" height="2.2" />',
  lastPage:
    '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="17.5,10.9 12,16.2 6.5,10.9 6.5,6.5 10.5,10.5 10.5,4.4 13.6,4.4 13.6,10.5 17.5,6.5 " /><rect x="6.5" y= "17.5" transform="matrix(-1 -8.987357e-011 8.987357e-011 -1 24 37.0909)" width="10.9" height="2.2" />',
  backwardHistory:
    '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="10.7,18.4 4.4,12 10.7,5.6 15,5.6 10.1,10.5 19.6,10.5 19.6,13.6 10.1,13.6 15,18.4 " />',
  forwardHistory:
    '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="13.3,5.6 19.6,12 13.3,18.4 9,18.4 13.9,13.5 4.4,13.5 4.4,10.4 13.9,10.4 9,5.6 " />',
  selectTool:
    '<polygon points="19.9,13.4 5.6,1.1 5.3,19.9 10.5,14.7 14.3,23.3 16.4,22.4 12.6,13.8 "/>',
  moveTool:
    '<polygon points="12.5,3 14.5,3 12,0 9.5,3 11.5,3 11.5,21 11.5,21 9.6,21 12,24 14.5,21 12.5,21 "/><polygon points="21,12.5 21,14.5 24,12 21,9.5 21,11.5 3,11.5 3,11.5 3,9.6 0,12 3,14.5 3,12.5 "/>',
  continuousView:
    '<polygon points="22,0 22,5 9,5 9,0 7,0 7,5 7,7 7,7 24,7 24,7 24,5 24,0 "/><polygon points="23,15 19,15 19,11 20,11 20,10 19,10 18,10 17,10 9,10 7.4,10 7,10 7,24 9,24 9,12 17,12 17,15 17,16.6 17,17 22,17 22,24 24,24 24,17 24,15.1 24,15 24,15 24,14 23,14 "/><rect x="22" y="13" width="1" height="1"/><polygon points="20.9,12 20.9,13 22,13 22,12 21,12 21,11 20,11 20,12 "/><polygon points="4.9,5.2 2.5,2.2 0,5.2 2,5.2 2,9.2 3,9.2 3,5.2 "/><polygon points="2.9,19.2 2.9,15.2 1.9,15.2 1.9,19.2 0,19.2 2.5,22.1 4.9,19.2 "/>',
  singleView:
    '<rect x="16" y="1" width="1" height="1"/><rect x="17" y="2" width="1" height="1"/><rect x="18" y="3" width="1" height="1"/><path d="M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M5,22.1V2h8v5h1h1h3v15.1H5z"/>',
  fitWholePage:
    '<rect x="16" y="1" width="1" height="1"/><rect x="17" y="2" width="1" height="1"/><rect x="18" y="3" width="1" height="1"/><path d="M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M18,22.1H5V2h8v5h1h1h3V22.1z"/><polygon points="17,13.5 15,11 15,13 13,13 13,14 15,14 15,16 "/><polygon points="6,13.5 8,16 8,14 10,14 10,13 8,13 8,11 "/><polygon points="11.5,7 9,9 11,9 11,11 12,11 12,9 14,9 "/><polygon points="11.5,20 14,18 12,18 12,16 11,16 11,18 9,18 "/>',
  fitPageWidth:
    '<rect x="16" y="1" width="1" height="1"/><rect x="17" y="2" width="1" height="1"/><rect x="18" y="3" width="1" height="1"/><path d="M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M5,22.1V2h8v5h1h1h3v15.1H5z"/><polygon points="14,15.5 17,13 14,10.6 14,12.6 13,12.6 13,13.6 14,13.6 "/><polyline points="6,13.1 9,15.6 9,13.6 10,13.6 10,12.6 9,12.6 9,10.6 6,13.1 "/>',
  zoomOut:
    '<circle opacity=".25" cx="12" cy="12" r="12"/><rect opacity=".75" x="5" y="10" width="14" height="3"/>',
  zoomIn:
    '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon opacity=".75" points="19,10 13.5,10 13.5,4.5 10.5,4.5 10.5,10 5,10 5,13 10.5,13 10.5,18.5 13.5,18.5 13.5,13 19,13 " />',
  fullScreen:
    '<path d="M22,0H0v2.8V4v20h1.5H2h20h0.7H24V4V0H22z M7,1h1v1H7V1z M5,1h1v1H5V1z M3,1h1v1H3V1z M22,22H2L2,4h20L22,22z" /><polygon points="19.6,9.9 20,6 16.1,6.4 17.6,7.8 14.7,10.6 15.4,11.3 18.3,8.5"/><polygon points="4.4,16.2 4,20 7.9,19.7 6.5,18.3 9.3,15.5 8.6,14.8 5.8,17.6"/>',
  exitFullScreen:
    '<path d="M22,0H0v2.8V4v20h1.5H2h20h0.7H24V4V0H22z M7,1h1v1H7V1z M5,1h1v1H5V1z M3,1h1v1H3V1z M22,22H2L2,4h20L22,22z" /><polygon points="9.2,18.6 9.6,14.7 5.7,15.1 7.2,16.5 4.3,19.3 5,20 7.9,17.2"/><polygon points="14.8,7.5 14.4,11.3 18.3,11 16.9,9.6 19.7,6.8 19,6.1 16.2,8.9"/>',
  thumbnails:
    '<path d="M20,2h-5h-2v2v5v2v0h2v0h5v0h2v0V9V4V2H20z M20,9h-5V4h5V9z"/><path d="M20,13h-5h-2v2v5v2v0h2v0h5v0h2v0v-2v-5v-2H20z M20,20h-5v-5h5V20z"/><path d="M9,13H4H2v2v5v2v0h2v0h5v0h2v0v-2v-5v-2H9z M9,20H4v-5h5V20z"/><rect x="2" y="2" width="9" height="9"/>',
  outlines:
    '<path d="M22,0H2H0v2v20v2h2h20h2v-2V2V0H22z M2,2h12v20H2V2z M22,22h-6V2h6V22z"/><rect x="17.5" y="5" width="3" height="1" /><rect x="17.5" y="8" width="3" height="1"/><rect x="17.5" y="11" width="3" height="1"/>',
  search:
    '<circle stroke-width="2" fill="none" cx="9.5" cy="9.5" r="8.5"/><rect x="16.9" y="13.7" transform="matrix(-0.7193 0.6947 -0.6947 -0.7193 44.3315 18.4942)" width="3" height="9"/>',
  searchNext:
    '<polygon points="12,12.6 4,4.5 4,11.4 12,19.5 20,11.4 20,4.5 "/>',
  searchPrevious:
    '<polygon points="12,11.4 20,19.5 20,12.6 12,4.5 4,12.6 4,19.5 "/>',
  hamburgerMenu:
    '<rect x="2" y="4.875" width="20" height="1.5"/><rect x="2" y="11.25" width="20" height="1.5"/><rect x="2" y="17.625" width="20" height="1.5"/>',
  viewMenu:
    '<path transform="scale(1.5)" d="M8,2.9c-4.4,0-8,2.2-8,5s3.6,5,8,5s8-2.2,8-5S12.4,2.9,8,2.9z M8,11.8c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4, 1.8,4,4C12, 10,10.2,11.8,8,11.8z"/><circle class="st0" cx="12" cy="11.85" r="3.45"/>',
  searchOptions:
    '<polygon points="12,12.6 4,4.5 4,11.4 12,19.5 20,11.4 20,4.5 "/>',
  searchLeft:
    '<polygon points="11.4,12 19.5,20 12.6,20 4.5,12 12.6,4 19.5,4 "/>',
  searchRight:
    '<polygon points="12.6,12 4.5,4 11.4,4 19.5,12 11.4,20 4.5,20 "/>',
  showZoomBar:
    '<path d="M22.8,20.7l-4.4-4.4c1.1-1.6,1.8-3.5,1.8-5.6c0-5.2-4.3-9.5-9.5-9.5s-9.5,4.3-9.5,9.5s4.3,9.5,9.5,9.5 c2.1,0,4-0.7,5.6-1.8l4.4,4.4L22.8,20.7z M4.2,10.7c0-3.6,2.9-6.5,6.5-6.5s6.5,2.9,6.5,6.5s-2.9,6.5-6.5,6.5S4.2,14.3,4.2,10.7z"/><polygon points="7.2,9.2 7.2,7.2 9.2,7.2 9.2,6.2 6.2,6.2 6.2,9.2 "/><polygon points="12.2,7.2 14.2,7.2 14.2,9.2 15.2,9.2 15.2,6.2 12.2,6.2 "/><polygon points="9.2,14.2 7.2,14.2 7.2,12.2 6.2,12.2 6.2,15.2 9.2,15.2 "/><polygon points="14.2,12.2 14.2,14.2 12.2,14.2 12.2,15.2 15.2,15.2 15.2,12.2 "/>',
  rubberbandTool:
    '\n        <g>\n\t        <polygon points="11.5,2 4,2 2,2 2,4 2,11.5 4,11.5 4,4 11.5,4 \t"/>\n\t        <path d="M16,10V8h-2h-4H8v2v4v2h2h4h2v-2V10z M14,14h-4v-4h4V14z"/>\n\t        <polygon points="20,12 20,19 19,19 19,20 12,20 12,22 20,22 22,22 22,20 22,12 \t"/>\n\t        <rect x="16" y="16" class="st0" width="1" height="1"/>\n\t        <rect x="17" y="17" class="st0" width="1" height="1"/>\n\t        <rect x="18" y="18" class="st0" width="1" height="1"/>\n        </g>',
  magnifierTool:
    '\n        <circle fill="none" stroke-width="2" stroke-miterlimit="10" cx="9.5" cy="9.5" r="7.5"/>\n        <rect x="17" y="13.7" transform="matrix(0.7193 -0.6947 0.6947 0.7193 -7.4537 17.9238)" class="st1" width="3" height="9"/>\n        <polygon points="14,8.5 10.5,8.5 10.5,5 8.5,5 8.5,8.5 5,8.5 5,10.5 8.5,10.5 8.5,14 10.5,14 10.5,10.5 14,10.5 "/>\n        ',
  rotateDocument:
    '\n        <g>\n\t        <path d="M18,0H5H3v4v18v2h2h13h2v-2V4V0H18z M18,22H5V4h13V22z"/>\n\t        <polygon points="9,12 13,12 13,14 15,11.5 13,9 13,11 9,11 8,11 8,12 8,17 9,17 \t"/>\n        </g>',
  rotatePage:
    '\n        <g>\n\t        <rect x="16" y="1" width="1" height="1"/>\n\t        <rect x="17" y="2" width="1" height="1"/>\n\t        <rect x="18" y="3" width="1" height="1"/>\n\t        <path class="st0" d="M19,4v1h-0.6H18h-3V2V1.3V1h1V0h-1H5H4H3v24h2h13h1.1H20V5V4H19z M18,22.1H5V2h8v5h1h1h3V22.1z"/>\n\t        <polygon points="13,11 9,11 8,11 8,12 8,17 9,17 9,12 13,12 13,14 15,11.5 13,9 \t"/>\n        </g>',
}),
  (exports._hiddenCss = 'hidden'),
  (exports._commandTagAttr = 'command-tag'),
  (exports._pointMove = _pointMove);
var _ActionQueue = (function () {
  function e() {
    (this._actions = []), (this._isStarted = !1);
  }
  return (
    (e.prototype._any = function () {
      return this._actions.length > 0;
    }),
    (e.prototype.queue = function (e) {
      var t = this,
        o = this._any();
      this._actions.push(function () {
        e(), t._continue();
      }),
        this.isStarted && !o && this._continue();
    }),
    (e.prototype._continue = function () {
      var e = this._actions.shift();
      e && e();
    }),
    (e.prototype.start = function () {
      this._isStarted || ((this._isStarted = !0), this._continue());
    }),
    Object.defineProperty(e.prototype, 'isStarted', {
      get: function () {
        return this._isStarted;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
(exports._ActionQueue = _ActionQueue),
  (exports._createSvgBtn = _createSvgBtn),
  (exports._setLandscape = _setLandscape),
  (exports._clonePageSettings = _clonePageSettings),
  (exports._enumToArray = _enumToArray),
  (exports._removeChildren = _removeChildren),
  (exports._toDOMs = _toDOMs),
  (exports._toDOM = _toDOM),
  (exports._addEvent = _addEvent),
  (exports._removeEvent = _removeEvent);
var _checkedCss = 'wj-state-active',
  _disabledCss = 'wj-state-disabled';
(exports._checkImageButton = _checkImageButton),
  (exports._disableImageButton = _disableImageButton),
  (exports._showImageButton = _showImageButton),
  (exports._isDisabledImageButton = _isDisabledImageButton),
  (exports._isCheckedImageButton = _isCheckedImageButton);
var wjEventsName = '__wjEvents';
(exports._addWjHandler = _addWjHandler),
  (exports._removeAllWjHandlers = _removeAllWjHandlers),
  (exports._getErrorMessage = _getErrorMessage),
  (exports._checkSeparatorShown = _checkSeparatorShown),
  (exports._twipToPixel = _twipToPixel),
  (exports._pixelToTwip = _pixelToTwip),
  (exports._hasScrollbar = _hasScrollbar),
  (exports._transformSvg = _transformSvg),
  (exports._getTransformedPosition = _getTransformedPosition),
  (exports._getRotatedSize = _getRotatedSize),
  (exports._getPositionByHitTestInfo = _getPositionByHitTestInfo);
var _DocumentSource = (function () {
  function e(e) {
    (this._hasOutlines = !1),
      (this._pageCount = 0),
      (this._supportedExportDescriptions = []),
      (this._isLoadCompleted = !1),
      (this._isDisposed = !1),
      (this._errors = []),
      (this.pageCountChanged = new wjcCore.Event()),
      (this.disposed = new wjcCore.Event()),
      (this.pageSettingsChanged = new wjcCore.Event()),
      (this.loading = new wjcCore.Event()),
      (this.loadCompleted = new wjcCore.Event()),
      (this.queryLoadingData = new wjcCore.Event()),
      (this._service = this._createDocumentService(e)),
      (this._paginated = e.paginated);
  }
  return (
    (e.prototype.onQueryLoadingData = function (e) {
      this.queryLoadingData.raise(this, e);
    }),
    (e.prototype._updateIsLoadCompleted = function (e) {
      this._isLoadCompleted !== e &&
        ((this._isLoadCompleted = e), e && this.onLoadCompleted());
    }),
    (e.prototype._updateIsDisposed = function (e) {
      this._isDisposed !== e && ((this._isDisposed = e), this.onDisposed());
    }),
    (e.prototype._getIsDisposed = function () {
      return this._isDisposed;
    }),
    (e.prototype._checkHasOutlines = function (e) {
      return e.hasOutlines;
    }),
    (e.prototype._checkIsLoadCompleted = function (e) {
      return (
        e.status === _ExecutionStatus.completed ||
        e.status === _ExecutionStatus.stopped ||
        e.status === _ExecutionStatus.loaded
      );
    }),
    Object.defineProperty(e.prototype, 'executionDateTime', {
      get: function () {
        return this._executionDateTime;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'expiredDateTime', {
      get: function () {
        return this._expiredDateTime;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'errors', {
      get: function () {
        return this._errors;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isLoadCompleted', {
      get: function () {
        return this._isLoadCompleted;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isDisposed', {
      get: function () {
        return this._getIsDisposed();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'features', {
      get: function () {
        return this._features;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'pageSettings', {
      get: function () {
        return this._pageSettings;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.onPageSettingsChanged = function (e) {
      this.pageSettingsChanged.raise(this, e || new wjcCore.EventArgs());
    }),
    (e.prototype.onLoadCompleted = function (e) {
      this.loadCompleted.raise(this, e || new wjcCore.EventArgs());
    }),
    (e.prototype.onLoading = function (e) {
      this.loading.raise(this, e || new wjcCore.EventArgs());
    }),
    (e.prototype.onDisposed = function (e) {
      this.disposed.raise(this, e || new wjcCore.EventArgs());
    }),
    (e.prototype.setPageSettings = function (e) {
      var t = this;
      return this._innerService.setPageSettings(e).then(function (e) {
        return t._updatePageSettings(e);
      });
    }),
    (e.prototype._updatePageSettings = function (e) {
      (this._pageSettings = e), this.onPageSettingsChanged();
    }),
    Object.defineProperty(e.prototype, '_innerService', {
      get: function () {
        return this._service;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'paginated', {
      get: function () {
        return this.pageSettings
          ? this.pageSettings.paginated
          : this._paginated;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'hasOutlines', {
      get: function () {
        return this._hasOutlines;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'pageCount', {
      get: function () {
        return this._pageCount;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'initialPosition', {
      get: function () {
        return this._initialPosition;
      },
      set: function (e) {
        this._initialPosition = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'service', {
      get: function () {
        return this._service;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getSupportedExportDescriptions = function () {
      return this._innerService.getSupportedExportDescriptions();
    }),
    (e.prototype.getBookmark = function (e) {
      return this._innerService.getBookmark(e);
    }),
    (e.prototype.executeCustomAction = function (e) {
      return this._innerService.executeCustomAction(e);
    }),
    (e.prototype.getOutlines = function () {
      return this._innerService.getOutlines();
    }),
    (e.prototype.getFeatures = function () {
      var e = this;
      return this._innerService.getFeatures().then(function (t) {
        e._features = t;
      });
    }),
    (e.prototype.dispose = function () {
      var e = this;
      return this._innerService.dispose().then(function () {
        return e._updateIsDisposed(!0);
      });
    }),
    (e.prototype.load = function () {
      var e = this;
      this.onLoading();
      var t = {};
      null != this._paginated && (t['pageSettings.paginated'] = this.paginated);
      var o = new QueryLoadingDataEventArgs(t);
      return (
        this.onQueryLoadingData(o),
        this._innerService.load(o.data).then(function (t) {
          e._updateExecutionInfo(t), e._updateIsLoadCompleted(!0);
        })
      );
    }),
    (e.prototype._updateExecutionInfo = function (e) {
      null != e &&
        ((this._executionDateTime = this._getExecutionDateTime(e)),
        (this._expiredDateTime = this._getExpiredDateTime(e)),
        this._updatePageSettings(e.pageSettings),
        (this._features = e.features),
        this._updateDocumentStatus(e.status));
    }),
    (e.prototype._updateDocumentStatus = function (e) {
      e &&
        ((this._errors = e.errorList),
        (this._initialPosition = e.initialPosition),
        this._updatePageCount(this._getPageCount(e)),
        (this._expiredDateTime = this._getExpiredDateTime(e)),
        (this._hasOutlines = this._checkHasOutlines(e)),
        this._updateIsLoadCompleted(this._checkIsLoadCompleted(e)));
    }),
    (e.prototype._getExecutionDateTime = function (e) {
      return e.loadedDateTime;
    }),
    (e.prototype._getExpiredDateTime = function (e) {
      return e.expiredDateTime;
    }),
    (e.prototype._getPageCount = function (e) {
      return e.pageCount;
    }),
    (e.prototype._updatePageCount = function (e) {
      this._pageCount !== e &&
        ((this._pageCount = e), this.onPageCountChanged());
    }),
    (e.prototype.getStatus = function () {
      var e = this;
      return this._innerService.getStatus().then(function (t) {
        e._updateDocumentStatus(t);
      });
    }),
    (e.prototype._createDocumentService = function (t) {
      throw e._abstractMethodException;
    }),
    (e.prototype.onPageCountChanged = function (e) {
      this.pageCountChanged.raise(this, e || new wjcCore.EventArgs());
    }),
    (e.prototype.print = function (e) {
      var t = this;
      if (wjcCore.isMobile()) {
        var o = this.getRenderToFilterUrl({ format: 'pdf' });
        window.open(o);
      } else {
        var n = new wjcCore.PrintDocument({ title: 'Document' });
        this.renderToFilter({ format: 'html' }).then(function (o) {
          n.append(o.responseText),
            n._getDocument().close(),
            window.setTimeout(function () {
              t._removeScript(n), t._rotate(n, e), n.print();
            }, 100);
        });
      }
    }),
    (e.prototype._removeScript = function (e) {
      for (
        var t = e._getDocument().querySelectorAll('script'), o = 0;
        o < t.length;
        o++
      ) {
        var n = t.item(o);
        n.parentElement.removeChild(n);
      }
    }),
    (e.prototype._rotate = function (e, t) {
      if (t && t.length)
        for (
          var o = e._getDocument().querySelectorAll('svg'), n = 0;
          n < o.length;
          n++
        ) {
          var r = t[n];
          if (r) {
            for (
              var i = o[n],
                a = document.createElementNS('http://www.w3.org/2000/svg', 'g');
              i.hasChildNodes();

            )
              a.appendChild(i.firstChild);
            i.appendChild(a);
            var s = {
                width: new _Unit(i.width.baseVal.value),
                height: new _Unit(i.height.baseVal.value),
              },
              c = _getRotatedSize(s, r),
              u = i.parentNode;
            (u.style.width = c.width.valueInPixel + 'px'),
              (u.style.height = c.height.valueInPixel + 'px'),
              i.setAttribute('width', c.width.valueInPixel.toString() + 'px'),
              i.setAttribute('height', c.height.valueInPixel.toString() + 'px'),
              _transformSvg(
                o[n],
                s.width.valueInPixel,
                s.height.valueInPixel,
                1,
                r
              );
          }
        }
    }),
    (e.prototype.renderToFilter = function (e) {
      return this._innerService.renderToFilter(e);
    }),
    (e.prototype.getRenderToFilterUrl = function (e) {
      return this._innerService.getRenderToFilterUrl(e);
    }),
    (e.prototype.search = function (e) {
      return this._innerService.search(e);
    }),
    (e._abstractMethodException =
      'It is an abstract method, please implement it.'),
    e
  );
})();
(exports._DocumentSource = _DocumentSource),
  (exports._statusJsonReviver = _statusJsonReviver);
var _DocumentService = (function () {
  function e(e) {
    (this._url = ''),
      (this._url = e.serviceUrl || ''),
      (this._documentPath = e.filePath);
  }
  return (
    Object.defineProperty(e.prototype, 'serviceUrl', {
      get: function () {
        return this._url;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'filePath', {
      get: function () {
        return this._documentPath;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getStatus = function () {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.setPageSettings = function (e) {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.getBookmark = function (e) {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.executeCustomAction = function (e) {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.load = function (e) {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.dispose = function () {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.getOutlines = function () {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.renderToFilter = function (e) {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.search = function (e) {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.getRenderToFilterUrl = function (e) {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.getSupportedExportDescriptions = function () {
      throw _DocumentSource._abstractMethodException;
    }),
    (e.prototype.getFeatures = function () {
      throw _DocumentSource._abstractMethodException;
    }),
    e
  );
})();
(exports._DocumentService = _DocumentService),
  (exports._pageSettingsJsonReviver = _pageSettingsJsonReviver),
  (exports._strEndsWith = _strEndsWith),
  (exports._appendQueryString = _appendQueryString),
  (exports._joinUrl = _joinUrl),
  (exports._joinStringUrl = _joinStringUrl),
  (exports._prepareStringUrl = _prepareStringUrl),
  (exports._httpRequest = _httpRequest),
  (exports._objToParams = _objToParams),
  (exports._disableCache = _disableCache);
var _UnitType;
!(function (e) {
  (e[(e.Document = 0)] = 'Document'),
    (e[(e.Inch = 1)] = 'Inch'),
    (e[(e.Mm = 2)] = 'Mm'),
    (e[(e.Pica = 3)] = 'Pica'),
    (e[(e.Point = 4)] = 'Point'),
    (e[(e.Twip = 5)] = 'Twip'),
    (e[(e.InHs = 6)] = 'InHs'),
    (e[(e.Display = 7)] = 'Display'),
    (e[(e.Cm = 8)] = 'Cm'),
    (e[(e.Dip = 9)] = 'Dip');
})((_UnitType = exports._UnitType || (exports._UnitType = {})));
var _Unit = (function () {
  function e(t, o) {
    if (
      (void 0 === o && (o = _UnitType.Dip),
      e._initUnitTypeDic(),
      wjcCore.isObject(t))
    ) {
      var n = t;
      (t = n.value), (o = n.units);
    } else if (wjcCore.isString(t)) {
      var r = parseFloat(t);
      isNaN(r) ||
        ((o = e._unitTypeDic[t.substr(r.toString().length)]), (t = r));
    }
    (this._value = t),
      (this._units = o),
      (this._valueInPixel = e.convertValue(t, o, _UnitType.Dip));
  }
  return (
    (e._initUnitTypeDic = function () {
      if (!e._unitTypeDic) {
        e._unitTypeDic = {};
        for (var t in e._unitTypes)
          e._unitTypeDic[(e._unitTypeDic[t] = e._unitTypes[t])] = t;
      }
    }),
    Object.defineProperty(e.prototype, 'value', {
      get: function () {
        return this._value;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'units', {
      get: function () {
        return this._units;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'valueInPixel', {
      get: function () {
        return this._valueInPixel;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.toString = function () {
      return e.toString(this);
    }),
    (e.toString = function (t) {
      return null == t.value ? '' : t.value + e._unitTypeDic[t.units];
    }),
    (e.convertValue = function (t, o, n) {
      if (o === n) return t;
      var r;
      switch (o) {
        case _UnitType.Document:
          r = t / e._DocumentUnitsPerInch;
          break;
        case _UnitType.Inch:
          r = t;
          break;
        case _UnitType.Mm:
          r = t / e._MmPerInch;
          break;
        case _UnitType.Pica:
          r = t / e._PicaPerInch;
          break;
        case _UnitType.Point:
          r = t / e._PointsPerInch;
          break;
        case _UnitType.Twip:
          r = t / e._TwipsPerInch;
          break;
        case _UnitType.InHs:
          r = t / 100;
          break;
        case _UnitType.Display:
          r = t / e._DisplayPerInch;
          break;
        case _UnitType.Cm:
          r = t / e._CmPerInch;
          break;
        case _UnitType.Dip:
          r = t / e._DipPerInch;
          break;
        default:
          throw 'Invalid from _UnitType: ' + o;
      }
      switch (n) {
        case _UnitType.Document:
          return r * e._DocumentUnitsPerInch;
        case _UnitType.Inch:
          return r;
        case _UnitType.Mm:
          return r * e._MmPerInch;
        case _UnitType.Pica:
          return r * e._PicaPerInch;
        case _UnitType.Point:
          return r * e._PointsPerInch;
        case _UnitType.Twip:
          return r * e._TwipsPerInch;
        case _UnitType.InHs:
          return 100 * r;
        case _UnitType.Display:
          return r * e._DisplayPerInch;
        case _UnitType.Cm:
          return r * e._CmPerInch;
        case _UnitType.Dip:
          return r * e._DipPerInch;
        default:
          throw 'Invalid to _UnitType: ' + n;
      }
    }),
    (e._MmPerInch = 25.4),
    (e._DocumentUnitsPerInch = 300),
    (e._PointsPerInch = 72),
    (e._TwipsPerInch = 1440),
    (e._PicaPerInch = 6),
    (e._CmPerInch = e._MmPerInch / 10),
    (e._DisplayPerInch = 75),
    (e._DipPerInch = 96),
    (e._unitTypes = {
      doc: _UnitType.Document,
      in: _UnitType.Inch,
      mm: _UnitType.Mm,
      pc: _UnitType.Pica,
      pt: _UnitType.Point,
      tw: _UnitType.Twip,
      inhs: _UnitType.InHs,
      dsp: _UnitType.Display,
      cm: _UnitType.Cm,
      dip: _UnitType.Dip,
      px: _UnitType.Dip,
    }),
    e
  );
})();
exports._Unit = _Unit;
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
          t.onFulfilled(e);
        } catch (e) {
          t.onRejected(e);
        }
      }, 0);
    }),
    (e.prototype.reject = function (e) {
      var t = this;
      setTimeout(function () {
        t.onRejected(e);
      }, 0);
    }),
    (e.prototype.onFulfilled = function (e) {
      for (var t; (t = this._callbacks.shift()); )
        if (t.onFulfilled) {
          var o = t.onFulfilled(e);
          void 0 !== o && (e = o);
        }
    }),
    (e.prototype.onRejected = function (e) {
      for (var t; (t = this._callbacks.shift()); )
        if (t.onRejected) {
          var o = t.onRejected(e);
          return void this.onFulfilled(o);
        }
      throw e;
    }),
    e
  );
})();
exports._Promise = _Promise;
var _CompositedPromise = (function (e) {
  function t(t) {
    var o = e.call(this) || this;
    return (o._promises = t), o._init(), o;
  }
  return (
    __extends(t, e),
    (t.prototype._init = function () {
      var e = this;
      if (this._promises && this._promises.length) {
        var t = this._promises.length,
          o = 0,
          n = [],
          r = !1;
        this._promises.some(function (i) {
          return (
            i
              .then(function (i) {
                r || (n.push(i), ++o >= t && e.resolve(n));
              })
              .catch(function (t) {
                (r = !0), e.reject(t);
              }),
            r
          );
        });
      } else this.reject('No promises in current composited promise.');
    }),
    t
  );
})(_Promise);
exports._CompositedPromise = _CompositedPromise;
var _PaperKind;
!(function (e) {
  (e[(e.Custom = 0)] = 'Custom'),
    (e[(e.Letter = 1)] = 'Letter'),
    (e[(e.LetterSmall = 2)] = 'LetterSmall'),
    (e[(e.Tabloid = 3)] = 'Tabloid'),
    (e[(e.Ledger = 4)] = 'Ledger'),
    (e[(e.Legal = 5)] = 'Legal'),
    (e[(e.Statement = 6)] = 'Statement'),
    (e[(e.Executive = 7)] = 'Executive'),
    (e[(e.A3 = 8)] = 'A3'),
    (e[(e.A4 = 9)] = 'A4'),
    (e[(e.A4Small = 10)] = 'A4Small'),
    (e[(e.A5 = 11)] = 'A5'),
    (e[(e.B4 = 12)] = 'B4'),
    (e[(e.B5 = 13)] = 'B5'),
    (e[(e.Folio = 14)] = 'Folio'),
    (e[(e.Quarto = 15)] = 'Quarto'),
    (e[(e.Standard10x14 = 16)] = 'Standard10x14'),
    (e[(e.Standard11x17 = 17)] = 'Standard11x17'),
    (e[(e.Note = 18)] = 'Note'),
    (e[(e.Number9Envelope = 19)] = 'Number9Envelope'),
    (e[(e.Number10Envelope = 20)] = 'Number10Envelope'),
    (e[(e.Number11Envelope = 21)] = 'Number11Envelope'),
    (e[(e.Number12Envelope = 22)] = 'Number12Envelope'),
    (e[(e.Number14Envelope = 23)] = 'Number14Envelope'),
    (e[(e.CSheet = 24)] = 'CSheet'),
    (e[(e.DSheet = 25)] = 'DSheet'),
    (e[(e.ESheet = 26)] = 'ESheet'),
    (e[(e.DLEnvelope = 27)] = 'DLEnvelope'),
    (e[(e.C5Envelope = 28)] = 'C5Envelope'),
    (e[(e.C3Envelope = 29)] = 'C3Envelope'),
    (e[(e.C4Envelope = 30)] = 'C4Envelope'),
    (e[(e.C6Envelope = 31)] = 'C6Envelope'),
    (e[(e.C65Envelope = 32)] = 'C65Envelope'),
    (e[(e.B4Envelope = 33)] = 'B4Envelope'),
    (e[(e.B5Envelope = 34)] = 'B5Envelope'),
    (e[(e.B6Envelope = 35)] = 'B6Envelope'),
    (e[(e.ItalyEnvelope = 36)] = 'ItalyEnvelope'),
    (e[(e.MonarchEnvelope = 37)] = 'MonarchEnvelope'),
    (e[(e.PersonalEnvelope = 38)] = 'PersonalEnvelope'),
    (e[(e.USStandardFanfold = 39)] = 'USStandardFanfold'),
    (e[(e.GermanStandardFanfold = 40)] = 'GermanStandardFanfold'),
    (e[(e.GermanLegalFanfold = 41)] = 'GermanLegalFanfold'),
    (e[(e.IsoB4 = 42)] = 'IsoB4'),
    (e[(e.JapanesePostcard = 43)] = 'JapanesePostcard'),
    (e[(e.Standard9x11 = 44)] = 'Standard9x11'),
    (e[(e.Standard10x11 = 45)] = 'Standard10x11'),
    (e[(e.Standard15x11 = 46)] = 'Standard15x11'),
    (e[(e.InviteEnvelope = 47)] = 'InviteEnvelope'),
    (e[(e.LetterExtra = 50)] = 'LetterExtra'),
    (e[(e.LegalExtra = 51)] = 'LegalExtra'),
    (e[(e.TabloidExtra = 52)] = 'TabloidExtra'),
    (e[(e.A4Extra = 53)] = 'A4Extra'),
    (e[(e.LetterTransverse = 54)] = 'LetterTransverse'),
    (e[(e.A4Transverse = 55)] = 'A4Transverse'),
    (e[(e.LetterExtraTransverse = 56)] = 'LetterExtraTransverse'),
    (e[(e.APlus = 57)] = 'APlus'),
    (e[(e.BPlus = 58)] = 'BPlus'),
    (e[(e.LetterPlus = 59)] = 'LetterPlus'),
    (e[(e.A4Plus = 60)] = 'A4Plus'),
    (e[(e.A5Transverse = 61)] = 'A5Transverse'),
    (e[(e.B5Transverse = 62)] = 'B5Transverse'),
    (e[(e.A3Extra = 63)] = 'A3Extra'),
    (e[(e.A5Extra = 64)] = 'A5Extra'),
    (e[(e.B5Extra = 65)] = 'B5Extra'),
    (e[(e.A2 = 66)] = 'A2'),
    (e[(e.A3Transverse = 67)] = 'A3Transverse'),
    (e[(e.A3ExtraTransverse = 68)] = 'A3ExtraTransverse'),
    (e[(e.JapaneseDoublePostcard = 69)] = 'JapaneseDoublePostcard'),
    (e[(e.A6 = 70)] = 'A6'),
    (e[(e.JapaneseEnvelopeKakuNumber2 = 71)] = 'JapaneseEnvelopeKakuNumber2'),
    (e[(e.JapaneseEnvelopeKakuNumber3 = 72)] = 'JapaneseEnvelopeKakuNumber3'),
    (e[(e.JapaneseEnvelopeChouNumber3 = 73)] = 'JapaneseEnvelopeChouNumber3'),
    (e[(e.JapaneseEnvelopeChouNumber4 = 74)] = 'JapaneseEnvelopeChouNumber4'),
    (e[(e.LetterRotated = 75)] = 'LetterRotated'),
    (e[(e.A3Rotated = 76)] = 'A3Rotated'),
    (e[(e.A4Rotated = 77)] = 'A4Rotated'),
    (e[(e.A5Rotated = 78)] = 'A5Rotated'),
    (e[(e.B4JisRotated = 79)] = 'B4JisRotated'),
    (e[(e.B5JisRotated = 80)] = 'B5JisRotated'),
    (e[(e.JapanesePostcardRotated = 81)] = 'JapanesePostcardRotated'),
    (e[(e.JapaneseDoublePostcardRotated = 82)] =
      'JapaneseDoublePostcardRotated'),
    (e[(e.A6Rotated = 83)] = 'A6Rotated'),
    (e[(e.JapaneseEnvelopeKakuNumber2Rotated = 84)] =
      'JapaneseEnvelopeKakuNumber2Rotated'),
    (e[(e.JapaneseEnvelopeKakuNumber3Rotated = 85)] =
      'JapaneseEnvelopeKakuNumber3Rotated'),
    (e[(e.JapaneseEnvelopeChouNumber3Rotated = 86)] =
      'JapaneseEnvelopeChouNumber3Rotated'),
    (e[(e.JapaneseEnvelopeChouNumber4Rotated = 87)] =
      'JapaneseEnvelopeChouNumber4Rotated'),
    (e[(e.B6Jis = 88)] = 'B6Jis'),
    (e[(e.B6JisRotated = 89)] = 'B6JisRotated'),
    (e[(e.Standard12x11 = 90)] = 'Standard12x11'),
    (e[(e.JapaneseEnvelopeYouNumber4 = 91)] = 'JapaneseEnvelopeYouNumber4'),
    (e[(e.JapaneseEnvelopeYouNumber4Rotated = 92)] =
      'JapaneseEnvelopeYouNumber4Rotated'),
    (e[(e.Prc16K = 93)] = 'Prc16K'),
    (e[(e.Prc32K = 94)] = 'Prc32K'),
    (e[(e.Prc32KBig = 95)] = 'Prc32KBig'),
    (e[(e.PrcEnvelopeNumber1 = 96)] = 'PrcEnvelopeNumber1'),
    (e[(e.PrcEnvelopeNumber2 = 97)] = 'PrcEnvelopeNumber2'),
    (e[(e.PrcEnvelopeNumber3 = 98)] = 'PrcEnvelopeNumber3'),
    (e[(e.PrcEnvelopeNumber4 = 99)] = 'PrcEnvelopeNumber4'),
    (e[(e.PrcEnvelopeNumber5 = 100)] = 'PrcEnvelopeNumber5'),
    (e[(e.PrcEnvelopeNumber6 = 101)] = 'PrcEnvelopeNumber6'),
    (e[(e.PrcEnvelopeNumber7 = 102)] = 'PrcEnvelopeNumber7'),
    (e[(e.PrcEnvelopeNumber8 = 103)] = 'PrcEnvelopeNumber8'),
    (e[(e.PrcEnvelopeNumber9 = 104)] = 'PrcEnvelopeNumber9'),
    (e[(e.PrcEnvelopeNumber10 = 105)] = 'PrcEnvelopeNumber10'),
    (e[(e.Prc16KRotated = 106)] = 'Prc16KRotated'),
    (e[(e.Prc32KRotated = 107)] = 'Prc32KRotated'),
    (e[(e.Prc32KBigRotated = 108)] = 'Prc32KBigRotated'),
    (e[(e.PrcEnvelopeNumber1Rotated = 109)] = 'PrcEnvelopeNumber1Rotated'),
    (e[(e.PrcEnvelopeNumber2Rotated = 110)] = 'PrcEnvelopeNumber2Rotated'),
    (e[(e.PrcEnvelopeNumber3Rotated = 111)] = 'PrcEnvelopeNumber3Rotated'),
    (e[(e.PrcEnvelopeNumber4Rotated = 112)] = 'PrcEnvelopeNumber4Rotated'),
    (e[(e.PrcEnvelopeNumber5Rotated = 113)] = 'PrcEnvelopeNumber5Rotated'),
    (e[(e.PrcEnvelopeNumber6Rotated = 114)] = 'PrcEnvelopeNumber6Rotated'),
    (e[(e.PrcEnvelopeNumber7Rotated = 115)] = 'PrcEnvelopeNumber7Rotated'),
    (e[(e.PrcEnvelopeNumber8Rotated = 116)] = 'PrcEnvelopeNumber8Rotated'),
    (e[(e.PrcEnvelopeNumber9Rotated = 117)] = 'PrcEnvelopeNumber9Rotated'),
    (e[(e.PrcEnvelopeNumber10Rotated = 118)] = 'PrcEnvelopeNumber10Rotated');
})((_PaperKind = exports._PaperKind || (exports._PaperKind = {})));
var QueryLoadingDataEventArgs = (function (e) {
  function t(t) {
    var o = e.call(this) || this;
    return (o._data = t || {}), o;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'data', {
      get: function () {
        return this._data;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.EventArgs);
exports.QueryLoadingDataEventArgs = QueryLoadingDataEventArgs;
var _Report = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    return (
      (o._hasParameters = !1),
      (o._status = _ExecutionStatus.notFound),
      (o.statusChanged = new wjcCore.Event()),
      o
    );
  }
  return (
    __extends(t, e),
    (t.getReportNames = function (e, t) {
      return _ReportService.getReportNames(e, t);
    }),
    (t.getReports = function (e, t, o) {
      return (
        wjcCore.isBoolean(o) && (o = { recursive: o }),
        _ReportService.getReports(e, t, o)
      );
    }),
    Object.defineProperty(t.prototype, 'reportName', {
      get: function () {
        return this._innerService ? this._innerService.reportName : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'hasParameters', {
      get: function () {
        return this._hasParameters;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'status', {
      get: function () {
        return this._status;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.load = function () {
      return e.prototype.load.call(this);
    }),
    (t.prototype._updateStatus = function (e) {
      this._status !== e && ((this._status = e), this.onStatusChanged());
    }),
    (t.prototype.cancel = function () {
      var e = this;
      return this._innerService.cancel().then(function (t) {
        return e._updateDocumentStatus(t);
      });
    }),
    (t.prototype.onStatusChanged = function (e) {
      this.statusChanged.raise(this, e || new wjcCore.EventArgs());
    }),
    (t.prototype.dispose = function () {
      return e.prototype.dispose.call(this);
    }),
    (t.prototype.setParameters = function (e) {
      var t = this;
      return this._innerService.setParameters(e).then(function (e) {
        return void (t._parameters = e);
      });
    }),
    (t.prototype.getParameters = function () {
      var e = this;
      if (this._parameters && this._parameters.length) {
        var t = new _Promise();
        return t.resolve(this._parameters), t;
      }
      return this._innerService.getParameters().then(function (t) {
        return void (e._parameters = t);
      });
    }),
    (t.prototype._getIsDisposed = function () {
      return (
        e.prototype._getIsDisposed.call(this) || this._innerService.isCleared
      );
    }),
    (t.prototype._updateExecutionInfo = function (t) {
      null == t ||
        this.isDisposed ||
        ((this._hasParameters = !!t.hasParameters),
        e.prototype._updateExecutionInfo.call(this, t));
    }),
    (t.prototype._updateDocumentStatus = function (t) {
      this._updateStatus(t.status),
        e.prototype._updateDocumentStatus.call(this, t);
    }),
    (t.prototype._checkIsLoadCompleted = function (e) {
      return (
        e.status === _ExecutionStatus.completed ||
        e.status === _ExecutionStatus.stopped
      );
    }),
    (t.prototype._createDocumentService = function (e) {
      return new _ReportService(e);
    }),
    Object.defineProperty(t.prototype, '_innerService', {
      get: function () {
        return this.service;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.render = function () {
      var e = this;
      return this._innerService.render().then(function (t) {
        return e._updateDocumentStatus(t);
      });
    }),
    (t.prototype.executeCustomAction = function (e) {
      var t = this;
      return this._innerService.executeCustomAction(e).then(function (e) {
        return t._updateDocumentStatus(e);
      });
    }),
    t
  );
})(_DocumentSource);
exports._Report = _Report;
var _ReportService = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    return (o._reportName = t.reportName), o;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'isCleared', {
      get: function () {
        return !this._instanceId && this._status == _ExecutionStatus.cleared;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.getReportNames = function (e, o) {
      return t.getReports(e, o).then(function (e) {
        if (!e) return null;
        var t = [];
        return (
          e.items.forEach(function (e) {
            e.type === CatalogItemType.Report && t.push(e.name);
          }),
          t
        );
      });
    }),
    (t.getReports = function (e, t, o) {
      var n = new _Promise();
      return (
        _httpRequest(_joinUrl(e, t), {
          data: o,
          success: function (e) {
            n.resolve(JSON.parse(e.responseText));
          },
          error: function (e) {
            return n.reject(e);
          },
        }),
        n
      );
    }),
    Object.defineProperty(t.prototype, 'reportName', {
      get: function () {
        return this._reportName;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getBookmark = function (e) {
      var o = new _Promise();
      return this._checkReportInstanceController(o)
        ? (_httpRequest(this._getReportInstancesUrl(t._bookmarkAction, e), {
            success: function (e) {
              o.resolve(JSON.parse(e.responseText));
            },
          }),
          o)
        : o;
    }),
    (t.prototype.executeCustomAction = function (e) {
      var o = {};
      return (o[t._customActionParam] = e), this.render(o);
    }),
    (t.prototype.getStatus = function () {
      var e = new _Promise();
      return (
        _httpRequest(this._statusLocation, {
          success: function (t) {
            e.resolve(JSON.parse(t.responseText, _statusJsonReviver));
          },
        }),
        e
      );
    }),
    (t.prototype.getDocumentStatus = function () {
      return this._getReportCache();
    }),
    (t.prototype._getReportCache = function () {
      var e = new _Promise();
      return this._checkReportInstanceController(e)
        ? (_httpRequest(this._getReportInstancesUrl(), {
            success: function (t) {
              e.resolve(_parseReportExecutionInfo(t.responseText));
            },
          }),
          e)
        : e;
    }),
    (t.prototype.getParameters = function () {
      var e = new _Promise();
      return this._checkReportInstanceController(e)
        ? (_httpRequest(this._getReportInstancesUrl(t._parametersAction), {
            success: function (t) {
              e.resolve(JSON.parse(t.responseText));
            },
          }),
          e)
        : e;
    }),
    (t.prototype._getUrlMainPart = function () {
      return _joinUrl(this.serviceUrl, this.filePath, this.reportName);
    }),
    (t.prototype._getReportUrl = function () {
      for (var e = [], o = 0; o < arguments.length; o++) e[o] = arguments[o];
      return _joinUrl(this._getUrlMainPart(), t._reportCommand, e);
    }),
    (t.prototype._getReportInstancesUrl = function () {
      for (var e = [], o = 0; o < arguments.length; o++) e[o] = arguments[o];
      return _joinUrl(
        this._getUrlMainPart(),
        t._instancesCommand,
        this._instanceId,
        e
      );
    }),
    (t.prototype._checkReportController = function (e) {
      return (
        !(
          null == this.serviceUrl ||
          !this.filePath ||
          !(
            ('.flxr' !== this.filePath.slice(-5).toLowerCase() &&
              '.xml' !== this.filePath.slice(-4).toLowerCase()) ||
            this.reportName
          )
        ) || (e && e.reject(t._invalidReportControllerError), !1)
      );
    }),
    (t.prototype._checkReportInstanceController = function (e) {
      return (
        !(!this._checkReportController(e) || !this._instanceId) ||
        (e && e.reject(t._invalidReportCacheControllerError), !1)
      );
    }),
    (t.prototype._getError = function (e) {
      var t = e.responseText;
      try {
        t && (t = JSON.parse(t));
      } finally {
        return t;
      }
    }),
    (t.prototype.render = function (e) {
      var o = this,
        n = new _Promise();
      return this._checkReportInstanceController(n)
        ? (_httpRequest(this._getReportInstancesUrl(t._renderAction), {
            method: 'POST',
            data: e,
            success: function (e) {
              202 === e.status
                ? n.resolve({
                    status: _ExecutionStatus.rendering,
                  })
                : n.resolve(_parseReportExecutionInfo(e.responseText));
            },
            error: function (e) {
              n.reject(o._getError(e));
            },
          }),
          n.then(function (e) {
            o._status = e.status;
          }))
        : n;
    }),
    (t.prototype.load = function (e) {
      var t = this,
        o = new _Promise();
      return this._checkReportController(o)
        ? (_httpRequest(this._getReportInstancesUrl(), {
            method: 'POST',
            data: e,
            success: function (e) {
              o.resolve(_parseReportExecutionInfo(e.responseText));
            },
            error: function (e) {
              o.reject(t._getError(e));
            },
          }),
          o.then(function (e) {
            (t._instanceId = e.id),
              (t._status = _ExecutionStatus.loaded),
              (t._outlinesLocation = e.outlinesLocation),
              (t._statusLocation = e.statusLocation),
              (t._pageSettingsLocation = e.pageSettingsLocation),
              (t._featuresLocation = e.featuresLocation),
              (t._parametersLocation = e.parametersLocation);
          }))
        : o;
    }),
    (t.prototype.cancel = function () {
      var e = this,
        o = new _Promise();
      return this._checkReportInstanceController(o)
        ? this._status !== _ExecutionStatus.rendering
          ? (o.reject(
              'Cannot execute cancel when the report is not rendering.'
            ),
            o)
          : (_httpRequest(this._getReportInstancesUrl(t._cancelAction), {
              method: 'POST',
              success: function (e) {
                o.resolve(_parseReportExecutionInfo(e.responseText));
              },
            }),
            o.then(function (t) {
              return void (e._status = t.status);
            }),
            o)
        : o;
    }),
    (t.prototype.dispose = function () {
      var e = this,
        t = new _Promise();
      return this._checkReportInstanceController()
        ? (_httpRequest(this._getReportInstancesUrl(), {
            method: 'DELETE',
            success: function (o) {
              (e._status = _ExecutionStatus.cleared),
                (e._instanceId = ''),
                t.resolve();
            },
          }),
          t)
        : t;
    }),
    (t.prototype.getOutlines = function () {
      var e = new _Promise();
      return this._checkReportInstanceController(e)
        ? (_httpRequest(this._getReportInstancesUrl(t._outlinesAction), {
            success: function (t) {
              e.resolve(JSON.parse(t.responseText));
            },
          }),
          e)
        : e;
    }),
    (t.prototype.renderToFilter = function (e) {
      var t = this,
        o = new _Promise();
      return this._checkReportInstanceController(o)
        ? (_httpRequest(this.getRenderToFilterUrl(e), {
            cache: !0,
            success: function (e) {
              o.resolve(e);
            },
            error: function (e) {
              o.reject(t._getError(e));
            },
          }),
          o)
        : o;
    }),
    (t.prototype.getRenderToFilterUrl = function (e) {
      if (!this._checkReportInstanceController()) return null;
      var o = this._getReportInstancesUrl(t._exportAction);
      return (o = _disableCache(o)), _appendQueryString(o, e);
    }),
    (t.prototype.search = function (e) {
      var o = new _Promise();
      return this._checkReportInstanceController(o)
        ? (_httpRequest(this._getReportInstancesUrl(t._searchAction), {
            success: function (e) {
              o.resolve(JSON.parse(e.responseText));
            },
            data: e,
          }),
          o)
        : o;
    }),
    (t.prototype.setPageSettings = function (e) {
      var o = this,
        n = new _Promise();
      return this._checkReportInstanceController(n)
        ? (_httpRequest(this._getReportInstancesUrl(t._pageSettingsAction), {
            method: 'PUT',
            data: e,
            success: function (e) {
              n.resolve(JSON.parse(e.responseText, _pageSettingsJsonReviver));
            },
            error: function (e) {
              n.reject(o._getError(e));
            },
          }),
          n)
        : n;
    }),
    (t.prototype.setParameters = function (e) {
      var o = this,
        n = new _Promise();
      return this._checkReportInstanceController(n)
        ? (Object.keys(e).forEach(function (t) {
            null === e[t] && (e[t] = '');
          }),
          _httpRequest(this._getReportInstancesUrl(t._parametersAction), {
            method: 'PATCH',
            data: e,
            success: function (e) {
              n.resolve(JSON.parse(e.responseText));
            },
            error: function (e) {
              n.reject(o._getError(e));
            },
          }),
          n)
        : n;
    }),
    (t.prototype.getSupportedExportDescriptions = function () {
      var e = new _Promise();
      return this._checkReportInstanceController(e)
        ? (_httpRequest(
            this._getReportInstancesUrl(t._supportedFormatsAction),
            {
              success: function (t) {
                e.resolve(JSON.parse(t.responseText));
              },
            }
          ),
          e)
        : e;
    }),
    (t.prototype.getFeatures = function () {
      var e = new _Promise();
      return this._checkReportInstanceController(e)
        ? (_httpRequest(this._featuresLocation, {
            success: function (t) {
              e.resolve(JSON.parse(t.responseText));
            },
          }),
          e)
        : e;
    }),
    (t._reportCommand = '$report'),
    (t._instancesCommand = '$instances'),
    (t._customActionParam = 'actionString'),
    (t._renderAction = 'render'),
    (t._searchAction = 'search'),
    (t._cancelAction = 'stop'),
    (t._outlinesAction = 'outlines'),
    (t._exportAction = 'export'),
    (t._parametersAction = 'parameters'),
    (t._bookmarkAction = 'bookmarks'),
    (t._pageSettingsAction = 'pagesettings'),
    (t._supportedFormatsAction = 'supportedformats'),
    (t._invalidReportControllerError =
      'Cannot call the service without service url, document path or report name.'),
    (t._invalidReportCacheControllerError =
      'Cannot call the service when service url is not set or the report is not loaded.'),
    t
  );
})(_DocumentService);
(exports._ReportService = _ReportService),
  (exports._parseReportExecutionInfo = _parseReportExecutionInfo);
var _ExecutionStatus = (function () {
  function e() {}
  return (
    (e.loaded = 'Loaded'),
    (e.rendering = 'Rendering'),
    (e.completed = 'Completed'),
    (e.stopped = 'Stopped'),
    (e.cleared = 'Cleared'),
    (e.notFound = 'NotFound'),
    e
  );
})();
exports._ExecutionStatus = _ExecutionStatus;
var _ParameterType;
!(function (e) {
  (e[(e.Boolean = 0)] = 'Boolean'),
    (e[(e.DateTime = 1)] = 'DateTime'),
    (e[(e.Time = 2)] = 'Time'),
    (e[(e.Date = 3)] = 'Date'),
    (e[(e.Integer = 4)] = 'Integer'),
    (e[(e.Float = 5)] = 'Float'),
    (e[(e.String = 6)] = 'String');
})((_ParameterType = exports._ParameterType || (exports._ParameterType = {})));
var CatalogItemType;
!(function (e) {
  (e[(e.Folder = 0)] = 'Folder'),
    (e[(e.File = 1)] = 'File'),
    (e[(e.Report = 2)] = 'Report');
})(
  (CatalogItemType = exports.CatalogItemType || (exports.CatalogItemType = {}))
);
var _PdfDocumentSource = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    return (o._status = _ExecutionStatus.notFound), o;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'status', {
      get: function () {
        return this._status;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_innerService', {
      get: function () {
        return this.service;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._createDocumentService = function (e) {
      return new _PdfDocumentService(e);
    }),
    (t.prototype.load = function () {
      return e.prototype.load.call(this);
    }),
    (t.prototype._updateStatus = function (e) {
      this._status !== e && (this._status = e);
    }),
    (t.prototype.getStatus = function () {
      var e = this,
        t = new QueryLoadingDataEventArgs();
      return (
        this.onQueryLoadingData(t),
        this._innerService.getStatus(t.data).then(function (t) {
          return e._updateDocumentStatus(t);
        })
      );
    }),
    (t.prototype.renderToFilter = function (e) {
      var t = new QueryLoadingDataEventArgs();
      return (
        this.onQueryLoadingData(t), this._innerService.renderToFilter(e, t.data)
      );
    }),
    (t.prototype._updateDocumentStatus = function (t) {
      null != t &&
        (this._updateStatus(t.status),
        e.prototype._updateDocumentStatus.call(this, t));
    }),
    t
  );
})(_DocumentSource);
exports._PdfDocumentSource = _PdfDocumentSource;
var _PdfDocumentService = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._getPdfUrl = function () {
      for (var e = [], o = 0; o < arguments.length; o++) e[o] = arguments[o];
      return _joinUrl(this.serviceUrl, this.filePath, t._pdfCommand, e);
    }),
    (t.prototype._getPdfStatus = function (e) {
      var t = this,
        o = new _Promise();
      return this._checkPdfController(o)
        ? (_httpRequest(this._getPdfUrl(), {
            data: e,
            success: function (e) {
              o.resolve(_parseExecutionInfo(e.responseText));
            },
          }),
          o.then(function (e) {
            (t._status = _ExecutionStatus.loaded),
              (t._statusLocation = e.statusLocation),
              (t._featuresLocation = e.featuresLocation);
          }))
        : o;
    }),
    (t.prototype._checkPdfController = function (e) {
      return (
        !(null == this.serviceUrl || !this.filePath) ||
        (e && e.reject(t._invalidPdfControllerError), !1)
      );
    }),
    (t.prototype.dispose = function () {
      var e = new _Promise();
      return e.resolve(), e;
    }),
    (t.prototype.load = function (e) {
      return this._getPdfStatus(e);
    }),
    (t.prototype.getStatus = function (e) {
      var t = new _Promise();
      return (
        _httpRequest(this._statusLocation, {
          data: e,
          success: function (e) {
            t.resolve(JSON.parse(e.responseText));
          },
        }),
        t
      );
    }),
    (t.prototype.renderToFilter = function (e, t) {
      var o = new _Promise();
      return this._checkPdfController(o)
        ? (_httpRequest(this.getRenderToFilterUrl(e), {
            data: t,
            cache: !0,
            success: function (e) {
              o.resolve(e);
            },
          }),
          o)
        : o;
    }),
    (t.prototype.getRenderToFilterUrl = function (e) {
      if (!this._checkPdfController()) return null;
      var o = this._getPdfUrl(t._exportAction);
      return (o = _disableCache(o)), _appendQueryString(o, e);
    }),
    (t.prototype.getSupportedExportDescriptions = function () {
      var e = new _Promise();
      return this._checkPdfController(e)
        ? (_httpRequest(this._getPdfUrl(t._supportedFormatsAction), {
            success: function (t) {
              e.resolve(JSON.parse(t.responseText));
            },
          }),
          e)
        : e;
    }),
    (t.prototype.getFeatures = function () {
      var e = new _Promise();
      return this._checkPdfController(e)
        ? (_httpRequest(this._featuresLocation, {
            success: function (t) {
              e.resolve(JSON.parse(t.responseText));
            },
          }),
          e)
        : e;
    }),
    (t.prototype.search = function (e) {
      var o = new _Promise();
      return this._checkPdfController(o)
        ? (_httpRequest(this._getPdfUrl(t._searchAction), {
            success: function (e) {
              o.resolve(JSON.parse(e.responseText));
            },
            data: e,
          }),
          o)
        : o;
    }),
    (t._pdfCommand = '$pdf'),
    (t._exportAction = 'export'),
    (t._supportedFormatsAction = 'supportedformats'),
    (t._searchAction = 'search'),
    (t._invalidPdfControllerError =
      'Cannot call the service when service url is not set or the pdf is not loaded.'),
    t
  );
})(_DocumentService);
(exports._PdfDocumentService = _PdfDocumentService),
  (exports._parseExecutionInfo = _parseExecutionInfo),
  (wjcCore.culture.Viewer = window.wijmo.culture.Viewer || {
    cancel: 'Cancel',
    ok: 'OK',
    bottom: 'Bottom:',
    top: 'Top:',
    right: 'Right:',
    left: 'Left:',
    margins: 'Margins(inches)',
    orientation: 'Orientation:',
    paperKind: 'Paper Kind:',
    pageSetup: 'Page Setup',
    landscape: 'Landscape',
    portrait: 'Portrait',
    pageNumber: 'Page Number',
    zoomFactor: 'Zoom Factor',
    paginated: 'Print Layout',
    print: 'Print',
    search: 'Search',
    matchCase: 'Match case',
    wholeWord: 'Match whole word only',
    searchResults: 'Search Results',
    previousPage: 'Previous Page',
    nextPage: 'Next Page',
    firstPage: 'First Page',
    lastPage: 'Last Page',
    backwardHistory: 'Backward',
    forwardHistory: 'Forward',
    pageCount: 'Page Count',
    selectTool: 'Select Tool',
    moveTool: 'Move Tool',
    continuousMode: 'Continuous Page View',
    singleMode: 'Single Page View',
    wholePage: 'Fit Whole Page',
    pageWidth: 'Fit Page Width',
    zoomOut: 'Zoom Out',
    zoomIn: 'Zoom In',
    rubberbandTool: 'Zoom by Selection',
    magnifierTool: 'Magnifier',
    rotatePage: 'Rotate Page',
    rotateDocument: 'Rotate Document',
    exports: 'Export',
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    hamburgerMenu: 'Tools',
    showSearchBar: 'Show Search Bar',
    viewMenu: 'Layout Options',
    searchOptions: 'Search Options',
    matchCaseMenuItem: 'Match Case',
    wholeWordMenuItem: 'Match Whole Word',
    thumbnails: 'Page Thumbnails',
    outlines: 'Document Map',
    loading: 'Loading...',
    pdfExportName: 'Adobe PDF',
    docxExportName: 'Open XML Word',
    xlsxExportName: 'Open XML Excel',
    docExportName: 'Microsoft Word',
    xlsExportName: 'Microsoft Excel',
    mhtmlExportName: 'Web archive (MHTML)',
    htmlExportName: 'HTML document',
    rtfExportName: 'RTF document',
    metafileExportName: 'Compressed metafiles',
    csvExportName: 'CSV',
    tiffExportName: 'Tiff images',
    bmpExportName: 'BMP images',
    emfExportName: 'Enhanced metafile',
    gifExportName: 'GIF images',
    jpgExportName: 'JPEG images',
    jpegExportName: 'JPEG images',
    pngExportName: 'PNG images',
    abstractMethodException: 'It is an abstract method, please implement it.',
    cannotRenderPageNoViewPage:
      'Cannot render page without document source and view page.',
    cannotRenderPageNoDoc:
      'Cannot render page without document source and view page.',
    exportFormat: 'Export format:',
    exportOptionTitle: 'Export options',
    documentRestrictionsGroup: 'Document restrictions',
    passwordSecurityGroup: 'Password security',
    outputRangeGroup: 'Output range',
    documentInfoGroup: 'Document info',
    generalGroup: 'General',
    docInfoTitle: 'Title',
    docInfoAuthor: 'Author',
    docInfoManager: 'Manager',
    docInfoOperator: 'Operator',
    docInfoCompany: 'Company',
    docInfoSubject: 'Subject',
    docInfoComment: 'Comment',
    docInfoCreator: 'Creator',
    docInfoProducer: 'Producer',
    docInfoCreationTime: 'Creation time',
    docInfoRevisionTime: 'Revision time',
    docInfoKeywords: 'Keywords',
    embedFonts: 'Embed TrueType fonts',
    pdfACompatible: 'PDF/A compatible (level 2B)',
    useCompression: 'Use compression',
    useOutlines: 'Generate outlines',
    allowCopyContent: 'Allow content copying or extraction',
    allowEditAnnotations: 'Allow annotations editing',
    allowEditContent: 'Allow content editing',
    allowPrint: 'Allow printing',
    ownerPassword: 'Permissions (owner) password:',
    userPassword: 'Document open (user) password:',
    encryptionType: 'Encryption level:',
    paged: 'Paged',
    showNavigator: 'Show Navigator',
    navigatorPosition: 'Navigator Position',
    singleFile: 'Single File',
    tolerance: 'Tolerance when detecting text bounds (points):',
    pictureLayer: 'Use separate picture layer',
    metafileType: 'Metafile Type:',
    monochrome: 'Monochrome',
    resolution: 'Resolution:',
    outputRange: 'Page range:',
    outputRangeInverted: 'Inverted',
    showZoomBar: 'Zoom Bar',
    searchPrev: 'Search Previous',
    searchNext: 'Search Next',
    checkMark: '✓',
    exportOk: 'Export...',
    cannotSearch: 'Search requires a document source to be specified.',
    parameters: 'Parameters',
    requiringParameters: 'Please input parameters.',
    nullParameterError: 'Value cannot be null.',
    invalidParameterError: 'Invalid input.',
    parameterNoneItemsSelected: '(none)',
    parameterAllItemsSelected: '(all)',
    parameterSelectAllItemText: '(Select All)',
    selectParameterValue: '(select value)',
    apply: 'Apply',
    errorOccured: 'An error has occured.',
  });
var _SearchManager = (function () {
  function e() {
    (this._currentIndex = -1),
      (this.currentChanged = new wjcCore.Event()),
      (this.searchStarted = new wjcCore.Event()),
      (this.searchCompleted = new wjcCore.Event());
  }
  return (
    (e.prototype._onCurrentChanged = function () {
      this.currentChanged.raise(this, new wjcCore.EventArgs());
    }),
    (e.prototype._onSearchStarted = function () {
      this.searchStarted.raise(this, new wjcCore.EventArgs());
    }),
    (e.prototype._onSearchCompleted = function () {
      this.searchCompleted.raise(this, new wjcCore.EventArgs());
    }),
    Object.defineProperty(e.prototype, 'text', {
      get: function () {
        return this._text;
      },
      set: function (e) {
        this._text !== e && ((this._text = e), (this._needUpdate = !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'matchCase', {
      get: function () {
        return this._matchCase;
      },
      set: function (e) {
        this._matchCase !== e &&
          ((this._matchCase = e), (this._needUpdate = !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'wholeWord', {
      get: function () {
        return this._wholeWord;
      },
      set: function (e) {
        this._wholeWord !== e &&
          ((this._wholeWord = e), (this._needUpdate = !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'searchResults', {
      get: function () {
        return this._searchResults;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'currentIndex', {
      get: function () {
        return this._currentIndex;
      },
      set: function (e) {
        var t = this;
        e !== this._currentIndex &&
          this._getSearchResults().then(function (o) {
            (t._currentIndex = e), t._onCurrentChanged();
          });
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'current', {
      get: function () {
        return this._currentIndex < 0
          ? null
          : this._searchResults[this._currentIndex];
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._clearResults = function () {
      this._searchResults = null;
    }),
    (e.prototype._getSearchResults = function () {
      var e = this,
        t = new _Promise();
      return this._searchResults
        ? (t.resolve(this._searchResults), t)
        : this.documentSource
        ? null == this._text || 0 === this._text.length
          ? t
          : ((this._needUpdate = !1),
            this._onSearchStarted(),
            this.documentSource
              .search({
                text: encodeURIComponent(this.text),
                matchCase: this.matchCase,
                wholeWord: this.wholeWord,
              })
              .then(function (t) {
                (e._searchResults = t), e._onSearchCompleted();
              }))
        : (t.reject(wjcCore.culture.Viewer.cannotSearch), t);
    }),
    Object.defineProperty(e.prototype, 'documentSource', {
      get: function () {
        return this._documentSource;
      },
      set: function (e) {
        (this._documentSource = e),
          this._clearResults(),
          (this._text = null),
          (this._matchCase = !1),
          (this._wholeWord = !1),
          (this._currentIndex = -1);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.search = function (e) {
      var t = this;
      this._needUpdate && this._clearResults(),
        this._getSearchResults().then(function (o) {
          var n = t._searchResults.length;
          e
            ? (t._currentIndex--,
              t._currentIndex < 0 && (t._currentIndex = n - 1))
            : (t._currentIndex++,
              t._currentIndex >= n && (t._currentIndex = 0)),
            (t._currentIndex = Math.max(Math.min(t._currentIndex, n - 1), 0)),
            t._onCurrentChanged();
        });
    }),
    e
  );
})();
(exports._SearchManager = _SearchManager),
  (window.TouchEvent = window.TouchEvent || function () {}),
  (window.PointerEvent = window.PointerEvent || function () {}),
  (window.Touch = window.Touch || function () {});
var _eventSeparator = ',',
  _touchEventsMap = {
    startName: 'touchstart',
    moveName: 'touchmove',
    endName: ['touchend', 'touchcancel', 'touchleave'].join(_eventSeparator),
  },
  _pointerEventsMap = {
    startName: ['pointerdown', 'pointerenter'].join(_eventSeparator),
    moveName: 'pointermove',
    endName: ['pointerup', 'pointercancel', 'pointerleave'].join(
      _eventSeparator
    ),
  };
exports._getTouchEventMap = _getTouchEventMap;
var _TouchDirection;
!(function (e) {
  (e[(e.None = 0)] = 'None'),
    (e[(e.Left = 1)] = 'Left'),
    (e[(e.Up = 2)] = 'Up'),
    (e[(e.Right = 3)] = 'Right'),
    (e[(e.Down = 4)] = 'Down');
})(
  (_TouchDirection = exports._TouchDirection || (exports._TouchDirection = {}))
);
var _TouchInfo = (function () {
  function e(e) {
    (this._systemTouchInfo = e),
      e instanceof Touch ? (this._id = e.identifier) : (this._id = e.pointerId),
      (this._target = e.target),
      (this._screenX = e.screenX),
      (this._screenY = e.screenY),
      (this._clientX = e.clientX),
      (this._clientY = e.clientY);
  }
  return (
    (e.getCenter = function (e, t) {
      return new wjcCore.Point(e.x + (t.x - e.x) / 2, e.y + (t.y - e.y) / 2);
    }),
    (e.getCenterClient = function (t, o) {
      return e.getCenter(
        new wjcCore.Point(t.clientX, t.clientY),
        new wjcCore.Point(o.clientX, o.clientY)
      );
    }),
    (e.getCenterScreen = function (t, o) {
      return e.getCenter(
        new wjcCore.Point(t.screenX, t.screenY),
        new wjcCore.Point(o.screenX, o.screenY)
      );
    }),
    (e.getDistance = function (e, t) {
      var o = Math.abs(e.clientX - t.clientX),
        n = Math.abs(e.clientY - t.clientY);
      return Math.sqrt(o * o + n * n);
    }),
    (e._getDirection = function (e, t) {
      var o = t.clientX - e.clientX,
        n = t.clientY - e.clientY;
      return Math.abs(o) >= Math.abs(n)
        ? o > 0
          ? _TouchDirection.Right
          : o < 0
          ? _TouchDirection.Left
          : _TouchDirection.None
        : n > 0
        ? _TouchDirection.Down
        : n < 0
        ? _TouchDirection.Up
        : _TouchDirection.None;
    }),
    Object.defineProperty(e.prototype, 'id', {
      get: function () {
        return this._id;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'systemTouchInfo', {
      get: function () {
        return this._systemTouchInfo;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'screenX', {
      get: function () {
        return this._screenX;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'screenY', {
      get: function () {
        return this._screenY;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'clientX', {
      get: function () {
        return this._clientX;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'clientY', {
      get: function () {
        return this._clientY;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})();
exports._TouchInfo = _TouchInfo;
var _SpeedReducer = (function () {
  function e() {
    (this._timeInterval = 50), (this._speedInterval = 5);
  }
  return (
    Object.defineProperty(e.prototype, 'timeInterval', {
      get: function () {
        return this._timeInterval;
      },
      set: function (e) {
        this._timeInterval = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'speedInterval', {
      get: function () {
        return this._speedInterval;
      },
      set: function (e) {
        this._speedInterval = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.stop = function () {
      null != this._timer && (clearInterval(this._timer), (this._timer = null));
    }),
    (e.prototype.start = function (e, t, o) {
      var n = this;
      if ((this.stop(), o)) {
        var r = e >= 0 ? 1 : -1,
          i = t >= 0 ? 1 : -1,
          a = Math.abs(e * this._timeInterval),
          s = Math.abs(t * this._timeInterval),
          c = Math.max(a, s),
          u = Math.floor(c / this.speedInterval),
          l = Math.floor(a / u),
          p = Math.floor(s / u);
        this._timer = setInterval(function () {
          (a -= l),
            (s -= p),
            (a = Math.max(0, a)),
            (s = Math.max(0, s)),
            a && s ? o(a * r, s * i) : n.stop();
        }, this._timeInterval);
      }
    }),
    e
  );
})();
exports._SpeedReducer = _SpeedReducer;
var _TouchEventType;
!(function (e) {
  (e[(e.Start = 0)] = 'Start'),
    (e[(e.Move = 1)] = 'Move'),
    (e[(e.End = 2)] = 'End');
})(
  (_TouchEventType = exports._TouchEventType || (exports._TouchEventType = {}))
);
var _TouchEventArgs = (function (e) {
  function t(o) {
    var n = e.call(this) || this;
    return o instanceof t
      ? ((n._systemEvent = o.systemEvent),
        (n._type = o.type),
        (n._touchInfos = o.touchInfos),
        n)
      : ((n._systemEvent = o),
        _TouchManager._registerTouchInfo(o),
        (n._type = _TouchManager._isTouchStart(o.type)
          ? _TouchEventType.Start
          : _TouchManager._isTouchEnd(o.type)
          ? _TouchEventType.End
          : _TouchEventType.Move),
        (n._touchInfos = _TouchManager._allTouchInfos
          ? _TouchManager._allTouchInfos.slice()
          : []),
        n);
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'timeStamp', {
      get: function () {
        return this.systemEvent.timeStamp;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'touchInfos', {
      get: function () {
        return this._touchInfos;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'systemEvent', {
      get: function () {
        return this._systemEvent;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'target', {
      get: function () {
        return this.systemEvent.target;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'currentTarget', {
      get: function () {
        return this.systemEvent.currentTarget;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'type', {
      get: function () {
        return this._type;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pointersCount', {
      get: function () {
        return this.touchInfos.length;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'cancelBubble', {
      get: function () {
        return this._systemEvent.cancelBubble;
      },
      set: function (e) {
        this._systemEvent.cancelBubble = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.preventDefault = function () {
      this._systemEvent.preventDefault();
    }),
    t
  );
})(wjcCore.EventArgs);
exports._TouchEventArgs = _TouchEventArgs;
var _TouchEvent = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.raise = function (t, o) {
      e.prototype.raise.call(this, t, o);
    }),
    t
  );
})(wjcCore.Event);
exports._TouchEvent = _TouchEvent;
var _TouchTrigger = (function () {
  function e(t) {
    var o = this;
    (this.touchMove = new _TouchEvent()),
      (this.touchStart = new _TouchEvent()),
      (this.touchEnd = new _TouchEvent());
    var n = wjcCore.getElement(t);
    this._element = n;
    var r = e.getTrigger(n);
    if (r) {
      var i = this._onTouchEvent.bind(this);
      return (
        r.touchMove.addHandler(i),
        r.touchStart.addHandler(i),
        r.touchEnd.addHandler(i),
        void (this._disposeAction = function () {
          r.touchMove.removeHandler(i),
            r.touchStart.removeHandler(i),
            r.touchEnd.removeHandler(i),
            (o._disposeAction = null);
        })
      );
    }
    var a = _getTouchEventMap(),
      s = this._onSystemTouchEvent.bind(this);
    _addEvent(n, a.startName, s),
      _addEvent(n, a.moveName, s),
      _addEvent(n, a.endName, s),
      e.bindElement(n, this),
      (this._disposeAction = function () {
        _removeEvent(n, a.startName, s),
          _removeEvent(n, a.moveName, s),
          _removeEvent(n, a.endName, s),
          e.unbindElement(n),
          (o._disposeAction = null);
      });
  }
  return (
    (e.bindElement = function (t, o) {
      if (t[e._elementDataName])
        throw 'Cannot bind multi _TouchTrigger on the same element.';
      t[e._elementDataName] = o;
    }),
    (e.unbindElement = function (t) {
      t[e._elementDataName] = null;
    }),
    (e.getTrigger = function (t) {
      return t[e._elementDataName];
    }),
    (e.prototype._onSystemTouchEvent = function (e) {
      var t = this._createTouchEventArgs(e);
      t && this._onTouchEvent(this, t);
    }),
    (e.prototype._createTouchEventArgs = function (e) {
      return _TouchManager._isTouchEvent(e) ? new _TouchEventArgs(e) : null;
    }),
    (e.prototype.dispose = function () {
      this._disposeAction && this._disposeAction();
    }),
    Object.defineProperty(e.prototype, 'hostElement', {
      get: function () {
        return this._element;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._onTouchEvent = function (e, t) {
      switch (t.type) {
        case _TouchEventType.Start:
          return void this.onTouchStart(t);
        case _TouchEventType.Move:
          return void this.onTouchMove(t);
        case _TouchEventType.End:
          this.onTouchEnd(t);
      }
    }),
    (e.prototype.onTouchEnd = function (e) {
      this.touchEnd.raise(this, e);
    }),
    (e.prototype.onTouchStart = function (e) {
      this.touchStart.raise(this, e);
    }),
    (e.prototype.onTouchMove = function (e) {
      this.touchMove.raise(this, e);
    }),
    (e._elementDataName = '__wjTouchTrigger'),
    e
  );
})();
exports._TouchTrigger = _TouchTrigger;
var _PanEventArgs = (function (e) {
  function t(t, o, n) {
    var r = e.call(this, t) || this;
    return (
      (r._panType = null == n ? t.type : n),
      (r._client = new wjcCore.Point(r.touchInfo.clientX, r.touchInfo.clientY)),
      (r._screen = new wjcCore.Point(r.touchInfo.screenX, r.touchInfo.screenY)),
      o &&
        ((r._clientDelta = new wjcCore.Point(
          r.client.x - o.client.x,
          r.client.y - o.client.y
        )),
        (r._screenDelta = new wjcCore.Point(
          r.screen.x - o.screen.x,
          r.screen.y - o.screen.y
        ))),
      r
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'type', {
      get: function () {
        return this._panType;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'clientDelta', {
      get: function () {
        return this._clientDelta;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'screenDelta', {
      get: function () {
        return this._screenDelta;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'client', {
      get: function () {
        return this._client;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'screen', {
      get: function () {
        return this._screen;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pointersCount', {
      get: function () {
        return this.type == _TouchEventType.End ? 0 : 1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'touchInfo', {
      get: function () {
        return this.touchInfos[0] || {};
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(_TouchEventArgs);
exports._PanEventArgs = _PanEventArgs;
var _PanEvent = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.raise = function (t, o) {
      e.prototype.raise.call(this, t, o);
    }),
    t
  );
})(_TouchEvent);
exports._PanEvent = _PanEvent;
var _PanTrigger = (function (e) {
  function t() {
    var t = (null !== e && e.apply(this, arguments)) || this;
    return (
      (t.panMove = new _PanEvent()),
      (t.panStart = new _PanEvent()),
      (t.panEnd = new _PanEvent()),
      t
    );
  }
  return (
    __extends(t, e),
    (t.prototype.onPanEnd = function (e) {
      this.panEnd.raise(this, e);
    }),
    (t.prototype.onPanStart = function (e) {
      this.panStart.raise(this, e);
    }),
    (t.prototype.onPanMove = function (e) {
      this.panMove.raise(this, e);
    }),
    (t.prototype._prepareMove = function (e) {
      var t = this;
      (this._prePanEventArgs = e),
        this._panEvents.queue(function () {
          t.onPanMove(e);
        });
    }),
    (t.prototype._prepareStart = function (e) {
      var o = this;
      (this._prePanEventArgs = e),
        this._panEvents.queue(function () {
          o.onPanStart(e);
        }),
        this._clearPanStartTimer(),
        (this._panStartTimer = setTimeout(function () {
          o._panEvents && o._panEvents.start(), o._clearPanStartTimer();
        }, t._threhold));
    }),
    (t.prototype._prepareEnd = function (e) {
      var t = this;
      (this._prePanEventArgs = null),
        this._panEvents.queue(function () {
          var o =
            e instanceof _PanEventArgs
              ? e
              : new _PanEventArgs(e, null, _TouchEventType.End);
          t.onPanEnd(o), t._stopPan();
        });
    }),
    (t.prototype._clearPanStartTimer = function () {
      null != this._panStartTimer &&
        (clearTimeout(this._panStartTimer), (this._panStartTimer = null));
    }),
    (t.prototype._tryStopPan = function (e) {
      this._panEvents && this._panEvents.isStarted
        ? this._prepareEnd(e)
        : this._stopPan();
    }),
    (t.prototype._stopPan = function () {
      this._clearPanStartTimer(),
        (this._panEvents = null),
        (this._prePanEventArgs = null);
    }),
    (t.prototype._processPan = function (e) {
      var t = this._createPanEventArgs(e);
      if (t)
        switch (t.type) {
          case _TouchEventType.Start:
            return void this._prepareStart(t);
          case _TouchEventType.Move:
            return void this._prepareMove(t);
          case _TouchEventType.End:
            return void this._prepareEnd(t);
        }
      else this._tryStopPan(e);
    }),
    (t.prototype.onTouchStart = function (t) {
      e.prototype.onTouchStart.call(this, t), this._processPan(t);
    }),
    (t.prototype.onTouchMove = function (t) {
      e.prototype.onTouchMove.call(this, t), this._processPan(t);
    }),
    (t.prototype.onTouchEnd = function (t) {
      e.prototype.onTouchEnd.call(this, t);
      var o = this._createPanEventArgs(t);
      o ? this._prepareEnd(o) : this._tryStopPan(t);
    }),
    (t.prototype._createPanEventArgs = function (e) {
      if (
        (e.type == _TouchEventType.End && 0 != e.pointersCount) ||
        (e.type != _TouchEventType.End && 1 != e.pointersCount)
      )
        return null;
      var t = new _PanEventArgs(e, this._prePanEventArgs);
      if (t.type != _TouchEventType.Start) {
        if (!this._panEvents) return null;
      } else this._panEvents = new _ActionQueue();
      return t;
    }),
    (t._threhold = 10),
    t
  );
})(_TouchTrigger);
exports._PanTrigger = _PanTrigger;
var _SwipeEventArgs = (function (e) {
  function t(t, o, n, r) {
    var i = e.call(this, n) || this;
    (i._duration = r), (i._startTouchInfo = t), (i._endTouchInfo = o);
    var a = _pointMove(
      !1,
      new wjcCore.Point(i.endTouchInfo.clientX, i.endTouchInfo.clientY),
      new wjcCore.Point(i.startTouchInfo.clientX, i.startTouchInfo.clientY)
    );
    return (
      (i._speed = new wjcCore.Point(
        _SwipeTrigger.getSpeed(a.x, i.duration),
        _SwipeTrigger.getSpeed(a.y, i.duration)
      )),
      (i._direction = _TouchInfo._getDirection(
        i.startTouchInfo,
        i.endTouchInfo
      )),
      i
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'duration', {
      get: function () {
        return this._duration;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'startTouchInfo', {
      get: function () {
        return this._startTouchInfo;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'endTouchInfo', {
      get: function () {
        return this._endTouchInfo;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'speed', {
      get: function () {
        return this._speed;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pointersCount', {
      get: function () {
        return 1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'direction', {
      get: function () {
        return this._direction;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(_PanEventArgs);
exports._SwipeEventArgs = _SwipeEventArgs;
var _SwipeEvent = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.raise = function (t, o) {
      e.prototype.raise.call(this, t, o);
    }),
    t
  );
})(_PanEvent);
exports._SwipeEvent = _SwipeEvent;
var _SwipeTrigger = (function (e) {
  function t() {
    var t = (null !== e && e.apply(this, arguments)) || this;
    return (t.swipe = new _SwipeEvent()), t;
  }
  return (
    __extends(t, e),
    (t.getSpeed = function (e, t) {
      return e / t;
    }),
    (t.prototype.onPanStart = function (t) {
      e.prototype.onPanStart.call(this, t), (this._panStartEventArgs = t);
    }),
    (t.prototype.onPanMove = function (t) {
      e.prototype.onPanMove.call(this, t), (this._prePanMoveEventArgs = t);
    }),
    (t.prototype.onPanEnd = function (t) {
      e.prototype.onPanEnd.call(this, t);
      var o = this._createSwipeEventArgs(t);
      o && this.onSwipe(o),
        (this._panStartEventArgs = null),
        (this._prePanMoveEventArgs = null);
    }),
    (t.prototype.onSwipe = function (e) {
      this.swipe.raise(this, e);
    }),
    (t.prototype._createSwipeEventArgs = function (e) {
      if (!this._panStartEventArgs || !this._prePanMoveEventArgs) return null;
      var o = e.timeStamp - this._panStartEventArgs.timeStamp;
      return o > t.maxDuration
        ? null
        : _TouchInfo.getDistance(
            this._panStartEventArgs.touchInfo,
            this._prePanMoveEventArgs.touchInfo
          ) < t.minDistance
        ? null
        : new _SwipeEventArgs(
            this._panStartEventArgs.touchInfo,
            this._prePanMoveEventArgs.touchInfo,
            e,
            o
          );
    }),
    (t.minDistance = 50),
    (t.maxDuration = 300),
    t
  );
})(_PanTrigger);
exports._SwipeTrigger = _SwipeTrigger;
var _PinchEventArgs = (function (e) {
  function t(t, o, n) {
    var r = e.call(this, t) || this;
    return (
      (r._zoom = 1),
      (r._pinchType = o),
      (r._pre = n || {}),
      r.type == _TouchEventType.End
        ? r
        : ((r._pinchDistance = _TouchInfo.getDistance(
            r.touchInfos[0],
            r.touchInfos[1]
          )),
          (r._centerClient = _TouchInfo.getCenterClient(
            r.touchInfos[0],
            r.touchInfos[1]
          )),
          (r._centerScreen = _TouchInfo.getCenterScreen(
            r.touchInfos[0],
            r.touchInfos[1]
          )),
          r.type == _TouchEventType.Start
            ? r
            : ((r._zoom = r.pinchDistance / r.prePinchDistance),
              (r._centerClientDelta = new wjcCore.Point(
                r.centerClient.x - r.preCenterClient.x,
                r.centerClient.y - r.preCenterClient.y
              )),
              (r._centerScreenDelta = new wjcCore.Point(
                r.centerScreen.x - r.preCenterScreen.x,
                r.centerScreen.y - r.preCenterScreen.y
              )),
              r))
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'zoom', {
      get: function () {
        return this._zoom;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pointersCount', {
      get: function () {
        return this.type == _TouchEventType.End ? 0 : 2;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'prePinchDistance', {
      get: function () {
        return this._pre.pinchDistance;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pinchDistance', {
      get: function () {
        return this._pinchDistance;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'centerScreenDelta', {
      get: function () {
        return this._centerScreenDelta;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'centerClientDelta', {
      get: function () {
        return this._centerClientDelta;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'centerClient', {
      get: function () {
        return this._centerClient;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'preCenterClient', {
      get: function () {
        return this._pre.centerClient;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'centerScreen', {
      get: function () {
        return this._centerScreen;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'preCenterScreen', {
      get: function () {
        return this._pre.centerScreen;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'type', {
      get: function () {
        return this._pinchType;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(_TouchEventArgs);
exports._PinchEventArgs = _PinchEventArgs;
var _PinchEvent = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.raise = function (t, o) {
      e.prototype.raise.call(this, t, o);
    }),
    t
  );
})(_TouchEvent);
exports._PinchEvent = _PinchEvent;
var _PinchTrigger = (function (e) {
  function t() {
    var t = (null !== e && e.apply(this, arguments)) || this;
    return (t.pinch = new _PinchEvent()), t;
  }
  return (
    __extends(t, e),
    (t.prototype.onPinch = function (e) {
      this.pinch.raise(this, e);
    }),
    (t.prototype.onTouchStart = function (e) {
      this._process(e);
    }),
    (t.prototype.onTouchend = function (e) {
      this._process(e);
    }),
    (t.prototype.onTouchMove = function (e) {
      this._process(e);
    }),
    (t.prototype._onPinching = function (e) {
      var t = new _PinchEventArgs(
        e,
        this._preEventArgs ? _TouchEventType.Move : _TouchEventType.Start,
        this._preEventArgs
      );
      this.onPinch(t), (this._preEventArgs = t);
    }),
    (t.prototype._onPinchEnd = function (e) {
      if (this._preEventArgs) {
        var t = new _PinchEventArgs(e, _TouchEventType.End, this._preEventArgs);
        this.onPinch(t), (this._preEventArgs = null);
      }
    }),
    (t.prototype._process = function (e) {
      if (2 == e.pointersCount)
        switch (e.type) {
          case _TouchEventType.Start:
          case _TouchEventType.Move:
            return void this._onPinching(e);
          case _TouchEventType.End:
            return void this._onPinchEnd(e);
        }
      else this._onPinchEnd(e);
    }),
    t
  );
})(_TouchTrigger);
exports._PinchTrigger = _PinchTrigger;
var _TouchManager = (function () {
  function e(e, t) {
    void 0 === t && (t = !0);
    var o = this;
    (this.touchMove = new _TouchEvent()),
      (this.touchStart = new _TouchEvent()),
      (this.touchEnd = new _TouchEvent()),
      (this.panMove = new _PanEvent()),
      (this.panStart = new _PanEvent()),
      (this.panEnd = new _PanEvent()),
      (this.swipe = new _SwipeEvent()),
      (this.pinch = new _PinchEvent()),
      (this._trigger = new _SwipeTrigger(e)),
      this._trigger.touchStart.addHandler(function (e, t) {
        return o.onTouchStart(t);
      }),
      this._trigger.touchMove.addHandler(function (e, t) {
        return o.onTouchMove(t);
      }),
      this._trigger.touchEnd.addHandler(function (e, t) {
        return o.onTouchEnd(t);
      }),
      this._trigger.panStart.addHandler(function (e, t) {
        return o.onPanStart(t);
      }),
      this._trigger.panMove.addHandler(function (e, t) {
        return o.onPanMove(t);
      }),
      this._trigger.panEnd.addHandler(function (e, t) {
        return o.onPanEnd(t);
      }),
      this._trigger.swipe.addHandler(function (e, t) {
        return o.onSwipe(t);
      }),
      (this._pinchTrigger = new _PinchTrigger(e)),
      this._pinchTrigger.pinch.addHandler(function (e, t) {
        return o.onPinch(t);
      }),
      (this.removeDefaultTouch = t);
  }
  return (
    (e._isTouchEvent = function (t) {
      return (
        t instanceof TouchEvent ||
        (t.pointerType || '').toLowerCase() === e._touchPointerName
      );
    }),
    (e._isTouchStart = function (t) {
      return e._eventTypeContains(t, _getTouchEventMap().startName);
    }),
    (e._isTouchEnd = function (t) {
      return e._eventTypeContains(t, _getTouchEventMap().endName);
    }),
    (e._isTouchMove = function (t) {
      return e._eventTypeContains(t, _getTouchEventMap().moveName);
    }),
    (e._eventTypeContains = function (e, t) {
      var o = t.split(',');
      e = e.toLowerCase();
      for (var n = 0, r = o.length; n < r; n++) {
        var i = o[n].trim().toLowerCase();
        if (e.indexOf(i) > -1) return !0;
      }
      return !1;
    }),
    (e._registerTouchInfo = function (t) {
      if (e._isTouchEvent(t))
        if (t instanceof TouchEvent) {
          e._allTouchInfos = [];
          for (var o = 0, n = t.touches.length; o < n; o++)
            e._allTouchInfos.push(new _TouchInfo(t.touches.item(o)));
        } else if (t instanceof PointerEvent) {
          if (
            ((e._allTouchInfos = e._allTouchInfos || []), e._isTouchEnd(t.type))
          ) {
            for (var r = 0, n = e._allTouchInfos.length; r < n; r++)
              if (e._allTouchInfos[r].id == t.pointerId)
                return void e._allTouchInfos.splice(r, 1);
            return;
          }
          for (var r = 0, n = e._allTouchInfos.length; r < n; r++)
            if (e._allTouchInfos[r].id == t.pointerId)
              return void (e._allTouchInfos[r] = new _TouchInfo(t));
          e._allTouchInfos.push(new _TouchInfo(t));
        }
    }),
    (e.prototype.onPinch = function (e) {
      this.pinch.raise(this, e);
    }),
    (e.prototype.onSwipe = function (e) {
      this.swipe.raise(this, e);
    }),
    (e.prototype.onTouchEnd = function (e) {
      this.touchEnd.raise(this, e);
    }),
    (e.prototype.onTouchStart = function (e) {
      this.touchStart.raise(this, e);
    }),
    (e.prototype.onTouchMove = function (e) {
      this.touchMove.raise(this, e);
    }),
    (e.prototype.onPanEnd = function (e) {
      this.panEnd.raise(this, e);
    }),
    (e.prototype.onPanStart = function (e) {
      this.panStart.raise(this, e);
    }),
    (e.prototype.onPanMove = function (e) {
      this.panMove.raise(this, e);
    }),
    Object.defineProperty(e.prototype, 'removeDefaultTouch', {
      get: function () {
        return this._removeDefaultTouch;
      },
      set: function (e) {
        this._removeDefaultTouch = e;
        var t = this.hostElement.style;
        e
          ? ((t.touchAction = 'none'), (t.msTouchAction = 'none'))
          : ((t.touchAction = this._defaultTouchAction),
            (t.msTouchAction = this._defaultMsTouchAction));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'hostElement', {
      get: function () {
        return this._pinchTrigger.hostElement;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'contentElement', {
      get: function () {
        return this.hostElement.children.length
          ? this.hostElement.children[0]
          : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.dispose = function () {
      this._pinchTrigger && this._pinchTrigger.dispose(),
        this._trigger && this._trigger.dispose(),
        this.removeDefaultTouch && (this.removeDefaultTouch = !1);
    }),
    (e._touchPointerName = 'touch'),
    (e._allTouchInfos = []),
    e
  );
})();
exports._TouchManager = _TouchManager;
var _PageSetupEditor = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    o._uiUpdating = !1;
    wjcCore.assert(
      null != wjcInput.ComboBox,
      'Missing dependency: _PageSetupEditor requires wijmo.input.'
    );
    var n;
    return (
      (n = o.getTemplate()),
      o.applyTemplate('wj-control wj-content', n, {
        _divPaperKind: 'div-paper-kind',
        _divOrientation: 'div-page-orientation',
        _divMarginsLeft: 'div-margins-left',
        _divMarginsRight: 'div-margins-right',
        _divMarginsTop: 'div-margins-top',
        _divMarginsBottom: 'div-margins-bottom',
        _gPaperKind: 'g-paperkind',
        _gOrientation: 'g-orientation',
        _gMargins: 'g-margins',
        _gLeft: 'g-left',
        _gRight: 'g-right',
        _gTop: 'g-top',
        _gBottom: 'g-bottom',
      }),
      (o._numMarginsLeft = new wjcInput.InputNumber(o._divMarginsLeft)),
      o._numMarginsLeft.valueChanged.addHandler(o._updateValue, o),
      (o._numMarginsRight = new wjcInput.InputNumber(o._divMarginsRight)),
      o._numMarginsRight.valueChanged.addHandler(o._updateValue, o),
      (o._numMarginsTop = new wjcInput.InputNumber(o._divMarginsTop)),
      o._numMarginsTop.valueChanged.addHandler(o._updateValue, o),
      (o._numMarginsBottom = new wjcInput.InputNumber(o._divMarginsBottom)),
      o._numMarginsBottom.valueChanged.addHandler(o._updateValue, o),
      (o._cmbPaperKind = new wjcInput.ComboBox(o._divPaperKind, {
        itemsSource: _enumToArray(_PaperKind),
        displayMemberPath: 'text',
        selectedValuePath: 'value',
        isEditable: !1,
      })),
      o._cmbPaperKind.selectedIndexChanged.addHandler(o._updateValue, o),
      (o._cmbOrientation = new wjcInput.ComboBox(o._divOrientation, {
        itemsSource: [
          wjcCore.culture.Viewer.portrait,
          wjcCore.culture.Viewer.landscape,
        ],
        isEditable: !1,
      })),
      o._cmbOrientation.selectedIndexChanged.addHandler(o._updateValue, o),
      o._globalize(),
      o
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'pageSettings', {
      get: function () {
        return this._pageSettings;
      },
      set: function (e) {
        var t = _clonePageSettings(e);
        (this._pageSettings = t), this._updateUI(), this._cmbPaperKind.focus();
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._globalize = function () {
      var e = wjcCore.culture.Viewer;
      (this._gPaperKind.textContent = e.paperKind),
        (this._gOrientation.textContent = e.orientation),
        (this._gMargins.textContent = e.margins),
        (this._gLeft.textContent = e.left),
        (this._gRight.textContent = e.right),
        (this._gTop.textContent = e.top),
        (this._gBottom.textContent = e.bottom);
      var t = this._cmbOrientation.selectedIndex;
      (this._cmbOrientation.itemsSource = [
        wjcCore.culture.Viewer.portrait,
        wjcCore.culture.Viewer.landscape,
      ]),
        (this._cmbOrientation.selectedIndex = t);
    }),
    (t.prototype._updateValue = function () {
      if (!this._uiUpdating) {
        var e = this.pageSettings;
        e &&
          ((e.bottomMargin = new _Unit(
            this._numMarginsBottom.value,
            _UnitType.Inch
          )),
          (e.leftMargin = new _Unit(
            this._numMarginsLeft.value,
            _UnitType.Inch
          )),
          (e.rightMargin = new _Unit(
            this._numMarginsRight.value,
            _UnitType.Inch
          )),
          (e.topMargin = new _Unit(this._numMarginsTop.value, _UnitType.Inch)),
          (e.paperSize = this._cmbPaperKind.selectedValue),
          _setLandscape(
            e,
            this._cmbOrientation.text === wjcCore.culture.Viewer.landscape
          ),
          this._updateUI());
      }
    }),
    (t.prototype._updateUI = function () {
      this._uiUpdating = !0;
      var e = this.pageSettings,
        t = function (e, t) {
          e.value = _Unit.convertValue(t.value, t.units, _UnitType.Inch);
        };
      e &&
        ((this._cmbPaperKind.selectedValue = e.paperSize),
        (this._cmbOrientation.text = e.landscape
          ? wjcCore.culture.Viewer.landscape
          : wjcCore.culture.Viewer.portrait),
        t(this._numMarginsLeft, e.leftMargin),
        t(this._numMarginsRight, e.rightMargin),
        t(this._numMarginsTop, e.topMargin),
        t(this._numMarginsBottom, e.bottomMargin)),
        (this._uiUpdating = !1);
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        t && this._globalize();
    }),
    (t.controlTemplate =
      '<div><div style="padding:12px;"><table style="table-layout:fixed"><tr><td wj-part="g-paperkind"></td><td><div wj-part="div-paper-kind"></div></td></tr><tr><td wj-part="g-orientation"></td><td><div wj-part="div-page-orientation"></div></td></tr></table><fieldset style="margin-top: 12px"><legend wj-part="g-margins"></legend><table style="table-layout:fixed"><tr><td wj-part="g-left"></td><td><div wj-part="div-margins-left"></div></td></tr><tr><td wj-part="g-right"></td><td><div wj-part="div-margins-right"></div></td></tr><tr><td wj-part="g-top"></td><td><div wj-part="div-margins-top"></div></td></tr><tr><td wj-part="g-bottom"></td><td><div wj-part="div-margins-bottom"></div></td></tr></table></fieldset></div></div>'),
    t
  );
})(wjcCore.Control);
exports._PageSetupEditor = _PageSetupEditor;
var _ExportOptionEditor = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    return (
      (o._options = {}),
      (o._optionLabels = null),
      (o._groupTitleField = null),
      wjcCore.addClass(t, 'wj-export-editor'),
      o
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'options', {
      get: function () {
        return this._options;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'exportDescription', {
      get: function () {
        return this._exportDescription;
      },
      set: function (e) {
        (this._exportDescription = e),
          (this._options = {}),
          e &&
            ((this._options.format = this.exportDescription.format),
            this._render());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._skipOption = function (e) {
      return t._skippedOptions.indexOf(e) >= 0;
    }),
    (t.prototype._render = function () {
      if ((_removeChildren(this.hostElement), this.exportDescription)) {
        document.createElement('table');
        var e = this.exportDescription.optionDescriptions,
          o = {};
        if (e)
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            this._skipOption(r.name) ||
              (r.group
                ? (o[r.group] || (o[r.group] = []), o[r.group].push(r))
                : (o[t._generalGroupName] || (o[t._generalGroupName] = []),
                  (r.group = t._generalGroupName),
                  o[t._generalGroupName].push(r)));
          }
        for (var i in o)
          this.hostElement.appendChild(this._generateGroup(o[i]));
        this._updateEditors();
      }
    }),
    (t.prototype._generateEditor = function (e) {
      var o;
      if (wjcCore.isArray(e.allowedValues)) o = this._generateComboEditor(e);
      else
        switch (e.type) {
          case 'bool':
            o = this._generateBoolEditor(e);
            break;
          case 'int':
          case 'float':
            o = this._generateNumberEditor(e);
            break;
          case 'unit':
            e.defaultValue = new _Unit(e.defaultValue);
          case 'string':
          default:
            o = this._generateStringEditor(e);
        }
      return o.setAttribute(t._optionIdAttr, e.name), o;
    }),
    (t.prototype._generateComboEditor = function (e) {
      for (
        var t, o = this, n = [], r = document.createElement('div'), i = 0;
        i < e.allowedValues.length;
        i++
      )
        n.push(e.allowedValues[i]);
      return (
        (t = new wjcInput.ComboBox(r)),
        (t.isEditable = !1),
        (t.itemsSource = n),
        (t.selectedValue = e.defaultValue),
        t.selectedIndexChanged.addHandler(function (t) {
          o._setOptionValue(e.name, t.selectedValue.toString());
        }),
        r
      );
    }),
    (t.prototype._generateBoolEditor = function (e) {
      var t,
        o = this;
      if (e.nullable) {
        t = document.createElement('div');
        var n = new wjcInput.ComboBox(t),
          r = [];
        (n.isEditable = !1),
          (n.displayMemberPath = 'name'),
          (n.selectedValuePath = 'value'),
          r.push({ name: 'None', value: null }),
          r.push({ name: 'True', value: !0 }),
          r.push({ name: 'False', value: !1 }),
          (n.itemsSource = r),
          (n.selectedValue = e.defaultValue),
          n.selectedIndexChanged.addHandler(function (t) {
            o._setOptionValue(e.name, t.selectedValue),
              o._updateEditors(e.name);
          });
      } else {
        (t = document.createElement('input')).type = 'checkbox';
        var i = wjcCore.changeType(
          e.defaultValue,
          wjcCore.DataType.Boolean,
          null
        );
        (t.checked = i),
          _addEvent(t, 'click', function () {
            o._setOptionValue(e.name, t.checked), o._updateEditors(e.name);
          });
      }
      return t;
    }),
    (t.prototype._generateNumberEditor = function (e) {
      var t,
        o,
        n = this,
        r = 'int' === e.type;
      return (
        (t = document.createElement('div')),
        (o = new wjcInput.InputNumber(t)),
        (o.format = r ? 'n0' : 'n2'),
        (o.isRequired = !e.nullable),
        (o.value = e.defaultValue),
        o.valueChanged.addHandler(function (t) {
          n._setOptionValue(e.name, t.value);
        }),
        t
      );
    }),
    (t.prototype._generateStringEditor = function (e) {
      var t,
        o = this;
      return (
        (t = document.createElement('input')),
        e.name.match(/password/i) ? (t.type = 'password') : (t.type = 'text'),
        (t.value = e.defaultValue),
        _addEvent(t, 'change,keyup,paste,input', function () {
          o._setOptionValue(e.name, t.value);
        }),
        t
      );
    }),
    (t.prototype._generateGroup = function (e) {
      var o = document.createElement('fieldset'),
        n = document.createElement('legend'),
        r = e[0].group;
      wjcCore.addClass(o, 'wj-exportformats-group'),
        (n.innerHTML = this._groupTitle[r]),
        n.setAttribute(t._optionNameAttr, r),
        o.appendChild(n);
      for (var i = document.createElement('table'), a = 0; a < e.length; a++) {
        var s = e[a],
          c = document.createElement('tr'),
          u = document.createElement('td'),
          l = document.createElement('td');
        (u.innerHTML = this._getOptionLabel(s.name)),
          u.setAttribute(t._optionNameAttr, s.name),
          l.appendChild(this._generateEditor(s)),
          c.appendChild(u),
          c.appendChild(l),
          i.appendChild(c);
      }
      return o.appendChild(i), o;
    }),
    (t.prototype._updateEditors = function (e) {
      if ('pdfACompatible' !== e && e) {
        if ('paged' === e || !e) {
          var o = this.hostElement.querySelector(
            '[' + t._optionIdAttr + '="showNavigator"]'
          );
          if (o) {
            var n = wjcCore.changeType(
              this._getOptionValue('paged'),
              wjcCore.DataType.Boolean,
              null
            );
            n
              ? ((o.checked = this._previousShowNavigator),
                this._setOptionValue(
                  'showNavigator',
                  this._previousShowNavigator
                ))
              : ((this._previousShowNavigator = o.checked),
                (o.checked = !1),
                this._setOptionValue('showNavigator', !1)),
              (o.disabled = !n);
          }
        }
      } else {
        var r = this.hostElement.querySelector(
          '[' + t._optionIdAttr + '="embedFonts"]'
        );
        if (r) {
          var i = wjcCore.changeType(
            this._getOptionValue('pdfACompatible'),
            wjcCore.DataType.Boolean,
            null
          );
          i
            ? ((this._previousEmbedFonts = r.checked),
              (r.checked = !0),
              this._setOptionValue('embedFonts', !0))
            : ((r.checked = this._previousEmbedFonts),
              this._setOptionValue('embedFonts', this._previousEmbedFonts)),
            (r.disabled = i);
        }
      }
    }),
    (t.prototype._getOptionLabel = function (e) {
      var t = this._optionLabelsText[e];
      return t || e[0].toUpperCase() + e.substring(1);
    }),
    (t.prototype._getOptionDescByName = function (e) {
      var t = null;
      return (
        this._exportDescription.optionDescriptions.some(function (o) {
          return o.name === e && ((t = o), !0);
        }),
        t
      );
    }),
    (t.prototype._getOptionValue = function (e) {
      return void 0 !== this._options[e]
        ? this._options[e]
        : this._getOptionDescByName(e).defaultValue;
    }),
    (t.prototype._setOptionValue = function (e, t) {
      var o = this._getOptionDescByName(e),
        n = o.defaultValue;
      'unit' === o.type && (n = o.defaultValue.toString()),
        t !== n
          ? (this._options[e] = t)
          : void 0 !== this._options[e] && delete this._options[e];
    }),
    Object.defineProperty(t.prototype, '_optionLabelsText', {
      get: function () {
        return (
          this._optionLabels ||
            (this._optionLabels = {
              title: wjcCore.culture.Viewer.docInfoTitle,
              author: wjcCore.culture.Viewer.docInfoAuthor,
              manager: wjcCore.culture.Viewer.docInfoManager,
              operator: wjcCore.culture.Viewer.docInfoOperator,
              company: wjcCore.culture.Viewer.docInfoCompany,
              subject: wjcCore.culture.Viewer.docInfoSubject,
              comment: wjcCore.culture.Viewer.docInfoComment,
              creator: wjcCore.culture.Viewer.docInfoCreator,
              producer: wjcCore.culture.Viewer.docInfoProducer,
              creationTime: wjcCore.culture.Viewer.docInfoCreationTime,
              revisionTime: wjcCore.culture.Viewer.docInfoRevisionTime,
              keywords: wjcCore.culture.Viewer.docInfoKeywords,
              embedFonts: wjcCore.culture.Viewer.embedFonts,
              pdfACompatible: wjcCore.culture.Viewer.pdfACompatible,
              useCompression: wjcCore.culture.Viewer.useCompression,
              useOutlines: wjcCore.culture.Viewer.useOutlines,
              allowCopyContent: wjcCore.culture.Viewer.allowCopyContent,
              allowEditAnnotations: wjcCore.culture.Viewer.allowEditAnnotations,
              allowEditContent: wjcCore.culture.Viewer.allowEditContent,
              allowPrint: wjcCore.culture.Viewer.allowPrint,
              ownerPassword: wjcCore.culture.Viewer.ownerPassword,
              userPassword: wjcCore.culture.Viewer.userPassword,
              encryptionType: wjcCore.culture.Viewer.encryptionType,
              paged: wjcCore.culture.Viewer.paged,
              showNavigator: wjcCore.culture.Viewer.showNavigator,
              navigatorPosition: wjcCore.culture.Viewer.navigatorPosition,
              singleFile: wjcCore.culture.Viewer.singleFile,
              tolerance: wjcCore.culture.Viewer.tolerance,
              pictureLayer: wjcCore.culture.Viewer.pictureLayer,
              metafileType: wjcCore.culture.Viewer.metafileType,
              monochrome: wjcCore.culture.Viewer.monochrome,
              resolution: wjcCore.culture.Viewer.resolution,
              outputRange: wjcCore.culture.Viewer.outputRange,
              outputRangeInverted: wjcCore.culture.Viewer.outputRangeInverted,
            }),
          this._optionLabels
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_groupTitle', {
      get: function () {
        return (
          this._groupTitleField ||
            (this._groupTitleField = {
              documentRestrictions:
                wjcCore.culture.Viewer.documentRestrictionsGroup,
              passwordSecurity: wjcCore.culture.Viewer.passwordSecurityGroup,
              outputRange: wjcCore.culture.Viewer.outputRangeGroup,
              documentInfo: wjcCore.culture.Viewer.documentInfoGroup,
              general: wjcCore.culture.Viewer.generalGroup,
            }),
          this._groupTitleField
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._globalize = function () {
      for (
        var e = this.hostElement.querySelectorAll(
            '[' + t._optionNameAttr + ']'
          ),
          o = 0;
        o < e.length;
        o++
      ) {
        var n = e[o];
        n instanceof HTMLLegendElement
          ? (n.innerHTML = this._groupTitle[n.getAttribute(t._optionNameAttr)])
          : (n.innerHTML = this._getOptionLabel(
              n.getAttribute(t._optionNameAttr)
            ));
      }
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        t &&
          ((this._optionLabels = null),
          (this._groupTitleField = null),
          this._globalize());
    }),
    (t._optionIdAttr = 'option-id'),
    (t._optionNameAttr = 'option-name'),
    (t._skippedOptions = [
      'shapesWord2007Compatible',
      'sheetName',
      'navigatorPositions',
    ]),
    (t._generalGroupName = 'general'),
    t
  );
})(wjcCore.Control);
exports._ExportOptionEditor = _ExportOptionEditor;
var _Toolbar = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    o.svgButtonClicked = new wjcCore.Event();
    var n;
    return (
      (n = o.getTemplate()),
      o.applyTemplate('wj-toolbar', n, {
        _toolbarWrapper: 'toolbar-wrapper',
        _toolbarContainer: 'toolbar-container',
        _toolbarLeft: 'toolbar-left',
        _toolbarRight: 'toolbar-right',
      }),
      _addEvent(o._toolbarLeft, 'mouseover', function () {
        o._scrollLeft();
      }),
      _addEvent(o._toolbarLeft, 'mouseout', function () {
        o._clearToolbarMoveTimer();
      }),
      _addEvent(o._toolbarRight, 'mouseover', function () {
        o._scrollRight();
      }),
      _addEvent(o._toolbarRight, 'mouseout', function () {
        o._clearToolbarMoveTimer();
      }),
      o
    );
  }
  return (
    __extends(t, e),
    (t.prototype.applyTemplate = function (e, t, o) {
      var n = this.hostElement;
      if ((wjcCore.addClass(n, e), n.appendChild(_toDOMs(t)), o))
        for (var r in o) {
          var i = o[r];
          if (
            ((this[r] = n.querySelector('[wj-part="' + i + '"]')),
            null == this[r] && n.getAttribute('wj-part') == i && (this[r] = t),
            null == this[r])
          )
            throw 'Missing template part: "' + i + '"';
        }
      return n;
    }),
    (t.prototype._clearToolbarMoveTimer = function () {
      null != this._toolbarMoveTimer &&
        (clearTimeout(this._toolbarMoveTimer), (this._toolbarMoveTimer = null));
    }),
    (t.prototype._scrollRight = function () {
      var e = this,
        o = this._toolbarRight.getBoundingClientRect().width,
        n =
          this._toolbarContainer.getBoundingClientRect().width -
          this._toolbarWrapper.getBoundingClientRect().width,
        r = this._toolbarWrapper.offsetLeft - o - t._moveStep;
      this._checkMoveButtonEnabled(),
        r < n ||
          ((this._toolbarWrapper.style.left = r + 'px'),
          (this._toolbarMoveTimer = setTimeout(function () {
            return e._scrollRight();
          }, t._moveInterval)));
    }),
    (t.prototype._scrollLeft = function () {
      var e = this,
        o = this._toolbarLeft.getBoundingClientRect().width,
        n = this._toolbarWrapper.offsetLeft - o + t._moveStep;
      this._checkMoveButtonEnabled(),
        n > 0 ||
          ((this._toolbarWrapper.style.left = n + 'px'),
          (this._toolbarMoveTimer = setTimeout(function () {
            return e._scrollLeft();
          }, t._moveInterval)));
    }),
    (t.prototype._checkMoveButtonEnabled = function () {
      var e = this._toolbarLeft.getBoundingClientRect().width,
        o = this._toolbarWrapper.offsetLeft - e + t._moveStep,
        n = o <= 0,
        r = wjcCore.hasClass(this._toolbarLeft, t._enabledCss);
      n
        ? r || wjcCore.addClass(this._toolbarLeft, t._enabledCss)
        : r && wjcCore.removeClass(this._toolbarLeft, t._enabledCss);
      var i = this._toolbarRight.getBoundingClientRect().width,
        a =
          this._toolbarContainer.getBoundingClientRect().width -
          this._toolbarWrapper.getBoundingClientRect().width,
        s = (o = this._toolbarWrapper.offsetLeft - i - t._moveStep) >= a,
        c = wjcCore.hasClass(this._toolbarRight, t._enabledCss);
      s
        ? c || wjcCore.addClass(this._toolbarRight, t._enabledCss)
        : c && wjcCore.removeClass(this._toolbarRight, t._enabledCss);
    }),
    (t.prototype._showToolbarMoveButton = function (e) {
      var t = e ? 'visible' : 'hidden';
      (this._toolbarLeft.style.visibility = t),
        (this._toolbarRight.style.visibility = t),
        this._checkMoveButtonEnabled();
    }),
    (t.prototype._globalize = function () {}),
    (t.prototype.resetWidth = function () {
      var e = this._toolbarLeft.getBoundingClientRect().width,
        t = this._toolbarRight.getBoundingClientRect().width,
        o = this.hostElement.getBoundingClientRect().width;
      (this._toolbarContainer.style.width = '1500px'),
        (this._toolbarWrapper.style.width = 'auto');
      var n = this._toolbarWrapper.getBoundingClientRect().width + 2;
      (this._toolbarWrapper.style.width = n + 'px'),
        (this._toolbarContainer.style.width = o - e - t + 'px');
      var r = e + t + n > o;
      this._showToolbarMoveButton(r),
        r || (this._toolbarWrapper.style.left = '0px');
    }),
    (t.prototype.addSeparator = function () {
      var e = document.createElement('span');
      return (
        (e.className = 'wj-separator'), this._toolbarWrapper.appendChild(e), e
      );
    }),
    (t.prototype.onSvgButtonClicked = function (e) {
      this.svgButtonClicked.raise(this, e);
    }),
    (t.prototype.addCustomItem = function (e, t) {
      wjcCore.isString(e) && (e = _toDOM(e)),
        null != t && e.setAttribute(exports._commandTagAttr, t.toString()),
        this._toolbarWrapper.appendChild(e);
    }),
    (t.prototype.addSvgButton = function (e, t, o, n) {
      var r = this,
        i = _createSvgBtn(t);
      return (
        (i.title = e),
        i.setAttribute(exports._commandTagAttr, o.toString()),
        this._toolbarWrapper.appendChild(i),
        _addEvent(i, 'click,keydown', function (e) {
          var t = e || window.event;
          !(
            ('keydown' === t.type && t.keyCode === wjcCore.Key.Enter) ||
            'click' === t.type
          ) ||
            _isDisabledImageButton(i) ||
            (!n && _isCheckedImageButton(i)) ||
            r.onSvgButtonClicked({ commandTag: o });
        }),
        i
      );
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        t && this._globalize();
    }),
    (t._moveStep = 2),
    (t._moveInterval = 5),
    (t._enabledCss = 'enabled'),
    (t.controlTemplate =
      '<div class="wj-toolbar-move left" wj-part="toolbar-left"><span class="wj-glyph-left"></span></div><div class="wj-toolbarcontainer" wj-part="toolbar-container"><div class="wj-toolbarwrapper wj-btn-group" wj-part="toolbar-wrapper"></div></div><div class="wj-toolbar-move right" wj-part="toolbar-right"><span class="wj-glyph-right"></span></div>'),
    t
  );
})(wjcCore.Control);
exports._Toolbar = _Toolbar;
var _ViewerToolbarBase = (function (e) {
  function t(t, o) {
    var n = e.call(this, t) || this;
    (n._viewer = o), n._initToolbarItems();
    var r = function () {
      return (n.isDisabled = !n._viewer._getDocumentSource());
    };
    return (
      n._viewer._documentSourceChanged.addHandler(r),
      r(),
      n._viewer._viewerActionStatusChanged.addHandler(function (e, t) {
        var o = t.action,
          r = n.hostElement.querySelector(
            '[command-tag="' + o.actionType.toString() + '"]'
          );
        _checkImageButton(r, o.checked),
          _disableImageButton(r, o.disabled),
          _showImageButton(r, o.shown),
          _checkSeparatorShown(n._toolbarWrapper);
      }),
      n
    );
  }
  return (
    __extends(t, e),
    (t.prototype._initToolbarItems = function () {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t.prototype.onSvgButtonClicked = function (t) {
      e.prototype.onSvgButtonClicked.call(this, t),
        this._viewer._executeAction(parseInt(t.commandTag));
    }),
    Object.defineProperty(t.prototype, 'viewer', {
      get: function () {
        return this._viewer;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t._initToolbarZoomValue = function (e, t) {
      var o,
        n,
        r,
        i,
        a = wjcCore.Control.getControl(e),
        s = document.createElement('div'),
        c = ViewerBase._defaultZoomValues;
      (s.className = 'wj-input-zoom'),
        a.addCustomItem(s, _ViewerActionType.ZoomValue),
        (o = new wjcInput.ComboBox(s)).deferUpdate(function () {
          for (r = 0; r < c.length; r++)
            for (i = r + 1; i < c.length; i++)
              c[r].value > c[i].value &&
                ((n = c[r]), (c[r] = c[i]), (c[i] = n));
          (o.itemsSource = c),
            (o.isEditable = !0),
            (o.displayMemberPath = 'name'),
            (o.selectedValuePath = 'value'),
            (o.selectedValue = 1);
        }),
        o.selectedIndexChanged.addHandler(function () {
          if (o.isDroppedDown) {
            var e = o.selectedValue;
            if (null == e) {
              var n = o.text.replace(',', '');
              (e = parseFloat(n)), isNaN(e) && (e = 100), (e *= 0.01);
            }
            t.zoomFactor = e;
          }
        }),
        _addEvent(s, 'keypress', function (e) {
          var n,
            r = e || window.event,
            i = o.text;
          r.keyCode === wjcCore.Key.Enter &&
            (i.lastIndexOf('%') === i.length - 1 &&
              (i = i.substring(0, o.text.length - 1)),
            (i = i.replace(',', '')),
            (n = parseFloat(i)),
            isNaN(n)
              ? (o.text = wjcCore.Globalize.format(t.zoomFactor, 'p0'))
              : (t.zoomFactor = 0.01 * n));
        }),
        _addEvent(s.querySelector('.wj-form-control'), 'blur', function (e) {
          o.text = wjcCore.Globalize.format(t.zoomFactor, 'p0');
        }),
        t.zoomFactorChanged.addHandler(function () {
          (o.isDroppedDown = !1),
            (o.text = wjcCore.Globalize.format(t.zoomFactor, 'p0'));
        });
    }),
    (t._initToolbarPageNumberInput = function (e, t) {
      var o,
        n = wjcCore.Control.getControl(e),
        r = document.createElement('div'),
        i = document.createElement('span'),
        a = function () {
          var e = t._getDocumentSource();
          e && null != e.pageCount && (o.value = t.pageIndex + 1);
        },
        s = function () {
          var e = t._getDocumentSource();
          e &&
            null != e.pageCount &&
            ((i.innerHTML = e.pageCount.toString()),
            (o.max = e.pageCount),
            (o.min = Math.min(e.pageCount, 1)),
            a());
        },
        c = function () {
          var e = t._getDocumentSource();
          e &&
            (s(),
            _addWjHandler(t._documentEventKey, e.pageCountChanged, s),
            _addWjHandler(t._documentEventKey, e.loadCompleted, s));
        };
      (r.className = 'wj-pagenumber'),
        n.addCustomItem(r, _ViewerActionType.PageNumber),
        ((o = new wjcInput.InputNumber(r)).format = 'n0'),
        _addEvent(r, 'keyup', function (e) {
          (e || window.event).keyCode === wjcCore.Key.Enter &&
            t.moveToPage(o.value - 1);
        }),
        _addEvent(o.inputElement, 'blur', function (e) {
          t.moveToPage(o.value - 1);
        }),
        n.addCustomItem('<span class="slash">/</span>'),
        (i.className = 'wj-pagecount'),
        n.addCustomItem(i, _ViewerActionType.PageCountLabel),
        t.pageIndexChanged.addHandler(a),
        t._getDocumentSource() && c(),
        t._documentSourceChanged.addHandler(c);
    }),
    t
  );
})(_Toolbar);
exports._ViewerToolbarBase = _ViewerToolbarBase;
var _ViewerToolbar = (function (e) {
  function t(t, o) {
    return e.call(this, t, o) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._globalize = function () {
      var e = wjcCore.culture.Viewer;
      (this._gPaginated.title = e.paginated),
        (this._gPrint.title = e.print),
        (this._gExports.title = e.exports),
        (this._gPortrait.title = e.portrait),
        (this._gLandscape.title = e.landscape),
        (this._gPageSetup.title = e.pageSetup),
        (this._gFirstPage.title = e.firstPage),
        (this._gPreviousPage.title = e.previousPage),
        (this._gNextPage.title = e.nextPage),
        (this._gLastPage.title = e.lastPage),
        (this._gBackwardHistory.title = e.backwardHistory),
        (this._gForwardHistory.title = e.forwardHistory),
        (this._gSelectTool.title = e.selectTool),
        (this._gMoveTool.title = e.moveTool),
        (this._gContinuousMode.title = e.continuousMode),
        (this._gSingleMode.title = e.singleMode),
        (this._gWholePage.title = e.wholePage),
        (this._gPageWidth.title = e.pageWidth),
        (this._gZoomOut.title = e.zoomOut),
        (this._gZoomIn.title = e.zoomIn),
        (this._gRubberbandTool.title = e.rubberbandTool),
        (this._gMagnifierTool.title = e.magnifierTool),
        (this._gRotateDocument.title = e.rotateDocument),
        (this._gRotatePage.title = e.rotatePage),
        (this._gFullScreen.title = e.fullScreen);
    }),
    (t.prototype._initToolbarItems = function () {
      (this._gPaginated = this.addSvgButton(
        wjcCore.culture.Viewer.paginated,
        exports.icons.paginated,
        _ViewerActionType.TogglePaginated,
        !0
      )),
        (this._gPrint = this.addSvgButton(
          wjcCore.culture.Viewer.print,
          exports.icons.print,
          _ViewerActionType.Print
        )),
        (this._gExports = this.addSvgButton(
          wjcCore.culture.Viewer.exports,
          exports.icons.exports,
          _ViewerActionType.ShowExportsPanel
        )),
        this.addSeparator(),
        (this._gPortrait = this.addSvgButton(
          wjcCore.culture.Viewer.portrait,
          exports.icons.portrait,
          _ViewerActionType.Portrait
        )),
        (this._gLandscape = this.addSvgButton(
          wjcCore.culture.Viewer.landscape,
          exports.icons.landscape,
          _ViewerActionType.Landscape
        )),
        (this._gPageSetup = this.addSvgButton(
          wjcCore.culture.Viewer.pageSetup,
          exports.icons.pageSetup,
          _ViewerActionType.ShowPageSetupDialog
        )),
        this.addSeparator(),
        (this._gFirstPage = this.addSvgButton(
          wjcCore.culture.Viewer.firstPage,
          exports.icons.firstPage,
          _ViewerActionType.FirstPage
        )),
        (this._gPreviousPage = this.addSvgButton(
          wjcCore.culture.Viewer.previousPage,
          exports.icons.previousPage,
          _ViewerActionType.PrePage
        )),
        (this._gNextPage = this.addSvgButton(
          wjcCore.culture.Viewer.nextPage,
          exports.icons.nextPage,
          _ViewerActionType.NextPage
        )),
        (this._gLastPage = this.addSvgButton(
          wjcCore.culture.Viewer.lastPage,
          exports.icons.lastPage,
          _ViewerActionType.LastPage
        )),
        _ViewerToolbarBase._initToolbarPageNumberInput(
          this.hostElement,
          this.viewer
        ),
        this.addSeparator(),
        (this._gBackwardHistory = this.addSvgButton(
          wjcCore.culture.Viewer.backwardHistory,
          exports.icons.backwardHistory,
          _ViewerActionType.Backward
        )),
        (this._gForwardHistory = this.addSvgButton(
          wjcCore.culture.Viewer.forwardHistory,
          exports.icons.forwardHistory,
          _ViewerActionType.Forward
        )),
        this.addSeparator(),
        (this._gSelectTool = this.addSvgButton(
          wjcCore.culture.Viewer.selectTool,
          exports.icons.selectTool,
          _ViewerActionType.SelectTool
        )),
        (this._gMoveTool = this.addSvgButton(
          wjcCore.culture.Viewer.moveTool,
          exports.icons.moveTool,
          _ViewerActionType.MoveTool
        )),
        (this._gContinuousMode = this.addSvgButton(
          wjcCore.culture.Viewer.continuousMode,
          exports.icons.continuousView,
          _ViewerActionType.Continuous
        )),
        (this._gSingleMode = this.addSvgButton(
          wjcCore.culture.Viewer.singleMode,
          exports.icons.singleView,
          _ViewerActionType.Single
        )),
        this.addSeparator(),
        (this._gWholePage = this.addSvgButton(
          wjcCore.culture.Viewer.wholePage,
          exports.icons.fitWholePage,
          _ViewerActionType.FitWholePage
        )),
        (this._gPageWidth = this.addSvgButton(
          wjcCore.culture.Viewer.pageWidth,
          exports.icons.fitPageWidth,
          _ViewerActionType.FitPageWidth
        )),
        (this._gZoomOut = this.addSvgButton(
          wjcCore.culture.Viewer.zoomOut,
          exports.icons.zoomOut,
          _ViewerActionType.ZoomOut
        )),
        (this._gZoomIn = this.addSvgButton(
          wjcCore.culture.Viewer.zoomIn,
          exports.icons.zoomIn,
          _ViewerActionType.ZoomIn
        )),
        (this._gRubberbandTool = this.addSvgButton(
          wjcCore.culture.Viewer.rubberbandTool,
          exports.icons.rubberbandTool,
          _ViewerActionType.RubberbandTool
        )),
        (this._gMagnifierTool = this.addSvgButton(
          wjcCore.culture.Viewer.magnifierTool,
          exports.icons.magnifierTool,
          _ViewerActionType.MagnifierTool
        )),
        (this._gRotateDocument = this.addSvgButton(
          wjcCore.culture.Viewer.rotateDocument,
          exports.icons.rotateDocument,
          _ViewerActionType.RotateDocument
        )),
        (this._gRotatePage = this.addSvgButton(
          wjcCore.culture.Viewer.rotatePage,
          exports.icons.rotatePage,
          _ViewerActionType.RotatePage
        )),
        _ViewerToolbarBase._initToolbarZoomValue(this.hostElement, this.viewer),
        (this._gFullScreen = this.addSvgButton(
          wjcCore.culture.Viewer.fullScreen,
          exports.icons.fullScreen,
          _ViewerActionType.ToggleFullScreen,
          !0
        ));
    }),
    t
  );
})(_ViewerToolbarBase);
exports._ViewerToolbar = _ViewerToolbar;
var _ViewerMiniToolbar = (function (e) {
  function t(t, o) {
    return e.call(this, t, o) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._initToolbarItems = function () {
      (this._gPrint = this.addSvgButton(
        wjcCore.culture.Viewer.print,
        exports.icons.print,
        _ViewerActionType.Print
      )),
        this.addSeparator(),
        (this._gPreviousPage = this.addSvgButton(
          wjcCore.culture.Viewer.previousPage,
          exports.icons.previousPage,
          _ViewerActionType.PrePage
        )),
        (this._gNextPage = this.addSvgButton(
          wjcCore.culture.Viewer.nextPage,
          exports.icons.nextPage,
          _ViewerActionType.NextPage
        )),
        _ViewerToolbarBase._initToolbarPageNumberInput(
          this.hostElement,
          this.viewer
        ),
        this.addSeparator(),
        (this._gZoomOut = this.addSvgButton(
          wjcCore.culture.Viewer.zoomOut,
          exports.icons.zoomOut,
          _ViewerActionType.ZoomOut
        )),
        (this._gZoomIn = this.addSvgButton(
          wjcCore.culture.Viewer.zoomIn,
          exports.icons.zoomIn,
          _ViewerActionType.ZoomIn
        )),
        (this._gExitFullScreen = this.addSvgButton(
          wjcCore.culture.Viewer.exitFullScreen,
          exports.icons.exitFullScreen,
          _ViewerActionType.ToggleFullScreen,
          !0
        ));
    }),
    (t.prototype._globalize = function () {
      var e = wjcCore.culture.Viewer;
      (this._gPrint.title = e.print),
        (this._gPreviousPage.title = e.previousPage),
        (this._gNextPage.title = e.nextPage),
        (this._gZoomOut.title = e.zoomOut),
        (this._gZoomIn.title = e.zoomIn),
        (this._gExitFullScreen.title = e.exitFullScreen);
    }),
    t
  );
})(_ViewerToolbarBase);
exports._ViewerMiniToolbar = _ViewerMiniToolbar;
var _ViewerMobileToolbarBase = (function (e) {
  function t(t, o) {
    var n = e.call(this, t, o) || this;
    return wjcCore.addClass(n.hostElement, 'mobile'), n;
  }
  return __extends(t, e), t;
})(_ViewerToolbarBase);
exports._ViewerMobileToolbarBase = _ViewerMobileToolbarBase;
var _ViewerMobileToolbar = (function (e) {
  function t(t, o) {
    return e.call(this, t, o) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._initToolbarItems = function () {
      (this._gShowHamburgerMenu = this.addSvgButton(
        wjcCore.culture.Viewer.hamburgerMenu,
        exports.icons.hamburgerMenu,
        _ViewerActionType.ShowHamburgerMenu
      )),
        this.viewer._initHamburgerMenu(this._gShowHamburgerMenu),
        (this._gPrevPage = this.addSvgButton(
          wjcCore.culture.Viewer.previousPage,
          exports.icons.previousPage,
          _ViewerActionType.PrePage
        )),
        (this._gNextPage = this.addSvgButton(
          wjcCore.culture.Viewer.nextPage,
          exports.icons.nextPage,
          _ViewerActionType.NextPage
        )),
        _ViewerToolbarBase._initToolbarPageNumberInput(
          this.hostElement,
          this.viewer
        ),
        (this._gShowViewMenu = this.addSvgButton(
          wjcCore.culture.Viewer.viewMenu,
          exports.icons.viewMenu,
          _ViewerActionType.ShowViewMenu
        )),
        this.viewer._initViewMenu(this._gShowViewMenu),
        (this._gShowSearchBar = this.addSvgButton(
          wjcCore.culture.Viewer.showSearchBar,
          exports.icons.search,
          _ViewerActionType.ShowSearchBar,
          !0
        )),
        (this._gFullScreen = this.addSvgButton(
          wjcCore.culture.Viewer.fullScreen,
          exports.icons.fullScreen,
          _ViewerActionType.ToggleFullScreen,
          !0
        ));
    }),
    (t.prototype._globalize = function () {
      var e = wjcCore.culture.Viewer;
      (this._gShowHamburgerMenu.title = e.hamburgerMenu),
        (this._gPrevPage.title = e.previousPage),
        (this._gNextPage.title = e.nextPage),
        (this._gShowViewMenu.title = e.viewMenu),
        (this._gShowSearchBar.title = e.showSearchBar),
        (this._gFullScreen.title = e.fullScreen);
    }),
    t
  );
})(_ViewerMobileToolbarBase);
exports._ViewerMobileToolbar = _ViewerMobileToolbar;
var _ViewerZoomBar = (function (e) {
  function t(t, o) {
    var n = e.call(this, t, o) || this;
    return wjcCore.addClass(n.hostElement, 'wj-zoombar'), n;
  }
  return (
    __extends(t, e),
    (t.prototype._initToolbarItems = function () {
      (this._gZoomOut = this.addSvgButton(
        wjcCore.culture.Viewer.zoomOut,
        exports.icons.zoomOut,
        _ViewerActionType.ZoomOut
      )),
        _ViewerToolbarBase._initToolbarZoomValue(this.hostElement, this.viewer),
        (this._gZoomIn = this.addSvgButton(
          wjcCore.culture.Viewer.zoomIn,
          exports.icons.zoomIn,
          _ViewerActionType.ZoomIn
        ));
    }),
    (t.prototype._globalize = function () {
      var e = wjcCore.culture.Viewer;
      (this._gZoomOut.title = e.zoomOut), (this._gZoomIn.title = e.zoomIn);
    }),
    t
  );
})(_ViewerMobileToolbarBase);
exports._ViewerZoomBar = _ViewerZoomBar;
var _SearchBar = (function (e) {
  function t(t, o) {
    return e.call(this, t, o) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._initToolbarItems = function () {
      (this._gSearchOptions = this.addSvgButton(
        wjcCore.culture.Viewer.searchOptions,
        exports.icons.searchOptions,
        _ViewerActionType.ShowSearchOptions
      )),
        this.viewer._initSearchOptionsMenu(this._gSearchOptions),
        this._initSearchInput(),
        this._initSearchBtnGroups();
    }),
    (t.prototype._initSearchInput = function () {
      var e = this,
        t = _toDOM(
          '<div class="wj-searchcontainer"><input class="wj-searchbox" wj-part="search-box" type="text"/><div class="wj-btn-group"><button class="wj-btn wj-btn-search">' +
            _createSvgBtn(exports.icons.search).innerHTML +
            '</button></div></div>'
        ),
        o = t.querySelector('input[type="text"]'),
        n = t.querySelector('.wj-btn-search');
      _addEvent(o, 'input', function () {
        e.viewer._searchManager.text = o.value;
      }),
        _addEvent(n, 'click', function () {
          e.viewer._searchManager.search();
        }),
        this.viewer._searchManager.searchStarted.addHandler(function () {
          o.disabled = !0;
        }),
        this.viewer._searchManager.searchCompleted.addHandler(function () {
          o.disabled = !1;
        }),
        this.addCustomItem(t);
    }),
    (t.prototype._initSearchBtnGroups = function () {
      var e = _toDOM(
        '<div class="wj-searchbtn-groups wj-btn-group wj-toolbarwrapper"></div>'
      );
      (this._gSearchPrev = this.addSvgButton(
        wjcCore.culture.Viewer.searchPrev,
        exports.icons.searchLeft,
        _ViewerActionType.SearchPrev
      )),
        (this._gSearchNext = this.addSvgButton(
          wjcCore.culture.Viewer.searchNext,
          exports.icons.searchRight,
          _ViewerActionType.SearchNext
        )),
        e.appendChild(this._gSearchPrev),
        e.appendChild(this._gSearchNext),
        this.addCustomItem(e);
    }),
    (t.prototype._globalize = function () {
      var e = wjcCore.culture.Viewer;
      (this._gSearchOptions.title = e.searchOptions),
        (this._gSearchPrev.title = e.searchPrev),
        (this._gSearchNext.title = e.searchNext);
    }),
    t
  );
})(_ViewerMobileToolbarBase);
exports._SearchBar = _SearchBar;
var _RotateAngle;
!(function (e) {
  (e[(e.NoRotate = 0)] = 'NoRotate'),
    (e[(e.Rotation90 = 1)] = 'Rotation90'),
    (e[(e.Rotation180 = 2)] = 'Rotation180'),
    (e[(e.Rotation270 = 3)] = 'Rotation270');
})((_RotateAngle = exports._RotateAngle || (exports._RotateAngle = {})));
var _Page = (function () {
  function e(e, t, o) {
    (this._content = null),
      (this._rotateAngle = _RotateAngle.NoRotate),
      (this.linkClicked = new wjcCore.Event()),
      (this._documentSource = e),
      (this._index = t),
      (this._size = o);
  }
  return (
    Object.defineProperty(e.prototype, 'index', {
      get: function () {
        return this._index;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'size', {
      get: function () {
        return this._size;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'rotateAngle', {
      get: function () {
        return this._rotateAngle;
      },
      set: function (e) {
        this._rotateAngle = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'content', {
      get: function () {
        return this._content;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getContent = function () {
      var e = this,
        t = new _Promise(),
        o = this._documentSource;
      return o
        ? this._content
          ? (t.resolve(this._content), t)
          : (o
              .renderToFilter({
                format: 'html',
                paged: o.paginated,
                outputRange: (this.index + 1).toString(),
              })
              .then(function (n) {
                if (e._documentSource === o) {
                  var r,
                    i,
                    a = document.createElement('div');
                  a.innerHTML = e._addGlobalUniqueId(n.responseText);
                  var s,
                    c = a.querySelector('section');
                  for (
                    c &&
                      c.style &&
                      (s = {
                        width: new _Unit(c.style.width),
                        height: new _Unit(c.style.height),
                      }),
                      r = a.querySelector('svg'),
                      i = document.createElementNS(
                        'http://www.w3.org/2000/svg',
                        'g'
                      );
                    r.hasChildNodes();

                  )
                    i.appendChild(r.firstChild);
                  r.appendChild(i),
                    (e._size = s),
                    (e._content = r),
                    e._replaceActionLinks(r),
                    t.resolve(e._content);
                }
              }),
            t)
        : (t.reject(wjcCore.culture.Viewer.cannotRenderPageNoDoc), t);
    }),
    (e.prototype._onLinkClicked = function (e) {
      this.linkClicked.raise(this, e);
    }),
    (e.prototype._replaceActionLinks = function (t) {
      for (
        var o = this, n = t.querySelectorAll('a'), r = 0;
        r < n.length;
        r++
      ) {
        var i = n.item(r),
          a = i.href ? i.href.baseVal : '';
        if (a.indexOf('navigate') > 0) {
          var s = e._bookmarkReg.exec(a);
          s &&
            (s[1] && s[1].length > 0
              ? ((i.href.baseVal = e._invalidHref),
                i.setAttribute(e._bookmarkAttr, s[1]),
                _addEvent(i, 'click', function () {
                  o._onLinkClicked(new _LinkClickedEventArgs(this));
                }))
              : i.removeAttribute('xlink:href'));
        } else
          e._customActionReg.test(a) &&
            ((i.href.baseVal = e._invalidHref),
            i.setAttribute(e._customActionAttr, a.substr(3)),
            _addEvent(i, 'click', function () {
              o._onLinkClicked(new _LinkClickedEventArgs(this));
            }));
      }
    }),
    (e.prototype._addGlobalUniqueId = function (t) {
      var o = new Date().getTime().toString();
      return (
        (t = t.replace(e._idReg, '$1$2' + o + '$3$4')),
        (t = t.replace(e._idReferReg, '$1$2' + o + '$3$4'))
      );
    }),
    (e._bookmarkReg = /javascript\:navigate\(['|"](.*)['|"]\)/),
    (e._bookmarkAttr = 'bookmark'),
    (e._customActionReg = /^CA\:/),
    (e._customActionAttr = 'customAction'),
    (e._idReg = /(\<[^\>]+)(id=['|"])(\w+)(['|"])/g),
    (e._idReferReg = /(\<[^\>]+)(url\(#)(\w+)(\))/g),
    (e._invalidHref = 'javascript:void(0)'),
    e
  );
})();
exports._Page = _Page;
var _CompositePageView = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    (o._viewMode = ViewMode.Single),
      (o.pageIndexChanged = new wjcCore.Event()),
      (o.zoomFactorChanged = new wjcCore.Event()),
      (o.zoomModeChanged = new wjcCore.Event()),
      (o.positionChanged = new wjcCore.Event()),
      (o.rotateAngleChanged = new wjcCore.Event());
    var n;
    return (
      (n = o.getTemplate()),
      o.applyTemplate('wj-viewpanel-container', n, {
        _singlePageView: 'single-pageview',
        _continuousPageView: 'continuous-pageview',
      }),
      o._initPageView(),
      o
    );
  }
  return (
    __extends(t, e),
    (t.prototype.applyTemplate = function (e, t, o) {
      var n = this.hostElement;
      if ((wjcCore.addClass(n, e), n.appendChild(_toDOMs(t)), o))
        for (var r in o) {
          var i = o[r];
          if (
            ((this[r] = n.querySelector('[wj-part="' + i + '"]')),
            null == this[r] && n.getAttribute('wj-part') == i && (this[r] = t),
            null == this[r])
          )
            throw 'Missing template part: "' + i + '"';
        }
      return n;
    }),
    Object.defineProperty(t.prototype, 'pageIndex', {
      get: function () {
        return this._activePageView.pageIndex;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pages', {
      get: function () {
        return this._activePageView.pages;
      },
      set: function (e) {
        this._activePageView.pages = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'zoomMode', {
      get: function () {
        return this._activePageView.zoomMode;
      },
      set: function (e) {
        this._activePageView.zoomMode = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'zoomFactor', {
      get: function () {
        return this._activePageView.zoomFactor;
      },
      set: function (e) {
        this._activePageView.zoomFactor = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'panMode', {
      get: function () {
        return this._activePageView.panMode;
      },
      set: function (e) {
        this._activePageView.panMode = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'viewMode', {
      get: function () {
        return this._viewMode;
      },
      set: function (e) {
        this._viewMode !== e &&
          ((this._viewMode = e), this._updateActivePageView());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'scrollTop', {
      get: function () {
        return this._activePageView.scrollTop;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'scrollLeft', {
      get: function () {
        return this._activePageView.scrollLeft;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_activePageViewElement', {
      get: function () {
        return this.viewMode === ViewMode.Single
          ? this._singlePageView
          : this._continuousPageView;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onPageIndexChanged = function () {
      this.pageIndexChanged.raise(this);
    }),
    (t.prototype.onZoomFactorChanged = function (e, t) {
      this.zoomFactorChanged.raise(this, { oldValue: e, newValue: t });
    }),
    (t.prototype.onZoomModeChanged = function (e, t) {
      this.zoomModeChanged.raise(this, { oldValue: e, newValue: t });
    }),
    (t.prototype.onPositionChanged = function () {
      this.positionChanged.raise(this);
    }),
    (t.prototype.onRotateAngleChanged = function () {
      this.rotateAngleChanged.raise(this);
    }),
    (t.prototype._updateActivePageView = function () {
      var e = this._activePageView.pageIndex,
        t = this._activePageView.pages,
        o = this._activePageView.zoomFactor,
        n = this._activePageView.zoomMode,
        r = this._activePageView.panMode;
      this._removePageViewHandlers(this._activePageView),
        (this._activePageView = wjcCore.Control.getControl(
          this._activePageViewElement
        )),
        this._addPageViewHandlers(this._activePageView),
        this._activePageView.pages || (this._activePageView.pages = t),
        this._activePageView.invalidate(),
        this._activePageView.moveToPage(e),
        (this._activePageView.zoomFactor = o),
        (this._activePageView.zoomMode = n),
        (this._activePageView.panMode = r),
        this._updatePageViewsVisible();
    }),
    (t.prototype._initPageView = function () {
      (this._activePageView = new _SinglePageView(this._singlePageView)),
        this._addPageViewHandlers(this._activePageView),
        new _ContinuousPageView(this._continuousPageView),
        this._updatePageViewsVisible();
    }),
    (t.prototype._addPageViewHandlers = function (e) {
      var t = this;
      this._activePageView.pageIndexChanged.addHandler(function () {
        t.onPageIndexChanged();
      }),
        this._activePageView.zoomFactorChanged.addHandler(function (e, o) {
          t.onZoomFactorChanged(o.oldValue, o.newValue);
        }),
        this._activePageView.zoomModeChanged.addHandler(function (e, o) {
          t.onZoomModeChanged(o.oldValue, o.newValue);
        }),
        this._activePageView.positionChanged.addHandler(function () {
          t.onPositionChanged();
        }),
        this._activePageView.rotateAngleChanged.addHandler(function () {
          t.onRotateAngleChanged();
        });
    }),
    (t.prototype._removePageViewHandlers = function (e) {
      e.pageIndexChanged.removeHandler(this.onPageIndexChanged, this),
        e.zoomFactorChanged.removeHandler(this.onZoomFactorChanged, this),
        e.zoomModeChanged.removeHandler(this.onZoomModeChanged, this),
        e.positionChanged.removeHandler(this.onPositionChanged, this),
        e.rotateAngleChanged.removeHandler(this.onRotateAngleChanged, this);
    }),
    (t.prototype._updatePageViewsVisible = function () {
      this.viewMode === ViewMode.Single
        ? (wjcCore.removeClass(this._singlePageView, exports._hiddenCss),
          wjcCore.hasClass(this._continuousPageView, exports._hiddenCss) ||
            wjcCore.addClass(this._continuousPageView, exports._hiddenCss))
        : (wjcCore.removeClass(this._continuousPageView, exports._hiddenCss),
          wjcCore.hasClass(this._singlePageView, exports._hiddenCss) ||
            wjcCore.addClass(this._singlePageView, exports._hiddenCss));
    }),
    (t.prototype.moveToPage = function (e) {
      return this._activePageView.moveToPage(e);
    }),
    (t.prototype.moveToPosition = function (e) {
      return this._activePageView.moveToPosition(e);
    }),
    (t.prototype.rotatePageTo = function (e, t) {
      this._activePageView.rotatePageTo(e, t);
    }),
    (t.prototype.hitTest = function (e, t) {
      return this._activePageView.hitTest(e, t);
    }),
    (t.prototype.resetPages = function () {
      wjcCore.Control.getControl(this._singlePageView).resetPages(),
        wjcCore.Control.getControl(this._continuousPageView).resetPages();
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        wjcCore.Control.getControl(this._activePageViewElement).invalidate(),
        this._activePageView.refresh();
    }),
    (t.prototype.isPageContentLoaded = function (e) {
      return this._activePageView.isPageContentLoaded(e);
    }),
    (t.controlTemplate =
      '<div class="wj-pageview" wj-part="single-pageview"></div><div class="wj-pageview" wj-part="continuous-pageview"></div>'),
    t
  );
})(wjcCore.Control);
exports._CompositePageView = _CompositePageView;
var _PageViewBase = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    (o._autoHeightCalculated = !1),
      (o._startX = null),
      (o._startY = null),
      (o._panMode = !1),
      (o._pageIndex = -1),
      (o._zoomFactor = 1),
      (o._zoomMode = ZoomMode.Custom),
      (o._zoomModeUpdating = !1),
      (o.pageIndexChanged = new wjcCore.Event()),
      (o.zoomFactorChanged = new wjcCore.Event()),
      (o.zoomModeChanged = new wjcCore.Event()),
      (o.positionChanged = new wjcCore.Event()),
      (o.rotateAngleChanged = new wjcCore.Event());
    var n;
    return (
      (n = o.getTemplate()),
      o.applyTemplate('wj-pageview', n, o._getTemplateParts()),
      (o._fBorderBoxMode = 'border-box' === getComputedStyle(t).boxSizing),
      o._init(),
      o
    );
  }
  return (
    __extends(t, e),
    (t.prototype._getTemplateParts = function () {
      return { _pagesWrapper: 'pages-wrapper' };
    }),
    (t.prototype._getPagesContainer = function () {
      return this.hostElement;
    }),
    (t.prototype._init = function () {
      this._bindEvents();
    }),
    (t.prototype.dispose = function () {
      this._touchManager && this._touchManager.dispose(),
        e.prototype.dispose.call(this);
    }),
    (t.prototype._bindTouchEvents = function (e) {
      var t = this;
      e.touchStart.addHandler(function () {
        t.hostElement.focus();
      }),
        e.panMove.addHandler(function (t, o) {
          (e.hostElement.scrollTop -= o.clientDelta.y),
            (e.hostElement.scrollLeft -= o.clientDelta.x);
        }),
        e.pinch.addHandler(this._zoomByPinch, this);
    }),
    (t.prototype._initTouchEvents = function () {
      var e = this._pagesWrapper.parentElement,
        t = new _TouchManager(e);
      (this._touchManager = t), this._bindTouchEvents(t);
    }),
    Object.defineProperty(t.prototype, '_borderBoxMode', {
      get: function () {
        return this._fBorderBoxMode;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._zoomByPinch = function (e, t) {
      if ((t.preventDefault(), t.type == _TouchEventType.Move)) {
        var o = wjcCore.getElementRect(e.contentElement),
          n = getComputedStyle(e.contentElement),
          r = parseInt(n.marginTop),
          i = parseInt(n.marginLeft),
          a = _pointMove(!1, t.preCenterClient, o.left - i, o.top - r);
        this._zoom(e.hostElement, t.zoom, a, t.centerClientDelta);
      }
    }),
    (t.prototype._getFixedPosition = function (e) {
      return new wjcCore.Point(
        t._pageMargin,
        t._pageMargin + this._getAbovePageCount(e.y) * t._pageMargin
      );
    }),
    (t.prototype._getAbovePageCount = function (e) {
      return 0;
    }),
    (t.prototype._zoom = function (e, t, o, n) {
      var r = _pointMove(!1, o, e.scrollLeft, e.scrollTop),
        i = this._getFixedPosition(o),
        a = this.zoomFactor;
      this.zoomFactor = this.zoomFactor * t;
      var s = this.zoomFactor / a,
        c = _pointMove(
          !1,
          new wjcCore.Point((o.x - i.x) * s + i.x, (o.y - i.y) * s + i.y),
          _pointMove(!0, r, n)
        );
      (e.scrollTop = Math.round(c.y)), (e.scrollLeft = Math.round(c.x));
    }),
    Object.defineProperty(t.prototype, 'pageIndex', {
      get: function () {
        return this._pageIndex;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pages', {
      get: function () {
        return this._pages;
      },
      set: function (e) {
        (this._pages = e), this._reserveViewPage();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'scrollTop', {
      get: function () {
        return this.hostElement.scrollTop;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'scrollLeft', {
      get: function () {
        return this.hostElement.scrollLeft;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'zoomFactor', {
      get: function () {
        return this._zoomFactor;
      },
      set: function (e) {
        if (((e = Math.max(0.05, Math.min(10, e))), this._zoomFactor != e)) {
          var t = this._zoomFactor;
          (this._zoomFactor = e),
            this._updatePageViewTransform(),
            this._zoomModeUpdating || (this.zoomMode = ZoomMode.Custom),
            this._onZoomFactorChanged(t, e);
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'zoomMode', {
      get: function () {
        return this._zoomMode;
      },
      set: function (e) {
        if (this._zoomMode != e) {
          this._zoomModeUpdating = !0;
          var t = this._zoomMode;
          this._calcZoomModeZoom(e),
            (this._zoomMode = e),
            this._onZoomModeChanged(t, e),
            (this._zoomModeUpdating = !1);
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'panMode', {
      get: function () {
        return this._panMode;
      },
      set: function (e) {
        this._panMode != e && (this._panMode = e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._bindEvents = function () {
      var e = this;
      _addEvent(document, 'mousemove', function (t) {
        null !== e._startX && null !== e._startY && e._panning(t);
      }),
        _addEvent(document, 'mouseup', function (t) {
          e._stopPanning();
        }),
        this._initTouchEvents();
    }),
    (t.prototype._startPanning = function (e) {
      (this._startX = e.screenX), (this._startY = e.screenY);
    }),
    (t.prototype._panning = function (e) {
      var t = this._getPagesContainer();
      (t.scrollLeft += this._startX - e.screenX),
        (t.scrollTop += this._startY - e.screenY),
        (this._startX = e.screenX),
        (this._startY = e.screenY);
    }),
    (t.prototype._stopPanning = function () {
      (this._startX = null), (this._startY = null);
    }),
    (t.prototype._onPageIndexChanged = function () {
      this.pageIndexChanged.raise(this);
    }),
    (t.prototype._onZoomFactorChanged = function (e, t) {
      this.zoomFactorChanged.raise(this, { oldValue: e, newValue: t });
    }),
    (t.prototype._onZoomModeChanged = function (e, t) {
      this.zoomModeChanged.raise(this, { oldValue: e, newValue: t });
    }),
    (t.prototype._onPositionChanged = function () {
      this.positionChanged.raise(this);
    }),
    (t.prototype._onRotateAngleChanged = function () {
      this.rotateAngleChanged.raise(this);
    }),
    (t.prototype._onPageLoaded = function (e) {}),
    (t.prototype._renderViewPage = function (e, t) {
      var o,
        n = this,
        r = new _Promise();
      if (((t = t < 0 ? 0 : t), !e))
        return r.reject(wjcCore.culture.Viewer.cannotRenderPageNoViewPage), r;
      if ((_removeChildren(e), this._pages[t].content)) {
        var i = this._pages[t].content;
        return e.appendChild(i), this._setPageTransform(e, t), r.resolve(t), r;
      }
      return (
        (o = document.createElement('div')),
        (o.className = 'wj-loading'),
        (o.style.height = e.style.height),
        (o.style.lineHeight = e.style.height),
        (o.innerHTML = wjcCore.culture.Viewer.loading),
        e.appendChild(o),
        this._pages[t]
          .getContent()
          .then(function (o) {
            var i = o;
            _removeChildren(e),
              e.appendChild(i),
              n._setPageTransform(e, t),
              n._onPageLoaded(t),
              r.resolve(t);
          })
          .catch(function (e) {
            o.innerHTML = _getErrorMessage(e);
          }),
        r
      );
    }),
    (t.prototype._reserveViewPage = function () {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t.prototype._getViewPortHeight = function () {
      var e =
        this._pagesWrapper.currentStyle ||
        window.getComputedStyle(this._pagesWrapper);
      return (
        this.hostElement.offsetHeight -
        parseFloat(e.marginBottom) -
        parseFloat(e.marginTop)
      );
    }),
    (t.prototype._getViewPortWidth = function () {
      var e =
        this._pagesWrapper.currentStyle ||
        window.getComputedStyle(this._pagesWrapper);
      return (
        this.hostElement.offsetWidth -
        parseFloat(e.marginLeft) -
        parseFloat(e.marginRight)
      );
    }),
    (t.prototype._setPageTransform = function (e, t) {
      var o;
      if (e) {
        var n = this._getPageSize(t),
          r = this._pages[t].rotateAngle;
        (e.style.height = n.height.valueInPixel * this._zoomFactor + 'px'),
          (e.style.width = n.width.valueInPixel * this._zoomFactor + 'px'),
          (o = e.querySelector('g')) &&
            (o.parentNode.setAttribute(
              'height',
              n.height.valueInPixel * this._zoomFactor + 'px'
            ),
            o.parentNode.setAttribute(
              'width',
              n.width.valueInPixel * this._zoomFactor + 'px'
            ),
            _transformSvg(
              o.parentNode,
              this._pages[t].size.width.valueInPixel,
              this._pages[t].size.height.valueInPixel,
              this._zoomFactor,
              r
            ));
      }
    }),
    (t.prototype._addViewPage = function () {
      var e = this,
        t = document.createElement('div');
      return (
        (t.className = 'wj-view-page'),
        _addEvent(t, 'mousedown', function (t) {
          e._panMode && e._startPanning(t);
        }),
        _addEvent(t, 'dragstart', function (t) {
          e._panMode && t.preventDefault();
        }),
        this._pagesWrapper.appendChild(t),
        t
      );
    }),
    (t.prototype._getPageSize = function (e) {
      if (e < 0 || e >= this._pages.length) return null;
      var t = this._pages[e];
      return _getRotatedSize(t.size, t.rotateAngle);
    }),
    (t.prototype._render = function (e) {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t.prototype._moveToPagePosition = function (e) {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t.prototype._updatePageViewTransform = function () {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t.prototype._updatePageIndex = function (e) {
      this.pages &&
        ((e = this.resolvePageIndex(e)),
        this._pageIndex !== e &&
          ((this._pageIndex = e), this._onPageIndexChanged()));
    }),
    (t.prototype.moveToPage = function (e) {
      return this.moveToPosition({ pageIndex: e });
    }),
    (t.prototype.resolvePageIndex = function (e) {
      return Math.min((this.pages || []).length - 1, Math.max(e, 0));
    }),
    (t.prototype.moveToPosition = function (e) {
      var t = this,
        o = e.pageIndex || 0,
        n = new _Promise();
      return !this.pages || o < 0
        ? (n.resolve(o), n)
        : ((o = this.resolvePageIndex(o)),
          (e.pageIndex = o),
          o !== this._pageIndex
            ? (this._updatePageIndex(o), (n = this._render(o)))
            : n.resolve(o),
          n.then(function () {
            t._moveToPagePosition(e);
          }),
          n
            .then(function (e) {
              return o;
            })
            .then(function () {
              t._calcZoomModeZoom(), t._onPositionChanged();
            }));
    }),
    (t.prototype._calcZoomModeZoom = function (e) {
      switch (
        ((this._zoomModeUpdating = !0), (e = null == e ? this.zoomMode : e))
      ) {
        case ZoomMode.PageWidth:
          this._zoomToViewWidth();
          break;
        case ZoomMode.WholePage:
          this._zoomToView();
      }
      this._zoomModeUpdating = !1;
    }),
    (t.prototype._zoomToView = function () {
      var e = this._getViewPortHeight(),
        t = this._getViewPortWidth(),
        o = this._getPageSize(this.pageIndex);
      o &&
        (this.zoomFactor = Math.min(
          e / o.height.valueInPixel,
          t / o.width.valueInPixel
        ));
    }),
    (t.prototype._zoomToViewWidth = function () {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t.prototype._getTransformedPoint = function (e, t, o) {
      (t /= this.zoomFactor), (o /= this.zoomFactor);
      var n = this.pages[e],
        r = n.size;
      switch (n.rotateAngle) {
        case _RotateAngle.Rotation90:
          i = t;
          (t = r.height.valueInPixel - o), (o = i);
          break;
        case _RotateAngle.Rotation180:
          (t = r.height.valueInPixel - t), (o = r.width.valueInPixel - o);
          break;
        case _RotateAngle.Rotation270:
          var i = t;
          (t = o), (o = r.width.valueInPixel - i);
      }
      return new wjcCore.Point(o, t);
    }),
    (t.prototype._hitTestPagePosition = function (e) {
      if (!e || e.pageIndex < 0) return null;
      var o = e.y,
        n = e.x,
        r = e.pageIndex;
      (o -= t._pageMargin + t._pageBorderWidth),
        (n -= t._pageMargin + t._pageBorderWidth);
      var i = this._getTransformedPoint(e.pageIndex, o, n);
      (o = i.y), (n = i.x);
      var a = _pixelToTwip(o),
        s = _pixelToTwip(n),
        c = this.pages[r].size;
      return {
        pageIndex: r,
        x: s,
        y: a,
        hitWorkingArea:
          o >= 0 &&
          o <= c.height.valueInPixel &&
          n >= 0 &&
          n <= c.width.valueInPixel,
      };
    }),
    (t.prototype.rotatePageTo = function (e, t) {
      (this._pages[e].rotateAngle = t),
        this._updatePageViewTransform(),
        this._onRotateAngleChanged();
    }),
    (t.prototype.hitTest = function (e, t) {
      if (this._pointInViewPanelClientArea(e, t)) {
        var o = this._panelViewPntToPageView(e, t);
        return this._hitTestPagePosition(o);
      }
      return null;
    }),
    (t.prototype.resetPages = function () {
      (this._pageIndex = -1),
        (this._pages = null),
        _removeChildren(this._pagesWrapper),
        this._addViewPage(),
        this.invalidate();
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        (this._autoHeightCalculated = !1),
        !this.pages ||
          0 == this.pages.length ||
          this.pageIndex < 0 ||
          this.pageIndex >= this.pages.length ||
          (this._render(this.pageIndex), this._calcZoomModeZoom());
    }),
    (t.prototype.isPageContentLoaded = function (e) {
      var t = this.pages;
      return !!t && e >= 0 && e < t.length && !!t[e].content;
    }),
    (t.prototype._hitTestPageIndex = function (e) {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t.prototype._pointInViewPanelClientArea = function (e, t) {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t.prototype._panelViewPntToPageView = function (e, t) {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t._pageMargin = 30),
    (t._pageBorderWidth = 1),
    (t.controlTemplate =
      '<div class="wj-pages-wrapper" wj-part="pages-wrapper"></div>'),
    t
  );
})(wjcCore.Control);
exports._PageViewBase = _PageViewBase;
var _Scroller = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  return (
    __extends(t, e),
    (t.getScrollbarWidth = function (e) {
      var o, n;
      return (
        (t._scrollbarWidth && !e) ||
          (((o = document.createElement('div')).style.width = '50px'),
          (o.style.height = '50px'),
          (o.style.overflow = 'auto'),
          document.body.appendChild(o),
          ((n = document.createElement('div')).style.height = '60px'),
          o.appendChild(n),
          (t._scrollbarWidth = o.offsetWidth - o.clientWidth),
          document.body.removeChild(o)),
        t._scrollbarWidth
      );
    }),
    (t._scrollbarWidth = null),
    t
  );
})(wjcCore.Control);
exports._Scroller = _Scroller;
var _VScroller = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    (o._height = 100),
      (o._max = 100),
      (o._desiredValue = 0),
      (o.valueChanged = new wjcCore.Event());
    var n;
    return (
      (n = o.getTemplate()),
      o.applyTemplate(null, n, { _wrapper: 'wrapper' }),
      (o.hostElement.style.width = _Scroller.getScrollbarWidth() + 1 + 'px'),
      _addEvent(o.hostElement, 'scroll', function () {
        o.onValueChanged();
      }),
      o
    );
  }
  return (
    __extends(t, e),
    (t.prototype.onValueChanged = function () {
      this._desiredValue != this.value && this.valueChanged.raise(this);
    }),
    (t.prototype.preventScrollEvent = function () {
      this._desiredValue = this.hostElement.scrollTop;
    }),
    Object.defineProperty(t.prototype, 'height', {
      get: function () {
        return this._height;
      },
      set: function (e) {
        e !== this._height && ((this._height = e), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'value', {
      get: function () {
        return this.hostElement.scrollTop;
      },
      set: function (e) {
        (this.hostElement.scrollTop = e), this.preventScrollEvent();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'max', {
      get: function () {
        return this._max;
      },
      set: function (e) {
        this._max !== e && ((this._max = e), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0), e.prototype.refresh.call(this, t);
      var o = this._height + 'px';
      this.hostElement.style.height !== o &&
        (this.hostElement.style.height = o);
      var n = this._max + this.hostElement.clientHeight + 'px';
      this._wrapper.style.height !== n && (this._wrapper.style.height = n),
        this.preventScrollEvent();
    }),
    (t.controlTemplate =
      '<div class="wj-vscroller-wrapper" wj-part="wrapper"></div>'),
    t
  );
})(_Scroller);
exports._VScroller = _VScroller;
var _SinglePageView = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    return (
      (o._innerNavigating = !1),
      (o._virtualScrollMode = !0),
      wjcCore.addClass(t, 'wj-pageview-single'),
      o
    );
  }
  return (
    __extends(t, e),
    (t.prototype._init = function () {
      e.prototype._init.call(this), this._initScroller(), this._initEvents();
    }),
    (t.prototype._initScroller = function () {
      var e = this;
      new _VScroller(this._vscroller).valueChanged.addHandler(function () {
        setTimeout(function () {
          return e._doScrollerValueChanged();
        });
      });
    }),
    (t.prototype._initEvents = function () {
      var e = this;
      _addEvent(this._pagesContainer, 'wheel', function (t) {
        e._doContainerWheel(t);
      }),
        _addEvent(this._pagesContainer, 'scroll', function (t) {
          e._doContainerScroll();
        }),
        _addEvent(this._pagesContainer, 'keydown', function (t) {
          e._doContainerKeyDown();
        }),
        _addEvent(this._pagesContainer, 'click', function (t) {
          e._pagesContainer.focus();
        });
    }),
    (t.prototype._bindTouchEvents = function (t) {
      var o = this;
      e.prototype._bindTouchEvents.call(this, t),
        t.swipe.addHandler(function (e, t) {
          switch (t.direction) {
            case _TouchDirection.Down:
              var n = o.resolvePageIndex(o.pageIndex - 1);
              n != o.pageIndex && o.moveToPage(n);
              break;
            case _TouchDirection.Up:
              var r = o.resolvePageIndex(o.pageIndex + 1);
              r != o.pageIndex && o.moveToPage(r);
          }
        });
    }),
    (t.prototype._getTemplateParts = function () {
      return {
        _pagesWrapper: 'pages-wrapper',
        _pagesContainer: 'pages-container',
        _vscroller: 'vscroller',
      };
    }),
    (t.prototype.applyTemplate = function (e, t, o) {
      var n = this.hostElement;
      if ((wjcCore.addClass(n, e), n.appendChild(_toDOMs(t)), o))
        for (var r in o) {
          var i = o[r];
          if (
            ((this[r] = n.querySelector('[wj-part="' + i + '"]')),
            null == this[r] && n.getAttribute('wj-part') == i && (this[r] = t),
            null == this[r])
          )
            throw 'Missing template part: "' + i + '"';
        }
      return n;
    }),
    Object.defineProperty(t.prototype, 'virtualScrollMode', {
      get: function () {
        return this._virtualScrollMode;
      },
      set: function (e) {
        this._virtualScrollMode !== e &&
          ((this._virtualScrollMode = e), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_isScrollerVisible', {
      get: function () {
        return this._virtualScrollMode && this.pages && this.pages.length > 1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_scroller', {
      get: function () {
        return wjcCore.Control.getControl(this._vscroller);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_hasPageVScrollBar', {
      get: function () {
        return _hasScrollbar(this._pagesContainer);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_hasPageHScrollBar', {
      get: function () {
        return _hasScrollbar(this._pagesContainer, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._getPagesContainer = function () {
      return this._pagesContainer;
    }),
    (t.prototype._getPageHeightWithoutZoom = function (e) {
      var t = this._pagesContainer.clientHeight,
        o =
          this._getPageSize(e).height.valueInPixel +
          2 * _PageViewBase._pageMargin;
      return Math.max(o, t);
    }),
    (t.prototype._updateScroller = function () {
      if (this._isScrollerVisible) {
        var e = this._scroller;
        e.height = this._pagesContainer.clientHeight;
        for (var t = 0, o = 0; o < this.pages.length; o++)
          t += this._getPageHeightWithoutZoom(o);
        (e.max = t), this._updateScrollerValue();
      }
    }),
    (t.prototype._updateScrollerValue = function () {
      if (this._isScrollerVisible) {
        var e = this.pageIndex;
        if (!(e < 0)) {
          var t = 0;
          this._pagesContainer.scrollTop > 0 &&
            (t =
              this._pagesContainer.scrollTop /
              (this._pagesContainer.scrollHeight -
                this._pagesContainer.clientHeight));
          for (
            var o = this._scroller, n = this.pages.length, r = 0, i = 0;
            i < e;
            i++
          )
            r += this._getPageHeightWithoutZoom(i);
          (r += this._getPageHeightWithoutZoom(e) * t),
            e >= n - 1 && !this._hasPageVScrollBar && (r = o.max),
            (o.value = r);
        }
      }
    }),
    (t.prototype._doScrollerValueChanged = function () {
      if (this._isScrollerVisible) {
        for (
          var e = this._scroller,
            t = this.pages.length,
            o = e.value,
            n = 0,
            r = 1;
          n < t;
          n++
        ) {
          var i = this._getPageHeightWithoutZoom(n);
          if (!(o > i)) {
            r = o / i;
            break;
          }
          o -= i;
        }
        n >= t && (n = t - 1), this._innerMoveToPage(n, r);
      }
    }),
    (t.prototype._doContainerWheel = function (e) {
      if (this._isScrollerVisible && 0 != e.deltaY) {
        var t = e.deltaY < 0;
        if (this._hasPageVScrollBar)
          if (t) {
            if (this._pagesContainer.scrollTop > 0) return;
          } else if (
            this._pagesContainer.scrollTop <
            this._pagesContainer.scrollHeight -
              this._pagesContainer.clientHeight
          )
            return;
        t
          ? this._innerMoveToPreviousPageAtBottom(e)
          : this._innerMoveToNextPageAtTop(e);
      }
    }),
    (t.prototype._doContainerScroll = function () {
      this._isScrollerVisible &&
        this._pagesContainer.scrollTop != this._desiredPageScrollTop &&
        (this._updateScrollerValue(), this._onPositionChanged());
    }),
    (t.prototype._doContainerKeyDown = function () {
      if (this._isScrollerVisible) {
        var e = event;
        if (this._hasPageVScrollBar)
          switch (e.keyCode) {
            case wjcCore.Key.PageDown:
              this._pagesContainer.scrollTop >=
                this._pagesContainer.scrollHeight -
                  this._pagesContainer.clientHeight &&
                this._innerMoveToNextPageAtTop(e);
              break;
            case wjcCore.Key.PageUp:
              0 == this._pagesContainer.scrollTop &&
                this._innerMoveToPreviousPageAtBottom(e);
          }
        else
          switch (e.keyCode) {
            case wjcCore.Key.Down:
            case wjcCore.Key.PageDown:
              this._innerMoveToNextPageAtTop(e);
              break;
            case wjcCore.Key.Up:
            case wjcCore.Key.PageUp:
              this._innerMoveToPreviousPageAtBottom(e);
          }
      }
    }),
    (t.prototype._preventContainerScroll = function () {
      this._desiredPageScrollTop = this._pagesContainer.scrollTop;
    }),
    (t.prototype._innerMoveToPreviousPageAtBottom = function (e) {
      this.pageIndex > 0 &&
        (e && e.preventDefault(),
        this._innerMoveToPage(this.pageIndex - 1, 1),
        this._updateScrollerValue());
    }),
    (t.prototype._innerMoveToNextPageAtTop = function (e) {
      this.pageIndex < this.pages.length - 1 &&
        (e && e.preventDefault(),
        this._innerMoveToPage(this.pageIndex + 1, 0),
        this._updateScrollerValue());
    }),
    (t.prototype._innerMoveToPage = function (e, t) {
      var o = this;
      this._innerNavigating = !0;
      var n = { pageIndex: e };
      this.moveToPosition(n).then(function (e) {
        o._innerMoveToPagePosition(t), (o._innerNavigating = !1);
      });
    }),
    (t.prototype._innerMoveToPagePosition = function (e) {
      if (this._hasPageVScrollBar) {
        var t =
          (this._pagesContainer.scrollHeight -
            this._pagesContainer.clientHeight) *
          e;
        (this._pagesContainer.scrollTop = t), this._preventContainerScroll();
      }
    }),
    (t.prototype.moveToPosition = function (t) {
      var o = e.prototype.moveToPosition.call(this, t);
      return this._innerNavigating || this._updateScrollerValue(), o;
    }),
    (t.prototype._moveToPagePosition = function (e) {
      var t = e.pageBounds || { x: 0, y: 0, width: 0, height: 0 },
        o = e.pageBounds ? _PageViewBase._pageMargin : 0,
        n = this.pages[this.pageIndex],
        r = _getTransformedPosition(t, n.size, n.rotateAngle, this.zoomFactor);
      (this._pagesContainer.scrollTop = r.y + o),
        (this._pagesContainer.scrollLeft = r.x + o);
    }),
    (t.prototype._hitTestPageIndex = function (e) {
      return this.pageIndex;
    }),
    (t.prototype._pointInViewPanelClientArea = function (e, t) {
      return (
        e >= 0 &&
        t >= 0 &&
        e < this._pagesContainer.clientWidth &&
        t < this._pagesContainer.clientHeight
      );
    }),
    (t.prototype._panelViewPntToPageView = function (e, t) {
      if (this.pageIndex < 0) return null;
      var o = this._pagesContainer.scrollTop + t,
        n = 0;
      if (this._pagesContainer.scrollLeft > 0)
        n = this._pagesContainer.scrollLeft + e;
      else {
        var r = this._pagesContainer.getBoundingClientRect();
        n =
          e -
          (this._pagesWrapper.getBoundingClientRect().left - r.left) +
          _PageViewBase._pageMargin;
      }
      return { x: n, y: o, pageIndex: this.pageIndex };
    }),
    (t.prototype._render = function (e) {
      return this._renderViewPage(
        this._pagesWrapper.querySelector('.wj-view-page'),
        e
      );
    }),
    (t.prototype._guessPageIndex = function () {
      return this.pageIndex;
    }),
    (t.prototype._reserveViewPage = function () {
      _removeChildren(this._pagesWrapper),
        this._addViewPage(),
        this.invalidate();
    }),
    (t.prototype._updatePageViewTransform = function () {
      var e;
      (e = this._pagesWrapper.querySelector('.wj-view-page')),
        this._setPageTransform(e, this.pageIndex);
    }),
    (t.prototype._onPageLoaded = function (t) {
      e.prototype._onPageLoaded.call(this, t), this._updateScroller();
    }),
    (t.prototype._onZoomFactorChanged = function (t, o) {
      e.prototype._onZoomFactorChanged.call(this, t, o), this._updateScroller();
    }),
    (t.prototype._zoomToViewWidth = function () {
      var e, t;
      (e = this._getViewPortHeight()), (t = this._getViewPortWidth());
      var o = this._getPageSize(this.pageIndex);
      if (o) {
        var n = o.height.valueInPixel,
          r = o.width.valueInPixel;
        t / r > e / n && (t -= _Scroller.getScrollbarWidth()),
          (this.zoomFactor = t / r);
      }
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        this._isScrollerVisible
          ? wjcCore.addClass(this.hostElement, 'virtual')
          : wjcCore.removeClass(this.hostElement, 'virtual'),
        this._updateScroller();
    }),
    (t.controlTemplate =
      '<div class="wj-pageview-pagescontainer" wj-part="pages-container" tabindex="0">   <div class="wj-pages-wrapper" wj-part="pages-wrapper"></div></div><div class="wj-pageview-vscroller" wj-part="vscroller" tabindex="-1"></div> '),
    t
  );
})(_PageViewBase);
exports._SinglePageView = _SinglePageView;
var _ContinuousPageView = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    return wjcCore.addClass(t, 'wj-pageview-continuous'), o;
  }
  return (
    __extends(t, e),
    (t.prototype._init = function () {
      var t = this;
      e.prototype._init.call(this),
        _addEvent(this.hostElement, 'click', function (e) {
          t.hostElement.focus();
        }),
        _addEvent(this.hostElement, 'scroll', function () {
          t._onPositionChanged(),
            clearTimeout(t._scrollingTimer),
            (t._scrollingTimer = setTimeout(function () {
              t._ensurePageIndexPosition();
            }, 200));
        }),
        this.zoomFactorChanged.addHandler(function () {
          clearTimeout(t._zoomFactorTimer),
            (t._zoomFactorTimer = setTimeout(function () {
              t._ensurePageIndexPosition();
            }, 200));
        });
    }),
    (t.prototype.dispose = function () {
      clearTimeout(this._scrollingTimer),
        clearTimeout(this._zoomFactorTimer),
        this._disposeBodyStopSwipe && this._disposeBodyStopSwipe(),
        e.prototype.dispose.call(this);
    }),
    (t.prototype._stopSwip = function () {
      this._swipeSpeedReducer && this._swipeSpeedReducer.stop();
    }),
    (t.prototype._bindTouchEvents = function (t) {
      var o = this;
      e.prototype._bindTouchEvents.call(this, t),
        t.touchStart.addHandler(this._stopSwip, this),
        t.swipe.addHandler(function (e, n) {
          o._swipeSpeedReducer || (o._swipeSpeedReducer = new _SpeedReducer()),
            o._swipeSpeedReducer.start(n.speed.x, n.speed.y, function (e, n) {
              var r = t.hostElement.scrollLeft,
                i = t.hostElement.scrollTop;
              (t.hostElement.scrollLeft -= e),
                (t.hostElement.scrollTop -= n),
                r == t.hostElement.scrollLeft &&
                  i == t.hostElement.scrollTop &&
                  o._stopSwip();
            });
        });
      var n = new _TouchManager(document.body, !1),
        r = this._stopSwip.bind(this);
      _addEvent(document.body, 'mousedown', r, !0),
        n.touchStart.addHandler(r),
        (this._disposeBodyStopSwipe = function () {
          o._stopSwip(),
            _removeEvent(document.body, 'mousedown', r),
            n.touchStart.removeHandler(r),
            n.dispose(),
            (o._disposeBodyStopSwipe = null);
        });
    }),
    (t.prototype._getAbovePageCount = function (e) {
      return this._hitTestPageIndex(e);
    }),
    (t.prototype.refresh = function (t) {
      this._stopSwip(), e.prototype.refresh.call(this, t);
    }),
    (t.prototype._hitTestPageIndex = function (e) {
      if (!this.pages) return this.pageIndex;
      for (var t = 0, o = 0; t < this.pages.length; t++)
        if (
          ((o +=
            this._getPageSize(t).height.valueInPixel * this.zoomFactor +
            _PageViewBase._pageMargin),
          e < o)
        ) {
          if (o - e < 1) continue;
          break;
        }
      return Math.min(t, this.pages.length - 1);
    }),
    (t.prototype._guessPageIndex = function () {
      return this.pages &&
        this.hostElement.scrollHeight - this.hostElement.clientHeight <=
          this.hostElement.scrollTop
        ? this.pages.length - 1
        : this._hitTestPageIndex(this.hostElement.scrollTop);
    }),
    (t.prototype._render = function (e) {
      var o = this.pages.length,
        n = e - t._preFetchPageCount,
        r = e + t._preFetchPageCount,
        i = [];
      (n = n < 0 ? 0 : n), (r = r > o - 1 ? o - 1 : r);
      for (var a = n; a <= r; a++)
        i.push(
          this._renderViewPage(
            this._pagesWrapper.querySelectorAll('.wj-view-page').item(a),
            a
          )
        );
      return new _CompositedPromise(i);
    }),
    (t.prototype._moveToPagePosition = function (e) {
      this._stopSwip();
      for (
        var t = 0,
          o = 0,
          n = !e.pageBounds,
          r = e.pageBounds || { x: 0, y: 0, width: 0, height: 0 },
          i = n ? 0 : _PageViewBase._pageMargin,
          a = this.pages[this.pageIndex],
          s = 0;
        s < e.pageIndex;
        s++
      )
        (t +=
          this._getPageSize(s).height.valueInPixel * this.zoomFactor +
          _PageViewBase._pageMargin),
          this._borderBoxMode || (t += 2 * _PageViewBase._pageBorderWidth);
      var c = _getTransformedPosition(
        r,
        a.size,
        n ? _RotateAngle.NoRotate : a.rotateAngle,
        this.zoomFactor
      );
      (t += c.y + i),
        (o += c.x + i),
        (o += this._getPageViewOffsetLeft(e.pageIndex)),
        (this.hostElement.scrollTop = t),
        (this.hostElement.scrollLeft = o);
    }),
    (t.prototype._pointInViewPanelClientArea = function (e, t) {
      return (
        e >= 0 &&
        t >= 0 &&
        e < this.hostElement.clientWidth &&
        t < this.hostElement.clientHeight
      );
    }),
    (t.prototype._panelViewPntToPageView = function (e, t) {
      var o = this.hostElement.scrollTop + t,
        n = 0;
      if (this.hostElement.scrollLeft > 0) n = this.hostElement.scrollLeft + e;
      else {
        var r = this.hostElement.getBoundingClientRect();
        n =
          e -
          (this._pagesWrapper.getBoundingClientRect().left - r.left) +
          _PageViewBase._pageMargin;
      }
      var i = this._hitTestPageIndex(o);
      if (i < 0) return null;
      n -= this._getPageViewOffsetLeft(i);
      for (var a = 0; a < i; a++)
        (o -=
          this._getPageSize(a).height.valueInPixel * this.zoomFactor +
          _PageViewBase._pageMargin),
          this._borderBoxMode || (o -= 2 * _PageViewBase._pageBorderWidth);
      return { x: n, y: o, pageIndex: i };
    }),
    (t.prototype._reserveViewPage = function () {
      _removeChildren(this._pagesWrapper);
      for (var e = 0; e < (this.pages || []).length; e++) {
        var t = this._addViewPage(),
          o = this._getPageSize(e);
        (t.style.height = o.height.valueInPixel * this.zoomFactor + 'px'),
          (t.style.width = o.width.valueInPixel * this.zoomFactor + 'px');
      }
    }),
    (t.prototype._updatePageViewTransform = function () {
      var e;
      e = this._pagesWrapper.querySelectorAll('.wj-view-page');
      for (var t = 0; t < e.length; t++) this._setPageTransform(e.item(t), t);
    }),
    (t.prototype._zoomToViewWidth = function () {
      if (0 != this.pages.length) {
        var e, t;
        (e = this._getViewPortHeight()), (t = this._getViewPortWidth());
        for (var o = 0, n = 0, r = 0; r < this.pages.length; r++) {
          var i = this._getPageSize(r);
          i.width.valueInPixel > o && (o = i.width.valueInPixel),
            (n += i.height.valueInPixel);
        }
        t / o > e / n && (t -= _Scroller.getScrollbarWidth()),
          (this.zoomFactor = t / o);
      }
    }),
    (t.prototype._ensurePageIndexPosition = function () {
      var e = this._guessPageIndex();
      this.pageIndex !== e && (this._render(e), this._updatePageIndex(e));
    }),
    (t.prototype._getPageViewOffsetLeft = function (e) {
      var t = this._pagesWrapper.querySelectorAll('.wj-view-page').item(e);
      return t ? t.offsetLeft - this._pagesWrapper.offsetLeft : 0;
    }),
    (t._preFetchPageCount = 3),
    t
  );
})(_PageViewBase);
exports._ContinuousPageView = _ContinuousPageView;
var _SideTabs = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    (o._idCounter = 0),
      (o._tabPages = []),
      (o._tabPageDic = {}),
      (o.tabPageActived = new wjcCore.Event()),
      (o.tabPageVisibilityChanged = new wjcCore.Event()),
      (o.expanded = new wjcCore.Event()),
      (o.collapsed = new wjcCore.Event());
    var n = o.getTemplate();
    return (
      o.applyTemplate('wj-control', n, {
        _headersContainer: 'wj-headers',
        _contentsContainer: 'wj-contents',
      }),
      o
    );
  }
  return (
    __extends(t, e),
    (t.prototype.applyTemplate = function (e, t, o) {
      var n = this.hostElement;
      if ((wjcCore.addClass(n, e), n.appendChild(_toDOMs(t)), o))
        for (var r in o) {
          var i = o[r];
          if (
            ((this[r] = n.querySelector('[wj-part="' + i + '"]')),
            null == this[r] && n.getAttribute('wj-part') == i && (this[r] = t),
            null == this[r])
          )
            throw 'Missing template part: "' + i + '"';
        }
      return n;
    }),
    Object.defineProperty(t.prototype, 'tabPages', {
      get: function () {
        return this._tabPages;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getTabPage = function (e) {
      return this._tabPageDic[e];
    }),
    (t.prototype.getFirstShownTabPage = function (e) {
      var t;
      return (
        this._tabPages.some(function (o) {
          return !o.isHidden && o !== e && ((t = o), !0);
        }),
        t
      );
    }),
    Object.defineProperty(t.prototype, 'visibleTabPagesCount', {
      get: function () {
        var e = 0;
        return (
          this._tabPages.forEach(function (t) {
            t.isHidden || e++;
          }),
          e
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'activedTabPage', {
      get: function () {
        var e;
        return (
          this._tabPages.some(function (t) {
            return !!t.isActived && ((e = t), !0);
          }),
          e
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.removePage = function (e) {
      var t;
      if ((t = 'string' == typeof e ? this.getTabPage(e) : e)) {
        var o = t.id,
          n = this._tabPages.indexOf(t);
        if (!(n < 0)) {
          if (
            (this._tabPages.splice(n, 1),
            (this._tabPageDic[o] = void 0),
            !this.isCollapsed && t.isActived)
          ) {
            var r = this.getFirstShownTabPage();
            r ? this.active(r) : this.collapse();
          }
          this._headersContainer.removeChild(t.header),
            this._contentsContainer.removeChild(t.outContent);
        }
      }
    }),
    (t.prototype.addPage = function (e, t, o) {
      var n = this,
        r = this._getNewTabPageId(),
        i = document.createElement('li'),
        a = _toDOM(
          '<div class="wj-tabpane"><div class="wj-tabtitle-wrapper"><h3 class="wj-tabtitle">' +
            e +
            '</h3><span class="wj-close">×</span></div><div class="wj-tabcontent-wrapper"><div class="wj-tabcontent-inner"></div></div></div>'
        ),
        s = _createSvgBtn(t);
      i.appendChild(s),
        (o = null == o ? this._tabPages.length : o),
        (o = Math.min(Math.max(o, 0), this._tabPages.length)) >=
        this._tabPages.length
          ? (this._headersContainer.appendChild(i),
            this._contentsContainer.appendChild(a))
          : (this._headersContainer.insertBefore(i, this._tabPages[o].header),
            this._contentsContainer.insertBefore(
              a,
              this._tabPages[o].outContent
            )),
        _addEvent(a.querySelector('.wj-close'), 'click', function () {
          n.collapse();
        }),
        _addEvent(i.querySelector('a'), 'click,keydown', function (e) {
          var t = n.getTabPage(r);
          t &&
            (('keydown' === e.type && e.keyCode === wjcCore.Key.Enter) ||
              'click' === e.type) &&
            n.active(t);
        });
      var c = new _TabPage(a, i, r);
      return (
        o >= this._tabPages.length
          ? this._tabPages.push(c)
          : this._tabPages.splice(o, 0, c),
        (this._tabPageDic[r] = c),
        this.isCollapsed || this.activedTabPage || this.active(c),
        c
      );
    }),
    Object.defineProperty(t.prototype, 'isCollapsed', {
      get: function () {
        return wjcCore.hasClass(this.hostElement, t._collapsedCss);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.hide = function (e) {
      var t = 'string' == typeof e ? this.getTabPage(e) : e;
      t &&
        (wjcCore.hasClass(t.header, exports._hiddenCss) ||
          (wjcCore.addClass(t.header, exports._hiddenCss),
          this.onTabPageVisibilityChanged(t),
          this.deactive(t)));
    }),
    (t.prototype.show = function (e) {
      var t = 'string' == typeof e ? this.getTabPage(e) : e;
      t &&
        wjcCore.hasClass(t.header, exports._hiddenCss) &&
        (wjcCore.removeClass(t.header, exports._hiddenCss),
        this.onTabPageVisibilityChanged(t),
        this.isCollapsed || this.activedTabPage || this.active(t));
    }),
    (t.prototype.deactive = function (e) {
      var o = 'string' == typeof e ? this.getTabPage(e) : e;
      if (o && o.isActived) {
        wjcCore.removeClass(o.outContent, t._activedCss),
          _checkImageButton(o.header.querySelector('a'), !1);
        var n = this.getFirstShownTabPage(o);
        n ? this.active(n) : this.collapse();
      }
    }),
    (t.prototype.active = function (e) {
      var o = 'string' == typeof e ? this.getTabPage(e) : e;
      o &&
        (this.expand(),
        o.isActived ||
          (this._clearActiveStyles(),
          this.show(o),
          wjcCore.addClass(o.outContent, t._activedCss),
          _checkImageButton(o.header.querySelector('a'), !0),
          this.onTabPageActived()));
    }),
    (t.prototype.enable = function (e, t) {
      void 0 === t && (t = !0);
      var o = 'string' == typeof e ? this.getTabPage(e) : e;
      o && o.enable(t);
    }),
    (t.prototype.enableAll = function (e) {
      void 0 === e && (e = !0),
        this._tabPages.forEach(function (t) {
          t.enable(e);
        });
    }),
    (t.prototype.onTabPageActived = function () {
      this.tabPageActived.raise(this, new wjcCore.EventArgs());
    }),
    (t.prototype.onTabPageVisibilityChanged = function (e) {
      this.tabPageVisibilityChanged.raise(this, { tabPage: e });
    }),
    (t.prototype.onExpanded = function () {
      this.expanded.raise(this, new wjcCore.EventArgs());
    }),
    (t.prototype.onCollapsed = function () {
      this.collapsed.raise(this, new wjcCore.EventArgs());
    }),
    (t.prototype.collapse = function () {
      this.isCollapsed ||
        (this._clearActiveStyles(),
        wjcCore.addClass(this.hostElement, t._collapsedCss),
        this.onCollapsed());
    }),
    (t.prototype.expand = function () {
      if (this.isCollapsed) {
        if (
          (wjcCore.removeClass(this.hostElement, t._collapsedCss),
          !this.activedTabPage)
        ) {
          var e = this.getFirstShownTabPage();
          e && this.active(e);
        }
        this.onExpanded();
      }
    }),
    (t.prototype.toggle = function () {
      this.isCollapsed ? this.expand() : this.collapse();
    }),
    (t.prototype._clearActiveStyles = function () {
      this._tabPages.forEach(function (e) {
        wjcCore.removeClass(e.outContent, t._activedCss),
          _checkImageButton(e.header.querySelector('a'), !1);
      });
    }),
    (t.prototype._getNewTabPageId = function () {
      for (; this._tabPageDic[(this._idCounter++).toString()]; );
      return this._idCounter.toString();
    }),
    (t._activedCss = 'active'),
    (t._collapsedCss = 'collapsed'),
    (t.controlTemplate =
      '<ul class="wj-nav wj-btn-group" wj-part="wj-headers"></ul><div class="wj-tabcontent" wj-part="wj-contents"></div>'),
    t
  );
})(wjcCore.Control);
exports._SideTabs = _SideTabs;
var _TabPage = (function () {
  function e(e, t, o) {
    (this._header = t),
      (this._outContent = e),
      (this._content = e.querySelector('.wj-tabcontent-inner')),
      (this._id = o);
  }
  return (
    Object.defineProperty(e.prototype, 'isActived', {
      get: function () {
        return wjcCore.hasClass(this.outContent, _SideTabs._activedCss);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isHidden', {
      get: function () {
        return wjcCore.hasClass(this.header, exports._hiddenCss);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'id', {
      get: function () {
        return this._id;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'header', {
      get: function () {
        return this._header;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'content', {
      get: function () {
        return this._content;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'outContent', {
      get: function () {
        return this._outContent;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.enable = function (e) {
      void 0 === e && (e = !0),
        wjcCore.enable(this._header, e),
        wjcCore.enable(this._content, e);
    }),
    (e.prototype.format = function (e) {
      e(this);
    }),
    e
  );
})();
exports._TabPage = _TabPage;
var _ViewerMenuBase = (function (e) {
  function t(t, o, n) {
    var r = e.call(this, document.createElement('div'), n) || this;
    return (
      (r.owner = o),
      (r.hostElement.style.display = 'none'),
      r.owner.appendChild(r.hostElement),
      (r.showDropDownButton = !1),
      r.itemClicked.addHandler(r._onItemClicked, r),
      r.formatItem.addHandler(r._formatItem, r),
      (r._viewer = t),
      (r.displayMemberPath = 'title'),
      (r.selectedValuePath = 'commandTag'),
      r._bindMenuItems(),
      r._viewer._viewerActionStatusChanged.addHandler(function (e, t) {
        var o = r.dropDown.querySelector(
          '[' +
            exports._commandTagAttr +
            '="' +
            t.action.actionType.toString() +
            '"]'
        );
        r._updateActionStatusCore(o, t.action);
      }),
      r
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'viewer', {
      get: function () {
        return this._viewer;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._bindMenuItems = function () {
      this.itemsSource = this._initItems();
    }),
    (t.prototype._initItems = function () {
      throw wjcCore.culture.Viewer.abstractMethodException;
    }),
    (t.prototype._internalFormatItem = function (e, t) {
      if (e && void 0 !== e.commandTag) {
        if ((_removeChildren(t), e.icon)) {
          var o = document.createElement('span');
          o.appendChild(_createSvgBtn(e.icon)), t.insertBefore(o, t.firstChild);
        }
        t.setAttribute(exports._commandTagAttr, e.commandTag.toString()),
          this._updateActionStatus(t, e.commandTag);
      }
    }),
    (t.prototype._formatItem = function (e, t) {
      this._internalFormatItem(this.itemsSource[t.index], t.item);
    }),
    (t.prototype._onItemClicked = function (e) {
      this._viewer._executeAction(parseInt(e.selectedItem.commandTag));
    }),
    (t.prototype._updateActionStatus = function (e, t) {
      this._updateActionStatusCore(e, {
        actionType: t,
        checked: this._viewer._actionIsChecked(t),
        disabled: this._viewer._actionIsDisabled(t),
        shown: this._viewer._actionIsShown(t),
      });
    }),
    (t.prototype._updateActionStatusCore = function (e, t) {
      _checkImageButton(e, t.checked),
        _disableImageButton(e, t.disabled),
        _showImageButton(e, t.shown);
    }),
    (t.prototype._updateItemsStatus = function () {
      for (
        var e = this.dropDown.querySelectorAll(
            '[' + exports._commandTagAttr + ']'
          ),
          t = 0;
        t < e.length;
        t++
      ) {
        var o = e[t],
          n = o.getAttribute(exports._commandTagAttr);
        null != n && this._updateActionStatus(o, parseInt(n));
      }
      _checkSeparatorShown(this.dropDown);
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        t && this._bindMenuItems(),
        this.isDroppedDown && this.showMenu();
    }),
    (t.prototype.showMenu = function (e) {
      (this.selectedIndex = -1),
        wjcCore.showPopup(this.dropDown, this.owner, e, !1, !1),
        (this.dropDown.style.color = this._viewer.hostElement.style.color),
        wjcCore.addClass(this.dropDown, 'wj-btn-group-vertical'),
        wjcCore.addClass(this.dropDown, 'wj-viewer-menu'),
        this._updateItemsStatus(),
        this.dropDown.focus();
    }),
    t
  );
})(wjcInput.Menu);
exports._ViewerMenuBase = _ViewerMenuBase;
var _HamburgerMenu = (function (e) {
  function t(t, o, n) {
    return e.call(this, t, o, n) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._initItems = function () {
      var e = [];
      return (
        e.push({
          title: wjcCore.culture.Viewer.thumbnails,
          icon: exports.icons.thumbnails,
          commandTag: _ViewerActionType.ShowThumbnails,
        }),
        e.push({
          title: wjcCore.culture.Viewer.outlines,
          icon: exports.icons.outlines,
          commandTag: _ViewerActionType.ShowOutlines,
        }),
        e.push({
          title: wjcCore.culture.Viewer.exports,
          icon: exports.icons.exports,
          commandTag: _ViewerActionType.ShowExportsPanel,
        }),
        e.push({ title: ViewerBase._seperatorHtml }),
        e.push({
          title: wjcCore.culture.Viewer.portrait,
          icon: exports.icons.portrait,
          commandTag: _ViewerActionType.Portrait,
        }),
        e.push({
          title: wjcCore.culture.Viewer.landscape,
          icon: exports.icons.landscape,
          commandTag: _ViewerActionType.Landscape,
        }),
        e.push({
          title: wjcCore.culture.Viewer.pageSetup,
          icon: exports.icons.pageSetup,
          commandTag: _ViewerActionType.ShowPageSetupPanel,
        }),
        e.push({ title: ViewerBase._seperatorHtml }),
        e.push({
          title: wjcCore.culture.Viewer.showZoomBar,
          icon: exports.icons.showZoomBar,
          commandTag: _ViewerActionType.ShowZoomBar,
        }),
        e.push({ title: ViewerBase._seperatorHtml }),
        e.push({
          title: wjcCore.culture.Viewer.paginated,
          icon: exports.icons.paginated,
          commandTag: _ViewerActionType.TogglePaginated,
        }),
        e.push({
          title: wjcCore.culture.Viewer.print,
          icon: exports.icons.print,
          commandTag: _ViewerActionType.Print,
        }),
        e.push({ title: ViewerBase._seperatorHtml }),
        e.push({
          title: wjcCore.culture.Viewer.backwardHistory,
          icon: exports.icons.backwardHistory,
          commandTag: _ViewerActionType.Backward,
        }),
        e.push({
          title: wjcCore.culture.Viewer.forwardHistory,
          icon: exports.icons.forwardHistory,
          commandTag: _ViewerActionType.Forward,
        }),
        e
      );
    }),
    t
  );
})(_ViewerMenuBase);
exports._HamburgerMenu = _HamburgerMenu;
var _ViewMenu = (function (e) {
  function t(t, o, n) {
    return e.call(this, t, o, n) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._initItems = function () {
      var e = [];
      return (
        e.push({
          title: wjcCore.culture.Viewer.singleMode,
          icon: exports.icons.singleView,
          commandTag: _ViewerActionType.Single,
        }),
        e.push({
          title: wjcCore.culture.Viewer.continuousMode,
          icon: exports.icons.continuousView,
          commandTag: _ViewerActionType.Continuous,
        }),
        e.push({ title: ViewerBase._seperatorHtml }),
        e.push({
          title: wjcCore.culture.Viewer.wholePage,
          icon: exports.icons.fitWholePage,
          commandTag: _ViewerActionType.FitWholePage,
        }),
        e.push({
          title: wjcCore.culture.Viewer.pageWidth,
          icon: exports.icons.fitPageWidth,
          commandTag: _ViewerActionType.FitPageWidth,
        }),
        e
      );
    }),
    t
  );
})(_ViewerMenuBase);
exports._ViewMenu = _ViewMenu;
var _SearchOptionsMenu = (function (e) {
  function t(t, o, n) {
    return e.call(this, t, o, n) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._initItems = function () {
      var e = [];
      return (
        e.push({
          title: wjcCore.culture.Viewer.wholeWordMenuItem,
          commandTag: _ViewerActionType.SearchMatchWholeWord,
        }),
        e.push({
          title: wjcCore.culture.Viewer.matchCaseMenuItem,
          commandTag: _ViewerActionType.SearchMatchCase,
        }),
        e
      );
    }),
    (t.prototype._internalFormatItem = function (t, o) {
      if (
        (e.prototype._internalFormatItem.call(this, t, o),
        t && void 0 !== t.commandTag)
      ) {
        var n = document.createElement('span');
        (n.innerHTML = wjcCore.culture.Viewer.checkMark),
          wjcCore.addClass(n, 'checkIcon'),
          o.insertBefore(n, o.firstChild);
      }
    }),
    (t.prototype._updateActionStatus = function (t, o) {
      e.prototype._updateActionStatus.call(this, t, o),
        this.viewer._actionIsChecked(o) && wjcCore.addClass(t, 'checked');
    }),
    t
  );
})(_ViewerMenuBase);
exports._SearchOptionsMenu = _SearchOptionsMenu;
var MouseMode;
!(function (e) {
  (e[(e.SelectTool = 0)] = 'SelectTool'),
    (e[(e.MoveTool = 1)] = 'MoveTool'),
    (e[(e.RubberbandTool = 2)] = 'RubberbandTool'),
    (e[(e.MagnifierTool = 3)] = 'MagnifierTool');
})((MouseMode = exports.MouseMode || (exports.MouseMode = {})));
var ViewMode;
!(function (e) {
  (e[(e.Single = 0)] = 'Single'), (e[(e.Continuous = 1)] = 'Continuous');
})((ViewMode = exports.ViewMode || (exports.ViewMode = {})));
var ZoomMode;
!(function (e) {
  (e[(e.Custom = 0)] = 'Custom'),
    (e[(e.PageWidth = 1)] = 'PageWidth'),
    (e[(e.WholePage = 2)] = 'WholePage');
})((ZoomMode = exports.ZoomMode || (exports.ZoomMode = {})));
var _LinkClickedEventArgs = (function (e) {
  function t(t) {
    var o = e.call(this) || this;
    return (o._a = t), o;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'element', {
      get: function () {
        return this._a;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.EventArgs);
exports._LinkClickedEventArgs = _LinkClickedEventArgs;
var _HistoryManager = (function () {
  function e() {
    (this._items = [{}]),
      (this._position = 0),
      (this.statusChanged = new wjcCore.Event());
  }
  return (
    (e.prototype._onStatusChanged = function () {
      this.statusChanged.raise(this, new wjcCore.EventArgs());
    }),
    Object.defineProperty(e.prototype, 'current', {
      get: function () {
        return this._items[this._position];
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.clear = function () {
      (this._items = [{}]), (this._position = 0), this._onStatusChanged();
    }),
    (e.prototype.add = function () {
      this._items.splice(++this._position),
        this._items.push({}),
        this._onStatusChanged();
    }),
    (e.prototype.forward = function () {
      if (!this.canForward()) return null;
      var e = this._items[++this._position];
      return this._onStatusChanged(), e;
    }),
    (e.prototype.backward = function () {
      if (!this.canBackward()) return null;
      var e = this._items[--this._position];
      return this._onStatusChanged(), e;
    }),
    (e.prototype.canForward = function () {
      return this._position < this._items.length - 1;
    }),
    (e.prototype.canBackward = function () {
      return this._position > 0;
    }),
    e
  );
})();
exports._HistoryManager = _HistoryManager;
var ViewerBase = (function (e) {
  function t(t, o) {
    var n = e.call(this, t, o, !0) || this;
    return (
      (n._pages = []),
      (n._pageIndex = 0),
      (n._mouseMode = MouseMode.SelectTool),
      (n._viewMode = ViewMode.Single),
      (n._needBind = !1),
      (n._historyManager = new _HistoryManager()),
      (n._fullScreen = !1),
      (n._miniToolbarPinnedTimer = null),
      (n._autoHeightCalculated = !1),
      (n._searchManager = new _SearchManager()),
      (n._thresholdWidth = 767),
      (n._historyMoving = !1),
      (n._documentSourceChanged = new wjcCore.Event()),
      (n.pageIndexChanged = new wjcCore.Event()),
      (n.viewModeChanged = new wjcCore.Event()),
      (n.selectMouseModeChanged = new wjcCore.Event()),
      (n.mouseModeChanged = new wjcCore.Event()),
      (n.fullScreenChanged = new wjcCore.Event()),
      (n.zoomFactorChanged = new wjcCore.Event()),
      (n.queryLoadingData = new wjcCore.Event()),
      (n._viewerActionStatusChanged = new wjcCore.Event()),
      (n._documentEventKey = new Date().getTime().toString()),
      n._init(o),
      n
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'serviceUrl', {
      get: function () {
        return this._serviceUrl;
      },
      set: function (e) {
        e != this._serviceUrl &&
          ((this._serviceUrl = e),
          this._needBindDocumentSource(),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'filePath', {
      get: function () {
        return this._filePath;
      },
      set: function (e) {
        e != this._filePath &&
          ((this._filePath = e),
          this._needBindDocumentSource(),
          this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'thresholdWidth', {
      get: function () {
        return this._thresholdWidth;
      },
      set: function (e) {
        e != this._thresholdWidth &&
          ((this._thresholdWidth = e), this.invalidate());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, '_innerPaginated', {
      get: function () {
        return this._documentSource && !this._needBind
          ? this._documentSource.paginated
          : this._paginated;
      },
      set: function (e) {
        this._documentSource && !this._needBind
          ? this._setPaginated(e)
          : (this._paginated = null == e ? null : wjcCore.asBoolean(e)),
          this._setViewerAction(_ViewerActionType.TogglePaginated, !0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.reload = function () {
      this._needBindDocumentSource(), this.invalidate();
    }),
    (t.prototype.refresh = function (o) {
      if (
        (void 0 === o && (o = !0),
        e.prototype.refresh.call(this, o),
        this._needBind &&
          (this._setDocumentSource(this._getSource()), (this._needBind = !1)),
        o)
      ) {
        var n = wjcCore.Control.getControl(this._toolbar);
        n && n.refresh();
        var r = wjcCore.Control.getControl(this._miniToolbar);
        r && r.refresh();
        var i = wjcCore.Control.getControl(this._mobileToolbar);
        i && i.refresh();
        var a = wjcCore.Control.getControl(this._zoomBar);
        a && a.refresh();
        var s = wjcCore.Control.getControl(this._searchBar);
        s && s.refresh(),
          this._hamburgerMenu && this._hamburgerMenu.refresh(),
          this._viewMenu && this._viewMenu.refresh(),
          this._searchOptionsMenu && this._searchOptionsMenu.refresh(),
          (t._exportItems = null),
          this._updateExportTab(!0),
          this._globalize(),
          this._updateLayout();
      }
      this._resetMiniToolbarPosition(),
        this._resetToolbarWidth(),
        this._resetViewPanelContainerWidth(),
        (this._autoHeightCalculated = !1);
    }),
    (t.prototype._updateLayout = function () {
      this._switchTemplate(this._isMobileTemplate());
    }),
    (t.prototype._switchTemplate = function (e) {
      var t = this.hostElement.querySelector('.wj-viewer-outer'),
        o = wjcCore.Control.getControl(this._sidePanel),
        n = o.getTabPage(this._pageSetupPageId);
      e
        ? (wjcCore.addClass(t, 'mobile'), o.show(n))
        : (wjcCore.removeClass(t, 'mobile'), o.hide(n));
    }),
    (t.prototype._getSource = function () {
      return this.filePath
        ? new _DocumentSource({
            serviceUrl: this._serviceUrl,
            filePath: this._filePath,
          })
        : null;
    }),
    (t.prototype._needBindDocumentSource = function () {
      this._needBind = !0;
    }),
    (t.prototype._supportsPageSettingActions = function () {
      return !1;
    }),
    (t.prototype._isMobileTemplate = function () {
      return (
        this.thresholdWidth > this.hostElement.getBoundingClientRect().width
      );
    }),
    (t.prototype._init = function (e) {
      var t = this;
      this._createChildren(),
        this._autoCalculateHeight(),
        this._resetToolbarWidth(),
        this._resetViewPanelContainerWidth(),
        this._bindEvents(),
        this._initTools(),
        this.deferUpdate(function () {
          t.initialize(e);
        });
    }),
    (t.prototype._initTools = function () {
      var e = this;
      (this._rubberband = new _Rubberband(
        document.createElement('div'),
        this._viewpanelContainer,
        this._pageView
      )),
        this._rubberband.applied.addHandler(function (t, o) {
          var n = o.rect,
            r = e._pageView.hitTest(n.left, n.top),
            i = e._viewpanelContainer.getBoundingClientRect();
          n.width > n.height
            ? (e._pageView.zoomFactor *= i.width / n.width)
            : (e._pageView.zoomFactor *= i.height / n.height),
            e._pageView.moveToPosition(_getPositionByHitTestInfo(r));
        }),
        (this._magnifier = new _Magnifier(
          document.createElement('div'),
          this._viewpanelContainer,
          this._pageView
        ));
    }),
    (t.prototype._globalize = function () {
      var e = wjcCore.culture.Viewer;
      (this._gSearchTitle.textContent = e.search),
        (this._gMatchCase.innerHTML = '&nbsp;&nbsp;&nbsp;' + e.matchCase),
        (this._gWholeWord.innerHTML = '&nbsp;&nbsp;&nbsp;' + e.wholeWord),
        (this._gSearchResults.textContent = e.searchResults),
        (this._gThumbnailsTitle.textContent = e.thumbnails),
        (this._gOutlinesTitle.textContent = e.outlines),
        (this._gPageSetupTitle.textContent = e.pageSetup),
        (this._gPageSetupApplyBtn.textContent = e.ok),
        (this._gExportsPageTitle.textContent = e.exports),
        (this._gExportsPageApplyBtn.textContent = e.exportOk),
        (this._gExportFormatTitle.textContent = e.exportFormat);
    }),
    (t.prototype._autoCalculateHeight = function () {
      if (this._shouldAutoHeight()) {
        var e = this._viewpanelContainer.style.height;
        (this._viewpanelContainer.style.height = '100%'),
          (this._viewerContainer.style.height =
            Math.max(
              this._viewpanelContainer.getBoundingClientRect().height,
              t._viewpanelContainerMinHeight
            ) + 'px'),
          (this._viewpanelContainer.style.height = e);
      }
    }),
    (t.prototype._bindEvents = function () {
      var e = this;
      _addEvent(window, 'unload', function () {
        e._documentSource && e._documentSource.dispose();
      }),
        _addEvent(document, 'mousemove', function (t) {
          if (e.fullScreen && e._miniToolbar) {
            var o = e._checkMiniToolbarVisible(t);
            null != e._miniToolbarPinnedTimer && o
              ? (clearTimeout(e._miniToolbarPinnedTimer),
                (e._miniToolbarPinnedTimer = null),
                e._showMiniToolbar(o))
              : null == e._miniToolbarPinnedTimer && e._showMiniToolbar(o);
          }
        }),
        _addEvent(document, 'keydown', function (t) {
          t.keyCode === wjcCore.Key.Escape && (e.fullScreen = !1);
        }),
        this._historyManager.statusChanged.addHandler(
          this._onHistoryManagerStatusUpdated,
          this
        ),
        this._onHistoryManagerStatusUpdated(),
        this._pageView.pageIndexChanged.addHandler(function () {
          e._addHistory(!1, !0), e._updatePageIndex(e._pageView.pageIndex);
        }),
        this._pageView.zoomFactorChanged.addHandler(function (t, o) {
          e.zoomMode === ZoomMode.Custom &&
            e._addHistory(!1, !0, { zoomFactor: o.oldValue }),
            e.onZoomFactorChanged();
        }),
        this._pageView.zoomModeChanged.addHandler(function (t, o) {
          e._addHistory(!1, !0, { zoomMode: o.oldValue }),
            e._updateZoomModeActions();
        }),
        this._pageView.positionChanged.addHandler(function () {
          setTimeout(function () {
            e._historyManager.current.position = e._getCurrentPosition();
          }, t._historyTimeout);
        });
      var o = !1;
      this._searchManager.currentChanged.addHandler(function () {
        if (!o) {
          var t = e._searchManager.current;
          t &&
            ((o = !0),
            e._highlightPosition(t.pageIndex, t.boundsList),
            (o = !1));
        }
      });
    }),
    (t.prototype._checkMiniToolbarVisible = function (e) {
      var t = e.clientX,
        o = e.clientY,
        n = this._miniToolbar.getBoundingClientRect(),
        r = n.left - 60,
        i = n.right + 60,
        a = n.top - 60,
        s = n.bottom + 60;
      return t >= r && t <= i && o >= a && o <= s;
    }),
    (t.prototype._showMiniToolbar = function (e) {
      var t,
        o = parseFloat(getComputedStyle(this._miniToolbar, '').opacity),
        n = this._miniToolbar;
      t = e
        ? setInterval(function () {
            o >= 0.8
              ? window.clearInterval(t)
              : ((o += 0.01), (n.style.opacity = o.toString()));
          }, 1)
        : setInterval(function () {
            o < 0
              ? window.clearInterval(t)
              : ((o -= 0.01), (n.style.opacity = o.toString()));
          }, 1);
    }),
    (t.prototype._goToBookmark = function (e) {
      var t = this;
      this._documentSource &&
        '' !== e &&
        this._documentSource.getBookmark(e).then(function (e) {
          e && t._scrollToPosition(e, !0);
        });
    }),
    (t.prototype._executeCustomAction = function (e) {
      var t = this;
      if (this._documentSource && '' !== e) {
        (this._initialPosition = {
          pageIndex: this._pageIndex,
          pageBounds: { x: 0, y: 0, width: 0, height: 0 },
        }),
          this._resetDocument(),
          this._showViewPanelMessage(),
          this._setDocumentRendering();
        var o = this._documentSource;
        this._documentSource
          .executeCustomAction(e)
          .then(function (e) {
            (t._initialPosition = e || t._initialPosition),
              t._getStatusUtilCompleted(o);
          })
          .catch(function (e) {
            t._showViewPanelErrorMessage(_getErrorMessage(e));
          });
      }
    }),
    (t.prototype._getStatusUtilCompleted = function (e) {
      var t = this;
      !e ||
        e.isLoadCompleted ||
        e.isDisposed ||
        e.getStatus().then(function (o) {
          t._documentSource === e &&
            setTimeout(function () {
              return t._getStatusUtilCompleted(e);
            }, 100);
        });
    }),
    (t.prototype._initChildren = function () {
      this._initPageView(),
        this._initToolbar(),
        this._initSidePanel(),
        this._initSplitter(),
        this._initFooter(),
        this._initSearchBar(),
        this._initMiniToolbar();
    }),
    (t.prototype._initSearchBar = function () {
      new _SearchBar(this._searchBar, this), this._showSearchBar(!1);
    }),
    (t.prototype._showSearchBar = function (e) {
      var t = this.hostElement.querySelector('.wj-viewer-outer');
      e
        ? (wjcCore.removeClass(this._searchBar, exports._hiddenCss),
          wjcCore.addClass(t, 'with-searchbar'))
        : (wjcCore.addClass(this._searchBar, exports._hiddenCss),
          wjcCore.removeClass(t, 'with-searchbar'));
    }),
    (t.prototype._initFooter = function () {
      var e = this;
      new _ViewerZoomBar(this._zoomBar, this),
        _addEvent(
          this._footer.querySelector('.wj-close'),
          'click',
          function () {
            e._showFooter(!1);
          }
        );
    }),
    (t.prototype._showFooter = function (e) {
      var t = this.hostElement.querySelector('.wj-viewer-outer');
      e
        ? (wjcCore.removeClass(this._footer, exports._hiddenCss),
          wjcCore.addClass(t, 'with-footer'))
        : (wjcCore.addClass(this._footer, exports._hiddenCss),
          wjcCore.removeClass(t, 'with-footer'));
    }),
    (t.prototype._createChildren = function () {
      var e = this.getTemplate();
      this.applyTemplate('wj-viewer wj-control', e, {
        _viewpanelContainer: 'viewpanel-container',
        _toolbar: 'toolbar',
        _mobileToolbar: 'mobile-toolbar',
        _miniToolbar: 'mini-toolbar',
        _leftPanel: 'viewer-left-panel',
        _sidePanel: 'side-panel',
        _viewerContainer: 'viewer-container',
        _splitter: 'splitter',
        _footer: 'viewer-footer',
        _zoomBar: 'zoom-bar',
        _searchBar: 'search-bar',
      }),
        this._initChildren();
    }),
    (t.prototype._initPageView = function () {
      new _CompositePageView(this._viewpanelContainer).viewMode = this.viewMode;
    }),
    Object.defineProperty(t.prototype, '_pageView', {
      get: function () {
        return wjcCore.Control.getControl(this._viewpanelContainer);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._initSplitter = function () {
      var e = this;
      _addEvent(this._splitter, 'click', function () {
        return e._toggleSplitter();
      });
    }),
    (t.prototype._toggleSplitter = function (e) {
      var t = this._splitter.querySelector('span'),
        o = wjcCore.Control.getControl(this._sidePanel);
      if (!0 === e) {
        if (wjcCore.hasClass(t, 'wj-glyph-right')) return;
      } else if (!1 === e) {
        if (wjcCore.hasClass(t, 'wj-glyph-left')) return;
      } else e = wjcCore.hasClass(t, 'wj-glyph-left');
      if (e) o.collapse(), (t.className = 'wj-glyph-right');
      else {
        if (0 === o.visibleTabPagesCount) return;
        (t.className = 'wj-glyph-left'), o.expand();
      }
      this._resetViewPanelContainerWidth();
    }),
    (t.prototype._resetMiniToolbarPosition = function () {
      if (this._miniToolbar) {
        var e = this.hostElement.getBoundingClientRect().width,
          t = this._miniToolbar.getBoundingClientRect().width;
        this._miniToolbar.style.left = (e - t) / 2 + 'px';
      }
    }),
    (t.prototype._resetToolbarWidth = function () {
      wjcCore.Control.getControl(this._toolbar).resetWidth();
    }),
    (t.prototype._resetViewPanelContainerWidth = function () {
      !this._isMobileTemplate() &&
      this.hostElement.getBoundingClientRect().width <= t._narrowWidthThreshold
        ? wjcCore.addClass(this.hostElement, t._narrowCss)
        : wjcCore.removeClass(this.hostElement, t._narrowCss);
      var e = this._splitter ? this._splitter.getBoundingClientRect().width : 0,
        o = this._leftPanel ? this._leftPanel.getBoundingClientRect().width : 0;
      (this._viewpanelContainer.style.width =
        this._viewerContainer.getBoundingClientRect().width - e - o + 'px'),
        this._pageView.invalidate();
    }),
    (t.prototype._shouldAutoHeight = function () {
      return (
        ('100%' === this.hostElement.style.height ||
          'auto' === this.hostElement.style.height) &&
        !this.fullScreen
      );
    }),
    (t.prototype._initSidePanel = function () {
      var e = this,
        t = new _SideTabs(this._sidePanel);
      t.collapse(),
        t.collapsed.addHandler(function () {
          e._toggleSplitter(!0);
        }),
        t.expanded.addHandler(function () {
          e._toggleSplitter(!1);
          var t = e._splitter ? e._splitter.getBoundingClientRect().width : 0;
          e._sidePanel.getBoundingClientRect().width + t >
            e._viewerContainer.getBoundingClientRect().width &&
            wjcCore.addClass(e._sidePanel, 'collapsed');
        }),
        t.tabPageVisibilityChanged.addHandler(function (o, n) {
          ((!n.tabPage.isHidden && 1 == t.visibleTabPagesCount) ||
            (n.tabPage.isHidden && 0 == t.visibleTabPagesCount)) &&
            e._resetViewPanelContainerWidth();
        }),
        this._initSidePanelThumbnails(),
        this._initSidePanelOutlines(),
        this._initSidePanelSearch(),
        this._initSidePanelExports(),
        this._initSidePanelPageSetup();
    }),
    (t.prototype._clearPreHightLights = function () {
      this._pages.forEach(function (e) {
        var t;
        if (e.content) {
          t = e.content.querySelectorAll('.highlight');
          for (var o = 0; o < t.length; o++)
            t.item(o).parentNode.removeChild(t.item(o));
        }
      });
    }),
    (t.prototype._highlightPosition = function (e, t) {
      var o,
        n = this,
        r =
          (this._pageIndex,
          this._pageView.scrollTop,
          this._pageView.scrollLeft,
          { pageIndex: e, pageBounds: t.length > 0 ? t[0] : null });
      this._scrollToPosition(r, !0).then(function (e) {
        n._clearPreHightLights(),
          n._pages[n.pageIndex].getContent().then(function (e) {
            o = e.querySelector('g');
            for (var n = 0; n < t.length; n++) {
              var r = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'rect'
              );
              r.setAttributeNS(null, 'x', _twipToPixel(t[n].x).toString()),
                r.setAttributeNS(null, 'y', _twipToPixel(t[n].y).toString()),
                r.setAttributeNS(
                  null,
                  'height',
                  _twipToPixel(t[n].height).toString()
                ),
                r.setAttributeNS(
                  null,
                  'width',
                  _twipToPixel(t[n].width).toString()
                ),
                r.setAttributeNS(null, 'class', 'highlight'),
                o.appendChild(r);
            }
          });
      });
    }),
    (t.prototype._scrollToPosition = function (e, t) {
      return (
        !0 === t && this._addHistory(!0, !1),
        (e.pageIndex = e.pageIndex || 0),
        this._pageView.moveToPosition(e)
      );
    }),
    (t.prototype._initSidePanelSearch = function () {
      var e = this,
        t = wjcCore.Control.getControl(this._sidePanel),
        o = t.addPage(wjcCore.culture.Viewer.search, exports.icons.search);
      (this._gSearchTitle = o.outContent.querySelector('.wj-tabtitle')),
        o.format(function (n) {
          var r = _toDOMs(
            '<div class="wj-searchcontainer"><input class="wj-searchbox" wj-part="search-box" type="text"/><div class="wj-btn-group"><button class="wj-btn wj-btn-searchpre">' +
              _createSvgBtn(exports.icons.searchPrevious).innerHTML +
              '</button><button class="wj-btn wj-btn-searchnext">' +
              _createSvgBtn(exports.icons.searchNext).innerHTML +
              '</button></div></div><div class="wj-searchoption"><label><span wj-part="g-matchCase">&nbsp;&nbsp;&nbsp;' +
              wjcCore.culture.Viewer.matchCase +
              '</span><input type="checkbox" wj-part="match-case" /></label></div><div class="wj-searchoption"><label><span wj-part="g-wholeWord">&nbsp;&nbsp;&nbsp;' +
              wjcCore.culture.Viewer.wholeWord +
              '</span><input type="checkbox" wj-part="whole-word" /></label></div><h3 wj-part="g-searchResults" class="wj-searchresult">' +
              wjcCore.culture.Viewer.searchResults +
              '</h3>'
          );
          (e._gMatchCase = r.querySelector('[wj-part="g-matchCase"]')),
            (e._gWholeWord = r.querySelector('[wj-part="g-wholeWord"]')),
            (e._gSearchResults = r.querySelector(
              '[wj-part="g-searchResults"]'
            )),
            n.outContent.querySelector('.wj-tabtitle-wrapper').appendChild(r);
          var i = n.outContent.querySelectorAll('input[type="checkbox"]')[0],
            a = n.outContent.querySelectorAll('input[type="checkbox"]')[1],
            s = n.outContent.querySelector('input[type="text"]'),
            c = n.outContent.querySelector('.wj-btn-searchpre'),
            u = n.outContent.querySelector('.wj-btn-searchnext');
          wjcCore.addClass(n.content.parentElement, 'search-wrapper'),
            wjcCore.addClass(n.content, 'wj-searchresultlist');
          var l = new wjcInput.ListBox(n.content),
            p = !1,
            h = !1;
          l.formatItem.addHandler(function (e, t) {
            var o = t.item,
              n = t.data,
              r = document.createElement('div'),
              i = document.createElement('div');
            (o.innerHTML = ''),
              (i.innerHTML = n.nearText),
              (i.className = 'wj-search-text'),
              (r.innerHTML = 'Page ' + (n.pageIndex + 1)),
              (r.className = 'wj-search-page'),
              wjcCore.addClass(o, 'wj-search-item'),
              o.setAttribute('tabIndex', '-1'),
              o.appendChild(i),
              o.appendChild(r);
          }),
            l.selectedIndexChanged.addHandler(function () {
              return (e._searchManager.currentIndex = l.selectedIndex);
            });
          var d = function (e) {
            void 0 === e && (e = !0);
            for (
              var t = o.outContent.querySelectorAll('input'), n = 0;
              n < t.length;
              n++
            )
              t.item(n).disabled = !e;
          };
          e._searchManager.searchStarted.addHandler(function () {
            d(!1);
          }),
            e._searchManager.searchCompleted.addHandler(function () {
              (p = !0),
                (l.itemsSource = e._searchManager.searchResults),
                (p = !1),
                d(!0);
            }),
            e._searchManager.currentChanged.addHandler(function () {
              p ||
                h ||
                (e._searchManager.current &&
                  ((h = !0),
                  (l.selectedIndex = e._searchManager.currentIndex),
                  (h = !1)));
            });
          var _ = function () {
            (l.itemsSource = null),
              (i.checked = !1),
              (a.checked = !1),
              (s.value = ''),
              e._documentSource &&
              e._documentSource.features &&
              (!e._documentSource.paginated ||
                e._documentSource.features.textSearchInPaginatedMode)
                ? t.show(n)
                : t.hide(n);
          };
          e._documentSourceChanged.addHandler(function () {
            e._documentSource &&
              _addWjHandler(
                e._documentEventKey,
                e._documentSource.loadCompleted,
                _
              ),
              _();
          }),
            _addEvent(i, 'click', function () {
              e._searchManager.matchCase = i.checked;
            }),
            _addEvent(a, 'click', function () {
              e._searchManager.wholeWord = a.checked;
            }),
            _addEvent(s, 'input', function () {
              e._searchManager.text = s.value;
            }),
            _addEvent(s, 'keyup', function (t) {
              var o = t || window.event;
              o.keyCode === wjcCore.Key.Enter &&
                e._searchManager.search(o.shiftKey);
            }),
            _addEvent(u, 'click', function () {
              return e._searchManager.search();
            }),
            _addEvent(c, 'click', function () {
              return e._searchManager.search(!0);
            }),
            _addEvent(n.header, 'keydown', function (t) {
              var o,
                n = e._toolbar;
              t.keyCode === wjcCore.Key.Tab &&
                (o =
                  n.querySelector('[tabIndex=0]') ||
                  n.querySelector('input:not([type="hidden"])') ||
                  n) &&
                o.focus &&
                (o.focus(), t.preventDefault());
            });
        });
    }),
    (t.prototype._initSidePanelOutlines = function () {
      var e = this,
        t = wjcCore.Control.getControl(this._sidePanel),
        o = t.addPage(wjcCore.culture.Viewer.outlines, exports.icons.outlines);
      (this._gOutlinesTitle = o.outContent.querySelector('.wj-tabtitle')),
        (this._outlinesPageId = o.id),
        o.format(function (o) {
          wjcCore.addClass(o.content, 'wj-outlines-tree');
          var n = new wjcGrid.FlexGrid(o.content);
          n.initialize({
            autoGenerateColumns: !1,
            columns: [{ binding: 'caption', width: '*' }],
            isReadOnly: !0,
            childItemsPath: 'children',
            allowResizing: wjcGrid.AllowResizing.None,
            headersVisibility: wjcGrid.HeadersVisibility.None,
          }),
            (n.itemFormatter = function (e, t, o, n) {
              var r;
              r = n.firstElementChild
                ? n.firstElementChild.outerHTML
                : '&nbsp;&nbsp;&nbsp;&nbsp;';
              var i = e.rows[t].dataItem;
              n.innerHTML = r + '<a>' + i.caption + '</a>';
            });
          var r = !0;
          n.selectionChanged.addHandler(function (o, n) {
            if (!r) {
              var i = n.panel.rows[n.row];
              if (i) {
                var a = i.dataItem;
                if (a.position) e._scrollToPosition(a.position, !0);
                else if (a.target) {
                  if (!e._documentSource) return;
                  e._documentSource.getBookmark(a.target).then(
                    function (t) {
                      (a.position = t),
                        o.getSelectedState(n.row, n.col) !=
                          wjcGrid.SelectedState.None &&
                          e._scrollToPosition(t, !0);
                    },
                    function (e) {}
                  );
                }
                e._isMobileTemplate() && t.collapse();
              }
            }
          });
          var i = !1,
            a = function () {
              i ||
                t.isCollapsed ||
                !o.isActived ||
                o.isHidden ||
                (n.refresh(), (i = !0));
            },
            s = function () {
              if (!e._documentSource)
                return (n.itemsSource = null), void t.hide(o);
              var s = function () {
                if (!e._documentSource.hasOutlines)
                  return (n.itemsSource = null), void t.hide(o);
                e._documentSource.getOutlines().then(function (e) {
                  (i = !1), (n.itemsSource = e), t.show(o), a(), (r = !1);
                });
              };
              _addWjHandler(
                e._documentEventKey,
                e._documentSource.loadCompleted,
                s
              ),
                s();
            };
          e._documentSourceChanged.addHandler(s),
            t.expanded.addHandler(a),
            t.tabPageActived.addHandler(a),
            s();
        });
    }),
    (t.prototype._initSidePanelThumbnails = function () {
      var e = this,
        o = wjcCore.Control.getControl(this._sidePanel),
        n = o.addPage(
          wjcCore.culture.Viewer.thumbnails,
          exports.icons.thumbnails
        );
      (this._gThumbnailsTitle = n.outContent.querySelector('.wj-tabtitle')),
        (this._thumbnailsPageId = n.id),
        n.format(function (n) {
          wjcCore.addClass(n.content, 'wj-thumbnaillist');
          var r = new wjcInput.ListBox(n.content),
            i = null,
            a = !1;
          r.formatItem.addHandler(function (o, n) {
            var r = n.item,
              i = n.data;
            if (((r.innerHTML = ''), e._pageView.pages)) {
              var a = document.createElement('div'),
                c = _toDOM(
                  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml: space = "preserve" ></svg>'
                ),
                u = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
                l = document.createElementNS(
                  'http://www.w3.org/2000/svg',
                  'image'
                ),
                p = document.createElement('div'),
                h = e._pageView.pages[n.index],
                d =
                  (h.size.height.valueInPixel * t._thumbnailWidth) /
                  h.size.width.valueInPixel;
              wjcCore.addClass(r, 'wj-thumbnail-item'),
                l.setAttributeNS('http://www.w3.org/1999/xlink', 'href', i),
                l.setAttribute('x', '0'),
                l.setAttribute('y', '0'),
                l.setAttribute('width', t._thumbnailWidth.toString()),
                l.setAttribute('height', d.toString()),
                wjcCore.addClass(a, 'wj-pagethumbnail'),
                a.setAttribute('tabIndex', '-1'),
                u.appendChild(l),
                c.appendChild(u),
                a.appendChild(c),
                r.appendChild(a),
                s(c, h),
                (p.className = 'page-index'),
                (p.innerHTML = (n.index + 1).toString()),
                r.appendChild(p);
            }
          }),
            r.selectedIndexChanged.addHandler(function () {
              a ||
                r.selectedIndex < 0 ||
                r.selectedIndex == e._pageIndex ||
                (e.moveToPage(r.selectedIndex),
                e._isMobileTemplate() && o.collapse());
            }),
            e.pageIndexChanged.addHandler(function () {
              return (r.selectedIndex = e._pageIndex);
            });
          var s = function (e, o) {
              var n = t._thumbnailWidth,
                r =
                  (o.size.height.valueInPixel * n) / o.size.width.valueInPixel,
                i = e.parentNode;
              switch (
                (_transformSvg(e, n, r, 1, o.rotateAngle), o.rotateAngle)
              ) {
                case _RotateAngle.Rotation90:
                case _RotateAngle.Rotation270:
                  var a = r;
                  (r = n), (n = a);
              }
              (i.style.width = n + 'px'),
                (i.style.height = r + 'px'),
                e.setAttribute('width', n.toString()),
                e.setAttribute('height', r.toString());
            },
            c = function () {
              if (!e._documentSource || !e._documentSource.isLoadCompleted)
                return null;
              for (var t = [], o = 0; o < e._documentSource.pageCount; o++)
                t.push(
                  e._documentSource.getRenderToFilterUrl({
                    format: 'png',
                    resolution: 50,
                    outputRange: o + 1,
                  })
                );
              return t;
            },
            u = function () {
              !o.isCollapsed &&
                n.isActived &&
                (i || (i = c()),
                n.isActived &&
                  r.itemsSource !== i &&
                  r.deferUpdate(function () {
                    (a = !0),
                      (r.itemsSource = i),
                      (r.selectedIndex = e._pageIndex),
                      (a = !1);
                  }));
            },
            l = function () {
              if (!e._documentSource || !e._documentSource.paginated)
                return o.hide(n), void (r.itemsSource = null);
              o.show(n), (i = null), u();
            },
            p = function () {
              if (!e._documentSource)
                return o.hide(n), void (r.itemsSource = null);
              _addWjHandler(
                e._documentEventKey,
                e._documentSource.loadCompleted,
                l
              ),
                _addWjHandler(
                  e._documentEventKey,
                  e._documentSource.pageCountChanged,
                  l
                ),
                _addWjHandler(
                  e._documentEventKey,
                  e._documentSource.pageSettingsChanged,
                  l
                ),
                l();
            };
          e._documentSourceChanged.addHandler(p),
            p(),
            o.expanded.addHandler(u),
            o.tabPageActived.addHandler(u),
            u(),
            e._pageView.rotateAngleChanged.addHandler(function () {
              for (
                var t = r.hostElement.querySelectorAll('svg'), o = 0;
                o < t.length;
                o++
              )
                s(t.item(o), e._pageView.pages[o]);
            });
        });
    }),
    (t.prototype._initSidePanelExports = function () {
      var e = this,
        t = wjcCore.Control.getControl(this._sidePanel),
        o = t.addPage(wjcCore.culture.Viewer.exports, exports.icons.exports);
      (this._gExportsPageTitle = o.outContent.querySelector('.wj-tabtitle')),
        (this._exportsPageId = o.id),
        o.format(function (o) {
          var n = _toDOMs(
            '<div class="wj-exportcontainer"><label wj-part="g-wj-exportformat">' +
              wjcCore.culture.Viewer.exportFormat +
              '</label><div class="wj-exportformats"></div></div>'
          );
          o.outContent.querySelector('.wj-tabtitle-wrapper').appendChild(n),
            (e._gExportFormatTitle = o.outContent.querySelector(
              '[wj-part="g-wj-exportformat"]'
            ));
          var r = o.outContent.querySelector('.wj-exportformats');
          new wjcInput.ComboBox(r),
            wjcCore.addClass(
              o.content.parentElement,
              'wj-exportformats-wrapper'
            );
          var i = document.createElement('div'),
            a = new _ExportOptionEditor(i);
          o.content.appendChild(i);
          var s = _toDOMs(
            '<div class="wj-exportformats-footer"><a wj-part="btn-apply" href="javascript:void(0)" tabindex="-1" draggable="false">' +
              wjcCore.culture.Viewer.exportOk +
              '</a></div>'
          );
          o.content.appendChild(s);
          var c = o.content.querySelector('[wj-part="btn-apply"]');
          (e._gExportsPageApplyBtn = c),
            _addEvent(c, 'click', function () {
              e._export(a.options), t.collapse();
            });
        });
      var n = !0;
      this._documentSourceChanged.addHandler(function () {
        (n = !0),
          e._documentSource &&
            _addWjHandler(
              e._documentEventKey,
              e._documentSource.loadCompleted,
              function () {
                n &&
                  e._ensureExportFormatsLoaded().then(function () {
                    e._updateExportTab(), (n = null == e._exportFormats);
                  });
              }
            );
      }),
        t.tabPageActived.addHandler(function () {
          n &&
            t.activedTabPage.id === e._exportsPageId &&
            e._ensureExportFormatsLoaded().then(function () {
              e._updateExportTab(), (n = null == e._exportFormats);
            });
        });
    }),
    (t.prototype._ensureExportFormatsLoaded = function () {
      var e = this;
      if (
        !this._exportFormats &&
        this._documentSource &&
        !this._documentSource.isDisposed
      )
        return this._documentSource
          .getSupportedExportDescriptions()
          .then(function (t) {
            (e._exportFormats = t),
              e._setViewerAction(_ViewerActionType.ShowExportsPanel);
          });
      var t = new _Promise();
      return t.resolve(), t;
    }),
    (t.prototype._updateExportTab = function (e) {
      var t = this;
      if (this._exportFormats) {
        var o = wjcCore.Control.getControl(this._sidePanel).getTabPage(
            this._exportsPageId
          ),
          n = wjcCore.Control.getControl(
            o.outContent.querySelector('.wj-exportformats')
          ),
          r = wjcCore.Control.getControl(o.content.firstElementChild);
        if (e)
          r.refresh(),
            n.itemsSource &&
              n.itemsSource.forEach(function (e) {
                e.name = t._exportItemDescriptions[e.format].name;
              }),
            n.refresh();
        else {
          var i = [];
          this._exportFormats.forEach(function (e) {
            var o = t._exportItemDescriptions[e.format];
            (isIOS() && !o.supportIOS) || ((e.name = o.name), i.push(e));
          }),
            n.selectedIndexChanged.addHandler(function () {
              r.exportDescription = n.selectedItem;
            }),
            (n.itemsSource = i),
            (n.displayMemberPath = 'name'),
            (n.selectedValuePath = 'format'),
            (n.selectedIndex = -1);
        }
      }
    }),
    (t.prototype._initSidePanelPageSetup = function () {
      var e = this,
        t = wjcCore.Control.getControl(this._sidePanel),
        o = t.addPage(
          wjcCore.culture.Viewer.pageSetup,
          exports.icons.pageSetup
        );
      (this._gPageSetupTitle = o.outContent.querySelector('.wj-tabtitle')),
        (this._pageSetupPageId = o.id),
        o.format(function (o) {
          var n = document.createElement('div'),
            r = new _PageSetupEditor(n);
          o.content.appendChild(n),
            wjcCore.addClass(n, 'wj-pagesetupcontainer');
          var i = _toDOMs(
            '<div class="wj-pagesetup-footer"><a wj-part="btn-apply" href="javascript:void(0)" tabindex="-1" draggable="false">' +
              wjcCore.culture.Viewer.ok +
              '</a></div>'
          );
          o.content.appendChild(i);
          var a = o.content.querySelector('[wj-part="btn-apply"]');
          (e._gPageSetupApplyBtn = a),
            _addEvent(a, 'click', function () {
              e._setPageSettings(r.pageSettings), t.collapse();
            });
          var s = function () {
              r.pageSettings = e._documentSource.pageSettings;
            },
            c = function () {
              e._documentSource &&
                (_addWjHandler(
                  e._documentEventKey,
                  e._documentSource.pageSettingsChanged,
                  s
                ),
                s());
            };
          e._documentSourceChanged.addHandler(c), c();
        });
    }),
    (t.prototype._executeAction = function (e) {
      if (!this._actionIsDisabled(e))
        switch (e) {
          case _ViewerActionType.TogglePaginated:
            this._innerPaginated = !this._innerPaginated;
            break;
          case _ViewerActionType.Print:
            this._documentSource &&
              this._documentSource.print(
                this._pages.map(function (e) {
                  return e.rotateAngle;
                })
              );
            break;
          case _ViewerActionType.ShowExportsPanel:
            wjcCore.Control.getControl(this._sidePanel).active(
              this._exportsPageId
            );
            break;
          case _ViewerActionType.Portrait:
            this._setPageLandscape(!1);
            break;
          case _ViewerActionType.Landscape:
            this._setPageLandscape(!0);
            break;
          case _ViewerActionType.ShowPageSetupDialog:
            this.showPageSetupDialog();
            break;
          case _ViewerActionType.FirstPage:
            this.moveToPage(0);
            break;
          case _ViewerActionType.LastPage:
            this._moveToLastPage();
            break;
          case _ViewerActionType.PrePage:
            this.moveToPage(this._pageIndex - 1);
            break;
          case _ViewerActionType.NextPage:
            this.moveToPage(this._pageIndex + 1);
            break;
          case _ViewerActionType.Backward:
            this._moveBackwardHistory();
            break;
          case _ViewerActionType.Forward:
            this._moveForwardHistory();
            break;
          case _ViewerActionType.SelectTool:
            this.mouseMode = MouseMode.SelectTool;
            break;
          case _ViewerActionType.MoveTool:
            this.mouseMode = MouseMode.MoveTool;
            break;
          case _ViewerActionType.Continuous:
            this._addHistory(!1, !0), (this.viewMode = ViewMode.Continuous);
            break;
          case _ViewerActionType.Single:
            this._addHistory(!1, !0), (this.viewMode = ViewMode.Single);
            break;
          case _ViewerActionType.FitPageWidth:
            this.zoomMode = ZoomMode.PageWidth;
            break;
          case _ViewerActionType.FitWholePage:
            this.zoomMode = ZoomMode.WholePage;
            break;
          case _ViewerActionType.ZoomOut:
            this._zoomBtnClicked(!1, t._defaultZoomValues);
            break;
          case _ViewerActionType.ZoomIn:
            this._zoomBtnClicked(!0, t._defaultZoomValues);
            break;
          case _ViewerActionType.ToggleFullScreen:
            this.fullScreen = !this.fullScreen;
            break;
          case _ViewerActionType.ShowHamburgerMenu:
            this._hamburgerMenu.showMenu();
            break;
          case _ViewerActionType.ShowViewMenu:
            this._viewMenu.showMenu();
            break;
          case _ViewerActionType.ShowSearchBar:
            this._showSearchBar(
              wjcCore.hasClass(this._searchBar, exports._hiddenCss)
            ),
              this._setViewerAction(_ViewerActionType.ShowSearchBar);
            break;
          case _ViewerActionType.ShowThumbnails:
            wjcCore.Control.getControl(this._sidePanel).active(
              this._thumbnailsPageId
            );
            break;
          case _ViewerActionType.ShowOutlines:
            wjcCore.Control.getControl(this._sidePanel).active(
              this._outlinesPageId
            );
            break;
          case _ViewerActionType.ShowPageSetupPanel:
            wjcCore.Control.getControl(this._sidePanel).active(
              this._pageSetupPageId
            );
            break;
          case _ViewerActionType.ShowZoomBar:
            this._showFooter(!0);
            break;
          case _ViewerActionType.SearchPrev:
            this._searchManager.search(!0);
            break;
          case _ViewerActionType.SearchNext:
            this._searchManager.search();
            break;
          case _ViewerActionType.ShowSearchOptions:
            this._searchOptionsMenu.showMenu(!0);
            break;
          case _ViewerActionType.SearchMatchCase:
            this._searchManager.matchCase = !this._searchManager.matchCase;
            break;
          case _ViewerActionType.SearchMatchWholeWord:
            this._searchManager.wholeWord = !this._searchManager.wholeWord;
            break;
          case _ViewerActionType.RubberbandTool:
            this.mouseMode = MouseMode.RubberbandTool;
            break;
          case _ViewerActionType.MagnifierTool:
            this.mouseMode = MouseMode.MagnifierTool;
            break;
          case _ViewerActionType.RotateDocument:
            this._rotateDocument();
            break;
          case _ViewerActionType.RotatePage:
            this._rotatePage();
        }
    }),
    (t.prototype._initSearchOptionsMenu = function (e) {
      this._searchOptionsMenu = new _SearchOptionsMenu(this, e);
    }),
    (t.prototype._initHamburgerMenu = function (e) {
      this._hamburgerMenu = new _HamburgerMenu(this, e);
    }),
    (t.prototype._initViewMenu = function (e) {
      this._viewMenu = new _ViewMenu(this, e);
    }),
    (t.prototype._initToolbar = function () {
      new _ViewerToolbar(this._toolbar, this),
        new _ViewerMobileToolbar(this._mobileToolbar, this);
    }),
    (t.prototype._clearExportFormats = function () {
      this._exportFormats = null;
    }),
    Object.defineProperty(t.prototype, '_exportItemDescriptions', {
      get: function () {
        return (
          t._exportItems ||
            (t._exportItems = {
              pdf: {
                name: wjcCore.culture.Viewer.pdfExportName,
                supportIOS: !0,
              },
              doc: {
                name: wjcCore.culture.Viewer.docExportName,
                supportIOS: !1,
              },
              docx: {
                name: wjcCore.culture.Viewer.docxExportName,
                supportIOS: !1,
              },
              rtf: {
                name: wjcCore.culture.Viewer.rtfExportName,
                supportIOS: !1,
              },
              xlsx: {
                name: wjcCore.culture.Viewer.xlsxExportName,
                supportIOS: !0,
              },
              xls: {
                name: wjcCore.culture.Viewer.xlsExportName,
                supportIOS: !0,
              },
              mhtml: {
                name: wjcCore.culture.Viewer.mhtmlExportName,
                supportIOS: !0,
              },
              html: {
                name: wjcCore.culture.Viewer.htmlExportName,
                supportIOS: !0,
              },
              zip: {
                name: wjcCore.culture.Viewer.metafileExportName,
                supportIOS: !1,
              },
              csv: {
                name: wjcCore.culture.Viewer.csvExportName,
                supportIOS: !0,
              },
              tiff: {
                name: wjcCore.culture.Viewer.tiffExportName,
                supportIOS: !0,
              },
              bmp: {
                name: wjcCore.culture.Viewer.bmpExportName,
                supportIOS: !1,
              },
              emf: {
                name: wjcCore.culture.Viewer.emfExportName,
                supportIOS: !1,
              },
              gif: {
                name: wjcCore.culture.Viewer.gifExportName,
                supportIOS: !1,
              },
              jpeg: {
                name: wjcCore.culture.Viewer.jpegExportName,
                suportIOS: !1,
              },
              jpg: {
                name: wjcCore.culture.Viewer.jpegExportName,
                supportIOS: !1,
              },
              png: {
                name: wjcCore.culture.Viewer.pngExportName,
                supportIOS: !1,
              },
            }),
          t._exportItems
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._actionIsChecked = function (e) {
      switch (e) {
        case _ViewerActionType.TogglePaginated:
          return !0 === this._innerPaginated;
        case _ViewerActionType.Landscape:
          return (
            !(!this._documentSource || !this._documentSource.pageSettings) &&
            this._documentSource.pageSettings.landscape
          );
        case _ViewerActionType.Portrait:
          return (
            !(!this._documentSource || !this._documentSource.pageSettings) &&
            !this._documentSource.pageSettings.landscape
          );
        case _ViewerActionType.SelectTool:
          return this.mouseMode === MouseMode.SelectTool;
        case _ViewerActionType.MoveTool:
          return this.mouseMode === MouseMode.MoveTool;
        case _ViewerActionType.RubberbandTool:
          return this.mouseMode === MouseMode.RubberbandTool;
        case _ViewerActionType.MagnifierTool:
          return this.mouseMode === MouseMode.MagnifierTool;
        case _ViewerActionType.Continuous:
          return this.viewMode == ViewMode.Continuous;
        case _ViewerActionType.Single:
          return this.viewMode == ViewMode.Single;
        case _ViewerActionType.ToggleFullScreen:
          return this.fullScreen;
        case _ViewerActionType.FitPageWidth:
          return this.zoomMode == ZoomMode.PageWidth;
        case _ViewerActionType.FitWholePage:
          return this.zoomMode == ZoomMode.WholePage;
        case _ViewerActionType.SearchMatchCase:
          return this._searchManager.matchCase;
        case _ViewerActionType.SearchMatchWholeWord:
          return this._searchManager.wholeWord;
        case _ViewerActionType.ShowSearchBar:
          return !wjcCore.hasClass(this._searchBar, exports._hiddenCss);
      }
      return !1;
    }),
    (t.prototype._isDocumentSourceLoaded = function () {
      return this._documentSource && this._documentSource.isLoadCompleted;
    }),
    (t.prototype._actionIsDisabled = function (e) {
      if (
        !(this._isDocumentSourceLoaded() && this._documentSource.pageCount > 0)
      )
        return !0;
      switch (e) {
        case _ViewerActionType.TogglePaginated:
          return null == this._innerPaginated;
        case _ViewerActionType.ShowExportsPanel:
          return !this._exportFormats || 0 === this._exportFormats.length;
        case _ViewerActionType.Landscape:
        case _ViewerActionType.Portrait:
        case _ViewerActionType.ShowPageSetupDialog:
        case _ViewerActionType.ShowPageSetupPanel:
          return (
            !this._documentSource ||
            !this._documentSource.pageSettings ||
            !this._documentSource.paginated
          );
        case _ViewerActionType.FirstPage:
        case _ViewerActionType.PrePage:
          return this._pageIndex <= 0;
        case _ViewerActionType.LastPage:
        case _ViewerActionType.NextPage:
          return this._pageIndex >= this._documentSource.pageCount - 1;
        case _ViewerActionType.Backward:
          return !this._historyManager.canBackward();
        case _ViewerActionType.Forward:
          return !this._historyManager.canForward();
        case _ViewerActionType.Continuous:
        case _ViewerActionType.Single:
          return !this._documentSource || !this._documentSource.paginated;
        case _ViewerActionType.ZoomOut:
          return this.zoomFactor <= t._defaultZoomValues[0].value;
        case _ViewerActionType.ZoomIn:
          var o = t._defaultZoomValues;
          return this.zoomFactor >= o[o.length - 1].value;
      }
      return !1;
    }),
    (t.prototype._actionIsShown = function (e) {
      var t = this._documentSource ? this._documentSource.features : null;
      switch (e) {
        case _ViewerActionType.TogglePaginated:
          return t && t.paginated && t.nonPaginated;
        case _ViewerActionType.Landscape:
        case _ViewerActionType.Portrait:
        case _ViewerActionType.ShowPageSetupDialog:
        case _ViewerActionType.ShowPageSetupPanel:
          return t ? t.pageSettings : this._supportsPageSettingActions();
        case _ViewerActionType.SelectTool:
        case _ViewerActionType.MoveTool:
        case _ViewerActionType.MagnifierTool:
        case _ViewerActionType.RubberbandTool:
          return !wjcCore.isMobile();
        case _ViewerActionType.ShowSearchBar:
          return (
            t &&
            (!this._documentSource.paginated || t.textSearchInPaginatedMode)
          );
        case _ViewerActionType.ShowOutlines:
          return this._documentSource && this._documentSource.hasOutlines;
      }
      return !0;
    }),
    (t.prototype._onViewerActionStatusChanged = function (e) {
      this._viewerActionStatusChanged.raise(this, e);
    }),
    (t.prototype._setViewerAction = function (e, t, o, n) {
      var r = {
        actionType: e,
        disabled: t || this._actionIsDisabled(e),
        checked: o || this._actionIsChecked(e),
        shown: n || this._actionIsShown(e),
      };
      this._onViewerActionStatusChanged({ action: r });
    }),
    (t.prototype._updateViewerActions = function () {
      this._updatePageSettingsActions(),
        this._updateViewModeActions(),
        this._updateMouseModeActions(),
        this._setViewerAction(_ViewerActionType.ShowExportsPanel);
    }),
    (t.prototype._updateViewModeActions = function () {
      this._setViewerAction(_ViewerActionType.Continuous),
        this._setViewerAction(_ViewerActionType.Single);
    }),
    (t.prototype._updatePageSettingsActions = function () {
      this._setViewerAction(_ViewerActionType.TogglePaginated),
        this._setViewerAction(_ViewerActionType.Landscape),
        this._setViewerAction(_ViewerActionType.Portrait),
        this._setViewerAction(_ViewerActionType.ShowPageSetupDialog);
    }),
    (t.prototype._updateMouseModeActions = function () {
      this._setViewerAction(_ViewerActionType.SelectTool),
        this._setViewerAction(_ViewerActionType.MoveTool),
        this._setViewerAction(_ViewerActionType.MagnifierTool),
        this._setViewerAction(_ViewerActionType.RubberbandTool);
    }),
    (t.prototype._updateZoomModeActions = function () {
      this._setViewerAction(_ViewerActionType.FitPageWidth),
        this._setViewerAction(_ViewerActionType.FitWholePage);
    }),
    (t.prototype._updateZoomFactorActions = function () {
      this._setViewerAction(_ViewerActionType.ZoomOut),
        this._setViewerAction(_ViewerActionType.ZoomIn);
    }),
    (t.prototype._onPageSettingsUpdated = function () {
      this._updatePageSettingsActions(),
        this._updateViewModeActions(),
        this._resetToolbarWidth();
    }),
    (t.prototype._onPageCountUpdated = function () {
      this._updatePageNavActions(), this._resetToolbarWidth();
    }),
    (t.prototype._updatePageNavActions = function () {
      this._setViewerAction(_ViewerActionType.FirstPage),
        this._setViewerAction(_ViewerActionType.LastPage),
        this._setViewerAction(_ViewerActionType.PrePage),
        this._setViewerAction(_ViewerActionType.NextPage);
    }),
    (t.prototype._onHistoryManagerStatusUpdated = function () {
      this._setViewerAction(_ViewerActionType.Backward),
        this._setViewerAction(_ViewerActionType.Forward);
    }),
    (t.prototype._updateUI = function () {
      var e = this;
      Object.keys(_ViewerActionType).forEach(function (t) {
        isNaN(t) || e._setViewerAction(_ViewerActionType[_ViewerActionType[t]]);
      });
      var t = wjcCore.Control.getControl(this._sidePanel);
      t && t.enableAll(this._isDocumentSourceLoaded());
    }),
    (t.prototype._updateViewContainerCursor = function () {
      this.mouseMode === MouseMode.MoveTool
        ? wjcCore.hasClass(this._viewpanelContainer, 'move') ||
          wjcCore.addClass(this._viewpanelContainer, 'move')
        : wjcCore.hasClass(this._viewpanelContainer, 'move') &&
          wjcCore.removeClass(this._viewpanelContainer, 'move');
    }),
    (t.prototype._updateFullScreenStyle = function () {
      var e = document.body;
      this.fullScreen
        ? ((this._bodyOriginScrollLeft =
            (document.documentElement && document.documentElement.scrollLeft) ||
            e.scrollLeft),
          (this._bodyOriginScrollTop =
            (document.documentElement && document.documentElement.scrollTop) ||
            e.scrollTop),
          wjcCore.addClass(this.hostElement, 'full-screen'),
          wjcCore.addClass(e, 'full-screen'),
          (this._hostOriginWidth = this.hostElement.style.width),
          (this._hostOriginHeight = this.hostElement.style.height),
          (this.hostElement.style.width = '100%'),
          (this.hostElement.style.height = '100%'),
          window.scrollTo(0, 0))
        : (wjcCore.removeClass(this.hostElement, 'full-screen'),
          wjcCore.removeClass(e, 'full-screen'),
          (this.hostElement.style.width = this._hostOriginWidth),
          (this.hostElement.style.height = this._hostOriginHeight),
          wjcCore.isNumber(this._bodyOriginScrollLeft) &&
            (document.documentElement &&
              (document.documentElement.scrollLeft =
                this._bodyOriginScrollLeft),
            (e.scrollLeft = this._bodyOriginScrollLeft)),
          wjcCore.isNumber(this._bodyOriginScrollTop) &&
            (document.documentElement &&
              (document.documentElement.scrollTop = this._bodyOriginScrollTop),
            (e.scrollTop = this._bodyOriginScrollTop))),
        this.refresh();
    }),
    (t.prototype._export = function (e) {
      var t = this._documentSource.getRenderToFilterUrl(e);
      if (isIOS()) window.open(t);
      else {
        var o = document.querySelector('#viewDownloader');
        o ||
          (((o = document.createElement('iframe')).id = 'viewDownloader'),
          (o.style.display = 'none'),
          document.body.appendChild(o)),
          (o.src = t);
      }
    }),
    (t.prototype.showPageSetupDialog = function () {
      this._pageSetupDialog || this._createPageSetupDialog(),
        this._pageSetupDialog.showWithValue(this._documentSource.pageSettings);
    }),
    (t.prototype._createPageSetupDialog = function () {
      var e = this,
        t = document.createElement('div');
      (t.style.display = 'none'),
        e.hostElement.appendChild(t),
        (e._pageSetupDialog = new _PageSetupDialog(t)),
        e._pageSetupDialog.applied.addHandler(function () {
          return e._setPageSettings(e._pageSetupDialog.pageSettings);
        });
    }),
    (t.prototype.zoomToView = function () {
      wjcCore._deprecated('zoomToView', 'zoomMode'),
        this._documentSource && (this.zoomMode = ZoomMode.WholePage);
    }),
    (t.prototype.zoomToViewWidth = function () {
      wjcCore._deprecated('zoomToViewWidth', 'zoomMode'),
        this._documentSource && (this.zoomMode = ZoomMode.PageWidth);
    }),
    (t.prototype._setPageLandscape = function (e) {
      var t = this,
        o = this._documentSource.pageSettings;
      _setLandscape(o, e), t._setPageSettings(o);
    }),
    (t.prototype._setPaginated = function (e) {
      var t = this._documentSource.features,
        o = this._documentSource.pageSettings;
      t &&
        o &&
        e != o.paginated &&
        (e && t.paginated
          ? ((o.paginated = !0), this._setPageSettings(o))
          : !e &&
            t.nonPaginated &&
            ((o.paginated = !1), this._setPageSettings(o)));
    }),
    (t.prototype._setPageSettings = function (e) {
      var t = this;
      return (
        this._showViewPanelMessage(),
        this._setDocumentRendering(),
        this._documentSource
          .setPageSettings(e)
          .then(function (e) {
            t._resetDocument(), t._reRenderDocument();
          })
          .catch(function (e) {
            t._showViewPanelErrorMessage(_getErrorMessage(e));
          })
      );
    }),
    (t.prototype._showViewPanelErrorMessage = function (e) {
      this._showViewPanelMessage(e, 'errormessage');
    }),
    (t.prototype._showViewPanelMessage = function (e, t) {
      var o = this._viewpanelContainer.querySelector('.wj-viewer-loading');
      o ||
        (((o = document.createElement('div')).innerHTML =
          '<span class="verticalalign"></span><span class="textspan"></span>'),
        this._viewpanelContainer.appendChild(o)),
        (o.className = 'wj-viewer-loading'),
        t && wjcCore.addClass(o, t);
      var n = o.querySelector('.textspan');
      n && (n.innerHTML = e || wjcCore.culture.Viewer.loading);
    }),
    (t.prototype._removeViewPanelMessage = function () {
      var e = this._viewpanelContainer.querySelector('.wj-viewer-loading');
      e && this._viewpanelContainer.removeChild(e);
    }),
    (t.prototype._reRenderDocument = function () {
      this._documentSource &&
        (this._showViewPanelMessage(), this._documentSource.load());
    }),
    (t.prototype._zoomBtnClicked = function (e, t) {
      var o, n;
      for (o = 0; o < t.length; o++) {
        if (t[o].value > this.zoomFactor) {
          n = o - 0.5;
          break;
        }
        if (t[o].value === this.zoomFactor) {
          n = o;
          break;
        }
      }
      null == n && (n = t.length - 0.5),
        (n <= 0 && !e) ||
          (n >= t.length - 1 && e) ||
          ((n = e ? Math.floor(n) + 1 : Math.ceil(n) - 1),
          (this.zoomFactor = t[n].value));
    }),
    (t.prototype._getDocumentSource = function () {
      return this._documentSource;
    }),
    (t.prototype._setDocumentSource = function (e) {
      var t = this;
      this._loadDocument(e).then(function (o) {
        t._documentSource == e && t._ensureExportFormatsLoaded();
      });
    }),
    (t.prototype._loadDocument = function (e) {
      var t = this,
        o = new _Promise();
      return this._documentSource === e
        ? o
        : (this._disposeDocument(),
          (this._documentSource = e),
          e &&
            (_addWjHandler(
              this._documentEventKey,
              e.loading,
              function () {
                t._updateUI();
              },
              this
            ),
            _addWjHandler(
              this._documentEventKey,
              e.loadCompleted,
              this._onDocumentSourceLoadCompleted,
              this
            ),
            _addWjHandler(
              this._documentEventKey,
              e.queryLoadingData,
              function (e, o) {
                t.onQueryLoadingData(o);
              },
              this
            ),
            e.isLoadCompleted
              ? (this._onDocumentSourceLoadCompleted(),
                this._keepServiceConnection(),
                o.resolve())
              : (this._showViewPanelMessage(),
                e
                  .load()
                  .then(function (e) {
                    t._keepServiceConnection(), o.resolve(e);
                  })
                  .catch(function (e) {
                    t._showViewPanelErrorMessage(_getErrorMessage(e));
                  }))),
          this._onDocumentSourceChanged(),
          o);
    }),
    (t.prototype._hyperlinkClicked = function (e) {
      var t = e.getAttribute(_Page._bookmarkAttr);
      if (t) this._goToBookmark(t);
      else {
        var o = e.getAttribute(_Page._customActionAttr);
        o && this._executeCustomAction(o);
      }
    }),
    (t.prototype._onDocumentSourceLoadCompleted = function () {
      var e = this,
        t = this._documentSource.errors;
      if (this._documentSource.isLoadCompleted) {
        if (
          (this._removeViewPanelMessage(),
          (this._pages.length = 0),
          this._documentSource.pageCount <= 0)
        )
          return void this._updateUI();
        for (
          var o = {
              width: this._documentSource.pageSettings.width,
              height: this._documentSource.pageSettings.height,
            },
            n = 0;
          n < this._documentSource.pageCount;
          n++
        ) {
          var r = new _Page(this._documentSource, n, o);
          r.linkClicked.addHandler(function (t, o) {
            e._hyperlinkClicked(o.element);
          }),
            this._pages.push(r);
        }
        (this._pageView.pages = this._pages),
          this._documentSource.paginated || (this.viewMode = ViewMode.Single),
          this._autoHeightCalculated ||
            (this._autoCalculateHeight(), (this._autoHeightCalculated = !0));
        var i = this._documentSource.initialPosition || this._initialPosition;
        if (
          ((this._documentSource.initialPosition = null),
          (this._initialPosition = null),
          (i && 0 != i.pageIndex) ||
            ((this._pageIndex = 0), (i = { pageIndex: 0 })),
          this._scrollToPosition(i),
          this._updateHistoryCurrent(),
          t && t.length > 0)
        )
          for (n = 0; n < t.length; n++) t[n] + '\r\n';
        this._updateUI();
      }
    }),
    (t.prototype._clearKeepSerConnTimer = function () {
      null != this._keepSerConnTimer && clearTimeout(this._keepSerConnTimer);
    }),
    (t.prototype._keepServiceConnection = function () {
      var e = this;
      this._clearKeepSerConnTimer();
      var t = this._documentSource;
      t &&
        (this._keepSerConnTimer = setTimeout(function () {
          e._documentSource === t &&
            e._documentSource.getStatus().then(function (t) {
              return e._keepServiceConnection();
            });
        }, this._getExpiredTime()));
    }),
    (t.prototype._getExpiredTime = function () {
      if (this._expiredTime) return this._expiredTime;
      var e = this._documentSource;
      return e && e.expiredDateTime && e.executionDateTime
        ? ((this._expiredTime =
            e.expiredDateTime.getTime() - e.executionDateTime.getTime()),
          (this._expiredTime = Math.max(this._expiredTime - 12e4, 0)),
          this._expiredTime)
        : 6e3;
    }),
    (t.prototype._disposeDocument = function () {
      this._documentSource &&
        (_removeAllWjHandlers(
          this._documentEventKey,
          this._documentSource.disposed
        ),
        _removeAllWjHandlers(
          this._documentEventKey,
          this._documentSource.pageCountChanged
        ),
        _removeAllWjHandlers(
          this._documentEventKey,
          this._documentSource.pageSettingsChanged
        ),
        _removeAllWjHandlers(
          this._documentEventKey,
          this._documentSource.loadCompleted
        ),
        _removeAllWjHandlers(
          this._documentEventKey,
          this._documentSource.queryLoadingData
        ),
        this._documentSource.dispose()),
        this._resetDocument();
    }),
    (t.prototype._resetDocument = function () {
      (this._pages.length = 0),
        this._pageView.resetPages(),
        (this._pageIndex = 0),
        clearTimeout(this._historyTimer),
        this._historyManager.clear(),
        this._rubberband && this._rubberband.reset(),
        this._magnifier && this._magnifier.reset();
    }),
    (t.prototype._setDocumentRendering = function () {
      this._documentSource._updateIsLoadCompleted(!1);
    }),
    (t.prototype.moveToPage = function (e) {
      return this._innerMoveToPage(e);
    }),
    (t.prototype._getCurrentPosition = function () {
      return _getPositionByHitTestInfo(this._pageView.hitTest(0, 0));
    }),
    (t.prototype._resolvePageIndex = function (e) {
      return Math.min(this._documentSource.pageCount - 1, Math.max(e, 0));
    }),
    (t.prototype._innerMoveToPage = function (e) {
      return (
        this._resolvePageIndex(e) != this.pageIndex && this._addHistory(!1, !0),
        this._updatePageIndex(e),
        this._pageView.moveToPage(e)
      );
    }),
    (t.prototype._moveToLastPage = function () {
      var e = new _Promise();
      return this._ensureDocumentLoadCompleted(e)
        ? this._innerMoveToPage(this._documentSource.pageCount - 1)
        : e;
    }),
    (t.prototype._moveBackwardHistory = function () {
      if (
        this._ensureDocumentLoadCompleted() &&
        this._historyManager.canBackward()
      ) {
        var e = this._historyManager.backward();
        this._moveToHistory(e);
      }
    }),
    (t.prototype._moveForwardHistory = function () {
      if (
        this._ensureDocumentLoadCompleted() &&
        this._historyManager.canForward()
      ) {
        var e = this._historyManager.forward();
        this._moveToHistory(e);
      }
    }),
    (t.prototype._moveToHistory = function (e) {
      var t = this;
      if (e) {
        (this._historyMoving = !0),
          (this.viewMode = e.viewMode),
          e.zoomMode === ZoomMode.Custom
            ? (this.zoomFactor = e.zoomFactor)
            : (this.zoomMode = e.zoomMode),
          this._scrollToPosition(e.position).then(function (e) {
            t._historyMoving = !1;
          });
        for (var o = 0; o < e.pageAngles.length; o++)
          this._pageView.rotatePageTo(o, e.pageAngles[o]);
      }
    }),
    (t.prototype._isPositionEquals = function (e, t, o) {
      return (
        e.pageIndex === t.pageIndex &&
        (!o ||
          e.pageBounds == t.pageBounds ||
          (null != e.pageBounds &&
            null != t.pageBounds &&
            e.pageBounds.x === t.pageBounds.x &&
            e.pageBounds.y === t.pageBounds.y))
      );
    }),
    (t.prototype._isPageAnglesChanged = function (e) {
      if (e.length != this._pageView.pages.length) return !0;
      for (var t = e.length, o = 0; o < t; o++)
        if (e[o] !== this._pageView.pages[o].rotateAngle) return !0;
      return !1;
    }),
    (t.prototype._updateHistoryCurrent = function () {
      (this._historyManager.current.position = this._getCurrentPosition()),
        (this._historyManager.current.zoomMode = this.zoomMode),
        (this._historyManager.current.zoomFactor = this.zoomFactor),
        (this._historyManager.current.viewMode = this.viewMode),
        this._updateCurrentPageAngles(this._historyManager.current);
    }),
    (t.prototype._innerAddHistory = function (e) {
      var t = this._getCurrentPosition(),
        o = this._historyManager.current;
      (this._isPositionEquals(t, o.position, e) &&
        this.viewMode === o.viewMode &&
        this.zoomMode === o.zoomMode &&
        this.zoomFactor === o.zoomFactor &&
        !this._isPageAnglesChanged(o.pageAngles)) ||
        ((o.position = o.position || this._getCurrentPosition()),
        (o.viewMode = null == o.viewMode ? this.viewMode : o.viewMode),
        (o.zoomMode = null == o.zoomMode ? this.zoomMode : o.zoomMode),
        (o.zoomFactor = null == o.zoomFactor ? this.zoomFactor : o.zoomFactor),
        o.pageAngles || this._updateCurrentPageAngles(o),
        this._historyManager.add(),
        this._updateHistoryCurrent());
    }),
    (t.prototype._addHistory = function (e, o, n) {
      var r = this;
      this.isUpdating ||
        this._historyMoving ||
        (o
          ? (this._mergeHistory(n),
            null != this._historyTimer && clearTimeout(this._historyTimer),
            (this._historyTimer = setTimeout(function () {
              (r._historyTimer = null), r._innerAddHistory(e);
            }, t._historyTimeout)))
          : this._innerAddHistory(e));
    }),
    (t.prototype._updateCurrentPageAngles = function (e) {
      e.pageAngles || (e.pageAngles = new Array());
      for (var t = this._pageView.pages.length, o = 0; o < t; o++)
        e.pageAngles[o] = this._pageView.pages[o].rotateAngle;
    }),
    (t.prototype._mergeHistory = function (e) {
      var t = this._historyManager.current;
      if (!e)
        return (
          (t.viewMode = this.viewMode),
          (t.zoomMode = this.zoomMode),
          (t.zoomFactor = this.zoomFactor),
          void this._updateCurrentPageAngles(t)
        );
      if (
        (null != e.viewMode && (t.viewMode = e.viewMode),
        null != e.zoomMode && (t.zoomMode = e.zoomMode),
        null != e.zoomFactor && (t.zoomFactor = e.zoomFactor),
        e.pageAngles)
      ) {
        t.pageAngles = new Array();
        for (var o = this._pageView.pages.length, n = 0; n < o; n++)
          t.pageAngles[n] = e.pageAngles[n];
      }
    }),
    (t.prototype._ensureDocumentLoadCompleted = function (e) {
      return this._documentSource
        ? !!this._documentSource.isLoadCompleted ||
            (e &&
              e.reject(
                'Cannot set page index when document source is not loaded completely.'
              ),
            !1)
        : (e && e.reject('Cannot set page index without document source.'), !1);
    }),
    (t.prototype._updatePageIndex = function (e) {
      this._documentSource &&
        ((e = Math.min(this._documentSource.pageCount - 1, Math.max(e, 0))),
        this._pageIndex !== e &&
          ((this._pageIndex = e), this.onPageIndexChanged()));
    }),
    (t.prototype._getRotatedAngle = function (e) {
      switch (e) {
        case _RotateAngle.NoRotate:
          return _RotateAngle.Rotation90;
        case _RotateAngle.Rotation90:
          return _RotateAngle.Rotation180;
        case _RotateAngle.Rotation180:
          return _RotateAngle.Rotation270;
        case _RotateAngle.Rotation270:
          return _RotateAngle.NoRotate;
      }
      return _RotateAngle.NoRotate;
    }),
    (t.prototype._rotateDocument = function () {
      this._addHistory(!1, !0);
      for (var e = this._pageView.pages.length, t = 0; t < e; t++)
        this._pageView.rotatePageTo(
          t,
          this._getRotatedAngle(this._pageView.pages[t].rotateAngle)
        );
    }),
    (t.prototype._rotatePage = function () {
      this._addHistory(!1, !0);
      var e = this._pageView.pages[this._pageIndex];
      this._pageView.rotatePageTo(
        this._pageIndex,
        this._getRotatedAngle(e.rotateAngle)
      );
    }),
    Object.defineProperty(t.prototype, 'zoomMode', {
      get: function () {
        return this._pageView.zoomMode;
      },
      set: function (e) {
        (this._pageView.zoomMode = e), this._updateZoomModeActions();
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'zoomFactor', {
      get: function () {
        return this._pageView.zoomFactor;
      },
      set: function (e) {
        this._pageView.zoomFactor = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'viewMode', {
      get: function () {
        return this._viewMode;
      },
      set: function (e) {
        this._viewMode !== e &&
          ((this._viewMode = e), this.onViewModeChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'selectMouseMode', {
      get: function () {
        return this._mouseMode === MouseMode.SelectTool;
      },
      set: function (e) {
        wjcCore._deprecated('selectMouseMode', 'mouseMode'),
          (e && this._mouseMode === MouseMode.SelectTool) ||
            (!e && this._mouseMode !== MouseMode.SelectTool) ||
            (this.mouseMode = e ? MouseMode.SelectTool : MouseMode.MoveTool);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'mouseMode', {
      get: function () {
        return this._mouseMode;
      },
      set: function (e) {
        if (this._mouseMode !== (e = wjcCore.asEnum(e, MouseMode))) {
          var t = this.selectMouseMode;
          switch (((this._mouseMode = e), this._mouseMode)) {
            case MouseMode.RubberbandTool:
              this._rubberband.activate(), this._magnifier.deactivate();
              break;
            case MouseMode.MagnifierTool:
              this._magnifier.activate(), this._rubberband.deactivate();
              break;
            default:
              this._magnifier.deactivate(), this._rubberband.deactivate();
          }
          this.onMouseModeChanged(),
            t != this.selectMouseMode && this.onSelectMouseModeChanged();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'fullScreen', {
      get: function () {
        return this._fullScreen;
      },
      set: function (e) {
        this._fullScreen !== e &&
          ((this._fullScreen = e), this.onFullScreenChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pageIndex', {
      get: function () {
        return this._pageIndex;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._initMiniToolbar = function () {
      wjcCore.Control.getControl(this._miniToolbar) ||
        (new _ViewerMiniToolbar(this._miniToolbar, this),
        wjcCore.addClass(this._miniToolbar, 'wj-mini-toolbar'));
    }),
    (t.prototype._pinMiniToolbar = function () {
      var e = this;
      this._showMiniToolbar(!0),
        (this._miniToolbarPinnedTimer = setTimeout(function () {
          e._showMiniToolbar(!1), (e._miniToolbarPinnedTimer = null);
        }, t._miniToolbarPinnedTime));
    }),
    (t.prototype._onDocumentSourceChanged = function (e) {
      this._clearExportFormats(),
        this._documentSourceChanged.raise(this, e || new wjcCore.EventArgs()),
        this._updateViewerActions(),
        this._onPageSettingsUpdated(),
        this._onPageCountUpdated(),
        this._updateViewModeActions(),
        (this._searchManager.documentSource = this._documentSource),
        this._documentSource &&
          (_addWjHandler(
            this._documentEventKey,
            this._documentSource.pageSettingsChanged,
            this._onPageSettingsUpdated,
            this
          ),
          _addWjHandler(
            this._documentEventKey,
            this._documentSource.pageCountChanged,
            this._onPageCountUpdated,
            this
          ),
          _addWjHandler(
            this._documentEventKey,
            this._documentSource.loadCompleted,
            this._onPageCountUpdated,
            this
          ));
    }),
    (t.prototype.onPageIndexChanged = function (e) {
      this.pageIndexChanged.raise(this, e || new wjcCore.EventArgs()),
        this._updatePageNavActions();
    }),
    (t.prototype.onViewModeChanged = function (e) {
      this.viewModeChanged.raise(this, e || new wjcCore.EventArgs()),
        this._updateViewModeActions(),
        (this._pageView.viewMode = this.viewMode);
    }),
    (t.prototype.onSelectMouseModeChanged = function (e) {
      this.selectMouseModeChanged.hasHandlers &&
        wjcCore._deprecated('selectMouseModeChanged', 'mouseModeChanged'),
        this.selectMouseModeChanged.raise(this, e);
    }),
    (t.prototype.onMouseModeChanged = function (e) {
      this.mouseModeChanged.raise(this, e || new wjcCore.EventArgs()),
        ((this.mouseMode !== MouseMode.MoveTool &&
          this.mouseMode !== MouseMode.SelectTool) ||
          !wjcCore.isMobile()) &&
          (this._updateMouseModeActions(),
          this._updateViewContainerCursor(),
          (this._pageView.panMode = this.mouseMode === MouseMode.MoveTool));
    }),
    (t.prototype.onFullScreenChanged = function (e) {
      this.fullScreenChanged.raise(this, e || new wjcCore.EventArgs()),
        this._setViewerAction(_ViewerActionType.ToggleFullScreen),
        this._updateFullScreenStyle(),
        this.fullScreen && this._pinMiniToolbar();
    }),
    (t.prototype.onZoomFactorChanged = function (e) {
      this.zoomFactorChanged.raise(this, e || new wjcCore.EventArgs()),
        this._updateZoomFactorActions(),
        this._updateZoomModeActions();
    }),
    (t.prototype.onQueryLoadingData = function (e) {
      this.queryLoadingData.raise(this, e);
    }),
    (t._seperatorHtml =
      "<div class='wj-separator' style='width:100%;height: 1px;margin: 3px 0;background-color:rgba(0,0,0,.2)'/>"),
    (t._viewpanelContainerMinHeight = 300),
    (t._miniToolbarPinnedTime = 3e3),
    (t._narrowCss = 'narrow'),
    (t._narrowWidthThreshold = 400),
    (t._thumbnailWidth = 100),
    (t._historyTimeout = 300),
    (t._defaultZoomValues = [
      { name: wjcCore.Globalize.format(0.05, 'p0'), value: 0.05 },
      { name: wjcCore.Globalize.format(0.25, 'p0'), value: 0.25 },
      { name: wjcCore.Globalize.format(0.5, 'p0'), value: 0.5 },
      { name: wjcCore.Globalize.format(0.75, 'p0'), value: 0.75 },
      { name: wjcCore.Globalize.format(1, 'p0'), value: 1 },
      { name: wjcCore.Globalize.format(2, 'p0'), value: 2 },
      { name: wjcCore.Globalize.format(3, 'p0'), value: 3 },
      { name: wjcCore.Globalize.format(4, 'p0'), value: 4 },
      { name: wjcCore.Globalize.format(8, 'p0'), value: 8 },
      { name: wjcCore.Globalize.format(10, 'p0'), value: 10 },
    ]),
    (t.controlTemplate =
      '<div class="wj-viewer-outer wj-content with-footer"><div wj-part="toolbar"></div><div wj-part="mobile-toolbar"></div><div class="wj-viewer-container" wj-part="viewer-container"><div class="wj-viewer-leftpanel" wj-part="viewer-left-panel"><div class="wj-viewer-tabsleft" wj-part="side-panel"></div></div><div class="wj-viewer-splitter" wj-part="splitter"><button class="wj-btn wj-btn-default" type="button"><span class="wj-glyph-right"></span></button></div><div class="wj-viewpanel-container" wj-part="viewpanel-container"></div></div><div wj-part="mini-toolbar"></div><div class="wj-searchbar mobile" wj-part="search-bar"></div><div class="wj-viewer-footer mobile" class="wj-viewer-footer" wj-part="viewer-footer"><div wj-part="zoom-bar"></div><span class="wj-close">×</span></div></div>'),
    t
  );
})(wjcCore.Control);
exports.ViewerBase = ViewerBase;
var _PageSetupDialog = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    o.applied = new wjcCore.Event();
    var n;
    return (
      (o.modal = !0),
      (o.hideTrigger = wjcInput.PopupTrigger.None),
      (n = o.getTemplate()),
      o.applyTemplate('wj-control wj-content', n, {
        _gHeader: 'g-header',
        _pageSetupEditorElement: 'pagesetup-editor',
        _btnApply: 'btn-apply',
        _btnCancel: 'btn-cancel',
        _btnClose: 'a-close',
      }),
      (o._pageSetupEditor = new _PageSetupEditor(o._pageSetupEditorElement)),
      o._globalize(),
      o._addEvents(),
      o
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'pageSettings', {
      get: function () {
        return this._pageSetupEditor.pageSettings;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._globalize = function () {
      var e = wjcCore.culture.Viewer;
      (this._gHeader.textContent = e.pageSetup),
        (this._btnApply.textContent = e.ok),
        (this._btnCancel.textContent = e.cancel);
    }),
    (t.prototype._addEvents = function () {
      var e = this;
      _addEvent(e._btnClose, 'click', function () {
        e.hide();
      }),
        _addEvent(e._btnCancel, 'click', function () {
          e.hide();
        }),
        _addEvent(e._btnApply, 'click', function () {
          e._apply(), e.hide();
        });
    }),
    (t.prototype._apply = function () {
      this.onApplied();
    }),
    (t.prototype.onApplied = function () {
      this.applied.raise(this, new wjcCore.EventArgs());
    }),
    (t.prototype.showWithValue = function (t) {
      (this._pageSetupEditor.pageSettings = t), e.prototype.show.call(this);
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        t && (this._globalize(), this._pageSetupEditor.refresh());
    }),
    (t.controlTemplate =
      '<div><div wj-part="g-header" class="wj-dialog-header"><a class="wj-hide" wj-part="a-close" style="float:right;outline:none;text-decoration:none;padding:0px 6px" href="" tabindex="-1" draggable="false">&times;</a></div><div style="padding:12px;"><div wj-part="pagesetup-editor"></div><div class="wj-dialog-footer"><a class="wj-hide" wj-part="btn-apply" href="" tabindex="-1" draggable="false"></a>&nbsp;&nbsp;<a class="wj-hide" wj-part="btn-cancel" href="" tabindex="-1" draggable="false"></a></div></div></div>'),
    t
  );
})(wjcInput.Popup);
exports._PageSetupDialog = _PageSetupDialog;
var _ViewerActionType;
!(function (e) {
  (e[(e.TogglePaginated = 0)] = 'TogglePaginated'),
    (e[(e.Print = 1)] = 'Print'),
    (e[(e.Portrait = 2)] = 'Portrait'),
    (e[(e.Landscape = 3)] = 'Landscape'),
    (e[(e.ShowPageSetupDialog = 4)] = 'ShowPageSetupDialog'),
    (e[(e.FirstPage = 5)] = 'FirstPage'),
    (e[(e.PrePage = 6)] = 'PrePage'),
    (e[(e.NextPage = 7)] = 'NextPage'),
    (e[(e.LastPage = 8)] = 'LastPage'),
    (e[(e.PageNumber = 9)] = 'PageNumber'),
    (e[(e.PageCountLabel = 10)] = 'PageCountLabel'),
    (e[(e.Backward = 11)] = 'Backward'),
    (e[(e.Forward = 12)] = 'Forward'),
    (e[(e.SelectTool = 13)] = 'SelectTool'),
    (e[(e.MoveTool = 14)] = 'MoveTool'),
    (e[(e.Continuous = 15)] = 'Continuous'),
    (e[(e.Single = 16)] = 'Single'),
    (e[(e.ZoomOut = 17)] = 'ZoomOut'),
    (e[(e.ZoomIn = 18)] = 'ZoomIn'),
    (e[(e.ZoomValue = 19)] = 'ZoomValue'),
    (e[(e.FitWholePage = 20)] = 'FitWholePage'),
    (e[(e.FitPageWidth = 21)] = 'FitPageWidth'),
    (e[(e.ToggleFullScreen = 22)] = 'ToggleFullScreen'),
    (e[(e.ShowHamburgerMenu = 23)] = 'ShowHamburgerMenu'),
    (e[(e.ShowViewMenu = 24)] = 'ShowViewMenu'),
    (e[(e.ShowSearchBar = 25)] = 'ShowSearchBar'),
    (e[(e.ShowThumbnails = 26)] = 'ShowThumbnails'),
    (e[(e.ShowOutlines = 27)] = 'ShowOutlines'),
    (e[(e.ShowExportsPanel = 28)] = 'ShowExportsPanel'),
    (e[(e.ShowPageSetupPanel = 29)] = 'ShowPageSetupPanel'),
    (e[(e.ShowZoomBar = 30)] = 'ShowZoomBar'),
    (e[(e.ShowSearchOptions = 31)] = 'ShowSearchOptions'),
    (e[(e.SearchPrev = 32)] = 'SearchPrev'),
    (e[(e.SearchNext = 33)] = 'SearchNext'),
    (e[(e.SearchMatchCase = 34)] = 'SearchMatchCase'),
    (e[(e.SearchMatchWholeWord = 35)] = 'SearchMatchWholeWord'),
    (e[(e.RubberbandTool = 36)] = 'RubberbandTool'),
    (e[(e.MagnifierTool = 37)] = 'MagnifierTool'),
    (e[(e.RotateDocument = 38)] = 'RotateDocument'),
    (e[(e.RotatePage = 39)] = 'RotatePage');
})(
  (_ViewerActionType =
    exports._ViewerActionType || (exports._ViewerActionType = {}))
);
var _MouseTool = (function (e) {
  function t(t, o, n, r, i, a, s) {
    var c = e.call(this, t) || this;
    return (
      (c._stopOnClientOut = r),
      (c._css = i),
      (c._activeCss = a),
      (c._visibleCss = s),
      (c._pageView = n),
      (c._viewPanelContainer = o),
      c._initElement(),
      c._bindEvents(),
      c
    );
  }
  return (
    __extends(t, e),
    (t.prototype.activate = function () {
      this._isActive ||
        ((this._isActive = !0),
        wjcCore.addClass(this._viewPanelContainer, this._activeCss));
    }),
    (t.prototype.deactivate = function () {
      this._isActive &&
        ((this._isActive = !1),
        wjcCore.removeClass(this._viewPanelContainer, this._activeCss));
    }),
    (t.prototype.reset = function () {
      this._innerStop(null);
    }),
    Object.defineProperty(t.prototype, 'isActive', {
      get: function () {
        return this._isActive;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'startPnt', {
      get: function () {
        return this._startPnt;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pageView', {
      get: function () {
        return this._pageView;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'viewPanelContainer', {
      get: function () {
        return this._viewPanelContainer;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._initElement = function () {
      this.applyTemplate(
        this._css,
        this.getTemplate(),
        this._getTemplateParts()
      ),
        this._viewPanelContainer.appendChild(this.hostElement);
    }),
    (t.prototype._innerStop = function (e) {
      try {
        this._stop(e);
      } finally {
        (this._isStarted = !1), (this._startPnt = null);
      }
    }),
    (t.prototype._getTemplateParts = function () {
      return null;
    }),
    (t.prototype._onMouseDown = function (e) {
      var t = this._toClientPoint(e),
        o = this._testPageWorkingAreaHit(t);
      o &&
        this.pageView.isPageContentLoaded(o.pageIndex) &&
        (void 0 !== window.getSelection && getSelection().removeAllRanges(),
        (this._isStarted = !0),
        (this._startPnt = t),
        this._start(o));
    }),
    (t.prototype._onMouseMove = function (e) {
      if (this._isStarted) {
        var t = this._toClientPoint(e),
          o = this._testPageWorkingAreaHit(t);
        o && this.pageView.isPageContentLoaded(o.pageIndex)
          ? this._move(t, o)
          : this._stopOnClientOut && this._stop(t);
      }
    }),
    (t.prototype._onMouseUp = function (e) {
      this._isStarted && this._innerStop(this._toClientPoint(e));
    }),
    (t.prototype._start = function (e) {
      wjcCore.addClass(this.hostElement, this._visibleCss);
    }),
    (t.prototype._move = function (e, t) {}),
    (t.prototype._stop = function (e) {
      wjcCore.removeClass(this.hostElement, this._visibleCss);
    }),
    (t.prototype._bindEvents = function () {
      var e = this;
      this.addEventListener(
        this._viewPanelContainer,
        'mousedown',
        function (t) {
          e._isActive && e._onMouseDown(t);
        }
      ),
        this.addEventListener(
          this._viewPanelContainer,
          'mousemove',
          function (t) {
            e._isActive && e._onMouseMove(t);
          }
        ),
        this.addEventListener(document, 'mouseup', function (t) {
          e._isActive && e._onMouseUp(t);
        });
    }),
    (t.prototype._toClientPoint = function (e) {
      var t = this._viewPanelContainer.getBoundingClientRect();
      return new wjcCore.Point(e.clientX - t.left, e.clientY - t.top);
    }),
    (t.prototype._testPageWorkingAreaHit = function (e) {
      var t = this._pageView.hitTest(e.x, e.y);
      return t && t.hitWorkingArea ? t : null;
    }),
    t
  );
})(wjcCore.Control);
exports._MouseTool = _MouseTool;
var _RubberbandOnAppliedEventArgs = (function (e) {
  function t(t) {
    var o = e.call(this) || this;
    return (o._rect = t), o;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'rect', {
      get: function () {
        return this._rect;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.EventArgs);
exports._RubberbandOnAppliedEventArgs = _RubberbandOnAppliedEventArgs;
var _Rubberband = (function (e) {
  function t(t, o, n) {
    var r =
      e.call(
        this,
        t,
        o,
        n,
        !1,
        'wj-rubberband',
        'rubberband-actived',
        'show'
      ) || this;
    return (r.applied = new wjcCore.Event()), r;
  }
  return (
    __extends(t, e),
    (t.prototype._start = function (t) {
      e.prototype._start.call(this, t),
        (this.hostElement.style.left = this.startPnt.x + 'px'),
        (this.hostElement.style.top = this.startPnt.y + 'px');
    }),
    (t.prototype._move = function (e, t) {
      if (this.startPnt) {
        this.viewPanelContainer.getBoundingClientRect();
        (this.hostElement.style.width = e.x - this.startPnt.x + 'px'),
          (this.hostElement.style.height = e.y - this.startPnt.y + 'px');
      }
    }),
    (t.prototype._stop = function (t) {
      if (t) {
        var o = this.hostElement.getBoundingClientRect();
        o.width > 5 &&
          o.height > 5 &&
          this._onApplied(
            new _RubberbandOnAppliedEventArgs(
              new wjcCore.Rect(
                this.startPnt.x,
                this.startPnt.y,
                o.width,
                o.height
              )
            )
          );
      }
      (this.hostElement.style.width = '0px'),
        (this.hostElement.style.height = '0px'),
        e.prototype._stop.call(this, t);
    }),
    (t.prototype._onApplied = function (e) {
      this.applied.raise(this, e);
    }),
    t
  );
})(_MouseTool);
exports._Rubberband = _Rubberband;
var _Magnifier = (function (e) {
  function t(t, o, n) {
    var r =
      e.call(this, t, o, n, !0, 'wj-magnifier', 'magnifier-actived', 'show') ||
      this;
    return (r._Magnification = 2), (r._currentPageIndex = -1), r;
  }
  return (
    __extends(t, e),
    (t.prototype.deactivate = function () {
      e.prototype.deactivate.call(this), (this._currentPageIndex = -1);
    }),
    (t.prototype.reset = function () {
      e.prototype.reset.call(this), (this._currentPageIndex = -1);
    }),
    (t.prototype._getTemplateParts = function () {
      return { _viewPageDiv: 'view-page-div' };
    }),
    (t.prototype._bindEvents = function () {
      var t = this;
      e.prototype._bindEvents.call(this);
      var o = function () {
        if (!(t._currentPageIndex < 0)) {
          var e = t.pageView.pages[t._currentPageIndex],
            o = _getRotatedSize(e.size, e.rotateAngle),
            n = t._viewPageDiv.querySelector('svg');
          (t._viewPageDiv.style.height =
            o.height.valueInPixel * t.pageView.zoomFactor * t._Magnification +
            'px'),
            (t._viewPageDiv.style.width =
              o.width.valueInPixel * t.pageView.zoomFactor * t._Magnification +
              'px'),
            n.setAttribute('width', t._viewPageDiv.style.width),
            n.setAttribute('height', t._viewPageDiv.style.height),
            _transformSvg(
              n,
              e.size.width.valueInPixel,
              e.size.height.valueInPixel,
              t._Magnification * t.pageView.zoomFactor,
              e.rotateAngle
            );
        }
      };
      this.pageView.zoomFactorChanged.addHandler(function () {
        o();
      }),
        this.pageView.rotateAngleChanged.addHandler(function () {
          o();
        });
    }),
    (t.prototype._start = function (t) {
      e.prototype._start.call(this, t), this._showMagnifer(this.startPnt, t);
    }),
    (t.prototype._move = function (e, t) {
      this._showMagnifer(e, t);
    }),
    (t.prototype._showMagnifer = function (e, t) {
      var o = this.hostElement.getBoundingClientRect(),
        n = _getPositionByHitTestInfo(t);
      (this.hostElement.style.left = e.x - o.width / 2 + 'px'),
        (this.hostElement.style.top = e.y - o.height / 2 + 'px'),
        this._fillPage(n),
        this._showHitPosition(n);
    }),
    (t.prototype._fillPage = function (e) {
      var t = this;
      e.pageIndex !== this._currentPageIndex &&
        ((this._currentPageIndex = e.pageIndex),
        this.pageView.pages[this._currentPageIndex]
          .getContent()
          .then(function (e) {
            var o = e.cloneNode(!0);
            (t._viewPageDiv.innerHTML = ''),
              t._viewPageDiv.appendChild(o),
              o.setAttribute(
                'width',
                new _Unit(o.getAttribute('width')).valueInPixel *
                  t._Magnification +
                  'px'
              ),
              o.setAttribute(
                'height',
                new _Unit(o.getAttribute('height')).valueInPixel *
                  t._Magnification +
                  'px'
              );
            var n = t.pageView.pages[t._currentPageIndex].size;
            _transformSvg(
              o,
              n.width.valueInPixel,
              n.height.valueInPixel,
              t._Magnification * t.pageView.zoomFactor,
              t.pageView.pages[t._currentPageIndex].rotateAngle
            ),
              (t._viewPageDiv.style.width = o.getAttribute('width')),
              (t._viewPageDiv.style.height = o.getAttribute('height'));
          }));
    }),
    (t.prototype._showHitPosition = function (e) {
      var t = this.hostElement.getBoundingClientRect(),
        o = this.pageView.pages[this._currentPageIndex],
        n = _getTransformedPosition(
          e.pageBounds,
          o.size,
          o.rotateAngle,
          this.pageView.zoomFactor
        );
      (this._viewPageDiv.style.left =
        -n.x * this._Magnification + t.width / 2 + 'px'),
        (this._viewPageDiv.style.top =
          -n.y * this._Magnification + t.height / 2 + 'px');
    }),
    (t.controlTemplate =
      '<div wj-part="view-page-div" class="wj-view-page"></div>'),
    t
  );
})(_MouseTool);
exports._Magnifier = _Magnifier;
var parametersIcon =
    '<path d="M24,11.9v-2h-4V7h0V5h0h-1h-5V2h0V0h0h-1H1H0h0v2h0v11h0v1h0h1h5v4h0v1h0h1h3v4h0v1h0h1h2.1v-1H11V12h2.1v-2H11h-1h0v2h0v6H7V7h12v2.9h-1v2h5V23h-4.9v1H23h1h0v-1h0L24,11.9L24,11.9z M6,5L6,5l0,2h0v6H1V2h12v3H7H6z"/><path d="M20,20v-3v-1h-1h-1v-1v-1h-1h-3h-1v1v3v1h1h1v2h0h1h3h1h0L20,20L20,20z M14,18v-3h3v1h-1h-1v1v1H14z M17,17v1h-1v-1H17z M16,20v-1h1h1v-1v-1h1v3H16z"/>',
  ReportViewer = (function (e) {
    function t(t, o) {
      var n = e.call(this, t, o) || this;
      return n._initSidePanelParameters(), n;
    }
    return (
      __extends(t, e),
      Object.defineProperty(t.prototype, 'reportName', {
        get: function () {
          return this._reportName;
        },
        set: function (e) {
          e != this._reportName &&
            ((this._reportName = e),
            this._needBindDocumentSource(),
            this.invalidate());
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'paginated', {
        get: function () {
          return this._innerPaginated;
        },
        set: function (e) {
          this._innerPaginated = e;
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.getReportNames = function (e, t) {
        return _Report.getReportNames(e, t);
      }),
      (t.getReports = function (e, t, o) {
        return _Report.getReports(e, t, o);
      }),
      (t.prototype._globalize = function () {
        e.prototype._globalize.call(this);
        var t = wjcCore.culture.Viewer;
        this._gParameterTitle.textContent = t.parameters;
      }),
      (t.prototype._executeAction = function (o) {
        if (
          (e.prototype._executeAction.call(this, o), !this._actionIsDisabled(o))
        )
          switch (o) {
            case t._parameterCommandTag:
              wjcCore.Control.getControl(this._sidePanel).active(
                this._parametersPageId
              );
          }
      }),
      (t.prototype._actionIsDisabled = function (o) {
        switch (o) {
          case t._parameterCommandTag:
            return (
              !this._innerDocumentSource ||
              !this._innerDocumentSource.hasParameters
            );
        }
        return e.prototype._actionIsDisabled.call(this, o);
      }),
      (t.prototype._initHamburgerMenu = function (e) {
        this._hamburgerMenu = new _ReportHamburgerMenu(this, e);
      }),
      (t.prototype._initSidePanelParameters = function () {
        var e = this,
          t = wjcCore.Control.getControl(this._sidePanel),
          o = t.addPage(wjcCore.culture.Viewer.parameters, parametersIcon, 2);
        (this._parametersPageId = o.id),
          (this._gParameterTitle = o.outContent.querySelector('.wj-tabtitle')),
          o.format(function (o) {
            (e._paramsEditor = new _ParametersEditor(o.content)),
              e._paramsEditor.commit.addHandler(function () {
                e._innerDocumentSource &&
                  e._innerDocumentSource.hasParameters &&
                  (e._showViewPanelMessage(),
                  e._innerDocumentSource
                    .setParameters(e._paramsEditor.parameters)
                    .then(function (t) {
                      var o = t || [],
                        n = o.some(function (e) {
                          return !!e.error;
                        });
                      e._paramsEditor._reset(),
                        n
                          ? (e._paramsEditor.itemsSource = o)
                          : (e._resetDocument(),
                            (e._paramsEditor.isDisabled = !0),
                            e._renderDocumentSource());
                    })
                    .catch(function (t) {
                      e._showViewPanelErrorMessage(_getErrorMessage(t));
                    }),
                  e._isMobileTemplate() && t.collapse());
              }),
              e._paramsEditor.validate.addHandler(function () {
                e._innerDocumentSource &&
                  e._innerDocumentSource.hasParameters &&
                  ((e._paramsEditor.isDisabled = !0),
                  e._innerDocumentSource
                    .setParameters(e._paramsEditor.parameters)
                    .then(
                      function (t) {
                        (e._paramsEditor.itemsSource = t),
                          (e._paramsEditor.isDisabled = !1);
                      },
                      function (t) {
                        e._paramsEditor.isDisabled = !1;
                      }
                    ));
              });
            var n = function () {
                var n = e._innerDocumentSource;
                n.status === _ExecutionStatus.cleared ||
                n.status === _ExecutionStatus.notFound
                  ? _removeChildren(o.content)
                  : n.status === _ExecutionStatus.rendering
                  ? (e._paramsEditor.isDisabled = !0)
                  : n.status === _ExecutionStatus.completed &&
                    (e._paramsEditor.isDisabled = !1),
                  n.status === _ExecutionStatus.loaded &&
                    (n.hasParameters
                      ? n.getParameters().then(function (r) {
                          r.filter(function (e) {
                            return !e.hidden;
                          }).length
                            ? (t.show(o), t.active(o))
                            : t.hide(o),
                            e._innerDocumentSource != n ||
                              n.isDisposed ||
                              ((e._paramsEditor.itemsSource = r),
                              r.filter(function (e) {
                                return (
                                  null == e.value && !e.nullable && !e.hidden
                                );
                              }).length
                                ? e._showViewPanelMessage(
                                    wjcCore.culture.Viewer.requiringParameters
                                  )
                                : ((e._paramsEditor.isDisabled = !0),
                                  e._renderDocumentSource()));
                        })
                      : t.hide(o));
              },
              r = function () {
                e._innerDocumentSource &&
                  (_addWjHandler(
                    e._documentEventKey,
                    e._innerDocumentSource.statusChanged,
                    n
                  ),
                  n());
              };
            e._documentSourceChanged.addHandler(r), r();
          });
      }),
      Object.defineProperty(t.prototype, '_innerDocumentSource', {
        get: function () {
          return this._getDocumentSource();
        },
        enumerable: !0,
        configurable: !0,
      }),
      (t.prototype._loadDocument = function (t) {
        var o = this._innerDocumentSource !== t,
          n = e.prototype._loadDocument.call(this, t);
        return (
          t &&
            o &&
            _addWjHandler(
              this._documentEventKey,
              t.statusChanged,
              this._onDocumentStatusChanged,
              this
            ),
          n
        );
      }),
      (t.prototype._reRenderDocument = function () {
        this._renderDocumentSource();
      }),
      (t.prototype._onDocumentStatusChanged = function () {
        this._innerDocumentSource &&
          this._innerDocumentSource.status === _ExecutionStatus.loaded &&
          !this._innerDocumentSource.hasParameters &&
          this._renderDocumentSource();
      }),
      (t.prototype._renderDocumentSource = function () {
        var e = this;
        if (this._innerDocumentSource) {
          this._setDocumentRendering();
          var t = this._innerDocumentSource;
          t.render().then(function (o) {
            return e._getStatusUtilCompleted(t);
          });
        }
      }),
      (t.prototype._disposeDocument = function () {
        this._innerDocumentSource &&
          _removeAllWjHandlers(
            this._documentEventKey,
            this._innerDocumentSource.statusChanged
          ),
          e.prototype._disposeDocument.call(this);
      }),
      (t.prototype._setDocumentRendering = function () {
        this._innerDocumentSource._updateStatus(_ExecutionStatus.rendering),
          e.prototype._setDocumentRendering.call(this);
      }),
      (t.prototype._getSource = function () {
        return this.filePath
          ? new _Report({
              serviceUrl: this.serviceUrl,
              filePath: this.filePath,
              reportName: this.reportName,
              paginated: this.paginated,
            })
          : null;
      }),
      (t.prototype._supportsPageSettingActions = function () {
        return !0;
      }),
      (t.prototype.refresh = function (t) {
        void 0 === t && (t = !0),
          e.prototype.refresh.call(this, t),
          t && this._paramsEditor.refresh();
      }),
      (t._parameterCommandTag = 99),
      t
    );
  })(ViewerBase);
exports.ReportViewer = ReportViewer;
var _ParametersEditor = (function (e) {
  function t(t) {
    var o = e.call(this, t) || this;
    return (
      (o._parameters = {}),
      (o._errors = []),
      (o._errorsVisible = !1),
      (o.commit = new wjcCore.Event()),
      (o.validate = new wjcCore.Event()),
      wjcCore.addClass(o.hostElement, 'wj-parameterscontainer'),
      o._updateErrorsVisible(),
      o
    );
  }
  return (
    __extends(t, e),
    (t.prototype._setErrors = function (e) {
      (this._errors = e), this._updateErrorDiv();
    }),
    Object.defineProperty(t.prototype, 'parameters', {
      get: function () {
        return this._parameters;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemsSource', {
      get: function () {
        return this._itemSources;
      },
      set: function (e) {
        (this._itemSources = e), (this._parameters = {}), this._render();
        var t = [];
        (e || []).forEach(function (e) {
          e.error && t.push({ key: e.name, value: e.error });
        }),
          this._setErrors(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._reset = function () {
      this._lastEditedParam = null;
    }),
    (t.prototype._setErrorsVisible = function (e) {
      (this._errorsVisible = e), this._updateErrorsVisible();
    }),
    (t.prototype._updateErrorsVisible = function () {
      this._errorsVisible
        ? wjcCore.removeClass(this.hostElement, t._errorsHiddenCss)
        : wjcCore.addClass(this.hostElement, t._errorsHiddenCss);
    }),
    (t.prototype.onCommit = function () {
      this.commit.raise(this, new wjcCore.EventArgs());
    }),
    (t.prototype.onValidate = function () {
      this.validate.raise(this, new wjcCore.EventArgs()),
        this._setErrorsVisible(!1);
    }),
    (t.prototype._deferValidate = function (e, t, o) {
      var n = this;
      null != this._validateTimer &&
        (clearTimeout(this._validateTimer), (this._validateTimer = null)),
        (this._validateTimer = setTimeout(function () {
          null != t && t(),
            n.onValidate(),
            null != o && o(),
            (n._lastEditedParam = e),
            (n._validateTimer = null);
        }, 500));
    }),
    (t.prototype._updateErrorDiv = function () {
      for (
        var e = this._errors || [],
          o = this.hostElement.querySelectorAll('.error'),
          n = 0;
        n < o.length;
        n++
      )
        o[n].parentNode.removeChild(o[n]);
      for (n = 0; n < e.length; n++) {
        var r,
          i = this.hostElement.querySelector(
            '*[' + t._paramIdAttr + '="' + e[n].key + '"]'
          ),
          a = e[n].value;
        i &&
          (((r = document.createElement('div')).innerHTML = a),
          (r.className = 'error'),
          i.appendChild(r));
      }
    }),
    (t.prototype._render = function () {
      var e,
        o = this;
      if (
        (_removeChildren(this.hostElement, function (n) {
          if (
            !o._lastEditedParam ||
            n.getAttribute(t._paramIdAttr) !== o._lastEditedParam
          )
            return !0;
          e = n;
        }),
        this._itemSources)
      ) {
        this._itemSources.forEach(function (n) {
          if (o._lastEditedParam === n.name)
            return (o._lastEditedParam = null), void (e = null);
          if (!n.hidden) {
            var r = document.createElement('div'),
              i = document.createElement('span'),
              a = null;
            if (
              ((r.className = 'wj-parametercontainer'),
              (i.className = 'wj-parameterhead'),
              (i.innerHTML = n.prompt || n.name),
              wjcCore.isArray(n.allowedValues))
            )
              a = o._generateComboEditor(n);
            else
              switch (n.dataType) {
                case _ParameterType.Boolean:
                  a = o._generateBoolEditor(n);
                  break;
                case _ParameterType.DateTime:
                case _ParameterType.Time:
                case _ParameterType.Date:
                  a = o._generateDateTimeEditor(n);
                  break;
                case _ParameterType.Integer:
                case _ParameterType.Float:
                  a = o._generateNumberEditor(n);
                  break;
                case _ParameterType.String:
                  a = o._generateStringEditor(n);
              }
            a &&
              ((a.className += ' wj-parametercontrol'),
              r.setAttribute(t._paramIdAttr, n.name),
              r.appendChild(i),
              r.appendChild(a),
              e
                ? o.hostElement.insertBefore(r, e)
                : o.hostElement.appendChild(r));
          }
        });
        var n = document.createElement('input');
        (n.type = 'button'),
          (n.value = wjcCore.culture.Viewer.apply),
          (n.className = 'wj-applybutton'),
          _addEvent(n, 'click', function () {
            o._validateParameters() && ((o._errors = []), o.onCommit()),
              o._setErrorsVisible(!0);
          }),
          this.hostElement.appendChild(n);
      }
    }),
    (t.prototype.refresh = function (t) {
      void 0 === t && (t = !0),
        e.prototype.refresh.call(this, t),
        t && (this._reset(), this._render());
    }),
    (t.prototype._validateParameters = function () {
      for (
        var e,
          o = this.hostElement.querySelectorAll('textarea'),
          n = [],
          r = this.itemsSource,
          i = 0;
        i < r.length;
        i++
      ) {
        var a = r[i];
        (e = this.hostElement.querySelector(
          '[' + t._paramIdAttr + '="' + a.name + '"]'
        )),
          a.nullable ||
            this.parameters.hasOwnProperty(a.name) ||
            this.parameters[a.name] ||
            (null !== a.value && void 0 !== a.value && '' !== a.value) ||
            (e &&
              n.push({
                key: a.name,
                value: wjcCore.culture.Viewer.nullParameterError,
              }));
      }
      for (i = 0; i < o.length; i++) {
        var s = o.item(i),
          c = !0;
        switch (parseInt(s.getAttribute('data-type'))) {
          case _ParameterType.Date:
          case _ParameterType.DateTime:
          case _ParameterType.Time:
            c = t._checkValueType(s.value, wjcCore.isDate);
            break;
          case _ParameterType.Float:
            c = t._checkValueType(s.value, t._isFloat);
            break;
          case _ParameterType.Integer:
            c = t._checkValueType(s.value, wjcCore.isInt);
        }
        c ||
          n.push({
            key: s.parentElement.id,
            value: wjcCore.culture.Viewer.invalidParameterError,
          });
      }
      return this._setErrors(n), n.length <= 0;
    }),
    (t._isFloat = function (e) {
      return !isNaN(parseFloat(e));
    }),
    (t._checkValueType = function (e, t) {
      for (var o = e.split('\n'), n = 0; n < o.length; n++)
        if (!(o[n].trim().length <= 0 || t(o[n].trim()))) return !1;
      return !0;
    }),
    (t.prototype._generateComboEditor = function (e) {
      var t,
        o,
        n,
        r = this,
        i = [],
        a = document.createElement('div'),
        s = [],
        c = e.allowedValues && e.allowedValues.length > 0;
      e.multiValue
        ? (t = new _MultiSelectEx(a))
        : ((t = new wjcInput.ComboBox(a)),
          e.nullable
            ? i.push({
                name: wjcCore.culture.Viewer.parameterNoneItemsSelected,
                value: null,
              })
            : null == e.value &&
              c &&
              i.push({
                name: wjcCore.culture.Viewer.selectParameterValue,
                value: null,
              })),
        (t.isEditable = !1),
        (t.displayMemberPath = 'name'),
        (t.selectedValuePath = 'value'),
        (t.isDisabled = !c);
      for (u = 0; u < e.allowedValues.length; u++)
        i.push({
          name: e.allowedValues[u].key,
          value: e.allowedValues[u].value,
        });
      if (((t.itemsSource = i), e.multiValue)) {
        if (((o = t), c)) {
          if (e.value) {
            for (var u = 0; u < e.value.length; u++)
              for (var l = 0; l < o.itemsSource.length; l++)
                if (o.itemsSource[l].value === e.value[u]) {
                  s.push(o.itemsSource[l]);
                  break;
                }
            o.checkedItems = s;
          }
        } else o.checkedItems = [];
        o.checkedItemsChanged.addHandler(function () {
          r._deferValidate(
            e.name,
            function () {
              n = [];
              for (var t = 0; t < o.checkedItems.length; t++)
                n.push(o.checkedItems[t].value);
              r._updateParameters(e, n);
            },
            function () {
              n.length > 0 && !e.nullable && r._validateNullValueOfParameter(a);
            }
          );
        });
      } else {
        t.selectedValue = c ? e.value : null;
        var p = !1;
        t.selectedIndexChanged.addHandler(function (t) {
          r._deferValidate(
            e.name,
            function () {
              p ||
                (r._updateParameters(e, t.selectedValue),
                t.selectedValue &&
                  t.itemsSource[0].name ===
                    wjcCore.culture.Viewer.selectParameterValue &&
                  setTimeout(function () {
                    p = !0;
                    var e = t.selectedValue,
                      o = t.selectedIndex;
                    t.itemsSource.shift(),
                      t.collectionView.refresh(),
                      (t.selectedValue = e),
                      (t.selectedIndex = o - 1),
                      (p = !1);
                  }));
            },
            function () {
              return r._validateNullValueOfParameter(a);
            }
          );
        });
      }
      return a;
    }),
    (t.prototype._updateParameters = function (e, t) {
      var o;
      this.itemsSource.some(function (t) {
        return t.name === e.name && ((o = t), !0);
      }),
        (this._parameters[e.name] =
          o.value =
          e.value =
            (function (e, t) {
              return t && !wjcCore.isArray(e) ? e.split(/[\r\n]+/) : e;
            })(t, e.multiValue));
    }),
    (t.prototype._generateBoolEditor = function (e) {
      var t,
        o,
        n = this,
        r = [];
      return (
        e.nullable
          ? ((o = document.createElement('div')),
            ((t = new wjcInput.ComboBox(o)).isEditable = !1),
            (t.displayMemberPath = 'name'),
            (t.selectedValuePath = 'value'),
            r.push({ name: 'None', value: null }),
            r.push({ name: 'True', value: !0 }),
            r.push({ name: 'False', value: !1 }),
            (t.itemsSource = r),
            (t.selectedValue = e.value),
            t.selectedIndexChanged.addHandler(function (t) {
              n._deferValidate(e.name, function () {
                return n._updateParameters(e, t.selectedValue);
              });
            }))
          : (((o = document.createElement('input')).type = 'checkbox'),
            (o.checked = e.value),
            _addEvent(o, 'click', function () {
              n._deferValidate(e.name, function () {
                return n._updateParameters(e, o.checked);
              });
            })),
        o
      );
    }),
    (t.prototype._generateStringEditor = function (e) {
      var t,
        o = this;
      return (
        e.multiValue
          ? (t = o._createTextarea(e.value, e.dataType))
          : (((t = document.createElement('input')).type = 'text'),
            e.value && (t.value = e.value)),
        o._bindTextChangedEvent(t, e),
        t
      );
    }),
    (t.prototype._createTextarea = function (e, o) {
      var n,
        r = document.createElement('textarea'),
        i = [];
      if (
        ((o !== _ParameterType.DateTime &&
          o !== _ParameterType.Time &&
          o !== _ParameterType.Date) ||
          (n = t._dateTimeFormat),
        e && e.length > 0)
      )
        if (n) {
          for (var a = 0; a < e.length; a++)
            i.push(wjcCore.Globalize.formatDate(new Date(e[a]), n));
          r.value = i.join('\n');
        } else r.value = e.join('\n');
      return (r.wrap = 'off'), r.setAttribute('data-type', o.toString()), r;
    }),
    (t.prototype._bindTextChangedEvent = function (e, t) {
      var o = this;
      _addEvent(e, 'change,keyup,paste,input', function () {
        o._deferValidate(
          t.name,
          function () {
            return o._updateParameters(t, e.value);
          },
          function () {
            e.value && !t.nullable && o._validateNullValueOfParameter(e);
          }
        );
      });
    }),
    (t.prototype._generateNumberEditor = function (e) {
      var t,
        o,
        n = this;
      return (
        e.multiValue
          ? ((t = this._createTextarea(e.value, e.dataType)),
            this._bindTextChangedEvent(t, e))
          : ((t = document.createElement('div')),
            ((o = new wjcInput.InputNumber(t)).format =
              e.dataType === _ParameterType.Integer ? 'n0' : 'n2'),
            (o.isRequired = !e.nullable),
            e.value &&
              (o.value =
                e.dataType === _ParameterType.Integer
                  ? parseInt(e.value)
                  : parseFloat(e.value)),
            o.valueChanged.addHandler(function (t) {
              n._deferValidate(e.name, function () {
                return n._updateParameters(e, t.value);
              });
            })),
        t
      );
    }),
    (t.prototype._generateDateTimeEditor = function (e) {
      var o,
        n,
        r = this;
      return (
        e.multiValue
          ? (((o = this._createTextarea(e.value, e.dataType)).title =
              t._dateTimeFormat),
            this._bindTextChangedEvent(o, e))
          : ((o = document.createElement('div')),
            e.dataType == _ParameterType.Date
              ? (n = new wjcInput.InputDate(o))
              : e.dataType == _ParameterType.DateTime
              ? ((n = new wjcInput.InputDateTime(o)).timeStep = 60)
              : ((n = new wjcInput.InputTime(o)).step = 60),
            (n.isRequired = !e.nullable),
            null != e.value ? (n.value = new Date(e.value)) : (n.value = null),
            n.valueChanged.addHandler(function () {
              r._deferValidate(e.name, function () {
                return r._updateParameters(e, n.value.toJSON());
              });
            })),
        o
      );
    }),
    (t.prototype._validateNullValueOfParameter = function (e) {
      var o = this._errors;
      if (o && o.length)
        for (var n = 0; n < o.length; n++)
          if (o[n].key === e.parentElement.getAttribute(t._paramIdAttr)) {
            var r = e.parentElement.querySelector('.error');
            if (r) {
              e.parentElement.removeChild(r), o.splice(n, 1);
              break;
            }
          }
    }),
    (t._paramIdAttr = 'param-id'),
    (t._errorsHiddenCss = 'wj-parametererrors-hidden'),
    (t._dateTimeFormat = 'MM/dd/yyyy HH:mm'),
    t
  );
})(wjcCore.Control);
exports._ParametersEditor = _ParametersEditor;
var _MultiSelectEx = (function () {
  function e(e) {
    (this._selectedAll = !1),
      (this._innerCheckedItemsChanged = !1),
      (this.checkedItemsChanged = new wjcCore.Event());
    var t = this,
      o = new wjcInput.MultiSelect(e);
    (t._multiSelect = o),
      o.checkedItemsChanged.addHandler(t.onCheckedItemsChanged, t),
      o.isDroppedDownChanged.addHandler(t.onIsDroppedDownChanged, t),
      (o.headerFormatter = function () {
        return t._updateHeader();
      });
  }
  return (
    (e.prototype._updateHeader = function () {
      var e = this,
        t = e.checkedItems || [],
        o = [],
        n = e.displayMemberPath;
      if (!t.length) return wjcCore.culture.Viewer.parameterNoneItemsSelected;
      if (e._selectedAll)
        return wjcCore.culture.Viewer.parameterAllItemsSelected;
      if (n) {
        for (var r = 0; r < t.length; r++) o[r] = t[r][n];
        return o.join(', ');
      }
      return t.join(', ');
    }),
    (e.prototype.onIsDroppedDownChanged = function () {
      this._multiSelect.isDroppedDown && this._updateSelectedAll();
    }),
    (e.prototype.onCheckedItemsChanged = function (e, t) {
      var o = this;
      o._innerCheckedItemsChanged ||
        (o._selectAllItem
          ? (o._updateSelectedAll(), o.checkedItemsChanged.raise(o, t))
          : o.checkedItemsChanged.raise(o, t));
    }),
    Object.defineProperty(e.prototype, 'isEditable', {
      get: function () {
        return this._multiSelect.isEditable;
      },
      set: function (e) {
        this._multiSelect.isEditable = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isDisabled', {
      get: function () {
        return this._multiSelect.isDisabled;
      },
      set: function (e) {
        this._multiSelect.isDisabled = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'displayMemberPath', {
      get: function () {
        return this._multiSelect.displayMemberPath;
      },
      set: function (e) {
        this._multiSelect.displayMemberPath = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'selectedValuePath', {
      get: function () {
        return this._multiSelect.selectedValuePath;
      },
      set: function (e) {
        this._multiSelect.selectedValuePath = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'itemsSource', {
      get: function () {
        return this._itemsSource;
      },
      set: function (e) {
        var t = this,
          o = t.displayMemberPath || 'name';
        t._itemsSource = e;
        var n = [];
        e &&
          (e.length > 1
            ? ((t._selectAllItem = {}),
              (t._selectAllItem[o] =
                wjcCore.culture.Viewer.parameterSelectAllItemText),
              n.push(t._selectAllItem))
            : (t._selectAllItem = null),
          (n = n.concat(e))),
          (t._multiSelect.itemsSource = n);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'checkedItems', {
      get: function () {
        var e = this,
          t = [];
        e._multiSelect.checkedItems &&
          (t = e._multiSelect.checkedItems.slice());
        var o = t.indexOf(e._selectAllItem);
        return o > -1 && t.splice(o, 1), t;
      },
      set: function (e) {
        var t = this;
        (t._multiSelect.checkedItems = e),
          (t._selectedAll = !1),
          t._updateSelectedAll();
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._updateSelectedAll = function () {
      var e = this;
      if (e._selectAllItem) {
        var t = e._multiSelect.checkedItems || [],
          o = t.indexOf(e._selectAllItem),
          n = o > -1;
        if (e._selectedAll !== n)
          return (
            (e._selectedAll = n),
            (e._innerCheckedItemsChanged = !0),
            e._selectedAll
              ? (e._multiSelect.checkedItems =
                  e._multiSelect.itemsSource.slice())
              : (e._multiSelect.checkedItems = []),
            void (e._innerCheckedItemsChanged = !1)
          );
        (e._selectedAll =
          t &&
          e._itemsSource &&
          t.length - (n ? 1 : 0) === e._itemsSource.length),
          e._selectedAll !== n &&
            ((e._innerCheckedItemsChanged = !0),
            e._selectedAll
              ? (e._multiSelect.checkedItems = t.concat(e._selectAllItem))
              : ((t = t.slice()).splice(o, 1),
                (e._multiSelect.checkedItems = t)),
            (e._innerCheckedItemsChanged = !1));
      }
    }),
    e
  );
})();
exports._MultiSelectEx = _MultiSelectEx;
var _ReportHamburgerMenu = (function (e) {
  function t(t, o, n) {
    return e.call(this, t, o, n) || this;
  }
  return (
    __extends(t, e),
    (t.prototype._initItems = function () {
      var t = e.prototype._initItems.call(this);
      return (
        t.splice(2, 0, {
          title: wjcCore.culture.Viewer.parameters,
          icon: parametersIcon,
          commandTag: ReportViewer._parameterCommandTag,
        }),
        t
      );
    }),
    t
  );
})(_HamburgerMenu);
exports._ReportHamburgerMenu = _ReportHamburgerMenu;
var PdfViewer = (function (e) {
  function t(t, o) {
    return e.call(this, t, o) || this;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, '_innerDocumentSource', {
      get: function () {
        return this._getDocumentSource();
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._getSource = function () {
      return this.filePath
        ? new _PdfDocumentSource({
            serviceUrl: this.serviceUrl,
            filePath: this.filePath,
          })
        : null;
    }),
    t
  );
})(ViewerBase);
exports.PdfViewer = PdfViewer;
