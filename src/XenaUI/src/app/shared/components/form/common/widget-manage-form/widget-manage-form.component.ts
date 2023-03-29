import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  Injector,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { FormBase } from 'app/shared/components/form/form-base';
import { Uti, CustomValidators } from 'app/utilities';
import { Validators } from '@angular/forms';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as widgetContentReducer from 'app/state-management/store/reducer/widget-content-detail';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { FormOutputModel } from 'app/models';
import {
  ProcessDataActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { CommonService, AppErrorHandler, ModalService } from 'app/services';
import { ComboBoxTypeConstant } from 'app/app.constants';
import { ApiResultResponse } from 'app/models';
import cloneDeep from 'lodash-es/cloneDeep';
import isEmpty from 'lodash-es/isEmpty';
import { WjMultiSelect } from 'wijmo/wijmo.angular2.input';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ControlMessageComponent } from 'app/shared/components/form';

@Component({
  selector: 'widget-manage-form',
  styleUrls: ['./widget-manage-form.component.scss'],
  templateUrl: './widget-manage-form.component.html',
})
export class WidgetManageFormComponent
  extends FormBase
  implements OnInit, OnDestroy
{
  public listComboBox: any = {
    widgetType: [],
    moduleItems: [],
  };
  public widgetGroups: Array<any> = [];

  private _formEditModeState: Observable<boolean>;
  private _formCloneModeState: Observable<boolean>;
  private _rowsDataState: Observable<any>;
  private _formEditModeStateSubscription: Subscription;
  private _formCloneModeStateSubscription: Subscription;
  private _dispatcherSubscription: Subscription;
  private _rowsDataStateSubscription: Subscription;
  private _idRepWidgetApp: any;
  private _currentWidget: any = {};
  private _currentWidgetModule: any = {};
  private _formEditMode: boolean = false;
  private _formCloneMode: boolean = false;
  private _displayOnDirty: boolean = false;

  @ViewChild('module') moduleCombobox: WjMultiSelect;
  @ViewChild('moduleControlMessage')
  moduleControlMessage: ControlMessageComponent;
  constructor(
    protected injector: Injector,
    protected router: Router,
    private _toasterService: ToasterService,
    private _modalService: ModalService,
    private _dispatcher: ReducerManagerDispatcher,
    private _ref: ChangeDetectorRef,
    private _store: Store<AppState>,
    private _comService: CommonService
  ) {
    super(injector, router);
  }

  public ngOnInit() {
    this.registerSubscribe();
    this.subcribeEditModeState();
    this.subcribeCloneModeState();
    this.subcribeRequestSaveState();
    this.initEmptyData();
    this.getDataForCombobox();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public submit() {
    this.formGroup['submitted'] = true;
    this.formGroup.updateValueAndValidity();
    const isValid = this.isValid(true);
    if (!isValid) {
      this.outputModel = new FormOutputModel({
        formValue: this.formGroup.value,
        submitResult: false,
        isValid: isValid,
        isDirty: this.isDirty(),
        returnID: null,
      });
      this.outputData.emit(this.outputModel);
      return;
    }
    if (!this.isDirty()) {
      this.outputModel = new FormOutputModel({
        formValue: this.formGroup.value,
        submitResult: false,
        isValid: true,
        isDirty: false,
        returnID: null,
      });
      this.outputData.emit(this.outputModel);
      return;
    }
    this.saveData();
  }

  public isDirty(): boolean {
    return this.formGroup.dirty || this._displayOnDirty;
  }

  public isValid(isShowMessage?: boolean): boolean {
    if (this.formGroup.valid) {
      if (!this.isDisplayOnValid()) {
        if (isShowMessage)
          this._modalService.warningText(
            'Modal_Message__Select_An_Item_Display'
          );
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  public prepareSubmitData(): any {
    const formValue = this.formGroup.value;
    let result: any = {
      IdSettingsGUI: this.getIdSettingsGUI(),
      IdRepWidgetType: formValue.type,
      WidgetDataType: this.buildWidgetDataType(formValue),
      WidgetTitle: formValue.title,
      IconName: formValue.icon,
      JsonString: formValue.getJson,
      UpdateJsonString: formValue.updateJson,
      // IdSettingsModule: this.moduleCombobox.selectedItem.idSettingsModule,
      ToolbarJson: this.buildToolbarJson(formValue.title),
      UsedModule: this.getUsedModule(),
    };
    if (this._idRepWidgetApp) {
      result.IdRepWidgetApp = this._idRepWidgetApp;
    }
    return result;
  }

  public onCheckedItemsChanged() {
    const forAllMoudleItem = this.moduleCombobox.checkedItems.find(
      (x) => x.keepValue == '-1'
    );
    if (forAllMoudleItem) {
      if (this.moduleCombobox.checkedItems.length > 1) {
        this._toasterService.pop(
          'warning',
          'Warning',
          'Remove "All Advance..." to select other module'
        );
      }
      for (let item of this.listComboBox.moduleItems) {
        item['idValue'] = false;
      }
      this.listComboBox.moduleItems[0]['idValue'] = true;
      this.moduleCombobox.refresh();
    }
    this.onModuleChanged();
    // this.formGroup.controls['module']['valueIncorrect'] = !this.moduleCombobox.checkedItems.length;
    if (!this.moduleCombobox.checkedItems.length) {
      this.formGroup.controls['module'].setValidators(Validators.required);
      this.formGroup.controls['module'].setErrors({ required: true });
    } else {
      this.formGroup.controls['module'].clearValidators();
      this.formGroup.controls['module'].setErrors(null);
    }
    this.moduleControlMessage.reUpdateStyleForControl();
  }

  public onGroupChanged(group: any) {
    this._displayOnDirty = true;
    group.dirty = true;
    this.outputModel = new FormOutputModel({
      formValue: this.formGroup.value,
      submitResult: null,
      isValid: this.isValid(),
      isDirty: true,
      returnID: null,
    });
    this.outputData.emit(this.outputModel);
    // this.processFormChanged();
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/

  private registerSubscribe() {
    this._formEditModeState = this._store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formEditMode
    );
    this._formCloneModeState = this._store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formCloneMode
    );
    this._rowsDataState = this._store.select(
      (state) =>
        widgetContentReducer.getWidgetContentDetailState(
          state,
          this.ofModule.moduleNameTrim
        ).rowsData
    );
  }

  private onModuleChanged() {
    if (
      !this.moduleCombobox ||
      !this.moduleCombobox.checkedItems ||
      !this.moduleCombobox.checkedItems.length
    ) {
      this.widgetGroups = [];
      return;
    }
    this.buildDataForDisplayOn(this.moduleCombobox.checkedItems);
  }

  private isDisplayOnValid(): boolean {
    if (
      this.widgetGroups.length === 1 &&
      this.widgetGroups[0].idSettingsGUI == '-1'
    ) {
      return true;
    }
    const displayOn = this.widgetGroups.find((x) => !!x.value);
    return displayOn && displayOn.value;
  }

  private initEmptyData() {
    this.initForm(
      {
        title: ['', CustomValidators.required],
        type: ['', Validators.required],
        module: [undefined, Validators.required],
        icon: ['', Validators.required],
        listenKey: '',
        filterKey: '',
        primaryKey: '',
        add: '',
        edit: '',
        delete: '',
        getJson: '',
        updateJson: '',
      },
      true
    );
    Uti.registerFormControlType(this.formGroup, {
      dropdown: 'type',
      multiple: 'module',
    });
  }

  private saveData() {
    const data = this.prepareSubmitData();
    this._comService.updateWidgetApp(data).subscribe((response: any) => {
      this.appErrorHandler.executeAction(() => {
        this.outputModel = new FormOutputModel({
          submitResult: true,
          formValue: this.formGroup.value,
          isDirty: false,
          isValid: true,
          returnID: Uti.isResquestSuccess(response)
            ? response.item.returnID
            : null,
        });
        this.outputData.emit(this.outputModel);
        if (!response.item.returnID) {
          return;
        }
        this.resetForm();
      });
    });
  }

  private resetForm() {
    Uti.resetValueForForm(this.formGroup);
    this.widgetGroups.length = 0;
    this._idRepWidgetApp = null;
  }

  private subcribeEditModeState() {
    this._formEditModeStateSubscription = this._formEditModeState.subscribe(
      (_formEditModeState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          this._formEditMode = _formEditModeState;
        });
      }
    );
  }

  private subcribeCloneModeState() {
    this._formCloneModeStateSubscription = this._formCloneModeState.subscribe(
      (_formCloneModeState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          this._formCloneMode = _formCloneModeState;
        });
      }
    );
  }

  private subcribeRequestSaveState() {
    this._dispatcherSubscription = this._dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_SAVE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.submit();
        });
      });
  }

  private subcribeWidgetRowData() {
    this._rowsDataStateSubscription = this._rowsDataState.subscribe(
      (rowsData: any) => {
        this.appErrorHandler.executeAction(() => {
          this._idRepWidgetApp = Uti.getValueFromWidgetRowDataArrayByKey(
            rowsData,
            'IdRepWidgetApp'
          );
          if (
            !rowsData ||
            !rowsData.length ||
            !this._idRepWidgetApp ||
            (!this._formEditMode && !this._formCloneMode)
          ) {
            this._idRepWidgetApp = null;
            return;
          }
          this.getWidgetDataById();
        });
      }
    );
  }

  private getWidgetDataById() {
    this._comService
      .getWidgetAppById(this._idRepWidgetApp)
      .subscribe((response: any) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !Uti.isResquestSuccess(response) ||
            response.item.length < 2 ||
            !response.item[1].length
          ) {
            return;
          }
          const wd = response.item[1][0];
          this._currentWidget = wd;
          const widgetDataType = Uti.tryParseJson(
            Uti.mapEmptyToStringEmpty(wd.WidgetDataType)
          );
          this.formGroup.controls['title'].setValue(
            Uti.mapEmptyToStringEmpty(wd.WidgetApp)
          );
          this.formGroup.controls['type'].setValue(
            Uti.mapEmptyToStringEmpty(wd.IdRepWidgetType.toString())
          );
          this.setFormDataForModule(wd);
          this.formGroup.controls['icon'].setValue(
            Uti.mapEmptyToStringEmpty(wd.IconName)
          );
          this.formGroup.controls['listenKey'].setValue(
            widgetDataType.listenKey
          );
          this.formGroup.controls['filterKey'].setValue(
            widgetDataType.filterKey
          );
          this.formGroup.controls['primaryKey'].setValue(
            widgetDataType.primaryKey
          );
          this.formGroup.controls['add'].setValue(
            widgetDataType.editTableSetting &&
              widgetDataType.editTableSetting.addNew == '1'
          );
          this.formGroup.controls['edit'].setValue(
            widgetDataType.editTableSetting &&
              widgetDataType.editTableSetting.edit == '1'
          );
          this.formGroup.controls['delete'].setValue(
            widgetDataType.editTableSetting &&
              widgetDataType.editTableSetting.delete == '1'
          );
          this.formGroup.controls['getJson'].setValue(
            Uti.mapEmptyToStringEmpty(wd.JsonString)
          );
          this.formGroup.controls['updateJson'].setValue(
            Uti.mapEmptyToStringEmpty(wd.UpdateJsonString)
          );
          this.formGroup.markAsPristine();
        });
      });
  }

  private setFormDataForModule(widgetData: any) {
    const moduleData: any = [];
    let usedModule: any = widgetData.UsedModule;
    if (usedModule && !isEmpty(usedModule)) {
      usedModule = usedModule.split(',');
      for (let item of this.listComboBox.moduleItems) {
        if (usedModule.indexOf(item.keepValue) > -1) {
          moduleData.push(item);
        }
      }
    } else {
      for (let item of this.listComboBox.moduleItems) {
        if (item.keepValue == widgetData.IdSettingsGUI) {
          this._currentWidget.UsedModule = widgetData.IdSettingsGUI + '';
          moduleData.push(item);
        }
      }
    }

    this.formGroup.controls['module'].setValue(moduleData);
  }

  private getDataForCombobox() {
    this._comService
      .getListComboBox(
        ComboBoxTypeConstant.widgetType +
          ',' +
          ComboBoxTypeConstant.moduleItems +
          ',',
        null,
        true
      )
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
          for (let item of response.item.moduleItems) {
            item.keepValue = item.idValue;
            item.idValue = false;
          }
          this.listComboBox = response.item;
          this.isRenderForm = true;
          this.subcribeWidgetRowData();
        });
      });
  }

  private buildDataForDisplayOn(settings: Array<any>) {
    const widgetGroups: Array<any> = [];
    for (let item of settings) {
      let jsonSetting = Uti.tryParseJson(item.jsonSettings);
      let widgetGroup: any = {
        text: item.textValue,
        value: this.getKeepValueForModuleGroup(item.textValue),
        group: [],
        jsonSettings: item.jsonSettings,
        idSettingsGUI: item.keepValue,
        idSettingsModule: item.idSettingsModule,
        dirty: false,
      };
      for (let item1 of jsonSetting) {
        widgetGroup.group.push({
          value: item1.Tooltip,
          icon: item1.Icon,
          text: item1.Tooltip,
        });
        if (this.isExistsWidgetAppInThisGroup(item1.Widgets)) {
          widgetGroup.value = item1.Tooltip;
        }
      }
      widgetGroups.push(widgetGroup);
    }
    this.widgetGroups.length = 0;
    this.widgetGroups = widgetGroups;

    if (this._formCloneMode) {
      this._currentWidget = {};
      this._idRepWidgetApp = null;
    }
  }

  private getKeepValueForModuleGroup(moduleName: string): string {
    const currentModule = this.widgetGroups.find((x) => x.text == moduleName);
    if (!currentModule) {
      return '';
    }
    return currentModule.value || '';
  }

  private isExistsWidgetAppInThisGroup(group: Array<any>): boolean {
    for (let item of group) {
      if (item.IdRepWidgetApp == this._idRepWidgetApp) {
        return true;
      }
    }
    return false;
  }

  private buildToolbarJson(widgetTitle: string): any {
    if (
      this.widgetGroups.length === 1 &&
      this.widgetGroups[0].idSettingsGUI == '-1'
    ) {
      return null;
    }
    let result: any = {
      WidgetJsonToolbar: [],
    };
    for (let item of this.widgetGroups) {
      let settings = Uti.tryParseJson(item.jsonSettings);
      if (item.dirty) {
        this.removeWidgetFromSettingJson(settings);
      }
      if (item.dirty || this._formCloneMode) {
        this.appendWidgetToSettingJson(settings, item.value);
      }
      settings = this.updateWidgetNameToToolBarJson(settings, widgetTitle);
      result.WidgetJsonToolbar.push({
        IdSettingsModule: item.idSettingsModule,
        JsonSettings: JSON.stringify(settings),
      });
      this.getJsonSettingOfMovedModule(result);
    }
    const jsonResult = JSON.stringify(result);
    return jsonResult;
  }

  private updateWidgetNameToToolBarJson(
    settings: Array<any>,
    widgetName: string
  ): any {
    for (let item of settings) {
      for (let widget of item.Widgets) {
        if (widget.IdRepWidgetApp != this._idRepWidgetApp) continue;
        widget.WidgetName = widgetName;
        return settings;
      }
    }
    return settings;
  }

  private getJsonSettingOfMovedModule(saveData: any) {
    let currentUsedModule = this._currentWidget.UsedModule || '';
    currentUsedModule = currentUsedModule.split(',');
    let usedModule: any = this.getUsedModule() || '';
    usedModule = usedModule.split(',');
    let movedModule: any = [];
    for (let item of currentUsedModule) {
      if (item == '-1') continue;
      if (usedModule.indexOf(item) === -1) {
        movedModule.push(item);
      }
    }
    if (!movedModule.length) return;
    this.setRemovedWidgetFromMovedModule(saveData, movedModule);
  }

  private setRemovedWidgetFromMovedModule(saveData: any, movedModule: any) {
    for (let item of this.listComboBox.moduleItems) {
      if (movedModule.indexOf(item.keepValue) > -1) {
        const settings = Uti.tryParseJson(item.jsonSettings);
        this.removeWidgetFromSettingJson(settings);
        saveData.WidgetJsonToolbar.push({
          IdSettingsModule: item.idSettingsModule,
          JsonSettings: JSON.stringify(settings),
        });
      }
    }
  }

  private getUsedModule(): string {
    let result: string = '';
    for (let item of this.widgetGroups) {
      if (item.value || item.idSettingsGUI == '-1') {
        result += item.idSettingsGUI + ',';
      }
    }
    return result.substring(0, result.length - 1);
  }

  private removeWidgetFromSettingJson(settings: Array<any>) {
    for (let item of settings) {
      const widgetItem = item.Widgets.find(
        (x) => x.IdRepWidgetApp == this._idRepWidgetApp
      );
      if (widgetItem) {
        this._currentWidgetModule = widgetItem;
        Uti.removeItemInArray(
          item.Widgets,
          { IdRepWidgetApp: this._idRepWidgetApp },
          'IdRepWidgetApp'
        );
        return;
      } else {
        this._currentWidgetModule = {};
      }
    }
  }

  private appendWidgetToSettingJson(settings: Array<any>, value: string) {
    for (let item of settings) {
      if (item.Tooltip == value) {
        this._currentWidgetModule.IdRepWidgetApp = this._idRepWidgetApp
          ? this._idRepWidgetApp
          : '<<ReplaceRepWidgetAppId>>';
        this._currentWidgetModule.WidgetName = this.formGroup.value.title;
        this._currentWidgetModule.Icon = this.formGroup.value.icon;
        item.Widgets.push(this._currentWidgetModule);
        return;
      }
    }
  }

  private buildWidgetDataType(formValue: any) {
    let result = {
      listenKey: formValue.listenKey || '',
      filterKey: formValue.filterKey || '',
      primaryKey: formValue.primaryKey || '',
      editTableSetting: {
        addNew: formValue.add ? '1' : '',
        edit: formValue.edit ? '1' : '',
        delete: formValue.delete ? '1' : '',
      },
    };
    return JSON.stringify(result);
  }

  private getIdSettingsGUI(): string {
    if (this.widgetGroups.length === 1) {
      return this.widgetGroups[0].idSettingsGUI;
    }
    let moduleCounter: number = 0;
    let currentIdSettingGUI: any = '';
    for (let item of this.widgetGroups) {
      if (item.value || item.idSettingsGUI == '-1') {
        currentIdSettingGUI = item.idSettingsGUI;
        moduleCounter++;
      }
    }
    if (moduleCounter === 1) return currentIdSettingGUI;
    if (moduleCounter > 1) return '0';
    return null;
  }
}
