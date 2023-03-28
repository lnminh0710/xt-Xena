export class SignalRNotifyModel {
    public SessionId: string = "";
    public IpAddress: string = "";
    public Message: string = "";
    public Data: any = undefined; // Object

    public UserName: string = "";
    public DisplayName: string = "";
    public Color: string = "";
    public Type: string = ""; //WidgetForm,CustomerForm,...
    public ObjectId: string = ""; //CustomerId, PersonId, ArticleId, OrderId, idSettingsGUI,...
    public Job: string = ""; //SignalRJobEnum: Editing
    public Action: string = ""; //SignalRActionEnum: ConnectEditing, DisconnectEditing, IsThereAnyoneEditing
    public JobIsProcessing: boolean = false;

    public constructor(init?: Partial<SignalRNotifyModel>) {
        Object.assign(this, init);
    }
}
