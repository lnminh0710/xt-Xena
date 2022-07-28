import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import {
    GlobalSearchModuleModel,
    Module
} from 'app/models';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { PropertyPanelService, AppErrorHandler } from 'app/services';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Uti } from 'app/utilities/uti';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { MenuModuleId } from 'app/app.constants';

@Component({
    selector: 'app-gs-module-item',
    styleUrls: ['./gs-module-item.component.scss'],
    templateUrl: './gs-module-item.component.html'
})
export class GlobalSeachModuleItemComponent implements OnInit, OnDestroy {
    public moduleItem: GlobalSearchModuleModel;
    public resultValue: number;
    public globalNumberFormat = '';

    private globalPropertiesStateSubscription: Subscription;
    private globalPropertiesState: Observable<any>;

    @Input()
    set moduleItemConfig(moduleItemConfig: GlobalSearchModuleModel) {
        this.moduleItem = moduleItemConfig;
        this.changeDetectorRef();
    }

    @Output() onItemClick: EventEmitter<any> = new EventEmitter();
    @Output() onItemDoubleClick: EventEmitter<any> = new EventEmitter();

    constructor(
        private propertyPanelService: PropertyPanelService,
        private appErrorHandler: AppErrorHandler,
        private store: Store<AppState>,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.globalPropertiesState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, ModuleList.Base.moduleNameTrim).globalProperties);
    }

    public ngOnInit() {
        this.subscribeGlobalProperties()
    }

    public ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    public globalItemClicked() {
        this.onItemClick.emit(this.moduleItem);
    }

    public globalItemDoubleClicked() {

        if ((//this.moduleItem.idSettingsGUI == MenuModuleId.selectionCampaign
            this.moduleItem.idSettingsGUI == MenuModuleId.selectionBroker
            || this.moduleItem.idSettingsGUI == MenuModuleId.selectionCollect) &&
            (this.moduleItem.children && this.moduleItem.children.length)) {
            return;
        }

        //Always allow
        this.onItemDoubleClick.emit(this.moduleItem);
    }

    private subscribeGlobalProperties() {
        this.globalPropertiesStateSubscription = this.globalPropertiesState.subscribe((globalProperties: any) => {
            this.appErrorHandler.executeAction(() => {
                if (globalProperties) {
                    this.globalNumberFormat = this.propertyPanelService.buildGlobalNumberFormatFromProperties(globalProperties);
                }
            });
        });
    }

    private changeDetectorRef() {
        setTimeout(() => {
            this._changeDetectorRef.markForCheck();
            this._changeDetectorRef.detectChanges();
        }, 300);
    }
}
