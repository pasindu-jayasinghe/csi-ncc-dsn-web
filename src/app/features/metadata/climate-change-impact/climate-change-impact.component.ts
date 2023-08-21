import { Subject } from 'rxjs';
import { ClimateImpact, ServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-climate-change-impact',
  templateUrl: './climate-change-impact.component.html',
  styleUrls: ['./climate-change-impact.component.scss']
})
export class ClimateChangeImpactComponent implements OnInit {

  itemlist: ClimateImpact[];
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
      .getManyBaseCcImpactControllerClimateImpact(
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
        .createOneBaseCcImpactControllerClimateImpact(params)
        .subscribe((res) => {
          this.eventsSubject.next(res);
          console.log(res);

        });
    } else {
      await this.serviceProxy
        .updateOneBaseCcImpactControllerClimateImpact(params.id, params)
        .subscribe((res) => {
          this.eventsSubject.next(res);
        });
    }
  }

}
