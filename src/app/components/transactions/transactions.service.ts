import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TransactionRequestModel } from '../../models/requests/transaction-request.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private transactions = [];
  private transactionRequest = new TransactionRequestModel();
  private agents = [];

  transactionsChanged = new Subject<Object>();
  transactionRequestChanged = new Subject<TransactionRequestModel>();
  transactionCleared = new Subject<boolean>();
  agentsChanged = new Subject<Object[]>();

  constructor() { }

  setTransactions(transactions) {
    this.transactions = transactions;
    this.getTransactions();
  }

  getTransactions() {
    this.transactionsChanged.next(this.transactions);
  }

  setAgents(agents) {
    this.agents = agents;
    this.getAgents();
  }

  getAgents() {
    this.agentsChanged.next(this.agents.slice());
  }

  setRequestType(type: number) {
    this.transactionRequest.type = type;
    this.transactionRequestChanged.next(this.transactionRequest);
  }

  setRequestAgent(agent: string) {
    this.transactionRequest.agent = agent;
    this.transactionRequestChanged.next(this.transactionRequest);
  }

  setRequestStart(start: string) {
    this.transactionRequest.startDate = start;
    this.transactionRequestChanged.next(this.transactionRequest);
  }

  setRequestEnd(end: string) {
    this.transactionRequest.endDate = end;
    this.transactionRequestChanged.next(this.transactionRequest);
  }

  setTransactionRequest(request: TransactionRequestModel) {
    this.transactionRequest = request;
    this.transactionRequestChanged.next(request);
  }

  clearTransactionRequest() {
    this.transactionRequest.startDate = null;
    this.transactionRequest.endDate = null;
    this.transactionRequest.agent = null;
    this.transactionRequestChanged.next(this.transactionRequest);
    this.transactionCleared.next(true);
  }

  refreshTransaction() {
    this.transactionRequestChanged.next(this.transactionRequest);
  }

}
