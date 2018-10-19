import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpManagerService } from '../../../services/http-manager.service';
import { ApiService } from '../../../services/api.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { MatSnackBar, MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { AgentsService } from '../agents.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-agents-list',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.3s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])]
})
export class AgentsListComponent implements OnInit, OnDestroy {

  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private agentsService: AgentsService
  ) { }

  agents;
  fetchingData;
  columnsToDisplay;
  agentsChangedListener;
  dataSource = new MatTableDataSource<any>();
  agentSelected;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.getAgents();
  }

  getAgents() {
    this.agentsChangedListener = this.agentsService.agentsChanged.subscribe(agents => {
      this.dataSource = new MatTableDataSource<any>(agents);

      if (this.paginator !== undefined) {
        this.dataSource.paginator = this.paginator;
        this.paginator.firstPage();
      }

    });

    this.columnsToDisplay = [
      'agentUserName',
      'agentName',
      'agentWallet',
      'agentLastUpdated',
      'agentStatus'
    ];
  }

  showInfo(agent) {
    this.agentsService.selectAgent(agent);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  ngOnDestroy() {
    this.agentsChangedListener.unsubscribe();
  }
}
