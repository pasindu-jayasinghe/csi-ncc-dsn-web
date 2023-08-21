import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { LoginLayoutService } from '../login-layout/login-layout.service'
import { UsersControllerServiceProxy,  AppControllerServiceProxy } from '../../../../shared/service-proxies/service-proxies'
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../login/login-layout/authentication.service';
import { AppService } from 'src/shared/app-service';




@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  @ViewChild('fLogin') fLogin: NgForm;

  showLoginForm = true;
  showForgotPassword = false;
  showSetPassword = false;
  display: boolean = false;
  
  isLoggedIn = false;
  hideSideBar = true;

  isSubmitLogin: boolean;
  isInvalidCredential: boolean;

  constructor(public logiLayoutService: LoginLayoutService,
    private _loginApiService: UsersControllerServiceProxy,
    private appControllServiceProxy: AppControllerServiceProxy,
    private router: Router,
    private authenticationService: AuthenticationService,
    private WMServiceService : AppService
  ) {
    console.log("LoginFormComponent ctor");
  }

  ngOnInit(): void {
    console.log("LoginFormComponent ngOnInit");
    // this._loginApiService.findAll().subscribe(result => {
    //   // console.log(result);
    // });

    this.authenticationService.authenticate(false, true);

    // this._investorsControllerServiceProxy.findAll().subscribe(result => {
    //   console.log(result);
    // });
  }

  showPasswordResetForm() {
    this.showLoginForm = false;
    this.showForgotPassword = true;
    this.showSetPassword = false;
    this.logiLayoutService.toggleLoginForm(this.showLoginForm, this.showForgotPassword, this.showSetPassword); // call login layout service
  }

  resetError(){
    this.isInvalidCredential = false;
  }

  login() {
    // this.display = true;
    this.isSubmitLogin = true;
    if (!this.fLogin.valid) {
      return;
    }
    this.appControllServiceProxy.login(this.logiLayoutService.authCredentialDot).subscribe(token => {
      console.log(token);
      if (token && token.access_token) {

        this.isInvalidCredential =false;
        
        this.isLoggedIn = true;
        this.hideSideBar = false;
        this.WMServiceService.steToken(token.access_token);
        localStorage.setItem('access_token', token.access_token);// store the tocken 
        localStorage.setItem('user_name', this.logiLayoutService.authCredentialDot.username);// store the username 
        this.WMServiceService.userProfile = {username : this.logiLayoutService.authCredentialDot.username};
       
         //this.authenticationService.authenticate(this.isLoggedIn, this.hideSideBar);

        this.router.navigate(['/home']);

        // this.appControllServiceProxy.getProfile().subscribe(res=> {
        
        // });
      }
      else {
        this.isInvalidCredential = true;
      }
    }, error => {
      console.log(error);
      this.isInvalidCredential = true;

    })
  }

}
