import { Router, NavigationEnd } from "@angular/router";
import { Module } from "app/models";
import { Uti } from "app/utilities";
import { OnInit } from "@angular/core";
import { Observable, ReplaySubject, Subscription } from "rxjs";

export class ModuleList {
    static Base = new Module({ idSettingsGUI: -1, moduleName: "Base" });
    static Dashboard = new Module({
        idSettingsGUI: 42,
        moduleName: "Dashboard",
        iconName: "fa-linode",
    });
    static Administration = new Module({
        idSettingsGUI: 1,
        moduleName: "Administration",
        iconName: "fa-user-secret",
    });
    static Customer = new Module({
        idSettingsGUI: 2,
        moduleName: "Customer",
        iconName: "fa-users",
        isCanNew: true,
        searchIndexKey: "customer",
    });
    static Article = new Module({
        idSettingsGUI: 3,
        moduleName: "Article",
        iconName: "fa-newspaper-o",
        isCanNew: true,
        searchIndexKey: "article",
    });
    static Campaign = new Module({
        idSettingsGUI: 4,
        moduleName: "Campaign",
        iconName: "fa-umbrella",
        isCanNew: true,
        searchIndexKey: "campaign",
    });

    static Backoffice = new Module({
        idSettingsGUI: 5,
        moduleName: "Backoffice",
        iconName: "fa-calendar",
    });
    static BlockedOrder = new Module({
        idSettingsGUI: 24,
        moduleName: "Blocked Order",
        iconName: "fa-ban",
        idSettingsGUIParent: 5,
    });
    static DataExport = new Module({
        idSettingsGUI: 25,
        moduleName: "Data Export",
        iconName: "fa-mail-reply-all",
        idSettingsGUIParent: 5,
    });
    static Doublette = new Module({
        idSettingsGUI: 26,
        moduleName: "Doublette",
        iconName: "fa-clone",
        idSettingsGUIParent: 5,
    });
    static Logistic = new Module({
        idSettingsGUI: 27,
        moduleName: "Logistic",
        iconName: "fa-truck",
        idSettingsGUIParent: 5,
    });
    static MailingReturn = new Module({
        idSettingsGUI: 43,
        moduleName: "Mailing Return",
        iconName: "fa-wrench",
        idSettingsGUIParent: 5,
    });
    static Purchase = new Module({
        idSettingsGUI: 30,
        moduleName: "Purchase",
        iconName: "fa-money",
        idSettingsGUIParent: 27,
        searchIndexKey: "purchase",
    });
    static StockCorrection = new Module({
        idSettingsGUI: 31,
        moduleName: "Stock Correction",
        iconName: "fa-line-chart",
        idSettingsGUIParent: 27,
        searchIndexKey: "stockcorrection",
    });
    static WarehouseMovement = new Module({
        idSettingsGUI: 32,
        moduleName: "Warehouse Movement",
        iconName: "fa-home",
        idSettingsGUIParent: 27,
        searchIndexKey: "warehousemovement",
    });
    static PrintAutoLetter = new Module({
        idSettingsGUI: 49,
        moduleName: "Print Auto Letter",
        iconName: "fa-print",
        idSettingsGUIParent: 5,
        searchIndexKey: "",
    });

    static BusinessCosts = new Module({
        idSettingsGUI: 6,
        moduleName: "Business Costs",
        iconName: "fa-calculator",
        isCanNew: true,
        searchIndexKey: "businesscosts",
    });
    static OrderDataEntry = new Module({
        idSettingsGUI: 7,
        moduleName: "Order Data Entry",
        iconName: "fa-list-alt",
    });
    static Statistic = new Module({
        idSettingsGUI: 8,
        moduleName: "Statistic",
        iconName: "fa-bar-chart-o",
    });
    static StatistisReport = new Module({
        idSettingsGUI: 39,
        moduleName: "Statistis Report",
        iconName: "fa-bar-chart-o",
        idSettingsGUIParent: 8,
    });

    // The module name will be replace spacing and bring to compare with name of table B00SettingsModule with LayoutSetting row.
    // So must be careful with the moduleName

    static Tools = new Module({
        idSettingsGUI: 9,
        moduleName: "Tools",
        iconName: "fa-wrench",
    });
    static TracksSetup = new Module({
        idSettingsGUI: 35,
        moduleName: "Tracks Setup",
        iconName: "fa-random",
        idSettingsGUIParent: 9,
    });
    static ScanManagement = new Module({
        idSettingsGUI: 36,
        moduleName: "Scan Management",
        iconName: "fa-print",
        idSettingsGUIParent: 9,
    });
    static DoubletCheckTool = new Module({
        idSettingsGUI: 37,
        moduleName: "Doublet Check Tool",
        iconName: "fa-check-circle-o",
        idSettingsGUIParent: 9,
    });
    static ToolsAddOn = new Module({
        idSettingsGUI: 40,
        moduleName: "Tools Add On",
        iconName: "fa-plus-circle",
        idSettingsGUIParent: 9,
    });
    static CampaignAddOn = new Module({
        idSettingsGUI: 41,
        moduleName: "Campaign Add On",
        iconName: "fa-umbrela",
        idSettingsGUIParent: 9,
    });
    static Export = new Module({
        idSettingsGUI: 44,
        moduleName: "Export",
        iconName: "fa-database",
        idSettingsGUIParent: 9,
    });
    static SavLetter = new Module({
        idSettingsGUI: 48,
        moduleName: "Sav Letter",
        iconName: "fa-envelope-open",
        idSettingsGUIParent: 9,
    });

