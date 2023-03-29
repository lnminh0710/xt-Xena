import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  ElementRef,
  EventEmitter,
} from '@angular/core';

import {
  Module,
  ParkedItemModel,
  ParkedItemMenuModel,
  ApiResultResponse,
} from 'app/models';

import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  ModuleActions,
  ParkedItemActions,
  ProcessDataActions,
  ModuleSettingActions,
  TabSummaryActions,
  SearchResultActions,
  CustomAction,
} from 'app/state-management/store/actions';

import {
  AppErrorHandler,
  ParkedItemService,
  ModuleService,
  AccessRightsService,
} from 'app/services';
import isEqual from 'lodash-es/isEqual';
import isUndefined from 'lodash-es/isUndefined';
import cloneDeep from 'lodash-es/cloneDeep';
import { Uti } from 'app/utilities/uti';
import * as processDataReducer from 'app/state-management/store/reducer/process-data';
import * as parkedItemReducer from 'app/state-management/store/reducer/parked-item';

@Component({
  selector: 'xn-working-modules-parked-items',
  styleUrls: ['./xn-working-modules-parked-items.component.scss'],
  templateUrl: './xn-working-modules-parked-items.component.html',
})
export class XnWorkingModulesParkedItemsComponent implements OnInit, OnDestroy {
  public localParkedItems: ParkedItemModel[];
  public config: any[] = [];
  public localSubModules: Module[] = [];
  public hasParkedItems = false;
  private selectedParkedItem: ParkedItemModel;
  private willChangeParkedItem: ParkedItemModel = null;
  private willMoveToTopParkedItem: ParkedItemModel = null;
  private formDirty: boolean;
  private willChangeModule: Module = null;

  @Input() activeModule: Module;
  @Input() workingModule: Module;
  @Input() set subModules(subModules: Module[]) {
    if (!subModules || !subModules.length) {
      this.getSubModules(this.activeModule);
    } else {
      this.localSubModules = subModules;
    }
  }

  @Input() set fieldConfig(fieldConfig: any[]) {
    if (!fieldConfig || !fieldConfig.length) {
      this.getConfigAndParkedItems(this.workingModule);
    } else {
      this.config = fieldConfig;
    }
  }

  @Input()
  set parkedItems(parkedItems: ParkedItemModel[]) {
    if (
      parkedItems &&
      !parkedItems.length &&
      this.localParkedItems &&
      !this.localParkedItems.length
    ) {
      return;
    }

    if ((!parkedItems || !parkedItems.length) && this.config) {
      this.getParkedItems(this.workingModule);
    } else if (parkedItems && !isEqual(this.localParkedItems, parkedItems)) {
      this.localParkedItems = parkedItems;

      this.hasParkedItems = parkedItems.length != 0;
    }

    setTimeout(() => {
      this.setListPosition();
    }, 200);
  }
  @Input() stickPosition: string = 'left';

  @Output() hovering: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();

  private selectedParkedItemStateSubscription: Subscription;
  private formDirtyStateSubscription: Subscription;
  private parkedItemServiceSubscription: Subscription;
  private moduleServiceSubscription: Subscription;
  private loadParkedItemsCompletedSubscription: Subscription;
  private okToChangeParkedItemSubscription: Subscription;
  private okToChangeModuleSubscription: Subscription;

  private selectedParkedItemState: Observable<any>;
  private formDirtyState: Observable<boolean>;

  public accessRight: any = null;

  constructor(
    private elmRef: ElementRef,
    private store: Store<AppState>,
    private moduleActions: ModuleActions,
    private parkedItemActions: ParkedItemActions,
    private processDataActions: ProcessDataActions,
    private appErrorHandler: AppErrorHandler,
    private parkedItemService: ParkedItemService,
    private moduleService: ModuleService,
    private moduleSettingActions: ModuleSettingActions,
    private tabSummaryActions: TabSummaryActions,
    private searchResultActions: SearchResultActions,
    private dispatcher: ReducerManagerDispatcher,
    private accessRightsService: AccessRightsService
  ) {
    this.selectedParkedItemState = store.select(
      (state) =>
        parkedItemReducer.getParkedItemState(
          state,
          this.workingModule.moduleNameTrim
        ).selectedParkedItem
    );
    this.formDirtyState = store.select(
      (state) =>
        processDataReducer.getProcessDataState(
          state,
          this.workingModule.moduleNameTrim
        ).formDirty
    );
  }

  ngOnInit() {
    this.subcribeSelectedParkedItemState();
    this.subcribeFormDirtyState();
    this.subcribeLoadParkedItemsCompletedState();
    this.subcribeOkToChangeParkedItemState();
    this.subcribeOkToChangeModuleState();
  }

