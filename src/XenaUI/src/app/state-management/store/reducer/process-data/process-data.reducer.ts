import { Action, ActionReducer } from "@ngrx/store";
import { ProcessDataActions } from "app/state-management/store/actions/process-data";
import { CustomAction } from "app/state-management/store/actions/base";
import * as baseReducer from "app/state-management/store/reducer/reducer.base";
import { SearchResultItemModel } from "app/models";
import { Uti } from "app/utilities";
import { LocalStorageKey } from "app/app.constants";

export interface SubProcessDataState {
    viewMode: any;
    isViewMode: boolean;
    formOutputData: any;
    formValid: boolean;
    formDirty: boolean;
    requestSave: any;
    saveMainTabResult: any;
    saveOtherTabResult: any;
    saveOnlyMainTabResult: any;
    saveOnlyOtherTabResult: any;
    formEditMode: boolean;
    formCloneMode: boolean;
    formEditData: any;
    selectedEntity: any;
    selectedSearchResult: SearchResultItemModel;
    disableTabHeaderFormData: any;
    selectedGoToModuleItem: any;
    toggleDashboardLoading: any;
    contentDisplayMode: string;
}

export const initialSubProcessDataState: SubProcessDataState = {
    viewMode: null,
    isViewMode: true,
    formOutputData: null,
    formValid: false,
    formDirty: false,
    requestSave: null,
    saveMainTabResult: null,
    saveOtherTabResult: null,
    saveOnlyMainTabResult: null,
    saveOnlyOtherTabResult: null,
    formEditMode: false,
    formCloneMode: false,
    formEditData: null,
    selectedEntity: null,
    selectedSearchResult: null,
    disableTabHeaderFormData: null,
    selectedGoToModuleItem: null,
    toggleDashboardLoading: null,
    contentDisplayMode: "ViewMode",
};

export interface ProcessDataState {
    features: { [id: string]: SubProcessDataState };
}

const initialState: ProcessDataState = {
    features: {},
};

