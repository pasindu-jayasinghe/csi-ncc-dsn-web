import { async } from '@angular/core/testing';
import { ServiceProxy, InstitutionControllerServiceProxy, RequestSummary, RequestAssignSummary, RecentUpdateSummary } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { Institution } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-institution-home',
  templateUrl: './institution-home.component.html',
  styleUrls: ['./institution-home.component.scss']
})
export class InstitutionHomeComponent implements OnInit {

  instuitutionList: Institution[];
  selctedInstuitution: Institution;

  requestSummary: RequestSummary[];
  requestAssignSummary: RequestAssignSummary[];
  recentUpdateSummary: RecentUpdateSummary[];

  loadingrequestSummary: boolean = false;
  loadingRecentUpdates: boolean = false;
  loadingrequestAssign: boolean = false;

  constructor(private serviceProxy: ServiceProxy, private instutionproxy: InstitutionControllerServiceProxy) {
  }

  async ngOnInit(): Promise<void> {
    await this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined, ["name,ASC"], undefined, 1000, 0, 0, 0).subscribe(res => {
        this.instuitutionList = res.data;
        this.selctedInstuitution = res.data[0];
        this.loadSummary();

      });


  }

  onChangeInstution() {
    this.loadSummary();
  }

  async loadSummary() {
    if (this.selctedInstuitution) {
      this.loadingrequestSummary = true;
      this.loadingRecentUpdates = true;
      this.loadingrequestAssign = true;

      this.instutionproxy.getRequestSummary(this.selctedInstuitution.id).subscribe(res => {
        this.requestSummary = res;
        this.loadingrequestAssign = false;

      });

      this.instutionproxy.getRecentUpdateSummary(this.selctedInstuitution.id).subscribe(res => {
        this.recentUpdateSummary = res;
        this.loadingRecentUpdates = false;

      });


      await this.instutionproxy.getRecentAssignSummary(this.selctedInstuitution.id).subscribe(res => {
        this.requestAssignSummary = res;
        this.loadingrequestSummary = false;
        console.log(this.recentUpdateSummary);
      });

    }
  }

}
