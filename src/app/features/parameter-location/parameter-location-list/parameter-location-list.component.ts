import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import {
  ClimateChangeDataCategory,
  District, DivisionalSecretariat, Institution, MasterdataControllerServiceProxy, Parameter,
  ParameterDataCollectionGeography, ParameterDataCollectionLocation, ParameterLocation,
  ParameterLocationControllerServiceProxy, ParameterLocationUpdateRequestDto,
  Province, Sector, ServiceProxy
} from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-parameter-location-list',
  templateUrl: './parameter-location-list.component.html',
  styleUrls: ['./parameter-location-list.component.scss']
})
export class ParameterLocationListComponent implements OnInit {

  paramter: Parameter;

  institutions: Institution[];

  provinces: Province[];

  districts: District[];
  districtsAll: District[];

  divisionalSecretariats: DivisionalSecretariat[];
  divisionalSecretariatsAll: DivisionalSecretariat[];

  climateChangeDataCategorys: ClimateChangeDataCategory[];
  sectors: Sector[];


  paramterLocations: ParameterLocation[];

  paramterLocationsAll: ParameterLocation[];



  rows: number = 10;
  loading: boolean;

  totalRecords: number;

  searchText: string = "";
  searchProvince: Province;
  searchDistrict: District;
  searchDS: DivisionalSecretariat;
  searchIns: Institution;

  searchCCDC: ClimateChangeDataCategory;
  searchSector: Sector;
  searchName: string;
  searchDescription: string;


  constructor(private router: Router,private serviceProxy: ServiceProxy,
    private masterdataService: MasterdataControllerServiceProxy,
    private parameterLocationControllerServiceProxy: ParameterLocationControllerServiceProxy,
  ) {


  }


  ngOnInit(): void {


    this.serviceProxy.getManyBaseInstitutionControllerInstitution(
      undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.institutions = res.data;
      });




  }

  search() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;

    this.load(a);

  }

  load(event: LazyLoadEvent) {

    this.loading = true;

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

    this.masterdataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.climateChangeDataCategorys = res;
    });

    // this.masterdataService.getAllSector().subscribe(res => {
    //   this.sectors = res;
    // });

    this.loadSector(this.searchCCDC);

    // get paramter location for this paramter
    this.serviceProxy.getManyBaseParameterLocationControllerParameterLocation(undefined,
      undefined,
      this.getFilter(),
      // undefined,
      undefined,
      // undefined,
      ["parameter.name,ASC"],
      ["parameter", "parameter.sector", "parameter.climateChangeDataCategory", "parameter.frequency", "province", "district", "divisionalSecretariat", "parentInstitution", "dataSource"],
      event.rows, event.first, 0, 0).subscribe(res => {
        console.log("pl====================", res);
        this.totalRecords = res.total;
        this.paramterLocations = res.data;
        this.loading = false;

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

  onChangeCCD() {
    this.loadSector(this.searchCCDC);
  }



  getFilter() {

    let filter: string[] = [];

    if (this.paramter?.id) {

      let searchbyParameter = 'parameter.id||$eq||' + this.paramter.id
      console.log("getFilter============", searchbyParameter);
      filter.push(searchbyParameter);
    }


    let searbByNameFilter = undefined;
    let searbProvinceFilter = undefined;
    let searbByDistrictFilter = undefined;
    let searbByDsFilter = undefined;
    let searchByDataSourceFilter = undefined;
    let searchCCDC = undefined;
    let searchBySector = undefined;


    if (this.searchName && this.searchName.length > 0) {
      searbByNameFilter = 'parameter.name||$cont||' + this.searchName;
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
      searbByDsFilter = 'divisionalSecretariat.id||$eq||' + this.searchDS.id;
      filter.push(searbByDsFilter);

    }


    if (this.searchIns && this.searchIns.id > 0) {
      searchByDataSourceFilter = 'dataSource.id||$eq||' + this.searchIns.id;
      filter.push(searchByDataSourceFilter);

    }

    if (this.searchCCDC !== undefined && this.searchCCDC !== null) {
      searchCCDC = 'parameter.climateChangeDataCategoryId||$eq||' + this.searchCCDC.id;
      filter.push(searchCCDC);
    }
    if (this.searchSector !== undefined && this.searchSector !== null) {
      searchBySector = 'parameter.sectorId||$eq||' + this.searchSector.id;
      filter.push(searchBySector);
    }

    if (filter.length > 0) {
      return filter;
    }
    else {
      return undefined;
    }


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

    }else
    { 
      this.districts = this.districtsAll;
      this.onChangeDistrict();
    }
  }

  onChangeDistrict() {
    this.divisionalSecretariats = [];
    if (this.searchDistrict?.id) {
      this.masterdataService.getAllDivisionalSecretariatByDistrict(this.searchDistrict.id).subscribe(res => {
        console.log(res);
        this.divisionalSecretariats = res;
      });
    } else{
      this.divisionalSecretariats = this.divisionalSecretariatsAll;
    }
  }

  new() {
    this.router.navigate(['/parameter-new']);
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      console.log(event);
      this.search();
    }
  }



}
