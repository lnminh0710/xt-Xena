import {
    Component,
    OnInit,
    Output,
    OnDestroy,
    EventEmitter,
    ViewChild,
    Input} from '@angular/core';
import {
    BaseComponent
} from 'app/pages/private/base';
import {
    Router
} from '@angular/router';
import {
    ApiResultResponse} from 'app/models';
import {
    AppErrorHandler,
    PropertyPanelService,
    BlockedOrderService,
    ModalService
} from 'app/services';
import {
    Configuration, SAVIdConnectionName} from 'app/app.constants';
import {
    Uti
} from 'app/utilities/uti';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import {Dialog} from 'primeng/components/dialog/dialog';
import { SendLetterFormComponent } from '.';
import isEmpty from 'lodash-es/isEmpty';

@Component({
    selector: 'send-letter-dialog',
    styleUrls: ['./send-letter-dialog.component.scss'],
    templateUrl: './send-letter-dialog.component.html'
})
export class SendLetterDialogComponent extends BaseComponent implements OnInit, OnDestroy {
    private popupSize = {};
    private popupMinimizeSize = {};
    private hasIdPerson = false;
    // private fullHeightClassName = this._consts.popupFullHeightClassName + '  ' + this._consts.popupResizeClassName + '  ' + this.customCssClassName;

    public showDialog = false;
    public isDirty = false;
    // public globalDateFormat: string = '';
    // public dontShowCalendarWhenFocus: boolean;
    public isMaximized = false;
    public isMinimized = false;
    // public dialogStyleClass = this.fullHeightClassName;
    public dialogStyleClass = this._consts.popupResizeClassName;
    public isResizable = true;
    public isDraggable = true;
    public isPreview = false;
    public isSAVWidget = false;
    public showDialogData: {widgetData: any, data: any} = {widgetData: {}, data: {}};
    public showPreviewDialogData: {main: any, template: any, reason: Array<any>} = {main: {}, template: {}, reason: []};
    public dialogHeight = 0;
    public dialogBodyHeight: any;

    @ViewChild('pDialogSendLetterSav') pDialogSendLetterSav: Dialog;
    @ViewChild('sendLetterFormComponent') sendLetterFormComponent: SendLetterFormComponent;

    // @Input() set globalProperties(globalProperties: any[]) {
    //     this.globalDateFormat = this._propertyPanelService.buildGlobalInputDateFormatFromProperties(globalProperties);
    //     this.dontShowCalendarWhenFocus = this._propertyPanelService.getValueDropdownFromGlobalProperties(globalProperties);
    // }

    @Output() closedAction: EventEmitter<any> = new EventEmitter();
    @Output() initComponentAction: EventEmitter<any> = new EventEmitter();
    @Output() startGeneratePdfAction: EventEmitter<any> = new EventEmitter();

    constructor(
        private _appErrorHandler: AppErrorHandler,
        private _consts: Configuration,
        private _toasterService: ToasterService,
        private _blockedOrderService: BlockedOrderService,
        private _modalService: ModalService,
        router?: Router
    ) {
        super(router);
    }

    public ngOnInit() {
        this.initComponentAction.emit();
    }

    public ngOnDestroy() {

    }

    public sendLetterClick() {
        if (this.isPreview) {
            this.submitDataForPreview();
            return;
        }
        // Call save data to database
        this.submit((data) => {
            // Push data to SignalR
            this.startGeneratePdfAction.emit(data);
        });
    }

    public callShowDialog(data: any) {
        this.dialogHeight = $(document).height();
        this.dialogBodyHeight = { 'height': (this.dialogHeight - 135) + 'px' };
        this.showDialogData = data;
        this.showDialog = true;
        Uti.executeFunctionWithTimeout(() => {this.sendLetterFormComponent.loadDataForForm();}, () => {return !!this.sendLetterFormComponent});
    }

    public callShowPreviewDialog(data: {main: any, template: any, reason: Array<any>}) {
        this.showPreviewDialogData = data;
        this.isPreview = true;
        this.callToShowDialog();
        Uti.executeFunctionWithTimeout(() => {this.sendLetterFormComponent.loadDataForPreview(this.showPreviewDialogData);}, () => {return !!this.sendLetterFormComponent});
    }

    public callShowSAVWidget(data: {widgetData: any, data: any}) {
        this.showDialogData = data;
        this.isSAVWidget = true;
        this.setValueForHasIdPerson();
        this.callToShowDialog();
        Uti.executeFunctionWithTimeout(() => {this.sendLetterFormComponent.loadDataForForm();}, () => {return !!this.sendLetterFormComponent});
    }

    private setValueForHasIdPerson() {
        if (!this.showDialogData || !this.showDialogData.data || !this.showDialogData.data.key) return;
        switch (this.showDialogData.data.key) {
            case SAVIdConnectionName.IdSalesOrder: {
                this.hasIdPerson = false;
                break;
            }
            case SAVIdConnectionName.IdPerson: {
                this.hasIdPerson = true;
                break;
            }
        }
    }
    public closeWindowDialog() {
        if (!this.isPreview && this.isDirty) {
            this.confirmWhenClose();
            return;
        }
        this.closeDialog();
    }

