import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { RoleGuardService } from 'src/app/auth/role-guard.service';
import { AlertType } from 'src/app/shared/alert/alert.component';
import { DocumentsDocumentOwner, Institution, MasterdataControllerServiceProxy, PolicyData, PolicyDataControllerServiceProxy, PolicyDataSaveRequest, ProjectStatus, ServiceProxy, User } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-policy-data-entry',
  templateUrl: './policy-data-entry.component.html',
  styleUrls: ['./policy-data-entry.component.scss']
})
export class PolicyDataEntryComponent implements OnInit {

  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;

  institutionId: number = 0;
  institution: Institution;

  loginUserId: number = 0;
  loginUser: User;

  dataRequestList: PolicyData[] = [];

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.PolicyData;

  userList: User[];
  institutionList: Institution[] = [];

  influenceNameMap = {
    "1": "National",
    "2": "Provincial",
    "3": "District Level",
    "4": "Specific Locations",
  }

  alertHeader: string = "Policy Data Entry";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  institutionListDisabled = false;
  isDEO = false;

  constructor(private serviceProxy: ServiceProxy, private subServiceProxy: PolicyDataControllerServiceProxy,
    private masterDataControllerServiceProxy: MasterdataControllerServiceProxy,
    private roleGuardService: RoleGuardService) { }

  ngOnInit(): void {

    this.institutionListDisabled = !this.roleGuardService.checkRoles(['ccs-admin']);
    this.isDEO = this.roleGuardService.checkRoles(['ins-deo']);

    this.setInstitution();
    this.setUser();
    this.setDropDownData();
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }



  /**
   * set institution object
   */
  setInstitution = () => {
    this.serviceProxy.getOneBaseInstitutionControllerInstitution(this.institutionId, undefined, undefined, undefined).subscribe(a => {
      this.institution = a;
    })
  }

  /**
   * set user object
   */
  setUser = () => {
    this.serviceProxy.getOneBaseUserv2ControllerUser(this.loginUserId, undefined, undefined, undefined).subscribe(a => {
      this.loginUser = a;
    })
  }

  /**
   * set drop down data
   */
  setDropDownData = () => {
    //users
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
          this.reloadData();

        }

        console.log(this.userList);


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
          this.reloadData();
        }

      });
  }

  /**
   * reload data 
   */
  reloadData() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadRequestList(event);
  }

  /**
   * on page change event
   * @param event
   */
  loadRequestList = async (event: LazyLoadEvent) => {
    this.loading = true;
    this.dataRequestList = [];
    this.totalRecords = 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;

    //assigned data
    await this.subServiceProxy
      .getPolicyDataRequestsToDataEntry(pageNumber, event.rows, this.institutionId, this.loginUserId)
      .subscribe((res) => {
        if (res && res.items && res.items.length > 0) {
          for (let item of res.items) {
            item["documentList"] = [];
            item["amendmentRequiredError"] = false;
          }
          this.totalRecords = res.meta.totalItems;
          this.dataRequestList = res.items;
        }
        this.loading = false;
      });
  };

  /**
   * submit for review
   * @param row 
   */
  submit(row: any) {
    this.saveData(row, true);
  }

  /**
   * data save without submitting for review
   * @param row 
   */
  save(row: any) {
    this.saveData(row, false);
  }

  /**
   * save data
   * @param row 
   * @param submitForReview 
   */
  saveData(row: any, submitForReview: boolean) {

    if (row.amendments) {
      row.amendments = row.amendments.trim();
    }

    if (submitForReview) {
      let isError = false;

      if (!row.amendments || ! /^[a-zA-Z0-9  ,-.]{1,256}$/.test(row.amendments)) {
        isError = true;
        row["amendmentRequiredError"] = true;
      }

      if (isError) {
        //alert("please fill all the mandatory fields");
        this.DisplayAlert("please fill all the mandatory fields with valid values", AlertType.Warning);
        return;
      }
    } else {
      if (!row.amendments) {
        //alert("no data to save");
        this.DisplayAlert("No data to save", AlertType.Message);

        return;
      }
    }

    this.loading = true;

    let request = new PolicyDataSaveRequest();
    request.policyDataId = row.id;
    request.amendments = row.amendments;
    request.submitForReview = submitForReview;
    request.tempUserId = this.loginUserId;//TODO remove

    this.subServiceProxy.savePolicyData(request).subscribe(res => {
      if (res) {
        if (submitForReview) {
          // alert("submitted successfully");
          this.DisplayAlert("Submitted successfully", AlertType.Message);

          this.reloadData();
        } else {
          //alert("saved successfully");
          this.DisplayAlert("Saved successfully", AlertType.Message);

        }
      } else {
        // alert("failed to save");
        this.DisplayAlert("Failed to save", AlertType.Error);
      }
      this.loading = false;
    })

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
