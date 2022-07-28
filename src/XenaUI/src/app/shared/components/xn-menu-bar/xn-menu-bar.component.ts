import { Component, Input, EventEmitter, Output, ElementRef, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
    Module,
    GlobalSettingModel,
} from 'app/models';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Subscription } from 'rxjs/Subscription';
import {
    ModuleActions
} from 'app/state-management/store/actions';
import {
    GlobalSettingService, AccessRightsService,
} from 'app/services';
import { GlobalSettingConstant, AccessRightKeyEnum, AccessRightTypeEnum, Configuration } from 'app/app.constants';
import { Uti } from 'app/utilities';

@Component({
    selector: 'xn-menu-bar',
    styleUrls: ['./xn-menu-bar.component.scss'],
    templateUrl: './xn-menu-bar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class XnMenuBarComponent implements OnInit, OnDestroy {
    @Input() modules: Module[];
    @Input() position: string;
    @Input() isViewMode = true;
    @Input() isRoot = true;
    @Input() activeModule: Module;

    @Output() onSelectedModule = new EventEmitter<Module>();
    @Output() onClickNewModule = new EventEmitter<Module>();
    @Output() onSearchingModule = new EventEmitter<Module>();

    private currentGlobalSettingModel: GlobalSettingModel;
    private getGlobalSettingSubscription: Subscription;

    public checkedModuleIds = [];
    public tabAccessRight: any;

    constructor(
        private store: Store<AppState>,
        private _eref: ElementRef,
        private globalSettingService: GlobalSettingService,
        private globalSettingConstant: GlobalSettingConstant,
        private moduleActions: ModuleActions,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private accessRightService: AccessRightsService
    ) {
    }

    ngOnInit() {
        this.getCheckedModules();
        if (this.activeModule) {
            this.tabAccessRight = this.accessRightService.getMainTabAccessRight(this.activeModule);
        } else {
            this.tabAccessRight = null;
        }
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
    }

    selectModule(selectedModule: Module, event) {
        if (selectedModule.children && selectedModule.children.length) {
            event.stopImmediatePropagation();
        }

        if (!Configuration.PublicSettings.isSelectionProject) {
            if (!selectedModule.isClickable)
                return;
        }        

        if (event && event.target && event.target.className.indexOf('mat-checkbox-inner-container') > -1) {
            return;
        }

        this.onSelectedModule.emit(selectedModule);
    }

    public preventCloseMenu(event) {
        event.stopImmediatePropagation();
    }

    clickNewModuleItem(selectedModule: Module) {
        this.onClickNewModule.emit(selectedModule);
    }

    private getCheckedModules() {
        this.getGlobalSettingSubscription = this.globalSettingService.getAllGlobalSettings().subscribe(
            data => this.getCheckedModulesSuccess(data),
            error => this.serviceError(error)
        );
    }

    private getCheckedModulesSuccess(data: GlobalSettingModel[]) {
        if (!data || !data.length) { return; }
        this.checkedModuleIds = this.getCurrentCheckedModules(data);
        this.setCheckedForModule();
        for (let i = 0; i < this.checkedModuleIds.length; i++) {
            const moduleInfo = this.modules.find(md => md.idSettingsGUI == this.checkedModuleIds[i]);

            if (moduleInfo) {
                this.store.dispatch(this.moduleActions.addWorkingModule(moduleInfo, [], [], [], true));
            }
        }
    }

    private serviceError(error) {
        Uti.logError(error);
    }

    private getCurrentCheckedModules(data: GlobalSettingModel[]): any {
        this.currentGlobalSettingModel = data.find(x => x.globalName === this.getSettingName());
        if (!this.currentGlobalSettingModel || !this.currentGlobalSettingModel.idSettingsGlobal) {
            return this.checkedModuleIds;
        }
        const checkedModulesSetting = JSON.parse(this.currentGlobalSettingModel.jsonSettings);


        return (checkedModulesSetting && checkedModulesSetting.CheckedModules);
    }

    private getSettingName() {
        return this.globalSettingConstant.settingCheckedModules;
    }

    private reloadAndSaveSetting() {
        this.getGlobalSettingSubscription = this.globalSettingService.getAllGlobalSettings().subscribe((data: any) => {
            this.saveCheckedModulesSetting(data);
        });
    }

    private saveCheckedModulesSetting(data: GlobalSettingModel[]) {
        if (!this.currentGlobalSettingModel || !this.currentGlobalSettingModel.idSettingsGlobal || !this.currentGlobalSettingModel.globalName) {
            this.currentGlobalSettingModel = new GlobalSettingModel({
                globalName: this.getSettingName(),
                description: 'Checked Modules Setting',
                globalType: this.globalSettingConstant.settingCheckedModules
            });
        }
        this.currentGlobalSettingModel.idSettingsGUI = -1;
        this.currentGlobalSettingModel.jsonSettings = JSON.stringify({ CheckedModules: this.getModuleChecked() });
        this.currentGlobalSettingModel.isActive = true;

        this.getGlobalSettingSubscription = this.globalSettingService.saveGlobalSetting(this.currentGlobalSettingModel).subscribe(
            dt => this.saveSettingSuccess(dt),
            error => this.serviceError(error));
    }

    private saveSettingSuccess(data: any) {
        this.globalSettingService.saveUpdateCache('-1', this.currentGlobalSettingModel, data);
    }


    search(selectedModule: Module) {
        this.onSearchingModule.emit(selectedModule);
    }

    setCheckboxValue(item) {
        // item.isChecked = !item.isChecked;
        this.reloadAndSaveSetting();
    }

    private setCheckedForModule() {
        for (let item of this.modules) {
            item.isChecked = (this.checkedModuleIds.indexOf(item.idSettingsGUI) > -1);
        }

        this.changeDetectorRef.markForCheck();
    }

    private getModuleChecked(): any {
        let result = [];
        for (const item of this.modules) {
            if (item.isChecked) {
                result.push(item.idSettingsGUI);
            }
        }
        return result;
    }

    public onSelectedSubModule(selectedSubModule: Module) {
        this.onSelectedModule.emit(selectedSubModule);
    }
}
