import { AppState } from 'app/state-management/store/';
import { initialSubDataEntryState } from './data-entry.reducer';

const initDefaultData = (state: AppState, area) => {
    if (!state.dataEntryState.features[area]) {
        state.dataEntryState.features[area] = initialSubDataEntryState;
    }
}

export const getDataEntryState = (state: AppState, area) => {
    initDefaultData(state, area);
    return state.dataEntryState.features[area];
};
