import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

API_KEY = "quzYLHBpJAWrXTLeqUjosmQnwlexkJ2N"
API_KEY_geo = "AIzaSyB4HMWd-aafN2qWg1fm9PK9AlFGtmPHsiQ"

@app.route('/')
def index():
    return app.send_static_file('sdnakai.html')
    

@app.route('/submit', methods=['GET'])
def submit():
    autodetect = request.args.get('autoDetect') == 'true'
    if autodetect:
        location = request.args.get('location')
        lat, lng = map(float, location.split(','))
        city = request.args.get('city')
        state = request.args.get('state')
        locationHeader = f"{city}, {state}"
    else:
        street = request.args.get('street')
        city = request.args.get('city')
        state = request.args.get('state')
        locationHeader = f"{street}, {city}, {state}"
        
        url_geo = f"https://maps.googleapis.com/maps/api/geocode/json?address={locationHeader}&key={API_KEY_geo}"
        response_geo = requests.get(url_geo)

        geo_data = response_geo.json()
        if geo_data['status'] == 'ZERO_RESULTS' or len(geo_data.get('results', [])) == 0:
            return jsonify({'error': 'Invalid location'}), 400

        locationHeader = geo_data['results'][0]['formatted_address']
        lat = geo_data['results'][0]['geometry']['location']['lat']
        lng = geo_data['results'][0]['geometry']['location']['lng']

    try:
        print(locationHeader)
        print(lat,lng)
        url = f"https://api.tomorrow.io/v4/timelines?location={lat},{lng}&fields=temperature,humidity,windSpeed,pressureSeaLevel,visibility,cloudCover,uvIndex,weatherCode&units=imperial&timesteps=current&timezone=America/Los_Angeles&apikey={API_KEY}"
        seven_url = f"https://api.tomorrow.io/v4/timelines?location={lat},{lng}&fields=temperature,humidity,windSpeed,pressureSeaLevel,visibility,cloudCover,uvIndex,weatherCode,temperatureMax,temperatureMin,precipitationProbability,precipitationType,sunriseTime,sunsetTime&units=imperial&timesteps=1d&timezone=America/Los_Angeles&apikey={API_KEY}"
        hourly_url = f"https://api.tomorrow.io/v4/timelines?location={lat},{lng}&fields=windDirection,temperature,humidity,windSpeed,pressureSeaLevel,temperatureMax,temperatureMin&units=imperial&timesteps=1h&timezone=America/Los_Angeles&apikey={API_KEY}"
        
        response = requests.get(url)
        seven_response = requests.get(seven_url)
        hourly_response = requests.get(hourly_url)

        weatherCurrent = response.json()
        valuesCurrent = weatherCurrent['data']['timelines'][0]['intervals'][0]['values']

        weatherSeven = seven_response.json()
        valuesSeven = weatherSeven['data']['timelines'][0]['intervals']

        weatherHourly = hourly_response.json()
        valuesHourly = weatherHourly['data']['timelines'][0]['intervals']

        data = {
            "valuesCurrent": valuesCurrent,
            "locationHeader": locationHeader,
            "valuesSeven": valuesSeven,
            "valuesHourly": valuesHourly
        }
        return jsonify(data)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch weather data"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
