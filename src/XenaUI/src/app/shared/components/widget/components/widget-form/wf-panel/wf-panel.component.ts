import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
    SimpleChanges,
} from "@angular/core";
import { BaseComponent } from "app/pages/private/base";
import { Router } from "@angular/router";
import { DragulaService } from "ng2-dragula";
import { Subscription } from "rxjs/Subscription";
import {
    ModalService,
    PropertyPanelService,
    WidgetFieldService,
} from "app/services";
import { WfFieldComponent } from "app/shared/components/widget/components/widget-form";
import { ResizeEvent } from "angular-resizable-element";
import { Uti } from "app/utilities/uti";
import { TypeForm } from "app/app.constants";
import cloneDeep from "lodash-es/cloneDeep";

@Component({
    selector: "wf-panel",
    styleUrls: ["./wf-panel.component.scss"],
    templateUrl: "./wf-panel.component.html",
    host: {
        "(mousedown)": "mouseDownEventHandler($event)",
    },
})
export class WfPanelComponent
    extends BaseComponent
    implements OnInit, OnDestroy, OnChanges
{
    public isHiddenWatermark = false;
    public panelChildren = [];
    public _control = [];
    // public isDuplicatedDialogForm = false;

    @Input() panel: any = {};
    @Input() column: any = {};
    @Input() dataStyle: any = {};
    @Input() formStyle: any = {};
    @Input() importantFormStyle: any = {};
    @Input() fieldStyle: any = {};
    @Input() dataSource: any = {};
    @Input() inlineLabelStyle: any = {};
    @Input() isDesignWidgetMode: any;
    @Input() minLabelWidth: any;
    @Input() labelTextAlign: any;
    @Input() dataTextAlign: any;
    @Input() editFormMode: any;
    @Input() form: any;
    @Input() controlWidth: any;
    @Input() isDialogMode: any;
    @Input() globalProperties: any;
    @Input() widgetProperties: any;
    @Input() widgetFormType: any;
    @Input() listVirtualElementNames: any;
    @Input() isEditingLayout = false;
    @Input() dragName: string;
    @Input() isDisableDrag = false;
    @Input() isDragging = false;
    @Input() isControlPressing = false;
    @Input() backgroundColor: any = "";
    @Input() errorShow: boolean;
    @Input() layoutTypeDragging: string = "";
    @Input() isIncludeLinebreak = false;
    @Input() isSettingDialog = false;
    @Input() isDuplicatedDialogForm = false;
    @Input() isJustDragged = false;
    @Input() canDelete = false;
    @Input() designColumnsOnWidget: boolean;

    @Output() onEditFieldAction = new EventEmitter<any>();
    @Output() onCancelEditFieldAction = new EventEmitter<any>();
    @Output() onEnterKeyPressAction = new EventEmitter<any>();
    @Output() onUpdateValueAction = new EventEmitter<any>();
    @Output() onDeletePanelAction = new EventEmitter<any>();
    @Output() onDeleteColumn = new EventEmitter<any>();
    @Output() onSavePanelTitleAction = new EventEmitter<any>();
    @Output() onDeleteLineBreakAction = new EventEmitter<any>();
    @Output() onRightClickAction = new EventEmitter<any>();
    @Output() onRightClickControlAction = new EventEmitter<any>();
    @Output() onMouseDownAction = new EventEmitter<any>();
    @Output() onPanelResizeEndAction = new EventEmitter<any>();
    @Output() onFieldResizeEndAction = new EventEmitter<any>();
    @Output() onLineBreakResizeEndAction = new EventEmitter<any>();
    @Output() onApplyAction = new EventEmitter<any>();
    @Output() onChangeAction = new EventEmitter<any>();
    @Output() onToggleAction = new EventEmitter<any>();
    @Output() onMenuClickAction = new EventEmitter<any>();
    @Output() onSettingDialogAction = new EventEmitter<any>();
    @Output() onResizingAction = new EventEmitter<any>();
    @Output() onResizeEndAction = new EventEmitter<any>();
    @Output() onMenuMouseOverAction = new EventEmitter<any>();
    @Output() changeConfigAction = new EventEmitter<any>();

    public isEditingTitle = false;
    public hasTitleError = false;
    public configTitleStyle: any = {};
    public configPanelStyle: any = {};
    public configUnderlineStyle: any = {};

    private isRowOld = false;
    @ViewChildren(forwardRef(() => WfFieldComponent))
    public wfFieldComponents: QueryList<WfFieldComponent>;

    private firstTimeConfig: any = [];

    constructor(
        private elementRef: ElementRef,
        private ref: ChangeDetectorRef,
        private modalService: ModalService,
        private dragulaService: DragulaService,
        private widgetFieldService: WidgetFieldService,
        private propertyPanelService: PropertyPanelService,
        router?: Router
    ) {
        super(router);
        // this.widgetFieldService.currentDuplicatedFieldsDialogs.subscribe(value => this.isDuplicatedDialogForm = value);
    }

    public ngOnInit() {
        if (this.panel && this.panel.config) {
            this.updateSetting(JSON.parse(this.panel.config));
        }
        this.appendResizeIconToWrapper();
    }

    public ngOnDestroy() {}

    public ngOnChanges(changes: SimpleChanges) {
        if (!changes["panel"] && !changes["isSettingDialog"]) return;
        const hasChangesPanel = Uti.hasChanges(changes["panel"]);
        if (hasChangesPanel) {
            this.updateRenderData();
        }
        const hasChangesIsSettingDialog = Uti.hasChanges(
            changes["isSettingDialog"]
        );
        if (
            hasChangesIsSettingDialog &&
            !changes["isSettingDialog"].currentValue
        ) {
            this.appendResizeIconToWrapper();
        }
    }

    // public filterUndefineControl(control: any) {
    //     if (!control)
    //         console.log(control);
    //     return !!control;
    // }

    public onToggleHandler($event) {
        this.onToggleAction.emit($event);
    }

    public onMenuClickHandler($event) {
        this.onMenuClickAction.emit($event);
    }

    public openSettingDialog($event) {
        this.onSettingDialogAction.emit($event);
    }

    public onEditField($event) {
        this.onEditFieldAction.emit($event);
    }

    public onCancelEditField($event) {
        this.onCancelEditFieldAction.emit($event);
    }

    public onEnterKeyPress($event) {
        this.onEnterKeyPressAction.emit($event);
    }

    public onUpdateValue($event) {
        this.onUpdateValueAction.emit($event);
    }

    public onDelete(panel) {
        this.onDeletePanelAction.emit(panel);
    }

    public deleteColumn(column) {
        this.onDeleteColumn.emit(column);
    }

    public onDeleteLineBreakHandler($event) {
        this.onDeleteLineBreakAction.emit({
            parent: this.panel,
            lineBreak: $event,
        });
    }

    // public rightClicked() {
    //     setTimeout(() => {
    //         this.onRightClickAction.emit(this.panel);
    //     }, 300);
    // }

    public mouseDownEventHandler(event: any) {
        switch (event.button) {
            // left click
            case 0:
                this.onMouseDownAction.emit(this.panel);
                break;
            // right click
            case 2:
                setTimeout(() => {
                    this.onRightClickAction.emit(this.panel);
                }, 300);
        }
    }

    public onRightClickControlHandler(control: any) {
        setTimeout(() => {
            this.onRightClickAction.emit(control);
        }, 300);
    }

    public itemChecked(control: any) {}

    public onMouseDownHandler(control: any) {
        this.onMouseDownAction.emit(control);
    }

    public onFieldResizeEndHandler() {
        this.onFieldResizeEndAction.emit();
    }

    public onLineBreakResizeEndHandler() {
        this.onLineBreakResizeEndAction.emit();
    }

    public onApplyHandler(event) {
        this.onApplyAction.emit(event);
    }

    public onMenuMouseOverHandler(isOver: boolean) {
        this.onMenuMouseOverAction.emit(isOver);
    }

    public onChangeHandler(event) {
        if (event && event.config) {
            const controlConfig = JSON.parse(event.config);
            this.updateSetting(controlConfig);
            this.switchToAutoHeight(controlConfig);
        }
        this.onChangeAction.emit(event);
    }

    public updateWhenOpenConfigDialog() {
        this.firstTimeConfig = JSON.parse(this.panel.config);
    }

    public resetDataInPanel(panel: any) {
        this.panel.config = JSON.stringify(this.firstTimeConfig);
        this.updateSetting(this.firstTimeConfig);
        this.firstTimeConfig = [];
    }

    public changePropertiesForTitleStyle(controlConfig: any) {
        if (typeof controlConfig === "string") {
            controlConfig = JSON.parse(controlConfig);
        }
        const propPanelTitleAlign = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "TitleStyleAlign"
        );
        const propPanelTitleText = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "TitleStyleText"
        );
        const propPanelColor = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "TitleStyleColor"
        );
        const propPanelBackgroundColor =
            this.propertyPanelService.getItemRecursive(
                controlConfig,
                "TitleStyleBackgroundColor"
            );
        const propPanelFontName = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "TitleStyleFontName"
        );
        const propPanelFontSize =
            this.propertyPanelService.getItemRecursive(
                controlConfig,
                "TitleStyleFontSize"
            ) || 0;
        const propPanelBold = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "TitleStyleBold"
        );
        const propPanelItalic = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "TitleStyleItalic"
        );
        const propPanelUnderline = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "TitleStyleUnderline"
        );
        const propPanelTitleShow = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "TitleStyleShow"
        );
        const valueTitleAlign =
            propPanelTitleAlign && propPanelTitleAlign.value;
        this.panel.title =
            propPanelTitleText && propPanelTitleText.value
                ? propPanelTitleText.value
                : this.panel.title;
        const marginForTitle = {
            Left: "0",
            Right: "0 20px 0 0",
            Center: "auto",
        };
        this.setStyleForPanel(propPanelFontSize);
        this.configTitleStyle = {
            margin: marginForTitle[valueTitleAlign],
            float: valueTitleAlign === "Right" ? "right" : "",
            color: propPanelColor && propPanelColor.value,
            visibility:
                propPanelTitleShow && propPanelTitleShow.value ? "" : "hidden",
            "background-color":
                propPanelBackgroundColor && propPanelBackgroundColor.value
                    ? propPanelBackgroundColor.value
                    : "white",
            "font-family": propPanelFontName && propPanelFontName.value,
            "font-size": propPanelFontSize && propPanelFontSize.value + "px",
            "font-weight":
                propPanelBold && propPanelBold.value ? "bold" : "normal",
            "font-style":
                propPanelItalic && propPanelItalic.value ? "italic" : "unset",
            "text-decoration":
                propPanelUnderline && propPanelUnderline.value
                    ? "underline"
                    : "unset",
        };
    }

    public changePropertiesForPanelStyle(controlConfig: any) {
        if (typeof controlConfig === "string") {
            controlConfig = JSON.parse(controlConfig);
        }
        const propShowPanelBorder = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleBorderShowBorder"
        );
        const propPanelBorderColor = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleBorderColor"
        );
        const propPanelBorderStyle = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleBorderStyle"
        );
        const propPanelBorderWeight =
            this.propertyPanelService.getItemRecursive(
                controlConfig,
                "PanelStyleBorderWeight"
            );
        const valueWeight =
            propPanelBorderWeight && propPanelBorderWeight.value;
        const valueBorderStyle =
            propPanelBorderStyle && propPanelBorderStyle.value;
        const valueBorderColor =
            propPanelBorderColor && propPanelBorderColor.value;
        const propPanelShowShadow = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleShadowShowShadow"
        );
        const propPanelShadowColor = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleShadowColor"
        );
        const propPanelBackground = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleBackgroundBackgroundColor"
        );
        const propPanelHeight = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleHeight"
        );
        const propPanelAutoHeight = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleAutoHeight"
        );
        const propPanelPaddingRight =
            this.propertyPanelService.getItemRecursive(
                controlConfig,
                "PanelStyleRight"
            );
        const propPanelPaddingLeft = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleLeft"
        );
        const valuePanelBackgroundColor =
            propPanelBackground && propPanelBackground.value;
        const valuePanelShadowColor =
            propPanelShadowColor && propPanelShadowColor.value;
        const valuePanelAutoHeight =
            propPanelAutoHeight && propPanelAutoHeight.value;
        this.panel.height = valuePanelAutoHeight
            ? "auto"
            : propPanelHeight && `${propPanelHeight.value}px`;
        if (this.panel && !this.panel.isRow) {
            this.configPanelStyle["border"] =
                propShowPanelBorder && propShowPanelBorder.value
                    ? `${valueWeight}px ${valueBorderStyle} ${valueBorderColor}`
                    : "";
        }
        this.configPanelStyle["padding-right"] =
            propPanelPaddingRight && propPanelPaddingRight.value
                ? `${propPanelPaddingRight.value}px`
                : "";
        this.configPanelStyle["padding-left"] =
            propPanelPaddingLeft && propPanelPaddingLeft.value
                ? `${propPanelPaddingLeft.value}px`
                : "";
        this.configPanelStyle["box-shadow"] =
            propPanelShowShadow && propPanelShowShadow.value
                ? `5px 5px 5px 0px ${valuePanelShadowColor}`
                : "";
        this.configPanelStyle["background-color"] = valuePanelBackgroundColor
            ? valuePanelBackgroundColor
            : "white";
    }

    public changePropertiesForUnderlineStyle(controlConfig: any) {
        if (typeof controlConfig === "string") {
            controlConfig = JSON.parse(controlConfig);
        }
        const propShowUnderline = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "UnderLineStyleUnderLineShow"
        );
        const propUnderlineColor = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "UnderLineStyleUnderLineColor"
        );
        const propUnderlineWeight = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "UnderLineStyleUnderLineWeight"
        );
        const propUnderlineShadowShow =
            this.propertyPanelService.getItemRecursive(
                controlConfig,
                "UnderLineStyleShadowShow"
            );
        const propUnderlineShadowColor =
            this.propertyPanelService.getItemRecursive(
                controlConfig,
                "UnderLineStyleShadowColor"
            );
        const valueUnderlineColor =
            propUnderlineColor && propUnderlineColor.value;
        const valueUnderlineWeight =
            propUnderlineWeight && propUnderlineWeight.value;
        const valueUnderlineShadowShow =
            propUnderlineShadowShow && propUnderlineShadowShow.value;
        const valueShowUnderline = propShowUnderline && propShowUnderline.value;
        const valueUnderlineShadowColor =
            propUnderlineShadowColor && propUnderlineShadowColor.value;
        this.configUnderlineStyle = {
            "border-bottom": valueShowUnderline
                ? `${valueUnderlineWeight}px solid ${valueUnderlineColor}`
                : "",
            "box-shadow":
                valueShowUnderline && valueUnderlineShadowShow
                    ? `5px 5px 5px 0px ${valueUnderlineShadowColor}`
                    : "",
        };
    }

    public changePropertiesForFieldStyle(data: any): boolean {
        for (let wfFieldComponent of (<any>this.wfFieldComponents)._results) {
            if (data.key !== wfFieldComponent.control.key) continue;
            wfFieldComponent.onChangeHandler(data);
            return true;
        }
        return false;
    }

    public changePropertiesForBehaviour(controlConfig: any) {
        if (typeof controlConfig === "string") {
            controlConfig = JSON.parse(controlConfig);
        }
        const behaviourIsRow = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "BehaviourIsRow"
        );
        const propPanelBorderStyle = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleBorderStyle"
        );
        const propPanelBorderWeight =
            this.propertyPanelService.getItemRecursive(
                controlConfig,
                "PanelStyleBorderWeight"
            );
        const propPanelBorderColor = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleBorderColor"
        );
        const propShowPanelBorder = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleBorderShowBorder"
        );
        const valueWeight =
            propPanelBorderWeight && propPanelBorderWeight.value;
        const valueBorderStyle =
            propPanelBorderStyle && propPanelBorderStyle.value;
        const valueBorderColor =
            propPanelBorderColor && propPanelBorderColor.value;
        this.isRowOld = this.panel.isRow;
        this.panel.isRow = behaviourIsRow ? behaviourIsRow.value : false;
        if (this.panel && this.panel.isRow) {
            this.configPanelStyle["border"] = "";
        }
        if (this.panel && !this.panel.isRow) {
            this.configPanelStyle["border"] =
                propShowPanelBorder && propShowPanelBorder.value
                    ? `${valueWeight}px ${valueBorderStyle} ${valueBorderColor}`
                    : "";
        }
    }

    public onMousedownOnResize(panel: any) {
        if (
            this.isSettingDialog ||
            panel.height === "auto" ||
            this.isDuplicatedDialogForm
        )
            return;
        panel.isResizing = true;
    }

    public onMouseupOnResize(panel: any) {
        if (
            this.isJustDragged ||
            this.isSettingDialog ||
            panel.height === "auto" ||
            this.isDuplicatedDialogForm
        )
            return;
        panel.isResizing = false;
    }

    public onResizeStart(event: ResizeEvent, panel: any) {
        if (
            this.isSettingDialog ||
            panel.height === "auto" ||
            this.isDuplicatedDialogForm
        )
            return;
        this.onResizingAction.emit(this.panel);
        panel.isResizing = true;
        // const els = $('*[elPanelId="' + panel.key + '"]');
        // if (!els || els.length < 2) return;
        // $(els[1]).css({ 'min-height': '0px' });
    }

    public onResizeEnd(event: ResizeEvent, panel: any) {
        if (
            this.isSettingDialog ||
            panel.height === "auto" ||
            this.isDuplicatedDialogForm
        )
            return;
        panel.isResizing = false;
        panel.isResized = true;
        if (this.isJustDragged) return;
        this.onResizeEndAction.emit(this.panel);
        this.renderPanelAfterResize(event, panel);
        this.changePropertiesForPanelStyle(this.panel.config);
        this.widgetFieldService.changeHeightForPanel(this.panel.config);
        this.onPanelResizeEndAction.emit();
        this.setThreeDotsForValue();
    }

    public setThreeDotsForValue() {
        if (!this.wfFieldComponents || !this.wfFieldComponents.length) return;
        this.wfFieldComponents.forEach((wfFieldComponent) => {
            wfFieldComponent.setThreeDotsForValue();
        });
    }

    public updatePanelChildren() {
        this.panel.children = [
            ...this.panelChildren,
            ...this.panel.children.filter((x) => !!x && x.isHidden),
        ];
    }

    public updateRenderData() {
        this.panelChildren = [
            ...this.panel.children.filter((x) => !!x && !x.isHidden),
        ];
        this._control = this.panelChildren.filter(
            (x) => x.layoutType === TypeForm.Control
        );
    }

    public changeConfigHandler(control: any) {
        this.changeConfigAction.emit(control);
    }

    // public filterPanel() {
    //     return this.panel.children.filter(x => !!x && !x.isHidden);
    // }

    /*************************************************************************************************/
    /***************************************PRIVATE METHOD********************************************/

    private onOverSubscription: Subscription;
    private onOutSubscription: Subscription;
    private minPanelHeight = 30;
    private minPanelRowHeight = 18;

    private updateSetting(controlConfig: any) {
        this.changePropertiesForBehaviour(controlConfig);
        this.changePropertiesForTitleStyle(controlConfig);
        this.changePropertiesForPanelStyle(controlConfig);
        this.changePropertiesForUnderlineStyle(controlConfig);
    }

    private setStyleForPanel(propPanelFontSize: any) {
        // setTimeout(() => {
        if (propPanelFontSize && !this.panel.isRow) {
            propPanelFontSize = propPanelFontSize.value || 0;
            this.configPanelStyle["padding-top"] =
                (propPanelFontSize > 5 ? propPanelFontSize - 5 : 0) + "px";
        } else {
            this.configPanelStyle["padding-top"] = "0px";
        }
        this.ref.detectChanges();
        // }, 500);
    }

    private initDragulaEvents() {
        this.onOverSubscription = this.dragulaService.over.subscribe(
            this.onOver.bind(this)
        );
        this.onOverSubscription = this.dragulaService.out.subscribe(
            this.onOut.bind(this)
        );
    }

    private switchToAutoHeight(controlConfig: any) {
        const behaviourIsRowOld = this.propertyPanelService.getItemRecursive(
            this.firstTimeConfig,
            "BehaviourIsRow"
        );
        const propPanelAutoHeightOld =
            this.propertyPanelService.getItemRecursive(
                this.firstTimeConfig,
                "PanelStyleAutoHeight"
            );
        const behaviourIsRowNew = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "BehaviourIsRow"
        );
        const propPanelAutoHeightNew =
            this.propertyPanelService.getItemRecursive(
                controlConfig,
                "PanelStyleAutoHeight"
            );
        if (!behaviourIsRowOld || !propPanelAutoHeightOld) return;
        if (propPanelAutoHeightOld.value !== propPanelAutoHeightNew.value)
            return;

        if (behaviourIsRowOld.value === behaviourIsRowNew.value) {
            const propPanelHeight = this.propertyPanelService.getItemRecursive(
                controlConfig,
                "PanelStyleHeight"
            );
            propPanelAutoHeightNew.value = propPanelAutoHeightOld.value;
            this.panel.height = propPanelAutoHeightOld.value
                ? "auto"
                : propPanelHeight && `${propPanelHeight.value}px`;
        } else if (!behaviourIsRowOld.value && behaviourIsRowNew.value) {
            propPanelAutoHeightNew.value = true;
            this.panel.height = "auto";
        }
        this.panel.config = JSON.stringify(controlConfig);
        this.changeConfigHandler(this.panel);
    }

    private appendResizeIconToWrapper() {
        setTimeout(() => {
            const elWrapperPanelId = $(
                '*[elWrapperPanelId="' + this.panel.key + '"]',
                this.elementRef.nativeElement
            );
            const elPanelId = $(
                '*[elPanelId="' + this.panel.key + '"]',
                this.elementRef.nativeElement
            );
            if (
                !elWrapperPanelId ||
                !elWrapperPanelId.length ||
                !elWrapperPanelId ||
                !elWrapperPanelId.length
            )
                return;

            let rzEl;
            for (let item of <any>elPanelId.children()) {
                if (item.id !== "resize-icon") continue;
                rzEl = $(item);
                rzEl.css("display", "block");
                break;
            }
            $(elWrapperPanelId[0]).append(rzEl);
        }, 300);
    }

    private onOver(args: any) {
        if (this.dragName !== args[0]) return;
        const [bagName, el, bagTarget, bagSource] = args;
        this.isHiddenWatermark =
            bagTarget.innerText.indexOf("Drag fields here") !== -1;
        this.ref.markForCheck();
    }

    private onOut(args: any) {
        // if (this.dragName !== args[0]) return;
        // setTimeout(() => {
        //     const [bagName, el, bagTarget, bagSource] = args;
        //     this.isHiddenWatermark = !!bagTarget.innerText;
        //     this.ref.markForCheck();
        // }, 200);
    }

    private renderPanelAfterResize(event: ResizeEvent, panel: any) {
        panel.height = this.getControlHeightAfterResize(event.rectangle.height);
        const controlConfig = JSON.parse(this.panel.config);
        const propPanelHeight = this.propertyPanelService.getItemRecursive(
            controlConfig,
            "PanelStyleHeight"
        );
        if (propPanelHeight) {
            propPanelHeight.value = panel.height;
        }
        this.panel.config = JSON.stringify(controlConfig);
    }

    private getControlHeightAfterResize(elementHeight: number) {
        return elementHeight <
            (this.panel.isRow ? this.minPanelRowHeight : this.minPanelHeight)
            ? this.panel.isRow
                ? this.minPanelRowHeight
                : this.minPanelHeight
            : elementHeight;
    }
}
