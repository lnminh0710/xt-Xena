import { Component, ViewChild } from "@angular/core";
import { ICellRendererAngularComp, ICellEditorAngularComp } from "ag-grid-angular";
import { DatatableService, CommonService, AppErrorHandler, PropertyPanelService } from 'app/services';
import { BaseAgGridCellComponent } from '../../shared/base-ag-grid-cell-component';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
    selector: 'priority-dropdown-cell-renderer',
    templateUrl: './priority-dropdown-cell-renderer.html',
    styleUrls: ['./priority-dropdown-cell-renderer.scss']
})
export class PriorityDropdownCellRenderer extends BaseAgGridCellComponent<any> implements ICellRendererAngularComp, ICellEditorAngularComp {

    public options: Array<any> = [];
    public key: string;
    public isShowDropdownWhenFocusCombobox: boolean = false;

    private cellCombo: AngularMultiSelect;
    @ViewChild('cellCombo') set content(content: AngularMultiSelect) {
        this.cellCombo = content;
    }

    constructor(private datatableService: DatatableService,
        private commonService: CommonService,
        private propertyPanelService: PropertyPanelService,
        private appErrorHandler: AppErrorHandler) {
        super();
    }

    // called on init
    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;
        this.cellStartedEdit = this.params.cellStartedEdit;
        // Edit mode
        if (this.cellStartedEdit) {
            this.buildComboboxData();
            const field = this.params.column.colDef.field;
            if (this.componentParent && this.componentParent.widgetProperties && this.componentParent.widgetProperties.length && field) {
                const propertiesWidget = this.componentParent.widgetProperties;
                const propertyDropdownForm = this.propertyPanelService.getValueDropdownFromProperties(propertiesWidget);
                for (let item of propertyDropdownForm) {
                    if (field !== item.value) continue;
                    this.isShowDropdownWhenFocusCombobox = item.selected;
                }
            }
        }
        if (this.value) {
            this.key = this.value;
        } else if (this.options.length) {
            this.key = this.options[this.options.length - 1].value;
        }

        setTimeout(() => {
            if (this.cellCombo && this.cellCombo.hostElement) {
                this.cellCombo.hostElement.addEventListener('keydown', this.onKeydown.bind(this));
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
        this.options = this.params.context.componentParent.priorities;
    }

    private onKeydown(evt) {
        if (evt.key !== 'Enter' && evt.key !== 'Tab') {
            evt.stopPropagation();
        }
    }

    public onPriorityChangeValue($event) {
        if ($event.selectedItem && $event.selectedItem.value) {
            let fromData = this.params.data || this.params.node.data;
            this.params.context.componentParent.updatePriority(fromData, $event.selectedItem);
        }
    }

    /**
     * getValue
     * */
    getValue(): any {
        return this.key;
    }
}
