import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { XnClickOutsideModule } from "app/shared/directives/xn-click-outside/xn-click-outside.module";
import {
    AngularMultiSelect,
    ListFilterPipe,
    Item,
    TemplateRenderer,
    VirtualScrollComponent,
} from "app/shared/components/xn-control/xn-dropdown";
import {
    ScrollDirective,
    styleDirective,
    setPosition,
    SafeHtmlPipe,
    RemoveHtmlPipe,
} from "app/shared/components/xn-control/xn-dropdown/clickOutside";
import {
    Badge,
    Search,
    CIcon,
} from "app/shared/components/xn-control/xn-dropdown/menu-item";
import { DataService } from "app/shared/components/xn-control/xn-dropdown/multiselect.service";
import { XnInputNumericModule } from "app/shared/directives/xn-input-numeric/xn-input-numeric.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        XnClickOutsideModule,
        XnInputNumericModule,
    ],
    declarations: [
        AngularMultiSelect,
        ScrollDirective,
        styleDirective,
        ListFilterPipe,
        Item,
        TemplateRenderer,
        Badge,
        Search,
        setPosition,
        VirtualScrollComponent,
        CIcon,
        SafeHtmlPipe,
        RemoveHtmlPipe,
    ],
    exports: [
        AngularMultiSelect,
        ScrollDirective,
        styleDirective,
        ListFilterPipe,
        Item,
        TemplateRenderer,
        Badge,
        Search,
        setPosition,
        VirtualScrollComponent,
        CIcon,
        SafeHtmlPipe,
        RemoveHtmlPipe,
        XnInputNumericModule,
    ],
    providers: [DataService, RemoveHtmlPipe],
})
export class AngularMultiSelectModule {}
