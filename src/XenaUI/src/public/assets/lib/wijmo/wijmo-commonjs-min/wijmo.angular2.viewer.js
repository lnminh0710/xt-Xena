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
var wjcViewer = require('wijmo/wijmo.viewer'),
  wjcCore = require('wijmo/wijmo'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  forms_1 = require('@angular/forms'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjReportViewerMeta = {
  selector: 'wj-report-viewer',
  template: '',
  inputs: [
    'asyncBindings',
    'wjModelProperty',
    'serviceUrl',
    'filePath',
    'fullScreen',
    'zoomFactor',
    'mouseMode',
    'selectMouseMode',
    'viewMode',
    'paginated',
    'reportName',
  ],
  outputs: [
    'initialized',
    'pageIndexChangedNg: pageIndexChanged',
    'viewModeChangedNg: viewModeChanged',
    'viewModeChangePC: viewModeChange',
    'mouseModeChangedNg: mouseModeChanged',
    'mouseModeChangePC: mouseModeChange',
    'selectMouseModeChangedNg: selectMouseModeChanged',
    'selectMouseModeChangePC: selectMouseModeChange',
    'fullScreenChangedNg: fullScreenChanged',
    'fullScreenChangePC: fullScreenChange',
    'zoomFactorChangedNg: zoomFactorChanged',
    'zoomFactorChangePC: zoomFactorChange',
    'queryLoadingDataNg: queryLoadingData',
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
var WjReportViewer = (function (e) {
  function o(o, t, r) {
    var n =
      e.call(
        this,
        wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(o, t)
      ) || this;
    n.isInitialized = !1;
    n._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      n,
      o,
      t,
      r
    );
    return n.created(), n;
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
    (o.prototype.addEventListener = function (o, t, r, n) {
      var a = this;
      void 0 === n && (n = !1);
      var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
        s = i.ngZone;
      s && i.outsideZoneEvents[t]
        ? s.runOutsideAngular(function () {
            e.prototype.addEventListener.call(a, o, t, r, n);
          })
        : e.prototype.addEventListener.call(this, o, t, r, n);
    }),
    (o.prototype.onSelectMouseModeChanged = function (e) {
      (this.selectMouseModeChanged._handlers.length > 1 ||
        this.selectMouseModeChangedNg.observers.length > 0) &&
        wjcCore._deprecated('selectMouseModeChanged', 'mouseModeChanged'),
        this.selectMouseModeChanged.raise(this, e);
    }),
    (o.meta = {
      outputs: exports.wjReportViewerMeta.outputs,
      changeEvents: {
        viewModeChanged: ['viewMode'],
        mouseModeChanged: ['mouseMode'],
        selectMouseModeChanged: ['selectMouseMode'],
        fullScreenChanged: ['fullScreen'],
        zoomFactorChanged: ['zoomFactor'],
      },
    }),
    (o.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjReportViewerMeta.selector,
            template: exports.wjReportViewerMeta.template,
            inputs: exports.wjReportViewerMeta.inputs,
            outputs: exports.wjReportViewerMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return o;
                }),
              },
            ].concat(exports.wjReportViewerMeta.providers),
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
})(wjcViewer.ReportViewer);
(exports.WjReportViewer = WjReportViewer),
  (exports.wjPdfViewerMeta = {
    selector: 'wj-pdf-viewer',
    template: '',
    inputs: [
      'asyncBindings',
      'wjModelProperty',
      'serviceUrl',
      'filePath',
      'fullScreen',
      'zoomFactor',
      'mouseMode',
      'selectMouseMode',
      'viewMode',
    ],
    outputs: [
      'initialized',
      'pageIndexChangedNg: pageIndexChanged',
      'viewModeChangedNg: viewModeChanged',
      'viewModeChangePC: viewModeChange',
      'mouseModeChangedNg: mouseModeChanged',
      'mouseModeChangePC: mouseModeChange',
      'selectMouseModeChangedNg: selectMouseModeChanged',
      'selectMouseModeChangePC: selectMouseModeChange',
      'fullScreenChangedNg: fullScreenChanged',
      'fullScreenChangePC: fullScreenChange',
      'zoomFactorChangedNg: zoomFactorChanged',
      'zoomFactorChangePC: zoomFactorChange',
      'queryLoadingDataNg: queryLoadingData',
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
var WjPdfViewer = (function (e) {
  function o(o, t, r) {
    var n =
      e.call(
        this,
        wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(o, t)
      ) || this;
    n.isInitialized = !1;
    n._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      n,
      o,
      t,
      r
    );
    return n.created(), n;
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
    (o.prototype.addEventListener = function (o, t, r, n) {
      var a = this;
      void 0 === n && (n = !1);
      var i = wijmo_angular2_directiveBase_1.WjDirectiveBehavior,
        s = i.ngZone;
      s && i.outsideZoneEvents[t]
        ? s.runOutsideAngular(function () {
            e.prototype.addEventListener.call(a, o, t, r, n);
          })
        : e.prototype.addEventListener.call(this, o, t, r, n);
    }),
    (o.prototype.onSelectMouseModeChanged = function (e) {
      (this.selectMouseModeChanged._handlers.length > 1 ||
        this.selectMouseModeChangedNg.observers.length > 0) &&
        wjcCore._deprecated('selectMouseModeChanged', 'mouseModeChanged'),
        this.selectMouseModeChanged.raise(this, e);
    }),
    (o.meta = {
      outputs: exports.wjPdfViewerMeta.outputs,
      changeEvents: {
        viewModeChanged: ['viewMode'],
        mouseModeChanged: ['mouseMode'],
        selectMouseModeChanged: ['selectMouseMode'],
        fullScreenChanged: ['fullScreen'],
        zoomFactorChanged: ['zoomFactor'],
      },
    }),
    (o.decorators = [
      {
        type: core_1.Component,
        args: [
          {
            selector: exports.wjPdfViewerMeta.selector,
            template: exports.wjPdfViewerMeta.template,
            inputs: exports.wjPdfViewerMeta.inputs,
            outputs: exports.wjPdfViewerMeta.outputs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return o;
                }),
              },
            ].concat(exports.wjPdfViewerMeta.providers),
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
})(wjcViewer.PdfViewer);
exports.WjPdfViewer = WjPdfViewer;
var moduleExports = [WjReportViewer, WjPdfViewer],
  WjViewerModule = (function () {
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
exports.WjViewerModule = WjViewerModule;
