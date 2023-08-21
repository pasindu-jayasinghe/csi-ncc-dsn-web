import { ClimateImpact, Deadline, DocumentsDocumentOwner, ParameterDataType } from './../../../../shared/service-proxies/service-proxies';
import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClimateChangeDataCategory, Frequency, MasterdataControllerServiceProxy, Parameter, ParameterDataCollectionGeography, ParameterDataCollectionLocation, ParameterLocation, Policy, ProjectProgramme, Sector, SectorMOE, ServiceProxy, SubSector, UnitOfMeasure } from 'src/shared/service-proxies/service-proxies';
import { ParameterLocationComponent } from '../../parameter-location/parameter-location.component';
import { ParamterService } from '../parameter.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlertType } from 'src/app/shared/alert/alert.component';
import { Console } from 'console';


@Component({
  selector: 'app-parameter-form',
  templateUrl: './parameter-form.component.html',
  styleUrls: ['./parameter-form.component.scss'],
  providers: [ParamterService, ConfirmationService, MessageService]
})

export class ParameterFormComponent implements OnInit {


  isNew: boolean = true;

  editEntytyId: number;

  parameter: Parameter = new Parameter();

  uoms: UnitOfMeasure[];
  datatypes: ParameterDataType[];

  ccdcategory: ClimateChangeDataCategory[];

  frequencies: Frequency[];

  sectors: Sector[];
  subSectors: SubSector[];
  sectorMOEs: SectorMOE[];
  projectProgrammes: ProjectProgramme[];
  policies: Policy[];
  climateImpacts: ClimateImpact[];
  deadlines: Deadline[];

  paramterLocations: ParameterLocation[] = [];

  paramterLocationsAvailable: boolean = false;

  displayModal: boolean = false;
  displayMessage: string = "Created successfully!";
  activeTabIndex: number = 0;

  alertHeader: string = "Parameter";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  relatedParam: Parameter[];

  isSaving: boolean = false;

  documentList: Document[] = new Array();

  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.Parameter;



  constructor(private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private masterdataService: MasterdataControllerServiceProxy,
    private router: Router,
    private paramterService: ParamterService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.paramterService.paramterUpdate$.subscribe(x => {

      this.updateLocations();
    });

    this.paramterService.parameterLocationsAvailaleUpdated$.subscribe(x => {
      this.paramterLocationsAvailable = x;
    });

  }

  async ngOnInit(): Promise<void> {

    await this.masterdataService.getAllClimateImpact().subscribe(res => {
      this.climateImpacts = res;
    });

    await this.masterdataService.getAllDeadline().subscribe(res => {
      this.deadlines = res;
    });

    await this.masterdataService.getAllFrequncy().subscribe(res => {
      this.frequencies = res;
    });

    await this.serviceProxy.getManyBaseUnitOfMeasureControllerUnitOfMeasure(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      10000, 0, 0, 0).subscribe(res => {
        this.uoms = res.data;
      });



    await this.masterdataService.getAllParameterDataTypes().subscribe(res => {
      this.datatypes = res;
    });


    //datatypes

    await this.serviceProxy.getManyBaseClimateChangeDataCategoryControllerClimateChangeDataCategory(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      10000, 0, 0, 0).subscribe(res => {
        this.ccdcategory = res.data;
      });

    // this.serviceProxy.getManyBaseSectorControllerSector(undefined,
    //   undefined,
    //   undefined,
    //   undefined,
    //   ["name,ASC"],
    //   undefined,
    //   10000, 0, 0, 0).subscribe(res => {
    //     this.sectors = res.data;
    //   });


    // this.serviceProxy.getManyBaseSubSectorControllerSubSector(undefined,
    //   undefined,
    //   undefined,
    //   undefined,
    //   ["name,ASC"],
    //   undefined,
    //   10000, 0, 0, 0).subscribe(res => {
    //     this.subSectors = res.data; 
    //   });

    this.serviceProxy.getManyBaseSectorMOEControllerSectorMOE(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      10000, 0, 0, 0).subscribe(res => {
        this.sectorMOEs = res.data;
      });

    this.serviceProxy.getManyBaseProjectProgramControllerProjectProgramme(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      10000, 0, 0, 0).subscribe(res => {
        this.projectProgrammes = res.data;
      });

    //policies

    this.serviceProxy.getManyBasePolicyControllerPolicy(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      10000, 0, 0, 0).subscribe(res => {
        this.policies = res.data;
      });

    this.route.queryParams.subscribe(params => {
      this.editEntytyId = params['id'];
      if (this.editEntytyId && this.editEntytyId > 0) {
        this.isNew = false;
        this.serviceProxy.getOneBaseParameterControllerParameter(this.editEntytyId, undefined, undefined, 0).subscribe(res => {
          this.parameter = res;
          if (this.parameter.unitOfMeasure) {
            let uomfind = this.uoms.find(a => a.id == this.parameter.unitOfMeasure.id);
            this.parameter.unitOfMeasure = uomfind;
          }
          this.paramterService.paramterReceived(res);
          this.parameter.frequency = this.frequencies ? this.frequencies.find(a => a.id == this.parameter.frequency.id) : null;
          this.onChangeCCD();

        });
      } else {
        this.parameter.isPublicData = true;
      }
      if (params['activeTabIndex'] > 0) {
        this.activeTabIndex = params['activeTabIndex'];
      }

    });


  }

