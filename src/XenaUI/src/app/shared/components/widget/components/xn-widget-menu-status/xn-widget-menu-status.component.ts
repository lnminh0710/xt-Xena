import {
    ViewChild, Component, Output, EventEmitter,
    Input, OnInit, OnDestroy, ElementRef, AfterViewInit,
    ComponentFactoryResolver, ViewContainerRef, ComponentRef,
    OnChanges, ChangeDetectorRef,
    SimpleChanges,
    ViewChildren,
    QueryList,
    forwardRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import {
    PropertyPanelActions
} from 'app/state-management/store/actions';
import {
    FilterModeEnum, SavingWidgetType, WidgetFormTypeEnum, EditWidgetTypeEnum,
    OrderDataEntryWidgetLayoutModeEnum,
    GlobalSettingConstant, ControlType, RepWidgetAppIdEnum, ComboBoxTypeConstant, Configuration, FilterOptionFormatDate
} from 'app/app.constants';
import {
    WidgetDetail, ColumnLayoutSetting, WidgetFormType,
    FilterMode, FieldFilter, GlobalSettingModel,
    FilterData, WidgetPropertiesStateModel, WidgetPropertyModel, Module,
    WidgetType, RowSetting, ApiResultResponse, ReloadMode, OrderDataEntryProperties, WidgetMenuStatusModel, WidgetMenuStatusPropertyModel, OtherSetting
} from 'app/models';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { WidgetUtils } from '../../utils';
import * as uti from 'app/utilities';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import cloneDeep from 'lodash-es/cloneDeep';
import {
    PropertyPanelService, GlobalSettingService, AppErrorHandler,
    DomHandler, CommonService, DatatableService, MenuStatusService
} from 'app/services';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import { FilterMenuComponent } from 'app/shared/components/widget/components/filter-menu';
import { BaseComponent } from 'app/pages/private/base';
import { DialogAddWidgetTemplateComponent } from '../dialog-add-widget-template';
import { Uti } from 'app/utilities';
import * as Slider from 'bootstrap-slider';
import { DialogUserRoleComponent } from '../dialog-user-role';
import { ChartTypeNgx } from '../widget-chart';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';
import { NoteActionEnum, NoteFormButtonStatus, NoteFormDataAction } from 'app/models/note.model';
import { DialogAddCustomerDoubletComponent } from '../..';

export function getDropdownConfig(): BsDropdownConfig {
    return Object.assign(new BsDropdownConfig(), { autoClose: false });
}

@Component({
    selector: 'xn-widget-menu-status',
    styleUrls: ['./xn-widget-menu-status.component.scss'],
    templateUrl: './xn-widget-menu-status.component.html',
    providers: [{ provide: BsDropdownConfig, useFactory: getDropdownConfig }]

})
export class XnWidgetMenuStatusComponent extends BaseComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    public NOTE_ACTION_ENUM = NoteActionEnum;
    public EDIT_WIDGET_TYPE_ENUM = EditWidgetTypeEnum;
    public noteFormButtonStatus: NoteFormButtonStatus = new NoteFormButtonStatus(true, false);
    public noteFormDataAction: NoteActionEnum = this.NOTE_ACTION_ENUM.VIEW_MODE;

    public data: WidgetDetail;
    public randomNumb: string = uti.Uti.guid();
    public repWidgetAppIdEnum = RepWidgetAppIdEnum;
    public showAddColumnLayout: boolean = false;
    public filterModes: FilterMode[] = [];
    public subFilterModes: FilterMode[] = [];
    public fieldFilters: FieldFilter[] = [];
    public originalFieldFilters: FieldFilter[] = [];
    public _isShowedResetButton = false;
    public _iconColor = '';
    public _cachedIconColor = '';
    public isCellMoveForward = false;
    private iconEditColor = '#fba026';
    private _copiedFieldFilter: FieldFilter[];
    public allFields: FieldFilter[] = null;
    public selectedFilter: FilterModeEnum = FilterModeEnum.ShowAll;
    public selectedSubFilter: FilterModeEnum = FilterModeEnum.ShowAll;
    public position: any = null;
    public dropdownStatus: { isHidden: boolean } = { isHidden: false };
    public dropdownTableStatus: { isHidden: boolean } = { isHidden: false };
    public isShowEditDropdown = false;
    public isOpeningEditDropdown = false;
    public isShowedEditFormButton: boolean;
    public isShowedEditTableButton: boolean;
    public isShowedEditButtonsForCountry: boolean;
    public isShowedEditButtonsForTreeView: boolean;
    public isShowedEditButtonsForNoteForm: boolean;
    public isShowedUploadFiles: boolean;
    public isShowedDeleteFiles: boolean;
    public isShowedSaveFileExplorer: boolean;
    public isShowedSavePaymentType: boolean;
    public isShowedSaveSAVTemmplate: boolean;
    public isShowedExpandForTreeView: boolean;
    public isShowedAddNewRowTableButton: boolean;
    public isShowedDeleteRowTableButton: boolean;
    public isShowToolButtonsWihoutClick: boolean = false;
    public showFirstCombinationMenu = false;
    public showSecondCombinationMenu = false;
    public isDisableAddRowTableButton = false;
    public isDisableDeleteRowTableButton = true;
    public isDisableSaveTableButton = false;

    private currentToggleElement: any;
    private _isShowedFilterModes = true;
    public widgetFormTypes: WidgetFormType[] = []
    public columnLayoutsetting: ColumnLayoutSetting = null;
    public gridLayoutSettings: any;
    public rowSetting: RowSetting = null;
    private selectedWidgetFormType: WidgetFormTypeEnum = WidgetFormTypeEnum.List;
    private widgetProperties: WidgetPropertyModel[] = [];
    private isFireEventUpdateOnInit = false;
    private hasSubMenu: any = { has: true };
    private globalWidgetProperties: WidgetPropertyModel[] = [];

    public isInitDisplayFields = false;
    private isInitImportantDisplayFields = false;
    private isUpdateOnInitFieldsFilter = false;
    public orderDataEntryWidgetLayoutMode: OrderDataEntryWidgetLayoutModeEnum;
    public orderDataEntryProperties: OrderDataEntryProperties;
    private editingWidgetType = null;
    public showToolButtons = false;
    private toolbarFilterValue = ''
    public showFilterTable = true;
    public isForAllCountryCheckbox: boolean;
    public isForAllCountryButton: boolean;
    public allCountryCheckboxModel: any = {
        forAllCountryCheckbox: false
    };
    private zoomSlider1: any = null;
    private zoomSlider2: any = null;

    public settingChanged: boolean;
    public deletedRulesCount = 0;
    public selectedTemplate: any;
    public isEditTemplateMode = false;
    public widgetTemplates: any[] = [];
    public showDialogAddWidgetTemplate = false;
    public templateComboFocused = false;
    private ignoreOnChangedEmitter = false;
    private dialogAddWidgetTemplate: DialogAddWidgetTemplateComponent;

    public showDialogAddCustomerDoublet: boolean;
    private dialogAddCustomerDoublet: DialogAddCustomerDoubletComponent;

    @ViewChild(DialogAddWidgetTemplateComponent) set dialogAddWidgetTemplateComponentInstance(dialogAddWidgetTemplateComponentInstance: DialogAddWidgetTemplateComponent) {
        this.dialogAddWidgetTemplate = dialogAddWidgetTemplateComponentInstance;
    }

    @ViewChild(forwardRef(() => DialogAddCustomerDoubletComponent)) set dialogAddCustomerDoubletComponentInstance(dialogAddCustomerDoubletComponentInstance: DialogAddCustomerDoubletComponent) {
      this.dialogAddCustomerDoublet = dialogAddCustomerDoubletComponentInstance;
    }

    private templateCombo: AngularMultiSelect;
    @ViewChild('templateCombo') set templateComboInstance(templateComboInstance: AngularMultiSelect) {
        this.templateCombo = templateComboInstance;
    }

    @Input() widgetReloadMode: ReloadMode = ReloadMode.ListenKey;

    @Input() set dataInput(_data) {
        if (!_data) return;

        this.originalFieldFilters = _data.fieldFilters;

        this.data = _data.widgetDetail;
        const idRepWidgetType = this.data.idRepWidgetType;
        this.isShowWidgetSetting = this.menuStatusService.isSupportWidgetSetting(idRepWidgetType);

        this.handleDisplayEditButtons();
        this.settings_buildMenuStatusSettings();

        this.isForAllCountryCheckbox = _data.isForAllCountryCheckbox;
        this.isForAllCountryButton = _data.isForAllCountryButton;
        this.selectedFilter = _data.selectedFilter;
        this.selectedSubFilter = _data.selectedSubFilter;
        this.initFieldArray(_data);
        this._copiedFieldFilter = cloneDeep(this.fieldFilters);

        if (_data.columnLayoutsetting && this.columnLayoutsetting != _data.columnLayoutsetting)
            this.columnLayoutsetting = cloneDeep(_data.columnLayoutsetting);

        if (!this.columnLayoutsetting) {
            this.columnLayoutsetting = cloneDeep(this.initColumnLayoutSetting());
        }

        this.gridLayoutSettings = _data.gridLayoutSettings;

        if (_data.rowSetting && this.rowSetting != _data.rowSetting)
            this.rowSetting = cloneDeep(_data.rowSetting);

        if (!this.rowSetting) {
            this.rowSetting = cloneDeep(this.initRowSetting());
        }

        if (!isNil(_data.selectedWidgetFormType))
            this.selectedWidgetFormType = _data.selectedWidgetFormType;

        const hasFormType = idRepWidgetType == WidgetType.FieldSet ||
            idRepWidgetType == WidgetType.Combination ||
            idRepWidgetType == WidgetType.CombinationCreditCard ||
            idRepWidgetType == WidgetType.FieldSetReadonly;
        if (hasFormType &&
            (!this.widgetFormTypes || !this.widgetFormTypes.length)) {
            this.widgetFormTypes = this.initWidgetFormType();
        }

        if (_data.widgetProperties && _data.widgetProperties != this.widgetProperties) {
            this.widgetProperties = _data.widgetProperties;
        }
        this.initBehaviorDataForWidgetProperties();

        this.filterModes.forEach(filterMode => {
            filterMode.selected = false;
            if (filterMode.mode == this.selectedFilter) {
                filterMode.selected = true;
            }
        });
        this.subFilterModes.forEach(item => {
            item.selected = false;
            if (item.mode == this.selectedSubFilter) {
                item.selected = true;
            }
        });

        let isChangeFormType = false;
        this.widgetFormTypes.forEach(setting => {
            if (setting.widgetFormType === this.selectedWidgetFormType) {
                isChangeFormType = !setting.selected;
                setting.selected = true;
            } else
                setting.selected = false;
        });
        if (isChangeFormType)
            this.widgetFormTypes = cloneDeep(this.widgetFormTypes);

        setTimeout(() => {
            this.initOwnerForMenuWidgetStatus();
        }, 500);

        this.hasSubMenu = cloneDeep(this.hasSubMenu);

        if (_data.orderDataEntryWidgetLayoutMode)
            this.orderDataEntryWidgetLayoutMode = _data.orderDataEntryWidgetLayoutMode;

        if (_data.orderDataEntryProperties)
            this.orderDataEntryProperties = _data.orderDataEntryProperties;

        if (this.widgetReloadMode === ReloadMode.ListenKey) {
            this.toolbarFilterValue = '';
        }
    }

    @Input() otherSetting: OtherSetting = new OtherSetting();
    @Input() displayReadonlyGridAsForm: boolean;
    @Input() listenKeyRequestItem: any;
    @Input() showInDialog = false;
    @Input() accessRight: any = {};
    @Input() allowEdit: boolean;
    @Input() set isShowedResetButton(data: any) {
        this._isShowedResetButton = data;
        if (this._isShowedResetButton) {
            this._iconColor = this.iconEditColor;
        } else if (this._iconColor === this.iconEditColor) {
            this._iconColor = this._cachedIconColor;
        }
    };

    @Input() allowTableEditRow: boolean;
    @Input() allowTableAddNewRow: boolean;
    @Input() allowTableDeleteRow: boolean;
    @Input() allowColTranslation: boolean;
    @Input() isShowProperties = true;
    @Input() isShowWidgetSetting = true;
    @Input() isShowOrderDataEntryPaymentSetting = false;
    @Input() isShowODEGridProperties = false;
    @Input() isShowToolPanelSetting = false;
    @Input() allowGridTranslation = false;
    @Input()
    set isShowedFilterModes(_isShowed: boolean) {
        this._isShowedFilterModes = _isShowed;
        if (!_isShowed) {
            this.filterModes = [];
            this.subFilterModes = [];
        }
    }
    @Input() set iconColor(data: any) {
        this._cachedIconColor = data;
        if (this._isShowedResetButton) {
            this._iconColor = this.iconEditColor;
            return;
        }
        this._iconColor = data;
    }

    private _isSwitchedFromGridToForm: boolean = false;
    @Input() set isSwitchedFromGridToForm(isSwitched: boolean) {
        if (!isNil(isSwitched)) {
            this._isSwitchedFromGridToForm = isSwitched;
            if (isSwitched) {
                if (!this.widgetFormTypes || !this.widgetFormTypes.length) {
                    this.widgetFormTypes = this.initWidgetFormType();
                }
            } else {
                this.widgetFormTypes = [];
            }

            this.settings_buildMenuStatusSettingsWhenSwitchedFromGridToForm();
        }
    }

    get isSwitchedFromGridToForm() {
        return this._isSwitchedFromGridToForm;
    }

    public sendLetterButtonSetting: { sendButton: any, confirmButton: any } = { sendButton: { status: 0 }, confirmButton: { status: 0 } };
    @Input() set sendLetterStatus(status: any) {
        if (this.data.idRepWidgetType != WidgetType.SAVSendLetter) return;
        this.sendLetterButtonSetting.sendButton.status = status || '0';
    }
    @Input() gridWidgetDatasource: any;
    @Input() showFieldsTranslation = false;
    @Input() currentModule: Module;
    @Input() globalProperties: any;
    @Input() disableButtonEditWidget: boolean;
    @Input() treeViewMode: boolean;

    /*SELECTION*/
    @Input() showSelectionFilter: boolean;
    @Input() isNewRuleForAllCountry = false;
    @Input() showNewRuleButton = false;
    @Input() showNewLotButton = false;
    @Input() showDeleteProjectButton = false;
    @Input() showInfoIcon = false;
    @Input() showDeleteRuleButton = false;
    @Input() showZoomSlider = false;
    @Input() ignoreFieldFilter = false;
    /*END SELECTION*/

    @Input() selectedNodes: Array<any>;
    @Input() groupTotal: number;
    @Input() groupNumber: number;
    @Input() isMaximized: boolean;

    /**
     * Output
     */
    @Output() onEditWidget = new EventEmitter<EditWidgetTypeEnum>();
    @Output() onSaveWidget = new EventEmitter<SavingWidgetType>();
    @Output() onResetWidget = new EventEmitter<boolean>();
    @Output() onRemoveWidget = new EventEmitter<boolean>();
    @Output() onChangeDisplayMode = new EventEmitter<any>();
    @Output() onChangeFieldFilter = new EventEmitter<FilterData>();
    @Output() onUpdateRowEditableTable = new EventEmitter<EditWidgetTypeEnum>();
    @Output() onTreeViewExpandWidget = new EventEmitter<boolean>();
    @Output() onChangeColumnLayoutsetting = new EventEmitter<ColumnLayoutSetting>();
    @Output() onChangeRowSetting = new EventEmitter<RowSetting>();
    @Output() onChangeODEProperties = new EventEmitter<any>();
    @Output() onChangeWidgetFormType = new EventEmitter<WidgetFormTypeEnum>();
    @Output() onPropertiesItemClick = new EventEmitter<any>();
    @Output() onClickUploadFiles = new EventEmitter<any>();
    @Output() onClickDeleteFiles = new EventEmitter<any>();
    @Output() onOpenTranslateWidget = new EventEmitter<any>();
    @Output() onEditWidgetInPopup = new EventEmitter<any>();

    @Output() onPrintWidget = new EventEmitter<boolean>();
    @Output() onSearch = new EventEmitter<boolean>();
    @Output() onExportExcel = new EventEmitter<boolean>();
    @Output() onOpenNewWindow = new EventEmitter<any>();

    @Output() onToolbarFilterValueChanged = new EventEmitter<string>();
    @Output() onToolbarButtonsToggle = new EventEmitter<boolean>();
    @Output() onCursorFocusOutOfMenu = new EventEmitter<boolean>();
    @Output() onOpenArticleTranslate = new EventEmitter<any>();
    @Output() onOpenFieldTranslateWidget = new EventEmitter<any>();
    @Output() onCellDirectionChanged = new EventEmitter<any>();
    @Output() onAddWidgetTemplate = new EventEmitter<any>();
    @Output() onChangeWidgetTemplate = new EventEmitter<any>();
    @Output() onRefresh = new EventEmitter<any>();
    @Output() onMaximizeWidget = new EventEmitter<any>();//Toggle: true: maximize, false: restore
    @Output() onNoteFormWidgetAction = new EventEmitter<any>();

    /*SELECTION*/
    @Output() onNewRule = new EventEmitter<boolean>();
    @Output() onDeleteRule = new EventEmitter<boolean>();
    @Output() allCountryCheckboxChanged = new EventEmitter<boolean>();
    @Output() onSaveFilter = new EventEmitter<boolean>();
    @Output() onOpenFilter = new EventEmitter<boolean>();
    @Output() onZoomSliderChanged = new EventEmitter<any>();
    @Output() onNewLotClick = new EventEmitter<any>();
    @Output() onDeleteProjectClick = new EventEmitter<any>();
    /*END SELECTION*/

    @Output() onSuccessRoleSaved = new EventEmitter<any>();
    @Output() onNextDoubletteGroup = new EventEmitter<number>();
    @Output() groupNumberChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() designColumnsAction = new EventEmitter<boolean>();
    @Output() toggleEditingColumnLayoutOfWidgetAction = new EventEmitter<any>();
    @Output() saveColumnLayoutOfWidgetAction = new EventEmitter<any>();
    @Output() sendLetterClickAction = new EventEmitter<any>();
    @Output() resetLetterStatusClickAction = new EventEmitter<any>();
    @Output() confirmSendLetterClickAction = new EventEmitter<any>();
    @Output() printWidgetClickedAction = new EventEmitter<any>();
    @Output() confirmPrintWidgetClickedAction = new EventEmitter<any>();

    @ViewChild('menuWidgetStatus1')
    private menuWidgetStatus1: wjcInput.WjPopup;

    @ViewChild('menuWidgetStatus2')
    private menuWidgetStatus2: wjcInput.WjPopup;

    @ViewChild('menuWidgetStatus3')
    private menuWidgetStatus3: wjcInput.WjPopup;

    @ViewChild('editFormDropdown')
    public editFormDropdown: wjcInput.WjPopup;

    @ViewChild('editTableDropdown')
    private editTableDropdown: wjcInput.WjPopup;

    @ViewChild('editCountryDropdown')
    private editCountryDropdown: wjcInput.WjPopup;

    @ViewChild('editTreeviewDropdown')
    private editTreeviewDropdown: wjcInput.WjPopup;

    @ViewChild('editTableTranslateDropdown')
    private editTableTranslateDropdown: wjcInput.WjPopup;

    @ViewChild('editNoteFormDropdown')
    private editNoteFormDropdown: wjcInput.WjPopup;

    @ViewChild('fullscreenDropdown')
    private fullscreenDropdown: wjcInput.WjPopup;

    @ViewChild('filterMenuForTable')
    private filterMenuForTable: FilterMenuComponent;

    @ViewChildren('fullscreenDropdown')
    private fullscreenDropdowns: QueryList<wjcInput.WjPopup>;

    public WidgetTypeView = WidgetType;

    constructor(
        private _eref: ElementRef,
        private store: Store<AppState>,
        private propertyPanelActions: PropertyPanelActions,
        private propertyPanelService: PropertyPanelService,
        private globalSettingSer: GlobalSettingService,
        private globalSettingConstant: GlobalSettingConstant,
        private appErrorHandler: AppErrorHandler,
        private domHandler: DomHandler,
        private widgetUtils: WidgetUtils,
        private menuStatusService: MenuStatusService,
        protected router: Router,
        private commonService: CommonService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private containerRef: ViewContainerRef,
        private _changeDetectorRef: ChangeDetectorRef,
        private datatableService: DatatableService
    ) {
        super(router);
    }

    public ngOnInit() {
        if (!this.filterModes || (this.filterModes && this.filterModes.length == 0)) {
            if (!this._isShowedFilterModes) {
                this.filterModes = [];
                this.subFilterModes = [];
            } else {
                this.filterModes = [
                    new FilterMode({
                        mode: FilterModeEnum.ShowAllWithoutFilter,
                        value: 'Show all fields'
                    }),
                    new FilterMode({
                        mode: FilterModeEnum.ShowAll,
                        value: 'Show all'
                    }),
                    new FilterMode({
                        mode: FilterModeEnum.HasData,
                        value: 'Only has data',
                    }),
                    new FilterMode({
                        mode: FilterModeEnum.EmptyData,
                        value: 'Only empty data'
                    })
                ];

                this.filterModes.forEach(filterMode => {
                    filterMode.selected = false;
                    if (filterMode.mode == this.selectedFilter) {
                        filterMode.selected = true;
                    }
                });

                this.subFilterModes = cloneDeep(this.filterModes);
                this.subFilterModes.forEach(filterMode => {
                    filterMode.selected = false;
                    if (filterMode.mode == this.selectedSubFilter) {
                        filterMode.selected = true;
                    }
                    filterMode.isSub = true;
                });
            }
        }

        if (this.data && this.data.idRepWidgetType == WidgetType.FieldSet &&
            (!this.widgetFormTypes || !this.widgetFormTypes.length)) {
            this.widgetFormTypes = this.initWidgetFormType();
        }

        this.handleDisplayEditButtons();
        this.settings_Init();
        setTimeout(() => {
            this.getWidgetGlobalPropertiesFromSetting();
        }, 200);
    }

    public ngAfterViewInit() {
        setTimeout(() => {
            this.initOwnerForMenuWidgetStatus();
        }, 500);
        this.handleShowFilterTable(true);

        if (this.showZoomSlider) {
            this.initZoomSlider();
        }
    }

    ngOnDestroy() {
        uti.Uti.unsubscribe(this);
    }

    private hasChanges(changes) {
        return changes && changes.hasOwnProperty('currentValue') && changes.hasOwnProperty('previousValue');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['allowTableAddNewRow']) {
            const hasChanges = this.hasChanges(changes['allowTableAddNewRow']);
            if (hasChanges) {
                this.isShowedAddNewRowTableButton = this.allowTableAddNewRow;
            }
        }
        if (changes['allowTableDeleteRow']) {
            const hasChanges = this.hasChanges(changes['allowTableDeleteRow']);
            if (hasChanges) {
                this.isShowedDeleteRowTableButton = this.allowTableDeleteRow;
            }
        }
    }

    public editWidget(widgetType) {
        this.editingWidgetType = widgetType;
        this.getWidgetGlobalPropertiesFromSetting(this.editWidgetCallback.bind(this));
    }

    public resetToUpdateFieldsFilterFromOutside() {
        this.isUpdateOnInitFieldsFilter = false;
    }

    editWidgetCallback() {
        const editMode = this.propertyPanelService.getItemRecursive(this.globalWidgetProperties, 'EditIn');

        if (editMode) {
            switch (editMode.value) {
                case 'Popup':
                    this.editWidgetInPopup(this.editingWidgetType);
                    break;

                case 'Inline':
                    this.editWidgetInline(this.editingWidgetType);
                    break;
            }
        }
    }

    public handleShowFilterTable(isShow: boolean) {
        this.showFilterTable = isShow;
    }

    private handleDisplayEditButtons() {
        if (this.data) {
            switch (this.data.idRepWidgetType) {
                case WidgetType.FieldSet:
                case WidgetType.Combination:
                case WidgetType.CombinationCreditCard:
                    this.isShowedEditFormButton = true;
                    this.isShowedResetButton = true;
                    this.toggleTableControlButtons();
                    break;
                case WidgetType.Translation:
                    this.isShowedEditFormButton = true;
                    this.isShowedResetButton = true;
                    this.toggleTranslationTableControlButtons();
                    break;
                case WidgetType.EditableGrid:
                // case WidgetType.EditableTable:
                case WidgetType.DataGrid:
                case WidgetType.EditableRoleTreeGrid:
                    this.isShowedEditTableButton = true;
                    this.isShowedResetButton = true;
                    this.toggleTableControlButtons();

                    if (this.treeViewMode) {
                        this.isShowedExpandForTreeView = true;
                    }
                    break;
                case WidgetType.FileExplorer:
                case WidgetType.ToolFileTemplate:
                case WidgetType.FileExplorerWithLabel:
                    this.isShowedResetButton = true;
                    this.isShowedSaveFileExplorer = true;
                    this.isShowedUploadFiles = true;
                    this.isShowedDeleteFiles = true;
                    break;
                case WidgetType.FileTemplate:
                    this.isShowedSaveFileExplorer = true;
                    this.isShowedResetButton = true;
                    break;
                case WidgetType.Country:
                    this.isShowedEditButtonsForCountry = true;
                    this.isShowedResetButton = true;
                    break;
                case WidgetType.TreeView:
                case WidgetType.EditableRoleTreeGrid:
                    this.isShowedEditButtonsForTreeView = true;
                    this.isShowedResetButton = true;
                    this.isShowedExpandForTreeView = true;
                    break;
                case WidgetType.DataGrid:
                    if (this.widgetUtils.isGroupTable(this.data)) {
                        this.isShowedExpandForTreeView = true;
                    }
                    break;
                case WidgetType.Upload:
                    this.isShowedResetButton = true;
                    this.isShowedUploadFiles = true;
                    this.isShowedDeleteFiles = false;
                    break;
                case WidgetType.DoubleGrid:
                case WidgetType.TripleGrid:
                case WidgetType.CountrySelection:
                    this.isShowedResetButton = true;
                    break;
                case WidgetType.EditPaymentType:
                    this.isShowedSavePaymentType = true;
                    break;
                case WidgetType.SAVLetter:
                    this.isShowedSaveSAVTemmplate = true;
                    this.isShowedUploadFiles = true;
                    break;
                case WidgetType.NoteForm:
                    this.isShowedResetButton = true;
                    this.isShowedEditButtonsForNoteForm = true;
                    break;
            }
        }
    }

    private toggleTableControlButtons() {
        this.isShowedAddNewRowTableButton = this.allowTableAddNewRow;
        this.isShowedDeleteRowTableButton = this.allowTableDeleteRow;
    }

    public toggleTranslationTableControlButtons() {
        this.isShowedAddNewRowTableButton = false;
        this.isShowedDeleteRowTableButton = false;
    }

    private getWidgetGlobalPropertiesFromSetting(callback?) {
        this.globalSettingSer.getAllGlobalSettings().subscribe((data: any) => {
            this.appErrorHandler.executeAction(() => {
                if (!data || !data.length) {
                    return;
                }

                this.globalWidgetProperties = this.buildPropertiesFromGlobalSetting(data);

                if (callback) {
                    callback();
                }
            });
        });
    }

    private buildPropertiesFromGlobalSetting(data: GlobalSettingModel[]): any[] {
        const propertiesSettingName = this.globalSettingConstant.globalWidgetProperties;

        const propertiesSettings = data.find(x => x.globalName === propertiesSettingName);
        if (!propertiesSettings || !propertiesSettings.idSettingsGlobal) {
            return this.propertyPanelService.createDefaultGlobalSettings();
        }

        const properties = JSON.parse(propertiesSettings.jsonSettings) as GlobalSettingModel[];
        if (!properties || !properties.length) {
            return this.propertyPanelService.createDefaultGlobalSettings();
        }

        return properties;
    }

    private initWidgetFormType(): WidgetFormType[] {
        return [
            new WidgetFormType({
                widgetFormType: WidgetFormTypeEnum.List,
                selected: true,
                label: 'List'
            }),
            new WidgetFormType({
                widgetFormType: WidgetFormTypeEnum.Group,
                selected: false,
                label: 'Group'
            })
        ];
    }

    private initColumnLayoutSetting() {
        return new ColumnLayoutSetting({
            isFitWidthColumn: false,
            columnLayout: null
        });
    }

    private initRowSetting() {
        return new RowSetting({
            showTotalRow: false,
            positionTotalRow: '',
            backgroundTotalRow: '',
            colorTextTotalRow: ''
        });
    }

    private initFieldArray(data): void {
        this.initAllFields(data.widgetDetail);
        if (!this.fieldFilters || !this.fieldFilters.length)
            this.updateFilter(data.widgetDetail);
        if (this.fieldFilters && this.fieldFilters.length &&
            data.fieldFilters && data.fieldFilters.length &&
            !this.isUpdateOnInitFieldsFilter) {
            this.updateFilterSelectedFileds(data.fieldFilters);
            this.isUpdateOnInitFieldsFilter = true;
        }
    }

    private initBehaviorDataForWidgetProperties() {
        if (!this.widgetProperties || !this.widgetProperties.length || !this.data)// || this.data.idRepWidgetType == WidgetType.OrderDataEntry)
            return;
        let isFireEventUpdate = false;
        let temp_isFireEventUpdate = false;

        // init propDisplayFields
        temp_isFireEventUpdate = this.initPropDisplayFields();
        isFireEventUpdate = isFireEventUpdate || temp_isFireEventUpdate;
        // init PropDisplayMode
        temp_isFireEventUpdate = this.initPropDisplayMode();
        isFireEventUpdate = isFireEventUpdate || temp_isFireEventUpdate;

        // init propImportantDisplayFields
        temp_isFireEventUpdate = this.initPropImportantDisplayFields();
        isFireEventUpdate = isFireEventUpdate || temp_isFireEventUpdate;

        // init PropWidgetType
        temp_isFireEventUpdate = this.initPropWidgetType();
        isFireEventUpdate = isFireEventUpdate || temp_isFireEventUpdate;
        // fire event
        if (isFireEventUpdate || this.isFireEventUpdateOnInit) {
            if (!isEmpty(this.data)) {
                const widgetPropertiesStateModel: WidgetPropertiesStateModel = new WidgetPropertiesStateModel({
                    widgetData: this.data,
                    widgetProperties: this.widgetProperties
                });
                this.store.dispatch(this.propertyPanelActions.updateProperties(widgetPropertiesStateModel, this.ofModule));
                this.isFireEventUpdateOnInit = false;
            } else
                this.isFireEventUpdateOnInit = true;
        }
    }

    private initPropWidgetType(): boolean {
        const propWidgetType: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'WidgetType');
        if (propWidgetType && (!propWidgetType.options || !propWidgetType.options.length)) {
            propWidgetType.options = [
                {
                    'key': WidgetFormTypeEnum.List,
                    'value': 'List'
                },
                {
                    'key': WidgetFormTypeEnum.Group,
                    'value': 'Group'
                }
            ];
            propWidgetType.value = this.selectedWidgetFormType;
            return true;
        }
        return false;
    }

    private initPropDisplayMode(): boolean {
        let isFireEventUpdateData = false;
        const isNotWidgetTable = this.data && (this.data.idRepWidgetType == WidgetType.FieldSet ||
            this.data.idRepWidgetType == WidgetType.FieldSetReadonly);
        const isChartWidget = this.data && this.data.idRepWidgetType === WidgetType.Chart;
        //|| this.data.idRepWidgetType == WidgetType.OrderDataEntry);
        const isWidgetCombination = this.data && (this.data.idRepWidgetType == WidgetType.Combination || this.data.idRepWidgetType == WidgetType.CombinationCreditCard);
        const isWidgetNote = this.data && (this.data.idRepWidgetType == WidgetType.NoteForm);
        const options = [
            {
                'key': FilterModeEnum.ShowAll,
                'value': 'Show all'
            },
            {
                'key': FilterModeEnum.HasData,
                'value': 'Only has data'
            },
            {
                'key': FilterModeEnum.EmptyData,
                'value': 'Only empty data'
            }
        ];

        const optionWidgetNote = [
            {
                'key': FilterOptionFormatDate.DateTime,
                'value': 'Date Time'
            },
            {
                'key': FilterOptionFormatDate.Date,
                'value': 'Date'
            },
        ]

        if (isWidgetNote) {
            const propDisplayFields: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'DateTimeFormat');
            if (propDisplayFields && propDisplayFields.children && propDisplayFields.children.length) {
                const propDisplayMode: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(propDisplayFields.children, 'Display');
                if (propDisplayMode && (!propDisplayMode.options || !propDisplayMode.options.length)) {
                    propDisplayMode.options = optionWidgetNote;
                    isFireEventUpdateData = true;
                }
            }
        }

        if (isNotWidgetTable || isWidgetCombination) {
            const propDisplayFields: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'DisplayField');
            if (propDisplayFields && propDisplayFields.children && propDisplayFields.children.length) {
                const propDisplayMode: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(propDisplayFields.children, 'ShowData');
                if (propDisplayMode && (!propDisplayMode.options || !propDisplayMode.options.length)) {
                    propDisplayMode.options = options
                    propDisplayMode.value = this.selectedFilter;
                    isFireEventUpdateData = true;
                }
            }
        }

        if (!isNotWidgetTable || isWidgetCombination) {
            const propDisplayColumns: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'DisplayColumn');
            if (propDisplayColumns && propDisplayColumns.children && propDisplayColumns.children.length) {
                const propDisplayMode: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(propDisplayColumns.children, 'ShowData');
                if (propDisplayMode && (!propDisplayMode.options || !propDisplayMode.options.length)) {
                    propDisplayMode.options = options
                    propDisplayMode.value = !isWidgetCombination ? this.selectedFilter : this.selectedSubFilter;
                    isFireEventUpdateData = true;
                }
            }
        }

        return isFireEventUpdateData;
    }

    private initPropDisplayFields(): boolean {
        let isFireEventUpdateData = false;
        const isNotWidgetTable = this.data && (this.data.idRepWidgetType == WidgetType.FieldSet ||
            this.data.idRepWidgetType == WidgetType.FieldSetReadonly);
        const isChartWidget = this.data && this.data.idRepWidgetType === WidgetType.Chart;
        const isPdfViewer = this.data && this.data.idRepWidgetType === WidgetType.PdfViewer;
        const isSAVSendLetter = this.data && this.data.idRepWidgetType === WidgetType.SAVSendLetter;
        //|| this.data.idRepWidgetType == WidgetType.OrderDataEntry);
        const isWidgetCombination = this.data && (this.data.idRepWidgetType == WidgetType.Combination || this.data.idRepWidgetType == WidgetType.CombinationCreditCard);
        // init propDisplayFields
        const propDisplayFields: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'DisplayField');
        const isNotTableWidget = (isNotWidgetTable || isWidgetCombination);
        const isReadonlyTable = this.data.idRepWidgetType == WidgetType.DataGrid;
        const isEditableGrid = (this.data.idRepWidgetType == WidgetType.EditableGrid);
        const hasFilterData = this.fieldFilters && this.fieldFilters.length;
        const hasNoDisplayFieldOptions = propDisplayFields && (!propDisplayFields.options || !propDisplayFields.options.length);
        if ((isNotTableWidget || isReadonlyTable || this.data.idRepWidgetApp === RepWidgetAppIdEnum.OrderListSummary)
            && propDisplayFields
            && hasFilterData
            && !this.isInitDisplayFields) {
            if (hasNoDisplayFieldOptions)
                propDisplayFields.options = [];
            this.fieldFilters.forEach((item) => {
                if (!item.isTableField) {
                    const indexFilteredItem = propDisplayFields.options.findIndex((_item) => _item.key === item.fieldName);
                    const newItem = {
                        'key': item.fieldName,
                        'value': item.fieldDisplayName,
                        'selected': item.selected,
                        'isHidden': item.isHidden,
                        'isEditable': item.isEditable
                    };
                    if (indexFilteredItem < 0)
                        propDisplayFields.options.push(newItem);
                    else
                        propDisplayFields.options[indexFilteredItem] = newItem;
                }
            });
            isFireEventUpdateData = true;
        }

        // init propDisplayFields
        const propDisplayColumns: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'DisplayColumn');
        const isFieldSetOrCombinationWidget = (!isNotWidgetTable || isWidgetCombination);
        const hasNoDisplayColumnOptions = propDisplayColumns && (!propDisplayColumns.options || !propDisplayColumns.options.length);
        if (isFieldSetOrCombinationWidget
            && propDisplayColumns
            && hasFilterData
            && !this.isInitDisplayFields) {
            if (hasNoDisplayColumnOptions)
                propDisplayColumns.options = [];
            this.fieldFilters.forEach((item) => {
                if (item.isTableField || !isWidgetCombination) {
                    const indexFilteredItem = propDisplayColumns.options.findIndex((_item) => _item.key === item.fieldName);
                    const newItem = {
                        'key': item.fieldName,
                        'value': item.fieldDisplayName,
                        'selected': item.selected,
                        'isHidden': item.isHidden,
                        'isEditable': item.isEditable,
                        'isTableField': item.isTableField
                    };
                    if (indexFilteredItem < 0)
                        propDisplayColumns.options.push(newItem);
                    else
                        propDisplayColumns.options[indexFilteredItem] = newItem;
                }
            });
            isFireEventUpdateData = true;
        }

        if (isPdfViewer) {
            if (hasFilterData && !this.isInitDisplayFields) {
                this.buildPdfColumn(this.widgetProperties, 'PdfColumn', this.fieldFilters);
                isFireEventUpdateData = true;
            }
        }

        const propDropDown: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ShowDropDownOfField');
        const hasNoDropDownOptions = propDropDown && (!propDropDown.options || !propDropDown.options.length);
        if ((isNotWidgetTable || isEditableGrid) && hasNoDropDownOptions) {
            if (hasFilterData && !this.isInitDisplayFields) {
                this.buildShowDropDownOfField(this.widgetProperties, 'ShowDropDownOfField', this.fieldFilters);
                isFireEventUpdateData = true;
            }
        }

        if (isSAVSendLetter) {
            this.buildListenKeyForSAVSendLetter(this.widgetProperties, 'SAVListenKey');
        }

        if (isChartWidget) {
            if (hasFilterData && !this.isInitDisplayFields) {
                let chartType = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ChartType');

                this.buildChartSeries(this.widgetProperties, 'SingleXSerie', this.fieldFilters, false);
                this.buildChartSeries(this.widgetProperties, 'SingleYSerie', this.fieldFilters, false);
                this.buildChartSeries(this.widgetProperties, 'MultiXSerie', this.fieldFilters, false);
                this.buildChartSeries(this.widgetProperties, 'MultiYSeries', this.fieldFilters, true);
                this.buildChartSeries(this.widgetProperties, 'ComboSingleXSerie', this.fieldFilters, false);
                this.buildChartSeries(this.widgetProperties, 'ComboSingleYSerie', this.fieldFilters, false);
                this.buildChartSeries(this.widgetProperties, 'ComboMultiXSerie', this.fieldFilters, false);
                this.buildChartSeries(this.widgetProperties, 'ComboMultiYSeries', this.fieldFilters, true);

                switch (chartType.value) {
                    case ChartTypeNgx.VerticalBarChart:
                    case ChartTypeNgx.HorizontalBarChart:
                    case ChartTypeNgx.PieChart:
                    case ChartTypeNgx.AdvancedPieChart:
                    case ChartTypeNgx.PieGrid:
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'SingleXSerie').visible = true;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'SingleYSerie').visible = true;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'MultiXSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'MultiYSeries').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboSingleXSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboSingleYSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboMultiXSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboMultiYSeries').visible = false;
                        break;

                    case ChartTypeNgx.GroupedVerticalBarChart:
                    case ChartTypeNgx.GroupedHorizontalBarChart:
                    case ChartTypeNgx.StackedVerticalBarChart:
                    case ChartTypeNgx.StackedHorizontalBarChart:
                    case ChartTypeNgx.NormalizedVerticalBarChart:
                    case ChartTypeNgx.NormalizedHorizontalBarChart:
                    case ChartTypeNgx.LineChart:
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'SingleXSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'SingleYSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'MultiXSerie').visible = true;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'MultiYSeries').visible = true;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboSingleXSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboSingleYSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboMultiXSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboMultiYSeries').visible = false;
                        break;

                    case ChartTypeNgx.ComboChart:
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'SingleXSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'SingleYSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'MultiXSerie').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'MultiYSeries').visible = false;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboSingleXSerie').visible = true;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboSingleYSerie').visible = true;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboMultiXSerie').visible = true;
                        this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ComboMultiYSeries').visible = true;
                        break;
                }

                isFireEventUpdateData = true;
            }
        }

        if (isFireEventUpdateData)
            this.isInitDisplayFields = true;
        return isFireEventUpdateData;
    }

    private buildPdfColumn(properties, propName, columns) {
        const prop: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(properties, propName);
        if (prop) {
            prop.options = [];
            columns.forEach((col) => {
                if (col.fieldDisplayName.toLowerCase().includes('pdf')) {
                    const newItem = {
                        'key': col.fieldName,
                        'value': col.fieldDisplayName,
                    };
                    prop.options.push(newItem);
                }
            });
            if (prop.options && prop.options.length > 0 && !prop.value) {
                this.propertyPanelService.getItemRecursive(this.widgetProperties, 'PdfColumn').value = prop.options[0].key;
            }
        }
    }

    private buildShowDropDownOfField(properties, propName, columns) {
        const propShowDropDown: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(properties, propName);
        if (propShowDropDown) {
            propShowDropDown.options = [];
            columns.forEach((col) => {
                if (col && col.dataType) {
                    const newItem = {
                        value: col.fieldDisplayName,
                        hidden: col.isHidden,
                        dataType: col.dataType,
                        selected: col.selected
                    };
                    propShowDropDown.options.push(newItem);
                }
            });
        }
    }

    private buildListenKeyForSAVSendLetter(properties, propName) {
        const prop: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(properties, propName);
        const comboBoxTypes = [
            ComboBoxTypeConstant.SAVListenKey
        ];
        this.commonService.getListComboBox(comboBoxTypes.join(''))
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item.SAVListenKey) {
                        return;
                    }
                    if (prop) {
                        prop.options = response.item.SAVListenKey.map(x => {
                            return {
                                key: x.idValue,
                                value: x.textValue
                            }
                        });
                    }
                });
            });
    }

    private buildChartSeries(properties, propName, columns, isMultiCombobox) {
        const prop: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(properties, propName);

        if (prop) {
            prop.options = [];
            columns.forEach((col) => {
                let newItem: any;
                if (isMultiCombobox) {
                    let isChecked = false;
                    let found = prop.value.find(x => x.key == col.fieldName);
                    if (found) {
                        isChecked = found.$checked;
                    }
                    newItem = {
                        'key': col.fieldName,
                        'value': col.fieldDisplayName,
                        '$checked': isChecked
                    };
                } else {
                    newItem = {
                        'key': col.fieldDisplayName,
                        'value': col.fieldDisplayName,
                    };
                }

                let visible = false;

                prop.options.push(newItem);
            });
        }
    }

    private initPropImportantDisplayFields(): boolean {
        let isFireEventUpdateData = false;
        const isNotWidgetTable = this.data && (this.data.idRepWidgetType == WidgetType.FieldSet ||
            this.data.idRepWidgetType == WidgetType.FieldSetReadonly);
        //|| this.data.idRepWidgetType == WidgetType.OrderDataEntry);
        const isWidgetCombination = this.data && (this.data.idRepWidgetType == WidgetType.Combination || this.data.idRepWidgetType == WidgetType.CombinationCreditCard);
        // init propDisplayFields
        const propDisplayFields: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'ImportantDisplayFields');
        const isNotTableWidget = (isNotWidgetTable || isWidgetCombination);
        const hasFilterData = this.fieldFilters && this.fieldFilters.length;
        const isReadonlyTable = this.data.idRepWidgetType == WidgetType.DataGrid;
        const hasNoDisplayFieldOptions = propDisplayFields && (!propDisplayFields.options || !propDisplayFields.options.length);
        if ((isNotTableWidget || isReadonlyTable || this.data.idRepWidgetApp === RepWidgetAppIdEnum.OrderListSummary)
            && propDisplayFields
            && hasFilterData
            && !this.isInitImportantDisplayFields) {
            if (hasNoDisplayFieldOptions)
                propDisplayFields.options = [];
            this.fieldFilters.forEach((item) => {
                if (!item.isTableField) {
                    let index = -1;
                    const filteredItem = propDisplayFields.options.find((_item, _index) => {
                        if (_item.key === item.fieldName) {
                            index = _index;
                            return true;
                        }
                    });
                    const newItem = {
                        'key': item.fieldName,
                        'value': item.fieldDisplayName,
                        'selected': index >= 0 ? filteredItem.selected : false,
                        'isHidden': item.isHidden,
                        'isEditable': item.isEditable
                    };
                    if (index < 0)
                        propDisplayFields.options.push(newItem);
                    else
                        propDisplayFields.options[index] = newItem;
                }
            });
            isFireEventUpdateData = true;
            this.isInitImportantDisplayFields = true;
        }
        return isFireEventUpdateData;
    }

    updateFilter(widgetDetail: WidgetDetail) {
        if (!this.fieldFilters || (this.fieldFilters && this.fieldFilters.length == 0)) {
            this.fieldFilters = [];
            this.fieldFilters = cloneDeep(this.buildCollectionFieldFilter(widgetDetail, false));
        }
    }

    /**
     * Handle for special cases such as Customer History
     * @param headerCols
     */
    manualAddFieldFilters(headerCols: Array<any>) {
        if (!this.fieldFilters || (this.fieldFilters && this.fieldFilters.length == 0)) {
            this.fieldFilters = [];
            this.fieldFilters = headerCols.map(x => {
                let isHidden: boolean;
                if (x.setting) {
                    const setting = uti.Uti.getCloumnSettings(x.setting);
                    isHidden = setting.DisplayField && setting.DisplayField.Hidden && parseInt(setting.DisplayField.Hidden, 10) > 0;
                }
                return new FieldFilter({
                    fieldName: x.fieldName,
                    fieldDisplayName: x.fieldDisplayName,
                    selected: true,
                    isHidden: isHidden || false
                });
            });
            this._copiedFieldFilter = cloneDeep(this.fieldFilters);

            // Sync to display in property panel
            const propDisplayColumns: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.widgetProperties, 'DisplayColumn');
            const hasNoDisplayColumnOptions = propDisplayColumns && (!propDisplayColumns.options || !propDisplayColumns.options.length);

            if (propDisplayColumns) {
                if (hasNoDisplayColumnOptions)
                    propDisplayColumns.options = [];
                this.fieldFilters.forEach((item) => {
                    const indexFilteredItem = propDisplayColumns.options.findIndex((_item) => _item.key === item.fieldName);
                    if (indexFilteredItem < 0) {
                        const newItem = {
                            'key': item.fieldName,
                            'value': item.fieldDisplayName,
                            'selected': item.selected,
                            'isHidden': item.isHidden,
                            'isEditable': item.isEditable,
                            'isTableField': item.isTableField
                        };
                        propDisplayColumns.options.push(newItem);
                    }
                });

                const widgetPropertiesStateModel: WidgetPropertiesStateModel = new WidgetPropertiesStateModel({
                    widgetData: this.data,
                    widgetProperties: this.widgetProperties
                });
                if (this.data.idRepWidgetType === WidgetType.OrderDataEntry) {
                    this.updateFilterSelectedFileds(this.originalFieldFilters);
                    this._copiedFieldFilter = cloneDeep(this.fieldFilters);
                }
                this.store.dispatch(this.propertyPanelActions.updateProperties(widgetPropertiesStateModel, this.ofModule));
            }
        }
    }

    updateFilterSelectedFileds(sourceFieldsFilter: FieldFilter[]) {
        if (sourceFieldsFilter && sourceFieldsFilter.length) {
            sourceFieldsFilter.forEach((item) => {
                const index = this.fieldFilters.findIndex((_item) => _item.fieldName === item.fieldName);
                if (index >= 0)
                    this.fieldFilters[index].selected = item.selected;
            })
        }
    }

    initAllFields(widgetDetail: WidgetDetail) {
        if (!this.allFields || !this.allFields.length) {
            this.allFields = this.buildCollectionFieldFilter(widgetDetail, true);
        }
    }

    private buildCollectionFieldFilter(widgetDetail: WidgetDetail, isAllField?: boolean) {
        const result: Array<any> = [];
        if (widgetDetail && (widgetDetail.idRepWidgetType == WidgetType.FieldSet ||
            widgetDetail.idRepWidgetType == WidgetType.FieldSetReadonly ||
            widgetDetail.idRepWidgetType == WidgetType.Combination ||
            widgetDetail.idRepWidgetType == WidgetType.FileExplorer ||
            widgetDetail.idRepWidgetType == WidgetType.ToolFileTemplate ||
            widgetDetail.idRepWidgetType == WidgetType.FileExplorerWithLabel ||
            widgetDetail.idRepWidgetType == WidgetType.CombinationCreditCard)) {
            //|| widgetDetail.idRepWidgetType == WidgetType.OrderDataEntry)) {
            if (widgetDetail.contentDetail && widgetDetail.contentDetail.data && widgetDetail.contentDetail.data.length > 0) {
                const widgetInfo = widgetDetail.contentDetail.data;
                if (!widgetInfo[1])
                    return;
                const contentList: Array<any> = widgetInfo[1];
                contentList.forEach(content => {
                    const _item = this.buildFieldFilterByDataSet(content);
                    if (!isNil(isAllField) && isAllField)
                        _item.selected = true;
                    result.push(_item);
                })
            }

            if (widgetDetail.idRepWidgetType == WidgetType.Combination) {
                const contentDetail = widgetDetail.contentDetail;
                if (contentDetail && contentDetail.data[2][0].columnSettings) {
                    const widgetSetting = contentDetail.data[2][0].columnSettings;
                    const keys = Object.keys(widgetSetting);
                    keys.forEach((key) => {
                        const _item = this.buildFieldFilterByDataTable(widgetSetting[key], true, true);
                        if (!isNil(isAllField) && isAllField)
                            _item.selected = true;
                        result.push(_item);
                    });
                }
            }
        } else {
            let widgetDetailData;
            if (widgetDetail.contentDetail) {
                if (widgetDetail.contentDetail.columnSettings) {
                    widgetDetailData = { ...widgetDetail };
                } else if (widgetDetail.contentDetail.data) {
                    widgetDetailData = {
                        ...widgetDetail,
                        contentDetail: this.datatableService.formatDataTableFromRawData(widgetDetail.contentDetail.data)
                    };
                }
            }

            if (widgetDetailData && widgetDetailData.contentDetail && widgetDetailData.contentDetail.columnSettings) {
                const widgetSetting = widgetDetailData.contentDetail.columnSettings;
                const keys = Object.keys(widgetSetting);
                const isEditable = widgetDetailData.idRepWidgetType == WidgetType.Chart;
                keys.forEach((key) => {
                    const _item = this.buildFieldFilterByDataTable(widgetSetting[key], isEditable, false);
                    if (!isNil(isAllField) && isAllField)
                        _item.selected = true;
                    result.push(_item);
                });
            }
        }
        return result;
    }

    private buildFieldFilterByDataSet(content: any): FieldFilter {
        let isHidden = false;
        let dataType;
        if (content.Setting && content.Setting.length) {
            const settingArray: any = JSON.parse(content.Setting);
            const setting = uti.Uti.getCloumnSettings(settingArray);
            isHidden = setting.DisplayField && setting.DisplayField.Hidden && parseInt(setting.DisplayField.Hidden, 10) > 0;
            dataType = setting.ControlType && (setting.ControlType.Type.toLowerCase() == ControlType.ComboBox || setting.ControlType.Type.toLowerCase() == ControlType.DateTime) ? setting.ControlType.Type : '';
        }
        return new FieldFilter({
            fieldName: content.OriginalColumnName,
            fieldDisplayName: content.ColumnName,
            dataType: dataType,
            selected: true,
            isHidden: isHidden,
            isEditable: true,
            isTableField: false
        });
    }

    private buildFieldFilterByDataTable(setting: any, isEditableTable?: boolean, isTableField?: boolean): FieldFilter {
        let isHidden = false;
        let dataType;
        let isEditable = true;
        if (setting.Setting && setting.Setting.length) {
            const _setting = uti.Uti.getCloumnSettings(setting.Setting);
            // should not show in filter field
            // in case of a required/combo-box type field in ediable table
            if (isEditableTable &&
                ((_setting.Validation && _setting.Validation.IsRequired) ||
                    (_setting.ControlType && _setting.ControlType.Type.toLowerCase() == ControlType.ComboBox))) {
                dataType = _setting.ControlType && (_setting.ControlType.Type.toLowerCase() == ControlType.ComboBox ||
                    _setting.ControlType.Type.toLowerCase() == ControlType.DateTime) ? _setting.ControlType.Type : '';
                isEditable = false;
            }
            isHidden = _setting.DisplayField && _setting.DisplayField.Hidden && parseInt(_setting.DisplayField.Hidden, 10) > 0;
        }
        return new FieldFilter({
            fieldName: setting.OriginalColumnName,
            fieldDisplayName: setting.ColumnHeader,
            dataType: dataType,
            selected: true,
            isHidden: isHidden,
            isEditable: isEditable,
            isTableField: isTableField
        });
    }

    changeDisplayMode(evt) {
        const value = evt.value;
        const isSub = evt.isSub;
        const key: string = FilterModeEnum[<string>value];
        if (!isSub)
            this.selectedFilter = <FilterModeEnum>FilterModeEnum[key];
        else
            this.selectedSubFilter = <FilterModeEnum>FilterModeEnum[key];
        if (!isSub)
            this.editSelectedDisplayModeItem(this.filterModes, value);
        else
            this.editSelectedDisplayModeItem(this.subFilterModes, value);
        if (value === FilterModeEnum.ShowAllWithoutFilter + '') {
            this.onChangeDisplayMode.emit({
                selectedFilter: !isSub ? this.selectedFilter : this.selectedSubFilter,
                fieldFilters: this.allFields,
                isSub: isSub
            });
            return;
        }
        this.updateFilter(this.data);
        this.onChangeDisplayMode.emit({
            selectedFilter: !isSub ? this.selectedFilter : this.selectedSubFilter,
            fieldFilters: this._copiedFieldFilter,
            isSub: isSub
        });
    }

    private editSelectedDisplayModeItem(filterModes: FilterMode[], value: any) {
        // remove current selected
        let selectedDisplayModeItem = filterModes.find((item) => item.selected);
        if (selectedDisplayModeItem)
            selectedDisplayModeItem.selected = false;

        // apply new selected
        selectedDisplayModeItem = filterModes.find((item) => item.mode + '' === value);
        if (selectedDisplayModeItem)
            selectedDisplayModeItem.selected = true;
    }

    changeFieldFilter(evt: FilterData) {
        this._copiedFieldFilter.forEach((item) => {
            const _item = (evt.fieldFilters as FieldFilter[]).find((c) => c.fieldName == item.fieldName);
            if (_item)
                item.selected = _item.selected;
        });
        this.fieldFilters = cloneDeep(this._copiedFieldFilter);
        this.hideMenuWidgetStatus();
        this.onChangeFieldFilter.emit(evt);
    }

    removeWidget(): void {
        this.onRemoveWidget.emit(true);
    }

    saveFormWidget(): void {
        if (this.data.idRepWidgetType === this.WidgetTypeView.NoteForm)
            this.noteFormWidgetAction(this.NOTE_ACTION_ENUM.SAVE);
        else if (this.data.idRepWidgetType == WidgetType.Combination)
            this.onSaveWidget.emit(SavingWidgetType.Combination);
        else if (this.data.idRepWidgetType == WidgetType.CombinationCreditCard)
            this.onSaveWidget.emit(SavingWidgetType.CombinationCreditCard);
        else
            this.onSaveWidget.emit(SavingWidgetType.Form);
    }

    saveSAVTemplate(): void {
        this.onSaveWidget.emit(SavingWidgetType.SAVLetter);
    }

    saveEditableTableWidget(): void {
        if (this.data.idRepWidgetType == WidgetType.Combination)
            this.onSaveWidget.emit(SavingWidgetType.Combination);
        else
            this.onSaveWidget.emit(SavingWidgetType.EditableTable);
    }

    saveCountryWidget(): void {
        this.onSaveWidget.emit(SavingWidgetType.Country);
    }

    resetWidget(): void {
        if (!this.showToolButtons) {
            this.showToolButtons = true;
        }

        this.toggleEditTemplateMode(false);

        this.isShowToolButtonsWihoutClick = false;
        this.onResetWidget.emit(true);
        this.settings_Class_ShowToolButtons();
    }

    public treeViewExpandAll(isExpand: boolean) {
        this.onTreeViewExpandWidget.emit(isExpand);
    }

    public saveTreeViewWidget(): void {
        this.onSaveWidget.emit(SavingWidgetType.TreeView);
    }

    deleteRowEditableTable(): void {
        this.onEditWidget.emit(EditWidgetTypeEnum.EditableDeleteRow);
    }

    addRowEditableTable(): void {
        if (this.toolbarFilterValue) {
            this.toolbarFilterValue = '';
            this.onFilterValueChanged();
        }
        this.onEditWidget.emit(EditWidgetTypeEnum.EditableAddNewRow);
    }

    manageAddRowTableButtonStatus(isDisable: boolean): void {
        this.isDisableAddRowTableButton = isDisable;
    }

    manageDeleteRowTableButtonStatus(isDisable: boolean): void {
        this.isDisableDeleteRowTableButton = isDisable;
    }

    manageSaveTableButtonStatus(isDisable: boolean): void {
        this.isDisableSaveTableButton = isDisable;
    }

    public toggled(open: boolean): void {

    }

    public toggledTable(open: boolean): void {

    }

    public onclickDDMainMenu(event) {
        setTimeout(() => {
            this.currentToggleElement = $(event.target).closest('a.dropdown-toggle');
            const topParent = $(this._eref.nativeElement).closest('div.widget-module-info-container, div.widget-edit-dialog');
            if (topParent && topParent.length)
                this.position = { parent: topParent, toggleElement: this.currentToggleElement };
        });
    }

    public onclickDDSubMenu(event) {
        setTimeout(() => {
            this.currentToggleElement = $(event.target).closest('a.dropdown-toggle');
            const topParent = $(this._eref.nativeElement).closest('div.widget-module-info-container, div.widget-edit-dialog');
            if (topParent && topParent.length)
                this.position = { parent: topParent, toggleElement: this.currentToggleElement };
        });
    }

    public toggleEditDropdown(isShow, widgetType?: EditWidgetTypeEnum, callback?: Function) {
        this.isOpeningEditDropdown = isShow;

        // if (!widgetType) return;
        setTimeout(() => {
            switch (widgetType) {
                case EditWidgetTypeEnum.Form:
                    if (this.editFormDropdown) {
                        isShow ? this.editFormDropdown.show() : this.editFormDropdown.hide();
                    }
                    break;

                case EditWidgetTypeEnum.Table:
                    if (this.editTableDropdown) {
                        isShow ? this.editTableDropdown.show() : this.editTableDropdown.hide();
                    }
                    if (this.editTableTranslateDropdown) {
                        isShow ? this.editTableTranslateDropdown.show() : this.editTableTranslateDropdown.hide();
                    }
                    break;

                case EditWidgetTypeEnum.Country:
                    if (this.editCountryDropdown) {
                        isShow ? this.editCountryDropdown.show() : this.editCountryDropdown.hide();
                    }
                    break;

                case EditWidgetTypeEnum.TreeView:
                    if (this.editTreeviewDropdown) {
                        isShow ? this.editTreeviewDropdown.show() : this.editTreeviewDropdown.hide();
                    }
                    break;

                case EditWidgetTypeEnum.Expand:
                    if (this.fullscreenDropdowns && this.fullscreenDropdowns.length) {
                        this.fullscreenDropdowns.forEach((item) => {
                            if (item.isVisible) {
                                isShow ? item.show() : item.hide();
                            }
                        });
                    }
                    break;
                case EditWidgetTypeEnum.NoteForm:
                    if (this.editNoteFormDropdown) {
                        isShow ? this.editNoteFormDropdown.show() : this.editNoteFormDropdown.hide();
                    }
                    break;
            }
            if (callback) {
                callback();
            }
        });
    }

    private initOwnerForMenuWidgetStatus() {
        if (this.menuWidgetStatus1 && !this.menuWidgetStatus1.owner)
            this.menuWidgetStatus1.owner = $('#btnMenuWidgetStatus1' + this.randomNumb, $(this._eref.nativeElement)).get(0);

        if (this.menuWidgetStatus2 && !this.menuWidgetStatus2.owner)
            this.menuWidgetStatus2.owner = $('#btnMenuWidgetStatus2' + this.randomNumb, $(this._eref.nativeElement)).get(0);

        if (this.menuWidgetStatus3 && !this.menuWidgetStatus3.owner)
            this.menuWidgetStatus3.owner = $('#btnMenuWidgetStatus3' + this.randomNumb, $(this._eref.nativeElement)).get(0);

        if (this.editFormDropdown && !this.editFormDropdown.owner) {
            this.editFormDropdown.owner = $('#btnEditFormDropdown' + this.randomNumb, $(this._eref.nativeElement)).get(0);
            this.editFormDropdown.addEventListener(this.editFormDropdown.hostElement, 'mouseleave',
                (event) => this.manageEditFormDropdown(event, true, EditWidgetTypeEnum.Form), null);
        }

        if (this.editTableDropdown && !this.editTableDropdown.owner) {
            this.editTableDropdown.owner = $('#btnEditTableDropdown' + this.randomNumb, $(this._eref.nativeElement)).get(0);
            this.editTableDropdown.addEventListener(this.editTableDropdown.hostElement, 'mouseleave',
                (event) => this.manageEditFormDropdown(event, true, EditWidgetTypeEnum.Table), null);
        }

        if (this.editCountryDropdown && !this.editCountryDropdown.owner) {
            this.editCountryDropdown.owner = $('#btnEditCountryDropdown' + this.randomNumb, $(this._eref.nativeElement)).get(0);
            this.editCountryDropdown.addEventListener(this.editCountryDropdown.hostElement, 'mouseleave',
                (event) => this.manageEditFormDropdown(event, true, EditWidgetTypeEnum.Country), null);
        }

        if (this.editTreeviewDropdown && !this.editTreeviewDropdown.owner) {
            this.editTreeviewDropdown.owner = $('#btnEditTreeviewDropdown' + this.randomNumb, $(this._eref.nativeElement)).get(0);
            this.editTreeviewDropdown.addEventListener(this.editTreeviewDropdown.hostElement, 'mouseleave',
                (event) => this.manageEditFormDropdown(event, true, EditWidgetTypeEnum.TreeView), null);
        }

        if (this.editTableTranslateDropdown && !this.editTableTranslateDropdown.owner) {
            this.editTableTranslateDropdown.owner = $('#btnTraslateTableDropdown' + this.randomNumb, $(this._eref.nativeElement)).get(0);
            this.editTableTranslateDropdown.addEventListener(this.editTableTranslateDropdown.hostElement, 'mouseleave',
                (event) => this.manageEditFormDropdown(event, true, EditWidgetTypeEnum.Table), null);
        }

        if (this.editNoteFormDropdown && !this.editNoteFormDropdown.owner) {
            this.editNoteFormDropdown.owner = $('#btnEditNoteFormDropdown' + this.randomNumb, $(this._eref.nativeElement)).get(0);
            this.editNoteFormDropdown.addEventListener(this.editNoteFormDropdown.hostElement, 'mouseleave',
                (event) => this.manageEditFormDropdown(event, true, EditWidgetTypeEnum.TreeView), null);
        }

        if (this.fullscreenDropdowns && this.fullscreenDropdowns.length) {
            const arrayDropdowns = ['Setting', 'Toolbar', 'Edit'];
            this.fullscreenDropdowns.forEach((item) => {
                let eleFound = false;
                arrayDropdowns.forEach((mode) => {
                    if (!eleFound && !item.owner && item.hostElement && item.hostElement.className && item.hostElement.className.indexOf(mode + '_Mode') !== -1) {
                        item.owner = $('#btnFullscreenDropdown' + mode + this.randomNumb, $(this._eref.nativeElement)).get(0);
                        item.addEventListener(item.hostElement, 'mouseleave', (event) => this.manageEditFormDropdown(event, true, null), null);
                        eleFound = true;
                    }
                });//forEach Modes
            });//forEach Dropdowns
        }
    }
    private isCloseDDMenuFromInside = false;
    public hideMenuWidgetStatus() {
        if (this.menuWidgetStatus1 && this.menuWidgetStatus1.isVisible)
            this.menuWidgetStatus1.hide();

        if (this.menuWidgetStatus2 && this.menuWidgetStatus2.isVisible)
            this.menuWidgetStatus2.hide();

        if (this.menuWidgetStatus3 && this.menuWidgetStatus3.isVisible)
            this.menuWidgetStatus3.hide();

        this.isCloseDDMenuFromInside = true;
    }

    public wjPopupHidden(event, menuWidgetStatus) {
        // hide all opening sub menu
        if (menuWidgetStatus) {
            $('.sub-menu.filter-menu .sub-menu', menuWidgetStatus.hostElement).hide();
        }
        if (this.isCloseDDMenuFromInside) {
            this.isCloseDDMenuFromInside = false;
            return;
        }
        const container = $(this._eref.nativeElement).closest('div.box-default');
        if (container.hasClass('edit-mode') || container.hasClass('edit-table-mode') ||
            container.hasClass('edit-country-mode') || container.hasClass('edit-field-mode') ||
            container.hasClass('edit-form-mode'))
            return;
        setTimeout(() => {
            if (container.hasClass('click'))
                container.removeClass('click');
            else
                this.onCursorFocusOutOfMenu.emit(true);
        }, 300);
    }

    /**
     * onChangeWidgetFormType
     */
    changeWidgetFormType($event: WidgetFormTypeEnum) {
        this.onChangeWidgetFormType.emit($event);
    }

    /**
     * changeColumnLayoutsetting
     */
    changeColumnLayoutsetting($event: ColumnLayoutSetting) {
        this.onChangeColumnLayoutsetting.emit($event);
    }

    changeRowSetting($event: RowSetting) {
        this.onChangeRowSetting.emit($event);
    }

    changeODEProperties($event: any) {
        this.onChangeODEProperties.emit($event);
    }

    public saveFileExplorerWidget() {
        let savingWidgetType = SavingWidgetType.FileExplorer;
        switch (this.data.idRepWidgetType) {
            case WidgetType.FileTemplate:
                savingWidgetType = SavingWidgetType.FileTemplate;
                break;
        }

        this.onSaveWidget.emit(savingWidgetType);
    }

    public onPropertiesItemClickHandler(eventData) {
        this.onPropertiesItemClick.emit(eventData);
        this.hideMenuWidgetStatus();
    }

    public clickUploadFiles(event) {
        this.onClickUploadFiles.emit();
    }

    public clickDeleteFiles() {
        this.onClickDeleteFiles.emit();
    }

    /**
     * openTranslateWidget
     * @param mode
     */
    public openTranslateWidget(mode) {
        this.onOpenTranslateWidget.emit({
            mode: mode
        });
        this.toggleEditDropdown(false);
    }

    /**
     * openArticleTranslate
     */
    public openArticleTranslate() {
        this.onOpenArticleTranslate.emit(true);
    }

    public noteFormWidgetAction(noteActionEnum: NoteActionEnum) {
        switch (noteActionEnum) {
            case this.NOTE_ACTION_ENUM.ADD:
                this.noteFormButtonStatus.isAdd = true;
                break;
            default:
                this.noteFormButtonStatus.isAdd = false;
                break;
        }
        this.onNoteFormWidgetAction.emit(<NoteFormDataAction>{ action: noteActionEnum, status: this.noteFormButtonStatus });
    }

    public updateModeStatusNoteForm(isShow: boolean) {
        this.noteFormDataAction = isShow ? this.NOTE_ACTION_ENUM.EDIT_MODE : this.NOTE_ACTION_ENUM.VIEW_MODE;
        if (this.noteFormDataAction) {
            this.noteFormButtonStatus.isAdd = false;
        }
        this.noteFormWidgetAction(this.noteFormDataAction)
    }

    public editWidgetInline(widgetType: EditWidgetTypeEnum) {
        this.toggleEditDropdown(false, widgetType);
        this.getWidgetTemplateCombobox();
        this.onEditWidget.emit(widgetType);
    }

    private manageEditFormDropdown(event, isCheckToElement, widgetType: EditWidgetTypeEnum) {
        if (!this.isOpeningEditDropdown)
            return;

        let isRemoveHoverClass = true;
        if (isCheckToElement) {
            let parentElm;
            if (event.toElement) {
                parentElm = this.domHandler.findParent(event.toElement, 'edit-dropdown, div.edit-widget');
            } else if (event.relatedTarget) {
                parentElm = this.domHandler.findParent(event.relatedTarget, 'edit-dropdown, div.edit-widget');
            }

            if (parentElm && parentElm.length) {
                isRemoveHoverClass = false;
            }
        }
        if (isRemoveHoverClass)
            this.toggleEditDropdown(false, widgetType);

        this.isOpeningEditDropdown = !isRemoveHoverClass;
    }

    public manageTranslateLayoutMenu($event) { }

    public editWidgetInPopup(widgetType: EditWidgetTypeEnum) {
        this.toggleEditDropdown(false, widgetType);
        // Open popup for editing widget
        this.onEditWidget.emit(EditWidgetTypeEnum.InPopup);
    }

    /**
     * printWidget
     */
    public printWidget(): void {
        this.onPrintWidget.emit(true);
    }

    /**
     * search
     */
    public search(): void {
        this.onSearch.emit(true);
    }

    /**
     * exportExcel
     */
    public exportExcel(): void {
        this.onExportExcel.emit(true);
    }

    public togleToolButtonWithoutEmit(isShow: boolean) {
        this.showToolButtons = isShow;
        this.allCountryCheckboxModel.forAllCountryCheckbox = false;
        this.onAllCountryCheckboxChanged();
        if (!isShow) {
            this.isShowToolButtonsWihoutClick = false;
        }
        if (!this.showToolButtons) {
            this.toolbarFilterValue = '';
            this.onFilterValueChanged();
        }
        this.settings_Class_ShowToolButtons();
        if (!isShow) {
            this.toggleEditTemplateMode(false);
        }
    }

    public forceToggleToolButtons(isShow: boolean) {
        this.isShowToolButtonsWihoutClick = isShow;
        this.settings_Class_ShowToolButtons();
        this.onToolbarButtonsToggle.emit(isShow);
    }

    public toggleToolButtons(isShow: boolean, isFromDesignColumnLayout?: boolean) {
        setTimeout(() => {
            this.initOwnerForMenuWidgetStatus();
        }, 500);
        if (this.designingColumnLayout(isShow)) return;
        this.toggleAllToolButtons(isShow, isFromDesignColumnLayout);
        if (this.allowGridTranslation && !isShow) {
            this.openTranslateWidget('row');
        }
    }

    public toggleAllToolButtons(isShow: boolean, isFromDesignColumnLayout?: boolean) {
        this.togleToolButtonWithoutEmit(isShow);
        this.toggleTableControlButtons();
        this.onToolbarButtonsToggle.emit(this.showToolButtons || this.showInDialog || this.isShowToolButtonsWihoutClick);
        this.toggleForColumnLayout(isShow, isFromDesignColumnLayout);
    }

    private toggleForColumnLayout(isShow: boolean, isFromDesignColumnLayout?: boolean) {
        this.isDisableSaveColumnLayout = !isShow;
        if (!isFromDesignColumnLayout && isShow) return;
        this.designColumnsAction.emit(isShow);
        this.showAddColumnLayout = isShow;
    }

    private designingColumnLayout(isShow: boolean) {
        if (!this.showAddColumnLayout || isShow || this.isDisableSaveColumnLayout) {
            return false;
        }
        this.toggleEditingColumnLayoutOfWidgetAction.emit();
        return true;
    }
    public toggleToolButtonsWithoutClick(isShow: boolean) {
        if (!this.isEditTemplateMode) {
            this.isShowToolButtonsWihoutClick = isShow;

            if (this.isEditTemplateMode) {
                this.toggleEditTemplateMode(false);
            }
            this.settings_Class_ShowToolButtons();
            this.onToolbarButtonsToggle.emit(this.showToolButtons || this.showInDialog || this.isShowToolButtonsWihoutClick);
            this._changeDetectorRef.markForCheck();
            this._changeDetectorRef.detectChanges();
        }
    }

    public onFilterValueChanged() {
        this.onToolbarFilterValueChanged.emit(this.toolbarFilterValue);
    }

    public onColumnsLayoutSettingsChanged() {
        if (this.filterMenuForTable)
            this.filterMenuForTable.onColumnsLayoutSettingsChanged();
    }

    public handleSubMenu($event, isShowFirstMenu, isShowSecondMenu) {

        if ($event.fromElement.tagName == 'LI') {
            const currentMenuEle = $($event.target);
            const currentMenuEleWidth = currentMenuEle.width();
            const screenWidth = screen.width;
            const mousePositionX = $event.screenX;
            const eleContainterWidth = $event.target.offsetParent.clientWidth;
            const eleOffsetLeft = $event.target.offsetLeft;

            if ((currentMenuEleWidth + mousePositionX) > screenWidth && $event.fromElement.children[1] !== undefined) {
                $event.fromElement.children[1].style.left = -(eleContainterWidth + eleOffsetLeft * 2) + "px";
            }
        }

        this.showFirstCombinationMenu = isShowFirstMenu;
        this.showSecondCombinationMenu = isShowSecondMenu;
    }

    public openFieldTranslateWidget() {
        this.onOpenFieldTranslateWidget.emit();
    }

    public onClickCellMoveBtn($event) {
        this.isCellMoveForward = !this.isCellMoveForward;

        this.onCellDirectionChanged.emit(this.isCellMoveForward);
    }

    /**
     * settingMenuChanged
     * @param $event
     */
    public settingMenuChanged($event) {
        this.settingChanged = $event;
    }

    private getWidgetTemplateCombobox() {
        if (!this.data) {
            return;
        }

        let comboboxName: string,
            extraData: string = this.listenKeyRequestItem ? this.listenKeyRequestItem.value : null;
        switch (this.data.idRepWidgetApp) {
            case 111:
                comboboxName = 'salesCampaignAddOn_Mailing';
                break;
            case 112:
                comboboxName = 'salesCampaignAddOn_Product';
                break;
            case 113:
                comboboxName = 'salesCampaignAddOn_Global';
                break;
            case 114:
                comboboxName = 'salesCampaignAddOn_ShippingCosts';
                break;
            case 126:
                comboboxName = 'salesCampaignAddOn_PrinterControl';
                break;
        }

        if (comboboxName) {
            this.commonService.getListComboBox(comboboxName, extraData, true).subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response) || !response.item[comboboxName]) {
                        return;
                    }
                    this.widgetTemplates = [];
                    let widgetTemplates = response.item[comboboxName] || [];

                    widgetTemplates = widgetTemplates.map((item) => {
                        return {
                            ...item,
                            editing: this.isEditTemplateMode
                        };
                    });
                    this.widgetTemplates = widgetTemplates;
                });
            });
        }
    }

    public editTemplateCheckboxChanged() {

    }

    public templateComboboxChanged(templateCombo: any) {
        if (!this.templateComboFocused) {
            if (templateCombo.selectedIndex !== -1) {
                templateCombo.selectedIndex = -1;
            }

            return;
        }

        if (templateCombo && templateCombo.selectedItem) {
            if (!this.ignoreOnChangedEmitter) {
                this.onChangeWidgetTemplate.emit(this.selectedTemplate.idValue);
            }
        }

        this.templateComboFocused = false;
        this.ignoreOnChangedEmitter = false;
    }

    public openAddWidgetTemplateDialog() {
        this.showDialogAddWidgetTemplate = true;

        setTimeout(() => {
            if (this.dialogAddWidgetTemplate) {
                this.dialogAddWidgetTemplate.open();
            }
        }, 50);
    }

    public onSaveWidgetTemplateDialog(templateName: string) {
        this.showDialogAddWidgetTemplate = false;

        if (this.widgetTemplates.length) {
            let existingNewItem = this.widgetTemplates.find(x => x.idValue == -1);
            if (existingNewItem) {
                existingNewItem.textValue = templateName;
                existingNewItem.editing = this.isEditTemplateMode
            } else {
                this.widgetTemplates.push({
                    idValue: -1,
                    textValue: templateName,
                    editing: this.isEditTemplateMode
                });
            }
        } else {
            this.widgetTemplates.push({
                idValue: -1,
                textValue: templateName,
                editing: this.isEditTemplateMode
            });
        }

        this.templateCombo.refresh();
        this.templateComboFocused = true;
        this.ignoreOnChangedEmitter = true;
        this.templateCombo.selectedIndex = this.widgetTemplates.length - 1;

        this.onAddWidgetTemplate.emit();
    }

    public onCloseWidgetTemplateDialog() {
        this.showDialogAddWidgetTemplate = false;
    }

    public toggleEditTemplateMode(isEditMode: boolean) {
        this.isShowToolButtonsWihoutClick = false;
        this.isEditTemplateMode = isEditMode;
        this.settings_Class_EditTemplateMode();
        this.settings_Class_ShowToolButtons();
        if (isEditMode) {
            this.editWidgetInline(EditWidgetTypeEnum.Table);
            this.onAddWidgetTemplate.emit();
        } else {
            this.widgetTemplates = [];
            this.showDialogAddWidgetTemplate = false;
            this.selectedTemplate = null;
        }
    }

    public refreshWidget() {
        this.onRefresh.emit();
    }

    /*SELECTION*/
    public newRule(isForAllCountry?: boolean): void {
        this.onNewRule.emit(isForAllCountry);
    }

    public deleteRule(isForAllCountry?: boolean) {
        if (this.deletedRulesCount) {
            this.onDeleteRule.emit(isForAllCountry);
        }
    }

    public onAllCountryCheckboxChanged() {
        this.isNewRuleForAllCountry = this.allCountryCheckboxModel.forAllCountryCheckbox;
        this.allCountryCheckboxChanged.emit(this.allCountryCheckboxModel.forAllCountryCheckbox);
    }

    public saveFilter(): void {
        this.onSaveFilter.emit();
    }

    public openFilter(): void {
        this.onOpenFilter.emit();
    }

    public newLot() {
        this.onNewLotClick.emit();
    }

    public deleteProject() {
        this.onDeleteProjectClick.emit();
    }

    public openNewWindow() {
        this.onOpenNewWindow.emit();
    }

    private initZoomSlider() {
        if ($('input#zoomSlider1').length) {
            this.zoomSlider1 = new Slider("input#zoomSlider1", {
                min: 50,
                max: 150,
                step: 10,
                value: 100,
                tooltip: 'hide',
            });

            this.zoomSlider1.on("change", (result: any) => {
                this.processChangeZoomSlider(result.newValue, true);
            });
        }

        if ($('input#zoomSlider2').length) {
            this.zoomSlider2 = new Slider("input#zoomSlider2", {
                min: 50,
                max: 150,
                step: 10,
                value: 100,
                tooltip: 'hide',
            });

            this.zoomSlider2.on("change", (result: any) => {
                this.processChangeZoomSlider(result.newValue, false);
            });
        }

        $('.slider-handle').on('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.processChangeZoomSlider(100, true);
            this.processChangeZoomSlider(100, false);
        })
    }

    private processChangeZoomSlider(newValue, isSlider1) {
        $(".zoomValue").text(newValue + ' %');

        if (isSlider1 && this.zoomSlider2) {
            this.zoomSlider2.setValue(newValue);
        } else if (this.zoomSlider1) {
            this.zoomSlider1.setValue(newValue);
        }

        this.onZoomSliderChanged.emit(newValue);
    }
    /*END SELECTION*/

    /** User Role  */
    public openUserRoleDialog() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(DialogUserRoleComponent);
        var componentRef: ComponentRef<DialogUserRoleComponent> = this.containerRef.createComponent(factory);
        const dialogUserRoleComponent: DialogUserRoleComponent = componentRef.instance;
        dialogUserRoleComponent.selectedUsers = this.selectedNodes;
        dialogUserRoleComponent.open(() => {
            componentRef.destroy();
        }, () => {
            this.onSuccessRoleSaved.emit(this.selectedNodes);
        });
    }

    /**
     * Next group for doublette widget
     * @param number
     */
    public nextDoubletteGroup(number) {
        this.onNextDoubletteGroup.emit(number);
        this.groupNumberChange.emit(this.groupNumber);
    }

    public saveTableSetting() {
        this.filterMenuForTable.applyFilter();
    }

    // #region [Widget Form column layout]

    public designColumnsHandler() {
        this.toggleToolButtons(true, true);
        this.isDisableSaveColumnLayout = true;
        this.hideMenuWidgetStatus();
    }

    public saveColumnLayoutOfWidget() {
        this.saveColumnLayoutOfWidgetAction.emit();
    }

    public isDisableSaveColumnLayout: boolean = true;

    public manageSaveColumnLayoutStatus(isEnable: boolean) {
        this.isDisableSaveColumnLayout = !isEnable;
    }

    public isDisablePrintAndConfirmPrintButton: boolean = true;
    public isDisablePrintAndConfirmConfirmButton: boolean = true;
    public managePrintAndConfirmButtonStatus(isPrintEnable?: boolean, isConfirmEnable?: boolean) {
        if (!Uti.isNilE(isPrintEnable)) {
            this.isDisablePrintAndConfirmPrintButton = isPrintEnable;
        }
        if (!Uti.isNilE(isConfirmEnable)) {
            this.isDisablePrintAndConfirmConfirmButton = isConfirmEnable;
        }
    }

    //#endregion [Widget Form column layout]

    //#region Maximize Widget
    //Toggle: true: maximize, false: restore
    public maximizeWidget(isMaximize: boolean) {
        this.isMaximized = isMaximize;
        this.onMaximizeWidget.emit({
            isMaximize: isMaximize
        });
        this.initOwnerForMenuWidgetStatus();
    }

    public openMaximizeWidget(mode) {
        this.toggleEditDropdown(false, EditWidgetTypeEnum.Expand, () => {
            switch (mode) {
                case 'Inside':
                    this.maximizeWidget(true);
                    break;
                case 'Separate':
                    this.openNewWindow();
                    break;
            }
            this._changeDetectorRef.markForCheck();
            this._changeDetectorRef.detectChanges();
        });
    }
    //#endregion

    //#region Menu Settings
    private _settings: WidgetMenuStatusModel = new WidgetMenuStatusModel();
    @Input() set settings(settings: WidgetMenuStatusModel) {
        if (!settings) return;

        this._settings = settings;
    }
    get settings() {
        return this._settings;
    }

    private settings_Init() {
        if (!this.settings) return;

        this.settings_Class_ShowToolButtons();
        this.settings_Class_EditTemplateMode();
        this.settings_buildMenuStatusSettings();
    }

    private settings_Class_ShowToolButtons() {
        this._settings.class.showToolButtons = this.showToolButtons || this.showInDialog || this.isShowToolButtonsWihoutClick;
        this._settings.class.visibilityHiddenFront = this._settings.class.showToolButtons;
        this._settings.class.moveUp = !this.showToolButtons && !this.showInDialog && !this.isShowToolButtonsWihoutClick;
    }

    private settings_Class_EditTemplateMode() {
        this._settings.class.editTemplateMode = this.isEditTemplateMode;
    }

    private settings_buildMenuStatusSettings() {
        if (this._settings.enable || !this.data || !this.data.idRepWidgetType) return;

        this.menuStatusService.buildMenuStatusSettings(this._settings, this.data, this.isSwitchedFromGridToForm);
        this._settings.enable = true;
    }

    private settings_buildMenuStatusSettingsWhenSwitchedFromGridToForm() {
        if (!this._settings.enable) return;

        this.menuStatusService.buildMenuStatusSettingsWhenSwitchedFromGridToForm(this.settings, this.data, this.isSwitchedFromGridToForm);
    }
    //#endregion

    //#region [SAV Send Letter]

    public sendLetterClick() {
        this.sendLetterClickAction.emit();
    }

    public resetLetterStatus() {
        this.resetLetterStatusClickAction.emit();
    }

    public confirmSendLetterClick() {
        this.confirmSendLetterClickAction.emit();
    }

    public printWidgetClicked() {
        this.printWidgetClickedAction.emit();
    }

    public confirmPrintWidgetClicked() {
        this.confirmPrintWidgetClickedAction.emit();
    }

    //#endregion [SAV Send Letter]

    // Add customer doublet

    public addCustomer(){
      this.showDialogAddCustomerDoublet = true;

      setTimeout(() => {
          if (this.dialogAddCustomerDoublet) {
              this.dialogAddCustomerDoublet.open();
          }
      }, 50);
      
    }


    public onAddCustomerToDoublet(event :any){
      console.log('Author:minh.lam , file: xn-widget-menu-status.component.ts , line 2307 , XnWidgetMenuStatusComponent , onAddCustomerToDoublet , event', event);
      
    }

}
