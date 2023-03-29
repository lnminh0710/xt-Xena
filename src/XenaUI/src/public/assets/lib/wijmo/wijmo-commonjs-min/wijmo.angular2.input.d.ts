import * as wjcInput from 'wijmo/wijmo.input';
import * as wjcCore from 'wijmo/wijmo';
import { EventEmitter, AfterViewInit } from '@angular/core';
import {
  ElementRef,
  Injector,
  ViewContainerRef,
  TemplateRef,
  Renderer,
} from '@angular/core';
import {
  OnInit,
  OnChanges,
  OnDestroy,
  AfterContentInit,
  ChangeDetectorRef,
} from '@angular/core';
import * as ngCore from '@angular/core';
import {
  IWjComponentMetadata,
  IWjComponentMeta,
  IWjDirectiveMeta,
} from 'wijmo/wijmo.angular2.directiveBase';
export declare var wjComboBoxMeta: IWjComponentMeta;
export declare class WjComboBox
  extends wjcInput.ComboBox
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  isDroppedDownChangingNg: EventEmitter<any>;
  isDroppedDownChangedNg: EventEmitter<any>;
  isDroppedDownChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  formatItemNg: EventEmitter<any>;
  selectedIndexChangedNg: EventEmitter<any>;
  selectedIndexChangePC: EventEmitter<any>;
  selectedItemChangePC: EventEmitter<any>;
  selectedValueChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjAutoCompleteMeta: IWjComponentMeta;
export declare class WjAutoComplete
  extends wjcInput.AutoComplete
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  isDroppedDownChangingNg: EventEmitter<any>;
  isDroppedDownChangedNg: EventEmitter<any>;
  isDroppedDownChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  formatItemNg: EventEmitter<any>;
  selectedIndexChangedNg: EventEmitter<any>;
  selectedIndexChangePC: EventEmitter<any>;
  selectedItemChangePC: EventEmitter<any>;
  selectedValueChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjCalendarMeta: IWjComponentMeta;
export declare class WjCalendar
  extends wjcInput.Calendar
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  valueChangedNg: EventEmitter<any>;
  valueChangePC: EventEmitter<any>;
  displayMonthChangedNg: EventEmitter<any>;
  displayMonthChangePC: EventEmitter<any>;
  formatItemNg: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjColorPickerMeta: IWjComponentMeta;
export declare class WjColorPicker
  extends wjcInput.ColorPicker
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  valueChangedNg: EventEmitter<any>;
  valueChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjInputMaskMeta: IWjComponentMeta;
export declare class WjInputMask
  extends wjcInput.InputMask
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  valueChangedNg: EventEmitter<any>;
  rawValueChangePC: EventEmitter<any>;
  valueChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjInputColorMeta: IWjComponentMeta;
export declare class WjInputColor
  extends wjcInput.InputColor
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  isDroppedDownChangingNg: EventEmitter<any>;
  isDroppedDownChangedNg: EventEmitter<any>;
  isDroppedDownChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  valueChangedNg: EventEmitter<any>;
  valueChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjMultiSelectMeta: IWjComponentMeta;
export declare class WjMultiSelect
  extends wjcInput.MultiSelect
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  isDroppedDownChangingNg: EventEmitter<any>;
  isDroppedDownChangedNg: EventEmitter<any>;
  isDroppedDownChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  formatItemNg: EventEmitter<any>;
  selectedIndexChangedNg: EventEmitter<any>;
  selectedIndexChangePC: EventEmitter<any>;
  selectedItemChangePC: EventEmitter<any>;
  selectedValueChangePC: EventEmitter<any>;
  checkedItemsChangedNg: EventEmitter<any>;
  checkedItemsChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjMultiAutoCompleteMeta: IWjComponentMeta;
export declare class WjMultiAutoComplete
  extends wjcInput.MultiAutoComplete
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  isDroppedDownChangingNg: EventEmitter<any>;
  isDroppedDownChangedNg: EventEmitter<any>;
  isDroppedDownChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  formatItemNg: EventEmitter<any>;
  selectedIndexChangedNg: EventEmitter<any>;
  selectedIndexChangePC: EventEmitter<any>;
  selectedItemChangePC: EventEmitter<any>;
  selectedValueChangePC: EventEmitter<any>;
  selectedItemsChangedNg: EventEmitter<any>;
  selectedItemsChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjInputNumberMeta: IWjComponentMeta;
export declare class WjInputNumber
  extends wjcInput.InputNumber
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  valueChangedNg: EventEmitter<any>;
  valueChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjInputDateMeta: IWjComponentMeta;
export declare class WjInputDate
  extends wjcInput.InputDate
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  isDroppedDownChangingNg: EventEmitter<any>;
  isDroppedDownChangedNg: EventEmitter<any>;
  isDroppedDownChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  valueChangedNg: EventEmitter<any>;
  valueChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjInputTimeMeta: IWjComponentMeta;
export declare class WjInputTime
  extends wjcInput.InputTime
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  isDroppedDownChangingNg: EventEmitter<any>;
  isDroppedDownChangedNg: EventEmitter<any>;
  isDroppedDownChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  formatItemNg: EventEmitter<any>;
  selectedIndexChangedNg: EventEmitter<any>;
  selectedIndexChangePC: EventEmitter<any>;
  selectedItemChangePC: EventEmitter<any>;
  selectedValueChangePC: EventEmitter<any>;
  valueChangedNg: EventEmitter<any>;
  valueChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjInputDateTimeMeta: IWjComponentMeta;
export declare class WjInputDateTime
  extends wjcInput.InputDateTime
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  isDroppedDownChangingNg: EventEmitter<any>;
  isDroppedDownChangedNg: EventEmitter<any>;
  isDroppedDownChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  valueChangedNg: EventEmitter<any>;
  valueChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjListBoxMeta: IWjComponentMeta;
