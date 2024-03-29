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
        function (e, r) {
          e.__proto__ = r;
        }) ||
      function (e, r) {
        for (var t in r) r.hasOwnProperty(t) && (e[t] = r[t]);
      };
    return function (r, t) {
      function o() {
        this.constructor = r;
      }
      e(r, t),
        (r.prototype =
          null === t
            ? Object.create(t)
            : ((o.prototype = t.prototype), new o()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcGridFilter = require('wijmo/wijmo.grid.filter'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjFlexGridFilterMeta = {
  selector: 'wj-flex-grid-filter',
  template: '',
  inputs: [
    'wjProperty',
    'showFilterIcons',
    'showSortButtons',
    'defaultFilterType',
    'filterColumns',
  ],
  outputs: [
    'initialized',
    'filterChangingNg: filterChanging',
    'filterChangedNg: filterChanged',
    'filterAppliedNg: filterApplied',
  ],
  providers: [],
};
var WjFlexGridFilter = (function (e) {
  function r(r, t, o) {
    var i = e.call(this, o) || this;
    i.isInitialized = !1;
    i._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      i,
      r,
      t,
      o
    );
    return i.created(), i;
  }
  return (
    __extends(r, e),
    (r.prototype.created = function () {}),
    (r.prototype.ngOnInit = function () {
      this._wjBehaviour.ngOnInit();
    }),
    (r.prototype.ngAfterViewInit = function () {
      this._wjBehaviour.ngAfterViewInit();
    }),
    (r.prototype.ngOnDestroy = function () {
      this._wjBehaviour.ngOnDestroy();
    }),
    (r.meta = { outputs: exports.wjFlexGridFilterMeta.outputs }),
    (r.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexGridFilterMeta.selector,
            template: exports.wjFlexGridFilterMeta.template,
            inputs: exports.wjFlexGridFilterMeta.inputs,
            outputs: exports.wjFlexGridFilterMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return r;
                }),
              },
            ].concat(exports.wjFlexGridFilterMeta.providers),
          },
        ],
      },
    ]),
    (r.ctorParameters = function () {
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
    r
  );
})(wjcGridFilter.FlexGridFilter);
exports.WjFlexGridFilter = WjFlexGridFilter;
var moduleExports = [WjFlexGridFilter],
  WjGridFilterModule = (function () {
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
exports.WjGridFilterModule = WjGridFilterModule;