  ngAfterViewInit() {
    this.accessRight = {
      //accessRight For Module
      module: this.accessRightsService.GetAccessRightsForModule(
        this.workingModule
      ),
      //accessRight For ParkedItem
      parkedItem: this.accessRightsService.GetAccessRightsForParkedItem(
        this.workingModule
      ),
    };

    $(this.elmRef.nativeElement).on(
      'mouseover',
      'div.working-modules__pkit__container',
      this.onModuleNameMouseover.bind(this)
    );
    $(this.elmRef.nativeElement).on(
      'mouseleave',
      'div.working-modules__pkit__container',
      this.onModuleNameMouseleave.bind(this)
    );
  }

  private onModuleNameMouseover(event) {
    this.hovering.emit(true);
  }

  private onModuleNameMouseleave(event) {
    this.hovering.emit(false);
  }

  ngOnDestroy() {
    $(this.elmRef.nativeElement).off(
      'mouseover',
      'div.working-modules__pkit__container',
      this.onModuleNameMouseover
    );
    $(this.elmRef.nativeElement).off(
      'mouseleave',
      'div.working-modules__pkit__container',
      this.onModuleNameMouseleave
    );

    this.close.emit(this.willMoveToTopParkedItem);

    Uti.unsubscribe(this);
  }

  private subcribeSelectedParkedItemState() {
    this.selectedParkedItemStateSubscription =
      this.selectedParkedItemState.subscribe((selectedParkedItemState: any) => {
        this.appErrorHandler.executeAction(() => {
          if (selectedParkedItemState) {
            this.selectedParkedItem = selectedParkedItemState;
          }
        });
      });
  }

  private getConfigAndParkedItems(activeModule: Module) {
    this.parkedItemServiceSubscription = this.parkedItemService
      .getParkedItemMenu(activeModule)
      .subscribe((results: ParkedItemMenuModel[]) => {
        this.appErrorHandler.executeAction(() => {
          if (!$.isEmptyObject(results)) {
            this.config = this.parkedItemService.buildFieldConfig(results);
          }

          this.getParkedItems(activeModule);
        });
      });
  }

  private getParkedItems(activeModule: Module) {
    this.parkedItemServiceSubscription = this.parkedItemService
      .getListParkedItemByModule(activeModule)
      .subscribe((results: any) => {
        this.appErrorHandler.executeAction(() => {
          if (!$.isEmptyObject(results)) {
            this.localParkedItems = results.collectionParkedtems;

            this.store.dispatch(
              this.moduleActions.addWorkingModule(
                activeModule,
                this.localSubModules,
                this.localParkedItems,
                this.config,
                true
              )
            );

            this.hasParkedItems =
              !isUndefined(this.localParkedItems) &&
              this.localParkedItems.length != 0;
          }
        });
      });
  }

  private getSubModules(activeModule: Module) {
    this.moduleServiceSubscription = this.moduleService
      .getDetailSubModule(activeModule.idSettingsGUI)
      .subscribe((response: ApiResultResponse) => {
        this.appErrorHandler.executeAction(() => {
          if (!Uti.isResquestSuccess(response)) {
            return;
          }
          this.localSubModules = response.item;
        });
      });
  }

