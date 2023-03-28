import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from "@angular/core";
import { ModuleList } from "app/pages/private/base";
import {
    NotificationService,
    AppErrorHandler,
    PropertyPanelService,
} from "app/services";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { AppState } from "app/state-management/store";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";

import { Uti } from "app/utilities";
import { User } from "app/models";
import {
    MainNotificationTypeEnum,
    NotificationStatusEnum,
} from "app/app.constants";
import uniqBy from "lodash-es/uniqBy";
import {
    CustomAction,
    XnCommonActions,
} from "app/state-management/store/actions";
import orderBy from "lodash-es/orderBy";
import { format } from "date-fns/esm";
import { parse } from "date-fns/esm";

@Component({
    selector: ".notificationsBox",
    styleUrls: ["./notification-box.component.scss"],
    templateUrl: "./notification-box.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBoxComponent implements OnInit, OnDestroy {
    public totalItemCounter: number = 0;
    public autoLetterRawList: Array<any> = [];
    public feedbackRawList: Array<any> = [];
    public sendToAdminRawList: Array<any> = [];
    public autoLetterList: Array<any> = [];
    public feedbackList: Array<any> = [];
    public sendToAdminList: Array<any> = [];

    private reloadNotificationStateSubscription: Subscription;
    private userData: User = new User();

    private globalDateFormat: string = null;
    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;

    @Output() notificationCounter: EventEmitter<any> = new EventEmitter();
    @Output() updateAutoClose: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private notificationService: NotificationService,
        private dispatcher: ReducerManagerDispatcher,
        private appErrorHandler: AppErrorHandler,
        private store: Store<AppState>,
        private propertyPanelService: PropertyPanelService,
        private uti: Uti
    ) {
        this.userData = new Uti().getUserInfo();
        this.globalPropertiesState = this.store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
    }

    public ngOnInit() {
        //this.getNotificationData();
        this.subscribeData();
        this.notificationCounter.emit();
        // this.createFakeDataForAutoLetter();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public itemCounterHandler($event) {
        this.totalItemCounter = $event;
        this.changeDetectorRef.markForCheck();
    }
    public preventClose(event: MouseEvent) {
        event.stopImmediatePropagation();
    }
    public updateDropdownAutoClose(autoClose?: boolean) {
        this.updateAutoClose.emit(autoClose);
        this.changeDetectorRef.markForCheck();
    }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/
    private subscribeData() {
        this.globalPropertiesStateSubscription =
            this.globalPropertiesState.subscribe((globalProperties: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (globalProperties && globalProperties.length) {
                        const globalDateFormat =
                            this.propertyPanelService.buildGlobalDateFormatFromProperties(
                                globalProperties
                            );

                        //if settings changed -> reformat list items
                        if (globalDateFormat != this.globalDateFormat) {
                            if (this.globalDateFormat) {
                                this.globalDateFormat = globalDateFormat;
                                this.formatList(this.sendToAdminList);
                                this.formatList(this.feedbackList);
                            } else {
                                this.globalDateFormat = globalDateFormat;
                                this.getNotificationData();
                            }
                        }
                    }
                });
            });

        this.reloadNotificationStateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return action.type === XnCommonActions.RELOAD_FEEDBACK_DATA;
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.getNotificationData();
                });
            });
    }

    private getNotificationData() {
        this.getAutoLetterData();
        this.getFeedbackData();
        this.getSendToAdminData();
    }
    private getAutoLetterData() {
        this.notificationService
            .getNotifications({
                IdLoginNotification: this.userData.id,
                MainNotificationType: MainNotificationTypeEnum.AutoLetter,
                NotificationStatus: NotificationStatusEnum.New,
            })
            .subscribe((response: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.data ||
                        response.item.data.length < 2
                    ) {
                        this.sendToAdminList = [];
                        this.changeDetectorRef.markForCheck();
                        return;
                    }
                    this.buildAutoLetterResultData(response.item.data[1]);
                    this.changeDetectorRef.markForCheck();
                });
            });
    }
    private getFeedbackData() {
        this.notificationService
            .getNotifications({
                IdLoginNotification: this.userData.id,
                MainNotificationType: MainNotificationTypeEnum.Feedback,
                NotificationStatus: NotificationStatusEnum.New,
            })
            .subscribe((response: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.data ||
                        response.item.data.length < 2
                    ) {
                        this.feedbackRawList = [];
                        this.feedbackList = [];
                        this.changeDetectorRef.markForCheck();
                        return;
                    }
                    this.buildFeedbackResultData(response.item.data[1]);
                    this.changeDetectorRef.markForCheck();
                });
            });
    }
    private getSendToAdminData() {
        this.notificationService
            .getNotifications({
                IdLoginNotification: this.userData.id,
                MainNotificationType: MainNotificationTypeEnum.SendToAdmin,
                NotificationStatus: NotificationStatusEnum.New,
            })
            .subscribe((response: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.data ||
                        response.item.data.length < 2
                    ) {
                        this.sendToAdminList = [];
                        this.changeDetectorRef.markForCheck();
                        return;
                    }
                    this.buildSendToAdminResultData(response.item.data[1]);
                    this.changeDetectorRef.markForCheck();
                });
            });
    }
    private buildAutoLetterResultData(responseData: Array<any>) {
        this.autoLetterRawList = responseData;
        this.autoLetterList = this.buildResultData(responseData);
        this.formatList(this.autoLetterList);
    }
    private buildFeedbackResultData(responseData: Array<any>) {
        this.feedbackRawList = responseData;
        this.feedbackList = this.buildResultData(responseData);
        this.formatList(this.feedbackList);
    }
    private buildSendToAdminResultData(responseData: Array<any>) {
        this.sendToAdminRawList = responseData;
        this.sendToAdminList = this.buildResultData(responseData);
        this.formatList(this.sendToAdminList);
    }
    private buildResultData(responseData: Array<any>): Array<any> {
        return orderBy(
            uniqBy(responseData, "IdNotification"),
            "IdNotification",
            "desc"
        );
    }

    private formatList(listItems: Array<any>) {
        if (!listItems || !listItems.length || !this.globalDateFormat) return;

        for (let item of listItems) {
            const createDate = Uti.parseISODateToDate(item.SysCreateDate); //parse(item.CreateDate, 'dd.MM.yyyy', new Date());
            item.CreateDateDisplay = this.uti.formatLocale(
                createDate,
                this.globalDateFormat + " HH:mm:ss"
            );
        } //for
    }

    private createFakeDataForAutoLetter() {
        let _temp = [];
        for (let i = 0; i < 100; i++) {
            _temp.push({
                IdRepMainNotificationType: 3,
                MainNotificationType: "AutoLetter",
                IdRepNotificationType: 3,
                NotificationType: "Improvement",
                IdNotification: i + 1,
                Subject: "[Normal]-[Improvement]: " + Uti.randLetter(),
                MainComment: Uti.randLetter(),
                IdLogin: 3,
                ServerIP: "::1",
                ClientIP: "::1",
                ClientOS: "Windows",
                BrowserType: "Chrome",
                IsActive: true,
                IdNotificationItems: null,
                PicturePath: null,
                Comment: null,
                CreateDate: "07.06.2020",
                SysCreateDate: "2018-11-07T13:35:04.22",
                LoginName: "trungdt_xena",
                File: "XenaUploadFile\\Templates\\Report_Missing_Word_Template.xlsx",
            });
        }
        setTimeout(() => {
            this.buildAutoLetterResultData(_temp);
        }, 1000);
    }
}
