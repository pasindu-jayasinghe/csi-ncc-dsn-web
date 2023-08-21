import { DocumentsDocumentOwner, DataUsageCategory, UserDataUsageCategoryControllerServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { AppControllerServiceProxy, ClimateChangeDataCategory, District, DivisionalSecretariat, MasterdataControllerServiceProxy, ParameterControllerServiceProxy, Province, Sector, ServiceProxy, ShoppingCartControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';

import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { ExcelExportService, IColumnProps, IExportAsExcelProps } from 'src/shared/excel-export.service';
import { AlertType } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-parameter-data-purchase',
  templateUrl: './parameter-data-purchase.component.html',
  styleUrls: ['./parameter-data-purchase.component.scss']
})
export class ParameterDataPurchaseComponent implements OnInit {

  @ViewChild('DataTable', { static: false }) DataTable: ElementRef;

  rows: number = 10;

  searchBy: any = {
    fromDate: null,
    toDate: null,
    sector: null,
    name: "",
    category: null,
    province: null,
    district: null,
    ds: null
  }

  dataList: any[] = [];
  selectedDataList: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  loadingOnPopup: boolean = false;

  sectors: Sector[] = [];
  categories: ClimateChangeDataCategory[] = [];
  provinces: Province[] = [];
  districts: District[] = [];
  districtsAll: District[] = [];
  dsList: DivisionalSecretariat[] = [];
  dsListAll: DivisionalSecretariat[] = [];

  loginUserId: number = 1;

  totalItemsInCart: number = 0;
  totalValueOfCart: number = 0;

  displayCartItemsDialog: boolean = false;
  cartItemList: any[] = [];

  displayDataDialog: boolean = false;
  selectedRowToDisplayData: any = {};
  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ParameterLocationData;
  userValid = false;
  displayuserDataTypeDialog = false;
  selectedUsageCategory: DataUsageCategory;
  dataUsageCategoryList: DataUsageCategory[];

  alertHeader: string = "Alert";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  paymentUpdateTrue: boolean;
  paymentUpdateFalse: boolean;

  constructor(private serviceProxy: ServiceProxy,
    private masterDataService: MasterdataControllerServiceProxy,
    private router: Router,
    private parameterServiceProxy: ParameterControllerServiceProxy,
    private messageService: MessageService,
    private cartServiceProxy: ShoppingCartControllerServiceProxy,
    private excelExportService: ExcelExportService,
    private appService: AppControllerServiceProxy,
    private datausagecatagaryService: UserDataUsageCategoryControllerServiceProxy,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
  ) { }

  async ngOnInit(): Promise<void> {

    await this.masterDataService.getDataUsageCategory().subscribe(a => {
      this.dataUsageCategoryList = a;
    })

    await this.datausagecatagaryService.getUserDataCategory().subscribe(res => {

      if (res && res.id > 0) {
        this.userValid = true;
        this.loadData();
      }
      else {
        this.displayuserDataTypeDialog = true;
        this.loadData();
      }
    })

    // await this.serviceProxy.getManyBaseUserDataUsageCategoryControllerUserDataUsageCategory(undefined,
    //   undefined,
    //   ['email||$eq||' + "this.user.email"],
    //   undefined, undefined, undefined, 1000, 0, 0, 0).subscribe(res => {
    //     if (res.data && res.data.length > 0) {
    //       this.loadData();
    //     }
    //     else {
    //       this.displayuserDataTypeDialog = true;
    //     }
    //   });



  }

  updateUserDataType() {
    this.datausagecatagaryService.updateUserDataCategory(this.selectedUsageCategory).subscribe(res => {
      if (res) {
        this.displayuserDataTypeDialog = false;
        this.userValid = true;
        this.loadData();
      }
    })

  }

