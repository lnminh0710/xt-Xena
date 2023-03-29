import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { BaseAgGridCellComponent } from '../../../shared/base-ag-grid-cell-component';
import { Subscription } from 'rxjs/Subscription';
import { Uti } from 'app/utilities';
import { DatatableService } from 'app/services';

@Component({
  selector: 'button-and-checkbox-header-cell-renderer',
  templateUrl: './button-and-checkbox-header-cell-renderer.component.html',
  styleUrls: ['./button-and-checkbox-header-cell-renderer.component.scss'],
})
export class ButtonAndCheckboxHeaderCellRenderer
  extends BaseAgGridCellComponent<boolean>
  implements IHeaderAngularComp, OnDestroy
{
  private _onDataChangeStateSubscription: Subscription;
  private _cellValueChangedSubscription: Subscription;
  constructor(private datatableService: DatatableService) {
    super();
  }

  public getCustomParam() {
    this._onDataChangeStateSubscription =
      this.componentParent.onDataChange.subscribe((data) => {
        if (!data || !data.data || !data.data.length) {
          this.value = false;
          return;
        }
        for (let item of data.data) {
          if (
            !Uti.getValueFromObjectJsonString(item[this.colDef.field], 'Value')
          ) {
            this.value = false;
            return;
          }
        }
        this.value = true;
      });
    this._cellValueChangedSubscription =
      this.componentParent.buttonAndCheckboxValueChanged.subscribe((data) => {
        if (!data || !data.colDef || data.colDef.field != this.colDef.field) {
          return;
        }
        let hasFalseValue: boolean = false;
        this.params.api.forEachNode((node) => {
          if (
            node &&
            node.data &&
            !Uti.getValueFromObjectJsonString(
              node.data[this.colDef.field],
              'Value'
            )
          ) {
            hasFalseValue = true;
          }
        });
        this.value = !hasFalseValue;
      });
  }

  ngOnDestroy() {
    if (this._onDataChangeStateSubscription)
      this._onDataChangeStateSubscription.unsubscribe();
    if (this._cellValueChangedSubscription)
      this._cellValueChangedSubscription.unsubscribe();
  }

  /**
   * getValue
   * */
  getValue(): any {
    return this.value;
  }

  /**
   * onCheckboxChange
   * @param event
   */
  onCheckboxChange(event) {
    const status = (this.value = event.checked);
    const itemsToUpdate = [];
    this.params.api.forEachNode((node) => {
      const data = node.data;
      if (data) {
        if (data && data[this.colDef.field]) {
          data[this.colDef.field] =
            this.datatableService.updateValueForButtonAndCheckboxColumn(
              data[this.colDef.field],
              status
            );
          itemsToUpdate.push(data);
        }
      }
    });

    if (itemsToUpdate && itemsToUpdate.length) {
      this.params.api.updateRowData({ update: itemsToUpdate });
    }
  }

  onClick(e) {
    // e.stopPropagation();
    // e.stopImmediatePropagation();
  }
}
