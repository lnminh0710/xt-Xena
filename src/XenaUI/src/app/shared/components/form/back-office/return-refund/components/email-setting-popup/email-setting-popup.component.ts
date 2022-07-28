import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Dialog } from 'primeng/primeng';
import {
    ModalService,
    BlockedOrderService,
    AppErrorHandler,
    CommonService
} from 'app/services';
import { Configuration } from 'app/app.constants';
import { EmailSettingComponent } from '../email-setting';
import { Uti } from 'app/utilities';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import {
    EmailTemplateModel,
    PlaceHolderModel,
    EmailModel,
    ApiResultResponse
} from 'app/models';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/pages/private/base';

@Component({
    selector: 'email-setting-popup',
    templateUrl: './email-setting-popup.component.html'
})
export class EmailSettingPopupComponent extends BaseComponent implements OnInit, OnDestroy {
    private popupSize = {};
    private customCssClassName = 'email-setting-popup';
    private isDirty = false;
    private isSaveWhenClose = false;
    private fullHeightClassName = this.consts.popupFullHeightClassName + '  ' + this.consts.popupResizeClassName + '  ' + this.customCssClassName;
    private currentChangingData: any = {};
    private inputEmailSettingData: any = {};

    public showDialogData = false;
    public emailSettingData: any = {
        emailSettingData: new Array<EmailTemplateModel>(),
        placeholderData: new Array<EmailTemplateModel>(),
        settingData: {}
    };
    public dialogStyleClass = this.fullHeightClassName;
    public isResizable = true;
    public isDraggable = true;
    public isMaximized = false;

    @ViewChild('pDialogEmailSetting') pDialogEmailSetting: Dialog;
    @ViewChild('emailSetting') emailSetting: EmailSettingComponent;
    @Input() set data(data: any) {
        this.inputEmailSettingData = data;
    }
    @Input() set showDialog(data: any) {
        this.showDialogData = data;
        this.showPopup();
    }
    @Output() saveData: EventEmitter<any> = new EventEmitter();
    @Output() onPopupClosed: EventEmitter<any> = new EventEmitter();

    constructor(
        private consts: Configuration,
        private modalService: ModalService,
        private appErrorHandler: AppErrorHandler,
        private toasterService: ToasterService,
        private blockedOrderService: BlockedOrderService,
        private commonService: CommonService,
        protected router: Router
    ) {
        super(router);
    }

    public ngOnInit() {
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public showPopup() {
        if (!this.showDialogData) return;

        this.blockedOrderService.getTextTemplate(Uti.getValueFromArrayByKey(this.inputEmailSettingData, 'IdRepSalesOrderStatus'))
            .subscribe(
                (response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!response || !response.item.data || !response.item.data.length) {
                            return;
                        }
                        this.emailSettingData = {
                            contentTemplateData: response.item.data[1].map(x => {
                                return new EmailTemplateModel({
                                    id: x.IdTextTemplate,
                                    name: x.TemplateText,
                                    emailBody: x.Description
                                });
                            }),
                            placeholderData: this.emailSettingData['placeholderData'],
                            settingData: this.inputEmailSettingData
                        }
                    });
                });
        this.blockedOrderService.getMailingListOfPlaceHolder()
            .subscribe(
                (response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!response || !response.item.data || !response.item.data.length) {
                            return;
                        }
                        this.emailSettingData = {
                            placeholderData: response.item.data[1].map(x => {
                                return new PlaceHolderModel({
                                    id: x.OriginalColumnName,
                                    name: x.Value,
                                    data: '<<' + x.ColumnName + '>>'
                                });
                            }),
                            contentTemplateData: this.emailSettingData['contentTemplateData'],
                            settingData: this.inputEmailSettingData
                        }
                    });
                });
    }

    public emailSettingOutput($event: any) {
        if (!$event) return;
        this.isDirty = $event.isDirty;
        this.currentChangingData = $event.data;
    }

    public callSaveEmailTemplateData($event: any) {
        if (!this.isDirty) return;

        this.blockedOrderService.saveTextTemplate($event)
            .subscribe(
                (response: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!response || !response.item.returnID) {
                            this.toasterService.pop('error', 'Failed', 'Saving email template is failed');
                            return;
                        }
                        if ($event.IsDeleted && $event.IsDeleted !== '0') {
                            this.emailSetting.callBackAfterDeleteTemplateItem();
                        } else {
                            this.emailSetting.callBackAfterSaveEmailTemplate(!$event.IdTextTemplate, response.item.returnID);
                        }
                        this.isDirty = false;
                        if (this.isSaveWhenClose) {
                            this.isSaveWhenClose = false;
                            this.close();
                        }
                    });
                });
    }

    public callSendEmail(email: EmailModel) {
        if (!email || !email.Subject) return;
        email.ToEmail = Uti.getValueFromArrayByKey(this.inputEmailSettingData, 'Email');
        this.commonService.sendEmail(email).subscribe(
            (response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item) {
                        this.toasterService.pop('error', 'Failed', 'Email sending is failed');
                        return;
                    }
                    this.toasterService.pop('success', 'Success', 'Email sending is successful');
                    this.isDirty = false;
                    this.close();
                });
            });
    }

    public close() {
        if (this.isDirty) {
            this.confirmWhenClose();
            return;
        }
        this.closeDialog();
    }

    private confirmWhenClose() {
        this.modalService.unsavedWarningMessageDefault({
            headerText: 'Saving Changes',
            onModalSaveAndExit: () => {
                this.isSaveWhenClose = true;
                this.callSaveEmailTemplateData(this.currentChangingData);
            },
            onModalExit: () => { this.closeDialog(); }
        });
    }

    private closeDialog() {
        this.isDirty = false;
        this.showDialogData = false;
        this.emailSetting.resetForm();
        this.onPopupClosed.emit();
    }

    public maximize() {
        this.isMaximized = true;
        this.isResizable = false;
        this.isDraggable = false;
        this.dialogStyleClass = this.fullHeightClassName + '  ' + this.consts.popupFullViewClassName;
        Uti.popupMaximize(this.pDialogEmailSetting, this.popupSize);
    }

    public restore() {
        this.isMaximized = false;
        this.isResizable = true;
        this.isDraggable = true;
        this.dialogStyleClass = this.fullHeightClassName;
        Uti.popuprestore(this.pDialogEmailSetting, this.popupSize);
    }
}
