import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { DataRequestStatus, DocumentsDocumentOwner, Institution, MasterdataControllerServiceProxy, ProjectDataAssignRequest, ProjectProgramData, ProjectProgramDataControllerServiceProxy, ServiceProxy, User } from 'src/shared/service-proxies/service-proxies';
import * as moment from "moment";
import { AlertType } from 'src/app/shared/alert/alert.component';
import { RoleGuardService } from 'src/app/auth/role-guard.service';
import { AuthConfigService } from 'src/app/auth/keyclock/auth-config.service';

@Component({
  selector: 'app-project-data-assign',
  templateUrl: './project-data-assign.component.html',
  styleUrls: ['./project-data-assign.component.scss']
})
export class ProjectDataAssignComponent implements OnInit {

  minDate = new Date();
  rows: number = 10;


  statusList: DataRequestStatus[] = [];
  searchBy: any = {
    status: null,
    user: null
  }

  userList: User[];
  selectedUser: User;
  userRequiredError: boolean = false;

  institutionId: number = -1;
  institution: Institution;
  institutionList: Institution[] = [];

  loginUserId: number = 0;
  loginUser: User;

  dataRequestList: ProjectProgramData[] = [];
  selectedDataRequestList: ProjectProgramData[] = [];
  dataRequestTotal: number = 0;
  loadingDataRequests: boolean = false;

  dataEntryDeadline: Date;
  dataEntryDeadlineRequiredError: boolean = false;

  reviewDataList: ProjectProgramData[] = [];
  selectedReviewData: ProjectProgramData[] = [];
  totalRecordsReview: number = 0;
  loadingReview: boolean = false;

  displayProgressDialog: boolean = false;
  selectedRowToDisplayProgress: any = {};

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ProjectProgramData;

  alertHeader: string = "Project/Programme Data Assign";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  isChangeAssignData: boolean = false;


  rejectComment = "";
  rejectCommentRequried = true;
  showRejectPop = false;
  institutionListDisabled = false;

  isCancel = true;
  isAssignCancel = false;


  constructor(private serviceProxy: ServiceProxy, private subServiceProxy: ProjectProgramDataControllerServiceProxy,
    private masterDataControllerServiceProxy: MasterdataControllerServiceProxy,
    private roleGuardService: RoleGuardService,
    private authService: AuthConfigService, private confirmationService: ConfirmationService) {
    this.loginUserId = this.authService.loginUserId;
  }

  ngOnInit(): void {


    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);


    //this.setInstitution();
    this.setUser();
    this.setDropdownData();
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  /**
   * set institution object
   */
  // setInstitution = () => {
  //   this.serviceProxy.getOneBaseInstitutionControllerInstitution(this.institutionId, undefined, undefined, undefined).subscribe(a => {
  //     this.institution = a;
  //   })
  // }

