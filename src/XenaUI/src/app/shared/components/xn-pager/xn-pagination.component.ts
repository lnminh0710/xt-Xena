import {
  Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  EventEmitter,
  Renderer,
  forwardRef,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Store, ReducerManagerDispatcher } from '@ngrx/store';
import {
  ProcessDataActions,
  CustomAction,
} from 'app/state-management/store/actions';
import { AppState } from 'app/state-management/store';
import { Observable } from 'rxjs/Observable';
import {
  PropertyPanelService,
  AppErrorHandler,
  GlobalSettingService,
  ModalService,
} from 'app/services';
import * as propertyPanelReducer from 'app/state-management/store/reducer/property-panel';
import { BaseComponent, ModuleList } from 'app/pages/private/base';
import { Router } from '@angular/router';
import { GlobalSettingModel, MessageModel } from 'app/models';
import { GlobalSettingConstant, Configuration } from 'app/app.constants';
import { Uti } from 'app/utilities';
import unionBy from 'lodash-es/unionBy';
import sortBy from 'lodash-es/sortBy';
import cloneDeep from 'lodash-es/cloneDeep';
import isEqual from 'lodash-es/isEqual';
import { AngularMultiSelect } from '../xn-control/xn-dropdown';

export interface IAttribute {
  [key: string]: any;
}

export interface IPaginationConfig extends IAttribute {
  maxSize: number;
  itemsPerPage: number; //pageSize
  maxItemsPerPage: number;
  boundaryLinks: boolean;
  directionLinks: boolean;
  firstText: string;
  previousText: string;
  nextText: string;
  lastText: string;

  rotate: boolean;
}
export interface IPageChangedEvent {
  itemsPerPage: number;
  page: number;
}

const paginationConfig: IPaginationConfig = {
  maxSize: void 0,
  itemsPerPage: 10, //pageSize
  maxItemsPerPage: 10000,
  boundaryLinks: false,
  directionLinks: true,
  firstText: '<i class="fa fa-backward"</i>',
  previousText: '<i class="fa fa-chevron-left"></i>',
  nextText: '<i class="fa fa-chevron-right"></i>',
  lastText: '<i class="fa fa-forward"></i>',
  rotate: false,
};

