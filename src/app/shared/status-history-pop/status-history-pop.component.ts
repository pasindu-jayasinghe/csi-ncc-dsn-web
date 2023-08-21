import { MasterdataControllerServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { StatusHistoryComponent } from './../status-history/status-history.component';
import { MessageService } from 'primeng/api';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-status-history-pop',
  templateUrl: './status-history-pop.component.html',
  styleUrls: ['./status-history-pop.component.scss']
})
export class StatusHistoryPopComponent implements OnInit {

  private eventsSubscription: Subscription;
  @Input() showDetailEvent: Observable<number>;
  ref: DynamicDialogRef;
  data: number;

  constructor(public dialogService: DialogService, public messageService: MessageService) { }

  ngOnInit(): void {
    this.eventsSubscription = this.showDetailEvent.subscribe((a) => this.show(a));
  }

  show(id: number) {
    this.ref = this.dialogService.open(StatusHistoryComponent, {
      data: { id },
      header: 'Status History',
      width: '70%',
      contentStyle: { "max-height": "500px", "overflow": "auto" },
      baseZIndex: 10000
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

}
