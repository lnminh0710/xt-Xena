import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AngularSplitModule } from "angular-split";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import * as primengModule from 'primeng/primeng';
import { MaterialModule } from "../xn-control/light-material-ui/material.module";
import { XnInputDebounceModule } from "../xn-control/xn-input-debounce/xn-input-debounce.module";
import { WjCoreModule } from "wijmo/wijmo.angular2.core";
import { WjGridModule } from "wijmo/wijmo.angular2.grid";
import { NotificationArchiveViewComponent } from "./notification-archive-view";
import { NotificationArchivePopupComponent } from "./notification-archive-popup";
import { NotificationDetailComponent } from "./notification-detail";
import { NotificationDetailPopupComponent } from "./notification-detail-popup";
import { NotificationListViewChildComponent, NotificationListViewMainComponent } from "./notification-list-view";
import { XnImageLoaderModule } from "app/shared/directives/xn-image-loader/xn-image-loader.module";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';
@NgModule({
    imports: [
        CommonModule,
        AngularSplitModule,
        PerfectScrollbarModule.forRoot(),
        primengModule.DialogModule,
        MaterialModule,
        XnInputDebounceModule,
        WjCoreModule,
        WjGridModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
        XnImageLoaderModule
    ],
    declarations: [
        NotificationArchivePopupComponent,
        NotificationArchiveViewComponent,
        NotificationDetailComponent,
        NotificationDetailPopupComponent,
        NotificationListViewChildComponent,
        NotificationListViewMainComponent
    ],
    exports: [
        NotificationListViewMainComponent
    ]
})
export class XnNotificationModule { }
