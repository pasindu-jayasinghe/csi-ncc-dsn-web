import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';





@NgModule({
  declarations: [UserListComponent, UserFormComponent],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    RouterModule,
    InputMaskModule,
    TooltipModule,
    ProgressSpinnerModule,
    ConfirmDialogModule
  ],
  bootstrap: [UserListComponent],
  exports: [RouterModule]

})
export class UserModule { }
