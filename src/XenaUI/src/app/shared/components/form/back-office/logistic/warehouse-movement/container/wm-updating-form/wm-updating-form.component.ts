import {
    Component, OnInit, OnDestroy,
    Output, EventEmitter, Injector,
    AfterViewInit, ViewChild
} from '@angular/core';
import {Validators} from '@angular/forms';
import {ControlGridModel, FormOutputModel} from 'app/models';
import {WarehuoseMovementEditFormFakeData} from './fake-data';
import {Subscription} from 'rxjs/Subscription';
import {Uti} from 'app/utilities';
import {Store, ReducerManagerDispatcher} from '@ngrx/store';
import {AppState} from 'app/state-management/store';
import {Observable} from 'rxjs/Observable';
import {
    PropertyPanelService,
    CommonService,
    ModalService,
    WareHouseMovementService
} from 'app/services';
import {FormBase} from 'app/shared/components/form/form-base';
import {ApiResultResponse} from 'app/models';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import {Router} from '@angular/router';
import {ToasterService} from 'angular2-toaster/angular2-toaster';
import {ModuleList} from 'app/pages/private/base';
import {
    ProcessDataActions,
    CustomAction
} from 'app/state-management/store/actions';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { WarehouseMovementSelectArticleComponent } from 'app/shared/components/form/back-office';

@Component({
    selector: 'warehouse-movement-updating-form',
    styleUrls: ['./wm-updating-form.component.scss'],
    templateUrl: './wm-updating-form.component.html'
})
export class WarehouseMovementUpdatingFormComponent extends FormBase implements OnInit, OnDestroy, AfterViewInit {
    // TODO: will remove when has service
    private fake = new WarehuoseMovementEditFormFakeData();
    // End TODO
    public globalDateFormat = '';
    public dontShowCalendarWhenFocus: boolean;
    public globalProperties: any;
    private isArticleValid = true;
    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;
    private selectedArticleData: any;
    private comServiceSubscription: Subscription;
    private saveDataSubscription: Subscription;
    private dispatcherSubscription: Subscription;

    public listComboBox: any;
    public perfectScrollbarConfig: any;
    public isRenderForm: boolean;
    public selectedArticleGrid: ControlGridModel = new ControlGridModel();

    @Output() outputData: EventEmitter<any> = new EventEmitter();
    @ViewChild('warehouseMovementSelectArticle') private warehouseMovementSelectArticle: WarehouseMovementSelectArticleComponent;

