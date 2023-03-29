import { NgModule } from '@angular/core';
import { SavSendLetterComponent } from './sav-send-letter.component';
import { CommonModule } from '@angular/common';
import { WjViewerModule } from 'wijmo/wijmo.angular2.viewer';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { WidgetPdfModule } from 'app/shared/components/widget/components/widget-pdf';

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    WjViewerModule,
    LabelTranslationModule,
    WidgetPdfModule,
  ],
  exports: [SavSendLetterComponent],
  declarations: [SavSendLetterComponent],
})
export class SavSendLetterModule {}
