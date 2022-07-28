
import {
    Component,
    OnInit,
    Input,
    Output,
    OnDestroy,
    EventEmitter,
    ChangeDetectorRef,
    ViewChild
} from '@angular/core';
import {
    BaseComponent
} from 'app/pages/private/base';
import {
    Router
} from '@angular/router';
import { Uti } from 'app/utilities';
import {
    NotificationService,
    AppErrorHandler, PropertyPanelService
} from 'app/services';
import { Subscription } from 'rxjs/Subscription';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { User } from 'app/models';
import {
    MainNotificationTypeEnum,
    NotificationStatusEnum
} from 'app/app.constants';
import { NotificationListViewChildComponent } from '../notification-list-view-child';
import { format } from 'date-fns/esm';
import { parse } from 'date-fns/esm';

@Component({
    selector: 'notification-list-view-main',
    styleUrls: ['./notification-list-view-main.component.scss'],
    templateUrl: './notification-list-view-main.component.html'
})
export class NotificationListViewMainComponent extends BaseComponent implements OnInit, OnDestroy {
    public isShowArchivePopup: boolean = false;
    public isShowDetailPopup: boolean = false;
    public isDataArchived: boolean = false;
    public archiveTitle: string = '';
    public typeArchive: string = '';
    public detailData: any = {};
    private userData: User = new User();

    @Input() autoLetterRawList: Array<any> = [];
    @Input() feedbackRawList: Array<any> = [];
    @Input() sendToAdminRawList: Array<any> = [];

    @Input() autoLetterList: Array<any> = [];
    @Input() feedbackList: Array<any> = [];
    @Input() sendToAdminList: Array<any> = [];

    @Output() updateAutoClose: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('autoLetterListComponent') autoLetterListComponent: NotificationListViewChildComponent;
    @ViewChild('feedbackListComponent') feedbackListComponent: NotificationListViewChildComponent;
    @ViewChild('sendToAdminListComponent') sendToAdminListComponent: NotificationListViewChildComponent;

    private globalDateFormat: string = null;

    constructor(private notificationService: NotificationService,
        private appErrorHandler: AppErrorHandler,
        private toasterService: ToasterService,
        private changeDetectorRef: ChangeDetectorRef,
        private propertyPanelService: PropertyPanelService,
        private uti: Uti,
        router?: Router
    ) {
        super(router);
        this.userData = (new Uti()).getUserInfo();
    }
    public ngOnInit() {
        this.setGlobalFormat();
    }
    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public archiveItemHandler(typeArchive: any, updateAutoClose: boolean) {
        this.typeArchive = typeArchive;
        this.updateAutoClose.emit(updateAutoClose);
    }
    public archiveItemOkActionHandler(dataArchive: any, typeArchive: string) {
        this.typeArchive = typeArchive;
        this.archivedItem([dataArchive], () => {
            Uti.removeItemInArray(this[this.listName], dataArchive, 'IdNotification');
            this.updateAutoClose.emit(true);
        });
    }
    public archiveAllItemOkActionHandler(typeArchive) {
        this.typeArchive = typeArchive;
        this.archivedItem(this[this.listName], () => {
            this[this.listName].length = 0;
            this.updateAutoClose.emit(true);
        });
    }
    public showDetailItemHandler(item: any, typeArchive) {
        this.typeArchive = typeArchive;
        this.showDetailItemActionHandler(item, this[this.rawName]);
    }
    public archiveAllItemActionHandler() {
        this.updateAutoClose.emit(false);
    }
    public archiveAllItemCancelActionHandler() {
        this.updateAutoClose.emit(true);
    }
    public showArchiveListActionHandler(typeArchive: string) {
        this.typeArchive = typeArchive;
        this.isShowArchivePopup = true;
        this.updateAutoClose.emit(false);
    }
    public closeArchivePopupActionHandler() {
        this.isShowArchivePopup = false;
        this.typeArchive = '';
        setTimeout(() => {
            this.updateAutoClose.emit(true);
        }, 200);
    }
    public closeDetailPopupActionHandler() {
        this.isShowDetailPopup = false;
        this.detailData = {};
        if (this.isDataArchived) return;
        setTimeout(() => {
            this.updateAutoClose.emit(true);
        }, 200);
        this.removeActiveItem();
    }
    public archiveItemFromPopupActionHandler() {
        this.archivedItem([this.detailData], () => {
            Uti.removeItemInArray(this[this.typeArchive + 'List'], this.detailData, 'IdNotification');
            this.closeDetailPopupActionHandler();
        });
    }
    public showDetailActionHandler(item: any) {
        this.notificationService.getNotifications({
            IdLoginNotification: this.userData.id,
            MainNotificationType: MainNotificationTypeEnum[Uti.upperCaseFirstLetter(this.typeArchive)],
            NotificationStatus: NotificationStatusEnum.Archive,
            IdNotification: item.id
        }).subscribe((response: any) => {
            this.appErrorHandler.executeAction(() => {
                if (!Uti.isResquestSuccess(response) || !response.item.data || response.item.data.length < 2) {
                    return;
                }

                let dataItem = Object.assign({}, response.item.data[1][0]);
                dataItem.Children = response.item.data[1].filter(x => !Uti.isNullUndefinedEmptyObject(x.PicturePath));

                const createDate = Uti.parseISODateToDate(dataItem.SysCreateDate); //parse(dataItem.CreateDate, 'dd.MM.yyyy', new Date());
                dataItem.CreateDateDisplay = this.uti.formatLocale(createDate, this.globalDateFormat + ' HH:mm:ss');

                this.isDataArchived = true;
                this.isShowDetailPopup = true;
                this.detailData = dataItem;
                this.changeDetectorRef.detectChanges();
                this.updateAutoClose.emit(false);
            });
        });
    }
    
    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/
    
    private setGlobalFormat() {
        if (this.propertyPanelService.globalProperties && this.propertyPanelService.globalProperties.length) {
            this.globalDateFormat = this.propertyPanelService.buildGlobalDateFormatFromProperties(this.propertyPanelService.globalProperties);
        }
    }
    private removeActiveItem() {
        for (let item of this[this.typeArchive + 'List']) {
            item.isFocused = false;
        }
    }
    private showDetailItemActionHandler(item: any, rawData: Array<any>) {
        this.isDataArchived = false;
        this.isShowDetailPopup = true;
        item.Children = rawData.filter(x => x.IdNotification === item.IdNotification && !Uti.isNullUndefinedEmptyObject(item.PicturePath));
        this.detailData = item;
        this.updateAutoClose.emit(false);
    }
    private archivedItem(items: Array<any>, callBack?: Function) {
        this.notificationService.setArchivedNotifications(this.buildArchivedData(items))
            .subscribe((responseData: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(responseData) || !responseData.item.returnID) return;
                    if (callBack) {
                        callBack();
                    }
                    this.archiveItemSuccess();
                });
            });
    }

    private archiveItemSuccess() {
        this.toasterService.pop('success', 'Success', 'Notification is archived');
        this[this.typeArchive + 'ListComponent'].refreshScrollBar();
    }

    private buildArchivedData(items: Array<any>): Array<any> {
        return items.map(x => {
            return {
                IdNotification: x.IdNotification,
                IsActive: '0'
            };
        });
    }
    private get listName(): string {
        return this.typeArchive + 'List';
    }
    private get rawName(): string {
        return this.typeArchive + 'RawList';
    }
}
