import { Action, ActionReducer } from '@ngrx/store';
import { WidgetDetail, LightWidgetDetail } from 'app/models';
import { WidgetDetailActions } from 'app/state-management/store/actions/widget-content-detail';
import { CustomAction } from 'app/state-management/store/actions/base';
import * as baseReducer from 'app/state-management/store/reducer/reducer.base';
import { Uti } from 'app/utilities';
import { LocalStorageKey } from 'app/app.constants';

export interface RowData {
    data?: any;
    widgetDetail?: LightWidgetDetail;
}

export interface EditingWidget {
    widgetDetail?: LightWidgetDetail;
    pageId?: string;
    selectedEntity?: any;
    tabId?: string;
}

export interface WidgetDataUpdated {
    widgetDetail?: LightWidgetDetail;
    updateInfo?: any;
    // True: will find parent and reload parent widget
    isReloadForParent?: boolean;
    isSelfUpdated?: boolean;
}

export interface RelatingWidget {
    mode: string;
    scrWidgetDetail?: WidgetDetail;
    // Connected widgets with scrWidgetDetail
    relatingWidgetIds: Array<string>;
}

export interface SubWidgetDetailState {
    rowData: RowData;
    rowsData: any[];
    rowCampaignMediaMainData_T2: RowData;
    widgetDataUpdated: WidgetDataUpdated;
    editingWidgets: Array<EditingWidget>;
    relatingWidget: RelatingWidget;
    requestSave: any;
    requestReload: any;
    isEditAllWidgetMode: boolean;
    activeWidget: LightWidgetDetail;
}

export const initialSubWidgetDetailState: SubWidgetDetailState = {
    rowData: null,
    rowsData: [],
    rowCampaignMediaMainData_T2: null,
    widgetDataUpdated: null,
    editingWidgets: [],
    relatingWidget: null,
    requestSave: null,
    requestReload: null,
    isEditAllWidgetMode: false,
    activeWidget: null
};

export interface WidgetDetailState {
    features: { [id: string]: SubWidgetDetailState }
}

const initialState: WidgetDetailState = {
    features: {}
};

