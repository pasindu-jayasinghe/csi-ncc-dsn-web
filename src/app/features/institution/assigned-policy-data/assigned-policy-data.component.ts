import { AppControllerServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { RoleGuardService } from 'src/app/auth/role-guard.service';
import { DataRequestStatus, DocumentsDocumentOwner, Institution, MasterdataControllerServiceProxy, PolicyData, PolicyDataControllerServiceProxy, ServiceProxy, User } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-assigned-policy-data',
  templateUrl: './assigned-policy-data.component.html',
  styleUrls: ['./assigned-policy-data.component.scss']
})
export class AssignedPolicyDataComponent implements OnInit {

  statusList: DataRequestStatus[];
  searchBy: any = {
    status: null
  }

  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;

  institutionId: number = 0;
  institution: Institution;

  loginUserId: number = 0;
  loginUser: User;

  dataRequestList: PolicyData[] = [];

  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};

  userList: User[];
  institutionList: Institution[] = [];

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.PolicyData;

  influenceNameMap = {
    "1": "National",
    "2": "Provincial",
    "3": "District Level",
    "4": "Specific Locations",
  }

  institutionListDisabled = false;
  isDEO = false;

  constructor(private serviceProxy: ServiceProxy, private subServiceProxy: PolicyDataControllerServiceProxy,
    private masterDataControllerServiceProxy: MasterdataControllerServiceProxy, private router: Router,
    private roleGuardService: RoleGuardService, private appService: AppControllerServiceProxy) { }

  async ngOnInit(): Promise<void> {
    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);
    this.isDEO = this.roleGuardService.checkRoles(['ins-deo']);

    //this.setInstitution();
    await this.setUser();
    this.setDropdownData();
  }

  /**
   * set institution object
   */
  // setInstitution = () =>{
  //   this.serviceProxy.getOneBaseInstitutionControllerInstitution(this.institutionId, undefined, undefined, undefined).subscribe(a => {
  //     this.institution = a;
  //   })
  // }

  /**
   * set user object
   */
  setUser = async () => {
    // await this.serviceProxy.getOneBaseUserv2ControllerUser(this.loginUserId, undefined, undefined, undefined).subscribe(a => {
    //   this.loginUser = a;
    // })

    await this.appService.getUserInfo().subscribe(user => {
      this.loginUser = user;
      this.loginUserId = user.id;
      console.log(this.loginUser);
      // this.setuser()
      // this.searchParameter();
    });
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
        // if (this.isDEO && this.userList.length > 0) {
        //   this.loginUser = this.userList[0];
        //   this.loginUserId = this.loginUser.id;
        // }
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
          this.search();
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
    this.loading = true;
    this.dataRequestList = [];
    this.totalRecords = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    let statusId = this.searchBy.status ? this.searchBy.status.id : 0;

    this.subServiceProxy
      .getPolicyDataRequestsOfDataEntryUser(pageNumber, event.rows, this.institutionId, statusId, this.loginUserId)
      .subscribe((res) => {
        if (res && res.items && res.items.length > 0) {
          for (let item of res.items) {
            item["documentList"] = [];
          }
          this.totalRecords = res.meta.totalItems;
          this.dataRequestList = res.items;
        }

        this.loading = false;
      });
  };


  /**
   * on click input data
   */
  onClickInputData() {
    this.router.navigate(['/institution-policy-data-entry']);
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
  }

  onUserChange = () => {
    if (this.loginUser) {
      this.loginUserId = this.loginUser.id
    } else {
      this.loginUserId = 0;
    }
  }

}
