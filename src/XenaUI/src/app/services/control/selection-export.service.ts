import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../base.service';

@Injectable()
export class SelectionExportService extends BaseService {
  constructor(injector: Injector) {
    super(injector);
  }

  public getDataExport(
    idSelectionProject: any,
    idCountryLanguage?: any,
    idSelectionProjectCountry?: any
  ): Observable<any> {
    return this.get<any>(
      this.serUrl.getSelectionDataExport,
      {
        idSelectionProject,
        idCountryLanguage,
        idSelectionProjectCountry,
      },
      null,
      null
    );
  }

  public exportAll(
    idSelectionProject: any,
    projectName: string,
    email: string,
    fileType: string,
    csvDelimiter: string
  ): Observable<any> {
    return this.get<any>(
      this.serUrl.exportAll,
      { idSelectionProject, projectName, email, fileType, csvDelimiter },
      null,
      null
    );
  }

  public exportMediaCode(
    idSelectionProject: any,
    projectName: string,
    fileType: string
  ): Observable<any> {
    return this.get<any>(
      this.serUrl.exportSelectionMediaCode,
      { idSelectionProject, projectName, fileType },
      null,
      null
    );
  }

  public exportData(
    idSelectionProject: any,
    idCountryLanguage?,
    idSelectionProjectCountry?,
    csvDelimiter?
  ): Observable<any> {
    return this.get<any>(
      this.serUrl.exportSelectionData,
      {
        idSelectionProject,
        idCountryLanguage,
        idSelectionProjectCountry,
        csvDelimiter,
      },
      null,
      null
    );
  }
}
