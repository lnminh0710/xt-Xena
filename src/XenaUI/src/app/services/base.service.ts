import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Response } from '@angular/http';
import { JwtHttp } from 'angular2-jwt-refresh';
import { Observable } from 'rxjs/Observable';
import { SerializationHelper } from 'app/utilities';
import { Configuration, ServiceUrl, LocalSettingKey } from 'app/app.constants';
import { UserAuthentication } from 'app/models';
import { Uti, SessionStorageProvider, LocalStorageHelper, String } from 'app/utilities';
import { Subject } from 'rxjs/Subject';
import { CacheService } from './cache.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Injectable()
export class BaseService {
    protected headers: Headers;
    protected modelName: string;
    protected serUrl: ServiceUrl;
    protected uti: Uti;

    private responseEventTypes: string;
    private timeOutSpec = 600000;
    static finishProgressTimer: any;
    static startProgressbarCount = 0;

    static toggleSlimLoadingBarSource = new Subject<any>();
    static toggleSlimLoadingBar$ = BaseService.toggleSlimLoadingBarSource.asObservable();

    private jwtHttp: JwtHttp;
    protected router: Router;
    protected config: Configuration;

    static cacheService: CacheService = new CacheService();
    static toasterService: ToasterService;

    constructor(protected injector: Injector) {

        this.jwtHttp = this.injector.get(JwtHttp);
        this.router = this.injector.get(Router);
        this.config = this.injector.get(Configuration);

        this.serUrl = new ServiceUrl();
        this.uti = new Uti();
        this.modelName = '';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Cache-Control', 'no-cache');
        this.headers.append('Pragma', 'no-cache');

        //can set many types. Ex: [Exception][Abc]
        this.responseEventTypes = '[Exception]';
    }

    private getAuthorization(token?: string) {
        this.addLanguageToHeader();
        if (token) {
            if (this.headers.has('Authorization')) {
                this.headers.delete('Authorization');
            }
            this.headers.append('Authorization', token);
            return;
        }
        const currentUserJson = localStorage.getItem(this.config.localStorageCurrentUser);
        const currentUserAuthentication = SerializationHelper.toInstance(new UserAuthentication(), currentUserJson);
        const authorizationString = currentUserAuthentication.token_type + ' ' + currentUserAuthentication.access_token;

        if (this.headers.has('Authorization')) {
            this.headers.delete('Authorization');
        }
        this.headers.append('Authorization', authorizationString);
    }

    private addLanguageToHeader() {
        let language = LocalStorageHelper.toInstance(SessionStorageProvider).getItem(LocalSettingKey.LANGUAGE);
        if (language) {
            if (this.headers.has('IdRepLanguage')) {
                this.headers.delete('IdRepLanguage');
            }
            this.headers.append('IdRepLanguage', language.idRepLanguage);
        }
    }

    protected addHeader(key: string, value: string) {
        if (this.headers.has(key)) {
            this.headers.delete(key);
        }
        this.headers.append(key, value);
    }

    private setModuleName(moduleName) {
        if (!moduleName) { return; }
        if (this.headers.has('module_name')) {
            this.headers.delete('module_name');
        }
        this.headers.append('module_name', moduleName);
    }

    private buildGetUrl(currentUrl: string, param?: any): string {
        if (!param || Uti.isNullUndefinedEmptyObject(param)) {
            return currentUrl;
        }
        const keyNames = Object.keys(param);
        currentUrl += currentUrl.indexOf('?') > -1 ? '&' : '?';
        for (const key of keyNames) {
            currentUrl += key.replace(this.config.avoidPropetyRemoveText, '') + '=' + ((param[key] == null || param[key] == undefined) ? '' : param[key]) + '&';
        }
        return currentUrl.substr(0, currentUrl.length - 1);
    }

