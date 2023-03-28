import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
} from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
    DropdownListModel,
    ControlGridModel,
    MessageModel,
    ApiResultResponse,
    FormOutputModel,
} from "app/models";
import { Configuration } from "app/app.constants";
import { Subscription } from "rxjs/Subscription";
import { ComboBoxTypeConstant, MessageModal } from "app/app.constants";
import {
    CommonService,
    ModalService,
    DatatableService,
    PropertyPanelService,
    AppErrorHandler,
} from "app/services";
import { Uti } from "app/utilities";
import { Router } from "@angular/router";
import { BaseComponent } from "app/pages/private/base";
import { ReducerManagerDispatcher } from "@ngrx/store";
import {
    ProcessDataActions,
    CustomAction,
} from "app/state-management/store/actions";
import cloneDeep from "lodash-es/cloneDeep";

@Component({
    selector: "warehouse-movement-cost",
    templateUrl: "./warehouse-movement-cost.component.html",
})
export class WarehouseMovementCostComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private isDirty = false;
    private outputModel = new FormOutputModel();
    private commonServiceSubscription: Subscription;
    private formValuesChangeSubscription: Subscription;
    private dispatcherSubscription: Subscription;

    public globalNumberFormat = "";
    public isRenderForm: boolean;
    public currencyList: Array<DropdownListModel> =
        new Array<DropdownListModel>();
    public costForm: FormGroup;
    public costGrid: ControlGridModel;
    public descriptionList: Array<DropdownListModel> =
        new Array<DropdownListModel>(
            new DropdownListModel({
                idValue: 1,
                textValue: "Customs costs",
            }),
            new DropdownListModel({
                idValue: 2,
                textValue: "Transport costs",
            })
        );

    @Input() set globalProperties(data: any[]) {
        this.setInputGlobalProperties(data);
    }

    @Output() outputData: EventEmitter<any> = new EventEmitter();

    constructor(
        private consts: Configuration,
        private formBuilder: FormBuilder,
        private commonService: CommonService,
        private modalService: ModalService,
        private datatableService: DatatableService,
        private propertyPanelService: PropertyPanelService,
        private dispatcher: ReducerManagerDispatcher,
        protected router: Router,
        private appErrorHandler: AppErrorHandler
    ) {
        super(router);
    }

    public ngOnInit() {
        this.initForm();
        this.initData();
        this.registerFormValueChange();
        this.subscribeSave();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public add() {
        this.costForm["submitted"] = true;
        this.costForm.updateValueAndValidity();
        if (!this.costForm.valid) {
            return;
        }

        const newGridData = this.costGrid.data;
        const formValue = this.costForm.value;
        newGridData.push({
            description: this.getBy(
                this.descriptionList,
                "idValue",
                formValue.description,
                "textValue"
            ),
            cost: formValue.cost,
            currency: this.getBy(
                this.currencyList,
                "idValue",
                formValue.currency,
                "textValue"
            ),
        });
        let newGrid = this.createCostGrid(newGridData);
        newGrid = this.datatableService.appendRowId(newGrid);
        this.costGrid = cloneDeep(newGrid);

        this.isDirty = true;
        Uti.resetValueForForm(this.costForm);
        this.setFormOutputData(null);
    }

    public onDeleteColumnClickHandler(eventData) {
        if (eventData) {
            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    messageType: MessageModal.MessageType.error,
                    headerText: "Delete Cost",
                    message: [
                        { key: "<p>" },
                        {
                            key: "Modal_Message__Do_You_Want_To_Delete_This_Cost",
                        },
                        { key: "</p>" },
                    ],
                    buttonType1: MessageModal.ButtonType.danger,
                    callBack1: () => {
                        this.deleteCost(eventData);
                        this.isDirty = true;
                        this.setFormOutputData(null);
                    },
                })
            );
        }
    }

    /********************************************************************************************/
    /********************************** PRIVATE METHODS ******************************************/

    /********************************************************************************************/

    private subscribeSave() {
        this.dispatcherSubscription = this.dispatcher
            .filter((action: CustomAction) => {
                return (
                    action.type === ProcessDataActions.REQUEST_SAVE &&
                    action.module.idSettingsGUI == this.ofModule.idSettingsGUI
                );
            })
            .subscribe(() => {
                this.appErrorHandler.executeAction(() => {
                    this.submit();
                });
            });
    }

    private submit() {
        if (!this.isDirty) {
            this.modalService.warningMessage([
                {
                    key: "Modal_Message__No_Entry_Data_For_Saving",
                },
            ]);
            this.setFormOutputData(null);
            return;
        }
        // TODO: call service save data here
    }

    private setInputGlobalProperties(data: any) {
        this.globalNumberFormat =
            this.propertyPanelService.buildGlobalNumberFormatFromProperties(
                data
            );
    }

    private initForm() {
        this.costForm = this.formBuilder.group({
            description: ["", Validators.required],
            cost: ["", Validators.required],
            currency: ["", Validators.required],
        });
        this.costForm["submitted"] = false;
        this.isRenderForm = true;
    }

    private getBy(dataList, byFieldName, byValue, resultFieldName) {
        const result = dataList.find((i) => i[byFieldName] == byValue);
        if (result) {
            return result[resultFieldName];
        }

        return null;
    }

    private initData() {
        const keys: Array<number> = [ComboBoxTypeConstant.currency];

        this.commonServiceSubscription = this.commonService
            .getListComboBox(keys.join(","))
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    this.currencyList = response.item["currency"];
                });
            });

        this.costGrid = {
            columns: this.createCostGridColumns(),
            data: [],
        };
        console.log(this.costGrid);
    }

    private setOutputData(submitResult: any) {
        this.outputData.emit({
            submitResult: submitResult,
            formValue: this.costForm.value,
            isValid: this.costForm.valid,
            isDirty: this.costForm.dirty,
        });
    }

    private registerFormValueChange() {
        this.formValuesChangeSubscription = this.costForm.valueChanges
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((data) => {
                this.appErrorHandler.executeAction(() => {
                    if (!this.costForm.pristine) {
                        //TODO: update later
                    }
                });
            });
    }

    private createCostGrid(data?): ControlGridModel {
        return new ControlGridModel({
            columns: this.createCostGridColumns(),
            data: data || [],
        });
    }

    public createCostGridColumns() {
        const columns = [];
        columns.push(
            this.makeColumn("Description", "descriptionId", true, true)
        );
        columns.push(this.makeColumn("Cost", "cost", true, true));
        columns.push(this.makeColumn("Currency", "currency", true, true));
        columns.push(this.makeColumn("Delete", "delete", true, true));
        return columns;
    }

    private makeColumn(
        title: any,
        columnName: string,
        visible: boolean,
        readOnly?: boolean
    ): any {
        return {
            title: title,
            data: columnName,
            visible: visible,
            readOnly: readOnly,
            setting: {},
        };
    }

    private deleteCost(eventData: any) {
        //TODO: update later
        setTimeout(() => {
            let newGridData = this.costGrid.data;
            newGridData = newGridData.filter(
                (dt) => dt.DT_RowId !== eventData.DT_RowId
            );
            // this.costGrid = this.createCostGrid(newGridData);
        }, 500);
    }

    private setFormOutputData(submitResult: any, returnID?: any) {
        this.setValueOutputModel(submitResult, returnID);
        this.outputData.emit(this.outputModel);
    }

    private setValueOutputModel(submitResult: any, returnID?: any) {
        this.outputModel = new FormOutputModel({
            submitResult: submitResult,
            formValue: {},
            isValid: true,
            isDirty: this.isDirty,
            returnID: returnID,
        });
    }
}
