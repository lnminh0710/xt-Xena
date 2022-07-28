import {
    Component, Input, Output, EventEmitter, OnInit,
    OnDestroy, AfterViewInit, ElementRef, ViewChild,
    ComponentFactoryResolver, ComponentRef, ViewContainerRef, ChangeDetectionStrategy
} from "@angular/core";
import {
    HistoryHeaderInfo,
    HistoryHeaderMenuItem
} from 'app/models';
import { HistoryDialogComponent } from '../history-dialog';
import { PopoverDirective } from 'ngx-bootstrap/popover';

@Component({
    selector: 'history-header',
    templateUrl: './history-header.component.html',
    styleUrls: ['./history-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryHeaderComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() data: HistoryHeaderInfo;

    constructor(private _eref: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private containerRef: ViewContainerRef) {

    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
    }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {
    }


    /**
     * showPopover
     * @param item
     */
    public showPopover(pop) {
        pop.show();
    }

    /**
     * selectMenuItem
     * @param item
     */
    selectMenuItem(item: HistoryHeaderMenuItem, pop: PopoverDirective) {
        if (item.action) {
            switch (item.action.type) {
                case 1:
                    const w = 1024;
                    const h = 764;
                    const left = (screen.width / 2) - (w / 2);
                    const top = (screen.height / 2) - (h / 2);
                    const params = [
                        'height=' + h,
                        'width=' + w,
                        'top=' + top,
                        'left=' + left
                    ].join(',');
                    window.open(item.action.query, '_blank', params);
                    break;
                case 2:
                    let queryString = item.action.query;
                    //let queryString = '{"Request":{"ModuleName" : "GlobalModule","ServiceName" :"GlobalService","Data":"{\\"MethodName\\" : \\"SpAppWg001Person\\",\\"CrudType\\" : \\"null\\",\\"Object\\" : \\"Customer\\",\\"Mode\\" : \\"null\\",\\"IdLogin\\" : \\"1\\",\\"LoginLanguage\\" : \\"1\\",\\"IdApplicationOwner\\" : \\"1\\",\\"GUID\\" : \\"047531cc-059f-49f5-8212-dcad611a2bc0\\",\\"WidgetTitle\\" : \\"Customer Detail\\",\\"IsDisplayHiddenFieldWithMsg\\" : \\"1\\",\\"IdPerson\\" : \\"193385\\"}"}}';
                    const factory = this.componentFactoryResolver.resolveComponentFactory(HistoryDialogComponent);
                    var componentRef: ComponentRef<HistoryDialogComponent> = this.containerRef.createComponent(factory);
                    const historyDialogComponent: HistoryDialogComponent = componentRef.instance;
                    historyDialogComponent.queryRequest = queryString;
                    historyDialogComponent.open(() => {
                        componentRef.destroy();
                    });
                    break;
            }
        }
        pop.hide();
    }
}
