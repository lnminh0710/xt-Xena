import { Component, OnInit } from '@angular/core';
import { Configuration } from 'app/app.constants';

@Component({
  selector: 'account-denied',
  templateUrl: './account-denied.component.html',
  styleUrls: ['./account-denied.component.scss'],
})
export class AccountDeniedComponent implements OnInit {
  loginUrl: string;

  constructor(private consts: Configuration) {}

  ngOnInit() {
    this.loginUrl = this.consts.loginUrl;
  }
}
