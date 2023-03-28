import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CanActivateGuard, UnsavedModulesGuard } from "app/services";
import { PrivateComponent } from "./private.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PrivateLoadResolve } from "./private-load.resolve";

const PRIVATE_ROUTES: Routes = [
    { path: "Dashboard", component: DashboardComponent },

    { path: "Administration", component: DashboardComponent },

    { path: "Customer", component: DashboardComponent },
    { path: "Article", component: DashboardComponent },
    { path: "Campaign", component: DashboardComponent },

    { path: "Backoffice", component: DashboardComponent },
    { path: "Backoffice/BlockedOrder", component: DashboardComponent },
    { path: "Backoffice/DataExport", component: DashboardComponent },
    { path: "Backoffice/Doublette", component: DashboardComponent },
    { path: "Backoffice/Logistic", component: DashboardComponent },
    { path: "Backoffice/Purchase", component: DashboardComponent },
    { path: "Backoffice/StockCorrection", component: DashboardComponent },
    { path: "Backoffice/WarehouseMovement", component: DashboardComponent },
    { path: "Backoffice/Orders", component: DashboardComponent },
    { path: "Backoffice/ReturnRefund", component: DashboardComponent },
    { path: "Backoffice/ReminderLogic", component: DashboardComponent },
    { path: "Backoffice/InvoicePayment", component: DashboardComponent },
    { path: "Backoffice/MailingReturn", component: DashboardComponent },
    { path: "Backoffice/PrintAutoLetter", component: DashboardComponent },

    { path: "BusinessCosts", component: DashboardComponent },
    { path: "OrderDataEntry", component: DashboardComponent },
    { path: "Statistic", component: DashboardComponent },
    { path: "Statistic/StatistisReport", component: DashboardComponent },

    { path: "Tools", component: DashboardComponent },
    { path: "Tools/TracksSetup", component: DashboardComponent },
    { path: "Tools/ScanManagement", component: DashboardComponent },
    { path: "Tools/DoubletCheckTool", component: DashboardComponent },
    { path: "Tools/ToolsAddOn", component: DashboardComponent },
    { path: "Tools/CampaignAddOn", component: DashboardComponent },
    { path: "Tools/Export", component: DashboardComponent },
    { path: "Tools/SavLetter", component: DashboardComponent },

    { path: "Selection", component: DashboardComponent },
    { path: "CampaignSelection", component: DashboardComponent },
    { path: "BrokerSelection", component: DashboardComponent },
    { path: "CollectSelection", component: DashboardComponent },
    { path: "ArchivedCampaign", component: DashboardComponent },

    { path: "SystemManagement", component: DashboardComponent },
    { path: "MailingData", component: DashboardComponent },
];

const routes: Routes = [
    {
        path: "",
        component: PrivateComponent,
        canActivate: [CanActivateGuard],
        children: PRIVATE_ROUTES,
        canDeactivate: [UnsavedModulesGuard],
        resolve: { "": PrivateLoadResolve },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PrivateRoutingModule {}
