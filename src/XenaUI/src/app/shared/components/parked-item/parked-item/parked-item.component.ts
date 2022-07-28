import { Component, Output, EventEmitter, Input, OnInit, ViewChild, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import isEmpty from 'lodash-es/isEmpty';

import {
    ParkedItemModel,
    Module
} from 'app/models';
import { ParkedItemService, PropertyPanelService, AppErrorHandler } from 'app/services';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { WidgetDataUpdated } from 'app/state-management/store/reducer/widget-content-detail';

import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MenuModuleId, Configuration } from 'app/app.constants';
import { parse, format } from 'date-fns/esm';
import * as widgetContentReducer from 'app/state-management/store/reducer/widget-content-detail';
import { Uti } from 'app/utilities';
import { CustomAction, ProcessDataActions } from 'app/state-management/store/actions';

@Component({
    selector: 'parked-item',
    styleUrls: ['./parked-item.component.scss'],
    templateUrl: './parked-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '(mousedown)': 'onMouseDown($event, parkedItem)'
    }
})

export class ParkedItemComponent implements OnInit, OnDestroy {

    @ViewChild(PerfectScrollbarDirective) directiveScroll;
    public parkedItem: ParkedItemModel;
    private config: Array<any> = [];
    public parkedItemFields: Array<any> = [];
    public perfectScrollbarConfig: any = {};
    public globalDateFormat: string = '';
    private isSelected = false;
    public isSelectionProject = false;
    public selectedParkedItemLocal: ParkedItemModel;

    private widgetDataUpdatedState: Observable<WidgetDataUpdated>;

    private widgetDataUpdatedStateSubscription: Subscription;
    private editingFormDataSubscription: Subscription;

    @Input() accessRight: any = {};
    @Input() smallHeight = false;
    @Input() isNewItem: boolean;
    @Input() subModules: Module[] = [];
    @Input() activeModule: Module = null;
    @Input() allowClose = true;
    @Input()
    set data(data: any) {
        setTimeout(() => {
            this.parkedItem = data.item;
            this.config = data.fieldConfig;

            if ((this.config && !this.isNewItem) || (this.standAlone && this.isNewItem)) {
                this.buildDisplayFields();
            }

            this.initPerfectScroll();
            this.ref.markForCheck();
        }, 200);
    }

    @Input() isNewInsertedItem: boolean;
    @Input() standAlone = false;

    @Input() set globalProperties(globalProperties: any[]) {
        this.globalDateFormat = this.propertyPanelService.buildGlobalDateFormatFromProperties(globalProperties);
    }
    @Input() set selectedParkedItem(selectedParkedItem: ParkedItemModel) {
        this.selectedParkedItemLocal = selectedParkedItem;

        this.initPerfectScroll();

        this.ref.markForCheck();
    }

    @Output() onClose: EventEmitter<ParkedItemModel> = new EventEmitter();
    @Output() onSelect: EventEmitter<ParkedItemModel> = new EventEmitter();

    constructor(
        private parkedItemService: ParkedItemService,
        private store: Store<AppState>,
        private ref: ChangeDetectorRef,
        private propertyPanelService: PropertyPanelService,
        private appErrorHandler: AppErrorHandler,
        private uti: Uti,
        private dispatcher: ReducerManagerDispatcher
    ) {
        this.isSelectionProject = Configuration.PublicSettings.isSelectionProject;

        this.widgetDataUpdatedState = this.store.select(state => widgetContentReducer.getWidgetContentDetailState(state, this.activeModule.moduleNameTrim).widgetDataUpdated);
    }

