import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { ModuleSettingActions } from 'app/state-management/store/actions';
import { ModuleSettingService } from 'app/services';
import { ApiResultResponse } from 'app/models';
import { CustomAction } from 'app/state-management/store/actions/base';

@Injectable()
export class ModuleSettingEffects {

    private actionData: CustomAction = null;

    constructor(
        private update$: Actions,
        private moduleSettingActions: ModuleSettingActions,
        private moduleSettingService: ModuleSettingService
    ) {
    }

    @Effect() loadModuleSetting$ = this.update$
        .ofType<CustomAction>(ModuleSettingActions.LOAD_MODULE_SETTING)
        .map(action => {
            this.actionData = action;
            return action.payload;
        })
        .switchMap((payload: any) => {
            return this.moduleSettingService.getModuleSetting(payload.objectParam, payload.idSettingsModule, payload.objectNr, payload.moduleType);
        })
        .map((response: ApiResultResponse) => {
            return this.moduleSettingActions.loadModuleSettingSuccess(response.item, this.actionData.module);
        });
}
