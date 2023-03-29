import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import isEqual from 'lodash-es/isEqual';
import sortBy from 'lodash-es/sortBy';
import isObject from 'lodash-es/isObject';
import isEmpty from 'lodash-es/isEmpty';
import {
  CommonService,
  CampaignService,
  DatatableService,
  AppErrorHandler,
  PropertyPanelService,
} from 'app/services';
import { RowNode } from 'ag-grid-community';
import { ComboBoxTypeConstant, Configuration } from 'app/app.constants';
import { Observable } from 'rxjs/Observable';
import {
  ControlBase,
  TextboxControl,
  DropdownControl,
  CheckboxControl,
  DateControl,
  DynamicControl,
  ApiResultResponse,
} from 'app/models';
import { parse } from 'date-fns/esm';
import { Uti } from 'app/utilities/uti';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { WidgetModuleInfoTranslationComponent } from 'app/shared/components/widget/components/widget-module-info-translation';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { IAgGridData } from 'app/shared/components/xn-control/xn-ag-grid/shared/ag-grid.service';
import { ColDef, CellClassParams } from 'ag-grid-community';
import { TemplateCellRenderer } from 'app/shared/components/xn-control/xn-ag-grid/components/template-cell-renderer/template-cell-renderer.component';
import { TemplateEditCellRenderer } from 'app/shared/components/xn-control/xn-ag-grid/components/template-edit-cell-renderer/template-edit-cell-renderer.component';

