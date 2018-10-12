/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


/*
 * Platform and Environment providers/directives/pipes
 */

import { CoreModule } from './core/core.module';
import { ServicesModule } from './services/services.module';

import { StoreModule } from './store/store.module';

import { ContractsModule } from './contracts/contracts.module';
import { ControlsModule } from './controls/controls.module';
import { DocumentsModule } from './documents/documents.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { KnowledgeBaseModule } from './knowledge-base/kb.module';

import { ProcessModule } from './process/process.module';
import { GlobalSearchModule } from './global-search/global-search.module';
import { InboxModule } from './inbox/inbox.module';
import { ObligationsModule } from './obligations/obligations.module';
import { ProjectManagementModule } from './project-management/project-management.module';
import { SecurityUIModule } from './security-ui/security-ui.module';
import { ServiceDeskModule } from './service-desk/service-desk.module';
import { SharedModule } from './shared/shared.module';

// App is our top level component
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// Define global exception handler provider
import { ErrorHandler } from '@angular/core';
import { ExceptionHandler } from './core/general/exception-handler';

const EXCEPTION_HANDLER_PROVIDER =  { provide: ErrorHandler, useClass: ExceptionHandler };

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],

  imports: [
    CoreModule,
    ServicesModule,
    StoreModule,
    SecurityUIModule,
    DashboardModule,
    KnowledgeBaseModule,
    ObligationsModule,
    ContractsModule,
    ControlsModule,
    DocumentsModule,
    ProcessModule,
    ProjectManagementModule,
    InboxModule,
    ServiceDeskModule,
    SharedModule,
    GlobalSearchModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],

  providers: [ EXCEPTION_HANDLER_PROVIDER ]

})
export class AppModule {}
