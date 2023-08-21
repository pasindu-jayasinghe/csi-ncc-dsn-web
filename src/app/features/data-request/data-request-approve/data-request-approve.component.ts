import { AlertType } from './../../../shared/alert/alert.component';
import { Subject } from 'rxjs';
import { async } from '@angular/core/testing';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { Institution, Frequency, ParameterLocationData, MasterdataControllerServiceProxy, ParameterControllerServiceProxy, DocumentsDocumentOwner } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-data-request-approve',
  templateUrl: './data-request-approve.component.html',
  styleUrls: ['./data-request-approve.component.scss']
})
export class DataRequestApproveComponent implements OnInit {

  instuitutionList: Institution[];
  selctedInstuitution: Institution;

  frequencyList: Frequency[];
  selectedFrequency: Frequency;

  requsetedparameters: ParameterLocationData[];
  selectedRequestedParameters: ParameterLocationData[] = new Array();;


  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;
  pageNumber: number;
  numberofRecodesPerPage: number;

  fromDate: Date = undefined;
  toDate: Date = undefined;

  calenderView: string = "date";

  eventsSubject: Subject<number> = new Subject<number>();
  showRejectPop: boolean = false;
  rejectComment: string = "";
  rejectCommentRequried: boolean = false;

  alertHeader: string = "Data Approve/Reject";
  alertBody: string;
  alerttype: AlertType;

  showAlert: boolean = false;

  popupContetnt: string = "";

  isCancel = false;
  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};
  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ParameterLocationData;


  constructor(private serviceProxy: ServiceProxy, private masterdataService: MasterdataControllerServiceProxy,
    private parameterProxy: ParameterControllerServiceProxy, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.masterdataService.getAllFrequncy().subscribe(res => {
      this.frequencyList = res;
    })

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined, ["name,ASC"], undefined, 1000, 0, 0, 0).subscribe(res => {
        this.instuitutionList = res.data;
      });
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  onChangefrequency() {
    this.fromDate = null;
    this.toDate = null;
    if (this.selectedFrequency !== null && this.selectedFrequency !== undefined) {
      if (this.selectedFrequency.id == 1 || this.selectedFrequency.id == 2) {
        this.calenderView = "date";
      }
      else {
        this.calenderView = "month";
      }
    }
  }

  onChangefromDate() {
    if (this.selectedFrequency != undefined && this.selectedFrequency != null) {
      let addType: moment.unitOfTime.DurationConstructor;
      let number: number = 1;
      if (this.selectedFrequency.id == 4) {
        //year
        addType = 'y';
      }
      else if (this.selectedFrequency.id == 5) {
        //Quater
        addType = 'Q';
      }
      else if (this.selectedFrequency.id == 3) {
        //Month
        addType = 'M';
      }
      else if (this.selectedFrequency.id == 2) {
        //week
        addType = 'w';
      }
      else if (this.selectedFrequency.id == 1) {
        //Day
        addType = 'd';
      }

      this.toDate = new Date(moment(this.fromDate, "YYYY-MM-DDTHH:mm:ssZ").add(1, addType).toISOString());

    }
  }

  getRequestParam(curentPage: number, recodeCount: number) {
    this.loading = true;
    let instuitutionId = this.selctedInstuitution != null && this.selctedInstuitution != undefined ? this.selctedInstuitution.id : 0;
    let frequncyId = this.selectedFrequency != null && this.selectedFrequency != undefined ? this.selectedFrequency.id : 0;
    let fromDate = this.fromDate != null && this.fromDate != undefined ? this.fromDate : new Date(0, 0, 0, 0);
    let toDate = this.toDate != null && this.toDate != undefined ? this.toDate : new Date(0, 0, 0, 0);


    this.parameterProxy.getRequestedParameteraForCCSAdminApprove(curentPage, recodeCount, frequncyId, fromDate, toDate, instuitutionId)
      .subscribe(res => {
        this.requsetedparameters = res.items;
        this.totalRecords = res.meta.totalItems;
        this.loading = false;
        // this.requstedParameterHeader = `${this.requstedParameterHeader} - ${this.requsetedparameters.length}`

      })
  }

  showDataDialog = (row: any) => {
    this.selectedRowToDisplayData = row;
    this.displayDataDialog = true;
  }

  loadParam(event: LazyLoadEvent) {
    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    this.pageNumber = pageNumber;
    this.numberofRecodesPerPage = event.rows;
    this.getRequestParam(this.pageNumber, this.numberofRecodesPerPage);
  }

  search() {
    this.getRequestParam(1, this.rows);
  }

  onPublish() {
    //publish
    this.updateStatus(7);
  }

  onCancel() {

  }

  onReject() {
    if (this.rejectComment != "") {
      if (this.isCancel) {
        this.updateStatus(8);
      }
      else {
        this.updateStatus(5);
      }
      this.showRejectPop = false;
    }
    else {
      this.rejectCommentRequried = true;

    }

  }

  onShowCancel() {
    if (this.selectedRequestedParameters != null && this.selectedRequestedParameters != undefined && this.selectedRequestedParameters.length > 0) {
      this.isCancel = true;
      this.rejectComment = "";
      this.showRejectPop = true;

    }
    else {
      //alert("Please select at least one parameter.");
      this.DisplayAlert('Please select at least one parameter.', AlertType.Warning);

    }
  }

  onShowJeject() {
    if (this.selectedRequestedParameters != null && this.selectedRequestedParameters != undefined && this.selectedRequestedParameters.length > 0) {
      this.isCancel = false;
      this.rejectComment = "";
      this.showRejectPop = true;
    }
    else {
      //alert("Please select at least one parameter.");
      this.DisplayAlert('Please select at least one parameter.', AlertType.Warning);

    }
  }

  async updateStatus(status: number) {
    if (this.selectedRequestedParameters != null && this.selectedRequestedParameters != undefined && this.selectedRequestedParameters.length > 0) {
      // let dataenterList = this.parameterLocationData.filter(a => a.value != null && a.value != undefined && a.value != "" && a.value.trimLeft() != "");
      // if (dataenterList.length > 0) {

      let isError: boolean = false;

      await this.masterdataService.getDataRequsetStatus(status).subscribe(ds => {
        this.selectedRequestedParameters.forEach(pd => {
          pd.dataRequestStatus = ds;
          pd.comment = this.rejectComment;
          this.serviceProxy.updateOneBaseParameterLocationDataControllerParameterLocationData(pd.id, pd).subscribe(a => {
            if (this.rejectComment.length > 0) {
              let msg = "Successfully rejected.";
              if(this.isCancel){
                msg = "Successfully cancelled.";
              }
              this.DisplayAlert(msg, AlertType.Message);

            } else {

              this.DisplayAlert('Successfully  published selected parameter(s)!', AlertType.Message);
            }

            this.getRequestParam(this.pageNumber, this.numberofRecodesPerPage);
            this.selectedRequestedParameters = new Array();

          }), error => {
            isError = true;
            console.log("Error", error);
          }
        })

        if (!isError) {
          // alert("Created successfully!");

        }
        else {
          this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

          // alert("An error occurred, please try again.");
        }
      });


    }
    else {
      // alert("Please select at least one parameter.");
      this.DisplayAlert('Please select at least one parameter.', AlertType.Warning);

    }
    //}
  }

  onStatucClick(paramLD: ParameterLocationData) {
    this.eventsSubject.next(paramLD.id);
  }

}


