import { Subject } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ParameterLocationData, DocumentsDocumentOwner } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { Institution, ServiceProxy, User, ParameterControllerServiceProxy, MasterdataControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { promise } from 'protractor';
import { RoleGuardService } from 'src/app/auth/role-guard.service';

@Component({
  selector: 'app-data-request-history',
  templateUrl: './data-request-history.component.html',
  styleUrls: ['./data-request-history.component.scss']
})
export class DataRequestHistoryComponent implements OnInit {

  institutionList: Institution[];
  instutionId: number = 0;
  institution: Institution;

  loginUserId: number = 1;
  loginUser: User;

  fromDate: Date = null;
  toDate: Date = null;


  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;
  pageNumber: number;
  numberofRecodesPerPage: number;

  parameterLocationData: ParameterLocationData[];
  eventsSubject: Subject<number> = new Subject<number>();

  institutionListDisabled = false;

  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};
  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ParameterLocationData;

  constructor(private serviceProxy: ServiceProxy, private parameterProxy: ParameterControllerServiceProxy,
    private masterdataControllerServiceProxy: MasterdataControllerServiceProxy,
    private roleGuardService: RoleGuardService) { }

  async ngOnInit(): Promise<void> {

    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);

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
        this.search();
      });

    // await this.serviceProxy.getOneBaseInstitutionControllerInstitution(this.instutionId, undefined, undefined, undefined).subscribe(a => {
    //   this.institution = a;
    // })

    await this.serviceProxy.getOneBaseUserv2ControllerUser(this.loginUserId, undefined, undefined, undefined).subscribe(a => {
      this.loginUser = a;
    })
  }

  loadData(event: LazyLoadEvent) {
    this.pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    this.numberofRecodesPerPage = event.rows;

    this.getRequestedParameteraForDataAssign(this.pageNumber, this.numberofRecodesPerPage);
  }

  search() {
    this.getRequestedParameteraForDataAssign(this.pageNumber, this.numberofRecodesPerPage);
  }

  onStatucClick(paramLD: ParameterLocationData) {
    this.eventsSubject.next(paramLD.id);
  }

  setInstitution() {
    this.institution = this.institutionList.find(a => a.id == this.instutionId);
  }

  onInstutionChange() {
    this.pageNumber = 1;
    this.instutionId = this.institution.id;
    this.getRequestedParameteraForDataAssign(this.pageNumber, this.numberofRecodesPerPage);
  }

  showDataDialog = (row: any) => {
    this.selectedRowToDisplayData = row;
    this.displayDataDialog = true;
  }

  getRequestedParameteraForDataAssign(curentPage: number, recodeCount: number) {
    //Publish
    let statusId = 7;

    let from = this.fromDate ? this.fromDate : new Date(0, 0, 0, 0);
    let to = this.toDate ? this.toDate : new Date(0, 0, 0, 0);


    this.parameterProxy.getRequestedParameteraForHistory(curentPage, recodeCount, from, to, this.instutionId).subscribe(res => {
      this.parameterLocationData = res.items;
      this.totalRecords = res.meta.totalItems;
      this.loading = false;
      // this.requstedParameterHeader = `${this.requstedParameterHeader} - ${this.requsetedparameters.length}`

    })
  }

}
