import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { ArticleImageGalleryComponent } from '../article-image-gallery';
import { FormControl, FormGroup } from '@angular/forms';
import { ArticleService, AppErrorHandler } from 'app/services';
import { GalleryImage } from 'app/models';
import { Subscription } from 'rxjs/Subscription';
import { Uti } from 'app/utilities';

@Component({
  selector: 'article-gallery-form',
  styleUrls: ['./article-gallery-form.component.scss'],
  templateUrl: './article-gallery-form.component.html',
})
export class ArticleGalleryFormComponent implements OnDestroy {
  private _galleryImages: Array<GalleryImage>;
  activeImage: GalleryImage;
  private articleServiceSubscription: Subscription;

  articleMediaForm: FormGroup;

  @Input() get galleryImages(): Array<GalleryImage> {
    return this._galleryImages;
  }

  @Input() isShowEditForm = true;

  @Output()
  onSaveFormSuccess = new EventEmitter<GalleryImage>();

  set galleryImages(value: Array<GalleryImage>) {
    if (!value) return;
    this._galleryImages = value;
    this.activeImage = this._galleryImages[0];
    for (let i = 0; i < this._galleryImages.length; i++) {
      if (this._galleryImages[i].isSelected) {
        this.activeImage = this._galleryImages[i];
        break;
      }
    }
    this.createFormGroup(this.activeImage);
  }

  constructor(
    private articleService: ArticleService,
    private appErrorHandler: AppErrorHandler
  ) {}

  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  private createFormGroup(image: GalleryImage) {
    const articleMedia: any = image['article'];
    this.articleMediaForm = new FormGroup({
      articleGroupsMedia: new FormGroup({
        idSharingTreeMedia: new FormControl(
          articleMedia.idSharingTreeMedia.value
        ),
        idArticleGroupsMedia: new FormControl(
          articleMedia.idArticleGroupsMedia.value
        ),
      }),
      sharingTreeMedia: new FormGroup({
        idSharingTreeMedia: new FormControl(
          articleMedia.idSharingTreeMedia.value
        ),
        mediaTitle: new FormControl(articleMedia.mediaTitle.value),
        mediaDescription: new FormControl(articleMedia.mediaDescription.value),
        mediaNotes: new FormControl(articleMedia.mediaNotes.value),
      }),
    });
  }

  onSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (valid) {
      this.articleServiceSubscription = this.articleService
        .updateArticleMedia(value)
        .subscribe((rs) => {
          this.appErrorHandler.executeAction(() => {
            this.activeImage.title = value.sharingTreeMedia.mediaTitle;
            this.activeImage.description =
              value.sharingTreeMedia.mediaDescription;
            this.onSaveFormSuccess.emit(this.activeImage);
          });
        });
    }
  }

  onImageClicked(event) {
    this.activeImage = event.image;
    this.createFormGroup(this.activeImage);
  }
}
