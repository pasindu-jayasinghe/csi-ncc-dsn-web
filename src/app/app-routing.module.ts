import { ClimateChangeImpactComponent } from './features/metadata/climate-change-impact/climate-change-impact.component';
import { AuditComponent } from './features/audit/audit.component';
import { UomConversionComponent } from './features/metadata/uom-conversion/uom-conversion.component';
import { CcDataCategoryComponent } from './features/metadata/cc-data-category/cc-data-category.component';
import { PolicyViewInfoComponent } from './features/public/policy/policy-view-info/policy-view-info.component';
import { ProjectViewInfoComponent } from './features/public/project-view-info/project-view-info.component';
import { PolicyViewPageComponent } from './features/public/poicy/policy-view-page/policy-view-page.component';
import { ProjectViewPageComponent } from './features/public/project-view-page/project-view-page.component';
import { DataRequestHistoryPolicyComponent } from './features/institution/data-request-history-policy/data-request-history-policy.component';
import { DataRequestHistoryProjectComponent } from './features/institution/data-request-history-project/data-request-history-project.component';
import { DataRequestHistoryComponent } from './features/institution/data-request-history/data-request-history.component';
import { ProjectProgramDataRequestApproveComponent } from './features/data-request/project-program-data-request-approve/project-program-data-request-approve.component';
import { PolicyDataRequestApproveComponent } from './features/data-request/policy-data-request-approve/policy-data-request-approve.component';
import { InstitutionHomeComponent } from './features/institution/institution-home/institution-home.component';
import { Institution } from './../shared/service-proxies/service-proxies';
import { MitigationComponent } from './features/metadata/mitigation/mitigation.component';
import { DataRequestApproveComponent } from './features/data-request/data-request-approve/data-request-approve.component';
import { DataEntryComponent } from './features/institution/data-entry/data-entry.component';
import { AssignedDataComponent } from './features/institution/assigned-data/assigned-data.component';
import { DataRequestComponent } from './features/data-request/data-request.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginLayoutComponent } from './features/login/login-layout/login-layout.component';


import { ErrorpageComponent } from './errorpage/errorpage.component';
import { SettingsComponent } from './settings/settings.component';
import { SetPasswordComponent } from './features/login/set-password/set-password.component';
import { HomeComponent } from './features/home/home.component';
import { UserListComponent } from './features/user/user-list/user-list.component';
import { UserFormComponent } from './features/user/user-form/user-form.component';
import { InstitutionListComponent } from './features/institution/institution-list/institution-list.component';
import { InstitutionFormComponent } from './features/institution/institution-form/institution-form.component';
import { ProjectListComponent } from './features/project/project-list/project-list.component';
import { ProjectFormComponent } from './features/project/project-form/project-form.component';
import { RoleGuardService as RoleGuard } from './auth/role-guard.service';
import { ParameterListComponent } from './features/parameter/parameter-list/parameter-list.component';
import { ParameterFormComponent } from './features/parameter/parameter-form/parameter-form.component';
import { ParameterLocationListComponent } from './features/parameter-location/parameter-location-list/parameter-location-list.component';
import { DataAssignComponent } from './features/institution/data-assign/data-assign.component';
import { SectorComponent } from "./features/metadata/sector/sector.component";
import { UomComponent } from './features/metadata/uom/uom.component';
import { PolicyListComponent } from './features/policy/policy-list/policy-list.component';
import { PolicyFormComponent } from './features/policy/policy-form/policy-form.component';
import { ParameterDataPurchaseComponent } from './features/data-purchase/parameter-data-purchase/parameter-data-purchase.component';
import { ProjectProgramDataRequestComponent } from './features/data-request/project-program-data-request/project-program-data-request.component';
import { ProjectDataAssignComponent } from './features/institution/project-data-assign/project-data-assign.component';
import { AssignedProjectDataComponent } from './features/institution/assigned-project-data/assigned-project-data.component';
import { ProjectDataEntryComponent } from './features/institution/project-data-entry/project-data-entry.component';
import { ParameterLocationDataSearchComponent } from './features/parameter-location-data/parameter-location-data-search/parameter-location-data-search.component';
import { PolicyDataRequestComponent } from './features/data-request/policy-data-request/policy-data-request.component';
import { PolicyDataAssignComponent } from './features/institution/policy-data-assign/policy-data-assign.component';
import { AssignedPolicyDataComponent } from './features/institution/assigned-policy-data/assigned-policy-data.component';
import { PolicyDataEntryComponent } from './features/institution/policy-data-entry/policy-data-entry.component';


