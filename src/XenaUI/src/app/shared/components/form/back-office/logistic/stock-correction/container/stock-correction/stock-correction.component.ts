import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import isNil from 'lodash-es/isNil';
import cloneDeep from 'lodash-es/cloneDeep';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { WjAutoComplete, WjInputNumber } from 'wijmo/wijmo.angular2.input';

import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import {
  AppErrorHandler,
  CommonService,
  StockCorrectionService,
  PropertyPanelService,
  ModalService,
} from 'app/services';
import { Uti } from 'app/utilities';
import { Configuration, FormSaveEvenType } from 'app/app.constants';
import { ApiResultResponse } from 'app/models';
import {
  ProcessDataActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { ControlFocusComponent } from 'app/shared/components/form';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';
import { InputTypeNumber } from 'app/models/input-numeric-type.enum';

const QTY_MODE_NEGATIVE = 1;
const QTY_MODE_POSITIVE = 2;

@Component({
  selector: 'app-stock-correction',
  styleUrls: ['./stock-correction.component.scss'],
  templateUrl: './stock-correction.component.html',
})
export class StockCorrectionComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private data: any;
  @Input() set widgetData(data: any) {
    if (data) {
      this.data = data;
    }
  }
  // TODO: should set 'isEnableBtns' default as false
  private isEnableBtns = false;

  private isSearching = false;
  private radioQuantitySubstract: any;
  private radioQuantityAdd: any;
  private stockCorrectionGridValid: boolean = true;

  public isRenderForm: boolean;
  public listComboBox: any;
  public stockCorrectionForm: FormGroup;
  public qtyMode: number = 2;
  public globalNumberFormat: string = '';
  public quantityTypeNumber = InputTypeNumber.Positive;
  public stockCorrectionDataSource: any = {
    data: [],
    columns: this.createGridColumns(),
  };
  public globalProps: any[] = [];

  private stockCorrectionFormValueChangesSubscription: Subscription;
  private dispatcherSubscription: Subscription;

  @ViewChild('focusControl') focusControl: ControlFocusComponent;
  @ViewChild('searchArticleNumberCtl') searchArticleNumberCtl: WjAutoComplete;
  @ViewChild('reasonCtrl') reasonCtrl: AngularMultiSelect;
  @ViewChild('warehouseCtrl') warehouseCtrl: AngularMultiSelect;
  @ViewChild('wijmoGridComponent') wijmoGridComponent: XnAgGridComponent;
  @ViewChild('currencyCtl') currencyCtl: AngularMultiSelect;
  @ViewChild('vatCtl') vatCtl: AngularMultiSelect;
  @ViewChild('priceCtl') priceCtl: ElementRef;
  @ViewChild('quantityCtl') quantityCtl: ElementRef;

  @Input() set globalProperties(globalProperties: any[]) {
    this.globalProps = globalProperties;
    this.globalNumberFormat =
      this.propertyPanelService.buildGlobalNumberFormatFromProperties(
        globalProperties
      );
  }
  @Input() gridId: string;
  @Output() outputData: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private appErrorHandler: AppErrorHandler,
    private consts: Configuration,
    private comService: CommonService,
    private stockService: StockCorrectionService,
    private propertyPanelService: PropertyPanelService,
    private toasterService: ToasterService,
    private processDataActions: ProcessDataActions,
    private dispatcher: ReducerManagerDispatcher,
    protected router: Router,
    private ref: ChangeDetectorRef,
    private modalService: ModalService
  ) {
    super(router);

    this.searchArticleNr = this.searchArticleNr.bind(this);
  }

  public ngOnInit() {
    this.initForm();
    this.getInitDropdownlistData();
    this.subcribeRequestSaveState();
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  ngAfterViewInit() {
    this.registerUserEvent();
  }

  //#region Init Data
  private getInitDropdownlistData() {
    this.comService
      .getListComboBox('wareHouse,warehouseCorrectionReason')
      .debounceTime(this.consts.valueChangeDeboundTimeDefault)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) return;

          this.listComboBox = response.item;

          this.isRenderForm = true;
        });
      });
  }

  //#endregion

  //#region Form
  private addKeydownKeyForRadioQuantity(radio: any) {
    if (!radio || !radio.length) return;

    radio.keydown(($event) => {
      // case for press substract key (-)
      if ($event.which === 109 || $event.keyCode === 109) {
        this.radioQuantitySubstract.click();
        setTimeout(() => {
          this.quantityCtl.nativeElement.focus();
        });
      }
      // case for press add key (+)
      if ($event.which === 107 || $event.keyCode === 107) {
        this.radioQuantityAdd.click();
        setTimeout(() => {
          this.quantityCtl.nativeElement.focus();
        });
      }
    });
  }

  private registerUserEvent() {
    setTimeout(() => {
      this.radioQuantitySubstract = $('.rd-quantity-substract').find('input');
      this.addKeydownKeyForRadioQuantity(this.radioQuantitySubstract);
      this.radioQuantityAdd = $('.rd-quantity-add').find('input');
      this.addKeydownKeyForRadioQuantity(this.radioQuantityAdd);

      //load
      this.warehouseCtrl.focus();
    }, 1000);
  }

  private setOutputData(data) {
    this.outputData.emit({
      isValid: !!(
        this.wijmoGridComponent &&
        this.stockCorrectionDataSource.data.length &&
        !this.wijmoGridComponent.hasError()
      ),
      isDirty: !!this.stockCorrectionDataSource.data.length,
      submitResult: data.submitResult,
      returnID: data.returnID,
    });
  }

  private subcribeRequestSaveState() {
    this.dispatcherSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.REQUEST_SAVE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.saveData();
        });
      });
  }

  private initForm() {
    this.stockCorrectionForm = this.formBuilder.group({
      warehouse: ['', Validators.required],
      reason: ['', Validators.required],
      articleNr: ['', Validators.required],
      qty: ['', Validators.required],
      notes: '',
      price: '',
      currency: '',
      vat: '',
    });
    this.stockCorrectionForm['submitted'] = false;
    this.stockCorrectionFormValueChangesSubscription =
      this.stockCorrectionForm.valueChanges.subscribe((value) => {
        this.appErrorHandler.executeAction(() => {
          this.checkEnableAddButton();
        });
      });
    this.setOutputData({});
  }

  private resetForm() {
    this.stockCorrectionForm.controls['articleNr'].setValue('');
    this.stockCorrectionForm.controls['price'].setValue('');
    this.stockCorrectionForm.controls['currency'].setValue('');
    this.stockCorrectionForm.controls['vat'].setValue('');
    this.stockCorrectionForm.controls['qty'].setValue('');
    this.stockCorrectionForm.controls['notes'].setValue('');

    this.stockCorrectionForm.markAsPristine();

    this.setValidationForCurrencyAndVAT();
    this.isEnableBtns = false;
    this.stockCorrectionForm['submitted'] = false;
    this.stockCorrectionForm.updateValueAndValidity();
  }

  private reset() {
    this.resetForm();
    this.stockCorrectionDataSource = {
      data: [],
      columns: this.createGridColumns(),
    };
  }

  public submit() {
    this.saveData();
  }

  private saveData() {
    if (!this.stockCorrectionGridValid)
      this.setOutputData({ submitResult: false });

    if (
      !this.stockCorrectionDataSource ||
      !this.stockCorrectionDataSource.data.length
    )
      this.toasterService.pop(
        'warning',
        'Validation Fail',
        'No entry data for saving.'
      );

    const processFailed = () => {
      //this.store.dispatch(this.processDataActions.submitFailed(this.ofModule));
      this.toasterService.pop(
        'error',
        'Failed',
        'Stock Correction Data cannot be saved'
      );
      this.setOutputData({ submitResult: false });
    };

    this.stockService.saveStockCorrection(this.prepareSaveData()).subscribe(
      (response) => {
        this.appErrorHandler.executeAction(() => {
          if (
            response &&
            response.eventType == FormSaveEvenType.Successfully &&
            response.returnID
          ) {
            this.toasterService.pop(
              'success',
              'Success',
              'Stock Correction Data is saved successfully'
            );
            this.setOutputData({
              submitResult: true,
              returnID: response.returnID,
              isValid: true,
              isDirty: false,
              formValue: this.stockCorrectionForm.value,
            });
            this.reset();
            return;
          }

          processFailed();
        });
      },
      (err) => {
        processFailed();
      }
    );
  }

  private checkEnableAddButton() {
    const price = this.stockCorrectionForm.controls['price'].value;
    const currency = this.stockCorrectionForm.controls['currency'].value;
    const vat = this.stockCorrectionForm.controls['vat'].value;

    if (
      this.reasonCtrl &&
      !isNil(this.reasonCtrl.selectedItem) && // hasReason
      this.warehouseCtrl &&
      !isNil(this.warehouseCtrl.selectedItem) && // hasWarehouse
      this.searchArticleNumberCtl &&
      !isNil(this.searchArticleNumberCtl.selectedItem) && // hasArticleNr
      this.stockCorrectionForm.controls['qty'].value && // hasQuantity
      (!price || (price && currency && vat)) //require currency and vat base on price
    ) {
      this.isEnableBtns = true;
    } else {
      this.isEnableBtns = false;
    }
  }

  private prepareSaveData() {
    const result = { StockCorrections: [] };
    this.stockCorrectionDataSource.data.forEach((item) => {
      result['StockCorrections'].push({
        IdWarehouseArticlePosted: null,
        IdPerson: item.IdPerson,

        IdRepWarehouseCorrection: item.ReasonId,
        IdArticle: item.ArticleNrId,
        ArticleNr: item.ArticleNr,

        AddOnStock: item.QtyWithColor > 0 ? Math.abs(item.QtyWithColor) : 0,
        LessOnStock: item.QtyWithColor < 0 ? Math.abs(item.QtyWithColor) : 0,
        Notes: item.Notes || null,

        Price: item.Price,
        IdRepVat: item.IdRepVat.key,
        IdRepCurrencyCode: item.IdRepCurrencyCode.key,
      });
    });

    return result;
  }

  public add() {
    const newItem = this.createNewGridItem();

    const existingItem = this.stockCorrectionDataSource.data.find(
      (item) =>
        item.WarehouseId == newItem.WarehouseId &&
        item.ReasonId == newItem.ReasonId &&
        item.ArticleNr == newItem.ArticleNr
    );

    if (existingItem) {
      this.modalService.warningMessageHtmlContent({
        message: [
          {
            key: 'Modal_Message__There_Already_An_Item_With_Warehouse_Article',
          },
        ],
        closeText: 'Ok',
        callBack: () => {
          this.searchArticleNumberCtl.focus();
        },
      });

      return;
    }

    this.createGridData(newItem);
    this.resetForm();

    setTimeout(() => {
      this.searchArticleNumberCtl.focus();
    }, 600);
  }

  public changeQtyMode(qtyMode) {
    this.qtyMode = qtyMode;
  }
  //#endregion

  //#region Reason
  public reasonKeyUp($event) {
    if ($event.keyCode === 13) {
      setTimeout(() => {
        this.searchArticleNumberCtl.focus();
      });
    }
  }
  //#endregion

  //#region ArticleNumber
  public searchArticleNr(query: any, max: any, callback: any) {
    if (!query) {
      callback([]);
      return;
    }
    this.isSearching = true;
    query = query.replace(/([.?\\])/g, '');
    // TODO: should check this service later to support searching with WareHouse DDL
    const warehouseId =
      this.warehouseCtrl && this.warehouseCtrl.selectedItem
        ? this.warehouseCtrl.selectedItem.idValue
        : null;
    this.stockService
      .getWarehouseArticle(query, warehouseId)
      .finally(() => {
        this.articleNumberPressEnter();
        this.isSearching = false;
        this.ref.detectChanges();
      })
      .subscribe((response) => {
        this.appErrorHandler.executeAction(() => {
          if (response && response.data && response.data.length > 1)
            callback(response.data[1]);
        });
      });
  }

  public searchArticleNumberKeyTabDown(event) {
    if (
      !event.shiftKey &&
      event.keyCode == 9 &&
      this.priceCtl.nativeElement.disabled
    ) {
      event.preventDefault();
      this.articleNumberPressEnter();
    }
  }

  private articleNumberKeyCode: any;
  public searchArticleNumberKeyUp($event) {
    this.articleNumberKeyCode = $event.keyCode;

    if ($event.keyCode === 13) this.articleNumberPressEnter();
  }

  public articleNumberPressEnter() {
    if (![9, 13].includes(this.articleNumberKeyCode)) return;

    this.stockCorrectionForm.controls['articleNr'].updateValueAndValidity();
    const numofItems =
      this.searchArticleNumberCtl.itemsSource.sourceCollection.length;

    if (!numofItems) {
      this.articleNumberPressEnterProcess();
      return;
    }

    //if there is only 1 item -> select it automatically
    //else show error message requied to select one item
    if (numofItems == 1) {
      this.searchArticleNumberCtl.selectedIndex = 0;
      this.articleNumberPressEnterProcess();
    } else {
      if (this.searchArticleNumberCtl.selectedIndex == -1) {
        this.searchArticleNumberCtl.isDroppedDown = true;
        this.searchArticleNumberCtl.inputElement.focus();
      } else {
        this.articleNumberPressEnterProcess();
      }
    }
  }

  private articleNumberPressEnterProcess() {
    if (!this.priceCtl.nativeElement.disabled) {
      this.priceCtl.nativeElement.focus();
    } else {
      this.radioQuantitySubstract.focus();
    }
  }
  //#endregion

  //#region Rd-Quantity
  public rdQuantityKeyTabDown(event, mode) {
    if (event.keyCode == 9) {
      event.preventDefault();
      if (!event.shiftKey) {
        if (mode == 1) {
          this.radioQuantityAdd.focus();
        } else {
          this.quantityCtl.nativeElement.focus();
        }
      } else {
        if (mode == 1) {
          if (!this.priceCtl.nativeElement.disabled) {
            this.vatCtl.focus();
          } else {
            this.searchArticleNumberCtl.focus();
          }
        } else {
          this.radioQuantitySubstract.focus();
        }
      }
    }
  }

  public ipQuantityKeyDown(event) {
    if (event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      this.radioQuantityAdd.focus();
    }
  }

  public ipQuantityKeyUp(event) {
    if (event.which === 109 || event.keyCode === 109) {
      this.changeQtyMode(1);
      this.radioQuantitySubstract.click();
    }
    // case for press add key (+)
    if (event.which === 107 || event.keyCode === 107) {
      this.changeQtyMode(2);
      this.radioQuantityAdd.click();
    }
  }
  //#endregion

  //#region Warehouse
  public warehouseKeyUp($event) {
    if ($event.keyCode === 13) {
      this.reasonCtrl.focus();
    }
  }

  public warehouseChanged($event: any): void {
    const selectedItem = this.warehouseCtrl.selectedItem;

    if (
      !selectedItem ||
      !selectedItem.idRepIsoCountryCode ||
      !selectedItem.textValue
    )
      return;

    let idRepIsoCountryCode = selectedItem.idRepIsoCountryCode;
    this.comService
      .getComboBoxDataByCondition('vat', idRepIsoCountryCode)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          this.listComboBox.vat =
            response.item && response.item.vat ? response.item.vat : [];

          setTimeout(() => {
            this.stockCorrectionForm.controls['vat'].setValue('');
          });
        });
      });
    this.comService
      .getComboBoxDataByCondition('currencyByCountry', idRepIsoCountryCode)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          this.listComboBox.currency =
            response.item && response.item.currencyByCountry
              ? response.item.currencyByCountry
              : [];

          setTimeout(() => {
            this.stockCorrectionForm.controls['currency'].setValue('');
          });
        });
      });
  }
  //#endregion

  //#region Reason
  private previousReasonItem: any;
  public reasonChanged($event: any): void {
    let selectedItem = this.reasonCtrl.selectedItem;
    //if (selectedItem && selectedItem.idValue == '1') {
    //    selectedItem.status = true;
    //}

    if (
      selectedItem &&
      this.previousReasonItem &&
      (selectedItem.idValue != this.previousReasonItem.idValue ||
        selectedItem.status != this.previousReasonItem.isWithPrice)
    ) {
      this.previousReasonItem = {
        idValue: selectedItem.idValue,
        isWithPrice: selectedItem.isWithPrice,
      };
    }
    //reInit control focus
    this.focusControl.initControl(true);
  }
  //#endregion

  //#region Price
  private setValidationForCurrencyAndVAT() {
    let currencyCtrl = this.stockCorrectionForm.controls['currency'];
    let vatCtrl = this.stockCorrectionForm.controls['vat'];

    if (this.priceCtl.nativeElement.value) {
      currencyCtrl.setValidators([Validators.required]);
      vatCtrl.setValidators([Validators.required]);
    } else {
      currencyCtrl.setErrors(null);
      currencyCtrl.clearValidators();

      vatCtrl.setErrors(null);
      vatCtrl.clearValidators();
    }

    currencyCtrl.updateValueAndValidity();
    vatCtrl.updateValueAndValidity();
  }

  private priceTyping: boolean;
  public priceKeyUp($event: any, index: number): void {
    this.priceTyping = true;

    if ($event.keyCode === 13) {
      this.priceTyping = false;

      this.setValidationForCurrencyAndVAT();
    }
  }

  public priceLostFocus($event: any): void {
    if (!this.priceTyping) return;

    this.setValidationForCurrencyAndVAT();
  }

  public vatKeyTabDown(event) {
    if (!event.shiftKey && event.keyCode == 9) {
      event.preventDefault();
      this.radioQuantitySubstract.focus();
    }
  }
  //#endregion

  //#region Note
  public noteKeyUp($event) {
    if ($event.keyCode === 13 && this.isEnableBtns) {
      this.add();
    }
  }
  //#endregion

  //#region Grid

  //#region Config Columns
  private createGridColumns() {
    const result: any = [];
    result.push(
      this.makeColumn(
        'WarehouseId',
        'WarehouseId',
        false,
        '35',
        null,
        'Warehouse',
        false
      )
    );
    result.push(
      this.makeColumn(
        'Warehouse',
        'Warehouse',
        true,
        '35',
        null,
        'Warehouse',
        false
      )
    );
    result.push(
      this.makeColumn(
        'IdRepIsoCountryCode',
        'IdRepIsoCountryCode',
        false,
        '35',
        null,
        'IdRepIsoCountryCode',
        false
      )
    );

    result.push(
      this.makeColumn(
        'ReasonId',
        'ReasonId',
        false,
        '35',
        null,
        'Reason',
        false
      )
    );
    result.push(
      this.makeColumn('Reason', 'Reason', true, '35', null, 'Reason', false)
    );

    result.push(
      this.makeColumn(
        'ArticleNrId',
        'ArticleId',
        false,
        '0',
        null,
        'ArticleNr',
        false
      )
    );
    result.push(
      this.makeColumn(
        'ArticleNr',
        'Article #',
        true,
        '0',
        null,
        'ArticleNr',
        false
      )
    );

    result.push(
      this.makeColumn(
        'Price',
        'Price',
        true,
        '',
        'numeric',
        'Price',
        false,
        false
      )
    );
    result.push(this.createColumnCurrency());
    result.push(this.createColumnVAT());

    result.push(
      this.makeColumn(
        'QtyWithColor',
        'Qty',
        true,
        '0',
        'numeric',
        'Qty',
        true,
        true,
        Number.MIN_SAFE_INTEGER,
        'bold'
      )
    );
    result.push(
      this.makeColumn('Notes', 'Notes', true, null, null, 'Notes', true, false)
    );

    return result;
  }

  private makeColumn(
    data: any,
    columnName: string,
    visible: boolean,
    dataLength: string,
    dataType: string,
    originalColumnName: string,
    isEdited?: boolean,
    needValidation?: boolean,
    min?: number,
    fontWeight?: string
  ): any {
    let column: any = {
      title: columnName,
      data: data,
      visible: visible,
      min: min,
      setting: {
        DataLength: dataLength,
        DataType: dataType,
        OriginalColumnName: originalColumnName,
        Setting: [
          {
            ControlType: {
              Type: dataType ? dataType : 'Textbox',
            },
            DisplayField: {
              ReadOnly: isEdited ? '0' : '1',
              Hidden: visible ? '0' : '1',
            },
            Validation: needValidation
              ? {
                  ValidationExpression: [
                    {
                      Regex:
                        '%5E%28%5B%5C%2B%5C-%5D%3F%5B1-9%5D%5B0-9%5D%2A%29%24',
                      ErrorMessage: 'Not empty or Equal To 0',
                    },
                  ],
                }
              : {},
          },
        ],
      }, //setting
    };

    if (fontWeight) {
      column.setting.Setting[0].DisplayField.FontWeight = fontWeight;
    }

    return column;
  }

  private createColumnCurrency(): any {
    return {
      title: 'IdRepCurrencyCode',
      data: 'IdRepCurrencyCode',
      setting: {
        ColumnName: 'IdRepCurrencyCode',
        ColumnHeader: 'IdRepCurrencyCode',
        Value: '',
        DataLength: '0',
        DataType: 'numeric',
        OriginalColumnName: 'IdRepCurrencyCode',
        Setting: [
          {
            ControlType: {
              Type: 'ComboBox',
              Value: 'currencyByCountry',
              FilterBy: 'IdRepIsoCountryCode',
            },
            DisplayField: {
              ReadOnly: '1',
            },
            Validation: {
              RequiredFrom: 'Price',
            },
          },
        ],
      }, //setting
    };
  }

  private createColumnVAT(): any {
    return {
      title: 'IdRepVat',
      data: 'IdRepVat',
      setting: {
        ColumnName: 'IdRepVat',
        ColumnHeader: 'IdRepVat',
        Value: '',
        DataLength: '0',
        DataType: 'numeric',
        OriginalColumnName: 'IdRepVat',
        Setting: [
          {
            ControlType: {
              Type: 'ComboBox',
              Value: 'vat',
              FilterBy: 'IdRepIsoCountryCode',
            },
            DisplayField: {
              ReadOnly: '1',
            },
            Validation: {
              RequiredFrom: 'Price',
            },
          },
        ],
      }, //setting
    };
  }
  //#endregion

  private createNewGridItem() {
    const model = this.stockCorrectionForm.value;

    let item = {
      DT_RowId: 'newrow_' + Uti.guid(),

      IdPerson: null,
      WarehouseId: null,
      Warehouse: null,
      IdRepIsoCountryCode: null,

      ReasonId: null,
      Reason: null,

      ArticleNrId: null,
      ArticleNr: null,

      QtyWithColor: parseInt(
        (this.qtyMode === QTY_MODE_NEGATIVE ? '-' : '') + model.qty
      ),
      Notes: model.notes,

      IdRepCurrencyCode: null,
      IdRepVat: null,

      Price: this.priceCtl ? this.priceCtl.nativeElement.value : null,
    };

    if (this.warehouseCtrl && this.warehouseCtrl.selectedItem) {
      item.IdPerson = this.warehouseCtrl.selectedItem.idValue;
      item.WarehouseId = this.warehouseCtrl.selectedItem.idValue;
      item.Warehouse = this.warehouseCtrl.selectedItem.textValue;
      item.IdRepIsoCountryCode =
        this.warehouseCtrl.selectedItem.idRepIsoCountryCode;
    }

    if (this.reasonCtrl && this.reasonCtrl.selectedItem) {
      item.ReasonId = this.reasonCtrl.selectedItem.idValue;
      item.Reason = this.reasonCtrl.selectedItem.textValue;
    }

    if (
      this.searchArticleNumberCtl &&
      this.searchArticleNumberCtl.selectedItem
    ) {
      item.ArticleNrId = this.searchArticleNumberCtl.selectedItem.IdArticle;
      item.ArticleNr = this.searchArticleNumberCtl.selectedItem.ArticleNr;
    }

    if (this.currencyCtl && this.currencyCtl.selectedItem) {
      item.IdRepCurrencyCode = JSON.stringify([
        {
          key: this.currencyCtl.selectedItem.idRepCurrencyCode,
          value: this.currencyCtl.selectedItem.textValue,
        },
      ]);
    }

    if (this.vatCtl && this.vatCtl.selectedItem) {
      item.IdRepVat = JSON.stringify([
        {
          key: this.vatCtl.selectedItem.idValue,
          value: this.vatCtl.selectedItem.textValue,
        },
      ]);
    }

    return item;
  }

  private createGridData(newItem?: any) {
    let data = [];

    if (this.stockCorrectionDataSource && this.stockCorrectionDataSource.data)
      data = cloneDeep(this.stockCorrectionDataSource.data);

    if (newItem) data.push(newItem);

    this.stockCorrectionDataSource = {
      data: data,
      columns: this.createGridColumns(),
    };
    this.setOutputData({});
  }

  public deleteStockCorrectionItem(event) {
    if (this.wijmoGridComponent) {
      const remainItems = this.wijmoGridComponent.getCurrentNodeItems();
      if (remainItems.length) {
        this.stockCorrectionDataSource = {
          data: remainItems,
          columns: this.createGridColumns(),
        };
      } else {
        this.stockCorrectionDataSource = {
          data: [],
          columns: this.createGridColumns(),
        };
      }
    }
    this.setOutputData({});
  }

  public onTableEditSuccess(dataItem) {
    if (!dataItem) return;

    const filterDataItem = this.stockCorrectionDataSource.data.find(
      (item) => item.DT_RowId == dataItem.DT_RowId
    );
    if (filterDataItem) filterDataItem.QtyWithColor = dataItem.QtyWithColor;

    this.setOutputData({});
  }

  public hasValidationError($event): void {
    this.stockCorrectionGridValid = !$event;
  }
  //#endregion
}
