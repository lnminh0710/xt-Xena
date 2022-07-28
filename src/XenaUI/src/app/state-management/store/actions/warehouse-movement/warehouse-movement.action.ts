import { Injectable } from '@angular/core';
import { Module } from 'app/models';
import { CustomAction } from 'app/state-management/store/actions/base';

@Injectable()
export class WarehouseMovementActions {
    static REQUEST_CONFIRM_ALL = '[WarehouseMovement] Request Confirm All';
    requestConfirmAll(module: Module): CustomAction {
        return {
            type: WarehouseMovementActions.REQUEST_CONFIRM_ALL,
            module: module
        };
    }

    static REQUEST_CONFIRM_ALL_SUCCESS = '[WarehouseMovement] Request Confirm All Success';
    requestConfirmAllSuccess(module: Module): CustomAction {
        return {
            type: WarehouseMovementActions.REQUEST_CONFIRM_ALL_SUCCESS,
            module: module
        };
    }
    static REQUEST_SAVE_AND_CONFIRM = '[WarehouseMovement] Request Save And Confirm';
    requestSaveAndConfirm(module: Module): CustomAction {
        return {
            type: WarehouseMovementActions.REQUEST_SAVE_AND_CONFIRM,
            module: module
        };
    }

    static REQUEST_SAVE_AND_CONFIRM_SUCCESS = '[WarehouseMovement] Request Save And Confirm Success';
    requestSaveAndConfirmSuccess(module: Module): CustomAction {
        return {
            type: WarehouseMovementActions.REQUEST_SAVE_AND_CONFIRM_SUCCESS,
            module: module
        };
    }
    static SET_SUB_FORM = '[WarehouseMovement] Set Sub Form';
    setSubForm(subForm: string, module: Module): CustomAction {
        return {
            type: WarehouseMovementActions.SET_SUB_FORM,
            module: module,
            payload: subForm
        };
    }
}
