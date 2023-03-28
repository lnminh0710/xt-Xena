import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BaseService } from "../base.service";

@Injectable()
export class WareHouseMovementService extends BaseService {
    constructor(injector: Injector) {
        super(injector);
    }

    public getArrivedArticles(idWarehouseMovement?: number): Observable<any> {
        return this.get<any>(this.serUrl.getArrivedArticles, {
            idWarehouseMovement: idWarehouseMovement,
        });
    }

    public getSelectedArticles(idWarehouseMovement?: number): Observable<any> {
        return this.get<any>(this.serUrl.getSelectedArticles, {
            idWarehouseMovement: idWarehouseMovement,
        });
    }

    public stockedArticles(idWarehouseMovement?: number): Observable<any> {
        return this.get<any>(this.serUrl.stockedArticles, {
            idWarehouseMovement: idWarehouseMovement,
        });
    }

    public getWarehouseMovement(idWarehouseMovement?: number): Observable<any> {
        return this.get<any>(this.serUrl.getWarehouseMovement, {
            idWarehouseMovement: idWarehouseMovement,
        });
    }

    public searchArticles(
        searchString: string,
        idPersonFromWarehouse?: number
    ): Observable<any> {
        return this.get<any>(this.serUrl.searchArticles, {
            searchString: searchString,
            idPersonFromWarehouse: idPersonFromWarehouse,
        }).map((result: any) => {
            return result.item;
        });
    }

    public saveWarehouseMovement(data: any): Observable<any> {
        return this.post<any>(
            this.serUrl.saveWarehouseMovement,
            JSON.stringify(data)
        ).map((result: any) => {
            return result.item;
        });
    }

    public saveGoodsReceiptPosted(data: any): Observable<any> {
        return this.post<any>(
            this.serUrl.saveGoodsReceiptPosted,
            JSON.stringify(data)
        ).map((result: any) => {
            return result.item;
        });
    }

    public confirmGoodsReceiptPosted(data: any): Observable<any> {
        return this.post<any>(
            this.serUrl.confirmGoodsReceiptPosted,
            JSON.stringify(data)
        ).map((result: any) => {
            return result.item;
        });
    }
}
