import { Injectable, Injector, Inject, forwardRef } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { ParkedItemModel, Module, ApiResultResponse } from 'app/models';

import { ParkedItemActions } from 'app/state-management/store/actions';
import {
  ParkedItemService,
  PersonService,
  ArticleService,
  CampaignService,
  DataEntryService,
  ProjectService,
  WareHouseMovementService,
} from 'app/services';
import { Uti } from 'app/utilities';
import { MenuModuleId } from 'app/app.constants';
import { CustomAction } from 'app/state-management/store/actions/base';
import { ModuleList } from 'app/pages/private/base';

@Injectable()
export class ParkedItemEffects {
  private actionData: any = null;

  constructor(
    private update$: Actions,
    private parkedItemActions: ParkedItemActions,
    private parkedItemService: ParkedItemService,
    private personService: PersonService,
    private articleService: ArticleService,
    private campaignService: CampaignService,
    private dataEntryService: DataEntryService,
    private projectService: ProjectService,
    injector: Injector,
    @Inject(forwardRef(() => WareHouseMovementService))
    private warehouseMovementService: WareHouseMovementService
  ) {}

  @Effect() loadParkedItems$ = this.update$
    .ofType<CustomAction>(ParkedItemActions.LOAD_PARKED_ITEMS)
    .map((action) => action.payload)
    .switchMap((payload: any) => {
      switch (payload.currentModule.idSettingsGUI) {
        case ModuleList.OrderDataEntry.idSettingsGUI:
          return this.dataEntryService.getListOrderFailed(payload.ODETab.TabID);
        default:
          return this.parkedItemService.getListParkedItemByModule(
            payload.currentModule
          );
      }
    })
    .map((parkedItemResult: any) => {
      return this.parkedItemActions.loadParkedItemsSuccess(parkedItemResult);
    });

  @Effect() loadThenAddParkedItem = this.update$
    .ofType<CustomAction>(ParkedItemActions.LOAD_THEN_ADD_PARKED_ITEM)
    .map((action) => {
      this.actionData = action.payload;
      return action.payload;
    })
    .switchMap((data: any) => {
      switch (data.currentModule.idSettingsGUI) {
        case MenuModuleId.administration:
        case MenuModuleId.customer:
          return this.personService.getPersonById(data.parkedItemId);
        case MenuModuleId.article:
          return this.articleService.getArticleById(data.parkedItemId);
        case MenuModuleId.campaign:
          return this.campaignService.getCampaignWizardT1(data.parkedItemId);
        case MenuModuleId.businessCosts:
          return this.campaignService.getCampaignCosts(data.parkedItemId, true);
        case MenuModuleId.selectionCampaign:
          return this.projectService.getSelectionProject(data.parkedItemId);
        case MenuModuleId.warehouseMovement:
          return this.warehouseMovementService.getWarehouseMovement(
            data.parkedItemId
          );
        default:
          return this.personService.getPersonById(data.parkedItemId);
      }
    })
    .map((response: ApiResultResponse) => {
      if (!Uti.isResquestSuccess(response)) {
        return null;
      }
      let newParkedItem: any;

      if (
        this.actionData.currentModule.idSettingsGUI == MenuModuleId.campaign
      ) {
        newParkedItem = new ParkedItemModel(response.item.collectionData[0]);
      } else if (
        this.actionData.currentModule.idSettingsGUI == MenuModuleId.article
      ) {
        newParkedItem = new ParkedItemModel(response.item);
      } else {
        newParkedItem = new ParkedItemModel(response.item);
      }

      newParkedItem.id = newParkedItem[this.actionData.modulePrimaryKey];
      newParkedItem.keys = this.actionData.widgetListenKey;

      return this.parkedItemActions.loadThenAddParkedItemSuccess(
        newParkedItem,
        this.actionData.currentModule
      );
    });
}
