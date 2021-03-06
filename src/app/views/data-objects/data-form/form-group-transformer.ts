import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DataFormField } from '@app/models/data-objects';

@Injectable()
export class FormGroupTransformer {

  constructor() { }

  toFormGroup(questions: DataFormField[], data?: any) {
    const group: any = {};

    if (!data) {
      questions.forEach(question => {
        if (question.required) {
          group[question.key] = new FormControl(question.value || '', Validators.required);
        } else {
          group[question.key] = new FormControl(question.value || '');
        }
      });

    } else {
      questions.forEach(question => {
        if (question.required) {
          group[question.key] = new FormControl(data[question.key] || question.value || '',
                                                Validators.required);
        } else  {
          group[question.key] = new FormControl(data[question.key] || question.value || '');
        }
      });


    }
    return new FormGroup(group);
  }

}
