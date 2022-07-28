import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, CommonService, DeviceDetectorService, GlobalSettingService, UserService } from 'app/services';
import { GlobalSettingModel, LanguageSettingModel, Message, User, UserAuthentication } from 'app/models';
import { Configuration, GlobalSettingConstant, LocalSettingKey } from 'app/app.constants';
import { LocalStorageHelper, SessionStorageProvider, Uti } from 'app/utilities';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

    public model: any = {};
    public loading = false;
    public currentUserInfo: User;
    public currentUserGlobalSetting: GlobalSettingModel;
    public forgotpasswordUrl: string;
    public lastUserPicture: string;
    public buildVersion: string = '';
    public userAuthenticationFail: boolean = false;
    public isLoginNameError: boolean = false;
    public isPasswordError: boolean = false;
    public isFormSubmit: boolean = false;
    public isPasswordChanged: boolean = false;
    public welcomeHtml: string = `<h4 _ngcontent-c0="">ARTIFICIAL INTELLIGENCE</h4>
                                    <h1 _ngcontent-c0="">WE TAKE IT TO THE NEXT LEVEL</h1>
                                    <p _ngcontent-c0="" style="
                                        text-align: justify;
                                        font-size: 15px;
                                        font-weight: 100;
                                        margin-top: 20px;
                                    ">Transform data into insights, automate and innovate, to deliver experiences everyone will lose, and set the pace in your industry</p>
                                </div>`;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private globalSettingSer: GlobalSettingService,
        private userService: UserService,
        private _commonService: CommonService,
        private consts: Configuration,
        private globalSettingConstant: GlobalSettingConstant,
        private deviceDetectorService : DeviceDetectorService,
        private httpClient: HttpClient,
        private uti: Uti
    ) { }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        if (this.uti.checkLogin()) {
            this.router.navigate([this.consts.rootUrl]);
        }
        else {
            // reset login status
            this.authenticationService.logout();
        }

        this.checkRememberLogin();

        this.forgotpasswordUrl = this.consts.forgotpasswordUrl;

        let lastUserPicture = localStorage.getItem(this.consts.localStorageLastUserPicture);
        if (lastUserPicture && lastUserPicture !== 'null') {
            this.lastUserPicture = lastUserPicture;
        }
    }

    ngAfterViewInit() {
        $(document).ready(() => {
            setTimeout(() => {
                this.registerFocusWhenEnter();
            });
        });
        this.buildVersion = Configuration.PublicSettings.appVersion;
    }

    public login() {
        if (!this.isFormValid()) return;
          ////get ip
        this.httpClient.get('http://api.ipify.org/?format=json')
          .toPromise()
          .then((data:any) => {//success
            this.authenticationService.login(this.prepareLoginData(data && data.ip ? data.ip : ''))
                .subscribe(
                    data => this.loginSuccess(data.item),
                    error => this.loginError(error));

          }).catch((error) => {
            this.authenticationService.login(this.prepareLoginData())
              .subscribe(
                  data => this.loginSuccess(data.item),
                  error => this.loginError(error));
          });
    }

    public loginNameChange() {
        this.isLoginNameError = !this.model.loginName;
    }

    public passwordChange() {
        this.isPasswordError = !this.model.password;
        this.isPasswordChanged = true;
    }

    /********************************************************************************************/
    /********************************** PRIVATE METHODS ******************************************/
    /********************************************************************************************/

    private prepareLoginData(ip = ''): any {
        const valueUserRemember = localStorage.getItem(this.consts.userRememberKey);
        const deviceInfo = this.deviceDetectorService.getDeviceInfo()

        if (this.compareUserRemember() && this.checkUserRememberKey() && !this.isPasswordChanged) {
            const dataUser = JSON.parse(this._commonService.decrypt(valueUserRemember));
            return new User({
                loginName: this.model.loginName,
                password: dataUser.password,
                osType: deviceInfo.os,
                osVersion :deviceInfo.os_version,
                browserType : deviceInfo.browser,
                versionBrowser : deviceInfo.browser_version,
                ipAddress :ip,
                stepLog : 'Login',
            });
        }
        return new User({
            loginName: this.model.loginName,
            password: this._commonService.SHA256(this.model.password),
            osType: deviceInfo.os,
            osVersion :deviceInfo.os_version,
            browserType : deviceInfo.browser,
            versionBrowser : deviceInfo.browser_version,
            ipAddress :ip,
            stepLog : 'Login',
        });
    }

    private isFormValid(): boolean {
        this.isFormSubmit = true;
        if (!this.model.loginName) {
            setTimeout(() => {
                $('#real-login-name').focus();
            });
            this.isLoginNameError = true;
            return false;
        }

        if (!this.model.password) {
            setTimeout(() => {
                $('#real-password').focus();
            });
            this.isPasswordError = true;
            return false;
        }
        this.loading = true;
        return true;;
    }

    private registerFocusWhenEnter() {
        const loginNameCtr = $('#real-login-name');
        const passwordCtr = $('#real-password');
        loginNameCtr.focus();
        loginNameCtr.unbind('keyup');
        passwordCtr.unbind('keyup');
        loginNameCtr.keyup(($event) => {
            if (!($event.which === 13 || $event.keyCode === 13)) return;
            this.login();
        });
        passwordCtr.keyup(($event) => {
            if (!($event.which === 13 || $event.keyCode === 13)) return;
            this.login();
        });
    }

    private removeRemember() {
        if (this.model.remember) return;
        localStorage.removeItem(this.consts.userRememberKey);
    }

    private checkRememberLogin() {
        if (this.checkUserRememberKey()) {
            const valueUserRemember = localStorage.getItem(this.consts.userRememberKey);
            const dataUser = JSON.parse(this._commonService.decrypt(valueUserRemember));
            const password = dataUser.lengthPassword;
            let total = '';
            for (let i = 0; i < password; i++) {
                total += '*';
            }
            this.model.loginName = dataUser.loginName;
            this.model.password = total;
            this.model.remember = true;
        }
    }

    private getUserRememberKey() {
        const valueUserRemember = localStorage.getItem(this.consts.userRememberKey);
        if (valueUserRemember) {
            return valueUserRemember === "null" ? null : valueUserRemember
        }
    }

    private checkUserRememberKey() {
        const valueUserRemember = localStorage.getItem(this.consts.userRememberKey);
        if (valueUserRemember) {
            const valueRemember = valueUserRemember === "null" ? null : valueUserRemember;
            return !!valueRemember
        }
    }

    private compareUserRemember() {
        const valueUserRemember = this.getUserRememberKey();
        if (!!valueUserRemember) {
            const dataUser = JSON.parse(this._commonService.decrypt(valueUserRemember));
            if (dataUser.loginName === this.model.loginName)
                return true;
        }
        return false;
    }

    private loginSuccess(userAuthentication: any) {
        this.loading = false;
        if (this.haveMessage(userAuthentication)) return;
        // Login successful
        if (userAuthentication && userAuthentication.access_token && userAuthentication.expires_in) {
            this.uti.storeUserAuthentication(userAuthentication);

            const userInfo = this.uti.getUserInfo();
            this.userService.setCurrentUser(userInfo);
            LocalStorageHelper.toInstance(SessionStorageProvider).setItem(LocalSettingKey.LANGUAGE, new LanguageSettingModel({ idRepLanguage: userInfo.preferredLang }));
            if ((!this.checkUserRememberKey() && this.model.remember) ||
                (!this.compareUserRemember() && this.model.remember) ||
                this.isPasswordChanged) {
                this.storeRememberLoginAccountToLocalStorage();
            }

            this.removeRemember();
            this.userAuthenticationFail = false;
            this.router.navigate([Configuration.rootPrivateUrl]);
        }
        // Log fail
        else {
            // remove user detail in localStorage
            localStorage.removeItem(this.consts.localStorageCurrentUser);
            this.userAuthenticationFail = true;
            $('#real-login-name').focus();
        }
    }

    private storeRememberLoginAccountToLocalStorage() {
        localStorage.setItem(this.consts.userRememberKey, this._commonService.encrypt(JSON.stringify({
            loginName: this.model.loginName,
            password: this._commonService.SHA256(this.model.password),
            lengthPassword: this.model.password.length
        })));
    }

    private loginError(error: any) {
        this.authenticationService.logout();
        this.userAuthenticationFail = true;
        this.loading = false;
        $('#real-login-name').focus();
    }

    private haveMessage(userAuthentication: UserAuthentication): boolean {
        if (!userAuthentication.message_type || isNaN(parseInt(userAuthentication.message_type))) return;
        localStorage.removeItem(this.consts.localStorageCurrentUser);
        localStorage.setItem(this.consts.localStorageCurrentUserExpire, JSON.stringify(userAuthentication));
        switch (parseInt(userAuthentication.message_type)) {
            // Account is near expired
            case 1: {
                localStorage.setItem(this.consts.localStorageCurrentUser, JSON.stringify(userAuthentication));
                localStorage.setItem(this.consts.localStorageAccessToken, userAuthentication.access_token);
                localStorage.setItem(this.consts.localStorageRefreshToken, userAuthentication.refresh_token);
                localStorage.setItem(this.consts.localStorageExpiresIn, userAuthentication.expires_in);
                this.userAuthenticationFail = false;
                this.currentUserInfo = this.uti.getUserInfo();
                this.userService.setCurrentUser(this.currentUserInfo);
                this.saveNearExpireMessage();
                setTimeout(() => {
                    this.router.navigate([this.consts.rootUrl]);
                }, 2000);
                break;
            }
            // Account is expired
            case 2: {
                if (this.model && this.model.loginName)
                    this.router.navigate([this.consts.accountExpireUrl + '/' + this.model.loginName]);
                break;
            }
            // Account is denied
            case 3: {
                this.router.navigate([this.consts.accountDenied]);
                break;
            }
        }
        return true;
    }

    private saveNearExpireMessage() {
        this.globalSettingSer.getAllGlobalSettings().subscribe(
            data => this.saveNearExpireMessageSuccess(data),
            error => this.saveNearExpireMessageError(error));
    }
    private saveNearExpireMessageSuccess(globalSettingModels: GlobalSettingModel[]) {
        // let this.currentUserGlobalSetting = globalSettingModels.find(x => x.globalName == this.globalSettingConstant.settingUserNoticeMessage + this.currentUserInfo.loginName && !!(x.isActive))
        this.currentUserGlobalSetting = globalSettingModels.find(x => x.globalName == this.globalSettingConstant.settingUserNoticeMessage + this.currentUserInfo.loginName)
        if (!this.currentUserGlobalSetting || !this.currentUserGlobalSetting.idSettingsGlobal || !this.currentUserGlobalSetting.globalName) {
            this.currentUserGlobalSetting = new GlobalSettingModel({
                globalName: this.globalSettingConstant.settingUserNoticeMessage + this.currentUserInfo.loginName,
                description: 'List Notice Message each user',
                jsonSettings: JSON.stringify([new Message({
                    type: '1',
                    content: this.currentUserInfo.loginMessage,
                    isRead: false
                })]),
                isActive: true
            });
        }
        else {
            let currentUserNoticeMessage = JSON.parse(this.currentUserGlobalSetting.jsonSettings) as Message[];
            let loginNearExpireMessage = currentUserNoticeMessage.find(x => x.content == this.currentUserInfo.loginMessage)
            if (!$.isEmptyObject(loginNearExpireMessage)) return;
            currentUserNoticeMessage.push(new Message({
                type: '1',
                content: this.currentUserInfo.loginMessage,
                isRead: false
            }));
            this.currentUserGlobalSetting.idSettingsGUI = -1;
            this.currentUserGlobalSetting.jsonSettings = JSON.stringify(currentUserNoticeMessage);
        }

        this.globalSettingSer.saveGlobalSetting(this.currentUserGlobalSetting).subscribe(
            data => this.saveGlobalSettingSuccess(data),
            error => this.saveNearExpireMessageError(error));
    }
    private saveGlobalSettingSuccess(data: any) {
        this.globalSettingSer.saveUpdateCache('-1', this.currentUserGlobalSetting, data);
    }
    private saveNearExpireMessageError(error: any) {
        Uti.logError(error);
    }
}
