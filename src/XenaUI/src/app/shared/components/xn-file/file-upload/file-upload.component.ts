import {
  Component,
  Input,
  EventEmitter,
  Output,
  ElementRef,
  OnInit,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { ModalService } from 'app/services';
import * as message from 'app/models/common/message-modal';
import { FileUploader, FileItem, FileType } from '../xn-file-upload';
import { MessageModal, UploadFileMode, Configuration } from 'app/app.constants';
import union from 'lodash-es/union';
import { BaseComponent } from 'app/pages/private/base';
import { Uti, SerializationHelper } from 'app/utilities';
import { UserAuthentication } from 'app/models';

declare var zip: any;
declare var XLSX: any;

@Component({
  selector: 'file-upload',
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})
export class FileUploadComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public actionText = 'Upload';
  public perfectScrollbarConfig: any = {};
  public uploader: FileUploader = null;
  public hasBaseDropZoneOver = false;

  private _readDataMode = false;
  private messageWarnOption: message.MessageModalModel;
  private _uploadFileMode: UploadFileMode = UploadFileMode.Other;
  private _idFolder: any = 0;
  private subject: Subject<any> = new Subject();
  private subscription: Subscription;

  @Input() maxSizeLimit: number = this.configuration.maxSizeLimit;
  @Input() setAuthToken: boolean = false;
  @Input() singleFile: boolean = false;
  @Input() title: string = 'Select files';
  @Input() allowSelectDuplicateFile = true;
  @Input() checkFileCorrect: any;
  @Input() maxNumOfFiles: number; //Maximum number of files

  @Input() acceptExtensionFiles = '*';
  @Input() saveFileName: string = '';

  @Input()
  set uploadFileMode(val: any) {
    this._uploadFileMode = val;
    this.initUploader(true);
  }
  get uploadFileMode() {
    return this._uploadFileMode;
  }

  // If uploadFileMode is null then get the absolute path with idFolder
  // Example: \\file.xena.local\XenaUploadFile\Printing\660\filename.docx
  //        => idFolder: XenaUploadFile\Printing\660
  @Input() set idFolder(val: any) {
    this._idFolder = val;
    this.reBuildUrl();
  }

  @Input() statusTemplate: TemplateRef<any>;
  public templateContext: any = {};

  @Output()
  onCompleteItem = new EventEmitter<any>();

  @Output() onCompleteAll = new EventEmitter<any>();
  @Output() public fileDuplicateAction: EventEmitter<any> = new EventEmitter();
  @Output() public fileDuplicateOnQueueAction: EventEmitter<any> =
    new EventEmitter();
  @Output() public onFileChangedAction: EventEmitter<any> = new EventEmitter();

  @Input()
  set readDataMode(value) {
    this._readDataMode = value;
    this.actionText = 'Upload';
    if (this._readDataMode) {
      this.actionText = 'Import';
    }
    this.initUploader(true);
    this.uploader.options.readDataMode = value;
  }

  @Input()
  set inputFilesData(value: File[]) {
    if (value) {
      this.initUploader(false);
      this.uploader.addToQueue(value, this.uploader.options);
    }
  }

  get readDataMode() {
    return this._readDataMode;
  }

  constructor(
    private _eref: ElementRef,
    private modalService: ModalService,
    private configuration: Configuration,
    protected router: Router
  ) {
    super(router);
    this.perfectScrollbarConfig = {
      suppressScrollX: false,
    };
    // this.initForConfirmDeleteModal(MessageModal.MessageType.warning);

    this.subscription = this.subject.debounceTime(100).subscribe((event) => {
      this.sortQueueList();
    });
  }

  public ngOnInit() {
    this.initUploader(false);
    this.initXlsx();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }
  public fileDuplicateHandler(file: any) {
    this.modalService.warningHTMLText([
      { key: '<p>' },
      { key: 'Modal_Message__This_File_Is_Already_Uploaded' },
      { key: '</p><p>' },
      { key: file.name },
      { key: '</p>' },
    ]);
    this.fileDuplicateAction.emit(file);
  }
  public fileDuplicateOnQueueHandler(file: any) {
    this.modalService.warningHTMLText([
      { key: '<p>' },
      { key: 'Modal_Message__This_File_Is_Already_Selected' },
      { key: '</p><p>' },
      { key: file.name },
      { key: '</p>' },
    ]);
    this.fileDuplicateOnQueueAction.emit(file);
  }

  public dontAllowFileExtensionHander() {
    this.modalService.warningHTMLText([
      { key: '<p>' },
      {
        key: 'Modal_Message__You_Should_Upload_File_That_Has_Extensions',
      },
      { key: '</p></p>' },
      { key: this.acceptExtensionFiles },
      { key: '</p>' },
    ]);
  }

  public dontAllowFileSize() {
    this.modalService.warningHTMLText([
      { key: '<p>' },
      { key: 'Modal_Message__The_File_Size_Limit' },
      { key: Uti.formatBytes(this.maxSizeLimit) },
      { key: 'Modal_Message__Exceeded' },
      { key: '</p>' },
    ]);
  }

  public exceedMaximumNumOfFilesHander() {
    this.modalService.warningHTMLText([
      { key: '<p>' },
      { key: 'Modal_Message__Exceed_the_maximum_numbers_of_files' },
      { key: ': ' + this.maxNumOfFiles + '' },
      { key: '</p>' },
    ]);
  }

  public onFileDropHandler($event) {
    this.onFileChangedAction.emit($event);
  }

  private initXlsx() {
    if (!this._readDataMode) return;

    zip.installJS('public/assets/lib/xlsx.zip', ['xlsx.full.min.js'], () => {
      console.log('load xlsx completed');
    });
  }

  private reBuildUrl() {
    if (!this._idFolder) return;
    this.uploader['options']['url'] = this.getUploadUrl();
  }

  private getUploadUrl(): string {
    return Uti.getUploadFileUrl(
      this.uploadFileMode,
      this._idFolder,
      this.saveFileName
    );
  }

  /**
   * initUploader
   */
  private initUploader(forceInstance: boolean) {
    if (forceInstance) {
      this.uploader = null;
      this.uploader = new FileUploader({
        url: this.getUploadUrl(),
        removeAfterUpload: false,
        queueLimit: this.maxNumOfFiles,
      });
    } else {
      if (!this.uploader) {
        this.uploader = new FileUploader({
          url: this.getUploadUrl(),
          removeAfterUpload: false,
          queueLimit: this.maxNumOfFiles,
        });
      }
    }

    if (this.setAuthToken) {
      const currentUserJson = localStorage.getItem(
        this.configuration.localStorageCurrentUser
      );
      if (currentUserJson) {
        const currentUserAuthentication = SerializationHelper.toInstance(
          new UserAuthentication(),
          currentUserJson
        );
        if (
          currentUserAuthentication &&
          currentUserAuthentication.access_token
        ) {
          const authorizationString =
            currentUserAuthentication.token_type +
            ' ' +
            currentUserAuthentication.access_token;
          this.uploader.authToken = authorizationString;
        }
      }
    }

    this.uploader.onCompleteItem = (
      item: FileItem,
      response: any,
      status: any,
      headers: any
    ) => {
      try {
        // Upload mode
        if (!this._readDataMode) {
          response = JSON.parse(response);
        } else {
          // Read data mode
          const mimeType = FileType.getMimeClass(item._file);
          if (mimeType === 'text') {
            response = JSON.parse(response);
          } else if (mimeType === 'xls') {
            response = this.convertExcelToJson(response);
          }
        }
        this.subject.next();
        // this.sortQueueList();
      } catch (e) {}

      this.templateContext[item.id] = {
        $implicit: { item, response, status, headers },
      };

      this.onCompleteItem.emit({ item, response, status, headers });
    };

    this.uploader.onCompleteAll = () => {
      if (this.uploader.progress === 100) {
        this.onCompleteAll.emit();
      }
    };

    this.uploader.onAfterAddingFile = () => {
      this.removeOverlayToBody();
    };

    this.uploader.onWhenAddingFileFailed = () => {
      this.removeOverlayToBody();
    };

    this.uploader.onAfterAddingAll = () => {
      this.removeOverlayToBody();
    };
  }

  public clearItem() {
    this.uploader.queue = [];
  }

  /**
   * sortQueueList
   * */
  private sortQueueList() {
    if (!this.uploader.queue || !this.uploader.queue.length) {
      return;
    }
    const notCompletedUploadItems = this.uploader.queue.filter(
      (p) => !p.isUploaded
    );
    const completedUploadItems = this.uploader.queue.filter(
      (p) => p.isUploaded
    );
    let arr = [];
    if (notCompletedUploadItems && notCompletedUploadItems.length) {
      notCompletedUploadItems.forEach((item) => {
        arr.push(item);
      });
    }
    if (completedUploadItems && completedUploadItems.length) {
      completedUploadItems.forEach((item) => {
        arr.push(item);
      });
    }
    for (let i = 0; i < arr.length; i++) {
      if (this.uploader.queue[i]) {
        this.uploader.queue[i] = arr[i];
      }
    }
  }

  private convertExcelToJson(data: any) {
    const wb: any = XLSX.read(data, { type: 'binary' });
    let result = [];
    wb.SheetNames.forEach(function (sheetName) {
      // Obtain The Current Row As CSV
      const oJS = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
      result = union(oJS, result);
    });
    return result;
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
    if (this.uploader && this.uploader.isUploading) {
      setTimeout(() => {
        this.modalService.createModal(this.messageWarnOption);
        this.modalService.showModal();
      }, 100);
    }
  }

  public openFileExplorerDialog(event) {
    if (this.uploader && this.uploader.isUploading) {
      this.modalService.createModal(this.messageWarnOption);
      this.modalService.showModal();
      return;
    }
    $('#input-uploader', $(this._eref.nativeElement)).click();
    // 0001145: Can not close message when press cancel in Upload Dialog
    //this.addOverlayToBody();
  }

  private addOverlayToBody() {
    const templateHtml =
      '<div id="upload-overlay" style="position:absolute;left:0px;right:0px;top:0px;bottom:0px;background-color:rgba(90, 90, 90, 0.8);display:flex;justify-content:center;align-items:center;z-index:2000">' +
      '<div style="font-size:24pt;font-weight:800;color:#fff;">Please select files to UPLOAD!</div></div>';
    $('body').append(templateHtml);
  }

  private removeOverlayToBody() {
    $('#upload-overlay').remove();
  }

  private initForConfirmDeleteModal(messageType: any) {
    this.messageWarnOption = new message.MessageModalModel({
      // type: MessageModal.MessageType.success,
      messageType: messageType,
      modalSize: MessageModal.ModalSize.small,
      header: new message.MessageModalHeaderModel({
        text: 'Alert',
      }),
      body: new message.MessageModalBodyModel({
        isHtmlContent: true,
        content: [{ key: 'Modal_Message__Can_Not_Drop_File' }],
      }),
      footer: new message.MessageModalFooterModel({
        buttonList: [
          new message.ButtonList({
            buttonType: MessageModal.ButtonType.default,
            text: 'Ok',
            customClass: 'btn-sm',
            callBackFunc: () => {
              this.modalService.hideModal();
            },
          }),
        ],
      }),
    });
    this.modalService.createModal(this.messageWarnOption);
  }
}
