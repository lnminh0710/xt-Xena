import { NgModule } from '@angular/core';
import { APP_PIPES } from 'app/pipes';

@NgModule({
    imports: [

    ],
    declarations: [
        ...APP_PIPES
    ],
    exports: [
        ...APP_PIPES
    ]
})
export class XnPipeModule { }
