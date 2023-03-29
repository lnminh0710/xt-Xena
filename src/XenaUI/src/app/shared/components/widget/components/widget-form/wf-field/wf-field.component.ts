import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { InlineEditComponent } from 'app/shared/components/widget/components';
import { PropertyPanelService, WidgetFieldService } from 'app/services';
import { FormStyle, CssStyleForm } from 'app/app.constants';
import { ResizeEvent } from 'angular-resizable-element';
import { Uti } from 'app/utilities/uti';
import { WidgetType } from 'app/models/widget-detail/widget-constant';

@Component({
  selector: 'wf-field',
  styleUrls: ['./wf-field.component.scss'],
  templateUrl: './wf-field.component.html',
  host: {
    '(mousedown)': 'mouseDownEventHandler($event)',
  },
})
export class WfFieldComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges
{
  public fieldStyleWrapper: any = {};
  public fieldValueStyleWrapper: any = {};
  public configLabelAlign: string;
  public configStyleLabel: any = {};
  public configStyleGeneral: any = {};
  public configStyleData: any = {};
  public configStyleSeparate: any = {};
  public widthData: string;
  public widthLabel: string;
  public autoWidthLabel: boolean;
  public widthSeparate: string;
  public paddingLeftLabel: string;
  public paddingRightLabel: string;
  public hiddenData: string;
  public isHover = false;
  public separatorId = Uti.guid();
  public _formStyle: any;
  public justifyContent: any;
  public alignVerticalTop: any;
  public alignVerticalCenter: any;
  public alignVerticalBottom: any;

  private flexVAlign = {
    Top: 'Top',
    Middle: 'Middle',
    Bottom: 'Bottom',
  };
  private _index = -1;

  @Input() control: any = {};
  @Input() column: any = {};
  @Input() panel: any = {};
  @Input() dataStyle: any = {};

  @Input() set formStyle(data: any) {
    if (data) {
      this._formStyle = data;
      this.changePropertiesForGeneral(this.control);
      this.changePropertiesForLabelField(this.control);
      this.changePropertiesForDataField(this.control);
      this.changePropertiesForSeparate(this.control);
    }
  }

  @Input() importantFormStyle: any = {};
  @Input() fieldStyle: any = {};
  @Input() dataSource: any = {};
  @Input() inlineLabelStyle: any = {};
  @Input() isDesignWidgetMode: any;
  @Input() labelTextAlign: any;
  @Input() dataTextAlign: any;
  @Input() editFormMode: any;
  @Input() form: any;
  @Input() controlWidth: any;
  @Input() isDialogMode: any;
  @Input() globalProperties: any;
  private _separatorValue: string;
  @Input() set separatorValue(data: any) {
    this._separatorValue = data;
    this.calculateWithForValue();
  }

  get separatorValue() {
    return this._separatorValue;
  }

  @Input() errorShow: boolean;
  @Input() isSAVLetter: boolean;
  @Input() isRow: boolean;
  @Input() set index(data: any) {
    this._index = data;
    this.calculateLabelWidth();
  }

  private _minLabelWidth: any;
  @Input() set minLabelWidth(data: any) {
    this._minLabelWidth = data;
    if (this.control && this.control.config) {
      const controlConfig = JSON.parse(this.control.config);
      const propLabelStyleShow = this.propertyPanelService.getItemRecursive(
        controlConfig,
        'ILabelStyleShow'
      );
      const valueShowLabel = propLabelStyleShow && propLabelStyleShow.value;
      if (!valueShowLabel) return;
    }
    this.calculateLabelWidth();
  }

  private _widgetProperties: any;
  @Input() set widgetProperties(data: any) {
    this._widgetProperties = data;
  }

  get widgetProperties() {
    return this._widgetProperties;
  }

