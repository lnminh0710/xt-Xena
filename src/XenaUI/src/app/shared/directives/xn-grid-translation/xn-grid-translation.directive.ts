import { Input, Directive, EventEmitter, Output, OnDestroy, OnInit, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Store, ReducerManagerDispatcher } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { Subscription } from 'rxjs/Subscription';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import {
    ModuleService, AppErrorHandler, PropertyPanelService, ModalService, CommonService, GlobalSettingService, ResourceTranslationService
} from 'app/services';
import { Module, WidgetDetail, ApiResultResponse, WidgetPropertyModel } from 'app/models';
import { Uti } from 'app/utilities';
import { XnAgGridComponent } from 'app/shared/components/xn-control/xn-ag-grid/pages/ag-grid-container/xn-ag-grid.component';
import { WidgetModuleComponent } from 'app/shared/components/widget';
import { AgGridService } from 'app/shared/components/xn-control/xn-ag-grid/shared/ag-grid.service';
import { TranslateDataTypeEnum, TranslateModeEnum, RepWidgetAppIdEnum } from 'app/app.constants';
import { LanguageCellRenderer } from 'app/shared/components/xn-control/xn-ag-grid/components';
import { TranslateService } from '@ngx-translate/core';

@Directive({
    selector: '[gridTranslation]',
    inputs: ['gridInstance: gridTranslation'],
})

export class GridTranslationDirective implements OnDestroy, OnInit {
    private activeTranslateField: string;
    private translateColDetailSubscription: Subscription;
    private cellEditingStoppedSubscription: Subscription;
    private saveWidgetSubscription: Subscription;
    private dataChangeSubscription: Subscription;
    private isSytemTranslate: boolean = false;

    private languageKey = 'Language';
    private edittingData: any;
    private successSavedSubscription: Subscription;

    private _parentInstance: WidgetModuleComponent;
    @Input() set parentInstance(instance){
        this._parentInstance = instance;
        this.registerEventFromParentInstance();
    }

    get parentInstance(){
        return this._parentInstance;
    }

    @Input() currentModule: Module;

    private _gridInstance;
    set gridInstance(instance: XnAgGridComponent) {
        if (instance) {
            this._gridInstance = instance;
            this.registerEventFromGrid();
        }
    }

    get gridInstance() {
        return this._gridInstance;
    }

    private _widgetDetail: WidgetDetail;
    @Input() set widgetDetail(data: WidgetDetail) {
        if (data) {
            this._widgetDetail = data;
        }
    }
    get widgetDetail() {
        return this._widgetDetail;
    }

    private _allowTranslation = false;
    @Input() set allowTranslation(status) {
        this._allowTranslation = status;
        if (status) {
            this.getTranslateLanguageList();
            if (this.parentInstance && this.parentInstance.widgetMenuStatusComponent) {
                this.parentInstance.widgetMenuStatusComponent.toggleTranslationTableControlButtons();
            }
        }
        else {
            if (this.edittingData && Object.keys(this.edittingData).length) {
                this.parentInstance.isTableEdited = false;
                this.parentInstance.isWidgetDataEdited = false;
                this.parentInstance.resetWidget();
            }
            this.activeTranslateField = null;
            this.currentColDetailTranslate = null;
            this.removeAllTranslateCol();
            //if (this.gridInstance) {
            //    this.gridInstance.isEditting = false;
            //}
        }
    }

    get allowTranslation() {
        return this._allowTranslation;
    }

    constructor(private store: Store<any>,
        private appErrorHandler: AppErrorHandler,
        private commonService: CommonService,
        private globalSettingService: GlobalSettingService,
        private translate: TranslateService,
        private resourceTranslationService: ResourceTranslationService
        ) {
        this.subscribeData();
    }

