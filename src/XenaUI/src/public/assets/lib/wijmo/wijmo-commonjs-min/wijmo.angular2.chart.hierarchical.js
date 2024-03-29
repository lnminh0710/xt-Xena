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
var wjcChartHierarchical = require('wijmo/wijmo.chart.hierarchical'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  forms_1 = require('@angular/forms'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjSunburstMeta = {
  selector: 'wj-sunburst',
  template: '<div><ng-content></ng-content></div>',
  inputs: [
    'wjModelProperty',
    'isDisabled',
    'binding',
    'footer',
    'header',
    'selectionMode',
    'palette',
    'plotMargin',
    'footerStyle',
    'headerStyle',
    'tooltipContent',
    'itemsSource',
    'bindingName',
    'innerRadius',
    'isAnimated',
    'offset',
    'reversed',
    'startAngle',
    'selectedItemPosition',
    'selectedItemOffset',
    'itemFormatter',
    'labelContent',
    'childItemsPath',
  ],
  outputs: [
    'initialized',
    'gotFocusNg: gotFocus',
    'lostFocusNg: lostFocus',
    'renderingNg: rendering',
    'renderedNg: rendered',
    'selectionChangedNg: selectionChanged',
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
var WjSunburst = (function (e) {
  function t(t, r, o) {
    var n =
      e.call(
        this,
        wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(t, r)
      ) || this;
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
    (t.prototype.addEventListener = function (t, r, o, n) {
      var i = this;
      void 0 === n && (n = !1);
      var a = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
        s = a.ngZone;
      s && a.outsideZoneEvents[r]
        ? s.runOutsideAngular(function () {
            e.prototype.addEventListener.call(i, t, r, o, n);
          })
        : e.prototype.addEventListener.call(this, t, r, o, n);
    }),
    Object.defineProperty(t.prototype, 'tooltipContent', {
      get: function () {
        return this.tooltip.content;
      },
      set: function (e) {
        this.tooltip.content = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'labelContent', {
      get: function () {
        return this.dataLabel.content;
      },
      set: function (e) {
        this.dataLabel.content = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.meta = { outputs: exports.wjSunburstMeta.outputs }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjSunburstMeta.selector,
            template: exports.wjSunburstMeta.template,
            inputs: exports.wjSunburstMeta.inputs,
            outputs: exports.wjSunburstMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjSunburstMeta.providers),
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
})(wjcChartHierarchical.Sunburst);
(exports.WjSunburst = WjSunburst),
  (exports.wjTreeMapMeta = {
    selector: 'wj-tree-map',
    template: '',
    inputs: [
      'wjModelProperty',
      'isDisabled',
      'binding',
      'footer',
      'header',
      'selectionMode',
      'palette',
      'plotMargin',
      'footerStyle',
      'headerStyle',
      'tooltipContent',
      'itemsSource',
      'bindingName',
      'maxDepth',
      'type',
      'labelContent',
      'childItemsPath',
    ],
    outputs: [
      'initialized',
      'gotFocusNg: gotFocus',
      'lostFocusNg: lostFocus',
      'renderingNg: rendering',
      'renderedNg: rendered',
      'selectionChangedNg: selectionChanged',
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
var WjTreeMap = (function (e) {
  function t(t, r, o) {
    var n =
      e.call(
        this,
        wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(t, r)
      ) || this;
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
    (t.prototype.addEventListener = function (t, r, o, n) {
      var i = this;
      void 0 === n && (n = !1);
      var a = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
        s = a.ngZone;
      s && a.outsideZoneEvents[r]
        ? s.runOutsideAngular(function () {
            e.prototype.addEventListener.call(i, t, r, o, n);
          })
        : e.prototype.addEventListener.call(this, t, r, o, n);
    }),
    Object.defineProperty(t.prototype, 'tooltipContent', {
      get: function () {
        return this.tooltip.content;
      },
      set: function (e) {
        this.tooltip.content = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'labelContent', {
      get: function () {
        return this.dataLabel.content;
      },
      set: function (e) {
        this.dataLabel.content = e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.meta = { outputs: exports.wjTreeMapMeta.outputs }),
    (t.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjTreeMapMeta.selector,
            template: exports.wjTreeMapMeta.template,
            inputs: exports.wjTreeMapMeta.inputs,
            outputs: exports.wjTreeMapMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjTreeMapMeta.providers),
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
})(wjcChartHierarchical.TreeMap);
exports.WjTreeMap = WjTreeMap;
var moduleExports = [WjSunburst, WjTreeMap],
  WjChartHierarchicalModule = (function () {
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
exports.WjChartHierarchicalModule = WjChartHierarchicalModule;
