import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    ViewChild,
    Output,
    EventEmitter,
    ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import {
    Module,
    ControlGridModel,
    ApiResultResponse,
    WidgetTemplateSettingModel,
    WidgetDetail
} from 'app/models';
import {
    DatatableService,
    ModalService,
    AppErrorHandler,
    CampaignService,
    WidgetTemplateSettingService
} from 'app/services';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import cloneDeep from 'lodash-es/cloneDeep';
import isString from 'lodash-es/isString';
import isNumber from 'lodash-es/isNumber';
import toNumber from 'lodash-es/toNumber';
import { Uti } from 'app/utilities';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { WidgetFormComponent } from 'app/shared/components/widget/components/widget-form/widget-form.component';
import { BaseComponent } from 'app/pages/private/base';
import * as widgetTemplateReducer from 'app/state-management/store/reducer/widget-template';
import { XnAgGridComponent } from '../xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { Configuration } from 'app/app.constants';
import {Dialog} from "primeng/components/dialog/dialog";

@Component({
    selector: 'xn-mediacode-dialog',
    templateUrl: './xn-mediacode-dialog.component.html'
})
export class XnMediacodeDialogComponent extends BaseComponent implements OnInit, OnDestroy {
    private ID_WIDGET_CATALOG = Configuration.PublicSettings.isSelectionProject ? 512 : 52;

    public mediacodeData: ControlGridModel;
    public paymentTypeData: ControlGridModel;
    public showDialog = false;
    public countryName = '';
    public hasEditedItemForMediaCodeDataGrid = false;
    public hasEditedItemForPaymentTypeDataGrid = false;
    public hasFormEdited = false;
    public isSaveSucceeded = false;
    public catalogData: WidgetDetail;
    public isSelectionProject = Configuration.PublicSettings.isSelectionProject;
    public isResizable = true;
    public isDraggable = true;
    public isMaximized = false;
    public dialogStyleClass = this.consts.popupResizeClassName;

    private hasErrorOnEditMediaCodeGrid = false;
    private hasErrorOnEditPaymentTypeGrid = false;
    private rowData: any = {};
    private catalogWidgetTemplateSetting: any;

    private campaignServiceSubscription: Subscription;
    private getCatalogSubscription: Subscription;
    private paymentTypeDataSubscription: Subscription;
    private widgetTemplateSettingServiceSubscription: Subscription;
    private widgetTemplateSettingModelState: Observable<WidgetTemplateSettingModel[]>;
    private widgetTemplateSettingModelStateSubscription: Subscription;
    private preDialogW: string;
    private preDialogH: string;
    private preDialogLeft: string;
    private preDialogTop: string;

    @ViewChild('mediaCodeDataGrid') private mediaCodeDataGrid: XnAgGridComponent;
    @ViewChild('paymentTypeDataGrid') private paymentTypeDataGrid: XnAgGridComponent;
    
    @ViewChild(WidgetFormComponent) widgetFormComponent: WidgetFormComponent;
    private pDialogXnMediaCode: any;
    @ViewChild('pDialogXnMediaCode') set pDialogXnMediaCodeInstance(pDialogXnMediaCodeInstance: Dialog) {
        this.pDialogXnMediaCode = pDialogXnMediaCodeInstance;
    }
    @Input() gridId: string;
    @Input() activeModule: Module;
    @Input() globalProperties: any;

    @Output() onSuccessSaved = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    @Output() isCompletedRender: EventEmitter<any> = new EventEmitter();

    constructor(
        private store: Store<AppState>,
        private datatableService: DatatableService,
        private modalService: ModalService,
        private campaignService: CampaignService,
        private appErrorHandler: AppErrorHandler,
        private consts: Configuration,
        private toasterService: ToasterService,
        private ref: ChangeDetectorRef,
        private widgetTemplateSettingService: WidgetTemplateSettingService,
        protected router: Router
    ) {
        super(router);

        this.widgetTemplateSettingModelState = store.select(state => widgetTemplateReducer.getWidgetTemplateState(state, this.ofModule.moduleNameTrim).mainWidgetTemplateSettings);
    }

