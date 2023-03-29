import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChangePasswordFormComponent,
  UserProfileFormComponent,
} from './container';
import { MatButtonModule } from 'app/shared/components/xn-control/light-material-ui/button';
import { FormSupportModule } from 'app/shared/components/form';
import { ReactiveFormsModule } from '@angular/forms';
import { XnAgGridModule } from 'app/shared/components/xn-control/xn-ag-grid';
import { XnImageLoaderModule } from 'app/shared/directives/xn-image-loader/xn-image-loader.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { WjCoreModule } from 'wijmo/wijmo.angular2.core';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { XnTriggerClickInsideCboDirectiveModule } from 'app/shared/directives/xn-trigger-click-inside-cbo/xn-trigger-click-inside-cbo.module';
import { XnDatePickerModule } from 'app/shared/components/xn-control/xn-date-picker';
import { XnInputDebounceModule } from 'app/shared/components/xn-control/xn-input-debounce/xn-input-debounce.module';
import { AngularMultiSelectModule } from '../../xn-control/xn-dropdown';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    FormSupportModule,
    ReactiveFormsModule,
    XnAgGridModule,
    XnImageLoaderModule,
    PerfectScrollbarModule,
    WjCoreModule,
    WjInputModule,
    AngularMultiSelectModule,
    XnTriggerClickInsideCboDirectiveModule,
    XnDatePickerModule,
    XnInputDebounceModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
  ],
  declarations: [ChangePasswordFormComponent, UserProfileFormComponent],
  exports: [ChangePasswordFormComponent, UserProfileFormComponent],
})
export class UserManagementModule {}
