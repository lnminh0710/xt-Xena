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
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ControlGridColumnModel,
  ExtendedFilterRule,
  ApiResultResponse,
  GlobalSettingModel,
} from 'app/models';
import isNil from 'lodash/isNil';
import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import {
  ProcessDataActions,
  FilterActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  AppErrorHandler,
  CountrySelectionService,
  RuleService,
  DatatableService,
  ModalService,
  GlobalSettingService,
  ProjectService,
} from 'app/services';
import {
  QueryBuilderConfig,
  Rule,
  RuleSet,
} from 'app/shared/components/xn-control/query-builder';
import {
  RuleEnum,
  MapFromWidgetAppToFilterId,
  GlobalSettingConstant,
} from 'app/app.constants';
import { Uti } from 'app/utilities';
import { GuidHelper } from 'app/utilities/guild.helper';
import { QueryObject } from 'app/app.constants';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as moduleSettingReducer from 'app/state-management/store/reducer/module-setting';
import { XnAgGridComponent } from '../xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { ToasterService } from 'angular2-toaster';
import { SplitComponent } from 'angular-split';

const ID_STRING = {
  COUNTRY_ID: 'IdSelectionProjectCountry',
  COUNTRY_LANGUAGE_ID: 'IdCountrylanguage',
  ID_SELECTION_PROJECT_RULES: 'IdSelectionProjectRules',
  PRIORITY: 'Priority',
  MEDIACODE_LABEL: 'MediaCodeLabel',
  MEDIACODE: 'MediaCode',
  PRICING: 'Pricing',
};

