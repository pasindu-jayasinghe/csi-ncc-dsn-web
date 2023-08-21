import { Router } from '@angular/router';
import { AlertType } from './../../../shared/alert/alert.component';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { CreateManyProjectProgramDataDto, DataRequestStatus, Documents, DocumentsDocumentOwner, Institution, MasterdataControllerServiceProxy, ProjectDataAssignRequest, ProjectProgramData, ProjectProgramDataControllerServiceProxy, ProjectProgramme, ServiceProxy } from 'src/shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
  selector: 'app-project-program-data-request-approve',
  templateUrl: './project-program-data-request-approve.component.html',
  styleUrls: ['./project-program-data-request-approve.component.scss']
})
export class ProjectProgramDataRequestApproveComponent implements OnInit {

  institutions: Institution[] = [];
  yearList: any[] = [];
  searchBy: any = {
    projectName: "",
    year: null,
    institution: null,
    status: null
  }

  rows: number = 10;
  rowsProposed: number = 10;
  loadingProjects: boolean;
  totalProjectRecords: number = 0;

  projectPrograms: ProjectProgramme[] = [];
  selectedProjectPrograms: ProjectProgramme[] = [];

  loadingRequested: boolean;
  requestedProjectPrograms: ProjectProgramData[] = [];
  selectedRequestedProjectPrograms: ProjectProgramData[] = [];
  totalRequestedProjects: number = 0;

  deadline: Date;
  isDeadLineError: boolean = false;
  invalidDates: Array<Date>
  fromDate: Date = undefined;
  toDate: Date = undefined;

  Number = Number;
  Math = Math;
  requestedDataType1 = "Annual Progress";
  requestedDataType2 = "Status of Operation";

  displayProgressDialog: boolean = false;
  selectedRowToDisplayProgress: any = {};

  statusList: DataRequestStatus[] = [];

  loginUserId: number = 1;

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ProjectProgramData;

  showRejectPop: boolean = false;
  rejectCommentRequried: boolean = false;
  rejectComment: string = "";

  alertHeader: string = "Project/Program Data";
  alertBody: string;
  alerttype: AlertType;

  showAlert: boolean = false;
  isCancel: boolean = false;

  institutionProposed: Institution;
  loading: boolean = false;
  projectProgrammesProposed: ProjectProgramme[];
  totalRecords: number;

  constructor(private serviceProxy: ServiceProxy,
    private subServiceProxy: ProjectProgramDataControllerServiceProxy,
    private masterDataControllerServiceProxy: MasterdataControllerServiceProxy
    , private router: Router) { }