  loadData() {
    this.loadDropDownData();
    this.setCartSummary();
    this.search();

    this.route.queryParams.subscribe(params => {
      this.paymentUpdateTrue = params['paymentupdate'] == "true";
      this.paymentUpdateFalse = params['paymentupdate'] == "false";

      if (this.paymentUpdateTrue) {
        console.log("show payment success..");
        this.confirmationService.confirm({
          message: 'Payment success, proceed to download your data.',
          header: 'Last payment status.',
          // acceptIcon: 'icon-not-visible',
          rejectIcon: 'icon-not-visible',
          rejectButtonStyleClass: 'p-button-text',
          rejectVisible: false,
          acceptLabel: 'Download Now',
          accept: () => {
            let transactionReferenceNumber = params['transactionReferenceNumber']
            this.cartServiceProxy.getPaidCartSummary(transactionReferenceNumber ? transactionReferenceNumber : "")
            .subscribe( res => 
              {
                  this.onClickDownloadFreeData(res.cartItemList, true);
              });
          },
          reject: () => {

          },
        });
      } else if (this.paymentUpdateFalse) {

        console.log("show payment failed..");

        this.confirmationService.confirm({
          message: 'Your last payment was failed, if you have any concirn please contact support line or try again',
          header: 'Last payment attemp failed',
          acceptIcon: 'icon-not-visible',
          // rejectIcon: 'icon-not-visible',
          rejectButtonStyleClass: 'p-button-text',
          rejectVisible: false,
          acceptLabel: 'Ok',
          accept: () => {
            //this.router.navigate(['/policy'], { queryParams: { id: res.id } });
          },
          reject: () => {

          },
        });
      }

    });

  }

  showDataDialog = (row: any) => {
    this.selectedRowToDisplayData = row;
    this.displayDataDialog = true;
  }

