import {
    Component, ChangeDetectionStrategy, Output, EventEmitter,
    ChangeDetectorRef, ViewChild, OnInit, OnDestroy, Input
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
    CommonService,
    ArticleService,
    AppErrorHandler,
    PropertyPanelService
} from 'app/services';
import { ComboBoxTypeConstant, Configuration } from 'app/app.constants';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Uti } from 'app/utilities';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { ApiResultResponse } from 'app/models';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import {
    ProcessDataActions,
    CustomAction
} from 'app/state-management/store/actions';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
    selector: 'app-article-purchasing-form',
    styleUrls: ['./article-purchasing-form.component.scss'],
    templateUrl: './article-purchasing-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlePurchasingFormComponent extends BaseComponent implements OnInit, OnDestroy {
    public isRenderForm: boolean;
    private listComboBox: any;
    private isRegistComboboxValueChange = false;
    private articleId: any;
    private data: any;
    private articlePurchasingForm: FormGroup;
    public globalNumberFormat: string = null;

    private selectedEntityState: Observable<any>;

    private selectedEntityStateSubscription: Subscription;
    private formChangeSubscription: Subscription;
    private getVatDataSubscription: Subscription;
    private dispatcherSubscription: Subscription;
    private articleServiceSubscription: Subscription;
    private commonServiceSubscription: Subscription;

    private outputModel: {
        submitResult?: boolean,
        formValue: any,
        isValid?: boolean,
        isDirty?: boolean,
        returnID?: string
    };
    @Output() outputData: EventEmitter<any> = new EventEmitter();

    @Input() set globalProperties(globalProperties: any[]) {
        this.globalNumberFormat = this.propertyPanelService.buildGlobalNumberFormatFromProperties(globalProperties);
    }

    @ViewChild('idRepIsoCountryCode') idRepIsoCountryCodeCombobox: AngularMultiSelect;

    constructor(
        private consts: Configuration,
        private ref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private commonService: CommonService,
        private articleService: ArticleService,
        private store: Store<AppState>,
        private appErrorHandler: AppErrorHandler,
        private propertyPanelService: PropertyPanelService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router
    ) {
        super(router);

        this.selectedEntityState = this.store.select(state => processDataReducer.getProcessDataState(state, this.ofModule.moduleNameTrim).selectedEntity);
    }

    public ngOnInit() {
        this.getArticlePurchasingEmptyData();
        this.initEmptyData();
        this.getDropdownlistData();
        this.subcribtion();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private unsubscribeVat() {
        if (this.getVatDataSubscription) {
            this.getVatDataSubscription.unsubscribe();
        }
    }

    private subcribtion() {
        this.selectedEntityStateSubscription = this.selectedEntityState.subscribe((selectedEntityState: any) => {
            this.appErrorHandler.executeAction(() => {
                if (selectedEntityState && selectedEntityState.id) {
                    this.articleId = selectedEntityState.id;
                    this.ref.markForCheck();
                }
            });
        });

        this.dispatcherSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.REQUEST_SAVE && action.module.idSettingsGUI == this.ofModule.idSettingsGUI;
        }).subscribe(() => {
            this.appErrorHandler.executeAction(() => {
                this.onSubmit();
            });
        });
    }

    private getArticlePurchasingEmptyData() {
        // TODO: refactor to get lable data from article purchasing service.
        this.articleServiceSubscription = this.articleService.getArticleById('')
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    // this.data = data.item;
                    this.createFakeModelData();
                    this.initDataForForm();
                });
            });
    }

    private getDropdownlistData() {
        this.commonServiceSubscription = this.commonService.getListComboBox(
            ComboBoxTypeConstant.countryCode + ',' +
            ComboBoxTypeConstant.currency)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.countryCode) {
                        return;
                    }
                    this.listComboBox = response.item;
                    this.initDataForForm();
                });
            });
    }

    private initDataForForm() {
        if (!this.data || !this.listComboBox || this.isRenderForm) { return; }
        // TODO: will remove when have correct data
        this.isRenderForm = true;
        this.updateFormValue();
        this.ref.markForCheck();
    }

    private updateFormValue() {
        setTimeout(() => {
            this.updateFormMainValue();
            this.registComboboxValueChange();
            this.ref.markForCheck();
        });
    }

    private updateFormMainValue() {
        if (this.formChangeSubscription) this.formChangeSubscription.unsubscribe();

        this.formChangeSubscription = this.articlePurchasingForm.valueChanges
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((data) => {
                this.appErrorHandler.executeAction(() => {
                    if (!this.articlePurchasingForm.pristine) {
                        this.setOutputData(null);
                    }
                });
            });
    }

    private formGroupSubscriptionIdRepIsoCountryCode: Subscription;
    private formGroupSubscriptionCurrency: Subscription;

    private registComboboxValueChange() {
        if (this.isRegistComboboxValueChange) { return; }

        if (this.formGroupSubscriptionIdRepIsoCountryCode) this.formGroupSubscriptionIdRepIsoCountryCode.unsubscribe();
        if (this.formGroupSubscriptionCurrency) this.formGroupSubscriptionCurrency.unsubscribe();

        this.formGroupSubscriptionIdRepIsoCountryCode = Uti.updateFormComboboxValue(this.articlePurchasingForm, this.listComboBox.countryCode,
            this.articlePurchasingForm, 'idRepIsoCountryCode', 'idRepIsoCountryCodeText');

        this.formGroupSubscriptionCurrency = Uti.updateFormComboboxValue(this.articlePurchasingForm, this.listComboBox.currency,
            this.articlePurchasingForm, 'currency', 'currencyText');

        this.isRegistComboboxValueChange = true;
        this.ref.markForCheck();
    }
    private initEmptyData() {
        this.articlePurchasingForm = this.formBuilder.group({
            idRepIsoCountryCode: ['', Validators.required],
            idRepIsoCountryCodeText: null,
            price: ['', Validators.required],
            currency: ['', Validators.required],
            currencyText: null,
            vat: ['', Validators.required],
            vatText: null
        });
        Uti.registerFormControlType(this.articlePurchasingForm, {
            dropdown: 'idRepIsoCountryCode;price;currency;vat',
            number: 'price'
        });
        this.articlePurchasingForm['submitted'] = false;
    }

    public onSubmit(event?: any) {
        this.articlePurchasingForm['submitted'] = true;
        try {
            this.articlePurchasingForm.updateValueAndValidity();
            if (!this.articlePurchasingForm.valid) {
                this.setOutputData(null);
                this.ref.markForCheck();
                return false;
            }

            this.createArticlePurchasing();
        } catch (ex) {
            this.articlePurchasingForm['submitted'] = true;
            return false;
        }

        return false;
    }

    private setOutputData(submitResult: any, data?: any) {
        if ((typeof data) !== 'undefined') {
            this.outputModel = data;
        } else {
            this.outputModel = {
                submitResult: submitResult, formValue: this.articlePurchasingForm.value,
                isValid: this.articlePurchasingForm.valid, isDirty: this.articlePurchasingForm.dirty
            };
        }
        this.outputData.emit(this.outputModel);
    }

    private createArticlePurchasing() {
        this.articleServiceSubscription = this.articleService.createArticlePurchasing(this.prepareSubmitCreateData())
            .subscribe(
                (data) => {
                    this.appErrorHandler.executeAction(() => {
                        if (!data.item.returnID) {
                            this.setOutputData(false, {
                                submitResult: false, formValue: this.articlePurchasingForm.value,
                                isValid: false, isDirty: true, returnID: data.item.returnID, errorMessage: data.item.sqlStoredMessage
                            });
                        } else {
                            this.setOutputData(false, {
                                submitResult: true, formValue: this.articlePurchasingForm.value,
                                isValid: true, isDirty: false, returnID: data.item.returnID
                            });
                            Uti.resetValueForForm(this.articlePurchasingForm);
                        }

                        this.ref.markForCheck();
                    });
                },
                (err) => {
                    this.appErrorHandler.executeAction(() => {
                        this.setOutputData(false);
                    });
                });
    }

    private formGroupSubscriptionVat: Subscription;

    public onChangeCountry($event: any) {
        if (!this.idRepIsoCountryCodeCombobox || !this.idRepIsoCountryCodeCombobox.selectedValue) {
            this.listComboBox.vat = [];
            this.unsubscribeVat();
            this.ref.markForCheck();
            return;
        }
        this.getVatDataSubscription = this.commonService.getComboBoxDataByCondition('VAT', this.idRepIsoCountryCodeCombobox.selectedValue).subscribe(
            (response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    let data = response.item;
                    this.listComboBox.vat = (!data || !data.vat || !data.vat.length) ? [] : data.vat;

                    if (this.formGroupSubscriptionVat) this.formGroupSubscriptionVat.unsubscribe();

                    this.formGroupSubscriptionVat = Uti.updateFormComboboxValue(this.articlePurchasingForm, this.listComboBox.vat, (this.articlePurchasingForm), 'vat', 'vatText');
                    this.ref.markForCheck();
                });
            });
    }
    private prepareSubmitCreateData() {
        this.articlePurchasingForm.updateValueAndValidity();
        const model = this.articlePurchasingForm.value;
        return [{
            'IdArticle': this.articleId,
            'IdRepIsoCountryCode': model.idRepIsoCountryCode,
            'IdRepCurrencyCode': model.currency,
            'IdRepVat': model.vat,
            'Price': model.price,
            'IsActive': true
        }];
    }
    private createFakeModelData() {
        this.data = {
            idRepIsoCountryCode: {
                displayValue: 'Country'
            },
            price: {
                displayValue: 'Price'
            },
            currency: {
                displayValue: 'Currency'
            },
            vat: {
                displayValue: 'VAT'
            }
        };
    }
}
