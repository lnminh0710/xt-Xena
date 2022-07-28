import { Component, ViewChild, ElementRef, Renderer2} from "@angular/core";
import { IHeaderAngularComp } from "ag-grid-angular";
import { BaseAgGridCellComponent } from '../../../shared/base-ag-grid-cell-component';
import { Subscription } from "rxjs";

@Component({
    selector: 'custom-header-cell-renderer',
    templateUrl: './custom-header-cell-renderer.html',
    styleUrls: ['./custom-header-cell-renderer.scss']
})
export class CustomHeaderCellRenderer extends BaseAgGridCellComponent<string> implements IHeaderAngularComp {

    @ViewChild('menuButton', { read: ElementRef }) public menuButton;
    @ViewChild('languageIcon', { read: ElementRef }) public languageIcon: ElementRef;

    public ascSort: string;
    public descSort: string;
    public noSort: string;
    // public activeTranslate: boolean = false;

    private currentSort = '';
    private translateColDetailSuscription: Subscription;
    private allowTranslationSuscription: Subscription;

    constructor(private renderer2: Renderer2) {
        super();
    }

    public get allowTranslation() {
        if (this.params && this.componentParent) {
            return this.componentParent.allowTranslation && !this.isComboboxColumn();
        }
        return false;
    }

    private isComboboxColumn() {
        try {
            return this.colDef && this.colDef.refData && this.colDef.refData.controlType.toLowerCase() == 'combobox';
        }
        catch {
        }
        return false;
    }

    /**
     * onMenuClicked
     **/
    public onMenuClicked(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.allowTranslation) {
            this.params.showColumnMenu(this.menuButton.nativeElement);
        }
        else {
            // this.activeTranslate = !this.activeTranslate;
            let activeTranslate = this.languageIcon.nativeElement.classList.contains('active');
            activeTranslate = !activeTranslate;
            if (activeTranslate && this.params.api) {
                const field = this.colDef.field;
                this.componentParent.activeTranslateField = field;
                let keywords = [];
                this.params.api.forEachNode((rowNode, index) => {
                    if (rowNode.data[field]) {
                        keywords.push(rowNode.data[field]);
                    }
                });
                this.componentParent.onTranslateColDetail.emit({
                    keywords,
                    field,
                    activeTranslate
                });
                this.renderer2.addClass(this.languageIcon.nativeElement,'active');
                const hostElement = this.params.context.componentParent.hostElement;
                let languageIcons: NodeList = hostElement.querySelectorAll('custom-header-cell-renderer .translation');
                if (languageIcons) {
                    for (let i = 0; i < languageIcons.length; i++) {
                        const languageIcon = languageIcons[i];
                        if (languageIcon != this.languageIcon.nativeElement) {
                            this.renderer2.removeClass(languageIcon, 'active');
                        }
                    }
                }
            }
            else {
                this.removeTranslate(activeTranslate);
            }
        }
    };

    private removeTranslate(activeTranslate) {
        if (!this.languageIcon || !this.languageIcon.nativeElement.classList.contains('active')) return;
        this.componentParent.activeTranslateField = '';
        this.renderer2.removeClass(this.languageIcon.nativeElement, 'active');
        this.componentParent.onTranslateColDetail.emit({
            keywords : [],
            field: this.colDef.field,
            activeTranslate
        });
    }

    protected getCustomParam(params: any) {
        this.params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
        this.onSortChanged();
        let activeTranslate = this.componentParent && this.componentParent.activeTranslateField == this.colDef.field;
        if (activeTranslate) {
            setTimeout(() => {
                if (this.languageIcon) {
                    this.renderer2.addClass(this.languageIcon.nativeElement, 'active');
                }
            });
        }
        //this.translateColDetailSuscription = this.componentParent.onTranslateColDetail.subscribe(data => {
        //    if (data && data.field) {
        //        if (data.field != this.colDef.field) {
        //            this.activeTranslate = false;
        //        }
        //    }
        //});

        this.allowTranslationSuscription = this.componentParent.onAllowTranslationAction.subscribe(data => {
           if (data) return;
           this.removeTranslate(false);
        });
    }

    /**
     * onSortChanged
     **/
    public onSortChanged() {
        this.ascSort = this.descSort = this.noSort = 'ag-hidden';
        if (this.params.column.isSortAscending()) {
            this.ascSort = 'active';
        } else if (this.params.column.isSortDescending()) {
            this.descSort = 'active';
        } else {
            this.noSort = 'active';
        }
    }

     /**
     * onSortRequested
     * @param order
     * @param event
     */
    public onSortRequested(event) {
        let sortMode = '';
        switch (this.currentSort) {
            case '':
                sortMode = 'asc';
                break;
            case 'asc':
                sortMode = 'desc';
                break;
            case 'desc':
                sortMode = '';
                break;
        }
         this.componentParent.isSortChanged = true;
         this.currentSort = sortMode;
        this.params.setSort(this.currentSort, event.shiftKey);
    }
}
