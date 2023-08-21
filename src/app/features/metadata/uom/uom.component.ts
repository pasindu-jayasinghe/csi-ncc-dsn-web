import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  ServiceProxy,
  UnitOfMeasure,
  UnitOfMeasureControllerServiceProxy,
} from "src/shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { AlertType } from "src/app/shared/alert/alert.component";

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UomComponent implements OnInit {

  rows: number = 15;

  loading: boolean;

  uomList: UnitOfMeasure[];

  totalRecords: number;

  clonedUOM: any = {};

  searchBy: any = {
    name: "",
    kindOfQuantity: null,
    print: "",
    isAMetricUnit: null,
    definitionValue: "",
    definitionValueText: "",
    definitionUnit: ""
  };

  metricUnitSearchDropdown = [
    { label: 'Select...', value: null },
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  metricUnitEditDropdown = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];

  // kindOfQuantityList: any[] = ["length, weight, volume"];
  kindOfQuantitySearchList = [
    { label: 'Select...', value: null }
  ];
  kindOfQuantityEditList: any[] = [];

  alertHeader: string = "List of Units of Measure";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  constructor(private serviceProxy: ServiceProxy, private uomCustomServiceProxy: UnitOfMeasureControllerServiceProxy) { }

  ngOnInit(): void {
    this.getKindOfQuantityList();
    this.search();
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  /**
   * refresh search fields
   */
  refreshSearchFields = () => {
    this.searchBy = {
      name: "",
      kindOfQuantity: null,
      print: "",
      isAMetricUnit: null,
      definitionValue: "",
      definitionValueText: "",
      definitionUnit: ""
    };
  }

  /**
   * init kind of quantity lists
   */
  initKindOfQuantity = () => {
    this.kindOfQuantitySearchList = [
      { label: 'Select...', value: null }
    ];
    this.kindOfQuantityEditList = [];
  }

  /**
   * get distinct kind of quantity list
   */
  getKindOfQuantityList = async () => {
    this.initKindOfQuantity();
    this.uomCustomServiceProxy.getKindOfQuantityList().subscribe(res => {
      if (res && res.length > 0) {
        let list = res.map(val => {
          return {
            label: val,
            value: val
          }
        });
        this.kindOfQuantitySearchList = this.kindOfQuantitySearchList.concat(list);
        this.kindOfQuantityEditList = list;
      }
    })
  }

  /**
   * load data on init
   */
  search = async () => {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadUOMList(event);
  };

  /**
   * get search filters list
   */
  getSearchFilter = () => {
    let filters: string[] = [];
    if (this.searchBy.name) {
      let filter = "name||$cont||" + this.searchBy.name;
      filters.push(filter);
    }

    if (this.searchBy.kindOfQuantity) {
      let filter = "kindOfQuantity||$cont||" + this.searchBy.kindOfQuantity;
      filters.push(filter);
    }

    if (this.searchBy.print) {
      let filter = "print||$cont||" + this.searchBy.print;
      filters.push(filter);
    }

    if (this.searchBy.isAMetricUnit !== null) {
      let filter = "isAMetricUnit||$eq||" + this.searchBy.isAMetricUnit;
      filters.push(filter);
    }

    if (this.searchBy.definitionValue) {
      let filter = "definitionValue||$eq||" + this.searchBy.definitionValue;
      filters.push(filter);
    }

    if (this.searchBy.definitionValueText) {
      let filter = "definitionValueText||$cont||" + this.searchBy.definitionValueText;
      filters.push(filter);
    }

    if (this.searchBy.definitionUnit) {
      let filter = "definitionUnit||$cont||" + this.searchBy.definitionUnit;
      filters.push(filter);
    }

    return filters;
  }

  /**
   * on page change event
   * @param event
   */
  loadUOMList = (event: LazyLoadEvent) => {
    this.loading = true;
    this.uomList = [];
    this.totalRecords = 0;

    let filters = this.getSearchFilter();

    this.serviceProxy
      .getManyBaseUnitOfMeasureControllerUnitOfMeasure(
        undefined,
        undefined,
        filters.length > 0 ? filters : undefined,
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
          this.uomList = res.data;
        }

        this.loading = false;
      });
  };

  /**
   * on enable row edit
   * @param uom
   */
  onRowEditInit(uom: UnitOfMeasure) {
    this.clonedUOM[uom.id] = { ...uom };
  }

  /**
   * on save button click
   * @param sector
   */
  onRowEditSave(uom: UnitOfMeasure, table: any, index: number) {
    if (!uom.name) {
      return false;
    }
    this.loading = true;
    if (uom.id == 0) {

      //create
      this.serviceProxy
        .createOneBaseUnitOfMeasureControllerUnitOfMeasure(uom)
        .subscribe((res) => {
          if (res && res.id) {
            delete this.clonedUOM[uom.id];
            uom.id = res.id;

            //push new kind of quantity to lists
            if (this.kindOfQuantitySearchList.findIndex(obj => obj.value === uom.kindOfQuantity) == -1) {
              let option = { label: uom.kindOfQuantity, value: uom.kindOfQuantity }
              this.kindOfQuantitySearchList.push(option);
              this.kindOfQuantityEditList.push(option);
            }

            //alert("Created Successfully."); 
            this.DisplayAlert('Created successfully!', AlertType.Message);

          } else if (res && res.status === 409) {
            table.initRowEdit(this.uomList[0]);
            //alert("Name already exist.");
            this.DisplayAlert('Name already exist.', AlertType.Warning);

          }
          this.loading = false;
        }, (error) => {
          console.error(error);
          this.loading = false;
          table.initRowEdit(this.uomList[index]);
          this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

          // alert("An error occurred, please try again.");
        });

    } else {

      //update
      this.serviceProxy
        .updateOneBaseUnitOfMeasureControllerUnitOfMeasure(uom.id, uom)
        .subscribe((res) => {
          if (res && res.id) {

            //refresh kind of quantity lists
            let previousObj = this.clonedUOM[uom.id];
            if (previousObj && previousObj.kindOfQuantity !== uom.kindOfQuantity) {
              this.getKindOfQuantityList();
            }

            delete this.clonedUOM[uom.id];
            this.DisplayAlert('Updated Successfully.', AlertType.Message);

            // alert("Updated Successfully.");
          } else if (res && res.status === 409) {
            table.initRowEdit(this.uomList[index]);
            //alert("Name already exist.");
            this.DisplayAlert('Name already exist.', AlertType.Warning);

          }
          this.loading = false;
        }, (error) => {
          console.error(error);
          this.loading = false;
          table.initRowEdit(this.uomList[index]);
          // alert("An error occurred, please try again.");
          this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

        });
    }
  }

  /**
   * on cancel button click
   * @param uom
   * @param index
   */
  onRowEditCancel(uom: UnitOfMeasure, index: number) {
    if (uom.id === 0) {
      this.uomList.splice(0, 1);
    } else {
      this.uomList[index] = this.clonedUOM[uom.id];
    }
    delete this.clonedUOM[uom.id];
  }

  /**
   * on add button click
   * @param table
   */
  onAddButtonClick = (table: any) => {
    if (this.uomList.length > 0 && this.uomList[0].id === 0) {
      this.uomList[0].name = "";
    } else {
      let uom = new UnitOfMeasure();
      uom.id = 0;
      uom.isAMetricUnit = true;
      uom.kindOfQuantity = "";
      uom.print = "";
      uom.definitionValueText = "";
      uom.definitionValue = 0;
      uom.definitionUnit = "";
      uom.status = 0;

      this.uomList.unshift(uom);
      this.onRowEditInit(this.uomList[0]);
      table.initRowEdit(this.uomList[0]);
    }
  };

  inputEvent(item) {
    item["invalidInput"] = ! /^[a-zA-Z0-9  ,-.%/^]{1,256}$/.test(item.name)
    item["invalidInputDes"] = ! /^[a-zA-Z0-9  ,-./%^]{1,256}$/.test(item.description)
    item["invalidInputPrint"] = ! /^[a-zA-Z0-9  ,-./%^]{1,256}$/.test(item.description)
 
  }

}
