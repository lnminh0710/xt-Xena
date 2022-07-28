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
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var wjcVue2Base=require("wijmo/wijmo.vue2.base"),wjcChart=require("wijmo/wijmo.chart"),wjcCore=require("wijmo/wijmo"),wjcSelf=require("wijmo/wijmo.vue2.chart");window.wijmo=window.wijmo||{},window.wijmo.vue2=window.wijmo.vue2||{},window.wijmo.vue2.chart=wjcSelf;var vue_1=require("vue"),VueModule=require("vue");exports.Vue=vue_1.default||VueModule,exports.WjFlexChart=exports.Vue.component("wj-flex-chart",{template:"<div><slot/></div>",props:wjcVue2Base._getProps("wijmo.chart.FlexChart",["tooltipContent"]),mounted:function(){var e=new wjcChart.FlexChart(this.$el);this.$children.forEach(function(t){switch(t.$options.name){case"wj-flex-chart-series":var r=wjcVue2Base._initialize(t,new wjcChart.Series);if(t.$el.style.cssText.length){var i={};t.$el.style.cssText.split(";").forEach(function(e){var t=e.split(":");2==t.length&&(i[t[0].trim()]=t[1].trim())}),r.style=i}e.series.push(r);break;case"wj-flex-chart-legend":var o=wjcVue2Base._initialize(t,new wjcChart.Legend(null));e.legend=o;break;case"wj-flex-chart-axis":var s=wjcVue2Base._initialize(t,new wjcChart.Axis);t.wjProperty?e[t.wjProperty]=s:e.axes.push(s)}wjcCore.removeChild(t.$el)}),this.tooltipContent&&(e.tooltip.content=this.tooltipContent),wjcVue2Base._initialize(this,e)}}),exports.WjFlexChartAxis=exports.Vue.component("wj-flex-chart-axis",{template:"<div/>",props:wjcVue2Base._getProps("wijmo.chart.Axis",["wjProperty"])}),exports.WjFlexChartLegend=exports.Vue.component("wj-flex-chart-legend",{template:"<div/>",props:wjcVue2Base._getProps("wijmo.chart.Legend")}),exports.WjFlexChartSeries=exports.Vue.component("wj-flex-chart-series",{template:"<div/>",props:wjcVue2Base._getProps("wijmo.chart.Series")});