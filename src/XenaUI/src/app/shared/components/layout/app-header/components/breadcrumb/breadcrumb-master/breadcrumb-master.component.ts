import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import {
    BreadcrumbModel,
    ParkedItemModel,
    TabSummaryModel,
    Module,
} from "app/models";
import { AppErrorHandler } from "app/services";
import { Store } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import * as tabSummaryReducer from "app/state-management/store/reducer/tab-summary";
import * as moduleSettingReducer from "app/state-management/store/reducer/module-setting";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as dataEntryReducer from "app/state-management/store/reducer/data-entry";
import { BaseComponent } from "app/pages/private/base";
import isNil from "lodash-es/isNil";
import { Uti, String } from "app/utilities";

@Component({
    selector: "breadcrumb-master",
    styleUrls: ["./breadcrumb-master.component.scss"],
    templateUrl: "./breadcrumb-master.component.html",
})
export class BreadcrumbMasterComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private moduleDisplayNameKey: string;
    private moduleDisplayNameFormat: string;
    public breadcrumbItem: BreadcrumbModel = null;
    private tabIDLocal: string;

    private selectedEntityState: Observable<any>;
    private selectedEntityStateSubcription: Subscription;
    private selectedEntity: any;

    private moduleDisplayNameKeyState: Observable<string>;
    private moduleDisplayNameKeyStateSubcription: Subscription;

    private moduleDisplayNameFormatState: Observable<string>;
    private moduleDisplayNameFormatStateSubcription: Subscription;

    private selectedTabState: Observable<TabSummaryModel>;
    private selectedTabStateSubcription: Subscription;
    private selectedTab: TabSummaryModel;

    private selectedCampaignNumberState: Observable<any>;
    private selectedCampaignNumberStateSubcription: Subscription;

    private isViewModeState: Observable<any>;
    private isViewModeStateSubscription: Subscription;

    private formEditModeState: Observable<boolean>;
    private formEditModeStateSubscription: Subscription;

    @Input() set tabID(tabID: string) {
        this.tabIDLocal = tabID;

        if (this.tabIDLocal) {
            this.selectedCampaignNumberState = this.store.select(
                (state) =>
                    dataEntryReducer.getDataEntryState(state, this.tabIDLocal)
                        .selectedCampaignNumberData
            );
            this.subscribeSelectedCampaignNumberState();
        }
    }

    constructor(
        private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private ref: ChangeDetectorRef,
        protected router: Router
    ) {
        super(router);

        this.selectedEntityState = this.store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedEntity
        );
        this.selectedTabState = this.store.select(
            (state) =>
                tabSummaryReducer.getTabSummaryState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedTab
        );
        this.moduleDisplayNameKeyState = this.store.select(
            (state) =>
                moduleSettingReducer.getModuleSettingState(
                    state,
                    this.ofModule.moduleNameTrim
                ).moduleDisplayNameKey
        );
        this.moduleDisplayNameFormatState = this.store.select(
            (state) =>
                moduleSettingReducer.getModuleSettingState(
                    state,
                    this.ofModule.moduleNameTrim
                ).moduleDisplayNameFormat
        );
        this.isViewModeState = this.store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).isViewMode
        );
        this.formEditModeState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).formEditMode
        );
    }

    onRouteChanged() {
        this.buildModuleFromRoute();
        this.breadcrumbItem = null;
    }

    ngOnInit() {
        this.subscribe();
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private subscribe(): void {
        this.selectedEntityStateSubcription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (selectedEntityState) {
                        this.selectedEntity = selectedEntityState;
                        this.reupdateBreadcrumbItem(
                            this.moduleDisplayNameKey,
                            this.moduleDisplayNameFormat
                        );
                    } else {
                        this.selectedEntity = null;
                        this.breadcrumbItem = null;
                    }

                    this.ref.markForCheck();
                });
            });

        this.isViewModeStateSubscription = this.isViewModeState.subscribe(
            (selectedEditModeState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (selectedEditModeState == false) {
                        this.breadcrumbItem = null;
                    }
                });
            }
        );

        this.formEditModeStateSubscription = this.formEditModeState.subscribe(
            (formEditModeState: boolean) => {
                this.appErrorHandler.executeAction(() => {
                    if (formEditModeState) {
                        this.reupdateBreadcrumbItem(
                            this.moduleDisplayNameKey,
                            this.moduleDisplayNameFormat
                        );
                    }
                });
            }
        );

        this.selectedTabStateSubcription = this.selectedTabState.subscribe(
            (selectedTabState: TabSummaryModel) => {
                this.appErrorHandler.executeAction(() => {
                    if (!selectedTabState || !this.breadcrumbItem) return;

                    if (selectedTabState.tabSummaryInfor.isMainTab) {
                        this.breadcrumbItem.Child = null;
                    } else {
                        this.breadcrumbItem.Child = new BreadcrumbModel({
                            Name: selectedTabState.tabSummaryInfor.tabName,
                        });
                    }

                    this.ref.markForCheck();
                });
            }
        );

        this.moduleDisplayNameFormatStateSubcription =
            this.moduleDisplayNameFormatState.subscribe(
                (moduleDisplayNameFormat: string) => {
                    this.appErrorHandler.executeAction(() => {
                        this.moduleDisplayNameFormat = moduleDisplayNameFormat;
                    });
                }
            );

        this.moduleDisplayNameKeyStateSubcription =
            this.moduleDisplayNameKeyState.subscribe(
                (moduleDisplayNameKey: string) => {
                    this.appErrorHandler.executeAction(() => {
                        this.moduleDisplayNameKey = moduleDisplayNameKey;
                        this.reupdateBreadcrumbItem(
                            moduleDisplayNameKey,
                            this.moduleDisplayNameFormat
                        );
                    });
                }
            );
    }

    private subscribeSelectedCampaignNumberState() {
        if (this.selectedCampaignNumberStateSubcription) {
            this.selectedCampaignNumberStateSubcription.unsubscribe();
        }

        this.selectedCampaignNumberStateSubcription =
            this.selectedCampaignNumberState.subscribe(
                (campaignNumber: string) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!isNil(campaignNumber)) {
                            this.breadcrumbItem = new BreadcrumbModel({
                                Name: campaignNumber,
                                IsFirst: true,
                            });
                        } else {
                            this.breadcrumbItem = null;
                        }
                        this.ref.markForCheck();
                    });
                }
            );
    }

    private reupdateBreadcrumbItem(
        moduleDisplayNameKey: string,
        moduleDisplayNameFormat: string
    ): void {
        if (this.selectedEntity && moduleDisplayNameKey) {
            const propertyArray: Array<string> = [];

            const properties = moduleDisplayNameKey.split(",");
            for (var i = 0; i < properties.length; i++) {
                if (properties[i])
                    propertyArray.push(this.selectedEntity[properties[i]]);
            }

            if (propertyArray.length > 0) {
                if (moduleDisplayNameFormat) {
                    //Work around to work with String.Format
                    propertyArray.splice(0, 0, moduleDisplayNameFormat);
                    propertyArray.splice(1, 0, null);
                }
                if (this.breadcrumbItem == null) {
                    this.breadcrumbItem = new BreadcrumbModel({
                        Name: moduleDisplayNameFormat
                            ? String.Format.apply(this, propertyArray)
                            : propertyArray.join(" "),
                        IsFirst: true,
                    });
                } else {
                    this.breadcrumbItem.Name = moduleDisplayNameFormat
                        ? String.Format.apply(this, propertyArray)
                        : propertyArray.join(" ");
                }
                this.ref.markForCheck();
            }
        }
    }
}
