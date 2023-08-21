import { AlertType } from 'src/app/shared/alert/alert.component';
import { ConfirmationService } from 'primeng/api';
import { UnitOfMeasure, UnitOfMeasureControllerServiceProxy, UomConversion, CreateManyUomConversionDto } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { ServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-uom-conversion',
  templateUrl: './uom-conversion.component.html',
  styleUrls: ['./uom-conversion.component.scss']
})
export class UomConversionComponent implements OnInit {
  uoms: UnitOfMeasure[];
  unitOfMeasure: UnitOfMeasure = new UnitOfMeasure();
  relatedUOM: UomConversion[] = new Array();
  selectedRelatedUOM: UomConversion[];
  isSaving: boolean;

  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;
  alertHeader: string = "Parameter";
  loading: boolean = false;


  constructor(private serviceProxy: ServiceProxy,
    private uomCustomServiceProxy: UnitOfMeasureControllerServiceProxy,
    private confirmationService: ConfirmationService,) { }

  ngOnInit(): void {
    this.serviceProxy.getManyBaseUnitOfMeasureControllerUnitOfMeasure(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      10000, 0, 0, 0).subscribe(res => {
        this.uoms = res.data;
      });
  }

  async saveForm(fdata: any) {
    // if (this.selectedRelatedUOM && this.selectedRelatedUOM.length > 0) {
    //   let dataenterItems = this.selectedRelatedUOM.filter(a => a.conversionValue == undefined || a.conversionValue <= 0)
    //   console.log(dataenterItems);
    //   if (dataenterItems && dataenterItems.length > 0) {
    //     console.log("123");
    //     this.confirmationService.confirm({
    //       message: 'Please enter conversion Value for selected Item(s).',
    //       header: 'Error',
    //       acceptIcon: 'icon-not-visible',
    //       rejectIcon: 'icon-not-visible',
    //       rejectButtonStyleClass: 'p-button-text',
    //       rejectVisible: false,
    //       acceptLabel: 'Ok',
    //       accept: () => {

    //       },
    //       reject: () => {

    //       },
    //     });

    //     //return;
    //   }
    //   else {
    //     for (const a of this.selectedRelatedUOM) {
    //       if (a.id > 0) {
    //         await this.serviceProxy.updateOneBaseUomConversionControllerUomConversion(a.id, a)
    //           .subscribe(a => {
    //             // this.confirmationService.confirm({
    //             //   message: 'successfully Updated',
    //             //   header: 'UOMConversion',
    //             //   acceptIcon: 'icon-not-visible',
    //             //   rejectIcon: 'icon-not-visible',
    //             //   rejectButtonStyleClass: 'p-button-text',
    //             //   rejectVisible: false,
    //             //   acceptLabel: 'Ok',
    //             //   accept: () => {

    //             //   },
    //             //   reject: () => {

    //             //   },
    //             // });
    //             console.log("successfully Updated");
    //           })
    //       }
    //       else {
    //         await this.serviceProxy.createOneBaseUomConversionControllerUomConversion(a).subscribe(a => {

    //           console.log("successfully Updated");
    //         })

    //       }


    //     }


    //     this.confirmationService.confirm({
    //       message: 'successfully Updated',
    //       header: 'UOMConversion',
    //       acceptIcon: 'icon-not-visible',
    //       rejectIcon: 'icon-not-visible',
    //       rejectButtonStyleClass: 'p-button-text',
    //       rejectVisible: false,
    //       acceptLabel: 'Ok',
    //       accept: () => {

    //       },
    //       reject: () => {

    //       },
    //     });




    //   }
    // }
    let isError = false;
    if (this.relatedUOM && this.relatedUOM.length > 0) {
      // let dataenterItems = this.relatedUOM.filter(a => a.conversionValue != undefined && a.conversionValue > 0)
      // console.log(dataenterItems);
      // if (dataenterItems.length == 0) {
      //   console.log("123");
      //   this.confirmationService.confirm({
      //     message: 'Please enter conversion Value.',
      //     header: 'Error',
      //     acceptIcon: 'icon-not-visible',
      //     rejectIcon: 'icon-not-visible',
      //     rejectButtonStyleClass: 'p-button-text',
      //     rejectVisible: false,
      //     acceptLabel: 'Ok',
      //     accept: () => {

      //     },
      //     reject: () => {

      //     },
      //   });

      //   //return;
      // }
      // else {
      for (const a of this.relatedUOM) {
        if (a.id > 0) {
          console.log(a.conversionValue)
          if (a.conversionValue == 0) {
            await this.serviceProxy.deleteOneBaseUomConversionControllerUomConversion(a.id)
              .subscribe(a => {
                console.log("successfully deleted");
              }, error => {
                isError = true;
              })
          }
          else {
            await this.serviceProxy.updateOneBaseUomConversionControllerUomConversion(a.id, a)
              .subscribe(a => {
                console.log("successfully Updated!");
              }, error => {
                isError = true;
              })
          }

        }
        else {
          if (a.conversionValue && a.conversionValue >= 0) {
            await this.serviceProxy.createOneBaseUomConversionControllerUomConversion(a)
              .subscribe(a => {
                console.log("successfully Save");
              }, error => {
                isError = true;
              })
          }

        }


      }

      if (!isError) {
        this.confirmationService.confirm({
          message: 'Successfully Updated!',
          header: 'UOM Conversion',
          acceptIcon: 'icon-not-visible',
          rejectIcon: 'icon-not-visible',
          rejectButtonStyleClass: 'p-button-text',
          rejectVisible: false,
          acceptLabel: 'Ok',
          accept: () => {
            this.changeUOM();
            window.scroll(0,0);
          },
          reject: () => {

          },
        });

        //alert("Save Successfully");
      }
      else {
        this.confirmationService.confirm({
          message: 'Error occurred,please try again.',
          header: 'UOM Conversion',
          acceptIcon: 'icon-not-visible',
          rejectIcon: 'icon-not-visible',
          rejectButtonStyleClass: 'p-button-text',
          rejectVisible: false,
          acceptLabel: 'Ok',
          accept: () => {
            this.changeUOM();
          },
          reject: () => {

          },
        });
      }



      //}
    }
    else {
      //alert("test");
    }

  }

