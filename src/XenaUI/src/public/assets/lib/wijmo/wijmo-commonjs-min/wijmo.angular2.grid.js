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
function tryGetModuleWijmoGridDetail() {
    var e, t;
    return (e = window.wijmo) && (t = e.grid) && t.detail;
}
function tryGetModuleWijmoInput() {
    var e;
    return (e = window.wijmo) && e.input;
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
var wjcGrid = require("wijmo/wijmo.grid"),
    wjcCore = require("wijmo/wijmo"),
    core_1 = require("@angular/core"),
    core_2 = require("@angular/core"),
    core_3 = require("@angular/core"),
    common_1 = require("@angular/common"),
    forms_1 = require("@angular/forms"),
    wijmo_angular2_directiveBase_1 = require("wijmo/wijmo.angular2.directiveBase");
exports.wjFlexGridMeta = {
    selector: "wj-flex-grid",
    template: "<div><ng-content></ng-content></div>",
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
var WjFlexGrid = (function (e) {
    function t(t, o, r, i) {
        var n =
            e.call(
                this,
                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(
                    t,
                    o
                )
            ) || this;
        n.isInitialized = !1;
        n._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                n,
                t,
                o,
                r
            );
        return (
            new DirectiveCellFactory(n, i),
            n.deferUpdate(function () {
                if (n.rows.defaultSize < 10) {
                    var e = n.hostElement,
                        t = getComputedStyle(e),
                        o = getComputedStyle(document.body),
                        r =
                            2 *
                            parseInt(
                                t.fontSize && wjcCore.contains(document.body, e)
                                    ? t.fontSize
                                    : o.fontSize
                            );
                    (n.rows.defaultSize = r),
                        (n.columns.defaultSize = 4 * r),
                        (n.columnHeaders.rows.defaultSize = r),
                        (n.rowHeaders.columns.defaultSize = Math.round(
                            1.25 * r
                        ));
                }
            }),
            n.created(),
            n
        );
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
            var l = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
                a = l.ngZone;
            a && l.outsideZoneEvents[o]
                ? a.runOutsideAngular(function () {
                      e.prototype.addEventListener.call(n, t, o, r, i);
                  })
                : e.prototype.addEventListener.call(this, t, o, r, i);
        }),
        (t.meta = { outputs: exports.wjFlexGridMeta.outputs }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexGridMeta.selector,
                        template: exports.wjFlexGridMeta.template,
                        inputs: exports.wjFlexGridMeta.inputs,
                        outputs: exports.wjFlexGridMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexGridMeta.providers),
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
        t
    );
})(wjcGrid.FlexGrid);
(exports.WjFlexGrid = WjFlexGrid),
    (exports.wjFlexGridColumnMeta = {
        selector: "wj-flex-grid-column",
        template: "<div><ng-content></ng-content></div>",
        inputs: [
            "asyncBindings",
            "wjProperty",
            "name",
            "dataMap",
            "dataType",
            "binding",
            "sortMemberPath",
            "format",
            "header",
            "width",
            "maxLength",
            "minWidth",
            "maxWidth",
            "align",
            "allowDragging",
            "allowSorting",
            "allowResizing",
            "allowMerging",
            "aggregate",
            "isReadOnly",
            "cssClass",
            "isContentHtml",
            "isSelected",
            "visible",
            "wordWrap",
            "mask",
            "inputType",
            "isRequired",
            "showDropDown",
            "dropDownCssClass",
            "quickAutoSize",
        ],
        outputs: ["initialized", "isSelectedChangePC: isSelectedChange"],
        providers: [],
    });
