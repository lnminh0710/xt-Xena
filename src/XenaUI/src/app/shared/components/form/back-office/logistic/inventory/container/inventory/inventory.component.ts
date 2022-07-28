import {
    Component, Input, Output, OnInit, OnDestroy, AfterViewInit, ViewChild, EventEmitter, ChangeDetectorRef, ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import isNil from 'lodash-es/isNil';
import cloneDeep from 'lodash-es/cloneDeep';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { WjAutoComplete, WjInputNumber } from 'wijmo/wijmo.angular2.input';
import { AppErrorHandler, CommonService, StockCorrectionService, PropertyPanelService, ModalService, DownloadFileService } from 'app/services';
import { Uti } from 'app/utilities';
import { Configuration, FormSaveEvenType, UploadFileMode } from 'app/app.constants';
import { ApiResultResponse } from 'app/models';
import {
    ProcessDataActions,
    CustomAction
} from 'app/state-management/store/actions';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { ControlFocusComponent } from 'app/shared/components/form';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { FileUploadComponent } from 'app/shared/components/xn-file';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
    selector: 'app-inventory',
    styleUrls: ['./inventory.component.scss'],
    templateUrl: './inventory.component.html'
})
export class InventoryComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    public enabledAddButton = false;
    public enabledImportButton = false;
    private isSearching = false;
    private inventoryGridValid: boolean = true;
    public uploadFileMode: UploadFileMode = UploadFileMode.Inventory;
    public isRenderForm: boolean;
    public listComboBox: any;
    public inventoryForm: FormGroup;
    public globalNumberFormat: string = '';
    public inventoryDataSource: any = {
        data: [],
        columns: this.createGridColumns()
    };
    public showUploadDialog: boolean = false;
    public showConfirmDialog: boolean = false;
    public idFolder = '1'; // TODO will update right folder id
    public importType = 0;
    private importData: any[] = [];
    public globalProps: any[] = [];

    private inventoryFormValueChangesSubscription: Subscription;
    private dispatcherSubscription: Subscription;

    @ViewChild('focusControl') focusControl: ControlFocusComponent;
    @ViewChild('searchArticleNumberCtl') searchArticleNumberCtl: WjAutoComplete;
    @ViewChild('warehouseCtrl') warehouseCtrl: AngularMultiSelect;
    @ViewChild('xnAgGridComponent') xnAgGridComponent: XnAgGridComponent;
    @ViewChild('quantityCtl') quantityCtl: ElementRef;
    @ViewChild('fileUpload') fileUpload: FileUploadComponent;

    @Input() set globalProperties(globalProperties: any[]) {
        this.globalProps = globalProperties;
        this.globalNumberFormat = this.propertyPanelService.buildGlobalNumberFormatFromProperties(globalProperties);
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
        private modalService: ModalService,
        private downloadFileService: DownloadFileService
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

    public importFile() {
        this.showUploadDialog = true;
    }

    public close() {
        this.showUploadDialog = false;
        this.showConfirmDialog = false;
    }

    public checkFileCorrect(): boolean {
        return true;
    }

    public onCompleteUploadItem(event) {
        if (event && event.response && event.response.item) {
            if (event.response.item.message) {
                this.fileUpload.clearItem();
                this.toasterService.pop('error', 'Failed', event.response.item.message);
                return;
            } else if (!event.response.item.data || !event.response.item.data.length) {
                this.fileUpload.clearItem();
                this.toasterService.pop('error', 'Failed', 'There\'s no row to import');
                return;
            } else {
                this.importData = event.response.item.data
                    //.filter(x => x['qty']) // remove from bug 7855
                    .map((item) => {
                    return {
                        "IdPerson": this.warehouseCtrl.selectedItem.idValue,
                        "WarehouseId": this.warehouseCtrl.selectedItem.idValue,
                        "Warehouse": this.warehouseCtrl.selectedItem.textValue,
                        "ArticleNrId": null,
                        "ArticleNr": item['articleNr'],
                        "QtyWithColor": item['qty'],
                        "Notes": null,
                        "IdRepIsoCountryCode": this.warehouseCtrl.selectedItem.idRepIsoCountryCode
                    };
                });
                this.close();
                this.openUploadConfirmation();
                return;
            }
        }

        this.toasterService.pop('error', 'Failed', 'Cannot import, please try again');
    }

    public openUploadConfirmation() {
        this.showConfirmDialog = true;
    }

    public downloadTemplateFile() {
        this.downloadFileService.makeDownloadFile('Inventory_Template.xlsx', null, null, 4);
    }

    public processImportData() {
        if (!this.importData || !this.importData.length) {
            return;
        }

        if (this.importType == 0) {
            let saveData = this.prepareSaveData(this.importData);
            this.processSaveData(saveData);
        } else if (this.importType == 1) {
            this.importData.forEach((item) => {
                this.createGridData(item);
            });
            this.close();
            this.setOutputData({isDirty: true});
        }
    }

    //#region Init Data
    private getInitDropdownlistData() {
        this.comService.getListComboBox('wareHouse')
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
    private registerUserEvent() {
        setTimeout(() => {
            if (!this.warehouseCtrl) return;
            this.warehouseCtrl.focus();
        }, 1000);
    }

    private setOutputData(data) {
        this.outputData.emit({
            isValid: this.xnAgGridComponent &&
                (this.inventoryDataSource.data.length && !this.xnAgGridComponent.hasError()),
            isDirty: !!this.inventoryDataSource.data.length || data.isDirty,
            submitResult: data.submitResult,
            returnID: data.returnID
        });
    }

    private subcribeRequestSaveState() {
        this.dispatcherSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.REQUEST_SAVE && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.saveData();
            });
        });
    }

    private initForm() {
        this.inventoryForm = this.formBuilder.group({
            warehouse: ['', Validators.required],
            articleNr: ['', Validators.required],
            qty: ['', Validators.required],
            notes: '',
            //weight: ['', Validators.required],
            //width: ['', Validators.required],
            //height: ['', Validators.required],
            //deep: ['', Validators.required]
        });
        this.inventoryForm['submitted'] = false;
        this.inventoryFormValueChangesSubscription = this.inventoryForm.valueChanges
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((value) => {
            this.appErrorHandler.executeAction(() => {
                this.enabledAddButton = this.checkEnableddAddBtn();
                this.enabledImportButton = this.checkEnableddImportBtn();
            });
        });
        this.setOutputData({});
    }

    private checkEnableddAddBtn() {
        const qty = this.inventoryForm.controls['qty'].value;
        //const weight = this.inventoryForm.controls['weight'].value;
        //const width = this.inventoryForm.controls['width'].value;
        //const height = this.inventoryForm.controls['height'].value;
        //const deep = this.inventoryForm.controls['deep'].value;

        if (this.warehouseCtrl && !isNil(this.warehouseCtrl.selectedItem) // hasWarehouse
            && this.searchArticleNumberCtl && !isNil(this.searchArticleNumberCtl.selectedItem) // hasArticleNr
            && qty
            //&& weight
            //&& width
            //&& height
            //&& deep
        ) {
            return true;
        }

        return false;
    }

    private checkEnableddImportBtn() {
        return this.warehouseCtrl && !isNil(this.warehouseCtrl.selectedItem);
    }

    private resetForm() {
        // this.inventoryForm.controls['articleNr'].setValue('');
        // this.inventoryForm.controls['qty'].setValue('');
        // this.inventoryForm.controls['notes'].setValue('');

        // this.inventoryForm.markAsPristine();


        // this.setValidationForCurrencyAndVAT()
        // this.inventoryForm['submitted'] = false;
        // this.inventoryForm.updateValueAndValidity();

        Uti.resetValueForForm(this.inventoryForm, ['warehouse']);
    }

    private reset() {
        this.resetForm();
        this.inventoryDataSource = {
            data: [],
            columns: this.createGridColumns()
        };
    }

    public submit() {
        this.saveData();
    }

    private saveData() {
        if (!this.inventoryGridValid)
            this.setOutputData({ submitResult: false });

        if (!this.inventoryDataSource || !this.inventoryDataSource.data.length)
            this.toasterService.pop('warning', 'Validation Fail', 'No entry data for saving.');

        let saveData = this.prepareSaveData(this.inventoryDataSource.data);
        this.processSaveData(saveData);
    }

    private prepareSaveData(data) {
        const result = { "StockCorrections": [] };
        data.forEach(item => {
            result['StockCorrections'].push({
                "IdWarehouseArticlePosted": null,
                "IdPerson": item.IdPerson,
                "IdRepWarehouseCorrection": 6,
                "IdArticle": item.ArticleNrId || null,
                "ArticleNr": item.ArticleNr,
                "AddOnStock": item.QtyWithColor > 0 ? Math.abs(item.QtyWithColor) : 0,
                "LessOnStock": item.QtyWithColor < 0 ? Math.abs(item.QtyWithColor) : 0,
                "Notes": item.Notes || null,

                //"Weight": item.Weight,
                //"Width": item.Width,
                //"Height": item.Height,
                //"Deep": item.Deep,
            });
        });

        return result;
    }

    private processSaveData(data) {
        const processFailed = () => {
            //this.store.dispatch(this.processDataActions.submitFailed(this.ofModule));
            this.toasterService.pop('error', 'Failed', 'Inventory Data cannot be saved');
            this.setOutputData({ submitResult: false });
        };

        this.stockService.saveStockCorrection(data)
            .subscribe(response => {
                this.appErrorHandler.executeAction(() => {
                    if (response && response.eventType == FormSaveEvenType.Successfully && response.returnID) {
                        this.toasterService.pop('success', 'Success', 'Inventory Data is saved successfully');
                        this.setOutputData({
                            submitResult: true,
                            returnID: response.returnID,
                            isValid: true,
                            isDirty: false,
                            formValue: this.inventoryForm.value
                        });
                        this.reset();
                        this.close();
                        return;
                    }

                    this.close();
                    processFailed();
                });
            }, err => {
                processFailed();
            })
    }

    public add() {
        const newItem = this.createNewGridItem();
        const existingItem = this.inventoryDataSource.data.find((item) =>
            item.WarehouseId == newItem.WarehouseId
            && item.ArticleNr == newItem.ArticleNr);

        if (existingItem) {
            this.modalService.warningMessageHtmlContent({
                message: [{key: 'Modal_Message__There_Already_An_Item_With_Warehouse_Article'}],
                closeText: 'Ok',
                callBack: () => {
                    this.searchArticleNumberCtl.focus();
                }
            });
            return;
        }

        this.createGridData(newItem);
        this.resetForm();
        this.setOutputData({});

        setTimeout(() => {
            this.searchArticleNumberCtl.focus();
        }, 600);
    }

    //#endregion

    //#region Warehouse
    public warehouseKeyUp($event) {
        if ($event.keyCode === 13) {
            this.searchArticleNumberCtl.focus();
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
        const warehouseId = this.warehouseCtrl && this.warehouseCtrl.selectedItem ? this.warehouseCtrl.selectedItem.idValue : null;
        this.stockService.getWarehouseArticle(query, warehouseId)
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

    private articleNumberKeyCode: any;
    public searchArticleNumberKeyUp($event) {
        this.articleNumberKeyCode = $event.keyCode;

        if ($event.keyCode === 13)
            this.articleNumberPressEnter();
    }

    public articleNumberPressEnter() {
        if (this.articleNumberKeyCode !== 13) return;

        this.inventoryForm.controls['articleNr'].updateValueAndValidity();
        const numofItems = this.searchArticleNumberCtl.itemsSource.sourceCollection.length;

        if (!numofItems) return;

        //if there is only 1 item -> select it automatically
        //else show error message requied to select one item
        if (numofItems == 1) {
            this.searchArticleNumberCtl.selectedIndex = 0;
            this.quantityCtl.nativeElement.focus();
        }
        else {
            if (this.searchArticleNumberCtl.selectedIndex == -1) {
                this.searchArticleNumberCtl.isDroppedDown = true;
                this.searchArticleNumberCtl.inputElement.focus();
            }
            else {
                this.quantityCtl.nativeElement.focus();
            }
        }
    }
    //#endregion

    //#region Note
    public noteKeyUp($event) {
        if ($event.keyCode === 13) {
            this.add();
        }
    }
    //#endregion

    //#region Grid

    //#region Config Columns
    private createGridColumns() {
        const result: any = [];
        result.push(this.makeColumn('WarehouseId', 'WarehouseId', false, '35', null, 'Warehouse', false));
        result.push(this.makeColumn('Warehouse', 'Warehouse', true, '35', null, 'Warehouse', false));
        result.push(this.makeColumn('IdRepIsoCountryCode', 'IdRepIsoCountryCode', false, '35', null, 'IdRepIsoCountryCode', false));

        result.push(this.makeColumn('ArticleNrId', 'ArticleId', false, '0', null, 'ArticleNr', false));
        result.push(this.makeColumn('ArticleNr', 'Article #', true, '0', null, 'ArticleNr', false));

        result.push(this.makeColumn('QtyWithColor', 'Qty', true, '0', 'numeric', 'Qty', true, true, Number.MIN_SAFE_INTEGER, 'bold'));
        //result.push(this.makeColumn('Weight', 'Weight', true, '0', 'numeric', 'Weight', true, true, Number.MIN_SAFE_INTEGER, 'bold'));
        //result.push(this.makeColumn('Width', 'Width', true, '0', 'numeric', 'Width', true, true, Number.MIN_SAFE_INTEGER, 'bold'));
        //result.push(this.makeColumn('Height', 'Height', true, '0', 'numeric', 'Height', true, true, Number.MIN_SAFE_INTEGER, 'bold'));
        //result.push(this.makeColumn('Deep', 'Deep', true, '0', 'numeric', 'Deep', true, true, Number.MIN_SAFE_INTEGER, 'bold'));
        result.push(this.makeColumn('Notes', 'Notes', true, null, null, 'Notes', true, false));

        return result;
    }

    private makeColumn(data: any, columnName: string, visible: boolean, dataLength: string, dataType: string,
        originalColumnName: string, isEdited?: boolean, needValidation?: boolean, min?: number, fontWeight?: string): any {
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
                            Type: dataType ? dataType : 'Textbox'
                        },
                        DisplayField: {
                            ReadOnly: isEdited ? '0' : '1',
                            Hidden: visible ? '0' : '1',
                        },
                        Validation: needValidation ? {
                            ValidationExpression: [{
                                Regex: '%5E%28%5B%5C%2B%5C-%5D%3F%5B1-9%5D%5B0-9%5D%2A%29%24',
                                ErrorMessage: 'Not empty or Equal To 0'
                            }]
                        } : {}
                    }
                ]
            }//setting
        }

        if (fontWeight) {
            column.setting.Setting[0].DisplayField.FontWeight = fontWeight;
        }

        return column;
    }
    //#endregion

    private createNewGridItem() {
        const model = this.inventoryForm.value;

        let item = {
            DT_RowId: 'newrow_' + Uti.guid(),

            IdPerson: null,
            WarehouseId: null,
            Warehouse: null,
            IdRepIsoCountryCode: null,

            ArticleNrId: null,
            ArticleNr: null,

            QtyWithColor: parseInt(model.qty),
            //Weight: parseInt(model.weight),
            //Width: parseInt(model.width),
            //Height: parseInt(model.height),
            //Deep: parseInt(model.deep),
            Notes: model.notes,

        };

        if (this.warehouseCtrl && this.warehouseCtrl.selectedItem) {
            item.IdPerson = this.warehouseCtrl.selectedItem.idValue;
            item.WarehouseId = this.warehouseCtrl.selectedItem.idValue;
            item.Warehouse = this.warehouseCtrl.selectedItem.textValue;
            item.IdRepIsoCountryCode = this.warehouseCtrl.selectedItem.idRepIsoCountryCode;
        }

        if (this.searchArticleNumberCtl && this.searchArticleNumberCtl.selectedItem) {
            item.ArticleNrId = this.searchArticleNumberCtl.selectedItem.IdArticle;
            item.ArticleNr = this.searchArticleNumberCtl.selectedItem.ArticleNr;
        }

        return item;
    }

    private createGridData(newItem?: any) {
        let data = [];

        if (this.inventoryDataSource && this.inventoryDataSource.data)
            data = cloneDeep(this.inventoryDataSource.data);

        if (newItem)
            data.push(newItem);

        this.inventoryDataSource = {
            data: data,
            columns: this.createGridColumns()
        }
    }

    public deleteInventoryItem(event) {
        if (this.xnAgGridComponent) {
            const remainItems = this.xnAgGridComponent.getCurrentNodeItems();
            if (remainItems.length) {
                this.inventoryDataSource = {
                    data: remainItems,
                    columns: this.createGridColumns()
                };
            } else {
                this.inventoryDataSource = {
                    data: [],
                    columns: this.createGridColumns()
                };
            }
        }
        this.setOutputData({});
    }

    public onTableEditSuccess(dataItem) {
        if (!dataItem) return;

        const filterDataItem = this.inventoryDataSource.data.find((item) => item.DT_RowId = dataItem.DT_RowId);
        if (filterDataItem)
            filterDataItem.QtyWithColor = dataItem.QtyWithColor;

        this.setOutputData({});
    }

    public hasValidationError($event): void {
        this.inventoryGridValid = !$event;
    }
    //#endregion
}
