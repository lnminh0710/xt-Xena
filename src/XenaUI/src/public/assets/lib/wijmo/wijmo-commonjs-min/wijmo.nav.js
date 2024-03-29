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
      function n() {
        this.constructor = t;
      }
      e(t, r),
        (t.prototype =
          null === r
            ? Object.create(r)
            : ((n.prototype = r.prototype), new n()));
    };
  })();
Object.defineProperty(exports, '__esModule', { value: !0 });
var wjcCore = require('wijmo/wijmo'),
  wjcSelf = require('wijmo/wijmo.nav');
(window.wijmo = window.wijmo || {}), (window.wijmo.nav = wjcSelf);
var TreeView = (function (e) {
  function t(r, n) {
    var i = e.call(this, r) || this;
    (i._itmPath = new _BindingArray('items')),
      (i._dspPath = new _BindingArray('header')),
      (i._imgPath = new _BindingArray()),
      (i._html = !1),
      (i._animated = !0),
      (i._xpndOnClick = !0),
      (i._autoColl = !0),
      (i._showChk = !1),
      (i._srch = ''),
      (i._isReadOnly = !0),
      (i.itemsSourceChanged = new wjcCore.Event()),
      (i.loadingItems = new wjcCore.Event()),
      (i.loadedItems = new wjcCore.Event()),
      (i.itemClicked = new wjcCore.Event()),
      (i.selectedItemChanged = new wjcCore.Event()),
      (i.checkedItemsChanged = new wjcCore.Event()),
      (i.isCollapsedChanging = new wjcCore.Event()),
      (i.isCollapsedChanged = new wjcCore.Event()),
      (i.isCheckedChanging = new wjcCore.Event()),
      (i.isCheckedChanged = new wjcCore.Event()),
      (i.formatItem = new wjcCore.Event()),
      (i.dragStart = new wjcCore.Event()),
      (i.dragOver = new wjcCore.Event()),
      (i.drop = new wjcCore.Event()),
      (i.dragEnd = new wjcCore.Event()),
      (i.nodeEditStarting = new wjcCore.Event()),
      (i.nodeEditStarted = new wjcCore.Event()),
      (i.nodeEditEnding = new wjcCore.Event()),
      (i.nodeEditEnded = new wjcCore.Event());
    var o = i.getTemplate();
    i.applyTemplate('wj-control wj-content wj-treeview', o, {
      _root: 'root',
    });
    var s = i.hostElement;
    return (
      wjcCore.setAttribute(s, 'role', 'tree', !0),
      wjcCore.addClass(i._root, t._CNDL),
      wjcCore.setAttribute(i._root, 'role', 'group', !0),
      i.addEventListener(s, 'mousedown', i._mousedown.bind(i)),
      i.addEventListener(s, 'click', i._click.bind(i)),
      i.addEventListener(s, 'keydown', i._keydown.bind(i)),
      i.addEventListener(s, 'keypress', i._keypress.bind(i)),
      i.addEventListener(s, 'wheel', function (e) {
        s.scrollHeight > s.offsetHeight &&
          ((e.deltaY < 0 && 0 == s.scrollTop) ||
            (e.deltaY > 0 && s.scrollTop + s.offsetHeight >= s.scrollHeight)) &&
          (e.preventDefault(), e.stopPropagation());
      }),
      i.addEventListener(
        s,
        'blur',
        function (e) {
          i._edtNode &&
            !wjcCore.contains(i._edtNode.element, wjcCore.getActiveElement()) &&
            i.finishEditing();
        },
        !0
      ),
      i.initialize(n),
      i.refresh(),
      i
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'itemsSource', {
      get: function () {
        return this._items;
      },
      set: function (e) {
        this._items != e &&
          ((this._items = wjcCore.asArray(e)),
          this.onItemsSourceChanged(),
          this._reload());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'childItemsPath', {
      get: function () {
        return this._itmPath.path;
      },
      set: function (e) {
        e != this.childItemsPath && ((this._itmPath.path = e), this._reload());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'displayMemberPath', {
      get: function () {
        return this._dspPath.path;
      },
      set: function (e) {
        e != this.displayMemberPath &&
          ((this._dspPath.path = e), this._reload());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'imageMemberPath', {
      get: function () {
        return this._imgPath.path;
      },
      set: function (e) {
        e != this.imageMemberPath && ((this._imgPath.path = e), this._reload());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isContentHtml', {
      get: function () {
        return this._html;
      },
      set: function (e) {
        e != this._html &&
          ((this._html = wjcCore.asBoolean(e)), this._reload());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'showCheckboxes', {
      get: function () {
        return this._showChk;
      },
      set: function (e) {
        e != this._showChk &&
          ((this._showChk = wjcCore.asBoolean(e)), this._reload());
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'autoCollapse', {
      get: function () {
        return this._autoColl;
      },
      set: function (e) {
        this._autoColl = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isAnimated', {
      get: function () {
        return this._animated;
      },
      set: function (e) {
        e != this._animated && (this._animated = wjcCore.asBoolean(e));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'isReadOnly', {
      get: function () {
        return this._isReadOnly;
      },
      set: function (e) {
        this._isReadOnly = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.startEditing = function (e) {
      if (this.isReadOnly) return !1;
      if ((e || (e = this.selectedNode), !e || e.isDisabled)) return !1;
      if (!this.finishEditing()) return !1;
      var r = e.element.querySelector('.' + t._CNDT);
      if (!r) return !1;
      var n = new TreeNodeEventArgs(e);
      if (!this.onNodeEditStarting(n)) return !1;
      (r.tabIndex = 0),
        r.focus(),
        (r.contentEditable = 'true'),
        (r.style.cursor = 'auto');
      var i = document.createRange();
      i.selectNodeContents(r);
      var o = getSelection();
      return (
        o.removeAllRanges(),
        o.addRange(i),
        r.focus(),
        wjcCore.setAttribute(r, 'autocomplete', 'off'),
        wjcCore.setAttribute(r, 'autocorrect', 'off'),
        (this._edtNode = e),
        this.onNodeEditStarted(n),
        !0
      );
    }),
    (t.prototype.finishEditing = function (e) {
      var r = this._edtNode;
      if (r) {
        var n = r.element.querySelector('.' + t._CNDT);
        if (!n) return !1;
        var i = new TreeNodeEventArgs(r);
        if (!this.onNodeEditEnding(i)) return !1;
        var o = r.dataItem,
          s = r.level;
        this.isContentHtml
          ? e
            ? (n.innerHTML = this._dspPath.getValue(o, s))
            : this._dspPath.setValue(o, s, n.innerHTML)
          : e
          ? (n.textContent = this._dspPath.getValue(o, s))
          : this._dspPath.setValue(o, s, n.textContent),
          document.createRange().selectNodeContents(n),
          getSelection().removeAllRanges(),
          (n.contentEditable = 'false'),
          (n.style.cursor = ''),
          (this._edtNode = null),
          this.onNodeEditEnded(i);
      }
      return !0;
    }),
    Object.defineProperty(t.prototype, 'allowDragging', {
      get: function () {
        return null != this._dd;
      },
      set: function (e) {
        if (e != this.allowDragging) {
          wjcCore.asBoolean(e)
            ? (this._dd = new _TreeDragDropManager(this))
            : (this._dd.dispose(), (this._dd = null));
          for (
            var r = this.hostElement.querySelectorAll('.' + t._CND), n = 0;
            n < r.length;
            n++
          ) {
            var i = r[n];
            wjcCore.setAttribute(i, 'draggable', !!this._dd || null);
          }
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'expandOnClick', {
      get: function () {
        return this._xpndOnClick;
      },
      set: function (e) {
        this._xpndOnClick = wjcCore.asBoolean(e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'selectedItem', {
      get: function () {
        return this._selNode ? this._selNode.dataItem : null;
      },
      set: function (e) {
        e != this.selectedItem &&
          (this.selectedNode = e ? this.getNode(e) : null);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'selectedNode', {
      get: function () {
        return this._selNode;
      },
      set: function (e) {
        e != this.selectedNode &&
          ((this._prevSel = this._selNode),
          e
            ? e.select()
            : this._selNode &&
              (wjcCore.removeClass(this._selNode.element, t._CSEL),
              (this._selNode = null),
              this.onSelectedItemChanged()));
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'selectedPath', {
      get: function () {
        for (var e = [], t = this.selectedNode; t; t = t.parentNode) {
          var r = this._dspPath.getValue(t.dataItem, t.level);
          e.splice(0, 0, r);
        }
        return e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'checkedItems', {
      get: function () {
        if (null == this._chkItems) {
          var e = t,
            r = '.' + e._CND + '.' + e._CEMP + ' > input:checked.' + e._CNDC,
            n = this._root.querySelectorAll(r);
          this._chkItems = [];
          for (var i = 0; i < n.length; i++) {
            var o = n[i].parentElement[e._DATAITEM_KEY];
            this._chkItems.push(o);
          }
        }
        return this._chkItems;
      },
      set: function (e) {
        if (this.showCheckboxes) {
          for (
            var r = t,
              n = '.' + r._CND + '.' + r._CEMP,
              i = this._root.querySelectorAll(n),
              o = !1,
              s = 0;
            s < i.length;
            s++
          ) {
            var a = new TreeNode(this, i[s]),
              l = e.indexOf(a.dataItem) > -1;
            a.isChecked != l && ((a.isChecked = l), (o = !0));
          }
          o && this.onCheckedItemsChanged();
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.checkAllItems = function (e) {
      if (this.showCheckboxes) {
        for (
          var r = t,
            n = '.' + r._CND + '.' + r._CEMP,
            i = this._root.querySelectorAll(n),
            o = !1,
            s = 0;
          s < i.length;
          s++
        ) {
          var a = new TreeNode(this, i[s]);
          a.isChecked != e && ((a.isChecked = e), (o = !0));
        }
        o && this.onCheckedItemsChanged();
      }
    }),
    Object.defineProperty(t.prototype, 'totalItemCount', {
      get: function () {
        return this.hostElement.querySelectorAll('.' + t._CND).length;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'lazyLoadFunction', {
      get: function () {
        return this._lazyLoad;
      },
      set: function (e) {
        e != this._lazyLoad &&
          ((this._lazyLoad = wjcCore.asFunction(e)), this._reload());
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getFirstNode = function (e, r) {
      var n = this.hostElement.querySelector('.' + t._CND),
        i = n ? new TreeNode(this, n) : null;
      return (
        e && i && !i.element.offsetHeight && (i = i.next(e, r)),
        r && i && i.isDisabled && (i = i.next(e, r)),
        i
      );
    }),
    (t.prototype.getLastNode = function (e, r) {
      var n = this.hostElement.querySelectorAll('.' + t._CND + ':last-child'),
        i = n.length ? new TreeNode(this, n[n.length - 1]) : null;
      return (
        e && i && !i.element.offsetHeight && (i = i.previous(e, r)),
        r && i && i.isDisabled && (i = i.previous(e, r)),
        i
      );
    }),
    Object.defineProperty(t.prototype, 'nodes', {
      get: function () {
        return TreeNode._getChildNodes(this, this._root);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (t.prototype.getNode = function (e) {
      this._isDirty && this._loadTree();
      for (
        var r = this.hostElement.querySelectorAll('.' + t._CND), n = 0;
        n < r.length;
        n++
      ) {
        var i = r[n];
        if (i[t._DATAITEM_KEY] == e) return new TreeNode(this, i);
      }
      return null;
    }),
    (t.prototype.addChildNode = function (e, t) {
      var r = this._createNode(t),
        n = this.nodes;
      return (
        n
          ? e < n.length
            ? r.move(n[e], DropPosition.Before)
            : r.move(n[n.length - 1], DropPosition.After)
          : r.move(this, DropPosition.Into),
        r
      );
    }),
    (t.prototype.collapseToLevel = function (e) {
      var t = this._animated,
        r = this._autoColl;
      (this._animated = this._autoColl = !1),
        this._collapseToLevel(this.nodes, e, 0),
        (this._animated = t),
        (this._autoColl = r);
    }),
    (t.prototype.loadTree = function (e) {
      this._loadTree(e);
    }),
    (t.prototype.onItemsSourceChanged = function (e) {
      this.itemsSourceChanged.raise(this, e);
    }),
    (t.prototype.onLoadingItems = function (e) {
      return this.loadingItems.raise(this, e), !e.cancel;
    }),
    (t.prototype.onLoadedItems = function (e) {
      this.loadedItems.raise(this, e);
    }),
    (t.prototype.onItemClicked = function (e) {
      this.itemClicked.raise(this, e);
    }),
    (t.prototype.onSelectedItemChanged = function (e) {
      this.selectedItemChanged.raise(this, e);
    }),
    (t.prototype.onCheckedItemsChanged = function (e) {
      (this._chkItems = null), this.checkedItemsChanged.raise(this, e);
    }),
    (t.prototype.onIsCollapsedChanging = function (e) {
      return this.isCollapsedChanging.raise(this, e), !e.cancel;
    }),
    (t.prototype.onIsCollapsedChanged = function (e) {
      this.isCollapsedChanged.raise(this, e);
    }),
    (t.prototype.onIsCheckedChanging = function (e) {
      return this.isCheckedChanging.raise(this, e), !e.cancel;
    }),
    (t.prototype.onIsCheckedChanged = function (e) {
      this.isCheckedChanged.raise(this, e);
    }),
    (t.prototype.onFormatItem = function (e) {
      this.formatItem.raise(this, e);
    }),
    (t.prototype.onDragStart = function (e) {
      return this.dragStart.raise(this, e), !e.cancel;
    }),
    (t.prototype.onDragOver = function (e) {
      return this.dragOver.raise(this, e), !e.cancel;
    }),
    (t.prototype.onDrop = function (e) {
      return this.drop.raise(this, e), !e.cancel;
    }),
    (t.prototype.onDragEnd = function (e) {
      this.dragEnd.raise(this, e);
    }),
    (t.prototype.onNodeEditStarting = function (e) {
      return this.nodeEditStarting.raise(this, e), !e.cancel;
    }),
    (t.prototype.onNodeEditStarted = function (e) {
      this.nodeEditStarted.raise(this, e);
    }),
    (t.prototype.onNodeEditEnding = function (e) {
      return this.nodeEditEnding.raise(this, e), !e.cancel;
    }),
    (t.prototype.onNodeEditEnded = function (e) {
      this.nodeEditEnded.raise(this, e);
    }),
    (t.prototype.refresh = function () {
      e.prototype.refresh.call(this),
        !this.isUpdating && this._isDirty && this._loadTree();
    }),
    (t.prototype._reload = function () {
      (this._isDirty = !0), this.invalidate();
    }),
    (t.prototype._createNode = function (e) {
      return new t(document.createElement('div'), {
        childItemsPath: this.childItemsPath,
        displayMemberPath: this.displayMemberPath,
        imageMemberPath: this.imageMemberPath,
        isContentHtml: this.isContentHtml,
        showCheckboxes: this.showCheckboxes,
        itemsSource: [e],
      }).getFirstNode();
    }),
    (t.prototype._mousedown = function (e) {
      if (!e.defaultPrevented) {
        var r = wjcCore.closest(e.target, 'input.' + t._CNDC),
          n = wjcCore.closestClass(e.target, t._CND),
          i = n ? new TreeNode(this, n) : null;
        i && !i.isDisabled && (this.selectedNode = i),
          (this._dnIndet = r && r.indeterminate);
      }
    }),
    (t.prototype._click = function (e) {
      var r = this;
      if (!e.defaultPrevented) {
        var n = wjcCore.closestClass(e.target, t._CND);
        if (n) {
          var i = new TreeNode(this, n),
            o = wjcCore.closest(e.target, 'input.' + t._CNDC);
          if (i.isDisabled) return;
          if (!o && i.equals(this._edtNode)) return;
          if (
            (n.focus(),
            o &&
              (e.preventDefault(),
              e.stopPropagation(),
              setTimeout(function () {
                (o.indeterminate = !1),
                  (i.isChecked = !i.isChecked),
                  r.onCheckedItemsChanged();
              })),
            !o)
          ) {
            var s = e.target,
              a = (e.ctrlKey || e.metaKey) && !i.hasPendingChildren,
              l = n.getBoundingClientRect(),
              d = !1;
            (this.rightToLeft ? l.right - e.clientX : e.clientX - l.left) <=
            s.offsetHeight
              ? (a
                  ? this.collapseToLevel(i.isCollapsed ? i.level + 1 : i.level)
                  : (i.isCollapsed = !i.isCollapsed),
                (d = !0))
              : this.expandOnClick &&
                i.isCollapsed &&
                (a ? this.collapseToLevel(i.level) : (i.isCollapsed = !1),
                (d = !0)),
              d && a && this.selectedNode && this.selectedNode.ensureVisible(),
              d ||
                this.isReadOnly ||
                (this.selectedNode &&
                  this.selectedNode.equals(this._prevSel) &&
                  this.startEditing());
          }
          this.selectedItem && this.onItemClicked();
        }
      }
    }),
    (t.prototype._keydown = function (e) {
      if (!e.defaultPrevented) {
        var t = this._selNode,
          r = void 0,
          n = e.keyCode,
          i = !0;
        if (t && !t.isDisabled) {
          switch (n) {
            case wjcCore.Key.F2:
              this.startEditing(), e.preventDefault();
              break;
            case wjcCore.Key.Escape:
              this.finishEditing(!0), e.preventDefault();
              break;
            case wjcCore.Key.Up:
            case wjcCore.Key.Down:
              this.finishEditing();
              break;
            case wjcCore.Key.Enter:
              this._edtNode
                ? (this.finishEditing(), (n = wjcCore.Key.Down))
                : (this.startEditing(), e.preventDefault());
          }
          if (this._edtNode) return;
          if (this.rightToLeft)
            switch (n) {
              case wjcCore.Key.Left:
                n = wjcCore.Key.Right;
                break;
              case wjcCore.Key.Right:
                n = wjcCore.Key.Left;
            }
          switch (n) {
            case wjcCore.Key.Left:
              !t.isCollapsed && t.hasChildren
                ? t.setCollapsed(!0)
                : (t = t.parentNode) && t.select();
              break;
            case wjcCore.Key.Right:
              t.setCollapsed(!1);
              break;
            case wjcCore.Key.Up:
              r = t.previous(!0, !0);
              break;
            case wjcCore.Key.Down:
              r = t.next(!0, !0);
              break;
            case wjcCore.Key.Home:
              r = this.getFirstNode(!0, !0);
              break;
            case wjcCore.Key.End:
              r = this.getLastNode(!0, !0);
              break;
            case wjcCore.Key.Space:
              if (this.selectedItem) {
                var o = t.checkBox;
                o && ((t.isChecked = !o.checked), this.onCheckedItemsChanged());
              }
              break;
            case wjcCore.Key.Enter:
              this.selectedItem && this.onItemClicked();
              break;
            default:
              i = !1;
          }
          i && (e.preventDefault(), r && r.select());
        }
      }
    }),
    (t.prototype._keypress = function (e) {
      var r = this;
      if (!e.defaultPrevented) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.target instanceof HTMLInputElement) return;
        if (this._edtNode) return;
        if (e.charCode > 32 && this.startEditing(this.selectedNode)) {
          var n = wjcCore.getActiveElement();
          if (wjcCore.contains(this._edtNode.element, n)) {
            (n.textContent = String.fromCharCode(e.charCode)),
              e.preventDefault();
            var i = document.createRange();
            i.selectNodeContents(n), i.collapse(!1);
            var o = getSelection();
            o.removeAllRanges(), o.addRange(i);
          }
          return;
        }
        if (e.charCode > 32 || (32 == e.charCode && this._srch)) {
          e.preventDefault(),
            (this._srch += String.fromCharCode(e.charCode).toLowerCase()),
            this._toSrch && clearTimeout(this._toSrch),
            (this._toSrch = setTimeout(function () {
              (r._toSrch = null), (r._srch = '');
            }, t._AS_DLY));
          var s = this._findNext();
          null == s &&
            this._srch.length > 1 &&
            ((this._srch = this._srch[this._srch.length - 1]),
            (s = this._findNext())),
            null != s && (this.selectedItem = s);
        }
      }
    }),
    (t.prototype._findNext = function () {
      if (this.hostElement && this.selectedItem) {
        var e = this.getNode(this.selectedItem),
          t = e,
          r = !1,
          n = !1;
        for (1 == this._srch.length && (n = !0); t; ) {
          if (
            !t.isDisabled &&
            !n &&
            0 == t.element.textContent.trim().toLowerCase().indexOf(this._srch)
          )
            return t.dataItem;
          var i = t.next(!0, !0);
          if (i == e && r) break;
          i || r || ((i = this.getFirstNode(!0, !0)), (r = !0)),
            (t = i),
            (n = !1);
        }
      }
      return null;
    }),
    (t.prototype._loadTree = function (e) {
      var r = this._root;
      if (r) {
        if (!this.onLoadingItems(new wjcCore.CancelEventArgs())) return;
        this._isDirty = !1;
        var n = this.containsFocus(),
          i = this.selectedItem;
        (this.selectedItem = null), (this._chkItems = null), (this._ldLvl = -1);
        var o = void 0;
        if (e && wjcCore.isFunction(window.Map)) {
          o = new Map();
          for (
            var s = this.hostElement.querySelectorAll('.' + t._CND), a = 0;
            a < s.length;
            a++
          ) {
            l = s[a];
            wjcCore.hasClass(l, t._CCLD) && o.set(l[t._DATAITEM_KEY], !0);
          }
        }
        if (((r.innerHTML = ''), this._items))
          for (a = 0; a < this._items.length; a++)
            this._addItem(r, 0, this._items[a]);
        if (o)
          for (
            var s = this.hostElement.querySelectorAll('.' + t._CND), a = 0;
            a < s.length;
            a++
          ) {
            var l = s[a],
              d = TreeNode._isNodeList(l),
              h = o.get(l[t._DATAITEM_KEY]);
            wjcCore.toggleClass(l, t._CCLD, 1 == h),
              wjcCore.setAttribute(
                l,
                'aria-expanded',
                d ? (!h).toString() : null
              );
          }
        n && !this.containsFocus() && this.focus(),
          (this.selectedItem = i),
          this.onLoadedItems(),
          (this._ldLvl = -1);
      }
    }),
    (t.prototype._addItem = function (e, r, n) {
      var i = this._dspPath.getValue(n, r),
        o = this._imgPath.getValue(n, r),
        s = wjcCore.asArray(this._itmPath.getValue(n, r), !0),
        a = document.createElement('div');
      wjcCore.addClass(a, t._CND),
        (a.tabIndex = 0),
        wjcCore.setAttribute(a, 'role', 'treeitem', !0);
      var l = document.createElement('span');
      if (
        (this.isContentHtml ? (l.innerHTML = i) : (l.textContent = i),
        wjcCore.addClass(l, t._CNDT),
        a.appendChild(l),
        o)
      ) {
        var d = document.createElement('img');
        (d.src = o), a.insertBefore(d, a.firstChild);
      }
      if (this._showChk && !this._lazyLoad) {
        var h = document.createElement('input');
        (h.type = 'checkbox'),
          (h.tabIndex = -1),
          wjcCore.addClass(h, t._CNDC),
          a.insertBefore(h, a.firstChild);
      }
      if (
        (this._dd && a.setAttribute('draggable', 'true'),
        e.appendChild(a),
        (a[t._DATAITEM_KEY] = n),
        s && 0 == s.length && !this.lazyLoadFunction && (s = null),
        s)
      ) {
        var c = !0;
        if (
          (r > this._ldLvl
            ? ((this._ldLvl = r),
              0 == s.length && (wjcCore.addClass(a, t._CCLD), (c = !1)))
            : (wjcCore.addClass(a, t._CCLD),
              (c = !1),
              r < this._ldLvl && (this._ldLvl = 1e4)),
          s.length > 0)
        ) {
          var u = document.createElement('div');
          wjcCore.addClass(u, t._CNDL);
          for (var p = 0; p < s.length; p++) this._addItem(u, r + 1, s[p]);
          e.appendChild(u),
            wjcCore.setAttribute(a, 'aria-expanded', c.toString(), !0),
            wjcCore.setAttribute(u, 'role', 'group', !0);
        }
      } else wjcCore.addClass(a, t._CEMP);
      this.formatItem.hasHandlers &&
        this.onFormatItem(new FormatNodeEventArgs(n, a, r));
    }),
    (t.prototype._collapseToLevel = function (e, t, r) {
      for (var n = 0; n < e.length; n++) {
        var i = e[n];
        i.hasPendingChildren ||
          ((i.isCollapsed = r >= t),
          i.hasChildren && this._collapseToLevel(i.nodes, t, r + 1));
      }
    }),
    (t.prototype._lazyLoadNode = function (e) {
      var r = this.hostElement;
      wjcCore.hasClass(r, t._CLDG) ||
        (wjcCore.addClass(r, t._CLDG),
        wjcCore.addClass(e.element, t._CLDG),
        this.lazyLoadFunction(e, this._lazyLoadCallback.bind(e)));
    }),
    (t.prototype._lazyLoadCallback = function (e) {
      var t = this;
      t.treeView._lazyLoadNodeDone(t, e);
    }),
    (t.prototype._lazyLoadNodeDone = function (e, r) {
      var n = t;
      wjcCore.removeClass(e.element, n._CLDG),
        wjcCore.removeClass(this.hostElement, n._CLDG);
      var i = e.dataItem,
        o = e.level,
        s = wjcCore.asArray(r, !0);
      if (null == s || 0 == s.length)
        this._itmPath.setValue(i, o, null),
          wjcCore.addClass(e.element, n._CEMP);
      else if (s.length) {
        this._itmPath.setValue(i, o, s);
        var a = document.createElement('div'),
          l = e.element;
        wjcCore.addClass(a, n._CNDL),
          l.parentElement.insertBefore(a, l.nextSibling);
        for (var d = 0; d < s.length; d++) this._addItem(a, o + 1, s[d]);
        e.isCollapsed = !1;
      }
    }),
    (t._DATAITEM_KEY = 'wj-Data-Item'),
    (t._AS_DLY = 600),
    (t._AN_DLY = 200),
    (t._CND = 'wj-node'),
    (t._CNDL = 'wj-nodelist'),
    (t._CEMP = 'wj-state-empty'),
    (t._CNDT = 'wj-node-text'),
    (t._CNDC = 'wj-node-check'),
    (t._CSEL = 'wj-state-selected'),
    (t._CCLD = 'wj-state-collapsed'),
    (t._CCLG = 'wj-state-collapsing'),
    (t._CLDG = 'wj-state-loading'),
    (t.controlTemplate = '<div wj-part="root"></div>'),
    t
  );
})(wjcCore.Control);
exports.TreeView = TreeView;
var TreeNode = (function () {
  function e(t, r) {
    wjcCore.hasClass(r, 'wj-treeview')
      ? ((t = wjcCore.Control.getControl(r)), (r = null))
      : e._assertNode(r),
      (this._t = t),
      (this._e = r);
  }
  return (
    Object.defineProperty(e.prototype, 'dataItem', {
      get: function () {
        return this._e[TreeView._DATAITEM_KEY];
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'element', {
      get: function () {
        return this._e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'treeView', {
      get: function () {
        return this._t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.ensureVisible = function () {
      for (var e = this.parentNode; e; e = e.parentNode) e.isCollapsed = !1;
      var t = this._t.hostElement,
        r = this.element.getBoundingClientRect(),
        n = t.getBoundingClientRect();
      r.bottom > n.bottom
        ? (t.scrollTop += r.bottom - n.bottom)
        : r.top < n.top && (t.scrollTop -= n.top - r.top);
    }),
    (e.prototype.equals = function (e) {
      return null != e && e.element == this.element;
    }),
    (e.prototype.select = function () {
      var e = this._t,
        t = e._selNode;
      this.equals(t) ||
        (t && wjcCore.removeClass(t.element, TreeView._CSEL),
        (e._selNode = this),
        wjcCore.addClass(this.element, TreeView._CSEL),
        this.ensureVisible(),
        e.containsFocus() && this.element.focus(),
        e.onSelectedItemChanged());
    }),
    Object.defineProperty(e.prototype, 'index', {
      get: function () {
        for (var t = 0, r = this._pse(this.element); r; r = this._pse(r))
          e._isNode(r) && t++;
        return t;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'parentNode', {
      get: function () {
        var t = null;
        if (this._e) {
          var r = this._e.parentElement;
          e._assertNodeList(r), (t = this._pse(r));
        }
        return t ? new e(this._t, t) : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'level', {
      get: function () {
        for (var e = -1, t = this; t; t = t.parentNode) e++;
        return e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'hasChildren', {
      get: function () {
        return e._isNode(this._e) && !e._isEmpty(this._e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'hasPendingChildren', {
      get: function () {
        return (
          this.isCollapsed &&
          this.hasChildren &&
          !e._isNodeList(this.element.nextElementSibling) &&
          wjcCore.isFunction(this._t.lazyLoadFunction)
        );
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'nodes', {
      get: function () {
        return this.hasChildren
          ? e._getChildNodes(this._t, this._e.nextSibling)
          : null;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'checkBox', {
      get: function () {
        return this._e.querySelector('input.' + TreeView._CNDC);
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isCollapsed', {
      get: function () {
        return this.hasChildren && wjcCore.hasClass(this._e, TreeView._CCLD);
      },
      set: function (e) {
        if (e != this.isCollapsed) {
          var t = this._t,
            r = new TreeNodeEventArgs(this);
          t.onIsCollapsedChanging(r) &&
            (this.setCollapsed(
              wjcCore.asBoolean(e),
              t.isAnimated,
              t.autoCollapse
            ),
            t.onIsCollapsedChanged(r));
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isChecked', {
      get: function () {
        var e = this.checkBox;
        return e && !e.indeterminate ? e.checked : null;
      },
      set: function (e) {
        if (e != this.isChecked) {
          var t = this._t,
            r = new TreeNodeEventArgs(this);
          t.onIsCheckedChanging(r) &&
            (this.setChecked(wjcCore.asBoolean(e), !0),
            t.onIsCheckedChanged(r));
        }
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e.prototype, 'isDisabled', {
      get: function () {
        return this._e && null != this._e.getAttribute('disabled');
      },
      set: function (e) {
        (e = wjcCore.asBoolean(e, !0)) != this.isDisabled &&
          wjcCore.enable(this._e, !e);
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.previous = function (t, r) {
      var n = this._pse(this._e);
      if (
        (!n &&
          e._isNodeList(this._e.parentElement) &&
          (n = this._pse(this._e.parentElement)),
        e._isNodeList(n))
      ) {
        for (; e._isNodeList(n) && n.childElementCount; ) n = n.lastChild;
        e._isNodeList(n) && (n = this._pse(n));
      }
      var i = e._isNode(n) ? new e(this._t, n) : null;
      return (
        t && i && !i.element.offsetHeight && (i = i.previous(t, r)),
        r && i && i.isDisabled && (i = i.previous(t, r)),
        i
      );
    }),
    (e.prototype.next = function (t, r) {
      var n = this._e.nextSibling;
      if (
        (e._isNodeList(n) &&
          (n = n.childElementCount ? n.firstChild : n.nextSibling),
        !n)
      )
        for (
          var i = this._e.parentElement;
          !n && e._isNodeList(i);
          i = i.parentElement
        )
          n = i.nextSibling;
      var o = e._isNode(n) ? new e(this._t, n) : null;
      return (
        t && o && !o.element.offsetHeight && (o = o.next(t, r)),
        r && o && o.isDisabled && (o = o.next(t, r)),
        o
      );
    }),
    (e.prototype.previousSibling = function () {
      var t = this._pse(this.element);
      return (
        e._isNodeList(t) && (t = this._pse(t)), t ? new e(this._t, t) : null
      );
    }),
    (e.prototype.nextSibling = function () {
      var t = this.element.nextSibling;
      return (
        e._isNodeList(t) && (t = t.nextSibling), t ? new e(this._t, t) : null
      );
    }),
    (e.prototype.setCollapsed = function (t, r, n) {
      var i = this._t,
        o = this._e,
        s = this._e.nextElementSibling,
        a = e._isNodeList(s);
      if (
        (wjcCore.setAttribute(o, 'aria-expanded', a ? (!t).toString() : null),
        t != this.isCollapsed)
      )
        if (t || a || !wjcCore.isFunction(i.lazyLoadFunction)) {
          if (
            (null == r && (r = i.isAnimated),
            null == n && (n = i.autoCollapse),
            r)
          ) {
            if (a) {
              var l = s.offsetHeight,
                d = s.style;
              t
                ? (wjcCore.toggleClass(o, TreeView._CCLG, !0),
                  wjcCore.animate(function (e) {
                    e < 1
                      ? ((e = 1 - e), (d.height = (e * l).toFixed(0) + 'px'))
                      : ((d.height = d.opacity = ''),
                        wjcCore.toggleClass(o, TreeView._CCLD, !0),
                        wjcCore.toggleClass(o, TreeView._CCLG, !1));
                  }, TreeView._AN_DLY))
                : (wjcCore.toggleClass(o, TreeView._CCLD, !1),
                  (d.height = d.opacity = '0'),
                  wjcCore.animate(function (e) {
                    d.height =
                      e >= 1 ? (d.opacity = '') : (e * l).toFixed(0) + 'px';
                  }, TreeView._AN_DLY));
            }
          } else wjcCore.toggleClass(o, TreeView._CCLD, t);
          if (!t && n) {
            var h = o.parentElement;
            if (e._isNodeList(h))
              for (var c = 0; c < h.children.length; c++) {
                var u = h.children[c];
                u != o &&
                  e._isNode(u) &&
                  (wjcCore.toggleClass(u, TreeView._CCLD, !0),
                  u.setAttribute('aria-expanded', 'false'));
              }
          }
        } else i._lazyLoadNode(this);
    }),
    (e.prototype.setChecked = function (e, t) {
      var r = this.checkBox;
      if (((r.checked = e), (r.indeterminate = !1), this.hasChildren))
        for (var n = this.nodes, i = 0; i < n.length; i++)
          n[i].setChecked(e, !1);
      if (t) {
        var o = this.parentNode;
        o && o._updateCheckedState();
      }
    }),
    (e.prototype.remove = function () {
      var e = this._t,
        t = this.parentNode,
        r = this._getArray(),
        n = r.indexOf(this.dataItem);
      if (e.selectedNode == this) {
        var i = this.nextSibling() || this.previousSibling() || this.parentNode;
        i && (e.selectedNode = i);
      }
      wjcCore.removeChild(this.element),
        t && t._updateState(),
        r.splice(n, 1),
        (this._t = null);
    }),
    (e.prototype.addChildNode = function (e, t) {
      var r = this._t._createNode(t),
        n = this.nodes;
      return (
        n
          ? e < n.length
            ? r.move(n[e], DropPosition.Before)
            : r.move(n[n.length - 1], DropPosition.After)
          : r.move(this, DropPosition.Into),
        r
      );
    }),
    (e.prototype.refresh = function (e) {
      var t = this._getArray();
      e && (t[this.index] = e), (e = t[this.index]);
      var r = this._t._createNode(e),
        n =
          this.hasChildren && !this.hasPendingChildren
            ? this.element.nextSibling
            : null;
      n && wjcCore.removeChild(n),
        (n =
          r.hasChildren && !r.hasPendingChildren
            ? r.element.nextSibling
            : null) &&
          this.element.parentElement.insertBefore(n, this.element.nextSibling),
        (this.element.innerHTML = r.element.innerHTML),
        this._updateState();
    }),
    (e.prototype.move = function (t, r) {
      if (t instanceof e && this._contains(t)) return !1;
      var n = this.parentNode,
        i = this._getArray();
      this._moveElements(t, r);
      var o = this.parentNode,
        s = this._getArray();
      n && n._updateState(), o && o._updateState();
      var a = this.dataItem,
        l = i.indexOf(a);
      return (
        i.splice(l, 1),
        s.splice(this.index, 0, a),
        t.treeView && (this._t = t.treeView),
        !0
      );
    }),
    Object.defineProperty(e.prototype, 'itemsSource', {
      get: function () {
        return this._getArray();
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype._pse = function (e) {
      return e.previousElementSibling;
    }),
    (e.prototype._contains = function (e) {
      for (; e; e = e.parentNode) if (e.element == this.element) return !0;
      return !1;
    }),
    (e.prototype._getArray = function () {
      var e = this._t,
        t = this.parentNode,
        r = e.itemsSource;
      if (t) {
        var n = e._itmPath;
        (r = n.getValue(t.dataItem, this.level)) ||
          ((r = []), n.setValue(t.dataItem, this.level, r));
      }
      return r;
    }),
    (e.prototype._moveElements = function (t, r) {
      var n = document.createDocumentFragment(),
        i =
          this.hasChildren && !this.hasPendingChildren
            ? this.element.nextSibling
            : null;
      if (
        (n.appendChild(this.element),
        i && (e._assertNodeList(i), n.appendChild(i)),
        t instanceof TreeView)
      )
        t._root.insertBefore(n, null);
      else {
        var o = t.element,
          s = o ? o.parentElement : t.treeView._root;
        e._assertNodeList(s);
        var a = DropPosition;
        switch (r) {
          case a.Before:
            s.insertBefore(n, o);
            break;
          case a.After:
            (o = (t = t.nextSibling()) ? t.element : null),
              s.insertBefore(n, o);
            break;
          case a.Into:
            (t.hasChildren && !t.hasPendingChildren) ||
              ((i = document.createElement('div')),
              wjcCore.addClass(i, TreeView._CNDL),
              s.insertBefore(i, o.nextSibling)),
              (s = t.element.nextSibling),
              e._assertNodeList(s),
              s.insertBefore(n, null);
        }
      }
    }),
    (e.prototype._updateState = function () {
      this._updateEmptyState(), this._updateCheckedState();
    }),
    (e.prototype._updateEmptyState = function () {
      var t = this.element.nextSibling,
        r = !1;
      e._isNodeList(t) &&
        (t.childElementCount ? (r = !0) : wjcCore.removeChild(t)),
        wjcCore.toggleClass(this.element, TreeView._CEMP, !r),
        r || this.element.removeAttribute('aria-expanded');
    }),
    (e.prototype._updateCheckedState = function () {
      var e = this.checkBox,
        t = this.nodes,
        r = 0,
        n = 0;
      if (e && t) {
        for (var i = 0; i < t.length; i++)
          switch (t[i].isChecked) {
            case !0:
              r++;
              break;
            case !1:
              n++;
          }
        r == t.length
          ? ((e.checked = !0), (e.indeterminate = !1))
          : n == t.length
          ? ((e.checked = !1), (e.indeterminate = !1))
          : ((e.checked = !1), (e.indeterminate = !0));
      }
      var o = this.parentNode;
      o && o._updateCheckedState();
    }),
    (e._getChildNodes = function (t, r) {
      e._assertNodeList(r);
      var n = [];
      if (e._isNodeList(r))
        for (var i = r.children, o = 0; o < i.length; o++) {
          var s = i[o];
          e._isNode(s) && n.push(new e(t, s));
        }
      return n;
    }),
    (e._isNode = function (e) {
      return e && wjcCore.hasClass(e, TreeView._CND);
    }),
    (e._isNodeList = function (e) {
      return e && wjcCore.hasClass(e, TreeView._CNDL);
    }),
    (e._isEmpty = function (t) {
      return e._isNode(t) && wjcCore.hasClass(t, TreeView._CEMP);
    }),
    (e._isCollapsed = function (t) {
      return (
        e._isNode(t) && !e._isEmpty(t) && wjcCore.hasClass(t, TreeView._CCLD)
      );
    }),
    (e._assertNode = function (t) {
      wjcCore.assert(e._isNode(t), 'node expected');
    }),
    (e._assertNodeList = function (t) {
      wjcCore.assert(e._isNodeList(t), 'nodeList expected');
    }),
    e
  );
})();
exports.TreeNode = TreeNode;
var FormatNodeEventArgs = (function (e) {
  function t(t, r, n) {
    var i = e.call(this) || this;
    return (
      (i._data = t), (i._e = wjcCore.asType(r, HTMLElement)), (i._level = n), i
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'dataItem', {
      get: function () {
        return this._data;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'element', {
      get: function () {
        return this._e;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'level', {
      get: function () {
        return this._level;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.EventArgs);
exports.FormatNodeEventArgs = FormatNodeEventArgs;
var TreeNodeEventArgs = (function (e) {
  function t(t) {
    var r = e.call(this) || this;
    return (r._node = t), r;
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'node', {
      get: function () {
        return this._node;
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.CancelEventArgs);
exports.TreeNodeEventArgs = TreeNodeEventArgs;
var TreeNodeDragDropEventArgs = (function (e) {
  function t(t, r, n) {
    var i = e.call(this) || this;
    return (
      (i._src = wjcCore.asType(t, TreeNode)),
      (i._tgt = wjcCore.asType(r, TreeNode)),
      (i._pos = n),
      i
    );
  }
  return (
    __extends(t, e),
    Object.defineProperty(t.prototype, 'dragSource', {
      get: function () {
        return this._src;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'dropTarget', {
      get: function () {
        return this._tgt;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(t.prototype, 'position', {
      get: function () {
        return this._pos;
      },
      set: function (e) {
        this._pos = wjcCore.asEnum(e, DropPosition);
      },
      enumerable: !0,
      configurable: !0,
    }),
    t
  );
})(wjcCore.CancelEventArgs);
exports.TreeNodeDragDropEventArgs = TreeNodeDragDropEventArgs;
var DropPosition;
!(function (e) {
  (e[(e.Before = 0)] = 'Before'),
    (e[(e.After = 1)] = 'After'),
    (e[(e.Into = 2)] = 'Into');
})((DropPosition = exports.DropPosition || (exports.DropPosition = {})));
var _TreeDragDropManager = (function () {
  function e(e) {
    (this._tree = wjcCore.asType(e, TreeView)),
      (this._dragstartBnd = this._dragstart.bind(this)),
      (this._dragoverBnd = this._dragover.bind(this)),
      (this._dropBnd = this._drop.bind(this)),
      (this._dragendBnd = this._dragend.bind(this));
    var t = this._tree,
      r = t.hostElement;
    t.addEventListener(r, 'dragstart', this._dragstartBnd),
      t.addEventListener(r, 'dragover', this._dragoverBnd),
      t.addEventListener(r, 'dragleave', this._dragoverBnd),
      t.addEventListener(r, 'drop', this._dropBnd),
      t.addEventListener(r, 'dragend', this._dragendBnd),
      t.addEventListener(r, 'keydown', this._keydown);
  }
  return (
    (e.prototype.dispose = function () {
      var e = this._tree,
        t = e.hostElement;
      e.removeEventListener(t, 'dragstart', this._dragstartBnd),
        e.removeEventListener(t, 'dragover', this._dragoverBnd),
        e.removeEventListener(t, 'dragleave', this._dragoverBnd),
        e.removeEventListener(t, 'drop', this._dropBnd),
        e.removeEventListener(t, 'dragend', this._dragendBnd),
        e.removeEventListener(t, 'keydown', this._keydown),
        this._showDragMarker();
    }),
    (e.prototype._dragstart = function (t) {
      if (!t.defaultPrevented) {
        var r = this._tree,
          n = wjcCore.closestClass(t.target, TreeView._CND),
          i = e;
        if (
          ((i._drgSrc = TreeNode._isNode(n) ? new TreeNode(r, n) : null),
          i._drgSrc)
        ) {
          var o = new TreeNodeEventArgs(i._drgSrc);
          r.onDragStart(o) || (i._drgSrc = null);
        }
        i._drgSrc && t.dataTransfer
          ? (wjcCore._startDrag(t.dataTransfer, 'copyMove'),
            t.stopPropagation())
          : t.preventDefault();
      }
    }),
    (e.prototype._dragover = function (e) {
      this._handleDragDrop(e, !1);
    }),
    (e.prototype._drop = function (e) {
      this._handleDragDrop(e, !0);
    }),
    (e.prototype._dragend = function (t) {
      (e._drgSrc = null), this._showDragMarker(), this._tree.onDragEnd();
    }),
    (e.prototype._keydown = function (e) {
      e.defaultPrevented ||
        (e.keyCode == wjcCore.Key.Escape && this._dragendBnd(null));
    }),
    (e.prototype._handleDragDrop = function (t, r) {
      var n,
        i,
        o = this._tree,
        s = e,
        a = DropPosition,
        l = a.Into;
      if (!t.defaultPrevented && s._drgSrc) {
        var d = document.elementFromPoint(t.clientX, t.clientY),
          h = wjcCore.closestClass(d, TreeView._CND);
        if (null == h) {
          var c = wjcCore.Control.getControl(
            wjcCore.closest(d, '.wj-treeview')
          );
          c instanceof TreeView && 0 == c.totalItemCount && (h = c.hostElement);
        }
        if ((h == s._drgSrc.element && (h = null), h)) {
          i = h.getBoundingClientRect();
          var u = new TreeNode(o, h),
            p = u.hasPendingChildren ? i.height / 2 : i.height / 3;
          null == u.element
            ? ((i = wjcCore.Rect.fromBoundingRect(i)).inflate(-12, -12),
              (l = a.Before))
            : t.clientY < i.top + p
            ? (l = a.Before)
            : (t.clientY > i.bottom - p || u.hasPendingChildren) &&
              ((l = a.After),
              !u.hasChildren ||
                u.isCollapsed ||
                u.hasPendingChildren ||
                ((l = a.Before),
                (i = (h = (u = u.next(!0, !1))
                  .element).getBoundingClientRect()))),
            s._drgSrc._contains(u)
              ? (h = null)
              : (((n = new TreeNodeDragDropEventArgs(s._drgSrc, u, l)).cancel =
                  s._drgSrc.treeView != u.treeView),
                o.onDragOver(n) || (h = null));
        }
        if (h)
          if ((l = n.position) == a.Before) {
            var _ = n.dragSource.next(!0, !1);
            _ && _.element == h && (h = null);
          } else if (l == a.After) {
            var f = n.dragSource.previous(!0, !1);
            f && f.element == h && (h = null);
          }
        if (
          (h && !r
            ? ((t.dataTransfer.dropEffect = 'move'),
              t.preventDefault(),
              t.stopPropagation(),
              this._showDragMarker(i, l))
            : this._showDragMarker(),
          h && r && o.onDrop(n))
        ) {
          o.hostElement.focus();
          var C = n.dragSource;
          C.move(n.dropTarget, n.position), C.select();
        }
      }
    }),
    (e.prototype._showDragMarker = function (t, r) {
      var n = this._tree,
        i = e._dMarker.parentElement;
      if (t) {
        var o = n.hostElement.getBoundingClientRect(),
          s = r == DropPosition.After ? t.bottom : t.top,
          a = {
            top: Math.round(s - o.top + n.hostElement.scrollTop - 2),
            width: '75%',
            height: r == DropPosition.Into ? t.height : 4,
            opacity: r == DropPosition.Into ? '0.15' : '',
          };
        n.rightToLeft
          ? (a.right = Math.round(o.right - t.right))
          : (a.left = Math.round(t.left - o.left)),
          wjcCore.setCss(e._dMarker, a),
          i != n._root && n._root.appendChild(e._dMarker);
      } else i && i.removeChild(e._dMarker);
    }),
    (e._dMarker = wjcCore.createElement('<div class="wj-marker">&nbsp;</div>')),
    e
  );
})();
exports._TreeDragDropManager = _TreeDragDropManager;
var _BindingArray = (function () {
  function e(e) {
    this.path = e;
  }
  return (
    Object.defineProperty(e.prototype, 'path', {
      get: function () {
        return this._path;
      },
      set: function (e) {
        if (((this._path = e), wjcCore.isString(e)))
          this._bindings = [new wjcCore.Binding(e)];
        else if (wjcCore.isArray(e)) {
          this._bindings = [];
          for (var t = 0; t < e.length; t++)
            this._bindings.push(new wjcCore.Binding(e[t]));
        } else
          null != e &&
            wjcCore.assert(
              !1,
              'Path should be a string or an array of strings.'
            );
        this._maxLevel = this._bindings ? this._bindings.length - 1 : -1;
      },
      enumerable: !0,
      configurable: !0,
    }),
    (e.prototype.getValue = function (e, t) {
      var r = Math.min(t, this._maxLevel);
      return r > -1 ? this._bindings[r].getValue(e) : null;
    }),
    (e.prototype.setValue = function (e, t, r) {
      var n = Math.min(t, this._maxLevel);
      n > -1 && this._bindings[n].setValue(e, r);
    }),
    e
  );
})();
exports._BindingArray = _BindingArray;
