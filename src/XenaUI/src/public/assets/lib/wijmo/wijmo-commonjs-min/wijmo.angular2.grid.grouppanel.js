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
        for (var o in r) r.hasOwnProperty(o) && (e[o] = r[o]);
      };
    return function (r, o) {
      function t() {
        this.constructor = r;
      }
      e(r, o),
        (r.prototype =
          null === o
            ? Object.create(o)
            : ((t.prototype = o.prototype), new t()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcGridGrouppanel = require('wijmo/wijmo.grid.grouppanel'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  forms_1 = require('@angular/forms'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjGroupPanelMeta = {
  selector: 'wj-group-panel',
  template: '',
  inputs: [
    'wjModelProperty',
    'isDisabled',
    'hideGroupedColumns',
    'maxGroups',
    'placeholder',
    'grid',
  ],
  outputs: ['initialized', 'gotFocusNg: gotFocus', 'lostFocusNg: lostFocus'],
  providers: [
    {
      provide: forms_1.NG_VALUE_ACCESSOR,
      useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
      multi: !0,
      deps: ['WjComponent'],
    },
  ],
};
var WjGroupPanel = (function (e) {
  function r(r, o, t) {
    var n =
      e.call(
        this,
        wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(r, o)
      ) || this;
    n.isInitialized = !1;
    n._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      n,
      r,
      o,
      t
    );
    return n.created(), n;
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
    (r.prototype.addEventListener = function (r, o, t, n) {
      var i = this;
      void 0 === n && (n = !1);
      var a = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
        u = a.ngZone;
      u && a.outsideZoneEvents[o]
        ? u.runOutsideAngular(function () {
            e.prototype.addEventListener.call(i, r, o, t, n);
          })
        : e.prototype.addEventListener.call(this, r, o, t, n);
    }),
    (r.meta = { outputs: exports.wjGroupPanelMeta.outputs }),
    (r.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjGroupPanelMeta.selector,
            template: exports.wjGroupPanelMeta.template,
            inputs: exports.wjGroupPanelMeta.inputs,
            outputs: exports.wjGroupPanelMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return r;
                }),
              },
            ].concat(exports.wjGroupPanelMeta.providers),
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
})(wjcGridGrouppanel.GroupPanel);
exports.WjGroupPanel = WjGroupPanel;
var moduleExports = [WjGroupPanel],
  WjGridGrouppanelModule = (function () {
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
exports.WjGridGrouppanelModule = WjGridGrouppanelModule;
