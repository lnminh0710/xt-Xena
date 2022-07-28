import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ElementRef } from "@angular/core";
import { MenuModuleId } from 'app/app.constants';
import { Module } from 'app/models';

@Component({
	selector: 'article-search-dialog',
	templateUrl: './article-search-dialog.component.html',
	styleUrls: ['./article-search-dialog.component.scss']
})
export class ArticleSearchDialogComponent implements OnInit, OnDestroy, AfterViewInit {
	public allowDrag: any = {
		value: false
	};
	
	@Input() showDialog = false;
	@Output() onArticleSelect: EventEmitter<any> = new EventEmitter();

	searchIndex = 'article';
	module = new Module({
		idSettingsGUI: MenuModuleId.article
	});
	keyword: string = '*';

	perfectScrollbarConfig: any = {};

	constructor(private _eref: ElementRef) {

	}

    /**
     * ngOnInit
     */
	ngOnInit() {
		this.perfectScrollbarConfig = {
			suppressScrollX: false,
			suppressScrollY: false
		};
	}

    /**
     * ngOnDestroy
     */
	ngOnDestroy() {
	}

    /**
     * ngAfterViewInit
     */
	ngAfterViewInit() {
	}

    /**
     * open
     */
	open() {
		this.showDialog = true;
	}

    /**
     * close
     */
	close() {
		this.showDialog = false;
	}

    /**
     * search
     * @param value
     */
	search(value: string) {
		this.keyword = value;
	}

    /**
     * rowDoubleClicked
     * @param data
     */
	rowDoubleClicked(data) {
		this.onArticleSelect.emit(data);
		this.showDialog = false;
	}
}