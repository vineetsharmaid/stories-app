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
  public barChartData: Array<object>;

  constructor(private activatedRoute: ActivatedRoute, private dashboardService: DashboardService) { }
 
  ngOnInit() {


      this.getDashboardData();
      this.getUserRegisterData();
      this.getAvgEngagementData();
      
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

  plotBarChart() {

    // Create chart instance
    let chart:any;
    chart = am4core.create("barChartdiv", am4charts.XYChart);

    chart.data = this.barChartData;
    // chart.data = [{
    //   "country": "USA",
    //   "visits": 2025
    // }, {
    //   "country": "Germany",
    //   "visits": 1322
    // }, {
    //   "country": "France",
    //   "visits": 1114
    // }, {
    //   "country": "India",
    //   "visits": 984
    // }, {
    //   "country": "Russia",
    //   "visits": 580
    // }, {
    //   "country": "Canada",
    //   "visits": 441
    // }];

    // Create axes

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "type";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 1;

    categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
      if (target.dataItem && target.dataItem.index & 2 == 2) {
        return dy + 25;
      }
      return dy;
    });

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "data";
    series.dataFields.categoryX = "type";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
  }

  getUserRegisterData() {


    this.dashboardService.getUserRegisterData().subscribe((response) => {

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

  getAvgEngagementData() {

    this.dashboardService.getAvgEngagementData().subscribe((response) => {
      
      this.barChartData = response['data'];
      this.plotBarChart();
    } , (error) => {

      // this.dashboardData = {};
      return [];
      console.log(error);
    });
  }
}
