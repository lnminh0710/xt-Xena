import * as wjcCore from 'wijmo/wijmo';
import * as wjcSelf from 'wijmo/wijmo.nav';
export declare class TreeView extends wjcCore.Control {
  static _DATAITEM_KEY: string;
  static _AS_DLY: number;
  static _AN_DLY: number;
  static _CND: string;
  static _CNDL: string;
  static _CEMP: string;
  static _CNDT: string;
  static _CNDC: string;
  static _CSEL: string;
  static _CCLD: string;
  static _CCLG: string;
  static _CLDG: string;
  _root: HTMLElement;
  private _items;
  _selNode: TreeNode;
  _itmPath: wjcSelf._BindingArray;
  private _prevSel;
  private _dspPath;
  private _imgPath;
  private _dd;
  private _html;
  private _animated;
  private _xpndOnClick;
  private _autoColl;
  private _showChk;
  private _chkItems;
  private _ldLvl;
  private _srch;
  private _toSrch;
  private _dnIndet;
  private _lazyLoad;
  private _isDirty;
  private _isReadOnly;
  private _edtNode;
  static controlTemplate: string;
  constructor(element: any, options?: any);
  itemsSource: any[];
  childItemsPath: any;
  displayMemberPath: any;
  imageMemberPath: any;
  isContentHtml: boolean;
  showCheckboxes: boolean;
  autoCollapse: boolean;
  isAnimated: boolean;
  isReadOnly: boolean;
  startEditing(node?: TreeNode): boolean;
  finishEditing(cancel?: boolean): boolean;
  allowDragging: boolean;
  expandOnClick: boolean;
  selectedItem: any;
  selectedNode: TreeNode;
  readonly selectedPath: string[];
  checkedItems: any[];
  checkAllItems(check: boolean): void;
  readonly totalItemCount: number;
  lazyLoadFunction: Function;
  getFirstNode(visible?: boolean, enabled?: boolean): TreeNode;
  getLastNode(visible?: boolean, enabled?: boolean): TreeNode;
  readonly nodes: TreeNode[];
  getNode(item: any): TreeNode;
  addChildNode(index: number, dataItem: any): TreeNode;
  collapseToLevel(level: number): void;
  loadTree(preserveOutlineState?: boolean): void;
  readonly itemsSourceChanged: wjcCore.Event;
  onItemsSourceChanged(e?: wjcCore.EventArgs): void;
  readonly loadingItems: wjcCore.Event;
  onLoadingItems(e?: wjcCore.CancelEventArgs): boolean;
  readonly loadedItems: wjcCore.Event;
  onLoadedItems(e?: wjcCore.EventArgs): void;
  readonly itemClicked: wjcCore.Event;
  onItemClicked(e?: wjcCore.EventArgs): void;
  readonly selectedItemChanged: wjcCore.Event;
  onSelectedItemChanged(e?: wjcCore.EventArgs): void;
  readonly checkedItemsChanged: wjcCore.Event;
  onCheckedItemsChanged(e?: wjcCore.EventArgs): void;
  readonly isCollapsedChanging: wjcCore.Event;
  onIsCollapsedChanging(e: TreeNodeEventArgs): boolean;
  readonly isCollapsedChanged: wjcCore.Event;
  onIsCollapsedChanged(e: TreeNodeEventArgs): void;
  readonly isCheckedChanging: wjcCore.Event;
  onIsCheckedChanging(e: TreeNodeEventArgs): boolean;
  readonly isCheckedChanged: wjcCore.Event;
  onIsCheckedChanged(e: TreeNodeEventArgs): void;
  readonly formatItem: wjcCore.Event;
  onFormatItem(e: FormatNodeEventArgs): void;
  readonly dragStart: wjcCore.Event;
  onDragStart(e: TreeNodeEventArgs): boolean;
  readonly dragOver: wjcCore.Event;
  onDragOver(e: TreeNodeDragDropEventArgs): boolean;
  readonly drop: wjcCore.Event;
  onDrop(e: TreeNodeDragDropEventArgs): boolean;
  readonly dragEnd: wjcCore.Event;
  onDragEnd(e?: wjcCore.EventArgs): void;
  readonly nodeEditStarting: wjcCore.Event;
  onNodeEditStarting(e: TreeNodeEventArgs): boolean;
  readonly nodeEditStarted: wjcCore.Event;
  onNodeEditStarted(e: TreeNodeEventArgs): void;
  readonly nodeEditEnding: wjcCore.Event;
  onNodeEditEnding(e: TreeNodeEventArgs): boolean;
  readonly nodeEditEnded: wjcCore.Event;
  onNodeEditEnded(e: TreeNodeEventArgs): void;
  refresh(): void;
  _reload(): void;
  _createNode(dataItem: any): TreeNode;
  private _mousedown(e);
  private _click(e);
  private _keydown(e);
  private _keypress(e);
  private _findNext();
  private _loadTree(preserveOutlineState?);
  private _addItem(host, level, item);
  private _collapseToLevel(nodes, maxLevel, currentLevel);
  _lazyLoadNode(node: TreeNode): void;
  private _lazyLoadCallback(result);
  private _lazyLoadNodeDone(node, result);
}
export declare class TreeNode {
  _t: TreeView;
  _e: HTMLElement;
  constructor(treeView: TreeView, nodeElement: HTMLElement);
  readonly dataItem: any;
  readonly element: HTMLElement;
  readonly treeView: TreeView;
  ensureVisible(): void;
  equals(node: TreeNode): boolean;
  select(): void;
  readonly index: number;
  readonly parentNode: TreeNode;
  readonly level: number;
  readonly hasChildren: boolean;
  readonly hasPendingChildren: boolean;
  readonly nodes: TreeNode[];
  readonly checkBox: HTMLInputElement;
  isCollapsed: boolean;
  isChecked: boolean;
  isDisabled: boolean;
  previous(visible?: boolean, enabled?: boolean): TreeNode;
  next(visible?: boolean, enabled?: boolean): TreeNode;
  previousSibling(): TreeNode;
  nextSibling(): TreeNode;
  setCollapsed(
    collapsed: boolean,
    animate?: boolean,
    collapseSiblings?: boolean
  ): void;
  setChecked(checked: boolean, updateParent?: boolean): void;
  remove(): void;
  addChildNode(index: number, dataItem: any): TreeNode;
  refresh(dataItem?: any): void;
  move(refNode: any, position: DropPosition): boolean;
  readonly itemsSource: any[];
  _pse(e: HTMLElement): HTMLElement;
  _contains(node: TreeNode): boolean;
  _getArray(): any[];
  _moveElements(refNode: any, position: DropPosition): void;
  _updateState(): void;
  _updateEmptyState(): void;
  _updateCheckedState(): void;
  static _getChildNodes(treeView: TreeView, nodeList: HTMLElement): TreeNode[];
  static _isNode(e: HTMLElement): boolean;
  static _isNodeList(e: HTMLElement): boolean;
  static _isEmpty(node: HTMLElement): boolean;
  static _isCollapsed(node: HTMLElement): boolean;
  static _assertNode(node: HTMLElement): void;
  static _assertNodeList(nodeList: HTMLElement): void;
}
export declare class FormatNodeEventArgs extends wjcCore.EventArgs {
  _data: any;
  _e: HTMLElement;
  _level: number;
  constructor(dataItem: any, element: HTMLElement, level: number);
  readonly dataItem: any;
  readonly element: HTMLElement;
  readonly level: number;
}
export declare class TreeNodeEventArgs extends wjcCore.CancelEventArgs {
  _node: TreeNode;
  constructor(node: TreeNode);
  readonly node: TreeNode;
}
export declare class TreeNodeDragDropEventArgs extends wjcCore.CancelEventArgs {
  _src: TreeNode;
  _tgt: TreeNode;
  _pos: DropPosition;
  constructor(
    dragSource: TreeNode,
    dropTarget: TreeNode,
    position: DropPosition
  );
  readonly dragSource: TreeNode;
  readonly dropTarget: TreeNode;
  position: DropPosition;
}
export declare enum DropPosition {
  Before = 0,
  After = 1,
  Into = 2,
}
export declare class _TreeDragDropManager {
  private _tree;
  private _dragstartBnd;
  private _dragoverBnd;
  private _dragendBnd;
  private _dropBnd;
  private static _dMarker;
  private static _drgSrc;
  constructor(treeView: TreeView);
  dispose(): void;
  private _dragstart(e);
  private _dragover(e);
  private _drop(e);
  private _dragend(e);
  private _keydown(e);
  private _handleDragDrop(e, drop);
  private _showDragMarker(rc?, pos?);
}
export declare class _BindingArray {
  _path: any;
  _bindings: wjcCore.Binding[];
  _maxLevel: number;
  constructor(path?: any);
  path: any;
  getValue(dataItem: any, level: number): any;
  setValue(dataItem: any, level: number, value: any): void;
}
