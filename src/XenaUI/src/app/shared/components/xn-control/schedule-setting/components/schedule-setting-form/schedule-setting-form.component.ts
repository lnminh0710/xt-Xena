import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import {
  ScheduleEvent,
  MessageModel,
  ScheduleEventConfig,
  TimeSchedule,
  ScheduleSettingData,
  User,
} from 'app/models';
import { ModalService, AppErrorHandler } from 'app/services';
import {
  MessageModal,
  DateConfiguration,
  Configuration,
} from 'app/app.constants';
import find from 'lodash-es/find';
import reject from 'lodash-es/reject';
import cloneDeep from 'lodash-es/cloneDeep';
import sortBy from 'lodash-es/sortBy';
import filter from 'lodash-es/filter';
import { format } from 'date-fns/esm';
import uniqBy from 'lodash-es/uniqBy';
import { Uti } from 'app/utilities/uti';
import * as wjcCore from 'wijmo/wijmo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScheduleSettingGridComponent } from '../schedule-setting-grid';
import { Subscription } from 'rxjs/Subscription';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { defaultLanguage } from 'app/app.resource';
import { WjInputTime } from 'wijmo/wijmo.angular2.input';

@Component({
  selector: 'schedule-setting-form',
  styleUrls: ['./schedule-setting-form.component.scss'],
  templateUrl: './schedule-setting-form.component.html',
})
export class ScheduleSettingFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public SCHEDULE_TYPE = DateConfiguration.SCHEDULE_TYPE;
  public scheduleEventForm: FormGroup;
  public localScheduleType: any = {};
  public dayOfWeekEnum: Array<string> = DateConfiguration.WEEK_DAY;
  public weekDayItems: Array<any> = [];
  public dayItems: Array<any> = [];
  public scheduleEventGridData: Array<ScheduleEvent> = [];
  public scheduleEventGridDataOneTime: Array<ScheduleEvent> = [];
  public scheduleEventGridDataDaily: Array<ScheduleEvent> = [];
  public scheduleEventGridDataWeekly: Array<ScheduleEvent> = [];
  public scheduleEventGridDataMonthly: Array<ScheduleEvent> = [];
  public scheduleEventGridDataAnnual: Array<ScheduleEvent> = [];
  public scheduleEventConfigList: Array<ScheduleEventConfig> = [];
  public isStartDateGreaterThanStopDate: boolean = false;
  public consts: Configuration = new Configuration();
  public isUpdateButtonDisabled: boolean = true;
  public classNameNote = {
    OneTime: 'n-o',
    Daily: 'n-d',
    Weekly: 'n-w',
    Monthly: 'n-m',
    Annual: 'n-y',
  };
  public classNameForm = {
    OneTime: 'f-o',
    Daily: 'f-d',
    Weekly: 'f-w',
    Monthly: 'f-m',
    Annual: 'f-y',
  };

  private currentUserInfo: User;
  private formBuilder: FormBuilder;
  private formValuesChangeSubscription: Subscription;
  private currentGridItems: any = {};
  private isDirty = false;
  private isEditing = false;

  @ViewChild('scheduleSettingGrid')
  scheduleSettingGrid: ScheduleSettingGridComponent;
  @ViewChild('scheduleTime') scheduleTimeCtr: WjInputTime;

  @Input() set inputData(data: ScheduleSettingData) {
    this.execInputData(data);
  }
  @Input() globalDateFormat: string;
  @Input() currentRowData: any;
  @Input() dontShowCalendarWhenFocus: boolean;
  @Input() set scheduleType(data: string) {
    this.execScheduleType(data);
  }
  @Output() outputDataAction: EventEmitter<any> = new EventEmitter();
  @Output() onRunAction: EventEmitter<any> = new EventEmitter();
  @Output() formDirtyAction: EventEmitter<any> = new EventEmitter();

  constructor(
    private _modalService: ModalService,
    private _appErrorHandler: AppErrorHandler,
    private _toasterService: ToasterService,
    private uti: Uti,
    router?: Router
  ) {
    super(router);
  }

  public ngOnInit() {
    this.currentUserInfo = new Uti().getUserInfo();
    this.createEmptyForm();
    this.createTimeSchedule();
    this.buildScheduleEventConfigList();
    this.setDefaultScheduleEventGridData();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
    this.destroyObject();
  }

  public updateToGird(): boolean {
    if (this.isEditing) {
      return this.updateScheduleEvent();
    }
    return this.addScheduleEvent();
  }

  public wjGotFocus() {
    if (this.scheduleTimeCtr) {
      this.scheduleTimeCtr.isDroppedDown = true;
    }
  }

  public addScheduleEvent(): boolean {
    this.scheduleEventForm['submitted'] = true;
    this.scheduleEventForm.updateValueAndValidity();
    return this.callAddScheduleEvent(this.scheduleEventForm.value);
  }

  public onDeleteHandle(gridId: any) {
    this['scheduleEventGridData' + this.localScheduleType] = reject(
      this['scheduleEventGridData' + this.localScheduleType],
      {
        id: gridId,
      }
    );
    this.scheduleEventGridData = reject(this.scheduleEventGridData, {
      id: gridId,
    });
    this.setDirtyForScheduleEventConfigList();
  }

  public onRunHandle(itemData: any) {
    this.onRunAction.emit(itemData);
  }

  public buildSavingJsonData(): Array<any> {
    return [
      ...this.scheduleEventGridDataOneTime,
      ...this.scheduleEventGridDataDaily,
      ...this.scheduleEventGridDataWeekly,
      ...this.scheduleEventGridDataMonthly,
      ...this.scheduleEventGridDataAnnual,
    ];
  }

  public isValid(): boolean {
    // if (!this.isFormValid()) return;
    const changeList = this.scheduleEventConfigList.filter((x) => x.isChange);
    if (changeList && !!changeList.length) {
      return true;
    }
    this._toasterService.pop(
      'warning',
      'Validation Failed',
      'No entry data for saving!'
    );
    return false;
  }

  public isFormValid(): boolean {
    if (this.isStartDateGreaterThanStopDate) {
      this._toasterService.pop(
        'warning',
        'Validation Failed',
        'Start date is greater than Stop date!'
      );
      return false;
    }
    if (this.scheduleEventForm.valid) {
      return true;
    }
    this._toasterService.pop(
      'warning',
      'Validation Failed',
      'No entry data for saving!'
    );
    return false;
  }

  public updateScheduleEvent(): boolean {
    return this.scheduleSettingGrid.deleteGridItem(
      this.currentGridItems[this.localScheduleType].id,
      () => {
        this.onDeleteHandle(this.currentGridItems[this.localScheduleType].id);
        return this.addScheduleEvent();
      }
    );
  }

  public onRowDoubleClickedHandle(rowData: ScheduleEvent) {
    this.isEditing = true;
    this.bindFormData(rowData);
    this.currentGridItems[this.localScheduleType] = rowData;
    this.isUpdateButtonDisabled = false;
  }

  public weekClicked(weekDayItem) {
    this.formDirtyAction.emit(true);
  }

  public monthClicked(dayItem) {
    this.formDirtyAction.emit(true);
  }

  public onGridEditedHandle(rowData: any) {
    if (!rowData) return;
    for (let item of this['scheduleEventGridData' + this.localScheduleType]) {
      if (item.id !== rowData.id) continue;
      item.activeSchedule = rowData.activeSchedule;
      break;
    }
    this.setDirtyForScheduleEventConfigList();
  }

  public onCheckAllCheckedHandle(status: any) {
    for (let item of this['scheduleEventGridData' + this.localScheduleType]) {
      item.activeSchedule = !!status;
    }
    this.setDirtyForScheduleEventConfigList();
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/

  private subscribeFormValueChange() {
    if (this.formValuesChangeSubscription)
      this.formValuesChangeSubscription.unsubscribe();

    this.formValuesChangeSubscription = this.scheduleEventForm.valueChanges
      .debounceTime(this.consts.valueChangeDeboundTimeDefault)
      .subscribe((data) => {
        this._appErrorHandler.executeAction(() => {
          this.setOutputData();
          this.setIsStartDateGreaterThanStopDate();
          if (!this.scheduleEventForm.pristine) {
            this.formDirtyAction.emit(true);
          }
        });
      });
  }

  private setIsStartDateGreaterThanStopDate() {
    const value = this.scheduleEventForm.value;
    this.isStartDateGreaterThanStopDate =
      value['startDate'] > value['stopDate'];
  }

  private setOutputData(isDirty?: boolean) {
    this.isDirty = isDirty === undefined ? this.isDirty : isDirty;
    this.outputDataAction.emit({
      formValue: this.scheduleEventForm,
      isDirty: this.isDirty,
    });
  }

  private execInputData(data: ScheduleSettingData) {
    if (!data || !data.scheduleType) return;
    this.setDataForForm(data);
    this.buildDataForGrid(data);
    this.scheduleEventGridData = cloneDeep(
      this['scheduleEventGridData' + data.scheduleType]
    );
    this.setScheduleDataForScheduleEventConfigList();
  }

  private setScheduleDataForScheduleEventConfigList() {
    for (let scheduleType of this.SCHEDULE_TYPE) {
      Uti.setValueForArrayByKey(
        this.scheduleEventConfigList,
        'data',
        cloneDeep(this['scheduleEventGridData' + scheduleType]),
        'name',
        scheduleType
      );
    }
  }

  private buildDataForGrid(data: ScheduleSettingData) {
    for (let scheduleType of this.SCHEDULE_TYPE) {
      this['scheduleEventGridData' + scheduleType] = cloneDeep(
        data.scheduleEvents.filter((x) => {
          return x.scheduleType === scheduleType;
        })
      );
    }
  }

  private setDataForForm(data: ScheduleSettingData) {
    if (!this.scheduleEventForm) return;
    // this.scheduleEventForm.controls['startDate'].setValue(Uti.parseStrDateToRealDate(data.startDate));
    // this.scheduleEventForm.controls['stopDate'].setValue(Uti.parseStrDateToRealDate(data.stopDate));
  }

  private buildScheduleEventConfigList() {
    this.scheduleEventConfigList = this.SCHEDULE_TYPE.map((x) => {
      return new ScheduleEventConfig({
        name: x,
        isChange: false,
        // isPrimary: (x === this.scheduleTypePrimary),
        data: this['scheduleEventGridData' + x],
      });
    });
  }

  private setDirtyForScheduleEventConfigList() {
    const currentItem = this.scheduleEventConfigList.find(
      (x) => x.name == this.localScheduleType
    );
    currentItem.isChange = true;
    currentItem.data = this['scheduleEventGridData' + this.localScheduleType];
    this.setOutputData(true);
  }

  private setDefaultScheduleEventGridData() {
    this.scheduleEventGridData = cloneDeep(this.scheduleEventGridDataOneTime);
  }

  private callAddScheduleEvent(formValue: any): boolean {
    if (!this.isFormValid()) {
      return false;
    }
    switch (this.localScheduleType) {
      case this.SCHEDULE_TYPE[0]:
        return this.addScheduleForOneTime(formValue);
      case this.SCHEDULE_TYPE[1]:
        return this.addScheduleForDaily(formValue);
      case this.SCHEDULE_TYPE[2]:
        return this.addScheduleForWeekly(formValue);
      case this.SCHEDULE_TYPE[3]:
        return this.addScheduleForMonthly(formValue);
      case this.SCHEDULE_TYPE[4]:
        return this.addScheduleForAnnual(formValue);
    }
    return true;
  }

  private addScheduleForOneTime(formValue: any): boolean {
    const newItem = this.createFirstScheduleEvent(formValue);
    newItem.on = JSON.stringify(
      Uti.getUTCDateWithoutHour(new Date(formValue['runDate']))
    ).replace(/"/g, '');
    newItem.dateFormat = this.globalDateFormat;
    if (this.checkExistData(newItem, true)) return false;
    this.scheduleEventGridDataOneTime.push(newItem);
    this.resetGridData();
    this.setDirtyForScheduleEventConfigList();
    this.scheduleSettingGrid.callExpandNodeByData([newItem.on]);
    this.resetForm();
    return true;
  }

  private addScheduleForDaily(formValue: any): boolean {
    const newItem = this.createFirstScheduleEvent(formValue);
    newItem.on = 'Daily';
    if (this.checkExistData(newItem)) return false;
    this.scheduleEventGridDataDaily.push(newItem);
    this.resetGridData();
    this.setDirtyForScheduleEventConfigList();
    this.scheduleSettingGrid.callExpandNodeByData(['Daily']);
    this.resetForm();
    return true;
  }

  private addScheduleForWeekly(formValue: any): boolean {
    let result: Array<ScheduleEvent> = [];
    let ons: Array<string> = [];
    let hasSelected: boolean = false;
    for (let item of this.weekDayItems) {
      if (!item.select) continue;
      hasSelected = true;
      const newItem = this.createFirstScheduleEvent(formValue);
      newItem.on = item.name;
      if (this.checkExistData(newItem, true)) continue;
      ons.push(item.name);
      result.push(newItem);
    }
    if (!hasSelected) {
      this._toasterService.pop(
        'warning',
        'Warning',
        'Please select day in week.'
      );
    }
    if (!result.length) return false;
    this.scheduleEventGridDataWeekly = [
      ...this.scheduleEventGridDataWeekly,
      ...result,
    ];
    this.resetGridData();
    this.setDirtyForScheduleEventConfigList();
    this.scheduleSettingGrid.callExpandNodeByData(ons);
    this.resetForm();
    return true;
  }

  private addScheduleForMonthly(formValue: any): boolean {
    let result: Array<ScheduleEvent> = [];
    let ons: Array<string> = [];
    let hasSelected: boolean = false;
    for (let item of this.dayItems) {
      if (!item.select) continue;
      hasSelected = true;
      const newItem = this.createFirstScheduleEvent(formValue);
      newItem.on = item.name;
      if (this.checkExistData(newItem, true)) continue;
      ons.push(item.name);
      result.push(newItem);
    }
    if (!hasSelected) {
      this._toasterService.pop(
        'warning',
        'Warning',
        'Please select day in month.'
      );
    }
    if (!result.length) return false;
    this.scheduleEventGridDataMonthly = [
      ...this.scheduleEventGridDataMonthly,
      ...result,
    ];
    this.resetGridData();
    this.setDirtyForScheduleEventConfigList();
    this.scheduleSettingGrid.callExpandNodeByData(ons);
    this.resetForm();
    return true;
  }

  private addScheduleForAnnual(formValue: any): boolean {
    const newItem = this.createFirstScheduleEvent(formValue);
    newItem.on = JSON.stringify(
      Uti.getUTCDateWithoutHour(new Date(formValue['runDate']))
    ).replace(/"/g, '');
    newItem.dateFormat = this.globalDateFormat;
    if (this.checkExistData(newItem, true)) return false;
    this.scheduleEventGridDataAnnual.push(newItem);
    this.resetGridData();
    this.setDirtyForScheduleEventConfigList();
    this.scheduleSettingGrid.callExpandNodeByData([newItem.on]);
    this.resetForm();
    return true;
  }

  private createFirstScheduleEvent(formValue: any): ScheduleEvent {
    return new ScheduleEvent({
      id: Uti.getTempId(),
      minute: formValue['runTime'].getMinutes(),
      hour: formValue['runTime'].getHours(),
      email: formValue['email'],
      parameter: formValue['parameter'],
      startDate: formValue['startDate'],
      stopDate: formValue['stopDate'],
      note: formValue['note'],
      scheduleType: this.localScheduleType,
      activeSchedule:
        this.currentGridItems && this.currentGridItems[this.localScheduleType]
          ? this.currentGridItems[this.localScheduleType]['activeSchedule']
          : true,
    });
  }

  private createEmptyForm() {
    this.formBuilder = new FormBuilder();
    this.scheduleEventForm = this.formBuilder.group({
      startDate: [new Date(), Validators.required],
      stopDate: [new Date(), Validators.required],
      runDate: new Date(),
      runTime: new Date(new Date().setHours(0, 0, 0, 0)),
      email: [this.currentUserInfo.email, Validators.required],
      parameter: '',
      note: '',
    });
    this.scheduleEventForm['submitted'] = false;
    this.subscribeFormValueChange();
  }

  private createTimeSchedule() {
    this.weekDayItems = this.createTimeScheduleForWeekly();
    this.dayItems = this.createTimeScheduleForMonthly();
    this.appendDefaultValueToTranslateResource();
  }

  private appendDefaultValueToTranslateResource() {
    for (let weekDayItem of this.weekDayItems) {
      defaultLanguage['Schedule_setting__w_' + weekDayItem.name] =
        weekDayItem.name;
    }
  }

  private createTimeScheduleForWeekly(): Array<TimeSchedule> {
    return this.dayOfWeekEnum.map((x) => {
      return new TimeSchedule({
        name: x,
        select: false,
      });
    });
  }

  private createTimeScheduleForMonthly(): Array<TimeSchedule> {
    let result: Array<TimeSchedule> = [];
    for (let i = 1; i < 32; i++) {
      result.push(
        new TimeSchedule({
          name: ('0' + i).slice(-2),
          select: false,
        })
      );
    }
    return result;
  }

  private execScheduleType(data) {
    this.resetForm();
    this.localScheduleType = data;
    this.builScheduleEventGridData();
    this.resetGridData();
    this.isUpdateButtonDisabled =
      !this.currentGridItems[this.localScheduleType];
  }

  private resetGridData() {
    this.scheduleEventGridData.length = 0;
    this.scheduleEventGridData = cloneDeep(
      this['scheduleEventGridData' + this.localScheduleType]
    );
  }

  private builScheduleEventGridData() {
    switch (this.localScheduleType) {
      // One Time
      case this.SCHEDULE_TYPE[0]:
      case this.SCHEDULE_TYPE[4]:
        this.builScheduleEventGridDataForItem();
        break;
      case this.SCHEDULE_TYPE[1]:
        // Daily
        this.builScheduleEventGridDataForItem(true);
    }
  }

  private builScheduleEventGridDataForItem(isDaily?: boolean) {
    const currentItem = this.scheduleEventConfigList.find(
      (x) => x.name == this.localScheduleType
    );
    if (!currentItem) return;
    if (isDaily) {
      this.buildDataForDaily(cloneDeep(currentItem.data));
    } else {
      this['scheduleEventGridData' + this.localScheduleType] = cloneDeep(
        currentItem.data
      );
    }
  }

  // private builScheduleEventGridDataForItem(isDaily?: boolean) {
  //     const primaryItem = this.scheduleEventConfigList.find(x => x.isPrimary);
  //     const currentItem = this.scheduleEventConfigList.find(x => x.name == this.localScheduleType);
  //     if (!primaryItem || !primaryItem.name || currentItem.isChange
  //         || primaryItem.name == currentItem.name
  //         || (primaryItem.name != this.SCHEDULE_TYPE[0] && primaryItem.name != this.SCHEDULE_TYPE[4])) {
  //         return;
  //     }
  //     if (isDaily) {
  //         this.buildDataForDaily(cloneDeep(primaryItem.data));
  //     } else {
  //         this['scheduleEventGridData' + this.localScheduleType] = cloneDeep(primaryItem.data);
  //     }
  // }
  private buildDataForDaily(scheduleEventDadta: Array<ScheduleEvent>) {
    for (let item of scheduleEventDadta) {
      item.on = 'Daily';
      item.dateFormat = '';
    }
    this['scheduleEventGridData' + this.localScheduleType] = uniqBy(
      scheduleEventDadta,
      'at'
    );
  }
  private checkExistData(newItem: any, isCheckOn?: boolean): boolean {
    let existedItem: any = false;
    if (isCheckOn) {
      existedItem = find(
        this['scheduleEventGridData' + this.localScheduleType],
        {
          on: newItem.on,
          at: newItem.at,
        }
      );
    } else {
      existedItem = find(
        this['scheduleEventGridData' + this.localScheduleType],
        {
          at: newItem.at,
        }
      );
    }
    if (!!existedItem) {
      this._toasterService.pop(
        'warning',
        'Warning',
        'This time is existed: On: ' + newItem.on + ' - At: ' + newItem.at
      );
    }
    return !!existedItem;
  }

  private bindFormData(rowData: ScheduleEvent) {
    rowData = rowData || new ScheduleEvent();
    this.scheduleEventForm.controls['runTime'].setValue(
      new Date(new Date().setHours(rowData.hour, rowData.minute, 0, 0))
    );
    this.scheduleEventForm.controls['email'].setValue(rowData.email);
    this.scheduleEventForm.controls['parameter'].setValue(rowData.parameter);
    this.scheduleEventForm.controls['note'].setValue(rowData.note);
    this.scheduleEventForm.controls['startDate'].setValue(rowData.startDate);
    this.scheduleEventForm.controls['stopDate'].setValue(rowData.stopDate);
    this.bindDataForOnControl(rowData);
  }

  private bindDataForOnControl(rowData: ScheduleEvent) {
    switch (this.localScheduleType) {
      // One Time
      // Daily
      // Annual
      case this.SCHEDULE_TYPE[0]:
      case this.SCHEDULE_TYPE[1]:
      case this.SCHEDULE_TYPE[4]:
        this.scheduleEventForm.controls['runDate'].setValue(
          Uti.parseStrDateToRealDate(rowData.on)
        );
        break;
      // Weekly
      case this.SCHEDULE_TYPE[2]:
        this.bindOnForMultiCheckbox(rowData.on, this.weekDayItems);
        break;
      // Monthly
      case this.SCHEDULE_TYPE[3]:
        this.bindOnForMultiCheckbox(rowData.on, this.dayItems);
    }
  }

  private bindOnForMultiCheckbox(on: string, bindData: any) {
    for (let item of bindData) {
      item.select = item.name === on;
    }
  }

  private resetForm() {
    if (!this.scheduleEventForm) return;
    this.scheduleEventForm.controls['runTime'].setValue(
      new Date(new Date().setHours(0, 0, 0, 0))
    );
    this.scheduleEventForm.controls['email'].setValue(
      this.currentUserInfo.email
    );
    this.scheduleEventForm.controls['parameter'].setValue(null);
    this.scheduleEventForm.controls['startDate'].setValue(null);
    this.scheduleEventForm.controls['stopDate'].setValue(null);
    this.scheduleEventForm.controls['note'].setValue(null);
    this.scheduleEventForm.controls['runDate'].setValue(
      new Date(new Date().setHours(0, 0, 0, 0))
    );
    this.scheduleEventForm['submitted'] = false;
    this.scheduleEventForm.markAsPristine();
    this.resetDataForForm();
    this.currentGridItems[this.localScheduleType] = null;
    this.isUpdateButtonDisabled = true;
    this.isEditing = false;
  }

  private resetDataForForm() {
    switch (this.localScheduleType) {
      // Weekly
      case this.SCHEDULE_TYPE[2]:
        this.bindOnForMultiCheckbox('', this.weekDayItems);
        break;
      // Monthly
      case this.SCHEDULE_TYPE[3]:
        this.bindOnForMultiCheckbox('', this.dayItems);
    }
  }

  private destroyObject() {
    this.weekDayItems.length = 0;
    this.dayItems.length = 0;
    this.scheduleEventGridData.length = 0;
    this.scheduleEventGridDataOneTime.length = 0;
    this.scheduleEventGridDataDaily.length = 0;
    this.scheduleEventGridDataWeekly.length = 0;
    this.scheduleEventGridDataMonthly.length = 0;
    this.scheduleEventGridDataAnnual.length = 0;
    this.scheduleEventConfigList.length = 0;
  }
}
