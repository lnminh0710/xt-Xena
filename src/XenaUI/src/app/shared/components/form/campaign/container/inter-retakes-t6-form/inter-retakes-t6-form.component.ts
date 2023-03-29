import {
  OnInit,
  OnDestroy,
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AppErrorHandler,
  SearchService,
  ModalService,
  DatatableService,
  CampaignService,
  PropertyPanelService,
} from 'app/services';
import { SalesCampaignType, Configuration } from 'app/app.constants';
import { ControlGridModel, MessageModel, ApiResultResponse } from 'app/models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import camelCase from 'lodash-es/camelCase';
import isEmpty from 'lodash-es/isEmpty';
import filter from 'lodash-es/filter';
import cloneDeep from 'lodash-es/cloneDeep';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Uti } from 'app/utilities';
import { SplitComponent } from 'angular-split';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as widgetContentDetailReducer from 'app/state-management/store/reducer/widget-content-detail';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import {
  ProcessDataActions,
  CustomAction,
  WidgetDetailActions,
} from 'app/state-management/store/actions';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { IPageChangedEvent } from 'app/shared/components/xn-pager/xn-pagination.component';
import { Subject } from 'rxjs';
import { WidgetModuleInfoTranslationComponent } from '../../../../widget/components/widget-module-info-translation';

