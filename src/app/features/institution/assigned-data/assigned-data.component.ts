import { DocumentsDocumentOwner } from 'src/shared/service-proxies/service-proxies';
import { AlertType } from './../../../shared/alert/alert.component';
import { Subject } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { Frequency, ServiceProxy, MasterdataControllerServiceProxy, DataRequestStatus, Institution, ParameterControllerServiceProxy, ParameterLocationData, User, AppControllerServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { RoleGuardService } from 'src/app/auth/role-guard.service';
import { AuthConfigService } from 'src/app/auth/keyclock/auth-config.service';
import { log } from 'console';

@Component({
  selector: 'app-assigned-data',
  templateUrl: './assigned-data.component.html',
  styleUrls: ['./assigned-data.component.scss']
})
export class AssignedDataComponent implements OnInit {

  frequencyList: Frequency[];
  selectedFrequency: Frequency;

  parameterLocationData: ParameterLocationData[];

  statusList: DataRequestStatus[];
  selectedStatus: DataRequestStatus;

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

  eventsSubject: Subject<number> = new Subject<number>();

  alertHeader: string = "Data Entry Requests";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  institutionListDisabled = false;
  isDEO = false;

  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};
  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ParameterLocationData;

  constructor(private serviceProxy: ServiceProxy, private masterdataService: MasterdataControllerServiceProxy,
    private parameterProxy: ParameterControllerServiceProxy, private router: Router,
    private roleGuardService: RoleGuardService, private appService: AppControllerServiceProxy) {
  }

  async ngOnInit(): Promise<void> {

    await this.appService.getUserInfo().subscribe(user => {
      this.loginUser = user;
      console.log(this.loginUser);
      this.setuser()
      // this.searchParameter();
    });

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


    //this.userId = this.authService.loginUserId;
    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);
    this.isDEO = this.roleGuardService.checkRoles(['ins-deo']);


    this.masterdataService.getAllFrequncy().subscribe(res => {
      this.frequencyList = res;
    });

    this.masterdataService.getAllDataRequsetStatus().subscribe(res => {
      this.statusList = res;
    })



    this.serviceProxy.getManyBaseUserv2ControllerUser(undefined,
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
        this.setuser();
        this.searchParameter();
      });

    // this.serviceProxy.getOneBaseInstitutionControllerInstitution(this.instutionId, undefined, undefined, undefined).subscribe(a => {
    //   this.institution = a;
    // })

    // this.serviceProxy.getOneBaseUserv2ControllerUser(this.userId, undefined, undefined, undefined).subscribe(a => {
    //   this.loginUser = a;
    // })
  }

  showDataDialog = (row: any) => {
    this.selectedRowToDisplayData = row;
    this.displayDataDialog = true;
  }

  setInstitution() {
    this.institution = this.institutionList.find(a => a.id == this.instutionId);
  }

  setuser() {
    // this.loginUser = this.userList.find(a => a.id == this.userId);
  }

  searchParameter() {
    this.getRequestedParameteraForAssigneddata(this.pageNumber, this.numberofRecodesPerPage);
  }

  getRequestedParameteraForAssigneddata(curentPage: number, recodeCount: number) {

    if (this.loginUser?.id > 0) {
      let statusId = 0;
      if (this.selectedStatus != null && this.selectedStatus != undefined) {
        statusId = this.selectedStatus.id;
      }

      let userId = this.roleGuardService.checkRoles(['ins-admin']) ? 0 : this.loginUser.id;

      this.parameterProxy.getRequestedParameteraForAssigneddata(curentPage, recodeCount, this.institution.id, userId, statusId).subscribe(res => {
        this.parameterLocationData = res.items;
        this.totalRecords = res.meta.totalItems;
        this.loading = false;
        // this.requstedParameterHeader = `${this.requstedParameterHeader} - ${this.requsetedparameters.length}`

      })
    }
  }

  loadData(event: LazyLoadEvent) {
    this.pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    this.numberofRecodesPerPage = event.rows;

    this.getRequestedParameteraForAssigneddata(this.pageNumber, this.numberofRecodesPerPage);
  }

  onClickInputData() {
    this.router.navigate(['/institution-dataentry']);
  }

  onStatucClick(paramLD: ParameterLocationData) {
    this.eventsSubject.next(paramLD.id);
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

}
