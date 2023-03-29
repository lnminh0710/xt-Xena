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
} from '@angular/core';

import {
  WidgetDetail,
  IDragDropCommunicationData,
  DragMode,
  LayoutPageInfoModel,
} from 'app/models';

import {
  TranslateModeEnum,
  TranslateDataTypeEnum,
  ComboBoxTypeConstant,
  Configuration,
} from 'app/app.constants';
import { UUID } from 'angular2-uuid';
import {
  GlobalSettingService,
  AppErrorHandler,
  ModalService,
  WidgetTemplateSettingService,
  CommonService,
  ToolsService,
  DatatableService,
} from 'app/services';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import cloneDeep from 'lodash-es/cloneDeep';
import { WijmoGridComponent } from 'app/shared/components/wijmo';
import { WidgetUtils } from '../../utils';
import { LayoutInfoState } from 'app/state-management/store/reducer/layout-info';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as commonReducer from 'app/state-management/store/reducer/xn-common';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { WidgetType, ApiResultResponse } from 'app/models';
import { Uti } from 'app/utilities';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { WidgetModuleComponent } from 'app/shared/components/widget';

@Component({
  selector: 'widget-export-blocked-customer',
  templateUrl: './widget-export-blocked-customer.component.html',
  styleUrls: ['./widget-export-blocked-customer.component.scss'],
})
export class WidgetExportBlockedComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public widgetExportBlocked: WidgetExportBlockedComponent;
  public rowGroupingBlock = false;
  public rowGroupingResult = false;
  public blockCustomerId = '64a6b941-1cba-477d-806f-51d3cee53056';
  public resultCustomerId = '53892b93-ef56-44fb-bcce-ebdf6aa37361';
  private _parentInstance: WidgetModuleComponent;
  @Input() set parentInstance(instance: WidgetModuleComponent) {
    if (instance) {
      this._parentInstance = instance;
      this.registerEventFromParentInstance();
      this.restoreState();
    }
  }

  get parentInstance() {
    return this._parentInstance;
  }

  @Input() globalProperties;

  @ViewChild('blockedCustomer') public blockedCustomerGrid: XnAgGridComponent;
  @ViewChild('blockedCustomerResult')
  public blockedCustomerResultGrid: XnAgGridComponent;

  @Output() changeColumnLayout = new EventEmitter<any>();
  @Output() saveColumnsLayoutAction = new EventEmitter<any>();

  private searchSubscription: Subscription;
  private exportExcelSubscription: Subscription;
  private refreshSubscription: Subscription;

  public blockedCodeGridData: any = {
    data: [],
    columns: this.initBlockedColumnSetting(),
  };

  public blockedCodeResultGridData: any = {
    data: [],
    columns: [],
  };

  public isLoading = false;
  public blockedCustomerId = 'blockedCustomer';
  public blockedCustomerResultId = 'blockedCustomerResult';
  public blockedCustomerColumnsLayoutSettings;
  public blockedCustomerResultColumnsLayoutSettings;
  public leftSize = 35;
  public rightSize = 65;

  constructor(
    private store: Store<AppState>,
    private _eref: ElementRef,
    private globalSettingService: GlobalSettingService,
    private appErrorHandler: AppErrorHandler,
    private widgetTemplateSettingService: WidgetTemplateSettingService,
    private commonService: CommonService,
    private toolsService: ToolsService,
    private datatableService: DatatableService,
    private consts: Configuration,
    protected router: Router,
    private ref: ChangeDetectorRef
  ) {
    super(router);
  }

  private registerEventFromParentInstance() {
    this.searchSubscription = this.parentInstance.onSearch.subscribe((data) => {
      this.searchBlockedCustomer();
    });

    this.exportExcelSubscription = this.parentInstance.onExportExcel.subscribe(
      (data) => {
        this.exportExcel();
      }
    );

    this.refreshSubscription = this.parentInstance.onResetWidget.subscribe(
      (data) => {
        this.loadData();
        // this.searchBlockedCustomer();
      }
    );
  }

  private searchBlockedCustomer() {
    if (this.blockedCustomerGrid) {
      let customerStatusList = [];
      let businessStatusList = [];
      const nodeItems = this.blockedCustomerGrid.getCurrentNodeItems();
      if (nodeItems) {
        nodeItems.forEach((item) => {
          if (item.selectAll) {
            if (item.statusType == 'IdRepPersonStatus') {
              customerStatusList.push(item.idBlockedCode);
            } else if (item.statusType == 'IdRepPersonBusinessStatus') {
              businessStatusList.push(item.idBlockedCode);
            }
          }
        });
      }
      let customerStatus = '';
      let businessStatus = '';
      if (customerStatusList && customerStatusList.length) {
        customerStatus = customerStatusList.join(',');
      }
      if (businessStatusList && businessStatusList.length) {
        businessStatus = businessStatusList.join(',');
      }
      this.getBlockedCustomerResult(customerStatus, businessStatus);
      //if (customerStatus || businessStatus) {
      //    this.getBlockedCustomerResult(customerStatus, businessStatus);
      //}
    }
  }

  private getBlockedCustomerResult(customerStatus, businessStatus) {
    this.isLoading = true;
    this.toolsService
      .exportCustomerAndBusinessStatus(customerStatus, businessStatus)
      .finally(() => {
        this.isLoading = false;
      })
      .subscribe((result) => {
        if (result) {
          result = this.datatableService.formatDataTableFromRawData(
            result.data
          );
          this.blockedCodeResultGridData =
            this.datatableService.buildDataSource(result);
          if (this.parentInstance) {
            this.parentInstance.reattach();
          }
        }
      });
  }

  public onBlockedDataChanged() {
    // this.blockedCustomerGrid.sizeColumnsToFit();
  }

  public onBlockedResultDataChanged() {
    // this.blockedCustomerResultGrid.sizeColumnsToFit();
  }

  public makeContextMenu(data?: any) {
    return this.parentInstance.makeContextMenu(data);
  }

  public dragEnd(items) {
    let setting = {};
    setting['splitter'] = {
      left: items[0],
      right: items[1],
    };
    if (!this.parentInstance.data.extensionData) {
      this.parentInstance.data.extensionData = {};
    }
    this.parentInstance.data.extensionData = Object.assign(
      this.parentInstance.data.extensionData,
      setting
    );
    this.changeColumnLayout.emit({
      type: 'columnResized',
    });
  }

  private exportExcel() {
    if (this.blockedCustomerResultGrid) {
      this.blockedCustomerResultGrid.exportExcel();
    }
  }

  /**
   * loadData
   */
  private loadData() {
    this.commonService
      .getListComboBox(ComboBoxTypeConstant.mailingReturnReason)
      .debounceTime(this.consts.valueChangeDeboundTimeDefault)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) return;
          let dataRow: Array<any> = [];
          let items: Array<any> =
            response.item[ComboBoxTypeConstant.mailingReturnReason];
          items.forEach((item) => {
            dataRow.push({
              idBlockedCode: item.idValue,
              blockedCode: item.textValue,
              statusType: item.statusType,
            });
          });
          this.blockedCodeGridData.data = dataRow;
          this.blockedCodeGridData = Object.assign(
            {},
            this.blockedCodeGridData
          );
        });
      });

    this.getBlockedCustomerResult('', '');
  }

  /**
   * reset
   */
  private reset() {}

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.widgetExportBlocked = this;
    this.loadData();
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
  ngAfterViewInit() {}

  private onSelectedAllCheckedTimeout;

  public handleRowGroupPanelBlocked(data) {
    this.blockedCustomerGrid.rowGrouping = data;
  }

  public handleRowGroupPanelResult(data) {
    this.blockedCustomerResultGrid.rowGrouping = data;
  }

  public onSelectedAllChecked() {
    if (this.parentInstance && this.parentInstance.widgetMenuStatusComponent) {
      clearTimeout(this.onSelectedAllCheckedTimeout);
      this.onSelectedAllCheckedTimeout = null;
      this.onSelectedAllCheckedTimeout = setTimeout(() => {
        this.parentInstance.widgetMenuStatusComponent.forceToggleToolButtons(
          true
        );
      }, 300);
    }
    if (this.parentInstance) {
      this.parentInstance.reattach();
    }
  }

  /**
   * initBlockedColumnSetting
   */
  private initBlockedColumnSetting() {
    const colSetting = [
      {
        title: 'IdBlockedCode',
        data: 'idBlockedCode',
        setting: {
          DataType: 'nvarchar',
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
        title: 'Blocked Code',
        data: 'blockedCode',
        setting: {
          DataType: 'nvarchar',
          Setting: [],
        },
      },
      {
        title: 'Status Type',
        data: 'statusType',
        setting: {
          DataType: 'nvarchar',
          Setting: [
            {
              DisplayField: {
                Hidden: '1',
              },
            },
          ],
        },
      },
    ];
    return colSetting;
  }

  private restoreState() {
    if (this.parentInstance && this.parentInstance.data) {
      const settings = this.parentInstance.data.extensionData;
      if (settings) {
        if (settings[this.blockedCustomerId]) {
          this.blockedCustomerColumnsLayoutSettings =
            settings[this.blockedCustomerId].columnsLayoutSettings;
        }
        if (settings[this.blockedCustomerResultId]) {
          this.blockedCustomerResultColumnsLayoutSettings =
            settings[this.blockedCustomerResultId].columnsLayoutSettings;
        }
        if (settings['splitter']) {
          if (settings['splitter'].left) {
            this.leftSize = settings['splitter'].left;
          }
          if (settings['splitter'].right) {
            this.rightSize = settings['splitter'].right;
          }
        }
      }
    }
  }

  /**
   * updateColumnLayout
   * @param data
   * @param id
   */
  public updateColumnLayout(data: any, id: string) {
    let setting = {};
    setting[id] = {
      columnsLayoutSettings: {
        settings: data.columnState,
        sortState: data.sortState,
      },
    };
    if (!this.parentInstance.data.extensionData) {
      this.parentInstance.data.extensionData = {};
    }
    this.parentInstance.data.extensionData = Object.assign(
      this.parentInstance.data.extensionData,
      setting
    );
    this.changeColumnLayout.emit(data);
  }

  public saveColumnsLayoutHandle() {
    this.saveColumnsLayoutAction.emit();
  }
}
