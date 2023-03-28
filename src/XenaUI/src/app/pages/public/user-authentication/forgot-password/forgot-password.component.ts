import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "app/services";
import { Configuration } from "app/app.constants";

@Component({
    selector: "forgot-password",
    templateUrl: "./forgot-password.component.html",
    styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    emailIsSent = false;
    userIsNotExisted = false;
    token: string;
    loginUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private consts: Configuration
    ) {}

    ngOnInit() {
        this.authenticationService.logout();
        this.returnUrl = this.consts.rootUrl;
        this.loginUrl = this.consts.loginUrl;
    }

    submit() {
        this.loading = true;
        this.authenticationService
            .forgotPassword(this.model.loginName)
            .subscribe(
                (result) => this.loginCheckSuccess(result.item),
                (error) => this.loginError(error)
            );
    }

    loginCheckSuccess(data: any) {
        this.userIsNotExisted = !data;
        this.emailIsSent = data;
        this.loading = false;
    }

    loginError(error: any) {
        this.emailIsSent = false;
        this.userIsNotExisted = false;
        this.loading = false;
    }
}
