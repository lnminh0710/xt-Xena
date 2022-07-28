export class Preferencies {
    public avatarUrl: string = '';
    public preferredLang: string = null;

    public constructor(init?: Partial<Preferencies>) {
        Object.assign(this, init);
    }
}
