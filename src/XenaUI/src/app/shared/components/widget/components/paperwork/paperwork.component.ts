import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ElementRef } from "@angular/core";
import {
    DomHandler, ModalService
} from 'app/services';

import { BaseWidgetModuleInfo } from '../widget-info';

import {
    WidgetDetail, WidgetType, MessageModalModel, MessageModalHeaderModel, MessageModalBodyModel, MessageModalFooterModel, ButtonList
} from 'app/models';
import { MessageModal } from "app/app.constants";
import { XnAgGridComponent } from "app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component";

@Component({
    selector: 'paperwork',
    templateUrl: './paperwork.component.html',
    styleUrls: ['./paperwork.component.scss']
})
export class PaperworkComponent implements OnInit, OnDestroy, AfterViewInit {

    baseWidgetModuleInfo: BaseWidgetModuleInfo;
    public agGridComponent: XnAgGridComponent;

    constructor(public eref: ElementRef,
        private domHandler: DomHandler,
        private modalService: ModalService) {
    }

    /**
     * ngOnInit
     */
    public ngOnInit() {
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
    }

    /**
     * ngAfterViewInit
     */
    ngAfterViewInit() {
    }

    /**
     * registerWidgetModuleInfo
     * @param baseWidgetModuleInfo
     */
    public registerWidgetModuleInfo(widgetModuleInfo: BaseWidgetModuleInfo) {
        this.baseWidgetModuleInfo = widgetModuleInfo;
    }

    /**
     * setTitle
     * @param title
     */
    public setTitle(title: string) {
        let labelTitle: HTMLElement = this.domHandler.findSingle(this.eref.nativeElement, ".title");
        labelTitle.innerText = title;
    }

    /**
     * setBodyContent
     */
    public setBodyContent(element: any) {
        let bodyContainer: HTMLElement = this.domHandler.findSingle(this.eref.nativeElement, ".body-containner");
        if (this.domHandler.isElement(element)) {
            bodyContainer.innerHTML = element.outerHTML;
        }
        else {
            bodyContainer.innerHTML = element;
        }
    }

    private getAgGridComponent() {
        if (this.agGridComponent) return this.agGridComponent;
        if (this.baseWidgetModuleInfo && this.baseWidgetModuleInfo.agGridComponent) return this.baseWidgetModuleInfo.agGridComponent;

        return null;
    }

    /**
     * createPrintContent
     */
    private createPrintContent() {
        if (!this.baseWidgetModuleInfo) {
            if (this.agGridComponent) {
                this.setBodyContent(this.agGridComponent.getHTMLTable());
            }
            return;
        }
        let bodyContainer: any;
        const widgetDetail: WidgetDetail = this.baseWidgetModuleInfo.data;
        this.setTitle(widgetDetail.title);
        let widgetForm: any;
        switch (widgetDetail.idRepWidgetType) {
            case WidgetType.FieldSet:
            case WidgetType.FieldSetReadonly:
                bodyContainer = this.domHandler.findSingle(this.baseWidgetModuleInfo.elementRef.nativeElement, "widget-form");
                break;
            case WidgetType.EditableGrid:
            case WidgetType.TableWithFilter:
            case WidgetType.EditableRoleTreeGrid:
                bodyContainer = this.baseWidgetModuleInfo.agGridComponent ? this.baseWidgetModuleInfo.agGridComponent.getHTMLTable() : '';
                break;
            //case WidgetType.EditableRoleTreeGrid:
            //    bodyContainer = this.baseWidgetModuleInfo.treeGridComponent ? this.baseWidgetModuleInfo.treeGridComponent.getHTMLTable() : '';
            //    break;
            case WidgetType.DataGrid:
                if (this.baseWidgetModuleInfo.displayReadonlyGridAsForm) {
                    bodyContainer = this.domHandler.findSingle(this.baseWidgetModuleInfo.elementRef.nativeElement, "widget-form");
                } else {
                    bodyContainer = this.baseWidgetModuleInfo.agGridComponent ? this.baseWidgetModuleInfo.agGridComponent.getHTMLTable() : '';
                }
                break;
            case WidgetType.Combination:
                widgetForm = this.domHandler.findSingle(this.baseWidgetModuleInfo.elementRef.nativeElement, "widget-form");
                let table = this.baseWidgetModuleInfo.agGridComponent ? this.baseWidgetModuleInfo.agGridComponent.getHTMLTable() : '';
                bodyContainer = widgetForm.outerHTML + table;
                break;
            case WidgetType.CombinationCreditCard:
                widgetForm = this.domHandler.findSingle(this.baseWidgetModuleInfo.elementRef.nativeElement, "widget-form");
                let creditCard = this.domHandler.findSingle(this.baseWidgetModuleInfo.elementRef.nativeElement, "xn-credit-card");
                bodyContainer = widgetForm.outerHTML + creditCard.outerHTML;
                break;
            case WidgetType.Country:
                const countryCheckList = this.domHandler.findSingle(this.baseWidgetModuleInfo.elementRef.nativeElement, "xn-country-check-list");
                bodyContainer = countryCheckList.outerHTML;
                break;
            case WidgetType.TreeView:
                const treeView = this.domHandler.findSingle(this.baseWidgetModuleInfo.elementRef.nativeElement, "app-xn-tree-view");
                bodyContainer = treeView.outerHTML;
                break;
            case WidgetType.Chart:
                const chart = this.domHandler.findSingle(this.baseWidgetModuleInfo.elementRef.nativeElement, "chart-widget");
                bodyContainer = chart.outerHTML;
            case WidgetType.NoteForm:
                const notes = this.domHandler.findSingle(this.baseWidgetModuleInfo.elementRef.nativeElement, "note-control");
                bodyContainer = notes.outerHTML;
                if (bodyContainer) bodyContainer = bodyContainer.replaceAll('fa fa-trash-o', '');
                break;
        }

        if (bodyContainer) {
            this.setBodyContent(bodyContainer);
        }
    }

