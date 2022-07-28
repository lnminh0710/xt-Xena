import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class EventEmitterService {

    invokeFirstComponentFunction = new BehaviorSubject(false);
    currentMessage = this.invokeFirstComponentFunction.asObservable();

    constructor() { }

    onFirstRefreshWidgetButtonClick(message) {
        this.invokeFirstComponentFunction.next(message);
    }
}
