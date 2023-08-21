import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AlertType } from 'src/app/shared/alert/alert.component';
import { Currency, ProjectFundingDetail, ProjectFundingDetailDonorType, ServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-project-funding-details',
  templateUrl: './project-funding-details.component.html',
  styleUrls: ['./project-funding-details.component.scss']
})
export class ProjectFundingDetailsComponent implements OnInit, OnChanges {

  @Input() projectId: number = 0;
  @Input() currencyList: Currency[] = [];

  rows: number = 10;
  projectFundingDetails: ProjectFundingDetail[] = [];
  loading: boolean = false;
  totalRecords: number = 0;

  clonedProjectFundingDetails = {}

  localProjectId: number = 0;

  donorTypesMap: any = {
    "1": "Private",
    "2": "Public",
    "3": "International",
  };

  donorTypesList: any = [
    { name: "Private", value: 1 },
    { name: "Public", value: 2 },
    { name: "International", value: 3 }
  ];

  alertHeader: string = "Project Funding.";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  constructor(private serviceProxy: ServiceProxy) { }

  ngOnInit(): void {
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.projectId) {
      this.localProjectId = changes.projectId.currentValue;
      let event: any = {};
      event.rows = this.rows;
      event.first = 0;

      this.getProjectFundingDetails(event);
    }
  }

  getProjectFundingDetails = (event: LazyLoadEvent) => {
    this.loading = true;
    this.projectFundingDetails = [];
    this.totalRecords = 0;

    let filter: string[] = [];

    let query = "projectProgrammeId||$eq||" + this.localProjectId;
    filter.push(query);

    this.serviceProxy
      .getManyBaseProjectFundingDetailControllerProjectFundingDetail(
        undefined,
        undefined,
        filter.length > 0 ? filter : undefined,
        undefined,
        ["donor,ASC"],
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res) => {
        if (res && res.data && res.data.length > 0) {
          for (let record of res.data) {
            record["donorTypeObj"] = this.donorTypesList.find(obj => obj.value === record.donorType);
          }
          this.totalRecords = res.total;
          this.projectFundingDetails = res.data;
        }

        this.loading = false;
      });
  }

  /**
   * on enable row edit
   * @param record
   */
  onRowEditInit(record: ProjectFundingDetail) {
    this.clonedProjectFundingDetails[record.id] = { ...record };
  }

  /**
   * on save button click
   * @param record
   */
  onRowEditSave(record: ProjectFundingDetail, table: any, index: number) {
    if (!record.donor) {
      return false;
    }
    this.loading = true;
    if (record.id == 0) {
      this.serviceProxy
        .createOneBaseProjectFundingDetailControllerProjectFundingDetail(record)
        .subscribe((res) => {
          if (res && res.id) {
            delete this.clonedProjectFundingDetails[record.id];
            record.id = res.id;
            //alert("Added Successfully.");
            this.DisplayAlert('Added Successfully.', AlertType.Message);

          } else if (res && res.status === 409) {
            table.initRowEdit(this.projectFundingDetails[0]);
            //  alert("Donor name already exists for the project.");
            this.DisplayAlert('Donor name already exists for the project.', AlertType.Warning);

          }
          this.loading = false;
        }, (error) => {
          console.error(error);
          this.loading = false;
          table.initRowEdit(this.projectFundingDetails[index]);
          // alert("An error occurred, please try again.");
          this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

        });
    } else {
      this.serviceProxy
        .updateOneBaseProjectFundingDetailControllerProjectFundingDetail(record.id, record)
        .subscribe((res) => {
          if (res && res.id) {
            delete this.clonedProjectFundingDetails[record.id];
            // alert("Updated Successfully.");
            this.DisplayAlert('Updated Successfully.', AlertType.Message);

          } else if (res && res.status === 409) {
            table.initRowEdit(this.projectFundingDetails[index]);
            this.DisplayAlert('Donor name already exists for the project.', AlertType.Warning);

            // alert("Donor name already exists for the project.");
          }
          this.loading = false;
        }, (error) => {
          console.error(error);
          this.loading = false;
          table.initRowEdit(this.projectFundingDetails[index]);
          // alert("An error occurred, please try again.");
          this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

        });
    }
  }

  /**
   * on cancel button click
   * @param record
   * @param index
   */
  onRowEditCancel(record: ProjectFundingDetail, index: number) {
    if (record.id === 0) {
      this.projectFundingDetails.splice(0, 1);
    } else {
      this.projectFundingDetails[index] = this.clonedProjectFundingDetails[record.id];
    }
    delete this.clonedProjectFundingDetails[record.id];
  }

  /**
   * on add button click
   * @param table
   */
  onAddButtonClick = (table: any) => {
    if (this.projectFundingDetails.length > 0 && this.projectFundingDetails[0].id === 0) {
      this.projectFundingDetails[0].donor = "";
      this.projectFundingDetails[0].donorType = 1;
      this.projectFundingDetails[0].initialInvestment = 0;
      this.projectFundingDetails[0].initialInvestmentCurrency = this.currencyList && this.currencyList.length > 0 ? this.currencyList[0] : null;
      this.projectFundingDetails[0].annualFunding = 0;
      this.projectFundingDetails[0].annualFundingCurrency = this.currencyList && this.currencyList.length > 0 ? this.currencyList[0] : null;
    } else {
      let record = new ProjectFundingDetail();
      record.id = 0;
      record.status = 0;
      record.projectProgrammeId = this.projectId;
      record.donorType = 1;
      record["donorTypeObj"] = this.donorTypesList[0];
      record.initialInvestment = 0;
      record.initialInvestmentCurrency = this.currencyList && this.currencyList.length > 0 ? this.currencyList[0] : null;
      record.annualFunding = 0;
      record.annualFundingCurrency = this.currencyList && this.currencyList.length > 0 ? this.currencyList[0] : null;

      this.projectFundingDetails.unshift(record);
      this.onRowEditInit(this.projectFundingDetails[0]);
      table.initRowEdit(this.projectFundingDetails[0]);
    }
  };

  /**
   * 
   * @param event 
   * @param record 
   */
  onChangeDonorType = (event, record) => {
    record.donorType = event.value.value;
  }

}
