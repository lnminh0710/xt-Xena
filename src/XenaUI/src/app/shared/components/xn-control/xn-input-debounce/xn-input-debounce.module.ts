import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { InputDebounceComponent } from "./xn-input-debounce.component";
import { MatButtonModule } from "../light-material-ui/button";

@NgModule({
    imports: [CommonModule, FormsModule, MatButtonModule],
    declarations: [InputDebounceComponent],
    exports: [InputDebounceComponent],
})
export class XnInputDebounceModule {}
