import {
  AfterViewInit,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { AutoComplete } from 'wijmo/wijmo.input';
import { Observable, Subscription } from 'rxjs';
import { ModuleList } from '../../../pages/private/base';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state-management/store';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { AppErrorHandler, PropertyPanelService } from '../../../services';
import { Uti } from '../../../utilities';
import { AngularMultiSelect } from 'app/shared/components/xn-control/xn-dropdown';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[wjDropdownHelper]',
})
export class XnWjDropdownHelperDirective
  implements OnInit, AfterViewInit, OnDestroy
{
  private hostComponent: any;
  private autoSelectFirstIfOnlyOne = false;
  private isDropdownBtnClick = false;
  private showDropdownWhenFocus: boolean = false;
  private showDropdownWhenFocusWidget: any;
  private _applyOnWidget: any;
  private globalProperties: any[] = [];

  private globalPropertiesStateSubscription: Subscription;
  private gotFocusSubscription: Subscription;
  private globalPropertiesState: Observable<any>;

  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() dontSelectItemIfOnlyOneWhenFocus: boolean = false;
  @Input() dontShowDropDownButtonWhenEmpty: boolean = false;
  @Input() selectItemWhenHasOneRowWithoutFocus: boolean = false;

  @Input() isInWidget: boolean = false;
  @Input() isInTable: boolean = false;
  @Input() set isShowWhenFocus(isShowWhenFocus: any) {
    this.showDropdownWhenFocusWidget = isShowWhenFocus;
    this.processShowDropdownWhenFocus();
  }
  @Input() set applyOnWidget(isWidget: boolean) {
    this._applyOnWidget = isWidget;
  }

  constructor(
    protected store: Store<AppState>,
    private _viewContainerRef: ViewContainerRef,
    private appErrorHandler: AppErrorHandler,
    private propertyPanelService: PropertyPanelService
  ) {
    this.globalPropertiesState = store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).globalProperties
    );
  }

  ngOnInit() {
    this.globalPropertiesStateSubscription =
      this.globalPropertiesState.subscribe((globalProperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalProperties) {
            this.globalProperties = globalProperties;
            let propSelectFirstIfOnlyOne =
              this.propertyPanelService.getItemRecursive(
                globalProperties,
                'SelectFirstIfOnlyOne'
              );
            if (
              propSelectFirstIfOnlyOne &&
              this.autoSelectFirstIfOnlyOne !== propSelectFirstIfOnlyOne.value
            ) {
              this.autoSelectFirstIfOnlyOne = propSelectFirstIfOnlyOne.value;
            }

            this.processShowDropdownWhenFocus();
          }
        });
      });
  }

  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  ngAfterViewInit() {
    this.hostComponent =
      this._viewContainerRef['_data'].componentView.component;
    if (this.hostComponent) {
      if (this.dontShowDropDownButtonWhenEmpty) {
        this.hostComponent.showDropDownButton = !!(
          this.hostComponent.itemsSource &&
          this.hostComponent.itemsSource.length
        );
      }

      if (this.hostComponent instanceof AngularMultiSelect) {
        this.hostComponent.showDropdownWhenFocus = this.showDropdownWhenFocus;
        this.gotFocusSubscription = this.hostComponent.gotFocus.subscribe(
          this.comboboxGotFocus.bind(this, this.hostComponent)
        );

        //$(this.hostComponent.hostElement.querySelector('button')).on('mousedown', (e) => {
        //    this.isDropdownBtnClick = true;

        //    setTimeout(() => {
        //        this.isDropdownBtnClick = false;
        //    }, 500);
        //})

        //this.hostComponent.isDroppedDownChanging.addHandler(this.comboboxIsDropdownChanging.bind(this));
        //this.hostComponent.isDroppedDownChanged.addHandler(() => {
        //    this.isDropdownBtnClick = false;
        //});

        //if (!this.isInTable) return;
        //setTimeout(() => {
        //    this.comboboxGotFocus(this.hostComponent);
        //});
      }

      if (this.hostComponent instanceof AutoComplete) {
        this.hostComponent.itemsSourceChanged.addHandler(
          this.autoCompleteItemsSourceChanged.bind(this)
        );

        this.hostComponent.addEventListener(
          this.hostComponent.hostElement.querySelector('button'),
          'mousedown',
          (e) => {
            this.isDropdownBtnClick = true;

            setTimeout(() => {
              this.isDropdownBtnClick = false;
            }, 500);
          }
        );
        this.hostComponent.isDroppedDownChanging.addHandler(
          this.comboboxIsDropdownChanging.bind(this)
        );

        if (!this.isInTable) return;
        setTimeout(() => {
          this.autoCompleteItemsSourceChanged(this.hostComponent);
        });
      }

      this.setSelectItemWhenHasOneRowWithoutFocus();
    }
  }

  private processShowDropdownWhenFocus() {
    setTimeout(() => {
      if (this._applyOnWidget || this.showDropdownWhenFocusWidget) {
        this.showDropdownWhenFocus = this.showDropdownWhenFocusWidget;
      } else {
        const propShowDropdownWhenFocus =
          this.propertyPanelService.getItemRecursive(
            this.globalProperties,
            'ShowDropdownWhenFocus'
          );
        this.showDropdownWhenFocus = propShowDropdownWhenFocus
          ? propShowDropdownWhenFocus.value
          : false;
      }
      if (this.hostComponent) {
        this.hostComponent.showDropdownWhenFocus = this.showDropdownWhenFocus;
      }
    }, 500);
  }

  private setSelectItemWhenHasOneRowWithoutFocus() {
    // if (!this.selectItemWhenHasOneRowWithoutFocus) return;
    if (!this.autoSelectFirstIfOnlyOne) return;
    setTimeout(() => {
      if (
        (this.hostComponent instanceof AngularMultiSelect &&
          this.hostComponent.itemsSource &&
          this.hostComponent.itemsSource.length === 1) ||
        (this.hostComponent instanceof AutoComplete &&
          this.hostComponent.itemsSource &&
          this.hostComponent.itemsSource.items &&
          this.hostComponent.itemsSource.items.length === 1)
      ) {
        this.hostComponent.selectedIndex = 0;
        if (this.form) {
          this.form.markAsPristine();
        }
      }
    }, 300);
  }

  private comboboxGotFocus(hostComponent, e?) {
    if (!hostComponent) return;
    if (
      this.autoSelectFirstIfOnlyOne &&
      hostComponent.itemsSource &&
      hostComponent.itemsSource.length === 1 &&
      !this.dontSelectItemIfOnlyOneWhenFocus
    ) {
      hostComponent.selectedIndex = 0;
    }
    if (this.dontShowDropDownButtonWhenEmpty) {
      hostComponent.showDropDownButton = !!(
        hostComponent.itemsSource && hostComponent.itemsSource.length
      );
    }

    // hostComponent.isDroppedDown = true;
  }

  private comboboxIsDropdownChanging(hostComponent, e) {
    if (!this.isDropdownBtnClick && !hostComponent.isDroppedDown) {
      if (!this.showDropdownWhenFocus) {
        e.cancel = true;
        this.isDropdownBtnClick = false;
      }
    }
  }

  private autoCompleteItemsSourceChanged(hostComponent) {
    if (!hostComponent) return;
    if (
      this.autoSelectFirstIfOnlyOne &&
      hostComponent.itemsSource &&
      hostComponent.itemsSource.items &&
      hostComponent.itemsSource.items.length === 1 &&
      !this.dontSelectItemIfOnlyOneWhenFocus
    ) {
      hostComponent.selectedIndex = 0;
    }
    if (this.dontShowDropDownButtonWhenEmpty) {
      hostComponent.showDropDownButton = !!(
        hostComponent.itemsSource && hostComponent.itemsSource.items
      );
    }

    hostComponent.isDroppedDown = true;
  }
}
