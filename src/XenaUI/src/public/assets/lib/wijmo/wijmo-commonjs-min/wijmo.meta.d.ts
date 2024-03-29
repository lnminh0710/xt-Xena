export declare class ControlMetaFactory {
  static CreateProp(
    propertyName: string,
    propertyType: PropertyType,
    changeEvent?: string,
    enumType?: any,
    isNativeControlProperty?: boolean,
    priority?: number
  ): PropDescBase;
  static CreateEvent(eventName: string, isPropChanged?: boolean): EventDescBase;
  static CreateComplexProp(
    propertyName: string,
    isArray: boolean,
    ownsObject?: boolean
  ): ComplexPropDescBase;
  static findProp(propName: string, props: PropDescBase[]): PropDescBase;
  static findEvent(eventName: string, events: EventDescBase[]): EventDescBase;
  static findComplexProp(
    propName: string,
    props: ComplexPropDescBase[]
  ): ComplexPropDescBase;
  static getMetaData(metaDataId: any): MetaDataBase;
  static getClassName(classRef: any): string;
  static toCamelCase(s: any): any;
  private static findInArr(arr, propName, value);
}
export declare class PropDescBase {
  private _propertyName;
  private _propertyType;
  private _changeEvent;
  private _enumType;
  private _isNativeControlProperty;
  private _priority;
  constructor(
    propertyName: string,
    propertyType: PropertyType,
    changeEvent?: string,
    enumType?: any,
    isNativeControlProperty?: boolean,
    priority?: number
  );
  readonly propertyName: string;
  readonly propertyType: PropertyType;
  readonly changeEvent: string;
  readonly enumType: any;
  readonly bindingMode: BindingMode;
  readonly isNativeControlProperty: boolean;
  readonly priority: number;
  readonly shouldUpdateSource: boolean;
  initialize(options: any): void;
  castValueToType(value: any): any;
  private _parseDate(value);
}
export declare enum PropertyType {
  Boolean = 0,
  Number = 1,
  Date = 2,
  String = 3,
  AnyPrimitive = 4,
  Enum = 5,
  Function = 6,
  EventHandler = 7,
  Any = 8,
}
export declare function isSimpleType(type: PropertyType): boolean;
export declare enum BindingMode {
  OneWay = 0,
  TwoWay = 1,
}
export declare class EventDescBase {
  private _eventName;
  private _isPropChanged;
  constructor(eventName: string, isPropChanged?: boolean);
  readonly eventName: string;
  readonly isPropChanged: boolean;
}
export declare class ComplexPropDescBase {
  propertyName: string;
  isArray: boolean;
  private _ownsObject;
  constructor(propertyName: string, isArray: boolean, ownsObject?: boolean);
  readonly ownsObject: boolean;
}
export declare class MetaDataBase {
  private _props;
  private _events;
  private _complexProps;
  parentProperty: string;
  isParentPropertyArray: boolean;
  ownsObject: boolean;
  parentReferenceProperty: string;
  ngModelProperty: string;
  constructor(
    props: PropDescBase[],
    events?: EventDescBase[],
    complexProps?: ComplexPropDescBase[],
    parentProperty?: string,
    isParentPropertyArray?: boolean,
    ownsObject?: boolean,
    parentReferenceProperty?: string,
    ngModelProperty?: string
  );
  props: PropDescBase[];
  events: EventDescBase[];
  complexProps: ComplexPropDescBase[];
  add(
    props: PropDescBase[],
    events?: EventDescBase[],
    complexProps?: ComplexPropDescBase[],
    parentProperty?: string,
    isParentPropertyArray?: boolean,
    ownsObject?: boolean,
    parentReferenceProperty?: string,
    ngModelProperty?: string
  ): MetaDataBase;
  addOptions(options: any): this;
  prepare(): void;
}
