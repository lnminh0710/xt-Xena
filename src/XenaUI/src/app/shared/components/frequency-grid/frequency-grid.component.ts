import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ControlGridColumnModel,
  ApiResultResponse,
  TabSummaryModel,
  GlobalSettingModel,
} from 'app/models';
import {
  DatatableService,
  AppErrorHandler,
  CountrySelectionService,
  FrequencyService,
  GlobalSettingService,
} from 'app/services';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import camelCase from 'lodash-es/camelCase';
import cloneDeep from 'lodash-es/cloneDeep';
import isNaN from 'lodash-es/isNaN';
import { WijmoGridComponent } from 'app/shared/components/wijmo';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import {
  GridActions,
  ProcessDataActions,
  FilterActions,
  ParkedItemActions,
  AdditionalInformationActions,
  CustomAction,
  WidgetDetailActions,
  TabSummaryActions,
} from 'app/state-management/store/actions';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Uti } from 'app/utilities';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { GuidHelper } from 'app/utilities/guild.helper';
import { SplitComponent } from 'angular-split';
import { FilterModeEnum } from 'app/app.constants';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as moduleSettingReducer from 'app/state-management/store/reducer/module-setting';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import { XnAgGridComponent } from '../xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';

const ID_STRING = {
  COUNTRY_ID: 'IdSelectionProjectCountry',
  COUNTRY_LANGUAGE_ID: 'IdCountrylanguage',
  PRIORITY: 'Priority',
  QTY_TO_NEEDED: 'QtyToNeeded',
};

const MAPPING = {
  50: {
    font: 8,
    ratio: 0.5,
  },
  60: {
    font: 9,
    ratio: 0.6,
  },
  70: {
    font: 10,
    ratio: 0.7,
  },
  80: {
    font: 11,
    ratio: 0.8,
  },
  90: {
    font: 12,
    ratio: 0.9,
  },
  100: {
    font: 13,
    ratio: 1,
  },
  110: {
    font: 14,
    ratio: 1.1,
  },
  120: {
    font: 15,
    ratio: 1.2,
  },
  130: {
    font: 16,
    ratio: 1.3,
  },
  140: {
    font: 17,
    ratio: 1.4,
  },
  150: {
    font: 18,
    ratio: 1.5,
  },
};

