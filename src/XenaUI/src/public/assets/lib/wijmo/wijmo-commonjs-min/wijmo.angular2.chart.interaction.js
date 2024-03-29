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
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcChartInteraction = require('wijmo/wijmo.chart.interaction'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjFlexChartRangeSelectorMeta = {
  selector: 'wj-flex-chart-range-selector',
  template: '',
  inputs: [
    'wjProperty',
    'isVisible',
    'min',
    'max',
    'orientation',
    'seamless',
    'minScale',
    'maxScale',
  ],
  outputs: ['initialized', 'rangeChangedNg: rangeChanged'],
  providers: [],
};
var WjFlexChartRangeSelector = (function (e) {
  function t(t, r, o) {
    var n = e.call(this, o) || this;
    n.isInitialized = !1;
    n._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
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
    (t.meta = { outputs: exports.wjFlexChartRangeSelectorMeta.outputs }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartRangeSelectorMeta.selector,
            template: exports.wjFlexChartRangeSelectorMeta.template,
            inputs: exports.wjFlexChartRangeSelectorMeta.inputs,
            outputs: exports.wjFlexChartRangeSelectorMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartRangeSelectorMeta.providers),
          },
        ],
      },
    ]),
    (t.ctorParameters = function () {
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
    t
  );
})(wjcChartInteraction.RangeSelector);
(exports.WjFlexChartRangeSelector = WjFlexChartRangeSelector),
  (exports.wjFlexChartGesturesMeta = {
    selector: 'wj-flex-chart-gestures',
    template: '',
    inputs: [
      'wjProperty',
      'mouseAction',
      'interactiveAxes',
      'enable',
      'scaleX',
      'scaleY',
      'posX',
      'posY',
    ],
    outputs: ['initialized'],
    providers: [],
  });
var WjFlexChartGestures = (function (e) {
  function t(t, r, o) {
    var n = e.call(this, o) || this;
    n.isInitialized = !1;
    n._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
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
    (t.meta = { outputs: exports.wjFlexChartGesturesMeta.outputs }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartGesturesMeta.selector,
            template: exports.wjFlexChartGesturesMeta.template,
            inputs: exports.wjFlexChartGesturesMeta.inputs,
            outputs: exports.wjFlexChartGesturesMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartGesturesMeta.providers),
          },
        ],
      },
    ]),
    (t.ctorParameters = function () {
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
    t
  );
})(wjcChartInteraction.ChartGestures);
exports.WjFlexChartGestures = WjFlexChartGestures;
var moduleExports = [WjFlexChartRangeSelector, WjFlexChartGestures],
  WjChartInteractionModule = (function () {
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
exports.WjChartInteractionModule = WjChartInteractionModule;
