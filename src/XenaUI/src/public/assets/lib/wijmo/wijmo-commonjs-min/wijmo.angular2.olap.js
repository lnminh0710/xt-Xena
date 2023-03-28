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
Object.defineProperty(exports, "__esModule", { value: !0 });
var wjcOlap = require("wijmo/wijmo.olap"),
    core_1 = require("@angular/core"),
    core_2 = require("@angular/core"),
    core_3 = require("@angular/core"),
    common_1 = require("@angular/common"),
    forms_1 = require("@angular/forms"),
    wijmo_angular2_directiveBase_1 = require("wijmo/wijmo.angular2.directiveBase");
exports.wjPivotGridMeta = {
    selector: "wj-pivot-grid",
    template: "",
    inputs: [
        "wjModelProperty",
        "isDisabled",
        "newRowAtTop",
        "allowAddNew",
        "allowDelete",
        "allowDragging",
        "allowMerging",
        "allowResizing",
        "allowSorting",
        "quickAutoSize",
        "autoSizeMode",
        "autoGenerateColumns",
        "childItemsPath",
        "groupHeaderFormat",
        "headersVisibility",
        "showSelectedHeaders",
        "showMarquee",
        "itemFormatter",
        "isReadOnly",
        "imeEnabled",
        "mergeManager",
        "selectionMode",
        "showGroups",
        "showSort",
        "showDropDown",
        "showAlternatingRows",
        "showErrors",
        "validateEdits",
        "treeIndent",
        "itemsSource",
        "autoClipboard",
        "frozenRows",
        "frozenColumns",
        "cloneFrozenCells",
        "deferResizing",
        "sortRowIndex",
        "stickyHeaders",
        "preserveSelectedState",
        "preserveOutlineState",
        "keyActionTab",
        "keyActionEnter",
        "rowHeaderPath",
        "virtualizationThreshold",
        "showDetailOnDoubleClick",
        "customContextMenu",
        "collapsibleSubtotals",
        "centerHeadersVertically",
        "showColumnFieldHeaders",
        "showRowFieldHeaders",
    ],
    outputs: [
        "initialized",
        "gotFocusNg: gotFocus",
        "lostFocusNg: lostFocus",
        "beginningEditNg: beginningEdit",
        "cellEditEndedNg: cellEditEnded",
        "cellEditEndingNg: cellEditEnding",
        "prepareCellForEditNg: prepareCellForEdit",
        "formatItemNg: formatItem",
        "resizingColumnNg: resizingColumn",
        "resizedColumnNg: resizedColumn",
        "autoSizingColumnNg: autoSizingColumn",
        "autoSizedColumnNg: autoSizedColumn",
        "draggingColumnNg: draggingColumn",
        "draggingColumnOverNg: draggingColumnOver",
        "draggedColumnNg: draggedColumn",
        "sortingColumnNg: sortingColumn",
        "sortedColumnNg: sortedColumn",
        "resizingRowNg: resizingRow",
        "resizedRowNg: resizedRow",
        "autoSizingRowNg: autoSizingRow",
        "autoSizedRowNg: autoSizedRow",
        "draggingRowNg: draggingRow",
        "draggingRowOverNg: draggingRowOver",
        "draggedRowNg: draggedRow",
        "deletingRowNg: deletingRow",
        "deletedRowNg: deletedRow",
        "loadingRowsNg: loadingRows",
        "loadedRowsNg: loadedRows",
        "rowEditStartingNg: rowEditStarting",
        "rowEditStartedNg: rowEditStarted",
        "rowEditEndingNg: rowEditEnding",
        "rowEditEndedNg: rowEditEnded",
        "rowAddedNg: rowAdded",
        "groupCollapsedChangedNg: groupCollapsedChanged",
        "groupCollapsedChangingNg: groupCollapsedChanging",
        "itemsSourceChangedNg: itemsSourceChanged",
        "selectionChangingNg: selectionChanging",
        "selectionChangedNg: selectionChanged",
        "scrollPositionChangedNg: scrollPositionChanged",
        "updatingViewNg: updatingView",
        "updatedViewNg: updatedView",
        "updatingLayoutNg: updatingLayout",
        "updatedLayoutNg: updatedLayout",
        "pastingNg: pasting",
        "pastedNg: pasted",
        "pastingCellNg: pastingCell",
        "pastedCellNg: pastedCell",
        "copyingNg: copying",
        "copiedNg: copied",
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
var WjPivotGrid = (function (e) {
    function t(t, o, r) {
        var i =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        i.isInitialized = !1;
        i._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                i,
                t,
                o,
                r
            );
        return i.created(), i;
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
        (t.prototype.addEventListener = function (t, o, r, i) {
            var n = this;
            void 0 === i && (i = !1);
            var a = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = a.ngZone;
            s && a.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(n, t, o, r, i);
                  })
                : e.prototype.addEventListener.call(this, t, o, r, i);
        }),
        (t.meta = { outputs: exports.wjPivotGridMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjPivotGridMeta.selector,
                        template: exports.wjPivotGridMeta.template,
                        inputs: exports.wjPivotGridMeta.inputs,
                        outputs: exports.wjPivotGridMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjPivotGridMeta.providers),
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
})(wjcOlap.PivotGrid);
(exports.WjPivotGrid = WjPivotGrid),
    (exports.wjPivotChartMeta = {
        selector: "wj-pivot-chart",
        template: "",
        inputs: [
            "wjModelProperty",
            "isDisabled",
            "chartType",
            "showHierarchicalAxes",
            "showTotals",
            "showTitle",
            "showLegend",
            "legendPosition",
            "stacking",
            "maxSeries",
            "maxPoints",
            "itemsSource",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
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
var WjPivotChart = (function (e) {
    function t(t, o, r) {
        var i =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        i.isInitialized = !1;
        i._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                i,
                t,
                o,
                r
            );
        return i.created(), i;
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
        (t.prototype.addEventListener = function (t, o, r, i) {
            var n = this;
            void 0 === i && (i = !1);
            var a = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = a.ngZone;
            s && a.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(n, t, o, r, i);
                  })
                : e.prototype.addEventListener.call(this, t, o, r, i);
        }),
        (t.meta = { outputs: exports.wjPivotChartMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjPivotChartMeta.selector,
                        template: exports.wjPivotChartMeta.template,
                        inputs: exports.wjPivotChartMeta.inputs,
                        outputs: exports.wjPivotChartMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjPivotChartMeta.providers),
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
})(wjcOlap.PivotChart);
(exports.WjPivotChart = WjPivotChart),
    (exports.wjPivotPanelMeta = {
        selector: "wj-pivot-panel",
        template: "",
        inputs: [
            "wjModelProperty",
            "isDisabled",
            "autoGenerateFields",
            "viewDefinition",
            "engine",
            "itemsSource",
            "showFieldIcons",
            "restrictDragging",
        ],
        outputs: [
            "initialized",
            "gotFocusNg: gotFocus",
            "lostFocusNg: lostFocus",
            "itemsSourceChangedNg: itemsSourceChanged",
            "viewDefinitionChangedNg: viewDefinitionChanged",
            "updatingViewNg: updatingView",
            "updatedViewNg: updatedView",
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
var WjPivotPanel = (function (e) {
    function t(t, o, r) {
        var i =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        i.isInitialized = !1;
        i._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                i,
                t,
                o,
                r
            );
        return i.created(), i;
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
        (t.prototype.addEventListener = function (t, o, r, i) {
            var n = this;
            void 0 === i && (i = !1);
            var a = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                s = a.ngZone;
            s && a.outsideZoneEvents[o]
                ? s.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(n, t, o, r, i);
                  })
                : e.prototype.addEventListener.call(this, t, o, r, i);
        }),
        (t.meta = { outputs: exports.wjPivotPanelMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjPivotPanelMeta.selector,
                        template: exports.wjPivotPanelMeta.template,
                        inputs: exports.wjPivotPanelMeta.inputs,
                        outputs: exports.wjPivotPanelMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjPivotPanelMeta.providers),
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
})(wjcOlap.PivotPanel);
exports.WjPivotPanel = WjPivotPanel;
var moduleExports = [WjPivotGrid, WjPivotChart, WjPivotPanel],
    WjOlapModule = (function () {
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
exports.WjOlapModule = WjOlapModule;
