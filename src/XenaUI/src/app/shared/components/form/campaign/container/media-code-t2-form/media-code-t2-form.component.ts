import * as wjcCore from "wijmo/wijmo";
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    ViewChild,
    OnDestroy,
    ElementRef,
} from "@angular/core";
import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators,
} from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import {
    CampaignService,
    AppErrorHandler,
    ModalService,
    PropertyPanelService,
    DatatableService,
    DownloadFileService,
} from "app/services";
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { AppState } from "app/state-management/store";
import { RowData } from "app/state-management/store/reducer/widget-content-detail";
import { Uti, CustomValidators } from "app/utilities";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import { FormSaveEvenType } from "app/app.constants";
import {
    TabButtonActions,
    ProcessDataActions,
    CustomAction,
} from "app/state-management/store/actions";
import { WidgetTemplateSettingService } from "app/services";
import { ApiResultResponse, FormOutputModel } from "app/models";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import * as processDataReducer from "app/state-management/store/reducer/process-data";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import * as widgetContentReducer from "app/state-management/store/reducer/widget-content-detail";
import { InputDebounceComponent } from "app/shared/components/xn-control/xn-input-debounce";
import { MessageModal } from "app/app.constants";
import uniqBy from "lodash-es/uniqBy";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";
import { FileUploadComponent } from "app/shared/components/xn-file";

