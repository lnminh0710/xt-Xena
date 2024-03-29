import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GlobalSettingModel } from 'app/models';
import { BaseService } from '../base.service';

@Injectable()
export class GlobalSettingService extends BaseService {
  constructor(protected injector: Injector) {
    super(injector);

    if (this.router.url === this.config.loginUrl) {
      return;
    }
  }

  public getAllGlobalSettings(
    idSettingsGUI?: any
  ): Observable<GlobalSettingModel[]> {
    if (idSettingsGUI == '-1') {
      const settings = BaseService.cacheService.getValue(
        'getAllGlobalSettings:-1'
      );
      if (settings) {
        return Observable.of(settings);
      }
    }

    idSettingsGUI = idSettingsGUI || '-1';
    return BaseService.cacheService.get(
      'getAllGlobalSettings:' + idSettingsGUI,
      this.get<GlobalSettingModel[]>(this.serUrl.getAllGlobalSettings, {
        idSettingsGUI: idSettingsGUI,
      }).map((result: any) => {
        return result.item;
      })
    );
  }

  public getAllGlobalSettingsRefreshPageLayout(
    idSettingsGUI?: any
  ): Observable<GlobalSettingModel[]> {
    idSettingsGUI = idSettingsGUI || '-1';
    return this.get<GlobalSettingModel[]>(this.serUrl.getAllGlobalSettings, {
      idSettingsGUI: idSettingsGUI,
    }).map((result: any) => {
      return result.item;
    });
  }

  public getModuleLayoutSetting(
    idSettingsGUI: any,
    moduleNameTrim: any
  ): Observable<any> {
    return this.getAllGlobalSettings(idSettingsGUI).map((data: any) => {
      const globalSettingName = 'ModuleLayoutSetting_' + moduleNameTrim;
      const globalSettingItem = data.find(
        (x) => x.globalName === globalSettingName
      );
      const moduleSetting = JSON.parse(globalSettingItem.jsonSettings);
      return moduleSetting.item;
    });
  }

  public getAdvanceSearchProfile(
    moduleId?: any
  ): Observable<GlobalSettingModel[]> {
    return this.get<any>(this.serUrl.getAdvanceSearchProfile, {
      moduleId: moduleId,
    });
  }

  public saveGlobalSetting(globalSetting: GlobalSettingModel): Observable<any> {
    return this.post<any>(
      this.serUrl.SaveGlobalSetting,
      JSON.stringify(globalSetting)
    ).map((result: any) => {
      return result.item;
    });
  }

  public saveUpdateCache(
    idSettingsGUI: any,
    globalSetting: GlobalSettingModel,
    resultData?: any
  ) {
    if (!globalSetting) return;

    globalSetting.idSettingsGlobal = globalSetting.idSettingsGlobal
      ? globalSetting.idSettingsGlobal
      : resultData
      ? resultData.returnValue
      : null;

    const currentGlobalSetting = BaseService.cacheService.getValue(
      'getAllGlobalSettings:' + idSettingsGUI
    );
    if (currentGlobalSetting && currentGlobalSetting instanceof Array) {
      let found = false;
      for (let i = 0; i < currentGlobalSetting.length; i++) {
        const globalSettingItem = currentGlobalSetting[i];
        if (
          globalSettingItem.idSettingsGlobal ==
            globalSetting.idSettingsGlobal ||
          (!globalSettingItem.idSettingsGlobal &&
            globalSettingItem.globalType == 'ModuleLayoutSetting' &&
            globalSettingItem.objectNr == globalSetting.objectNr &&
            globalSettingItem.globalName == globalSetting.globalName &&
            globalSettingItem.globalType == globalSetting.globalType)
        ) {
          found = true;
          currentGlobalSetting[i] = globalSetting;
        }
      }

      if (!found) {
        currentGlobalSetting.push(globalSetting);
        BaseService.cacheService.set(
          'getAllGlobalSettings:' + idSettingsGUI,
          currentGlobalSetting
        );
      }
    } else {
      BaseService.cacheService.set(
        'getAllGlobalSettings:' + idSettingsGUI,
        globalSetting
      );
    }
  }

  public deleteGlobalSettingById(idSettingsGlobal: number): Observable<any> {
    return this.post(this.serUrl.DeleteGlobalSettingById, null, {
      idSettingsGlobal: idSettingsGlobal,
    }).map((result: any) => {
      return result.item;
    });
  }

