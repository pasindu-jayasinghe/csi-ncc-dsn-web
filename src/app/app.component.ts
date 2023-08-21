import { Component, HostListener } from '@angular/core';
import { MessageService } from 'primeng/api';
// import { AuthenticationService } from './features/login/login-layout/authentication.service';
import { Router, NavigationEnd, GuardsCheckEnd } from '@angular/router';
import { AppService } from 'src/shared/app-service';
import { AppControllerServiceProxy, ClimateChangeDataCategory, ServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { OAuthService } from 'angular-oauth2-oidc';
import { RoleGuardService } from './auth/role-guard.service';
import { AuthenticationService } from './features/login/login-layout/authentication.service';
import { AuthConfigService } from 'src/app/auth/keyclock/auth-config.service';
import { TawkService } from './features/chat/tawk.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  title = 'ncc-dsn-dev';
  isLoggedIn: boolean;
  hideSidebar: boolean;
  togglemenu: boolean = true;
  userRoles: any[] = [];
  userRole: any = { name: 'CCS Admin', role: '1' }
  ccdcategory: ClimateChangeDataCategory[];


  appservice: AppService;

  navigationEvent: any;

  useremail = "";
  userInstitution = "";
  userType = "";

  innerWidth = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }


  constructor(
    private readonly oauthService: OAuthService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private router: Router,
    appservice: AppService,
    private serviceProxy: ServiceProxy,
    private roleGuardService: RoleGuardService,
    private appService: AppControllerServiceProxy,
    private TawkService: TawkService
  ) {


    this.appService.getUserInfo().subscribe(user => {
      this.useremail = user.email;
      this.userInstitution = user.institution.name;
      this.userType = user.userType.name;
      console.log("user====================", user);


      this.TawkService.SetChatVisibility(true);

      this.TawkService.UpdateTawkUser({firstname : user.firstName, lastname : user.lastName, email : user.email, id : user.id})

      // var Tawk_API = Tawk_API || {};
      // Tawk_API.visitor = {
      //   name: 'visitor name2',
      //   email: 'visitor2@email.com'
      // };
      // var Tawk_LoadStart = new Date();


      // (function () {

      //   var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      //   s1.async = true;
      //   s1.src = 'https://embed.tawk.to/601df0fda9a34e36b9745516/1etqfaoe9';
      //   s1.charset = 'UTF-8';
      //   s1.setAttribute('crossorigin', '*');
      //   s0.parentNode.insertBefore(s1, s0);
      // })();



    });
    this.userRoles = [
      { name: 'CCS Admin', role: '1' },
      { name: 'CCS DEO', role: '2' },
      { name: 'Ins. Admin', role: '3' },
      { name: 'Ins. DEO', role: '4' },
      { name: 'Public user', role: '5' },
    ];

    this.appservice = appservice;


    this.authenticationService.isLoggedIn.subscribe(
      (x) => ((this.isLoggedIn = x), console.log(x, 'loggedin status'))
    );
    this.authenticationService.hideSidebar.subscribe(
      (x) => ((this.hideSidebar = x), console.log(x, 'sidebarstatus'))
    );

    this.serviceProxy.getManyBaseClimateChangeDataCategoryControllerClimateChangeDataCategory(undefined,
      undefined,
      undefined,
      undefined,
      ["name,ASC"],
      undefined,
      10000, 0, 0, 0).subscribe(res => {
        this.ccdcategory = res.data;
      });



  }

  ngOnInit() {
    // rest of initialization code
    //alert("ok");

    this.innerWidth = window.innerWidth;


    if (this.roleGuardService.checkRoles(["ccs-admin"])) {
      this.userRole = this.userRoles[0];
      //this.router.navigate(['/home']);
    } else if (this.roleGuardService.checkRoles(["ccs-deo"])) {
      this.userRole = this.userRoles[1];
      //this.router.navigate(['/institution-assigneddata']);

    } else if (this.roleGuardService.checkRoles(["ins-admin"])) {
      this.userRole = this.userRoles[2];
      //this.router.navigate(['/institution-home']);

    } else if (this.roleGuardService.checkRoles(["ins-deo"])) {
      this.userRole = this.userRoles[3];
      //this.router.navigate(['/institution-assigneddata']);

    }
    else if (this.roleGuardService.checkRoles(["public-user"])) {
      this.userRole = this.userRoles[4];
      //this.router.navigate(['/institution-assigneddata']);

    }
  }

  logout() {
    this.oauthService.logOut();
  }

}
