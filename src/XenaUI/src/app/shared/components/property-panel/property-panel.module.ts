import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import * as primengModule from "primeng/primeng";
import { PropertyPanelComponent } from "./property-panel/property-panel.component";
import { PropertyPanelDateFormatDialogComponent } from "./property-panel-date-format-dialog";
import { PropertyPanelGridComponent } from "./property-panel-grid";
import { PropertyPanelGridFieldDataDialogComponent } from "./property-panel-grid-field-data-dialog";
import { PropertyPanelGridValueComponent } from "./property-panel-grid-value";
import { PropertyPanelGridValueDialogComponent } from "./property-panel-grid-value-dialog";
import { PropertyPanelOrderFieldDialogComponent } from "./property-panel-order-field-dialog";
import { PropertyPanelOrderFieldDisplayItemComponent } from "./property-panel-order-field-display-item";
import { MaterialModule } from "../xn-control/light-material-ui/material.module";
import { DragulaModule } from "ng2-dragula";
import { ResizableModule } from "angular-resizable-element";
import { CollapseModule, PopoverModule } from "ngx-bootstrap";
import { XnClickOutsideModule } from "app/shared/directives/xn-click-outside/xn-click-outside.module";
import { WjInputModule } from "wijmo/wijmo.angular2.input";
import { PropertyPanelShowDropdownFocusComponent } from "./property-panel-show-dropdown-focus";
import { XnWjDropdownHelperModule } from "app/shared/directives/xn-wj-dropdown-helper/xn-wj-dropdown-helper.module";
import { XnPipeModule } from "app/shared/components/xn-control/xn-pipe";
import { XnTooltipModule } from "app/shared/directives/xn-tooltip/xn-tooltip.module";
import { XnInputNumericModule } from "app/shared/directives/xn-input-numeric/xn-input-numeric.module";
import { AngularMultiSelectModule } from "../xn-control/xn-dropdown";
import { PropertyBackgroundGradientComponent } from "./property-background-gradient-dialog";
import { PropertyBackgroundImageComponent } from "./property-background-image";
import { GradientComponent } from "./property-background-gradient-dialog/gradient/gradient.component";
import { XnFileModule } from "../xn-file/XnFileModule";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(),
        primengModule.DialogModule,
        MaterialModule,
        DragulaModule,
        ResizableModule,
        CollapseModule.forRoot(),
        PopoverModule.forRoot(),
        XnClickOutsideModule,
        WjInputModule,
        AngularMultiSelectModule,
        XnWjDropdownHelperModule,
        XnPipeModule,
        XnTooltipModule,
        XnFileModule,
        XnInputNumericModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
    ],
    declarations: [
        PropertyPanelComponent,
        PropertyPanelDateFormatDialogComponent,
        PropertyPanelGridComponent,
        PropertyPanelGridFieldDataDialogComponent,
        PropertyPanelGridValueComponent,
        PropertyPanelGridValueDialogComponent,
        PropertyPanelOrderFieldDialogComponent,
        PropertyPanelShowDropdownFocusComponent,
        PropertyPanelOrderFieldDisplayItemComponent,
        PropertyBackgroundGradientComponent,
        PropertyBackgroundImageComponent,
        GradientComponent,
    ],
    exports: [PropertyPanelComponent, PropertyPanelGridComponent],
})
export class PropertyPanelModule {}
