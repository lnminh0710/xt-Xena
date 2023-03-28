import { Component, ViewEncapsulation, OnDestroy } from "@angular/core";
import {
    ICellRendererAngularComp,
    ICellEditorAngularComp,
    IHeaderAngularComp,
} from "ag-grid-angular";
import { BaseAgGridCellComponent } from "../../../shared/base-ag-grid-cell-component";
import { Subscription } from "rxjs/Subscription";
import { ColHeaderKey } from "../../../shared/ag-grid-constant";

@Component({
    selector: "delete-check-box-header-cell-renderer",
    templateUrl: "./delete-check-box-header-cell-renderer.html",
    styleUrls: ["./delete-check-box-header-cell-renderer.scss"],
})
export class DeleteCheckboxHeaderCellRenderer
    extends BaseAgGridCellComponent<boolean>
    implements IHeaderAngularComp, OnDestroy
{
    private _cellValueChangedSubscription: Subscription;
    constructor() {
        super();
    }

    public getCustomParam() {
        this._cellValueChangedSubscription =
            this.componentParent.onDeleteChecked.subscribe((data) => {
                if (
                    !data ||
                    !data.colDef ||
                    data.colDef.field != this.colDef.field
                ) {
                    return;
                }
                let hasFalseValue: boolean = false;

                this.params.api.forEachNode((node) => {
                    if (node.data && !node.data[this.colDef.field]) {
                        hasFalseValue = true;
                    }
                });
                if (!this.componentParent.getCurrentNodeItems().length) {
                    this.value = false;
                    return;
                }
                this.value = !hasFalseValue;
            });
    }

    /**
     * getValue
     * */
    getValue(): any {
        return this.value;
    }

    ngOnDestroy() {
        if (this._cellValueChangedSubscription)
            this._cellValueChangedSubscription.unsubscribe();
    }

    /**
     * onCheckboxChange
     * @param event
     */
    onCheckboxChange(event) {
        const status = event.checked;
        const itemsToUpdate = [];
        this.params.api.forEachNode((node) => {
            if (node.data && node.data[ColHeaderKey.IsEditable] != 0) {
                this.componentParent.setDeleteCheckboxStatus(node.data, status);
                itemsToUpdate.push(node.data);
            }
        });

        if (itemsToUpdate && itemsToUpdate.length) {
            this.componentParent.deleteCheckBoxChanges();
            this.params.api.updateRowData({ update: itemsToUpdate });
            this.componentParent.checkAndEmitDeleteRowStatus();
        }
    }

    onClick(e) {
        // e.stopPropagation();
        // e.stopImmediatePropagation();
    }
}
