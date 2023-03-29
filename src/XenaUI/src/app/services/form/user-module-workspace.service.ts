import { Injectable, Injector, Inject, forwardRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../base.service';
import { Uti } from 'app/utilities';
import { WidgetDetail } from 'app/models';
import { WidgetTemplateSettingService } from 'app/services';

@Injectable()
export class UserModuleWorkspaceService extends BaseService {
  constructor(
    injector: Injector,
    @Inject(forwardRef(() => WidgetTemplateSettingService))
    private widgetTemplateSettingService: WidgetTemplateSettingService
  ) {
    super(injector);
  }

  public getAllWorkspaceTemplates(moduleId): Observable<any> {
    return this.get<any>(this.serUrl.getWorkspaceTemplate, {
      objectNr: moduleId,
    });
  }

  public getWorkspaceTemplate(idWorkspaceTemplate, moduleId): Observable<any> {
    return this.get<any>(this.serUrl.getWorkspaceTemplateSharing, {
      idWorkspaceTemplate,
      objectNr: moduleId,
    });
  }

  public applyWorkspaceTemplate(data: any): Observable<any> {
    return this.post<any>(
      this.serUrl.applyWorkspaceTemplate,
      JSON.stringify(data)
    );
  }

  public applyWorkspaceTemplateAll(data: any): Observable<any> {
    return this.post<any>(
      this.serUrl.applyWorkspaceTemplateAll,
      JSON.stringify(data)
    );
  }

  public saveWorkspaceTemplate(data: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveWorkspaceTemplate,
      JSON.stringify(data)
    );
  }

  public saveWorkspaceTemplateAll(data: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveWorkspaceTemplateAll,
      JSON.stringify(data)
    );
  }

  public deleteWorkspaceTemplate(data: any): Observable<any> {
    return this.post<any>(
      this.serUrl.deleteWorkspaceTemplate,
      JSON.stringify(data)
    );
  }

  public saveDefaultWorkspaceTemplate(data: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveDefaultWorkspaceTemplate,
      JSON.stringify(data)
    );
  }
}
