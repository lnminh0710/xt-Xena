import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  AfterViewInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'cell-edit-dialog',
  styleUrls: ['./cell-edit-dialog.component.scss'],
  templateUrl: './cell-edit-dialog.component.html',
})
export class CellEditDialogComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public cellData: {
    r: number;
    c: number;
    value: string;
    title: string;
    data: string;
  } = {
    c: -1,
    r: -1,
    value: '',
    title: '',
    data: '',
  };

  @Output() onAccept = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.selectElementContents($('.edit-field').get(0));
    }, 200);
  }

  public close() {
    this.onClose.emit();
  }

  public accept() {
    this.onAccept.emit(this.cellData);
  }

  private selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
