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
        function (e, o) {
          e.__proto__ = o;
        }) ||
      function (e, o) {
        for (var t in o) o.hasOwnProperty(t) && (e[t] = o[t]);
      };
    return function (o, t) {
      function r() {
        this.constructor = o;
      }
      e(o, t),
        (o.prototype =
          null === t
            ? Object.create(t)
            : ((r.prototype = t.prototype), new r()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcGridMultirow = require('wijmo/wijmo.grid.multirow'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  forms_1 = require('@angular/forms'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjMultiRowMeta = {
  selector: 'wj-multi-row',
  template: '',
  inputs: [
    'wjModelProperty',
    'isDisabled',
    'newRowAtTop',
    'allowAddNew',
    'allowDelete',
    'allowDragging',
    'allowMerging',
    'allowResizing',
    'allowSorting',
    'autoSizeMode',
    'autoGenerateColumns',
    'childItemsPath',
    'groupHeaderFormat',
    'headersVisibility',
    'showSelectedHeaders',
    'showMarquee',
    'itemFormatter',
    'isReadOnly',
    'imeEnabled',
    'mergeManager',
    'selectionMode',
    'showGroups',
    'showSort',
    'showDropDown',
    'showAlternatingRows',
    'showErrors',
    'validateEdits',
    'treeIndent',
    'itemsSource',
    'autoClipboard',
    'frozenRows',
    'frozenColumns',
    'deferResizing',
    'sortRowIndex',
    'stickyHeaders',
    'preserveSelectedState',
    'preserveOutlineState',
    'keyActionTab',
    'keyActionEnter',
    'rowHeaderPath',
    'virtualizationThreshold',
    'layoutDefinition',
    'centerHeadersVertically',
    'collapsedHeaders',
    'showHeaderCollapseButton',
  ],
  outputs: [
    'initialized',
    'gotFocusNg: gotFocus',
    'lostFocusNg: lostFocus',
    'beginningEditNg: beginningEdit',
    'cellEditEndedNg: cellEditEnded',
    'cellEditEndingNg: cellEditEnding',
    'prepareCellForEditNg: prepareCellForEdit',
    'formatItemNg: formatItem',
    'resizingColumnNg: resizingColumn',
    'resizedColumnNg: resizedColumn',
    'autoSizingColumnNg: autoSizingColumn',
    'autoSizedColumnNg: autoSizedColumn',
    'draggingColumnNg: draggingColumn',
    'draggingColumnOverNg: draggingColumnOver',
    'draggedColumnNg: draggedColumn',
    'sortingColumnNg: sortingColumn',
    'sortedColumnNg: sortedColumn',
    'resizingRowNg: resizingRow',
    'resizedRowNg: resizedRow',
    'autoSizingRowNg: autoSizingRow',
    'autoSizedRowNg: autoSizedRow',
    'draggingRowNg: draggingRow',
    'draggingRowOverNg: draggingRowOver',
    'draggedRowNg: draggedRow',
    'deletingRowNg: deletingRow',
    'deletedRowNg: deletedRow',
    'loadingRowsNg: loadingRows',
    'loadedRowsNg: loadedRows',
    'rowEditStartingNg: rowEditStarting',
    'rowEditStartedNg: rowEditStarted',
    'rowEditEndingNg: rowEditEnding',
    'rowEditEndedNg: rowEditEnded',
    'rowAddedNg: rowAdded',
    'groupCollapsedChangedNg: groupCollapsedChanged',
    'groupCollapsedChangingNg: groupCollapsedChanging',
    'itemsSourceChangedNg: itemsSourceChanged',
    'selectionChangingNg: selectionChanging',
    'selectionChangedNg: selectionChanged',
    'scrollPositionChangedNg: scrollPositionChanged',
    'updatingViewNg: updatingView',
    'updatedViewNg: updatedView',
    'updatingLayoutNg: updatingLayout',
    'updatedLayoutNg: updatedLayout',
    'pastingNg: pasting',
    'pastedNg: pasted',
    'pastingCellNg: pastingCell',
    'pastedCellNg: pastedCell',
    'copyingNg: copying',
    'copiedNg: copied',
  ],
  providers: [
    {
      provide: forms_1.NG_VALUE_ACCESSOR,
      useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
      multi: !0,
      deps: ['WjComponent'],
    },
  ],
};
var WjMultiRow = (function (e) {
  function o(o, t, r) {
    var i =
      e.call(
        this,
        wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(o, t)
      ) || this;
    i.isInitialized = !1;
    i._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      i,
      o,
      t,
      r
    );
    return i.created(), i;
  }
  return (
    __extends(o, e),
    (o.prototype.created = function () {}),
    (o.prototype.ngOnInit = function () {
      this._wjBehaviour.ngOnInit();
    }),
    (o.prototype.ngAfterViewInit = function () {
      this._wjBehaviour.ngAfterViewInit();
    }),
    (o.prototype.ngOnDestroy = function () {
      this._wjBehaviour.ngOnDestroy();
    }),
    (o.prototype.addEventListener = function (o, t, r, i) {
      var n = this;
      void 0 === i && (i = !1);
      var a = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
        d = a.ngZone;
      d && a.outsideZoneEvents[t]
        ? d.runOutsideAngular(function () {
            e.prototype.addEventListener.call(n, o, t, r, i);
          })
        : e.prototype.addEventListener.call(this, o, t, r, i);
    }),
    (o.meta = { outputs: exports.wjMultiRowMeta.outputs }),
    (o.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjMultiRowMeta.selector,
            template: exports.wjMultiRowMeta.template,
            inputs: exports.wjMultiRowMeta.inputs,
            outputs: exports.wjMultiRowMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return o;
                }),
              },
            ].concat(exports.wjMultiRowMeta.providers),
          },
        ],
      },
    ]),
    (o.ctorParameters = function () {
      return [
        {
          type: core_2.ElementRef,
          decorators: [{ type: core_3.Inject, args: [core_2.ElementRef] }],
        },
        {
          type: core_2.Injector,
          decorators: [{ type: core_3.Inject, args: [core_2.Injector] }],
        },
        {
          type: void 0,
          decorators: [
            { type: core_3.Inject, args: ['WjComponent'] },
            { type: core_3.SkipSelf },
            { type: core_2.Optional },
          ],
        },
      ];
    }),
    o
  );
})(wjcGridMultirow.MultiRow);
exports.WjMultiRow = WjMultiRow;
var moduleExports = [WjMultiRow],
  WjGridMultirowModule = (function () {
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
exports.WjGridMultirowModule = WjGridMultirowModule;
