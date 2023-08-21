import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DocumentsDocumentOwner, Institution, MasterdataControllerServiceProxy, ProjectDataSaveRequest, ProjectProgramData, ProjectProgramDataControllerServiceProxy, ProjectStatus, ServiceProxy, User } from 'src/shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { AlertType } from 'src/app/shared/alert/alert.component';
import { RoleGuardService } from 'src/app/auth/role-guard.service';
import { AuthConfigService } from 'src/app/auth/keyclock/auth-config.service';

@Component({
  selector: 'app-project-data-entry',
  templateUrl: './project-data-entry.component.html',
  styleUrls: ['./project-data-entry.component.scss']
})
export class ProjectDataEntryComponent implements OnInit {

  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;

  institutionId: number = 0;
  institution: Institution;

  loginUserId: number = 0;
  loginUser: User;

  dataRequestList: ProjectProgramData[] = [];

  projectStatusList: ProjectStatus[] = [];

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ProjectProgramData;

  userList: User[];
  institutionList: Institution[] = [];

  alertHeader: string = "Project/Programme Data Entry";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  institutionListDisabled = false;
  isDEO = false;

  constructor(private serviceProxy: ServiceProxy, private subServiceProxy: ProjectProgramDataControllerServiceProxy,
    private masterDataControllerServiceProxy: MasterdataControllerServiceProxy,
    private roleGuardService: RoleGuardService, private authService: AuthConfigService) {
    this.loginUserId = this.authService.loginUserId;
  }

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

        }
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

    //statuses
    this.serviceProxy.getManyBaseProjectStatusControllerProjectStatus(undefined,
      undefined,
      undefined,
      undefined, ["name,ASC"], undefined, 1000, 0, 0, 0
    ).subscribe(res => {
      this.projectStatusList = res.data;
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
      .getProjectDataRequestsToDataEntry(pageNumber, event.rows, this.institutionId, this.loginUserId)
      .subscribe((res) => {
        if (res && res.items && res.items.length > 0) {
          for (let item of res.items) {

            if (item.projectStatus) {
              let filter = this.projectStatusList.filter(obj => obj.id === item.projectStatus.id);
              if (filter.length > 0) {
                item.projectStatus = filter[0];
              }
            }

            this.setDuration(item.projectProgram);
            item["documentList"] = [];
            item["statusRequiredError"] = false;
            item["progressRequiredError"] = false;
          }
          this.totalRecords = res.meta.totalItems;
          this.dataRequestList = res.items;
        }
        this.loading = false;
      });
  };

  /**
  * set duration of project
  * @param row 
  */
  setDuration = (row: any) => {
    if (row.projectDuration) {
      row["duration"] = `${moment(new Date(row.proposedDateOfCommence)).year()} - ${moment(new Date(row.proposedDateOfCommence)).add(Number(row.projectDuration) * 12, 'M').year()}`;
    } else {
      row["duration"] = `${moment(new Date(row.proposedDateOfCommence)).year()} - ${moment(new Date(row.proposedDateOfCommence)).year()}`;
    }
  }

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

    debugger;
    if (row.projectProgress) {
      row.projectProgress = row.projectProgress.trim();
    }

    if (submitForReview) {
      let isError = false;

      if (!row.projectStatus ||  ! /^[a-zA-Z0-9  ,-.]{1,256}$/.test(row.projectStatus.id)) {
        isError = true;
        row["statusRequiredError"] = true;
      }

      if (!row.projectProgress ||  ! /^[a-zA-Z0-9  ,-.]{1,256}$/.test(row.projectProgress)) {
        isError = true;
        row["progressRequiredError"] = true;
      }

      if (isError) {
        //alert("please fill all the mandatory fields");
        this.DisplayAlert('Please fill all the mandatory fields with valid values.', AlertType.Warning);

        return;
      }
    } else {
      if (!row.projectStatus && !row.projectProgress) {
        // alert("no data to save");
        this.DisplayAlert('No data to save.', AlertType.Warning);

        return;
      }
    }

    this.loading = true;

    let request = new ProjectDataSaveRequest();
    request.projectProgramDataId = row.id;
    request.projectStatus = row.projectStatus;
    request.projectProgress = row.projectProgress;
    request.submitForReview = submitForReview;
    request.tempUserId = this.loginUserId;//TODO remove

    this.subServiceProxy.saveProjectData(request).subscribe(res => {
      if (res) {
        if (submitForReview) {
          // alert("Submitted successfully");
          this.DisplayAlert('Submitted successfully.', AlertType.Message);

          this.reloadData();
        } else {
          //alert("Saved successfully");
          this.DisplayAlert('Saved successfully.', AlertType.Message);

        }
      } else {
        //alert("Failed to save.");
        this.DisplayAlert('Failed to save.', AlertType.Error);

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
