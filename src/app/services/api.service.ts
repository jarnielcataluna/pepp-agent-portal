import { Injectable } from '@angular/core';
import { HttpManagerService } from './http-manager.service';
import { TransactionRequestModel } from '../components/model/transaction-request.model';
import { LoginRequestModel } from '../components/model/login-request.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private httpManager: HttpManagerService) { }

  loginUser(request: LoginRequestModel): Promise<{}> {
    return this.httpManager.postJsonDataWithRequestingToken('/api/portal/login', request);
  }

  getTransactions(request: TransactionRequestModel): Promise<{}> {
    return this.httpManager.postJsonDataWithRefreshingToken('/api/portal/transactions/filter', request);
  }

  getAgents(): Promise<{}> {

    return this.httpManager.getHttpWithRefreshingToken('/api/portal/agents');
  }

  deactivateAgent(username: string): Promise<{}> {
    return this.httpManager.getHttpWithRefreshingToken(`/api/portal/deactivate/${username}`);
  }

  activateAgent(username: string): Promise<{}> {
    return this.httpManager.getHttpWithRefreshingToken(`/api/portal/activate/${username}`);
  }

}

