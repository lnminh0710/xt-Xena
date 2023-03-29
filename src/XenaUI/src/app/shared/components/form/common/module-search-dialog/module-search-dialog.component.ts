import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Configuration } from 'app/app.constants';
import { Module } from 'app/models';
import { GlobalSearchResultComponent } from 'app/shared/components/global-search/components/gs-result';
import { Dialog } from 'primeng/components/dialog/dialog';
import { ModalService } from 'app/services';

@Component({
  selector: 'module-search-dialog',
  templateUrl: './module-search-dialog.component.html',
  styleUrls: ['./module-search-dialog.component.scss'],
})
export class ModuleSearchDialogComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public allowDrag: any = {
    value: false,
  };

  @Input() headerTitle: string;
  @Input() showDialog: boolean = false;
  @Input() module: Module;
  @Input() searchIndex: string;

  @Output() onItemSelect: EventEmitter<any> = new EventEmitter();
  @Output() onDialogClose: EventEmitter<any> = new EventEmitter();

  @Input() keyword = '*';

  perfectScrollbarConfig: any = {};

  private isSearching = false;
  private selectedData: any;
  private preDialogW: string;
  private preDialogH: string;
  private preDialogLeft: string;
  private preDialogTop: string;

  public isWithStarStatus = false;
  public isResizable = true;
  public isDraggable = true;
  public isMaximized = false;
  public dialogStyleClass = this.consts.popupResizeClassName;
  @ViewChild('gsResult')
  gsResult: GlobalSearchResultComponent;
  private pDialogModuleSearch: any;
  @ViewChild('pDialogModuleSearch') set pDialogModuleSearchInstance(
    pDialogModuleSearchInstance: Dialog
  ) {
    this.pDialogModuleSearch = pDialogModuleSearchInstance;
  }
  constructor(
    private _eref: ElementRef,
    private consts: Configuration,
    private modalService: ModalService
  ) {}

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {}

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {}

  /**
   * open
   */
  open(keyword?: string) {
    this.showDialog = true;
    this.keyword = keyword || '*';
  }

  /**
   * close
   */
  close() {
    this.isMaximized = false;
    this.showDialog = false;
    this.onDialogClose.emit();
    this.keyword = '*';
  }

  /**
   * ok
   */
  ok() {
    this.onItemSelect.emit(this.selectedData);
    this.close();
  }

  /**
   * search
   * @param value
   */
  search(value: string) {
    if (
      this.modalService.isStopSearchWhenEmptySize(
        this.gsResult.pageSize,
        this.gsResult.pageIndex
      )
    )
      return;
    if (!value) {
      this.isSearching = false;
      return;
    }

    this.isSearching = true;
    this.keyword = value;
    setTimeout(() => {
      this.isSearching = false;
    }, 1000);
    // this.gsResult.search();
    // // if (value === this.keyword) {
    //     setTimeout(() => {
    //         this.isSearching = false;
    //     }, 1000);
    // }
  }

  rowClicked(data) {
    this.selectedData = data;
  }

  /**
   * rowDoubleClicked
   * @param data
   */
  rowDoubleClicked(data) {
    this.onItemSelect.emit(data);
    this.isMaximized = false;
    this.showDialog = false;
  }

  onSearchCompleted($event) {
    this.isSearching = false;
  }

  private maximize() {
    this.isMaximized = true;
    this.isResizable = false;
    this.isDraggable = false;
    this.dialogStyleClass =
      this.consts.popupResizeClassName +
      '  ' +
      this.consts.popupFullViewClassName;
    if (this.pDialogModuleSearch) {
      this.preDialogW =
        this.pDialogModuleSearch.containerViewChild.nativeElement.style.width;
      this.preDialogH =
        this.pDialogModuleSearch.containerViewChild.nativeElement.style.height;
      this.preDialogLeft =
        this.pDialogModuleSearch.containerViewChild.nativeElement.style.left;
      this.preDialogTop =
        this.pDialogModuleSearch.containerViewChild.nativeElement.style.top;

      this.pDialogModuleSearch.containerViewChild.nativeElement.style.width =
        $(document).width() + 'px';
      this.pDialogModuleSearch.containerViewChild.nativeElement.style.height =
        $(document).height() + 'px';
      this.pDialogModuleSearch.containerViewChild.nativeElement.style.top =
        '0px';
      this.pDialogModuleSearch.containerViewChild.nativeElement.style.left =
        '0px';
    }
  }

  private restore() {
    // if (this.pDialogModuleSearch)
    //     this.pDialogModuleSearch.resized();
    this.isMaximized = false;
    this.isResizable = true;
    this.isDraggable = true;
    this.dialogStyleClass = this.consts.popupResizeClassName;
    if (this.pDialogModuleSearch) {
      this.pDialogModuleSearch.containerViewChild.nativeElement.style.width =
        this.preDialogW;
      this.pDialogModuleSearch.containerViewChild.nativeElement.style.height =
        this.preDialogH;
      this.pDialogModuleSearch.containerViewChild.nativeElement.style.top =
        this.preDialogTop;
      this.pDialogModuleSearch.containerViewChild.nativeElement.style.left =
        this.preDialogLeft;
    }
  }
}
