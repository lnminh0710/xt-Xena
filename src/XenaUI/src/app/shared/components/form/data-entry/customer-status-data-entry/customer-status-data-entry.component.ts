import {
    Component, Input, Output, ViewChild, OnInit, OnDestroy, EventEmitter, DoCheck, KeyValueDiffers
} from '@angular/core';
import { WidgetTemplateSettingService, AppErrorHandler, DatatableService } from 'app/services';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import isNil from 'lodash-es/isNil';
import { DataEntryActions } from 'app/state-management/store/actions';
import { FormModel, WidgetDetail, FormOutputModel, OrderDataEntryCommunicationModel, OrderDataEntryCustomerStatusModel } from 'app/models';
import { XnCommunicationTableComponent } from 'app/shared/components/xn-control/xn-communication-table';
import { DataEntryFormBase } from 'app/shared/components/form/data-entry/data-entry-form-base';
import { Router } from '@angular/router';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import { Uti } from 'app/utilities';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
@Component({
    selector: 'customer-status-data-entry',
    styleUrls: ['./customer-status-data-entry.component.scss'],
    templateUrl: './customer-status-data-entry.component.html'
})
export class CustomerStatusDataEntryComponent extends DataEntryFormBase implements OnInit, OnDestroy, DoCheck {

    @Input() tabID: string;
    @Input() isCustomerBusinessStatus = false;

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
    public displayItems: any[] = [];
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
            defaultTranslateText: 'customerStatusData',
            emptyData: new OrderDataEntryCustomerStatusModel()
        });

        this.customerDataState = this.store.select(state => dataEntryReducer.getDataEntryState(state, this.tabID).customerData);
        this.selectedSimpleTabChangedState = store.select(state => tabSummaryReducer.getTabSummaryState(state, this.ofModule.moduleNameTrim).selectedSimpleTab);

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
            change.forEachChangedItem(item => {
                if (item.key == 'transferTranslate') {
                    Uti.rebuildColumnHeaderForGrid(this.datasource, this.transferTranslate);
                    this.processDatasource(this.datasource);
                }
            });
        }
    }

    private subscribeDataEntryCustomerIdState() {
        if (this.customerDataStateSubscription)
            this.customerDataStateSubscription.unsubscribe();

        this.customerDataStateSubscription = this.customerDataState.subscribe((customerDataState: any) => {
            this.appErrorHandler.executeAction(() => {
                if (!customerDataState || !customerDataState.formValue || !customerDataState.formValue.idPerson) {
                    this.displayItems.length = 0;
                    return;
                }

                if (this.idPerson != customerDataState.formValue.idPerson) {
                    this.idPerson = customerDataState.formValue.idPerson;
                }
                this.getCustomerStatusByIdPerson();
            });
        });
    }

    private getCustomerStatusByIdPerson() {
        if (isNil(this.idPerson)) {
            this.datasource = null;
            return;
        }

        const requestData = `
            {
            \"MethodName\" : \"SpAppWg002PersonAddOn\",
            \"CrudType\"  : null,
            \"Object\" : \"` + (this.isCustomerBusinessStatus ? `CustomerBusinessStatus` : `CustomerStatus`) + `\",
            \"Mode\" :  null,
            \"WidgetTitle\" : \"`+ (this.isCustomerBusinessStatus ? `Customer Business Status` : `Customer Status`) + `\",
            \"IsDisplayHiddenFieldWithMsg\" : \"1\",
            <<LoginInformation>>,
                <<InputParameter>>

           }`;
        const request = {
            "Request": {
                "ModuleName": "GlobalModule",
                "ServiceName": "GlobalService",
                "Data": requestData
            }
        };

        let widgetDetail: any = {
            id: Uti.guid(),
            idRepWidgetApp: (this.isCustomerBusinessStatus ? 120 : 119),
            idRepWidgetType: 3,
            moduleName: 'Order Data Entry',
            request: JSON.stringify(request),
            title: (this.isCustomerBusinessStatus ? `Customer Business Status` : `Customer Status`)
        };
        this.widgetTemplateSettingServiceSubscription = this.widgetTemplateSettingService.getWidgetDetailByRequestString(widgetDetail, { IdPerson: this.idPerson, IsShowOnlyActivated: '1' })
            .subscribe((response: WidgetDetail) => {
                this.appErrorHandler.executeAction(() => {
                    this.datasource = this.datatableService.buildDataSource(response.contentDetail);
                    this.processDatasource(this.datasource);
                });
            });
    }

    private processDatasource(datasource) {
        this.hasDanger = false;
        this.displayItems = this.buildData(datasource);
        this.hasDanger = this.checkHasDanger(this.displayItems);
    }

    public rebuildTranslateText() {
        this.rebuildTranslateTextSelf();
    }

    private buildData(datasource) {
        if (!datasource || !datasource.data || !datasource.data.length) {
            return [];
        }

        return datasource.data
            .filter((item) => {
                return item.IsActive;
            }).map((item) => {
                return {
                    text: item.DefaultValue,
                    isActive: item.IsActive,
                    isDanger: item.IsDanger,
                };
            });
    }

    private checkHasDanger(displayItems) {
        if (!displayItems || !displayItems.length) {
            return false;
        }

        return !!displayItems.find(x => x.isDanger);
    }
}
