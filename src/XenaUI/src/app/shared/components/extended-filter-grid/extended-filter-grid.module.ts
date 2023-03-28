import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { XnAgGridModule } from "../xn-control/xn-ag-grid";
import { ExtendedFilterGridComponent } from "./extended-filter-grid.component";
import { QueryBuilderModule } from "../xn-control/query-builder";
import { AngularSplitModule } from "angular-split";
import * as primengModule from "primeng/primeng";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(),
        XnAgGridModule,
        QueryBuilderModule,
        AngularSplitModule,
        primengModule.DialogModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
    ],
    declarations: [ExtendedFilterGridComponent],
    exports: [ExtendedFilterGridComponent],
})
export class ExtendedFilterGridModule {}
