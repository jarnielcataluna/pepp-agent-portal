import { Injectable } from '@angular/core';
import { Subject } from '../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppComponentService {

  isUserLoggedIn = false;
  loggedInChanged = new Subject<boolean>();

  setLoggedIn(status: boolean) {
    this.loggedInChanged.next(status);
  }
}
