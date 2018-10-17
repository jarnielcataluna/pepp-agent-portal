import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { HttpManagerService } from '../../services/http-manager.service';
import { UtilitiesService } from '../../services/utilities.service';
import { SuperAgentManageDialogComponent } from './manage-dialog/manage-dialog.component';
import { SuperAgentDeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { SuperAgentsService } from './super-agents.service';

@Component({
  selector: 'app-super-agents',
  templateUrl: './super-agents.component.html',
  styleUrls: ['./super-agents.component.css']
})
export class SuperAgentsComponent implements OnInit, OnDestroy {
  fetchingData: boolean;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private apiService: ApiService,
    private superAgentService: SuperAgentsService
  ) { }

  isAgentSelected = false;
  selectedAgent;
  superAgentSelectedListener;


  ngOnInit() {
    this.getSuperAgents();
    this.getSelectedAgents();
  }

  showAddDialog(): void {
    const dialogRef = this.dialog.open(SuperAgentManageDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.openSnackBar(result);
      }
    });
  }

  getSuperAgents() {
    this.fetchingData = true;
    this.apiService.getSuperAgents()
      .then((data) => {
        this.superAgentService.setSuperAgents(data);
      })
      .catch((error) => {
        this.openSnackBar(error.error.error_message);
      }).then(() => {
        this.fetchingData = false;
      });
  }

  getSelectedAgents() {
    this.superAgentSelectedListener = this.superAgentService.superAgentSelected.subscribe(superAgent => {
      if (superAgent === null) {
        this.isAgentSelected = false;
      } else {
        this.isAgentSelected = true;
      }
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  closeInfo() {
    if (this.isAgentSelected === true) {
      this.isAgentSelected = false;
    }
  }

  handleSuperAgentDelete(superAgent) {
    console.log('delete', superAgent);

    const dialogRef = this.dialog.open(SuperAgentDeleteDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: superAgent
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== null) {
        console.log(result);
      }
      console.log('The dialog was closed');
    });

  }

  handleSuperAgentEditEvent(superAgent) {
    const dialogRef = this.dialog.open(SuperAgentManageDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: superAgent
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.openSnackBar(result);
      }
    });
  }


  ngOnDestroy() {
    this.superAgentSelectedListener.unsubscribe();
  }


}



