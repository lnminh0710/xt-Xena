import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseCombineGridComponent } from './database-combine-grid.component';
import { XnAgGridModule } from 'app/shared/components/xn-control/xn-ag-grid';
import { AngularSplitModule } from 'angular-split';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    XnAgGridModule,
    AngularSplitModule,
    PerfectScrollbarModule.forRoot(),
  ],
  declarations: [DatabaseCombineGridComponent],
  exports: [DatabaseCombineGridComponent],
})
export class DatabaseCombineGridModule {}
