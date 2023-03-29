import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ControlGridModel, AutoGroupColumnDefModel } from 'app/models';
import {
  ColDef,
  CellClassParams,
  TooltipParams,
  GridOptions,
} from 'ag-grid-community';
import {
  DatatableService,
  AccessRightsService,
  PropertyPanelService,
} from 'app/services';
import {
  CheckboxReadOnlyCellRenderer,
  CheckboxEditableCellRenderer,
  DropdownCellRenderer,
  CheckboxHeaderCellRenderer,
  DeleteCheckboxHeaderCellRenderer,
  NumericEditableCellRenderer,
  TemplateButtonCellRenderer,
  CountryFlagCellRenderer,
  IconCellRenderer,
  DateCellRenderer,
  ControlCheckboxCellRenderer,
  CreditCardCellRenderer,
  SelectAllCheckboxHeaderCellRenderer,
  ButtonAndCheckboxCellRenderer,
  RefTextboxCellRenderer,
  MasterUnmergeCheckboxCellRenderer,
  PriorityDropdownCellRenderer,
  AutoCompleteCellRenderer,
} from '../components';
import { ColHeaderKey, GridLocale } from './ag-grid-constant';
import isObject from 'lodash-es/isObject';
import toNumber from 'lodash-es/toNumber';
import isNil from 'lodash-es/isNil';
import { parse, compareAsc } from 'date-fns/esm';

import { Uti } from 'app/utilities';
import {
  AccessRightTypeEnum,
  ArticlesInvoiceQuantity,
} from 'app/app.constants';
import { CustomHeaderCellRenderer } from 'app/shared/components/xn-control/xn-ag-grid/components/header-cell-renderer/custom-header-cell-renderer/custom-header-cell-renderer.component';
import { QuantityKeepRendererComponent } from '../components/quantity-keep-renderer/quantity-keep-renderer.component';
import { QuantityBackToWareHouseRendererComponent } from '../components/quantity-back-to-ware-house-renderer/quantity-back-to-ware-house-renderer.component';
import { QuantityDefectRendererComponent } from '../components/quantity-defect-renderer/quantity-defect-renderer.component';

/**
 * GridConfig
 */
export interface IAgGridData {
  columnDefs: Array<ColDef>;
  rowData: Array<any>;
  enabledServerSideDatasource?: boolean;
  funcGetData?: any;
}

@Injectable()
export class AgGridService {
  constructor(
    private datatableService: DatatableService,
    private accessRightService: AccessRightsService,
    private propertyPanelService: PropertyPanelService,
    private translateService: TranslateService,
    private uti: Uti
  ) {}

