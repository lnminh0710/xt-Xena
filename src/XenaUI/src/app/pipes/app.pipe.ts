import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';

import {
  Pipe,
  NgModule,
  PipeTransform,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

// Globalize pipe
@Pipe({
  name: 'glbz',
  // stateful pipe
  pure: false,
})
export class GlbzPipe {
  transform(value: any, args: string[]): any {
    return wjcCore.Globalize.format(value, args[0]);
  }
}

// ToDate pipe - converts date/time string to a Date object
@Pipe({
  name: 'toDate',
})
export class ToDatePipe {
  transform(value: any, args: string[]): any {
    if (value && wjcCore.isString(value)) {
      // parse date/time using RFC 3339 pattern
      var dt = wjcCore.changeType(value, wjcCore.DataType.Date, 'r');
      if (wjcCore.isDate(dt)) {
        return dt;
      }
    }
    return value;
  }
}

// CellRange pipe
@Pipe({
  name: 'cellRange',
})
export class CellRangePipe {
  transform(value: any, args: string[]): any {
    var rng = '';
    if (value instanceof wjcGrid.CellRange) {
      rng = '(' + value.row + ';' + value.col + ')';
      if (!value.isSingleCell) {
        rng += '-(' + value.row2 + ';' + value.col2 + ')';
      }
    }
    return rng;
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Pipe({
  name: 'toString',
})
export class ToStringPipe {
  transform(value: any, args: string[]): any {
    if (value && wjcCore.isString(value)) {
      return value;
    }
    return '';
  }
}

@Pipe({
  name: 'formatImage',
})
export class ToPathImage {
  transform(value: any): any {
    if (value) {
      const formatPathImage = value.split('=')[1].replace(/&mode/g, '');
      return formatPathImage;
    }
    return '';
  }
}

@Pipe({
  name: 'toType',
})
export class ToTypePipe {
  transform(value: any): any {
    if (
      (value && value === 'combo-box') ||
      value.toLowerCase() === 'combobox'
    ) {
      return 'ComboBox';
    }
    return 'DatePicker';
  }
}

@Pipe({
  name: 'displaySeparator',
})
export class DisplaySeparator implements PipeTransform {
  private numberPipe: DecimalPipe;
  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.numberPipe = new DecimalPipe(this.locale);
  }
  transform(value: any, format: string): any {
    if (value && format == 'N') {
      value = this.numberPipe.transform(value);
    }
    return value;
  }
}

@Pipe({
  name: 'toNumber',
})
export class ToNumberPipe implements PipeTransform {
  transform(value: string): any {
    let retNumber = Number(value);
    return isNaN(retNumber) ? 0 : retNumber;
  }
}

@Pipe({
  name: 'orderBy',
})
export class ToOrderBy implements PipeTransform {
  transform(items: any[], criteria: SortCriteria): any {
    if (items || criteria) {
      const p: string = criteria.property;
      const sortFn: (a: any, b: any) => any = (a, b) => {
        let value: number;
        if (a.value[p] === undefined) value = -1;
        else if (b.value[p] === undefined) value = 1;
        else
          value =
            a.value[p] > b.value[p] ? 1 : b.value[p] > a.value[p] ? -1 : 0;
        return criteria.descending ? value * -1 : value;
      };
      items.sort(sortFn);
      return items;
    }
  }
}
export interface SortCriteria {
  property: string;
  descending?: boolean;
}

@Pipe({
  name: 'callback',
  pure: false,
})
export class CallbackPipe implements PipeTransform {
  transform(items: any[], callback: (item: any) => boolean): any {
    if (!items || !callback) {
      return items;
    }
    return items.filter((item) => callback(item));
  }
}

@Pipe({ name: 'safeHtml' })
export class SafeHtml implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html) {
    return this.sanitizer.bypassSecurityTrustStyle(html);
    // return this.sanitizer.bypassSecurityTrustHtml(html);
    // return this.sanitizer.bypassSecurityTrustScript(html);
    // return this.sanitizer.bypassSecurityTrustUrl(html);
    // return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}

@Pipe({ name: 'keepHtml', pure: true })
export class EscapeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(content) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
