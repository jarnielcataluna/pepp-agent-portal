import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperAgentsService {

  private superAgents = [];

  superAgentsChanged = new Subject<Object[]>();
  superAgentSelected = new Subject<Object>();

  constructor() { }

  setSuperAgents(superAgents) {
    this.superAgents = superAgents;
    this.getSuperAgents();
  }

  getSuperAgents() {
    this.superAgentsChanged.next(this.superAgents.slice());
  }

  addSuperAgent(superAgent: Object) {
    this.superAgents.push(superAgent);
    this.getSuperAgents();
  }

  updateSuperAgent(id: number, superAgent: Object) {
    const index = this.superAgents.findIndex(s => s.id === id);
    this.superAgents[index] = superAgent;
    this.getSuperAgents();
  }

  removeSuperAgent(id: number) {
    const index = this.superAgents.findIndex(s => s.id === id);
    this.superAgents.splice(index, 1);
    this.getSuperAgents();
  }

  selectSuperAgent(superAgent) {
    this.superAgentSelected.next(superAgent);
  }

}
