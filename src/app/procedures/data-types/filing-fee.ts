/**
 * @license
 * Copyright (c) 2017 La Vía Óntica SC; Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 *
 */

export class FilingFee {
  public filingFeeType: string;
  public feeAmount: number;
  public rule: string;
  public legalBasis: string;

  constructor() {
    this.filingFeeType = '';
    this.feeAmount = 0;
    this.rule = '';
    this.legalBasis = '';
  }

}