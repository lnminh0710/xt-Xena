import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { PublicRoutingModule } from './public.routes';
import { PublicComponent } from './public.component';
import {
  AuthenticationService,
  CommonService,
  DataEntryService,
  DatatableService,
  DeviceDetectorService,
  ObservableShareService,
} from 'app/services';
import * as uti from 'app/utilities';
import { GlobalSettingService, UserService } from 'app/services';
import { Configuration, GlobalSettingConstant } from 'app/app.constants';
import { LoginComponent } from './user-authentication/login/login.component';
import { ForgotPasswordComponent } from './user-authentication/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './user-authentication/change-password/change-password.component';
import { ChangePasswordSuccessComponent } from './user-authentication/change-password-success/change-password-success.component';
import { UpdatePasswordComponent } from './user-authentication/update-password/update-password.component';
import { UpdatePasswordExpireComponent } from './user-authentication/update-password-expire/update-password-expire.component';
import { AccountDeniedComponent } from './user-authentication/account-denied/account-denied.component';
import { AccountExpireComponent } from './user-authentication/account-expire/account-expire.component';
import { AccountExpireThankComponent } from './user-authentication/account-expire-thank/account-expire-thank.component';
import { RequestTrackingComponent } from './user-authentication/request-tracking/request-tracking.component';
import { MaterialModule } from 'app/shared/components/xn-control/light-material-ui/material.module';
import { LabelTranslationModule } from '../../shared/components/label-translation/label-translation.module';
import { XnResourceTranslationModule } from '../../shared/directives/xn-resource-translation';
import { XnAgGridModule } from 'app/shared/components/xn-control/xn-ag-grid';
import { SharedModule } from 'public/assets/lib/primeng/primeng';
import { DemoComponent } from './demo/demo.component';
import { WijmoGridComponent } from 'app/shared/components/wijmo';
import { WjInputModule } from 'public/assets/lib/wijmo/wijmo-commonjs-min/wijmo.angular2.input';
import { WjCoreModule } from 'public/assets/lib/wijmo/wijmo-commonjs-min/wijmo.angular2.core';
import { XnWjDropdownHelperModule } from 'app/shared/directives/xn-wj-dropdown-helper/xn-wj-dropdown-helper.module';
import { HttpClientModule } from '@angular/common/http';

const modules = [
  FormsModule,
  HttpModule,
  RouterModule,
  LabelTranslationModule,
  XnResourceTranslationModule,
  MaterialModule,
  ReactiveFormsModule,
  WjCoreModule,
  WjInputModule,
  XnWjDropdownHelperModule,
  HttpClientModule,
];

const widgets = [];

const services = [
  AuthenticationService,
  UserService,
  uti.SerializationHelper,
  GlobalSettingService,
  uti.Uti,
  Configuration,
  GlobalSettingConstant,
  CommonService,
  DeviceDetectorService,
  DataEntryService,
  DatatableService,
  ObservableShareService,
];

const pages = [
  LoginComponent,
  ForgotPasswordComponent,
  ChangePasswordComponent,
  ChangePasswordSuccessComponent,
  UpdatePasswordComponent,
  UpdatePasswordExpireComponent,
  AccountDeniedComponent,
  AccountExpireComponent,
  AccountExpireThankComponent,
  RequestTrackingComponent,
  DemoComponent,
];

@NgModule({
  bootstrap: [PublicComponent],
  declarations: [PublicComponent, ...widgets, ...pages],
  imports: [CommonModule, PublicRoutingModule, ...modules],
  providers: [...services],
})
export class PublicModule {}
