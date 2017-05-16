/**
 * @license
 * Copyright (c) 2017 La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 *
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowModelingModule } from './modeling/workflow-modeling.module';
import { WorkflowRoutingModule } from './workflow-routing.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [WorkflowModelingModule, WorkflowRoutingModule, CommonModule],
  declarations: [],
  exports: [WorkflowModelingModule]
})
export class WorkflowModule { }
