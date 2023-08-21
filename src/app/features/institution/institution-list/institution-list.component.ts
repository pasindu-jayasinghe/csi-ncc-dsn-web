import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { District, DivisionalSecretariat, Institution, MasterdataControllerServiceProxy, Province, ServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { InstitutionFormComponent } from '../institution-form/institution-form.component';
import { InstitutionModule } from '../institution.module';

@Component({
  selector: 'app-institution-list',
  templateUrl: './institution-list.component.html',
  styleUrls: ['./institution-list.component.scss']
})
export class InstitutionListComponent implements OnInit {

  rows: number = 10;

  loading: boolean;

  institutions: Institution[];

  allInstitutions: Institution[]

  provinces: Province[];

  districts: District[];
  districtsAll: District[];

  divisionalSecretariats: DivisionalSecretariat[];
  divisionalSecretariatsAll: DivisionalSecretariat[];

  totalRecords: number;

  searchText: string = "";
  searchProvince: Province;
  searchDistrict: District;
  searchDS: DivisionalSecretariat;
  searchIns: Institution;


  constructor(
    private serviceProxy: ServiceProxy,
    private masterdataService: MasterdataControllerServiceProxy,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.masterdataService.getAllProvince().subscribe(res => {
      console.log(res);
      this.provinces = res;
    });

    this.masterdataService.getAllDistricts().subscribe(res => {
      console.log(res);
      this.districts = res;
      this.districtsAll = res;
    });

    this.masterdataService.getAllDivisionalSecretariat().subscribe(res => {
      console.log(res);
      this.divisionalSecretariats = res;
      this.divisionalSecretariatsAll = res;
    });

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.allInstitutions = res.data;
      });

    // this.masterdataService.getAllDivisionalSecretariat().subscribe(res => {
    //   console.log(res);
    //   this.divisionalSecretariats = res;
    // });

  }


  search() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;

    this.loadInstitution(a);

  }


  getFilter() {

    let searbByNameFilter = undefined;
    let searbProvinceFilter = undefined;
    let searbByDistrictFilter = undefined;
    let searbByDsFilter = undefined;
    let searchByLinedFilter = undefined;

    let filter: string[] = []

    if (this.searchText && this.searchText.length > 0) {
      searbByNameFilter = 'name||$cont||' + this.searchText;
      filter.push(searbByNameFilter);
    }
    if (this.searchProvince && this.searchProvince.id > 0) {
      searbProvinceFilter = 'province.id||$eq||' + this.searchProvince.id;
      filter.push(searbProvinceFilter);

    }
    if (this.searchDistrict && this.searchDistrict.id > 0) {
      searbByDistrictFilter = 'district.id||$eq||' + this.searchDistrict.id;
      filter.push(searbByDistrictFilter);

    }
    if (this.searchDS && this.searchDS.id > 0) {
      searbByDsFilter = 'divisionalSecretariat.id||$eq||9' + this.searchDS.id;
      filter.push(searbByDsFilter);

    }


    if (this.searchIns && this.searchIns.id > 0) {
      searchByLinedFilter = 'parentInstitution.id||$eq||' + this.searchIns.id;
      filter.push(searchByLinedFilter);

    }

    if (filter.length > 0) {
      return filter;
    }
    else {
      return undefined;
    }
  }


  loadInstitution(event: LazyLoadEvent) {

    console.log("loadInstitution===", event)
    this.loading = true;

    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      this.getFilter(),
      undefined,
      ["name,ASC"],
      ["province", "district", "divisionalSecretariat", "parentInstitution"],
      event.rows, event.first, 0, 0).subscribe(res => {

        console.log(res);
        this.totalRecords = res.total;
        this.institutions = res.data;
        this.loading = false;

      });


  }

  editInstitution(ins: Institution) {

    this.router.navigate(['/institution'], { queryParams: { id: ins.id } });
  }

  onChangeProvince() {
    this.divisionalSecretariats = [];
    this.districts = [];
    if (this.searchProvince?.id) {
      this.masterdataService.getAllDistrictsByProvince(this.searchProvince.id).subscribe(res => {
        console.log(res);
        this.districts = res;
      });

      this.masterdataService.getAllDivisionalSecretariatByProvince(this.searchProvince.id).subscribe(res => {
        console.log(res);
        this.divisionalSecretariats = res;
      });
    } else {
      this.districts = this.districtsAll;
      this.divisionalSecretariats = this.divisionalSecretariatsAll;
    }
  }

  onChangeDistrict() {
    this.divisionalSecretariats = [];
    if (this.searchDistrict?.id) {
      this.masterdataService.getAllDivisionalSecretariatByDistrict(this.searchDistrict.id).subscribe(res => {
        console.log(res);
        this.divisionalSecretariats = res;
      });
    } else {
      this.onChangeProvince();
    }
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      console.log(event);
      this.search();
    }
  }

  onChangeDS() {
    console.log("onChangeDS");
  }

  onChangeIns() {
    console.log("onChangeIns");
  }

  new() {
    this.router.navigate(['/institution-new']);
  }




}
