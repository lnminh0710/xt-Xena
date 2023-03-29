import { Action, ActionReducer } from '@ngrx/store';
import { PropertyPanelActions } from 'app/state-management/store/actions';
import {
  WidgetPropertyModel,
  WidgetPropertiesStateModel,
  LightWidgetDetail,
} from 'app/models';
import cloneDeep from 'lodash-es/cloneDeep';
import { CustomAction } from 'app/state-management/store/actions/base';
import * as baseReducer from 'app/state-management/store/reducer/reducer.base';
import { Uti } from 'app/utilities';
import { LocalStorageKey } from 'app/app.constants';

export interface SubPropertyPanelState {
  isExpand: boolean;
  isGlobal: boolean;
  propertiesParentData: any;
  globalProperties: any;
  properties: any;
  requestSave: any;
  requestUpdateProperties: WidgetPropertiesStateModel;
  tempProperties: any;
  requestRollbackProperties: any;
  requestApply: any;
  requestSaveGlobal: any;
}

export const initialSubPropertyPanelState: SubPropertyPanelState = {
  isExpand: false,
  isGlobal: false,
  propertiesParentData: null,
  globalProperties: [],
  properties: null,
  requestSave: null,
  requestUpdateProperties: null,
  tempProperties: null,
  requestRollbackProperties: null,
  requestApply: null,
  requestSaveGlobal: null,
};

export interface PropertyPanelState {
  features: { [id: string]: SubPropertyPanelState };
}

const initialState: PropertyPanelState = {
  features: {},
};

