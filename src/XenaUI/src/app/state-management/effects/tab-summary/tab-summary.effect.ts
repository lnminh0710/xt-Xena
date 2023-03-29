import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { TabSummaryActions } from 'app/state-management/store/actions';
import { TabService } from 'app/services';
import { ApiResultResponse, Module } from 'app/models';
import { Uti } from 'app/utilities/uti';
import { CustomAction } from 'app/state-management/store/actions/base';

@Injectable()
export class TabSummaryEffects {
  private module: Module;

  constructor(
    private update$: Actions,
    private tabSummaryActions: TabSummaryActions,
    private tabService: TabService
  ) {}

  @Effect() loadTabs$ = this.update$
    .ofType<CustomAction>(TabSummaryActions.LOAD_TABS)
    .map((action) => {
      this.module = action.payload.module;
      return action.payload;
    })
    .switchMap((param) => this.tabService.getTabSummaryInfor(param))
    .map((response: ApiResultResponse) => {
      if (!Uti.isResquestSuccess(response)) {
        return;
      }
      return this.tabSummaryActions.loadTabsSuccess(response.item, this.module);
    });
}
