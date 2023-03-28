import { Action } from "@ngrx/store";
import { WidgetTemplateSettingModel } from "app/models";
import { WidgetTemplateActions } from "app/state-management/store/actions/widget-template/index";
import { CustomAction } from "app/state-management/store/actions/base";
import * as baseReducer from "app/state-management/store/reducer/reducer.base";

export interface SubWidgetTemplateSettingState {
    mainWidgetTemplateSettings: WidgetTemplateSettingModel[];
    enableWidgetTemplate: boolean;
    //saveWidget: { [key: string]: any };
}

export const initialSubWidgetTemplateState: SubWidgetTemplateSettingState = {
    mainWidgetTemplateSettings: [],
    enableWidgetTemplate: false,
    // saveWidget: null
};

export interface WidgetTemplateSettingState {
    features: { [id: string]: SubWidgetTemplateSettingState };
}

const initialState: WidgetTemplateSettingState = {
    features: {},
};

export function widgetTemplateSettingReducer(
    state = initialState,
    action: CustomAction
): WidgetTemplateSettingState {
    let feature = baseReducer.getFeature(
        action,
        state,
        initialSubWidgetTemplateState
    );
    switch (action.type) {
        case WidgetTemplateActions.LOAD_All_WIDGET_TEMPLATE_SETTING_BY_MODULE_ID_SUCCESS: {
            if (action.payload && action.payload.length > 0) {
                state = baseReducer.updateStateData(action, feature, state, {
                    mainWidgetTemplateSettings: [...action.payload],
                });
            } else {
                state = baseReducer.updateStateData(action, feature, state, {
                    mainWidgetTemplateSettings: [],
                });
            }

            return Object.assign({}, state);
        }
        case WidgetTemplateActions.UPDATE_EDIT_MODE_STATUS: {
            state = baseReducer.updateStateData(action, feature, state, {
                enableWidgetTemplate: action.payload,
            });
            return Object.assign({}, state);
        }

        default: {
            return state;
        }
    }
}
