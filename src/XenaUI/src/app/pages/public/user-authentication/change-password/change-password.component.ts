import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/services';
import { Configuration } from 'app/app.constants';
import { Uti } from 'app/utilities/uti';

@Component({
	selector: 'change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

	model: any = {};
	passwordIsCorrect = true;
	passwordIsMatched = true;
	loading = false;
	updatePassswordSuccess = false;
	updatePassswordFailed = false;
    homeUrl: string;
    loginUrl: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private consts: Configuration,
		private uti: Uti) { }

	ngOnInit() {
		if (!this.uti.checkLogin()) {
			this.router.navigate([this.consts.loginUrl]);
			return;
        }

        this.homeUrl = this.consts.homeUrl;
        this.loginUrl = this.consts.loginUrl;
	}

	submit() {
		if (!this.passwordIsCorrect || !this.passwordIsMatched) {
			return;
		}
		this.loading = true;
		this.authenticationService.changePassword(this.model.oldPassword, this.model.newPassword)
			.subscribe(
			data => this.resetPasswordSuccess(data.item),
			error => this.resetPasswordError(error));
	}

	resetPasswordSuccess(data: any) {
		this.updatePassswordSuccess = true;
		this.authenticationService.logout();
		this.loading = false;
	}

	resetPasswordError(error: any) {
		// remove user detail in localStorage
		this.updatePassswordFailed = true;
		this.loading = false;
	}

	passwordKeyPess() {
		let path = this.consts.passwordPath;
		if (!this.model.newPassword && !this.model.reNewPassword) {
			this.passwordIsCorrect = true;
		}
		else {
			this.passwordIsCorrect = path.test(this.model.newPassword) && path.test(this.model.reNewPassword);
		}
		this.passwordIsMatched = (this.model.newPassword == this.model.reNewPassword);
	}
}
