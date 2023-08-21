import { LazyLoadEvent } from 'primeng/api';
import { DocumentControllerServiceProxy, Documents } from './../../../../../shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Policy, ServiceProxy, PolicyData, DocumentsDocumentOwner } from 'src/shared/service-proxies/service-proxies';
import { __awaiter } from 'tslib';

@Component({
  selector: 'app-policy-view-info',
  templateUrl: './policy-view-info.component.html',
  styleUrls: ['./policy-view-info.component.scss']
})
export class PolicyViewInfoComponent implements OnInit {

  policyId: number;
  policy: Policy;
  policyData: PolicyData[];
  docLoading: boolean;
  policydoucmentList: Documents[];

  constructor(private route: ActivatedRoute, private serviceProxy: ServiceProxy, private docService: DocumentControllerServiceProxy) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(async params => {
      this.policyId = params['id'];
      await this.getPolicy();
      this.getPolicyData();
    })
  }

  async loadDocments(event: LazyLoadEvent) {
    this.docLoading = true;
    await this.docService.getDocuments(this.policyId, DocumentsDocumentOwner.Policy).subscribe((res) => {
      this.policydoucmentList = res;
      this.docLoading = false;
    }, (err) => console.log(err))


  }

  async getPolicyData() {
    let filter: string[] = ['policy.id||$eq||' + this.policyId, 'dataRequestStatus.id||$eq||7', 'isPendingApprove||$eq||0'];
    this.serviceProxy.getManyBasePolicyDataControllerPolicyData(undefined, undefined, filter,
      undefined, ["name,ASC"], ["policy", "dataRequestStatus", "sector"], 1000, 0, 0, 0).subscribe(async res => {
        this.policyData = res.data;
        for (const a of this.policyData) {
          // await this.loadDocumnts(a.id, DocumentsDocumentOwner.PolicyData).then(b => {
          //   a.documents = b;
          //   console.log(a.id + "=============");
          //   console.log(a.documents)
          // }
          // );

          await this.docService.getDocuments(a.id, DocumentsDocumentOwner.PolicyData).subscribe((res) => {
            a.documents = res;
            console.log("=============");
            console.log(res)
            console.log(a)
          }, (err) => console.log(err))

        }
        // this.projectDate.forEach(async a => {

        // })

      })
  }

  async loadDocumnts(ownwerId: number, documentOwner: DocumentsDocumentOwner): Promise<Documents[]> {
    let documents: Documents[] = new Array();
    await this.docService.getDocuments(ownwerId, documentOwner).subscribe((res) => {
      documents = res;
      console.log(documents);
    }, (err) => console.log(err))

    return documents;
  }

  async getPolicy() {
    await this.serviceProxy.getOneBasePolicyControllerPolicy(this.policyId, undefined, undefined, 0).subscribe(res => {
      if (res.isPendingApprove) {
        return;
      }
      this.policy = res;
      // this.projectProgrammeType = res.isProject ? "Project" : "Programme";
      // this.proposedDate = new Date(this.project.proposedDateOfCommence.toISOString());

      // this.projectCurrentStatus = new Date(moment(this.project.proposedDateOfCommence, "YYYY-MM-DDTHH:mm:ssZ").add(1, 'y').toISOString()) < new Date()
      //   ? "Operational" : "Closed"

    });
  }

}
