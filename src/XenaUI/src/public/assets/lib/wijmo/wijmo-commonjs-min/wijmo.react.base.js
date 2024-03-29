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
      function r() {
        this.constructor = t;
      }
      e(t, o),
        (t.prototype =
          null === o
            ? Object.create(o)
            : ((r.prototype = o.prototype), new r()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.react.base');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.react = window.wijmo.react || {}),
  (window.wijmo.react.base = wjcSelf);
var ReactDOM = require('react-dom'),
  React = require('react'),
  ComponentBase = (function (e) {
    function t(t, o, r) {
      var n = e.call(this, t) || this;
      (n._objPropHash = {}), (n.props = t), (n.controlType = o);
      for (var i = 0, s = (r && r.objectProps) || []; i < s.length; i++) {
        var a = s[i];
        n._objPropHash[a] = !0;
      }
      return n;
    }
    return (
      __extends(t, e),
      (t.prototype.render = function () {
        return React.createElement('div');
      }),
      (t.prototype.componentDidMount = function () {
        var e = ReactDOM.findDOMNode(this),
          t = new this.controlType(e),
          o = this.props,
          r = {};
        for (var n in o)
          if (n in t) r[n] = o[n];
          else
            switch (n) {
              case 'className':
                wjcCore.addClass(e, o.className);
                break;
              case 'style':
                wjcCore.setCss(e, o.style);
                break;
              default:
                null != e[n] && (e[n] = o[n]);
            }
        return (
          t.initialize(r),
          wjcCore.isFunction(o.initialized) && o.initialized(t),
          t
        );
      }),
      (t.prototype.componentWillUnmount = function () {
        this._getControl(this).dispose();
      }),
      (t.prototype.shouldComponentUpdate = function (e) {
        var t = this._getControl(this);
        return this._copy(t, e), !0;
      }),
      (t.prototype._getControl = function (e) {
        var t = ReactDOM.findDOMNode(e);
        return wjcCore.Control.getControl(t);
      }),
      (t.prototype._copy = function (e, t) {
        if (e && t) {
          var o;
          for (var r in t) {
            var n = t[r];
            if (
              (r in e || 'className' == r || 'style' == r) &&
              !this._isEvent(e, r) &&
              !this._sameValue(e[r], n)
            )
              if (null == n) e[r] = n;
              else if ('className' == r)
                e.hostElement && wjcCore.addClass(e.hostElement, t[r]);
              else if ('style' == r)
                e.hostElement && wjcCore.setCss(e.hostElement, t[r]);
              else if (
                wjcCore.isPrimitive(n) ||
                (this._objPropHash[r] &&
                  e === (o || (o = this._getControl(this))))
              )
                e[r] = n;
              else if (wjcCore.isArray(n) && wjcCore.isArray(e[r])) {
                var i = e[r],
                  s = n;
                if (s.length == i.length)
                  for (var a = 0; a < s.length; a++) this._copy(i[a], s[a]);
              } else wjcCore.isObject(n) && this._copy(e[r], t[r]);
          }
        }
      }),
      (t.prototype._sameValue = function (e, t) {
        return e == t || wjcCore.DateTime.equals(e, t);
      }),
      (t.prototype._isEvent = function (e, t) {
        var o = e && e[t];
        return null != o && o instanceof wjcCore.Event;
      }),
      t
    );
  })(React.Component);
exports.ComponentBase = ComponentBase;
