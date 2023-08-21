import { AppControllerServiceProxy, User } from 'src/shared/service-proxies/service-proxies';
import { async } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectProgramme, ProjectType, ClimateChangeDataCategory, Sector, SubSector, ServiceProxy, MasterdataControllerServiceProxy, Province, ProjectStatus, District, DivisionalSecretariat, SDBenefit, Currency, FinancingScheme, Documents, DocumentsDocumentOwner, Institution, ProjectFundingDetail } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { } from 'googlemaps';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { AlertType } from 'src/app/shared/alert/alert.component';
/// <reference types="googlemaps" />



@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ProjectFormComponent implements OnInit {

  @ViewChild('gmap') gmap: any;

  isNew: boolean = true;
  project: ProjectProgramme = new ProjectProgramme();
  projectTypes: ProjectType[];
  climateChangeDataCategorys: ClimateChangeDataCategory[];
  sectors: Sector[];
  institutions: Institution[];
  subSectors: SubSector[];
  status: ProjectStatus[];
  projectId: number;
  proposedDate: Date;
  provinces: Province[];
  districts: District[];
  districtsAll: District[];
  divisionalSecretariats: DivisionalSecretariat[];
  divisionalSecretariatsAll: DivisionalSecretariat[];
  projectProgrammeType: { id: number, name: string }[] = [
    { "id": 0, "name": "Project" },
    { "id": 1, "name": "Programme" }
  ];
  selctedprojectProgrammeType: { id: number, name: string };
  options: any;
  overlays: any[];
  sdBenefits: SDBenefit[];
  sdBenefitsIndirect: SDBenefit[];
  currencys: Currency[];
  financingSchemes: FinancingScheme[];
  doucmentList: Documents[] = new Array();
  documentsDocumentOwner: DocumentsDocumentOwner = DocumentsDocumentOwner.ProjectProgramme;
  documentsDocumentOwnerId: number = 1;
  map: google.maps.Map;

  alertHeader: string = "Project/Programme";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  isSaving: boolean = false;

  projects: ProjectProgramme[];
  exsistingPrpject: boolean;

  relatedItem: ProjectProgramme[];
  loginUser: User;


  constructor(private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private masterdataService: MasterdataControllerServiceProxy,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService, private appService: AppControllerServiceProxy) {

  }

  async ngOnInit(): Promise<void> {

    this.project.isPublicProponent = false;
    this.project.longitude = 0.0;
    this.project.latitude = 0.0;

    this.appService.getUserInfo().subscribe(user => {
      this.loginUser = user;
    });

    this.masterdataService.getAllCurrency().subscribe(res => {
      this.currencys = res;
    });

    this.masterdataService.getAllFinancingScheme().subscribe(res => {
      this.financingSchemes = res;
    });

    this.masterdataService.getAllSDBenefit().subscribe(res => {
      this.sdBenefits = res.filter(a => a.isDirectBenefit);
      this.sdBenefitsIndirect = res.filter(a => a.isInDirectBenefit);
    })



    this.masterdataService.getAllProvince().subscribe(res => {
      this.provinces = res;
    });

    this.masterdataService.getAllDistricts().subscribe(res => {
      this.districts = res;
      this.districtsAll = res;
    });

    this.masterdataService.getAllDivisionalSecretariat().subscribe(res => {
      this.divisionalSecretariats = res;
      this.divisionalSecretariatsAll = res;
    });

    this.serviceProxy.getManyBaseProjectStatusControllerProjectStatus(undefined,
      undefined,
      undefined,
      undefined, ["name,ASC"], undefined, 1000, 0, 0, 0
    ).subscribe(res => {
      this.status = res.data;
    })


    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.institutions = res.data;
        this.setDataSource();
      });

    this.masterdataService.getAllProjectType().subscribe(res => {
      this.projectTypes = res;
    });

    this.masterdataService.getAllClimateChangeDataCategory().subscribe(res => {
      this.climateChangeDataCategorys = res;
    });

    this.route.queryParams.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId && this.projectId > 0) {
        this.isNew = false;
        this.serviceProxy.getOneBaseProjectProgramControllerProjectProgramme(this.projectId, undefined, undefined, 0).subscribe(res => {
          this.project = res;
          this.proposedDate = new Date(this.project.proposedDateOfCommence.toISOString());
          this.selctedprojectProgrammeType = res.isProject ? this.projectProgrammeType[0] : this.projectProgrammeType[1];
          this.onChangeSector();
          this.setLocationsOnUpdateInit();
          this.setDefaultCurrancy();
          this.setDataSource();
          this.onChangeCCD();

          let filter = this.climateChangeDataCategorys.filter(obj => obj.id === this.project.climateChangeDataCategory.id);
          if (filter.length > 0) {
            this.project.climateChangeDataCategory = filter[0];
          }

          if (this.project.longitude && this.project.latitude) {
            setTimeout(() => {
              this.setMarkerOnUpdateInit();

            }, 3000);
          } else {
            this.project.longitude = 0.0;
            this.project.latitude = 0.0;
            setTimeout(() => {
              this.setMarkerOnUpdateInit();

            }, 3000);
          }
        });
      } else {
        setTimeout(() => {
          this.setMarkerOnUpdateInit();

        }, 3000);

      }

    });

    await this.serviceProxy.getManyBaseProjectProgramControllerProjectProgramme(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.projects = res.data;
        // console.log("this.allInstitutions", this.allInstitutions);
      });

    this.setDefaultBoundariesOnMap();

    // if (!this.projectId && this.project.longitude == 0) {
    let event = { value: 0.00000 };
    this.onLongitudeChange(event);
    this.onLatitudeChange(event);
    //}
  }

  onnameKeyDown(event: any) {
    console.log("============= Event ===============");

    let skipWord = ["of", "the", "in", "On", "-", "_", "/"];
    let searchText = this.removeFromString(skipWord, this.project.name).trim();


    if (!searchText || searchText?.length < 4) {
      console.log("========== Return");
      this.relatedItem = null;
      return;
    }

    let words = searchText.split(" ");

    let orfilter: string[] = new Array();
    for (const w of words) {
      orfilter.push('name||$cont||' + w.trim())
    }



    // this.serviceProxy.getManyBasePolicyControllerPolicy(undefined,
      this.serviceProxy.getManyBaseProjectProgramControllerProjectProgramme(undefined,
      undefined,
      undefined,
      orfilter,
      undefined,
      undefined,
      10, 0, 0, 0).subscribe(res => {
        console.log(res);
        if (this.project.name) {
          this.relatedItem = res.data;
          //console.log(this.relatedParam)
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

  nameChange() {

    if (this.project.name.length > 0) {

      let insTemp = this.projects.find(a => a.name == this.project.name);
      if (insTemp && insTemp.id != this.project.id) {
        this.exsistingPrpject = true;
      }
      else {
        this.exsistingPrpject = false;
      }
    }

    //console.log("this.exsistingInstitution", this.exsistingInstitution, this.institution.name);


  }


  onChangeCCD() {
    if (this.project.climateChangeDataCategory) {
      this.masterdataService.getAllSectorByCCDataCatagary(this.project.climateChangeDataCategory.id).subscribe(res => {
        this.sectors = res;
      });
    }
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  setDefaultCurrancy() {
    if (this.project.totalProjectCostCurrency === null || !this.project.totalProjectCostCurrency?.id) {
      this.project.totalProjectCostCurrency = this.currencys[0];
    }
  }

  initOverlays() {
    // if (!this.overlays || !this.overlays.length) {
    //   this.overlays = [
    //       new google.maps.Marker({position: {lat: 36.879466, lng: 30.667648}, title:"Konyaalti"}),

    //   ];
    // }
  }

  setLocationsOnUpdateInit() {
    this.divisionalSecretariats = [];
    this.districts = [];

    if (this.project?.province?.id) {
      this.masterdataService.getAllDistrictsByProvince(this.project?.province?.id).subscribe(res => {
        this.districts = res;
      });

      if (this.project?.district?.id) {
        this.masterdataService.getAllDivisionalSecretariatByDistrict(this.project?.district?.id).subscribe(res => {
          this.divisionalSecretariats = res;
        });
      } else {
        this.masterdataService.getAllDivisionalSecretariatByProvince(this.project?.province?.id).subscribe(res => {
          this.divisionalSecretariats = res;
        });
      }
    } else {
      this.districts = this.districtsAll;
      if (this.project?.district?.id) {
        this.masterdataService.getAllDivisionalSecretariatByDistrict(this.project?.district?.id).subscribe(res => {
          this.divisionalSecretariats = res;
        });
      } else {
        this.divisionalSecretariats = this.divisionalSecretariatsAll;
      }
    }
  }

  onChangeProvince() {
    this.divisionalSecretariats = [];
    this.districts = [];
    this.project.district = null;
    this.project.divisionalSecretariat = null;

    if (this.project?.province?.id) {
      this.masterdataService.getAllDistrictsByProvince(this.project?.province?.id).subscribe(res => {
        this.districts = res;
      });

      this.masterdataService.getAllDivisionalSecretariatByProvince(this.project?.province?.id).subscribe(res => {
        this.divisionalSecretariats = res;
      });
    } else {
      this.districts = this.districtsAll;
      this.divisionalSecretariats = this.divisionalSecretariatsAll;
    }
  }

  onChangeDistrict() {
    this.divisionalSecretariats = [];
    this.project.divisionalSecretariat = null;
    if (this.project?.district?.id) {
      this.masterdataService.getAllDivisionalSecretariatByDistrict(this.project?.district?.id).subscribe(res => {
        this.divisionalSecretariats = res;
      });
    } else {
      if (this.project?.province?.id) {
        this.masterdataService.getAllDivisionalSecretariatByProvince(this.project?.province?.id).subscribe(res => {
          this.divisionalSecretariats = res;
        });
      } else {
        this.divisionalSecretariats = this.divisionalSecretariatsAll;
      }
    }
  }

  onChangeSector() {
    if (this.project.sector !== null && this.project.sector !== undefined) {
      this.masterdataService.getAllSubSectorbySector(this.project.sector.id).subscribe(res => {
        this.subSectors = res;

        

      });
    }
  }

  setDataSource() {
    if (this.project && this.project.dataSource) {
      let filter = this.institutions.filter(obj => obj.id === this.project.dataSource.id);
      if (filter.length > 0) {
        this.project.dataSource = filter[0];
      }
    }
  }

  onApproveClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve the project?',
      header: 'Approve Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.project.isPendingApprove = false;
        this.update();
      },
      reject: () => {

      },
    });
  }

  saveForm(formData: NgForm) {
    console.log(this.project.isPublicProponent);
    this.isSaving = true;

    if (!this.project.province && !this.project.district && !this.project.divisionalSecretariat) {
      //formData.form.controls['searchProvinceDropdown'].setErrors({ 'incorrect': true });
    }

    if (formData.valid) {

      this.project.proposedDateOfCommence = moment(this.proposedDate, "YYYY-MM-DDTHH:mm:ssZ");
      this.project.isProject = this.selctedprojectProgrammeType.id === 0;

      let insTemp = this.project.dataSource
      this.project.dataSource = new Institution();
      this.project.dataSource.id = insTemp.id;
      this.project.isPendingApprove = true;


      if (this.isNew) {
        // create 
        this.serviceProxy.createOneBaseProjectProgramControllerProjectProgramme(this.project).subscribe(res => {
          // alert("Created successfully!");
          //this.DisplayAlert('Created successfully!', AlertType.Message);
          this.isSaving = false;

          this.confirmationService.confirm({
            message: 'Project/Programme successfully created!',
            header: 'Save',
            acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectButtonStyleClass: 'p-button-text',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              this.router.navigate(['/project'], { queryParams: { id: res.id } });
            },
            reject: () => {

            },
          });

        }, error => {
          //alert("An error occurred, please try again.")
          //this.DisplayAlert('An error occurred, please try again.', AlertType.Error);
          this.isSaving = false;

          this.confirmationService.confirm({
            message: 'An error occurred, please try again.',
            header: 'Error',
            acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectButtonStyleClass: 'p-button-text',
            rejectVisible: false,
            acceptLabel: 'Ok',
            accept: () => {
              //this.router.navigate(['/project'], { queryParams: { id: res.id } });
            },
            reject: () => {

            },
          });

          console.log("Error", error);
        });
      } else {
        //update 
        this.update();
        // this.serviceProxy.updateOneBaseProjectProgramControllerProjectProgramme(this.project.id, this.project).subscribe(res => {
        //   //alert("Successfully Saved!");
        //   //this.DisplayAlert('Successfully Saved!', AlertType.Message);
        //   this.isSaving = false;

        //   this.confirmationService.confirm({
        //     message: 'Project/Programme successfully updated!',
        //     header: 'Save',
        //     acceptIcon: 'icon-not-visible',
        //     rejectIcon: 'icon-not-visible',
        //     rejectButtonStyleClass: 'p-button-text',
        //     rejectVisible: false,
        //     acceptLabel: 'Ok',
        //     accept: () => {
        //       this.onBackClick();
        //     },
        //     reject: () => {

        //     },
        //   });

        // }, error => {
        //   //alert("An error occurred, please try again.")
        //   // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);
        //   this.isSaving = false;

        //   this.confirmationService.confirm({
        //     message: 'An error occurred, please try again.',
        //     header: 'Error',
        //     acceptIcon: 'icon-not-visible',
        //     rejectIcon: 'icon-not-visible',
        //     rejectButtonStyleClass: 'p-button-text',
        //     rejectVisible: false,
        //     acceptLabel: 'Ok',
        //     accept: () => {
        //       //this.onBackClick();
        //     },
        //     reject: () => {

        //     },
        //   });

        //   console.log("Error", error);
        // });
      }

    }
    else {
      this.isSaving = false;

    }

  }

  update() {
    this.serviceProxy.updateOneBaseProjectProgramControllerProjectProgramme(this.project.id, this.project).subscribe(res => {
      //alert("Successfully Saved!");
      //this.DisplayAlert('Successfully Saved!', AlertType.Message);
      this.isSaving = false;

      this.confirmationService.confirm({
        message: 'Project/Programme successfully updated!',
        header: 'Save',
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

    }, error => {
      //alert("An error occurred, please try again.")
      // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);
      this.isSaving = false;

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
    });
  }

  isNationalChnage() {
    console.log(this.project.isNational);
    if (this.project.isNational) {
      this.project.isSpecificLocation = false;
    }
  }


  isSLChnage() {
    console.log(this.project.isSpecificLocation);
    if (this.project.isSpecificLocation) {
      this.project.isNational = false;
    }
  }


  onBackClick() {
    this.router.navigate(['/project-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the project?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteProject();
      },
      reject: () => {

      },
    });
  }

  deleteProject = () => {
    this.serviceProxy.deleteOneBaseProjectProgramControllerProjectProgramme(this.projectId).subscribe(res => {
      // alert("Deleted successfully.");
      // this.DisplayAlert('Deleted successfully.', AlertType.Message);

      this.confirmationService.confirm({
        message: 'Delete success !',
        header: 'Delete',
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


  ////// Map related functions

  /**
   * set default boundaries on init
   */
  setDefaultBoundariesOnMap = () => {
    this.options = {
      center: { lat: 9, lng: 80 },
      zoom: 6
    };
  }

  /**
   * set marker on update screen init
   */
  async setMarkerOnUpdateInit() {
    const latitude = Number(this.project.latitude);
    const longitude = Number(this.project.longitude);
    await this.addMarker(longitude, latitude);
    console.log(latitude);
    console.log(longitude);


    let map = this.gmap.getMap();
    this.updateMapBoundaries(map, longitude, latitude);
  }

  /**
   * update map boundaries on coordinates change
   * @param map 
   * @param longitude 
   * @param latitude 
   */
  updateMapBoundaries = (map, longitude, latitude) => {
    if (longitude && latitude) {
      map.setCenter({ lat: latitude, lng: longitude });
      if (map.getZoom() < 10) {
        map.setZoom(10);
      }

      if (!map.getZoom()) {
        map.setZoom(10);
      }
    } else {
      map.setCenter({ lat: 9, lng: 80 });
      map.setZoom(6);
      this.overlays = [];
    }
  }

  /**
   * add marker on map
   * @param longitude 
   * @param latitude 
   */
  async addMarker(longitude: number, latitude: number) {
    var marker = await new google.maps.Marker({ position: { lat: latitude, lng: longitude }, title: this.project.name, draggable: true });
    this.overlays = [marker];
  }

  /**
   * set project location coordinates on select through map
   * @param longitude 
   * @param latitude 
   */
  setCoordinatesToProject = (longitude: number, latitude: number) => {
    this.project.latitude = latitude;
    this.project.longitude = longitude;
  }

  /**
   * on click on the map
   * @param event 
   */
  async handleMapClick(event) {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();
    await this.addMarker(longitude, latitude);
    this.setCoordinatesToProject(longitude, latitude);

    let map = this.gmap.getMap();
    this.updateMapBoundaries(map, longitude, latitude);
  }

  /**
   * update coordinates on drop marker
   * @param event 
   */
  handleMarkerDragEnd(event) {
    const latitude = event.originalEvent.latLng.lat();
    const longitude = event.originalEvent.latLng.lng();
    //this.addMarker(longitude, latitude);
    this.setCoordinatesToProject(longitude, latitude);

    let map = this.gmap.getMap();
    this.updateMapBoundaries(map, longitude, latitude);
  }

  /**
   * on change the latitude input value
   * @param event 
   */
  onLatitudeChange = async (event) => {
    let map = this.gmap.getMap();
    if (event.value && this.project.longitude) {
      const latitude = Number(event.value);
      const longitude = Number(this.project.longitude);
      await this.addMarker(longitude, latitude);
      this.updateMapBoundaries(map, longitude, latitude);
    } else {
      this.updateMapBoundaries(map, null, null);
    }
  }

  /**
   * on change the longitude input value
   * @param event 
   */
  onLongitudeChange = async (event) => {
    let map = this.gmap.getMap();
    if (event.value && this.project.latitude) {
      const latitude = Number(this.project.latitude);
      const longitude = Number(event.value);
      await this.addMarker(longitude, latitude);
      this.updateMapBoundaries(map, longitude, latitude);
    } else {
      this.updateMapBoundaries(map, null, null);
    }
  }

}
