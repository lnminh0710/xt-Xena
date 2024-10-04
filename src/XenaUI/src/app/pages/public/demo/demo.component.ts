import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/pages/private/base';
import { DataEntryService } from 'app/services';
import { CustomValidators } from 'app/utilities';
import get from 'lodash-es/get';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent extends BaseComponent implements OnInit {
  options = ['ABC', 'ABDD', 'agjaguia'];
  formGroup: FormGroup = new FormGroup({
    articleNr: new FormControl(null),
    myControl: new FormControl(null),
  });
  currentSearch = '';
  constructor(
    protected router: Router,
    private formBuilder: FormBuilder,

    private dataEntryService: DataEntryService
  ) {
    super(router);
  }

  date = new Date().toLocaleString();

  ngOnInit(): void {
    this.initEmptyData();
  }

  private initEmptyData() {
    this.formGroup = this.formBuilder.group({
      articleNr: [null, CustomValidators.required],
      myControl: [null, CustomValidators.required],
    });
  }

  public searchArticleNr = (query: any, max: any, callback: any) => {
    console.log(
      `Author:minh.lam , DemoComponent , searchArticleNr , query:`,
      query
    );
    if (query && query !== this.currentSearch) {
      this.currentSearch = query;

      this.dataEntryService.searchArticle(query).subscribe((response) => {
        console.log(
          `Author:minh.lam , DemoComponent , this.dataEntryService.searchArticle , response:`,
          response
        );
        callback(this._decorDataResponse(response));
      });
    }
  };

  private _decorDataResponse(response: any): any {
    const dataResponse = get(response, ['item', 'data', 1]);

    console.log(
      `Author:minh.lam , DemoComponent , _decorDataResponse , dataResponse:`,
      dataResponse
    );

    if (Array.isArray(dataResponse)) {
      return dataResponse.map((item) => ({
        value: item.IdArticle,
        name: `<div class="wj-article-item"><b>${item.ArticleNr}</b><div class="no-highlight">${item.ArticleNameShort}</div></div>`,
      }));
    }
    return [];
  }
}
