import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
    EventEmitter,
    ViewChildren,
    QueryList,
    ElementRef,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    AfterViewInit,
    HostListener,
    ViewChild,
    forwardRef,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
    ControlType,
    Configuration,
    SignalRActionEnum,
    SignalRJobEnum,
    DefaultWidgetItemConfiguration,
    TypeForm,
} from "app/app.constants";
import { Uti } from "app/utilities/uti";
import {
    ControlBase,
    TextboxControl,
    DropdownControl,
    CheckboxControl,
    DateControl,
    WidgetDetail,
    ButtonControl,
    NumberBoxControl,
    TextboxMaskControl,
    SignalRNotifyModel,
} from "app/models";
import {
    CommonService,
    ObservableShareService,
    PropertyPanelService,
    AppErrorHandler,
    SignalRService,
    WidgetFieldService,
    ModalService,
} from "app/services";
import { InlineEditComponent } from "../inline-edit";
import { Subscription } from "rxjs/Subscription";
import {
    ComboBoxTypeConstant,
    FilterModeEnum,
    SignalRTypenEnum,
    WidgetFormTypeEnum,
} from "app/app.constants";
import { Observable } from "rxjs/Observable";
import { FieldFilter, ApiResultResponse, User } from "app/models";
import { parse } from "date-fns/esm";
import { DatePipe } from "@angular/common";
import isNil from "lodash-es/isNil";
import isEmpty from "lodash-es/isEmpty";
import { BaseWidget } from "app/pages/private/base";
import cloneDeep from "lodash-es/cloneDeep";
import { WfColumnComponent } from "app/shared/components/widget/components/widget-form";
import { DragulaService } from "ng2-dragula";
import {
    SettingDialogComponent,
    WfPanelComponent,
    WfFieldComponent,
} from "app/shared/components/widget/components/widget-form";