@Component({
  selector: 'frequency-grid',
  templateUrl: './frequency-grid.component.html',
  styleUrls: ['./frequency-grid.component.scss'],
})
export class FrequencyGridComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public showLoading = false;
  public countryGridData: any;
  public frequencyGridData: any;
  public perfectScrollbarConfig: any = {};
  public noFilterColumns: string[] = [];
  private widgetListenKey = null;
  private selectedEntity: any = null;
  public selectedCountry: any;
  private cacheData: any = {};
  public splitterConfig = {
    leftHorizontal: 20,
    rightHorizontal: 80,
  };
  private isCountryPanelCollapse = false;
  private previousVisibleColumns: string[] = [];
  private originalFrequencyColumnsWidth: any[];
  private originalFrequencyRowsHeight: any[];
  private selectedTab: TabSummaryModel;
  private currentLoadingStep = 0;
  private totalLoadingSteps = 0;
  private loadingInterval: any = null;
  public percentage: number = 0;
  private ignoreCache = false;
  private showCountriesUpdatedWarning = false;

  private selectedEntityStateSubscription: Subscription;
  private widgetListenKeyState: Observable<string>;
  private requestSaveWidgetState: Observable<any>;
  private requestResetWidgetState: Observable<any>;
  private selectedTabState: Observable<TabSummaryModel>;
  private selectionCountriesAreUpdatedState: Observable<any>;

  private selectedEntityState: Observable<any>;
  private widgetListenKeyStateSubscription: Subscription;
  private requestSaveWidgetStateSubscription: Subscription;
  private countrySelectionServiceSubscription: Subscription;
  private frequencyServiceSubscription: Subscription;
  private rebuildFrequenciesServiceSubscription: Subscription;
  private requestResetWidgetStateSubscription: Subscription;
  private selectedTabStateSubscription: Subscription;
  private requestBuildFrequencyStateSubscription: Subscription;
  private selectionCountriesAreUpdatedStateSubscription: Subscription;

  @Input() gridId: string;
  @Input() readOnly = true;
  @Input() globalProperties: any[] = [];
  @Input() fitWidthColumn: boolean = false;
  @Input() idRepWidgetApp = null;

  @Output() onGridEditStart = new EventEmitter<any>();
  @Output() onGridEditEnd = new EventEmitter<any>();
  @Output() onGridEditSuccess = new EventEmitter<any>();
  @Output() onSaveSuccess = new EventEmitter<any>();
  @Output() onCountrySelectionChanged = new EventEmitter<any>();
  @Output() onLoad = new EventEmitter<any>();

  @ViewChild('countryGrid') countryGrid: XnAgGridComponent;
  @ViewChild('frequencyGrid') frequencyGrid: WijmoGridComponent;
  @ViewChild('splitContainer') splitContainerComponent: SplitComponent;

  constructor(
    private elementRef: ElementRef,
    private store: Store<AppState>,
    private appErrorHandler: AppErrorHandler,
    private datatableService: DatatableService,
    private countrySelectionService: CountrySelectionService,
    private frequencyService: FrequencyService,
    private processDataActions: ProcessDataActions,
    private parkedItemActions: ParkedItemActions,
    private additionalInformationActions: AdditionalInformationActions,
    private dispatcher: ReducerManagerDispatcher,
    protected router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private tabSummaryActions: TabSummaryActions,
    private globalSettingService: GlobalSettingService
  ) {
    super(router);

    this.selectedTabState = store.select(
      (state) =>
        tabSummaryReducer.getTabSummaryState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedTab
    );
    this.selectedEntityState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedEntity
    );
    this.widgetListenKeyState = store.select(
      (state) =>
        moduleSettingReducer.getModuleSettingState(
          state,
          this.ofModule.moduleNameTrim
        ).widgetListenKey
    );

    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };
  }

  ngOnInit() {
    setTimeout(() => {
      this.loadSplitterSettings();
    }, 200);

    this._subscribeWidgetListenKeyState();
    this._subcribeSelectedTabState();
    this._subscribeSelectedEntityState();
    this._subscribeRequestSaveWidgetState();
    this._subscribeRequestResetWidgetState();
    this._subscribeRequestBuildFrequencyState();
    this._subscribeSelectionCountriesAreUpdatedState();
  }

  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  ngAfterViewInit() {
    $('split-gutter', this.elementRef.nativeElement).bind(
      'dblclick',
      this.onSplitterDblClick.bind(this)
    );
  }

  ngAfterContentChecked(): void {
    if (
      this.elementRef.nativeElement.offsetParent != null &&
      this.showCountriesUpdatedWarning
    ) {
      this.reload();
      this.showCountriesUpdatedWarning = false;
    }
  }

  private loadSplitterSettings() {
    this.globalSettingService
      .getAllGlobalSettings(-1)
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (data && data.length) {
            let selectionWidgetSplitterSettings = data.filter(
              (p) =>
                p.globalName == this.idRepWidgetApp &&
                p.globalType == 'WidgetSplitter'
            );
            if (
              selectionWidgetSplitterSettings &&
              selectionWidgetSplitterSettings.length
            ) {
              selectionWidgetSplitterSettings.forEach((setting) => {
                this.splitterConfig = JSON.parse(setting.jsonSettings);
                this.splitContainerComponent.updateArea(
                  this.splitContainerComponent.areas[0].component,
                  1,
                  this.splitterConfig.leftHorizontal,
                  20
                );
                this.splitContainerComponent.updateArea(
                  this.splitContainerComponent.areas[1].component,
                  1,
                  this.splitterConfig.rightHorizontal,
                  20
                );
              });
            }

            this.changeDetectorRef.detectChanges();
          }
        });
      });
  }

  private saveSplitterSettings() {
    this.globalSettingService
      .getAllGlobalSettings(-1)
      .subscribe((getAllGlobalSettings) => {
        let selectionWidgetSplitterSettings = getAllGlobalSettings.find(
          (x) =>
            x.globalName == this.idRepWidgetApp &&
            x.globalType == 'WidgetSplitter'
        );
        if (
          !selectionWidgetSplitterSettings ||
          !selectionWidgetSplitterSettings.idSettingsGlobal ||
          !selectionWidgetSplitterSettings.globalName
        ) {
          selectionWidgetSplitterSettings = new GlobalSettingModel({
            globalName: this.idRepWidgetApp,
            globalType: 'WidgetSplitter',
            description: 'WidgetSplitter',
            isActive: true,
          });
        }
        selectionWidgetSplitterSettings.idSettingsGUI = -1;
        selectionWidgetSplitterSettings.jsonSettings = JSON.stringify(
          this.splitterConfig
        );
        selectionWidgetSplitterSettings.isActive = true;

        this.globalSettingService
          .saveGlobalSetting(selectionWidgetSplitterSettings)
          .subscribe((data) => {
            this.globalSettingService.saveUpdateCache(
              '-1',
              selectionWidgetSplitterSettings,
              data
            );
          });
      });
  }

  private loadDataForFrequency() {
    this.rebuildFrequenciesServiceSubscription = this.frequencyService
      .rebuildFrequencies(this.selectedEntity[camelCase(this.widgetListenKey)])
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (Uti.isResquestSuccess(response)) {
          }
        });
      });
  }

  private getFrequencyBusyIndicator() {
    this.percentage = 0;
    this.loadingInterval = setInterval(
      this.processGetFrequencyBusyIndicator.bind(this),
      2000
    );

    this.changeDetectorRef.detectChanges();
  }

  private processGetFrequencyBusyIndicator() {
    this.frequencyService
      .getFrequencyBusyIndicator(
        this.selectedEntity[camelCase(this.widgetListenKey)]
      )
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (
            Uti.isResquestSuccess(response) &&
            response.item &&
            response.item[0] &&
            response.item[0][0]
          ) {
            let elem = document.getElementById('loading-bar');
            if (!elem) {
              return;
            }

            if (
              (!response.item[0][0].CurrentLoop &&
                !response.item[0][0].TotalLoop) ||
              (!this.currentLoadingStep &&
                response.item[0][0].CurrentLoop ==
                  response.item[0][0].TotalLoop)
            ) {
              this.stopInterval(elem);

              this.changeDetectorRef.detectChanges();
              return;
            }

            if (
              this.currentLoadingStep != response.item[0][0].CurrentLoop ||
              this.totalLoadingSteps != response.item[0][0].TotalLoop
            ) {
              this.currentLoadingStep = response.item[0][0].CurrentLoop;
              this.totalLoadingSteps = response.item[0][0].TotalLoop;
              let stepLength = Math.round(100 / this.totalLoadingSteps);

              if (this.currentLoadingStep == this.totalLoadingSteps) {
                this.stopInterval(elem);
              } else {
                this.percentage = this.currentLoadingStep * stepLength;
                elem.style.width = this.percentage + '%';
                document.getElementById('loading-text').innerHTML =
                  response.item[0][0].Info;
              }
            }

            this.changeDetectorRef.detectChanges();
          }
        });
      });
  }

  private stopInterval(elem) {
    this.percentage = 100;
    elem.style.width = this.percentage + '%';
    clearInterval(this.loadingInterval);
    this.loadingInterval = null;

    document.getElementById('loading-info').className =
      'text-green text-center w3-animate-opacity';
    document.getElementById('loading-info').innerHTML = 'Successful';

    this.ignoreCache = true;
    this.reset();
    this.initCountryGridData();

    this.changeDetectorRef.detectChanges();
  }

  private _subscribeWidgetListenKeyState() {
    this.widgetListenKeyStateSubscription = this.widgetListenKeyState.subscribe(
      (widgetListenKeyState: string) => {
        this.appErrorHandler.executeAction(() => {
          this.widgetListenKey = widgetListenKeyState;

          this.changeDetectorRef.detectChanges();
        });
      }
    );
  }

  private _subcribeSelectedTabState() {
    this.selectedTabStateSubscription = this.selectedTabState.subscribe(
      (selectedTabState: TabSummaryModel) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedTab = selectedTabState;

          if (
            this.selectedEntity &&
            this.selectedTab &&
            this.selectedTab.tabSummaryInfor.tabID == 'Frequencies' &&
            !this.countryGridData
          ) {
            this.initCountryGridData();
          }

          this.changeDetectorRef.detectChanges();
        });
      }
    );
  }

  private _subscribeSelectedEntityState() {
    this.selectedEntityStateSubscription = this.selectedEntityState.subscribe(
      (selectedEntityState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (isEmpty(selectedEntityState) && !isEmpty(this.selectedEntity)) {
            this.selectedEntity = null;

            this.changeDetectorRef.detectChanges();
            return;
          }

          if (isEqual(this.selectedEntity, selectedEntityState)) {
            return;
          }

          this.selectedEntity = selectedEntityState;

          this.reset();
          this.initCountryGridData();
          this.changeDetectorRef.detectChanges();
        });
      }
    );
  }

  private _subscribeRequestSaveWidgetState() {
    this.requestSaveWidgetStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_SAVE_WIDGET &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI &&
          this.elementRef.nativeElement.offsetParent != null
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.submit();
        });
      });
  }

  private _subscribeRequestResetWidgetState() {
    this.requestSaveWidgetStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === WidgetDetailActions.REQUEST_RESET_WIDGET &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (this.isCountryPanelCollapse) {
            $('split-gutter', this.elementRef.nativeElement).dblclick();
          }
        });
      });
  }

  private _subscribeRequestBuildFrequencyState() {
    this.requestBuildFrequencyStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_BUILD_FREQUENCY &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (
            this.selectedTab &&
            this.selectedTab.tabSummaryInfor.tabID == 'Frequencies'
          ) {
            this.showLoading = true;

            this.loadDataForFrequency();
            this.getFrequencyBusyIndicator();
            this.changeDetectorRef.detectChanges();
          }
        });
      });
  }

  private _subscribeSelectionCountriesAreUpdatedState() {
    this.selectionCountriesAreUpdatedStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.SELECTION_COUNTRIES_ARE_UPDATED &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.showCountriesUpdatedWarning = true;
        });
      });
  }

  private initCountryGridData(callBack?: any) {
    this.countrySelectionServiceSubscription = this.countrySelectionService
      .getSelectionProjectCountry(
        this.selectedEntity[camelCase(this.widgetListenKey)]
      )
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !Uti.isResquestSuccess(response) ||
            !response.item.length ||
            isNil(response.item[1])
          ) {
            return;
          }

          let tableData: any = this.datatableService.formatDataTableFromRawData(
            response.item
          );
          tableData = this.datatableService.buildDataSource(tableData);

          const config = {
            allowDelete: false,
            allowMediaCode: false,
            allowDownload: false,
            allowSelectAll: false,
            hasDisableRow: false,
            hasCountrySelectAll: true,
          };

          tableData = this.datatableService.buildWijmoDataSource(
            tableData,
            config
          );

          this.countryGridData = tableData;
          if (callBack) {
            callBack();
          }

          this.showLoading = false;

          setTimeout(() => {
            this.countryGrid.selectRowIndex(0);
          }, 200);

          this.changeDetectorRef.detectChanges();
        });
      });
  }

  public countrySelectionChanged(e) {
    this.loadFrequencyFromSeletedCountry();
    this.onCountrySelectionChanged.emit(e);
  }

  private loadFrequencyFromSeletedCountry() {
    if (this.countryGrid && this.countryGrid.selectedNode) {
      const item = this.countryGrid.selectedNode.data;
      const countryId = item[ID_STRING.COUNTRY_ID];
      const countryLanguageId = item[ID_STRING.COUNTRY_LANGUAGE_ID];
      this.selectedCountry = item;

      if (this.frequencyGrid) {
        let columns = this.frequencyGridData.columns;
        this.frequencyGridData = null;
        this.frequencyGridData = {
          columns: columns,
          data: [],
        };
      }

      if (!countryId) {
        this.showLoading = false;

        this.changeDetectorRef.detectChanges();
        return;
      }

      if (!this.ignoreCache && this.cacheData[countryLanguageId]) {
        this.showLoading = false;
        this.frequencyGridData = cloneDeep(
          this.cacheData[countryLanguageId].gridData
        );
      } else {
        this.frequencyServiceSubscription = this.frequencyService
          .getFrequency(
            this.selectedEntity[camelCase(this.widgetListenKey)],
            countryId
          )
          .subscribe((response: ApiResultResponse) => {
            this.appErrorHandler.executeAction(() => {
              this.showLoading = false;
              if (!response || !response.item || !response.item.length) {
                return;
              }

              this.frequencyGridData = this.buildGrid(response.item[0]);

              this.cacheData[countryLanguageId] = {
                gridData: cloneDeep(this.frequencyGridData),
                isDirty: false,
              };

              this.ignoreCache = false;

              setTimeout(() => {
                this.onLoad.emit();
              }, 200);

              this.changeDetectorRef.detectChanges();
            });
          });
      }

      this.changeDetectorRef.detectChanges();
    }
  }

  private initData(formatRawData: any[]) {
    let data: any[] = [];

    formatRawData.forEach((frdt) => {
      let item: any = {};
      item['DT_RowId'] = GuidHelper.generateGUID();

      frdt.forEach((dt) => {
        let header = dt.header;
        item[header] = dt.value;
      });

      data.push(item);
    });

    return data;
  }

  private initColumns(formatRawData: any[]): ControlGridColumnModel[] {
    let columns: ControlGridColumnModel[] = [];

    formatRawData[0].forEach((dt) => {
      columns.push(
        new ControlGridColumnModel({
          title: dt.header,
          data: dt.header,
          readOnly: true,
          minWidth:
            typeof dt.value === 'object'
              ? 70
              : dt.header == 'Rules'
              ? 70
              : dt.header == 'Total Qty'
              ? 70
              : null,
          setting:
            typeof dt.value === 'object'
              ? {
                  Setting: [
                    {
                      ControlType: {
                        Type: 'QuantityPriority',
                      },
                      DisplayField: {},
                    },
                  ],
                }
              : dt.header == 'Total Qty'
              ? {
                  Setting: [
                    {
                      ControlType: { Type: 'Numeric' },
                      DisplayField: {
                        Align: 'Center',
                        Width: 70,
                      },
                    },
                  ],
                }
              : dt.header == 'Rules'
              ? {
                  Setting: [
                    {
                      DisplayField: {
                        Align: 'Left',
                        Width: 350,
                      },
                    },
                  ],
                }
              : null,
        })
      );
    });

    return columns;
  }

  private buildGrid(rawData) {
    let formatRawData: any[] = [];
    rawData.forEach((rdt) => {
      let quantityPriorityData: any[] = [];
      Object.keys(rdt).forEach((keyName: string) => {
        if (isNaN(parseInt(keyName))) {
          quantityPriorityData.push({
            header: keyName,
            value: rdt[keyName],
          });
        }
      });
      Object.keys(rdt).forEach((keyName: string) => {
        if (!isNaN(parseInt(keyName))) {
          rdt[keyName] = JSON.parse(rdt[keyName]);

          let value = rdt[keyName].Key[0];
          value['ExportQtyBackup'] = value['ExportQty'];
          quantityPriorityData.push({
            header: rdt[keyName].Key[0].HeaderName,
            value: value,
          });

          this.noFilterColumns.push(rdt[keyName].Key[0].HeaderName);
        }
      });

      formatRawData.push(quantityPriorityData);
    });

    let gridData = {
      data: this.initData(formatRawData),
      columns: this.initColumns(formatRawData),
    };

    const config = {
      allowDelete: false,
      allowMediaCode: false,
      allowDownload: false,
      allowSelectAll: false,
      hasDisableRow: false,
      hasCountrySelectAll: false,
    };

    return this.datatableService.buildWijmoDataSource(gridData, config);
  }

  private updateCacheData(editingItem) {
    if (this.cacheData && editingItem) {
      let selectingCountryItem =
        this.cacheData[
          this.countryGrid.selectedNode.data[ID_STRING.COUNTRY_LANGUAGE_ID]
        ];
      selectingCountryItem.isDirty = true;

      let currentItemIndex = selectingCountryItem.gridData.data.findIndex(
        (dt) => dt['DT_RowId'] == editingItem['DT_RowId']
      );
      if (currentItemIndex != -1) {
        selectingCountryItem.gridData.data.splice(
          currentItemIndex,
          1,
          editingItem
        );
      }

      this.emitAllTableEvents();

      this.changeDetectorRef.detectChanges();
    }
  }

  public addAllFrequencyItemsToCache() {
    if (this.cacheData) {
      let selectingCountryItem =
        this.cacheData[
          this.countryGrid.selectedNode.data[ID_STRING.COUNTRY_LANGUAGE_ID]
        ];
      selectingCountryItem.isDirty = true;

      const currentItems = cloneDeep(this.frequencyGridData.data);

      for (let item of selectingCountryItem.gridData.data) {
        const currentItem = currentItems.find(
          (x) => x.DT_RowId === item.DT_RowId
        );
        if (!currentItem || !currentItem.DT_RowId) {
          currentItems.push(item);
        }
      }
      selectingCountryItem.gridData.data = currentItems;
      this.emitAllTableEvents();

      this.changeDetectorRef.detectChanges();
    }
  }

  public submit(callback?) {
    let saveData = this.createJsonData();

    if (!saveData) {
      return;
    }

    this.frequencyServiceSubscription = this.frequencyService
      .saveFrequency(saveData)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
          if (callback) {
            callback();
          }

          this.reset();
          this.store.dispatch(
            this.processDataActions.saveWidgetSuccess(this.ofModule)
          );
          this.onSaveSuccess.emit();

          this.changeDetectorRef.detectChanges();
        });
      });
  }

  private createJsonData() {
    let saveData = {
      IdSelectionProject: this.selectedEntity[camelCase(this.widgetListenKey)],
      Frequencies: [],
    };

    if (isEmpty(this.cacheData)) {
      return null;
    }

    let countryItems: any = {},
      cacheDataKeys = Object.keys(this.cacheData);

    cacheDataKeys.forEach((key) => {
      if (this.cacheData[key].isDirty) {
        countryItems[key] = this.cacheData[key];
      }
    });

    if (isEmpty(countryItems)) {
      return null;
    }

    Object.keys(countryItems).forEach((countryLanguageId) => {
      const countryId = this.countryGridData.data.find(
        (c) => c[ID_STRING.COUNTRY_LANGUAGE_ID] == countryLanguageId
      )[ID_STRING.COUNTRY_ID];
      saveData.Frequencies = this.buildFrequencyDataForSave(
        countryItems[countryLanguageId].gridData.data,
        countryId
      );
    });

    return saveData;
  }

  private buildFrequencyDataForSave(gridData, countryId) {
    let result: any[] = [];
    for (let i = 0; i < gridData.length; i++) {
      let dataKeys = Object.keys(gridData[i]);
      for (let j = 0; j < dataKeys.length; j++) {
        let item = gridData[i][dataKeys[j]];
        if (item.Qty <= 0 || !item.isDirty) {
          continue;
        }

        result.push({
          HeaderName: item.HeaderName,
          Qty: item.Qty,
          ExportQty: item.ExportQty,
          IdSelectionProjectRules: item.IdSelectionProjectRules,
          IdSharingTreeGroups: item.IdSharingTreeGroups,
          ExportPriority: item.Priority,
          IdSelectionProjectCountry: countryId,
        });
      }
    }

    return result;
  }

  public reload() {
    this.reset();

    this.initCountryGridData();
  }

  private reset() {
    this.cacheData = {};

    if (this.countryGrid) {
      //this.countryGrid.flex.select(new wjcGrid.CellRange(-1, -1, -1, -1));
      let columns = this.countryGridData.columns;
      this.countryGridData = null;
      this.countryGridData = {
        columns: columns,
        data: [],
      };
    }

    if (this.frequencyGrid) {
      let columns = this.frequencyGridData.columns;
      this.frequencyGridData = null;
      this.frequencyGridData = {
        columns: columns,
        data: [],
      };
    }

    this.changeDetectorRef.detectChanges();
  }

  public dragEnd($event) {
    this.splitterConfig = {
      leftHorizontal: this.splitContainerComponent.areas[0].size,
      rightHorizontal: this.splitContainerComponent.areas[1].size,
    };

    this.saveSplitterSettings();

    // this.countryGrid.sizeColumnsToFit();
    if (this.frequencyGrid) {
      this.frequencyGrid.turnOnStarResizeMode();
    }
  }

  public onTableEditStart() {
    this.onGridEditStart.emit();
  }

  public onTableEditEnd() {
    this.onGridEditEnd.emit();
  }

  public onTableEditSuccess(editingItem, updateCache?) {
    if (updateCache) {
      this.updateCacheData(editingItem);
    }

    this.onGridEditSuccess.emit();
  }

  private emitAllTableEvents() {
    this.onGridEditStart.emit();
    this.onGridEditEnd.emit();
    this.onGridEditSuccess.emit();
  }

  private onSplitterDblClick() {
    this.isCountryPanelCollapse = !this.isCountryPanelCollapse;
    if (this.isCountryPanelCollapse) {
      this.store.dispatch(
        this.parkedItemActions.requestTogglePanel(false, this.ofModule)
      );
      this.store.dispatch(
        this.additionalInformationActions.requestTogglePanel(
          false,
          this.ofModule
        )
      );
      this.splitterConfig.leftHorizontal = 10;
      this.splitterConfig.rightHorizontal = 90;

      this.toggleCountryColumns(true);
    } else {
      this.splitterConfig.leftHorizontal = 20;
      this.splitterConfig.rightHorizontal = 80;

      this.toggleCountryColumns(false);
    }

    setTimeout(() => {
      // this.countryGrid.sizeColumnsToFit();
      this.frequencyGrid.turnOnStarResizeMode();

      this.saveSplitterSettings();
    }, 200);

    this.changeDetectorRef.detectChanges();
  }

  private toggleCountryColumns(showCountryOnly) {
    if (!this.countryGrid) {
      return;
    }

    if (showCountryOnly) {
      let cols = this.countryGrid.getAllColumns();
      this.previousVisibleColumns = [];
      for (let i = 0; i < cols.length; i++) {
        if (cols[i].isVisible() && cols[i].getColDef().field != 'Country') {
          this.previousVisibleColumns.push(cols[i].getColDef().field);
        }
      }
      this.countryGrid.toggleColumns(this.previousVisibleColumns, false);
    } else {
      this.countryGrid.toggleColumns(this.previousVisibleColumns, true);
      this.previousVisibleColumns = [];
    }

    this.changeDetectorRef.detectChanges();
  }

  public changeZoom(value) {
    if (this.frequencyGrid) {
      $(this.frequencyGrid.flex.hostElement).css(
        'font-size',
        MAPPING[value].font + 'px'
      );

      if (!this.fitWidthColumn) {
        if (!this.originalFrequencyColumnsWidth) {
          this.originalFrequencyColumnsWidth = [];
          for (let i = 0; i < this.frequencyGrid.flex.columns.length; i++) {
            this.originalFrequencyColumnsWidth.push(
              this.frequencyGrid.flex.columns[i].renderSize
            );
          }
        }

        if (!this.originalFrequencyRowsHeight) {
          this.originalFrequencyRowsHeight = [];
          for (let i = 0; i < this.frequencyGrid.flex.rows.length; i++) {
            this.originalFrequencyRowsHeight.push(
              this.frequencyGrid.flex.rows[i].renderSize
            );
          }
        }

        for (let i = 0; i < this.frequencyGrid.flex.columns.length; i++) {
          this.frequencyGrid.flex.columns[i].size =
            this.originalFrequencyColumnsWidth[i] * MAPPING[value].ratio;
          this.frequencyGrid.flex.columns[i].width =
            this.originalFrequencyColumnsWidth[i] * MAPPING[value].ratio;
        }

        for (let i = 0; i < this.frequencyGrid.flex.rows.length; i++) {
          this.frequencyGrid.flex.rows[i].size =
            this.originalFrequencyRowsHeight[i] * MAPPING[value].ratio;
          this.frequencyGrid.flex.rows[i].height =
            this.originalFrequencyRowsHeight[i] * MAPPING[value].ratio;
        }
      } else {
        for (let i = 0; i < this.frequencyGrid.flex.columns.length; i++) {
          this.frequencyGrid.flex.columns[i].width = '*';
        }

        for (let i = 0; i < this.frequencyGrid.flex.rows.length; i++) {
          this.frequencyGrid.flex.rows[i].size =
            this.originalFrequencyRowsHeight[i] * MAPPING[value].ratio;
          this.frequencyGrid.flex.rows[i].height =
            this.originalFrequencyRowsHeight[i] * MAPPING[value].ratio;
        }
      }

      this.frequencyGrid.flex.refresh();

      let cellHeight = $(
        '.wj-cells .wj-cell.readonly',
        this.frequencyGrid.flex.hostElement
      ).outerHeight(true);
      $('span.quantity-label', this.frequencyGrid.flex.hostElement).css({
        height: cellHeight + 'px',
        'line-height': cellHeight + 'px',
      });
      $('span.priority-label', this.frequencyGrid.flex.hostElement).css({
        height: cellHeight + 'px',
        'line-height': cellHeight + 'px',
      });
      $('.empty-cell', this.frequencyGrid.flex.hostElement).css({
        'min-height': cellHeight + 'px',
      });

      this.frequencyGrid.flex.autoSizeRow(0, true);

      this.changeDetectorRef.detectChanges();
    }
  }

  public toggleColumns(mode) {
    if (this.frequencyGrid) {
      switch (mode) {
        case FilterModeEnum.ShowAll:
          for (let i = 0; i < this.frequencyGrid.flex.columns.length; i++) {
            this.frequencyGrid.flex.columns[i].visible = true;
          }
          break;

        case FilterModeEnum.EmptyData:
          for (let i = 0; i < this.frequencyGrid.flex.columns.length; i++) {
            this.frequencyGrid.flex.columns[i].visible = true;

            let isHidden = false;
            for (let j = 0; j < this.frequencyGrid.gridData.items.length; j++) {
              let thisColData =
                this.frequencyGrid.gridData.items[j][
                  this.frequencyGrid.flex.columns[i].binding
                ];

              if (typeof thisColData === 'object') {
                if (
                  !(
                    (isNil(thisColData['ExportQty']) ||
                      thisColData['ExportQty'] === 0) &&
                    (isNil(thisColData['Qty']) || thisColData['Qty'] === 0)
                  )
                ) {
                  isHidden = true;
                  break;
                }
              }
            }

            this.frequencyGrid.flex.columns[i].visible = !isHidden;
          }
          break;

        case FilterModeEnum.HasData:
          for (let i = 0; i < this.frequencyGrid.flex.columns.length; i++) {
            this.frequencyGrid.flex.columns[i].visible = true;

            let isHidden = false;
            for (let j = 0; j < this.frequencyGrid.gridData.items.length; j++) {
              let thisColData =
                this.frequencyGrid.gridData.items[j][
                  this.frequencyGrid.flex.columns[i].binding
                ];

              if (typeof thisColData === 'object') {
                if (
                  (isNil(thisColData['ExportQty']) ||
                    thisColData['ExportQty'] === 0) &&
                  (isNil(thisColData['Qty']) || thisColData['Qty'] === 0)
                ) {
                  isHidden = true;
                  break;
                }
              }
            }

            this.frequencyGrid.flex.columns[i].visible = !isHidden;
          }
          break;
      }

      this.changeDetectorRef.detectChanges();
    }
  }

  public closeLoadingDialog() {
    clearInterval(this.loadingInterval);
    this.loadingInterval = null;
    this.showLoading = false;
    //this.store.dispatch(this.tabSummaryActions.requestSelectTab('Logic', this.ofModule));
    this.changeDetectorRef.detectChanges();
  }
}