  /**
   * load dropdown data on init
   */
  loadDropDownData = async () => {
    // this.masterDataService.getAllSector().subscribe(res => {
    //   this.sectors = res;
    // });

    this.loadSector(this.searchBy.category);

    this.masterDataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.categories = res;
    });

    this.masterDataService.getAllProvince().subscribe(res => {
      this.provinces = res;
    });
    this.masterDataService.getAllDistricts().subscribe(res => {
      this.districts = res;
      this.districtsAll = res;
    });
    this.masterDataService.getAllDivisionalSecretariat().subscribe(res => {
      this.dsList = res;
      this.dsListAll = res;
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
    this.loadSector(this.searchBy.category);
  }

  /**
  * on change province
  */
  onChangeProvince() {
    this.districts = [];
    this.dsList = [];
    this.searchBy.district = null;
    this.searchBy.ds = null;
    if (this.searchBy.province) {
      this.masterDataService.getAllDistrictsByProvince(this.searchBy.province.id).subscribe(res => {
        this.districts = res;
      });
    } else {

      this.districts = this.districtsAll;

      this.dsList = this.dsListAll;

    }

  }

  /**
   * on change district
   */
  onChangeDistrict() {
    this.dsList = [];
    this.searchBy.ds = null;
    if (this.searchBy.district) {
      this.masterDataService.getAllDivisionalSecretariatByDistrict(this.searchBy.district.id).subscribe(res => {
        this.dsList = res;
      });
    } else {
      this.dsList = this.dsListAll;
    }
  }

  /**
   * set shopping cart totals on load
   */
  setCartSummary = async () => {
    this.cartServiceProxy.getActiveCartSummary().subscribe(res => {
      this.totalItemsInCart = res.totalItems ? res.totalItems : 0;
      this.totalValueOfCart = res.totalPrice ? res.totalPrice : 0;
      this.cartItemList = res.cartItemList;
    });
  }

  /**
   * search
   */
  search = () => {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.selectedDataList = [];

    this.loadDataList(event);
  }

  isNumber(value: any) {
    var x = +value; // made cast obvious for demonstration
    return x.toString() === value;
  }

  /**
   * load data
   * @param event 
   */
  loadDataList = (event: LazyLoadEvent) => {
    // if (!this.userValid) {
    //   return;
    // }
    this.loading = true;
    this.dataList = [];
    this.totalRecords = 0;

    let fromDate = this.searchBy.fromDate ? moment(this.searchBy.fromDate).format("YYYY-MM-DD") : "";
    let toDate = this.searchBy.toDate ? moment(this.searchBy.toDate).format("YYYY-MM-DD") : "";
    let sectorId = this.searchBy.sector ? this.searchBy.sector.id : 0;
    let name = this.searchBy.name ? this.searchBy.name.trim() : "";
    let categoryId = this.searchBy.category ? this.searchBy.category.id : 0;
    let provinceId = this.searchBy.province ? this.searchBy.province.id : 0;
    let districtId = this.searchBy.district ? this.searchBy.district.id : 0;
    let dsId = this.searchBy.ds ? this.searchBy.ds.id : 0;
    //let userId = this.loginUserId;//TODO remove

    let pageNumber = event.first === 0 ? 1 : (event.first / event.rows) + 1;

    this.parameterServiceProxy.getDataForPurchase(pageNumber, event.rows, fromDate, toDate, sectorId, name, categoryId, provinceId, districtId, dsId).subscribe(res => {
      console.log("-------------- 1 -----------------------------")
      if (res && res.items && res.items.length > 0) {
        this.dataList = res.items;
        this.totalRecords = res.totalRecords;
        //console.log(this.dataList);
        console.log("-------------- 2 -----------------------------")
      }

      console.log("-------------- 3 -----------------------------")

      this.loading = false;
    });
  }

  /**
   * on click add to cart button
   * @param item 
   */
  onClickAddToCart = (item: any) => {
    this.loading = true;
    this.loadingOnPopup = true;
    if(!item.unit){
      item.unit = "";
    }
    this.cartServiceProxy.addItemToCart(item).subscribe(res => {
      if (res && res.isSuccess) {
        this.totalItemsInCart = res.totalItems;
        this.totalValueOfCart = res.totalPrice;
        this.cartItemList = res.cartItemList;
        item.isInActiveCart = true;
        this.messageService.clear();
        this.messageService.add({ key: 'msg', severity: 'success', summary: 'Success', detail: 'Item added to cart' });
        this.setCartSummary();
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 'msg', severity: 'error', summary: 'Error', detail: 'Failed to add to cart' });
      }
      this.loading = false;
      this.loadingOnPopup = false;
    }, error => {
      this.messageService.clear();
      this.messageService.add({ key: 'msg', severity: 'error', summary: 'Error', detail: 'Failed to add to cart' });
      this.loading = false;
      this.loadingOnPopup = false;
    });

  }

  /**
   * on click remove from cart button
   * @param item 
   */
  onClickRemoveFromCart = (parameterDataId: number, item: any) => {
    this.loading = true;
    this.cartServiceProxy.removeItemFromCart(parameterDataId).subscribe(res => {
      if (res && res.isSuccess) {
        this.totalItemsInCart = res.totalItems;
        this.totalValueOfCart = res.totalPrice;
        this.cartItemList = res.cartItemList;

        if (item) {
          item.isInActiveCart = false;
        } else {
          let filter = this.dataList.filter(obj => obj.parameterDataId === parameterDataId);
          if (filter.length > 0) {
            filter[0].isInActiveCart = false;
          }
        }

        this.messageService.clear();
        this.messageService.add({ key: 'msg', severity: 'info', summary: 'Removed', detail: 'Item removed from cart' });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 'msg', severity: 'error', summary: 'Error', detail: 'Failed to remove from cart' });
      }
      this.loading = false;
    }, error => {
      this.messageService.clear();
      this.messageService.add({ key: 'msg', severity: 'error', summary: 'Error', detail: 'Failed to remove from cart' });
      this.loading = false;
    });
  }



  /**
   * open cart items popup
   */
  openCartItemPopup = () => {
    this.displayCartItemsDialog = true;
  }

  /**
   * export free data to excel
   */
  onClickDownloadFreeData = (cartItemListToExport, paid ) => {

    let columns: IColumnProps[] = [
      {
        key: "parameterName",
        headerText: "Parameter Name"
      },
      {
        key: "parameterDescription",
        headerText: "Parameter Description"
      },
      {
        key: "parameterLocation",
        headerText: "Location"
      },
      {
        key: "dataProvider",
        headerText: "Data Provider"
      },
      {
        key: "value",
        headerText: "Value"
      },
      {
        key: "unit",
        headerText: "Unit"
      },
      {
        key: "dataValidFrom",
        headerText: "From",
        type: "date",
        dateFormat: "YYYY-MM-DD"
      },
      {
        key: "dataValidTo",
        headerText: "To",
        type: "date",
        dateFormat: "YYYY-MM-DD"
      },
      {
        key: "frequency",
        headerText: "Data Frequency"
      }
    ];

    let inputs: IExportAsExcelProps = {
      data: cartItemListToExport.filter(obj => (paid || obj.price == 0)),
      fileName: "NCC DSN Data",
      sheetName: "Sheet 1",
      columnOptions: columns,
      autoColumnWidth: true
    }
    this.excelExportService.exportAsExcel(inputs);
  }

  onPurchase = async () => {

    console.log("on chck out");

    this.cartServiceProxy.checkout().subscribe(res => {
      console.log("on checkout url", res);

      if (res.url) {
        {
          console.log(res.url);
          this.confirmationService.confirm({
            message: 'You will be redirected to the secure payment gateway now.',
            header: 'Confirmation',
            acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectButtonStyleClass: 'p-button-text',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              window.location.href = res.url;
            },
            reject: () => {

            },
          });

        }
      }
    });




  }
}
