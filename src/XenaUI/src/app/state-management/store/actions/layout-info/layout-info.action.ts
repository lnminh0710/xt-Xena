import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { CustomAction } from 'app/state-management/store/actions/base';
import {
    Module
} from 'app/models';
import { SplitterDirectionMode } from 'app/app.constants';

@Injectable()
export class LayoutInfoActions {
    // static SET_GLOBAL_SEARCH_HEIGHT = '[LayoutInfo] Set Global Search Height';
    // setGlobalSearchHeight(height: string, module: Module): CustomAction {
    //     return {
    //         type: LayoutInfoActions.SET_GLOBAL_SEARCH_HEIGHT,
    //         module: module,
    //         payload: height
    //     };
    // }

    static SET_PARKED_ITEM_WIDTH = '[LayoutInfo] Set Parked Item Width';
    setParkedItemWidth(width: string, module: Module): CustomAction {
        return {
            type: LayoutInfoActions.SET_PARKED_ITEM_WIDTH,
            module: module,
            payload: width
        };
    }

    static SET_RIGHT_MENU_WIDTH = '[LayoutInfo] Set Right Menu Width';
    setRightMenuWidth(width: string, module: Module): CustomAction {
        return {
            type: LayoutInfoActions.SET_RIGHT_MENU_WIDTH,
            module: module,
            payload: width
        };
    }

    static SET_RIGHT_PROPERTY_PANEL_WIDTH = '[LayoutInfo] Set Right Property Panel Width';
    setRightPropertyPanelWidth(width: string, module: Module): CustomAction {
        return {
            type: LayoutInfoActions.SET_RIGHT_PROPERTY_PANEL_WIDTH,
            module: module,
            payload: width
        };
    }

    static RESIZE_SPLITTER = '[LayoutInfo] Resize Splitter';
    resizeSplitter(module: Module, directionMode?: SplitterDirectionMode): CustomAction {
        let mode = SplitterDirectionMode.Horizontal;
        if (directionMode) {
            mode = directionMode;
        }

        return {
            type: LayoutInfoActions.RESIZE_SPLITTER,
            module: module,
            payload: mode
        };
    }

    static SET_TAB_HEADER_HEIGHT = '[LayoutInfo] Set Tab Header Height';
    setTabHeaderHeight(height: string, module: Module): CustomAction {
        return {
            type: LayoutInfoActions.SET_TAB_HEADER_HEIGHT,
            module: module,
            payload: height
        };
    }

    static TOGGLE_MAKE_SPACE_FOR_TAB_BUTTON = '[LayoutInfo] Toggle Make Space For Tab Button';
    toggleMakeSpaceForTabButton(makeSpaceForTabButton: boolean, module: Module): CustomAction {
        return {
            type: LayoutInfoActions.TOGGLE_MAKE_SPACE_FOR_TAB_BUTTON,
            module: module,
            payload: makeSpaceForTabButton
        };
    }

    static ENABLE_TRANSLATION = '[LayoutInfo] Enable Translation';
    enableTranslation(status, module: Module): CustomAction {
        return {
            type: LayoutInfoActions.ENABLE_TRANSLATION,
            module: module,
            payload: status
        };
    }
}
