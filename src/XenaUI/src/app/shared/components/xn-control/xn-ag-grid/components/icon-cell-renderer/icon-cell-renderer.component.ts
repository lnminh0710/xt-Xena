import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BaseAgGridCellComponent } from '../../shared/base-ag-grid-cell-component';
import { Uti } from 'app/utilities/uti';
import { isString } from 'util';

@Component({
  selector: 'icon-cell-renderer',
  templateUrl: './icon-cell-renderer.html',
  styleUrls: ['./icon-cell-renderer.scss'],
})
export class IconCellRenderer
  extends BaseAgGridCellComponent<string>
  implements ICellRendererAngularComp
{
  public icon: any = {
    icon: '',
    color: '',
    tooltip: '',
  };
  public iconData: any;
  private foundInIconSettings: any;

  constructor() {
    super();
  }

  refresh(params: any): boolean {
    return false;
  }

  protected getCustomParam(params: any) {
    if (this.value) {
      if (typeof this.value === 'object') {
        this.buildColumnFoundIn(params);
        return;
      }
      const data = Uti.parseJsonString(this.value);
      if (data) {
        this.icon = data;
      } else if (isString(this.value) && this.value.indexOf('fa-') !== -1) {
        this.icon.icon = this.value;
      } else {
        this.icon.icon = 'fa-' + this.value;
      }
    }
  }

  private buildColumnFoundIn(params: any) {
    this.iconData = {
      FoundIn: params.data.FoundIn,
      IdPerson: params.data.IdPerson,
      //Set default for Contact
      IconContact: {
        color: '#387BB9',
        tooltip: 'Contact',
        icon: 'fa-map-marker',
      },
    };
    //Build settings for Contact, Order, MediaCode,...
    this.buildColumnFoundInSetting(params);
    if (!this.foundInIconSettings) return;

    //Contact
    if (this.iconData.FoundIn.hasContact) {
      const iconSettingContact = this.foundInIconSettings['contact'];
      if (iconSettingContact) {
        this.iconData.IconContact = {
          icon: iconSettingContact.icon,
          color: iconSettingContact.color,
          tooltip: iconSettingContact.tooltip,
        };
      }
    }
    //Order
    //MediaCode
  }

  private buildColumnFoundInSetting(params: any) {
    if (this.foundInIconSettings) return this.foundInIconSettings;

    if (
      params &&
      params.colDef &&
      params.colDef.refData &&
      params.colDef.refData.setting &&
      params.colDef.refData.setting.Setting &&
      params.colDef.refData.setting.Setting.length
    ) {
      for (
        let i = 0, length = params.colDef.refData.setting.Setting.length;
        i < length;
        i++
      ) {
        const item = params.colDef.refData.setting.Setting[i];
        if (
          item.ControlType &&
          item.ControlType.Icons &&
          item.ControlType.Icons.length
        ) {
          for (
            let i1 = 0, length1 = item.ControlType.Icons.length;
            i1 < length1;
            i1++
          ) {
            const item1 = item.ControlType.Icons[i1];

            this.foundInIconSettings = this.foundInIconSettings || {};
            this.foundInIconSettings[item1.mode] = {
              icon: item1.icon,
              color: item1.color,
              tooltip: item1.tooltip,
            };
          } //for Icons
        }
      } //for ControlType
    }
  }

  public onClickIcon(type: string) {
    if (!this.componentParent || !this.iconData) return;

    this.componentParent.onDataAction.emit({
      type: type,
      data: this.iconData,
    });
  }
}
