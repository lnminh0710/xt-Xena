import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/services';
import { Configuration } from 'app/app.constants';

@Component({
  selector: 'change-password-success',
  templateUrl: './change-password-success.component.html',
  styleUrls: ['./change-password-success.component.scss'],
})
export class ChangePasswordSuccessComponent implements OnInit {
  loginUrl: string;

  constructor(
    private consts: Configuration,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.authenticationService.logout();
    this.loginUrl = this.consts.loginUrl;
  }
}