  canEnableInput(param: any) {
    // let isdisable = true;
    // if (this.selectedRelatedUOM) {
    //   let selectParam = this.selectedRelatedUOM.find(a => a.id == param.id);
    //   if (selectParam) {
    //     isdisable = false;
    //   }
    // }

    // return isdisable;

    return false;
  }

  async changeUOM() {
    console.log(this.unitOfMeasure.id)
    this.loading = true;
    this.selectedRelatedUOM = new Array();
    if (this.unitOfMeasure.id) {
      let filter: string[] = new Array();
      filter.push('unitOfMeasure.id||$eq||' + this.unitOfMeasure.id);
      await this.serviceProxy.getManyBaseUomConversionControllerUomConversion(undefined,
        undefined, filter, undefined, undefined, undefined, 1000, 0, 0, 0).subscribe(a => {
          console.log(a.data)
          this.unitOfMeasure.uomConversions = a.data;

          let selectedKind = this.unitOfMeasure.kindOfQuantity;
          let sameKindUOMs = this.uoms.filter(a => a.kindOfQuantity == selectedKind && a.id != this.unitOfMeasure.id);
          console.log(selectedKind)

          this.relatedUOM = new Array();
          for (const u of sameKindUOMs) {
            if (this.unitOfMeasure.uomConversions) {
              let saveRelatedUOM = this.unitOfMeasure.uomConversions.find(a => a.relatedUnitOfMeasure.id == u.id);
              console.log("==============" + saveRelatedUOM + "==========")
              if (saveRelatedUOM) {
                this.relatedUOM.push(saveRelatedUOM);
              }
              else {
                let dumyRelatedUOM = new UomConversion();
                dumyRelatedUOM.unitOfMeasure = this.unitOfMeasure;
                dumyRelatedUOM.relatedUnitOfMeasure = u;
                this.relatedUOM.push(dumyRelatedUOM);
              }
            }
          }

          this.loading = false;

        })

    }
  }

}
