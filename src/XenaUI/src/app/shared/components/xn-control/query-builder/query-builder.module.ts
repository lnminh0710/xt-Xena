import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import {
  QueryBuilderComponent,
  QueryInputDirective,
  QueryFieldDirective,
  QueryOperatorDirective,
  QueryButtonGroupDirective,
  QuerySwitchGroupDirective,
  QueryRemoveButtonDirective,
  AgeFilterComponent,
  ExtendedFilterComponent,
  DynamicControlComponent,
  DynamicFilterComponent,
  DynamicFormComponent,
  RangeControlComponent,
} from './components';
import * as primengModule from 'primeng/primeng';
import { ReactiveFormsModule } from '@angular/forms';
import { InputToggleComponent } from '../input-toggle';
import { MatButtonModule } from '../light-material-ui/button';
import { XnFormFocusDirectiveModule } from 'app/shared/directives/xn-form-focus';
import { AngularMultiSelectModule } from '../xn-dropdown';
import { XnInputNumericModule } from 'app/shared/directives/xn-input-numeric/xn-input-numeric.module';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WjInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    AngularMultiSelectModule,
    primengModule.DialogModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
    XnFormFocusDirectiveModule,
    XnInputNumericModule,
  ],
  declarations: [
    QueryBuilderComponent,
    QueryInputDirective,
    QueryOperatorDirective,
    QueryFieldDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    AgeFilterComponent,
    ExtendedFilterComponent,
    InputToggleComponent,
    DynamicControlComponent,
    DynamicFilterComponent,
    DynamicFormComponent,
    RangeControlComponent,
  ],
  exports: [
    QueryBuilderComponent,
    QueryInputDirective,
    QueryOperatorDirective,
    QueryFieldDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    AgeFilterComponent,
    ExtendedFilterComponent,
    InputToggleComponent,
    DynamicControlComponent,
    DynamicFilterComponent,
    DynamicFormComponent,
    RangeControlComponent,
  ],
})
export class QueryBuilderModule {}