  @Input() widgetFormType: any;
  @Input() listVirtualElementNames: any;
  @Input() isEditingLayout: any;
  @Input() isControlPressing = false;
  @Input() isSettingDialog = false;
  @Input() isJustDragged = false;
  @Input() canDelete = false;
  @Input() designColumnsOnWidget: boolean;
  @Input() isDuplicatedDialogForm = false;

  @Output() onEditFieldAction = new EventEmitter<any>();
  @Output() onShowCreditCardSelectionAction = new EventEmitter<any>();
  @Output() onCancelEditFieldAction = new EventEmitter<any>();
  @Output() onEnterKeyPressAction = new EventEmitter<any>();
  @Output() onUpdateValueAction = new EventEmitter<any>();
  @Output() onRightClickAction = new EventEmitter<any>();
  @Output() onMouseDownAction = new EventEmitter<any>();
  @Output() onApplyAction = new EventEmitter<any>();
  @Output() onChangeAction = new EventEmitter<any>();
  @Output() onToggleAction = new EventEmitter<any>();
  @Output() onMenuClickAction = new EventEmitter<any>();
  @Output() onSettingDialogAction = new EventEmitter<any>();
  @Output() onFieldResizeEndAction = new EventEmitter<any>();
  @Output() onMenuMouseOverAction = new EventEmitter<any>();
  @Output() onDeletePanel = new EventEmitter<any>();
  @Output() onDeleteColumn = new EventEmitter<any>();

  @ViewChild(InlineEditComponent) inlineEditComponent: InlineEditComponent;

  constructor(
    router: Router,
    private ref: ChangeDetectorRef,
    private widgetFieldService: WidgetFieldService,
    private elementRef: ElementRef,
    private propertyPanelService: PropertyPanelService
  ) {
    super(router);
  }

  public ngOnInit() {
    if (this.control && this.control.config) {
      this.changePropertiesForLabelField(this.control);
      this.changePropertiesForDataField(this.control);
      this.changePropertiesForSeparate(this.control);
      this.changePropertiesForGeneral(this.control);
    }
  }

