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
import { NoteActionEnum, NoteFormDataAction } from "app/models/note.model";
import { WidgetNoteFormComponent } from "app/shared/components/widget";
@Component({
    selector: "note-form-data-entry",
    styleUrls: ["./note-form-data-entry.component.scss"],
    templateUrl: "./note-form-data-entry.component.html",
})
export class NoteFormDataEntryComponent
    extends DataEntryFormBase
    implements OnInit, OnDestroy, DoCheck
{
    @Input() tabID: string;
    @Input() isCustomerBusinessStatus = false;
    @Input() globalProperties;
    @Input() properties;

    public NOTE_ACTION_ENUM = NoteActionEnum;
    @Output() callSaveAction: EventEmitter<any> = new EventEmitter<any>();
    @Output() updateEditingWidgetAction: EventEmitter<any> =
        new EventEmitter<any>();
    @Output() outputData: EventEmitter<any> = new EventEmitter<any>();

    private customerDataState: Observable<any>;
    private customerDataStateSubscription: Subscription;
    @Input() noteFormDataAction: NoteFormDataAction;

    private selectedSimpleTabChangedState: Observable<any>;

    private widgetTemplateSettingServiceSubscription: Subscription;
    @ViewChild("noteFormComponent")
    noteFormComponent: WidgetNoteFormComponent;

    public idPerson = null;
    public datasource: any;
    public displayItems: any[] = [];
    public hasDanger = false;
    private differ: any;

    constructor(
        private store: Store<AppState>,
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

    public refresh() {
        this.getCustomerStatusByIdPerson();
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
                        this.displayItems.length = 0;
                        return;
                    }

                    if (this.idPerson != customerDataState.formValue.idPerson) {
                        this.idPerson = customerDataState.formValue.idPerson;
                        this.outputData.emit(this.idPerson);
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
            \"MethodName\" : \"SpAppSharingNotes\",
            \"CrudType\"  : null,
            \"Object\" : \"GetNotesPerson\",
            \"Mode\" :  null,
            \"WidgetTitle\" :\"Note Form\",
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
            idRepWidgetApp: 170,
            idRepWidgetType: 40,
            moduleName: "Order Data Entry",
            request: JSON.stringify(request),
            title: "Note Form",
        };
        this.widgetTemplateSettingServiceSubscription =
            this.widgetTemplateSettingService
                .getWidgetDetailByRequestString(widgetDetail, {
                    IdPerson: this.idPerson,
                })
                .subscribe((response: WidgetDetail) => {
                    this.appErrorHandler.executeAction(() => {
                        this.datasource = response.contentDetail;
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
        if (!datasource || !datasource.data || !datasource.data[1]) {
            return [];
        }

        return datasource.data[1];
    }

    public updateEditingWidgetForNote(event) {
        if (event) {
            // this.onEditingWidget.emit(this.data);
        } else {
            // this.onCancelEditingWidget.emit(this.data);
        }
    }

    public upadteEditingWidgetAction(event) {
        this.updateEditingWidgetAction.emit(event);
    }

    public callSave(event) {
        this.callSaveAction.emit(event);
    }

    getDataSave() {
        return this.noteFormComponent.getDataSave();
    }

    public updateNote(event: NoteFormDataAction) {
        if (event.action === this.NOTE_ACTION_ENUM.SAVE) {
            let updateRequest;
            if (event.data) {
                const eventData = event.data;
                eventData["Date"] = eventData.date;
                updateRequest = [eventData];
            } else {
                updateRequest = this.noteFormComponent.getDataSave();
            }

            this.callSaveNoteFormWidget(updateRequest);
        }
    }
    private callSaveNoteFormWidget(updateRequest: any) {
        if (!updateRequest) return;
        this.saveFormWidget(null, updateRequest);
    }

    private saveFormWidget(updateRequest?: string, data?: any) {
        const formValues = data;
        //Remove to fix bug 2976
        //formValues = Uti.convertDataEmptyToNull(formValues);
        let updateKeyValue;
        // const updateKeyValueTemp = this.data.widgetDataType.listenKeyRequest(this.currentModule.moduleNameTrim);
        // updateKeyValue = updateKeyValueTemp ? JSON.stringify(updateKeyValueTemp) : null;
    }
}