@Component({
  selector: 'campaign-country-t1b-form',
  styleUrls: ['./campaign-country-t1b-form.component.scss'],
  templateUrl: './campaign-country-t1b-form.component.html',
})
export class CampaignCountryT1BFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // Core API of Ag Grid
  private api: GridApi;
  private columnApi: ColumnApi;
  public gridOptions: GridOptions;

  public campaignT2RawData: any;
  public globalDateFormat = '';
  public dontShowCalendarWhenFocus: boolean;
  public isShowPostageCostItem = true;
  // @ViewChild('dp') dp: NgxMyDatePickerDirective;
  // @ViewChild('flex') flex: wjcGrid.FlexGrid;
  @ViewChild(WidgetModuleInfoTranslationComponent)
  widgetModuleInfoTranslationComponent: WidgetModuleInfoTranslationComponent;

  public dataSource: any = {
    columns: [],
    data: [],
  };
  public itemsEdited: Array<any> = [];

  private comboBoxData: any = {};
  private updatedLayoutHandlerTimer;
  private updatedLayoutHandlerInterval = 1000;
  private commonServiceSubscription: Subscription;
  private campaignServiceSubscription: Subscription;
  private globalPropertiesStateSubscription: Subscription;
  private globalPropertiesState: Observable<any>;
  private isOpendCalendar: number = 0;
  private isPostageCosts: boolean = false;

  private outputModel: {
    submitResult?: boolean;
    formValue?: any;
    isValid?: boolean;
    isDirty?: boolean;
    returnID?: string;
  };

  @Input() set form1Data(data: any) {
    if (!data || !data.formValue) {
      this.isPostageCosts = false;
      return;
    }
    this.isShowPostageCostItem = !!data.formValue['postageCost'];
    this.isPostageCosts = this.isShowPostageCostItem;
  }

  private _idSalesCampaignWizard: any;
  @Input() set idSalesCampaignWizard(data: any) {
    this._idSalesCampaignWizard = data;
    this.loadData();
  }
  @Input() isClone = false;

  get idSalesCampaignWizard() {
    return this._idSalesCampaignWizard;
  }

  @Output() outputData: EventEmitter<any> = new EventEmitter();
  @Output() saveData: EventEmitter<any> = new EventEmitter();
  @Output() reloadData: EventEmitter<any> = new EventEmitter();

  @ViewChild('checkBoxCell') checkBoxCellTemplateRef: TemplateRef<any>;
  @ViewChild('checkBoxEditCell')
  checkBoxEditCellTemplateRef: TemplateRef<any>;
  @ViewChild('labelCell') labelCellTemplateRef: TemplateRef<any>;
  @ViewChild('labelDateCell') labelDateCellTemplateRef: TemplateRef<any>;
  @ViewChild('labelDropdownCell')
  labelDropdownCellTemplateRef: TemplateRef<any>;
  @ViewChild('multiSelectEditCell')
  multiSelectEditTemplateRef: TemplateRef<any>;
  @ViewChild('dropdownEditCell') dropdownEditTemplateRef: TemplateRef<any>;
  @ViewChild('datePickerEditCell')
  datePickerEditTemplateRef: TemplateRef<any>;
  @ViewChild('postageCostsEditCell')
  postageCostsEditCellTemplateRef: TemplateRef<any>;
  @ViewChild('labelPostageCostsCell')
  labelPostageCostsCellTemplateRef: TemplateRef<any>;
  @ViewChild('numericEditCell') numericEditCellTemplateRef: TemplateRef<any>;
  @ViewChild('agGrid', { read: ViewContainerRef })
  public agGridViewContainerRef;

  constructor(
    private store: Store<AppState>,
    private appErrorHandler: AppErrorHandler,
    private propertyPanelService: PropertyPanelService,
    private commonService: CommonService,
    private campaignService: CampaignService,
    private datatableService: DatatableService,
    private consts: Configuration,
    protected router: Router,
    private uti: Uti
  ) {
    super(router);
    this.initGrid();
    this.globalPropertiesState = store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).globalProperties
    );
  }

  public calendarToggle($event) {
    this.isOpendCalendar = $event;
  }

  private addPerfectScrollbar() {
    //setTimeout(() => {
    //    let wijmoGridElm = $('div[wj-part=\'root\']', this.flex.hostElement);
    //    if (wijmoGridElm.length) {
    //        Ps.destroy(wijmoGridElm.get(0));
    //        Ps.initialize(wijmoGridElm.get(0));
    //        setTimeout(() => {
    //            $('.ps-scrollbar-x-rail', this.flex.hostElement).css('z-index', 9999);
    //            $('.ps-scrollbar-y-rail', this.flex.hostElement).css('z-index', 9999);
    //        }, 200);
    //    }
    //});
  }

  /**
   * itemFormatter
   * @param panel
   * @param r
   * @param c
   * @param cell
   */
  itemFormatter(panel, r, c, cell) {
    //if (panel.cellType === wjcGrid.CellType.ColumnHeader) {
    //    if (!panel.columns[c].isReadOnly) {
    //        cell.style.borderBottom = '3px solid orange';
    //    }
    //}
    //if (panel.cellType == wjcGrid.CellType.Cell) {
    //    const item = panel.rows[r].dataItem;
    //    const prop = panel.columns[c].binding;
    //    if (item[prop]) {
    //        // cell.style.backgroundColor = isEqual(item[prop].value, item[prop].originalValue) ? '' : '#f9f8b3';
    //        const color = isEqual(item[prop].value, item[prop].originalValue) ? '' : '#f9f8b3';
    //        cell.style.setProperty('background-color', color, 'important');
    //    }
    //    if (!item['IsActive'].value) {
    //        cell.classList.add('in-active-cell');
    //    }
    //}
  }

  rowStyleFormatter(args) {
    // console.log(args);
  }

  /**
   * onCellEditEnded
   * @param flex
   * @param arg
   */
  onCellEditEnded(params) {
    //if (flex.itemsSource.itemsEdited.indexOf(flex.itemsSource.currentItem) < 0) {
    //    flex.itemsSource.itemsEdited.push(flex.itemsSource.currentItem);
    //}

    const item = this.itemsEdited.find((p) => p == params.data);
    if (!item) {
      this.itemsEdited.push(params.data);
    }

    this.setOutputData(null, {
      submitResult: null,
      formValue: this.dataSource,
      isValid: true,
      isDirty: true,
      returnID: this.idSalesCampaignWizard,
    });
  }

  //cellEditEnding($event: wjcGrid.CellEditEndingEventArgs) {
  //    console.log($event);
  //    if (this.isOpendCalendar === 1) {
  //        $event.cancel = true;
  //        $event.stayInEditMode = true;
  //    } else {
  //        $event.cancel = false;
  //        $event.stayInEditMode = false;
  //    }
  //}

  /**
   * ngOnInit
   */
  public ngOnInit() {
    this.subscribeGlobalProperties();
  }

  /**
   * ngAfterViewInit
   */
  public ngAfterViewInit() {
    setTimeout(() => {
      if (
        this.agGridViewContainerRef &&
        this.agGridViewContainerRef.element.nativeElement
      ) {
        this.agGridViewContainerRef.element.nativeElement.addEventListener(
          'keydown',
          this.onGridKeydown.bind(this)
        );
      }
    });
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    Uti.unsubscribe(this);

    if (this.gridOptions) {
      this.gridOptions.columnDefs = null;
      this.gridOptions.rowData = null;
      this.gridOptions = null;
    }
    if (this.api) {
      this.api.destroy();
    }
  }

  /**
   * initGrid
   * */
  private initGrid() {
    if (this.gridOptions) {
      this.gridOptions = null;
    }
    this.gridOptions = <GridOptions>{
      onFirstDataRendered: (params) => {
        params.api.sizeColumnsToFit();
      },
      context: {
        componentParent: this,
      },
    };
    this.gridOptions.rowClassRules = {
      'in-active-cell': function (params) {
        return (
          params.node.data &&
          (params.node.data['IsActive'].value == false ||
            params.node.data['IsActive'].value == 0)
        );
      },
    };
    this.gridOptions.overlayNoRowsTemplate =
      '<span class="no-entry-data-block"> No entry data </span>';
  }

  /**
   * onGridKeydown
   * @param evt
   */
  private onGridKeydown(evt) {
    if (evt.key === 'Enter') {
      this.api.tabToNextCell();
      const currentFocusedCell = this.api.getFocusedCell();
      const selectedNodes = this.api.getSelectedNodes();
      if (currentFocusedCell && selectedNodes && selectedNodes.length) {
        if (selectedNodes[0].rowIndex != currentFocusedCell.rowIndex) {
          this.api.forEachNode((rowNode: RowNode, rowIndex: number) => {
            if (rowIndex == currentFocusedCell.rowIndex) {
              rowNode.setSelected(true);
            }
          });
        }
      }
    }
  }

  /**
   * onReady
   * @param params
   */
  public onReady(params) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  /**
   * loadData
   */
  private loadData() {
    this.getCampaignWizardT1()
      .finally(() => {
        this.getCampaignWizardT2();
      })
      .subscribe((data) => {
        this.appErrorHandler.executeAction(() => {
          this.isPostageCosts = this.buildBooleanRadio(
            data,
            'isWithPostageCost'
          );
          this.isShowPostageCostItem = this.isPostageCosts;
        });
      });
  }

  /**
   * getCampaignWizardT2
   */
  private getCampaignWizardT2() {
    this.campaignServiceSubscription = this.campaignService
      .getCampaignWizardT2(this.idSalesCampaignWizard)
      .subscribe((rs) => {
        this.appErrorHandler.executeAction(() => {
          if (!rs) return;
          const data = this.datatableService.buildTableDataFromCollection(rs);
          this.initDataMap().subscribe((dataMaps) => {
            this.appErrorHandler.executeAction(() => {
              this.dataSource = this.buildDatasource(data);
              const agGridDataSource = this.mapToAgGridDataSource(
                this.dataSource
              );
              if (!this.gridOptions) {
                this.initGrid();
              }
              this.gridOptions.columnDefs = agGridDataSource.columnDefs;
              this.gridOptions.rowData = agGridDataSource.rowData;
              this.isShowPostageCostItem = !this.isShowPostageCostItem;
              this.viewPostageCost();
              this.reloadData.emit();
            });
          });
        });
      });
  }

  /**
   * mapToAgGridDataSource
   * @param dataSource
   */
  private mapToAgGridDataSource(dataSource) {
    const agGridData: IAgGridData = {
      rowData: [],
      columnDefs: [],
    };
    dataSource.columns.forEach((col: ControlBase<any>) => {
      const editable = !col.readOnly;
      let colDef: ColDef = {
        headerName: col.label,
        field: col.key,
        editable: editable,
        hide: col.isHidden,
        headerClass: editable ? ['editable-col', 'editing'] : '',
        refData: {
          controlType: col.controlType,
        },
        colId: col.key,
        cellClassRules: {
          'edited-cell': function (cellClassParams: CellClassParams) {
            return !isEqual(
              cellClassParams.value.value,
              cellClassParams.value.originalValue
            );
          },
        },
      };
      switch (col.controlType.toLowerCase()) {
        case 'checkbox':
          colDef = Object.assign(colDef, {
            cellRendererFramework: TemplateCellRenderer,
            cellRendererParams: {
              ngTemplate: this.checkBoxCellTemplateRef,
            },
            cellEditorFramework: TemplateEditCellRenderer,
            cellEditorParams: {
              ngTemplate: this.checkBoxEditCellTemplateRef,
            },
            cellClass: 'text-center',
            valueFormatter: this.boolFormatter.bind(this),
          });
          break;

        case 'dropdown':
          if (col['type'] == 'multi-select') {
            colDef = Object.assign(colDef, {
              cellRendererFramework: TemplateCellRenderer,
              cellRendererParams: {
                ngTemplate: this.labelDropdownCellTemplateRef,
              },
              cellEditorFramework: TemplateEditCellRenderer,
              cellEditorParams: {
                ngTemplate: this.multiSelectEditTemplateRef,
              },
            });
          } else {
            colDef = Object.assign(colDef, {
              cellRendererFramework: TemplateCellRenderer,
              cellRendererParams: {
                ngTemplate: this.labelDropdownCellTemplateRef,
              },
              cellEditorFramework: TemplateEditCellRenderer,
              cellEditorParams: {
                ngTemplate: this.dropdownEditTemplateRef,
              },
            });
          }
          break;

        case 'date':
          colDef = Object.assign(colDef, {
            cellRendererFramework: TemplateCellRenderer,
            cellRendererParams: {
              ngTemplate: this.labelDateCellTemplateRef,
            },
            cellEditorFramework: TemplateEditCellRenderer,
            cellEditorParams: {
              ngTemplate: this.datePickerEditTemplateRef,
            },
          });
          break;

        case 'dynamic':
          colDef = Object.assign(colDef, {
            cellRendererFramework: TemplateCellRenderer,
            cellRendererParams: {
              ngTemplate: this.labelPostageCostsCellTemplateRef,
            },
            cellEditorFramework: TemplateEditCellRenderer,
            cellEditorParams: {
              ngTemplate: this.postageCostsEditCellTemplateRef,
            },
          });
          break;

        case 'textbox':
          if (col['type'] == 'number') {
            colDef = Object.assign(colDef, {
              cellRendererFramework: TemplateCellRenderer,
              cellRendererParams: {
                ngTemplate: this.labelCellTemplateRef,
              },
              cellEditorFramework: TemplateEditCellRenderer,
              cellEditorParams: {
                ngTemplate: this.numericEditCellTemplateRef,
              },
            });
            break;
          }

        default:
          colDef = Object.assign(colDef, {
            cellRendererFramework: TemplateCellRenderer,
            cellRendererParams: {
              ngTemplate: this.labelCellTemplateRef,
            },
            //cellEditorFramework: TemplateCellRenderer
          });
          break;
      }
      agGridData.columnDefs.push(colDef);
    });
    agGridData.rowData = dataSource.data;
    return agGridData;
  }

  /**
   * getCampaignWizardT1
   */
  private getCampaignWizardT1() {
    // Load form existing data
    return this.campaignService
      .getCampaignWizardT1(this.idSalesCampaignWizard)
      .map((response: ApiResultResponse) => {
        if (!Uti.isResquestSuccess(response)) {
          return null;
        }
        let data;
        if (response.item['collectionData']) {
          data = response.item['collectionData'][0];
        }
        return data;
      });
  }

  /**
   * buildBooleanRadio
   * @param data
   * @param fieldName
   */
  private buildBooleanRadio(data, fieldName) {
    if (!data[fieldName]) {
      return false;
    }
    if (String(data[fieldName].value).toLowerCase() == 'true') {
      return true;
    }
    return false;
  }

  private subscribeGlobalProperties() {
    this.globalPropertiesStateSubscription =
      this.globalPropertiesState.subscribe((globalProperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalProperties) {
            this.globalDateFormat =
              this.propertyPanelService.buildGlobalInputDateFormatFromProperties(
                globalProperties
              );
            this.dontShowCalendarWhenFocus =
              this.propertyPanelService.getValueDropdownFromGlobalProperties(
                globalProperties
              );
          }
        });
      });
  }

  /**
   * onSubmit
   * @param event
   */
  onSubmit(event?: any) {
    try {
      this.buildEditedItem();
      const items: Array<any> = this.itemsEdited;
      const returnID = '' + this.idSalesCampaignWizard;
      if (items.length) {
        this.campaignServiceSubscription = this.campaignService
          .saveCampaignWizardCountriesT2(this.prepareSubmitCreateData())
          .subscribe(
            (data) => {
              this.appErrorHandler.executeAction(() => {
                this.outputModel = {
                  submitResult: true,
                  formValue: this.dataSource,
                  isValid: true,
                  isDirty: false,
                  returnID: returnID,
                };
                this.saveData.emit(this.outputModel);
              });
            },
            (err) => {
              this.outputModel = {
                submitResult: true,
                formValue: this.dataSource,
                isValid: true,
                isDirty: true,
                returnID: null,
              };
              this.saveData.emit(this.outputModel);
            }
          );
      } else {
        this.outputModel = {
          submitResult: true,
          formValue: this.dataSource,
          isValid: true,
          isDirty: true,
          returnID: returnID,
        };
        this.saveData.emit(this.outputModel);
      }
    } catch (ex) {
      return false;
    }
    return false;
  }

  private buildEditedItem() {
    if (!this.isPostageCosts || !this.itemsEdited) return;
    const editedItemLength = this.itemsEdited.length;
    for (let i = 0; i < editedItemLength; i++) {
      this.itemsEdited.splice(0, 1);
    }
    this.gridOptions.rowData.forEach((item) => {
      this.itemsEdited.push(item);
    });
  }

  /**
   * prepareSubmitCreateData
   */
  private prepareSubmitCreateData() {
    const items: Array<any> = this.itemsEdited;
    const campaignWizardCountriesT2s: Array<any> = [];
    let payments: Array<any> = [];
    let currencies: Array<any> = [];
    items.forEach((item) => {
      campaignWizardCountriesT2s.push(
        this.buildCampaignWizardCountriesT2sData(item)
      );
      payments = payments.concat(this.buildPaymentsData(item));
      currencies = currencies.concat(this.buildCurrenciesData(item));
    });
    return {
      CampaignWizardCountriesT2s: campaignWizardCountriesT2s,
      Currencies: currencies,
      Payments: payments,
    };
  }

  /**
   * buildCampaignWizardCountriesT2sData
   * @param item
   */
  private buildCampaignWizardCountriesT2sData(item) {
    let postageDate: string;
    if (item.PostageDate.value) {
      postageDate = this.uti.formatLocale(
        item.PostageDate.value,
        this.consts.dateFormatInDataBase
      );
      // postageDate = this.uti.formatLocale(item.PostageDate.value, this.globalDateFormat);
    }
    let data = {
      IdSalesCampaignWizardItems: +item.IdSalesCampaignWizardItems.value,
      IdSalesCampaignWizardOffice: +item.IdSalesCampaignWizardOffice.value,
      IdPersonToMandant: +item.IdPersonToMandant.value,
      IdPersonToServiceProvider: +item.IdPersonToServiceProvider.value,
      IdPersonToWarehouse: +item.IdPersonToWarehouse.value,
      IdPersonInterfaceContactAddressGWToShippingAddress:
        +item.IdPersonInterfaceContactAddressGWToShippingAddress.value,
      IdPersonInterfaceContactAddressGWToReturnAddress:
        +item.IdPersonInterfaceContactAddressGWToReturnAddress.value,
      IsWithPlayer: item.WP.value,
      PostageDate: postageDate,
      IsActive: item.IsActive.value,
      PrintQty: item.PrintQty.value,
    };
    if (this.idSalesCampaignWizard && !this.isClone) {
      data['IdSalesCampaignWizard'] = +this.idSalesCampaignWizard;
    }
    return data;
  }

  /**
   * buildCurrenciesData
   */
  private buildCurrenciesData(item) {
    const currencies: Array<any> = [];
    const selectedCurrencyValues: Array<any> = item.Currency.value;
    const originalCurrencyValues: Array<any> = item.Currency.originalValue;

    // Find Update or Add New Currency
    if (selectedCurrencyValues) {
      selectedCurrencyValues.forEach((valObj) => {
        const iRet = originalCurrencyValues.filter((p) => p.key == valObj.key);
        if (iRet.length) {
          currencies.push({
            IdSalesCampaignWizardItems: +item.IdSalesCampaignWizardItems.value,
            IdSalesCampaignWizardItemsCurrency: +valObj.key,
            IsActive: true,
          });
        } else {
          currencies.push({
            IdSalesCampaignWizardItems: +item.IdSalesCampaignWizardItems.value,
            IdCountryCurrency: +valObj.idCountryCurrency,
            IsActive: true,
          });
        }
      });
    }

    // Find Deleted Currency
    if (originalCurrencyValues) {
      originalCurrencyValues.forEach((orgValObj) => {
        if (selectedCurrencyValues) {
          const iRet = selectedCurrencyValues.filter(
            (p) => p.key == orgValObj.key
          );
          if (!iRet.length) {
            currencies.push({
              IdSalesCampaignWizardItems:
                +item.IdSalesCampaignWizardItems.value,
              IdSalesCampaignWizardItemsCurrency: +orgValObj.key,
              IsDeleted: '1',
            });
          }
        } else {
          currencies.push({
            IdSalesCampaignWizardItems: +item.IdSalesCampaignWizardItems.value,
            IdSalesCampaignWizardItemsCurrency: +orgValObj.key,
            IsDeleted: '1',
          });
        }
      });
    }

    return currencies;
  }

  /**
   * buildPaymentsData
   * @param item
   */
  private buildPaymentsData(item): Array<any> {
    const payments: Array<any> = [];
    Object.keys(item).forEach((key) => {
      if (item[key]) {
        const control: ControlBase<any> = item[key] as ControlBase<any>;
        if (control.controlType == 'dynamic') {
          const dynamicControl: DynamicControl = control as DynamicControl;
          if (!dynamicControl.isRawDynamicData) {
            payments.push({
              IdSalesCampaignWizardItems:
                +item.IdSalesCampaignWizardItems.value,
              IdSalesCampaignWizardItemsPayments:
                dynamicControl.value.idSalesCampaignWizardItemsPayments,
              PostageCosts: dynamicControl.value.postageCosts
                ? dynamicControl.value.postageCosts
                : null,
              IsActive: dynamicControl.value.isActive,
            });
          }
        }
      }
    });
    return payments;
  }

  /**
   * buildDatasource
   * @param datasource
   */
  private buildDatasource(datasource: any) {
    let columns: Array<any> = datasource.columns;
    columns = this.setConfigCollumn(columns);
    const dynamicCol = columns.filter((p) => p.controlType == 'dynamic');
    if (dynamicCol.length && datasource.data.length) {
      const dynamicCols = this.buildDynamicHeaderColumn(
        datasource.data[0],
        'DynamicColumn'
      );
      if (dynamicCols && dynamicCols.length) {
        columns = columns.concat(dynamicCols);
      }
      this.buildData(datasource.data, columns, 'DynamicColumn');
    }
    columns = sortBy(columns, function (item) {
      return item.order;
    });
    datasource.columns = columns;
    //datasource.data = new wjcCore.CollectionView(datasource.data);
    //datasource.data.trackChanges = true;
    return datasource;
  }

  /**
   * setConfigCollumn
   * @param columns
   */
  private setConfigCollumn(columns: Array<any>) {
    const configColumn: Array<ControlBase<any>> = [];
    columns.forEach((col) => {
      const defaultConfig: any = {
        key: col.data,
        label: col.title,
        isHidden: false /*Display Default*/,
        readOnly: false /*Edit Mode Default*/,
        align: 'left',
      };

      let control: ControlBase<any>;

      switch (col.data) {
        case 'IdSalesCampaignWizardItems':
          control = new TextboxControl(defaultConfig);
          control.isHidden = true;
          col = control;
          break;

        case 'IdSalesCampaignWizardOffice':
          control = new TextboxControl(defaultConfig);
          control.isHidden = true;
          col = control;
          break;

        case 'Country_DefaultValue':
          control = new TextboxControl(defaultConfig);
          control.readOnly = true;
          control.order = 2;
          col = control;
          break;

        case 'Currency':
          defaultConfig.type = 'multi-select';
          control = new DropdownControl(defaultConfig);
          (control as DropdownControl).identificationKey =
            ComboBoxTypeConstant.currencyByWizardItems;
          control.filterBy = 'IdSalesCampaignWizardItems';
          control.order = 5;
          col = control;
          break;

        case 'DynamicColumn':
          control = new DynamicControl(defaultConfig);
          control.isHidden = true;
          (control as DynamicControl).isRawDynamicData = true;
          control.order = 13;
          col = control;
          break;

        case 'IdPersonInterfaceContactAddressGWToReturnAddress':
          control = new DropdownControl(defaultConfig);
          (control as DropdownControl).identificationKey =
            ComboBoxTypeConstant.campaignWizardAddress;
          control.filterBy = 'IdPersonToMandant';
          control.order = 12;
          col = control;
          break;

        case 'IdPersonInterfaceContactAddressGWToShippingAddress':
          control = new DropdownControl(defaultConfig);
          (control as DropdownControl).identificationKey =
            ComboBoxTypeConstant.campaignWizardAddress;
          control.filterBy = 'IdPersonToMandant';
          control.order = 11;
          col = control;
          break;

        case 'IdPersonToMandant':
          control = new DropdownControl(defaultConfig);
          (control as DropdownControl).identificationKey =
            ComboBoxTypeConstant.allMandant;
          control.order = 8;
          col = control;
          break;

        case 'IdPersonToServiceProvider':
          control = new DropdownControl(defaultConfig);
          (control as DropdownControl).identificationKey =
            ComboBoxTypeConstant.serviceProvider;
          control.order = 9;
          col = control;
          break;

        case 'IdPersonToWarehouse':
          control = new DropdownControl(defaultConfig);
          (control as DropdownControl).identificationKey =
            ComboBoxTypeConstant.wareHouse;
          control.order = 10;
          col = control;
          break;

        case 'IdRepIsoCountryCode':
          control = new TextboxControl(defaultConfig);
          control.isHidden = true;
          col = control;
          break;

        case 'IsActive':
          defaultConfig.align = 'center';
          control = new CheckboxControl(defaultConfig);
          control.order = 1;
          col = control;
          break;

        case 'Language_DefaultValue':
          control = new TextboxControl(defaultConfig);
          control.readOnly = true;
          control.order = 3;
          col = control;
          break;

        case 'PostageDate':
          control = new DateControl(defaultConfig);
          control.order = 7;
          col = control;
          break;

        case 'PrintQty':
          defaultConfig.type = 'number';
          control = new TextboxControl(defaultConfig);
          col = control;
          control.order = 4;
          break;

        case 'WP':
          defaultConfig.align = 'center';
          control = new CheckboxControl(defaultConfig);
          control.order = 6;
          col = control;
          break;
      }
      if (control) {
        configColumn.push(control);
      }
    });
    return configColumn;
  }

  /**
   * buildDynamicHeaderColumn
   * @param dataRow
   * @param key
   */
  private buildDynamicHeaderColumn(dataRow, key): Array<any> {
    const columns: Array<any> = [];

    if (isObject(dataRow[key]) && isEmpty(dataRow[key])) {
      return;
    }

    let dynamicColRaw: string = dataRow[key];

    if (dynamicColRaw) {
      dynamicColRaw = decodeURIComponent(dynamicColRaw);
      const dynamicColObj = JSON.parse(dynamicColRaw);
      if (dynamicColObj && dynamicColObj[Object.keys(dynamicColObj)[0]]) {
        const dynamicCols: Array<any> =
          dynamicColObj[Object.keys(dynamicColObj)[0]];
        for (let i = 0; i < dynamicCols.length; i++) {
          const defaultConfig: any = {
            key: 'dynamic_col_' + i,
            label: dynamicCols[i].LabelTitle,
            isHidden: false /*Display Default*/,
            readOnly: false /*Edit Mode Default*/,
          };
          const control = new DynamicControl(defaultConfig);
          control.order = 14 + i;
          columns.push(control);
        }
      }
    }
    return columns;
  }

  /**
   * buildData
   */
  private buildData(
    data: Array<any>,
    columns: Array<ControlBase<any>>,
    dynamicKey
  ) {
    data.forEach((dataRow) => {
      Object.keys(dataRow).forEach((key) => {
        const col = columns.filter((p) => p.key == key);
        if (col.length) {
          if (isObject(dataRow[key]) && isEmpty(dataRow[key])) {
            dataRow[key] = '';
          }

          if (col[0].controlType == 'checkbox') {
            const val = dataRow[key];
            const checkboxCtrl: CheckboxControl = Object.assign(
              {},
              col[0]
            ) as CheckboxControl;
            checkboxCtrl.value = val ? val : false;
            checkboxCtrl.originalValue = val ? val : false;
            dataRow[key] = checkboxCtrl;
          }
          if (col[0].controlType == 'textbox') {
            const textboxCtrl: TextboxControl = Object.assign(
              {},
              col[0]
            ) as TextboxControl;
            textboxCtrl.value = dataRow[key];
            textboxCtrl.originalValue = dataRow[key];
            dataRow[key] = textboxCtrl;
          }
          if (col[0].controlType == 'dynamic') {
            const dynamicCtrl: DynamicControl = Object.assign(
              {},
              col[0]
            ) as DynamicControl;
            dynamicCtrl.value = dataRow[key];
            dataRow[key] = dynamicCtrl;
          }
          if (col[0].controlType == 'date') {
            const dateCtrl: DateControl = Object.assign(
              {},
              col[0]
            ) as DateControl;
            const date = dataRow[key]
              ? parse(dataRow[key], 'dd.MM.yyyy', new Date())
              : null;
            dateCtrl.value = date;
            dateCtrl.originalValue = date;
            dataRow[key] = dateCtrl;
          }
          if (col[0].controlType == 'dropdown') {
            const dropdownCtrl: DropdownControl = Object.assign(
              {},
              col[0]
            ) as DropdownControl;
            let keyValueObj: Array<any>;
            try {
              keyValueObj = JSON.parse(dataRow[key]);
            } catch (e) {
              keyValueObj = [
                {
                  key: '',
                  value: '',
                },
              ];
            }

            if (!keyValueObj) {
              keyValueObj = [
                {
                  key: '',
                  value: '',
                },
              ];
            }

            if (dropdownCtrl.type == 'multi-select') {
              const values: Array<string> = keyValueObj.map((p) => {
                return p.value;
              });

              const keys: Array<any> = keyValueObj.map((p) => {
                return {
                  idCountryCurrency: p.IdCountryCurrency,
                  key: p.key,
                };
              });

              dropdownCtrl.displayValue = values.join(',');
              dropdownCtrl.value = keys;
              dropdownCtrl.originalValue = keys;
              dataRow[key] = dropdownCtrl;
            } else {
              dropdownCtrl.value = keyValueObj[0].key;
              dropdownCtrl.originalValue = keyValueObj[0].key;
              dropdownCtrl.displayValue = keyValueObj[0].value;
              dataRow[key] = dropdownCtrl;
              const options: Array<any> =
                this.comboBoxData[dropdownCtrl.identificationKey];
              if (options) {
                const option = options.filter(
                  (p) => p.key == keyValueObj[0].key
                );
                if (option.length) {
                  dropdownCtrl.displayValue = option[0].value;
                }
                dropdownCtrl.options =
                  this.comboBoxData[dropdownCtrl.identificationKey];
                dataRow[key] = dropdownCtrl;
              }
            }
          }
        }
      });

      let dynamicColRaw: string = dataRow[dynamicKey].value;
      if (dynamicColRaw) {
        dynamicColRaw = decodeURIComponent(dynamicColRaw);
        const dynamicColObj = JSON.parse(dynamicColRaw);
        if (dynamicColObj && dynamicColObj[Object.keys(dynamicColObj)[0]]) {
          const dynamicCols: Array<any> =
            dynamicColObj[Object.keys(dynamicColObj)[0]];
          for (let i = 0; i < dynamicCols.length; i++) {
            const dynamicCtrl: DynamicControl = Object.assign(
              {},
              dataRow[dynamicKey]
            ) as DynamicControl;
            const value = {
              idSalesCampaignWizardItemsPayments:
                dynamicCols[i].IdSalesCampaignWizardItemsPayments,
              postageCosts: dynamicCols[i].PostageCosts
                ? dynamicCols[i].PostageCosts
                : null,
              isActive: dynamicCols[i].IsActive,
              defaultCosts: dynamicCols[i].DefaultCosts,
            };

            if (this.isPostageCosts && !value.postageCosts) {
              value.postageCosts = value.defaultCosts;
            }

            dynamicCtrl.value = value;
            dynamicCtrl.originalValue = Object.assign({}, value);
            dynamicCtrl.isRawDynamicData = false;
            dataRow['dynamic_col_' + i] = dynamicCtrl;
          }
        }
      }
    });
  }

  /**
   * initDataMap
   */
  private initDataMap(): Observable<any> {
    const keys: Array<number> = [
      ComboBoxTypeConstant.allMandant,
      ComboBoxTypeConstant.serviceProvider,
      ComboBoxTypeConstant.wareHouse,
    ];

    return this.commonService
      .getListComboBox(keys.join(','))
      .map((response: ApiResultResponse) => {
        if (!Uti.isResquestSuccess(response)) {
          return;
        }
        const mandantList = this.getValidCombobox(
          response.item,
          ComboBoxTypeConstant.allMandant
        );
        const serviceProviderList = this.getValidCombobox(
          response.item,
          ComboBoxTypeConstant.serviceProvider
        );
        const wareHouseList = this.getValidCombobox(
          response.item,
          ComboBoxTypeConstant.wareHouse
        );
        this.comboBoxData[ComboBoxTypeConstant.allMandant] = mandantList;
        this.comboBoxData[ComboBoxTypeConstant.serviceProvider] =
          serviceProviderList;
        this.comboBoxData[ComboBoxTypeConstant.wareHouse] = wareHouseList;
        return this.comboBoxData;
      });
  }

  /**
   * onCellEditingStarted
   * @param $event
   */
  public onCellEditingStarted($event) {
    if (!$event.data['IsActive'].value && $event.colDef.colId !== 'IsActive') {
      this.api.stopEditing();
      return;
    }

    const control: ControlBase<any> = $event.value;
    if (control.controlType == 'dropdown' && control.filterBy) {
      const dropdownControl: DropdownControl = control as DropdownControl;
      const id = $event.data[dropdownControl.filterBy].value;
      this.commonServiceSubscription = this.commonService
        .getComboBoxDataByFilter(
          dropdownControl.identificationKey,
          id,
          null,
          true
        )
        .subscribe((response: ApiResultResponse) => {
          this.appErrorHandler.executeAction(() => {
            const comboOptions: Array<any> = this.getValidCombobox(
              response.item,
              dropdownControl.identificationKey,
              id,
              (options) => {
                return options.map((p) => {
                  return {
                    key: +p.idValue,
                    value: p.textValue,
                    idCountryCurrency: +p.idCountryCurrency,
                  };
                });
              }
            );

            if (comboOptions && dropdownControl.type == 'multi-select') {
              if (dropdownControl.value) {
                const keys = dropdownControl.value;
                comboOptions.forEach((option) => {
                  keys.forEach((keyObj) => {
                    if (keyObj.key) {
                      if (option.key == keyObj.key) {
                        option.selected = true;
                      }
                    } else if (
                      option.idCountryCurrency == keyObj.idCountryCurrency
                    ) {
                      option.selected = true;
                    }
                  });
                });
              }
            }
            $event.value.options = comboOptions;
            this.api.updateRowData({ update: [$event.node.data] });
          });
        });
    }
  }

  /**
   * @param listComboBox
   * @param identificationKey
   */
  private getValidCombobox(
    listComboBox: any,
    identificationKey: number,
    filterBy?: string,
    mapFunc?: any
  ) {
    const keys = Object.keys(ComboBoxTypeConstant);
    let idx: string;
    keys.forEach((key) => {
      if (ComboBoxTypeConstant[key] == identificationKey) {
        idx = key;
      }
    });

    let options: Array<any> = listComboBox[idx];
    if (filterBy) options = listComboBox[idx];
    // options = listComboBox[idx + '_' + filterBy];

    if (!options) {
      return null;
    }

    let rs: any;
    if (mapFunc) {
      rs = mapFunc(options);
    } else {
      rs = options.map((p) => {
        return {
          key: +p.idValue,
          value: p.textValue,
        };
      });
    }
    return rs;
  }

  //beginningEdit($event) {
  //    const colIndex = $event.col;
  //    const col: wjcGrid.Column = this.flex.columns[colIndex];

  //    if (!this.flex.itemsSource.currentItem['IsActive'].value && col.binding != 'IsActive') {
  //        $event.cancel = true;
  //        return;
  //    }

  //    const control: ControlBase<any> = this.flex.itemsSource.currentItem[col.binding];
  //    if (control.controlType == 'dropdown' && control.filterBy) {
  //        const dropdownControl: DropdownControl = control as DropdownControl;
  //        const id = this.flex.itemsSource.currentItem[dropdownControl.filterBy].value;
  //        this.commonServiceSubscription = this.commonService.getComboBoxDataByFilter(dropdownControl.identificationKey, id)
  //            .subscribe((response: ApiResultResponse) => {
  //                this.appErrorHandler.executeAction(() => {
  //                    const comboOptions: Array<any> = this.getValidCombobox(response.item, dropdownControl.identificationKey, id, (options) => {
  //                        return options.map(p => {
  //                            return {
  //                                key: +p.idValue,
  //                                value: p.textValue,
  //                                idCountryCurrency: +p.idCountryCurrency
  //                            }
  //                        });
  //                    });

  //                    if (comboOptions && dropdownControl.type == 'multi-select') {
  //                        if (dropdownControl.value) {
  //                            const keys = dropdownControl.value;
  //                            comboOptions.forEach(option => {
  //                                keys.forEach(keyObj => {
  //                                    if (keyObj.key) {
  //                                        if (option.key == keyObj.key) {
  //                                            option.selected = true;
  //                                        }
  //                                    } else if (option.idCountryCurrency == keyObj.idCountryCurrency) {
  //                                        option.selected = true;
  //                                    }
  //                                });
  //                            });
  //                        }
  //                    }
  //                    this.flex.itemsSource.currentItem[col.binding].options = comboOptions;
  //                });
  //            });
  //    }
  //}

  /**
   * onCheckedItemsChanged
   * @param cell
   * @param multisel
   */
  onCheckedItemsChanged(cell, multisel) {
    const checkedItems: Array<any> = multisel.checkedItems;
    const dropdownControl: DropdownControl = cell;
    if (checkedItems.length) {
      const s: Array<string> = checkedItems.map((p) => {
        return p.value;
      });

      const keys: Array<any> = checkedItems.map((p) => {
        return {
          idCountryCurrency: p.idCountryCurrency,
          key: p.key,
        };
      });

      dropdownControl.displayValue = s.join(',');
      dropdownControl.value = keys;
    } else {
      dropdownControl.displayValue = '';
      dropdownControl.value = '';
    }
  }

  /**
   * onSelectedIndexChanged
   * @param cell
   */
  onSelectedIndexChanged(cell) {
    const dropdownControl: DropdownControl = cell;
    if (dropdownControl.options && dropdownControl.options.length) {
      const option = dropdownControl.options.filter(
        (p) => p.key == dropdownControl.value
      );
      if (option.length) {
        dropdownControl.displayValue = option[0].value;
      }
    }
  }

  /**
   * viewPostageCost
   */
  viewPostageCost() {
    this.isShowPostageCostItem = !this.isShowPostageCostItem;
    const dynamicCols: Array<any> = this.gridOptions.columnDefs.filter(
      (col: ColDef) =>
        col.refData.controlType == 'dynamic' && col.field != 'DynamicColumn'
    );
    if (dynamicCols.length) {
      const cols = dynamicCols.map((p) => p.field);
      setTimeout(() => {
        if (this.columnApi) {
          if (this.isShowPostageCostItem) {
            this.columnApi.setColumnsVisible(cols, true);
          } else {
            this.columnApi.setColumnsVisible(cols, false);
          }
        }
      });
      //dynamicCols.forEach(col => {
      //    col.isHidden = !this.isShowPostageCostItem;
      //});
    }
    setTimeout(() => {
      if (this.api) {
        if (this.isShowPostageCostItem) {
          this.columnApi.autoSizeAllColumns();
        } else {
          this.api.sizeColumnsToFit();
        }
      }
    });
  }

  private _resizingColumnHandler() {
    if (this.api) {
      this.columnApi.autoSizeAllColumns();
    }

    //for (let i = 0; i < this.flex.columns.length; i++) {
    //    if (this.flex.columns[i]['binding'] === 'deleted' ||
    //        this.flex.columns[i]['binding'] === 'download' ||
    //        this.flex.columns[i]['binding'] === 'mediaCodeButton') {
    //        continue;
    //    } else {
    //        this.flex.columns[i].width = null;
    //        if (!this.isShowPostageCostItem) {
    //            this.flex.columns[i].width = '*';
    //        }
    //    }
    //}
  }

  /**
   * reload
   */
  reload() {
    this.loadData();
  }

  private setOutputData(submitResult: any, data?: any) {
    if (typeof data !== 'undefined') {
      this.outputModel = data;
    } else {
      this.outputModel = {
        submitResult: false,
        formValue: this.dataSource,
        isValid: true,
        isDirty: true,
        returnID: this.idSalesCampaignWizard,
      };
    }
    this.outputData.emit(this.outputModel);
  }

  /**
   * numberKeyPress
   * @param evt
   */
  public numberKeyPress(evt) {
    if (evt.which < 48 || evt.which > 57) {
      evt.preventDefault();
    }
  }

  public updatedLayoutHandler(evt) {
    clearTimeout(this.updatedLayoutHandlerTimer);
    this.updatedLayoutHandlerTimer = setTimeout(
      this.addPerfectScrollbar.bind(this),
      this.updatedLayoutHandlerInterval
    );
  }

  /**
   * translate
   */
  public translate() {
    this.campaignService
      .getCampaignWizardT2(this.idSalesCampaignWizard, '-1')
      .subscribe((rs) => {
        this.appErrorHandler.executeAction(() => {
          if (!rs) return;
          if (rs.collectionData && rs.collectionData.length) {
            rs.collectionData[0].Currency = this.parseJsonValue(
              rs.collectionData[0].Currency
            );
            rs.collectionData[0].IdPersonToMandant = this.parseJsonValue(
              rs.collectionData[0].IdPersonToMandant
            );
            rs.collectionData[0].IdPersonToServiceProvider =
              this.parseJsonValue(
                rs.collectionData[0].IdPersonToServiceProvider
              );
            rs.collectionData[0].IdPersonToWarehouse = this.parseJsonValue(
              rs.collectionData[0].IdPersonToWarehouse
            );
            rs.collectionData = [rs.collectionData[0]];
          }
          this.campaignT2RawData = rs;
          this.widgetModuleInfoTranslationComponent.showDialog = true;
        });
      });
  }

  /**
   * parseJsonValue
   * @param jsonString
   */
  private parseJsonValue(jsonString) {
    try {
      return JSON.parse(jsonString)[0].value;
    } catch {
      return '';
    }
  }

  /**
   * onHiddenWidgetInfoTranslation
   */
  public onHiddenWidgetInfoTranslation(event) {
    if (event && event.isUpdated) {
      this.getCampaignWizardT2();
    }
  }

  formatDate(data: any, formatPattern: string) {
    const result = !data
      ? ''
      : this.uti.formatLocale(new Date(data), formatPattern);
    return result;
  }

  /**
   * boolFormatter
   * @param params
   */
  public boolFormatter(params) {
    try {
      let control: ControlBase<any> = params.value;
      if (
        control.value == 'True' ||
        control.value == 'true' ||
        control.value == true ||
        control.value == 1
      ) {
        control.value = true;
      } else {
        control.value = false;
      }
    } catch {}
    return params.value;
  }
}
