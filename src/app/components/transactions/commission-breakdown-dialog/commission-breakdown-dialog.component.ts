import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-commission-breakdown-dialog',
  templateUrl: './commission-breakdown-dialog.component.html',
  styleUrls: ['./commission-breakdown-dialog.component.css']
})
export class CommissionBreakdownDialogComponent implements OnInit {

  columnsToDisplay;
  dataSource = new MatTableDataSource<any>();
  processed = [];


  constructor(
    public dialogRef: MatDialogRef<CommissionBreakdownDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {

    console.log(this.data);

    this.dataSource = new MatTableDataSource<any>(this.data);

    this.columnsToDisplay = [
      'commissionType',
      'commissionPercent',
      'commissionValue'
    ];
  }

}
