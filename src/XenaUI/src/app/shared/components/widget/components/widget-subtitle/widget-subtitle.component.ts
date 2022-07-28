import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { WidgetType } from 'app/models';
import {PropertyPanelService} from 'app/services';
import {Uti} from 'app/utilities';

@Component({
    selector: 'widget-subtitle',
    templateUrl: './widget-subtitle.component.html',
    styleUrls: ['./widget-subtitle.component.scss']
})
export class WidgetSubtitleComponent implements OnInit, OnDestroy, AfterViewInit {
    public contentSav: any;
    public globalDateFormat: any;
    @Input() widgetType: any;

    @Input() set data(data: any) {
        if (data && data.idRepWidgetType === WidgetType.SAVSendLetter) {
            this.contentSav = (() => {try{return data.contentDetail.data[1][0] || {};}catch(e){return {};}})();
        }
    };
    @Input() gridData: any;
    @Input() formData: any;
    @Input() creditCardData: any;
    @Input() countryCheckListData: any;
    @Input() articleMediaManagerData: any;
    @Input() treeViewData: any;
    @Input() fileExplorerData: any;
    @Input() translationData: any;
    @Input() historyContainerData: any;
    @Input() set globalProperties(globalProperties: any[]) {
            this.globalDateFormat = this.propertyPanelService.buildGlobalDateFormatFromProperties(globalProperties);
    }

    constructor(private propertyPanelService: PropertyPanelService,
                private uti: Uti) {

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

    public formatDate(date) {
        return this.uti.formatLocale(date, this.globalDateFormat);
    }

}
