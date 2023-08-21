import { Component, OnInit } from '@angular/core';
import { Institution, ServiceProxy, User, UserType } from 'src/shared/service-proxies/service-proxies';
import { TableModule } from 'primeng/table';
import { LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {


  rows: number = 10;

  loading: boolean;

  customers: User[];

  totalRecords: number;

  searchText: string = "";
  searchEmailText: string;
  searchLastText: string;

  instuitutionList: Institution[];
  selctedInstuitution: Institution;

  userTypes: UserType[] = [];
  selctedUserType: UserType;



  constructor(
    private serviceProxy: ServiceProxy,
    private router: Router
  ) { }

  ngOnInit(): void {

    // this.serviceProxy.getManyBaseUserv2ControllerUser([],"{}",[],[],[],[],10,0,1,0).subscribe (res=> {
    //     console.log(res);
    //     this.customers = res.data;
    // } );

    this.serviceProxy.getManyBaseInstitutionControllerInstitution(undefined,
      undefined,
      undefined,
      undefined, ["name,ASC"], undefined, 1000, 0, 0, 0).subscribe(res => {
        this.instuitutionList = res.data;
      });

    this.serviceProxy.getManyBaseUserTypeControllerUserType(undefined, undefined, undefined, undefined, ["name,ASC"], undefined, 1000, 0, 1, 0).subscribe(res => {
      this.userTypes = res.data;
    });

  }

  getFilter() {

    let filters: string[] = [];

    if (this.searchText && this.searchText.length > 0) {
      filters.push('firstName||$cont||' + this.searchText);
    }

    if (this.selctedInstuitution) {
      let filter = 'institution.id||$eq||' + this.selctedInstuitution.id;
      filters.push(filter);
    }


    return filters;
  }
  getFilterand() {

    let filters: string[] = [];

    if (this.searchText && this.searchText.length > 0) {
      filters.push('firstName||$cont||' + this.searchText);
    }

    if (this.searchLastText && this.searchLastText.length > 0) {
      filters.push('lastName||$cont||' + this.searchLastText);
    }

    if (this.searchEmailText && this.searchEmailText.length > 0) {
      filters.push('email||$cont||' + this.searchEmailText);
    }

    if (this.selctedUserType) {
      filters.push('userType.Id||$cont||' + this.selctedUserType.id);
    }

    if (this.selctedInstuitution) {
      let filter = 'institution.Id||$eq||' + this.selctedInstuitution.id;
      filters.push(filter);
    }

    console.log(filters);


    return filters;
  }

  getFilterOr() {

    let filters: string[] = [];

    // if (this.searchText && this.searchText.length > 0) {
    //   filters.push('email||$cont||' + this.searchText);
    //   filters.push('lastName||$cont||' + this.searchText);
    //   filters.push('firstName||$cont||' + this.searchText);
    // }

    // console.log(filters);


    return filters;
  }

  searchGain() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;

    this.loadCustomers(a);

  }


  loadCustomers(event: LazyLoadEvent) {
    console.log("loadCustomers===", event)
    this.loading = true;

    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value



    this.serviceProxy.getManyBaseUserv2ControllerUser(undefined,
      undefined,
      this.getFilterand(),
      this.getFilterOr(),
      ["firstName,ASC"],
      ["institution"],
      event.rows, event.first, 0, 0).subscribe(res => {

        console.log(res);
        this.totalRecords = res.total;
        this.customers = res.data;
        this.loading = false;

      });


  }

  onKeydown(event) {
    if (event.key === "Enter") {
      console.log(event);
      this.searchGain();
    }
  }

  editUser(user: User) {
    console.log("edit user", user);

    this.router.navigate(['/user'], { queryParams: { id: user.id } });
  }

  new() {
    this.router.navigate(['/user-new']);
  }


}
