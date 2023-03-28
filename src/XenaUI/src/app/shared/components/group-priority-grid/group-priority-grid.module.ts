import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { AngularSplitModule } from "angular-split";
import { WijmoGridSelectionModule } from "../wijmo/wijmo-grid-selection/wijmo-grid-selection.module";
import { XnAgGridModule } from "../xn-control/xn-ag-grid";
import { AgGridModule } from "ag-grid-angular";
import { GroupPriorityGridComponent } from "./group-priority-grid.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(),
        AngularSplitModule,
        WijmoGridSelectionModule,
        XnAgGridModule,
        AgGridModule,
    ],
    declarations: [GroupPriorityGridComponent],
    exports: [GroupPriorityGridComponent],
})
export class GroupPriorityGridModule {}
