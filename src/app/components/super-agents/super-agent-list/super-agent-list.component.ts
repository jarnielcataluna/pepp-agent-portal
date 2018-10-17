import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ApiService } from '../../../services/api.service';
import { SuperAgentsService } from '../super-agents.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-super-agent-list',
  templateUrl: './super-agent-list.component.html',
  styleUrls: ['./super-agent-list.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('400ms ease-in', style({ transform: 'translatex(0%)' }))
      ]),

    ]),
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])]
})
export class SuperAgentListComponent implements OnInit, OnDestroy {

  constructor(
    private apiService: ApiService,
    private superAgentService: SuperAgentsService
  ) { }

  columnsToDisplay;
  dataSource = new MatTableDataSource<any>();
  superAgentsChangedListener;

  ngOnInit() {

    this.superAgentsChangedListener = this.superAgentService.superAgentsChanged.subscribe(superAgents => {
      this.dataSource = new MatTableDataSource<any>(superAgents);
    });

    this.columnsToDisplay = [
      'superAgentUserName',
      'superAgentName',
      'superAgentLastUpdate',
    ];
  }

  showInfo(row) {
    this.superAgentService.selectSuperAgent(row);
  }

  ngOnDestroy() {
    this.superAgentsChangedListener.unsubscribe();
  }
}
