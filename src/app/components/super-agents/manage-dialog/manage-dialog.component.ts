import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SuperAgentRequestModel } from '../../../models/requests/super-agent-request.model';
import { ApiService } from '../../../services/api.service';
import { SuperAgentsService } from '../super-agents.service';

@Component({
    selector: 'app-super-agent-manage-dialog',
    templateUrl: './manage-dialog.component.html',
    styleUrls: ['./manage-dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SuperAgentManageDialogComponent implements OnInit {

    type = 'New';

    constructor(
        private superAgentService: SuperAgentsService,
        private apiService: ApiService,
        private utilityService: UtilitiesService,
        public dialogRef: MatDialogRef<SuperAgentManageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {}
    ) { }

    name;
    contact;
    address;
    username;
    password;

    isSubmitting = false;

    request: SuperAgentRequestModel;

    ngOnInit() {
        if (this.data !== null) {
            this.type = 'Update';
            this.name = this.utilityService.decrypt(this.data['name']);
            this.contact = this.utilityService.decrypt(this.data['contact']);
            this.address = this.utilityService.decrypt(this.data['address']);
            this.username = this.utilityService.decrypt(this.data['user'].username);
        }
    }

    createSuperAgent() {
        this.isSubmitting = true;
        this.request = new SuperAgentRequestModel();
        this.request.name = this.name;
        this.request.contact = this.contact;
        this.request.address = this.address;
        this.request.username = this.username;
        this.request.password = this.password;

        this.apiService.createSuperAgent(this.request).then((data) => {
            this.superAgentService.addSuperAgent(data);
            this.dialogRef.close('Successfully Added Super Agent');
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.isSubmitting = false;
        });
    }

    updateSuperAgent() {
        this.isSubmitting = true;
        this.request = new SuperAgentRequestModel();
        this.request.name = this.name;
        this.request.contact = this.contact;
        this.request.address = this.address;
        this.request.username = this.username;
        this.request.password = this.password;

        console.log(this.request);

        this.apiService.updateSuperAgent(this.request).then((data) => {
            this.superAgentService.updateSuperAgent(data['id'], data);
            this.superAgentService.selectSuperAgent(data);
            this.dialogRef.close('Successfully Updated Super Agent');
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.isSubmitting = false;
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
