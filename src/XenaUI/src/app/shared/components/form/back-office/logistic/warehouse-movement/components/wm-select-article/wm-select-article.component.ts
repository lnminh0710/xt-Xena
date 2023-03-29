import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  AppErrorHandler,
  SearchService,
  WareHouseMovementService,
  DatatableService,
  ModalService,
} from 'app/services';
import { ControlGridModel, FormOutputModel, MessageModel } from 'app/models';
import isEmpty from 'lodash-es/isEmpty';
import cloneDeep from 'lodash-es/cloneDeep';
import { Uti } from 'app/utilities';
import { WarehuoseMovementEditFormFakeData } from './fake-data';
import { Subscription } from 'rxjs/Subscription';
import { ToasterService } from 'angular2-toaster';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';

@Component({
  selector: 'warehouse-movement-select-article',
  styleUrls: ['./wm-select-article.component.scss'],
  templateUrl: './wm-select-article.component.html',
})
export class WarehouseMovementSelectArticleComponent
  implements OnInit, OnDestroy
{
  // TODO: will remove when has service
  private fake = new WarehuoseMovementEditFormFakeData();

  public isRender = false;
  public leftGrid: ControlGridModel = new ControlGridModel();
  public rightGrid: ControlGridModel = new ControlGridModel();
  public rowLeftGrouping: boolean;
  public rowRightGrouping: boolean;
  // public gridMessage: string = '';

  private currentSelectedArticleData: Array<any>;
  private outputModel: FormOutputModel;
  private selectItem: any;
  private isLeftSelect = false;
  private isRightSelect = false;
  private searchServiceSubscription: Subscription;
  private searchGridCellServiceSubscription: Subscription;
  private editItems: Array<any> = [];
  private cachedRemoveItemsFromRight: Array<any> = [];
  private _validationPropertyName = 'ArticleNr';

  @ViewChild('leftGridComponent')
  private leftGridComponent: XnAgGridComponent;
  @ViewChild('rightGridComponent')
  private rightGridComponent: XnAgGridComponent;

  @Input() set selectedArticleData(data: ControlGridModel) {
    if (!data || !data.columns || !data.columns.length) {
      return;
    }
    this.isRender = true;
    this.rightGrid = data;
    this.currentSelectedArticleData = cloneDeep(data.data);
  }

  @Input() updateFormData: any = {};
  @Input() globalProperties: any;
  @Output() outputData: EventEmitter<any> = new EventEmitter();
  @Output() onHasError: EventEmitter<any> = new EventEmitter();

  constructor(
    private toasterService: ToasterService,
    private ref: ChangeDetectorRef,
    private appErrorHandler: AppErrorHandler,
    private searchService: SearchService,
    private _modalService: ModalService,
    private wareHouseMovementService: WareHouseMovementService,
    private datatableService: DatatableService
  ) {
    this.onSearchComplete = this.onSearchComplete.bind(this);
    this.onSearchCellcChanged = this.onSearchCellcChanged.bind(this);
  }

  public ngOnInit() {
    this.initData();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
    this.datatableService['ArrayDataToValiation'] =
      this.datatableService['ArrayDataToValiation'] || [];
    this.datatableService['ArrayDataToValiation'].length = 0;
  }

  public handleRowLeftGrouping(data) {
    this.rowLeftGrouping = data;
  }

  public handleRowRightGrouping(data) {
    this.rowRightGrouping = data;
  }

  public leftGridRowClick($event: any) {
    this.setItemSelectedWhenClick(this.leftGrid, $event);
    this.setIsSelectGrid(true);
  }

  public rightGridRowClick($event: any) {
    setTimeout(() => {
      this.setItemSelectedWhenClick(this.rightGrid, $event);
      this.setIsSelectGrid(false);
    }, 100);
  }

  public leftGridRowDoubleClick($event: any) {
    if (!$event.IsActive) return;
    this.setIsSelectGrid(true);
    this.setItemSelectedWhenDoubleClick(this.leftGrid, $event);
    this.addArticle();
  }

  public rightGridRowDoubleClick($event: any) {
    // Disable double click behaviour
    // this.setIsSelectGrid(false);
    // this.setItemSelectedWhenDoubleClick(this.rightGrid, $event);
    // this.removeArticle();
  }

  public rightGridRowEditEnded(rowData: any) {
    // waiting edit data is bound to grid data
    setTimeout(() => {
      if (rowData.idWarehouseMovementGoodsIssue > 0) {
        Uti.removeItemInArray(
          this.editItems,
          rowData,
          'idWarehouseMovementGoodsIssue'
        );
        this.editItems.push(rowData);
      }
      this.setOutputData();
      if (this.isLocalDataExisted(rowData)) return;
      this.setAsyncValidationData(rowData);
    }, 100);
  }

  public isValid(): boolean {
    return !this.rightGridComponent.hasError();
  }

  private isLocalDataExisted(rowData: any): boolean {
    const addToArticleNumber = rowData['addToArticleNumber'].replace(
      /([.?\\])/g,
      ''
    );
    if (!addToArticleNumber) return true;
    if (
      !this.datatableService['ArrayDataToValiation'] ||
      !this.datatableService['ArrayDataToValiation'].length
    )
      return false;
    const item = this.datatableService['ArrayDataToValiation'].find(
      (x) => x[this._validationPropertyName] == addToArticleNumber
    );
    return !!(item && item[this._validationPropertyName]);
  }

  private setAsyncValidationData(rowData: any) {
    if (!rowData || !rowData['addToArticleNumber']) {
      return;
    }

    if (!this.updateFormData.toWarehouseId) {
      this.toasterService.pop(
        'warning',
        'Warning',
        'Please select an item in To warehouse to get data!'
      );
      return;
    }

    let addToArticleNumber = rowData['addToArticleNumber'].replace(
      /([.?\\])/g,
      ''
    );
    this.searchGridCellServiceSubscription = this.wareHouseMovementService
      .searchArticles(addToArticleNumber, this.updateFormData.fromWarehouseId)
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (!response || response.length < 2) return;
          this.setDataForDataServiceCampaignDataSource(
            rowData,
            response.data[1]
          );
          this.rightGridComponent.api.refreshView();
        });
      });
  }

  private setDataForDataServiceCampaignDataSource(rowData: any, data: any) {
    if (!data || !data.length) {
      return [];
    }
    for (let item of data) {
      if (
        item[this._validationPropertyName] === rowData['addToArticleNumber']
      ) {
        this.setShadowAddToArticleNumberValue(rowData, item.IdArticle);
      }
      this.pushToWarehouseAddToArticleNumbers(item);
    }
  }

  private pushToWarehouseAddToArticleNumbers(item: any) {
    this.datatableService['ArrayDataToValiation'] =
      this.datatableService['ArrayDataToValiation'] || [];
    if (
      Uti.existItemInArray(
        this.datatableService['ArrayDataToValiation'],
        item,
        'IdArticle'
      )
    )
      return;
    this.datatableService['ArrayDataToValiation'].push({
      ArticleNr: item[this._validationPropertyName],
    });
    // Use this static property for validation in grid this.datatableService['ArrayDataToValiation']
    // The name of property is also dynamic in column setting
    /*
            Validation: {
                'CompareWithArray': '1',
                'arrayName': 'ArrayDataToValiation',
                'propertyName': 'ArticleNr'
            }
        */
    // See this behaviour in ag-grid.service with keyword CompareWithArray
  }

  private setShadowAddToArticleNumberValue(
    rowData: any,
    addToArticleNumberValue: any
  ) {
    rowData['addToArticleNumberValue'] = addToArticleNumberValue;
    for (let item of this.rightGrid.data) {
      if (item['addToArticleNumber'] != rowData['addToArticleNumberValue'])
        continue;
      item['addToArticleNumberValue'] = addToArticleNumberValue;
      break;
    }
  }

  public addArticle() {
    if (
      isEmpty(this.selectItem) ||
      !this.isLeftSelect ||
      !this.selectItem.IsActive
    ) {
      return;
    }
    this.removeItemFromCachedRemoveItemsFromRight();
    this.leftGrid = this.removeItemArticle(this.leftGrid);
    this.rightGrid = this.addItemArticle(this.rightGrid);
    this.resetRowIdForGrid();
    this.resetSelectedItem();
    this.focusOnEditRow(0);
  }

  public addAllArticle() {
    if (!this.leftGrid.data.length) {
      return;
    }
    this.rightGrid = this.addAllItemArticle(this.leftGrid, this.rightGrid);
    this.leftGrid = this.removeAllItemArticle(this.leftGrid);
    this.cachedRemoveItemsFromRight.length = 0;
    this.resetRowIdForGrid();
    this.resetSelectedItem();
    this.focusOnEditRow(0);
  }

  public removeArticle() {
    if (isEmpty(this.selectItem) || !this.isRightSelect) {
      return;
    }
    this.addToCachedRemoveItemsFromRight(this.selectItem);
    this.leftGrid = this.addItemArticle(this.leftGrid);
    this.rightGrid = this.removeItemArticle(this.rightGrid);
    this.resetRowIdForGrid();
    this.resetSelectedItem();
  }

  public removeAllArticle($event: any) {
    if (!this.rightGrid.data.length) {
      return;
    }
    this._modalService.confirmMessageHtmlContent(
      new MessageModel({
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Are_You_Sure_You_Want_To_Remove_All_Article',
          },
          { key: '</p>' },
        ],
        callBack1: () => {
          this.removeAllArticleAfterConfirm();
        },
      })
    );
  }

  public leftGridSearch(keyword) {
    this.leftGridComponent.isSearching = true;
    if (this.updateFormData.fromWarehouseId) {
      this.searchServiceSubscription = this.wareHouseMovementService
        .searchArticles(keyword, this.updateFormData.fromWarehouseId)
        .subscribe(this.onSearchComplete);
    } else {
      this.toasterService.pop(
        'warning',
        'Warning',
        'Please select an item in From warehouse to get data!'
      );
      setTimeout(() => {
        this.leftGridComponent.isSearching = false;
      });
    }
  }

  public onSearchCellcChanged(query: any, max: any, callback: any) {
    if (!query) {
      callback([]);
      return;
    }

    if (!this.updateFormData.toWarehouseId) {
      callback([]);
      this.toasterService.pop(
        'warning',
        'Warning',
        'Please select an item in To warehouse to get data!'
      );
      return;
    }

    // this.rightGridComponent.isAutoCompleteSearching = true;
    query = query.replace(/([.?\\])/g, '');
    this.searchGridCellServiceSubscription = this.wareHouseMovementService
      .searchArticles(query, this.updateFormData.fromWarehouseId)
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          const autoCompleteData = this.buildCampaignDataSource(
            response.data[1]
          );
          if (callback) {
            callback(autoCompleteData);
          }
          // this.rightGridComponent.isAutoCompleteSearching = false;
        });
      });
  }

  public hasValidationError(event: any) {
    this.onHasError.emit(event);
    // this.gridMessage = event ? 'The Article number do not exist' : '';
  }

  public gridStopEditing() {
    this.rightGridComponent.stopEditing();
  }

  /********************************************************************************************/
  /********************************** PRIVATE METHODS ******************************************/

  /********************************************************************************************/

  private initData() {
    // TODO: will get columns data from service
    this.leftGrid = this.fake.createArriveArticleData();
  }

  private buildCampaignDataSource(data: any) {
    if (!data || !data.length) {
      return [];
    }
    // data.unshift({
    //     IdArticle: 0,
    //     ArticleNr: '&nbsp'
    // });
    return data.map((x) => {
      return {
        value: x.IdArticle,
        label: x.ArticleNr,
      };
    });
  }

  private setIsSelectGrid(isLeftSelected: boolean) {
    this.isLeftSelect = isLeftSelected;
    this.isRightSelect = !isLeftSelected;
  }

  private removeItemArticle(
    controlGridModel: ControlGridModel
  ): ControlGridModel {
    Uti.removeItemInArray(
      controlGridModel.data,
      this.selectItem,
      'idWarehouseMovementGoodsIssue'
    );
    return Uti.cloneDataForGridItems(controlGridModel);
  }

  private addAllItemArticle(
    sourceGridModel: ControlGridModel,
    destinationGridModel: ControlGridModel
  ): ControlGridModel {
    destinationGridModel.data = [
      ...cloneDeep(sourceGridModel.data),
      ...destinationGridModel.data,
    ];
    return Uti.cloneDataForGridItems(destinationGridModel);
  }

  private removeAllItemArticle(
    controlGridModel: ControlGridModel
  ): ControlGridModel {
    controlGridModel.data = [];
    return Uti.cloneDataForGridItems(controlGridModel);
  }

  private setItemSelectedWhenClick(
    controlGridModel: ControlGridModel,
    event: any
  ) {
    const item = controlGridModel.data.find(
      (x) =>
        x.idWarehouseMovementGoodsIssue ==
        Uti.getValueFromArrayByKey(event, 'idWarehouseMovementGoodsIssue')
    );
    this.setItemSelected(item);
  }

  private setItemSelectedWhenDoubleClick(
    controlGridModel: ControlGridModel,
    event: any
  ) {
    const item = controlGridModel.data.find(
      (x) =>
        x.idWarehouseMovementGoodsIssue == event.idWarehouseMovementGoodsIssue
    );
    this.setItemSelected(item);
  }

  private setItemSelected(item: any) {
    if (isEmpty(item)) {
      return;
    }
    this.selectItem = Object.assign({}, cloneDeep(item));
  }

  private addItemArticle(controlGridModel: ControlGridModel): ControlGridModel {
    controlGridModel.data.unshift(cloneDeep(this.selectItem));
    return Uti.cloneDataForGridItems(controlGridModel);
  }

  private removeAllArticleAfterConfirm() {
    this.addMultilItemToCache();
    this.leftGrid = this.addAllItemArticle(this.rightGrid, this.leftGrid);
    this.rightGrid = this.removeAllItemArticle(this.rightGrid);
    this.resetRowIdForGrid();
    this.resetSelectedItem();
  }

  private addMultilItemToCache() {
    for (let item of this.rightGrid.data) {
      this.addToCachedRemoveItemsFromRight(item);
    }
  }

  private addToCachedRemoveItemsFromRight(addItem: any) {
    Uti.removeItemInArray(
      this.cachedRemoveItemsFromRight,
      this.selectItem,
      'idWarehouseMovementGoodsIssue'
    );
    this.cachedRemoveItemsFromRight.push(addItem);
  }

  private removeItemFromCachedRemoveItemsFromRight() {
    Uti.removeItemInArray(
      this.cachedRemoveItemsFromRight,
      this.selectItem,
      'idWarehouseMovementGoodsIssue'
    );
  }

  private removeAllItemFromCachedRemoveItemsFromRight() {
    this.cachedRemoveItemsFromRight.length = 0;
  }

  private resetRowIdForGrid() {
    this.selectItem = null;
    this.leftGrid = this.datatableService.appendRowId(this.leftGrid);
    this.rightGrid = this.datatableService.appendRowId(this.rightGrid);
    this.setOutputData();
    this.ref.detectChanges();
  }

  private resetSelectedItem() {
    this.selectItem = {};
    this.setOutputData();
  }

  private setOutputData() {
    setTimeout(() => {
      this.outputModel = new FormOutputModel({
        submitResult: null,
        formValue: this.makeOutputData(),
        isValid: true,
        isDirty: true,
      });
      this.outputData.emit(this.outputModel);
    }, 300);
  }

  private makeOutputData(): any {
    return {
      insertedData: this.makeInsertData(),
      editedData: this.makeEditDate(),
      deletedData: this.makeDeleteData(),
    };
  }

  private makeEditDate() {
    return this.editItems;
  }

  private makeInsertData(): Array<any> {
    const addItem = Uti.getItemsDontExistItems(
      this.rightGrid.data,
      this.currentSelectedArticleData,
      'idWarehouseMovementGoodsIssue'
    );
    if (!addItem || !addItem.length) {
      return [];
    }
    return addItem;
  }

  private makeDeleteData(): Array<any> {
    const deleteData = Uti.getItemsDontExistItems(
      this.currentSelectedArticleData,
      this.rightGrid.data,
      'idWarehouseMovementGoodsIssue'
    );
    if (!deleteData || !deleteData.length) {
      return [];
    }
    return deleteData;
  }

  private onSearchComplete(response: any) {
    const results: Array<any> =
      response.data && response.data.length > 1 ? response.data[1] : [];
    let newData: Array<any> = [];
    for (const res of results) {
      if (
        this.checkExistPrimaryItem(res.IdArticle) ||
        this.checkExistCachedRemoveItemsFromRight(res['idArticle'])
      ) {
        continue;
      }
      if (res['OnStock'] > 0) {
        newData.push({
          idWarehouseMovementGoodsIssue: Uti.getTempId(),
          // addToArticleNumber: {
          //     key: null,
          //     value: null,
          // },
          addToArticleNumber: '',
          addToArticleNumberValue: '',
          articleId: res['IdArticle'],
          articleNumber: res['ArticleNr'],
          articleName: res['ArticleName'],
          onStock: res['OnStock'],
          available: res['Available'],
          IsActive:
            res['OnStock'] &&
            res['Available'] &&
            res['OnStock'] > 0 &&
            res['Available'] > 0,
        });
      }
    }

    newData = [...this.cachedRemoveItemsFromRight, ...newData];
    let leftData = {
      data: newData,
      columns: this.leftGrid.columns,
    };
    leftData = this.datatableService.appendRowId(leftData);
    this.leftGrid = leftData;
    this.leftGridComponent.isSearching = false;
  }

  private checkExistCachedRemoveItemsFromRight(articleId: any): boolean {
    if (!this.cachedRemoveItemsFromRight.length) return false;
    const articleItem = this.cachedRemoveItemsFromRight.find(
      (x) => x.articleId == articleId
    );
    return articleItem && articleItem.articleId;
  }

  private checkExistPrimaryItem(articleId: any): boolean {
    const articleItem = this.rightGridComponent
      .getGridData()
      .find((x) => x.articleId === articleId);
    return articleItem && articleItem.articleId;
  }

  private focusOnEditRow(rowNumber: number) {
    setTimeout(() => {
      this.rightGridComponent.setFocusedCell(
        rowNumber,
        'addToArticleNumber',
        true
      );
    }, 200);
  }
}
