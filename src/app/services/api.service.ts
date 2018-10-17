import { Injectable } from '@angular/core';
import { HttpManagerService } from './http-manager.service';
import { TransactionRequestModel } from '../models/requests/transaction-request.model';
import { LoginRequestModel } from '../models/requests/login-request.model';
import { SuperAgentRequestModel } from '../models/requests/super-agent-request.model';
import { AgentRequestModel } from '../models/requests/agent-request.model';
import { CoreConfigComponent } from '../components/core-config/core-config.component';
import { ConfigRequestModel } from '../components/models/config-request.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private httpManager: HttpManagerService) { }

  loginUser(request: LoginRequestModel): Promise<{}> {
    this.httpManager.setUserCredentials(request.username, request.password);
    return this.httpManager.requestAccessToken();
  }

  getTransactions(request: TransactionRequestModel): Promise<{}> {
    return this.httpManager.postJsonDataWithRequestingToken('/api/transactions', request);
  }

  getTransactionInfo(transactionId: string): Promise<{}> {
    return this.httpManager.getHttpWithRequestingToken(`/api/transactions/${transactionId}`);
  }

  getAgents(): Promise<{}> {
    return this.httpManager.getHttpWithRequestingToken('/api/agents');
  }

  deactivateAgent(username: string): Promise<{}> {
    return this.httpManager.getHttpWithRequestingToken(`/api/agents/deactivate/${username}`);
  }

  activateAgent(username: string): Promise<{}> {
    return this.httpManager.getHttpWithRequestingToken(`/api/agents/activate/${username}`);
  }

  getSuperAgents(): Promise<{}> {
    return this.httpManager.getHttpWithRequestingToken('/api/super-agents');
  }

  createSuperAgent(request: SuperAgentRequestModel): Promise<{}> {
    return this.httpManager.postJsonDataWithRequestingToken('/api/super-agents', request);
  }

  updateSuperAgent(request: SuperAgentRequestModel): Promise<{}> {
    return this.httpManager.putJsonDataWithRequestingToken(`/api/super-agents/${request.username}`, request);
  }

  createAgent(request: AgentRequestModel): Promise<{}> {
    return this.httpManager.postJsonDataWithRequestingToken('/api/agents', request);
  }

  getConfiguration(): Promise<{}> {
    return this.httpManager.getHttpWithRequestingToken('/api/core-config');
  }

  updateConfiguration(request: ConfigRequestModel): Promise<{}> {
    return this.httpManager.putJsonDataWithRequestingToken('/api/core-config', request);
  }

}
