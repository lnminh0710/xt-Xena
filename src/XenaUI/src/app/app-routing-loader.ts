import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs';

export class AppCustomPreloader implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    //console.log('AppCustomPreloader', route.data);
    //return route.data && route.data.preload ? load() : Observable.of(null);
    if (route.data && route.data.preload) {
      //Page Advancesearch and Search don't load private module
      // || location.pathname == '/widget'
      if (
        location.pathname == '/advancesearch' ||
        location.pathname == '/search'
      ) {
        return Observable.of(null);
      }

      //console.log('Preload Path: ' + route.path);
      return load();
    } else {
      return Observable.of(null);
    }
  }
}