  public ngOnDestroy() {}

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes['isRow']) return;

    const hasChangesIsRow = Uti.hasChanges(changes['isRow']);

    if (hasChangesIsRow) {
      this.execMinLabelWidth(
        this.widthLabel || (this.isRow ? '' : this._minLabelWidth)
      );
      this.setThreeDotsForValue();
    }
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
    this.checkShowCreditCardSelection($event);
    this.onEditFieldAction.emit($event);
  }

  public onCancelEditField($event) {
    if (this.dataSource.idRepWidgetType === WidgetType.CombinationCreditCard) {
      if (this.inlineEditComponent.preValue == 3) {
        this.onShowCreditCardSelectionAction.emit([true, false]);
      } else {
        this.onShowCreditCardSelectionAction.emit([false, false]);
      }
    }

    this.onCancelEditFieldAction.emit($event);
  }

  public onEnterKeyPress($event) {
    this.onEnterKeyPressAction.emit($event);
  }

  public onUpdateValue($event) {
    this.onUpdateValueAction.emit($event);
  }

  public onDelete(panel) {
    this.onDeletePanel.emit(panel);
  }

  public deleteColumn(column) {
    this.onDeleteColumn.emit(column);
  }

  public mouseDownEventHandler(event: any) {
    switch (event.button) {
      // left click
      case 0:
        if (this.isControlPressing) {
          this.control.checked = !this.control.checked;
        }
        this.onMouseDownAction.emit(this.control);
        break;
      // right click
      case 2:
        setTimeout(() => {
          this.onRightClickAction.emit(this.control);
        }, 300);
    }
  }

  public updateProperties() {
    this.inlineEditComponent.updateProperties();
  }

  public reset(isResetEditing?: boolean) {
    this.inlineEditComponent.reset(isResetEditing);
  }

  public updatePrevalue() {
    this.inlineEditComponent.updatePrevalue();
  }

  public focus() {
    this.inlineEditComponent.focus();
  }

  public onApplyHandler(data: any) {
    this.onApplyAction.emit(data);
  }

  public onChangeHandler(data: any) {
    if (data && data.config) {
      this.control.config = data.config;
      this.changePropertiesForGeneral(data);
      this.changePropertiesForLabelField(data);
      this.changePropertiesForDataField(data);
      this.changePropertiesForSeparate(data);
    }
    this.onChangeAction.emit(data);
  }

  /**
   * checkShowCreditCardSelection
   */
  public checkShowCreditCardSelection($event) {
    if (
      this.dataSource.idRepWidgetType === WidgetType.CombinationCreditCard &&
      $event &&
      $event.control &&
      $event.control.key == 'B00CashProviderContract_IdRepPaymentsMethods'
    ) {
      if ($event.control.displayValue == 'Credit Card') {
        this.onShowCreditCardSelectionAction.emit(true);
      } else {
        this.onShowCreditCardSelectionAction.emit(false);
      }
    }
  }

  public changePropertiesForGeneral(data: any) {
    const controlConfig = JSON.parse(data.config);
    const propGeneralBackground = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'IGeneralSettingBackgroundColor'
    );
    const propGeneralVerticalAlign = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'IGeneralSettingVerticalAlign'
    );
    const propGeneralHeight = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'IGeneralSettingHeight'
    );
    const propGeneralAutoHeight = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'IGeneralSettingAutoHeight'
    );
    const valueGeneralAutoHeight =
      propGeneralAutoHeight && propGeneralAutoHeight.value;
    const valueGeneralVerticalAlign =
      propGeneralVerticalAlign && propGeneralVerticalAlign.value;
    const valueGeneralHeight = propGeneralHeight && propGeneralHeight.value;
    if (!this._formStyle.generalStyle) return;
    if (this.designColumnsOnWidget) {
      this.control.height = valueGeneralAutoHeight
        ? ''
        : valueGeneralHeight
        ? valueGeneralHeight
        : '';
      this.configStyleGeneral = {
        background:
          propGeneralBackground && propGeneralBackground.value
            ? propGeneralBackground.value
            : '',
      };
    } else {
      this.control.height =
        this._formStyle.generalStyle['height'] === 'auto'
          ? ''
          : this._formStyle.generalStyle['height']
          ? this._formStyle.generalStyle['height']
          : '';
      this.configStyleGeneral = {
        background: this._formStyle.generalStyle['background-color'],
      };
    }
    this.buildFlexAlignForField(valueGeneralVerticalAlign);
  }

  private buildFlexAlignForField(valueGeneralVerticalAlign) {
    if (!this.designColumnsOnWidget) {
      this.alignVerticalTop = false;
      this.alignVerticalCenter = false;
      this.alignVerticalBottom = false;
      return;
    }
    if (valueGeneralVerticalAlign === this.flexVAlign.Top) {
      this.alignVerticalTop = true;
      this.alignVerticalCenter = false;
      this.alignVerticalBottom = false;
    }

    if (valueGeneralVerticalAlign === this.flexVAlign.Middle) {
      this.alignVerticalTop = false;
      this.alignVerticalCenter = true;
      this.alignVerticalBottom = false;
    }

    if (valueGeneralVerticalAlign === this.flexVAlign.Bottom) {
      this.alignVerticalTop = false;
      this.alignVerticalCenter = false;
      this.alignVerticalBottom = true;
    }
  }

  public changePropertiesForLabelField(data: any) {
    const controlConfig = JSON.parse(data.config);
    const propLabelAlign = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelStyleJustifyContent'
    );
    const propLabelBackground = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelStyleBackgroundColor'
    );
    const propLabelColor = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelStyleColor'
    );
    const propLabelFontName = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelStyleFontName'
    );
    const propLabelFontSize = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelStyleFontSize'
    );
    const propLabelBold = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelStyleBold'
    );
    const propLabelItalic = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelStyleItalic'
    );
    const propLabelUnderline = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelStyleUnderline'
    );
    const propLabelStyleShow = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelStyleShow'
    );
    const propLabelWidth = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelWidth'
    );
    const propLabelAutoWidth = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelAutoWidth'
    );
    const propLabelRight = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelRight'
    );
    const propLabelLeft = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'ILabelLeft'
    );
    const valueShowLabel = propLabelStyleShow && propLabelStyleShow.value;
    const valueLabelWidth = propLabelWidth && propLabelWidth.value;
    const valueLabelLeft = propLabelLeft && propLabelLeft.value;
    const valueLabelRight = propLabelRight && propLabelRight.value;
    this.configLabelAlign = propLabelAlign && propLabelAlign.value;
    this.paddingLeftLabel =
      valueLabelLeft && this.designColumnsOnWidget ? `${valueLabelLeft}px` : '';
    this.paddingRightLabel =
      valueLabelRight && this.designColumnsOnWidget
        ? `${valueLabelRight}px`
        : '';
    if (this.designColumnsOnWidget) {
      this.autoWidthLabel = propLabelAutoWidth && propLabelAutoWidth.value;
      this.widthLabel = valueLabelWidth ? `${valueLabelWidth}` : '';
      this.execMinLabelWidth(
        this.widthLabel || (this.isRow ? '' : this._minLabelWidth)
      );
      this.configStyleLabel = {
        ...this.configStyleLabel,
        ...{
          color:
            propLabelColor && propLabelColor.value ? propLabelColor.value : '',
          background:
            propLabelBackground && propLabelBackground.value
              ? propLabelBackground.value
              : '',
          display: valueShowLabel ? '' : 'none',
          overflow: 'hidden',
          'font-family':
            propLabelFontName && propLabelFontName.value
              ? propLabelFontName.value
              : '',
          'font-size':
            propLabelFontSize && propLabelFontSize.value
              ? `${propLabelFontSize.value}px`
              : '',
          'font-style':
            propLabelItalic && propLabelItalic.value ? 'italic' : '',
          'font-weight': propLabelBold && propLabelBold.value ? 'bold' : '',
          'justify-content':
            propLabelAlign && propLabelAlign.value
              ? this.buildJustifyContent(propLabelAlign.value)
              : '',
          'text-decoration':
            propLabelUnderline && propLabelUnderline.value ? 'underline' : '',
        },
      };
    } else {
      this.autoWidthLabel =
        this._formStyle.labelStyle['width'] === 'auto'
          ? this._formStyle.labelStyle['width']
          : '';
      this.widthLabel = this._formStyle.labelStyle['width'];
      this.execMinLabelWidth(
        this.widthLabel || (this.isRow ? '' : this._minLabelWidth)
      );
      this.configStyleLabel = {
        ...this.configStyleLabel,
        ...{
          color: this._formStyle.labelStyle.color,
          background: this._formStyle.labelStyle['background-color'],
          overflow: 'hidden',
          'font-family': this._formStyle.labelStyle['font-family'],
          'font-size': this._formStyle.labelStyle['font-size'],
          'font-style': this._formStyle.labelStyle['font-style'],
          'font-weight': this._formStyle.labelStyle['font-weight'],
          'justify-content': this.buildJustifyContent(
            this._formStyle.labelStyle['justify-content']
          ),
          'text-decoration': this._formStyle.labelStyle['text-decoration'],
        },
      };
    }
  }

  public changePropertiesForSeparate(data: any) {
    const configField = JSON.parse(data.config);
    const propSeparateAlign = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateJustifyContent'
    );
    const propSeparateValue = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateValue'
    );
    const propSeparateBackground = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateBackgroundColor'
    );
    const propSeparateColor = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateColor'
    );
    const propSeparateFontName = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateFontName'
    );
    const propSeparateFontSize = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateFontSize'
    );
    const propSeparateBold = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateBold'
    );
    const propSeparateItalic = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateItalic'
    );
    const propSeparateUnderline = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateUnderline'
    );
    const propSeparateWidth = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateWidth'
    );
    const propSeparateAutoWidth = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateAutoWidth'
    );
    const propSeparatePaddingRight = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateRight'
    );
    const propSeparatePaddingLeft = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateLeft'
    );
    const propSeparateShow = this.propertyPanelService.getItemRecursive(
      configField,
      'ISeparateShow'
    );
    const valueSeparateWidth = propSeparateWidth && propSeparateWidth.value;
    const valueSeparatePaddingLeft =
      propSeparatePaddingLeft && propSeparatePaddingLeft.value;
    const valueSeparatePaddingRight =
      propSeparatePaddingRight && propSeparatePaddingRight.value;
    if (!this._formStyle.separateStyle) return;
    if (this.designColumnsOnWidget) {
      this.separatorValue =
        propSeparateValue && propSeparateValue.value
          ? propSeparateValue.value
          : '';
      this.widthSeparate =
        propSeparateAutoWidth && propSeparateAutoWidth.value
          ? 'auto'
          : valueSeparateWidth
          ? `${valueSeparateWidth}px`
          : '';
      this.calculateWithForValue();
      this.configStyleSeparate = {
        ...this.configStyleSeparate,
        ...{
          color:
            propSeparateColor && propSeparateColor.value
              ? propSeparateColor.value
              : '',
          background:
            propSeparateBackground && propSeparateBackground.value
              ? propSeparateBackground.value
              : '',
          visibility:
            propSeparateShow && propSeparateShow.value ? '' : 'hidden',
          width: this.widthSeparate,
          'min-width': this.widthSeparate,
          'padding-right': valueSeparatePaddingRight
            ? `${valueSeparatePaddingRight}px`
            : '',
          'padding-left': valueSeparatePaddingLeft
            ? `${valueSeparatePaddingLeft}px`
            : '',
          'font-family':
            propSeparateFontName && propSeparateFontName.value
              ? propSeparateFontName.value
              : '',
          'font-size':
            propSeparateFontSize && propSeparateFontSize.value
              ? `${propSeparateFontSize.value}px`
              : '',
          'font-style':
            propSeparateItalic && propSeparateItalic.value ? 'italic' : '',
          'font-weight':
            propSeparateBold && propSeparateBold.value ? 'bold' : '',
          // 'text-align': propSeparateAlign && propSeparateAlign.value ? propSeparateAlign.value : '',
          'justify-content': this.getAlignForFlexFromTextAlign(
            propSeparateAlign && propSeparateAlign.value
              ? propSeparateAlign.value
              : ''
          ),
          'text-decoration':
            propSeparateUnderline && propSeparateUnderline.value
              ? 'underline'
              : '',
        },
      };
    } else {
      this.separatorValue = this._formStyle.separateStyle.value;
      this.widthSeparate =
        this._formStyle.separateStyle['width'] === 'auto'
          ? 'auto'
          : this._formStyle.separateStyle['width']
          ? `${this._formStyle.separateStyle['width']}px`
          : '';
      this.calculateWithForValue();
      this.configStyleSeparate = {
        ...this.configStyleSeparate,
        ...{
          color: this._formStyle.separateStyle.color,
          background: this._formStyle.separateStyle['background-color'],
          width: this.widthSeparate,
          'min-width': this.widthSeparate,
          'font-family': this._formStyle.separateStyle['font-family'],
          'font-size': this._formStyle.separateStyle['font-size'],
          'font-style': this._formStyle.separateStyle['font-style'],
          'font-weight': this._formStyle.separateStyle['font-weight'],
          // 'text-align': this._formStyle.separateStyle['justify-content'],
          'justify-content': this.getAlignForFlexFromTextAlign(
            this._formStyle.separateStyle['justify-content']
          ),
          'text-decoration': this._formStyle.separateStyle['text-decoration'],
        },
      };
    }
  }

  private getAlignForFlexFromTextAlign(align: string) {
    align = align || '';
    switch (align.toLowerCase()) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'space-around';
      case 'right':
        return 'flex-end';
    }
    return '';
  }

  public changePropertiesForDataField(data: any) {
    const configField = JSON.parse(data.config);
    const propDataAlign = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleJustifyContent'
    );
    const propDataBackground = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleAlignBackgroundColor'
    );
    const propDataColor = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleColor'
    );
    const propDataFontName = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleFontName'
    );
    const propDataFontSize = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleFontSize'
    );
    const propDataBold = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleBold'
    );
    const propDataItalic = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleItalic'
    );
    const propDataUnderline = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleUnderline'
    );
    const propDataWidth = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleWidth'
    );
    const propDataAutoWidth = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleAutoWidth'
    );
    const propDataPaddingRight = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleRight'
    );
    const propDataPaddingLeft = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleLeft'
    );
    const propDataShow = this.propertyPanelService.getItemRecursive(
      configField,
      'IDataStyleShow'
    );
    const valueDataPaddingLeft =
      propDataPaddingLeft && propDataPaddingLeft.value;
    const valueDataPaddingRight =
      propDataPaddingRight && propDataPaddingRight.value;
    const valueDataWidth = propDataWidth && propDataWidth.value;
    this.hiddenData = '';

    if (this.designColumnsOnWidget) {
      this.hiddenData = propDataShow && propDataShow.value ? '' : 'hidden';
      this.widthData =
        propDataAutoWidth && propDataAutoWidth.value
          ? 'auto'
          : valueDataWidth
          ? `${valueDataWidth}px`
          : '';
      this.setWithForValue();
      this.justifyContent = {
        'justify-content':
          propDataAlign && propDataAlign.value
            ? this.buildJustifyContent(propDataAlign.value)
            : '',
      };
      this.configStyleData = {
        ...this.configStyleData,
        ...{
          color:
            propDataColor && propDataColor.value ? propDataColor.value : '',
          background:
            propDataBackground && propDataBackground.value
              ? propDataBackground.value
              : '',
          'padding-right': valueDataPaddingRight
            ? `${valueDataPaddingRight}px`
            : '',
          'padding-left': valueDataPaddingLeft
            ? `${valueDataPaddingLeft}px`
            : '',
          'font-family':
            propDataFontName && propDataFontName.value
              ? propDataFontName.value
              : '',
          'font-size':
            propDataFontSize && propDataFontSize.value
              ? `${propDataFontSize.value}px`
              : '',
          'font-style': propDataItalic && propDataItalic.value ? 'italic' : '',
          'font-weight': propDataBold && propDataBold.value ? 'bold' : '',
          'justify-content':
            propDataAlign && propDataAlign.value
              ? this.buildJustifyContent(propDataAlign.value)
              : '',
          'text-decoration':
            propDataUnderline && propDataUnderline.value ? 'underline' : '',
        },
      };
    } else {
      this.widthData =
        this._formStyle.dataStyle['width'] === 'auto'
          ? 'auto'
          : this._formStyle.dataStyle['width']
          ? `${this._formStyle.dataStyle['width']}px`
          : '';
      this.setWithForValue();
      this.justifyContent = {
        'justify-content': this.buildJustifyContent(
          this._formStyle.dataStyle['justify-content']
        ),
      };
      this.configStyleData = {
        ...this.configStyleData,
        ...{
          color: this._formStyle.dataStyle.color,
          background: this._formStyle.dataStyle['background-color'],
          'font-family': this._formStyle.dataStyle['font-family'],
          'font-size': this._formStyle.dataStyle['font-size'],
          'font-style': this._formStyle.dataStyle['font-style'],
          'font-weight': this._formStyle.dataStyle['font-weight'],
          'justify-content': this.buildJustifyContent(
            this._formStyle.dataStyle['justify-content']
          ),
          'text-decoration': this._formStyle.dataStyle['text-decoration'],
        },
      };
    }

    this.setThreeDotsForValue();
  }

  public openFieldDialog() {
    this.widgetFieldService.changeMenuToggleForm(true);
    this.widgetFieldService.currentFieldDialog.take(1).subscribe((value) => {
      if (value) {
        this.onMenuClickAction.emit();
        this.onSettingDialogAction.emit(this.control);
      }
    });
  }
  public onMousedownOnResize(control: any) {
    if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
    control.isResizing = true;
  }

  public onMouseupOnResize(control: any) {
    if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
    control.isResizing = false;
  }

  public onResizeStart(event: ResizeEvent, control: any) {
    if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
    control.isResizing = true;
  }

  public onResizeEnd(event: ResizeEvent, control: any) {
    if (this.isSettingDialog || this.isDuplicatedDialogForm) return;
    control.isResizing = false;
    control.isResized = true;
    if (this.isJustDragged) return;
    control.height = this.getControlWidthAfterResize(event.rectangle.height);
    const controlConfig = JSON.parse(this.control.config);
    const propGeneralHeight = this.propertyPanelService.getItemRecursive(
      controlConfig,
      'IGeneralSettingHeight'
    );
    if (propGeneralHeight) {
      propGeneralHeight.value = control.height;
    }
    this.control.config = JSON.stringify(controlConfig);
    this.changePropertiesForGeneral(this.control);
    this.widgetFieldService.changeWidthForColumn(this.control.config);
    this.onFieldResizeEndAction.emit();
    this.inlineEditComponent.setThreeDotsForValue();
  }

  public onMouseEnter() {
    this.isHover = true;
  }

  public onMouseLeave() {
    this.isHover = false;
  }

  public onMenuMouseEnter() {
    this.onMenuMouseOverAction.emit(true);
  }

  public onMenuMouseLeave() {
    this.onMenuMouseOverAction.emit(false);
  }

  public setThreeDotsForValue() {
    if (!this.inlineEditComponent) return;
    setTimeout(() => {
      this.inlineEditComponent.setThreeDotsForValue();
    }, 200);
  }

  public onDoubleClickEditHandler($event) {
    this.editFormMode = $event;
  }

  /*************************************************************************************************/
  /***************************************PRIVATE METHOD********************************************/
  private minControlHeight = 18;

  private execMinLabelWidth(data: any) {
    this.fieldStyleWrapper = {
      width: `${data}px`,
      'min-width': `${data}px`,
    };
    this.calculateWithForValue();
  }

  private getControlWidthAfterResize(elementHeight: number) {
    return elementHeight < this.minControlHeight
      ? this.minControlHeight
      : elementHeight;
  }

  private buildJustifyContent(align: string) {
    switch (align) {
      case FormStyle.Left:
        return CssStyleForm.FlexStart;
      case FormStyle.Center:
        return CssStyleForm.SpaceAround;
      case FormStyle.Right:
        return CssStyleForm.FlexEnd;
    }
  }

  private calculateWithForValue() {
    setTimeout(() => {
      const separator = $(
        '#' + this.separatorId,
        this.elementRef.nativeElement
      );
      let separatorWidth = 0;
      if (separator && separator.length) {
        separatorWidth = separator.outerWidth();
      }
      if (!this._minLabelWidth) return;
      this.fieldValueStyleWrapper = this.isRow
        ? ''
        : {
            width: `calc(100% - ${this._minLabelWidth + separatorWidth}px)`,
          };
      this.setWithForValue();
      this.ref.detectChanges();
    });
  }

  private setWithForValue() {
    if (!this.widthData || this.widthData == 'auto') return;
    this.fieldValueStyleWrapper = {
      width: `${this.widthData}px)`,
    };
  }

  private calculateLabelWidth() {
    if (this.isRow && this._index != 0) {
      this.fieldStyleWrapper = '';
    } else {
      this.execMinLabelWidth(this.widthLabel || this._minLabelWidth);
    }
    this.ref.detectChanges();
  }
}
