import { promise } from 'protractor';
import { LazyLoadEvent } from 'primeng/api';
import { DocumentControllerServiceProxy, Documents, ProjectProgramData, PublicControllerServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ServiceProxy, ProjectProgramme, DocumentsDocumentOwner } from 'src/shared/service-proxies/service-proxies';
import * as moment from 'moment';


@Component({
  selector: 'app-project-view-info',
  templateUrl: './project-view-info.component.html',
  styleUrls: ['./project-view-info.component.scss']
})
export class ProjectViewInfoComponent implements OnInit {

  projectId: number;
  project: ProjectProgramme;
  projectProgrammeType: string;
  proposedDate: Date;
  projectCurrentStatus: string;

  projectDate: ProjectProgramData[];

  projectdoucmentList: Documents[];
  projectDocLoading: boolean;

  constructor(private route: ActivatedRoute, private serviceProxy: ServiceProxy,
    private docService: DocumentControllerServiceProxy, private publicService: PublicControllerServiceProxy) { }

  async ngOnInit(): Promise<void> {

    this.route.queryParams.subscribe(async params => {
      this.projectId = params['id'];
      await this.getProject();
      this.getProjectData();
    })


  }

  async getProjectData() {
    let filter: string[] = ['projectProgram.id||$eq||' + this.projectId, 'dataRequestStatus.id||$eq||7', 'isPendingApprove||$eq||0'];
    this.serviceProxy.getManyBaseProjectProgramDataControllerProjectProgramData(undefined, undefined, filter,
      undefined, ["name,ASC"], ["projectProgram", 'dataRequestStatus'], 1000, 0, 0, 0).subscribe(async res => {
        this.projectDate = res.data;
        for (const a of this.projectDate) {
          await this.docService.getDocuments(a.id, DocumentsDocumentOwner.ProjectProgramData).subscribe((res) => {
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

  async loadDocments(event: LazyLoadEvent) {
    this.projectDocLoading = true;
    await this.docService.getDocuments(this.projectId, DocumentsDocumentOwner.ProjectProgramme).subscribe((res) => {
      this.projectdoucmentList = res;
      this.projectDocLoading = false;
    }, (err) => console.log(err))


  }

  async loadProjectDocumnts(ownwerId: number, documentOwner: DocumentsDocumentOwner): Promise<Documents[]> {
    let documents: Documents[] = new Array();
    await this.docService.getDocuments(ownwerId, documentOwner).subscribe((res) => {
      documents = res;
      console.log(documents);
    }, (err) => console.log(err))

    return documents;
  }

  async getProject() {
    await this.serviceProxy.getOneBaseProjectProgramControllerProjectProgramme(this.projectId, undefined, undefined, 0).subscribe(res => {
      if (res.isPendingApprove) {
        return;
      }
      this.project = res;
      this.projectProgrammeType = res.isProject ? "Project" : "Programme";
      this.proposedDate = new Date(this.project.proposedDateOfCommence.toISOString());

      this.projectCurrentStatus = new Date(moment(this.project.proposedDateOfCommence, "YYYY-MM-DDTHH:mm:ssZ").add(1, 'y').toISOString()) < new Date()
        ? "Operational" : "Closed"

    });

    // await this.publicService.getProjectViewinfo(this.projectId).subscribe(res => {
    //   console.log(res)
    //   this.project = res;
    //   this.projectProgrammeType = res.isProject ? "Project" : "Programme";
    //   this.proposedDate = new Date(this.project.proposedDateOfCommence.toISOString());

    //   this.projectCurrentStatus = new Date(moment(this.project.proposedDateOfCommence, "YYYY-MM-DDTHH:mm:ssZ").add(1, 'y').toISOString()) < new Date()
    //     ? "Operational" : "Closed"
    // });
  }

}
