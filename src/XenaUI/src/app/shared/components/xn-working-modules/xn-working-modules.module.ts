import { NgModule } from '@angular/core';
import { XnWorkingModulesComponent } from './xn-working-modules/xn-working-modules.component';
import { XnWorkingModulesParkedItemsComponent } from './xn-working-modules-parked-items';
import { CommonModule } from '@angular/common';
import { ParkedItemModule } from 'app/shared/components/parked-item/parked-item.module';
import { XnDragDropModule } from 'app/shared/directives/xn-dragable/xn-dragable.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LabelTranslationModule } from '../label-translation/label-translation.module';
import { XnResourceTranslationModule } from '../../directives/xn-resource-translation';

@NgModule({
  imports: [
    CommonModule,
    ParkedItemModule,
    XnDragDropModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
    PerfectScrollbarModule.forRoot(),
  ],
  declarations: [
    XnWorkingModulesComponent,
    XnWorkingModulesParkedItemsComponent,
  ],
  exports: [XnWorkingModulesComponent],
  providers: [],
})
export class XnWorkingModulesModule {}
