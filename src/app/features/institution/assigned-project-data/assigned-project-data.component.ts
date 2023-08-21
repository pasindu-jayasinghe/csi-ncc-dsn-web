import { AppControllerServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { DataRequestStatus, DocumentsDocumentOwner, Institution, MasterdataControllerServiceProxy, ProjectProgramData, ProjectProgramDataControllerServiceProxy, ServiceProxy, User } from 'src/shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { RoleGuardService } from 'src/app/auth/role-guard.service';

@Component({
  selector: 'app-assigned-project-data',
  templateUrl: './assigned-project-data.component.html',
  styleUrls: ['./assigned-project-data.component.scss']
})
export class AssignedProjectDataComponent implements OnInit {

  statusList: DataRequestStatus[];
  searchBy: any = {
    status: null
  }

  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;

  institutionId: number = 0;
  institution: Institution;

  loginUserId: number = 0;
  loginUser: User;

  dataRequestList: ProjectProgramData[] = [];

  displayProgressDialog: boolean = false;
  selectedRowToDisplayProgress: any = {};

  userList: User[];
  institutionList: Institution[] = [];


  institutionListDisabled = false;
  isDEO = false;

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ProjectProgramData;

  constructor(private serviceProxy: ServiceProxy, private subServiceProxy: ProjectProgramDataControllerServiceProxy,
    private masterDataControllerServiceProxy: MasterdataControllerServiceProxy, private router: Router,
    private roleGuardService: RoleGuardService, private appService: AppControllerServiceProxy) { }

  ngOnInit(): void {

    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);
    this.isDEO = this.roleGuardService.checkRoles(['ins-deo']);

    //this.setInstitution();
    this.setUser();
    this.setDropdownData();
  }

  /**
   * set institution object
   */
  // setInstitution = () =>{
  //   this.serviceProxy.getOneBaseInstitutionControllerInstitution(this.institutionId, undefined, undefined, undefined).subscribe(a => {
  //     this.institution = a;
  //   })
  // }

  /**
   * set user object
   */
  setUser = async () => {
    // await this.serviceProxy.getOneBaseUserv2ControllerUser(this.loginUserId, undefined, undefined, undefined).subscribe(a => {
    //   this.loginUser = a;
    // })

    await this.appService.getUserInfo().subscribe(user => {
      this.loginUser = user;
      this.loginUserId = user.id;
      console.log(this.loginUser);
      // this.setuser()
      // this.searchParameter();
    });
  }

  /**
   * set dropdown data
   */
  setDropdownData = () => {
    //users
    this.serviceProxy.getManyBaseUserv2ControllerUser(undefined,
      undefined,
      undefined,
      undefined,
      ["firstName,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.userList = res.data;
        if (this.isDEO && this.userList.length > 0) {
          this.loginUser = this.userList[0];
          this.loginUserId = this.loginUser.id;
        }
        this.search();
      });

    //institutions
    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.institutionList = res.data;
        if (this.institutionList.length > 0) {
          this.institution = this.institutionList[0];
          this.institutionId = this.institutionList[0].id;
          this.search();
        }
      });

    //statuses
    this.masterDataControllerServiceProxy.getAllDataRequsetStatus().subscribe(res => {
      this.statusList = res;
    })
  }

  /**
   * search
   */
  search = async () => {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadRequestList(event);
  };

  /**
   * on page change event
   * @param event
   */
  loadRequestList = (event: LazyLoadEvent) => {
    this.loading = true;
    this.dataRequestList = [];
    this.totalRecords = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    let statusId = this.searchBy.status ? this.searchBy.status.id : 0;

    this.subServiceProxy
      .getProjectDataRequestsOfDataEntryUser(pageNumber, event.rows, this.institutionId, statusId, this.loginUserId)
      .subscribe((res) => {
        if (res && res.items && res.items.length > 0) {
          for (let item of res.items) {
            this.setDuration(item.projectProgram);
            item["documentList"] = [];
          }
          this.totalRecords = res.meta.totalItems;
          this.dataRequestList = res.items;
        }

        this.loading = false;
      });
  };

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

  /**
   * on click input data
   */
  onClickInputData() {
    this.router.navigate(['/institution-project-data-entry']);
  }

  /**
   * show project progress view dialog
   * @param row 
   */
  showProjectProgressDialog = (row: any) => {
    this.selectedRowToDisplayProgress = row;
    this.displayProgressDialog = true;
  }

  onInstitutionChange = () => {
    if (this.institution) {
      this.institutionId = this.institution.id
    } else {
      this.institutionId = 0;
    }
  }

  onUserChange = () => {
    if (this.loginUser) {
      this.loginUserId = this.loginUser.id
    } else {
      this.loginUserId = 0;
    }
  }

}