  /**
   * set user object
   */
  setUser = () => {
    this.serviceProxy.getOneBaseUserv2ControllerUser(this.loginUserId, undefined, undefined, undefined).subscribe(a => {
      this.loginUser = a;
    })
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
          this.institutionId = this.institutionList[0].id;
          this.institution = this.institutionList[0];
          this.reloadAfterApproveReject();
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


  isShowDelay() {
    let showDelay = false;

    if (this.selectedDataRequestList && this.selectedDataRequestList.length > 0) {

      var min = this.selectedDataRequestList.reduce(function (a, b) { return a.deadline < b.deadline ? a : b; })

      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
      console.log(min.deadline);
      console.log(this.dataEntryDeadline ? moment(this.dataEntryDeadline, "YYYY-MM-DDTHH:mm:ssZ").diff(min.deadline, 'minutes') : "");

      if (this.dataEntryDeadline && moment(this.dataEntryDeadline, "YYYY-MM-DDTHH:mm:ssZ").diff(min.deadline, 'minutes') > 0) {
        showDelay = true;
      }

    }

    return showDelay;
  }

  /**
   * on page change event
   * @param event
   */
  loadRequestList = (event: LazyLoadEvent) => {
    this.loadingDataRequests = true;
    this.dataRequestList = [];
    this.selectedDataRequestList = [];
    this.dataRequestTotal = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;

    this.subServiceProxy
      .getProjectDataRequestsOfInstitution(pageNumber, event.rows, this.institutionId, this.searchBy.status ? this.searchBy.status.id : 0)
      .subscribe((res) => {
        if (res && res.items && res.items.length > 0) {
          for (let item of res.items) {
            this.setDuration(item.projectProgram);
            item["documentList"] = [];
          }
          this.dataRequestTotal = res.meta.totalItems;
          this.dataRequestList = res.items;
        }

        this.loadingDataRequests = false;
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

  onAssignCancelClick() {
    if (this.selectedDataRequestList != null && this.selectedDataRequestList != undefined && this.selectedDataRequestList.length != 0) {
      this.isCancel = true;
      this.isAssignCancel = true;
      this.showRejectPop = true;
    }
    else {
      // alert("Please select at least one parameter.");
      this.DisplayAlert('Please select at least one record.', AlertType.Warning);
    }
  }

  /**
   * assign to data entry users
   */
  assignRequests = () => {
    let statusFilter = this.selectedDataRequestList.filter(obj => [1,3, 5,6,9].includes(obj.dataRequestStatus.id))
    if (statusFilter.length == 0) {
      //alert("please select records to assign");
      this.DisplayAlert("Please select records to assign", AlertType.Warning);

      return;
    }

    let isMandatoryError = false;
    if (!this.selectedUser) {
      isMandatoryError = true;
      this.userRequiredError = true;
    }

    if (!this.dataEntryDeadline) {
      isMandatoryError = true;
      this.dataEntryDeadlineRequiredError = true;
    }

    if (isMandatoryError) {
      // alert("please fill all the mandatory fields");
      this.DisplayAlert("please fill all the mandatory fields", AlertType.Warning);

      return;
    }

    this.loadingDataRequests = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = statusFilter.map(obj => obj.id);
    let userTemp = new User();
    userTemp.id = this.selectedUser.id;
    request.dataEntryUser = userTemp;
    request.dataEntryDeadline = moment(this.dataEntryDeadline);
    request.tempUserId = this.loginUserId;//TODO remove

    this.subServiceProxy.assignToProjectDataEntryUser(request).subscribe(res => {
      if (res) {
        //alert("Assigned successfully");
        this.DisplayAlert("Assigned successfully.", AlertType.Message);

        this.search();
      } else {
        //alert("Failed to assign");
        this.DisplayAlert("Failed to assign.", AlertType.Error);

      }
      this.loadingDataRequests = false;
    })

  }

  /**
   * search by user
   */
  searchByUser = async () => {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadReviewData(event);
  };

  /**
   * on page change event
   * @param event
   */
  loadReviewData = (event: LazyLoadEvent) => {
    this.loadingReview = true;
    this.reviewDataList = [];
    this.selectedReviewData = [];
    this.totalRecordsReview = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    let userId = 0;
    if (this.searchBy.user) {
      userId = this.searchBy.user.id;
    }

    this.subServiceProxy
      .getProjectDataRequestsOfDataEntryUser(pageNumber, event.rows, this.institutionId, 6, userId)
      .subscribe((res) => {
        if (res && res.items && res.items.length > 0) {
          for (let item of res.items) {
            this.setDuration(item.projectProgram);
            item["documentList"] = [];
          }
          this.totalRecordsReview = res.meta.totalItems;
          this.reviewDataList = res.items;
        }

        this.loadingReview = false;
      });
  };

  onShowReject() {

    if (this.selectedReviewData.length === 0) {
      this.DisplayAlert("please select records to reject", AlertType.Warning);
      return;
    }
    this.isCancel = false;
    this.showRejectPop = true;
  }

  /**
   * reload data after approve/reject
   */
  reloadAfterApproveReject = () => {
    //reload first tab data
    this.search();

    //reload review data
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadReviewData(event);
  }

  /**
   * on approve click
   */
  onApproveClick = () => {
    if (this.selectedReviewData.length === 0) {
      // alert("please select records to approve");
      this.DisplayAlert("Please select records to approve.", AlertType.Warning);

      return;
    }

    this.loadingReview = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = this.selectedReviewData.map(obj => obj.id);
    request.tempUserId = this.loginUserId;//TODO remove

    this.subServiceProxy.approveProjectData(request).subscribe(res => {
      if (res) {
        // alert("Approved successfully");
        this.DisplayAlert("Approved successfully.", AlertType.Message);

        this.reloadAfterApproveReject();
      } else {
        //alert("Failed to approve");
        this.DisplayAlert("Failed to approve.", AlertType.Error);

      }
      this.loadingReview = false;
    })
  }

  onCancelClick() {
    if (this.selectedReviewData.length === 0) {
      //alert("aaa");

      // this.confirmationService.confirm({
      //   message: "please select records to reject",
      //   header: 'Confirmation',
      //   //acceptIcon: 'icon-not-visible',
      //   rejectIcon: 'icon-not-visible',
      //   rejectVisible: false,
      //   acceptLabel: "Ok",
      //   accept: () => {
      //   },

      //   reject: () => {

      //   },

      // });
      this.DisplayAlert("please select records to reject", AlertType.Warning);
      return;
    }
    this.isCancel = true;
    this.isAssignCancel = false;
    this.showRejectPop = true;
  }

  /**
   * on reject click
   */
  onRejectClick = () => {
    // if (this.selectedReviewData.length === 0) {
    //   //alert("please select records to reject");
    //   this.DisplayAlert("Please select records to rejecte.", AlertType.Warning);

    //   return;
    // }

    if (this.rejectComment == "") {
      this.rejectCommentRequried = true;
      return;
    }

    this.loadingReview = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = this.isAssignCancel ? this.selectedDataRequestList.map(obj => obj.id) : this.selectedReviewData.map(obj => obj.id);
    request.tempUserId = this.loginUserId;//TODO remove
    request.comment = this.rejectComment;

    if (this.isCancel) {
      this.subServiceProxy.rejectProjectDataFromIA(request).subscribe(res => {
        if (res) {
          // alert("rejected successfully");
          this.showRejectPop = false;

          this.DisplayAlert("Successfully Rejected.", AlertType.Message);

          this.reloadAfterApproveReject();
        } else {
          //alert("failed to reject");
          this.DisplayAlert("Failed to reject.", AlertType.Error);

        }
        this.loadingReview = false;
      })
    }
    else {
      this.subServiceProxy.rejectProjectData(request).subscribe(res => {
        if (res) {
          // alert("rejected successfully");
          this.showRejectPop = false;

          this.DisplayAlert("Rejected and reassigned successfully.", AlertType.Message);

          this.reloadAfterApproveReject();
        } else {
          //alert("failed to reject");
          this.DisplayAlert("Failed to reject.", AlertType.Error);

        }
        this.loadingReview = false;
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

  onInstitutionChange = () => {
    if (this.institution) {
      this.institutionId = this.institution.id
    } else {
      this.institutionId = 0;
    }

    this.search();
    this.searchByUser();

  }

}
