import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { FileUploadComponent } from '../file-upload';
@Component({
  selector: 'file-upload-popup',
  styleUrls: ['./file-upload-popup.component.scss'],
  templateUrl: './file-upload-popup.component.html',
})
export class FileUploadPopupComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public showFileUploadPopup: boolean = false;
  @Input() acceptExtensionFiles: string = '*';
  @Input() uploadFileMode: any;
  @Input() singleFile: boolean = false;
  @Input() idFolder: string = '';
  @Input() saveFileName: string = '';
  @Input() allowSelectDuplicateFile: boolean = false;
  @Input() checkFileCorrect: Function;
  @Input() inputFilesData: File[];

  @Output() onCompleteItemAction = new EventEmitter<any>();
  @Output() onClosePopupAction = new EventEmitter<any>();

  @ViewChild('fileUpload') fileUpload: FileUploadComponent;

  constructor(router?: Router) {
    super(router);
  }
  public ngOnInit() {}
  public ngOnDestroy() {}

  public onCompleteItemHandler($event) {
    this.onCompleteItemAction.emit($event);
  }

  public close() {
    if (this.fileUpload) this.fileUpload.clearItem();
    this.showFileUploadPopup = false;
    this.onClosePopupAction.emit();
  }
  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/
}
