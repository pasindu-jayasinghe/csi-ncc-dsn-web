import { IColumnProps, IExportAsExcelProps } from 'src/shared/excel-export.service';
import { ExcelExportService } from './../../../../shared/excel-export.service';
import { LazyLoadEvent } from 'primeng/api';
import { PublicControllerServiceProxy, ProjectProgramme, ClimateChangeDataCategory } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { ServiceProxy, Sector, MasterdataControllerServiceProxy, ProjectStatus } from 'src/shared/service-proxies/service-proxies';
import { log } from 'console';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-project-view-page',
  templateUrl: './project-view-page.component.html',
  styleUrls: ['./project-view-page.component.scss']
})
export class ProjectViewPageComponent implements OnInit {

  items: ProjectProgramme[];
  selectedItems: ProjectProgramme[];


  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;

  pageNumber: number;
  recordePerPage: number;

  yearList: { id: number, name: string }[] =
    [
      { id: 2000, name: "2000" }, { id: 2001, name: "2001" }, { id: 2002, name: "2002" }, { id: 2003, name: "2003" },
      { id: 2004, name: "2004" }, { id: 2005, name: "2005" }, { id: 2006, name: "2006" }, { id: 2007, name: "2007" }, { id: 2008, name: "2008" }, { id: 2009, name: "2009" }, { id: 2010, name: "2010" }, { id: 2011, name: "2011" }, { id: 2012, name: "2012" }, { id: 2013, name: "2013" }, { id: 2014, name: "2014" }, { id: 2015, name: "2015" }, { id: 2016, name: "2016" }, { id: 2017, name: "2017" }, { id: 2018, name: "2018" }, { id: 2019, name: "2019" }, { id: 2020, name: "2020" }, { id: 2021, name: "2021" }, { id: 2022, name: "2022" }]
  name: string;
  selectedYear: { id: number, name: string };
  sectorList: Sector[];
  selectedSector: Sector;
  climateChangeDataCategorys: ClimateChangeDataCategory[];
  selectedclimateChangeDataCategory: ClimateChangeDataCategory;
  status: ProjectStatus[];
  selectedStatus: ProjectStatus;
  location: string;

  letDownload: boolean = true;






  constructor(private serviceProxy: ServiceProxy, private masterdataService: MasterdataControllerServiceProxy,
    private publicServiceProxy: PublicControllerServiceProxy, 
    private activeRoute: ActivatedRoute,
    private excelExportService: ExcelExportService) { }

