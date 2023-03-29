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
  ControlGridModel,
  ControlGridColumnModel,
  ApiResultResponse,
  MessageModel,
  GlobalSettingModel,
} from 'app/models';
import {
  AppErrorHandler,
  CountrySelectionService,
  RuleService,
  DatatableService,
  ModalService,
  GlobalSettingService,
} from 'app/services';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import camelCase from 'lodash-es/camelCase';
import cloneDeep from 'lodash-es/cloneDeep';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import {
  GridActions,
  ProcessDataActions,
  FilterActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Uti } from 'app/utilities';
import {
  RuleEnum,
  MapFromWidgetAppToFilterId,
  MessageModal,
} from 'app/app.constants';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as moduleSettingReducer from 'app/state-management/store/reducer/module-setting';
import { XnAgGridComponent } from '../xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { SplitComponent } from 'angular-split';

const ID_STRING = {
  ID_SELECT_ALL: '0',
  COUNTRY_ID: 'IdSelectionProjectCountry',
  COUNTRY_LANGUAGE_ID: 'IdCountrylanguage',
  MEDIACODE: 'MediaCode',
  ID_SHARING_TREE_GROUPS: 'IdSharingTreeGroups',
  PRIORITY: 'Priority',
};

@Component({
  selector: 'group-priority-grid',
  templateUrl: './group-priority-grid.component.html',
  styleUrls: ['./group-priority-grid.component.scss'],
})
export class GroupPriorityGridComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  public countryGridData: ControlGridModel;
  public filterGridData: any;
  public perfectScrollbarConfig: any = {};
  public isGroupPriorityGridReadOnly = true;
  public isGroupPriorityGridDisabled = false;
  public columnsLayoutSettings: any = {};
  public splitterConfig = {
    leftHorizontal: 60,
    rightHorizontal: 40,
  };
  private isForAllCountry: boolean;
  private validationError = {};
  private cacheData = {};
  private cacheIdData = {};
  private selectedEntityState: Observable<any>;
  private selectedEntityStateSubscription: Subscription;
  private widgetListenKeyState: Observable<string>;
  private widgetListenKeyStateSubscription: Subscription;
  private requestSaveWidgetState: Observable<any>;
  private requestSaveWidgetStateSubscription: Subscription;
  private requestLoadProfileState: Observable<any>;
  private requestLoadProfileStateSubscription: Subscription;
  private ruleServiceSubscription: Subscription;
  private countrySelectionServiceSubscription: Subscription;
  private blacklistServiceSubscription: Subscription;
  private selectionCountriesAreUpdatedState: Observable<any>;
  private selectionCountriesAreUpdatedStateSubscription: Subscription;
  private selectedEntity: any = null;
  private widgetListenKey = null;
  private countryData: any = {
    data: [],
  };
  private profileData: any = null;
  private showCountriesUpdatedWarning = false;
  private showAllCountriesAffectWarning = {
    whenUpdate: false,
  };

  @Input() countryGridId: string;
  @Input() groupPriorityGridId: string;
  @Input() readOnly = true;
  @Input() idRepWidgetApp = null;
  @Input() globalProperties: any[] = [];

  @Output() onGridEditStart = new EventEmitter<any>();
  @Output() onGridEditEnd = new EventEmitter<any>();
  @Output() onGridEditSuccess = new EventEmitter<any>();
  @Output() onSaveSuccess = new EventEmitter<any>();

  @ViewChild('countryGrid') countryGrid: XnAgGridComponent;
  @ViewChild('groupPriorityGrid') groupPriorityGrid: XnAgGridComponent;
  @ViewChild('horizontalSplit') horizontalSplit: SplitComponent;

  constructor(
    private store: Store<AppState>,
    private appErrorHandler: AppErrorHandler,
    private datatableService: DatatableService,
    private countrySelectionService: CountrySelectionService,
    private ruleService: RuleService,
    private filterActions: FilterActions,
    private processDataActions: ProcessDataActions,
    private modalService: ModalService,
    protected router: Router,
    private dispatcher: ReducerManagerDispatcher,
    private changeDetectorRef: ChangeDetectorRef,
    private globalSettingService: GlobalSettingService,
    private elementRef: ElementRef
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
    this.loadColumnLayoutSettings();
    setTimeout(() => {
      this.loadSplitterSettings();
    }, 200);

    this._subscribeWidgetListenKeyState();
    this._subscribeSelectedEntityState();
    this._subscribeRequestSaveWidgetState();
    this._subscribeRequestLoadProfileState();
    this._subscribeSelectionCountriesAreUpdatedState();

    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['readOnly']) {
      this.validateGroupPriorityGrid();
    }
  }

  /**
   * ngAfterViewInit
   */
  public ngAfterViewInit() {}

  ngAfterContentChecked(): void {
    if (
      this.elementRef.nativeElement.offsetParent != null &&
      this.showCountriesUpdatedWarning
    ) {
      this.reload();
      this.showCountriesUpdatedWarning = false;
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

  private loadRulesByCountry(countryId, countryLanguageId) {
    return this.ruleService
      .getProjectRules(
        RuleEnum.OrdersGroup,
        this.selectedEntity[camelCase(this.widgetListenKey)],
        countryId
      )
      .map((response: ApiResultResponse) => {
        return {
          ...response,
          countryId,
          countryLanguageId,
        };
      });
  }

  private preloadData() {
    let countries = this.countryGrid.getGridData();
    let observableBatch = [];
    countries.forEach((country) => {
      if (country[ID_STRING.COUNTRY_ID]) {
        observableBatch.push(
          this.loadRulesByCountry(
            country[ID_STRING.COUNTRY_ID],
            country[ID_STRING.COUNTRY_LANGUAGE_ID]
          )
        );
      }
    });

    Observable.forkJoin(observableBatch)
      .finally(() => {
        this.changeDetectorRef.detectChanges();
      })
      .subscribe((results: Array<any>) => {
        results.forEach((result) => {
          if (result.item && result.item[0]) {
            let rulesFromService = result.item[0][0];
            this.cacheIdData[result.countryId] =
              rulesFromService.IdSelectionProjectRules;
            let newData = this.buildDataWithPriority(
              Uti.tryParseJson(rulesFromService.JsonCaseRules)
            );

            this.cacheData[result.countryLanguageId] = {
              gridData: {
                data: cloneDeep(newData),
                columns: this.filterGridData.columns,
              },
              isDirty: false,
            };
          } else {
            this.cacheData[result.countryLanguageId] = {
              gridData: {
                data: cloneDeep(this.buildDataWithPriority(null)),
                columns: this.filterGridData.columns,
              },
              isDirty: false,
            };
          }
        });

        setTimeout(() => {
          this.countryGrid.selectRowIndex(0);
        }, 200);

        this.changeDetectorRef.detectChanges();
      });
  }

  public countrySelectionChanged() {
    this.loadFilterFromSeletedCountry();

    this.changeDetectorRef.detectChanges();
  }

  public dragEnd($event) {
    this.countryGrid.sizeColumnsToFit();
    this.groupPriorityGrid.sizeColumnsToFit();

    this.splitterConfig = {
      leftHorizontal: this.horizontalSplit.areas[0].size,
      rightHorizontal: this.horizontalSplit.areas[1].size,
    };

    this.saveSplitterSettings();

    this.changeDetectorRef.detectChanges();
  }

  public onPriorityChanged() {
    // Select All Checked
    if (!this.cacheData) return;

    if (this.showAllCountriesAffectWarning.whenUpdate) {
      this.modalService.alertMessage({
        message: [
          {
            key: 'Modal_Message__All_Country_Checkbox_is_Checked_Affect',
          },
        ],
      });

      this.showAllCountriesAffectWarning.whenUpdate = false;
    }

    if (this.isForAllCountry) {
      this.countryGrid.getGridData().forEach((country) => {
        let selectingCountryItem =
          this.cacheData[country[ID_STRING.COUNTRY_LANGUAGE_ID]];
        if (!selectingCountryItem) return;
        selectingCountryItem.isDirty = true;
        selectingCountryItem.gridData.data = cloneDeep(
          this.groupPriorityGrid.getGridData()
        );
      });
    } else {
      let selectingCountryItem =
        this.cacheData[
          this.countryGrid.selectedNode.data[ID_STRING.COUNTRY_LANGUAGE_ID]
        ];
      if (!selectingCountryItem) return;
      selectingCountryItem.isDirty = true;

      selectingCountryItem.gridData.data = cloneDeep(
        this.groupPriorityGrid.getGridData()
      );
    }

    this.emitAllTableEvents();

    this.changeDetectorRef.detectChanges();
  }

  public onCheckAllChanged(value: boolean) {
    if (!this.isForAllCountry && value) {
      this.showAllCountriesAffectWarning.whenUpdate = true;
    } else {
      this.showAllCountriesAffectWarning.whenUpdate = false;
    }

    this.isForAllCountry = value;

    //if (this.isForAllCountry) {
    //    if (this.groupPriorityGrid) {
    //        this.groupPriorityGrid.getCurrentNodeItems().forEach((item) => {
    //            item.Priority = '';
    //            this.groupPriorityGrid.updateRowData([item]);
    //        })
    //    }
    //}
    //else {
    //    this.cacheData[ID_STRING.ID_SELECT_ALL] = {};
    //    this.loadFilterFromSeletedCountry();
    //}

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

          if (this.groupPriorityGrid) {
            this.groupPriorityGrid.getCurrentNodeItems().forEach((item) => {
              item[ID_STRING.PRIORITY] = '';
              this.groupPriorityGrid.updateRowData([item]);
            });
          }

          if (isEqual(this.selectedEntity, selectedEntityState)) {
            return;
          }

          this.selectedEntity = selectedEntityState;

          this.initCountryGridData();
          this.initfilterGridData();

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
          action.payload &&
          this.elementRef.nativeElement.offsetParent != null
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.submit();
        });
      });
  }

  private _subscribeRequestLoadProfileState() {
    this.requestSaveWidgetStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === FilterActions.REQUEST_LOAD_PROFILE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((profileData) => {
        this.appErrorHandler.executeAction(() => {
          if (profileData) {
            if (
              profileData.IdSelectionWidget ==
              MapFromWidgetAppToFilterId[this.idRepWidgetApp]
            ) {
              this.initProfileData(profileData);
            } else {
              this.profileData = null;
            }

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

  private initProfileData(profileData) {
    if (!profileData || !profileData.TemplateData) {
      return;
    }

    this.profileData = Uti.tryParseJson(profileData.TemplateData);
    if (this.profileData) {
      this.profileData = this.profileData.JsonRules;

      //if (this.countryGrid) {
      //    this.countryGrid.flex.select(new wjcGrid.CellRange(-1, -1, -1, -1));
      //}

      this.loadFilterFromSeletedCountry();
    }

    this.changeDetectorRef.detectChanges();
  }

  /**
   * initCountryGridData
   */
  private initCountryGridData(callBack?: any) {
    this.countrySelectionServiceSubscription = this.countrySelectionService
      .getSelectionProjectCountry(
        this.selectedEntity[camelCase(this.widgetListenKey)],
        RuleEnum.OrdersGroup
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

          response.item[1] = response.item[1].filter((item) => {
            return typeof item.IdCountrylanguage !== 'object';
          });

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
            //this.countryGrid.selectRowIndex(0);
            //this.preloadData();
          }, 200);

          this.changeDetectorRef.detectChanges();
        });
      });
  }

  /*
   * initfilterGridData
   */
  private initfilterGridData() {
    this.blacklistServiceSubscription = this.ruleService
      .getOrdersGroups()
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
          tableData = this.datatableService.appendRowId(tableData);
          tableData.columns = this.initColumnCountryGridSetting(
            tableData.columns
          );
          tableData.data = Uti.addMorePropertyToArray(
            tableData.data,
            ID_STRING.PRIORITY,
            ''
          );
          this.filterGridData = tableData;
          this.cacheData = {};
          this.cacheIdData = {};

          setTimeout(() => {
            //this.countryGrid.selectRowIndex(0);
            this.preloadData();
          }, 500);

          this.validateGroupPriorityGrid();
          this.changeDetectorRef.detectChanges();
        });
      });
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

    this.checkAllCountriesBeforeSubmit();

    this.ruleServiceSubscription = this.ruleService
      .saveProjectRules(this.createJsonData())
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
          if (callback) {
            callback();
          }

          this.store.dispatch(
            this.processDataActions.saveWidgetSuccess(this.ofModule)
          );
          this.reset();
          this.onSaveSuccess.emit();

          this.validateGroupPriorityGrid();
          this.changeDetectorRef.detectChanges();
        });
      });
  }

  private checkAllCountriesBeforeSubmit() {
    if (this.isForAllCountry) {
      let selectingCountry = this.countryGrid.getSelectedNode().data;
      let mainData =
        this.cacheData[selectingCountry[ID_STRING.COUNTRY_LANGUAGE_ID]].gridData
          .data;
      Object.keys(this.cacheData).forEach((idCountryLanguage) => {
        if (
          idCountryLanguage != selectingCountry[ID_STRING.COUNTRY_LANGUAGE_ID]
        ) {
          mainData.forEach((main) => {
            let found = this.cacheData[idCountryLanguage].gridData.data.find(
              (i) =>
                i[ID_STRING.ID_SHARING_TREE_GROUPS] ==
                main[ID_STRING.ID_SHARING_TREE_GROUPS]
            );
            if (found) {
              found[ID_STRING.PRIORITY] = main[ID_STRING.PRIORITY];

              this.cacheData[idCountryLanguage].isDirty = true;
            }
          });
        }
      });
    }
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

  public reload() {
    this.reset();
    this.initCountryGridData(() => {
      this.loadFilterFromSeletedCountry();
    });

    this.changeDetectorRef.detectChanges();
  }

  private reset() {
    this.validationError = {};
    this.profileData = {};
    this.cacheData = {};
    this.cacheIdData = {};

    this.changeDetectorRef.detectChanges();
  }

  public createJsonData(isCreateTemplate?: boolean) {
    return {
      IdSelectionWidget: RuleEnum.OrdersGroup,
      IdSelectionProject: this.selectedEntity[camelCase(this.widgetListenKey)],
      JsonRules: this.buildCountryRuleForSave(isCreateTemplate),
    };
  }

  public createJsonDataForProfile(): Observable<any> {
    return this.ruleService
      .getProjectRulesForTemplate(
        RuleEnum.OrdersGroup,
        this.selectedEntity[camelCase(this.widgetListenKey)]
      )
      .map((response: ApiResultResponse) => {
        let saveData = {
          IdSelectionWidget: RuleEnum.OrdersGroup,
          IdSelectionProject:
            this.selectedEntity[camelCase(this.widgetListenKey)],
          JsonRules: [],
        };

        if (!isEmpty(this.cacheData)) {
          saveData.JsonRules.push({
            //Rules: this.buildRules(this.cacheData[this.currentSelectedGridItem('countryGrid')[ID_STRING.COUNTRY_LANGUAGE_ID]].gridData.data, true),
            Rules: [
              {
                IsActive: 1,
                MediaCode:
                  this.currentSelectedGridItem('countryGrid')[
                    ID_STRING.MEDIACODE
                  ],
                rules: this.buildRuleForSave(
                  this.cacheData[
                    this.currentSelectedGridItem('countryGrid')[
                      ID_STRING.COUNTRY_LANGUAGE_ID
                    ]
                  ].gridData.data
                ),
              },
            ],
          });
        }

        return saveData;
      });
  }

  private initFilterGridSetting(): ControlGridColumnModel[] {
    const colSetting = [
      new ControlGridColumnModel({
        title: 'IdSharingTreeGroups',
        data: 'IdSharingTreeGroups',
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
        title: 'GroupName',
        data: 'GroupName',
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
        title: 'IconName',
        data: 'IconName',
        readOnly: false,
        setting: {
          Setting: [
            {
              DisplayField: {
                ReadOnly: '1',
              },
            },
            {
              ControlType: {
                Type: 'icon',
              },
            },
          ],
        },
      }),
      new ControlGridColumnModel({
        title: 'Priority',
        data: 'Priority',
        readOnly: false,
        setting: {
          Setting: [
            {
              ControlType: {
                Type: 'Priority',
              },
            },
          ],
        },
      }),
    ];
    return colSetting;
  }

  /**
   * initColumnCountryGridSetting
   */
  private initColumnCountryGridSetting(columns: any): ControlGridColumnModel[] {
    columns.push(
      new ControlGridColumnModel({
        title: 'Priority',
        data: 'Priority',
        readOnly: false,
        setting: {
          Setting: [
            {
              ControlType: {
                Type: 'Priority',
              },
            },
          ],
        },
      })
    );
    return columns;
  }
  private buildCountryRuleForSave(isCreateTemplate: boolean) {
    let result: any[] = [];
    if (this.cacheData) {
      let keys = Object.keys(this.cacheData);
      for (let i = 0; i < keys.length; i++) {
        //if ((this.isForAllCountry && keys[i] != '0') || (!this.isForAllCountry && keys[i] == '0')) {
        //    continue;
        //}

        const countries = this.countryGrid.getCurrentNodeItems();
        const countryId = countries.find(
          (c) => c[ID_STRING.COUNTRY_LANGUAGE_ID] == keys[i]
        )[ID_STRING.COUNTRY_ID];
        const mediaCode = countries.find(
          (c) => c[ID_STRING.COUNTRY_LANGUAGE_ID] == keys[i]
        )[ID_STRING.MEDIACODE];
        if (this.cacheData[keys[i]].isDirty || isCreateTemplate) {
          result.push({
            IdSelectionProjectCountry: countryId,
            IdCountrylanguage: keys[i],
            Rules: [
              {
                IsActive: 1,
                IdSelectionProjectRules:
                  this.buildIdSelectionProjectRules(countryId),
                MediaCode: mediaCode,
                rules: this.buildRuleForSave(
                  this.cacheData[keys[i]].gridData.data
                ),
              },
            ],
          });
        }
      }
    }

    return result;
  }

  private buildCountryRuleForSaveProfile(allRules: any[]) {
    let result: any[] = [];
    let ignoreCountryIds = [];

    if (this.cacheData) {
      let keys = Object.keys(this.cacheData);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] == '0') continue;
        const countryId = this.countryGridData.data.find(
          (c) => c[ID_STRING.COUNTRY_LANGUAGE_ID] == keys[i]
        )[ID_STRING.COUNTRY_ID];
        const mediaCode = this.countryGridData.data.find(
          (c) => c[ID_STRING.COUNTRY_LANGUAGE_ID] == keys[i]
        )[ID_STRING.MEDIACODE];
        if (this.cacheData[keys[i]].isDirty) {
          result.push({
            IdSelectionProjectCountry: countryId,
            IdCountrylanguage: keys[i],
            Rules: [
              {
                IsActive: 1,
                IdSelectionProjectRules:
                  this.buildIdSelectionProjectRules(countryId),
                MediaCode: mediaCode,
                rules: this.buildRuleForSave(
                  this.cacheData[keys[i]].gridData.data
                ),
              },
            ],
          });

          ignoreCountryIds.push(countryId);
        }
      }
    }

    ignoreCountryIds.forEach((countryId) => {
      allRules = allRules.filter((r) => r[ID_STRING.COUNTRY_ID] != countryId);
    });

    let newCountryList = [];
    for (let i = 0; i < allRules.length; i++) {
      if (newCountryList.indexOf(allRules[i][ID_STRING.COUNTRY_ID]) === -1) {
        newCountryList.push(allRules[i][ID_STRING.COUNTRY_ID]);
      }
    }

    newCountryList.forEach((countryId) => {
      result.push({
        IdSelectionProjectCountry: countryId,
        IdCountrylanguage: this.countryGridData.data.find(
          (c) => c[ID_STRING.COUNTRY_ID] == countryId
        )[ID_STRING.COUNTRY_LANGUAGE_ID],
        Rules: this.buildRulesForHiddenCountry(allRules, countryId),
      });
    });

    return result;
  }

  private currentSelectedGridItem(gridObject): any {
    return Uti.mapArrayToObject(this[gridObject].selectedItem() || [], true);
  }

  private buildIdSelectionProjectRules(countryId) {
    let result;
    if (this.cacheIdData.hasOwnProperty(countryId)) {
      result = this.cacheIdData[countryId];
    }

    return result;
  }

  private buildRuleForSave(rules) {
    let result: any[] = [];
    rules.forEach((rule) => {
      if (rule[ID_STRING.PRIORITY]) {
        result.push({
          value: {
            IdSharingTreeGroups: rule.IdSharingTreeGroups,
            [ID_STRING.PRIORITY]: rule[ID_STRING.PRIORITY],
          },
        });
      }
    });

    return result;
  }

  private buildRulesForHiddenCountry(allRules, countryId) {
    let result = [];

    for (let i = 0; i < allRules.length; i++) {
      if (allRules[i][ID_STRING.COUNTRY_ID] == countryId) {
        result.push({
          IsActive: 1,
          IdSelectionProjectRules: allRules[i].IdSelectionProjectRules,
          MediaCode: !isNil(allRules[i].Mediacode)
            ? allRules[i][ID_STRING.MEDIACODE]
            : null,
          rules: JSON.parse(allRules[i].JsonCaseRules).rules,
        });
      }
    }
    return result;
  }

  /**
   * loadFilterFromSeletedCountry
   */
  private loadFilterFromSeletedCountry() {
    if (this.countryGrid && this.countryGrid.selectedNode) {
      const item = this.countryGrid.selectedNode.data;
      const countryId = item[ID_STRING.COUNTRY_ID];
      const countryLanguageId = item[ID_STRING.COUNTRY_LANGUAGE_ID];

      //if (this.groupPriorityGrid) {
      //    this.resetPriorityForFilterGrid();
      //}

      if (!countryId) {
        this.validateGroupPriorityGrid();
        this.changeDetectorRef.detectChanges();
        return;
      }

      if (this.profileData && this.profileData.length) {
        let profile = this.profileData[0];
        let rules = profile.Rules;
        if (rules) {
          let selectingCountry = this.countryGrid.getSelectedNode().data;
          if (this.isForAllCountry) {
            this.countryGrid.getGridData().forEach((country) => {
              this.processApplyProfile(rules, country, selectingCountry);
            });
          } else {
            this.processApplyProfile(rules, selectingCountry, selectingCountry);
          }
        }

        this.profileData = [];
        this.validateGroupPriorityGrid();
        this.onTableEditSuccess();
        this.changeDetectorRef.detectChanges();
        return;

        //let rulesOfThisCountryId = this.profileData.find(r => r[ID_STRING.COUNTRY_LANGUAGE_ID] == countryLanguageId);
        //if (rulesOfThisCountryId && rulesOfThisCountryId.Rules && rulesOfThisCountryId.Rules.length) {
        //    this.setPriorityForFilterGird(rulesOfThisCountryId.Rules[0]);
        //    this.cacheData[countryLanguageId] = {
        //        gridData: cloneDeep(this.filterGridData),
        //        isDirty: true
        //    };

        //    this.profileData = this.profileData.filter(p => p[ID_STRING.COUNTRY_LANGUAGE_ID] != countryLanguageId);

        //    this.emitAllTableEvents();

        //    this.validateGroupPriorityGrid();
        //    this.changeDetectorRef.detectChanges();
        //    return;
        //}
      }

      if (this.cacheData[countryLanguageId]) {
        this.filterGridData = {
          data: this.cacheData[countryLanguageId].gridData.data,
          columns: this.initFilterGridSetting(),
        };
        this.validateGroupPriorityGrid();
      } else {
        this.ruleServiceSubscription = this.ruleService
          .getProjectRules(
            RuleEnum.OrdersGroup,
            this.selectedEntity[camelCase(this.widgetListenKey)],
            countryId
          )
          .subscribe((response: ApiResultResponse) => {
            this.appErrorHandler.executeAction(() => {
              if (!response || !response.item || !response.item.length) {
                this.cacheData[countryLanguageId] = {
                  gridData: cloneDeep(this.filterGridData),
                  isDirty: false,
                };

                this.changeDetectorRef.detectChanges();
                return;
              }

              let rulesFromService = response.item[0][0];
              this.cacheIdData[countryId] =
                rulesFromService.IdSelectionProjectRules;
              this.setPriorityForFilterGird(
                Uti.tryParseJson(rulesFromService.JsonCaseRules)
              );

              this.cacheData[countryLanguageId] = {
                gridData: cloneDeep(this.filterGridData),
                isDirty: false,
              };

              this.validateGroupPriorityGrid();
              this.changeDetectorRef.detectChanges();
            });
          });
      }

      this.changeDetectorRef.detectChanges();
    }
  }

  private processApplyProfile(rules, country, selectingCountry) {
    let data = this.buildDataWithPriority(rules[0]);

    if (
      country[ID_STRING.COUNTRY_LANGUAGE_ID] ==
      selectingCountry[ID_STRING.COUNTRY_LANGUAGE_ID]
    ) {
      this.filterGridData = {
        data: data,
        columns: this.initFilterGridSetting(),
      };
    }

    this.cacheData[country[ID_STRING.COUNTRY_LANGUAGE_ID]] = {
      gridData: {
        data: cloneDeep(data),
        columns: this.initFilterGridSetting(),
      },
      isDirty: true,
    };
  }

  private resetPriorityForFilterGrid() {
    //let data = this.filterGridData.data;
    //if (!data || !data.length) return;

    if (this.groupPriorityGrid) {
      this.groupPriorityGrid.getCurrentNodeItems().forEach((item) => {
        item.Priority = '';
        this.groupPriorityGrid.updateRowData([item]);
      });
    }

    this.validateGroupPriorityGrid();
    this.changeDetectorRef.detectChanges();
  }

  private setPriorityForFilterGird(newPriorityData: any) {
    let data = this.groupPriorityGrid.getCurrentNodeItems();
    if (!data || !data.length) return;
    if (
      !newPriorityData ||
      !newPriorityData.rules ||
      !newPriorityData.rules.length
    ) {
      for (let item of data) {
        item[ID_STRING.PRIORITY] = '';
      }
    } else {
      for (let item of data) {
        const priority = this.getPriorityFromRule(
          newPriorityData.rules,
          item.IdSharingTreeGroups
        );
        item[ID_STRING.PRIORITY] = priority;
      }
    }
    //this.filterGridData = {
    //    data: data,
    //    columns: this.filterGridData.columns
    //};

    this.groupPriorityGrid.updateRowData(data);

    this.validateGroupPriorityGrid();
    this.changeDetectorRef.detectChanges();
  }

  private buildDataWithPriority(newPriorityData: any) {
    let data = this.groupPriorityGrid.getCurrentNodeItems();
    if (!data || !data.length) return;
    if (
      !newPriorityData ||
      !newPriorityData.rules ||
      !newPriorityData.rules.length
    ) {
      for (let item of data) {
        item[ID_STRING.PRIORITY] = '';
      }
    } else {
      for (let item of data) {
        const priority = this.getPriorityFromRule(
          newPriorityData.rules,
          item.IdSharingTreeGroups
        );
        item[ID_STRING.PRIORITY] = priority;
      }
    }

    return data;
  }

  private getPriorityFromRule(
    newPriorityDataRules: any,
    idSharingTreeGroups: any
  ): any {
    for (let item of newPriorityDataRules) {
      if (!item.value || !item.value.IdSharingTreeGroups) continue;
      if (item.value.IdSharingTreeGroups == idSharingTreeGroups) {
        return item.value.Priority;
      }
    }
    return '';
  }

  /**
   * initGroupPriorityGridSetting
   */
  private initGroupPriorityGridSetting(): ControlGridColumnModel[] {
    const colSetting = [
      new ControlGridColumnModel({
        title: 'IdSharingTreeGroups',
        data: 'IdSharingTreeGroups',
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
        title: 'GroupName',
        data: 'GroupName',
      }),
      new ControlGridColumnModel({
        title: 'IconName',
        data: 'IconName',
        setting: {
          Setting: [
            {
              DisplayField: {
                Hidden: '0',
                ReadOnly: '1',
              },
            },
            {
              ControlType: {
                Type: 'icon',
              },
            },
          ],
        },
      }),
      new ControlGridColumnModel({
        title: 'Priority',
        data: 'Priority',
        readOnly: false,
        setting: {
          Setting: [
            {
              ControlType: {
                Type: 'Priority',
              },
            },
          ],
        },
      }),
    ];
    return colSetting;
  }

  public onCountryGridEditEnded($event) {
    if (this.cacheData) {
      this.cacheData[$event[ID_STRING.COUNTRY_LANGUAGE_ID]].isDirty = true;

      this.emitAllTableEvents();

      this.changeDetectorRef.detectChanges();
    }
  }

  public hasValidationErrorHandler($event, gridName) {
    this.validationError[gridName] = $event;

    this.changeDetectorRef.detectChanges();
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

  private validateGroupPriorityGrid() {
    setTimeout(() => {
      let readOnly = this.checkGroupPriorityGridReadOnly();
      let disabled = this.checkGroupPriorityGridDisabled();

      if (
        readOnly !== this.isGroupPriorityGridReadOnly ||
        disabled !== this.isGroupPriorityGridDisabled
      ) {
        this.isGroupPriorityGridReadOnly = readOnly;
        this.isGroupPriorityGridDisabled = disabled;
        this.groupPriorityGrid.toggleColumns(
          ['FilterExtended', 'Delete', 'Edit'],
          !this.isGroupPriorityGridReadOnly
        );
        this.changeDetectorRef.detectChanges();

        if (this.groupPriorityGrid) {
          this.groupPriorityGrid.refresh();
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
}
