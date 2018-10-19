import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AgentsService } from '../agents.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-agent-status-dialog',
  templateUrl: './agent-status-dialog.component.html',
  styleUrls: ['./agent-status-dialog.component.css']
})
export class AgentStatusDialogComponent implements OnInit {


  agent;
  status;

  constructor(
    public dialogRef: MatDialogRef<AgentStatusDialogComponent>,
    private apiService: ApiService,
    private agentsService: AgentsService,
    private utils: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.agent = this.data;
  }

  onConfirmAction() {
    this.agent['user']['enabled'] ? this.deactivate() : this.activate();
  }

  deactivate() {
    const username = this.utils.decrypt(this.agent.user.username);
    this.apiService.deactivateAgent(username).then((data) => {
      this.agentsService.updateAgent(data['id'], data);
      this.utils.openSnackBar('Successfully deactivated agent!');
      this.dialogRef.close();
    }).catch((error) => {
      this.utils.openSnackBar('Opps! there seems to be a problem on deactivating this agent');
    });
  }

  activate() {
    const username = this.utils.decrypt(this.agent.user.username);
    this.apiService.activateAgent(username).then((data) => {
      this.agentsService.updateAgent(data['id'], data);
      this.utils.openSnackBar('Successfully activated agent!');
      this.dialogRef.close();
    }).catch((error) => {
      this.utils.openSnackBar('Opps! there seems to be a problem on activating this agent');
    });
  }

}
