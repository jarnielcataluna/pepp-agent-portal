import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AgentsService } from '../agents.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { startWith, map } from '../../../../../node_modules/rxjs/operators';
import { MatInput } from '@angular/material';
import { FormControl } from '../../../../../node_modules/@angular/forms';
import { AgentRequestModel } from '../../../models/requests/agent-request.model';

@Component({
  selector: 'app-agent-manage-dialog',
  templateUrl: './agent-manage-dialog.component.html',
  styleUrls: ['./agent-manage-dialog.component.css']
})
export class AgentManageDialogComponent implements OnInit {

  superAgentsSubscription;
  superAgents = [];
  superAgentsName = [];
  request: AgentRequestModel;

  filteredOptions: Observable<string[]>;

  @ViewChild('superAgent', {
    read: MatInput
  }) superAgent: MatInput;

  agentFormControl = new FormControl();

  constructor(
    private utils: UtilitiesService,
    private agentsService: AgentsService
  ) { }


  ngOnInit() {
    this.getSuperAgents();
  }

  getSuperAgents() {
    this.superAgentsSubscription = this.agentsService.superAgentsChanged.subscribe((data) => {
      this.superAgents = data;
      if (this.superAgents !== null || this.superAgents !== undefined) {
        for (const d of this.superAgents) {
          this.superAgentsName.push(d);
        }

        this.filteredOptions = this.agentFormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.superAgentsName.filter(option => this.utils.decrypt(option.name).toLowerCase().includes(filterValue));
  }

  superAgentChanged(event) {
    const superAgentName = this.utils.encrypt(event.target.value);
    if (this.superAgentsName.includes(superAgentName)) {
      this.selectSuperAgent(superAgentName);
    } else {
      if (superAgentName === '') {
        this.agentsService.setSuperAgent(null);
      } else {
        this.superAgent.value = '';
      }
      this._filter(this.superAgent.value);
    }
  }

  superAgentSelected(event) {
    const superAgentName = this.utils.encrypt(event.option.value);
    this.selectSuperAgent(superAgentName);
  }

  selectSuperAgent(name) {
    const superAgent = this.superAgents.find((s) => s.name === name);
    this.agentsService.setSuperAgent(superAgent.id);
  }

  firstNameChanged(event) {
    // const fname = this.utils.encrypt(event.target.value);
    const fname = event.target.value;
    this.agentsService.setFirstName(fname);
  }

  lastNameChanged(event) {
    // const lname = this.utils.encrypt(event.target.value);
    const lname = event.target.value;
    this.agentsService.setLastName(lname);
  }

  contactChanged(event) {
    // const contact = this.utils.encrypt(event.target.value);
    const contact = event.target.value;
    this.agentsService.setContact(contact);
  }

  deviceIdChanged(event) {
    // const deviceId = this.utils.encrypt(event.target.value);
    const deviceId = event.target.value;
    this.agentsService.setDeviceId(deviceId);
  }

  categoryChanged(event) {
    this.agentsService.setFeeCategory(event.target.value);
  }

  usernameChanged(event) {
    const username = event.target.value;
    // const username = this.utils.encrypt(event.target.value);
    this.agentsService.setUsername(username);
  }

  passwordChanged(event) {
    const password = event.target.value;
    // const password = this.utils.encrypt(event.target.value);
    this.agentsService.setPassword(password);
  }

  closeSideBar() {
    this.agentsService.closeDrawer();
  }



}
