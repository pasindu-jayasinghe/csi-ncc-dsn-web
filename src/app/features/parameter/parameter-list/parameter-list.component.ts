import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { ClimateChangeDataCategory, MasterdataControllerServiceProxy, Parameter, ProjectProgramme, Sector, ServiceProxy, SubSector } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit {
  rows: number = 10;
  loading: boolean;
  projectProgrammes: ProjectProgramme[];
  allProjectProgrames: ProjectProgramme[];

  paramters: Parameter[];
  totalRecords: number;

  // projectTypes: ProjectType[];
  climateChangeDataCategorys: ClimateChangeDataCategory[];
  sectors: Sector[];
  subSectors: SubSector[];

  // searchProjectType: ProjectType;
  searchCCDC: ClimateChangeDataCategory;
  searchSector: Sector;
  searchSubSector: SubSector;
  searchName: string;
  SearchDescription: string;



  constructor(private serviceProxy: ServiceProxy,
    private masterdataService: MasterdataControllerServiceProxy,
    private router: Router) { }

  ngOnInit(): void {

    this.loadSector(this.searchCCDC);

    // this.masterdataService.getAllProjectType().subscribe(res => {
    //   this.projectTypes = res;
    // });

    this.masterdataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.climateChangeDataCategorys = res;
    });

    this.serviceProxy.getManyBaseProjectProgramControllerProjectProgramme(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.allProjectProgrames = res.data;
      });

  }

  async loadSector(searchCCDC: ClimateChangeDataCategory) {
    if (searchCCDC) {
      await this.masterdataService.getAllSectorByCCDataCatagary(searchCCDC.id).subscribe(a => {
        this.sectors = a;
      })
    }
    else {
      await this.masterdataService.getAllSector().subscribe(res => {
        this.sectors = res;
      });
    }

  }

  onChangeSector() {
    if (this.searchSector !== null && this.searchSector !== undefined) {
      this.masterdataService.getAllSubSectorbySector(this.searchSector.id).subscribe(res => {
        this.subSectors = res;
      });
    }
  }

  getFilter() {

    let searchbyProjectType = undefined;
    let searchCCDC = undefined;
    let searchBySector = undefined;
    let searchBySubSector = undefined;
    let searchByName = undefined;
    let searchByDescription = undefined;

    let filter: string[] = []

    // if (this.searchProjectType !== undefined && this.searchProjectType !== null) {
    //   searchbyProjectType = 'projectType.id||$eq||' + this.searchProjectType.id;
    //   filter.push(searchbyProjectType);
    // }
    if (this.searchCCDC !== undefined && this.searchCCDC !== null) {
      searchCCDC = 'climateChangeDataCategory.id||$eq||' + this.searchCCDC.id;
      filter.push(searchCCDC);
    }
    if (this.searchSector !== undefined && this.searchSector !== null) {
      searchBySector = 'sector.id||$eq||' + this.searchSector.id;
      filter.push(searchBySector);
    }
    if (this.searchSubSector !== undefined && this.searchSubSector !== null) {
      searchBySubSector = 'subSector.id||$eq||' + this.searchSubSector.id;
      filter.push(searchBySubSector);
    }
    if (this.searchName && this.searchName.length > 0) {
      searchByName = 'name||$cont||' + this.searchName;
      filter.push(searchByName);
    }
    if (this.SearchDescription && this.SearchDescription.length > 0) {
      searchByDescription = 'description||$cont||' + this.SearchDescription;
      filter.push(searchByDescription);
    }

    if (filter.length > 0) {
      return filter;
    }
    else {
      return undefined;
    }
  }

  search() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;

    this.load(a);

  }

  onChangeCCD() {
    this.loadSector(this.searchCCDC);
  }

  load(event: LazyLoadEvent) {
    this.loading = true;

    this.serviceProxy.getManyBaseParameterControllerParameter(undefined,
      undefined,
      this.getFilter(),
      undefined,
      ["createdOn,DESC"],
      ["province", "district", "divisionalSecretariat", "parentInstitution"],
      event.rows, event.first, 0, 0).subscribe(res => {
        this.totalRecords = res.total;
        this.paramters = res.data;
        this.loading = false;

      });


  }

  edit(parameter: Parameter) {
    console.log("edit user", parameter);

    this.router.navigate(['/parameter'], { queryParams: { id: parameter.id } });
  }


  new() {
    this.router.navigate(['/parameter-new']);
  }

}