  //#region GlobalSettingCached
  /*
    private globalSettingCached: GlobalSettingModel[];
    private isCached = false;

    public getGlobalSettingById(id: number): Observable<GlobalSettingModel> {
        if (this.isCached) {
            return Observable.of(this.globalSettingCached).map(object => {
                return object.find(item => item.idSettingsGlobal == id);
            });
        } else {
            return this.get<GlobalSettingModel>(this.serUrl.GetGlobalSettingById).map((result: any) => {
                return result.item;
            });
        }
    }

    public saveUpdateGlobalSettingInCached(globalSetting: GlobalSettingModel, resultData: any) {
        if (!globalSetting) return;

        globalSetting.idSettingsGlobal = globalSetting.idSettingsGlobal ? globalSetting.idSettingsGlobal : resultData.returnValue;
        this.removeGlobalSettingInCached(globalSetting);
        if (this.globalSettingCached) {
            this.globalSettingCached.push(globalSetting);
        }
    }

    public clearCached() {
        this.isCached = false;
        this.globalSettingCached = null;
    }

    private removeGlobalSettingInCached(globalSetting: GlobalSettingModel) {
        if (!this.globalSettingCached) { return; }
        for (let i = 0; i < this.globalSettingCached.length; i++) {
            if (this.globalSettingCached[i].idSettingsGlobal === globalSetting.idSettingsGlobal) {
                this.globalSettingCached.splice(i, 1);
                break;
            }
        }
    }
    */
  //#endregion

  public getMultiTranslateLabelText(
    originalText: string,
    widgetMainID: string,
    widgetCloneID: string,
    idRepTranslateModuleType: string,
    idTable?: string,
    fieldName?: string,
    tableName?: string
  ): Observable<any> {
    return this.get<any>(this.serUrl.getMultiTranslateLabelText, {
      originalText: originalText,
      widgetMainID: widgetMainID,
      widgetCloneID: widgetCloneID,
      idRepTranslateModuleType: idRepTranslateModuleType,
      idTable: idTable,
      fieldName: fieldName,
      tableName: tableName,
    }).map((result: any) => {
      return result.item;
    });
  }

  public getSystemTranslateText(): Observable<any> {
    return this.get<any>(this.serUrl.getSystemTranslateText).map(
      (result: any) => {
        return result.item;
      }
    );
  }

  public getCommonTranslateLabelText(): Observable<any> {
    return this.get<any>(this.serUrl.getCommonTranslateLabelText).map(
      (result: any) => {
        if (result && result.item && result.item.data) {
          const data: Array<any> = result.item.data[0];
          if (data && data.length) {
            const translateObj = {};
            data.forEach((item) => {
              const key = item.OriginalText;
              const value: string = item.TranslatedText;
              if (value && value.trim()) {
                translateObj[key] = value;
              }
            });
            return translateObj;
          }
        }
        return null;
      }
    );
  }

  public getTranslateLabelText(
    originalText: string,
    widgetMainID: string,
    widgetCloneID: string,
    idRepTranslateModuleType: string,
    idTable?: string,
    fieldName?: string,
    tableName?: string
  ): Observable<any> {
    return this.get<any>(this.serUrl.getTranslateLabelText, {
      originalText: originalText,
      widgetMainID: widgetMainID,
      widgetCloneID: widgetCloneID,
      idRepTranslateModuleType: idRepTranslateModuleType,
      idTable: idTable,
      fieldName: fieldName,
      tableName: tableName,
    }).map((result: any) => {
      return result.item;
    });
  }

  public saveTranslateLabelText(data: any): Observable<any> {
    return this.post<any>(
      this.serUrl.saveTranslateLabelText,
      JSON.stringify(data)
    ).map((result: any) => {
      return result.item;
    });
  }

  public getPaymentPriceChange(
    priceToChange: number,
    currency: any
  ): Observable<any> {
    return Observable.of({ priceChanged: priceToChange });
    // return this.get<any>(this.serUrl.getDetailSubModule, { priceToChange: priceToChange, currency: currency });
  }

  public getTranslateText(
    widgetMainID: number,
    widgetCloneID: string,
    fields: string
  ): Observable<any> {
    return this.get<any>(this.serUrl.getTranslateText, {
      widgetMainID: widgetMainID,
      widgetCloneID: widgetCloneID,
      fields: fields,
    }).map((result: any) => {
      return result.item;
    });
  }

  public getFieldTableName(fieldName, widgetData) {
    if (widgetData && widgetData.columns) {
      const thisColumn = widgetData.columns.find(
        (v) => v.setting.ColumnName === fieldName
      );
      if (thisColumn) {
        const originalColumnName = thisColumn.setting['OriginalColumnName'];
        return originalColumnName.split('_')[0];
      }
    }

    if (!fieldName || !widgetData || !widgetData.contentDetail) {
      return null;
    }

    if (
      widgetData.contentDetail.columnSettings &&
      widgetData.contentDetail.columnSettings[fieldName]
    ) {
      const originalColumnName =
        widgetData.contentDetail.columnSettings[fieldName][
          'OriginalColumnName'
        ];
      return originalColumnName.split('_')[0];
    }

    if (
      widgetData.contentDetail.data &&
      widgetData.contentDetail.data.length &&
      widgetData.contentDetail.data.length > 1 &&
      widgetData.contentDetail.data[1] &&
      widgetData.contentDetail.data[1].length
    ) {
      const thisCol = widgetData.contentDetail.data[1].find(
        (c) => c.ColumnName == fieldName
      );
      if (thisCol) {
        const originalColumnName = thisCol['OriginalColumnName'];
        return originalColumnName.split('_')[0];
      }
    }

    return null;
  }

  /**
   * getDynamicRulesType
   */
  public getDynamicRulesType(): Observable<any> {
    return this.get<any>(this.serUrl.getDynamicRulesType);
  }
}
