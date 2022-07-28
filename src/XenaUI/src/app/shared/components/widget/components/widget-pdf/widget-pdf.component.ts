import { Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Configuration } from 'app/app.constants';
import { WjPdfViewer } from 'wijmo/wijmo.angular2.viewer';
import { Uti } from 'app/utilities';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { AppState } from 'app/state-management/store';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import * as tabButtonReducer from 'app/state-management/store/reducer/tab-button';
import * as tabSummaryReducer from 'app/state-management/store/reducer/tab-summary';
import { CustomAction, LayoutInfoActions } from 'app/state-management/store/actions';
import { AppErrorHandler } from 'app/services';
import { Module, TabSummaryModel } from 'app/models';

@Component({
    selector: 'pdf-widget',
    styleUrls: ['./widget-pdf.component.scss'],
    templateUrl: './widget-pdf.component.html',
    encapsulation: ViewEncapsulation.None
})

export class WidgetPdfComponent implements OnInit {
    public pdfApiUrl: string = Configuration.PublicSettings.pdfApiUrl;
    public pdfUrl: string;

    /* Default: IF widget wants to connect with pdf viewer should expose the rowData has 'pdf' key like
                                                                                    let rowData: any = [{
                                                                                        key: 'PDF',
                                                                                        value: pdfString
                                                                                    }];
    */
    private _pdfColumn: any = [{ key: 'pdf' }];
    private _rowData: any;

    @Input() set pdfColumn(pdfColumn: any) {
        if (pdfColumn) {
            this._pdfColumn = pdfColumn.options.filter(v => v && v.value === pdfColumn.value || v.key === pdfColumn.value);
            this.execRowData(this._rowData, this._pdfColumn);
        }
    };

    @Input() set rowData(data: any) {
        this._rowData = data;
        if (this._pdfColumn) {
            this.execRowData(data, this._pdfColumn);
        }
    }

    @Input() currentModule: Module;
    @Input() set setPdfUrl(pdfUrl: string) {
        if (!pdfUrl) {
            this.pdfUrl = '';
            this.refresh(1000);
            return;
        }

        this.pdfUrl = pdfUrl;
        this.calculateSizeWithTimeout();
    }

    @Input() set refreshPdfWidget(refreshGuid: any) {
        if (refreshGuid) {
            this.calculateSizeWithTimeout();
        }
    }

    @ViewChild(WjPdfViewer) wjPdfViewer: WjPdfViewer;

    private isShowTabButtonState: Observable<any>;
    private isShowTabButtonStateSubscription: Subscription;
    private isTabCollapsedState: Observable<boolean>;
    private isTabCollapsedStateSubscription: Subscription;
    private resizeSplitterStateSubscription: Subscription;
    private selectedTabHeaderModel: Observable<TabSummaryModel>;
    private selectedTabHeaderModelSubscription: Subscription;
    private isAfterViewInit: boolean = false;

    constructor(private elRef: ElementRef,
        private changeRef: ChangeDetectorRef,
        private store: Store<AppState>,
        private dispatcher: ReducerManagerDispatcher,
        private appErrorHandler: AppErrorHandler, ) {

        this.selectedTabHeaderModel = this.store.select(state => tabSummaryReducer.getTabSummaryState(state, this.currentModule.moduleNameTrim).selectedTab);
        this.isShowTabButtonState = store.select(state => tabButtonReducer.getTabButtonState(state, this.currentModule.moduleNameTrim).isShow);
        this.isTabCollapsedState = store.select(state => tabSummaryReducer.getTabSummaryState(state, this.currentModule.moduleNameTrim).isTabCollapsed);
    }

    public ngOnInit() {
        this.subscribe();
    }

    ngAfterViewInit() {
        this.calculateSizeWithTimeout();

        const that = this;
        $(window).resize(function () {
            that.calculateSizeWithTimeout();
        });
    }

