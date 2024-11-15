const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

const API_KEY = 'quzYLHBpJAWrXTLeqUjosmQnwlexkJ2N';
const API_KEY_geo = 'AIzaSyB4HMWd-aafN2qWg1fm9PK9AlFGtmPHsiQ';


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist/assignment3/browser')));


const { MongoClient, ServerApiVersion } = require('mongodb');
const url = "mongodb+srv://ziqunw44:wangz44@cluster.lsx0e.mongodb.net/HW3?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true&ssl=true";
const client = new MongoClient(url, {
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
    const { street, city, state,currentLocation,location} = req.query;
    try{
        if(currentLocation)
        {
          [lat, lng] = location.split(',').map(Number);
          locationHeader = `;${city}, ${state}`;         
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
        }

        const seven_url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lng}&fields=temperature,humidity,windSpeed,pressureSeaLevel,visibility,cloudCover,uvIndex,weatherCode,temperatureMax,temperatureMin,precipitationProbability,precipitationType,sunriseTime,sunsetTime&units=imperial&timesteps=1d&timezone=America/Los_Angeles&apikey=${API_KEY}`;
        const hourly_url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lng}&fields=windDirection,temperature,humidity,windSpeed,pressureSeaLevel,temperatureMax,temperatureMin&units=imperial&timesteps=1h&timezone=America/Los_Angeles&apikey=${API_KEY}`
        const seven_response = await axios.get(seven_url);
        const hourly_url_response = await axios.get(hourly_url);
        weatherSeven = seven_response.data;
        const valuesSeven = weatherSeven['data']['timelines'][0]['intervals'];
        weatherHourly = hourly_url_response.data
        const valuesHourly = weatherHourly['data']['timelines'][0]['intervals']
        const timeseries = valuesHourly.map((item) => ({
          time: new Date(item.startTime).toISOString(),
          data: {
              instant: {
                  details: {
                      air_temperature: item.values.temperature,
                      wind_speed: item.values.windSpeed,
                      air_pressure_at_sea_level: item.values.pressureSeaLevel,
                      humidity: item.values.humidity,
                      wind_from_direction: item.values.windDirection
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/assignment3/browser', 'index.html'));
});

app.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server is running on http://localhost:${PORT}`);
  
});
