import { NgModule } from '@angular/core';
import { WidgetModuleInfoTranslationComponent } from './widget-module-info-translation.component';
import { WidgetTranslateComponent } from '../widget-translate';
import { CommonModule } from '@angular/common';
import { XnAgGridModule } from 'app/shared/components/xn-control/xn-ag-grid';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from 'app/shared/components/xn-control/light-material-ui/radio';
import { XnGridTranslationModule } from 'app/shared/directives/xn-grid-translation';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import * as primengModule from 'primeng/primeng';
import { MatButtonModule } from 'app/shared/components/xn-control/light-material-ui/button';

@NgModule({
  imports: [
    CommonModule,
    XnAgGridModule,
    PerfectScrollbarModule,
    FormsModule,
    MatButtonModule,
    primengModule.DialogModule,
    XnGridTranslationModule,
    XnResourceTranslationModule,
    LabelTranslationModule,
    MatRadioModule,
  ],
  exports: [WidgetModuleInfoTranslationComponent, WidgetTranslateComponent],
  declarations: [
    WidgetModuleInfoTranslationComponent,
    WidgetTranslateComponent,
  ],
  providers: [],
})
export class WidgetInfoTranslationModule {}
