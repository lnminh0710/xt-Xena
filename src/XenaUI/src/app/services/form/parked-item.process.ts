import { Injectable, Injector } from '@angular/core';
import { Uti } from 'app/utilities';

@Injectable()
export class ParkedItemProcess {
  private uti: Uti;

  public isProcessingForRequestSaveParkedItemList: boolean;
  public preventRequestSaveParkedItemList: boolean;

  constructor(protected injector: Injector) {
    this.uti = this.injector.get(Uti);
  }

  public reset() {
    this.isProcessingForRequestSaveParkedItemList = false;
    this.preventRequestSaveParkedItemList = false;
  }
}
