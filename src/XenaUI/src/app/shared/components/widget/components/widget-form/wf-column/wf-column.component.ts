import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  forwardRef,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';
import {
  WfPanelComponent,
  WfFieldComponent,
} from 'app/shared/components/widget/components/widget-form';
import { Uti } from 'app/utilities';
import { Subscription } from 'rxjs/Subscription';
import {
  DomHandler,
  ModalService,
  PropertyPanelService,
  WidgetFieldService,
} from 'app/services';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'wf-column',
  styleUrls: ['./wf-column.component.scss'],
  templateUrl: './wf-column.component.html',
  host: {
    '(contextmenu)': 'rightClicked($event)',
    // '(mouseup)': 'mouseUpEventHandler($event)',
    '(mouseover)': 'mouseDragOverHandler($event)',
  },
})
export class WfColumnComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges
{
  // public isShowWatermark = false;

  public columnData: any[] = [];
  public _column: any[] = [];
  public panel: any[] = [];
  public configColumnStyle: any;
  public enableGhostResize = false;

  @Input() set column(data: any) {
    this._column = data;
    this.updateRenderData();
  }

  get column() {
    return this._column;
  }

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
  @Input() canDelete = false;
  @Input() dragName: string;
  @Input() index: number;
  @Input() isDisableDragToPanel = false;
  @Input() isSAVLetter: boolean;
  @Input() isControlPressing = false;
  @Input() isDragging = false;
  @Input() backgroundColor: any = '';
  @Input() backgroundImage: any = '';
  @Input() errorShow: boolean;
  @Input() layoutTypeDragging = '';
  @Input() isIncludeLinebreak = false;
  @Input() isSettingDialog = false;
  @Input() isDuplicatedDialogForm = false;
  @Input() isJustDragged = false;
  @Input() isLastItem = false;
  @Input() designColumnsOnWidget: boolean;

  @Output() onEditFieldAction = new EventEmitter<any>();
  @Output() onShowCreditCardSelectionAction = new EventEmitter<any>();
  @Output() onCancelEditFieldAction = new EventEmitter<any>();
  @Output() onEnterKeyPressAction = new EventEmitter<any>();
  @Output() onUpdateValueAction = new EventEmitter<any>();
  @Output() onDeleteColumnAction = new EventEmitter<any>();
  @Output() onDeletePanelAction = new EventEmitter<any>();
  @Output() onSavePanelTitleAction = new EventEmitter<any>();
  @Output() onRightClickAction = new EventEmitter<any>();
  @Output() onRightClickControlAction = new EventEmitter<any>();
  @Output() onDeleteLineBreakAction = new EventEmitter<any>();
  @Output() onChangedAction = new EventEmitter<any>();
  @Output() onMouseUpAction = new EventEmitter<any>();
  @Output() callRenderScrollAction = new EventEmitter<any>();
  @Output() onMouseDownAction = new EventEmitter<any>();
  @Output() onColumnResizeEndAction = new EventEmitter<any>();
  @Output() onPanelResizeEndAction = new EventEmitter<any>();
  @Output() onFieldResizeEndAction = new EventEmitter<any>();
  @Output() onLineBreakResizeEndAction = new EventEmitter<any>();
  @Output() onChangeAction = new EventEmitter<any>();
  @Output() onApplyAction = new EventEmitter<any>();
  @Output() onToggleAction = new EventEmitter<any>();
  @Output() onMenuClickAction = new EventEmitter<any>();
  @Output() onSettingDialogAction = new EventEmitter<any>();
  @Output() onMenuMouseOverAction = new EventEmitter<any>();
  @Output() changeConfigAction = new EventEmitter<any>();

  @ViewChildren(forwardRef(() => WfPanelComponent))
  private wfPanelComponents: QueryList<WfPanelComponent>;
  @ViewChildren(forwardRef(() => WfFieldComponent))
  private wfFieldComponents: QueryList<WfFieldComponent>;

  constructor(
    protected router: Router,
    private propertyPanelService: PropertyPanelService,
    private elementRef: ElementRef,
    private domHandler: DomHandler,
    private ref: ChangeDetectorRef,
    private widgetFieldService: WidgetFieldService,
    private modalService: ModalService,
    private dragulaService: DragulaService
  ) {
    super(router);
  }

