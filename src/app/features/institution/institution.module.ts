import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitutionListComponent } from './institution-list/institution-list.component';
import { InstitutionFormComponent } from './institution-form/institution-form.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { InstitutionHomeComponent } from './institution-home/institution-home.component';
import { DataRequestHistoryComponent } from './data-request-history/data-request-history.component';
import { DataRequestHistoryProjectComponent } from './data-request-history-project/data-request-history-project.component';
import { DataRequestHistoryPolicyComponent } from './data-request-history-policy/data-request-history-policy.component';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
// import { DataAssignComponent } from './data-assign/data-assign.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



@NgModule({
  declarations: [InstitutionListComponent, InstitutionFormComponent],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    RouterModule,
    TooltipModule,
    ConfirmDialogModule
    

  ]
})
export class InstitutionModule { }