  onnameKeyDown(event: any) {
    console.log("============= Event ===============");

    let skipWord = ["of", "the", "in", "On", "-", "_", "/"];
    let searchText = this.removeFromString(skipWord, this.parameter.name).trim();


    if (!searchText || searchText?.length < 4) {
      console.log("========== Return");
      this.relatedParam = null;
      return;
    }

    let words = searchText.split(" ");

    let orfilter: string[] = new Array();
    for (const w of words) {
      orfilter.push('name||$cont||' + w.trim())
    }



    this.serviceProxy.getManyBaseParameterControllerParameter(undefined,
      undefined,
      undefined,
      orfilter,
      undefined,
      undefined,
      10, 0, 0, 0).subscribe(res => {
        console.log(res);
        if (this.parameter.name) {
          this.relatedParam = res.data;
          console.log(this.relatedParam)
        }
      });
  }

  escape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  removeFromString(arr, str) {
    let escapedArr = arr.map(v => escape(v))
    let regex = new RegExp("(?:^|\\s)" + escapedArr.join('|') + "(?!\\S)", "gi")
    return str.replace(regex, '')
  }


  onChangeCCD() {
    this.masterdataService.getAllSectorByCCDataCatagary(this.parameter.climateChangeDataCategory.id).subscribe(res => {
      this.sectors = res;
    });
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  onChangeSector() {
    if (this.parameter.sector !== null && this.parameter.sector !== undefined) {
      this.masterdataService.getAllSubSectorbySector(this.parameter.sector.id).subscribe(res => {
        this.subSectors = res;
      });
    }
  }

  isSampleValuevalid(): boolean {

    let sv = this.parameter.sampleParamterReading;
    let minV = this.parameter.minSampleValue;
    let maxV = this.parameter.maxSampleValue;
    // debugger;
    if (!sv || sv.length == 0) {
      return false; // value is not tpovided
    }

    if (minV && Number.parseFloat(sv) < Number.parseFloat(minV)) {
      return false; // below min value
    } else if (maxV && Number.parseFloat(sv) > Number.parseFloat(maxV)) {
      return false; // above max value
    }
    else {
      return true;
    }
  }

  onBackClick() {
    this.router.navigate(['/parameter-location-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the parameter?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteParameter();
      },
      reject: () => {

      },
    });
  }

  deleteParameter = () => {
    this.serviceProxy.deleteOneBaseParameterControllerParameter(this.editEntytyId).subscribe(res => {
      // alert("Deleted successfully.");
      //this.DisplayAlert('Deleted successfully.', AlertType.Message);

      this.confirmationService.confirm({
        message: 'Parameter is deleted successfully',
        header: 'Confirmation',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        rejectButtonStyleClass: 'p-button-text',
        rejectVisible: false,
        acceptLabel: 'Ok',
        accept: () => {
          this.onBackClick();
        },
        reject: () => {

        },
      });


    });
  }



