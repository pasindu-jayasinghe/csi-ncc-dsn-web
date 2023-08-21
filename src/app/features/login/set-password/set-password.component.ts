import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppControllerServiceProxy, ResetPassword, UsersControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { AuthenticationService } from '../login-layout/authentication.service';
import { LoginLayoutService } from '../login-layout/login-layout.service'
@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

  @ViewChild('fSetPassword') form: NgForm;
  showLoginForm = false;
  showForgotPassword = false;
  showSetPassword = true;
  restToken: string;
  email: string;
  resetPasswordDto = new ResetPassword;
  islSuccessPopup: boolean;
  isErrorPopup: boolean;
  setPasswordForm: FormGroup;
  isPasswordType: boolean = true;
  isConfirmPasswordType?: boolean = true;
  passwordConfirm: string = "";


  constructor(public loginLayoutService: LoginLayoutService,
    private appServiceProxy: AppControllerServiceProxy,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private route: ActivatedRoute) {

    this.authenticationService.authenticate(false, true);
    let regEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])((?=.*[0-9])|(?=.*[!@#$%^&*]))(?=.{6,})");

    this.setPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(regEx)]],
      confirmPassword: ['', Validators.required],
    });

  }


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.restToken = params['token'];
      this.email = params['email'];
      console.log("restToken", this.restToken);
    });
  }

  showLogin() {
    this.showLoginForm = true;
    this.showForgotPassword = false;
    this.showSetPassword = false;
    this.loginLayoutService.toggleLoginForm(this.showLoginForm, this.showForgotPassword, this.showSetPassword); // call login layout service
  }

  clickResetPassword() {

    if (this.setPasswordForm.valid && this.passwordConfirm ==  this.resetPasswordDto.password) {

      this.resetPasswordDto.token = this.restToken;
      this.resetPasswordDto.email = this.email;
      this.appServiceProxy.resetPassword(this.resetPasswordDto).subscribe(isSuccess => {
        if (isSuccess) {
          this.islSuccessPopup = true;
        } else {
          this.isErrorPopup = true;
        }
      },
        err => {
          this.isErrorPopup = true;
          console.log(err);

        });
    }
  }

  get password() {
    return this.setPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.setPasswordForm.get('confirmPassword');
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordText() {
    this.isPasswordType = !this.isPasswordType;
  }

  toggleConfirmPasswordText() {
    this.isConfirmPasswordType = !this.isConfirmPasswordType;
  }

}
