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
  wjcGridGrouppanel = require('wijmo/wijmo.grid.grouppanel'),
  wjcSelf = require('wijmo/wijmo.vue2.grid.grouppanel');
(window.wijmo = window.wijmo || {}),
  (window.wijmo.vue2 = window.wijmo.vue2 || {}),
  (window.wijmo.vue2.grid = window.wijmo.vue2.grid || {}),
  (window.wijmo.vue2.grid.grouppanel = wjcSelf);
var vue_1 = require('vue'),
  VueModule = require('vue');
(exports.Vue = vue_1.default || VueModule),
  (exports.WjGroupPanel = exports.Vue.component('wj-group-panel', {
    template: '<div/>',
    props: wjcVue2Base._getProps('wijmo.grid.grouppanel.GroupPanel'),
    mounted: function () {
      wjcVue2Base._initialize(this, new wjcGridGrouppanel.GroupPanel(this.$el));
    },
  }));
