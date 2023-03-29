import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Configuration } from 'app/app.constants';
import { Uti } from 'app/utilities/uti';
import { UserService } from 'app/services';

@Injectable()
export class CanActivateGuard implements CanActivate {
  constructor(
    private router: Router,
    private consts: Configuration,
    private uti: Uti,
    private userService: UserService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (localStorage.getItem(this.consts.localStorageCurrentUser)) {
      const userInfo = this.uti.getUserInfo();
      this.userService.setCurrentUser(userInfo);
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate([this.consts.loginUrl]);
    return false;
  }
}
