import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/services';
import { Configuration } from 'app/app.constants';
import { Uti } from 'app/utilities/uti';
import { User } from 'app/models/user';

@Component({
  selector: 'account-expire',
  templateUrl: './account-expire.component.html',
  styleUrls: ['./account-expire.component.scss'],
})
export class AccountExpireComponent implements OnInit {
  model: any = {};
  loginName: string = '';
  loginUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private consts: Configuration,
    private uti: Uti
  ) {
    this.model = this.uti.getUserExpireInfo();
  }

  ngOnInit() {
    if (!this.uti.checkLoginWithExpire()) {
      this.router.navigate([this.consts.loginUrl]);
    }
    this.route.params.subscribe(
      (params) => (this.loginName = params[this.consts.urlPramLoginName])
    );
    this.loginUrl = this.consts.loginUrl;
  }

  submit() {
    if (!this.model.postMessage) {
      return;
    }
    this.authenticationService
      .sendExpireMessage(this.loginName, this.model.postMessage)
      .subscribe(
        (data) => this.sendExpireMessageSuccess(data.item),
        (error) => this.sendExpireMessageError(error)
      );
  }

  sendExpireMessageSuccess(data: any) {
    this.router.navigate([this.consts.accountExpireThankUrl]);
  }

  sendExpireMessageError(error: any) {
    Uti.logError(error);
  }
}
