import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelCountryCheckListComponent } from './selection-country-check-list.component';
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { MaterialModule } from "app/shared/components/xn-control/light-material-ui/material.module";
import { FormsModule } from '@angular/forms';
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';
@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
        FormsModule,
        PerfectScrollbarModule.forRoot(),
    ],
    declarations: [
        SelCountryCheckListComponent
    ],
    exports: [
        SelCountryCheckListComponent
    ]
})
export class SelCountryCheckListModule { }
