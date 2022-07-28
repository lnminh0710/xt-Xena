import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { GlobalSearchActions } from 'app/state-management/store/actions';
import { CustomAction } from 'app/state-management/store/actions/base';
import { LocalStorageKey } from 'app/app.constants';
import { Uti } from 'app/utilities';

@Injectable()
export class GlobalSearchEffects {

    constructor(
        private store: Store<AppState>,
        private update$: Actions
    ) {
    }

    @Effect({ dispatch: false })
    storeActions = this.update$
        .ofType<CustomAction>(
            GlobalSearchActions.SEARCH_KEYWORD,
            GlobalSearchActions.CHANGE_MODULE_TAB,
            GlobalSearchActions.ACTIVE_MODULE_TAB,
            GlobalSearchActions.CLOSE_MODULE_TAB,
            GlobalSearchActions.CLOSE_POPUP,
            GlobalSearchActions.MENU_CONTEXT_ACTION,
            GlobalSearchActions.ROW_DOUBLE_CLICK
        )
        .map((action: any) => {
            let newActions = [action];
            localStorage.setItem(LocalStorageKey.buildKey(LocalStorageKey.LocalStorageGSStepKey, Uti.defineBrowserTabId()), JSON.stringify(newActions));
        });

    // Change this to `dispatch: true` to sync state with actions
    @Effect({ dispatch: true })
    onChange = Observable.fromEvent<StorageEvent>(window, 'storage').filter((evt) => {
        return evt.key == LocalStorageKey.buildKey(LocalStorageKey.LocalStorageGSStepKey, Uti.defineBrowserTabId()) && evt.newValue !== null && evt.newValue != 'undefined';
    }).map(evt => {
        const [{ type, payload, browserTabId }] = JSON.parse(evt.newValue);

        if (browserTabId && browserTabId != Uti.defineBrowserTabId()) return;

        switch (type) {
            case GlobalSearchActions.SEARCH_KEYWORD:
                return { type: GlobalSearchActions.SEARCH_KEYWORD_STORAGE, payload, browserTabId };
            case GlobalSearchActions.CHANGE_MODULE_TAB:
                return { type: GlobalSearchActions.CHANGE_MODULE_TAB_STORAGE, payload, browserTabId };
            case GlobalSearchActions.CLOSE_MODULE_TAB:
                return { type: GlobalSearchActions.CLOSE_MODULE_TAB_STORAGE, payload, browserTabId };
            case GlobalSearchActions.ACTIVE_MODULE_TAB:
                return { type: GlobalSearchActions.ACTIVE_MODULE_TAB_STORAGE, payload, browserTabId };
            case GlobalSearchActions.CLOSE_POPUP:
                return { type: GlobalSearchActions.CLOSE_POPUP_STORAGE, payload, browserTabId };
            case GlobalSearchActions.MENU_CONTEXT_ACTION:
                return { type: GlobalSearchActions.MENU_CONTEXT_ACTION_STORAGE, payload, browserTabId };
            case GlobalSearchActions.ROW_DOUBLE_CLICK:
                return { type: GlobalSearchActions.ROW_DOUBLE_CLICK_STORAGE, payload, browserTabId };
            default:
                return null;
        }
    });

}
