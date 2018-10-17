import { Component, OnInit, Inject } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class SuperAgentDeleteDialogComponent implements OnInit {

  constructor(
    private utilityService: UtilitiesService,
    public dialogRef: MatDialogRef<SuperAgentDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
