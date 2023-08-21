import { LazyLoadEvent } from 'primeng/api';
import { ProjectProgramDataControllerServiceProxy, ProjectProgramme, ServiceProxy, DocumentsDocumentOwner, PolicyData, PolicyDataControllerServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { Institution, MasterdataControllerServiceProxy, User } from 'src/shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { RoleGuardService } from 'src/app/auth/role-guard.service';

@Component({
  selector: 'app-data-request-history-policy',
  templateUrl: './data-request-history-policy.component.html',
  styleUrls: ['./data-request-history-policy.component.scss']
})
export class DataRequestHistoryPolicyComponent implements OnInit {



  institutions: Institution[] = [];
  institution: Institution;
  yearList: any[] = [];
  searchBy: any = {
    projectName: "",
    fromYear: null,
    toYear: null,
    institution: null,
    status: null
  }

  rows: number = 10;
  loadingRequested: boolean;
  requestedPolicyData: PolicyData[] = [];
  totalRequestedPolicyData: number = 0;



  requestedProjectPrograms: ProjectProgramme[] = [];
  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};

  loginUserId: number = 1;
  loginUser: User;

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.Policy;

  influenceNameMap = {
    "1": "National",
    "2": "Provincial",
    "3": "District Level",
    "4": "Specific Locations",
  }






  institutionListDisabled = false;

  constructor(private serviceProxy: ServiceProxy, private subServiceProxy: PolicyDataControllerServiceProxy,
    private masterDataControllerServiceProxy: MasterdataControllerServiceProxy,
    private roleGuardService: RoleGuardService) { }



  async ngOnInit(): Promise<void> {

    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);

    this.setDropDownData();

    await this.serviceProxy.getOneBaseUserv2ControllerUser(this.loginUserId, undefined, undefined, undefined).subscribe(a => {
      this.loginUser = a;
    })
  }

  setDropDownData = () => {

    //institutions
    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.institutions = res.data;
        if (this.institutions.length > 0) {
          this.searchBy.institution = this.institutions[0];
          this.search();
        }
      });



    //years list
    this.yearList = [];
    let startYear = new Date().getFullYear() - 25;
    for (let i = startYear; i <= startYear + 50; i++) {
      this.yearList.push({ name: i });
    }
  }

  onInstutionChange() {
    this.search();
  }

  search = () => {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadRequestedPolicy(event);
  }

  loadRequestedPolicy = (event: LazyLoadEvent) => {
    if (!this.searchBy.institution) {
      return;
    }


    this.loadingRequested = true;
    this.requestedPolicyData = [];
    this.totalRequestedPolicyData = 0;

    let fromyear = this.searchBy.fromYear ? this.searchBy.fromYear.name : 0;
    let toYear = this.searchBy.toYear ? this.searchBy.toYear.name : 0;


    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    let statusId = 0;

    console.log(this.searchBy.institution.id);
    console.log(fromyear);
    console.log(toYear);




    this.subServiceProxy.getRequestsListforHistory(pageNumber, event.rows, this.searchBy.institution.id, fromyear, toYear).subscribe(res => {
      if (res && res.items && res.items.length > 0) {
        for (let item of res.items) {
          item["documentList"] = [];
        }
        this.requestedPolicyData = res.items;
        this.totalRequestedPolicyData = res.meta.totalItems;
      }
      this.loadingRequested = false;
    });
  }

  /**
  * set duration of project
  * @param row 
  */
  setDuration = (row: any) => {
    if (row.projectDuration) {
      row["duration"] = `${moment(new Date(row.proposedDateOfCommence)).year()} - ${moment(new Date(row.proposedDateOfCommence)).add(Number(row.projectDuration) * 12, 'M').year()}`;
    } else {
      row["duration"] = `${moment(new Date(row.proposedDateOfCommence)).year()} - ${moment(new Date(row.proposedDateOfCommence)).year()}`;
    }
  }


  showDataDialog(policyData: PolicyData) {
    this.selectedRowToDisplayData = policyData;
    this.displayDataDialog = true;
  }

}
