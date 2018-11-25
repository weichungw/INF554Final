import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

export interface LeafNode {data:DangerBubble ,x:number, y:number}
export interface DangerBubble{count:number, name: String, ratio:number}
@Component({
  selector: 'app-danger-ratio',
  templateUrl: './danger-ratio.component.html',
  styleUrls: ['./danger-ratio.component.css']
})
export class DangerRatioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.initHierarchy();
  }

  initHierarchy(){
    var div = d3.select("#danger-ratio-div");
    var c_width:number = 800;
    var c_height:number = 800;
    var canvas = div.append("svg")
      .attr('width',c_width)
      .attr('height',c_height);

    var margin= {top:20, right:20, bottom:20, left:20};
    var width: number= c_width - margin.left - margin.right;
    var height: number= c_height -margin.top - margin.bottom;

    var  g= canvas.append("g")
    
    // init required component
    var pack =d3.pack()
      .size([width,height])
      .padding(2);
    var color = d3.scaleSequential(d3.interpolateGnBu)
      .domain([-1, 5]);

    var tooltip = d3.select("body").append("div")
      .attr('class',"tooltip-danger")
      .attr("padding","2em")
      .style("background","lightsteelblue")
      .style("font","1em sans-serif")
      .attr("position","absolute")
      .style("text-align","center");

    d3.json("./mock-data/dangerRatio.json").then(function(data){
      var root = d3.hierarchy(data)
        .sum(function(d){ return Math.sqrt(d['count']);})
        .sort(function(a,b){ return b.value-a.value;});
      var nodes = pack(root).descendants();

      var circles =g.selectAll(".bubble")
        .data(nodes)
        .enter().append("circle")
        .attr("class",node=>node.children?"bubble":"leaf")
        .attr("cx",node=>node.x)
        .attr("cy",node=>node.y)
        .attr("r",node=>node.r)
        .style("fill",function(d){return d.children? color(d.depth):"white";});

      var leaves = g.selectAll(".leaf, .bubble")
      .on("mouseenter", function(node:LeafNode){
          console.log(node)
          tooltip.html("name:"+node.data["name"]+"<br/>"
                  +"Ratio:"+node.data["ratio"])
            .style("left",(d3.event.pageX +10)+ "px")
            .style("top",(d3.event.pageY - 28) + "px");

          tooltip.transition()
            .duration(200)
            .style("opacity",0.9);

        }).on("mouseleave",function(node){
          tooltip.transition()
            .duration(500)
            .style("opacity",0);
        });
      var b_label = g.selectAll(".bubble-label")
        .data(nodes)
        .enter().append("text")
        .attr("class","bubble-label")
        .attr("text-anchor","middle")
        .attr("alignment-baseline","middle")
        .attr("transform", node=>{
          console.log(node)
          if(node.children){
            return "translate("+node.x+", "+(node.y-node.r*0.8)+")"
          }else{
            return "translate("+node.x+", "+(node.y)+")"
          }
        })
        .attr("pointer-events","none")
      //  .style("fill-opacity",node=>node.children?0:1)
      //.style("fill",node=>c2c.getColor(node.data['name']))
        .style("font-size","0.8em")
        .text(node=>node.data['name']);

    });

  }

}
