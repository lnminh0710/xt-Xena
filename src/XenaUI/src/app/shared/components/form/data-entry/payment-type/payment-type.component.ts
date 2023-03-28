import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonService, AppErrorHandler } from "app/services";
import { ComboBoxTypeConstant } from "app/app.constants";
import { GuidHelper } from "app/utilities/guild.helper";
import { Uti } from "app/utilities";
import { ApiResultResponse } from "app/models";
import { Subscription } from "rxjs/Subscription";

export class PaymentTabModel {
    id: string;
    title: string;
    active: boolean;
    removable?: boolean;
    paymentTypeId?: number;

    public constructor(data: any = {}) {
        this.id = data.id || "";
        this.title = data.title || "";
        this.active = data.active || false;
        this.removable = data.removable || true;
        this.paymentTypeId = data.paymentTypeId || null;
    }
}

@Component({
    selector: "payment-type",
    templateUrl: "./payment-type.component.html",
    styleUrls: ["./payment-type.component.scss"],
})
export class PaymentTypeComponent implements OnInit, OnDestroy {
    // Options for dropdown
    paymentTypeList: Array<any>;
    currencyList: Array<any>;
    creditCardList: Array<any>;
    private commonServiceSubscription: Subscription;
    public tabs: PaymentTabModel[] = [];

    /**
     * constructor
     * @param _eref
     * @param commonService
     */
    constructor(
        private commonService: CommonService,
        private appErrorHandler: AppErrorHandler
    ) {}

    /**
     * ngOnInit
     */
    public ngOnInit() {
        this.initData();
        this.addMorePaymentTab();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    /**
     * initData
     */
    private initData() {
        const keys: Array<number> = [
            ComboBoxTypeConstant.invoicePaymentType,
            ComboBoxTypeConstant.currency,
            ComboBoxTypeConstant.creditCardType,
        ];

        this.commonServiceSubscription = this.commonService
            .getListComboBox(keys.join(","))
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    this.paymentTypeList = Uti.getValidCombobox(
                        response.item,
                        ComboBoxTypeConstant.invoicePaymentType
                    );
                    this.currencyList = Uti.getValidCombobox(
                        response.item,
                        ComboBoxTypeConstant.currency
                    );
                    this.creditCardList = Uti.getValidCombobox(
                        response.item,
                        ComboBoxTypeConstant.creditCardType
                    );
                });
            });
    }

    /**
     * changePaymentType
     * @param event
     */
    public changePaymentType(option) {
        const activeTab = this.tabs.find((p) => p.active);
        if (activeTab) {
            activeTab.title = option.value;
            activeTab.paymentTypeId = option.key;
            activeTab.id = GuidHelper.generateGUID();
        }
        this.updateStatusPaymentType();
    }

    /**
     * selectPayment
     * @param tab
     * @param event
     */
    selectPaymentTab(tab: PaymentTabModel, event) {
        const activeTabs = this.tabs.filter((p) => p.active);
        activeTabs.forEach((t) => {
            t.active = false;
        });
        tab.active = true;
    }

    /**
     * addMorePaymentTab
     */
    addMorePaymentTab() {
        const activeTabs = this.tabs.filter((p) => p.active);
        activeTabs.forEach((tab) => {
            tab.active = false;
        });

        const emptyTab = this.tabs.find((p) => p.id == GuidHelper.EMPTY_GUID);
        if (!emptyTab) {
            this.tabs.push(
                new PaymentTabModel({
                    id: GuidHelper.EMPTY_GUID,
                    title: "Payment 1",
                    active: true,
                })
            );
        } else {
            emptyTab.active = true;
        }
    }

    /**
     * removePaymentType
     */
    removePaymentType(tab: PaymentTabModel, event) {
        this.tabs = this.tabs.filter((p) => p.id != tab.id);
        if (this.tabs && this.tabs.length) {
            this.tabs[0].active = true;
        } else {
            this.addMorePaymentTab();
        }
        this.updateStatusPaymentType();
    }

    /**
     * updateStatusPaymentType
     */
    private updateStatusPaymentType() {
        if (!this.tabs || !this.paymentTypeList) {
            return;
        }

        this.paymentTypeList.forEach((paymentType) => {
            if (paymentType) {
                paymentType.disabled = false;
            }
        });

        this.tabs.forEach((tab) => {
            const option = this.paymentTypeList.find(
                (p) => p.key == tab.paymentTypeId
            );
            if (option && option.key != 2) {
                option.disabled = true;
            }
        });
    }
}
