import {
    Directive,
    HostListener,
    Input,
    OnInit,
    OnDestroy,
} from "@angular/core";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Subscription, Observable } from "rxjs";
import {
    AppErrorHandler,
    DownloadFileService,
    SelectionExportService,
} from "app/services";
import {
    ProcessDataActions,
    CustomAction,
} from "app/state-management/store/actions";
import { Module } from "app/models";
import { ToasterService } from "angular2-toaster";
import { Uti } from "app/utilities";
import camelCase from "lodash-es/camelCase";
import * as widgetContentReducer from "app/state-management/store/reducer/widget-content-detail";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as moduleSettingReducer from "app/state-management/store/reducer/module-setting";
import { Configuration } from "app/app.constants";

const ID_STRING = {
    COUNTRY_ID: "IdSelectionProjectCountry",
    COUNTRY_LANGUAGE_ID: "IdCountrylanguage",
};

@Directive({
    selector: "[ProcessSelectionExport]",
})
export class ProcessSelectionExportDirective implements OnInit, OnDestroy {
    private selectedEntity: any;
    private widgetListenKey: string;
    private selectedRowData: any;
    private rowDataState: Observable<any>;
    private selectedEntityState: Observable<any>;
    private selectedEntityStateSubscription: Subscription;
    private widgetListenKeyState: Observable<any>;
    private widgetListenKeyStateSubscription: Subscription;
    private requestExportSelectionDataStateSubscription: Subscription;
    private rowDataStateSubscription: Subscription;

