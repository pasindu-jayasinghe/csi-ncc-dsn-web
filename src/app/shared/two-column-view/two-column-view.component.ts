import { Component, OnInit, Input } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';

interface SearchInput {
  name: string;
  id: string;
  value: string;
}

@Component({
  selector: 'app-two-column-view',
  templateUrl: './two-column-view.component.html',
  styleUrls: ['./two-column-view.component.scss'],
})
export class TwoColumnViewComponent implements OnInit {
  //Definition of inputs for shared component
  @Input()
  public titleText: string; // this is the title text used. ex. Buy investment / Sell investment

  @Input()
  public submitButtonText: string; // this is the submit button used. ex. Buy investment / Sell investment

  @Input()
  public searchList: SearchInput[]; // this is the where the investment data obeject is taken to the shared component. there is a search pipe defined for seaching in utils.

  @Input()
  public toggleSellingOptions: boolean = false; //this togglle is used to toggle between units/amounts when selling sotcks

  displayBuyingSummary: boolean; //displayes the buying summary
  displaySellingSummary: boolean; //displays the selling summary
  displayTermsCondition: boolean; //displays the terms & conditions summary
  displayReviewDetails: boolean;
  orderPlacedConfirmation:boolean;

  searchText: string;
  assetTypeFilterValue: string;
  assetSubTypeFilterValue: string;
  fundAssetTypeFilterValue: string;
  listDetails: SearchInput[] = [];
  totalAmount: number;

  filter: boolean; // to show hide the filters in retrieve list
  assetType: SelectItem[];
  assetSubType: SelectItem[];
  fundAssetType: SelectItem[];

  displayInvestmentDetail: boolean = false;

  toggleOptions: SelectItem[];
  toggleAmountsUnits = 1;
  value: boolean;

  //toast message variables
  severity: string;
  summary: string;
  detail: string;


  constructor(private messageService: MessageService) {
    this.toggleOptions = [
      { label: 'AMOUNT', value: 1 },
      { label: 'UNITS', value: 2 },
    ];

    this.assetType = [
      { label: 'Asset Type', value: '0' },
      { label: 'Asset Type 1', value: '1' },
      { label: 'Asset Type 2', value: '2' },
      { label: 'Asset Type 3', value: '3' },
      { label: 'Asset Type 3', value: '4' },
      { label: 'Asset Type 3', value: '5' },
    ];

    this.assetSubType = [
      { label: 'Select asset sub type', value: '0' },
      { label: 'Asset Type 1', value: '1' },
      { label: 'Asset Type 2', value: '2' },
      { label: 'Asset Type 3', value: '3' },
      { label: 'Asset Type 3', value: '4' },
      { label: 'Asset Type 3', value: '5' },
    ];

    this.fundAssetType = [
      { label: 'Fund Asset Type', value: null },
      { label: 'Filter01', value: { id: 2, name: 'Rome', code: 'RM' } },
    ];
  }

  ngOnInit(): void {}

  showDetails(index: number) {
    // this function gets the investment details and shows it in the left column
    this.listDetails.push(this.searchList[index]);
    //setting up the toast message
    this.severity = 'info';
    this.summary = 'Investment added';
    //this.detail = this.searchList[index].name + ' ' + 'sucessfully added';
    this.detail = '';
    this.showToastMessage(this.severity, this.summary, this.detail);

    //removing the element from object
    this.searchList.splice(index, 1);
  }

  removeDetails(index: number) {
    this.searchList.push(this.listDetails[index]); //this function is used to remove the selected investments from right column
    //setting up the toast message
    this.severity = 'warn';
    this.summary = 'Removal of investment';
    //this.detail = this.listDetails[index].name + ' ' + 'sucessfully removed';
    this.detail = '';
    this.showToastMessage(this.severity, this.summary, this.detail);
    //removing the element from object
    this.listDetails.splice(index, 1);
  }

  getTotal() {
    // this calculates the totals
    let total = 0;
    if (this.listDetails) {
      for (let i = 0; i < this.listDetails.length; i++) {
        if (this.listDetails[i].value) {
          total += Number(this.listDetails[i].value);
          this.totalAmount = total;
        }
      }
      return total;
    }
  }

  showInvestmentDetails() {
    // this function is used to show the investment details popoup
    this.displayInvestmentDetail = true;
  }

  showSummary(option: boolean) {
    // this function is used to show the summary after clicking buy investment/sell investment
    if (option) {
      this.displayTermsCondition = true;
    } else {
      this.displayReviewDetails = true;
    }
  }

  showToastMessage(severity: string, summary: string, detail: string) {
    // this invokes the toast message
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      sticky: false,
    });
  }
}
