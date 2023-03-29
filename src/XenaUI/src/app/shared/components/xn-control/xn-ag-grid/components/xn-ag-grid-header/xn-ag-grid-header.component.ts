import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { ModalService } from 'app/services';
import { defaultLanguage } from 'app/app.resource';

@Component({
  selector: 'xn-ag-grid-header',
  templateUrl: './xn-ag-grid-header.component.html',
  styleUrls: ['./xn-ag-grid-header.component.scss'],
})
export class XnAgGridHeaderComponent implements OnInit, OnChanges {
  @Input() isShowedHeader = false;
  @Input() isShowCellMoveBtn: boolean;
  @Input() hasHeaderBorder = false;
  @Input() headerTitle: string;
  @Input() totalResults: number = 0;
  @Input() hasSearch = false;
  @Input() hasFilterBox = false;
  @Input() hasGoToNextColRow = false;
  @Input() isShowedEditButtons = false;
  @Input() allowUploadFile = false;
  @Input() allowAddNew = false;
  @Input() allowDelete = false;
  @Input() hasValidationError = false;
  @Input() isMarkedAsDelete = false;
  @Input() searchText: string = '*';
  @Input() isSearching: boolean;
  @Input() pageIndex: number;
  @Input() itemsPerPage: number;
  @Input() serverPaging: boolean;

  @Output() onSearch = new EventEmitter<any>();
  @Output() onFilter = new EventEmitter<any>();
  @Output() onUpload = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onDeleteRows = new EventEmitter<any>();
  @Output() onCellDirectionChanged = new EventEmitter<any>();

  public filter = '';
  public isCellMoveForward = false;
  public isCellMoveDefault = true;

  constructor(private modalService: ModalService) {}

  ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['headerTitle'] && this.headerTitle) {
      defaultLanguage['XnAgGridHeader__ht_' + this.headerTitle] =
        this.headerTitle;
    }
  }

  public doSearch(value: string) {
    if (this.serverPaging) {
      if (
        this.modalService.isStopSearchWhenEmptySize(
          this.itemsPerPage,
          this.pageIndex
        )
      )
        return;
    }
    if (!value) {
      this.isSearching = false;
      return;
    }

    if (this.searchText == value) return;

    this.isSearching = true;
    this.searchText = value;
    this.onSearch.emit(this.searchText);
  }

  public searchClicked($event) {
    if (this.serverPaging) {
      if (
        this.modalService.isStopSearchWhenEmptySize(
          this.itemsPerPage,
          this.pageIndex
        )
      )
        return;
    }
    if (!this.searchText) {
      this.isSearching = false;
      return;
    }

    this.isSearching = true;
    this.onSearch.emit(this.searchText);
  }

  public onFilterKeyup() {
    this.onFilter.emit(this.filter);
  }

  public uploadFile() {
    this.onUpload.emit(true);
  }

  public addNewRow() {
    this.onAdd.emit();
  }

  public deleteRows() {
    this.onDeleteRows.emit();
  }

  public onClickCellMoveBtn($event) {
    this.isCellMoveForward = !this.isCellMoveForward;

    this.onCellDirectionChanged.emit(this.isCellMoveForward);
  }

  public onClickCellMoveDefault($event) {
    this.isCellMoveDefault = !this.isCellMoveDefault;

    this.onCellDirectionChanged.emit(this.isCellMoveDefault);
  }
}
