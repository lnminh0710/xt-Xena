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
import {Module, WidgetPropertyModel} from 'app/models';
import cloneDeep from 'lodash-es/cloneDeep';
import {ModuleList} from 'app/pages/private/base';
import {FileUploadModuleType} from 'app/app.constants';

@Component({
    selector: 'property-background-image',
    styleUrls: ['./property-background-image.component.scss'],
    templateUrl: './property-background-image.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyBackgroundImageComponent implements OnInit, OnDestroy {

    public showDialog = false;
    public displayFields: any[] = [];
    public fileUploadType: typeof FileUploadModuleType = FileUploadModuleType;

    perfectScrollbarConfig: any;
    private propertiesParentData: any;
    private propertiesParentDataState: Observable<any>;
    private globalPropertiesState: Observable<any>;

    private propertiesParentDataStateSubscription: Subscription;
    private widgetTemplateSettingServiceSubscription: Subscription;
    private globalPropertiesStateSubscription: Subscription;

    public globalProperties: WidgetPropertyModel[];

    @Input() usingModule: Module;

    @Output() onApply = new EventEmitter<any>();

    constructor(
        private store: Store<AppState>,
        private toasterService: ToasterService,
        private appErrorHandler: AppErrorHandler,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.propertiesParentDataState = this.store.select(state => propertyPanelReducer.getPropertyPanelState(state, this.usingModule.moduleNameTrim).propertiesParentData);
        this.globalPropertiesState = store.select(state => propertyPanelReducer.getPropertyPanelState(state, ModuleList.Base.moduleNameTrim).globalProperties);
    }

    ngOnInit() {
        this.subscribePropertiesParentDataState();
        this.initPerfectScroll();
        this.globalPropertiesStateSubscription = this.globalPropertiesState.subscribe((globalProperties: any) => {
            this.appErrorHandler.executeAction(() => {
                if (globalProperties) {
                    this.globalProperties = globalProperties;
                }
            });
        });

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
        this.changeDetectorRef.markForCheck();
    }

    public close() {
        this.showDialog = false;
        this.changeDetectorRef.markForCheck();
    }

    public onImageUrl(urlImage: string) {
        this.onApply.emit(urlImage);
        this.close();
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
