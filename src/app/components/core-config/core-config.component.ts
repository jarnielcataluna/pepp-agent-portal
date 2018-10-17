import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ConfigRequestModel } from '../models/config-request.model';
import { deserialize } from '../../../../node_modules/json-typescript-mapper';
import { MatSnackBar } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-core-config',
  templateUrl: './core-config.component.html',
  styleUrls: ['./core-config.component.css']
})
export class CoreConfigComponent implements OnInit {

  config = new ConfigRequestModel();

  constructor(
    private apiService: ApiService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    console.log();
    this.apiService.getConfiguration().then(
      (data) => {
        this.config = deserialize(ConfigRequestModel, data);
        console.log(this.config);
      }
    );
  }

  saveConfig() {
    this.apiService.updateConfiguration(this.config).then(
      (data) => {
        this.config = deserialize(ConfigRequestModel, data);
        this.openSnackBar('successfully updated commissions!');
      }, (error) => {
        this.openSnackBar(error.error.error_message);
      }
    ).catch((err) => {
      this.openSnackBar('Opps! something went wrong');
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
    });
  }

}
