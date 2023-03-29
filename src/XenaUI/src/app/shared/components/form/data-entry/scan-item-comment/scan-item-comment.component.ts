import {
  Component,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnDestroy,
  EventEmitter,
  DoCheck,
  KeyValueDiffers,
} from '@angular/core';
import { DataEntryFormBase } from '../data-entry-form-base';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { AppErrorHandler } from 'app/services';
import { Router } from '@angular/router';
import { ScanItemCommentModel } from 'app/models';
import { Uti } from 'app/utilities';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'scan-item-comment',
  styleUrls: ['./scan-item-comment.component.scss'],
  templateUrl: './scan-item-comment.component.html',
})
export class ScanItemCommentComponent
  extends DataEntryFormBase
  implements OnInit, OnDestroy, DoCheck
{
  @Input() tabID: string;

  public comment: string;

  private differ: any;
  private scanningStatusDataState: Observable<any[]>;
  private scanningStatusDataStateSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private appErrorHandler: AppErrorHandler,
    protected router: Router,
    private differs: KeyValueDiffers
  ) {
    super(router, {
      defaultTranslateText: 'scanItemComment',
      emptyData: new ScanItemCommentModel(),
    });

    this.scanningStatusDataState = store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).scanningStatusData
    );

    this.differ = this.differs.find({}).create();
  }

  public ngOnInit() {
    this.subscribeScanningStatusDataState();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item) => {});
    }
  }

  private processDatasource(datasource) {}

  public rebuildTranslateText() {
    this.rebuildTranslateTextSelf();
  }

  private subscribeScanningStatusDataState() {
    this.scanningStatusDataStateSubscription =
      this.scanningStatusDataState.subscribe(
        (scanningStatusDataState: any[]) => {
          this.appErrorHandler.executeAction(() => {
            if (scanningStatusDataState) {
              if (scanningStatusDataState.length) {
                this.comment = scanningStatusDataState[0].notes;
              } else {
                this.comment = '';
              }
            }
          });
        }
      );
  }
}
