export class User {
  public id: string = '';
  public loginName: string = '';
  public password: string = '';
  public fullName: string = '';
  public firstname: string = '';
  public lastname: string = '';
  public email: string = '';
  public avatarUrl: string = '';
  public creationDate: string = '';
  public preferredLang: string = '';
  public lastLoginDate: Date = new Date();
  public loginPicture: string = '';
  public nickName: string = '';
  public loginMessage: string = '';
  public color: string = '';
  public isEncrypt: boolean = false;

  public ipAddress: string = '';
  public osType: string = '';
  public osVersion: string = '';
  public browserType: string = '';
  public versionBrowser: string = '';
  public stepLog: string = '';

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  public getName() {
    return this.fullName || this.firstname + ' ' + this.lastname;
  }
}
