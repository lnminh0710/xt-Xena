import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../base.service';
import { JwtHttp } from 'angular2-jwt-refresh';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { ModalActions } from 'app/state-management/store/actions';
import * as models from 'app/models';
import { MessageModal } from 'app/app.constants';
import isBoolean from 'lodash-es/isBoolean';

@Injectable()
export class ModalService extends BaseService {
  constructor(
    injector: Injector,
    private store: Store<AppState>,
    private modalActions: ModalActions
  ) {
    super(injector);
  }

  public createModal(messageData: models.MessageModalModel) {
    this.store.dispatch(this.modalActions.setDataForModal(messageData));
  }

  public showModal() {
    this.store.dispatch(this.modalActions.modalShowMessage(true));
  }

  public isStopSearchWhenEmptySize(
    pagesize: number,
    pageIndex: number
  ): boolean {
    if (pagesize && pageIndex) return false;
    this.warningMessage([{ key: 'Modal_Message__Please_Input_Page_Size' }]);
    return true;
  }

  public hideModal() {
    this.store.dispatch(this.modalActions.modalCloseMessage(true));
    const modal: HTMLElement = document.getElementById('xn-modal-message-main');
    modal.style.removeProperty('z-index');
    const modalBackdrops: HTMLCollectionOf<Element> =
      document.getElementsByClassName('modal-backdrop');
    if (!modalBackdrops || !modalBackdrops.length) return;
    const modalBackdrop: HTMLElement = <HTMLElement>modalBackdrops[0];
    modalBackdrop.style.removeProperty('z-index');
  }

  public errorText(translateKey: string, isOnTop?: boolean) {
    this.createMessageErrorModal(
      { message: [{ key: translateKey }], isOnTop: isOnTop },
      false
    );
    this.showModal();
  }

  public warningText(translateKey: string, isOnTop?: boolean) {
    this.createMessageWarningModal(
      { message: [{ key: translateKey }], isOnTop: isOnTop },
      false
    );
    this.showModal();
  }

  public warningHTMLText(message: Array<any>, isOnTop?: boolean) {
    this.createMessageWarningModal(
      { message: message, isOnTop: isOnTop },
      true
    );
    this.showModal();
  }

  public warningMessage(message: Array<any>) {
    this.createMessageWarningModal({ message: message }, false);
    this.showModal();
  }

  public warningMessageWithOption(option: any, isHtmlContent?: boolean) {
    this.createMessageWarningModal(option, isHtmlContent);
    this.showModal();
  }

  public warningMessageHtmlContent(option: any) {
    this.createMessageWarningModal(option, true);
    this.showModal();
  }

  public successMessage(option: any, isHtmlContent = false) {
    this.createMessageSuccessModal(option, isHtmlContent);
    this.showModal();
  }

  public errorMessage(option: any, isHtmlContent = false) {
    this.createMessageErrorModal(option, isHtmlContent);
    this.showModal();
  }

  public confirmMessage(option: any, isStopPropagation?: boolean) {
    this.createMessageConfirmModal(option, false, isStopPropagation);
    this.showModal();
  }

  public confirmDeleteMessageHtmlContent(
    option: any,
    isStopPropagation?: boolean
  ) {
    option.buttonType1 = MessageModal.ButtonType.danger;
    option.messageType = MessageModal.MessageType.error;
    this.createMessageConfirmModal(option, true, isStopPropagation);
    this.showModal();
  }

  public confirmMessageHtmlContent(
    option: models.MessageModel,
    isStopPropagation?: boolean
  ) {
    this.createMessageConfirmModal(option, true, isStopPropagation);
    this.showModal();
  }

  public unsavedWarningMessageDefault(option: any) {
    option.message = [{ key: 'Modal_Message__Saving_Change' }];
    this.createUnsavedWarningMessageModal(option);
    this.showModal();
  }

  public unsavedWarningMessage(option: any) {
    this.createUnsavedWarningMessageModal(option);
    this.showModal();
  }

  public invalidWarningMessage(option: any) {
    this.createInvalidWarningMessageModal(option);
    this.showModal();
  }

