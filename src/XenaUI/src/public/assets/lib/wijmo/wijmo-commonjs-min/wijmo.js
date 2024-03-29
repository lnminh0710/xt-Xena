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
function getVersion() {
  return _VERSION;
}
function tryCast(t, e) {
  return null == t
    ? null
    : isString(e)
    ? isFunction(t.implementsInterface) && t.implementsInterface(e)
      ? t
      : null
    : t instanceof e
    ? t
    : null;
}
function isPrimitive(t) {
  return isString(t) || isNumber(t) || isBoolean(t) || isDate(t);
}
function isString(t) {
  return 'string' == typeof t;
}
function isNullOrWhiteSpace(t) {
  return null == t || t.replace(/\s/g, '').length < 1;
}
function isNumber(t) {
  return 'number' == typeof t;
}
function isInt(t) {
  return isNumber(t) && t == Math.round(t);
}
function isBoolean(t) {
  return 'boolean' == typeof t;
}
function isFunction(t) {
  return 'function' == typeof t;
}
function isUndefined(t) {
  return void 0 === t;
}
function isDate(t) {
  return t instanceof Date && !isNaN(t.getTime());
}
function isArray(t) {
  return (
    t instanceof Array ||
    Array.isArray(t) ||
    '[object Array]' === Object.prototype.toString.call(t)
  );
}
function isObject(t) {
  return null != t && 'object' == typeof t && !isDate(t) && !isArray(t);
}
function isEmpty(t) {
  for (var e in t) return !1;
  return !0;
}
function getUniqueId(t) {
  for (var e = t, n = 0; null != document.getElementById(e); n++) e = t + n;
  return e;
}
function mouseToPage(t) {
  if (t instanceof Point) return t;
  if (
    (t.touches && t.touches.length > 0 && (t = t.touches[0]),
    isNumber(t.clientX) && isNumber(t.clientY))
  )
    return new Point(t.clientX + pageXOffset, t.clientY + pageYOffset);
  throw 'Mouse or touch event expected.';
}
function getType(t) {
  return isNumber(t)
    ? DataType.Number
    : isBoolean(t)
    ? DataType.Boolean
    : isDate(t)
    ? DataType.Date
    : isString(t)
    ? DataType.String
    : isArray(t)
    ? DataType.Array
    : DataType.Object;
}
function changeType(t, e, n) {
  if (null != t) {
    if (isString(t))
      switch (e) {
        case DataType.Number:
          var r = Globalize.parseFloat(t, n);
          return isNaN(r) ? t : r;
        case DataType.Date:
          var i = Globalize.parseDate(t, n);
          return (
            i || n || !t || (i = new Date(t)),
            i && isFinite(i.getTime()) ? i : t
          );
        case DataType.Boolean:
          switch (t.toLowerCase()) {
            case 'true':
              return !0;
            case 'false':
              return !1;
          }
          return t;
      }
    if (e == DataType.String) return Globalize.format(t, n);
  }
  return t;
}
function toFixed(t, e, n) {
  if (n) {
    var r = (i = t.toString()).indexOf('.');
    i.indexOf('e') < 0 &&
      r > -1 &&
      ((i = i.substr(0, r + 1 + e)), (t = parseFloat(i)));
  } else {
    var i = t.toFixed(e);
    t = parseFloat(i);
  }
  return t;
}
function format(t, e, n) {
  if ((t = asString(t)).match(/\{.*"count".*:.*"when".*:.*\}/))
    try {
      var r = JSON.parse(t);
      if (isString(r.count)) {
        var i = e[r.count],
          o = r.when;
        if (isNumber(i) && isObject(o)) {
          var s = o[i] || o.other;
          isString(s) && (t = s);
        }
      }
    } catch (t) {}
  return t.replace(/\{(.*?)(:(.*?))?\}/g, function (t, r, i, o) {
    var s = t;
    return (
      r &&
        '{' != r[0] &&
        e &&
        ((s = e[r]),
        o && (s = Globalize.format(s, o)),
        n && (s = n(e, r, o, s))),
      null == s ? '' : s
    );
  });
}
function clamp(t, e, n) {
  return (
    null != t && (null != n && t > n && (t = n), null != e && t < e && (t = e)),
    t
  );
}
function copy(t, e) {
  if (e)
    for (var n in e)
      if ('_' != n[0]) {
        assert(n in t, 'Unknown property "' + n + '".');
        var r = e[n];
        (t._copy && t._copy(n, r)) ||
          (t[n] instanceof Event && isFunction(r)
            ? t[n].addHandler(r)
            : !isObject(r) ||
              r instanceof Element ||
              !t[n] ||
              'itemsSource' == n
            ? (t[n] = r)
            : copy(t[n], r));
      }
}
function assert(t, e) {
  if (!t) throw '** Assertion failed in Wijmo: ' + e;
}
function _deprecated(t, e) {
  console.error(
    '** WARNING: "' +
      t +
      '" has been deprecated; please use "' +
      e +
      '" instead.'
  );
}
function asString(t, e) {
  return (
    void 0 === e && (e = !0),
    assert((e && null == t) || isString(t), 'String expected.'),
    t
  );
}
function asNumber(t, e, n) {
  if (
    (void 0 === e && (e = !1),
    void 0 === n && (n = !1),
    assert((e && null == t) || isNumber(t), 'Number expected.'),
    n && t && t < 0)
  )
    throw 'Positive number expected.';
  return t;
}
function asInt(t, e, n) {
  if (
    (void 0 === e && (e = !1),
    void 0 === n && (n = !1),
    assert((e && null == t) || isInt(t), 'Integer expected.'),
    n && t && t < 0)
  )
    throw 'Positive integer expected.';
  return t;
}
function asBoolean(t, e) {
  return (
    void 0 === e && (e = !1),
    assert((e && null == t) || isBoolean(t), 'Boolean expected.'),
    t
  );
}
function asDate(t, e) {
  if ((void 0 === e && (e = !1), isString(t))) {
    var n = changeType(t, DataType.Date, 'r');
    isDate(n) && (t = n);
  }
  return assert((e && null == t) || isDate(t), 'Date expected.'), t;
}
function asFunction(t, e) {
  return (
    void 0 === e && (e = !0),
    assert((e && null == t) || isFunction(t), 'Function expected.'),
    t
  );
}
function asArray(t, e) {
  return (
    void 0 === e && (e = !0),
    assert((e && null == t) || isArray(t), 'Array expected.'),
    t
  );
}
function asType(t, e, n) {
  return (
    void 0 === n && (n = !1),
    (t = tryCast(t, e)),
    assert(n || null != t, e + ' expected.'),
    t
  );
}
function asEnum(t, e, n) {
  if ((void 0 === n && (n = !1), null == t && n)) return null;
  var r = e[t];
  return assert(null != r, 'Invalid enum value.'), isNumber(r) ? r : t;
}
function asCollectionView(t, e) {
  if ((void 0 === e && (e = !0), null == t && e)) return null;
  var n = tryCast(t, 'ICollectionView');
  return null != n
    ? n
    : (isArray(t) || assert(!1, 'Array or ICollectionView expected.'),
      new CollectionView(t));
}
function hasItems(t) {
  return null != t && null != t.items && t.items.length > 0;
}
function toHeaderCase(t) {
  return t && t.length
    ? t[0].toUpperCase() + t.substr(1).replace(/([a-z])([A-Z])/g, '$1 $2')
    : '';
}
function escapeHtml(t) {
  return (
    isString(t) &&
      (t = t.replace(/[&<>"'\/]/g, function (t) {
        return _ENTITYMAP[t];
      })),
    t
  );
}
function hasClass(t, e) {
  if (t && t.getAttribute) {
    var n = new RegExp('(\\s|^)' + e + '(\\s|$)');
    return t && n.test(t.getAttribute('class'));
  }
  return !1;
}
function removeClass(t, e) {
  if (t && e && t.setAttribute)
    for (var n = e.split(' '), r = 0; r < n.length; r++) {
      var i = n[r];
      if (hasClass(t, i)) {
        var o = new RegExp('((\\s|^)' + i + '(\\s|$))', 'g'),
          s = t.getAttribute('class');
        (s = s.replace(o, ' ').replace(/ +/g, ' ').trim())
          ? t.setAttribute('class', s)
          : t.removeAttribute('class');
      }
    }
}
function addClass(t, e) {
  if (t && e && t.setAttribute)
    for (var n = e.split(' '), r = 0; r < n.length; r++) {
      var i = n[r];
      if (!hasClass(t, i)) {
        var o = t.getAttribute('class');
        t.setAttribute('class', o ? o + ' ' + i : i);
      }
    }
}
function toggleClass(t, e, n) {
  null == n && (n = !hasClass(t, e)), n ? addClass(t, e) : removeClass(t, e);
}
function setAttribute(t, e, n, r) {
  null != n
    ? (r && t.getAttribute(e)) || t.setAttribute(e, n.toString())
    : t.removeAttribute(e);
}
function setSelectionRange(t, e, n) {
  if (
    (void 0 === n && (n = e),
    (t = asType(t, HTMLInputElement)),
    contains(document.body, t) && !t.disabled && 'none' != t.style.display)
  )
    try {
      t.setSelectionRange(asNumber(e), asNumber(n), isIE() ? null : 'backward'),
        t.focus();
    } catch (t) {}
}
function removeChild(t) {
  return t && t.parentNode ? t.parentNode.removeChild(t) : null;
}
function getActiveElement() {
  var t = document.activeElement;
  if (t) {
    var e = t.shadowRoot;
    e && e.activeElement && (t = e.activeElement);
  }
  return t;
}
function moveFocus(t, e) {
  var n = _getFocusableElements(t),
    r = 0;
  if (e) {
    var i = n.indexOf(getActiveElement());
    i > -1 && (r = (i + e + n.length) % n.length);
  }
  if (r < n.length) {
    var o = n[r];
    o.focus(), o instanceof HTMLInputElement && o.select();
  }
}
function _getFocusableElements(t) {
  for (
    var e = [],
      n = t.querySelectorAll('input,select,textarea,button,a,div'),
      r = 0;
    r < n.length;
    r++
  ) {
    var i = n[r];
    if (
      i.offsetHeight > 0 &&
      i.tabIndex > -1 &&
      !i.disabled &&
      !closest(i, '[disabled],.wj-state-disabled')
    ) {
      if (isIE() && !i.hasAttribute('tabindex')) {
        if (i instanceof HTMLDivElement) continue;
        var o = Control.getControl(closest(i, '.wj-flexgrid'));
        if (o && 0 == o.keyActionTab) continue;
      }
      (!Control.getControl(i) && _getFocusableElements(i).length) || e.push(i);
    }
  }
  return e;
}
function getElement(t) {
  return t instanceof Element
    ? t
    : isString(t)
    ? document.querySelector(t)
    : t && t.jquery
    ? t[0]
    : null;
}
function createElement(t, e) {
  var n = document.createElement('div');
  return (
    (n.innerHTML = t),
    1 == n.children.length && (n = n.children[0]),
    e && e.appendChild(n),
    n
  );
}
function setText(t, e) {
  t.textContent = e || '';
}
function contains(t, e) {
  for (var n = e; n && t; ) {
    if (n === t) return !0;
    n = n.parentNode || n.host;
  }
  return !1;
}
function closest(t, e) {
  var n = t
    ? t.matches ||
      t.webkitMatchesSelector ||
      t.mozMatchesSelector ||
      t.msMatchesSelector
    : null;
  if (n)
    for (; t; t = t.parentNode)
      if (t instanceof Element && n.call(t, e)) return t;
  return null;
}
function closestClass(t, e) {
  return closest(t, '.' + e);
}
function enable(t, e) {
  var n = !e;
  toggleClass(t, 'wj-state-disabled', n),
    setAttribute(t, 'disabled', n ? 'true' : null);
  for (var r = t.querySelectorAll('input'), i = 0; i < r.length; i++) {
    var o = r[i];
    e ? o.removeAttribute('disabled') : o.setAttribute('disabled', 'true');
  }
}
function getElementRect(t) {
  var e = t.getBoundingClientRect();
  return new Rect(e.left + pageXOffset, e.top + pageYOffset, e.width, e.height);
}
function setCss(t, e) {
  if (t instanceof Array) for (var n = 0; n < t.length; n++) setCss(t[n], e);
  else if (t && t.style) {
    var r = t.style;
    for (var i in e) {
      var o = e[i];
      'number' == typeof o &&
        i.match(/width|height|left|top|right|bottom|size|padding|margin'/i) &&
        (o += 'px'),
        r[i] != o && (r[i] = o.toString());
    }
  }
}
function animate(t, e, n) {
  void 0 === e && (e = Control._ANIM_DEF_DURATION),
    void 0 === n && (n = Control._ANIM_DEF_STEP),
    (t = asFunction(t)),
    (e = asNumber(e, !1, !0)),
    (n = asNumber(n, !1, !0));
  var r = Date.now(),
    i = setInterval(function () {
      var n = Math.min(1, (Date.now() - r) / e);
      (n = Math.sin((n * Math.PI) / 2)),
        (n *= n),
        requestAnimationFrame(function () {
          t(n);
        }),
        n >= 1 && clearInterval(i);
    }, n);
  return i;
}
function httpRequest(t, e) {
  e || (e = {});
  var n = e.method ? asString(e.method).toUpperCase() : 'GET',
    r = null == e.async || asBoolean(e.async),
    i = e.data;
  if (null != i && 'GET' == n) {
    var o = [];
    for (var s in i) {
      var a = i[s];
      isDate(a) && (a = a.toJSON()), o.push(s + '=' + a);
    }
    o.length && (t += (t.indexOf('?') < 0 ? '?' : '&') + o.join('&')),
      (i = null);
  }
  var u = new XMLHttpRequest();
  u.URL_DEBUG = t;
  var l = !1;
  if (
    (null == i || isString(i) || ((l = isObject(i)), (i = JSON.stringify(i))),
    (u.onload = function () {
      4 == u.readyState &&
        (u.status < 300
          ? e.success && asFunction(e.success)(u)
          : e.error && asFunction(e.error)(u),
        e.complete && asFunction(e.complete)(u));
    }),
    (u.onerror = function () {
      if (!isFunction(e.error))
        throw 'HttpRequest Error: ' + u.status + ' ' + u.statusText;
      e.error(u);
    }),
    u.open(n, t, r, e.user, e.password),
    e.user &&
      e.password &&
      u.setRequestHeader(
        'Authorization',
        'Basic ' + btoa(e.user + ':' + e.password)
      ),
    l && u.setRequestHeader('Content-Type', 'application/json'),
    e.requestHeaders)
  )
    for (var c in e.requestHeaders) u.setRequestHeader(c, e.requestHeaders[c]);
  return (
    isNumber(e.timeout) && (u.timeout = e.timeout),
    isFunction(e.beforeSend) && e.beforeSend(u),
    u.send(i),
    u
  );
}
function _updateCulture() {
  exports.culture = window.wijmo.culture;
}
function getAggregate(t, e, n) {
  var r = 0,
    i = 0,
    o = 0,
    s = 0,
    a = null,
    u = null,
    l = null,
    c = n ? new Binding(n) : null;
  if ((t = asEnum(t, Aggregate)) == Aggregate.CntAll) return e.length;
  for (var h = 0; h < e.length; h++) {
    var p = e[h];
    if ((c && (p = c.getValue(p)), t == Aggregate.First)) return p;
    null != p &&
      (r++,
      (null == a || p < a) && (a = p),
      (null == u || p > u) && (u = p),
      (l = p),
      isNumber(p) && !isNaN(p)
        ? (i++, (o += p), (s += p * p))
        : isBoolean(p) && (i++, 1 == p && (o++, s++)));
  }
  var f = 0 == i ? 0 : o / i;
  switch (t) {
    case Aggregate.Avg:
      return f;
    case Aggregate.Cnt:
      return r;
    case Aggregate.Max:
      return u;
    case Aggregate.Min:
      return a;
    case Aggregate.Rng:
      return u - a;
    case Aggregate.Sum:
      return o;
    case Aggregate.VarPop:
      return i <= 1 ? 0 : s / i - f * f;
    case Aggregate.StdPop:
      return i <= 1 ? 0 : Math.sqrt(s / i - f * f);
    case Aggregate.Var:
      return i <= 1 ? 0 : ((s / i - f * f) * i) / (i - 1);
    case Aggregate.Std:
      return i <= 1 ? 0 : Math.sqrt(((s / i - f * f) * i) / (i - 1));
    case Aggregate.Last:
      return l;
  }
  throw 'Invalid aggregate type.';
}
function showPopup(t, e, n, r, i) {
  void 0 === e && (e = null),
    void 0 === n && (n = !1),
    void 0 === r && (r = !1),
    void 0 === i && (i = !0);
  var o = document.body;
  if (e instanceof HTMLElement) {
    if (!contains(document.body, e)) return;
    for (var s = e; s; s = s.parentElement)
      if (
        'dialog' == s.getAttribute('role') ||
        'fixed' == getComputedStyle(s).position
      ) {
        o = s;
        break;
      }
  }
  (t.offsetHeight && t.offsetWidth && contains(o, t)) ||
    (o.lastChild != t && o.appendChild(t));
  var a = new Point(pageXOffset, pageYOffset),
    u = document.documentElement,
    l = u.clientWidth / window.innerWidth;
  if (o != document.body || l > 1.005) {
    var c = o == document.body ? document.documentElement : t.offsetParent,
      h = c.getBoundingClientRect();
    a = new Point(c.scrollLeft - h.left, c.scrollTop - h.top);
  }
  if (e instanceof HTMLElement && i) {
    var p = getComputedStyle(e);
    new Color(p.backgroundColor).a &&
      setCss(t, {
        color: p.color,
        backgroundColor: p.backgroundColor,
        fontFamily: p.fontFamily,
        fontSize: p.fontSize,
        fontWeight: p.fontWeight,
        fontStyle: p.fontStyle,
      });
  }
  setCss(t, { position: 'absolute', display: '' }), Control.refreshAll(t);
  var f = getComputedStyle(t),
    d = parseFloat(f.marginTop) + parseFloat(f.marginBottom),
    g = parseFloat(f.marginLeft) + parseFloat(f.marginRight),
    _ = new Size(t.offsetWidth + g, t.offsetHeight + d),
    m = new Point(),
    v = null,
    y = u.clientWidth,
    b = u.clientHeight;
  if (
    e &&
    null != e.clientX &&
    null != e.clientY &&
    null != e.pageX &&
    null != e.pageY
  )
    e.clientX <= 0 && e.clientY <= 0 && e.target
      ? (v = e.target.getBoundingClientRect())
      : ((m.x = Math.max(0, e.pageX - pageXOffset)),
        (m.y = Math.max(0, e.pageY - pageYOffset)));
  else if (e instanceof Point) m = e;
  else if (e instanceof HTMLElement) v = e.getBoundingClientRect();
  else if (e && null != e.top && null != e.left) v = e;
  else {
    if (null != e) throw 'Invalid ref parameter.';
    (m.x = Math.max(0, (y - _.width) / 2)),
      (m.y = Math.max(0, Math.round(((b - _.height) / 2) * 0.7)));
  }
  var C = parseFloat(f.minWidth);
  if (v) {
    var w = v.top,
      E = b - v.bottom,
      x = 'rtl' == getComputedStyle(t).direction;
    (m.x = x
      ? Math.max(0, v.right - _.width)
      : Math.max(0, Math.min(v.left, y - _.width))),
      (m.y = n
        ? w > _.height || w > E
          ? Math.max(0, v.top - _.height)
          : v.bottom
        : E > _.height || E > w
        ? v.bottom
        : Math.max(0, v.top - _.height)),
      (C = Math.max(C, v.width)),
      isIE() &&
        (C -=
          t.offsetWidth -
          (t.clientWidth +
            parseInt(f.borderLeftWidth) +
            parseInt(f.borderRightWidth)));
  } else {
    m.y + _.height > b - 20 && (m.y = Math.max(0, b - 20 - _.height)),
      m.x + _.width > y - 20 && (m.x = Math.max(0, y - 20 - _.width));
  }
  var A = { left: m.x + a.x, top: m.y + a.y, minWidth: C, zIndex: 1500 },
    T = null;
  r &&
    ((t.style.opacity = '0'),
    (T = animate(function (e) {
      t.style.opacity = 1 == e ? '' : e.toString();
    }))),
    e instanceof HTMLElement && (t[Control._OWNR_KEY] = e),
    setCss(t, A);
  var P = e instanceof MouseEvent ? e.target : e;
  if (P instanceof HTMLElement && P.parentElement != document.body) {
    var S = Date.now(),
      F = P.getBoundingClientRect(),
      M = new Control(document.createElement('div'));
    (t[Control._SCRL_KEY] = M),
      M.addEventListener(
        document,
        'scroll',
        function (n) {
          if (
            Date.now() - S > 100 &&
            contains(document, P) &&
            !contains(t, n.target) &&
            (n.target != document || (null != e && 'fixed' == t.style.position))
          ) {
            var r = P.getBoundingClientRect(),
              i = Math.abs(r.left - F.left),
              o = Math.abs(r.top - F.top);
            (i > 1 || o > 1) && _hidePopup(t, !0);
          }
        },
        !0
      );
  }
  return T;
}
function hidePopup(t, e, n) {
  void 0 === e && (e = !0), void 0 === n && (n = !1);
  var r = null;
  return (
    n
      ? (r = animate(function (n) {
          (t.style.opacity = (1 - n).toString()),
            1 == n && (_hidePopup(t, e), (t.style.opacity = ''));
        }))
      : _hidePopup(t, e),
    r
  );
}
function _hidePopup(t, e) {
  (t.style.display = 'none'),
    e &&
      t.parentElement &&
      setTimeout(function () {
        'none' == t.style.display && (removeChild(t), isFunction(e) && e());
      }, 2 * Control._FOCUS_INTERVAL);
  var n = t[Control._SCRL_KEY];
  n instanceof Control && n.dispose(),
    delete t[Control._SCRL_KEY],
    delete t[Control._OWNR_KEY];
}
function isMobile() {
  return _isMobile;
}
function isFirefox() {
  return _isFF;
}
function isSafari() {
  return _isSafari;
}
function isIE() {
  return _isIE;
}
function isIE9() {
  return _isIE9;
}
function getEventOptions(t, e) {
  return _supportsPassive ? { capture: t, passive: e } : t;
}
function _startDrag(t, e) {
  (t.effectAllowed = e), isFirefox() && t.setData('text', '');
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
        for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
      };
    return function (e, n) {
      function r() {
        this.constructor = e;
      }
      t(e, n),
        (e.prototype =
          null === n
            ? Object.create(n)
            : ((r.prototype = n.prototype), new r()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcSelf = require('wijmo/wijmo'),
  _globalCulture = window.wijmo && window.wijmo.culture;
(window.wijmo = wjcSelf), (exports.culture = _globalCulture);
var _VERSION = '5.20173.405';
exports.getVersion = getVersion;
var Key;
!(function (t) {
  (t[(t.Back = 8)] = 'Back'),
    (t[(t.Tab = 9)] = 'Tab'),
    (t[(t.Enter = 13)] = 'Enter'),
    (t[(t.Escape = 27)] = 'Escape'),
    (t[(t.Space = 32)] = 'Space'),
    (t[(t.PageUp = 33)] = 'PageUp'),
    (t[(t.PageDown = 34)] = 'PageDown'),
    (t[(t.End = 35)] = 'End'),
    (t[(t.Home = 36)] = 'Home'),
    (t[(t.Left = 37)] = 'Left'),
    (t[(t.Up = 38)] = 'Up'),
    (t[(t.Right = 39)] = 'Right'),
    (t[(t.Down = 40)] = 'Down'),
    (t[(t.Delete = 46)] = 'Delete'),
    (t[(t.F1 = 112)] = 'F1'),
    (t[(t.F2 = 113)] = 'F2'),
    (t[(t.F3 = 114)] = 'F3'),
    (t[(t.F4 = 115)] = 'F4'),
    (t[(t.F5 = 116)] = 'F5'),
    (t[(t.F6 = 117)] = 'F6'),
    (t[(t.F7 = 118)] = 'F7'),
    (t[(t.F8 = 119)] = 'F8'),
    (t[(t.F9 = 120)] = 'F9'),
    (t[(t.F10 = 121)] = 'F10'),
    (t[(t.F11 = 122)] = 'F11'),
    (t[(t.F12 = 123)] = 'F12');
})((Key = exports.Key || (exports.Key = {})));
var DataType;
!(function (t) {
  (t[(t.Object = 0)] = 'Object'),
    (t[(t.String = 1)] = 'String'),
    (t[(t.Number = 2)] = 'Number'),
    (t[(t.Boolean = 3)] = 'Boolean'),
    (t[(t.Date = 4)] = 'Date'),
    (t[(t.Array = 5)] = 'Array');
})((DataType = exports.DataType || (exports.DataType = {}))),
  (exports.tryCast = tryCast),
  (exports.isPrimitive = isPrimitive),
  (exports.isString = isString),
  (exports.isNullOrWhiteSpace = isNullOrWhiteSpace),
  (exports.isNumber = isNumber),
  (exports.isInt = isInt),
  (exports.isBoolean = isBoolean),
  (exports.isFunction = isFunction),
  (exports.isUndefined = isUndefined),
  (exports.isDate = isDate),
  (exports.isArray = isArray),
  (exports.isObject = isObject),
  (exports.isEmpty = isEmpty),
  (exports.getUniqueId = getUniqueId),
  (exports.mouseToPage = mouseToPage),
  (exports.getType = getType),
  (exports.changeType = changeType),
  (exports.toFixed = toFixed),
  (exports.format = format),
  (exports.clamp = clamp),
  (exports.copy = copy),
  (exports.assert = assert),
  (exports._deprecated = _deprecated),
  (exports.asString = asString),
  (exports.asNumber = asNumber),
  (exports.asInt = asInt),
  (exports.asBoolean = asBoolean),
  (exports.asDate = asDate),
  (exports.asFunction = asFunction),
  (exports.asArray = asArray),
  (exports.asType = asType),
  (exports.asEnum = asEnum),
  (exports.asCollectionView = asCollectionView),
  (exports.hasItems = hasItems),
  (exports.toHeaderCase = toHeaderCase),
  (exports.escapeHtml = escapeHtml);
var _ENTITYMAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};
(exports.hasClass = hasClass),
  (exports.removeClass = removeClass),
  (exports.addClass = addClass),
  (exports.toggleClass = toggleClass),
  (exports.setAttribute = setAttribute),
  (exports.setSelectionRange = setSelectionRange),
  (exports.removeChild = removeChild),
  (exports.getActiveElement = getActiveElement),
  (exports.moveFocus = moveFocus),
  (exports.getElement = getElement),
  (exports.createElement = createElement),
  (exports.setText = setText),
  (exports.contains = contains),
  (exports.closest = closest),
  (exports.closestClass = closestClass),
  (exports.enable = enable),
  (exports.getElementRect = getElementRect),
  (exports.setCss = setCss),
  (exports.animate = animate);
var Point = (function () {
  function t(t, e) {
    void 0 === t && (t = 0),
      void 0 === e && (e = 0),
      (this.x = asNumber(t)),
      (this.y = asNumber(e));
  }
  return (
    (t.prototype.equals = function (e) {
      return e instanceof t && this.x == e.x && this.y == e.y;
    }),
    (t.prototype.clone = function () {
      return new t(this.x, this.y);
    }),
    t
  );
})();
exports.Point = Point;
var Size = (function () {
  function t(t, e) {
    void 0 === t && (t = 0),
      void 0 === e && (e = 0),
      (this.width = asNumber(t)),
      (this.height = asNumber(e));
  }
  return (
    (t.prototype.equals = function (e) {
      return e instanceof t && this.width == e.width && this.height == e.height;
    }),
    (t.prototype.clone = function () {
      return new t(this.width, this.height);
    }),
    t
  );
})();
exports.Size = Size;
var Rect = (function () {
  function t(t, e, n, r) {
    (this.left = asNumber(t)),
      (this.top = asNumber(e)),
      (this.width = asNumber(n)),
      (this.height = asNumber(r));
  }
  return (
    Object.defineProperty(t.prototype, 'right', {
      get: function () {
        return this.left + this.width;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'bottom', {
      get: function () {
        return this.top + this.height;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.equals = function (e) {
      return (
        e instanceof t &&
        this.left == e.left &&
        this.top == e.top &&
        this.width == e.width &&
        this.height == e.height
      );
    }),
    (t.prototype.clone = function () {
      return new t(this.left, this.top, this.width, this.height);
    }),
    (t.fromBoundingRect = function (e) {
      return null != e.left
        ? new t(e.left, e.top, e.width, e.height)
        : null != e.x
        ? new t(e.x, e.y, e.width, e.height)
        : void assert(!1, 'Invalid source rectangle.');
    }),
    (t.union = function (e, n) {
      var r = Math.min(e.left, n.left),
        i = Math.min(e.top, n.top);
      return new t(
        r,
        i,
        Math.max(e.right, n.right) - r,
        Math.max(e.bottom, n.bottom) - i
      );
    }),
    (t.intersection = function (e, n) {
      var r = Math.max(e.left, n.left),
        i = Math.max(e.top, n.top);
      return new t(
        r,
        i,
        Math.min(e.right, n.right) - r,
        Math.min(e.bottom, n.bottom) - i
      );
    }),
    (t.prototype.contains = function (e) {
      if (e instanceof Point)
        return (
          e.x >= this.left &&
          e.x <= this.right &&
          e.y >= this.top &&
          e.y <= this.bottom
        );
      if (e instanceof t) {
        var n = e;
        return (
          n.left >= this.left &&
          n.right <= this.right &&
          n.top >= this.top &&
          n.bottom <= this.bottom
        );
      }
      assert(!1, 'Point or Rect expected.');
    }),
    (t.prototype.inflate = function (e, n) {
      return new t(
        this.left - e,
        this.top - n,
        this.width + 2 * e,
        this.height + 2 * n
      );
    }),
    t
  );
})();
exports.Rect = Rect;
var DateTime = (function () {
  function t() {}
  return (
    (t.addDays = function (e, n) {
      return t.newDate(e.getFullYear(), e.getMonth(), e.getDate() + n);
    }),
    (t.addMonths = function (e, n) {
      return t.newDate(e.getFullYear(), e.getMonth() + n, e.getDate());
    }),
    (t.addYears = function (e, n) {
      return t.newDate(e.getFullYear() + n, e.getMonth(), e.getDate());
    }),
    (t.addHours = function (e, n) {
      return t.newDate(
        e.getFullYear(),
        e.getMonth(),
        e.getDate(),
        e.getHours() + n
      );
    }),
    (t.addMinutes = function (e, n) {
      return t.newDate(
        e.getFullYear(),
        e.getMonth(),
        e.getDate(),
        e.getHours(),
        e.getMinutes() + n
      );
    }),
    (t.addSeconds = function (e, n) {
      return t.newDate(
        e.getFullYear(),
        e.getMonth(),
        e.getDate(),
        e.getHours(),
        e.getMinutes(),
        e.getSeconds() + n
      );
    }),
    (t.sameDate = function (t, e) {
      return (
        isDate(t) &&
        isDate(e) &&
        t.getFullYear() == e.getFullYear() &&
        t.getMonth() == e.getMonth() &&
        t.getDate() == e.getDate()
      );
    }),
    (t.sameTime = function (t, e) {
      return (
        isDate(t) &&
        isDate(e) &&
        t.getHours() == e.getHours() &&
        t.getMinutes() == e.getMinutes() &&
        t.getSeconds() == e.getSeconds()
      );
    }),
    (t.equals = function (t, e) {
      return isDate(t) && isDate(e) && t.getTime() == e.getTime();
    }),
    (t.fromDateTime = function (e, n) {
      return e || n
        ? (e || (e = n),
          n || (n = e),
          t.newDate(
            e.getFullYear(),
            e.getMonth(),
            e.getDate(),
            n.getHours(),
            n.getMinutes(),
            n.getSeconds(),
            n.getMilliseconds()
          ))
        : null;
    }),
    (t.toFiscal = function (e, n) {
      var r = exports.culture.Globalize.calendar;
      return isArray(r.fiscalYearOffsets)
        ? t.addMonths(e, -r.fiscalYearOffsets[n ? 0 : 1])
        : e;
    }),
    (t.fromFiscal = function (e, n) {
      var r = exports.culture.Globalize.calendar;
      return isArray(r.fiscalYearOffsets)
        ? t.addMonths(e, +r.fiscalYearOffsets[n ? 0 : 1])
        : e;
    }),
    (t.newDate = function (t, e, n, r, i, o, s) {
      if (null == t || null == e || null == n) {
        var a = new Date();
        null == t && (t = a.getFullYear()),
          null == e && (e = a.getMonth()),
          null == n && (n = a.getDate());
      }
      null == r && (r = 0),
        null == i && (i = 0),
        null == o && (o = 0),
        null == s && (s = 0);
      var u = new Date(t, e, n, r, i, o, s),
        l = u.getFullYear();
      return t < 100 && l >= 1900 && u.setFullYear(u.getFullYear() - 1900), u;
    }),
    (t.clone = function (e) {
      return t.fromDateTime(e, e);
    }),
    t
  );
})();
(exports.DateTime = DateTime),
  (exports.httpRequest = httpRequest),
  (exports.culture = window.wijmo.culture || {
    Globalize: {
      numberFormat: {
        '.': '.',
        ',': ',',
        percent: { pattern: ['-n %', 'n %'] },
        currency: { decimals: 2, symbol: '$', pattern: ['($n)', '$n'] },
      },
      calendar: {
        '/': '/',
        ':': ':',
        firstDay: 0,
        days: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        daysAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: [
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
        ],
        monthsAbbr: [
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
        ],
        am: ['AM', 'A'],
        pm: ['PM', 'P'],
        eras: ['A.D.', 'B.C.'],
        patterns: {
          d: 'M/d/yyyy',
          D: 'dddd, MMMM dd, yyyy',
          f: 'dddd, MMMM dd, yyyy h:mm tt',
          F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
          t: 'h:mm tt',
          T: 'h:mm:ss tt',
          M: 'MMMM d',
          m: 'MMMM d',
          Y: 'MMMM, yyyy',
          y: 'MMMM, yyyy',
          g: 'M/d/yyyy h:mm tt',
          G: 'M/d/yyyy h:mm:ss tt',
          s: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss',
          o: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss"."fffffffK',
          O: 'yyyy"-"MM"-"dd"T"HH":"mm":"ss"."fffffffK',
          U: 'dddd, MMMM dd, yyyy h:mm:ss tt',
        },
        fiscalYearOffsets: [-3, -3],
      },
    },
  });
var Globalize = (function () {
  function t() {}
  return (
    (t.format = function (e, n, r, i) {
      return isString(e)
        ? e
        : isNumber(e)
        ? ((n = n || (e == Math.round(e) ? 'n0' : 'n2')),
          t.formatNumber(e, n, r, i))
        : isDate(e)
        ? ((n = n || 'd'), t.formatDate(e, n))
        : null != e
        ? e.toString()
        : '';
    }),
    (t.formatNumber = function (e, n, r, i) {
      (e = asNumber(e)), (n = asString(n));
      var o,
        s = exports.culture.Globalize.numberFormat,
        a = n ? n.match(/([a-z])(\d*)(,*)(.*)/i) : null,
        u = a ? a[1].toLowerCase() : 'n',
        l =
          a && a[2]
            ? parseInt(a[2])
            : 'c' == u
            ? s.currency.decimals
            : e == Math.round(e)
            ? 0
            : 2,
        c = a && a[3] ? 3 * a[3].length : 0,
        h = a && a[4] ? a[4] : s.currency.symbol,
        p = s['.'],
        f = s[','];
      if ((c && (e /= Math.pow(10, c)), 'd' == u || 'x' == u)) {
        for (
          o = Math.round(Math.abs(e)).toString('d' == u ? 10 : 16);
          o.length < l;

        )
          o = '0' + o;
        return (
          e < 0 && (o = '-' + o), n && 'X' == n[0] && (o = o.toUpperCase()), o
        );
      }
      if (
        ('p' == u && (e = toFixed((e = t._mul100(e)), l, i)),
        i && 'p' != u && (e = toFixed(e, l, !0)),
        (o = t._toFixedStr('c' == u || 'p' == u ? Math.abs(e) : e, l)),
        (r || 'g' == u) &&
          o.indexOf('.') > -1 &&
          (o = (o = o.replace(/(\.[0-9]*?)0+$/g, '$1')).replace(/\.$/, '')),
        '.' != p && (o = o.replace('.', p)),
        f && ('n' == u || 'c' == u || 'p' == u))
      ) {
        var d = o.indexOf(p),
          g = /\B(?=(\d\d\d)+(?!\d))/g;
        o =
          d > -1 ? o.substr(0, d).replace(g, f) + o.substr(d) : o.replace(g, f);
      }
      if ('c' == u) {
        var _ = s.currency.pattern[e < 0 ? 0 : 1];
        '​' == h && (h = ''), (o = _.replace('n', o).replace('$', h));
      }
      return (
        'p' == u &&
          (o = (_ = s.percent.pattern[e < 0 ? 0 : 1]).replace('n', o)),
        o
      );
    }),
    (t.formatDate = function (e, n) {
      switch (((e = asDate(e)), n)) {
        case 'r':
        case 'R':
          return e.toUTCString();
        case 'u':
          return e.toISOString().replace(/\.\d{3}/, '');
      }
      n = t._expandFormat(n);
      for (var r = t._parseDateFormat(n), i = '', o = 0; o < r.length; o++)
        i += t._formatDatePart(e, n, r[o]);
      return i;
    }),
    (t.parseInt = function (e, n) {
      return Math.round(t.parseFloat(e, n));
    }),
    (t.parseFloat = function (t, e) {
      var n =
          t.indexOf('-') > -1 || (t.indexOf('(') > -1 && t.indexOf(')') > -1)
            ? -1
            : 1,
        r = t.indexOf('%') > -1 ? 0.01 : 1,
        i = e ? e.match(/,+/) : null,
        o = i ? 3 * i[0].length : 0;
      if (e && ('x' == e[0] || 'X' == e[0]))
        return (
          (t = t.replace(/[^0-9a-f]+.*$/gi, '')),
          parseInt(t, 16) * n * r * Math.pow(10, o)
        );
      var s = exports.culture.Globalize.numberFormat['.'],
        a = new RegExp('[^\\d\\' + s + ']', 'g'),
        u = t.replace(a, '').replace(s, '.');
      return parseFloat(u) * n * r * Math.pow(10, o);
    }),
    (t.parseDate = function (e, n) {
      if (!(e = asString(e))) return null;
      if ('u' == n) return new Date(e);
      var r;
      if ('R' == n || 'r' == n) {
        var i =
            /(([0-9]+)\-([0-9]+)\-([0-9]+))?\s?(([0-9]+):([0-9]+)(:([0-9]+))?)?/,
          o = e.match(i);
        return (
          o[1] || o[5]
            ? ((r = o[1]
                ? new Date(parseInt(o[2]), parseInt(o[3]) - 1, parseInt(o[4]))
                : new Date()),
              o[5] &&
                (r.setHours(parseInt(o[6])),
                r.setMinutes(parseInt(o[7])),
                r.setSeconds(o[8] ? parseInt(o[9]) : 0)))
            : (r = new Date(e)),
          isNaN(r.getTime()) ? null : r
        );
      }
      n = t._expandFormat(n || 'd');
      var s,
        a,
        u,
        l,
        c,
        h,
        p = exports.culture.Globalize.calendar,
        f = t._CJK,
        d = new RegExp(
          '(\\' +
            p['/'] +
            ')|(\\' +
            p[':'] +
            ')|(\\d+)|([' +
            f +
            '\\.]{2,})|([' +
            f +
            ']+)',
          'gi'
        ),
        g = e.match(d),
        _ = t._parseDateFormat(n),
        m = 0,
        v = -1,
        y = 0,
        b = 1,
        C = 0,
        w = 0,
        E = 0,
        x = 0,
        A = -1;
      if (!(g && g.length && _ && _.length)) return null;
      for (var T = 0; T < _.length && g; T++) {
        var P = T - m,
          S = P > -1 && P < g.length ? g[P] : '',
          F = _[T].length;
        switch (_[T]) {
          case 'EEEE':
          case 'EEE':
          case 'EE':
          case 'E':
          case 'eeee':
          case 'eee':
          case 'ee':
          case 'e':
            h = _[T];
          case 'yyyy':
          case 'yyy':
          case 'yy':
          case 'y':
            F > 1 &&
              S.length > F &&
              ((g[P] = S.substr(F)), (S = S.substr(0, F)), m++),
              (v = parseInt(S)),
              (c = 4 == S.length);
            break;
          case 'MMMM':
          case 'MMM':
            l = !0;
            var M = S.toLowerCase();
            y = -1;
            for (var D = 0; D < 12; D++)
              if (0 == p.months[D].toLowerCase().indexOf(M)) {
                y = D;
                break;
              }
            if (y > -1) break;
          case 'MM':
          case 'M':
            (l = !0),
              F > 1 &&
                S.length > F &&
                ((g[P] = S.substr(F)), (S = S.substr(0, F)), m++),
              (y = parseInt(S) - 1);
            break;
          case 'dddd':
          case 'ddd':
            s = !0;
            break;
          case 'dd':
          case 'd':
            F > 1 &&
              S.length > F &&
              ((g[P] = S.substr(F)), (S = S.substr(0, F)), m++),
              (b = parseInt(S)),
              (a = !0);
            break;
          case 'hh':
          case 'h':
            F > 1 &&
              S.length > F &&
              ((g[P] = S.substr(F)), (S = S.substr(0, F)), m++),
              (C = 12 == (C = parseInt(S)) ? 0 : C);
            break;
          case 'HH':
            F > 1 &&
              S.length > F &&
              ((g[P] = S.substr(F)), (S = S.substr(0, F)), m++),
              (C = parseInt(S));
            break;
          case 'H':
            C = parseInt(S);
            break;
          case 'mm':
          case 'm':
            F > 1 &&
              S.length > F &&
              ((g[P] = S.substr(F)), (S = S.substr(0, F)), m++),
              (w = parseInt(S));
            break;
          case 'ss':
          case 's':
            F > 1 &&
              S.length > F &&
              ((g[P] = S.substr(F)), (S = S.substr(0, F)), m++),
              (E = parseInt(S));
            break;
          case 'fffffff':
          case 'FFFFFFF':
          case 'ffffff':
          case 'FFFFFF':
          case 'fffff':
          case 'FFFFF':
          case 'ffff':
          case 'FFFF':
          case 'fff':
          case 'FFF':
          case 'ff':
          case 'FF':
          case 'f':
          case 'F':
            x = parseInt(S) / Math.pow(10, F - 3);
            break;
          case 'tt':
          case 't':
            (S = S.toUpperCase()), C < 12 && p.pm.indexOf(S) > -1 && (C += 12);
            break;
          case 'q':
          case 'Q':
          case 'u':
          case 'U':
            u = !0;
            break;
          case 'ggg':
          case 'gg':
          case 'g':
            A = p.eras.length > 1 ? t._getEra(S, p) : -1;
            break;
          case p['/']:
          case p[':']:
            if (S && S != _[T]) return null;
            break;
          case 'K':
            break;
          default:
            t._unquote(_[T]).trim() != S.trim() && m++;
        }
      }
      if (
        (l &&
          a &&
          (isNaN(C) && (C = 0), isNaN(w) && (w = 0), isNaN(E) && (E = 0)),
        y < 0 ||
          y > 11 ||
          isNaN(y) ||
          b < 0 ||
          b > 31 ||
          isNaN(b) ||
          C < 0 ||
          C > 24 ||
          isNaN(C) ||
          w < 0 ||
          w > 60 ||
          isNaN(w) ||
          E < 0 ||
          E > 60 ||
          isNaN(E))
      )
        return null;
      if (h) {
        if (!l) return null;
        var O = exports.culture.Globalize.calendar;
        if (isArray(O.fiscalYearOffsets)) {
          var I = 'E' == h[0],
            N = y - O.fiscalYearOffsets[I ? 0 : 1];
          v += N > 11 ? -1 : N < 0 ? 1 : 0;
        }
      }
      return s && !a
        ? null
        : u && !l
        ? null
        : (v < 0 && (v = new Date().getFullYear()),
          A > -1
            ? (v = v + p.eras[A].start.getFullYear() - 1)
            : v < 100 &&
              !c &&
              (v +=
                v + 2e3 <
                (isNumber(p.twoDigitYearMax) ? p.twoDigitYearMax : 2029)
                  ? 2e3
                  : 1900),
          (r = DateTime.newDate(v, y, b, C, w + 0, E, x)),
          isNaN(r.getTime()) ? null : r);
    }),
    (t.getFirstDayOfWeek = function () {
      var t = exports.culture.Globalize.calendar.firstDay;
      return t || 0;
    }),
    (t.getNumberDecimalSeparator = function () {
      var t = exports.culture.Globalize.numberFormat['.'];
      return t || '.';
    }),
    (t._toFixedStr = function (t, e) {
      var n = t.toString(),
        r = n.indexOf('.'),
        i = e - (n.length - r) + 1;
      return n.indexOf('e') < 0 && r > -1 && i >= 0
        ? n + Array(i + 1).join('0')
        : t.toFixed(e);
    }),
    (t._unquote = function (t) {
      return t.length > 1 &&
        t[0] == t[t.length - 1] &&
        ("'" == t[0] || '"' == t[0])
        ? t.substr(1, t.length - 2)
        : t;
    }),
    (t._parseDateFormat = function (e) {
      if (e in t._dateFormatParts) return t._dateFormatParts[e];
      var n,
        r,
        i = [];
      if (e)
        for (n = 0; n > -1 && n < e.length; n++) {
          var o = e[n];
          if (("'" == o || '"' == o) && (r = e.indexOf(o, n + 1)) > -1)
            i.push(e.substring(n, r + 1)), (n = r);
          else {
            for (r = n + 1; r < e.length && e[r] == o; r++);
            i.push(e.substring(n, r)), (n = r - 1);
          }
        }
      return (t._dateFormatParts[e] = i), i;
    }),
    (t._formatDatePart = function (e, n, r) {
      var i,
        o = exports.culture.Globalize.calendar,
        s = 0,
        a = 0,
        u = 0,
        l = r.length;
      switch (r) {
        case 'yyyy':
        case 'yyy':
        case 'yy':
        case 'y':
        case 'EEEE':
        case 'EEE':
        case 'EE':
        case 'E':
        case 'eeee':
        case 'eee':
        case 'ee':
        case 'e':
          (a = (i =
            'E' == r[0]
              ? DateTime.toFiscal(e, !0)
              : 'e' == r[0]
              ? DateTime.toFiscal(e, !1)
              : e).getFullYear()),
            o.eras.length > 1 &&
              n.indexOf('g') > -1 &&
              (s = t._getEra(e, o)) > -1 &&
              (a = a - o.eras[s].start.getFullYear() + 1);
          var c = r.length < 3 ? a % 100 : 3 == r.length ? a % 1e3 : a;
          return t._zeroPad(c, r.length);
        case 'MMMMM':
          return o.monthsAbbr[e.getMonth()][0];
        case 'MMMM':
          return o.months[e.getMonth()];
        case 'MMM':
          return o.monthsAbbr[e.getMonth()];
        case 'MM':
        case 'M':
          return t._zeroPad(e.getMonth() + 1, l);
        case 'dddd':
          return o.days[e.getDay()];
        case 'ddd':
          return o.daysAbbr[e.getDay()];
        case 'dd':
          return t._zeroPad(e.getDate(), 2);
        case 'd':
          return e.getDate().toString();
        case 'hh':
        case 'h':
          return t._zeroPad(t._h12(e), l);
        case 'HH':
        case 'H':
          return t._zeroPad(e.getHours(), l);
        case 'mm':
        case 'm':
          return t._zeroPad(e.getMinutes(), l);
        case 'ss':
        case 's':
          return t._zeroPad(e.getSeconds(), l);
        case 'fffffff':
        case 'FFFFFFF':
        case 'ffffff':
        case 'FFFFFF':
        case 'fffff':
        case 'FFFFF':
        case 'ffff':
        case 'FFFF':
        case 'fff':
        case 'FFF':
        case 'ff':
        case 'FF':
        case 'f':
        case 'F':
          return (
            (u = e.getMilliseconds() * Math.pow(10, l - 3)),
            'f' == r[0] ? t._zeroPad(u, l) : u.toFixed(0)
          );
        case 'tt':
          return e.getHours() < 12 ? o.am[0] : o.pm[0];
        case 't':
          return e.getHours() < 12 ? o.am[1] : o.pm[1];
        case 'q':
        case 'Q':
          return (Math.floor(e.getMonth() / 3) + 1).toString();
        case 'u':
        case 'U':
          return (
            (i = DateTime.toFiscal(e, 'U' == r)),
            (Math.floor(i.getMonth() / 3) + 1).toString()
          );
        case 'ggg':
        case 'gg':
        case 'g':
          return o.eras.length > 1 && (s = t._getEra(e, o)) > -1
            ? 'ggg' == r
              ? o.eras[s].name
              : 'gg' == r
              ? o.eras[s].name[0]
              : o.eras[s].symbol
            : o.eras[0];
        case ':':
        case '/':
          return o[r];
        case 'K':
          var h = e.toString().match(/(\+|\-)(\d{2})(\d{2})/);
          return h ? h[1] + h[2] + h[3] : '';
        case 'zzz':
        case 'zz':
        case 'z':
          var p = -e.getTimezoneOffset(),
            f = void 0;
          switch (r) {
            case 'zzz':
              f =
                t.format(p / 60, 'd2', !1, !0) +
                o[':'] +
                t.format(p % 60, 'd2', !1, !0);
              break;
            case 'zz':
              f = t.format(p / 60, 'd2', !1, !0);
              break;
            case 'z':
              f = t.format(p / 60, 'd', !1, !0);
          }
          return p >= 0 ? '+' + f : f;
      }
      return l > 1 && r[0] == r[l - 1] && ('"' == r[0] || "'" == r[0])
        ? r.substr(1, l - 2)
        : r;
    }),
    (t._getEra = function (t, e) {
      if (isDate(t)) {
        for (n = 0; n < e.eras.length; n++) if (t >= e.eras[n].start) return n;
      } else if (isString(t))
        for (var n = 0; n < e.eras.length; n++)
          if (
            e.eras[n].name &&
            (0 == e.eras[n].name.indexOf(t) || 0 == e.eras[n].symbol.indexOf(t))
          )
            return n;
      return -1;
    }),
    (t._expandFormat = function (t) {
      var e = exports.culture.Globalize.calendar.patterns[t];
      return e || t;
    }),
    (t._zeroPad = function (t, e) {
      var n = t.toFixed(0),
        r = e - n.length + 1;
      return r > 0 ? Array(r).join('0') + n : n;
    }),
    (t._h12 = function (t) {
      var e = exports.culture.Globalize.calendar,
        n = t.getHours();
      return e.am && e.am[0] && 0 == (n %= 12) && (n = 12), n;
    }),
    (t._mul100 = function (t) {
      var e = t.toString(),
        n = e.indexOf('.');
      return e.indexOf('e') > -1
        ? 100 * t
        : (n < 0
            ? (e += '00')
            : ((n += 2),
              (e =
                (e = e.replace('.', '') + '00').substr(0, n) +
                '.' +
                e.substr(n))),
          parseFloat(e));
    }),
    (t._CJK =
      'a-z' +
      'u00c0-u017fu3000-u30ffu4e00-u9faf'.replace(/u/g, '\\u') +
      'u1100-u11ffu3130-u318fua960-ua97fuac00-ud7afud7b0-ud7ff'.replace(
        /u/g,
        '\\u'
      )),
    (t._dateFormatParts = {}),
    t
  );
})();
(exports.Globalize = Globalize), (exports._updateCulture = _updateCulture);
var Binding = (function () {
  function t(t) {
    this.path = t;
  }
  return (
    Object.defineProperty(t.prototype, 'path', {
      get: function () {
        return this._path;
      },
      set: function (t) {
        (this._path = t), (this._parts = t ? t.split('.') : []);
        for (var e = 0; e < this._parts.length; e++) {
          var n = this._parts[e],
            r = n.indexOf('[');
          r > -1 &&
            ((this._parts[e] = n.substr(0, r)),
            this._parts.splice(++e, 0, parseInt(n.substr(r + 1))));
        }
        this._key = 1 == this._parts.length ? this._parts[0] : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getValue = function (t) {
      if (t) {
        if (this._key) return t[this._key];
        if (this._path && this._path in t) return t[this._path];
        for (var e = 0; e < this._parts.length && t; e++) t = t[this._parts[e]];
      }
      return t;
    }),
    (t.prototype.setValue = function (t, e) {
      if (t) {
        if (this._path in t) return void (t[this._path] = e);
        for (var n = 0; n < this._parts.length - 1; n++)
          if (null == (t = t[this._parts[n]])) return;
        t[this._parts[this._parts.length - 1]] = e;
      }
    }),
    t
  );
})();
exports.Binding = Binding;
var EventHandler = (function () {
    return function (t, e) {
      (this.handler = t), (this.self = e);
    };
  })(),
  Event = (function () {
    function t() {
      this._handlers = [];
    }
    return (
      (t.prototype.addHandler = function (t, e) {
        (t = asFunction(t)), this._handlers.push(new EventHandler(t, e));
      }),
      (t.prototype.removeHandler = function (t, e) {
        t = asFunction(t);
        for (var n = 0; n < this._handlers.length; n++) {
          var r = this._handlers[n];
          if (
            (r.handler == t || null == t) &&
            (r.self == e || null == e) &&
            (this._handlers.splice(n, 1), t && e)
          )
            break;
        }
      }),
      (t.prototype.removeAllHandlers = function () {
        this._handlers.length = 0;
      }),
      (t.prototype.raise = function (t, e) {
        void 0 === e && (e = EventArgs.empty);
        for (var n = 0; n < this._handlers.length; n++) {
          var r = this._handlers[n];
          r.handler.call(r.self, t, e);
        }
      }),
      Object.defineProperty(t.prototype, 'hasHandlers', {
        get: function () {
          return this._handlers.length > 0;
        },
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(t.prototype, 'handlerCount', {
        get: function () {
          return this._handlers.length;
        },
        enumerable: !0,
        configurable: !0,
      }),
      t
    );
  })();
exports.Event = Event;
var EventArgs = (function () {
  function t() {}
  return (t.empty = new t()), t;
})();
exports.EventArgs = EventArgs;
var CancelEventArgs = (function (t) {
  function e() {
    var e = (null !== t && t.apply(this, arguments)) || this;
    return (e.cancel = !1), e;
  }
  return __extends(e, t), e;
})(EventArgs);
exports.CancelEventArgs = CancelEventArgs;
var PropertyChangedEventArgs = (function (t) {
  function e(e, n, r) {
    var i = t.call(this) || this;
    return (i._name = e), (i._oldVal = n), (i._newVal = r), i;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'propertyName', {
      get: function () {
        return this._name;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'oldValue', {
      get: function () {
        return this._oldVal;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'newValue', {
      get: function () {
        return this._newVal;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(EventArgs);
exports.PropertyChangedEventArgs = PropertyChangedEventArgs;
var RequestErrorEventArgs = (function (t) {
  function e(e, n) {
    var r = t.call(this) || this;
    return (r._xhr = e), (r._msg = n), r;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'request', {
      get: function () {
        return this._xhr;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'message', {
      get: function () {
        return this._msg;
      },
      set: function (t) {
        this._msg = t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    e
  );
})(CancelEventArgs);
exports.RequestErrorEventArgs = RequestErrorEventArgs;
var Control = (function () {
  function t(e, n, r) {
    void 0 === n && (n = null), void 0 === r && (r = !1);
    var i = this;
    (this._pristine = !0),
      (this._focus = !1),
      (this._updating = 0),
      (this._fullUpdate = !1),
      (this.gotFocus = new Event()),
      (this.lostFocus = new Event()),
      (this.refreshing = new Event()),
      (this.refreshed = new Event()),
      t._updateWme(),
      assert(null == t.getControl(e), 'Element is already hosting a control.');
    var o = getElement(e);
    if (
      (assert(null != o, 'Cannot find the host element.'),
      (this._orgOuter = o.outerHTML),
      (this._orgTag = o.tagName),
      (this._orgAtts = o.attributes),
      ('INPUT' != o.tagName && 'SELECT' != o.tagName) ||
        (o = this._replaceWithDiv(o)),
      (this._e = o),
      (o[t._CTRL_KEY] = this),
      1 == r)
    ) {
      this._szCtl = new Size(o.offsetWidth, o.offsetHeight);
      var s = this._handleResize.bind(this);
      this.addEventListener(window, 'resize', s);
    }
    var a;
    this.addEventListener(
      o,
      'focus',
      function (e) {
        a && clearTimeout(a),
          (a = setTimeout(function () {
            (a = null), i._updateFocusState();
          }, t._FOCUS_INTERVAL));
      },
      !0
    ),
      this.addEventListener(
        o,
        'blur',
        function (e) {
          a && clearTimeout(a),
            (a = setTimeout(function () {
              (a = null), i._updateFocusState();
            }, t._FOCUS_INTERVAL));
        },
        !0
      );
    var u = this._handleDisabled.bind(this);
    if (
      (this.addEventListener(o, 'mousedown', u, !0),
      this.addEventListener(o, 'mouseup', u, !0),
      this.addEventListener(o, 'click', u, !0),
      this.addEventListener(o, 'dblclick', u, !0),
      this.addEventListener(o, 'keydown', u, !0),
      this.addEventListener(o, 'wheel', u, getEventOptions(!0, !0)),
      null == t._touching &&
        ((t._touching = !1),
        'ontouchstart' in window || 'onpointerdown' in window))
    ) {
      var l = document.body,
        c = this._handleTouchStart,
        h = this._handleTouchEnd,
        p = getEventOptions(!0, !0);
      'ontouchstart' in window
        ? (l.addEventListener('touchstart', c, p),
          l.addEventListener('touchend', h, p),
          l.addEventListener('touchcancel', h, p),
          l.addEventListener('touchleave', h, p))
        : 'onpointerdown' in window &&
          (l.addEventListener('pointerdown', c, p),
          l.addEventListener('pointerup', h, p),
          l.addEventListener('pointerout', h, p),
          l.addEventListener('pointercancel', h, p),
          l.addEventListener('pointerleave', h, p));
    }
  }
  return (
    (t.prototype.getTemplate = function () {
      for (
        var t = Object.getPrototypeOf(this);
        t;
        t = Object.getPrototypeOf(t)
      ) {
        var e = t.constructor.controlTemplate;
        if (e) return e;
      }
      return null;
    }),
    (t.prototype.applyTemplate = function (e, n, r, i) {
      var o = this,
        s = this._e;
      e && addClass(s, e);
      var a = null;
      n && (a = createElement(n, s));
      var u = s.querySelectorAll('input'),
        l = 1 == u.length ? u[0] : null;
      if (
        (l &&
          (this._copyAttributes(l, s.attributes, t._rxInputAtts),
          this._copyAttributes(l, this._orgAtts, t._rxInputAtts)),
        l && s.id)
      ) {
        for (var c = s; c.parentElement; ) c = c.parentElement;
        var h = c.querySelector('label[for="' + s.id + '"]');
        if (h instanceof HTMLLabelElement) {
          var p = getUniqueId(s.id + '_input');
          (l.id = p), (h.htmlFor = p);
        }
      }
      if (l) {
        var f = document.createEvent('HTMLEvents'),
          d = l.value;
        f.initEvent('change', !0, !1),
          this.addEventListener(
            l,
            'input',
            function () {
              (o._pristine = !1), (d = l.value);
            },
            !0
          ),
          this.gotFocus.addHandler(function () {
            d = l.value;
          }),
          this.lostFocus.addHandler(function () {
            o._pristine && ((o._pristine = !1), o._updateState()),
              d != l.value && l.dispatchEvent(f);
          });
      }
      if (
        (l ? (s.tabIndex = -1) : s.getAttribute('tabindex') || (s.tabIndex = 0),
        this._updateState(),
        r)
      )
        for (var g in r) {
          var _ = r[g];
          if (
            ((this[g] = a.querySelector('[wj-part="' + _ + '"]')),
            null == this[g] && a.getAttribute('wj-part') == _ && (this[g] = a),
            null == this[g])
          )
            throw 'Missing template part: "' + _ + '"';
          if (_ == i) {
            var m = 'name',
              v = s.attributes[m];
            v && v.value && this[g].setAttribute(m, v.value),
              (m = 'accesskey'),
              (v = s.attributes[m]) &&
                v.value &&
                (this[g].setAttribute(m, v.value), s.removeAttribute(m));
          }
        }
      return a;
    }),
    (t.prototype.dispose = function () {
      for (
        var e = this._e.querySelectorAll('.wj-control'), n = 0;
        n < e.length;
        n++
      ) {
        var r = t.getControl(e[n]);
        r && r.dispose();
      }
      this._toInv && (clearTimeout(this._toInv), (this._toInv = null)),
        this.removeEventListener();
      for (var i in this)
        i.length > 2 &&
          0 == i.indexOf('on') &&
          (s = this[i[2].toLowerCase() + i.substr(3)]) instanceof Event &&
          s.removeAllHandlers();
      var o = this.collectionView;
      if (o instanceof CollectionView)
        for (var i in o) {
          var s = o[i];
          s instanceof Event && s.removeHandler(null, this);
        }
      this._e.parentNode && (this._e.outerHTML = this._orgOuter),
        (this._e[t._CTRL_KEY] = null),
        (this._e = this._orgOuter = this._orgTag = null);
    }),
    (t.getControl = function (e) {
      var n = getElement(e);
      return n ? asType(n[t._CTRL_KEY], t, !0) : null;
    }),
    Object.defineProperty(t.prototype, 'hostElement', {
      get: function () {
        return this._e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'rightToLeft', {
      get: function () {
        return (
          null == this._rtlDir &&
            (this._rtlDir =
              !!this._e && 'rtl' == getComputedStyle(this._e).direction),
          this._rtlDir
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.focus = function () {
      this._e && this._e.focus();
    }),
    (t.prototype.containsFocus = function () {
      var e = this._e,
        n = getActiveElement();
      if (!e) return !1;
      for (var r = n; r; ) {
        if (r == e) return !0;
        r = r[t._OWNR_KEY] || r.parentElement;
      }
      return !1;
    }),
    (t.prototype.invalidate = function (e) {
      var n = this;
      void 0 === e && (e = !0),
        (this._rtlDir = null),
        (this._fullUpdate = this._fullUpdate || e),
        this._toInv && (clearTimeout(this._toInv), (this._toInv = null)),
        this.isUpdating ||
          (this._toInv = setTimeout(function () {
            n.refresh(n._fullUpdate), (n._toInv = null);
          }, t._REFRESH_INTERVAL));
    }),
    (t.prototype.refresh = function (e) {
      var n = this;
      void 0 === e && (e = !0),
        this.isUpdating ||
          (this.onRefreshing(),
          setTimeout(function () {
            n.onRefreshed();
          })),
        !this.isUpdating &&
          this._toInv &&
          (clearTimeout(this._toInv),
          (this._toInv = null),
          (this._rtlDir = null),
          (this._fullUpdate = !1),
          t._updateWme());
    }),
    (t.invalidateAll = function (e) {
      if ((e || (e = document.body), e.children))
        for (var n = 0; n < e.children.length; n++)
          t.invalidateAll(e.children[n]);
      var r = t.getControl(e);
      r && r.invalidate();
    }),
    (t.refreshAll = function (e) {
      if ((e || (e = document.body), e.children))
        for (var n = 0; n < e.children.length; n++) t.refreshAll(e.children[n]);
      var r = t.getControl(e);
      r && r.refresh();
    }),
    (t.disposeAll = function (e) {
      var n = t.getControl(e);
      if (n) n.dispose();
      else if (e.children)
        for (var r = 0; r < e.children.length; r++) t.disposeAll(e.children[r]);
    }),
    (t.prototype.beginUpdate = function () {
      this._updating++;
    }),
    (t.prototype.endUpdate = function () {
      this._updating--, this._updating <= 0 && this.invalidate();
    }),
    Object.defineProperty(t.prototype, 'isUpdating', {
      get: function () {
        return this._updating > 0;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.deferUpdate = function (t) {
      try {
        this.beginUpdate(), t();
      } finally {
        this.endUpdate();
      }
    }),
    Object.defineProperty(t.prototype, 'isTouching', {
      get: function () {
        return t._touching;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isDisabled', {
      get: function () {
        return this._e && null != this._e.getAttribute('disabled');
      },
      set: function (t) {
        (t = asBoolean(t, !0)) != this.isDisabled && enable(this._e, !t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.initialize = function (t) {
      t && copy(this, t);
    }),
    (t.prototype.addEventListener = function (t, e, n, r) {
      void 0 === r && (r = !1),
        t &&
          (t.addEventListener(e, n, r),
          null == this._listeners && (this._listeners = []),
          this._listeners.push({
            target: t,
            type: e,
            fn: n,
            capture: r,
          }));
    }),
    (t.prototype.removeEventListener = function (t, e, n, r) {
      var i = 0;
      if (this._listeners)
        for (var o = 0; o < this._listeners.length; o++) {
          var s = this._listeners[o];
          (null != t && t != s.target) ||
            (null != e && e != s.type) ||
            (null != n && n != s.fn) ||
            (null != r && r != s.capture) ||
            (s.target.removeEventListener(s.type, s.fn, s.capture),
            this._listeners.splice(o, 1),
            o--,
            i++);
        }
      return i;
    }),
    (t.prototype.onGotFocus = function (t) {
      this.gotFocus.raise(this, t);
    }),
    (t.prototype.onLostFocus = function (t) {
      this.lostFocus.raise(this, t);
    }),
    (t.prototype.onRefreshing = function (t) {
      this.refreshing.raise(this, t);
    }),
    (t.prototype.onRefreshed = function (t) {
      this.refreshed.raise(this, t);
    }),
    (t.prototype._hasPendingUpdates = function () {
      return null != this._toInv;
    }),
    (t._updateWme = function () {}),
    (t.prototype._handleResize = function () {
      if (this._e.parentElement) {
        var t = new Size(this._e.offsetWidth, this._e.offsetHeight);
        t.equals(this._szCtl) || ((this._szCtl = t), this.invalidate());
      }
    }),
    (t.prototype._updateFocusState = function () {
      setTimeout(function () {
        for (
          var e = EventArgs.empty,
            n = document.body.querySelectorAll('.wj-state-focused'),
            r = 0;
          r < n.length;
          r++
        )
          (s = t.getControl(n[r])) &&
            s._focus &&
            !s.containsFocus() &&
            ((s._focus = !1), s._updateState(), s.onLostFocus(e));
        var i = getActiveElement();
        if (i)
          for (var o = i; o; ) {
            var s = t.getControl(o);
            s &&
              !s._focus &&
              s.containsFocus() &&
              ((s._focus = !0), s._updateState(), s.onGotFocus(e)),
              (o = o[t._OWNR_KEY] || o.parentElement);
          }
      });
    }),
    (t.prototype._updateState = function () {
      var t = this.hostElement;
      if (t) {
        toggleClass(t, 'wj-state-focused', this._focus);
        var e = t.querySelector('input');
        if (e instanceof HTMLInputElement) {
          toggleClass(t, 'wj-state-empty', 0 == e.value.length),
            toggleClass(t, 'wj-state-readonly', e.readOnly);
          var n = e.validationMessage;
          toggleClass(
            t,
            'wj-state-invalid',
            !this._pristine && null != n && n.length > 0
          );
        }
      }
    }),
    (t.prototype._handleTouchStart = function (e) {
      (null != e.pointerType && 'touch' != e.pointerType) || (t._touching = !0);
    }),
    (t.prototype._handleTouchEnd = function (e) {
      (null != e.pointerType && 'touch' != e.pointerType) ||
        setTimeout(function () {
          t._touching = !1;
        }, 400);
    }),
    (t.prototype._handleDisabled = function (t) {
      this.isDisabled &&
        (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation());
    }),
    (t.prototype._replaceWithDiv = function (t) {
      var e = document.createElement('div');
      return (
        t.parentElement.replaceChild(e, t),
        (e.innerHTML = t.innerHTML),
        this._copyAttributes(e, t.attributes, /id|style|class/i),
        e
      );
    }),
    (t.prototype._copyAttributes = function (t, e, n) {
      if (t)
        for (var r = 0; r < e.length; r++) {
          var i = e[r].name;
          i.match(n) && t.setAttribute(i, e[r].value);
        }
    }),
    (t._REFRESH_INTERVAL = 10),
    (t._FOCUS_INTERVAL = 20),
    (t._ANIM_DEF_DURATION = 400),
    (t._ANIM_DEF_STEP = 35),
    (t._CLICK_DELAY = 800),
    (t._CLICK_REPEAT = 75),
    (t._CLIPBOARD_DELAY = 100),
    (t._CTRL_KEY = '$WJ-CTRL'),
    (t._OWNR_KEY = '$WJ-OWNR'),
    (t._SCRL_KEY = '$WJ-SCRL'),
    (t._rxInputAtts =
      /name|tabindex|placeholder|autofocus|autocomplete|autocorrect|autocapitalize|spellcheck|readonly|minlength|maxlength|pattern|type/i),
    t
  );
})();
exports.Control = Control;
var Aggregate;
!(function (t) {
  (t[(t.None = 0)] = 'None'),
    (t[(t.Sum = 1)] = 'Sum'),
    (t[(t.Cnt = 2)] = 'Cnt'),
    (t[(t.Avg = 3)] = 'Avg'),
    (t[(t.Max = 4)] = 'Max'),
    (t[(t.Min = 5)] = 'Min'),
    (t[(t.Rng = 6)] = 'Rng'),
    (t[(t.Std = 7)] = 'Std'),
    (t[(t.Var = 8)] = 'Var'),
    (t[(t.StdPop = 9)] = 'StdPop'),
    (t[(t.VarPop = 10)] = 'VarPop'),
    (t[(t.CntAll = 11)] = 'CntAll'),
    (t[(t.First = 12)] = 'First'),
    (t[(t.Last = 13)] = 'Last');
})((Aggregate = exports.Aggregate || (exports.Aggregate = {}))),
  (exports.getAggregate = getAggregate);
var NotifyCollectionChangedAction;
!(function (t) {
  (t[(t.Add = 0)] = 'Add'),
    (t[(t.Remove = 1)] = 'Remove'),
    (t[(t.Change = 2)] = 'Change'),
    (t[(t.Reset = 3)] = 'Reset');
})(
  (NotifyCollectionChangedAction =
    exports.NotifyCollectionChangedAction ||
    (exports.NotifyCollectionChangedAction = {}))
);
var NotifyCollectionChangedEventArgs = (function (t) {
  function e(e, n, r) {
    void 0 === e && (e = NotifyCollectionChangedAction.Reset),
      void 0 === n && (n = null),
      void 0 === r && (r = -1);
    var i = t.call(this) || this;
    return (i.action = e), (i.item = n), (i.index = r), i;
  }
  return (
    __extends(e, t), (e.reset = new e(NotifyCollectionChangedAction.Reset)), e
  );
})(EventArgs);
exports.NotifyCollectionChangedEventArgs = NotifyCollectionChangedEventArgs;
var SortDescription = (function () {
  function t(t, e) {
    (this._bnd = new Binding(t)), (this._asc = e);
  }
  return (
    Object.defineProperty(t.prototype, 'property', {
      get: function () {
        return this._bnd.path;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'ascending', {
      get: function () {
        return this._asc;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})();
exports.SortDescription = SortDescription;
var PageChangingEventArgs = (function (t) {
  function e(e) {
    var n = t.call(this) || this;
    return (n.newPageIndex = e), n;
  }
  return __extends(e, t), e;
})(CancelEventArgs);
exports.PageChangingEventArgs = PageChangingEventArgs;
var GroupDescription = (function () {
  function t() {}
  return (
    (t.prototype.groupNameFromItem = function (t, e) {
      return '';
    }),
    (t.prototype.namesMatch = function (t, e) {
      return t === e;
    }),
    t
  );
})();
exports.GroupDescription = GroupDescription;
var PropertyGroupDescription = (function (t) {
  function e(e, n) {
    var r = t.call(this) || this;
    return (r._bnd = new Binding(e)), (r._converter = n), r;
  }
  return (
    __extends(e, t),
    Object.defineProperty(e.prototype, 'propertyName', {
      get: function () {
        return this._bnd.path;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.groupNameFromItem = function (t, e) {
      return this._converter
        ? this._converter(t, this.propertyName)
        : this._bnd.getValue(t);
    }),
    (e.prototype.namesMatch = function (t, e) {
      return t === e;
    }),
    e
  );
})(GroupDescription);
exports.PropertyGroupDescription = PropertyGroupDescription;
var ArrayBase = (function (t) {
  function e() {
    var e = this;
    return canChangePrototype ? (e.length = 0) : (e = t.call(this) || this), e;
  }
  return __extends(e, t), e;
})(Array);
exports.ArrayBase = ArrayBase;
var canChangePrototype = !0;
try {
  (ArrayBase.prototype = Array.prototype),
    (canChangePrototype = ArrayBase.prototype === Array.prototype);
} catch (t) {
  canChangePrototype = !1;
}
var symb = window.Symbol;
!canChangePrototype &&
  symb &&
  symb.species &&
  Object.defineProperty(ArrayBase, symb.species, {
    get: function () {
      return Array;
    },
    enumerable: !1,
    configurable: !1,
  });
var ObservableArray = (function (t) {
  function e(e) {
    var n = t.call(this) || this;
    if (((n._updating = 0), (n.collectionChanged = new Event()), e)) {
      (e = asArray(e)), n._updating++;
      for (var r = 0; r < e.length; r++) n.push(e[r]);
      n._updating--;
    }
    return n;
  }
  return (
    __extends(e, t),
    (e.prototype.push = function () {
      for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
      for (var r = this.length, i = 0; e && i < e.length; i++)
        (r = t.prototype.push.call(this, e[i])),
          this._updating ||
            this._raiseCollectionChanged(
              NotifyCollectionChangedAction.Add,
              e[i],
              r - 1
            );
      return r;
    }),
    (e.prototype.pop = function () {
      var e = t.prototype.pop.call(this);
      return (
        this._raiseCollectionChanged(
          NotifyCollectionChangedAction.Remove,
          e,
          this.length
        ),
        e
      );
    }),
    (e.prototype.splice = function (e, n, r) {
      var i;
      return n && r
        ? ((i = t.prototype.splice.call(this, e, n, r)),
          1 == n
            ? this._raiseCollectionChanged(
                NotifyCollectionChangedAction.Change,
                r,
                e
              )
            : this._raiseCollectionChanged(),
          i)
        : r
        ? ((i = t.prototype.splice.call(this, e, 0, r)),
          this._raiseCollectionChanged(NotifyCollectionChangedAction.Add, r, e),
          i)
        : ((i = t.prototype.splice.call(this, e, n)),
          1 == n
            ? this._raiseCollectionChanged(
                NotifyCollectionChangedAction.Remove,
                i[0],
                e
              )
            : this._raiseCollectionChanged(),
          i);
    }),
    (e.prototype.slice = function (e, n) {
      return t.prototype.slice.call(this, e, n);
    }),
    (e.prototype.indexOf = function (e, n) {
      return t.prototype.indexOf.call(this, e, n);
    }),
    (e.prototype.sort = function (e) {
      var n = t.prototype.sort.call(this, e);
      return this._raiseCollectionChanged(), n;
    }),
    (e.prototype.insert = function (t, e) {
      this.splice(t, 0, e);
    }),
    (e.prototype.remove = function (t) {
      var e = this.indexOf(t);
      return e > -1 && (this.removeAt(e), !0);
    }),
    (e.prototype.removeAt = function (t) {
      this.splice(t, 1);
    }),
    (e.prototype.setAt = function (t, e) {
      t > this.length && (this.length = t), this.splice(t, 1, e);
    }),
    (e.prototype.clear = function () {
      0 !== this.length &&
        (this.splice(0, this.length), this._raiseCollectionChanged());
    }),
    (e.prototype.beginUpdate = function () {
      this._updating++;
    }),
    (e.prototype.endUpdate = function () {
      this._updating > 0 &&
        (this._updating--,
        0 == this._updating && this._raiseCollectionChanged());
    }),
    Object.defineProperty(e.prototype, 'isUpdating', {
      get: function () {
        return this._updating > 0;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.deferUpdate = function (t) {
      try {
        this.beginUpdate(), t();
      } finally {
        this.endUpdate();
      }
    }),
    (e.prototype.implementsInterface = function (t) {
      return 'INotifyCollectionChanged' == t;
    }),
    (e.prototype.onCollectionChanged = function (t) {
      void 0 === t && (t = NotifyCollectionChangedEventArgs.reset),
        this.isUpdating || this.collectionChanged.raise(this, t);
    }),
    (e.prototype._raiseCollectionChanged = function (t, e, n) {
      if (
        (void 0 === t && (t = NotifyCollectionChangedAction.Reset),
        !this.isUpdating)
      ) {
        var r = new NotifyCollectionChangedEventArgs(t, e, n);
        this.onCollectionChanged(r);
      }
    }),
    e
  );
})(ArrayBase);
exports.ObservableArray = ObservableArray;
var CollectionView = (function () {
  function t(t, e) {
    var n = this;
    (this._idx = -1),
      (this._srtDsc = new ObservableArray()),
      (this._grpDesc = new ObservableArray()),
      (this._newItem = null),
      (this._edtItem = null),
      (this._pgSz = 0),
      (this._pgIdx = 0),
      (this._updating = 0),
      (this._stableSort = !1),
      (this._canFilter = !0),
      (this._canGroup = !0),
      (this._canSort = !0),
      (this._canAddNew = !0),
      (this._canCancelEdit = !0),
      (this._canRemove = !0),
      (this._canChangePage = !0),
      (this._trackChanges = !1),
      (this._chgAdded = new ObservableArray()),
      (this._chgRemoved = new ObservableArray()),
      (this._chgEdited = new ObservableArray()),
      (this.collectionChanged = new Event()),
      (this.sourceCollectionChanging = new Event()),
      (this.sourceCollectionChanged = new Event()),
      (this.currentChanged = new Event()),
      (this.currentChanging = new Event()),
      (this.pageChanged = new Event()),
      (this.pageChanging = new Event()),
      this._srtDsc.collectionChanged.addHandler(function () {
        for (var t = n._srtDsc, e = 0; e < t.length; e++)
          assert(
            t[e] instanceof SortDescription,
            'sortDescriptions array must contain SortDescription objects.'
          );
        n.canSort && n.refresh();
      }),
      this._grpDesc.collectionChanged.addHandler(function () {
        for (var t = n._grpDesc, e = 0; e < t.length; e++)
          assert(
            t[e] instanceof GroupDescription,
            'groupDescriptions array must contain GroupDescription objects.'
          );
        n.canGroup && n.refresh();
      }),
      (this.sourceCollection = t || new ObservableArray()),
      e && (this.beginUpdate(), copy(this, e), this.endUpdate());
  }
  return (
    (t.prototype._copy = function (t, e) {
      if ('sortDescriptions' == t) {
        this.sortDescriptions.clear();
        for (var n = asArray(e), r = 0; r < n.length; r++)
          isString((i = n[r])) && (i = new SortDescription(i, !0)),
            this.sortDescriptions.push(i);
        return !0;
      }
      if ('groupDescriptions' == t) {
        this.groupDescriptions.clear();
        for (var n = asArray(e), r = 0; r < n.length; r++) {
          var i = n[r];
          isString(i) && (i = new PropertyGroupDescription(i)),
            this.groupDescriptions.push(i);
        }
        return !0;
      }
      return !1;
    }),
    Object.defineProperty(t.prototype, 'newItemCreator', {
      get: function () {
        return this._itemCreator;
      },
      set: function (t) {
        this._itemCreator = asFunction(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sortConverter', {
      get: function () {
        return this._srtCvt;
      },
      set: function (t) {
        t != this._srtCvt && (this._srtCvt = asFunction(t, !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sortComparer', {
      get: function () {
        return this._srtCmp;
      },
      set: function (t) {
        t != this._srtCmp && (this._srtCmp = asFunction(t, !0));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'useStableSort', {
      get: function () {
        return this._stableSort;
      },
      set: function (t) {
        this._stableSort = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getAggregate = function (t, e, n) {
      return getAggregate(t, n ? this._pgView : this._view, e);
    }),
    Object.defineProperty(t.prototype, 'trackChanges', {
      get: function () {
        return this._trackChanges;
      },
      set: function (t) {
        this._trackChanges = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemsAdded', {
      get: function () {
        return this._chgAdded;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemsRemoved', {
      get: function () {
        return this._chgRemoved;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemsEdited', {
      get: function () {
        return this._chgEdited;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.clearChanges = function () {
      this._chgAdded.clear(), this._chgRemoved.clear(), this._chgEdited.clear();
    }),
    (t.prototype.implementsInterface = function (t) {
      switch (t) {
        case 'ICollectionView':
        case 'IEditableCollectionView':
        case 'IPagedCollectionView':
        case 'INotifyCollectionChanged':
          return !0;
      }
      return !1;
    }),
    Object.defineProperty(t.prototype, 'getError', {
      get: function () {
        return this._getError;
      },
      set: function (t) {
        this._getError = asFunction(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onCollectionChanged = function (t) {
      void 0 === t && (t = NotifyCollectionChangedEventArgs.reset),
        t.action != NotifyCollectionChangedAction.Change ||
          this._committing ||
          this._canceling ||
          t.item == this.currentEditItem ||
          t.item == this.currentAddItem ||
          this._trackItemChanged(t.item),
        this.collectionChanged.raise(this, t);
    }),
    (t.prototype._raiseCollectionChanged = function (t, e, n) {
      void 0 === t && (t = NotifyCollectionChangedAction.Reset);
      var r = new NotifyCollectionChangedEventArgs(t, e, n);
      this.onCollectionChanged(r);
    }),
    (t.prototype._notifyItemChanged = function (t) {
      var e = new NotifyCollectionChangedEventArgs(
        NotifyCollectionChangedAction.Change,
        t,
        this.items.indexOf(t)
      );
      this.onCollectionChanged(e);
    }),
    (t.prototype.onSourceCollectionChanging = function (t) {
      return this.sourceCollectionChanging.raise(this, t), !t.cancel;
    }),
    (t.prototype.onSourceCollectionChanged = function (t) {
      this.sourceCollectionChanged.raise(this, t);
    }),
    Object.defineProperty(t.prototype, 'canFilter', {
      get: function () {
        return this._canFilter;
      },
      set: function (t) {
        this._canFilter = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'canGroup', {
      get: function () {
        return this._canGroup;
      },
      set: function (t) {
        this._canGroup = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'canSort', {
      get: function () {
        return this._canSort;
      },
      set: function (t) {
        this._canSort = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'currentItem', {
      get: function () {
        return this._pgView && this._idx > -1 && this._idx < this._pgView.length
          ? this._pgView[this._idx]
          : null;
      },
      set: function (t) {
        this.moveCurrentTo(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'currentPosition', {
      get: function () {
        return this._idx;
      },
      set: function (t) {
        this.moveCurrentToPosition(asNumber(t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'filter', {
      get: function () {
        return this._filter;
      },
      set: function (t) {
        this._filter != t &&
          ((this._filter = asFunction(t)), this.canFilter && this.refresh());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'groupDescriptions', {
      get: function () {
        return this._grpDesc;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'groups', {
      get: function () {
        return this._groups;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isEmpty', {
      get: function () {
        return !this._pgView || !this._pgView.length;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sortDescriptions', {
      get: function () {
        return this._srtDsc;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'sourceCollection', {
      get: function () {
        return this._src;
      },
      set: function (t) {
        if (t != this._src) {
          if (!this.onSourceCollectionChanging(new CancelEventArgs())) return;
          var e = this.currentPosition;
          this.commitEdit(),
            this.commitNew(),
            null != this._ncc &&
              this._ncc.collectionChanged.removeHandler(this._sourceChanged),
            (this._src = asArray(t, !1)),
            (this._ncc = tryCast(this._src, 'INotifyCollectionChanged')),
            this._ncc &&
              this._ncc.collectionChanged.addHandler(this._sourceChanged, this),
            this.clearChanges(),
            this.refresh(),
            this.moveCurrentToFirst(),
            this.onSourceCollectionChanged(),
            this.currentPosition < 0 && e > -1 && this.onCurrentChanged();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._sourceChanged = function (t, e) {
      this._updating <= 0 && this.refresh();
    }),
    (t.prototype.contains = function (t) {
      return this._pgView.indexOf(t) > -1;
    }),
    (t.prototype.moveCurrentTo = function (t) {
      return this.moveCurrentToPosition(this._pgView.indexOf(t));
    }),
    (t.prototype.moveCurrentToFirst = function () {
      return this.moveCurrentToPosition(0);
    }),
    (t.prototype.moveCurrentToLast = function () {
      return this.moveCurrentToPosition(this._pgView.length - 1);
    }),
    (t.prototype.moveCurrentToPrevious = function () {
      return this._idx > 0 && this.moveCurrentToPosition(this._idx - 1);
    }),
    (t.prototype.moveCurrentToNext = function () {
      return this.moveCurrentToPosition(this._idx + 1);
    }),
    (t.prototype.moveCurrentToPosition = function (t) {
      if (t >= -1 && t < this._pgView.length && t != this._idx) {
        var e = new CancelEventArgs();
        if (this.onCurrentChanging(e)) {
          var n = this._pgView[t];
          this._edtItem && n != this._edtItem && this.commitEdit(),
            this._newItem && n != this._newItem && this.commitNew(),
            (this._idx = t),
            this.onCurrentChanged();
        }
      }
      return this._idx == t;
    }),
    (t.prototype.refresh = function () {
      this._updating > 0 ||
        this._newItem ||
        this._edtItem ||
        (this._performRefresh(), this.onCollectionChanged());
    }),
    (t.prototype._performRefresh = function () {
      if (!(this._updating > 0)) {
        var t = this.currentItem;
        (this._view = this._src ? this._performFilter(this._src) : []),
          this.canSort &&
            this._srtDsc.length > 0 &&
            (this._view == this._src && (this._view = this._src.slice()),
            this._performSort(this._view)),
          (this._groups = this.canGroup
            ? this._createGroups(this._view)
            : null),
          (this._fullGroups = this._groups),
          this._groups && (this._view = this._mergeGroupItems(this._groups)),
          (this._pgIdx = clamp(this._pgIdx, 0, this.pageCount - 1)),
          (this._pgView = this._getPageView()),
          this._groups &&
            this.pageCount > 1 &&
            ((this._groups = this._createGroups(this._pgView)),
            this._mergeGroupItems(this._groups));
        var e = this._pgView.indexOf(t);
        e < 0 && (e = Math.min(this._idx, this._pgView.length - 1)),
          (this._idx = e),
          (this._digest = this._getGroupsDigest(this.groups)),
          this.currentItem !== t && this.onCurrentChanged();
      }
    }),
    (t.prototype._performSort = function (t) {
      if (this._stableSort) {
        var e = t.map(function (t, e) {
            return { item: t, index: e };
          }),
          n = this._compareItems();
        e.sort(function (t, e) {
          var r = n(t.item, e.item);
          return 0 == r ? t.index - e.index : r;
        });
        for (var r = 0; r < t.length; r++) t[r] = e[r].item;
      } else t.sort(this._compareItems());
    }),
    (t.prototype._compareItems = function () {
      var t = this._srtDsc,
        e = this._srtCvt,
        n = this._srtCmp,
        r = !0,
        i = 0;
      return function (o, s) {
        for (var a = 0; a < t.length; a++) {
          var u = t[a],
            l = u._bnd.getValue(o),
            c = u._bnd.getValue(s);
          if (
            (e && ((l = e(u, o, l, r)), (c = e(u, s, c, !1)), (r = !1)),
            n && null != (i = n(l, c)))
          )
            return u.ascending ? +i : -i;
          if (
            (l !== l && (l = null),
            c !== c && (c = null),
            'string' == typeof l && 'string' == typeof c)
          ) {
            var h = l.toLowerCase(),
              p = c.toLowerCase();
            h != p && ((l = h), (c = p));
          }
          if (null != l && null == c) return -1;
          if (null == l && null != c) return 1;
          if (0 != (i = l < c ? -1 : l > c ? 1 : 0))
            return u.ascending ? +i : -i;
        }
        return 0;
      };
    }),
    (t.prototype._performFilter = function (t) {
      return this.canFilter && this._filter ? t.filter(this._filter, this) : t;
    }),
    (t.prototype.onCurrentChanged = function (t) {
      void 0 === t && (t = EventArgs.empty), this.currentChanged.raise(this, t);
    }),
    (t.prototype.onCurrentChanging = function (t) {
      return this.currentChanging.raise(this, t), !t.cancel;
    }),
    Object.defineProperty(t.prototype, 'items', {
      get: function () {
        return this._pgView;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.beginUpdate = function () {
      this._updating++;
    }),
    (t.prototype.endUpdate = function () {
      this._updating--, this._updating <= 0 && this.refresh();
    }),
    Object.defineProperty(t.prototype, 'isUpdating', {
      get: function () {
        return this._updating > 0;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.deferUpdate = function (t) {
      try {
        this.beginUpdate(), t();
      } finally {
        this.endUpdate();
      }
    }),
    Object.defineProperty(t.prototype, 'canAddNew', {
      get: function () {
        return this._canAddNew;
      },
      set: function (t) {
        this._canAddNew = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'canCancelEdit', {
      get: function () {
        return this._canCancelEdit;
      },
      set: function (t) {
        this._canCancelEdit = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'canRemove', {
      get: function () {
        return this._canRemove;
      },
      set: function (t) {
        this._canRemove = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'currentAddItem', {
      get: function () {
        return this._newItem;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'currentEditItem', {
      get: function () {
        return this._edtItem;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isAddingNew', {
      get: function () {
        return null != this._newItem;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isEditingItem', {
      get: function () {
        return null != this._edtItem;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.editItem = function (t) {
      t != this._edtItem &&
        this.moveCurrentTo(t) &&
        (this.commitEdit(),
        (this._edtItem = t),
        (this._edtClone = {}),
        this._extend(this._edtClone, this._edtItem));
    }),
    (t.prototype.commitEdit = function () {
      var t = this._edtItem;
      if (null != t) {
        this._committing = !0;
        var e = this._sameContent(t, this._edtClone);
        (this._edtItem = null), (this._edtClone = null);
        var n = this._pgView.indexOf(t),
          r = this._digest;
        this._performRefresh(),
          e || this._trackItemChanged(t),
          this._pgView.indexOf(t) == n && r == this._digest
            ? this._raiseCollectionChanged(
                NotifyCollectionChangedAction.Change,
                t,
                n
              )
            : this._raiseCollectionChanged(),
          (this._committing = !1);
      }
    }),
    (t.prototype.cancelEdit = function () {
      var t = this._edtItem;
      if (null != t) {
        if (((this._edtItem = null), !this.canCancelEdit))
          return void assert(
            !1,
            'cannot cancel edits (canCancelEdit == false).'
          );
        var e = this._src.indexOf(t);
        if (e < 0 || !this._edtClone) return;
        this._extend(this._src[e], this._edtClone),
          (this._edtClone = null),
          (this._canceling = !0),
          this._raiseCollectionChanged(
            NotifyCollectionChangedAction.Change,
            t,
            e
          ),
          (this._canceling = !1);
      }
    }),
    (t.prototype.addNew = function () {
      if (
        (arguments.length > 0 &&
          assert(
            !1,
            'addNew does not take any parameters, it creates the new items.'
          ),
        this.commitEdit(),
        this.commitNew(),
        !this.canAddNew)
      )
        return assert(!1, 'cannot add items (canAddNew == false).'), null;
      var t = null,
        e = this.sourceCollection;
      if (
        null !=
        (t = this.newItemCreator
          ? this.newItemCreator()
          : e && e.length
          ? new e[0].constructor()
          : {})
      ) {
        if (
          ((this._newItem = t),
          this._updating++,
          this._src.push(t),
          this._updating--,
          this._pgView != this._src && this._pgView.push(t),
          this.groups && this.groups.length)
        ) {
          var n = this.groups[this.groups.length - 1];
          for (n.items.push(t); n.groups && n.groups.length; )
            (n = n.groups[n.groups.length - 1]).items.push(t);
        }
        this._raiseCollectionChanged(
          NotifyCollectionChangedAction.Add,
          t,
          this._pgView.length - 1
        ),
          this.moveCurrentTo(t);
      }
      return this._newItem;
    }),
    (t.prototype.commitNew = function () {
      var t = this._newItem;
      if (null != t) {
        this._newItem = null;
        var e = this._pgView.indexOf(t),
          n = this._digest;
        if ((this._performRefresh(), this._trackChanges)) {
          var r = this._chgEdited.indexOf(t);
          r > -1 && this._chgEdited.removeAt(r),
            this._chgAdded.indexOf(t) < 0 && this._chgAdded.push(t);
        }
        this._pgView.indexOf(t) == e && n == this._digest
          ? this._raiseCollectionChanged(
              NotifyCollectionChangedAction.Change,
              t,
              e
            )
          : this._raiseCollectionChanged();
      }
    }),
    (t.prototype.cancelNew = function () {
      var t = this._newItem;
      null != t && this.remove(t);
    }),
    (t.prototype.remove = function (t) {
      var e = t == this._newItem;
      if (
        (e && (this._newItem = null),
        t == this._edtItem && this.cancelEdit(),
        this.canRemove)
      ) {
        var n = this._src.indexOf(t);
        if (n > -1) {
          var r = this.currentItem;
          this._updating++, this._src.splice(n, 1), this._updating--;
          var i = this._digest;
          if ((this._performRefresh(), this._trackChanges)) {
            var o = this._chgAdded.indexOf(t);
            o > -1 && this._chgAdded.removeAt(o);
            var s = this._chgEdited.indexOf(t);
            s > -1 && this._chgEdited.removeAt(s),
              this._chgRemoved.indexOf(t) < 0 &&
                !e &&
                o < 0 &&
                this._chgRemoved.push(t);
          }
          var a = this.sortDescriptions.length > 0,
            u = this.pageSize > 0 && this._pgIdx > -1;
          a || u || i != this._getGroupsDigest(this.groups)
            ? this._raiseCollectionChanged()
            : this._raiseCollectionChanged(
                NotifyCollectionChangedAction.Remove,
                t,
                n
              ),
            this.currentItem !== r && this.onCurrentChanged();
        }
      } else assert(!1, 'cannot remove items (canRemove == false).');
    }),
    (t.prototype.removeAt = function (t) {
      (t = asInt(t)), this.remove(this._pgView[t]);
    }),
    (t.prototype._trackItemChanged = function (t) {
      if (this._trackChanges) {
        var e = this.sourceCollection;
        if (e && e.indexOf(t) > -1) {
          var n = this._chgEdited.indexOf(t),
            r = NotifyCollectionChangedAction.Change;
          if (n < 0 && this._chgAdded.indexOf(t) < 0) this._chgEdited.push(t);
          else if (n > -1) {
            i = new NotifyCollectionChangedEventArgs(r, t, n);
            this._chgEdited.onCollectionChanged(i);
          } else if ((n = this._chgAdded.indexOf(t)) > -1) {
            var i = new NotifyCollectionChangedEventArgs(r, t, n);
            this._chgAdded.onCollectionChanged(i);
          }
        }
      }
    }),
    (t.prototype._extend = function (t, e) {
      for (var n in e) t[n] = e[n];
    }),
    (t.prototype._sameContent = function (t, e) {
      for (var n in e) if (!this._sameValue(t[n], e[n])) return !1;
      for (var n in t) if (!this._sameValue(t[n], e[n])) return !1;
      return !0;
    }),
    (t.prototype._sameValue = function (t, e) {
      return t === e || DateTime.equals(t, e);
    }),
    Object.defineProperty(t.prototype, 'canChangePage', {
      get: function () {
        return this._canChangePage;
      },
      set: function (t) {
        this._canChangePage = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isPageChanging', {
      get: function () {
        return !1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'itemCount', {
      get: function () {
        return this._pgView.length;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pageIndex', {
      get: function () {
        return this._pgIdx;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pageSize', {
      get: function () {
        return this._pgSz;
      },
      set: function (t) {
        t != this._pgSz && ((this._pgSz = asInt(t)), this.refresh());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'totalItemCount', {
      get: function () {
        return this._view.length;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'pageCount', {
      get: function () {
        return this.pageSize
          ? Math.ceil(this.totalItemCount / this.pageSize)
          : 1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.moveToFirstPage = function () {
      return this.moveToPage(0);
    }),
    (t.prototype.moveToLastPage = function () {
      return this.moveToPage(this.pageCount - 1);
    }),
    (t.prototype.moveToPreviousPage = function () {
      return this.moveToPage(this.pageIndex - 1);
    }),
    (t.prototype.moveToNextPage = function () {
      return this.moveToPage(this.pageIndex + 1);
    }),
    (t.prototype.moveToPage = function (t) {
      var e = clamp(t, 0, this.pageCount - 1);
      if (e != this._pgIdx) {
        this.canChangePage ||
          assert(!1, 'cannot change pages (canChangePage == false).');
        var n = new PageChangingEventArgs(e);
        this.onPageChanging(n) &&
          ((this._pgIdx = e),
          (this._pgView = this._getPageView()),
          (this._idx = 0),
          this.groupDescriptions && 0 != this.groupDescriptions.length
            ? this.refresh()
            : this.onCollectionChanged(),
          this.onPageChanged());
      }
      return this._pgIdx == t;
    }),
    (t.prototype.onPageChanged = function (t) {
      void 0 === t && (t = EventArgs.empty), this.pageChanged.raise(this, t);
    }),
    (t.prototype.onPageChanging = function (t) {
      return this.pageChanging.raise(this, t), !t.cancel;
    }),
    (t.prototype._getFullGroup = function (t) {
      var e = this._getGroupByPath(this._fullGroups, t.level, t._path);
      return null != e && (t = e), t;
    }),
    (t.prototype._getGroupByPath = function (t, e, n) {
      for (var r = 0; r < t.length; r++) {
        var i = t[r];
        if (i.level == e && i._path == n) return i;
        if (
          i.level < e &&
          0 == n.indexOf(i._path) &&
          null != (i = this._getGroupByPath(i.groups, e, n))
        )
          return i;
      }
      return null;
    }),
    (t.prototype._getPageView = function () {
      if (this.pageSize <= 0 || this._pgIdx < 0) return this._view;
      var t = this._pgSz * this._pgIdx,
        e = Math.min(t + this._pgSz, this._view.length);
      return this._view.slice(t, e);
    }),
    (t.prototype._createGroups = function (t) {
      if (!this._grpDesc || !this._grpDesc.length) return null;
      for (var e = [], n = {}, r = null, i = 0; i < t.length; i++)
        for (
          var o = t[i], s = e, a = this._grpDesc.length, u = '', l = 0;
          l < a;
          l++
        ) {
          var c = this._grpDesc[l],
            h = c.groupNameFromItem(o, l),
            p = l == a - 1;
          !(r = n[u]) && isPrimitive(h) && ((r = {}), (n[u] = r));
          var f = this._getGroup(c, s, r, h, l, p);
          (u += '/' + h), (f._path = u), p && f.items.push(o), (s = f.groups);
        }
      return e;
    }),
    (t.prototype._getGroupsDigest = function (t) {
      for (var e = '', n = 0; null != t && n < t.length; n++) {
        var r = t[n];
        (e += '{' + r.name + ':' + (r.items ? r.items.length : '*')),
          r.groups.length > 0 &&
            ((e += ','), (e += this._getGroupsDigest(r.groups))),
          (e += '}');
      }
      return e;
    }),
    (t.prototype._mergeGroupItems = function (t) {
      for (var e = [], n = 0; n < t.length; n++) {
        var r = t[n];
        if (!r._isBottomLevel)
          for (
            var i = this._mergeGroupItems(r.groups), o = 0, s = i.length;
            o < s;
            o++
          )
            r._items.push(i[o]);
        for (var o = 0, s = r._items.length; o < s; o++) e.push(r._items[o]);
      }
      return e;
    }),
    (t.prototype._getGroup = function (t, e, n, r, i, o) {
      var s;
      if (n && isPrimitive(r)) {
        if ((s = n[r])) return s;
      } else
        for (var a = 0; a < e.length; a++)
          if (t.namesMatch(e[a].name, r)) return e[a];
      var u = new CollectionViewGroup(t, r, i, o);
      return e.push(u), n && (n[r] = u), u;
    }),
    t
  );
})();
exports.CollectionView = CollectionView;
var CollectionViewGroup = (function () {
  function t(t, e, n, r) {
    (this._gd = t),
      (this._name = e),
      (this._level = n),
      (this._isBottomLevel = r),
      (this._groups = []),
      (this._items = []);
  }
  return (
    Object.defineProperty(t.prototype, 'name', {
      get: function () {
        return this._name;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'level', {
      get: function () {
        return this._level;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isBottomLevel', {
      get: function () {
        return this._isBottomLevel;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'items', {
      get: function () {
        return this._items;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'groups', {
      get: function () {
        return this._groups;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'groupDescription', {
      get: function () {
        return this._gd;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getAggregate = function (t, e, n) {
      var r = tryCast(n, CollectionView);
      return getAggregate(t, (r ? r._getFullGroup(this) : this).items, e);
    }),
    t
  );
})();
exports.CollectionViewGroup = CollectionViewGroup;
var Tooltip = (function () {
  function t(t) {
    (this._showAutoTipBnd = this._showAutoTip.bind(this)),
      (this._hideAutoTipBnd = this._hideAutoTip.bind(this)),
      (this._html = !0),
      (this._gap = 6),
      (this._showAtMouse = !1),
      (this._showDelay = 500),
      (this._hideDelay = 0),
      (this._tips = []),
      (this.popup = new Event()),
      copy(this, t);
  }
  return (
    (t.prototype.setTooltip = function (t, e) {
      (t = getElement(t)), (e = this._getContent(e));
      var n = this._indexOf(t);
      n > -1 && (this._detach(t), this._tips.splice(n, 1)),
        e && (this._attach(t), this._tips.push({ element: t, content: e }));
    }),
    (t.prototype.getTooltip = function (t) {
      t = getElement(t);
      for (var e = this._tips, n = 0; n < e.length; n++)
        if (e[n].element == t) return e[n].content;
      return null;
    }),
    (t.prototype.show = function (e, n, r) {
      (e = getElement(e)),
        (n = this._getContent(n)),
        r || (r = Rect.fromBoundingRect(e.getBoundingClientRect()));
      var i = t._eTip;
      i ||
        (addClass((i = t._eTip = document.createElement('div')), 'wj-tooltip'),
        (i.style.visibility = 'none')),
        this._setContent(n);
      var o = new TooltipEventArgs(n);
      this.onPopup(o),
        o.content &&
          !o.cancel &&
          (document.body.appendChild(i),
          this._setContent(o.content),
          (i.style.minWidth = ''),
          showPopup(
            i,
            (r = new Rect(
              r.left - (i.offsetWidth - r.width) / 2,
              r.top - this.gap,
              i.offsetWidth,
              r.height + 2 * this.gap
            )),
            !0
          ),
          document.addEventListener('mousedown', this._hideAutoTipBnd));
    }),
    (t.prototype.hide = function () {
      var e = t._eTip;
      e && (removeChild(e), (e.innerHTML = '')),
        document.removeEventListener('mousedown', this._hideAutoTipBnd);
    }),
    (t.prototype.dispose = function () {
      var t = this;
      this._tips.forEach(function (e) {
        t._detach(e.element);
      }),
        this._tips.splice(0, this._tips.length);
    }),
    Object.defineProperty(t.prototype, 'isVisible', {
      get: function () {
        var e = t._eTip;
        return null != e && null != e.parentElement && e.offsetWidth > 0;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isContentHtml', {
      get: function () {
        return this._html;
      },
      set: function (t) {
        this._html = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'gap', {
      get: function () {
        return this._gap;
      },
      set: function (t) {
        this._gap = asNumber(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showAtMouse', {
      get: function () {
        return this._showAtMouse;
      },
      set: function (t) {
        this._showAtMouse = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showDelay', {
      get: function () {
        return this._showDelay;
      },
      set: function (t) {
        this._showDelay = asInt(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'hideDelay', {
      get: function () {
        return this._hideDelay;
      },
      set: function (t) {
        this._hideDelay = asInt(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.onPopup = function (t) {
      return this.popup && this.popup.raise(this, t), !t.cancel;
    }),
    (t.prototype._indexOf = function (t) {
      for (var e = 0; e < this._tips.length; e++)
        if (this._tips[e].element == t) return e;
      return -1;
    }),
    (t.prototype._attach = function (t) {
      t.addEventListener('mouseenter', this._showAutoTipBnd),
        t.addEventListener('mouseleave', this._hideAutoTipBnd),
        t.addEventListener('click', this._showAutoTipBnd);
    }),
    (t.prototype._detach = function (t) {
      t.removeEventListener('mouseenter', this._showAutoTipBnd),
        t.removeEventListener('mouseleave', this._hideAutoTipBnd),
        t.removeEventListener('click', this._showAutoTipBnd);
    }),
    (t.prototype._showAutoTip = function (t) {
      var e = this;
      if (!t.defaultPrevented)
        if ('click' != t.type || Control._touching) {
          var n = 'mouseenter' == t.type ? this._showDelay : 0;
          this._clearTimeouts(),
            (this._toShow = setTimeout(function () {
              var n = e._indexOf(t.target);
              if (n > -1) {
                var r = e._tips[n],
                  i = e._showAtMouse
                    ? new Rect(t.clientX, t.clientY, 0, 0)
                    : null;
                e.show(r.element, r.content, i),
                  e._hideDelay > 0 &&
                    (e._toHide = setTimeout(function () {
                      e.hide();
                    }, e._hideDelay));
              }
            }, n));
        } else this._hideAutoTip();
    }),
    (t.prototype._hideAutoTip = function () {
      this._clearTimeouts(), this.hide();
    }),
    (t.prototype._clearTimeouts = function () {
      this._toShow && (clearTimeout(this._toShow), (this._toShow = null)),
        this._toHide && (clearTimeout(this._toHide), (this._toHide = null));
    }),
    (t.prototype._getContent = function (t) {
      if ((t = asString(t)) && '#' == t[0]) {
        var e = getElement(t);
        e && (t = e.innerHTML);
      }
      return t;
    }),
    (t.prototype._setContent = function (e) {
      var n = t._eTip;
      n && (this.isContentHtml ? (n.innerHTML = e) : (n.textContent = e));
    }),
    t
  );
})();
exports.Tooltip = Tooltip;
var ElementContent = (function () {
    return function () {};
  })(),
  TooltipEventArgs = (function (t) {
    function e(e) {
      var n = t.call(this) || this;
      return (n._content = asString(e)), n;
    }
    return (
      __extends(e, t),
      Object.defineProperty(e.prototype, 'content', {
        get: function () {
          return this._content;
        },
        set: function (t) {
          this._content = asString(t);
        },
        enumerable: !0,
        configurable: !0,
      }),
      e
    );
  })(CancelEventArgs);
exports.TooltipEventArgs = TooltipEventArgs;
var Color = (function () {
  function t(t) {
    (this._r = 0),
      (this._g = 0),
      (this._b = 0),
      (this._a = 1),
      t && this._parse(t);
  }
  return (
    Object.defineProperty(t.prototype, 'r', {
      get: function () {
        return this._r;
      },
      set: function (t) {
        this._r = clamp(asNumber(t), 0, 255);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'g', {
      get: function () {
        return this._g;
      },
      set: function (t) {
        this._g = clamp(asNumber(t), 0, 255);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'b', {
      get: function () {
        return this._b;
      },
      set: function (t) {
        this._b = clamp(asNumber(t), 0, 255);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'a', {
      get: function () {
        return this._a;
      },
      set: function (t) {
        this._a = clamp(asNumber(t), 0, 1);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.equals = function (e) {
      return (
        e instanceof t &&
        this.r == e.r &&
        this.g == e.g &&
        this.b == e.b &&
        this.a == e.a
      );
    }),
    (t.prototype.toString = function () {
      var t = Math.round(100 * this.a);
      return t > 99
        ? '#' +
            ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b)
              .toString(16)
              .slice(1)
        : 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + t / 100 + ')';
    }),
    (t.fromRgba = function (e, n, r, i) {
      void 0 === i && (i = 1);
      var o = new t(null);
      return (
        (o.r = Math.round(clamp(asNumber(e), 0, 255))),
        (o.g = Math.round(clamp(asNumber(n), 0, 255))),
        (o.b = Math.round(clamp(asNumber(r), 0, 255))),
        (o.a = clamp(asNumber(i), 0, 1)),
        o
      );
    }),
    (t.fromHsb = function (e, n, r, i) {
      void 0 === i && (i = 1);
      var o = t._hsbToRgb(
        clamp(asNumber(e), 0, 1),
        clamp(asNumber(n), 0, 1),
        clamp(asNumber(r), 0, 1)
      );
      return t.fromRgba(o[0], o[1], o[2], i);
    }),
    (t.fromHsl = function (e, n, r, i) {
      void 0 === i && (i = 1);
      var o = t._hslToRgb(
        clamp(asNumber(e), 0, 1),
        clamp(asNumber(n), 0, 1),
        clamp(asNumber(r), 0, 1)
      );
      return t.fromRgba(o[0], o[1], o[2], i);
    }),
    (t.fromString = function (e) {
      var n = new t(null);
      return n._parse(asString(e)) ? n : null;
    }),
    (t.prototype.getHsb = function () {
      return t._rgbToHsb(this.r, this.g, this.b);
    }),
    (t.prototype.getHsl = function () {
      return t._rgbToHsl(this.r, this.g, this.b);
    }),
    (t.interpolate = function (e, n, r) {
      r = clamp(asNumber(r), 0, 1);
      var i = t._rgbToHsl(e.r, e.g, e.b),
        o = t._rgbToHsl(n.r, n.g, n.b),
        s = 1 - r,
        a = e.a * s + n.a * r,
        u = [i[0] * s + o[0] * r, i[1] * s + o[1] * r, i[2] * s + o[2] * r],
        l = t._hslToRgb(u[0], u[1], u[2]);
      return t.fromRgba(l[0], l[1], l[2], a);
    }),
    (t.toOpaque = function (e, n) {
      if (1 == (e = isString(e) ? t.fromString(e) : asType(e, t)).a) return e;
      n =
        null == n
          ? t.fromRgba(255, 255, 255, 1)
          : isString(n)
          ? t.fromString(n)
          : asType(n, t);
      var r = e.a,
        i = 1 - r;
      return t.fromRgba(
        e.r * r + n.r * i,
        e.g * r + n.g * i,
        e.b * r + n.b * i
      );
    }),
    (t.prototype._parse = function (e) {
      if ('transparent' == (e = e.toLowerCase()))
        return (this._r = this._g = this._b = this._a = 0), !0;
      if (
        e &&
        0 != e.indexOf('#') &&
        0 != e.indexOf('rgb') &&
        0 != e.indexOf('hsl')
      ) {
        var n = document.createElement('div');
        n.style.color = e;
        var r = n.style.color;
        r == e &&
          ((r = window.getComputedStyle(n).color) ||
            (document.body.appendChild(n),
            (r = window.getComputedStyle(n).color),
            removeChild(n))),
          (e = r.toLowerCase());
      }
      if (0 == e.indexOf('#'))
        return 4 == e.length
          ? ((this.r = parseInt(e[1] + e[1], 16)),
            (this.g = parseInt(e[2] + e[2], 16)),
            (this.b = parseInt(e[3] + e[3], 16)),
            (this.a = 1),
            !0)
          : 7 == e.length &&
              ((this.r = parseInt(e.substr(1, 2), 16)),
              (this.g = parseInt(e.substr(3, 2), 16)),
              (this.b = parseInt(e.substr(5, 2), 16)),
              (this.a = 1),
              !0);
      if (0 == e.indexOf('rgb')) {
        var i = e.indexOf('('),
          o = e.indexOf(')');
        if (
          i > -1 &&
          o > -1 &&
          (s = e.substr(i + 1, o - (i + 1)).split(',')).length > 2
        )
          return (
            (this.r = parseInt(s[0])),
            (this.g = parseInt(s[1])),
            (this.b = parseInt(s[2])),
            (this.a = s.length > 3 ? parseFloat(s[3]) : 1),
            !0
          );
      }
      if (0 == e.indexOf('hsl')) {
        var i = e.indexOf('('),
          o = e.indexOf(')');
        if (i > -1 && o > -1) {
          var s = e.substr(i + 1, o - (i + 1)).split(',');
          if (s.length > 2) {
            var a = parseInt(s[0]) / 360,
              u = parseInt(s[1]),
              l = parseInt(s[2]);
            s[1].indexOf('%') > -1 && (u /= 100),
              s[2].indexOf('%') > -1 && (l /= 100);
            var c = t._hslToRgb(a, u, l);
            return (
              (this.r = c[0]),
              (this.g = c[1]),
              (this.b = c[2]),
              (this.a = s.length > 3 ? parseFloat(s[3]) : 1),
              !0
            );
          }
        }
      }
      return !1;
    }),
    (t._hslToRgb = function (e, n, r) {
      assert(
        e >= 0 && e <= 1 && n >= 0 && n <= 1 && r >= 0 && r <= 1,
        'bad HSL values'
      );
      var i, o, s;
      if (0 == n) i = o = s = r;
      else {
        var a = r < 0.5 ? r * (1 + n) : r + n - r * n,
          u = 2 * r - a;
        (i = t._hue2rgb(u, a, e + 1 / 3)),
          (o = t._hue2rgb(u, a, e)),
          (s = t._hue2rgb(u, a, e - 1 / 3));
      }
      return [Math.round(255 * i), Math.round(255 * o), Math.round(255 * s)];
    }),
    (t._hue2rgb = function (t, e, n) {
      return (
        n < 0 && (n += 1),
        n > 1 && (n -= 1),
        n < 1 / 6
          ? t + 6 * (e - t) * n
          : n < 0.5
          ? e
          : n < 2 / 3
          ? t + (e - t) * (2 / 3 - n) * 6
          : t
      );
    }),
    (t._rgbToHsl = function (t, e, n) {
      assert(
        t >= 0 && t <= 255 && e >= 0 && e <= 255 && n >= 0 && n <= 255,
        'bad RGB values'
      ),
        (t /= 255),
        (e /= 255),
        (n /= 255);
      var r,
        i,
        o = Math.max(t, e, n),
        s = Math.min(t, e, n),
        a = (o + s) / 2;
      if (o == s) r = i = 0;
      else {
        var u = o - s;
        switch (((i = a > 0.5 ? u / (2 - o - s) : u / (o + s)), o)) {
          case t:
            r = (e - n) / u + (e < n ? 6 : 0);
            break;
          case e:
            r = (n - t) / u + 2;
            break;
          case n:
            r = (t - e) / u + 4;
        }
        r /= 6;
      }
      return [r, i, a];
    }),
    (t._rgbToHsb = function (e, n, r) {
      assert(
        e >= 0 && e <= 255 && n >= 0 && n <= 255 && r >= 0 && r <= 255,
        'bad RGB values'
      );
      var i = t._rgbToHsl(e, n, r);
      return t._hslToHsb(i[0], i[1], i[2]);
    }),
    (t._hsbToRgb = function (e, n, r) {
      var i = t._hsbToHsl(e, n, r);
      return t._hslToRgb(i[0], i[1], i[2]);
    }),
    (t._hsbToHsl = function (t, e, n) {
      assert(
        t >= 0 && t <= 1 && e >= 0 && e <= 1 && n >= 0 && n <= 1,
        'bad HSB values'
      );
      var r = clamp((n * (2 - e)) / 2, 0, 1),
        i = 1 - Math.abs(2 * r - 1),
        o = clamp(i > 0 ? (n * e) / i : e, 0, 1);
      return assert(!isNaN(r) && !isNaN(o), 'bad conversion to HSL'), [t, o, r];
    }),
    (t._hslToHsb = function (t, e, n) {
      assert(
        t >= 0 && t <= 1 && e >= 0 && e <= 1 && n >= 0 && n <= 1,
        'bad HSL values'
      );
      var r = clamp(
          1 == n ? 1 : (2 * n + e * (1 - Math.abs(2 * n - 1))) / 2,
          0,
          1
        ),
        i = clamp(r > 0 ? (2 * (r - n)) / r : e, 0, 1);
      return assert(!isNaN(r) && !isNaN(i), 'bad conversion to HSB'), [t, i, r];
    }),
    t
  );
})();
exports.Color = Color;
var Clipboard = (function () {
  function t() {}
  return (
    (t.copy = function (e) {
      t._copyPaste(asString(e), null);
    }),
    (t.paste = function (e) {
      t._copyPaste(null, asFunction(e));
    }),
    (t._copyPaste = function (t, e) {
      for (
        var n = getActiveElement(), r = closest(n, '.wj-control');
        r && Control.getControl(r);

      )
        r = r.parentElement;
      if ((r = r || document.body)) {
        var i = createElement(
          '<textarea class="wj-clipboard" style="position:fixed;opacity:0"/>',
          r
        );
        isString(t) && (i.value = t),
          i.select(),
          (i.onkeydown = function (t) {
            t.preventDefault();
          }),
          setTimeout(function () {
            n.focus(), removeChild(i), isFunction(e) && e(i.value);
          }, Control._CLIPBOARD_DELAY);
      }
    }),
    t
  );
})();
(exports.Clipboard = Clipboard),
  (exports.showPopup = showPopup),
  (exports.hidePopup = hidePopup);
var PrintDocument = (function () {
  function t(t) {
    (this._copyCss = !0), null != t && copy(this, t);
  }
  return (
    Object.defineProperty(t.prototype, 'title', {
      get: function () {
        return this._title;
      },
      set: function (t) {
        this._title = asString(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'copyCss', {
      get: function () {
        return this._copyCss;
      },
      set: function (t) {
        this._copyCss = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.addCSS = function (t) {
      this._css || (this._css = []), this._css.push(t);
    }),
    (t.prototype.append = function (t) {
      var e = this._getDocument(),
        n = e.body,
        r = !1;
      if (n)
        if (isString(t)) n.appendChild(createElement(t));
        else if (t instanceof Node) {
          i = this._cloneNode(t);
          n.appendChild(i);
        } else r = !0;
      else if (isString(t)) e.write(t);
      else if (t instanceof HTMLElement) {
        var i = this._cloneNode(t);
        e.write(i.outerHTML);
      } else r = !0;
      r &&
        assert(!1, 'child parameter should be an HTML node or an HTML string.');
    }),
    (t.prototype.print = function () {
      var t = this;
      this._iframe &&
        (this._close(),
        setTimeout(function () {
          var e = t._iframe.contentWindow,
            n = 'onafterprint' in e && !isFirefox();
          n &&
            (e.onafterprint = function () {
              removeChild(t._iframe), (t._iframe = null);
            }),
            document.queryCommandSupported('print')
              ? e.document.execCommand('print', !1, null)
              : (e.focus(), e.print()),
            n || (removeChild(t._iframe), (t._iframe = null));
        }, 100));
    }),
    (t.prototype._cloneNode = function (t) {
      var e = t.cloneNode(!0);
      return (
        t instanceof HTMLElement &&
          e instanceof HTMLElement &&
          ['select', 'textarea'].forEach(function (n) {
            for (
              var r = t.querySelectorAll(n), i = e.querySelectorAll(n), o = 0;
              o < r.length;
              o++
            )
              i[o].value = r[o].value;
          }),
        e
      );
    }),
    (t.prototype._getDocument = function () {
      return (
        this._iframe ||
          ((this._iframe = document.createElement('iframe')),
          addClass(this._iframe, 'wj-printdocument'),
          setCss(this._iframe, {
            position: 'fixed',
            left: 1e4,
            top: 1e4,
          }),
          document.body.appendChild(this._iframe),
          this._iframe.contentDocument.write(
            '<body style="position:static"/>'
          )),
        this._iframe.contentDocument
      );
    }),
    (t.prototype._close = function () {
      var t = this._getDocument();
      if (
        (t.close(),
        (t.title = null != this.title ? this.title : document.title),
        (t.title && t.title.trim()) || (t.title = ' '),
        this._copyCss)
      ) {
        for (
          var e = document.head.querySelectorAll('link'), n = 0;
          n < e.length;
          n++
        ) {
          var r = e[n];
          if (r.href.match(/\.css$/i) && r.rel.match(/stylesheet/i)) {
            s = httpRequest(r.href, { async: !1 });
            this._addStyle(s.responseText);
          }
        }
        for (
          var i = document.head.querySelectorAll('STYLE'), n = 0;
          n < i.length;
          n++
        )
          this._addStyle(i[n].textContent);
      }
      if (this._css)
        for (n = 0; n < this._css.length; n++) {
          var o = t.createElement('style'),
            s = httpRequest(this._css[n], { async: !1 });
          (o.textContent = s.responseText), t.head.appendChild(o);
        }
    }),
    (t.prototype._addStyle = function (t) {
      var e = this._getDocument(),
        n = e.createElement('style');
      (n.textContent = t), e.head.appendChild(n);
    }),
    t
  );
})();
exports.PrintDocument = PrintDocument;
var _MaskProvider = (function () {
  function t(t, e, n) {
    void 0 === e && (e = null),
      void 0 === n && (n = '_'),
      (this._promptChar = '_'),
      (this._mskArr = []),
      (this._full = !0),
      (this._hbInput = this._input.bind(this)),
      (this._hbKeyDown = this._keydown.bind(this)),
      (this._hbKeyPress = this._keypress.bind(this)),
      (this._hbCompositionStart = this._compositionstart.bind(this)),
      (this._hbCompositionEnd = this._compositionend.bind(this)),
      (this.mask = e),
      (this.input = t),
      (this.promptChar = n),
      this._connect(!0),
      (this._evtInput = document.createEvent('HTMLEvents')),
      this._evtInput.initEvent('input', !0, !1);
  }
  return (
    Object.defineProperty(t.prototype, 'input', {
      get: function () {
        return this._tbx;
      },
      set: function (t) {
        this._connect(!1), (this._tbx = t), this._connect(!0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'mask', {
      get: function () {
        return this._msk;
      },
      set: function (t) {
        t != this._msk &&
          ((this._msk = asString(t, !0)),
          this._parseMask(),
          this._valueChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'promptChar', {
      get: function () {
        return this._promptChar;
      },
      set: function (t) {
        t != this._promptChar &&
          ((this._promptChar = asString(t, !1)),
          assert(
            1 == this._promptChar.length,
            'promptChar must be a string with length 1.'
          ),
          this._valueChanged());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'maskFull', {
      get: function () {
        return this._full;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getMaskRange = function () {
      return this._mskArr.length
        ? [this._firstPos, this._lastPos]
        : [0, this._tbx.value.length - 1];
    }),
    (t.prototype.getRawValue = function () {
      var t = this._tbx.value,
        e = '';
      if (!this.mask) return t;
      for (var n = 0; n < this._mskArr.length && n < t.length; n++)
        this._mskArr[n].literal || t[n] == this._promptChar || (e += t[n]);
      return e;
    }),
    (t.prototype.refresh = function () {
      this._parseMask(), this._valueChanged();
    }),
    (t.prototype._input = function (t) {
      var e = this;
      this._composing
        ? t.stopImmediatePropagation()
        : setTimeout(function () {
            e._valueChanged();
          });
    }),
    (t.prototype._keydown = function (t) {
      if (t.keyCode == Key.Back) {
        var e = this._tbx.selectionStart,
          n = this._tbx.selectionEnd;
        if (e <= this._firstPos && n == e)
          return t.preventDefault(), void (this._backSpace = !1);
      }
      this._backSpace = t.keyCode == Key.Back;
    }),
    (t.prototype._keypress = function (t) {
      t.ctrlKey ||
        t.metaKey ||
        t.altKey ||
        this._composing ||
        !this._preventKey(t.charCode) ||
        t.preventDefault();
    }),
    (t.prototype._compositionstart = function (t) {
      this._composing = !0;
    }),
    (t.prototype._compositionend = function (t) {
      var e = this;
      this._composing &&
        ((this._composing = !1),
        setTimeout(function () {
          e._valueChanged() && e._tbx.dispatchEvent(e._evtInput);
        }));
    }),
    (t.prototype._preventKey = function (t) {
      if (t && this._mskArr.length) {
        var e = this._tbx,
          n = e.selectionStart,
          r = String.fromCharCode(t);
        if (
          (n < this._firstPos && setSelectionRange(e, (n = this._firstPos)),
          n >= this._mskArr.length)
        )
          return !0;
        var i = this._mskArr[n];
        if (i.literal) this._validatePosition(n);
        else if (i.wildCard != r && !this._isCharValid(i.wildCard, r))
          return !0;
      }
      return !1;
    }),
    (t.prototype._connect = function (t) {
      var e = this._tbx;
      e &&
        (t
          ? ((this._autoComplete = e.autocomplete),
            (this._spellCheck = e.spellcheck),
            (e.autocomplete = 'off'),
            (e.spellcheck = !1),
            e.addEventListener('input', this._hbInput),
            e.addEventListener('keydown', this._hbKeyDown, !0),
            e.addEventListener('keypress', this._hbKeyPress, !0),
            e.addEventListener(
              'compositionstart',
              this._hbCompositionStart,
              !0
            ),
            e.addEventListener('compositionend', this._hbCompositionEnd, !0),
            e.addEventListener('blur', this._hbCompositionEnd, !0),
            this._valueChanged())
          : ((e.autocomplete = this._autoComplete),
            (e.spellcheck = this._spellCheck),
            e.removeEventListener('input', this._hbInput),
            e.removeEventListener('keydown', this._hbKeyDown, !0),
            e.removeEventListener('keypress', this._hbKeyPress, !0),
            e.removeEventListener(
              'compositionstart',
              this._hbCompositionStart,
              !0
            ),
            e.removeEventListener('compositionend', this._hbCompositionEnd, !0),
            e.removeEventListener('blur', this._hbCompositionEnd, !0)));
    }),
    (t.prototype._valueChanged = function () {
      if (!this._tbx || !this._msk) return !1;
      var t = this._tbx,
        e = t.value.length < 2,
        n = t.selectionStart,
        r = n > 0 ? t.value[n - 1] : '',
        i = t.value;
      (t.value = this._applyMask()), e && (n = this._firstPos + 1);
      var o = n > 0 ? t.value[n - 1] : '';
      return (
        n > 0 && o == this._promptChar && r != this.promptChar && n--,
        n == i.length && (n = this._matchEnd),
        this._validatePosition(n),
        i != t.value
      );
    }),
    (t.prototype._applyMask = function () {
      (this._full = !0), (this._matchEnd = 0);
      var t = this._tbx.value;
      if (!this._msk) return t;
      if (!t && !this._tbx.required) return t;
      var e = '',
        n = 0,
        r = this._promptChar;
      t = this._handleVagueLiterals(t);
      for (var i = 0; i < this._mskArr.length; i++) {
        var o = this._mskArr[i],
          s = o.literal;
        if ((s && s == t[n] && n++, o.wildCard)) {
          if (((s = r), t)) {
            for (var a = n; a < t.length; a++)
              if (this._isCharValid(o.wildCard, t[a])) {
                switch (((s = t[a]), o.charCase)) {
                  case '>':
                    s = s.toUpperCase();
                    break;
                  case '<':
                    s = s.toLowerCase();
                }
                s != r && (this._matchEnd = e.length + 1);
                break;
              }
            n = a + 1;
          }
          s == r && (this._full = !1);
        }
        e += s;
      }
      return e;
    }),
    (t.prototype._handleVagueLiterals = function (t) {
      if (t.length > this._mskArr.length + 1) return t;
      var e = t.length - this._mskArr.length;
      if (0 != e && t.length > 1) {
        for (
          var n = -1, r = Math.max(0, this._tbx.selectionStart - e);
          r < this._mskArr.length;
          r++
        )
          if (this._mskArr[r].vague) {
            n = r;
            break;
          }
        if (n > -1)
          if (e < 0) {
            var i = Array(1 - e).join(this._promptChar),
              o = n + e;
            o > -1 && (t = t.substr(0, o) + i + t.substr(o));
          } else {
            for (; n > 0 && this._mskArr[n - 1].literal; ) n--;
            t = t.substr(0, n) + t.substr(n + e);
          }
      }
      return t;
    }),
    (t.prototype._isCharValid = function (e, n) {
      var r = this._promptChar;
      switch (e) {
        case '0':
          return (n >= '0' && n <= '9') || n == r;
        case '9':
          return (n >= '0' && n <= '9') || ' ' == n || n == r;
        case '#':
          return (
            (n >= '0' && n <= '9') || ' ' == n || '+' == n || '-' == n || n == r
          );
        case 'L':
          return (n >= 'a' && n <= 'z') || (n >= 'A' && n <= 'Z') || n == r;
        case 'l':
          return (
            (n >= 'a' && n <= 'z') ||
            (n >= 'A' && n <= 'Z') ||
            ' ' == n ||
            n == r
          );
        case 'A':
          return (
            (n >= '0' && n <= '9') ||
            (n >= 'a' && n <= 'z') ||
            (n >= 'A' && n <= 'Z') ||
            n == r
          );
        case 'a':
          return (
            (n >= '0' && n <= '9') ||
            (n >= 'a' && n <= 'z') ||
            (n >= 'A' && n <= 'Z') ||
            ' ' == n ||
            n == r
          );
        case '９':
          return (n >= '０' && n <= '９') || n == r;
        case 'Ｊ':
        case 'Ｇ':
          return (
            !('Ｇ' == e && t._X_DBCS_BIG_HIRA.indexOf(n) > -1) &&
            ((n >= 'ぁ' && n <= 'ゖ') || n == r)
          );
        case 'Ｋ':
        case 'Ｎ':
          return (
            !('Ｎ' == e && t._X_DBCS_BIG_KATA.indexOf(n) > -1) &&
            ((n >= 'ァ' && n <= 'ヺ') || n == r)
          );
        case 'Ｚ':
          return n <= '!' || n >= 'ÿ' || n == r;
        case 'H':
          return (n >= '!' && n <= 'ÿ') || n == r;
        case 'K':
        case 'N':
          return (
            !('N' == e && t._X_SBCS_BIG_KATA.indexOf(n) > -1) &&
            ((n >= 'ｦ' && n <= 'ﾟ') || n == r)
          );
      }
      return !1;
    }),
    (t.prototype._validatePosition = function (t) {
      var e = this._mskArr;
      if (this._backSpace)
        for (; t > 0 && t < e.length && e[t - 1].literal; ) t--;
      if (0 == t || !this._backSpace)
        for (; t < e.length && e[t].literal; ) t++;
      getActiveElement() == this._tbx && setSelectionRange(this._tbx, t),
        (this._backSpace = !1);
    }),
    (t.prototype._parseMask = function () {
      (this._mskArr = []), (this._firstPos = -1), (this._lastPos = -1);
      for (var t, e = this._msk, n = '|', r = 0; e && r < e.length; r++)
        switch (e[r]) {
          case '0':
          case '9':
          case '#':
          case 'A':
          case 'a':
          case 'L':
          case 'l':
          case '９':
          case 'Ｊ':
          case 'Ｇ':
          case 'Ｋ':
          case 'Ｎ':
          case 'Ｚ':
          case 'K':
          case 'N':
          case 'H':
            this._firstPos < 0 && (this._firstPos = this._mskArr.length),
              (this._lastPos = this._mskArr.length),
              this._mskArr.push(new _MaskElement(e[r], n));
            break;
          case '.':
          case ',':
          case ':':
          case '/':
          case '$':
            switch (e[r]) {
              case '.':
              case ',':
                t = exports.culture.Globalize.numberFormat[e[r]];
                break;
              case ':':
              case '/':
                t = exports.culture.Globalize.calendar[e[r]];
                break;
              case '$':
                t = exports.culture.Globalize.numberFormat.currency.symbol;
            }
            for (o = 0; o < t.length; o++)
              this._mskArr.push(new _MaskElement(t[o]));
            break;
          case '<':
          case '>':
          case '|':
            n = e[r];
            break;
          case '\\':
            r < e.length - 1 && r++, this._mskArr.push(new _MaskElement(e[r]));
            break;
          default:
            this._mskArr.push(new _MaskElement(e[r]));
        }
      for (r = 0; r < this._mskArr.length; r++) {
        var i = this._mskArr[r];
        if (i.literal)
          for (var o = 0; o < r; o++) {
            var s = this._mskArr[o];
            if (s.wildCard && this._isCharValid(s.wildCard, i.literal)) {
              i.vague = !0;
              break;
            }
          }
      }
    }),
    (t._X_DBCS_BIG_HIRA = 'ぁぃぅぇぉっゃゅょゎゕゖ'),
    (t._X_DBCS_BIG_KATA = 'ァィゥェォッャュョヮヵヶ'),
    (t._X_SBCS_BIG_KATA = 'ｧｨｩｪｫｬｭｮｯ'),
    t
  );
})();
exports._MaskProvider = _MaskProvider;
var _MaskElement = (function () {
  return function (t, e) {
    e ? ((this.wildCard = t), (this.charCase = e)) : (this.literal = t);
  };
})();
exports._MaskElement = _MaskElement;
var _ClickRepeater = (function () {
  function t(t) {
    (this._isDown = !1),
      (this._mousedownBnd = this._mousedown.bind(this)),
      (this._mouseupBnd = this._mouseup.bind(this)),
      (this._onClickBnd = this._onClick.bind(this)),
      (this.element = t),
      this._connect(!0);
  }
  return (
    Object.defineProperty(t.prototype, 'element', {
      get: function () {
        return this._e;
      },
      set: function (t) {
        this._connect(!1),
          (this._e = asType(t, HTMLElement, !0)),
          this._connect(!0);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'disabled', {
      get: function () {
        return this._disabled;
      },
      set: function (t) {
        this._disabled = asBoolean(t);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype._connect = function (t) {
      if (this._e) {
        t
          ? this._e.addEventListener('mousedown', this._mousedownBnd)
          : this._e.removeEventListener('mousedown', this._mousedownBnd);
      }
    }),
    (t.prototype._clearTimeouts = function () {
      this._toRepeat &&
        (clearInterval(this._toRepeat), (this._toRepeat = null)),
        this._toDelay && (clearInterval(this._toDelay), (this._toDelay = null));
    }),
    (t.prototype._mousedown = function (e) {
      var n = this;
      this._isDown && this._mouseup(null),
        this._disabled ||
          ((this._isDown = !0),
          t._stopEvents.forEach(function (t) {
            document.addEventListener(t, n._mouseupBnd);
          }),
          this._clearTimeouts(),
          (this._toDelay = setTimeout(function () {
            n._isDown &&
              (n._onClick(),
              (n._toRepeat = setTimeout(n._onClickBnd, Control._CLICK_REPEAT)));
          }, Control._CLICK_DELAY)));
    }),
    (t.prototype._mouseup = function (e) {
      var n = this;
      this._isDown && e && 'mouseup' == e.type && e.preventDefault(),
        t._stopEvents.forEach(function (t) {
          document.removeEventListener(t, n._mouseupBnd);
        }),
        this._clearTimeouts(),
        (this._isDown = !1);
    }),
    (t.prototype._onClick = function () {
      this._e.click(),
        this._clearTimeouts(),
        this._isDown &&
          (this._toRepeat = setTimeout(
            this._onClickBnd,
            Control._CLICK_REPEAT
          ));
    }),
    (t._stopEvents = ['mouseup', 'mouseout', 'keydown']),
    t
  );
})();
exports._ClickRepeater = _ClickRepeater;
var _isMobile =
  null !=
  navigator.userAgent.match(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i
  );
exports.isMobile = isMobile;
var _isFF = null != navigator.userAgent.match(/Firefox\//);
exports.isFirefox = isFirefox;
var _isSafari =
  null != navigator.userAgent.match(/^((?!chrome|android).)*safari/i);
exports.isSafari = isSafari;
var _isIE = null != navigator.userAgent.match(/MSIE |Trident\/|Edge\//);
exports.isIE = isIE;
var _isIE9 = !1;
exports.isIE9 = isIE9;
var _supportsPassive = !1;
document.addEventListener('test', function (t) {}, {
  get passive() {
    return (_supportsPassive = !0), !0;
  },
}),
  (exports.getEventOptions = getEventOptions),
  (exports._startDrag = _startDrag),
  document.doctype &&
    navigator.appVersion.indexOf('MSIE 9') > -1 &&
    ((_isIE9 = !0),
    document.addEventListener('mousemove', function (t) {
      if (1 == t.which) {
        var e = closest(t.target, '.wj-control');
        if (e && !e.style.cursor)
          for (var n = t.target; n; n = n.parentNode)
            if (n.attributes && n.attributes.draggable) return n.dragDrop(), !1;
      }
    }));
var raf = 'requestAnimationFrame',
  caf = 'cancelAnimationFrame';
if (!window[raf]) {
  var expectedTime_1 = 0;
  (window[raf] = function (t) {
    var e = Date.now(),
      n = 16 - (e - expectedTime_1),
      r = n > 0 ? n : 0;
    return (
      (expectedTime_1 = e + r),
      setTimeout(function () {
        t(expectedTime_1);
      }, r)
    );
  }),
    (window[caf] = clearTimeout);
}
