import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EditLayoutSettingComponent, WidgetTemplateSettingComponent, DialogApplyWidgetSettingsComponent, DialogModuleLayoutSettingsComponent, DialogSaveWorkspaceTemplateComponent } from "./components";
import { AsideComponent } from "./container";
import { MaterialModule } from "app/shared/components/xn-control/light-material-ui/material.module";
import { WjCoreModule } from "wijmo/wijmo.angular2.core";
import { WjInputModule } from 'wijmo/wijmo.angular2.input';
import { XnAgGridModule } from "app/shared/components/xn-control/xn-ag-grid";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import * as primengModule from 'primeng/primeng';
import { BsDropdownModule } from "ngx-bootstrap";
import { DndModule } from "ng2-dnd";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormSupportModule } from 'app/shared/components/form';
import { XnTooltipModule } from 'app/shared/directives/xn-tooltip/xn-tooltip.module';
import { DisabledWorkspaceButtonDirectiveModule } from "./directives/disabled-workspace-button.module";
import {AngularMultiSelectModule} from "../../xn-control/xn-dropdown";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        WjCoreModule,
        WjInputModule,
        XnAgGridModule,
        AngularMultiSelectModule,
        PerfectScrollbarModule.forRoot(),
        primengModule.DialogModule,
        BsDropdownModule,
        DndModule,
        FormSupportModule,
        XnTooltipModule,
        DisabledWorkspaceButtonDirectiveModule,
        LabelTranslationModule,
        XnResourceTranslationModule
    ],
    declarations: [
        EditLayoutSettingComponent,
        WidgetTemplateSettingComponent,
        DialogApplyWidgetSettingsComponent,
        DialogModuleLayoutSettingsComponent,
        DialogSaveWorkspaceTemplateComponent,
        AsideComponent
    ],
    exports: [
        EditLayoutSettingComponent,
        WidgetTemplateSettingComponent,
        DialogApplyWidgetSettingsComponent,
        DialogModuleLayoutSettingsComponent,
        DialogSaveWorkspaceTemplateComponent,
        AsideComponent
    ]
})
export class ControlSidebarModule { }
