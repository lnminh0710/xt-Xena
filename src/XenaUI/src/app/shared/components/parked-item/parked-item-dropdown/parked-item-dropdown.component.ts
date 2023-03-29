import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ParkedItemService, AppErrorHandler } from 'app/services';
import { ParkedItemMenuModel, Module } from 'app/models';

import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { Subscription } from 'rxjs/Subscription';
import { Uti } from 'app/utilities';

export function getDropdownConfig(): BsDropdownConfig {
  return Object.assign(new BsDropdownConfig(), { autoClose: false });
}

@Component({
  selector: 'parked-item-dropdown',
  styleUrls: ['./parked-item-dropdown.component.scss'],
  templateUrl: './parked-item-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: BsDropdownConfig, useFactory: getDropdownConfig }],
})
export class ParkedItemDropdownComponent implements OnInit, OnDestroy {
  public status: { isopen: boolean } = { isopen: false };
  private menuItems: ParkedItemMenuModel[] = [];
  public activeModule: Module;
  private parkedItemServiceSubscription: Subscription;

  @Input()
  set config(config: any) {
    config = this.parkedItemService.setFieldActive('IdPerson', config);
    this.menuItems = config;
    this.changeDetectorRef.markForCheck();
  }

  @Input() isDisableToggleMenu: any = false;
  @Input()
  set moduleData(moduleData: any) {
    this.activeModule = moduleData;
    this.changeDetectorRef.markForCheck();
  }

  @Output() onApply: EventEmitter<boolean> = new EventEmitter();
  @Output() deleteAllParkedItem: EventEmitter<boolean> = new EventEmitter();

  @HostListener('document:click.out-zone', ['$event'])
  onDocumentClick(event) {
    if (!this._eref.nativeElement.contains(event.target))
      // or some similar check
      this.toggled(false);
  }

  @Input() accessRight: any = {};

  constructor(
    private _eref: ElementRef,
    private parkedItemService: ParkedItemService,
    private changeDetectorRef: ChangeDetectorRef,
    private appErrorHandler: AppErrorHandler
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    Uti.unsubscribe(this);
  }

  apply() {
    if (this.isDisableToggleMenu) return;
    if (!this.menuItems.length) {
      return;
    }

    const menuItems = this.parkedItemService.buildActiveMenuItemListForSave(
      this.menuItems
    );

    this.parkedItemServiceSubscription = this.parkedItemService
      .saveParkedMenuItem(menuItems, this.activeModule)
      .subscribe((result: boolean) => {
        this.appErrorHandler.executeAction(() => {
          if (result) {
            this.toggled(false);
            this.onApply.emit(true);
          }
        });
      });
  }

  public deleteAllParkItem() {
    this.deleteAllParkedItem.emit();
  }

  public toggled(open: boolean): void {
    this.status.isopen = open;

    this.changeDetectorRef.markForCheck();
  }

  public itemsTrackBy(index, item) {
    return item ? item.fieldName : undefined;
  }
}