    ngOnInit() {
        this.dialogStyleClass = this.consts.classCampaignCodeDialog + '  ' +
            this.consts.popupResizeClassName;
        this.mediacodeData = {
            data: [],
            columns: []
        };
        this.subscribeWidgetTemplateSetting();
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public onMediacodeSave(callbackFunc?: any) {
        if (this.hasEditedItemForMediaCodeDataGrid) {
            this.saveCampaignMediaCodeArticleSalesPriceForGrid();
        }
        if (this.hasEditedItemForPaymentTypeDataGrid) {
            this.savePaymentTypeForGrid();
        }
        if (this.hasFormEdited) {
            this.onWidgetFormSave();
        }
    }

    public saveCampaignMediaCodeArticleSalesPriceForGrid(callbackFunc?: any) {
        if (this.hasErrorOnEditMediaCodeGrid)
            return;

        if (this.mediaCodeDataGrid && this.mediaCodeDataGrid.itemsEdited) {
            const updateData = [];
            this.mediaCodeDataGrid.itemsEdited.forEach((item) => {
                // tslint:disable-next-line:triple-equals
                updateData.push({
                    'IdSalesCampaignMediaCodeSalesPrice': toNumber(item.IdSalesCampaignMediaCodeSalesPrice),
                    'IdSalesCampaignArticle': this.rowData['IdSalesCampaignArticle'],
                    'IdSalesCampaignMediaCode': item.IdSalesCampaignMediaCode,
                    'SalesPrice': toNumber(item.SalesPrice),
                    'PostageCosts': toNumber(item.PostageCosts),
                    'IsActive': item.IsActive
                });
            });
            if (updateData.length)
                this.saveCampaignMediaCodeArticleSalesPrice({ 'CampaignMediaCodeArticleSalesPrices': updateData }, callbackFunc);
        }
    }

    public savePaymentTypeForGrid(callbackFunc?: any) {
        if (this.hasErrorOnEditPaymentTypeGrid)
            return;

        if (this.paymentTypeDataGrid && this.paymentTypeDataGrid.itemsEdited) {
            const updateData = [];
            this.paymentTypeDataGrid.itemsEdited.forEach((item) => {
                // tslint:disable-next-line:triple-equals
                updateData.push({
                    'IdSalesCampaignPaymentTypeSalesPrice': toNumber(item.IdSalesCampaignPaymentTypeSalesPrice),
                    'IdSalesCampaignWizardItems': this.rowData['IdSalesCampaignWizardItems'],
                    'IdRepPaymentsMethods': item.IdRepPaymentsMethods,
                    'SalesPrice': toNumber(item.SalesPrice),
                    'PostageCosts': toNumber(item.PostageCosts),
                    'IsActive': item.IsActive
                });
            });
            if (updateData.length)
                this.savePaymentTypeSalesPrice({ 'CampaignPaymentTypeSalesPrices': updateData }, callbackFunc);
        }
    }

    private maximize() {
        // if (this.pDialogXnMediaCode)
        //     this.pDialogXnMediaCode.resized();
        this.isMaximized = true;
        this.isResizable = false;
        this.isDraggable = false;
        this.dialogStyleClass += '  ' + this.consts.popupFullViewClassName;
        if (this.pDialogXnMediaCode) {
            this.preDialogW = this.pDialogXnMediaCode.containerViewChild.nativeElement.style.width;
            this.preDialogH = this.pDialogXnMediaCode.containerViewChild.nativeElement.style.height;
            this.preDialogLeft = this.pDialogXnMediaCode.containerViewChild.nativeElement.style.left;
            this.preDialogTop = this.pDialogXnMediaCode.containerViewChild.nativeElement.style.top;

            this.pDialogXnMediaCode.containerViewChild.nativeElement.style.width = $(document).width() + 'px';
            this.pDialogXnMediaCode.containerViewChild.nativeElement.style.height = $(document).height() + 'px';
            this.pDialogXnMediaCode.containerViewChild.nativeElement.style.top = '0px';
            this.pDialogXnMediaCode.containerViewChild.nativeElement.style.left = '0px';
        }
    }

    private restore() {
        // if (this.pDialogXnMediaCode)
        //     this.pDialogXnMediaCode.resized();
        this.isMaximized = false;
        this.isResizable = true;
        this.isDraggable = true;
        this.dialogStyleClass = this.consts.classCampaignCodeDialog + '  ' + this.consts.popupResizeClassName;
        if (this.pDialogXnMediaCode) {
            this.pDialogXnMediaCode.containerViewChild.nativeElement.style.width = this.preDialogW;
            this.pDialogXnMediaCode.containerViewChild.nativeElement.style.height = this.preDialogH;
            this.pDialogXnMediaCode.containerViewChild.nativeElement.style.top = this.preDialogTop;
            this.pDialogXnMediaCode.containerViewChild.nativeElement.style.left = this.preDialogLeft;
        }
        // setTimeout(() => {
        //     this.bindResizeEvent();
        // }, 200);

    }

    private onWidgetFormSave(callbackFunc?: any) {
        if (!this.widgetFormComponent) return;
        if (this.widgetFormComponent.form && this.widgetFormComponent.form.valid) {
            let formValues = this.widgetFormComponent.filterValidFormField();
            formValues = Uti.convertDataEmptyToNull(formValues);
            this.widgetTemplateSettingServiceSubscription = this.widgetTemplateSettingService.updateWidgetInfo(
                formValues,
                this.catalogWidgetTemplateSetting.updateJsonString,
                this.ofModule,
                this.rowData['IdSalesCampaignWizardItems'],
                null,
                '1'
            ).subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.hasFormEdited = false;
                    this.isSaveSucceeded = true;
                    this.toasterService.pop('success', 'Success', 'Update ' + this.countryName + ' article\'s mediacode price saved successfully');
                    if (callbackFunc) {
                        callbackFunc();
                    }
                    this.onSuccessSaved.emit();
                });
            });
        } else {
            this.widgetFormComponent.focusOnFirstFieldError();
        }
    }

    public onMediacodeSaveAndClose() {
        if (this.hasEditedItemForMediaCodeDataGrid) {
            let func = (this.hasFormEdited || this.hasEditedItemForPaymentTypeDataGrid ) ? null : () => this.close();
            this.saveCampaignMediaCodeArticleSalesPriceForGrid(func);
        }
        if (this.hasEditedItemForPaymentTypeDataGrid) {
            let func = (this.hasFormEdited || this.hasEditedItemForMediaCodeDataGrid) ? null : () => this.close();
            this.savePaymentTypeForGrid(func);
        }
        if (this.hasFormEdited) {
            this.onWidgetFormSave(() => this.close());
        }
    }

    public onMediacodeCancel() {
        this.close();
    }

    public onMediaCodeTableEditSuccess(event) {
        this.hasEditedItemForMediaCodeDataGrid = true;
        this.isSaveSucceeded = false;
    }

    public onPaymentTypTableEditSuccess(event) {
        this.hasEditedItemForPaymentTypeDataGrid = true;
        this.isSaveSucceeded = false;
    }

    public hasValidationErrorMediaCodeHandler(event) {
        this.hasErrorOnEditMediaCodeGrid = event;
        this.isSaveSucceeded = false;
    }

    public hasValidationErrorPaymentTypeHandler(event) {
        this.hasErrorOnEditPaymentTypeGrid = event;
        this.isSaveSucceeded = false;
    }

    /**
     * open
     * @param rowData
     */
    public open(rowData) {
        this.rowData = rowData;
        this.countryName = rowData['Country'];
        this.showDialog = true;
        this.ref.detectChanges();
        this.getData();
        this.getPaymentTypeSalesPriceData();
        if (!this.isSelectionProject) {
            this.getDataForCatalog();
        }

        setTimeout(() => {
            this.isCompletedRender.emit(true);
        });
    }

    public close() {
        if (this.hasEditedItemForMediaCodeDataGrid || this.hasEditedItemForPaymentTypeDataGrid || this.hasFormEdited) {
            setTimeout(() => {
                this.modalService.unsavedWarningMessageDefault({
                    headerText: 'Close Dialog',
                    onModalSaveAndExit: this.onMediacodeSaveAndClose.bind(this),
                    onModalExit: this.onModalExit.bind(this)
                });
            });
            return;
        }

        this.showDialog = false;
        this.ref.detectChanges();
        this.onClose.emit();
    }

    public onFormChanged($event: any) {
        this.hasFormEdited = $event;
    }

    private subscribeWidgetTemplateSetting() {
        this.widgetTemplateSettingModelStateSubscription = this.widgetTemplateSettingModelState.subscribe((mainWidgetTemplateSettings: WidgetTemplateSettingModel[]) => {
            this.appErrorHandler.executeAction(() => {
                this.catalogWidgetTemplateSetting = Uti.getItemFromArrayByProperty(mainWidgetTemplateSettings, 'idRepWidgetApp', this.ID_WIDGET_CATALOG);
                this.catalogData = new WidgetDetail({
                    idRepWidgetApp: this.ID_WIDGET_CATALOG,
                    idRepWidgetType: this.catalogWidgetTemplateSetting.idRepWidgetType,
                    request: this.catalogWidgetTemplateSetting.jsonString,
                    updateRequest: this.catalogWidgetTemplateSetting.updateJsonString // TODO update the update data.
                });
            });
        });
    }

    private getDataForCatalog() {
        if (!this.catalogData) return;
        let fieldName = this.isSelectionProject ? 'IdSalesCampaignWizard' : 'IdSalesCampaignWizardItems'
        this.getCatalogSubscription = this.widgetTemplateSettingService.getWidgetDetailByRequestString(this.catalogData, { [fieldName]: this.rowData[fieldName] }).subscribe(
            (response: any) => {
                this.appErrorHandler.executeAction(() => {
                    // let temp = cloneDeep(this.catalogData);
                    // temp.contentDetail = response;
                    // this.catalogData = temp;
                    this.catalogData = cloneDeep(this.catalogData);
                });
            });
    }

    private onModalExit() {
        this.hasEditedItemForMediaCodeDataGrid = false;
        this.hasEditedItemForPaymentTypeDataGrid = false;
        this.hasFormEdited = false;
        this.close();
    }

    private getData() {
        this.campaignServiceSubscription = this.campaignService.getCampaignMediaCodeArticleSalesPrice(this.rowData['IdCountryLanguage'], this.rowData['IdSalesCampaignWizard'], this.rowData['IdSalesCampaignArticle']).subscribe(
            (response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.data) {
                        return;
                    }
                    this.mediacodeData = this.datatableService.buildEditableDataSource(cloneDeep(response.item.data));
                    this.setEditModeForForm();
                });
            });
    }

    private getPaymentTypeSalesPriceData() {
        this.paymentTypeDataSubscription = this.campaignService.getPaymentTypeSalesPrice(this.rowData['IdSalesCampaignWizardItems']).subscribe(
            (response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.data) {
                        return;
                    }
                    this.paymentTypeData = this.datatableService.buildEditableDataSource(cloneDeep(response.item.data));
                });
            });
    }

    private setEditModeForForm() {
        setTimeout(() => {
            if (this.widgetFormComponent)
                this.widgetFormComponent.editFormMode = true;
        }, 400);
    }

    private saveCampaignMediaCodeArticleSalesPrice(updateData: any, callbackFunc?: any) {
        this.isSaveSucceeded = false;
        this.campaignServiceSubscription = this.campaignService.saveCampaignMediaCodeArticleSalesPrice(updateData).subscribe((response: ApiResultResponse) => {
            this.appErrorHandler.executeAction(() => {
                if (!Uti.isResquestSuccess(response) ||
                    !(response.item.data ||
                        response.item.data.length ||
                        response.item.data[0][0].EventType === 'Successfully')) {
                    return;
                }
                this.hasEditedItemForMediaCodeDataGrid = false;
                if (!this.hasFormEdited && !this.hasEditedItemForPaymentTypeDataGrid) {
                    this.isSaveSucceeded = true;
                    this.toasterService.pop('success', 'Success', 'Update ' + this.countryName + ' article\'s mediacode price saved successfully');
                    this.onSuccessSaved.emit();
                }
                if (!callbackFunc)
                    this.getData();
                else
                    callbackFunc();
                this.updateRowDataAfterSave();
            });
        });
    }

    private savePaymentTypeSalesPrice(updateData: any, callbackFunc?: any) {
        this.isSaveSucceeded = false;
        this.campaignServiceSubscription = this.campaignService.savePaymentTypeSalesPrice(updateData).subscribe((response: ApiResultResponse) => {
            this.appErrorHandler.executeAction(() => {
                if (!Uti.isResquestSuccess(response) ||
                    !(response.item.data ||
                        response.item.data.length ||
                        response.item.data[0][0].EventType === 'Successfully')) {
                    return;
                }
                this.hasEditedItemForPaymentTypeDataGrid = false;
                if (!this.hasFormEdited && !this.hasEditedItemForMediaCodeDataGrid) {
                    this.isSaveSucceeded = true;
                    this.toasterService.pop('success', 'Success', 'Update ' + this.countryName + ' article\'s payment type sale price saved successfully');
                    this.onSuccessSaved.emit();
                }
                if (!callbackFunc)
                    this.getPaymentTypeSalesPriceData();
                else
                    callbackFunc();
            });
        });
    }

    private updateRowDataAfterSave() {
        if (!this.mediacodeData || !this.mediacodeData.data || !this.mediacodeData.data.length) return;
        for (let item of this.mediacodeData.data) {
            if (item.IsActive) {
                this.rowData['IsSetMediaCodeArticlePrice'] = 1;
                return;
            }
        }
        this.rowData['IsSetMediaCodeArticlePrice'] = 0;
    }

}
