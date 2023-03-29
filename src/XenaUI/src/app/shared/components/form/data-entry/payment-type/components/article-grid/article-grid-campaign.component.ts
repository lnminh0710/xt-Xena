import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  AppErrorHandler,
  DatatableService,
  ArticleService,
  PropertyPanelService,
  ModalService,
  HotKeySettingService,
  DataEntryProcess,
} from 'app/services';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import cloneDeep from 'lodash-es/cloneDeep';
import { DataEntryActions } from 'app/state-management/store/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Uti, CustomValidators } from 'app/utilities/uti';
import { FormModel, FormOutputModel } from 'app/models';
import { WjInputNumber } from 'wijmo/wijmo.angular2.input';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import { DataEntryFormBase } from 'app/shared/components/form/data-entry/data-entry-form-base';
import { OrderDataEntryArticleGridModel } from 'app/models';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { OrderFailedDataEnum } from 'app/app.constants';

@Component({
  selector: 'data-entry-article-grid-campaign',
  templateUrl: './article-grid-campaign.component.html',
  styleUrls: ['./article-grid-campaign.component.scss'],
})
export class ArticleGridCampaignComponent
  extends DataEntryFormBase
  implements OnInit, OnDestroy, AfterViewInit
{
  // private static orderDataMediaCodeNr: string;
  private articleGridDataState: Observable<any>;
  private articleGridDataStateSubscription: Subscription;
  // private orderDataMediaCode: Observable<string>;
  // private orderDataMediaCodeSubscription: Subscription;
  private selectedSimpleTabChangedState: Observable<any>;
  private selectedSimpleTabChangedStateSubscription: Subscription;
  private scanningStatusCallSkipStateSubscription: Subscription;
  private scanningStatusCallSkipState: Observable<any>;
  private articleServiceSubscription: Subscription;
  private orderFailedRequestDataState: Observable<any>;
  private orderFailedRequestDataStateSubcription: Subscription;
  private cachedFailedDataState: Observable<any>;
  private cachedFailedDataStateSubcription: Subscription;

  // private showQuantityError = false;
  // private isAdding = false;
  private selectItem: any;
  private total: number = 0;
  // public formGroup: FormGroup;
  // public showArticleNrError = false;
  // public showArticleGridError = false;
  public selectedArticleItemQuantity?: number = 1;
  // public dataResult1: any;
  public dataResult2: any;
  public showDialog = false;
  public isContinueClicked = false;
  public isFullFill = false;
  public globalNumberFormat: string = null;
  public globalPropertiesLocal: any[] = [];
  @ViewChild('wijQuantNum') wijQuantNum: ElementRef;
  @ViewChild('articleUsedInCampaign')
  articleUsedInCampaign: XnAgGridComponent;

  @Input() tabID: string;
  @Input() articleOrderGridId: string;
  @Input() articleUsedInCampaignId: string;
  @Input() set globalProperties(globalProperties: any[]) {
    this.globalPropertiesLocal = globalProperties;
    this.globalNumberFormat =
      this.propertyPanelService.buildGlobalNumberFormatFromProperties(
        globalProperties
      );
  }

  @Output() outputData: EventEmitter<FormOutputModel> = new EventEmitter();
  constructor(
    private appErrorHandler: AppErrorHandler,
    private datatableService: DatatableService,
    private articleService: ArticleService,
    private dataEntryActions: DataEntryActions,
    private propertyPanelService: PropertyPanelService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private modalService: ModalService,
    protected router: Router,
    public hotKeySettingService: HotKeySettingService,
    private _changeDetectorRef: ChangeDetectorRef,
    private dataEntryProcess: DataEntryProcess
  ) {
    super(router, {
      defaultTranslateText: 'articleGridData',
      emptyData: new OrderDataEntryArticleGridModel(),
    });
    this.articleGridDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).articleGridData
    );
    // this.orderDataMediaCode = this.store.select(state => dataEntryReducer.getDataEntryState(state, this.tabID).orderDataWidgetMediaCode);
    this.selectedSimpleTabChangedState = store.select(
      (state) =>
        tabSummaryReducer.getTabSummaryState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedSimpleTab
    );
    this.scanningStatusCallSkipState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .scanningStatusCallSkip
    );
    this.orderFailedRequestDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .orderFailedRequestData
    );
    this.cachedFailedDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).cachedFailedData
    );
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.createEmptyDataForGrid();
    this.subscription();
    this.subscribeOrderFailed();
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    Uti.unsubscribe(this);
    this.dataResult2 = null;
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {}

  private createEmptyDataForGrid() {
    this.createEmptyDataForGird2();
  }
  private createEmptyDataForGird2() {
    this.dataResult2 = {
      data: [],
      columns: this.createColumnHeader_2(),
    };
  }
  private subscription() {
    this.articleGridDataStateSubscription = this.articleGridDataState.subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (!response || isEmpty(response)) {
            this.createEmptyDataForGrid();
            return;
          }
          //clear emtpy grid
          //this.dataResult1.data = [];

          response = this.datatableService.formatDataTableFromRawData(
            response.data
          );
          this.dataResult2 = this.datatableService.buildDataSource(response);
          // this.autoAddItemToTopGrid();
        });
      }
    );

    this.selectedSimpleTabChangedStateSubscription =
      this.selectedSimpleTabChangedState.subscribe((selectedSimpleTab: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!selectedSimpleTab) {
            return;
          }
          setTimeout(() => {
            this.dataResult2 = cloneDeep(this.dataResult2);
          });
        });
      });
    this.subscribeSkipState();
  }
  private subscribeSkipState() {
    this.scanningStatusCallSkipStateSubscription =
      this.scanningStatusCallSkipState.subscribe((canSkip: any) => {
        this.appErrorHandler.executeAction(() => {
          if (canSkip && canSkip.skip) {
            this.createEmptyDataForGrid();
          }
        });
      });
  }
  private autoAddItemToTopGrid() {
    if (
      !this.dataResult2 ||
      !this.dataResult2.data ||
      !this.dataResult2.data.length ||
      this.dataResult2.data.length > 1
    )
      return;
    // auto add first row with quantity is 1
    this.addArticleToGrid(this.dataResult2.data[0], 1, true, true);
  }
  public addArticleToGrid(
    articleData: any,
    quantity?: number,
    doNotShowMessage?: boolean,
    autoAdd?: boolean
  ) {
    this.store.dispatch(
      this.dataEntryActions.addArticleDataFromArticleCampaignGrid(
        {
          articleData,
          quantity,
        },
        this.tabID
      )
    );
  }

  private createColumnHeader_2() {
    return [
      {
        title: 'Article Nr.',
        data: 'ArticleNr',
        setting: {
          Setting: [
            {
              DisplayField: {
                Width: 140,
              },
            },
          ],
        },
        width: 140,
      },
      {
        title: 'Article Name',
        data: 'ArticleNameShort',
      },
      {
        title: 'Price',
        data: 'SalesPrice',
        setting: {
          Setting: [
            {
              DisplayField: {
                Width: 100,
                AllowResizing: false,
                DisableFilter: true,
              },
            },
          ],
        },
      },
      {
        title: 'Notes',
        data: 'notes',
      },
    ];
  }

  public cancelSetQuantity() {
    this.showDialog = false;
    this.selectedArticleItemQuantity = 1;
    this.isContinueClicked = false;
  }
  public buildSelectedItem(rowData) {
    if (rowData.IsActive) {
      this.selectItem = rowData;
      this.showDialog = true;
      this.selectedArticleItemQuantity = 1;
    }
  }
  onShowDialog() {
    setTimeout(() => {
      if (this.wijQuantNum) {
        $(this.wijQuantNum.nativeElement).val(this.selectedArticleItemQuantity);
        $(this.wijQuantNum.nativeElement).focus();
        setTimeout(() => {
          $(this.wijQuantNum.nativeElement)
            .unbind('keyup')
            .bind('keyup', (event) => {
              if (event.keyCode === 13) {
                // means Enter key
                this.continueSetQuantity();
              }
            });
        }, 100);
      }
    }, 500);
  }

  onRowMarkedAsDeletedTable1($event) {}

  private focusQuantityTextbox() {
    setTimeout(() => {
      if (this.wijQuantNum) $(this.wijQuantNum.nativeElement).focus();
    }, 100);
  }
  public continueSetQuantity() {
    this.isContinueClicked = true;
    if (isNil(this.selectedArticleItemQuantity)) {
      this.focusQuantityTextbox();
      return;
    }
    this.addCompositionAfterConfirmation();
    this.showDialog = false;
    this.isContinueClicked = false;
  }
  private addCompositionAfterConfirmation() {
    if (!this.selectItem) {
      return;
    }
    this.addArticleToGrid(this.selectItem, this.selectedArticleItemQuantity);
  }

  public rebuildTranslateText() {
    this.rebuildTranslateTextSelf();
    Uti.rebuildColumnHeaderForGrid(this.dataResult2, this.transferTranslate);
  }

  public onResult2GridKeyDown($event) {
    if ($event.key === 'Enter') {
      let selectedNode = this.articleUsedInCampaign.getSelectedNode();
      if (selectedNode) {
        this.buildSelectedItem(selectedNode.data);
      }
    }
  }

  public isBlockUI() {
    return (
      this.tabID == this.dataEntryProcess.selectedODETab.TabID &&
      this.dataEntryProcess.mediaCodeDoesnotExist
    );
  }

  /**
   * subscribeOrderFailed: call to prepare data and dispatch using for order faied
   **/
  private subscribeOrderFailed() {
    this.orderFailedRequestDataStateSubcription =
      this.orderFailedRequestDataState.subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (response && response.isNotify) {
            this.store.dispatch(
              this.dataEntryActions.orderFailedReceiveData(
                {
                  key: OrderFailedDataEnum.ArticleGrid,
                  data: {
                    //articleGridExportData: this.dataResult1,
                    articleGridCampaignData: this.dataResult2,
                  },
                },
                this.tabID
              )
            );
          }
        });
      });

    this.cachedFailedDataStateSubcription =
      this.cachedFailedDataState.subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (response) {
            if (response.articleGridCampaignData)
              this.dataResult2 = response.articleGridCampaignData;
          }
        });
      });
  }
}