    ngOnInit(): void {
        this.perfectScrollbarConfig = {
            suppressScrollX: true,
            suppressScrollY: true
        };

        this.subscribeWidgetDetailState();
        this.subscribeEditingFormData();
        this.parkedItem = new ParkedItemModel();
        this.ref.markForCheck();
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    private initPerfectScroll() {
        if (this.selectedParkedItemLocal && this.parkedItem) {
            let selected = this.selectedParkedItemLocal && this.selectedParkedItemLocal.id && this.selectedParkedItemLocal.id.value == this.parkedItem.id.value;
            this.isSelected = selected;
            this.perfectScrollbarConfig.suppressScrollY = selected ? false : true;
            this.directiveScroll.ngOnDestroy();
            this.directiveScroll.ngAfterViewInit();
        }
    }

    private subscribeWidgetDetailState() {
        this.widgetDataUpdatedStateSubscription = this.widgetDataUpdatedState.subscribe((widgetDataUpdatedState: WidgetDataUpdated) => {
            this.appErrorHandler.executeAction(() => {
                if (!isEmpty(widgetDataUpdatedState)
                    && this.isSelected
                    && widgetDataUpdatedState.updateInfo
                    //&& this.parkedItemService.isUpdateInfoKeyEqualCurrentParkedItem(this.parkedItem, widgetDataUpdatedState)
                ) {
                    this.parkedItem = this.parkedItemService.mergeUpdateInfoData(this.parkedItem, widgetDataUpdatedState);
                    this.buildDisplayFields();
                    this.ref.markForCheck();
                }
            });
        });
    }

    private subscribeEditingFormData() {
        this.editingFormDataSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === ProcessDataActions.EDITING_FORM_DATA && action.module.idSettingsGUI == this.activeModule.idSettingsGUI;
        }).subscribe((action: CustomAction) => {
            this.appErrorHandler.executeAction(() => {
                if (action.payload && this.standAlone && this.isNewItem) {
                    this.mapFormDataToParkedItem(action.payload, this.parkedItemFields);

                    this.ref.markForCheck();
                }
            });
        });
    }

    onMouseDown(event: any, parkedItem) {
        if ($(event.target).closest('button.close-btn').length <= 0)
            this.onSelect.emit(parkedItem);
        else if (this.allowClose)
            this.close(parkedItem);
    }

    close(parkedItem) {
        this.onClose.emit(parkedItem);
    }

    private mapFormDataToParkedItem(formData, parkedItemFields: any[]) {
        for (const field in formData) {
            if (!formData[field]) {
                continue;
            }

            if (typeof formData[field] === 'object') {
                for (const subField in formData[field]) {
                    let found = parkedItemFields.find(x => x.fieldName == subField || this.lowerFirstChar(x.fieldName) == subField);
                    if (found) {
                        found.fieldValue = formData[field][subField];
                    }
                }
            } else {
                let found = parkedItemFields.find(x => x.fieldName === field || this.lowerFirstChar(x.fieldName) == field);
                if (found) {
                    found.fieldValue = formData[field];
                }
            }
        }
    }

    private buildDisplayFields() {
        this.parkedItemFields = [];

        if (this.standAlone && this.isNewItem) {
            for (let i = 0; i < this.config.length; i++) {
                if (this.config[i].fieldName.toLowerCase() !== 'idperson') {
                    this.parkedItemFields.push({
                        fieldName: this.config[i].fieldName,
                        fieldValue: '',
                        icon: this.config[i].icon,
                        tooltipPlacement: this.parkedItemService.buildTooltipPlacement(this.config[i].fieldName)
                    });
                }
            }
        } else {
            for (const name in this.parkedItem) {
                if (!this.parkedItem[name]) {
                    continue;
                }

                const allowedField = this.parkedItemService.buildFieldFromConfig(name, this.parkedItem, this.config);
                if (allowedField) {
                    if (allowedField.fieldName && allowedField.fieldName.toLowerCase().indexOf('date') > -1 && allowedField.fieldValue) {
                        allowedField.fieldValue = parse(allowedField.fieldValue, 'dd.MM.yyyy', new Date());
                    }
                    this.parkedItemFields.push(allowedField);
                }
            }
        }

        if (this.activeModule
            && this.activeModule.idSettingsGUI === MenuModuleId.administration
            && this.parkedItem['idSettingsGUI']
            && this.parkedItem['idSettingsGUI'].value) {
            const activeSubModule = this.parkedItemService.getActiveSubModule(this.subModules, this.parkedItem['idSettingsGUI'].value);
            if (activeSubModule) {
                const titleField = {
                    fieldName: activeSubModule.moduleName,
                    fieldValue: activeSubModule.moduleName,
                    icon: activeSubModule.iconName,
                    tooltipPlacement: 'top'
                };

                this.parkedItemFields.push(titleField);

                this.parkedItemService.moveHeaderToTop(activeSubModule.moduleName, this.parkedItemFields);
            }
        } else {
            this.parkedItemService.moveHeaderToTop('personNr', this.parkedItemFields);
        }
    }

    public itemsTrackBy(index, item) {
        return item ? item.fieldName : undefined;
    }

    public formatDate(date) {
        try {
            return date ? this.uti.formatLocale(date, this.globalDateFormat) : '';
        } catch (error) {
            return '';
        }
    }

    private lowerFirstChar(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }
}