    public maximize() {
        this.isMaximized = true;
        this.isResizable = false;
        this.isDraggable = false;
        this.isMinimized = false;
        // this.dialogStyleClass = this.fullHeightClassName + '  ' + this._consts.popupFullViewClassName;
        this.dialogStyleClass = this._consts.popupResizeClassName + '  ' + this._consts.popupFullViewClassName;
        Uti.popupMaximize(this.pDialogSendLetterSav, this.popupSize);
        this.dialogBodyHeight = { 'height': ($(document).height() - 120) + 'px' };
    }

    public restore() {
        this.isMaximized = false;
        this.isResizable = true;
        this.isDraggable = true;
        this.isMinimized = false;
        // this.dialogStyleClass = this.fullHeightClassName;
        this.dialogStyleClass = this._consts.popupResizeClassName
        Uti.popuprestore(this.pDialogSendLetterSav, this.popupSize);
    }

    public minimize() {
        this.isMinimized = true;
        Uti.popupMinimize(this.pDialogSendLetterSav, this.popupMinimizeSize);
    }

    public restoreMinimize() {
        this.isMinimized = false;
        Uti.popupRestoreMinimize(this.pDialogSendLetterSav, this.popupMinimizeSize);
    }

    public isDirtyHandler(isDirty: boolean) {
        this.isDirty = isDirty;
    }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/

    private callToShowDialog() {
        this.dialogHeight = $(document).height();
        this.dialogBodyHeight = { 'height': (this.dialogHeight - 135) + 'px' };
        this.showDialog = true;
        this.isResizable = true;
    }

    private confirmWhenClose() {
        this._modalService.unsavedWarningMessageDefault({
            headerText: 'Saving Changes',
            onModalSaveAndExit: () => { this.sendLetterClick(); },
            onModalExit: () => { this.closeDialog(); }
        });
    }

    private closeDialog() {
        this.isDirty = false;
        this.showDialog = false;
        this.closedAction.emit();
    }

    // private submitPreview(callbackFunc?: Function) {
    //     const saveData = this.sendLetterFormComponent.getSaveData(this.showPreviewDialogData.main['IdBackOfficeLetters']);
    //     if (!this.valid(saveData)) {
    //         return;
    //     }
    //     this.callSavePreviewData(saveData, callbackFunc);
    // }

    private submit(callbackFunc?: Function) {
        const saveData = this.sendLetterFormComponent.getSaveData();
        if (!this.valid(saveData)) {
            return;
        }
        this.callSaveData(saveData, callbackFunc);
    }

    private valid(saveData: any) {
        if (!saveData.ReasonData.length) {
            this._modalService.warningHTMLText([{key: 'Modal_Message__Please_Select_Reason'}]);
            return false;
        }
        return true;
    }

    // private callSavePreviewData(saveData: any, callbackFunc?: Function) {
    //     this._blockedOrderService.saveBackOfficeLettersTest(saveData)
    //     .subscribe((response: ApiResultResponse) => {
    //         this._appErrorHandler.executeAction(() => {
    //             if (!Uti.isResquestSuccess(response)) {
    //                 this._toasterService.pop('error', 'Failed', 'Data can\'t be saved');
    //                 return;
    //             }
    //             this._toasterService.pop('success', 'Success', 'Data is saved');
    //             if (callbackFunc) {
    //                 callbackFunc({
    //                     'IdGenerateLetter': response.item.returnID
    //                 });
    //             }
    //             this.closeDialog();
    //         });
    //     });
    // }

    private callSaveData(saveData: any, callbackFunc?: Function) {
        const serviceName = this.hasIdPerson ? 'saveSalesCustomerLetters' : 'saveSalesOrderLetters';
        this._blockedOrderService[serviceName](saveData)
        .subscribe((response: ApiResultResponse) => {
            this._appErrorHandler.executeAction(() => {
                if (!Uti.isResquestSuccess(response)) {
                    this._toasterService.pop('error', 'Failed', 'Data can\'t be saved');
                    return;
                }
                this._toasterService.pop('success', 'Success', 'Data is saved');
                if (callbackFunc) {
                    callbackFunc({
                        'IdGenerateLetter': response.item.returnID,
                        'IdBackOfficeLetters': (() => {try{return saveData.BackOfficeLetter.IdBackOfficeLetters;}catch(e){return '';}})()
                    });
                }
                this.closeDialog();
            });
        });
    }

    private submitDataForPreview() {
        const previewData = this.sendLetterFormComponent.getPreviewData();
        if (!previewData || !previewData['Values'] || isEmpty(previewData['Values'])) {
            this._modalService.warningText('Modal_Message__Please_Select_Reason');
            return;
        }
        this.startGeneratePdfAction.emit(previewData);
    }
}
