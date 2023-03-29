import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { MessageModel } from 'app/models';
import {
  ModalService,
  AppErrorHandler,
  PropertyPanelService,
  BlockedOrderService,
} from 'app/services';
import { MessageModal, SAVIdConnectionName } from 'app/app.constants';
import { Uti } from 'app/utilities/uti';
import orderBy from 'lodash-es/orderBy';
import { ApiResultResponse } from 'app/models';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
  selector: 'send-letter-form',
  styleUrls: ['./send-letter-form.component.scss'],
  templateUrl: './send-letter-form.component.html',
})
export class SendLetterFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  // private _fake = new Fake();
  private isDirty = false;
  private isReasonDirty = false;
  private currentLetterTypeIndex = -1;
  private dataPreview: any;

  public showDialog = false;
  public globalDateFormat: string = '';
  public letterTypes: Array<any> = [];
  public mandants: Array<any> = [];
  public mandant: Array<any> = [];
  public letterType: Array<any> = [];
  public groupItems: Array<any> = [];
  public notes: string = '';
  public isRenderForm = false;
  public displayControl = {
    Mandant: true,
  };

  @Input() isPreview: boolean = false;
  @Input() isSAVWidget: boolean = false;
  @Input() showDialogData: any = {};
  @Input() showPreviewDialogData: Array<any> = [];

  @Input() set globalProperties(globalProperties: any[]) {
    this.globalDateFormat =
      this._propertyPanelService.buildGlobalInputDateFormatFromProperties(
        globalProperties
      );
  }

  @Output() isDirtyAction: EventEmitter<any> = new EventEmitter();
  @Output() closedAction: EventEmitter<any> = new EventEmitter();

  // @ViewChild('mandanCtr') mandanCtr: WjMultiSelect;
  @ViewChild('mandanCtr') mandanCtr: AngularMultiSelect;
  @ViewChild('letterTypeCtr') letterTypeCtr: AngularMultiSelect;

  constructor(
    private _modalService: ModalService,
    private _appErrorHandler: AppErrorHandler,
    private _propertyPanelService: PropertyPanelService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _blockedOrderService: BlockedOrderService,
    router?: Router
  ) {
    super(router);
  }

  public ngOnInit() {}

  public ngOnDestroy() {}

  public loadDataForForm() {
    if (this.isSAVWidget) {
      this.loadDataForSAVWidget();
      return;
    }
    this.getListOfMandantsByIdSalesOrder(
      this.showDialogData.selectedItems[0]['IdSalesOrder']
    );
  }

  public loadDataForPreview(data: any) {
    this.dataPreview = data;
    this.buildDataForReasonGroupFromPreviewData(data.reason);
    this.isRenderForm = true;
  }

  public onMandantChanged() {
    // if (this.hasIdPerson) return;
    // let mandants = this.mandanCtr.checkedItems.map(x => x.idValue).join(',');
    this.letterTypes = [];
    this.letterTypeCtr.text = '';
    this.groupItems = [];
    if (!this.mandanCtr.selectedValue) {
      return;
    }
    this.getLetterType(this.mandanCtr.selectedValue);
  }

  public onLetterTypeChanged() {
    if (this.currentLetterTypeIndex === this.letterTypeCtr.selectedIndex)
      return;
    if (this.isReasonDirty) {
      this._modalService.confirmMessageHtmlContent(
        new MessageModel({
          messageType: MessageModal.MessageType.error,
          headerText: 'Change Letter Type',
          message: [
            { key: '<p>' },
            { key: 'Modal_Message__There_Are_Reason_Selected' },
            { key: '</p>' },
            { key: '<p>' },
            {
              key: 'Modal_Message__Do_You_Want_To_Change_Letter_Type',
            },
            { key: '</p>' },
          ],
          buttonType1: MessageModal.ButtonType.danger,
          callBack1: () => {
            this.getGroupAndItemsByLetterType();
          },
          callBack2: () => {
            this.letterTypeCtr.selectedIndex = this.currentLetterTypeIndex;
          },
        })
      );
      return;
    }
    this.getGroupAndItemsByLetterType();
  }

  public getSaveData(previewIdBackOfficeLetters?: any) {
    let result = {
      ReasonData: [],
    };
    if (!previewIdBackOfficeLetters) {
      result['BackOfficeLetter'] = {
        IdSalesOrderLetters: null,
        IdBackOfficeLetters: this.letterTypeCtr.selectedValue,
        IdGenerateLetter: null,
        // 'IdSalesOrder': this.showDialogData.selectedItems[0]['IdSalesOrder'],
        // 'IdSalesOrder': this.getIdConnection(),
        IsActive: '1',
        Notes: this.notes,
      };
    } else {
      result['BackOfficeLetter'] = {
        IdBackOfficeLetters: previewIdBackOfficeLetters,
      };
    }
    for (let item of this.groupItems) {
      for (let control of item.Children) {
        let _data = {
          IdBackOfficeLetters:
            this.letterTypeCtr && this.letterTypeCtr.selectedValue
              ? this.letterTypeCtr.selectedValue
              : previewIdBackOfficeLetters,
          IdBackOfficeLettersGroups: item.IdBackOfficeLettersGroups,
          IdBackOfficeLettersGroupsItems:
            control.IdBackOfficeLettersGroupsItems > 0
              ? control.IdBackOfficeLettersGroupsItems
              : null,
        };
        if (
          (control.TypeOfChoice == 0 || control.TypeOfChoice == 1) &&
          control.Checked
        ) {
          result.ReasonData.push(_data);
          continue;
        }
        if (control.TypeOfChoice == 2) {
          _data['FreeTextLine'] = control.GroupItemName;
          result.ReasonData.push(_data);
        }
      }
    }
    return this.addIdConnection(result);
  }

  public getPreviewData() {
    let _groupValue = {};
    let _itemValue = '';
    for (let group of this.groupItems) {
      _itemValue = '';
      for (let i = 0; i < group.Children.length; i++) {
        if (
          (group.Children[i].TypeOfChoice == 0 ||
            group.Children[i].TypeOfChoice == 1) &&
          !group.Children[i].Checked
        ) {
          continue;
        }
        _itemValue +=
          group.Children[i].GroupItemName +
          (i === group.Children.length - 1 ? '' : '\n');
      }
      if (!_itemValue) {
        continue;
      }
      if (_itemValue.length > 2) {
        _itemValue = JSON.stringify(_itemValue);
        _itemValue = _itemValue.substring(1, _itemValue.length - 1);
      }
      _groupValue[group.PlaceHolderName] = _itemValue;
    }
    return {
      Values: _groupValue,
      IdBackOfficeLetters: this.dataPreview.main.IdBackOfficeLetters,
      ListOfIdCountryLanguage: this.dataPreview.main.ListOfIdCountryLanguage,
    };
  }

  public clickRadio(item, groupItem) {
    for (let _item of groupItem.Children) {
      if (_item['TypeOfChoice'] != 0) {
        continue;
      } else {
        _item['Checked'] =
          _item['IdBackOfficeLettersGroupsItems'] ===
          item['IdBackOfficeLettersGroupsItems'];
      }
    }
    this.isReasonDirty = true;
    this.setDirty();
  }

  public clickCheckbox(item) {
    item['Checked'] = !item['Checked'];
    this.changeCheckbox();
  }

  public changeCheckbox() {
    this.isReasonDirty = true;
    this.setDirty();
  }

  public textboxChanged() {
    this.setDirty();
  }

  public notesChanged() {
    this.setDirty();
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/

  private loadDataForSAVWidget() {
    if (
      !this.showDialogData ||
      !this.showDialogData.data ||
      !this.showDialogData.data.key
    )
      return;
    switch (this.showDialogData.data.key) {
      case SAVIdConnectionName.IdSalesOrder: {
        this.getListOfMandantsByIdSalesOrder(this.showDialogData.data.value);
        break;
      }
      case SAVIdConnectionName.IdPerson: {
        this.getListOfMandantsByIdPerson(this.showDialogData.data.value);
        break;
      }
    }
    this.isRenderForm = true;
  }

  // private getIdConnection(): any {
  //     try {
  //         if (this.isSAVWidget) {
  //             return this.showDialogData.data.value;
  //         }
  //         return this.showDialogData.selectedItems[0]['IdSalesOrder'];
  //     } catch(e) {
  //         return '';
  //     }
  // }

  private addIdConnection(data: any): any {
    if (this.isSAVWidget) {
      data.BackOfficeLetter[this.showDialogData.data.key] =
        this.showDialogData.data.value;
      return data;
    }
    data.BackOfficeLetter['IdSalesOrder'] =
      this.showDialogData.selectedItems[0]['IdSalesOrder'];
    return data;
  }

  private getListOfMandantsByIdSalesOrder(idSalesOrder: any) {
    this._blockedOrderService
      .getListOfMandantsByIdSalesOrder(idSalesOrder)
      .subscribe((response: ApiResultResponse) => {
        this.getMandantDataSuccess(response);
      });
  }

  private getListOfMandantsByIdPerson(idPerson: any) {
    this._blockedOrderService
      .getListOfMandantsByIdPerson(idPerson)
      .subscribe((response: ApiResultResponse) => {
        this.getMandantDataSuccess(response);
      });
  }

  private getMandantDataSuccess(response: ApiResultResponse) {
    this._appErrorHandler.executeAction(() => {
      this.mandants = [];
      if (!Uti.isResquestSuccess(response)) return;
      try {
        this.mandants = response.item.data[0].map((x) => {
          return {
            textValue: x.Company,
            idValue: x.IdSharingCompany,
          };
        });
      } catch (e) {}
      this.isRenderForm = true;
      // auto checked when mandant has only 1 item
      // if (this.mandants && this.mandants.length == 1) {
      //     Uti.executeFunctionWithTimeout(() => {this.mandanCtr.checkedItems = this.mandants}, () => {return !!this.mandanCtr})
      // }
      this._changeDetectorRef.detectChanges();
    });
  }

  // private getMandantData() {
  //     const comboBoxTypes = [
  //         ComboBoxTypeConstant.allMandant
  //     ];
  //     this._commonService.getListComboBox(comboBoxTypes.join())
  //         .subscribe((response: ApiResultResponse) => {
  //             this._appErrorHandler.executeAction(() => {
  //                 this.mandants = [];
  //                 if (Uti.isResquestSuccess(response)) {
  //                     this.mandants = response.item.allMandant || [];
  //                 }
  //                 this.isRenderForm = true;
  //             });
  //         });
  // }

  private getLetterType(mandants: string) {
    this._blockedOrderService
      .getLetterTypeByMandant(mandants)
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          let data: any = [];
          try {
            data = response.item.data[0];
          } catch (e) {}
          this.letterTypes = (data || []).map((x) => {
            return {
              textValue: x.LetterName,
              idValue: x.IdBackOfficeLetters,
            };
          });
        });
      });
  }

  // private getLetterType() {
  //     this._blockedOrderService.getLetterTypeByWidgetAppId(this.showDialogData.widgetData.idRepWidgetApp)
  //     .subscribe((response: ApiResultResponse) => {
  //         this._appErrorHandler.executeAction(() => {
  //             if (!Uti.isResquestSuccess(response)) return;
  //             let data: any = response.item.data;
  //             data = Uti.tryParseJson(data[0][0].LetterTypeByIdMandants);
  //             if (!data) {
  //                 this.letterTypes = [];
  //                 return;
  //             }
  //             this.letterTypes = data.LetterTypeByIdMandants || [];
  //         });
  //     });
  // }

  private getGroupAndItemsByLetterType() {
    this.isReasonDirty = false;
    this.isDirtyAction.emit(this.isDirty);
    this.currentLetterTypeIndex = this.letterTypeCtr.selectedIndex;
    this.groupItems = [];
    this._blockedOrderService
      .getGroupAndItemsByLetterType(this.letterTypeCtr.selectedValue)
      .subscribe((response: ApiResultResponse) => {
        this._appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
          let data: any = [];
          try {
            data = response.item.data[0];
          } catch (e) {}
          this.buildDataForReasonGroup(data);
          this._changeDetectorRef.detectChanges();
        });
      });
  }

  private buildDataForReasonGroupFromPreviewData(rawData: Array<any>) {
    this.groupItems = [];
    if (!rawData || !rawData.length) {
      return;
    }
    this.groupItems = rawData.map((x) => {
      return {
        GroupName: x.GroupName,
        PlaceHolderName: x.PlaceHolderName,
        Children: x.JSONGroupItems.map((y) => {
          return {
            Checked: false,
            TypeOfChoice: y.TypeOfChoice,
            GroupItemName: y.GroupItemName,
            IdBackOfficeLettersGroupsItems:
              y.IdBackOfficeLettersGroupsItems || Uti.getTempId(),
          };
        }),
      };
    });
  }

  private buildDataForReasonGroup(rawData: Array<any>) {
    rawData = orderBy(rawData, ['GroupOrderBy', 'ItemOrderBy'], 'asc');
    if (!rawData || !rawData.length) {
      this.groupItems = [];
      return;
    }
    let _group: any = {};
    for (let raw of rawData) {
      _group = this.groupItems.find(
        (x) => x['IdBackOfficeLettersGroups'] == raw.IdBackOfficeLettersGroups
      );
      if (!_group || !_group['IdBackOfficeLettersGroups']) {
        _group = {
          GroupName: raw.GroupName,
          PlaceHolderName: raw.PlaceHolderName,
          IdBackOfficeLettersGroups: raw.IdBackOfficeLettersGroups,
          Children: [this.mapRawItem(raw)],
        };
        this.groupItems.push(_group);
        continue;
      }
      _group.Children.push(this.mapRawItem(raw));
    }
  }

  private mapRawItem(raw): any {
    return {
      Checked: false,
      TypeOfChoice: raw.TypeOfChoice,
      GroupItemName: raw.GroupItemName,
      IdBackOfficeLettersGroupsItems: raw.IdBackOfficeLettersGroupsItems,
    };
  }

  private setDirty() {
    this.isDirty = true;
    this.isDirtyAction.emit(this.isDirty);
  }
}