@Component({
    selector: "media-code-t2-form",
    styleUrls: ["./media-code-t2-form.component.scss"],
    templateUrl: "./media-code-t2-form.component.html",
})
export class MediaCodeT2FormComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    static idSalesCampaignWizardItems: any;

    public countryLanguageList = [];
    public currentIdSalesCampaignWizardItems: any;
    public mediaCodeT2Form: FormGroup;
    public countryLanguageForm: FormGroup;
    public dataSourceTable: any;
    public acceptExtensionFiles = ".json, .xls, .xlsx";
    public formValid = true;
    public disableForm = false;
    public globalNumberFormat: string = null;
    public mediaCodeTableStyle: any = {};
    public isSearching: boolean = false;
    public pageId: string;
    public globalProps: any[] = [];

    private messageIncorrectFile = [];
    private messageDuplicationMediaCode = [];
    private selectedEntityState: Observable<any>;
    private selectedEntityStateSubscription: Subscription;
    private checkExistingMediaCodeSubscription: Subscription;
    private rowCampaignMediaMainDataState: Observable<RowData>;
    private rowCampaignMediaMainDataStateSubscription: Subscription;
    private campaignServiceSubscription: Subscription;
    private dispatcherSubscription: Subscription;

    //private serverApiUrl = '/api/FileManager/GetFile?name=Campaign-T2-media-code.zip&mode=4';
    private correctColumnsName = ["MediaCode", "MediaCodeLabel", "Quantity"];
    private isGridDirty = false;
    private deleteItem = [];
    private saveData = [];
    private cachedGridData = [];
    private editedItems = [];
    private compaignId: any;
    private allowToChangeCountry = true;
    private willChangeCountry: any = null;
    private gridValid = true;
    private mediacode: FormControl;
    private countryLanguageIsFocus: boolean = false;
    private outputModel: FormOutputModel;
    private _messageIncorrectFile: string = "";
    private _messageDuplicationMediaCode: string = "";
    private _fileUploadCounter = 0;
    private _fileUploadErrorCounter = 0;
    private _fileUploadResponses: Array<any> = [];
    private _mediaCodeNrs = "";
    private _filesUploading: Array<any> = [];

    @Input() set globalProperties(globalProperties: any[]) {
        this.globalProps = globalProperties;
        this.globalNumberFormat =
            this.propertyPanelService.buildGlobalNumberFormatFromProperties(
                globalProperties
            );
    }
    @Input() gridId: string;

    @Input() set layoutInfo(layoutInfo: any) {
        this.mediaCodeTableStyle = {
            // 'height': `calc(100vh - ${layoutInfo.globalSearchHeight}px
            height: `calc(100vh - ${layoutInfo.headerHeight}px
                                  - ${layoutInfo.tabHeaderHeight}px
                                  - ${layoutInfo.formPadding}px
                                  - ${35}px)`,
        };
    }

    @Output() outputData: EventEmitter<any> = new EventEmitter();

    @ViewChild(XnAgGridComponent) private gridComponent: XnAgGridComponent;
    @ViewChild("countryLanguage") wjCountryLanguage: AngularMultiSelect;
    @ViewChild("mediaCodeCtrl") mediaCodeCtrl: InputDebounceComponent;
    @ViewChild("buttonAddMediaCode") buttonAddMediaCode: ElementRef;
    @ViewChild("mediaCodeFileUpload") mediaCodeFileUpload: FileUploadComponent;

    constructor(
        private store: Store<AppState>,
        private campaignService: CampaignService,
        private formBuilder: FormBuilder,
        private appErrorHandler: AppErrorHandler,
        private tabButtonActions: TabButtonActions,
        private modalService: ModalService,
        private propertyPanelService: PropertyPanelService,
        private countryLanguageService: WidgetTemplateSettingService,
        private datatableService: DatatableService,
        private toasterService: ToasterService,
        private processDataActions: ProcessDataActions,
        private dispatcher: ReducerManagerDispatcher,
        private downloadFileService: DownloadFileService,
        protected router: Router
    ) {
        super(router);

        this.selectedEntityState = store.select(
            (state) =>
                processDataReducer.getProcessDataState(
                    state,
                    this.ofModule.moduleNameTrim
                ).selectedEntity
        );
        this.rowCampaignMediaMainDataState = store.select(
            (state) =>
                widgetContentReducer.getWidgetContentDetailState(
                    state,
                    this.ofModule.moduleNameTrim
                ).rowCampaignMediaMainData_T2
        );
        this.pageId = Uti.guid();
    }

    public ngOnInit() {
        this.buildForm();
        this.subcribtion();
        this.mediaCodeT2Form["submitted"] = false;
    }

    public ngOnDestroy() {
        MediaCodeT2FormComponent.idSalesCampaignWizardItems = null;
        Uti.unsubscribe(this);
    }

    public downloadTeamplate($event) {
        this.downloadFileService.makeDownloadFile(
            "Campaign-T2-media-code.zip",
            null,
            null,
            4
        );
    }

    public onCompleteImportItem(event) {
        this._fileUploadCounter++;
        if (!this.checkCountryLanguage()) {
            this._fileUploadCounter = 0;
            return;
        }
        const mediaItems: Array<any> = event.response;
        if (!mediaItems || !mediaItems.length) return;
        if (!this.checkCorrectImportData(mediaItems)) {
            this._messageIncorrectFile +=
                "<li>" + event.item.file.name + "</li>";
            event.item.isSuccess = false;
            event.item.isError = true;
            this._fileUploadErrorCounter++;
            if (
                this._fileUploadCounter ===
                    this.mediaCodeFileUpload.uploader.queue.length &&
                !!this._fileUploadErrorCounter
            ) {
                this.showMesageOfUploadFile();
            }
            return;
        }
        mediaItems.forEach((item) => {
            const mediaCode = (item.MediaCode + "").trim();
            this._mediaCodeNrs += mediaCode ? mediaCode + ";" : "";
        });
        this._fileUploadResponses.push(event);
        if (
            this._fileUploadCounter <
            this.mediaCodeFileUpload.uploader.queue.length
        ) {
            return;
        }
        if (
            this._fileUploadCounter ===
                this.mediaCodeFileUpload.uploader.queue.length &&
            !!this._fileUploadErrorCounter
        ) {
            this.showMesageOfUploadFile();
            return;
        }
        this.checkExistingMediaCodeMulti();
    }

    public onFileChangedHandler($event) {
        this._filesUploading.push(...$event);
    }

    public addMediaCode({ value, valid }: { value: any; valid: boolean }) {
        if (!this.checkCountryLanguage()) {
            return;
        }
        this.mediaCodeT2Form.updateValueAndValidity();
        this.mediaCodeT2Form["submitted"] = true;
        if (valid && value && this.mediaCodeT2Form.valid) {
            if (this.isExistedInGrid(value.MediaCode)) {
                this.modalService.warningMessageHtmlContent({
                    message: [
                        { key: "<p>" },
                        { key: "Modal_Message__This_MediaCode_Is_Existed" },
                        { key: "</p><p>" },
                        { key: value.MediaCode },
                        { key: "</p>" },
                    ],
                });
                return;
            }
            value.IdSalesCampaignMediaCode = Uti.getTempId();
            this.gridComponent.addNewRow(value);
            this.setGridDirty();
            Uti.resetValueForForm(this.mediaCodeT2Form);
            this.focusMediaCode();
        } else {
            this.focusOnInvalidControl();
        }
    }

    public wjCountryLanguage_GotFocus($event): void {
        this.countryLanguageIsFocus = true;
    }

    public wjCountryLanguage_LostFocus($event): void {
        this.countryLanguageIsFocus = false;
    }

    public amountNumberKeyUp($event) {
        if ($event.keyCode === 13) {
            this.buttonAddMediaCode["_elementRef"].nativeElement.click();
        }
    }

    public onDeleteRows(event) {
        this.setGridDirty();
    }

    itemFormatter(index, item) {
        let newContent =
            '<div class="col-md-12  col-lg-12 xn-wj-ddl-item"><div class="col-sm-5 no-padding-left" >{Country}</div><div class="col-sm-1" style="display:none" >-</div><div class="col-sm-5 no-padding-right border-left" >{Language}&nbsp;</div></div>';
        newContent = newContent.replace("{Country}", item.Country);
        newContent = newContent.replace("{Language}", item.Language);
        return newContent;
    }

    public wjCountryLanguageSelectedIndexChanged(event) {
        if (this.allowToChangeCountry) {
            if (this.wjCountryLanguage.selectedItem) {
                this.willChangeCountry = null;

                if (this.checkDirtyAndGetSaveData()) {
                    this.modalService.unsavedWarningMessage({
                        headerText: "Saving Changes",
                        message: [
                            { key: "<p>" },
                            {
                                key: "Modal_Message__You_Have_Unsaved_Mediacode_Saving_Change",
                            },
                            { key: "</p>" },
                        ],
                        onModalSaveAndExit: () => {
                            this.allowToChangeCountry = false;
                            this.willChangeCountry =
                                this.wjCountryLanguage.selectedValue;
                            this.submit();
                        },
                        onModalExit: () => {
                            this.currentIdSalesCampaignWizardItems =
                                this.wjCountryLanguage.selectedValue;
                            this.loadMediaCodeByCountry(
                                this.currentIdSalesCampaignWizardItems
                            );
                        },
                        onModalCancel: () => {
                            this.allowToChangeCountry = false;
                            this.wjCountryLanguage.selectedValue =
                                this.currentIdSalesCampaignWizardItems;
                        },
                    });
                } else {
                    if (this.countryLanguageIsFocus) {
                        this.currentIdSalesCampaignWizardItems =
                            this.wjCountryLanguage.selectedValue;
                        this.loadMediaCodeByCountry(
                            this.currentIdSalesCampaignWizardItems
                        );
                    }
                }
            }
        }
        this.allowToChangeCountry = true;
    }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/

    private buildForm() {
        //this.mediacode = new FormControl(null, Validators.compose([CustomValidators.required]), this.validateArticleNr.bind(this));
        this.mediaCodeT2Form = this.formBuilder.group({
            MediaCode: [
                "",
                CustomValidators.required,
                this.validateArticleNr.bind(this),
            ],
            MediaCodeLabel: ["", CustomValidators.required],
            Quantity: ["", Validators.required],
        });
        this.countryLanguageForm = this.formBuilder.group({
            countryLanguage: ["", Validators.required],
        });
        this.mediaCodeT2Form["submitted"] = false;
        this.mediaCodeT2Form.updateValueAndValidity();
        this.countryLanguageForm["submitted"] = false;
        this.countryLanguageForm.updateValueAndValidity();
    }

    private validateArticleNr(c: FormControl) {
        this.isSearching = true;
        return this.campaignService
            .checkMediaCodeNumber(c.value)
            .finally(() => {
                this.isSearching = false;
            });
    }

    private buildComboboxDataSource(idSalesCampaignWizard): void {
        // For Country Language DataSource
        this.countryLanguageService
            .getCountryLanguage({
                IdSalesCampaignWizard: idSalesCampaignWizard,
            })
            .subscribe((result) => {
                this.appErrorHandler.executeAction(() => {
                    if (!result || !result.length) {
                        return;
                    }

                    this.countryLanguageList = result;

                    // Set Selected Value
                    setTimeout(() => {
                        if (!this.currentIdSalesCampaignWizardItems)
                            this.currentIdSalesCampaignWizardItems =
                                this.countryLanguageList[0].IdSalesCampaignWizardItems;

                        this.countryLanguageForm.controls[
                            "countryLanguage"
                        ].setValue(this.currentIdSalesCampaignWizardItems);
                        this.loadMediaCodeByCountry(
                            this.currentIdSalesCampaignWizardItems
                        );

                        if (
                            !this.countryLanguageList ||
                            !this.countryLanguageList.length
                        )
                            this.wjCountryLanguage.focus();
                        else this.focusMediaCode();
                    });
                });
            });
    }

    private showMesageOfUploadFile() {
        if (!!this._messageIncorrectFile) {
            this.messageIncorrectFile = [
                { key: "<p>" },
                {
                    key: "Modal_Message__File_Format_Is_Incorrect_File_Must_Have_Exactly",
                },
                { key: "</p><ul><li>" },
                { key: this.correctColumnsName[0] },
                { key: "</li><li>" },
                { key: this.correctColumnsName[1] },
                { key: "</li><li>" },
                { key: this.correctColumnsName[2] },
                { key: "</li></ul><p>" },
                { key: "Modal_Message__These_Files_Are_Incorrect" },
                { key: "</p><ul>" },
                { key: this._messageIncorrectFile },
                { key: "</ul><hr>" },
            ];
            // this._messageIncorrectFile = `
            // <p>File format is incorrect. File must have exactly 3 columns are:</p>
            // <ul>
            //     <li>` + this.correctColumnsName[0] + `</li>
            //     <li>` + this.correctColumnsName[1] + `</li>
            //     <li>` + this.correctColumnsName[2] + `</li>
            // </ul>
            // <p>These files are incorrect:</p>
            // <ul>
            // ` + this._messageIncorrectFile + `</ul><hr>`;
        }
        if (this._messageDuplicationMediaCode) {
            this.messageDuplicationMediaCode = [
                { key: "<p>" },
                {
                    key: "Modal_Message__Some_Items_Can_Not_Add_To_Table_Existed_In_Database",
                },
                { key: "</p><ul>" },
                { key: this._messageDuplicationMediaCode },
                { key: "</ul>" },
            ];
            // this._messageDuplicationMediaCode = `
            // <p>Some items can not add to table. Because they are existed in database:</p>
            // <ul>` + this._messageDuplicationMediaCode + `</ul>`;
        }
        const message = [
            ...this.messageIncorrectFile,
            ...this.messageDuplicationMediaCode,
        ];
        this.resetUploadVariable();
        if (!message.length) return;
        this.modalService.warningMessageHtmlContent({
            message: message,
            modalSize: MessageModal.ModalSize.middle,
        });
    }

    private resetUploadVariable() {
        this._fileUploadErrorCounter = 0;
        this._messageIncorrectFile = "";
        this.messageIncorrectFile = [];
        this._messageDuplicationMediaCode = "";
        this.messageDuplicationMediaCode = [];
        this._fileUploadCounter = 0;
        this._fileUploadResponses.length = 0;
        this._mediaCodeNrs = "";
        this._filesUploading.length = 0;
    }

    private checkExistingMediaCodeMulti() {
        this.disableForm = true;
        if (this.checkExistingMediaCodeSubscription) {
            this.checkExistingMediaCodeSubscription.unsubscribe();
        }
        this.checkExistingMediaCodeSubscription = this.campaignService
            .checkExistingMediaCodeMulti(this._mediaCodeNrs)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    let existData = [];
                    if (
                        Uti.isResquestSuccess(response) &&
                        response.item &&
                        response.item.data &&
                        response.item.data.length
                    ) {
                        existData = response.item.data[0];
                    }
                    let existedMediaCodes = existData.map((x) => {
                        return {
                            MediaCode: x.MediaCode,
                        };
                    });
                    this.buildDuplicateMessage(existData);
                    this.showMesageOfUploadFile();
                    this.disableForm = false;
                });
            });
    }

    private buildDuplicateMessage(existData: any) {
        const nodeItems =
            this.gridComponent && this.gridComponent.getCurrentNodeItems();
        for (let item of this._fileUploadResponses) {
            let mediaItems = Uti.getItemsDontExistItems(
                item.response,
                existData,
                "MediaCode"
            );
            mediaItems = Uti.getItemsDontExistItems(
                mediaItems,
                nodeItems,
                "MediaCode"
            );
            let mediaExistedItems = Uti.getItemsExistItems(
                item.response,
                existData,
                "MediaCode"
            );
            mediaExistedItems = [
                ...mediaExistedItems,
                ...Uti.getItemsExistItems(
                    item.response,
                    nodeItems,
                    "MediaCode"
                ),
            ];

            if (mediaExistedItems && mediaExistedItems.length) {
                this._messageDuplicationMediaCode +=
                    "<li> File name: <strong>" +
                    item.item.file.name +
                    "</strong></li>";
                this._messageDuplicationMediaCode += "<ul>";
                mediaExistedItems = uniqBy(mediaExistedItems, (x) => {
                    return x.MediaCode;
                });
                mediaExistedItems.forEach((x) => {
                    this._messageDuplicationMediaCode +=
                        "<li> Media code: <strong>" +
                        x.MediaCode +
                        "</strong></li>";
                });
                this._messageDuplicationMediaCode += "</ul>";
                item.item.isSuccess = false;
                item.item.isError = true;
            }
            this.addItemToGrid(mediaItems);
        }
    }

    private addItemToGrid(mediaItems: any) {
        mediaItems.forEach((item) => {
            const mediaCode = (item.MediaCode + "").trim();
            if (mediaCode) {
                item.IdSalesCampaignMediaCode = Uti.getTempId();
                this.gridComponent.addNewRow(item);
            }
        });
        if (mediaItems.length) {
            this.setGridDirty();
        }
    }

    private isExistedInGrid(mediaCode: string): boolean {
        const items =
            this.gridComponent && this.gridComponent.getCurrentNodeItems();
        for (let item of items) {
            if (item.MediaCode == mediaCode) return true;
        }
        return false;
    }

    private checkCorrectImportData(mediaItems: any) {
        for (const item of mediaItems) {
            if (!this.checkCorrectImportDataEachItem(item)) return false;
        }
        return true;
    }

    private checkCorrectImportDataEachItem(mediaItems: any): boolean {
        let columnsAmount = 0;
        // tslint:disable-next-line:forin
        for (const prop in mediaItems) {
            columnsAmount++;
            if (this.correctColumnsName.indexOf(prop) < 0) return false;
        }
        return columnsAmount >= 3;
    }

    private subcribtion() {
        this.selectedEntityStateSubscription =
            this.selectedEntityState.subscribe((selectedEntityState: any) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        selectedEntityState &&
                        selectedEntityState.idSalesCampaignWizard
                    ) {
                        this.buildComboboxDataSource(
                            selectedEntityState["idSalesCampaignWizard"]
                        );
                    }
                });
            });

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

        this.rowCampaignMediaMainDataStateSubscription =
            this.rowCampaignMediaMainDataState.subscribe((rowData: RowData) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !rowData ||
                        !rowData.data ||
                        !!this.currentIdSalesCampaignWizardItems
                    )
                        return;
                    if (
                        !Uti.checkKeynameExistInArray(
                            rowData.data,
                            "key",
                            "IdSalesCampaignWizardItems"
                        )
                    )
                        return;
                    const primaryValue = Uti.getPrimaryValueFromKey(rowData);
                    if (!primaryValue || !primaryValue.length) return;
                    MediaCodeT2FormComponent.idSalesCampaignWizardItems =
                        primaryValue[0].value;
                    this.currentIdSalesCampaignWizardItems =
                        primaryValue[0].value;
                });
            });
    }

    private checkCountryLanguage() {
        if (!this.wjCountryLanguage.selectedValue) {
            this.toasterService.pop(
                "warning",
                "Validation Failed",
                "Please select Country + Language!"
            );
            return false;
        }
        return true;
    }

    private cancelItem() {
        this.store.dispatch(this.tabButtonActions.requestCancel(this.ofModule));
    }

    private setGridDirty() {
        this.gridValid = !this.gridComponent.hasError();
        this.isGridDirty = this.checkDirtyAndGetSaveData();
        this.formValid = this.gridValid && this.isGridDirty;
        this.setOutputData(null);
    }

    public onTableEditSuccess(eventData) {
        if (!eventData["IdSalesCampaignMediaCode"]) {
            eventData["IdSalesCampaignMediaCode"] = Uti.getTempId();
        }
        this.buildEditedItems(eventData);
        this.setGridDirty();
    }

    private buildEditedItems(currentItem: any) {
        const item = this.editedItems.find(
            (x) => x.DT_RowId == currentItem.DT_RowId
        );
        if (item && item.DT_RowId) {
            Uti.removeItemInArray(this.editedItems, item, "DT_RowId");
        }
        this.editedItems.push(currentItem);
    }

    public submit() {
        this.isGridDirty = this.checkDirtyAndGetSaveData();
        this.formValid = this.gridValid;
        if (!this.formValid) {
            this.setOutputData(false);
            return;
        }
        if (!this.isGridDirty) {
            this.setOutputData(false);
            return;
        }
        this.udpateCampaign(this.saveData);
    }

    private checkDirtyAndGetSaveData(): boolean {
        if (!this.dataSourceTable) return false;

        const nodeItems =
            this.gridComponent && this.gridComponent.getCurrentNodeItems();
        // Add Items
        let addItems = Uti.getItemsDontExistItems(
            nodeItems,
            this.cachedGridData,
            "DT_RowId"
        );
        if (addItems && addItems.length) {
            addItems = addItems.filter(
                (x) => !x.deleted && x.IdSalesCampaignMediaCode < 0
            );
            addItems = addItems.map((x) => {
                return {
                    idSalesCampaignWizardItems:
                        MediaCodeT2FormComponent.idSalesCampaignWizardItems,
                    mediaCode: x.MediaCode,
                    mediaCodeLabel: x.MediaCodeLabel,
                    quantity: x.Quantity,
                    isActive: true,
                };
            });
        }

        // Edit Items
        let editItems = [];
        for (let x of this.editedItems) {
            if (!x.IdSalesCampaignMediaCode || x.IdSalesCampaignMediaCode < 0)
                continue;
            editItems.push({
                idSalesCampaignWizardItems:
                    MediaCodeT2FormComponent.idSalesCampaignWizardItems,
                idSalesCampaignMediaCode: x.IdSalesCampaignMediaCode,
                mediaCode: x.MediaCode,
                mediaCodeLabel: x.MediaCodeLabel,
                quantity: x.Quantity,
                isActive: true,
            });
        }

        // Delete Items
        // let deleteItems = Uti.getItemsDontExistItems(this.cachedGridData, this.dataSourceTable.data, 'DT_RowId');
        let deleteItems = nodeItems.filter(
            (x) => x.IsDeleted && !!x.IdSalesCampaignMediaCode
        );
        deleteItems = deleteItems.map((x) => {
            return {
                idSalesCampaignWizardItems:
                    MediaCodeT2FormComponent.idSalesCampaignWizardItems,
                idSalesCampaignMediaCode: x.IdSalesCampaignMediaCode,
                isDeleted: 1,
            };
        });

        this.saveData = [...addItems, ...editItems, ...deleteItems];

        return !!this.saveData.length;
    }

    private udpateCampaign(data: any) {
        this.campaignServiceSubscription = this.campaignService
            .createMediaCode(data)
            .subscribe(
                (inputData) => {
                    this.appErrorHandler.executeAction(() => {
                        if (
                            inputData.item.eventType !==
                                FormSaveEvenType.Successfully ||
                            !inputData.item.returnID
                        ) {
                            this.formValid = false;
                            this.setOutputData(false);
                            return;
                        }

                        if (this.willChangeCountry) {
                            this.toasterService.pop(
                                "success",
                                "Success",
                                "MediaCode saved successfully"
                            );
                            this.store.dispatch(
                                this.processDataActions.formDirty(
                                    false,
                                    this.ofModule
                                )
                            );
                            this.loadMediaCodeByCountry(this.willChangeCountry);
                        } else {
                            this.setOutputData(true, inputData.item.returnID);
                            this.resetFormValue();
                        }
                    });
                },
                (err) => {
                    this.appErrorHandler.executeAction(() => {
                        this.setOutputData(false);
                    });
                }
            );
    }

    private resetFormValue() {
        this.formValid = false;
        this.dataSourceTable = {
            data: [],
            columns: this.getOriginalGridColumns(),
        };
        Uti.resetValueForForm(this.mediaCodeT2Form);
    }

    private getOriginalGridColumns(): any {
        const result = [];
        for (const item of this.dataSourceTable.columns) {
            if (this.correctColumnsName.indexOf(item.data) < 0) continue;
            result.push(item);
        }
        return result;
    }

    private setOutputData(submitResult: any, returnID?: any) {
        this.outputModel = new FormOutputModel({
            submitResult: submitResult,
            formValue: {},
            isValid: this.formValid,
            isDirty: this.isGridDirty,
            returnID: returnID,
        });
        this.outputData.emit(this.outputModel);
    }

    private loadMediaCodeByCountry(idSalesCampaignWizardItems) {
        MediaCodeT2FormComponent.idSalesCampaignWizardItems =
            idSalesCampaignWizardItems;
        this.campaignService
            .getMediaCodeDetail(idSalesCampaignWizardItems)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item ||
                        (!response.item.data && !response.item.data.length)
                    ) {
                        return;
                    }

                    const gridData =
                        this.datatableService.formatDataTableFromRawData(
                            response.item.data
                        );
                    this.dataSourceTable =
                        this.datatableService.buildDataSource(gridData);
                    this.cachedGridData = Object.assign(
                        [],
                        this.dataSourceTable.data
                    );

                    if (this.willChangeCountry) {
                        this.allowToChangeCountry = true;
                        this.wjCountryLanguage.selectedValue =
                            this.willChangeCountry;
                        this.willChangeCountry = null;
                    }
                });
            });
    }

    private focusOnInvalidControl() {
        setTimeout(() => {
            const $allItems = $(
                "[data-pageId=" + this.pageId + "] .ng-invalid"
            ).not("form,div,span,a,p");
            const $item = $allItems
                .find("input:visible, select:visible, textarea:visible")
                .first();
            if (!$item || !$item.length) return;

            $item.focus();
        }, 300);
    }

    private focusMediaCode() {
        setTimeout(() => {
            this.mediaCodeCtrl.focusInput();
        }, 200);
    }
}
