import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {} from "ngx-perfect-scrollbar";
import * as primengModule from "primeng/primeng";
import { MatButtonModule } from "app/shared/components/xn-control/light-material-ui/button";
import { CellEditDialogComponent } from "./cell-edit-dialog.component";
import { LabelTranslationModule } from "app/shared/components/label-translation/label-translation.module";
import { XnResourceTranslationModule } from "app/shared/directives/xn-resource-translation";

@NgModule({
    imports: [
        CommonModule,
        LabelTranslationModule,
        XnResourceTranslationModule,
        primengModule.DialogModule,
    ],
    declarations: [CellEditDialogComponent],
    exports: [CellEditDialogComponent],
})
export class CellEditDialogModule {}