export function processDataStateReducer(
    state = initialState,
    action: CustomAction
): ProcessDataState {
    let feature = baseReducer.getFeature(
        action,
        state,
        initialSubProcessDataState
    );

    switch (action.type) {
        case ProcessDataActions.VIEW_MODE: {
            state = baseReducer.updateStateData(action, feature, state, {
                viewMode: {},
                isViewMode: true,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.EDIT_MODE: {
            state = baseReducer.updateStateData(action, feature, state, {
                isViewMode: false,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.FORM_OUTPUT_DATA: {
            state = baseReducer.updateStateData(action, feature, state, {
                formOutputData: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.FORM_VALID: {
            state = baseReducer.updateStateData(action, feature, state, {
                formValid: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.FORM_DIRTY: {
            state = baseReducer.updateStateData(action, feature, state, {
                formDirty: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.SAVE_MAIN_TAB_RESULT: {
            state = baseReducer.updateStateData(action, feature, state, {
                saveMainTabResult: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.SAVE_OTHER_TAB_RESULT: {
            state = baseReducer.updateStateData(action, feature, state, {
                saveOtherTabResult: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.SAVE_ONLY_MAIN_TAB_RESULT: {
            state = baseReducer.updateStateData(action, feature, state, {
                saveOnlyMainTabResult: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.SAVE_ONLY_OTHER_TAB_RESULT: {
            state = baseReducer.updateStateData(action, feature, state, {
                saveOnlyOtherTabResult: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.TURN_ON_FORM_EDIT_MODE: {
            state = baseReducer.updateStateData(action, feature, state, {
                formEditMode: true,
                formEditData: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.TURN_OFF_FORM_EDIT_MODE: {
            state = baseReducer.updateStateData(action, feature, state, {
                formEditMode: false,
                formEditData: null,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.TURN_ON_FORM_CLONE_MODE: {
            state = baseReducer.updateStateData(action, feature, state, {
                formCloneMode: true,
                formEditData: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.TURN_OFF_FORM_CLONE_MODE: {
            state = baseReducer.updateStateData(action, feature, state, {
                formCloneMode: false,
                formEditData: null,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.CLEAR_SAVE_RESULT: {
            state = baseReducer.updateStateData(action, feature, state, {
                saveMainTabResult: null,
                saveOtherTabResult: null,
                saveOnlyMainTabResult: null,
                saveOnlyOtherTabResult: null,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.SET_SELECTED_ENTITY: {
            let selectedEntity = action.payload.entity;
            if (selectedEntity) {
                if (action.payload.isParkedItem) {
                    selectedEntity = formatParkedItemEntity(
                        selectedEntity,
                        action.payload.modulePrimaryKey
                    );
                } else if (!selectedEntity.hasOwnProperty("id")) {
                    selectedEntity["id"] =
                        selectedEntity[action.payload.modulePrimaryKey];
                }
            }
            state = baseReducer.updateStateData(action, feature, state, {
                selectedEntity: selectedEntity,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.SELECT_SEARCH_RESULT: {
            state = baseReducer.updateStateData(action, feature, state, {
                selectedSearchResult: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.CLEAR_SEARCH_RESULT: {
            state = baseReducer.updateStateData(action, feature, state, {
                selectedSearchResult: null,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.SET_DISABLE_TAB_HEADER: {
            state = baseReducer.updateStateData(action, feature, state, {
                disableTabHeaderFormData: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.SELECT_GOTO_MODULE_ITEM: {
            state = baseReducer.updateStateData(action, feature, state, {
                selectedGoToModuleItem: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.CLEAR_GOTO_MODULE_ITEM: {
            state = baseReducer.updateStateData(action, feature, state, {
                selectedGoToModuleItem: null,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.TOGGLE_DASHBOARD_LOADING: {
            state = baseReducer.updateStateData(action, feature, state, {
                toggleDashboardLoading: action.payload,
            });
            return Object.assign({}, state);
        }

        case ProcessDataActions.SET_CONTENT_DISPLAY_MODE: {
            state = baseReducer.updateStateData(action, feature, state, {
                contentDisplayMode: action.payload,
            });
            return Object.assign({}, state);
        }

        default: {
            return state;
        }
    }
}

function formatParkedItemEntity(entity, modulePrimaryKey) {
    let result: any = {};
    Object.keys(entity).forEach((key) => {
        if (typeof entity[key] === "object" && entity[key]) {
            result[key] = entity[key]["value"];
        } else {
            result[key] = entity[key];
        }
    });

    if (!result.hasOwnProperty("id")) {
        result["id"] = result[modulePrimaryKey];
    }

    result["selectedParkedItem"] = entity;

    return result;
}

export function persistProcessDataStateReducer(
    _reducer: ActionReducer<ProcessDataState>
) {
    return (state: ProcessDataState | undefined, action: CustomAction) => {
        const nextState = _reducer(state, action);
        switch (action.type) {
            case ProcessDataActions.SET_SELECTED_ENTITY:
            case ProcessDataActions.SELECT_SEARCH_RESULT:
                //console.log(location.pathname);
                if (location.pathname != "/search") {
                    //TODO: enhance, only save the necessary state
                    nextState["browserTabId"] = Uti.defineBrowserTabId();
                    localStorage.setItem(
                        LocalStorageKey.buildKey(
                            LocalStorageKey.LocalStorageGSProcessDataKey,
                            nextState["browserTabId"]
                        ),
                        JSON.stringify(nextState)
                    );
                }
                break;
            case ProcessDataActions.SET_GRID_ITEM_DATA_TO_LOCAL_STORAGE:
                const data = {
                    browserTabId: Uti.defineBrowserTabId(),
                    data: action.payload,
                };
                localStorage.setItem(
                    LocalStorageKey.buildKey(
                        LocalStorageKey.LocalStorageWidgetRowDataFromPopup,
                        nextState["browserTabId"]
                    ),
                    JSON.stringify(data)
                );
                break;
        }
        return nextState;
    };
}

export function updateProcessDataStateReducer(
    _reducer: ActionReducer<ProcessDataState>
) {
    return (state: ProcessDataState | undefined, action: Action) => {
        if (
            action.type ===
            ProcessDataActions.UPDATE_PROCESS_DATA_STATE_FROM_LOCAL_STORAGE
        ) {
            return (<any>action).payload;
        }
        return _reducer(state, action);
    };
}

export function processDataReducer(
    state = initialState,
    action: CustomAction
): ProcessDataState {
    return updateProcessDataStateReducer(
        persistProcessDataStateReducer(processDataStateReducer)
    )(state, action);
}
