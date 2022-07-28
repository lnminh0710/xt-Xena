
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
import {
    ScheduleEvent,
    ScheduleSettingData
} from 'app/models';
import {
    ModalService,
    AppErrorHandler,
    ToolsService,
    PropertyPanelService,
    CommonService
} from 'app/services';
import {
    DateConfiguration,
    Configuration,
    MessageModal
} from 'app/app.constants';
import * as wjcGrid from 'wijmo/wijmo.grid';
import {
    Uti
} from 'app/utilities/uti';
import {
    WjInputTime
} from 'wijmo/wijmo.angular2.input';
import { ScheduleSettingFormComponent } from './components/schedule-setting-form';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import {Dialog} from 'primeng/components/dialog/dialog';

@Component({
    selector: 'schedule-setting',
    styleUrls: ['./schedule-setting.component.scss'],
    templateUrl: './schedule-setting.component.html'
})
export class ScheduleSettingComponent extends BaseComponent implements OnInit, OnDestroy {
    public showDialog = false;
    public allowMerging = wjcGrid.AllowMerging.All;
    public SCHEDULE_JSON_NAME = DateConfiguration.SCHEDULE_JSON_NAME;
    public SCHEDULE_TYPE = DateConfiguration.SCHEDULE_TYPE;
    // public scheduleTypePrimary: string = '';
    public scheduleTypes: Array<ScheduleType> = [];
    public scheduleType = this.SCHEDULE_TYPE[0];
    public scheduleSettingData: ScheduleSettingData;
    public globalDateFormat: string = '';
    public dontShowCalendarWhenFocus: boolean;
    public currentRowData: any = {};
    public isResizable = true;
    public isDraggable = true;
    public isMaximized = false;
    public dialogStyleClass = this.consts.popupResizeClassName;

    private scheduleJsonName = this.createScheduleJsonName();
    private scheduleTypeName = this.createScheduleTypeName();
    private scheduleOriginalData: any = {};
    private formData: any = {
        formValue: {value: {}},
        isDirty: false
    };

    private preDialogW: string;
    private preDialogH: string;
    private preDialogLeft: string;
    private preDialogTop: string;
    private formDirty = false;

    @Input() set globalProperties(globalProperties: any[]) {
        this.globalDateFormat = this._propertyPanelService.buildGlobalInputDateFormatFromProperties(globalProperties);
        this.dontShowCalendarWhenFocus = this._propertyPanelService.getValueDropdownFromGlobalProperties(globalProperties);
    }

    @Output() closedAction: EventEmitter<any> = new EventEmitter();

