import {
    Component,
    OnInit,
    Input,
    Output,
    OnDestroy,
    ViewChild,
    EventEmitter,
    ChangeDetectorRef,
} from "@angular/core";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import { Uti } from "app/utilities";
import {
    CommonService,
    CampaignService,
    AppErrorHandler,
    DownloadFileService,
    ModalService,
    DomHandler,
} from "app/services";
import { ComboBoxTypeConstant } from "app/app.constants";
import { ApiResultResponse } from "app/models";
import cloneDeep from "lodash-es/cloneDeep";
import { XnFileUti } from "../xn-file.uti";
import { AngularMultiSelect } from "../../xn-control/xn-dropdown";
import { ToasterService } from "angular2-toaster/angular2-toaster";

@Component({
    selector: "list-template-of-file",
    styleUrls: ["./list-template-of-file.component.scss"],
    templateUrl: "./list-template-of-file.component.html",
})
export class ListTemplateOfFileComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    public labelList: Array<string> = [];
    public templates: Array<any> = [];
    public template: any;
    public isModeEditing = false;
    public templateId = "";
    // public templateFileName = '';
    public isDisableDownloadButton = true;
    public objMediaOriginalName: any;

    // private templateFile: any = {};
    private cachedData: Array<any> = [];
    private isTemplateFocus = false;
    private treeViewFileExtention: any = [];
    private _listenKeyRequestItem: any = [];
    private selectedTemplateId: any = "";

    @Input() set inputData(data: any) {
        this.templateId = data ? data.templateId.toString() : "";
        this.setSelectedItemForDropdownlist(this.templateId);
    }

    @Input() allowEdit;
    @Input() uploadFileMode;
    @Input() waitDataLoadingWhenDownload = false;

    @Input() set isEditing(data: boolean) {
        this.isModeEditing = data;
        if (!this.isModeEditing) {
            this.isTemplateFocus = false;
        }
    }

    @Input() set listenKeyRequestItem(listenKeyRequestItem: any) {
        if (listenKeyRequestItem) {
            this._listenKeyRequestItem = listenKeyRequestItem;
            this.getTemplateData();
        }
    }

    @Output() outputData = new EventEmitter<any>();
    @Output() onTemplateFileChangeAction = new EventEmitter<any>();
    @Output() onDataLoadedAction = new EventEmitter<any>();
    @Output() outTemplatesAction = new EventEmitter<any>();
    @ViewChild("templateCtr") templateCtr: AngularMultiSelect;

    constructor(
        private commonService: CommonService,
        private campaignService: CampaignService,
        private appErrorHandler: AppErrorHandler,
        private downloadFileService: DownloadFileService,
        private modalService: ModalService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _toasterService: ToasterService,
        private domHandler: DomHandler,
        router?: Router
    ) {
        super(router);
    }

    public ngOnInit() {
        this.loadTreeViewFileExtention();
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public changeTemplate() {
        this.getLabelListByTemplateId(this.templateCtr.selectedValue);
        this.objMediaOriginalName = this.templates.find(
            (v) => v.idValue === this.templateCtr.selectedValue
        );
        if (!this.isTemplateFocus) return;
        this.selectedTemplateId = this.templateCtr.selectedValue;
    }

    public onFocusTemplate() {
        this.isTemplateFocus = true;
        this.templateCtr.isDroppedDown = true;
    }

    public resetData(isKeepSelectedTemplateId?: boolean) {
        this.isTemplateFocus = false;
        if (!isKeepSelectedTemplateId) this.selectedTemplateId = "";
        this.getTemplateData();
    }

    public downloadFileClick() {
        if (!this.templateCtr) {
            this._toasterService.pop("warning", "Warning", "The file is null");
            return;
        }
        const { mediaName, mediaOriginalName, mediaRelativePath } =
            this.templateCtr.selectedItem;
        if (!mediaName || !mediaOriginalName || !mediaRelativePath) {
            this._toasterService.pop("warning", "Warning", "The file is null");
            return;
        }
        const url = Uti.getFileUrl(
            mediaName,
            null,
            mediaOriginalName,
            mediaRelativePath
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "result";
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            a.remove();
        }, 200);
        // this.domHandler.download(this.templateCtr.text + '_SampleData.txt', this.labelList.join(';'));
    }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/
    private setSelectedItemForDropdownlist(templateId: any) {
        if (!templateId) {
            this.templateCtr.selectedIndex = 0;
            return;
        }
        setTimeout(() => {
            const index =
                this.templates.findIndex((x) => x.idValue == templateId) ||
                (this.templates.length > 0 ? 0 : -1);
            this.templateCtr.selectedIndex = index;
        });
    }

    private loadTreeViewFileExtention() {
        this.commonService
            .getListComboBox(ComboBoxTypeConstant.treeMediaType)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (
                        !Uti.isResquestSuccess(response) ||
                        !response.item.treeMediaType
                    ) {
                        return;
                    }
                    this.treeViewFileExtention = response.item.treeMediaType;
                });
            });
    }

    private getLabelListByTemplateId(templateId: any) {
        this.reSetLabels();
        if (!templateId) {
            this.labelList.length = 0;
            this.setTemplateFileName();
            this.setOutputData();
            if (this.waitDataLoadingWhenDownload) {
                this.onDataLoadedAction.emit();
            }
            this._changeDetectorRef.detectChanges();
            return;
        }
        if (this.getDataFromCached(templateId)) return;
        this.campaignService
            .listDocumentTemplateColumnName(templateId)
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        this.labelList.length = 0;
                    } else {
                        this.labelList = this.buildLabelListFromRawData(
                            response.item.data[0][0].SQLQueryColumnName
                        );
                    }
                    this.setTemplateFileName();
                    this.pushDataToCached(templateId, this.labelList);
                    this.setOutputData();
                    if (this.waitDataLoadingWhenDownload) {
                        this.onDataLoadedAction.emit();
                    }
                    this._changeDetectorRef.detectChanges();
                });
            });
    }

    private buildLabelListFromRawData(rawData: string): Array<string> {
        const tableData = XnFileUti.builDataSourceFromSqlText(rawData, true);
        if (!tableData || !tableData.length) return [];
        return tableData.map((x) => {
            return x.DataField;
        });
    }

    private reSetLabels() {
        this.labelList.length = 0;
        this.isDisableDownloadButton = true;
        this._changeDetectorRef.detectChanges();
        this.onTemplateFileChangeAction.emit(this.getFileTemplateOutputData());
    }

    private getFileTemplateOutputData() {
        if (!this.templateCtr || !this.templateCtr.selectedItem) {
            return {};
        }
        return {
            MediaOriginalName: this.templateCtr.selectedItem.mediaOriginalName,
            MediaName: this.templateCtr.selectedItem.mediaName,
            Content: this.labelList.join(";"),
        };
    }

    private setOutputData() {
        if (
            !this.templateCtr ||
            !this.allowEdit ||
            !this.templateCtr.selectedValue
        ) {
            this.outputData.emit(null);
            return;
        }
        this.outputData.emit({
            data: {
                idValue: this.templateCtr.selectedValue,
                textValue: (
                    this.templates.find(
                        (x) => x.idValue == this.templateCtr.selectedValue
                    ) || {}
                ).textValue,
                mediaOriginalName: (
                    this.templates.find(
                        (x) => x.idValue == this.templateCtr.selectedValue
                    ) || {}
                ).mediaOriginalName,
            },
            dirty: this.isTemplateFocus,
        });
    }

    private setTemplateFileName() {
        if (this.templateCtr.selectedItem) {
            const { mediaOriginalName, mediaName, mediaRelativePath } =
                this.templateCtr.selectedItem;
            this.isDisableDownloadButton =
                !mediaOriginalName && !mediaName && !mediaRelativePath;
            this.onTemplateFileChangeAction.emit(
                this.getFileTemplateOutputData()
            );
        }
    }

    private getDataFromCached(idRepAppSystemColumnNameTemplate: any) {
        const currentItem = this.cachedData.find(
            (x) =>
                x.idRepAppSystemColumnNameTemplate ==
                idRepAppSystemColumnNameTemplate
        );
        if (currentItem && currentItem.data && currentItem.data.length) {
            this.labelList = cloneDeep(currentItem.data);
            this.isDisableDownloadButton =
                !this.labelList || !this.labelList.length;
            this.onTemplateFileChangeAction.emit(
                this.getFileTemplateOutputData()
            );
            this.setOutputData();
            if (this.waitDataLoadingWhenDownload) {
                this.onDataLoadedAction.emit();
            }
            this._changeDetectorRef.detectChanges();
            return true;
        }
        return false;
    }

    private pushDataToCached(idRepAppSystemColumnNameTemplate: any, data: any) {
        this.cachedData.push({
            idRepAppSystemColumnNameTemplate: idRepAppSystemColumnNameTemplate,
            data: cloneDeep(data),
        });
    }

    private timeoutGetTemplateData: any;
    private getTemplateData() {
        // Prevent call many times in this function because it is called in many places
        if (this.timeoutGetTemplateData) {
            clearTimeout(this.timeoutGetTemplateData);
            this.timeoutGetTemplateData = null;
        }
        this.timeoutGetTemplateData = setTimeout(() => {
            if (
                this._listenKeyRequestItem &&
                this._listenKeyRequestItem.item &&
                this._listenKeyRequestItem.item.IdCountrylanguage
            ) {
                this.commonService
                    .getComboBoxDataByFilter(
                        ComboBoxTypeConstant.repAppSystemColumnNameTemplate,
                        this._listenKeyRequestItem.item.IdCountrylanguage,
                        null,
                        true
                    )
                    .subscribe((response: ApiResultResponse) => {
                        this.appErrorHandler.executeAction(() => {
                            if (
                                !Uti.isResquestSuccess(response) ||
                                !Uti.getDataOfFirstProperty(response.item)
                            ) {
                                this.templates.length = 0;
                                this.templateCtr.text = "";
                                this.reSetLabels();
                                this.detectChanges();
                                return;
                            }
                            this.templates.length = 0;
                            this.templates =
                                this.appendEmptyItem(response.item) || [];
                            this.detectChanges();
                            this.outTemplatesAction.emit(this.templates);
                            this.setSelectedItemForDropdownlist(
                                this.templateId
                            );
                            this.keepCurrentSelectedTemplate();
                        });
                    });
            }
        }, 500);
    }

    private keepCurrentSelectedTemplate() {
        setTimeout(() => {
            if (!this.selectedTemplateId) return;
            if (!this.templateCtr.selectedValue) {
                this.templateCtr.selectedIndex = this.templates.findIndex(
                    (x) => x.idValue == this.selectedTemplateId
                );
            }
        });
    }

    private appendEmptyItem(data: any): Array<any> {
        const result = Uti.getDataOfFirstProperty(data);
        if (!result || !result.length) {
            return [];
        }
        return result;
        // return [...[{
        //     idValue: '',
        //     textValue: '',
        //     mediaOriginalName: '',
        //     mediaName: '',
        //     mediaRelativePath: ''
        // }], ...result];
    }

    private detectChanges() {
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        });
    }
}
