import {
    Component, Input, Output, EventEmitter,
    OnInit, OnDestroy, AfterViewInit, ElementRef,
    ChangeDetectorRef
} from "@angular/core";
import { WidgetTemplateSettingService, DatatableService, AppErrorHandler } from 'app/services';
import { Uti } from 'app/utilities/uti';
import { RawFieldEntity, FieldEntity, DataSetting } from 'app/models';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'history-dialog',
    templateUrl: './history-dialog.component.html',
    styleUrls: ['./history-dialog.component.scss']
})
export class HistoryDialogComponent implements OnInit, OnDestroy, AfterViewInit {

    public showDialog = false;
    @Input() set queryRequest(query: string) {
        if (query) {
            this.updateContent(query);
        }
    }
    public fieldsetData: Array<FieldEntity>;
    public dataSourceTable: any;
    public perfectScrollbarConfig: any = {};
    private widgetTemplateSettingServiceSubscription: Subscription;
    private callBackAfterClose: any;


    constructor(
        private _eref: ElementRef,
        private widgetTemplateSettingService: WidgetTemplateSettingService,
        private datatableService: DatatableService,
        private appErrorHandler: AppErrorHandler,
        public ref: ChangeDetectorRef
    ) {

    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {
    }

    /**
     * open
     */
    public open(callBackAfterClose) {
        this.callBackAfterClose = callBackAfterClose;
        this.showDialog = true;
    }

    /**
     * close
     */
    public close() {
        this.showDialog = false;
        if (this.callBackAfterClose) {
            this.callBackAfterClose();
        }
    }

    /**
     * updateContent
     * @param query
     */
    private updateContent(query: string) {
        this.widgetTemplateSettingServiceSubscription = this.widgetTemplateSettingService.getDetailByRequestString(query).subscribe(result => {
            this.appErrorHandler.executeAction(() => {
                if (result.data) {
                    const isTableData = this.isTableMode(result.data);
                    // Table mode
                    if (isTableData) {
                        result = this.datatableService.formatDataTableFromRawData(result.data);
                        this.dataSourceTable = this.datatableService.buildDataSource(result);
                    }
                    // Field set
                    else {
                        const dataIndex = 1;
                        const rawData: Array<RawFieldEntity> = result.data[dataIndex];
                        this.fieldsetData = Uti.formatFieldsetData(rawData);                                                
                    }
                    setTimeout(() => {
                        this.ref.detectChanges();
                    });
                }
            });
        });
    }

    /**
     * Check data is table or fieldset.
     * @param data
     */
    private isTableMode(data) {
        if (data && data[0][0] && data[0][0]['SettingColumnName']) {
            return true;
        }
        return false;
    }

}
