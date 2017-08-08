/**
 * @license
 * Copyright (c) 2017 La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 *
 */
import { Component } from '@angular/core';

@Component({
  selector:'projects-main-page',
  templateUrl:'./projects-main-page.component.html',
  styleUrls: ['./projects-main-page.component.scss']
})

export class ProjectsMainPageComponent {
  
  public isAddActivityEditorWindowVisible = false;

  public onCloseAddActivityEditorWindow(): void {    
    this.isAddActivityEditorWindowVisible = false;
  }

  public onClickAddActivity():void {
    this.isAddActivityEditorWindowVisible = true;
  }
}