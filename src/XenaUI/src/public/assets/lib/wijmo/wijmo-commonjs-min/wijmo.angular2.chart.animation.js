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
    var t =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (t, e) {
          t.__proto__ = e;
        }) ||
      function (t, e) {
        for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
      };
    return function (e, r) {
      function o() {
        this.constructor = e;
      }
      t(e, r),
        (e.prototype =
          null === r
            ? Object.create(r)
            : ((o.prototype = r.prototype), new o()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcChartAnimation = require('wijmo/wijmo.chart.animation'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjFlexChartAnimationMeta = {
  selector: 'wj-flex-chart-animation',
  template: '',
  inputs: [
    'wjProperty',
    'animationMode',
    'easing',
    'duration',
    'axisAnimation',
  ],
  outputs: ['initialized'],
  providers: [],
};
var WjFlexChartAnimation = (function (t) {
  function e(e, r, o) {
    var n = t.call(this, o) || this;
    n.isInitialized = !1;
    n._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      n,
      e,
      r,
      o
    );
    return n.created(), n;
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
    (e.meta = { outputs: exports.wjFlexChartAnimationMeta.outputs }),
    (e.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartAnimationMeta.selector,
            template: exports.wjFlexChartAnimationMeta.template,
            inputs: exports.wjFlexChartAnimationMeta.inputs,
            outputs: exports.wjFlexChartAnimationMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return e;
                }),
              },
            ].concat(exports.wjFlexChartAnimationMeta.providers),
          },
        ],
      },
    ]),
    (e.ctorParameters = function () {
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
    e
  );
})(wjcChartAnimation.ChartAnimation);
exports.WjFlexChartAnimation = WjFlexChartAnimation;
var moduleExports = [WjFlexChartAnimation],
  WjChartAnimationModule = (function () {
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
exports.WjChartAnimationModule = WjChartAnimationModule;