    public ngOnInit() {
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public registerEventFromParentInstance() {
        this.saveWidgetSubscription = this.parentInstance.onSaveWidget.subscribe(() => {
            if (this.gridInstance) {
                this.gridInstance.stopEditing();
            }
            setTimeout(() => {
                this.saveTranslation();
            });
        });

        this.successSavedSubscription = this.resourceTranslationService.successSaved$.subscribe(status => {
            if (status) {
                this.systemTranlateHandler();
            }
        });
    }

    private currentColDetailTranslate: any;


    private registerEventFromGrid() {

        this.dataChangeSubscription = this.gridInstance.onGridReady.subscribe(() => {
            this.systemTranlateHandler();
        });

        this.dataChangeSubscription = this.gridInstance.onDataChanged.subscribe((data) => {
            this.systemTranlateHandler();
            if (this.allowTranslation && this.currentColDetailTranslate) {
                let isTranslateColExists = this.isTranslateColExists();
                if (!isTranslateColExists) {
                    this.getTranslateLanguageList();
                }
                this.getTranslateLanguageFromSelectedCol(this.currentColDetailTranslate);
            }
        });

        this.translateColDetailSubscription = this.gridInstance.onTranslateColDetail.subscribe((data: any) => {
            this.currentColDetailTranslate = data;
            this.getTranslateLanguageFromSelectedCol(data);
        });

        this.cellEditingStoppedSubscription = this.gridInstance.cellEditingStopped.subscribe((data) => {
            if (data) {
                this.updateEdittingData(data);
            }
        });

        this.gridInstance.preventDefault = (params) => {
            let isPrevented = false;
            if (this.allowTranslation) {
                if (params && params.column && params.column.getColDef()) {
                    const colDef = params.column.getColDef();
                    if (colDef.colId && colDef.colId.indexOf('translateCol_') < 0) {
                        isPrevented = true;
                    }
                    else {
                        if (!this.activeTranslateField) {
                            isPrevented = true;
                        }
                    }
                }
            }
            return isPrevented;
        }
    }

    private systemTranlateHandler() {
        if (this.widgetDetail && this.widgetDetail.idRepWidgetApp == RepWidgetAppIdEnum.SystemTranslateText) {
            if (this.gridInstance.api && this.gridInstance.columnApi) {
                this.isSytemTranslate = true;
                this.parentInstance.widgetMenuStatusComponent.settings.btnWidgetTranslation.enable = false;
                let isTranslateColExists = this.isTranslateColExists();
                if (!isTranslateColExists) {
                    this.getTranslateLanguageList(() => {
                        this.getSystemTranslate();
                        this.gridInstance.loadColumnLayout();
                    });
                }
                else {
                    this.getSystemTranslate();
                }
            }
        }
    }

    private getSystemTranslate() {
        const originalField = 'OriginalText';
        this.activeTranslateField = 'OriginalText';
        this.gridInstance.stopEditing();
        let nodeItems = this.gridInstance.getCurrentNodeItems();
        nodeItems.filter(node => {
            node = Object.assign(node, this.emptyLanguage);
        });
        this.globalSettingService.getSystemTranslateText()
            .subscribe((response) => {
                if (response) {
                    const resultList: Array<any> = response.data[1];
                    this.processTranslateData(resultList, nodeItems, originalField, true);
                }
            });
    }

    private getTranslateLanguageFromSelectedCol(data) {
        if (data) {
            const keywords : Array<any> = data.keywords;
            const originalField = data.field;
            this.activeTranslateField = data.activeTranslate ? data.field : null;
            let strArr: Array<string> = [];
            keywords.forEach((item) => {
                if (item) {
                    if (typeof item == 'object') {
                        strArr.push(item.value);
                    }
                    else {
                        strArr.push(item);
                    }
                }
            });
            const originalValue = strArr.join(';');
            const widgetMainID = '' + this.widgetDetail.idRepWidgetApp;
            const widgetCloneID = this.widgetDetail.id;
            const translateDataType = TranslateDataTypeEnum.Data;

            // this.gridInstance.disabledAll = originalValue ? false : true;
            this.gridInstance.stopEditing();

            let nodeItems = this.gridInstance.getCurrentNodeItems();
            nodeItems.filter(node => {
                node = Object.assign(node, this.emptyLanguage);
            });

            if (!originalValue) {
                this.gridInstance.updateRowData(nodeItems);
                return;
            }

            const tableName = this.globalSettingService.getFieldTableName(originalField, this.widgetDetail);
            this.globalSettingService.getMultiTranslateLabelText(originalValue, widgetMainID, widgetCloneID, translateDataType + '', null, originalField, tableName)
                .subscribe((response) => {
                    if (response) {
                        const resultList: Array<any> = response.data[1];
                        this.processTranslateData(resultList, nodeItems, originalField, false);
                        //    resultList.forEach(item => {
                        //        const keyword = item.Keyword;
                        //        const idRepLanguage = item.IdRepLanguage
                        //        const translateText = item.OnlyThisWidgetTranslateText || item.AllTranslateText;
                        //        // const nodes = nodeItems.filter(p => p[originalField] == keyword);
                        //        const nodes = nodeItems.filter(item => {
                        //            if (item[originalField]) {
                        //                if (typeof item[originalField] == 'object') {
                        //                    return item[originalField].value == keyword;
                        //                }
                        //                else {
                        //                    return item[originalField] == keyword;
                        //                }
                        //            }
                        //            return false;
                        //        });

                        //        if (nodes && nodes.length) {
                        //            nodes.forEach(node => {
                        //                node[idRepLanguage] = {
                        //                    key: item.OnlyThisWidgetIdTranslateLabelText,
                        //                    value: item.OnlyThisWidgetTranslateText || item.AllTranslateText
                        //                };
                        //            });
                        //        }
                        //    });
                        //    this.gridInstance.updateRowData(nodeItems);
                        //    this.edittingData = {};
                    }
                });
        }
    }

    private processTranslateData(resultList, nodeItems, originalField, isForSystemTranslate) {
        if (resultList && resultList.length) {
            resultList.forEach(item => {
                const keyword = item.Keyword;
                const idRepLanguage = item.IdRepLanguage
                const translateText = isForSystemTranslate ? item.AllTranslateText : item.OnlyThisWidgetTranslateText;
                const key = isForSystemTranslate ? item.AllIdTranslateLabelText : item.OnlyThisWidgetIdTranslateLabelText;
                // const nodes = nodeItems.filter(p => p[originalField] == keyword);
                const nodes = nodeItems.filter(item => {
                    if (item[originalField]) {
                        if (typeof item[originalField] == 'object') {
                            return item[originalField].value == keyword;
                        }
                        else {
                            return item[originalField] == keyword;
                        }
                    }
                    return false;
                });

                if (nodes && nodes.length) {
                    nodes.forEach(node => {
                        node[idRepLanguage] = {
                            key: key,
                            value: translateText
                        };
                    });
                }
            });
        }

        //this.gridInstance.updateRowData(nodeItems);
        this.gridInstance.removeAllRowNodes();
        this.gridInstance.api.updateRowData({ add: nodeItems });
        this.edittingData = {};
    }

    private updateEdittingData(cellData) {
        if (!this.edittingData) {
            this.edittingData = {};
        }
        if (this.activeTranslateField) {
            const data = cellData.data;
            let keyword;
            const field = data[this.activeTranslateField];
            keyword = field;
            if (field && typeof field == 'object') {
                keyword = field.value;
            }
            if (!keyword) {
                return;
            }
            const languageId = cellData.col.colDef.field;
            if (!this.edittingData[keyword]) {
                this.edittingData[keyword] = {};
            }
            this.edittingData[keyword][languageId] = {
                value: (cellData.value && cellData.value.value) ? cellData.value.value : '',
                idTranslateLabelText: (cellData.value && cellData.value.key) ? cellData.value.key : null
            }
        }
    }

    prepareDataFroSaving(editData): any {
        const result = [];
        const translateDataType = this.isSytemTranslate ? TranslateDataTypeEnum.System : TranslateDataTypeEnum.Data;
        const widgetMainID = '' + this.widgetDetail.idRepWidgetApp;
        const widgetCloneID = this.widgetDetail.id;
        (editData as Array<any>).forEach((item) => {
            let originalField = item.FieldName;
            let editingText : string = item.OriginalText;
            const tableName = this.globalSettingService.getFieldTableName(originalField, this.widgetDetail);
            const  isDeleted = isEmpty(item.TranslateText);
            if (!(isDeleted && (isNil(item.IdTranslateLabelText) || item.IdTranslateLabelText <= 0))) {
                const isModeAll = item.Mode === TranslateModeEnum.All;
                result.push({
                    'IdTranslateLabelText': item.IdTranslateLabelText > 0 ? item.IdTranslateLabelText : null,
                    'IdRepTranslateModuleType': translateDataType,
                    'IdRepLanguage': item.IdRepLanguage,
                    'TableName': tableName,
                    'WidgetMainID': this.isSytemTranslate ? null : widgetMainID,
                    'WidgetCloneID': this.isSytemTranslate ? null : widgetCloneID,
                    'OriginalText': editingText.trim(),
                    'TranslatedText': item.TranslateText,
                     // 'IsDeleted': isDeleted ? '1' : null,
                    'FieldName': originalField
                });
            }
        });
        return { 'Translations': result };
    }

    private saveTranslation() {
        let resultItem = [];
        if (this.edittingData) {
            const keywords = Object.keys(this.edittingData);
            if (keywords && !keywords.length) {
                return;
            }
            for (const keyword of keywords) {
                const language = this.edittingData[keyword];
                const idRepLanguages = Object.keys(language);
                for (const idRepLanguage of idRepLanguages) {
                    resultItem.push({
                        IdRepLanguage: idRepLanguage,
                        TranslateText: language[idRepLanguage].value,
                        IdTranslateLabelText: language[idRepLanguage].idTranslateLabelText,
                        OriginalText: keyword,
                        FieldName: this.activeTranslateField
                    });
                }
            }
            const saveData = this.prepareDataFroSaving(resultItem);
            if (saveData.Translations && saveData.Translations.length) {
                this.globalSettingService.saveTranslateLabelText(saveData).subscribe(
                    (response) => {
                        this.appErrorHandler.executeAction(() => {
                            if (response && response.eventType === 'Successfully') {
                                this.parentInstance.updateTableStatusAfterCompletedSaving();
                                let lang = this.translate.currentLang || this.translate.defaultLang;
                                this.translate.resetLang(lang);
                                let newLang = lang == 'en' ? 'en_' : 'en';
                                this.translate.use(newLang).subscribe((data) => {
                                    this.resourceTranslationService.saveSuccess();
                                });
                            }
                        });
                    }
                );
            }
        }
    }

    private subscribeData() {

    }

    /**
     * getTranslateLanguageList
     */
    private getTranslateLanguageList(callback?) {
        this.commonService.getListComboBox(this.languageKey)
            .finally(() => {
                if (callback) {
                    callback();
                }
            })
            .subscribe((response: ApiResultResponse) => {
                this.appErrorHandler.executeAction(() => {
                    if (!Uti.isResquestSuccess(response)) {
                        return;
                    }
                    this.onGetComboboxDataSuccess(response.item);
                });
            });
    }

    private languageList: Array<any> = [];
    private emptyLanguage: any = {};

    private onGetComboboxDataSuccess(comboboxData) {
        let cols = [];
        this.emptyLanguage = {};
        let options: any[] = comboboxData[this.languageKey];
        this.languageList = options;
        options.forEach((item) => {
            this.emptyLanguage[item.idValue] = null;
            let isEnglishSystemTranslate = this.isSytemTranslate && item.idValue == '4';
            let pinnedMode = this.isSytemTranslate  ? '' : 'right';
            cols.push({
                headerName: item.textValue,
                field: item.idValue,
                colId: 'translateCol_' + item.idValue,
                // lockPosition: true,
                pinned: pinnedMode,
                editable: this.buildEditable.bind(this),
                // cellRendererFramework: LanguageCellRenderer,
                cellEditorFramework: LanguageCellRenderer,
                valueFormatter: this.languageFormatter.bind(this),
                width: 90,
                minWidth: 90,
                headerClass: 'translation-col',
                comparator: this.customComparator
            });
        });

        cols = cols.sort(function (x, y) {
            if (x.field == '4') {
                return -1;
            }
            else if (y.field == '4') {
                return 1;
            }
            return 0;
            // return x.field == '4' ? -1 : y.field == '4' ? 1 : 0;
        });

        const columns = this.gridInstance.columnApi.getAllColumns();
        const currentColDefs = columns.map(p => p.getColDef());
        this.gridInstance.api.setColumnDefs([...currentColDefs, ...cols]);
        this.gridInstance.api.sizeColumnsToFit();
        /*
        if (this.activeTranslateField) {
            this.gridInstance.disabledAll = false;
        }
        else {
            this.gridInstance.disabledAll = true;
        }*/
    }

    private customComparator(v1, v2) {
        if (!v1 && !v2) {
            return 0;
        }
        if (!v1) {
            return -1;
        }
        if (!v2) {
            return 1;
        }
        if (v1.value < v2.value) {
            return -1;
        }
        if (v1.value > v2.value) {
            return 1;
        }
        return 0;
    }

    private buildEditable(params) {
        let allowEdit = false;
        if (this.activeTranslateField) {
            allowEdit = true;
        }
        return allowEdit;
    }

    /**
     * languageFormatter
     * @param params
     */
    public languageFormatter(params) {
        if (params && params.value && params.value.value) {
            return params.value.value;
        }
        return '';
    }

    /**
     * isTranslateColExists
     */
    private isTranslateColExists() {
        const columns = this.gridInstance.columnApi.getAllColumns();
        const currentColDefs = columns.map(p => p.getColDef());
        const rs = currentColDefs.find(p => (p.colId && p.colId.indexOf('translateCol_') >= 0));
        return rs != null;
    }

    private removeAllTranslateCol() {
        if (this.gridInstance && this.gridInstance.columnApi) {
            const columns = this.gridInstance.columnApi.getAllColumns();
            const currentColDefs = columns.map(p => p.getColDef());
            const cols = currentColDefs.filter(p => (!p.colId || (p.colId && p.colId.indexOf('translateCol_') < 0)));
            this.gridInstance.api.setColumnDefs(cols);
        }
        if (this.gridInstance.columnsLayoutSettings) {
            this.gridInstance.loadColumnLayout();
        }
    }
}
