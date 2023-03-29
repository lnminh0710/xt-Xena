import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XnPaginationComponent } from './xn-pagination.component';
import { WjCoreModule } from 'wijmo/wijmo.angular2.core';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { MatButtonModule } from '../xn-control/light-material-ui/button';
import { XnTooltipModule } from 'app/shared/directives/xn-tooltip/xn-tooltip.module';
import { AngularMultiSelectModule } from '../xn-control/xn-dropdown';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WjCoreModule,
    WjInputModule,
    AngularMultiSelectModule,
    MatButtonModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
    XnTooltipModule,
  ],
  declarations: [XnPaginationComponent],
  exports: [XnPaginationComponent],
})
export class XnPagerModule {}
