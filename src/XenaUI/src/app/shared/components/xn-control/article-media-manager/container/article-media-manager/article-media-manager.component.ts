import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import {
    ArticleService,
    AppErrorHandler
} from 'app/services';
import { ArticleMediaModel, ArticleGroupsMedia, SharingTreeMedia } from 'app/models/article-media.model';
import { GalleryImage, Module, WidgetDetail } from 'app/models';
import { UploadFileMode, Configuration } from 'app/app.constants';
import { FileUploadComponent } from 'app/shared/components/xn-file';
import { ArticleImageGalleryComponent } from '../../components/article-image-gallery';
import { Subscription } from 'rxjs/Subscription';
import { BaseWidget } from 'app/pages/private/base';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Uti } from 'app/utilities';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
    selector: 'article-media-manager',
    styleUrls: ['./article-media-manager.component.scss'],
    templateUrl: './article-media-manager.component.html'
})

export class ArticleMediaManagerComponent extends BaseWidget implements OnInit, OnDestroy {
    public uploadFileMode: UploadFileMode = UploadFileMode.ArticleMedia;
    private _idArticle: number;
    public hasBaseDropZoneOver = false;
    public showDialog = false;
    public dropFiles: File[];
    public imageMaxSizeLimit = this.configuration.imageMaxSizeLimit;
    private articleServiceSubscription: Subscription;
    private _currentModule = new BehaviorSubject<Module>(null);

    @ViewChild('fileUpload') fileUpload: FileUploadComponent;
    @ViewChild(ArticleImageGalleryComponent) articleImageGalleryComponent: ArticleImageGalleryComponent;

    @Input()
    set idArticle(value) {
        this._idArticle = value;
        this.getArticleMedia();
    }

    get idArticle() {
        return this._idArticle;
    }

    @Input()
    set widgetDetail(data: WidgetDetail) {
        if (!data) {
            return;
        }
        this._currentModule.subscribe((ofModule: Module) => {
            this.appErrorHandler.executeAction(() => {
                if (ofModule && data.widgetDataType &&
                    data.widgetDataType.listenKey &&
                    data.widgetDataType.listenKey.main) {
                    const key = data.widgetDataType.listenKey.main.key;
                    this.idArticle = data.widgetDataType.listenKeyRequest(ofModule.moduleNameTrim)[key];
                }
            });
        });
    }

    @Input()
    uploadMode: boolean;

    @Input() set currentModule(value: Module) {
        this._currentModule.next(value);
    }

    get currentModule() {
        return this._currentModule.getValue();
    }

    galleryImages: Array<GalleryImage>;

    @Output() noEntryDataEvent: EventEmitter<any> = new EventEmitter();
    @Output() saveDataSuccess: EventEmitter<any> = new EventEmitter();

    constructor(
        private articleService: ArticleService,
        private appErrorHandler: AppErrorHandler,
        private configuration: Configuration,
        private toasterService: ToasterService
    ) {
        super();
    }

    public ngOnInit() {
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private getArticleMedia() {
        if (this.idArticle) {
            this.articleServiceSubscription = this.articleService.getArticleMedia(this.idArticle).subscribe(rs => {
                this.appErrorHandler.executeAction(() => {
                    if (!rs || !rs.item.collectionData) {
                        this.galleryImages = [];
                        return;
                    }
                    const collectionData: Array<any> = rs.item.collectionData;
                    this.galleryImages = [];
                    collectionData.forEach(data => {
                        if (data.mediaName.value) {
                            const articleImage = new GalleryImage({                                
                                source: Uti.getFileUrl(data.mediaName.value, this.uploadFileMode),
                                title: data.mediaTitle.value,
                                description: data.mediaDescription.value,
                                isMain: data.isActive.value === 'True',
                                isDeleted: data.isDeleted.value === 'True'
                            });
                            articleImage['article'] = data;
                            this.galleryImages.push(articleImage);
                        }
                    });
                    this.noEntryDataEvent.emit(this.galleryImages.length == 0);
                    this.emitCompletedRenderEvent();
                });
            });
        }
    }

    onCompleteUploadItem(event) {
        const response = event.response;
        const articleGroupsMedia: ArticleGroupsMedia = new ArticleGroupsMedia({
            idArticle: this.idArticle,
            isActive: false,
        });

        const sharingTreeMedia: SharingTreeMedia = new SharingTreeMedia({
            idSharingTreeGroups: 1,
            idRepTreeMediaType: 1,
            mediaName: response.fileName,
            mediaSize: response.size,
            mediaRelativePath: response.path,
            mediaTitle: '',
            mediaDescription: ''
        });

        const articleMediaModel: ArticleMediaModel = new ArticleMediaModel({
            articleGroupsMedia: articleGroupsMedia,
            sharingTreeMedia: sharingTreeMedia
        });

        this.articleServiceSubscription = this.articleService.insertArticleMedia(articleMediaModel).subscribe(rs => {
            this.appErrorHandler.executeAction(() => {
                if (rs) {
                    this.getArticleMedia();
                }
            });
        });
    }

    onMainImageChange(event: any) {
        const activeImage: GalleryImage = event.activeImage;
        const previousActiveImages: Array<GalleryImage> = event.previousActiveImages;
        this.updateStatusArticleImage(activeImage);
        previousActiveImages.forEach(previousActiveImage => {
            this.updateStatusArticleImage(previousActiveImage);
        });
    }

    onRemoveImage(image: GalleryImage) {
        this.updateStatusArticleImage(image);
    }

    private updateStatusArticleImage(image: GalleryImage) {
        const articleMediaModel: any = {
            articleGroupsMedia: {
                idArticleGroupsMedia: image['article'].idArticleGroupsMedia.value,
                isActive: image.isMain,
                isDeleted: image.isDeleted
            },
            sharingTreeMedia: {
                idSharingTreeMedia: image['article'].idSharingTreeMedia.value
            }
        };

        this.articleServiceSubscription = this.articleService.updateArticleMedia(articleMediaModel).subscribe(rs => {
            if (rs) {
                this.toasterService.pop('success', 'Success', 'Article Media updated successfully');
            }
        });
    }

    public close() {
        this.showDialog = false;
        if (this.fileUpload)
            this.fileUpload.clearItem();
        this.emitCompletedRenderEvent();
    }

    onSaveArticleMediaSuccess(event) {
        this.getArticleMedia();
        this.saveDataSuccess.emit();
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public onFileDrop(event) {
        if (event && event.length) {
            this.showDialog = true;
            this.dropFiles = event;
        }
        return false;
    }
}
