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
"use strict";
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
                for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
            };
        return function (t, i) {
            function o() {
                this.constructor = t;
            }
            e(t, i),
                (t.prototype =
                    null === i
                        ? Object.create(i)
                        : ((o.prototype = i.prototype), new o()));
        };
    })();
Object.defineProperty(exports, "__esModule", { value: !0 });
var wjcCore = require("wijmo/wijmo"),
    wjcSelf = require("wijmo/wijmo.input");
(window.wijmo = window.wijmo || {}), (window.wijmo.input = wjcSelf);
var DropDown = (function (e) {
    function t(t, i) {
        var o = e.call(this, t, null, !0) || this;
        (o._showBtn = !0),
            (o._autoExpand = !0),
            (o._animate = !1),
            (o.textChanged = new wjcCore.Event()),
            (o.isDroppedDownChanging = new wjcCore.Event()),
            (o.isDroppedDownChanged = new wjcCore.Event());
        var n = o.getTemplate();
        o.applyTemplate(
            "wj-control wj-dropdown wj-content",
            n,
            { _tbx: "input", _btn: "btn", _dropDown: "dropdown" },
            "input"
        );
        var s = o._tbx;
        (o._elRef = s),
            "autocomplete,autocorrect,autocapitalize,spellcheck"
                .split(",")
                .forEach(function (e) {
                    s.hasAttribute(e) ||
                        s.setAttribute(e, "spellcheck" == e ? "false" : "off");
                }),
            o._createDropDown(),
            o._updateBtn(),
            wjcCore.removeChild(o._dropDown),
            wjcCore.addClass(o.hostElement, "wj-state-collapsed");
        var r = o._updateFocusState.bind(o);
        o.addEventListener(o.dropDown, "blur", r, !0),
            o.addEventListener(o.dropDown, "focus", r);
        var a = o._keydown.bind(o);
        return (
            o.addEventListener(o.hostElement, "keydown", a),
            o.addEventListener(o.dropDown, "keydown", a),
            o.addEventListener(s, "keypress", function (e) {
                9787 == e.keyCode && o._altDown && e.preventDefault();
            }),
            o.addEventListener(s, "input", function () {
                o._setText(o.text, !1);
            }),
            o.addEventListener(s, "click", function () {
                o._autoExpand && o._expandSelection();
            }),
            wjcCore.isIE9() &&
                o.addEventListener(s, "keyup", function () {
                    o._setText(o.text, !1);
                }),
            o.addEventListener(o._btn, "mousedown", function (e) {
                setTimeout(function () {
                    o._btnclick(e);
                });
            }),
            o.addEventListener(o._dropDown, "click", function (e) {
                e.stopPropagation();
            }),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "text", {
            get: function () {
                return this._tbx.value;
            },
            set: function (e) {
                e != this.text && this._setText(e, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "inputElement", {
            get: function () {
                return this._tbx;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isReadOnly", {
            get: function () {
                return this._tbx.readOnly;
            },
            set: function (e) {
                (this._tbx.readOnly = wjcCore.asBoolean(e)),
                    wjcCore.toggleClass(
                        this.hostElement,
                        "wj-state-readonly",
                        this.isReadOnly
                    );
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isRequired", {
            get: function () {
                return this._tbx.required;
            },
            set: function (e) {
                this._tbx.required = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "placeholder", {
            get: function () {
                return this._tbx.placeholder;
            },
            set: function (e) {
                this._tbx.placeholder = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isDroppedDown", {
            get: function () {
                var e = this._dropDown;
                return e && "none" != e.style.display;
            },
            set: function (e) {
                if (
                    (e =
                        wjcCore.asBoolean(e) &&
                        !this.isDisabled &&
                        !this.isReadOnly) != this.isDroppedDown &&
                    this.onIsDroppedDownChanging(new wjcCore.CancelEventArgs())
                ) {
                    var t = this.hostElement,
                        i = this._dropDown;
                    if (e)
                        i.style.minWidth ||
                            (i.style.minWidth =
                                t.getBoundingClientRect().width + "px"),
                            (i.style.display = "block"),
                            this._updateDropDown();
                    else {
                        var o = this.containsFocus();
                        wjcCore.hidePopup(i),
                            o &&
                                (this.isTouching && this.showDropDownButton
                                    ? this.focus()
                                    : this.selectAll());
                    }
                    this._updateFocusState(),
                        wjcCore.toggleClass(
                            t,
                            "wj-state-collapsed",
                            !this.isDroppedDown
                        ),
                        this.onIsDroppedDownChanged();
                }
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dropDown", {
            get: function () {
                return this._dropDown;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dropDownCssClass", {
            get: function () {
                return this._cssClass;
            },
            set: function (e) {
                e != this._cssClass &&
                    (wjcCore.removeClass(this._dropDown, this._cssClass),
                    (this._cssClass = wjcCore.asString(e)),
                    wjcCore.addClass(this._dropDown, this._cssClass));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "showDropDownButton", {
            get: function () {
                return this._showBtn;
            },
            set: function (e) {
                (this._showBtn = wjcCore.asBoolean(e)), this._updateBtn();
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "autoExpandSelection", {
            get: function () {
                return this._autoExpand;
            },
            set: function (e) {
                this._autoExpand = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isAnimated", {
            get: function () {
                return this._animate;
            },
            set: function (e) {
                this._animate = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.selectAll = function () {
            this._elRef == this._tbx
                ? wjcCore.setSelectionRange(this._tbx, 0, this.text.length)
                : this.containsFocus() || this.focus();
        }),
        (t.prototype.onTextChanged = function (e) {
            this.textChanged.raise(this, e), this._updateState();
        }),
        (t.prototype.onIsDroppedDownChanging = function (e) {
            return this.isDroppedDownChanging.raise(this, e), !e.cancel;
        }),
        (t.prototype.onIsDroppedDownChanged = function (e) {
            this.isDroppedDownChanged.raise(this, e);
        }),
        (t.prototype.onGotFocus = function (t) {
            this.isTouching ||
                wjcCore.contains(this._dropDown, wjcCore.getActiveElement()) ||
                this.selectAll(),
                e.prototype.onGotFocus.call(this, t);
        }),
        (t.prototype.onLostFocus = function (t) {
            this._commitText(),
                this.containsFocus() || (this.isDroppedDown = !1),
                e.prototype.onLostFocus.call(this, t);
        }),
        (t.prototype.containsFocus = function () {
            return (
                e.prototype.containsFocus.call(this) ||
                (this.isDroppedDown &&
                    wjcCore.contains(
                        this._dropDown,
                        wjcCore.getActiveElement()
                    ))
            );
        }),
        (t.prototype.dispose = function () {
            this.isDroppedDown = !1;
            var t = this.dropDown;
            if (t) {
                var i = wjcCore.Control.getControl(t);
                i && i.dispose(), wjcCore.removeChild(t);
            }
            e.prototype.dispose.call(this);
        }),
        (t.prototype.refresh = function (t) {
            if (
                (void 0 === t && (t = !0),
                e.prototype.refresh.call(this, t),
                this.isDroppedDown &&
                    "none" != getComputedStyle(this.hostElement).display)
            ) {
                var i = wjcCore.getActiveElement();
                wjcCore.showPopup(
                    this._dropDown,
                    this.hostElement,
                    !1,
                    !1,
                    null == this.dropDownCssClass
                ),
                    i instanceof HTMLElement &&
                        i != wjcCore.getActiveElement() &&
                        i.focus();
            }
        }),
        (t.prototype._handleResize = function () {
            this.isDroppedDown && this.refresh();
        }),
        (t.prototype._expandSelection = function () {
            var e = this._tbx,
                t = e.value,
                i = e.selectionStart,
                o = e.selectionEnd;
            if (t && i == o) {
                var n = this._getCharType(t, i);
                if (n > -1) {
                    for (; o < t.length && this._getCharType(t, o) == n; o++);
                    for (; i > 0 && this._getCharType(t, i - 1) == n; i--);
                    i != o && wjcCore.setSelectionRange(e, i, o);
                }
            }
        }),
        (t.prototype._getCharType = function (e, t) {
            var i = e[t];
            return i >= "0" && i <= "9"
                ? 0
                : (i >= "a" && i <= "z") || (i >= "A" && i <= "Z")
                ? 1
                : -1;
        }),
        (t.prototype._keydown = function (e) {
            if (((this._altDown = e.altKey), !e.defaultPrevented))
                switch (e.keyCode) {
                    case wjcCore.Key.Tab:
                    case wjcCore.Key.Escape:
                    case wjcCore.Key.Enter:
                        this.isDroppedDown &&
                            ((this.isDroppedDown = !1),
                            e.keyCode == wjcCore.Key.Tab ||
                                this.containsFocus() ||
                                this.focus(),
                            e.preventDefault());
                        break;
                    case wjcCore.Key.F4:
                    case wjcCore.Key.Up:
                    case wjcCore.Key.Down:
                        if (
                            (e.keyCode == wjcCore.Key.F4 || e.altKey) &&
                            wjcCore.contains(document.body, this.hostElement)
                        ) {
                            var t = this.isDroppedDown;
                            (this.isDroppedDown = !t),
                                this.isDroppedDown == !t && e.preventDefault();
                        }
                }
        }),
        (t.prototype._btnclick = function (e) {
            e.defaultPrevented || (this.isDroppedDown = !this.isDroppedDown);
        }),
        (t.prototype._setText = function (e, t) {
            null == e && (e = ""),
                (e = e.toString()) != this._tbx.value && (this._tbx.value = e),
                e != this._oldText &&
                    ((this._oldText = e), this.onTextChanged());
        }),
        (t.prototype._updateBtn = function () {
            (this._btn.tabIndex = -1),
                (this._btn.style.display = this._showBtn ? "" : "none");
        }),
        (t.prototype._createDropDown = function () {}),
        (t.prototype._commitText = function () {}),
        (t.prototype._updateDropDown = function () {
            this.isDroppedDown &&
                (this._commitText(),
                wjcCore.showPopup(
                    this._dropDown,
                    this.hostElement,
                    !1,
                    this._animate,
                    null == this.dropDownCssClass
                ));
        }),
        (t.controlTemplate =
            '<div style="position:relative" class="wj-template"><div class="wj-input"><div class="wj-input-group wj-input-btn-visible"><input wj-part="input" type="text" class="wj-form-control" /><span wj-part="btn" class="wj-input-group-btn" tabindex="-1"><button class="wj-btn wj-btn-default" type="button" tabindex="-1"><span class="wj-glyph-down"></span></button></span></div></div><div wj-part="dropdown" class="wj-dropdown-panel wj-content" style="display:none"></div></div>'),
        t
    );
})(wjcCore.Control);
exports.DropDown = DropDown;
var DateSelectionMode;
!(function (e) {
    (e[(e.None = 0)] = "None"),
        (e[(e.Day = 1)] = "Day"),
        (e[(e.Month = 2)] = "Month");
})(
    (DateSelectionMode =
        exports.DateSelectionMode || (exports.DateSelectionMode = {}))
);
var Calendar = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        return (
            (o._readOnly = !1),
            (o._selMode = DateSelectionMode.Day),
            (o._fmtYrMo = "y"),
            (o._fmtYr = "yyyy"),
            (o._fmtDayHdr = "ddd"),
            (o._fmtDay = "d "),
            (o._fmtMonths = "MMM"),
            (o.valueChanged = new wjcCore.Event()),
            (o.displayMonthChanged = new wjcCore.Event()),
            (o.formatItem = new wjcCore.Event()),
            (o._value = wjcCore.DateTime.newDate()),
            (o._currMonth = o._getMonth(o._value)),
            o._createChildren(),
            o.refresh(!0),
            o.addEventListener(o.hostElement, "mouseup", o._click.bind(o)),
            o.addEventListener(o.hostElement, "keydown", o._keydown.bind(o)),
            o.initialize(i),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (e) {
                (e = wjcCore.asDate(e, !0)),
                    (e = this._clamp(e)),
                    this._valid(e) &&
                        ((this.displayMonth = this._getMonth(e)),
                        wjcCore.DateTime.equals(this._value, e) ||
                            ((this._value = e),
                            this.invalidate(!1),
                            this.onValueChanged()));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "min", {
            get: function () {
                return this._min;
            },
            set: function (e) {
                e != this.min &&
                    ((this._min = wjcCore.asDate(e, !0)), this.refresh());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "max", {
            get: function () {
                return this._max;
            },
            set: function (e) {
                e != this.max &&
                    ((this._max = wjcCore.asDate(e, !0)), this.refresh());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectionMode", {
            get: function () {
                return this._selMode;
            },
            set: function (e) {
                if (e != this._selMode) {
                    this._selMode = wjcCore.asEnum(e, DateSelectionMode);
                    var t = this._monthMode();
                    t && (this.monthView = !1);
                    var i = this._btnMth.querySelector(".wj-glyph-down");
                    i && (i.style.display = t ? "none" : ""), this.refresh();
                }
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isReadOnly", {
            get: function () {
                return this._readOnly;
            },
            set: function (e) {
                (this._readOnly = wjcCore.asBoolean(e)),
                    wjcCore.toggleClass(
                        this.hostElement,
                        "wj-state-readonly",
                        this.isReadOnly
                    );
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "firstDayOfWeek", {
            get: function () {
                return this._fdw;
            },
            set: function (e) {
                if (e != this._fdw) {
                    if ((e = wjcCore.asNumber(e, !0)) && (e > 6 || e < 0))
                        throw "firstDayOfWeek must be between 0 and 6 (Sunday to Saturday).";
                    (this._fdw = e), this.refresh();
                }
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "displayMonth", {
            get: function () {
                return this._currMonth;
            },
            set: function (e) {
                wjcCore.DateTime.equals(this.displayMonth, e) ||
                    ((e = wjcCore.asDate(e)),
                    (this.monthView
                        ? this._monthInValidRange(e)
                        : this._yearInValidRange(e)) &&
                        ((this._currMonth = this._getMonth(this._clamp(e))),
                        this.invalidate(!0),
                        this.onDisplayMonthChanged()));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "formatYearMonth", {
            get: function () {
                return this._fmtYrMo;
            },
            set: function (e) {
                e != this._fmtYrMo &&
                    ((this._fmtYrMo = wjcCore.asString(e)), this.invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "formatDayHeaders", {
            get: function () {
                return this._fmtDayHdr;
            },
            set: function (e) {
                e != this._fmtDayHdr &&
                    ((this._fmtDayHdr = wjcCore.asString(e)),
                    this.invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "formatDays", {
            get: function () {
                return this._fmtDay;
            },
            set: function (e) {
                e != this._fmtDay &&
                    ((this._fmtDay = wjcCore.asString(e)), this.invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "formatYear", {
            get: function () {
                return this._fmtYr;
            },
            set: function (e) {
                e != this._fmtYr &&
                    ((this._fmtYr = wjcCore.asString(e)), this.invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "formatMonths", {
            get: function () {
                return this._fmtMonths;
            },
            set: function (e) {
                e != this._fmtMonths &&
                    ((this._fmtMonths = wjcCore.asString(e)),
                    this.invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "showHeader", {
            get: function () {
                return "none" != this._tbHdr.style.display;
            },
            set: function (e) {
                this._tbHdr.style.display = wjcCore.asBoolean(e) ? "" : "none";
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "monthView", {
            get: function () {
                return "none" != this._tbMth.style.display;
            },
            set: function (e) {
                e != this.monthView &&
                    ((this._tbMth.style.display = e ? "" : "none"),
                    (this._tbYr.style.display = e ? "none" : ""));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "itemFormatter", {
            get: function () {
                return this._itemFormatter;
            },
            set: function (e) {
                e != this._itemFormatter &&
                    ((this._itemFormatter = wjcCore.asFunction(e)),
                    this.invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "itemValidator", {
            get: function () {
                return this._itemValidator;
            },
            set: function (e) {
                e != this._itemValidator &&
                    ((this._itemValidator = wjcCore.asFunction(e)),
                    this.invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.onValueChanged = function (e) {
            this.valueChanged.raise(this, e);
        }),
        (t.prototype.onDisplayMonthChanged = function (e) {
            this.displayMonthChanged.raise(this, e);
        }),
        (t.prototype.onFormatItem = function (e) {
            this.formatItem.raise(this, e);
        }),
        (t.prototype.refresh = function (t) {
            void 0 === t && (t = !0);
            var i,
                o,
                n,
                s = this.displayMonth,
                r =
                    null != this.firstDayOfWeek
                        ? this.firstDayOfWeek
                        : wjcCore.Globalize.getFirstDayOfWeek();
            e.prototype.refresh.call(this, t),
                (this._firstDay = wjcCore.DateTime.addDays(
                    s,
                    -(s.getDay() - r + 7) % 7
                )),
                wjcCore.setText(
                    this._spMth,
                    wjcCore.Globalize.format(s, this._fmtYrMo)
                ),
                (i = this._tbMth.querySelectorAll("td"));
            for (h = 0; h < 7 && h < i.length; h++)
                (n = wjcCore.DateTime.addDays(this._firstDay, h)),
                    wjcCore.setText(
                        i[h],
                        wjcCore.Globalize.format(n, this._fmtDayHdr)
                    );
            for (h = 7; h < i.length; h++) {
                (o = i[h]),
                    (n = wjcCore.DateTime.addDays(this._firstDay, h - 7)),
                    wjcCore.setText(
                        o,
                        wjcCore.Globalize.format(n, this._fmtDay)
                    );
                var a = !this._valid(n);
                if (
                    (wjcCore.toggleClass(o, "wj-state-invalid", a),
                    wjcCore.toggleClass(
                        o,
                        "wj-state-selected",
                        this._selMode &&
                            wjcCore.DateTime.sameDate(n, this.value)
                    ),
                    wjcCore.toggleClass(
                        o,
                        "wj-day-today",
                        wjcCore.DateTime.sameDate(n, wjcCore.DateTime.newDate())
                    ),
                    wjcCore.toggleClass(
                        o,
                        "wj-day-othermonth",
                        a ||
                            n.getMonth() != s.getMonth() ||
                            !this._inValidRange(n)
                    ),
                    this.itemFormatter && this.itemFormatter(n, o),
                    this.formatItem.hasHandlers)
                ) {
                    var l = new FormatItemEventArgs(h, n, o);
                    this.onFormatItem(l);
                }
            }
            var c = this._tbMth.querySelectorAll("tr");
            c.length &&
                ((n = wjcCore.DateTime.addDays(this._firstDay, 28)),
                (c[c.length - 2].style.display =
                    n.getMonth() == s.getMonth() ? "" : "none"),
                (n = wjcCore.DateTime.addDays(this._firstDay, 35)),
                (c[c.length - 1].style.display =
                    n.getMonth() == s.getMonth() ? "" : "none")),
                (i = this._tbYr.querySelectorAll("td")).length &&
                    wjcCore.setText(
                        i[0],
                        wjcCore.Globalize.format(s, this._fmtYr)
                    );
            for (var h = 1; h < i.length; h++)
                (o = i[h]),
                    (n = wjcCore.DateTime.newDate(s.getFullYear(), h - 1, 1)),
                    wjcCore.setText(
                        o,
                        wjcCore.Globalize.format(n, this._fmtMonths)
                    ),
                    (o.className = ""),
                    wjcCore.toggleClass(
                        o,
                        "wj-state-disabled",
                        !this._monthInValidRange(n)
                    ),
                    wjcCore.toggleClass(
                        o,
                        "wj-state-selected",
                        this._sameMonth(n, this.value)
                    );
        }),
        (t.prototype._canChangeValue = function () {
            return !this._readOnly && this._selMode != DateSelectionMode.None;
        }),
        (t.prototype._valid = function (e) {
            return !this.itemValidator || !e || this.itemValidator(e);
        }),
        (t.prototype._inValidRange = function (e) {
            return (
                !(this.min && e < wjcCore.DateTime.fromDateTime(this.min, e)) &&
                !(this.max && e > wjcCore.DateTime.fromDateTime(this.max, e))
            );
        }),
        (t.prototype._monthInValidRange = function (e) {
            if (this.min || this.max) {
                var t = e.getFullYear(),
                    i = e.getMonth(),
                    o = wjcCore.DateTime.newDate(t, i, 1),
                    n = wjcCore.DateTime.addDays(
                        wjcCore.DateTime.newDate(t, i + 1, 1),
                        -1
                    );
                if (this.min && this.min > n) return !1;
                if (this.max && this.max < o) return !1;
            }
            return !0;
        }),
        (t.prototype._yearInValidRange = function (e) {
            if (this.min || this.max) {
                var t = e.getFullYear(),
                    i = wjcCore.DateTime.newDate(t, 0),
                    o = wjcCore.DateTime.newDate(t, 11, 31);
                if (this.min && this.min > o) return !1;
                if (this.max && this.max < i) return !1;
            }
            return !0;
        }),
        (t.prototype._sameMonth = function (e, t) {
            return (
                wjcCore.isDate(e) &&
                wjcCore.isDate(t) &&
                e.getMonth() == t.getMonth() &&
                e.getFullYear() == t.getFullYear()
            );
        }),
        (t.prototype._clamp = function (e) {
            if (e) {
                if (this.min) {
                    var t = wjcCore.DateTime.fromDateTime(this.min, e);
                    e < t && (e = t);
                }
                if (this.max) {
                    var i = wjcCore.DateTime.fromDateTime(this.max, e);
                    e > i && (e = i);
                }
            }
            return e;
        }),
        (t.prototype._createChildren = function () {
            var e = this.getTemplate();
            this.applyTemplate("wj-control wj-calendar", e, {
                _tbHdr: "tbl-header",
                _btnMth: "btn-month",
                _spMth: "span-month",
                _btnPrv: "btn-prev",
                _btnTdy: "btn-today",
                _btnNxt: "btn-next",
                _tbMth: "tbl-month",
                _tbYr: "tbl-year",
            });
            for (
                var t = this._createElement("tr", this._tbMth, "wj-header"),
                    i = 0;
                i < 7;
                i++
            )
                this._createElement("td", t);
            for (var o = 0; o < 6; o++) {
                t = this._createElement("tr", this._tbMth);
                for (i = 0; i < 7; i++) this._createElement("td", t);
            }
            (t = this._createElement("tr", this._tbYr, "wj-header")),
                this._createElement("td", t).setAttribute("colspan", "4");
            for (var n = 0; n < 3; n++) {
                t = this._createElement("tr", this._tbYr);
                for (var s = 0; s < 4; s++) this._createElement("td", t);
            }
        }),
        (t.prototype._createElement = function (e, t, i) {
            var o = document.createElement(e);
            return t && t.appendChild(o), i && wjcCore.addClass(o, i), o;
        }),
        (t.prototype._click = function (e) {
            var t = !1,
                i = e.target;
            if (
                (wjcCore.contains(this._btnMth, i) && !this._monthMode()
                    ? ((this.monthView = !this.monthView), (t = !0))
                    : wjcCore.contains(this._btnPrv, i)
                    ? (this._navigate(-1), (t = !0))
                    : wjcCore.contains(this._btnNxt, i)
                    ? (this._navigate(1), (t = !0))
                    : wjcCore.contains(this._btnTdy, i) &&
                      (this._navigate(0), (t = !0)),
                i && !t && (i = wjcCore.closest(i, "TD")))
            )
                if (this.monthView) {
                    if (
                        (o = this._getCellIndex(this._tbMth, i)) > 6 &&
                        this._canChangeValue()
                    ) {
                        n = wjcCore.DateTime.fromDateTime(
                            wjcCore.DateTime.addDays(this._firstDay, o - 7),
                            this.value
                        );
                        this._inValidRange(n) &&
                            this._valid(n) &&
                            (this.value = n),
                            (t = !0);
                    }
                } else {
                    var o = this._getCellIndex(this._tbYr, i);
                    if (o > 0) {
                        if (
                            ((this.displayMonth = wjcCore.DateTime.newDate(
                                this.displayMonth.getFullYear(),
                                o - 1,
                                1
                            )),
                            this._monthMode())
                        ) {
                            if (this._canChangeValue()) {
                                var n = wjcCore.DateTime.fromDateTime(
                                    this.displayMonth,
                                    this.value
                                );
                                this._inValidRange(n) && (this.value = n);
                            }
                        } else this.monthView = !0;
                        t = !0;
                    }
                }
            t && (e.preventDefault(), this.focus());
        }),
        (t.prototype._getCellIndex = function (e, t) {
            for (var i = e.querySelectorAll("TD"), o = 0; o < i.length; o++)
                if (i[o] == t) return o;
            return -1;
        }),
        (t.prototype._keydown = function (e) {
            if (!e.defaultPrevented) {
                if (e.altKey)
                    switch (e.keyCode) {
                        case wjcCore.Key.Up:
                        case wjcCore.Key.Down:
                            return;
                        case wjcCore.Key.End:
                            return this._navigate(0), void e.preventDefault();
                    }
                if (!(e.ctrlKey || e.metaKey || e.shiftKey)) {
                    var t = 0,
                        i = 0,
                        o = !0;
                    if (this.monthView)
                        switch (e.keyCode) {
                            case wjcCore.Key.Left:
                                t = -1;
                                break;
                            case wjcCore.Key.Right:
                                t = 1;
                                break;
                            case wjcCore.Key.Up:
                                t = -7;
                                break;
                            case wjcCore.Key.Down:
                                t = 7;
                                break;
                            case wjcCore.Key.PageDown:
                                i = e.altKey ? 12 : 1;
                                break;
                            case wjcCore.Key.PageUp:
                                i = e.altKey ? -12 : -1;
                                break;
                            case wjcCore.Key.Home:
                                if (this._canChangeValue())
                                    if (this.min)
                                        this.value =
                                            wjcCore.DateTime.fromDateTime(
                                                this.min,
                                                this.value
                                            );
                                    else if (this.value) {
                                        n = this.value;
                                        (n = wjcCore.DateTime.newDate(
                                            n.getFullYear(),
                                            n.getMonth(),
                                            1
                                        )),
                                            (this.value =
                                                wjcCore.DateTime.fromDateTime(
                                                    n,
                                                    this.value
                                                ));
                                    }
                                break;
                            case wjcCore.Key.End:
                                if (this._canChangeValue())
                                    if (this.max)
                                        this.value =
                                            wjcCore.DateTime.fromDateTime(
                                                this.max,
                                                this.value
                                            );
                                    else if (this.value) {
                                        n = this.value;
                                        (n = wjcCore.DateTime.newDate(
                                            n.getFullYear(),
                                            n.getMonth() + 1,
                                            0
                                        )),
                                            (this.value =
                                                wjcCore.DateTime.fromDateTime(
                                                    n,
                                                    this.value
                                                ));
                                    }
                                break;
                            default:
                                o = !1;
                        }
                    else
                        switch (e.keyCode) {
                            case wjcCore.Key.Left:
                                i = -1;
                                break;
                            case wjcCore.Key.Right:
                                i = 1;
                                break;
                            case wjcCore.Key.Up:
                                i = -4;
                                break;
                            case wjcCore.Key.Down:
                                i = 4;
                                break;
                            case wjcCore.Key.PageDown:
                                i = e.altKey ? 120 : 12;
                                break;
                            case wjcCore.Key.PageUp:
                                i = e.altKey ? -120 : -12;
                                break;
                            case wjcCore.Key.Home:
                                i = this.value ? -this.value.getMonth() : 0;
                                break;
                            case wjcCore.Key.End:
                                i = this.value ? 11 - this.value.getMonth() : 0;
                                break;
                            case wjcCore.Key.Enter:
                                this._monthMode()
                                    ? (o = !1)
                                    : (this.monthView = !0);
                                break;
                            default:
                                o = !1;
                        }
                    if (this.value && this._canChangeValue() && (t || i)) {
                        var n = this.value;
                        (n = wjcCore.DateTime.addDays(n, t)),
                            (n = wjcCore.DateTime.addMonths(n, i));
                        for (var s = 0; !this._valid(n) && s < 31; s++)
                            n = wjcCore.DateTime.addDays(
                                n,
                                t > 0 || i > 0 ? 1 : -1
                            );
                        this.value = n;
                    }
                    o && e.preventDefault();
                }
            }
        }),
        (t.prototype._getMonth = function (e) {
            return (
                e || (e = wjcCore.DateTime.newDate()),
                wjcCore.DateTime.newDate(e.getFullYear(), e.getMonth(), 1)
            );
        }),
        (t.prototype._monthMode = function () {
            return this.selectionMode == DateSelectionMode.Month;
        }),
        (t.prototype._navigate = function (e) {
            var t = this.monthView;
            switch (e) {
                case 0:
                    var i = wjcCore.DateTime.newDate();
                    t
                        ? this._canChangeValue() &&
                          (this.value = wjcCore.DateTime.fromDateTime(
                              i,
                              this.value
                          ))
                        : this._canChangeValue() &&
                          (this.value = this._getMonth(i)),
                        this._setDisplayMonth(this._getMonth(i));
                    break;
                case 1:
                    this._setDisplayMonth(
                        wjcCore.DateTime.addMonths(
                            this.displayMonth,
                            t ? 1 : 12
                        )
                    );
                    break;
                case -1:
                    this._setDisplayMonth(
                        wjcCore.DateTime.addMonths(
                            this.displayMonth,
                            t ? -1 : -12
                        )
                    );
            }
        }),
        (t.prototype._setDisplayMonth = function (e) {
            this._yearInValidRange(e) && (this.displayMonth = e);
        }),
        (t.controlTemplate =
            '<div class="wj-calendar-outer wj-content"><div wj-part="tbl-header" class="wj-calendar-header"><div wj-part="btn-month" class="wj-month-select"><span wj-part="span-month"></span> <span class="wj-glyph-down"></span></div><div class="wj-btn-group"><button type="button" tabindex="-1" wj-part="btn-prev" class="wj-btn wj-btn-default"><span class="wj-glyph-left"></span></button><button type="button" tabindex="-1" wj-part="btn-today" class="wj-btn wj-btn-default"><span class="wj-glyph-circle"></span></button><button type="button" tabindex="-1" wj-part="btn-next" class="wj-btn wj-btn-default"><span class="wj-glyph-right"></span></button></div></div><table wj-part="tbl-month" class="wj-calendar-month"/><table wj-part="tbl-year" class="wj-calendar-year" style="display:none"/></div>'),
        t
    );
})(wjcCore.Control);
exports.Calendar = Calendar;
var ColorPicker = (function (e) {
    function t(i, o) {
        var n = e.call(this, i) || this;
        (n._hsb = [0.5, 1, 1]),
            (n._alpha = 1),
            (n.valueChanged = new wjcCore.Event());
        var s = n.getTemplate();
        n.applyTemplate("wj-control wj-colorpicker wj-content", s, {
            _eSB: "div-sb",
            _eHue: "div-hue",
            _eAlpha: "div-alpha",
            _ePreview: "div-pv",
            _ePal: "div-pal",
            _eText: "div-text",
        }),
            (n._palette =
                "#FFF,#000, #F00,#FFC000,#FFFF00,#92D050,#00B050,#00B0F0,#0070C0,#7030A0".split(
                    ","
                )),
            n._updatePalette(),
            (n._eHue.style.backgroundImage =
                "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAD4CAIAAACi6hsPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAGvSURBVDhPXdBPaM9xHMfxz4pWaxcmtoOhpdXSVpiyHWxqmVpDjaU5rK34XfypjTJ/p+ZPay6jhsOsRrKwaJElf9IQq03WIkv4FeMwMq221tfje1ByeFzfvd7PEKWGEKWTQRZLySWfVRRTQjmVbKWGOhLsZT+HaeY0bbTTQSfdXOcWffTzmAFeMcwoYyT5ygS/mA5hNgphip98J8kHRnnNSwZ4yH1uc4OrdHGR87RximYO0cgedlLLdqqoYAPrWMtKVrCcJSxiPmnMJUQp/Bsyk2xyyKOAQooopYwKtlDNDur5G7SBJo7RQiv/B+2hl3s84CkvGGKEOOYnxolj/mYmhBmDJ5ngCx95xxsGecYj4pB3iENeoZMO2mmlhaMcpIE4ZII6aqhmM3HMMkooopB88sghm0wySCeVlCjMCVFIYx4LWUwOeRSwhmLWU84mqqihll3sppEmjnOSs5zjEl1c4yZ99POE5wwxwns+840fTDFLFKaZZIJxkozxlmEGGSC+GF++Sy89dHOZC8Rr4lVnOMERDrCPBPXEX22jko2UEn+/mnxyWUYWC0gnNUQh/AEc0HJs6cex0gAAAABJRU5ErkJggg==)"),
            (n._eHue.style.backgroundSize = "contain"),
            navigator.appVersion.indexOf("MSIE 9") > -1 &&
                ((n._eSB.children[0].style.filter =
                    "progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffffffff,endColorstr=#00ffffff,GradientType=1)"),
                (n._eSB.children[1].style.filter =
                    "progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=#ff000000,GradientType=0)")),
            (s = t._tplCursor),
            (n._cSB = wjcCore.createElement(s)),
            (n._cHue = wjcCore.createElement(s)),
            (n._cHue.style.width = "100%"),
            (n._cAlpha = wjcCore.createElement(s)),
            (n._cAlpha.style.height = "100%"),
            n._eSB.appendChild(n._cSB),
            n._eHue.appendChild(n._cHue),
            n._eAlpha.appendChild(n._cAlpha),
            n.addEventListener(n.hostElement, "mousedown", function (e) {
                document.addEventListener("mousemove", r),
                    document.addEventListener("mouseup", a),
                    n._mouseDown(e);
            });
        var r = function (e) {
                n._mouseMove(e);
            },
            a = function (e) {
                document.removeEventListener("mousemove", r),
                    document.removeEventListener("mouseup", a),
                    n._mouseUp(e);
            };
        return (
            n.addEventListener(n.hostElement, "click", function (e) {
                var t = e.target;
                if (t && "DIV" == t.tagName && wjcCore.contains(n._ePal, t)) {
                    var i = t.style.backgroundColor;
                    i && (n.value = new wjcCore.Color(i).toString());
                }
            }),
            (n.value = "#ffffff"),
            n.initialize(o),
            n._updatePanels(),
            n
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "showAlphaChannel", {
            get: function () {
                return "none" != this._eAlpha.parentElement.style.display;
            },
            set: function (e) {
                this._eAlpha.parentElement.style.display = wjcCore.asBoolean(e)
                    ? ""
                    : "none";
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "showColorString", {
            get: function () {
                return "none" != this._eText.style.display;
            },
            set: function (e) {
                this._eText.style.display = wjcCore.asBoolean(e) ? "" : "none";
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (e) {
                if (e != this.value) {
                    (this._value = wjcCore.asString(e)),
                        (this._eText.innerText = this._value);
                    var t = new wjcCore.Color(this._value),
                        i = t.getHsb();
                    (this._hsb[0] == i[0] &&
                        this._hsb[1] == i[1] &&
                        this._hsb[2] == i[2] &&
                        this._alpha == t.a) ||
                        (0 == i[2]
                            ? ((i[0] = this._hsb[0]), (i[1] = this._hsb[1]))
                            : 0 == i[1] && (i[0] = this._hsb[0]),
                        (this._hsb = i),
                        (this._alpha = t.a),
                        this.onValueChanged());
                }
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "palette", {
            get: function () {
                return this._palette;
            },
            set: function (e) {
                e = wjcCore.asArray(e);
                for (var t = 0; t < e.length && t < this._palette.length; t++) {
                    var i = wjcCore.asString(e[t]);
                    this._palette[t] = i;
                }
                this._updatePalette();
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.onValueChanged = function (e) {
            this._updatePanels(), this.valueChanged.raise(this, e);
        }),
        (t.prototype._mouseDown = function (e) {
            (this._htDown = this._getTargetPanel(e)),
                this._htDown &&
                    (e.preventDefault(), this.focus(), this._mouseMove(e));
        }),
        (t.prototype._mouseMove = function (e) {
            if (this._htDown) {
                var t = this._htDown.getBoundingClientRect();
                this._htDown == this._eHue
                    ? ((this._hsb[0] = wjcCore.clamp(
                          (e.clientY - t.top) / t.height,
                          0,
                          0.99
                      )),
                      this._updateColor())
                    : this._htDown == this._eSB
                    ? ((this._hsb[1] = wjcCore.clamp(
                          (e.clientX - t.left) / t.width,
                          0,
                          1
                      )),
                      (this._hsb[2] = wjcCore.clamp(
                          1 - (e.clientY - t.top) / t.height,
                          0,
                          1
                      )),
                      this._updateColor())
                    : this._htDown == this._eAlpha &&
                      ((this._alpha = wjcCore.clamp(
                          (e.clientX - t.left) / t.width,
                          0,
                          1
                      )),
                      this._updateColor());
            }
        }),
        (t.prototype._mouseUp = function (e) {
            this._htDown = null;
        }),
        (t.prototype._updateColor = function () {
            var e = wjcCore.Color.fromHsb(
                this._hsb[0],
                this._hsb[1],
                this._hsb[2],
                this._alpha
            );
            (this.value = e.toString()), this._updatePanels();
        }),
        (t.prototype._updatePalette = function () {
            var e = new wjcCore.Color("#fff"),
                t = new wjcCore.Color("#000");
            this._ePal.innerHTML = "";
            for (var i = 0; i < this._palette.length; i++) {
                var o = wjcCore.createElement(
                        '<div style="float:left;width:10%;box-sizing:border-box;padding:1px">'
                    ),
                    n = new wjcCore.Color(this._palette[i]),
                    s = n.getHsb();
                o.appendChild(this._makePalEntry(n, 4));
                for (var r = 0; r < 5; r++) {
                    if (0 == s[1]) {
                        var a = 0.1 * r + (s[2] > 0.5 ? 0.05 : 0.55);
                        n = wjcCore.Color.interpolate(e, t, a);
                    } else
                        n = wjcCore.Color.fromHsb(
                            s[0],
                            0.1 + 0.2 * r,
                            1 - 0.1 * r
                        );
                    o.appendChild(this._makePalEntry(n, 0));
                }
                this._ePal.appendChild(o);
            }
        }),
        (t.prototype._makePalEntry = function (e, t) {
            var i = document.createElement("div");
            return (
                wjcCore.setCss(i, {
                    cursor: "pointer",
                    backgroundColor: e.toString(),
                    marginBottom: t || "",
                }),
                (i.innerHTML = "&nbsp"),
                i
            );
        }),
        (t.prototype._updatePanels = function () {
            var e = wjcCore.Color.fromHsb(this._hsb[0], 1, 1, 1),
                t = wjcCore.Color.fromHsb(
                    this._hsb[0],
                    this._hsb[1],
                    this._hsb[2],
                    1
                );
            (this._eSB.style.backgroundColor = e.toString()),
                (this._eAlpha.style.background =
                    "linear-gradient(to right, transparent 0%, " +
                    t.toString() +
                    " 100%)"),
                navigator.appVersion.indexOf("MSIE 9") > -1 &&
                    (this._eAlpha.style.filter =
                        "progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=" +
                        t.toString() +
                        ", GradientType = 1)"),
                (this._ePreview.style.backgroundColor = this.value),
                (this._cHue.style.top = (100 * this._hsb[0]).toFixed(0) + "%"),
                (this._cSB.style.left = (100 * this._hsb[1]).toFixed(0) + "%"),
                (this._cSB.style.top =
                    (100 - 100 * this._hsb[2]).toFixed(0) + "%"),
                (this._cAlpha.style.left =
                    (100 * this._alpha).toFixed(0) + "%");
        }),
        (t.prototype._getTargetPanel = function (e) {
            var t = e.target;
            return wjcCore.contains(this._eSB, t)
                ? this._eSB
                : wjcCore.contains(this._eHue, t)
                ? this._eHue
                : wjcCore.contains(this._eAlpha, t)
                ? this._eAlpha
                : null;
        }),
        (t.controlTemplate =
            '<div style="position:relative;width:100%;height:100%"><div style="float:left;width:50%;height:100%;box-sizing:border-box;padding:2px"><div wj-part="div-pal"><div style="float:left;width:10%;box-sizing:border-box;padding:2px"><div style="background-color:black;width:100%">&nbsp;</div><div style="height:6px"></div></div></div><div wj-part="div-text" style="position:absolute;bottom:0px;display:none"></div></div><div style="float:left;width:50%;height:100%;box-sizing:border-box;padding:2px"><div wj-part="div-sb" class="wj-colorbox" style="float:left;width:89%;height:89%"><div style="position:absolute;width:100%;height:100%;background:linear-gradient(to right, white 0%,transparent 100%)"></div><div style="position:absolute;width:100%;height:100%;background:linear-gradient(to top, black 0%,transparent 100%)"></div></div><div style="float:left;width:1%;height:89%"></div><div style="float:left;width:10%;height:89%"><div wj-part="div-hue" class="wj-colorbox"></div></div><div style="float:left;width:89%;height:1%"></div><div style="float:left;width:89%;height:10%"><div style="width:100%;height:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAAcSURBVBhXY/iPBBYgAWpKQGkwgMqDAdUk/v8HAM7Mm6GatDUYAAAAAElFTkSuQmCC)"><div wj-part="div-alpha" class="wj-colorbox"></div></div></div><div style="float:left;width:1%;height:10%"></div><div style="float:left;width:10%;height:10%"><div wj-part="div-pv" class="wj-colorbox" style="position:static"></div></div></div></div>'),
        (t._tplCursor =
            '<div style="position:absolute;left:50%;top:50%;width:7px;height:7px;transform:translate(-50%,-50%);border:2px solid #f0f0f0;border-radius:50px;box-shadow:0px 0px 4px 2px #0f0f0f"></div>'),
        t
    );
})(wjcCore.Control);
exports.ColorPicker = ColorPicker;
var ListBox = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        (o._pathDisplay = new wjcCore.Binding(null)),
            (o._pathValue = new wjcCore.Binding(null)),
            (o._pathChecked = new wjcCore.Binding(null)),
            (o._html = !1),
            (o._checkedItems = []),
            (o._itemRole = "option"),
            (o._search = ""),
            (o.selectedIndexChanged = new wjcCore.Event()),
            (o.itemsChanged = new wjcCore.Event()),
            (o.loadingItems = new wjcCore.Event()),
            (o.loadedItems = new wjcCore.Event()),
            (o.itemChecked = new wjcCore.Event()),
            (o.checkedItemsChanged = new wjcCore.Event()),
            (o.formatItem = new wjcCore.Event()),
            o.applyTemplate("wj-control wj-listbox wj-content", null, null);
        var n = o.hostElement;
        return (
            wjcCore.setAttribute(n, "role", "listbox", !0),
            "SELECT" == o._orgTag && o._initFromSelect(o.hostElement),
            o.addEventListener(n, "click", o._click.bind(o)),
            o.addEventListener(n, "keydown", o._keydown.bind(o)),
            o.addEventListener(n, "keypress", o._keypress.bind(o)),
            o.addEventListener(n, "wheel", function (e) {
                n.scrollHeight > n.offsetHeight &&
                    ((e.deltaY < 0 && 0 == n.scrollTop) ||
                        (e.deltaY > 0 &&
                            n.scrollTop + n.offsetHeight >= n.scrollHeight)) &&
                    (e.preventDefault(), e.stopPropagation());
            }),
            (o._tabIndex = n.tabIndex),
            o.initialize(i),
            o
        );
    }
    return (
        __extends(t, e),
        (t.prototype.refresh = function () {
            e.prototype.refresh.call(this),
                (!this.displayMemberPath && this.checkedMemberPath) ||
                    this._populateList();
        }),
        Object.defineProperty(t.prototype, "itemsSource", {
            get: function () {
                return this._items;
            },
            set: function (e) {
                this._items != e &&
                    (this._cv &&
                        (this._cv.currentChanged.removeHandler(
                            this._cvCurrentChanged,
                            this
                        ),
                        this._cv.collectionChanged.removeHandler(
                            this._cvCollectionChanged,
                            this
                        ),
                        (this._cv = null)),
                    (this._items = e),
                    (this._cv = wjcCore.asCollectionView(e)),
                    null != this._cv &&
                        (this._cv.currentChanged.addHandler(
                            this._cvCurrentChanged,
                            this
                        ),
                        this._cv.collectionChanged.addHandler(
                            this._cvCollectionChanged,
                            this
                        )),
                    this._populateList(),
                    this.onItemsChanged(),
                    this.onSelectedIndexChanged());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "collectionView", {
            get: function () {
                return this._cv;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isContentHtml", {
            get: function () {
                return this._html;
            },
            set: function (e) {
                e != this._html &&
                    ((this._html = wjcCore.asBoolean(e)), this._populateList());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "itemFormatter", {
            get: function () {
                return this._itemFormatter;
            },
            set: function (e) {
                e != this._itemFormatter &&
                    ((this._itemFormatter = wjcCore.asFunction(e)),
                    this._populateList());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "displayMemberPath", {
            get: function () {
                return this._pathDisplay.path;
            },
            set: function (e) {
                e != this.displayMemberPath &&
                    ((this._pathDisplay.path = wjcCore.asString(e)),
                    this._populateList());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectedValuePath", {
            get: function () {
                return this._pathValue.path;
            },
            set: function (e) {
                this._pathValue.path = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "checkedMemberPath", {
            get: function () {
                return this._pathChecked.path;
            },
            set: function (e) {
                e != this.checkedMemberPath &&
                    ((this._pathChecked.path = wjcCore.asString(e)),
                    this._populateList());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "itemRole", {
            get: function () {
                return this._itemRole;
            },
            set: function (e) {
                e != this.itemRole &&
                    ((this._itemRole = wjcCore.asString(e)),
                    this._populateList());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.getDisplayValue = function (e) {
            var t = null;
            e > -1 &&
                wjcCore.hasItems(this._cv) &&
                ((t = this._cv.items[e]),
                this.displayMemberPath && (t = this._pathDisplay.getValue(t)));
            var i = null != t ? t.toString() : "";
            return this.itemFormatter && (i = this.itemFormatter(e, i)), i;
        }),
        (t.prototype.getDisplayText = function (e) {
            var t = this.hostElement.children,
                i = e > -1 && e < t.length ? t[e] : null;
            return null != i ? i.textContent : "";
        }),
        (t.prototype.isItemEnabled = function (e) {
            if (!this.getDisplayText(e)) return !1;
            var t = this.hostElement.children[e];
            return !(
                !t ||
                t.hasAttribute("disabled") ||
                wjcCore.hasClass(t, "wj-state-disabled")
            );
        }),
        Object.defineProperty(t.prototype, "selectedIndex", {
            get: function () {
                return this._cv ? this._cv.currentPosition : -1;
            },
            set: function (e) {
                this._cv && this._cv.moveCurrentToPosition(wjcCore.asNumber(e));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectedItem", {
            get: function () {
                return this._cv ? this._cv.currentItem : null;
            },
            set: function (e) {
                this._cv && this._cv.moveCurrentTo(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectedValue", {
            get: function () {
                var e = this.selectedItem;
                return (
                    e &&
                        this.selectedValuePath &&
                        (e = this._pathValue.getValue(e)),
                    e
                );
            },
            set: function (e) {
                var t = this.selectedValuePath,
                    i = -1;
                if (this._cv) {
                    for (var o = 0; o < this._cv.items.length; o++) {
                        var n = this._cv.items[o];
                        if ((t ? this._pathValue.getValue(n) : n) === e) {
                            i = o;
                            break;
                        }
                    }
                    this.selectedIndex = i;
                }
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "maxHeight", {
            get: function () {
                var e = this.hostElement;
                return e ? parseFloat(e.style.maxHeight) : null;
            },
            set: function (e) {
                var t = this.hostElement;
                t && (t.style.maxHeight = wjcCore.asNumber(e) + "px");
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.showSelection = function () {
            for (
                var e,
                    t = this.selectedIndex,
                    i = this.hostElement,
                    o = i.children,
                    n = 0;
                n < o.length;
                n++
            )
                (e = o[n]),
                    wjcCore.toggleClass(e, "wj-state-selected", n == t),
                    wjcCore.setAttribute(
                        e,
                        "tabindex",
                        n == t ? this._tabIndex : -1
                    );
            if (t > -1 && t < o.length) {
                var s = (e = o[t]).getBoundingClientRect(),
                    r = i.getBoundingClientRect();
                s.bottom > r.bottom
                    ? (i.scrollTop += s.bottom - r.bottom)
                    : s.top < r.top && (i.scrollTop -= r.top - s.top);
            }
            t > -1 &&
                this.containsFocus() &&
                (e = o[t]) instanceof HTMLElement &&
                !wjcCore.contains(e, wjcCore.getActiveElement()) &&
                e.focus(),
                wjcCore.setAttribute(
                    i,
                    "tabindex",
                    t < 0 ? this._tabIndex : -1
                );
        }),
        (t.prototype.getItemChecked = function (e) {
            var t = this._cv.items[e];
            if (wjcCore.isObject(t) && this.checkedMemberPath)
                return this._pathChecked.getValue(t);
            var i = this._getCheckbox(e);
            return !!i && i.checked;
        }),
        (t.prototype.setItemChecked = function (e, t) {
            this._setItemChecked(e, t, !0);
        }),
        (t.prototype.toggleItemChecked = function (e) {
            this.setItemChecked(e, !this.getItemChecked(e));
        }),
        Object.defineProperty(t.prototype, "checkedItems", {
            get: function () {
                if (
                    (this._checkedItems.splice(0, this._checkedItems.length),
                    this._cv)
                )
                    for (var e = 0; e < this._cv.items.length; e++)
                        this.getItemChecked(e) &&
                            this._checkedItems.push(this._cv.items[e]);
                return this._checkedItems;
            },
            set: function (e) {
                var t = this._cv,
                    i = this.hostElement,
                    o = wjcCore.asArray(e, !1);
                if (t && o) {
                    for (
                        var n = t.currentPosition, s = i.scrollTop, r = 0;
                        r < t.items.length;
                        r++
                    ) {
                        var a = t.items[r];
                        this._setItemChecked(r, o.indexOf(a) > -1, !1);
                    }
                    t.moveCurrentToPosition(n),
                        (i.scrollTop = s),
                        this.onCheckedItemsChanged();
                }
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.onSelectedIndexChanged = function (e) {
            this.selectedIndexChanged.raise(this, e);
        }),
        (t.prototype.onItemsChanged = function (e) {
            this.itemsChanged.raise(this, e);
        }),
        (t.prototype.onLoadingItems = function (e) {
            this.loadingItems.raise(this, e);
        }),
        (t.prototype.onLoadedItems = function (e) {
            this.loadedItems.raise(this, e);
        }),
        (t.prototype.onItemChecked = function (e) {
            this.itemChecked.raise(this, e);
        }),
        (t.prototype.onCheckedItemsChanged = function (e) {
            this.checkedItemsChanged.raise(this, e);
        }),
        (t.prototype.onFormatItem = function (e) {
            this.formatItem.raise(this, e);
        }),
        (t.prototype._setItemChecked = function (e, t, i) {
            void 0 === i && (i = !0);
            var o = this._cv.items[e];
            if (wjcCore.isObject(o)) {
                var n = wjcCore.tryCast(this._cv, "IEditableCollectionView");
                this._pathChecked.getValue(o) != t &&
                    ((this._checking = !0),
                    n
                        ? (n.editItem(o),
                          this._pathChecked.setValue(o, t),
                          n.commitEdit())
                        : (this._pathChecked.setValue(o, t),
                          this._cv.refresh()),
                    (this._checking = !1));
            }
            var s = this._getCheckbox(e);
            if (s) {
                s.checked = t;
                var r = wjcCore.closest(s, ".wj-listbox-item");
                r && wjcCore.toggleClass(r, "wj-state-checked", t);
            }
            i && (this.onItemChecked(), this.onCheckedItemsChanged());
        }),
        (t.prototype._cvCollectionChanged = function (e, t) {
            this._checking || (this._populateList(), this.onItemsChanged());
        }),
        (t.prototype._cvCurrentChanged = function (e, t) {
            this._checking ||
                (this.showSelection(), this.onSelectedIndexChanged());
        }),
        (t.prototype._populateList = function () {
            var e = this.hostElement;
            if (e) {
                var t = this.containsFocus();
                if ((this.onLoadingItems(), (e.innerHTML = ""), this._cv)) {
                    for (
                        var i = document.createDocumentFragment(), o = 0;
                        o < this._cv.items.length;
                        o++
                    ) {
                        var n = this.getDisplayValue(o);
                        1 != this._html && (n = wjcCore.escapeHtml(n));
                        var s = !1;
                        this.checkedMemberPath &&
                            (n =
                                '<label><input tabindex="-1" type="checkbox"' +
                                ((s = this._pathChecked.getValue(
                                    this._cv.items[o]
                                ))
                                    ? " checked"
                                    : "") +
                                "> " +
                                n +
                                "</label>");
                        var r = document.createElement("div"),
                            a = "wj-listbox-item";
                        if (
                            ((r.innerHTML = n),
                            wjcCore.hasClass(r.firstChild, "wj-separator") &&
                                (a += " wj-separator"),
                            s && (a += " wj-state-checked"),
                            (r.className = a),
                            wjcCore.setAttribute(
                                r,
                                "role",
                                this.itemRole ? this.itemRole : null
                            ),
                            this.formatItem.hasHandlers)
                        ) {
                            var l = new FormatItemEventArgs(
                                o,
                                this._cv.items[o],
                                r
                            );
                            this.onFormatItem(l);
                        }
                        i.appendChild(r);
                    }
                    e.appendChild(i);
                }
                0 == e.children.length &&
                    e.appendChild(document.createElement("div")),
                    t && !this.containsFocus() && this.focus(),
                    this.showSelection(),
                    this.onLoadedItems();
            }
        }),
        (t.prototype._click = function (e) {
            if (!e.defaultPrevented) {
                for (
                    var t = this.hostElement.children, i = 0;
                    i < t.length;
                    i++
                )
                    if (wjcCore.contains(t[i], e.target)) {
                        this.selectedIndex = i;
                        break;
                    }
                var o = this.selectedIndex;
                if (this.checkedMemberPath && o > -1) {
                    var n = this._getCheckbox(o);
                    n == e.target &&
                        (t[o].focus(), this.setItemChecked(o, n.checked));
                }
            }
        }),
        (t.prototype._keydown = function (e) {
            var t = this.selectedIndex;
            this.hostElement.children;
            if (!e.defaultPrevented) {
                if (
                    65 == e.keyCode &&
                    (e.ctrlKey || e.metaKey) &&
                    this.checkedMemberPath &&
                    wjcCore.hasItems(this.collectionView)
                )
                    return (
                        (this.checkedItems = this.getItemChecked(0)
                            ? []
                            : this.collectionView.items),
                        void e.preventDefault()
                    );
                if (!(e.ctrlKey || e.shiftKey || e.altKey || e.metaKey))
                    switch (e.keyCode) {
                        case wjcCore.Key.Down:
                            e.preventDefault(), this._selectNext();
                            break;
                        case wjcCore.Key.Up:
                            e.preventDefault(), this._selectPrev();
                            break;
                        case wjcCore.Key.Home:
                            e.preventDefault(), this._selectFirst();
                            break;
                        case wjcCore.Key.End:
                            e.preventDefault(), this._selectLast();
                            break;
                        case wjcCore.Key.PageDown:
                            e.preventDefault(), this._selectNextPage();
                            break;
                        case wjcCore.Key.PageUp:
                            e.preventDefault(), this._selectPrevPage();
                            break;
                        case wjcCore.Key.Space:
                            if (this.checkedMemberPath && t > -1) {
                                var i = this._getCheckbox(t);
                                i &&
                                    this.isItemEnabled(t) &&
                                    (this.setItemChecked(t, !i.checked),
                                    e.preventDefault());
                            }
                    }
            }
        }),
        (t.prototype._keypress = function (e) {
            var i = this;
            if (
                !e.defaultPrevented &&
                !(e.target instanceof HTMLInputElement) &&
                (e.charCode > 32 || (32 == e.charCode && this._search))
            ) {
                e.preventDefault(),
                    (this._search += String.fromCharCode(
                        e.charCode
                    ).toLowerCase()),
                    this._toSearch && clearTimeout(this._toSearch),
                    (this._toSearch = setTimeout(function () {
                        (i._toSearch = null), (i._search = "");
                    }, t._AUTOSEARCH_DELAY));
                var o = this._findNext();
                o < 0 &&
                    this._search.length > 1 &&
                    ((this._search = this._search[this._search.length - 1]),
                    (o = this._findNext())),
                    o > -1 && (this.selectedIndex = o);
            }
        }),
        (t.prototype._selectNext = function () {
            for (
                var e = this.hostElement.children.length,
                    t = this.selectedIndex + 1;
                t < e;
                t++
            )
                if (this.isItemEnabled(t)) return (this.selectedIndex = t), !0;
            return !1;
        }),
        (t.prototype._selectPrev = function () {
            for (var e = this.selectedIndex - 1; e >= 0; e--)
                if (this.isItemEnabled(e)) return (this.selectedIndex = e), !0;
            return !1;
        }),
        (t.prototype._selectFirst = function () {
            for (var e = this.hostElement.children.length, t = 0; t < e; t++)
                if (this.isItemEnabled(t)) return (this.selectedIndex = t), !0;
            return !1;
        }),
        (t.prototype._selectLast = function () {
            for (var e = this.hostElement.children.length - 1; e >= 0; e--)
                if (this.isItemEnabled(e)) return (this.selectedIndex = e), !0;
            return !1;
        }),
        (t.prototype._selectNextPage = function () {
            for (
                var e = this.hostElement,
                    t = e.offsetHeight,
                    i = e.children,
                    o = 0,
                    n = this.selectedIndex + 1;
                n < this._cv.items.length;
                n++
            ) {
                var s = i[n].scrollHeight;
                if (o + s > t && this.isItemEnabled(n))
                    return (this.selectedIndex = n), !0;
                o += s;
            }
            return this._selectLast();
        }),
        (t.prototype._selectPrevPage = function () {
            for (
                var e = this.hostElement,
                    t = e.offsetHeight,
                    i = e.children,
                    o = 0,
                    n = this.selectedIndex - 1;
                n > 0;
                n--
            ) {
                var s = i[n].scrollHeight;
                if (o + s > t && this.isItemEnabled(n))
                    return (this.selectedIndex = n), !0;
                o += s;
            }
            return this._selectFirst();
        }),
        (t.prototype._findNext = function () {
            if (this.hostElement) {
                var e = this.hostElement.childElementCount,
                    t = this.selectedIndex;
                (t < 0 || 1 == this._search.length) && t++;
                for (var i = 0; i < e; i++) {
                    var o = (t + i) % e;
                    if (
                        0 ==
                            this.getDisplayText(o)
                                .trim()
                                .toLowerCase()
                                .indexOf(this._search) &&
                        this.isItemEnabled(o)
                    )
                        return o;
                }
            }
            return -1;
        }),
        (t.prototype._getCheckbox = function (e) {
            var t = this.hostElement;
            return t && e > -1 && e < t.children.length
                ? t.children[e].querySelector("input[type=checkbox]")
                : null;
        }),
        (t.prototype._initFromSelect = function (e) {
            for (var t = e.children, i = [], o = -1, n = 0; n < t.length; n++) {
                var s = t[n];
                "OPTION" == s.tagName &&
                    (s.hasAttribute("selected") && (o = i.length),
                    s.innerHTML
                        ? i.push({
                              hdr: s.innerHTML,
                              val: s.getAttribute("value"),
                              cmdParam: s.getAttribute("cmd-param"),
                          })
                        : i.push({ hdr: '<div class="wj-separator"/>' }),
                    e.removeChild(s),
                    n--);
            }
            i &&
                ((this.displayMemberPath = "hdr"),
                (this.selectedValuePath = "val"),
                (this.itemsSource = i),
                (this.selectedIndex = o));
        }),
        (t._AUTOSEARCH_DELAY = 600),
        t
    );
})(wjcCore.Control);
exports.ListBox = ListBox;
var FormatItemEventArgs = (function (e) {
    function t(t, i, o) {
        var n = e.call(this) || this;
        return (
            (n._index = wjcCore.asNumber(t)),
            (n._data = i),
            (n._item = wjcCore.asType(o, HTMLElement)),
            n
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "index", {
            get: function () {
                return this._index;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "item", {
            get: function () {
                return this._item;
            },
            enumerable: !0,
            configurable: !0,
        }),
        t
    );
})(wjcCore.EventArgs);
exports.FormatItemEventArgs = FormatItemEventArgs;
var ComboBox = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        (o._editable = !1),
            (o._delKey = 0),
            (o._composing = !1),
            (o._pathHdr = new wjcCore.Binding(null)),
            (o._bsCollapse = !0),
            (o.itemsSourceChanged = new wjcCore.Event()),
            (o.selectedIndexChanged = new wjcCore.Event());
        var n = o.hostElement;
        wjcCore.addClass(n, "wj-combobox");
        var s = o._tbx,
            r = wjcCore.getUniqueId(n.id + "_dropdown");
        return (
            (o.dropDown.id = r),
            wjcCore.setAttribute(s, "role", "combobox"),
            wjcCore.setAttribute(s, "aria-autocomplete", "both"),
            wjcCore.setAttribute(s, "aria-owns", r),
            wjcCore.setAttribute(o._btn, "aria-controls", r),
            wjcCore.setAttribute(o.dropDown, "aria-expanded", !1),
            (o.autoExpandSelection = !1),
            o.addEventListener(o._tbx, "compositionstart", function () {
                o._composing = !0;
            }),
            o.addEventListener(o._tbx, "compositionend", function () {
                (o._composing = !1),
                    setTimeout(function () {
                        o._setText(o.text, !0);
                    });
            }),
            o.addEventListener(n, "wheel", function (e) {
                if (
                    !e.defaultPrevented &&
                    !o.isDroppedDown &&
                    !o.isReadOnly &&
                    o.containsFocus() &&
                    o.selectedIndex > -1
                ) {
                    var t = wjcCore.clamp(-e.deltaY, -1, 1);
                    (o.selectedIndex = wjcCore.clamp(
                        o.selectedIndex - t,
                        0,
                        o.collectionView.items.length - 1
                    )),
                        e.preventDefault();
                }
            }),
            "SELECT" == o._orgTag && o._lbx._initFromSelect(n),
            o._lbx.loadedItems.addHandler(function () {
                o.selectedIndex > -1 &&
                    (o.selectedIndex = o._lbx.selectedIndex);
            }),
            (o.isRequired = !0),
            o.initialize(i),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "itemsSource", {
            get: function () {
                return this._lbx.itemsSource;
            },
            set: function (e) {
                this._lbx.itemsSource != e &&
                    ((this._lbx.itemsSource = e), this.onItemsSourceChanged()),
                    this._updateBtn();
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "collectionView", {
            get: function () {
                return this._lbx.collectionView;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "displayMemberPath", {
            get: function () {
                return this._lbx.displayMemberPath;
            },
            set: function (e) {
                this._lbx.displayMemberPath = e;
                var t = this.getDisplayText();
                this.text != t && this._setText(t, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "headerPath", {
            get: function () {
                return this._pathHdr.path;
            },
            set: function (e) {
                this._pathHdr.path = wjcCore.asString(e);
                var t = this.getDisplayText();
                this.text != t && this._setText(t, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectedValuePath", {
            get: function () {
                return this._lbx.selectedValuePath;
            },
            set: function (e) {
                this._lbx.selectedValuePath = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isContentHtml", {
            get: function () {
                return this._lbx.isContentHtml;
            },
            set: function (e) {
                if (e != this.isContentHtml) {
                    this._lbx.isContentHtml = wjcCore.asBoolean(e);
                    var t = this.getDisplayText();
                    this.text != t && this._setText(t, !0);
                }
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "itemFormatter", {
            get: function () {
                return this._lbx.itemFormatter;
            },
            set: function (e) {
                (this._lbx.itemFormatter = wjcCore.asFunction(e)),
                    (this.selectedIndex = this._lbx.selectedIndex);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "formatItem", {
            get: function () {
                return this.listBox.formatItem;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectedIndex", {
            get: function () {
                return this._lbx.selectedIndex;
            },
            set: function (e) {
                e != this.selectedIndex && (this._lbx.selectedIndex = e),
                    (e = this.selectedIndex);
                var t = this.getDisplayText(e);
                this.text != t && this._setText(t, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectedItem", {
            get: function () {
                return this._lbx.selectedItem;
            },
            set: function (e) {
                this._lbx.selectedItem = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectedValue", {
            get: function () {
                return this._lbx.selectedValue;
            },
            set: function (e) {
                this._lbx.selectedValue = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isEditable", {
            get: function () {
                return this._editable;
            },
            set: function (e) {
                this._editable = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "maxDropDownHeight", {
            get: function () {
                return this._lbx.maxHeight;
            },
            set: function (e) {
                this._lbx.maxHeight = wjcCore.asNumber(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "maxDropDownWidth", {
            get: function () {
                var e = this._dropDown;
                return parseInt(e.style.maxWidth);
            },
            set: function (e) {
                this._dropDown.style.maxWidth = wjcCore.asNumber(e) + "px";
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.getDisplayText = function (e) {
            if (
                (void 0 === e && (e = this.selectedIndex),
                this.headerPath &&
                    e > -1 &&
                    wjcCore.hasItems(this.collectionView))
            ) {
                var t = this.collectionView.items[e],
                    i = t ? this._pathHdr.getValue(t) : null;
                return (
                    (i = null != i ? i.toString() : ""),
                    this.isContentHtml &&
                        (this._cvt ||
                            (this._cvt = document.createElement("div")),
                        (this._cvt.innerHTML = i),
                        (i = this._cvt.textContent)),
                    i.trim()
                );
            }
            return this._lbx.getDisplayText(e).trim();
        }),
        (t.prototype.indexOf = function (e, t) {
            var i = this.collectionView;
            if (wjcCore.hasItems(i) && null != e) {
                var o = this.selectedIndex;
                if (t && e == this.getDisplayText(o)) return o;
                e = e.toString().toLowerCase();
                for (var n = 0; n < i.items.length; n++)
                    if (this.listBox.isItemEnabled(n)) {
                        var s = this.getDisplayText(n).toLowerCase();
                        if (t) {
                            if (s == e) return n;
                        } else if (e && 0 == s.indexOf(e)) return n;
                    }
            }
            return -1;
        }),
        Object.defineProperty(t.prototype, "listBox", {
            get: function () {
                return this._lbx;
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.onItemsSourceChanged = function (e) {
            this.itemsSourceChanged.raise(this, e);
        }),
        (t.prototype.onSelectedIndexChanged = function (e) {
            this._updateBtn(), this.selectedIndexChanged.raise(this, e);
        }),
        (t.prototype.refresh = function (t) {
            e.prototype.refresh.call(this, t),
                wjcCore.hasItems(this.collectionView) &&
                    (this._lbx.refresh(),
                    this.selectedIndex > -1 &&
                        (this.selectedIndex = this._lbx.selectedIndex));
        }),
        (t.prototype.onLostFocus = function (t) {
            this._composing &&
                ((this._composing = !1), this._setText(this.text, !0)),
                this.isEditable &&
                    this.isRequired &&
                    !this.text &&
                    wjcCore.hasItems(this.collectionView) &&
                    (this.selectedIndex = 0),
                e.prototype.onLostFocus.call(this, t);
        }),
        (t.prototype.onIsDroppedDownChanging = function (t) {
            return this.isDroppedDown || wjcCore.hasItems(this.collectionView)
                ? e.prototype.onIsDroppedDownChanging.call(this, t)
                : ((t.cancel = !0), !1);
        }),
        (t.prototype.onIsDroppedDownChanged = function (t) {
            e.prototype.onIsDroppedDownChanged.call(this, t),
                this.isDroppedDown &&
                    (this._lbx.showSelection(),
                    this.isTouching || this.selectAll()),
                wjcCore.setAttribute(
                    this.dropDown,
                    "aria-expanded",
                    this.isDroppedDown
                );
        }),
        (t.prototype._updateBtn = function () {
            var e = this.collectionView;
            (this._btn.style.display =
                this._showBtn && null != e ? "" : "none"),
                wjcCore.enable(this._btn, wjcCore.hasItems(e));
        }),
        (t.prototype._btnclick = function (t) {
            e.prototype._btnclick.call(this, t),
                this.isTouching || this._elRef != this._tbx || this.selectAll();
        }),
        (t.prototype._createDropDown = function () {
            var e = this;
            this._lbx || (this._lbx = new ListBox(this._dropDown)),
                (this._lbx.maxHeight = 200),
                this._lbx.selectedIndexChanged.addHandler(function () {
                    e._updateBtn(),
                        (e.selectedIndex = e._lbx.selectedIndex),
                        e.onSelectedIndexChanged();
                }),
                this._lbx.itemsChanged.addHandler(function () {
                    e._updateBtn();
                }),
                this.addEventListener(
                    this._dropDown,
                    "click",
                    this._dropDownClick.bind(this)
                );
        }),
        (t.prototype._dropDownClick = function (e) {
            e.defaultPrevented ||
                (e.target != this._dropDown && (this.isDroppedDown = !1));
        }),
        (t.prototype._setText = function (t, i) {
            if (!this._composing && !this._settingText) {
                (this._settingText = !0),
                    null == t && (t = ""),
                    (t = t.toString());
                var o = this.selectedIndex,
                    n = this.collectionView,
                    s = this._getSelStart(),
                    r = -1,
                    a = !0;
                if (
                    (this._delKey && this.isEditable && ((i = !0), (a = !1)),
                    (o = this.indexOf(t, i)),
                    a &&
                        (o < 0 && i && (o = this.indexOf(t, !1)),
                        o < 0 &&
                            s > 0 &&
                            (o = this.indexOf(t.substr(0, s), !1))),
                    o < 0 &&
                        !this.isEditable &&
                        wjcCore.hasItems(n) &&
                        (this.isRequired || t))
                ) {
                    var l = this._oldText || "";
                    o = Math.max(0, this.indexOf(l, !1));
                    for (var c = 0; c < t.length && c < l.length; c++)
                        if (t[c] != l[c]) {
                            s = c;
                            break;
                        }
                }
                o > -1 && ((r = s), (t = this.getDisplayText(o))),
                    t != this._tbx.value && (this._tbx.value = t),
                    r > -1 &&
                        this.containsFocus() &&
                        !this.isTouching &&
                        this._updateInputSelection(r),
                    n && n.moveCurrentToPosition(o),
                    e.prototype._setText.call(this, t, i),
                    (this._delKey = 0),
                    (this._settingText = !1);
            }
        }),
        (t.prototype._findNext = function (e, t) {
            if (this.collectionView) {
                e = e.toLowerCase();
                for (
                    var i = this.collectionView.items.length,
                        o = void 0,
                        n = void 0,
                        s = 1;
                    s <= i;
                    s++
                )
                    if (
                        ((o = (this.selectedIndex + s * t + i) % i),
                        (n = this.getDisplayText(o).toLowerCase()) &&
                            0 == n.indexOf(e) &&
                            (!this.dropDown.children[o] ||
                                this.listBox.isItemEnabled(o)))
                    )
                        return o;
            }
            return this.selectedIndex;
        }),
        (t.prototype._keydown = function (t) {
            if (
                (e.prototype._keydown.call(this, t),
                !t.defaultPrevented &&
                    !this.isReadOnly &&
                    !t.altKey &&
                    wjcCore.hasItems(this.collectionView) &&
                    this._elRef == this._tbx)
            ) {
                this._delKey = 0;
                var i = this._getSelStart();
                switch (t.keyCode) {
                    case wjcCore.Key.Back:
                        if (this._bsCollapse && !this.isEditable) {
                            var o = this._getSelEnd();
                            i > 0 &&
                                o == this._tbx.value.length &&
                                wjcCore.hasItems(this.collectionView) &&
                                this._setSelRange(i - 1, o);
                        }
                        this._delKey = t.keyCode;
                        break;
                    case wjcCore.Key.Delete:
                        this._delKey = t.keyCode;
                        break;
                    case wjcCore.Key.Up:
                    case wjcCore.Key.Down:
                        i == this.text.length && (i = 0),
                            (this.selectedIndex = this._findNext(
                                this.text.substr(0, i),
                                t.keyCode == wjcCore.Key.Up ? -1 : 1
                            )),
                            this._setSelRange(i, this.text.length),
                            t.preventDefault();
                }
            }
        }),
        (t.prototype._updateInputSelection = function (e) {
            this._elRef == this._tbx &&
                this._setSelRange(e, this._tbx.value.length);
        }),
        (t.prototype._getSelStart = function () {
            return this._tbx && this._tbx.value ? this._tbx.selectionStart : 0;
        }),
        (t.prototype._getSelEnd = function () {
            return this._tbx && this._tbx.value ? this._tbx.selectionEnd : 0;
        }),
        (t.prototype._setSelRange = function (e, t) {
            var i = this._tbx;
            this._elRef == i && wjcCore.setSelectionRange(i, e, t);
        }),
        t
    );
})(DropDown);
exports.ComboBox = ComboBox;
var AutoComplete = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        return (
            (o._cssMatch = "wj-autocomplete-match"),
            (o._minLength = 2),
            (o._maxItems = 6),
            (o._itemCount = 0),
            (o._delay = 500),
            (o._query = ""),
            (o._inCallback = !1),
            (o._srchProps = []),
            wjcCore.addClass(o.hostElement, "wj-autocomplete"),
            (o._bsCollapse = !1),
            (o.isEditable = !0),
            (o.isRequired = !1),
            (o.isContentHtml = !0),
            o.listBox.formatItem.addHandler(o._formatListItem, o),
            (o._itemsSourceFnCallBackBnd =
                o._itemSourceFunctionCallback.bind(o)),
            o.initialize(i),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "minLength", {
            get: function () {
                return this._minLength;
            },
            set: function (e) {
                this._minLength = wjcCore.asNumber(e, !1, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "maxItems", {
            get: function () {
                return this._maxItems;
            },
            set: function (e) {
                this._maxItems = wjcCore.asNumber(e, !1, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "delay", {
            get: function () {
                return this._delay;
            },
            set: function (e) {
                this._delay = wjcCore.asNumber(e, !1, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "searchMemberPath", {
            get: function () {
                return this._srchProp;
            },
            set: function (e) {
                (this._srchProp = wjcCore.asString(e)),
                    (this._srchProps = e ? e.trim().split(/\s*,\s*/) : []);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "itemsSourceFunction", {
            get: function () {
                return this._itemsSourceFn;
            },
            set: function (e) {
                (this._itemsSourceFn = wjcCore.asFunction(e)),
                    wjcCore.isFunction(this._itemsSourceFn) &&
                        this.itemsSourceFunction(
                            this.text,
                            this.maxItems,
                            this._itemsSourceFnCallBackBnd
                        );
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "cssMatch", {
            get: function () {
                return this._cssMatch;
            },
            set: function (e) {
                this._cssMatch = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype._keydown = function (t) {
            if (!t.defaultPrevented && this.isDroppedDown)
                switch (t.keyCode) {
                    case wjcCore.Key.Up:
                    case wjcCore.Key.Down:
                        this.selectAll();
                }
            e.prototype._keydown.call(this, t);
        }),
        (t.prototype._setText = function (e) {
            var t = this;
            if (!this._inCallback) {
                if (
                    (!e && this.selectedIndex > -1 && (this.selectedIndex = -1),
                    e != this._oldText &&
                        (this._tbx.value != e && (this._tbx.value = e),
                        (this._oldText = e),
                        this.onTextChanged(),
                        !e && this.collectionView))
                )
                    return (
                        (this._rxHighlight = null),
                        (this.collectionView.filter = this._query = null),
                        void (this.isDroppedDown = !1)
                    );
                this._toSearch && clearTimeout(this._toSearch),
                    e != this.getDisplayText() &&
                        (this._toSearch = setTimeout(function () {
                            t._toSearch = null;
                            var e = t.text.trim().toLowerCase();
                            if (e.length >= t._minLength && e != t._query) {
                                (t._query = e),
                                    (e = e.replace(
                                        /([.?*+^$[\]\\(){}|-])/g,
                                        "\\$1"
                                    ));
                                var i = wjcCore.escapeHtml(e);
                                (t._rxMatch = new RegExp(
                                    "(?=.*" + e.replace(/ /g, ")(?=.*") + ")",
                                    "ig"
                                )),
                                    (t._rxHighlight = t.isContentHtml
                                        ? new RegExp(
                                              "(" +
                                                  i.replace(/ /g, "|") +
                                                  ")(?![^<]*>|[^<>]* </)",
                                              "ig"
                                          )
                                        : new RegExp(
                                              "(" + i.replace(/ /g, "|") + ")",
                                              "ig"
                                          )),
                                    t.itemsSourceFunction
                                        ? t.itemsSourceFunction(
                                              e,
                                              t.maxItems,
                                              t._itemsSourceFnCallBackBnd
                                          )
                                        : t._updateItems();
                            }
                        }, this._delay));
            }
        }),
        (t.prototype._itemSourceFunctionCallback = function (e) {
            this._inCallback = !0;
            var t = wjcCore.asCollectionView(e);
            t && t.moveCurrentToPosition(-1),
                (this.itemsSource = t),
                (this._inCallback = !1),
                this.containsFocus() &&
                    ((this.isDroppedDown = !0), this.refresh());
        }),
        (t.prototype.onIsDroppedDownChanged = function (e) {
            if (
                (this.isDroppedDownChanged.raise(this, e),
                this.containsFocus() &&
                    !this.isDroppedDown &&
                    !this.isTouching &&
                    null == this.selectedItem)
            ) {
                var t = this.text.length;
                wjcCore.setSelectionRange(this._tbx, t);
            }
            this._query = "";
        }),
        (t.prototype._updateItems = function () {
            var e = this.collectionView;
            if (e) {
                (this._inCallback = !0),
                    e.beginUpdate(),
                    (this._itemCount = 0),
                    (e.filter = this._filter.bind(this)),
                    e.moveCurrentToPosition(-1),
                    e.endUpdate(),
                    (this._inCallback = !1);
                var t = e.items.length;
                (this.isDroppedDown = t > 0 && this.containsFocus()),
                    0 != t || this.isEditable || (this.selectedIndex = -1),
                    this.refresh();
            }
        }),
        (t.prototype._filter = function (e) {
            if (this._itemCount >= this._maxItems) return !1;
            var t = this._getItemText(e, !1);
            if (this._srchProps)
                for (var i = 0; i < this._srchProps.length; i++)
                    t += "\0" + e[this._srchProps[i]];
            return (
                this.isContentHtml && (t = t.replace(/<[^>]*>/g, "")),
                !!t.match(this._rxMatch) && (this._itemCount++, !0)
            );
        }),
        (t.prototype._getItemText = function (e, t) {
            var i = e ? e.toString() : "",
                o =
                    t && this.headerPath
                        ? this._pathHdr
                        : this._lbx._pathDisplay;
            return (
                o && (i = null != (i = o.getValue(e)) ? i.toString() : ""), i
            );
        }),
        (t.prototype._formatListItem = function (e, t) {
            if (this._cssMatch && this._rxHighlight) {
                var i = '<span class="' + this._cssMatch + '">$1</span>';
                t.item.innerHTML = t.item.innerHTML.replace(
                    this._rxHighlight,
                    i
                );
            }
        }),
        t
    );
})(ComboBox);
exports.AutoComplete = AutoComplete;
var Menu = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        o.itemClicked = new wjcCore.Event();
        var n = o.hostElement,
            s = o._tbx;
        wjcCore.addClass(n, "wj-menu"), (s.style.display = "none");
        (o._hdr = o._elRef =
            wjcCore.createElement(
                '<div wj-part="header" class="wj-form-control" style="cursor:default"/>'
            )),
            s.parentElement.insertBefore(o._hdr, o._tbx);
        var r = o._orgOuter.match(/tabindex="?(-?\d+)"?/i);
        return (
            r && (n.tabIndex = parseInt(r[1])),
            (o.isRequired = !1),
            wjcCore.setAttribute(n, "role", "menubar", !0),
            wjcCore.setAttribute(s, "role", null),
            wjcCore.setAttribute(s, "aria-autocomplete", null),
            wjcCore.setAttribute(s, "aria-owns", null),
            wjcCore.setAttribute(o.dropDown, "role", "menu"),
            (o.listBox.itemRole = "menuitem"),
            "SELECT" == o._orgTag &&
                ((o.header = n.getAttribute("header")),
                o._lbx.itemsSource && (o.commandParameterPath = "cmdParam")),
            (o.isContentHtml = !0),
            (o.maxDropDownHeight = 500),
            o.addEventListener(o._hdr, "click", function (e) {
                e.defaultPrevented ||
                    (o._isButton
                        ? ((o.isDroppedDown = !1), o._raiseCommand())
                        : (o.isDroppedDown = !o.isDroppedDown));
            }),
            o.listBox.lostFocus.addHandler(function () {
                o.containsFocus() || (o.isDroppedDown = !1);
            }),
            o.initialize(i),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "header", {
            get: function () {
                return this._hdr.innerHTML;
            },
            set: function (e) {
                this._hdr.innerHTML = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "command", {
            get: function () {
                return this._command;
            },
            set: function (e) {
                this._command = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "commandPath", {
            get: function () {
                return this._cmdPath;
            },
            set: function (e) {
                this._cmdPath = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "commandParameterPath", {
            get: function () {
                return this._cmdParamPath;
            },
            set: function (e) {
                this._cmdParamPath = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isButton", {
            get: function () {
                return this._isButton;
            },
            set: function (e) {
                this._isButton = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            set: function (e) {
                (this._owner = wjcCore.asType(e, HTMLElement, !0)),
                    this._enableDisableItems();
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.show = function (e) {
            if (!this.isDroppedDown) {
                var t = this.dropDown;
                (this.selectedIndex = -1),
                    this.onIsDroppedDownChanging(
                        new wjcCore.CancelEventArgs()
                    ) &&
                        (this.owner &&
                            (t[wjcCore.Control._OWNR_KEY] = this.owner),
                        wjcCore.showPopup(t, e),
                        this.onIsDroppedDownChanged(),
                        t.focus());
            }
        }),
        (t.prototype.hide = function () {
            this.isDroppedDown &&
                this.onIsDroppedDownChanging(new wjcCore.CancelEventArgs()) &&
                (wjcCore.hidePopup(this.dropDown),
                this.onIsDroppedDownChanged());
        }),
        (t.prototype.onItemClicked = function (e) {
            this.itemClicked.raise(this, e);
        }),
        (t.prototype.refresh = function (t) {
            e.prototype.refresh.call(this, t), this._enableDisableItems();
        }),
        (t.prototype.onIsDroppedDownChanged = function (t) {
            e.prototype.onIsDroppedDownChanged.call(this, t),
                this.isDroppedDown
                    ? ((this._closing = !0),
                      (this._defaultItem = this.selectedItem),
                      (this.isRequired = !1),
                      (this.selectedIndex = -1),
                      this._enableDisableItems(),
                      (this._closing = !1),
                      this.dropDown.focus())
                    : this.selectedItem ||
                      (this.selectedItem = this._defaultItem);
        }),
        (t.prototype._keydown = function (t) {
            t.defaultPrevented ||
                (t.keyCode == wjcCore.Key.Enter &&
                    (this.isDroppedDown
                        ? this.getDisplayText(this.selectedIndex) &&
                          this._raiseCommand()
                        : ((this.isDroppedDown = !0), t.preventDefault()))),
                e.prototype._keydown.call(this, t);
        }),
        (t.prototype._dropDownClick = function (t) {
            t.defaultPrevented ||
                t.target == this.dropDown ||
                (this.getDisplayText(this.selectedIndex) &&
                    this._raiseCommand()),
                e.prototype._dropDownClick.call(this, t);
        }),
        (t.prototype._raiseCommand = function (e) {
            var t = this.selectedItem,
                i = this._getCommand(t);
            if (i) {
                var o = this._cmdParamPath ? t[this._cmdParamPath] : null;
                if (!this._canExecuteCommand(i, o)) return;
                this._executeCommand(i, o);
            }
            this.onItemClicked(e);
        }),
        (t.prototype._getCommand = function (e) {
            var t = e && this.commandPath ? e[this.commandPath] : null;
            return t || this.command;
        }),
        (t.prototype._executeCommand = function (e, t) {
            e && !wjcCore.isFunction(e) && (e = e.executeCommand),
                wjcCore.isFunction(e) && e(t);
        }),
        (t.prototype._canExecuteCommand = function (e, t) {
            if (e) {
                var i = e.canExecuteCommand;
                if (wjcCore.isFunction(i)) return i(t);
            }
            return !0;
        }),
        (t.prototype._enableDisableItems = function () {
            if (this.collectionView && (this.command || this.commandPath))
                for (
                    var e = this.collectionView.items, t = 0;
                    t < e.length;
                    t++
                ) {
                    var i = this._getCommand(e[t]),
                        o = this.commandParameterPath
                            ? e[t][this.commandParameterPath]
                            : null;
                    if (i) {
                        var n = this._lbx.hostElement.children[t];
                        wjcCore.toggleClass(
                            n,
                            "wj-state-disabled",
                            !this._canExecuteCommand(i, o)
                        );
                    }
                }
        }),
        t
    );
})(ComboBox);
(exports.Menu = Menu),
    (wjcCore.culture.MultiSelect = window.wijmo.culture.MultiSelect || {
        itemsSelected: "{count:n0} items selected",
        selectAll: "Select All",
    });
var MultiSelect = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        return (
            (o._maxHdrItems = 2),
            (o._readOnly = !1),
            (o._hdrFmt = wjcCore.culture.MultiSelect.itemsSelected),
            (o.checkedItemsChanged = new wjcCore.Event()),
            wjcCore.addClass(o.hostElement, "wj-multiselect"),
            (o._tbx.readOnly = !0),
            (o.checkedMemberPath = null),
            o.addEventListener(o.inputElement, "click", function () {
                o.isDroppedDown = !o.isDroppedDown;
            }),
            o.addEventListener(o._selectAll, "click", function (e) {
                wjcCore.hasItems(o.collectionView) &&
                    e.target == o._selectAllCheckbox &&
                    (o.checkedItems = e.target.checked
                        ? o.collectionView.items
                        : []);
            }),
            o.removeEventListener(o.dropDown, "click"),
            o._updateHeader(),
            o.listBox.itemsChanged.addHandler(function () {
                o._updateHeader();
            }),
            o.listBox.checkedItemsChanged.addHandler(function () {
                o._updateHeader(), o.onCheckedItemsChanged();
            }),
            o.initialize(i),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "showSelectAllCheckbox", {
            get: function () {
                return "" == this._selectAll.style.display;
            },
            set: function (e) {
                this._selectAll.style.display = wjcCore.asBoolean(e)
                    ? ""
                    : "none";
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectAllLabel", {
            get: function () {
                return this._selectAllLabel;
            },
            set: function (e) {
                e != this._selectAllLabel &&
                    ((this._selectAllLabel = wjcCore.asString(e)),
                    this.refresh());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "checkedMemberPath", {
            get: function () {
                var e = this.listBox.checkedMemberPath;
                return e != t._DEF_CHECKED_PATH ? e : null;
            },
            set: function (e) {
                (e = wjcCore.asString(e)),
                    (this.listBox.checkedMemberPath = e || t._DEF_CHECKED_PATH);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "maxHeaderItems", {
            get: function () {
                return this._maxHdrItems;
            },
            set: function (e) {
                this._maxHdrItems != e &&
                    ((this._maxHdrItems = wjcCore.asNumber(e)),
                    this._updateHeader());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "headerFormat", {
            get: function () {
                return this._hdrFmt;
            },
            set: function (e) {
                e != this._hdrFmt &&
                    ((this._hdrFmt = wjcCore.asString(e)),
                    this._updateHeader());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "headerFormatter", {
            get: function () {
                return this._hdrFormatter;
            },
            set: function (e) {
                e != this._hdrFormatter &&
                    ((this._hdrFormatter = wjcCore.asFunction(e)),
                    this._updateHeader());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "checkedItems", {
            get: function () {
                return this.listBox.checkedItems;
            },
            set: function (e) {
                this.listBox.checkedItems = wjcCore.asArray(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.onCheckedItemsChanged = function (e) {
            this.checkedItemsChanged.raise(this, e);
        }),
        (t.prototype._createDropDown = function () {
            (this._selectAll = wjcCore.createElement(
                '<div class="wj-listbox-item wj-header wj-select-all" tabindex="0" style="display:none"><label><input type="checkbox"> <span></span></label></div>',
                this._dropDown
            )),
                (this._selectAllCheckbox = this._selectAll.querySelector(
                    "input[type=checkbox]"
                )),
                (this._selectAllSpan =
                    this._selectAll.querySelector("label>span")),
                wjcCore.setText(
                    this._selectAllSpan,
                    wjcCore.culture.MultiSelect.selectAll
                );
            var t = wjcCore.createElement(
                '<div style="width:100%;border:none"></div>',
                this._dropDown
            );
            (this._lbx = new ListBox(t)),
                e.prototype._createDropDown.call(this);
        }),
        Object.defineProperty(t.prototype, "isReadOnly", {
            get: function () {
                return this._readOnly;
            },
            set: function (e) {
                (this._readOnly = wjcCore.asBoolean(e)),
                    wjcCore.toggleClass(
                        this.hostElement,
                        "wj-state-readonly",
                        this.isReadOnly
                    );
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.refresh = function (t) {
            void 0 === t && (t = !0),
                e.prototype.refresh.call(this, t),
                this._updateHeader(),
                this._selectAllSpan &&
                    wjcCore.setText(
                        this._selectAllSpan,
                        this._selectAllLabel ||
                            wjcCore.culture.MultiSelect.selectAll
                    );
        }),
        (t.prototype.onIsDroppedDownChanged = function (t) {
            var i = this;
            e.prototype.onIsDroppedDownChanged.call(this, t),
                this.isDroppedDown &&
                    this.containsFocus() &&
                    setTimeout(function () {
                        i.listBox.focus();
                    }, 200);
        }),
        (t.prototype._setText = function (e, t) {}),
        (t.prototype._keydown = function (t) {
            e.prototype._keydown.call(this, t),
                !t.defaultPrevented &&
                    wjcCore.hasItems(this.collectionView) &&
                    t.keyCode > 32 &&
                    (this.isDroppedDown = !0);
        }),
        (t.prototype._updateHeader = function () {
            var e = this.checkedItems;
            if (wjcCore.isFunction(this._hdrFormatter))
                this.inputElement.value = this._hdrFormatter();
            else {
                var t = "";
                if (e.length > 0)
                    if (e.length <= this._maxHdrItems) {
                        if (this.displayMemberPath)
                            for (var i = 0; i < e.length; i++)
                                e[i] = e[i][this.displayMemberPath];
                        t = e.join(", ");
                    } else
                        t = wjcCore.format(this.headerFormat, {
                            count: e.length,
                        });
                this.inputElement.value = t;
            }
            var o = null,
                n = this.collectionView;
            wjcCore.hasItems(n) &&
                (0 == e.length
                    ? (o = !1)
                    : e.length == n.items.length && (o = !0)),
                (this._selectAllCheckbox.indeterminate = null == o),
                null != o && (this._selectAllCheckbox.checked = o),
                this._updateState();
        }),
        (t._DEF_CHECKED_PATH = "$checked"),
        t
    );
})(ComboBox);
exports.MultiSelect = MultiSelect;
var MultiAutoComplete = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        return (
            (o._selItems = []),
            (o._lastInputValue = ""),
            (o._selPath = new wjcCore.Binding(null)),
            (o._notAddItm = !1),
            (o.selectedItemsChanged = new wjcCore.Event()),
            wjcCore.addClass(o.hostElement, "wj-multi-autocomplete"),
            (o.showDropDownButton = !1),
            o.initialize(i),
            (o._wjTpl = o.hostElement.querySelector(".wj-template")),
            (o._wjInput = o.hostElement.querySelector(".wj-input")),
            o.addEventListener(o.hostElement, "keyup", o._keyup.bind(o), !0),
            o.addEventListener(window, "resize", o._adjustInputWidth.bind(o)),
            o.addEventListener(o._tbx, "focus", function () {
                o._itemOff();
            }),
            o._addHelperInput(),
            o._initSeltems(),
            o.listBox.itemsChanged.addHandler(function () {
                return (o.selectedIndex = -1);
            }),
            o._refreshHeader(),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "showDropDownButton", {
            set: function (e) {
                this._showBtn = !1;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "maxSelectedItems", {
            get: function () {
                return this._maxtems;
            },
            set: function (e) {
                this._maxtems != e &&
                    ((this._maxtems = wjcCore.asNumber(e, !0)),
                    this._updateMaxItems(),
                    this._refreshHeader(),
                    this._clearSelIndex());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectedMemberPath", {
            get: function () {
                return this._selPath.path;
            },
            set: function (e) {
                (e = wjcCore.asString(e)) !== this.selectedMemberPath &&
                    ((this._selPath.path = e),
                    this._initSeltems(),
                    this._refreshHeader(),
                    this.onSelectedItemsChanged());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectedItems", {
            get: function () {
                return this._selItems;
            },
            set: function (e) {
                if (
                    ((this._selItems = wjcCore.asArray(e)),
                    this.selectedMemberPath &&
                        "" !== this.selectedMemberPath &&
                        this._selItems)
                )
                    for (var t = 0; t < this._selItems.length; t++) {
                        var i = this._selItems[t];
                        this._setSelItem(i, !1);
                    }
                this._updateMaxItems(),
                    this.onSelectedItemsChanged(),
                    this._refreshHeader(),
                    this._clearSelIndex();
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.onSelectedItemsChanged = function (e) {
            this.selectedItemsChanged.raise(this, e);
        }),
        (t.prototype.onIsDroppedDownChanged = function (t) {
            !this.isDroppedDown &&
                this.selectedIndex > -1 &&
                !this._notAddItm &&
                this._addItem(!0),
                (this._notAddItm = !1),
                e.prototype.onIsDroppedDownChanged.call(this, t);
        }),
        (t.prototype.refresh = function (t) {
            e.prototype.refresh.call(this, t),
                this._initSeltems(),
                this.isDroppedDown || this._refreshHeader();
        }),
        (t.prototype._keydown = function (t) {
            if (!this.isReadOnly) {
                if (!t.defaultPrevented)
                    switch (t.keyCode) {
                        case wjcCore.Key.Back:
                            this._lastInputValue = this._tbx.value;
                            break;
                        case wjcCore.Key.Enter:
                            this._itemOff(),
                                this._addItem(!0),
                                wjcCore.isIE &&
                                    wjcCore.setSelectionRange(this._tbx, 0, 0);
                            break;
                        case wjcCore.Key.Tab:
                            this.isDroppedDown
                                ? (this._addItem(!1),
                                  (this._tbx.value = ""),
                                  (this._lbx.selectedIndex = -1),
                                  t.preventDefault())
                                : this._updateFocus();
                            break;
                        case wjcCore.Key.Space:
                            if ("" !== this._tbx.value) return;
                            this.isDroppedDown ||
                                this._tbx.disabled ||
                                ((this.isDroppedDown = !0),
                                this._clearSelIndex());
                            break;
                        case wjcCore.Key.Escape:
                            this.isDroppedDown && (this._notAddItm = !0);
                            break;
                        case wjcCore.Key.Left:
                            this._itemOn(!this.rightToLeft);
                            break;
                        case wjcCore.Key.Right:
                            this._itemOn(!!this.rightToLeft);
                            break;
                        case wjcCore.Key.Up:
                        case wjcCore.Key.Down:
                            var i = wjcCore.getActiveElement();
                            if (t.altKey) {
                                if (this._tbx == i)
                                    return (
                                        (this.isDroppedDown =
                                            !this.isDroppedDown),
                                        this.isDroppedDown || this._tbx.focus(),
                                        void t.preventDefault()
                                    );
                            } else if (this._tbx !== i) return;
                        default:
                            if (
                                t.keyCode === wjcCore.Key.Back ||
                                t.keyCode === wjcCore.Key.Delete
                            )
                                return;
                            this._itemOff(),
                                null != this._maxtems &&
                                    this._selItems.length >= this._maxtems &&
                                    t.preventDefault();
                    }
                this._tbx.disabled || e.prototype._keydown.call(this, t);
            }
        }),
        (t.prototype._updateState = function () {
            e.prototype._updateState.call(this),
                this._wjTpl &&
                    (wjcCore.hasClass(this.hostElement, "wj-state-focused") ||
                        this._itemOff());
        }),
        (t.prototype._keyup = function (e) {
            if (!this.isReadOnly && !e.defaultPrevented)
                switch (e.keyCode) {
                    case wjcCore.Key.Back:
                        0 === this._tbx.value.length &&
                            0 === this._lastInputValue.length &&
                            this._delItem(!1);
                        break;
                    case wjcCore.Key.Delete:
                        this._delItem(!0);
                }
        }),
        (t.prototype._addHelperInput = function () {
            var e = document.createElement("input");
            (e.type = "text"),
                (e.tabIndex = -1),
                (e.className = "wj-token-helper"),
                (e.readOnly = !0),
                this._wjTpl.insertBefore(e, this._wjInput),
                (this._helperInput = e);
        }),
        (t.prototype._refreshHeader = function () {
            for (
                var e = this.hostElement.querySelectorAll(".wj-token"), t = 0;
                t < e.length;
                t++
            )
                this._wjTpl.removeChild(e[t]);
            var i = this.selectedItems;
            if (i && 0 !== i.length) {
                for (t = 0; t < i.length; t++) this._insertToken(i[t]);
                (this._wjInput.style.cssFloat = this.rightToLeft
                    ? "right"
                    : "left"),
                    this._adjustInputWidth();
            }
        }),
        (t.prototype._insertToken = function (e) {
            var t = this._getItemText(e, !0);
            this.isContentHtml
                ? (this._cvt || (this._cvt = document.createElement("div")),
                  (this._cvt.innerHTML = t),
                  (t = this._cvt.textContent.trim()))
                : (t = wjcCore.escapeHtml(t)),
                this._wjTpl.insertBefore(this._createItem(t), this._wjInput);
        }),
        (t.prototype._updateMaxItems = function () {
            null != this._maxtems &&
                this._selItems &&
                this._selItems.length > this._maxtems &&
                (this._selItems = this._selItems.slice(0, this._maxtems));
        }),
        (t.prototype._updateFocus = function () {
            var e = this,
                i = this._wjTpl.querySelector("." + t._clsActive);
            i
                ? (wjcCore.removeClass(i, t._clsActive),
                  setTimeout(function () {
                      e._tbx.focus();
                  }))
                : (this._clearSelIndex(),
                  wjcCore.removeClass(this.hostElement, "wj-state-focused"));
        }),
        (t.prototype._addItem = function (e) {
            this.selectedItems.indexOf(this.selectedItem) > -1
                ? this._clearSelIndex()
                : this.selectedIndex > -1 &&
                  (this._updateSelItems(this.selectedItem, !0),
                  this._refreshHeader(),
                  e && this._clearSelIndex(),
                  this._disableInput(!0));
        }),
        (t.prototype._delItem = function (e) {
            var i,
                o,
                n = this._wjTpl.querySelector("." + t._clsActive),
                s = !1;
            (e && !n) ||
                (n
                    ? (o = this._getItemIndex(n)) > -1 &&
                      ((i = this._selItems[o]), (s = !0))
                    : this._selItems.length > 0 &&
                      ((i = this._selItems[this._selItems.length - 1]),
                      (s = !0)),
                s &&
                    (this._updateSelItems(i, !1),
                    this._refreshHeader(),
                    this._clearSelIndex(),
                    this._disableInput(!1)),
                this._tbx.focus());
        }),
        (t.prototype._updateSelItems = function (e, t) {
            if (t) {
                if (
                    ((this._selItems && 0 !== this._selItems.length) ||
                        (this._selItems = []),
                    null != this._maxtems &&
                        this._selItems.length >= this._maxtems)
                )
                    return;
                this._selItems.push(e);
            } else {
                var i = this._selItems.indexOf(e);
                this._selItems.splice(i, 1);
            }
            this._hasSelectedMemeberPath() && this._setSelItem(e, t),
                this.onSelectedItemsChanged();
        }),
        (t.prototype._createItem = function (e) {
            var i = this,
                o = document.createElement("div"),
                n = document.createElement("span"),
                s = document.createElement("a");
            return (
                o.appendChild(n),
                o.appendChild(s),
                (o.className = "wj-token"),
                (n.className = "wj-token-label"),
                (n.innerHTML = e),
                (s.className = "wj-token-close"),
                (s.href = "#"),
                (s.tabIndex = -1),
                (s.text = "×"),
                (o.style.cssFloat = this.rightToLeft ? "right" : "left"),
                this.addEventListener(o, "click", function (e) {
                    i._helperInput.focus();
                    var n = i._wjTpl.querySelector("." + t._clsActive);
                    n && wjcCore.removeClass(n, t._clsActive),
                        wjcCore.addClass(o, t._clsActive),
                        e.stopPropagation(),
                        e.preventDefault();
                }),
                this.addEventListener(s, "click", function (e) {
                    if (!i.isReadOnly) {
                        var t = i._getItemIndex(o);
                        if (t > -1) {
                            var n = i._selItems[t];
                            i._updateSelItems(n, !1);
                        }
                        i._wjTpl.removeChild(o),
                            i._adjustInputWidth(),
                            i._disableInput(!1),
                            i._tbx.focus(),
                            e.stopPropagation(),
                            e.preventDefault();
                    }
                }),
                o
            );
        }),
        (t.prototype._itemOn = function (e) {
            var i,
                o,
                n,
                s = wjcCore.getActiveElement();
            if (
                (this._tbx != s || 0 === this._tbx.value.length) &&
                0 !== (i = this._wjTpl.querySelectorAll(".wj-token")).length
            )
                if (
                    ((o = this._wjTpl.querySelector("." + t._clsActive)),
                    (n = this._getItemIndex(o)),
                    e)
                ) {
                    if (0 === n) return;
                    -1 === n
                        ? (wjcCore.addClass(i[i.length - 1], t._clsActive),
                          this._helperInput.focus())
                        : (wjcCore.removeClass(o, t._clsActive),
                          wjcCore.addClass(i[n - 1], t._clsActive),
                          this._helperInput.focus());
                } else if (!e) {
                    if (-1 === n) return;
                    n !== i.length - 1
                        ? (wjcCore.removeClass(o, t._clsActive),
                          wjcCore.addClass(i[n + 1], t._clsActive),
                          this._helperInput.focus())
                        : (wjcCore.removeClass(o, t._clsActive),
                          this._tbx.focus());
                }
        }),
        (t.prototype._itemOff = function () {
            var e = this._wjTpl.querySelector("." + t._clsActive);
            e && wjcCore.removeClass(e, t._clsActive);
        }),
        (t.prototype._initSeltems = function () {
            if (this.selectedMemberPath && "" !== this.selectedMemberPath) {
                var e = this.itemsSource;
                if ((this._selItems.splice(0, this._selItems.length), e))
                    for (var t = 0; t < e.sourceCollection.length; t++)
                        this._getSelItem(t) &&
                            this._selItems.push(e.sourceCollection[t]);
            }
        }),
        (t.prototype._getSelItem = function (e) {
            var t = this.itemsSource.sourceCollection[e];
            return (
                !(!wjcCore.isObject(t) || !this.selectedMemberPath) &&
                this._selPath.getValue(t)
            );
        }),
        (t.prototype._setSelItem = function (e, t) {
            this.itemsSource;
            wjcCore.isObject(e) &&
                this._selPath.getValue(e) != t &&
                this._selPath.setValue(e, t);
        }),
        (t.prototype._clearSelIndex = function () {
            this.selectedIndex = -1;
        }),
        (t.prototype._hasSelectedMemeberPath = function () {
            return this.selectedMemberPath && "" !== this.selectedMemberPath;
        }),
        (t.prototype._disableInput = function (e) {
            null != this._maxtems &&
                (this._selItems.length < this._maxtems
                    ? ((this._tbx.disabled = !1), this._tbx.focus())
                    : ((this._tbx.disabled = !0), this.hostElement.focus()));
        }),
        (t.prototype._adjustInputWidth = function () {
            this._tbx.style.width = "60px";
            var e,
                t = wjcCore.getElementRect(this.hostElement),
                i = wjcCore.getElementRect(this._tbx),
                o = getComputedStyle(this._tbx),
                n = parseInt(o.paddingLeft, 10),
                s = parseInt(o.paddingRight, 10);
            (e = this.rightToLeft
                ? i.left + i.width - t.left - n - s - 8
                : t.left + t.width - i.left - n - s - 8),
                (this._tbx.style.width = e + "px");
        }),
        (t.prototype._getItemIndex = function (e) {
            for (
                var t = this.hostElement.querySelectorAll(".wj-token"), i = 0;
                i < t.length;
                i++
            )
                if (e === t[i]) return i;
            return -1;
        }),
        (t._clsActive = "wj-token-active"),
        t
    );
})(AutoComplete);
exports.MultiAutoComplete = MultiAutoComplete;
var PopupTrigger;
!(function (e) {
    (e[(e.None = 0)] = "None"),
        (e[(e.Click = 1)] = "Click"),
        (e[(e.Blur = 2)] = "Blur"),
        (e[(e.ClickOrBlur = 3)] = "ClickOrBlur");
})((PopupTrigger = exports.PopupTrigger || (exports.PopupTrigger = {})));
var Popup = (function (e) {
    function t(t, i) {
        var o = e.call(this, t, null, !0) || this;
        (o._showTrigger = PopupTrigger.Click),
            (o._hideTrigger = PopupTrigger.Blur),
            (o._fadeIn = !0),
            (o._fadeOut = !0),
            (o._removeOnHide = !0),
            (o._click = o._handleClick.bind(o)),
            (o._mousedown = o._handleMouseDown.bind(o)),
            (o._visible = !1),
            (o.showing = new wjcCore.Event()),
            (o.shown = new wjcCore.Event()),
            (o.hiding = new wjcCore.Event()),
            (o.hidden = new wjcCore.Event());
        var n = o.hostElement;
        return (
            wjcCore.addClass(n, "wj-control wj-content wj-popup"),
            n.getAttribute("tabindex") || (n.tabIndex = 0),
            wjcCore.hidePopup(n, !1),
            o.addEventListener(n, "compositionstart", function (e) {
                o._composing = !0;
            }),
            o.addEventListener(n, "compositionend", function (e) {
                o._composing = !1;
            }),
            o.addEventListener(n, "keydown", function (e) {
                if (!e.defaultPrevented) {
                    if (
                        (e.keyCode != wjcCore.Key.Escape ||
                            o._composing ||
                            (e.preventDefault(), o.hide()),
                        e.keyCode == wjcCore.Key.Enter)
                    ) {
                        var t = o.dialogResultEnter;
                        t && (e.preventDefault(), o._validateAndHide(t));
                    }
                    e.keyCode == wjcCore.Key.Tab &&
                        o.modal &&
                        (e.preventDefault(),
                        wjcCore.moveFocus(n, e.shiftKey ? -1 : 1));
                }
            }),
            o.addEventListener(n, "click", function (e) {
                if (e.target instanceof HTMLElement) {
                    var t = e.target.className.match(/\bwj-hide[\S]*\b/);
                    t &&
                        t.length > 0 &&
                        (e.preventDefault(), e.stopPropagation(), o.hide(t[0]));
                }
            }),
            o.addEventListener(document, "wheel", function (e) {
                if (o.isVisible && o._modal) {
                    for (
                        var t = e.target;
                        t && t != document.body;
                        t = t.parentElement
                    )
                        if (t.scrollHeight > t.clientHeight) return;
                    e.preventDefault(), e.stopPropagation();
                }
            }),
            o.initialize(i),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "owner", {
            get: function () {
                return this._owner;
            },
            set: function (e) {
                this._owner &&
                    (this.removeEventListener(this._owner, "mousedown"),
                    this.removeEventListener(this._owner, "click")),
                    (this._owner = null != e ? wjcCore.getElement(e) : null),
                    this._owner &&
                        (this.addEventListener(
                            this._owner,
                            "mousedown",
                            this._mousedown,
                            !0
                        ),
                        this.addEventListener(
                            this._owner,
                            "click",
                            this._click,
                            !0
                        ));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "content", {
            get: function () {
                return this.hostElement.firstElementChild;
            },
            set: function (e) {
                e != this.content &&
                    ((this.hostElement.innerHTML = ""),
                    e instanceof HTMLElement &&
                        this.hostElement.appendChild(e));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "showTrigger", {
            get: function () {
                return this._showTrigger;
            },
            set: function (e) {
                this._showTrigger = wjcCore.asEnum(e, PopupTrigger);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "hideTrigger", {
            get: function () {
                return this._hideTrigger;
            },
            set: function (e) {
                this._hideTrigger = wjcCore.asEnum(e, PopupTrigger);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fadeIn", {
            get: function () {
                return this._fadeIn;
            },
            set: function (e) {
                this._fadeIn = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "fadeOut", {
            get: function () {
                return this._fadeOut;
            },
            set: function (e) {
                this._fadeOut = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "removeOnHide", {
            get: function () {
                return this._removeOnHide;
            },
            set: function (e) {
                this._removeOnHide = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "modal", {
            get: function () {
                return this._modal;
            },
            set: function (e) {
                this._modal = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isDraggable", {
            get: function () {
                return this._draggable;
            },
            set: function (e) {
                this._draggable = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dialogResult", {
            get: function () {
                return this._result;
            },
            set: function (e) {
                this._result = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "dialogResultEnter", {
            get: function () {
                return this._resultEnter;
            },
            set: function (e) {
                this._resultEnter = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isVisible", {
            get: function () {
                var e = this.hostElement;
                return this._visible && null != e && e.offsetHeight > 0;
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.show = function (e, t) {
            var i = this;
            if (!this.isVisible) {
                var o = this.hostElement;
                (this.dialogResult = null),
                    (this._callback = null),
                    this._hideAnim &&
                        (clearInterval(this._hideAnim),
                        (this._hideAnim = null));
                var n = new wjcCore.CancelEventArgs();
                this.onShowing(n) &&
                    (null != e && (this.modal = wjcCore.asBoolean(e)),
                    null != t && (this._callback = wjcCore.asFunction(t)),
                    wjcCore.showPopup(o, this._owner, !1, this._fadeIn, !1),
                    this._modal && this._showBackdrop(),
                    (this._composing = !1),
                    (this._visible = !0),
                    this.onShown(n),
                    this.modal &&
                        this.addEventListener(window, "focus", function () {
                            i.containsFocus() || wjcCore.moveFocus(o, 0);
                        }),
                    this._makeDraggable(this._draggable),
                    setTimeout(function () {
                        if (!i.isTouching) {
                            var e = o.querySelector("input[autofocus]");
                            e &&
                            e.clientHeight > 0 &&
                            !e.disabled &&
                            e.tabIndex > -1 &&
                            !wjcCore.closest(e, "[disabled],.wj-state-disabled")
                                ? (e.focus(), e.select())
                                : wjcCore.moveFocus(o, 0);
                        }
                        i.containsFocus() || ((o.tabIndex = 0), o.focus());
                    }, 200));
            }
        }),
        (t.prototype.hide = function (e) {
            var t = this;
            if ((this._makeDraggable(!1), this.isVisible)) {
                wjcCore.isUndefined(e) || (this.dialogResult = e);
                var i = new wjcCore.CancelEventArgs();
                if (this.onHiding(i)) {
                    for (
                        var o = this.hostElement.querySelectorAll(
                                ".wj-control.wj-dropdown"
                            ),
                            n = 0;
                        n < o.length;
                        n++
                    ) {
                        var s = wjcCore.Control.getControl(o[n]);
                        s instanceof DropDown && (s.isDroppedDown = !1);
                    }
                    this._modal &&
                        wjcCore.hidePopup(
                            this._bkdrop,
                            this.removeOnHide,
                            this.fadeOut
                        ),
                        (this._hideAnim = wjcCore.hidePopup(
                            this.hostElement,
                            this.removeOnHide,
                            this.fadeOut
                        )),
                        (this._visible = !1),
                        this.removeEventListener(window, "focus"),
                        this.containsFocus() && document.activeElement.blur(),
                        setTimeout(function () {
                            t._updateState(),
                                t.onHidden(i),
                                t._callback && t._callback(t);
                        });
                }
            }
        }),
        (t.prototype.onShowing = function (e) {
            return this.showing.raise(this, e), !e.cancel;
        }),
        (t.prototype.onShown = function (e) {
            this.shown.raise(this, e);
        }),
        (t.prototype.onHiding = function (e) {
            return this.hiding.raise(this, e), !e.cancel;
        }),
        (t.prototype.onHidden = function (e) {
            this.hidden.raise(this, e);
        }),
        (t.prototype.dispose = function () {
            (this._owner = null), e.prototype.dispose.call(this);
        }),
        (t.prototype.onLostFocus = function (t) {
            this.isVisible &&
                this._hideTrigger & PopupTrigger.Blur &&
                (this.containsFocus() || this.hide()),
                e.prototype.onLostFocus.call(this, t);
        }),
        (t.prototype.refresh = function (t) {
            if (
                (void 0 === t && (t = !0),
                e.prototype.refresh.call(this, t),
                this.isVisible && !this._refreshing)
            ) {
                this._refreshing = !0;
                var i = wjcCore.getActiveElement(),
                    o = this._owner
                        ? this._owner.getBoundingClientRect()
                        : null;
                wjcCore.showPopup(this.hostElement, o),
                    this._modal &&
                        i instanceof HTMLElement &&
                        i != wjcCore.getActiveElement() &&
                        i.focus(),
                    (this._refreshing = !1);
            }
        }),
        (t.prototype._makeDraggable = function (e) {
            var t,
                i,
                o = this,
                n = this.hostElement,
                s = n ? n.querySelector(".wj-dialog-header") : null,
                r = "mousedown",
                a = "mousemove",
                l = "mouseup",
                c = function (e) {
                    n &&
                        e.target == s &&
                        ((t = new wjcCore.Point(n.offsetLeft, n.offsetTop)),
                        (i = new wjcCore.Point(e.pageX, e.pageY)),
                        o.removeEventListener(document, a),
                        o.removeEventListener(document, l),
                        o.addEventListener(document, a, h),
                        o.addEventListener(document, l, u));
                },
                h = function (e) {
                    var s = Math.max(t.x + (e.pageX - i.x), 50 - n.offsetWidth),
                        r = Math.max(t.y + (e.pageY - i.y), 0);
                    wjcCore.setCss(n, { left: s, top: r }), (o._dragged = !0);
                },
                u = function (e) {
                    o.removeEventListener(document, a),
                        o.removeEventListener(document, l);
                };
            (this._dragged = !1),
                this.removeEventListener(n, r, c),
                e && s && this.addEventListener(n, r, c);
        }),
        (t.prototype._handleResize = function () {
            this.isVisible && !this._dragged && this.refresh();
        }),
        (t.prototype._handleClick = function (e) {
            this.isVisible
                ? this._hideTrigger & PopupTrigger.Click && this.hide()
                : this._showTrigger & PopupTrigger.Click &&
                  (this._wasVisible || this.show());
        }),
        (t.prototype._handleMouseDown = function (e) {
            this._wasVisible = this.isVisible;
        }),
        (t.prototype._showBackdrop = function () {
            var e = this;
            this._bkdrop ||
                ((this._bkdrop = document.createElement("div")),
                (this._bkdrop.tabIndex = -1),
                wjcCore.addClass(this._bkdrop, "wj-popup-backdrop"),
                this.addEventListener(this._bkdrop, "mousedown", function (t) {
                    t.preventDefault(),
                        t.stopPropagation(),
                        e.hostElement.focus(),
                        e.hideTrigger & PopupTrigger.Blur && e.hide();
                })),
                (this._bkdrop.style.display = "");
            var t = this.hostElement;
            t.parentElement.insertBefore(this._bkdrop, t);
        }),
        (t.prototype._validateAndHide = function (e) {
            var t = this.hostElement.querySelector(":invalid");
            t ? t.focus() : this.hide(e);
        }),
        t
    );
})(wjcCore.Control);
exports.Popup = Popup;
var InputDate = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        if (
            ((o._format = "d"),
            (o.valueChanged = new wjcCore.Event()),
            wjcCore.addClass(o.hostElement, "wj-inputdate"),
            (o._msk = new wjcCore._MaskProvider(o._tbx)),
            wjcCore.isIE9() || (o.inputType = "tel"),
            o._tbx.type.match(/date/i) && (o.inputType = ""),
            o.addEventListener(o.hostElement, "wheel", function (e) {
                if (
                    !e.defaultPrevented &&
                    !o.isDroppedDown &&
                    o.containsFocus() &&
                    null != o.value &&
                    o._canChangeValue()
                ) {
                    var t = wjcCore.clamp(-e.deltaY, -1, 1);
                    (o.value =
                        o.selectionMode == DateSelectionMode.Month
                            ? wjcCore.DateTime.addMonths(o.value, t)
                            : wjcCore.DateTime.addDays(o.value, t)),
                        o.selectAll(),
                        e.preventDefault();
                }
            }),
            (o.value = wjcCore.DateTime.newDate()),
            "INPUT" == o._orgTag)
        ) {
            var n = o._tbx.getAttribute("value");
            n && (o.value = wjcCore.Globalize.parseDate(n, "yyyy-MM-dd"));
        }
        return (o.isRequired = !0), o.initialize(i), o;
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (e) {
                wjcCore.DateTime.equals(this._value, e)
                    ? (this._tbx.value = wjcCore.Globalize.format(
                          e,
                          this.format
                      ))
                    : ((e = wjcCore.asDate(
                          e,
                          !this.isRequired || (null == e && null == this._value)
                      )),
                      (e = this._clamp(e)),
                      this._isValidDate(e)
                          ? ((this._tbx.value = e
                                ? wjcCore.Globalize.format(e, this.format)
                                : ""),
                            e == this._value ||
                                wjcCore.DateTime.equals(this._value, e) ||
                                ((this._value = e), this.onValueChanged()))
                          : (this._tbx.value = e
                                ? wjcCore.Globalize.format(
                                      this.value,
                                      this.format
                                  )
                                : ""),
                      this.text != this._oldText &&
                          ((this._oldText = this.text), this.onTextChanged()));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "text", {
            get: function () {
                return this._tbx.value;
            },
            set: function (e) {
                e != this.text && (this._setText(e, !0), this._commitText());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "selectionMode", {
            get: function () {
                return this.calendar.selectionMode;
            },
            set: function (e) {
                this.calendar.selectionMode = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "min", {
            get: function () {
                return this._calendar.min;
            },
            set: function (e) {
                this._calendar.min = wjcCore.asDate(e, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "max", {
            get: function () {
                return this._calendar.max;
            },
            set: function (e) {
                this._calendar.max = wjcCore.asDate(e, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "format", {
            get: function () {
                return this._format;
            },
            set: function (e) {
                e != this.format &&
                    ((this._format = wjcCore.asString(e)),
                    (this._tbx.value = wjcCore.Globalize.format(
                        this.value,
                        this.format
                    )));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "mask", {
            get: function () {
                return this._msk.mask;
            },
            set: function (e) {
                this._msk.mask = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "calendar", {
            get: function () {
                return this._calendar;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "inputElement", {
            get: function () {
                return this._tbx;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "inputType", {
            get: function () {
                return this._tbx.type;
            },
            set: function (e) {
                this._tbx.type = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "itemValidator", {
            get: function () {
                return this._calendar.itemValidator;
            },
            set: function (e) {
                e != this.itemValidator &&
                    ((this._calendar.itemValidator = wjcCore.asFunction(e)),
                    this.invalidate());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "itemFormatter", {
            get: function () {
                return this.calendar.itemFormatter;
            },
            set: function (e) {
                e != this.itemFormatter &&
                    (this.calendar.itemFormatter = wjcCore.asFunction(e));
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.onValueChanged = function (e) {
            this.valueChanged.raise(this, e);
        }),
        (t.prototype.refresh = function () {
            (this.isDroppedDown = !1),
                this._msk && this._msk.refresh(),
                this._calendar && this._calendar.refresh(),
                (this._tbx.value = wjcCore.Globalize.format(
                    this.value,
                    this.format
                ));
        }),
        (t.prototype.onIsDroppedDownChanged = function (t) {
            e.prototype.onIsDroppedDownChanged.call(this, t),
                this.isDroppedDown &&
                    ((this._calChanged = !1), this.dropDown.focus());
        }),
        (t.prototype._createDropDown = function () {
            var e = this;
            (this._calendar = new Calendar(this._dropDown)),
                this._calendar.valueChanged.addHandler(function () {
                    (e.value = wjcCore.DateTime.fromDateTime(
                        e._calendar.value,
                        e.value
                    )),
                        (e._calChanged = !0);
                }),
                this.addEventListener(this._dropDown, "mouseup", function (t) {
                    e._calChanged &&
                    !wjcCore.closest(t.target, ".wj-calendar-header")
                        ? (e.isDroppedDown = !1)
                        : "btn-today" == t.target.getAttribute("wj-part") &&
                          (e.isDroppedDown = !1);
                });
        }),
        (t.prototype._updateDropDown = function () {
            this._commitText();
            var t = this._calendar;
            (t.value = this.value),
                (t.min = this.min),
                (t.max = this.max),
                this.selectionMode != DateSelectionMode.Month &&
                    (t.monthView = !0);
            var i = getComputedStyle(this.hostElement);
            (this._dropDown.style.minWidth =
                18 * parseFloat(i.fontSize) + "px"),
                this._calendar.refresh(),
                e.prototype._updateDropDown.call(this);
        }),
        (t.prototype._keydown = function (t) {
            if (!(t.defaultPrevented || t.altKey || t.ctrlKey || t.metaKey))
                switch (t.keyCode) {
                    case wjcCore.Key.Enter:
                        this._commitText(), this.selectAll();
                        break;
                    case wjcCore.Key.Escape:
                        (this.text = wjcCore.Globalize.format(
                            this.value,
                            this.format
                        )),
                            this.selectAll();
                        break;
                    case wjcCore.Key.Up:
                    case wjcCore.Key.Down:
                        if (
                            !this.isDroppedDown &&
                            this.value &&
                            this._canChangeValue()
                        ) {
                            var i = t.keyCode == wjcCore.Key.Up ? 1 : -1,
                                o =
                                    this.selectionMode ==
                                    DateSelectionMode.Month
                                        ? wjcCore.DateTime.addMonths(
                                              this.value,
                                              i
                                          )
                                        : wjcCore.DateTime.addDays(
                                              this.value,
                                              i
                                          );
                            (this.value = wjcCore.DateTime.fromDateTime(
                                o,
                                this.value
                            )),
                                this.selectAll(),
                                t.preventDefault();
                        }
                }
            e.prototype._keydown.call(this, t);
        }),
        (t.prototype._canChangeValue = function () {
            return (
                !this.isReadOnly && this.selectionMode != DateSelectionMode.None
            );
        }),
        (t.prototype._clamp = function (e) {
            return this.calendar._clamp(e);
        }),
        (t.prototype._commitText = function () {
            var e = this._tbx.value;
            if (e || this.isRequired) {
                var t = wjcCore.Globalize.parseDate(e, this.format);
                t
                    ? (this.value = wjcCore.DateTime.fromDateTime(
                          t,
                          this.value
                      ))
                    : (this._tbx.value = wjcCore.Globalize.format(
                          this.value,
                          this.format
                      ));
            } else this.value = null;
        }),
        (t.prototype._isValidDate = function (e) {
            if (e) {
                if (this._clamp(e) != e) return !1;
                if (this.itemValidator && !this.itemValidator(e)) return !1;
            }
            return !0;
        }),
        t
    );
})(DropDown);
exports.InputDate = InputDate;
var InputTime = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        if (
            ((o._format = "t"),
            (o.valueChanged = new wjcCore.Event()),
            wjcCore.addClass(o.hostElement, "wj-inputtime"),
            (o._value = wjcCore.DateTime.newDate()),
            (o._msk = new wjcCore._MaskProvider(o._tbx)),
            wjcCore.isIE9() || (o._tbx.type = "tel"),
            "INPUT" == o._orgTag)
        ) {
            var n = o._tbx.getAttribute("value");
            n && (o.value = wjcCore.Globalize.parseDate(n, "HH:mm:ss"));
        }
        return (o.step = 15), (o.autoExpandSelection = !0), o.initialize(i), o;
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "inputElement", {
            get: function () {
                return this._tbx;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "inputType", {
            get: function () {
                return this._tbx.type;
            },
            set: function (e) {
                this._tbx.type = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (e) {
                (e = wjcCore.asDate(e, !this.isRequired)) &&
                    (null != this._min &&
                        this._getTime(e) < this._getTime(this._min) &&
                        (e = wjcCore.DateTime.fromDateTime(e, this._min)),
                    null != this._max &&
                        this._getTime(e) > this._getTime(this._max) &&
                        (e = wjcCore.DateTime.fromDateTime(e, this._max))),
                    this._setText(
                        e ? wjcCore.Globalize.format(e, this.format) : "",
                        !0
                    ),
                    this.selectedItem &&
                        this.selectedItem.value &&
                        (e = wjcCore.DateTime.fromDateTime(
                            e,
                            this.selectedItem.value
                        )),
                    e == this._value ||
                        wjcCore.DateTime.equals(e, this._value) ||
                        ((this._value = e), this.onValueChanged());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "text", {
            get: function () {
                return this._tbx.value;
            },
            set: function (e) {
                e != this.text && (this._setText(e, !0), this._commitText());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "min", {
            get: function () {
                return this._min;
            },
            set: function (e) {
                (this._min = wjcCore.asDate(e, !0)),
                    (this.isDroppedDown = !1),
                    this._updateItems();
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "max", {
            get: function () {
                return this._max;
            },
            set: function (e) {
                (this._max = wjcCore.asDate(e, !0)),
                    (this.isDroppedDown = !1),
                    this._updateItems();
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "step", {
            get: function () {
                return this._step;
            },
            set: function (e) {
                (this._step = wjcCore.asNumber(e, !0)),
                    (this.isDroppedDown = !1),
                    this._updateItems();
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "format", {
            get: function () {
                return this._format;
            },
            set: function (e) {
                e != this.format &&
                    ((this._format = wjcCore.asString(e)),
                    (this._tbx.value = wjcCore.Globalize.format(
                        this.value,
                        this.format
                    )),
                    wjcCore.hasItems(this.collectionView) &&
                        this._updateItems());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "mask", {
            get: function () {
                return this._msk.mask;
            },
            set: function (e) {
                this._msk.mask = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.onValueChanged = function (e) {
            this.valueChanged.raise(this, e);
        }),
        (t.prototype.onItemsSourceChanged = function (t) {
            e.prototype.onItemsSourceChanged.call(this, t),
                (this._hasCustomItems = null != this.itemsSource);
        }),
        (t.prototype._updateInputSelection = function (t) {
            if (this._delKey) e.prototype._updateInputSelection.call(this, t);
            else {
                for (
                    var i = this._tbx.value;
                    t < i.length && !i[t].match(/[a-z0-9]/i);

                )
                    t++;
                wjcCore.setSelectionRange(this._tbx, t, this._tbx.value.length);
            }
        }),
        (t.prototype.refresh = function () {
            (this.isDroppedDown = !1),
                this._msk.refresh(),
                (this._tbx.value = wjcCore.Globalize.format(
                    this.value,
                    this.format
                )),
                this._updateItems();
        }),
        (t.prototype.onSelectedIndexChanged = function (t) {
            if (this.selectedIndex > -1 && !this._settingText) {
                var i = this.value ? this.value : wjcCore.DateTime.newDate(),
                    o =
                        null != this.selectedItem.value
                            ? this.selectedItem.value
                            : wjcCore.Globalize.parseDate(
                                  this.text,
                                  this.format
                              );
                this.value = wjcCore.DateTime.fromDateTime(i, o);
            }
            e.prototype.onSelectedIndexChanged.call(this, t);
        }),
        (t.prototype._updateItems = function () {
            if (!this._hasCustomItems) {
                var e = [],
                    t = wjcCore.DateTime.newDate(0, 0, 0, 0, 0),
                    i = wjcCore.DateTime.newDate(0, 0, 0, 23, 59, 59);
                if (
                    (this.min &&
                        t.setHours(
                            this.min.getHours(),
                            this.min.getMinutes(),
                            this.min.getSeconds()
                        ),
                    this.max &&
                        i.setHours(
                            this.max.getHours(),
                            this.max.getMinutes(),
                            this.max.getSeconds()
                        ),
                    wjcCore.isNumber(this.step) && this.step > 0)
                )
                    for (
                        var o = t;
                        o <= i;
                        o = wjcCore.DateTime.addMinutes(o, this.step)
                    )
                        e.push({
                            value: o,
                            text: wjcCore.Globalize.format(o, this.format),
                        });
                var n = this.value;
                (this._settingText = !0),
                    (this.displayMemberPath = "text"),
                    (this.selectedValuePath = "text"),
                    (this.itemsSource = e),
                    (this._hasCustomItems = !1),
                    (this._settingText = !1),
                    (this.value = n);
            }
        }),
        (t.prototype._getTime = function (e) {
            return 3600 * e.getHours() + 60 * e.getMinutes() + e.getSeconds();
        }),
        (t.prototype._keydown = function (t) {
            if ((e.prototype._keydown.call(this, t), !t.defaultPrevented))
                switch (t.keyCode) {
                    case wjcCore.Key.Enter:
                        this.isDroppedDown ||
                            (this._commitText(), this.selectAll());
                        break;
                    case wjcCore.Key.Escape:
                        (this.text = wjcCore.Globalize.format(
                            this.value,
                            this.format
                        )),
                            this.selectAll();
                }
        }),
        (t.prototype._commitText = function () {
            if (this.text || this.isRequired) {
                var e = this.value
                    ? wjcCore.Globalize.format(this.value, this.format)
                    : null;
                if (this.text != e) {
                    var t =
                        this.selectedItem && this.selectedItem.value
                            ? this.selectedItem.value
                            : wjcCore.Globalize.parseDate(
                                  this.text,
                                  this.format
                              );
                    t
                        ? (this.value = wjcCore.DateTime.fromDateTime(
                              this.value,
                              t
                          ))
                        : (this._tbx.value = e);
                }
            } else this.value = null;
        }),
        t
    );
})(ComboBox);
exports.InputTime = InputTime;
var InputDateTime = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        wjcCore.addClass(o.hostElement, "wj-inputdatetime"),
            (o._btnTm = o.hostElement.querySelector('[wj-part="btn-tm"]')),
            (o._format = "g"),
            (o._inputTime = new InputTime(document.createElement("div"))),
            o._inputTime.valueChanged.addHandler(function () {
                (o.value = wjcCore.DateTime.fromDateTime(
                    o.value,
                    o._inputTime.value
                )),
                    o.containsFocus() &&
                        ((o.isTouching && o.showDropDownButton) ||
                            o.selectAll());
            });
        var n = o._inputTime.dropDown,
            s = o._keydown.bind(o);
        return (
            o.addEventListener(n, "keydown", s, !0),
            o.addEventListener(
                n,
                "blur",
                function () {
                    o._updateFocusState();
                },
                !0
            ),
            o.addEventListener(o._btnTm, "click", o._btnclick.bind(o)),
            o.addEventListener(o._btn, "mousedown", function () {
                o._setDropdown(o.calendar.hostElement);
            }),
            o.addEventListener(o._btnTm, "mousedown", function (e) {
                o.isDroppedDown && o.dropDown == n && e.preventDefault(),
                    (o._inputTime.dropDownCssClass = o.dropDownCssClass),
                    o._setDropdown(n);
            }),
            o.initialize(i),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "timeMin", {
            get: function () {
                return this._inputTime.min;
            },
            set: function (e) {
                this._inputTime.min = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "timeMax", {
            get: function () {
                return this._inputTime.max;
            },
            set: function (e) {
                this._inputTime.max = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "timeFormat", {
            get: function () {
                return this._inputTime.format;
            },
            set: function (e) {
                this._inputTime.format = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "timeStep", {
            get: function () {
                return this._inputTime.step;
            },
            set: function (e) {
                this._inputTime.step = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "inputTime", {
            get: function () {
                return this._inputTime;
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.dispose = function () {
            this._setDropdown(this.calendar.hostElement),
                e.prototype.dispose.call(this),
                this._inputTime.dispose();
        }),
        (t.prototype.refresh = function () {
            this._setDropdown(this.calendar.hostElement),
                e.prototype.refresh.call(this),
                this._inputTime.refresh();
        }),
        (t.prototype._updateBtn = function () {
            e.prototype._updateBtn.call(this),
                this._btnTm &&
                    ((this._btnTm.tabIndex = this._btn.tabIndex),
                    (this._btnTm.parentElement.style.display =
                        this._btn.style.display));
        }),
        (t.prototype._clamp = function (e) {
            return (
                e &&
                    (this.min && e < this.min && (e = this.min),
                    this.max && e > this.max && (e = this.max)),
                e
            );
        }),
        (t.prototype._commitText = function () {
            var e = this._tbx.value;
            if (e || this.isRequired) {
                var t = wjcCore.Globalize.parseDate(e, this.format);
                t
                    ? (this.value = t)
                    : (this._tbx.value = wjcCore.Globalize.format(
                          this.value,
                          this.format
                      ));
            } else this.value = null;
        }),
        (t.prototype._setDropdown = function (e) {
            this._dropDown != e &&
                (this.isDroppedDown && (this.isDroppedDown = !1),
                (this._dropDown = e));
        }),
        (t.prototype._updateDropDown = function () {
            var t = this._inputTime;
            this._dropDown == t.dropDown
                ? (this._commitText(),
                  e.prototype._updateDropDown.call(this),
                  (t.isRequired = this.isRequired),
                  (t.value = this.value),
                  this.isDroppedDown && t.listBox.showSelection())
                : e.prototype._updateDropDown.call(this);
        }),
        (t.controlTemplate =
            '<div style="position:relative" class="wj-template"><div class="wj-input"><div class="wj-input-group wj-input-btn-visible"><input wj-part="input" type="text" class="wj-form-control" /><span class="wj-input-group-btn" tabindex="-1"><button wj-part="btn" class="wj-btn wj-btn-default" type="button" tabindex="-1"><span class="wj-glyph-calendar"></span></button><button wj-part="btn-tm" class="wj-btn wj-btn-default" type="button" tabindex="-1"><span class="wj-glyph-clock"></span></button></span></div></div><div wj-part="dropdown" class="wj-content wj-dropdown-panel" style="display:none;position:absolute;z-index:100;width:auto"></div></div>'),
        t
    );
})(InputDate);
exports.InputDateTime = InputDateTime;
var InputNumber = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        (o._showBtn = !0),
            (o._readOnly = !1),
            (o.textChanged = new wjcCore.Event()),
            (o.valueChanged = new wjcCore.Event());
        var n = o.hostElement;
        wjcCore.setAttribute(n, "role", "spinbutton", !0);
        var s = o.getTemplate();
        o.applyTemplate(
            "wj-control wj-inputnumber wj-content",
            s,
            { _tbx: "input", _btnUp: "btn-inc", _btnDn: "btn-dec" },
            "input"
        ),
            o._tbx.type.match(/number/i) && (o.inputType = "");
        var r = o._tbx;
        (r.autocomplete = "off"),
            (r.spellcheck = !1),
            o._updateSymbols(),
            o.addEventListener(o._tbx, "compositionstart", function () {
                o._composing = !0;
            }),
            o.addEventListener(o._tbx, "compositionend", function () {
                (o._composing = !1),
                    setTimeout(function () {
                        o._setText(o.text);
                    });
            }),
            o.addEventListener(r, "keypress", o._keypress.bind(o)),
            o.addEventListener(r, "keydown", o._keydown.bind(o)),
            o.addEventListener(r, "input", o._input.bind(o));
        var a = o._clickSpinner.bind(o);
        return (
            o.addEventListener(o._btnUp, "click", a),
            o.addEventListener(o._btnDn, "click", a),
            (o._rptUp = new wjcCore._ClickRepeater(
                o._btnUp.querySelector("button")
            )),
            (o._rptDn = new wjcCore._ClickRepeater(
                o._btnDn.querySelector("button")
            )),
            o.addEventListener(n, "wheel", function (e) {
                if (!e.defaultPrevented && !o.isReadOnly && o.containsFocus()) {
                    var t = wjcCore.clamp(-e.deltaY, -1, 1);
                    o._increment((o.step || 1) * t),
                        setTimeout(function () {
                            return o.selectAll();
                        }),
                        e.preventDefault();
                }
            }),
            (o.value = 0),
            (o.isRequired = !0),
            o.initialize(i),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "inputElement", {
            get: function () {
                return this._tbx;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "inputType", {
            get: function () {
                return this._tbx.type;
            },
            set: function (e) {
                this._tbx.type = wjcCore.asString(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (e) {
                if (e != this._value)
                    if (
                        null ==
                        (e = wjcCore.asNumber(
                            e,
                            !this.isRequired ||
                                (null == e && null == this._value)
                        ))
                    )
                        this._setText("");
                    else if (!isNaN(e)) {
                        var t = wjcCore.Globalize.format(e, this.format);
                        this._setText(t);
                    }
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isRequired", {
            get: function () {
                return this._tbx.required;
            },
            set: function (e) {
                this._tbx.required = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isReadOnly", {
            get: function () {
                return this._readOnly;
            },
            set: function (e) {
                (this._readOnly = wjcCore.asBoolean(e)),
                    (this.inputElement.readOnly = this._readOnly),
                    wjcCore.toggleClass(
                        this.hostElement,
                        "wj-state-readonly",
                        this.isReadOnly
                    );
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "min", {
            get: function () {
                return this._min;
            },
            set: function (e) {
                this._min = wjcCore.asNumber(e, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "max", {
            get: function () {
                return this._max;
            },
            set: function (e) {
                this._max = wjcCore.asNumber(e, !0);
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "step", {
            get: function () {
                return this._step;
            },
            set: function (e) {
                (this._step = wjcCore.asNumber(e, !0)), this._updateBtn();
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "format", {
            get: function () {
                return this._format;
            },
            set: function (e) {
                e != this.format &&
                    ((this._format = wjcCore.asString(e)), this.refresh());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "text", {
            get: function () {
                return this._tbx.value;
            },
            set: function (e) {
                e != this.text && ((this._oldText = null), this._setText(e));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "placeholder", {
            get: function () {
                return this._tbx.placeholder;
            },
            set: function (e) {
                this._tbx.placeholder = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "showSpinner", {
            get: function () {
                return this._showBtn;
            },
            set: function (e) {
                (this._showBtn = wjcCore.asBoolean(e)), this._updateBtn();
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "repeatButtons", {
            get: function () {
                return !this._rptUp.disabled;
            },
            set: function (e) {
                this._rptUp.disabled = this._rptDn.disabled =
                    !wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.selectAll = function () {
            var e = this._tbx;
            wjcCore.setSelectionRange(e, 0, e.value.length);
        }),
        (t.prototype.onTextChanged = function (e) {
            this.textChanged.raise(this, e), this._updateState();
        }),
        (t.prototype.onValueChanged = function (e) {
            this._updateAria(), this.valueChanged.raise(this, e);
        }),
        (t.prototype.dispose = function () {
            (this._rptUp.element = null),
                (this._rptDn.element = null),
                e.prototype.dispose.call(this);
        }),
        (t.prototype.onGotFocus = function (t) {
            this.isTouching || (this._tbx.focus(), this.selectAll()),
                e.prototype.onGotFocus.call(this, t);
        }),
        (t.prototype.onLostFocus = function (t) {
            this._composing &&
                ((this._composing = !1), this._setText(this.text));
            var i = this._clamp(this.value),
                o = wjcCore.Globalize.format(i, this.format);
            this._setText(o), e.prototype.onLostFocus.call(this, t);
        }),
        (t.prototype.refresh = function (e) {
            this._updateSymbols();
            var t = wjcCore.Globalize.format(this.value, this.format);
            this._setText(t);
        }),
        (t.prototype._updateSymbols = function () {
            var e = wjcCore.culture.Globalize.numberFormat,
                t = this.format
                    ? this.format.match(/([a-z])(\d*)(,*)(.*)/i)
                    : null;
            (this._chrDec = e["."] || "."),
                (this._chrCur = t && t[4] ? t[4] : e.currency.symbol || "$"),
                (this._fmtSpc = t && t[1] ? t[1].toLowerCase() : "n"),
                (this._fmtPrc = t && t[2] ? parseInt(t[2]) : null),
                (this._rxSym = new RegExp(
                    "^[%+\\-() " + this._chrDec + this._chrCur + "]*$"
                )),
                (this._rxNeg = new RegExp("(\\-|\\()"));
        }),
        (t.prototype._clamp = function (e) {
            return wjcCore.clamp(e, this.min, this.max);
        }),
        (t.prototype._isNumeric = function (e, t) {
            var i = e == this._chrDec || (e >= "0" && e <= "9"),
                o = "x" == this._fmtSpc;
            return (
                !i &&
                    o &&
                    (i = (e >= "a" && e <= "f") || (e >= "A" && e <= "F")),
                i || t || o || (i = "+-()".indexOf(e) > -1),
                i
            );
        }),
        (t.prototype._getInputRange = function (e) {
            for (
                var t = [0, 0], i = this.text, o = !1, n = 0;
                n < i.length;
                n++
            )
                this._isNumeric(i[n], e) &&
                    (o || ((t[0] = n), (o = !0)), (t[1] = n + 1));
            return t;
        }),
        (t.prototype._flipSign = function () {
            var e = this._getSelStartDigits();
            (this.value *= -1), this._setSelStartDigits(e);
        }),
        (t.prototype._getSelStartDigits = function () {
            for (
                var e = 0,
                    t = this._tbx.selectionStart,
                    i = this._tbx.value,
                    o = 0;
                o < i.length && o < t;
                o++
            )
                this._isNumeric(i[o], !0) && e++;
            return e;
        }),
        (t.prototype._setSelStartDigits = function (e) {
            for (var t = this._tbx.value, i = 0; i < t.length && e >= 0; i++)
                if (this._isNumeric(t[i], !0)) {
                    if (!e) {
                        wjcCore.setSelectionRange(this._tbx, i);
                        break;
                    }
                    e--;
                } else if (!e) {
                    wjcCore.setSelectionRange(this._tbx, i);
                    break;
                }
        }),
        (t.prototype._increment = function (e) {
            if (e) {
                var t = this._clamp(
                        wjcCore.isNumber(this.value) ? this.value + e : 0
                    ),
                    i = wjcCore.Globalize.format(t, this.format, !1, !1);
                this._setText(i);
            }
        }),
        (t.prototype._updateBtn = function () {
            var e = this.showSpinner && !!this.step,
                t = e;
            wjcCore.setCss([this._btnUp, this._btnDn], {
                display: e ? "" : "none",
            }),
                wjcCore.toggleClass(
                    this.hostElement,
                    "wj-input-show-spinner",
                    e
                ),
                wjcCore.enable(this._btnUp, t),
                wjcCore.enable(this._btnDn, t),
                this._updateAria();
        }),
        (t.prototype._setText = function (e) {
            if (!this._composing) {
                var t = this._tbx,
                    i = this._rxNeg.test(e),
                    o = this._delKey;
                if (
                    (e &&
                        this._rxSym.test(e) &&
                        (e = this.isRequired || !o ? "0" : ""),
                    (this._delKey = !1),
                    o && 0 == this.value && !this.isRequired && (e = ""),
                    !e)
                ) {
                    if (!this.isRequired)
                        return (
                            (t.value = ""),
                            null != this._value &&
                                ((this._value = null), this.onValueChanged()),
                            this._oldText &&
                                ((this._oldText = e), this.onTextChanged()),
                            void this._updateBtn()
                        );
                    e = "0";
                }
                var n =
                        this._format ||
                        (e.indexOf(this._chrDec) > -1 ? "n2" : "n0"),
                    s = wjcCore.Globalize.parseFloat(e, n);
                if (isNaN(s)) t.value = this._oldText;
                else {
                    var r = wjcCore.Globalize.format(s, n, !1);
                    i && s >= 0 && (r = "-" + r),
                        (null != this._fmtPrc && "g" != this._fmtSpc) ||
                            (!o &&
                                t.value.match(/\.0?$/) &&
                                (r = e + ("0" == e ? this._chrDec : ""))),
                        t.value != r &&
                            ((t.value = r),
                            (s = wjcCore.Globalize.parseFloat(r, this.format))),
                        s != this._value &&
                            ((this._value = s), this.onValueChanged()),
                        this.text != this._oldText &&
                            ((this._oldText = this.text), this.onTextChanged()),
                        this._updateBtn();
                }
            }
        }),
        (t.prototype._keypress = function (e) {
            if (
                !(e.defaultPrevented || this._composing || this.isReadOnly) &&
                e.charCode &&
                !e.ctrlKey &&
                !e.metaKey
            ) {
                var t = this._tbx,
                    i = String.fromCharCode(e.charCode);
                if (this._isNumeric(i, !1)) {
                    var o = this._getInputRange(!0),
                        n = t.selectionStart,
                        s = t.selectionEnd;
                    if (
                        (n < o[0] &&
                            s < t.value.length &&
                            wjcCore.setSelectionRange(t, o[0], s),
                        n >= o[1])
                    ) {
                        var r = null != this._fmtPrc ? this._fmtPrc : 2,
                            a = t.value.indexOf(this._chrDec);
                        a > -1 && n - a > r && e.preventDefault();
                    }
                } else e.preventDefault();
                switch (i) {
                    case "-":
                        this.min >= 0
                            ? this.value < 0 && this._flipSign()
                            : this.value && t.selectionStart == t.selectionEnd
                            ? this._flipSign()
                            : this._clamp(-1) < 0 &&
                              ((t.value = "-"),
                              wjcCore.setSelectionRange(t, 1)),
                            e.preventDefault();
                        break;
                    case "+":
                        this.value < 0 && this._flipSign(), e.preventDefault();
                        break;
                    case this._chrDec:
                        if (0 == this._fmtPrc) e.preventDefault();
                        else {
                            var l = t.value.indexOf(i);
                            l > -1 &&
                                (t.selectionStart <= l && l++,
                                wjcCore.setSelectionRange(t, l),
                                e.preventDefault());
                        }
                }
            }
        }),
        (t.prototype._keydown = function (e) {
            var t = this;
            if (
                ((this._delKey = !1), !e.defaultPrevented && !this._composing)
            ) {
                var i = this._tbx,
                    o = i.value,
                    n = i.selectionStart,
                    s = i.selectionEnd;
                switch (e.keyCode) {
                    case 65:
                        e.ctrlKey &&
                            (setTimeout(function () {
                                t.selectAll();
                            }),
                            e.preventDefault());
                        break;
                    case wjcCore.Key.Up:
                    case wjcCore.Key.Down:
                        this.step &&
                            !this.isReadOnly &&
                            (this._increment(
                                this.step *
                                    (e.keyCode == wjcCore.Key.Up ? 1 : -1)
                            ),
                            setTimeout(function () {
                                t.selectAll();
                            }),
                            e.preventDefault());
                        break;
                    case wjcCore.Key.Back:
                        if (
                            ((this._delKey = !0), s - n < 2 && !this.isReadOnly)
                        ) {
                            var r = o[s - 1];
                            (r != this._chrDec && "%" != r && ")" != r) ||
                                (setTimeout(function () {
                                    (s =
                                        "%" == r
                                            ? t._getInputRange(!0)[1]
                                            : s - 1),
                                        wjcCore.setSelectionRange(i, s);
                                }),
                                e.preventDefault());
                        }
                        break;
                    case wjcCore.Key.Delete:
                        if (
                            ((this._delKey = !0), s - n < 2 && !this.isReadOnly)
                        )
                            if ("0" == o && 1 == n)
                                wjcCore.setSelectionRange(i, 0);
                            else {
                                var a = o[n];
                                (a != this._chrDec && "%" != a) ||
                                    (setTimeout(function () {
                                        wjcCore.setSelectionRange(i, n + 1);
                                    }),
                                    e.preventDefault());
                            }
                }
            }
        }),
        (t.prototype._input = function (e) {
            var t = this;
            this._composing ||
                setTimeout(function () {
                    var e = t._tbx,
                        i = e.value,
                        o = i.indexOf(t._chrDec),
                        n = e.selectionStart,
                        s = t._getSelStartDigits();
                    if (
                        ("p" == t._fmtSpc &&
                            i.length &&
                            i.indexOf("%") < 0 &&
                            (i += "%"),
                        t._setText(i),
                        t.containsFocus())
                    ) {
                        var r = e.value,
                            a = r.indexOf(t._chrDec),
                            l = t._getInputRange(!0);
                        if ("-." == i && a > -1)
                            return void wjcCore.setSelectionRange(e, a + 1);
                        if ("-" == i[0] && "-" != r[0])
                            return void t._setSelStartDigits(s);
                        i
                            ? i == t._chrDec && a > -1
                                ? (n = a + 1)
                                : (n <= o && a > -1) || (o < 0 && a < 0)
                                ? (n += r.length - i.length)
                                : o < 0 && a > -1 && (n = a)
                            : (n = a > -1 ? a : l[1]),
                            (n = wjcCore.clamp(n, l[0], l[1])),
                            wjcCore.setSelectionRange(e, n);
                    }
                });
        }),
        (t.prototype._clickSpinner = function (e) {
            var t = this;
            e.defaultPrevented ||
                this.isReadOnly ||
                !this.step ||
                (this._increment(
                    this.step *
                        (wjcCore.contains(this._btnUp, e.target) ? 1 : -1)
                ),
                this.isTouching ||
                    setTimeout(function () {
                        return t.selectAll();
                    }));
        }),
        (t.prototype._updateAria = function () {
            var e = this.hostElement;
            e &&
                (wjcCore.setAttribute(e, "aria-valuemin", this.min),
                wjcCore.setAttribute(e, "aria-valuemax", this.max),
                wjcCore.setAttribute(e, "aria-valuenow", this.value));
        }),
        (t.controlTemplate =
            '<div class="wj-input"><div class="wj-input-group"><span wj-part="btn-dec" class="wj-input-group-btn" tabindex="-1"><button class="wj-btn wj-btn-default" type="button" tabindex="-1">-</button></span><input type="tel" wj-part="input" class="wj-form-control wj-numeric"/><span wj-part="btn-inc" class="wj-input-group-btn" tabindex="-1"><button class="wj-btn wj-btn-default" type="button" tabindex="-1">+</button></span></div></div>'),
        t
    );
})(wjcCore.Control);
exports.InputNumber = InputNumber;
var InputMask = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        o.valueChanged = new wjcCore.Event();
        var n = o.getTemplate();
        if (
            (o.applyTemplate(
                "wj-control wj-inputmask wj-content",
                n,
                { _tbx: "input" },
                "input"
            ),
            "INPUT" == o._orgTag)
        ) {
            var s = o._tbx.getAttribute("value");
            s && (o.value = s);
        }
        return (
            (o._msk = new wjcCore._MaskProvider(o._tbx)),
            (o.isRequired = !0),
            o.initialize(i),
            o.addEventListener(o._tbx, "input", function () {
                setTimeout(function () {
                    o.onValueChanged();
                });
            }),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "inputElement", {
            get: function () {
                return this._tbx;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "value", {
            get: function () {
                return this._tbx.value;
            },
            set: function (e) {
                if (e != this.value) {
                    this._tbx.value = wjcCore.asString(e);
                    var t = wjcCore.getActiveElement();
                    (this._tbx.selectionStart = this._tbx.value.length),
                        t && t != wjcCore.getActiveElement() && t.focus(),
                        (e = this._msk._applyMask()),
                        (this._tbx.value = e),
                        this.onValueChanged();
                }
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "rawValue", {
            get: function () {
                return this._msk.getRawValue();
            },
            set: function (e) {
                e != this.rawValue && (this.value = wjcCore.asString(e));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "mask", {
            get: function () {
                return this._msk.mask;
            },
            set: function (e) {
                var t = this.value;
                (this._msk.mask = wjcCore.asString(e)),
                    this.value != t && this.onValueChanged();
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "promptChar", {
            get: function () {
                return this._msk.promptChar;
            },
            set: function (e) {
                var t = this.value;
                (this._msk.promptChar = e),
                    this.value != t && this.onValueChanged();
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "placeholder", {
            get: function () {
                return this._tbx.placeholder;
            },
            set: function (e) {
                this._tbx.placeholder = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "maskFull", {
            get: function () {
                return this._msk.maskFull;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "isRequired", {
            get: function () {
                return this._tbx.required;
            },
            set: function (e) {
                this._tbx.required = wjcCore.asBoolean(e);
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.selectAll = function () {
            var e = this._msk.getMaskRange();
            wjcCore.setSelectionRange(this._tbx, e[0], e[1] + 1);
        }),
        (t.prototype.onValueChanged = function (e) {
            this.value != this._oldValue &&
                ((this._oldValue = this.value),
                this.valueChanged.raise(this, e)),
                this._updateState();
        }),
        (t.prototype.dispose = function () {
            (this._msk.input = null), e.prototype.dispose.call(this);
        }),
        (t.prototype.refresh = function (t) {
            e.prototype.refresh.call(this, t), this._msk.refresh();
        }),
        (t.prototype.onGotFocus = function (t) {
            e.prototype.onGotFocus.call(this, t), this.selectAll();
        }),
        (t.controlTemplate =
            '<div class="wj-input"><div class="wj-input-group"><input wj-part="input" class="wj-form-control"/></div></div>'),
        t
    );
})(wjcCore.Control);
exports.InputMask = InputMask;
var InputColor = (function (e) {
    function t(t, i) {
        var o = e.call(this, t) || this;
        return (
            (o.valueChanged = new wjcCore.Event()),
            wjcCore.addClass(o.hostElement, "wj-inputcolor"),
            (o._tbx.style.paddingLeft = "24px"),
            (o._ePreview = wjcCore.createElement(
                '<div class="wj-inputcolorbox" style="position:absolute;left:6px;top:6px;width:12px;bottom:6px;border:1px solid black"></div>'
            )),
            (o.hostElement.style.position = "relative"),
            o.hostElement.appendChild(o._ePreview),
            "INPUT" == o._orgTag && ((o._tbx.type = ""), o._commitText()),
            (o.value = "#ffffff"),
            (o.isRequired = !0),
            o.initialize(i),
            o.addEventListener(
                o._colorPicker.hostElement,
                "click",
                function (e) {
                    var t = e.target;
                    t &&
                        "DIV" == t.tagName &&
                        (wjcCore.closest(t, '[wj-part="div-pal"]') ||
                            wjcCore.closest(t, '[wj-part="div-pv"]')) &&
                        t.style.backgroundColor &&
                        (o.isDroppedDown = !1);
                }
            ),
            o
        );
    }
    return (
        __extends(t, e),
        Object.defineProperty(t.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (e) {
                e != this.value &&
                    ((!e && this.isRequired) ||
                        (this.text = wjcCore.asString(e)));
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "text", {
            get: function () {
                return this._tbx.value;
            },
            set: function (e) {
                e != this.text &&
                    (this._setText(wjcCore.asString(e), !0),
                    this._commitText());
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "showAlphaChannel", {
            get: function () {
                return this._colorPicker.showAlphaChannel;
            },
            set: function (e) {
                this._colorPicker.showAlphaChannel = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "palette", {
            get: function () {
                return this._colorPicker.palette;
            },
            set: function (e) {
                this._colorPicker.palette = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "colorPicker", {
            get: function () {
                return this._colorPicker;
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.onValueChanged = function (e) {
            this.valueChanged.raise(this, e);
        }),
        (t.prototype._createDropDown = function () {
            var e = this;
            (this._colorPicker = new ColorPicker(this._dropDown)),
                wjcCore.setCss(this._dropDown, {
                    minWidth: 420,
                    minHeight: 200,
                }),
                this._colorPicker.valueChanged.addHandler(function () {
                    e.value = e._colorPicker.value;
                });
        }),
        (t.prototype._keydown = function (t) {
            if (!t.defaultPrevented)
                switch (t.keyCode) {
                    case wjcCore.Key.Enter:
                        this._commitText(), this.selectAll();
                        break;
                    case wjcCore.Key.Escape:
                        (this.text = this.value), this.selectAll();
                }
            e.prototype._keydown.call(this, t);
        }),
        (t.prototype._commitText = function () {
            if (this.value != this.text) {
                if (!this.isRequired && !this.text)
                    return (
                        (this._value = this.text),
                        void (this._ePreview.style.backgroundColor = "")
                    );
                wjcCore.Color.fromString(this.text)
                    ? ((this._colorPicker.value = this.text),
                      (this._value = this._colorPicker.value),
                      (this._ePreview.style.backgroundColor = this.value),
                      this.onValueChanged())
                    : (this.text = this._value ? this._value : "");
            }
        }),
        t
    );
})(DropDown);
exports.InputColor = InputColor;
