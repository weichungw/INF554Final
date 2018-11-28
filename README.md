# INF554-Datum Final Project

## PROJECT SUMMARY
Traffic Safety is always a highly concerned Topic in Los Angeles.


## PROJECT INFORMATION
- Project title: Los Angeles Accident Analysis and Highway Safety
- Group name: Datum
- Team names: Wei-Chung Wang (weichunw)

### PROJECT ARTIFACTS
- Demonstration [http://www-scf.usc.edu/~weichunw/final/]
- Presentation []
- transcript [https://github.com/INF554Fall18/project-datum/blob/master/transcript.md]
- Report []
- Overleaf []
- Youtube []

## Data Source
1. Thanks to help of USC Information Laboratory(InfoLab), We have access to dataset of California Highway Patrol's daily report.
2. The dataset is hostby (InfoLab)[https://infolab.usc.edu/] as postgres within USC
3. The dataset include informations of daily danger situations happened on LA Freeway.
4. Each row includes datetime, lat/lng location, street name, and injured level.

## SetUp
### Build Angular and Library
1. Install angular2 CLI tool
2. exec "ng new final" to generate new angular project

### Install Librarys
1. exe 'npm install jquery --save'
2. exe 'npm install popper.js --save'
3. exe 'npm install d3 @type/d3 --save'
4. exe 'npm install bootstrap --save'
5. exe 'npm install d3-tile --save'

## System Structure 

### Structure
1. The main includes two parts, navgation bar and router outlet.
2. Navgation bar includes our log, links to each component, Team info and link to our github.
3. Clicking links in the navagation bar will rerender the router outlet and shows corresponding page.
4. links to each page are defined in app-routing.ts file.
5. we use bootstrap to organize the web page.
6. we use (angular material)[https://material.angular.io/] theme and predefined elements and compose our web page.

### Clustered Map


### Daily Risk Line Chart


### Danger Ratio Pie Chart

### Team Information

## Deployment
1. we build the whole project with command "ng build --prod"
2. We uplaod compiled project to usc scf service.

### Record
* how we handle large data
* angular router
* how do d3 map work with tiles


<a name="ref"></a>
## Reference
* Angularjs[https://angularjs.org/]
* Angular material [https://material.angular.io/]
* Bootstrap [https://getbootstrap.com/]
* NG bootstrap [https://github.com/ng-bootstrap/ng-bootstrap]
*
* CHP code[https://lostcoastoutpost.com/chpwatch/codes/]
* Icons []



