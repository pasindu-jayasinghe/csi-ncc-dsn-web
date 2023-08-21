import { LazyLoadEvent } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectProgramme, ServiceProxy, MasterdataControllerServiceProxy, Province, GetManyProjectProgrammeResponseDto, ProjectType, ClimateChangeDataCategory, Sector, SubSector, SDBenefit, Currency, FinancingScheme } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  rows: number = 10;
  loading: boolean;
  projectProgrammes: ProjectProgramme[];
  allProjectProgrames: ProjectProgramme[];
  totalRecords: number;

  projectTypes: ProjectType[];
  climateChangeDataCategorys: ClimateChangeDataCategory[];
  sectors: Sector[];
  subSectors: SubSector[];
  projectProgrammeType: { id: number, name: string }[] = [
    { "id": 0, "name": "Project" },
    { "id": 1, "name": "Programme" }
  ];

  approveType: { id: number, name: string }[] = [
    { "id": 0, "name": "Pending Approval" },
    { "id": 1, "name": "Approved" }
  ];

  searchProjectType: { id: number, name: string };
  searchApproveType: { id: number, name: string };
  searchCCDC: ClimateChangeDataCategory;
  searchSector: Sector;
  searchSubSector: SubSector;
  searchName: string;
  SearchDescription: string;

  pendingApproveCount: number = 0;


  constructor(private serviceProxy: ServiceProxy,
    private masterdataService: MasterdataControllerServiceProxy,
    private router: Router) { }

  ngOnInit(): void {


    this.masterdataService.getAllSector().subscribe(res => {
      this.sectors = res;
    });

    this.masterdataService.getAllProjectType().subscribe(res => {
      this.projectTypes = res;
    });

    this.masterdataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.climateChangeDataCategorys = res;
    });

    this.serviceProxy.getManyBaseProjectProgramControllerProjectProgramme(undefined,
      undefined,
      ['isPendingApprove||$eq||true'],
      undefined,
      undefined,
      undefined,
      10000, 0, 0, 0).subscribe(res => {
        this.pendingApproveCount = res.data.length;
      });

   


    // this.serviceProxy.getManyBaseProjectProgramControllerProjectProgramme(undefined,
    //   undefined,
    //   undefined,
    //   undefined,
    //   ["name,ASC"],
    //   undefined,
    //   1000, 0, 0, 0).subscribe(res => {
    //     this.allProjectProgrames = res.data;
    //   });

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
    let searchbyApprove = undefined;

    let filter: string[] = []



    if (this.searchApproveType !== undefined && this.searchApproveType !== null) {
      searchbyProjectType = 'isPendingApprove||$eq||' + (this.searchApproveType.id === 0);
      filter.push(searchbyProjectType);
    }

    if (this.searchProjectType !== undefined && this.searchProjectType !== null) {
      searchbyProjectType = 'isProject||$eq||' + (this.searchProjectType.id === 0);
      filter.push(searchbyProjectType);
    }
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

    this.loadProjectProgram(a);

  }

  loadProjectProgram(event: LazyLoadEvent) {
    this.loading = true;

    this.serviceProxy.getManyBaseProjectProgramControllerProjectProgramme(undefined,
      undefined,
      this.getFilter(),
      undefined,
      ["name,ASC"],
      ["province", "district", "divisionalSecretariat", "parentInstitution"],
      event.rows, event.first, 0, 0).subscribe(res => {
        this.totalRecords = res.total;
        this.projectProgrammes = res.data;
        this.loading = false;

      });


  }

  editProjectProgram(ins: ProjectProgramme) {
    this.router.navigate(['/project'], { queryParams: { id: ins.id } });
  }


  new() {
    this.router.navigate(['/project-new']);
  }


}
