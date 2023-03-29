import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ResourceTranslationService } from 'app/services';

@Component({
  selector: 'label-translation',
  styleUrls: ['./label-translation.component.scss'],
  templateUrl: './label-translation.component.html',
  host: {
    '[attr.keyword]': 'keyword',
  },
  encapsulation: ViewEncapsulation.None,
})
export class LabelTranslationComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() keyword: string;
  @Input() defaultValue: string = '';
  @Input() allowUpdateLanguage: boolean = true;
  @Input() params: any = {};

  constructor(
    translate: TranslateService,
    private resourceTranslationService: ResourceTranslationService
  ) {
    translate.setDefaultLang('en');
  }

  public ngOnInit() {}

  public ngOnDestroy() {}

  ngAfterViewInit() {
    if (
      this.resourceTranslationService.translationStatus &&
      this.allowUpdateLanguage
    ) {
      this.resourceTranslationService.rebindEvent();
    }
  }
}
