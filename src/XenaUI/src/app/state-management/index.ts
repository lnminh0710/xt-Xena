import { NgModule, Optional, SkipSelf } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { reducers } from "./store";
import {
    AdditionalInformationActions,
    ModuleActions,
    WidgetDetailActions,
    TabSummaryActions,
    WidgetTemplateActions,
    SearchResultActions,
    ParkedItemActions,
    LayoutInfoActions,
    ModuleSettingActions,
    XnCommonActions,
    ProcessDataActions,
    GridActions,
    DataEntryActions,
    PropertyPanelActions,
    TabButtonActions,
    BackofficeActions,
    ReturnRefundActions,
    WarehouseMovementActions,
    HotKeySettingActions,
    ModalActions,
    LayoutSettingActions,
    FilterActions,
    GlobalSearchActions,
} from "./store/actions";
import {
    MainModuleEffects,
    TabSummaryEffects,
    WidgetTemplateSettingEffects,
    ParkedItemEffects,
    ModuleSettingEffects,
    XnCommonEffects,
    HotkeySettingEffects,
    GlobalSearchEffects,
} from "./effects";

@NgModule({
    imports: [StoreModule.forRoot(reducers)],
    declarations: [],
    providers: [
        AdditionalInformationActions,
        ModuleActions,
        ParkedItemActions,
        WidgetDetailActions,
        TabSummaryActions,
        SearchResultActions,
        WidgetTemplateActions,
        LayoutInfoActions,
        ModuleSettingActions,
        XnCommonActions,
        ProcessDataActions,
        GridActions,
        DataEntryActions,
        PropertyPanelActions,
        TabButtonActions,
        BackofficeActions,
        ReturnRefundActions,
        WarehouseMovementActions,
        HotKeySettingActions,
        ModalActions,
        LayoutSettingActions,
        FilterActions,
        GlobalSearchActions,
    ],
})
export class StateManagementModule {
    constructor(@Optional() @SkipSelf() parentModule: StateManagementModule) {}
}
