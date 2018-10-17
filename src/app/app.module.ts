import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
// tslint:disable-next-line:max-line-length
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule, MatTab, MatTabsModule, MatDatepickerModule, MatNativeDateModule, MatFormField, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatSnackBarModule, MatExpansionModule, MatProgressBar, MatProgressBarModule, MatTooltipModule, MatDialogModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DecryptPipe } from './pipes/decrypt.pipe';
import { AgentsComponent } from './components/agents/agents.component';
import { SideBarComponent } from './components/general/side-bar/side-bar.component';
import { SuperAgentsComponent } from './components/super-agents/super-agents.component';
import { SuperAgentListComponent } from './components/super-agents/super-agent-list/super-agent-list.component';
import { SuperAgentInfoComponent } from './components/super-agents/super-agent-info/super-agent-info.component';
import { SuperAgentManageDialogComponent } from './components/super-agents/manage-dialog/manage-dialog.component';
import { SuperAgentDeleteDialogComponent } from './components/super-agents/delete-dialog/delete-dialog.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransactionListComponent } from './components/transactions/transaction-list/transaction-list.component';
import { TransactionFilterComponent } from './components/transactions/transaction-filter/transaction-filter.component';
import { AgentsInfoComponent } from './components/agents/agents-info/agents-info.component';
import { AgentsListComponent } from './components/agents/agents-list/agents-list.component';
import { AgentManageDialogComponent } from './components/agents/agent-manage-dialog/agent-manage-dialog.component';
import { AgentDeleteDialogComponent } from './components/agents/agent-delete-dialog/agent-delete-dialog.component';
// tslint:disable-next-line:max-line-length
import { CommissionBreakdownDialogComponent } from './components/transactions/commission-breakdown-dialog/commission-breakdown-dialog.component';
import { CoreConfigComponent } from './components/core-config/core-config.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DecryptPipe,
    AgentsComponent,
    SideBarComponent,
    SuperAgentsComponent,
    SuperAgentManageDialogComponent,
    SuperAgentListComponent,
    SuperAgentInfoComponent,
    SuperAgentDeleteDialogComponent,
    TransactionsComponent,
    TransactionListComponent,
    TransactionFilterComponent,
    AgentsInfoComponent,
    AgentsListComponent,
    AgentManageDialogComponent,
    AgentDeleteDialogComponent,
    CommissionBreakdownDialogComponent,
    CoreConfigComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [
    SuperAgentManageDialogComponent,
    SuperAgentDeleteDialogComponent,
    AgentManageDialogComponent,
    AgentDeleteDialogComponent,
    CommissionBreakdownDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