    static Selection = new Module({
        idSettingsGUI: 10,
        moduleName: "Selection",
        iconName: "fa-check-square-o",
    });
    static CampaignSelection = new Module({
        idSettingsGUI: 97,
        moduleName: "Campaign Selection",
        iconName: "fa-umbrella",
    });
    static ArchivedCampaign = new Module({
        idSettingsGUI: 100,
        moduleName: "Archived Campaign",
        iconName: "fa-umbrella",
    });
    static BrokerSelection = new Module({
        idSettingsGUI: 98,
        moduleName: "Broker Selection",
        iconName: "fa-exchange",
    });
    static CollectSelection = new Module({
        idSettingsGUI: 99,
        moduleName: "Collect Selection",
        iconName: "fa-newspaper-o",
    });

    static Orders = new Module({
        idSettingsGUI: 28,
        moduleName: "Orders",
        iconName: "fa-shopping-cart",
        idSettingsGUIParent: 5,
        searchIndexKey: "orders",
    });
    static ReturnRefund = new Module({
        idSettingsGUI: 29,
        moduleName: "Return & Refund",
        iconName: "fa-exchange",
        idSettingsGUIParent: 5,
        searchIndexKey: "returnrefund",
    });
    static ReminderLogic = new Module({
        idSettingsGUI: 45,
        moduleName: "Reminder Logic",
        iconName: "fa-bell",
        idSettingsGUIParent: 5,
        searchIndexKey: "reminderlogic",
    });
    static InvoicePayment = new Module({
        idSettingsGUI: 47,
        moduleName: "Invoice Payment",
        iconName: "fa-usd",
        idSettingsGUIParent: 5,
        searchIndexKey: "invoicepayment",
    });
    static SystemManagement = new Module({
        idSettingsGUI: 38,
        moduleName: "System Management",
        iconName: "fa-cog",
    });
    static MailingData = new Module({
        idSettingsGUI: 46,
        moduleName: "MailingData",
        iconName: "fa-envelope-o",
    });
}

/**
 * BaseComponent
 */
export abstract class BaseComponent implements OnInit {
    private _subscriptions: Subscription[] = [];
    protected _unsubscribedNotifer$: ReplaySubject<boolean> =
        new ReplaySubject<boolean>();

    protected ofModule: Module;
    protected onRouteChanged() {}
    protected overrideDefaultModule() {}

    constructor(protected router: Router) {
        this.buildModuleFromRoute();

        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.onRouteChanged();
            }
        });
    }

    ngOnInit() {
        this.overrideDefaultModule();
    }

    protected buildModuleFromRoute() {
        if (this.router && this.router.url) {
            let routerUrl: string = this.router.url;
            if (Uti.isRootUrl(routerUrl)) {
                this.ofModule = ModuleList.Base;
            } else {
                let moduleName: any = routerUrl.substring(1, routerUrl.length);
                moduleName = moduleName.split("/");
                if (moduleName.length > 2) moduleName = moduleName[2];
                else if (moduleName.length > 1) moduleName = moduleName[1];
                else moduleName = moduleName[0];

                this.ofModule = ModuleList[moduleName] || ModuleList.Base;
            }
        }
    }

    protected getCurrentModule() {
        if (this.router && this.router.url) {
            let routerUrl: string = this.router.url;
            if (Uti.isRootUrl(routerUrl)) {
                return ModuleList.Base;
            } else {
                let moduleName: any = routerUrl.substring(1, routerUrl.length);
                moduleName = moduleName.split("/");
                if (moduleName.length > 2) moduleName = moduleName[2];
                else if (moduleName.length > 1) moduleName = moduleName[1];
                else moduleName = moduleName[0];

                return ModuleList[moduleName] || ModuleList.Base;
            }
        }

        return null;
    }

    protected registerSubscriptionsToAutomaticallyUnsubscribe(
        ...subscriptions: Subscription[]
    ) {
        if (!subscriptions) return;

        for (let i = 0; i < subscriptions.length; i++) {
            this._subscriptions.push(subscriptions[i]);
        }
    }

    protected getUnsubscriberNotifier(): Observable<any> {
        return this._unsubscribedNotifer$.asObservable();
    }

    protected unsubscribeFromNotifier() {
        this._unsubscribedNotifer$.next(true);
        this._unsubscribedNotifer$.complete();
    }

    protected onDestroy() {
        if (this._subscriptions && this._subscriptions.length) {
            this._subscriptions.forEach((subscription) =>
                subscription.unsubscribe()
            );
        }

        this.unsubscribeFromNotifier();
    }
}
