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
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcGauge = require('wijmo/wijmo.gauge'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  forms_1 = require('@angular/forms'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjLinearGaugeMeta = {
  selector: 'wj-linear-gauge',
  template: '<div><ng-content></ng-content></div>',
  inputs: [
    'asyncBindings',
    'wjModelProperty',
    'isDisabled',
    'value',
    'min',
    'max',
    'origin',
    'isReadOnly',
    'step',
    'format',
    'thickness',
    'hasShadow',
    'isAnimated',
    'showText',
    'showTicks',
    'showRanges',
    'thumbSize',
    'tickSpacing',
    'getText',
    'direction',
  ],
  outputs: [
    'initialized',
    'gotFocusNg: gotFocus',
    'lostFocusNg: lostFocus',
    'valueChangedNg: valueChanged',
    'valueChangePC: valueChange',
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
var WjLinearGauge = (function (e) {
  function t(t, o, r) {
    var a =
      e.call(
        this,
        wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(t, o)
      ) || this;
    (a.isInitialized = !1), (a.wjModelProperty = 'value');
    a._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      a,
      t,
      o,
      r
    );
    return a.created(), a;
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
    (t.prototype.addEventListener = function (t, o, r, a) {
      var n = this;
      void 0 === a && (a = !1);
      var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
        s = i.ngZone;
      s && i.outsideZoneEvents[o]
        ? s.runOutsideAngular(function () {
            e.prototype.addEventListener.call(n, t, o, r, a);
          })
        : e.prototype.addEventListener.call(this, t, o, r, a);
    }),
    (t.meta = {
      outputs: exports.wjLinearGaugeMeta.outputs,
      changeEvents: { valueChanged: ['value'] },
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjLinearGaugeMeta.selector,
            template: exports.wjLinearGaugeMeta.template,
            inputs: exports.wjLinearGaugeMeta.inputs,
            outputs: exports.wjLinearGaugeMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjLinearGaugeMeta.providers),
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
})(wjcGauge.LinearGauge);
(exports.WjLinearGauge = WjLinearGauge),
  (exports.wjBulletGraphMeta = {
    selector: 'wj-bullet-graph',
    template: '<div><ng-content></ng-content></div>',
    inputs: [
      'asyncBindings',
      'wjModelProperty',
      'isDisabled',
      'value',
      'min',
      'max',
      'origin',
      'isReadOnly',
      'step',
      'format',
      'thickness',
      'hasShadow',
      'isAnimated',
      'showText',
      'showTicks',
      'showRanges',
      'thumbSize',
      'tickSpacing',
      'getText',
      'direction',
      'target',
      'good',
      'bad',
    ],
    outputs: [
      'initialized',
      'gotFocusNg: gotFocus',
      'lostFocusNg: lostFocus',
      'valueChangedNg: valueChanged',
      'valueChangePC: valueChange',
    ],
    providers: [
      {
        provide: forms_1.NG_VALUE_ACCESSOR,
        useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
        multi: !0,
        deps: ['WjComponent'],
      },
    ],
  });
var WjBulletGraph = (function (e) {
  function t(t, o, r) {
    var a =
      e.call(
        this,
        wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(t, o)
      ) || this;
    (a.isInitialized = !1), (a.wjModelProperty = 'value');
    a._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      a,
      t,
      o,
      r
    );
    return a.created(), a;
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
    (t.prototype.addEventListener = function (t, o, r, a) {
      var n = this;
      void 0 === a && (a = !1);
      var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
        s = i.ngZone;
      s && i.outsideZoneEvents[o]
        ? s.runOutsideAngular(function () {
            e.prototype.addEventListener.call(n, t, o, r, a);
          })
        : e.prototype.addEventListener.call(this, t, o, r, a);
    }),
    (t.meta = {
      outputs: exports.wjBulletGraphMeta.outputs,
      changeEvents: { valueChanged: ['value'] },
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjBulletGraphMeta.selector,
            template: exports.wjBulletGraphMeta.template,
            inputs: exports.wjBulletGraphMeta.inputs,
            outputs: exports.wjBulletGraphMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjBulletGraphMeta.providers),
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
})(wjcGauge.BulletGraph);
(exports.WjBulletGraph = WjBulletGraph),
  (exports.wjRadialGaugeMeta = {
    selector: 'wj-radial-gauge',
    template: '<div><ng-content></ng-content></div>',
    inputs: [
      'asyncBindings',
      'wjModelProperty',
      'isDisabled',
      'value',
      'min',
      'max',
      'origin',
      'isReadOnly',
      'step',
      'format',
      'thickness',
      'hasShadow',
      'isAnimated',
      'showText',
      'showTicks',
      'showRanges',
      'thumbSize',
      'tickSpacing',
      'getText',
      'autoScale',
      'startAngle',
      'sweepAngle',
    ],
    outputs: [
      'initialized',
      'gotFocusNg: gotFocus',
      'lostFocusNg: lostFocus',
      'valueChangedNg: valueChanged',
      'valueChangePC: valueChange',
    ],
    providers: [
      {
        provide: forms_1.NG_VALUE_ACCESSOR,
        useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory,
        multi: !0,
        deps: ['WjComponent'],
      },
    ],
  });
var WjRadialGauge = (function (e) {
  function t(t, o, r) {
    var a =
      e.call(
        this,
        wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(t, o)
      ) || this;
    (a.isInitialized = !1), (a.wjModelProperty = 'value');
    a._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      a,
      t,
      o,
      r
    );
    return a.created(), a;
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
    (t.prototype.addEventListener = function (t, o, r, a) {
      var n = this;
      void 0 === a && (a = !1);
      var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
        s = i.ngZone;
      s && i.outsideZoneEvents[o]
        ? s.runOutsideAngular(function () {
            e.prototype.addEventListener.call(n, t, o, r, a);
          })
        : e.prototype.addEventListener.call(this, t, o, r, a);
    }),
    (t.meta = {
      outputs: exports.wjRadialGaugeMeta.outputs,
      changeEvents: { valueChanged: ['value'] },
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjRadialGaugeMeta.selector,
            template: exports.wjRadialGaugeMeta.template,
            inputs: exports.wjRadialGaugeMeta.inputs,
            outputs: exports.wjRadialGaugeMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjRadialGaugeMeta.providers),
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
})(wjcGauge.RadialGauge);
(exports.WjRadialGauge = WjRadialGauge),
  (exports.wjRangeMeta = {
    selector: 'wj-range',
    template: '',
    inputs: ['wjProperty', 'color', 'min', 'max', 'name', 'thickness'],
    outputs: ['initialized'],
    providers: [],
  });
var WjRange = (function (e) {
  function t(t, o, r) {
    var a = e.call(this) || this;
    (a.isInitialized = !1), (a.wjProperty = 'ranges');
    a._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      a,
      t,
      o,
      r
    );
    return a.created(), a;
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
    (t.meta = { outputs: exports.wjRangeMeta.outputs }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjRangeMeta.selector,
            template: exports.wjRangeMeta.template,
            inputs: exports.wjRangeMeta.inputs,
            outputs: exports.wjRangeMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjRangeMeta.providers),
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
})(wjcGauge.Range);
exports.WjRange = WjRange;
var moduleExports = [WjLinearGauge, WjBulletGraph, WjRadialGauge, WjRange],
  WjGaugeModule = (function () {
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
exports.WjGaugeModule = WjGaugeModule;
