import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '../../../../../node_modules/@angular/router';
import { HttpManagerService } from '../../../services/http-manager.service';
import { AppComponentService } from '../../../app-component.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  // { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/transactions', title: 'Transactions', icon: 'content_paste', class: '' },
  { path: '/super-agents', title: 'Super Agents', icon: 'supervisor_account', class: '' },
  { path: '/agents', title: 'Agents', icon: 'person', class: '' },
  { path: '/core-config', title: 'Core Config', icon: 'settings', class: '' },
  // { path: '/helpers', title: 'Helpers', icon: 'bubble_chart', class: '' },
  // { path: '/notifications', title: 'Notification', icon: 'send', class: '' },
];

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SideBarComponent implements OnInit {

  menuItems: any[];

  constructor(
    private router: Router,
    private httpManager: HttpManagerService,
    private appService: AppComponentService
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  logOff() {
    this.appService.setLoggedIn(false);
    this.httpManager.logout();
    this.router.navigate(['/login']);
  }

}
