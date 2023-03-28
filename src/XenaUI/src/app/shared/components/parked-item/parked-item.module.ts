import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BsDropdownModule } from "ngx-bootstrap";
import { MaterialModule } from "../xn-control/light-material-ui/material.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { CircleProgressModule } from "../xn-control/xn-circle-progress/xn-circle-progress.module";
import { ParkedItemComponent } from "./parked-item/parked-item.component";
import { ParkedItemGuideComponent } from "./parked-item-guide";
import { ParkedItemListComponent } from "./parked-item-list";
import { ParkedItemDropdownComponent } from "./parked-item-dropdown";
import { ParkedItemProjectStatusComponent } from "./parked-item-project-status";
import { DndModule } from "ng2-dnd";
import { DragulaModule } from "ng2-dragula";
import { FormsModule } from "@angular/forms";
import { XnTooltipModule } from "app/shared/directives/xn-tooltip/xn-tooltip.module";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BsDropdownModule.forRoot(),
        MaterialModule,
        PerfectScrollbarModule.forRoot(),
        CircleProgressModule,
        DndModule.forRoot(),
        DragulaModule,
        XnTooltipModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
    ],
    declarations: [
        ParkedItemComponent,
        ParkedItemGuideComponent,
        ParkedItemListComponent,
        ParkedItemDropdownComponent,
        ParkedItemProjectStatusComponent,
    ],
    exports: [
        ParkedItemComponent,
        ParkedItemListComponent,
        ParkedItemProjectStatusComponent,
    ],
})
export class ParkedItemModule {}