    ngOnDestroy() {
        Uti.unsubscribe(this);
        $(window).unbind('resize');
    }

    private subscribe() {
        if (this.resizeSplitterStateSubscription) this.resizeSplitterStateSubscription.unsubscribe();
        this.resizeSplitterStateSubscription = this.dispatcher.filter((action: CustomAction) => {
            return action.type === LayoutInfoActions.RESIZE_SPLITTER && action.module.idSettingsGUI == this.currentModule.idSettingsGUI;
        }).subscribe((data: CustomAction) => {
            this.appErrorHandler.executeAction(() => {
                if (this.isAfterViewInit) {
                    if (!data) return;

                    // if widget element is not visible, do nothing
                    if (this.elRef && this.elRef.nativeElement && this.elRef.nativeElement.offsetParent == null) return;

                    this.calculateSizeWithTimeout();
                }
            });
        });

        if (this.isShowTabButtonStateSubscription) this.isShowTabButtonStateSubscription.unsubscribe();
        this.isShowTabButtonStateSubscription = this.isShowTabButtonState.subscribe((isShowTabButtonState: boolean) => {
            this.appErrorHandler.executeAction(() => {
                if (isShowTabButtonState) {
                    //console.log('isShowTabButton: ' + isShowTabButtonState);
                    this.calculateSizeWithTimeout();
                }
            });
        });

        if (this.isTabCollapsedStateSubscription) this.isTabCollapsedStateSubscription.unsubscribe();
        this.isTabCollapsedStateSubscription = this.isTabCollapsedState.subscribe((isTabCollapsedState: boolean) => {
            this.appErrorHandler.executeAction(() => {
                //console.log('isTabCollapsed');
                this.calculateSizeWithTimeout();
            });
        });

        if (this.selectedTabHeaderModelSubscription) this.selectedTabHeaderModelSubscription.unsubscribe();
        this.selectedTabHeaderModelSubscription = this.selectedTabHeaderModel.subscribe((selectedTabHeader: TabSummaryModel) => {
            this.appErrorHandler.executeAction(() => {
                //console.log('selectedTab');
                this.calculateSizeWithTimeout();
            });
        });
    }

    private execRowData(rowData: any, columnPdf: any) {
        if (!columnPdf || !columnPdf.length || !rowData || !rowData.data) return;

        const removeCharacterSpecial = columnPdf[0].key.replace(/_/g, '').toLowerCase();
        for (const fileName of rowData.data) {
            if (!fileName.key ||
                removeCharacterSpecial !== fileName.key.toLowerCase()) {
                continue;
            }

            this.pdfUrl = (fileName.value || '').replace(Configuration.PublicSettings.fileShareUrl, '');
            console.log('pdfUrl: ' + this.pdfUrl);
            this.refresh(1000);
            return;
        }//for
    }

    public refresh(delayTimeout?: number) {
        if (!this.pdfUrl || !this.wjPdfViewer) return;

        if (delayTimeout) {
            setTimeout(() => {
                this.wjPdfViewer.refresh();
            }, delayTimeout);
        }
        else {
            this.wjPdfViewer.refresh();
        }
    }

    private setImageSizeTimeout: any = null;
    private calculateSizeWithTimeout(timeout?: number, timeoutRefresh?: number) {
        if (!this.pdfUrl) return;

        timeout = timeout || 300;

        clearTimeout(this.setImageSizeTimeout);
        this.setImageSizeTimeout = null;
        this.setImageSizeTimeout = setTimeout(() => {
            //console.log('pdf-calculateSize');
            this.calculateSize();
            this.refresh(timeoutRefresh);
        }, timeout);
    }

    private calculateSize() {
        const parentHeight = $(this.elRef.nativeElement).parent().height();
        if (parentHeight) {
            //console.log('parentHeight: ' + parentHeight);
            $(this.elRef.nativeElement).find('wj-pdf-viewer').css('height', parentHeight + 'px');
        }
    }
}
