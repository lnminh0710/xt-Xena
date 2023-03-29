import {
  Component,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import sortBy from 'lodash-es/sortBy';
import { GalleryImage, Module, MessageModel } from 'app/models';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ModalService } from 'app/services';
import { MessageModal } from 'app/app.constants';

@Component({
  selector: 'article-image-gallery',
  styleUrls: ['./article-image-gallery.component.scss'],
  templateUrl: './article-image-gallery.component.html',
})
export class ArticleImageGalleryComponent {
  private _galleryImages: Array<GalleryImage>;
  private isDblClick = false;

  @Input() currentModule: Module;
  @Input() isShowIsMain = true;

  @Input()
  set galleryImages(value) {
    this._galleryImages = value;
    if (this._galleryImages && this._galleryImages.length > 0) {
      this._galleryImages = this._galleryImages.filter(
        (p) => p.isDeleted === false
      );
      this._galleryImages = sortBy(this._galleryImages, function (item) {
        return item.isMain ? 0 : 1;
      });
    }
  }

  get galleryImages() {
    return this._galleryImages;
  }

  @Output() onMainImageChange = new EventEmitter<any>();

  @Output()
  onSaveArticleMediaSuccess = new EventEmitter<GalleryImage>();

  @Output()
  onRemoveImage = new EventEmitter<GalleryImage>();

  @Output()
  returnImageUrlAction = new EventEmitter<any>();

  private isShowGallery: boolean;
  public displayImageDialog = false;

  constructor(
    private modalService: ModalService,
    private _ref: ChangeDetectorRef
  ) {}

  onMainChange(image: GalleryImage, pop: PopoverDirective) {
    const previousActiveImages = this.galleryImages.filter((p) => p.isMain);
    if (previousActiveImages.length > 0) {
      previousActiveImages.forEach((previousActiveImage) => {
        previousActiveImage.isMain = false;
      });
    }
    image.isMain = true;

    this.galleryImages = sortBy(this.galleryImages, function (item) {
      return item.isMain ? 0 : 1;
    });

    this.onMainImageChange.emit({
      activeImage: image,
      previousActiveImages: previousActiveImages,
    });
    pop.hide();
  }

  openImageDetail(image: GalleryImage) {
    setTimeout(() => {
      if (this.isDblClick) return;
      this.displayImageDialog = true;
      this.galleryImages.forEach((galleryImage) => {
        galleryImage.isSelected = false;
      });
      image.isSelected = true;
      this.galleryImages = Object.assign([], this.galleryImages);
      setTimeout(() => {
        this.isShowGallery = true;
      }, 500);
      this._ref.detectChanges();
    }, 300);
  }

  onSaveFormSuccess(event) {
    this.displayImageDialog = false;
    this.onSaveArticleMediaSuccess.emit(event);
  }

  removeImage(image: GalleryImage, pop: PopoverDirective) {
    pop.hide();
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        headerText: 'Delete Item',
        messageType: MessageModal.MessageType.error,
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Do_You_Want_To_Delete_The_Selected_Items',
          },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.danger,
        callBack1: () => {
          image.isDeleted = true;
          this._galleryImages = this._galleryImages.filter((p) => p !== image);
          this.onRemoveImage.emit(image);
        },
      })
    );
  }

  close() {
    this.displayImageDialog = false;
  }

  public onDblclick(image) {
    this.isDblClick = true;
    setTimeout(() => {
      this.isDblClick = false;
    }, 500);
    this.returnImageUrlAction.emit(image.source.split('?')[1]);
  }
}
