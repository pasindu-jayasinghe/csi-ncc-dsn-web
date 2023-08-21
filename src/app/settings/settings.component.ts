import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  displayTermsCondition: boolean;
  displaySellingSummary: boolean;
  tankyouPayment: boolean;
  value: boolean;
  displaybuyingSummary: boolean;
  pleaseReview: boolean;
  orderPlaced:boolean;
  errorPopup: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  ShowTermsCondition(){
    this.displayTermsCondition = true;
  }

  ShowSellingSummary(){
    this.displaySellingSummary = true;
  }

  ShowThankyouPayment(){
    this.tankyouPayment = true;
  }

  ShowBuyingPayment(){
    this.displaybuyingSummary = true;
  }

  ShowPleaseReview(){
    this.pleaseReview = true;
  }

  ShowOrderPlaced(){
    this.orderPlaced = true;
  }

  ShowErrorPopup(){
    this.errorPopup = true;
  }

}
