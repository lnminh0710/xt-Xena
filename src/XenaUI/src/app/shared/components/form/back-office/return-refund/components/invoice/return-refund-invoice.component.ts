import {
    Component, Input, ViewChild, OnInit, OnDestroy
} from '@angular/core';
import { CommonService, AppErrorHandler, PropertyPanelService } from 'app/services';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
    Store,
    ReducerManagerDispatcher
} from '@ngrx/store';
import isNil from 'lodash-es/isNil';
import { ComboBoxTypeConstant, Configuration } from 'app/app.constants';
import { AppState } from 'app/state-management/store';
import {
    ReturnRefundActions,
    CustomAction
} from 'app/state-management/store/actions';
import { Uti } from 'app/utilities';
import { FormOutputModel, ApiResultResponse } from 'app/models';
import * as returnRefundReducer from 'app/state-management/store/reducer/return-refund';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { Router } from '@angular/router';

@Component({
    selector: 'app-return-refund-invoice',
    styleUrls: ['./return-refund-invoice.component.scss'],
    templateUrl: './return-refund-invoice.component.html'
})
export class ReturnRefundInvoiceComponent extends BaseComponent implements OnInit, OnDestroy {

    // private invoiceState: Observable<any>;
    // private invoiceStateSubscription: Subscription;
    private comServiceSubscription: Subscription;
    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;
    private resetAllSubscription: Subscription;
    protected formValuesChangeSubscription: Subscription;
    private articleSearchData: any = {
        totalAmount: 0,
        gridData: []
    };

    public globalNumberFormat: string = '';
    public isRenderForm: boolean;
    public listComboBox: any;
    public invoiceForm: FormGroup;
    // public invoiceData: any;
    public that: any;

    @Input() parentInstance: any = null;
    @Input() articleGridId: string;
    @Input() articleCampaignSearchGridId: string;

    constructor(
        private store: Store<AppState>,
        private formBuilder: FormBuilder,
        private consts: Configuration,
        private comService: CommonService,
        private appErrorHandler: AppErrorHandler,
        private returnRefundActions: ReturnRefundActions,
        private propertyPanelService: PropertyPanelService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router
    ) {
        super(router);
        this.that = this;

        // this.invoiceState = store.select(state => returnRefundReducer.getReturnRefundState(state, this.ofModule.moduleNameTrim).invoiceNewData);
        this.globalPropertiesState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, ModuleList.Base.moduleNameTrim).globalProperties);
    }

    public ngOnInit() {
        // this.subscribeInvoiceState();
        this.subscribeSubmitForm();
        this.subscribeResetAllState();
        this.initForm();
        this.getInitDropdownlistData();
        this.subscribeGlobalProperties();
        this.subscribeForm();
    }

    // public addNewInvoice() {
    //     if (this.invoiceForm.valid) {
    //         //// submit here
    //         // this.submit()

    //     }
    // }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public makeContextMenu(data?: any) {
        if (!this.parentInstance || !this.parentInstance.makeContextMenu) {
            return [];
        }
        return this.parentInstance.makeContextMenu(data);
    }

    private subscribeForm() {
        this.formValuesChangeSubscription = this.invoiceForm.valueChanges
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((data) => {
                this.appErrorHandler.executeAction(() => {
                    if (this.invoiceForm.pristine) return;
                    this.createOutputModel();
                });
            });
    }
    
    private subscribeResetAllState() {
        this.resetAllSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ReturnRefundActions.RESET_ALL_EDITABLE_FORM && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.reset();
            });
        });
    }
    
    private subscribeSubmitForm() {
        this.resetAllSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ReturnRefundActions.SUBMIT_FORM && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                if (!this.invoiceForm.dirty) return;
                this.invoiceForm['submitted'] = true;
                this.invoiceForm.updateValueAndValidity();
            });
        });
    }

    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription = this.globalPropertiesState.subscribe((globalProperties: any) => {
            this.appErrorHandler.executeAction(() => {
                if (globalProperties) {
                    this.globalNumberFormat = this.propertyPanelService.buildGlobalNumberFormatFromProperties(globalProperties);
                }
            });
        });
    }

    private reset() {
        Uti.resetValueForForm(this.invoiceForm);
        this.initValueForCurrency();
    }

    private getInitDropdownlistData() {
        this.comServiceSubscription = this.comService.getListComboBox(ComboBoxTypeConstant.currency + '')
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.currency) {
                        return;
                    }
                    this.listComboBox = response.item;
                    this.initValueForCurrency();
                    this.isRenderForm = true;
                });
            });
    }

    private initValueForCurrency() {
        if (this.listComboBox && this.listComboBox.currency && this.listComboBox.currency.length) {
            this.invoiceForm.controls['currency'].setValue(this.listComboBox.currency[0].idValue);
        }
    }

    private initForm() {
        this.invoiceForm = this.formBuilder.group({
            isFreeShipping: true,
            amount: ['', Validators.required],
            currency: ['', Validators.required],
            totalAmount: null
        });
        this.invoiceForm['submitted'] = false;
        // this.store.dispatch(this.returnRefundActions.requestUpdateInvoiceNewData(this.createOutputModel(), this.ofModule));
    }

    // private subscribeInvoiceState() {
    //     this.invoiceStateSubscription = this.invoiceState.subscribe((data) => {
    //         this.appErrorHandler.executeAction(() => {
    //             if (data) {
    //                 this.invoiceData = data;
    //                 if (this.invoiceForm && data.formValue && !isNil(data.formValue.totalAmount)) {
    //                     this.invoiceForm.controls['totalAmount'].setValue(data.formValue.totalAmount);
    //                 }
    //             }
    //         });
    //     });
    // }

    public outputDataHandler(data) {
        if (!data) return;
        if (this.invoiceForm && !isNil(data.totalAmount)) {
            this.invoiceForm.controls['totalAmount'].setValue(data.totalAmount);
        }
        this.articleSearchData = data;
        this.createOutputModel();
    }


    private createOutputModel() {
        let outputData = new FormOutputModel();
        outputData.isDirty = this.invoiceForm.dirty || !!(this.articleSearchData.gridData.length);
        outputData.isValid = this.invoiceForm.valid || !!(this.articleSearchData.gridData.length);
        if (this.invoiceForm) {
            outputData.formValue = this.invoiceForm.value;
        }
        outputData.formValue['totalAmount'] = this.articleSearchData.totalAmount;
        outputData.formValue['gridData'] = this.articleSearchData.gridData;
        this.store.dispatch(this.returnRefundActions.requestUpdateInvoiceNewData(outputData, this.ofModule));
    }
}
