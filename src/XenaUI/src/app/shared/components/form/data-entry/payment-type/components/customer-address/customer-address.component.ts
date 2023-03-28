import {
    Component,
    OnInit,
    OnDestroy,
    Output,
    EventEmitter,
    Input,
} from "@angular/core";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { Router } from "@angular/router";
import { AppState } from "app/state-management/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { AppErrorHandler, PropertyPanelService } from "app/services";
import { DatePipe } from "@angular/common";
import cloneDeep from "lodash-es/cloneDeep";
import {
    FormOutputModel,
    OrderDataEntryCustomerAddressModel,
    WidgetPropertyModel,
} from "app/models";
import { AddressFormatConstant, Configuration } from "app/app.constants";
import {
    XnCommonActions,
    CustomAction,
} from "app/state-management/store/actions";
import { ModuleList } from "app/pages/private/base";
import { DataEntryFormBase } from "app/shared/components/form/data-entry/data-entry-form-base";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";
import * as dataEntryReducer from "app/state-management/store/reducer/data-entry";
import { Uti } from "app/utilities";
import { format } from "date-fns";

@Component({
    selector: "data-entry-customer-address",
    templateUrl: "./customer-address.component.html",
    styleUrls: ["./customer-address.component.scss"],
})
export class DataEntryCustomerAddressComponent
    extends DataEntryFormBase
    implements OnInit, OnDestroy
{
    private globalProperties: any;
    private customerDataState: Observable<any>;
    private customerDataStateSubscription: Subscription;
    private dispatcherSubscription: Subscription;
    private addressFormatTemplate: string;
    private globalPropertiesState: Observable<any>;
    private globalPropertiesStateSubscription: Subscription;
    public data: any = this.createEmptyData();
    public addressFormat: string;

    @Input() tabID: string;

    public globalDateFormat = "";
    @Output() outputData: EventEmitter<FormOutputModel> = new EventEmitter();

    constructor(
        private appErrorHandler: AppErrorHandler,
        private datePipe: DatePipe,
        private dispatcher: ReducerManagerDispatcher,
        private store: Store<AppState>,
        private propertyPanelService: PropertyPanelService,
        protected router: Router,
        private consts: Configuration,
        private uti: Uti
    ) {
        super(router, {
            defaultTranslateText: "customerAddressData",
            emptyData: new OrderDataEntryCustomerAddressModel(),
        });
        this.customerDataState = this.store.select(
            (state) =>
                dataEntryReducer.getDataEntryState(state, this.tabID)
                    .customerData
        );
        this.globalPropertiesState = store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
        this.subscription();
        this.subscribeGlobalProperties();
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    /**
     * buildAddressTemplateData
     */
    private buildAddressTemplateData(
        addressData: any,
        addressTemplate: string
    ) {
        let address: string = addressTemplate;
        Object.keys(AddressFormatConstant).forEach((key) => {
            const value: string = addressData[key] ? addressData[key] : "";
            address = address.replace(
                new RegExp("#" + AddressFormatConstant[key] + "#;", "gi"),
                value.toUpperCase()
            );
        });
        address = address.replace(new RegExp("\\\\n", "g"), "<div></div>");
        address = address.replace(new RegExp("\\\\s", "g"), " ");

        //Replace keys not exists in AddressFormatConstant -> empty
        address = address.replace(new RegExp("#((.|\n)*?)#;", "g"), "");

        return address;
    }

    private subscription() {
        this.customerDataStateSubscription = this.customerDataState.subscribe(
            (response) => {
                this.appErrorHandler.executeAction(() => {
                    if (!response || !response.formValue) {
                        this.data = this.createEmptyData();
                        return;
                    }

                    if (this.data == response.formValue) return;

                    let dateOfBirth: any = "";
                    try {
                        dateOfBirth = this.datePipe.transform(
                            response.formValue.dateOfBirth,
                            this.consts.dateFormatInDataBase
                        );
                    } catch (ex) {}
                    const tempData = cloneDeep(response.formValue);
                    tempData.birthDay = dateOfBirth;
                    if (!response.formValue.address) {
                        tempData.address = this.createEmptyAddress();
                    }

                    this.data = tempData;

                    const template = this.addressFormatTemplate
                        ? this.addressFormatTemplate
                        : this.data.addressFormat;
                    if (template) {
                        this.buildAddressFormat(this.data, template);
                        this.buildDateOfBirthFormat();
                    }
                });
            }
        );

        this.dispatcherSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === XnCommonActions.CHANGE_COUNTRY_CODE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe((countryData: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        this.data &&
                        countryData &&
                        countryData.payload &&
                        countryData.payload.addressFormat
                    ) {
                        this.addressFormatTemplate =
                            countryData.payload.addressFormat;
                        this.buildAddressFormat(
                            this.data,
                            this.addressFormatTemplate
                        );
                    }
                });
            });
    }

    /**
     * buildAddressFormat
     * @param data
     * @param templateAddress
     */
    private buildAddressFormat(data: any, templateAddress: string) {
        const address = data.address;
        this.addressFormat = this.buildAddressTemplateData(
            {
                Street: address.street,
                StreetNr: address.streetNr,
                Addition: "",
                CountryAddition: "",
                NameAddition: data.nameAddition,
                StreetAddition1: address.streetAddition1,
                StreetAddition2: address.streetAddition2,
                StreetAddition3: "",
                PoboxLabel: address.poboxLabel,
                POBOX: "",
                Place: address.place,
                Area: address.area,
                Zip: address.zip,
                Zip2: "",
                CountryCode: data.countryCode,
            },
            templateAddress
        );
    }

    /**
     * buildDateOfBirthFormat
     **/
    private buildDateOfBirthFormat() {
        if (!this.globalProperties) {
            return;
        }
        let supportDOBCountryFormat: boolean;
        let propDOBFormatByCountry: WidgetPropertyModel =
            this.propertyPanelService.getItemRecursive(
                this.globalProperties,
                "DOBFormatByCountry"
            );
        if (propDOBFormatByCountry) {
            supportDOBCountryFormat = propDOBFormatByCountry.value;
        }
        if (supportDOBCountryFormat && this.data && this.data.isoCode) {
            this.globalDateFormat = Uti.getDateFormatFromIsoCode(
                this.data.isoCode
            );
        } else {
            this.globalDateFormat =
                this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                    this.globalProperties
                );
        }
    }

    private createEmptyData() {
        return {
            title: "",
            firstName: "",
            lastName: "",
            countryCode: "",
            birthDay: "",
            address: this.createEmptyAddress(),
        };
    }

    private createEmptyAddress() {
        return {
            streetNr: "",
            street: "",
            zip: "",
            place: "",
            area: "",
        };
    }

    public rebuildTranslateText() {}

    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription =
            this.globalPropertiesState.subscribe((globalProperties: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (globalProperties) {
                        this.globalProperties = globalProperties;
                        this.buildDateOfBirthFormat();
                    }
                });
            });
    }

    formatDate(data: any, formatPattern: string) {
        const result = !data
            ? ""
            : this.uti.formatLocale(new Date(data), formatPattern);
        return result;
    }
}
