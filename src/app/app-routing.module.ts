import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AgentsComponent } from './components/agents/agents.component';
import { SuperAgentsComponent } from './components/super-agents/super-agents.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CoreConfigComponent } from './components/core-config/core-config.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'transactions', pathMatch: 'full' },
    { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
    { path: 'agents', component: AgentsComponent, canActivate: [AuthGuard] },
    { path: 'super-agents', component: SuperAgentsComponent, canActivate: [AuthGuard] },
    { path: 'core-config', component: CoreConfigComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
