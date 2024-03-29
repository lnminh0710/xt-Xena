import * as wjcGridMultirow from 'wijmo/wijmo.grid.multirow';
import { EventEmitter, AfterViewInit } from '@angular/core';
import { ElementRef, Injector } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import {
  IWjComponentMetadata,
  IWjComponentMeta,
} from 'wijmo/wijmo.angular2.directiveBase';
export declare var wjMultiRowMeta: IWjComponentMeta;
export declare class WjMultiRow
  extends wjcGridMultirow.MultiRow
  implements OnInit, OnDestroy, AfterViewInit
{
  static readonly meta: IWjComponentMetadata;
  private _wjBehaviour;
  isInitialized: boolean;
  initialized: EventEmitter<any>;
  wjModelProperty: string;
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
export declare class WjGridMultirowModule {}
