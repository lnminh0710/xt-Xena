import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./user-authentication/login/login.component";
import { ForgotPasswordComponent } from "./user-authentication/forgot-password/forgot-password.component";
import { ChangePasswordComponent } from "./user-authentication/change-password/change-password.component";
import { ChangePasswordSuccessComponent } from "./user-authentication/change-password-success/change-password-success.component";
import { UpdatePasswordComponent } from "./user-authentication/update-password/update-password.component";
import { UpdatePasswordExpireComponent } from "./user-authentication/update-password-expire/update-password-expire.component";
import { AccountDeniedComponent } from "./user-authentication/account-denied/account-denied.component";
import { AccountExpireComponent } from "./user-authentication/account-expire/account-expire.component";
import { AccountExpireThankComponent } from "./user-authentication/account-expire-thank/account-expire-thank.component";
import { RequestTrackingComponent } from "./user-authentication/request-tracking/request-tracking.component";
import { PublicComponent } from "./public.component";

const PUBLIC_ROUTES: Routes = [
    { path: "login", component: LoginComponent },
    { path: "forgotpassword", component: ForgotPasswordComponent },
    { path: "resetpassword", component: UpdatePasswordComponent },
    { path: "invalid", component: UpdatePasswordExpireComponent },
    { path: "changepassword", component: ChangePasswordComponent },
    {
        path: "changepasswordsuccess",
        component: ChangePasswordSuccessComponent,
    },
    { path: "accountdenied", component: AccountDeniedComponent },
    { path: "accountexpire", component: AccountExpireComponent },
    { path: "accountexpire/:loginName", component: AccountExpireComponent },
    { path: "expirethank", component: AccountExpireThankComponent },
    { path: "requesttracking", component: RequestTrackingComponent },
];

const routes: Routes = [
    { path: "", component: PublicComponent, children: PUBLIC_ROUTES },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PublicRoutingModule {}
