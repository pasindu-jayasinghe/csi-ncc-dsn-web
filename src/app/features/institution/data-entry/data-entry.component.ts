import { AlertType } from './../../../shared/alert/alert.component';
import { Subject } from 'rxjs';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { ParameterLocationData, Institution, User, AppControllerServiceProxy, UomConversion, DocumentsDocumentOwner } from './../../../../shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { ServiceProxy, MasterdataControllerServiceProxy, ParameterControllerServiceProxy, Parameter } from 'src/shared/service-proxies/service-proxies';
import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RoleGuardService } from 'src/app/auth/role-guard.service';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss']
})
export class DataEntryComponent implements OnInit, OnChanges {

  parameterList: Parameter[];
  selectedParameter: Parameter;

  parameterLocationData: ParameterLocationData[];
  selectedParameters: ParameterLocationData[];

  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;
  pageNumber: number;
  numberofRecodesPerPage: number;

  instutionId: number = 0;
  institution: Institution;
  institutionList: Institution[];

  userId: number = 0;
  loginUser: User;
  userList: User[];

  reasonfordeviating: string;


  eventsSubject: Subject<number> = new Subject<number>();

  alertHeader: string = "Data Entry";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  uomConversions: UomConversion[];
  manulUpdate: boolean;

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ParameterLocationData;




  institutionListDisabled = false;
  isDEO = false;

