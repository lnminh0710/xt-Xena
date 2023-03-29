import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../base.service';

@Injectable()
export class BlockedOrderService extends BaseService {
  constructor(injector: Injector) {
    super(injector);
  }

  public getTextTemplate(idRepSalesOrderStatus?: number): Observable<any> {
    return this.get<any>(this.serUrl.getTextTemplate, {
      idRepSalesOrderStatus: idRepSalesOrderStatus,
    });
  }

  public getMailingListOfPlaceHolder(): Observable<any> {
    return this.get<any>(this.serUrl.getMailingListOfPlaceHolder);
  }

  public getListOfMandantsByIdSalesOrder(
    idSalesOrder: string
  ): Observable<any> {
    return this.get<any>(this.serUrl.getListOfMandantsByIdSalesOrder, {
      idSalesOrder: idSalesOrder,
    });
  }

  public getListOfMandantsByIdPerson(idPerson: string): Observable<any> {
    return this.get<any>(this.serUrl.getListOfMandantsByIdPerson, {
      idPerson: idPerson,
    });
  }

  public getLetterTypeByMandant(mandants: string): Observable<any> {
    return this.get<any>(this.serUrl.getLetterTypeByMandant, {
      mandants: mandants,
    });
  }

  public getLetterTypeByWidgetAppId(idRepWidgetApp: string): Observable<any> {
    return this.get<any>(this.serUrl.getLetterTypeByWidgetAppId, {
      idRepWidgetApp: idRepWidgetApp,
    });
  }

  public getGroupAndItemsByLetterType(letterTypeId: string): Observable<any> {
    return this.get<any>(this.serUrl.getGroupAndItemsByLetterType, {
      letterTypeId: letterTypeId,
    });
  }

  public getAssignWidgetByLetterTypeId(
    idBackOfficeLetters?: string
  ): Observable<any> {
    return this.get<any>(this.serUrl.getAssignWidgetByLetterTypeId, {
      idBackOfficeLetters: idBackOfficeLetters,
    });
  }

  public getAllTypeOfAutoLetter(): Observable<any> {
    return this.get<any>(this.serUrl.getAllTypeOfAutoLetter);
  }

  public getCountriesLanguageByLetterTypeId(
    idBackOfficeLetters?: string
  ): Observable<any> {
    return this.get<any>(this.serUrl.getCountriesLanguageByLetterTypeId, {
      idBackOfficeLetters: idBackOfficeLetters,
    });
  }

  public getListOfTemplate(idBackOfficeLetters?: string): Observable<any> {
    return this.get<any>(this.serUrl.getListOfTemplate, {
      idBackOfficeLetters: idBackOfficeLetters,
    });
  }

  /** Post request */

  public saveTextTemplate(emailTemplateModel: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveTextTemplate,
      JSON.stringify(emailTemplateModel)
    );
  }

  public saveSalesOrderLetters(saveModel: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveSalesOrderLetters,
      JSON.stringify(saveModel)
    );
  }

  public saveSalesOrderLettersConfirm(saveModel: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveSalesOrderLettersConfirm,
      JSON.stringify(saveModel)
    );
  }

  public saveSalesCustomerLetters(saveModel: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveSalesCustomerLetters,
      JSON.stringify(saveModel)
    );
  }

  public saveBackOfficeLetters(saveModel: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveBackOfficeLetters,
      JSON.stringify(saveModel)
    );
  }

  public saveBackOfficeLettersTest(saveModel: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveBackOfficeLettersTest,
      JSON.stringify(saveModel)
    );
  }

  public saveBackOfficeLettersTestGeneratedDoc(
    saveModel: any
  ): Observable<any> {
    return this.post<any>(
      this.serUrl.saveBackOfficeLettersTestGeneratedDoc,
      JSON.stringify(saveModel)
    );
  }

  public deleteSAV(idGenerateLetter: any): Observable<any> {
    return this.post<any>(
      this.serUrl.deteleSAV,
      JSON.stringify({ IdGenerateLetter: idGenerateLetter })
    );
  }
}
