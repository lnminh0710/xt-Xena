import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    ViewChild,
    ChangeDetectorRef,
    isDevMode,
} from "@angular/core";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import { AppErrorHandler, ModalService, SignalRService } from "app/services";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";
import {
    SignalRActionEnum,
    SignalRJobEnum,
    MessageModal,
    UploadFileMode,
} from "app/app.constants";
import { SignalRNotifyModel, MessageModel } from "app/models";
import { Uti } from "app/utilities";
import { Subscription } from "rxjs";
import { FileUploadComponent } from "app/shared/components/xn-file";
import { GuidHelper } from "app/utilities/guild.helper";

@Component({
    selector: "import-data-matrix",
    styleUrls: ["./import-data-matrix.component.scss"],
    templateUrl: "./import-data-matrix.component.html",
})
export class ImportDataMatrixComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    private importDataMatrixStatusEnum: any = {
        Idle: 0,
        Processing: 1,
        Success: 2,
        Failed: 3,
    };

    private procesingList: Array<any> = [];

    public dataSource: any = {
        data: [],
        columns: this.createGridColumns(),
    };
    public importStatus = false;
    @Input() gridId: string;
    @Input() rowBackground: any;
    @Input() rowBackgroundGlobal: any;
    @Input() borderRow: any;
    @Input() backgroundImage: any;
    @Input() background: any;
    @Input() gridStyle: any;

    @ViewChild("importDataMatrixGrid") importDataMatrixGrid: XnAgGridComponent;

    private messageImportDataMatrixSubscription: Subscription;

    constructor(
        private _modalService: ModalService,
        private _signalRService: SignalRService,
        private toasterService: ToasterService,
        private _appErrorHandler: AppErrorHandler,
        private _ref: ChangeDetectorRef,
        router?: Router
    ) {
        super(router);
    }

    public ngOnInit() {
        this.signalRGetData();
        this.signalRListenMessage();
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

    //#region SignalR
    private signalRGetData() {
        this.sendMessage(SignalRActionEnum.ImportDataMatrix_GetProcessingList);
    }

    private signalRListenMessage() {
        if (this.messageImportDataMatrixSubscription)
            this.messageImportDataMatrixSubscription.unsubscribe();

        this.messageImportDataMatrixSubscription =
            this._signalRService.messageImportDataMatrix.subscribe(
                (message: SignalRNotifyModel) => {
                    this._appErrorHandler.executeAction(() => {
                        if (message.Job == SignalRJobEnum.Disconnected) {
                            // BackgroundJob is stopped
                            // Notify an error message to user
                            return;
                        }
                        console.log(message);

                        switch (message.Action) {
                            case SignalRActionEnum.ImportDataMatrix_ServiceAlive:
                                this.createQueueAndStart();
                                break;
                            case SignalRActionEnum.ImportDataMatrix_GetProcessingList:
                                this.signalRGetProcessingList(message);
                                break;
                            case SignalRActionEnum.ImportDataMatrix_StartSuccessfully:
                                this.signalRStartSuccessfully(message);
                                break;
                            case SignalRActionEnum.ImportDataMatrix_Processsing:
                                this.signalRProcesssing(message);
                                break;
                            case SignalRActionEnum.ImportDataMatrix_Fail:
                                this.signalRProcesssing(message);
                                break;
                            case SignalRActionEnum.ImportDataMatrix_Success:
                                this.signalRProcesssing(message);
                                break;
                            case SignalRActionEnum.ImportDataMatrix_Finish:
                                this.signalRProcessingFinish(message);
                                break;
                            case SignalRActionEnum.ImportDataMatrix_StopSuccessfully:
                                this.signalRStopSuccessfully();
                                break;
                            default:
                                break;
                        }
                    });
                }
            );
    }

    private signalRGetProcessingList(message: SignalRNotifyModel) {
        this.procesingList = message.Data;
        if (!this.procesingList || !this.procesingList.length) return;

        let addItems = [];
        //add items to grid
        for (let item of this.procesingList) {
            let row = this.dataSource.data.find(
                (x) => x.fileName == item.fileName
            );
            if (row) this.updateStatusForGrid(item); //update grid row
            else addItems.push(row); //add to grid
        } //for

        this.importDataMatrixGrid.addItems(addItems);

        this.setStatus(!!this.procesingList.length);
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

    private signalRProcessingFinish(message: SignalRNotifyModel) {
        this.setStatus(false);
        this.toasterService.pop(
            "success",
            "Success",
            "Data processing is finished"
        );
        this.changeDetector();
    }

    private sendMessage(action: SignalRActionEnum, data?: any) {
        let model = this._signalRService.createMessageImportDataMatrix();
        model.Action = action;
        model.Data = data;
        this._signalRService.sendMessage(model);
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
        for (let item of this.procesingList) {
            let row = this.dataSource.data.find(
                (x) => x.fileName == item.fileName
            );
            if (!row) continue;

            row.status = "fa-clock-o";
            row.hdStatus = this.importDataMatrixStatusEnum.Idle;
            this.importDataMatrixGrid.updateRowData([row]);
        }
        this.setStatus(false);
        this.toasterService.pop(
            "warning",
            "Notification",
            "Data processing is stopped"
        );
        this.changeDetector();
    }
    //#endregion

    //#region Grid
    private createGridColumns() {
        return [
            {
                title: "File Name",
                data: "originalFileName",
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
            },
            {
                title: "File Size",
                data: "fileSize",
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
            },
            {
                title: "Status",
                data: "status",
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
            },
            {
                title: "Duration",
                data: "duration",
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
            },
        ];
    }

    private updateStatusForGrid(data: any) {
        if (!data) return;
        let row = this.dataSource.data.find((x) => x.fileName == data.fileName);
        if (!row) return;

        switch (data.hdStatus) {
            // Idle
            case 0: {
                row.status = "fa-clock-o";
                break;
            }
            // Processing
            case 1: {
                row.status = "fa-spinner fa-spin orange-color";
                break;
            }
            // Successfully
            case 2: {
                row.status = "fa-check green-color";
                break;
            }
            // Fail
            case 3: {
                row.status = "fa-times red-color";
                break;
            }
        }
        row.hdStatus = data.hdStatus;
        row.duration = Uti.secondsToString(data.duration);
        this.importDataMatrixGrid.updateRowData([row]);
    }

    public clearGrid() {
        this.importDataMatrixGrid.clearAllRows();
        this.dataSource.data = [];
    }
    //#endregion

    // #region [Start Stop]
    public startStop() {
        if (!this.importStatus) {
            this.start();
        } else {
            this._modalService.confirmMessageHtmlContent(
                new MessageModel({
                    headerText: "Stop Import",
                    messageType: MessageModal.MessageType.error,
                    message: [
                        { key: "<p>" },
                        {
                            key: "Modal_Message__Do_You_Want_Stop_Import_Data_Matrix",
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

    private isCallStart: boolean = false;
    private startTimeout: any;
    private start() {
        if (this.isCallStart) {
            this.toasterService.pop(
                "warning",
                "SignalR",
                "Bus connection is connecting..."
            );
            return;
        }

        const items = this.dataSource.data.filter(
            (x) => x.hdStatus == this.importDataMatrixStatusEnum.Idle
        );
        if (!items || !items.length) {
            this._modalService.warningText(
                "Modal_Message__Upload_Files_Process"
            );
            return;
        }

        this.isCallStart = true;
        this.sendMessage(SignalRActionEnum.ImportDataMatrix_Ping);

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
        }, 5000);
    }

    private createQueueAndStart() {
        if (!this.isCallStart) return;

        this.isCallStart = false;
        const items = this.dataSource.data.filter(
            (x) => x.hdStatus == this.importDataMatrixStatusEnum.Idle
        );
        if (items && items.length)
            this.sendMessage(SignalRActionEnum.ImportDataMatrix_Start, items);
    }

    private setStatus(importStatus: boolean) {
        this.importStatus = importStatus;
    }

    private stop() {
        this.sendMessage(SignalRActionEnum.ImportDataMatrix_Stop);
    }
    // #endregion [Start Stop]

    //#region UploadFile
    @ViewChild("fileUpload") fileUpload: FileUploadComponent;
    public uploadFileShowDialog: boolean = false;
    public uploadFileMode: UploadFileMode = UploadFileMode.ImportDataMatrix;
    public uploadFileIdFolder =
        new Date().getFullYear() + "/" + GuidHelper.generateGUID();
    private tempUploadedItems: any[] = [];

    public uploadFileOpenDialog() {
        this.uploadFileShowDialog = true;
        this.tempUploadedItems.length = 0;
    }

    public uploadFileCloseDialog() {
        this.fileUpload.clearItem();
        this.uploadFileShowDialog = false;
        this.tempUploadedItems.length = 0;
    }

    public uploadFileOnComplete(event) {
        //console.log(event);
        if (event && event.response && event.response.fileName) {
            const resItem = event.response;

            this.tempUploadedItems.push({
                path: resItem.path,
                fileName: resItem.fileName,
                originalFileName: resItem.originalFileName,
                fileSize: Uti.formatBytesToMb(resItem.size, 3),
                status: "fa-clock-o",
                hdStatus: this.importDataMatrixStatusEnum.Idle, //hidden status
            });
        } else {
            this.toasterService.pop("error", "Failed", "File uploading failed");
        }
    }

    public uploadFileOnCompleteAll() {
        if (this.tempUploadedItems.length) {
            this.importDataMatrixGrid.addItems(this.tempUploadedItems);
            this.dataSource.data = this.importDataMatrixGrid.getGridData();
            this.toasterService.pop(
                "success",
                "Success",
                "File(s) uploaded successfully"
            );
        }

        this.uploadFileCloseDialog();
        this.changeDetector();
    }
    //#endregion
}
