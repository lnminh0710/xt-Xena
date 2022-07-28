import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { XnInputNumericDirective } from 'app/shared/directives/xn-input-numeric/xn-input-numeric.directive';
import { DecimalPipe } from '@angular/common';

@NgModule({
    imports: [ReactiveFormsModule],
    declarations: [XnInputNumericDirective],
    exports: [XnInputNumericDirective],
    providers: [DecimalPipe]
})
export class XnInputNumericModule { }
