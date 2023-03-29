import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Configuration } from 'app/app.constants';
//import {WjPdfViewer} from 'wijmo/wijmo.angular2.viewer';
import { Uti } from 'app/utilities';
import {
  BlockedOrderService,
  ModalService,
  PropertyPanelService,
} from 'app/services';
import { parse } from 'date-fns/esm';
import { Module } from 'app/models';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/pages/private/base';

@Component({
  selector: 'sav-send-letter',
  styleUrls: ['./sav-send-letter.component.scss'],
  templateUrl: './sav-send-letter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SavSendLetterComponent
  extends BaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public pdfApiUrl: string = Configuration.PublicSettings.pdfApiUrl;
  public pdfUrl: string;
  public collapse = false;
  public pdfData: Array<any> = [];
  public globalDateFormat: string = null;

  @Input() set listenKey(savKey: any) {
    if (savKey) {
    }
  }

  @Input() set globalProperties(globalProperties: any[]) {
    this.globalDateFormat =
      this.propertyPanelService.buildGlobalDateFormatFromProperties(
        globalProperties
      );
  }

  @Input() set data(data: any) {
    this.execRowData(data);
  }

  @Input() currentModule: Module;
  @Output() refreshWidget = new EventEmitter<any>();

  //@ViewChild(WjPdfViewer) wjPdfViewer: WjPdfViewer;

  constructor(
    private elRef: ElementRef,
    protected router: Router,
    private uti: Uti,
    private propertyPanelService: PropertyPanelService,
    private blockedOrderService: BlockedOrderService,
    private changeRef: ChangeDetectorRef,
    private modalService: ModalService
  ) {
    super(router);
  }

  public ngOnInit() {}

  ngAfterViewInit() {
    //this.calculateSize();
    //const that = this;
    //$(window).resize(function () {
    //    that.calculateSize();
    //});
  }

  ngOnDestroy() {
    Uti.unsubscribe(this);
    super.onDestroy();
    //$(window).unbind('resize');
  }

  private execRowData(pdfData: any) {
    this.pdfData = [];
    if (!pdfData || !pdfData.length) {
      this.pdfUrl = '';
      return;
    }
    pdfData[0]['isActive'] = true;
    this.pdfData = pdfData;
    setTimeout(() => {
      this.onPDFItemClicked(pdfData[0]);
    }, 300);
  }

  public onPDFItemClicked(pdf: any) {
    this.setActiveForItem(pdf);
    this.pdfUrl = (pdf.PDF || '').replace(
      Configuration.PublicSettings.fileShareUrl,
      ''
    );
    //this.refresh(1000);
  }

  private setActiveForItem(pdfItem: any) {
    for (let item of this.pdfData) {
      item['isActive'] = false;
    }
    pdfItem['isActive'] = true;
  }

  // public refresh(delayTimeout?: number) {
  //     if (!this.wjPdfViewer) return;

  //     if (delayTimeout) {
  //        setTimeout(() => {
  //            this.wjPdfViewer.refresh();
  //        }, delayTimeout);

  //        return;
  //     } else {
  //        this.wjPdfViewer.refresh();
  //     }
  // }

  public onCollapseClicked() {
    this.collapse = !this.collapse;
  }

  public formatDate(date: any) {
    date = parse(date, 'dd.MM.yyyy', new Date());
    return this.uti.formatLocale(date, this.globalDateFormat);
  }

  private calculateSize() {
    const parentHeight = $(this.elRef.nativeElement).parent().height();
    if (parentHeight) {
      $(this.elRef.nativeElement)
        .find('wj-pdf-viewer')
        .css('height', parentHeight + 'px');
    }
  }

  public callModalConfirmDeleteSAVLetter($event: any, pdf: any) {
    $event.preventDefault();

    this.modalService.confirmDeleteMessageHtmlContent({
      headerText: 'Delete SAV Letter',
      message: [
        { key: '<p>' },
        { key: 'Modal_Message__Do_You_Want_To_Confirm_This_Letter' },
        { key: '</p>' },
      ],
      callBack1: () => {
        this.deleteSAVLetter(pdf);
      },
    });
  }

  public deleteSAVLetter(pdf: any) {
    if (!pdf || !pdf.IdGenerateLetter) return;
    this.blockedOrderService
      .deleteSAV(pdf.IdGenerateLetter)
      .takeUntil(this.getUnsubscriberNotifier())
      .subscribe((res) => {
        if (!res || res.statusCode !== 1 || !res.item) {
          return;
        }

        this.refreshWidget.emit();
      });
  }

  public setDisplayIconAction($event: any, id: string, displayText: string) {
    $event.preventDefault();
    document.getElementById(id).style.display = displayText;
  }
}
