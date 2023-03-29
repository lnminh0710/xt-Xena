import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { Uti } from 'app/utilities';
import { SyncModeConstant } from 'app/models/elastic-search.mode';
@Component({
  selector: 'elastic-search-sync-command',
  styleUrls: ['./elastic-search-sync-command.component.scss'],
  templateUrl: './elastic-search-sync-command.component.html',
})
export class ElasticSearchSyncCommandComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public SYNC_MODE_CONSTANT = SyncModeConstant;

  private isStopped = true;
  private defaultTimeRemaining = 300;

  public timeRemaining: number = this.defaultTimeRemaining;
  public progressBarValue: number = 0;
  public syncMode: string = this.SYNC_MODE_CONSTANT.all;
  public syncModeList: Array<any> = [
    {
      idValue: this.SYNC_MODE_CONSTANT.all,
      textValue: 'All',
    },
    {
      idValue: this.SYNC_MODE_CONSTANT.currentDate,
      textValue: 'Current Date',
    },
    {
      idValue: this.SYNC_MODE_CONSTANT.byId,
      textValue: 'By Id',
    },
  ];
  public syncIdString: string = '';

  @Input() isIdle: boolean = true;
  @Input() set percentValue(data: number) {
    this.executePercentValue(data);
  }

  @Output() output: EventEmitter<any> = new EventEmitter();
  @Output() updateSyncIds: EventEmitter<any> = new EventEmitter();
  @Output() callStart: EventEmitter<any> = new EventEmitter();
  @Output() callStop: EventEmitter<any> = new EventEmitter();

  constructor(private ref: ChangeDetectorRef, router?: Router) {
    super(router);
  }

  public ngOnInit() {}

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public onSyncModeChanged() {
    this.output.emit(this.syncMode);
  }

  public onUpdateSyncIds() {
    this.updateSyncIds.emit(this.syncIdString);
  }

  public startStop() {
    if (this.isIdle) {
      this.start();
      return;
    }
    this.stop();
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/

  private start() {
    this.progressBarValue = 0;
    this.ref.detectChanges();
    this.callStart.emit();
  }

  private stop() {
    this.isStopped = true;
    this.callStop.emit();
    this.timeRemaining = this.defaultTimeRemaining;
  }

  private executePercentValue(data: number) {
    this.progressBarValue = data;
    this.ref.detectChanges();
  }
}
