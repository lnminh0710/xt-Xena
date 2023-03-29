import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryBlacklistComponent } from './country-blacklist.component';
import { AngularSplitModule } from 'angular-split';
import { XnAgGridModule } from 'app/shared/components/xn-control/xn-ag-grid';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    AngularSplitModule,
    XnAgGridModule,
    PerfectScrollbarModule.forRoot(),
  ],
  declarations: [CountryBlacklistComponent],
  exports: [CountryBlacklistComponent],
})
export class CountryBlacklistModule {}
