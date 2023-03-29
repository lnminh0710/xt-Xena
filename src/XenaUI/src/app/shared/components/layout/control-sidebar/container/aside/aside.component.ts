import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
  HostListener,
  ChangeDetectionStrategy,
  ViewChild,
  isDevMode,
} from '@angular/core';
import {
  GlobalSettingService,
  PropertyPanelService,
  AppErrorHandler,
  CommonService,
  UserService,
  ModalService,
  AccessRightsService,
  ModuleSettingService,
  ResourceTranslationService,
  LayoutSettingService,
  SignalRService,
  EventEmitterService,
} from 'app/services';
import {
  GlobalSettingModel,
  MainSettingModel,
  ColorSettingModel,
  LanguageSettingModel,
  WidgetPropertyModel,
  Module,
  ApiResultResponse,
  User,
  MessageModel,
  SignalRNotifyModel,
  MessageModalModel,
  MessageModalHeaderModel,
  MessageModalBodyModel,
  MessageModalFooterModel,
  ButtonList,
} from 'app/models';
import {
  GlobalSettingConstant,
  AccessRightKeyEnum,
  Configuration,
  ModuleType,
  SignalRActionEnum,
  SignalRJobEnum,
} from 'app/app.constants';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  WidgetTemplateActions,
  LayoutInfoActions,
  AdditionalInformationActions,
  ParkedItemActions,
  SearchResultActions,
  PropertyPanelActions,
  LayoutSettingActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { PageSize, LocalSettingKey } from 'app/app.constants';
import * as uti from 'app/utilities';
import cloneDeep from 'lodash-es/cloneDeep';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { MessageModal } from 'app/app.constants';
import { SessionStorageProvider, LocalStorageHelper } from 'app/utilities';
import {
  DialogApplyWidgetSettingsComponent,
  DialogModuleLayoutSettingsComponent,
} from '../../components';
import { Uti } from 'app/utilities';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';

