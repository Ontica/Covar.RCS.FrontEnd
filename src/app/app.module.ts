/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/core.module';

import { MainLayoutModule } from './views/main-layout/main-layout.module';

import { StoreModule } from './store/store.module';

import { DocumentsModule } from './documents/documents.module';

import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DataAnalyticsModule } from './data-analytics/data-analytics.module';

import { StepsModule } from './steps/steps.module';

import { ProcessesModule } from './processes/processes.module';

import { ProjectManagementModule } from './project-management/project-management.module';

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

    BrowserModule,
    BrowserAnimationsModule,

    CoreModule,
    MainLayoutModule,

    StoreModule,

    KnowledgeBaseModule,
    DashboardModule,
    DataAnalyticsModule,

    DocumentsModule,
    ProcessesModule,
    StepsModule,
    ProjectManagementModule,
    SharedModule,

    AppRoutingModule,
  ],

  providers: [
    EXCEPTION_HANDLER_PROVIDER
  ]

})
export class AppModule {}