  saveForm(formData: NgForm) {

    console.log(this.parameter);

    if (formData.valid && (this.parameter.parameterDataType?.id != 1 || this.parameter.unitOfMeasure?.id > 0)) {
      if (this.isNew) {
        this.isSaving = true;
        // create 
        this.parameter.status = 0;
        // mutiple location will cover all senariod, location pickup UI will enable user to puck 0:n;
        this.parameter.dataCollectionLocation = 3;

        if (this.relatedParam) {
          let savedParam = this.relatedParam.find(a => a.name == this.parameter.name);
          if (savedParam) {
            // this.DisplayAlert('A parameter is already exists with same name.', AlertType.Error);
            this.confirmationService.confirm({
              message: 'A parameter is already exists with same name. ',
              header: 'Warning',
              acceptIcon: 'icon-not-visible',
              // rejectIcon: 'icon-not-visible',
              rejectButtonStyleClass: 'p-button-text',
              rejectVisible: false,
              acceptLabel: 'Ok',
              accept: () => {
                //this.onBackClick();
              },
              reject: () => {

              },
            });
            this.isSaving = false;
            return;
          }
        }
        if (this.parameter.parameterDataType?.id != 1) {
          this.parameter.unitOfMeasure = undefined;
        }
        this.serviceProxy.createOneBaseParameterControllerParameter(this.parameter).subscribe(res => {


          this.confirmationService.confirm({
            message: 'Parameter is successfully created, please proceed to edit the locations and data sources.',
            header: 'Confirmation',
            acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectButtonStyleClass: 'p-button-text',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              this.router.navigate(['/parameter'], { queryParams: { id: res.id, activeTabIndex: 1 } });
            },
            reject: () => {


            },
          });





          // this.router.navigate(['/parameter'], { queryParams: { id: res.id } });

          //this.onBackClick();


        }, error => {
          // alert("Error")
          // this.displayMessage = "An error occurred, please try again.";
          // this.displayModal = true;

          //this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

          this.confirmationService.confirm({
            message: 'An error occurred, please try again.',
            header: 'Error',
            acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectButtonStyleClass: 'p-button-text',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              //this.onBackClick();
            },
            reject: () => {

            },
          });

          console.log("Error", error);
          this.isSaving = false;

        });

      } else {
        //update 
        this.serviceProxy.updateOneBaseParameterControllerParameter(this.parameter.id, this.parameter).subscribe(res => {
          // alert("Save success !");
          // this.displayMessage = "Save success !";
          // this.displayModal = true;
          //this.DisplayAlert('Save success !', AlertType.Message);

          this.confirmationService.confirm({
            message: 'Save success !',
            header: 'Save',
            acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectButtonStyleClass: 'p-button-text',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              //this.onBackClick();
            },
            reject: () => {

            },
          });

          // this.onBackClick();

        }, error => {
          //alert("Error")
          this.displayMessage = "An error occurred, please try again.";
          this.displayModal = true;
          console.log("Error", error);
        });
      }

    }
    else {
      this.isSaving = false;

    }

  }

  onfrequency() {
    this.parameter.deadline = this.parameter.frequency.deadline;
  }

  onSaveSucessOk() {
    this.displayModal = false;
    //this.onBackClick();

  }

  updateLocations() {
    this.serviceProxy.updateOneBaseParameterControllerParameter(this.parameter.id, this.parameter).subscribe(res => {
      //alert("Updated successfully!");
    }, error => {
      // alert("Error")
      // this.displayMessage = "An error occurred, please try again.";
      // this.displayModal = true;
      // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);
      this.confirmationService.confirm({
        message: 'An error occurred, please try again.',
        header: 'Error',
        acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        rejectButtonStyleClass: 'p-button-text',
        rejectVisible: false,
        acceptLabel: 'Ok',
        accept: () => {
          //this.onBackClick();
        },
        reject: () => {

        },
      });


      console.log("Error when paramter's location & source update.", error);
    });

  }

}
