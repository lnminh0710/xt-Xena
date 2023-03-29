import { Injectable, Injector, Inject, forwardRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PersonModel, ApiResultResponse } from 'app/models';
import { BaseService } from '../base.service';
import { ObservableShareService } from 'app/services';
import { Uti } from 'app/utilities';

@Injectable()
export class PersonService extends BaseService {
  constructor(
    injector: Injector,
    @Inject(forwardRef(() => ObservableShareService))
    private obserableShareService: ObservableShareService
  ) {
    super(injector);
  }

  public loadCommunication(id: string): Observable<any> {
    return this.get<any>(this.serUrl.loadCommunication, {
      idPersonInterface: id,
    }).map((result: any) => {
      return result.item;
    });
  }

  public preLoadBusinessLogic(
    mediaCode: string
  ): Observable<ApiResultResponse> {
    return this.get<any>(this.serUrl.preLoadBusinessLogic, {
      mediaCode: mediaCode,
    });
  }

  public getPersonById(idPerson: string): Observable<ApiResultResponse> {
    //only cache for get label
    if (!idPerson) {
      const cacheKey = 'ODE-ScanningStatus-getPersonLabel:';
      return BaseService.cacheService.get(
        cacheKey,
        this.get<any>(this.serUrl.getPersonById, {
          idPerson: idPerson,
        })
      );
    }

    return this.get<any>(this.serUrl.getPersonById, {
      idPerson: idPerson,
    });
  }

  public getPaymentAccountById(id: string): Observable<PersonModel> {
    return this.get<any>(this.serUrl.getPaymentAccountById, {
      idCashProviderPaymentTerms: id,
    }).map((result: any) => {
      return result.item;
    });
  }

  public getCCPRN(idCashProviderContract: string): Observable<PersonModel> {
    return this.get<any>(this.serUrl.getCCPRN, {
      idCashProviderContract: idCashProviderContract,
    }).map((result: any) => {
      return result.item;
    });
  }

  public createPerson(person: any, searchIndexKey?: string): Observable<any> {
    person = Uti.convertDataEmptyToNull(person);
    return this.post<any>(this.serUrl.createPerson, JSON.stringify(person), {
      searchIndexKey: searchIndexKey,
    }).map((result: any) => {
      return result.item;
    });
  }

  public updatePerson(person: any, searchIndexKey?: string): Observable<any> {
    person = Uti.convertDataEmptyToNull(person);
    return this.post<any>(this.serUrl.updatePerson, JSON.stringify(person), {
      searchIndexKey: searchIndexKey,
    }).map((result: any) => {
      return result.item;
    });
  }

  public createPaymentAccount(paymentAccount: any): Observable<any> {
    return this.post<any>(
      this.serUrl.createPaymentAccount,
      JSON.stringify(paymentAccount)
    ).map((result: any) => {
      return result.item;
    });
  }

  public createCostProvider(costProvider: any): Observable<any> {
    return this.post<any>(
      this.serUrl.createCostProvider,
      JSON.stringify(costProvider)
    ).map((result: any) => {
      return result.item;
    });
  }

  public createCCPRN(cCCPRNData: any): Observable<any> {
    return this.post<any>(
      this.serUrl.createCCPRN,
      JSON.stringify(cCCPRNData)
    ).map((result: any) => {
      return result.item;
    });
  }

  public getCustomerHistory(
    idPerson: string,
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    return this.get<any>(this.serUrl.getCustomerHistory, {
      idPerson: idPerson,
      pageIndex: pageIndex,
      pageSize: pageSize,
    });
  }

  public getMandatoryField(mode: string): Observable<any> {
    //only cache for mode 'Customer'
    if (mode === 'Customer') {
      const cacheKey = 'ODE-ScanningStatus-getMandatoryField:Customer';
      return BaseService.cacheService.get(
        cacheKey,
        this.get<any>(this.serUrl.getMandatoryField, {
          mode: mode,
        })
      );
    }

    return this.get<any>(this.serUrl.getMandatoryField, {
      mode: mode,
    });
  }

  public getPersonData(idPersons: string): Observable<any> {
    return this.get<any>(this.serUrl.getPersonData, {
      idPersons: idPersons,
    });
  }
}
