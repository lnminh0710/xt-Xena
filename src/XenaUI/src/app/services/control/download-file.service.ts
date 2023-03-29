import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { CommonService, ModalService } from 'app/services';
import { Observable } from 'rxjs/Observable';
import { ServiceUrl, MessageModal } from 'app/app.constants';
import * as message from 'app/models/common/message-modal';
import { String, Uti } from 'app/utilities';
import isNil from 'lodash-es/isNil';

@Injectable()
export class DownloadFileService {
  constructor(
    private serviceUrl: ServiceUrl,
    private commonService: CommonService
  ) {}

  existedFiles: Array<string> = [];
  unexistedFiles: Array<string> = [];
  dowloadingQueuFiles: Array<string> = [];
  messageWarnFileUnExistedOption: message.MessageModalModel;

  public checkFileExisted(fileName: string): Observable<boolean> {
    if (
      !this.dowloadingQueuFiles.includes(fileName) &&
      !this.unexistedFiles.includes(fileName)
    ) {
      this.dowloadingQueuFiles.push(fileName);
      return this.commonService.checkFileExisted(fileName);
    }
    return null;
  }
  private rebuildRealFileName(
    fileName: any,
    mode?: any,
    idFolder?: any
  ): string {
    if (!isNil(mode)) {
      fileName += '&mode=' + mode;
    }
    if (!isNil(idFolder)) {
      fileName += '&subFolder=' + idFolder;
    }
    return fileName;
  }

  public makeDownloadFile(
    fileName: string,
    returnFileName: string,
    modalService: any,
    mode?: any,
    idFolder?: any
  ): void {
    let realFileName = this.rebuildRealFileName(fileName, mode, idFolder);
    if (this.existedFiles.includes(fileName)) {
      this.downloadFile(realFileName, returnFileName);
    } else {
      const _existedFile = this.checkFileExisted(realFileName);
      if (_existedFile)
        _existedFile.subscribe((response) => {
          if (response) {
            this.existedFiles.push(fileName);
            this.downloadFile(realFileName, returnFileName);
          } else if (modalService) {
            if (this.dowloadingQueuFiles.includes(fileName))
              this.dowloadingQueuFiles.splice(
                this.dowloadingQueuFiles.indexOf(fileName),
                1
              );
            this.unexistedFiles.push(fileName);
            this.showModal(fileName, modalService);
          }
        });
      else {
        if (this.unexistedFiles.includes(fileName)) {
          this.showModal(fileName, modalService);
        }
      }
    }
  }

  downloadFile(fileName: string, returnFileName: string, noCache?): void {
    if (!noCache && this.dowloadingQueuFiles.includes(fileName))
      this.dowloadingQueuFiles.splice(
        this.dowloadingQueuFiles.indexOf(fileName),
        1
      );
    if (!returnFileName) returnFileName = fileName;
    const url = Uti.getFileUrl(fileName, null, returnFileName);
    this.openRequestFileInBackground(url);
  }

  private openRequestFileInBackground(url: string) {
    try {
      const frame = document.createElement('iframe');
      frame.src = url;
      document.body.appendChild(frame);
      setTimeout(() => {
        try {
          frame.remove();
        } catch (ex) {
          console.log(ex);
        }
      }, 10000);
    } catch (ex) {
      console.log(ex);
    }
  }

  showModal(fileName: string, modalService: ModalService) {
    modalService.warningHTMLText([
      { key: '<p>' },
      { key: 'Modal_Message__The_Download_File' },
      { key: '</p>' },
      { key: fileName },
      { key: '<p>' },
      { key: 'Modal_Message__Does_Not_Exist_Any_More' },
      { key: '</p>' },
    ]);
  }
}
