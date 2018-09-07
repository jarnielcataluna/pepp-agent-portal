import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { HttpManagerService } from '../../services/http-manager.service';
import { ApiService } from '../../services/api.service';
import { UtilitiesService } from '../../services/utilities.service';
import { MatSnackBar, MatDialog } from '../../../../node_modules/@angular/material';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {

  constructor(
    private router: Router,
    private httpManager: HttpManagerService,
    private apiService: ApiService,
    private utils: UtilitiesService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  agents;

  ngOnInit() {
    this.apiService.getAgents()
      .then((data) => {
        console.log(data);
        this.agents = data;
      })
      .catch((error) => {
        this.openSnackBar(error.error.error_message);
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  deactivate(agent: string) {
    this.apiService.deactivateAgent(this.utils.decrypt(agent)).then(
      (data) => {
        this.openSnackBar(JSON.stringify(data));
      }
    ).catch(
      (error) => {
        let message: string;
        if (error.error.text) {
          message = error.error.text;
        } else {
          message = error.message;
        }

        this.openSnackBar(message);
      }
    ).then(() => {
      this.apiService.getAgents()
        .then((agents) => {
          this.agents = agents;
        })
        .catch((error) => {
          this.openSnackBar(error.error.error_message);
        });
    });
  }


  activate(agent: string) {
    this.apiService.activateAgent(this.utils.decrypt(agent)).then(
      (data) => {
        this.openSnackBar(JSON.stringify(data));
      }
    ).catch(
      (error) => {
        let message: string;
        if (error.error.text) {
          message = error.error.text;
        } else {
          message = error.message;
        }
        this.openSnackBar(message);
      }
    ).then(() => {
      this.apiService.getAgents()
        .then((agents) => {
          this.agents = agents;
        })
        .catch((error) => {
          this.openSnackBar(error.error.error_message);
        });
    });
  }

  logOff() {
    this.httpManager.logout();
    this.router.navigate(['/login']);
  }


}
