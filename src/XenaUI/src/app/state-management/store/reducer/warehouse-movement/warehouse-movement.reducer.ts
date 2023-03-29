import { Action } from '@ngrx/store';
import { WarehouseMovementActions } from 'app/state-management/store/actions';
import { CustomAction } from 'app/state-management/store/actions/base';
import * as baseReducer from 'app/state-management/store/reducer/reducer.base';

export interface SubWarehouseMovementState {
  subForm: string;
}

export const initialSubWarehouseMovementState: SubWarehouseMovementState = {
  subForm: null,
};

export interface WarehouseMovementState {
  features: { [id: string]: SubWarehouseMovementState };
}

const initialState: WarehouseMovementState = {
  features: {},
};

export function warehouseMovementReducer(
  state = initialState,
  action: CustomAction
): WarehouseMovementState {
  let feature = baseReducer.getFeature(
    action,
    state,
    initialSubWarehouseMovementState
  );

  switch (action.type) {
    case WarehouseMovementActions.SET_SUB_FORM: {
      state = baseReducer.updateStateData(action, feature, state, {
        subForm: action.payload,
      });
      return Object.assign({}, state);
    }

    default: {
      return state;
    }
  }
}