  ngOnInit(): void {

    this.loadSector(this.selectedclimateChangeDataCategory);

    this.masterdataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.climateChangeDataCategorys = res;
    }); 

    this.serviceProxy.getManyBaseProjectStatusControllerProjectStatus(undefined,
      undefined,
      undefined,
      undefined, ["name,ASC"], undefined, 1000, 0, 0, 0
    ).subscribe(res => {
      this.status = res.data;
    })

    this.activeRoute.queryParams.subscribe(params => {
      if (params['downlod']) {
        this.letDownload = params['downlod'] == "true";
      } else {
        this.letDownload = true;
      }
    });

  }

  async loadSector(searchCCDC: ClimateChangeDataCategory) {
    if (searchCCDC) {
      await this.masterdataService.getAllSectorByCCDataCatagary(searchCCDC.id).subscribe(a => {
        this.sectorList = a;
      })
    }
    else {
      await this.masterdataService.getAllSector().subscribe(res => {
        this.sectorList = res;
      });
    }

  }

  onChangeCCD() {
    this.loadSector(this.selectedclimateChangeDataCategory);
  }


  getItems() {
    this.loading = true;

    let name = this.name ? this.name : "";
    let location = this.location ? this.location : "";
    let dateofCommence = this.selectedYear ? this.selectedYear.id : 0;
    let searcSector = this.selectedSector ? this.selectedSector.id : 0;
    let ccdCatagary = this.selectedclimateChangeDataCategory ? this.selectedclimateChangeDataCategory.id : 0;
    let status = this.selectedStatus ? this.selectedStatus.id : 0;

    this.publicServiceProxy.getProjectViewPageDetails(this.pageNumber, this.recordePerPage, name, dateofCommence, searcSector, ccdCatagary, status, location).subscribe(res => {
      this.items = res.items;
      this.totalRecords = res.meta.totalItems;
      this.loading = false;
    }
    );

  }

  search() {
    this.getItems();
  }

  loadItem(event: LazyLoadEvent) {
    this.pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    this.recordePerPage = event.rows;
    this.getItems();
  }

  excelDownload() {

    let excelOutput: any[] = new Array();

    for (const e of this.selectedItems) {

      let prov = e.province ? "Province: " + e.province?.name : "";
      let dis = e.district ? "District: " + e.district?.name : "";
      let ds = e.divisionalSecretariat ? "D.S: " + e.divisionalSecretariat?.name : "";

      let publicDoonr = e.publicDonor ? "public," : "";
      let privateDoonr = e.privateDonor ? " Private," : "";
      let internationalDonor = e.internationalDonor ? "international," : "";
      let privatePublicDonor = e.privatePublicDonor ? "Private Public Partnership," : "";
      let ngoDoonor = e.ngoDonor ? "Ngo," : "";

      let cost = e.totalProjectCost ? e.totalProjectCost : "";



      let excelRow = {
        "name": e.name,
        "isProject": e.isProject ? "Project" : "Programme",
        "DataSource": e.dataSource?.name,
        "projectProponents": e.projectProponents,
        "ccdatacategory": e.climateChangeDataCategory?.name,
        "sector": e.sector?.name,
        "location": `${prov} ${dis} ${ds}`,
        "partiesInvolved": e.partiesInvolved,
        "proposedDateOfCommence": e.proposedDateOfCommence,
        "projectDuration": e.projectDuration + " (Years)",
        "projectStatusname": e.projectStatus?.name,
        "publishLatestUpdate": e.publishLatestUpdate,
        // "publishDataCount": e.publishDataCount,
        // "documentCount": e.documentCount,
        "projectType": e.projectType?.name,
        "projectCurrentStatus": new Date(moment(e.proposedDateOfCommence, "YYYY-MM-DDTHH:mm:ssZ").add(1, 'y').toISOString()) < new Date()
          ? "Operational" : "Closed",
        "description": e.description,
        "scope": e.scope,
        "outcomes": e.outcomes,
        "ghgEmissions": e.ghgEmissions,
        "adaptationBenefits": e.adaptationBenefits,
        "indirectSDBenefit": e.indirectSDBenefit?.name,
        "directSDBenefit": e.directSDBenefit?.name,
        "implementingEntities": e.implementingEntities,
        "executingEntity": e.executingEntity,
        "beneficiaries": e.beneficiaries,
        "financingScheme": e.financingScheme,
        "doonor": `${publicDoonr} ${privateDoonr} ${internationalDonor} ${privatePublicDonor} ${ngoDoonor}`,
        "projectCost": `${cost} ${e.totalProjectCostCurrency ? e.totalProjectCostCurrency.name : ""}`,
        //"projectCost": "",



      }
      excelOutput.push(excelRow);
    }


    let columns: IColumnProps[] = [
      {
        key: "name",
        headerText: "Project /Programme name"
      },
      {
        key: "isProject",
        headerText: " Project/programme"
      },
      {
        key: "DataSource",
        headerText: "Data Source"
      },
      {
        key: "ccdatacategory",
        headerText: "CC Data Category"
      },
      {
        key: "sector",
        headerText: "Sector"
      },
      {
        key: "projectType",
        headerText: "Project Type"
      },
      {
        key: "proposedDateOfCommence",
        headerText: "Date of commencement",
        type: "date",
        dateFormat: "YYYY"
      },
      {
        key: "projectDuration",
        headerText: "Duration"
      },
      {
        key: "projectCurrentStatus",
        headerText: "Current status of the project"
      },
      {
        key: "description",
        headerText: "Objective(s) of the project"
      },
      {
        key: "scope",
        headerText: "Main components of the project"
      },
      {
        key: "location",
        headerText: "Location"
      },
      {
        key: "outcomes",
        headerText: " Project Outcomes"
      },
      {
        key: "ghgEmissions",
        headerText: "GHG Emission Reductions"
      },
      {
        key: "adaptationBenefits",
        headerText: " Adaptation Benefits"
      },
      {
        key: "indirectSDBenefit",
        headerText: " Relevant indirect SD benefits"
      },
      {
        key: "directSDBenefit",
        headerText: "Relevant Direct SD benefits"
      },
      {
        key: "implementingEntities",
        headerText: "Implementing Entity"
      },
      {
        key: "executingEntity",
        headerText: "Executing Entity"
      },
      {
        key: "partiesInvolved",
        headerText: "Parties involved"
      },
      {
        key: "beneficiaries",
        headerText: "Benefitiaries"
      },
      {
        key: "financingScheme",
        headerText: "Financing Scheme"
      },
      {
        key: "doonor",
        headerText: "Donors"
      },
      // {
      //   key: "projectCost",
      //   headerText: "Total Project Cost"
      // },


      {
        key: "projectProponents",
        headerText: "Project proponent"
      },
      {
        key: "projectStatusname",
        headerText: "Status of operation"
      },
      {
        key: "publishLatestUpdate",
        headerText: "Latest update"
      },
      // {
      //   key: "publishDataCount",
      //   headerText: "Number of updates"
      // },
      // {
      //   key: "documentCount",
      //   headerText: "Number of Project documents"
      // }
    ];


    let inputs: IExportAsExcelProps = {
      data: excelOutput,
      fileName: "Project",
      sheetName: "Sheet 1",
      columnOptions: columns,
      autoColumnWidth: true
    }
    this.excelExportService.exportAsExcel(inputs);
  }

}
