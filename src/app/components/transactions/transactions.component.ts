import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { TransactionRequestModel } from 'src/app/models/requests/transaction-request.model';
// tslint:disable-next-line:max-line-length
import { MatTableDataSource, MatSnackBar, MatPaginator, MatInput, MatAutocompleteSelectedEvent, MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HttpManagerService } from 'src/app/services/http-manager.service';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import { startWith, map } from 'rxjs/operators';
import { TransactionsService } from './transactions.service';
import { CommissionBreakdownDialogComponent } from './commission-breakdown-dialog/commission-breakdown-dialog.component';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  isSearchToggled = false;
  transactions;
  request: TransactionRequestModel;
  requestSubscription;
  exportData;
  fetchingData = true;
  includedTypes = [1, 2, 3, 4];
  types = ['Send', 'Receive', 'Top Up', 'Encash'];

  constructor(
    private router: Router,
    private httpManager: HttpManagerService,
    private apiService: ApiService,
    private utils: UtilitiesService,
    private transactionsService: TransactionsService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getAgents();
    this.getTransactionRequest();
  }

  getTransactionRequest() {
    this.requestSubscription = this.transactionsService.transactionRequestChanged.subscribe(data => {
      this.request = data;
      this.getTransactions();
    });
  }

  getTransactions() {
    this.fetchingData = true;
    this.apiService.getTransactions(this.request)
      .then((data) => {
        this.transactionsService.setTransactions(data);
      }, (error) => {
        this.openSnackBar(error.error.error_message);
        this.transactionsService.setTransactions(undefined);
        // this.transactionsService.clearTransactionRequest();
      })
      .catch((err) => {
        console.log(err);
        this.openSnackBar('Error occured');
      }).then(() => {
        this.fetchingData = false;
      });
  }

  getAgents() {
    this.apiService.getAgents()
      .then((data) => {
        this.transactionsService.setAgents(data);
      })
      .catch((error) => {
        this.openSnackBar(error.error.error_message);
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
    });
  }

  toggleSearch(isSearchToggled) {
    this.isSearchToggled = isSearchToggled;
  }

  downloadTransactions() {
    let req = new TransactionRequestModel();
    req = this.request;
    req.type = 0;
    this.apiService.getTransactions(this.request)
      .then((data) => {
        const downloaded: Array<any> = data['transactions']['content'];
        const result: any[] =
          downloaded.reduce((r, a) => {
            if (this.includedTypes.includes(a.service_type)) {
              const type = this.types[a.service_type - 1];
              r[type] = r[type] || [];
              r[type].push(a);
            }
            return r;
          }, []);
        this.exportToExcel(result);
      }, (error) => {
        this.openSnackBar(error.error.error_message);
      })
      .catch((err) => {
        console.log(err);
        this.openSnackBar('Cannot Download Report');
      });
  }

  exportToExcel(result) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    Object.keys(result).forEach(key => {

      const transactions: Array<any> = result[key];
      const grouped = [];
      transactions.forEach((transaction) => {
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
        grouped.push(temp);
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(grouped);
      XLSX.utils.book_append_sheet(wb, ws, key);
    });
    const now = new Date();
    XLSX.writeFile(wb, 'PEPP-REPORT-' + now.getTime() + '.xlsx');
  }

  ngOnDestroy() {

    if (this.requestSubscription !== undefined) {
      this.requestSubscription.unsubscribe();
    }

  }

}