  public setListPosition() {
    const $moduleNameText = $(
      '#' + this.workingModule.idSettingsGUI + '-module-name'
    );
    if ($moduleNameText.length) {
      const $moduleContainer = $moduleNameText.closest('.module-container'),
        $moduleNameTextOffset = $moduleNameText.offset(),
        $parkedItemList = $(this.elmRef.nativeElement).find(
          '#' + this.workingModule.idSettingsGUI + '-parked-items-list'
        ),
        $parkedItemListLeft = 0,
        $parkedItemListTop = 0;

      if (!$parkedItemList.length) {
        return;
      }

      switch (this.stickPosition) {
        case 'left':
          $parkedItemList.css({
            top: 'auto',
            left:
              $moduleNameTextOffset.left + $moduleNameText.outerWidth() + 'px',
            right: 'auto',
            bottom: 'auto',
          });
          break;
        case 'right':
          $parkedItemList.css({
            top: 'auto',
            left: 'auto',
            right:
              $moduleContainer.outerWidth() +
              $moduleNameText.outerWidth() +
              'px',
            bottom: 'auto',
          });
          break;

        case 'top':
        case 'bottom':
          $parkedItemList.css({
            top: 'auto',
            left: $moduleNameTextOffset.left + 'px',
            right: 'auto',
            bottom: 'auto',
          });
          break;
      }

      setTimeout(() => {
        const rect =
          $parkedItemList && $parkedItemList[0]
            ? $parkedItemList[0].getBoundingClientRect()
            : { height: 0 };
        switch (this.stickPosition) {
          case 'left':
          case 'right':
            $parkedItemList.css(
              'top',
              $moduleNameTextOffset.top + rect.height > window.innerHeight
                ? window.innerHeight - rect.height + 'px'
                : $moduleNameTextOffset.top + 'px'
            );
            break;

          case 'top':
            $parkedItemList.css(
              'top',
              $moduleNameTextOffset.top + $moduleNameText.outerHeight() + 'px'
            );
            break;

          case 'bottom':
            $parkedItemList.css(
              'top',
              $moduleNameTextOffset.top - $parkedItemList.outerHeight() + 'px'
            );
            break;
        }
      }, 100);
    }
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

  private subcribeLoadParkedItemsCompletedState() {
    this.loadParkedItemsCompletedSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.LOAD_PARKED_ITEMS_COMPLETED &&
          action.module.idSettingsGUI == this.workingModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (this.willChangeParkedItem && this.formDirty == false) {
            this.changeToNewParkedItem();
          }
        });
      });
  }

  private subcribeOkToChangeParkedItemState() {
    this.okToChangeParkedItemSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.OK_TO_CHANGE_PARKED_ITEM &&
          action.module.idSettingsGUI == this.workingModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (this.willChangeParkedItem) {
            if (
              this.workingModule.idSettingsGUI !=
              this.activeModule.idSettingsGUI
            ) {
              this.store.dispatch(
                this.moduleActions.requestChangeModule(this.workingModule)
              );
            } else {
              this.changeToNewParkedItem();
            }
          } else if (this.willChangeModule && this.formDirty == false) {
            this.store.dispatch(
              this.moduleActions.requestChangeModule(this.willChangeModule)
            );

            setTimeout(() => {
              if (this.willChangeModule) {
                this.store.dispatch(
                  this.moduleActions.requestCreateNewModuleItem(
                    this.willChangeModule
                  )
                );
              }
              this.willChangeModule = null;
            }, 500);
          }
        });
      });
  }

  private subcribeOkToChangeModuleState() {
    this.okToChangeModuleSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return (
          action.type === ProcessDataActions.OK_TO_CHANGE_MODULE &&
          action.module.idSettingsGUI == this.workingModule.idSettingsGUI
        );
      })
      .subscribe(() => {
        this.appErrorHandler.executeAction(() => {
          if (this.willChangeModule && this.formDirty == false) {
            this.store.dispatch(
              this.moduleActions.requestChangeModule(this.willChangeModule)
            );

            setTimeout(() => {
              if (this.willChangeModule) {
                this.store.dispatch(
                  this.moduleActions.requestCreateNewModuleItem(
                    this.willChangeModule
                  )
                );
              }
              this.willChangeModule = null;
            }, 500);
          }
        });
      });
  }

  private changeToNewParkedItem() {
    if (!this.willChangeParkedItem) {
      return;
    }

    if (
      this.willChangeParkedItem['idSettingsGUI'] &&
      this.willChangeParkedItem['idSettingsGUI'].value !=
        this.workingModule.idSettingsGUI
    ) {
      if (this.subModules) {
        const subModule = this.subModules.find(
          (sub) =>
            sub.idSettingsGUI ==
            this.willChangeParkedItem['idSettingsGUI'].value
        );
        if (subModule) {
          this.store.dispatch(
            this.moduleActions.requestChangeSubModule(
              this.workingModule.idSettingsGUI,
              subModule.idSettingsGUI
            )
          );
        }
      }
    }

    this.store.dispatch(
      this.parkedItemActions.selectParkedItem(
        this.willChangeParkedItem,
        this.workingModule
      )
    );
    this.store.dispatch(
      this.moduleActions.resetSelectingWorkingModuleParkedItem(
        this.workingModule
      )
    );
    this.willMoveToTopParkedItem = cloneDeep(this.willChangeParkedItem);
    this.willChangeParkedItem = null;
  }

  public selectParkedItem(parkedItem: ParkedItemModel) {
    this.willChangeParkedItem = parkedItem;
    setTimeout(() => {
      this.store.dispatch(
        this.processDataActions.requestChangeParkedItem(this.workingModule)
      );
    }, 200);
  }

  public clickNewModuleItem(clickedModule) {
    if (clickedModule.idSettingsGUI != this.activeModule.idSettingsGUI) {
      this.willChangeModule = clickedModule;
      this.store.dispatch(
        this.processDataActions.requestChangeModule(this.workingModule)
      );
      setTimeout(() => {
        this.store.dispatch(
          this.moduleActions.requestCreateNewModuleItem(clickedModule)
        );
      }, 200);
    } else {
      this.store.dispatch(
        this.moduleActions.requestCreateNewModuleItem(clickedModule)
      );
    }
  }
}
