import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ModuleWelcomeComponent } from "./module-welcome/module-welcome.component";
import { ModuleWelcomeItemComponent } from "./module-welcome-item";
import { ModuleWelcomeSubModuleComponent } from "./module-welcome-sub-module";
import {} from "ngx-bootstrap";
import { MaterialModule } from "../xn-control/light-material-ui/material.module";
import { XnTooltipModule } from "app/shared/directives/xn-tooltip/xn-tooltip.module";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        CommonModule,
        PerfectScrollbarModule.forRoot(),
        MaterialModule,
        XnTooltipModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
    ],
    declarations: [
        ModuleWelcomeComponent,
        ModuleWelcomeItemComponent,
        ModuleWelcomeSubModuleComponent,
    ],
    exports: [ModuleWelcomeComponent],
})
export class ModuleWelcomeModule {}
