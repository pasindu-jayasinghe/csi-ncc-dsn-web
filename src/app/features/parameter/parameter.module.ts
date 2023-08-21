import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterListComponent } from './parameter-list/parameter-list.component';
import { ParameterFormComponent } from './parameter-form/parameter-form.component';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';

@NgModule({
  declarations: [ParameterListComponent, ParameterFormComponent],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    RouterModule,
    CheckboxModule
  ]
})
export class ParameterModule { }
