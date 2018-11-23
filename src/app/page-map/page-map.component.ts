import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as d3 from 'd3';
import * as d3_tile from 'd3-tile';

import { GeoJsonService } from '../geo-json.service';

@Component({
  selector: 'app-page-map',
  templateUrl: './page-map.component.html',
  styleUrls: ['./page-map.component.css']
})
export class PageMapComponent implements OnInit {
  projection;
  root_div;
  width;
  height;
  canvas;
  tooltip;

  constructor(private geojsonService : GeoJsonService) { }

  ngOnInit() {
    this.renderMap();
  }

  renderMap(){
    this.root_div = d3.select("#map-div");
    var c_width=this.root_div.node().getBoundingClientRect().width;
    var c_height=900;
    var svg = this.root_div.append("svg")
      .attr("width",c_width)
      .attr("height",c_height);
    var margin = {top:50, right:20,bottom:20, left:20};
    this.width = c_width - margin.left - margin.right;
    this.height = c_height -margin.top -margin.bottom;

    this.canvas= svg.append('g')
      .attr("transform","translate("+margin.left+", "+margin.top+")");

    // projection config
    var map_scale = 59672.941;
    var map_center=[-118.120931,34.018205];
    this.projection = d3.geoMercator()
    this.projection.scale(map_scale)
      .center(map_center);
    //var geopath =d3.geoPath(this.projection)
    //  .pointRadius(3);

    this.tooltip = this.root_div.append("div")
      .attr("id","tooltip-map")
      .style("opacity","0")
      .style("position","absolute")
      .style("text-align","center")
      .style("padding","2px")
      .style("border-radius","8px")
      .style("background","lightsteelblue");

    //var geofile_name= "./src/assets/dangerIntersection.geojson";
    this.draw()
  }

  draw(){
    var tau = 2*Math.PI;

    // Render Tiles
    var tile = d3_tile.tile();
    var tiles =tile.size([this.width,this.height])
      .scale(this.projection.scale()*tau)
      .translate(this.projection([0,0]))();

    this.canvas.selectAll("image")
      .data(tiles)
    .enter().append("image")
      .attr("xlink:href", d=> this.getStamenMap(d.x, d.y, d.z) )
      .attr("x", function(d) { return (d.x + tiles.translate[0]) * tiles.scale; })
      .attr("y", function(d) { return (d.y + tiles.translate[1]) * tiles.scale; })
      .attr("width", tiles.scale)
      .attr("height", tiles.scale);
    
    //var geodata =(await d3.json(geofile_name));
    let tooltip = this.tooltip;
    let canvas= this.canvas;
    let projection = this.projection;

    this.geojsonService.getGeoData().subscribe({
      next(geodata){
        var geo_feats=geodata["features"];

        canvas.selectAll(".hazzard")
          .data(geo_feats)
          .enter().append("circle")
          .classed("hazzard",true)
          .attr("cx",d=>{return projection(d.geometry.coordinates)[0];})
          .attr("cy",d=>{return projection(d.geometry.coordinates)[1];})
          .attr("r",d=>d.properties.count/10)
          .style("fill","red")
          .attr("opacity","0.5")
        .on("mouseover",function(d){
            tooltip.transition()
              .duration(200)
              .style("opacity",0.8);
                tooltip.html("Location: "+d["properties"]["name"]+
                  "<br/>Count: "+d["properties"]["count"])
              .style("left",(d3.event.pageX +10)+ "px")
              .style("top",(d3.event.pageY - 28) + "px");

        }).on("mouseleave",function(d){
            tooltip.transition()
              .duration(200)
              .style("opacity",0);
        })
      }
    });
  }

  getStamenMap( x:number, y:number, z:number, style:string="terrain"): string{
    // possible styles 1.Toner, 2.Terrain 3.watercolor
    var url:string ="http://" + "abc"[y % 3] + ".tile.stamen.com/"+style+"/" + z + "/" + x + "/" + y + ".png"; 
    return url;
  }

  getOpenMap( x:number, y:number, z:number): string{
    var url:string ="http://" + "abc"[y % 3] + ".tile.openstreetmap.org/" + z + "/" + x + "/" + y + ".png"; 
    return url;
  }

}
