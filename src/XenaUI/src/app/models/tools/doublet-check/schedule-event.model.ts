import { DateConfiguration } from 'app/app.constants';
import { Uti } from 'app/utilities/uti';

export class ScheduleEvent {
  public id: number;
  public on: any;
  public onShow: string;
  public at: string;
  public sort: string;
  public hour: number;
  public minute: number;
  public dateFormat: string;
  public email: string;
  public parameter: string;
  public note: string;
  public delete: number;
  public run: number;
  public scheduleType: string;
  public startDate: Date;
  public stopDate: Date;
  public activeSchedule: boolean;

  public IsAutoMatching: boolean;

  public constructor(init?: Partial<ScheduleEvent>) {
    Object.assign(this, init);
    if (!this) return;
    if (this.hour >= 0 && this.minute >= 0) {
      this.at =
        ('0' + this.hour).slice(-2) + ':' + ('0' + this.minute).slice(-2);
    }
    if (this.on) {
      const value = this.buildSortData(this.on);
      this.sort = value.sort;
    }
    this.delete = this.id;
    this.run = this.id;
  }
  private buildSortData(on: any): any {
    const result: any = {
      sort: on,
    };
    const weekDayIndex = DateConfiguration.WEEK_DAY.indexOf(on);
    if (weekDayIndex > -1) {
      result.sort = weekDayIndex.toString();
      return result;
    }
    const monthDayIndex = DateConfiguration.MONTH_DAY.indexOf(on);
    if (monthDayIndex > -1) {
      result.sort = monthDayIndex;
      return result;
    }
    if (this.dateFormat) {
      result.sort = Uti.joinDateToNumber(on, 'yyyyMMdd');
    }
    return result;
  }
}
