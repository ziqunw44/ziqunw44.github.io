const token = '4f0fe9c3c919a4';
const API_KEY_geo = "AIzaSyB4HMWd-aafN2qWg1fm9PK9AlFGtmPHsiQ";
const weatherCodes = {
    "0": "Unknown",
    "1000": "Clear",
    "1100": "Mostly Clear",
    "1101": "Partly Cloudy",
    "1102": "Mostly Cloudy",
    "1001": "Cloudy",
    "2000": "Fog",
    "2100": "Light Fog",
    "4000": "Drizzle",
    "4001": "Rain",
    "4200": "Light Rain",
    "4201": "Heavy Rain",
    "5000": "Snow",
    "5001": "Flurries",
    "5100": "Light Snow",
    "5101": "Heavy Snow",
    "6000": "Freezing Drizzle",
    "6001": "Freezing Rain",
    "6200": "Light Freezing Rain",
    "6201": "Heavy Freezing Rain",
    "7000": "Ice Pellets",
    "7101": "Heavy Ice Pellets",
    "7102": "Light Ice Pellets",
    "8000": "Thunderstorm"
};
const weatherImages = {
    "1000": "clear_day.svg",
    "1100": "mostly_clear_day.svg",
    "1101": "partly_cloudy_day.svg",
    "1102": "mostly_cloudy.svg",
    "1001": "cloudy.svg",
    "2000": "fog.svg",
    "2100": "fog_light.svg",
    "4000": "drizzle.svg",
    "4001": "rain.svg",
    "4200": "rain_light.svg",
    "4201": "rain_heavy.svg",
    "5000": "snow.svg",
    "5001": "flurries.svg",
    "5100": "snow_light.svg",
    "5101": "snow_heavy.svg",
    "6000": "freezing_drizzle.svg",
    "6001": "freezing_rain.svg",
    "6200": "freezing_rain_light.svg",
    "6201": "freezing_rain_heavy.svg",
    "7000": "ice_pellets.svg",
    "7101": "ice_pellets_heavy.svg",
    "7102": "ice_pellets_light.svg",
    "8000": "tstorm.svg"
};

const precipitationTypes = 
{
    "1": "Rain",
    "2": "Snow",
    "3": "Freezing Rain",
    "4": "Ice Pellets / Sleet",
    "0": "N/A"
};


document.addEventListener('DOMContentLoaded', function() {
    const autodetect = document.getElementById('autodetect');
    if(autodetect)
    {
        autodetect.addEventListener('change',function(){

            const street = document.getElementById('street');
            const city = document.getElementById('city');
            const state = document.getElementById('state');
        
            if( this.checked)
            {
                document.querySelectorAll('.fillAlert').forEach(el => el.remove());
                street.value = '';
                city.value = '';
                state.value = '';
                street.disabled = true;
                city.disabled = true;
                state.disabled = true;
            }else
            {
                street.disabled = false;
                city.disabled = false;
                state.disabled = false;       
            }
        });
    }
});

