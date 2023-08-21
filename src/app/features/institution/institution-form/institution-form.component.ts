import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { District, DivisionalSecretariat, Hierarchy, Institution, InstitutionCategory, InstitutionType, MasterdataControllerServiceProxy, Province, ServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AlertType } from 'src/app/shared/alert/alert.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-institution-form',
  templateUrl: './institution-form.component.html',
  styleUrls: ['./institution-form.component.scss'],
  providers: [ConfirmationService]

})
export class InstitutionFormComponent implements OnInit {

  isNew: boolean = true;

  editEntytyId: number;

  institution: Institution = new Institution();
  relatedItem: Institution[];

  categories: InstitutionCategory[];

  types: InstitutionType[];

  allInstitutions: Institution[];

  provinces: Province[];

  districts: District[];

  divisionalSecretariats: DivisionalSecretariat[];
  hierarchyList: Hierarchy[];


  displayModal: boolean = false;
  displayMessage: string = "Created successfully!";

  alertHeader: string = "Institution";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;
  exsistingInstitution: boolean = false;
  insTemp: Institution;

  isSaving: boolean = false;



  constructor(private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private masterdataService: MasterdataControllerServiceProxy,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {

  }

  async ngOnInit(): Promise<void> {

    // this.institution.category = undefined;
    // this.institution.type = undefined;
    // this.institution.parentInstitution = undefined;

    await this.masterdataService.getAllProvince().subscribe(res => {
      this.provinces = res;
      console.log("this.provinces", this.provinces);

    });

    await this.masterdataService.getAllHierarchy().subscribe(res => {
      this.hierarchyList = res;
    })

    await this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      1000, 0, 0, 0).subscribe(res => {
        this.allInstitutions = res.data;
        console.log("this.allInstitutions", this.allInstitutions);
      });

    this.masterdataService.getAllDivisionalSecretariat().subscribe(res => {
      this.divisionalSecretariats = res;
    });

    this.masterdataService.getAllDistricts().subscribe(res => {
      this.districts = res;
    });



    this.masterdataService.getAllInstitutionCategory().subscribe(res => {
      this.categories = res;
    });


    await this.masterdataService.getAllInstitutionType().subscribe(res => {
      this.types = res;
    });

    this.route.queryParams.subscribe(params => {
      this.editEntytyId = params['id'];
      if (this.editEntytyId && this.editEntytyId > 0) {
        this.isNew = false;
        this.serviceProxy.getOneBaseInstitutionControllerInstitution(this.editEntytyId, undefined, undefined, 0).subscribe(res => {
          this.institution = res;
          this.institution.parentInstitution = this.allInstitutions.find(a => a.id == this.institution.parentInstitution.id);
          // this.onChangeProvince();
          // this.onChangeDistrict();
        });

      }
    });

  }

