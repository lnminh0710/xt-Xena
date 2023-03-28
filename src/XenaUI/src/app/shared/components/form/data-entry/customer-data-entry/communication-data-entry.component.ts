import {
    Component,
    Input,
    Output,
    ViewChild,
    OnInit,
    OnDestroy,
    EventEmitter,
} from "@angular/core";
import {
    WidgetTemplateSettingService,
    AppErrorHandler,
    DataEntryProcess,
} from "app/services";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { Store } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import cloneDeep from "lodash-es/cloneDeep";
import { DataEntryActions } from "app/state-management/store/actions";
import {
    FormModel,
    WidgetDetail,
    FormOutputModel,
    OrderDataEntryCommunicationModel,
} from "app/models";
import { XnCommunicationTableComponent } from "app/shared/components/xn-control/xn-communication-table";
import { DataEntryFormBase } from "app/shared/components/form/data-entry/data-entry-form-base";
import { Router } from "@angular/router";
import * as dataEntryReducer from "app/state-management/store/reducer/data-entry";
import { Uti } from "app/utilities";
import * as tabSummaryReducer from "app/state-management/store/reducer/tab-summary";
import { OrderFailedDataEnum } from "app/app.constants";

@Component({
    selector: "app-communication-data-entry",
    styleUrls: ["./customer-data-entry.component.scss"],
    templateUrl: "./communication-data-entry.component.html",
})
export class CommunicationDataEntryComponent
    extends DataEntryFormBase
    implements OnInit, OnDestroy
{
    @Input() set resized(_number: any) {
        if (this.xnCommunicationTableComponent)
            this.xnCommunicationTableComponent.autoSizeColumns();
    }
    @Input() tabID: string;
    @Output() outputData: EventEmitter<FormOutputModel> = new EventEmitter();

    private dataEntryCustomerIdState: Observable<number>;
    private dataEntryCustomerIdStateSubscription: Subscription;

    private selectedSimpleTabChangedState: Observable<any>;
    private selectedSimpleTabChangedStateSubscription: Subscription;

    private dataEntryCommunicationState: Observable<FormModel>;
    private dataEntryCommunicationStateSubscription: Subscription;
    private widgetTemplateSettingServiceSubscription: Subscription;

    private formvalue: Array<any>;
    private orderFailedRequestDataState: Observable<any>;
    private orderFailedRequestDataStateSubcription: Subscription;
    private cachedFailedDataState: Observable<any>;
    private cachedFailedDataStateSubcription: Subscription;

    private customerId = 0;
    private REQUEST_STRING = {
        Request: {
            ModuleName: "GlobalModule",
            ServiceName: "GlobalService",
            Data: '{"MethodName" : "SpAppWg002GetGridCommunication", "CrudType"  : null, "Object" : null,"Mode" :  null, "WidgetTitle" : "Begin new World...", "IsDisplayHiddenFieldWithMsg" : "1",<<LoginInformation>>,<<InputParameter>>}',
        },
    };
    private isUpdatedInside = false;
    public dataSourceTable: any = [];

    @ViewChild(XnCommunicationTableComponent)
    private xnCommunicationTableComponent: XnCommunicationTableComponent;

    constructor(
        private store: Store<AppState>,
        private dataEntryActions: DataEntryActions,
        private widgetTemplateSettingService: WidgetTemplateSettingService,
        private appErrorHandler: AppErrorHandler,
        protected router: Router,
        private dataEntryProcess: DataEntryProcess
    ) {
        super(router, {
            defaultTranslateText: "communicationData",
            emptyData: new OrderDataEntryCommunicationModel(),
        });

        //this.dataEntryCustomerIdState = this.store.select(state => dataEntryReducer.getDataEntryState(state, this.tabID).customerId);
        this.dataEntryCommunicationState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .communicationData
        );
        this.selectedSimpleTabChangedState = store.select(
            (state) =>
                tabSummaryReducer.getTabSummaryState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedSimpleTab
        );

        this.orderFailedRequestDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .orderFailedRequestData
        );
        this.cachedFailedDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .cachedFailedData
        );
    }

    public ngOnInit() {
        //this.subscribeDataEntryCustomerIdState();
        this.subscribeDataEntryCommunicationState();
        this.subscribeOrderFailed();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private subscribeDataEntryCustomerIdState() {
        if (this.dataEntryCustomerIdStateSubscription)
            this.dataEntryCustomerIdStateSubscription.unsubscribe();

        this.dataEntryCustomerIdStateSubscription =
            this.dataEntryCustomerIdState.subscribe((customerId) => {
                this.appErrorHandler.executeAction(() => {
                    this.customerId = customerId;
                    //this.getCommunicationByCustomerId();
                });
            });
    }

    private subscribeDataEntryCommunicationState() {
        if (this.dataEntryCommunicationStateSubscription)
            this.dataEntryCommunicationStateSubscription.unsubscribe();

        this.dataEntryCommunicationStateSubscription =
            this.dataEntryCommunicationState.subscribe((data) => {
                this.appErrorHandler.executeAction(() => {
                    if (data && data.rawData && data.rawData.length > 0) {
                        this.dataSourceTable = cloneDeep(data.rawData[1]);
                    } else if (
                        !this.isUpdatedInside &&
                        (!data || !data.mappedData)
                    ) {
                        this.dataSourceTable = [];
                    }
                    this.isUpdatedInside = false;
                });
            });

        this.selectedSimpleTabChangedStateSubscription =
            this.selectedSimpleTabChangedState.subscribe(
                (selectedSimpleTab: any) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!selectedSimpleTab) return;

                        this.xnCommunicationTableComponent.autoSizeColumns();
                    });
                }
            );
    }

    private getCommunicationByCustomerId() {
        if (this.isLoadForCachedFailed) {
            this.isLoadForCachedFailed = false;
            return;
        }

        if (!this.customerId) {
            this.dataSourceTable = [];
            return;
        }
        const widgetDetail: WidgetDetail = new WidgetDetail({
            idRepWidgetType: 3,
            moduleName: "Order Data Entry",
            request: JSON.stringify(this.REQUEST_STRING),
        });
        this.widgetTemplateSettingServiceSubscription =
            this.widgetTemplateSettingService
                .getWidgetDetailByRequestString(widgetDetail, {
                    IdPersonInterface: this.customerId,
                })
                .subscribe((response: WidgetDetail) => {
                    this.appErrorHandler.executeAction(() => {
                        this.dataSourceTable =
                            response.contentDetail.collectionData;
                    });
                });
    }

    public getCommOutputData(eventData) {
        if (!eventData) return;

        this.formvalue = eventData.formValue;
        this.isUpdatedInside = true;
        this.store.dispatch(
            this.dataEntryActions.dataEntryCommunicationDataChanged(
                eventData,
                this.tabID
            )
        );
        this.outputData.emit(eventData);
    }

    public rebuildTranslateText() {
        this.rebuildTranslateTextSelf();
    }

    public isBlockUI() {
        return (
            this.tabID == this.dataEntryProcess.selectedODETab.TabID &&
            this.dataEntryProcess.mediaCodeDoesnotExist
        );
    }

    private isLoadForCachedFailed: boolean = false;

    /**
     * subscribeOrderFailed
     **/
    private subscribeOrderFailed() {
        this.orderFailedRequestDataStateSubcription =
            this.orderFailedRequestDataState.subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    if (response && response.isNotify) {
                        this.store.dispatch(
                            this.dataEntryActions.orderFailedReceiveData(
                                {
                                    key: OrderFailedDataEnum.CommunicationData,
                                    data: this.formvalue || {},
                                },
                                this.tabID
                            )
                        );
                    }
                });
            });

        this.cachedFailedDataStateSubcription =
            this.cachedFailedDataState.subscribe((response) => {
                this.appErrorHandler.executeAction(() => {
                    if (response && response.communicationData) {
                        this.isLoadForCachedFailed = true;
                        this.dataSourceTable = Object.assign(
                            [],
                            response.communicationData
                        );
                    }
                });
            });
    }
}
