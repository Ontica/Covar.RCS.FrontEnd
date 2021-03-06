/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DataObject } from '@app/models/data-objects';


@Component({
  selector: 'emp-data-object-designer',
  templateUrl: './data-object-designer.component.html'
})
export class DataObjectDesignerComponent {

  @Input() dataObject: DataObject;

  @Output() designerClose = new EventEmitter();

  onClose() {
    this.designerClose.emit();
  }

}