  constructor(private serviceProxy: ServiceProxy, private masterdataService: MasterdataControllerServiceProxy,
    private parameterProxy: ParameterControllerServiceProxy, private router: Router,
    private roleGuardService: RoleGuardService, private appService: AppControllerServiceProxy,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,) {
    changeDetection: ChangeDetectionStrategy.OnPush;
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  async ngOnInit(): Promise<void> {

    await this.appService.getUserInfo().subscribe(user => {
      this.loginUser = user;
      this.searchParameter();
    })

    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);
    this.isDEO = this.roleGuardService.checkRoles(['ins-deo']);
    // this.serviceProxy.getOneBaseInstitutionControllerInstitution(this.instutionId, undefined, undefined, undefined).subscribe(a => {
    //   this.institution = a;
    // })

    // this.serviceProxy.getOneBaseUserv2ControllerUser(this.userId, undefined, undefined, undefined).subscribe(a => {
    //   this.loginUser = a;
    // })

    await this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
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
      });

    await this.serviceProxy.getManyBaseUserv2ControllerUser(undefined,
      undefined,
      undefined,
      undefined,
      ["firstName,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.userList = res.data;
        if (this.isDEO && this.userList.length > 0) {
          this.userId = this.userList[0].id;
        }
        // this.setuser();
        // this.searchParameter();
      });

  }

  canEnableTextInput(value1, value2) {

    console.log("zzzzzzzzzzzz");
    console.log(value1);
    console.log(value2);
    return (value1 && value2);
  }
  canEnableInput(param) {
    let isdisable = true;

    if (param.parameter.parameterDataType.id !== 1) {
      return true;
    }
    if (this.selectedParameters) {
      let selectParam = this.selectedParameters.find(a => a.id == param.id);
      if (selectParam) {
        isdisable = false;
      }
    }

    return isdisable;
  }

  canEnableConversionInput(param: any) {
    let isdisable = true;
    if (this.selectedParameters) {
      let selectParam = this.selectedParameters.find(a => a.id == param.id);
      if (selectParam && selectParam?.uomConversions?.length > 0 && selectParam?.conversionUOMeDataEntry) {
        isdisable = false;
      }

    }



    return isdisable;
  }

  setInstitution() {
    this.institution = this.institutionList.find(a => a.id == this.instutionId);
  }

  setuser() {
    this.loginUser = this.userList.find(a => a.id == this.userId);
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }


  getRequestedParameteraForDataEntry(curentPage: number, recodeCount: number) {


    if (this.institution && this.loginUser && this.loginUser.id) {
      let userId = this.roleGuardService.checkRoles(['ins-admin']) ? 0 : this.loginUser.id;

      this.loading = true;

      this.parameterProxy.getRequestedParameteraForDataEntry(curentPage, recodeCount, this.institution.id, userId).subscribe(res => {
        this.parameterLocationData = res.items;
        this.totalRecords = res.meta.totalItems;
        this.loading = false;
        console.log(res);

      })
    }
  }

  onChangeuomConversions(data: ParameterLocationData) {
    data.conversionUnitOfMeasurevalue = "";
    data.value = "";
    data.unitOfMeasureDataEntry = data.conversionUOMeDataEntry.relatedUnitOfMeasure;
    // data.historicalMinimum = (data.conversionUOMeDataEntry.conversionValue * data.historicalMinimum);
    // data.historicalMaximum = (data.conversionUOMeDataEntry.conversionValue * data.historicalMaximum);
    // data.parameter.sampleParamterReading = (parseInt(data.parameter.sampleParamterReading) * data.historicalMaximum).toString();

  }

  dataEntryConvertionValueChanged(data: ParameterLocationData) { 
    console.log(data.conversionUOMeDataEntry)
    if (data.conversionUOMeDataEntry) {
      this.manulUpdate = true;
      let selectParam = this.parameterLocationData.find(a => a.id == data.id);
      //data.dataEntryValue = ((1 / data.conversionUOMeDataEntry.conversionValue) * parseInt(data.conversionUnitOfMeasurevalue));

      if (data.conversionUOMeDataEntry.conversionValue == 0 || data.conversionUnitOfMeasurevalue == "0") {
        data.dataEntryValue = undefined;
      } else {

        data.dataEntryValue = ((1 / data.conversionUOMeDataEntry.conversionValue) * parseFloat(data.conversionUnitOfMeasurevalue));
      }


      console.log(data.dataEntryValue);
      this.dataEntryValueChanged(data);
      this.manulUpdate = false;

    }

  }

  dataEntryValueChanged(data: ParameterLocationData) {

    data.isValiddataEntryValue = false;

    if (!this.manulUpdate) {
      // if (data.parameter.sampleParamterReading && parseInt(data.parameter.sampleParamterReading) != 0 && data.conversionUOMeDataEntry) {
      //   data.parameter.sampleParamterReading = (parseInt(data.parameter.sampleParamterReading) / data.conversionUOMeDataEntry.conversionValue).toString();
      // }

      // if (data.historicalMinimum != 0 && data.conversionUOMeDataEntry) {
      //   data.historicalMinimum = (data.historicalMinimum / data.conversionUOMeDataEntry.conversionValue);
      // }
      // if (data.historicalMaximum != 0 && data.conversionUOMeDataEntry) {
      //   data.historicalMaximum = (data.historicalMaximum / data.conversionUOMeDataEntry.conversionValue);
      // }
      data.conversionUOMeDataEntry = null;
      data.conversionUnitOfMeasurevalue = null;
    }

    if (data.historicalMaximum != null && data.historicalMinimum != null) 
    {
      if (data.dataEntryValue && (data.historicalMaximum < (data.dataEntryValue)
        || data.historicalMinimum > (data.dataEntryValue))) {
        data.isValiddataEntryValue = true;
      }
    }

    // if( /^[a-zA-Z0-9  ,-.]{1,256}$/.test(data.dataEntryValue) )
  }

  showminmaxWarning(data: ParameterLocationData) {
    let showWarning = false;

    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    // console.log(data.historicalMaximum);
    // console.log(data.historicalMinimum);
    // console.log(data.dataEntryValue);
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");


    if (data.historicalMaximum && data.historicalMinimum) {
      if (data.dataEntryValue && (data.historicalMaximum < data.dataEntryValue || data.historicalMinimum > data.dataEntryValue)) {
        showWarning = true;
      }
    }

    return showWarning;
  }

  loadData(event: LazyLoadEvent) {
    this.pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    this.numberofRecodesPerPage = event.rows;

    this.getRequestedParameteraForDataEntry(this.pageNumber, this.numberofRecodesPerPage);
  }

  searchParameter() {
    this.getRequestedParameteraForDataEntry(this.pageNumber, this.numberofRecodesPerPage);
  }

  isvalidtoSubmit() {
    return this.selectedParameters && this.selectedParameters.find(a => a.parameter?.parameterDataType?.id == 2 && a.contentCommentRequired);
  }

  async onSubmitForReview() {
    if (this.selectedParameters != null && this.selectedParameters != undefined) {

      for (const p of this.selectedParameters) {
        if (p.parameter?.parameterDataType?.id == 2 && (!p.contentComment || !p.contentComment?.trim())) {
          p.contentCommentRequired = true;

          return;
        }
      }


      let dataenterList = this.selectedParameters.filter(a =>
        (a.dataEntryValue != null && a.dataEntryValue != undefined && !Number.isNaN(a.dataEntryValue)) ||
        a.contentComment && a.contentComment?.trim());
      console.log(dataenterList);
      if (dataenterList.length > 0) {
        let isError: boolean = false;

        await this.masterdataService.getDataRequsetStatus(6).subscribe(ds => {
          dataenterList.forEach(pd => {
            pd.dataRequestStatus = ds;
            pd.reasonforExceedRange = this.reasonfordeviating ? this.reasonfordeviating : "";
            pd.value = pd.dataEntryValue ? pd.dataEntryValue.toString() : "";
            this.serviceProxy.updateOneBaseParameterLocationDataControllerParameterLocationData(pd.id, pd).subscribe(a => {

            }), error => {
              isError = true;
              console.log("Error", error);
            }
          })

          if (!isError) {
            //alert("Created successfully!");

            this.confirmationService.confirm({
              message: 'Submited for review successfully!',
              header: 'Confirmation',
              //acceptIcon: 'icon-not-visible',
              rejectIcon: 'icon-not-visible',
              rejectVisible: false,
              acceptLabel: "Ok",
              accept: () => {
                this.reasonfordeviating = "";
                this.getRequestedParameteraForDataEntry(this.pageNumber, this.numberofRecodesPerPage);
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
      else {
        // alert("Please enter data for at least one parameter.");
        this.DisplayAlert('Please enter data for at least one parameter.', AlertType.Error);

      }
    }
  }

  tableCheckboxValueChange(paramLD: ParameterLocationData) {
    if (paramLD.conversionUOMeDataEntry) {
      paramLD.dataEntryValue = (paramLD.conversionUOMeDataEntry.conversionValue * parseFloat(paramLD.conversionUnitOfMeasurevalue));
    }

  }

  onStatucClick(paramLD: ParameterLocationData) {
    this.eventsSubject.next(paramLD.id);
  }

}
