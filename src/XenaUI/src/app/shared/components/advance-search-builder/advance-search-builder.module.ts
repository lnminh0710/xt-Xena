import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AdvanceSearchBuilderComponent } from './advance-search-builder.component';
import {
  AdvanceSearchIconComponent,
  AdvanceSearchConditionComponent,
} from './components';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../services';
import { AngularMultiSelectModule } from '../xn-control/xn-dropdown';
import { XnDatePickerModule } from 'app/shared/components/xn-control';
import { XnInputNumericModule } from 'app/shared/directives/xn-input-numeric/xn-input-numeric.module';
import { MaterialModule } from 'app/shared/components/xn-control/light-material-ui/material.module';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';
import { ResourceTranslationService } from 'app/services/common';

@NgModule({
  imports: [
    CommonModule,
    WjInputModule,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    XnDatePickerModule,
    XnInputNumericModule,
    MaterialModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
  ],
  declarations: [
    AdvanceSearchBuilderComponent,
    AdvanceSearchIconComponent,
    AdvanceSearchConditionComponent,
  ],
  exports: [
    AdvanceSearchBuilderComponent,
    AdvanceSearchIconComponent,
    AdvanceSearchConditionComponent,
  ],
  providers: [SearchService, ResourceTranslationService],
})
export class AdvanceSearchBuilderModule {}
