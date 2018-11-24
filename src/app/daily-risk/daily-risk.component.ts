import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

import { DataService } from '../data.service';

@Component({
  selector: 'app-daily-risk',
  templateUrl: './daily-risk.component.html',
  styleUrls: ['./daily-risk.component.css']
})
export class DailyRiskComponent implements OnInit {
  root_div;
  width;
  height;
  canvas;


  constructor(private dataService : DataService) { }

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    // margin convention
    this.root_div = d3.select("#daily-risk-div");
    var c_width = this.root_div.node().getBoundingClientRect().width;
    var c_height=900;
    var svg = this.root_div.append("svg")
      .attr("width",c_width)
      .attr("height",c_height);
    var margin = {top:50, right:20,bottom:20, left:20};
    this.width = c_width - margin.left - margin.right;
    this.height = c_height -margin.top -margin.bottom;

    this.canvas= svg.append('g')
      .attr("transform","translate("+margin.left+", "+margin.top+")");
  }

}
