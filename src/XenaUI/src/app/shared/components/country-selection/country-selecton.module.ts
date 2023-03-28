import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    SelSelectGroupComponent,
    SelCountrySelectionHeaderComponent,
    SelCountrySelectionFooterComponent,
    SelCountrySelectedComponent,
} from "./components";
import { SelCountrySelectionCombineComponent } from "./container";
import { MaterialModule } from "app/shared/components/xn-control/light-material-ui/material.module";
import { FormsModule } from "@angular/forms";
import { WjCoreModule } from "wijmo/wijmo.angular2.core";
import { WjInputModule } from "wijmo/wijmo.angular2.input";
import { XnAgGridModule } from "app/shared/components/xn-control/xn-ag-grid";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import * as primengModule from "primeng/primeng";
import { XnInputDebounceModule } from "app/shared/components/xn-control/xn-input-debounce/xn-input-debounce.module";
import { AngularSplitModule } from "angular-split";
import { SelCountryCheckListModule } from "app/shared/components/xn-control";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        WjCoreModule,
        WjInputModule,
        XnAgGridModule,
        PerfectScrollbarModule.forRoot(),
        primengModule.DialogModule,
        XnInputDebounceModule,
        AngularSplitModule,
        SelCountryCheckListModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
    ],
    declarations: [
        SelSelectGroupComponent,
        SelCountrySelectionHeaderComponent,
        SelCountrySelectionFooterComponent,
        SelCountrySelectedComponent,
        SelCountrySelectionCombineComponent,
    ],
    exports: [SelCountrySelectionCombineComponent],
})
export class CountrySelectionModule {}
