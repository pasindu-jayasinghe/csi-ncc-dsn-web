import { DataRequestHistoryProjectComponent } from './features/institution/data-request-history-project/data-request-history-project.component';
import { DataRequestHistoryComponent } from './features/institution/data-request-history/data-request-history.component';
import { InstitutionHomeComponent } from './features/institution/institution-home/institution-home.component';
import { MitigationComponent } from './features/metadata/mitigation/mitigation.component';
import { GooglemapsModule } from './shared/googlemaps/googlemaps.module';
import { DataEntryComponent } from './features/institution/data-entry/data-entry.component';
import { AssignedDataComponent } from './features/institution/assigned-data/assigned-data.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { LoginLayoutComponent } from './features/login/login-layout/login-layout.component';
import { LoginFormComponent } from './features/login/login-form/login-form.component';
import { ForgotPasswordComponent } from './features/login/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './features/login/set-password/set-password.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ModalComponent } from './shared/modal/modal.component';
import { AlertComponent } from './shared/alert/alert.component';
import { StepsModule } from 'primeng/steps';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { LoginLayoutService } from './features/login/login-layout/login-layout.service';
import { ListboxModule } from 'primeng/listbox';
import { InputMaskModule } from 'primeng/inputmask';
import { CurrencyCommasHundredsPipe } from './shared/utils/pipes/currency-commas-hundreds.pipe';
import {
  API_BASE_URL,
  UsersControllerServiceProxy,
  AppControllerServiceProxy,
  ServiceProxy,
  MasterdataControllerServiceProxy,
  ParameterLocationControllerServiceProxy,
  DocumentControllerServiceProxy,
  ParameterControllerServiceProxy,
  UnitOfMeasureControllerServiceProxy,
  ProjectProgramDataControllerServiceProxy,
  InstitutionControllerServiceProxy,
  ShoppingCartControllerServiceProxy,
  PolicyDataControllerServiceProxy,
  ChartControllerServiceProxy,
  PublicControllerServiceProxy,
  DatarequestStatusHistoryControllerServiceProxy,
  PolicyControllerServiceProxy,
  UserDataUsageCategoryControllerServiceProxy
}
  from './../shared/service-proxies/service-proxies';
import { HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { WOSPaymentsModule } from "@wealthos/payments-ngx";
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ChartModule } from 'primeng/chart';
import { TreeModule } from 'primeng/tree';



import { ErrorpageComponent } from './errorpage/errorpage.component';
import { SettingsComponent } from './settings/settings.component';

import { TwoColumnViewComponent } from './shared/two-column-view/two-column-view.component';
import { SearchFilterPipe } from './shared/utils/pipes/search-filter.pipe';

////////////

import { TokenInterceptor } from 'src/shared/token-interceptor ';
import { HomeComponent } from './features/home/home.component';
import { TableModule } from 'primeng/table';
import { UserModule } from './features/user/user.module';
import { RoleGuardService } from './auth/role-guard.service';
import { ParameterFormComponent } from './features/parameter/parameter-form/parameter-form.component';
import { ParameterListComponent } from './features/parameter/parameter-list/parameter-list.component';
import { ProjectFormComponent } from './features/project/project-form/project-form.component';
import { ProjectListComponent } from './features/project/project-list/project-list.component';
import { DocumentUploadComponent } from './shared/document-upload/document-upload.component';
import { ParameterLocationComponent } from './features/parameter-location/parameter-location.component';
import { ParameterLocationDataComponent } from './features/parameter-location-data/parameter-location-data.component';
import { ParameterLocationListComponent } from './features/parameter-location/parameter-location-list/parameter-location-list.component';
import { DataRequestComponent } from './features/data-request/data-request.component';
import { DataAssignComponent } from './features/institution/data-assign/data-assign.component';
import { DataRequestApproveComponent } from './features/data-request/data-request-approve/data-request-approve.component';
import { StatusHistoryComponent } from './shared/status-history/status-history.component';
import { StatusHistoryPopComponent } from './shared/status-history-pop/status-history-pop.component';

import { SectorComponent } from "./features/metadata/sector/sector.component";
import { UomComponent } from './features/metadata/uom/uom.component';
import { NumericTextDirective } from './shared/directives/numeric-text.directive';
import { PolicyFormComponent } from './features/policy/policy-form/policy-form.component';
import { PolicyListComponent } from './features/policy/policy-list/policy-list.component';

import { GMapModule } from 'primeng/gmap';
import { ParameterDataPurchaseComponent } from './features/data-purchase/parameter-data-purchase/parameter-data-purchase.component';
import { ProjectProgramDataRequestComponent } from './features/data-request/project-program-data-request/project-program-data-request.component';

