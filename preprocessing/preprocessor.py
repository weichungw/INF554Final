import csv
import json
from datetime import datetime

from geojson import Point, Feature, FeatureCollection, dump

class Preprocessor:

    def __init__(self):
        self.collision_types=set()
        self.dataset=[]

        self.initCollisionTypes()
    def readfile(self, rfile_name,filterType=[]):
        dataset =[]
        with open(rfile_name, 'r') as rfile:
            csv_reader = csv.DictReader(rfile,delimiter=',')
            for row in csv_reader:
                if (len(filterType)>0 and
                        row["type"] not in filterType):
                    continue
                    
                lat = float(row["latitude"])
                lng = float(row["longitude"])
                time = datetime.strptime(
                        row["datetime"],
                            '%Y-%m-%d %H:%M:%S')
                desc = row["type"]
                street = row["street"]
                city = row["city"]
                dow = int(row["day_of_week"])
                dataset.append(
                            {'lat':lat,
                            'lng': lng,
                            'time':time,
                            'type':desc,
                            'street':street,
                            'city':city,
                            'dow':dow})


        self.dataset=dataset
        return dataset
    
    def initCollisionTypes(self):
        self.collision_types.add('1180-Trfc Collision-Major Inj')
        self.collision_types.add('1181-Trfc Collision-Minor Inj')
        self.collision_types.add('1182-Trfc Collision-No Inj')
        self.collision_types.add('1183-Trfc Collision-Unkn Inj')
        self.collision_types.add('1179-Trfc Collision-1141 Enrt')
        self.collision_types.add('20001-Hit and Run w/injuries')
        self.collision_types.add('20002-Hit and Run No injuries')
        self.collision_types.add('1144-Fatality')
    

    def countByStreet(self, dataset):
        intersection = {}
        for row in dataset:
            street = row["street"]
            if street not in intersection:
                intersection[street]={"count":0, "lat":0.0,'lng':0.0}
            intersection[street]["count"]+=1
            intersection[street]["lat"]+=row["lat"]
            intersection[street]["lng"]+=row["lng"]
            
        return [{"name":k, "count":v["count"],
            "lat":(v["lat"]/v["count"]),'lng':(v["lng"]/v["count"])} 
                for k,v in intersection.items()]
    
    def exportGeojson(self, wfile_name, data):
        stack=[]
        for row in data:
            if row["count"]<10: continue
            point = Point((row['lng'],row['lat']))
            properties ={'name':row["name"],
                    'count':row["count"]}
            stack.append(Feature(geometry=point,
                properties=properties))
    
        print(len(stack))
        stack = FeatureCollection(stack)
    
        with open(wfile_name+"2",'w') as wfile:
            dump(stack,wfile)

    def getDayPattern(self):
        highways =[] 
        with open("highways.json",'r') as rfile:
            highways = json.load(rfile)
        highways ={k:[0 for i in range(24)] for k in highways}
        for row in self.dataset:
            street=row['street'].upper()
            for highway in highways:
                if street.find(highway)>=0:
                    highways[highway][row['time'].hour]+=1
        # transform to d3 format (array)
        highways = [{"name":name[:-1], "counts":[ {"hour": ('%02d'%i), 'count':c} 
            for i, c in enumerate(counts) ]} for name, counts in highways.items() ]
        return highways


    def getCollisionTypes(self):
        return self.collision_types

    



if __name__ == "__main__":
    rfile_name = "chp2017_edit.csv"
    prep = Preprocessor()
    collision_type = prep.getCollisionTypes()
    dataset = prep.readfile(rfile_name)

    # ---Get Freeway Names
    wfile_name = "dayPattern.json"
    dayPattern= prep.getDayPattern()
    with open(wfile_name, 'w') as wfile:
        json.dump(dayPattern,wfile)



    # ---Get Geo-Counts---
    #wfile_name = 'dangerIntersection.geojson'
    #count_by_street=prep.countByStreet(dataset)
    #count_by_street.sort(key=lambda x: -1*x["count"])
    #prep.exportGeojson(wfile_name,count_by_street)
    


