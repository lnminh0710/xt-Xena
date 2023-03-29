import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../../../services';
import { LabelTranslationComponent } from 'app/shared/components/label-translation';
import { Observable } from 'rxjs/Observable';
import { GlobalSettingService } from 'app/services/common';
import { defaultLanguage } from 'app/app.resource';

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    let value = defaultLanguage[params.key] || params.key;
    if (params.translateService && params.interpolateParams) {
      value = params.translateService.parser.interpolate(
        value,
        params.interpolateParams
      );
    }
    return value;
    //if (params.interpolateParams) {
    //    return params.interpolateParams["Default"] || params.key;
    //}
    //return params.key;
  }
}

export class CustomLoader implements TranslateLoader {
  constructor(
    http: HttpClient,
    private globalSettingService: GlobalSettingService
  ) {}

  getTranslation(lang: string): Observable<any> {
    return this.globalSettingService.getCommonTranslateLabelText();
  }
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler,
      },
      loader: {
        provide: TranslateLoader,
        useClass: CustomLoader,
        // useFactory: HttpLoaderFactory,
        deps: [HttpClient, GlobalSettingService],
      },
    }),
  ],
  declarations: [LabelTranslationComponent],
  exports: [LabelTranslationComponent, TranslateModule],
  providers: [],
})
export class LabelTranslationModule {}