@Component({
  selector: 'app-campaign-inter-retakes-t6-form',
  styleUrls: ['./inter-retakes-t6-form.component.scss'],
  templateUrl: './inter-retakes-t6-form.component.html',
})
export class CampaignInterReTakesFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public globalNumberFormat: string = null;
  public globalProps: any[] = [];
  public daysToWaitValid = true;
  public isContinueClicked = false;
  public showDialog = false;
  public campaignDialogModel: any = { daysToWait: '' };
  public isRenderCompleted = false;
  public isNewItem = false;
  public pageSize: number = Configuration.pageSize;
  public isRenderWidgetInfoTranslation: boolean;
  public combinationTranslateMode: any;
  public dataResult: any;
  public rowLeftGrouping: boolean;
  public rowBottomGrouping: boolean;
  public rowRightGrouping: boolean;

  private cachedCampaignDataBottom: Array<ChangingModel> = [];
  public campaignDataLeft: ControlGridModel;
  public campaignDataBottom: ControlGridModel;
  public campaignDataRight: ControlGridModel;
  private currentcampaignDataBottom: ControlGridModel;
  private idSalesCampaignWizard: any;
  private currentCampaignNumber: any;
  public chainValue = 'all';
  private campaignId: any;
  private shadowCampaignDataLeft: Array<any> = [];
  private saveData: any = [];
  private articleSelectedWidget: any;

  private selectedEntityState: Observable<any>;
  private selectedEntityStateSubscription: Subscription;
  private searchServiceSubscription: Subscription;
  private campaignServiceSubscription: Subscription;
  private dispatcherSubscription: Subscription;
  private perfectScrollbarConfig: any;

  private rowsDataState: Observable<any>;
  private rowsDataStateSubscription: Subscription;

  private pageIndex: number = Configuration.pageIndex;
  private keyword = '';
  private totalResults = 0;

  private bottomRowClickSubject: Subject<any> = new Subject();
  private bottomRowClickSubscription: Subscription;

  @ViewChild('campaignGridLeft') campaignGridLeft: XnAgGridComponent;
  @ViewChild('campaignGridBottom') campaignGridBottom: XnAgGridComponent;
  @ViewChild('campaignGridRight') campaignGridRight: XnAgGridComponent;
  @ViewChild('splitContainer') splitContainerComponent: SplitComponent;
  @ViewChild('widgetInfoTranslation')
  widgetModuleInfoTranslationComponent: WidgetModuleInfoTranslationComponent;

  @Input() campaignGridLeftId: string;
  @Input() campaignGridBottomId: string;
  @Input() campaignGridRightId: string;
  @Input() set globalProperties(globalProperties: any[]) {
    this.globalProps = globalProperties;
    this.globalNumberFormat =
      this.propertyPanelService.buildGlobalNumberFormatFromProperties(
        globalProperties
      );
  }
  private outputModel: {
    submitResult?: boolean;
    formValue: any;
    isValid?: boolean;
    isDirty?: boolean;
    returnID?: string;
  };
  @Output() outputData: EventEmitter<any> = new EventEmitter();

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private appErrorHandler: AppErrorHandler,
    private searchService: SearchService,
    private datatableService: DatatableService,
    private campaignService: CampaignService,
    private modalService: ModalService,
    private toasterService: ToasterService,
    private propertyPanelService: PropertyPanelService,
    private dispatcher: ReducerManagerDispatcher,
    protected router: Router,
    protected widgetDetailActions: WidgetDetailActions
  ) {
    super(router);

    this.selectedEntityState = this.store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedEntity
    );
    this.rowsDataState = this.store.select(
      (state) =>
        widgetContentDetailReducer.getWidgetContentDetailState(
          state,
          this.ofModule.moduleNameTrim
        ).rowsData
    );

    this.onSearchComplete = this.onSearchComplete.bind(this);
  }
  public ngOnInit() {
    this.subcribtion();
    this.initData();
    this.initPerfectScroll();
  }
  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public campaignDataBottomRowClick($event: any) {
    this.bottomRowClickSubject.next($event);
    /*
        setTimeout(() => {
            this.getDetailGrid($event);
        }, 100);
        */
  }

  private onHiddenWidgetInfoTranslation(event?: any) {
    this.isRenderWidgetInfoTranslation = false;
    this.initData();
  }

  private reattach() {
    this.ref.reattach();
  }

  private openTranslateDialog(event) {
    let translateInDialog = true;
    if (event && event.mode == 'row') {
      translateInDialog = false;
    }
    if (translateInDialog) {
      this.dataResult = this.campaignDataLeft;
      this.combinationTranslateMode = event ? event.mode : null;
      this.isRenderWidgetInfoTranslation = true;
      setTimeout(() => {
        if (this.widgetModuleInfoTranslationComponent)
          this.widgetModuleInfoTranslationComponent.showDialog = true;
      }, 250);
    }
  }

  private openTranslateDialogRight(event) {
    let translateInDialog = true;
    if (event && event.mode == 'row') {
      translateInDialog = false;
    }
    if (translateInDialog) {
      this.isRenderWidgetInfoTranslation = true;
      this.dataResult = this.campaignDataRight;
      this.combinationTranslateMode = event ? event.mode : null;
      setTimeout(() => {
        if (this.widgetModuleInfoTranslationComponent)
          this.widgetModuleInfoTranslationComponent.showDialog = true;
      }, 250);
    }
  }

  handleRowLeftGroupPanel(data) {
    this.rowLeftGrouping = data;
  }

  handleRowBottomGroupPanel(data) {
    this.rowBottomGrouping = data;
  }

  handleRowRightGroupPanel(data) {
    this.rowRightGrouping = data;
  }

  public campaignDataLeftRowDoubleClick($event: any) {
    this.addCampaign();
  }

  public campaignDataBottomRowDoubleClick($event: any) {
    if (!this.isRenderCompleted) return;
    this.removeCampaign();
  }

  public addCampaign() {
    if (!this.isRenderCompleted) return;
    if (isEmpty(this.currentSelectedItemLeft())) {
      return;
    }
    this.showDialogConfimation(this.addCampaignAfterConfirmation.bind(this));
  }

  public addCampaignAfterConfirmation() {
    this.isRenderCompleted = false;
    let currentSeletedItemLeft = this.currentSelectedItemLeft();
    if (this.campaignDialogModel.daysToWait) {
      currentSeletedItemLeft.DaysToWait = this.campaignDialogModel.daysToWait;
    }
    currentSeletedItemLeft = this.getRightItem(currentSeletedItemLeft);
    this.campaignDataBottom = this.addItemCampaign(
      this.campaignDataBottom,
      currentSeletedItemLeft
    );
    this.campaignDataLeft = this.removeItemCampaign(
      this.campaignDataLeft,
      this.currentSelectedItemLeft()
    );
    this.resetRowIdForGrid();
    this.focusBottomLastItem();
  }

  public removeCampaign() {
    if (isEmpty(this.currentSelectedItemBottom())) {
      return;
    }
    this.removeItemInCached();
    // this.campaignDataLeft = this.addItemCampaign(this.campaignDataLeft, this.currentSelectedItemBottom());
    this.campaignDataBottom = this.removeItemCampaign(
      this.campaignDataBottom,
      this.currentSelectedItemBottom()
    );
    this.resetRowIdForGrid();
    this.search();
  }

  public removeAllCampaign() {
    if (!this.campaignDataBottom.data.length) return;
    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Are_You_Sure_You_Want_To_Remove_All_Campaigns',
          },
          { key: '</p>' },
        ],
        callBack1: () => {
          this.removeAllCampaignAfterConfirm();
        },
      })
    );
  }

  public onLeftTableSearch(keyword) {
    this.pageIndex = 1;
    this.keyword = keyword;
    this.search();
  }

  public onBottomCellEditEndHandler(eventData: any) {
    if (!eventData || !eventData.col) return;
    if (eventData.col.colId === 'DaysToWait') {
      // Build DaysToWait for detail grid
      for (let item of this.campaignDataRight.data) {
        if (item.BorderStatus === '1') continue;
        item.DaysToWait = eventData.data[eventData.col.colId];
        item['isEdited'] = true;
      }
      this.ref.detectChanges();
    }

    eventData.data['isEdited'] = true;
    this.onGridItemChanged(eventData.data);
    this.updateCachedItemData();
  }

  public onPageChanged(event: IPageChangedEvent) {
    this.pageIndex = event.page;
    this.pageSize = event.itemsPerPage;
    this.search();
  }

  public onPageNumberChanged(pageNumber: number) {
    this.pageSize = pageNumber;
  }

  /******************************************************************************************/
  /**********************PRIVATE METHODS*****************************************************/

  private getRightItem(leftSelectItem: any): any {
    let cachedItem = this.currentcampaignDataBottom.data.find(
      (x) => x.CampaignNr == leftSelectItem.CampaignNr
    );
    if (cachedItem && cachedItem.CampaignNr) {
      cachedItem.DaysToWait = leftSelectItem.DaysToWait;
      cachedItem['isEdited'] = true;
      return cachedItem;
    }
    return leftSelectItem;
  }

  private search() {
    if (
      this.modalService.isStopSearchWhenEmptySize(this.pageSize, this.pageIndex)
    )
      return;
    this.campaignGridLeft.isSearching = true;
    this.searchServiceSubscription = this.searchService
      .search('campaign', this.keyword, null, this.pageIndex, this.pageSize)
      .finally(() => {
        this.ref.detectChanges();
      })
      .subscribe(this.onSearchComplete);
  }

  private resetRowIdForGrid() {
    this.campaignDataLeft = this.datatableService.appendRowId(
      this.campaignDataLeft
    );
    this.campaignDataBottom = this.datatableService.appendRowId(
      this.campaignDataBottom
    );
    this.campaignDataRight = this.datatableService.appendRowId(
      this.campaignDataRight
    );
    this.ref.detectChanges();
  }

  private removeItemInCached() {
    Uti.removeItemInArray(
      this.cachedCampaignDataBottom,
      {
        idSalesCampaignArticle:
          this.currentSelectedItemBottom()['IdSalesCampaignArticle'],
      },
      'idSalesCampaignArticle'
    );
  }

  private addItemCampaign(
    controlGridModel: ControlGridModel,
    selectItem: any
  ): ControlGridModel {
    controlGridModel.data.push(cloneDeep(selectItem));
    return Uti.cloneDataForGridItems(controlGridModel);
  }

  private removeItemCampaign(
    controlGridModel: ControlGridModel,
    selectItem: any
  ): ControlGridModel {
    Uti.removeItemInArray(
      controlGridModel.data,
      selectItem,
      'IdSalesCampaignTracks'
    );
    this.setDirtyWhenMoveItem();
    this.resetDetailGrid();
    return Uti.cloneDataForGridItems(controlGridModel);
  }

  private removeAllCampaignAfterConfirm() {
    this.isRenderCompleted = false;
    // this.campaignDataLeft = {
    //     data: [...this.campaignDataLeft.data, ...this.campaignDataBottom.data],
    //     columns: this.campaignDataLeft.columns
    // };
    this.campaignDataBottom = {
      data: [],
      columns: this.campaignDataBottom.columns,
    };
    this.campaignDataRight = {
      data: [],
      columns: this.campaignDataRight.columns,
    };
    this.cachedCampaignDataBottom = [];
    this.focusBottomLastItem();
    this.setDirtyWhenMoveItem();
    this.ref.detectChanges();
    this.search();
  }

  private resetDetailGrid() {
    this.campaignDataRight = Uti.cloneDataForGridItems({
      data: [],
      columns: this.campaignDataRight.columns,
    });
  }

  private focusBottomLastItem() {
    if (!this.campaignDataBottom.data.length) {
      this.isRenderCompleted = true;
    }
    // this.resetRowIdForGrid();
    // Select the last item
    setTimeout(() => {
      if (this.campaignGridBottom) {
        this.campaignGridBottom.selectRowIndex(
          this.campaignDataBottom.data.length - 1,
          true
        );
      }
    });
  }

  private initData() {
    this.initEmptyDataForGrid();
    this.getCampaignForRight();
    this.getCampaignForDetail('');
    this.registerPressEnterForDaysToWaitTextBox();
  }

  private initPerfectScroll() {
    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };
  }

  private initEmptyDataForGrid() {
    this.campaignDataLeft = {
      data: [],
      columns: [],
    };
    this.campaignDataBottom = {
      data: [],
      columns: [],
    };
    this.campaignDataRight = {
      data: [],
      columns: [],
    };
  }

  private subcribtion() {
    this.selectedEntityStateSubscription = this.selectedEntityState.subscribe(
      (selectedEntityState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (selectedEntityState) {
            if (selectedEntityState.id) {
              this.campaignId = selectedEntityState.id;
            }

            if (selectedEntityState.idSalesCampaignWizard) {
              this.idSalesCampaignWizard =
                selectedEntityState.idSalesCampaignWizard;
              if (
                !selectedEntityState.selectedParkedItem ||
                !selectedEntityState.selectedParkedItem.campaignNr
              )
                return;
              this.currentCampaignNumber =
                selectedEntityState.selectedParkedItem.campaignNr.value;
            }
          }
        });
      }
    );

    this.dispatcherSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_SAVE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.submit();
        });
      });

    this.rowsDataStateSubscription = this.rowsDataState.subscribe(
      (rowsData: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!rowsData || !rowsData.length) return;
          this.setSelectedRow(rowsData);
        });
      }
    );

    this.bottomRowClickSubscription = this.bottomRowClickSubject
      .debounceTime(250)
      .subscribe((event) => {
        // console.log('campaignDataBottomRowClick');
        this.getDetailGrid(event);
      });
  }

  private setSelectedRow(rowsData: any) {
    for (let i = 0; i < rowsData.length; i++) {
      const widget = rowsData[i];
      if (!widget) continue;
      if (widget.widgetDetailId == 50) {
        const rowData = widget.rowData;
        if (!rowData || !rowData.length) continue;
        const selectedRow = {};
        for (let j = 0; j < rowData.length; j++) {
          selectedRow[rowData[j].key] = rowData[j].value;
        }
        if (this.campaignGridBottom)
          this.campaignGridBottom.setSelectedRow(selectedRow);
        this.articleSelectedWidget = widget;
      }
    }
  }

  private getCampaignForRight() {
    this.campaignServiceSubscription = this.campaignService
      .getCampaignTracks(this.idSalesCampaignWizard)
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          response = this.datatableService.formatDataTableFromRawData(
            response.item.data
          );
          this.campaignDataBottom =
            this.datatableService.buildDataSource(response);
          this.campaignDataLeft.columns = this.makeCampaignDataLeftColumn(
            this.campaignDataBottom.columns
          );
          this.currentcampaignDataBottom = cloneDeep(this.campaignDataBottom);
          this.campaignDataBottom = this.datatableService.appendRowId(
            this.campaignDataBottom
          );
          this.campaignDataLeft = {
            data: [],
            columns: this.datatableService.appendRowId(this.campaignDataLeft)
              .columns,
          };
          this.isRenderCompleted = !!this.campaignDataBottom.columns.length;
        });
      });
  }

  private makeCampaignDataLeftColumn(columns: any): any {
    const result = cloneDeep(columns);
    const description = result.find(
      (x) => x.data.toLowerCase() === 'descriptions'
    );
    description.setting.Setting = description.setting.Setting || [];
    description.setting.Setting[0] = description.setting.Setting[0] || {};
    description.setting.Setting[0] = description.setting.Setting[0] || {};
    description.setting.Setting[0].DisplayField =
      description.setting.Setting[0].DisplayField || {};
    description.setting.Setting[0].DisplayField.Hidden = '1';
    return result;
  }

  private getCampaignForDetail(
    idSalesCampaignTracks: any,
    idSalesCampaignWizard?: any,
    idSalesCampaignWizardTrack?: any
  ) {
    this.isRenderCompleted = false;
    if (this.isDataCachedAndReGetCachedData(idSalesCampaignTracks)) {
      setTimeout(() => {
        this.isRenderCompleted = true;
      }, 200);
      return;
    }
    this.campaignServiceSubscription = this.campaignService
      .getCampaignTracksCountries(
        idSalesCampaignTracks < 0 ? 0 : idSalesCampaignTracks,
        idSalesCampaignWizard,
        idSalesCampaignWizardTrack
      )
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          response = this.datatableService.formatDataTableFromRawData(
            response.item.data
          );
          response = this.datatableService.buildDataSource(response);
          response = this.datatableService.appendRowId(response);
          this.addMoreDataForDetail(response);
          this.campaignDataRight = response;
          this.isRenderCompleted = !!response.columns.length;
          this.makeTempIdForBottomGrid();
          // first load so dont add to cached
          if (
            !idSalesCampaignTracks &&
            !idSalesCampaignWizard &&
            !idSalesCampaignWizardTrack
          )
            return;
          this.addBottomCachedItem();
        });
      });
  }

  private makeTempIdForBottomGrid() {
    for (const item of this.campaignDataRight.data) {
      item.IdSalesCampaignTracksCountrys = item.IdSalesCampaignTracksCountrys
        ? item.IdSalesCampaignTracksCountrys
        : Uti.getTempId();
    }
  }

  private addBottomCachedItem() {
    this.isNewItem =
      this.currentSelectedItemBottom()['IdSalesCampaignTracks'] < 0;
    this.cachedCampaignDataBottom.push({
      itemData: this.currentSelectedItemBottom(),
      isNew: this.isNewItem,
      isChanged: false,
      detailData: this.campaignDataRight,
    });
  }

  private addMoreDataForDetail(data: any): any {
    if (!data.data || !data.data.length) return;
    let currentRightItem = this.currentSelectedItemBottom();
    if (currentRightItem.IdSalesCampaignTracks > 0) return;
    for (let item of data.data) {
      if (item.BorderStatus != '1') {
        if (!item['DaysToWait'] || isEmpty(item['DaysToWait'])) {
          item['DaysToWait'] = currentRightItem.DaysToWait;
        }
        if (!item['CreateDate'] || isEmpty(item['CreateDate'])) {
          item['CreateDate'] = currentRightItem.CreateDate;
        }
        item['IsActive'] = true;
      }
    }
  }

  private setDirtyWhenMoveItem() {
    const isDirty = this.checkDirtyAndGetSaveData();
    this.setOutputData(null, {
      submitResult: null,
      formValue: {},
      isValid: isDirty,
      isDirty: isDirty,
      returnID: null,
    });
  }

  private submit() {
    setTimeout(() => {
      if (!this.checkDirtyAndGetSaveData()) {
        this.setOutputData(null, {
          submitResult: false,
          formValue: {},
          isValid: true,
          isDirty: false,
        });
        return false;
      }
      this.udpateCampaign();
    }, 300);
  }

  private checkDirtyAndGetSaveData(): boolean {
    this.saveData = [
      ...this.makeDeleteData(),
      ...this.makeAddedAndEdittedBottomData(),
    ];
    return !!this.saveData.length || this.hasDataAdded();
  }

  private hasDataAdded(): boolean {
    const addItems = Uti.getItemsDontExistItems(
      this.campaignDataBottom.data,
      this.currentcampaignDataBottom.data,
      'IdSalesCampaignTracks'
    );
    return !!addItems && !!addItems.length;
  }

  private makeDeleteData(): Array<any> {
    const deleteData = Uti.getItemsDontExistItems(
      this.currentcampaignDataBottom.data,
      this.campaignDataBottom.data,
      'IdSalesCampaignTracks'
    );
    if (!deleteData || !deleteData.length) {
      return [];
    }
    return this.mapDeleteData(deleteData);
  }

  private mapDeleteData(mapData: Array<any>): Array<any> {
    const result: Array<any> = [];
    if (!mapData || !mapData.length) {
      return result;
    }
    for (const item of mapData) {
      result.push({
        IsDeleted: '1',
        IdSalesCampaignTracks: item.IdSalesCampaignTracks,
      });
    }
    return result;
  }

  private makeAddedAndEdittedBottomData(): Array<any> {
    let result = new Array<any>();
    for (let item of this.cachedCampaignDataBottom) {
      if (item.isNew) {
        result = [...result, ...this.makeAddOrEditRightData(item)];
      } else {
        // no data changed
        if (!item.isChanged) continue;
        result = [...result, ...this.makeAddOrEditRightData(item, true)];
      }
    }
    return result;
  }

  private makeAddOrEditRightData(
    currentData: ChangingModel,
    isEdited?: boolean
  ): Array<any> {
    let updateItem = {
      Descriptions: currentData.itemData.Descriptions || '',
      DaysToWait: currentData.itemData.DaysToWait,
      IsActive: true,
      MasterToIdSalesCampaignWizard:
        currentData.itemData.IdSalesCampaignWizard_Master,
      ChainToIdSalesCampaignWizard:
        currentData.itemData.IdSalesCampaignWizard_Chain,
      IdRepSalesCampaignType: currentData.itemData.IdRepSalesCampaignType,
      JsonCampagneTracksCountries: JSON.stringify({
        CampagneTracksCountries: this.makeAddOrEditDetailData(
          currentData,
          isEdited
        ),
      }),
    };
    if (isEdited) {
      updateItem['IdSalesCampaignTracks'] =
        currentData.itemData.IdSalesCampaignTracks;
    }
    return [updateItem];
  }

  private makeAddOrEditDetailData(
    currentData: ChangingModel,
    isEdited?: boolean
  ): Array<any> {
    let result: Array<any> = [];
    for (let item of currentData.detailData.data) {
      if (item.BorderStatus != '1' && (!isEdited || item.isEdited)) {
        let updateData = {
          IdSalesCampaignWizardItems:
            typeof item.IdSalesCampaignWizardItems == 'object' &&
            isEmpty(item.IdSalesCampaignWizardItems)
              ? null
              : item.IdSalesCampaignWizardItems,
          DaysToWait:
            typeof item.DaysToWait == 'object' && isEmpty(item.DaysToWait)
              ? null
              : item.DaysToWait,
          IsActive:
            typeof item.IsActive == 'object' && isEmpty(item.IsActive)
              ? false
              : !!item.IsActive,
        };
        if (isEdited) {
          updateData['IdSalesCampaignTracksCountrys'] =
            typeof item.IdSalesCampaignTracksCountrys == 'object' &&
            isEmpty(item.IdSalesCampaignTracksCountrys)
              ? null
              : item.IdSalesCampaignTracksCountrys;
        }
        result.push(updateData);
      }
    }
    return result;
  }

  private udpateCampaign() {
    this.campaignServiceSubscription = this.campaignService
      .saveCampaignTracks({ CampaignTracks: this.saveData })
      .subscribe(
        (data) => {
          this.appErrorHandler.executeAction(() => {
            this.setOutputData(null, {
              submitResult: true,
              formValue: {},
              isValid: true,
              isDirty: false,
              returnID: data.item.returnID,
            });
          });
        },
        (err) => {
          this.appErrorHandler.executeAction(() => {
            this.setOutputData(false);
          });
        }
      );
  }

  private setOutputData(submitResult: any, data?: any) {
    if (typeof data !== 'undefined') {
      this.outputModel = data;
    } else {
      this.outputModel = {
        submitResult: submitResult,
        formValue: {},
        isValid: false,
        isDirty: false,
      };
    }
    this.outputData.emit(this.outputModel);
  }

  private updateCachedItemData() {
    let currentCachedItem = this.cachedCampaignDataBottom.find(
      (x) =>
        x.itemData['IdSalesCampaignTracks'] ===
        this.currentSelectedItemBottom()['IdSalesCampaignTracks']
    );
    currentCachedItem.itemData = this.currentSelectedItemBottom();
  }

  public onRightRowEditEndHandler(eventData: any) {
    eventData['isEdited'] = true;
    this.onGridItemChanged();
  }

  public onRightCellEditEndHandler(eventData: any) {
    eventData.data['isEdited'] = true;
    this.onGridItemChanged();
  }

  public onCheckAllCheckedHandler(eventData: any) {
    this.onGridItemChanged();
  }

  private onGridItemChanged(rightSelectedItem?: any) {
    this.setOutputData(null, {
      submitResult: null,
      formValue: {},
      isValid: true,
      isDirty: true,
    });
    this.updateIsChangedDataForBottomCachedItem(rightSelectedItem);
  }

  private onSearchComplete(response: ApiResultResponse) {
    const results: Array<any> = response.item.results || [];
    if (!results || !results.length) {
      this.campaignDataLeft = {
        columns: this.campaignDataLeft.columns,
        data: [],
        totalResults: 0,
      };
      this.campaignGridLeft.isSearching = false;
      return;
    }
    const newData: Array<any> = [];
    if (results) {
      for (const res of results) {
        let dataObj: any = {};
        // If item is existed in the Right Grid
        // Then don't add to Left Grid
        if (
          res.campaignNr.toLowerCase() ==
            (this.currentCampaignNumber || '').toLowerCase() ||
          this.checkExistPrimaryItem(res['campaignNr'])
        ) {
          continue;
        }
        dataObj = this.makeGridSearchData(res);
        newData.push(dataObj);
      }
    }
    this.shadowCampaignDataLeft = newData;
    this.totalResults = response.item.total;
    this.filterLeftDataOnSearchComplete(newData, {
      chainValue: this.chainValue,
    });
    this.campaignGridLeft.isSearching = false;
  }

  private filterLeftDataOnSearchComplete(
    itemList: Array<any>,
    filterParam: any
  ) {
    const newData = filter(itemList, function (item) {
      return (
        filterParam.chainValue == 'all' ||
        (item.DefaultValue &&
          item.DefaultValue.toLowerCase() == filterParam.chainValue)
      );
    });
    let leftData = {
      data: newData,
      columns: this.campaignDataLeft.columns,
      totalResults: this.totalResults,
    };
    leftData = this.datatableService.appendRowId(leftData);
    this.campaignDataLeft = leftData;
  }

  private makeGridSearchData(res: any) {
    res.id = res.id.replace(/[^0-9]/g, '');
    const result = {};
    for (const col of this.campaignDataLeft.columns) {
      switch (col.data.toString().toLowerCase()) {
        case 'idsalescampaigntracks': {
          result[col.data] = Uti.getTempId();
          break;
        }
        case 'defaultvalue': {
          result[col.data] = this.makeGridSearchColumnTypeName(res);
          break;
        }
        case 'daystowait': {
          result[col.data] = 0;
          break;
        }
        case 'idsalescampaignwizard_master': {
          result[col.data] = this.campaignId;
          break;
        }
        case 'idsalescampaignwizard_chain': {
          result[col.data] = res.id;
          break;
        }
        case 'idrepsalescampaigntype': {
          result[col.data] = this.makeGridSearchColumnTypeId(res);
          break;
        }
        default: {
          result[col.data] = res[camelCase(col.data)];
          break;
        }
      }
    }
    return result;
  }

  private makeGridSearchColumnTypeId(res: any): any {
    if (
      (typeof res.isMaster === 'string' && res.isMaster === 'True') ||
      (typeof res.isMaster === 'boolean' && res.isMaster)
    ) {
      return SalesCampaignType.Master;
    }
    if (
      (typeof res.isAsile === 'string' && res.isAsile === 'True') ||
      (typeof res.isAsile === 'boolean' && res.isAsile)
    ) {
      return SalesCampaignType.Asile;
    }
    if (
      (typeof res.isInter === 'string' && res.isInter === 'True') ||
      (typeof res.isInter === 'boolean' && res.isInter)
    ) {
      return SalesCampaignType.Inter;
    }
    if (
      (typeof res.isTrack === 'string' && res.isTrack === 'True') ||
      (typeof res.isTrack === 'boolean' && res.isTrack)
    ) {
      return SalesCampaignType.Tracks;
    }
  }

  private makeGridSearchColumnTypeName(res: any): any {
    if (
      (typeof res.isMaster === 'string' && res.isMaster === 'True') ||
      (typeof res.isMaster === 'boolean' && res.isMaster)
    ) {
      return 'Master';
    }
    if (
      (typeof res.isAsile === 'string' && res.isAsile === 'True') ||
      (typeof res.isAsile === 'boolean' && res.isAsile)
    ) {
      return 'Asile';
    }
    if (
      (typeof res.isInter === 'string' && res.isInter === 'True') ||
      (typeof res.isInter === 'boolean' && res.isInter)
    ) {
      return 'Inter';
    }
    if (
      (typeof res.isTrack === 'string' && res.isTrack === 'True') ||
      (typeof res.isTrack === 'boolean' && res.isTrack)
    ) {
      return 'Tracks';
    }
  }

  private checkExistPrimaryItem(campaignNr: any): boolean {
    if (
      !this.campaignDataBottom ||
      !this.campaignDataBottom.data ||
      !this.campaignDataBottom.data.length
    )
      return false;
    const articleItem = this.campaignDataBottom.data.find(
      (x) => x.CampaignNr == campaignNr
    );
    return articleItem && articleItem.CampaignNr;
  }

  private getDetailGrid($event: any) {
    if (!$event) return;
    this.getCampaignForDetail(
      Uti.getValueFromArrayByKey($event, 'IdSalesCampaignTracks'),
      Uti.getValueFromArrayByKey($event, 'IdSalesCampaignWizard_Master'),
      Uti.getValueFromArrayByKey($event, 'IdSalesCampaignWizard_Chain')
    );

    if (this.articleSelectedWidget) {
      this.articleSelectedWidget.rowData = $event;
      this.store.dispatch(
        this.widgetDetailActions.loadWidgetTableDataRows(
          this.articleSelectedWidget,
          this.ofModule
        )
      );
    }
  }

  private showDialogConfimation(func: any) {
    if (!this.currentSelectedItemLeft().DaysToWait) {
      this.showDialog = true;
      this.focusDaysToWaitTextbox();
      this.campaignDialogModel.daysToWait = '';
      this.ref.detectChanges();
      return;
    }
    func();
  }

  private registerPressEnterForDaysToWaitTextBox() {
    $('#txt-campaign-days-to-wait:input').keydown(($event) => {
      if (!this.daysToWaitValid) return;
      if (!($event.which === 13 || $event.keyCode === 13)) {
        return;
      }
      setTimeout(() => {
        $('#btn-continue-set-days-to-wait').focus();
        if (this.isContinueClicked) return;
        this.continueSetDaystoWait();
      });
    });
  }

  private updateIsChangedDataForBottomCachedItem(rightSelectedItem?: any) {
    rightSelectedItem = rightSelectedItem || this.currentSelectedItemBottom();
    const currentItem = this.cachedCampaignDataBottom.find(
      (x) =>
        x.itemData &&
        x.itemData.IdSalesCampaignTracks ===
          rightSelectedItem['IdSalesCampaignTracks']
    );
    if (
      !currentItem ||
      !currentItem.itemData ||
      !currentItem.itemData.IdSalesCampaignTracks
    )
      return;
    currentItem.isChanged = true;
  }

  private isDataCachedAndReGetCachedData(idSalesCampaignTracks: any): boolean {
    let currentItem = this.cachedCampaignDataBottom.find(
      (x) =>
        x.itemData && x.itemData.IdSalesCampaignTracks === idSalesCampaignTracks
    );
    if (
      currentItem &&
      currentItem.itemData &&
      currentItem.itemData.IdSalesCampaignTracks
    ) {
      this.campaignDataRight = currentItem.detailData;
      this.isNewItem = currentItem.isNew;
      return true;
    }
    return false;
  }

  private focusDaysToWaitTextbox() {
    setTimeout(() => {
      $('#txt-campaign-days-to-wait:input').focus();
    }, 100);
  }

  public daysToWaitChange($event: any) {
    setTimeout(() => {
      this.daysToWaitValid = this.campaignDialogModel.daysToWait <= 9999999;

      this.isContinueClicked = !this.daysToWaitValid;
    });
  }

  public continueSetDaystoWait() {
    this.isContinueClicked = true;
    if (!this.campaignDialogModel.daysToWait) {
      this.focusDaysToWaitTextbox();
      this.ref.detectChanges();
      return;
    }
    if (this.campaignDialogModel.daysToWait > 9999999) {
      this.daysToWaitValid = false;
      this.focusDaysToWaitTextbox();
      return;
    }
    this.daysToWaitValid = true;
    this.addCampaignAfterConfirmation();
    this.showDialog = false;
    this.isContinueClicked = false;
    this.ref.detectChanges();
  }

  public cancelSetDaystoWait() {
    this.campaignDialogModel.daysToWait = '';
    this.showDialog = false;
    this.isContinueClicked = false;
    this.daysToWaitValid = true;
    this.ref.detectChanges();
  }

  public dragStart() {
    Uti.handleWhenSpliterResize();
  }

  public dragEnd(event: any) {
    setTimeout(() => {
      if (
        this.splitContainerComponent &&
        this.splitContainerComponent.areas &&
        this.splitContainerComponent.areas.length >= 2
      ) {
        if (this.splitContainerComponent.areas[0].size < 30) {
          this.splitContainerComponent.updateArea(
            this.splitContainerComponent.areas[0].component,
            0,
            50,
            50
          );
        }
      }
    }, 200);
  }

  public radioChecked(selectedValue: string): void {
    this.chainValue = selectedValue;
    this.filterLeftDataOnSearchComplete(this.shadowCampaignDataLeft, {
      chainValue: this.chainValue,
    });
  }

  private currentSelectedItemLeft(): any {
    return Uti.mapArrayToObject(
      this.campaignGridLeft.selectedItem() || [],
      true
    );
  }

  private currentSelectedItemBottom(): any {
    return Uti.mapArrayToObject(
      this.campaignGridBottom.selectedItem() || [],
      true
    );
  }
}

class ChangingModel {
  isNew: boolean = false;
  isChanged: boolean = false;
  itemData: any = {};
  detailData: {
    columns: Array<any>;
    data: Array<any>;
  };
  constructor(init?: Partial<ChangingModel>) {
    Object.assign(this, init);
  }
}
