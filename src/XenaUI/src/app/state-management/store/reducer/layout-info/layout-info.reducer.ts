import { Action } from "@ngrx/store";
import { LayoutInfoActions } from "app/state-management/store/actions/layout-info";
import { PageSize } from "app/app.constants";
import { CustomAction } from "app/state-management/store/actions/base";
import * as baseReducer from "app/state-management/store/reducer/reducer.base";

export interface SubLayoutInfoState {
    // globalSearchHeight: string;
    parkedItemHeight: string;
    parkedItemTitleHeight: string;
    parkedItemBufferHeight: string;
    parkedItemPadding: string;
    selectedEntityHeight: string;
    mainContentHeight: string;
    headerHeight: string;
    smallHeaderLineHeight: string;
    tabHeaderHeight: string;
    tabHeaderHeightOrderDataEntry: string;
    smallTabHeaderHeight: string;
    additionalInfoTabHeaderHeight: string;
    parkedItemWidth: string;
    rightMenuWidth: string;
    rightPropertyPanelWidth: string;
    //resizeSplitter: boolean;
    formPadding: string;
    dashboardPaddingTop: string;
    additionalInfoHeaderHeight: string;
    propertyPanelHeader: string;
    simpleTabHeight: string;
    makeSpaceForTabButton: {
        isActive: boolean;
    };
    enableTranslation: boolean;
}

export const initialSubLayoutInfoState: SubLayoutInfoState = {
    // globalSearchHeight: '0',
    parkedItemHeight: "100",
    parkedItemTitleHeight: "40",
    parkedItemBufferHeight: "20",
    parkedItemPadding: "2",
    selectedEntityHeight: "135",
    mainContentHeight: "60",
    headerHeight: "53",
    smallHeaderLineHeight: "4",
    tabHeaderHeight: "125",
    tabHeaderHeightOrderDataEntry: "35",
    smallTabHeaderHeight: "34",
    additionalInfoTabHeaderHeight: "90",
    parkedItemWidth: "0",
    rightMenuWidth: "0",
    rightPropertyPanelWidth: "0",
    //resizeSplitter: false,
    formPadding: "10",
    dashboardPaddingTop: "5",
    additionalInfoHeaderHeight: "36",
    propertyPanelHeader: "35",
    simpleTabHeight: "38",
    makeSpaceForTabButton: {
        isActive: false,
    },
    enableTranslation: false,
};

export interface LayoutInfoState {
    features: { [id: string]: SubLayoutInfoState };
}

const initialState: LayoutInfoState = {
    features: {},
};

export function layoutInfoReducer(
    state = initialState,
    action: CustomAction
): LayoutInfoState {
    let feature = baseReducer.getFeature(
        action,
        state,
        initialSubLayoutInfoState
    );

    switch (action.type) {
        case LayoutInfoActions.TOGGLE_MAKE_SPACE_FOR_TAB_BUTTON: {
            state = baseReducer.updateStateData(action, feature, state, {
                makeSpaceForTabButton: {
                    isActive: action.payload,
                },
            });
            return Object.assign({}, state);
        }

        case LayoutInfoActions.SET_PARKED_ITEM_WIDTH: {
            state = baseReducer.updateStateData(action, feature, state, {
                parkedItemWidth: action.payload,
            });
            return Object.assign({}, state);
        }

        case LayoutInfoActions.SET_RIGHT_MENU_WIDTH: {
            state = baseReducer.updateStateData(action, feature, state, {
                rightMenuWidth: action.payload,
            });
            return Object.assign({}, state);
        }

        case LayoutInfoActions.SET_RIGHT_PROPERTY_PANEL_WIDTH: {
            state = baseReducer.updateStateData(action, feature, state, {
                rightPropertyPanelWidth: action.payload,
            });
            return Object.assign({}, state);
        }

        case LayoutInfoActions.SET_TAB_HEADER_HEIGHT: {
            state = baseReducer.updateStateData(action, feature, state, {
                tabHeaderHeight: action.payload,
            });
            return Object.assign({}, state);
        }

        case LayoutInfoActions.ENABLE_TRANSLATION: {
            state = baseReducer.updateStateData(action, feature, state, {
                enableTranslation: action.payload,
            });
            return Object.assign({}, state);
        }

        default: {
            return state;
        }
    }
}
