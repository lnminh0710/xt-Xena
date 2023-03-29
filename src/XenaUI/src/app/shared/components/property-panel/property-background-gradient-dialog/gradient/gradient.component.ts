import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AngularMultiSelect } from '../../../xn-control/xn-dropdown';
// import Grapick from './grapick';

declare const Grapick: any;

export interface GradientModal {
  background?: string;
  type?: string;
  direction?: string;
}

@Component({
  selector: 'gradient',
  styleUrls: ['./gradient.component.scss'],
  templateUrl: './gradient.component.html',
  encapsulation: ViewEncapsulation.Emulated,
})
export class GradientComponent implements OnInit, OnChanges, AfterViewInit {
  private graPick: any;
  public backgroundImage: string;
  public selectedTypeGradient: string;
  public selectedDirectionGradient: string;
  public listTypeGradient = [
    {
      idValue: 'radial',
      textValue: 'Radial',
    },
    {
      idValue: 'linear',
      textValue: 'Linear',
    },
  ];

  public listDirection = [
    {
      idValue: 'top',
      textValue: 'Top',
    },
    {
      idValue: 'right',
      textValue: 'Right',
    },
    {
      idValue: 'left',
      textValue: 'Left',
    },
    {
      idValue: 'center',
      textValue: 'Center',
    },
    {
      idValue: 'bottom',
      textValue: 'Bottom',
    },
  ];
  private valueGradient: any;
  private typeGradient: string;
  private directionGradient: string;
  private isConditionDirectionFocus = false;
  private isConditionTypeFocus = false;

  @Input() set propertiesGradient(obj: any) {
    if (obj) {
      this.valueGradient = obj;
    }
  }

  @Output() onApplyBackgroundGradient: EventEmitter<GradientModal> =
    new EventEmitter<GradientModal>();
  @Output() onChangeBackgroundGradient: EventEmitter<GradientModal> =
    new EventEmitter<GradientModal>();
  @ViewChild('directionCtrl') directionCtrl: AngularMultiSelect;

  constructor(
    private ref: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.graPick = new Grapick({ el: '#gp' });
    if (
      this.valueGradient &&
      this.valueGradient.options &&
      this.valueGradient.options.length > 0
    ) {
      this.valueGradient.options.forEach((v) => {
        this.graPick.addHandler(
          Math.round(v.position.replace('%,', '')),
          this.rgb2hex(v.value)
        );
      });
    } else {
      this.graPick.addHandler(10, '#1CB5E0');
      this.graPick.addHandler(90, '#4F1C96');
    }
    this.backgroundImage =
      this.valueGradient && this.valueGradient.value
        ? this.valueGradient.value
        : this.graPick.getSafeValue();
    this.selectedTypeGradient =
      this.valueGradient && this.valueGradient.typeGradient
        ? this.valueGradient.typeGradient
        : null;
    this.selectedDirectionGradient =
      this.valueGradient && this.valueGradient.directionGradient
        ? this.valueGradient.directionGradient
        : null;
    this.disabledCloseButton();
    this.graPick.setDirection(this.selectedDirectionGradient);
    this.graPick.setType(this.selectedTypeGradient);
    this.onApplyBackgroundGradient.emit({
      background: this.backgroundImage,
    });
    this.graPick.on('change', () => {
      this.backgroundImage = this.graPick.getSafeValue();
      this.disabledCloseButton();
      this.onChangeBackgroundGradient.emit({
        background: this.backgroundImage,
      });
    });
  }

  private disabledCloseButton() {
    const oneItem = this.graPick.getHandlers();
    if (oneItem.length === 2) {
      for (
        let i = 0;
        i < this.document.querySelectorAll('.grp-handler-close').length;
        i++
      ) {
        this.document.querySelectorAll('.grp-handler-close')[i]['style'].color =
          '#77777763';
        this.document.querySelectorAll('.grp-handler-close')[i][
          'style'
        ].cursor = 'default';
      }
    } else {
      for (
        let i = 0;
        i < this.document.querySelectorAll('.grp-handler-close').length;
        i++
      ) {
        this.document.querySelectorAll('.grp-handler-close')[i]['style'].color =
          '';
        this.document.querySelectorAll('.grp-handler-close')[i][
          'style'
        ].cursor = '';
      }
    }
  }

  // Function to convert hex format to a rgb color
  private rgb2hex(rgb) {
    rgb = rgb.match(
      /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
    );
    return rgb && rgb.length === 4
      ? '#' +
          ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
          ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
          ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2)
      : '';
  }

  ngOnChanges(changes: SimpleChanges): void {}

  changeTypeGradient(data) {
    this.typeGradient = data && data.idValue;
    if (!this.isConditionTypeFocus) return;
    this.graPick.setType(this.typeGradient);
    this.handlerChangeColorGradient();
  }

  changeDirectionGradient(data) {
    this.directionGradient = data && data.idValue;
    if (!this.isConditionDirectionFocus) return;
    this.graPick.setDirection(this.directionGradient);
    this.handlerChangeColorGradient();
  }

  handlerChangeColorGradient() {
    this.backgroundImage = this.graPick.getSafeValue();
    this.onChangeBackgroundGradient.emit({
      background: this.backgroundImage,
      type: this.typeGradient,
      direction: this.directionGradient,
    });
  }

  onLogicalChangeDirection() {
    this.isConditionDirectionFocus = true;
  }

  onLogicalChangeType() {
    this.isConditionTypeFocus = true;
  }

  ngAfterViewInit(): void {}
}
