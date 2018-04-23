/**
 * @license
 * Copyright (c) 2017 La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 *
 */

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { Meeting } from '../data-types/meeting';
import { ProjectMeetingService } from '../services/project-meeting.service';
;


@Component({
    selector:'meetings',
    templateUrl: './project-meetings.component.html',
    styleUrls: ['./project-meetings.component.scss'],
    providers:[ProjectMeetingService]
})

export class MeetingsComponent implements OnInit  {

    public openedMeetings: Meeting[] = [];
    public closedMeetings: Meeting[] = [];
   
    public selectedMeetingUid = '';
    public filter = 'all';

    public keywords = '';
    
    public isOpenAddMeetingWindow = false;
    
    @Output() public onSelectedMeeting = new EventEmitter<string>();

    constructor(private projectMeetingService: ProjectMeetingService) {}

    ngOnInit() {
        this.loadMeetings();
    }
       
    public onFilterBy(filter: string): void {
        this.filter = filter;
    }

    public onSelectMeeting(uid:string): void {
       this.selectedMeetingUid = uid;        
       
       this.onSelectedMeeting.emit(uid);
    }
    
    public search(keywords: string): void {
        this.keywords = keywords; 
        this.loadMeetings();       
    }

    private async loadMeetings() {
        await this.loadOpenedMeetings();   
        this.loadClosedMeetings();   
    }       

    private loadOpenedMeetings(): void {
        this.projectMeetingService.getOpenedMeetings(this.keywords)
            .subscribe((meetings) => { this.openedMeetings = meetings; });
    }

    private loadClosedMeetings(): void {
        this.projectMeetingService.getMeetings(this.keywords)
            .subscribe((meetings) => { 
                this.closedMeetings = meetings.filter(meeting => meeting.status === 'Closed');             
             });
    }

}