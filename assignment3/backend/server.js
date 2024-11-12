const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = 'quzYLHBpJAWrXTLeqUjosmQnwlexkJ2N';
const API_KEY_geo = 'AIzaSyB4HMWd-aafN2qWg1fm9PK9AlFGtmPHsiQ';


app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ziqunw44:wangz44@cluster.lsx0e.mongodb.net/HW#?retryWrites=true&w=majority&appName=Cluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection;

async function connectToMongoDB() {
  try {
      await client.connect();
      database = client.db("HW3");
      collection = database.collection("favorites");
      console.log("Successfully connected to MongoDB");
  } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
  }
}




app.get('/api/submit', async (req, res) => {
    let locationHeader, lat, lng;
    // console.log(req.query);
    const { street, city, state,currentLocation} = req.query;
    try{
        if(currentLocation)
        {
            console.log("ssss");
        }else
        {
            locationHeader = `${street}, ${city}, ${state}`;
            const url_geo = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationHeader}&key=${API_KEY_geo}`;
            const response_geo = await axios.get(url_geo);
            const geo_data = response_geo.data;
            if (geo_data['status'] == 'ZERO_RESULTS' || geo_data.results.length == 0)
            {
                return res.status(400).json({ error: 'Invalid location' });
            }
            locationHeader = geo_data.results[0].formatted_address;
            lat = geo_data.results[0].geometry.location.lat;
            lng = geo_data.results[0].geometry.location.lng;
            console.log(lat,lng);
        }

        const seven_url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lng}&fields=temperature,humidity,windSpeed,pressureSeaLevel,visibility,cloudCover,uvIndex,weatherCode,temperatureMax,temperatureMin,precipitationProbability,precipitationType,sunriseTime,sunsetTime&units=imperial&timesteps=1d&timezone=America/Los_Angeles&apikey=${API_KEY}`;
        const seven_response = await axios.get(seven_url);
        weatherSeven = seven_response.data;
        const valuesSeven = weatherSeven['data']['timelines'][0]['intervals'];
        console.log(valuesSeven);
        const timeseries = valuesSeven.map((item) => ({
          time: new Date(item.startTime).toISOString(),
          data: {
              instant: {
                  details: {
                      air_temperature: item.values.temperature,
                      wind_speed: item.values.windSpeed,
                      air_pressure_at_sea_level: item.values.pressureSeaLevel,
                      humidity: item.values.humidity
                  }
              },
              next_1_hours: {
                  summary: {
                      symbol_code: item.values.weatherCode === 1000 ? 'clearsky' : 'cloudy'
                  },
                  details: {
                      precipitation_amount: item.values.precipitationProbability > 0 ? 0.1 : 0
                  }
              }
          }
      }));
      const mockData = {
        type: "FeatureCollection",
        properties: {
            meta: {
                updated_at: new Date().toISOString(),
                units: {
                    air_temperature: "°C",
                    precipitation_amount: "mm",
                    wind_speed: "m/s",
                    air_pressure_at_sea_level: "hPa"
                }
            },
            timeseries
        }
    };
    const locationDetails = {
      city,
      state,
      lat,
      lng,
      locationHeader
    };
    res.json({"valuesSeven": valuesSeven,"mockData":mockData,"locationDetails":locationDetails});
    }catch(error)
    {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

app.get('/api/mock', async (req, res) => {
  const mockValuesSeven = [
      {
          startTime: '2024-11-06T06:00:00-08:00',
          values: {
              cloudCover: 100,
              humidity: 87,
              precipitationProbability: 0,
              precipitationType: 0,
              pressureSeaLevel: 30.06,
              sunriseTime: '2024-11-06T14:14:00Z',
              sunsetTime: '2024-11-07T00:59:00Z',
              temperature: 77.68,
              temperatureMax: 77.68,
              temperatureMin: 50,
              uvIndex: 3,
              visibility: 9.94,
              weatherCode: 1000,
              windSpeed: 6.43
          }
      },
      {
          startTime: '2024-11-07T06:00:00-08:00',
          values: {
              cloudCover: 0.18,
              humidity: 68.97,
              precipitationProbability: 0,
              precipitationType: 0,
              pressureSeaLevel: 30.15,
              sunriseTime: '2024-11-07T14:15:00Z',
              sunsetTime: '2024-11-08T00:58:00Z',
              temperature: 69.22,
              temperatureMax: 69.22,
              temperatureMin: 49.32,
              uvIndex: 4,
              visibility: 9.94,
              weatherCode: 1000,
              windSpeed: 8.54
          }
      }
  ];

  // 构建 timeseries 数据
  const timeseries = mockValuesSeven.map((item) => ({
      time: new Date(item.startTime).toISOString(),
      data: {
          instant: {
              details: {
                  air_temperature: item.values.temperature,
                  wind_speed: item.values.windSpeed,
                  air_pressure_at_sea_level: item.values.pressureSeaLevel,
                  humidity: item.values.humidity
              }
          },
          next_1_hours: {
              summary: {
                  symbol_code: item.values.weatherCode === 1000 ? 'clearsky' : 'cloudy'
              },
              details: {
                  precipitation_amount: item.values.precipitationProbability > 0 ? 0.1 : 0
              }
          }
      }
  }));

  // 构建 mockData 格式
  const mockDataFormatted = {
      type: "FeatureCollection",
      properties: {
          meta: {
              updated_at: new Date().toISOString(),
              units: {
                  air_temperature: "°C",
                  precipitation_amount: "mm",
                  wind_speed: "m/s",
                  air_pressure_at_sea_level: "hPa"
              }
          },
          timeseries
      }
  };

  // 模拟 locationDetails 数据
  const locationDetails = {
      city: 'Mock City',
      state: 'Mock State',
      lat: 34.0522,
      lng: -118.2437,
      locationHeader: 'Mock Location, Mock City, Mock State'
  };

  // 返回与 /api/submit 一致的响应结构
  res.json({
      valuesSeven: mockValuesSeven,
      mockData: mockDataFormatted,
      locationDetails: locationDetails
  });
});


app.get('/api/isFavorite', async (req,res) =>
{
  const {city,state} =req.query;
  try
  {
    const favorite = await collection.findOne({"city":city,"state":state});
    res.json({ isFavorite: !!favorite });
  }catch(error)
  {
    console.log("error");
  }

});
app.post('/api/addFavorite', async (req,res) =>
{
  const {city,state} =req.body;
  try
  {
    await collection.insertOne({"city":city,"state":state});
  }catch(error)
  {
    console.log("error");
  }

});

app.post('/api/deleteFavorite', async (req,res) =>
{
  const {city,state} =req.body;
  try
  {
    await collection.deleteMany({"city":city,"state":state});
  }catch(error)
  {
    console.log("error");
  }
});

app.get('/api/getFavorite',async (req,res)=>{
  const favorites = await collection.find({}, { projection: { _id: 0, city: 1, state: 1 } }).toArray();
  try
  {
    res.json({favorites:favorites});
  }catch(error)
  {
    console.log(error);
  }
})


app.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server is running on http://localhost:${PORT}`);
  
});
