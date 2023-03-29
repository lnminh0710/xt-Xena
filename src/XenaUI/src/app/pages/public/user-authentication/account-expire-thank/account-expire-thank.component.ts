import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/services';
import { Configuration } from 'app/app.constants';
import { Uti } from 'app/utilities/uti';

@Component({
  selector: 'account-expire-thank',
  templateUrl: './account-expire-thank.component.html',
  styleUrls: ['./account-expire-thank.component.scss'],
})
export class AccountExpireThankComponent implements OnInit {
  loginUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private consts: Configuration,
    private uti: Uti
  ) {}

  ngOnInit() {
    if (!this.uti.checkLoginWithExpire()) {
      this.router.navigate([this.consts.loginUrl]);
      return;
    }

    this.loginUrl = this.consts.loginUrl;
  }
}
