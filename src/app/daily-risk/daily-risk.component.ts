import { Component, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3';

import { DataService } from '../data.service';

export interface HighwayLine {name:string, counts: HourData[],category:string}
export interface HourData {hour:string, count: number}

@Component({
  selector: 'app-daily-risk',
  templateUrl: './daily-risk.component.html',
  styleUrls: ['./daily-risk.component.css']
})
export class DailyRiskComponent implements OnInit {
  root_div;
  margin;
  border;
  canvas;
  main_g;
  side_g;
  tooltip;
  raw_dataset:HighwayLine[];
  line_generator;


  category:string ="I";
  hours;

  categoryOptions;

  constructor(private dataService : DataService) { }

  ngOnInit() {
    this.initOptions();
    this.initChart();
  }

  initOptions(){
    this.categoryOptions=[
      {name:"InterState",value:"I"},
      {name:"IntraState",value:"S"},
    ]
  }

  initChart() {
    // margin convention
    this.root_div = d3.select("#daily-risk-div");
    //var c_width = this.root_div.node().getBoundingClientRect().width;
    var c_width = window.innerWidth;
    var c_height=600;
    this.canvas = this.root_div.append("svg")
      .attr("width",c_width)
      .attr("height",c_height);

    // set border
    var margin = {top:50, right:20,bottom:20, left:60};
    this.margin = margin;
    this.border = {
      width    : (c_width - margin.left - margin.right)*0.75,
      height   : (c_height - margin.top - margin.bottom)*0.9,
      m_s_padding : (c_width - margin.left - margin.right)*0.05,
      s_width  : (c_width - margin.left - margin.right)*0.2,
      s_height : c_height - margin.top - margin.bottom
    };


    this.main_g= this.canvas.append("g")
      .attr("class","main-group")
      .attr("transform", "translate("+ margin.left+", "+margin.top+")")

    this.side_g= this.canvas.append("g")
      .attr("class","side-group")
      .attr("transform", "translate(" + 
        (margin.left + this.border.width + this.border.m_s_padding)+
        ", "+ margin.top + ")")

    this.tooltip = this.root_div.append("div")
      .attr("id","tooltip-risk")
      .style("opacity","0")
      .style("position","absolute")
      .style("text-align","center")
      .style("padding","2px")
      .style("border-radius","8px")
      .style("background","lightsteelblue");

    this.renderChart();
  }

  renderChart(){
    d3.json("./mock-data/dayPattern.json").then((raw_dataset: HighwayLine[])=>{
      this.raw_dataset=raw_dataset;
      let dataset=raw_dataset.filter(d=>d.category==this.category);

      let hours = raw_dataset[0]["counts"].map(d=>d["hour"]);
      this.hours =hours
      let highways = dataset.map(d=>d.name)

      let max_count = this.getMaxCount(dataset);

      var x_scale= d3.scalePoint<string>()
        .domain(hours)
        .rangeRound([0,this.border.width])
        .padding(0.1);
      var y_scale= d3.scaleLinear()
        .domain([0,max_count])
        .rangeRound([this.border.height,0]);
      var legend_y_scale = d3.scalePoint()
        .domain(dataset.map(d=>d.name))
        .rangeRound([30,this.border.height-30])

      var color_scale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(highways);

      this.main_g.append('g')
          .attr('class',"axis axis--x")
          .attr("transform", "translate(0,"+ this.border.height +")")
          .call(d3.axisBottom(x_scale));

      this.main_g.append('g')
          .attr('class',"axis axis--y")
          .call(d3.axisLeft(y_scale).ticks(10));


      //y-axes title
      this.canvas.append("text")
        .attr('class',"y-label")
        .attr("transform","rotate(-90)" )
        .attr("y",0+(this.margin.left/3))
        .attr("x",0-(this.border.height/2))
        .attr("text-anchor","middle")
        .style("fill","black")
        .text("HDI");
      
      //x-axes title
      this.canvas.append("text")
        .attr('class',"x-label")
        .attr("y",this.margin.top + this.border.height*1.1)
        .attr("x",this.margin.left + (this.border.width/2))
        .attr("text-anchor","middle")
        .style("fill","black")
        .text("Time");

      // line
      this.line_generator = d3.line()
      //.curve(d3.curveBasis)
        .x(d=>x_scale(d["hour"]))
        .y(d=>y_scale(d["count"]));

      var lines=this.main_g.selectAll(".freeway-path") 
        .data(dataset).enter()
        .append('g')
        .attr("class",d=>(d["name"]+"-path"))
        .classed("freeway-path",true)
        .style("stroke",c=>color_scale(c["name"]))
        .style("stroke-width","2px")
        .style("fill","none")
        .attr("opacity",1)

      lines.append("path")
        .attr("d",data=>this.line_generator(data["counts"]))
        // .on("mouseover",function(d){
        //   d3.select(this).transition().duration(200)
        //     .style("stroke-width","5px")
        // }).on("mouseleave",function(d){
        //   d3.select(this).transition().duration(200)
        //     .style("stroke-width","2px")
        // });

      lines.selectAll('circle')
        .data(d=>d["counts"]).enter()
        .append('circle')
        .attr('cx',(d)=>x_scale(d["hour"]))
        .attr('cy',(d)=>y_scale(d["count"]))
        .attr('r',2);
      
      // legend
      var legends= this.side_g.selectAll(".freeway-legend")
        .data(dataset).enter().append('g')
        .attr("class",d=>{return d["name"]+"-legend"} )
        .classed("freeway-legend", true)
        .attr("transform", d=> { return "translate(0,"+legend_y_scale(d["name"])+")" });

      legends.append('circle')
        .attr('position',"relative")
        .style('fill',d=>color_scale(d["name"]) )
        .style('stroke',d=>color_scale(d["name"]))
        .attr('r',5)
        .on("mouseover", function(d){
          d3.select("."+d["name"]+"-path").transition().duration(200)
            .style("stroke-width","5px");
        })
        .on("mouseleave", function(d){
          d3.select("."+d["name"]+"-path").transition().duration(100)
            .style("stroke-width","2px");
        })
        .on("click", function(d){
          var line = d3.select("."+ d["name"] +"-path");
          var circle = d3.select(this);
          var state = line.attr("opacity");

          circle.transition()
            .duration(100)
            .style("fill", state=="1"?"white":color_scale(d["name"]));

          line.transition()
            .duration(200)
            .attr("opacity", state=="1"?0:1);
        });

        legends.append('text')
          .text(d=>d["name"])
          .attr('text-anchor','start')
          .attr('alignment-baseline','middle')
          .style("fill","black")
          .attr('dx',10)
          .attr('dy',1.25);


        var myBoolean=new Boolean(true);
        // tooltips
        lines.selectAll('.tooltips')
          .data(d=>d["counts"])
          .enter()
          .append('text')
          .attr('x',(d)=>x_scale(d["hour"]))
          .attr('y',(d)=>y_scale(d["count"]))
          .attr('class', "tooltips")
          .attr('id', (d)=>("tooltip-"+ d["hour"]))
          .text(d=>(d["count"]))
          .attr("font-size","12px")
          .style("fill", "black")
          .style("stroke-width", "0.5px")
          .style('opacity', 0);
        
        // guide line
        d3.select("#guide_line_button")
          .on("click", function(d){
            if (myBoolean == true){
              d3.selectAll("#guide_line").attr("opacity", 0);
              myBoolean = false;
            } else {
              myBoolean = true;
            }
            d3.selectAll(".tooltips").style('opacity', 0);
            d3.select("#guide_line_button").transition()
              .duration(100)
              .style("opacity", myBoolean==true?"1":"0.5");
          });

        var guide_line = this.main_g.append("g")
          .append("line")
          .attr("id", "guide_line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 0)
          .attr("y2", this.border.height)
          .attr("fill", "black")
          .attr("stroke","gray")
          .attr("stroke-width","2px")
          .attr("opacity", 1)
          
        var focus = this.main_g.append("g")
          .attr("class", "focus")
          .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5);

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        this.main_g.append("rect")
            .attr("class", "overlay")
            .attr("width", this.border.width)
            .attr("height", this.border.height)
            .on("mouseover", function() { focus.style("display", "none"); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", scalePointPosition);

        function scalePointPosition() {
          if (myBoolean == true) {
            d3.selectAll("#guide_line")
              .attr("opacity", 1)
            var xPos = d3.mouse(this)[0];
            var domain = x_scale.domain(); 
            var range = x_scale.range();
            var rangePoints = d3.range(range[0], range[1], x_scale.step())
            var yPos = domain[d3.bisect(rangePoints, xPos) -1];
            guide_line.transition().duration(10).attr("x1", d3.mouse(this)[0]).attr("x2", d3.mouse(this)[0])
            d3.selectAll(".tooltips").style('opacity', 0)
            d3.selectAll("#tooltip-" + yPos).style('opacity', 1);	    
          } else {
            d3.selectAll("#guide_line")
              .attr("opacity", 0);
          }
      }
    })
  }

  reRenderChart($event){
    let dataset=this.raw_dataset.filter(d=>d.category==this.category);
    let highways = dataset.map(d=>d.name);
    let max_count = this.getMaxCount(dataset);

    var x_scale= d3.scalePoint<string>()
      .domain(this.hours)
      .rangeRound([0,this.border.width])
      .padding(0.1);
    var y_scale= d3.scaleLinear()
      .domain([0,max_count])
      .rangeRound([this.border.height,0]);

    var legend_y_scale = d3.scalePoint()
      .domain(dataset.map(d=>d.name))
      .rangeRound([30,this.border.height-30])
    var color_scale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(highways);

    this.line_generator = d3.line()
    //.curve(d3.curveBasis)
      .x(d=>x_scale(d["hour"]))
      .y(d=>y_scale(d["count"]));

    this.main_g.selectAll(".freeway-path").remove();
    var lines=this.main_g.selectAll(".freeway-path") 
      .data(dataset).enter()
      .append('g')
      .attr("class",d=>(d["name"]+"-path"))
      .classed("freeway-path",true)
      .style("stroke",c=>color_scale(c["name"]))
      .style("stroke-width","2px")
      .style("fill","none")
      .attr("opacity",1)

    lines.append("path")
      .attr("d",data=>this.line_generator(data["counts"]))
      .on("mouseover",function(d){
        d3.select(this).transition().duration(200)
          .style("stroke-width","5px")
      }).on("mouseleave",function(d){
        d3.select(this).transition().duration(200)
          .style("stroke-width","2px")
      });

    lines.selectAll('circle')
      .data(d=>d["counts"]).enter()
      .append('circle')
      .attr('cx',(d)=>x_scale(d["hour"]))
      .attr('cy',(d)=>y_scale(d["count"]))
      .attr('r',2);

    this.side_g.selectAll(".freeway-legend").remove();
    var legends= this.side_g.selectAll(".freeway-legend")
      .data(dataset).enter().append('g')
      .attr("class",d=>{return d["name"]+"-legend"} )
      .classed("freeway-legend", true)
      .attr("transform", d=> { return "translate(0,"+legend_y_scale(d["name"])+")" });

    legends.append('circle')
      .attr('position',"relative")
      .style('fill',d=>color_scale(d["name"]) )
      .style('stroke',d=>color_scale(d["name"]))
      .attr('r',5)
      .on("mouseover", function(d){
        d3.select("."+d["name"]+"-path").transition().duration(200)
          .style("stroke-width","5px");
      })
      .on("mouseleave", function(d){
        d3.select("."+d["name"]+"-path").transition().duration(100)
          .style("stroke-width","2px");
      })
      .on("click", function(d){
        var line = d3.select("."+ d["name"] +"-path");
        var circle = d3.select(this);
        var state = line.attr("opacity");

        circle.transition()
          .duration(100)
          .style("fill", state=="1"?"black":color_scale(d["name"]));

        line.transition()
          .duration(200)
          .attr("opacity", state=="1"?0:1);
      });

    legends.append('text')
      .text(d=>d["name"])
      .attr('text-anchor','start')
      .attr('alignment-baseline','middle')
      .style("fill","black")
      .attr('dx',10)
      .attr('dy',1.25);
    
    
    d3.select("#guide_line_button").transition()
      .style("opacity", "1");
    d3.select("#guide_line").remove();

    var myBoolean=new Boolean(true);
    // tooltips
    lines.selectAll('.tooltips')
      .data(d=>d["counts"])
      .enter()
      .append('text')
      .attr('x',(d)=>x_scale(d["hour"]))
      .attr('y',(d)=>y_scale(d["count"]))
      .attr('class', "tooltips")
      .attr('id', (d)=>("tooltip-"+ d["hour"]))
      .text(d=>(d["count"]))
      .attr("font-size","12px")
      .style("fill", "black")
      .style("stroke-width", "0.5px")
      .style('opacity', 0);
    
    // guide line
    d3.select("#guide_line_button")
      .on("click", function(d){
        if (myBoolean == true){
          d3.selectAll("#guide_line").attr("opacity", 0);
          myBoolean = false;
        } else {
          myBoolean = true;
        }
        d3.selectAll(".tooltips").style('opacity', 0);
        d3.select("#guide_line_button").transition()
          .duration(100)
          .style("opacity", myBoolean==true?"1":"0.5");
      });

    var guide_line = this.main_g.append("g")
      .append("line")
      .attr("id", "guide_line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", this.border.height)
      .attr("fill", "black")
      .attr("stroke","gray")
      .attr("stroke-width","2px")
      .attr("opacity", 1)
      
    var focus = this.main_g.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
        .attr("r", 4.5);

    focus.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

    this.main_g.append("rect")
        .attr("class", "overlay")
        .attr("width", this.border.width)
        .attr("height", this.border.height)
        .on("mouseover", function() { focus.style("display", "none"); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", scalePointPosition);

    function scalePointPosition() {
      if (myBoolean == true) {
        d3.selectAll("#guide_line")
          .attr("opacity", 1)
        var xPos = d3.mouse(this)[0];
        var domain = x_scale.domain(); 
        var range = x_scale.range();
        var rangePoints = d3.range(range[0], range[1], x_scale.step())
        var yPos = domain[d3.bisect(rangePoints, xPos) -1];
        guide_line.transition().duration(10).attr("x1", d3.mouse(this)[0]).attr("x2", d3.mouse(this)[0])
        d3.selectAll(".tooltips").style('opacity', 0)
        d3.selectAll("#tooltip-" + yPos).style('opacity', 1);	    
      } else {
        d3.selectAll("#guide_line")
          .attr("opacity", 0);
      }
    }

  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event?){
    var c_width = window.innerWidth;
    var c_height=600;
    this.canvas = this.root_div.select("svg")
      .attr("width",c_width)

    // set border
    // var margin = {top:50, right:20,bottom:20, left:60};
    var margin = this.margin;
    this.border = {
      width    : (c_width - margin.left - margin.right)*0.75,
      height   : (c_height - margin.top - margin.bottom)*0.9,
      m_s_padding : (c_width - margin.left - margin.right)*0.05,
      s_width  : (c_width - margin.left - margin.right)*0.2,
      s_height : c_height - margin.top - margin.bottom
    };

    this.main_g 
      .attr("transform", "translate("+this.margin.left+", "+this.margin.top+")");
    this.side_g
      .attr("transform", "translate("+(this.margin.left + this.border.width + this.border.m_s_padding)+", "+this.margin.top+")");

    let dataset=this.raw_dataset.filter(d=>d.category==this.category);
    let max_count = this.getMaxCount(dataset);

    var x_scale= d3.scalePoint<string>()
      .domain(this.hours)
      .rangeRound([0,this.border.width])
      .padding(0.1);
    var y_scale= d3.scaleLinear()
      .domain([0,max_count])
      .rangeRound([this.border.height,0]);
    var legend_y_scale = d3.scalePoint()
      .domain(dataset.map(d=>d.name))
      .rangeRound([30,this.border.height-30])

    //y-axes title
    this.canvas.select(".y-label")
      // .attr('class',"y-label")
      // .attr("transform","rotate(-90)" )
      .attr("y",0+(this.margin.left/3))
      .attr("x",0-(this.border.height/2))
      // .attr("text-anchor","middle")
      // .style("fill","black")
      // .text("HDI");

    //x-axes title
    this.canvas.select(".x-label")
      // .attr('class',"x-label")
      .attr("y",this.margin.top + this.border.height*1.1)
      .attr("x",this.margin.left + (this.border.width/2))
      // .attr("text-anchor","middle")
      // .style("fill","black")
      // .text("Time");

      this.main_g.select(".axis--x")
          .attr("transform", "translate(0,"+this.border.height+")")
          .call(d3.axisBottom(x_scale));

      this.main_g.select(".axis--y")
          .call(d3.axisLeft(y_scale).ticks(10));

      this.line_generator = d3.line()
        .x(d=>x_scale(d["hour"]))
        .y(d=>y_scale(d["count"]));

      var lines=this.main_g.selectAll(".freeway-path")
      lines.select("path")
        .attr("d",data=>this.line_generator(data["counts"]))
      lines.selectAll("circle")
        .attr('cx',(d)=>x_scale(d["hour"]))
        .attr('cy',(d)=>y_scale(d["count"]))
        .attr('r',"2px");
                          
      var legends=this.side_g.selectAll(".freeway-legend")
        .attr("transform",d=>"translate(0,"+legend_y_scale(d["name"])+")")
      
      d3.select("#guide_line_button").transition()
        .style("opacity", "1");
      d3.select("#guide_line").remove();
      d3.selectAll(".tooltips").remove();

      var myBoolean=new Boolean(true);
      // tooltips
      lines.selectAll('.tooltips')
        .data(d=>d["counts"])
        .enter()
        .append('text')
        .attr('x',(d)=>x_scale(d["hour"]))
        .attr('y',(d)=>y_scale(d["count"]))
        .attr('class', "tooltips")
        .attr('id', (d)=>("tooltip-"+ d["hour"]))
        .text(d=>(d["count"]))
        .attr("font-size","12px")
        .style("fill", "black")
        .style("stroke-width", "0.5px")
        .style('opacity', 0);
      
      // guide line
      d3.select("#guide_line_button")
        .on("click", function(d){
          if (myBoolean == true){
            d3.selectAll("#guide_line").attr("opacity", 0);
            myBoolean = false;
          } else {
            myBoolean = true;
          }
          d3.selectAll(".tooltips").style('opacity', 0);
          d3.select("#guide_line_button").transition()
            .duration(100)
            .style("opacity", myBoolean==true?"1":"0.5");
        });

      var guide_line = this.main_g.append("g")
        .append("line")
        .attr("id", "guide_line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", this.border.height)
        .attr("fill", "black")
        .attr("stroke","gray")
        .attr("stroke-width","2px")
        .attr("opacity", 1)
        
      var focus = this.main_g.append("g")
        .attr("class", "focus")
        .style("display", "none");

      focus.append("circle")
          .attr("r", 4.5);

      focus.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");

      this.main_g.append("rect")
          .attr("class", "overlay")
          .attr("width", this.border.width)
          .attr("height", this.border.height)
          .on("mouseover", function() { focus.style("display", "none"); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", scalePointPosition);

      function scalePointPosition() {
        if (myBoolean == true) {
          d3.selectAll("#guide_line")
            .attr("opacity", 1)
          var xPos = d3.mouse(this)[0];
          var domain = x_scale.domain(); 
          var range = x_scale.range();
          var rangePoints = d3.range(range[0], range[1], x_scale.step())
          var yPos = domain[d3.bisect(rangePoints, xPos) -1];
          guide_line.transition().duration(10).attr("x1", d3.mouse(this)[0]).attr("x2", d3.mouse(this)[0])
          d3.selectAll(".tooltips").style('opacity', 0)
          d3.selectAll("#tooltip-" + yPos).style('opacity', 1);	    
        } else {
          d3.selectAll("#guide_line")
            .attr("opacity", 0);
        }
      }
    

  }

  getMaxCount(dataset) : number {
    let max_count = dataset.reduce(
      (mcount,line)=>{
        let peak = line["counts"].reduce(
          (m,d)=>Math.max(m,d["count"]),0);
        return Math.max(mcount,peak);
      },0);

    return max_count;
  }

}
