import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { XnInputDebounceModule } from "../xn-control/xn-input-debounce/xn-input-debounce.module";
import { GlobalSearchMainComponent } from "./container";
import {
    GlobalSeachModuleItemComponent,
    GlobalSeachModuleItemListComponent,
    GlobalSearchTabComponent,
    GlobalSearchResultComponent,
    GlobalSearchHistoryComponent,
    GlobalSearchCustomerDetailComponent,
} from "./components";
import { ResizableModule } from "angular-resizable-element";
import { TabsModule } from "ngx-bootstrap/tabs/tabs.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { XnAgGridModule } from "../xn-control/xn-ag-grid";
import { MaterialModule } from "../xn-control/light-material-ui/material.module";
import { XnPagerModule } from "../xn-pager/xn-pagination.module";
import { AdvanceSearchBuilderModule } from "app/shared/components/advance-search-builder/advance-search-builder.module";
import { XnTooltipModule } from "app/shared/directives/xn-tooltip/xn-tooltip.module";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";
import * as primengModule from "primeng/primeng";
import { WidgetInfoTranslationModule } from "../widget/components/widget-module-info-translation/widget-info-translation.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        XnInputDebounceModule,
        ResizableModule,
        TabsModule,
        PerfectScrollbarModule.forRoot(),
        XnAgGridModule,
        XnPagerModule,
        MaterialModule,
        AdvanceSearchBuilderModule,
        XnTooltipModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
        primengModule.DialogModule,
        WidgetInfoTranslationModule,
    ],
    declarations: [
        GlobalSearchMainComponent,
        GlobalSeachModuleItemComponent,
        GlobalSeachModuleItemListComponent,
        GlobalSearchTabComponent,
        GlobalSearchResultComponent,
        GlobalSearchHistoryComponent,
        GlobalSearchCustomerDetailComponent,
    ],
    exports: [
        GlobalSearchMainComponent,
        GlobalSeachModuleItemComponent,
        GlobalSeachModuleItemListComponent,
        GlobalSearchTabComponent,
        GlobalSearchResultComponent,
        GlobalSearchHistoryComponent,
        GlobalSearchCustomerDetailComponent,
    ],
})
export class GlobalSearchModule {}
