import { Injectable } from "@angular/core";
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs/Rx";
import {
    AccessRightsService,
    SignalRService,
    GlobalSettingService,
} from "app/services";
import { Uti } from "app/utilities";
import { forkJoin } from "rxjs/Observable/forkJoin";

@Injectable()
export class PrivateLoadResolve implements Resolve<any> {
    constructor(
        private accessRightsService: AccessRightsService,
        private signalRService: SignalRService,
        private globalSettingService: GlobalSettingService
    ) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        Uti.defineBrowserTabId(true);
        this.signalRService.initHub();

        return forkJoin(
            this.accessRightsService.loadUserData(),
            this.globalSettingService.getAllGlobalSettings("-1")
        );

        //return this.accessRightsService.loadUserData();
    }
}
