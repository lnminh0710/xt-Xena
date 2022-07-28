import { Action, ActionReducer } from '@ngrx/store';
import { GlobalSearchActions } from 'app/state-management/store/actions';
import { CustomAction } from 'app/state-management/store/actions/base';
import * as baseReducer from 'app/state-management/store/reducer/reducer.base';
import { TabModel, Module } from 'app/models';
import { LocalStorageKey } from 'app/app.constants';
import { Uti } from 'app/utilities';

export interface GlobalSearchState {
    tabs: Array<TabModel>
}

export const initialState: GlobalSearchState = {
    tabs: null
};

export function globalSearchReducer(state = initialState, action: CustomAction): GlobalSearchState {
    switch (action.type) {
        case GlobalSearchActions.UPDATE_TAB: {
            return Object.assign({}, state, { tabs: action.payload });
        }        
    }
};

export function persistStateReducer(_reducer: ActionReducer<GlobalSearchState>) {
    return (state: GlobalSearchState | undefined, action: Action) => {
        const nextState = _reducer(state, action);
        switch (action.type) {
            case GlobalSearchActions.UPDATE_TAB:
                localStorage.setItem(LocalStorageKey.buildKey(LocalStorageKey.LocalStorageGSTabKey, Uti.defineBrowserTabId()), JSON.stringify({
                    tabs: nextState.tabs
                }));
                break;
        }
        return nextState;
    };
}

export function updateStateReducer(_reducer: ActionReducer<GlobalSearchState>) {
    return (state: GlobalSearchState | undefined, action: Action) => {
        if (action.type === GlobalSearchActions.UPDATE_GLOBAL_SEARCH_STATE_FROM_LOCAL_STORAGE) {
            return (<any>action).payload;
        }
        return _reducer(state, action);
    };
}

export function globalSearchStateReducer(state = initialState, action: CustomAction): GlobalSearchState {
    return updateStateReducer(persistStateReducer(globalSearchReducer))(state, action);
};
