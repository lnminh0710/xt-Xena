import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/toPromise";
import { Configuration } from "./app.constants";
import * as Raven from "raven-js";
import { environment } from "environments/environment";

@Injectable()
export class AppLoadService {
    constructor(private httpClient: HttpClient) {}

    initializeApp(): Promise<any> {
        return new Promise((resolve, reject) => {
            //console.log(`initializeApp:: inside promise`);
            //console.log(location);

            this.httpClient
                .get(environment.fakeServer + "/api/common/GetPublicSetting")
                .toPromise()
                .then((settings) => {
                    //success
                    //console.log(`Settings from API: `, settings);
                    Configuration.PublicSettings = settings["item"];
                    //console.log(`PublicSettings: `, Configuration.PublicSettings);

                    //With this stage, there are many errors with Selection Project, so we will not write sentry
                    if (!Configuration.PublicSettings.isSelectionProject) {
                        //https://docs.sentry.io/platforms/javascript/angular/
                        const sentry = Configuration.PublicSettings.sentry;
                        if (sentry && sentry.clientDsn) {
                            Raven.config(sentry.clientDsn).install();
                        } else {
                            console.log(`Please config sentry with clientDsn`);
                        }
                    }

                    resolve();

                    ////get ip
                    //this.httpClient.get('https://jsonip.com/?callbackg')
                    //    .toPromise()
                    //    .then(data => {//success
                    //        if (data && data['ip']) {
                    //            Configuration.PublicSettings.clientIpAddress = data['ip'];
                    //        }

                    //        resolve();

                    //    }).catch((error) => {
                    //        //Always resolve whether an error occurs
                    //        resolve();

                    //        this.handleError(error);
                    //    });
                })
                .catch(this.handleError());
        }); //Promise
    }

    private handleError(data?: any) {
        return (error: any) => {
            console.log(error);
        };
    }
}
