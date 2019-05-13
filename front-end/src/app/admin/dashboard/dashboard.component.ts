import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { Router, ActivatedRoute } from '@angular/router';
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";


import { DashboardService } from '../../services/admin/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public dashboardData: object;
  public chartData: Array<object>;

  constructor(private activatedRoute: ActivatedRoute, private dashboardService: DashboardService) { }
 
  ngOnInit() {


      this.getDashboardData();
      this.getUserRegisterData();
      
      this.activatedRoute.data.subscribe((routeData) => {
         
        console.log('routeData dashboard', routeData);
      });

  }


  getDashboardData() {

    this.dashboardService.getDashboardData().subscribe((response) => {

      console.log(response);
      this.dashboardData = response['data'];
    } , (error) => {

      this.dashboardData = {};
      console.log(error);
    });
  }

  plotChart() {

    // Create chart instance
    let chart:any;
    chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.data = this.chartData;

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "count";
    series.dataFields.dateX = "created";
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12,12,12,12)

    // Add scrollbar
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    dateAxis.tooltipDateFormat = "dd-MM-yyyy";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

  }

  getUserRegisterData() {


    this.dashboardService.getUserRegisterData().subscribe((response) => {

      console.log('getUserRegisterData response', response);
      var data = response['data'];
      data.forEach((user) => {
        
        // Split timestamp into [ Y, M, D, h, m, s ]
        var date = user['created'].split(/[- :]/);

        // Apply each element to the Date function
        user['created'] = new Date(Date.UTC(date[0], date[1]-1, date[2], date[3], date[4], date[5]));
      })
      this.chartData = data;
      this.plotChart();
    } , (error) => {

      // this.dashboardData = {};
      return [];
      console.log(error);
    });
  }
}