@Component({
    selector: "widget-form",
    styleUrls: ["./widget-form.component.scss"],
    templateUrl: "./widget-form.component.html",
    host: {
        "(window:resize)": "resizeEventHandler()",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetFormComponent
    extends BaseWidget
    implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
    @Input()
    dataSource: WidgetDetail;
    @Input() isSAVLetter: boolean;

    // If true , this form is displaying on Widget
    private _isActivated: boolean;
    @Input() set isActivated(status: boolean) {
        this._isActivated = status;
        if (!status) {
            this.ref.detach();
        } else {
            this.ref.reattach();
        }
    }

    get isActivated() {
        return this._isActivated;
    }

    @Input()
    filterMode: FilterModeEnum;
    @Input() backgroundColor: any = "";
    @Input() backgroundImage: any = "";

    @Input()
    fieldFilters: Array<FieldFilter>;

    @Input() readonly = false;

    @Input() isDialogMode = false;
    @Input() isEditingLayout = false;

    @Input() set formType(formType: WidgetFormTypeEnum) {
        if (!isNil(formType)) {
            this.widgetFormType = formType;

            setTimeout(() => {
                this.getContainerHeight();
            });

            setTimeout(() => {
                this.activateVirtualContainer(this.resizedNumber, true);
            }, 500);
        }
    }

    @Input() formStyle: any = {
        labelStyle: {},
        dataStyle: {},
    };

    @Input() designColumnsOnWidget: boolean;

    @Input() inlineLabelStyle: any = {};

    @Input() importantFormStyle: any = {
        labelStyle: {},
        dataStyle: {},
        fields: {},
    };

    @Input() set resized(input: string) {
        if (!this.resizedNumber && input) this.resizedNumber = input;
        setTimeout(() => this.activateVirtualContainer(input));
    }

    @Input() set controlUpdated(data: SignalRNotifyModel) {
        this.executeControlUpdated(data);
    }

    @Input() fieldStyle: {
        [key: string]: {
            labelStyle: {};
        };
    }; // { 'IdPersonInterface' : { 'labelStyle' : {} };

    @Input() dataStyle: {
        [key: string]: {
            dataStyle: {};
        };
    }; // { 'IdPersonInterface' : { 'dataStyle' : {} };

    @Input() isDesignWidgetMode = false;
    @Input() isForceReset = false;
    @Input() globalProperties: any[] = [];
    @Input() widgetProperties: any[] = [];

    private _supportDOBCountryFormat;
    @Input() set supportDOBCountryFormat(status) {
        this._supportDOBCountryFormat = status;
        this.updateDateOfBirthFormatByCountryCode();
    }

    get supportDOBCountryFormat() {
        return this._supportDOBCountryFormat;
    }

    @Output()
    onEditFormField: EventEmitter<any> = new EventEmitter();

    @Output()
    onCancelEditFormField: EventEmitter<any> = new EventEmitter();

    @Output()
    onFormChanged: EventEmitter<any> = new EventEmitter();

    @Output() onShowCreditCardSelectionAction = new EventEmitter<any>();
    @Output() formLoaded = new EventEmitter<any>();
    @Output() onPdfFieldClick = new EventEmitter<any>();
    @Output() onTrackingFieldClick = new EventEmitter<any>();
    @Output() downloadClick = new EventEmitter<any>();
    @Output() deleteClick = new EventEmitter<any>();
    @Output() onReturnRefundFieldClick = new EventEmitter<any>();
    @Output() isChangeColumnLayoutAction = new EventEmitter<any>();
    @Output() saveColumnLayoutAction = new EventEmitter<any>();
    @Output() callRenderScrollAction = new EventEmitter<any>();
    @Output() fieldDragEndAction = new EventEmitter<any>();
    @Output() onApplyAction = new EventEmitter<any>();
    @Output() onColumnResizeEndAction = new EventEmitter<any>();
    @Output() onHiddenSettingForm = new EventEmitter<any>();
    @Output() makeTempPropertiesAction = new EventEmitter<any>();

    // @ViewChildren(InlineEditComponent)
    // private wfFieldComponents: QueryList<InlineEditComponent>;

    private wfFieldComponents: Array<WfFieldComponent> = [];

    @ViewChildren(forwardRef(() => WfColumnComponent))
    private wfColumnComponents: QueryList<WfColumnComponent>;
    @ViewChild("settingDialogComponent")
    settingDialogComponent: SettingDialogComponent;

    private resizedNumber: string = null;
    private groupContentListOld: Array<ControlBase<any>> = [];
    private groupContentList: Array<ControlBase<any>> = [];
    private listEditingFields: Array<string> = [];
    private ratioConvertFontSizeToPixcel = 7;
    public labelTextAlign = "";
    public dataTextAlign = "";
    private commonServiceSubscription: Subscription;
    private globalDateFormat: string;
    private consts: Configuration;

    /* DB const: Specific case for changing country*/
    private SharingAddressIdRepIsoCountryCodeField =
        "B00SharingAddress_IdRepIsoCountryCode";
    private CountryCodeSharingAddressHiddenField =
        "B00RepIsoCountryCode_SharingAddressHiddenFields";
    private B00SharingAddressZipField = "B00SharingAddress_Zip";
    private B00SharingAddressZip2Field = "B00SharingAddress_Zip2";
    private B00PersonMasterData_DateOfBirth = "B00PersonMasterData_DateOfBirth";
    private SharingAddressHiddenFields = "sharingAddressHiddenFields";
    private ValidationZip2MaskFormatField = "validationZip2MaskFormat";
    private ValidationZip2RegExField = "validationZip2RegEx";
    private ValidationZipMaskFormatField = "validationZipMaskFormat";
    private ValidationZipRegExField = "validationZipRegEx";

    // Form group data
    form: FormGroup;
    originalFormValues: any;

    _editFormMode = false;
    set editFormMode(val: boolean) {
        this._editFormMode = val;

        this.subscribeFormChange();
        if (this._editFormMode) {
            setTimeout(() => {
                this.queryWfFieldComponentsComponent();
            }, 500);
        }
        this.ref.markForCheck();
    }

    get editFormMode() {
        return this._editFormMode;
    }

    _editFieldMode = false;
    set editFieldMode(val: boolean) {
        this._editFieldMode = val;
        this.ref.markForCheck();
    }

    get editFieldMode() {
        return this._editFieldMode;
    }

    _editLanguageMode = false;
    set editLanguageMode(val: boolean) {
        this._editLanguageMode = val;
        this.ref.markForCheck();
    }

    get editLanguageMode() {
        return this._editLanguageMode;
    }

    containerHeight = 0;

    private xnComStateSubcription: Subscription;
    private undisplayFieldList: Array<string> = [];

    private minWidthContainerLabel = 0;
    private minWidthContainer = 0;
    private controlWidth = 0;
    private widgetFormType: WidgetFormTypeEnum = WidgetFormTypeEnum.List;
    private defaultLengthDisplay = 5;
    private minLabelWidth = 100;
    private numberOfVisibleControls = 0;
    private org_numberOfVisibleControls = 0;

    public isFormChanged: boolean;
    public errorShow: boolean;
    public isDuplicatedDialogForm = false;

    constructor(
        private commonService: CommonService,
        private datePipe: DatePipe,
        private _eref: ElementRef,
        private ref: ChangeDetectorRef,
        protected obserableShareService: ObservableShareService,
        private propertyPanelService: PropertyPanelService,
        private appErrorHandler: AppErrorHandler,
        private signalRService: SignalRService,
        private dragulaService: DragulaService,
        private widgetFieldService: WidgetFieldService,
        private _modalService: ModalService,
        private uti: Uti
    ) {
        super();
        this.consts = new Configuration();
        this.registerDragDropItem();
        this.widgetFieldService.currentDuplicatedFieldsDialogs.subscribe(
            (value) => (this.isDuplicatedDialogForm = value)
        );
    }

    public ngOnInit() {}

    ngOnDestroy() {
        Uti.unsubscribe(this);
        this.signalRDisconnectEditing();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            !changes["importantFormStyle"] &&
            !changes["dataSource"] &&
            !changes["filterMode"] &&
            !changes["fieldFilters"] &&
            !changes["editFormMode"] &&
            !changes["isEditingLayout"]
        )
            return;

        const hasChanges =
            this.hasChanges(changes["dataSource"]) ||
            this.hasChanges(changes["filterMode"]) ||
            this.hasChanges(changes["fieldFilters"]);

        if (hasChanges && this.dataSource) {
            // Only redraw data if Form has not updated yet.
            if (
                (!this.isFormChanged &&
                    !this.editFieldMode &&
                    !this.editFormMode) ||
                this.isForceReset
            ) {
                this.processData();
                this.resetToViewMode();
                if (this.isDialogMode) this.editFormMode = true;
                this.ref.markForCheck();
            }
            if (this.isForceReset) {
                this.signalRDisconnectEditing();
            }
        }

        if (this.hasChanges(changes["importantFormStyle"])) {
            this.calculateMinLabelWidth();
            setTimeout(() => {
                this.activateVirtualContainer(this.resizedNumber, true);
            }, 500);
            this.ref.markForCheck();
        }
        this.setTextAlign();

        if (this.hasChanges(changes["globalProperties"])) {
            this.globalDateFormat =
                this.propertyPanelService.buildGlobalDateFormatFromProperties(
                    changes["globalProperties"].currentValue
                );
        }

        this.changeIsEditingLayout(changes);
    }

    public updateProperties() {
        this.wfFieldComponents.forEach((wfFieldComponent) => {
            wfFieldComponent.updateProperties();
        });
    }

    /**
     * setTextAlign
     */
    private setTextAlign() {
        // Set Global align
        this.labelTextAlign = this.formStyle.labelStyle["text-align"] || "";
        this.dataTextAlign = this.formStyle.dataStyle["text-align"] || "";

        // Set each field label align
        if (this.fieldStyle && this.groupContentList.length) {
            Object.keys(this.fieldStyle).forEach((key) => {
                const rs = this.groupContentList.filter((p) => p.key == key);
                if (rs.length) {
                    rs[0].labelAlign =
                        this.fieldStyle[key].labelStyle["text-align"] || "";
                }
            });
        }

        // Set each field data align
        if (this.dataStyle && this.groupContentList.length) {
            Object.keys(this.dataStyle).forEach((key) => {
                const rs = this.groupContentList.filter((p) => p.key == key);
                if (rs.length) {
                    rs[0].align =
                        this.dataStyle[key].dataStyle["text-align"] || "";
                }
            });
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.formLoaded.emit(true);
        }, 200);
    }

    resetValue(isResetEditing?: boolean): void {
        if (this.formChangeSubscribeSubcription)
            this.formChangeSubscribeSubcription.unsubscribe();
        this.queryWfFieldComponentsComponent();
        this.wfFieldComponents.forEach((wfFieldComponent) => {
            wfFieldComponent.reset(isResetEditing);
        });

        this.ref.markForCheck();
        this.subscribeFormChange();
    }

    updatePreValue(): void {
        this.queryWfFieldComponentsComponent();
        this.wfFieldComponents.forEach((wfFieldComponent) => {
            wfFieldComponent.updatePrevalue();
        });

        this.ref.markForCheck();
    }

    private onEditInlinePrevalue(event) {}

    private onSavePrevalue(event) {}

    private processData(): void {
        if (!this.dataSource) {
            return;
        }
        this.form = null;

        if (this.dataSource && this.dataSource.contentDetail) {
            if (
                this.dataSource.contentDetail.data &&
                this.dataSource.contentDetail.data.length > 0
            ) {
                const widgetInfo = this.dataSource.contentDetail.data;
                const contentList: Array<any> = widgetInfo[1];
                if (!contentList) {
                    return;
                }
                this.buildGroupList(contentList);
                this.customControl();
                this.createFormGroup();

                setTimeout(() => {
                    this.getContainerHeight();
                    this.calculateMinLabelWidth();
                });

                setTimeout(() => {
                    this.activateVirtualContainer(this.resizedNumber, true);
                }, 500);
            }
        }
    }

    /**
     * Custom some specific of controls such as : format date, hidden fields ...
     **/
    private customControl() {
        this.setHiddenFieldsByDefaultCountryCode();
        this.setValueDataForControl();
    }

    /**
     * setHiddenFieldsByDefaultCountryCode
     */
    private setHiddenFieldsByDefaultCountryCode() {
        if (this.groupContentList && this.groupContentList.length) {
            const hiddenControl = this.groupContentList.find(
                (p) => p.key == this.CountryCodeSharingAddressHiddenField
            );
            if (hiddenControl && hiddenControl.value) {
                const hiddenValues: Array<string> = (
                    hiddenControl.value as string
                ).split(";");
                this.setHiddenFields(hiddenValues);
            }
        }
    }

    /**
     * setHiddenFields
     * @param hiddenValues
     */
    private setHiddenFields(hiddenFieldValues: Array<any>) {
        if (!hiddenFieldValues || !this.groupContentList) {
            return;
        }
        hiddenFieldValues.forEach((value: string) => {
            if (value) {
                const targetHiddenControl = this.groupContentList.find((p) => {
                    const arr: Array<any> = p.key.split("_");
                    let hiddenField = arr[0];
                    if (arr.length > 1) {
                        hiddenField = arr[1];
                    }
                    return hiddenField.toLowerCase() == value.toLowerCase();
                });
                if (targetHiddenControl) {
                    targetHiddenControl.isHidden = true;
                }
            }
        });
    }

    public syncFormDataToDataSource() {
        if (this.dataSource && this.dataSource.contentDetail) {
            if (this.dataSource.contentDetail.data.length > 0) {
                const widgetInfo = this.dataSource.contentDetail.data;
                const contentList: Array<any> = widgetInfo[1];
                const controls: ControlBase<any>[] = this.groupContentList;
                contentList.forEach((content) => {
                    const rs = controls.filter(
                        (c) => c.key === content.OriginalColumnName
                    );
                    if (rs.length > 0) {
                        const control: ControlBase<any> = rs[0];
                        content.Value = control.value;
                        if (control.controlType === "dropdown") {
                            content.Value = (
                                control as DropdownControl
                            ).displayValue;
                        }
                    }
                });
            }
        }
    }

    private formChangeSubscribeSubcription: Subscription;
    private createFormGroup() {
        const controls: ControlBase<any>[] = this.groupContentList;
        this.toFormGroup(controls)
            .finally(() => {
                this.emitCompletedRenderEvent();
            })
            .subscribe((form) => {
                this.appErrorHandler.executeAction(() => {
                    this.form = form;
                    this.originalFormValues = Object.assign({}, form.value);
                    this.updateDateOfBirthFormatByCountryCode();
                    this.ref.markForCheck();
                    this.signalRIsThereAnyoneEditing();
                });
            });
    }

    private subscribeFormChangeTimeout: any;
    private subscribeFormChange() {
        if (!this.form) return;
        clearTimeout(this.subscribeFormChangeTimeout);
        this.subscribeFormChangeTimeout = null;
        this.subscribeFormChangeTimeout = setTimeout(() => {
            if (this.formChangeSubscribeSubcription)
                this.formChangeSubscribeSubcription.unsubscribe();

            if (!this.form) return;

            this.formChangeSubscribeSubcription = this.form.valueChanges
                .debounceTime(300)
                .subscribe((data) => {
                    this.appErrorHandler.executeAction(() => {
                        if (this.editFieldMode || this.editFormMode) {
                            if (
                                JSON.stringify(this.originalFormValues) !==
                                JSON.stringify(this.form.value)
                            ) {
                                this.onFormChanged.emit(true);
                                this.isFormChanged = true;
                            } else {
                                this.onFormChanged.emit(false);
                                this.isFormChanged = false;
                            }
                            this.ref.markForCheck();
                        }
                        this.broastCastSignalRMessage();
                    });
                });

            if (this.editFieldMode || this.editFormMode) {
                if (
                    JSON.stringify(this.originalFormValues) !==
                    JSON.stringify(this.form.value)
                ) {
                    this.onFormChanged.emit(true);
                    this.isFormChanged = true;
                } else {
                    this.onFormChanged.emit(false);
                    this.isFormChanged = false;
                }
            }
        }, 500);
    }

    /**
     * updateOriginalFormValues
     */
    public updateOriginalFormValues() {
        this.originalFormValues = Object.assign({}, this.form.value);
    }

    private broastCastSignalRMessage() {
        if (
            !Configuration.PublicSettings.enableSignalR ||
            !Configuration.PublicSettings.enableSignalRForWidgetDetail
        )
            return;

        if (!this.form.dirty) return;
        const fieldsChanged = this.filterValidFormField();
        this.notifyFields = [];

        for (const controlName in fieldsChanged) {
            if (this.undisplayFieldList.indexOf(controlName) > -1) continue;
            this.notifyFields.push({
                fieldName: controlName,
                fieldValue: fieldsChanged[controlName],
            });
        }
        this.mapValueToTextForFiedl();
        if (!this.notifyFields.length) {
            this.signalRDisconnectEditing();
        } else {
            this.signalRConnectEditing();
        }
    }

    private mapValueToTextForFiedl() {
        if (!this.notifyFields || !this.notifyFields.length) return;
        for (const item of this.notifyFields) {
            const control = this.groupContentList.find(
                (x) => x.key === item.fieldName
            );
            if (!(control instanceof DropdownControl)) continue;
            for (const opt of control["options"]) {
                if (opt.key != item.fieldValue) continue;
                item.fieldValue = opt.value;
                break;
            }
        }
    }

    private hasChanges(changes) {
        return (
            changes &&
            changes.hasOwnProperty("currentValue") &&
            changes.hasOwnProperty("previousValue")
        );
    }

    private getValidCombobox(listComboBox: any, identificationKey: any) {
        const keys = Object.keys(ComboBoxTypeConstant);
        let idx: string;
        keys.forEach((key) => {
            // TODO
            if (ComboBoxTypeConstant[key] == identificationKey) {
                idx = key;
            }
        });

        if (!idx) {
            idx = identificationKey;
        }

        return listComboBox[idx];
    }

    /**
     * Create Form Group
     * @param controls
     */
    toFormGroup(controls: ControlBase<any>[]) {
        const group: any = {};

        // Find all drop-down control
        let comboBoxes: DropdownControl[] = controls.filter(
            (p) => p.controlType === "dropdown"
        ) as DropdownControl[];

        if (comboBoxes.length > 0) {
            const filterByComboboxes = comboBoxes.filter((p) => p.filterBy);
            comboBoxes = comboBoxes.filter((p) => !p.filterBy);

            const key = comboBoxes.map((p) => p.identificationKey).join(",");
            const observable = this.commonService.getListComboBox(key);
            this.obserableShareService.setObservable(key, observable);

            const observable$ = this.obserableShareService.getObservable(key);

            return observable$.map((response: ApiResultResponse) => {
                if (!Uti.isResquestSuccess(response)) {
                    return;
                }
                for (let k = 0; k < comboBoxes.length; k++) {
                    const comboOptions = this.getValidCombobox(
                        response.item,
                        comboBoxes[k].identificationKey
                    );
                    if (comboOptions) {
                        const options: Array<any> = [];
                        let idValue: number = null;
                        for (let i = 0; i < comboOptions.length; i++) {
                            if (
                                comboBoxes[k].key ===
                                this.SharingAddressIdRepIsoCountryCodeField
                            ) {
                                options.push({
                                    key: comboOptions[i].idValue,
                                    value: comboOptions[i].textValue,
                                    isoCode: comboOptions[i].isoCode,
                                    sharingAddressHiddenFields:
                                        comboOptions[i][
                                            this.SharingAddressHiddenFields
                                        ],
                                    validationZip2MaskFormat:
                                        comboOptions[i][
                                            this.ValidationZip2MaskFormatField
                                        ],
                                    validationZip2RegEx:
                                        comboOptions[i][
                                            this.ValidationZip2RegExField
                                        ],
                                    validationZipMaskFormat:
                                        comboOptions[i][
                                            this.ValidationZipMaskFormatField
                                        ],
                                    validationZipRegEx:
                                        comboOptions[i][
                                            this.ValidationZipRegExField
                                        ],
                                });
                            } else {
                                options.push({
                                    key: comboOptions[i].idValue,
                                    value: comboOptions[i].textValue,
                                });
                            }
                            if (
                                comboOptions[i].textValue ===
                                comboBoxes[k].displayValue
                            ) {
                                idValue = comboOptions[i].idValue;
                            }
                        }
                        comboBoxes[k].options = options;
                        if (idValue) {
                            comboBoxes[k].value = "" + idValue;
                        }
                        this.updateDatasourceForCombobox(comboBoxes[k]);
                    }
                }
                if (filterByComboboxes.length > 0) {
                    filterByComboboxes.forEach((filterByCombobo) => {
                        this.loadDataForDependDropdown(
                            filterByCombobo,
                            controls
                        );
                    });
                }
                controls.forEach((control) => {
                    group[control.key] = new FormControl(
                        isNil(control.value) ? "" : control.value
                    );
                    const arr = [];
                    if (control.required) {
                        arr.push(Validators.required);
                    }
                    if (control.pattern && control.pattern.length)
                        arr.push(
                            Validators.pattern(new RegExp(control.pattern))
                        );
                    (<FormControl>group[control.key]).validator =
                        Validators.compose(arr);
                    (<FormControl>group[control.key]).updateValueAndValidity();
                });
                return new FormGroup(group);
            });
        }
        controls.forEach((control) => {
            group[control.key] = new FormControl(control.value || "");
            const arr = [];
            if (control.required) {
                arr.push(Validators.required);
            }
            if (control.pattern && control.pattern.length)
                arr.push(Validators.pattern(new RegExp(control.pattern)));
            (<FormControl>group[control.key]).validator =
                Validators.compose(arr);
            (<FormControl>group[control.key]).updateValueAndValidity();
        });
        return Observable.of(new FormGroup(group));
    }

    private isHiddenFieldByService(
        fieldName: string,
        checkList: Array<string>
    ) {
        const rs: Array<string> = checkList.filter(
            (s) => fieldName.indexOf(s) >= 0
        );
        return rs.length > 0;
    }

    private isHiddenFieldByFilterMode(content) {
        let isHidden = false;
        // Filter Data
        switch (this.filterMode) {
            case FilterModeEnum.HasData:
                if (!content.Value) {
                    isHidden = true;
                }
                break;

            case FilterModeEnum.EmptyData:
                if (content.Value) {
                    isHidden = true;
                }
                break;
            default:
                break;
        }
        return isHidden;
    }

    private isHiddenFieldByFieldFilter(content) {
        let isHidden = false;
        const displayFields: Array<FieldFilter> = this.fieldFilters.filter(
            (p) => p.selected === true
        );
        const displayContent = displayFields.filter(
            (p) => p.fieldName === content.OriginalColumnName
        );
        if (displayContent.length === 0) {
            isHidden = true;
        }
        return isHidden;
    }

    /**
     * buildGroupList
     * @param contentList
     */
    private buildGroupList(contentList): void {
        this.numberOfVisibleControls = 0;
        this.groupContentListOld = cloneDeep(this.groupContentList);
        this.undisplayFieldList = [];
        this.groupContentList = [];
        for (let i = 0; i < contentList.length; i++) {
            const itemContent = contentList[i];
            let _isHidden = false;
            let identificationKey = 0;
            let filterBy: string;
            let groupName: string;
            let isReadOnly = false;
            let isRequired = false;
            let _pattern = "";
            let mesReg = "";
            let _isNeedForUpdate = false;
            let isHiddenFromSetting = false;
            let setting: any = {};
            if (itemContent.Setting && itemContent.Setting.length) {
                const settingArray = JSON.parse(itemContent.Setting);
                setting = Uti.getCloumnSettings(settingArray);
                _isHidden =
                    setting.DisplayField &&
                    setting.DisplayField.Hidden &&
                    parseInt(setting.DisplayField.Hidden) > 0;
                isHiddenFromSetting = _isHidden;
                if (_isHidden)
                    _isNeedForUpdate =
                        setting.DisplayField &&
                        setting.DisplayField.NeedForUpdate &&
                        parseInt(setting.DisplayField.NeedForUpdate) > 0;
                if (_isNeedForUpdate && itemContent && itemContent.Value)
                    this.undisplayFieldList.push(
                        itemContent.OriginalColumnName
                    );
                else
                    isReadOnly =
                        this.readonly === true ||
                        (this.readonly === false &&
                            setting.DisplayField &&
                            setting.DisplayField.ReadOnly &&
                            parseInt(setting.DisplayField.ReadOnly) > 0);
                if (
                    setting.ControlType &&
                    /ComboBox/i.test(setting.ControlType.Type) &&
                    setting.ControlType.Value
                ) {
                    // identificationKey = parseInt(setting.ControlType.Value);
                    identificationKey = setting.ControlType.Value;
                    filterBy = setting.ControlType.FilterBy;
                }
                if (
                    setting.ControlType &&
                    /Checkbox/i.test(setting.ControlType.Type)
                ) {
                    groupName = setting.ControlType.GroupName;
                }
                isRequired =
                    setting.Validation &&
                    setting.Validation.IsRequired &&
                    parseInt(setting.Validation.IsRequired) > 0;
                _pattern =
                    setting.Validation &&
                    setting.Validation.RegularExpression &&
                    setting.Validation.RegularExpression.Reg
                        ? setting.Validation.RegularExpression.Reg
                        : "";
                mesReg =
                    setting.Validation &&
                    setting.Validation.RegularExpression &&
                    setting.Validation.RegularExpression.Message
                        ? setting.Validation.RegularExpression.Message
                        : "";
            }
            if (!_isHidden) {
                if (this.fieldFilters && this.fieldFilters.length > 0) {
                    _isHidden = this.isHiddenFieldByFieldFilter(contentList[i]);
                }
                // Allow to display by display fields, so need to check if it can display by filter mode
                if (!_isHidden) {
                    _isHidden = this.isHiddenFieldByFilterMode(contentList[i]);
                }
            }
            if (identificationKey) {
                contentList[i].DataType = "combo-box";
            }

            const defaultConfig: any = {
                key: contentList[i].OriginalColumnName,
                label: contentList[i].ColumnHeader || contentList[i].ColumnName,
                value: contentList[i].Value,
                isHidden: _isHidden,
                readOnly: isReadOnly,
                required: isRequired,
                pattern: _pattern,
                messageReg: mesReg,
                maxLength: contentList[i].DataLength,
            };
            this.numberOfVisibleControls += _isHidden ? 0 : 1;

            let control: ControlBase<any>;
            let controlType =
                setting.ControlType && setting.ControlType.Type
                    ? setting.ControlType.Type
                    : "";
            if (!controlType) {
                controlType =
                    this.getControlTypeNameFromColumnDefine(itemContent);
            }
            if (!controlType) {
                controlType = ControlType.Textbox;
            }

            controlType = controlType.toLowerCase();
            switch (controlType) {
                case ControlType.Numeric:
                    defaultConfig.type = "number";
                    defaultConfig.value = defaultConfig.value
                        ? parseFloat(defaultConfig.value)
                        : null;
                    control = new NumberBoxControl(defaultConfig);
                    break;

                case ControlType.Textbox:
                    control = new TextboxControl(defaultConfig);
                    break;

                case ControlType.Checkbox:
                    defaultConfig.groupName = groupName;
                    control = new CheckboxControl(defaultConfig);
                    control.value = true;
                    if (typeof defaultConfig.value === "boolean") {
                        control.value = defaultConfig.value;
                    } else if (
                        isNil(defaultConfig.value) ||
                        defaultConfig.value.toLowerCase() !== "true"
                    )
                        control.value = false;
                    break;

                case ControlType.DateTimePicker:
                    if (!isEmpty(defaultConfig.value)) {
                        if (
                            typeof defaultConfig.value === "object" ||
                            defaultConfig.value.indexOf(".") !== -1
                        ) {
                            defaultConfig.value = parse(
                                defaultConfig.value,
                                "dd.MM.yyyy",
                                new Date()
                            );
                        }
                    } else defaultConfig.value = null;
                    control = new DateControl(defaultConfig);
                    break;

                case ControlType.ComboBox:
                    defaultConfig.displayValue = defaultConfig.value;
                    defaultConfig.identificationKey = identificationKey;
                    defaultConfig.filterBy = filterBy;
                    control = new DropdownControl(defaultConfig);
                    break;

                case ControlType.Button:
                    defaultConfig.clickFunc = this.buildButtonControlClickFunc(
                        itemContent,
                        contentList
                    );
                    control = new ButtonControl(defaultConfig);
                    break;

                default:
                    control = new TextboxControl(defaultConfig);
                    break;
            }
            control.order = i + 1;
            this.buildHasJustUpdatedForOldControl(control);
            this.groupContentList.push(control);
            this.resetControlUpdated();
        }
        this.buildDataForControlColumnList();
    }

    private buildHasJustUpdatedForOldControl(control: ControlBase<any>) {
        if (!this.groupContentListOld || !this.groupContentListOld.length)
            return;
        for (const ctr of this.groupContentListOld) {
            if (ctr.key !== control.key) {
                continue;
            }
            control.hasJustUpdated = ctr.hasJustUpdated;
            break;
        }
    }

    private getControlTypeNameFromColumnDefine(itemContent) {
        if (itemContent.DataType) {
            switch (itemContent.DataType) {
                case "datetime":
                    return "DatetimePicker";
                default:
                    return "";
            }
        }

        return "";
    }

    private buildButtonControlClickFunc(itemContent, contentList) {
        if (!itemContent || !itemContent.ColumnName) {
            return null;
        }

        const clickData = this.buildButtonControlClickData(contentList);
        switch (itemContent.ColumnName.toLowerCase()) {
            case "tracking":
                return () => {
                    this.onTrackingFieldClick.emit(clickData);
                };
            case "invoicepdf":
            case "preview":
            case "pdf":
                return () => {
                    this.onPdfFieldClick.emit(clickData);
                };
            case "return":
                return () => {
                    this.onReturnRefundFieldClick.emit(clickData);
                };
            case "download":
                return () => {
                    this.downloadClick.emit(clickData);
                };
            case "delete":
                return () => {
                    this.deleteClick.emit(clickData);
                };
        }
    }

    private buildButtonControlClickData(contentList) {
        if (!contentList || !contentList.length) {
            return null;
        }

        const result: any = {};
        for (let i = 0; i < contentList.length; i++) {
            result[contentList[i]["ColumnName"]] = contentList[i]["Value"];
        }

        return result;
    }

    getContainerHeight() {
        this.containerHeight = $("form", $(this._eref.nativeElement)).height();
    }

    onEditField(event): void {
        if (isNil(event) || (isNil(event.isEditing) && isNil(event.id))) return;
        // only emit that not in edit Field mode if no editing fields
        if (!event.isEditing && !this.listEditingFields.length) {
            this.editFieldMode = false;
            this.onEditFormField.emit(this.editFieldMode);
            this.subscribeFormChange();
        } else {
            const index = this.listEditingFields.findIndex(
                (item) => event.id == item
            );
            if (event.isEditing && (isNil(index) || index < 0)) {
                this.listEditingFields.push(event.id);
            } else if (!event.isEditing && index >= 0)
                this.listEditingFields.splice(index, 1);
            if (this.listEditingFields.length && (isNil(index) || index < 0)) {
                this.editFieldMode = true;
                this.onEditFormField.emit(this.editFieldMode);
                this.subscribeFormChange();
            }
            // only emit that not in edit Field mode if no editing fields
            else if (!this.listEditingFields.length) {
                this.editFieldMode = false;
                this.onEditFormField.emit(this.editFieldMode);
                this.subscribeFormChange();
            }
        }
    }

    onShowCreditCardSelection($event): void {
        this.onShowCreditCardSelectionAction.emit($event);
    }

    onCancelEditField($event): void {
        if (!this.listEditingFields.length) {
            this.onCancelEditFormField.emit(true);
        }
    }

    resetToViewMode(): void {
        if (this.formChangeSubscribeSubcription)
            this.formChangeSubscribeSubcription.unsubscribe();
        // Edit Form Mode
        this.editFieldMode = false;
        this.editFormMode = false;
        this.listEditingFields = [];
        this.queryWfFieldComponentsComponent();
        if (this.wfFieldComponents && this.wfFieldComponents.length) {
            this.wfFieldComponents.forEach((wfFieldComponent) => {
                wfFieldComponent.reset();
            });
        }
        // Translate Mode
        this.editLanguageMode = false;

        this.listEditingFields = [];

        if (this.form) {
            this.originalFormValues = this.form.value;
        }
        this.subscribeFormChange();
        this.ref.markForCheck();
        this.signalRDisconnectEditing();
    }

    updateEditLanguageMode(isEditing: boolean): void {
        this.editLanguageMode = isEditing;
        this.ref.markForCheck();
    }

    onEnterKeyPress(control: ControlBase<any>) {
        // let wfFieldComponents: Array<InlineEditComponent> = this.wfFieldComponents.toArray();
        let wfFieldComponents: Array<WfFieldComponent> = this.wfFieldComponents;
        wfFieldComponents = wfFieldComponents.filter(
            (p) => p.control.isHidden === false && !p.control.readOnly
        );

        if (wfFieldComponents && wfFieldComponents.length) {
            let wfFieldComponent: WfFieldComponent;
            for (let i = 0; i < wfFieldComponents.length; i++) {
                if (wfFieldComponents[i].control.key === control.key) {
                    if (i === wfFieldComponents.length - 1) {
                        wfFieldComponent = wfFieldComponents[0];
                    } else {
                        wfFieldComponent = wfFieldComponents[i + 1];
                    }
                    break;
                }
            }
            if (wfFieldComponent) {
                wfFieldComponent.focus();
            }
        }
    }

    focusOnFirstFieldError() {
        for (const item of this.wfFieldComponents) {
            if (this.form.controls[item.control.key].valid) continue;
            this.errorShow = true;
            item.focus();
            this.ref.detectChanges();
            break;
        }
    }

    // Only get new update value from Form and ids list to support update.
    public filterValidFormField() {
        const formValues = Object.assign({}, this.form.value);
        const originalFormValues = this.originalFormValues;

        const formValueKeys = Object.keys(formValues);
        const ignoreFields: Array<string> = [];
        formValueKeys.forEach((formField) => {
            let rs: Array<string> = [];
            if (this.undisplayFieldList) {
                rs = this.undisplayFieldList.filter(
                    (p) => formField.indexOf(p) >= 0
                );
            }
            if (rs.length === 0) {
                if (formValues[formField] === originalFormValues[formField]) {
                    ignoreFields.push(formField);
                } else if (
                    formValues[formField] &&
                    formValues[formField]["key"] &&
                    formValues[formField]["value"]
                ) {
                    if (
                        formValues[formField]["key"] ===
                        originalFormValues[formField]
                    )
                        ignoreFields.push(formField);
                    else formValues[formField] = formValues[formField]["key"];
                }
            }
            if (formValues[formField] instanceof Date) {
                // Fix format follow store procedure convert formater
                formValues[formField] = this.datePipe.transform(
                    formValues[formField],
                    this.consts.dateFormatInDataBase
                );
            }
        });

        if (ignoreFields.length > 0) {
            ignoreFields.forEach((ignoreField) => {
                delete formValues[ignoreField];
            });
        }
        return formValues;
    }

    /**
     * Load data for drop-down that depend on other drop-down
     */
    private loadDataForDependDropdown(
        dropdownControl: DropdownControl,
        controls: ControlBase<any>[]
    ) {
        if (dropdownControl.filterBy) {
            const dependDropdowns = controls.filter(
                (p) => p.key === dropdownControl.filterBy
            );
            if (dependDropdowns.length > 0) {
                this.commonServiceSubscription = this.commonService
                    .getComboBoxDataByFilter(
                        dropdownControl.identificationKey,
                        dependDropdowns[0].value
                    )
                    .subscribe((response: ApiResultResponse) => {
                        this.appErrorHandler.executeAction(() => {
                            this.onSuccessGetDropdownData(
                                response.item,
                                dropdownControl
                            );
                            this.ref.markForCheck();
                        });
                    });
            }
        }
    }

    /**
     * Map new item to drop-down after getting from service.
     * @param result
     * @param dropdownControl
     */
    private onSuccessGetDropdownData(result, dropdownControl: DropdownControl) {
        if (!result) return;
        const keys = Object.keys(result);
        const formatKey = {};
        for (let j = 0; j < keys.length; j++) {
            const key = keys[j].replace(/[0-9_]/gi, "");
            formatKey[key] = result[keys[j]];
        }
        const comboOptions: Array<any> = this.getValidCombobox(
            formatKey,
            dropdownControl.identificationKey
        );
        if (comboOptions) {
            let options: Array<any>;
            let idValue: string;
            options = comboOptions.map((option) => {
                if (option.textValue === dropdownControl.displayValue) {
                    idValue = option.idValue;
                }
                return {
                    key: option.idValue,
                    value: option.textValue,
                };
            });
            if (idValue) {
                dropdownControl.value = idValue;
                if (this.form && this.form.controls) {
                    this.form.controls[dropdownControl.key].setValue(idValue);
                }
            }
            dropdownControl.options = options;
            this.updateDatasourceForCombobox(dropdownControl);
        }
    }

    /**
     * resetHiddenField
     */
    private resetHiddenField() {
        let contentList: any;
        if (
            this.dataSource &&
            this.dataSource.contentDetail &&
            this.dataSource.contentDetail.data &&
            this.dataSource.contentDetail.data.length > 0
        ) {
            const widgetInfo = this.dataSource.contentDetail.data;
            contentList = widgetInfo[1];
        }
        if (!contentList || !this.groupContentList) {
            return;
        }
        for (let i = 0; i < contentList.length; i++) {
            const itemContent = contentList[i];
            let isHidden = false;
            if (itemContent.Setting && itemContent.Setting.length) {
                const settingArray = JSON.parse(itemContent.Setting);
                const setting = Uti.getCloumnSettings(settingArray);
                isHidden =
                    setting.DisplayField &&
                    setting.DisplayField.Hidden &&
                    parseInt(setting.DisplayField.Hidden) > 0;
            }
            if (!isHidden) {
                if (this.fieldFilters && this.fieldFilters.length > 0) {
                    isHidden = this.isHiddenFieldByFieldFilter(contentList[i]);
                }
                // Allow to display by display fields, so need to check if it can display by filter mode
                if (!isHidden) {
                    isHidden = this.isHiddenFieldByFilterMode(contentList[i]);
                }
            }
            const control = this.groupContentList.find(
                (p) => p.key == contentList[i].OriginalColumnName
            );
            if (control) {
                control.isHidden = isHidden;
            }
        }
    }

    /**
     * setDateFormatByCountryCode
     * @param dropdownControl
     */
    private setDateFormatByCountryCode(dropdownControl: DropdownControl) {
        if (
            dropdownControl.key == this.SharingAddressIdRepIsoCountryCodeField
        ) {
            this.updateDateOfBirthFormatByCountryCode();
        }
    }

    /**
     * setMaskAndValidationForZipCodeByCountryCode
     * @param dropdownControl
     */
    private setMaskAndValidationForZipCodeByCountryCode(
        dropdownControl: DropdownControl
    ) {
        if (
            dropdownControl.key == this.SharingAddressIdRepIsoCountryCodeField
        ) {
            const option = dropdownControl.options.find(
                (p) => p.key == dropdownControl.value
            );
            if (option && option[this.ValidationZipMaskFormatField]) {
                const validationZipMaskFormatField = option[
                    this.ValidationZipMaskFormatField
                ] as string;
                const validationZipRegExField = option[
                    this.ValidationZipRegExField
                ] as string;
                this.updateMaskForZipControl(
                    this.B00SharingAddressZipField,
                    validationZipMaskFormatField,
                    validationZipRegExField
                );

                const validationZip2MaskFormatField = option[
                    this.ValidationZip2MaskFormatField
                ] as string;
                const validationZip2RegExField = option[
                    this.ValidationZip2RegExField
                ] as string;
                this.updateMaskForZipControl(
                    this.B00SharingAddressZip2Field,
                    validationZip2MaskFormatField,
                    validationZip2RegExField
                );
            }
        }
    }

    /**
     * updateMaskForZipControl
     * @param zipControlKey
     * @param validationZipMaskFormatField
     * @param validationZipRegExField
     */
    private updateMaskForZipControl(
        zipControlKey,
        validationZipMaskFormatField,
        validationZipRegExField
    ) {
        let zipTxtControl = this.groupContentList.find(
            (p) => p.key == zipControlKey
        );
        if (zipTxtControl) {
            const textMaskControl = new TextboxMaskControl(zipTxtControl);
            textMaskControl.controlType = ControlType.TextboxMask;
            textMaskControl.pattern = validationZipRegExField;
            if (validationZipMaskFormatField) {
                validationZipMaskFormatField =
                    validationZipMaskFormatField.replace(/§/g, "A");
                textMaskControl.mask = validationZipMaskFormatField;
            }
            zipTxtControl = Object.assign(zipTxtControl, textMaskControl);

            /* TODO: reopen after updating format in DB
            let arr = [];
            if (zipTxtControl.pattern && zipTxtControl.pattern.length) {
                if (Uti.isValidRegExp(zipTxtControl.pattern)) {
                    arr.push(Validators.pattern(new RegExp(zipTxtControl.pattern)));
                    (<FormControl>this.form.controls[zipTxtControl.key]).validator = Validators.compose(arr);
                    (<FormControl>this.form.controls[zipTxtControl.key]).updateValueAndValidity();
                }
            }
            */
        }
    }

    /**
     * setHiddenFieldsByCountryCode
     * Update hidden fields following country code.
     * @param dropdownControl
     */
    private setHiddenFieldsByCountryCode(dropdownControl: DropdownControl) {
        if (
            dropdownControl.key == this.SharingAddressIdRepIsoCountryCodeField
        ) {
            const option = dropdownControl.options.find(
                (p) => p.key == dropdownControl.value
            );
            if (option && option[this.SharingAddressHiddenFields]) {
                this.resetHiddenField();
                const hiddenFields = (
                    option[this.SharingAddressHiddenFields] as string
                ).split(";");
                this.setHiddenFields(hiddenFields);
            }
        }
    }

    /**
     * Update value of control
     * @param control
     */
    onUpdateValue(control: ControlBase<any>) {
        switch (control.controlType) {
            case "dropdown":
                const dropdownControl = control as DropdownControl;
                this.changeItemOnDropdown(dropdownControl);
                this.setHiddenFieldsByCountryCode(dropdownControl);
                this.setMaskAndValidationForZipCodeByCountryCode(
                    dropdownControl
                );
                this.setDateFormatByCountryCode(dropdownControl);
                break;
            case "checkbox":
                const checkboxControl = control as CheckboxControl;
                this.changeStatusCheckBox(checkboxControl);
                break;
            case "date":
                const dateControl = control as DateControl;
                if (this.form && this.form.controls[dateControl.key]) {
                    this.form.controls[dateControl.key].setValue(
                        dateControl.value
                    );
                    this.form.updateValueAndValidity();
                }
                break;
        }
        this.ref.markForCheck();
    }

    /**
     * When changing status of check box , we need to filter the others with the same group.
     */
    private changeStatusCheckBox(checkboxControl: CheckboxControl) {
        if (checkboxControl.value && checkboxControl.groupName) {
            const controls: ControlBase<any>[] = this.groupContentList;
            // Find all other checkbox with the same group.
            const checkBoxGroup = controls.filter(
                (p) =>
                    p.key !== checkboxControl.key &&
                    p.controlType === "checkbox"
            );
            if (checkBoxGroup.length) {
                const checkboxControls = checkBoxGroup as CheckboxControl[];
                checkboxControls.forEach((checkbox) => {
                    if (checkbox.groupName === checkboxControl.groupName) {
                        checkbox.value = false;
                        this.form.controls[checkbox.key].setValue(false);
                    }
                });
            }
        }
        this.ref.markForCheck();
    }

    /**
     * updateDateOfBirthFormatByCountryCode
     **/
    private updateDateOfBirthFormatByCountryCode() {
        const countryCtr = Uti.getItemRecursive(
            this.controlColumnList,
            this.SharingAddressIdRepIsoCountryCodeField,
            "key"
        );
        if (
            !countryCtr ||
            !countryCtr.options ||
            !countryCtr.options.length ||
            !countryCtr.value
        )
            return;

        const option = countryCtr.options.find(
            (p) => p.key == countryCtr.value || p.value == countryCtr.value
        );
        if (!option) return;

        const dobCtr = Uti.getItemRecursive(
            this.controlColumnList,
            this.B00PersonMasterData_DateOfBirth,
            "key"
        );
        if (!dobCtr) return;

        dobCtr.format = null;
        if (!this.supportDOBCountryFormat) return;

        dobCtr.format = Uti.getDateFormatFromIsoCode(option["isoCode"]);

        // if (controls && controls.length) {
        //     const countryCodeControl = controls.find(p => p.key == this.SharingAddressIdRepIsoCountryCodeField);
        //     if (countryCodeControl && countryCodeControl.value) {
        //         const options = (countryCodeControl as DropdownControl).options;
        //         if (options && options.length) {
        //             const option = options.find(p => p.key == countryCodeControl.value);
        //             if (option) {
        //                 let dateControl = controls.find(p => p.controlType === 'date' && p.key == this.B00PersonMasterData_DateOfBirth);
        //                 if (dateControl) {
        //                     (dateControl as DateControl).format = null;
        //                     if (this.supportDOBCountryFormat) {
        //                         const dateFormat = Uti.getDateFormatFromIsoCode(option['isoCode']);
        //                         (dateControl as DateControl).format = dateFormat;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    /**
     * When changing an item in drop down , we need to filter the others dropdown following that changing.
     * @param dropdownControl
     */
    private changeItemOnDropdown(dropdownControl: DropdownControl) {
        const id = dropdownControl.value;
        const key = dropdownControl.key;
        const controls: ControlBase<any>[] = this.groupContentList;
        // Find all dependency drop-downs.
        const filterByDropdowns = controls.filter(
            (p) => p.controlType === "dropdown" && p.filterBy === key
        );
        if (filterByDropdowns.length > 0) {
            const observables = new Array<Observable<any>>();
            filterByDropdowns.forEach((filterByDropdown) => {
                const control = filterByDropdown as DropdownControl;
                control.options = [];
                this.updateDatasourceForCombobox(control);
                observables.push(
                    this.commonService.getComboBoxDataByFilter(
                        control.identificationKey,
                        id
                    )
                );
            });

            // Excute request
            for (let i = 0; i < observables.length; i++) {
                observables[i].subscribe((response: ApiResultResponse) => {
                    this.appErrorHandler.executeAction(() => {
                        const rs = response.item;
                        if (!rs) return;
                        for (let j = 0; j < filterByDropdowns.length; j++) {
                            const control = filterByDropdowns[
                                j
                            ] as DropdownControl;
                            this.onSuccessGetDropdownData(rs, control);
                            this.ref.markForCheck();
                        }
                    });
                });
            }
        }
    }

    /**
     * calculateMinLabelWidth
     */
    private calculateMinLabelWidth() {
        this.groupContentList.forEach((control) => {
            if (control.label && !control.isHidden) {
                if (
                    this.importantFormStyle.labelStyle &&
                    this.importantFormStyle.labelStyle["font-size"] &&
                    this.importantFormStyle.fields &&
                    this.importantFormStyle.fields[control.key]
                ) {
                    const ratioConvert =
                        (parseInt(
                            this.importantFormStyle.labelStyle["font-size"]
                                .replace("px")
                                .trim(),
                            null
                        ) /
                            12) *
                        7;
                    this.changeMinLabelWidth(
                        control.label.length,
                        ratioConvert
                    );
                } else {
                    this.changeMinLabelWidth(
                        control.label.length,
                        this.ratioConvertFontSizeToPixcel
                    );
                }
            }
        });
        this.ref.markForCheck();
    }

    /**
     * changeMinLabelWidth
     * @param event
     */
    private changeMinLabelWidth(lbLength, ratioConvert) {
        if (isNil(lbLength)) return;

        this.minLabelWidth = Math.max(
            this.minLabelWidth,
            lbLength * ratioConvert + 10
        );
        // comment code to fix bug 6292
        // const containerWidth = $('form', $(this._eref.nativeElement)).width();
        // if (containerWidth > 0 && this.minLabelWidth > containerWidth / 5 * 2)
        //     this.minLabelWidth = containerWidth / 2;
    }

    private listVirtualElements: any;
    private listVirtualElementNames: string[] = [];
    private activateVirtualContainer(input: string, isChangeData?: boolean) {
        if (this.org_numberOfVisibleControls !== this.numberOfVisibleControls)
            this.org_numberOfVisibleControls = this.numberOfVisibleControls;
        else if (isChangeData && this.listVirtualElementNames.length) return;

        const vContainers = $(
            ".virtual-container",
            $(this._eref.nativeElement)
        );
        if (!vContainers.length) return;

        if (
            this.numberOfVisibleControls > 20 ||
            this.widgetFormType === WidgetFormTypeEnum.List
        ) {
            vContainers.hide();
            this.listVirtualElementNames = [];
            return;
        }

        if (input && this.dataSource) {
            const id = this.dataSource.id;
            // do nothing for invalid Widget Id or not to be resized by spliter
            if (
                input.indexOf("-" + id + "-") < 0 &&
                input.indexOf("spliter-") < 0
            )
                return;

            // start resizing, hide all virtual element
            if (input.indexOf("start-") >= 0) {
                vContainers.hide();
                return;
            }
        }
        // find the start point to activate virtual elements
        const containerW = $("form", $(this._eref.nativeElement)).width();
        const cols = Math.min(6, Math.floor(containerW / 265));
        const rows = vContainers.length;
        const numberItemsRemain = rows % cols;
        const rowsFullOfItems = (rows - numberItemsRemain) / cols;
        const numberItemsWillAdd = cols - numberItemsRemain;
        const startPoint =
            numberItemsRemain <= 0
                ? rowsFullOfItems - 1
                : (rowsFullOfItems + 1) * numberItemsRemain +
                  rowsFullOfItems -
                  1;
        vContainers.hide();
        this.listVirtualElementNames = [];
        for (let i = 0; i < numberItemsWillAdd; i++) {
            const element = $(
                vContainers.get(startPoint + i * rowsFullOfItems)
            );
            element.show();
            this.listVirtualElementNames.push(element.attr("data-id"));
        }
    }

    /**
     * trackControl
     * @param index
     * @param control
     */
    trackControl(index, control) {
        return control ? control.key : undefined;
    }

    //#region SignalR
    public notifyObjectId: any;
    private notifyFields: Array<any> = null;
    private signalRAskEditingTimeout: any = null;

    public signalRIsThereAnyoneEditing() {
        if (
            !Configuration.PublicSettings.enableSignalR ||
            !Configuration.PublicSettings.enableSignalRForWidgetDetail
        )
            return;

        clearTimeout(this.signalRAskEditingTimeout);
        this.signalRAskEditingTimeout = null;

        this.signalRAskEditingTimeout = setTimeout(() => {
            this.notifyObjectId = this.signalRGetObjectId();
            if (!this.notifyObjectId) return;

            //console.log(this.notifyObjectId);

            const model = this.signalRService.createMessageWidgetFormEditing();
            model.Action = SignalRActionEnum.IsThereAnyoneEditing;
            model.ObjectId = this.notifyObjectId;

            this.signalRService.sendMessage(model);
        }, 500);
    }

    private signalRGetObjectId() {
        if (
            !this.dataSource ||
            !this.dataSource.widgetDataType ||
            !this.dataSource.widgetDataType.listenKey ||
            !this.dataSource.widgetDataType.listenKey.key
        )
            return null;

        const key: string = this.dataSource.widgetDataType.listenKey.key;
        const keyValue: string =
            this.dataSource.widgetDataType.listenKeyRequest(
                this.dataSource.moduleName
            )[key];

        if (!keyValue) return null;

        //ModuleName + IdRepWidgetApp + WidgetId + ListenKey + ID
        return (
            this.dataSource.moduleName +
            this.dataSource.idRepWidgetApp +
            "_" +
            key +
            keyValue
        );
    }

    private signalRConnectEditing(action?: SignalRActionEnum) {
        if (
            !Configuration.PublicSettings.enableSignalR ||
            !Configuration.PublicSettings.enableSignalRForWidgetDetail
        )
            return;

        if (
            !this.notifyObjectId ||
            !this.notifyFields ||
            !this.notifyFields.length
        ) {
            if (action === SignalRActionEnum.StopEditing) {
                this.broastCastMessage(action);
            }
            return;
        }

        this.broastCastMessage(action);
    }

    private signalRDisconnectEditing() {
        if (!this.notifyFields) return;
        this.signalRConnectEditing(SignalRActionEnum.StopEditing);
        setTimeout(() => {
            this.notifyFields = [];
        }, 1000);
    }

    private broastCastMessage(action?: SignalRActionEnum) {
        const model = this.signalRService.createMessageWidgetFormEditing();
        model.Action = action || SignalRActionEnum.ConnectEditing;
        model.ObjectId = this.notifyObjectId;
        model.Data = this.notifyFields;
        // model.UserName = this.userLogin.loginName;

        this.signalRService.sendMessage(model);
    }

    public invokeSaveWidgetSuccess() {
        const model = this.signalRService.createMessageWidgetFormEditing();
        model.Action = SignalRActionEnum.SavedSuccessfully;
        model.ObjectId = this.notifyObjectId;
        model.Data = this.notifyFields;
        // model.UserName = this.userLogin.loginName;

        this.signalRService.sendMessage(model);
    }

    private executeControlUpdated(data: SignalRNotifyModel) {
        if (!data || !data.Data || !data.Data.length) return;
        for (const item of data.Data) {
            const updateItem = this.groupContentList.find(
                (x) => x.key === item.fieldName
            );
            if (!updateItem || !updateItem.key) continue;
            updateItem.hasJustUpdated = true;
        }
        this.resetControlUpdated();
    }

    private resetControlUpdated() {
        setTimeout(() => {
            for (const item of this.groupContentList) {
                item.hasJustUpdated = false;
            }
            this.ref.detectChanges();
        }, 3000);
    }
    //#endregion

    //#region [Column setting]

    private timeoutOfControlKeyPress: any;

    @HostListener("document:keydown.out-zone", ["$event"])
    onKeydown($event) {
        if (this.isSettingDialog) return;
        this.isControlPressing = $event.key === "Control";
        if (this.timeoutOfControlKeyPress) {
            clearTimeout(this.timeoutOfControlKeyPress);
            this.timeoutOfControlKeyPress = null;
        }
        this.timeoutOfControlKeyPress = setTimeout(() => {
            this.isControlPressing = false;
        }, 1000);
    }

    @HostListener("document:keyup.out-zone", ["$event"])
    onKeyup($event) {
        if (this.isSettingDialog) return;
        this.checkedItems.length = 0;
        this.getCheckedItems(this.controlColumnList);
        // const itemChecked = cloneDeep(Array.from(new Set(this.checkedItems.filter(x => x.checked))));
        const itemChecked = cloneDeep(this.checkedItems);
        this.widgetFieldService.changeMessage(itemChecked);
        // this.isControlPressing = !($event.key === 'Control');
        this.isControlPressing = false;
        if ($event.key === "Escape") {
            this.isCancelDragging = true;
            const drake = this.dragulaService.find(this.dragName).drake;
            drake.cancel(this.checkedItems);
        }
    }

    private timeoutOfMenuClicking: any;

    @HostListener("mousedown.out-zone", ["$event"])
    onMousedown($event) {
        if ($event.button === 2) {
            this.resetCurrentItemSelection();
            return;
        }
        setTimeout(() => {
            // Prevent when setting menu is clicked.
            if (this.isMenuClicking) {
                if (this.timeoutOfMenuClicking) {
                    clearTimeout(this.timeoutOfMenuClicking);
                    this.timeoutOfMenuClicking = null;
                }
                this.timeoutOfMenuClicking = setTimeout(() => {
                    this.isMenuClicking = false;
                }, 400);
                return;
            }

            if (
                this.isControlPressing ||
                this.isDragging ||
                this.isCheckedItemClicked
            ) {
                this.isCheckedItemClicked = false;
                this.isItemClicked = false;
                return;
            }
            this.unCheckAllControlOfOtherColumn({}, "checked");
            if (this.isItemClicked) {
                this.isItemClicked = false;
                if (
                    this.currentItemControl &&
                    (this.currentItemControl.layoutType === "control" ||
                        this.currentItemControl.layoutType === "lineBreak")
                ) {
                    this.currentItemControl.checked = true;
                }
            }
            this.ref.markForCheck();
        }, 400);
    }

    public controlColumnList: Array<any> = [];
    public currentColumn: any;
    public currentPanel: any;
    public currentControl: any;
    public currentLineBreak: any;
    // public columnWidth: any;
    public dragName: string = Uti.guid();
    public isDisableDragToPanel = false;
    public layoutTypeDragging = "";
    public isIncludeLinebreak = false;
    public isControlPressing = false;
    public isCancelDragging = false;
    public isDragging = false;
    public isSettingDialog = false;
    public isJustDragged = false;
    public settingControl: any;

    public onDeleteColumnHandler(column: any) {
        this.moveAllItemToBesideColumn(column);
        Uti.removeItemInArray(this.controlColumnList, column, "key");
        this.buildColumnsWidthWhenRemove(column);
        this.setDirtyForChangeColumnLayout();
        this.setThreeDotsForValue();
    }

    public onToggleHandler($event) {
        this.isMenuClicking = true;
    }

    public openSettingDialog(data) {
        const isCheckMultiField = this.checkedItems.some(
            (x) => x.key === data.key
        );
        if (!isCheckMultiField) {
            this.widgetFieldService.clearMessages();
        }
        this.settingControl = data;
        this.isSettingDialog = true;
        this.updateWhenOpenConfigDialog();
        this.detetedChange();
    }

    private updateWhenOpenConfigDialog() {
        for (const wfColumnComponent of (<any>this.wfColumnComponents)
            ._results) {
            if (
                wfColumnComponent.updateWhenOpenConfigDialog(
                    this.currentItemControl
                )
            )
                return;
        }
    }

    public openSettingColumnDialog() {
        this.settingControl = this.currentColumn;
        this.isSettingDialog = true;
        this.detetedChange();
    }

    public openSettingPanelDialog() {
        if (!this.currentPanel) {
            this._modalService.warningText(
                "Modal_Message__Select_Country_Process"
            );
            return;
        }
        this.settingControl = this.currentPanel;
        this.isSettingDialog = true;
        this.detetedChange();
    }

    public openSettingFieldDialog() {
        if (!this.currentControl) {
            this._modalService.warningText(
                "Modal_Message__Right_Click_InSide_Field"
            );
            return;
        }
        this.settingControl = this.currentControl;
        this.isSettingDialog = true;
        this.detetedChange();
    }

    public openSettingAllFieldDialog() {
        this.allFields.length = 0;
        this.getAllFields(this.controlColumnList);
        this.settingControl = this.allFields[0];
        this.widgetFieldService.changeMessage(this.allFields);
        this.isSettingDialog = true;
        this.detetedChange();
    }

    public closeSettingDialog($event) {
        this.isSettingDialog = $event.isSettingDialog;
        this.resetDataInPanel($event.control);
    }

    private resetDataInPanel(data) {
        if (!data || data.layoutType !== "panel") return;
        for (const wfColumnComponent of (<any>this.wfColumnComponents)
            ._results) {
            if (!wfColumnComponent.resetDataInPanel(data)) continue;
            break;
        }
    }

    public onMenuClickHandler($event) {
        if (this.timeoutOfMenuClicking) {
            clearTimeout(this.timeoutOfMenuClicking);
            this.timeoutOfMenuClicking = null;
        }
        this.timeoutOfMenuClicking = setTimeout(() => {
            this.isMenuClicking = false;
        }, 400);
    }

    public onDeletePanelHandler(data: any) {
        const keepPanelChildren = cloneDeep(data.panel.children);
        for (let i = 0; i < data.column.children.length; i++) {
            if (data.column.children[i].key !== data.panel.key) continue;
            data.column.children = Uti.insertArrayAt(
                data.column.children,
                i,
                keepPanelChildren
            );
            break;
        }
        Uti.removeItemInArray(data.column.children, data.panel, "key");
        this.reSetOrderNumber(data.column.children);
        // data.column.children = [...data.column.children, ...keepPanelChildren];
        this.setDirtyForChangeColumnLayout();
    }

    public onSavePanelTitleHandler(panel: any) {
        this.isChangeColumnLayoutAction.emit();
    }

    public addColumn() {
        const id = Uti.guid();
        const newColumn = this.createColumn(id, this.currentColumn.width / 2);
        if (!this.currentColumn) {
            // Add column to End of List when didn't select any column
            this.controlColumnList.push(newColumn);
        } else {
            for (let i = 0; i < this.controlColumnList.length; i++) {
                if (this.controlColumnList[i].key !== this.currentColumn.key)
                    continue;
                this.controlColumnList.splice(i + 1, 0, newColumn);
                break;
            }
        }
        this.buildColumnsWidth();
        this.reSetOrderNumber(this.controlColumnList);
        this.setDirtyForChangeColumnLayout();
        this.resetCurrentItemSelection();
        this.setThreeDotsForValue();
    }

    public addPanel(isRow?: boolean) {
        if (
            !this.currentColumn &&
            !this.currentPanel &&
            !this.currentControl &&
            !this.currentLineBreak
        ) {
            this._modalService.warningText(
                "Modal_Message__Right_Click_InSide_Column"
            );
            return;
        }
        if (
            !this.currentColumn.children.length ||
            (!this.currentPanel &&
                !this.currentControl &&
                !this.currentLineBreak)
        ) {
            this.addControlForColumn("panel", "New Panel");
            // this.addControlForColumn('panel', (!isRow ? 'New Panel' : 'New Row Panel'), isRow);
            return;
        }
        let control = this.currentPanel || this.currentControl;
        control = control || this.currentLineBreak;
        for (let i = 0; i < this.currentColumn.children.length; i++) {
            if (this.currentColumn.children[i].key !== control.key) continue;
            this.currentColumn.children.splice(i, 0, {
                layoutType: "panel",
                title: "New Panel",
                // 'title': (!isRow ? 'New Panel' : 'New Row Panel'),
                key: Uti.guid(),
                checked: false,
                order: 0,
                isRow: isRow,
                children: [],
                config: DefaultWidgetItemConfiguration.Panel,
            });
            break;
        }
        this.reSetOrderNumber(this.currentColumn.children);
        this.setDirtyForChangeColumnLayout();
        this.resetCurrentItemSelection();
    }

    public addLineBreak() {
        if (
            !this.currentColumn &&
            !this.currentPanel &&
            !this.currentControl &&
            !this.currentLineBreak
        ) {
            this._modalService.warningText(
                "Modal_Message__Right_Click_InSide_Column"
            );
            return;
        }
        if (
            !this.currentColumn.children.length ||
            (!this.currentPanel &&
                !this.currentControl &&
                !this.currentLineBreak)
        ) {
            this.addControlForColumn("lineBreak");
            return;
        }
        const { isAdded, control } = this.addLinebreakToPanel();
        if (!isAdded) {
            this.addLinebreakToColumn(control);
        }
        this.reSetOrderNumber(this.currentColumn.children);
        this.setDirtyForChangeColumnLayout();
        this.resetCurrentItemSelection();
    }

    public onDeleteLineBreakHandler(data: any) {
        Uti.removeItemInArray(data.parent.children, data.lineBreak, "key");
        this.reSetOrderNumber(data.parent.children);
        this.setDirtyForChangeColumnLayout();
    }

    public saveColumnLayout() {
        this.prepareSavingDataForColumnLayout();
        this.saveColumnLayoutAction.emit();
    }

    public makeTemporariesColumnLayoutData() {
        const tempProperties = cloneDeep(this.widgetProperties);
        const controlColumnPanel = Uti.getItemRecursive(
            tempProperties,
            "ControlColumnPanel"
        );
        controlColumnPanel.value = JSON.stringify(
            this.makeSavingDataForColumnLayout(this.controlColumnList)
        );
        this.makeTempPropertiesAction.emit(tempProperties);
    }

    public resetColumnLayout() {
        this.buildDataForControlColumnList();
    }

    public onRightClickdHandler(column: any) {
        this.currentColumn = column;
        this.onHiddenSettingForm.emit(this.currentColumn);
        this.currentPanel = null;
        this.currentControl = null;
        this.currentLineBreak = null;
    }

    public onRightClickControlHandler(control: any) {
        switch (control.layoutType) {
            case "control":
                this.currentControl = control;
                this.onHiddenSettingForm.emit(this.currentControl);
                break;
            case "panel":
                this.currentPanel = control;
                this.onHiddenSettingForm.emit(this.currentPanel);
                break;
            case "lineBreak":
                this.currentLineBreak = control;
        }
    }

    public onChangedHandler() {
        this.ref.markForCheck();
        this.isChangeColumnLayoutAction.emit();
    }

    public onChangedSettingHandler(data) {
        this.renderStyle(data);
        this.checkedItems = [];
        // this.widgetFieldService.clearMessages();
        this.ref.markForCheck();
        this.isChangeColumnLayoutAction.emit();
    }

    private renderStyle(data: any) {
        if (!data) return;
        switch (data.layoutType) {
            case TypeForm.Column:
                for (const wfColumnComponent of (<any>this.wfColumnComponents)
                    ._results) {
                    if (data.key !== wfColumnComponent.column.key) continue;
                    wfColumnComponent.changePropertiesForColumnStyle(
                        data.config
                    );
                    break;
                }
                break;
            case TypeForm.Panel:
                for (const wfColumnComponent of (<any>this.wfColumnComponents)
                    ._results) {
                    if (!wfColumnComponent.changePropertiesForPanelStyle(data))
                        continue;
                    break;
                }
                break;
            case TypeForm.Control:
                for (const wfColumnComponent of (<any>this.wfColumnComponents)
                    ._results) {
                    if (!wfColumnComponent.changePropertiesForFieldStyle(data))
                        continue;
                    break;
                }
                break;
        }
        this.ref.markForCheck();
        this.ref.detectChanges();
    }

    public onMouseUpHandler() {
        // setTimeout(() => {
        //     this.currentColumn = null;
        //     this.currentPanel = null;
        //     this.currentControl = null;
        //     this.currentLineBreak = null;
        // }, 1000);
    }

    public callRenderScrollHandler() {
        this.callRenderScrollAction.emit();
    }

    public onMouseDownHandler(data: any) {
        setTimeout(() => {
            if (this.isMenuClicking) return;
            this.isItemClicked = true;
            this.currentItemControl = data.control;
            this.isCheckedItemClicked = this.currentItemControl.checked;
            if (!this.isControlPressing) {
                this.checkOnlyItselfWhenClick(this.currentItemControl);
                return;
            }
            this.currentColumn = data.column;
            // this.unCheckAllControlOfOtherColumn(data.column, 'checked');
        }, 200);
    }

    public onColumnResizeEndHandler(data: any) {
        this.onColumnResizeEndAction.emit();
        // Get widget width
        const parentWidth = this._eref.nativeElement.parentElement.clientWidth;
        // calculate new width for current resizing column
        let newWidth = (data.newWidthPixel * 100) / parentWidth;
        // calculate for width of right column
        const remainWidth = Math.abs(newWidth - data.column.width);
        let isFound = false;
        let newNextColumnWidth = 0;
        let totalWidth = 0;
        // find the right column and set width for both left and right columns.
        for (const column of this.controlColumnList) {
            // If right column is found, will set width for left, right column and break
            if (isFound) {
                // calculate for the new right column width
                newNextColumnWidth =
                    column.width +
                    remainWidth * (newWidth > data.column.width ? -1 : 1);
                // keep current total of left and right size, that will use calculate remain width
                totalWidth = data.column.width + column.width;

                // 30px is default min column width pixel
                // 1.
                // If left column width is less than or equal 30px
                // Then set left column width is 30px (will parse to percent)
                // And set right column width is remain size
                if (
                    (newWidth * parentWidth) / 100 <=
                    this.defaultMinColumnWidthPixel
                ) {
                    newWidth =
                        (this.defaultMinColumnWidthPixel * 100) / parentWidth;
                    data.column.width = newWidth;
                    column.width = totalWidth - newWidth;
                    break;
                }

                // 2.
                // If right column width is less than or equal 30px
                // Then set right column width is 30px (will parse to percent)
                // And set left column width is remain size
                if (
                    (newNextColumnWidth * parentWidth) / 100 <=
                    this.defaultMinColumnWidthPixel
                ) {
                    newNextColumnWidth =
                        (this.defaultMinColumnWidthPixel * 100) / parentWidth;
                    column.width = newNextColumnWidth;
                    data.column.width = totalWidth - newNextColumnWidth;
                    break;
                }

                // 3. Set width is normal for left, right column
                column.width = newNextColumnWidth;
                data.column.width = newWidth;
                break;
            }

            if (column.key !== data.column.key) continue;
            // Turn on flag when found right column
            isFound = true;
        }
        this.setDirtyForChangeColumnLayout();
        this.setThreeDotsForValueAfterResize(data.column);
    }

    public onPanelResizeEndHandler() {
        this.setDirtyForChangeColumnLayout();
    }

    public onFieldResizeEndHandler() {
        this.setDirtyForChangeColumnLayout();
    }

    public onLineBreakResizeEndHandler() {
        this.setDirtyForChangeColumnLayout();
    }

    public onApplyControlStyleHandler(data: any) {
        this.setDirtyForChangeColumnLayout();
    }

    public applySettingForm(data: any) {
        if (data && data.layoutType === TypeForm.Column) {
            this.controlColumnList = cloneDeep(
                this.controlColumnList.filter((x) =>
                    x.key === data.key ? (x.config = data.config) : x
                )
            );
        } else {
            this.controlColumnList = cloneDeep(
                this.controlColumnList.filter(
                    (x) =>
                        !!x.children.map((v) => {
                            if (v.layoutType === TypeForm.Panel) {
                                return v.key === data.key
                                    ? (v.config = data.config)
                                    : v;
                            }
                        })
                )
            );
        }
    }

    public applySettingFields(data: any) {
        this.controlColumnList.filter(
            (x) =>
                !!x.children.map((v) => {
                    if (v.layoutType === TypeForm.Panel) {
                        v.children.map((p) =>
                            p.key === data.key ? (p.config = data.config) : p
                        );
                    }
                    return v.key === data.key ? (v.config = data.config) : v;
                })
        );
    }

    public onApplyHandler(data: any) {
        this.onApplyAction.emit(data);
        if (
            (data && data.layoutType === TypeForm.Column) ||
            data.layoutType === TypeForm.Panel
        ) {
            this.applySettingForm(data);
            return;
        }
        this.applySettingFields(data);
        this.widgetFieldService.clearMessages();
    }

    public resizeEventHandler() {
        this.setThreeDotsForValue();
    }

    public setThreeDotsForValue() {
        if (!this.wfColumnComponents || !this.wfColumnComponents.length) return;
        this.wfColumnComponents.forEach((wfColumnComponent) => {
            wfColumnComponent.setThreeDotsForValue();
        });
    }

    public onMenuMouseOverHandler(isOver: boolean) {
        this.onMenuMouseOver = isOver;
    }

    public changeConfigHandler(control: any) {
        this.settingDialogComponent.execControl(control);
    }

    /* Private Methods/Variables */

    private checkedItems: Array<any> = [];
    private allFields: Array<any> = [];
    private currentItemControl: any;
    private draggingItem: any;
    private bagTarget: any;
    private bagSource: any;
    private isFoundDragItem = false;
    private isCheckedItemClicked = false;
    private isItemClicked = false;
    private isMenuClicking = false;
    private onDraggingSubscription: Subscription;
    private onClonedSubscription: Subscription;
    private onDragendSubscription: Subscription;
    private onOverSubscription: Subscription;
    private defaultMinColumnWidthPixel = 30;
    // private defaultColumnWidthPercent = 15;
    // private minColumnWidth = 250;
    private isCancelDrag = false;
    private onMenuMouseOver = false;
    // private onOutSubscription: Subscription;

    private registerDragDropItem() {
        this.dragulaService.setOptions(this.dragName, {
            moves: (element, source, handle, sibling) => {
                // console.log('=================================================================================');
                // console.log(element.className);
                // console.log('dragulaService');
                // this.setIsJustDragged();
                if (
                    element.className.includes("ignore-drag") ||
                    !element.className.includes("xn-allow-drag") ||
                    this.isSettingDialog ||
                    this.onMenuMouseOver
                ) {
                    return false;
                }
                return true;
            },
            accepts: (element, source, handle, sibling) => {
                if (source.className.includes("dont-accept")) {
                    return false;
                }
                return true;
            },
        });
    }

    private initDragulaEvents() {
        this.onDraggingSubscription = this.dragulaService.drag.subscribe(
            this.onDragging.bind(this)
        );
        this.onClonedSubscription = this.dragulaService.cloned.subscribe(
            this.onCloned.bind(this)
        );
        this.onDragendSubscription = this.dragulaService.dragend.subscribe(
            this.onDragend.bind(this)
        );
        this.onOverSubscription = this.dragulaService.over.subscribe(
            this.onOver.bind(this)
        );
        // this.onOutSubscription = this.dragulaService.out.subscribe(this.onOut.bind(this));
        //this.dragulaService.cancel.subscribe(this.oncancel.bind(this));
        //this.dragulaService.remove.subscribe(this.onremove.bind(this));
        //this.dragulaService.shadow.subscribe(this.onshadow.bind(this));
        //this.dragulaService.dropModel.subscribe(this.ondropModel.bind(this));
        //this.dragulaService.removeModel.subscribe(this.onremoveModel.bind(this));
    }

    //private oncancel() {
    //    console.log('oncancel');
    //}

    //private onremove() {
    //    console.log('onremove');
    //}

    //private onshadow() {
    //    console.log('onshadow');
    //}

    //private ondropModel() {
    //    console.log('ondropModel');
    //}

    //private onremoveModel() {
    //    console.log('onremoveModel');
    //}

    private onCloned(args: any) {
        // console.log('onCloned');
        if (
            this.dragName !== args[0] ||
            this.isCancelDrag ||
            this.isSettingDialog ||
            args.length < 3 ||
            !args[1].attributes["layout-type"] ||
            !args[1].attributes["layout-type"].value
        ) {
            const drake = this.dragulaService.find(this.dragName).drake;
            drake.cancel();
            this.isCancelDrag = true;
            return;
        }
        $("#xn-dragging-item").remove();
        $("body").append(
            $(
                `
            <div id="xn-dragging-item">Dragging ` +
                    (this.checkedItems.length <= 1
                        ? "1"
                        : this.checkedItems.length) +
                    ` item` +
                    (this.checkedItems.length <= 1 ? "" : "s") +
                    `</div>`
            )
        );
        this.registerMouseMove();
    }

    private registerMouseMove() {
        $(this._eref.nativeElement).off("mousemove");
        $(this._eref.nativeElement).mousemove((e) => {
            $("#xn-dragging-item").css({
                top: e.clientY - 20,
                left: e.clientX - 100,
            });
        });
    }

    private onDragging(args: any) {
        // console.log('onDragging');
        if (
            args.length < 3 ||
            this.isCancelDrag ||
            this.isSettingDialog ||
            !args[1].attributes["layout-type"] ||
            !args[1].attributes["layout-type"].value
        ) {
            const drake = this.dragulaService.find(this.dragName).drake;
            drake.cancel();
            this.isCancelDrag = true;
            return;
        }
        this.checkedItems.length = 0;
        this.allFields.length = 0;
        this.getCheckedItems(this.controlColumnList);
        if (this.dragName !== args[0]) return;
        // var drake = this.dragulaService.find(this.dragName).drake;
        // drake.cancel();
        // return;
        this.isDragging = true;
        this.makeDataWhenDragging(args);
        // this.hiddenItemWhenDragging();
        this.ref.markForCheck();
    }

    // private hiddenItemWhenDragging() {
    //     for (let item of this.checkedItems) {
    //         item.dragging = true;
    //     }
    //     this.ref.markForCheck();
    // }

    private onDragend(args: any) {
        // console.log('onDragend');
        this.setIsJustDragged();
        this.setIsResizing();
        if (this.dragName !== args[0]) return;
        if (
            this.isCancelDragging ||
            args.length < 2 ||
            this.isSettingDialog ||
            this.isCancelDrag ||
            !args[1].attributes["layout-type"] ||
            !args[1].attributes["layout-type"].value
        ) {
            this.isCancelDragging = false;
            this.isDragging = false;
            this.isControlPressing = false;
            $(this._eref.nativeElement).off("mousemove");
            $("#xn-dragging-item").remove();
            this.isCancelDrag = false;
            return;
        }
        // const [name, el, bagTarget, bagSource] = args;
        this.setDataAfterDrag();
        this.fieldDragEndAction.emit();
        $(this._eref.nativeElement).off("mousemove");
        $("#xn-dragging-item").remove();
    }

    private setIsJustDragged() {
        this.isJustDragged = true;
        setTimeout(() => {
            this.isJustDragged = false;
        }, 400);
    }

    private setIsResizing() {
        if (this.currentItemControl) this.currentItemControl.isResizing = false;
        this.ref.markForCheck();
    }

    private onOver(args: any) {
        //console.log('onOver');
        if (this.dragName !== args[0]) return;
        const [bagName, elSource, bagTarget, bagSource, elTarget] = args;
        this.bagTarget = bagTarget;
        this.bagSource = bagSource;
        // console.log('overrrrrr----------------------');
        // console.log('bagTarget', bagTarget);
        // console.log('bagSource', bagSource);
    }

    // private onOut(args: any) {
    //     if (this.dragName !== args[0]) return;
    //     const [bagName, elSource, bagTarget, bagSource, elTarget] = args;
    //     console.log('----------------------out');
    //     console.log('bagTarget', bagTarget);
    //     console.log('bagSource', bagSource);
    // }

    private createColumn(id: string, newWidth: any) {
        return {
            layoutType: "column",
            key: id,
            checked: false,
            order: 0,
            children: [],
            config: DefaultWidgetItemConfiguration.Column,
            width: newWidth,
        };
    }

    private resetCurrentItemSelection() {
        this.currentColumn = null;
        this.currentPanel = null;
        this.currentControl = null;
        this.currentLineBreak = null;
    }
    private buildColumnsWidth() {
        this.currentColumn.width = this.currentColumn.width / 2;
    }
    // private buildColumnsWidth(newColumnId: string) {
    //     const scaleWithForEachColumn = this.defaultColumnWidthPercent / (this.controlColumnList.length - 1);
    //     for (let column of this.controlColumnList) {
    //         if (column.key === newColumnId) continue;
    //         column.width = (column.width - scaleWithForEachColumn);
    //     }
    // }
    private buildColumnsWidthWhenRemove(deleteColumn: any) {
        const scaleWithForEachColumn =
            deleteColumn.width / this.controlColumnList.length;
        for (const column of this.controlColumnList) {
            column.width = column.width + scaleWithForEachColumn;
        }
    }
    // private buildColumnsWidth(newColumnId: string) {
    //     // 1. get all columns that have not resized by user yet without new column
    //     // Need sum all width of those columns and divide for remain columns
    //     const columnsNotResized = this.controlColumnList.filter(x => !x.isResized && x.key !== newColumnId);
    //     let columnsNotResizedWidth = 0;
    //     for (const col of columnsNotResized) {
    //         columnsNotResizedWidth += col.width;
    //     }
    //     let newColumnWidth = ((columnsNotResizedWidth - this.minColumnWidth) / columnsNotResized.length);
    //     newColumnWidth = (newColumnWidth < this.minColumnWidth ? this.minColumnWidth : newColumnWidth);
    //     for (const col of columnsNotResized) {
    //         col.width = newColumnWidth;
    //     }
    // }

    // private getColumnsWidth(isNewColumn?: boolean): number {
    //     return this._eref.nativeElement.parentElement.clientWidth/(this.controlColumnList.length + (isNewColumn ? 1 : 0));
    // }

    private makeDataWhenDragging(args) {
        const [name, el, bagTarget, bagSource] = args;
        if (!el.attributes["layout-type"]) return;
        this.isDisableDragToPanel =
            el.attributes["layout-type"].value == "panel";
        this.layoutTypeDragging = el.attributes["layout-type"].value;
        this.isIncludeLinebreak = this.hasDraggingLinebreak();
        if (this.isDisableDragToPanel) {
            this.currentItemControl = null;
            this.unCheckAllControlOfOtherColumn({}, "checked");
        } else {
            this.draggingItem = el;
        }
        if (this.currentItemControl && this.isControlPressing) {
            this.currentItemControl.checked = true;
        }
    }

    private setDataAfterDrag() {
        this.wfColumnComponents.forEach(
            (wfColumnComponent: WfColumnComponent) => {
                wfColumnComponent.updateColumnChildren();
            }
        );
        setTimeout(() => {
            this.onChangedHandler();
            this.callRenderScrollHandler();
            this.unCheckAllControlOfOtherColumn({}, "checked");
            this.addMultipleItemAfterDrag();
            this.isCancelDrag = this.isDragging = false;
            this.ref.markForCheck();
            this.ref.detectChanges();
        }, 300);
    }

    private hasDraggingLinebreak() {
        if (!this.checkedItems || !this.checkedItems.length) {
            return this.layoutTypeDragging === "lineBreak";
        }
        for (const item of this.checkedItems) {
            if (item.layoutType !== "lineBreak") continue;
            return true;
        }
        return false;
    }

    private addLinebreakToPanel() {
        let control;
        if (this.currentPanel) {
            control = this.currentPanel;
            if (this.currentControl || this.currentLineBreak) {
                control = this.currentControl || this.currentLineBreak;
                for (let i = 0; i < this.currentPanel.children.length; i++) {
                    if (this.currentPanel.children[i].key !== control.key)
                        continue;
                    this.currentPanel.children.splice(
                        i,
                        0,
                        this.createLinebreak()
                    );
                    this.reSetOrderNumber(this.currentPanel.children);
                    return {
                        isAdded: true,
                        control: control,
                    };
                }
            }
        } else if (this.currentControl || this.currentLineBreak) {
            control = this.currentControl || this.currentLineBreak;
        }
        return {
            isAdded: false,
            control: control,
        };
    }

    private addLinebreakToColumn(control: any) {
        if (control) {
            for (let i = 0; i < this.currentColumn.children.length; i++) {
                if (this.currentColumn.children[i].key !== control.key)
                    continue;
                this.currentColumn.children.splice(
                    i,
                    0,
                    this.createLinebreak()
                );
                break;
            }
        }
    }

    private createLinebreak() {
        return {
            layoutType: "lineBreak",
            title: "",
            key: Uti.guid(),
            checked: false,
            order: 0,
            children: [],
            config: "[]",
        };
    }

    private addMultipleItemAfterDrag() {
        if (this.checkedItems.length <= 1) {
            this.updateRenderData();
            return;
        }
        this.removeMultipleItemsAfterDrag();
        this.isFoundDragItem = false;
        for (const col of this.controlColumnList) {
            if (this.isFoundDragItem) break;
            this.addMultipleItemsToChildren(col.children);
        }
        this.updateRenderData();
    }

    private updateRenderData() {
        this.wfColumnComponents.forEach(
            (wfColumnComponent: WfColumnComponent) => {
                wfColumnComponent.updateRenderData();
            }
        );
    }

    private removeMultipleItemsAfterDrag() {
        // const isDraggingOnSelfColumn = this.isDraggingOnSelfColumn();
        for (const item of this.checkedItems) {
            if (
                item.key === this.draggingItem.id
                //&& isDraggingOnSelfColumn
            )
                continue;
            // Uti.removeItemInTreeArray(this.controlColumnList, item, 'key', 'children',
            //     (col) => {
            //         return col.key === this.currentColumn.key;
            //     });
            Uti.removeItemInTreeArray(
                this.controlColumnList,
                item,
                "key",
                "children"
            );
        }
    }

    private isDraggingOnSelfColumn() {
        const sourceColumn = this.getColumnByElement(this.bagSource);
        const targetColumn = this.getColumnByElement(this.bagTarget);
        return sourceColumn.key === targetColumn.key;
    }

    private getColumnByElement(el: any) {
        if (
            !el ||
            !el.attributes ||
            !el.attributes["layout-type"] ||
            !el.attributes["layout-type"].value
        )
            return null;
        if (el.attributes["layout-type"].value === "column") {
            return this.controlColumnList.find(
                (x) => x.key === el.attributes["elid"].value
            );
        }
        for (const col of this.controlColumnList) {
            for (const p of col.children) {
                if (p.layoutType !== "panel") continue;
                if (p.key === el.attributes["elid"].value) {
                    return col;
                }
            }
        }
        return null;
    }

    private addMultipleItemsToChildren(arr: Array<any>) {
        if (!arr || !arr.length || this.isFoundDragItem) return;
        for (let i = 0; i < arr.length; i++) {
            if (!arr) continue;
            this.addMultipleItemsToChildren(arr[i].children);
            if (arr[i].key !== this.draggingItem.id) continue;
            Uti.removeItemInArray(arr, arr[i], "key");
            arr = Uti.insertArrayAt(arr, i, this.checkedItems);
            this.reSetOrderNumber(arr);
            this.isFoundDragItem = true;
            return;
        }
    }

    private getCheckedItems(arr: Array<any>) {
        if (!arr || !arr.length) return;
        for (const item of arr) {
            if (item.checked && item.layoutType === "control") {
                this.checkedItems.push(item);
            }
            this.getCheckedItems(item.children);
        }
    }

    private getAllFields(arr: Array<any>) {
        if (!arr || !arr.length) return;
        for (const item of arr) {
            if (item.layoutType === "control") {
                item.checked = true;
                this.allFields.push(item);
            }
            this.getAllFields(item.children);
        }
    }

    private unCheckAllControlOfOtherColumn(column: any, propName: string) {
        for (const item of this.controlColumnList) {
            if (!item || item.key === column.key) continue;
            Uti.setValueForArray(item.children, propName, false);
        }
    }

    private changeIsEditingLayout(changes: SimpleChanges) {
        if (!this.hasChanges(changes["isEditingLayout"])) return;
        if (this.isEditingLayout) {
            this.initDragulaEvents();
            return;
        }
        if (this.onDraggingSubscription) {
            this.onDraggingSubscription.unsubscribe();
        }
        if (this.onClonedSubscription) {
            this.onClonedSubscription.unsubscribe();
        }
        if (this.onDragendSubscription) {
            this.onDragendSubscription.unsubscribe();
        }
    }

    private buildDataForControlColumnList() {
        // this.controlColumnList = cloneDeep(this.controlConfig);
        this.controlColumnList = this.getControlConfigFromProperties();
        this.controlColumnList = this.setConfigForColumnLayout(
            this.controlColumnList
        );
        this.setValueDataForControl();
        // this.buildColumnsWidth();
        this.sortByAll();
    }

    private setConfigForColumnLayout(layoutColumn: Array<any>) {
        return layoutColumn.map((x) => {
            const item = JSON.parse(x.config);
            return {
                layoutType: x.layoutType,
                key: x.key,
                order: x.order,
                width: x.width,
                children: x.children,
                config:
                    item.length > 0
                        ? this.filterValueForColumnConfig(item)
                        : DefaultWidgetItemConfiguration.Column,
            };
        });
    }

    private setValueDataForControl() {
        for (const column of this.controlColumnList) {
            for (const control of column.children) {
                switch (control.layoutType) {
                    case "control":
                        this.setDataForOriginalControl(control);
                        break;
                    case "panel":
                        this.buildDataForChildOfPanelList(control);
                }
            }
        }
    }

    private getControlConfigFromProperties() {
        const controlColumnPanel = Uti.getItemRecursive(
            this.widgetProperties,
            "ControlColumnPanel"
        );
        let columnLayout: Array<any> = [];
        if (controlColumnPanel) {
            columnLayout = JSON.parse(controlColumnPanel.value) || [];
        }
        if (columnLayout && columnLayout.length) {
            return this.moveUnExpectedFieldToFirstColumn(columnLayout);
        }
        return [
            {
                layoutType: "column",
                key: Uti.guid(),
                order: 1,
                checked: false,
                children: this.makeOrderFields(
                    cloneDeep(this.groupContentList)
                ),
                config: DefaultWidgetItemConfiguration.Column,
                // 'width': this._eref.nativeElement.parentElement.clientWidth
                width: 100,
                // 'width': this.getColumnsWidth(true)
            },
        ];
    }

    private moveUnExpectedFieldToFirstColumn(
        columnLayout: Array<any>
    ): Array<any> {
        for (const column of columnLayout) {
            this.removeUnExpectedFieldInChildren(column.children);
        }
        return this.addUnExpectedFieldToFirstColumn(columnLayout);
    }

    private removeUnExpectedFieldInChildren(arr: Array<any>) {
        if (!arr && !arr.length) return;
        for (const item of arr) {
            if (
                item.layoutType !== "control" ||
                this.isExistedInGroupContentList(item.key)
            ) {
                this.removeUnExpectedFieldInChildren(item.children);
                continue;
            }
            Uti.removeItemInArray(arr, item, "key");
        }
    }

    private addUnExpectedFieldToFirstColumn(
        columnLayout: Array<any>
    ): Array<any> {
        for (const item of this.groupContentList) {
            if (this.isExistedInControlLayout(columnLayout, item.key)) continue;
            columnLayout[0].children.push({
                layoutType: "control",
                key: item.key,
                order: columnLayout[0].children.length + 1,
                config: this.getFieldStyleConfig(item),
            });
        }
        return columnLayout;
    }

    private filterValueForColumnConfig(item) {
        if (!item || !item.length) return;
        const totalColumn = [];
        const defaultConfig = JSON.parse(DefaultWidgetItemConfiguration.Column);
        const columnSetting = Uti.getItemRecursive(
            defaultConfig,
            "ColumnStyle"
        );
        columnSetting.children = Uti.adjustPropertyForPanelSetting(
            columnSetting,
            item
        );
        totalColumn.push(columnSetting);
        return JSON.stringify(totalColumn);
    }

    private filterValueForPanelConfig(item) {
        if (!item || !item.length) return;
        const totalPanel = [];
        const defaultConfig = JSON.parse(DefaultWidgetItemConfiguration.Panel);
        const titleStyle = Uti.getItemRecursive(defaultConfig, "TitleStyle");
        const panelStyle = Uti.getItemRecursive(defaultConfig, "PanelStyle");
        const underLineStyle = Uti.getItemRecursive(
            defaultConfig,
            "UnderLineStyle"
        );
        const behaviourPanel = Uti.getItemRecursive(defaultConfig, "Behaviour");
        titleStyle.children = Uti.adjustPropertyForPanelSetting(
            titleStyle,
            item
        );
        totalPanel.push(titleStyle);
        panelStyle.children = Uti.adjustPropertyForPanelSetting(
            panelStyle,
            item
        );
        totalPanel.push(panelStyle);
        underLineStyle.children = Uti.adjustPropertyForPanelSetting(
            underLineStyle,
            item
        );
        totalPanel.push(underLineStyle);
        behaviourPanel.children = Uti.adjustPropertyForPanelSetting(
            behaviourPanel,
            item
        );
        totalPanel.push(behaviourPanel);
        return JSON.stringify(totalPanel);
    }

    private filterValueForFieldConfig(item) {
        if (!item || !item.length) return;
        const totalControl = [];
        const defaultConfig = JSON.parse(DefaultWidgetItemConfiguration.Field);
        const generalSetting = Uti.getItemRecursive(
            defaultConfig,
            "IGeneralSetting"
        );
        const labelSetting = Uti.getItemRecursive(defaultConfig, "ILabelStyle");
        const separateSetting = Uti.getItemRecursive(
            defaultConfig,
            "ISeparate"
        );
        const dataSetting = Uti.getItemRecursive(defaultConfig, "IDataStyle");
        generalSetting.children = Uti.adjustPropertyForPanelSetting(
            generalSetting,
            item
        );
        totalControl.push(generalSetting);
        labelSetting.children = Uti.adjustPropertyForPanelSetting(
            labelSetting,
            item
        );
        totalControl.push(labelSetting);
        separateSetting.children = Uti.adjustPropertyForPanelSetting(
            separateSetting,
            item
        );
        totalControl.push(separateSetting);
        dataSetting.children = Uti.adjustPropertyForPanelSetting(
            dataSetting,
            item
        );
        totalControl.push(dataSetting);
        return JSON.stringify(totalControl);
    }

    private getFieldStyleConfig(field: any) {
        if (!field.config || !JSON.parse(field.config).length) {
            return DefaultWidgetItemConfiguration.Field;
        }
        const fieldConfig = JSON.parse(field.config);

        // will remove after saved all new config
        const generalSetting = Uti.getItemRecursive(
            fieldConfig,
            "IGeneralSetting"
        );
        if (generalSetting) {
            const keyChildren = Object.keys(generalSetting).some(
                (v) => v === "children"
            );
            if (keyChildren) {
                return field.config;
            }
        }

        if (!generalSetting) {
            const valueMergeConfig =
                this.filterValueForFieldConfig(fieldConfig);
            return valueMergeConfig;
        }
    }
    private isExistedInControlLayout(
        columnLayout: Array<any>,
        key: string
    ): boolean {
        for (const col of columnLayout) {
            if (!this.isExistedInControlLayoutWithChildren(col.children, key))
                continue;
            return true;
        }
        return false;
    }

    private isExistedInControlLayoutWithChildren(
        arr: Array<any>,
        key: string
    ): boolean {
        if (!arr || !arr.length) return false;
        for (const control of arr) {
            if (
                this.isExistedInControlLayoutWithChildren(control.children, key)
            ) {
                return true;
            }
            if (control.key !== key) continue;
            return true;
        }
        return false;
    }

    private isExistedInGroupContentList(key: string): boolean {
        const item = this.groupContentList.find((x) => x.key === key);
        return !!(item && item.key);
    }

    private makeOrderFields(controls: Array<any>) {
        let visibleIndex = 1;
        let hiddenIndex = 1000;
        for (const item of controls) {
            item["layoutType"] = "control";
            if (!item.isHidden) {
                item["order"] = visibleIndex;
                visibleIndex++;
            }
            if (item.isHidden) {
                item["order"] = hiddenIndex;
                hiddenIndex++;
            }
        }
        return controls.sort((a, b) => {
            return Uti.sortBy(a, b, "order");
        });
    }

    private addControlForColumn(
        layoutType: string,
        title?: string,
        isRow?: boolean
    ) {
        this.currentColumn.children.push({
            layoutType: layoutType,
            title: title || "",
            key: Uti.guid(),
            isRow: isRow,
            checked: false,
            order: 0,
            children: [],
            config:
                layoutType === "panel"
                    ? DefaultWidgetItemConfiguration.Panel
                    : "[]",
        });
        this.reSetOrderNumber(this.currentColumn.children);
        this.setDirtyForChangeColumnLayout();
        this.resetCurrentItemSelection();
    }

    private buildDataForChildOfPanelList(control: any) {
        if (control.layoutType === TypeForm.Panel) {
            this.setConfigForPanelLayout(control);
        }
        for (const child of control.children) {
            this.setDataForOriginalControl(child);
        }
    }

    private setConfigForPanelLayout(panel) {
        const item = JSON.parse(panel.config);
        if (item[0].children) return;
        return item.length > 0
            ? (panel.config = this.filterValueForPanelConfig(item))
            : DefaultWidgetItemConfiguration.Panel;
    }

    private setDataForOriginalControl(original: any) {
        const control = this.groupContentList.find(
            (x) => x.key === original.key
        );
        if (!control) return;
        for (const prop in control) {
            if (prop === "order") continue;
            if (prop === "config") {
                original[prop] = this.getFieldStyleConfig(original);
                continue;
            }
            original[prop] = control[prop];
        }
    }

    private updateDatasourceForCombobox(currentControl: any) {
        const control = Uti.getItemRecursive(
            this.controlColumnList,
            currentControl.key,
            "key"
        );
        if (isEmpty(control)) return;
        control.options = currentControl.options;
    }

    // private buildColumnsWidth() {
    //     this.columnWidth = (100 / this.controlColumnList.length) + '%';
    // }

    private sortByAll() {
        let controlColumnList: any = cloneDeep(this.controlColumnList);
        controlColumnList = controlColumnList.sort((a, b) => {
            return Uti.sortBy(a, b, "order");
        });
        this.sortByAllObject(controlColumnList);
        this.controlColumnList = controlColumnList;
    }

    private sortByAllObject(arr: any) {
        for (const item of arr) {
            if (!item.children || !item.children.length) continue;
            item.children = item.children.sort((a, b) => {
                return Uti.sortBy(a, b, "order");
            });
            this.sortByAllObject(item.children);
        }
    }

    private reSetOrderNumber(arr: Array<any>) {
        for (let i = 1; i <= arr.length; i++) {
            if (!arr[i - 1]) continue;
            arr[i - 1]["order"] = i;
        }
    }

    private moveAllItemToBesideColumn(column: any) {
        for (let i = 0; i < this.controlColumnList.length; i++) {
            if (column.key !== this.controlColumnList[i].key) continue;
            if (i === 0) {
                this.controlColumnList[i + 1].children = [
                    ...this.controlColumnList[i + 1].children,
                    ...this.controlColumnList[i].children,
                ];
                break;
            }
            this.controlColumnList[i - 1].children = [
                ...this.controlColumnList[i - 1].children,
                ...this.controlColumnList[i].children,
            ];
            break;
        }
    }

    private setDirtyForChangeColumnLayout() {
        this.wfColumnComponents.forEach(
            (wfColumnComponent: WfColumnComponent) => {
                wfColumnComponent.updateRenderData();
            }
        );
        this.isChangeColumnLayoutAction.emit();
        this.callRenderScrollHandler();
    }

    private prepareSavingDataForColumnLayout() {
        const controlColumnPanel = Uti.getItemRecursive(
            this.widgetProperties,
            "ControlColumnPanel"
        );
        controlColumnPanel.value = JSON.stringify(
            this.makeSavingDataForColumnLayout(this.controlColumnList)
        );
    }

    private makeSavingDataForColumnLayout(items: Array<any>) {
        if (!items || !items.length) return [];
        return items.map((x) => {
            if (x.layoutType === TypeForm.Panel) {
                return {
                    layoutType: x.layoutType,
                    key: x.key,
                    order: x.order,
                    height: x.height,
                    width: x.width,
                    isRow: x.isRow,
                    title: x.title || "",
                    children: this.makeSavingDataForColumnLayout(x.children),
                    config: this.buildConfigForColumnLayout(x.config),
                };
            } else {
                return {
                    layoutType: x.layoutType,
                    key: x.key,
                    order: x.order,
                    height: x.height,
                    width: x.width,
                    children: this.makeSavingDataForColumnLayout(x.children),
                    config: this.buildConfigForColumnLayout(x.config),
                };
            }
        });
    }

    private buildConfigForColumnLayout(config) {
        if (!config) return;
        const parseConfig = JSON.parse(config);

        // panel
        const titleStyle = Uti.getItemRecursive(parseConfig, "TitleStyle");
        const panelStyle = Uti.getItemRecursive(parseConfig, "PanelStyle");
        const underLineStyle = Uti.getItemRecursive(
            parseConfig,
            "UnderLineStyle"
        );
        const behaviourPanel = Uti.getItemRecursive(parseConfig, "Behaviour");

        const generalSetting = Uti.getItemRecursive(
            parseConfig,
            "IGeneralSetting"
        );
        const labelSetting = Uti.getItemRecursive(parseConfig, "ILabelStyle");
        const separateSetting = Uti.getItemRecursive(parseConfig, "ISeparate");
        const dataSetting = Uti.getItemRecursive(parseConfig, "IDataStyle");

        const columnSetting = Uti.getItemRecursive(parseConfig, "ColumnStyle");

        if (columnSetting) {
            const reduceColumnSetting =
                Uti.filterValueInProperties(columnSetting);
            const totalColumn = [...reduceColumnSetting];
            return JSON.stringify(totalColumn);
        }

        if (titleStyle || panelStyle || underLineStyle || behaviourPanel) {
            const reduceTitlePanel = Uti.filterValueInProperties(titleStyle);
            const reducePanelStyle = Uti.filterValueInProperties(panelStyle);
            const reduceUnderLineStyle =
                Uti.filterValueInProperties(underLineStyle);
            const reduceBehaviourPanel =
                Uti.filterValueInProperties(behaviourPanel);
            const totalPanel = [
                ...reduceTitlePanel,
                ...reducePanelStyle,
                ...reduceUnderLineStyle,
                ...reduceBehaviourPanel,
            ];
            return JSON.stringify(totalPanel);
        }

        // control
        if (generalSetting || labelSetting || separateSetting || dataSetting) {
            const reduceGeneralSetting =
                Uti.filterValueInProperties(generalSetting);
            const reduceLabelSetting =
                Uti.filterValueInProperties(labelSetting);
            const reduceSeparateSetting =
                Uti.filterValueInProperties(separateSetting);
            const reduceDataSetting = Uti.filterValueInProperties(dataSetting);
            const totalControl = [
                ...reduceGeneralSetting,
                ...reduceLabelSetting,
                ...reduceSeparateSetting,
                ...reduceDataSetting,
            ];
            return JSON.stringify(totalControl);
        }
    }

    private queryWfFieldComponentsComponent() {
        if (!this.wfColumnComponents) return;
        this.wfFieldComponents.length = 0;
        this.wfColumnComponents.forEach(
            (wfColumnComponent: WfColumnComponent) => {
                this.wfFieldComponents = [
                    ...this.wfFieldComponents,
                    ...wfColumnComponent.queryWfFieldComponentsComponent(),
                ];
            }
        );
    }

    private checkOnlyItselfWhenClick(control: any) {
        if (
            control.layoutType !== "control" &&
            control.layoutType !== "lineBreak"
        ) {
            return;
        }
        setTimeout(() => {
            // If user click and drag immediatly then dont need reset item
            if (this.isDragging) return;
            this.uncheckAllWithoutItself(control);
            this.ref.markForCheck();
        }, 300);
    }

    private uncheckAllWithoutItself(control: any) {
        this.unCheckAllControlOfOtherColumn({}, "checked");
        if (control) {
            control.checked = true;
        }
    }

    private setThreeDotsForValueAfterResize(currentResizeColumn: any) {
        let found = false;
        for (const wfColumnComponent of (<any>this.wfColumnComponents)
            ._results) {
            if (found) {
                wfColumnComponent.setThreeDotsForValue();
                break;
            }
            if (currentResizeColumn.key !== wfColumnComponent.column.key)
                continue;
            found = true;
        }
    }

    private detetedChange() {
        this.ref.markForCheck();
        this.ref.detectChanges();
    }

    //#endregion [Column setting]
}
