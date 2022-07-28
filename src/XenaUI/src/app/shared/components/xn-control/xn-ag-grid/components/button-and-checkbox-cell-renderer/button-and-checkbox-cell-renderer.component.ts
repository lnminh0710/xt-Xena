import { Component, ChangeDetectorRef } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { BaseAgGridCellComponent } from '../../shared/base-ag-grid-cell-component';
import { Uti } from "app/utilities";

@Component({
    selector: 'button-and-checkbox-cell-renderer',
    templateUrl: './button-and-checkbox-cell-renderer.component.html',
    styleUrls: ['./button-and-checkbox-cell-renderer.component.scss']
})
export class ButtonAndCheckboxCellRenderer extends BaseAgGridCellComponent<string> implements ICellRendererAngularComp {
    public buttonAndCheckboxValue: {Status: any, Value: any} = {"Status": "0", "Value": "0"};

    constructor(
        private ref: ChangeDetectorRef) {
        super();
    }

    public refresh(params: any): boolean {
        return false;
    }

    public btnClick() {
        this.componentParent.buttonAndCheckboxClick.emit(this.params.data);
    }

    public resetStatusSendLetter() {
        this.componentParent.resetStatusSendLetter.emit(this.params.data);
    }

    public onCheckboxChange(event) {
        const status = event.checked;
        this.componentParent.buttonAndCheckboxChange(this.params, status)
    }

    protected getCustomParam(params: any) {
        if (this.value) {
            this.buttonAndCheckboxValue = Uti.parseJsonString(this.value);
        }
        // console.log('====================================');
        // console.log(this.buttonAndCheckboxValue);
        // this.detectChanges();
    }

    private detectChanges() {
        this.ref.markForCheck();
        this.ref.detectChanges();
   }
}
