import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { AlertType } from 'src/app/shared/alert/alert.component';
import {
  District, DivisionalSecretariat, Institution, MasterdataControllerServiceProxy, Parameter,
  ParameterDataCollectionGeography, ParameterDataCollectionLocation, ParameterLocation,
  ParameterLocationControllerServiceProxy, ParameterLocationUpdateRequestDto,
  Province, ServiceProxy
} from 'src/shared/service-proxies/service-proxies';
import { ParamterService } from '../parameter/parameter.service';

@Component({
  selector: 'app-parameter-location',
  templateUrl: './parameter-location.component.html',
  styleUrls: ['./parameter-location.component.scss']
})
export class ParameterLocationComponent implements OnInit {

  @Input()
  paramter: Parameter;

  @Input()
  paramterLocations: ParameterLocation[];

  paramterLocationsAll: ParameterLocation[];



  rows: number = 10;
  loading: boolean;
  //projectProgrammes: ProjectProgramme[];
  //allProjectProgrames: ProjectProgramme[];

  totalRecords: number;

  ParameterDataCollectionGeography = ParameterDataCollectionGeography;

  ParameterDataCollectionLocation = ParameterDataCollectionLocation;


  allInstitutions: Institution[]

  singleLocationProvince: Province;
  singleLocationDistrict: District;
  singleLocationDS: DivisionalSecretariat;

  provinces: Province[] = [];
  selectedProvincesSelected: Province[] = [];
  selectedProvincesAllSelected: Province[] = [];

  districts: District[] = [];
  selectedDistrictsSelected: District[] = [];
  selectedDistrictsAllSelected: District[] = [];

  divisionalSecretariats: DivisionalSecretariat[] = [];
  SelecteddivisionalSecretariatsSelected: DivisionalSecretariat[] = [];
  SelecteddivisionalSecretariatsAllSelected: DivisionalSecretariat[] = [];

  alertHeader: string = "Parameter";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  isUpdatingLocations: boolean = false;

  bulkDatasourceAllocation = "0";
  bulkDatasourceAllocationDataSource: Institution;

  enableSaveSources : boolean = false;



  // export enum ParameterDataCollectionLocation {
  //   Single = <any>"Single",
  //   All = <any>"All",
  //   Multiple = <any>"Multiple",
  // }

  // export enum ParameterDataCollectionGeography {
  //   National = <any>"National",
  //   Province = <any>"Province",
  //   District = <any>"District",
  //   DivisionalSecretariat = <any>"DivisionalSecretariat",
  // }

  constructor(private serviceProxy: ServiceProxy,
    private router: Router,
    private masterdataService: MasterdataControllerServiceProxy,
    private parameterLocationControllerServiceProxy: ParameterLocationControllerServiceProxy,
    private paramterService: ParamterService) {
    this.paramterService = paramterService;
    this.paramterService.paramterReceived$.subscribe(x => {
      this.paramter = x;
      this.search();
    });

  }


  ngOnInit(): void {


    this.masterdataService.getAllProvince().subscribe(res => {
      console.log(res);
      this.provinces = res;
      this.selectedProvincesAllSelected = res;
    });

    this.masterdataService.getAllDistricts().subscribe(res => {
      console.log(res);
      this.districts = res;
      this.selectedDistrictsAllSelected = res;
    });

    this.masterdataService.getAllDivisionalSecretariat().subscribe(res => {
      console.log(res);
      this.divisionalSecretariats = res;
      this.SelecteddivisionalSecretariatsAllSelected = res;
    });

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(
      undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.allInstitutions = res.data;
      });



    // this.paramter.dataCollectionLocation == ParameterDataCollectionLocation.All
    //this.paramter.dataCollectionGeography == ParameterDataCollectionGeography.DivisionalSecretariat


  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  search() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;