  public alertMessage(
    option: any,
    isHtmlContent?: boolean,
    isStopPropagation?: boolean
  ) {
    this.createMessageAlertModal(
      option,
      isHtmlContent || false,
      isStopPropagation
    );
    this.showModal();
  }

  public showMessageModal(option: models.MessageModalModel) {
    this.createModal(option);
    this.setIndexForMessageModal(option);
    this.showModal();
  }

  private createUnsavedWarningMessageModal(option: any) {
    const messageOption = new models.MessageModalModel({
      customClass: option.customClass || null,
      callBackFunc: option.callBackFunc,
      messageType: MessageModal.MessageType.warning,
      modalSize: MessageModal.ModalSize.small,
      showCloseButton: isBoolean(option.showCloseButton)
        ? option.showCloseButton
        : true,
      header: new models.MessageModalHeaderModel({
        text: option.headerText || 'Saving Changes',
      }),
      body: new models.MessageModalBodyModel({
        isHtmlContent: true,
        content: option.message,
      }),
      footer: new models.MessageModalFooterModel({
        buttonList: [
          new models.ButtonList({
            buttonType: option.buttonType1 || MessageModal.ButtonType.warning,
            text: option.yesButtonText ? option.yesButtonText : 'Yes',
            disabled: option.yesButtonDisabled,
            customClass: '',
            callBackFunc: () => {
              this.hideModal();
              if (!option.onModalSaveAndExit) return;
              option.onModalSaveAndExit();
            },
          }),
          new models.ButtonList({
            buttonType: option.buttonType2 || MessageModal.ButtonType.danger,
            text: option.noButtonText ? option.noButtonText : 'No',
            customClass: '',
            callBackFunc: () => {
              this.hideModal();
              if (!option.onModalExit) return;
              option.onModalExit();
            },
          }),
          new models.ButtonList({
            buttonType: option.buttonType3 || MessageModal.ButtonType.default,
            text: option.cancelButtonText ? option.cancelButtonText : 'Cancel',
            customClass: '',
            callBackFunc: () => {
              this.hideModal();
              if (!option.onModalCancel) return;
              option.onModalCancel();
            },
          }),
        ],
      }),
    });
    this.createModal(messageOption);
    this.setIndexForMessageModal(option);
  }

  private createInvalidWarningMessageModal(option: any) {
    const messageOption = new models.MessageModalModel({
      messageType: MessageModal.MessageType.warning,
      modalSize: MessageModal.ModalSize.small,
      showCloseButton: option.showCloseButton,
      header: new models.MessageModalHeaderModel({
        text: option.headerText || 'Warning',
      }),
      body: new models.MessageModalBodyModel({
        isHtmlContent: true,
        content: option.message,
      }),
      footer: new models.MessageModalFooterModel({
        buttonList: [
          new models.ButtonList({
            buttonType: option.buttonType1 || MessageModal.ButtonType.primary,
            text: 'OK',
            customClass: '',
            callBackFunc: () => {
              this.hideModal();
              if (!option.onModalExit) return;
              option.onModalExit();
            },
          }),
        ],
      }),
    });
    this.createModal(messageOption);
    this.setIndexForMessageModal(option);
  }

  private createMessageErrorModal(option: any, isHtmlContent: boolean) {
    option.messageType = MessageModal.MessageType.error;
    option.text = 'Error';
    this.createMessageModal(option, isHtmlContent);
  }

  private createMessageWarningModal(option: any, isHtmlContent: boolean) {
    option.messageType = MessageModal.MessageType.warning;
    option.text = option.text || 'Warning';
    this.createMessageModal(option, isHtmlContent);
  }

  private createMessageSuccessModal(option: any, isHtmlContent: boolean) {
    option.messageType = MessageModal.MessageType.success;
    option.text = 'Success';
    this.createMessageModal(option, isHtmlContent);
  }