  /**
   * mapDataSource
   * @param controlGridModel
   */
  public mapDataSource(
    controlGridModel: ControlGridModel,
    config
  ): IAgGridData {
    const dataSource: IAgGridData = {
      rowData: [],
      columnDefs: [],
    };
    try {
      if (!controlGridModel || !controlGridModel.columns) {
        return dataSource;
      }

      const statusCol = controlGridModel.columns.find(
        (p) => p.data == ColHeaderKey.BorderStatus
      );

      if (config.masterDetail) {
        dataSource.columnDefs.push(this.createMasterDetailGroupCol());
      }

      if (statusCol) {
        dataSource.columnDefs.push({
          lockPosition: true,
          cellClass: 'status-header-col',
          width: 38,
          maxWidth: 38,
          suppressMenu: true,
          suppressSorting: true,
          suppressNavigable: true,
          suppressToolPanel: true,
          suppressResize: true,
          suppressSizeToFit: true,
          suppressAutoSize: true,
          cellRenderer: function (params) {
            if (
              params.node.data &&
              (params.node.data[ColHeaderKey.BorderStatus] == true ||
                params.node.data[ColHeaderKey.BorderStatus] == 1 ||
                params.node.data[ColHeaderKey.BorderStatus] == 'true')
            ) {
              return '<i class="fa fa-exclamation-circle background-status-red" style="font-size:medium;"></i>';
            }
            return '';
          },
        });
      }

      if (config.hasRowColCheckAll && controlGridModel.columns) {
        controlGridModel.columns.splice(0, 0, {
          data: 'rowColCheckAll',
          readOnly: false,
          title: 'Check All',
          visible: false,
          setting: {},
        });
      }

      controlGridModel = this.datatableService.buildWijmoDataSource(
        controlGridModel,
        null,
        { isFormatMediaSize: true, treeViewMode: config.treeViewMode }
      );

      controlGridModel.columns.forEach((col) => {
        const readOnlyFromConfig = config.readOnly || col.readOnly;
        const disableRowByValue =
          this.datatableService.getDisableRowByValue(col);
        let colDef: ColDef = {
          headerName: col.title,
          field: col.data,
          colId: col.data,
          editable: this.buildEditable.bind(this, col.readOnly),
          hide: !col.visible,
          headerClass: !col.readOnly ? 'editable-col' : '',
          headerComponentFramework: CustomHeaderCellRenderer,
          suppressToolPanel: !col.visible,
          enableRowGroup: true,
          refData: {
            setting: col.setting,
            controlType: col.controlType,
            disableRowByValue: disableRowByValue,
          },
          cellClassRules: {
            'invalid-cell': this.cellValidation.bind(this),
            'positive-qty': this.quantityCellWithColor.bind(this, true),
            'negative-qty': this.quantityCellWithColor.bind(this, false),
            'in-active-cell': this.inActiveCellClassRules.bind(this),
          },
          headerTooltip: col.title,
          tooltip: this.buildTooltip.bind(this),
          cellStyle: this.buildCellStyle.bind(this, col),
          filter: 'agTextColumnFilter',
        };

        if (colDef.hide) {
          // Return empty to ignore quick search
          colDef.getQuickFilterText = function (params) {
            return '';
          };
        }
        if (col.setting && col.setting.width) {
          colDef.width = col.setting.width;
        }
        if (col.data == 'MediaSize') {
          col.controlType = '';
          col.setting.DataLength = '255';
          col.setting.DataType = 'nvarchar';
        }
        switch (col.controlType.toLowerCase()) {
          case 'checkbox':
            // Read-only
            if (readOnlyFromConfig) {
              colDef = Object.assign(colDef, {
                cellRendererFramework: CheckboxReadOnlyCellRenderer,
              });
            } else {
              if (
                col.data == ColHeaderKey.MasterCheckbox ||
                col.data == ColHeaderKey.UnMergeCheckbox
              ) {
                colDef = Object.assign(colDef, {
                  cellRendererFramework: MasterUnmergeCheckboxCellRenderer,
                  editable: false,
                });
              } else {
                colDef = Object.assign(colDef, {
                  cellRendererFramework: CheckboxEditableCellRenderer,
                  headerComponentFramework: CheckboxHeaderCellRenderer,
                  editable: false,
                  suppressSorting: true,
                });
              }
            }
            // colDef.maxWidth = 100;
            colDef.minWidth = colDef.width || 100;
            colDef.width = colDef.width || 100;
            colDef.valueFormatter = this.boolFormatter.bind(this);
            dataSource.columnDefs.push(colDef);
            break;

          case 'buttonandcheckbox':
            colDef = Object.assign(colDef, {
              cellRendererFramework: ButtonAndCheckboxCellRenderer,
              // headerComponentFramework: ButtonAndCheckboxHeaderCellRenderer,
              // suppressToolPanel: true,
              editable: false,
            });
            // colDef.maxWidth = 100;
            colDef.minWidth = colDef.width || 100;
            colDef.width = colDef.width || 100;
            colDef.valueFormatter = this.boolFormatter.bind(this);
            dataSource.columnDefs.push(colDef);
            break;
          case 'combobox':
            colDef = Object.assign(colDef, {
              cellRendererFramework: DropdownCellRenderer,
              cellEditorFramework: DropdownCellRenderer,
              comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                if (
                  isObject(valueA) &&
                  isObject(valueB) &&
                  !isNil(valueA.key) &&
                  !isNil(valueB.key)
                ) {
                  return ('' + valueA.value).localeCompare(valueB.value);
                }

                return false;
              },
            });

            dataSource.columnDefs.push(colDef);
            break;

          case 'priority':
            colDef = Object.assign(colDef, {
              cellRendererFramework: PriorityDropdownCellRenderer,
              cellEditorFramework: PriorityDropdownCellRenderer,
              comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                if (
                  isObject(valueA) &&
                  isObject(valueB) &&
                  !isNil(valueA.key) &&
                  !isNil(valueB.key)
                ) {
                  return ('' + valueA.value).localeCompare(valueB.value);
                }

                return false;
              },
            });
            dataSource.columnDefs.push(colDef);
            break;

          case 'reftextbox':
            colDef = Object.assign(colDef, {
              cellRendererFramework: RefTextboxCellRenderer,
              cellEditorFramework: RefTextboxCellRenderer,
            });
            dataSource.columnDefs.push(colDef);
            break;

          case 'numeric':
            {
              const colNameLowerCase = col.data.toLowerCase();

              if (colNameLowerCase === 'qtykeep') {
                colDef = Object.assign(colDef, {
                  cellRendererFramework: QuantityKeepRendererComponent,
                  editable: false,
                  minWidth: 100,
                });
                return dataSource.columnDefs.push(colDef);
              }
              if (colNameLowerCase === 'qtybacktowarehouse') {
                colDef = Object.assign(colDef, {
                  cellRendererFramework:
                    QuantityBackToWareHouseRendererComponent,
                  valueFormatter: this.numericFormatter.bind(this),
                  editable: false,
                  minWidth: 100,
                });
                return dataSource.columnDefs.push(colDef);
              }
              if (colNameLowerCase === 'qtydefect') {
                colDef = Object.assign(colDef, {
                  cellRendererFramework: QuantityDefectRendererComponent,
                  valueFormatter: this.numericFormatter.bind(this),
                  editable: false,
                  minWidth: 100,
                });
                return dataSource.columnDefs.push(colDef);
              }
              colDef = Object.assign(colDef, {
                cellEditorFramework: NumericEditableCellRenderer,
                cellClass: 'text-right',
                valueFormatter: this.numericFormatter.bind(this),
                refData: {
                  setting: col.setting,
                  controlType: col.controlType,
                  allowNumberSeparator: this.allowNumberSeparator(col),
                },
                enableValue: true,
              });
              dataSource.columnDefs.push(colDef);
            }
            break;
          case 'button':
            colDef = Object.assign(colDef, {
              cellRendererFramework: TemplateButtonCellRenderer,
              editable: false,
              cellRendererParams: {
                mode: this.getColButtonMode(col),
              },
              width: colDef.width || 100,
              maxWidth: colDef.width || 100,
              minWidth: colDef.width || 100,
              hide: this.buildButtonColumnHideFromAccessRight(col),
            });
            dataSource.columnDefs.push(colDef);
            break;

          case 'countryflag':
            colDef = Object.assign(colDef, {
              cellRendererFramework: CountryFlagCellRenderer,
              editable: false,
              autoHeight: true,
            });
            dataSource.columnDefs.push(colDef);
            break;
          case 'icon':
            colDef = Object.assign(colDef, {
              cellRendererFramework: IconCellRenderer,
              editable: false,
              tooltip: '',
            });
            dataSource.columnDefs.push(colDef);
            break;

          case 'date':
          case 'datetimepicker':
            colDef = Object.assign(colDef, {
              cellEditorFramework: DateCellRenderer,
              valueFormatter: this.dateFormatter.bind(this),
              comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                if (
                  valueA &&
                  typeof valueA === 'string' &&
                  valueA.indexOf('/') !== -1 &&
                  valueB &&
                  typeof valueB === 'string' &&
                  valueB.indexOf('/') !== -1
                ) {
                  let aDateObj = parse(valueA, 'MM/dd/yyyy', new Date());
                  let bDateObj = parse(valueB, 'MM/dd/yyyy', new Date());

                  if (
                    !(aDateObj instanceof Date && !isNaN(aDateObj.getTime()))
                  ) {
                    aDateObj = new Date(valueA);
                  }
                  if (
                    !(bDateObj instanceof Date && !isNaN(bDateObj.getTime()))
                  ) {
                    bDateObj = new Date(valueB);
                  }

                  if (
                    aDateObj instanceof Date &&
                    !isNaN(aDateObj.getTime()) &&
                    bDateObj instanceof Date &&
                    !isNaN(bDateObj.getTime())
                  ) {
                    return compareAsc(aDateObj, bDateObj);
                  }
                } else if (valueA instanceof Date && valueB instanceof Date) {
                  return compareAsc(valueA, valueB);
                }

                return false;
              },
            });
            dataSource.columnDefs.push(colDef);
            break;

          case 'textarea':
            colDef = Object.assign(colDef, {
              cellEditor: 'agLargeTextCellEditor',
            });
            dataSource.columnDefs.push(colDef);
            break;

          case 'creditcard':
            colDef = Object.assign(colDef, {
              cellRendererFramework: CreditCardCellRenderer,
              editable: false,
            });
            dataSource.columnDefs.push(colDef);
            break;

          case 'autocomplete':
            colDef = Object.assign(colDef, {
              cellRendererFramework: AutoCompleteCellRenderer,
              cellEditorFramework: AutoCompleteCellRenderer,
              refData: {
                setting: col.setting,
                controlType: col.controlType,
              },
              enableValue: true,
              comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                if (
                  isObject(valueA) &&
                  isObject(valueB) &&
                  !isNil(valueA.key) &&
                  !isNil(valueB.key)
                ) {
                  return ('' + valueA.value).localeCompare(valueB.value);
                }

                return false;
              },
            });
            dataSource.columnDefs.push(colDef);
            break;

          default:
            colDef.cellRenderer = this.cellRendererHandle.bind(this);
            dataSource.columnDefs.push(colDef);
            break;
        }
      }); //for columns

      if (config.allowDelete) {
        dataSource.columnDefs.push({
          field: ColHeaderKey.Delete,
          headerClass: 'editable-col',
          cellClass: 'text-center',
          cellRendererFramework: ControlCheckboxCellRenderer,
          editable: false,
          suppressToolPanel: true,
          suppressSorting: true,
          headerComponentFramework: DeleteCheckboxHeaderCellRenderer,
          width: 100,
          minWidth: 100,
        });
      }

      if (config.allowSelectAll) {
        dataSource.columnDefs.push({
          field: ColHeaderKey.SelectAll,
          headerClass: 'editable-col',
          cellClass: 'text-center',
          cellRendererFramework: ControlCheckboxCellRenderer,
          editable: false,
          suppressToolPanel: true,
          suppressSorting: true,
          headerComponentFramework: SelectAllCheckboxHeaderCellRenderer,
          width: 100,
          minWidth: 100,
        });
      }

      if (config.allowMediaCode) {
        dataSource.columnDefs.push({
          field: ColHeaderKey.Mediacode,
          headerName: 'Mediacode price',
          headerClass: 'editable-col',
          cellClass: 'text-center',
          cellRendererFramework: TemplateButtonCellRenderer,
          editable: false,
          cellRendererParams: {
            mode: 'Mediacode',
          },
        });
      }

      const enabledServerSideDatasource = this.isEnabledServerSideDatasource(
        controlGridModel.idSettingsGUI
      );
      if (config.treeViewMode && !enabledServerSideDatasource) {
        this.buildTreeData(controlGridModel);
      }

      //if (config.allowTranslation) {
      //    const languages = ['English', 'German', 'Italy', 'French'];
      //    languages.forEach(language => {
      //        dataSource.columnDefs.push(this.createLanguageTranslationCol(language));
      //    });
      //}

      dataSource.rowData = controlGridModel.data;
      dataSource.enabledServerSideDatasource = enabledServerSideDatasource;
      dataSource.funcGetData = controlGridModel.funcGetData;
    } catch (e) {
      console.log(e);
    }
    return dataSource;
  }

  private isEnabledServerSideDatasource(idSettingsGUI?: number) {
    return idSettingsGUI === 2; //!Customer
  }

  public buildAutoGroupColumnDefForModules(
    model: ControlGridModel,
    gridOptions: GridOptions
  ) {
    //Customer
    if (model.idSettingsGUI === 2) {
      //choose Server-Side Row Model
      gridOptions.rowModelType = 'serverSide';
      gridOptions.enableFilter = false;
      //indicate if row is a group node
      gridOptions.isServerSideGroup = function (dataItem) {
        return dataItem.MatchingText == 'Master';
      };

      //specify which group key to use
      gridOptions.getServerSideGroupKey = function (dataItem) {
        return dataItem.IdPerson;
      };

      model.autoGroupColumnDef = new AutoGroupColumnDefModel({
        headerName: 'Id Person',
        width: 35,
        isFitColumn: true,
      });
    }
  }

  private createMasterDetailGroupCol(): ColDef {
    return {
      field: 'MasterDetailColumn',
      lockPosition: true,
      headerName: '',
      cellClass: 'status-header-col master-detail-col',
      maxWidth: 30,
      suppressMenu: true,
      suppressSorting: true,
      suppressNavigable: true,
      suppressToolPanel: true,
      suppressResize: true,
      suppressSizeToFit: true,
      suppressAutoSize: true,
      valueGetter: 'node.rowIndex',
      cellRenderer: 'agGroupCellRenderer',
      pinnedRowCellRenderer: function (params) {
        return '';
      },
      pinned: 'left',
    };
  }

  private createLanguageTranslationCol(languageName): ColDef {
    return {
      field: languageName,
      lockPosition: true,
      headerName: languageName,
      pinned: 'right',
    };
  }

  /**
   * buildRowClickData
   * @param selectedRow
   */
  public buildRowClickData(selectedRow) {
    const result = [];
    for (const propName in selectedRow) {
      if (propName) {
        result.push({
          key: propName,
          value: selectedRow[propName],
        });
      }
    }
    return result;
  }

  /**
   * getColButtonMode
   * @param settingCol
   */
  protected getColButtonMode(settingCol: any) {
    let mode = '';
    if (settingCol) {
      mode = this.datatableService.getControlTypeValue(settingCol);

      if (!mode && settingCol.controlType === 'Button') {
        mode = settingCol.data;
      }
    }
    return mode;
  }

  /**
   * numericFormatter
   * @param params
   */
  public numericFormatter(params) {
    try {
      if (
        params &&
        params.value != null &&
        params.colDef &&
        params.colDef.refData &&
        params.colDef.refData.setting &&
        params.colDef.refData.setting.DataType === 'money'
      ) {
        return params.value.toFixed(2);
      }

      const globalNumberFormat =
        params.context.componentParent.globalNumberFormat;
      const allowNumberSeparator = params.colDef.refData.allowNumberSeparator;
      if (allowNumberSeparator) {
        if (globalNumberFormat == 'N') {
          return params.value
            ? params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : null;
        }
      }
    } catch {}
    return params.value;
  }

  /**
   * boolFormatter
   * @param params
   */
  public boolFormatter(params) {
    try {
      if (
        params.value == 'True' ||
        params.value == 'true' ||
        params.value == true ||
        params.value == 1
      ) {
        params.value = true;
      } else if (
        params.value == 'False' ||
        params.value == 'false' ||
        params.value == false ||
        params.value == 0
      ) {
        params.value = false;
      }
    } catch {}
    return params.value;
  }

  /**
   * dateFormatter
   * @param params
   */
  public dateFormatter(params) {
    try {
      const colDef = params.column.getColDef();
      colDef.refData.format = this.getDateFormat(
        params,
        params.context.componentParent.globalDateFormat
      );
      return !params.value
        ? ''
        : this.uti.formatLocale(
            new Date(params.value),
            this.getDateFormat(
              params,
              params.context.componentParent.globalDateFormat
            )
          );
    } catch {}
    return params.value;
  }

  public getDateFormat(params, globalDateFormat) {
    const colDef = params.column.getColDef();
    let isDOB = this.datatableService.hasDisplayField(colDef.refData, 'IsDOB');
    if (!isDOB) {
      return globalDateFormat;
    }

    if (!params.data.hasOwnProperty('IsoCode')) {
      return globalDateFormat;
    }

    let DOBFormatByCountryProp = this.propertyPanelService.getItemRecursive(
      params.context.componentParent.globalProps,
      'DOBFormatByCountry'
    );
    if (!DOBFormatByCountryProp || !DOBFormatByCountryProp.value) {
      return globalDateFormat;
    }

    return Uti.getDateFormatFromIsoCode(params.data.IsoCode);
  }

  /**
   * allowNumberSeparator
   * @param settingCol
   */
  protected allowNumberSeparator(settingCol) {
    let allowNumberSeparator = true;
    try {
      if (this.datatableService.hasControlType(settingCol)) {
        const controlType = this.datatableService.getSettingContainsControlType(
          settingCol.setting.Setting
        ).ControlType;
        return !controlType.AllowNumberSeparator
          ? true
          : controlType.AllowNumberSeparator;
      }
    } catch {}
    return true;
  }

  private cellRendererHandle(params: any) {
    // process for hightlightKeywords
    if (params.context.componentParent.hightlightKeywords)
      return this.highLightKeyWord(params);

    // default return this value
    return params.value;
  }

  private highLightKeyWord(params): any {
    if (!params.value) return params.value;

    let hightlightKeywords = (
      params.context.componentParent.hightlightKeywords + ''
    ).trim();
    let content = params.value;
    if (
      (hightlightKeywords &&
        hightlightKeywords !== '*' &&
        typeof content === 'string') ||
      content instanceof String
    ) {
      //return this.highLightText(params.value, hightlightKeywords)
      //hight,light
      const arrKeywords = hightlightKeywords.split(/[,+]/);
      for (var i = 0, length = arrKeywords.length; i < length; i++) {
        const keywords = arrKeywords[i].trim();
        if (keywords) {
          content = this.highLightText(content, keywords);
        }
      } //for
      content = content.replace(
        /s____s/g,
        '<span class="hight-light__keyword">'
      );
      content = content.replace(/e____e/g, '</span>');
      return content;
    }
    return params.value;
  }

  private highLightText(content, hightlightKeywords): any {
    hightlightKeywords = hightlightKeywords.split('*').join('');

    let regTxt;
    hightlightKeywords = hightlightKeywords.replace(/\?|\+|\%|\>|\<|\$|/g, '');

    if (/ or | and | [&] |[&]| [|] |[|]/i.test(hightlightKeywords)) {
      hightlightKeywords = hightlightKeywords.replace(
        /OR|AND|&|\|/gi,
        function (matched) {
          return '|';
        }
      );
      hightlightKeywords = hightlightKeywords.replace(/ +/g, '');
    } else {
      hightlightKeywords = hightlightKeywords.replace(/ +/g, '|');
    }
    if (/ [&&] |[&&]| [||] |[||]|/i.test(hightlightKeywords)) {
      hightlightKeywords = hightlightKeywords.replace(
        /&&|\|\|/gi,
        function (matched) {
          return '|';
        }
      );
      hightlightKeywords = hightlightKeywords.replace(/ +/g, '');
    } else {
      hightlightKeywords = hightlightKeywords.replace(/ +/g, '|');
    }
    regTxt = new RegExp(hightlightKeywords, 'gi');
    let result = content.replace(regTxt, function (str) {
      //return '<span class="hight-light__keyword">' + str + '</span>';
      return 's____s' + str + 'e____e';
    });
    return result;
  }

  protected cellValidation(cellClassParams: CellClassParams): boolean {
    if (cellClassParams.context.componentParent.isArticleInvoiceHasError) {
      return this.quantityArticleInvoice(cellClassParams);
    }
    if (
      cellClassParams.node.rowPinned === 'bottom' ||
      cellClassParams.node.rowPinned === 'top'
    ) {
      //Ignore total row
      return false;
    }

    if (cellClassParams.context.componentParent.disabledAll) {
      return false;
    }

    if (!cellClassParams.colDef.editable) {
      return false;
    }

    const column: any =
      cellClassParams &&
      cellClassParams.colDef &&
      cellClassParams.colDef.refData;
    const item = cellClassParams && cellClassParams.data;
    const property = cellClassParams.colDef.field;
    let applyClass = false;
    if (!item) {
      return;
    }

    if (this.datatableService.hasValidation(column, 'IsRequired')) {
      if (
        isNil(item[property]) ||
        item[property] === '' ||
        item[property] === 0 ||
        (typeof item[property] === 'object' && !item[property]['key'])
      ) {
        applyClass = true;
      }
    }

    if (this.datatableService.hasValidation(column, 'RequiredFrom')) {
      let fromFieldName = this.datatableService.getSettingContainsValidation(
        column.setting.Setting
      ).Validation.RequiredFrom;

      if (
        !isNil(item[fromFieldName]) &&
        item[fromFieldName] !== '' &&
        (isNil(item[property]) ||
          item[property] === '' ||
          item[property] === 0 ||
          (typeof item[property] === 'object' && !item[property]['key']))
      ) {
        applyClass = true;
      }
    }

    let compareWithArray: any = { Validation: {} };
    if (
      this.datatableService.hasValidation(
        column,
        'CompareWithArray',
        compareWithArray
      ) &&
      this['isGridRendered']
    ) {
      if (
        compareWithArray['Validation'] &&
        compareWithArray['Validation']['arrayName'] &&
        compareWithArray['Validation']['propertyName'] &&
        item[property]
      ) {
        if (
          this.datatableService[compareWithArray['Validation']['arrayName']] &&
          this.datatableService[compareWithArray['Validation']['arrayName']]
            .length
        ) {
          const _item = this.datatableService[
            compareWithArray['Validation']['arrayName']
          ].find(
            (x) =>
              x[compareWithArray['Validation']['propertyName']] ==
              item[property]
          );
          applyClass = !(
            _item && _item[compareWithArray['Validation']['propertyName']]
          );
        } else {
          applyClass = true;
        }
      }
    }

    if (this.datatableService.hasValidation(column, 'Comparison')) {
      let compareThem = {
        '<=': (x, y) => {
          return x <= y;
        },
        '<': (x, y) => {
          return x < y;
        },
        '=': (x, y) => {
          return x == y;
        },
        '>': (x, y) => {
          return x > y;
        },
        '>=': (x, y) => {
          return x >= y;
        },
      };

      let comparisonRules = this.datatableService.getSettingContainsValidation(
        column.setting.Setting
      ).Validation.Comparison;
      for (let i = 0; i < comparisonRules.length; i++) {
        let leftData = parseFloat(item[property]) || 0.0;
        let rightData = parseFloat(item[comparisonRules[i].With]) || 0.0;
        if (
          compareThem[comparisonRules[i].Operator](leftData, rightData) ===
          false
        ) {
          applyClass = true;
          break;
        }
      }
    }

    if (this.datatableService.hasValidation(column, 'ValidationRange')) {
      if (
        item['ValidationRangeFrom'] &&
        item['ValidationRangeTo'] &&
        !(
          item[property] >= item['ValidationRangeFrom'] &&
          item[property] <= item['ValidationRangeTo']
        )
      ) {
        applyClass = true;
      }
    }

    if (this.datatableService.hasValidation(column, 'IsUniqued')) {
      if (!isNil(item[property]) && item[property] !== '') {
        let uniqueList = cellClassParams.context.componentParent
          .getCurrentNodeItems()
          .filter(
            (x) =>
              !isNil(x[property]) &&
              (x.DT_RowId != item.DT_RowId || x.id != item.id)
          );
        if (uniqueList.length) {
          uniqueList = uniqueList.map((dt) => {
            return dt ? dt.MediaCode.trim() : null;
          });

          if (uniqueList.indexOf(item[property]) !== -1) {
            applyClass = true;
          }
        }
      }
    }

    if (this.datatableService.hasValidation(column)) {
      const regexData =
        this.datatableService.buildWijmoGridValidationExpression(item, column);
      if (regexData && regexData.Regex) {
        const regex = new RegExp(decodeURIComponent(regexData.Regex), 'g');

        if (!regex.test(item[property])) {
          applyClass = true;
        }
      }
    }

    return applyClass;
  }

  private quantityArticleInvoice(cellClassParams: CellClassParams) {
    const item = cellClassParams && cellClassParams.data;
    const property = cellClassParams.colDef.field;
    let applyClass = false;
    if (!item.IsActive) return;
    const sum =
      toNumber(item[ArticlesInvoiceQuantity.QtyKeep]) +
      toNumber(item[ArticlesInvoiceQuantity.QtyBackToWareHouse]) +
      toNumber(item[ArticlesInvoiceQuantity.QtyDefect]);
    if (!sum) return applyClass;
    if (
      property === ArticlesInvoiceQuantity.QtyKeep ||
      property == ArticlesInvoiceQuantity.QtyBackToWareHouse ||
      property === ArticlesInvoiceQuantity.QtyDefect
    ) {
      if (sum > item['Quantity'] || sum < item['Quantity']) {
        applyClass = true;
      }
    }
    return applyClass;
  }

  protected quantityCellWithColor(
    checkPositiveQuantity: boolean,
    cellClassParams: CellClassParams
  ) {
    const enableQtyWithColor =
      cellClassParams.context.componentParent.enableQtyWithColor;
    const property = cellClassParams.colDef.field;
    let applyClass = false;
    if (enableQtyWithColor && property == 'QtyWithColor') {
      const item = cellClassParams.data;
      const value = item[property];
      if (!isNil(value)) {
        if (checkPositiveQuantity && parseInt(value) > 0) {
          applyClass = true;
        }

        if (!checkPositiveQuantity && parseInt(value) < 0) {
          applyClass = true;
        }
      }
    }

    return applyClass;
  }

  protected inActiveCellClassRules(cellClassParams: CellClassParams) {
    let applyClass = false;
    //
    if (
      cellClassParams.context.componentParent.allowSelectAll &&
      cellClassParams.context.componentParent.isDisableRowWithSelectAll &&
      cellClassParams.colDef.field != ColHeaderKey.SelectAll &&
      !cellClassParams.data[ColHeaderKey.SelectAll]
    ) {
      applyClass = true;
    }

    if (cellClassParams.context.componentParent.disabledAll) {
      applyClass = true;
    }

    //if (cellClassParams.colDef.field == ColHeaderKey.UnMergeCheckbox
    //    && (cellClassParams.data[ColHeaderKey.MasterCheckbox] || cellClassParams.context.componentParent.isMasterChecked)) {
    //    applyClass = true;
    //}

    //if (cellClassParams.colDef.field == ColHeaderKey.MasterCheckbox && cellClassParams.context.componentParent.isUnMergeChecked) {
    //    applyClass = true;
    //}

    return applyClass;
  }

  private isRootNode(data: any, parentNodeKeyName: string) {
    return !data[parentNodeKeyName];
  }

  private getParentNode(
    data: any,
    allData: any[],
    parentNodeKeyName: string,
    nodeKeyName: string
  ) {
    return allData.find((x) => x[nodeKeyName] == data[parentNodeKeyName]);
  }

  private buildTooltip(params: TooltipParams) {
    if (!params.data) {
      return null;
    }

    if (params.context.componentParent.customTooltip) {
      return (
        params.context.componentParent.customTooltip.preText +
        params.data[params.context.componentParent.customTooltip.fieldName]
      );
    }

    if (typeof params.data[params.colDef.field] !== 'object') {
      let value = params.valueFormatted ? params.valueFormatted : params.value;
      if (!value) {
        value = params.data[params.colDef.field];
      }
      return value;
    } else if (
      params.data[params.colDef.field] &&
      params.data[params.colDef.field].hasOwnProperty('key')
    ) {
      return params.data[params.colDef.field].value;
    }

    return null;
  }

  private buildCellStyle(col: any, params) {
    let borderRightColor: any = {};
    const gridStyle = params.context.componentParent.gridStyle;
    const gridStyleGlobal = params.context.componentParent._rowBackgroundGlobal;
    const rowBackGroundWidget = params.context.componentParent._rowBackground;
    // Have odd or even Color and Row BackGround turn on in Widget properties
    if (
      gridStyle &&
      gridStyle.rowStyle &&
      gridStyle.rowStyle['border-right'] &&
      rowBackGroundWidget
    ) {
      borderRightColor = {
        'border-right-color': `${gridStyle.rowStyle['border-right']} !important`,
      };
    }
    if (
      gridStyleGlobal &&
      gridStyleGlobal['borderRow'] &&
      !rowBackGroundWidget
    ) {
      borderRightColor = {
        'border-right-color': `${gridStyleGlobal['borderRow']} !important`,
      };
    }
    return col.customStyle || borderRightColor;
  }

  //#region "Tree Grid"

  /**
   * buildTreeData
   * @param controlGridModel
   */
  private buildTreeData(controlGridModel: ControlGridModel) {
    let parentNodeKeyName = this.datatableService.getNodeKeyName(
      controlGridModel.columns,
      true
    );
    let nodeKeyName = this.datatableService.getNodeKeyName(
      controlGridModel.columns
    );
    this.buildTree(controlGridModel.data, null, nodeKeyName, parentNodeKeyName);
    this.buildHierarchyPathTree(controlGridModel.data, null);
    let results = [];
    this.flattenTreeData(controlGridModel.data, results);
    results.forEach((result) => {
      const rs = controlGridModel.data.find((p) => p == result);
      if (!rs) {
        controlGridModel.data.push(result);
      }
    });
  }

  /**
   * buildTree
   * @param tree
   * @param item
   */
  private buildTree(tree, item, idKey, parentIdKey) {
    // If item then have parent
    if (item) {
      for (let i = 0; i < tree.length; i++) {
        // Find the parent
        if (String(tree[i][idKey]) === String(item[parentIdKey])) {
          tree[i].children.push(item);
          break;
        } else this.buildTree(tree[i].children, item, idKey, parentIdKey);
      }
    }
    // If no item then is a root item
    else {
      let idx = 0;
      while (idx < tree.length) {
        if (
          tree[idx][parentIdKey] &&
          tree[idx][idKey] != tree[idx][parentIdKey] &&
          !isObject(tree[idx][parentIdKey])
        )
          this.buildTree(tree, tree.splice(idx, 1)[0], idKey, parentIdKey);
        // if have parent then remove it from the array to relocate it to the right place
        else idx++;
      }
    }
  }

  /**
   * buildHierarchyPathTree
   **/
  private buildHierarchyPathTree(
    treeData: Array<any>,
    orgHierarchyPath: Array<string>
  ) {
    treeData.forEach((data) => {
      const groupName = data.GroupName || data.ModuleName;
      if (!orgHierarchyPath) {
        data[ColHeaderKey.TreeViewPath] = [groupName];
      } else {
        data[ColHeaderKey.TreeViewPath] = orgHierarchyPath.concat([groupName]);
      }
      if (data.children && data.children.length) {
        this.buildHierarchyPathTree(
          data.children,
          data[ColHeaderKey.TreeViewPath]
        );
      }
    });
  }

  /**
   * flattenTreeData
   * @param treeData
   * @param result
   */
  private flattenTreeData(treeData: Array<any>, result: Array<any>) {
    treeData.forEach((data) => {
      result.push(data);
      if (data.children && data.children.length) {
        this.flattenTreeData(data.children, result);
      }
    });
  }

  //#endregion "Tree Grid"

  private buildButtonColumnHideFromAccessRight(col) {
    let accessRight: any;
    switch (col.data) {
      case 'Run':
        accessRight = this.accessRightService.getAccessRight(
          AccessRightTypeEnum.WidgetButton,
          {
            idSettingsGUIParent: 8,
            idSettingsGUI: 39,
            idRepWidgetApp: 122,
            widgetButtonName: 'Run',
          }
        );
        if (accessRight) {
          return !accessRight.read;
        }
        break;

      case 'StartStop':
        accessRight = this.accessRightService.getAccessRight(
          AccessRightTypeEnum.WidgetButton,
          {
            idSettingsGUIParent: 9,
            idSettingsGUI: 40,
            idRepWidgetApp: 129,
            widgetButtonName: 'StartStop',
          }
        );
        if (accessRight) {
          return !accessRight.read;
        }
        break;

      case 'Setting':
        let accessRight1 = this.accessRightService.getAccessRight(
          AccessRightTypeEnum.WidgetButton,
          {
            idSettingsGUIParent: 8,
            idSettingsGUI: 39,
            idRepWidgetApp: 122,
            widgetButtonName: 'Setting',
          }
        );
        let accessRight2 = this.accessRightService.getAccessRight(
          AccessRightTypeEnum.WidgetButton,
          {
            idSettingsGUIParent: 9,
            idSettingsGUI: 40,
            idRepWidgetApp: 129,
            widgetButtonName: 'Setting',
          }
        );
        if (accessRight1 && accessRight2) {
          return !accessRight1.read || !accessRight2.read;
        } else if (accessRight1) {
          return !accessRight1.read;
        } else if (accessRight2) {
          return !accessRight2.read;
        }
        break;
    }

    return col.hide;
  }

  private buildEditable(colReadOnly, params) {
    let deleteStatus: boolean = false;
    const enableDeleteForGrid = !params.context.componentParent.readOnly;
    // Enable delete on this grid, then we will consider the other conditions ...
    if (enableDeleteForGrid) {
      // Allow delete at this column from config
      if (!colReadOnly) {
        deleteStatus = true;
        do {
          const isPrevent =
            params.context.componentParent.preventDefault(params);
          if (isPrevent) {
            deleteStatus = false;
            break;
          }
          // Check if this col depend the other cols.
          // Case 1: There a cell belongs col 'IsEditable' that value == 0 of current row , then we off editable status.
          if (params.node.data[ColHeaderKey.IsEditable] == 0) {
            deleteStatus = false;
            break;
          }
          // Case 2: Check if this cell disabled.
          // Cell disabled by IsActive Column
          const inactiveRowWithIsActive =
            params.node.data &&
            (params.node.data[ColHeaderKey.IsActive] == false ||
              params.node.data[ColHeaderKey.IsActive] == 0 ||
              params.node.data[ColHeaderKey.IsActiveDisableRow] == false ||
              params.node.data[ColHeaderKey.IsActiveDisableRow] == 0);
          if (inactiveRowWithIsActive) {
            deleteStatus = false;
            break;
          }

          let setting = this.inactiveRowByColValueSetting(params);
          // Cell disabled by other setting column
          if (setting.inactiveRowByValueSetting) {
            let ignoreCol;
            if (setting.ignoreCols && setting.ignoreCols.length) {
              if (Array.isArray(setting.ignoreCols)) {
                ignoreCol = setting.ignoreCols.find(
                  (p) => p == params.colDef.field
                );
              }
            }
            if (!ignoreCol) {
              deleteStatus = false;
            }
            break;
          }
        } while (false);
      }
    }
    return deleteStatus;
  }

  public createToolPanelSidebar(supportPivotMode: boolean, parentContext) {
    let toolPanelParams;
    // if (!supportPivotMode)
    {
      toolPanelParams = {
        suppressRowGroups: true,
        suppressValues: true,
        suppressPivots: true,
        suppressPivotMode: true,
      };
    }
    let sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: toolPanelParams,
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
        {
          id: 'translation',
          labelDefault: 'Translation',
          labelKey: 'translation',
          iconKey: 'translation',
          toolPanel: 'translationToolPanelRenderer',
          toolPanelParams: {
            componentParent: parentContext,
          },
        },
      ],
    };
    return sideBar;
  }

  public inactiveRowByColValueSetting(params) {
    let inactiveRowByValueSetting;
    let ignoreCols;
    let result;
    if (params.node && params.node.columnApi) {
      const columns = params.node.columnApi.getAllColumns();
      result = this.inactiveRowByColSetting(columns, params.node);
    }
    return {
      inactiveRowByValueSetting: result
        ? result.inactiveRowByValueSetting
        : null,
      ignoreCols: result ? result.ignoreCols : null,
    };
  }

  /**
   * inactiveRowByColSetting
   * @param columns
   * @param rowNode
   */
  public inactiveRowByColSetting(columns, rowNode) {
    let inactiveRowByValueSetting;
    let ignoreCols;
    if (columns && columns.length) {
      const colSetting = columns.find(
        (p) =>
          p.colDef && p.colDef.refData && p.colDef.refData.disableRowByValue
      );
      if (colSetting && colSetting.colDef && colSetting.colDef.refData) {
        const disableRowByValue = colSetting.colDef.refData.disableRowByValue;
        if (disableRowByValue) {
          ignoreCols = disableRowByValue['IgnoreColumns'];
          const items = (disableRowByValue['Values'] as Array<any>).filter(
            (p) => p == rowNode.data[colSetting.colDef.field]
          );
          if (items && items.length) {
            inactiveRowByValueSetting = true;
          }
        }
      }
    }
    return {
      inactiveRowByValueSetting,
      ignoreCols,
    };
  }

  public createEmptyRowClickData(columns) {
    let result: { key: string; value: any }[] = [];

    columns.forEach((col) => {
      result.push({
        key: col.headerName,
        value: null,
      });
    });

    return result;
  }

  public buildContextMenuForTranslation(contextMenuItems: Array<any>) {
    if (contextMenuItems && contextMenuItems.length) {
      contextMenuItems.forEach((item) => {
        if (isObject(item)) {
          let key = item.key;
          let name: string = item.name;
          if (!key && name) {
            key = name
              .replace(/(<([^>]+)>)/gi, '')
              .trim()
              .replace(/ /g, '_');
          }
          if (key) {
            item.name =
              '<label-translation keyword="' +
              key +
              '">' +
              this.translateService.instant(key, item.params) +
              '</label-translation>'; // this.translateService.instant(key, item.params) + ' <span class="hidden key-translation" keyword="' + key + '"></span>';
          }
          if (item.subMenu && item.subMenu.length) {
            this.buildContextMenuForTranslation(item.subMenu);
          }
        }
      });
    }
  }

  public initLocalText() {
    // let locale = GridLocale;
    const localeKeys = Object.keys(GridLocale);
    let localeText = {};
    localeKeys.forEach((key) => {
      localeText[key] =
        '<label-translation keyword="' +
        key +
        '">' +
        this.translateService.instant(key) +
        '</label-translation>'; //this.translateService.instant(key) + ' <span class="hidden key-translation" keyword="' + key + '"></span>'
    });
    return localeText;
  }
}
