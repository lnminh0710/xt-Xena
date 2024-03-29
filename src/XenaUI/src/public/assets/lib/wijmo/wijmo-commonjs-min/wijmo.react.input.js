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
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
      };
    return function (t, n) {
      function o() {
        this.constructor = t;
      }
      e(t, n),
        (t.prototype =
          null === n
            ? Object.create(n)
            : ((o.prototype = n.prototype), new o()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcReactBase = require('wijmo/wijmo.react.base'),
  wjcInput = require('wijmo/wijmo.input'),
  wjcSelf = require('wijmo/wijmo.react.input');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.react = window.wijmo.react || {}),
  (window.wijmo.react.input = wjcSelf);
var React = require('react'),
  ComboBox = (function (e) {
    function t(t) {
      return (
        e.call(this, t, wjcInput.ComboBox, {
          objectProps: ['itemsSource', 'selectedItem', 'selectedValue'],
        }) || this
      );
    }
    return __extends(t, e), t;
  })(wjcReactBase.ComponentBase);
exports.ComboBox = ComboBox;
var AutoComplete = (function (e) {
  function t(t) {
    return (
      e.call(this, t, wjcInput.AutoComplete, {
        objectProps: ['itemsSource', 'selectedItem', 'selectedValue'],
      }) || this
    );
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.AutoComplete = AutoComplete;
var Calendar = (function (e) {
  function t(t) {
    return e.call(this, t, wjcInput.Calendar) || this;
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.Calendar = Calendar;
var ColorPicker = (function (e) {
  function t(t) {
    return (
      e.call(this, t, wjcInput.ColorPicker, {
        objectProps: ['palette'],
      }) || this
    );
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.ColorPicker = ColorPicker;
var InputMask = (function (e) {
  function t(t) {
    return e.call(this, t, wjcInput.InputMask) || this;
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.InputMask = InputMask;
var InputColor = (function (e) {
  function t(t) {
    return e.call(this, t, wjcInput.InputColor) || this;
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.InputColor = InputColor;
var MultiSelect = (function (e) {
  function t(t) {
    return (
      e.call(this, t, wjcInput.MultiSelect, {
        objectProps: [
          'itemsSource',
          'selectedItem',
          'selectedValue',
          'checkedItems',
        ],
      }) || this
    );
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.MultiSelect = MultiSelect;
var MultiAutoComplete = (function (e) {
  function t(t) {
    return (
      e.call(this, t, wjcInput.MultiAutoComplete, {
        objectProps: [
          'itemsSource',
          'selectedItem',
          'selectedValue',
          'selectedItems',
        ],
      }) || this
    );
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.MultiAutoComplete = MultiAutoComplete;
var InputNumber = (function (e) {
  function t(t) {
    return e.call(this, t, wjcInput.InputNumber) || this;
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.InputNumber = InputNumber;
var InputDate = (function (e) {
  function t(t) {
    return e.call(this, t, wjcInput.InputDate) || this;
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.InputDate = InputDate;
var InputTime = (function (e) {
  function t(t) {
    return (
      e.call(this, t, wjcInput.InputTime, {
        objectProps: ['itemsSource', 'selectedItem', 'selectedValue'],
      }) || this
    );
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.InputTime = InputTime;
var InputDateTime = (function (e) {
  function t(t) {
    return e.call(this, t, wjcInput.InputDateTime) || this;
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.InputDateTime = InputDateTime;
var ListBox = (function (e) {
  function t(t) {
    return (
      e.call(this, t, wjcInput.ListBox, {
        objectProps: [
          'itemsSource',
          'selectedItem',
          'selectedValue',
          'checkedItems',
        ],
      }) || this
    );
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.ListBox = ListBox;
var Menu = (function (e) {
  function t(t) {
    return (
      e.call(this, t, wjcInput.Menu, {
        objectProps: ['itemsSource', 'selectedItem', 'selectedValue', 'value'],
      }) || this
    );
  }
  return __extends(t, e), t;
})(wjcReactBase.ComponentBase);
exports.Menu = Menu;
var Popup = (function (e) {
  function t(t) {
    return e.call(this, t, wjcInput.Popup) || this;
  }
  return (
    __extends(t, e),
    (t.prototype.render = function () {
      return React.createElement('div', null, this.props.children);
    }),
    t
  );
})(wjcReactBase.ComponentBase);
exports.Popup = Popup;
var Wj = wjcReactBase;
