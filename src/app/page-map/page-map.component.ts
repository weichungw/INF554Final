import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3_tile from 'd3-tile';

@Component({
  selector: 'app-page-map',
  templateUrl: './page-map.component.html',
  styleUrls: ['./page-map.component.css']
})
export class PageMapComponent implements OnInit {
  projection;
  width;
  height;
  canvas;

  constructor() { }

  ngOnInit() {

    var div = d3.select("#la-div");
    var c_width=1200;
    var c_height=700;
    var svg = div.append("svg")
      .attr("width",c_width)
      .attr("height",c_height);
    var margin = {top:50, right:20,bottom:20, left:20};
    this.width = c_width - margin.left - margin.right;
    this.height = c_height -margin.top -margin.bottom;
    var legendHeight =2*this.height/3;
    var legendWidth =20;

    this.canvas= svg.append('g')
      .attr("transform","translate("+margin.left+", "+margin.top+")");

    svg.append("text")
      .attr("transform","translate("+(margin.left+this.width/2)+",0)")
      .attr("alignment-baseline","hanging")
      .attr("font-size","2em")
      .text("Danger Zoon");
      

    //this.projection = d3.geoAlbersUsa()
    this.projection = d3.geoMercator()


    var rMap_name= "./src/assets/zip_code.geojson";
    var shoot_name= "./src/assets/dangerIntersection.geojson";
    this.draw(rMap_name, shoot_name)

  }

  async draw(rMap_name:string, shoot_name:string){
    var pi = Math.PI;
    var tau = 2*pi;

    var map_data= (await d3.json(rMap_name))
    //console.log(data)
    var map_features=map_data["features"]

    this.projection.fitSize([this.width,this.height],map_data)
    var path =d3.geoPath(this.projection)
      .pointRadius(3);

    var tile = d3_tile.tile();
    var tiles =tile.size([this.width,this.height])
      .scale(this.projection.scale()*tau)
      .translate(this.projection([0,0]))();
    //.translate([0.0,0.0])();

    this.canvas.selectAll("image")
      .data(tiles)
    .enter().append("image")
      .attr("xlink:href", function(d) {console.log(d); return "http://" + "abc"[d.y % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png"; })
      .attr("x", function(d) { return (d.x + tiles.translate[0]) * tiles.scale; })
      .attr("y", function(d) { return (d.y + tiles.translate[1]) * tiles.scale; })
      .attr("width", tiles.scale)
      .attr("height", tiles.scale);
    
    var countries=this.canvas.selectAll(".zip-path")
      .data(map_features)
      .enter().append("path")
      .attr("d", d=>path(d))
      .classed("zip-path",true)
      .style("fill","#E5E8E8")
      .style("stroke","#5D6D7E")
      .attr("pointer-events","none");

    
    var shoot_data =(await d3.json(shoot_name))
    var shoot_features=shoot_data["features"]

    var tooltip = d3.select("body").append("div")
      .attr("class","tooltip-3")
      .style("opacity","0")
      .style("position","absolute")
      .style("text-align","center")
      .style("padding","2px")
      .style("border-radius","8px")
      .style("background","lightsteelblue");

    this.canvas.selectAll(".shoot")
      .data(shoot_features)
      .enter().append("circle")
      .classed("shoot",true)
      .attr("cx",d=>{return this.projection(d.geometry.coordinates)[0];})
      .attr("cy",d=>{return this.projection(d.geometry.coordinates)[1];})
      .attr("r",d=>d.properties.count/10)
      .style("fill","red")
      .attr("opacity","0.5")
    //.on("mouseover",function(d){
    //    tooltip.transition()
    //      .duration(200)
    //      .style("opacity",0.8);
    //        tooltip.html("ID: "+d["properties"]["id"]+
    //          "<br/>Time: "+d["properties"]["date"]+
    //          "<br/>Person age: "+ d["properties"]["age"])
    //      .style("left",(d3.event.pageX +10)+ "px")
    //      .style("top",(d3.event.pageY - 28) + "px");

    //}).on("mouseleave",function(d){
    //    tooltip.transition()
    //      .duration(200)
    //      .style("opacity",0);

    //})



  }

}
