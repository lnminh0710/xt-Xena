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
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
            };
        return function (t, r) {
            function o() {
                this.constructor = t;
            }
            e(t, r),
                (t.prototype =
                    null === r
                        ? Object.create(r)
                        : ((o.prototype = r.prototype), new o()));
        };
    })();
Object.defineProperty(exports, "__esModule", { value: !0 });
var wjcChart = require("wijmo/wijmo.chart"),
    core_1 = require("@angular/core"),
    core_2 = require("@angular/core"),
    core_3 = require("@angular/core"),
    common_1 = require("@angular/common"),
    forms_1 = require("@angular/forms"),
    wijmo_angular2_directiveBase_1 = require("wijmo/wijmo.angular2.directiveBase");
exports.wjFlexChartMeta = {
    selector: "wj-flex-chart",
    template: "<div><ng-content></ng-content></div>",
    inputs: [
        "asyncBindings",
        "wjModelProperty",
        "isDisabled",
        "binding",
        "footer",
        "header",
        "selectionMode",
        "palette",
        "plotMargin",
        "footerStyle",
        "headerStyle",
        "tooltipContent",
        "itemsSource",
        "bindingX",
        "interpolateNulls",
        "legendToggle",
        "symbolSize",
        "options",
        "selection",
        "itemFormatter",
        "labelContent",
        "chartType",
        "rotated",
        "stacking",
    ],
    outputs: [
        "initialized",
        "gotFocusNg: gotFocus",
        "lostFocusNg: lostFocus",
        "renderingNg: rendering",
        "renderedNg: rendered",
        "selectionChangedNg: selectionChanged",
        "selectionChangePC: selectionChange",
        "seriesVisibilityChangedNg: seriesVisibilityChanged",
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
var WjFlexChart = (function (e) {
    function t(t, r, o) {
        var n =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    r
                )
            ) || this;
        n.isInitialized = !1;
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.prototype.addEventListener = function (t, r, o, n) {
            var i = this;
            void 0 === n && (n = !1);
            var a = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = a.ngZone;
            s && a.outsideZoneEvents[r]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(i, t, r, o, n);
                  })
                : e.prototype.addEventListener.call(this, t, r, o, n);
        }),
        Object.defineProperty(t.prototype, "tooltipContent", {
            get: function () {
                return this.tooltip.content;
            },
            set: function (e) {
                this.tooltip.content = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "labelContent", {
            get: function () {
                return this.dataLabel.content;
            },
            set: function (e) {
                this.dataLabel.content = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.meta = {
            outputs: exports.wjFlexChartMeta.outputs,
            changeEvents: { selectionChanged: ["selection"] },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexChartMeta.selector,
                        template: exports.wjFlexChartMeta.template,
                        inputs: exports.wjFlexChartMeta.inputs,
                        outputs: exports.wjFlexChartMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexChartMeta.providers),
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
})(wjcChart.FlexChart);
(exports.WjFlexChart = WjFlexChart),
    (exports.wjFlexPieMeta = {
        selector: "wj-flex-pie",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjModelProperty",
            "isDisabled",
            "binding",
            "footer",
            "header",
            "selectionMode",
            "palette",
            "plotMargin",
            "footerStyle",
            "headerStyle",
            "tooltipContent",
            "itemsSource",
            "bindingName",
            "innerRadius",
            "isAnimated",
            "offset",
            "reversed",
            "startAngle",
            "selectedItemPosition",
            "selectedItemOffset",
            "itemFormatter",
            "labelContent",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "renderingNg: rendering",
            "renderedNg: rendered",
            "selectionChangedNg: selectionChanged",
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
var WjFlexPie = (function (e) {
    function t(t, r, o) {
        var n =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    r
                )
            ) || this;
        n.isInitialized = !1;
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.prototype.addEventListener = function (t, r, o, n) {
            var i = this;
            void 0 === n && (n = !1);
            var a = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = a.ngZone;
            s && a.outsideZoneEvents[r]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(i, t, r, o, n);
                  })
                : e.prototype.addEventListener.call(this, t, r, o, n);
        }),
        Object.defineProperty(t.prototype, "tooltipContent", {
            get: function () {
                return this.tooltip.content;
            },
            set: function (e) {
                this.tooltip.content = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        Object.defineProperty(t.prototype, "labelContent", {
            get: function () {
                return this.dataLabel.content;
            },
            set: function (e) {
                this.dataLabel.content = e;
            },
            enumerable: !0,
            configurable: !0,
        }),
        (t.meta = { outputs: exports.wjFlexPieMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexPieMeta.selector,
                        template: exports.wjFlexPieMeta.template,
                        inputs: exports.wjFlexPieMeta.inputs,
                        outputs: exports.wjFlexPieMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexPieMeta.providers),
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
})(wjcChart.FlexPie);
(exports.WjFlexPie = WjFlexPie),
    (exports.wjFlexChartAxisMeta = {
        selector: "wj-flex-chart-axis",
        template: "",
        inputs: [
            "wjProperty",
            "axisLine",
            "format",
            "labels",
            "majorGrid",
            "majorTickMarks",
            "majorUnit",
            "max",
            "min",
            "position",
            "reversed",
            "title",
            "labelAngle",
            "minorGrid",
            "minorTickMarks",
            "minorUnit",
            "origin",
            "logBase",
            "plotArea",
            "labelAlign",
            "name",
            "overlappingLabels",
            "labelPadding",
            "itemFormatter",
            "itemsSource",
            "binding",
        ],
        outputs: ["initialized", "rangeChangedNg: rangeChanged"],
        providers: [],
    });
var WjFlexChartAxis = (function (e) {
    function t(t, r, o) {
        var n = e.call(this) || this;
        (n.isInitialized = !1), (n.wjProperty = "axes");
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.meta = { outputs: exports.wjFlexChartAxisMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexChartAxisMeta.selector,
                        template: exports.wjFlexChartAxisMeta.template,
                        inputs: exports.wjFlexChartAxisMeta.inputs,
                        outputs: exports.wjFlexChartAxisMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexChartAxisMeta.providers),
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
})(wjcChart.Axis);
(exports.WjFlexChartAxis = WjFlexChartAxis),
    (exports.wjFlexChartLegendMeta = {
        selector: "wj-flex-chart-legend",
        template: "",
        inputs: ["wjProperty", "position", "title", "titleAlign"],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartLegend = (function (e) {
    function t(t, r, o) {
        var n = e.call(this, o) || this;
        (n.isInitialized = !1), (n.wjProperty = "legend");
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.meta = { outputs: exports.wjFlexChartLegendMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexChartLegendMeta.selector,
                        template: exports.wjFlexChartLegendMeta.template,
                        inputs: exports.wjFlexChartLegendMeta.inputs,
                        outputs: exports.wjFlexChartLegendMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexChartLegendMeta.providers),
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
})(wjcChart.Legend);
(exports.WjFlexChartLegend = WjFlexChartLegend),
    (exports.wjFlexChartDataLabelMeta = {
        selector: "wj-flex-chart-data-label",
        template: "",
        inputs: [
            "wjProperty",
            "content",
            "border",
            "offset",
            "connectingLine",
            "position",
        ],
        outputs: ["initialized", "renderingNg: rendering"],
        providers: [],
    });
var WjFlexChartDataLabel = (function (e) {
    function t(t, r, o) {
        var n = e.call(this) || this;
        (n.isInitialized = !1), (n.wjProperty = "dataLabel");
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.meta = { outputs: exports.wjFlexChartDataLabelMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexChartDataLabelMeta.selector,
                        template: exports.wjFlexChartDataLabelMeta.template,
                        inputs: exports.wjFlexChartDataLabelMeta.inputs,
                        outputs: exports.wjFlexChartDataLabelMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexChartDataLabelMeta.providers),
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
})(wjcChart.DataLabel);
(exports.WjFlexChartDataLabel = WjFlexChartDataLabel),
    (exports.wjFlexPieDataLabelMeta = {
        selector: "wj-flex-pie-data-label",
        template: "",
        inputs: [
            "wjProperty",
            "content",
            "border",
            "offset",
            "connectingLine",
            "position",
        ],
        outputs: ["initialized", "renderingNg: rendering"],
        providers: [],
    });
var WjFlexPieDataLabel = (function (e) {
    function t(t, r, o) {
        var n = e.call(this) || this;
        (n.isInitialized = !1), (n.wjProperty = "dataLabel");
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.meta = { outputs: exports.wjFlexPieDataLabelMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexPieDataLabelMeta.selector,
                        template: exports.wjFlexPieDataLabelMeta.template,
                        inputs: exports.wjFlexPieDataLabelMeta.inputs,
                        outputs: exports.wjFlexPieDataLabelMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexPieDataLabelMeta.providers),
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
})(wjcChart.PieDataLabel);
(exports.WjFlexPieDataLabel = WjFlexPieDataLabel),
    (exports.wjFlexChartSeriesMeta = {
        selector: "wj-flex-chart-series",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "asyncBindings",
            "wjProperty",
            "axisX",
            "axisY",
            "binding",
            "bindingX",
            "cssClass",
            "name",
            "style",
            "altStyle",
            "symbolMarker",
            "symbolSize",
            "symbolStyle",
            "visibility",
            "itemsSource",
            "chartType",
        ],
        outputs: [
            "initialized",
            "renderingNg: rendering",
            "renderedNg: rendered",
            "visibilityChangePC: visibilityChange",
        ],
        providers: [],
    });
var WjFlexChartSeries = (function (e) {
    function t(t, r, o) {
        var n = e.call(this) || this;
        (n.isInitialized = !1), (n.wjProperty = "series");
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.meta = {
            outputs: exports.wjFlexChartSeriesMeta.outputs,
            changeEvents: { "chart.seriesVisibilityChanged": ["visibility"] },
            siblingId: "series",
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexChartSeriesMeta.selector,
                        template: exports.wjFlexChartSeriesMeta.template,
                        inputs: exports.wjFlexChartSeriesMeta.inputs,
                        outputs: exports.wjFlexChartSeriesMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexChartSeriesMeta.providers),
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
})(wjcChart.Series);
(exports.WjFlexChartSeries = WjFlexChartSeries),
    (exports.wjFlexChartLineMarkerMeta = {
        selector: "wj-flex-line-marker",
        template: "",
        inputs: [
            "wjProperty",
            "isVisible",
            "seriesIndex",
            "horizontalPosition",
            "content",
            "verticalPosition",
            "alignment",
            "lines",
            "interaction",
            "dragLines",
            "dragThreshold",
            "dragContent",
        ],
        outputs: ["initialized", "positionChangedNg: positionChanged"],
        providers: [],
    });
var WjFlexChartLineMarker = (function (e) {
    function t(t, r, o) {
        var n = e.call(this, o) || this;
        n.isInitialized = !1;
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.meta = { outputs: exports.wjFlexChartLineMarkerMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexChartLineMarkerMeta.selector,
                        template: exports.wjFlexChartLineMarkerMeta.template,
                        inputs: exports.wjFlexChartLineMarkerMeta.inputs,
                        outputs: exports.wjFlexChartLineMarkerMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexChartLineMarkerMeta.providers),
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
})(wjcChart.LineMarker);
(exports.WjFlexChartLineMarker = WjFlexChartLineMarker),
    (exports.wjFlexChartDataPointMeta = {
        selector: "wj-flex-chart-data-point",
        template: "",
        inputs: ["wjProperty", "x", "y"],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartDataPoint = (function (e) {
    function t(t, r, o) {
        var n = e.call(this) || this;
        (n.isInitialized = !1), (n.wjProperty = "");
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.meta = { outputs: exports.wjFlexChartDataPointMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexChartDataPointMeta.selector,
                        template: exports.wjFlexChartDataPointMeta.template,
                        inputs: exports.wjFlexChartDataPointMeta.inputs,
                        outputs: exports.wjFlexChartDataPointMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexChartDataPointMeta.providers),
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
})(wjcChart.DataPoint);
(exports.WjFlexChartDataPoint = WjFlexChartDataPoint),
    (exports.wjFlexChartPlotAreaMeta = {
        selector: "wj-flex-chart-plot-area",
        template: "",
        inputs: [
            "wjProperty",
            "column",
            "height",
            "name",
            "row",
            "style",
            "width",
        ],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartPlotArea = (function (e) {
    function t(t, r, o) {
        var n = e.call(this) || this;
        (n.isInitialized = !1), (n.wjProperty = "plotAreas");
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                r,
                o
            );
        return n.created(), n;
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
        (t.meta = { outputs: exports.wjFlexChartPlotAreaMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexChartPlotAreaMeta.selector,
                        template: exports.wjFlexChartPlotAreaMeta.template,
                        inputs: exports.wjFlexChartPlotAreaMeta.inputs,
                        outputs: exports.wjFlexChartPlotAreaMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexChartPlotAreaMeta.providers),
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
})(wjcChart.PlotArea);
exports.WjFlexChartPlotArea = WjFlexChartPlotArea;
var moduleExports = [
        WjFlexChart,
        WjFlexPie,
        WjFlexChartAxis,
        WjFlexChartLegend,
        WjFlexChartDataLabel,
        WjFlexPieDataLabel,
        WjFlexChartSeries,
        WjFlexChartLineMarker,
        WjFlexChartDataPoint,
        WjFlexChartPlotArea,
    ],
    WjChartModule = (function () {
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
                            declarations: moduleExports.slice(),
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
exports.WjChartModule = WjChartModule;
