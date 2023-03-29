import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import {
  AppErrorHandler,
  BlockedOrderService,
  CampaignService,
  CommonService,
  DatatableService,
  DownloadFileService,
  ModalService,
} from 'app/services';
import { ApiResultResponse, MessageModel, User } from 'app/models';
import {
  ComboBoxTypeConstant,
  MessageModal,
  UploadFileMode,
  Configuration,
} from 'app/app.constants';
import { Uti } from 'app/utilities';
import cloneDeep from 'lodash-es/cloneDeep';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { WjMultiSelect } from 'wijmo/wijmo.angular2.input';
import {
  WidgetModuleComponent,
  WidgetUtils,
} from 'app/shared/components/widget';
import { DragulaService } from 'ng2-dragula';
import { Subject, Subscription } from 'rxjs';
import { SendLetterDialogComponent } from '../..';
import { XnCountryCheckListComponent } from '../../../xn-control/country-check-list';
import { format } from 'date-fns/esm';

@Component({
  selector: 'sav-letter-template',
  styleUrls: ['./sav-letter-template.component.scss'],
  templateUrl: './sav-letter-template.component.html',
})
export class SavLetterTemplateComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public countryCheckListData: Array<any>;
  public letter: Array<any> = [];
  public cachedLetter: Array<any> = [];
  public mandants: Array<any> = [];
  public templateFileMenus: Array<any> = [];
  public showDialog = false;
  public assignmentWidget: any[] = [];
  public typeOfAutoLetter: any[] = [];
  public dataTable: any;
  public formData: any;
  public isShowSendLetter = false;
  public requireOneCheckboxToBeChecked = true;
  public requireOneGroupReason = false;
  public isLoading: boolean;
  public inputPlaceHolderNameInvalid: boolean;
  public inputItemInvalid: boolean;
  public assignmentWidgetStyle: any = { height: '180px' };
  public showDialogTemplateName = false;
  public templateFileName = '';
  public templateTile = '';
  public templateName = '';
  public templateNameSavingMode = '';
  public submitTemplateName = false;
  public uploadFileMode = UploadFileMode.SAVTeamplate;
  public user: User = new User();
  public formSav: FormGroup;
  // public showPreviewIndicator = false;
  public isCollapse = false;
  public submitted = false;
  public isNewAutoTemplate = false;

  private _countriesOutput: any = [];
  private _isDirtyTemplateName = false;
  private _preventTemplateChange = false;
  private currentLetterTypeIndex = -1;
  private subsGroupReason = new Subscription();
  private destroy$ = new Subject();
  private cloneGroupReason: any = [];
  private showPreviewDialogData: {
    main: any;
    template: any;
    reason: Array<any>;
  } = {
    main: {},
    template: {},
    reason: [],
  };
  private templateDeleteRow: any = {};
  private existedMessage = 'This value is already used';
  private hasDuplicatePlaceholderName = false;
  private dontNeedReRenderAfterSelectLetterType = false;

  @Input() allowEdit;
  @Input() gridId: string;
  @Input() parentInstance: WidgetModuleComponent;

  @ViewChild('letterTypeCtr') letterTypeCtr: AngularMultiSelect;
  @ViewChild('mandant') mandant: WjMultiSelect;
  @ViewChild('sendLetterDialogComponent')
  private sendLetterDialogComponent: SendLetterDialogComponent;
  @ViewChild('countryCheckList')
  countryCheckList: XnCountryCheckListComponent;
  @ViewChild('elementDropdownGroupEle') elementDropdownGroupEle: ElementRef;
  @ViewChild('assignmentWidgetEle') assignmentWidgetEle: ElementRef;
  @ViewChild('countriesSectionEle') countriesSectionEle: ElementRef;
  @ViewChild('templateGridSectionEle') templateGridSectionEle: ElementRef;
  @ViewChild('eleLeftSideEle') eleLeftSideEle: ElementRef;
  @ViewChild('elementCollapsed') elementCollapsed: ElementRef;

  @Output() outputDataAction = new EventEmitter<any>();
  @Output() onSavingDataCompletedAction = new EventEmitter<any>();
  @Output() initComponentAction = new EventEmitter<any>();
  @Output() closedSendLetterAction = new EventEmitter<any>();
  @Output() startGeneratePdfAction = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private renderer2: Renderer2,
    private _dragulaService: DragulaService,
    private _campaignService: CampaignService,
    private _appErrorHandler: AppErrorHandler,
    private _commonService: CommonService,
    private _blockedOrderService: BlockedOrderService,
    private _downloadFileService: DownloadFileService,
    private _modalService: ModalService,
    private _toasterService: ToasterService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _datatableService: DatatableService,
    private _elementRef: ElementRef,
    private widgetUtils: WidgetUtils,
    router: Router
  ) {
    super(router);
    this.formSav = new FormGroup({
      mandant: new FormControl('', Validators.required),
      savChecked: new FormControl(true),
      autoChecked: new FormControl(true),
      letterType: new FormControl('', Validators.required),
      assignmentWidget: this.fb.array([this.buildAssignWidget()]),
      typeOfAutoLetter: this.fb.array([this.buildTypeOfAutoLetter()]),
      groupReason: this.fb.array([this.createGroupReason()]),
      typeOfAutoLetterActive: new FormControl(null),
    });
    _dragulaService.setOptions('group', {
      revertOnSpill: true,
      copy: false,
      moves: function (el, container, cHandle) {
        return cHandle.className === 'group-drag';
      },
    });

    _dragulaService.setOptions('item', {
      revertOnSpill: true,
      copy: false,
      moves: function (el, container, bHandle) {
        return bHandle.className == 'item-drag';
      },
    });
    this.subsGroupReason.add(
      _dragulaService.dropModel
        .asObservable()
        .takeUntil(this.destroy$)
        .subscribe((value) => {
          this.onDropModel(value.slice());
        })
    );
  }

  private patchValueOrderBy(itemArray: any) {
    for (let i = 0; i < itemArray.length; i++) {
      itemArray.controls[i].value['ItemOrderBy'] = i + 1;
    }
  }

  private onDropModel(args: any) {
    const [bagName, elSource, bagTarget, bagSource] = args;
    const itemArray = (<FormArray>this.formSav.controls['groupReason'])
      .controls;
    this.reSetOrderNumber(bagName, itemArray);
  }

  private reSetOrderNumber(bagName: string, arr: Array<any>) {
    if (!arr || !arr.length) return;
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) continue;
      if (bagName === 'group') {
        arr[i].value['GroupOrderBy'] = i + 1; // GroupOrderBy for GroupReason
      }
      if (bagName !== 'group' && arr[i].get('JSONGroupItems').length > 1) {
        this.patchValueOrderBy(arr[i].get('JSONGroupItems')); // ItemOrderBy for ItemReason
      }
    }
  }

  public ngOnInit() {
    this.getCountries();
    this.getAssignmentWidgetByLetterTypeId();
    this.getAllTypeOfAutoLetter();
    // this.buildDataForTypeOfAutoLetter();
    this.getAllMandants();
    this.createFileTemplateMenu();
    this.getListOfTemplate('-1');
  }

  requireCheckboxesToBeCheckedValidator(
    activeWidget,
    propName,
    minRequired = 1
  ) {
    let checked = 0;
    for (const v of activeWidget) {
      if (v.value[propName]) {
        checked++;
        this.requireOneCheckboxToBeChecked = false;
      }
    }

    if (checked < minRequired) {
      this.requireOneCheckboxToBeChecked = true;
    }
  }

  requireGroupReasonAdd(groupReason, minRequired = 1) {
    let checked = 0;
    if (groupReason && groupReason.length > 0) {
      checked++;
      this.requireOneGroupReason = false;
    }

    if (checked < minRequired) {
      this.requireOneGroupReason = true;
    }
  }

  public submit(callBack?: Function) {
    this.submitted = true;
    if (!this.letterTypeCtr.selectedValue) {
      this._toasterService.pop(
        'warning',
        'Validation Failed',
        'Please select letter type.'
      );
      return;
    }
    const isActiveWidget = (<FormArray>(
      this.formSav.controls['assignmentWidget']
    )).controls;
    const group = (<FormArray>this.formSav.controls['groupReason']).controls;
    if (!this.isNewAutoTemplate) {
      this.requireCheckboxesToBeCheckedValidator(isActiveWidget, 'isActive');
    }
    this.requireGroupReasonAdd(group);
    // if (this.requireOneCheckboxToBeChecked || this.requireOneGroupReason) return;
    if (this.requireOneCheckboxToBeChecked) {
      if (this.isNewAutoTemplate) {
        this._toasterService.pop(
          'warning',
          'Validation Failed',
          'Please choose type of auto letter.'
        );
      } else {
        this._toasterService.pop(
          'warning',
          'Validation Failed',
          'Please choose Assignment Widget.'
        );
      }
      return;
    }
    if (this.requireOneGroupReason && !this.isNewAutoTemplate) {
      this._toasterService.pop(
        'warning',
        'Validation Failed',
        'Please add Reason Group.'
      );
      return;
    }
    if (!this.dataTable.data.length) {
      this._toasterService.pop(
        'warning',
        'Validation Failed',
        'Please upload Template File.'
      );
      return;
    }
    if (!this.countryCheckList.hasCheckedItems()) {
      this._toasterService.pop(
        'warning',
        'Validation Failed',
        'Please choose Country.'
      );
      return;
    }
    if (this.hasDuplicatePlaceholderName && !this.isNewAutoTemplate) {
      this._toasterService.pop(
        'warning',
        'Validation Failed',
        "Please don't input duplicate Placeholder Name"
      );
      return;
    }
    if (this.formSav.invalid && this.formSav.dirty) {
      for (const v of group) {
        if (v['controls'].GroupName.invalid) {
          this._toasterService.pop(
            'warning',
            'Validation Failed',
            'GroupName is required'
          );
          return;
        }
        if (v['controls'].PlaceHolderName.invalid) {
          this._toasterService.pop(
            'warning',
            'Validation Failed',
            'PlaceHolderName is required'
          );
          return;
        }
        if (
          v['controls']['JSONGroupItems'] &&
          v['controls']['JSONGroupItems'].length
        ) {
          for (const data of v['controls']['JSONGroupItems'].controls) {
            if (
              data.controls.GroupItemName.invalid &&
              data.controls.TypeOfChoice.value !== 2
            ) {
              this._toasterService.pop(
                'warning',
                'Validation Failed',
                'Item Name is required'
              );
              return;
            }
            if (
              data.controls.GroupItemName.invalid &&
              data.controls.TypeOfChoice.value === 2
            ) {
              this.saveAllSavLetterTemplate();
              return;
            }
          }
        }
      }
    }
    this.saveAllSavLetterTemplate();
  }

  createGroupReason(data?: any): FormGroup {
    data = data || { GroupOrderBy: 1 };
    return this.fb.group({
      GroupName: [data.GroupName, Validators.required],
      PlaceHolderName: [data.PlaceHolderName, Validators.required],
      IdBackOfficeLettersGroups: data.IdBackOfficeLettersGroups,
      GroupOrderBy: data.GroupOrderBy,
      IsSoftDelete: new FormControl(0),
      JSONGroupItems: this.fb.array([this.createItemReason(data)]),
    });
  }

  buildAssignWidget(data?: any): FormGroup {
    return this.fb.group({
      idBackOffice: data && data.IdBackOfficeLettersAssignWidgetRep,
      IdBackOfficeLettersAssignWidget:
        data && data.IdBackOfficeLettersAssignWidget,
      WidgetName: data && data.WidgetName,
      isActive: data && data.IsActive,
    });
  }

  buildTypeOfAutoLetter(data?: any): FormGroup {
    return this.fb.group({
      IdRepTypeOfAutoLetter: data && data.IdRepTypeOfAutoLetter,
      typeName: data && data.Description,
    });
  }

  createItemReason(data?: any): FormGroup {
    data = data || { ItemOrderBy: 1 };
    return this.fb.group({
      TypeOfChoice: new FormControl(
        +data.TypeOfChoice || +data.TypeOfChoice == 0 ? +data.TypeOfChoice : 1
      ),
      ItemOrderBy: new FormControl(data.ItemOrderBy || 1),
      IdBackOfficeLettersGroupsItems: new FormControl(
        data.IdBackOfficeLettersGroupsItems
      ),
      IsActive: new FormControl(1),
      IsSoftDelete: new FormControl(0),
      GroupItemName: new FormControl(
        data.GroupItemName || '',
        Validators.required
      ),
    });
  }

  onChangeTypeOfChoices(indexGroup, indexItem, data) {
    const control = (<FormArray>this.formSav.controls['groupReason'])
      .at(indexGroup)
      .get('JSONGroupItems') as FormArray;
    control.controls[indexItem].get('TypeOfChoice').setValue(data);
  }

  addReasonGroup() {
    const control = <FormArray>this.formSav.controls['groupReason'];
    control.push(this.createGroupReason({ GroupOrderBy: control.length + 1 }));
    const group = (<FormArray>this.formSav.controls['groupReason']).controls;
    this.requireGroupReasonAdd(group);
  }

  deleteReasonGroup(indexGroup) {
    this._modalService.confirmMessageHtmlContent(
      new MessageModel({
        headerText: 'Delete Group Reason',
        messageType: MessageModal.MessageType.error,
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Do_You_Want_To_Delete_Group_Reason',
          },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.danger,
        callBack1: () => {
          const control = <FormArray>this.formSav.controls['groupReason'];
          const controlGroup = cloneDeep(control.controls[indexGroup].value);
          if (!controlGroup.IdBackOfficeLettersGroups) {
            control.removeAt(indexGroup);
            return;
          }
          // control.controls[indexGroup].get('IsSoftDelete').setValue(1);
          this.addDeleteGroupData(controlGroup);
          control.removeAt(indexGroup);
          setTimeout(() => {
            this.validateDuplicatePlaceHolderName();
          }, 1000);
        },
      })
    );
  }

  onCollapseAndExpand(event: any, index?: any) {
    const elementCollapse = this.elementCollapsed.nativeElement.querySelector(
      `#collapsed${index}`
    );
    if (elementCollapse && index !== 0) {
      this.renderer2.removeClass(elementCollapse, 'collapsed');
    }
  }

  public validateDuplicatePlaceHolderName() {
    this.hasDuplicatePlaceholderName = false;
    let isFound = false;
    for (
      let i = 0;
      i < this.formSav.controls['groupReason']['controls'].length;
      i++
    ) {
      isFound = false;
      for (
        let j = 0;
        j < this.formSav.controls['groupReason']['controls'].length;
        j++
      ) {
        if (j === i) continue;
        if (this.isEqualValue(i, j)) {
          this.setInvalidMessage(i, false);
          this.hasDuplicatePlaceholderName = true;
          isFound = true;
          break;
        }
      }
      if (!isFound) {
        this.setInvalidMessage(i, true);
      }
    }
  }

  private isEqualValue(i: number, j: number) {
    try {
      return (
        this.formSav.controls['groupReason']['controls'][i].controls[
          'PlaceHolderName'
        ]['value'] &&
        this.formSav.controls['groupReason']['controls'][j].controls[
          'PlaceHolderName'
        ]['value'] &&
        this.formSav.controls['groupReason']['controls'][i].controls[
          'PlaceHolderName'
        ]['value'].toLowerCase() ===
          this.formSav.controls['groupReason']['controls'][j].controls[
            'PlaceHolderName'
          ]['value'].toLowerCase()
      );
    } catch (e) {
      return false;
    }
  }

  private setInvalidMessage(index: number, isValid: boolean) {
    this.formSav.controls['groupReason']['controls'][index].controls[
      'PlaceHolderName'
    ]['ErrorMessage'] = isValid ? '' : this.existedMessage;
  }

  private addDeleteGroupData(controlGroup) {
    controlGroup['IsSoftDelete'] = 1;
    Uti.removeItemInArray(
      this.cloneGroupReason,
      controlGroup,
      'IdBackOfficeLettersGroups'
    );
    this.cloneGroupReason.push(controlGroup);
  }

  addItemReason(index) {
    const control = (<FormArray>this.formSav.controls['groupReason'])
      .at(index)
      .get('JSONGroupItems') as FormArray;
    control.push(this.createItemReason({ ItemOrderBy: control.length + 1 }));
  }

  trackByGroupId(indexGroup: number, item: any) {
    return item.value.IdBackOfficeLettersGroups;
  }

  trackByItemId(indexItem: number, item: any) {
    return item.value.IdBackOfficeLettersGroupsItems;
  }

  deleteItemReason(indexGroup, indexItem) {
    this._modalService.confirmMessageHtmlContent(
      new MessageModel({
        headerText: 'Delete Item Reason',
        messageType: MessageModal.MessageType.error,
        message: [
          { key: '<p>' },
          { key: 'Modal_Message__Do_You_Want_To_Delete_Item_Reason' },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.danger,
        callBack1: () => {
          const controlItem = (<FormArray>this.formSav.controls['groupReason'])
            .at(indexGroup)
            .get('JSONGroupItems') as FormArray;
          controlItem.controls[indexItem].get('IsSoftDelete').setValue(1);
          const controlGroup = <FormArray>this.formSav.controls['groupReason'];
          this.addDeleteGroupItemData(controlGroup, indexGroup);
          controlItem.removeAt(indexItem);
        },
      })
    );
  }

  private addDeleteGroupItemData(controlGroup, indexGroup) {
    const _controlGroup = cloneDeep(controlGroup.controls[indexGroup].value);
    const _controlItem = _controlGroup.JSONGroupItems.find(
      (x) => x['IsSoftDelete']
    );
    if (!_controlItem.IdBackOfficeLettersGroupsItems) return;
    let isFound = false;
    for (let item of this.cloneGroupReason) {
      if (
        item.IdBackOfficeLettersGroups !=
        _controlGroup.IdBackOfficeLettersGroups
      )
        continue;
      isFound = true;
      item.JSONGroupItems = item.JSONGroupItems || [];
      item.JSONGroupItems.push(_controlItem);
    }
    if (isFound) return;
    _controlGroup.JSONGroupItems = [_controlItem];
    this.cloneGroupReason.push(_controlGroup);
  }

  public onLetterTypeChanged() {
    if (this.currentLetterTypeIndex === this.letterTypeCtr.selectedIndex)
      return;
    if (this.dontNeedReRenderAfterSelectLetterType) {
      this.dontNeedReRenderAfterSelectLetterType = false;
      return;
    }
    this.currentLetterTypeIndex = this.letterTypeCtr.selectedIndex;
    this.setAutoTemplate();
    this.reloadDataAfterSaveOrChangeLetterType();
    this.toggleSaveButtonMode(true, true);
  }

  private setAutoTemplate() {
    let item = this.letter.find(
      (x) => x.idValue === this.letterTypeCtr.selectedValue
    );
    if (!item || !item.idValue) return;
    this.isNewAutoTemplate = !!item.IsAutoGeneratedLetter;
    this.formSav.controls['typeOfAutoLetterActive'].setValue(
      item['IdRepTypeOfAutoLetter']
    );
    this.requireOneCheckboxToBeChecked = !item['IdRepTypeOfAutoLetter'];
  }

  private reloadDataAfterSaveOrChangeLetterType() {
    this.getGroupAndItemsByLetterType();
    this.getListOfTemplate(this.letterTypeCtr.selectedValue);
    this.getCountries(this.letterTypeCtr.selectedValue);
    if (!this.isNewAutoTemplate) {
      this.getAssignmentWidgetByLetterTypeId(this.letterTypeCtr.selectedValue);
    } else {
      this.getAllTypeOfAutoLetter();
    }
  }

  private getListOfTemplate(idBackOfficeLetters: string) {
    this._blockedOrderService
      .getListOfTemplate(idBackOfficeLetters)
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
          const rawData = this._datatableService.formatDataTableFromRawData(
            response.item.data
          );
          this.templateDeleteRow = {};
          this.dataTable = this._datatableService.buildDataSource(rawData);
          this.buildFormData(response);
        });
      });
  }

  private buildFormData(response) {
    if (!response || !response.item) return;
    const parseResponse = JSON.parse(
      response.item.data[0][0].SettingColumnName
    );

    setTimeout(() => {
      this.formData = cloneDeep(response);
      this.formData.contentDetail = { data: [[[]], []] };
      this.formData.contentDetail.data[1] =
        this.widgetUtils.buildReadonlyGridFormColumns(
          parseResponse[1].ColumnsName,
          this.formData.contentDetail.data[1]
        );
      this.formData.contentDetail.data[1] =
        this.widgetUtils.buildReadonlyGridFormColumnsValue(
          this.dataTable.data,
          this.formData.contentDetail.data[1]
        );
    }, 200);
  }

  public close() {
    this.showDialog = false;
    // if (this.fileUpload) this.fileUpload.clearItem();
  }

  public onCompleteUploadItem(event) {
    const response = event.response;
    if (!response || !response.fileName) return;
    this.close();
    this.makeDataForTemplateGrid(response);
    this.outputEditingAction();
  }

  private makeDataForTemplateGrid(file: any) {
    if (this.dataTable.data.length) {
      let row = this.dataTable.data[0];
      row['IdBackOfficeLettersDocTemplate'] =
        row['IdBackOfficeLettersDocTemplate'] ||
        this.templateDeleteRow['IdBackOfficeLettersDocTemplate'];
      row['IdSharingTreeMedia'] =
        row['IdSharingTreeMedia'] ||
        this.templateDeleteRow['IdSharingTreeMedia'];
      row['MediaName'] = file['fileName'];
      row['MediaOriginalName'] = file['originalFileName'];
      row['MediaRelativePath'] = (() => {
        try {
          return file['path'].replace('XenaUploadFile\\', '');
        } catch (e) {
          return '';
        }
      })();
      row['MediaSize'] = file['size'];
      row['CreateDate'] = format(new Date(), 'dd.MM.yyyy');
      this.buildFormData(this.formData);
      return;
    }
    this.dataTable = {
      columns: this.dataTable.columns,
      data: [
        {
          DT_RowId: 'row_' + Uti.guid(),
          MediaName: file['fileName'],
          MediaOriginalName: file['originalFileName'],
          MediaRelativePath: (() => {
            try {
              return file['path'].replace('XenaUploadFile\\', '');
            } catch (e) {
              return '';
            }
          })(),
          MediaSize: file['size'],
          CreateDate: format(new Date(), 'dd.MM.yyyy'),
        },
      ],
    };
    this.buildFormData(this.formData);
  }

  public setShowPreviewIndicator(value: boolean) {
    // this.showPreviewIndicator = value;
    this.isLoading = value;
  }

  private getGroupAndItemsByLetterType() {
    this.isLoading = true;
    this._blockedOrderService
      .getGroupAndItemsByLetterType(this.letterTypeCtr.selectedValue)
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          let data: any = [];
          this.cloneGroupReason = [];
          this.submitted = false;
          if (!Uti.isResquestSuccess(response)) {
            this.buildDataForReasonGroup(data);
            this._changeDetectorRef.detectChanges();
            return;
          }
          try {
            this.clearFormArrayReasonGroup();
            data = response.item.data[0];
          } catch (e) {}
          setTimeout(() => {
            this.isLoading = false;
            this.buildDataForReasonGroup(data);
            setTimeout(() => {
              this.validateDuplicatePlaceHolderName();
            }, 1000);
          }, 200);
        });
      });
  }

  clearFormArrayReasonGroup() {
    const control = <FormArray>this.formSav.controls['groupReason'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
  }

  clearFormArray(formArrayName: string) {
    const control = <FormArray>this.formSav.controls[formArrayName];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
  }

  changeCheckbox($event) {
    const isActiveWidget = (<FormArray>(
      this.formSav.controls['assignmentWidget']
    )).controls;
    this.requireCheckboxesToBeCheckedValidator(isActiveWidget, 'isActive');
  }

  // changeAutoLetterCheckbox() {
  //     const isActiveWidget = (<FormArray>this.formSav.controls['typeOfAutoLetter']).controls;
  //     this.requireCheckboxesToBeCheckedValidator(isActiveWidget, 'selected');
  // }

  changeAutoLetterActiveCheckbox(item) {
    this.formSav.controls['typeOfAutoLetterActive'].setValue(
      item.value.IdRepTypeOfAutoLetter
    );
    this.requireOneCheckboxToBeChecked = false;
  }

  buildDataForReasonGroup(data) {
    const control = <FormArray>this.formSav.controls['groupReason'];
    if (!data || !data.length) {
      this.clearFormArrayReasonGroup();
      return;
    }
    for (const value of data) {
      const indexItem = control.value.findIndex(
        (v) => v.IdBackOfficeLettersGroups === value.IdBackOfficeLettersGroups
      );
      if (indexItem !== -1) {
        const controlItem = (<FormArray>this.formSav.controls['groupReason'])
          .at(indexItem)
          .get('JSONGroupItems') as FormArray;
        controlItem.push(this.createItemReason(value));
      } else {
        control.push(this.createGroupReason(value));
      }
    }
    this._changeDetectorRef.detectChanges();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
    this._dragulaService.destroy('item');
    this._dragulaService.destroy('group');
    this.destroy$.next();

    $(
      '#txt-template-name-for-upload-file',
      this._elementRef.nativeElement
    ).unbind('keyup');
    if (this.countryCheckListData) {
      this.countryCheckListData.length = 0;
    }
    if (this.letter) {
      this.letter.length = 0;
    }
    if (this.templateFileMenus) {
      this.templateFileMenus.length = 0;
    }
  }

  ngAfterViewInit(): void {
    // this.setAssignmentWidgetHeight(1000);
  }

  public outputDataCountryHandler($event: any) {
    this._countriesOutput = $event;
    this.outputEditingAction();
  }

  public setAssignmentWidgetHeight(timeout: number) {
    // setTimeout(() => {
    //     const minAssignmentWidgetHeight = (90 + 30); // 90: widget content, 30:
    //     const padding = 10;
    //     const heightElementDropdownGroup = this.elementDropdownGroupEle.nativeElement.offsetHeight;
    //     const heightCountry = this.countriesSectionEle.nativeElement.offsetHeight;
    //     const heightTemplateGrid = this.templateGridSectionEle.nativeElement.offsetHeight;
    //     const heightLeftSide = this.eleLeftSideEle.nativeElement.offsetHeight;
    //     if ((heightLeftSide - (heightElementDropdownGroup + heightCountry + heightTemplateGrid)) > minAssignmentWidgetHeight) {
    //         this.assignmentWidgetStyle = {'height': `calc(100% - ${(heightElementDropdownGroup + heightCountry + heightTemplateGrid + padding)}px)`};
    //     } else {
    //         this.assignmentWidgetStyle = {'min-height': `${minAssignmentWidgetHeight}px)`};
    //     }
    // }, timeout);
  }

  public onMandantChange() {
    if (!this.mandant.checkedItems.length) {
      this.formSav.controls['mandant'].setValidators(Validators.required);
      this.formSav.controls['mandant'].setErrors({ required: true });
    } else {
      this.formSav.controls['mandant'].clearValidators();
      this.formSav.controls['mandant'].setErrors(null);
    }
    const mandants = this.mandant.checkedItems.map((v) => v.idValue).join(',');
    if (!mandants) {
      this.letter = [];
      this.cachedLetter = [];
      return;
    }
    this.getLetterType(mandants);
  }

  public dropdownItemClickedHandler($event: any) {
    switch ($event.TabName) {
      case 'New Auto Template':
      case 'New Template':
        this.newTemplate();
        this.registerEnterForTemplateName();
        this.isNewAutoTemplate = $event.TabName === 'New Auto Template';
        break;
      case 'Rename Template':
        if (!this.letterTypeCtr || !this.letterTypeCtr.selectedItem) {
          this._modalService.warningText(
            'Modal_Message__Select_Template_To_Rename'
          );
          return;
        }
        this.renameTemplate();
        this.registerEnterForTemplateName();
        break;
      case 'Delete Template':
        if (!this.letterTypeCtr || !this.letterTypeCtr.selectedItem) {
          this._modalService.warningText(
            'Modal_Message__Select_Template_To_Delete'
          );
          return;
        }
        this.deleteTemplate();
        break;
    }
  }

  public closeDialogTemplateName() {
    if (this._isDirtyTemplateName) {
      this._modalService.confirmMessageHtmlContent(
        new MessageModel({
          headerText: 'Saving Data',
          messageType: MessageModal.MessageType.confirm,
          message: [
            { key: '<p>' },
            {
              key: 'Modal_Message__Do_You_Want_To_Save_Changed_Data',
            },
            { key: '</p>' },
          ],
          buttonType1: MessageModal.ButtonType.primary,
          callBack1: () => {
            this.saveTemplateName(this.templateNameSavingMode);
          },
          callBack2: () => {
            this.closeTemplateNamePopup();
          },
        })
      );
    } else {
      this.closeTemplateNamePopup();
    }
  }

  public templateNameChanged() {
    this._isDirtyTemplateName = true;
  }

  public resetData() {
    this.resetCountryCheckListData();
    this.resetGridData();
    this.dataTable = {
      columns: this.dataTable.columns,
      data: [],
    };
    this.detectChanges();
    this.getAllMandants();
  }

  public saveAllSavLetterTemplate() {
    this._blockedOrderService
      .saveBackOfficeLetters(this.buildSavLetterTemplate())
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
          this._toasterService.pop(
            'success',
            'Success',
            'Data is saved successfully'
          );
          this.reloadDataAfterSaveOrChangeLetterType();
          this.detectChanges();
        });
      });
  }

  public saveTemplateName(mode: string) {
    this.submitTemplateName = true;
    if (mode !== 'Delete' && !this.templateName.trim()) {
      this.focusOnTemplateName();
      return;
    }
    this._blockedOrderService
      .saveBackOfficeLetters(this.buildSavingDataForLetterType(mode))
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
          this.handleWhenSavingTemplateNameSuccess(response, mode);
          this.closeTemplateNamePopup();
          this._toasterService.pop(
            'success',
            'Success',
            'Data is saved successfully'
          );
          this.detectChanges();
        });
      });
  }

  public previewClickHandler(rowData: any) {
    if (!this.letterTypeCtr || !this.letterTypeCtr.selectedValue) {
      this._modalService.warningMessage([
        { key: 'Modal_Message__Please_Select_Letter_Type' },
      ]);
      return;
    }
    if (
      !this.isNewAutoTemplate &&
      (!this.formSav.controls['groupReason'].value ||
        !this.formSav.controls['groupReason'].value.length)
    ) {
      this._modalService.warningMessage([
        { key: 'Modal_Message__Please_Input_Reason' },
      ]);
      return;
    }
    if (this.hasDuplicatePlaceholderName) {
      this._modalService.warningMessage([
        {
          key: 'Modal_Message__Please_Dont_Input_Duplicate_Placeholder_Name',
        },
      ]);
      return;
    }
    if (this.isNewAutoTemplate) {
      this.submitDataForPreview();
      return;
    }
    this.showPreviewDialogData = {
      main: {
        IdBackOfficeLetters: this.letterTypeCtr.selectedValue,
        ListOfIdCountryLanguage: this.getListOfIdCountryLanguage(),
      },
      template: rowData,
      reason: this.formSav.controls['groupReason'].value,
    };
    this.isShowSendLetter = true;
    Uti.executeFunctionWithTimeout(
      () => {
        this.sendLetterDialogComponent.callShowPreviewDialog(
          this.showPreviewDialogData
        );
      },
      () => {
        return !!this.sendLetterDialogComponent;
      }
    );
  }

  private getListOfIdCountryLanguage(): string {
    let result: string = '';
    if (this._countriesOutput.length) {
      for (let i = 0; i < this._countriesOutput.length; i++) {
        if (this._countriesOutput[i]['isActive']) {
          result += this._countriesOutput[i]['idValue'] + ',';
        }
      }
    } else {
      for (let i = 0; i < this.countryCheckListData.length; i++) {
        if (this.countryCheckListData[i]['IsActive']) {
          result += this.countryCheckListData[i]['IdCountrylanguage'] + ',';
        }
      }
    }
    if (!!result) {
      result = result.substr(0, result.length - 1);
    }
    return result;
  }

  public downloadClickHandler(rowData: any) {
    const uploadFolder = Configuration.PublicSettings.uploadFolder;
    const relativePath = (() => {
      try {
        return rowData['MediaRelativePath'].indexOf(uploadFolder) > -1
          ? rowData['MediaRelativePath']
          : uploadFolder + '\\' + rowData['MediaRelativePath'];
      } catch (e) {
        return '';
      }
    })();

    this._downloadFileService.makeDownloadFile(
      relativePath + '\\' + rowData['MediaName'],
      rowData['MediaOriginalName'],
      this._modalService
    );
  }

  public deleteClickHandler(rowData: any) {
    this._modalService.confirmDeleteMessageHtmlContent({
      headerText: 'Delete File',
      message: [{ key: 'Modal_Message__Are_You_Sure_You_Want_To_Delete_File' }],
      callBack1: () => {
        this.templateDeleteRow = cloneDeep(this.dataTable.data[0]);
        for (const v of this.formData.contentDetail.data[1]) {
          v.Value = '';
        }
        this.buildFormData(this.formData);
        this.dataTable = {
          columns: this.dataTable.columns,
          data: [],
        };
      },
    });
  }

  public closedSendLetterHandle(isReload?: boolean) {
    this.isShowSendLetter = false;
    this.closedSendLetterAction.emit();
  }

  public initComponentHandle() {
    this.initComponentAction.emit();
  }

  public startGeneratePdfHandle(data) {
    data = data || {};
    let templateData = this.dataTable.data[0] || {};
    data['RelativePath'] = templateData['MediaRelativePath'];
    data['FileName'] = templateData['MediaName'];
    this.setShowPreviewIndicator(true);
    this.startGeneratePdfAction.emit(data);
    this.closedSendLetterHandle();
  }

  public refreshLetterType(func?: Function) {
    setTimeout(() => {
      const _temp = this.cachedLetter.filter((x) =>
        this.formSav.value['savChecked'] && this.formSav.value['autoChecked']
          ? true
          : this.formSav.value['savChecked'] &&
            !this.formSav.value['autoChecked']
          ? !x.IsAutoGeneratedLetter
          : !this.formSav.value['savChecked'] &&
            this.formSav.value['autoChecked']
          ? x.IsAutoGeneratedLetter
          : false
      );
      const _currentValue = this.formSav.controls['letterType'].value;
      this.letter = _temp;
      if (!_currentValue) return;
      let _index = -1;
      for (let i = 0; i < this.letter.length; i++) {
        if (this.letter[i]['idValue'] != _currentValue) continue;
        _index = i;
        break;
      }
      if (_index === -1) {
        this.formSav.controls['letterType'].reset();
        return;
      }
      setTimeout(() => {
        this.dontNeedReRenderAfterSelectLetterType = true;
        this.letterTypeCtr.selectedIndex = _index;
        // this.letterTypeCtr.selectedValue = _currentValue;
        // this.letterTypeCtr.selectedItem = this.letter[_index];
        // this.letterTypeCtr.text = this.letter[_index]['textValue'];
        if (func) {
          func();
        }
      }, 300);
    }, 50);
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/

  private outputEditingAction() {
    if (!this.allowEdit) return;
    this.outputDataAction.emit();
  }

  private resetGridData() {
    this.dataTable.columns.length = 0;
    this.dataTable.data.length = 0;
  }

  private registerEnterForTemplateName() {
    setTimeout(() => {
      Uti.registerKeyPressForControl(
        $('#txt-template-name-for-upload-file', this._elementRef.nativeElement),
        () => {
          this.saveTemplateName(this.templateNameSavingMode);
        },
        13
      );
    });
  }

  private resetCountryCheckListData() {
    const temp = cloneDeep(this.countryCheckListData);
    for (const item of temp) {
      item.isActive = false;
    }
    this.countryCheckListData.length = 0;
    this.countryCheckListData = temp;
  }

  private getAllMandants() {
    const comboBoxTypes = [ComboBoxTypeConstant.allMandant];
    this._commonService
      .getListComboBox(comboBoxTypes.join(''))
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response) || !response.item.allMandant) {
            this.mandants = [];
            this.detectChanges();
            return;
          }
          this.mandants.length = 0;
          this.mandants = response.item.allMandant || [];
        });
      });
  }

  private getAssignmentWidgetByLetterTypeId(idBackOfficeLetter?: string) {
    this._blockedOrderService
      .getAssignWidgetByLetterTypeId(idBackOfficeLetter)
      .take(1)
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          try {
            this.clearFormArray('assignmentWidget');
            this.assignmentWidget = response.item.data[0];
            for (const value of this.assignmentWidget) {
              const controlItem = (<FormArray>(
                this.formSav.controls['assignmentWidget']
              )) as FormArray;
              controlItem.push(this.buildAssignWidget(value));
            }
          } catch (e) {}
        });
      });
  }

  private getAllTypeOfAutoLetter() {
    this._blockedOrderService
      .getAllTypeOfAutoLetter()
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          try {
            this.clearFormArray('typeOfAutoLetter');
            this.typeOfAutoLetter = response.item.data[0];
            for (const value of this.typeOfAutoLetter) {
              const controlItem = (<FormArray>(
                this.formSav.controls['typeOfAutoLetter']
              )) as FormArray;
              controlItem.push(this.buildTypeOfAutoLetter(value));
            }
          } catch (e) {}
        });
      });
  }

  // private buildDataForTypeOfAutoLetter() {
  //     this.clearFormArray('typeOfAutoLetter');
  //     const types = ['Credit card', 'Check', 'Cash'];
  //     for (let item of types) {
  //         const controlItem = (<FormArray>this.formSav.controls['typeOfAutoLetter']) as FormArray;
  //         controlItem.push(this.buildTypeOfAutoLetter({
  //             typeName: item,
  //             selected: false,
  //             isActive: false
  //         }));
  //     }
  // }

  private getLetterType(mandants: string) {
    this._blockedOrderService
      .getLetterTypeByMandant(mandants)
      .take(1)
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          let data: any = [];
          try {
            data = response.item.data[0];
          } catch (e) {}
          const _temp = (data || []).map((x) => {
            return {
              textValue: x.LetterName,
              idValue: x.IdBackOfficeLetters,
              IsAutoGeneratedLetter: x.IsAutoGeneratedLetter,
              IdRepTypeOfAutoLetter: x.IdRepTypeOfAutoLetter,
            };
          });
          this.cachedLetter = cloneDeep(_temp);
          this.refreshLetterType();
        });
      });
  }

  private getSaveCountriesCountries(newCountries: any[], oldCountries: any[]) {
    if (!newCountries || !newCountries.length) return [];
    const newCountriesActive = newCountries.filter(
      (x) => x.IsActive || x.isActive
    );
    const oldCountriesActive = oldCountries
      .filter((x) => x.IsActive || x.isActive)
      .map((x) => {
        return {
          idBackOfficeLettersCountries: x.IdBackOfficeLettersCountries,
          idValue: x.IdCountrylanguage,
          isActive: x.IsActive,
        };
      });

    const newItems = Uti.getItemsDontExistItems(
      newCountriesActive,
      oldCountriesActive,
      'idValue'
    ).map((x) => {
      return {
        IdBackOfficeLettersCountries: null,
        IdCountrylanguage: x.idValue,
        IsSelected: 1,
      };
    });
    const deleteItems = Uti.getItemsDontExistItems(
      oldCountriesActive,
      newCountriesActive,
      'idValue'
    ).map((x) => {
      return {
        IdBackOfficeLettersCountries: x.idBackOfficeLettersCountries,
        IdCountrylanguage: null,
        IsSelected: 0,
      };
    });
    return [...newItems, ...deleteItems];
  }

  private mergeGroupReason(cloneArrayObj: any) {
    const groupReasons = cloneDeep(this.formSav.value.groupReason);
    let deleteGroupItems: Array<any> = [];
    let isFound = false;
    for (let cloneItem of cloneArrayObj) {
      isFound = false;
      for (let groupItem of groupReasons) {
        if (cloneItem.PlaceHolderName === groupItem.PlaceHolderName) {
          groupItem.JSONGroupItems = [
            ...cloneItem.JSONGroupItems,
            ...groupItem.JSONGroupItems,
          ];
          isFound = true;
        }
      }
      if (isFound) continue;
      deleteGroupItems.push(cloneItem);
    }
    return [...groupReasons, ...deleteGroupItems];
  }

  private buildSavLetterTemplate() {
    const mandant = this.mandant.checkedItems.map((x) => {
      return {
        IdPerson: x.idValue,
        IsSelected: 1,
      };
    });
    const result: any = {
      BackOfficeTemplate: {
        LetterName: (this.templateName || this.letterTypeCtr.text).replace(
          '[Auto Letter] ',
          ''
        ),
        IsActive: 1,
        IdBackOfficeLetters: this.letterTypeCtr.selectedValue,
        IsDeleted: 0,
      },
      Mandant: mandant,
      Countries: this.getSaveCountriesCountries(
        this._countriesOutput,
        this.countryCheckListData
      ),
      Groups:
        this.cloneGroupReason && this.cloneGroupReason.length > 0
          ? this.mergeGroupReason(this.cloneGroupReason)
          : this.formSav.value.groupReason,
      DocTemplate: this.getDocTemplateData(),
    };
    if (!this.isNewAutoTemplate) {
      const assignmentWidget = this.formSav.value.assignmentWidget.map((v) => {
        return {
          IdBackOfficeLettersAssignWidgetRep: v.idBackOffice,
          IdBackOfficeLettersAssignWidget: v.IdBackOfficeLettersAssignWidget,
          IsSelected: v.isActive ? 1 : 0,
        };
      });
      result['AssignWidget'] = assignmentWidget;
    } else {
      let item = this.typeOfAutoLetter.find(
        (x) =>
          x.IdRepTypeOfAutoLetter ==
          this.formSav.value['typeOfAutoLetterActive']
      );
      if (item && item.IdRepTypeOfAutoLetter) {
        result.BackOfficeTemplate['IdRepTypeOfAutoLetter'] =
          item.IdRepTypeOfAutoLetter;
        result.BackOfficeTemplate['IsAutoGeneratedLetter'] = '1';
      }
    }
    return result;
  }

  private getDocTemplateData(): Array<any> {
    if (!this.dataTable.data.length) {
      return [];
    }
    let data = cloneDeep(this.dataTable.data[0]);
    delete data['IdSharingTreeMedia']; // Update SP need remove this id to right process
    return [
      {
        // 'IdBackOfficeLettersDocTemplate': data['IdBackOfficeLettersDocTemplate'], // Don't need this id, always delete old item and add new item
        MediaName: data['MediaName'],
        MediaRelativePath: data['MediaRelativePath'],
        IsActive: '1',
        JSONTreeMedia: { TreeMedia: [data] },
      },
    ];
  }

  private getCountries(idBackOfficeLetter?: any) {
    this.isLoading = true;
    this._blockedOrderService
      .getCountriesLanguageByLetterTypeId(idBackOfficeLetter)
      .take(1)
      .subscribe((response) => {
        this._appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response) || !response.item.data) {
            this.countryCheckListData.length = 0;
            return;
          }
          this.countryCheckListData = cloneDeep(response.item.data[1]);
          this.isLoading = false;
          this.detectChanges();
          this.setAssignmentWidgetHeight(1500);
        });
      });
  }

  private createFileTemplateMenu() {
    this.templateFileMenus = [
      {
        Visible: false,
        TabName: 'New Auto Template',
        Icon: 'plus',
        ClassName: '',
      },
      {
        Visible: false,
        TabName: 'New Template',
        Icon: 'plus',
        ClassName: '',
      },
      {
        Visible: false,
        TabName: 'Rename Template',
        Icon: 'pencile',
        ClassName: '',
      },
      {
        Visible: false,
        TabName: 'Delete Template',
        Icon: 'trash',
        ClassName: '',
      },
    ];
  }

  private newTemplate() {
    this.templateTile = 'New Template';
    this.showDialogTemplateName = true;
    this.templateName = '';
    this.templateNameSavingMode = 'New';
    this.focusOnTemplateName();
  }

  private renameTemplate() {
    this.templateTile = 'Edit Template';
    this.showDialogTemplateName = true;
    this.templateNameSavingMode = 'Edit';
    if (this.letterTypeCtr) {
      this.templateName = this.letterTypeCtr.text.replace('[Auto Letter] ', '');
    } else {
      this.templateName = '';
    }
    this.focusOnTemplateName();
  }

  private focusOnTemplateName() {
    setTimeout(() => {
      $(
        '#txt-template-name-for-upload-file',
        this._elementRef.nativeElement
      ).focus();
    });
  }

  private deleteTemplate() {
    this._modalService.confirmMessageHtmlContent(
      new MessageModel({
        headerText: 'Delete Template',
        messageType: MessageModal.MessageType.error,
        message: [
          { key: '<p>' },
          { key: 'Modal_Message__Do_You_Want_To_Delete_Template' },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.danger,
        callBack1: () => {
          this.saveTemplateName('Delete');
        },
      })
    );
  }

  private handleWhenSavingTemplateNameSuccess(response: any, mode: string) {
    switch (mode) {
      case 'New':
        this.makeTemplateDataWhenAddNew(response);
        break;
      case 'Edit':
        this.makeTemplateDataWhenAddEdit();
        break;
      case 'Delete':
        this.makeTemplateDataWhenAddDelete();
    }
  }

  private makeTemplateDataWhenAddNew(savedResponse: any) {
    const temp = cloneDeep(this.cachedLetter);
    if (!savedResponse || !savedResponse.item || !savedResponse.item.returnID) {
      return;
    }
    temp.push({
      idValue: savedResponse.item.returnID + '',
      textValue:
        (this.isNewAutoTemplate ? '[Auto Letter] ' : '') + this.templateName,
      IsAutoGeneratedLetter: this.isNewAutoTemplate,
      IdRepTypeOfAutoLetter:
        this.formSav.controls['typeOfAutoLetterActive'].value,
    });
    this.formSav.controls['typeOfAutoLetterActive'].setValue(null);
    this.letter.length = 0;
    this.letter = temp;
    this.cachedLetter = cloneDeep(temp);
    this.refreshLetterType(() => {
      setTimeout(() => {
        this.letterTypeCtr.selectedIndex = this.letter.length - 1;
      });
    });
    this._preventTemplateChange = true;
  }

  private makeTemplateDataWhenAddEdit() {
    const temp = cloneDeep(this.cachedLetter);
    const currentItem = temp.find(
      (x) => x.idValue == this.letterTypeCtr.selectedValue
    );
    if (!currentItem || !currentItem.idValue) return;
    currentItem.textValue =
      (this.isNewAutoTemplate ? '[Auto Letter] ' : '') + this.templateName;
    const currentIndex = Uti.getIndexOfItemInArray(
      temp,
      this.letterTypeCtr.selectedItem,
      'idValue'
    );
    this.letter.length = 0;
    this.cachedLetter = cloneDeep(temp);
    this.refreshLetterType(() => {
      setTimeout(() => {
        this.letterTypeCtr.selectedIndex = this.letter.length - 1;
      });
    });
    this._preventTemplateChange = true;
  }

  private makeTemplateDataWhenAddDelete() {
    const temp = cloneDeep(this.cachedLetter);
    Uti.removeItemInArray(temp, this.letterTypeCtr.selectedItem, 'idValue');
    this.letter.length = 0;
    this.letter = temp;
    this.cachedLetter = cloneDeep(temp);
    this.refreshLetterType();
  }

  private buildSavingDataForLetterType(mode: string) {
    let result: any = {};
    const mandant = this.mandant.checkedItems.map((x) => {
      return {
        IdPerson: x.idValue,
        IsSelected: 1,
      };
    });
    switch (mode) {
      case 'New':
        result = {
          BackOfficeTemplate: {
            LetterName: this.templateName.replace('[Auto Letter] ', ''),
            IsActive: 1,
            IdBackOfficeLetters: null,
            IsDeleted: 0,
          },
          Mandant: mandant,
        };
        break;
      case 'Edit':
        result = {
          BackOfficeTemplate: {
            LetterName: this.templateName.replace('[Auto Letter] ', ''),
            IsActive: 1,
            IdBackOfficeLetters: this.letterTypeCtr.selectedValue,
            IsDeleted: 0,
            IdRepTypeOfAutoLetter:
              this.formSav.controls['typeOfAutoLetterActive'].value,
          },
        };
        break;
      case 'Delete':
        result = {
          BackOfficeTemplate: {
            IdBackOfficeLetters: this.letterTypeCtr.selectedValue,
            IsDeleted: 1,
          },
          Mandant: mandant,
        };
        break;
    }
    if (this.isNewAutoTemplate) {
      result.BackOfficeTemplate['IsAutoGeneratedLetter'] = '1';
    }
    return result;
  }

  private closeTemplateNamePopup() {
    this.templateName = '';
    this.templateNameSavingMode = '';
    this._isDirtyTemplateName =
      this.submitTemplateName =
      this.showDialogTemplateName =
        false;
  }

  private detectChanges() {
    setTimeout(() => {
      this._changeDetectorRef.detectChanges();
    });
  }

  private toggleSaveButtonMode(isToggle: boolean, isEnable?: boolean) {
    if (
      this.parentInstance.widgetMenuStatusComponent &&
      this.parentInstance.widgetMenuStatusComponent.settings
    ) {
      this.parentInstance.controlMenuStatusToolButtons(isToggle);
      this.parentInstance.widgetMenuStatusComponent.settings.btnSaveSAVTemplateForm.enable =
        isEnable;
    }
  }

  private submitDataForPreview() {
    this.initComponentAction.emit();
    setTimeout(() => {
      this.startGeneratePdfHandle({
        Values: { EmptyProp: '' },
        IdBackOfficeLetters: this.letterTypeCtr.selectedValue,
        ListOfIdCountryLanguage: '',
      });
    }, 1000);
  }
}
