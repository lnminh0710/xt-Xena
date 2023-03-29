/**
 * ExtendedFilterRule
 */
export class ExtendedFilterRule {
  public boolOp: string;
  public filterName: string;
  public operator: string;
  public value: string;

  public constructor(init?: Partial<ExtendedFilterRule>) {
    Object.assign(this, init);
  }
}

/**
 * AgeFilterRule
 */
export class AgeFilterRule {
  public range: string;
  public fromValue: string;
  public toValue: string;
  public groupType: string;
  public groupOperators: string;
  public groupQuantity: string;

  public constructor(init?: Partial<AgeFilterRule>) {
    Object.assign(this, init);
  }
}
