import { ConditionalExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { stat } from 'fs';
import { Subject } from 'rxjs';
import { Parameter } from 'src/shared/service-proxies/service-proxies';

@Injectable()
export class ParamterService {

  // Observable string sources
  private parameterUpdateSource = new Subject<string>();

  private paramterReceivedSource = new Subject<Parameter>();

  private parameterLocationsAvailale = new Subject<boolean>();

  // Observable string streams
  paramterUpdate$ = this.parameterUpdateSource.asObservable();

  paramterReceived$ = this.paramterReceivedSource.asObservable();

  parameterLocationsAvailaleUpdated$ = this.parameterLocationsAvailale.asObservable();

  // Service message commands
  saveLocation(saveLocation: string) {
    console.log("saveLocation service - saveLocation");

    this.parameterUpdateSource.next(saveLocation);
  }

  paramterReceived(status : Parameter){
    this.paramterReceivedSource.next(status);
  }

  paramterLocationChnage(status : boolean){
    this.parameterLocationsAvailale.next(status);
  }

  
}