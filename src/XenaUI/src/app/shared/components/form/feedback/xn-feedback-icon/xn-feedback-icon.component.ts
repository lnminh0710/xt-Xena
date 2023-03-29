import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import {
  XnCommonActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { Subscription } from 'rxjs/Subscription';
import { AppErrorHandler } from 'app/services';
import { Uti } from 'app/utilities';
@Component({
  selector: 'xn-feedback-icon',
  styleUrls: ['./xn-feedback-icon.component.scss'],
  templateUrl: './xn-feedback-icon.component.html',
  host: {
    '(window:resize)': 'onWindowResize($event)',
  },
})
export class XnFeedbackIconComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  static isResizeCounter: number = 0;
  public isFeedbackLoading = false;

  private showFeedbackCompleteSubscription: Subscription;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<AppState>,
    private dispatcher: ReducerManagerDispatcher,
    private appErrorHandler: AppErrorHandler,
    private xnCommonActions: XnCommonActions,
    router?: Router
  ) {
    super(router);
  }
  public ngOnInit() {
    this.subscribeShowFeedbackCompleteState();
  }
  public ngAfterViewInit() {
    setTimeout(() => {
      this.onWindowResize();
    }, 15000);
  }
  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }
  public feedbackClicked() {
    this.isFeedbackLoading = true;
    this.changeDetectorRef.detectChanges();
    this.store.dispatch(this.xnCommonActions.showFeedbackClicked(true));
    this.store.dispatch(
      this.xnCommonActions.storeFeedbacData({
        isSendToAdmin: false,
        tabID: null,
      })
    );
  }
  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/

  private subscribeShowFeedbackCompleteState() {
    this.showFeedbackCompleteSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === XnCommonActions.SHOW_FEEDBACK_COMPLETE;
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.isFeedbackLoading = false;
          this.changeDetectorRef.markForCheck();
        });
      });
  }
  private onWindowResize(event?: any, underIcon?: any) {
    XnFeedbackIconComponent.isResizeCounter++;
    if (XnFeedbackIconComponent.isResizeCounter === 1) return;
    setTimeout(() => {
      const underIcon = $('#xn-feedback-under-icon');
      underIcon.addClass('xn-feedback-hidden');
      if (!underIcon || !underIcon.length) return;
      const position = underIcon.offset();
      let topIcon = $('#xn-feedback-top-icon');
      if (!topIcon || !topIcon.length) return;

      topIcon.css('opacity', 1);
      topIcon.css('top', position.top);
      topIcon.css('left', position.left);
    }, 200);
  }
}
