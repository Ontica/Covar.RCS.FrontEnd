/**
 * @license
 * Copyright (c) 2017 La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 *
 */

 import { Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';

 import {  ProjectRef } from '../data-types/project'; 

@Component({
  selector:'activity-add', 
  templateUrl:'./activity-add.component.html',
  styleUrls:['./activity-add.component.scss']
 
})

export class ActivityAddComponent {
  @HostBinding('style.display') public display = 'block';
  @HostBinding('style.position') public position = 'absolute';

  @Input() public project: ProjectRef;
  @Input() public parentId: number;
  @Input() public activityId: number = 3;
  @Output() public onCloseEvent = new EventEmitter();

  public isEvent = false;
  public elementType = '';
  
  public setElementType(elementType: string): void {    
    this.elementType = elementType;          
    this.validateIsEvent();
  }

  public onClose(): void {
    this.onCloseEvent.emit();
  }

  public onClickCancel(): void {
    this.onClose();
  }

  private validateIsEvent(): void {
    if (this.elementType === "event") {
      this.isEvent = true;
    } else {
       this.isEvent = false;
    }
  }

}