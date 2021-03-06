import sys
import ee
import json
from scipy.signal import savgol_filter

def rmmissing(data):
  timestamps = []
  values = []
  newData = []
  for i in range(len(data)):
    if i==0:
      continue

    if data[i][4] is not None:
      timestamps.append(data[i][3]) 
      values.append(float(data[i][4]))

  filterValues = savgol_filter(values, 35, 1)

  for (item1, item2) in zip(timestamps, filterValues):
    newData.append([item1, item2])

  return newData

def getMeasurements(lon, lat, startDate, endDate):
    collection = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_NO2').select('tropospheric_NO2_column_number_density').filterDate(startDate, endDate)
    geoPoint = ee.Geometry.Point(lon, lat)
    scale = 1000

    meanValue = collection.mean().sample(geoPoint, scale).first().get('tropospheric_NO2_column_number_density').getInfo()

    timeseries = collection.getRegion(geoPoint, scale).getInfo()

    newData= rmmissing(timeseries)

    return newData

## Google Earth Engine Authentication
service_account = 'no2-890@nlp-arca.iam.gserviceaccount.com'
credentials = ee.ServiceAccountCredentials(service_account,'src/ee_api_key.json')
ee.Initialize(credentials)

startDate = '2020-01-01'
endDate = '2021-06-30'
lon = 4.8148
lat = 45.7758

params = json.loads(sys.argv[1])
lat = params['lat']
lng = params['lng']
newData = getMeasurements(lng, lat, startDate, endDate)


#for i in range(len(newData)):
#    print(newData[i])

res = {'timeseries': newData}
print(json.dumps(res))