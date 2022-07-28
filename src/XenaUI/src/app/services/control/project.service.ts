import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../base.service';

@Injectable()
export class ProjectService extends BaseService {
    constructor(injector: Injector) {
        super(injector);
    }

    public getSelectionProject(idSelectionProject): Observable<any> {
        return this.get<any>(this.serUrl.getSelectionProject, { idSelectionProject });
    }

    public getMediaCodePricing(idSelectionProject, idSelectionProjectCountry): Observable<any> {
        return this.get<any>(this.serUrl.getMediaCodePricing, { idSelectionProject, idSelectionProjectCountry });
    }

    public insertMediaCodeToCampaign(idSelectionProject, idSelectionWidget): Observable<any> {
        return this.get<any>(this.serUrl.insertMediaCodeToCampaign, { idSelectionProject, idSelectionWidget });
    }

    public saveProject(data): Observable<any> {
        return this.post<any>(this.serUrl.saveProject, JSON.stringify(data));
    }

    public saveMediaCodePricing(data): Observable<any> {
        return this.post<any>(this.serUrl.saveMediaCodePricing, JSON.stringify(data));
    }

    public getSelectionToExclude(idSelectionProject): Observable<any> {
        return this.get<any>(this.serUrl.getSelectionToExclude, { idSelectionProject });
    }

    public getSelectionIsExcluded(idSelectionProject): Observable<any> {
        return this.get<any>(this.serUrl.getSelectionIsExcluded, { idSelectionProject });
    }

    public getSelectionCountriesExcluded(idSelectionProject): Observable<any> {
        return this.get<any>(this.serUrl.getSelectionCountriesExcluded, { idSelectionProject });
    }

    public getSelectionMediacodeExcluded(idSelectionProject, idSelectionProjectCountry): Observable<any> {
        return this.get<any>(this.serUrl.getSelectionMediacodeExcluded, { idSelectionProject, idSelectionProjectCountry });
    }

    public saveProjectExclude(data): Observable<any> {
        return this.post<any>(this.serUrl.saveProjectExclude, JSON.stringify(data));
    }
}