export function propertyPanelStateReducer(
  state = initialState,
  action: CustomAction
): PropertyPanelState {
  let feature = baseReducer.getFeature(
    action,
    state,
    initialSubPropertyPanelState
  );

  switch (action.type) {
    case PropertyPanelActions.TOGGLE_PANEL: {
      state = baseReducer.updateStateData(action, feature, state, {
        isExpand: action.payload.isExpand,
        isGlobal: action.payload.isGlobal,
        propertiesParentData: action.payload.propertiesParentData || null,
        properties: action.payload.properties || [],
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.UPDATE_GLOBAL_PROPERTY: {
      state = baseReducer.updateStateData(action, feature, state, {
        globalProperties: cloneDeep(action.payload),
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.CLEAR_PROPERTIES: {
      state = baseReducer.updateStateData(action, feature, state, {
        isExpand: false,
        isGlobal: false,
        propertiesParentData: null,
        properties: null,
        requestSave: null,
        requestUpdateProperties: null,
        requestSaveGlobal: null,
        requestRollbackProperties: null,
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.REQUEST_ROLLBACK_PROPERTIES: {
      state = baseReducer.updateStateData(action, feature, state, {
        requestRollbackProperties: action.payload,
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.REQUEST_SAVE: {
      state = baseReducer.updateStateData(action, feature, state, {
        requestSave: {
          propertiesParentData: action.payload,
        },
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.REQUEST_SAVE_GLOBAL: {
      state = baseReducer.updateStateData(action, feature, state, {
        requestSaveGlobal: {
          globalProperties: action.payload,
        },
        globalProperties: cloneDeep(action.payload),
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.REQUEST_APPLY: {
      state = baseReducer.updateStateData(action, feature, state, {
        requestApply: {
          propertiesParentData: action.payload,
        },
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.UPDATE_PROPERTIES: {
      const payload = action.payload as WidgetPropertiesStateModel;
      state = baseReducer.updateStateData(action, feature, state, {
        requestUpdateProperties: {
          widgetData: payload
            ? new LightWidgetDetail(payload.widgetData)
            : null,
          widgetProperties: payload ? payload.widgetProperties : null,
        },
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.UPDATE_TEMP_PROPERTIES: {
      const payload = action.payload as WidgetPropertiesStateModel;
      state = baseReducer.updateStateData(action, feature, state, {
        tempProperties: payload,
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.CLEAR_REQUEST_UPDATE_PROPERTIES: {
      state = baseReducer.updateStateData(action, feature, state, {
        requestUpdateProperties: null,
      });
      return Object.assign({}, state);
    }

    case PropertyPanelActions.CHECK_DIRTY_PROPERTIES_OF_WIDGET: {
      state = baseReducer.updateStateData(action, feature, state, {
        isDirty: action.payload,
      });
      return Object.assign({}, state);
    }

    default: {
      return state;
    }
  }
}

export function persistPropertyPanelStateReducer(
  _reducer: ActionReducer<PropertyPanelState>
) {
  return (state: PropertyPanelState | undefined, action: Action) => {
    const nextState = _reducer(state, action);
    const moduleName = action['module'] && action['module'].moduleNameTrim;
    const isGlobalProperties =
      nextState['features'][moduleName] &&
      nextState['features'][moduleName].isGlobal;
    switch (action.type) {
      case PropertyPanelActions.REQUEST_APPLY:
      case PropertyPanelActions.REQUEST_SAVE:
      case PropertyPanelActions.REQUEST_SAVE_GLOBAL:
      case PropertyPanelActions.UPDATE_PROPERTIES:
        if (location.pathname != '/widget') {
          nextState['browserTabId'] = Uti.defineBrowserTabId();
          const requestSaveGlobal =
            nextState['features'][moduleName].requestSaveGlobal;
          const requestUpdateProperties =
            nextState['features'][moduleName].requestUpdateProperties;
          // if (moduleName === 'Base' && requestSaveGlobal && requestSaveGlobal.globalProperties) {
          //                     //     nextState['features'][moduleName].globalProperties = {
          //                     //         ...Uti.filterValueWhenSaveWidget(requestSaveGlobal.globalProperties),
          //                     //         moduleName
          //                     //     };
          //                     // }

          if (
            requestUpdateProperties &&
            requestUpdateProperties.widgetProperties
          ) {
            nextState['features'][moduleName].properties = {
              ...Uti.filterValueWhenSaveWidget(
                requestUpdateProperties.widgetProperties
              ),
              moduleName,
            };
          }
          localStorage.setItem(
            LocalStorageKey.buildKey(
              LocalStorageKey.LocalStorageWidgetPropertyKey,
              nextState['browserTabId']
            ),
            JSON.stringify(nextState)
          );
        }
        break;
      case PropertyPanelActions.UPDATE_TEMP_PROPERTIES:
        if (location.pathname != '/widget') {
          nextState['browserTabId'] = Uti.defineBrowserTabId();
          nextState['features'][moduleName].tempProperties = {
            ...Uti.filterValueWhenSaveWidget(
              nextState['features'][moduleName].tempProperties
            ),
            moduleName,
          };
          localStorage.setItem(
            LocalStorageKey.buildKey(
              LocalStorageKey.LocalStorageWidgetTempPropertyKey,
              nextState['browserTabId']
            ),
            JSON.stringify(nextState)
          );
        }
        break;
      case PropertyPanelActions.UPDATE_ORIGINAL_PROPERTIES:
        if (location.pathname != '/widget') {
          nextState['browserTabId'] = Uti.defineBrowserTabId();
          localStorage.setItem(
            LocalStorageKey.buildKey(
              LocalStorageKey.LocalStorageWidgetOriginalPropertyKey,
              nextState['browserTabId']
            ),
            JSON.stringify({ value: Uti.getTempId() })
          );
        }
        break;
    }
    return nextState;
  };
}

export function updatePropertyPanelStateReducer(
  _reducer: ActionReducer<PropertyPanelState>
) {
  return (state: PropertyPanelState | undefined, action: Action) => {
    if (
      action.type ===
      PropertyPanelActions.UPDATE_PROPERTY_STATE_FROM_LOCAL_STORAGE
    ) {
      return (<any>action).payload;
    }
    return _reducer(state, action);
  };
}

export function propertyPanelReducer(
  state = initialState,
  action: CustomAction
): PropertyPanelState {
  return updatePropertyPanelStateReducer(
    persistPropertyPanelStateReducer(propertyPanelStateReducer)
  )(state, action);
}
