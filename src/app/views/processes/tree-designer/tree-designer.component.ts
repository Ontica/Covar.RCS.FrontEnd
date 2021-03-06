/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter,
         Input, OnChanges, Output } from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { ProjectModel } from '@app/store/project.store';

import { Activity, EmptyActivity, ActivityOperation } from '@app/models/project-management';

import {
  ExportProcessesDialogComponent
} from '../export-processes-dialog/export-processes-dialog.component';

import {
  MoveActivityDialogComponent
} from '../move-activity-dialog/move-activity-dialog.component';

import {
  CollapsableTree,
  CollapsableTreeNodeDisplayMode
} from '@app/views/project-management/common/collapsable-tree';


@Component({
  selector: 'emp-steps-process-tree-designer',
  templateUrl: './tree-designer.component.html',
  styleUrls: ['./tree-designer.component.scss'],
})
export class ProcessTreeDesignerComponent implements OnChanges {

  selectedActivity: Activity = EmptyActivity;

  addFirstActivityEditorVisible = false;
  insertActivityEditorVisible = false;

  @Input() project: ProjectModel;
  @Input() collapsedActivities = [];
  @Input() useForeignLanguage: false;

  @Output() activityChange = new EventEmitter<ActivityOperation>();
  @Output() activitySelect = new EventEmitter<Activity>();

  private collapsableTreeHandler: CollapsableTree;

  constructor(private dialog: MatDialog) { }

  ngOnChanges() {
    this.collapsableTreeHandler = new CollapsableTree(this.project.activities,
                                                      this.collapsedActivities);

    if (this.selectedActivity.project.uid !== this.project.project.uid) {
      this.selectedActivity = EmptyActivity;
      this.collapsableTreeHandler.collapseAll();
    }
  }

  get allCollapsed() {
    return this.collapsableTreeHandler.allCollapsed;
  }

  get hasSelectedActivities() {
    return (this.selectedActivity.uid !== '');
  }

  getActivityName(activity: Activity) {
    if (this.useForeignLanguage) {
      return activity.foreignLanguage.name || activity.name;
    } else {
      return activity.name;
    }
  }

  activityDisplayMode(activity: Activity): CollapsableTreeNodeDisplayMode {
    return this.collapsableTreeHandler.nodeDisplayMode(activity);
  }

  toggleCollapse(activity: Activity) {
    return this.collapsableTreeHandler.toggleCollapse(activity);
  }

  toggleCollapseAll() {
    this.collapsableTreeHandler.toggleCollapseAll();
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

    this.activityChange.emit({ operation: 'insertActivity',
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

  onSelectActivity(activity: Activity, emitEvent: boolean = false) {
    this.selectedActivity = activity;

    if (emitEvent) {
      this.activitySelect.emit(activity);
    }
  }

  openCopyOrMoveActivityDialog(activity: Activity) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '400px',
    dialogConfig.width = '600px',
    dialogConfig.data = activity;

    const dialogRef = this.dialog.open(MoveActivityDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        result => {
        if (result) {
          this.activityChange.emit(result as ActivityOperation);
        }
      }
    );

  }

  openExportDataDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '320px',
    dialogConfig.width = '680px',
    dialogConfig.data = this.project;

    this.dialog.open(ExportProcessesDialogComponent, dialogConfig);
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
    this.activityChange.emit({ operation: 'changeParent',
                       activity: activity,
                       newParent: newParent
                     });
  }

  private moveActivity(activity: Activity, newPosition: number) {
    this.activityChange.emit({ operation: 'moveActivity',
                       activity: activity,
                       newPosition: newPosition
                     });
  }

}
