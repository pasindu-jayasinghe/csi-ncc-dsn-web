import { AlertType } from './../../../shared/alert/alert.component';
import { Subject } from 'rxjs';
import { promise } from 'protractor';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { ParameterLocationData, ParameterControllerServiceProxy, DataRequestStatus, DataRequestStatusStatus, MasterdataControllerServiceProxy, Institution, User, DocumentsDocumentOwner } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { RoleGuardService } from 'src/app/auth/role-guard.service';
import { AuthConfigService } from 'src/app/auth/keyclock/auth-config.service';


@Component({
  selector: 'app-data-assign',
  templateUrl: './data-assign.component.html',
  styleUrls: ['./data-assign.component.scss']
})
export class DataAssignComponent implements OnInit {

  deadline: Date;
  parameterLocationData: ParameterLocationData[];
  selectedParameterLocationData: ParameterLocationData[];

  parameterApproveLocationData: ParameterLocationData[];
  selectedApproveParameterLocationData: ParameterLocationData[];

  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;
  pageNumber: number;
  numberofRecodesPerPage: number;

  rowsApprove: number = 10;
  loadingApprove: boolean;
  totalRecordsApprove: number = 0;
  pageNumberApprove: number;
  numberofRecodesPerPageApprove: number;

  userList: User[];
  selectedUser: User;

  institutionList: Institution[];
  instutionId: number = 0;
  institution: Institution;

  loginUserId: number = 1;
  loginUser: User;

  userRequired: boolean = false;
  deadlineRequired: boolean = false;

  statusList: DataRequestStatus[];
  selectedStatus: DataRequestStatus;

  eventsSubject: Subject<number> = new Subject<number>();

  showRejectPop: boolean = false;
  rejectComment: string = "";
  rejectCommentRequried: boolean = false;

  minDate = new Date();

  alertHeader: string = "Data Entry Requests";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;
  institutionListDisabled = false;
  isDEO = false;

  popupContetnt: string = "";
  showDelay: boolean = false;
  isChangeAssignData: boolean = false;

