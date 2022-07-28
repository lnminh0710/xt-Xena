import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import {Uti} from 'app/utilities';
import {AppErrorHandler} from 'app/services';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {AppState} from 'app/state-management/store';
import {ToasterService} from 'angular2-toaster/angular2-toaster';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import {Module, WidgetType} from 'app/models';
import cloneDeep from 'lodash-es/cloneDeep';

@Component({
    selector: 'property-panel-show-dropdown-focus',
    styleUrls: ['./property-panel-show-dropdown-focus.component.scss'],
    templateUrl: './property-panel-show-dropdown-focus.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyPanelShowDropdownFocusComponent implements OnInit, OnDestroy {

    public showDialog = false;
    public displayFields: any[] = [];
    perfectScrollbarConfig: any;
    private propertiesParentData: any;
    private propertiesParentDataState: Observable<any>;
    private propertiesParentDataStateSubscription: Subscription;
    private widgetTemplateSettingServiceSubscription: Subscription;

    @Input() usingModule: Module;

    @Output() onApply = new EventEmitter<any>();

    constructor(
        private store: Store<AppState>,
        private toasterService: ToasterService,
        private appErrorHandler: AppErrorHandler,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.propertiesParentDataState = this.store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.usingModule.moduleNameTrim).propertiesParentData);
    }

    ngOnInit() {
        this.subscribePropertiesParentDataState();
        this.initPerfectScroll();

    }


    private initPerfectScroll() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }


    public open(item) {
        this.showDialog = true;
        this.displayFields = item.options;
        // if (this.propertiesParentData.idRepWidgetType === WidgetType.EditableGrid && item.options.length >= 0) {
        //     if (item.options && item.options.length > 0) {
        //         this.displayFields = cloneDeep(item.options)
        //         this.changeDetectorRef.markForCheck();
        //         return;
        //     }
        //     const objColumnSettings = this.propertiesParentData.contentDetail.columnSettings;
        //     for (const key of Object.keys(objColumnSettings)) {
        //         const setting = Uti.getCloumnSettings(objColumnSettings[key].Setting);
        //         const isHidden = setting.DisplayField && setting.DisplayField.Hidden && parseInt(setting.DisplayField.Hidden, 10) > 0;
        //         const comboboxType = objColumnSettings[key].Setting && objColumnSettings[key].Setting.length > 0 &&
        //             objColumnSettings[key].Setting[0].ControlType && objColumnSettings[key].Setting[0].ControlType.Type.toLowerCase() === 'combobox';
        //         if (setting) {
        //             if (comboboxType || objColumnSettings[key].DataType === 'datetime') {
        //                 const haveSelected = item.options && item.options.length > 0 && item.options.forEach(x => x.selected);
        //                 item.options.push({
        //                     value: objColumnSettings[key].ColumnName,
        //                     hidden: isHidden,
        //                     dataType: objColumnSettings[key].DataType,
        //                     selected: haveSelected ? haveSelected : null,
        //                 });
        //                 item.options.map(x => {
        //                     if (comboboxType) {
        //                         x.dataType = objColumnSettings[key].Setting[0].ControlType.Type;
        //                     }
        //                 });
        //                 this.displayFields = cloneDeep(item.options);
        //             }
        //         }
        //
        //     }
        // } else if (this.propertiesParentData.idRepWidgetType === WidgetType.FieldSet && item.options.length >= 0) {
        //     if (item.options && item.options.length > 0) {
        //         this.displayFields = cloneDeep(item.options);
        //         this.changeDetectorRef.markForCheck();
        //         return;
        //     }
        //     this.propertiesParentData.contentDetail.data[1].filter((value) => {
        //             const fieldReadOnly = JSON.parse(value.Setting);
        //             const setting = Uti.getCloumnSettings(fieldReadOnly);
        //             const isReadOnly = setting.DisplayField && setting.DisplayField.ReadOnly && parseInt(setting.DisplayField.ReadOnly, 10) > 0;
        //             const isHidden = setting.DisplayField && setting.DisplayField.Hidden && parseInt(setting.DisplayField.Hidden, 10) > 0;
        //             if (!isReadOnly) {
        //                 if (value.DataType.toLowerCase() === 'combo-box' || value.DataType.toLowerCase() === 'datetime') {
        //                     item.options.push({
        //                         value: value.ColumnName,
        //                         hidden: isHidden,
        //                         dataType: value.DataType,
        //                         selected: null,
        //                     });
        //                     this.displayFields = cloneDeep(item.options);
        //                 }
        //             }
        //         }
        //     );
        //
        // }
        this.changeDetectorRef.markForCheck();
    }

    public close() {
        this.showDialog = false;
        this.changeDetectorRef.markForCheck();
    }

    public apply() {
        this.close();
        this.onApply.emit(this.displayFields.filter(v => v.selected === true || v.selected === false));

    }

    private subscribePropertiesParentDataState() {
        this.widgetTemplateSettingServiceSubscription = this.propertiesParentDataStateSubscription = this.propertiesParentDataState.subscribe((propertiesParentDataState: any) => {
            this.appErrorHandler.executeAction(() => {
                if (!propertiesParentDataState) return;
                this.propertiesParentData = cloneDeep(propertiesParentDataState || {});
            });
        });
    }
}
