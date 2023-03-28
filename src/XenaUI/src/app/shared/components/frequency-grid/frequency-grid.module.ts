import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { AngularSplitModule } from "angular-split";
import * as primengModule from "primeng/primeng";
import { FrequencyGridComponent } from "./frequency-grid.component";
import { WijmoGridSelectionModule } from "../wijmo/wijmo-grid-selection/wijmo-grid-selection.module";
import { XnAgGridModule } from "../xn-control/xn-ag-grid";
import { AgGridModule } from "ag-grid-angular";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(),
        AngularSplitModule,
        primengModule.DialogModule,
        WijmoGridSelectionModule,
        XnAgGridModule,
        AgGridModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
    ],
    declarations: [FrequencyGridComponent],
    exports: [FrequencyGridComponent],
})
export class FrequencyGridModule {}
