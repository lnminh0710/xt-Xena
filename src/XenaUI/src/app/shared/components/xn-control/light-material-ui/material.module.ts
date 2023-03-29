import { NgModule } from '@angular/core';
import { MatButtonModule } from './button';
import { MatCheckboxModule } from './checkbox';
import { MatRadioModule } from './radio';
import { MatSlideToggleModule } from './slide-toggle';

@NgModule({
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
  ],
})
export class MaterialModule {}
