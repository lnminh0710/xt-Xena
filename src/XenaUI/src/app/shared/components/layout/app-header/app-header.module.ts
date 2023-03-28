import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    BreadcrumbMasterComponent,
    BreadcrumbItemComponent,
    UserBoxComponent,
} from "./components";
import { AppHeaderComponent } from "./container";
import { XnMenuBarModule } from "app/shared/components/xn-menu-bar/xn-menu-bar.module";
import { ParkedItemModule } from "app/shared/components/parked-item/parked-item.module";
import { BsDropdownModule } from "ngx-bootstrap/dropdown/bs-dropdown.module";
import { MatButtonModule } from "app/shared/components/xn-control/light-material-ui/button";
import { NotificationBoxModule } from "app/shared/components/notification-box/notification-box.module";
import { UserManagementModule } from "app/shared/components/form";
import { WjCoreModule } from "wijmo/wijmo.angular2.core";
import { WjInputModule } from "wijmo/wijmo.angular2.input";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { XnImageLoaderModule } from "app/shared/directives/xn-image-loader/xn-image-loader.module";
import { XnTooltipModule } from "app/shared/directives/xn-tooltip/xn-tooltip.module";
import { AngularMultiSelectModule } from "../../xn-control/xn-dropdown";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        CommonModule,
        XnMenuBarModule,
        ParkedItemModule,
        BsDropdownModule,
        MatButtonModule,
        NotificationBoxModule,
        UserManagementModule,
        WjCoreModule,
        WjInputModule,
        AngularMultiSelectModule,
        PerfectScrollbarModule.forRoot(),
        XnImageLoaderModule,
        XnTooltipModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
    ],
    declarations: [
        AppHeaderComponent,
        BreadcrumbMasterComponent,
        BreadcrumbItemComponent,
        UserBoxComponent,
    ],
    exports: [AppHeaderComponent],
})
export class AppHeaderModule {}