  public ngOnInit() {
    this.initDragulaEvents();
    if (this.column && this.column.config) {
      this.changePropertiesForColumnStyle(this.column.config);
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (
      !changes['isEditingLayout'] ||
      !Uti.hasChanges(changes['isEditingLayout'])
    )
      return;
    if (this.isEditingLayout) {
      this.initDragulaEvents();
      return;
    }
    Uti.unsubscribe(this);
  }

  public ngOnDestroy() {
    Uti.unsubscribe(this);
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

  public onEditField($event) {
    this.onEditFieldAction.emit($event);
  }

  public onShowCreditCardSelection($event) {
    this.onShowCreditCardSelectionAction.emit($event);
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

  public onDelete(column) {
    this.onDeleteColumnAction.emit(column);
  }

  public onDeletePanelHandle(panel: any) {
    this.onDeletePanelAction.emit({ column: this.column, panel: panel });
  }

  public onSavePanelTitleHandle(panel: any) {
    this.onSavePanelTitleAction.emit(panel);
  }

  public filterControl(control: any) {
    return !control.isHidden;
  }

  public rightClicked() {
    this.onRightClickAction.emit(this.column);
  }

  public onRightClickControlHandler(control: any) {
    this.onRightClickControlAction.emit(control);
  }

  public onDeleteLineBreakHandler(lineBreak: any) {
    this.onDeleteLineBreakAction.emit({
      parent: this.column,
      lineBreak: lineBreak,
    });
  }

  public onDeleteLineBreakInPanelHandler(panel: any) {
    this.onDeleteLineBreakAction.emit(panel);
  }

  public updateRenderData() {
    this.columnData = [
      ...this.column.children.filter((x) => !!x && !x.isHidden),
    ];
    // this.isShowWatermark = !this.columnData.length;
    if (!this.wfPanelComponents || !this.wfPanelComponents.length) return;
    this.wfPanelComponents.forEach((wfPanelComponent: WfPanelComponent) => {
      wfPanelComponent.updateRenderData();
    });
  }

  public changeConfigHandler(control: any) {
    this.changeConfigAction.emit(control);
  }

  // public mouseUpEventHandler() {
  //     this.onMouseUpAction.emit();
  // }

  public itemChecked(control: any) {}

  public changePropertiesForColumnStyle(config: any) {
    if (!config) return;
    const controlConfig = JSON.parse(config);
    const propShowColumnBorder = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleShowBorder'
    );
    const propColumnBorderColor = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleBorderColor'
    );
    const propColumnBorderWeight = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleBorderWeight'
    );
    const propColumnBorderStyle = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleBorderStyle'
    );
    const valueWeight = propColumnBorderWeight && propColumnBorderWeight.value;
    const valueBorderStyle =
      propColumnBorderStyle && propColumnBorderStyle.value;
    const valueBorderColor =
      propColumnBorderColor && propColumnBorderColor.value;
    const propColumnShowShadow = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleShowShadow'
    );
    const propColumnShadowColor = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleShadowColor'
    );
    const propColumnBackground = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleBackgroundColor'
    );
    const propColumnWidth = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleWidth'
    );
    const propColumnPaddingRight = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleRight'
    );
    const propColumnPaddingLeft = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ColumnStyleLeft'
    );
    const valueColumnBackgroundColor =
      propColumnBackground && propColumnBackground.value;
    const valueColumnShadowColor =
      propColumnShadowColor && propColumnShadowColor.value;
    this.column.width =
      (propColumnWidth && propColumnWidth.value) || this.column.width;
    this.configColumnStyle = {
      border:
        propShowColumnBorder && propShowColumnBorder.value
          ? `${valueWeight}px ${valueBorderStyle} ${valueBorderColor}`
          : '',
      'box-shadow':
        propColumnShowShadow && propColumnShowShadow.value
          ? `5px 5px 5px 0px ${valueColumnShadowColor}`
          : '',
      'background-color': valueColumnBackgroundColor
        ? valueColumnBackgroundColor
        : '',
      'padding-right':
        propColumnPaddingRight && propColumnPaddingRight.value
          ? `${propColumnPaddingRight.value}px`
          : '',
      'padding-left':
        propColumnPaddingLeft && propColumnPaddingLeft.value
          ? `${propColumnPaddingLeft.value}px`
          : '',
    };
  }

  public changePropertiesForPanelStyle(data: any): boolean {
    for (const wfPanelComponent of (<any>this.wfPanelComponents)._results) {
      if (data.key !== wfPanelComponent.panel.key) continue;
      wfPanelComponent.onChangeHandler(data);
      return true;
    }
    return false;
  }

  public updateWhenOpenConfigDialog(control: any): boolean {
    if ((control && control.layoutType !== 'panel') || !control) return;
    for (const wfPanelComponent of (<any>this.wfPanelComponents)._results) {
      if (control.key !== wfPanelComponent.panel.key) continue;
      wfPanelComponent.updateWhenOpenConfigDialog(control);
      return true;
    }
    return false;
  }

  public resetDataInPanel(data: any): boolean {
    for (const wfPanelComponent of (<any>this.wfPanelComponents)._results) {
      if (data.key !== wfPanelComponent.panel.key) continue;
      wfPanelComponent.resetDataInPanel(data);
      return true;
    }
    return false;
  }

  public changePropertiesForFieldStyle(data: any): boolean {
    for (const wfFieldComponent of (<any>this.wfFieldComponents)._results) {
      if (data.key !== wfFieldComponent.control.key) continue;
      wfFieldComponent.onChangeHandler(data);
      return true;
    }
    for (const wfPanelComponent of (<any>this.wfPanelComponents)._results) {
      if (!wfPanelComponent.changePropertiesForFieldStyle(data)) continue;
      return true;
    }
    return false;
  }

  public onMouseDownHandler(control: any) {
    this.onMouseDownAction.emit({ column: this.column, control: control });
  }

  public onMenuMouseOverHandler(isOver: boolean) {
    this.onMenuMouseOverAction.emit(isOver);
  }

  public queryWfFieldComponentsComponent(): Array<WfFieldComponent> {
    let result: Array<WfFieldComponent> = [];
    for (const item of this.columnData) {
      if (item.layoutType === 'control') {
        result.push(this.getInlineEditFromChildren(item.key));
      } else if (item.layoutType === 'panel') {
        result = [...result, ...this.getInlineEditFromPanel(item.key)];
      }
    }
    return result;
  }

  public updateColumnChildren() {
    this.wfPanelComponents.forEach((wfPanelComponent) => {
      wfPanelComponent.updatePanelChildren();
    });
    this.column.children = [
      ...this.columnData,
      ...this.column.children.filter((x) => x.isHidden),
    ];
    this.reSetOrderNumber(this.column.children);
  }

  public onPanelResizeEndHandler() {
    this.onPanelResizeEndAction.emit();
  }

  public onFieldResizeEndHandler() {
    this.onFieldResizeEndAction.emit();
  }

  public onLineBreakResizeEndHandler() {
    this.onLineBreakResizeEndAction.emit();
  }

  public onApplyHandler($event) {
    this.onApplyAction.emit($event);
  }

  public onChangeHandler(data: any) {
    if (data && data.config) {
      this.changePropertiesForColumnStyle(data.config);
    }
    this.onChangeAction.emit(data);
  }

  public onMousedownOnResize(column: any) {
    if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
    this.enableGhostResize = true;
    column.isResizing = true;
  }

  public onMouseupOnResize(column: any) {
    if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
    this.enableGhostResize = false;
    column.isResizing = false;
  }

  public onResizeStart(event: ResizeEvent, column: any) {
    if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
    column.isResizing = true;
    // const els = $('*[elColId="' + column.key + '"]');
    // if (!els || !els.length) return;
    // for (const el of <any>els) {
    //     if (el.className.indexOf('resize-ghost-element') === -1) continue;
    //     $(el).css({ 'width': '0px' });
    // }
  }

  public onResizing(event: ResizeEvent, column: any) {
    if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
    this.onColumnResizeEndAction.emit({
      column: column,
      newWidthPixel: event.rectangle.width,
    });
  }

  public onResizeEnd(event: ResizeEvent, column: any) {
    if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
    column.isResizing = false;
    column.isResized = true;
    // column.width = this.getColumnWidthAfterResize(event.rectangle.width);
    // const controlConfig = JSON.parse(this.column.config);
    // const propColumnWidth = this.propertyPanelService.getItemRecursive(controlConfig, 'ColumnStyleWidth');
    // if (propColumnWidth) {
    //     propColumnWidth.value = column.width;
    // }
    // this.column.config = JSON.stringify(controlConfig);
    // this.changePropertiesForColumnStyle(this.column.config);
    this.widgetFieldService.changeWidthForColumn(this.column.config);
    this.onColumnResizeEndAction.emit({
      column: column,
      newWidthPixel: event.rectangle.width,
    });
    this.callRenderScrollAction.emit();
    this.enableGhostResize = false;
    this.setThreeDotsForValue();
  }

  public setThreeDotsForValue() {
    if (this.wfPanelComponents && this.wfPanelComponents.length) {
      this.wfPanelComponents.forEach((wfPanelComponent) => {
        wfPanelComponent.setThreeDotsForValue();
      });
    }
    if (this.wfFieldComponents && this.wfFieldComponents.length) {
      this.wfFieldComponents.forEach((wfFieldComponent) => {
        wfFieldComponent.setThreeDotsForValue();
      });
    }
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/
  // private onDraggingSubscription: Subscription;
  private onDragendSubscription: Subscription;
  // private onDropSubscription: Subscription;
  // private onOverSubscription: Subscription;
  // private onOutSubscription: Subscription;
  private beforeIndex = 0;
  private minColumnWidth = 250;

  // Used for drag & drop multiple items
  private hasMultiple: boolean;
  private selectedItems: any;
  private mirrorContainer: any;

  private initDragulaEvents() {
    // this.onDraggingSubscription = this.dragulaService.drag.subscribe(this.onDragging.bind(this));
    // this.onDragendSubscription = this.dragulaService.dragend.subscribe(this.onDragend.bind(this));
    // this.onDropSubscription = this.dragulaService.drop.subscribe(this.onDrop.bind(this));
    // this.onOverSubscription = this.dragulaService.over.subscribe(this.onOver.bind(this));
    // this.onOutSubscription = this.dragulaService.out.subscribe(this.onOut.bind(this));
  }

  // private onDragging(args: any) {
  //     // if (this.dragName !== args[0]) return;
  //     // this.isDragging = true;
  //     // this.ref.markForCheck();
  //     // let bag = this.dragulaService.find(this.dragName);
  //     // bag.drake.off('drop',() => {});
  //     // this.isDragging = true;
  //     // for (let i = 0; i < this.columnData.length; i++) {
  //     //     if (this.columnData[i].key == el.id) {
  //     //         this.columnData[i].isDragging = true;
  //     //         this.beforeIndex = i;
  //     //     } else {
  //     //         this.columnData[i].isDragging = false;
  //     //     }
  //     // }
  // }

  // private onDragend(args: any) {
  //     if (this.dragName !== args[0]) return;
  //     // this.isDragging = false;
  //     // const [bagName, el, bagTarget, bagSource] = args;
  //     // for (let i = 0; i < this.columnData.length; i++) {
  //     //     if (this.columnData[i].key == el.id && this.beforeIndex !== i) {
  //     //         this.columnData[i].isDragged = true;
  //     //     }
  //     //     this.columnData[i].isDragging = false;
  //     // }
  //     // this.beforeIndex = -1;
  //     // this.isDisableDragToPanel = false;
  //     this.updateColumnChildren();
  //     this.onChangedAction.emit();
  //     this.callRenderScrollAction.emit();
  //     // Uti.setValueForArray(this.columnData, 'checked', false);
  //     setTimeout(() => {
  //         // this.isShowWatermark = !(this.columnData.length);
  //         Uti.setValueForArray(this.column.children, 'checked', false);
  //         this.ref.markForCheck();
  //     }, 300);
  //     // console.log(this.column);
  // }

  // private onDrop(args: any) {
  //     if (this.dragName !== args[0]) return;
  //     // const [bagName, elSource, bagTarget, bagSource, elTarget] = args;
  //     // let old = this.getElementIndex(elTarget);
  //     // let source = this.columnData[old];
  //     // let index = this.getElementIndex(elSource);
  //     // let target = this.columnData[index];
  //     // if (target && source) {
  //     //     return [source.order, target.order] = [target.order, source.order];
  //     // }
  //     // console.log(this.columnData);
  // }

  // private getElementIndex(el: any) {
  //     if (!el || !el.parentElement || !el.parentElement.children) return '';
  //     return [].slice.call(el.parentElement.children).indexOf(el);
  // }

  // private onOver(args: any) {
  //     if (this.dragName !== args[0]) return;
  //     const [bagName, elSource, bagTarget, bagSource, elTarget] = args;
  //     if (!bagTarget ||
  //         !bagTarget.attributes['elid'] ||
  //         !bagTarget.attributes['elid'].value ||
  //         bagTarget.attributes['elid'].value !== this.column.key) return;
  //     // this.isShowWatermark = false;
  //     // console.log(this.columnData);
  //     // console.log('over');
  //     this.ref.markForCheck();
  // }

  // private onOut(args: any) {
  //     // const [bagName, elSource, bagTarget, bagSource, elTarget] = args;
  //     // if (!bagSource ||
  //     //     !bagSource.attributes['elid'] ||
  //     //     !bagSource.attributes['elid'].value ||
  //     //     bagSource.attributes['elid'].value !== this.column.key) return;
  //     // this.isShowWatermark = !this.columnData.length;
  //     // console.log(this.columnData);
  //     // console.log('out');
  //     // this.ref.markForCheck();
  // }

  private reSetOrderNumber(arr: Array<any>) {
    if (!arr || !arr.length) return;
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) continue;
      arr[i]['order'] = i + 1;
      this.reSetOrderNumber(arr[i]['children']);
    }
  }

  private mouseDragOverHandler($event: any) {
    // var a = $event;
  }

  private getInlineEditFromChildren(key: string): WfFieldComponent {
    return this.wfFieldComponents.find((x) => x.control.key === key);
  }

  private getInlineEditFromPanel(key: string): Array<WfFieldComponent> {
    for (const item of this.wfPanelComponents.toArray()) {
      if (item.panel.key !== key) continue;
      return item.wfFieldComponents.toArray();
    }
    return [];
  }

  private getColumnWidthAfterResize(elementWidth: number) {
    // return elementWidth < this.minColumnWidth ? this.minColumnWidth
    //         : elementWidth;
  }
}
