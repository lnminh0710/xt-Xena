import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class ContextMenuService {
  public show: Subject<{event: MouseEvent, obj: any[]}> = new Subject();
  public setMenuData: Subject<{obj: any[]}> = new Subject();
}
