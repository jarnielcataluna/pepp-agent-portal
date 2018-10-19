import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpManagerService } from './services/http-manager.service';
import { AppComponentService } from './app-component.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Palawan Pawnshop';

  events: string[] = [];

  loggedInListener;
  isLoggedIn;

  constructor(
    private auth: HttpManagerService,
    private appService: AppComponentService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.loggedInListener = this.appService.loggedInChanged.subscribe((status) => this.isLoggedIn = status);
  }

  ngOnDestroy() {
    if (this.loggedInListener !== undefined) {
      this.loggedInListener.unsubscribe();
    }

  }


}