  ngOnInit(): void {
    this.setDropDownData();
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  /**
  * set dropdown data
  */
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
      });

    //statuses
    this.masterDataControllerServiceProxy.getAllDataRequsetStatus().subscribe(res => {
      this.statusList = res;
    })

    //years list
    this.yearList = [];
    let startYear = new Date().getFullYear() - 25;
    for (let i = startYear; i <= startYear + 50; i++) {
      this.yearList.push({ name: i });
    }
  }

  /**
   * search
   */
  search = () => {
    if (!this.searchBy.year || !this.searchBy.institution) {
      //alert("Please select year and institution to search");
      this.DisplayAlert('Please select year and institution to search.', AlertType.Warning);
      return;
    }

    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadRequestedPrograms(event);
  }

  /**
   * search
   */
  searchByStatus = () => {

    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadRequestedPrograms(event);
  }

  /**
   * load list available to request
   * @param event 
   */
  loadProjectPrograms = (event: LazyLoadEvent) => {
    if (!this.searchBy.year || !this.searchBy.institution) {
      return;
    }

    this.selectedProjectPrograms = [];

    this.loadingProjects = true;
    this.projectPrograms = [];
    this.totalProjectRecords = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;

    this.subServiceProxy.getProjectsAvailableForDataRequest(pageNumber, event.rows, this.searchBy.institution.id, this.searchBy.year.name, this.searchBy.projectName).subscribe(res => {
      if (res && res.items && res.items.length > 0) {
        for (let item of res.items) {
          this.setDuration(item);
        }
        this.projectPrograms = res.items;
        this.totalProjectRecords = res.meta.totalItems;
      }
      this.loadingProjects = false;
    });
  }

  /**
   * load requested list
   * @param event 
   */
  loadRequestedPrograms = (event: LazyLoadEvent) => {
    if (!this.searchBy.year || !this.searchBy.institution) {
      return;
    }

    this.loadingRequested = true;
    this.requestedProjectPrograms = [];
    this.selectedRequestedProjectPrograms = [];
    this.totalRequestedProjects = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    let statusId = 0;
    if (this.searchBy.status) {
      statusId = this.searchBy.status.id;
    }

    this.subServiceProxy.getProjectDataRequested(pageNumber, event.rows, this.searchBy.institution.id, this.searchBy.year.name, statusId).subscribe(res => {
      if (res && res.items && res.items.length > 0) {
        for (let item of res.items) {
          this.setDuration(item.projectProgram);
          item["documentList"] = [];
        }
        this.requestedProjectPrograms = res.items;
        this.totalRequestedProjects = res.meta.totalItems;
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

  onPublish() {
    //publish
    this.onApprove();
  }

  /**
   * submit requests
   */
  submitRequests = () => {
    if (!this.deadline) {
      this.isDeadLineError = true;
      return;
    }

    this.loadingProjects = true;
    let requests: ProjectProgramData[] = []

    for (let project of this.selectedProjectPrograms) {

      let projectObj = new ProjectProgramme();
      projectObj.id = project.id;

      let request = new ProjectProgramData();
      request.projectProgram = projectObj;
      request.requestedDate = moment(new Date());
      request.deadline = moment(this.deadline);
      request.year = Number(this.searchBy.year.name),
        request.status = 0;
      request.requestedDataType1 = this.requestedDataType1;
      request.requestedDataType2 = this.requestedDataType2;
      requests.push(request);
    }

    let list = new CreateManyProjectProgramDataDto();
    list.bulk = requests;

    this.serviceProxy.createManyBaseProjectProgramDataControllerProjectProgramData(list).subscribe(res => {
      if (res && res.length > 0) {
        // alert("Request(s) created successfully.");
        this.DisplayAlert('Request(s) created successfully.', AlertType.Message);

        this.search();
      }
    });
  }

  /**
   * on approve click
   */
  onApprove = () => {
    let statusFilter = this.selectedRequestedProjectPrograms.filter(obj => [2].includes(obj.dataRequestStatus.id));
    if (statusFilter.length === 0) {
      //alert("please select records to approve");
      this.DisplayAlert('Please select records to approve.', AlertType.Warning);
      return;
    }

    this.loadingRequested = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = statusFilter.map(obj => obj.id);
    request.tempUserId = this.loginUserId;//TODO remove

    this.subServiceProxy.approveProjectDataFromCCS(request).subscribe(res => {
      if (res) {
        //alert("Approved successfully");
        this.DisplayAlert('Approved successfully.', AlertType.Message);

        this.search();
      } else {
        // alert("Failed to approve");
        this.DisplayAlert('Failed to approve.', AlertType.Error);

      }
      this.loadingRequested = false;
    })
  }

  getsearchProposedFileter() {

    let instutionId = this.institutionProposed ? this.institutionProposed.id : 0;
    let filter: string[] = new Array();
    filter.push('isPendingApprove||$eq||true');
    if (instutionId > 0) {
      filter.push('dataSource.id||$eq||' + instutionId)
    }

    return filter;
  }

  editProjectProgram(ins: ProjectProgramme) {
    this.router.navigate(['/project'], { queryParams: { id: ins.id } });

  }

  searchProposedFileter() {
    let a: any = {};
    a.rows = this.rowsProposed;
    a.first = 0;

    this.loadProposedFileter(a);

  }

  loadProposedFileter(event: LazyLoadEvent) {

    this.loading = true;

    this.serviceProxy.getManyBaseProjectProgramControllerProjectProgramme(undefined,
      undefined,
      this.getsearchProposedFileter(),
      undefined,
      ["name,ASC"],
      ["province", "district", "divisionalSecretariat", "parentInstitution"],
      event.rows, event.first, 0, 0).subscribe(res => {
        this.totalRecords = res.total;
        this.projectProgrammesProposed = res.data;
        this.loading = false;

      });


  }

  onShowCancel() {
    if (this.selectedRequestedProjectPrograms != null && this.selectedRequestedProjectPrograms != undefined && this.selectedRequestedProjectPrograms.length > 0) {
      this.isCancel = true;
      this.showRejectPop = true;

    }
    else {
      //alert("Please select at least one parameter.");
      this.DisplayAlert('Please select at least one parameter.', AlertType.Warning);

    }
  }

  onShowJeject() {
    if (this.selectedRequestedProjectPrograms != null && this.selectedRequestedProjectPrograms != undefined && this.selectedRequestedProjectPrograms.length > 0) {
      this.isCancel = false;
      this.showRejectPop = true;
    }
    else {
      // alert("Please select at least one parameter.");
      this.DisplayAlert('Please select at least one parameter.', AlertType.Warning);

    }
  }

  /**
   * on reject click
   */
  onReject = () => {
    // let statusFilter = this.selectedRequestedProjectPrograms.filter(obj => [2].includes(obj.dataRequestStatus.id));

    // if (statusFilter.length === 0) {
    //   //alert("please select records to reject");
    //   this.DisplayAlert('Please select records to reject.', AlertType.Warning);

    //   return;
    // }

    this.loadingRequested = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = this.selectedRequestedProjectPrograms.map(obj => obj.id);
    request.tempUserId = this.loginUserId;//TODO remove
    request.comment = this.rejectComment;
    if (this.isCancel) {
      this.subServiceProxy.cancelProjectDataFromCCS(request).subscribe(res => {
        if (res) {
          // alert("rejected successfully");

          this.DisplayAlert('Successfully Cancel.', AlertType.Message);
          this.showRejectPop = false;
          this.search();

        } else {
          //alert("failed to reject");
          this.DisplayAlert('Failed to Cancel.', AlertType.Error);

        }
        this.loadingRequested = false;
      })
    }
    else {
      this.subServiceProxy.rejectProjectDataFromCCS(request).subscribe(res => {
        if (res) {
          // alert("rejected successfully");

          this.DisplayAlert('Rejected successfully.', AlertType.Message);
          this.showRejectPop = false;
          this.search();

        } else {
          //alert("failed to reject");
          this.DisplayAlert('Failed to reject.', AlertType.Error);

        }
        this.loadingRequested = false;
      })
    }

  }

  /**
   * show project progress view dialog
   * @param row 
   */
  showProjectProgressDialog = (row: any) => {
    this.selectedRowToDisplayProgress = row;
    this.displayProgressDialog = true;
  }

}