    private writeTimeTraceLog(response: any, clientStartTime: Date, clientEndTime: Date) {
        if (!this.config.enableTimeTraceLog) return;

        const uniqueServTime = response.headers._headers.get('x-elapsedtime-uniqueservice');
        const xenaApiTime = response.headers._headers.get('x-elapsedtime-xenaapi');
        const url = response.url;
        const status = response.status;
        const clientTime = String.Format('start: {0} - end: {1} - total: {2}ms',
            String.Format('{0}/{1}/{2} {3}:{4}:{5}:{6}',
                clientStartTime.getDate(),
                clientStartTime.getMonth(),
                clientStartTime.getFullYear(),
                clientStartTime.getHours(),
                clientStartTime.getMinutes(),
                clientStartTime.getSeconds(),
                clientStartTime.getMilliseconds()
            ),
            String.Format('{0}/{1}/{2} {3}:{4}:{5}:{6}',
                clientEndTime.getDate(),
                clientEndTime.getMonth(),
                clientEndTime.getFullYear(),
                clientEndTime.getHours(),
                clientEndTime.getMinutes(),
                clientEndTime.getSeconds(),
                clientEndTime.getMilliseconds()
            ),
            clientEndTime.getTime() - clientStartTime.getTime());
        console.log({
            'unique service': uniqueServTime ? uniqueServTime[0] : '',
            'xena api': xenaApiTime ? xenaApiTime[0] : '',
            'client': clientTime,
            'url': url,
            'status': status
        });

    }

    private logWhenTimeout(url: string): any {
        return 'Timeout exceeded of request: ' + url;
    }

    public getTracking<T>(url: string): Observable<T> {
        this.getAuthorization();
        const startTime = (new Date());
        return this.jwtHttp
            .get(url, { headers: this.headers })
            .timeoutWith(this.timeOutSpec, Observable.throw(this.logWhenTimeout(url)))
            .catch(error => {
                return this.handleError(error);
            })
            .map((response: Response) => {
                const endTime = (new Date());
                this.writeTimeTraceLog(response, startTime, endTime);

                const responseJson = response.json() as T;
                this.processManualError(responseJson);
                return responseJson;
            });
    }

    protected get<T>(url: string, param?: any, token?: string, moduleName?: string, deboundTime?: number, dontParseJson?: boolean): Observable<T> {
        this.setModuleName(moduleName);
        this.getAuthorization(token);
        url = this.buildGetUrl(url, param);
        deboundTime = deboundTime || 10000;
        const startTime = (new Date());

        return this.jwtHttp
            .get(url, { headers: this.headers })
            .debounceTime(deboundTime)
            .timeoutWith(this.timeOutSpec, Observable.throw(this.logWhenTimeout(url)))
            .catch(error => {
                return this.handleError(error);
            })
            .map((response: Response) => {
                const endTime = (new Date());
                this.writeTimeTraceLog(response, startTime, endTime);

                if (dontParseJson) return response as any;

                const responseJson = response.json() as T;
                this.processManualError(responseJson);
                return responseJson;
            });
    }

