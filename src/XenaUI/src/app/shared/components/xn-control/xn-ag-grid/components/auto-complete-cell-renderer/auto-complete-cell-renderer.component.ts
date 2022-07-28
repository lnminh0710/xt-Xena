import { Component, ViewEncapsulation, ViewChild, ViewContainerRef } from "@angular/core";
import { ICellRendererAngularComp, ICellEditorAngularComp } from "ag-grid-angular";
import { BaseAgGridCellComponent } from '../../shared/base-ag-grid-cell-component';
import { AppErrorHandler, PropertyPanelService} from 'app/services';

@Component({
    selector: 'auto-complete-cell-renderer',
    templateUrl: './auto-complete-cell-renderer.html',
    styleUrls: ['./auto-complete-cell-renderer.scss']
})
export class AutoCompleteCellRenderer extends BaseAgGridCellComponent<any> implements ICellRendererAngularComp {

    public searchFunc: Function;
    public ctrlValue: {
        key: string,
        value: string,
        options: any[]
    } = {
            key: '',
            value: '',
            options: []
        };
    public isShowDropdownWhenFocusCombobox: boolean = false;
    public isInWidget: boolean = true;

    @ViewChild('autoCompleteCtr', { read: ViewContainerRef }) public autoCompleteCtr;

    constructor(
                private propertyPanelService: PropertyPanelService,
                private appErrorHandler: AppErrorHandler) {
        super();
    }

    refresh(params: any): boolean {
        return false;
    }

    // called on init
    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;
        this.cellStartedEdit = this.params.cellStartedEdit;
        const field = this.params.column.colDef.field;

        // Edit mode
        this.getCustomParam(params);
        if (!this.cellStartedEdit || !this.componentParent || !field) return;
        const propertiesWidget = this.componentParent.widgetProperties;
        const propertyDropdownForm = this.propertyPanelService.getValueDropdownFromProperties(propertiesWidget);
        if (!propertyDropdownForm || !propertyDropdownForm.length) return;
        for (let item of propertyDropdownForm) {
            if (field !== item.value) continue;
            this.isShowDropdownWhenFocusCombobox = item.selected;
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (!this.autoCompleteCtr ||
                !this.autoCompleteCtr.element ||
                !this.autoCompleteCtr.element.nativeElement)
                return;

            this.autoCompleteCtr.element.nativeElement.focus();
        })
    }

    /**
     * getCustomParam
     * @param params
     */
    protected getCustomParam(params: any) {
        if (this.componentParent) {
            this.searchFunc = this.componentParent.autoCompleteSearchFunc;
            if (!this.value) return;
            this.ctrlValue.key = this.value.key;
            this.ctrlValue.value = this.value.value;
        }
    }
    
    /**
     * getValue
     * */
    getValue(): any {
        return {
            key: this.ctrlValue.key,
            value: this.ctrlValue.value,
            options: []
        }
    }

    public onKeyUp(control) {
        if (this.componentParent) {
            this.componentParent.onAutoCompleteCellChanged.emit(this.ctrlValue.value);
        }
    }
}
