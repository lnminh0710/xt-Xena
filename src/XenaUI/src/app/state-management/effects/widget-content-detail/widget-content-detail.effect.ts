import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { GlobalSearchActions, WidgetDetailActions } from 'app/state-management/store/actions';
import { CustomAction } from 'app/state-management/store/actions/base';
import { LocalStorageKey } from 'app/app.constants';
import { Uti } from 'app/utilities';

@Injectable()
export class WidgetContentDetailEffects {

    constructor(
        private store: Store<AppState>,
        private update$: Actions
    ) {
    }

    @Effect({ dispatch: false })
    storeActions = this.update$
        .ofType<CustomAction>(
            WidgetDetailActions.REQUEST_RELOAD_WIDGET
        )
        .map((action: any) => {
            // let newActions = [action];
            action.timestamp = new Date().getTime();
            localStorage.setItem(LocalStorageKey.buildKey(LocalStorageKey.LocalStorageWidgetActionKey, Uti.defineBrowserTabId()), JSON.stringify(action));
        });
}
