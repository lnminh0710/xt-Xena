import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Module,
  ParkedItemModel,
  TabSummaryModel,
  AdditionalInfromationTabModel,
  GlobalSettingModel,
} from 'app/models';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  ModuleActions,
  ProcessDataActions,
  ModuleSettingActions,
  ParkedItemActions,
  TabSummaryActions,
  SearchResultActions,
  PropertyPanelActions,
  LayoutInfoActions,
  CustomAction,
} from 'app/state-management/store/actions';
import isEmpty from 'lodash-es/isEmpty';
import { MenuModuleId, GlobalSettingConstant } from 'app/app.constants';
import { Uti } from 'app/utilities/uti';
import {
  AppErrorHandler,
  GlobalSettingService,
  AccessRightsService,
} from 'app/services';
import * as parkedItemReducer from 'app/state-management/store/reducer/parked-item';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as additionalInformationReducer from 'app/state-management/store/reducer/additional-information';
import { BaseComponent } from 'app/pages/private/base';
import * as uti from 'app/utilities';

@Component({
  selector: 'xn-working-modules',
  styleUrls: ['./xn-working-modules.component.scss'],
  templateUrl: './xn-working-modules.component.html',
  host: {
    //'(mouseenter)': 'toggleIsHovering(true)',
    '(mouseleave)': 'toggleIsHovering(false)',
  },
})
export class XnWorkingModulesComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public workingModules: Array<any> = [];
  private mainModules: Module[] = [];
  public hoverModuleName = '';
  private isParkedItemsHovering = false;
  private wmContainerOffset = {
    left: 0,
    top: 0,
  };
  public stickPosition = 'left';
  public isDragging = false;
  private formDirty: boolean;
  private willChangeWorkingModule: Module;
  private subModules: Module[] = [];
  private selectedParkedItem: ParkedItemModel;
  private selectedTab: TabSummaryModel;
  private selectedAiTab: AdditionalInfromationTabModel;
  public isHovering = false;
  private showPulseAnimationCount = 0;
  private pulseAnimationTimer: any;
  private currentGlobalSettingModel: any;

  private workingModulesState: Observable<Array<any>>;
  private mainModulesState: Observable<Module[]>;
  private formDirtyState: Observable<boolean>;
  private subModulesState: Observable<Module[]>;
  private selectedParkedItemState: Observable<ParkedItemModel>;
  private selectedTabState: Observable<TabSummaryModel>;
  private selectedAiTabState: Observable<AdditionalInfromationTabModel>;

  private workingModulesStateSubscription: Subscription;
  private mainModulesStateSubscription: Subscription;
  private formDirtyStateSubscription: Subscription;
  private subModulesStateSubscription: Subscription;
  private selectedParkedItemStateSubscription: Subscription;
  private selectedTabStateSubscription: Subscription;
  private selectedAiTabStateSubscription: Subscription;
  private okToChangeModuleSubscription: Subscription;
  private requestClearPropertiesSuccessSubscription: Subscription;

  @ViewChild('wmContainer') wmContainer: ElementRef;
  @ViewChild('pulseDot') pulseDot: ElementRef;

  constructor(
    protected router: Router,
    private elementRef: ElementRef,
    private store: Store<AppState>,
    private moduleActions: ModuleActions,
    private processDataActions: ProcessDataActions,
    private moduleSettingActions: ModuleSettingActions,
    private parkedItemActions: ParkedItemActions,
    private tabSummaryActions: TabSummaryActions,
    private searchResultActions: SearchResultActions,
    private appErrorHandler: AppErrorHandler,
    private propertyPanelActions: PropertyPanelActions,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private layoutInfoActions: LayoutInfoActions,
    private dispatcher: ReducerManagerDispatcher,
    private globalSettingService: GlobalSettingService,
    private globalSettingConstant: GlobalSettingConstant,
    private accessRightsService: AccessRightsService
  ) {
    super(router);
    this.workingModulesState = store.select(
      (state) => state.mainModule.workingModules
    );
    this.mainModulesState = store.select(
      (state) => state.mainModule.mainModules
    );
    this.subModulesState = store.select((state) => state.mainModule.subModules);
    this.formDirtyState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.ofModule.moduleNameTrim
        ).formDirty
    );
    this.selectedParkedItemState = store.select(
      (state) =>
        parkedItemReducer.getParkedItemState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedParkedItem
    );
    this.selectedTabState = store.select(
      (state) =>
        tabSummaryReducer.getTabSummaryState(
          state,
          this.ofModule.moduleNameTrim
        ).selectedTab
    );
    this.selectedAiTabState = store.select(
      (state) =>
        additionalInformationReducer.getAdditionalInformationState(
          state,
          this.ofModule.moduleNameTrim
        ).additionalInfromationTabModel
    );
  }

  onRouteChanged() {
    this.buildModuleFromRoute();
  }

  ngOnInit() {
    this.subscribeWorkingModulesState();
    this.subscribeMainModulesState();
    this.subcribeFormDirtyState();
    this.subcribeOkToChangeModuleState();
    this.subscribeSubModulesState();
    this.subcribeSelectedParkedItemState();
    this.subcribeSelectedTabState();
    this.subcribeSelectedAiTabState();
    this.subscribeRequestClearPropertiesSuccessState();
  }

  ngOnDestroy() {
    $(this.elementRef.nativeElement).off(
      'mouseover',
      'a.module-caret-container',
      this.onModuleNameMouseover.bind(this)
    );
    $(this.elementRef.nativeElement).off(
      'mouseleave',
      'a.module-caret-container',
      this.onModuleNameMouseleave.bind(this)
    );
    this.wmContainer.nativeElement.removeEventListener(
      'dragstart',
      this.wmContainerDragStart.bind(this),
      false
    );
    document.removeEventListener(
      'dragover',
      this.documentDragOver.bind(this),
      false
    );
    document.removeEventListener('drop', this.documentDrop.bind(this), false);
    document.removeEventListener(
      'dragleave',
      this.documentDragLeave.bind(this),
      false
    );

    if (this.pulseAnimationTimer) {
      clearInterval(this.pulseAnimationTimer);
      this.pulseAnimationTimer = null;
    }

    Uti.unsubscribe(this);
  }

  ngAfterViewInit() {
    $(this.elementRef.nativeElement).on(
      'mouseover',
      'a.module-caret-container',
      this.onModuleNameMouseover.bind(this)
    );
    $(this.elementRef.nativeElement).on(
      'mouseleave',
      'a.module-caret-container',
      this.onModuleNameMouseleave.bind(this)
    );
    this.wmContainer.nativeElement.addEventListener(
      'dragstart',
      this.wmContainerDragStart.bind(this),
      false
    );
    document.addEventListener(
      'dragover',
      this.documentDragOver.bind(this),
      false
    );
    document.addEventListener('drop', this.documentDrop.bind(this), false);
    document.addEventListener(
      'dragleave',
      this.documentDragLeave.bind(this),
      false
    );

    setTimeout(() => {
      this.setPositionFromSetting();

      this.isDragging = true;
      let event: any = {
        preventDefault: () => {},
      };
      this.documentDrop(event);
    }, 2000);
  }

  private setPositionFromSetting() {
    this.globalSettingService
      .getAllGlobalSettings()
      .subscribe((data) => this.getAllGlobalSettingSuccess(data));
  }

  private getAllGlobalSettingSuccess(data: GlobalSettingModel[]) {
    if (!data || !data.length) {
      return;
    }
    this.currentGlobalSettingModel = data.find(
      (x) => x.globalName === this.getSettingName()
    );

    if (
      this.currentGlobalSettingModel &&
      this.currentGlobalSettingModel.idSettingsGlobal
    ) {
      const position = JSON.parse(
        this.currentGlobalSettingModel.jsonSettings
      ).position;
      let screenSize = Uti.getTrueScreenSize();
      let top =
        position.top > screenSize.height
          ? screenSize.height
          : position.top < 0
          ? 0
          : position.top;
      let left =
        position.left > screenSize.width
          ? screenSize.width
          : position.left < 0
          ? 0
          : position.left;
      $(this.elementRef.nativeElement).find('.working-modules-container').css({
        left: left,
        top: top,
      });
    }
  }

  private reloadAndSaveSetting() {
    this.globalSettingService.getAllGlobalSettings().subscribe((data: any) => {
      this.appErrorHandler.executeAction(() => {
        this.savePositionToSetting(data);
      });
    });
  }

  private savePositionToSetting(data: GlobalSettingModel[]) {
    if (
      !this.currentGlobalSettingModel ||
      !this.currentGlobalSettingModel.idSettingsGlobal ||
      !this.currentGlobalSettingModel.globalName
    ) {
      this.currentGlobalSettingModel = new GlobalSettingModel({
        globalName: this.getSettingName(),
        description: 'Working Modules Position',
        globalType: this.globalSettingConstant.workingModulesPosition,
      });
    }
    this.currentGlobalSettingModel.idSettingsGUI = -1;
    this.currentGlobalSettingModel.jsonSettings = JSON.stringify({
      position: this.getCurrentPosition(),
    });
    this.currentGlobalSettingModel.isActive = true;

    this.globalSettingService
      .saveGlobalSetting(this.currentGlobalSettingModel)
      .subscribe(
        (dt) => this.saveSettingSuccess(dt),
        (error) => this.serviceError(error)
      );
  }

  private getCurrentPosition(): any {
    return $(this.elementRef.nativeElement)
      .find('.working-modules-container')
      .position();
  }

  private saveSettingSuccess(data: any) {
    this.globalSettingService.saveUpdateCache(
      '-1',
      this.currentGlobalSettingModel,
      data
    );
  }

  private serviceError(error) {
    Uti.logError(error);
  }

  private getSettingName() {
    return uti.String.Format(
      '{0}_{1}',
      this.globalSettingConstant.hotkeySetting,
      this.ofModule ? uti.String.hardTrimBlank(this.ofModule.moduleName) : ''
    );
  }

  private setPulseAnimationInterval() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.pulseDot) {
        return;
      }

      this.pulseDot.nativeElement.style.display = 'block';
      this.showPulseAnimationCount = 0;

      clearInterval(this.pulseAnimationTimer);
      this.pulseAnimationTimer = setInterval(() => {
        if (!this.pulseDot) {
          return;
        }

        if (this.showPulseAnimationCount === 18) {
          this.pulseDot.nativeElement.style.display = 'block';
          this.showPulseAnimationCount = 0;
        } else {
          this.pulseDot.nativeElement.style.display = 'none';
          this.showPulseAnimationCount++;
        }
      }, 10000);
    });
  }

  private wmContainerDragStart(event) {
    this.ngZone.runOutsideAngular(() => {
      this.isDragging = true;
      this.hoverModuleName = '';
      this.isParkedItemsHovering = false;

      var style = window.getComputedStyle(event.target, null);
      this.wmContainerOffset.left =
        parseInt(style.getPropertyValue('left'), 10) - event.clientX;
      this.wmContainerOffset.top =
        parseInt(style.getPropertyValue('top'), 10) - event.clientY;

      const dragImage = document.createElement('div');
      dragImage.style.position = 'absolute';
      dragImage.style.pointerEvents = 'none';
      dragImage.style.top = '0px';
      dragImage.style.left = '0px';
      event.dataTransfer.setDragImage(dragImage, 5, 5);

      this.store.dispatch(
        this.moduleActions.toggleIsWorkingModulesDragging(true)
      );

      let wmContainer = this.wmContainer.nativeElement;
      wmContainer.style.WebkitTransition = '';
      wmContainer.style.MozTransition = '';
    });
  }

  private documentDragOver(event) {
    this.ngZone.runOutsideAngular(() => {
      if (!this.isDragging) {
        return;
      }

      let wmContainer = this.wmContainer.nativeElement;
      wmContainer.style.left =
        event.clientX + this.wmContainerOffset.left + 'px';
      wmContainer.style.top = event.clientY + this.wmContainerOffset.top + 'px';

      event.preventDefault();
      return false;
    });
  }

  private documentDragLeave(event) {
    let mouseX = event.clientX + this.wmContainerOffset.left,
      mouseY = event.clientY + this.wmContainerOffset.top;

    if (mouseX < 0 || mouseY < 0) {
      this.documentDrop(event);
    }
  }

  private documentDrop(event) {
    this.ngZone.runOutsideAngular(() => {
      if (!this.isDragging) {
        return;
      }

      this.isDragging = false;
      this.store.dispatch(
        this.moduleActions.toggleIsWorkingModulesDragging(false)
      );
      let wmContainer = this.wmContainer.nativeElement,
        mouseX = $(wmContainer).offset().left + this.wmContainerOffset.left,
        mouseY = $(wmContainer).offset().top + this.wmContainerOffset.top,
        screenWidth = document.body.clientWidth,
        screenHeight = document.body.clientHeight;

      mouseX = mouseX < 0 ? mouseX * -1 : mouseX;
      mouseY = mouseY < 0 ? mouseY * -1 : mouseY;
      mouseX = mouseX > screenWidth ? screenWidth : mouseX < 0 ? 0 : mouseX;
      mouseY = mouseY > screenHeight ? screenHeight : mouseY < 0 ? 0 : mouseY;

      wmContainer.style.WebkitTransition = 'all 0.5s ease-in-out';
      wmContainer.style.MozTransition = 'all 0.5s ease-in-out';
      const nearLeft = mouseX >= 0 && mouseX < (1 / 4) * screenWidth,
        nearRight = mouseX >= (3 / 4) * screenWidth && mouseX <= screenWidth,
        nearTop =
          mouseX >= (1 / 4) * screenWidth &&
          mouseX < (3 / 4) * screenWidth &&
          mouseY >= 0 &&
          mouseY < (1 / 2) * screenHeight,
        nearBottom =
          mouseX >= (1 / 4) * screenWidth &&
          mouseX < (3 / 4) * screenWidth &&
          mouseY >= (1 / 2) * screenHeight &&
          mouseY <= screenHeight;
      if (nearLeft) {
        wmContainer.style.left = 0 + 'px';
        wmContainer.style.top =
          (mouseY > screenHeight - 37 ? screenHeight - 37 : mouseY) + 'px';
        this.stickPosition = 'left';
      } else if (nearRight) {
        wmContainer.style.left = screenWidth - 35 + 'px';
        wmContainer.style.top =
          (mouseY > screenHeight - 37 ? screenHeight - 37 : mouseY) + 'px';
        this.stickPosition = 'right';
      } else if (nearTop) {
        wmContainer.style.left =
          (mouseX > screenWidth - 37 ? screenWidth - 37 : mouseX) + 'px';
        wmContainer.style.top = 0 + 'px';
        this.stickPosition = 'top';
      } else if (nearBottom) {
        wmContainer.style.left =
          (mouseX > screenWidth - 37 ? screenWidth - 37 : mouseX) + 'px';
        wmContainer.style.top = screenHeight - 37 + 'px';
        this.stickPosition = 'bottom';
      }

      setTimeout(() => {
        this.setUlPosition();
        this.setModuleNamePosition();

        setTimeout(() => {
          this.reloadAndSaveSetting();
        }, 500);
      }, 500);

      this.setPulseAnimationInterval();

      event.preventDefault();
      return false;
    });
  }

  public workingModuleHovering($event: boolean) {
    this.isParkedItemsHovering = $event;
  }

  private setModuleNamePosition() {
    let $moduleName = $(
      '.module-caret-container',
      this.elementRef.nativeElement
    );
    if ($moduleName.length) {
      for (let i = 0; i < $moduleName.length; i++) {
        let $moduleContainer = $($moduleName[i]).closest('.module-container');
        switch (this.stickPosition) {
          case 'top':
            $($moduleName[i]).css({
              top:
                $moduleContainer.offset().top +
                $moduleContainer.outerHeight() +
                'px',
              left: $moduleContainer.offset().left + 'px',
              right: 'auto',
              bottom: 'auto',
            });
            break;
          case 'left':
            $($moduleName[i]).css({
              top: $moduleContainer.offset().top + 'px',
              left:
                $moduleContainer.offset().left +
                $moduleContainer.outerWidth() +
                'px',
              right: 'auto',
              bottom: 'auto',
            });
            break;
          case 'right':
            $($moduleName[i]).css({
              top: $moduleContainer.offset().top + 'px',
              right: $moduleContainer.outerWidth() + 'px',
              left: 'auto',
              bottom: 'auto',
            });
            break;
          case 'bottom':
            $($moduleName[i]).css({
              top:
                $moduleContainer.offset().top -
                $moduleContainer.outerHeight() +
                'px',
              left: $moduleContainer.offset().left + 'px',
              right: 'auto',
              bottom: 'auto',
            });
            break;
        }
      }
    }
  }

  private onModuleNameMouseover(event) {
    const $target = $(event.target);
    setTimeout(() => {
      this.hoverModuleName = $target.closest('a').data('module-name');
    }, 100);
  }

  private onModuleNameMouseleave(event) {
    setTimeout(() => {
      if (!this.isParkedItemsHovering) {
        this.hoverModuleName = '';
      }
    }, 700);
  }

  private subscribeMainModulesState() {
    this.mainModulesStateSubscription = this.mainModulesState.subscribe(
      (mainModulesState: Module[]) => {
        this.appErrorHandler.executeAction(() => {
          this.mainModules = mainModulesState;
        });
      }
    );
  }

  private subscribeSubModulesState() {
    this.subModulesStateSubscription = this.subModulesState.subscribe(
      (subModulesState: Module[]) => {
        this.appErrorHandler.executeAction(() => {
          this.subModules = subModulesState;
        });
      }
    );
  }

  private subcribeFormDirtyState() {
    this.formDirtyStateSubscription = this.formDirtyState.subscribe(
      (formDirtyState: boolean) => {
        this.appErrorHandler.executeAction(() => {
          this.formDirty = formDirtyState;
        });
      }
    );
  }

  private subcribeSelectedParkedItemState() {
    this.selectedParkedItemStateSubscription =
      this.selectedParkedItemState.subscribe(
        (selectedParkedItemState: ParkedItemModel) => {
          this.appErrorHandler.executeAction(() => {
            this.selectedParkedItem = selectedParkedItemState;
          });
        }
      );
  }

  private subcribeSelectedTabState() {
    this.selectedTabStateSubscription = this.selectedTabState.subscribe(
      (selectedTabState: TabSummaryModel) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedTab = selectedTabState;
        });
      }
    );
  }

  private subcribeSelectedAiTabState() {
    this.selectedAiTabStateSubscription = this.selectedAiTabState.subscribe(
      (selectedAiTabState: AdditionalInfromationTabModel) => {
        this.appErrorHandler.executeAction(() => {
          this.selectedAiTab = selectedAiTabState;
        });
      }
    );
  }

  private subcribeOkToChangeModuleState() {
    this.okToChangeModuleSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.OK_TO_CHANGE_MODULE &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (!isEmpty(this.selectedParkedItem)) {
            this.store.dispatch(
              this.propertyPanelActions.requestClearProperties(this.ofModule)
            );
          } else {
            this.okToChangeModule();
          }
        });
      });
  }

  private subscribeRequestClearPropertiesSuccessState() {
    this.requestClearPropertiesSuccessSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type ===
            PropertyPanelActions.REQUEST_CLEAR_PROPERTIES_SUCCESS &&
          action.module.idSettingsGUI == this.ofModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          this.okToChangeModule();
        });
      });
  }

  private subscribeWorkingModulesState() {
    this.workingModulesStateSubscription = this.workingModulesState.subscribe(
      (workingModulesState: Array<any>) => {
        this.appErrorHandler.executeAction(() => {
          this.workingModules = workingModulesState;

          this.setPulseAnimationInterval();
        });
      }
    );
  }

  okToChangeModule() {
    if (this.willChangeWorkingModule && this.formDirty == false) {
      //this.closeCurrentModule();

      this.store.dispatch(
        this.moduleActions.storeModuleStates(
          this.ofModule,
          this.selectedParkedItem,
          this.selectedTab,
          this.selectedAiTab
        )
      );

      this.store.dispatch(
        this.moduleActions.activeModule(this.willChangeWorkingModule)
      );
      this.store.dispatch(
        this.propertyPanelActions.clearProperties(this.ofModule)
      );
      this.store.dispatch(
        this.layoutInfoActions.setRightPropertyPanelWidth('0', this.ofModule)
      );
      this.willChangeWorkingModule = null;
    }
  }

  public selectWorkingModule(workingModule: Module) {
    if (workingModule.idSettingsGUI == this.ofModule.idSettingsGUI) {
      return;
    }

    if (workingModule.idSettingsGUIParent) {
      let mainModule: Module = this.mainModules.find(
        (md) => md.idSettingsGUI === workingModule.idSettingsGUIParent
      );

      if (workingModule.idSettingsGUIParent == MenuModuleId.logistic) {
        mainModule = this.mainModules.find(
          (md) => md.idSettingsGUI == MenuModuleId.backoffice
        );
      }

      if (workingModule.idSettingsGUIParent !== this.ofModule.idSettingsGUI) {
        if (mainModule) {
          this.store.dispatch(
            this.moduleActions.requestChangeModule(mainModule)
          );
        }
      }

      setTimeout(() => {
        this.store.dispatch(
          this.moduleActions.requestChangeSubModule(
            mainModule.idSettingsGUI,
            workingModule.idSettingsGUI
          )
        );
      }, 200);
    } else {
      //this.willChangeWorkingModule = workingModule;
      this.store.dispatch(
        this.moduleActions.requestChangeModule(workingModule)
      );
    }
  }

  public toggleIsHovering(isHovering) {
    this.isHovering = isHovering;

    if (this.isHovering) {
      setTimeout(() => {
        this.setPulseAnimationInterval();
        this.setUlPosition();
        this.setModuleNamePosition();
      }, 400);
    } else {
      setTimeout(() => {
        if (!this.isParkedItemsHovering) {
          this.hoverModuleName = '';
        }
      }, 700);
    }
  }

  private setUlPosition() {
    //setTimeout(() => {
    const $ul = $('ul', this.elementRef.nativeElement);
    const $blink = $('.pulse-container', this.elementRef.nativeElement);
    if ($ul.length && $blink.length) {
      let marginValue = 7;
      marginValue = marginValue - (this.workingModules.length - 1) * 17.5;
      marginValue = marginValue < 0 ? 0 : marginValue;

      if (
        $ul.innerHeight() + $blink.offset().top >
        document.body.clientHeight
      ) {
        marginValue = $ul.innerHeight() * -1 + 40;
      }

      if (this.stickPosition === 'left' || this.stickPosition === 'right') {
        $ul.css('margin-left', 0);
        $ul.css('margin-top', marginValue + 'px');
      } else {
        $ul.css('margin-top', 0);
        $ul.css('margin-left', marginValue + 'px');
      }
    }
    //}, 200);
  }

  public parkedItemsPanelClosed(willMoveToTopParkedItem: ParkedItemModel) {
    if (willMoveToTopParkedItem) {
      this.store.dispatch(
        this.moduleActions.moveSelectedParkedItemToTop(
          this.ofModule,
          willMoveToTopParkedItem
        )
      );
    }
  }
}
