import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XnAgGridModule } from '../xn-control/xn-ag-grid';
import { AgGridModule } from 'ag-grid-angular';
import { MediacodePricingGridComponent } from './mediacode-pricing-grid.component';
import { AngularSplitModule } from 'angular-split';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    XnAgGridModule,
    AgGridModule,
    AngularSplitModule,
    PerfectScrollbarModule.forRoot(),
  ],
  declarations: [MediacodePricingGridComponent],
  exports: [MediacodePricingGridComponent],
})
export class MediacodePricingGridModule {}
