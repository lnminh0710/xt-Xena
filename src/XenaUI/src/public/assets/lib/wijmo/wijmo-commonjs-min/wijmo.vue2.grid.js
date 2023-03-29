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
var wjcVue2Base = require('wijmo/wijmo.vue2.base'),
  wjcGrid = require('wijmo/wijmo.grid'),
  wjcGridFilter = require('wijmo/wijmo.grid.filter'),
  wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.vue2.grid');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.vue2 = window.wijmo.vue2 || {}),
  (window.wijmo.vue2.grid = wjcSelf);
var vue_1 = require('vue'),
  VueModule = require('vue');
(exports.Vue = vue_1.default || VueModule),
  (exports.WjFlexGrid = exports.Vue.component('wj-flex-grid', {
    template: '<div><slot/></div>',
    props: wjcVue2Base._getProps('wijmo.grid.FlexGrid'),
    mounted: function () {
      var e = !0;
      this.$children.forEach(function (i) {
        switch (i.$options.name) {
          case 'wj-flex-grid-column':
            e = !1;
        }
      });
      var i = new wjcGrid.FlexGrid(this.$el, { autoGenerateColumns: e });
      this.$children.forEach(function (e) {
        switch (e.$options.name) {
          case 'wj-flex-grid-column':
            var r = wjcVue2Base._initialize(e, new wjcGrid.Column());
            i.columns.push(r);
            break;
          case 'wj-flex-grid-filter':
            wjcVue2Base._initialize(e, new wjcGridFilter.FlexGridFilter(i));
        }
        wjcCore.removeChild(e.$el);
      }),
        wjcVue2Base._initialize(this, i);
    },
  })),
  (exports.WjFlexGridColumn = exports.Vue.component('wj-flex-grid-column', {
    template: '<div/>',
    props: wjcVue2Base._getProps('wijmo.grid.Column'),
  }));
