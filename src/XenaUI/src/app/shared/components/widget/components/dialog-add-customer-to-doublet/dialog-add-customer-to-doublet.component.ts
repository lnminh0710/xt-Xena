import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToasterService } from 'angular2-toaster';
import { InputTypeNumber } from 'app/models/input-numeric-type.enum';
import { BaseComponent } from 'app/pages/private/base';
import { SearchService } from 'app/services';
import { AppState } from 'app/state-management/store';
import { ProcessDataActions } from 'app/state-management/store/actions';

import get from 'lodash-es/get';

@Component({
  selector: 'dialog-add-customer-to-doublet',
  styleUrls: ['./dialog-add-customer-to-doublet.component.scss'],
  templateUrl: './dialog-add-customer-to-doublet.component.html',
})
export class DialogAddCustomerDoubletComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  constructor(
    private searchService: SearchService,
    private toasterService: ToasterService,
    private store: Store<AppState>,
    private processDataActions: ProcessDataActions,
    protected router: Router
  ) {
    super(router);
  }

  public showDialog = false;
  public typeNumber = InputTypeNumber.Integer;
  public submitted = false;
  public customerName: string;
  public isError: boolean;

  @Output() onClose = new EventEmitter();

  @ViewChild('customerNameCtrl') customerNameCtrl: ElementRef;

  public ngOnInit() {}

  public ngOnDestroy() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.customerNameCtrl.nativeElement.focus();
    }, 800);
  }

  public open() {
    this.showDialog = true;
  }

  public save() {
    this.isError = false;
    if (!this.customerName) {
      this.submitted = true;
      return;
    }
    this.searchService
      .search('customer', this.customerName, 2, 1, 10, 'personNr')
      .subscribe((response: any) => {
        const results = get(response, ['item', 'results']) || [];

        if (results.length !== 1) {
          // this.toasterService.pop('warning', 'Warning', 'Person not found');
          this.isError = true;
        } else {
          this.store.dispatch(
            this.processDataActions.requestAddToDoublet(
              results[0],
              this.ofModule
            )
          );
          this.customerName = '';
        }
        setTimeout(() => {
          this.submitted = false;
          this.customerNameCtrl.nativeElement.focus();
        }, 100);
        // this.cancel()
      });
  }

  public cancel() {
    this.showDialog = false;
    this.onClose.emit();
  }

  public customerNameUp($event) {
    if ($event.keyCode === 13) {
      this.save();
    }
  }
}