const routes: Routes = [
  { path: 'login', component: LoginLayoutComponent },
  { path: 'resetPassword', component: LoginLayoutComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'error', component: ErrorpageComponent },
  { path: 'reset-password', component: SetPasswordComponent },
  {
    path: 'home', component: HomeComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'user-list', component: UserListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin', 'ins-admin']
    }
  },
  {
    path: 'user', component: UserFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin', 'ins-admin']
    }
  },
  {
    path: 'user-new', component: UserFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin', 'ins-admin']
    }
  },

  {
    path: 'institution-list', component: InstitutionListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'institution', component: InstitutionFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'institution-new', component: InstitutionFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'institution-dataassign', component: DataAssignComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-admin']
    }
  },
  {
    path: 'institution-assigneddata', component: AssignedDataComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-deo', 'ins-admin']
    }
  },
  {
    path: 'institution-dataentry', component: DataEntryComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-admin', 'ins-deo']
    }
  },
  {
    path: 'institution-project-data-assign', component: ProjectDataAssignComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-admin']
    }
  },
  {
    path: 'institution-project-data-entry-requests', component: AssignedProjectDataComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-deo', 'ins-admin']
    }
  },
  {
    path: 'institution-project-data-entry', component: ProjectDataEntryComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-admin', 'ins-deo']
    }
  },
  {
    path: 'institution-policy-data-assign', component: PolicyDataAssignComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-admin']
    }
  },
  {
    path: 'institution-policy-data-entry-requests', component: AssignedPolicyDataComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-deo', 'ins-admin']
    }
  },
  {
    path: 'institution-policy-data-entry', component: PolicyDataEntryComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-admin', 'ins-deo']
    }
  },
  {
    path: 'institution-home', component: InstitutionHomeComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ins-admin']
    }
  },
  // { path: 'institution-list', component: InstitutionListComponent },
  // { path: 'institution', component: InstitutionFormComponent },
  // { path: 'institution-new', component: InstitutionFormComponent },
  // { path: 'institution-dataassign', component: DataAssignComponent },
  // { path: 'institution-assigneddata', component: AssignedDataComponent },
  // { path: 'institution-dataentry', component: DataEntryComponent },
  // { path: 'institution-project-data-assign', component: ProjectDataAssignComponent },
  // { path: 'institution-project-data-entry-requests', component: AssignedProjectDataComponent },
  // { path: 'institution-project-data-entry', component: ProjectDataEntryComponent },
  // { path: 'institution-policy-data-assign', component: PolicyDataAssignComponent },
  // { path: 'institution-policy-data-entry-requests', component: AssignedPolicyDataComponent },
  // { path: 'institution-policy-data-entry', component: PolicyDataEntryComponent },
  // { path: 'institution-home', component: InstitutionHomeComponent },
  { path: 'institution-data-request-history/parametr', component: DataRequestHistoryComponent },
  { path: 'institution-data-request-history/project', component: DataRequestHistoryProjectComponent },
  { path: 'institution-data-request-history/policy', component: DataRequestHistoryPolicyComponent },


  {
    path: 'parameter', component: ParameterFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'parameter-new', component: ParameterFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'parameter-list', component: ParameterListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'parameter-location-list', component: ParameterLocationListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'parameter-location-data/search', component: ParameterLocationDataSearchComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },

  {
    path: 'data-request/parameter', component: DataRequestComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'data-request/project-program', component: ProjectProgramDataRequestComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'data-request/policy', component: PolicyDataRequestComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'data-request', component: DataRequestComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'data-request-approve', component: DataRequestApproveComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },

  // { path: 'data-request/parameter', component: DataRequestComponent },
  // { path: 'data-request/project-program', component: ProjectProgramDataRequestComponent },
  // { path: 'data-request/policy', component: PolicyDataRequestComponent },
  // { path: 'data-request', component: DataRequestComponent },
  // { path: 'data-request-approve', component: DataRequestApproveComponent },
  // { path: 'data/parameters', component: ParameterDataPurchaseComponent },
  { path: 'data-request-approve-policy', component: PolicyDataRequestApproveComponent },
  { path: 'data-request-approve-projectprogram', component: ProjectProgramDataRequestApproveComponent },

  {
    path: 'data/parameters', component: ParameterDataPurchaseComponent
  },
  { path: 'public/project-view-page', component: ProjectViewPageComponent },
  { path: 'public/policy-view-page', component: PolicyViewPageComponent },

  { path: 'public/project-view-info', component: ProjectViewInfoComponent },
  { path: 'public/policy-view-info', component: PolicyViewInfoComponent },









  {
    path: 'admin',
    component: UserFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'project-list', component: ProjectListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin', 'ins-admin']
    }
  },
  {
    path: 'project', component: ProjectFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin', 'ins-admin']
    }
  },
  {
    path: 'project-new', component: ProjectFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin', 'ins-admin']
    }
  },
  {
    path: 'policy-list', component: PolicyListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin', 'ins-admin']
    }
  },
  {
    path: 'policy', component: PolicyFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin', 'ins-admin']
    }
  },
  {
    path: 'policy-new', component: PolicyFormComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin', 'ins-admin']
    }
  },
  {
    path: 'audit', component: AuditComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: "masterdata/sector", component: SectorComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: "masterdata/unit-of-measure", component: UomComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: "masterdata/unit-of-measure-conversion", component: UomConversionComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'masterdata/mitigation', component: MitigationComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'masterdata/ccdatacategory', component: CcDataCategoryComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
  {
    path: 'masterdata/ccimpact', component: ClimateChangeImpactComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },

  {
    path: '**', redirectTo: 'home',
    canActivate: [RoleGuard],
    data: {
      expectedRoles: ['ccs-admin']
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
