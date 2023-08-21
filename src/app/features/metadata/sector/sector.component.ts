import { ClimateChangeDataCategory, MasterdataControllerServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Message } from 'primeng//api';
import { Component, OnInit } from "@angular/core";
import {
  Sector,
  ServiceProxy,
} from "src/shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { AlertType } from "src/app/shared/alert/alert.component";

@Component({
  selector: "app-sector",
  templateUrl: "./sector.component.html",
  styleUrls: ["./sector.component.scss"],
})
export class SectorComponent implements OnInit {
  rows: number = 15;

  loading: boolean;

  sectors: Sector[];

  totalRecords: number;

  clonedSectors: any = {};
  climateChangeDataCategorys: ClimateChangeDataCategory[];


  searchBy: { name: string; description: string } = {
    name: "",
    description: "",
  };

  alertHeader: string = "Sector List";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  constructor(private serviceProxy: ServiceProxy, private masterDataService: MasterdataControllerServiceProxy) { }

  ngOnInit(): void {

    this.masterDataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.climateChangeDataCategorys = res;
    });

    this.search();
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  /**
   * load data on init
   */
  search = async () => {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadSectors(event);
  };

  /**
   * on page change event
   * @param event
   */
  loadSectors = (event: LazyLoadEvent) => {
    this.loading = true;
    this.sectors = [];
    this.totalRecords = 0;

    let filter: string[] = [];
    if (this.searchBy.name) {
      let nameQuery = "name||$cont||" + this.searchBy.name;
      filter.push(nameQuery);
    }
    if (this.searchBy.description) {
      let descQuery = "description||$cont||" + this.searchBy.description;
      filter.push(descQuery);
    }

    this.serviceProxy
      .getManyBaseSectorControllerSector(
        undefined,
        undefined,
        filter.length > 0 ? filter : undefined,
        undefined,
        ["name,ASC"],
        undefined,
        event.rows,
        event.first,
        0,
        0
      )
      .subscribe((res) => {
        if (res && res.data && res.data.length > 0) {
          this.totalRecords = res.total;
          this.sectors = res.data;
          console.log(this.sectors);
        }

        this.loading = false;
      });
  };

  /**
   * on enable row edit
   * @param sector
   */
  onRowEditInit(sector: Sector) {
    this.clonedSectors[sector.id] = { ...sector };
  }

  /**
   * on save button click
   * @param sector
   */
  onRowEditSave(sector: Sector, table: any, index: number) {
    if (!sector.name) {
      return false;
    }
    this.loading = true;
    if (sector.id == 0) {
      this.serviceProxy
        .createOneBaseSectorControllerSector(sector)
        .subscribe((res) => {
          if (res && res.id) {
            delete this.clonedSectors[sector.id];
            sector.id = res.id;
            //alert("Created Successfully.");
            this.DisplayAlert('Created successfully!', AlertType.Message);

          } else if (res && res.status === 409) {
            table.initRowEdit(this.sectors[0]);
            // alert("Name already exist.");
            this.DisplayAlert('Name already exist.', AlertType.Warning);

          }
          this.loading = false;
        }, (error) => {
          console.error(error);
          this.loading = false;
          table.initRowEdit(this.sectors[index]);
          // alert("An error occurred, please try again.");
          this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

        });
    } else {
      this.serviceProxy
        .updateOneBaseSectorControllerSector(sector.id, sector)
        .subscribe((res) => {
          if (res && res.id) {
            delete this.clonedSectors[sector.id];
            //alert("Updated Successfully.");
            this.DisplayAlert('Updated Successfully.', AlertType.Message);

          } else if (res && res.status === 409) {
            table.initRowEdit(this.sectors[index]);
            //alert("Name already exist.");
            this.DisplayAlert('Name already exist.', AlertType.Warning);

          }
          this.loading = false;
        }, (error) => {
          console.error(error);
          this.loading = false;
          table.initRowEdit(this.sectors[index]);
          //alert("An error occurred, please try again.");
          this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

        });
    }
  }

  /**
   * on cancel button click
   * @param sector
   * @param index
   */
  onRowEditCancel(sector: Sector, index: number) {
    if (sector.id === 0) {
      this.sectors.splice(0, 1);
    } else {
      this.sectors[index] = this.clonedSectors[sector.id];
    }
    delete this.clonedSectors[sector.id];
  }

  /**
   * on add button click
   * @param table
   */
  onAddButtonClick = (table: any) => {
    if (this.sectors.length > 0 && this.sectors[0].id === 0) {
      this.sectors[0].name = "";
      this.sectors[0].description = "";
    } else {
      let sector = new Sector();
      sector.id = 0;
      sector.sortOrder = 1;
      sector.status = 0;
      sector.description = "";

      this.sectors.unshift(sector);
      this.onRowEditInit(this.sectors[0]);
      table.initRowEdit(this.sectors[0]);
    }
  };

  inputEvent(item) {

    //console.log(" inputEvent item :",this.sanitizer.sanitize(SecurityContext.SCRIPT,item.name));

    
      item["invalidInput"] = ! /^[a-zA-Z0-9  ,-.]{1,256}$/.test(item.name)
      item["invalidInputDes"] = ! /^[a-zA-Z0-9  ,-.]{1,256}$/.test(item.description)
    

  }
}
