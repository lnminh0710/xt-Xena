import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'sel-country-selected',
  styleUrls: ['./country-selected.component.scss'],
  templateUrl: './country-selected.component.html',
})
export class SelCountrySelectedComponent implements OnInit, OnDestroy {
  @Input() mainList: any;
  @Output() checkedChangeOutput: EventEmitter<any> = new EventEmitter();

  constructor() {}

  public ngOnInit() {}

  public ngOnDestroy() {}

  public itemChanged(idValue: any) {
    this.checkedChangeOutput.emit(idValue);
  }

  public selectActiveItems() {
    return this.mainList.filter((x) => x.isActive);
  }
}
