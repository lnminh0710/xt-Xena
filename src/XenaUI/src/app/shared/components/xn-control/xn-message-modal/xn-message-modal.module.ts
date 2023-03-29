import { NgModule } from '@angular/core';
import { XnMessageModalComponent } from './xn-message-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal/modal.module';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/components/xn-control/light-material-ui/material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnPipeModule } from 'app/shared/components/xn-control/xn-pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ModalModule,
    PerfectScrollbarModule,
    LabelTranslationModule,
    XnPipeModule,
  ],
  declarations: [XnMessageModalComponent],
  exports: [XnMessageModalComponent],
})
export class XnMessageModalModule {}
