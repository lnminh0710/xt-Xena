import * as wjcCore from 'wijmo/wijmo';
import * as wjcSelf from 'wijmo/wijmo.input';
export declare class DropDown extends wjcCore.Control {
    _tbx: HTMLInputElement;
    _elRef: HTMLElement;
    _btn: HTMLElement;
    _dropDown: HTMLElement;
    _showBtn: boolean;
    _autoExpand: boolean;
    _animate: boolean;
    _cssClass: string;
    _oldText: string;
    _altDown: boolean;
    static controlTemplate: string;
    constructor(element: any, options?: any);
    text: string;
    readonly inputElement: HTMLInputElement;
    isReadOnly: boolean;
    isRequired: boolean;
    placeholder: string;
    isDroppedDown: boolean;
    readonly dropDown: HTMLElement;
    dropDownCssClass: string;
    showDropDownButton: boolean;
    autoExpandSelection: boolean;
    isAnimated: boolean;
    selectAll(): void;
    readonly textChanged: wjcCore.Event;
    onTextChanged(e?: wjcCore.EventArgs): void;
    readonly isDroppedDownChanging: wjcCore.Event;
    onIsDroppedDownChanging(e: wjcCore.CancelEventArgs): boolean;
    readonly isDroppedDownChanged: wjcCore.Event;
    onIsDroppedDownChanged(e?: wjcCore.EventArgs): void;
    onGotFocus(e?: wjcCore.EventArgs): void;
    onLostFocus(e?: wjcCore.EventArgs): void;
    containsFocus(): boolean;
    dispose(): void;
    refresh(fullUpdate?: boolean): void;
    _handleResize(): void;
    private _expandSelection();
    private _getCharType(text, pos);
    protected _keydown(e: KeyboardEvent): void;
    protected _btnclick(e: MouseEvent): void;
    protected _setText(text: string, fullMatch: boolean): void;
    protected _updateBtn(): void;
    protected _createDropDown(): void;
    protected _commitText(): void;
    protected _updateDropDown(): void;
}
export declare enum DateSelectionMode {
    None = 0,
    Day = 1,
    Month = 2,
}
export declare class Calendar extends wjcCore.Control {
    private _tbHdr;
    private _tbMth;
    private _tbYr;
    private _btnMth;
    private _spMth;
    private _btnPrv;
    private _btnTdy;
    private _btnNxt;
    private _value;
    private _currMonth;
    private _firstDay;
    private _min;
    private _max;
    private _fdw;
    private _itemFormatter;
    private _itemValidator;
    private _readOnly;
    private _selMode;
    private _fmtYrMo;
    private _fmtYr;
    private _fmtDayHdr;
    private _fmtDay;
    private _fmtMonths;
    static controlTemplate: string;
    constructor(element: any, options?: any);
    value: Date;
    min: Date;
    max: Date;
    selectionMode: DateSelectionMode;
    isReadOnly: boolean;
    firstDayOfWeek: number;
    displayMonth: Date;
    formatYearMonth: string;
    formatDayHeaders: string;
    formatDays: string;
    formatYear: string;
    formatMonths: string;
    showHeader: boolean;
    monthView: boolean;
    itemFormatter: Function;
    itemValidator: Function;
    readonly valueChanged: wjcCore.Event;
    onValueChanged(e?: wjcCore.EventArgs): void;
    readonly displayMonthChanged: wjcCore.Event;
    onDisplayMonthChanged(e?: wjcCore.EventArgs): void;
    readonly formatItem: wjcCore.Event;
    onFormatItem(e: FormatItemEventArgs): void;
    refresh(fullUpdate?: boolean): void;
    private _canChangeValue();
    private _valid(date);
    private _inValidRange(date);
    private _monthInValidRange(month);
    private _yearInValidRange(year);
    private _sameMonth(date, month);
    _clamp(value: Date): Date;
    private _createChildren();
    private _createElement(tag, parent?, className?);
    private _click(e);
    private _getCellIndex(tbl, cell);
    private _keydown(e);
    private _getMonth(date);
    private _monthMode();
    private _navigate(skip);
    _setDisplayMonth(value: Date): void;
}
export declare class ColorPicker extends wjcCore.Control {
    _hsb: number[];
    _alpha: number;
    _value: string;
    _palette: string[];
    _eSB: HTMLElement;
    _eHue: HTMLElement;
    _eAlpha: HTMLElement;
    _cSB: HTMLElement;
    _cHue: HTMLElement;
    _cAlpha: HTMLElement;
    _ePal: HTMLElement;
    _ePreview: HTMLElement;
    _eText: HTMLElement;
    _htDown: Element;
    static controlTemplate: string;
    static _tplCursor: string;
    constructor(element: any, options?: any);
    showAlphaChannel: boolean;
    showColorString: boolean;
    value: string;
    palette: string[];
    readonly valueChanged: wjcCore.Event;
    onValueChanged(e?: wjcCore.EventArgs): void;
    protected _mouseDown(e: MouseEvent): void;
    protected _mouseMove(e: MouseEvent): void;
    protected _mouseUp(e: MouseEvent): void;
    private _updateColor();
    private _updatePalette();
    private _makePalEntry(color, margin);
    private _updatePanels();
    private _getTargetPanel(e);
}
export declare class ListBox extends wjcCore.Control {
    private static _AUTOSEARCH_DELAY;
    _items: any;
    _cv: wjcCore.ICollectionView;
    _itemFormatter: Function;
    _pathDisplay: wjcCore.Binding;
    _pathValue: wjcCore.Binding;
    _pathChecked: wjcCore.Binding;
    _html: boolean;
    _checkedItems: any[];
    _itemRole: string;
    _checking: boolean;
    _search: string;
    _toSearch: any;
    _bndDisplay: wjcCore.Binding;
    _tabIndex: number;
    constructor(element: any, options?: any);
    refresh(): void;
    itemsSource: any;
    readonly collectionView: wjcCore.ICollectionView;
    isContentHtml: boolean;
    itemFormatter: Function;
    displayMemberPath: string;
    selectedValuePath: string;
    checkedMemberPath: string;
    itemRole: string;
    getDisplayValue(index: number): string;
    getDisplayText(index: number): string;
    isItemEnabled(index: number): boolean;
    selectedIndex: number;
    selectedItem: any;
    selectedValue: any;
    maxHeight: number;
    showSelection(): void;
    getItemChecked(index: number): boolean;
    setItemChecked(index: number, checked: boolean): void;
    toggleItemChecked(index: number): void;
    checkedItems: any[];
    readonly selectedIndexChanged: wjcCore.Event;
    onSelectedIndexChanged(e?: wjcCore.EventArgs): void;
    readonly itemsChanged: wjcCore.Event;
    onItemsChanged(e?: wjcCore.EventArgs): void;
    readonly loadingItems: wjcCore.Event;
    onLoadingItems(e?: wjcCore.EventArgs): void;
    readonly loadedItems: wjcCore.Event;
    onLoadedItems(e?: wjcCore.EventArgs): void;
    readonly itemChecked: wjcCore.Event;
    onItemChecked(e?: wjcCore.EventArgs): void;
    readonly checkedItemsChanged: wjcCore.Event;
    onCheckedItemsChanged(e?: wjcCore.EventArgs): void;
    readonly formatItem: wjcCore.Event;
    onFormatItem(e: FormatItemEventArgs): void;
    private _setItemChecked(index, checked, notify?);
    private _cvCollectionChanged(sender, e);
    private _cvCurrentChanged(sender, e);
    private _populateList();
    private _click(e);
    private _keydown(e);
    private _keypress(e);
    _selectNext(): boolean;
    _selectPrev(): boolean;
    _selectFirst(): boolean;
    _selectLast(): boolean;
    _selectNextPage(): boolean;
    _selectPrevPage(): boolean;
    private _findNext();
    private _getCheckbox(index);
    _initFromSelect(hostElement: HTMLElement): void;
}
export declare class FormatItemEventArgs extends wjcCore.EventArgs {
    _index: number;
    _data: any;
    _item: HTMLElement;
    constructor(index: number, data: any, item: HTMLElement);
    readonly index: number;
    readonly data: any;
    readonly item: HTMLElement;
}
export declare class ComboBox extends DropDown {
    _lbx: ListBox;
    _editable: boolean;
    _delKey: number;
    _composing: boolean;
    _settingText: boolean;
    _pathHdr: wjcCore.Binding;
    _cvt: HTMLElement;
    _bsCollapse: boolean;
    constructor(element: any, options?: any);
    itemsSource: any;
    readonly collectionView: wjcCore.ICollectionView;
    displayMemberPath: string;
    headerPath: string;
    selectedValuePath: string;
    isContentHtml: boolean;
    itemFormatter: Function;
    readonly formatItem: wjcCore.Event;
    selectedIndex: number;
    selectedItem: any;
    selectedValue: any;
    isEditable: boolean;
    maxDropDownHeight: number;
    maxDropDownWidth: number;
    getDisplayText(index?: number): string;
    indexOf(text: string, fullMatch: boolean): number;
    readonly listBox: ListBox;
    readonly itemsSourceChanged: wjcCore.Event;
    onItemsSourceChanged(e?: wjcCore.EventArgs): void;
    readonly selectedIndexChanged: wjcCore.Event;
    onSelectedIndexChanged(e?: wjcCore.EventArgs): void;
    refresh(fullUpdate?: boolean): void;
    onLostFocus(e?: wjcCore.EventArgs): void;
    onIsDroppedDownChanging(e: wjcCore.CancelEventArgs): boolean;
    onIsDroppedDownChanged(e?: wjcCore.EventArgs): void;
    protected _updateBtn(): void;
    protected _btnclick(e: MouseEvent): void;
    protected _createDropDown(): void;
    protected _dropDownClick(e: MouseEvent): void;
    protected _setText(text: string, fullMatch: boolean): void;
    protected _findNext(text: string, step: number): number;
    protected _keydown(e: KeyboardEvent): void;
    protected _updateInputSelection(start: number): void;
    private _getSelStart();
    private _getSelEnd();
    private _setSelRange(start, end);
}
export declare class AutoComplete extends ComboBox {
    private _cssMatch;
    private _itemsSourceFn;
    private _itemsSourceFnCallBackBnd;
    private _srchProp;
    private _minLength;
    private _maxItems;
    private _itemCount;
    private _delay;
    private _toSearch;
    private _query;
    private _rxMatch;
    private _rxHighlight;
    private _inCallback;
    private _srchProps;
    constructor(element: any, options?: any);
    minLength: number;
    maxItems: number;
    delay: number;
    searchMemberPath: string;
    itemsSourceFunction: Function;
    cssMatch: string;
    _keydown(e: KeyboardEvent): void;
    _setText(text: string): void;
    _itemSourceFunctionCallback(result: any): void;
    onIsDroppedDownChanged(e?: wjcCore.EventArgs): void;
    protected _updateItems(): void;
    protected _filter(item: any): boolean;
    protected _getItemText(item: any, header: boolean): string;
    protected _formatListItem(sender: any, e: FormatItemEventArgs): void;
}
export declare class Menu extends ComboBox {
    _hdr: HTMLElement;
    _closing: boolean;
    _command: any;
    _cmdPath: string;
    _cmdParamPath: string;
    _isButton: boolean;
    _defaultItem: any;
    _owner: HTMLElement;
    constructor(element: any, options?: any);
    header: string;
    command: any;
    commandPath: string;
    commandParameterPath: string;
    isButton: boolean;
    owner: HTMLElement;
    show(position?: any): void;
    hide(): void;
    readonly itemClicked: wjcCore.Event;
    onItemClicked(e?: wjcCore.EventArgs): void;
    refresh(fullUpdate?: boolean): void;
    onIsDroppedDownChanged(e?: wjcCore.EventArgs): void;
    protected _keydown(e: KeyboardEvent): void;
    protected _dropDownClick(e: MouseEvent): void;
    private _raiseCommand(e?);
    private _getCommand(item);
    private _executeCommand(cmd, parm);
    private _canExecuteCommand(cmd, parm);
    private _enableDisableItems();
}
export declare class MultiSelect extends ComboBox {
    private _maxHdrItems;
    private _readOnly;
    private _selectAll;
    private _selectAllCheckbox;
    private _selectAllSpan;
    private _selectAllLabel;
    private _hdrFmt;
    private _hdrFormatter;
    static _DEF_CHECKED_PATH: string;
    constructor(element: any, options?: any);
    showSelectAllCheckbox: boolean;
    selectAllLabel: string;
    checkedMemberPath: string;
    maxHeaderItems: number;
    headerFormat: string;
    headerFormatter: Function;
    checkedItems: any[];
    readonly checkedItemsChanged: wjcCore.Event;
    onCheckedItemsChanged(e?: wjcCore.EventArgs): void;
    protected _createDropDown(): void;
    isReadOnly: boolean;
    refresh(fullUpdate?: boolean): void;
    onIsDroppedDownChanged(e?: wjcCore.EventArgs): void;
    protected _setText(text: string, fullMatch: boolean): void;
    protected _keydown(e: KeyboardEvent): void;
    private _updateHeader();
}
export declare class MultiAutoComplete extends AutoComplete {
    private _wjTpl;
    private _wjInput;
    private _helperInput;
    private _selItems;
    private _maxtems;
    private _lastInputValue;
    private _selPath;
    private _notAddItm;
    static _clsActive: string;
    constructor(element: any, options?: any);
    showDropDownButton: boolean;
    maxSelectedItems: number;
    selectedMemberPath: string;
    selectedItems: any[];
    readonly selectedItemsChanged: wjcCore.Event;
    onSelectedItemsChanged(e?: wjcCore.EventArgs): void;
    onIsDroppedDownChanged(e?: wjcCore.EventArgs): void;
    refresh(fullUpdate?: boolean): void;
    _keydown(e: KeyboardEvent): void;
    protected _updateState(): void;
    private _keyup(e);
    private _addHelperInput();
    private _refreshHeader();
    private _insertToken(item);
    private _updateMaxItems();
    private _updateFocus();
    private _addItem(clearSelected);
    private _delItem(isDelKey);
    private _updateSelItems(itm, isAdd);
    private _createItem(tokenTxt);
    private _itemOn(isPrev);
    private _itemOff();
    private _initSeltems();
    private _getSelItem(index);
    private _setSelItem(item, selected);
    private _clearSelIndex();
    private _hasSelectedMemeberPath();
    private _disableInput(disabled);
    private _adjustInputWidth();
    private _getItemIndex(token);
}
export declare enum PopupTrigger {
    None = 0,
    Click = 1,
    Blur = 2,
    ClickOrBlur = 3,
}
export declare class Popup extends wjcCore.Control {
    _owner: HTMLElement;
    _modal: boolean;
    _showTrigger: wjcSelf.PopupTrigger;
    _hideTrigger: wjcSelf.PopupTrigger;
    _hideAnim: any;
    _fadeIn: boolean;
    _fadeOut: boolean;
    _removeOnHide: boolean;
    _draggable: boolean;
    _dragged: boolean;
    _click: any;
    _mousedown: any;
    _bkdrop: HTMLDivElement;
    _result: any;
    _resultEnter: any;
    _callback: Function;
    _refreshing: boolean;
    _visible: boolean;
    _wasVisible: boolean;
    _composing: boolean;
    constructor(element: any, options?: any);
    owner: HTMLElement;
    content: HTMLElement;
    showTrigger: PopupTrigger;
    hideTrigger: PopupTrigger;
    fadeIn: boolean;
    fadeOut: boolean;
    removeOnHide: boolean;
    modal: boolean;
    isDraggable: boolean;
    dialogResult: any;
    dialogResultEnter: any;
    readonly isVisible: boolean;
    show(modal?: boolean, handleResult?: Function): void;
    hide(dialogResult?: any): void;
    readonly showing: wjcCore.Event;
    onShowing(e: wjcCore.CancelEventArgs): boolean;
    readonly shown: wjcCore.Event;
    onShown(e?: wjcCore.EventArgs): void;
    readonly hiding: wjcCore.Event;
    onHiding(e: wjcCore.CancelEventArgs): boolean;
    readonly hidden: wjcCore.Event;
    onHidden(e?: wjcCore.EventArgs): void;
    dispose(): void;
    onLostFocus(e?: wjcCore.EventArgs): void;
    refresh(fullUpdate?: boolean): void;
    _makeDraggable(draggable: boolean): void;
    protected _handleResize(): void;
    protected _handleClick(e: any): void;
    protected _handleMouseDown(e: any): void;
    private _showBackdrop();
    private _validateAndHide(result);
}
export declare class InputDate extends DropDown {
    _calendar: Calendar;
    _value: Date;
    _format: string;
    _calChanged: boolean;
    _msk: wjcCore._MaskProvider;
    constructor(element: any, options?: any);
    value: Date;
    text: string;
    selectionMode: DateSelectionMode;
    min: Date;
    max: Date;
    format: string;
    mask: string;
    readonly calendar: Calendar;
    readonly inputElement: HTMLInputElement;
    inputType: string;
    itemValidator: Function;
    itemFormatter: Function;
    readonly valueChanged: wjcCore.Event;
    onValueChanged(e?: wjcCore.EventArgs): void;
    refresh(): void;
    onIsDroppedDownChanged(e?: wjcCore.EventArgs): void;
    protected _createDropDown(): void;
    protected _updateDropDown(): void;
    protected _keydown(e: KeyboardEvent): void;
    private _canChangeValue();
    protected _clamp(value: Date): Date;
    protected _commitText(): void;
    private _isValidDate(value);
}
export declare class InputTime extends ComboBox {
    _value: Date;
    _min: Date;
    _max: Date;
    _step: number;
    _format: string;
    _msk: wjcCore._MaskProvider;
    _hasCustomItems: boolean;
    constructor(element: any, options?: any);
    readonly inputElement: HTMLInputElement;
    inputType: string;
    value: Date;
    text: string;
    min: Date;
    max: Date;
    step: number;
    format: string;
    mask: string;
    readonly valueChanged: wjcCore.Event;
    onValueChanged(e?: wjcCore.EventArgs): void;
    onItemsSourceChanged(e?: wjcCore.EventArgs): void;
    protected _updateInputSelection(start: number): void;
    refresh(): void;
    onSelectedIndexChanged(e?: wjcCore.EventArgs): void;
    protected _updateItems(): void;
    private _getTime(value);
    protected _keydown(e: KeyboardEvent): void;
    protected _commitText(): void;
}
export declare class InputDateTime extends InputDate {
    _btnTm: HTMLElement;
    _inputTime: InputTime;
    static controlTemplate: string;
    constructor(element: any, options?: any);
    timeMin: Date;
    timeMax: Date;
    timeFormat: string;
    timeStep: number;
    readonly inputTime: InputTime;
    dispose(): void;
    refresh(): void;
    protected _updateBtn(): void;
    protected _clamp(value: Date): Date;
    protected _commitText(): void;
    protected _setDropdown(e: HTMLElement): void;
    protected _updateDropDown(): void;
}
export declare class InputNumber extends wjcCore.Control {
    _tbx: HTMLInputElement;
    _btnUp: HTMLElement;
    _btnDn: HTMLElement;
    _value: number;
    _min: number;
    _max: number;
    _format: string;
    _step: number;
    _showBtn: boolean;
    _readOnly: boolean;
    _oldText: string;
    _composing: boolean;
    _chrDec: string;
    _chrCur: string;
    _fmtSpc: string;
    _fmtPrc: number;
    _rxSym: RegExp;
    _rxNeg: RegExp;
    _delKey: boolean;
    _rptUp: wjcCore._ClickRepeater;
    _rptDn: wjcCore._ClickRepeater;
    static controlTemplate: string;
    constructor(element: any, options?: any);
    readonly inputElement: HTMLInputElement;
    inputType: string;
    value: number;
    isRequired: boolean;
    isReadOnly: boolean;
    min: number;
    max: number;
    step: number;
    format: string;
    text: string;
    placeholder: string;
    showSpinner: boolean;
    repeatButtons: boolean;
    selectAll(): void;
    readonly textChanged: wjcCore.Event;
    onTextChanged(e?: wjcCore.EventArgs): void;
    readonly valueChanged: wjcCore.Event;
    onValueChanged(e?: wjcCore.EventArgs): void;
    dispose(): void;
    onGotFocus(e: wjcCore.EventArgs): void;
    onLostFocus(e?: wjcCore.EventArgs): void;
    refresh(fullUpdate?: boolean): void;
    private _updateSymbols();
    private _clamp(value);
    private _isNumeric(chr, digitsOnly);
    private _getInputRange(digitsOnly);
    private _flipSign();
    private _getSelStartDigits();
    private _setSelStartDigits(start);
    private _increment(step);
    protected _updateBtn(): void;
    protected _setText(text: string): void;
    protected _keypress(e: KeyboardEvent): void;
    protected _keydown(e: KeyboardEvent): void;
    protected _input(e: any): void;
    protected _clickSpinner(e: MouseEvent): void;
    protected _updateAria(): void;
}
export declare class InputMask extends wjcCore.Control {
    _tbx: HTMLInputElement;
    _oldValue: string;
    _msk: wjcCore._MaskProvider;
    static controlTemplate: string;
    constructor(element: any, options?: any);
    readonly inputElement: HTMLInputElement;
    value: string;
    rawValue: string;
    mask: string;
    promptChar: string;
    placeholder: string;
    readonly maskFull: boolean;
    isRequired: boolean;
    selectAll(): void;
    readonly valueChanged: wjcCore.Event;
    onValueChanged(e?: wjcCore.EventArgs): void;
    dispose(): void;
    refresh(fullUpdate?: boolean): void;
    onGotFocus(e: any): void;
}
export declare class InputColor extends DropDown {
    _ePreview: HTMLElement;
    _colorPicker: ColorPicker;
    _value: string;
    constructor(element: any, options?: any);
    value: string;
    text: string;
    showAlphaChannel: boolean;
    palette: string[];
    readonly colorPicker: ColorPicker;
    readonly valueChanged: wjcCore.Event;
    onValueChanged(e?: wjcCore.EventArgs): void;
    protected _createDropDown(): void;
    protected _keydown(e: KeyboardEvent): void;
    protected _commitText(): void;
}
