import {
    Component,
    ViewEncapsulation,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import {
    ICellRendererAngularComp,
    ICellEditorAngularComp,
} from "ag-grid-angular";
import { BaseAgGridCellComponent } from "../../shared/base-ag-grid-cell-component";

@Component({
    selector: "numeric-editable-cell-renderer",
    templateUrl: "./numeric-editable-cell-renderer.html",
    styleUrls: ["./numeric-editable-cell-renderer.scss"],
})
export class NumericEditableCellRenderer
    extends BaseAgGridCellComponent<number>
    implements ICellEditorAngularComp, AfterViewInit
{
    public globalNumberFormat: string;

    @ViewChild("input", { read: ViewContainerRef }) public input;

    constructor() {
        super();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        });
    }

    /**
     * getCustomParam
     * @param params
     */
    protected getCustomParam(params: any) {
        if (this.componentParent) {
            this.globalNumberFormat = this.componentParent.globalNumberFormat;
        }
    }

    /**
     * getValue
     * */
    getValue(): any {
        return this.value;
    }
}
