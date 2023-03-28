import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    ViewChild,
    ChangeDetectorRef,
    EventEmitter,
    Output,
    ElementRef,
} from "@angular/core";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import {
    CommonService,
    AppErrorHandler,
    ToolsService,
    ModalService,
    DownloadFileService,
} from "app/services";
import {
    ToasterService,
    BodyOutputType,
} from "angular2-toaster/angular2-toaster";
import {
    ComboBoxTypeConstant,
    UploadFileMode,
    Configuration,
    MessageModal,
    FormSaveEvenType,
} from "app/app.constants";
import { ApiResultResponse, MessageModel } from "app/models";
import { Uti } from "app/utilities";
import { Subscription, Observable } from "rxjs";
import { FileUploadComponent } from "app/shared/components/xn-file";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
} from "@angular/forms";
import { AngularMultiSelect } from "app/shared/components/xn-control/xn-dropdown";
import { MatButton } from "app/shared/components/xn-control/light-material-ui/button";

@Component({
    selector: "mailing-return",
    styleUrls: ["./mailing-return.component.scss"],
    templateUrl: "./mailing-return.component.html",
})
export class MailingReturnComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    @ViewChild("fileUpload") fileUpload: FileUploadComponent;

    public disabledAddButton: boolean = true;
    public uploadFileShowDialog: boolean = false;
    public uploadFileMode: UploadFileMode = UploadFileMode.MailingReturn;
    public uploadFileIdFolder = new Date().getFullYear();
    public isRenderForm: boolean;
    public listComboBox: any = {};
    public mailingReturnForm: FormGroup;
    public isProcessing: boolean = false;

    private mailingReturnFormValueChangesSubscription: Subscription;
    @Output() outputData: EventEmitter<any> = new EventEmitter<any>();
    @Output() reload = new EventEmitter<any>();

    @ViewChild("reasonCtrl") reasonCtrl: AngularMultiSelect;
    @ViewChild("barcodeCtrl") barcodeCtrl: ElementRef;
    @ViewChild("customerNrCtrl") customerNrCtrl: ElementRef;
    @ViewChild("mediaCodeCtrl") mediaCodeCtrl: ElementRef;
    @ViewChild("btnAddCtrl") btnAddCtrl: MatButton;

    constructor(
        private formBuilder: FormBuilder,
        private consts: Configuration,
        private commonService: CommonService,
        private toolsService: ToolsService,
        private modalService: ModalService,
        private toasterService: ToasterService,
        private appErrorHandler: AppErrorHandler,
        private changeDetectorRef: ChangeDetectorRef,
        private downloadFileService: DownloadFileService,
        router: Router
    ) {
        super(router);
    }

    public ngOnInit() {
        this.initForm();
        this.getInitDropdownlistData();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    //#region Init Data
    private getInitDropdownlistData() {
        this.commonService
            .getListComboBox(ComboBoxTypeConstant.mailingReturnReason)
            .debounceTime(this.consts.valueChangeDeboundTimeDefault)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) return;

                    this.listComboBox = response.item;
                    this.isRenderForm = true;
                });
            });
    }

    private initForm() {
        this.mailingReturnForm = this.formBuilder.group({
            barcode: ["", null, this.incorrectValidator],
            customerNr: ["", Validators.required],
            mediaCode: ["", Validators.required],
            reason: ["", Validators.required],
        });
        this.mailingReturnForm["submitted"] = false;
        this.mailingReturnFormValueChangesSubscription =
            this.mailingReturnForm.valueChanges
                .debounceTime(this.consts.valueChangeDeboundTimeDefault)
                .subscribe((value) => {
                    this.appErrorHandler.executeAction(() => {
                        this.disabledAddButton = !this.mailingReturnForm.valid;
                        this.mailingReturnForm.updateValueAndValidity();
                    });
                });
        this.setOutputData({});

        this.barcodeFocus();
    }

    private setOutputData(data) {
        this.outputData.emit({
            isValid: true,
            isDirty: false,
            submitResult: data.submitResult,
            returnID: data.returnID,
        });
    }
    //#endregion

    public importData() {
        this.uploadFileShowDialog = true;
    }

    public downloadTemplateFile() {
        this.downloadFileService.makeDownloadFile(
            "ImportMailingReturnTemplate.xlsx",
            null,
            null,
            4
        );
    }

    //#region UploadFile
    public uploadFileCloseDialog() {
        this.uploadFileShowDialog = false;
    }

    public uploadFileOnComplete(event) {
        //console.log(event);
        if (event && event.response && event.response.item) {
            const resItem = event.response.item;

            if (resItem.messageException) {
                this.toasterService.pop(
                    "error",
                    "Import Failed with exception",
                    resItem.messageException
                );
                return;
            } else if (resItem.messageColumns) {
                //https://github.com/Stabzs/Angular2-Toaster
                this.toasterService.pop({
                    type: "error",
                    title: "Validation Failed",
                    body: resItem.messageColumns,
                    bodyOutputType: BodyOutputType.TrustedHtml,
                    timeout: 12000,
                });
                return;
            } else if (
                resItem.numofRowsValid &&
                resItem.saveResult &&
                resItem.saveResult.isSuccess
            ) {
                if (resItem.numofRowsInvalid) {
                    //save successfully hower there are 'x' items failed
                    this.toasterService.pop({
                        type: "success",
                        title: "Partial Success",
                        body:
                            "Import Mailing Return successfully with " +
                            resItem.numofRowsValid +
                            " valid item(s) and " +
                            resItem.numofRowsInvalid +
                            " invalid item(s)",
                        bodyOutputType: BodyOutputType.TrustedHtml,
                        timeout: 10000,
                    });
                } else {
                    //save all successfully
                    this.toasterService.pop({
                        type: "success",
                        title: "Success",
                        //body: 'Import Mailing Return successfully with ' + resItem.numofRowsValid + ' valid item(s)',
                        body: "Import Mailing Return successfully",
                        bodyOutputType: BodyOutputType.TrustedHtml,
                        timeout: 8000,
                    });
                }

                this.reloadSummaryWidget(resItem.saveResult.returnID);
                return;
            } else if (!resItem.numofRowsValid) {
                this.toasterService.pop(
                    "error",
                    "Import Failed",
                    "There is no row to import."
                );
                return;
            }
        }

        //this.toasterService.pop('error', 'Import Failed', 'These are some information of CustomerNr or Mediacode are wrong inside import file, please correct it before save.');
        this.toasterService.pop(
            "error",
            "Import Failed",
            "Import failed, please try again."
        );
    }
    //#endregion

    //#region Form Events
    private barcodeFocus() {
        setTimeout(() => {
            if (this.barcodeCtrl && this.barcodeCtrl.nativeElement)
                this.barcodeCtrl.nativeElement.focus();
        }, 1000);
    }

    public barcodeOnKeyUp(event) {
        // only execute business if it is enter key
        if (event.keyCode == 13) {
            this.barcodeProcess();
        }
    }

    public barcodeLostFocus($event: any): void {
        this.barcodeProcess();
    }

    public barcodeProcess(): void {
        const value = this.mailingReturnForm.controls["barcode"].value;
        if (value) {
            const splits = value.split(";");
            if (splits.length === 3) {
                const customer = splits[1];
                const mediacode = splits[2];
                this.mailingReturnForm.controls["customerNr"].setValue(
                    customer
                );
                this.mailingReturnForm.controls["mediaCode"].setValue(
                    mediacode
                );
                this.mailingReturnForm.updateValueAndValidity();

                if (mediacode && customer && !isNaN(parseFloat(customer))) {
                    this.setIncorrectValidatorControl("barcode", true); //valid
                    if (this.reasonCtrl.selectedItem) this.save();
                    else this.reasonCtrl.focus();

                    this.changeDetectorRef.detectChanges();
                    return;
                }
            }

            this.setIncorrectValidatorControl("barcode", false); //invalid
        } else {
            this.setIncorrectValidatorControl("barcode", true);
            this.customerNrCtrl.nativeElement.focus();
        }

        this.changeDetectorRef.detectChanges();
    }

    public customerNrOnKeyUp(event) {
        if (event.keyCode == 13) {
            const value = this.mailingReturnForm.controls["customerNr"].value;
            if (value) {
                this.mediaCodeCtrl.nativeElement.focus();
            } else {
                this.mailingReturnForm.controls["customerNr"].markAsDirty();
            }
        }
    }

    public mediaCodeOnKeyUp(event) {
        if (event.keyCode == 13) {
            const value = this.mailingReturnForm.controls["mediaCode"].value;
            if (value) {
                if (this.reasonCtrl.selectedItem) this.save();
                else this.reasonCtrl.focus();
            } else {
                this.mailingReturnForm.controls["mediaCode"].markAsDirty();
            }
        }
    }

    public reasonKeyUp(event) {
        if (event.keyCode == 13) {
            if (this.reasonCtrl.selectedItem) {
                this.save();
            }
        }
    }
    //#endregion

    //#region Save
    public reset() {
        this.setIncorrectValidatorControl("barcode", true); //valid
        Uti.resetValueForForm(this.mailingReturnForm);
        this.reasonCtrl.text = "";
        this.reasonCtrl.selectedValue = "";
        this.mailingReturnForm.markAsPristine();
        this.mailingReturnForm.markAsUntouched();
        this.barcodeFocus();
    }

    public save() {
        if (!this.mailingReturnForm.valid) {
            this.toasterService.pop(
                "warning",
                "Validation Fail",
                "No entry data for saving."
            );
            return;
        }

        this.processSaveData(this.prepareSaveData());
    }
    private processSaveData(data) {
        if (this.isProcessing) return;
        this.isProcessing = true;

        this.toolsService
            .saveMailingReturn(data)
            .finally(() => {
                this.isProcessing = false;
            })
            .subscribe(
                (response) => {
                    this.appErrorHandler.executeAction(() => {
                        if (response && response.isSuccess) {
                            this.reloadSummaryWidget(response.returnID);

                            this.toasterService.pop(
                                "success",
                                "Success",
                                "Mailing Return is saved successfully"
                            );
                            this.setOutputData({
                                submitResult: true,
                                returnID: response.returnID,
                                isValid: true,
                                isDirty: false,
                                formValue: this.mailingReturnForm.value,
                            });

                            this.setIncorrectValidatorControl("barcode", true); //valid
                            Uti.resetValueForForm(this.mailingReturnForm, [
                                "reason",
                            ]);
                            this.mailingReturnForm.markAsPristine();
                            this.mailingReturnForm.markAsUntouched();
                            this.barcodeFocus();
                        } else {
                            this.saveDataFailed();
                        }
                    });
                },
                (error) => {
                    this.saveDataFailed();
                }
            );
    }

    private saveDataFailed() {
        this.toasterService.pop(
            "error",
            "Save Failed",
            "The information of CustomerNr or Mediacode is wrong, please correct it before save?"
        );
        this.setOutputData({ submitResult: false });
    }

    private prepareSaveData() {
        let result = [];
        let item = {
            PersonNr: this.mailingReturnForm.controls["customerNr"].value,
            MediaCode: this.mailingReturnForm.controls["mediaCode"].value,
            IdRepPersonStatus: null,
            IdRepPersonBusinessStatus: null,
        };
        if (
            this.reasonCtrl.selectedItem.statusType ==
            "IdRepPersonBusinessStatus"
        ) {
            item.IdRepPersonBusinessStatus =
                this.reasonCtrl.selectedItem.idValue;
        } else if (
            this.reasonCtrl.selectedItem.statusType == "IdRepPersonStatus"
        ) {
            item.IdRepPersonStatus = this.reasonCtrl.selectedItem.idValue;
        }

        result.push(item);
        return result;
    }

    private reloadSummaryWidget(returnID) {
        this.reload.emit([
            {
                key: "IdMailingReturn",
                value: returnID,
            },
        ]);
    }
    //#endregion

    //#region Validation
    private setIncorrectValidatorControl(
        controlName: string,
        isValid: boolean
    ) {
        if (!isValid) if (!this.mailingReturnForm) return;

        const ctrl = this.mailingReturnForm.controls[controlName];
        if (!ctrl) return;

        ctrl["valueIncorrect"] = !isValid;
        ctrl.markAsDirty();

        ctrl.setErrors(isValid ? null : { incorrect: true });

        ctrl.updateValueAndValidity();
    }

    private incorrectValidator(control: FormControl): Observable<any> {
        return new Observable<any>((obser) => {
            if (!control["valueIncorrect"]) {
                obser.next(null); //ok
            } else {
                obser.next({ incorrect: true });
            }
            obser.complete();
        }).debounceTime(300);
    }
    //#endregion
}
