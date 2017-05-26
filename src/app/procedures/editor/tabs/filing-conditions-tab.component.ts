import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Procedure } from '../../data-types/procedure';
import { ProcedureService } from '../../services/procedure.service';

@Component({
  selector: 'filing-conditions-tab',
  templateUrl: './filing-conditions-tab.component.html',
  styleUrls: ['./filing-conditions-tab.component.scss'],
  providers: [ProcedureService]
})

export class FilingConditionsTabComponent implements OnInit {

  @Output() public isEditable = new EventEmitter<boolean>();
  @Input() public procedure: Procedure;
  @Input() public isNewProcedure: boolean;
  public disabled = true;

  constructor(private procedureService: ProcedureService) { }

  public ngOnInit() {
    this.setProcedureStatus();
  }

  public saveProcedureChanges(): void {
    if (!this.validation()) {
      return;
    }
    this.updateProcedure();
    alert('El trámite se actualizó correctamente.');
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
    await this.procedureService.getProcuedure(this.procedure.uid).then((procedure) => {
      this.procedure = procedure;
    });
  }

  private setProcedureStatus(): void {
    if (this.isNewProcedure) {
      this.disabled = false;
    }
  }

  private validation(): boolean {
    if (this.procedure.filingCondition.startsWhen === '') {
      alert('Seleccionar cuando se debe de iniciar el trámite.');
      return false;
    }
    if (this.procedure.filingCondition.startsWhenTrigger === '') {
      alert('Seleccionar una acividad o evento de la lista.');
      return false;
    }
    if (this.procedure.filingCondition.maxFilingTerm === '') {
      alert('Seleccionar un plazo máximo de entrega de la lista.');
      return false;
    }
    if (this.procedure.filingCondition.issuanceLegalTerm === '') {
      alert('Seleccionar un plazo legal de la lista.');
      return false;
    }
    if (this.procedure.filingCondition.allowsDeferrals === '') {
      alert('Seleccionar si ¿El trámite permite prórrogas?.');
      return false;
    }
    return true;
  }

}