  private createMessageModal(option: any, isHtmlContent: boolean) {
    const messageOption = new models.MessageModalModel({
      customClass: option.customClass,
      messageType: option.messageType,
      modalSize: option.modalSize || MessageModal.ModalSize.small,
      header: new models.MessageModalHeaderModel({
        text: option.text,
      }),
      body: new models.MessageModalBodyModel({
        isHtmlContent: isHtmlContent,
        content: option.message,
      }),
      footer: new models.MessageModalFooterModel({
        buttonList: [
          new models.ButtonList({
            buttonType: option.buttonType1 || MessageModal.ButtonType.default,
            text: option.closeText || 'Close',
            callBackFunc: () => {
              this.hideModal();
              if (!option.callBack) return;
              option.callBack();
            },
          }),
        ],
      }),
      callBackFunc: option.closedCallBack,
      showCloseButton: option.showCloseButton,
    });
    this.createModal(messageOption);
    this.setIndexForMessageModal(option);
  }

  private createMessageConfirmModal(
    option: any,
    isHtmlContent: boolean,
    isStopPropagation?: boolean
  ) {
    const messageOption = new models.MessageModalModel({
      messageType: option.messageType || MessageModal.MessageType.confirm,
      customClass: option.customClass || null,
      modalSize: option.modalSize || MessageModal.ModalSize.small,
      header: new models.MessageModalHeaderModel({
        text: option.headerText || 'Confirm',
      }),
      body: new models.MessageModalBodyModel({
        isHtmlContent: isHtmlContent,
        content: option.message,
      }),
      footer: new models.MessageModalFooterModel({
        buttonList: [
          new models.ButtonList({
            buttonType: option.buttonType1 || MessageModal.ButtonType.primary,
            text: option.okText || 'Ok',
            customClass: '',
            callBackFunc: ($event) => {
              if (isStopPropagation) event.stopImmediatePropagation();
              this.hideModal();
              if (!option.callBack1) return;
              option.callBack1();
            },
          }),
          new models.ButtonList({
            buttonType: option.buttonType2 || MessageModal.ButtonType.default,
            text: option.cancelText || 'Cancel',
            customClass: '',
            callBackFunc: ($event) => {
              if (isStopPropagation) event.stopImmediatePropagation();
              this.hideModal();
              if (!option.callBack2) return;
              option.callBack2();
            },
          }),
        ],
      }),
      showCloseButton: option.showCloseButton,
    });
    this.createModal(messageOption);
    this.setIndexForMessageModal(option);
  }

  private createMessageAlertModal(
    option: any,
    isHtmlContent: boolean,
    isStopPropagation?: boolean
  ) {
    const messageOption = new models.MessageModalModel({
      messageType: option.messageType || MessageModal.MessageType.information,
      customClass: option.customClass || null,
      modalSize: option.modalSize || MessageModal.ModalSize.small,
      header: new models.MessageModalHeaderModel({
        text: option.headerText || 'Information',
      }),
      body: new models.MessageModalBodyModel({
        isHtmlContent: isHtmlContent,
        content: option.message,
      }),
      footer: new models.MessageModalFooterModel({
        buttonList: [
          new models.ButtonList({
            buttonType: option.buttonType1 || MessageModal.ButtonType.default,
            text: option.okText || 'Ok',
            customClass: '',
            callBackFunc: ($event) => {
              if (isStopPropagation) event.stopImmediatePropagation();
              this.hideModal();
              if (!option.callBack) return;
              option.callBack();
            },
          }),
        ],
      }),
      callBackFunc: option.closedCallBack,
      showCloseButton: option.showCloseButton,
    });
    this.createModal(messageOption);
    this.setIndexForMessageModal(option);
  }

  private setIndexForMessageModal(option: any) {
    if (!option || !option.isOnTop) return;
    const modal: HTMLElement = document.getElementById('xn-modal-message-main');
    modal.style.setProperty('z-index', '1071', 'important');
    setTimeout(() => {
      const modalBackdrops: HTMLCollectionOf<Element> =
        document.getElementsByClassName('modal-backdrop');
      if (!modalBackdrops || !modalBackdrops.length) return;
      const modalBackdrop: HTMLElement = <HTMLElement>modalBackdrops[0];
      modalBackdrop.style.setProperty('z-index', '1070', 'important');
    }, 200);
  }
}
