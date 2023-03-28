import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    OnDestroy,
    AfterViewInit,
} from "@angular/core";
import { Uti } from "app/utilities";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";
import { ToasterService } from "angular2-toaster/angular2-toaster";
import { ModalService } from "app/services";
import { MessageModel } from "app/models";
import { MessageModal, Configuration } from "app/app.constants";

declare var JSPM: any;

@Component({
    selector: "printer-form-dialog",
    styleUrls: ["./printer-form-dialog.component.scss"],
    templateUrl: "./printer-form-dialog.component.html",
})
export class PrinterFormDialogComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public showDialog = false;
    public showLoading = false;
    public printer: any;
    public printerList: any[] = [];
    public printedText: string = "";

    private fileData: any[] = [];
    private isDownloadFileWarningPopupOpening: boolean = false;
    private printingItemIndex = 0;
    private isStopping: boolean = false;
    private errorFile: Array<any> = [];

    @Output() closeDialogAction: EventEmitter<any> = new EventEmitter();
    @Output() confirmAction: EventEmitter<any> = new EventEmitter();
    @ViewChild("printerCtr") printerCtr: AngularMultiSelect;

    constructor(
        private _toasterService: ToasterService,
        private _modalService: ModalService
    ) {}

    public ngOnInit() {
        JSPM.JSPrintManager.auto_reconnect = true;
        JSPM.JSPrintManager.start();
        JSPM.JSPrintManager.WS.onStatusChanged = () => {
            if (this.isStopping || !this.jspmWSStatus()) return;
            JSPM.JSPrintManager.getPrintersInfo().then((data: any) => {
                this.printerList = data.map((x) => {
                    return {
                        textValue: x.name,
                        idValue: x.name,
                    };
                });
            });
        };
    }

    public ngAfterViewInit() {}

    public ngOnDestroy() {
        Uti.unsubscribe(this);
        this.isStopping = true;
        JSPM.JSPrintManager.stop();
    }

    public open(data: any[]) {
        this.fileData = data;
        this.showDialog = true;
    }

    public close() {
        this.showDialog = false;
        this.closeDialogAction.emit();
    }

    public onPrinterChanged() {}

    public print() {
        if (
            !this.printer ||
            !this.jspmWSStatus() ||
            !this.fileData ||
            !this.fileData.length
        ) {
            return;
        }
        this.showLoading = true;
        this.printedText = "";
        this.printingItemIndex = 0;
        this.errorFile.length = 0;
        this.printFile();
    }

    /********************************************************************************************/
    /********************************** PRIVATE METHODS ******************************************/
    /********************************************************************************************/

    private printFile() {
        if (this.printingItemIndex >= this.fileData.length) {
            this._toasterService.pop(
                "success",
                "Success",
                "Files are printed."
            );
            this.showLoading = false;
            this.printedText =
                this.printingItemIndex + 1 + "/" + this.fileData.length;
            this.showConfirmDialog();
            return;
        }
        this.printedText =
            (this.printingItemIndex === this.fileData.length
                ? this.fileData.length
                : this.printingItemIndex + 1) +
            "/" +
            this.fileData.length;
        const cpj = new JSPM.ClientPrintJob();
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.printer);
        const myFile = new JSPM.PrintFilePDF(
            location.origin +
                "/api/FileManager/GetFile?name=" +
                this.fileData[this.printingItemIndex]["MediaName"] +
                "&subFolder=" +
                this.fileData[this.printingItemIndex]["MediaRelativePath"],
            JSPM.FileSourceType.URL,
            this.fileData[this.printingItemIndex]["MediaName"],
            1
        );
        cpj.files.push(myFile);
        cpj.sendToClient().then((data: any) => {
            if (data !== "OK") {
                this.errorFile.push(
                    this.fileData[this.printingItemIndex]["MediaName"]
                );
            }
            this.printingItemIndex++;
            this.printFile();
        });
    }

    private showConfirmDialog() {
        if (this.errorFile.length) {
            let message: any = [
                { key: "<p>" },
                { key: "Modal_Message__Error_File_1" },
                { key: "</p>" },
            ];
            message.push({ key: "<ul>" });
            for (let item of this.errorFile) {
                message.push({ key: "<li>" });
                message.push({ key: item });
                message.push({ key: "</li>" });
            }
            message.push({ key: "</ul>" });
            this._modalService.warningHTMLText(message);
            return;
        }
        this._modalService.confirmMessageHtmlContent(
            new MessageModel({
                customClass: "width-500",
                headerText: "Confirm Printed Files",
                okText: "Confirm",
                message: [
                    { key: "<p>" },
                    {
                        key: "Modal_Message__Do_You_Want_To_Confirm_File_Printed_1",
                    },
                    { key: "</p>" },
                    { key: "<p>" },
                    {
                        key: "Modal_Message__Do_You_Want_To_Confirm_File_Printed_2",
                    },
                    { key: "</p>" },
                ],
                callBack1: () => {
                    this.confirmAction.emit();
                },
                callBack2: () => {
                    this.close();
                },
            })
        );
    }

    // Check JSPM WebSocket status
    private jspmWSStatus() {
        if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Open) {
            if (this.isDownloadFileWarningPopupOpening) {
                this._modalService.hideModal();
                this.isDownloadFileWarningPopupOpening = false;
            }
            return true;
        } else if (
            JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Closed
        ) {
            if (this.isDownloadFileWarningPopupOpening) return false;
            this.isDownloadFileWarningPopupOpening = true;
            this._modalService.confirmMessageHtmlContent(
                new MessageModel({
                    messageType: MessageModal.MessageType.warning,
                    customClass: "width-500",
                    headerText: "Download JSPrintManager",
                    okText: "Download",
                    buttonType1: MessageModal.ButtonType.warning,
                    message: [
                        { key: "<p>" },
                        { key: "Modal_Message__Download_JSPrintManager_1" },
                        { key: "</p>" },
                        { key: "<p>" },
                        { key: "Modal_Message__Download_JSPrintManager_2" },
                        { key: "</p>" },
                    ],
                    callBack1: () => {
                        this.isDownloadFileWarningPopupOpening = false;
                        window.open(
                            Configuration.PublicSettings
                                .jsPrintManagerDownloadLink,
                            "_blank"
                        );
                    },
                    callBack2: () => {
                        this.isDownloadFileWarningPopupOpening = false;
                    },
                })
            );
            // alert('JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm');
            return false;
        } else if (
            JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.BlackListed
        ) {
            this._toasterService.pop(
                "error",
                "Disabled",
                "JSPM has blacklisted this website!"
            );
            return false;
        }
    }
}
