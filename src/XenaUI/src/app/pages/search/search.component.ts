import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/state-management/store';
import {
  ModuleActions,
  ParkedItemActions,
  ModuleSettingActions,
} from 'app/state-management/store/actions';
import { Observable, Subscription } from 'rxjs/Rx';
import { LocalStorageKey } from 'app/app.constants';
import { Uti } from 'app/utilities';

@Component({
  selector: 'app-root',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  host: {
    '(window:resize)': 'resizeEventHandler($event)',
  },
})
export class SearchComponent implements OnInit, OnDestroy {
  public tabs;
  private updateModuleStateSubscription: Subscription;
  private browserTabId: string = Uti.defineBrowserTabId();

  constructor(
    private store: Store<AppState>,
    private moduleActions: ModuleActions,
    private parkedItemActions: ParkedItemActions,
    private moduleSettingActions: ModuleSettingActions
  ) {}

  public ngOnInit() {
    this.store.dispatch(this.moduleActions.loadMainModules());
    $('#page-loading').remove();
    this.updateState();
  }

  public ngOnDestroy() {
    if (this.updateModuleStateSubscription) {
      this.updateModuleStateSubscription.unsubscribe();
    }
  }

  public resizeEventHandler(e: any): void {}

  public updateState() {
    this.restoreTab();
    this.restoreModule();
    this.restoreModuleSetting();
    this.restoreParkedItems();
    this.subscribeModuleState();
  }

  /**
   * subscribeModuleState
   * */
  public subscribeModuleState() {
    const LocalStorageGSModuleKey = LocalStorageKey.buildKey(
      LocalStorageKey.LocalStorageGSModuleKey,
      this.browserTabId
    );
    const LocalStorageGSParkedItemsKey = LocalStorageKey.buildKey(
      LocalStorageKey.LocalStorageGSParkedItemsKey,
      this.browserTabId
    );
    const LocalStorageGSModuleSettingKey = LocalStorageKey.buildKey(
      LocalStorageKey.LocalStorageGSModuleSettingKey,
      this.browserTabId
    );

    this.updateModuleStateSubscription = Observable.fromEvent<StorageEvent>(
      window,
      'storage'
    )
      .filter((evt) => {
        return (
          (evt.key == LocalStorageGSModuleKey ||
            evt.key == LocalStorageGSParkedItemsKey ||
            evt.key == LocalStorageGSModuleSettingKey) &&
          evt.newValue !== null &&
          evt.newValue != 'undefined'
        );
      })
      .subscribe((evt) => {
        if (evt.newValue) {
          const newState = JSON.parse(evt.newValue);
          if (newState) {
            if (
              newState.browserTabId &&
              newState.browserTabId != this.browserTabId
            )
              return;

            switch (evt.key) {
              case LocalStorageKey.LocalStorageGSModuleKey:
                this.store.dispatch(
                  this.moduleActions.updateModuleStateFromLocalStorage(newState)
                );
                break;
              case LocalStorageKey.LocalStorageGSModuleSettingKey:
                this.store.dispatch(
                  this.moduleSettingActions.restoreAllState(newState)
                );
                break;
              case LocalStorageKey.LocalStorageGSParkedItemsKey:
                this.store.dispatch(
                  this.parkedItemActions.restoreAllState(newState)
                ); //loadParkedItemsSuccess
                break;
            }
          }
        }
        // console.log('updateState:' + evt);
      });
  }

  /**
   * restoreTab
   **/
  public restoreTab() {
    const data = localStorage.getItem(
      LocalStorageKey.buildKey(
        LocalStorageKey.LocalStorageGSTabKey,
        this.browserTabId
      )
    );
    if (data) {
      if (data['browserTabId'] && data['browserTabId'] != this.browserTabId)
        return;
      this.tabs = JSON.parse(data).tabs;
    }
  }

  /**
   * restoreModule
   **/
  public restoreModule() {
    const data = localStorage.getItem(
      LocalStorageKey.buildKey(
        LocalStorageKey.LocalStorageGSModuleKey,
        this.browserTabId
      )
    );
    if (data) {
      const newState = JSON.parse(data);
      if (newState) {
        if (data['browserTabId'] && data['browserTabId'] != this.browserTabId)
          return;
        this.store.dispatch(
          this.moduleActions.updateModuleStateFromLocalStorage(newState)
        );
      }
    }
  }

  /**
   * restoreParkedItems
   **/
  public restoreParkedItems() {
    const data = localStorage.getItem(
      LocalStorageKey.buildKey(
        LocalStorageKey.LocalStorageGSParkedItemsKey,
        this.browserTabId
      )
    );
    if (data) {
      const newState = JSON.parse(data);
      if (newState) {
        if (data['browserTabId'] && data['browserTabId'] != this.browserTabId)
          return;
        this.store.dispatch(this.parkedItemActions.restoreAllState(newState)); //loadParkedItemsSuccess
      }
    }
  }

  public restoreModuleSetting() {
    const data = localStorage.getItem(
      LocalStorageKey.buildKey(
        LocalStorageKey.LocalStorageGSModuleSettingKey,
        this.browserTabId
      )
    );
    if (data) {
      const newState = JSON.parse(data);
      if (newState) {
        if (data['browserTabId'] && data['browserTabId'] != this.browserTabId)
          return;
        this.store.dispatch(
          this.moduleSettingActions.restoreAllState(newState)
        );
      }
    }
  }
}