    this.load(a);

  }

  load(event: LazyLoadEvent) {

    this.loading = true;
    // get paramter location for this paramter
    this.serviceProxy.getManyBaseParameterLocationControllerParameterLocation(undefined,
      undefined,
      this.getFilter(),
      // undefined,
      undefined,
      undefined,
      // ["name,ASC"],
      ["province", "district", "divisionalSecretariat", "parentInstitution", "dataSource"],
      event.rows, event.first, 0, 0).subscribe(res => {
        console.log("pl====================", res);
        this.totalRecords = res.total;
        this.paramterLocations = res.data;
        this.loading = false;

        this.paramterService.paramterLocationChnage(this.paramterLocations.length > 0);
        console.log(this.allInstitutions);
        this.paramterLocations.map(x => {
          x.dataSource = this.allInstitutions.find(({ id }) => id === x.dataSource.id);
          this.dataSourceChnages(false);
        });


        //this.allInstitutions = [];


      });

    this.serviceProxy.getManyBaseParameterLocationControllerParameterLocation(undefined,
      undefined,
      this.getFilter(),
      // undefined,
      undefined,
      undefined,
      // ["name,ASC"],
      ["province", "district", "divisionalSecretariat", "parentInstitution"],
      10000, event.first, 0, 0).subscribe(res => {
        console.log("pl====================", res);
        this.totalRecords = res.total;
        this.paramterLocationsAll = res.data;
        this.loading = false;
        this.isUpdatingLocations = false;


        //this.search();// refresh location source 

        this.updateLoacationselection();

      });


  }

  updateLoacationselection() {

    if (this.paramter.dataCollectionLocation == 1) {
      //single location
      if (this.paramter.dataCollectionGeography == 2) {
        // province
        this.singleLocationProvince = this.paramterLocationsAll[0]?.province;
      } else if (this.paramter.dataCollectionGeography == 3) {
        // district
        this.singleLocationDistrict = this.paramterLocationsAll[0]?.district;
      } else if (this.paramter.dataCollectionGeography == 4) {
        // ds
        this.singleLocationDS = this.paramterLocationsAll[0]?.divisionalSecretariat;
      }
    } else if (this.paramter.dataCollectionLocation == 3) {
      //muilti location
      if (this.paramter.dataCollectionGeography == 2) {
        // province
        this.selectedProvincesSelected = [];
        this.paramterLocationsAll.forEach(pl => {
          if (pl.province) {
            this.selectedProvincesSelected.push(pl.province);
          }
        });
      } else if (this.paramter.dataCollectionGeography == 3) {
        // district
        this.selectedDistrictsSelected = [];
        this.paramterLocationsAll.forEach(pl => {
          if (pl.district) {
            this.selectedDistrictsSelected.push(pl.district);
          }
        });
      } else if (this.paramter.dataCollectionGeography == 4) {
        // ds
        this.SelecteddivisionalSecretariatsSelected = [];
        this.paramterLocationsAll.forEach(pl => {
          if (pl.divisionalSecretariat) {
            this.SelecteddivisionalSecretariatsSelected.push(pl.divisionalSecretariat);
          }

        });
      }
    }

  }



  getFilter() {

    let filter: string[] = [];

    let searchbyParameter = 'parameter.id||$eq||' + this.paramter.id
    console.log("getFilter============", searchbyParameter);
    filter.push(searchbyParameter);

    return filter;

  }
  updateLocationSource() {



    let pulr = new ParameterLocationUpdateRequestDto();
    pulr.parameterId = this.paramter.id;
    pulr.parameterLocations = this.paramterLocations;
    // for (let index = 0; index < pulr.parameterLocations.length; index++) {
    //   const element = pulr.parameterLocations[index];
    //   let insTemp = element.dataSource;
    //   pulr.parameterLocations[index].dataSource = new Institution();
    //   pulr.parameterLocations[index].dataSource.id = insTemp.id;

    // }
    this.parameterLocationControllerServiceProxy.updateLocationsSource(pulr).subscribe(res => {

      this.search();

      this.DisplayAlert('Parameter data sources are updated!', AlertType.Message);

    }, error => {
      //alert("Error : Parameter data sources update is failed. Please try again.");
      this.DisplayAlert('Parameter data sources update is failed. Please try again.', AlertType.Error);

    });


  }

  updateLocationSourceAll() {




    let selectedParameterId = this.paramter.id;
    let selectedBulkDatasourceAllocationDataSourceId = this.bulkDatasourceAllocationDataSource.id;

    this.parameterLocationControllerServiceProxy.updateLocationsBulk(selectedParameterId, selectedBulkDatasourceAllocationDataSourceId).subscribe(res => {
      this.search();

      this.DisplayAlert('Parameter data sources are updated!', AlertType.Message);
      this.bulkDatasourceAllocationDataSource = null;
     

    }, error => {
      //alert("Error : Parameter data sources update is failed. Please try again.");
      this.DisplayAlert('Parameter data sources update is failed. Please try again.', AlertType.Error);

    });


  }
  updateLocations() {

    console.log("paramter-location - updateLocations");

    this.isUpdatingLocations = true;


    this.paramterService.saveLocation("");// nortify other components to save 


    // export enum ParameterDataCollectionLocation {
    //   Single = <any>"Single",
    //   All = <any>"All",
    //   Multiple = <any>"Multiple",
    // }

    // export enum ParameterDataCollectionGeography {
    //   National = <any>"National",
    //   Province = <any>"Province",
    //   District = <any>"District",
    //   DivisionalSecretariat = <any>"DivisionalSecretariat",
    // }


    let updateParameterLocatios: ParameterLocation[] = [];
    // save location data back to the server
    if (this.paramter.dataCollectionLocation == 1) {

      if (this.paramter.dataCollectionGeography == 1) {

        let pl = new ParameterLocation();
        pl.parameter = this.paramter;
        pl.isNational = true;
        updateParameterLocatios.push(pl);

      } else if (this.paramter.dataCollectionGeography == 2) {

        let pl = new ParameterLocation();
        pl.parameter = this.paramter;
        pl.province = this.singleLocationProvince;
        updateParameterLocatios.push(pl);

      } else if (this.paramter.dataCollectionGeography == 3) {

        let pl = new ParameterLocation();
        pl.parameter = this.paramter;
        pl.district = this.singleLocationDistrict;
        updateParameterLocatios.push(pl);

      } else if (this.paramter.dataCollectionGeography == 4) {

        let pl = new ParameterLocation();
        pl.parameter = this.paramter;
        pl.divisionalSecretariat = this.singleLocationDS;
        updateParameterLocatios.push(pl);

      }

    } else if (this.paramter.dataCollectionLocation == 2) {

      if (this.paramter.dataCollectionGeography == 1) {
        let pl = new ParameterLocation();
        pl.parameter = this.paramter;
        pl.isNational = true;
        updateParameterLocatios.push(pl);

      } else if (this.paramter.dataCollectionGeography == 2) {

        this.selectedProvincesAllSelected.forEach(pr => {
          let pl = new ParameterLocation();
          pl.parameter = this.paramter;
          pl.province = pr;
          updateParameterLocatios.push(pl);
        });

      } else if (this.paramter.dataCollectionGeography == 3) {

        this.selectedDistrictsAllSelected.forEach(d => {
          let pl = new ParameterLocation();
          pl.parameter = this.paramter;
          pl.district = d;
          updateParameterLocatios.push(pl);
        });

      } else if (this.paramter.dataCollectionGeography == 4) {

        this.SelecteddivisionalSecretariatsAllSelected.forEach(ds => {
          let pl = new ParameterLocation();
          pl.parameter = this.paramter;
          pl.divisionalSecretariat = ds;
          updateParameterLocatios.push(pl);

        });

      }

    } else if (this.paramter.dataCollectionLocation == 3) {


      if (this.paramter.dataCollectionGeography == 1) {

        let pl = new ParameterLocation();
        pl.parameter = this.paramter;
        pl.isNational = true;
        if (this.paramterLocations?.length == 0) {
          updateParameterLocatios.push(pl); // add a single location fo National
        } else {
          updateParameterLocatios.push(this.paramterLocations[0])
        }

      }
      if (this.paramter.dataCollectionGeography == 5) {

        let pl = new ParameterLocation();
        pl.parameter = this.paramter;
        pl.isSpecificLocation = true;
        if (this.paramterLocations?.length == 0) {
          updateParameterLocatios.push(pl); // add a single location fo Specific Location
        } else {
          updateParameterLocatios.push(this.paramterLocations[0])
        }


      } else if (this.paramter.dataCollectionGeography == 2) {

        this.selectedProvincesSelected.forEach(pr => {
          let pl = new ParameterLocation();
          pl.parameter = this.paramter;
          pl.province = pr;
          updateParameterLocatios.push(pl);
        });

      } else if (this.paramter.dataCollectionGeography == 3) {

        this.selectedDistrictsSelected.forEach(d => {
          let pl = new ParameterLocation();
          pl.parameter = this.paramter;
          pl.district = d;
          updateParameterLocatios.push(pl);
        });

      } else if (this.paramter.dataCollectionGeography == 4) {

        this.SelecteddivisionalSecretariatsSelected.forEach(ds => {
          let pl = new ParameterLocation();
          pl.parameter = this.paramter;
          pl.divisionalSecretariat = ds;
          //pl.id = ds.id
          updateParameterLocatios.push(pl);
        });

      }
    }

    // server update with updateParameterLocatios
    let pulr = new ParameterLocationUpdateRequestDto();
    pulr.parameterId = this.paramter.id;
    pulr.parameterLocations = updateParameterLocatios;
    if (this.paramter.dataCollectionGeography == 5) {
      pulr.locationName = this.paramter.locationName;
    }
    this.parameterLocationControllerServiceProxy.updateLocations(pulr).subscribe(res => {
      // alert("Parameter locations are updated!");
      this.DisplayAlert('Parameter locations are updated!', AlertType.Message);

      this.search();
      
    }, error => {
      // alert("Error : Parameter locations are update failed. Please try again.");
      this.DisplayAlert('Parameter locations are update failed. Please try again.', AlertType.Error);
      this.isUpdatingLocations = false;

    });


  }


  onBackClick() {
    this.router.navigate(['/parameter-location-list']);
  }

  dataSourceChnages(value : boolean) {
    this.enableSaveSources = value;
  }

}
