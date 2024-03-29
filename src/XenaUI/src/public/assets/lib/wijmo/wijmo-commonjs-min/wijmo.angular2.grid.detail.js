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
var wjcGridDetail = require('wijmo/wijmo.grid.detail'),
  core_1 = require('@angular/core'),
  core_2 = require('@angular/core'),
  core_3 = require('@angular/core'),
  common_1 = require('@angular/common'),
  wijmo_angular2_directiveBase_1 = require('wijmo/wijmo.angular2.directiveBase');
exports.wjFlexGridDetailMeta = {
  selector: '[wjFlexGridDetail]',
  inputs: [
    'wjFlexGridDetail',
    'maxHeight',
    'detailVisibilityMode',
    'rowHasDetail',
    'isAnimated',
  ],
  outputs: ['initialized'],
  exportAs: 'wjFlexGridDetail',
  providers: [],
};
var WjFlexGridDetail = (function (e) {
  function t(t, r, o, i, n, a) {
    var c = e.call(this, o) || this;
    c.isInitialized = !1;
    c._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(
      c,
      t,
      r,
      o
    );
    return (
      (c._viewContainerRef = i),
      (c._templateRef = n),
      (c._domRenderer = a),
      c._init(),
      c.created(),
      c
    );
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
    (t.prototype._init = function () {
      var e = this;
      (this.createDetailCell = function (r, o) {
        var i =
            wijmo_angular2_directiveBase_1.WjDirectiveBehavior.instantiateTemplate(
              e.grid.hostElement,
              e._viewContainerRef,
              e._templateRef,
              e._domRenderer
            ),
          n = i.viewRef,
          a = i.rootElement;
        return (
          (n.context.row = r),
          (n.context.col = o),
          (n.context.item = r.dataItem),
          a.parentElement.removeChild(a),
          (a[t._viewRefProp] = n),
          a
        );
      }),
        (this.disposeDetailCell = function (r) {
          var o;
          if (r.detail && (o = r.detail[t._viewRefProp])) {
            r.detail[t._viewRefProp] = null;
            var i = e._viewContainerRef.indexOf(o);
            i > -1 && e._viewContainerRef.remove(i);
          }
        });
    }),
    (t._viewRefProp = '__wj_viewRef'),
    (t.meta = { outputs: exports.wjFlexGridDetailMeta.outputs }),
    (t.decorators = [
      {
        type: core_2.Directive,
        args: [
          {
            selector: exports.wjFlexGridDetailMeta.selector,
            inputs: exports.wjFlexGridDetailMeta.inputs,
            outputs: exports.wjFlexGridDetailMeta.outputs,
            exportAs: exports.wjFlexGridDetailMeta.exportAs,
            providers: [
              {
                provide: 'WjComponent',
                useExisting: core_2.forwardRef(function () {
                  return t;
                }),
              },
            ].concat(exports.wjFlexGridDetailMeta.providers),
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
        {
          type: core_2.ViewContainerRef,
          decorators: [
            {
              type: core_3.Inject,
              args: [core_2.ViewContainerRef],
            },
          ],
        },
        {
          type: core_2.TemplateRef,
          decorators: [{ type: core_3.Inject, args: [core_2.TemplateRef] }],
        },
        {
          type: core_2.Renderer,
          decorators: [{ type: core_3.Inject, args: [core_2.Renderer] }],
        },
      ];
    }),
    t
  );
})(wjcGridDetail.FlexGridDetailProvider);
exports.WjFlexGridDetail = WjFlexGridDetail;
var moduleExports = [WjFlexGridDetail],
  WjGridDetailModule = (function () {
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
exports.WjGridDetailModule = WjGridDetailModule;
