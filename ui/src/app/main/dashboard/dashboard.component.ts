import { CommonModule } from '@angular/common';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment, { Moment } from 'moment';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { DashboardService } from './dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  non_series: ApexNonAxisChartSeries;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgApexchartsModule, NgxDaterangepickerMd, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  @ViewChild("chart",{ static: false }) chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;
  storeSummary:any = []
  invoiceSummary:any = []
  selected = { startDate: moment().subtract(29, 'days'), endDate: moment() };
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
    'Last 3 Month': [
      moment().subtract(3, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
  };

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [
        { name: "Total Amount Paid", data: [] },
        { name: "Total Invoice Amount", data: [] },
        { name: "Total Items Sold", data: [] }
      ],
      chart: {
        type: "bar",
        height: 350

      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "40%" }
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: { categories: [] },
      yaxis: { title: { text: "$ (thousands)" } },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }

  ngOnInit() {
    this.chosenDate();
  }



    chosenDate() {
      this.getStoreSummary()
      this.loadData()
    }

 
    getStoreSummary(){
      this.dashboardService.getStoreSummary(this.selected.startDate, this.selected.endDate).subscribe((summary) => {
        this.storeSummary = summary;
        console.log(this.storeSummary);
        console.log(this.storeSummary.stockWorth || this.storeSummary.invoiceReturns != null || this.storeSummary.totalQuantities != null)

      });
    }

    addCommasToNumber(number:number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  loadData() {
    this.dashboardService
      .getInvoiceSummary(this.selected.startDate, this.selected.endDate)
      .subscribe((response) => {
        console.log(response);
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const categories = response.summary.map((item: any) =>
          `${monthNames[item.month - 1]} ${item.year}`
        );


        const totalAmountPaid = response.summary.map((item: any) =>
          item.totalAmountPaid.toFixed(2)
        );

        const totalInvoiceAmount = response.summary.map((item: any) =>
          item.totalInvoiceAmount.toFixed(2)
        );

        const totalItemsSold = response.summary.map((item: any) =>
          item.totalItemsSold.toFixed(2)
        );
        this.chartOptions = {
          ...this.chartOptions, // Keep other chart options unchanged
          series: [
            { name: "Total Amount Paid", data: totalAmountPaid },
            { name: "Total Invoice Amount", data: totalInvoiceAmount },
            { name: "Total Items Sold", data: totalItemsSold }
          ],
          xaxis: { categories }
        };
  
        this.cdr.detectChanges();
      });
  }
}