    constructor(
        private store: Store<AppState>,
        private comService: CommonService,
        private wareHouseMovementService: WareHouseMovementService,
        private modalService: ModalService,
        private propertyPanelService: PropertyPanelService,
        protected toasterService: ToasterService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router,
        protected injector: Injector
    ) {
        super(injector, router);
        this.globalPropertiesState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, ModuleList.Base.moduleNameTrim).globalProperties);

        this.formEditModeState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).formEditMode);
        this.formEditDataState = store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).formEditData);
    }

    public ngOnInit() {
        this.initFormData();
        this.initData();
        this.initPerfectScroll();
        this.subscribeFormEditModeState();
        this.subscribeGlobalProperties();
        this.subcribeRequestSaveState();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public ngAfterViewInit() {
        this.afterViewInit();
        if (this.mainId) return;
        this.registerFormValueChange();
    }

    public submit() {
        this.validation();
        this.callSubmit();
        this.warehouseMovementSelectArticle.gridStopEditing();
        setTimeout(() => {
            if (!this.formGroup.valid) {
                this.outputData.emit({
                    submitResult: false,
                    isValid: false
                });
                return;
            }
            if (!this.isDirty()) {
                this.outputData.emit({
                    submitResult: false,
                    isValid: false,
                    errorMessage: 'You must change something on article to save data'
                });
                return;
            }
            if (!this.isArticleValid) {
                this.outputData.emit({
                    submitResult: false,
                    isValid: false,
                    errorMessage: 'You must complete the Article selected data'
                });
                return;
            }

            // Need value of grid updated when editing
            this.callSaveData(this.prepareSubmitData());
        }, 500);
    }

    private validation() {
        this.isArticleValid = this.warehouseMovementSelectArticle.isValid();
    }

    private callSaveData(saveData: any) {
        this.saveDataSubscription = this.wareHouseMovementService.saveWarehouseMovement(saveData)
        .subscribe((response: any) => {
                this.appErrorHandler.executeAction(() => {
                    const returnId = response ? (response.returnID || null) : null;
                    const errorMessage = response ? (response.errorMessage || null) : '';
                    this.setFormOutputData(true, returnId, errorMessage);
                });
            },
            (err) => {
                this.setFormOutputData(true, null);
            });
    }

    public isDirty() {
        return !!(this.selectedArticleData && this.selectedArticleData.formValue && (
                (this.selectedArticleData.formValue.insertedData && this.selectedArticleData.formValue.insertedData.length) ||
                (this.selectedArticleData.formValue.deletedData && this.selectedArticleData.formValue.deletedData.length) ||
                (this.selectedArticleData.formValue.editedData && this.selectedArticleData.formValue.editedData.length)
            )) ||
            this.formGroup.dirty;
    }

    public isValid() {
        return this.isDirty() || this.formGroup.valid;
    }

    public prepareSubmitData() {
        const model = this.formGroup.value;
        let saveData = {
            WareHouseMovement: {
                IdWarehouseMovement: this.mainId || null,
                IdPersonFromWarehouse: model.fromWarehouseId,
                IdPersonToWarehouse: model.toWarehouseId,
                IdRepCurrencyCode: model.currency,
                EstimateDeliveryDate: model.estimateDeliveryDate,
                ConfirmDate: model.confirmDate,
                NotesForRecipient: model.noteForRecipient,
                IsActive: '1',
                Notes: model.notes
            },
            JSONMovementArticles: this.prepareDataForArticle(model.deliveryDate)
        };
        return saveData;
    }

    public selectArticleOutput($event: any) {
        this.selectedArticleData = $event;
        this.setFormOutputData(null);
    }

    public onArticleHasError(event) {
        this.isArticleValid = !event;
        this.setFormOutputData(null);
    }

    protected getEditData() {
        setTimeout(() => {
            if (!this.isRenderForm) {
                this.getEditData();
                return;
            }
            this.wareHouseMovementService.getWarehouseMovement(this.mainId)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) return;
                    this.bindDataForForm(response.item);
                });
            });
            this.getSelectedArticles();
        }, 400);
    }

        protected setFormOutputData(submitResult: any, returnID?: any, errorMessage?: string) {
        this.setValueForOutputModel(new FormOutputModel({
            submitResult: submitResult,
            formValue: this.formEditData,
            isValid: this.isValid(),
            isDirty: this.isDirty(),
            returnID: returnID,
            errorMessage: errorMessage || null
        }));
    }

    /********************************************************************************************/
    /********************************** PRIVATE METHODS ******************************************/
    /********************************************************************************************/

    private prepareDataForArticle(deliveryDate: any) {
        if (!this.selectedArticleData ||
            !this.selectedArticleData.formValue) return [];
        return [...this.getAddItem(), ...this.getEditItem(), ...this.getDeleteItem()];
    }

    private getAddItem(): Array<any> {
        if (!this.selectedArticleData.formValue.insertedData ||
            !this.selectedArticleData.formValue.insertedData.length) return [];
        return this.selectedArticleData.formValue.insertedData.map(x => {
            return {
                IdArticle: x.articleId,
                IdArticleNew: x.addToArticleNumberValue || null,
                QuantityToMove: x.quantity,
                FakePrice: x.fakePrice,
                PurchaisePrice: x.purchasingPrice,
                DeliveryDate: this.formGroup.value.deliveryDate || null,
                IsActive: '1'
            }
        });
    }

    private getEditItem(): Array<any> {
        if (!this.selectedArticleData.formValue.editedData ||
            !this.selectedArticleData.formValue.editedData.length) return [];
        return this.selectedArticleData.formValue.editedData.map(x => {
            return {
                IdWarehouseMovementGoodsIssue: x.idWarehouseMovementGoodsIssue,
                IdArticle: x.articleId,
                IdArticleNew: x.addToArticleNumberValue || null,
                QuantityToMove: x.quantity,
                FakePrice: x.fakePrice,
                PurchaisePrice: x.purchasingPrice,
                DeliveryDate: x.DeliveryDate,
                IsActive: '1'
            }
        });
    }

    private getDeleteItem(): Array<any> {
        if (!this.selectedArticleData.formValue.deletedData ||
            !this.selectedArticleData.formValue.deletedData.length) return [];
        return this.selectedArticleData.formValue.deletedData.map(x => {
            return {
                IdWarehouseMovementGoodsIssue: x.idWarehouseMovementGoodsIssue,
                IsDeleted: '1'
            }
        });
    }

    private bindDataForForm(data: any) {
        data = Uti.mapObjectValueToGeneralObject(data);
        Uti.setValueForFormWithStraightObject(this.formGroup, data, {
            idWarehouseMovement: this.mainId,
            estimateDeliveryDate: 'datetime',
            confirmDate: 'datetime',
            deliveryDate: 'datetime',
            dateFormatString: 'dd.MM.yyyy'
        });
        this.registerFormValueChange();
    }

    private getSelectedArticles() {
        this.wareHouseMovementService.getSelectedArticles(this.mainId)
        .subscribe((response: ApiResultResponse) => {
            this.appErrorHandler.executeAction(() => {
                if (!Uti.isResquestSuccess(response)) return;
                this.mapSelectArticleGridData(response.item.data);
            });
        });
    }

    private mapSelectArticleGridData(response: any) {
        if (!response || response.length < 2) return;
        let data = response[1].map(x => {
            return {
                idWarehouseMovementGoodsIssue: x['IdWarehouseMovementGoodsIssue'],
                articleId: x['IdArticle'],
                articleNumber: x['ArticleNr'],
                addToArticleNumber: x['New ArticleNr'],
                addToArticleNumberValue: x['IdArticleNew'],
                // addToArticleNumber: { key: 762, value: '120300', options: []},
                articleName: x['Article Name'],
                quantity: x['QuantityToMove'],
                available: x['Available'],
                fakePrice: x['FakePrice'],
                purchasingPrice: x['PurchasingPrice']
            }
        });
        this.selectedArticleGrid = {
            columns: this.fake.createArrivedArticleData().columns,
            data: data
        }
    }

    private subscribeFormEditModeState() {
        this.formEditModeStateSubscription = this.formEditModeState.subscribe((formEditModeState: boolean) => {
            this.appErrorHandler.executeAction(() => {
                this.formEditMode = formEditModeState;
            });
        });

        this.formEditDataStateSubscription = this.formEditDataState.subscribe((formEditDataState: any) => {
            this.appErrorHandler.executeAction(() => {
                this.formEditData = formEditDataState;
            });
        });
    }

    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription = this.globalPropertiesState.subscribe((globalProperties: any) => {
            this.appErrorHandler.executeAction(() => {
                this.globalProperties = globalProperties;
                if (globalProperties) {
                    this.globalDateFormat = this.propertyPanelService.buildGlobalInputDateFormatFromProperties(globalProperties);
                    this.dontShowCalendarWhenFocus = this.propertyPanelService.getValueDropdownFromGlobalProperties(globalProperties);
                }
            });
        });
    }

    private initPerfectScroll() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
    }

    private initFormData() {
        this.initForm({
            fromWarehouseId: ['', Validators.required],
            toWarehouseId: ['', Validators.required],
            estimateDeliveryDate: ['', Validators.required],
            currency: '',
            deliveryDate: '',
            confirmDate: '',
            notes: '',
            noteForRecipient: ''
        });

        this.selectedArticleGrid = this.fake.createArrivedArticleData();
    }

    private initData() {
        this.getDropDownListData();
    }

    private getDropDownListData() {
        this.comServiceSubscription = this.comService.getListComboBox('WareHouse,Currency')
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    this.isRenderForm = true;
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    this.listComboBox = response.item;
                });
            });
    }

    private registerFormValueChange() {
        setTimeout(() => {
            this.formValuesChangeSubscription = this.formGroup.valueChanges
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((data) => {
                this.appErrorHandler.executeAction(() => {
                    if (!this.formGroup.pristine) {
                        this.setFormOutputData(null);
                    }
                });
            });
        }, 1000);
    }

    private subcribeRequestSaveState() {
        this.dispatcherSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.REQUEST_SAVE && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.submit();
            });
        });
    }
}
