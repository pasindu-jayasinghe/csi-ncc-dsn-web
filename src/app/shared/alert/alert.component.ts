import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() alertHeader: string;
  @Input() alertBody: string;
  @Input() alertType: AlertType = AlertType.Message;
  @Input() showAlert: boolean = false;
  @Output() alertClose = new EventEmitter<any>();


  allAlertType = AlertType;

  constructor() { }

  ngOnInit(): void {
  }

  closeClick() {
    this.showAlert = false
    this.alertClose.emit(false);
  }

}

export enum AlertType {
  Message,
  Warning,
  Error
}
