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
function WjValueAccessorFactory(e) {
  return new WjValueAccessor(e);
}
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  core_1 = require('@angular/core'),
  WjOptions = (function () {
    function e() {}
    return (e.asyncBindings = !0), e;
  })();
exports.WjOptions = WjOptions;
var WjComponentResolvedMetadata = (function () {
  function e(e) {
    (this.changeEventMap = []),
      (this.allImplEvents = []),
      this.resolveChangeEventMap(e);
  }
  return (
    (e.prototype.resolveChangeEventMap = function (e) {
      var t = this.changeEventMap,
        i = e.outputs,
        n = e.changeEvents || {};
      if ((t.splice(0, t.length), (this.allImplEvents = []), i && i.length)) {
        var r = i
          .map(function (e) {
            return e.split(':');
          })
          .map(function (e) {
            return {
              implName: e[0].trim(),
              exposeName: e[1] && e[1].trim(),
            };
          });
        this.allImplEvents = r.map(function (e) {
          return e.implName;
        });
        for (
          var o = 0,
            s = r.filter(function (e) {
              return e.implName && e.exposeName;
            });
          o < s.length;
          o++
        ) {
          var a = s[o];
          if (Ng2Utils.getWjEventName(a.implName)) {
            var p = { eventImpl: a.implName, event: a.exposeName },
              h = n[a.exposeName];
            h &&
              h.length &&
              (p.props = h.map(function (e) {
                return {
                  prop: e,
                  evExposed: Ng2Utils.getChangeEventNameExposed(e),
                  evImpl: Ng2Utils.getChangeEventNameImplemented(e),
                };
              })),
              t.push(p);
          }
        }
        for (var l in n)
          if (l.indexOf('.') > -1) {
            p = {
              eventImpl: null,
              event: l,
              props: n[l].map(function (e) {
                return {
                  prop: e,
                  evExposed: Ng2Utils.getChangeEventNameExposed(e),
                  evImpl: Ng2Utils.getChangeEventNameImplemented(e),
                };
              }),
            };
            t.push(p);
          }
      }
    }),
    e
  );
})();
exports.WjComponentResolvedMetadata = WjComponentResolvedMetadata;
var WjDirectiveBehavior = (function () {
  function e(t, i, n, r) {
    (this._pendingEvents = []),
      (this.isInitialized = !1),
      (this.isDestroyed = !1),
      (this.directive = t),
      (this.elementRef = i),
      (this.injector = n),
      (this.injectedParent = r);
    var o = (this.typeData = t.constructor[e.directiveTypeDataProp]);
    null == o.siblingId && (o.siblingId = ++e.siblingDirId + '');
    var s = t.constructor[e.directiveResolvedTypeDataProp];
    s
      ? (this.resolvedTypeData = s)
      : (t.constructor[e.directiveResolvedTypeDataProp] =
          s =
          this.resolvedTypeData =
            new WjComponentResolvedMetadata(o)),
      (t[e.BehaviourRefProp] = this),
      (n[e.BehaviourRefProp] = this),
      (t[e.isInitializedPropAttr] = !1),
      this._createEvents(),
      this._setupAsChild(),
      this._isHostElement() &&
        i.nativeElement.setAttribute(e.siblingDirIdAttr, o.siblingId),
      this.subscribeToEvents(!1);
  }
  return (
    (e.getHostElement = function (t, i) {
      return e.ngZone || (e.ngZone = i.get(core_1.NgZone)), t.nativeElement;
    }),
    (e.attach = function (t, i, n, r) {
      return new e(t, i, n, r);
    }),
    (e.prototype.ngOnInit = function () {
      (this.isInitialized = !0), this._initParent(), this.subscribeToEvents(!0);
    }),
    (e.prototype.ngAfterViewInit = function () {
      var t = this;
      (this.directive[e.isInitializedPropAttr] = !0),
        setTimeout(function () {
          t.isDestroyed || t.directive[e.initializedEventAttr].emit(void 0);
        });
    }),
    (e.prototype.ngOnDestroy = function () {
      if (!this.isDestroyed) {
        this.isDestroyed = !0;
        var t = this.directive;
        if (
          (this._siblingInsertedEH &&
            this.elementRef.nativeElement.removeEventListener(
              'DOMNodeInserted',
              this._siblingInsertedEH
            ),
          this._isChild() && this.parentBehavior)
        ) {
          var i = this.parentBehavior.directive,
            n = this._getParentProp();
          if (!this.parentBehavior.isDestroyed && i && n && t) {
            var r = i[n];
            if (wjcCore.isArray(r) && r) {
              var o = r.indexOf(t);
              o >= 0 && r.splice(o, 1);
            }
          }
        }
        if (t instanceof wjcCore.Control && t.hostElement) {
          var s = this.elementRef.nativeElement,
            a = s && s.parentNode,
            p = a ? Array.prototype.indexOf.call(a.childNodes, s) : -1;
          t.dispose(),
            p > -1 &&
              Array.prototype.indexOf.call(a.childNodes, s) < 0 &&
              ((s.textContent = ''),
              p < a.childNodes.length && a.replaceChild(s, a.childNodes[p]));
        }
        this.injector[e.BehaviourRefProp] = null;
      }
    }),
    (e.instantiateTemplate = function (e, t, i, n, r, o) {
      void 0 === r && (r = !1), void 0 === o && (o = {});
      var s,
        a = t.createEmbeddedView(i, o, t.length),
        p = a.rootNodes;
      if (r && 1 === p.length) s = p[0];
      else {
        s = document.createElement('div');
        for (var h = 0, l = p; h < l.length; h++) {
          var v = l[h];
          s.appendChild(v);
        }
      }
      return e && e.appendChild(s), { viewRef: a, rootElement: s };
    }),
    (e.prototype.getPropChangeEvent = function (e) {
      var t = this.typeData.changeEvents;
      if (t) for (var i in t) if (t[i].indexOf(e) > -1) return i;
      return null;
    }),
    (e.prototype._createEvents = function () {
      for (
        var e = 0, t = this.resolvedTypeData.allImplEvents;
        e < t.length;
        e++
      ) {
        var i = t[e];
        this.directive[i] = new core_1.EventEmitter(!1);
      }
    }),
    (e.prototype.subscribeToEvents = function (e) {
      var t = this.resolvedTypeData.changeEventMap;
      e = !!e;
      for (var i = 0, n = t; i < n.length; i++)
        e !== (s = n[i]).event.indexOf('.') < 0 && this.addHandlers(s);
      if (e)
        for (var r = 0, o = t; r < o.length; r++) {
          var s = o[r];
          this.triggerPropChangeEvents(s, !0);
        }
    }),
    (e.prototype.addHandlers = function (t) {
      var i = this,
        n = this.directive;
      e.evaluatePath(n, t.event).addHandler(function (e, r) {
        i._runInsideNgZone(function () {
          i.isInitialized && i.triggerPropChangeEvents(t),
            t.eventImpl &&
              i._triggerEvent(n[t.eventImpl], r, t.props && t.props.length > 0);
        });
      });
    }),
    (e.prototype.triggerPropChangeEvents = function (e, t) {
      void 0 === t && (t = !0);
      var i = this.directive;
      if (e.props && e.props.length)
        for (var n = 0, r = e.props; n < r.length; n++) {
          var o = r[n];
          this._triggerEvent(i[o.evImpl], i[o.prop], t);
        }
    }),
    (e.prototype._setupAsChild = function () {
      this._isChild() &&
        (this._isHostElement() &&
          (this.elementRef.nativeElement.style.display = 'none'),
        (this.parentBehavior = e.getBehavior(this.injectedParent)));
    }),
    (e.prototype._isAsyncBinding = function () {
      var t = this.directive[e.asyncBindingUpdatePropAttr];
      return null == t ? WjOptions.asyncBindings : t;
    }),
    (e.prototype._isChild = function () {
      return this._isParentInitializer() || this._isParentReferencer();
    }),
    (e.prototype._isParentInitializer = function () {
      return null != this.directive[e.parPropAttr];
    }),
    (e.prototype._isParentReferencer = function () {
      return !!this.typeData.parentRefProperty;
    }),
    (e.prototype._getParentProp = function () {
      return this.directive[e.parPropAttr];
    }),
    (e.prototype._getParentReferenceProperty = function () {
      return this.typeData.parentRefProperty;
    }),
    (e.prototype._useParentObj = function () {
      return !1;
    }),
    (e.prototype._parentInCtor = function () {
      return (
        this._isParentReferencer() && '' == this._getParentReferenceProperty()
      );
    }),
    (e.prototype._initParent = function () {
      if (this.parentBehavior && !this._useParentObj()) {
        var e = this.parentBehavior.directive,
          t = this._getParentProp(),
          i = this.directive;
        if (this._isParentInitializer()) {
          this._getParentProp();
          var n = e[t];
          if (wjcCore.isArray(n)) {
            var r = this._isHostElement(),
              o = r ? this._getSiblingIndex() : -1;
            (o < 0 || o >= n.length) && (o = n.length),
              n.splice(o, 0, i),
              r &&
                ((this._siblingInsertedEH = this._siblingInserted.bind(this)),
                this.elementRef.nativeElement.addEventListener(
                  'DOMNodeInserted',
                  this._siblingInsertedEH
                ));
          } else e[t] = i;
        }
        this._isParentReferencer() &&
          !this._parentInCtor() &&
          (i[this._getParentReferenceProperty()] = e);
      }
    }),
    (e.prototype._getSiblingIndex = function () {
      var t = this.elementRef.nativeElement,
        i = t.parentElement;
      if (!i) return -1;
      for (
        var n = i.childNodes, r = -1, o = this.typeData.siblingId, s = 0;
        s < n.length;
        s++
      ) {
        var a = n[s];
        if (
          1 == a.nodeType &&
          a.getAttribute(e.siblingDirIdAttr) == o &&
          (++r, a === t)
        )
          return r;
      }
      return -1;
    }),
    (e.prototype._siblingInserted = function (e) {
      if (e.target === this.elementRef.nativeElement) {
        var t = this._getSiblingIndex(),
          i = this.parentBehavior.directive[this._getParentProp()],
          n = this.directive,
          r = i.indexOf(n);
        t >= 0 &&
          r >= 0 &&
          t !== r &&
          (i.splice(r, 1), (t = Math.min(t, i.length)), i.splice(t, 0, n));
      }
    }),
    (e.prototype._isHostElement = function () {
      return this.elementRef.nativeElement.nodeType === Node.ELEMENT_NODE;
    }),
    (e.prototype._runInsideNgZone = function (t) {
      var i = e;
      return (
        i.ngZone &&
          !i._ngZoneRun &&
          (i._ngZoneRun = i.ngZone.run.bind(i.ngZone)),
        (
          i._ngZoneRun ||
          function (e) {
            return e();
          }
        )(t)
      );
    }),
    (e.prototype._triggerEvent = function (e, t, i) {
      var n = this;
      if (i && this._isAsyncBinding()) {
        var r = { event: e, args: t };
        this._pendingEvents.push(r),
          null == this._pendingEventsTO &&
            (this._pendingEventsTO = setTimeout(function () {
              n._triggerPendingEvents(!1);
            }, 0));
      } else e.emit(t);
    }),
    (e.prototype._triggerPendingEvents = function (e) {
      if (
        (null != this._pendingEventsTO &&
          (clearTimeout(this._pendingEventsTO), (this._pendingEventsTO = null)),
        !this.isDestroyed)
      ) {
        var t = [].concat(this._pendingEvents);
        this._pendingEvents.splice(0, this._pendingEvents.length);
        for (var i = 0, n = t; i < n.length; i++) {
          var r = n[i];
          r.event.emit(r.args);
        }
        e && this._pendingEvents.length && this._triggerPendingEvents(!0);
      }
    }),
    (e.prototype.flushPendingEvents = function () {
      this._triggerPendingEvents(!0);
    }),
    (e.evaluatePath = function (e, t) {
      return (this._pathBinding.path = t), this._pathBinding.getValue(e);
    }),
    (e.getBehavior = function (t) {
      return t ? t[e.BehaviourRefProp] : null;
    }),
    (e.directiveTypeDataProp = 'meta'),
    (e.directiveResolvedTypeDataProp = '_wjResolvedMeta'),
    (e.BehaviourRefProp = '_wjBehaviour'),
    (e.parPropAttr = 'wjProperty'),
    (e.wjModelPropAttr = 'wjModelProperty'),
    (e.initializedEventAttr = 'initialized'),
    (e.isInitializedPropAttr = 'isInitialized'),
    (e.siblingDirIdAttr = 'wj-directive-id'),
    (e.asyncBindingUpdatePropAttr = 'asyncBindings'),
    (e.siblingDirId = 0),
    (e.wijmoComponentProviderId = 'WjComponent'),
    (e.outsideZoneEvents = {
      pointermove: !0,
      pointerover: !0,
      mousemove: !0,
      wheel: !0,
      touchmove: !0,
    }),
    (e._pathBinding = new wjcCore.Binding('')),
    e
  );
})();
exports.WjDirectiveBehavior = WjDirectiveBehavior;
var Ng2Utils = (function () {
  function e() {}
  return (
    (e.initEvents = function (e, t) {
      for (var i = [], n = 0, r = t; n < r.length; n++) {
        var o = r[n],
          s = o.props;
        if (
          (o.event && o.eventImpl && i.push(o.eventImpl + ':' + o.event),
          s && s.length)
        )
          for (var a = 0, p = s; a < p.length; a++) {
            var h = p[a];
            i.push(h.evImpl + ':' + h.evExposed);
          }
      }
      return i;
    }),
    (e.getChangeEventNameImplemented = function (t) {
      return e.getChangeEventNameExposed(t) + e.changeEventImplementSuffix;
    }),
    (e.getChangeEventNameExposed = function (e) {
      return e + 'Change';
    }),
    (e.getWjEventNameImplemented = function (t) {
      return t + e.wjEventImplementSuffix;
    }),
    (e.getWjEventName = function (t) {
      if (t) {
        var i = e.wjEventImplementSuffix,
          n = t.length - i.length;
        if (n > 0 && t.substr(n) === i) return t.substr(0, n);
      }
      return null;
    }),
    (e.getBaseType = function (e) {
      var t;
      return e && (t = Object.getPrototypeOf(e.prototype)) && t.constructor;
    }),
    (e.getAnnotations = function (e) {
      return Reflect.getMetadata('annotations', e);
    }),
    (e.getAnnotation = function (e, t) {
      if (t && e)
        for (var i = 0, n = e; i < n.length; i++) {
          var r = n[i];
          if (r instanceof t) return r;
        }
      return null;
    }),
    (e.getTypeAnnotation = function (t, i, n) {
      for (var r = t; r; r = n ? null : e.getBaseType(r)) {
        var o = e.getAnnotation(e.getAnnotations(r), i);
        if (o) return o;
      }
      return null;
    }),
    (e.equals = function (e, t) {
      return (e != e && t != t) || wjcCore.DateTime.equals(e, t) || e === t;
    }),
    (e._copy = function (e, t, i, n, r) {
      if (e && t)
        for (var o in t)
          if (n || '_' !== o[0]) {
            var s = t[o];
            if (!r || r(o, s)) {
              var a = e[o];
              wjcCore.isArray(s)
                ? (e[o] = (!wjcCore.isArray(a) || i ? [] : a).concat(s))
                : void 0 !== s && (e[o] = s);
            }
          }
    }),
    (e.changeEventImplementSuffix = 'PC'),
    (e.wjEventImplementSuffix = 'Ng'),
    e
  );
})();
exports.Ng2Utils = Ng2Utils;
var WjValueAccessor = (function () {
  function e(e) {
    (this._isFirstChange = !0),
      (this._isSubscribed = !1),
      (this._onChange = function (e) {}),
      (this._onTouched = function () {}),
      (this._directive = e),
      (this._behavior = WjDirectiveBehavior.getBehavior(e));
  }
  return (
    (e.prototype.writeValue = function (e) {
      var t = this;
      if (((this._modelValue = e), this._directive.isInitialized))
        this._ensureInitEhUnsubscribed(),
          this._updateDirective(),
          (this._isFirstChange = !1);
      else if (this._dirInitEh) this._isFirstChange = !1;
      else {
        var i = this._directive.initialized;
        this._dirInitEh = i.subscribe(function () {
          t._updateDirective(), t._ensureInitEhUnsubscribed();
        });
      }
    }),
    (e.prototype.registerOnChange = function (e) {
      this._onChange = e;
    }),
    (e.prototype.registerOnTouched = function (e) {
      this._onTouched = e;
    }),
    (e.prototype._updateDirective = function () {
      if (!this._isFirstChange || null != this._modelValue) {
        if ((this._ensureNgModelProp(), this._directive && this._ngModelProp)) {
          var e = this._modelValue;
          '' === e && (e = null), (this._directive[this._ngModelProp] = e);
        }
        this._ensureSubscribed();
      }
    }),
    (e.prototype._ensureSubscribed = function () {
      if (!this._isSubscribed) {
        var e = this._directive;
        if (e) {
          this._ensureNgModelProp();
          var t = (this._ngModelProp = e[WjDirectiveBehavior.wjModelPropAttr]);
          if (t) {
            var i = this._behavior.getPropChangeEvent(t);
            i && e[i].addHandler(this._dirValChgEh, this);
          }
          e instanceof wjcCore.Control &&
            e.lostFocus.addHandler(this._dirLostFocusEh, this),
            (this._isSubscribed = !0);
        }
      }
    }),
    (e.prototype._ensureNgModelProp = function () {
      !this._ngModelProp &&
        this._directive &&
        (this._ngModelProp =
          this._directive[WjDirectiveBehavior.wjModelPropAttr]);
    }),
    (e.prototype._ensureInitEhUnsubscribed = function () {
      this._dirInitEh &&
        (this._dirInitEh.unsubscribe(), (this._dirInitEh = null));
    }),
    (e.prototype._dirValChgEh = function (e, t) {
      if (this._onChange && this._directive && this._ngModelProp) {
        var i = this._directive[this._ngModelProp];
        Ng2Utils.equals(this._modelValue, i) ||
          ((this._modelValue = i), this._onChange(i));
      }
    }),
    (e.prototype._dirLostFocusEh = function (e, t) {
      this._onTouched && this._onTouched();
    }),
    e
  );
})();
(exports.WjValueAccessor = WjValueAccessor),
  (exports.WjValueAccessorFactory = WjValueAccessorFactory);
var moduleExports = [],
  WjDirectiveBaseModule = (function () {
    function e() {}
    return (
      (e.decorators = [{ type: core_1.NgModule, args: [{}] }]),
      (e.ctorParameters = function () {
        return [];
      }),
      e
    );
  })();
exports.WjDirectiveBaseModule = WjDirectiveBaseModule;
