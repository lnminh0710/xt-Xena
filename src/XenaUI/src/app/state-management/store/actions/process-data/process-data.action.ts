import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { RequestSavingMode } from 'app/app.constants';
import { CustomAction } from 'app/state-management/store/actions/base';
import { Module, SearchResultItemModel } from 'app/models';

@Injectable()
export class ProcessDataActions {
  static VIEW_MODE = '[ProcessData] View Mode';
  viewMode(module: Module): CustomAction {
    return {
      type: ProcessDataActions.VIEW_MODE,
      module: module,
    };
  }

  static EDIT_MODE = '[ProcessData] Edit Mode';
  editMode(module: Module): CustomAction {
    return {
      type: ProcessDataActions.EDIT_MODE,
      module: module,
    };
  }

  static FORM_OUTPUT_DATA = '[ProcessData] Form Output Data';
  formValue(formOutputData: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.FORM_OUTPUT_DATA,
      module: module,
      payload: formOutputData,
    };
  }

  static FORM_VALID = '[ProcessData] Form Valid';
  formValid(formValid: boolean, module: Module): CustomAction {
    return {
      type: ProcessDataActions.FORM_VALID,
      module: module,
      payload: formValid,
    };
  }

  static FORM_DIRTY = '[ProcessData] Form Dirty';
  formDirty(formDirty: boolean, module: Module): CustomAction {
    return {
      type: ProcessDataActions.FORM_DIRTY,
      module: module,
      payload: formDirty,
    };
  }

  static NEW_MAIN_TAB = '[ProcessData] New Main Tab';
  newMainTab(module: Module): CustomAction {
    return {
      type: ProcessDataActions.NEW_MAIN_TAB,
      module: module,
    };
  }

  static UPDATE_MAIN_TAB = '[ProcessData] Update Main Tab';
  updateMainTab(module: Module): CustomAction {
    return {
      type: ProcessDataActions.UPDATE_MAIN_TAB,
      module: module,
    };
  }

  static NEW_OTHER_TAB = '[ProcessData] New Other Tab';
  newOtherTab(module: Module): CustomAction {
    return {
      type: ProcessDataActions.NEW_OTHER_TAB,
      module: module,
    };
  }

  static NEW_SIMPLE_TAB = '[ProcessData] New Simple Tab';
  newSimpleTab(module: Module): CustomAction {
    return {
      type: ProcessDataActions.NEW_SIMPLE_TAB,
      module: module,
    };
  }

  static REQUEST_SAVE = '[ProcessData] Request Save';
  requestSave(
    module: Module,
    savingMode?: RequestSavingMode,
    area?: string
  ): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_SAVE,
      module: module,
      payload: savingMode,
      area: area,
    };
  }

  static REQUEST_SAVE_WIDGET = '[ProcessData] Request Save Widget';
  requestSaveWidget(module: Module, tabID?: string): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_SAVE_WIDGET,
      module: module,
      payload: { tabID },
    };
  }

  static SAVE_WIDGET_SUCCESS = '[ProcessData] Save Widget Success';
  saveWidgetSuccess(module: Module): CustomAction {
    return {
      type: ProcessDataActions.SAVE_WIDGET_SUCCESS,
      module: module,
    };
  }

  static SAVE_MAIN_TAB_RESULT = '[ProcessData] Save Main Tab Result';
  saveMainTabResult(saveResult: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.SAVE_MAIN_TAB_RESULT,
      module: module,
      payload: saveResult,
    };
  }

  static SAVE_OTHER_TAB_RESULT = '[ProcessData] Save Other Tab Result';
  saveOtherTabResult(saveResult: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.SAVE_OTHER_TAB_RESULT,
      module: module,
      payload: saveResult,
    };
  }

  static SAVE_ONLY_MAIN_TAB_RESULT = '[ProcessData] Save Only Main Tab Result';
  saveOnlyMainTabResult(saveResult: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.SAVE_ONLY_MAIN_TAB_RESULT,
      module: module,
      payload: saveResult,
    };
  }

  static SAVE_ONLY_OTHER_TAB_RESULT =
    '[ProcessData] Save Only Other Tab Result';
  saveOnlyOtherTabResult(saveResult: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.SAVE_ONLY_OTHER_TAB_RESULT,
      module: module,
      payload: saveResult,
    };
  }

  static LOAD_PARKED_ITEMS_COMPLETED =
    '[ProcessData] Load Parked Items Completed';
  loadParkedItemsCompleted(module: Module): CustomAction {
    return {
      type: ProcessDataActions.LOAD_PARKED_ITEMS_COMPLETED,
      module: module,
    };
  }

  static TURN_ON_FORM_EDIT_MODE = '[ProcessData] Turn On Form Edit Mode';
  turnOnFormEditMode(data: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.TURN_ON_FORM_EDIT_MODE,
      module: module,
      payload: data,
    };
  }

  static TURN_OFF_FORM_EDIT_MODE = '[ProcessData] Turn Off Form Edit Mode';
  turnOffFormEditMode(module: Module): CustomAction {
    return {
      type: ProcessDataActions.TURN_OFF_FORM_EDIT_MODE,
      module: module,
    };
  }

  static TURN_ON_FORM_CLONE_MODE = '[ProcessData] Turn On Form Clone Mode';
  turnOnFormCloneMode(data: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.TURN_ON_FORM_CLONE_MODE,
      module: module,
      payload: data,
    };
  }

  static TURN_OFF_FORM_CLONE_MODE = '[ProcessData] Turn Off Form Clone Mode';
  turnOffFormCloneMode(module: Module): CustomAction {
    return {
      type: ProcessDataActions.TURN_OFF_FORM_CLONE_MODE,
      module: module,
    };
  }

  static REQUEST_NEW_IN_EDIT = '[ProcessData] Request New In Edit';
  requestNewInEdit(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_NEW_IN_EDIT,
      module: module,
    };
  }

  static REQUEST_CHANGE_PARKED_ITEM =
    '[ProcessData] Requedt Change Parked Item';
  requestChangeParkedItem(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_CHANGE_PARKED_ITEM,
      module: module,
    };
  }

  static OK_TO_CHANGE_PARKED_ITEM = '[ProcessData] Ok To Change Parked Item';
  okToChangeParkedItem(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_CHANGE_PARKED_ITEM,
      module: module,
    };
  }

  static REQUEST_CHANGE_TAB = '[ProcessData] Requedt Change Tab';
  requestChangeTab(tabSetting: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_CHANGE_TAB,
      module: module,
      payload: tabSetting,
    };
  }

  static OK_TO_CHANGE_TAB = '[ProcessData] Ok To Change Tab';
  okToChangeTab(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_CHANGE_TAB,
      module: module,
    };
  }

  static REQUEST_REMOVE_TAB = '[ProcessData] Requedt Remove Tab';
  requestRemoveTab(tabSetting: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_REMOVE_TAB,
      module: module,
      payload: tabSetting,
    };
  }

  static OK_TO_REMOVE_TAB = '[ProcessData] Ok To Remove Tab';
  okToRemoveTab(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_REMOVE_TAB,
      module: module,
    };
  }

  static REQUEST_CREATE_NEW_FROM_MODULE_DROPDOWN =
    '[ProcessData] Request Create New From Module Dropdown';
  requestCreateNewFromModuleDropdown(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_CREATE_NEW_FROM_MODULE_DROPDOWN,
      module: module,
    };
  }

  static OK_TO_CREATE_NEW_FROM_MODULE_DROPDOWN =
    '[ProcessData] Ok To Create New From Module Dropdown';
  okToCreateNewFromModuleDropdown(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_CREATE_NEW_FROM_MODULE_DROPDOWN,
      module: module,
    };
  }

  static REQUEST_CREATE_NEW_MAIN_TAB =
    '[ProcessData] Request Create New Main Tab';
  requestCreateNewMainTab(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_CREATE_NEW_MAIN_TAB,
      module: module,
    };
  }

  static REQUEST_CHANGE_MODULE = '[ProcessData] Requedt Change Module';
  requestChangeModule(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_CHANGE_MODULE,
      module: module,
    };
  }

  static OK_TO_CHANGE_MODULE = '[ProcessData] Ok To Change Module';
  okToChangeModule(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_CHANGE_MODULE,
      module: module,
    };
  }

  static REQUEST_CHANGE_SUB_MODULE = '[ProcessData] Requedt Change Sub Module';
  requestChangeSubModule(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_CHANGE_SUB_MODULE,
      module: module,
    };
  }

  static OK_TO_CHANGE_SUB_MODULE = '[ProcessData] Ok To Change Sub Module';
  okToChangeSubModule(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_CHANGE_SUB_MODULE,
      module: module,
    };
  }

  static CLEAR_SAVE_RESULT = '[ProcessData] Clear Save Result';
  clearSaveResult(module: Module): CustomAction {
    return {
      type: ProcessDataActions.CLEAR_SAVE_RESULT,
      module: module,
    };
  }

  static REQUEST_GO_TO_FIRST_STEP = '[ProcessData] Request Go To First Step';
  requestGoToFirstStep(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_GO_TO_FIRST_STEP,
      module: module,
    };
  }

  static OK_TO_GO_TO_FIRST_STEP = '[ProcessData] Ok To Go To First Step';
  okToGoToFirstStep(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_GO_TO_FIRST_STEP,
      module: module,
    };
  }

  static REQUEST_GO_TO_SECOND_STEP = '[ProcessData] Request Go To Second Step';
  requestGoToSecondStep(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_GO_TO_SECOND_STEP,
      module: module,
    };
  }

  static OK_TO_GO_TO_SECOND_STEP = '[ProcessData] Ok To Go To Second Step';
  okToGoToSecondStep(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_GO_TO_SECOND_STEP,
      module: module,
    };
  }

  static REQUEST_CHANGE_BUSINESS_COST_ROW =
    '[ProcessData] Request Change Business Cost Row';
  requestChangeBusinessCostRow(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_CHANGE_BUSINESS_COST_ROW,
      module: module,
    };
  }

  static OK_TO_CHANGE_BUSINESS_COST_ROW =
    '[ProcessData] Ok To Change Business Cost Row';
  okToChangeBusinessCostRow(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_CHANGE_BUSINESS_COST_ROW,
      module: module,
    };
  }

  static SUBMIT_FAILED = '[ProcessData] Submit Failed';
  submitFailed(module: Module): CustomAction {
    return {
      type: ProcessDataActions.SUBMIT_FAILED,
      module: module,
    };
  }

  static SET_SELECTED_ENTITY = '[ProcessData] Set Selected Entity';
  setSelectedEntity(
    module: Module,
    entity: any,
    isParkedItem?: boolean,
    modulePrimaryKey?: string
  ): CustomAction {
    return {
      type: ProcessDataActions.SET_SELECTED_ENTITY,
      module: module,
      payload: {
        entity,
        isParkedItem,
        modulePrimaryKey,
      },
    };
  }

  static SELECT_SEARCH_RESULT = '[ProcessData] Select Search Result';
  selectSearchResult(
    searchResultItem: SearchResultItemModel,
    module: Module
  ): CustomAction {
    return {
      type: ProcessDataActions.SELECT_SEARCH_RESULT,
      module: module,
      payload: searchResultItem,
    };
  }

  static CLEAR_SEARCH_RESULT = '[ProcessData] Clear Search Result';
  clearSearchResult(module: Module): CustomAction {
    return {
      type: ProcessDataActions.CLEAR_SEARCH_RESULT,
      module: module,
    };
  }

  static REQUEST_ADD_TO_PARKED_ITEMS = '[ProcessData] Add To Parke Items';
  requestAddToParkedItems(data, module: Module, adddition?: any): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_ADD_TO_PARKED_ITEMS,
      module: module,
      payload: { data: data, adddition: adddition },
    };
  }

  static REQUEST_REMOVE_FROM_PARKED_ITEMS =
    '[ProcessData] Remove From Parke Items';
  requestRemoveFromParkedItems(data, module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_REMOVE_FROM_PARKED_ITEMS,
      module: module,
      payload: data,
    };
  }

  static REQUEST_GO_TO_MODULE = '[ProcessData] Request Go To Module';
  requestGoToModule(data, module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_GO_TO_MODULE,
      module: module,
      payload: data,
    };
  }

  static REQUEST_ADD_TO_DOUBLET = '[ProcessData] Request Add To Doublet';
  requestAddToDoublet(
    searchResultItem: SearchResultItemModel,
    module: Module
  ): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_ADD_TO_DOUBLET,
      module: module,
      payload: searchResultItem,
    };
  }

  static REQUEST_CHANGE_SEARCH_RESULT =
    '[ProcessData] Request Change Search Result';
  requestChangeSearchResult(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_CHANGE_SEARCH_RESULT,
      module: module,
    };
  }

  static OK_TO_CHANGE_SEARCH_RESULT =
    '[ProcessData] Ok To Change Search Result';
  okToChangeSearchResult(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_CHANGE_SEARCH_RESULT,
      module: module,
    };
  }

  static OPEN_TRANSLATION_DIALOG = '[ProcessData] Open Translation Dialog';
  openTranslationDialog(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OPEN_TRANSLATION_DIALOG,
      module: module,
    };
  }

  static OK_TO_RELOAD_ORDER_DATA_ENTRY =
    '[ProcessData] Ok To Reload Order Data Entry';
  okToReloadOrderDataEntry(module: Module): CustomAction {
    return {
      type: ProcessDataActions.OK_TO_RELOAD_ORDER_DATA_ENTRY,
      module: module,
    };
  }

  static SET_DISABLE_TAB_HEADER = '[ProcessData] Set Disable Tab Header';
  setDisableTabHeader(formData: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.SET_DISABLE_TAB_HEADER,
      payload: formData,
      module: module,
    };
  }

  static DONT_WANT_TO_SHOW_CONTEXT_MENU =
    '[ProcessData] Dont Want To Show Context Menu';
  dontWantToShowContextMenu(): CustomAction {
    return {
      type: ProcessDataActions.DONT_WANT_TO_SHOW_CONTEXT_MENU,
    };
  }

  static PAGNATION_DATA_CHANGE = '[ProcessData] Pagnation Data Change';
  pagnationDataChange(data): CustomAction {
    return {
      type: ProcessDataActions.PAGNATION_DATA_CHANGE,
      payload: data,
    };
  }

  static EDITING_FORM_DATA = '[ProcessData] Editing Form Data';
  editingFormData(data: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.EDITING_FORM_DATA,
      module: module,
      payload: data,
    };
  }

  static REQUEST_BUILD_FREQUENCY = '[ProcessData] Request Build Frequency';
  requestBuildFrequency(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_BUILD_FREQUENCY,
      module: module,
    };
  }

  static REQUEST_OPEN_SELECTION_EXPORT_DATA_DIALOG =
    '[ProcessData] Request Open Selection Export Data Dialog';
  requestOpenSelectionExportDataDialog(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_OPEN_SELECTION_EXPORT_DATA_DIALOG,
      module: module,
    };
  }

  static REQUEST_EXPORT_SELECTION_DATA =
    '[ProcessData] Request Export Selection Data';
  requestExportSelectionData(
    exportType,
    module: Module,
    email?,
    fileType?,
    csvDelimiter?
  ): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_EXPORT_SELECTION_DATA,
      module: module,
      payload: {
        exportType,
        email,
        fileType,
        csvDelimiter,
      },
    };
  }

  static REQUEST_EXPORT_SELECTION_DATA_FROM_CONTEXT_MENU =
    '[ProcessData] Request Export Selection Data From Context Menu';
  requestExportSelectionDataFromContextMenu(
    exportType,
    module: Module
  ): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_EXPORT_SELECTION_DATA_FROM_CONTEXT_MENU,
      module: module,
      payload: exportType,
    };
  }

  static EXPORT_SELECTION_DATA_RESULT =
    '[ProcessData] Export Selection Data Result';
  exportSelectionDataResult(
    exportType,
    module: Module,
    isSuccess: boolean
  ): CustomAction {
    return {
      type: ProcessDataActions.EXPORT_SELECTION_DATA_RESULT,
      module: module,
      payload: {
        exportType,
        isSuccess,
      },
    };
  }

  static SELECT_GOTO_MODULE_ITEM = '[ProcessData] Select Go To Module Item';
  selectGoToModuleItem(goToModuleItem: any, module: Module): CustomAction {
    return {
      type: ProcessDataActions.SELECT_GOTO_MODULE_ITEM,
      module: module,
      payload: goToModuleItem,
    };
  }

  static CLEAR_GOTO_MODULE_ITEM = '[ProcessData] Clear Go To Module Item';
  clearGoToModuleItem(module: Module): CustomAction {
    return {
      type: ProcessDataActions.CLEAR_GOTO_MODULE_ITEM,
      module: module,
    };
  }

  static TOGGLE_DASHBOARD_LOADING = '[ProcessData] Toggle Dashboard Loading';
  toggleDashboardLoading(show: boolean, module: Module): CustomAction {
    return {
      type: ProcessDataActions.TOGGLE_DASHBOARD_LOADING,
      module: module,
      payload: { show },
    };
  }

  static REQUEST_SYNC_MEDIACODE = '[ProcessData] Request Sync Mediacode';
  requestSyncMediacode(module: Module): CustomAction {
    return {
      type: ProcessDataActions.REQUEST_SYNC_MEDIACODE,
      module: module,
    };
  }

  static SET_CONTENT_DISPLAY_MODE = '[ProcessData] Set Content Display Mode';
  setContentDisplayMode(displayMode: string, module: Module): CustomAction {
    return {
      type: ProcessDataActions.SET_CONTENT_DISPLAY_MODE,
      payload: displayMode,
      module: module,
    };
  }

  static SELECTION_COUNTRIES_ARE_UPDATED =
    '[ProcessData] Selection Countries Are Updated';
  selectionCountriesAreUpdated(module: Module): CustomAction {
    return {
      type: ProcessDataActions.SELECTION_COUNTRIES_ARE_UPDATED,
      module: module,
    };
  }

  static UPDATE_PROCESS_DATA_STATE_FROM_LOCAL_STORAGE =
    '[ProcessData] Update process data state from local storage';
  restoreAllState(data): CustomAction {
    return {
      type: ProcessDataActions.UPDATE_PROCESS_DATA_STATE_FROM_LOCAL_STORAGE,
      payload: data,
    };
  }

  static SET_GRID_ITEM_DATA_TO_LOCAL_STORAGE =
    '[ProcessData] Set Grid Item Data To Local Storage';
  setGridItemDataToLocalStorage(module: Module, data: any): CustomAction {
    return {
      type: ProcessDataActions.SET_GRID_ITEM_DATA_TO_LOCAL_STORAGE,
      module: module,
      payload: data,
    };
  }

  static SET_GRID_ITEM_DATA = '[ProcessData] Set Grid Item Data';
  setGridItemData(module: Module, data): CustomAction {
    return {
      type: ProcessDataActions.SET_GRID_ITEM_DATA,
      module: module,
      payload: data,
    };
  }
}
