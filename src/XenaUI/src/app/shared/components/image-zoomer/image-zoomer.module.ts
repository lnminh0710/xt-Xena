import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageZoomerComponent } from "./image-zoomer.component";
import { XnTooltipModule } from "app/shared/directives/xn-tooltip/xn-tooltip.module";

@NgModule({
    imports: [CommonModule, XnTooltipModule],
    declarations: [ImageZoomerComponent],
    exports: [ImageZoomerComponent],
})
export class ImageZoomerModule {}
