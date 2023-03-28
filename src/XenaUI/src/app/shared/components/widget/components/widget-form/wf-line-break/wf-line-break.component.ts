import {
    Component,
    OnInit,
    Input,
    Output,
    OnDestroy,
    EventEmitter,
} from "@angular/core";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import { ModalService } from "app/services";
import { ResizeEvent } from "angular-resizable-element";
import { DragulaService } from "ng2-dragula";
import { MessageModal } from "app/app.constants";
import { MessageModel } from "app/models";

@Component({
    selector: "wf-line-break",
    styleUrls: ["./wf-line-break.component.scss"],
    templateUrl: "./wf-line-break.component.html",
    host: {
        "(mousedown)": "mouseDownEventHandler($event)",
    },
})
export class WfLineBreakComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    @Input() isEditingLayout = false;
    @Input() lineBreak: any;
    @Input() isControlPressing = false;
    @Input() dragName: string;
    @Input() isSettingDialog = false;
    @Input() isDuplicatedDialogForm = false;
    @Input() isJustDragged = false;
    @Input() canDelete = false;

    @Output() onDeleteAction = new EventEmitter<any>();
    @Output() onRightClickAction = new EventEmitter<any>();
    @Output() onMouseDownAction = new EventEmitter<any>();
    @Output() onLineBreakResizeEndAction = new EventEmitter<any>();
    @Output() onToggleAction = new EventEmitter<any>();
    @Output() onMenuClickAction = new EventEmitter<any>();
    @Output() onSettingDialogAction = new EventEmitter<any>();
    constructor(
        private modalService: ModalService,
        private dragulaService: DragulaService,
        router?: Router
    ) {
        super(router);
    }

    public ngOnInit() {}

    public ngOnDestroy() {}

    public onDelete() {
        this.modalService.confirmMessageHtmlContent(
            new MessageModel({
                headerText: "Delete Line Break",
                messageType: MessageModal.MessageType.error,
                message: [
                    { key: "<p>" },
                    {
                        key: "Modal_Message__Do_You_Want_To_Delete_This_Line_Break",
                    },
                    { key: "</p>" },
                ],
                buttonType1: MessageModal.ButtonType.danger,
                callBack1: () => {
                    this.onDeleteAction.emit(this.lineBreak);
                },
            })
        );
    }

    public onToggleHandler($event) {
        this.onToggleAction.emit($event);
    }

    public onMenuClickHandler($event) {
        this.onMenuClickAction.emit($event);
    }

    public openSettingDialog($event) {
        this.onSettingDialogAction.emit($event);
    }

    public mouseDownEventHandler(event) {
        switch (event.button) {
            // left click
            case 0:
                if (this.isControlPressing) {
                    this.lineBreak.checked = !this.lineBreak.checked;
                }
                this.onMouseDownAction.emit(this.lineBreak);
                break;
            // right click
            case 2:
                setTimeout(() => {
                    this.onRightClickAction.emit(this.lineBreak);
                }, 300);
        }
    }

    public onMousedownOnResize() {
        if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
        this.lineBreak.isResizing = true;
    }

    public onMouseupOnResize() {
        if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
        this.lineBreak.isResizing = false;
    }

    public onResizeStart(event: ResizeEvent) {
        if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
        this.lineBreak.isResizing = true;
    }

    public onResizeEnd(event: ResizeEvent) {
        if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
        this.lineBreak.isResizing = false;
        if (this.isJustDragged) return;
        this.lineBreak.height = this.getHeightAfterResize(
            event.rectangle.height
        );
        this.onLineBreakResizeEndAction.emit();
    }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/

    private minLineBreakHeight = 20;
    private maxLineBreakHeight = 250;

    private getHeightAfterResize(elementHeight: number) {
        return elementHeight < this.minLineBreakHeight
            ? this.minLineBreakHeight
            : // : elementHeight > this.maxLineBreakHeight ? this.maxLineBreakHeight
              elementHeight;
    }
}
