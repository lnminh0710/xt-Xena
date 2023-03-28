import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import "rxjs/Rx";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Module, WidgetDetail } from "app/models";
import { Uti } from "app/utilities";
import { ReplaceString } from "app/app.constants";

@Injectable()
export class WidgetConfig {
    constructor() {}
}
