import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BaseService } from "../base.service";

@Injectable()
export class ReturnRefundService extends BaseService {
    constructor(injector: Injector) {
        super(injector);
    }

    public getWidgetInfoByIds(
        personNr: string,
        invoiceNr: string,
        mediaCode: string
    ): Observable<any> {
        return this.get<any>(this.serUrl.getWidgetInfoByIds, {
            personNr: personNr,
            invoiceNr: invoiceNr,
            mediaCode: mediaCode,
        }).map((result: any) => {
            return result.item;
        });
    }

    public saveWidgetData(returnRefundModel: any): Observable<any> {
        return this.post<any>(
            this.serUrl.saveReturnRefundWidgetData,
            JSON.stringify(returnRefundModel)
        ).map((result: any) => {
            return result.item;
        });
    }
}