// class Fake {
//     public createGroupItems(): Array<any> {
//         return [
//             {
//                 groupTitle: 'Group 1',
//                 value: 1,
//                 radioValue: null,
//                 radioItems: [
//                     {
//                         value: 1,
//                         text: 'Radio 1'
//                     },
//                     {
//                         value: 2,
//                         text: 'Radio 2'
//                     }
//                 ],
//                 checkBoxItems: [
//                     {
//                         value: 1,
//                         text: 'Checkbox 1'
//                     },
//                     {
//                         value: 2,
//                         text: 'Checkbox 2'
//                     }
//                 ]

//             },
//             {
//                 groupTitle: 'Group 2',
//                 value: 2,
//                 radioValue: null,
//                 radioItems: [
//                     {
//                         value: 21,
//                         text: 'Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 Radio 21 '
//                     },
//                     {
//                         value: 22,
//                         text: 'Radio 22'
//                     },
//                     {
//                         value: 23,
//                         text: 'Radio 23'
//                     }
//                 ],
//                 checkBoxItems: [
//                     {
//                         value: 21,
//                         text: 'Checkbox 21'
//                     },
//                     {
//                         value: 22,
//                         text: 'Checkbox 22'
//                     }
//                 ]
//             },
//             {
//                 groupTitle: 'Group 3',
//                 radioValue: null,
//                 value: 3,
//                 radioItems: [],
//                 checkBoxItems: [
//                     {
//                         value: 31,
//                         text: 'Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 Checkbox 31 '
//                     },
//                     {
//                         value: 32,
//                         text: 'Checkbox 32'
//                     }
//                 ]
//             }
//         ]
//     }

//     public createLetterType(): Array<any> {
//         return [
//             {textValue: 'Letter 0', idValue: 0},
//             {textValue: 'Letter 1', idValue: 1},
//             {textValue: 'Letter 2', idValue: 2},
//             {textValue: 'Letter 3', idValue: 3},
//         ]
//     }
// }
