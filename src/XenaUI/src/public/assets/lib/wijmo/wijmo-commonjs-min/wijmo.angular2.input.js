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
Object.defineProperty(exports, "__esModule", { value: !0 });
var wjcInput = require("wijmo/wijmo.input"),
    wjcCore = require("wijmo/wijmo"),
    core_1 = require("@angular/core"),
    core_2 = require("@angular/core"),
    core_3 = require("@angular/core"),
    common_1 = require("@angular/common"),
    forms_1 = require("@angular/forms"),
    wijmo_angular2_directiveBase_1 = require("wijmo/wijmo.angular2.directiveBase");
exports.wjComboBoxMeta = {
    selector: "wj-combo-box",
    template: "<div><ng-content></ng-content></div>",
    inputs: [
        "asyncBindings",
        "wjModelProperty",
        "isDisabled",
        "isDroppedDown",
        "showDropDownButton",
        "autoExpandSelection",
        "placeholder",
        "dropDownCssClass",
        "isAnimated",
        "isReadOnly",
        "isRequired",
        "displayMemberPath",
        "selectedValuePath",
        "headerPath",
        "isContentHtml",
        "isEditable",
        "maxDropDownHeight",
        "maxDropDownWidth",
        "itemFormatter",
        "itemsSource",
        "text",
        "selectedIndex",
        "selectedItem",
        "selectedValue",
    ],
    outputs: [
        "initialized",
        "gotFocusNg: gotFocus",
        "lostFocusNg: lostFocus",
        "isDroppedDownChangingNg: isDroppedDownChanging",
        "isDroppedDownChangedNg: isDroppedDownChanged",
        "isDroppedDownChangePC: isDroppedDownChange",
        "textChangedNg: textChanged",
        "textChangePC: textChange",
        "formatItemNg: formatItem",
        "selectedIndexChangedNg: selectedIndexChanged",
        "selectedIndexChangePC: selectedIndexChange",
        "selectedItemChangePC: selectedItemChange",
        "selectedValueChangePC: selectedValueChange",
    ],
    providers: [
        {
            provide: forms_1.NG_VALUE_ACCESSOR,
            useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
            multi: !0,
            deps: ["WjComponent"],
        },
    ],
};
var WjComboBox = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "selectedValue");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjComboBoxMeta.outputs,
            changeEvents: {
                isDroppedDownChanged: ["isDroppedDown"],
                textChanged: ["text"],
                selectedIndexChanged: [
                    "selectedIndex",
                    "selectedItem",
                    "selectedValue",
                ],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjComboBoxMeta.selector,
                        template: exports.wjComboBoxMeta.template,
                        inputs: exports.wjComboBoxMeta.inputs,
                        outputs: exports.wjComboBoxMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjComboBoxMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.ComboBox);
