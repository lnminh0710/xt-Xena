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
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  ngCore = require('@angular/core'),
  common_1 = require('@angular/common'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjTooltipMeta = {
  selector: '[wjTooltip]',
  inputs: [],
  outputs: ['initialized'],
  exportAs: 'wjTooltip',
  providers: [],
};
var WjTooltip = (function () {
  function e(t, o, r) {
    this.isInitialized = !1;
    this._wjBehaviour =
      wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(this, t, o, r);
    (this._elRef = t),
      e._toolTip || (e._toolTip = new wjcCore.Tooltip()),
      this.created();
  }
  return (
    (e.prototype.created = function () {}),
    (e.prototype.ngOnInit = function () {
      this._wjBehaviour.ngOnInit();
    }),
    (e.prototype.ngAfterViewInit = function () {
      this._wjBehaviour.ngAfterViewInit();
    }),
    (e.prototype.ngOnDestroy = function () {
      this._wjBehaviour.ngOnDestroy(), (this.wjTooltip = null);
    }),
    Object.defineProperty(e.prototype, 'wjTooltip', {
      get: function () {
        return this._toolTipText;
      },
      set: function (t) {
        this._toolTipText != t &&
          (this._toolTipText,
          e._toolTip.setTooltip(this._elRef.nativeElement, t));
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.meta = { outputs: exports.wjTooltipMeta.outputs }),
    (e.decorators = [
      {
        type: core_2.Directive,
        args: [
          {
            selector: exports.wjTooltipMeta.selector,
            inputs: exports.wjTooltipMeta.inputs,
            outputs: exports.wjTooltipMeta.outputs,
            exportAs: exports.wjTooltipMeta.exportAs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return e;
                }),
              },
            ].concat(exports.wjTooltipMeta.providers),
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
    (e.propDecorators = { wjTooltip: [{ type: core_3.Input }] }),
    e
  );
})();
exports.WjTooltip = WjTooltip;
var WjComponentLoader = (function () {
  function e(e, t) {
    (this._cmpResolver = e),
      (this._elementRef = t),
      (this._isInit = !1),
      (this.propertiesChange = new ngCore.EventEmitter());
  }
  return (
    Object.defineProperty(e.prototype, 'component', {
      get: function () {
        return this._component;
      },
      set: function (e) {
        this._component !== e &&
          ((this._component = e), this._createComponent());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'properties', {
      get: function () {
        return this._properties;
      },
      set: function (e) {
        (this._properties = e), this._updateProperties();
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.ngOnInit = function () {
      (this._isInit = !0), this._createComponent();
    }),
    (e.prototype._createComponent = function () {
      if (this._isInit) {
        this._cmpRef && (this._cmpRef.destroy(), (this._cmpRef = null));
        var e = this._component;
        e &&
          this._anchor &&
          ((this._cmpRef = this._anchor.createComponent(
            this._cmpResolver.resolveComponentFactory(e)
          )),
          this._updateProperties());
      }
    }),
    (e.prototype._updateProperties = function () {
      var e = this._cmpRef && this._cmpRef.instance,
        t = this.properties;
      if (e && t)
        for (var o = 0, r = Object.getOwnPropertyNames(t); o < r.length; o++) {
          var i = r[o];
          e[i] = t[i];
          var n = e[i + 'Change'];
          n instanceof core_1.EventEmitter && this._addPropListener(e, i, n);
        }
    }),
    (e.prototype._addPropListener = function (e, t, o) {
      var r = this;
      o.subscribe(function (o) {
        (r.properties[t] = r.properties[t] = e[t]),
          r.propertiesChange.next(r.properties);
      });
    }),
    (e.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: 'wj-component-loader',
            template: '<div #anchor></div>',
            inputs: ['component', 'properties'],
            outputs: ['propertiesChange'],
          },
        ],
      },
    ]),
    (e.ctorParameters = function () {
      return [
        {
          type: core_1.ComponentFactoryResolver,
          decorators: [
            {
              type: core_3.Inject,
              args: [core_1.ComponentFactoryResolver],
            },
          ],
        },
        {
          type: core_2.ElementRef,
          decorators: [{ type: core_3.Inject, args: [core_2.ElementRef] }],
        },
      ];
    }),
    (e.propDecorators = {
      _anchor: [
        {
          type: core_1.ViewChild,
          args: ['anchor', { read: core_2.ViewContainerRef }],
        },
      ],
    }),
    e
  );
})();
exports.WjComponentLoader = WjComponentLoader;
var moduleExports = [WjTooltip, WjComponentLoader],
  WjCoreModule = (function () {
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
exports.WjCoreModule = WjCoreModule;
