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
} from '@angular/core';
import { ControlGridModel, SimpleTabModel } from 'app/models';
import {
  DataEntryService,
  AppErrorHandler,
  DatatableService,
  DomHandler,
  PropertyPanelService,
} from 'app/services';
import { WjInputNumber } from 'wijmo/wijmo.angular2.input';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Uti } from 'app/utilities';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';

@Component({
  selector: 'article-campaign-search',
  templateUrl: './article-campaign-search.component.html',
})
export class ArticleCampaignSearchComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  showDialog = false;
  selectedArticleItemQuantity: number;
  public globalNumberFormat = '';
  public that: any;
  private globalPropertiesStateSubscription: Subscription;
  private globalPropertiesState: Observable<any>;

  @ViewChild('wijQuantNum')
  wijQuantNum: ElementRef;

  @ViewChild('grid') grid: XnAgGridComponent;

  @Input() set mediaCode(value: string) {
    if (value) {
      this.getArticleData(value);
    }
  }

  @Input() parentInstance: any = null;
  @Input() gridId: string;

  @Output()
  onCampaignArticleSelected: EventEmitter<any> = new EventEmitter();

  dataSource: ControlGridModel;
  displayError: boolean;
  private dataEntryServiceSubscription: Subscription;
  private selectedItem: any;

  constructor(
    private _eref: ElementRef,
    private datatableService: DatatableService,
    private appErrorHandler: AppErrorHandler,
    private dataEntryService: DataEntryService,
    private store: Store<AppState>,
    private propertyPanelService: PropertyPanelService,
    protected router: Router
  ) {
    super(router);
    this.that = this;

    this.globalPropertiesState = store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).globalProperties
    );
  }

  /**
   * ngOnInit
   */
  ngOnInit() {
    this.subscribeGlobalProperties();
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  /**
   * ngAfterViewInit
   */
  ngAfterViewInit() {}

  public makeContextMenu(data?: any) {
    if (!this.parentInstance || !this.parentInstance.makeContextMenu) {
      return [];
    }
    return this.parentInstance.makeContextMenu(data);
  }

  /**
   * getArticleData
   * @param mediacode
   */
  private getArticleData(mediacode: string) {
    this.dataEntryServiceSubscription = this.dataEntryService
      .getArticleDataByMediacodeNr(mediacode)
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (response) {
            response = this.datatableService.formatDataTableFromRawData(
              response.data
            );
            this.dataSource = this.datatableService.buildDataSource(response);
          }
        });
      });
  }

  private subscribeGlobalProperties() {
    this.globalPropertiesStateSubscription =
      this.globalPropertiesState.subscribe((globalProperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalProperties) {
            this.globalNumberFormat =
              this.propertyPanelService.buildGlobalNumberFormatFromProperties(
                globalProperties
              );
          }
        });
      });
  }

  /**
   * buildSelectedItem
   * @param rowData
   */
  buildSelectedItem(rowData) {
    this.showDialog = true;
    this.displayError = false;
    this.selectedItem = rowData;
    this.focusQuantityTextbox();
  }

  /**
   * quantityChange
   * @param $event
   */
  quantityChange($event: any) {
    this.displayError = !!!this.selectedArticleItemQuantity;
  }

  /**
   * cancelSetQuantity
   */
  cancelSetQuantity() {
    this.showDialog = false;
    this.selectedArticleItemQuantity = null;
  }

  /**
   * focusQuantityTextbox
   */
  private focusQuantityTextbox() {
    setTimeout(() => {
      if (this.wijQuantNum) this.wijQuantNum.nativeElement.focus();
    }, 100);
  }

  /**
   * continueSetQuantity
   */
  continueSetQuantity() {
    if (!this.selectedArticleItemQuantity) {
      this.displayError = true;
      this.focusQuantityTextbox();
      return;
    }
    this.showDialog = false;
    this.onCampaignArticleSelected.emit({
      ArticleNr: this.selectedItem.ArticleNr,
      ArticleNameShort: this.selectedItem.ArticleNameShort,
      Quantity: this.selectedArticleItemQuantity,
      SalesPrice: this.selectedItem.SalesPrice,
    });
  }

  reset() {
    if (this.dataSource) {
      this.dataSource = Object.assign({}, this.dataSource);
      this.dataSource.data = [];
    }
  }
}