export declare class WjListBox
  extends wjcInput.ListBox
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  formatItemNg: EventEmitter<any>;
  itemsChangedNg: EventEmitter<any>;
  itemCheckedNg: EventEmitter<any>;
  selectedIndexChangedNg: EventEmitter<any>;
  selectedIndexChangePC: EventEmitter<any>;
  selectedItemChangePC: EventEmitter<any>;
  selectedValueChangePC: EventEmitter<any>;
  checkedItemsChangedNg: EventEmitter<any>;
  checkedItemsChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
}
export declare var wjMenuMeta: IWjComponentMeta;
export declare class WjMenu
  extends wjcInput.Menu
  implements OnInit, OnDestroy, AfterViewInit, OnChanges, AfterContentInit
{
  private _value;
  private _definedHeader;
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  asyncBindings: boolean;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  isDroppedDownChangingNg: EventEmitter<any>;
  isDroppedDownChangedNg: EventEmitter<any>;
  isDroppedDownChangePC: EventEmitter<any>;
  textChangedNg: EventEmitter<any>;
  textChangePC: EventEmitter<any>;
  formatItemNg: EventEmitter<any>;
  selectedIndexChangedNg: EventEmitter<any>;
  selectedIndexChangePC: EventEmitter<any>;
  selectedItemChangePC: EventEmitter<any>;
  selectedValueChangePC: EventEmitter<any>;
  itemClickedNg: EventEmitter<any>;
  valueChangePC: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
  value: any;
  ngOnChanges(changes: { [key: string]: ngCore.SimpleChange }): void;
  ngAfterContentInit(): void;
  onItemClicked(e?: wjcCore.EventArgs): void;
  refresh(fullUpdate?: boolean): void;
  private _attachToControl();
  private _loadingItems(s);
  private _fmtItem(s, e);
  private _updateHeader();
}
export declare var wjMenuItemMeta: IWjComponentMeta;
export declare class WjMenuItem implements OnInit, OnDestroy, AfterViewInit {
  private viewContainerRef;
  private domRenderer;
  value: string;
  cmd: string;
  cmdParam: string;
  header: string;
  _ownerMenu: wjcInput.Menu;
  templateDir: WjMenuItemTemplateDir;
  contentRoot: HTMLElement;
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjProperty: string;
  constructor(
    elRef: ElementRef,
    injector: Injector,
    parentCmp: any,
    viewContainerRef: ViewContainerRef,
    domRenderer: Renderer
  );
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  added(toItem: HTMLElement): void;
}
export declare class WjMenuItemTemplateDir implements ngCore.AfterContentInit {
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<any>;
  elRef: ElementRef;
  private domRenderer;
  wjMenuItemTemplateDir: any;
  ownerItem: WjMenuItem;
  contentRoot: HTMLElement;
  constructor(
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<any>,
    elRef: ElementRef,
    injector: Injector,
    domRenderer: Renderer,
    menuItem: WjMenuItem,
    menuSeparator: WjMenuSeparator
  );
  ngAfterContentInit(): void;
}
export declare var wjMenuSeparatorMeta: IWjComponentMeta;
export declare class WjMenuSeparator
  extends WjMenuItem
  implements OnInit, OnDestroy, AfterViewInit
{
  constructor(
    elRef: ElementRef,
    injector: Injector,
    parentCmp: any,
    viewContainerRef: ViewContainerRef,
    domRenderer: Renderer
  );
  added(toItem: HTMLElement): void;
}
export declare var wjItemTemplateMeta: IWjDirectiveMeta;
export declare class WjItemTemplate
  implements OnInit, OnDestroy, AfterViewInit
{
  viewContainerRef: ViewContainerRef;
  templateRef: TemplateRef<any>;
  private domRenderer;
  wjItemTemplate: any;
  ownerControl: wjcCore.Control;
  listBox: wjcInput.ListBox;
  private _cdRef;
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  constructor(
    elRef: ElementRef,
    injector: Injector,
    parentCmp: any,
    viewContainerRef: ViewContainerRef,
    templateRef: TemplateRef<any>,
    domRenderer: Renderer,
    cdRef: ChangeDetectorRef
  );
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  private _attachToControl();
  private _loadingItems(s);
  private _fmtItem(s, e);
  private _instantiateTemplate(parent);
  private static _getListBox(ownerControl);
}
export declare var wjPopupMeta: IWjComponentMeta;
export declare class WjPopup
  extends wjcInput.Popup
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  gotFocusNg: EventEmitter<any>;
  lostFocusNg: EventEmitter<any>;
  showingNg: EventEmitter<any>;
  shownNg: EventEmitter<any>;
  hidingNg: EventEmitter<any>;
  hiddenNg: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  addEventListener(
    target: EventTarget,
    type: string,
    fn: any,
    capture?: boolean
  ): void;
  ngOnChanges(changes: { [key: string]: ngCore.SimpleChange }): void;
  dispose(): void;
}
export declare class WjContextMenu {
  private elRef;
  wjContextMenu: wjcInput.Menu;
  constructor(elRef: ElementRef);
  onContextMenu(e: MouseEvent): void;
}
export declare var wjCollectionViewNavigatorMeta: IWjComponentMeta;
export declare class WjCollectionViewNavigator
  implements OnInit, OnDestroy, AfterViewInit
{
  cv: wjcCore.CollectionView;
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
}
export declare var wjCollectionViewPagerMeta: IWjComponentMeta;
export declare class WjCollectionViewPager
  implements OnInit, OnDestroy, AfterViewInit
{
  cv: wjcCore.CollectionView;
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
}
export declare class WjInputModule {}
