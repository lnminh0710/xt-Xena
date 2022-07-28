import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs/Observable';
import { ApiResultResponse } from 'app/models';
import { ESQueryType } from 'app/app.constants';

@Injectable()
export class SearchService extends BaseService {

    constructor(injector: Injector) {
        super(injector);
    }

    public search(
        searchIndex: string,
        keyword: string,
        moduleId: number,
        pageIndex: number,
        pageSize: number,
        searchField?: any,
        fieldName?: Array<string>,
        fieldValue?: Array<string>,
        isWithStar?: boolean,
        isGetCustomerById?: boolean,
        onlySearchCampaign?: boolean,
        queryType?: ESQueryType): Observable<ApiResultResponse> {

        isWithStar = true;//2019-01-02: Rocco always wants to search by isWithStar = true

        // TODO: Refactor later
        if (moduleId >= 11 && moduleId <= 23) {
            moduleId = 1;
        }

        let url = this.serUrl.elasticSearchSearchDetail;
        const params: any = {
            searchIndex: searchIndex,
            keyword: encodeURIComponent(keyword),
            moduleId: moduleId,
            pageIndex: pageIndex,
            pageSize: pageSize,
            isWithStar: isWithStar,
            isGetCustomerById: isGetCustomerById,
            onlySearchCampaign: onlySearchCampaign
        };
        if (searchField) {
            if (queryType) {
                params['queryType'] = queryType;
            }
            url = this.serUrl.elasticSearchSearchByField;
            params.field = searchField;
        }
        if (fieldName && fieldName.length && fieldValue && fieldValue.length && fieldName.length === fieldValue.length) {
            url += '?';
            for (let i = 0; i < fieldName.length; i++) {
                url += 'fieldName=' + fieldName[i] + '&fieldValue=' + fieldValue[i];
                if (i === fieldName.length - 1) break;
                url += '&';
            }
        }
        return this.get<any>(url, params);
    }


    public searchAdvance(
        searchIndex: string,
        moduleId: number,
        pageIndex: number,
        pageSize: number,
        conditions: any): Observable<ApiResultResponse> {

        // TODO: Refactor later
        if (moduleId >= 11 && moduleId <= 23) {
            moduleId = 1;
        }

        let url = this.serUrl.elasticSearchDetailAdvance;
        const params: any = {
            searchIndex: searchIndex,
            moduleId: moduleId,
            pageIndex: pageIndex,
            pageSize: pageSize,
            conditions: conditions
        };
        return this.post<any>(url, params, null, null, null, true);
    }

    public searchCustomerDoublet(fieldValue: Array<string>): Observable<ApiResultResponse> {
        let url = this.serUrl.elasticSearchCustomerDoublet;
        url += '?';
        for (let i = 0; i < fieldValue.length; i++) {
            url += 'fieldValue=' + fieldValue[i];
            if (i === fieldValue.length - 1) break;
            url += '&';
        }
        return this.get<any>(url);
    }

    public searchCustomerFoot(matchingGroup: string, keyword: string): Observable<ApiResultResponse> {
        const fieldName: Array<string> = ['matchingGroup'];
        const fieldValue: Array<string> = [matchingGroup];

        const searchIndex = 'customerfoot';
        return this.search(searchIndex, keyword, 2, 1, 100, null, fieldName, fieldValue, true);
    }

    public getColumnSetting(moduleId): Observable<any> {
        return this.get<any>(this.serUrl.elasticGetColumnSetting, { moduleId: moduleId }).map((result: any) => {
            return result.item;
        });
    }
}
