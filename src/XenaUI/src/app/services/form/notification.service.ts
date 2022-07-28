import { Injectable, Inject, forwardRef, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../base.service';
import { ApiResultResponse } from 'app/models';
import { Configuration } from 'app/app.constants';

@Injectable()
export class NotificationService extends BaseService {
    constructor(injector: Injector) {
        super(injector);
    }
    public getNotifications(data: any): Observable<ApiResultResponse> {
        if (Configuration.PublicSettings.isSelectionProject) return Observable.of(null);

        return this.get<any>(this.serUrl.getNotifications, data);
    }

    public createNotification(data: any): Observable<any> {
        return this.post<any>(this.serUrl.createNotification, JSON.stringify(data));
    }
    
    public setArchivedNotifications(data: any): Observable<any> {
        return this.post<any>(this.serUrl.setArchivedNotifications, JSON.stringify(data));
    }
}
