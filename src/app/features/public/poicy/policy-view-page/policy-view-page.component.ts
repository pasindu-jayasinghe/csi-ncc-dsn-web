import { ExcelExportService, IExportAsExcelProps, IColumnProps } from 'src/shared/excel-export.service';
import { LazyLoadEvent } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Policy, Sector, ClimateChangeDataCategory, ServiceProxy, MasterdataControllerServiceProxy, PublicControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { stringify } from '@angular/compiler/src/util';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-policy-view-page',
  templateUrl: './policy-view-page.component.html',
  styleUrls: ['./policy-view-page.component.scss']
})
export class PolicyViewPageComponent implements OnInit {

  items: Policy[];
  selectedItems: Policy[];

  rows: number = 10;
  loading: boolean;
  totalRecords: number = 0;

  pageNumber: number;
  recordePerPage: number;

  influseList = [{ id: 4, name: "Specific Locations" }, { id: 3, name: "District Level" }, { id: 1, name: "National" }, { id: 2, name: "Provincial" },];
  selectedinfluse: { id: number, name: string };


  name: string;
  sectorList: Sector[];
  selectedSector: Sector;
  climateChangeDataCategorys: ClimateChangeDataCategory[];
  selectedclimateChangeDataCategory: ClimateChangeDataCategory;

  letDownload: boolean = true;



  constructor(private serviceProxy: ServiceProxy, private masterdataService: MasterdataControllerServiceProxy,
    private activeRoute: ActivatedRoute,
    private publicServiceProxy: PublicControllerServiceProxy, private excelExportService: ExcelExportService) { }

  ngOnInit(): void {

    this.loadSector(this.selectedclimateChangeDataCategory);


    this.masterdataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.climateChangeDataCategorys = res;
    });

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

    let influnceId = this.selectedinfluse ? this.selectedinfluse.id : 0;
    let searcSector = this.selectedSector ? this.selectedSector.id : 0;
    let ccdCatagary = this.selectedclimateChangeDataCategory ? this.selectedclimateChangeDataCategory.id : 0;

    this.publicServiceProxy.getPolicyViewPageDetails(this.pageNumber, this.recordePerPage, name, searcSector, ccdCatagary, influnceId).subscribe(res => {
      this.items = res.items;
      this.totalRecords = res.meta.totalItems;
      this.loading = false;
    }
    );

    this.loading = false;

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

    let columns: IColumnProps[] = [
      {
        key: "name",
        headerText: "Policy /Regulations"
      },
      {
        key: "proposedDateOfCommence",
        headerText: "Adopted Year",
        type: "date",
        dateFormat: "YYYY"
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
        key: "influence",
        headerText: "Influence"
      },
      {
        key: "description",
        headerText: "Description"
      },
      {
        key: "formulationInstitutionname",
        headerText: "Formulation Body"
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

    let excelOutput: any[] = new Array();
    let ccd: string;
    let sctor: string;

    for (const e of this.selectedItems) {

      ccd = "";
      sctor = "";

      for (const c of e.climateChangeDataCategory.map((value, index) => ({ index, value }))) {
        if (c.index != e.climateChangeDataCategory.length - 1) {
          ccd = ccd + `${c.value.name}, `
        }
        else {
          ccd = ccd + `${c.value.name}`
        }
      }

      for (const c of e.sector.map((value, index) => ({ index, value }))) {
        if (c.index != e.climateChangeDataCategory.length - 1) {
          sctor = sctor + `${c.value.name}, `
        }
        else {
          sctor = sctor + `${c.value.name}`
        }
      }

      // console.log(e.proposedDateOfCommence.toISOString());
      // let year = e.proposedDateOfCommence !== null ? new Date(e.proposedDateOfCommence.toISOString()).getFullYear() : "";
      let excelRow = {
        "name": e.name,
        "proposedDateOfCommence": e.proposedDateOfCommence,
        "influence": e.influence == 1 ? "National" : e.influence == 2 ? "Provincial" : e.influence == 3 ? "District Level" : e.influence == 4 ? "Specific Locations" : "",
        "formulationInstitutionname": e.formulationInstitution?.name,
        "publishLatestUpdate": e.publishLatestUpdate,
        "publishDataCount": e.publishDataCount,
        "documentCount": e.documentCount,
        "ccdatacategory": ccd,
        "sector": sctor,
        "description": e.description,
      }

      excelOutput.push(excelRow);

    }

    let inputs: IExportAsExcelProps = {
      data: excelOutput,
      fileName: "Policy",
      sheetName: "Sheet 1",
      columnOptions: columns,
      autoColumnWidth: true
    }
    this.excelExportService.exportAsExcel(inputs);
  }


}
