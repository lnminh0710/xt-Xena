import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { StoreStringCall, Configuration } from 'app/app.constants';
import {
  AppErrorHandler,
  SearchService,
  DatatableService,
  WidgetTemplateSettingService,
  ModalService,
} from 'app/services';
import { Uti } from 'app/utilities';
import {
  ControlGridModel,
  WidgetDetail,
  EsSearchResult,
  ApiResultResponse,
} from 'app/models';
import lowerFirst from 'lodash-es/lowerFirst';
import { Subscription } from 'rxjs/Subscription';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { IPageChangedEvent } from 'app/shared/components/xn-pager/xn-pagination.component';

@Component({
  selector: 'app-search-media-code',
  styleUrls: ['./search-media-code.component.scss'],
  templateUrl: './search-media-code.component.html',
})
export class SearchMediaCodeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public searchMediaCodeGridLeft: ControlGridModel;
  public searchMediaCodeGridRight: ControlGridModel;
  public searchMediaCodeGridDetail: ControlGridModel;
  public perfectScrollbarConfig: any;
  public pageSize: number = Configuration.pageSize;

  private widgetTemplateSettingServiceSubscription: Subscription;
  private searchServiceSubscription: Subscription;
  private widgetDetailMediaCodeMain: WidgetDetail = new WidgetDetail();
  private widgetDetailMediaCodeDetail: WidgetDetail = new WidgetDetail();
  private idSalesCampaignWizard: any;
  private idSalesCampaignWizardItems: any;
  private mediacodeOutput: any = {};
  private pageIndex: number = Configuration.pageIndex;
  private keyword: string = '';

  @Input() wjGridSearchMediaCodeLeftId: string;
  @Input() wjGridSearchMediaCodeRightId: string;
  @Input() wijmoGridComponentDetailId: string;
  @Input() data: any;
  @Input() globalProperties: any;
  @Input() searchText: string;

  @Output() outputData: EventEmitter<any> = new EventEmitter();
  @Output() outputDataWithCloseModal: EventEmitter<any> = new EventEmitter();

  @ViewChild('wjGridSearchMediaCodeLeft')
  wjGridSearchMediaCodeLeft: XnAgGridComponent;
  @ViewChild('wjGridSearchMediaCodeRight')
  wjGridSearchMediaCodeRight: XnAgGridComponent;
  @ViewChild('wijmoGridComponentDetail')
  wjGridSearchMediaCodeDetail: XnAgGridComponent;

  constructor(
    private ref: ChangeDetectorRef,
    private appErrorHandler: AppErrorHandler,
    private searchService: SearchService,
    private widgetTemplateSettingService: WidgetTemplateSettingService,
    private modalService: ModalService,
    private datatableService: DatatableService
  ) {
    this.onSearchComplete = this.onSearchComplete.bind(this);
  }

  public ngOnInit() {
    this.initData();
    this.initPerfectScroll();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  public ngAfterViewInit() {
    this.autoSearch();
  }

  private autoSearchTimeout: any = null;
  private autoSearch() {
    if (this.searchText && this.searchText != '*') {
      if (
        this.searchMediaCodeGridLeft &&
        this.searchMediaCodeGridLeft.columns &&
        this.searchMediaCodeGridLeft.columns.length
      ) {
        clearTimeout(this.autoSearchTimeout);
        this.autoSearchTimeout = null;
        this.onLeftTableSearch(this.searchText);
      } else {
        this.autoSearchTimeout = setTimeout(() => {
          this.autoSearch();
        }, 500);
      }
    }
  }

  public searchMediaCodeGridLeftRowClick($event: any) {
    this.mediacodeOutput['campaignNr'] = Uti.getValueFromArrayByKey(
      $event,
      'CampaignNr'
    );
    this.mediacodeOutput['idSalesCampaignWizard'] = Uti.getValueFromArrayByKey(
      $event,
      'IdSalesCampaignWizard'
    );
    this.getCampaignForRight(this.mediacodeOutput.idSalesCampaignWizard);
  }

  public searchMediaCodeGridRightRowClick($event: any) {
    this.mediacodeOutput['idSalesCampaignWizardItems'] =
      Uti.getValueFromArrayByKey($event, 'IdSalesCampaignWizardItems');
    this.mediacodeOutput['idRepIsoCountryCode'] = Uti.getValueFromArrayByKey(
      $event,
      'IdRepIsoCountryCode'
    );
    this.mediacodeOutput['idRepLanguage'] = Uti.getValueFromArrayByKey(
      $event,
      'IdRepLanguage'
    );
    this.getCampaignForDetail(this.mediacodeOutput.idSalesCampaignWizardItems);
  }

  public searchMediaCodeGridDetailRowClick($event: any) {
    this.mediacodeOutput['mediaCode'] = Uti.getValueFromArrayByKey(
      $event,
      'MediaCode'
    );
    this.mediacodeOutput['idSalesCampaignMediaCode'] =
      Uti.getValueFromArrayByKey($event, 'IdSalesCampaignMediaCode');
    this.outputData.emit(this.mediacodeOutput);
  }

  public searchMediaCodeGridDetailRowDoubleClick($event: any) {
    this.mediacodeOutput['mediaCode'] = Uti.getValueFromArrayByKey(
      $event,
      'MediaCode'
    );
    this.mediacodeOutput['idSalesCampaignMediaCode'] =
      Uti.getValueFromArrayByKey($event, 'IdSalesCampaignMediaCode');
    this.outputDataWithCloseModal.emit(this.mediacodeOutput);
  }

  public onLeftTableSearch(keyword) {
    this.pageIndex = 1;
    this.keyword = keyword;
    this.search();
  }

  public dragStart() {
    Uti.handleWhenSpliterResize();
  }

  public onPageChanged(event: IPageChangedEvent) {
    this.pageIndex = event.page;
    this.pageSize = event.itemsPerPage;
    this.search();
  }

  public onPageNumberChanged(pageNumber: number) {
    this.pageSize = pageNumber;
  }

  private search() {
    if (
      this.modalService.isStopSearchWhenEmptySize(this.pageSize, this.pageIndex)
    )
      return;
    this.wjGridSearchMediaCodeLeft.isSearching = true;
    this.searchServiceSubscription = this.searchService
      .search('campaign', this.keyword, null, this.pageIndex, this.pageSize)
      .subscribe(this.onSearchComplete);
  }

  private initData() {
    this.initEmptyDataForGrid();
    this.getEmptyDataForGrid();
    setTimeout(() => {
      this.initGridSearchMediaCodeLeft();
    }, 300);
  }

  private getEmptyDataForGrid() {
    this.createWidgetDetail();
    this.getCampaignForLeft('');
    this.getCampaignForRight('');
    this.getCampaignForDetail('');
  }

  private initPerfectScroll() {
    this.perfectScrollbarConfig = {
      suppressScrollX: false,
      suppressScrollY: false,
    };
  }

  private initGridSearchMediaCodeLeft() {
    if (this.wjGridSearchMediaCodeLeft && this.searchText) {
      this.wjGridSearchMediaCodeLeft.doSearch(this.searchText);
    }
  }

  private createWidgetDetail() {
    this.widgetDetailMediaCodeMain = new WidgetDetail({
      id: '153eaf8e-b109-aa3a-b2ab-57aa5c8ae4cb', // No needed
      idRepWidgetApp: 46,
      idRepWidgetType: 2,
      isMainArea: false,
      moduleName: 'Campaign',
      request: StoreStringCall.StoreWidgetRequestMediaCodeMain,
      title: 'MediaCode Main',
      updateRequest: '',
    });

    this.widgetDetailMediaCodeDetail = new WidgetDetail({
      id: '153eaf8e-b109-aa3a-b2ab-57aa5c8ae4cb', // No needed
      idRepWidgetApp: 46,
      idRepWidgetType: 3,
      isMainArea: false,
      moduleName: 'Campaign',
      request: StoreStringCall.StoreWidgetRequestMediaCodeDetail,
      title: 'MediaCode Detail',
      updateRequest: '',
    });
  }

  private initEmptyDataForGrid() {
    this.searchMediaCodeGridLeft = {
      data: [],
      columns: [],
    };
    this.searchMediaCodeGridRight = {
      data: [],
      columns: [],
    };
    this.searchMediaCodeGridDetail = {
      data: [],
      columns: [],
    };
  }

  private getCampaignForLeft(idSalesCampaignWizard: any) {
    this.searchServiceSubscription = this.searchService
      .search(
        'campaign',
        '153eaf8eb109aa3ab2ab57aa5c8ae4cb534fda432fda432',
        4,
        1,
        0
      )
      .finally(() => {
        if (this.searchText) {
          setTimeout(() => {
            this.wjGridSearchMediaCodeLeft.setSelectedRow(
              { CampaignNr: this.searchText },
              'CampaignNr'
            );
          });
        }
        this.ref.detectChanges();
      })
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          const tableData = this.datatableService.formatDataTableFromRawData([
            response.item.setting[0],
            [],
          ]);
          this.searchMediaCodeGridLeft =
            this.datatableService.buildDataSource(tableData);
          this.ref.detectChanges();
        });
      });
  }

  private getCampaignForRight(idSalesCampaignWizard: any) {
    if (this.idSalesCampaignWizard === idSalesCampaignWizard) return;
    this.idSalesCampaignWizard = idSalesCampaignWizard;

    this.widgetTemplateSettingServiceSubscription =
      this.widgetTemplateSettingService
        .getWidgetDetailByRequestString(this.widgetDetailMediaCodeMain, {
          IdSalesCampaignWizard: idSalesCampaignWizard,
        })
        .subscribe((response) => {
          this.appErrorHandler.executeAction(() => {
            this.searchMediaCodeGridRight =
              this.datatableService.buildDataSource(response.contentDetail);

            if (this.data && Object.keys(this.data).length > 0) {
              setTimeout(() => {
                const selectedRow = {
                  IdRepIsoCountryCode: this.data['idRepIsoCountryCode'],
                  IdRepLanguage: this.data['idRepLanguage'],
                };
                this.wjGridSearchMediaCodeRight.setSelectedRow(
                  selectedRow,
                  'IdRepIsoCountryCode,IdRepLanguage'
                );
              }, 500);
            }
            this.ref.detectChanges();
          });
        });
  }

  private getCampaignForDetail(idSalesCampaignWizardItems: any) {
    if (this.idSalesCampaignWizardItems === idSalesCampaignWizardItems) return;
    this.idSalesCampaignWizardItems = idSalesCampaignWizardItems;

    this.widgetTemplateSettingServiceSubscription =
      this.widgetTemplateSettingService
        .getWidgetDetailByRequestString(this.widgetDetailMediaCodeDetail, {
          IdSalesCampaignWizardItems: idSalesCampaignWizardItems,
        })
        .subscribe((response) => {
          this.appErrorHandler.executeAction(() => {
            this.searchMediaCodeGridDetail =
              this.datatableService.buildDataSource(response.contentDetail);
            if (this.data && Object.keys(this.data).length > 0) {
              setTimeout(() => {
                const selectedRow = {
                  MediaCode: this.data['mediaCode'],
                };
                this.wjGridSearchMediaCodeDetail.setSelectedRow(
                  selectedRow,
                  'MediaCode'
                );
              });
            }
          });
        });
  }

  private onSearchComplete(response: ApiResultResponse) {
    const results: Array<any> = response.item.results || [];
    const newData: Array<any> = [];
    for (const res of results) {
      let dataObj: any = {};
      dataObj = this.makeGridSearchData(res);
      newData.push(dataObj);
    }

    const leftData = {
      data: newData,
      columns: this.searchMediaCodeGridLeft.columns,
      totalResults: response.item.total || 0,
    };
    this.searchMediaCodeGridLeft = leftData;
    this.wjGridSearchMediaCodeLeft.isSearching = false;

    if (!leftData.totalResults) {
      this.idSalesCampaignWizard = null;
      this.idSalesCampaignWizardItems = null;
      this.wjGridSearchMediaCodeRight.clearAllRows();
      this.wjGridSearchMediaCodeDetail.clearAllRows();
    }

    this.ref.detectChanges();

    if (
      this.searchMediaCodeGridLeft &&
      this.searchMediaCodeGridLeft.totalResults &&
      this.searchText
    ) {
      setTimeout(() => {
        this.wjGridSearchMediaCodeLeft.setSelectedRow(
          { CampaignNr: this.searchText },
          'CampaignNr'
        );
      });
    }
  }

  private makeGridSearchData(res: any) {
    const result = {};
    for (const col of this.searchMediaCodeGridLeft.columns) {
      result[col.data] = res[lowerFirst(col.data)];
    }
    return result;
  }
}
