import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectionProjectDetailComponent } from "./selection-project-detail.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { XnAgGridModule } from "../xn-control/xn-ag-grid";
import { AngularSplitModule } from "angular-split";
import { XnTooltipModule } from 'app/shared/directives/xn-tooltip/xn-tooltip.module';

@NgModule({
    imports: [
        CommonModule,
        PerfectScrollbarModule.forRoot(),
        XnAgGridModule,
        AngularSplitModule,
        XnTooltipModule,
    ],
    declarations: [
        SelectionProjectDetailComponent
    ],
    exports: [
        SelectionProjectDetailComponent
    ]
})
export class SelectionProjectDetailModule { }
