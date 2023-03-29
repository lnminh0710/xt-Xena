import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Configuration, MessageModal } from 'app/app.constants';
import { ModalService, AppErrorHandler } from 'app/services';
import { Uti, CustomValidators } from 'app/utilities';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Subscription } from 'rxjs/Subscription';
import { EmailModel, MessageModel } from 'app/models';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/pages/private/base';

@Component({
  selector: 'email-setting',
  styleUrls: ['./email-setting.component.scss'],
  templateUrl: './email-setting.component.html',
})
export class EmailSettingComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private currentEmailBody = '';
  public isDirty = false;

  private outputModel: {
    submitResult?: boolean;
    formValue: any;
    isValid?: boolean;
    isDirty?: boolean;
    returnID?: string;
    stepId: string;
  };

  private emailSettingFormValuesChangeSubscription: Subscription;
  private idRepSalesOrderStatus = '';

  public emailSettingForm: FormGroup;
  public currentTemplate = null;
  public isUsingTemplate = false;
  public isUsingPlaceHolder = false;
  public isShowTemplateName = false;
  public hasChangeEmailBody = false;
  public isShowExistingEmailTemplate = false;
  public emailTemplateSubmit = false;
  public emailTemplateSubject = '';
  public showDialog = false;
  public isBeginUsingTemplate = false;
  public isRendered = false;
  public contentTemplateData = [];
  public placeholderData = [];
  public customOptions = this.consts.textEditorFont;
  public isCanSendEmail = false;

  @Input() isOnPopup = false;
  @Input() set emailSettingData(data: any) {
    this.contentTemplateData = data.contentTemplateData;
    this.placeholderData = data.placeholderData;
    this.initData();
    if (!data || !data.settingData) return;
    this.idRepSalesOrderStatus = Uti.getValueFromArrayByKey(
      data.settingData,
      'IdRepSalesOrderStatus'
    );
  }

  @Output() deleteEmailTemplate: EventEmitter<any> = new EventEmitter();
  @Output() saveEmailTemplate: EventEmitter<any> = new EventEmitter();
  @Output() sendEmailEvent: EventEmitter<any> = new EventEmitter();
  @Output() outputData: EventEmitter<any> = new EventEmitter();

  constructor(
    private consts: Configuration,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private toasterService: ToasterService,
    protected router: Router,
    private appErrorHandler: AppErrorHandler
  ) {
    super(router);
  }

  public ngOnInit() {}

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public useTemplateClick() {
    this.currentEmailBody = this.emailSettingForm.value['emailBody'];
    this.setValueForFlagChangingVariable(null, true, false, true);
  }

  public usePlaceHolderClick() {
    this.setValueForFlagChangingVariable(null, false, true);
  }
  public saveAsTemplateClick() {
    this.isShowTemplateName = true;
  }

  public saveTemplateClick() {
    this.emailTemplateSubmit = true;
    if (!this.emailTemplateSubject) return;
    this.saveEmailAsTemplate(null);
  }

  public sendEmailClick() {
    this.sendEmailEvent.emit(this.prepareEmailData());
  }

  public cancelSaveTemplateClick() {
    this.showDialog = false;
  }

  public cancelSaveAsTemplateClick() {
    this.isShowTemplateName = false;
  }

  public saveAsNewTemplateClick() {
    if (
      !this.emailSettingForm ||
      !this.emailSettingForm.value ||
      !this.emailSettingForm.value['emailBody']
    ) {
      this.modalService.warningMessage([
        { key: 'Modal_Message__Please_Input_The_Email_Content' },
      ]);
      return;
    }
    this.showDialog = true;
    this.emailTemplateSubject = this.currentTemplate
      ? this.currentTemplate.name
      : '';
    this.emailTemplateSubmit = false;
    this.isShowExistingEmailTemplate = false;
  }

  public onShow() {
    if (!this.isOnPopup) return;
    const overlayDiv = $('.ui-widget-overlay');
    if (!overlayDiv || !overlayDiv.length) {
      return;
    }
    $(overlayDiv[1]).addClass('ui-widget-overlay-second');
  }

  public onClose() {
    this.isShowExistingEmailTemplate = false;
  }

  private checkExistEmailSubjectName(
    emailSubjectName: string,
    id: any
  ): boolean {
    const currentTemplate = this.contentTemplateData.find(
      (x) => x.name === emailSubjectName && x.id != id
    );
    return !!(currentTemplate && currentTemplate.id);
  }

  public contentTemplateDataClick($event: any) {
    this.setValueForFlagChangingVariable(false, null, null, false);
    this.currentTemplate = $event;
    if (!$event) return;
    this.emailSettingForm.controls['emailBody'].setValue($event.emailBody);
    this.emailSettingForm.markAsPristine();
  }

  public templateApplyClick() {
    this.setOutputData(false);
    this.setValueForFlagChangingVariable(false, false, false);
  }

  public templateDeleteClick() {
    this.hasChangeEmailBody = false;
    if (!this.currentTemplate) return;
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        headerText: 'Delete Template Item',
        messageType: MessageModal.MessageType.error,
        message: [
          { key: '<p>' },
          { key: 'Modal_Message__Do_You_Want_To_Delete' },
          { key: '<strong>' },
          { key: this.currentTemplate.name },
          { key: '</strong> ' },
          { key: 'Modal_Message__Template_Item' },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.danger,
        callBack1: () => {
          this.okDeleteRows();
        },
        callBack2: () => {},
      })
    );
  }

  public templateCancelClick() {
    this.emailSettingForm.controls['emailBody'].setValue(this.currentEmailBody);
    this.emailSettingForm.markAsPristine();
    this.setValueForFlagChangingVariable(false, false, false);
    this.currentTemplate = null;
  }

  public placeholderDataClose() {
    this.setValueForFlagChangingVariable(null, false, false, null);
  }

  public resetForm() {
    Uti.resetValueForForm(this.emailSettingForm);
    this.setValueForFlagChangingVariable(false, false, false, null);
  }

  public onContentChanged($event: any) {
    if (!$event) {
      return;
    }

    let doesTagNotContainsAnyTag = $event.text.match(
      /<<(([^<>]+)|)<<(([^<>]+)|)>>(([^<>]+)|)>>/g
    );
    if (doesTagNotContainsAnyTag && doesTagNotContainsAnyTag.length) {
      $event.editor.history.undo();
    } else {
      this.hasChangeEmailBody = true;
    }
  }

  public emailTemplateSubjectChange($event: any) {}

  public updateTemplateClick() {
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        message: [
          { key: 'Modal_Message__Do_You_Want_To_Update_The' },
          { key: '<strong>' },
          { key: this.currentTemplate.name },
          { key: '</strong> ' },
          { key: 'Modal_Message__Template' },
        ],
        okText: 'Update',
        cancelText: 'Cancel',
        callBack1: () => {
          this.updateTemplate();
        },
      })
    );
  }

  public updateTemplate() {
    this.saveEmailAsTemplate(this.currentTemplateId());
  }

  // Call back after delete email template
  public callBackAfterDeleteTemplateItem() {
    Uti.removeItemInArray(this.contentTemplateData, this.currentTemplate, 'id');
    this.toasterService.pop('success', 'Success', 'Email Template is deleted.');
    this.isBeginUsingTemplate = true;
    this.currentTemplate = null;
  }

  // Call back after save email tepmlate
  public callBackAfterSaveEmailTemplate(isNew, responseTemplateId) {
    this.showDialog = false;
    if (!isNew) {
      for (let item of this.contentTemplateData) {
        if (item.id === this.currentTemplateId()) {
          item.name = isNew
            ? this.currentTemplate.name
            : this.emailTemplateSubject;
          item.emailBody = this.emailSettingForm.value['emailBody'];
          break;
        }
      }
    } else {
      this.contentTemplateData.push({
        id: responseTemplateId,
        name: this.emailTemplateSubject,
        emailBody: this.emailSettingForm.value['emailBody'],
      });
    }
    this.isShowTemplateName = false;
    this.hasChangeEmailBody = false;
    this.emailTemplateSubject = '';
    this.toasterService.pop(
      'success',
      'Success',
      'Email Template is saved successfully'
    );
  }

  /********************************************************************************************/
  /********************************** PRIVATE METHODS ******************************************/
  /********************************************************************************************/

  private saveEmailAsTemplate(id: any) {
    if (this.checkExistEmailSubjectName(this.emailTemplateSubject, id)) {
      this.isShowExistingEmailTemplate = true;
      return;
    }
    this.isShowExistingEmailTemplate = false;
    this.saveEmailTemplate.emit(this.prepareEmailTemplateData(id));
  }

  private initData() {
    this.emailSettingForm = this.formBuilder.group({
      emailSubject: ['', CustomValidators.required],
      emailBody: '',
    });
    this.isRendered = true;
    this.subscribeFormValueChange();
  }

  private subscribeFormValueChange() {
    if (this.emailSettingFormValuesChangeSubscription)
      this.emailSettingFormValuesChangeSubscription.unsubscribe();

    this.emailSettingFormValuesChangeSubscription =
      this.emailSettingForm.valueChanges
        .debounceTime(this.consts.valueChangeDeboundTimeDefault)
        .subscribe((data) => {
          this.appErrorHandler.executeAction(() => {
            if (!this.emailSettingForm.pristine) {
              this.setOutputData(true);
            }
            this.setValueIsCanSendEmail();
            if (!this.emailSettingForm.pristine) {
              this.hasChangeEmailBody = true;
            }
          });
        });
  }

  private setValueForFlagChangingVariable(
    hasChangeEmailBody?: boolean,
    isUsingTemplate?: boolean,
    isUsingPlaceHolder?: boolean,
    isBeginUsingTemplate?: boolean
  ) {
    if (typeof hasChangeEmailBody === typeof true) {
      this.hasChangeEmailBody = hasChangeEmailBody;
    }
    if (typeof isUsingTemplate === typeof true) {
      this.isUsingTemplate = isUsingTemplate;
    }
    if (typeof isUsingPlaceHolder === typeof true) {
      this.isUsingPlaceHolder = isUsingPlaceHolder;
    }
    if (typeof isBeginUsingTemplate === typeof true) {
      this.isBeginUsingTemplate = isBeginUsingTemplate;
    }
  }

  private setOutputData(isDirty?: boolean) {
    this.outputData.emit({
      isDirty: isDirty,
      data: this.prepareEmailTemplateData(this.currentTemplateId(), false),
    });
  }

  private setFormDirty(): boolean {
    return this.emailSettingForm.dirty && this.isDirty;
  }

  private okDeleteRows() {
    this.deleteEmailTemplate.emit(
      this.prepareEmailTemplateData(this.currentTemplateId(), true)
    );
  }

  private isFormValid(): boolean {
    return this.emailSettingForm.valid;
  }

  private setValueIsCanSendEmail() {
    this.isCanSendEmail =
      this.emailSettingForm &&
      this.emailSettingForm.value &&
      this.emailSettingForm.value &&
      this.emailSettingForm.value['emailSubject'] &&
      this.emailSettingForm.value['emailBody'];
  }

  private currentTemplateId() {
    return this.currentTemplate && this.currentTemplate.id
      ? this.currentTemplate.id
      : '';
  }

  private prepareEmailTemplateData(id: any, isDelete?: any) {
    return {
      IdTextTemplate: id,
      TemplateText: this.emailSettingForm.value['emailBody'],
      Description: id ? this.currentTemplate.name : this.emailTemplateSubject,
      MarkAsActive: true,
      IsDeleted: isDelete ? '1' : '0',
      IdRepSalesOrderStatus: this.idRepSalesOrderStatus,
    };
  }

  private prepareEmailData() {
    return new EmailModel({
      Subject: this.emailSettingForm.value['emailSubject'],
      Body: this.emailSettingForm.value['emailBody'],
    });
  }
}