@Component({
  selector: 'app-aside',
  styleUrls: ['./aside.component.scss'],
  templateUrl: './aside.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideComponent extends BaseComponent implements OnInit, OnDestroy {
  @Output() onToggleWidgetTemplate = new EventEmitter<boolean>();
  private userMainSetting: GlobalSettingModel;
  private colorDefaultClassName = 'skin-blue-light';
  private languageDefaultName = 'English';
  private currentMainSetting: MainSettingModel;
  public languages: LanguageSettingModel[] = [];
  public isWidgetTemplate = false;
  public isShowWidgetSetting = false;
  public isLayoutSetting = false;
  public properties: WidgetPropertyModel[] = [];
  private propertiesSettings: any;
  private propertiesSettingName = '';
  private orgGlobalProperties: any;
  public ofModuleLocal: Module;
  private selectedEntity: any;
  public activeModuleState: Observable<Module>;
  public activeSubModuleState: Observable<Module>;

  private activeModuleStateSubscription: Subscription;
  private requestSaveGlobalPropertiesStateSubscription: Subscription;
  private requestRollbackPropertiesState: Observable<any>;
  private requestRollbackPropertiesStateSubscription: Subscription;
  private globalSettingSerSubscription: Subscription;
  private selectedEntityState: Observable<any>;
  private selectedEntityStateSubscription: Subscription;
  private requestEditLayoutTogglePanelStateSubscription: Subscription;

  public showDialogApplyWidgetSettings = false;
  private requestSaveGlobalPropertiesState: Observable<any>;
  public currentUser: User;
  private isChangeLanguage: boolean;
  public enableLayoutCustomization = false;
  public htmlSkins: any[] = [];
  public isSkinComboboxFocused = false;
  public htmlLanguages: any[] = [];
  public isLanguageComboboxFocused = false;
  private colors: ColorSettingModel[] = [
    new ColorSettingModel({
      name: 'Blue',
      class1: 'skin-blue-light',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'blue-header-left-theme',
      class4: 'bg-light-blue blue-header-right-theme',
      class5: 'blue-body-left-theme',
      class6: 'blue-body-right-theme',
      class7: '',
      active: true,
    }),
    new ColorSettingModel({
      name: 'Black',
      class1: 'skin-black-light',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'black-header-left-theme',
      class4: 'black-header-right-theme',
      class5: 'black-body-left-theme',
      class6: 'black-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Purple',
      class1: 'skin-purple-light',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'bg-purple-active purple-header-left-theme',
      class4: 'bg-purple purple-header-right-theme',
      class5: 'purple-body-left-theme',
      class6: 'purple-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Green',
      class1: 'skin-green-light',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'bg-green-active green-header-left-theme',
      class4: 'bg-green green-header-right-theme',
      class5: 'green-body-left-theme',
      class6: 'green-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Red',
      class1: 'skin-red-light',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'bg-red-active red-header-left-theme',
      class4: 'bg-red red-header-right-theme',
      class5: 'red-body-left-theme',
      class6: 'red-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Yellow',
      class1: 'skin-yellow-light',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'bg-yellow-active yellow-header-left-theme',
      class4: 'bg-yellow yellow-header-right-theme',
      class5: 'yellow-body-left-theme',
      class6: 'yellow-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Dark Blue',
      class1: 'skin-blue',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'blue-header-left-theme',
      class4: 'bg-blue blue-header-right-theme',
      class5: 'dark-body-left-theme',
      class6: 'dark-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Dark Black',
      class1: 'skin-black',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'black-header-left-theme',
      class4: 'black-header-right-theme',
      class5: 'dark-body-left-theme',
      class6: 'dark-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Dark Purple',
      class1: 'skin-purple',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'bg-purple-active purple-header-left-theme',
      class4: 'bg-purple purple-header-right-theme',
      class5: 'dark-body-left-theme',
      class6: 'dark-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Dark Green',
      class1: 'skin-green',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'bg-green-active green-header-left-theme',
      class4: 'bg-green green-header-right-theme',
      class5: 'dark-body-left-theme',
      class6: 'dark-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Dark Red',
      class1: 'skin-red',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'bg-red-active red-header-left-theme',
      class4: 'bg-red red-header-right-theme',
      class5: 'dark-body-left-theme',
      class6: 'dark-body-right-theme',
      class7: '',
      active: false,
    }),
    new ColorSettingModel({
      name: 'Dark Yellow',
      class1: 'skin-yellow',
      class2: 'full-opacity-hover header-skin-shadow',
      class3: 'bg-yellow-active yellow-header-left-theme',
      class4: 'bg-yellow yellow-header-right-theme',
      class5: 'dark-body-left-theme',
      class6: 'dark-body-right-theme',
      class7: '',
      active: false,
    }),
  ];

  @HostListener('document:click.out-zone', ['$event'])
  onDocumentClick($event) {
    this.onClick($event);
  }

  @ViewChild('skinCombobox') skinCombobox: AngularMultiSelect;
  @ViewChild('languageCombobox') languageCombobox: AngularMultiSelect;

  private dialogApplyWidgetSettings: DialogApplyWidgetSettingsComponent;
  @ViewChild(DialogApplyWidgetSettingsComponent)
  set dialogApplyWidgetSettingsComponent(
    dialogApplyWidgetSettingsComponent: DialogApplyWidgetSettingsComponent
  ) {
    this.dialogApplyWidgetSettings = dialogApplyWidgetSettingsComponent;
  }

  public showModuleLayoutSettingsDialog = false;
  private dialogModuleLayoutSettings: DialogModuleLayoutSettingsComponent;
  @ViewChild(DialogModuleLayoutSettingsComponent)
  set dialogModuleLayoutSettingsInstance(
    dialogModuleLayoutSettingsInstance: DialogModuleLayoutSettingsComponent
  ) {
    this.dialogModuleLayoutSettings = dialogModuleLayoutSettingsInstance;
  }

  public accessRight: any = {};
  public tranlationStatus = false;

  private designLayoutMessageSubscription: Subscription;
  public designLayoutMessageTooltip = '';
  public designLayoutEnabled = true;

  constructor(
    private _eref: ElementRef,
    private globalSettingSer: GlobalSettingService,
    private globalSettingConstant: GlobalSettingConstant,
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<AppState>,
    private widgetTemplateActions: WidgetTemplateActions,
    private layoutInfoActions: LayoutInfoActions,
    private pageSize: PageSize,
    private additionalInformationActions: AdditionalInformationActions,
    private parkedItemActions: ParkedItemActions,
    private searchResultActions: SearchResultActions,
    private propertyPanelActions: PropertyPanelActions,
    private layoutSettingActions: LayoutSettingActions,
    private propertyPanelService: PropertyPanelService,
    private eventEmitterService: EventEmitterService,
    private toasterService: ToasterService,
    private dispatcher: ReducerManagerDispatcher,
    private appErrorHandler: AppErrorHandler,
    private commonService: CommonService,
    private userServ: UserService,
    private modalService: ModalService,
    private accessRightsService: AccessRightsService,
    private moduleSettingService: ModuleSettingService,
    private resourceTranslationService: ResourceTranslationService,
    private layoutSettingService: LayoutSettingService,
    private signalRService: SignalRService,
    protected router: Router
  ) {
    super(router);
    this.getCurrentUser();
    this.ofModuleLocal = this.ofModule;
    this.activeModuleState = store.select(
      (state) => state.mainModule.activeModule
    );
    this.activeSubModuleState = store.select(
      (state) => state.mainModule.activeSubModule
    );
    this.requestRollbackPropertiesState = this.store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          this.ofModule.moduleNameTrim
        ).requestRollbackProperties
    );
    this.requestSaveGlobalPropertiesState = this.store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).requestSaveGlobal
    );
    this.selectedEntityState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedEntity
    );

    this.accessRight = {
      skin: this.accessRightsService.getAccessRightByKey(
        AccessRightKeyEnum.SettingMenu__Menu_Skin
      ),
      globalSettings: this.accessRightsService.getAccessRightByKey(
        AccessRightKeyEnum.SettingMenu__Menu_GlobalSetting
      ),
      widgetCustomization: this.accessRightsService.getAccessRightByKey(
        AccessRightKeyEnum.SettingMenu__Menu_WidgetCustomization
      ),
      designPageLayout: this.accessRightsService.getAccessRightByKey(
        AccessRightKeyEnum.SettingMenu__Menu_DesignPageLayout
      ),
      applyWidgetSettings: this.accessRightsService.getAccessRightByKey(
        AccessRightKeyEnum.SettingMenu__Menu_ApplyWidgetSetting
      ),
      moduleLayoutSettings: this.accessRightsService.getAccessRightByKey(
        AccessRightKeyEnum.SettingMenu__Menu_ModuleLayoutSetting
      ),
    };
  }

  onRouteChanged() {
    this.buildModuleFromRoute();
    this.ofModuleLocal = this.ofModule;
    setTimeout(() => {
      this.signalRIsThereAnyoneEditing();
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.signalRListenMessage();
    this.signalRIsThereAnyoneEditing();
    this.getMainLanguages();
    this.activeModuleStateSubscription = this.activeModuleState.subscribe(
      (activeModuleState: Module) => {
        this.appErrorHandler.executeAction(() => {
          if (activeModuleState && activeModuleState.idSettingsGUI) {
            this.isShowWidgetSetting = true;
          } else {
            this.isShowWidgetSetting = false;
          }
          this.changeDetectorRef.markForCheck();
          setTimeout(() => {
            this.resourceTranslationService.updateStatus(this.tranlationStatus);
          });
        });
      }
    );

    this.requestSaveGlobalPropertiesStateSubscription =
      this.requestSaveGlobalPropertiesState.subscribe(
        (requestSaveGlobalPropertiesState: any) => {
          this.appErrorHandler.executeAction(() => {
            if (
              requestSaveGlobalPropertiesState &&
              requestSaveGlobalPropertiesState.globalProperties
            ) {
              requestSaveGlobalPropertiesState.globalProperties =
                this.propertyPanelService.resetDirty(
                  requestSaveGlobalPropertiesState.globalProperties
                );
              this.reloadAndSavePropertiesConfig(
                requestSaveGlobalPropertiesState.globalProperties
              );
            }
          });
        }
      );

    this.buildPropertiesSettingName();
    this.requestRollbackPropertiesStateSubscription =
      this.requestRollbackPropertiesState.subscribe(
        (requestRollbackPropertiesState: any) => {
          this.appErrorHandler.executeAction(() => {
            if (
              requestRollbackPropertiesState &&
              requestRollbackPropertiesState.data &&
              requestRollbackPropertiesState.isGlobal
            ) {
              this.properties = cloneDeep(this.orgGlobalProperties);
              this.propertyPanelService.globalProperties = this.properties;
              this.store.dispatch(
                this.propertyPanelActions.requestUpdateGlobalProperty(
                  this.orgGlobalProperties,
                  ModuleList.Base
                )
              );
            }
          });
        }
      );

    this.requestEditLayoutTogglePanelStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === LayoutSettingActions.REQUEST_TOGGLE_PANEL &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((isShow: any) => {
        this.appErrorHandler.executeAction(() => {
          this.isLayoutSetting = isShow;
          this.changeDetectorRef.markForCheck();
        });
      });

    this.requestEditLayoutTogglePanelStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            WidgetTemplateActions.TOGGLE_WIDGET_TEMPLATE_SETTING_PANEL &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((isShow: any) => {
        this.appErrorHandler.executeAction(() => {
          this.onWidgetTemplateToggle(isShow, true);
        });
      });

    this.selectedEntityStateSubscription = this.selectedEntityState.subscribe(
      (selectedEntityState: any) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedEntity = selectedEntityState;
        });
      }
    );

    this.enableLayoutCustomization =
      Configuration.PublicSettings.enableLayoutCustomization;

    this.buildSkins();
    setTimeout(() => {
      this.loadSkinFromSetting();
      this.getGlobalPropertiesFromSetting();
    }, 500);
  }

  ngOnDestroy() {
    uti.Uti.unsubscribe(this);
  }

  /**
   * getCurrentUser
   */
  private getCurrentUser() {
    this.userServ.currentUser.subscribe((user: User) => {
      this.appErrorHandler.executeAction(() => {
        this.currentUser = user;
      });
    });
  }

  /**
   * getMainLanguages
   */
  private getMainLanguages() {
    this.commonService.getMainLanguages().subscribe(
      (data) => this.loadLanguagesSuccess(data),
      (error) => this.loadLanguagesError(error)
    );
  }

  private buildSkins() {
    this.htmlSkins = [];
    for (let i = 0; i < this.colors.length; i++) {
      let theme =
        `<div data-name="` +
        this.colors[i].name +
        `" data-class1="` +
        this.colors[i].class1 +
        `" style="display:flex; flex-direction: row; align-items: center">
                             <a tabindex="-1"
                               style="width:60px;cursor:pointer"
                               class="` +
        this.colors[i].class2 +
        `">
                                <div>
                                    <span class="` +
        this.colors[i].class3 +
        `"></span>
                                    <span class="` +
        this.colors[i].class4 +
        `"></span>
                                </div>
                                <div>
                                    <span class="` +
        this.colors[i].class5 +
        `"></span>
                                    <span class="` +
        this.colors[i].class6 +
        `"></span>
                                </div>
                            </a>
                            <span style="margin-left:5px;">` +
        this.colors[i].name +
        `</span>
                        </div>
                        `;
      this.htmlSkins.push({
        idValue: i,
        textValue: theme,
        data: this.colors[i],
      });
    }
  }

  private buildLanguagesCombobox() {
    this.htmlLanguages = [];
    for (let i = 0; i < this.languages.length; i++) {
      let language =
        `<div data-name="` +
        this.languages[i].name +
        `"
                              data-flag="` +
        this.languages[i].flag +
        `"
                              data-idRepLanguage="` +
        this.languages[i].idRepLanguage +
        `"
                              style="display:flex; flex-direction: row; align-items: center">
                             <a tabindex="-1"
                               style="cursor:pointer">
                                <span class="flag flag-` +
        this.languages[i].flag +
        `"></span>
                            </a>
                            <span style="margin-left:5px;">` +
        this.languages[i].name +
        `</span>
                        </div>
                        `;
      this.htmlLanguages.push({
        idValue: i,
        textValue: language,
        data: this.languages[i],
      });
    }
  }

  /**
   * loadLanguagesSuccess
   * @param data
   */
  private loadLanguagesSuccess(response: ApiResultResponse) {
    this.languages = [];
    if (
      response &&
      response.item &&
      response.item.data &&
      response.item.data.length
    ) {
      let languages: Array<any> = response.item.data[1];
      if (languages && languages.length) {
        let currentUserLanguage: string = this.userServ.getLanguage();
        let isModeLanguage = LocalStorageHelper.toInstance(
          SessionStorageProvider
        ).getItem(LocalSettingKey.SET_LANGUAGE_MODE);
        if (isModeLanguage && isModeLanguage.isMain) {
          currentUserLanguage = this.currentUser.preferredLang;
        }
        languages.forEach((language) => {
          let userLanguage = new LanguageSettingModel({
            flag: (language.LanguageCode as string).toLowerCase(),
            name: language.DefaultValue,
            active: language.IdRepLanguage == currentUserLanguage,
            idRepLanguage: language.IdRepLanguage,
          });
          this.languages.push(userLanguage);
          if (userLanguage.active) {
            LocalStorageHelper.toInstance(SessionStorageProvider).setItem(
              LocalSettingKey.LANGUAGE,
              userLanguage
            );
          }
        });

        this.buildLanguagesCombobox();

        setTimeout(() => {
          let selectedLanguage = this.htmlLanguages.find(
            (language) => language.data.idRepLanguage == currentUserLanguage
          );
          if (selectedLanguage) {
            this.languageCombobox.selectedItem = selectedLanguage;
          }
        }, 200);
      }
    }
  }

  /**
   * loadLanguagesError
   * @param error
   */
  private loadLanguagesError(error) {
    this.languages = [];
  }

  public onWidgetTemplateToggle(isExpanded: boolean, noDispatch?: boolean) {
    setTimeout(() => {
      this.isWidgetTemplate = isExpanded;
      this.onToggleWidgetTemplate.emit(this.isWidgetTemplate);
      if (!noDispatch) {
        const parkedItemWidth =
          this.isWidgetTemplate &&
          this._eref.nativeElement.children[0].classList.contains(
            'control-sidebar-open'
          )
            ? this.pageSize.ParkedItemShowSize.toString()
            : '0';
        this.store.dispatch(
          this.layoutInfoActions.setRightMenuWidth(
            parkedItemWidth,
            this.ofModule
          )
        );
      }
      if (isExpanded) {
        this.openWidgetTemplateSetting();
      }
    });
  }

  private buildPropertiesSettingName() {
    this.propertiesSettingName =
      this.globalSettingConstant.globalWidgetProperties;
  }

  private loadSkinFromSetting() {
    this.globalSettingSerSubscription = this.globalSettingSer
      .getAllGlobalSettings()
      .subscribe(
        (data) => this.loadSkinFromSettingSuccess(data),
        (error) => this.loadSkinFromSettingError(error)
      );
  }

  private loadSkinFromSettingSuccess(data: GlobalSettingModel[]) {
    if (!data || data.length <= 0) {
      return;
    }
    this.userMainSetting = data.find(
      (x) => x.globalName === this.globalSettingConstant.settingUserMain
    );
    if (!this.userMainSetting || !this.userMainSetting.idSettingsGlobal) {
      return;
    }
    const serverMainSetting = JSON.parse(
      this.userMainSetting.jsonSettings
    ) as MainSettingModel;
    if (!serverMainSetting) {
      return;
    }
    this.setActiveForColorFromServer(serverMainSetting.color);
    // this.setActiveForLanguageFromServer(serverMainSetting.language);
  }

  private loadSkinFromSettingError(error) {
    Uti.logError(error);
  }

  private setActiveForColorFromServer(colorName: string) {
    this.setActiveForColor(colorName);
    const currentColor = this.colors.find((x) => x.active);
    if (!currentColor) {
      return;
    }
    this.overrideSkinClass(currentColor.class1);
  }

  private getGlobalPropertiesFromSetting() {
    this.moduleSettingService
      .getModuleSetting(null, null, '-1', ModuleType.GLOBAL_PROPERTIES, '-1')
      .subscribe((response) => {
        let globalPropsDefault: any;
        if (uti.Uti.isResquestSuccess(response) && response.item.length) {
          let jsonSettings = uti.Uti.tryParseJson(
            response.item[0].jsonSettings
          );
          globalPropsDefault = !uti.Uti.isEmptyObject(jsonSettings)
            ? jsonSettings
            : null;
        }
        this.globalSettingSer.getAllGlobalSettings().subscribe((data: any) => {
          this.appErrorHandler.executeAction(() => {
            this.properties = this.buildPropertiesFromGlobalSetting(
              data,
              globalPropsDefault
            );
            this.updateGlobalProperties();
          });
        });
      });
  }

  private updateGlobalProperties() {
    this.orgGlobalProperties = cloneDeep(this.properties);
    this.propertyPanelService.globalProperties = this.orgGlobalProperties;
    this.store.dispatch(
      this.propertyPanelActions.requestUpdateGlobalProperty(
        this.properties,
        ModuleList.Base
      )
    );
  }

  private buildPropertiesFromGlobalSetting(
    data: GlobalSettingModel[],
    defaultProperties?
  ): any[] {
    if (!data)
      return defaultProperties
        ? defaultProperties.properties
        : this.propertyPanelService.createDefaultGlobalSettings();

    this.propertiesSettings = data.find(
      (x) => x.globalName === this.propertiesSettingName
    );
    if (!this.propertiesSettings || !this.propertiesSettings.idSettingsGlobal)
      return defaultProperties
        ? defaultProperties.properties
        : this.propertyPanelService.createDefaultGlobalSettings();

    const properties = JSON.parse(
      this.propertiesSettings.jsonSettings
    ) as GlobalSettingModel[];
    if (!properties || !properties.length)
      return defaultProperties
        ? defaultProperties.properties
        : this.propertyPanelService.createDefaultGlobalSettings();

    return this.propertyPanelService.mergeProperties(
      properties,
      defaultProperties
    ).properties;
  }

  private setActiveForColor(colorName: string) {
    colorName = colorName || this.colorDefaultClassName;
    for (const color of this.colors) {
      color.active = color.name === colorName;
    }

    if (this.skinCombobox) {
      setTimeout(() => {
        this.skinCombobox.selectedItem = this.htmlSkins.find(
          (skin) => skin.data.name === colorName
        );
      }, 200);
    }

    this.changeDetectorRef.markForCheck();
  }

  private setActiveForLanguageFromServer(languageName: string) {
    languageName = languageName || this.languageDefaultName;
    for (const language of this.languages) {
      language.active = language.name === languageName;
    }
    this.changeDetectorRef.markForCheck();
  }

  private saveSkinToSetting() {
    this.globalSettingSerSubscription = this.globalSettingSer
      .getAllGlobalSettings()
      .subscribe(
        (data) => this.saveNearExpireMessageSuccess(data),
        (error) => this.loadSkinFromSettingError(error)
      );
  }

  private saveNearExpireMessageSuccess(
    globalSettingModels: GlobalSettingModel[]
  ) {
    this.userMainSetting = globalSettingModels.find(
      (x) => x.globalName === this.globalSettingConstant.settingUserMain
    );
    if (
      !this.userMainSetting ||
      !this.userMainSetting.idSettingsGlobal ||
      !this.userMainSetting.globalName
    ) {
      this.userMainSetting = new GlobalSettingModel({
        globalName: this.globalSettingConstant.settingUserMain,
        description: 'Skin setting each of User',
        isActive: true,
      });
    }
    this.userMainSetting.idSettingsGUI = -1;
    this.userMainSetting.jsonSettings = JSON.stringify(this.currentMainSetting);
    this.userMainSetting.isActive = true;

    this.globalSettingSerSubscription = this.globalSettingSer
      .saveGlobalSetting(this.userMainSetting)
      .subscribe(
        (data) => this.saveGlobalSettingSuccess(data),
        (error) => this.loadSkinFromSettingError(error)
      );
  }

  private saveGlobalSettingSuccess(data: any) {
    this.globalSettingSer.saveUpdateCache('-1', this.userMainSetting, data);
    // Relogin to get the latest user info
    if (this.isChangeLanguage) {
      this.isChangeLanguage = false;
      location.reload();
    }
  }

  onClick(event) {
    // Click outside
    if (
      !this._eref.nativeElement.contains(event.target) &&
      !event.target.classList.contains('toggle-sidebar-right')
    ) {
      if (
        this._eref.nativeElement.children[0].classList.contains(
          'control-sidebar-open'
        )
      ) {
        this.collapseSideBar();

        this.store.dispatch(
          this.layoutInfoActions.setRightMenuWidth('0', this.ofModule)
        );
      }
    }
    if (event.target.classList.contains('toggle-sidebar-right')) {
      this.isWidgetTemplate = false;

      if (
        this._eref.nativeElement.children[0].classList.contains(
          'control-sidebar-open'
        )
      ) {
        this.store.dispatch(
          this.layoutInfoActions.setRightMenuWidth(
            this.pageSize.ParkedItemShowSize.toString(),
            this.ofModule
          )
        );
      } else {
        this.store.dispatch(
          this.layoutInfoActions.setRightMenuWidth('0', this.ofModule)
        );
      }
    }

    this.changeDetectorRef.markForCheck();
  }

  collapseSideBar() {
    this._eref.nativeElement.children[0].classList.remove(
      'control-sidebar-open'
    );
  }

  expandSideBar() {
    this._eref.nativeElement.children[0].classList.add('control-sidebar-open');
    this.isWidgetTemplate = false;

    this.changeDetectorRef.markForCheck();
  }

  public changeSkin(selectedItem) {
    if (!this.isSkinComboboxFocused) {
      return;
    }

    this.setActiveForColor(selectedItem.data.name);
    this.overrideSkinClass(selectedItem.data.class1);
    this.currentMainSetting = this.currentMainSetting || new MainSettingModel();
    this.currentMainSetting.color = selectedItem.data.name;
    this.saveSkinToSetting();
  }

  private overrideSkinClass(colorClass: string) {
    const classList = document
      .getElementsByTagName('body')[0]
      .className.split(/\s+/);
    for (let i = 0; i < classList.length; i++) {
      if (classList[i].startsWith('skin-')) {
        $('body').removeClass(classList[i]);
      }
    }

    $('body').addClass('sidebar-mini');
    $('body').addClass(colorClass);
  }

  /**
   * changeLanguage
   * @param language
   */
  public changeLanguage(selectedLanguage) {
    if (!this.isLanguageComboboxFocused) {
      return;
    }

    this.modalService.confirmMessageHtmlContent(
      new MessageModel({
        headerText: 'Change Language ',
        messageType: MessageModal.MessageType.error,
        message: [
          { key: '<p>' },
          {
            key: 'Modal_Message__Change_Language_Will_Reload_Page_Do_You_Want_To_Change',
          },
          { key: '</p>' },
        ],
        buttonType1: MessageModal.ButtonType.danger,
        callBack1: () => {
          this.isChangeLanguage = true;
          LocalStorageHelper.toInstance(SessionStorageProvider).setItem(
            LocalSettingKey.SET_LANGUAGE_MODE,
            {
              isMain: false,
            }
          );
          LocalStorageHelper.toInstance(SessionStorageProvider).setItem(
            LocalSettingKey.LANGUAGE,
            selectedLanguage.data
          );
          this.setActiveForLanguageFromServer(selectedLanguage.data.name);
          this.currentMainSetting =
            this.currentMainSetting || new MainSettingModel();
          this.currentMainSetting.language = selectedLanguage.data.name;
          this.saveSkinToSetting();
        },
        callBack2: () => {},
        callBackCloseButton: () => {},
      })
    );
  }

  public openWidgetTemplateSetting(forceOpen?: boolean) {
    if (!this.designLayoutEnabled) {
      console.log(this.designLayoutMessageTooltip);
      //this.toasterService.pop('warning', this.designLayoutMessageTooltip);
      return;
    }

    if (!forceOpen && this.isNeedToReloadPage()) {
      this.showDialogReloadPage();
      return;
    }

    this.signalRConnectEditing();
    this.layoutSettingService.turnOffFullScreenWidget = true;
    this.collapseSideBar();
    this.isWidgetTemplate = true;

    this.store.dispatch(
      this.widgetTemplateActions.updateEditModeStatus(true, this.ofModule)
    );
    this.store.dispatch(
      this.layoutInfoActions.setRightMenuWidth('50', this.ofModule)
    );
    this.store.dispatch(
      this.additionalInformationActions.requestTogglePanel(false, this.ofModule)
    );
    this.store.dispatch(
      this.parkedItemActions.requestTogglePanel(false, this.ofModule)
    );
    this.store.dispatch(this.searchResultActions.requestTogglePanel(false));
    this.store.dispatch(
      this.propertyPanelActions.requestClearProperties(this.ofModule)
    );
    this.onToggleWidgetTemplate.emit(this.isWidgetTemplate);

    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  public openGlobalWidgetSetting() {
    const parentData = {
      title: 'Global Widget Setting',
    };

    this.collapseSideBar();
    this.store.dispatch(
      this.additionalInformationActions.requestTogglePanel(false, this.ofModule)
    );
    this.store.dispatch(
      this.propertyPanelActions.togglePanel(
        this.ofModule,
        true,
        parentData,
        this.properties,
        true
      )
    );
    this.store.dispatch(
      this.layoutInfoActions.setRightMenuWidth('0', this.ofModule)
    );
  }

  private reloadAndSavePropertiesConfig(globalProperties) {
    this.globalSettingSerSubscription = this.globalSettingSer
      .getAllGlobalSettings()
      .subscribe((data: any) => {
        this.appErrorHandler.executeAction(() => {
          this.savePropertiesConfig(data, globalProperties);
        });
      });
  }
  private savePropertiesConfig(
    data: GlobalSettingModel[],
    globalProperties: WidgetPropertyModel[]
  ) {
    this.propertiesSettings = data.find(
      (x) => x.globalName === this.propertiesSettingName
    );
    if (
      !this.propertiesSettings ||
      !this.propertiesSettings.idSettingsGlobal ||
      !this.propertiesSettings.globalName
    ) {
      this.propertiesSettings = new GlobalSettingModel({
        globalName: this.propertiesSettingName,
        description: 'Global Widget Properties',
        globalType: this.globalSettingConstant.globalWidgetProperties,
      });
    }
    this.propertiesSettings.idSettingsGUI = ModuleList.Base.idSettingsGUI;
    globalProperties = this.propertyPanelService.resetDirty(globalProperties);
    this.propertiesSettings.jsonSettings = JSON.stringify(globalProperties);
    this.propertiesSettings.isActive = true;

    this.globalSettingSerSubscription = this.globalSettingSer
      .saveGlobalSetting(this.propertiesSettings)
      .subscribe(
        (_data) => this.savePropertiesConfigSuccess(_data),
        (error) => this.savePropertiesConfigError(error)
      );
  }

  private savePropertiesConfigSuccess(data: any) {
    this.toasterService.pop(
      'success',
      'Success',
      'Global Settings saved successfully'
    );
    this.orgGlobalProperties = cloneDeep(this.properties);
    this.store.dispatch(
      this.propertyPanelActions.togglePanel(this.ofModule, false)
    );
    this.globalSettingSer.saveUpdateCache('-1', this.propertiesSettings, data);
  }

  private savePropertiesConfigError(error) {
    Uti.logError(error);
  }

  public itemsTrackBy(index, item) {
    return item ? item.name : undefined;
  }

  public editLayoutSetting(forceOpen?: boolean) {
    if (!this.designLayoutEnabled) {
      console.log(this.designLayoutMessageTooltip);
      //this.toasterService.pop('warning', this.designLayoutMessageTooltip);
      return;
    }

    if (!forceOpen && this.isNeedToReloadPage()) {
      this.showDialogReloadPage();
      return;
    }

    this.signalRConnectEditing();
    this.layoutSettingService.turnOffFullScreenWidget = true;
    this.collapseSideBar();
    this.isLayoutSetting = true;

    this.store.dispatch(
      this.additionalInformationActions.requestTogglePanel(false, this.ofModule)
    );
    this.store.dispatch(
      this.parkedItemActions.requestTogglePanel(false, this.ofModule)
    );
    this.store.dispatch(this.searchResultActions.requestTogglePanel(false));
    this.store.dispatch(
      this.propertyPanelActions.requestClearProperties(this.ofModule)
    );

    this.store.dispatch(
      this.layoutSettingActions.updateEditModeStatus(true, this.ofModule)
    );

    this.changeDetectorRef.markForCheck();
  }

  public showWidgetLayoutSettings() {
    if (!this.ofModuleLocal) {
      return false;
    }

    switch (this.ofModuleLocal.idSettingsGUI) {
      case ModuleList.Administration.idSettingsGUI:
      case ModuleList.Customer.idSettingsGUI:
      case ModuleList.Article.idSettingsGUI:
      case ModuleList.Campaign.idSettingsGUI:
      case ModuleList.BusinessCosts.idSettingsGUI:
        if (this.selectedEntity) {
          return true;
        }
        break;

      case ModuleList.Base.idSettingsGUI:
      case ModuleList.Backoffice.idSettingsGUI:
      case ModuleList.Tools.idSettingsGUI:
      case ModuleList.Selection.idSettingsGUI:
        return false;

      default:
        return true;
    }

    return false;
  }

  public applyWidgetSettings() {
    this.showDialogApplyWidgetSettings = true;
    this.changeDetectorRef.markForCheck();
    setTimeout(() => {
      if (this.dialogApplyWidgetSettings) {
        this.dialogApplyWidgetSettings.open();
      }
      this.changeDetectorRef.markForCheck();
    }, 50);
  }

  public onCloseDialogApplyWidgetSettings() {
    this.showDialogApplyWidgetSettings = false;
    this.changeDetectorRef.markForCheck();
  }

  public moduleLayoutSettings() {
    this.showModuleLayoutSettingsDialog = true;
    this.changeDetectorRef.markForCheck();

    setTimeout(() => {
      if (this.dialogModuleLayoutSettings) {
        this.dialogModuleLayoutSettings.open();
      }
    }, 50);
  }

  public onCloseModuleLayoutSettingsDialog() {
    this.showModuleLayoutSettingsDialog = false;
    this.changeDetectorRef.markForCheck();
  }

  public showModuleLayoutSettings() {
    if (Configuration.PublicSettings.isSelectionProject) {
      return false;
    }

    if (!this.ofModuleLocal) {
      return false;
    }
    switch (this.ofModuleLocal.idSettingsGUI) {
      case ModuleList.Tools.idSettingsGUI:
      case ModuleList.Selection.idSettingsGUI:
        return false;

      default:
        return true;
    }
  }

  public toggleSystemTranslate() {
    // this.tranlationStatus = !this.tranlationStatus;
    this.resourceTranslationService.updateStatus(this.tranlationStatus);
  }

  public clickToggle() {
    this.tranlationStatus = !this.tranlationStatus;
    this.toggleSystemTranslate();
  }

  //#region SignalR
  private signalRIsPinging: boolean = false;
  private signalRPingTimeout: any;
  private sendMessage(action: SignalRActionEnum, data?: any) {
    if (!this.ofModuleLocal.idSettingsGUI) return;

    let model = this.signalRService.createMessageDesignLayout();
    model.Action = action;
    model.ObjectId = this.ofModuleLocal.idSettingsGUI + '';
    model.Data = data;
    this.signalRService.sendMessage(model);
  }

  private signalRIsThereAnyoneEditing() {
    if (!Configuration.PublicSettings.enableSignalR) return;

    this.signalRIsPinging = true;
    this.sendMessage(SignalRActionEnum.DesignLayout_IsThereAnyoneEditing);

    //When DesignLayout is disabled we will force to enable it.
    if (!this.designLayoutEnabled) {
      clearTimeout(this.signalRPingTimeout);
      this.signalRPingTimeout = null;
      this.signalRPingTimeout = setTimeout(() => {
        if (this.signalRIsPinging) {
          this.signalRIsPinging = false;
          //Allow Design Layout
          this.signalRAllowDesignLayout(true);
        }
      }, 2500);
    } else {
      this.signalRIsPinging = false;
    }
  }

  private signalRConnectEditing() {
    if (!Configuration.PublicSettings.enableSignalR) return;

    if (this.signalRService.designLayoutIsWorking) return;

    this.signalRService.designLayoutIsWorking = true;

    this.sendMessage(SignalRActionEnum.DesignLayout_ConnectEditing);
  }

  private signalRListenMessage() {
    if (!Configuration.PublicSettings.enableSignalR) return;

    if (this.designLayoutMessageSubscription)
      this.designLayoutMessageSubscription.unsubscribe();

    this.designLayoutMessageSubscription =
      this.signalRService.messageDesignLayout.subscribe(
        (message: SignalRNotifyModel) => {
          this.appErrorHandler.executeAction(() => {
            if (isDevMode()) console.log(message);

            this.signalRIsPinging = false;

            if (message.Job == SignalRJobEnum.Disconnected) {
              //Allow Design Layout
              this.signalRAllowDesignLayout(true);
              return;
            }

            switch (message.Action) {
              case SignalRActionEnum.DesignLayout_IsThereAnyoneEditing:
                if (
                  this.signalRService.designLayoutIsWorking &&
                  this.isTheSameModule(message.ObjectId)
                ) {
                  //Notify to the same user that I am editing
                  this.sendMessage(
                    SignalRActionEnum.DesignLayout_ConnectEditing
                  );
                }
                break;
              case SignalRActionEnum.DesignLayout_ConnectEditing:
                //The same account If he is editing on the same module -> disable this function and show tooltip for the current user
                if (this.isTheSameModule(message.ObjectId)) {
                  //Not Allow Design Layout
                  this.signalRAllowDesignLayout(false);

                  //If the other module is designing module, the current module still is turned on the design mode
                  //Turn off the design mode for the current module
                  if (this.signalRService.designLayoutIsWorking) {
                    if (this.isWidgetTemplate) {
                      this.onWidgetTemplateToggle(false);
                      this.store.dispatch(
                        this.widgetTemplateActions.updateEditModeStatus(
                          false,
                          this.ofModule
                        )
                      );
                    } else if (this.isLayoutSetting) {
                      this.isLayoutSetting = false;
                    }
                  }
                }
                break;
              case SignalRActionEnum.DesignLayout_StopEditing:
                //Allow Design Layout
                this.signalRAllowDesignLayout(true);
                break;
              case SignalRActionEnum.DesignLayout_SavedSuccessfully:
                //If design the same module -> need to relload page
                this.signalRService.designLayoutModulesSaved[message.ObjectId] =
                  true;
                break;
            }
          });
        }
      );
  }

  private signalRAllowDesignLayout(allow) {
    if (allow) {
      this.designLayoutEnabled = true;
      this.designLayoutMessageTooltip = '';
    } else {
      this.designLayoutEnabled = false;
      this.designLayoutMessageTooltip =
        'You can not use this feature at moment. There is someone is using the same your account login to design layout of this module. Please try it later';
    }
    this.changeDetectorRef.detectChanges();
  }

  private isTheSameModule(objectId: any) {
    return objectId == this.ofModuleLocal.idSettingsGUI;
  }

  private isNeedToReloadPage() {
    return this.signalRService.designLayoutModulesSaved[
      this.ofModuleLocal.idSettingsGUI
    ];
  }

  private showDialogReloadPage() {
    //Only show warning when subTotal is negative
    this.modalService.showMessageModal(
      new MessageModalModel({
        customClass: 'dialog-confirm-total',
        messageType: MessageModal.MessageType.warning,
        modalSize: MessageModal.ModalSize.middle,
        showCloseButton: false,
        header: new MessageModalHeaderModel({
          text: 'Refresh Widget',
        }),
        body: new MessageModalBodyModel({
          isHtmlContent: true,
          content: [
            { key: '<p>' },
            {
              key: 'Modal_Message__Page_Layout_Widgets_Changed_Using_Same_Account',
            },
            { key: '<br/>' },
            {
              key: 'Modal_Message__Please_Refresh_Widget_Continued',
            },
            { key: '</p>' },
          ],
        }),
        footer: new MessageModalFooterModel({
          buttonList: [
            new ButtonList({
              buttonType: MessageModal.ButtonType.primary,
              text: 'Refresh Widget',
              customClass: '',
              callBackFunc: () => {
                this.eventEmitterService.onFirstRefreshWidgetButtonClick(true);
                this.modalService.hideModal();
                this.signalRService.designLayoutModulesSaved[
                  this.ofModuleLocal.idSettingsGUI
                ] = false;
              },
            }),
            new ButtonList({
              buttonType: MessageModal.ButtonType.default,
              text: 'Cancel',
              customClass: '',
              callBackFunc: () => {
                this.modalService.hideModal();
              },
            }),
          ],
        }),
      })
    );
  }
  //#endregion
}
