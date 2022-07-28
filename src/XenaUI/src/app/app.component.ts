import {Component, OnDestroy, OnInit} from '@angular/core';
import { Configuration } from './app.constants';
import {GoogleAnalyticsService} from './services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

    constructor(private googleAnalyticsService: GoogleAnalyticsService) { }

    public ngOnInit() {
        // subscribe to the googleAnalytics posts
        this.googleAnalyticsService.subscribe();
        if (Configuration.PublicSettings.isSelectionProject) {
            document.title = 'Selection';
        } else {
            document.title = 'XenaUI';
        }
    }

    ngOnDestroy(): void {
        this.googleAnalyticsService.unsubscribe();
    }
}
