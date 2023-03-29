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
var wjcChartAnalytics = require('wijmo/wijmo.chart.analytics'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjFlexChartTrendLineMeta = {
  selector: 'wj-flex-chart-trend-line',
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
    'sampleCount',
    'order',
    'fitType',
  ],
  outputs: [
    'initialized',
    'renderingNg: rendering',
    'renderedNg: rendered',
    'visibilityChangePC: visibilityChange',
  ],
  providers: [],
};
var WjFlexChartTrendLine = (function (e) {
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
      outputs: exports.wjFlexChartTrendLineMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartTrendLineMeta.selector,
            template: exports.wjFlexChartTrendLineMeta.template,
            inputs: exports.wjFlexChartTrendLineMeta.inputs,
            outputs: exports.wjFlexChartTrendLineMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartTrendLineMeta.providers),
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
})(wjcChartAnalytics.TrendLine);
(exports.WjFlexChartTrendLine = WjFlexChartTrendLine),
  (exports.wjFlexChartMovingAverageMeta = {
    selector: 'wj-flex-chart-moving-average',
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
      'sampleCount',
      'period',
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
var WjFlexChartMovingAverage = (function (e) {
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
      outputs: exports.wjFlexChartMovingAverageMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartMovingAverageMeta.selector,
            template: exports.wjFlexChartMovingAverageMeta.template,
            inputs: exports.wjFlexChartMovingAverageMeta.inputs,
            outputs: exports.wjFlexChartMovingAverageMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartMovingAverageMeta.providers),
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
})(wjcChartAnalytics.MovingAverage);
(exports.WjFlexChartMovingAverage = WjFlexChartMovingAverage),
  (exports.wjFlexChartYFunctionSeriesMeta = {
    selector: 'wj-flex-chart-y-function-series',
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
      'sampleCount',
      'min',
      'max',
      'func',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartYFunctionSeries = (function (e) {
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
      outputs: exports.wjFlexChartYFunctionSeriesMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartYFunctionSeriesMeta.selector,
            template: exports.wjFlexChartYFunctionSeriesMeta.template,
            inputs: exports.wjFlexChartYFunctionSeriesMeta.inputs,
            outputs: exports.wjFlexChartYFunctionSeriesMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartYFunctionSeriesMeta.providers),
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
})(wjcChartAnalytics.YFunctionSeries);
(exports.WjFlexChartYFunctionSeries = WjFlexChartYFunctionSeries),
  (exports.wjFlexChartParametricFunctionSeriesMeta = {
    selector: 'wj-flex-chart-parametric-function-series',
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
      'sampleCount',
      'min',
      'max',
      'func',
      'xFunc',
      'yFunc',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartParametricFunctionSeries = (function (e) {
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
      outputs: exports.wjFlexChartParametricFunctionSeriesMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartParametricFunctionSeriesMeta.selector,
            template: exports.wjFlexChartParametricFunctionSeriesMeta.template,
            inputs: exports.wjFlexChartParametricFunctionSeriesMeta.inputs,
            outputs: exports.wjFlexChartParametricFunctionSeriesMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartParametricFunctionSeriesMeta.providers),
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
})(wjcChartAnalytics.ParametricFunctionSeries);
(exports.WjFlexChartParametricFunctionSeries =
  WjFlexChartParametricFunctionSeries),
  (exports.wjFlexChartWaterfallMeta = {
    selector: 'wj-flex-chart-waterfall',
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
      'relativeData',
      'start',
      'startLabel',
      'showTotal',
      'totalLabel',
      'showIntermediateTotal',
      'intermediateTotalPositions',
      'intermediateTotalLabels',
      'connectorLines',
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
var WjFlexChartWaterfall = (function (e) {
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
      outputs: exports.wjFlexChartWaterfallMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartWaterfallMeta.selector,
            template: exports.wjFlexChartWaterfallMeta.template,
            inputs: exports.wjFlexChartWaterfallMeta.inputs,
            outputs: exports.wjFlexChartWaterfallMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartWaterfallMeta.providers),
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
})(wjcChartAnalytics.Waterfall);
(exports.WjFlexChartWaterfall = WjFlexChartWaterfall),
  (exports.wjFlexChartBoxWhiskerMeta = {
    selector: 'wj-flex-chart-box-whisker',
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
      'quartileCalculation',
      'groupWidth',
      'gapWidth',
      'showMeanLine',
      'meanLineStyle',
      'showMeanMarker',
      'meanMarkerStyle',
      'showInnerPoints',
      'showOutliers',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartBoxWhisker = (function (e) {
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
      outputs: exports.wjFlexChartBoxWhiskerMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartBoxWhiskerMeta.selector,
            template: exports.wjFlexChartBoxWhiskerMeta.template,
            inputs: exports.wjFlexChartBoxWhiskerMeta.inputs,
            outputs: exports.wjFlexChartBoxWhiskerMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartBoxWhiskerMeta.providers),
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
})(wjcChartAnalytics.BoxWhisker);
(exports.WjFlexChartBoxWhisker = WjFlexChartBoxWhisker),
  (exports.wjFlexChartErrorBarMeta = {
    selector: 'wj-flex-chart-error-bar',
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
      'chartType',
      'errorBarStyle',
      'value',
      'errorAmount',
      'endStyle',
      'direction',
    ],
    outputs: [
      'initialized',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'visibilityChangePC: visibilityChange',
    ],
    providers: [],
  });
var WjFlexChartErrorBar = (function (e) {
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
      outputs: exports.wjFlexChartErrorBarMeta.outputs,
      changeEvents: { 'chart.seriesVisibilityChanged': ['visibility'] },
      siblingId: 'series',
    }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjFlexChartErrorBarMeta.selector,
            template: exports.wjFlexChartErrorBarMeta.template,
            inputs: exports.wjFlexChartErrorBarMeta.inputs,
            outputs: exports.wjFlexChartErrorBarMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexChartErrorBarMeta.providers),
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
})(wjcChartAnalytics.ErrorBar);
exports.WjFlexChartErrorBar = WjFlexChartErrorBar;
var moduleExports = [
    WjFlexChartTrendLine,
    WjFlexChartMovingAverage,
    WjFlexChartYFunctionSeries,
    WjFlexChartParametricFunctionSeries,
    WjFlexChartWaterfall,
    WjFlexChartBoxWhisker,
    WjFlexChartErrorBar,
  ],
  WjChartAnalyticsModule = (function () {
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
exports.WjChartAnalyticsModule = WjChartAnalyticsModule;