export function widgetDetailStateReducer(state = initialState, action: CustomAction): WidgetDetailState {
    let feature = baseReducer.getFeature(action, state, initialSubWidgetDetailState);

    switch (action.type) {
        case WidgetDetailActions.LOAD_WIDGET_TYPE_DETAIL: {
            state = baseReducer.updateStateData(action, feature, state, {
                rowData: action.payload
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.CLEAR_WIDGET_TYPE_DETAIL: {
            state = baseReducer.updateStateData(action, feature, state, {
                rowData: null
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.LOAD_WIDGET_TABLE_DATA_ROWS: {
            let result = [];
            if (!feature.rowsData || !feature.rowsData.length) {
                result.push(action.payload);
            } else {
                let exist = false;
                result = feature.rowsData;
                result.forEach(x => {
                    if (action.payload.widgetDetail && x.widgetDetail && action.payload.widgetDetail.id == x.widgetDetail.id
                        //    x.widgetDetailId == action.payload.widgetDetailId
                    ) {
                        x.rowData = action.payload.rowData;
                        exist = true;
                        return;
                    }
                });
                if (!exist) {
                    result.push(action.payload);
                }
            }

            state = baseReducer.updateStateData(action, feature, state, {
                rowsData: Object.assign([], result)
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.CLEAR_WIDGET_TABLE_DATA_ROWS: {
            let newRowsData = feature.rowsData.length ? feature.rowsData.filter(r => r.widgetDetail && r.widgetDetail.id !== action.payload.id) : [];
            state = baseReducer.updateStateData(action, feature, state, {
                rowsData: newRowsData
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.LOAD_WIDGET_TYPE_DETAIL_FOR_CAMPAIGN_MEDIA: {
            state = baseReducer.updateStateData(action, feature, state, {
                [`rowCampaignMediaMainData_${action.area}`] :action.payload 
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.CLEAR_WIDGET_TYPE_DETAIL_FOR_CAMPAIGN_MEDIA: {
            state = baseReducer.updateStateData(action, feature, state, {
                [`rowCampaignMediaMainData_${action.area}`] : null 
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.SYNC_UPDATE_DATA_WIDGET: {
            state = baseReducer.updateStateData(action, feature, state, {
                widgetDataUpdated: action.payload
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.ADD_WIDGET_EDITING: {
            const editingWidgetPayload: EditingWidget = action.payload;
            let isExists: boolean;
            if (feature.editingWidgets && feature.editingWidgets.length > 0) {
                const rs = feature.editingWidgets.filter(p => p.widgetDetail.id == editingWidgetPayload.widgetDetail.id);
                if (rs.length > 0) {
                    isExists = true;
                }
            }
            if (!isExists) {
                state = baseReducer.updateStateData(action, feature, state, {
                    editingWidgets: [...feature.editingWidgets, ...action.payload]
                });
                return Object.assign({}, state);
            }
            return state;
        }
        case WidgetDetailActions.CANCEL_WIDGET_EDITING: {
            const editingWidgetPayload: EditingWidget = action.payload;
            let editingWigetFilter: Array<EditingWidget> = [];
            if (feature.editingWidgets && feature.editingWidgets.length > 0) {
                editingWigetFilter = feature.editingWidgets.filter(p => p.widgetDetail.id != editingWidgetPayload.widgetDetail.id);
            }
            state = baseReducer.updateStateData(action, feature, state, {
                editingWidgets: [...editingWigetFilter]
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.REQUEST_SAVE: {
            state = baseReducer.updateStateData(action, feature, state, {
                requestSave: {}
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.CLEAR_REQUEST_SAVE: {
            state = baseReducer.updateStateData(action, feature, state, {
                requestSave: null
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.REQUEST_RELOAD: {
            state = baseReducer.updateStateData(action, feature, state, {
                requestReload: {}
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.CLEAR_REQUEST_RELOAD: {
            state = baseReducer.updateStateData(action, feature, state, {
                requestReload: null
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.CANCEL_ALL_WIDGET_EDITING: {
            state = baseReducer.updateStateData(action, feature, state, {
                editingWidgets: []
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.HOVER_AND_DISPLAY_RELATING_WIDGET: {
            state = baseReducer.updateStateData(action, feature, state, {
                relatingWidget: action.payload
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.TOGGLE_EDIT_ALL_WIDGET_MODE: {
            state = baseReducer.updateStateData(action, feature, state, {
                isEditAllWidgetMode: action.payload
            });
            return Object.assign({}, state);
        }
        case WidgetDetailActions.ACTIVE_WIDGET: {
            state = baseReducer.updateStateData(action, feature, state, {
                activeWidget: action.payload ? new LightWidgetDetail(action.payload) : null
            });
            return Object.assign({}, state);
        }
        default: {
            return state;
        }
    }
}

export function persistWidgetDetailStateReducer(_reducer: ActionReducer<WidgetDetailState>) {
    return (state: WidgetDetailState | undefined, action: Action) => {
        const nextState = _reducer(state, action);
        switch (action.type) {
            case WidgetDetailActions.LOAD_WIDGET_TABLE_DATA_ROWS:
            case WidgetDetailActions.CLEAR_WIDGET_TYPE_DETAIL: 
            case WidgetDetailActions.LOAD_WIDGET_TABLE_DATA_ROWS:
            case WidgetDetailActions.CLEAR_WIDGET_TABLE_DATA_ROWS:
            case WidgetDetailActions.SYNC_UPDATE_DATA_WIDGET:
                if (location.pathname != "/search" && location.pathname != "/widget") {
                    //TODO: enhance, only save the necessary state
                    nextState['browserTabId'] = Uti.defineBrowserTabId();
                    localStorage.setItem(LocalStorageKey.buildKey(LocalStorageKey.LocalStorageWidgetContentDetailKey, nextState['browserTabId']), JSON.stringify(nextState));
                }
                break;
        }
        return nextState;
    };
}


export function updatewidgetDetailStaeReducer(_reducer: ActionReducer<WidgetDetailState>) {
    return (state: WidgetDetailState | undefined, action: Action) => {
        if (action.type === WidgetDetailActions.UPDATE_WIDGET_CONTENT_STATE_FROM_LOCAL_STORAGE) {
            return (<any>action).payload;
        }
        return _reducer(state, action);
    };
}

export function widgetDetailReducer(state = initialState, action: CustomAction): WidgetDetailState {
    return updatewidgetDetailStaeReducer(persistWidgetDetailStateReducer(widgetDetailStateReducer))(state, action);
};
