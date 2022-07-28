import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ICellRendererAngularComp, ICellEditorAngularComp } from 'ag-grid-angular';
import { BaseAgGridCellComponent } from '../../shared/base-ag-grid-cell-component';
import { Uti } from 'app/utilities';
import { DatatableService } from 'app/services';

@Component({
    selector: 'check-box-editable-cell-renderer',
    templateUrl: './check-box-editable-cell-renderer.html',
    styleUrls: ['./check-box-editable-cell-renderer.scss']
})
export class CheckboxEditableCellRenderer extends BaseAgGridCellComponent<any> implements ICellEditorAngularComp, AfterViewInit {

    public isDisabled = false;

    constructor(
        private datatableService: DatatableService
    ) {
        super();
    }

    ngAfterViewInit() {
        if (this.params) {
            const hasDisabledBy = this.datatableService.hasDisplayField(this.params.colDef.refData, 'DisabledBy');
            if (hasDisabledBy) {
                const disabledByField = this.datatableService.getDisplayFieldValue(this.params.colDef.refData, 'DisabledBy');
                if (disabledByField) {
                    this.isDisabled = !Uti.isEmptyObject(this.params.data) && this.params.data['DT_RowId'].indexOf('newrow') === -1 && !!this.params.data[disabledByField];
                }
            }
            if (this.componentParent.disableCheckBoxWhenInActive && !this.params.data['IsActive']) {
                this.isDisabled = true;
            }
        }
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
        const status = event.checked;
        this.componentParent.checkBoxChange(this.params, status)
    }
}
