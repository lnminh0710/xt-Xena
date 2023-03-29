import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NotificationBoxComponent } from './notification-box.component';
import { XnNotificationModule } from '../xn-notification/xn-notification.module';
import { XnTooltipModule } from 'app/shared/directives/xn-tooltip/xn-tooltip.module';
@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    XnNotificationModule,
    XnTooltipModule,
  ],
  declarations: [NotificationBoxComponent],
  exports: [NotificationBoxComponent],
})
export class NotificationBoxModule {}
