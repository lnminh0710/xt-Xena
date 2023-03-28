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
        var t =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                    t.__proto__ = e;
                }) ||
            function (t, e) {
                for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
            };
        return function (e, o) {
            function n() {
                this.constructor = e;
            }
            t(e, o),
                (e.prototype =
                    null === o
                        ? Object.create(o)
                        : ((n.prototype = o.prototype), new n()));
        };
    })();
Object.defineProperty(exports, "__esModule", { value: !0 });
var wjcChartAnnotation = require("wijmo/wijmo.chart.annotation"),
    core_1 = require("@angular/core"),
    core_2 = require("@angular/core"),
    core_3 = require("@angular/core"),
    common_1 = require("@angular/common"),
    wijmo_angular2_directiveBase_1 = require("wijmo/wijmo.angular2.directiveBase");
exports.wjFlexChartAnnotationLayerMeta = {
    selector: "wj-flex-chart-annotation-layer",
    template: "<div><ng-content></ng-content></div>",
    inputs: ["wjProperty"],
    outputs: ["initialized"],
    providers: [],
};
var WjFlexChartAnnotationLayer = (function (t) {
    function e(e, o, n) {
        var r = t.call(this, n) || this;
        r.isInitialized = !1;
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                e,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(e, t),
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
        (e.meta = { outputs: exports.wjFlexChartAnnotationLayerMeta.outputs }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjFlexChartAnnotationLayerMeta.selector,
                        template:
                            exports.wjFlexChartAnnotationLayerMeta.template,
                        inputs: exports.wjFlexChartAnnotationLayerMeta.inputs,
                        outputs: exports.wjFlexChartAnnotationLayerMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjFlexChartAnnotationLayerMeta.providers
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
})(wjcChartAnnotation.AnnotationLayer);
(exports.WjFlexChartAnnotationLayer = WjFlexChartAnnotationLayer),
    (exports.wjFlexChartAnnotationTextMeta = {
        selector: "wj-flex-chart-annotation-text",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjProperty",
            "type",
            "attachment",
            "position",
            "point",
            "seriesIndex",
            "pointIndex",
            "offset",
            "style",
            "isVisible",
            "tooltip",
            "text",
            "content",
            "name",
            "width",
            "height",
            "start",
            "end",
            "radius",
            "length",
            "href",
        ],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartAnnotationText = (function (t) {
    function e(e, o, n) {
        var r = t.call(this) || this;
        (r.isInitialized = !1), (r.wjProperty = "items");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                e,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(e, t),
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
        (e.meta = {
            outputs: exports.wjFlexChartAnnotationTextMeta.outputs,
            siblingId: "annotation",
        }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjFlexChartAnnotationTextMeta.selector,
                        template:
                            exports.wjFlexChartAnnotationTextMeta.template,
                        inputs: exports.wjFlexChartAnnotationTextMeta.inputs,
                        outputs: exports.wjFlexChartAnnotationTextMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjFlexChartAnnotationTextMeta.providers
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
})(wjcChartAnnotation.Text);
(exports.WjFlexChartAnnotationText = WjFlexChartAnnotationText),
    (exports.wjFlexChartAnnotationEllipseMeta = {
        selector: "wj-flex-chart-annotation-ellipse",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjProperty",
            "type",
            "attachment",
            "position",
            "point",
            "seriesIndex",
            "pointIndex",
            "offset",
            "style",
            "isVisible",
            "tooltip",
            "text",
            "content",
            "name",
            "width",
            "height",
            "start",
            "end",
            "radius",
            "length",
            "href",
        ],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartAnnotationEllipse = (function (t) {
    function e(e, o, n) {
        var r = t.call(this) || this;
        (r.isInitialized = !1), (r.wjProperty = "items");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                e,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(e, t),
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
        (e.meta = {
            outputs: exports.wjFlexChartAnnotationEllipseMeta.outputs,
            siblingId: "annotation",
        }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjFlexChartAnnotationEllipseMeta.selector,
                        template:
                            exports.wjFlexChartAnnotationEllipseMeta.template,
                        inputs: exports.wjFlexChartAnnotationEllipseMeta.inputs,
                        outputs:
                            exports.wjFlexChartAnnotationEllipseMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjFlexChartAnnotationEllipseMeta.providers
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
})(wjcChartAnnotation.Ellipse);
(exports.WjFlexChartAnnotationEllipse = WjFlexChartAnnotationEllipse),
    (exports.wjFlexChartAnnotationRectangleMeta = {
        selector: "wj-flex-chart-annotation-rectangle",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjProperty",
            "type",
            "attachment",
            "position",
            "point",
            "seriesIndex",
            "pointIndex",
            "offset",
            "style",
            "isVisible",
            "tooltip",
            "text",
            "content",
            "name",
            "width",
            "height",
            "start",
            "end",
            "radius",
            "length",
            "href",
        ],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartAnnotationRectangle = (function (t) {
    function e(e, o, n) {
        var r = t.call(this) || this;
        (r.isInitialized = !1), (r.wjProperty = "items");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                e,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(e, t),
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
        (e.meta = {
            outputs: exports.wjFlexChartAnnotationRectangleMeta.outputs,
            siblingId: "annotation",
        }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjFlexChartAnnotationRectangleMeta.selector,
                        template:
                            exports.wjFlexChartAnnotationRectangleMeta.template,
                        inputs: exports.wjFlexChartAnnotationRectangleMeta
                            .inputs,
                        outputs:
                            exports.wjFlexChartAnnotationRectangleMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjFlexChartAnnotationRectangleMeta.providers
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
})(wjcChartAnnotation.Rectangle);
(exports.WjFlexChartAnnotationRectangle = WjFlexChartAnnotationRectangle),
    (exports.wjFlexChartAnnotationLineMeta = {
        selector: "wj-flex-chart-annotation-line",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjProperty",
            "type",
            "attachment",
            "position",
            "point",
            "seriesIndex",
            "pointIndex",
            "offset",
            "style",
            "isVisible",
            "tooltip",
            "text",
            "content",
            "name",
            "width",
            "height",
            "start",
            "end",
            "radius",
            "length",
            "href",
        ],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartAnnotationLine = (function (t) {
    function e(e, o, n) {
        var r = t.call(this) || this;
        (r.isInitialized = !1), (r.wjProperty = "items");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                e,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(e, t),
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
        (e.meta = {
            outputs: exports.wjFlexChartAnnotationLineMeta.outputs,
            siblingId: "annotation",
        }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjFlexChartAnnotationLineMeta.selector,
                        template:
                            exports.wjFlexChartAnnotationLineMeta.template,
                        inputs: exports.wjFlexChartAnnotationLineMeta.inputs,
                        outputs: exports.wjFlexChartAnnotationLineMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjFlexChartAnnotationLineMeta.providers
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
})(wjcChartAnnotation.Line);
(exports.WjFlexChartAnnotationLine = WjFlexChartAnnotationLine),
    (exports.wjFlexChartAnnotationPolygonMeta = {
        selector: "wj-flex-chart-annotation-polygon",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjProperty",
            "type",
            "attachment",
            "position",
            "point",
            "seriesIndex",
            "pointIndex",
            "offset",
            "style",
            "isVisible",
            "tooltip",
            "text",
            "content",
            "name",
            "width",
            "height",
            "start",
            "end",
            "radius",
            "length",
            "href",
        ],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartAnnotationPolygon = (function (t) {
    function e(e, o, n) {
        var r = t.call(this) || this;
        (r.isInitialized = !1), (r.wjProperty = "items");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                e,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(e, t),
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
        (e.meta = {
            outputs: exports.wjFlexChartAnnotationPolygonMeta.outputs,
            siblingId: "annotation",
        }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjFlexChartAnnotationPolygonMeta.selector,
                        template:
                            exports.wjFlexChartAnnotationPolygonMeta.template,
                        inputs: exports.wjFlexChartAnnotationPolygonMeta.inputs,
                        outputs:
                            exports.wjFlexChartAnnotationPolygonMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjFlexChartAnnotationPolygonMeta.providers
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
})(wjcChartAnnotation.Polygon);
(exports.WjFlexChartAnnotationPolygon = WjFlexChartAnnotationPolygon),
    (exports.wjFlexChartAnnotationCircleMeta = {
        selector: "wj-flex-chart-annotation-circle",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjProperty",
            "type",
            "attachment",
            "position",
            "point",
            "seriesIndex",
            "pointIndex",
            "offset",
            "style",
            "isVisible",
            "tooltip",
            "text",
            "content",
            "name",
            "width",
            "height",
            "start",
            "end",
            "radius",
            "length",
            "href",
        ],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartAnnotationCircle = (function (t) {
    function e(e, o, n) {
        var r = t.call(this) || this;
        (r.isInitialized = !1), (r.wjProperty = "items");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                e,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(e, t),
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
        (e.meta = {
            outputs: exports.wjFlexChartAnnotationCircleMeta.outputs,
            siblingId: "annotation",
        }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjFlexChartAnnotationCircleMeta.selector,
                        template:
                            exports.wjFlexChartAnnotationCircleMeta.template,
                        inputs: exports.wjFlexChartAnnotationCircleMeta.inputs,
                        outputs:
                            exports.wjFlexChartAnnotationCircleMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjFlexChartAnnotationCircleMeta.providers
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
})(wjcChartAnnotation.Circle);
(exports.WjFlexChartAnnotationCircle = WjFlexChartAnnotationCircle),
    (exports.wjFlexChartAnnotationSquareMeta = {
        selector: "wj-flex-chart-annotation-square",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjProperty",
            "type",
            "attachment",
            "position",
            "point",
            "seriesIndex",
            "pointIndex",
            "offset",
            "style",
            "isVisible",
            "tooltip",
            "text",
            "content",
            "name",
            "width",
            "height",
            "start",
            "end",
            "radius",
            "length",
            "href",
        ],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartAnnotationSquare = (function (t) {
    function e(e, o, n) {
        var r = t.call(this) || this;
        (r.isInitialized = !1), (r.wjProperty = "items");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                e,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(e, t),
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
        (e.meta = {
            outputs: exports.wjFlexChartAnnotationSquareMeta.outputs,
            siblingId: "annotation",
        }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjFlexChartAnnotationSquareMeta.selector,
                        template:
                            exports.wjFlexChartAnnotationSquareMeta.template,
                        inputs: exports.wjFlexChartAnnotationSquareMeta.inputs,
                        outputs:
                            exports.wjFlexChartAnnotationSquareMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjFlexChartAnnotationSquareMeta.providers
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
})(wjcChartAnnotation.Square);
(exports.WjFlexChartAnnotationSquare = WjFlexChartAnnotationSquare),
    (exports.wjFlexChartAnnotationImageMeta = {
        selector: "wj-flex-chart-annotation-image",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "wjProperty",
            "type",
            "attachment",
            "position",
            "point",
            "seriesIndex",
            "pointIndex",
            "offset",
            "style",
            "isVisible",
            "tooltip",
            "text",
            "content",
            "name",
            "width",
            "height",
            "start",
            "end",
            "radius",
            "length",
            "href",
        ],
        outputs: ["initialized"],
        providers: [],
    });
var WjFlexChartAnnotationImage = (function (t) {
    function e(e, o, n) {
        var r = t.call(this) || this;
        (r.isInitialized = !1), (r.wjProperty = "items");
        r._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                r,
                e,
                o,
                n
            );
        return r.created(), r;
    }
    return (
        __extends(e, t),
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
        (e.meta = {
            outputs: exports.wjFlexChartAnnotationImageMeta.outputs,
            siblingId: "annotation",
        }),
        (e.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector:
                            exports.wjFlexChartAnnotationImageMeta.selector,
                        template:
                            exports.wjFlexChartAnnotationImageMeta.template,
                        inputs: exports.wjFlexChartAnnotationImageMeta.inputs,
                        outputs: exports.wjFlexChartAnnotationImageMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ].concat(
                            exports.wjFlexChartAnnotationImageMeta.providers
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
})(wjcChartAnnotation.Image);
exports.WjFlexChartAnnotationImage = WjFlexChartAnnotationImage;
var moduleExports = [
        WjFlexChartAnnotationLayer,
        WjFlexChartAnnotationText,
        WjFlexChartAnnotationEllipse,
        WjFlexChartAnnotationRectangle,
        WjFlexChartAnnotationLine,
        WjFlexChartAnnotationPolygon,
        WjFlexChartAnnotationCircle,
        WjFlexChartAnnotationSquare,
        WjFlexChartAnnotationImage,
    ],
    WjChartAnnotationModule = (function () {
        function t() {}
        return (
            (t.decorators = [
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
            (t.ctorParameters = function () {
                return [];
            }),
            t
        );
    })();
exports.WjChartAnnotationModule = WjChartAnnotationModule;
