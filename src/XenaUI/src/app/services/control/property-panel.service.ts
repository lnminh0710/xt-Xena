import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../base.service';
import cloneDeep from 'lodash-es/cloneDeep';
import isNil from 'lodash-es/isNil';
import { Uti } from 'app/utilities';
import { FormStyle, CssStyleForm } from 'app/app.constants';

@Injectable()
export class PropertyPanelService extends BaseService {
  public globalProperties: any;

  constructor(injector: Injector) {
    super(injector);
  }

  public getItemRecursive(itemList, value, keyName = 'id') {
    return Uti.getItemRecursive(itemList, value, keyName);
  }

  public getItemRecursiveResultNotNull(itemList, value, keyName = 'id') {
    return Uti.getItemRecursive(itemList, value, keyName) || {};
  }

  public resetDirty(itemList) {
    if (itemList) {
      for (let i = 0; i < itemList.length; i++) {
        itemList[i].dirty = false;

        if (itemList[i].children && itemList[i].children.length) {
          this.resetDirty(itemList[i].children);
        }
      }
    }

    return itemList;
  }

  public isDirty(itemList) {
    if (itemList) {
      for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].dirty === true) {
          return true;
        }
        const isChildrenDirty = this.isDirty(itemList[i].children);
        if (isChildrenDirty) return true;
      }
    }

    return false;
  }

  public updateWidgetTableStyle(properties, tableStyle) {
    const newTableStyle = cloneDeep(tableStyle);
    const propertyOddRowBackground = this.getItemRecursive(
      properties,
      'RowStyleOddBackground'
    );
    const propertyEvenRowBackground = this.getItemRecursive(
      properties,
      'RowStyleEvenBackground'
    );
    const propertyBorderRow = this.getItemRecursive(
      properties,
      'RowStyleBorder'
    );
    if (propertyOddRowBackground) {
      newTableStyle.oddRow = propertyOddRowBackground.value;
    }

    if (propertyEvenRowBackground) {
      newTableStyle.evenRow = propertyEvenRowBackground.value;
    }

    if (propertyBorderRow) {
      newTableStyle.borderRow = propertyBorderRow.value;
    }
    return newTableStyle;
  }

  public updateWidgetFormStyle(properties, formStyle, styleType, ofType) {
    const newFormStyle = cloneDeep(formStyle);
    const propSeparateValue = this.getItemRecursive(
      properties,
      ofType + 'Value'
    );
    if (propSeparateValue) {
      newFormStyle[styleType]['value'] = propSeparateValue.value;
    }

    const propFormHeightStyle = this.getItemRecursive(
      properties,
      ofType + FormStyle.Height
    );
    const propFormHeightAutoHeightStyle = this.getItemRecursive(
      properties,
      ofType + FormStyle.AutoHeight
    );
    const valueHeightAutoHeightStyle =
      propFormHeightAutoHeightStyle && propFormHeightAutoHeightStyle.value;
    newFormStyle[styleType][CssStyleForm.Height] = valueHeightAutoHeightStyle
      ? 'auto'
      : propFormHeightStyle && propFormHeightStyle.value;

    const propFormStyleAlign = this.getItemRecursive(
      properties,
      ofType + FormStyle.JustifyContent
    );
    if (propFormStyleAlign && propFormStyleAlign.value) {
      newFormStyle[styleType][CssStyleForm.JustifyContent] =
        propFormStyleAlign.value;
    }

    const propFormStyleBackgroundColor = this.getItemRecursive(
      properties,
      ofType + FormStyle.BackgroundColor
    );
    if (propFormStyleBackgroundColor) {
      newFormStyle[styleType][CssStyleForm.BackgroundColor] =
        propFormStyleBackgroundColor.value
          ? propFormStyleBackgroundColor.value.toLowerCase()
          : '';
    }

    const propFormStyleColor = this.getItemRecursive(
      properties,
      ofType + FormStyle.Color
    );
    if (propFormStyleColor) {
      newFormStyle[styleType][CssStyleForm.Color] = propFormStyleColor.value
        ? propFormStyleColor.value.toLowerCase()
        : '';
    }

    const propBorderRowStyleColor = this.getItemRecursive(
      properties,
      ofType + FormStyle.Border
    );
    if (propBorderRowStyleColor) {
      newFormStyle[styleType][CssStyleForm.BorderRight] =
        propBorderRowStyleColor.value ? propBorderRowStyleColor.value : '';
    }

    const propOddBackgroundRowStyleColor = this.getItemRecursive(
      properties,
      ofType + FormStyle.OddBackground
    );
    if (propOddBackgroundRowStyleColor) {
      newFormStyle[styleType][CssStyleForm.OddRow] =
        propOddBackgroundRowStyleColor.value
          ? propOddBackgroundRowStyleColor.value
          : '';
    }

    const propEvenBackgroundRowStyleColor = this.getItemRecursive(
      properties,
      ofType + FormStyle.EvenBackground
    );
    if (propEvenBackgroundRowStyleColor) {
      newFormStyle[styleType][CssStyleForm.EvenRow] =
        propEvenBackgroundRowStyleColor.value
          ? propEvenBackgroundRowStyleColor.value
          : '';
    }

    const propFormStyleFontName = this.getItemRecursive(
      properties,
      ofType + FormStyle.FontName
    );
    if (propFormStyleFontName) {
      if (
        !propFormStyleFontName.options ||
        !propFormStyleFontName.options.length
      ) {
        propFormStyleFontName.options = this.defaultFontNameOptions();
      }

      if (propFormStyleFontName.value) {
        newFormStyle[styleType][CssStyleForm.FontFamily] =
          propFormStyleFontName.value;
      }
    }

    const propFormStyleFontSize = this.getItemRecursive(
      properties,
      ofType + FormStyle.FontSize
    );
    if (propFormStyleFontSize) {
      if (
        !propFormStyleFontSize.options ||
        !propFormStyleFontSize.options.length
      ) {
        propFormStyleFontSize.options = this.defaultFontSizeOptions();
      }

      if (propFormStyleFontSize.value) {
        newFormStyle[styleType][CssStyleForm.FontSize] =
          propFormStyleFontSize.value + 'px';
      }
    }

    const propFormStyleBold = this.getItemRecursive(
      properties,
      ofType + FormStyle.Bold
    );
    if (propFormStyleBold) {
      newFormStyle[styleType][CssStyleForm.FontWeight] = propFormStyleBold.value
        ? 'bold'
        : 'normal';
    }

    const propFormStyleItalic = this.getItemRecursive(
      properties,
      ofType + FormStyle.Italic
    );
    if (propFormStyleItalic) {
      newFormStyle[styleType][CssStyleForm.FontStyle] =
        propFormStyleItalic.value ? 'italic' : 'unset';
    }

    const propFormStyleUnderline = this.getItemRecursive(
      properties,
      ofType + FormStyle.Underline
    );
    if (propFormStyleUnderline) {
      newFormStyle[styleType][CssStyleForm.Underline] =
        propFormStyleUnderline.value ? 'underline' : 'unset';
    }

    const propFormStyleWidth = this.getItemRecursive(
      properties,
      ofType + FormStyle.Width
    );
    const propFormStyleAutoWidth = this.getItemRecursive(
      properties,
      ofType + FormStyle.AutoWidth
    );
    const valueLabelStyleAutoWidth =
      propFormStyleAutoWidth && propFormStyleAutoWidth.value;
    newFormStyle[styleType][CssStyleForm.Width] = valueLabelStyleAutoWidth
      ? 'auto'
      : propFormStyleWidth && propFormStyleWidth.value;

    return newFormStyle;
  }

  public updateInlineLabelStyle(properties, inlineLabelStyle) {
    const newInlineLabelStyle = cloneDeep(inlineLabelStyle);

    const propFormStyleLineHeight = this.getItemRecursive(
      properties,
      'LabelStyleLineHeight'
    );
    if (propFormStyleLineHeight) {
      if (
        !propFormStyleLineHeight.options ||
        !propFormStyleLineHeight.options.length
      ) {
        propFormStyleLineHeight.options = this.defaultLineHeightOptions();
      }

      if (propFormStyleLineHeight.value) {
        newInlineLabelStyle['line-height'] = propFormStyleLineHeight.value;
      }
    }

    return newInlineLabelStyle;
  }

  public createDefaultGlobalSettings() {
    return [
      this.createDefaultGlobalWidgetProperties(),
      this.createDefaultGlobalApplicationSettingProperties(),
    ];
  }

  private createDefaultGlobalWidgetProperties() {
    return {
      id: 'WidgetSettings',
      name: 'Widget Settings',
      value: null,
      disabled: false,
      collapsed: false,
      dataType: null,
      options: null,
      dirty: false,
      children: [
        this.createDefaultGlobalWidgetBehaviorProperties(),
        this.createDefaultGlobalWidgetAppearanceProperties(),
      ],
    };
  }

  public createDefaultGlobalWidgetBehaviorProperties() {
    return {
      id: 'Behavior',
      name: 'Behavior',
      value: null,
      disabled: false,
      collapsed: true,
      dataType: null,
      options: null,
      dirty: false,
      children: [
        {
          id: 'EditIn',
          name: 'Edit In',
          value: 'Inline',
          disabled: false,
          collapsed: true,
          dataType: 'Object',
          options: [
            {
              key: 'Popup',
              value: 'Popup',
            },
            {
              key: 'Inline',
              value: 'Inline',
            },
          ],
          dirty: false,
          children: [],
        },
        {
          id: 'AutoSaveLayout',
          name: 'Auto Save Layout',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: 'Boolean',
          options: null,
          children: [],
        },
      ],
    };
  }

  public createDefaultGlobalWidgetAppearanceProperties(): any {
    return {
      id: 'Appearance',
      name: 'Appearance',
      value: null,
      disabled: false,
      collapsed: true,
      dataType: null,
      options: null,
      dirty: false,
      children: [
        {
          id: 'WidgetStyle',
          name: 'Widget Style',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: null,
          options: null,
          children: [
            {
              id: 'Border',
              name: 'Border',
              value: true,
              disabled: false,
              collapsed: true,
              dataType: 'Boolean',
              options: null,
              children: [],
            },
            {
              id: 'BorderColor',
              name: 'Border Color',
              value: '',
              disabled: false,
              collapsed: true,
              dataType: 'Color',
              options: null,
              children: [],
            },
            {
              id: 'BackgroundColor',
              name: 'Background Color',
              value: '#ffffff',
              disabled: false,
              collapsed: true,
              dataType: 'Color',
              options: null,
              children: [],
            },
            this.createDefaultShowScrollBarProperty(),
            this.createDefaultDisplayShadow(),
          ],
        },
      ],
    };
  }

  public createDefaultGlobalApplicationSettingProperties(): any {
    return {
      id: 'ApplicationSettings',
      name: 'Application Settings',
      value: null,
      disabled: false,
      collapsed: false,
      dataType: null,
      options: null,
      dirty: false,
      children: [
        {
          id: 'Background',
          name: 'Background',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: null,
          options: null,
          children: [
            {
              id: 'GradientColor',
              name: 'Gradient Color',
              value: true,
              disabled: false,
              collapsed: true,
              dataType: 'Boolean',
              options: null,
              children: [],
            },
          ],
        },
        {
          id: 'DataFormat',
          name: 'Data Format',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: null,
          options: null,
          children: [
            {
              id: 'DataFormatDateTime',
              name: 'Date Time',
              value: 'MM/dd/yyyy',
              disabled: false,
              collapsed: true,
              dataType: 'DateFormat',
              options: null,
              children: [],
            },
            {
              id: 'DataFormatNumber',
              name: 'Number',
              value: false,
              disabled: false,
              collapsed: true,
              dataType: 'Boolean',
              options: null,
              children: [],
              valueDescription: 'Use 1000 separator (,)',
            },
            {
              id: 'AllowNumberSeparator',
              name: 'Allow Number Separator',
              value: true,
              disabled: false,
              collapsed: true,
              dataType: 'Boolean',
              options: null,
              children: [],
            },
            {
              id: 'DOBFormatByCountry',
              name: 'DOB Format base on country',
              value: true,
              disabled: false,
              collapsed: true,
              dataType: 'Boolean',
              options: null,
              children: [],
            },
          ],
        },
        {
          id: 'UnsavedDialog',
          name: 'Unsaved Dialog',
          value: false,
          disabled: false,
          collapsed: true,
          dataType: 'Boolean',
          options: null,
          tooltip: 'Show unsaved dialog when changing module',
          children: [],
        },
        {
          id: 'ParkedItemNewTime',
          name: 'Parked item new time (hours)',
          value: false,
          disabled: false,
          collapsed: true,
          dataType: 'Number',
          options: null,
          tooltip: 'The time that parked item is recognized as New',
          children: [],
        },
        {
          id: 'SelectFirstIfOnlyOne',
          name: 'Select First If Only One',
          value: true,
          disabled: false,
          collapsed: true,
          dataType: 'Boolean',
          options: null,
          tooltip:
            'Auto select combobox first item if there is only one record',
          children: [],
        },
      ],
    };
  }

  public defaultAlignOptions() {
    return [
      {
        key: 'Left',
        value: 'Left',
      },
      {
        key: 'Center',
        value: 'Center',
      },
      {
        key: 'Right',
        value: 'Right',
      },
    ];
  }

  public defaultFontNameOptions() {
    return [
      {
        key: 'Arial',
        value: 'Arial',
      },
      {
        key: 'Arial Black',
        value: 'Arial Black',
      },
      {
        key: 'Calibri',
        value: 'Calibri',
      },
      {
        key: 'Comic Sans MS',
        value: 'Comic Sans MS',
      },
      {
        key: 'Georgia',
        value: 'Georgia',
      },
      {
        key: 'Helvetica',
        value: 'Helvetica',
      },
      {
        key: 'Lucida Sans Unicode',
        value: 'Lucida Sans Unicode',
      },
      {
        key: 'Portable User Interface',
        value: 'Portable User Interface',
      },
      {
        key: 'Times New Roman',
        value: 'Times New Roman',
      },
      {
        key: 'Trebuchet MS',
        value: 'Trebuchet MS',
      },
      {
        key: 'Verdana',
        value: 'Verdana',
      },
      {
        key: 'Tahoma',
        value: 'Tahoma',
      },
    ];
  }

  public defaultDisplayShadow() {
    return [
      {
        key: 'None',
        value: 'None',
      },
      {
        key: 'Hover',
        value: 'Hover',
      },
      {
        key: 'Always',
        value: 'Always',
      },
    ];
  }

  public defaultFontSizeOptions() {
    return [
      {
        key: '6',
        value: '6',
      },
      {
        key: '7',
        value: '7',
      },
      {
        key: '8',
        value: '8',
      },
      {
        key: '9',
        value: '9',
      },
      {
        key: '10',
        value: '10',
      },
      {
        key: '11',
        value: '11',
      },
      {
        key: '12',
        value: '12',
      },
      {
        key: '13',
        value: '13',
      },
      {
        key: '14',
        value: '14',
      },
      {
        key: '15',
        value: '15',
      },
      {
        key: '16',
        value: '16',
      },
      {
        key: '17',
        value: '17',
      },
      {
        key: '18',
        value: '18',
      },
      {
        key: '19',
        value: '19',
      },
      {
        key: '20',
        value: '20',
      },
    ];
  }

  public defaultLineHeightOptions() {
    return [
      {
        key: '1.1',
        value: '1.1',
      },
      {
        key: '1.2',
        value: '1.2',
      },
      {
        key: '1.3',
        value: '1.3',
      },
      {
        key: '1.4',
        value: '1.4',
      },
      {
        key: '1.5',
        value: '1.5',
      },
      {
        key: '2.0',
        value: '2.0',
      },
      {
        key: '2.5',
        value: '2.5',
      },
      {
        key: '3.0',
        value: '3.0',
      },
      {
        key: '3.5',
        value: '3.5',
      },
      {
        key: '4.0',
        value: '4.0',
      },
    ];
  }

  public defaultFontSizeOptionsForWidgetTitle() {
    return [
      {
        key: '12',
        value: '12',
      },
      {
        key: '13',
        value: '13',
      },
      {
        key: '14',
        value: '14',
      },
      {
        key: '15',
        value: '15',
      },
      {
        key: '16',
        value: '16',
      },
      {
        key: '17',
        value: '17',
      },
      {
        key: '18',
        value: '18',
      },
      {
        key: '19',
        value: '19',
      },
      {
        key: '20',
        value: '20',
      },
      {
        key: '21',
        value: '21',
      },
    ];
  }

  public defaultGlobalWidgetTitleProperties() {
    return {
      id: 'WidgetTitle',
      name: 'WidgetTitle',
      value: null,
      disabled: false,
      collapsed: true,
      dataType: 'String',
      options: null,
      children: [
        {
          id: 'IsDisplay',
          name: 'IsDisplay',
          value: true,
          disabled: false,
          collapsed: true,
          dataType: 'Boolean',
          options: null,
          children: [],
          dirty: false,
        },
        {
          id: 'TitleStyleColor',
          name: 'Color',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: 'Color',
          options: null,
          children: [],
          dirty: false,
        },
        {
          id: 'TitleStyleFontSize',
          name: 'FontSize',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: 'Object',
          options: this.defaultFontSizeOptions(),
          children: [],
          dirty: false,
        },
        {
          id: 'TitleStyleFontName',
          name: 'FontName',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: 'Object',
          options: this.defaultFontNameOptions(),
          children: [],
          dirty: false,
        },
      ],
      dirty: false,
    };
  }

  public defaultGlobalWidgetToolbarProperties() {
    return {
      id: 'WidgetToolbar',
      name: 'WidgetToolbar',
      value: null,
      disabled: false,
      collapsed: true,
      dataType: 'String',
      options: null,
      children: [
        {
          id: 'WidgetToolbarBackgroundColor',
          name: 'Background Color',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: 'Color',
          options: null,
          children: [],
          dirty: false,
        },
        {
          id: 'WidgetToolbarIconColor',
          name: 'Icon Color',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: 'Color',
          options: null,
          children: [],
          dirty: false,
        },
        {
          id: 'WidgetToolbarIconSize',
          name: 'Icon Size',
          value: null,
          disabled: false,
          collapsed: true,
          dataType: 'Object',
          options: this.defaultFontSizeOptionsForIcon(),
          children: [],
          dirty: false,
        },
      ],
      dirty: false,
    };
  }

  public createDefaultWidgetToolbarIconSizeProperty() {
    return {
      id: 'WidgetToolbarIconSize',
      name: 'Icon Size',
      value: null,
      disabled: false,
      collapsed: true,
      dataType: 'Object',
      options: this.defaultFontSizeOptionsForIcon(),
      children: [],
      dirty: false,
    };
  }

  public createDefaultShowScrollBarProperty() {
    return {
      id: 'ShowScrollBar',
      name: 'Keep show scrollbar',
      value: true,
      disabled: false,
      collapsed: true,
      dataType: 'Boolean',
      options: null,
      children: [],
      dirty: false,
    };
  }

  public createDefaultDisplayShadow() {
    return {
      id: 'DisplayShadow',
      name: 'Display Shadow',
      value: null,
      disabled: false,
      collapsed: true,
      dataType: 'Object',
      options: this.defaultDisplayShadow(),
      children: [],
      dirty: false,
    };
  }

  public defaultFontSizeOptionsForIcon() {
    return [
      {
        key: '16',
        value: '16',
      },
      {
        key: '17',
        value: '17',
      },
      {
        key: '18',
        value: '18',
      },
      {
        key: '19',
        value: '19',
      },
      {
        key: '20',
        value: '20',
      },
      {
        key: '21',
        value: '21',
      },
      {
        key: '22',
        value: '22',
      },
      {
        key: '23',
        value: '23',
      },
    ];
  }

  public getValueDropdownFromGlobalProperties(globalProperties: any[]) {
    let propShowDropdownWhenFocus = this.getItemRecursive(
      globalProperties,
      'ShowDropdownWhenFocus'
    );
    if (propShowDropdownWhenFocus) {
      return propShowDropdownWhenFocus.value;
    }
  }

  public getAutoSwitchToDetail(properties: any[]) {
    const propertiesAutoSwitchToDetail = this.getItemRecursive(
      properties,
      'AutoSwitchToDetail'
    );
    return propertiesAutoSwitchToDetail
      ? propertiesAutoSwitchToDetail.value
      : null;
  }

  public getValueDropdownFromProperties(globalProperties: any[]) {
    const propShowDropDownOfField = this.getItemRecursive(
      globalProperties,
      'ShowDropDownOfField'
    );
    if (propShowDropDownOfField) {
      return propShowDropDownOfField.options;
    }
  }

  public getValueBackgroundImageFromProperties(properties: any[]) {
    const propBackgroundImage = this.getItemRecursive(
      properties,
      'WidgetBackgroundStyleImage'
    );
    if (propBackgroundImage) {
      return propBackgroundImage.value;
    }
  }

  public getValueDropdownApplyOnWidgetFromProperties(globalProperties: any[]) {
    const proDropdownApplyOnWidget = this.getItemRecursive(
      globalProperties,
      'ApplyOnWidget'
    );
    if (proDropdownApplyOnWidget) {
      return proDropdownApplyOnWidget.value;
    }
  }

  public buildGlobalDateFormatFromProperties(globalProperties: any[]) {
    const dateFormatProp = this.getItemRecursive(
      globalProperties,
      'DataFormatDateTime'
    );
    if (dateFormatProp) {
      //switch (dateFormatProp.value) {
      //    case 'mm/dd/yyyy':
      //        return 'MM/dd/yyyy';

      //    case 'dd/mm/yyyy':
      //        return 'dd/MM/yyyy';

      //    case 'yyyy/mm/dd':
      //        return 'yyyy/MM/dd';

      //    default:
      //        return 'MM/dd/yyyy';
      //}

      return dateFormatProp.value;
    }

    return 'MM/dd/yyyy';
  }

  public buildGlobalInputDateFormatFromProperties(globalProperties: any[]) {
    const inputDateSeparator = this.getItemRecursive(
      globalProperties,
      'InputDateSeparator'
    );
    const inputDateDateFormat = this.getItemRecursive(
      globalProperties,
      'InputDateDateFormat'
    );
    if (
      inputDateSeparator &&
      inputDateDateFormat &&
      inputDateDateFormat.value
    ) {
      const inputDateSeparatorValue = inputDateSeparator.value || '/';
      switch (inputDateDateFormat.value.toLowerCase()) {
        case 'mmddyyyy':
          return `MM${inputDateSeparatorValue}dd${inputDateSeparatorValue}yyyy`;

        case 'ddmmyyyy':
          return `dd${inputDateSeparatorValue}MM${inputDateSeparatorValue}yyyy`;

        case 'yyyymmdd':
          return `yyyy${inputDateSeparatorValue}MM${inputDateSeparatorValue}dd`;

        default:
          return 'MM/dd/yyyy';
      }
    }
    return 'MM/dd/yyyy';
  }

  public buildGlobalNumberFormatFromProperties(globalProperties: any[]) {
    const numberFormatProp = this.getItemRecursive(
      globalProperties,
      'DataFormatNumber'
    );
    if (numberFormatProp && numberFormatProp.value) {
      return 'N';
    }

    return 'F';
  }

  public mergeProperties(
    properties,
    defaultProperties: any
  ): { version: string; properties: any[] } {
    if (!defaultProperties) {
      return { version: '1.0.0', properties };
    }

    if (!properties) {
      return {
        version: '1.0.0',
        properties: Uti.tryParseJson(defaultProperties).properties,
      };
    }

    if (
      (!properties || Uti.isEmptyObject(properties)) &&
      (!defaultProperties || Uti.isEmptyObject(defaultProperties))
    )
      return null;

    let _properties = null;
    if (isNil(properties.properties)) {
      _properties = this.processMerge(
        typeof defaultProperties === 'string'
          ? JSON.parse(defaultProperties || '[]')
          : defaultProperties,
        properties
      );
    } else {
      _properties = properties.properties;
      if (defaultProperties) {
        const defaultProps =
          typeof defaultProperties === 'string'
            ? JSON.parse(defaultProperties)
            : defaultProperties;
        if (
          !isNil(defaultProps.version) &&
          (isNil(properties.version) ||
            (!isNil(properties.version) &&
              defaultProps.version !== properties.version))
        ) {
          _properties = this.processMerge(defaultProps, properties.properties);
        } else {
          return properties;
        }
      }
    }
    return _properties;
  }

  private processMerge(
    defaultProps,
    props
  ): { version: string; properties: any[] } {
    if (isNil(defaultProps.version)) {
      return props || [];
    }

    let result: { version: string; properties: any[] } = {
      version: '',
      properties: [],
    };
    result.version = defaultProps.version;

    let newProps = cloneDeep(defaultProps.properties);

    result.properties = this.merge(newProps, props);

    return result;
  }

  private merge(newProps, oldProps) {
    if (!newProps || !newProps.length) return;
    for (let i = 0; i < newProps.length; i++) {
      const oldProp = this.getItemRecursive(oldProps, newProps[i].id);
      if (oldProp) {
        if (oldProp.value !== null) {
          newProps[i].value = oldProp.value;
        }
        if (oldProp.options && oldProp.options.length) {
          newProps[i].options = oldProp.options;
        }
      }

      this.merge(newProps[i].children, oldProps);
    }

    return newProps;
  }
}
