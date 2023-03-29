import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HistoryBodyComponent,
  HistoryDialogComponent,
  HistoryFooterComponent,
  HistoryHeaderComponent,
  HistoryListComponent,
} from './components';
import { HistoryContainerComponent } from './container';
import { MaterialModule } from 'app/shared/components/xn-control/light-material-ui/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WjCoreModule } from 'wijmo/wijmo.angular2.core';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { WijmoGridModule } from 'app/shared/components/wijmo';
import { AgGridModule } from 'ag-grid-angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import * as primengModule from 'primeng/primeng';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { XnDetectScrollModule } from 'app/shared/directives/xn-scroll-event/xn-scroll-event.module';
import { XnTooltipModule } from 'app/shared/directives/xn-tooltip/xn-tooltip.module';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    WjCoreModule,
    WjInputModule,
    WijmoGridModule,
    AgGridModule,
    primengModule.DialogModule,
    PopoverModule,
    PerfectScrollbarModule.forRoot(),
    XnDetectScrollModule,
    XnTooltipModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
  ],
  declarations: [
    HistoryBodyComponent,
    HistoryDialogComponent,
    HistoryFooterComponent,
    HistoryHeaderComponent,
    HistoryListComponent,
    HistoryContainerComponent,
  ],
  exports: [HistoryContainerComponent],
})
export class CustomerHistoryModule {}
