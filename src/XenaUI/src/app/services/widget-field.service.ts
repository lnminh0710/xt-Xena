import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class WidgetFieldService {
    private messageSource = new BehaviorSubject("");
    currentMessage = this.messageSource.asObservable();

    private duplicatedDialogFields = new BehaviorSubject(false);
    currentDuplicatedFieldsDialogs = this.duplicatedDialogFields.asObservable();

    private showToggleMenuForm = new BehaviorSubject(false);
    currentToggleMenu = this.showToggleMenuForm.asObservable();

    private multipleFields = new BehaviorSubject(false);
    currentMultipleFields = this.multipleFields.asObservable();

    private showFieldDialog = new BehaviorSubject("");
    currentFieldDialog = this.showFieldDialog.asObservable();

    private changePanelHeight = new BehaviorSubject("");
    panelHeight = this.changePanelHeight.asObservable();

    private changeColumnWidth = new BehaviorSubject("");
    columnWidth = this.changeColumnWidth.asObservable();

    private changeGeneralFieldHeight = new BehaviorSubject("");
    generalFieldHeight = this.changeGeneralFieldHeight.asObservable();

    private changeQuantityActicleInvoice = new BehaviorSubject("");
    changeQuantityActicleInvoiceAction =
        this.changeQuantityActicleInvoice.asObservable();

    constructor() {}

    changeMessage(message: any) {
        if (message && message.length > 0) {
            this.messageSource.next(message);
        }
    }

    clearMessages() {
        this.messageSource.next("");
    }

    changeHeightForPanel(height: any) {
        this.changePanelHeight.next(height);
    }

    changeWidthForColumn(height: any) {
        this.changeColumnWidth.next(height);
    }

    changeHeightForGeneralField(height: any) {
        this.changeGeneralFieldHeight.next(height);
    }

    changeMenuToggleForm(value: boolean) {
        this.showToggleMenuForm.next(value);
    }

    checkMultipleFields(value: boolean) {
        this.multipleFields.next(value);
    }

    openFieldDialog(value: any) {
        this.showFieldDialog.next(value);
    }

    clearFieldDialog() {
        this.showFieldDialog.next("");
    }

    changeDuplicatedFieldDialog(value: any) {
        this.duplicatedDialogFields.next(value);
    }

    onChangeQuantityActicleInvoice(value: any) {
        this.changeQuantityActicleInvoice.next(value);
    }
}
