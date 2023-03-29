export class GlobalSettingModel {
  public idSettingsGlobal: number = null;
  public idLogin: string = null;
  public objectNr: string = '';
  public globalName: string = '';
  public globalType: string = '';
  public description: string = '';
  public jsonSettings: string = '';
  public isActive: boolean = false;
  public idSettingsGUI: any = '';

  public constructor(init?: Partial<GlobalSettingModel>) {
    Object.assign(this, init);
  }
}
