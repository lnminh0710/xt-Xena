import { BrowserModule, EventManager } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpModule, Http, RequestOptions, Response } from '@angular/http';

import { AppComponent } from './app.component';
import { Configuration } from './app.constants';
import { BaseService } from 'app/services/base.service';
import { CustomEventManager } from 'app/services/common/custom-event-manager.service';
import { Uti } from 'app/utilities/uti';

import { JwtConfigService, JwtHttp } from 'angular2-jwt-refresh';
import { AuthConfig } from 'angular2-jwt';

// main bootstrap
import { AppRoutingModule } from './app.routing';
import * as $ from 'jquery';

import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './route-reuse-strategy';

import { HomeComponent } from './pages/home/home.component';

import { AppLoadService } from './app-load.service';
import { GoogleAnalyticsService } from './services';
import { XnTooltipModule } from './shared/directives/xn-tooltip/xn-tooltip.module';
export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.initializeApp();
}

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    XnTooltipModule,
  ],
  providers: [
    Configuration,
    GoogleAnalyticsService,
    BaseService,
    Uti,
    {
      provide: JwtHttp,
      useFactory: getJwtHttp,
      deps: [Http],
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
    },
    {
      provide: EventManager,
      useClass: CustomEventManager,
    },
    AppLoadService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppLoadService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function getJwtHttp(http: Http, options: RequestOptions) {
  let consts = new Configuration();
  let jwtOptions = {
    endPoint: consts.refreshTokenUrl,
    beforeSeconds: consts.expiredTokenOffsetSeconds,
    tokenName: 'refresh_token',
    refreshTokenGetter: () =>
      localStorage.getItem(consts.localStorageRefreshToken),
    tokenSetter: (res: Response): boolean | Promise<void> => {
      res = res.json();
      const item = res['item'];
      if (!item['access_token'] || !item['refresh_token']) {
        localStorage.removeItem(consts.localStorageAccessToken);
        localStorage.removeItem(consts.localStorageRefreshToken);

        return false;
      }

      localStorage.setItem(
        consts.localStorageAccessToken,
        item['access_token']
      );
      localStorage.setItem(
        consts.localStorageRefreshToken,
        item['refresh_token']
      );

      return true;
    },
  };
  let authConfig = new AuthConfig({
    noJwtError: true,
    globalHeaders: [{ Accept: 'application/json' }],
    tokenGetter: () => localStorage.getItem(consts.localStorageAccessToken),
  });

  return new JwtHttp(
    new JwtConfigService(jwtOptions, authConfig),
    http,
    options
  );
}