(exports.WjComboBox = WjComboBox),
    (exports.wjAutoCompleteMeta = {
        selector: "wj-auto-complete",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "isDroppedDown",
            "showDropDownButton",
            "autoExpandSelection",
            "placeholder",
            "dropDownCssClass",
            "isAnimated",
            "isReadOnly",
            "isRequired",
            "displayMemberPath",
            "selectedValuePath",
            "headerPath",
            "isContentHtml",
            "isEditable",
            "maxDropDownHeight",
            "maxDropDownWidth",
            "itemFormatter",
            "delay",
            "maxItems",
            "minLength",
            "cssMatch",
            "itemsSourceFunction",
            "searchMemberPath",
            "itemsSource",
            "text",
            "selectedIndex",
            "selectedItem",
            "selectedValue",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "isDroppedDownChangingNg: isDroppedDownChanging",
            "isDroppedDownChangedNg: isDroppedDownChanged",
            "isDroppedDownChangePC: isDroppedDownChange",
            "textChangedNg: textChanged",
            "textChangePC: textChange",
            "formatItemNg: formatItem",
            "selectedIndexChangedNg: selectedIndexChanged",
            "selectedIndexChangePC: selectedIndexChange",
            "selectedItemChangePC: selectedItemChange",
            "selectedValueChangePC: selectedValueChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjAutoComplete = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "selectedValue");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjAutoCompleteMeta.outputs,
            changeEvents: {
                isDroppedDownChanged: ["isDroppedDown"],
                textChanged: ["text"],
                selectedIndexChanged: [
                    "selectedIndex",
                    "selectedItem",
                    "selectedValue",
                ],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjAutoCompleteMeta.selector,
                        template: exports.wjAutoCompleteMeta.template,
                        inputs: exports.wjAutoCompleteMeta.inputs,
                        outputs: exports.wjAutoCompleteMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjAutoCompleteMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.AutoComplete);
(exports.WjAutoComplete = WjAutoComplete),
    (exports.wjCalendarMeta = {
        selector: "wj-calendar",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "monthView",
            "showHeader",
            "itemFormatter",
            "itemValidator",
            "firstDayOfWeek",
            "max",
            "min",
            "formatYearMonth",
            "formatDayHeaders",
            "formatDays",
            "formatYear",
            "formatMonths",
            "selectionMode",
            "isReadOnly",
            "value",
            "displayMonth",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "valueChangedNg: valueChanged",
            "valueChangePC: valueChange",
            "displayMonthChangedNg: displayMonthChanged",
            "displayMonthChangePC: displayMonthChange",
            "formatItemNg: formatItem",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjCalendar = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "value");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjCalendarMeta.outputs,
            changeEvents: {
                valueChanged: ["value"],
                displayMonthChanged: ["displayMonth"],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjCalendarMeta.selector,
                        template: exports.wjCalendarMeta.template,
                        inputs: exports.wjCalendarMeta.inputs,
                        outputs: exports.wjCalendarMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjCalendarMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.Calendar);
(exports.WjCalendar = WjCalendar),
    (exports.wjColorPickerMeta = {
        selector: "wj-color-picker",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "showAlphaChannel",
            "showColorString",
            "palette",
            "value",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "valueChangedNg: valueChanged",
            "valueChangePC: valueChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjColorPicker = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "value");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjColorPickerMeta.outputs,
            changeEvents: { valueChanged: ["value"] },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjColorPickerMeta.selector,
                        template: exports.wjColorPickerMeta.template,
                        inputs: exports.wjColorPickerMeta.inputs,
                        outputs: exports.wjColorPickerMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjColorPickerMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.ColorPicker);
(exports.WjColorPicker = WjColorPicker),
    (exports.wjInputMaskMeta = {
        selector: "wj-input-mask",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "mask",
            "isRequired",
            "promptChar",
            "placeholder",
            "rawValue",
            "value",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "valueChangedNg: valueChanged",
            "rawValueChangePC: rawValueChange",
            "valueChangePC: valueChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjInputMask = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "value");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjInputMaskMeta.outputs,
            changeEvents: { valueChanged: ["rawValue", "value"] },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjInputMaskMeta.selector,
                        template: exports.wjInputMaskMeta.template,
                        inputs: exports.wjInputMaskMeta.inputs,
                        outputs: exports.wjInputMaskMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjInputMaskMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.InputMask);
(exports.WjInputMask = WjInputMask),
    (exports.wjInputColorMeta = {
        selector: "wj-input-color",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "isDroppedDown",
            "showDropDownButton",
            "autoExpandSelection",
            "placeholder",
            "dropDownCssClass",
            "isAnimated",
            "isReadOnly",
            "isRequired",
            "showAlphaChannel",
            "value",
            "text",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "isDroppedDownChangingNg: isDroppedDownChanging",
            "isDroppedDownChangedNg: isDroppedDownChanged",
            "isDroppedDownChangePC: isDroppedDownChange",
            "textChangedNg: textChanged",
            "textChangePC: textChange",
            "valueChangedNg: valueChanged",
            "valueChangePC: valueChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjInputColor = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "value");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjInputColorMeta.outputs,
            changeEvents: {
                isDroppedDownChanged: ["isDroppedDown"],
                textChanged: ["text"],
                valueChanged: ["value"],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjInputColorMeta.selector,
                        template: exports.wjInputColorMeta.template,
                        inputs: exports.wjInputColorMeta.inputs,
                        outputs: exports.wjInputColorMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjInputColorMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.InputColor);
(exports.WjInputColor = WjInputColor),
    (exports.wjMultiSelectMeta = {
        selector: "wj-multi-select",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "isDroppedDown",
            "showDropDownButton",
            "autoExpandSelection",
            "placeholder",
            "dropDownCssClass",
            "isAnimated",
            "isReadOnly",
            "isRequired",
            "displayMemberPath",
            "selectedValuePath",
            "headerPath",
            "isContentHtml",
            "isEditable",
            "maxDropDownHeight",
            "maxDropDownWidth",
            "itemFormatter",
            "checkedMemberPath",
            "maxHeaderItems",
            "headerFormat",
            "headerFormatter",
            "showSelectAllCheckbox",
            "selectAllLabel",
            "itemsSource",
            "checkedItems",
            "text",
            "selectedIndex",
            "selectedItem",
            "selectedValue",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "isDroppedDownChangingNg: isDroppedDownChanging",
            "isDroppedDownChangedNg: isDroppedDownChanged",
            "isDroppedDownChangePC: isDroppedDownChange",
            "textChangedNg: textChanged",
            "textChangePC: textChange",
            "formatItemNg: formatItem",
            "selectedIndexChangedNg: selectedIndexChanged",
            "selectedIndexChangePC: selectedIndexChange",
            "selectedItemChangePC: selectedItemChange",
            "selectedValueChangePC: selectedValueChange",
            "checkedItemsChangedNg: checkedItemsChanged",
            "checkedItemsChangePC: checkedItemsChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjMultiSelect = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "checkedItems");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjMultiSelectMeta.outputs,
            changeEvents: {
                isDroppedDownChanged: ["isDroppedDown"],
                textChanged: ["text"],
                selectedIndexChanged: [
                    "selectedIndex",
                    "selectedItem",
                    "selectedValue",
                ],
                checkedItemsChanged: ["checkedItems"],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjMultiSelectMeta.selector,
                        template: exports.wjMultiSelectMeta.template,
                        inputs: exports.wjMultiSelectMeta.inputs,
                        outputs: exports.wjMultiSelectMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjMultiSelectMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.MultiSelect);
(exports.WjMultiSelect = WjMultiSelect),
    (exports.wjMultiAutoCompleteMeta = {
        selector: "wj-multi-auto-complete",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "isDroppedDown",
            "showDropDownButton",
            "autoExpandSelection",
            "placeholder",
            "dropDownCssClass",
            "isAnimated",
            "isReadOnly",
            "isRequired",
            "displayMemberPath",
            "selectedValuePath",
            "headerPath",
            "isContentHtml",
            "isEditable",
            "maxDropDownHeight",
            "maxDropDownWidth",
            "itemFormatter",
            "delay",
            "maxItems",
            "minLength",
            "cssMatch",
            "itemsSourceFunction",
            "searchMemberPath",
            "maxSelectedItems",
            "selectedItems",
            "itemsSource",
            "selectedMemberPath",
            "text",
            "selectedIndex",
            "selectedItem",
            "selectedValue",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "isDroppedDownChangingNg: isDroppedDownChanging",
            "isDroppedDownChangedNg: isDroppedDownChanged",
            "isDroppedDownChangePC: isDroppedDownChange",
            "textChangedNg: textChanged",
            "textChangePC: textChange",
            "formatItemNg: formatItem",
            "selectedIndexChangedNg: selectedIndexChanged",
            "selectedIndexChangePC: selectedIndexChange",
            "selectedItemChangePC: selectedItemChange",
            "selectedValueChangePC: selectedValueChange",
            "selectedItemsChangedNg: selectedItemsChanged",
            "selectedItemsChangePC: selectedItemsChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjMultiAutoComplete = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "selectedItems");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjMultiAutoCompleteMeta.outputs,
            changeEvents: {
                isDroppedDownChanged: ["isDroppedDown"],
                textChanged: ["text"],
                selectedIndexChanged: [
                    "selectedIndex",
                    "selectedItem",
                    "selectedValue",
                ],
                selectedItemsChanged: ["selectedItems"],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjMultiAutoCompleteMeta.selector,
                        template: exports.wjMultiAutoCompleteMeta.template,
                        inputs: exports.wjMultiAutoCompleteMeta.inputs,
                        outputs: exports.wjMultiAutoCompleteMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjMultiAutoCompleteMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.MultiAutoComplete);
(exports.WjMultiAutoComplete = WjMultiAutoComplete),
    (exports.wjInputNumberMeta = {
        selector: "wj-input-number",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "showSpinner",
            "repeatButtons",
            "max",
            "min",
            "step",
            "isRequired",
            "placeholder",
            "inputType",
            "format",
            "isReadOnly",
            "value",
            "text",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "valueChangedNg: valueChanged",
            "valueChangePC: valueChange",
            "textChangedNg: textChanged",
            "textChangePC: textChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjInputNumber = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "value");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjInputNumberMeta.outputs,
            changeEvents: { valueChanged: ["value"], textChanged: ["text"] },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjInputNumberMeta.selector,
                        template: exports.wjInputNumberMeta.template,
                        inputs: exports.wjInputNumberMeta.inputs,
                        outputs: exports.wjInputNumberMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjInputNumberMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.InputNumber);
(exports.WjInputNumber = WjInputNumber),
    (exports.wjInputDateMeta = {
        selector: "wj-input-date",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "isDroppedDown",
            "showDropDownButton",
            "autoExpandSelection",
            "placeholder",
            "dropDownCssClass",
            "isAnimated",
            "isReadOnly",
            "isRequired",
            "selectionMode",
            "format",
            "mask",
            "max",
            "min",
            "inputType",
            "itemValidator",
            "itemFormatter",
            "text",
            "value",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "isDroppedDownChangingNg: isDroppedDownChanging",
            "isDroppedDownChangedNg: isDroppedDownChanged",
            "isDroppedDownChangePC: isDroppedDownChange",
            "textChangedNg: textChanged",
            "textChangePC: textChange",
            "valueChangedNg: valueChanged",
            "valueChangePC: valueChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjInputDate = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "value");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjInputDateMeta.outputs,
            changeEvents: {
                isDroppedDownChanged: ["isDroppedDown"],
                textChanged: ["text"],
                valueChanged: ["value"],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjInputDateMeta.selector,
                        template: exports.wjInputDateMeta.template,
                        inputs: exports.wjInputDateMeta.inputs,
                        outputs: exports.wjInputDateMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjInputDateMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.InputDate);
(exports.WjInputDate = WjInputDate),
    (exports.wjInputTimeMeta = {
        selector: "wj-input-time",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "isDroppedDown",
            "showDropDownButton",
            "autoExpandSelection",
            "placeholder",
            "dropDownCssClass",
            "isAnimated",
            "isReadOnly",
            "isRequired",
            "displayMemberPath",
            "selectedValuePath",
            "headerPath",
            "isContentHtml",
            "isEditable",
            "maxDropDownHeight",
            "maxDropDownWidth",
            "itemFormatter",
            "max",
            "min",
            "step",
            "format",
            "mask",
            "inputType",
            "itemsSource",
            "text",
            "selectedIndex",
            "selectedItem",
            "selectedValue",
            "value",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "isDroppedDownChangingNg: isDroppedDownChanging",
            "isDroppedDownChangedNg: isDroppedDownChanged",
            "isDroppedDownChangePC: isDroppedDownChange",
            "textChangedNg: textChanged",
            "textChangePC: textChange",
            "formatItemNg: formatItem",
            "selectedIndexChangedNg: selectedIndexChanged",
            "selectedIndexChangePC: selectedIndexChange",
            "selectedItemChangePC: selectedItemChange",
            "selectedValueChangePC: selectedValueChange",
            "valueChangedNg: valueChanged",
            "valueChangePC: valueChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjInputTime = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "value");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjInputTimeMeta.outputs,
            changeEvents: {
                isDroppedDownChanged: ["isDroppedDown"],
                textChanged: ["text"],
                selectedIndexChanged: [
                    "selectedIndex",
                    "selectedItem",
                    "selectedValue",
                ],
                valueChanged: ["value"],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjInputTimeMeta.selector,
                        template: exports.wjInputTimeMeta.template,
                        inputs: exports.wjInputTimeMeta.inputs,
                        outputs: exports.wjInputTimeMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjInputTimeMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.InputTime);
(exports.WjInputTime = WjInputTime),
    (exports.wjInputDateTimeMeta = {
        selector: "wj-input-date-time",
        template: "",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "isDroppedDown",
            "showDropDownButton",
            "autoExpandSelection",
            "placeholder",
            "dropDownCssClass",
            "isAnimated",
            "isReadOnly",
            "isRequired",
            "selectionMode",
            "format",
            "mask",
            "max",
            "min",
            "inputType",
            "itemValidator",
            "itemFormatter",
            "timeMax",
            "timeMin",
            "timeStep",
            "timeFormat",
            "text",
            "value",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "isDroppedDownChangingNg: isDroppedDownChanging",
            "isDroppedDownChangedNg: isDroppedDownChanged",
            "isDroppedDownChangePC: isDroppedDownChange",
            "textChangedNg: textChanged",
            "textChangePC: textChange",
            "valueChangedNg: valueChanged",
            "valueChangePC: valueChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjInputDateTime = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "value");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjInputDateTimeMeta.outputs,
            changeEvents: {
                isDroppedDownChanged: ["isDroppedDown"],
                textChanged: ["text"],
                valueChanged: ["value"],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjInputDateTimeMeta.selector,
                        template: exports.wjInputDateTimeMeta.template,
                        inputs: exports.wjInputDateTimeMeta.inputs,
                        outputs: exports.wjInputDateTimeMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjInputDateTimeMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.InputDateTime);
(exports.WjInputDateTime = WjInputDateTime),
    (exports.wjListBoxMeta = {
        selector: "wj-list-box",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "isContentHtml",
            "maxHeight",
            "selectedValuePath",
            "itemFormatter",
            "displayMemberPath",
            "checkedMemberPath",
            "itemsSource",
            "selectedIndex",
            "selectedItem",
            "selectedValue",
            "checkedItems",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "formatItemNg: formatItem",
            "itemsChangedNg: itemsChanged",
            "itemCheckedNg: itemChecked",
            "selectedIndexChangedNg: selectedIndexChanged",
            "selectedIndexChangePC: selectedIndexChange",
            "selectedItemChangePC: selectedItemChange",
            "selectedValueChangePC: selectedValueChange",
            "checkedItemsChangedNg: checkedItemsChanged",
            "checkedItemsChangePC: checkedItemsChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjListBox = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "selectedValue");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.meta = {
            outputs: exports.wjListBoxMeta.outputs,
            changeEvents: {
                selectedIndexChanged: [
                    "selectedIndex",
                    "selectedItem",
                    "selectedValue",
                ],
                checkedItemsChanged: ["checkedItems"],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjListBoxMeta.selector,
                        template: exports.wjListBoxMeta.template,
                        inputs: exports.wjListBoxMeta.inputs,
                        outputs: exports.wjListBoxMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjListBoxMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.ListBox);
(exports.WjListBox = WjListBox),
    (exports.wjMenuMeta = {
        selector: "wj-menu",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "asyncBindings",
            "wjModelProperty",
            "isDisabled",
            "isDroppedDown",
            "showDropDownButton",
            "autoExpandSelection",
            "placeholder",
            "dropDownCssClass",
            "isAnimated",
            "isReadOnly",
            "isRequired",
            "displayMemberPath",
            "selectedValuePath",
            "headerPath",
            "isContentHtml",
            "isEditable",
            "maxDropDownHeight",
            "maxDropDownWidth",
            "itemFormatter",
            "header",
            "commandParameterPath",
            "commandPath",
            "isButton",
            "itemsSource",
            "text",
            "selectedIndex",
            "selectedItem",
            "selectedValue",
            "value",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "isDroppedDownChangingNg: isDroppedDownChanging",
            "isDroppedDownChangedNg: isDroppedDownChanged",
            "isDroppedDownChangePC: isDroppedDownChange",
            "textChangedNg: textChanged",
            "textChangePC: textChange",
            "formatItemNg: formatItem",
            "selectedIndexChangedNg: selectedIndexChanged",
            "selectedIndexChangePC: selectedIndexChange",
            "selectedItemChangePC: selectedItemChange",
            "selectedValueChangePC: selectedValueChange",
            "itemClickedNg: itemClicked",
            "valueChangePC: valueChange",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjMenu = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        (r.isInitialized = !1), (r.wjModelProperty = "selectedValue");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return (
            (r.itemsSource = new wjcCore.ObservableArray()),
            (r.selectedIndex = 0),
            r.created(),
            r
        );
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit(),
                this._attachToControl(),
                this._updateHeader();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy(),
                this.listBox.formatItem.removeHandler(this._fmtItem, this),
                this.listBox.loadingItems.removeHandler(
                    this._loadingItems,
                    this
                );
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        Object.defineProperty(t.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (e) {
                (this._value = e),
                    null != e &&
                        ((this.selectedValue = e), this._updateHeader());
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.prototype.ngOnChanges = function (e) {
            var t = e.header;
            t && ((this._definedHeader = t.currentValue), this._updateHeader());
        }),
        (t.prototype.ngAfterContentInit = function () {
            this.value = this.value;
        }),
        (t.prototype.onItemClicked = function (t) {
            (this.value = this.selectedValue),
                e.prototype.onItemClicked.call(this, t);
        }),
        (t.prototype.refresh = function (t) {
            void 0 === t && (t = !0),
                e.prototype.refresh.call(this, t),
                this._updateHeader();
        }),
        (t.prototype._attachToControl = function () {
            this.listBox.formatItem.addHandler(this._fmtItem, this),
                this.listBox.loadingItems.addHandler(this._loadingItems, this),
                this.invalidate();
        }),
        (t.prototype._loadingItems = function (e) {
            for (
                var t = e.hostElement.getElementsByClassName("wj-listbox-item"),
                    o = t.length - 1;
                o >= 0;
                o--
            )
                t[o].textContent = "";
        }),
        (t.prototype._fmtItem = function (e, t) {
            if (t.data instanceof WjMenuItem) {
                var o = t.item;
                o.textContent = "";
                var n = t.data,
                    r = n.contentRoot;
                r && (o.appendChild(r), n.added(o));
            }
        }),
        (t.prototype._updateHeader = function () {
            this.header = this._definedHeader || "";
            var e = this.selectedItem;
            if (null != this.value && e && this.displayMemberPath) {
                var t = null;
                if (e instanceof WjMenuItem) {
                    var o = e.contentRoot;
                    t = o ? o.innerHTML : e[this.displayMemberPath];
                }
                null != t && (this.header += ": <b>" + t + "</b>");
            }
        }),
        (t.meta = {
            outputs: exports.wjMenuMeta.outputs,
            changeEvents: {
                isDroppedDownChanged: ["isDroppedDown"],
                textChanged: ["text"],
                selectedIndexChanged: [
                    "selectedIndex",
                    "selectedItem",
                    "selectedValue",
                ],
                itemClicked: ["value"],
            },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjMenuMeta.selector,
                        template: exports.wjMenuMeta.template,
                        inputs: exports.wjMenuMeta.inputs,
                        outputs: exports.wjMenuMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjMenuMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.Menu);
(exports.WjMenu = WjMenu),
    (exports.wjMenuItemMeta = {
        selector: "wj-menu-item",
        template: "<div *wjMenuItemTemplateDir><ng-content></ng-content></div>",
        inputs: ["wjProperty", "value", "cmd", "cmdParam"],
        outputs: ["initialized"],
        providers: [],
    });
var WjMenuItem = (function () {
    function e(e, t, o, n, r) {
        (this.viewContainerRef = n),
            (this.domRenderer = r),
            (this.isInitialized = !1),
            (this.wjProperty = "itemsSource");
        var a = (this._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                this,
                e,
                t,
                o
            ));
        (this._ownerMenu = a.parentBehavior.directive), this.created();
    }
    return (
        (e.prototype.created = function () {}),
        (e.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
            var e = this._ownerMenu;
            1 == e.itemsSource.length &&
                e.selectedIndex < 0 &&
                (e.selectedIndex = 0),
                e.displayMemberPath || (e.displayMemberPath = "header"),
                e.selectedValuePath || (e.selectedValuePath = "value"),
                e.commandPath || (e.commandPath = "cmd"),
                e.commandParameterPath || (e.commandParameterPath = "cmdParam");
        }),
        (e.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (e.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (e.prototype.added = function (e) {}),
        (e.meta = {
            outputs: exports.wjMenuItemMeta.outputs,
            siblingId: "menuItemDir",
        }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjMenuItemMeta.selector,
                        template: exports.wjMenuItemMeta.template,
                        inputs: exports.wjMenuItemMeta.inputs,
                        outputs: exports.wjMenuItemMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(exports.wjMenuItemMeta.providers),
                    },
                ],
            },
        ]),
        (e.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
                {
                    type: core_2.ViewContainerRef,
                    decorators: [
                        {
                            type: core_3.Inject,
                            args: [core_2.ViewContainerRef],
                        },
                    ],
                },
                {
                    type: core_2.Renderer,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Renderer] },
                    ],
                },
            ];
        }),
        e
    );
})();
exports.WjMenuItem = WjMenuItem;
var WjMenuItemTemplateDir = (function () {
    function e(e, t, o, n, r, a, i) {
        (this.viewContainerRef = e),
            (this.templateRef = t),
            (this.elRef = o),
            (this.domRenderer = r),
            (this.ownerItem = a || i),
            (this.ownerItem.templateDir = this);
    }
    return (
        (e.prototype.ngAfterContentInit = function () {
            var e = this;
            setTimeout(function () {
                var t =
                    wijmo_angular2_directiveBase_1.WjDirectiveBehavior.instantiateTemplate(
                        null,
                        e.viewContainerRef,
                        e.templateRef,
                        e.domRenderer,
                        !0
                    ).rootElement;
                (e.contentRoot = t),
                    (e.ownerItem.contentRoot = t),
                    e.ownerItem._ownerMenu.listBox.invalidate(),
                    e.ownerItem._ownerMenu.invalidate();
            }, 0);
        }),
        (e.decorators = [
            {
                type: core_2.Directive,
                args: [
                    {
                        selector: "[wjMenuItemTemplateDir]",
                        inputs: ["wjMenuItemTemplateDir"],
                    },
                ],
            },
        ]),
        (e.ctorParameters = function () {
            return [
                {
                    type: core_2.ViewContainerRef,
                    decorators: [
                        {
                            type: core_3.Inject,
                            args: [core_2.ViewContainerRef],
                        },
                    ],
                },
                {
                    type: core_2.TemplateRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.TemplateRef] },
                        { type: core_2.Optional },
                    ],
                },
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: core_2.Renderer,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Renderer] },
                    ],
                },
                {
                    type: WjMenuItem,
                    decorators: [
                        { type: core_3.Inject, args: [WjMenuItem] },
                        { type: core_2.Optional },
                    ],
                },
                {
                    type: WjMenuSeparator,
                    decorators: [
                        {
                            type: core_3.Inject,
                            args: [
                                core_2.forwardRef(function () {
                                    return WjMenuSeparator;
                                }),
                            ],
                        },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        e
    );
})();
(exports.WjMenuItemTemplateDir = WjMenuItemTemplateDir),
    (exports.wjMenuSeparatorMeta = {
        selector: "wj-menu-separator",
        template:
            '<div *wjMenuItemTemplateDir class="wj-state-disabled" style="width:100%;height:1px;background-color:lightgray"></div>',
        inputs: ["wjProperty"],
        outputs: ["initialized"],
        providers: [],
    });
var WjMenuSeparator = (function (e) {
    function t(t, o, n, r, a) {
        var i = e.call(this, t, o, n, r, a) || this;
        return i.created(), i;
    }
    return (
        __extends(t, e),
        (t.prototype.added = function (e) {
            wjcCore.addClass(e, "wj-state-disabled");
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjMenuSeparatorMeta.selector,
                        template: exports.wjMenuSeparatorMeta.template,
                        inputs: exports.wjMenuSeparatorMeta.inputs,
                        outputs: exports.wjMenuSeparatorMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjMenuSeparatorMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
                {
                    type: core_2.ViewContainerRef,
                    decorators: [
                        {
                            type: core_3.Inject,
                            args: [core_2.ViewContainerRef],
                        },
                    ],
                },
                {
                    type: core_2.Renderer,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Renderer] },
                    ],
                },
            ];
        }),
        t
    );
})(WjMenuItem);
(exports.WjMenuSeparator = WjMenuSeparator),
    (exports.wjItemTemplateMeta = {
        selector: "[wjItemTemplate]",
        inputs: ["wjItemTemplate"],
        outputs: ["initialized"],
        exportAs: "wjItemTemplate",
        providers: [],
    });
var WjItemTemplate = (function () {
    function e(t, o, n, r, a, i, s) {
        (this.viewContainerRef = r),
            (this.templateRef = a),
            (this.domRenderer = i),
            (this.isInitialized = !1);
        var p = (this._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                this,
                t,
                o,
                n
            ));
        (this.ownerControl = p.parentBehavior.directive),
            (this.listBox = e._getListBox(this.ownerControl)),
            (this._cdRef = s),
            this.created();
    }
    return (
        (e.prototype.created = function () {}),
        (e.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit(), this._attachToControl();
        }),
        (e.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (e.prototype.ngOnDestroy = function () {
            var e = this.ownerControl,
                t = this.listBox;
            t &&
                (t.formatItem.removeHandler(this._fmtItem, this),
                t.loadingItems.removeHandler(this._loadingItems, this)),
                e && e.invalidate();
        }),
        (e.prototype._attachToControl = function () {
            this.listBox.formatItem.addHandler(this._fmtItem, this),
                this.listBox.loadingItems.addHandler(this._loadingItems, this),
                this.ownerControl.invalidate();
        }),
        (e.prototype._loadingItems = function (e) {
            this.viewContainerRef.clear();
        }),
        (e.prototype._fmtItem = function (e, t) {
            var o = t.item;
            o.textContent = "";
            var n = this._instantiateTemplate(o);
            (n.context.control = e),
                (n.context.item = t.data),
                (n.context.itemIndex = t.index),
                t.index === this.listBox.collectionView.items.length - 1 &&
                    this._cdRef.detectChanges();
        }),
        (e.prototype._instantiateTemplate = function (e) {
            return wijmo_angular2_directiveBase_1.WjDirectiveBehavior.instantiateTemplate(
                e,
                this.viewContainerRef,
                this.templateRef,
                this.domRenderer
            ).viewRef;
        }),
        (e._getListBox = function (e) {
            return e ? (e instanceof wjcInput.ListBox ? e : e.listBox) : null;
        }),
        (e.meta = {
            outputs: exports.wjItemTemplateMeta.outputs,
            parentRefProperty: "owner",
        }),
        (e.decorators = [
            {
                type: core_2.Directive,
                args: [
                    {
                        selector: exports.wjItemTemplateMeta.selector,
                        inputs: exports.wjItemTemplateMeta.inputs,
                        outputs: exports.wjItemTemplateMeta.outputs,
                        exportAs: exports.wjItemTemplateMeta.exportAs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(exports.wjItemTemplateMeta.providers),
                    },
                ],
            },
        ]),
        (e.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
                {
                    type: core_2.ViewContainerRef,
                    decorators: [
                        {
                            type: core_3.Inject,
                            args: [core_2.ViewContainerRef],
                        },
                    ],
                },
                {
                    type: core_2.TemplateRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.TemplateRef] },
                        { type: core_2.Optional },
                    ],
                },
                {
                    type: core_2.Renderer,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Renderer] },
                    ],
                },
                {
                    type: core_3.ChangeDetectorRef,
                    decorators: [
                        {
                            type: core_3.Inject,
                            args: [core_3.ChangeDetectorRef],
                        },
                    ],
                },
            ];
        }),
        e
    );
})();
(exports.WjItemTemplate = WjItemTemplate),
    (exports.wjPopupMeta = {
        selector: "wj-popup",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjModelProperty",
            "isDisabled",
            "owner",
            "showTrigger",
            "hideTrigger",
            "fadeIn",
            "fadeOut",
            "isDraggable",
            "dialogResultEnter",
            "modal",
            "removeOnHide",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "showingNg: showing",
            "shownNg: shown",
            "hidingNg: hiding",
            "hiddenNg: hidden",
        ],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjPopup = (function (e) {
    function t(t, o, n) {
        var r =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        r.isInitialized = !1;
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                t,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(t, e),
        (t.prototype.created = function () {}),
        (t.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (t.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (t.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (t.prototype.addEventListener = function (t, o, n, r) {
            var a = this;
            void 0 === r && (r = !1);
            var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = i.ngZone;
            s && i.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(a, t, o, n, r);
                  })
                : e.prototype.addEventListener.call(this, t, o, n, r);
        }),
        (t.prototype.ngOnChanges = function (e) {
            e.owner && null == this.modal && (this.modal = !this.owner);
        }),
        (t.prototype.dispose = function () {
            this.isVisible &&
                (this.hiding.removeAllHandlers(),
                (this.fadeOut = !1),
                this.hide()),
                e.prototype.dispose.call(this);
        }),
        (t.meta = { outputs: exports.wjPopupMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjPopupMeta.selector,
                        template: exports.wjPopupMeta.template,
                        inputs: exports.wjPopupMeta.inputs,
                        outputs: exports.wjPopupMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjPopupMeta.providers),
                    },
                ],
            },
        ]),
        (t.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        t
    );
})(wjcInput.Popup);
exports.WjPopup = WjPopup;
var WjContextMenu = (function () {
    function e(e) {
        this.elRef = e;
    }
    return (
        (e.prototype.onContextMenu = function (e) {
            var t = this.wjContextMenu,
                o = t.dropDown;
            t &&
                o &&
                !wjcCore.closest(e.target, "[disabled]") &&
                (e.preventDefault(),
                (t.owner = this.elRef.nativeElement),
                t.show(e));
        }),
        (e.decorators = [
            {
                type: core_2.Directive,
                args: [
                    {
                        selector: "[wjContextMenu]",
                        inputs: ["wjContextMenu"],
                        exportAs: "wjContextMenu",
                        host: { "(contextmenu)": "onContextMenu($event)" },
                    },
                ],
            },
        ]),
        (e.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
            ];
        }),
        e
    );
})();
(exports.WjContextMenu = WjContextMenu),
    (exports.wjCollectionViewNavigatorMeta = {
        selector: "wj-collection-view-navigator",
        template:
            '<div class="wj-control wj-content wj-pager">\n                <div class="wj-input-group">\n                    <span class="wj-input-group-btn" >\n                        <button class="wj-btn wj-btn-default" type="button"\n                           (click)="cv.moveCurrentToFirst()"\n                           [disabled]="!cv || cv?.currentPosition <= 0">\n                            <span class="wj-glyph-left" style="margin-right: -4px;"></span>\n                            <span class="wj-glyph-left"></span>\n                         </button>\n                    </span>\n                    <span class="wj-input-group-btn" >\n                       <button class="wj-btn wj-btn-default" type="button"\n                           (click)="cv.moveCurrentToPrevious()"\n                           [disabled]="!cv || cv?.currentPosition <= 0">\n                            <span class="wj-glyph-left"></span>\n                       </button>\n                    </span>\n                    <input type="text" class="wj-form-control" \n                           value="{{cv?.currentPosition + 1 | number}} / {{cv?.itemCount | number}}" \n                           disabled />\n                    <span class="wj-input-group-btn" >\n                        <button class="wj-btn wj-btn-default" type="button"\n                           (click)="cv.moveCurrentToNext()"\n                           [disabled]="!cv || cv?.currentPosition >= cv?.itemCount - 1">\n                            <span class="wj-glyph-right"></span>\n                        </button>\n                    </span>\n                    <span class="wj-input-group-btn" >\n                        <button class="wj-btn wj-btn-default" type="button"\n                           (click)="cv.moveCurrentToLast()"\n                           [disabled]="!cv || cv?.currentPosition >= cv?.itemCount - 1">\n                            <span class="wj-glyph-right"></span>\n                            <span class="wj-glyph-right" style="margin-left: -4px;"></span>\n                        </button>\n                    </span>\n                </div>\n            </div>',
        inputs: ["wjModelProperty", "cv"],
        outputs: ["initialized"],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjCollectionViewNavigator = (function () {
    function e(e, t, o) {
        this.isInitialized = !1;
        this._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                this,
                e,
                t,
                o
            );
        this.created();
    }
    return (
        (e.prototype.created = function () {}),
        (e.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (e.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (e.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (e.meta = { outputs: exports.wjCollectionViewNavigatorMeta.outputs }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjCollectionViewNavigatorMeta.selector,
                        template:
                            exports.wjCollectionViewNavigatorMeta.template,
                        inputs: exports.wjCollectionViewNavigatorMeta.inputs,
                        outputs: exports.wjCollectionViewNavigatorMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjCollectionViewNavigatorMeta.providers
                        ),
                    },
                ],
            },
        ]),
        (e.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        e
    );
})();
(exports.WjCollectionViewNavigator = WjCollectionViewNavigator),
    (exports.wjCollectionViewPagerMeta = {
        selector: "wj-collection-view-pager",
        template:
            '<div class="wj-control wj-content wj-pager" >\n                <div class="wj-input-group">\n                    <span class="wj-input-group-btn" >\n                        <button class="wj-btn wj-btn-default" type="button"\n                            (click)="cv.moveToFirstPage()"\n                            [disabled]="!cv || cv?.pageIndex <= 0">\n                            <span class="wj-glyph-left" style="margin-right: -4px;"></span>\n                            <span class="wj-glyph-left"></span>\n                        </button>\n                    </span>\n                    <span class="wj-input-group-btn" >\n                    <button class="wj-btn wj-btn-default" type="button"\n                            (click)="cv.moveToPreviousPage()"\n                            [disabled]="!cv || cv?.pageIndex <= 0">\n                            <span class="wj-glyph-left"></span>\n                        </button>\n                    </span>\n                    <input type="text" class="wj-form-control" \n                           value="{{cv?.pageIndex + 1 | number}} / {{cv?.pageCount | number}}" \n                           disabled />\n                    <span class="wj-input-group-btn" >\n                        <button class="wj-btn wj-btn-default" type="button"\n                            (click)="cv.moveToNextPage()"\n                            [disabled]="!cv || cv?.pageIndex >= cv?.pageCount - 1">\n                            <span class="wj-glyph-right"></span>\n                        </button>\n                    </span>\n                    <span class="wj-input-group-btn" >\n                        <button class="wj-btn wj-btn-default" type="button"\n                            (click)="cv.moveToLastPage()"\n                            [disabled]="!cv || cv?.pageIndex >= cv?.pageCount - 1">\n                            <span class="wj-glyph-right"></span>\n                            <span class="wj-glyph-right" style="margin-left: -4px;"></span>\n                        </button>\n                    </span>\n                </div>\n            </div>',
        inputs: ["wjModelProperty", "cv"],
        outputs: ["initialized"],
        providers: [
            {
                provide: forms_1.NG_VALUE_ACCESSOR,
                useFactory:
                    wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
                multi: !0,
                deps: ["WjComponent"],
            },
        ],
    });
