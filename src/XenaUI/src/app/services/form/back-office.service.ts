import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Customer, PersonModel } from "app/models";
import { BaseService } from "../base.service";

@Injectable()
export class BackOfficeService extends BaseService {
    constructor(injector: Injector) {
        super(injector);
    }

    public getEmailTemplates(param: string): Observable<any> {
        return Observable.of({}).map((object) => {
            return object;
        });
    }

    public getEmailPlaceholder(): Observable<any> {
        return Observable.of({}).map((object) => {
            return object;
        });
    }

    public saveEmailTemplate(data: any): Observable<any> {
        return Observable.of({ returnValue: 1 }).map((object) => {
            return object;
        });
    }

    public saveBackOfficeEmail(data: any): Observable<any> {
        return Observable.of({ returnValue: 1 }).map((object) => {
            return object;
        });
    }

    public createRefundPayment(data: any): Observable<any> {
        return Observable.of({ returnValue: 1 }).map((object) => {
            return object;
        });
    }

    public saveUnblockOrder(
        idSalesOrder: any,
        isDelete?: boolean
    ): Observable<any> {
        return this.post<any>(
            this.serUrl.saveUnblockOrder,
            JSON.stringify({}),
            {
                idSalesOrder: idSalesOrder,
                isDelete: isDelete,
            }
        ).map((result: any) => {
            return result.item;
        });
    }

    public confirmSalesOrderLetters(idGenerateLetter: string): Observable<any> {
        return this.post<any>(
            this.serUrl.confirmSalesOrderLetters,
            JSON.stringify({}),
            {
                IdGenerateLetter: idGenerateLetter,
            }
        ).map((result: any) => {
            return result.item;
        });
    }

    public resetLetterStatus(idGenerateLetter: string): Observable<any> {
        return this.post<any>(
            this.serUrl.resetLetterStatus,
            JSON.stringify({}),
            {
                IdGenerateLetter: idGenerateLetter,
            }
        ).map((result: any) => {
            return result.item;
        });
    }

    public saveDeleteOrder(idSalesOrder: any): Observable<any> {
        return this.post<any>(this.serUrl.saveDeleteOrder, JSON.stringify({}), {
            idSalesOrder: idSalesOrder,
        }).map((result: any) => {
            return result.item;
        });
    }

    public confirmGoodsReceiptPosted(idWarehouseMovement): Observable<any> {
        return this.post<any>(
            this.serUrl.confirmGoodsReceiptPosted,
            JSON.stringify({
                ConfirmGoodsReceiptPosted: {
                    IdWarehouseMovement: idWarehouseMovement,
                },
            })
        );
    }
}
