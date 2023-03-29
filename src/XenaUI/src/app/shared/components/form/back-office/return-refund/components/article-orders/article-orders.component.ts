import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ArticleOrder,
  Module,
  ReturnRefundInvoiceNumberModel,
} from 'app/models';
import toNumber from 'lodash-es/toNumber';
import toSafeInteger from 'lodash-es/toSafeInteger';
import { Subscription } from 'rxjs/Subscription';
import {
  ReturnRefundActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { AppErrorHandler, WidgetFieldService } from 'app/services';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { ArticlesInvoiceQuantity } from 'app/app.constants';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { WidgetModuleInfoTranslationComponent } from 'app/shared/components/widget/components/widget-module-info-translation';

@Component({
  selector: 'article-orders',
  templateUrl: './article-orders.component.html',
  styleUrls: ['./article-orders.component.scss'],
})
export class ArticleOrdersComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public gridId = '92e1c965-10a3-466d-b254-a86db6ea1220';
  public _isHasError = false;
  public isRenderWidgetInfoTranslation: boolean;
  public combinationTranslateMode: any;

  static ARTICLE_NR_COLUMN_NAME = 'ArticleNr';
  static QUANTITY_COLUMN_NAME = 'Quantity';
  static DESCRIPTION_COLUMN_NAME = 'ArticleNameShort';
  static UNIT_PRICE_COLUMN_NAME = 'UnitPrice';
  static TOTAL_PRICE_COLUMN_NAME = 'TotalPrice';
  static KEEP_COLUMN_NAME = 'QtyKeep';
  static BACK_COLUMN_NAME = 'QtyBackToWarehouse';
  static DEFECT_COLUMN_NAME = 'QtyDefect';
  static ID_ARTICLE_COLUMN_NAME = 'IdArticle';
  static IS_ACTIVE = 'IsActive';
  static ID_SALE_ORDER_COLUMN_NAME = 'IdSalesOrder';
  static ID_SALE_ORDER_ARTICLE_COLUMN_NAME = 'IdSalesOrderArticles';
  public invoiceNumberData = new ReturnRefundInvoiceNumberModel();
  public isEnableConfirmBtn: any;

  dataSource: any;

  @Input() set data(datatable: any) {
    if (datatable) {
      this.dataSource = datatable;
      setTimeout(() => {
        this.checkIsActiveArticle();
      }, 200);
    }
  }

  @Input() parentInstance: any = null;
  @Input() gridStyle: any;
  @Input() showTotalRow: any;
  @Input() pivoting: boolean;
  @Input() enterMovesDown: boolean;
  @Input() rowBackground: boolean;
  @Input() allowTranslation: boolean;
  @Input() borderRow: boolean;
  @Input() rowGrouping: boolean;
  @Input() background: string;
  @Input() backgroundImage: string;
  @Input() rowBackgroundGlobal: any;
  @Input() columnsLayoutSettings: any;
  @Input() columnFilter: boolean;
  @Input() isShowToolPanels: boolean;
  @Input() allowSetColumnState = true;
  @Input() fitWidthColumn: boolean;
  @Input() widgetProperties: any[] = [];
  @Input() globalProperties: any[] = [];
  @Input() currentModule: Module;
  @Input() set isHasError(value: boolean) {
    if (value && typeof value === 'string') {
      this._isHasError = false;
    }
  }

  @Output() outputData: EventEmitter<any> = new EventEmitter();
  @Output() onHasError: EventEmitter<any> = new EventEmitter();
  @Output() changeColumnLayout = new EventEmitter<any>();
  @Output() onRowGroupPanel = new EventEmitter<any>();

  private resetAllSubscription: Subscription;
  @ViewChild('agGrid') public agGridView: XnAgGridComponent;
  @ViewChild('widgetInfoTranslation')
  widgetModuleInfoTranslationComponent: WidgetModuleInfoTranslationComponent;

  constructor(
    private _eref: ElementRef,
    private store: Store<AppState>,
    private cf: ChangeDetectorRef,
    private appErrorHandler: AppErrorHandler,
    private returnRefundActions: ReturnRefundActions,
    private dispatcher: ReducerManagerDispatcher,
    private _widgetFieldService: WidgetFieldService,
    protected router: Router
  ) {
    super(router);
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.subscribeResetAllState();
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.store.dispatch(
      this.returnRefundActions.clearKeepArticleOrders(this.ofModule)
    );
    this.store.dispatch(
      this.returnRefundActions.clearAllEditArticleOrders(this.ofModule)
    );
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {}

  handleValidationGrid(event) {}

  public reattach() {
    this.cf.reattach();
  }

  public openTranslateDialog(event) {
    let translateInDialog = true;
    if (event && event.mode == 'row') {
      translateInDialog = false;
    }
    if (translateInDialog) {
      this.isRenderWidgetInfoTranslation = true;
      this.dataSource.fieldsTranslating = false;
      this.combinationTranslateMode = event ? event.mode : null;
      setTimeout(() => {
        if (this.widgetModuleInfoTranslationComponent)
          this.widgetModuleInfoTranslationComponent.showDialog = true;
        this.cf.detectChanges();
      }, 250);
    }
  }

  onHiddenWidgetInfoTranslation(event?: any) {
    this.isRenderWidgetInfoTranslation = false;
    this.agGridView.refresh();
  }

  private checkIsActiveArticle() {
    const isActiveArticle = this.dataSource.data.filter((x) => x.IsActive == 1);
    let checkSum = true;
    this.invoiceNumberData.hasArticleInvoiceError = this._isHasError;
    for (const v of isActiveArticle) {
      const sum =
        toNumber(v[ArticlesInvoiceQuantity.QtyKeep]) +
        toNumber(v[ArticlesInvoiceQuantity.QtyBackToWareHouse]) +
        toNumber(v[ArticlesInvoiceQuantity.QtyDefect]);
      checkSum = sum === v[ArticleOrdersComponent.QUANTITY_COLUMN_NAME];
      if (!checkSum) {
        this.isEnableConfirmBtn = isActiveArticle.length > 0 && checkSum;
        if (this.invoiceNumberData) {
          this.invoiceNumberData.enableConfirmButton = this.isEnableConfirmBtn;
          this.store.dispatch(
            this.returnRefundActions.setKeepArticleOrdersValid(
              false,
              this.ofModule
            )
          );
          setTimeout(() => {
            this.store.dispatch(
              this.returnRefundActions.updateInvoiceNumberData(
                this.invoiceNumberData,
                this.ofModule
              )
            );
          });
        }
        return;
      }
    }
    this.isEnableConfirmBtn = isActiveArticle.length > 0 && checkSum;
    if (this.invoiceNumberData) {
      this.invoiceNumberData.enableConfirmButton = this.isEnableConfirmBtn;
      this.store.dispatch(
        this.returnRefundActions.setKeepArticleOrdersValid(
          this.isEnableConfirmBtn,
          this.ofModule
        )
      );
      setTimeout(() => {
        this.store.dispatch(
          this.returnRefundActions.updateInvoiceNumberData(
            this.invoiceNumberData,
            this.ofModule
          )
        );
      });
    }
  }

  public onCellValueChanged(rowData: any) {
    setTimeout(() => {
      this.checkIsActiveArticle();
    }, 200);
    if (rowData) {
      this.rowValidation(rowData);
    }
    this.onDisabledForRow(rowData);
    this.dispatchKeepOrders();
    this.dispatchAllEditOrders();
  }

  private onDisabledForRow(rowData) {
    if (!this.dataSource || !this.dataSource.data.length) return;
    const dataHasChildren = this.dataSource.data.filter(
      (x) => x.children.length > 0
    );
    if (dataHasChildren.length) {
      this.findAllParentDisabled(dataHasChildren, rowData);
    }
    this.agGridView.refresh();
    this._widgetFieldService.onChangeQuantityActicleInvoice(rowData);
  }

  private findAllParentDisabled(dataHasChildren, rowData) {
    for (const v of dataHasChildren) {
      if (
        v[ArticlesInvoiceQuantity.QtyKeep] ||
        v[ArticlesInvoiceQuantity.QtyBackToWareHouse] ||
        v[ArticlesInvoiceQuantity.QtyDefect]
      ) {
        this.disabledAllChildren(rowData);
      }
      if (
        !v[ArticlesInvoiceQuantity.QtyKeep] &&
        !v[ArticlesInvoiceQuantity.QtyBackToWareHouse] &&
        !v[ArticlesInvoiceQuantity.QtyDefect] &&
        v.children &&
        v.children.length > 0
      ) {
        this.findAllChildrenDisabled(v.children, rowData);
        this.enabledAllChildren(rowData);
      }
    }
  }

  private findAllChildrenDisabled(dataHasChildren, rowData) {
    for (const v of dataHasChildren) {
      if (
        v[ArticlesInvoiceQuantity.QtyKeep] ||
        v[ArticlesInvoiceQuantity.QtyBackToWareHouse] ||
        v[ArticlesInvoiceQuantity.QtyDefect]
      ) {
        this.disabledParent(rowData);
      }

      if (
        !v[ArticlesInvoiceQuantity.QtyKeep] ||
        !v[ArticlesInvoiceQuantity.QtyBackToWareHouse] ||
        !v[ArticlesInvoiceQuantity.QtyDefect]
      ) {
        this.enabledParent(rowData);
      }
    }
  }

  private getChildListByParentId(parentId: any): any[] {
    const childList = [];
    let tempData = this.dataSource.data.filter(
      (x) => x['ParentIdSalesOrderArticles'] === parentId
    );
    while (!!tempData && tempData.length > 0) {
      tempData.forEach((element) => {
        const id = element['IdSalesOrderArticles'];
        if (!childList.includes(id)) {
          childList.push(id);
        }
      });
      tempData = this.dataSource.data.filter(
        (x) =>
          childList.includes(x['ParentIdSalesOrderArticles']) &&
          !childList.includes(x['IdSalesOrderArticles'])
      );
    }
    return childList;
  }
  private disabledAllChildren(rowData: any) {
    let parentId = rowData['IdSalesOrderArticles'];
    const childList = this.getChildListByParentId(parentId);

    for (const item of this.dataSource.data) {
      if (!childList.includes(item['IdSalesOrderArticles'])) continue;
      item['IsActive'] = 0;
    }
  }

  private disabledParent(rowData: any) {
    for (const item of this.dataSource.data) {
      if (item['IdSalesOrderArticles'] != rowData['ParentIdSalesOrderArticles'])
        continue;
      item['IsActive'] = 0;
      break;
    }
  }

  private enabledAllChildren(rowData: any) {
    let parentId = rowData['IdSalesOrderArticles'];
    const childList = this.getChildListByParentId(parentId);

    for (const item of this.dataSource.data) {
      if (!childList.includes(item['IdSalesOrderArticles'])) continue;
      if (
        !rowData[ArticlesInvoiceQuantity.QtyKeep] &&
        !rowData[ArticlesInvoiceQuantity.QtyBackToWareHouse] &&
        !rowData[ArticlesInvoiceQuantity.QtyDefect]
      )
        item['IsActive'] = 1;
    }
  }

  private enabledParent(rowData: any) {
    for (const item of this.dataSource.data) {
      if (item['IdSalesOrderArticles'] != rowData['ParentIdSalesOrderArticles'])
        continue;
      if (
        !rowData[ArticlesInvoiceQuantity.QtyKeep] &&
        !rowData[ArticlesInvoiceQuantity.QtyBackToWareHouse] &&
        !rowData[ArticlesInvoiceQuantity.QtyDefect]
      )
        item['IsActive'] = 1;
      break;
    }
  }

  handleRowGrouping($event) {
    this.onRowGroupPanel.emit($event);
  }

  onChangeColumnLayoutHandler($event) {
    this.changeColumnLayout.emit();
  }

  private mapDataChangeForChildren(dataChildren, keyData) {
    return dataChildren.map((x) => {
      if (keyData === ArticlesInvoiceQuantity.QtyKeep) {
        x[keyData] = x.Quantity;
        x[ArticlesInvoiceQuantity.QtyBackToWareHouse] = null;
        x[ArticlesInvoiceQuantity.QtyDefect] = null;
      }
      if (keyData === ArticlesInvoiceQuantity.QtyBackToWareHouse) {
        x[keyData] = x.Quantity;
        x[ArticlesInvoiceQuantity.QtyKeep] = null;
        x[ArticlesInvoiceQuantity.QtyDefect] = null;
      }
      if (keyData === ArticlesInvoiceQuantity.QtyDefect) {
        x[keyData] = x.Quantity;
        x[ArticlesInvoiceQuantity.QtyKeep] = null;
        x[ArticlesInvoiceQuantity.QtyBackToWareHouse] = null;
      }
    });
  }

  private lookingForChildren(rowData: any, keyData) {
    for (const item of this.dataSource.data) {
      if (item['ParentIdSalesOrderArticles'] != rowData['IdSalesOrderArticles'])
        continue;
      if (keyData === ArticlesInvoiceQuantity.QtyKeep) {
        item[keyData] = item.Quantity;
        item[ArticlesInvoiceQuantity.QtyBackToWareHouse] = null;
        item[ArticlesInvoiceQuantity.QtyDefect] = null;
      }
      if (keyData === ArticlesInvoiceQuantity.QtyBackToWareHouse) {
        item[keyData] = item.Quantity;
        item[ArticlesInvoiceQuantity.QtyKeep] = null;
        item[ArticlesInvoiceQuantity.QtyDefect] = null;
      }
      if (keyData === ArticlesInvoiceQuantity.QtyDefect) {
        item[keyData] = item.Quantity;
        item[ArticlesInvoiceQuantity.QtyKeep] = null;
        item[ArticlesInvoiceQuantity.QtyBackToWareHouse] = null;
      }
    }
  }

  private lookingForParent(rowData: any, keyData) {
    for (const item of this.dataSource.data) {
      if (item['IdSalesOrderArticles'] != rowData['ParentIdSalesOrderArticles'])
        continue;
      if (keyData === ArticlesInvoiceQuantity.QtyKeep) {
        item[keyData] = item.Quantity;
        item[ArticlesInvoiceQuantity.QtyBackToWareHouse] = null;
        item[ArticlesInvoiceQuantity.QtyDefect] = null;
        this.lookingForChildren(item, keyData);
      }
      if (keyData === ArticlesInvoiceQuantity.QtyBackToWareHouse) {
        item[keyData] = item.Quantity;
        item[ArticlesInvoiceQuantity.QtyKeep] = null;
        item[ArticlesInvoiceQuantity.QtyDefect] = null;
        this.lookingForChildren(item, keyData);
      }
      if (keyData === ArticlesInvoiceQuantity.QtyDefect) {
        item[keyData] = item.Quantity;
        item[ArticlesInvoiceQuantity.QtyKeep] = null;
        item[ArticlesInvoiceQuantity.QtyBackToWareHouse] = null;
        this.lookingForChildren(item, keyData);
      }
    }
  }

  handleQuantityArticleInvoiceChange($event) {
    if (!$event || !$event.data) return;
    if ($event.column === ArticlesInvoiceQuantity.QtyKeep) {
      $event.data.QtyKeep = $event.data.Quantity;
      $event.data.QtyBackToWarehouse = null;
      $event.data.QtyDefect = null;
      // if ($event.data.children && $event.data.children.length) {
      //     this.mapDataChangeForChildren($event.data.children, $event.column);
      // } else {
      //     this.lookingForParent($event.data, $event.column);
      // }
    }
    if ($event.column === ArticlesInvoiceQuantity.QtyBackToWareHouse) {
      $event.data.QtyBackToWarehouse = $event.data.Quantity;
      $event.data.QtyKeep = null;
      $event.data.QtyDefect = null;
      // if ($event.data.children && $event.data.children.length) {
      //     this.mapDataChangeForChildren($event.data.children, $event.column);
      // } else {
      //     this.lookingForParent($event.data, $event.column);
      //
      // }
    }
    if ($event.column === ArticlesInvoiceQuantity.QtyDefect) {
      $event.data.QtyDefect = $event.data.Quantity;
      $event.data.QtyKeep = null;
      $event.data.QtyBackToWarehouse = null;
      // if ($event.data.children && $event.data.children.length > 0) {
      //     this.mapDataChangeForChildren($event.data.children, $event.column);
      // } else {
      //     this.lookingForParent($event.data, $event.column);
      // }
    }
    this.agGridView.refresh();
    setTimeout(() => {
      this.checkIsActiveArticle();
    }, 200);
    this.onDisabledForRow($event.data);
    this.dispatchKeepOrders();
    this.dispatchAllEditOrders();
  }

  /**
   * subscribeResetAllState
   */
  private subscribeResetAllState() {
    this.resetAllSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ReturnRefundActions.RESET_ALL_EDITABLE_FORM &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.reset();
        });
      });
  }

  /**
   * rowValidation
   * @param item
   */
  private rowValidation(item: any) {
    const quantity = +item[ArticleOrdersComponent.QUANTITY_COLUMN_NAME];
    const keepQuantity = item[ArticleOrdersComponent.KEEP_COLUMN_NAME];
    const backQuantity = item[ArticleOrdersComponent.BACK_COLUMN_NAME];
    const defectQuantity = item[ArticleOrdersComponent.DEFECT_COLUMN_NAME];
    const inputQuantity =
      toNumber(keepQuantity) +
      toNumber(backQuantity) +
      toNumber(defectQuantity);
    if (inputQuantity > quantity || inputQuantity < quantity) {
      this._isHasError = true;
    }
  }

  /**
   * resetTreeData
   * @param data
   */
  private resetTreeData(data: Array<any>) {
    data.forEach((item) => {
      item[ArticleOrdersComponent.KEEP_COLUMN_NAME] = '';
      item[ArticleOrdersComponent.BACK_COLUMN_NAME] = '';
      item[ArticleOrdersComponent.DEFECT_COLUMN_NAME] = '';
      if (item.childs && item.childs.length) {
        this.resetTreeData(item.childs);
      }
    });
  }

  /**
   * reset
   */
  reset() {
    if (
      this.dataSource &&
      this.dataSource.data &&
      this.dataSource.data.length
    ) {
      this.resetTreeData(this.dataSource.data);
    }
    this.dispatchKeepOrders();
    this.dataSource.data = [];
    this.store.dispatch(
      this.returnRefundActions.setKeepArticleOrdersValid(true, this.ofModule)
    );
  }

  /**
   * getKeepOrders
   * Only get keep orders
   * @param dataSource
   * @param results
   */
  private getKeepOrders(dataSource: Array<any>, results: Array<any>) {
    for (let i = 0; i < dataSource.length; i++) {
      /**
       * legacy
       */
      // if (dataSource[i] && !dataSource[i][ArticleOrdersComponent.IS_ACTIVE]) {
      //     results.push(dataSource[i]);
      // }

      // if (dataSource[i] && dataSource[i][ArticleOrdersComponent.KEEP_COLUMN_NAME]) {
      //     results.push(dataSource[i]);
      // }

      // if (dataSource[i] && dataSource[i][ArticleOrdersComponent.BACK_COLUMN_NAME]) {
      //     results.push(dataSource[i]);
      // }

      // if (dataSource[i] && dataSource[i][ArticleOrdersComponent.DEFECT_COLUMN_NAME]) {
      //     results.push(dataSource[i]);
      // }

      if (
        dataSource[i] &&
        (!dataSource[i][ArticleOrdersComponent.IS_ACTIVE] ||
          dataSource[i][ArticleOrdersComponent.KEEP_COLUMN_NAME] ||
          dataSource[i][ArticleOrdersComponent.BACK_COLUMN_NAME] ||
          dataSource[i][ArticleOrdersComponent.DEFECT_COLUMN_NAME])
      ) {
        results.push(dataSource[i]);
      }
    }
  }

  /**
   * getAllEditOrders
   * Get all editted orders.
   * @param dataSource
   * @param results
   */
  private getAllEditOrders(dataSource: Array<any>, results: Array<any>) {
    for (let i = 0; i < dataSource.length; i++) {
      // Check if valid editted order
      if (dataSource[i]) {
        let isEditedOrder: boolean;
        do {
          if (dataSource[i][ArticleOrdersComponent.KEEP_COLUMN_NAME]) {
            isEditedOrder = true;
            break;
          }
          if (dataSource[i][ArticleOrdersComponent.BACK_COLUMN_NAME]) {
            isEditedOrder = true;
            break;
          }
          if (dataSource[i][ArticleOrdersComponent.DEFECT_COLUMN_NAME]) {
            isEditedOrder = true;
            break;
          }
          break;
        } while (true);
        if (isEditedOrder) {
          results.push(dataSource[i]);
        }
      }
    }
  }

  /**
   * initArticlOrder
   * @param item
   */
  private initArticlOrder(item) {
    if (item) {
      return new ArticleOrder({
        articleNumber: item[ArticleOrdersComponent.ARTICLE_NR_COLUMN_NAME],
        description: item[ArticleOrdersComponent.DESCRIPTION_COLUMN_NAME],
        quantity: toSafeInteger(
          item[ArticleOrdersComponent.QUANTITY_COLUMN_NAME]
        ),
        price: toSafeInteger(
          item[ArticleOrdersComponent.UNIT_PRICE_COLUMN_NAME]
        ),
        total: toSafeInteger(
          item[ArticleOrdersComponent.TOTAL_PRICE_COLUMN_NAME]
        ),
        keep: item[ArticleOrdersComponent.KEEP_COLUMN_NAME],
        back: item[ArticleOrdersComponent.BACK_COLUMN_NAME],
        defect: item[ArticleOrdersComponent.DEFECT_COLUMN_NAME],
        idArticle: item[ArticleOrdersComponent.ID_ARTICLE_COLUMN_NAME],
        isActive: item[ArticleOrdersComponent.IS_ACTIVE],
        idSalesOrder: item[ArticleOrdersComponent.ID_SALE_ORDER_COLUMN_NAME],
        idSalesOrderArticles:
          item[ArticleOrdersComponent.ID_SALE_ORDER_ARTICLE_COLUMN_NAME],
      });
    }
    return null;
  }

  /**
   * dispatchKeepOrders
   * dispatch keep orders data to store to communicate with other grid.
   */
  private dispatchKeepOrders() {
    if (
      this.dataSource &&
      this.dataSource.data &&
      this.dataSource.data.length
    ) {
      const items: Array<any> = [];
      this.getKeepOrders(this.dataSource.data, items);
      const articleOrders: Array<ArticleOrder> = [];
      if (items.length) {
        items.forEach((item) => {
          articleOrders.push(this.initArticlOrder(item));
        });
      }
      this.store.dispatch(
        this.returnRefundActions.setKeepArticleOrders(
          articleOrders,
          this.ofModule
        )
      );
    }
  }

  /**
   * dispatchAllEditOrders
   * dispatch all editted orders data to store to communicate with other grid.
   */
  private dispatchAllEditOrders() {
    if (
      this.dataSource &&
      this.dataSource.data.length &&
      this.dataSource.data.length
    ) {
      const items: Array<any> = [];
      this.getAllEditOrders(this.dataSource.data, items);
      const articleOrders: Array<ArticleOrder> = [];
      if (items.length) {
        items.forEach((item) => {
          articleOrders.push(this.initArticlOrder(item));
        });
      }
      this.store.dispatch(
        this.returnRefundActions.setAllEditArticleOrders(
          articleOrders,
          this.ofModule
        )
      );
    }
  }
}
