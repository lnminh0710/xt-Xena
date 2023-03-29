import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { XnFileUploadModule } from 'app/shared/components/xn-file/xn-file-upload';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatButtonModule } from 'app/shared/components/xn-control/light-material-ui/button';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';

@NgModule({
  imports: [
    CommonModule,
    XnFileUploadModule,
    MatButtonModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
    PerfectScrollbarModule.forRoot(),
  ],
  declarations: [FileUploadComponent],
  exports: [FileUploadComponent],
})
export class FileUploadModule {}
