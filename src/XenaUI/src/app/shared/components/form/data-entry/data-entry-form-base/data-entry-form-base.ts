import { Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import map from 'lodash-es/map';
import { Uti } from 'app/utilities';
import { DataEntryTranslateData } from 'app/shared/components/form/data-entry/data-entry-translate-data';

@Injectable()
export abstract class DataEntryFormBase extends BaseComponent {
  public currentTranslatedSource: Array<any> = [];
  public localizer: any = {};
  public transferTranslate: Array<any> = [];

  protected translateInitData = new DataEntryTranslateData();

  private defaultTranslateText: Array<any> = [];

  @Input()
  set translatedSource(source: Array<any>) {
    if (source && source.length) {
      this.currentTranslatedSource = Uti.mergeLocalizer(
        this.defaultTranslateText,
        source
      );
    } else {
      this.currentTranslatedSource = this.defaultTranslateText;
    }
    this.localizer = Uti.buildLocalizer(
      this.localizer,
      this.currentTranslatedSource
    );
    this.rebuildTranslateText();
  }
  get translatedSource(): Array<any> {
    return this.currentTranslatedSource;
  }

  constructor(router?: Router, data?: any) {
    super(router);
    this.initLoccalize(data);
  }

  // public abstract defaultTranslateText(): Array<any>;
  // public abstract initLoccalize();
  public abstract rebuildTranslateText();

  public getCurrentFields(): Array<any> {
    return map(this.defaultTranslateText, 'ColumnName');
  }

  public getCurrentTranslatedSource() {
    return this.currentTranslatedSource;
  }

  protected rebuildTranslateTextSelf() {
    let columns: Array<any> = [];
    for (let prop in this.localizer) {
      if (!this.localizer[prop]) continue;
      columns.push({
        data: prop,
        title: this.localizer[prop],
      });
    }
    this.transferTranslate = columns;
  }

  private initLoccalize(data: any) {
    if (!data || (!data.defaultTranslateText && !data.emptyData)) return;
    this.defaultTranslateText =
      this.translateInitData[data.defaultTranslateText];
    this.localizer = data.emptyData;
  }
}
