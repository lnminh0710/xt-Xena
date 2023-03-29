export class LanguageSettingModel {
  public flag: string = '';
  public name: string = '';
  public active: boolean = false;
  public idRepLanguage: string;

  public constructor(init?: Partial<LanguageSettingModel>) {
    Object.assign(this, init);
  }
}
