import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CircleProgressComponent } from "./xn-circle-progress.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        CircleProgressComponent
    ],
    exports: [
        CircleProgressComponent
    ]
})
export class CircleProgressModule { }
