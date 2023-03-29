import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
@Component({
  selector: 'notification-archive-popup',
  styleUrls: ['./notification-archive-popup.component.scss'],
  templateUrl: './notification-archive-popup.component.html',
})
export class NotificationArchivePopupComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  @Input() isShow: boolean = false;
  @Input() typeArchive: string = '';

  @Output() showDetailAction = new EventEmitter<any>();
  @Output() closeArchivePopupAction = new EventEmitter<any>();
  constructor(router?: Router) {
    super(router);
  }
  public ngOnInit() {}
  public ngOnDestroy() {}
  public close() {
    this.closeArchivePopupAction.emit();
  }
  public showDetailActionHandler($event: any) {
    this.showDetailAction.emit($event);
  }
  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/
}
