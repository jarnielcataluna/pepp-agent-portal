import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatPaginator, MatTableDataSource, MatDatepickerInputEvent, MatSnackBar, MatAutocompleteSelectedEvent, MatInput, MatDialog } from '@angular/material';
import { ApiService } from '../../services/api.service';
import { UtilitiesService } from '../../services/utilities.service';
import { TransactionRequestModel } from '../model/transaction-request.model';
import { HttpManagerService } from '../../services/http-manager.service';
import { Router } from '../../../../node_modules/@angular/router';

export class Transaction {
  date: number;
  username: string;
  type: number;
  txnCode: string;
  sender: string;
  receiver: string;
  principal: number;
  commission: number;
  serviceCharge: number;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private httpManager: HttpManagerService,
    private apiService: ApiService,
    private utils: UtilitiesService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  request: TransactionRequestModel;
  columnsToDisplay;

  dataSource = new MatTableDataSource<any>();
  transactionData: any[];
  usernames;
  selectedType;
  fetchingData;

  title;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('endInput', {
    read: MatInput
  }) endInput: MatInput;

  @ViewChild('startInput', {
    read: MatInput
  }) startInput: MatInput;

  @ViewChild('agentInput', {
    read: MatInput
  }) agentInput: MatInput;


  ngOnInit() {
    this.request = new TransactionRequestModel();
    this.dataSource.paginator = this.paginator;
    this.getRemittanceTransactions();
    this.getUser();
  }


  getRemittanceTransactions() {
    this.columnsToDisplay = [
      'transactionDate', 'userName', 'transactionCode', 'sender', 'receiver', 'principal', 'commission', 'serviceCharge', 'total'
    ];
    this.title = 'Remittances';
    this.request.type = 1;
    this.getTransactions();
  }

  getReleasedTransactions() {
    this.title = 'Acknowledgement';
    this.columnsToDisplay = [
      'transactionDate', 'userName', 'transactionCode', 'receiver', 'principal', 'commission', 'serviceCharge', 'total'
    ];
    this.request.type = 2;
    this.getTransactions();
  }

  getTopUpTransactions() {
    this.title = 'Top Up';
    this.columnsToDisplay = [
      'transactionDate', 'userName', 'transactionCode', 'referenceNo', 'total'
    ];
    this.request.type = 3;
    this.getTransactions();
  }

  getEncashTransactions() {
    this.title = 'Encash';
    this.columnsToDisplay = [
      'transactionDate', 'userName', 'transactionCode', 'total'
    ];
    this.request.type = 4;
    this.getTransactions();
  }

  getPrincipal() {

    if (this.transactionData === undefined) {
      return 0;
    }

    return this.transactionData.map(t => t.amount_principal).reduce((acc, value) => acc + value, 0);
  }

  getCommission() {

    if (this.transactionData === undefined) {
      return 0;
    }

    return this.transactionData.map(t => t.commission).reduce((acc, value) => acc + value, 0);
  }

  getServiceCharge() {

    if (this.transactionData === undefined) {
      return 0;
    }

    return this.transactionData.map(t => t.service_charge).reduce((acc, value) => acc + value, 0);
  }

  getTotalCost() {
    if (this.transactionData === undefined) {
      return 0;
    }

    return this.transactionData.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }

  getTransactions() {
    this.fetchingData = true;
    this.dataSource = undefined;
    this.apiService.getTransactions(this.request)
      .then((data) => {
        this.transactionData = data['content'];
        this.dataSource = new MatTableDataSource<any>(this.transactionData);
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      })
      .catch((error) => {
        this.openSnackBar(error.error.error_message);
        this.resetRequest();
      }).then(() => {
        this.fetchingData = false;
      });
  }

  resetRequest() {
    const storedType: number = this.request.type;
    this.request = new TransactionRequestModel();
    this.request.type = storedType;

    this.resetFilter();
    this.getTransactions();
  }


  resetFilter() {
    this.startInput.value = '';
    this.endInput.value = '';
    this.agentInput.value = '';
  }

  getUser() {
    this.apiService.getAgents()
      .then((data) => {
        console.log(data);
        this.usernames = data;
      })
      .catch((error) => {
        this.openSnackBar(error.error.error_message);
      });
  }

  dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = event.value.getFullYear() + '-' + this.pad(event.value.getMonth() + 1) + '-' + this.pad(event.value.getDate());
    if (type === 'start') {
      this.request.startDate = date;
    } else {
      this.request.endDate = date;
    }

    this.getTransactions();
  }

  pad(n: number): string {
    return (n < 10) ? ('0' + n) : '' + n;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }


  agentChanged(event) {
    console.log(event);
  }

  agentSelected(event: MatAutocompleteSelectedEvent) {
    this.request.agent = this.utils.encrypt(event.option.value);
    this.getTransactions();
  }

  logOff() {
    this.httpManager.logout();
    this.router.navigate(['/login']);
  }

  openDeactivateDialog() {

  }
}