  isCancel: boolean;
  isAssignCancel: boolean;
  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};
  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ParameterLocationData;



  constructor(private serviceProxy: ServiceProxy,
    private parameterProxy: ParameterControllerServiceProxy,
    private masterdataControllerServiceProxy: MasterdataControllerServiceProxy,
    private roleGuardService: RoleGuardService, private authService: AuthConfigService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  async ngOnInit(): Promise<void> {

    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);
    this.isDEO = !this.roleGuardService.checkRoles(['ind-deo']);

    this.serviceProxy.getManyBaseUserv2ControllerUser(undefined,
      undefined,
      undefined,
      undefined,
      ["firstName,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.userList = res.data;
        if (this.isDEO && this.userList.length > 0) {
          this.loginUserId = this.userList[0].id;
          this.loginUser = this.userList[0];
        }
        // console.log(res.data);

      });

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.institutionList = res.data;
        if (this.institutionList.length > 0) {
          this.instutionId = this.institutionList[0].id;
        }
        this.setInstitution();
        this.searchParameter();
        this.onInstutionChange();
      });

    // await this.serviceProxy.getOneBaseInstitutionControllerInstitution(this.instutionId, undefined, undefined, undefined).subscribe(a => {
    //   this.institution = a;
    // })

    await this.serviceProxy.getOneBaseUserv2ControllerUser(this.loginUserId, undefined, undefined, undefined).subscribe(a => {
      this.loginUser = a;
    })

    this.masterdataControllerServiceProxy.getAllDataRequsetStatus().subscribe(res => {
      this.statusList = res;
    })

  }

  onAssignCancelClick() {
    if (this.selectedParameterLocationData != null && this.selectedParameterLocationData != undefined && this.selectedParameterLocationData.length != 0) {
      this.isCancel = true;
      this.isAssignCancel = true;
      this.showRejectPop = true;
    }
    else {
      // alert("Please select at least one parameter.");
      this.DisplayAlert('Please select at least one parameter.', AlertType.Warning);
    }

  }

  onCancelClick() {
    if (this.isParameterSelectForApproveReject()) {
      this.isCancel = true;
      this.isAssignCancel = false;
      this.showRejectPop = true;
    }
    else {
      // alert("Please select at least one parameter.");
      this.DisplayAlert('Please select at least one parameter.', AlertType.Warning);
    }

  }

  isShowDelay() {
    let showDelay = false;

    if (this.selectedParameterLocationData && this.selectedParameterLocationData.length > 0) {

      var min = this.selectedParameterLocationData.reduce(function (a, b) { return a.deadline < b.deadline ? a : b; })
      // var min = this.selectedParameterLocationData.reduce(function (prev, current) {
      //   if (+current.deadline > +prev.deadline) {
      //     return current;
      //   } else {
      //     return prev;
      //   }
      // });

      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
      console.log(min.deadline);
      console.log(this.deadline ? moment(this.deadline, "YYYY-MM-DDTHH:mm:ssZ").diff(min.deadline, 'minutes') : "");

      if (this.deadline && moment(this.deadline, "YYYY-MM-DDTHH:mm:ssZ").diff(min.deadline, 'minutes') > 0) {
        showDelay = true;
      }

    }

    return showDelay;
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  onInstutionChange() {
    this.pageNumber = 1;
    this.instutionId = this.institution.id;
    this.getRequestedParameteraForDataAssign(this.pageNumber, this.numberofRecodesPerPage);
    this.getRequestedParameteraForDataApprove(this.pageNumber, this.numberofRecodesPerPage);

  }

  loadData(event: LazyLoadEvent) {
    this.pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    this.numberofRecodesPerPage = event.rows;

    this.getRequestedParameteraForDataAssign(this.pageNumber, this.numberofRecodesPerPage);
  }

  loadApproveData(event: LazyLoadEvent) {
    this.pageNumberApprove = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    this.numberofRecodesPerPageApprove = event.rows;

    this.getRequestedParameteraForDataApprove(this.pageNumberApprove, this.numberofRecodesPerPageApprove);
  }

  searchParameter() {
    this.getRequestedParameteraForDataAssign(this.pageNumber, this.numberofRecodesPerPage);
  }

  showDataDialog = (row: any) => {
    this.selectedRowToDisplayData = row;
    this.displayDataDialog = true;
  }

  getRequestedParameteraForDataApprove(curentPage: number, recodeCount: number) {
    let statusId = 0;
    this.loadingApprove = true;
    this.parameterProxy.getRequestedParameteraForInstutionAdminApprove(curentPage, recodeCount, this.instutionId).subscribe(res => {
      this.parameterApproveLocationData = res.items;
      this.totalRecordsApprove = res.meta.totalItems;
      this.loadingApprove = false;
      console.log("res.items=======================================");
      console.log(res.items);
      // this.requstedParameterHeader = `${this.requstedParameterHeader} - ${this.requsetedparameters.length}`

    }, error => {
      this.loadingApprove = false;
    })
  }

  setInstitution() {
    this.institution = this.institutionList.find(a => a.id == this.instutionId);
  }

  getRequestedParameteraForDataAssign(curentPage: number, recodeCount: number) {
    let statusId = 0;
    if (this.selectedStatus != null && this.selectedStatus != undefined) {
      statusId = this.selectedStatus.id;
    }
    this.loading = true;

    this.parameterProxy.getRequestedParameteraForDataAssign(curentPage, recodeCount, this.instutionId, statusId).subscribe(res => {
      this.parameterLocationData = res.items;
      this.totalRecords = res.meta.totalItems;
      this.loading = false;

      // this.requstedParameterHeader = `${this.requstedParameterHeader} - ${this.requsetedparameters.length}`

    }, error => {
      this.loading = false;

    });

  }

  assignParameter() {

    if (this.isvalid()) {

      let isError: boolean = false;
      this.masterdataControllerServiceProxy.getDataRequsetStatus(3).subscribe(dr => {
        this.selectedParameterLocationData.forEach(pd => {
          if (pd.dataRequestStatus.id == 1
            || pd.dataRequestStatus.id == 3
            || pd.dataRequestStatus.id == 4
            || pd.dataRequestStatus.id == 5) {
            pd.dataRequestStatus = dr;
            pd.dataEntryUser = this.selectedUser;
            pd.dataEnteryDeadline = moment(this.deadline, "YYYY-MM-DDTHH:mm:ssZ");
            this.serviceProxy.updateOneBaseParameterLocationDataControllerParameterLocationData(pd.id, pd).subscribe(a => {

              this.DisplayAlert('Assigned successfully!', AlertType.Message);

              this.selectedParameterLocationData = new Array();
              this.getRequestedParameteraForDataAssign(this.pageNumber, this.numberofRecodesPerPage);

            }), error => {
              isError = true;
              console.log("Error", error);
              this.DisplayAlert('An error occurred, please try again.', AlertType.Error);
            }
          }

        });


      }), error => {
        isError = true;
        console.log("Error", error);
      };



    }
  }

  onChangeUser() {
    this.isUserValid();
  }

  ondeadlineSelect() {
    this.isdeadlineValid();
  }

  isUserValid() {
    if (this.selectedUser != null && this.selectedUser != undefined) {
      this.userRequired = false;
    }
    else {
      this.userRequired = true;
    }
  }

  isdeadlineValid() {
    if (this.deadline != null && this.deadline != undefined) {
      this.deadlineRequired = false;
    }
    else {
      this.deadlineRequired = true;
    }
  }

  isvalid() {
    let isParamSelect: boolean = true;

    this.isUserValid();

    this.isdeadlineValid();

    if (this.selectedParameterLocationData == null || this.selectedParameterLocationData == undefined || this.selectedParameterLocationData.length == 0) {
      isParamSelect = false;
      // alert("Please select one or more parameter.");
      this.DisplayAlert('Please select one or more parameter..', AlertType.Warning);

    }
    else {
      // 1-Need to assign , 3 - Pending Data Entry, 5-Rejected from the CCS, 6-Need to review,9-Rejected from the AI
      let approvelstlength = this.selectedParameterLocationData.filter(a =>
        a.dataRequestStatus.id == 1
        || a.dataRequestStatus.id == 3
        || a.dataRequestStatus.id == 4
        || a.dataRequestStatus.id == 5
        || a.dataRequestStatus.id == 6
        || a.dataRequestStatus.id == 9).length > 0;
      if (!approvelstlength) {
        isParamSelect = false;
        // alert("Please select one or more parameter.");
        this.DisplayAlert('Please select one or more parameter.', AlertType.Warning);

      }
    }

    return !this.userRequired && !this.deadlineRequired && isParamSelect;

  }

  async onApproveClick() {

    if (this.isParameterSelectForApproveReject()) {
      await this.updateStatus(2, this.selectedApproveParameterLocationData, "");
    }

  }

  async onRejectClick() {
    if (this.rejectComment != "") {
      if (this.isCancel) {
        if (this.isAssignCancel) {
          await this.updateStatus(9, this.selectedParameterLocationData, this.rejectComment);
        }
        else {
          await this.updateStatus(9, this.selectedApproveParameterLocationData, this.rejectComment);
        }
      }
      else {
        await this.updateStatus(4, this.selectedApproveParameterLocationData, this.rejectComment);
      }
    }
    else {
      this.rejectCommentRequried = true;
    }
  }

  onShowReject() {
    if (this.isParameterSelectForApproveReject()) {
      this.isCancel = false;
      this.showRejectPop = true;
    }
    else {
      // alert("Please select at least one parameter.");
      this.DisplayAlert('Please select at least one parameter.', AlertType.Warning);
    }
  }

  isParameterSelectForApproveReject() {
    if (this.selectedApproveParameterLocationData != null && this.selectedApproveParameterLocationData != null && this.selectedApproveParameterLocationData.length > 0) {
      return true;
    }
    else {
      // alert("Please select one or more parameter.")
      this.DisplayAlert('Please select one or more parameter.', AlertType.Warning);

      return false;
    }
  }

  async updateStatus(statusId: number, parametrDataList: ParameterLocationData[], commnet: string) {

    let isError: boolean = false;
    await this.masterdataControllerServiceProxy.getDataRequsetStatus(statusId).subscribe(ds => {
      parametrDataList.forEach(pd => {
        pd.dataRequestStatus = ds;
        pd.comment = commnet;
        console.log(pd);

        this.serviceProxy.updateOneBaseParameterLocationDataControllerParameterLocationData(pd.id, pd).subscribe(a => {



        }), error => {
          isError = true;
          console.log("Error", error);
        }
      })

      if (!isError) {
        // alert("Successfully updated!");

        let message = "Successfully submitted to CCS!"
        if (this.rejectComment != "") {
          // reject
          message = this.isCancel ? "Successfully rejected.!" : "Successfully rejected and reassigned!";
        }

        this.confirmationService.confirm({
          message: message,
          header: 'Confirmation',
          //acceptIcon: 'icon-not-visible',
          rejectIcon: 'icon-not-visible',
          rejectVisible: false,
          acceptLabel: "Ok",
          accept: () => {



            this.selectedApproveParameterLocationData = null;
            this.rejectComment = "";
            this.rejectCommentRequried = false;
            this.showRejectPop = false;

            this.getRequestedParameteraForDataApprove(this.pageNumberApprove, this.numberofRecodesPerPageApprove);
            this.getRequestedParameteraForDataAssign(this.pageNumber, this.numberofRecodesPerPage);


          },

          reject: () => {

          },

        });

      }
      else {
        //alert("An error occurred, please try again.");
        this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

      }
    });
  }

  onStatucClick(paramLD: ParameterLocationData) {
    this.eventsSubject.next(paramLD.id);
  }



}
