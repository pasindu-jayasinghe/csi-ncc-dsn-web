import { MasterdataControllerServiceProxy, Parameter } from 'src/shared/service-proxies/service-proxies';
import { DataRequestStatusHistory, ParameterLocationData } from './../../../shared/service-proxies/service-proxies';
import { DocumentUploadComponent } from './../document-upload/document-upload.component';
import { MessageService } from 'primeng/api';
import { Component, Input, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-status-history',
  templateUrl: './status-history.component.html',
  styleUrls: ['./status-history.component.scss']
})
export class StatusHistoryComponent implements OnInit {

  statusHistory: DataRequestStatusHistory[];
  parameterId: number;

  constructor(public config: DynamicDialogConfig, private masterdataService: MasterdataControllerServiceProxy,) {
    this.parameterId = config.data.id;
  }

  ngOnInit(): void {

    this.masterdataService.getDataRequsetHistory(this.parameterId).subscribe(result => {
      this.statusHistory = result;
      console.log(this.statusHistory[0].parameterLocationData);

    })
  }





}
