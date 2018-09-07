import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInput, MatSnackBar } from '../../../../node_modules/@angular/material';
import { ApiService } from '../../services/api.service';
import { UtilitiesService } from '../../services/utilities.service';
import { LoginRequestModel } from '../model/login-request.model';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private utils: UtilitiesService,
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  @ViewChild('username', {
    read: MatInput
  }) username: MatInput;

  @ViewChild('password', {
    read: MatInput
  }) password: MatInput;

  ngOnInit() {
  }

  loginUser() {
    const request = new LoginRequestModel();
    request.username = this.utils.encrypt(this.username.value);
    request.password = this.utils.encrypt(this.password.value);
    this.apiService.loginUser(request).then(
      (data) => {
        this.router.navigate(['/']);
      }
    ).catch(
      (error) => {
        this.snackBar.open('Invalid Login Credentials.', null, {
          duration: 2000,
        });
      }
    );
  }

}
