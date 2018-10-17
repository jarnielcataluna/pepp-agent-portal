import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { trigger, transition, animate, style, query, stagger } from '@angular/animations';
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
import { TransactionsService } from '../transactions.service';
import { CommissionBreakdownDialogComponent } from '../commission-breakdown-dialog/commission-breakdown-dialog.component';


@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [style({ height: 0, overflow: 'hidden' }), animate('.3s ease', style({ height: '*' }))]),
      transition(':leave', [style({ height: '*', overflow: 'hidden' }), animate('.3s ease', style({ height: 0 }))])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])]
})
export class TransactionListComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private router: Router,
    private httpManager: HttpManagerService,
    private apiService: ApiService,
    private transactionService: TransactionsService,
    private utils: UtilitiesService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
  }

  @Output() searchToggled = new EventEmitter<boolean>();
  @Input() isToggled;
  transactionsSubscription;


  request: TransactionRequestModel;
  // columnsToDisplay = [
  //   'transactionDate', 'userName', 'transactionCode', 'sender', 'receiver', 'principal', 'commission', 'serviceCharge', 'total'
  // ];

  columnsToDisplay = [
    'transactionDate', 'userName', 'transactionCode', 'sender', 'receiver', 'principal', 'serviceFee', 'total'
  ];

  dataSource = new MatTableDataSource<any>();
  transactionData: any[];
  summaryData: any[];
  selectedType = 0;
  fetchingData;

  exportData: {}[] = [];

  types = ['SEND', 'RECEIVE', 'TOPUP', 'ENCASH'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.getTransactions();
    this.getRemittanceTransactions();
  }

  ngOnInit() {

  }

  toggleSearch() {
    this.searchToggled.emit(true);
  }

  getRemittanceTransactions() {
    // this.columnsToDisplay = [
    //   'transactionDate', 'userName', 'transactionCode', 'sender', 'receiver', 'principal', 'commission', 'serviceCharge', 'total'
    // ];

    this.columnsToDisplay = [
      'transactionDate', 'userName', 'transactionCode', 'sender', 'receiver', 'principal', 'serviceFee', 'total'
    ];
    this.transactionService.setRequestType(1);
    this.selectedType = 0;
  }

  getReleasedTransactions() {
    // this.columnsToDisplay = [
    //   'transactionDate', 'userName', 'transactionCode', 'receiver', 'principal', 'total'
    // ];

    this.columnsToDisplay = [
      'transactionDate', 'userName', 'transactionCode', 'receiver', 'principal', 'serviceFee', 'total'
    ];
    this.transactionService.setRequestType(2);
    this.selectedType = 1;
  }

  getTopUpTransactions() {
    this.columnsToDisplay = [
      'transactionDate', 'userName', 'transactionCode', 'total'
    ];
    this.transactionService.setRequestType(3);
    this.selectedType = 2;
  }

  getEncashTransactions() {
    this.columnsToDisplay = [
      'transactionDate', 'userName', 'transactionCode', 'total'
    ];
    this.transactionService.setRequestType(4);
    this.selectedType = 3;
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

  getServiceFee() {

    if (this.transactionData === undefined) {
      return 0;
    }

    return this.transactionData.map(t => t.service_fee).reduce((acc, value) => acc + value, 0);
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

  refreshTable() {
    this.transactionService.refreshTransaction();
  }

  getTransactions() {
    this.transactionsSubscription = this.transactionService.transactionsChanged.subscribe(data => {
      this.transactionData = [];
      if (data !== undefined) {
        this.transactionData = data['transactions']['content'];
        this.summaryData = data['total'];
      }

      this.dataSource = new MatTableDataSource<any>(this.transactionData);

      if (this.paginator !== undefined) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }

    });
  }

  getTransactionInfo(row) {
    console.log(row);
    const transactionId = this.utils.decrypt(row['partner_reference_no']);
    this.apiService.getTransactionInfo(transactionId).then(
      (data) => {
        console.log(data);
        this.showBreakDownDialog(data);
      },
      (error) => {
        console.log(error);
      });
  }

  showBreakDownDialog(data) {
    const dialogRef = this.dialog.open(CommissionBreakdownDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: data
    });
  }

  ngOnDestroy() {
    if (this.transactionsSubscription !== undefined) {
      this.transactionsSubscription.unsubscribe();
    }
  }

  // exportAsExcel() {

  //   for (const transaction of this.transactionData) {
  //     const temp = {};
  //     const date = new Date(transaction['timestamp']);
  //     temp['DATE'] = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getUTCFullYear();
  //     temp['TIME'] = (date.getHours()) + ':' + date.getMinutes() + ':' + date.getSeconds();
  //     temp['USERNAME'] = this.utils.decrypt(transaction['agent_username']);
  //     temp['TRANX CODE'] = this.utils.decrypt(transaction['transaction_code']);

  //     const sender = transaction['sender_name'];
  //     if (sender != null) {
  //       const s = this.utils.decrypt(sender['first_name']) + ' ' + this.utils.decrypt(sender['last_name']);
  //       temp['SENDER'] = s.toUpperCase();
  //     }
  //     const receiver = transaction['receiver_name'];
  //     if (sender != null) {
  //       const r = this.utils.decrypt(receiver['first_name']) + ' ' + this.utils.decrypt(receiver['last_name']);
  //       temp['RECEIVER'] = r.toUpperCase();
  //     }

  //     temp['PRINCIPAL'] = transaction['amount_principal'];
  //     temp['COMMISSION'] = transaction['commission'];
  //     temp['SERVICE CHARGE'] = transaction['service_charge'];
  //     temp['TOTAL'] = transaction['total'];

  //     this.exportData.push(temp);
  //   }

  //   const now = new Date();
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.exportData);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, this.types[this.request.type - 1]);
  //   /* save to file */
  //   XLSX.writeFile(wb, 'PEPP-' + this.types[this.request.type - 1] + '-REPORT-' + now.getTime() + '.xlsx');
  // }
}
