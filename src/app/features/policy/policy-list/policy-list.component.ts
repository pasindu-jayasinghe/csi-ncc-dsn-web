import { PolicyControllerServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { ClimateChangeDataCategory, MasterdataControllerServiceProxy, Policy, Sector, ServiceProxy, Institution } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.scss']
})
export class PolicyListComponent implements OnInit {

  rows: number = 10;

  loading: boolean;

  policyList: Policy[];
  institutions: Institution[] = [];

  totalRecords: number;

  climateChangeDataCategories: ClimateChangeDataCategory[];
  sectors: Sector[];

  searchBy: any = {
    name: "",
    sector: null,
    climateChangeDataCategory: null,
    institution: null,
    formulationinstitution: null
  };

  influenceNameMap = {
    "1": "National",
    "2": "Provincial",
    "3": "District Level",
    "4": "Specific Locations",
  }

  pendingApproveCount: number;

  approveType: { id: number, name: string }[] = [
    { "id": 1, "name": "Pending Approval" },
    { "id": 0, "name": "Approved" }
  ];
  searchApproveType: { id: number, name: string };



  constructor(private serviceProxy: ServiceProxy, private policyService: PolicyControllerServiceProxy,
    private masterDataService: MasterdataControllerServiceProxy,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.serviceProxy.getManyBasePolicyControllerPolicy(undefined,
      undefined,
      ['isPendingApprove||$eq||true'],
      undefined,
      undefined,
      undefined,
      10000, 0, 0, 0).subscribe(res => {
        this.pendingApproveCount = res.data.length;
      });

    this.loadDropDownData();
  }

  /**
   * load dropdown data on init
   */
  loadDropDownData = async () => {
    // this.masterDataService.getAllSector().subscribe(res => {
    //   this.sectors = res;
    // });

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.institutions = res.data;
      });

    this.loadSector(this.searchBy.climateChangeDataCategory)

    this.masterDataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.climateChangeDataCategories = res;
    });
  }

  async loadSector(searchCCDC: ClimateChangeDataCategory) {
    if (searchCCDC) {
      await this.masterDataService.getAllSectorByCCDataCatagary(searchCCDC.id).subscribe(a => {
        this.sectors = a;
      })
    }
    else {
      await this.masterDataService.getAllSector().subscribe(res => {
        this.sectors = res;
      });
    }

  }

  onChangeCCD() {
    this.loadSector(this.searchBy.climateChangeDataCategory);
  }

  /**
   * load data on init
   */
  search = async () => {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadPolicyList(event);
  };

  /**
   * get search filters list
   */
  getSearchFilter = () => {
    let filters: string[] = [];

    if (this.searchApproveType !== undefined && this.searchApproveType !== null) {
      let searchbyProjectType = 'isPendingApprove||$eq||' + (this.searchApproveType.id === 0);
      filters.push(searchbyProjectType);
    }

    if (this.searchBy.name) {
      let filter = "name||$cont||" + this.searchBy.name;
      filters.push(filter);
    }

    if (this.searchBy.climateChangeDataCategory) {
      let filter = 'climateChangeDataCategory.id||$eq||' + this.searchBy.climateChangeDataCategory.id;
      filters.push(filter);
    }

    if (this.searchBy.sector) {
      let filter = 'sector.id||$eq||' + this.searchBy.sector.id;
      filters.push(filter);
    }

    return filters;
  }

  /**
   * on page change event
   * @param event
   */
  loadPolicyList = (event: LazyLoadEvent) => {
    this.loading = true;
    this.policyList = [];
    this.totalRecords = 0;

    let name = this.searchBy.name ? this.searchBy.name : "";
    let formulatonInstitute = this.searchBy.formulationinstitution ? this.searchBy.formulationinstitution : "";


    let instutionId = this.searchBy.institution ? this.searchBy.institution.id : 0;
    let searcSector = this.searchBy.sector ? this.searchBy.sector.id : 0;
    let ccdCatagary = this.searchBy.climateChangeDataCategory ? this.searchBy.climateChangeDataCategory.id : 0;

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;
    let pagePerRow = event.rows;
    let isApprove = this.searchApproveType ? this.searchApproveType.id : -1;

    console.log(this.searchApproveType);
    console.log(isApprove);

    this.policyService.getPolicyList(pageNumber, pagePerRow, name, searcSector, ccdCatagary, instutionId, formulatonInstitute, isApprove).subscribe(res => {
      this.policyList = res.items;
      this.totalRecords = res.meta.totalItems;
      this.loading = false;
    }
    );



    // let filters = this.getSearchFilter();

    // this.serviceProxy
    //   .getManyBasePolicyControllerPolicy(
    //     undefined,
    //     undefined,
    //     filters.length > 0 ? filters : undefined,
    //     undefined,
    //     ["name,ASC"],
    //     undefined,
    //     event.rows,
    //     event.first,
    //     0,
    //     0
    //   )
    //   .subscribe((res) => {
    //     if (res && res.data && res.data.length > 0) {
    //       this.totalRecords = res.total;
    //       this.policyList = res.data;
    //     }

    //     this.loading = false;
    //   });
  };

  /**
   * on click edit
   * @param policy
   */
  onClickEdit(policy: Policy) {
    this.router.navigate(['/policy'], { queryParams: { id: policy.id } });
  }

  new() {
    this.router.navigate(['/policy-new']);
  }

}
