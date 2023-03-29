import { Component, ViewChild } from '@angular/core';
import {
  ICellRendererAngularComp,
  ICellEditorAngularComp,
} from 'ag-grid-angular';
import {
  DatatableService,
  CommonService,
  AppErrorHandler,
  PropertyPanelService,
} from 'app/services';
import { ApiResultResponse } from 'app/models';
import { Uti } from 'app/utilities/uti';
import { BaseAgGridCellComponent } from '../../shared/base-ag-grid-cell-component';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
  selector: 'dropdown-cell-renderer',
  templateUrl: './dropdown-cell-renderer.html',
  styleUrls: ['./dropdown-cell-renderer.scss'],
})
export class DropdownCellRenderer
  extends BaseAgGridCellComponent<any>
  implements ICellRendererAngularComp, ICellEditorAngularComp
{
  public options: Array<any> = [];
  public key: string;
  public displayValue: string;
  public isShowDropdownWhenFocusCombobox: boolean = false;

  private cellCombo: AngularMultiSelect;

  @ViewChild('cellCombo') set content(content: AngularMultiSelect) {
    this.cellCombo = content;
  }

  constructor(
    private datatableService: DatatableService,
    private propertyPanelService: PropertyPanelService,
    private commonService: CommonService,
    private appErrorHandler: AppErrorHandler
  ) {
    super();
  }

  /**
   * getCustomParam
   * @param params
   */
  protected getCustomParam(params: any) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.cellStartedEdit = this.params.cellStartedEdit;

    // Edit mode
    if (this.cellStartedEdit) {
      this.buildComboboxData();
      const field = this.params.column.colDef.field;
      if (this.componentParent && field) {
        const propertiesWidget = this.componentParent.widgetProperties;
        const propertyDropdownForm =
          this.propertyPanelService.getValueDropdownFromProperties(
            propertiesWidget
          );
        if (propertyDropdownForm) {
          for (let item of propertyDropdownForm) {
            if (field !== item.value) continue;
            this.isShowDropdownWhenFocusCombobox = item.selected;
          }
        }
      }
    }
    if (this.value) {
      this.key = this.value.key;
      this.displayValue = this.value.value;
    }

    setTimeout(() => {
      if (this.cellCombo && this.cellCombo.hostElement) {
        this.cellCombo.hostElement.addEventListener(
          'keydown',
          this.onKeydown.bind(this)
        );
      }
    });
  }

  refresh(params: any): boolean {
    return false;
  }

  /**
   * buildComboboxData
   **/
  public buildComboboxData() {
    const settingCol = this.params.column.colDef.refData;

    if (this.datatableService.hasControlType(settingCol, 'Combobox')) {
      const comboboxType = this.datatableService.getComboboxType(settingCol);
      let filterByValue =
        this.datatableService.getControlTypeFilterBy(settingCol);

      if (filterByValue) {
        const selectedRowData: any = this.params.node.data;
        let filterByFrom: string;
        if (selectedRowData[filterByValue]) {
          filterByFrom =
            typeof selectedRowData[filterByValue] === 'object'
              ? selectedRowData[filterByValue]['key']
              : selectedRowData[filterByValue];
        } else {
          let ofModule = this.params.context.componentParent.currentModule;
          filterByFrom =
            this.params.context.componentParent.parentInstance.data.widgetDataType.listenKeyRequest(
              ofModule.moduleNameTrim
            )[filterByValue];
        }

        this.commonService
          .getComboBoxDataByFilter(comboboxType.value.toString(), filterByFrom)
          .subscribe((response: ApiResultResponse) => {
            this.appErrorHandler.executeAction(() => {
              this.onGetComboboxDataSuccess(
                response.item,
                comboboxType,
                filterByFrom
              );
            });
          });
      } else {
        this.commonService
          .getListComboBox(comboboxType.value.toString())
          .subscribe((response: ApiResultResponse) => {
            this.appErrorHandler.executeAction(() => {
              if (!Uti.isResquestSuccess(response)) {
                return;
              }
              this.onGetComboboxDataSuccess(response.item, comboboxType);
            });
          });
      }
    }
  }

  /**
   * onGetComboboxDataSuccess
   * @param comboboxData
   * @param comboboxType
   * @param column
   * @param filterByValue
   */
  private onGetComboboxDataSuccess(comboboxData, comboboxType, filterByValue?) {
    let comboboxTypeName = comboboxType.name;
    if (filterByValue) {
      comboboxTypeName += '_' + filterByValue;
    }
    let options: any[] = comboboxData[comboboxTypeName];

    if (!options) {
      this.key = '';
      this.displayValue = '';
      this.options = [];
    } else {
      options = options.map((opt) => {
        return {
          label: opt.textValue,
          value: opt.idValue,
        };
      });
      this.options = options;

      setTimeout(() => {
        if (this.cellCombo) {
          this.cellCombo.itemsSource = options;
          if (this.cellCombo.itemsSource.length === 1) {
            this.cellCombo.selectedIndex = 0;
          }
          // else {
          //     this.cellCombo.isDroppedDown = true;
          // }
        }
      }, 200);
    }
  }

  private onKeydown(evt) {
    if (evt.key !== 'Enter' && evt.key !== 'Tab') {
      evt.stopPropagation();
    }
  }

  /**
   * getValue
   * */
  getValue(): any {
    return {
      key: this.key,
      value: this.displayValue,
      options: [],
    };
  }
}