@Component({
  selector: 'mediacode-pricing-grid',
  templateUrl: './mediacode-pricing-grid.component.html',
  styleUrls: ['./mediacode-pricing-grid.component.scss'],
})
export class MediacodePricingGridComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  public listComboBox: any = {};
  public showDialog = false;
  public countryGridData: any;
  public mediacodeGridData: any;
  public perfectScrollbarConfig: any = {};
  public columnsLayoutSettings: any = {};
  public splitterConfig = {
    leftHorizontal: 40,
    rightHorizontal: 60,
  };
  private isForAllCountry: boolean = false;
  private widgetListenKey = null;
  private selectedEntity: any = null;
  private cacheData: any = {};
  private cacheDataForAllCountry: any = [];
  private validationError = {};
  private isMediaCodeGridReadOnly = true;
  private isMediaCodeGridDisabled = false;
  private showCountriesUpdatedWarning = false;

  @ViewChild('countryGrid') countryGrid: XnAgGridComponent;
  @ViewChild('mediacodeGrid') mediacodeGrid: XnAgGridComponent;
  @ViewChild('horizontalSplit') horizontalSplit: SplitComponent;

  @Input() countryGridId: string;
  @Input() mediacodeGridId: string;
  @Input() readOnly = true;
  @Input() idRepWidgetApp = null;
  @Input() globalProperties: any[] = [];

  @Output() onGridEditStart = new EventEmitter<any>();
  @Output() onGridEditEnd = new EventEmitter<any>();
  @Output() onGridEditSuccess = new EventEmitter<any>();
  @Output() onSaveSuccess = new EventEmitter<any>();
  @Output() onCountrySelectionChanged = new EventEmitter<any>();

  private selectedEntityState: Observable<any>;
  private widgetListenKeyState: Observable<string>;
  private requestSaveWidgetState: Observable<any>;
  private selectionCountriesAreUpdatedState: Observable<any>;

  private selectionCountriesAreUpdatedStateSubscription: Subscription;
  private selectedEntityStateSubscription: Subscription;
  private widgetListenKeyStateSubscription: Subscription;
  private countrySelectionServiceSubscription: Subscription;
  private requestSaveWidgetStateSubscription: Subscription;
  private requestSyncMediacodeStateSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private _eref: ElementRef,
    private appErrorHandler: AppErrorHandler,
    private countrySelectionService: CountrySelectionService,
    private datatableService: DatatableService,
    private processDataActions: ProcessDataActions,
    private filterActions: FilterActions,
    private modalService: ModalService,
    private globalSettingService: GlobalSettingService,
    private globalSettingConstant: GlobalSettingConstant,
    private dispatcher: ReducerManagerDispatcher,
    protected router: Router,
    private projectService: ProjectService,
    private toasterService: ToasterService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(router);

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
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.mediacodeGridData = {
      data: [],
      columns: this.initMediacodeGridSetting(),
    };

    this.loadColumnLayoutSettings();
    setTimeout(() => {
      this.loadSplitterSettings();
    }, 200);

    this._subscribeWidgetListenKeyState();
    this._subscribeSelectedEntityState();
    this._subscribeRequestSaveWidgetState();
    this._subscribeRequestSyncMediacodeState();
    this._subscribeSelectionCountriesAreUpdatedState();

    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };

    this.changeDetectorRef.detectChanges();
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  /**
   * ngAfterViewInit
   */
  public ngAfterViewInit() {}

  ngAfterContentChecked(): void {
    if (
      this._eref.nativeElement.offsetParent != null &&
      this.showCountriesUpdatedWarning
    ) {
      this.reload();
      this.showCountriesUpdatedWarning = false;
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['readOnly']) {
      this.validateMediaCodeGrid();
    }
  }

  private loadColumnLayoutSettings() {
    this.globalSettingService
      .getAllGlobalSettings(-1)
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (data && data.length) {
            let gridColLayoutSettings = data.filter(
              (p) => p.globalType == 'GridColLayout'
            );
            if (gridColLayoutSettings && gridColLayoutSettings.length) {
              gridColLayoutSettings.forEach((setting) => {
                this.columnsLayoutSettings[setting.globalName] = JSON.parse(
                  setting.jsonSettings
                );
              });
            }

            this.changeDetectorRef.detectChanges();
          }
        });
      });
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
                this.horizontalSplit.updateArea(
                  this.horizontalSplit.areas[0].component,
                  1,
                  this.splitterConfig.leftHorizontal,
                  20
                );
                this.horizontalSplit.updateArea(
                  this.horizontalSplit.areas[1].component,
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

  private _subscribeSelectedEntityState() {
    this.selectedEntityStateSubscription = this.selectedEntityState.subscribe(
      (selectedEntityState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (isEmpty(selectedEntityState) && !isEmpty(this.selectedEntity)) {
            this.selectedEntity = null;

            this.changeDetectorRef.detectChanges();
            return;
          }

          //if (this.countryGrid) {
          //    this.countryGrid.flex.select(new wjcGrid.CellRange(-1, -1, -1, -1));
          //}

          if (this.mediacodeGrid) {
            let columns = this.mediacodeGridData.columns;
            this.mediacodeGridData = null;
            this.mediacodeGridData = {
              columns: columns,
              data: [],
            };
          }

          if (isEqual(this.selectedEntity, selectedEntityState)) {
            this.changeDetectorRef.detectChanges();
            return;
          }

          this.selectedEntity = selectedEntityState;
          this.cacheData = {};
          this.cacheDataForAllCountry = [];

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
          this._eref.nativeElement.offsetParent != null
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.submit();
        });
      });
  }

  private _subscribeRequestSyncMediacodeState() {
    this.requestSyncMediacodeStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_SYNC_MEDIACODE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.insertMediaCodeToCampaign();
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

  /**
   * initCountryGridData
   */
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

          setTimeout(() => {
            this.countryGrid.selectRowIndex(0);
          }, 200);

          this.changeDetectorRef.detectChanges();
        });
      });
  }

  public countrySelectionChanged(e) {
    this.loadMediacodeFromSeletedCountry();
    this.onCountrySelectionChanged.emit(e);
  }

  private loadMediacodeFromSeletedCountry(forceLoadFromService?: boolean) {
    if (this.countryGrid && this.countryGrid.selectedNode) {
      const item = this.countryGrid.selectedNode.data;
      const countryId = item[ID_STRING.COUNTRY_ID];
      const countryLanguageId = item[ID_STRING.COUNTRY_LANGUAGE_ID];

      if (this.mediacodeGridData) {
        this.mediacodeGridData = null;
        this.mediacodeGridData = {
          data: [],
          columns: this.initMediacodeGridSetting(),
        };
      }

      if (!countryId) {
        this.validateMediaCodeGrid();
        this.changeDetectorRef.detectChanges();
        return;
      }

      // load data from cached
      if (!forceLoadFromService && this.cacheData[countryLanguageId]) {
        this.cacheData[countryLanguageId].gridData.data = this.cacheData[
          countryLanguageId
        ].gridData.data.filter((dt) => !dt.willDelete);
        this.mediacodeGridData =
          this.addMoreCachedDataWithAllCountryFromOtherItemAdded(
            cloneDeep(this.cacheData[countryLanguageId].gridData)
          );

        this.validateMediaCodeGrid();
        this.changeDetectorRef.detectChanges();
      }
      // load data from service when data is empty
      else {
        this.projectService
          .getMediaCodePricing(
            this.selectedEntity[camelCase(this.widgetListenKey)],
            countryId
          )
          .subscribe((response: ApiResultResponse) => {
            this.appErrorHandler.executeAction(() => {
              if (!response || !response.item || !response.item.length) {
                if (this.cacheData) {
                  delete this.cacheData[countryLanguageId];
                }

                this.mediacodeGridData = {
                  data: [],
                  columns: this.mediacodeGridData.columns,
                };

                this.cacheData[countryLanguageId] = {
                  gridData: cloneDeep(this.mediacodeGridData),
                  isDirty: false,
                };

                this.validateMediaCodeGrid();
                this.changeDetectorRef.detectChanges();
                return;
              }

              this.mediacodeGridData =
                this.datatableService.buildEditableDataSource(response.item);

              this.cacheData[countryLanguageId] = {
                gridData: cloneDeep(this.mediacodeGridData),
                isDirty: false,
              };

              this.validateMediaCodeGrid();
              this.changeDetectorRef.detectChanges();
            });
          });
      }

      this.changeDetectorRef.detectChanges();
    }
  }

  private addMoreCachedDataWithAllCountryFromOtherItemAdded(
    currentData: any
  ): any {
    let newData = [];
    if (currentData && currentData.data && currentData.data.length) {
      for (let item of this.cacheDataForAllCountry) {
        const currentItem = currentData.data.find(
          (x) => x.DT_RowId === item.DT_RowId
        );
        if (!currentItem || !currentItem.DT_RowId) {
          newData.push(cloneDeep(item));
        }
      }
      currentData.data = currentData.data.concat(cloneDeep(newData));
    } else {
      currentData.data = cloneDeep(this.cacheDataForAllCountry);
    }
    return currentData;
  }

  private initMediacodeGridSetting(): ControlGridColumnModel[] {
    const colSetting = [
      new ControlGridColumnModel({
        title: 'DT_RowId',
        data: 'DT_RowId',
        setting: {
          Setting: [
            {
              DisplayField: {
                Hidden: '1',
              },
            },
          ],
        },
      }),
      new ControlGridColumnModel({
        title: ID_STRING.COUNTRY_ID,
        data: ID_STRING.COUNTRY_ID,
        setting: {
          Setting: [
            {
              DisplayField: {
                Hidden: '1',
              },
            },
          ],
        },
      }),
      new ControlGridColumnModel({
        title: ID_STRING.COUNTRY_LANGUAGE_ID,
        data: ID_STRING.COUNTRY_LANGUAGE_ID,
        setting: {
          Setting: [
            {
              DisplayField: {
                Hidden: '1',
              },
            },
          ],
        },
      }),
      new ControlGridColumnModel({
        title: ID_STRING.MEDIACODE_LABEL,
        data: ID_STRING.MEDIACODE_LABEL,
        setting: {
          Setting: [
            {
              DisplayField: {
                ReadOnly: '1',
              },
            },
          ],
        },
      }),
      new ControlGridColumnModel({
        title: ID_STRING.MEDIACODE,
        data: ID_STRING.MEDIACODE,
        setting: {
          Setting: [
            {
              DisplayField: {
                ReadOnly: '1',
              },
            },
          ],
        },
      }),
      new ControlGridColumnModel({
        title: ID_STRING.PRICING,
        data: ID_STRING.PRICING,
        setting: {
          Setting: [],
        },
      }),
    ];
    return colSetting;
  }

  public onTableEditStart() {
    this.onGridEditStart.emit();
  }

  public onTableEditEnd() {
    this.onGridEditEnd.emit();
  }

  public onTableEditSuccess() {
    this.onGridEditSuccess.emit();
  }

  private emitAllTableEvents() {
    this.onGridEditStart.emit();
    this.onGridEditEnd.emit();
    this.onGridEditSuccess.emit();
  }

  public onMediacodeGridEditEnded(editingItem) {
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

      this.validateMediaCodeGrid();
      this.changeDetectorRef.detectChanges();
    }
  }

  public submit(callback?: any) {
    if (this.isValidationError()) {
      this.modalService.warningMessage([
        {
          key: 'Modal_Message__The_Value_You_Entered_Is_Not_Valid',
        },
      ]);
      return;
    }

    let saveData = this.createJsonData();

    if (!saveData) {
      return;
    }

    this.projectService
      .saveMediaCodePricing(saveData)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
          if (callback) {
            callback();
          }

          //this.reset();
          this.store.dispatch(
            this.processDataActions.saveWidgetSuccess(this.ofModule)
          );
          //this.loadFilterFromSeletedCountry(true);
          this.onSaveSuccess.emit();

          this.validateMediaCodeGrid();
          this.changeDetectorRef.detectChanges();
        });
      });
  }

  public reload() {
    this.reset();

    this.initCountryGridData(() => {
      this.loadMediacodeFromSeletedCountry();
    });
  }

  private reset() {
    this.validationError = {};
    this.cacheData = {};
    this.cacheDataForAllCountry = [];
    this.isForAllCountry = false;

    this.validateMediaCodeGrid();
    this.changeDetectorRef.detectChanges();
  }

  private isValidationError() {
    let gridNames = Object.keys(this.validationError);
    for (let i = 0; i < gridNames.length; i++) {
      if (this.validationError[gridNames[i]]) {
        return true;
      }
    }

    return false;
  }

  public hasValidationErrorHandler($event, gridName) {
    this.validationError[gridName] = $event;
  }

  public createJsonData() {
    let saveData: any = {};
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

    saveData = {
      IdSelectionProject: this.selectedEntity[camelCase(this.widgetListenKey)],
      MediaCodePricing: [],
    };

    Object.keys(countryItems).forEach((countryLanguageId) => {
      let mediacodes = countryItems[countryLanguageId].gridData.data;
      mediacodes.forEach((mediacode) => {
        if (
          !saveData.MediaCodePricing.find(
            (x) => x.MediaCode == mediacode.MediaCode
          )
        ) {
          saveData.MediaCodePricing.push({
            MediaCode: mediacode.MediaCode,
            MediaCodeLabel: mediacode.MediaCodeLabel,
            MediaCodePrice: mediacode.MediaCodePrice,
          });
        }
      });
    });

    return saveData;
  }

  public dragEnd($event) {
    this.countryGrid && this.countryGrid.sizeColumnsToFit();
    this.mediacodeGrid && this.mediacodeGrid.sizeColumnsToFit();

    this.splitterConfig = {
      leftHorizontal: this.horizontalSplit.areas[0].size,
      rightHorizontal: this.horizontalSplit.areas[1].size,
    };

    this.saveSplitterSettings();

    this.changeDetectorRef.detectChanges();
  }

  private validateMediaCodeGrid() {
    setTimeout(() => {
      let readOnly = this.checkGroupPriorityGridReadOnly();
      let disabled = this.checkGroupPriorityGridDisabled();

      if (
        readOnly !== this.isMediaCodeGridReadOnly ||
        disabled !== this.isMediaCodeGridDisabled
      ) {
        this.isMediaCodeGridReadOnly = readOnly;
        this.isMediaCodeGridDisabled = disabled;
        this.changeDetectorRef.detectChanges();

        if (this.mediacodeGrid) {
          this.mediacodeGrid.refresh();
        }
      }
    }, 200);
  }
  public checkGroupPriorityGridReadOnly() {
    return (
      this.readOnly ||
      (this.countryGrid != null &&
        this.countryGrid.selectedNode != null &&
        !this.countryGrid.selectedNode.data['IsActive'])
    );
  }

  public checkGroupPriorityGridDisabled() {
    return (
      this.countryGrid != null &&
      this.countryGrid.selectedNode != null &&
      !this.countryGrid.selectedNode.data['IsActive']
    );
  }

  private insertMediaCodeToCampaign() {
    this.projectService
      .insertMediaCodeToCampaign(
        this.selectedEntity[camelCase(this.widgetListenKey)],
        MapFromWidgetAppToFilterId[this.idRepWidgetApp]
      )
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          this.toasterService.pop(
            'success',
            'Insert media code to Campaign successfully'
          );

          this.changeDetectorRef.detectChanges();
        });
      });
  }
}
