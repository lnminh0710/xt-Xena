import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MaterialModule } from '../../xn-control/light-material-ui/material.module';
import { WijmoGridComponent } from './wijmo-grid.component';
import { FormsModule } from '@angular/forms';
import { XnInputDebounceModule } from '../../xn-control/xn-input-debounce/xn-input-debounce.module';
import { WjCoreModule } from 'wijmo/wijmo.angular2.core';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjNavModule } from 'wijmo/wijmo.angular2.nav';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjGridDetailModule } from 'wijmo/wijmo.angular2.grid.detail';
import { XnPagerModule } from 'app/shared/components/xn-pager/xn-pagination.module';
import { CellEditDialogModule } from 'app/shared/components/wijmo/components/cell-edit-dialog';
import { FormSupportModule } from 'app/shared/components/form';
import { XnDatePickerModule } from 'app/shared/components/xn-control/xn-date-picker';
import { XnDragDropModule } from 'app/shared/directives/xn-dragable/xn-dragable.module';
import { XnWjDropdownHelperModule } from 'app/shared/directives/xn-wj-dropdown-helper/xn-wj-dropdown-helper.module';
import { XnInputNumericModule } from 'app/shared/directives/xn-input-numeric/xn-input-numeric.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    XnInputDebounceModule,
    PerfectScrollbarModule.forRoot(),
    XnPagerModule,
    MaterialModule,
    WjCoreModule,
    WjGridModule,
    WjNavModule,
    WjInputModule,
    WjGridFilterModule,
    WjGridDetailModule,
    CellEditDialogModule,
    FormSupportModule,
    XnDatePickerModule,
    XnDragDropModule,
    XnWjDropdownHelperModule,
    XnInputNumericModule,
  ],
  declarations: [WijmoGridComponent],
  exports: [WijmoGridComponent],
})
export class WijmoGridModule {}
