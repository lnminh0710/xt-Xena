import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabBusinessCostStatusComponent } from './tab-business-cost-status.component';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';

@NgModule({
  imports: [CommonModule, LabelTranslationModule, XnResourceTranslationModule],
  declarations: [TabBusinessCostStatusComponent],
  exports: [TabBusinessCostStatusComponent],
})
export class TabBusinessCostStatusModule {}