@Component({
  selector: 'xn-pagination',
  styleUrls: ['./xn-pagination.component.scss'],
  templateUrl: './xn-pagination.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => XnPaginationComponent),
      multi: true,
    },
  ],
})
export class XnPaginationComponent
  extends BaseComponent
  implements
    ControlValueAccessor,
    OnInit,
    OnDestroy,
    IPaginationConfig,
    IAttribute,
    AfterViewInit
{
  @Input() public allowEdit = true;
  @Input() public maxSize: number;
  @Input() public boundaryLinks: boolean;
  @Input() public directionLinks: boolean;
  @Input() public firstText: string;
  @Input() public previousText: string;
  @Input() public nextText: string;
  @Input() public lastText: string;
  @Input() public rotate: boolean;
  @Input() public disabled: boolean;
  @Input() public paginationFromPopup: any;

  @Input() public set itemsPerPage(v: number) {
    this._itemsPerPage = v;
    if (this.pagingDropdownData.filter((x) => x.value == v).length) {
      this.totalPages = this.calculateTotalPages();
    }
  }
  public get itemsPerPage() {
    return this._itemsPerPage;
  }

  @Input() set pageIndex(value: number) {
    this.pagerControl.setValue(value);
  }

  @Input() public set totalItems(v: number) {
    this._totalItems = v;
    this.totalPages = this.calculateTotalPages();
  }
  public get totalItems(): number {
    return this._totalItems;
  }

  @Input() public maxItemsPerPage: number;

  @Input() public set keywordSearch(keyword: string) {
    if (this._keywordSearch != keyword) {
      this.page = 1;
    }

    this._keywordSearch = keyword;
  }

  @Output() private numPages: EventEmitter<number> = new EventEmitter();
  @Output() private pageChanged: EventEmitter<IPageChangedEvent> =
    new EventEmitter();
  @Output() private pageNumberDefault: EventEmitter<number> =
    new EventEmitter();

  @ViewChild('pagingDropdown') pagingDropdown: AngularMultiSelect;

  pagerControl = new FormControl();

  public globalNumberFormat = '';
  public config: any;
  public classMap: string;
  private _itemsPerPage: number;
  private _totalItems: number;
  private _totalPages: number;
  private inited = false;
  private isReUpdateDataSource = false;
  private pagerControlValueChangesSubscription: Subscription;
  private globalPropertiesStateSubscription: Subscription;
  private pagingDropdownDataChangeStateSubscription: Subscription;
  private globalPropertiesState: Observable<any>;
  private currentPagingDropdownGlobalSetting: any = {};
  private defaultPagingDropdownData: Array<any> = [
    25,
    Configuration.pageIndex,
    100,
  ];
  public pagingDropdownData: Array<any> = [];
  public isDisableRemoveButton: boolean;
  private _keywordSearch: string;

  public get totalPages() {
    return this._totalPages;
  }
  public set totalPages(v: number) {
    this._totalPages = v;
    this.numPages.emit(v);
    if (this.inited) {
      this.selectPage(this.page);
    }
  }

  public set page(value) {
    const _previous = this._page;
    this._page = value > this.totalPages ? this.totalPages : value || 1;

    if (_previous === this._page || typeof _previous === 'undefined') {
      return;
    }

    this.callEventPageChanged(this._page);
  }
  public get page() {
    return this._page;
  }

  private _page: number;
  //private pages: Array<any>;
  private pageChangedTimeout: any;
  private firstLoad = true;
  private isTypingPagesize = false;
  private isInputGreaterThanMaximumPagesize = false;
  private currentPageSize: any;

  constructor(
    public renderer: Renderer,
    public elementRef: ElementRef,
    private propertyPanelService: PropertyPanelService,
    private appErrorHandler: AppErrorHandler,
    private store: Store<AppState>,
    private globalSettingService: GlobalSettingService,
    private globalSettingConstant: GlobalSettingConstant,
    private modalService: ModalService,
    private dispatcher: ReducerManagerDispatcher,
    private processDataActions: ProcessDataActions,
    private ref: ChangeDetectorRef,
    protected router: Router
  ) {
    super(router);

    this.config = this.config || paginationConfig;
    this.globalPropertiesState = store.select(
      (state) =>
        propertyPanelReducer.getPropertyPanelState(
          state,
          ModuleList.Base.moduleNameTrim
        ).globalProperties
    );
  }

  private getMaxItemsPerPage() {
    if (!this.maxItemsPerPage) {
      if (Configuration.PublicSettings.maxPageSize) {
        this.maxItemsPerPage = Configuration.PublicSettings.maxPageSize;
      } else {
        this.maxItemsPerPage = paginationConfig.maxItemsPerPage;
      }
    }
  }

  ngOnInit() {
    this.getMaxItemsPerPage();
    this.getPagingComboData();

    this.classMap = this.elementRef.nativeElement.getAttribute('class') || '';

    // watch for maxSize
    this.maxSize =
      typeof this.maxSize !== 'undefined'
        ? this.maxSize
        : paginationConfig.maxSize;
    this.rotate =
      typeof this.rotate !== 'undefined'
        ? this.rotate
        : paginationConfig.rotate;
    this.boundaryLinks =
      typeof this.boundaryLinks !== 'undefined'
        ? this.boundaryLinks
        : paginationConfig.boundaryLinks;
    this.directionLinks =
      typeof this.directionLinks !== 'undefined'
        ? this.directionLinks
        : paginationConfig.directionLinks;

    // this.maxItemsPerPage = typeof this.maxItemsPerPage !== 'undefined' ? this.maxItemsPerPage : paginationConfig.maxItemsPerPage;
    // this.getMaxItemsPerPage();

    // Set text
    this.firstText =
      typeof this.firstText !== 'undefined'
        ? this.firstText
        : paginationConfig.firstText;
    this.previousText =
      typeof this.previousText !== 'undefined'
        ? this.previousText
        : paginationConfig.previousText;
    this.lastText =
      typeof this.lastText !== 'undefined'
        ? this.lastText
        : paginationConfig.lastText;
    this.nextText =
      typeof this.nextText !== 'undefined'
        ? this.nextText
        : paginationConfig.nextText;

    // base class
    this.itemsPerPage =
      typeof this.itemsPerPage !== 'undefined'
        ? this.itemsPerPage
        : paginationConfig.itemsPerPage;
    this.totalPages = this.calculateTotalPages();

    // this class
    //this.pages = this.getPages(this.page, this.totalPages);
    this.inited = true;

    this.pagerControlValueChangesSubscription = this.pagerControl.valueChanges
      .debounceTime(1000)
      .subscribe((newValue) => {
        this.appErrorHandler.executeAction(() => {
          this.selectPage(+newValue);
        });
      });
    this.subscribeGlobalProperties();
    this.subcribePagingDropdownDataChange();

    // setTimeout(() => {
    //     if (!this.pagingDropdown) return;
    //     this.pagingDropdown.isDroppedDown = true;
    //     this.pagingDropdown.isDroppedDown = false;
    // }, 500);
  }

  ngOnDestroy() {
    this.pagingDropdown = null;
    Uti.unsubscribe(this);
  }

  public ngAfterViewInit() {
    // setTimeout(() => {
    //     if (!this.pagingDropdown) return;
    //     this.pagingDropdown.isDroppedDown = true;
    //     this.pagingDropdown.isDroppedDown = false;
    // }, 500);
  }

  writeValue(value: number) {
    this.page = value;
    // this.pages = this.getPages(this.page, this.totalPages);
  }

  public selectPage(page: number, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }

    if (!this.disabled) {
      if (event && event.target) {
        const target: any = event.target;
        target.blur();
      }
      this.writeValue(page);
      // update the form
      this.onChange(page);
      this.onTouched();
    }
  }

  public noPrevious(): boolean {
    return this.page === 1;
  }

  public noNext(): boolean {
    return this.page === this.totalPages;
  }

  private getPagingComboData() {
    this.globalSettingService.getAllGlobalSettings('-1').subscribe(
      (data) => this.getAllGlobalSettingSuccess(data),
      (error) => this.serviceError(error)
    );
  }

  private getAllGlobalSettingSuccess(data: GlobalSettingModel[]) {
    let customPagingData: any;
    let lastPagesize: any = 1;
    if (!data || !data.length) {
      customPagingData = this.defaultPagingDropdownData;
    } else {
      const pagingDataSettings = this.getCurrentPagingDropdown(data);
      //model as Object
      if (
        pagingDataSettings &&
        pagingDataSettings.selectedValue &&
        pagingDataSettings.data
      ) {
        customPagingData = pagingDataSettings.data;
        lastPagesize = pagingDataSettings.selectedValue;
      } else {
        //model as Array
        customPagingData = pagingDataSettings;
      }

      //if dont have lastPagesize -> get last item of dropdown
      if (!lastPagesize && customPagingData && customPagingData.length)
        lastPagesize = customPagingData[customPagingData.length - 1];
    }

    this.pagingDropdownData = this.buildDataForPagingDropdown(customPagingData);
    this.updatePageSize();

    this.pageNumberDefault.emit(lastPagesize || 0);

    if (lastPagesize) {
      setTimeout(() => {
        if (this.pagingDropdown) {
          this.pagingDropdown.text = lastPagesize;
          this.pagingDropdown.selectedValue = lastPagesize;
          this.pagingDropdown.refresh();
        }
      }, 200);
    }
  }

  private updatePageSize() {
    setTimeout(() => {
      if (this.paginationFromPopup && this.paginationFromPopup.pageSize) {
        this.itemsPerPage = this.paginationFromPopup.pageSize;
      }
    }, 300);
  }

  private serviceError(error) {
    Uti.logError(error);
  }

  private getCurrentPagingDropdown(data: GlobalSettingModel[]): any {
    this.currentPagingDropdownGlobalSetting = data.find(
      (x) => x.globalName === this.globalSettingConstant.gridPagingDropdown
    );
    if (
      !this.currentPagingDropdownGlobalSetting ||
      !this.currentPagingDropdownGlobalSetting.idSettingsGlobal
    ) {
      return this.defaultPagingDropdownData;
    }
    return JSON.parse(this.currentPagingDropdownGlobalSetting.jsonSettings);
  }

  private buildDataForPagingDropdown(rawData: Array<any>): Array<any> {
    rawData = rawData || [];
    const arr = unionBy(rawData, this.defaultPagingDropdownData);
    let itemList: Array<any> = sortBy(arr, [
      function (o) {
        return o;
      },
    ]).map((x) => {
      return {
        text: x,
        value: x,
      };
    });
    const rs = itemList.filter((p) => p.value <= this.maxItemsPerPage);
    return rs;
  }

  private subscribeGlobalProperties() {
    this.globalPropertiesStateSubscription =
      this.globalPropertiesState.subscribe((globalProperties: any) => {
        this.appErrorHandler.executeAction(() => {
          if (globalProperties) {
            this.globalNumberFormat =
              this.propertyPanelService.buildGlobalNumberFormatFromProperties(
                globalProperties
              );
          }
        });
      });
  }

  // Create page object used in template
  private makePage(
    number: number,
    text: string,
    isActive: boolean
  ): { number: number; text: string; active: boolean } {
    return {
      number: number,
      text: text,
      active: isActive,
    };
  }

  private getPages(currentPage: number, totalPages: number): Array<any> {
    const pages: any[] = [];

    // Default page limits
    let startPage = 1;
    let endPage = totalPages;
    const isMaxSized =
      typeof this.maxSize !== 'undefined' && this.maxSize < totalPages;

    // recompute if maxSize
    if (isMaxSized) {
      if (this.rotate) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
        endPage = startPage + this.maxSize - 1;

        // Adjust if limit is exceeded
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = endPage - this.maxSize + 1;
        }
      } else {
        // Visible pages are paginated with maxSize
        startPage =
          (Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize + 1;

        // Adjust last page if limit is exceeded
        endPage = Math.min(startPage + this.maxSize - 1, totalPages);
      }
    }

    // Add page number links
    for (let number = startPage; number <= endPage; number++) {
      const page = this.makePage(
        number,
        number.toString(),
        number === currentPage
      );
      pages.push(page);
    }

    // Add links to move between page sets
    if (isMaxSized && !this.rotate) {
      if (startPage > 1) {
        const previousPageSet = this.makePage(startPage - 1, '...', false);
        pages.unshift(previousPageSet);
      }

      if (endPage < totalPages) {
        const nextPageSet = this.makePage(endPage + 1, '...', false);
        pages.push(nextPageSet);
      }
    }

    return pages;
  }

  // base class
  private calculateTotalPages(): number {
    const totalPages =
      this.itemsPerPage < 1
        ? 1
        : Math.ceil(this.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  }

  onChange = (_: any) => {};

  onTouched = () => {};

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  removePagesizeItem() {
    const numOfPage: number = Number(this.pagingDropdown.text.trim());
    if (isNaN(numOfPage) || !numOfPage) {
      return;
    }

    //don't allow remove the default value
    if (this.defaultPagingDropdownData.includes(numOfPage)) {
      return;
    }

    this.modalService.confirmDeleteMessageHtmlContent({
      headerText: 'Delete item',
      message: [
        { key: '<p>' },
        {
          key: 'Modal_Message__Are_You_Sure_You_Want_To_Remove_This_Page_Size_Item',
        },
        { key: '</p>' },
      ],
      callBack1: () => {
        Uti.removeItemInArray(
          this.pagingDropdownData,
          {
            value: this.itemsPerPage,
          },
          'value'
        );
        const dropDownData: Array<any> = this.pagingDropdownData.map((x) => {
          return +x.value;
        });
        if (dropDownData.length) {
          this.pagingDropdown.text = dropDownData[0];
          this.pagingDropdown.selectedValue = dropDownData[0] || 1;
          this.pagingDropdown.refresh();
        }
        this.savePagingDropdownData(dropDownData);
      },
    });
  }

  private validatePagingNumber() {
    let isValid = true;
    const numOfPage: number = Number(this.pagingDropdown.text.trim());
    if (isNaN(numOfPage) || !numOfPage) {
      this.pagingDropdown.text = '';
    } else if (numOfPage > this.maxItemsPerPage) {
      if (this.pagingDropdownData && this.pagingDropdownData.length) {
        this.pagingDropdown.selectedValue =
          this.pagingDropdownData[this.pagingDropdownData.length - 1].value;
      }
      isValid = false;
    }
    return isValid;
  }

  pagingDropdownKeyup(e: any) {
    this.isInputGreaterThanMaximumPagesize = false;
    if (e.which === 32 || e.keyCode === 32 || !this.pagingDropdown.text) return;
    let isValid = this.validatePagingNumber();
    if (!isValid) {
      this.pagingDropdown.text = this.maxItemsPerPage + '';
      this.modalService.warningMessage([
        { key: 'Modal_Message__Grid_Paging_Page_Size_First' },
        { key: this.maxItemsPerPage + '' },
      ]);
      this.isInputGreaterThanMaximumPagesize = true;
      return;
    }

    /*
        const numOfPage: number = Number(this.pagingDropdown.text.trim());
        if (isNaN(numOfPage) || !numOfPage) {
            this.pagingDropdown.text = '';
        }
        else if (numOfPage > this.maxItemsPerPage) {
            this.pagingDropdown.text = this.maxItemsPerPage + '';
            this.modalService.warningMessage([
                {key: 'Modal_Message__Grid_Paging_Page_Size_First'},
                {key: this.maxItemsPerPage+''},
            ]);
            this.isInputGreaterThanMaximumPagesize = true;
            return;
        }*/

    if (e.which === 13 || e.keyCode === 13) {
      this.isTypingPagesize = true;

      this.savePagingData(true);
      this.pageSizeChange(true);
    }
  }

  pageSizeChange(forceSave?: boolean) {
    if (!this.pagingDropdown.readyToSearch && !forceSave) return;

    setTimeout(() => {
      // if (this.isInputGreaterThanMaximumPagesize) return;
      let isValid = this.validatePagingNumber();
      if (!isValid) {
        this.modalService.warningMessage([
          { key: 'Modal_Message__Grid_Paging_Page_Size_First' },
          { key: this.maxItemsPerPage + '' },
        ]);
        return;
      }
      const numOfPage: number = Number(this.pagingDropdown.text.trim());

      /*const numOfPage: number = Number(this.pagingDropdown.text.trim());
            if (numOfPage > this.maxItemsPerPage) {
                this.modalService.warningMessage([
                    {key: 'Modal_Message__Grid_Paging_Page_Size_First'},
                    {key: this.maxItemsPerPage+''},
                ]);
                return;
            }*/

      // if (!this.itemsPerPage || !this.pagingDropdown.text) return;
      // Prevent underground select other grid item
      // if (this.isReUpdateDataSource) {
      //     this.isReUpdateDataSource = false;
      //     return;
      // }
      if (this.pagerControl && this.pagerControl.value > 0) {
        this._page = this.pagerControl.value;
      } else {
        this._page = 1;
      }

      const itemsPerPage = this.itemsPerPage
        ? this.itemsPerPage
        : Uti.parFloatFromObject(this.pagingDropdown.text, 0);

      if (this.currentPageSize !== itemsPerPage) {
        this.callEventPageChanged(this._page);
      }

      if (!isNaN(numOfPage) && numOfPage) {
        //don't allow remove the default value
        this.isDisableRemoveButton =
          this.defaultPagingDropdownData.includes(numOfPage);

        // if (!dontSavePagingData && !this.isTypingPagesize)
        //     this.savePagingData(true);
      }
    }, 500);
  }

  private callEventPageChanged(page: number) {
    //if (this.isTypingPagesize) {
    //    this.isTypingPagesize = false;
    //    return;
    //}

    const itemsPerPage = this.itemsPerPage
      ? this.itemsPerPage
      : Uti.parFloatFromObject(this.pagingDropdown.text, 0);
    this.currentPageSize = itemsPerPage;
    this.pagingDropdown.readyToSearch = false;

    clearTimeout(this.pageChangedTimeout);
    this.pageChangedTimeout = null;
    this.pageChangedTimeout = setTimeout(() => {
      //For the first load, the SearchDetail was called before, you don't need to call here
      // if (this.firstLoad) {
      //     this.firstLoad = false;
      //     clearTimeout(this.pageChangedTimeout);
      //     return;
      // }

      this.pageChanged.emit({
        page: page,
        itemsPerPage,
      });
    }, 200);
  }

  public savePagingData(forceSave?: boolean) {
    if (!this.allowEdit) return;
    let isValid = this.validatePagingNumber();
    if (!isValid) {
      return;
    }
    const dropDownData: Array<any> = this.pagingDropdownData.map((x) => {
      return +x.value;
    });
    const currentPageSize = +this.pagingDropdown.textInput.nativeElement.value;
    if (this.rebuildPagingDropdownData(dropDownData)) {
      setTimeout(() => {
        this.itemsPerPage = currentPageSize;
        // this.pageSizeChange(true);
      }, 200);
    }
    setTimeout(() => {
      if (
        this.currentPagingDropdownGlobalSetting &&
        this.currentPagingDropdownGlobalSetting.jsonSettings &&
        isEqual(
          JSON.parse(this.currentPagingDropdownGlobalSetting.jsonSettings).data,
          dropDownData
        )
      ) {
        return;
      }

      this.savePagingDropdownData(dropDownData);
    }, 300);
  }

  private subcribePagingDropdownDataChange() {
    this.pagingDropdownDataChangeStateSubscription = this.dispatcher
      .filter((action: CustomAction) => {
        return action.type === ProcessDataActions.PAGNATION_DATA_CHANGE;
      })
      .map((action: CustomAction) => {
        return action.payload;
      })
      .subscribe((data) => {
        this.appErrorHandler.executeAction(() => {
          const currentItem = cloneDeep(this.pagingDropdown.selectedItem);
          this.isReUpdateDataSource = true;
          this.pagingDropdownData = data;
          this.updatePageSize();
          this.ref.detectChanges();
          if (!currentItem || !currentItem.value) return;
          const current = data.find((x) => x.value == currentItem.value);
          if (!current || !current.value) return;
          const index = Uti.getIndexOfItemInArray(data, current, 'value');
          setTimeout(() => {
            this.pagingDropdown.selectedIndex = index;
          }, 1000);
        });
      });
  }

  private rebuildPagingDropdownData(dropDownData: any): boolean {
    if (
      !this.pagingDropdown.text ||
      this.pagingDropdown.textInput.nativeElement.value == '0'
    )
      return false;

    const value = +this.pagingDropdown.textInput.nativeElement.value;
    if (dropDownData.indexOf(value) === -1) {
      dropDownData.push(value);
    }
    dropDownData = dropDownData.sort(function (a, b) {
      return a - b;
    });
    this.pagingDropdownData = this.buildDataForPagingDropdown(dropDownData);
    this.updatePageSize();
    this.store.dispatch(
      this.processDataActions.pagnationDataChange(this.pagingDropdownData)
    );
    return true;
  }

  private savePagingDropdownData(dropDownData: Array<any>) {
    if (!this.pagingDropdown || !this.pagingDropdown.selectedValue) {
      return;
    }
    if (
      !this.currentPagingDropdownGlobalSetting ||
      !this.currentPagingDropdownGlobalSetting.idSettingsGlobal ||
      !this.currentPagingDropdownGlobalSetting.globalName
    ) {
      this.currentPagingDropdownGlobalSetting = new GlobalSettingModel({
        globalName: this.globalSettingConstant.gridPagingDropdown,
        description: 'Grid paging drop down data',
        globalType: this.globalSettingConstant.gridPagingDropdown,
      });
    }
    this.currentPagingDropdownGlobalSetting.idSettingsGUI = '-1';
    this.currentPagingDropdownGlobalSetting.jsonSettings = JSON.stringify({
      data: dropDownData,
      selectedValue: this.pagingDropdown.selectedValue,
    });
    this.currentPagingDropdownGlobalSetting.isActive = true;

    this.globalSettingService
      .saveGlobalSetting(this.currentPagingDropdownGlobalSetting)
      .subscribe(
        (_data) => {
          this.globalSettingService.saveUpdateCache(
            '-1',
            this.currentPagingDropdownGlobalSetting,
            _data
          );
        },
        (error) => this.serviceError(error)
      );
  }
}