    @ViewChild('scheduleTime') _scheduleTime: WjInputTime;
    @ViewChild('scheduleSettingForm') scheduleSettingForm: ScheduleSettingFormComponent;
    private pDialogScheduleSetting: any;
    @ViewChild('pDialogScheduleSetting') set pDialogScheduleSettingInstance(pDialogScheduleSettingInstance: Dialog) {
        this.pDialogScheduleSetting = pDialogScheduleSettingInstance;
    }
    constructor(
        private _modalService: ModalService,
        private _appErrorHandler: AppErrorHandler,
        private _toolsService: ToolsService,
        private consts: Configuration,
        private _toasterService: ToasterService,
        private _propertyPanelService: PropertyPanelService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _commonService: CommonService,
        private uti: Uti,
        router?: Router
    ) {
        super(router);
    }
    public ngOnInit() {
        this.buildScheduleTypes();
        this.setSelectForScheduleType();
    }
    public ngOnDestroy() {
    }
    public callShowDialog(data: any) {
        this.showDialog = true;
        this.currentRowData = data;
        this.getScheduleByServiceId(data);
    }
    public closeWindowDialog(isReload?: boolean): void {
        if (this.formData.isDirty) {
            this._modalService.unsavedWarningMessageDefault({
                headerText: 'Save Data',
                onModalSaveAndExit: () => {
                    this.saveSetting();
                },
                onModalExit: () => {
                    this.closePopup(isReload);
                }
            });
            return;
        }
        if (this.formDirty) {
            this._modalService.confirmMessage({
                headerText: 'Form data is dirty',
                message: [{key: 'Modal_Message__Schedule_Form_Dirty_Saving_Change'}],
                messageType: MessageModal.MessageType.warning,
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    this.closePopup(isReload);
                },
                callBack2: () => {}
            });
            return;
        }
        this.closePopup(isReload);
    }
    public saveSetting() {
        if (!this.formData.isDirty) {
            this._toasterService.pop('success', 'Success', 'Data is updated successfully');
            this.closePopup(false);
            return;
        }
        if (!this.scheduleSettingForm.isValid()) {
            return;
        }
        this._toolsService.saveSystemSchedule(this.buildSavingData())
            .subscribe((response: any) => {
                this._appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.returnID) {
                        this._toasterService.pop('error', 'Failed', 'Data is not updated successfully');
                        return;
                    }
                    this._toasterService.pop('success', 'Success', 'Data is updated successfully');
                    this.closePopup(true);
                });
            });
    }
    public outputDataHandler(formData: any) {
        this.formData = formData || this.formData;
    }
    public onRunHandler(itemData: any) {
        this._commonService.createQueue(this.buildDataForSave(itemData))
        .subscribe((response: any) => {
            this._appErrorHandler.executeAction(() => {
                if (!Uti.isResquestSuccess(response) || !response.item.returnID) {
                    this._toasterService.pop('error', 'Failed', 'Queue is not started');
                    return;
                }
                this._toasterService.pop('success', 'Success', 'Queue is starting');
            });
        });
    }
    public onScheduleTypeClick(button: any) {
        if (this.scheduleType == button.value) return;
        if (this.formData.formValue.dirty) {
            this._modalService.unsavedWarningMessage({
                headerText: 'Save Data',
                message: [{key: '<p>'}, {key: 'Modal_Message__Do_You_Want_To_Add_Data_Grid'},
                    {key: '</p>'}],
                onModalSaveAndExit: () => {
                    if (!this.scheduleSettingForm.updateToGird()) return;
                    this.setScheduleType(button);
                },
                onModalExit: () => {
                    this.setScheduleType(button);
                }
            });
            return;
        }
        this.setScheduleType(button);
    }

    public formDirtyHandler(isDirty) {
        this.formDirty = isDirty;
    }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/
    private buildSavingData() {
        return { 'Schedule': this.getScheduleSavingData() };
    }

    private maximize() {
        // if (this.translateWidget)
        //     this.translateWidget.resized();
        this.isMaximized = true;
        this.isResizable = false;
        this.isDraggable = false;
        this.dialogStyleClass = this.consts.popupResizeClassName + '  ' + this.consts.popupFullViewClassName;
        if (this.pDialogScheduleSetting) {
            this.preDialogW = this.pDialogScheduleSetting.containerViewChild.nativeElement.style.width;
            this.preDialogH = this.pDialogScheduleSetting.containerViewChild.nativeElement.style.height;
            this.preDialogLeft = this.pDialogScheduleSetting.containerViewChild.nativeElement.style.left;
            this.preDialogTop = this.pDialogScheduleSetting.containerViewChild.nativeElement.style.top;

            this.pDialogScheduleSetting.containerViewChild.nativeElement.style.width = $(document).width() + 'px';
            this.pDialogScheduleSetting.containerViewChild.nativeElement.style.height = $(document).height() + 'px';
            this.pDialogScheduleSetting.containerViewChild.nativeElement.style.top = '0px';
            this.pDialogScheduleSetting.containerViewChild.nativeElement.style.left = '0px';
        }
    }

    private restore() {
        // if (this.translateWidget)
        //     this.translateWidget.resized();
        this.isMaximized = false;
        this.isResizable = true;
        this.isDraggable = true;
        this.dialogStyleClass = this.consts.popupResizeClassName;
        if (this.pDialogScheduleSetting) {
            this.pDialogScheduleSetting.containerViewChild.nativeElement.style.width = this.preDialogW;
            this.pDialogScheduleSetting.containerViewChild.nativeElement.style.height = this.preDialogH;
            this.pDialogScheduleSetting.containerViewChild.nativeElement.style.top = this.preDialogTop;
            this.pDialogScheduleSetting.containerViewChild.nativeElement.style.left = this.preDialogLeft;
        }
        // setTimeout(() => {
        //     this.bindResizeEvent();
        // }, 200);

    }

    private bindResizeEvent() {
        if (this.pDialogScheduleSetting) {
            const resizeEle = $('div.ui-resizable-handle', $(this.pDialogScheduleSetting.containerViewChild.nativeElement));
            if (resizeEle && resizeEle.length) {
                resizeEle.bind('mousemove', () => {
                    if (this.pDialogScheduleSetting.resizing) {
                        setTimeout(() => {
                            if (this.pDialogScheduleSetting)
                                this.pDialogScheduleSetting.resized();
                        }, 200);
                    }
                });
            }
        }
    }

    private closePopup(isReload?: boolean) {
        this.showDialog = false;
        this.closedAction.emit(isReload);
    }

    private setScheduleType(button: any) {
        for (let item of this.scheduleTypes) {
            item.select = (item.value === button.value);
        }
        this.scheduleType = button.value;
    }

    private setSelectForScheduleType() {
        for (let item of this.scheduleTypes) {
            item.select = (item.value === this.scheduleType);
        }
    }

    private getScheduleSavingData(): Array<any> {
        let addUpdateItems = this.getAddUpdateItems(this.scheduleSettingForm.buildSavingJsonData());
        let deleteItems = this.getDeleteItems(addUpdateItems);
        return [...addUpdateItems, ...deleteItems];
    }

    private getAddUpdateItems(rawData: Array<any>): Array<any> {
        return rawData.map(x => {
            let schedule: any = {
                'IdRepAppSystemScheduleServiceName': this.currentRowData.IdRepAppSystemScheduleServiceName,
                'StartDate': Uti.getUTCDate(x.startDate),
                'StopDate': Uti.getUTCDate(x.stopDate),
                'IsActive': x.activeSchedule
            };
            if (!(x.id < 0)) {
                schedule.IdAppSystemSchedule = x.id;
            }
            this.setDataForEachType(schedule, x);
            return schedule;
        });
    }

    private getDeleteItems(addUpdateItems: Array<any>): Array<any> {
        const deleteItem = Uti.getItemsDontExistItems(this.scheduleOriginalData, addUpdateItems, 'IdAppSystemSchedule');
        return deleteItem.map(x => {
            return {
                'IdAppSystemSchedule': x.IdAppSystemSchedule,
                'IsDeleted': '1'
            };
        });
    }

    private setDataForEachType(schedule: any, item: any) {
        switch (item.scheduleType) {
            case this.SCHEDULE_TYPE[0]:
                schedule['IsForEveryHours'] = 1;
                schedule['JHours'] = this.getSaveDataForJData(item);
                break;
            case this.SCHEDULE_TYPE[1]:
                schedule['IsForEverDay'] = 1;
                schedule['JDays'] = this.getSaveDataForJData(item);
                break;
            case this.SCHEDULE_TYPE[2]:
                schedule['IsForEveryWeek'] = 1;
                schedule['JWeeks'] = this.getSaveDataForJData(item);
                break;
            case this.SCHEDULE_TYPE[3]:
                schedule['IsForEveryMonth'] = 1;
                schedule['JMonths'] = this.getSaveDataForJData(item);
                break;
            case this.SCHEDULE_TYPE[4]:
                schedule['IsForEveryYear'] = 1;
                schedule['JYears'] = this.getSaveDataForJData(item);
                break;
        }
    }

    private getSaveDataForJData(item: ScheduleEvent) {
        return JSON.stringify(this.getSaveData(item));
    }

    private getSaveData(item: ScheduleEvent) {
        return {
            'On': item.on instanceof Date ? Uti.getUTCDate(item.on) : item.on,
            'Hour': item.hour,
            'Minute': item.minute,
            'Emails': item.email,
            'Parameter': item.parameter,
            'Note': item.note
        };
    }

    private buildScheduleTypes() {
        this.scheduleTypes = this.SCHEDULE_TYPE.map(x => {
            return new ScheduleType({
                title: x.match(/[A-Z][a-z]+/g).join(" "),
                value: x
            });
        });
        // this.appendDefaultValueToTranslateResource();
    }

    // private appendDefaultValueToTranslateResource() {
    //     for (let button of this.scheduleTypes) {
    //         defaultLanguage['ScheduleSetting__btn_' + button.title] = button.title;
    //     }
    // }

    private createScheduleJsonName(): any {
        let result = {};
        for (let i = 0; i < this.SCHEDULE_TYPE.length; i++) {
            result[this.SCHEDULE_TYPE[i]] = this.SCHEDULE_JSON_NAME[i];
        }
        return result;
    }

    private createScheduleTypeName(): any {
        let result = {};
        for (let i = 0; i < this.SCHEDULE_JSON_NAME.length; i++) {
            result[this.SCHEDULE_JSON_NAME[i]] = this.SCHEDULE_TYPE[i];
        }
        return result;
    }

    private buildDataWhenShowDialog() {
        if (!this.scheduleOriginalData || !this.scheduleOriginalData.length || !this.currentRowData.IdRepAppSystemScheduleServiceName) return;
        if (Uti.isEmptyOrFalse(this.scheduleOriginalData[0].IsForEveryHours)) {
            this.scheduleType = this.SCHEDULE_TYPE[0];
        } else if (Uti.isEmptyOrFalse(this.scheduleOriginalData[0].IsForEverDay)) {
            this.scheduleType = this.SCHEDULE_TYPE[1];
        } else if (Uti.isEmptyOrFalse(this.scheduleOriginalData[0].IsForEveryWeek)) {
            this.scheduleType = this.SCHEDULE_TYPE[2];
        } else if (Uti.isEmptyOrFalse(this.scheduleOriginalData[0].IsForEveryMonth)) {
            this.scheduleType = this.SCHEDULE_TYPE[3];
        } else if (Uti.isEmptyOrFalse(this.scheduleOriginalData[0].IsForEveryYear)) {
            this.scheduleType = this.SCHEDULE_TYPE[4];
        } else {
            return;
        }
        // this.scheduleTypePrimary = this.scheduleType;
        this.buildDataByType(this.scheduleOriginalData);
        this.setSelectForScheduleType();
        this.callRender();
    }

    private getScheduleByServiceId(inputData: any) {
        this._toolsService.getScheduleByServiceId(inputData.IdRepAppSystemScheduleServiceName)
            .subscribe((response: any) => {
                this._appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        this.scheduleOriginalData = [];
                        return;
                    }
                    this.scheduleOriginalData = response.item.data[1];
                    this.buildDataWhenShowDialog();
                });
            });
    }

    private buildDataByType(data: any) {
        this.scheduleSettingData = new ScheduleSettingData({
            scheduleType: this.scheduleType,
            scheduleEvents: this.buildJsonDataDataByType(data) || []
        });
    }

    private buildJsonDataDataByType(data: Array<any>): Array<ScheduleEvent> {
        let result: Array<ScheduleEvent> = [];
        for (let item of this.SCHEDULE_JSON_NAME) {
            for (let row of data) {
                if (!row[item]) continue;
                const scheduleItemData = Uti.tryParseJson(row[item]);
                result.push(new ScheduleEvent({
                    id: row.IdAppSystemSchedule,
                    on: this.parseRightOn(scheduleItemData.On),
                    hour: scheduleItemData.Hour,
                    minute: scheduleItemData.Minute,
                    dateFormat: this.getRightDateFormat(),
                    email: scheduleItemData.Emails,
                    parameter: scheduleItemData.Parameter,
                    note: scheduleItemData.Note,
                    scheduleType: this.scheduleTypeName[item],
                    startDate: Uti.parseStrDateToRealDate(row.StartDate),
                    stopDate: Uti.parseStrDateToRealDate(row.StopDate),
                    activeSchedule: !!row.IsActive
                }));
            }
        }
        return result;
    }

    // private buildJsonDataDataByType(data: Array<any>): Array<ScheduleEvent> {
    //     return data.map(x => {
    //         const scheduleItemData = Uti.tryParseJson(x[this.scheduleJsonName[this.scheduleType]]);
    //         return new ScheduleEvent({
    //             id: x.IdAppSystemSchedule,
    //             on: this.parseRightOn(scheduleItemData.On),
    //             hour: scheduleItemData.Hour,
    //             minute: scheduleItemData.Minute,
    //             dateFormat: this.getRightDateFormat(),
    //             email: scheduleItemData.Emails,
    //             parameter: scheduleItemData.Parameter,
    //             note: scheduleItemData.Note
    //         });
    //     });
    // }

    private parseRightOn(on: any) {
        if (!on) return '';
        if (DateConfiguration.WEEK_DAY.indexOf(on) > -1 ||
            DateConfiguration.MONTH_DAY.indexOf(on)) {
            return on;
        }
        const date = Uti.parseStrDateToRealDate(on);
        if (!date || typeof date.getDate != 'function') {
            return on;
        }
        return (new Date(date.setHours(0, 0, 0, 0)));
        // return this.uti.formatLocale(date, this.globalDateFormat)
    }

    private getRightDateFormat(): string {
        if (this.scheduleType == this.SCHEDULE_TYPE[0]
            || this.scheduleType == this.SCHEDULE_TYPE[4]) {
            return this.globalDateFormat;
        }
        return '';
    }

    private callRender() {
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 100);
    }

    private buildDataForSave(itemData: any) {
        return {
            IdRepAppSystemScheduleServiceName: this.currentRowData.IdRepAppSystemScheduleServiceName,
            JsonText: JSON.stringify({ SystemScheduleQueue: [{
                IdRepAppSystemScheduleServiceName: this.currentRowData.IdRepAppSystemScheduleServiceName,
                JsonLog: JSON.stringify({JsonLog: {
                    Emails: itemData.email,
                    RangeType: this.RangeType[itemData.on],
                    Parameter: itemData.parameter
                }})
            }]})
        };
    }

    private RangeType: any = {
        'Immediately': 0,
        'OneTime': 1,
        'Daily': 2,
        'Weekly': 3,
        'Monthly': 4,
        'Annual': 5
    }
}

class ScheduleType {
    public title: string = '';
    public value: string = '';
    public select: boolean = false;

    public constructor(init?: Partial<ScheduleType>) {
        Object.assign(this, init);
    }
}