var WjFlexGridColumn = (function (e) {
    function t(t, o, r) {
        var i = e.call(this) || this;
        (i.isInitialized = !1), (i.wjProperty = "columns");
        var n = (i._wjBehaviour =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
                i,
                t,
                o,
                r
            )).parentBehavior.directive;
        return (
            n.autoGenerateColumns &&
                ((n.autoGenerateColumns = !1), n.columns.clear()),
            i.created(),
            i
        );
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
            outputs: exports.wjFlexGridColumnMeta.outputs,
            changeEvents: { "grid.selectionChanged": ["isSelected"] },
        }),
        (t.decorators = [
            {
                type: core_1.Component,
                args: [
                    {
                        selector: exports.wjFlexGridColumnMeta.selector,
                        template: exports.wjFlexGridColumnMeta.template,
                        inputs: exports.wjFlexGridColumnMeta.inputs,
                        outputs: exports.wjFlexGridColumnMeta.outputs,
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return t;
                                }),
                            },
                        ].concat(exports.wjFlexGridColumnMeta.providers),
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
})(wjcGrid.Column);
exports.WjFlexGridColumn = WjFlexGridColumn;
var WjFlexGridCellTemplate = (function () {
    function e(e, t, o, r, i, n, l) {
        (this.viewContainerRef = e),
            (this.templateRef = t),
            (this.elRef = o),
            (this.domRenderer = i),
            (this.cdRef = l),
            (this.autoSizeRows = !0),
            (this.forceFullEdit = !0),
            r instanceof WjFlexGrid
                ? (this.grid = r)
                : r instanceof WjFlexGridColumn &&
                  ((this.column = r),
                  (this.grid =
                      wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getBehavior(
                          r
                      ).parentBehavior.directive));
    }
    return (
        (e._getTemplContextProp = function (e) {
            return "$__cellTempl" + CellTemplateType[e];
        }),
        (e.prototype.ngOnInit = function () {
            (this.ownerControl =
                this.column && this.column.grid === this.grid
                    ? this.column
                    : this.grid),
                this._attachToControl();
        }),
        (e.prototype.ngOnDestroy = function () {
            this.cellTypeStr &&
                (this.viewContainerRef.clear(),
                (this.ownerControl[e._getTemplContextProp(this.cellType)] =
                    null),
                this.grid.invalidate());
        }),
        (e.prototype._instantiateTemplate = function (e, t) {
            return wijmo_angular2_directiveBase_1.WjDirectiveBehavior.instantiateTemplate(
                e,
                this.viewContainerRef,
                this.templateRef,
                this.domRenderer,
                !1,
                t
            );
        }),
        (e.prototype._attachToControl = function () {
            if (this.cellTypeStr) {
                var t = (this.cellType = wjcCore.asEnum(
                        this.cellTypeStr,
                        CellTemplateType
                    )),
                    o = this.ownerControl;
                (o[e._getTemplContextProp(t)] = this),
                    o instanceof wjcGrid.Column &&
                        (t === CellTemplateType.Cell ||
                            t === CellTemplateType.ColumnHeader ||
                            t === CellTemplateType.ColumnFooter) &&
                        o._setFlag(wjcGrid.RowColFlags.HasTemplate, !0),
                    this.grid.invalidate();
            }
        }),
        (e.decorators = [
            {
                type: core_2.Directive,
                args: [
                    {
                        selector: "[wjFlexGridCellTemplate]",
                        inputs: [
                            "wjFlexGridCellTemplate",
                            "cellTypeStr: cellType",
                            "cellOverflow",
                            "valuePaths",
                            "autoSizeRows",
                            "forceFullEdit",
                        ],
                        exportAs: "wjFlexGridCellTemplate",
                        providers: [
                            {
                                provide: "WjComponent",
                                useExisting: core_2.forwardRef(function () {
                                    return e;
                                }),
                            },
                        ],
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
                    type: void 0,
                    decorators: [
                        { type: core_3.Inject, args: ["WjComponent"] },
                        { type: core_3.SkipSelf },
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
                    type: core_2.Injector,
                    decorators: [
                        { type: core_3.Inject, args: [core_2.Injector] },
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
exports.WjFlexGridCellTemplate = WjFlexGridCellTemplate;
var CellTemplateType;
!(function (e) {
    (e[(e.Cell = 0)] = "Cell"),
        (e[(e.CellEdit = 1)] = "CellEdit"),
        (e[(e.ColumnHeader = 2)] = "ColumnHeader"),
        (e[(e.RowHeader = 3)] = "RowHeader"),
        (e[(e.RowHeaderEdit = 4)] = "RowHeaderEdit"),
        (e[(e.TopLeft = 5)] = "TopLeft"),
        (e[(e.GroupHeader = 6)] = "GroupHeader"),
        (e[(e.Group = 7)] = "Group"),
        (e[(e.NewCellTemplate = 8)] = "NewCellTemplate"),
        (e[(e.ColumnFooter = 9)] = "ColumnFooter"),
        (e[(e.BottomLeft = 10)] = "BottomLeft");
})(
    (CellTemplateType =
        exports.CellTemplateType || (exports.CellTemplateType = {}))
);
var DirectiveCellFactory = (function (e) {
        function t(o, r) {
            var i = e.call(this) || this;
            if (
                ((i._needsCdCheck = !1),
                (i._lastApplyTimeStamp = 0),
                (i._noApplyLag = !1),
                (i._startingEditing = !1),
                (i._cellStampCounter = 0),
                (i._composing = !1),
                (i.grid = o),
                (i._gridCdRef = r),
                !t._templateTypes)
            ) {
                t._templateTypes = [];
                for (var n in CellTemplateType)
                    isNaN(n) && t._templateTypes.push(n);
            }
            var l = i;
            return (
                (i._baseCf = o.cellFactory),
                (o.cellFactory = i),
                (i._evtInput = document.createEvent("HTMLEvents")),
                i._evtInput.initEvent("input", !0, !1),
                (i._evtBlur = document.createEvent("HTMLEvents")),
                i._evtBlur.initEvent("blur", !1, !1),
                o.prepareCellForEdit.addHandler(function (e, t) {
                    l._noApplyLag = !0;
                }),
                o.cellEditEnded.addHandler(function (e, t) {
                    (t.range.col < 0 ||
                        (t.range.col < o.columns.length &&
                            !o.columns[t.range.col][
                                WjFlexGridCellTemplate._getTemplContextProp(
                                    CellTemplateType.CellEdit
                                )
                            ])) &&
                        (l._editChar = null),
                        setTimeout(function () {
                            l._noApplyLag = !1;
                        }, 300);
                }),
                o.beginningEdit.addHandler(function (e, t) {
                    l._startingEditing = !0;
                }),
                o.hostElement.addEventListener(
                    "keydown",
                    function (e) {
                        l._startingEditing = !1;
                    },
                    !0
                ),
                o.hostElement.addEventListener(
                    "keypress",
                    function (e) {
                        var t =
                            e.charCode > 32
                                ? String.fromCharCode(e.charCode)
                                : null;
                        t &&
                            wjcCore.closest(e.target, ".wj-flexgrid") ===
                                o.hostElement &&
                            (!o.activeEditor || l._startingEditing
                                ? (l._editChar = t)
                                : l._editChar && (l._editChar += t));
                    },
                    !0
                ),
                o.hostElement.addEventListener(
                    "compositionstart",
                    function (e) {
                        l._composing = !0;
                    },
                    !0
                ),
                o.hostElement.addEventListener(
                    "compositionend",
                    function (e) {
                        l._composing = !1;
                    },
                    !0
                ),
                o.updatedView.addHandler(function () {
                    i._needsCdCheck &&
                        ((i._needsCdCheck = !1), i._gridCdRef.markForCheck());
                }, i),
                i
            );
        }
        return (
            __extends(t, e),
            (t.prototype.updateCell = function (e, o, r, i, n) {
                var l = this;
                this._cellStampCounter = (this._cellStampCounter + 1) % 1e7;
                var a = (i[t._cellStampProp] = this._cellStampCounter);
                i.style.overflow && (i.style.overflow = "");
                var d,
                    s = this,
                    c = e.grid,
                    p = c.editRange,
                    u = e.rows[o],
                    g = u.dataItem,
                    m = !1,
                    C = !1,
                    w = !1,
                    f = !1;
                switch (e.cellType) {
                    case wjcGrid.CellType.Cell:
                        if (p && p.row === o && p.col === r)
                            (d = CellTemplateType.CellEdit), (C = w = !0);
                        else if (u instanceof wjcGrid.GroupRow) {
                            var _ = !(
                                (f =
                                    g instanceof wjcCore.CollectionViewGroup) ||
                                u.hasChildren
                            );
                            r == e.columns.firstVisibleIndex
                                ? (d = _
                                      ? CellTemplateType.Cell
                                      : CellTemplateType.GroupHeader)
                                : ((d = _
                                      ? CellTemplateType.Cell
                                      : CellTemplateType.Group),
                                  (C = !0));
                        } else
                            u instanceof wjcGrid._NewRowTemplate
                                ? (d = CellTemplateType.NewCellTemplate)
                                : (tryGetModuleWijmoGridDetail() &&
                                      tryGetModuleWijmoGridDetail().DetailRow &&
                                      u instanceof
                                          tryGetModuleWijmoGridDetail()
                                              .DetailRow) ||
                                  (d = CellTemplateType.Cell);
                        break;
                    case wjcGrid.CellType.ColumnHeader:
                        d = CellTemplateType.ColumnHeader;
                        break;
                    case wjcGrid.CellType.RowHeader:
                        (d =
                            c.collectionView &&
                            c.collectionView.currentEditItem === g
                                ? CellTemplateType.RowHeaderEdit
                                : CellTemplateType.RowHeader),
                            (m = !0);
                        break;
                    case wjcGrid.CellType.TopLeft:
                        (d = CellTemplateType.TopLeft), (m = !0);
                        break;
                    case wjcGrid.CellType.ColumnFooter:
                        (d = CellTemplateType.ColumnFooter), (C = !0);
                        break;
                    case wjcGrid.CellType.BottomLeft:
                        (d = CellTemplateType.BottomLeft), (m = !0);
                }
                var v = !1;
                if (null != d) {
                    var h =
                        f && d == CellTemplateType.GroupHeader
                            ? c.columns.getColumn(
                                  g.groupDescription.propertyName
                              )
                            : r >= 0 && r < e.columns.length
                            ? e.columns[r]
                            : null;
                    if (h) {
                        var y = WjFlexGridCellTemplate._getTemplContextProp(d),
                            j = (m ? c : h)[y];
                        if (
                            (j ||
                                (d === CellTemplateType.RowHeaderEdit
                                    ? ((d = CellTemplateType.RowHeader),
                                      (y =
                                          WjFlexGridCellTemplate._getTemplContextProp(
                                              d
                                          )),
                                      (j = c[y]))
                                    : (d !== CellTemplateType.Group &&
                                          d !== CellTemplateType.GroupHeader) ||
                                      f ||
                                      ((d = CellTemplateType.Cell),
                                      (y =
                                          WjFlexGridCellTemplate._getTemplContextProp(
                                              d
                                          )),
                                      (j = h[y]))),
                            j)
                        ) {
                            var E;
                            C && (E = e.getCellData(o, r, !1)), (v = !0);
                            var T = i.getAttribute(
                                    wjcGrid.FlexGrid._WJS_MEASURE
                                ),
                                R = T && "true" === T.toLowerCase();
                            w && this._baseCf.updateCell(e, o, r, i, n, !0);
                            var x,
                                G = i[y] || {},
                                S =
                                    G.column !== h ||
                                    !G.viewRef ||
                                    G.templateContextProperty !== y ||
                                    i.firstChild != G.rootElement,
                                F = w && this._composing && c.imeEnabled;
                            if (S) {
                                if (w) {
                                    var I = i.firstElementChild;
                                    I &&
                                        (F || i.focus(),
                                        (I.style.display = "none"));
                                } else i.textContent = "";
                                this._doDisposeCell(i);
                                var N = {};
                                x = this._setViewRefContext(
                                    N,
                                    u,
                                    h,
                                    g,
                                    E,
                                    j.valuePaths
                                );
                                var W = j._instantiateTemplate(i, N);
                                (G.column = h),
                                    (G.viewRef = W.viewRef),
                                    (G.rootElement = W.rootElement),
                                    (G.templateContextProperty = y),
                                    (i[y] = G);
                            } else
                                x = this._setViewRefContext(
                                    G.viewRef.context,
                                    u,
                                    h,
                                    g,
                                    E,
                                    j.valuePaths
                                );
                            if (
                                (j.cellOverflow &&
                                    (i.style.overflow = j.cellOverflow),
                                R
                                    ? j.cdRef.detectChanges()
                                    : j.autoSizeRows && !F
                                    ? setTimeout(function () {
                                          if (a === i[t._cellStampProp]) {
                                              var r = i.scrollHeight,
                                                  d = e.rows,
                                                  p = (n && n.rowSpan) || 1;
                                              if (
                                                  o < d.length &&
                                                  d[o].renderHeight * p < r - 1
                                              ) {
                                                  if (
                                                      ((d.defaultSize = r / p),
                                                      w)
                                                  ) {
                                                      var u = s._isFullEdit();
                                                      return (
                                                          c.refresh(),
                                                          void c.startEditing(u)
                                                      );
                                                  }
                                              } else
                                                  w &&
                                                      l._initEditInput(
                                                          G,
                                                          j,
                                                          null
                                                      );
                                          }
                                      }, 0)
                                    : w &&
                                      setTimeout(function () {
                                          F
                                              ? l._initImeEditInput(G, j)
                                              : l._initEditInput(G, j, null);
                                      }, 0),
                                w)
                            ) {
                                s._cellEditorVars = x.localVars;
                                var D = function (e, t) {
                                        if (
                                            (c.cellEditEnding.removeHandler(D),
                                            !t.stayInEditMode)
                                        ) {
                                            var o = wjcCore.getActiveElement();
                                            o && o.dispatchEvent(s._evtBlur),
                                                i.focus();
                                        }
                                        if (
                                            (s._triggerEditorEvents(i),
                                            !t.cancel && !t.stayInEditMode)
                                        )
                                            for (
                                                var r = x.localVars,
                                                    n = 0,
                                                    l =
                                                        Object.getOwnPropertyNames(
                                                            x.bindings
                                                        );
                                                n < l.length;
                                                n++
                                            ) {
                                                var a = l[n];
                                                x.bindings[a].setValue(
                                                    r,
                                                    x.localVars.values[a]
                                                );
                                            }
                                        var d =
                                            i.querySelectorAll(".wj-dropdown");
                                        [].forEach.call(d, function (e) {
                                            var t =
                                                wjcCore.Control.getControl(e);
                                            t &&
                                                tryGetModuleWijmoInput() &&
                                                t instanceof
                                                    tryGetModuleWijmoInput()
                                                        .DropDown &&
                                                (t.isDroppedDown = !1);
                                        });
                                    },
                                    H = function (e, t) {
                                        c.cellEditEnded.removeHandler(H),
                                            (s._cellEditorVars = null);
                                    };
                                c.cellEditEnding.addHandler(D),
                                    c.cellEditEnded.addHandler(H);
                            } else this._baseCf.updateCell(e, o, r, i, n, !1);
                        }
                    }
                }
                v ||
                    (this._doDisposeCell(i),
                    this._baseCf.updateCell(e, o, r, i, n));
            }),
            (t.prototype.getEditorValue = function (t) {
                if (this._cellEditorVars) {
                    var o = t.editRange;
                    return (
                        o &&
                            o.isValid &&
                            this._triggerEditorEvents(
                                t.cells.getCellElement(o.row, o.col)
                            ),
                        this._cellEditorVars.value
                    );
                }
                return e.prototype.getEditorValue.call(this, t);
            }),
            (t.prototype.disposeCell = function (e) {
                this._doDisposeCell(e);
            }),
            (t.prototype._doDisposeCell = function (e) {
                for (var o = t._templateTypes, r = 0; r < o.length; r++) {
                    var i = WjFlexGridCellTemplate._getTemplContextProp(
                            CellTemplateType[o[r]]
                        ),
                        n = e[i];
                    if (n && n.viewRef) {
                        var l = (n.column || this.grid)[i];
                        if (l) {
                            var a = l.viewContainerRef.indexOf(n.viewRef);
                            a > -1 && l.viewContainerRef.remove(a);
                        }
                        (n.viewRef = null),
                            (n.rootElement = null),
                            (n.column = null),
                            (n.templateContextProperty = null),
                            (e[i] = null);
                    }
                }
            }),
            (t.prototype._setViewRefContext = function (e, t, o, r, i, n) {
                (this._needsCdCheck = !0),
                    (e.row = t),
                    (e.col = o),
                    (e.item = r);
                var l = {},
                    a = e.cell || {},
                    d = {},
                    s = { localVars: a, bindings: d };
                if (
                    ((a.row = t),
                    (a.col = o),
                    (a.item = r),
                    (a.value = i),
                    (a.values = l),
                    n)
                )
                    for (
                        var c = 0, p = Object.getOwnPropertyNames(n);
                        c < p.length;
                        c++
                    ) {
                        var u = p[c],
                            g = new wjcCore.Binding(n[u]);
                        (d[u] = g), (l[u] = g.getValue(a));
                    }
                return e.cell !== a && (e.cell = a), s;
            }),
            (t.prototype._initEditInput = function (e, o, r) {
                var i = this;
                this._setFullEdit(o);
                var n = this._findInitialInput(e);
                if (n) {
                    var l = function () {
                        n.removeEventListener("focus", l),
                            setTimeout(function () {
                                var e = null != r ? r : i._editChar;
                                e &&
                                    ((n.value = e),
                                    (i._editChar = null),
                                    t._setSelectionRange(n, e.length, e.length),
                                    n.dispatchEvent(i._evtInput));
                            }, t._FOCUS_INTERVAL);
                    };
                    n.addEventListener("focus", l), n.focus();
                }
            }),
            (t.prototype._initImeEditInput = function (e, t) {
                var o = this,
                    r = wjcCore.getActiveElement();
                if (
                    r &&
                    r instanceof HTMLInputElement &&
                    wjcCore.hasClass(r, "wj-grid-ime")
                ) {
                    var i = function (n) {
                        r.removeEventListener("compositionend", i),
                            wjcCore.setCss(r, wjcGrid._ImeHandler._cssHidden),
                            o._initEditInput(e, t, r.value);
                    };
                    r.addEventListener("compositionend", i);
                    var n = this._findInitialInput(e);
                    if (n) {
                        var l = n.getBoundingClientRect(),
                            a = r.getBoundingClientRect(),
                            d = window.getComputedStyle(r),
                            s = parseFloat(d.left),
                            c = parseFloat(d.top);
                        wjcCore.setCss(r, {
                            left: s + l.left - a.left + "px",
                            top: c + l.top - a.top + "px",
                            width: l.width + "px",
                            height: l.height + "px",
                        });
                    }
                }
            }),
            (t.prototype._findInitialInput = function (e) {
                var t =
                    e &&
                    e.rootElement &&
                    e.rootElement.querySelectorAll("input,textarea");
                if (t)
                    for (var o = 0; o < t.length; o++) {
                        var r = t[o],
                            i = window.getComputedStyle(r);
                        if ("none" !== i.display && "visible" === i.visibility)
                            return r;
                    }
                return null;
            }),
            (t._setSelectionRange = function (e, t, o) {
                if (
                    (void 0 === o && (o = t),
                    wjcCore.contains(document.body, e) &&
                        !e.disabled &&
                        "none" != e.style.display)
                )
                    try {
                        e.setSelectionRange(
                            wjcCore.asNumber(t),
                            wjcCore.asNumber(o),
                            wjcCore.isIE() ? null : "backward"
                        ),
                            e.focus();
                    } catch (e) {}
            }),
            (t.prototype._triggerEditorEvents = function (e) {
                if (e)
                    for (
                        var t = e.querySelectorAll(".wj-control"), o = 0;
                        o < t.length;
                        o++
                    ) {
                        var r = t[o],
                            i = wjcCore.Control.getControl(r);
                        if (i) {
                            var n =
                                wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getBehavior(
                                    i
                                );
                            n && n.flushPendingEvents();
                        }
                    }
            }),
            (t.prototype._isFullEdit = function () {
                var e = this.grid;
                return !e.activeEditor || e._edtHdl._fullEdit;
            }),
            (t.prototype._setFullEdit = function (e) {
                var t = this.grid;
                e.forceFullEdit && t.activeEditor && (t._edtHdl._fullEdit = !0);
            }),
            (t._cellStampProp = "__wjCellStamp"),
            (t._FOCUS_INTERVAL = wjcCore.Control._FOCUS_INTERVAL + 20),
            t
        );
    })(wjcGrid.CellFactory),
    moduleExports = [WjFlexGrid, WjFlexGridColumn, WjFlexGridCellTemplate],
    WjGridModule = (function () {
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
exports.WjGridModule = WjGridModule;
