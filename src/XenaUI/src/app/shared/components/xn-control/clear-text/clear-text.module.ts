import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClearTextComponent } from "./clear-text.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ClearTextComponent
    ],
    exports: [
        ClearTextComponent
    ]
})
export class ClearTextModule { }
