import { Component, TemplateRef, ElementRef } from "@angular/core";
import { Subscription } from "rxjs";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { Uti } from "app/utilities";

@Component({
    selector: "detail-cell-renderer",
    templateUrl: "./detail-cell-renderer.html",
    styleUrls: ["./detail-cell-renderer.scss"],
})
export class DetailCellRenderer implements ICellRendererAngularComp {
    public params: any;
    public template: TemplateRef<any>;
    public templateContext: {
        $implicit: any;
        params: any;
        data: any;
        columns: any;
        renderCallback: Function;
    };
    private changeColumnLayoutSubscribtion: Subscription;

    agInit(params: any): void {
        this.params = params;
        this.template = params.context.componentParent.rowDetailTemplateRef;
        this.templateContext = {
            $implicit: !params["customParam"]
                ? params.value
                : params["customParam"],
            params: params,
            data: params.data,
            columns: params.columnApi.getAllColumns(),
            renderCallback: this.renderCallback.bind(this),
        };

        this.changeColumnLayoutSubscribtion =
            params.context.componentParent.changeColumnLayout.subscribe(
                (data) => {
                    if (data) {
                        this.templateContext.columns =
                            params.columnApi.getAllColumns();
                    }
                }
            );
    }

    // called when the cell is refreshed
    refresh(params: any): boolean {
        return false;
    }

    constructor(private elementRef: ElementRef) {}

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public renderCallback() {
        this.updateHeight();
        if (
            this.params &&
            this.params.context &&
            this.params.context.componentParent
        ) {
            setTimeout(() => {
                this.params.context.componentParent.resetScrollMasterGrid();
            }, 200);
        }
    }

    private updateHeight() {
        let height = this.elementRef.nativeElement.offsetHeight;
        if (height) {
            this.params.node.setRowHeight(height);
            this.params.api.resetRowHeights();
        }
    }
}
