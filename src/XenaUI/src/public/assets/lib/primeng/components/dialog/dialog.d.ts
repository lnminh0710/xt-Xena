import {
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import { DomHandler } from '../dom/domhandler';
export declare class Dialog
  implements AfterViewInit, AfterViewChecked, OnDestroy
{
  el: ElementRef;
  domHandler: DomHandler;
  renderer: Renderer2;
  header: string;
  draggable: boolean;
  resizable: boolean;
  minWidth: number;
  minHeight: number;
  width: any;
  height: any;
  positionLeft: number;
  positionTop: number;
  contentStyle: any;
  modal: boolean;
  closeOnEscape: boolean;
  dismissableMask: boolean;
  rtl: boolean;
  closable: boolean;
  responsive: boolean;
  appendTo: any;
  style: any;
  styleClass: string;
  showHeader: boolean;
  breakpoint: number;
  blockScroll: boolean;
  headerFacet: any;
  footerFacet: any;
  containerViewChild: ElementRef;
  headerViewChild: ElementRef;
  contentViewChild: ElementRef;
  onShow: EventEmitter<any>;
  onHide: EventEmitter<any>;
  visibleChange: EventEmitter<any>;
  _visible: boolean;
  dragging: boolean;
  documentDragListener: Function;
  resizing: boolean;
  documentResizeListener: Function;
  documentResizeEndListener: Function;
  documentResponsiveListener: Function;
  documentEscapeListener: Function;
  maskClickListener: Function;
  lastPageX: number;
  lastPageY: number;
  mask: HTMLDivElement;
  closeIconMouseDown: boolean;
  preWidth: number;
  preventVisibleChangePropagation: boolean;
  executePostDisplayActions: boolean;
  initialized: boolean;
  constructor(el: ElementRef, domHandler: DomHandler, renderer: Renderer2);
  visible: boolean;
  ngAfterViewChecked(): void;
  show(): void;
  positionOverlay(): void;
  hide(): void;
  close(event: Event): void;
  ngAfterViewInit(): void;
  center(): void;
  enableModality(): void;
  disableModality(): void;
  unbindMaskClickListener(): void;
  moveOnTop(): void;
  onCloseMouseDown(event: Event): void;
  initDrag(event: MouseEvent): void;
  onDrag(event: MouseEvent): void;
  endDrag(event: MouseEvent): void;
  initResize(event: MouseEvent): void;
  onResize(event: MouseEvent): void;
  bindGlobalListeners(): void;
  unbindGlobalListeners(): void;
  bindDocumentDragListener(): void;
  unbindDocumentDragListener(): void;
  bindDocumentResizeListeners(): void;
  unbindDocumentResizeListeners(): void;
  bindDocumentResponsiveListener(): void;
  unbindDocumentResponsiveListener(): void;
  bindDocumentEscapeListener(): void;
  unbindDocumentEscapeListener(): void;
  ngOnDestroy(): void;
}
export declare class DialogModule {}
