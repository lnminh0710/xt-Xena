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
      function i() {
        this.constructor = t;
      }
      e(t, r),
        (t.prototype =
          null === r
            ? Object.create(r)
            : ((i.prototype = r.prototype), new i()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcChartFinanceAnalytics = require('wijmo/wijmo.chart.finance.analytics'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjFlexChartFibonacciMeta = {
  selector: 'wj-flex-chart-fibonacci',
  template: '',
  inputs: [
    'asyncBindings',
    'wjProperty',
    'axisX',
    'axisY',
    'binding',
    'bindingX',
    'cssClass',
    'name',
    'style',
    'altStyle',
    'symbolMarker',
    'symbolSize',
    'symbolStyle',
    'visibility',
    'itemsSource',
    'high',
    'low',
    'labelPosition',
    'levels',
    'minX',
    'maxX',
    'uptrend',
  ],
  outputs: [
    'initialized',
    'renderingNg: rendering',
    'renderedNg: rendered',
    'visibilityChangePC: visibilityChange',
  ],
  providers: [],
};
var WjFlexChartFibonacci = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartFibonacciMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartFibonacciMeta.selector,
            template: exports.wjFlexChartFibonacciMeta.template,
            inputs: exports.wjFlexChartFibonacciMeta.inputs,
            outputs: exports.wjFlexChartFibonacciMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartFibonacciMeta.providers),
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
})(wjcChartFinanceAnalytics.Fibonacci);
(exports.WjFlexChartFibonacci = WjFlexChartFibonacci),
  (exports.wjFlexChartFibonacciArcsMeta = {
    selector: 'wj-flex-chart-fibonacci-arcs',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'start',
      'end',
      'labelPosition',
      'levels',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartFibonacciArcs = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartFibonacciArcsMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartFibonacciArcsMeta.selector,
            template: exports.wjFlexChartFibonacciArcsMeta.template,
            inputs: exports.wjFlexChartFibonacciArcsMeta.inputs,
            outputs: exports.wjFlexChartFibonacciArcsMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartFibonacciArcsMeta.providers),
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
})(wjcChartFinanceAnalytics.FibonacciArcs);
(exports.WjFlexChartFibonacciArcs = WjFlexChartFibonacciArcs),
  (exports.wjFlexChartFibonacciFansMeta = {
    selector: 'wj-flex-chart-fibonacci-fans',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'start',
      'end',
      'labelPosition',
      'levels',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartFibonacciFans = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartFibonacciFansMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartFibonacciFansMeta.selector,
            template: exports.wjFlexChartFibonacciFansMeta.template,
            inputs: exports.wjFlexChartFibonacciFansMeta.inputs,
            outputs: exports.wjFlexChartFibonacciFansMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartFibonacciFansMeta.providers),
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
})(wjcChartFinanceAnalytics.FibonacciFans);
(exports.WjFlexChartFibonacciFans = WjFlexChartFibonacciFans),
  (exports.wjFlexChartFibonacciTimeZonesMeta = {
    selector: 'wj-flex-chart-fibonacci-time-zones',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'startX',
      'endX',
      'labelPosition',
      'levels',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartFibonacciTimeZones = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartFibonacciTimeZonesMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartFibonacciTimeZonesMeta.selector,
            template: exports.wjFlexChartFibonacciTimeZonesMeta.template,
            inputs: exports.wjFlexChartFibonacciTimeZonesMeta.inputs,
            outputs: exports.wjFlexChartFibonacciTimeZonesMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartFibonacciTimeZonesMeta.providers),
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
})(wjcChartFinanceAnalytics.FibonacciTimeZones);
(exports.WjFlexChartFibonacciTimeZones = WjFlexChartFibonacciTimeZones),
  (exports.wjFlexChartAtrMeta = {
    selector: 'wj-flex-chart-atr',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'period',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartAtr = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartAtrMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartAtrMeta.selector,
            template: exports.wjFlexChartAtrMeta.template,
            inputs: exports.wjFlexChartAtrMeta.inputs,
            outputs: exports.wjFlexChartAtrMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartAtrMeta.providers),
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
})(wjcChartFinanceAnalytics.ATR);
(exports.WjFlexChartAtr = WjFlexChartAtr),
  (exports.wjFlexChartCciMeta = {
    selector: 'wj-flex-chart-cci',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'period',
      'constant',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartCci = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartCciMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartCciMeta.selector,
            template: exports.wjFlexChartCciMeta.template,
            inputs: exports.wjFlexChartCciMeta.inputs,
            outputs: exports.wjFlexChartCciMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartCciMeta.providers),
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
})(wjcChartFinanceAnalytics.CCI);
(exports.WjFlexChartCci = WjFlexChartCci),
  (exports.wjFlexChartRsiMeta = {
    selector: 'wj-flex-chart-rsi',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'period',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartRsi = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartRsiMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartRsiMeta.selector,
            template: exports.wjFlexChartRsiMeta.template,
            inputs: exports.wjFlexChartRsiMeta.inputs,
            outputs: exports.wjFlexChartRsiMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartRsiMeta.providers),
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
})(wjcChartFinanceAnalytics.RSI);
(exports.WjFlexChartRsi = WjFlexChartRsi),
  (exports.wjFlexChartWilliamsRMeta = {
    selector: 'wj-flex-chart-williams-r',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'period',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartWilliamsR = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartWilliamsRMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartWilliamsRMeta.selector,
            template: exports.wjFlexChartWilliamsRMeta.template,
            inputs: exports.wjFlexChartWilliamsRMeta.inputs,
            outputs: exports.wjFlexChartWilliamsRMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartWilliamsRMeta.providers),
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
})(wjcChartFinanceAnalytics.WilliamsR);
(exports.WjFlexChartWilliamsR = WjFlexChartWilliamsR),
  (exports.wjFlexChartMacdMeta = {
    selector: 'wj-flex-chart-macd',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'fastPeriod',
      'slowPeriod',
      'smoothingPeriod',
      'styles',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartMacd = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartMacdMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartMacdMeta.selector,
            template: exports.wjFlexChartMacdMeta.template,
            inputs: exports.wjFlexChartMacdMeta.inputs,
            outputs: exports.wjFlexChartMacdMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartMacdMeta.providers),
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
})(wjcChartFinanceAnalytics.Macd);
(exports.WjFlexChartMacd = WjFlexChartMacd),
  (exports.wjFlexChartMacdHistogramMeta = {
    selector: 'wj-flex-chart-macd-histogram',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'fastPeriod',
      'slowPeriod',
      'smoothingPeriod',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartMacdHistogram = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartMacdHistogramMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartMacdHistogramMeta.selector,
            template: exports.wjFlexChartMacdHistogramMeta.template,
            inputs: exports.wjFlexChartMacdHistogramMeta.inputs,
            outputs: exports.wjFlexChartMacdHistogramMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartMacdHistogramMeta.providers),
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
})(wjcChartFinanceAnalytics.MacdHistogram);
(exports.WjFlexChartMacdHistogram = WjFlexChartMacdHistogram),
  (exports.wjFlexChartStochasticMeta = {
    selector: 'wj-flex-chart-stochastic',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'dPeriod',
      'kPeriod',
      'smoothingPeriod',
      'styles',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartStochastic = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartStochasticMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartStochasticMeta.selector,
            template: exports.wjFlexChartStochasticMeta.template,
            inputs: exports.wjFlexChartStochasticMeta.inputs,
            outputs: exports.wjFlexChartStochasticMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartStochasticMeta.providers),
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
})(wjcChartFinanceAnalytics.Stochastic);
(exports.WjFlexChartStochastic = WjFlexChartStochastic),
  (exports.wjFlexChartBollingerBandsMeta = {
    selector: 'wj-flex-chart-bollinger-bands',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'period',
      'multiplier',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartBollingerBands = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartBollingerBandsMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartBollingerBandsMeta.selector,
            template: exports.wjFlexChartBollingerBandsMeta.template,
            inputs: exports.wjFlexChartBollingerBandsMeta.inputs,
            outputs: exports.wjFlexChartBollingerBandsMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartBollingerBandsMeta.providers),
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
})(wjcChartFinanceAnalytics.BollingerBands);
(exports.WjFlexChartBollingerBands = WjFlexChartBollingerBands),
  (exports.wjFlexChartEnvelopesMeta = {
    selector: 'wj-flex-chart-envelopes',
    template: '',
    inputs: [
      'asyncBindings',
      'wjProperty',
      'axisX',
      'axisY',
      'binding',
      'bindingX',
      'cssClass',
      'name',
      'style',
      'altStyle',
      'symbolMarker',
      'symbolSize',
      'symbolStyle',
      'visibility',
      'itemsSource',
      'period',
      'size',
      'type',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartEnvelopes = (function (e) {
  function t(t, r, i) {
    var o = e.call(this) || this;
    (o.isInitialized = !1), (o.wjProperty = 'series');
    o._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      o,
      t,
      r,
      i
    );
    return o.created(), o;
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
      outputs: exports.wjFlexChartEnvelopesMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartEnvelopesMeta.selector,
            template: exports.wjFlexChartEnvelopesMeta.template,
            inputs: exports.wjFlexChartEnvelopesMeta.inputs,
            outputs: exports.wjFlexChartEnvelopesMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartEnvelopesMeta.providers),
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
})(wjcChartFinanceAnalytics.Envelopes);
exports.WjFlexChartEnvelopes = WjFlexChartEnvelopes;
var moduleExports = [
    WjFlexChartFibonacci,
    WjFlexChartFibonacciArcs,
    WjFlexChartFibonacciFans,
    WjFlexChartFibonacciTimeZones,
    WjFlexChartAtr,
    WjFlexChartCci,
    WjFlexChartRsi,
    WjFlexChartWilliamsR,
    WjFlexChartMacd,
    WjFlexChartMacdHistogram,
    WjFlexChartStochastic,
    WjFlexChartBollingerBands,
    WjFlexChartEnvelopes,
  ],
  WjChartFinanceAnalyticsModule = (function () {
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
exports.WjChartFinanceAnalyticsModule = WjChartFinanceAnalyticsModule;
