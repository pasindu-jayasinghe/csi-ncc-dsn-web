import { DocumentsDocumentOwner } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { MasterdataControllerServiceProxy, ParameterControllerServiceProxy, Sector, ServiceProxy, Institution } from 'src/shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-parameter-location-data-search',
  templateUrl: './parameter-location-data-search.component.html',
  styleUrls: ['./parameter-location-data-search.component.scss']
})
export class ParameterLocationDataSearchComponent implements OnInit {

  rows: number = 50;
  categoryName: string = "";
  searchBy: any = {
    name: "",
    sector: null,
    year: null,
    institution: null
  }

  yearList: any[] = [];
  sectors: Sector[] = [];

  dataList: any[] = [];
  selectedList: any[] = [];
  loading: boolean = false;
  totalRecords: number = 0;

  institutions: Institution[];

  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};
  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ParameterLocationData;


  dataCategoryId: number = 0;

  constructor(private router: Router, private masterDataService: MasterdataControllerServiceProxy, private serviceProxy: ServiceProxy, private subServiceProxy: ParameterControllerServiceProxy, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.setDropDownData();

    this.route.queryParams.subscribe(params => {
      let categoryId: number = params['categoryId'];
      if (categoryId && categoryId > 0) {
        this.dataCategoryId = categoryId;
        this.setCategoryName(categoryId);
        this.search();
      }
    });
  }

  setCategoryName = (categoryId: number) => {
    this.serviceProxy.getOneBaseClimateChangeDataCategoryControllerClimateChangeDataCategory(categoryId, undefined, undefined, undefined).subscribe(res => {
      if (res) {
        this.categoryName = res.name;
      }
    })
  }

  /**
   * set dropdown data
   */
  setDropDownData = () => {

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.institutions = res.data;
      });

    this.masterDataService.getAllSector().subscribe(res => {
      this.sectors = res;
    });

    //years list
    this.yearList = [];
    let startYear = new Date().getFullYear() - 25;
    for (let i = startYear; i <= startYear + 50; i++) {
      this.yearList.push({ name: i });
    }
  }

  /**
   * search
   */
  search() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadData(event);
  }

  /**
   * load data
   * @param event 
   */
  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.totalRecords = 0;
    this.dataList = [];

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    let startDate = this.searchBy.year ? this.searchBy.year.name + "-01-01" : "";
    let endDate = this.searchBy.year ? (this.searchBy.year.name + 1) + "-01-01" : "";
    let name = this.searchBy.name ? this.searchBy.name : "";
    let sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    let institutionId = this.searchBy.institution ? this.searchBy.institution.id : 0;


    this.subServiceProxy.searchParameterLocationData(pageNumber, event.rows, startDate, endDate, sectorId, name, this.dataCategoryId, institutionId).subscribe(res => {
      if (res && res.items) {
        this.dataList = res.items;
        console.log(this.dataList);
        this.totalRecords = res.meta.totalItems;
      }
      this.loading = false;
    });
  }

  showDataDialog = (row: any) => {
    this.selectedRowToDisplayData = row;
    this.displayDataDialog = true;
  }

  newPrameter() {
    this.router.navigate(['/parameter-new']);
  }

}