    constructor(
        private store: Store<AppState>,
        private dispatcher: ReducerManagerDispatcher,
        private appErrorHandler: AppErrorHandler,
        private toasterService: ToasterService,
        private processDataActions: ProcessDataActions,
        private downloadFileService: DownloadFileService,
        private selectionExportService: SelectionExportService
    ) {
        this.selectedEntityState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.currentModule.moduleNameTrim
                ).selectedEntity
        );
        this.widgetListenKeyState = store.select(
            (state) =>
                moduleSettingReducer.getModuleSettingState(
                    state,
                    this.currentModule.moduleNameTrim
                ).widgetListenKey
        );
        this.rowDataState = this.store.select(
            (state) =>
                widgetContentReducer.getWidgetContentDetailState(
                    state,
                    this.currentModule.moduleNameTrim
                ).rowData
        );
    }

    @Input() ProcessSelectionExport: any;
    @Input() currentModule: Module;

    ngOnInit() {
        this._subscribeWidgetListenKeyState();
        this._subscribeSelectedEntityState();
        this._subscribeRequestExportSelectionDataState();
        this._subscribeRowsDataState();
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private _subscribeWidgetListenKeyState() {
        this.widgetListenKeyStateSubscription =
            this.widgetListenKeyState.subscribe(
                (widgetListenKeyState: string) => {
                    this.appErrorHandler.executeAction(() => {
                        this.widgetListenKey = widgetListenKeyState;
                    });
                }
            );
    }

    private _subscribeSelectedEntityState() {
        this.selectedEntityStateSubscription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.selectedEntity = selectedEntityState;
                });
            });
    }

    private _subscribeRequestExportSelectionDataState() {
        this.requestExportSelectionDataStateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type ===
                        ProcessDataActions.REQUEST_EXPORT_SELECTION_DATA &&
                    this.currentModule &&
                    action.module.idSettingsGUI ==
                        this.currentModule.idSettingsGUI
                );
            })
            .subscribe((action: CustomAction) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        Configuration.PublicSettings.isSelectionProject &&
                        this.ProcessSelectionExport &&
                        this.ProcessSelectionExport.data.idRepWidgetApp == 515
                    ) {
                        if (action.payload.exportType === "mediacode") {
                            this.exportSelectionMediacode(
                                action.payload.fileType
                            );
                        } else if (action.payload.exportType === "data") {
                            this.exportSelectionData(
                                action.payload.csvDelimiter
                            );
                        } else if (action.payload.exportType === "all") {
                            this.exportAll(
                                action.payload.email,
                                action.payload.fileType,
                                action.payload.csvDelimiter
                            );
                        }
                    }
                });
            });
    }

    private _subscribeRowsDataState() {
        this.rowDataStateSubscription = this.rowDataState.subscribe(
            (rowDataState: any) => {
                this.appErrorHandler.executeAction(() => {
                    this.selectedRowData = rowDataState;
                });
            }
        );
    }

    private exportSelectionData(csvDelimiter?) {
        if (this.selectedRowData && this.selectedRowData.data) {
            let country = this.selectedRowData.data.find(
                (x) => x.key === ID_STRING.COUNTRY_ID
            );
            let language = this.selectedRowData.data.find(
                (x) => x.key === ID_STRING.COUNTRY_LANGUAGE_ID
            );
            if (!country || !language) {
                this.toasterService.pop(
                    "warning",
                    "Must select a country to export data"
                );
                this.store.dispatch(
                    this.processDataActions.exportSelectionDataResult(
                        "data",
                        this.currentModule,
                        false
                    )
                );
                return;
            }

            const countryId = this.selectedRowData.data.find(
                (x) => x.key === ID_STRING.COUNTRY_ID
            ).value;
            const countryLanguageId = this.selectedRowData.data.find(
                (x) => x.key === ID_STRING.COUNTRY_LANGUAGE_ID
            ).value;

            if (!countryId || !countryLanguageId) {
                this.toasterService.pop(
                    "warning",
                    "Must select a country to export data"
                );
                this.store.dispatch(
                    this.processDataActions.exportSelectionDataResult(
                        "data",
                        this.currentModule,
                        false
                    )
                );
                return;
            }

            this.selectionExportService
                .exportData(
                    this.selectedEntity[camelCase(this.widgetListenKey)],
                    countryLanguageId,
                    countryId,
                    csvDelimiter
                )
                .subscribe(
                    (response) => {
                        if (
                            Uti.isResquestSuccess(response) &&
                            response.item["fullFileName"]
                        ) {
                            this.downloadFileService.downloadFile(
                                response.item["fullFileName"],
                                response.item["originalFileName"],
                                true
                            );
                        } else {
                            this.toasterService.pop(
                                "warning",
                                "No data to export"
                            );
                        }

                        this.store.dispatch(
                            this.processDataActions.exportSelectionDataResult(
                                "data",
                                this.currentModule,
                                true
                            )
                        );
                    },
                    () => {
                        this.store.dispatch(
                            this.processDataActions.exportSelectionDataResult(
                                "data",
                                this.currentModule,
                                false
                            )
                        );
                    }
                );
        } else {
            this.toasterService.pop(
                "warning",
                "Must select a country to export data"
            );
            this.store.dispatch(
                this.processDataActions.exportSelectionDataResult(
                    "data",
                    this.currentModule,
                    false
                )
            );
        }
    }

    private exportSelectionMediacode(fileType?) {
        if (this.selectedEntity) {
            this.selectionExportService
                .exportMediaCode(
                    this.selectedEntity[camelCase(this.widgetListenKey)],
                    this.selectedEntity["projectName"],
                    fileType
                )
                .subscribe(
                    (response) => {
                        if (
                            Uti.isResquestSuccess(response) &&
                            response.item["fullFileName"]
                        ) {
                            this.downloadFileService.downloadFile(
                                response.item["fullFileName"],
                                response.item["originalFileName"],
                                true
                            );
                        } else {
                            this.toasterService.pop(
                                "warning",
                                "No data to export"
                            );
                        }

                        this.store.dispatch(
                            this.processDataActions.exportSelectionDataResult(
                                "mediacode",
                                this.currentModule,
                                true
                            )
                        );
                    },
                    () => {
                        this.store.dispatch(
                            this.processDataActions.exportSelectionDataResult(
                                "mediacode",
                                this.currentModule,
                                false
                            )
                        );
                    }
                );
        } else {
            this.toasterService.pop("warning", "No data to export");
            this.store.dispatch(
                this.processDataActions.exportSelectionDataResult(
                    "mediacode",
                    this.currentModule,
                    false
                )
            );
        }
    }

    private exportAll(email?, fileType?, csvDelimiter?) {
        if (this.selectedEntity) {
            this.selectionExportService
                .exportAll(
                    this.selectedEntity[camelCase(this.widgetListenKey)],
                    this.selectedEntity["projectName"],
                    email,
                    fileType,
                    csvDelimiter
                )
                .subscribe(
                    (response) => {
                        if (
                            Uti.isResquestSuccess(response) &&
                            response.item["fullFileName"]
                        ) {
                            this.downloadFileService.downloadFile(
                                response.item["fullFileName"],
                                response.item["originalFileName"],
                                true
                            );
                        } else {
                            this.toasterService.pop(
                                "warning",
                                "No data to export"
                            );
                        }

                        this.store.dispatch(
                            this.processDataActions.exportSelectionDataResult(
                                "all",
                                this.currentModule,
                                true
                            )
                        );
                    },
                    () => {
                        this.store.dispatch(
                            this.processDataActions.exportSelectionDataResult(
                                "all",
                                this.currentModule,
                                false
                            )
                        );
                    }
                );
        } else {
            this.toasterService.pop("warning", "No data to export");
            this.store.dispatch(
                this.processDataActions.exportSelectionDataResult(
                    "all",
                    this.currentModule,
                    false
                )
            );
        }
    }
}
