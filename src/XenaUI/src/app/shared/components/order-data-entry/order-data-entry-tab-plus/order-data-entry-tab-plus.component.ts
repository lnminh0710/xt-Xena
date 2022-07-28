import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

export function getBsDropdownConfig(): BsDropdownConfig {
    return Object.assign(new BsDropdownConfig(), { autoClose: false });
}
@Component({
    selector: 'app-order-data-entry-tab-plus',
    styleUrls: ['./order-data-entry-tab-plus.component.scss'],
    templateUrl: './order-data-entry-tab-plus.component.html',
    providers: [{ provide: BsDropdownConfig, useFactory: getBsDropdownConfig }],
})
export class OrderDataEntryTabPlusComponent implements OnInit {

    public status: any = { isOpen: false };
    public perfectScrollbarConfig: any;

    @Input() tabs: any[] = [];
    @Output() dropdownItemClicked: EventEmitter<any> = new EventEmitter();

    @HostListener('document:click.out-zone', ['$event']) onDocumentClick(event) {
        if (!this._eref.nativeElement.contains(event.target)) { // or some similar check
            this.toggled(false);
        }
    }

    constructor(private _eref: ElementRef) {
    }

    ngOnInit() {
        this.perfectScrollbarConfig = {
            suppressScrollX: true,
            suppressScrollY: false
        };
    }

    public toggled(open: boolean) {
        this.status.isOpen = open;
        if (!open) { return; }
        this.setMenuPosition();
    }

    private setMenuPosition() {
        const menuParentIcon = $('#tab-header-menu', this._eref.nativeElement);
        if (!menuParentIcon || !menuParentIcon.length) { return; }
        const aiDropDownMenu = $('#dropdown-menu', this._eref.nativeElement);
        if (!aiDropDownMenu || !aiDropDownMenu.length) { return; }
        const documentBody = $(document.body);
        const rightSpace = documentBody.width() - menuParentIcon.offset().left;
        let leftSpace = 0;
        if (rightSpace <= aiDropDownMenu.width()) {
            leftSpace = (rightSpace - (aiDropDownMenu.width() + 5));
        }
        aiDropDownMenu.css('left', leftSpace);
    }

    public menuItemClickHanlder(tab: any) {
        this.dropdownItemClicked.emit(tab);
        this.status.isOpen = false;
    }
}
