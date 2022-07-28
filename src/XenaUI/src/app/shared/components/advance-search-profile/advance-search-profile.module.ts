import { NgModule } from '@angular/core';
import { AdvanceSearchProfileComponent } from './advance-search-profile.component';
import { ConfirmNewProfileComponent } from './confirm-new-profile';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "app/shared/components/xn-control/light-material-ui/material.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { FormsModule } from '@angular/forms';
import { TooltipModule } from "ngx-bootstrap";
import * as primengModule from 'primeng/primeng';
import { XnAgGridModule } from 'app/shared/components/xn-control/xn-ag-grid';
import { DatatableService,
    AccessRightsService,
    PropertyPanelService,
    ModalService } from 'app/services';
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        TooltipModule.forRoot(),
        PerfectScrollbarModule,
        primengModule.DialogModule,
        XnAgGridModule,
        LabelTranslationModule,
        XnResourceTranslationModule
    ],
    declarations: [
        AdvanceSearchProfileComponent,
        ConfirmNewProfileComponent
    ],
    exports: [
        AdvanceSearchProfileComponent
    ],
    providers: [
        DatatableService,
        AccessRightsService,
        PropertyPanelService,
        ModalService
    ]
})
export class AdvanceSearchProfileModule { }
