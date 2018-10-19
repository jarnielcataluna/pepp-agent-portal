import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatInput, MatDatepickerInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { TransactionsService } from '../transactions.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Observable, ObjectUnsubscribedError } from '../../../../../node_modules/rxjs';
import { startWith, map } from '../../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-transaction-filter',
  templateUrl: './transaction-filter.component.html',
  styleUrls: ['./transaction-filter.component.css']
})
export class TransactionFilterComponent implements OnInit, OnDestroy {

  agents;
  usernames = [];

  agentsSubscription;
  clearedSubscription;

  @ViewChild('endInput', {
    read: MatInput
  }) endInput: MatInput;

  @ViewChild('startInput', {
    read: MatInput
  }) startInput: MatInput;

  @ViewChild('agentInput', {
    read: MatInput
  }) agentInput: MatInput;

  agentFormControl = new FormControl();

  filteredOptions: Observable<string[]>;

  constructor(
    private transactionService: TransactionsService,
    private utils: UtilitiesService
  ) { }

  ngOnInit() {
    this.getAgents();
    this.listenToClear();
  }

  getAgents() {
    this.agentsSubscription = this.transactionService.agentsChanged.subscribe((data) => {
      this.agents = data;

      if (this.agents !== null || this.agents !== undefined) {
        for (const d of this.agents) {
          this.usernames.push(this.utils.decrypt(d['user']['username']));
        }

        this.filteredOptions = this.agentFormControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
      }

    });
  }

  listenToClear() {
    this.clearedSubscription = this.transactionService.transactionCleared.subscribe((data) => {
      this.startInput.value = '';
      this.endInput.value = '';
      this.agentInput.value = '';
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usernames.filter(option => option.toLowerCase().includes(filterValue));
  }

  resetFilter() {
    this.transactionService.clearTransactionRequest();
    this.agentInput.value = '';
    this._filter(this.agentInput.value);
  }


  dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    const date = event.value.getFullYear() + '-' + this.pad(event.value.getMonth() + 1) + '-' + this.pad(event.value.getDate());
    if (type === 'start') {
      this.transactionService.setRequestStart(date);
    } else {
      this.transactionService.setRequestEnd(date);
    }
  }

  pad(n: number): string {
    return (n < 10) ? ('0' + n) : '' + n;
  }


  agentChanged(event) {
    if (this.usernames.includes(event.target.value)) {
      const agent = this.utils.encrypt(event.target.value);
      this.transactionService.setRequestAgent(agent);
    } else {
      if (event.target.value === '') {
        this.transactionService.setRequestAgent(null);
      } else {
        this.agentInput.value = '';
      }
      this._filter(this.agentInput.value);
    }
  }

  agentSelected(event: MatAutocompleteSelectedEvent) {
    const agent = this.utils.encrypt(event.option.value);
    this.transactionService.setRequestAgent(agent);
  }

  ngOnDestroy() {

    if (this.clearedSubscription !== undefined) {
      this.clearedSubscription.unsubscribe();
    }

    if (this.agentsSubscription !== undefined) {
      this.agentsSubscription.unsubscribe();
    }

  }

}
