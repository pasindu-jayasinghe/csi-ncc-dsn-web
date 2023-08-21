import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-climate-change-barchart',
  templateUrl: './climate-change-barchart.component.html',
  styleUrls: ['./climate-change-barchart.component.scss']
})
export class ClimateChangeBarchartComponent implements OnInit {

  @Input() title: string;
  @Input() data: any;
  @Input() chartName: string;
  options: any;

  constructor() { }

  ngOnInit(): void {

    this.options = {
      title: {
        display: true,
        text: `Climate Change ${this.chartName} Collection.`,
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true,
            callback: function (value) { if (value % 1 === 0) { return value; } }
          }

        }],
        yAxes: [{
          stacked: true,
        }]
      }
    };
  }

}
