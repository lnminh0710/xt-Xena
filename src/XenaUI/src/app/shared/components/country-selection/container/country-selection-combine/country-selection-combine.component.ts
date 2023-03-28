import {
    Component,
    Output,
    Input,
    EventEmitter,
    OnInit,
    OnDestroy,
    AfterViewInit,
    ViewChild,
    ChangeDetectorRef,
    ElementRef,
} from "@angular/core";
import { ApiResultResponse } from "app/models";
import { MenuModuleId } from "app/app.constants";
import {
    CommonService,
    AppErrorHandler,
    CountrySelectionService,
} from "app/services";
import { Uti } from "app/utilities";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import isObject from "lodash-es/isObject";
import camelCase from "lodash-es/camelCase";
import isNil from "lodash-es/isNil";
import uniqBy from "lodash-es/uniqBy";
import {
    ProcessDataActions,
    CustomAction,
} from "app/state-management/store/actions";
import { SelCountrySelectionHeaderComponent } from "app/shared/components/country-selection";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import * as moduleSettingReducer from "app/state-management/store/reducer/module-setting";

@Component({
    selector: "sel-country-selection-combine",
    styleUrls: ["./country-selection-combine.component.scss"],
    templateUrl: "./country-selection-combine.component.html",
})
export class SelCountrySelectionCombineComponent
    extends BaseComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public selectedCountryData: any;
    public countryCheckListData: any = [];
    public perfectScrollbarConfig: any = {};

    private widgetListenKey = null;
    private selectedEntity: any = null;
    private cachingTableFirstData = [];
    private outputModel: any;
    private isDirty = false;
    private isValid = false;
    private cachingEditedData = [];

    private countrySelectionServiceSubscription: Subscription;
    private selectedEntityStateSubscription: Subscription;
    private widgetListenKeyStateSubscription: Subscription;
    private requestSaveWidgetStateSubscription: Subscription;

    private selectedEntityState: Observable<any>;
    private widgetListenKeyState: Observable<string>;
    private requestSaveWidgetState: Observable<any>;

    // We have two mode
    // 1. Campaign
    // 2. Broker
    @Input() mode: any;
    @Input() isEdit: boolean = true;
    @Input() globalProperties: any;

    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @Output() formChange: EventEmitter<any> = new EventEmitter();
    @Output() onSaveSuccess = new EventEmitter<any>();

    @ViewChild("countrySelectionHeader")
    countrySelectionHeader: SelCountrySelectionHeaderComponent;

    constructor(
        protected store: Store<AppState>,
        private _eref: ElementRef,
        private appErrorHandler: AppErrorHandler,
        private commonService: CommonService,
        private processDataActions: ProcessDataActions,
        private countrySelectionService: CountrySelectionService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        super(router);

        this.selectedEntityState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedEntity
        );
        this.widgetListenKeyState = store.select(
            (state) =>
                moduleSettingReducer.getModuleSettingState(
                    state,
                    this.ofModule.moduleNameTrim
                ).widgetListenKey
        );
    }

    public ngOnInit() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false,
        };

        this.subscribeWidgetListenKeyState();
        this.subscribeSelectedEntityState();
        this.subscribeRequestSaveWidgetState();
    }

    public ngAfterViewInit() {
        this.selectedCountryData = {
            columns: this.createGridColumn(),
            data: [],
        };
        //this.getDropdownlistData();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public countryDataOutput($event: any) {
        this.selectedCountryData = this.buildGirdData($event);
        this.isDirty = true;
        this.isValid = true;
        this.setOutputData(null);

        this.changeDetectorRef.detectChanges();
    }

    public onFooterItemEdited($event: any) {
        const currentItem = this.cachingEditedData.find(
            (x) => x.Country == $event.Country
        );
        if (currentItem && currentItem.Country) {
            Uti.removeItemInArray(
                this.cachingEditedData,
                currentItem,
                "Country"
            );
        }
        this.cachingEditedData.push($event);
        this.formChange.emit(true);

        this.changeDetectorRef.detectChanges();
    }

    public onFormChange($event) {
        this.formChange.emit(true);
    }

    private subscribeWidgetListenKeyState() {
        this.widgetListenKeyStateSubscription =
            this.widgetListenKeyState.subscribe(
                (widgetListenKeyState: string) => {
                    this.appErrorHandler.executeAction(() => {
                        this.widgetListenKey = widgetListenKeyState;

                        this.changeDetectorRef.detectChanges();
                    });
                }
            );
    }

    private subscribeRequestSaveWidgetState() {
        this.requestSaveWidgetStateSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE_WIDGET &&
                    action.module.idSettingsGUI ==
                        this.ofModule.idSettingsGUI &&
                    this._eref.nativeElement.offsetParent != null
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.submit();
                });
            });
    }

    private subscribeSelectedEntityState() {
        this.selectedEntityStateSubscription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        isEmpty(selectedEntityState) &&
                        !isEmpty(this.selectedEntity)
                    ) {
                        this.selectedEntity = null;

                        this.changeDetectorRef.detectChanges();
                        return;
                    }

                    if (isEqual(this.selectedEntity, selectedEntityState)) {
                        return;
                    }

                    this.selectedEntity = selectedEntityState;
                    this.cachingEditedData = [];

                    this.getDropdownlistData();

                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    private removeDuplicates(arr, prop) {
        var obj = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            if (!obj[arr[i][prop]]) obj[arr[i][prop]] = arr[i];
        }
        var newArr = [];
        for (var key in obj) newArr.push(obj[key]);
        return newArr;
    }

    private getDropdownlistData() {
        this.countrySelectionServiceSubscription = this.countrySelectionService
            .getSelectionProjectCountry(
                this.selectedEntity[camelCase(this.widgetListenKey)]
            )
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.length ||
                        isNil(response.item[1])
                    ) {
                        return;
                    }
                    response.item[1] = uniqBy(
                        response.item[1],
                        "IdCountrylanguage"
                    );
                    response.item[1] = response.item[1].filter((item) => {
                        return typeof item.IdCountrylanguage !== "object";
                    });

                    this.countryCheckListData = response.item[1].map(
                        (currentValue, index, arr) => {
                            let culture = currentValue.Culture.split("-");
                            return {
                                idValue: currentValue.IdCountrylanguage,
                                idSelectionProjectCountry: isObject(
                                    currentValue.IdSelectionProjectCountry
                                )
                                    ? ""
                                    : currentValue.IdSelectionProjectCountry,
                                qtyToNeeded: isObject(currentValue.QtyToNeeded)
                                    ? ""
                                    : currentValue.QtyToNeeded,
                                Language: isObject(currentValue.Language)
                                    ? ""
                                    : currentValue.Language,
                                MediaCode: isObject(currentValue.MediaCode)
                                    ? ""
                                    : currentValue.MediaCode,
                                QtyFoundet: isObject(currentValue.QtyFoundet)
                                    ? ""
                                    : currentValue.QtyFoundet,
                                QtyUsed: isObject(currentValue.QtyUsed)
                                    ? ""
                                    : currentValue.QtyUsed,
                                isoCode: culture[1],
                                culture: currentValue.Culture,
                                textValue:
                                    currentValue.Country + "-" + culture[0],
                                isMain: true,
                                isActive:
                                    typeof currentValue.IsActive === "object"
                                        ? false
                                        : currentValue.IsActive,
                            };
                        }
                    );

                    this.cachingTableFirstData = cloneDeep(
                        this.countryCheckListData
                    );
                    this.selectedCountryData = this.buildGirdData(
                        this.countryCheckListData
                    );

                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    public submit(callback?: any): any {
        const savingData = [
            ...this.makeInsertData(),
            ...this.makeDeleteData(),
            ...this.makeUpdateData(),
        ];
        if (!savingData || !savingData.length) {
            this.setOutputData(false);
            return;
        }
        this.countrySelectionServiceSubscription = this.countrySelectionService
            .saveProjectCountry(savingData)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    // reload data
                    this.getDropdownlistData();
                    this.setOutputData(true, response.item.returnID);
                    if (callback) {
                        callback();
                    }
                    this.store.dispatch(
                        this.processDataActions.saveWidgetSuccess(this.ofModule)
                    );

                    this.onSaveSuccess.emit();

                    this.store.dispatch(
                        this.processDataActions.selectionCountriesAreUpdated(
                            this.ofModule
                        )
                    );

                    this.changeDetectorRef.detectChanges();
                });
            });
    }

    public reload() {
        this.cachingTableFirstData = [];
        this.selectedCountryData = {
            data: [],
            columns: this.selectedCountryData.columns,
        };
        this.countryCheckListData = [];
        this.isDirty = false;
        this.isValid = false;
        this.cachingEditedData = [];
        this.getDropdownlistData();
        if (this.countrySelectionHeader)
            this.countrySelectionHeader.reloadData();

        this.changeDetectorRef.detectChanges();
    }

    private setOutputData(submitResult: any, returnID?: any) {
        this.setValueForOutputModel(submitResult, returnID);
        this.outputData.emit(this.outputModel);
    }

    private setValueForOutputModel(submitResult: any, returnID?: any) {
        this.outputModel = {
            submitResult: submitResult,
            formValue: {},
            isValid: this.checkFormValid(),
            isDirty: this.checkFormDirty(),
            returnID: returnID,
        };
    }

    private checkFormValid() {
        return this.isValid;
    }

    private checkFormDirty() {
        return this.isDirty;
    }

    private makeInsertData(): Array<any> {
        let result = [];
        for (let item of this.selectedCountryData.data) {
            if (!item.isActiveDisableRow || item.idSelectionProjectCountry)
                continue;
            result.push({
                IsActive: 1,
                IdRepCountryLangauge: item.IdRepCountryLangauge,
                IdSelectionProject: this.selectedEntity["idSelectionProject"],
                QtyToNeeded: item.ReqAddress,
            });
        }
        return result;
    }

    private makeUpdateData(): Array<any> {
        let result = [];
        for (let item of this.selectedCountryData.data) {
            if (!item.isActiveDisableRow || !item.idSelectionProjectCountry)
                continue;
            let currentItem = this.cachingTableFirstData.find(
                (x) =>
                    x.idSelectionProjectCountry ===
                    item.idSelectionProjectCountry
            );
            if (
                (isObject(currentItem.qtyToNeeded) || !currentItem.qtyToNeeded
                    ? ""
                    : currentItem.qtyToNeeded) ===
                (isObject(item.ReqAddress) || !item.ReqAddress
                    ? ""
                    : item.ReqAddress)
            )
                continue;
            result.push({
                IsActive: 1,
                IdRepCountryLangauge: item.IdRepCountryLangauge,
                IdSelectionProject: this.selectedEntity["idSelectionProject"],
                QtyToNeeded: item.ReqAddress,
                IdSelectionProjectCountry: item.idSelectionProjectCountry,
            });
        }
        return result;
    }

    private makeDeleteData(): Array<any> {
        let result = [];
        for (let item of this.cachingTableFirstData) {
            if (!item.isActive || !item.idSelectionProjectCountry) continue;
            let currentItem = this.selectedCountryData.data.find(
                (x) =>
                    x.idSelectionProjectCountry ===
                    item.idSelectionProjectCountry
            );
            if (
                currentItem &&
                (currentItem.isActiveDisableRow ||
                    !currentItem.idSelectionProjectCountry)
            )
                continue;
            result.push({
                IsDeleted: "1",
                IdSelectionProjectCountry: item.idSelectionProjectCountry,
            });
        }
        return result;
    }

    private buildGirdData(rawData: any) {
        let selectData = cloneDeep(rawData);
        if (this.mode === MenuModuleId.selectionBroker) {
            selectData = selectData.filter((x) => {
                return x.isActive;
            });
        }

        let data = [];
        if (!selectData || !selectData.length) {
            return {
                columns: this.createGridColumn(),
                data: [],
            };
        }
        for (let item of selectData) {
            data.push({
                idSelectionProjectCountry: item.idSelectionProjectCountry,
                IdRepCountryLangauge: item.idValue,
                Country: item.isoCode + "," + item.textValue,
                Language: item.Language,
                QuantityFounded: item.QtyFoundet,
                QuantityUsed: item.QtyToNeeded,
                ReqAddress: item.qtyToNeeded,
                isActiveDisableRow: !!item.isActive,
            });
        }
        data = this.setEditedData(data);
        return {
            columns: this.createGridColumn(),
            data: data,
        };
    }

    private setEditedData(data: any): any {
        if (!this.cachingEditedData || !this.cachingEditedData.length)
            return data;
        for (let item of this.cachingEditedData) {
            let currentItem = data.find((x) => x.Country == item.Country);
            if (currentItem && currentItem.Country) {
                if (currentItem.isActiveDisableRow)
                    currentItem.ReqAddress = item.ReqAddress;
                else item.ReqAddress = "";
            }
        }
        return data;
    }

    private createGridColumn(): any {
        return [
            {
                title: "idSelectionProjectCountry",
                data: "idSelectionProjectCountry",
                visible: false,
                readOnly: true,
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                Hidden: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "Country",
                data: "Country",
                visible: true,
                readOnly: true,
                setting: {
                    Setting: [
                        {
                            ControlType: {
                                Type: "CountryFlag",
                            },
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "Language",
                data: "Language",
                visible: true,
                readOnly: true,
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "Req.Addresses",
                data: "ReqAddress",
                visible: true,
                readOnly: false,
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "0",
                            },
                            ControlType: {
                                Type: "Numeric",
                            },
                        },
                    ],
                },
            },
            {
                title: "Qty.Founded",
                data: "QuantityFounded",
                visible: true,
                readOnly: true,
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "Qty.Used",
                data: "QuantityUsed",
                visible: true,
                readOnly: true,
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                ReadOnly: "1",
                            },
                        },
                    ],
                },
            },
            {
                title: "isActiveDisableRow",
                data: "isActiveDisableRow",
                visible: false,
                readOnly: true,
                setting: {
                    Setting: [
                        {
                            DisplayField: {
                                Hidden: "1",
                            },
                        },
                    ],
                },
            },
        ];
    }
}
