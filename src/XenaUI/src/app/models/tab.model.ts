import { Module } from 'app/models';

export class TabModel {
  public id?: string = '';
  public title: string = '';
  public active: boolean = false;
  public removable: boolean = false;
  public textSearch?: string = '';
  public module?: Module = null;
  public searchIndex?: string = '';
  public isLoading?: boolean = false;
  public moduleID?: string = null;
  public isWithStar: boolean = false;
  public histories: Array<any> = [];
  public activeAdvanceSearchStatus?: boolean;
  public payload?: any;

  public constructor(init?: Partial<TabModel>) {
    Object.assign(this, init);
  }
}
