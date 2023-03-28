import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../xn-control/light-material-ui/material.module";
import { XnMenuBarComponent } from "./xn-menu-bar.component";
import { XnDropdownModule } from "app/shared/directives/xn-dropdown/xn-dropdown.directive.module";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
        XnDropdownModule,
    ],
    declarations: [XnMenuBarComponent],
    exports: [XnMenuBarComponent],
})
export class XnMenuBarModule {}
