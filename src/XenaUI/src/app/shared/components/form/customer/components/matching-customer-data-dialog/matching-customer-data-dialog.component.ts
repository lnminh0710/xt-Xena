import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { ControlGridModel } from 'app/models';
import { Uti } from 'app/utilities/uti';
import {
  ModalService,
  SearchService,
  AppErrorHandler,
  DatatableService,
  CommonService,
} from 'app/services';
import { MenuModuleId } from 'app/app.constants';
import camelCase from 'lodash-es/camelCase';
import { GlobalSearchResultComponent } from 'app/shared/components/global-search/components';

@Component({
  selector: 'matching-customer-data-dialog',
  styleUrls: ['./matching-customer-data-dialog.component.scss'],
  templateUrl: './matching-customer-data-dialog.component.html',
})
export class MatchingCustomerDataDialogComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public showDialog: boolean = false;
  public allowApply: boolean = false;
  public dataSource: ControlGridModel = new ControlGridModel();

  private _customerData: any;

  @Input() gridId: string;
  @Input() isVerticalLayout = false; //True: use for ODE

  @ViewChild(GlobalSearchResultComponent)
  public globalSearchResult: GlobalSearchResultComponent;

  @Output() onCloseAction: EventEmitter<any> = new EventEmitter();
  @Output() onSelectedItemAction: EventEmitter<any> = new EventEmitter();
  @Output() onIgnoreAndSaveAction: EventEmitter<any> = new EventEmitter();

  constructor(
    private _searchService: SearchService,
    private _modalService: ModalService,
    private _appErrorHandler: AppErrorHandler,
    private _datatableService: DatatableService,
    private _commonService: CommonService,
    private _ref: ChangeDetectorRef,
    router?: Router
  ) {
    super(router);
  }
  public ngOnInit() {}
  public ngOnDestroy() {}
  public onShowDialog(data: any, disableApply?: boolean) {
    this.showDialog = true;
    this._customerData = null;
    this.allowApply = !disableApply;
    this.dataSource = { ...this.dataSource, ...data };
    this.autoSizeColumns();
    this.executeMatchedCustomerData(data.data);
  }
  private autoSizeColumns(count?: number) {
    count = count || 1;
    if (count > 30) return;

    if (
      this.globalSearchResult &&
      this.globalSearchResult.agGridComponent &&
      this.globalSearchResult.agGridComponent.columnApi
    ) {
      setTimeout(() => {
        const columns =
          this.globalSearchResult.agGridComponent.columnApi.getAllDisplayedColumns();
        if (columns && columns.length) {
          this.globalSearchResult.agGridComponent.columnApi.autoSizeColumns(
            columns.slice(1)
          );
        }
      });
    } else {
      //if component still haven't loaded, wait 0.5s
      setTimeout(() => {
        this.autoSizeColumns(++count);
      }, 500);
    }
  }

  public onRowClickHandler($event) {
    if (!$event || !this.allowApply) return;
    //console.log($event);
    //this._customerData = Uti.mapArrayToObject($event);
    this._customerData = $event;
  }
  public onRowDoubleClickHandler($event) {
    if (!$event || !this.allowApply) return;
    //this._customerData = Uti.mapObjectToCamel($event);
    this._customerData = $event;
    this.onSelectedItemAction.emit(this._customerData);
  }
  public apply() {
    if (!this._customerData || !this._customerData.personNr) {
      this._modalService.warningText(
        'Modal_Message__Select_At_Least_Item_Apply'
      );
      return;
    }
    this.onSelectedItemAction.emit(this._customerData);
    this.close(true);
  }
  public ignoreAndSave() {
    this.onIgnoreAndSaveAction.emit();
    this.close(true);
  }
  public close(isPrevented?: boolean) {
    this.showDialog = false;
    this.onCloseAction.emit(isPrevented);
  }
  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/
  private executeMatchedCustomerData(data: Array<any>) {
    if (this.dataSource.columns && this.dataSource.columns.length) {
      this.dataSource = new ControlGridModel({
        columns: this.dataSource.columns,
        data: data,
      });
      return;
    }
    this.getColumnsSettingForGrid(data);
  }
  private getColumnsSettingForGrid(data: Array<any>) {
    this._commonService
      .getCustomerColumnsSetting('MatchingCustomer')
      .subscribe((response: any) => {
        this._appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) return;
          let dataResult = this._datatableService.buildEditableDataSource(
            response.item.data
          );
          dataResult.data = data;
          this.dataSource = new ControlGridModel({
            data: dataResult.data,
            columns: dataResult.columns,
          });
          this._ref.detectChanges();
        });
      });
  }
}
