import { Subject } from 'rxjs';
import { async } from '@angular/core/testing';
import { Mitigation } from './../../../../shared/service-proxies/service-proxies';
import { ServiceProxy, Parameter } from 'src/shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mitigation',
  templateUrl: './mitigation.component.html',
  styleUrls: ['./mitigation.component.scss']
})
export class MitigationComponent implements OnInit {

  itemlist: Mitigation[];
  totalRecords: number;
  eventsSubject: Subject<any> = new Subject<any>();


  constructor(private serviceProxy: ServiceProxy) { }

  ngOnInit(): void {
  }


  search = async (params: any) => {

    let filter: string[] = [];
    console.log(params);

    if (params.searchBy.name) {
      let nameQuery = "name||$cont||" + params.searchBy.name;
      filter.push(nameQuery);
    }
    if (params.searchBy.description) {
      let descQuery = "description||$cont||" + params.searchBy.description;
      filter.push(descQuery);
    }

    this.serviceProxy
      .getManyBaseMitigationControllerMitigation(
        undefined,
        undefined,
        filter.length > 0 ? filter : undefined,
        undefined,
        ["name,ASC"],
        undefined,
        params.rows,
        params.first,
        0,
        0
      )
      .subscribe((res) => {
        this.totalRecords = res.total;
        this.itemlist = res.data;

      });
  }

  save = async (params: any) => {

    // let mitigation = new Mitigation();
    // mitigation.id = params.id
    // mitigation.name = params.name;
    // mitigation.description = params.description;
    // mitigation.sortOrder = params.sortOrder;

    if (params.id == 0) {
      await this.serviceProxy
        .createOneBaseMitigationControllerMitigation(params)
        .subscribe((res) => {
          this.eventsSubject.next(res);
          console.log(res);

        });
    } else {
      await this.serviceProxy
        .updateOneBaseMitigationControllerMitigation(params.id, params)
        .subscribe((res) => {
          this.eventsSubject.next(res);
        });
    }
  }

}
