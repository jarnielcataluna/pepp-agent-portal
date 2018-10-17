import { Component, OnInit, OnDestroy } from '@angular/core';
import { AgentsService } from '../agents.service';
import { ApiService } from '../../../services/api.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { MatSnackBar } from '../../../../../node_modules/@angular/material';

@Component({
  selector: 'app-agents-info',
  templateUrl: './agents-info.component.html',
  styleUrls: ['./agents-info.component.css']
})
export class AgentsInfoComponent implements OnInit, OnDestroy {

  agent;
  wallet;
  transactions = [];
  approvedTransactions = [];
  sendTransactions = [];
  receiveTransactions = [];
  topUpTransactions = [];
  encashTransactions = [];
  roiCommissions = [];
  commissions = [];
  totalSend;
  agentSelectedListener;

  constructor(
    private agentsService: AgentsService,
    private apiService: ApiService,
    private utils: UtilitiesService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initializeData();
    this.generateApprovedTransactions();
    this.listenAgentSelected();
  }

  initializeData() {
    this.agent = this.agentsService.getAgent();
    console.log(this.agent);
    this.wallet = this.agent.wallet;
    this.transactions = this.wallet.transactions;
  }

  generateApprovedTransactions() {
    this.approvedTransactions = this.transactions.filter((transaction) => transaction.status.code === 0);
    console.log(this.approvedTransactions);
    this.sendTransactions = this.getTransactionsByType('SEND_MONEY');
    this.receiveTransactions = this.getTransactionsByType('RECEIVE_MONEY');
    this.topUpTransactions = this.getTransactionsByType('AGENT_TOPUP');
    this.encashTransactions = this.getTransactionsByType('AGENT_ENCASH');
    this.roiCommissions = this.getTransactionsByType('ROI_SEND_COMMISSION');
    this.roiCommissions.concat(this.getTransactionsByType('ROI_RECEIVE_COMMISSION'));
    this.commissions = this.getTransactionsByType('AGENT_SEND_COMMISSION');
    this.commissions.concat(this.getTransactionsByType('AGENT_RECEIVE_COMMISSION'));
  }

  getTransactionsByType(type): Array<any> {
    return this.approvedTransactions.filter((transaction) => transaction.type.name === type);
  }

  getTotal(transactions: Array<any>) {
    return transactions.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }

  getAverage(transactions) {

    if (transactions.length === 0) {
      return 0;
    }

    const total = transactions.map(t => t.total).reduce((acc, value) => acc + value, 0);
    return total / transactions.length;
  }

  getAverageWalletBalance() {
    if (this.approvedTransactions.length === 0) {
      return 0;
    }

    const total = this.approvedTransactions.map(t => t.currentBalance).reduce((acc, value) => acc + value, 0);
    return total / this.approvedTransactions.length;
  }

  getTotals() {
    let total = this.getTotal(this.sendTransactions);
    total = total + this.getTotal(this.receiveTransactions);
    total = total + this.getTotal(this.topUpTransactions);
    total = total + this.getTotal(this.encashTransactions);
    return total;
  }

  getCount() {
    let total = this.sendTransactions.length;
    total = total + this.receiveTransactions.length;
    total = total + this.topUpTransactions.length;
    total = total + this.encashTransactions.length;
    return total;
  }

  deactivate() {
    const username = this.utils.decrypt(this.agent.user.username);
    this.apiService.deactivateAgent(username).then((data) => {
      this.agentsService.updateAgent(data['id'], data);
      this.openSnackBar('Successfully deactivated agent!');
    }).catch((error) => {
      this.openSnackBar('Opps! there seems to be a problem on activating this agent');
    });
  }

  activate() {
    const username = this.utils.decrypt(this.agent.user.username);
    this.apiService.activateAgent(username).then((data) => {
      this.agentsService.updateAgent(data['id'], data);
      this.openSnackBar('Successfully activated agent!');
    }).catch((error) => {
      this.openSnackBar('Opps! there seems to be a problem on activating this agent');
    });
  }

  listenAgentSelected() {
    this.agentSelectedListener = this.agentsService.agentSelected.subscribe(agent => {
      this.agent = agent;
    });
  }

  ngOnDestroy() {
    this.agentSelectedListener.unsubscribe();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }



}
