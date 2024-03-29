﻿import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  forwardRef,
  QueryList,
} from '@angular/core';
import { Module } from 'app/models';
import { PropertyPanelGridValueComponent } from '../property-panel-grid-value';

@Component({
  selector: 'app-property-panel-grid',
  styleUrls: ['./property-panel-grid.component.scss'],
  templateUrl: './property-panel-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyPanelGridComponent implements OnInit, OnDestroy {
  @Input() set datasource(datasource: any[]) {
    this.datasourceLocal = datasource;
    this.changeDetectorRef.markForCheck();
  }
  @Input() set isRoot(isRoot: boolean) {
    this.isRootLocal = isRoot;

    this.changeDetectorRef.markForCheck();
  }
  @Input() set level(level: number) {
    this.levelLocal = level;

    if (this.isRootLocal === false) {
      this.levelLocal += 1;
    }

    this.changeDetectorRef.markForCheck();
  }
  @Input() usingModule: Module;

  @Output() onPropertiesChange = new EventEmitter<any>();
  @Output() onPropertiesApply = new EventEmitter<any>();
  @ViewChildren(forwardRef(() => PropertyPanelGridValueComponent))
  private propertyPanelGridValue: QueryList<PropertyPanelGridValueComponent>;
  public levelLocal = 0;
  public isRootLocal = true;
  public datasourceLocal: any[] = [];
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnDestroy() {}

  public propertiesChange(event) {
    this.onPropertiesChange.emit(event);
  }

  public propertiesApply(event) {
    this.onPropertiesApply.emit(event);
  }

  public resetBackgroundAndReWrite(event) {
    this.propertyPanelGridValue.forEach((propertyPanelGird) => {
      propertyPanelGird.changeDetectorRef.detectChanges();
    });
  }

  public itemsTrackBy(index, item) {
    return item ? item.id : undefined;
  }
}