function submitForm()
{
    const request = new XMLHttpRequest();
    const isAutodetect = document.getElementById('autodetect').checked;
    
    if (isAutodetect) {
        fetch(`https://ipinfo.io?token=${token}`)
            .then(response => response.json())
            .then(data => {
                const { city, region, country, loc } = data;
                const url = `https://assignment2-60706.wl.r.appspot.com/submit?autoDetect=true&city=${encodeURIComponent(city)}&state=${encodeURIComponent(region)}&country=${encodeURIComponent(country)}&location=${encodeURIComponent(loc)}`;
                request.open('GET', url, true);
                request.send();
            });
    } else {
        const street = document.getElementById('street').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        
        document.querySelectorAll('.fillAlert').forEach(el => el.remove());
        
        if (!street) {
            const streetBox = document.getElementById('street');
            const fillAlert = document.createElement('div');
            fillAlert.className = 'fillAlert';
            fillAlert.textContent = 'fill out this field';
            fillAlert.style.color = 'red';
            fillAlert.style.position = 'absolute';
            fillAlert.style.top = `${streetBox.offsetTop - 29}px`;
            fillAlert.style.left = `${streetBox.offsetLeft + 200}px`;
            streetBox.parentNode.insertBefore(fillAlert, streetBox);
        } else if (!city) {
            const cityBox = document.getElementById('city');
            const fillAlert = document.createElement('div');
            fillAlert.className = 'fillAlert';
            fillAlert.textContent = 'fill out this field';
            fillAlert.style.color = 'red';
            fillAlert.style.position = 'absolute';
            fillAlert.style.top = `${cityBox.offsetTop - 29}px`;
            fillAlert.style.left = `${cityBox.offsetLeft + 80}px`;
            cityBox.parentNode.insertBefore(fillAlert, cityBox);
        } else if (!state) {
            const stateBox = document.getElementById('state');
            const fillAlert = document.createElement('div');
            fillAlert.className = 'fillAlert';
            fillAlert.textContent = 'fill out this field';
            fillAlert.style.color = 'red';
            fillAlert.style.position = 'absolute';
            fillAlert.style.top = `${stateBox.offsetTop - 29}px`;
            fillAlert.style.left = `${stateBox.offsetLeft + 60}px`;
            stateBox.parentNode.insertBefore(fillAlert, stateBox);
        } else {
            const url = `https://assignment2-60706.wl.r.appspot.com/submit?autoDetect=false&city=${encodeURIComponent(city)}&street=${encodeURIComponent(street)}&state=${encodeURIComponent(state)}`;
            request.open('GET', url, true);
            request.send();
        }
    }
    
    request.onreadystatechange = function(){
        if( request.readyState == 4 && request.status == 200){
            const tmp = document.getElementsByClassName('description')[0];
            tmp.innerHTML = '';
            const data = JSON.parse(request.responseText);
            console.log(data);
            showCurrentWeather(data.valuesCurrent,data.locationHeader);

            const valuesSevenTmp = data.valuesSeven;
            const valuesSeven = [];
            console.log(valuesSevenTmp);
            valuesSevenTmp.forEach((day) => 
            {
                const date = new Date(day.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
                const weatherCode = day.values.weatherCode;
                const tempHigh = day.values.temperatureMax; 
                const tempLow = day.values.temperatureMin;
                const precipitation = day.values.precipitationType;
                const precipitationProbability = day.values.precipitationProbability;
                const windSpeed = day.values.windSpeed;  
                const humidity= day.values.humidity;
                const visibility = day.values.visibility;
                const sunrise = day.values.sunriseTime;
                const sunset = day.values.sunsetTime;
                const originalDate = day.startTime.split('T')[0];

                const sevenOne = {
                    date: date,
                    weatherCode: weatherCode,
                    tempLow: tempLow,
                    tempHigh: tempHigh,
                    windSpeed: windSpeed,
                    precipitation: precipitation,
                    precipitationProbability: precipitationProbability,
                    humidity: humidity,
                    visibility: visibility,
                    sunrise: sunrise,
                    sunset: sunset,
                    originalDate: originalDate
                };  
                valuesSeven.push(sevenOne);
            });

            const valuesHourlyTmp = data.valuesHourly;
            const valuesHourly = [];
            valuesHourlyTmp.forEach((day) => 
            {
                const date = new Date(day.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
                const tempHigh = day.values.temperatureMax; 
                const tempLow = day.values.temperatureMin;
                const windSpeed = day.values.windSpeed;  
                const humidity= day.values.humidity;
                const pressure = day.values.pressureSeaLevel;
                const originalDate = day.startTime;
                const temperature = day.values.temperature;
                const windDirection = day.values.windDirection;

                const sevenOne = {
                    date: date,
                    tempLow: tempLow,
                    tempHigh: tempHigh,
                    windSpeed: windSpeed,
                    humidity: humidity,
                    pressure: pressure,
                    originalDate: originalDate,
                    temperature: temperature,
                    windDirection: windDirection
                };
                valuesHourly.push(sevenOne);
            });

            showSevenDayWeather(valuesSeven,valuesHourly );
        }else
        {
            const result  = document.querySelector('.errorMessage');
            if(!result)
            {
                const errorMessage = document.createElement('div');

                errorMessage.textContent = "No data Found";
                errorMessage.style.marginTop = '30px'
                errorMessage.fontSize = '30px';
                const tmp = document.getElementsByClassName('description')[0];
                tmp.append(errorMessage);
            }
        }
    }
}

function clearForm()
{
    const locationHeaderTitle = document.querySelector('.locationHeader');
    locationHeaderTitle.innerHTML = '';

    const statusAndTemp = document.querySelector('.statusAndtemp');
    statusAndTemp.innerHTML = '';

    const weatherInfomation = document.querySelector('.weatherInfomation');
    weatherInfomation.innerHTML = '';

    const sevenDayCard  = document.querySelector('.sevenDayCard');
    sevenDayCard.innerHTML = '';

    const description = document.querySelector('.description');
    description.innerHTML = '';

    const detailCard = document.querySelector('.detailCard');
    detailCard.innerHTML = '';

    const weatherChartHeader = document.querySelector('.weatherChartHeader');
    weatherChartHeader.innerHTML = '';

    const chart = document.querySelector('.chart');
    chart.innerHTML = '';

    document.getElementById('street').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('autodetect').checked = false;
    street.disabled = false;
    city.disabled = false;
    state.disabled = false;
}

function showCurrentWeather(valuesCurrent,locationHeader)
{
    const locationHeaderTitle = document.querySelector('.locationHeader');
    locationHeaderTitle.innerHTML = locationHeader;

    const statusAndTemp = document.querySelector('.statusAndtemp');
    statusAndTemp.innerHTML = '';
    
    const status = document.createElement('div');
    status.style.display = 'inline-block';
    
    const currentWeatherText = weatherCodes[valuesCurrent.weatherCode];
    const currentWeatherImage = weatherImages[valuesCurrent.weatherCode];
    const Image = document.createElement('img');
    Image.src = `../static/Images/Weather Symbols for Weather Codes/${currentWeatherImage}`;
    Image.style.width = '100px';
    Image.style.height = '100px';


    const Text = document.createElement('p');
    Text.innerText = currentWeatherText;

    Text.style.color = 'gray';  
    
    status.appendChild(Image);
    status.appendChild(Text);

    const temp = document.createElement('div');
    temp.innerText = `${valuesCurrent.temperature}°`;
    temp.style.display = 'inline-block';
    temp.style.color = 'gray';
    temp.style.marginLeft = '250px';
    temp.style.fontSize = "90px";
    temp.style.position = 'relative';
    temp.style.top = '-50px';
    temp.style.right = '-5px';

    statusAndTemp.appendChild(status);
    statusAndTemp.appendChild(temp);

    const weatherInfomation = document.querySelector('.weatherInfomation');
    const data = {
        humidity: valuesCurrent.humidity,
        pressure: valuesCurrent.pressureSeaLevel,
        windSpeed: valuesCurrent.windSpeed,
        visibility: valuesCurrent.visibility,
        cloudCover: valuesCurrent.cloudCover,
        uvLevel: valuesCurrent.uvIndex
    };
    
    weatherInfomation.innerHTML = `
            <div class = "weatherCore">
                <p>Humidity</p>
                <img class = "imageCore" src="../static/Images/humidity.png">
                <p>${data.humidity}%</p>
            </div>
            <div class = "weatherCore">
                <p>Pressure</p>
                <img class = "imageCore" src="../static/Images/Pressure.png">
                <p>${data.pressure}inHg</p>
            </div>
            <div class = "weatherCore">
                <p>Wind Speed</p>
                <img class = "imageCore" src="../static/Images/Wind_Speed.png">
                <p>${data.windSpeed}mph</p>
            </div>
            <div class = "weatherCore">
                <p>Visibility</p>
                <img class = "imageCore" src="../static/Images/Visibility.png">
                <p>${data.visibility}mi</p>
            </div>
            <div class = "weatherCore">
                <p>Cloud Cover</p>
                <img class = "imageCore" src="../static/Images/Cloud_Cover.png">
                <p>${data.cloudCover}%</p>
            </div>
            <div class = "weatherCore">
                <p>UV Level</p>
                <img class = "imageCore" src="../static/Images/UV_Level.png">
                <p>${data.uvLevel}</p>
            </div>
            <style>
                .currentWeatherCard
                {
                    padding: 20px 15px;
                    box-shadow: -5px 5px 5px rgba(0, 0, 0, 0.2),
                    5px 5px 5px rgba(0, 0, 0, 0.2);
                }
                .currentWeatherCard:hover
                {
                    box-shadow: -5px 5px 5px rgb(0, 0, 0,0.3),5px 5px 5px rgb(0, 0, 0,0.3);
                }
            </style>
    `;    

}

function showSevenDayWeather(valuesSeven,valuesHourly)
{
    const sevenDayCard = document.getElementsByClassName('sevenDayCard')[0];
    sevenDayCard.innerHTML = ``;
    const sevenDayHeader = document.createElement('thead');
    sevenDayHeader.innerHTML = `
            <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Temp High</th>
                <th>Temp Low</th>
                <th>Wind Speed</th>
            </tr>
    `;
    const sevenDayBody = document.createElement('tbody');
    const spacerRow = document.createElement("tr");
    spacerRow.style.height = '5px';
    sevenDayBody.appendChild(spacerRow);
    valuesSeven.forEach((day) => 
    {
        const date = day.date;
        const weatherCode = day.weatherCode;
        const tempHigh = day.tempHigh;
        const tempLow = day.tempLow;
        const windSpeed = day.windSpeed;

        const tablerow = document.createElement("tr");
        const dateData = document.createElement("td");
        const statusData = document.createElement("td");
        const tempHighData = document.createElement("td");
        const tempLowData = document.createElement("td");
        const windSpeedDara = document.createElement("td");

        dateData.textContent = date;
        tempHighData.textContent = tempHigh;
        tempLowData.textContent = tempLow;
        windSpeedDara.textContent = windSpeed;

        const statusText = weatherCodes[weatherCode];
        const statusImg = weatherImages[weatherCode];
        statusData.innerHTML = `
            <div style='display: inline-flex; align-items: center;'>
                <img src='../static/Images/Weather Symbols for Weather Codes/${statusImg}'>
                <div style="margin-left: 10px;">${statusText}</div>
            </div>
        `;
        tablerow.appendChild(dateData);
        tablerow.appendChild(statusData);
        tablerow.appendChild(tempHighData);
        tablerow.appendChild(tempLowData);
        tablerow.appendChild(windSpeedDara);
        tablerow.addEventListener('click', () => showDetailCard(day,valuesHourly,valuesSeven));
        sevenDayBody.appendChild(tablerow)

        const spacerRow = document.createElement("tr");
        spacerRow.style.height = '5px';
        sevenDayBody.appendChild(spacerRow);
    });
    sevenDayCard.appendChild(sevenDayHeader);
    sevenDayCard.appendChild(sevenDayBody);
}

function showDetailCard(day,valuesHourly,valuesSeven)
{
    const locationHeaderTitle = document.querySelector('.locationHeader');
    locationHeaderTitle.innerHTML = '';
    const statusAndTemp = document.querySelector('.statusAndtemp');
    statusAndTemp.innerHTML = '';
    const weatherInfomation = document.querySelector('.weatherInfomation');
    weatherInfomation.innerHTML = '';
    const sevenDayCard = document.getElementsByClassName('sevenDayCard')[0];
    sevenDayCard.innerHTML = '';
    const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    const text = weatherCodes[day.weatherCode];
    const img = weatherImages[day.weatherCode];  
    const tempHigh = day.tempHigh; 
    const tempLow = day.tempLow;
    const precipitation = precipitationTypes[day.precipitation];
    const precipitationProbability = day.precipitationProbability;
    const windSpeed = day.windSpeed;  
    const humidity= day.humidity;
    const visibility = day.visibility;

    const sunriseHour = getHourMin(day.sunrise)[0];
    const sunriseMin = getHourMin(day.sunrise)[1];
    const sunriseUnit = getHourMin(day.sunrise)[2];
    const sunsetHour = getHourMin(day.sunset)[0];
    const sunsetMin = getHourMin(day.sunset)[1];
    const sunsetUnit = getHourMin(day.sunset)[2];

    const description = document.getElementsByClassName('description')[0];
    description.innerHTML =  `       
        <p class="headerDescription">Daily Weather Detail</p>
        <hr class = 'detailhr' style = 'background-color: white;'>
    `;
    const detailCard = document.getElementsByClassName('detailCard')[0];
    detailCard.innerHTML = `
        <div class = "layerOne">
            <div class = "partOne">
                <p>${date}</p>
                <p>${text}</p> 
                <p>${tempHigh}°F/${tempLow}°F</p>
            </div>
            <div class = "partTwo">
                <img class = "detailImageCore" src='../static/Images/Weather Symbols for Weather Codes/${img}'>
            </div>
        </div>
        <div class = "layerTwo">
            <p> <span class = "core">Precipitation:</span> ${precipitation}</p>
            <p><span class = "core">Chance of Rain: </span>${precipitationProbability}%</p>    
            <p><span class = "core">Wind Speed: </span>${windSpeed} mph</p>   
            <p><span class = "core">Humidity: </span>${humidity}%</p>
            <p><span class = "core">Visibility:</span> ${visibility}</p>      
            <p><span class = "core">Sunrise/Sunset:</span> ${sunriseHour}:${sunriseMin}${sunriseUnit}/${sunsetHour}:${sunsetMin}${sunsetUnit}</p>  
        </div>
        <style>
            .detailCard
            {
                box-shadow: 2px 2px 2px rgba(2, 2, 51, 0.604);
            }
            .detailCard:hover
            {
                box-shadow: 2px 2px 2px rgba(2, 2, 51, 0.277);
            }
        </style>
    `;      
    showWeatherChartsHeader(valuesHourly,valuesSeven); 
}

function showWeatherChartsHeader(valuesHourly,valuesSeven)
{
    const weatherChartHeader = document.getElementsByClassName("weatherChartHeader")[0];
    weatherChartHeader.innerHTML =  `       
        <p class="headerDescription"> Weather Charts</p>
        <hr class = 'detailhr' style = 'background-color: white;'>
    `;
    const img = document.createElement('img');
    img.src = '../static/Images/point-down-512.png';
    img.style.width = '30px';
    img.style.height = '30px';
    img.onclick = function() {
        showWeatherCharts(valuesHourly,valuesSeven);
    };    
    img.style.cursor = 'pointer';
    weatherChartHeader.appendChild(img);

}

function showWeatherCharts(valuesHourly,valuesSeven)
{

    const chart = document.getElementsByClassName("chart")[0];
    chart.innerHTML =   `  
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
    <figure class="highcharts-figure">
        <div id="container2"></div>
    </figure>
`
    const weatherChartHeader = document.getElementsByClassName("weatherChartHeader")[0];
    const img = weatherChartHeader.getElementsByTagName('img')[0];
    img.src = '../static/Images/point-up-512.png';
    img.onclick = function() {
        img.src = '../static/Images/point-down-512.png';
        img.style.width = '30px';
        img.style.height = '30px';
        img.onclick = function() {
            showWeatherCharts(valuesHourly,valuesSeven);
        };    
        chart.innerHTML = '';
    };   

    const dataOne = valuesSeven.map(item => {
        const date = new Date(item.originalDate);
        return [
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
            item.tempHigh,
            item.tempLow
        ];
    });

    Highcharts.chart('container', {
        chart: {
            type: 'arearange',
            zooming: {
                type: 'x'
            },
            scrollablePlotArea: {
                minWidth: 600,
                scrollPositionX: 1
            }
        },
        title: {
            text: 'Temperature Range (Min Max)',
            align: "center"
        },
        xAxis: {
            type: 'datetime',
            accessibility: {
                
            }
        },
        yAxis: {
            title: {
                text: null
            },
            min: 55,
            max: 90
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            valueSuffix: '°F',
            xDateFormat: '%A, %b %e'
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Temperatures',
            data: dataOne,
            color: {
                linearGradient: {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 1
                },
                stops: [
                    [0, '#ffcc99'],
                    [1, '#add8e6']
                ]
            }
        }]
    });

    const dataTwo = valuesHourly.map(item => {
        const date = new Date(item.originalDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'short'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return [
            `${formattedDate}, ${formattedTime}`,
            item.temperature,
            item.humidity,
            item.pressure,
            item.windSpeed,
            item.windDirection
        ];
    });
    
    convertToMeteogramFormat(valuesHourly);
}

    function Meteogram(json, container) {
        // Parallel arrays for the chart data, these are populated as the JSON file
        // is loaded
        this.symbols = [];
        this.humidities = [];
        this.winds = [];
        this.temperatures = [];
        this.pressures = [];
    
        // Initialize
        this.json = json;
        this.container = container;
    
        // Run
        this.parseYrData();
    }
    
    /**
     * Mapping of the symbol code in yr.no's API to the icons in their public
     * GitHub repo, as well as the text used in the tooltip.
     *
     * https://api.met.no/weatherapi/weathericon/2.0/documentation
     */
    Meteogram.dictionary = {
        clearsky: {
            symbol: '01',
            text: 'Clear sky'
        },
        fair: {
            symbol: '02',
            text: 'Fair'
        },
        partlycloudy: {
            symbol: '03',
            text: 'Partly cloudy'
        },
        cloudy: {
            symbol: '04',
            text: 'Cloudy'
        },
        lightrainshowers: {
            symbol: '40',
            text: 'Light rain showers'
        },
        rainshowers: {
            symbol: '05',
            text: 'Rain showers'
        },
        heavyrainshowers: {
            symbol: '41',
            text: 'Heavy rain showers'
        },
        lightrainshowersandthunder: {
            symbol: '24',
            text: 'Light rain showers and thunder'
        },
        rainshowersandthunder: {
            symbol: '06',
            text: 'Rain showers and thunder'
        },
        heavyrainshowersandthunder: {
            symbol: '25',
            text: 'Heavy rain showers and thunder'
        },
        lightsleetshowers: {
            symbol: '42',
            text: 'Light sleet showers'
        },
        sleetshowers: {
            symbol: '07',
            text: 'Sleet showers'
        },
        heavysleetshowers: {
            symbol: '43',
            text: 'Heavy sleet showers'
        },
        lightsleetshowersandthunder: {
            symbol: '26',
            text: 'Light sleet showers and thunder'
        },
        sleetshowersandthunder: {
            symbol: '20',
            text: 'Sleet showers and thunder'
        },
        heavysleetshowersandthunder: {
            symbol: '27',
            text: 'Heavy sleet showers and thunder'
        },
        lightsnowshowers: {
            symbol: '44',
            text: 'Light snow showers'
        },
        snowshowers: {
            symbol: '08',
            text: 'Snow showers'
        },
        heavysnowshowers: {
            symbol: '45',
            text: 'Heavy show showers'
        },
        lightsnowshowersandthunder: {
            symbol: '28',
            text: 'Light snow showers and thunder'
        },
        snowshowersandthunder: {
            symbol: '21',
            text: 'Snow showers and thunder'
        },
        heavysnowshowersandthunder: {
            symbol: '29',
            text: 'Heavy snow showers and thunder'
        },
        lightrain: {
            symbol: '46',
            text: 'Light rain'
        },
        rain: {
            symbol: '09',
            text: 'Rain'
        },
        heavyrain: {
            symbol: '10',
            text: 'Heavy rain'
        },
        lightrainandthunder: {
            symbol: '30',
            text: 'Light rain and thunder'
        },
        rainandthunder: {
            symbol: '22',
            text: 'Rain and thunder'
        },
        heavyrainandthunder: {
            symbol: '11',
            text: 'Heavy rain and thunder'
        },
        lightsleet: {
            symbol: '47',
            text: 'Light sleet'
        },
        sleet: {
            symbol: '12',
            text: 'Sleet'
        },
        heavysleet: {
            symbol: '48',
            text: 'Heavy sleet'
        },
        lightsleetandthunder: {
            symbol: '31',
            text: 'Light sleet and thunder'
        },
        sleetandthunder: {
            symbol: '23',
            text: 'Sleet and thunder'
        },
        heavysleetandthunder: {
            symbol: '32',
            text: 'Heavy sleet and thunder'
        },
        lightsnow: {
            symbol: '49',
            text: 'Light snow'
        },
        snow: {
            symbol: '13',
            text: 'Snow'
        },
        heavysnow: {
            symbol: '50',
            text: 'Heavy snow'
        },
        lightsnowandthunder: {
            symbol: '33',
            text: 'Light snow and thunder'
        },
        snowandthunder: {
            symbol: '14',
            text: 'Snow and thunder'
        },
        heavysnowandthunder: {
            symbol: '34',
            text: 'Heavy snow and thunder'
        },
        fog: {
            symbol: '15',
            text: 'Fog'
        }
    };
    
    /**
     * Draw the weather symbols on top of the temperature series. The symbols are
     * fetched from yr.no's MIT licensed weather symbol collection.
     * https://github.com/YR/weather-symbols
     */
    Meteogram.prototype.drawWeatherSymbols = function (chart) {
    
        chart.series[0].data.forEach((point, i) => {
            if (this.resolution > 36e5 || i % 2 === 0) {
    
                const [symbol, specifier] = this.symbols[i].split('_'),
                    icon = Meteogram.dictionary[symbol].symbol +
                        ({ day: 'd', night: 'n' }[specifier] || '');
    
                if (Meteogram.dictionary[symbol]) {
                    chart.renderer
                        .image(
                            'https://cdn.jsdelivr.net/gh/nrkno/yr-weather-symbols' +
                                `@8.0.1/dist/svg/${icon}.svg`,
                            point.plotX + chart.plotLeft - 8,
                            point.plotY + chart.plotTop - 30,
                            30,
                            30
                        )
                        .attr({
                            zIndex: 5
                        })
                        .add();
                } else {
                    console.log(symbol);
                }
            }
        });
    };
    
    
    /**
     * Draw blocks around wind arrows, below the plot area
     */
    Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
        const xAxis = chart.xAxis[0];
    
        for (
            let pos = xAxis.min, max = xAxis.max, i = 0;
            pos <= max + 36e5; pos += 36e5,
            i += 1
        ) {
    
            // Get the X position
            const isLast = pos === max + 36e5,
                x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);
    
            // Draw the vertical dividers and ticks
            const isLong = this.resolution > 36e5 ?
                pos % this.resolution === 0 :
                i % 2 === 0;
    
            chart.renderer
                .path([
                    'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                    'L', x, chart.plotTop + chart.plotHeight + 32,
                    'Z'
                ])
                .attr({
                    stroke: chart.options.chart.plotBorderColor,
                    'stroke-width': 1
                })
                .add();
        }
    
        // Center items in block
        chart.get('windbarbs').markerGroup.attr({
            translateX: chart.get('windbarbs').markerGroup.translateX + 8
        });
    
    };
    
    /**
     * Build and return the Highcharts options structure
     */
    Meteogram.prototype.getChartOptions = function () {
        return {
            chart: {
                renderTo: this.container,
                marginBottom: 70,
                marginRight: 40,
                marginTop: 50,
                plotBorderWidth: 1,
                height: 310,
                alignTicks: false,
                scrollablePlotArea: {
                    minWidth: 720
                }
            },
    
            defs: 
            {
            },
    
            title: {
                text: 'Hourly Weather (For Next 5 Days)',
                align: 'center',
                style: {
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }
            },
    
            credits: {
                text: 'Forecast from <a href="https://yr.no">yr.no</a>',
                href: 'https://yr.no',
                position: {
                    x: -40
                }
            },
    
            tooltip: {
                shared: true,
                useHTML: true,
                headerFormat:
                    '<small>{point.x:%A, %b %e, %H:%M} - ' +
                    '{point.point.to:%H:%M}</small><br>' +
                    '<b>{point.point.symbolName}</b><br>'
    
            },
    
            xAxis: [{ // Bottom X axis
                type: 'datetime',
                tickInterval: 2 * 36e5, // two hours
                minorTickInterval: 36e5, // one hour
                tickLength: 0,
                gridLineWidth: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                offset: 30,
                showLastLabel: true,
                labels: {
                    format: '{value:%H}'
                },
                crosshair: true
            }, { // Top X axis
                linkedTo: 0,
                type: 'datetime',
                tickInterval: 24 * 3600 * 1000,
                labels: {
                    format: '{value:<span style="font-size: 12px; font-weight: ' +
                        'bold">%a</span> %b %e}',
                    align: 'left',
                    x: 3,
                    y: 8
                },
                opposite: true,
                tickLength: 20,
                gridLineWidth: 1
            }],
    
            yAxis: [{ // temperature axis
                title: {
                    text: null
                },
                labels: {
                    format: '{value}°',
                    style: {
                        fontSize: '10px'
                    },
                    x: -3
                },
                plotLines: [{ // zero plane
                    value: 0,
                    color: '#BBBBBB',
                    width: 1,
                    zIndex: 2
                }],
                maxPadding: 0.3,
                minRange: 8,
                tickInterval: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)'
    
            }, { // precipitation axis
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                tickLength: 0,
                minRange: 10,
                min: 0
    
            }, { // Air pressure
                allowDecimals: false,
                title: { // Title on top of axis
                    text: 'hPa',
                    offset: 0,
                    align: 'high',
                    rotation: 0,
                    style: {
                        fontSize: '10px',
                        color: Highcharts.getOptions().colors[2]
                    },
                    textAlign: 'left',
                    x: 3
                },
                labels: {
                    style: {
                        fontSize: '8px',
                        color: Highcharts.getOptions().colors[2]
                    },
                    y: 2,
                    x: 3
                },
                gridLineWidth: 0,
                opposite: true,
                showLastLabel: false
            }],
    
            legend: {
                enabled: false
            },
    
            plotOptions: {
                series: {
                    pointPlacement: 'between'
                }
            },
    
    
            series: [{
                name: 'Temperature',
                data: this.temperatures,
                type: 'spline',
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                tooltip: {
                    pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                        ' ' +
                        '{series.name}: <b>{point.y}°F</b><br/>'
                },
                zIndex: 1,
                color: '#FF3333',
                negativeColor: '#48AFE8'
            },
                {
                name: 'humidity',
                data: this.humidities,
                type: 'column',
                color: '#68CFE8',
                yAxis: 1,
                groupPadding: 0,
                pointPadding: 0,
                grouping: false,
                dataLabels: {
                    filter: {
                        operator: '>',
                        property: 'y',
                        value: 0
                    },
                    style: {
                        fontSize: '8px',
                        color: '#666'
                    },
                    enabled: true,
                    format: '{y}',
                    inside: false,
                    style: {
                        color: 'black',
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    valueSuffix: ' %'
                }
            }, {
                name: 'Air pressure',
                color: Highcharts.getOptions().colors[2],
                data: this.pressures,
                marker: {
                    enabled: false
                },
                shadow: false,
                tooltip: {
                    valueSuffix: ' inHg'
                },
                dashStyle: 'shortdot',
                yAxis: 2
            }, {
                name: 'Wind',
                type: 'windbarb',
                id: 'windbarbs',
                color: Highcharts.getOptions().colors[1],
                lineWidth: 1.5,
                data: this.winds,
                vectorLength: 18,
                yOffset: -15,
                tooltip: {
                    valueSuffix: ' hpm'
                }
            }]
        };
    };
    
    /**
     * Post-process the chart from the callback function, the second argument
     * Highcharts.Chart.
     */
    Meteogram.prototype.onChartLoad = function (chart) {
    
        this.drawWeatherSymbols(chart);
        this.drawBlocksForWindArrows(chart);
    
    };
    
    /**
     * Create the chart. This function is called async when the data file is loaded
     * and parsed.
     */
    Meteogram.prototype.createChart = function () {
        this.chart = new Highcharts.Chart(this.getChartOptions(), chart => {
            this.onChartLoad(chart);
        });
    };
    
    Meteogram.prototype.error = function () {
        document.getElementById('loading').innerHTML =
            '<i class="fa fa-frown-o"></i> Failed loading data, please try again ' +
            'later';
    };
    
    /**
     * Handle the data. This part of the code is not Highcharts specific, but deals
     * with yr.no's specific data format
     */
     Meteogram.prototype.parseYrData = function () {
        let pointStart;
    
        if (!this.json) {
            return this.error();
        }
    
        this.json.properties.timeseries.forEach((node, i) => {
            const x = Date.parse(node.time);
            const symbolCode = 'clearsky'; // You can use a default value or modify this to handle symbols as needed
            const to = x + 3600000; // 1 hour ahead
    
            if (to > pointStart + 48 * 36e5) {
                return;
            }
    
            // Remove nextHours and use the `instant` data directly
            this.symbols.push(symbolCode); // Placeholder, you might want to adjust it
            this.temperatures.push({
                x,
                y: node.data.instant.details.air_temperature,
                to,
                symbolName: Meteogram.dictionary[symbolCode].text
            });
            this.humidities.push({
                x,
                y: node.data.instant.details.humidity
            });    
            // Wind data is still captured
            this.winds.push({
                x,
                value: node.data.instant.details.wind_speed,
                direction: node.data.instant.details.wind_from_direction
            });
    
            this.pressures.push({
                x,
                y: node.data.instant.details.air_pressure_at_sea_level
            });
    
            if (i === 0) {
                pointStart = (x + to) / 2;
            }
        });
    
        // Create the chart when the data is loaded
        this.createChart();
    };
    
    // End of the Meteogram protype
    
    
    // On DOM ready...
    // Original JSON Array
    const currentWeatherArray = [
        {
            "date": "Monday, Oct 14, 2024",
            "humidity": 79.5,
            "originalDate": "2024-10-14T04:00:00-07:00",
            "pressure": 29.97,
            "tempHigh": 80.1,
            "tempLow": 80.1,
            "temperature": 80.1,
            "windDirection": 200,
            "windSpeed": 10.85
        },
        {
            "date": "Tuesday, Oct 15, 2024",
            "humidity": 82.0,
            "originalDate": "2024-10-15T04:00:00-07:00",
            "pressure": 30.05,
            "tempHigh": 81.0,
            "tempLow": 79.5,
            "temperature": 80.0,
            "windDirection": 180,
            "windSpeed": 12.0
        },
        // Add more weather data objects as needed
    ];
    
    function convertToMeteogramFormat(dataArray) {
        console.log(dataArray);
        const result = {
            properties: {
                timeseries: dataArray.map(data => {
                    return {
                        time: data.originalDate,
                        data: {
                            instant: {
                                details: {
                                    air_temperature: data.temperature,
                                    air_pressure_at_sea_level: data.pressure,
                                    wind_speed: data.windSpeed,
                                    wind_from_direction: data.windDirection,
                                    humidity: data.humidity,
                                }
                            }
                        }
                    };
                })
            }
        };
        window.meteogram = new Meteogram(result, 'container2');
    }
    
    

function getHourMin(sunTime) {

    const HourMin = sunTime.split('T')[1]; 
    const [hour, minute] = HourMin.split(':');

    let hourInt = parseInt(hour, 10);
    var unit = '';
    if(hourInt>12)
    {
        hourInt -=12;
        unit = 'PM';
    }else
    {
        unit = 'AM';
    }
    return [hourInt,minute,unit];
}

