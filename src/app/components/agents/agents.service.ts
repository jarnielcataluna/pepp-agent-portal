import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AgentRequestModel } from 'src/app/models/requests/agent-request.model';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  private agent;
  private agents = [];
  private superAgents = [];
  private request = new AgentRequestModel();

  agentsChanged = new Subject<Object[]>();
  superAgentsChanged = new Subject<Object[]>();
  agentSelected = new Subject<Object>();
  drawerToggled = new Subject<boolean>();
  requestChanged = new Subject<AgentRequestModel>();


  constructor() { }

  setAgents(agents) {
    this.agents = agents;
    this.getAgents();
  }

  setSuperAgents(superAgents) {
    this.superAgents = superAgents;
    this.superAgentsChanged.next(this.superAgents.slice());
  }

  getAgents() {
    this.agentsChanged.next(this.agents.slice());
  }

  addAgent(agents: Object) {
    this.agents.push(agents);
    this.getAgents();
  }

  updateAgent(id: number, agents: Object) {
    const index = this.agents.findIndex(s => s.id === id);
    this.agents[index] = agents;
    this.getAgents();
    this.selectAgent(agents);
  }

  removeAgent(id: number) {
    const index = this.agents.findIndex(s => s.id === id);
    this.agents.splice(index, 1);
    this.getAgents();
  }

  selectAgent(agent) {
    this.agent = agent;
    this.agentSelected.next(this.agent);
  }

  getAgent() {
    return this.agent;
  }

  openDrawer() {
    this.drawerToggled.next(true);
  }

  closeDrawer() {
    this.drawerToggled.next(false);
  }

  setSuperAgent(superAgentId) {
    this.request.superAgentId = superAgentId;
    this.onChangedRequest();
  }

  setFirstName(firstName) {
    this.request.firstName = firstName;
    this.onChangedRequest();
  }

  setLastName(lastName) {
    this.request.lastName = lastName;
    this.onChangedRequest();
  }

  setContact(simCardInfo) {
    this.request.simCardInfo = simCardInfo;
    this.onChangedRequest();
  }

  setDeviceId(deviceId) {
    this.request.deviceId = deviceId;
    this.onChangedRequest();
  }

  setFeeCategory(feeCategory) {
    this.request.feeCategory = feeCategory;
    this.onChangedRequest();
  }

  setUsername(username) {
    this.request.username = username;
    this.onChangedRequest();
  }

  setPassword(password) {
    this.request.password = password;
    this.onChangedRequest();
  }

  onChangedRequest() {
    this.requestChanged.next(this.request);
  }



}
