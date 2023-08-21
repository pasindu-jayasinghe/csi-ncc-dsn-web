import { AlertType } from './../../shared/alert/alert.component';
import { Observable, Subject } from 'rxjs';
import { LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { ServiceProxy, Institution, MasterdataControllerServiceProxy, Frequency, ParameterControllerServiceProxy, Parameter, ParameterLocation, ParameterLocationData, UnitOfMeasure, DataRequestStatus } from './../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { log } from 'console';


@Component({
  selector: 'app-data-request',
  templateUrl: './data-request.component.html',
  styleUrls: ['./data-request.component.scss']
})
export class DataRequestComponent implements OnInit {

  yearList: { id: number, name: string }[] = [{ id: 2019, name: "2019" }, { id: 2020, name: "2020" }, { id: 2021, name: "2021" }, { id: 2022, name: "2022" }]
  toYearList: { id: number, name: string }[] = [{ id: 2019, name: "2019" }, { id: 2020, name: "2020" }, { id: 2021, name: "2021" }, { id: 2022, name: "2022" }, { id: 2023, name: "2023" }]

  selectedFromYear: { id: number, name: string };
  selectedToYear: { id: number, name: string };

  instuitutionList: Institution[];
  selctedInstuitution: Institution;

  frequencyList: Frequency[];
  selectedFrequency: Frequency;

  parameters: ParameterLocation[];
  selectedParameters: ParameterLocation[] = new Array();

  requsetedparameters: ParameterLocationData[];
  selectedRequestedParameters: ParameterLocationData[];

  rrows: number = 10;
  rloading: boolean;
  rtotalRecords: number = 0;


  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;

  fromDate: Date = undefined;
  toDate: Date = undefined;

  deadline: Date;
  deadlinerequried: boolean = false;

  invalidDate = new Date();
  invalidDates: Array<Date>

  parameterHeader: string = "New Requests";
  parameterHeaderwithCount: string = "New Requests";
  requstedParameterHeader: string = "Pending Requests"
  requstedParameterHeaderCount: string = "Pending Requests";
  calenderView: string = "month";

  eventsSubject: Subject<number> = new Subject<number>();

  minDate = new Date();

  alertHeader: string = "Data Request";
  alertBody: string;
  alerttype: AlertType;

  showAlert: boolean = false;

  searchParameteText: string = "";

  selectedTab: number = 0;

  statusList: DataRequestStatus[];
  selectedStatus: DataRequestStatus;

  showRejectPop: boolean = false;
  rejectComment: string = "";
  rejectCommentRequried: boolean = false;
  isCancel = true;

  pageNumber: number;
  numberofRecodesPerPage: number;


  constructor(private serviceProxy: ServiceProxy, private masterdataService: MasterdataControllerServiceProxy,
    private parameterProxy: ParameterControllerServiceProxy, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    //this.getNotRequestParam(1, 10);
    this.invalidDate.setDate(new Date().getDate() - 10);
    //this.invalidDates = [new Date(), this.invalidDate];

    this.masterdataService.getAllFrequncy().subscribe(res => {
      this.frequencyList = res;
    })

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined, ["name,ASC"], undefined, 1000, 0, 0, 0).subscribe(res => {
        this.instuitutionList = res.data;
      });

    this.masterdataService.getAllDataRequsetStatus().subscribe(res => {
      this.statusList = res;
    })
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
            //alert(this.rejectComment.length);
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

  search() {
    if (this.isSearchComplete()) {
      this.getNotRequestParam(1, this.rows);
      this.getRequestParam(1, this.rrows);
    }
    else {
      // alert('Please enter valid input(s) for search criteria!')
      this.DisplayAlert('Please enter valid input(s) for search criteria!', AlertType.Warning);
    }
  }

  searchParameter() {
    if (this.isSearchComplete()) {
      //this.getNotRequestParam(1, this.rows);
      this.getRequestParam(1, this.rrows);
    }
    else {
      // alert('Please enter valid input(s) for search criteria!')
      this.DisplayAlert('Please enter valid input(s) for search criteria!', AlertType.Warning);
    }

  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  getNotRequestParam(curentPage: number, recodeCount: number) {
    if (this.isSearchComplete()) {

      this.loading = true;
      let instuitutionId = this.selctedInstuitution != null && this.selctedInstuitution != undefined ? this.selctedInstuitution.id : 0;


      this.parameterProxy.getNotRequestedParametera(curentPage, recodeCount, this.selectedFrequency.id,
        this.fromDate, this.toDate, instuitutionId, this.searchParameteText).subscribe(res => {
          this.parameters = res.items;
          this.totalRecords = res.meta.totalItems;
          this.loading = false;
          this.parameterHeaderwithCount = this.parameterHeaderwithCount + " (" + this.parameters.length + ")";
          console.log(this.parameterHeaderwithCount);
          // this.parameterHeader = `${this.parameterHeader} - ${this.parameters.length}`
        })
    }
  }

  isSearchComplete() {
    return this.selectedFrequency !== null && this.selectedFrequency !== undefined &&
      this.fromDate !== null && this.fromDate !== undefined &&
      this.toDate !== null && this.toDate !== undefined
  }

  getRequestParam(curentPage: number, recodeCount: number) {
    if (this.selectedFrequency !== null && this.selectedFrequency !== undefined &&
      this.fromDate !== null && this.fromDate !== undefined &&
      this.toDate !== null && this.toDate !== undefined) {

      this.rloading = true;
      let instuitutionId = this.selctedInstuitution != null && this.selctedInstuitution != undefined ? this.selctedInstuitution.id : 0;
      let startusId = this.selectedStatus ? this.selectedStatus.id : 0;
      let searchText = this.searchParameteText ? this.searchParameteText : "";
      console.log(this.fromDate);
      // this.selectedTab = 1;

      this.parameterProxy.getRequestedParametera(curentPage, recodeCount, this.selectedFrequency.id,
        this.fromDate, this.toDate, instuitutionId, searchText, startusId).subscribe(res => {
          this.requsetedparameters = res.items;
          this.rtotalRecords = res.meta.totalItems;
          this.rloading = false;
          this.requstedParameterHeaderCount = this.requstedParameterHeaderCount + " (" + this.requsetedparameters.length + ")";
          //this.selectedTab = 0;
          // this.requstedParameterHeader = `${this.requstedParameterHeader} - ${this.requsetedparameters.length}`

        })
    }

  }

  onChangefromYear() {
    this.fromDate = new Date(this.selectedFromYear.id - 1, 12, 1);
    this.selectedToYear = this.toYearList.find(x => x.id == (this.selectedFromYear.id + 1));
    this.toDate = new Date(this.selectedToYear.id - 1, 12, 1);
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
      else if (this.selectedFrequency.id == 6) {
        //Day
        addType = 'M';
      }

      if (this.selectedFrequency.id == 6) {
        this.toDate = new Date(moment(this.fromDate, "YYYY-MM-DDTHH:mm:ssZ").add(6, addType).toISOString());

      }
      else {
        this.toDate = new Date(moment(this.fromDate, "YYYY-MM-DDTHH:mm:ssZ").add(1, addType).toISOString());
      }

      // if (this.selectedFrequency.id == 4) {
      //set december 31st
      this.toDate = new Date(moment(this.toDate, "YYYY-MM-DDTHH:mm:ssZ").add(-1, 'd').toISOString());
      // }

      console.log(this.toDate);

      if (this.selectedFrequency.deadline != null && this.selectedFrequency.deadline != undefined) {
        let todate = this.toDate;
        if (this.toDate < new Date()) {
          todate = new Date();
        }

        console.log(this.selectedFrequency);
        this.deadline = new Date(moment(todate, "YYYY-MM-DDTHH:mm:ssZ").add(this.selectedFrequency.deadline.numberOfDays, 'd').toISOString());
      }

      // if (this.selectedFrequency.id == 4) {
      //set december 31st
      //this.deadline = new Date(moment(this.deadline, "YYYY-MM-DDTHH:mm:ssZ").add(1, 'd').toISOString());
      // }



      // if (this.selectedFrequency.frequencyDetails[0].numberofMonth != 0) {
      //   this.toDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth() +
      //     this.selectedFrequency.frequencyDetails[0].numberofMonth, this.fromDate.getDate());
      // }
      // else if (this.selectedFrequency.frequencyDetails[0].numberOfDate != 0) {
      //   this.toDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth(), this.fromDate.getDate() + this.selectedFrequency.frequencyDetails[0].numberOfDate);
      // }
    }
  }

  loadParam(event: LazyLoadEvent) {
    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    this.pageNumber = pageNumber;
    this.numberofRecodesPerPage = event.rows;
    this.getNotRequestParam(pageNumber, event.rows);
    this.getRequestParam(pageNumber, event.rows);
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

  createParamData() {
    if (this.isSearchComplete()) {
      this.deadlinerequried = false;

      if (this.selectedParameters != undefined && this.selectedParameters != null && this.selectedParameters.length > 0) {
        if (this.deadline != undefined && this.deadline != null) {
          let savePLD: ParameterLocationData[] = [];
          let isError: boolean = false;
          this.selectedParameters.forEach(a => {
            let pl: ParameterLocation = new ParameterLocation();
            pl.id = a.id;
            let um: UnitOfMeasure = new UnitOfMeasure();
            if (a.parameter.unitOfMeasure) {
              um.id = a.parameter.unitOfMeasure?.id;
            }
            else {
              um = null;
            }
            let pld: ParameterLocationData = new ParameterLocationData();
            pld.deadline = moment(this.deadline, "YYYY-MM-DDTHH:mm:ssZ");
            pld.parameterId = a.parameter.id;
            pld.parameterLocation = pl;
            pld.startDate = moment(this.fromDate, "YYYY-MM-DDTHH:mm:ssZ");
            pld.endDate = moment(this.toDate, "YYYY-MM-DDTHH:mm:ssZ");
            pld.requestedDate = moment(new Date(), "YYYY-MM-DDTHH:mm:ssZ");
            pld.frequency = this.selectedFrequency;
            pld.unitOfMeasureInParameterStandard = um;
            savePLD.push(pld);

            this.serviceProxy.createOneBaseParameterLocationDataControllerParameterLocationData(pld).subscribe(res => {

              this.DisplayAlert('Successfully sent!', AlertType.Message);

              this.deadline = null;//reset the deadline

              this.selectedParameters = new Array();
              this.search();

            }, error => {
              isError = true;
              console.log("Error", error);
              this.DisplayAlert('An error occurred, please try again.', AlertType.Error);
            });

            // this.serviceProxy.createOneBaseParameterLocationDataControllerParameterLocationData2(pld).subscribe(res => {

            // }, error => {
            //   isError = true;
            //   console.log("Error", error);
            // });
          })




          // this.serviceProxy.createManyBaseParameterLocationDataControllerParameterLocationData(savePLD,).subscribe(res => {
          //   alert("Created successfully!");
          // }, error => {
          //   alert("Error")
          //   console.log("Error", error);
          // });
        }
        else {
          this.deadlinerequried = true;
          this.DisplayAlert('Please enter deadline.', AlertType.Warning);

          // alert("Please enter deadline.")

        }
      }
      else {
        // alert("Please select parameter(s).")
        this.DisplayAlert(' Please select at least one parameter.', AlertType.Warning);

      }
    }
  }


  onStatucClick(paramLD: ParameterLocationData) {
    this.eventsSubject.next(paramLD.id);
  }


}
