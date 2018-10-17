import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SuperAgentsService } from '../super-agents.service';


@Component({
  selector: 'app-super-agent-info',
  templateUrl: './super-agent-info.component.html',
  styleUrls: ['./super-agent-info.component.css']
})
export class SuperAgentInfoComponent implements OnInit, OnDestroy {

  agentData = null;
  agentSelectedListener;

  @Output() superAgentDeleteEvent = new EventEmitter<{}>();
  @Output() superAgentEditEvent = new EventEmitter<{}>();

  constructor(
    private superAgentService: SuperAgentsService
  ) { }

  ngOnInit() {
    this.agentSelectedListener = this.superAgentService.superAgentSelected.subscribe(superAgent => {
      this.agentData = superAgent;
    });
  }

  editAction() {
    this.superAgentEditEvent.emit(this.agentData);
  }

  deleteAction() {
    this.superAgentDeleteEvent.emit(this.agentData);
  }

  ngOnDestroy() {
    this.agentSelectedListener.unsubscribe();
  }

}
