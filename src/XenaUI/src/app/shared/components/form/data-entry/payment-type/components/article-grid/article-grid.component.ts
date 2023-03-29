import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Input,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
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
import {
  DataEntryActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Uti, CustomValidators } from 'app/utilities/uti';
import { FormModel, FormOutputModel } from 'app/models';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import * as dataEntryReducer from 'app/state-management/store/reducer/data-entry';
import { DataEntryFormBase } from 'app/shared/components/form/data-entry/data-entry-form-base';
import { OrderDataEntryArticleGridModel } from 'app/models';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { OrderFailedDataEnum } from 'app/app.constants';

@Component({
  selector: 'data-entry-article-grid',
  templateUrl: './article-grid.component.html',
  styleUrls: ['./article-grid.component.scss'],
})
export class ArticleGridComponent
  extends DataEntryFormBase
  implements OnInit, OnDestroy, AfterViewInit
{
  private static orderDataMediaCodeNr: string;
  private articleGridDataState: Observable<any>;
  private articleGridDataStateSubscription: Subscription;
  private orderDataMediaCode: Observable<string>;
  private orderDataMediaCodeSubscription: Subscription;
  private selectedSimpleTabChangedState: Observable<any>;
  private selectedSimpleTabChangedStateSubscription: Subscription;
  private scanningStatusCallSkipStateSubscription: Subscription;
  private scanningStatusCallSkipState: Observable<any>;
  private articleServiceSubscription: Subscription;
  private orderFailedRequestDataState: Observable<any>;
  private orderFailedRequestDataStateSubcription: Subscription;
  private cachedFailedDataState: Observable<any>;
  private cachedFailedDataStateSubcription: Subscription;
  private addArticleDispatcherSubscription: Subscription;
  private editOrderDataState: Observable<any>;
  private editOrderDataStateSubcription: Subscription;

  private showQuantityError = false;
  private isAdding = false;
  private selectItem: any;
  private total: number = 0;
  public formGroup: FormGroup;
  public showArticleNrError = false;
  public showArticleGridError = false;
  public selectedArticleItemQuantity?: number = 1;
  public dataResult1: any;
  private dataResult2: any;
  public showDialog = false;
  public isContinueClicked = false;
  public isFullFill = false;
  public globalNumberFormat: string = null;
  public globalPropertiesLocal: any[] = [];
  @ViewChild('wijQuantNum') wijQuantNum: ElementRef;
  @ViewChild('articleOrderGrid') articleOrderGrid: XnAgGridComponent;
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
    private dataEntryProcess: DataEntryProcess,
    private dispatcher: ReducerManagerDispatcher
  ) {
    super(router, {
      defaultTranslateText: 'articleGridData',
      emptyData: new OrderDataEntryArticleGridModel(),
    });
    this.articleGridDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).articleGridData
    );
    this.orderDataMediaCode = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID)
          .orderDataWidgetMediaCode
    );
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
    this.editOrderDataState = this.store.select(
      (state) =>
        dataEntryReducer.getDataEntryState(state, this.tabID).editOrderData
    );
  }

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.createEmptyDataForGrid();
    this.subscription();
    this.initEmptyData();
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    Uti.unsubscribe(this);

    this.dataResult1 = null;
    this.dataResult2 = null;
    this.formGroup = null;
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {
    this.registerEnter();
  }

  private initEmptyData() {
    this.formGroup = this.formBuilder.group({
      isGift: true,
      articleNr: [null, CustomValidators.required],
      quantity: [null, Validators.required],
      allArticle: null,
      gift: 1,
    });
    this.formGroup['submitted'] = false;
  }

  private createEmptyDataForGrid() {
    this.dataResult1 = {
      data: [],
      columns: this.createColumnHeader_1(),
    };
    this.setValidationForForm();
  }
  private subscription() {
    this.articleGridDataStateSubscription = this.articleGridDataState.subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (!response || isEmpty(response)) {
            this.createEmptyDataForGrid();
            this.resetFormData();
            this.store.dispatch(
              this.dataEntryActions.dataEntrySetArticleGridExportData(
                null,
                this.tabID
              )
            );
            this.showArticleGridError = false;
            return;
          }
          //clear emtpy grid
          this.dataResult1.data = [];

          //set data for Articles used in this campaign
          response = this.datatableService.formatDataTableFromRawData(
            response.data
          );
          this.dataResult2 = this.datatableService.buildDataSource(response);
          if (
            this.dataResult2 &&
            this.dataResult2.data &&
            this.dataResult2.data.length == 1
          ) {
            // auto add first row with quantity is 1
            this.isAdding = true;
            this.addArticleToGrid(this.dataResult2.data[0], 1, true, true);
          }
        });
      }
    );
    this.orderDataMediaCodeSubscription = this.orderDataMediaCode.subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (!response) return;

          ArticleGridComponent.orderDataMediaCodeNr = response;
        });
      }
    );
    this.selectedSimpleTabChangedStateSubscription =
      this.selectedSimpleTabChangedState.subscribe((selectedSimpleTab: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!selectedSimpleTab) return;

          setTimeout(() => {
            this.dataResult1 = cloneDeep(this.dataResult1);
            this.calcualteArticleTotal();
            this.setValidationForForm();
          });
        });
      });
    this.subscribeSkipState();

    this.addArticleDispatcherSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            DataEntryActions.DATA_ENTRY_ADD_ARTICLE_DATA_FROM_ARTICLE_CAMPAIGN_GRID &&
          action.area == this.tabID
        );
      })
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          if (data && data.payload) {
            this.addArticleToGrid(
              data.payload.articleData,
              data.payload.quantity
            );
          }
        });
      });

    this.subscribeOrderFailed();
    this.subscribeEditOrder();
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

  public addArticle() {
    if (this.isAdding) return;
    this.isAdding = true;
    this.formGroup.updateValueAndValidity();
    this.formGroup['submitted'] = true;
    if (!this.formGroup.valid) {
      if (!this.formGroup.controls['articleNr'].valid) {
        this.focusControls('articleNr');
      } else if (!this.formGroup.controls['quantity'].valid) {
        this.focusControls('quantity');
      }
      this.isAdding = false;
      return;
    }
    if (!this.formGroup.value.quantity) {
      this.showQuantityError = true;
      this.focusControls('quantity');
      this.isAdding = false;
      return;
    }
    const article = this.findArticleNumberExistInBottomGrid();
    if (article && article.ArticleNr) {
      this.addArticleToGrid(article);
    } else {
      if (!this.formGroup.value.allArticle) {
        this.showArticleNrError = true;
        this.focusControls('articleNr');
        this.isAdding = false;
        return;
      }
      this.findArticleAndAddToGrid();
    }
  }
  public addArticleToGrid(
    articleData: any,
    quantity?: number,
    doNotShowMessage?: boolean,
    autoAdd?: boolean
  ) {
    let gridData: Array<any> = cloneDeep(this.dataResult1.data);
    const item = gridData.find((p) => p.ArticleNr == articleData.ArticleNr);
    if (item) {
      // If not be deleted, display confirm message
      if (!item.deleted) {
        if (!doNotShowMessage) {
          this.modalService.warningMessage([
            {
              key: 'Modal_Message__This_Item_Has_Already_Added_Select_Another_One',
            },
          ]);
        }
        this.isAdding = false;
        return;
      } else {
        gridData = gridData.filter((p) => p.ArticleNr != articleData.ArticleNr);
      }
    }
    const salePrice = Uti.hasNotValue(articleData.SalesPrice)
      ? 0
      : articleData.SalesPrice;
    const dataRow = {
      IdArticle: articleData.IdArticle,
      ArticleNr: articleData.ArticleNr,
      ArticleNameShort: articleData.ArticleNameShort,
      Quantity: Uti.hasNotValue(quantity)
        ? this.formGroup.value.quantity || 0
        : quantity,
      SalesPrice: salePrice,
      SalesPriceOrigin: salePrice,
      TotalPrice: (
        salePrice *
        (Uti.hasNotValue(quantity)
          ? this.formGroup.value.quantity || 0
          : quantity)
      ).toFixed(2),
      IsAllArticle: !articleData.IsAllArticle
        ? false
        : articleData.IsAllArticle,
    };
    gridData.push(dataRow);
    this.dataResult1 = {
      data: gridData,
      columns: this.dataResult1.columns,
    };
    this.setValidationForForm();
    this.outputData.emit(
      new FormOutputModel({
        isDirty: autoAdd ? false : true,
        isValid: true,
        formValue: {},
      })
    );
    this.calcualteArticleTotal();
    // Fix bug: Append Row Id to delete row
    this.datatableService.appendRowId(this.dataResult1);
    this.store.dispatch(
      this.dataEntryActions.dataEntrySetArticleGridExportData(
        this.buildOutputModel(this.dataResult1.data),
        this.tabID
      )
    );
    this.resetFormData(autoAdd ? false : true); //if autoAdd --> don't focus to ArticleNr
    setTimeout(() => {
      this.isAdding = false;
    }, 200);
  }
  private setValidationForForm() {
    if (!this.formGroup || !this.formGroup.controls) return;
    this.formGroup.controls['articleNr'].clearValidators();
    this.formGroup.controls['articleNr'].setErrors(null);
    this.formGroup.controls['quantity'].clearValidators();
    this.formGroup.controls['quantity'].setErrors(null);
    if (!this.checkResult1HasData()) {
      this.formGroup.controls['articleNr'].setValidators(Validators.required);
      this.formGroup.controls['articleNr'].setErrors({
        required: true,
      });
      this.formGroup.controls['quantity'].setValidators(Validators.required);
      this.formGroup.controls['quantity'].setErrors({
        required: true,
      });
    }
    this.formGroup.updateValueAndValidity();
  }
  private checkResult1HasData(): boolean {
    if (
      !this.dataResult1 ||
      !this.dataResult1.data ||
      !this.dataResult1.data.length
    )
      return false;
    const deleteItems = this.dataResult1.data.filter((x) => x.deleted);
    return deleteItems.length < this.dataResult1.data.length;
  }
  private calcualteArticleTotal(): void {
    if (!this.dataResult1 || !this.dataResult1.data) return;

    this.total = 0;
    for (let i = 0; i < this.dataResult1.data.length; i++) {
      var item = this.dataResult1.data[i];
      if (!item.deleted) {
        this.total += parseFloat(item.TotalPrice);
      }
    }

    //Is valid number
    if (isFinite(this.total)) {
      this.store.dispatch(
        this.dataEntryActions.dataEntrySetArticleTotal(this.total, this.tabID)
      );
    }
  }
  private buildOutputModel(data) {
    let model = new FormModel({
      formValue: data,
      mappedData: this.mapDataForSaving(data),
      isValid: false,
      giftInfo: {
        isGift: this.formGroup ? this.formGroup.controls['isGift'].value : null,
        giftType: this.formGroup ? this.formGroup.controls['gift'].value : null,
      },
    });

    if (model.mappedData && model.mappedData.length) {
      model.isValid = true;
    }

    this.showArticleGridError = !model.isValid;

    return model;
  }
  private mapDataForSaving(data) {
    if (data && data.length) {
      let results = [];
      data.forEach((item) => {
        if (!item.deleted) {
          results.push({
            IdSalesOrderArticles: null,
            IdSalesOrder: null,
            IdArticle: item.IdArticle,
            ArticleNr: item.ArticleNr,
            Quantity: item.Quantity,
            IsDeleted: null,
            SellingPrice: item.SalesPrice,
            SalesAmount: item.TotalPrice,
            IsAllArticle: item.IsAllArticle,
          });
        }
      });
      return results;
    }
    return null;
  }
  private resetFormData(focusArticleNr?: boolean) {
    setTimeout(() => {
      if (!this.formGroup || !this.formGroup.value) return;

      const currentAllArticle = this.formGroup.value.allArticle;
      Uti.resetValueForForm(this.formGroup);
      this.formGroup.controls['isGift'].setValue(true);
      this.formGroup.controls['gift'].setValue(1);
      this.formGroup.controls['allArticle'].setValue(currentAllArticle);
      this.formGroup.controls['quantity'].setValue('');
      if (focusArticleNr) this.focusControls('articleNr');
    }, 200);
  }
  private findArticleNumberExistInBottomGrid() {
    if (
      !this.dataResult2 ||
      !this.dataResult2.data ||
      !this.dataResult2.data.length
    )
      return null;
    const resutl = this.dataResult2.data.find(
      (x) => x.ArticleNr === this.formGroup.value.articleNr
    );
    return resutl;
  }
  private findArticleAndAddToGrid() {
    this.articleServiceSubscription = this.articleService
      .searchArticleByNr(
        ArticleGridComponent.orderDataMediaCodeNr,
        this.formGroup.value.articleNr
      )
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !response ||
            !response.item.data ||
            !response.item.data.length ||
            !response.item.data[1] ||
            !response.item.data[1].length
          ) {
            this.showArticleNrError = true;
            this.focusControls('articleNr');
            this.isAdding = false;
            return;
          }
          let articleData = response.item.data[1][0];
          articleData['IsAllArticle'] = true;
          this.addArticleToGrid(articleData);
        });
      });
  }
  public articleNrChange($event: any) {
    this.showQuantityError = false;
    this.showArticleNrError = false;
    this.setFullFill();
  }
  public quantityChange($event: any) {
    if ($event) {
      this.showQuantityError = false;
    }
    this.setFullFill();
  }
  private setFullFill() {
    setTimeout(() => {
      if (!this.formGroup || !this.formGroup.value) {
        this.isFullFill = false;
        return;
      }
      this.formGroup.updateValueAndValidity();
      const value = this.formGroup.value;
      this.isFullFill = !!(value.articleNr && value.quantity);
    }, 200);
  }
  private createColumnHeader_1() {
    return [
      {
        title: 'articleId.',
        data: 'IdArticle',
        setting: {
          Setting: [
            {
              DisplayField: {
                Hidden: '1',
              },
            },
          ],
        },
        visible: false,
      },
      {
        title: 'Article Nr.',
        data: 'ArticleNr',
        setting: {
          Setting: [
            {
              DisplayField: {
                Readonly: '1',
                Width: 140,
              },
            },
          ],
        },
      },
      {
        title: 'Description',
        data: 'ArticleNameShort',
        setting: {
          Setting: [
            {
              DisplayField: {
                Readonly: '1',
              },
            },
          ],
        },
      },
      {
        title: 'Q.ty',
        data: 'Quantity',
        min: 1,
        format: 'n0',
        setting: {
          Setting: [
            {
              ControlType: {
                Type: 'Numeric',
              },
              DisplayField: {
                Width: 62,
                //AllowResizing: false,
                DisableFilter: true,
                Align: 'left',
                ValueAlign: 'right',
              },
            },
          ],
        },
      },
      {
        title: 'Price',
        data: 'SalesPrice',
        setting: {
          Setting: [
            {
              ControlType: {
                Type: 'Numeric',
              },
              DisplayField: {
                Width: 100,
                //AllowResizing: false,
                DisableFilter: true,
                Align: 'left',
                ValueAlign: 'right',
              },
            },
          ],
        },
      },
      {
        title: 'PriceOrigin',
        data: 'SalesPriceOrigin',
        setting: {
          Setting: [
            {
              DisplayField: {
                Hidden: '1',
              },
            },
          ],
        },
      },
      {
        title: 'Total Price',
        data: 'TotalPrice',
        setting: {
          Setting: [
            {
              ControlType: {
                Type: 'Numeric',
              },
              DisplayField: {
                Width: 130,
                //AllowResizing: false,
                DisableFilter: true,
                Align: 'left',
                ValueAlign: 'right',
              },
            },
          ],
        },
      },
    ];
  }
  private focusControls(controlId: string) {
    setTimeout(() => {
      $('#' + controlId).focus();
    }, 100);
  }
  private registerEnter() {
    $('[name="articleNr"]').keydown(($event) => {
      if (!($event.which === 13 || $event.keyCode === 13)) {
        return;
      }
      setTimeout(() => {
        $($event.target).closest('form').find('[name="quantity"]').focus();
      }, 100);
    });
    $('[name="quantity"]').keydown(($event) => {
      if (!($event.which === 13 || $event.keyCode === 13)) {
        return;
      }
      setTimeout(() => {
        if (this.formGroup.valid) {
          this.addArticle();
        } else {
          $($event.target).closest('form').find('[name="addArticle"]').focus();
        }
      }, 100);
    });
  }
  public cancelSetQuantity() {
    this.showDialog = false;
    this.selectedArticleItemQuantity = 1;
    this.isContinueClicked = false;
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
  public deleteDataEntryArticle($event: any) {
    const remainItems =
      this.articleOrderGrid.gridOptions.rowData.filter((x) => !x.IsDeleted) ||
      [];
    this.dataResult1 = {
      data: remainItems,
      columns: this.dataResult1.columns,
    };
    this.articleOrderGrid.refresh();

    setTimeout(() => {
      this.store.dispatch(
        this.dataEntryActions.dataEntrySetArticleGridExportData(
          this.buildOutputModel(this.dataResult1.data),
          this.tabID
        )
      );
      this.calcualteArticleTotal();
    }, 100);
  }
  onRowMarkedAsDeletedTable1($event) {}
  public hasValidationErrorHandler($event) {
    this.setValidationForForm();
  }
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
    if (!this.selectItem) return;

    this.addArticleToGrid(this.selectItem, this.selectedArticleItemQuantity);
  }
  public changeGiftStatus() {
    const isGift = this.formGroup.value.isGift;
    this.formGroup.controls['isGift'].setValue(!isGift);
  }
  public giftTypeChanged() {
    this.store.dispatch(
      this.dataEntryActions.dataEntrySetArticleGridExportData(
        this.buildOutputModel(this.dataResult1.data),
        this.tabID
      )
    );
  }
  public rebuildTranslateText() {
    this.rebuildTranslateTextSelf();
    Uti.rebuildColumnHeaderForGrid(this.dataResult1, this.transferTranslate);
  }
  public onArticleOrderGridCellEditEndedHandler(e) {
    if (!e) {
      return;
    }
    let colName = e.col.colId,
      willCalculateTotal = false;
    switch (colName) {
      case 'TotalPrice':
        if (isNil(e.data[colName])) {
          e.data.SalesPrice = e.data.SalesPriceOrigin;
          willCalculateTotal = true;
        } else {
          e.data.SalesPrice = null;
        }
        break;
      case 'Quantity':
        if (isNil(e.data[colName])) {
          e.data[colName] = 1;
        }
        if (!isNil(e.data['SalesPrice'])) {
          willCalculateTotal = true;
        }
        break;
      case 'SalesPrice':
        if (!isNil(e.data[colName]) && !isNil(e.data['Quantity'])) {
          willCalculateTotal = true;
        }
        break;
    }
    if (willCalculateTotal) {
      e.data.TotalPrice = Uti.parFloatFromObject(
        (e.data.SalesPrice * e.data.Quantity).toFixed(2),
        0
      );
    }

    this.articleOrderGrid.updateRowData([e.data]);
    this.store.dispatch(
      this.dataEntryActions.dataEntrySetArticleGridExportData(
        this.buildOutputModel(this.dataResult1.data),
        this.tabID
      )
    );
    this.calcualteArticleTotal();

    this.outputData.emit(
      new FormOutputModel({
        isDirty: true,
        isValid: true,
        formValue: {},
      })
    );
  }

  public updateAllArticleStatus(status) {
    this.formGroup.controls['allArticle'].setValue(!status);
    this.formGroup.updateValueAndValidity();
    this._changeDetectorRef.detectChanges();
  }

  public updateGiftStatus(status) {
    this.formGroup.controls['gift'].setValue(status);
    this.formGroup.updateValueAndValidity();
    this._changeDetectorRef.detectChanges();
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
                    articleGridExportData: this.dataResult1,
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
          if (!response || !response.articleGridExportData) return;

          this.setGridData(response);
        });
      });
  }

  private subscribeEditOrder() {
    this.editOrderDataStateSubcription = this.editOrderDataState.subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (
            !response ||
            !response.articleData ||
            !this.dataResult1 ||
            !this.dataResult1.data
          )
            return;

          this.waitToSetData(response);
        });
      }
    );
  }

  private waitToSetData(data: any, count?: number) {
    count = count || 1;
    if (count > 30) return;

    //if component still haven't loaded, wait 1s
    if (this.isAdding || !this.formGroup) {
      //console.log('article-grid.component: wait 0.25s for auto add first row finished');
      setTimeout(() => {
        this.waitToSetData(data, count++);
      }, 250);
    } else {
      this.setGridData(data);
    }
  }

  private setGridData(response) {
    if (response.articleGridExportData)
      this.dataResult1 = response.articleGridExportData;
    else if (response.articleData) {
      this.dataResult1 = {
        data: response.articleData,
        columns: this.dataResult1.columns,
      };
    }

    this.store.dispatch(
      this.dataEntryActions.dataEntrySetArticleGridExportData(
        this.buildOutputModel(this.dataResult1.data),
        this.tabID
      )
    );
    this.calcualteArticleTotal();

    if (this.formGroup) {
      this.formGroup.markAsPristine();
      this.formGroup.markAsUntouched();
    }

    this.outputData.emit(
      new FormOutputModel({
        isDirty: false,
        isValid: true,
        formValue: {},
      })
    );
  }
}
