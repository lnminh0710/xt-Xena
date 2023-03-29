import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserAuthentication, User } from 'app/models';
import { BaseService } from '../base.service';
import { Configuration } from '../../app.constants';

@Injectable()
export class AuthenticationService extends BaseService {
  protected consts: Configuration = new Configuration();

  constructor(injector: Injector) {
    super(injector);
  }

  // cache data
  public lastGetAll: Array<any>;
  public lastGet: any;

  public login(user: User): Observable<any> {
    return this.post<UserAuthentication>(
      this.serUrl.serviceAuthenticateUrl,
      JSON.stringify({
        LoginName: user.loginName,
        Password: user.password,
        IsEncrypt: true,
        ipAddress: user.ipAddress,
        osType: user.osType,
        osVersion: user.osVersion,
        browserType: user.browserType,
        versionBrowser: user.versionBrowser,
        stepLog: user.stepLog,
      })
    );
  }

  public loginByUserId(idLogin: string): Observable<any> {
    return this.post<UserAuthentication>(
      this.serUrl.loginByUserIdUrl,
      JSON.stringify({ idLogin: idLogin })
    );
  }

  public forgotPassword(loginName: string): Observable<any> {
    return this.post<any>(
      this.serUrl.serviceForgotPasswordUrl,
      JSON.stringify({ LoginName: loginName })
    );
  }

  public resetPassword(password: string, token?: string): Observable<any> {
    return this.post<any>(
      this.serUrl.serviceUpdatePasswordUrl,
      JSON.stringify({ NewPassword: password }),
      {},
      token
    );
  }

  public changePassword(
    password: string,
    newPassword: string
  ): Observable<any> {
    return this.post<any>(
      this.serUrl.serviceUpdatePasswordUrl,
      JSON.stringify({ Password: password, NewPassword: newPassword })
    );
  }

  public sendExpireMessage(
    loginName: string,
    message: string
  ): Observable<any> {
    this.addHeaderForSendExpireMessage(loginName, message);
    return this.post<any>(this.serUrl.serviceSendNotificationUrl);
  }

  private addHeaderForSendExpireMessage(loginName: string, message: string) {
    this.headers.append('loginName', loginName);
    this.headers.append('content', message);
  }

  public checkToken(token: any) {
    return this.post<any>(
      this.serUrl.checkTokenUrl,
      JSON.stringify({ AccessToken: token })
    ).map((result: any) => {
      return result.item;
    });
  }

  public logout() {
    this.clearSession();
  }
}
