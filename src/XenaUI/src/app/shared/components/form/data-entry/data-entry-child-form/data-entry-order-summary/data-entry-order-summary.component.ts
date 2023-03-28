import {
    Component,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
} from "@angular/core";
import { StoreStringCall } from "app/app.constants";
import {
    AppErrorHandler,
    DatatableService,
    WidgetTemplateSettingService,
    PropertyPanelService,
} from "app/services";
import { ViewChild } from "@angular/core";
import { WijmoGridComponent } from "app/shared/components/wijmo";
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Uti } from "app/utilities";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";
import { BaseComponent, ModuleList } from "app/pages/private/base";
import { Router } from "@angular/router";

@Component({
    selector: "app-data-entry-order-summary",
    styleUrls: ["./data-entry-order-summary.component.scss"],
    templateUrl: "./data-entry-order-summary.component.html",
})
export class DataEntryOrderSummaryComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    public commandList: Array<any>;
    public isSendToAdmin = false;
    public isByDate = false;
    public fromDate: any;
    public toDate: any;
    public sendToAdminGridData: any;
    public searchByDateGridData: any;
    public perfectScrollbarConfig: any;
    public globalDateFormat = "";
    private widgetTemplateSettingServiceSubscription: Subscription;
    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;

    @ViewChild("searchByDateGrid") searchByDateGrid: WijmoGridComponent;

    @Output() outputData: EventEmitter<any> = new EventEmitter();

    constructor(
        private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private propertyPanelService: PropertyPanelService,
        private datatableService: DatatableService,
        private widgetTemplateSettingService: WidgetTemplateSettingService,
        protected router: Router
    ) {
        super(router);

        this.globalPropertiesState = store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
    }

    public ngOnInit() {
        this.initData();
        this.initPerfectScroll();
        this.subscribeGlobalProperties();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public dragStart() {
        Uti.handleWhenSpliterResize();
    }

    private initData() {
        this.initCommandList();
        this.initEmptyGrid();
        this.getDataForGrid();
    }

    private initPerfectScroll() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false,
        };
    }

    private initEmptyGrid() {
        this.searchByDateGridData = {
            columns: [],
            data: [],
        };
        this.sendToAdminGridData = {
            columns: [],
            data: [],
        };
    }

    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription =
            this.globalPropertiesState.subscribe((globalProperties: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (globalProperties) {
                        this.globalDateFormat =
                            this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                                globalProperties
                            );
                    }
                });
            });
    }

    private getDataForGrid() {
        this.createWidgetDetail();
        this.widgetTemplateSettingServiceSubscription =
            this.widgetTemplateSettingService
                .getWidgetDetailByRequestString(
                    this.widgetDetailMediaCodeMain,
                    { IdSalesCampaignWizard: 962 }
                )
                .subscribe((response) => {
                    this.appErrorHandler.executeAction(() => {
                        this.searchByDateGridData =
                            this.datatableService.buildDataSource(
                                response.contentDetail
                            );
                    });
                });
    }

    private widgetDetailMediaCodeMain: any;
    private createWidgetDetail() {
        this.widgetDetailMediaCodeMain = {
            id: "153eaf8e-b109-aa3a-b2ab-57aa5c8ae4cb", // No needed
            idRepWidgetApp: 46,
            idRepWidgetType: 2,
            isMainArea: false,
            minRowOfColumns: 0,
            moduleName: "Campaign",
            request: StoreStringCall.StoreWidgetRequestMediaCodeMain,
            title: "MediaCode Main",
            updateRequest: "",
        };
    }

    private initCommandList() {
        this.commandList = [
            {
                id: "today",
                title: "Today",
                icon: "calendar-o",
                total: 0,
                isClicked: false,
            },
            {
                id: "week",
                title: "This week",
                icon: "calendar",
                total: 0,
                isClicked: false,
            },
            {
                id: "month",
                title: "This month",
                icon: "calendar",
                total: 0,
                isClicked: false,
            },
            {
                id: "date",
                title: "By Date",
                icon: "calendar-o",
                total: 0,
                isClicked: false,
            },
            {
                id: "admin",
                title: "Send to admin",
                icon: "user-secret",
                total: 0,
                isClicked: false,
            },
        ];
    }

    public commandClick(commandId: any) {
        this.removeClickedToCommand();
        this.setClickedToCommand(commandId);
        this.isSendToAdmin = false;
        switch (commandId) {
            case "today":
            case "week":
            case "month": {
                this.isByDate = false;
                this.todayClick(commandId);
                break;
            }
            case "date": {
                this.isByDate = true;
                this.dateClick(commandId);
                break;
            }
            case "admin": {
                this.isSendToAdmin = true;
                this.isByDate = false;
                this.sendToAdminClick(commandId);
                break;
            }
        }
    }

    private todayClick(commandId: any) {}

    private dateClick(commandId: any) {}

    private sendToAdminClick(commandId: any) {}

    public downloadPdf($event: any) {
        this.searchByDateGrid.exportToPdf("test");
    }

    private setClickedToCommand(commandId: any) {
        const item = this.commandList.find((x) => x.id === commandId);
        item.isClicked = true;
    }

    private removeClickedToCommand() {
        for (const item of this.commandList) {
            item.isClicked = false;
        }
    }
}