import { ProjectDataAssignComponent } from './features/institution/project-data-assign/project-data-assign.component';
import { AssignedProjectDataComponent } from './features/institution/assigned-project-data/assigned-project-data.component';
import { ProjectDataEntryComponent } from './features/institution/project-data-entry/project-data-entry.component';
import { MasterComponent } from './shared/master/master.component';
import { ParameterLocationDataSearchComponent } from './features/parameter-location-data/parameter-location-data-search/parameter-location-data-search.component';
import { ProjectFundingDetailsComponent } from './features/project/project-funding-details/project-funding-details.component';
import { PolicyDataRequestComponent } from './features/data-request/policy-data-request/policy-data-request.component';
import { PolicyDataAssignComponent } from './features/institution/policy-data-assign/policy-data-assign.component';
import { AssignedPolicyDataComponent } from './features/institution/assigned-policy-data/assigned-policy-data.component';
import { PolicyDataEntryComponent } from './features/institution/policy-data-entry/policy-data-entry.component';
import { ClimateChangeBarchartComponent } from './shared/climate-change-barchart/climate-change-barchart.component';
import { AuthConfigModule } from './auth/keyclock/auth.config.module';
import { PolicyDataRequestApproveComponent } from './features/data-request/policy-data-request-approve/policy-data-request-approve.component';
import { ProjectProgramDataRequestApproveComponent } from './features/data-request/project-program-data-request-approve/project-program-data-request-approve.component';
import { DataRequestHistoryPolicyComponent } from './features/institution/data-request-history-policy/data-request-history-policy.component';
import { ProjectViewPageComponent } from './features/public/project-view-page/project-view-page.component';
import { PolicyViewPageComponent } from './features/public/poicy/policy-view-page/policy-view-page.component';
import { ProjectViewInfoComponent } from './features/public/project-view-info/project-view-info.component';
import { PolicyViewInfoComponent } from './features/public/policy/policy-view-info/policy-view-info.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NumberOnlyDirective } from './shared/directive/number-only.directive';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CcDataCategoryComponent } from './features/metadata/cc-data-category/cc-data-category.component';
import { UomConversionComponent } from './features/metadata/uom-conversion/uom-conversion.component';
import { AuditComponent } from './features/audit/audit.component';
import { ClimateChangeImpactComponent } from './features/metadata/climate-change-impact/climate-change-impact.component';
import { TawkService } from './features/chat/tawk.service';


export function getRemoteServiceBaseUrl(): string {
  return environment.baseUrlAPI;
}

export function getRemoteServiceDocUploadBaseUrl(): string {
  return environment.baseUrlAPI;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    LoginFormComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
    ToastComponent,
    ModalComponent,
    AlertComponent,
    CurrencyCommasHundredsPipe,
    AppComponent,
    LoginLayoutComponent,
    LoginFormComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
    CurrencyCommasHundredsPipe,
    SearchFilterPipe,
    HomeComponent,
    TwoColumnViewComponent,
    SettingsComponent,
    ErrorpageComponent,
    ParameterFormComponent,
    ParameterListComponent,
    ProjectFormComponent,
    ProjectListComponent,
    DocumentUploadComponent,
    ParameterLocationComponent,
    ParameterLocationDataComponent,
    ParameterLocationListComponent,
    DataRequestComponent,
    DataAssignComponent,
    AssignedDataComponent,
    DataEntryComponent,
    SectorComponent,
    UomComponent,
    NumericTextDirective,
    PolicyFormComponent,
    PolicyListComponent,
    ProjectProgramDataRequestComponent,
    ProjectDataAssignComponent,
    AssignedProjectDataComponent,
    ProjectDataEntryComponent,
    DataRequestApproveComponent,
    StatusHistoryComponent,
    StatusHistoryComponent,
    StatusHistoryPopComponent,
    MasterComponent,
    MitigationComponent,
    ParameterLocationDataSearchComponent,
    ProjectFundingDetailsComponent,
    InstitutionHomeComponent,
    ParameterDataPurchaseComponent,
    PolicyDataRequestComponent,
    PolicyDataAssignComponent,
    AssignedPolicyDataComponent,
    PolicyDataEntryComponent,
    ClimateChangeBarchartComponent,
    PolicyDataRequestApproveComponent,
    ProjectProgramDataRequestApproveComponent,
    DataRequestHistoryComponent,
    DataRequestHistoryProjectComponent, DataRequestHistoryPolicyComponent, ProjectViewPageComponent, PolicyViewPageComponent, ProjectViewInfoComponent, PolicyViewInfoComponent, NumberOnlyDirective, CcDataCategoryComponent, UomConversionComponent, AuditComponent, ClimateChangeImpactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastModule,
    ButtonModule,
    DropdownModule,
    FileUploadModule,
    AutoCompleteModule,
    StepsModule,
    RadioButtonModule,
    CheckboxModule,
    CalendarModule,
    DialogModule,
    PasswordStrengthMeterModule,
    ListboxModule,
    TableModule,
    InputNumberModule,
    InputMaskModule,
    HttpClientModule,
    HttpClientJsonpModule,
    WOSPaymentsModule,
    TabViewModule,
    AccordionModule,
    CardModule,
    SliderModule,
    ToggleButtonModule,
    SplitButtonModule,
    SelectButtonModule,
    TooltipModule,
    ProgressBarModule,
    UserModule,
    ConfirmDialogModule,
    GMapModule,
    GooglemapsModule,
    ChartModule,
    AuthConfigModule,
    ProgressSpinnerModule,
    OverlayPanelModule,
    TreeModule
  ],
  providers: [LoginLayoutService,
    UsersControllerServiceProxy,
    AppControllerServiceProxy,
    ServiceProxy,
    MasterdataControllerServiceProxy,
    ParameterLocationControllerServiceProxy,
    DocumentControllerServiceProxy,
    ConfirmationService,
    ParameterControllerServiceProxy,
    UnitOfMeasureControllerServiceProxy,
    ProjectProgramDataControllerServiceProxy,
    DialogService,
    InstitutionControllerServiceProxy,
    ShoppingCartControllerServiceProxy,
    PolicyDataControllerServiceProxy,
    MasterdataControllerServiceProxy, DocumentControllerServiceProxy, ConfirmationService, DialogService, ParameterControllerServiceProxy, InstitutionControllerServiceProxy,
    ChartControllerServiceProxy, PublicControllerServiceProxy, DatarequestStatusHistoryControllerServiceProxy,
    PolicyControllerServiceProxy, UserDataUsageCategoryControllerServiceProxy,
    { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    RoleGuardService,
    TawkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
