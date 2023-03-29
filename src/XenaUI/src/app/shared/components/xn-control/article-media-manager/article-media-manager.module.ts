import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ArticleGalleryFormComponent,
  ArticleImageGalleryComponent,
} from './components';
import { ArticleMediaManagerComponent } from './container';
import { XnImageLoaderModule } from 'app/shared/directives/xn-image-loader/xn-image-loader.module';
import { MatButtonModule } from 'app/shared/components/xn-control/light-material-ui/button';
import { FileUploadModule } from 'app/shared/components/xn-file';
import { XnGalleriaModule } from 'app/shared/components/xn-control/xn-galleria/xn-galleria.module';
import * as primengModule from 'primeng/primeng';
import { PopoverModule } from 'ngx-bootstrap';
import { LabelTranslationModule } from 'app/shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from 'app/shared/directives/xn-resource-translation';

@NgModule({
  imports: [
    CommonModule,
    primengModule.DialogModule,
    FileUploadModule,
    MatButtonModule,
    ReactiveFormsModule,
    LabelTranslationModule,
    XnResourceTranslationModule,
    XnGalleriaModule,
    PopoverModule.forRoot(),
    XnImageLoaderModule,
  ],
  declarations: [
    ArticleGalleryFormComponent,
    ArticleImageGalleryComponent,
    ArticleMediaManagerComponent,
  ],
  exports: [ArticleMediaManagerComponent, ArticleImageGalleryComponent],
})
export class ArticleMediaManagerModule {}
