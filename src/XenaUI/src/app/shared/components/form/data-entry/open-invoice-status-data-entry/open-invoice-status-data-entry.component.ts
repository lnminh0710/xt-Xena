import {
    Component,
    Input,
    Output,
    ViewChild,
    OnInit,
    OnDestroy,
    EventEmitter,
    DoCheck,
    KeyValueDiffers,
} from "@angular/core";
import {
    WidgetTemplateSettingService,
    AppErrorHandler,
    DatatableService,
} from "app/services";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import isNil from "lodash-es/isNil";
import { DataEntryActions } from "app/state-management/store/actions";
import {
    FormModel,
    WidgetDetail,
    FormOutputModel,
    OrderDataEntryCommunicationModel,
    OrderDataEntryCustomerStatusModel,
} from "app/models";
import { XnCommunicationTableComponent } from "app/shared/components/xn-control/xn-communication-table";
import { DataEntryFormBase } from "app/shared/components/form/data-entry/data-entry-form-base";
import { Router } from "@angular/router";
import * as dataEntryReducer from "app/state-management/store/reducer/data-entry";
import { Uti } from "app/utilities";
import * as tabSummaryReducer from "app/state-management/store/reducer/tab-summary";
@Component({
    selector: "open-invoice-status-data-entry",
    styleUrls: ["./open-invoice-status-data-entry.component.scss"],
    templateUrl: "./open-invoice-status-data-entry.component.html",
})
export class OpenInvoiceStatusDataEntryComponent
    extends DataEntryFormBase
    implements OnInit, OnDestroy, DoCheck
{
    @Input() tabID: string;

    @Output() outputData: EventEmitter<FormOutputModel> = new EventEmitter();

    private customerDataState: Observable<any>;
    private customerDataStateSubscription: Subscription;

    private selectedSimpleTabChangedState: Observable<any>;
    private selectedSimpleTabChangedStateSubscription: Subscription;

    private dataEntryCommunicationState: Observable<FormModel>;
    private dataEntryCommunicationStateSubscription: Subscription;
    private widgetTemplateSettingServiceSubscription: Subscription;

    private idPerson = null;
    public datasource: any;
    public displayItems: any;
    public hasDanger = false;
    private differ: any;

    constructor(
        private store: Store<AppState>,
        private dataEntryActions: DataEntryActions,
        private widgetTemplateSettingService: WidgetTemplateSettingService,
        private datatableService: DatatableService,
        private appErrorHandler: AppErrorHandler,
        protected router: Router,
        private differs: KeyValueDiffers
    ) {
        super(router, {
            defaultTranslateText: "customerStatusData",
            emptyData: new OrderDataEntryCustomerStatusModel(),
        });

        this.customerDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .customerData
        );
        this.selectedSimpleTabChangedState = store.select(
            (state) =>
                tabSummaryReducer.getTabSummaryState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedSimpleTab
        );

        this.differ = this.differs.find({}).create();
    }

    public ngOnInit() {
        this.getCustomerStatusByIdPerson();
        this.subscribeDataEntryCustomerIdState();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public ngDoCheck() {
        const change = this.differ.diff(this);
        if (change) {
            change.forEachChangedItem((item) => {
                if (item.key == "transferTranslate") {
                    Uti.rebuildColumnHeaderForGrid(
                        this.datasource,
                        this.transferTranslate
                    );
                    this.processDatasource(this.datasource);
                }
            });
        }
    }

    private subscribeDataEntryCustomerIdState() {
        if (this.customerDataStateSubscription)
            this.customerDataStateSubscription.unsubscribe();

        this.customerDataStateSubscription = this.customerDataState.subscribe(
            (customerDataState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !customerDataState ||
                        !customerDataState.formValue ||
                        !customerDataState.formValue.idPerson
                    ) {
                        this.displayItems = null;
                        return;
                    }

                    if (this.idPerson != customerDataState.formValue.idPerson) {
                        this.idPerson = customerDataState.formValue.idPerson;
                    }
                    this.getCustomerStatusByIdPerson();
                });
            }
        );
    }

    private getCustomerStatusByIdPerson() {
        if (isNil(this.idPerson)) {
            this.datasource = null;
            return;
        }

        const requestData = `
            {
            \"MethodName\" : \"SpCallOrderDataEntry\",
            \"CrudType\"  : null,
            \"Object\" : \"OpenInvoiceWidgetStatus\",
            \"Mode\" :  null,
            \"WidgetTitle\" : \"Open Invoice Status",
            \"IsDisplayHiddenFieldWithMsg\" : \"1\",
            <<LoginInformation>>,
                <<InputParameter>>

           }`;
        const request = {
            Request: {
                ModuleName: "GlobalModule",
                ServiceName: "GlobalService",
                Data: requestData,
            },
        };

        let widgetDetail: any = {
            id: Uti.guid(),
            idRepWidgetApp: 172,
            idRepWidgetType: 3,
            moduleName: "Order Data Entry",
            request: JSON.stringify(request),
            title: "Open Invoice Status",
        };
        this.widgetTemplateSettingServiceSubscription =
            this.widgetTemplateSettingService
                .getWidgetDetailByRequestString(widgetDetail, {
                    IdPerson: this.idPerson,
                })
                .subscribe((response: WidgetDetail) => {
                    this.appErrorHandler.executeAction(() => {
                        this.datasource = this.datatableService.buildDataSource(
                            response.contentDetail
                        );
                        this.processDatasource(this.datasource);
                    });
                });
    }

    private processDatasource(datasource) {
        this.displayItems = this.buildData(datasource);
    }

    public rebuildTranslateText() {
        this.rebuildTranslateTextSelf();
    }

    private buildData(datasource) {
        if (!datasource || !datasource.data || !datasource.data.length) {
            return null;
        }

        return datasource.data[0];
    }
}
