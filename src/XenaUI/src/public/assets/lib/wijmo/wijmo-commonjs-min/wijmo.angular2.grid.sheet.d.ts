import * as wjcGridSheet from 'wijmo/wijmo.grid.sheet';
import { EventEmitter, AfterViewInit } from '@angular/core';
import { ElementRef, Injector } from '@angular/core';
import { OnInit, OnDestroy, SimpleChange } from '@angular/core';
import {
  IWjComponentMetadata,
  IWjComponentMeta,
} from 'wijmo/wijmo.angular2.directiveBase';
export declare var wjFlexSheetMeta: IWjComponentMeta;
export declare class WjFlexSheet
  extends wjcGridSheet.FlexSheet
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
  beginningEditNg: EventEmitter<any>;
  cellEditEndedNg: EventEmitter<any>;
  cellEditEndingNg: EventEmitter<any>;
  prepareCellForEditNg: EventEmitter<any>;
  formatItemNg: EventEmitter<any>;
  resizingColumnNg: EventEmitter<any>;
  resizedColumnNg: EventEmitter<any>;
  autoSizingColumnNg: EventEmitter<any>;
  autoSizedColumnNg: EventEmitter<any>;
  draggingColumnNg: EventEmitter<any>;
  draggingColumnOverNg: EventEmitter<any>;
  draggedColumnNg: EventEmitter<any>;
  sortingColumnNg: EventEmitter<any>;
  sortedColumnNg: EventEmitter<any>;
  resizingRowNg: EventEmitter<any>;
  resizedRowNg: EventEmitter<any>;
  autoSizingRowNg: EventEmitter<any>;
  autoSizedRowNg: EventEmitter<any>;
  draggingRowNg: EventEmitter<any>;
  draggingRowOverNg: EventEmitter<any>;
  draggedRowNg: EventEmitter<any>;
  deletingRowNg: EventEmitter<any>;
  deletedRowNg: EventEmitter<any>;
  loadingRowsNg: EventEmitter<any>;
  loadedRowsNg: EventEmitter<any>;
  rowEditStartingNg: EventEmitter<any>;
  rowEditStartedNg: EventEmitter<any>;
  rowEditEndingNg: EventEmitter<any>;
  rowEditEndedNg: EventEmitter<any>;
  rowAddedNg: EventEmitter<any>;
  groupCollapsedChangedNg: EventEmitter<any>;
  groupCollapsedChangingNg: EventEmitter<any>;
  itemsSourceChangedNg: EventEmitter<any>;
  selectionChangingNg: EventEmitter<any>;
  selectionChangedNg: EventEmitter<any>;
  scrollPositionChangedNg: EventEmitter<any>;
  updatingViewNg: EventEmitter<any>;
  updatedViewNg: EventEmitter<any>;
  updatingLayoutNg: EventEmitter<any>;
  updatedLayoutNg: EventEmitter<any>;
  pastingNg: EventEmitter<any>;
  pastedNg: EventEmitter<any>;
  pastingCellNg: EventEmitter<any>;
  pastedCellNg: EventEmitter<any>;
  copyingNg: EventEmitter<any>;
  copiedNg: EventEmitter<any>;
  selectedSheetChangedNg: EventEmitter<any>;
  selectedSheetIndexChangePC: EventEmitter<any>;
  draggingRowColumnNg: EventEmitter<any>;
  droppingRowColumnNg: EventEmitter<any>;
  loadedNg: EventEmitter<any>;
  unknownFunctionNg: EventEmitter<any>;
  sheetClearedNg: EventEmitter<any>;
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
export declare var wjSheetMeta: IWjComponentMeta;
export declare class WjSheet
  extends wjcGridSheet.Sheet
  implements OnInit, OnDestroy, AfterViewInit
{
  boundRowCount: number;
  boundColumnCount: number;
  private _flexSheet;
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjProperty: string;
  nameChangedNg: EventEmitter<any>;
  constructor(elRef: ElementRef, injector: Injector, parentCmp: any);
  created(): void;
  ngOnInit(): wjcGridSheet.Sheet;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  ngOnChanges(changes: { [key: string]: SimpleChange }): any;
}
export declare class WjGridSheetModule {}
