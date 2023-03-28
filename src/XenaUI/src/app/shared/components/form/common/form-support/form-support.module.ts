import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlFocusComponent } from "./control-focus";
import { ControlMessageComponent } from "./control-message";
import { HotKeySettingDialogComponent } from "./hot-key-setting-dialog";
import { MatButtonModule } from "app/shared/components/xn-control/light-material-ui/button";
import { WjCoreModule } from "wijmo/wijmo.angular2.core";
import * as primengModule from "primeng/primeng";
import { ReactiveFormsModule } from "@angular/forms";
import { XnTooltipModule } from "app/shared/directives/xn-tooltip/xn-tooltip.module";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        MatButtonModule,
        WjCoreModule,
        primengModule.DialogModule,
        CommonModule,
        ReactiveFormsModule,
        XnTooltipModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
    ],
    declarations: [
        ControlFocusComponent,
        ControlMessageComponent,
        HotKeySettingDialogComponent,
    ],
    exports: [
        ControlFocusComponent,
        ControlMessageComponent,
        HotKeySettingDialogComponent,
    ],
})
export class FormSupportModule {}
