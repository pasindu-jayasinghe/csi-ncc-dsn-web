import { Policy, PolicyControllerServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { AlertType } from './../../../shared/alert/alert.component';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DataRequestStatus, DocumentsDocumentOwner, Institution, MasterdataControllerServiceProxy, PolicyData, PolicyDataControllerServiceProxy, PolicyDataRequest, ProjectDataAssignRequest, ServiceProxy } from 'src/shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
  selector: 'app-policy-data-request-approve',
  templateUrl: './policy-data-request-approve.component.html',
  styleUrls: ['./policy-data-request-approve.component.scss']
})
export class PolicyDataRequestApproveComponent implements OnInit {

  institutions: Institution[] = [];
  yearList: any[] = [];
  searchBy: any = {
    year: null,
    institution: null,
    status: null
  }

  rows: number = 10;

  loadingInstitutions: boolean;
  totalInstitutionRecords: number = 0;

  institutionsForRequest: Institution[] = [];
  selectedInstitutions: Institution[] = [];

  loadingRequested: boolean;
  requestedPolicyData: PolicyData[] = [];
  selectedRequestedPolicyData: PolicyData[] = [];
  totalRequestedPolicyData: number = 0;

  deadline: Date;
  isDeadLineError: boolean = false;
  invalidDates: Array<Date>
  fromDate: Date = undefined;
  toDate: Date = undefined;

  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};

  statusList: DataRequestStatus[] = [];

  loginUserId: number = 1;
  isCancel: boolean = true;

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.PolicyData;

  influenceNameMap = {
    "1": "National",
    "2": "Provincial",
    "3": "District Level",
    "4": "Specific Locations",
  }


  showRejectPop: boolean = false;
  rejectCommentRequried: boolean = false;
  rejectComment: string = "";

  alertHeader: string = "Policy Data Approve/Reject";
  alertBody: string;
  alerttype: AlertType;

  showAlert: boolean = false;

  institutionProposed: Institution;
  loading: boolean = false;
  policyProposed: Policy[];
  totalRecords: number;
  rowsProposed: number = 10;



  constructor(private serviceProxy: ServiceProxy,
    private masterDataControllerServiceProxy: MasterdataControllerServiceProxy,
    private subServiceProxy: PolicyDataControllerServiceProxy, private policyService: PolicyControllerServiceProxy) { }

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
    for (let i = startYear; i <= startYear + 5040; i++) {
      this.yearList.push({ name: i });
    }
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



  searchProposedFileter() {
    let a: any = {};
    a.rows = this.rowsProposed;
    a.first = 0;

    this.loadProposedFileter(a);

  }

  loadProposedFileter(event: LazyLoadEvent) {

    this.loading = true;
    let instutionId = this.institutionProposed ? this.institutionProposed.id : 0;
    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;



    this.policyService.getPolicyList(pageNumber, event.rows, "", 0, 0, instutionId, "", 1).subscribe(res => {
      this.policyProposed = res.items;
      this.totalRecords = res.meta.totalItems;
      this.loading = false;
      console.log(this.policyProposed)
    }
    );

  }

  /**
   * search
   */
  search = () => {
    if (!this.searchBy.year) {
      //alert("Please select year and institution to search");
      this.DisplayAlert("Please select year and institution to search", AlertType.Warning);
      return;
    }

    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadAvailableInstitutions(event);
    this.loadRequestedPolicy(event);
  }

  /**
   * load list available to request
   * @param event 
   */
  loadAvailableInstitutions = (event: LazyLoadEvent) => {
    if (!this.searchBy.year) {
      return;
    }

    this.selectedInstitutions = [];

    this.loadingInstitutions = true;
    this.institutionsForRequest = [];
    this.totalInstitutionRecords = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;

    this.subServiceProxy.getInstitutionsAvailableForDataRequest(pageNumber, event.rows, this.searchBy.year.name).subscribe(res => {
      if (res && res.items && res.items.length > 0) {
        this.institutionsForRequest = res.items;
        this.totalInstitutionRecords = res.meta.totalItems;
      }
      this.loadingInstitutions = false;
    });
  }

  /**
   * search
   */
  searchByStatus = () => {

    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadRequestedPolicy(event);
  }

  /**
   * load requested list
   * @param event 
   */
  loadRequestedPolicy = (event: LazyLoadEvent) => {
    if (!this.searchBy.year) {
      return;
    }

    this.loadingRequested = true;
    this.requestedPolicyData = [];
    this.selectedRequestedPolicyData = [];
    this.totalRequestedPolicyData = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    let statusId = 0;
    if (this.searchBy.status) {
      statusId = this.searchBy.status.id;
    }
    let institutionId = 0;
    if (this.searchBy.institution) {
      institutionId = this.searchBy.institution.id;
    }

    this.subServiceProxy.getPolicyDataRequested(pageNumber, event.rows, institutionId, this.searchBy.year.name, statusId).subscribe(res => {
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
   * send requests
   */
  submitRequests = () => {
    if (!this.searchBy.year) {
      //alert("Please select year to submit");
      this.DisplayAlert("Please select year to submit", AlertType.Warning);

      return;
    }

    if (!this.deadline) {
      this.isDeadLineError = true;
      return;
    }

    this.loadingInstitutions = true;

    let request = new PolicyDataRequest();
    request.institutionIds = this.selectedInstitutions.map(obj => obj.id);
    request.year = Number(this.searchBy.year.name);
    request.deadline = moment(this.deadline);

    this.subServiceProxy.requestForDataByCCS(request).subscribe(res => {
      if (res) {
        // alert("Request(s) created successfully.");
        this.DisplayAlert("Request(s) created successfully.", AlertType.Message);

        this.search();
      } else {
        this.DisplayAlert("Failed to send request.", AlertType.Error);

        // alert("Failed to send request.");
        this.search();
      }
      this.loadingInstitutions = false;
    });
  }

  /**
   * show data dialog
   * @param policyData 
   */
  showDataDialog(policyData: PolicyData) {
    this.selectedRowToDisplayData = policyData;
    this.displayDataDialog = true;
  }

  /**
   * on approve click
   */
  onApproveClick = () => {
    let statusFilter = this.selectedRequestedPolicyData.filter(obj => [2].includes(obj.dataRequestStatus.id));
    if (statusFilter.length === 0) {
      //alert("please select records to approve");
      this.DisplayAlert("please select records to approve.", AlertType.Warning);

      return;
    }

    this.loadingRequested = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = statusFilter.map(obj => obj.id);
    request.tempUserId = this.loginUserId;//TODO remove

    this.subServiceProxy.approvePolicyDataFromCCS(request).subscribe(res => {
      if (res) {
        // alert("approved successfully");
        this.DisplayAlert("approved successfully.", AlertType.Message);

        this.search();
      } else {
        this.DisplayAlert("failed to approve.", AlertType.Error);

        //alert("failed to approve");
      }
      this.loadingRequested = false;
    })
  }

  onPublish() {
    //publish
    this.onApproveClick();
  }

  /**
   * on reject click
   */
  onReject = () => {
    // let statusFilter = this.selectedRequestedPolicyData.filter(obj => [2].includes(obj.dataRequestStatus.id));

    // if (statusFilter.length === 0) {
    //   // alert("please select records to reject");
    //   this.DisplayAlert("please select records to reject.", AlertType.Warning);

    //   return;
    // }

    this.loadingRequested = true;

    let request = new ProjectDataAssignRequest();
    request.requestIdList = this.selectedRequestedPolicyData.map(obj => obj.id);
    request.tempUserId = this.loginUserId;//TODO remove
    request.comment = this.rejectComment;

    if (this.isCancel) {
      this.subServiceProxy.cancelPolicyDataFromCCS(request).subscribe(res => {
        if (res) {
          // alert("rejected successfully");
          this.showRejectPop = false;
          this.search();
          this.DisplayAlert("Successfully cancel.", AlertType.Message);

        } else {
          // alert("failed to reject");
          this.DisplayAlert("failed to Cancel.", AlertType.Error);

        }
        this.loadingRequested = false;
      })
    }
    else {
      this.subServiceProxy.rejectPolicyDataFromCCS(request).subscribe(res => {
        if (res) {
          // alert("rejected successfully");
          this.showRejectPop = false;
          this.search();
          this.DisplayAlert("rejected successfully.", AlertType.Message);

        } else {
          // alert("failed to reject");
          this.DisplayAlert("failed to reject.", AlertType.Error);

        }
        this.loadingRequested = false;
      })
    }

  }

  onShowCancel() {
    if (this.selectedRequestedPolicyData != null && this.selectedRequestedPolicyData != undefined && this.selectedRequestedPolicyData.length > 0) {
      this.isCancel = true;
      this.showRejectPop = true;
    }
    else {
      //alert("Please select at least one parameter.");
      this.DisplayAlert("Please select at least one parameter.", AlertType.Warning);
    }
  }


  onShowJeject() {
    if (this.selectedRequestedPolicyData != null && this.selectedRequestedPolicyData != undefined && this.selectedRequestedPolicyData.length > 0) {
      this.isCancel = false;
      this.showRejectPop = true;
    }
    else {
      //alert("Please select at least one parameter.");
      this.DisplayAlert("Please select at least one parameter.", AlertType.Warning);
    }
  }

}
