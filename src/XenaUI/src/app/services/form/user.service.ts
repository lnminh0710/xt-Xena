import { Injectable, Inject, forwardRef } from "@angular/core";
import { User } from "app/models";
import { ReplaySubject } from "rxjs/Rx";
import { AuthenticationService } from "app/services";
import { Uti, SessionStorageProvider, LocalStorageHelper } from "app/utilities";
import { LocalSettingKey } from "app/app.constants";

@Injectable()
export class UserService {
    private _currentUser: User;
    public currentUser: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(
        @Inject(forwardRef(() => AuthenticationService))
        private authenticationService: AuthenticationService,
        private uti: Uti
    ) {}

    /**
     * setCurrentUser
     * @param user
     */
    public setCurrentUser(user: User) {
        this._currentUser = user;
        this.currentUser.next(user);
    }

    /**
     * getLanguage
     */
    public getLanguage() {
        let idRepLanguage = this._currentUser.preferredLang;
        let language = LocalStorageHelper.toInstance(
            SessionStorageProvider
        ).getItem(LocalSettingKey.LANGUAGE);
        if (language && language.idRepLanguage) {
            idRepLanguage = language.idRepLanguage;
        }
        return idRepLanguage;
    }

    /**
     * loginByUserId
     */
    public loginByUserId(reload?: boolean) {
        this.authenticationService
            .loginByUserId(this._currentUser.id)
            .subscribe(
                (data) => this.loginByUserIdSuccess(data.item, reload),
                (error) => this.loginByUserIdError(error)
            );
    }

    /**
     * userAuthentication
     * @param userAuthentication
     */
    private loginByUserIdSuccess(userAuthentication: any, reload: boolean) {
        if (
            userAuthentication &&
            userAuthentication.access_token &&
            userAuthentication.expires_in
        ) {
            this.uti.storeUserAuthentication(userAuthentication);
            var userInfo = this.uti.getUserInfo();
            this.setCurrentUser(userInfo);
            if (reload) {
                location.reload();
            }
        }
    }

    /**
     * loginByUserIdError
     * @param error
     */
    private loginByUserIdError(error: any) {}
}
