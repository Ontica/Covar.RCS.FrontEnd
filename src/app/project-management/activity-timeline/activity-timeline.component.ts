/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter,
         Input, OnChanges, Output } from '@angular/core';

import { MatDialog } from '@angular/material';

import { ProjectModel } from '@app/store/project.store';
import { Activity, EmptyActivity } from '@app/models/project-management';

import { GroupByProperty } from './group-activities-by.pipe';

import { Assertion } from '@app/core';
import { TimelineHelper } from '../common/timeline-helper';


@Component({
  selector: 'emp-steps-activity-timeline',
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['../common/activity.scss'],
})
export class ActivityTimelineComponent implements OnChanges {

  selectedActivity: Activity = EmptyActivity;

  @Input() project: ProjectModel;
  @Input() groupBy: GroupByProperty;

  @Output() activitySelected = new EventEmitter<Activity>();


  constructor() { }


  ngOnChanges() {
    if (this.project) {
      if (this.selectedActivity.project.uid !== this.project.project.uid) {
        this.selectedActivity = EmptyActivity;
      }
    }
  }


  get hasSelectedActivities() {
    return (this.selectedActivity.uid !== '');
  }


  get timelineHelper() {
    return TimelineHelper;
  }


  get viewTitle() {
    switch (this.groupBy) {
      case 'timeline':
        return 'Línea de tiempo';

      case 'deadline':
        return 'Fecha máxima de entrega';

      case 'plannedEndDate':
        return 'Fecha objetivo';

      case 'actualStartDate':
        return 'Fecha de inicio';

      case 'responsible':
        return 'Responsables';

      case 'theme':
        return 'Temas';

      default:
        throw Assertion.assertNoReachThisCode(`Unrecognized groupBy value '${this.groupBy}'.`);
    }
  }


  onSelectActivity(activity: Activity, emitEvent: boolean = false) {
    this.selectedActivity = activity;

    if (emitEvent) {
      this.activitySelected.emit(activity);
    }
  }


  isSelected(activity: Activity): boolean {
    return (activity.uid === this.selectedActivity.uid);
  }

}
