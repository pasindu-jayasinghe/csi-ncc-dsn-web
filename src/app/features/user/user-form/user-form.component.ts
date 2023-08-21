import { Component, OnInit } from '@angular/core';
import { Institution, ServiceProxy, User, UserStatus, UserType } from 'src/shared/service-proxies/service-proxies';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Message } from 'primeng//api';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/shared/alert/alert.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { flatten } from '@angular/compiler';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [ConfirmationService]
})
export class UserFormComponent implements OnInit {

  temp1: string;
  temp2: string;
  temp3: string;

  user: User = new User();

  userTypes: UserType[] = [];

  institutions: Institution[] = [];

  userTitles: { id: number, name: string }[] = [{ id: 1, name: "Mr." }, { id: 2, name: "Mrs." }, { id: 3, name: "Ms." }, { id: 4, name: "Dr." }, { id: 5, name: "Professor" }];
  selecteduserTitle: { id: number, name: string };

  isNewUser: boolean = true;
  editUserId: number;
  isEmailUsed: boolean = false;
  usedEmail: string = "";

  alertHeader: string = "User";
  alertBody: string;
  alerttype: AlertType;
  showAlert: boolean = false;

  coreatingUser: boolean = false;

  constructor(
    private serviceProxy: ServiceProxy,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,

  ) {

  }

  ngOnInit(): void {

    this.user.userType = undefined;
    this.user.mobile = "94";
    this.user.telephone = "94";


    this.route.queryParams.subscribe(params => {
      this.editUserId = params['id'];
      if (this.editUserId && this.editUserId > 0) {
        this.isNewUser = false;
        this.serviceProxy.getOneBaseUserv2ControllerUser(this.editUserId, undefined, undefined, 0).subscribe(res => {
          console.log("User====", this.user);
          this.user = res;
          this.selecteduserTitle = this.userTitles.find(a => a.name == this.user.title);

          this.institutions.forEach(ins => {

            if (ins.id == this.user.institution.id) {
              this.user.institution = ins;
              console.log("ins set =======================")
            }

          });

        });
      }
    });

    this.serviceProxy.getManyBaseUserTypeControllerUserType(undefined, undefined, undefined, undefined, ["name,ASC"], undefined, 1000, 0, 1, 0).subscribe(res => {
      console.log("userTypes res ============", res);
      this.userTypes = res.data;
      console.log("userTypes============", this.userTypes);

    });

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined, undefined, undefined, undefined, ["name,ASC"], undefined, 1000, 0, 1, 0).subscribe(res => {
      console.log("institutions res ============", res);
      this.institutions = res.data;
      if (this.user?.institution) {

        this.institutions.forEach(ins => {

          if (ins.id == this.user.institution.id) {
            this.user.institution = ins;
            console.log("ins set =======================")
          }

        });

      }
      console.log("institutions============", this.institutions);
    });



  }

  onChangeUser(event: any) {
    //console.log(event);
    this.user.title = event.value?.name;

  }

  DisplayAlert(message: string, type: AlertType) {
    this.alerttype = type;
    this.alertBody = message;
    this.showAlert = true;
  }

  async saveUser(userForm: NgForm) {

    console.log("userForm================", userForm);
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });


    if (userForm.valid) {

      if (this.isNewUser) {
        this.isEmailUsed = false;
        this.usedEmail = "";

        let tempUsers = await this.serviceProxy.getManyBaseUserv2ControllerUser(undefined,
          undefined,
          ['email||$eq||' + this.user.email],
          undefined,
          ["firstName,ASC"],
          ["institution"],
          1, 0, 0, 0).subscribe(res => {
            if (res.data.length > 0) {
              this.isEmailUsed = true;
              this.usedEmail = res.data[0].email;
              // alert("Email address is already in use, please select a diffrent email address to create a new user.")
              this.confirmationService.confirm({
                message: 'Email address is already in use, please select a diffrent email address to create a new user.!',
                header: 'Error!',
                //acceptIcon: 'icon-not-visible',
                rejectIcon: 'icon-not-visible',
                rejectVisible : false,
                acceptLabel : "Ok",
                accept: () => {
                  //this.onBackClick();
        
                },
                
                reject: () => {
          
                },
                
              });
            } else {


              // create user
              this.user.username = this.user.email;
              this.user.status = 0;
              // let insTemp = this.user.institution
              // this.user.institution = new Institution();
              // this.user.institution.id = insTemp.id;

              this.coreatingUser = true;

              this.serviceProxy.createOneBaseUserv2ControllerUser(this.user).subscribe(res => {
                
                this.confirmationService.confirm({
                  message: 'User is created successfully!',
                  header: 'Confirmation',
                  //acceptIcon: 'icon-not-visible',
                  rejectIcon: 'icon-not-visible',
                  rejectVisible : false,
                  acceptLabel : "Ok",
                  accept: () => {
                    this.onBackClick();
          
                  },
                  
                  reject: () => {
            
                  },
                  
                });


               

              }, error => {
                this.coreatingUser = false;
                alert("An error occurred, please try again.")
                console.log("Error", error);
              }, () => {
                this.coreatingUser = false;
              });

            }
          });


        // this.serviceProxy.createOneBaseUserv2ControllerUser(this.user).subscribe(res => {
        //   alert("User created !");
        //   //this.DisplayAlert('User created !', AlertType.Message);


        //   console.log("edit user", res.id);

        //   this.router.navigate(['/user'], { queryParams: { id: res.id } });

        // }, error => {
        //   alert("An error occurred, please try again.")
        //   // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

        //   console.log("Error", error);
        // });

      } else {
        // let insTemp = this.user.institution
        // this.user.institution = new Institution();
        // this.user.institution.id = insTemp.id;
        //update user
        this.serviceProxy.updateOneBaseUserv2ControllerUser(this.user.id, this.user).subscribe(res => {
          this.confirmationService.confirm({
            message: 'User is updated successfully!',
            header: 'Confirmation',
            //acceptIcon: 'icon-not-visible',
            rejectIcon: 'icon-not-visible',
            rejectVisible : false,
            acceptLabel : "Ok",
            accept: () => {
              this.onBackClick();
    
            },
            
            reject: () => {
      
            },
            
          });
        }, error => {
          alert("An error occurred, please try again.")
          // this.DisplayAlert('An error occurred, please try again.', AlertType.Error);

          console.log("Error", error);
        });
      }

    }

  }

  
  onBackClick() {
    this.router.navigate(['/user-list']);
  }

  onDeleteClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the user?',
      header: 'Delete Confirmation',
      acceptIcon: 'icon-not-visible',
      rejectIcon: 'icon-not-visible',
      accept: () => {
        this.deleteUser();
      },
      reject: () => {

      },
    });
    // this.router.navigate(['/user-list']);
  }

  deleteUser(){

    this.serviceProxy.deleteOneBaseUserv2ControllerUser(this.user.id).subscribe(res=>{
      //this.DisplayAlert('Deleted successfully.', AlertType.Message);
      this.confirmationService.confirm({
        message: 'User is deleted successfully!',
        header: 'Delete Confirmation',
        //acceptIcon: 'icon-not-visible',
        rejectIcon: 'icon-not-visible',
        rejectVisible : false,
        acceptLabel : "Ok",
        accept: () => {
          this.onBackClick();

        },
        
        reject: () => {
  
        },
        
      });
    });

  }

}
