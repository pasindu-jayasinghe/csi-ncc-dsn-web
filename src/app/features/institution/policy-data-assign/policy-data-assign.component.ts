import { AlertType } from './../../../shared/alert/alert.component';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DataRequestStatus, DocumentsDocumentOwner, Institution, MasterdataControllerServiceProxy, PolicyData, PolicyDataControllerServiceProxy, ProjectDataAssignRequest, ServiceProxy, User } from 'src/shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { RoleGuardService } from 'src/app/auth/role-guard.service';
import { AuthConfigService } from 'src/app/auth/keyclock/auth-config.service';

@Component({
  selector: 'app-policy-data-assign',
  templateUrl: './policy-data-assign.component.html',
  styleUrls: ['./policy-data-assign.component.scss']
})
export class PolicyDataAssignComponent implements OnInit {

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

  institutionId: number = 0;
  institution: Institution;
  institutionList: Institution[] = [];

  loginUserId: number = 2;
  loginUser: User;

  dataRequestList: PolicyData[] = [];
  selectedDataRequestList: PolicyData[] = [];
  dataRequestTotal: number = 0;
  loadingDataRequests: boolean = false;

  dataEntryDeadline: Date;
  dataEntryDeadlineRequiredError: boolean = false;

  reviewDataList: PolicyData[] = [];
  selectedReviewData: PolicyData[] = [];
  totalRecordsReview: number = 0;
  loadingReview: boolean = false;

  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.PolicyData;

  showRejectPop = false;

  rejectComment = "";
  rejectCommentRequried = true;

  influenceNameMap = {
    "1": "National",
    "2": "Provincial",
    "3": "District Level",
    "4": "Specific Locations",
  }

  alertHeader: string = "Policy Data Requests - Assign";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;
  institutionListDisabled = false;
  isCancel: boolean = false;
  isAssignCancel: boolean = false;

  isChangeAssignData: boolean = false;


  constructor(private serviceProxy: ServiceProxy,
    private subServiceProxy: PolicyDataControllerServiceProxy,
    private masterDataControllerServiceProxy: MasterdataControllerServiceProxy,
    private roleGuardService: RoleGuardService, private authService: AuthConfigService) {

  }

  ngOnInit(): void {
    //this.setInstitution();
    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);
    this.loginUserId = this.authService.loginUserId;
    console.log("loginUserId==========", this.loginUserId);
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

  onCancelClick() {
    if (this.selectedReviewData.length === 0) {

      this.DisplayAlert("please select records to reject", AlertType.Warning);
      return;
    }
    this.isCancel = true;
    this.isAssignCancel = false;
    this.showRejectPop = true;
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
        this.searchByUser();
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
          this.searchByUser();

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
    this.loadingDataRequests = true;
    this.dataRequestList = [];
    this.selectedDataRequestList = [];
    this.dataRequestTotal = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;

    this.subServiceProxy
      .getPolicyDataRequestsOfInstitution(pageNumber, event.rows, this.institutionId, this.searchBy.status ? this.searchBy.status.id : 0)
      .subscribe((res) => {
        if (res && res.items && res.items.length > 0) {
          for (let item of res.items) {
            item["documentList"] = [];
          }
          this.dataRequestTotal = res.meta.totalItems;
          this.dataRequestList = res.items;
        }

        this.loadingDataRequests = false;
      });
  };

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
      // alert("please select records to assign");
      this.DisplayAlert('please select records to assign.', AlertType.Warning);

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
      this.DisplayAlert('please fill all the mandatory fields.', AlertType.Warning);

      return;
    }

    this.loadingDataRequests = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = statusFilter.map(obj => obj.id);
    request.dataEntryUser = this.selectedUser;
    request.dataEntryUser = new User();
    request.dataEntryUser.id = this.selectedUser.id;
    request.dataEntryDeadline = moment(this.dataEntryDeadline);
    request.tempUserId = this.authService.loginUserId;//TODO remove


    this.subServiceProxy.assignToPolicyDataEntryUser(request).subscribe(res => {
      if (res) {
        //alert("assigned successfully");
        this.DisplayAlert('Assigned successfully.', AlertType.Message);

        this.search();
      } else {
        //alert("failed to assign");
        this.DisplayAlert('Failed to assign.', AlertType.Error);

      }
      this.loadingDataRequests = false;
    })

  }

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
      .getPolicyDataRequestsOfDataEntryUser(pageNumber, event.rows, this.institutionId, 6, userId)
      .subscribe((res) => {
        if (res && res.items && res.items.length > 0) {
          for (let item of res.items) {
            item["documentList"] = [];
          }
          this.totalRecordsReview = res.meta.totalItems;
          this.reviewDataList = res.items;
        }

        this.loadingReview = false;
      });
  };

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
      //alert("please select records to approve");
      this.DisplayAlert('Please select records to approve.', AlertType.Warning);
      return;
    }

    this.loadingReview = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = this.selectedReviewData.map(obj => obj.id);
    request.tempUserId = this.authService.loginUserId;//TODO remove

    this.subServiceProxy.approvePolicyData(request).subscribe(res => {
      if (res) {
        // alert("approved successfully");
        this.DisplayAlert('Submited to CCS Successfully!', AlertType.Message);

        this.reloadAfterApproveReject();
      } else {
        this.DisplayAlert('Failed to approve', AlertType.Error);

        //alert("failed to approve");
      }
      this.loadingReview = false;
    })
  }

  onShowReject() {

    if (this.selectedReviewData.length === 0) {
      // alert("please select records to reject");
      this.DisplayAlert("please select records to reject", AlertType.Warning);

      return;
    }
    this.isCancel = false;
    this.showRejectPop = true;
  }

  /**
   * on reject click
   */
  onRejectClick = () => {
    // if (this.selectedReviewData.length === 0) {
    //   //alert("please select records to reject");
    //   this.DisplayAlert('Please select records to reject', AlertType.Warning);

    //   return;
    // }

    if (this.rejectComment == "") {
      this.rejectCommentRequried = true;
      return;
    }

    this.loadingReview = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = this.isAssignCancel ? this.selectedDataRequestList.map(obj => obj.id) : this.selectedReviewData.map(obj => obj.id);
    request.tempUserId = this.authService.loginUserId;//TODO remove
    request.comment = this.rejectComment;

    if (this.isCancel) {
      this.subServiceProxy.rejectPolicyDataFromIA(request).subscribe(res => {
        if (res) {
          //alert("rejected successfully");
          this.DisplayAlert('Successfully Rejected.', AlertType.Message);
          this.showRejectPop = false;

          this.reloadAfterApproveReject();
        } else {
          //alert("failed to reject");
          this.DisplayAlert('Failed to reject', AlertType.Error);

        }
        this.loadingReview = false;
      })
    }
    else {
      this.subServiceProxy.rejectPolicyData(request).subscribe(res => {
        if (res) {
          //alert("rejected successfully");
          this.DisplayAlert('Rejected successfully', AlertType.Message);
          this.showRejectPop = false;

          this.reloadAfterApproveReject();
        } else {
          //alert("failed to reject");
          this.DisplayAlert('Failed to reject', AlertType.Error);

        }
        this.loadingReview = false;
      })
    }

  }

  /**
   * show data view dialog
   * @param row 
   */
  showDataDialog = (row: any) => {
    this.selectedRowToDisplayData = row;
    this.displayDataDialog = true;
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
