import {
    Component,
    Input,
    Output,
    OnInit,
    OnDestroy,
    AfterViewInit,
    EventEmitter,
    Injector,
} from "@angular/core";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { FormBase } from "app/shared/components/form/form-base";
import { Validators } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { Uti } from "app/utilities";
import { CommonService, PropertyPanelService } from "app/services";
import { ComboBoxTypeConstant } from "app/app.constants";
import { ApiResultResponse } from "app/models";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import * as propertyPanelReducer from "app/state-management/store/reducer/property-panel";
import { ModuleList } from "app/pages/private/base";

@Component({
    selector: "purchase-form-header",
    styleUrls: ["./purchase-form-header.component.scss"],
    templateUrl: "./purchase-form-header.component.html",
})
export class PurchaseFormHeaderComponent
    extends FormBase
    implements OnInit, OnDestroy, AfterViewInit
{
    public maxCharactersNotes = this.consts.noteLengthDefault;
    public listComboBox: any = {};
    public purchaseId: any = "123456789"; // TODO: will add data for this property
    public date: any = "2018/05/20"; // TODO: will add data for this property
    public dontShowCalendarWhenFocus: boolean;
    @Input() set globalProperties(globalProperties: any[]) {
        this.globalDateFormat =
            this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                globalProperties
            );
        this.dontShowCalendarWhenFocus =
            this.propertyPanelService.getValueDropdownFromGlobalProperties(
                globalProperties
            );
    }

    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @Output() saveData: EventEmitter<any> = new EventEmitter();

    private commonServiceSubscription: Subscription;
    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;

    constructor(
        private commonService: CommonService,
        private store: Store<AppState>,
        private propertyPanelService: PropertyPanelService,
        protected toasterService: ToasterService,
        protected router: Router,
        protected injector: Injector,
        private uti: Uti
    ) {
        super(injector, router);
        this.globalPropertiesState = store.select(
            (state) =>
                propertyPanelReducer.getPropertyPanelState(
                    state,
                    ModuleList.Base.moduleNameTrim
                ).globalProperties
        );
    }

    public ngOnInit() {
        this.initFormData();
        this.getDataForCombobox();
        this.subscribeGlobalProperties();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    /**
     * ngAfterViewInit
     */
    public ngAfterViewInit() {}

    public isDirty(): boolean {
        return this.formGroup.dirty;
    }

    public isValid(): boolean {
        return this.formGroup.valid;
    }

    public submit(event?: any) {
        this.callSubmit();
        if (!this.isValid()) {
            // TODO: get data to save.
            this.outputData.emit({
                submitResult: false,
                isValid: false,
            });
        }
    }

    public prepareSubmitData(): any {
        return {};
    }

    protected updateLeftCharacters(event) {
        setTimeout(() => {
            this.formGroup["leftCharacters"] =
                this.maxCharactersNotes - event.target.value.length;
        });
    }

    private initFormData() {
        this.initForm({
            supplier: ["", Validators.required],
            gender: ["", Validators.required],
            warehouse: ["", Validators.required],
            currency: ["", Validators.required],
            neededDeliveryDate: "",
            estimatedDeliveryDate: "",
            notes: ["", Validators.maxLength(this.maxCharactersNotes)],
        });
    }

    private getDataForCombobox() {
        this.commonServiceSubscription = this.commonService
            .getListComboBox(
                ComboBoxTypeConstant.principal +
                    "," +
                    ComboBoxTypeConstant.currency +
                    "," +
                    ComboBoxTypeConstant.wareHouse
            )
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.wareHouse
                    ) {
                        return;
                    }
                    this.listComboBox = response.item;
                    this.createFakeDatForCombobox();
                    this.isRenderForm = true;
                });
            });
    }

    private createFakeDatForCombobox() {
        this.listComboBox.supplier = [
            {
                idValue: -1,
                textValue: "",
            },
            {
                idValue: 1,
                textValue: "Intel",
            },
            {
                idValue: 2,
                textValue: "IBM",
            },
        ];
    }

    subscribeGlobalProperties() {
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

    formatDate(data: any, formatPattern: string) {
        const result = !data
            ? ""
            : this.uti.formatLocale(new Date(data), formatPattern);
        return result;
    }
}
