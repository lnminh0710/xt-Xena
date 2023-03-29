import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HotKeySetting, FormModel } from 'app/models';

@Injectable()
export class OrderDataEntryService {
  public dataEntryOrderDataState$: Observable<FormModel>;

  constructor(private store: Store<any>) {
    this.dataEntryOrderDataState$ = store.select(
      (state) => state.dataEntryState.orderData
    );
    //expose to view
  }
}