var WjCollectionViewPager = (function () {
    function e(e, t, o) {
        this.isInitialized = !1;
        this._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                this,
                e,
                t,
                o
            );
        this.created();
    }
    return (
        (e.prototype.created = function () {}),
        (e.prototype.ngOnInit = function () {
            this._wjBehaviour.ngOnInit();
        }),
        (e.prototype.ngAfterViewInit = function () {
            this._wjBehaviour.ngAfterViewInit();
        }),
        (e.prototype.ngOnDestroy = function () {
            this._wjBehaviour.ngOnDestroy();
        }),
        (e.meta = { outputs: exports.wjCollectionViewPagerMeta.outputs }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjCollectionViewPagerMeta.selector,
                        template: exports.wjCollectionViewPagerMeta.template,
                        inputs: exports.wjCollectionViewPagerMeta.inputs,
                        outputs: exports.wjCollectionViewPagerMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(exports.wjCollectionViewPagerMeta.providers),
                    },
                ],
            },
        ]),
        (e.ctorParameters = function () {
            return [
                {
                    type: core_2.ElementRef,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.ElementRef] },
                    ],
                },
                {
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
                    ],
                },
                {
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
                        { type: core_2.Optional },
                    ],
                },
            ];
        }),
        e
    );
})();
exports.WjCollectionViewPager = WjCollectionViewPager;
var moduleExports = [
        WjComboBox,
        WjAutoComplete,
        WjCalendar,
        WjColorPicker,
        WjInputMask,
        WjInputColor,
        WjMultiSelect,
        WjMultiAutoComplete,
        WjInputNumber,
        WjInputDate,
        WjInputTime,
        WjInputDateTime,
        WjListBox,
        WjMenu,
        WjMenuItem,
        WjMenuSeparator,
        WjItemTemplate,
        WjPopup,
        WjContextMenu,
        WjCollectionViewNavigator,
        WjCollectionViewPager,
    ],
    WjInputModule = (function () {
        function e() {}
        return (
            (e.decorators = [
                {
                    type: core_1.NgModule,
                    args: [
                        {
                            imports: [
                                wijmo_angular2_directiveBase_1.WjDirectiveBaseModule,
                                common_1.CommonModule,
                            ],
                            declarations: moduleExports.concat([
                                WjMenuItemTemplateDir,
                            ]),
                            exports: moduleExports.slice(),
                        },
                    ],
                },
            ]),
            (e.ctorParameters = function () {
                return [];
            }),
            e
        );
    })();
exports.WjInputModule = WjInputModule;
