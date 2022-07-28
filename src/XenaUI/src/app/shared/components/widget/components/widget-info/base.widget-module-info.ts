import {
    Component, OnInit, Input, Output, OnChanges, SimpleChanges,
    EventEmitter, ViewChild, OnDestroy, ElementRef, Injectable,
    ComponentFactoryResolver, ViewContainerRef, ComponentRef, ViewChildren, QueryList, ChangeDetectorRef,
    forwardRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { MessageModal, FilterModeEnum, PropertyNameOfWidgetProperty, ComboBoxTypeConstant, RepWidgetAppIdEnum } from 'app/app.constants';
import {
    WidgetDetail,
    IListenKeyConfig,
    WidgetPropertyModel,
    IDragDropCommunicationData,
    DragMode,
    WidgetType,
    MessageModel,
    Module,
    FieldFilter,
    TabSummaryModel,
    WidgetState,
    ReloadMode,
    OtherSetting
} from 'app/models';

import {
    ModalService,
    PropertyPanelService,
    DomHandler,
    ScrollUtils,
    TreeViewService,
    WidgetTemplateSettingService,
    DatatableService,
    GlobalSettingService,
    ArticleService, PersonService
} from 'app/services';

import { WidgetUtils } from '../../utils';

import * as wijmo from 'wijmo/wijmo';
import * as wjcInput from 'wijmo/wijmo.input';
import { WijmoGridComponent } from 'app/shared/components/wijmo';
import { PaperworkComponent } from '../paperwork';
import { WidgetTranslationComponent } from '../widget-translation';
import isNil from 'lodash-es/isNil';
import isEmpty from 'lodash-es/isEmpty';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import * as Ps from 'perfect-scrollbar';
import { BaseWidgetModuleInfoMixin } from './mixins';
import { XnWidgetMenuStatusComponent } from '../xn-widget-menu-status';
import { WidgetArticleTranslationDialogComponent } from '../widget-article-translation';
import { WidgetFormComponent } from '../widget-form';
import { XnCountryCheckListComponent, XnCreditCardComponent } from 'app/shared/components/xn-control/';
import { EditingWidget } from 'app/state-management/store/reducer/widget-content-detail';
import { ArticleMediaManagerComponent } from 'app/shared/components/xn-control';
import {
    XnTreeViewComponent
} from 'app/shared/components/xn-control';
import { WidgetRoleTreeGridComponent } from '../widget-role-tree-grid';
import { HistoryContainerComponent } from 'app/shared/components/customer-history';
import { ICommunicationWidget, IWidgetInfo } from '../../components/widget-communication-dialog';
import { WidgetDetailActions, PropertyPanelActions } from 'app/state-management/store/actions';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { XnFileExplorerComponent, XnUploadTemplateFileComponent, FileUploadPopupComponent } from 'app/shared/components/xn-file';
import { Uti } from 'app/utilities';
import { NoteActionEnum } from 'app/models/note.model';

/**
 * BaseWidgetModuleInfo
 */
@Injectable()
export abstract class BaseWidgetModuleInfo extends BaseWidgetModuleInfoMixin {
    @Input() pageId: string;
    @Input() tabHeaderTableFilter: any = null;
    @Input() currentModule: Module;
    @Input() toolbarSetting: any;
    @Input() selectedTabHeader: TabSummaryModel;
    @Input() selectedEntity: any;
    @Input() activeSubModule: Module;
    @Input() showInDialog = false;
    @Input() tabID: string;
    @Input() isExpandedPropertyPanel = false;

    @Input() widgetStates: Array<WidgetState>;
    @Input() reloadMode: ReloadMode = ReloadMode.ListenKey;

    public isToolbarButtonsShowed = false;
    public initwidgetMenuStatusData: any;
    public otherSetting: OtherSetting = new OtherSetting();
    protected currentChartDataSourceObject;
    private eventClick = null;

    // True:  mouse hover in widget box
    // False: mouse hover out widget box
    public hoverBox = false;
    //Toggle: true: maximize, false: restore
    @Input() isMaximized: boolean = undefined;
    public hasJustRestoredFullScreen: boolean = false;//has just restored full screen

    public get data(): WidgetDetail {
        if (this.widgetStates && this.widgetStates.length) {
            const selectedState = this.widgetStates.find(p => p.selected);
            if (selectedState) {
                return selectedState.data;
            }
        }
        return new WidgetDetail();
    };

    // Callback function for communicate between widgets
    public dragDataTransferCallback: any;
    //public isWidgetEdited = false;
    public displayReadonlyGridAsForm: any = false;
    public fieldFilters: Array<FieldFilter>;
    public selectedFilter: FilterModeEnum = FilterModeEnum.ShowAll;
    public selectedSubFilter: FilterModeEnum = FilterModeEnum.ShowAll;
    public layoutPageInfoWidget: any;
    public widgetPropertyEditing: any;

    private _allowDesignEdit: boolean;
    protected editingWidgets: Array<EditingWidget> = [];

    @Input() set allowDesignEdit(status: boolean) {
        this._allowDesignEdit = status;
        this.checkLinkedWidgetStatus();
        if (!status) return;
        this.handleSavSendLetterWidget();
    };

    get allowDesignEdit() {
        return this._allowDesignEdit;
    }

    @Output() onSuccessLinkingWidget = new EventEmitter<WidgetDetail>();
    @Output() onRemoveLinkingWidget = new EventEmitter<any>();
    @Output() onLinkingWidgetClicked = new EventEmitter<any>();
    @Output() onConnectedWidgetLinkHover = new EventEmitter<WidgetDetail>();
    @Output() onConnectedWidgetLinkUnHover = new EventEmitter();
    @Output() onEditingWidget = new EventEmitter<WidgetDetail>();
    @Output() onCancelEditingWidget = new EventEmitter<WidgetDetail>();
    @Output() onSaveSuccessWidget = new EventEmitter<any>();
    @Output() onClickOutsideWidget = new EventEmitter<any>();
    @Output() reloadWidgets = new EventEmitter<Array<WidgetDetail>>();
    @Output() reloadLinkWidgets = new EventEmitter<WidgetDetail>();
    @Output() onSearch = new EventEmitter<boolean>();
    @Output() onExportExcel = new EventEmitter<boolean>();

    @ViewChild(HistoryContainerComponent) historyContainerComponent: HistoryContainerComponent;
    @ViewChild(FileUploadPopupComponent) fileUploadPopupComponent: FileUploadPopupComponent;
    @ViewChild(WidgetArticleTranslationDialogComponent) widgetArticleTranslationDialogComponent: WidgetArticleTranslationDialogComponent;
    @ViewChild(PerfectScrollbarDirective) directiveScroll: PerfectScrollbarDirective;
    @ViewChild(XnWidgetMenuStatusComponent) widgetMenuStatusComponent: XnWidgetMenuStatusComponent;
    @ViewChild('xnFileExplorerComponent') fileExplorerCmp: XnFileExplorerComponent;
    @ViewChildren(XnUploadTemplateFileComponent) xnUploadTemplateFileCmp: QueryList<XnUploadTemplateFileComponent>;
    @ViewChild(ArticleMediaManagerComponent) articleMediaManagerCmp: ArticleMediaManagerComponent;
    @ViewChildren(XnAgGridComponent) widgetAgGridComponents: QueryList<XnAgGridComponent>;
    @ViewChildren(XnTreeViewComponent) xnTreeViewCmps: QueryList<XnTreeViewComponent>;
    @ViewChildren(WidgetRoleTreeGridComponent) widgetTreeGridComponents: QueryList<WidgetRoleTreeGridComponent>;

    // Widget Form Component
    @ViewChildren(forwardRef(() => WidgetFormComponent))
    widgetFormComponents: QueryList<WidgetFormComponent>;

    public abstract handleSavSendLetterWidget();
    public allowWidgetInfoTranslation = false;
    public isRenderWidgetInfoTranslation = false;

    // Used for combination widget : table or form
    // mode = 'form'  : Translate for form widget
    // mode = 'table' : Translate for table widget
    public combinationTranslateMode: string;

    public widgetBorderColor = '';

    get widgetFormComponent(): WidgetFormComponent {
        if (this.widgetFormComponents && this.widgetFormComponents.length) {
            const widgetForm = this.widgetFormComponents.find(p => p.isActivated);
            if (widgetForm) {
                return widgetForm;
            }
        }
        return null;
    }

    // Widget Country Component
    @ViewChildren(XnCountryCheckListComponent)
    widgetCountryComponents: QueryList<XnCountryCheckListComponent>;

    get widgetCountryComponent(): XnCountryCheckListComponent {
        if (this.widgetCountryComponents && this.widgetCountryComponents.length) {
            const countryForm = this.widgetCountryComponents.find(p => p.isActivated);
            if (countryForm) {
                return countryForm;
            }
        }
        return null;
    }

    // Widget Credit Card Component
    @ViewChildren(XnCreditCardComponent)
    creditCardComponents: QueryList<XnCreditCardComponent>;

    get creditCardComponent(): XnCreditCardComponent {
        if (this.creditCardComponents && this.creditCardComponents.length) {
            const widget = this.creditCardComponents.find(p => p.isActivated);
            if (widget) {
                return widget;
            }
        }
        return null;
    }

    // Widget WidgetTranslationComponent
    @ViewChildren(WidgetTranslationComponent)
    widgetTranslationComponents: QueryList<WidgetTranslationComponent>;

    get widgetTranslationComponent(): WidgetTranslationComponent {
        if (this.widgetTranslationComponents && this.widgetTranslationComponents.length) {
            const widget = this.widgetTranslationComponents.find(p => p.isActivated);
            if (widget) {
                return widget;
            }
        }
        return null;
    }

    public scrollStatus: any = {
        top: false,
        left: false,
        right: false,
        bottom: false
    };

    private _scrollUtils: ScrollUtils;
    protected get scrollUtils() {
        if (!this._scrollUtils) {
            this._scrollUtils = new ScrollUtils(this.scrollBodyContainer, this.domHandler);
        }
        return this._scrollUtils;
    }

    public isActiveWidget: boolean;

    /*
    * Check if widget changed data.
    */
    public get isWidgetDataEdited() {
        let isEdited: boolean;
        switch (this.data.idRepWidgetType) {
            case WidgetType.FieldSet:
                if (this.widgetFormComponent) {
                    isEdited = this.widgetFormComponent.isFormChanged;
                }
                break;

            case WidgetType.DataGrid:
            case WidgetType.EditableGrid:
                isEdited = this.isTableEdited;
                break;

            case WidgetType.Combination:
                if (this.widgetFormComponent) {
                    isEdited = this.widgetFormComponent.isFormChanged;
                }
                if (!isEdited) {
                    isEdited = this.isTableEdited;
                }
                break;

            case WidgetType.CombinationCreditCard:
                if (this.widgetFormComponent) {
                    isEdited = this.widgetFormComponent.isFormChanged;
                }
                if (!isEdited) {
                    if (this.creditCardComponent) {
                        isEdited = this.creditCardComponent.isFormChanged;
                    }
                }
                break;

            case WidgetType.Country:
                if (this.widgetCountryComponent) {
                    isEdited = this.widgetCountryComponent.isFormChanged;
                }
                break;

            case WidgetType.Translation:
                if (this.widgetTranslationComponent) {
                    isEdited = this.widgetTranslationComponent.isFormChanged;
                }
                break;

            case WidgetType.TreeView:
                if (this.xnTreeViewComponent) {
                    isEdited = this.xnTreeViewComponent.isFormChanged;
                }
                break;

            case WidgetType.FileTemplate:
                if (this.xnUploadTemplateFileComponent) {
                    isEdited = this.xnUploadTemplateFileComponent.isOnEditting;
                }
                break;
            case WidgetType.NoteForm:
                if (this['widgetNoteFormComponent'] && this['noteFormDataAction'] && !!this['noteFormDataAction'].action) {
                    isEdited = this['noteFormDataAction'].action !== NoteActionEnum.VIEW_MODE;
                }
                break;
        }
        return isEdited;
    };

    public set isWidgetDataEdited(status) {
        switch (this.data.idRepWidgetType) {
            case WidgetType.FieldSet:
                if (this.widgetFormComponent) {
                    this.widgetFormComponent.isFormChanged = status;
                }
                break;

            case WidgetType.DataGrid:
            case WidgetType.EditableGrid:
                this.isTableEdited = status;
                break;

            case WidgetType.Combination:
                if (this.widgetFormComponent) {
                    this.widgetFormComponent.isFormChanged = status;
                }
                this.isTableEdited = status;
                break;

            case WidgetType.CombinationCreditCard:
                if (this.widgetFormComponent) {
                    this.widgetFormComponent.isFormChanged = status;
                }
                if (this.creditCardComponent) {
                    this.creditCardComponent.isFormChanged = status;
                }
                break;

            case WidgetType.Country:
                if (this.widgetFormComponent) {
                    this.widgetCountryComponent.isFormChanged = status;
                }
                break;

            case WidgetType.Translation:
                if (this.widgetTranslationComponent) {
                    this.widgetTranslationComponent.isFormChanged = status;
                }
                break;

            case WidgetType.TreeView:
                if (this.xnTreeViewComponent) {
                    this.xnTreeViewComponent.isFormChanged = status;
                }
                break;

            case WidgetType.FileTemplate:
                if (this.xnUploadTemplateFileComponent) {
                    this.xnUploadTemplateFileComponent.isOnEditting = status;
                }
                break;
        }
    }

    /*
    * Check if widget is edit mode
    */
    public get isWidgetEditMode() {
        let isEditMode: boolean;
        switch (this.data.idRepWidgetType) {
            case WidgetType.FieldSet:
                if (this.widgetFormComponent) {
                    isEditMode = this.widgetFormComponent.editFieldMode || this.widgetFormComponent.editFormMode;
                }
                break;

            case WidgetType.EditableGrid:
                isEditMode = this.isOnEditingTable;
                break;

            case WidgetType.Combination:
                if (this.widgetFormComponent) {
                    isEditMode = this.widgetFormComponent.editFieldMode || this.widgetFormComponent.editFormMode;
                }
                if (!isEditMode) {
                    isEditMode = this.isOnEditingTable;
                }
                break;

            case WidgetType.CombinationCreditCard:
                if (this.widgetFormComponent) {
                    isEditMode = this.widgetFormComponent.editFieldMode || this.widgetFormComponent.editFormMode;
                }
                if (!isEditMode) {
                    if (this.creditCardComponent) {
                        isEditMode = this.creditCardComponent.editMode;
                    }
                }
                break;

            case WidgetType.Country:
                if (this.widgetCountryComponent) {
                    isEditMode = this.widgetCountryComponent.editMode;
                }
                break;

            case WidgetType.Translation:
                if (this.widgetTranslationComponent) {
                    isEditMode = this.widgetTranslationComponent.editMode;
                }
                break;

            case WidgetType.TreeView:
                if (this.xnTreeViewComponent) {
                    isEditMode = this.xnTreeViewComponent.isOnEditTreeView;
                }
                break;

            case WidgetType.FileTemplate:
                if (this.xnUploadTemplateFileComponent) {
                    isEditMode = this.xnUploadTemplateFileComponent.isOnEditting;
                }
                break;
            case WidgetType.EditPaymentType:
                isEditMode = true;
                break;
        }
        return isEditMode;
    };

    /**
     * Get isOnEditingCountry: Edit Mode
     */
    public get isOnEditingCountry() {
        const widgetCountryComponent = this.widgetCountryComponent;
        if (widgetCountryComponent) {
            return widgetCountryComponent.editMode;
        }
        return false;
    }

    constructor(
        protected _eref: ElementRef,
        public store: Store<AppState>,
        public modalService: ModalService,
        public propertyPanelService: PropertyPanelService,
        public widgetUtils: WidgetUtils,
        public treeViewService: TreeViewService,
        public widgetTemplateSettingService: WidgetTemplateSettingService,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected containerRef: ViewContainerRef,
        protected domHandler: DomHandler,
        public datatableService: DatatableService,
        public globalSettingService: GlobalSettingService,
        public articleService: ArticleService,
        public personService: PersonService,
        public ref: ChangeDetectorRef,
        protected widgetDetailActions: WidgetDetailActions,
        public propertyPanelActions: PropertyPanelActions) {
        super(store, widgetUtils, propertyPanelService, modalService, widgetTemplateSettingService, treeViewService, datatableService, globalSettingService, articleService, personService, ref, propertyPanelActions);
        this.dragDataTransferCallback = this.connectWidgetSuccessCallback.bind(this);
    }

    /**
     * Override from abstract class
     */
    get widgetStatesInfo(): Array<WidgetState> {
        return this.widgetStates;
    }

    /**
     * Override from abstract class
     */
    get dataInfo(): WidgetDetail {
        return this.data;
    }

    /**
     * Override from abstract class
     */
    get moduleInfo(): Module {
        return this.currentModule;
    }

    /**
     * Override from abstract class
     */
    get showInDialogStatus(): boolean {
        return this.showInDialog;
    }

    /**
     * Override from abstract class
     */
    get fieldFiltersInfo(): Array<FieldFilter> {
        return this.fieldFilters;
    }

    /**
     * Override from abstract class
     */
    get selectedFilterInfo(): FilterModeEnum {
        return this.selectedFilter;
    }

    /**
     * Override from abstract class
     */
    get selectedSubFilterInfo(): FilterModeEnum {
        return this.selectedSubFilter;
    }

    /**
     * Override from abstract class
     */
    get widgetMenuStatusInfo(): XnWidgetMenuStatusComponent {
        return this.widgetMenuStatusComponent;
    }

    /**
     * Override from abstract class
     */
    get propertiesInfo(): WidgetPropertyModel[] {
        return this.properties;
    }

    /**
     * Override from abstract class
     */
    get tabHeaderTableFilterInfo(): any {
        return this.tabHeaderTableFilter;
    }

    /**
     * Override from abstract class
     */
    get widgetAgGridComponent(): any {
        return this.widgetAgGridComponents;
    }

    /**
     * Override from abstract class
     */
    get widgetTreeGridComponent(): any {
        return this.widgetTreeGridComponents;
    }

    /**
     * Override from abstract class
     */
    get historyContainerGridComponent() {
        return this.historyContainerComponent;
    }

    /**
     * Override from abstract class
     */
    get xnFileExplorerComponent(): any {
        return this.fileExplorerCmp;
    }

    /**
     * Override from abstract class
     */
    get articleMediaManagerComponent(): any {
        return this.articleMediaManagerCmp;
    }

    /**
     * Override from abstract class
     */
    get xnTreeViewComponents(): any {
        return this.xnTreeViewCmps;
    }

    /**
     * Override from abstract class
     */
    get xnUploadTemplateFileComponents(): any {
        return this.xnUploadTemplateFileCmp;
    }


    /**
     * Override from abstract class
     */
    updateWidgetEditedStatus(status: boolean) {
        this.isWidgetDataEdited = status;
    }

    /**
     * Override from abstract class
     */
    cancelEditingWidget(data: WidgetDetail) {
        this.onCancelEditingWidget.emit(data);
    }

    /**
     * Override from abstract class
     */
    saveSuccessWidget(data: WidgetDetail) {
        if (!data) return;
        this.onSaveSuccessWidget.emit(data);
    }

    /**
     * Override from abstract class
     */
    editingWidget(data: WidgetDetail) {
        this.onEditingWidget.emit(data);
    }

    /**
    * Override from abstract class
    */
    get widgetEditedStatus(): boolean {
        return this.isWidgetDataEdited || this.checkCurrentWidgetHasChildrenInEditMode();
    }

    /**
     * Get elementRef
     * @param data
     */
    public get elementRef() {
        return this._eref;
    }

    /**
     * onWidgetEdited
     * Set dirty status of Widget for checking dirty.
     * @param event
     */
    public onWidgetEdited(event): void {
        if (isNil(event) || this.isWidgetDataEdited === event)
            return;
        this.isWidgetDataEdited = event;
        if (event) {
            this.onEditingWidget.emit(this.data);
            this.controlMenuStatusToolButtons(true);
        }
        else
            this.onCancelEditingWidget.emit(this.data);
    }

    /**
     * initConfig
     * Default config set here (icon status, color, UI, ...)
     */
    protected initConfig() {
        this.supportLinkWidget = this.widgetUtils.isSupportLinkWidget(this.data);
    }

    /**
     * connectWidgetSuccessCallback
     * @param data
     */
    public connectWidgetSuccessCallback(data: WidgetDetail) {
        this.linkedSuccessWidget = true;
        this.onSuccessLinkingWidget.emit(this.data);
        this.updateConnectedWidgetStatusProperty(this.data);

        if (this.data.idRepWidgetType == WidgetType.Chart) {
            this.resetChartProperties();
            this.rebuildFieldFiltersForChart();

            this.initwidgetMenuStatusData = {
                ...this.initwidgetMenuStatusData,
                fieldFilters: this.fieldFilters,
            };
        }
    }

    /**
     * checkLinkedWidgetStatus
     */
    protected checkLinkedWidgetStatus() {
        // Check both at design mode or view mode
        if (this.data.widgetDataType) {
            const hasListenKeyAndMainKey = !isNil(this.data.widgetDataType.listenKey)
                && !isEmpty(this.data.widgetDataType.listenKey.key)
                && !isEmpty(this.data.widgetDataType.listenKey.main);

            const standAloneWidget = !isNil(this.data.widgetDataType.listenKey)
                && isEmpty(this.data.widgetDataType.listenKey.key)
                && isEmpty(this.data.widgetDataType.listenKey.main)
                && isEmpty(this.data.widgetDataType.listenKey.sub)
                && (!this.data.widgetDataType.primaryKey || !this.allowDesignEdit);

            const hasConnectedWithParentWidget = this.data.widgetDataType.parentWidgetIds && this.data.widgetDataType.parentWidgetIds.length;
            const hasSyncToSameTypeWidget = this.data.syncWidgetIds && this.data.syncWidgetIds.length;
            this.linkedSuccessWidget = !!(hasConnectedWithParentWidget
                || hasSyncToSameTypeWidget
                || hasListenKeyAndMainKey
                || standAloneWidget);

            if (hasConnectedWithParentWidget) {
                const communicationWidget: ICommunicationWidget = {
                    srcWidgetDetail: this.data,
                    relatingWidgetInfos: [{
                        id: this.data.widgetDataType.parentWidgetIds[0],
                        title: ''
                    }],
                    childrenRelatingWidgetInfos: null,
                    isConnectToMainSupport: null,
                    sameTypeWidgetInfos: null
                };
                this.store.dispatch(this.widgetDetailActions.setConnectForParentFromChildWidget(communicationWidget, this.currentModule));
            }

            if (standAloneWidget && this.allowDesignEdit) {
                this.supportLinkWidget = false;
            }

            if (this.data.idRepWidgetType == WidgetType.SAVSendLetter) {
                if (this.widgetMenuStatusComponent) {
                    this.widgetMenuStatusComponent.managePrintAndConfirmButtonStatus(!this.linkedSuccessWidget, !this.linkedSuccessWidget);
                }
                else {
                    setTimeout(() => {
                        if (this.widgetMenuStatusComponent) {
                            this.widgetMenuStatusComponent.managePrintAndConfirmButtonStatus(!this.linkedSuccessWidget, !this.linkedSuccessWidget);
                        }
                    });
                }
            }
        }
    }

    /**
     * removeLinkWidgetSuccess
     * Override from abstract method of parent
     */
    protected removeLinkWidgetSuccess(notRemoveChildrenConnection?) {
        const parentWidgetIds = this.data.widgetDataType.parentWidgetIds;
        this.data.widgetDataType.listenKey.main = null;
        this.data.widgetDataType.listenKey.sub = null;
        this.data.widgetDataType.parentWidgetIds = [];
        this.data.syncWidgetIds = [];

        if (this.data.idRepWidgetType == WidgetType.Chart) {
            this.resetChartProperties(true);

            this.initwidgetMenuStatusData = {
                ...this.initwidgetMenuStatusData,
                widgetDetail: this.data,
                fieldFilters: this.fieldFilters
            };
        }

        this.onRemoveLinkingWidget.emit({
            widgetDetail: this.data,
            notRemoveChildrenConnection: notRemoveChildrenConnection,
            parentWidgetIds: parentWidgetIds
        });
    }

    protected linkWidgetClicked() {
        this.onLinkingWidgetClicked.emit(this.data);
    }

    /**
     * isWidgetTranslationInEditMode
     * Override from abstract method of parent
     */
    protected isWidgetTranslationInEditMode() {
        if (this.widgetTranslationComponent.editMode || this.isToolbarButtonsShowed) {
            // Turn translate widget to edit mode
            this.controlMenuStatusToolButtons(true);
            setTimeout(() => {
                this.editWidget(1);
            }, 300);

            return true;
        }
        return false;
    }

    /**
     * onWidgetLinkUnHovering
     */
    public onWidgetLinkUnHovering(event) {
        const hasToElement_IsLinkBox = event.toElement && event.toElement.className && event.toElement.className.indexOf('link-box') >= 0;
        const hasRelatedTarget_IsLinkBox = event.relatedTarget && event.relatedTarget.className && event.relatedTarget.className.indexOf('link-box') >= 0;
        if (hasToElement_IsLinkBox || hasRelatedTarget_IsLinkBox) {
            return;
        }
        this.linkedWidgetCoverDisplay = false;
        this.onConnectedWidgetLinkUnHover.emit();
    }

    /**
     * onWidgetLinkHovering
     * @param event
     */
    onWidgetLinkHovering(event) {
        /*
        if (this.linkedSuccessWidget)
        {
            this.linkedWidgetCoverDisplay = true;
            this.onConnectedWidgetLinkHover.emit(this.data);
        }
        */
        this.onConnectedWidgetLinkHover.emit(this.data);
    }

    /**
     * onUpdateTranslationWidget
     */
    onUpdateTranslationWidget(dragDropCommunicationData: IDragDropCommunicationData) {
        // this.data.extensionData = dragDropCommunicationData;
        this.onSuccessLinkingWidget.emit(this.data);
    }

    /**
     * printWidget
     */
    public printWidget(): void {
        const factory = this.componentFactoryResolver.resolveComponentFactory(PaperworkComponent);
        var componentRef: ComponentRef<PaperworkComponent> = this.containerRef.createComponent(factory);
        const paperworkComponent: PaperworkComponent = componentRef.instance;
        paperworkComponent.registerWidgetModuleInfo(this);
        paperworkComponent.print();
        componentRef.destroy();
    }

    public isOpeningOnPopup = false;
    public openNewWindow() {
        Uti.openPopupCenter('/widget?pageId=' + this.pageId + '&widgetId=' + this.data.id + '&moduleId=' + this.currentModule.idSettingsGUI, 'Widget Standalone', 1280, 700);
        this.isOpeningOnPopup = true;
    }

    public search(event) {
        this.onSearch.emit(event);
    }

    public exportExcel(event) {
        this.onExportExcel.emit(event);
    }

    /**
     * scrollBodyContainer of widget
     */
    public get scrollBodyContainer() {
        if (this.directiveScroll) {
            return this.directiveScroll.elementRef.nativeElement;
        }
        return null;
    }

    /**
     * onScroll
     * @param mode
     */
    onScroll(mode) {
        if (mode) {
            if (this.agGridComponent) {
                this.agGridComponent.scrollToPosition(mode);
            }
        }
    }

    /**
     * onScrollHover
     * @param mode
     */
    onScrollHover(mode) {
        if (mode) {
            if (this.agGridComponent) {
                this.agGridComponent.scrollHover(mode);
            }
        }
    }

    /**
     * onScrollUnHover
     * @param mode
     */
    onScrollUnHover(mode) {
        if (mode) {
            if (this.agGridComponent) {
                this.agGridComponent.scrollUnHover(mode);
            }
        }
    }

    /**
     * onClickOutside
     * @param event
     */
    onClickOutside(event: any) {
        this.eventClick = event;
        if (this.widgetPropertyEditing && this.propertyPanelService.isDirty(this.widgetPropertyEditing.widgetProperties)) {
            if (!event.value && this.widgetPropertyEditing.widgetProperties != this.properties) {
                this.store.dispatch(this.propertyPanelActions.requestClearProperties(this.currentModule));
            }
        }
        else {
            this.afterCheckDirtyWhenClickOutSide();
        }
        // if (this.propertyPanelService.isDirty(this.properties) && this.isChildOfWidgetModuleInfo(event.target)) {
        //     this.store.dispatch(this.propertyPanelActions.requestClearProperties(this.currentModule));
        // } else {
        //     this.afterCheckDirtyWhenClickOutSide();
        // }
    }

    private isChildOfWidgetModuleInfo(target: any): boolean {
        if (!target ||
            !target.parentElement) return false;
        if ((target.className ? target.className : '').indexOf('xn-widget-module-info') > -1 ||
            (target.parentElement && target.parentElement.className.indexOf('xn-widget-module-info') > -1)) {
            return true;
        }
        return this.isChildOfWidgetModuleInfo(target.parentElement);
    }

    protected afterCheckDirtyWhenClickOutSide() {
        // Outside
        if (this.eventClick && this.eventClick['value'] === true) {
            if (!this.isClickInsideSpecialCase(this.eventClick.target)) {
                // console.log('Outside');
                if (!this.isRenderWidgetInfoTranslation) {
                    if (this.isMaximized) {
                        this.isActiveWidget = true;
                        this.hoverBox = true;
                    }
                    else {
                        this.isActiveWidget = false;
                        if (this.hasJustRestoredFullScreen) {
                            this.hoverBox = true;
                            this.hasJustRestoredFullScreen = false;
                        }
                        else {
                            this.hoverBox = false;
                        }
                    }
                    this.onClickOutsideWidget.emit({
                        widgetApp: this.data.idRepWidgetApp,
                        isActive: this.isActiveWidget,
                        id: this.data.id
                    });
                    this.widgetBorderColor = '';
                    this.reattach();
                    if (!this.isWidgetEditMode) {
                        this.detach();
                    }
                    this.store.dispatch(this.widgetDetailActions.activeWidget(null, this.currentModule));
                }
            }
            else {
                this.reattach();
            }
        }
        // Inside
        else {
            // console.log('Inside');
            this.isActiveWidget = true;
            this.onClickOutsideWidget.emit({
                widgetApp: this.data.idRepWidgetApp,
                isActive: this.isActiveWidget,
                id: this.data.id
            });
            this.reattach();
            // Use timeout here to ensure all other widgets is inactived before active for this widget
            setTimeout(() => {
                this.store.dispatch(this.widgetDetailActions.activeWidget(this.data, this.currentModule));
            });
        }

        if (this.isMaximized) {
            this.hoverBox = true;
        }
        $('.xn-tooltip-d').remove();
    }

    /**
     * isClickInsideSpecialCase
     */
    private isClickInsideSpecialCase(target) {
        let iRet: boolean = false;
        const selectorArray = [
            'wj-popup.menu-widget-status-ddl',
            'wj-popup.edit-widget-ddl',
            '.ui-widget-overlay',
            '.ui-dialog',
            'widget-translate',
            '.property-panel',
            '.widget-combination-translation'
        ];

        for (let i = 0; i < selectorArray.length; i++) {
            let node = this.domHandler.findParent(target, selectorArray[i]);
            if (node && node.length > 0) {
                iRet = true;
                break;
            }
        }
        return iRet;
    }

    /**
     * onTreeViewExpandWidget
     * @param event
     */
    public onTreeViewExpandWidget(event: any) {
        if (this.xnTreeViewComponent) {
            this.xnTreeViewComponent.setExpandForTree(event);
        }
        if (this.agGridComponent) {
            if (event) {
                this.agGridComponent.collapseGroupsToLevel(1);
            }
            else {
                this.agGridComponent.collapseGroupsToLevel(0);
            }
        }
    }

    /**
     * onWidgetHover
     * @param $event
     */
    public onWidgetHover($event) {
        this.reattach();
        //console.log('onWidgetHover');
    }

    /**
     * onWidgetLeave
     * @param $event
     */
    public onWidgetLeave($event) {
        if (!this.isClickInsideSpecialCase($event.toElement)) {
            //console.log('onWidgetLeave');
            if (!this.isWidgetEditMode) {
                this.detach();
            }
            //setTimeout(() => {
            //    this.ref.detach();
            //});
        }
        else {
            this.reattach();
        }

        if (this.isMaximized) {
            this.hoverBox = true;
        }
    }

    /**
     * reattach
     */
    public reattach() {
        //console.log('reattach id:' + this.data.id);
        this.ref.reattach();
    }

    /**
     * detach
     */
    public detach(timeOut?: number) {
        if (this.isWidgetEditMode || this.widgetUtils.isIgnoreDetachWidget(this.data)) {
            return;
        }
        if (timeOut) {
            setTimeout(() => {
                this.ref.detach();
                //console.log('detach timeOut :' + this.data.id);
            }, timeOut);
        }
        else {
            setTimeout(() => {
                this.ref.detach();
                //console.log('detach :' + this.data.id);
            });
        }
    }

    /**
     * isWidgetCompletedRender
     */
    public isWidgetCompletedRender() {
        this.reattach();
        this.detach(500);
    }

    /**
     * checkCurrentWidgetHasChildrenInEditMode
     */
    public checkCurrentWidgetHasChildrenInEditMode() {
        let isFound = false;
        if (this.editingWidgets && this.editingWidgets.length && this.data.widgetDataType.primaryKey) {
            const primaryKeys: Array<string> = this.data.widgetDataType.primaryKey.split(',');
            this.editingWidgets.forEach((editingWidget: EditingWidget) => {
                const listenKeys: Array<string> = editingWidget.widgetDetail.widgetDataType.listenKey.key.split(',');
                const parentWidgetIds: Array<string> = editingWidget.widgetDetail.widgetDataType.parentWidgetIds;
                if (parentWidgetIds) {
                    let count = 0;
                    if (listenKeys && listenKeys.length) {
                        listenKeys.forEach(key => {
                            const iRet = primaryKeys.find(p => p == key);
                            if (iRet) {
                                count++;
                            }
                        });
                        let foundParent = parentWidgetIds.find(p => p == this.data.id);
                        if (count && count == primaryKeys.length && foundParent) {
                            isFound = true;
                        }
                    }
                }
            });
        }
        return isFound;
    }

    private resetChartProperties(alsoClearData?: boolean) {
        this.fieldFilters = [];
        this.widgetMenuStatusComponent.fieldFilters = [];
        this.widgetMenuStatusComponent.isInitDisplayFields = false;
        this.currentChartDataSourceObject = null;

        if (alsoClearData) {
            this.data.contentDetail = null;
        }

        this.clearChartProperties(this.properties, 'SingleXSerie');
        this.clearChartProperties(this.properties, 'SingleYSerie');
        this.clearChartProperties(this.properties, 'MultiXSerie');
        this.clearChartProperties(this.properties, 'MultiYSeries', true);
        this.clearChartProperties(this.properties, 'ComboSingleXSerie');
        this.clearChartProperties(this.properties, 'ComboSingleYSerie');
        this.clearChartProperties(this.properties, 'ComboMultiXSerie');
        this.clearChartProperties(this.properties, 'ComboMultiYSeries', true);

        let dataSourceObject: WidgetPropertyModel = this.propertyPanelService.getItemRecursive(this.properties, ComboBoxTypeConstant.chartDataSourceObject, PropertyNameOfWidgetProperty.ComboboxStoreObject);
        if (dataSourceObject) {
            dataSourceObject.value = null;
        }
    }

    private clearChartProperties(properties, propName, isMultiCombobox?: boolean) {
        let prop = this.propertyPanelService.getItemRecursive(this.properties, propName);
        if (prop) {
            prop.options = [];
            prop.value = isMultiCombobox ? [] : null;
        }
    }

    private rebuildFieldFiltersForChart() {
        Object.keys(this.data.contentDetail.columnSettings).forEach((key) => {
            this.fieldFilters.push(new FieldFilter({
                fieldDisplayName: this.data.contentDetail.columnSettings[key].ColumnName,
                fieldName: this.data.contentDetail.columnSettings[key].OriginalColumnName,
                selected: false,
                isHidden: false,
                isEditable: false
            }));
        });
    }
}

