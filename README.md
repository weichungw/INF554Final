# INF 554 Assignment 5

## Table of Contents
1. [Slide 1](#slide1)
1. [Slide 2](#slide2)
1. [Slide 3](#slide3)
1. [Slide 4](#slide4)
1. [Slide 5](#slide5)
1. [Slide 6](#slide6)
1. [Slide 7](#slide7)
1. [Slide 8](#slide8)
1. [Slide 9](#slide9)
1. [Slide 10](#slide10)
1. [Slide 11](#slide11)
1. [Slide 12](#slide12)
1. [Slide 13](#slide13)
1. [Slide 14](#slide14)
1. [Slide 15](#slide15)
6. [Reference](#ref)

<a name="serverLink"></a>
## Link to Server
* Link to Server[http://www-scf.usc.edu/~weichunw/final/]


<a name="slide1"></a>
## Slide 1
### Introduction
1. Title: Statistics Visualization of Traffic Data in LA 
2. Group: datum 
3. Members: Lu Zhang, Wei-Chung Wang, Ruolei Xia

<a name="slide2"></a>
## Slide 2
### Story
1. A big city like LA works like an giant organism.
2. Have you ever observe LA's daily macro behavior.
3. Traffic volume could inform us the activity level of each part in LA.

<a name="slide3"></a>
## Slide 3
### Value of project
1. We could optimize our personal behavior corresponding to it.
Either benifit to ourself or to the whole society.
    1. During heavy traffic, Google direction could be inaccurate.
    2. All we need is to avoid those red cloud on the map.
2. The authority could drafts plans to tackle heavy traffic.

<a name="slide4"></a>
## Slide 4
### Audience
1. Any individual driver including uber.
    1. Uber driver
    2. Any driver
2. Government or Any expertise trying to make a plan with macro view
    1. traffic plan

<a name="slide5"></a>
## Slide 5
### Data Source
1. Indective-Loop Traffic Detectors
2. LA government
3. contact Prof YaoYi

<a name="slide6"></a>
## Slide 6
### Interactive Visual

1. **Basic Charts**
	1. TimeLine Bar
	2. Time Granularity
2. Heat Map
	1. TimeLine Bar
	2. Time Granularity

Different time and granularity, different chart contents.

<a name="slide7"></a>
## Slide 7
### Interactive Visual
1. Basic Charts
	1. TimeLine Bar
	2. Time Granularity
2. **Heat Map**
	1. TimeLine Bar
	2. Time Granularity

Different time and granularity, different map contents. Users can zoom in, zoom out, shift left and shift right to see detail information.

<a name="slide8"></a>
## Slide 8
### Design Consideration
1. Numerical
	1. Speed
	2. Traffic Flow
	3. Time
	4. Latitude & Longitude
2. Categorical
	1. Road
	2. Direction

Our visualization is high dimensional. Specific dimensions list above.

<a name="slide9"></a>
## Slide 9
### Creative Point
1. Map
	1. Dynamic
	2. Interactive 
2. Charts
	1. Information 
	2. Story 
	3. Stucture

<a name="slide10"></a>
## Slide 10
### Compare to what others have done
1. Most traffic data is private 
2. The way to show data is too simple, table, chart 
3. Some gave the information with the text, just give the description and conclusion 
4. Some chart is not easy to understand 
<a name="slide11"></a>
## Slide 11
### Tool
1. mapbox
2. leaflet
3. AngularJS 
4. Django
5. D3
6. Postgresql

<a name="slide12"></a>
## Slide 12
### Plan to build 
1. write the backend with framework to test 
2. design UI 
3. Basic charts 
4. more complicated charts 
5. combine all charts in frontend 
6. extra statistics and analysis 
<a name="slide13"></a>
## Slide 13
### Plan to evaluate 
1. use the visualisation wheel 
2. test how good for users to interact 
3. UI experience 
4. audience aspect to understand the information of data visualisation 
5. risks: loading data is slow 
6. lag when zoom in/out 


<a name="slide14"></a>
## Slide 14
### Timeline 
1. Previous research 
2. paper prototype, backend, UI Design 
3. Deployed prototype with basic Charts Map 
4. Dynamic Combine Backend  Frontend 
5. Interactive Control,Polish UI ,Paper,Video
6. Final Webpage and report 

<a name="slide15"></a>
## Slide 15
### Team Work
1. Schedule: We have a specific schedule and teammates try to catch up 
2. Available Data: out data is from the Lab, which is more reliable 
3. Contribution of the whole team 
 Wang:  Prepare the data, and know about the data very well
 Lu: Write the JS, UI 
 Ruolei:  Html and JS 

### Library
* d3-tiles
* rxjs
* openstreet map server

### REcord
* how we handle large data
* angular router
* how do d3 map work with tiles


<a name="ref"></a>
## Reference
* Angularjs[https://angularjs.org/]
* flowing data[https://flowingdata.com/]
* CHP code[https://lostcoastoutpost.com/chpwatch/codes/]
* Icons []