    private isShowPrintOptions() {
        const agGridComponent = this.getAgGridComponent();
        if (!agGridComponent) return false;

        let isShowDialog = false;
        let totalGridCells = 0;

        if (this.baseWidgetModuleInfo) {
            const widgetDetail: WidgetDetail = this.baseWidgetModuleInfo.data;
            switch (widgetDetail.idRepWidgetType) {
                case WidgetType.EditableGrid:
                case WidgetType.TableWithFilter:
                case WidgetType.EditableRoleTreeGrid:
                    totalGridCells = this.getTotalGridCells();
                    break;
                case WidgetType.DataGrid:
                    if (this.baseWidgetModuleInfo.displayReadonlyGridAsForm) {
                        return false;//Don't show print options
                    } else {
                        totalGridCells = this.getTotalGridCells();
                    }
                    break;
                case WidgetType.Combination:
                    totalGridCells = this.getTotalGridCells();
                    break;
            }
        }
        else {
            totalGridCells = this.getTotalGridCells();
        }

        console.log('Print - TotalGridCells: ' + totalGridCells);
        isShowDialog = totalGridCells > 10000;//1000 rows, 10 columns
        if (isShowDialog) {
            this.showDialogPrintOptions();
        }
        return isShowDialog;
    }

    private getTotalGridCells() {
        const agGridComponent = this.getAgGridComponent();
        const getAllDisplayedColumns = agGridComponent.columnApi.getAllDisplayedColumns().length;
        const getDisplayedRowCount = agGridComponent.api.getDisplayedRowCount();
        return getAllDisplayedColumns * getDisplayedRowCount;
    }

    /**
     * print
     */
    public print(forcePrint?: boolean) {
        if (!forcePrint && this.isShowPrintOptions()) {
            return;
        }
        this.createPrintContent();
        const widgetBoxElm = this.eref.nativeElement;
        const w = 1024;
        const h = 764;
        const left = (screen.width / 2) - (w / 2);
        const top = (screen.height / 2) - (h / 2);

        var params = [
            'height=' + h,
            'width=' + w,
            'top=' + top,
            'left=' + left
        ].join(',');

        let printContents, popupWin;
        let headContent = document.getElementsByTagName('head')[0].innerHTML;
        printContents = widgetBoxElm.outerHTML;
        popupWin = window.open('', '_blank', params);
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <link rel="stylesheet" type="text/css" href="/public/assets/lib/print/css/print.css">
              ${headContent}
            </head>
            <body id="print" onload="window.print();">${printContents}
            </body>
          </html>`
        );
        popupWin.document.close();
    }

    private showDialogPrintOptions() {
        //Only show warning when subTotal is negative
        this.modalService.showMessageModal(new MessageModalModel({
            customClass: 'dialog-confirm-total',
            //callBackFunc: null,
            messageType: MessageModal.MessageType.warning,
            modalSize: MessageModal.ModalSize.middle,
            showCloseButton: true,
            header: new MessageModalHeaderModel({
                text: 'Print Options'
            }),
            body: new MessageModalBodyModel({
                isHtmlContent: true,
                content: [{ key: '<p>' }, { key: 'Modal_Message__There_Are_Too_Much_Data_Recommend_Export_Function' },
                { key: '</p>' }]
            }),
            footer: new MessageModalFooterModel({
                buttonList: [
                    new ButtonList({
                        buttonType: MessageModal.ButtonType.primary,
                        text: 'Export',
                        customClass: '',
                        callBackFunc: () => {
                            this.modalService.hideModal();

                            const agGridComponent = this.getAgGridComponent();
                            if (agGridComponent)
                                agGridComponent.exportExcel();
                        }
                    }),
                    new ButtonList({
                        buttonType: MessageModal.ButtonType.default,
                        text: 'Print',
                        customClass: '',
                        callBackFunc: () => {
                            this.modalService.hideModal();
                            this.print(true);
                        }
                    }),
                    new ButtonList({
                        buttonType: MessageModal.ButtonType.default,
                        text: 'Cancel',
                        customClass: '',
                        callBackFunc: () => {
                            this.modalService.hideModal();
                        }
                    })]
            })
        }));
    }
}