  onBackClick() {
    this.router.navigate(['/institution-list']);
  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  onHierachyChange() {
    this.institution.province = null;
    this.institution.district = null;
    this.institution.divisionalSecretariat = null;
    // if(this.institution.hierarchy.id == 2)
    // {

    // }
  }

  onChangeProvince() {
    // this.divisionalSecretariats = [];
    // this.districts = [];
    // if (this.institution?.province?.id) {
    //   this.masterdataService.getAllDistrictsByProvince(this.institution?.province?.id).subscribe(res => {
    //     console.log(res);
    //     this.districts = res;
    //   });
    // }
  }

  onChangeDistrict() {
    // this.divisionalSecretariats = [];
    // if (this.institution?.district?.id) {
    //   this.masterdataService.getAllDivisionalSecretariatByDistrict(this.institution?.district?.id).subscribe(res => {
    //     console.log(res);
    //     this.divisionalSecretariats = res;
    //   });
    // }
  }
  onChangeDS() {

  }


  saveForm(formData: NgForm) {

    console.log("userForm================", formData);
    console.log("this.institution-------", this.institution);
    this.isSaving = true;
    if (this.institution["canNotDelete"]) {
      alert("Warning: this record can not be alter!")
      this.isSaving = false;

      return;
    }

    if (formData.valid && !this.exsistingInstitution) {

      // this.insTemp = this.institution.parentInstitution
      // this.institution.parentInstitution = new Institution();
      // this.institution.parentInstitution.id = this.insTemp.id;
      if (this.isNew) {

        if (this.institution.parentInstitution.id == this.institution.id) {
          alert("Error, Institution with given name is already created!")
          this.isSaving = false;

        } else {
          // create institution
          this.institution.status = 0;
          this.serviceProxy.createOneBaseInstitutionControllerInstitution(this.institution).subscribe(res => {
            this.institution.parentInstitution = this.allInstitutions.find(a => a.id == this.institution.parentInstitution.id);

            this.confirmationService.confirm({
              message: 'Institution is created successfully!',
              header: 'Confirmation',
              //acceptIcon: 'icon-not-visible',
              rejectIcon: 'icon-not-visible',
              rejectVisible: false,
              acceptLabel: "Ok",
              accept: () => {
                //this.router.navigate(['/institution'], { queryParams: { id: res.id } });
                this.isSaving = false;
                this.onBackClick();
              },

              reject: () => {

              },

            });

          }, error => {

            this.institution.parentInstitution = this.allInstitutions.find(a => a.id == this.institution.parentInstitution.id);
            this.isSaving = false;

            //alert("An error occurred, please try again.");
            //this.DisplayAlert('An error occurred, please try again.', AlertType.Error);
            this.confirmationService.confirm({
              message: 'An error occurred, please try again.',
              header: 'Error',
              //acceptIcon: 'icon-not-visible',
              rejectIcon: 'icon-not-visible',
              rejectVisible: false,
              acceptLabel: "Ok",
              accept: () => {
                //this.onBackClick();

              },

              reject: () => {

              },

            });
            this.displayModal = true;
            console.log("Error", error);
          }, () => {
            this.institution.parentInstitution = this.allInstitutions.find(a => a.id == this.institution.parentInstitution.id);
          });
        }

      } else {

        if (this.institution.parentInstitution.id == this.institution.id) {
          // alert("Error, select a diffrent institution as the parent institution!")
          this.isSaving = false;

          this.confirmationService.confirm({
            message: 'select a diffrent institution as the parent institution!',
            header: 'Error',
            //acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectVisible: false,
            acceptLabel: "Ok",
            accept: () => {
              //this.onBackClick();

            },

            reject: () => {

            },

          });
        } else {
          //update institution

          this.serviceProxy.updateOneBaseInstitutionControllerInstitution(this.institution.id, this.institution).subscribe(res => {
            this.isSaving = false;

            this.confirmationService.confirm({
              message: 'Institution is saved successfully!',
              header: 'Confirmation',
              //acceptIcon: 'icon-not-visible',
              rejectIcon: 'icon-not-visible',
              rejectVisible: false,
              acceptLabel: "Ok",
              accept: () => {
                this.onBackClick();

              },

              reject: () => {

              },

            });



          }, error => {

            // alert("Error occured, please try again.")
            this.isSaving = false;

            this.alerttype = AlertType.Error;
            this.confirmationService.confirm({
              message: 'Error occured, please try again.',
              header: 'Error',
              //acceptIcon: 'icon-not-visible',
              rejectIcon: 'icon-not-visible',
              rejectVisible: false,
              acceptLabel: "Ok",
              accept: () => {
                //this.onBackClick();

              },

              reject: () => {

              },

            });


          }, () => {

          });
        }
      }


    }
    else {
      this.isSaving = false;
    }


  }

  showModel(message: string) {
    this.displayMessage = message;
    this.displayModal = true;
  }

  onSaveSucessOk() {
    this.displayModal = false;
    this.onBackClick();

  }

  nameChange() {

    if (this.institution.name.length > 0) {

      let insTemp = this.allInstitutions.find(a => a.name == this.institution.name);
      if (insTemp && insTemp.id != this.institution.id) {
        this.exsistingInstitution = true;
        console.log("aaaaaaaaaa", insTemp.id, this.institution.id);
      }
      else {
        this.exsistingInstitution = false;
      }
    }

    //console.log("this.exsistingInstitution", this.exsistingInstitution, this.institution.name);


  }

  onnameKeyDown(event: any) {
    console.log("============= Event ===============");

    let skipWord = ["of", "the", "in", "On", "-", "_", "/"];
    let searchText = this.removeFromString(skipWord, this.institution.name).trim();


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



    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      orfilter,
      undefined,
      undefined,
      10, 0, 0, 0).subscribe(res => {
        if (this.institution.name) {
          this.relatedItem = res.data;
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

  onDeleteClick() {


    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the institution?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deletePolicy();
      },
      reject: () => {

      },
    });
  }

  deletePolicy = () => {



    this.serviceProxy.deleteOneBaseInstitutionControllerInstitution(this.institution.id).subscribe(res => {
      this.confirmationService.confirm({
        message: 'Institution is deleted successfully!',
        header: 'Delete Confirmation',
        //acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        rejectVisible: false,
        acceptLabel: "Ok",
        accept: () => {
          this.onBackClick();

        },

        reject: () => {

        },

      });
    });
  }

}
