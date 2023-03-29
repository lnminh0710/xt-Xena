import { Injectable, Injector, Inject, forwardRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../base.service';
import { DatatableService, ObservableShareService } from 'app/services';
import { ParkedItemListResult } from './parked-item.service';
import { ModuleList } from 'app/pages/private/base';
import { ParkedItemModel } from 'app/models';
import isEmpty from 'lodash-es/isEmpty';
import camelCase from 'lodash-es/camelCase';
import { Uti } from 'app/utilities';

@Injectable()
export class DataEntryService extends BaseService {
  public loadBufferOrderKeys = {
    getPreloadOrderData: 'ODE-ScanningStatus-getPreloadOrderData:',
    getCustomerData: 'ODE-ScanningStatus-getCustomerData:',
    getArticleData: 'ODE-ScanningStatus-getArticleData:',
    getMainCurrencyAndPaymentType:
      'ODE-ScanningStatus-getMainCurrencyAndPaymentType:',
    getMainCurrencyAndPaymentTypeForOrder:
      'Order-ScanningStatus-getMainCurrencyAndPaymentType:',
    getPersonLabel: 'ODE-ScanningStatus-getPersonLabel:',
    getMandatoryField: 'ODE-ScanningStatus-getMandatoryField:Customer',
  };

  constructor(
    injector: Injector,
    @Inject(forwardRef(() => DatatableService))
    public datatableService: DatatableService,
    @Inject(forwardRef(() => ObservableShareService))
    private obserableShareService: ObservableShareService
  ) {
    super(injector);
  }

  public getMainCurrencyAndPaymentType(
    mediacode: string,
    campaignNr: string,
    useCache?: boolean
  ): Observable<any> {
    if (useCache) {
      const cacheKey =
        this.loadBufferOrderKeys.getMainCurrencyAndPaymentType +
        mediacode +
        campaignNr;

      return BaseService.cacheService
        .get(
          cacheKey,
          this.get<any>(this.serUrl.getMainCurrencyAndPaymentType, {
            mediacode: mediacode,
            campaignNr: campaignNr,
          })
        )
        .map((result: any) => {
          return result.item;
        });
    }

    return this.get<any>(this.serUrl.getMainCurrencyAndPaymentType, {
      mediacode: mediacode,
      campaignNr: campaignNr,
    }).map((result: any) => {
      return result.item;
    });
  }

  public getMainCurrencyAndPaymentTypeForOrder(
    mediacode: string,
    campaignNr: string,
    useCache?: boolean
  ): Observable<any> {
    if (useCache) {
      const cacheKey =
        this.loadBufferOrderKeys.getMainCurrencyAndPaymentTypeForOrder +
        mediacode +
        campaignNr;

      return BaseService.cacheService
        .get(
          cacheKey,
          this.get<any>(this.serUrl.getMainCurrencyAndPaymentTypeForOrder, {
            mediacode: mediacode,
            campaignNr: campaignNr,
          })
        )
        .map((result: any) => {
          return result.item;
        });
    }

    return this.get<any>(this.serUrl.getMainCurrencyAndPaymentTypeForOrder, {
      mediacode: mediacode,
      campaignNr: campaignNr,
    }).map((result: any) => {
      return result.item;
    });
  }

  public getArticleDataByMediacodeNr(
    mediacode: string,
    useCache?: boolean
  ): Observable<any> {
    if (useCache) {
      const cacheKey = this.loadBufferOrderKeys.getArticleData + mediacode;
      return BaseService.cacheService
        .get(
          cacheKey,
          this.get<any>(this.serUrl.getArticleData, {
            mediacode: mediacode,
          })
        )
        .map((result: any) => {
          return result.item;
        });
    }

    return this.get<any>(this.serUrl.getArticleData, {
      mediacode: mediacode,
    }).map((result: any) => {
      return result.item;
    });
  }

  public getCustomerDataByCustomerNr(
    customerNr: string,
    useCache?: boolean,
    mediaCode?: string
  ): Observable<any> {
    if (!mediaCode) {
      mediaCode = null;
    }
    if (useCache) {
      let cacheKey = this.loadBufferOrderKeys.getCustomerData + customerNr;
      if (mediaCode) {
        cacheKey += '-' + mediaCode;
      }

      return BaseService.cacheService
        .get(
          cacheKey,
          this.get<any>(this.serUrl.getCustomerData, {
            customerNr: customerNr,
            mediaCode: mediaCode,
          })
        )
        .map((result: any) => {
          return result.item;
        });
    }

    return this.get<any>(this.serUrl.getCustomerData, {
      customerNr: customerNr,
      mediaCode: mediaCode,
    }).map((result: any) => {
      return result.item;
    });
  }

  public getPreloadOrderData(
    skipIdPreload?: any,
    idScansContainerItems?: any,
    lotId?: any
  ): Observable<any> {
    let params: any = {
      skipIdPreload: skipIdPreload,
      idScansContainerItems: idScansContainerItems,
      lotId: lotId,
    };
    if (params.skipIdPreload) {
      params.mode = 'Skip';
    }

    return this.get<any>(this.serUrl.getPreloadOrderData, params).map(
      (result: any) => {
        return result.item;
      }
    );
  }

  public saveOrderDataEntry(
    data: any,
    ignoreBarProcess?: boolean
  ): Observable<any> {
    return this.post<any>(
      this.serUrl.saveOrderDataEntry,
      JSON.stringify(data),
      null,
      null,
      null,
      ignoreBarProcess
    ).map((result: any) => {
      return result.item;
    });
  }

  public savePaymentForOrder(
    data: any,
    ignoreBarProcess?: boolean
  ): Observable<any> {
    return this.post<any>(
      this.serUrl.savePaymentForOrder,
      JSON.stringify(data),
      null,
      null,
      null,
      ignoreBarProcess
    ).map((result: any) => {
      return result.item;
    });
  }

  public sendOrderToAdministrator(data: any): Observable<any> {
    return this.post<any>(
      this.serUrl.sendOrderToAdministrator,
      JSON.stringify(data)
    ).map((result: any) => {
      return result.item;
    });
  }

  public buildImageFullPath(data, ext?: string) {
    if (!data || !data.length) {
      return '';
    }

    return encodeURIComponent(
      data[0].fileUrl +
        '\\' +
        data[0].fileName +
        '.' +
        data[0].numberOfImages / data[0].numberOfImages +
        (ext || '.png')
    );
  }

  public buildListImages(data) {
    if (!data || !data.length) {
      return [];
    }

    let total = data[0].numberOfImages;
    let urls: any[] = [];

    for (let i = 1; i <= total; i++) {
      urls.push({
        index: i,
        url: encodeURIComponent(
          data[0].fileUrl + '\\' + data[0].fileName + '.' + i + '.png'
        ),
      });
    }

    return urls;
  }

  public buildPreloadImagesPath(data) {
    let result: any[] = [];

    data.forEach((item) => {
      result.push(this.buildImageFullPath([item]));
    });

    return result;
  }

  public getOrderDataEntryByLogin(
    mode: string,
    dateFrom?: string,
    dateTo?: string
  ): Observable<any> {
    return this.get<any>(this.serUrl.getOrderDataEntryByLogin, {
      mode: mode,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    });
  }

  public getTotalDataEntryByLogin(): Observable<any> {
    return this.get<any>(this.serUrl.getTotalDataEntryByLogin);
  }

  //#region OrderFailed
  private getOrderFailedKey(tabID, idScansContainerItems) {
    return 'ODE-Failed:' + tabID + '-' + idScansContainerItems;
  }

  public getOrderFailed(
    tabID: string,
    idScansContainerItems: string
  ): Observable<any> {
    const key = this.getOrderFailedKey(tabID, idScansContainerItems);
    const content = localStorage.getItem(key);
    //get from localStorage if have
    if (content) return Observable.of(content);

    //get from file
    return this.get<any>(this.serUrl.getOrderFailed, {
      tabID: tabID,
      idScansContainerItems: idScansContainerItems,
    }).map((result: any) => {
      return result.item;
    });
  }

  public saveOrderFailed(data: any): Observable<any> {
    const jsonData = JSON.stringify(data);

    //save localStorage
    const key = this.getOrderFailedKey(data.TabID, data.IdScansContainerItems);
    localStorage.setItem(key, jsonData);

    //save file
    return this.post<any>(this.serUrl.saveOrderFailed, jsonData).map(
      (result: any) => {
        //delete localStorage after saving file successfully
        if (result.item && result.item.success) {
          localStorage.removeItem(key);
        }

        return result.item ? result.item.success : null;
      }
    );
  }

  public deleteOrderFailed(
    tabID: string,
    idScansContainerItems: string
  ): Observable<any> {
    let data = {
      TabID: tabID,
      IdScansContainerItems: idScansContainerItems,
    };
    const jsonData = JSON.stringify(data);

    //delete file
    return this.post<any>(this.serUrl.deleteOrderFailed, jsonData).map(
      (result: any) => {
        //delete localStorage after deleting file successfully
        if (result.item && result.item.success) {
          //delete localStorage
          const key = this.getOrderFailedKey(tabID, data.IdScansContainerItems);
          localStorage.removeItem(key);
        }

        return result.item ? result.item.success : null;
      }
    );
  }

  public deleteAllOrderFailed(tabID: string): Observable<any> {
    let data = {
      TabID: tabID,
    };
    const jsonData = JSON.stringify(data);

    //delete all files
    return this.post<any>(this.serUrl.deleteAllOrderFailed, jsonData).map(
      (result: any) => {
        if (result.item && result.item.success) {
          const prefixKey = 'ODE-Failed:' + tabID;
          Object.keys(localStorage).forEach((key) => {
            if (key.indexOf(prefixKey) !== -1) {
              localStorage.removeItem(key);
            } //if
          });
        }

        return result.item ? result.item.success : null;
      }
    );
  }

  public getListOrderFailed(
    tabID: string,
    pageIndex?: number,
    pageSize?: number
  ): Observable<any> {
    pageIndex = pageIndex || 0;
    pageSize = pageSize || 20;
    const isGetSummaryFile = true;

    //get list files from HardDisk
    return this.get<any>(this.serUrl.getListOrderFailed, {
      tabID: tabID,
      pageIndex: pageIndex,
      pageSize: pageSize,
      isGetSummaryFile: isGetSummaryFile,
    }).map((rs: any) => {
      const result: ParkedItemListResult = new ParkedItemListResult();
      result.module = ModuleList.OrderDataEntry;

      if (isEmpty(rs.item)) return result;

      result.collectionParkedtems = [];
      if (rs.item.collectionParkedtems) {
        for (const item of rs.item.collectionParkedtems) {
          const parkedItem = new ParkedItemModel(item);
          parkedItem.id = parkedItem[camelCase(rs.item.keyName)];

          const sysCreatedate =
            parkedItem.sysCreatedate || parkedItem.sysCreatedate;
          if (sysCreatedate && sysCreatedate.value) {
            parkedItem.createDateValue = Uti.parseISODateToDate(
              sysCreatedate.value
            );
          }

          result.collectionParkedtems.push(parkedItem);
        }
      }
      result.idSettingsModule = rs.item.idSettingsModule;
      result.keyName = rs.item.keyName;
      return result;
    });
  }

  public hasOrderFailedInLocalStorage(): boolean {
    const index = Object.keys(localStorage).findIndex(
      (key) => key.indexOf('ODE-Failed:') !== -1
    );
    return index != null && index != -1;
  }

  public syncOrderFailedFromLocalStorageToFiles() {
    let observableBatch = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.indexOf('ODE-Failed:') !== -1) {
        const content = localStorage.getItem(key);
        if (content) {
          observableBatch.push(
            //save file
            this.post<any>(this.serUrl.saveOrderFailed, content).map(
              (result: any) => {
                //delete localStorage after saving file successfully
                if (result.item && result.item.success) {
                  localStorage.removeItem(key);
                }
                return result;
              }
            )
          );
        } //if
      } //if
    });

    if (observableBatch.length) return Observable.forkJoin(observableBatch);

    return Observable.of(null);
  }
  //#endregion

  public getRejectPayments(idPerson): Observable<any> {
    return this.get<any>(this.serUrl.getRejectPayments, {
      idPerson: idPerson,
    }).map((result: any) => {
      return result.item;
    });
  }

  public getSalesOrderById(idSalesOrder): Observable<any> {
    return this.get<any>(this.serUrl.getSalesOrderById, {
      idSalesOrder: idSalesOrder,
    }).map((result: any) => {
      return result.item;
    });
  }

  public deleteOrderDataEntry(idScansContainerItems: string): Observable<any> {
    let data = {
      IdScansContainerItems: idScansContainerItems,
    };
    const jsonData = JSON.stringify(data);

    //delete file
    return this.post<any>(this.serUrl.deleteOrderData, jsonData);
  }
}
