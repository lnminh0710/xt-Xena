import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../environments/environment';

declare let ga: Function;

@Injectable()
export class GoogleAnalyticsService {
  private missingGaCount = 0;
  private readonly logging = environment!.googleAnalytics!.logging;
  private readonly isActive: boolean = environment!.googleAnalytics!.active;
  private readonly UAId: string = environment!.googleAnalytics!.uaId;
  private subscription: Subscription;

  constructor(private router: Router) {}

  /**
   * Track an event with your custom data in google analytics
   * -
   * @param {string} category Typically the object that was interacted with (e.g. 'Image')
   * @param {string} label The type of interaction (e.g. 'play')
   * @param {string} [action=null] Useful for categorizing events (e.g. 'Campaign')
   * @param {number} [value=null] A numeric value associated with the event (e.g. 30)
   * @memberof GoogleAnalyticsEventService
   */
  public trackEvent(
    category: string,
    label: string,
    action: string = null,
    value: number = null
  ) {
    try {
      if (this.isActive) {
        ga('send', 'event', {
          eventCategory: category,
          eventLabel: label,
          eventAction: action,
          eventValue: value,
        });
      }
    } catch (error) {
      if (this.logging && this.logging.exceptions) {
        console.error(
          `error: ${JSON.stringify(error, [
            'message',
            'arguments',
            'type',
            'name',
          ])}`
        );
      }
    }

    // testing
    // if (this.logging && this.logging.debug) {
    //     console.log(category, label, action, value);
    // }
  }

  public subscribe() {
    if (!this.subscription) {
      this.subscription = this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          try {
            if (this.isActive && this.UAId.length > 0) {
              if (e.urlAfterRedirects && (<any>window).ga) {
                (<any>window).ga('create', `${this.UAId}`, 'auto');
                (<any>window).ga('set', 'page', e.urlAfterRedirects);
                (<any>window).ga('send', 'pageview');
              } else {
                if (
                  this.logging &&
                  this.logging.exceptions &&
                  this.missingGaCount > 1
                ) {
                  console.error(`can't find <any>window).ga`);
                }
                // mark that we've been through this
                this.missingGaCount++;
              }
              // if (this.logging && this.logging.debug) {
              //     console.log(`logging: ${e.urlAfterRedirects} to google analytics`);
              // }
            } else {
              if (this.logging && this.logging.debug) {
                console.log(
                  `logging not enabled: ${e.urlAfterRedirects} to google analytics`
                );
              }
            }
          } catch (ex) {
            if (this.logging && this.logging.exceptions) {
              console.error(
                JSON.stringify(ex, ['message', 'arguments', 'type', 'name'])
              );
              console.error(
                `tracking failed - make sure you installed the scripts`
              );
            }
          }
        }
      });
    }
  }

  public unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
