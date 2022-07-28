import {
    Component, Input, Output, EventEmitter, OnInit,
    OnDestroy, AfterViewInit, ElementRef,
    ComponentFactoryResolver, ViewContainerRef, ComponentRef, ChangeDetectionStrategy
} from "@angular/core";
import {
    HistoryFooterInfo
} from 'app/models';
import { HistoryDialogComponent } from '../history-dialog';

@Component({
    selector: 'history-footer',
    templateUrl: './history-footer.component.html',
    styleUrls: ['./history-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryFooterComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() data: HistoryFooterInfo;


    constructor(private _eref: ElementRef, private componentFactoryResolver: ComponentFactoryResolver,
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
     * showContent
     */
    showContent() {
        let queryString = this.data.infoJsonString;
        // let queryString = '{"Request":{"ModuleName" : "GlobalModule","ServiceName" :"GlobalService","Data":"{\\"MethodName\\" : \\"SpAppWg002GetGridCommunication\\",\\"CrudType\\" : \\"null\\",\\"Object\\" : \\"null\\",\\"Mode\\" : \\"null\\",\\"IdLogin\\" : \\"1\\",\\"LoginLanguage\\" : \\"1\\",\\"IdApplicationOwner\\" : \\"1\\",\\"GUID\\" : \\"\\",\\"IdPersonInterface\\" : \\"704578\\"}"}}';
        const factory = this.componentFactoryResolver.resolveComponentFactory(HistoryDialogComponent);
        var componentRef: ComponentRef<HistoryDialogComponent> = this.containerRef.createComponent(factory);
        const historyDialogComponent: HistoryDialogComponent = componentRef.instance;
        historyDialogComponent.queryRequest = queryString;
        historyDialogComponent.open(() => {
            componentRef.destroy();
        });
    }

}
