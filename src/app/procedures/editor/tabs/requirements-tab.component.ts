/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';

import { ProcedureService } from '@app/services/regulation';

import { Procedure } from "@app/models/regulation";


@Component({
  selector: 'requirements-tab',
  templateUrl: './requirements-tab.component.html',
  styleUrls: ['./requirements-tab.component.scss'],
  providers: [ProcedureService]
})
export class RequirementsTabComponent implements OnInit {

  @Output() public isEditable = new EventEmitter<boolean>();
  @Input() public procedure: Procedure;
  @Input() public isNewProcedure: boolean;

  public addButtonLabel = '';
  public disabled = true;

  public constructor(private procedureService: ProcedureService) { }

  public ngOnInit() {
    this.setProcedureStatus();
    this.setProcedure();
  }

  public saveProcedureChanges(): void {
    this.updateProcedure();
    alert('El trámite se actualizó correctamente.');
    this.disabled = true;
    this.isEditable.emit(false);
  }

  public async cancel() {
    await this.setProcedure();
    this.isEditable.emit(false);
  }

  public editProcedure(): void {
    this.disabled = false;
    this.isEditable.emit(true);
  }

  private updateProcedure(): void {
    this.procedureService.updateProcedure(this.procedure).then((procedure) => {
      this.procedure = procedure;
    });
  }

  private async setProcedure() {
    await this.procedureService.getProcedure(this.procedure.uid).then((procedure) => {
      this.procedure = procedure;
    });
  }

  private setProcedureStatus(): void {
    if (this.isNewProcedure) {
      this.disabled = false;
      this.addButtonLabel = 'Agregar trámite';
    } else {
      this.addButtonLabel = 'Guardar cambios';
    }
  }

}
