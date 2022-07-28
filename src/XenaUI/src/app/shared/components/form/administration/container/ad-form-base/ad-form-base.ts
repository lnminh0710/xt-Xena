import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { FormBase } from 'app/shared/components/form/form-base';
import { Subscription } from 'rxjs/Subscription';
import isNil from 'lodash-es/isNil';
import { Observable } from 'rxjs/Observable';
import { SubCommonState } from 'app/state-management/store/reducer/xn-common';
import { FormOutputModel } from 'app/models';
import { FormGroup } from '@angular/forms';

@Injectable()
export abstract class AdministrationFormBase extends FormBase {
    protected mapMenuIdToPersonTypeId: any;
    protected formChangeSubscription: Subscription;
    protected xnComState: Observable<SubCommonState>;
    protected xnComStateSubcription: Subscription;
    protected moduleToPersonTypeState: Observable<any>;
    protected moduleToPersonTypeStateSubcription: Subscription;
    protected subcribeContactFormChange: Subscription;
    protected communicationDataChangeSubscription: Subscription;
    protected forceDirty: boolean = false;

    public addressFGData: any;
    public mainFieldData: any;
    public isCommValid = true;
    public commInputputData: any;
    public commOutputData: any;
    public isRenderedAddressFG: boolean;
    public isRenderedMainField: boolean;
    public listComboBox: any;
    public maxCharactersNotes = this.consts.noteLengthDefault;

    constructor(protected injector: Injector, protected router: Router) {
        super(injector, router);
    }

    public mainFieldConfig = {
        formFieldConfig: {
            principal: true
        },
        commonConfig: {
            headerText: 'Main Information'
        }
    };

    protected checkFormValid(): boolean {
        this.formGroup.updateValueAndValidity();
        return this.formGroup.valid && this.isCommValid;
    }
    
    protected checkFormDirty(): boolean {
        this.formGroup.updateValueAndValidity();
        return this.forceDirty || this.formGroup.dirty || (!isNil(this.commOutputData) && this.commOutputData.length > 0)
    }

    protected initDataForMainField(model: any) {
        if (!this.mainFieldConfig || !this.listComboBox || this.isRenderedMainField || !model) { return; }
        this.mainFieldData = {
            parentFormGroup: this.formGroup,
            formConfig: this.mainFieldConfig,
            data: model,
            listComboBox: this.listComboBox,
            mandatoryData: this.mandatoryData,
            regularExpressionData: this.regularExpressionData
        };
        this.isRenderedMainField = true;
    }

    protected initDataForAddressFG(model: any, isMarkAsPristineForm?: boolean) {
        if (this.isRenderedAddressFG || !this.listComboBox || !model) { return; }
        this.addressFGData = {
            data: model,
            mode: 1,
            listComboBox: this.listComboBox,
            parentFG: this.formGroup,
            mandatoryData: this.mandatoryData,
            regularExpressionData: this.regularExpressionData
        };
        this.isRenderedAddressFG = true;
        setTimeout(() => {
            this.setDefaultDataForForm();
            if (isMarkAsPristineForm) {
                this.formGroup.markAsPristine();
                this.formGroup.markAsUntouched();
            }
        }, 400);
    }

    protected setValueForOutputModel(submitResult: any, data?: any) {
        if ((typeof data) !== 'undefined') {
            this.outputModel = data;
        } else {
            this.outputModel = new FormOutputModel({
                submitResult: submitResult,
                formValue: this.formGroup.value,
                isValid: this.checkFormValid(),
                isDirty: this.checkFormDirty()
            });
        }
    }

    protected updateLeftCharacters(event) {
        setTimeout(() => {
            this.formGroup['leftCharacters'] = this.maxCharactersNotes - event.target.value.length;
        });
    }
}
