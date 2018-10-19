import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, ElementRef } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { MatPaginator, MatTableDataSource, MatDatepickerInputEvent, MatSnackBar, MatAutocompleteSelectedEvent, MatInput, MatDialog, MatTable } from '@angular/material';
import { ApiService } from '../../services/api.service';
import { UtilitiesService } from '../../services/utilities.service';
import { TransactionRequestModel } from '../../models/requests/transaction-request.model';
import { HttpManagerService } from '../../services/http-manager.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


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
  agents;
  usernames = [];
  selectedType;
  fetchingData;

  exportData: {}[] = [];

  types = ['SEND', 'RECEIVE', 'TOPUP', 'ENCASH'];

  title;

  filteredOptions: Observable<string[]>;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('transactionWrapper') table: ElementRef;

  @ViewChild('endInput', {
    read: MatInput
  }) endInput: MatInput;

  @ViewChild('startInput', {
    read: MatInput
  }) startInput: MatInput;

  @ViewChild('agentInput', {
    read: MatInput
  }) agentInput: MatInput;

  agentFormControl = new FormControl();

  ngOnInit() {
    this.request = new TransactionRequestModel();
    this.dataSource.paginator = this.paginator;
    this.getRemittanceTransactions();
    this.getUser();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usernames.filter(option => option.toLowerCase().includes(filterValue));
  }


  getRemittanceTransactions() {
    this.columnsToDisplay = [
      // tslint:disable-next-line:max-line-length
      'transactionDate', 'userName', 'referenceNo', 'transactionCode', 'sender', 'receiver', 'principal', 'commission', 'serviceCharge', 'total'
    ];
    this.title = 'Remittances';
    this.request.type = 1;
    this.getTransactions();
  }

  getReleasedTransactions() {
    this.title = 'Acknowledgement';
    this.columnsToDisplay = [
      'transactionDate', 'userName', 'referenceNo', 'transactionCode', 'receiver', 'principal', 'total'
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
    this.transactionData = undefined;
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
        this.agents = data;
      })
      .catch((error) => {
        this.openSnackBar(error.error.error_message);
      }).then(() => {

        for (const d of this.agents) {
          this.usernames.push(this.utils.decrypt(d['user']['username']));
        }

        this.filteredOptions = this.agentFormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
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
      duration: 3000,
    });
  }


  agentChanged(event) {

    if (this.usernames.includes(event.target.value)) {
      this.request.agent = this.utils.encrypt(event.target.value);
      this.getTransactions();
    } else {
      if (event.target.value === '') {
        this.request.agent = null;
        this.getTransactions();
      } else {
        this.agentInput.value = '';
      }

      this._filter(this.agentInput.value);
    }
  }

  agentSelected(event: MatAutocompleteSelectedEvent) {
    this.request.agent = this.utils.encrypt(event.option.value);
    this.getTransactions();
  }

  logOff() {
    this.httpManager.logout();
    this.router.navigate(['/login']);
  }

  exportAsExcel() {

    for (const transaction of this.transactionData) {
      const temp = {};
      const date = new Date(transaction['timestamp']);
      temp['DATE'] = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getUTCFullYear();
      temp['TIME'] = (date.getHours()) + ':' + date.getMinutes() + ':' + date.getSeconds();
      temp['USERNAME'] = this.utils.decrypt(transaction['agent_username']);
      temp['TRANX CODE'] = this.utils.decrypt(transaction['transaction_code']);

      const sender = transaction['sender_name'];
      if (sender != null) {
        const s = this.utils.decrypt(sender['first_name']) + ' ' + this.utils.decrypt(sender['last_name']);
        temp['SENDER'] = s.toUpperCase();
      }
      const receiver = transaction['receiver_name'];
      if (sender != null) {
        const r = this.utils.decrypt(receiver['first_name']) + ' ' + this.utils.decrypt(receiver['last_name']);
        temp['RECEIVER'] = r.toUpperCase();
      }

      temp['PRINCIPAL'] = transaction['amount_principal'];
      temp['COMMISSION'] = transaction['commission'];
      temp['SERVICE CHARGE'] = transaction['service_charge'];
      temp['TOTAL'] = transaction['total'];

      this.exportData.push(temp);
    }

    const now = new Date();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.types[this.request.type - 1]);
    /* save to file */
    XLSX.writeFile(wb, 'PEPP-' + this.types[this.request.type - 1] + '-REPORT-' + now.getTime() + '.xlsx');
  }
}



