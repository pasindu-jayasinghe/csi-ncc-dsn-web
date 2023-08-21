import { LazyLoadEvent } from 'primeng/api';
import { ServiceProxy, User, DatarequestStatusHistoryControllerServiceProxy, DataRequestStatusHistory } from './../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  featureList: { id: number, name: string }[] = [{ id: 1, name: "Parameter" }, { id: 2, name: "Project" }, { id: 3, name: "Policy" }]
  selectedFeature: { id: number, name: string };

  userList: User[];
  selectedUser: User;

  fromDate: Date = undefined;
  toDate: Date = undefined;

  pagePerRow: number = 10;
  pageNumber: number;
  loading: boolean = false;
  items: DataRequestStatusHistory[];

  totalRecords: number = 0;




  constructor(private serviceProxy: ServiceProxy, private datarequestStatusHistoryServiceProxy: DatarequestStatusHistoryControllerServiceProxy) { }


  async ngOnInit(): Promise<void> {

    await this.serviceProxy.getManyBaseUserv2ControllerUser(undefined,
      undefined,
      undefined,
      undefined,
      ["firstName,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.userList = res.data;
      });

  }


  search() {
    this.getDetails(1);
  }

  getDetails(pageNumber: number) {
    let featureId = this.selectedFeature ? this.selectedFeature.id : 0;
    let userId = this.selectedUser ? this.selectedUser.id : 0;
    let from = this.fromDate ? this.fromDate : new Date(0, 0, 0, 0);
    let to = this.toDate ? this.toDate : new Date(0, 0, 0, 0);

    this.loading = true;

    this.datarequestStatusHistoryServiceProxy.getAuditDetails(pageNumber, this.pagePerRow, featureId, userId, from, to).subscribe(a => {
      this.items = a.items;
      this.loading = false;
      this.totalRecords = a.meta.totalItems;
    }
    )
  }

  loadAuditDetails(event: LazyLoadEvent) {
    this.pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    this.pagePerRow = event.rows;
    this.getDetails(this.pageNumber);

  }

}
