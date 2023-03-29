import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XnImageLoaderModule } from 'app/shared/directives/xn-image-loader/xn-image-loader.module';
import { XnGalleria } from './xn-galleria.component';

@NgModule({
  imports: [CommonModule, XnImageLoaderModule],
  declarations: [XnGalleria],
  exports: [XnGalleria],
})
export class XnGalleriaModule {}
