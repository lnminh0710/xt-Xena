export class Country {
    idValue: number = -1;
    isoCode: string = '';
    textValue: string = '';
    isMain: boolean = false;
    isActive: boolean = false;
    idSalesCampaignWizardItems: number = null;
    idArticleExcludeCountries: string = null;
    idBackOfficeLettersCountries?: number = null;
    idValueExtra: number;
    isDirty = false;

    public constructor(init?: Partial<Country>) {
        Object.assign(this, init);
    }
}
