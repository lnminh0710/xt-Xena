import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppState } from 'app/state-management/store';
import { SubLayoutInfoState } from 'app/state-management/store/reducer/layout-info';
import isEmpty from 'lodash-es/isEmpty';
import { MenuModuleId, WarehouseMovementFormEnum } from 'app/app.constants';
import { ModuleState } from 'app/state-management/store/reducer/main-module';
import { Module } from 'app/models/module';
import * as layoutInfoReducer from 'app/state-management/store/reducer/layout-info';
import { BaseComponent } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { AppErrorHandler } from '../../../../services';
import { Uti } from 'app/utilities';
import * as warehouseMevementReducer from 'app/state-management/store/reducer/warehouse-movement';

@Component({
    selector: 'app-xn-tab-content-new-main-tab',
    templateUrl: './xn-tab-content-new-main-tab.component.html',
})

export class XnTabContentNewMainTabComponent extends BaseComponent implements OnInit, OnDestroy {

    public perfectScrollbarConfig: Object = {};
    public contentStyle: Object = {};
    public administrtionConfig: any = {};
    public isRenderAdmin = false;
    public searchIndexKey: string;
    public subForm: string;
    public warehouseMovementFormEnum: any = WarehouseMovementFormEnum;

    private layoutInfoModelSubscription: Subscription;
    private activeSubModuleModelSubscription: Subscription;
    private moduleStateSubscription: Subscription;
    private warehouseMovementSubFormStateSubscription: Subscription;

    private layoutInfoModel: Observable<SubLayoutInfoState>;
    private moduleModel: Observable<ModuleState>;
    private activeSubModuleModel: Observable<Module>;
    private warehouseMovementSubFormState: Observable<string>;

    @Input() config: any;
    @Input() globalProperties: any[] = [];

    @Output() onFormChanged: EventEmitter<any> = new EventEmitter();

    constructor(
        private store: Store<AppState>,
        protected router: Router,
        private appErrorHandler: AppErrorHandler,
    ) {
        super(router);

        this.layoutInfoModel = store.select(state => layoutInfoReducer.getLayoutInfoState(state, this.ofModule.moduleNameTrim));
        this.moduleModel = store.select(state => state.mainModule);
        this.activeSubModuleModel = store.select(state => state.mainModule.activeSubModule);
        this.warehouseMovementSubFormState = store.select(state => warehouseMevementReducer.getWarehouseMovementState(state, this.ofModule.moduleNameTrim).subForm);
    }

    ngOnInit() {
        this.perfectScrollbarConfig = {
            suppressScrollX: false,
            suppressScrollY: false
        };
        this.subscribeLayoutInfoModel();
        this.subscribe();
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    subscribeLayoutInfoModel() {
        this.layoutInfoModelSubscription = this.layoutInfoModel.subscribe((layoutInfo: SubLayoutInfoState) => {
            this.appErrorHandler.executeAction(() => {
                this.contentStyle = {
                    // 'height': `calc(100vh - ${layoutInfo.globalSearchHeight}px - ${layoutInfo.headerHeight}px - ${layoutInfo.tabHeaderHeight}px - ${layoutInfo.formPadding}px)`
                    'height': `calc(100vh - ${layoutInfo.headerHeight}px - ${layoutInfo.tabHeaderHeight}px - ${layoutInfo.formPadding}px)`
                };
            });
        });
    }

    onChanged(data) {
        if (data) {
            this.onFormChanged.emit(data);
        }
    }

    private subscribe() {
        this.activeSubModuleModelSubscription = this.activeSubModuleModel.subscribe((activeSubModule: Module) => {
            this.appErrorHandler.executeAction(() => {
                this.isRenderAdmin = true;
                if (isEmpty(activeSubModule)) { return; }
                this.administrtionConfig = { principal: (activeSubModule.idSettingsGUI === MenuModuleId.mandant) };
            });
        });

        this.moduleStateSubscription = this.moduleModel.subscribe((moduleState: ModuleState) => {
            this.appErrorHandler.executeAction(() => {
                if (moduleState.activeModule && !isEmpty(moduleState.activeModule)) {
                    this.searchIndexKey = moduleState.activeModule.searchIndexKey;
                }
                if (moduleState.activeSubModule && !isEmpty(moduleState.activeSubModule)) {
                    this.searchIndexKey = moduleState.activeSubModule.searchIndexKey;
                }
            });
        });
        
        this.warehouseMovementSubFormStateSubscription = this.warehouseMovementSubFormState.subscribe((subForm: string) => {
            this.appErrorHandler.executeAction(() => {
                this.subForm = subForm;
            });
        });
    }

}
