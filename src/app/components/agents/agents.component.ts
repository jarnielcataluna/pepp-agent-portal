import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpManagerService } from '../../services/http-manager.service';
import { ApiService } from '../../services/api.service';
import { UtilitiesService } from '../../services/utilities.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AgentsService } from './agents.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { AgentManageDialogComponent } from './agent-manage-dialog/agent-manage-dialog.component';
import { AgentRequestModel } from '../../models/requests/agent-request.model';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [style({ height: 0, overflow: 'hidden' }), animate('.3s ease', style({ height: '*' }))]),
      transition(':leave', [style({ height: '*', overflow: 'hidden' }), animate('.3s ease', style({ height: 0 }))])
    ]),
  ]
})
export class AgentsComponent implements OnInit, OnDestroy {

  isAgentSelected = false;
  fetchingData = false;
  isDrawerOpen = false;
  request = new AgentRequestModel();

  drawerToggledListerner;
  agentSelectedListener;
  agentRequestListener;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private apiService: ApiService,
    private agentService: AgentsService
  ) { }

  ngOnInit() {
    this.getAgents();
    this.listenDrawerToggled();
    this.listenAgentSelected();
    this.getSuperAgents();
    this.onRequestChanged();
  }

  getAgents() {
    this.fetchingData = true;
    this.apiService.getAgents()
      .then((data) => {
        this.agentService.setAgents(data);
      })
      .catch((error) => {
        this.openSnackBar(error.error.error_message);
      }).then(() => {
        this.fetchingData = false;
      });
  }

  listenDrawerToggled() {
    this.drawerToggledListerner = this.agentService.drawerToggled.subscribe(open => this.isDrawerOpen = open);
  }

  listenAgentSelected() {
    this.agentSelectedListener = this.agentService.agentSelected.subscribe(agent => {
      this.isAgentSelected = (agent !== null);
    });
  }

  onRequestChanged() {
    this.agentRequestListener = this.agentService.requestChanged.subscribe((request) => {
      this.request = request;
    });
  }

  showEditDialog(data) {
    this.isAgentSelected = true;
  }

  showAddDialog(): void {
    this.isAgentSelected = true;
  }

  getSuperAgents() {
    this.apiService.getSuperAgents()
      .then((data) => {
        this.agentService.setSuperAgents(data);
      })
      .catch((error) => {
        this.openSnackBar(error.error.error_message);
      }).then(() => {
        this.fetchingData = false;
      });
  }

  createAgent() {
    this.fetchingData = true;
    this.apiService.createAgent(this.request).then((data) => {
      this.agentService.addAgent(data);
      this.openSnackBar('Successfully created agent.');
    }, (error) => this.openSnackBar(error.error.error_message))
      .catch((error) => {
        this.openSnackBar('unable to create agent');
      }).then(() => {
        this.fetchingData = false;
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  openDrawer() {
    this.agentService.openDrawer();
  }

  closeInfo() {
    this.agentService.selectAgent(null);
    this.getAgents();
  }

  ngOnDestroy() {
    this.agentSelectedListener.unsubscribe();
    this.drawerToggledListerner.unsubscribe();
    this.agentRequestListener.unsubscribe();
  }

}
