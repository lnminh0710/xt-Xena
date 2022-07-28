import { AfterViewInit, Component,
    ElementRef, EventEmitter, OnDestroy,
    Input, OnInit, Output, ViewChild} from '@angular/core';
import * as uti from 'app/utilities';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import {
    ModalService, WidgetFieldService
} from 'app/services';
import {
    MessageModal, TypeForm
} from 'app/app.constants';
import { Uti } from 'app/utilities/uti';
import {
    MessageModel
} from 'app/models';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'menu-setting-form-component',
    styleUrls: ['./menu-setting-form.component.scss'],
    templateUrl: 'menu-setting-form.component.html'
})

export class MenuSettingFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private currentToggleElement: any;
    private currentToggleMenuSubscription: Subscription;

    public _control: any;
    public _column: any;
    public _panel: any;

    public position: any = null;
    public randomNumb: string = uti.Uti.guid();
    public typeForm: typeof TypeForm = TypeForm;
    public columnLayout: boolean;
    public showToolButtons: boolean;
    public showColumnsDialog = false;
    public showDialogSetting = false;
    public showPanelDialog = false;
    public showControlDialog = false;
    public showLinebreakDialog = false;

    @ViewChild('menuSetting')

    private menuSetting: wjcInput.WjPopup;

    @Input() set control(value: any) {
        if (value) {
            this._control = value;
        }
    };

    get control() {
        return this._control;
    }

    @Input() set column(value: any) {
        if (value) {
            this._column = value;
        }
    };

    get column() {
        return this._column
    }

    @Input() set panel(value: any) {
        if (value) {
            this._panel = value;
        }
    };

    get panel() {
        return this._panel
    }

    @Input() canDelete: any;
    @Input() lineBreak: any;
    @Output() onDeleteLineBreak = new EventEmitter<any>();
    @Output() onDeletePanel = new EventEmitter<any>();
    @Output() onDeleteColumn = new EventEmitter<any>();
    @Output() onChangeAction = new EventEmitter<any>();
    @Output() onApplyAction = new EventEmitter<any>();
    @Output() onToggleAction = new EventEmitter<any>();
    @Output() onMenuClickAction = new EventEmitter<any>();
    @Output() onSettingDialogAction = new EventEmitter<any>();

    constructor(private elementRef: ElementRef,
                private modalService: ModalService,
                private widgetFieldService: WidgetFieldService,
    ) {
    }

    ngOnInit() {
        this.currentToggleMenuSubscription = this.widgetFieldService.currentToggleMenu.subscribe((value) => {
            if (Uti.isFieldMenuClicked) return;
            this.showToolButtons = value;
        });
    }

    ngOnDestroy(): void {
        Uti.unsubscribe(this);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initOwnerForMenuWidgetStatus();
        }, 500);
    }

    public openMenu(event) {
        this.showToolButtons = false;
        this.onToggleAction.emit();
        setTimeout(() => {
            this.currentToggleElement = $(event.target).closest('i.dropdown-toggle');
            const topParent = $(this.elementRef.nativeElement).closest('div.widget-module-info-container, div.widget-edit-dialog');
            if (topParent)
                this.position = {parent: topParent, toggleElement: this.currentToggleElement};
        });
        Uti.isFieldMenuClicked = true;
        setTimeout(() => {
            Uti.isFieldMenuClicked = false;
        }, 300);
    }

    private initOwnerForMenuWidgetStatus() {
        if (this.menuSetting && !this.menuSetting.owner)
            this.menuSetting.owner = $('#btnMenuSetting' + this.randomNumb, $(this.elementRef.nativeElement)).get(0);

    }

    private isCloseDDMenuFromInside = false;

    public wjPopupHidden(event, menuWidgetStatus) {
        // hide all opening sub menu
        if (menuWidgetStatus) {
            $('.sub-menu.filter-menu .sub-menu', menuWidgetStatus.hostElement).hide();
        }
        if (this.isCloseDDMenuFromInside) {
            this.isCloseDDMenuFromInside = false;
            return;
        }
        const container = $(this.elementRef.nativeElement).closest('div.box-default');
        if (container.hasClass('edit-mode') || container.hasClass('edit-table-mode') ||
            container.hasClass('edit-country-mode') || container.hasClass('edit-field-mode') ||
            container.hasClass('edit-form-mode'))
            return;
    }

    public showDialog() {
        this.onMenuClickAction.emit();
        this.onSettingDialogAction.emit(this.column);
        this.showToolButtons = true;
    }

    public showSettingField() {
        this.onMenuClickAction.emit();
        this.onSettingDialogAction.emit(this.control);
        this.widgetFieldService.openFieldDialog(true);
        this.widgetFieldService.changeDuplicatedFieldDialog(true);
        this.showToolButtons = true;
    }

    public showSettingPanel() {
        this.onMenuClickAction.emit();
        this.onSettingDialogAction.emit(this.panel);
        this.showToolButtons = true;
    }

    public deletePanel() {
        if (this._panel && this._panel.layoutType === TypeForm.Panel) {
            this.modalService.confirmMessageHtmlContent(new MessageModel({
                headerText: 'Delete Panel',
                messageType: MessageModal.MessageType.error,
                message: [{key: '<p>'}, {key: 'Modal_Message__Do_You_Want_To_Delete_This_Panel'},
                    {key: '</p>'}],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    this.onDeletePanel.emit(this._panel);
                }
            }));
        }
    }

    public deleteColumn() {
        if (this._column && this._column.layoutType === TypeForm.Column) {
            this.modalService.confirmMessageHtmlContent(new MessageModel({
                headerText: 'Delete Column',
                messageType: MessageModal.MessageType.error,
                message: [{key: '<p>'}, {key: 'Modal_Message__Do_You_Want_To_Delete_This_Column'},
                    {key: '</p>'}],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    this.onDeleteColumn.emit(this._column);
                }
            }));
        }
    }

    public deleteLineBreak() {
        if (this.lineBreak && this.lineBreak.layoutType === TypeForm.LineBreak) {
            this.modalService.confirmMessageHtmlContent(new MessageModel({
                headerText: 'Delete Line Break',
                messageType: MessageModal.MessageType.error,
                message: [{key: '<p>'}, {key: 'Modal_Message__Do_You_Want_To_Delete_This_Line_Break'},
                    {key: '</p>'}],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    this.onDeleteLineBreak.emit(this.lineBreak);
                }
            }));
        }
    }

    public onShowButtonToggleHandler(data: any) {
        this.showToolButtons = data;
        // this.showColumnsDialog = data;
        // this.showPanelDialog = data;
        // this.showControlDialog = data;
        // this.showLinebreakDialog = data;
    }
}