    protected getV2<T>(
        url: string,
        options?: any,
        param?: any,
        deboundTime?: number,
        dontParseJson?: boolean,
    ): Observable<T> {
        url = this.buildGetUrl(url, param);
        deboundTime = deboundTime || 10000;
        const startTime = (new Date());

        let httpOptions = new Headers();
        for (const key in options) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                const element = options[key];
                httpOptions.append(key, element);
            }
        }

        return this.jwtHttp
            .get(url, { headers: httpOptions })
            .debounceTime(deboundTime)
            .timeoutWith(this.timeOutSpec, Observable.throw(this.logWhenTimeout(url)))
            .catch(error => {
                return this.handleError(error);
            })
            .map((response: any) => {
                const endTime = new Date();
                this.writeTimeTraceLog(response, startTime, endTime);

                const responseJson = response._body as T;
                this.processManualError(responseJson);
                return responseJson;
            });
    }

    protected post<T>(url: string, bodyJson?: string, param?: any, token?: string, dontParseJson?: boolean, ignoreBarProcess?: boolean): Observable<T> {
        this.getAuthorization(token);
        url = this.buildGetUrl(url, param);
        const startTime = (new Date());

        if (!ignoreBarProcess && !this.ignoreProgressBarProcess(url)) {
            this.startProgressbar(url);
        }

        return this.jwtHttp
            .post(url, bodyJson, { headers: this.headers })
            .timeoutWith(this.timeOutSpec, Observable.throw(this.logWhenTimeout(url)))
            .catch(error => {
                return this.handleError(error);
            })
            .map((response: Response) => {
                const endTime = (new Date());
                this.writeTimeTraceLog(response, startTime, endTime);

                if (dontParseJson) return response as any;

                const responseJson = response.json() as T;
                this.processManualError(responseJson);
                return responseJson;
            })
            .finally(() => {
                if (!ignoreBarProcess && !this.ignoreProgressBarProcess(url)) {
                    this.finishProgessbar(url);
                }
            });
    }

    protected put<T>(url: string, bodyJson?: string, param?: any, token?: string): Observable<T> {
        this.getAuthorization(token);
        url = this.buildGetUrl(url, param);
        const startTime = (new Date());
        return this.jwtHttp
            .put(url, bodyJson, { headers: this.headers })
            .timeoutWith(this.timeOutSpec, Observable.throw(this.logWhenTimeout(url)))
            .catch(error => {
                return this.handleError(error);
            })
            .map((response: Response) => {
                const endTime = (new Date());
                this.writeTimeTraceLog(response, startTime, endTime);

                const responseJson = response.json() as T;
                this.processManualError(responseJson);
                return responseJson;
            });
    }

    protected delete<T>(url: string, param?: any, token?: string): Observable<T> {
        this.getAuthorization(token);
        url = this.buildGetUrl(url, param);
        const startTime = (new Date());
        return this.jwtHttp
            .delete(url, { headers: this.headers })
            .timeoutWith(this.timeOutSpec, Observable.throw(this.logWhenTimeout(url)))
            .catch(error => {
                return this.handleError(error);
            })
            .map((response: Response) => {
                const endTime = (new Date());
                this.writeTimeTraceLog(response, startTime, endTime);

                const responseJson = response.json() as T;
                this.processManualError(responseJson);
                return responseJson;
            });
    }

    private processManualError(responseJson: any) {
        if (!responseJson || !BaseService.toasterService) return;
        if (responseJson.statusCode != 1 || !responseJson['item'] || !responseJson['item'].hasOwnProperty("eventType")) return;

        //only process for statusCode = 1 (success)
        let eventType = responseJson['item']['eventType'];
        if (!eventType || this.responseEventTypes.indexOf('[' + (eventType || '') + ']') !== -1) {

            const mesDefaultErr = 'System error, please contact administrator for supporting';
            const mesErr = responseJson && responseJson['item'] && responseJson['item'].sqlStoredMessage ? `${mesDefaultErr}: \n ${responseJson['item'].sqlStoredMessage}` : mesDefaultErr;
            BaseService.toasterService.pop('error', 'System Error', mesErr);

            console.log('System error:', responseJson);
            throw new Error('System error with eventType: ' + (eventType || ''));
        }
    }

    private handleError(error: any) {
        //status, statusText
        if (error) {
            /*
             BadRequest = 400,
             Unauthorized = 401,
             PaymentRequired = 402,
             Forbidden = 403,
             NotFound = 404
             */
            switch (error.status) {
                case 401:
                case 403:

                    // remove user from local storage to log user out
                    this.clearSession();

                    location.href = this.config.loginUrl;

                    //// if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
                    //return Observable.of(error.statusText);
                    break;
                case 500:
                    //default:
                    BaseService.toasterService.pop('error', 'System Error', 'System error, please contact administrator for supporting');
                    break;
            }
        }

        Uti.logError(error);
        return Observable.throw(error);
    }

    protected clearSession() {
        sessionStorage.clear();
        let lastUserPicture = localStorage.getItem(this.config.localStorageLastUserPicture);
        let userRemember = localStorage.getItem(this.config.userRememberKey);
        localStorage.clear();
        localStorage.setItem(this.config.localStorageLastUserPicture, lastUserPicture);
        localStorage.setItem(this.config.userRememberKey, userRemember);
    }

    private ignoreProgressBarProcess(url) {
        let ignoreUrls = [
            'GlobalSetting',
            'UpdateWidgetSetting',
            'SavePageSetting',
            'SaveOrderFailed',
            'DeleteOrderFailed',
            'DeleteAllOrderFailed'
        ];

        for (let i = 0; i < ignoreUrls.length; i++) {
            if (url.indexOf(ignoreUrls[i]) >= 0) {
                return true;
            }
        }
        return false;
    }

    private startProgressbar(url) {
        if (BaseService.startProgressbarCount === 0) {
            BaseService.startProgressbarCount++;
            BaseService.toggleSlimLoadingBarSource.next({
                status: 'START',
                action: url
            });
        }
    }

    private finishProgessbar(url) {
        clearTimeout(BaseService.finishProgressTimer);
        BaseService.finishProgressTimer = setTimeout(() => {
            BaseService.startProgressbarCount = 0;
            BaseService.toggleSlimLoadingBarSource.next({
                status: 'COMPLETE',
                action: url
            });
        }, 1000);
    }
}

