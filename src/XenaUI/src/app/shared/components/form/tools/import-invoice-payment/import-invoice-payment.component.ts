import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    ViewChild,
    ChangeDetectorRef,
    //isDevMode,
    Output,
    EventEmitter,
} from "@angular/core";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import {
    AppErrorHandler,
    ModalService,
    SignalRService,
    CommonService,
    ToolsService,
    DatatableService,
} from "app/services";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import {
    SignalRActionEnum,
    SignalRJobEnum,
    MessageModal,
    UploadFileMode,
    ComboBoxTypeConstant,
    Configuration,
} from "app/app.constants";
import {
    SignalRNotifyModel,
    MessageModel,
    ApiResultResponse,
    Module,
} from "app/models";
import { Uti } from "app/utilities";
import { Subscription } from "rxjs";
import { FileUploadComponent } from "app/shared/components/xn-file";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";
import cloneDeep from "lodash-es/cloneDeep";

@Component({
    selector: "import-invoice-payment",
    styleUrls: ["./import-invoice-payment.component.scss"],
    templateUrl: "./import-invoice-payment.component.html",
})
export class ImportInvoicePaymentComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private processStatusEnum: any = {
        Idle: 0,
        Success: 1,
        Processing: 2,
        Failed: 3,
    };

    private importFileStatusEnum: any = {
        None: 0,
        Saved: 1,
        Exist: 2,
        Incorrect: 3,
        UnSaved: 4,
    };

    public maxNumOfFiles = 50;

    public dataSource: any;
    public gridColumns: any;
    public rowGrouping: boolean;

    public importStatus = false; //True: Stop, False: Start
    @Input() globalProperties: any;

    @Input() gridId: string;
    @Input() rowBackground: any;
    @Input() rowBackgroundGlobal: any;
    @Input() borderRow: any;
    @Input() backgroundImage: any;
    @Input() allowSetColumnState = true;
    @Input() background: any;
    @Input() gridStyle: any;
    @Input() columnsLayoutSettings: any = {};
    @Input() currentModule: Module;

    @Input() set refreshCurrentWidget(refreshGuid: any) {
        if (refreshGuid) {
            this.getImportInvoiceFiles(null, () => {
                this.signalRGetData();
            });
        }
    }

    @Output() changeColumnLayout = new EventEmitter<any>();
    @Output() saveColumnsLayoutAction = new EventEmitter<any>();

    public onChangeColumnLayoutHandler($event) {
        this.changeColumnLayout.emit($event);
    }

    public onSaveColumnsLayoutHandle() {
        this.saveColumnsLayoutAction.emit();
    }

    @ViewChild("importInvoicePaymentGrid")
    importInvoicePaymentGrid: XnAgGridComponent;

    private messageImportSub: Subscription;
    public listComboBox: any = {};
    @ViewChild("providerNameCtrl") providerNameCtrl: AngularMultiSelect;

    constructor(
        private consts: Configuration,
        private modalService: ModalService,
        private signalRService: SignalRService,
        private toasterService: ToasterService,
        private appErrorHandler: AppErrorHandler,
        private commonService: CommonService,
        private toolsService: ToolsService,
        private datatableService: DatatableService,
        private _ref: ChangeDetectorRef,
        router?: Router
    ) {
        super(router);
    }

    public ngOnInit() {
        this.signalRListenMessage();
        this.signalRGetData();
        this.getInitDropdownlistData();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private changeDetectorTimeout: any;
    private changeDetector() {
        clearTimeout(this.changeDetectorTimeout);
        this.changeDetectorTimeout = null;
        this.changeDetectorTimeout = setTimeout(() => {
            this._ref.detectChanges();
        }, 300);
    }

    //#region Init Data
    private getInitDropdownlistData() {
        this.commonService
            .getListComboBox(ComboBoxTypeConstant.paymentProvider)
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) return;

                    this.listComboBox = response.item;
                    this.getImportInvoiceFiles();
                });
            });
    }
    //#endregion

    //#region SignalR
    private signalRGetData() {
        this.sendMessage(
            SignalRActionEnum.ImportInvoicePayment_GetProcessingList
        );
    }

    private signalRListenMessage() {
        if (this.messageImportSub) this.messageImportSub.unsubscribe();

        this.messageImportSub =
            this.signalRService.messageImportInvoicePayment.subscribe(
                (message: SignalRNotifyModel) => {
                    this.appErrorHandler.executeAction(() => {
                        if (message.Job == SignalRJobEnum.Disconnected) {
                            // BackgroundJob is stopped
                            // Notify an error message to user
                            return;
                        }

                        console.log(message);

                        switch (message.Action) {
                            case SignalRActionEnum.ImportInvoicePayment_ServiceAlive:
                                if (message.JobIsProcessing) {
                                    this.isCallStart = false;
                                    this.toasterService.pop(
                                        "warning",
                                        "Notification",
                                        "Data is processing please wait for a moment..."
                                    );
                                } else {
                                    this.createQueueAndStart();
                                }
                                break;
                            case SignalRActionEnum.ImportInvoicePayment_GetProcessingList:
                                this.signalRGetProcessingList(message);
                                break;
                            case SignalRActionEnum.ImportInvoicePayment_StartSuccessfully:
                                this.signalRStartSuccessfully(message);
                                break;
                            case SignalRActionEnum.ImportInvoicePayment_Processsing:
                                this.signalRProcesssing(message);
                                break;
                            case SignalRActionEnum.ImportInvoicePayment_Fail:
                                this.signalRProcesssing(message);
                                break;
                            case SignalRActionEnum.ImportInvoicePayment_Success: //for each file
                                this.signalRProcesssing(message);
                                break;
                            case SignalRActionEnum.ImportInvoicePayment_Finish: //for all files
                                this.signalRProcessingFinish(message);
                                break;
                            case SignalRActionEnum.ImportInvoicePayment_FileAction:
                                this.signalRProcessingFile(message);
                                break;
                            case SignalRActionEnum.ImportInvoicePayment_StopSuccessfully:
                                this.signalRStopSuccessfully();
                                break;
                            case SignalRActionEnum.ImportInvoicePayment_ImportFileFinish:
                                this.signalRImportFileFinish(message);
                                break;
                            default:
                                break;
                        }
                    });
                }
            );
    }

    private signalRGetProcessingList(message: SignalRNotifyModel) {
        const procesingList = message.Data;
        if (!procesingList || !procesingList.length) {
            this.setStatus(false);
            return;
        }

        for (let item of procesingList) {
            let row = this.dataSource.data.find(
                (x) =>
                    x.IdSharingTreeMedia &&
                    x.IdSharingTreeMedia == item.IdSharingTreeMedia &&
                    x.ProcessStatus != this.processStatusEnum.Success
            );
            if (row) {
                this.updateStatusForGrid(item); //update grid row
            }
        } //for

        //True: Stop, False: Start
        this.setStatus(!!procesingList.length);
        this.changeDetector();
    }

    private signalRProcesssing(message: SignalRNotifyModel) {
        if (!this.dataSource.data || !this.dataSource.data.length) return;
        const data =
            message.Data && message.Data.length ? message.Data[0] : null;
        if (!data) return;

        this.updateStatusForGrid(data);
        this.changeDetector();
    }

    //For all queues
    private signalRProcessingFinish(message: SignalRNotifyModel) {
        this.setStatus(false); //Show Start Button
        this.isDisableImportButton = false;
        this.isCallStartSavingFiles = false;
        this.toasterService.pop(
            "success",
            "Success",
            "Data processing is finished"
        );
        this.changeDetector();

        //Refresh Grid
        this.getImportInvoiceFiles();
    }

    private signalRProcessingFile(messageModel: SignalRNotifyModel) {
        if (!messageModel || !messageModel.Data || !messageModel.Data.length)
            return;

        const fileSaved = messageModel.Data.filter(
            (x) => x.ImportFileStatus == this.importFileStatusEnum.Saved
        );
        const fileUnSaved = messageModel.Data.filter(
            (x) => x.ImportFileStatus == this.importFileStatusEnum.UnSaved
        );
        const fileExist = messageModel.Data.filter(
            (x) => x.ImportFileStatus == this.importFileStatusEnum.Exist
        );
        const fileIncorrect = messageModel.Data.filter(
            (x) => x.ImportFileStatus == this.importFileStatusEnum.Incorrect
        );

        const message: Array<any> = [];
        this.addMessageForFile(
            message,
            fileUnSaved,
            "Modal_Message__File_Action_Files_Correct_UnSaved"
        );
        this.addMessageForFile(
            message,
            fileSaved,
            "Modal_Message__File_Action_Files_Correct_Saved"
        );
        this.addMessageForFile(
            message,
            fileExist,
            "Modal_Message__File_Action_Files_Exist"
        );
        this.addMessageForFile(
            message,
            fileIncorrect,
            "Modal_Message__File_Action_Files_Incorrect"
        );

        this.modalService.warningMessageWithOption(
            {
                message: message,
                customClass: "invoice-payment-file-upload-message",
            },
            true
        );
    }

    private addMessageForFile(
        message: Array<any>,
        files: Array<any>,
        messageKey: string
    ) {
        if (!files || !files.length) return;

        message.push({ key: "<p><strong>" });
        message.push({ key: messageKey });
        message.push({ key: "</strong></p>" });
        message.push({ key: "<ul>" });
        for (const file of files) {
            message.push({ key: "<li>" + file.MediaName + "</li>" });
        }
        message.push({ key: "</ul>" });
    }

    private sendMessage(action: SignalRActionEnum, data?: any) {
        const model = this.signalRService.createMessageImportInvoicePayment();
        model.Action = action;
        model.Data = data;
        this.signalRService.sendMessage(model);
    }

    private signalRStartSuccessfully(message: SignalRNotifyModel) {
        this.signalRGetProcessingList(message);
        this.toasterService.pop(
            "success",
            "Success",
            "Data processing is started"
        );
    }

    private signalRStopSuccessfully() {
        this.setStatus(false); //Show Start Button
        this.isCallStartSavingFiles = false;
        this.isDisableImportButton = false;

        this.toasterService.pop(
            "warning",
            "Notification",
            "Data processing is stopped"
        );
        this.changeDetector();

        this.getImportInvoiceFiles();
    }

    private signalRImportFileFinish(message: SignalRNotifyModel) {
        this.isCallStartSavingFiles = false;
        if (!message.Data || !message.Data.length) {
            this.setStatus(false); //Show Start Button
            return;
        }

        this.getImportInvoiceFiles(message, () => {
            this.isCallStart = true;
            this.createQueueAndStart();
        });
    }
    //#endregion

    //#region Grid
    private getImportInvoiceFiles(
        message?: SignalRNotifyModel,
        callback?: Function
    ) {
        this.toolsService.getImportInvoiceFiles().subscribe((response: any) => {
            this.appErrorHandler.executeAction(() => {
                if (response.data && response.data.length > 1) {
                    const data =
                        this.datatableService.formatDataTableFromRawData(
                            response.data
                        );
                    this.dataSource =
                        this.datatableService.buildDataSource(data);

                    //Only build the first time
                    if (!this.gridColumns) {
                        this.gridColumns = this.dataSource.columns;
                        this.buildGridColumns();
                        //console.log(this.gridColumns);
                    }
                    this.dataSource.columns = cloneDeep(this.gridColumns);
                    this.formatGridData();

                    if (message) {
                        this.updateGridRows(message);
                    }
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    }

    private buildGridColumns() {
        if (!this.gridColumns) return;

        this.gridColumns.push({
            title: "Status",
            data: "StatusDisplay",
            setting: {
                DataType: "nvarchar",
                Setting: [
                    {
                        DisplayField: {
                            ReadOnly: "1",
                        },
                        ControlType: {
                            Type: "Icon",
                        },
                    },
                ],
            },
        });

        this.gridColumns.push({
            title: "Duration",
            data: "Duration",
            setting: {
                DataType: "nvarchar",
                Setting: [
                    {
                        DisplayField: {
                            ReadOnly: "1",
                        },
                    },
                ],
            },
        });
    }

    private formatGridData() {
        if (!this.dataSource || !this.dataSource.data) return;

        this.dataSource.data.forEach((item) => {
            if (item.Status == this.processStatusEnum.Success) {
                item.StatusDisplay = "fa-check green-color"; //Success
                item.ProcessStatus = item.Status;
            } else {
                item.StatusDisplay = "fa-clock-o"; //Idle
                item.ProcessStatus = this.processStatusEnum.Idle;
            }
        });
    }

    private updateGridRows(message: SignalRNotifyModel) {
        if (!message || !message.Data || !message.Data.length) return;

        setTimeout(() => {
            for (let item of message.Data) {
                this.updateStatusForGrid(item);
            } //for
            this.changeDetector();
        }, 300);
    }

    private updateStatusForGrid(data: any) {
        let row = this.dataSource.data.find(
            (x) =>
                x.IdSharingTreeMedia &&
                x.IdSharingTreeMedia == data.IdSharingTreeMedia
        );
        if (!row) return;

        switch (data.ProcessStatus) {
            case this.processStatusEnum.Idle: {
                row.StatusDisplay = "fa-clock-o";
                break;
            }
            case this.processStatusEnum.Processing: {
                row.StatusDisplay = "fa-spinner fa-spin orange-color";
                break;
            }
            case this.processStatusEnum.Success: {
                row.StatusDisplay = "fa-check green-color";
                break;
            }
            case this.processStatusEnum.Failed: {
                row.StatusDisplay = "fa-times red-color";
                break;
            }
        }
        row.ProcessStatus = data.ProcessStatus;
        row.ImportFileStatus = data.ImportFileStatus;
        row.Duration = Uti.secondsToString(data.duration);
        this.importInvoicePaymentGrid.updateRowData([row]);
    }

    public clearGrid() {
        this.importInvoicePaymentGrid.clearAllRows();
        this.dataSource.data = [];
    }
    //#endregion

    // #region [Start Stop]
    public isDisableImportButton: boolean = false;
    public isCallStartSavingFiles: boolean = false;
    private isCallStart: boolean = false;
    private startTimeout: any;

    public startStop() {
        if (!this.importStatus) {
            this.start();
        } else {
            this.modalService.confirmMessageHtmlContent(
                new MessageModel({
                    headerText: "Stop Import",
                    messageType: MessageModal.MessageType.error,
                    message: [
                        { key: "<p>" },
                        {
                            key: "Modal_Message__Do_You_Want_Stop_Import_Invoice_Payment",
                        },
                        { key: "</p>" },
                    ],
                    buttonType1: MessageModal.ButtonType.danger,
                    callBack1: () => {
                        this.stop();
                    },
                })
            );
        }
    }

    private start() {
        if (this.isCallStart) {
            this.toasterService.pop(
                "info",
                "SignalR",
                "Bus connection is connecting..."
            );
            return;
        }

        //Only check for the Import Action
        if (!this.isCallStartSavingFiles) {
            const items = this.dataSource.data
                .filter(
                    (x) =>
                        x.IdSharingTreeMedia &&
                        x.ProcessStatus == this.processStatusEnum.Idle
                )
                .slice(0, this.maxNumOfFiles);
            if (!items || !items.length) {
                this.modalService.warningText(
                    "Modal_Message__Upload_Files_Process"
                );
                return;
            }
        }

        this.toasterService.pop(
            "info",
            "SignalR",
            "Bus connection is connecting..."
        );
        this.isCallStart = true;
        this.sendMessage(SignalRActionEnum.ImportInvoicePayment_Ping);

        clearTimeout(this.startTimeout);
        this.startTimeout = null;
        this.startTimeout = setTimeout(() => {
            if (this.isCallStart) {
                this.isCallStart = false;
                this.toasterService.pop(
                    "error",
                    "SignalR Error",
                    "Bus connection failed, please try again."
                );
            }
        }, 10000); //10s
    }

    private createQueueAndStart() {
        if (!this.isCallStart) return;

        this.isCallStart = false;

        if (this.isCallStartSavingFiles) {
            this.sendMessage(
                SignalRActionEnum.ImportInvoicePayment_ImportFile,
                this.tempUploadedItems
            );
            this.tempUploadedItems.length = 0;
            this.isDisableImportButton = true;
        } else {
            const items = this.dataSource.data
                .filter(
                    (x) =>
                        x.IdSharingTreeMedia &&
                        x.ProcessStatus == this.processStatusEnum.Idle
                )
                .slice(0, this.maxNumOfFiles);
            if (items && items.length) {
                this.sendMessage(
                    SignalRActionEnum.ImportInvoicePayment_Start,
                    items
                );
            }
        }
    }

    //True: starting, text of button is Stop -> you can stop it
    //False: not start, text of button is Start -> you can start it
    private setStatus(importStatus: boolean) {
        this.importStatus = importStatus;
    }

    private stop() {
        this.sendMessage(SignalRActionEnum.ImportInvoicePayment_Stop);
    }
    // #endregion [Start Stop]

    //#region UploadFile
    @ViewChild("fileUpload") fileUpload: FileUploadComponent;
    public uploadFileShowDialog = false;
    public uploadFileMode: UploadFileMode = UploadFileMode.ImportInvoicePayment;
    public uploadFileIdFolder = "";
    private tempUploadedItems: any[] = [];

    public onProviderChanged($event) {
        this.uploadFileIdFolder = "";
        if (!$event || !$event.textValue) {
            return;
        }
        this.uploadFileIdFolder =
            Uti.replaceSpecialCharacterOfFile($event.textValue) +
            "/" +
            new Date().getFullYear() +
            "/" +
            ("0" + (new Date().getMonth() + 1)).slice(-2);
    }

    public uploadFileOpenDialog() {
        if (!this.providerNameCtrl && !this.providerNameCtrl.selectedValue) {
            this.modalService.warningText(
                "Import_Invoice_Payment__Choose_ProviderName"
            );
            return;
        }

        this.isCallStartSavingFiles = true;
        this.uploadFileShowDialog = true;
    }

    public uploadFileCloseDialog() {
        this.fileUpload.clearItem();
        this.uploadFileShowDialog = false;

        //For case you click upload on each Item, after then click to close the Dialog
        // -> will call 'start'
        if (
            this.tempUploadedItems &&
            this.tempUploadedItems.length &&
            !this.importStatus
        ) {
            this.start();
        }
    }

    public uploadFileOnComplete(event) {
        //console.log(event);
        if (event && event.response && event.response.fileName) {
            const resItem = event.response;

            this.tempUploadedItems.push({
                PaymentProviderId: this.providerNameCtrl.selectedValue,
                Path: resItem.path,
                MediaName: resItem.fileName,
                MediaOriginalName: resItem.originalFileName,
            });
        } else {
            this.toasterService.pop("error", "Failed", "File uploading failed");
        }
    }

    public handleRowGroupPanel(data) {
        this.rowGrouping = data;
    }

    public uploadFileOnCompleteAll() {
        this.uploadFileCloseDialog();
        this.changeDetector();
    }
    //#endregion
}
