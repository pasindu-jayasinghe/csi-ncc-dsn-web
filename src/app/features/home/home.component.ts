import { ChartControllerServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthenticationService } from '../login/login-layout/authentication.service';
import { AppService } from 'src/shared/app-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  showloader: Boolean;
  data: any;
  options = {
    title: {
      display: true,
      text: `Users`,
      fontSize: 16
    },
    legend: {
      position: 'bottom'
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          let label = ": " + tooltipItem.value + "%"
          return label;
        }
      }
    },
    scales: {
      xAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
          callback: function (value) { if (value % 1 === 0) { return value + "%"; } }
        }

      }],
      yAxes: [{
        stacked: true,
      }]
    }
  };
  userData: any;


  constructor(private router: Router,
    private authenticationService: AuthenticationService, private chartControllerServiceProxy: ChartControllerServiceProxy) {

    this.authenticationService.authenticate(true, false);
  }

  async ngOnInit(): Promise<void> {

    await this.chartControllerServiceProxy.getDataforUserDataUsage().subscribe(res => {
      this.userData = res;
      console.log(this.userData);
    })

    await this.chartControllerServiceProxy.getDatForClimateChangeChart().subscribe(res => {
      this.data = res;
    })

  }



}
