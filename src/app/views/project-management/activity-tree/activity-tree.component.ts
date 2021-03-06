/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import {
  Component, EventEmitter,
  Input, OnChanges, Output, ChangeDetectionStrategy
} from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { ProjectModel } from '@app/store/project.store';

import {
  Activity, EmptyActivity, ActivityOperation,
  ProjectItemStatus
} from '@app/models/project-management';

import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { CheckProcessesDialogComponent } from '../check-processes-dialog/check-processes-dialog.component';

import { TimelineHelper } from '../common/timeline-helper';

import { CollapsableTree, CollapsableTreeNodeDisplayMode } from '../common/collapsable-tree';
import { FilterHelper } from '../common/filter-helper';
import { ExportActivitiesDialogComponent } from '../export-activities-dialog/export-activities-dialog.component';

import { MainSidebarValues, DefaultSidebarValues } from '@app/views/main-layout';

@Component({
  selector: 'emp-steps-activity-tree',
  templateUrl: './activity-tree.component.html',
  styleUrls: ['./activity-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTreeComponent implements OnChanges {

  selectedActivity: Activity = EmptyActivity;

  addFirstActivityEditorVisible = false;
  insertActivityEditorVisible = false;

  @Input() project: ProjectModel;
  @Input() filter: MainSidebarValues = DefaultSidebarValues;
  @Input() collapsedActivities = [];
  @Input() useForeignLanguage: false;

  @Output() activitySelect = new EventEmitter<Activity>();
  @Output() activityChange = new EventEmitter<ActivityOperation>();

  filteredActivities: Activity[] = [];
  treeEditionMode = false;

  statusFilter: ProjectItemStatus = 'Incomplete';

  keywords: '';

  private collapsableTreeHandler: CollapsableTree;

  constructor(private dialog: MatDialog) { }


  ngOnChanges() {
    this.displayActivitiesTree();
  }


  get allCollapsed() {
    return this.collapsableTreeHandler.allCollapsed;
  }


  get hasSelectedActivities() {
    return (this.selectedActivity.uid !== '');
  }


  get timelineHelper() {
    return TimelineHelper;
  }


  activityDisplayMode(activity: Activity): CollapsableTreeNodeDisplayMode {
    // if (activity.status === 'Completed' &&
    //     activity.template && activity.template.executionMode === 'Periodic') {
    //   return null;
    // }
    return this.collapsableTreeHandler.nodeDisplayMode(activity);
  }

  onSearch() {
    this.displayActivitiesTree();
  }

  toggleCollapse(activity: Activity) {
    return this.collapsableTreeHandler.toggleCollapse(activity);
  }



  toggleCollapseAll() {
    this.collapsableTreeHandler.toggleCollapseAll();
  }

  toggleTreeEditionMode() {
    this.treeEditionMode = !this.treeEditionMode;

    this.displayActivitiesTree();
  }


  activityNameClass(activity: Activity) {
    if (activity.level === 1) {
      return 'activity-name-level-1';
    } else if (activity.level % 2 === 0) {
      return 'activity-name-even-level';
    } else {
      return 'activity-name-odd-level';
    }
  }


  dropActivity(event: CdkDragDrop<string[]>) {
    if (event.currentIndex === event.previousIndex) {
      event.item.reset();
      return;
    }

    const activity = event.item.data as Activity;
    const newPosition = event.currentIndex < event.previousIndex ?
      event.currentIndex + 1 : event.currentIndex + 2;

    this.moveActivity(activity, newPosition);
  }


  getActivityName(activity: Activity) {
    if (this.useForeignLanguage) {
      return activity.foreignLanguage.name || activity.name;
    } else {
      return activity.name;
    }
  }


  isIndentable(activity: Activity): boolean {
    try {
      if (activity.position === 1) {
        return false;
      }

      const previous = this.project.activities.find(x => x.position === activity.position - 1);

      if (!previous) {
        return false;
      }

      if (activity.level > previous.level) {
        return false;
      }

      return true;
    } catch (e) {
      console.log('isIndentable error', e, activity);
      return false;
    }
  }


  isOutdentable(activity: Activity): boolean {
    try {
      if (activity.level === 1) {
        return false;
      }

      const previous = this.project.activities.find(x => x.position === activity.position - 1);

      if (!previous) {
        return false;
      }


      if (activity.level < previous.level || previous.level === 1) {
        return false;
      }

      const hasNextSiblings = this.project.activities.find(x => x.position > activity.position &&
        x.parent.uid === activity.parent.uid);

      if (hasNextSiblings) {
        return false;
      }

      return true;
    } catch (e) {
      console.log('isOutdentable error', e, activity);
      return false;
    }
  }


  indentActivity(activity: Activity) {
    if (!this.isIndentable(activity)) {
      return;
    }

    const previous = this.project.activities.find(x => x.position === activity.position - 1);

    if (previous.level === activity.level) {
      this.changeActivityParent(activity, previous);
      return;
    }

    const previousParent = this.project.activities.find(x => x.uid === previous.parent.uid);
    if (previousParent) {
      this.changeActivityParent(activity, previousParent);
    }
  }


  outdentActivity(activity: Activity) {
    if (!this.isOutdentable(activity)) {
      return;
    }

    const previous = this.project.activities.find(x => x.position === activity.position - 1);
    const previousParent = this.project.activities.find(x => x.uid === previous.parent.uid);

    if (!previousParent) {
      return;
    }

    this.changeActivityParent(activity, previousParent);
  }


  insertActivity(name: string, position?: number) {
    if (!name) {
      return;
    }

    // ToDo: Avoid send the request multiple times.
    //       Use a spinner and block the command
    //       Use a command processor (as a front controller)?
    //       For now this.hideInlineEditors() avoids multiple calls

    this.hideInlineEditors();

    const newActivity = {
      name: name,
      position: position ? position + 1 : 1
    };

    this.activityChange.emit({
      operation: 'insertActivity',
      activity: newActivity
    });
  }


  hideInlineEditors() {
    this.addFirstActivityEditorVisible = false;
    this.insertActivityEditorVisible = false;
  }


  isActivitySelected(activity: Activity): boolean {
    return (activity.uid === this.selectedActivity.uid);
  }


  onChangeStatusFilter(filterType: ProjectItemStatus) {
    this.statusFilter = filterType;
    this.displayActivitiesTree();
  }


  onSelectActivity(activity: Activity, emitEvent: boolean = false) {
    this.selectedActivity = activity;

    if (emitEvent) {
      this.activitySelect.emit(activity);
    }
  }


  openAddEventDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '400px';
    dialogConfig.minWidth = '980px';
    dialogConfig.width = '980px';

    dialogConfig.data = {
      insertionPoint: this.selectedActivity
    };

    this.dialog.open(AddEventDialogComponent, dialogConfig);
  }


  openCheckProcessesDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '400px';
    dialogConfig.width = '700px';

    this.dialog.open(CheckProcessesDialogComponent, dialogConfig);
  }


  openExportDataDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '520px';
    dialogConfig.width = '680px';

    this.dialog.open(ExportActivitiesDialogComponent, dialogConfig);
  }


  showInitialActivityInlineEditor() {
    this.hideInlineEditors();

    if (this.hasSelectedActivities) {
      this.insertActivityEditorVisible = true;
    } else {
      this.addFirstActivityEditorVisible = true;
    }
  }


  // private methods


  private changeActivityParent(activity: Activity, newParent: Activity) {
    this.activityChange.emit({
      operation: 'changeParent',
      activity: activity,
      newParent: newParent
    });
  }


  private displayActivitiesTree() {
    if (this.treeEditionMode) {
      this.filteredActivities = this.project.activities;
    } else {
      this.filter.status = this.statusFilter;
      this.filteredActivities = FilterHelper.applyFilter(this.filter, this.project.activities,
                                                         this.keywords);
    }

    this.collapsableTreeHandler = new CollapsableTree(this.filteredActivities,
                                                      this.collapsedActivities);

    if (this.selectedActivity.project.uid !== this.project.project.uid) {
      this.selectedActivity = EmptyActivity;
      this.collapsableTreeHandler.collapseAll();
    }
  }


  private moveActivity(activity: Activity, newPosition: number) {
    this.activityChange.emit({
      operation: 'moveActivity',
      activity: activity,
      newPosition: newPosition
    });
  }

}
