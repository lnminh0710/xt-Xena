import { XenaUIPage } from './app.po';

describe('xena-ui App', () => {
  let page: XenaUIPage;

  beforeEach(() => {
    page = new XenaUIPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
