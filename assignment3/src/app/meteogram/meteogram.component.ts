import { booleanAttribute, Component ,Input} from '@angular/core';
import { Router } from '@angular/router';
import {
    RouterOutlet,
  } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { ApiService } from '../../services/api.service';
import * as Highcharts from 'highcharts';
import more from 'highcharts/highcharts-more';
more(Highcharts);
import highchartsWindbarb from 'highcharts/modules/windbarb';
highchartsWindbarb(Highcharts);
interface daily {
    date: string;
    tempHigh: number;
    tempLow: number;
    windSpeed: number;
    weatherCode: string;
    img: string;
    status: string;
    sunrise: string;
    sunset: string;
    humidity: number;
    cloudcover: number;
    temperature:number;
    visibility:number;
  }
  
@Component({
  selector: 'app-meteogram',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './meteogram.component.html',
  styleUrl: './meteogram.component.css',
  
})
export class Meteogram{
  @Input() json: any;
  symbols: string[] = [];
  container: string = 'chart';
  humidities : any[] = [];
  winds: any[] = [];
  temperatures: any[] = [];
  pressures: any[] = [];
  resolution: number = 36e5;
  locationHeader:any;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = { };
  showChart = false;
  isStarred = false;
  city:string ='';
  state:string ='';

  constructor(private apiservice:ApiService, private  router: Router){}
  states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida",
  "Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming"
];
weatherCodes = {
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
weatherImages = {
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
//   ngOnInit(): void {
//     console.log(this.json);
//     if (this.json && this.container) {
//       this.parseYrData();
//     } else {
//       console.error('Missing json data or container ID');
//     }
//   }
  dictionary :{ [key: string]: { symbol: string; text: string } }= {
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

mockData:any;
res_sevenDay:any;
res_day:any;
sevenDay: daily[] = [];
sevenDayTempRange:any = [];
showTable: boolean = true;

ngOnInit(): void {
    this.res_sevenDay = this.json || history.state.json;
    this.city = this.res_sevenDay.locationDetails.city;
    this.state = this.res_sevenDay.locationDetails.state;
    this.mockData = this.res_sevenDay.mockData;
    this.sevenDayTempRange = this.res_sevenDay.valuesSeven.map((day: any) => [
        Date.UTC(
        new Date(day.startTime).getFullYear(),
        new Date(day.startTime).getMonth(),
        new Date(day.startTime).getDate()
        ),
        day.values.temperatureMin,
        day.values.temperatureMax  
    ]);
    this.sevenDay = this.res_sevenDay.valuesSeven.map((day:any) => ({
        date: new Date(day.startTime).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        }),
        tempHigh: day.values.temperatureMax,
        tempLow: day.values.temperatureMin,
        windSpeed: day.values.windSpeed,
        weatherCode: day.values.weatherCode,
        img: this.weatherImages[day.values.weatherCode as keyof typeof this.weatherImages],
        status: this.weatherCodes[day.values.weatherCode as keyof typeof this.weatherImages],
        sunrise: day.values.sunriseTime,
        sunset: day.values.sunsetTime,
        humidity: day.values.humidity,
        cloudcover: day.values.cloudCover,
        temperature:day.values.temperature,
        visibility:day.values.visibility
    }));
    this.locationHeader = this.res_sevenDay.locationDetails.locationHeader;
    this.isFavorite();
    this.res_day = history.state.res_day || this.sevenDay[0];
};

createTempChart()
  {
    this.chartOptions = { 
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
            min: 40,
            max: 90
        },
        tooltip: { 
            shared: true,
            valueSuffix: '°F',
            xDateFormat: '%A, %b %e'
        },
        legend: {
            enabled: false
        },
        series: [{
            type: 'arearange',
            name: 'Temperatures',
            data: this.sevenDayTempRange,
      
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
    
    };
    Highcharts.chart('chart', this.chartOptions);
  }







  createChart(): void {
    this.getChartOptions();
    Highcharts.chart('chart2', this.chartOptions);
  }


  getChartOptions() { 
    this.chartOptions={};
    this.chartOptions= {
      chart: {
          renderTo: 'chart2',
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

      title: {
          text: 'Meteogram for London, England',
          align: 'left',
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

      }, { // Air pressure
          allowDecimals: false,
          title: { // Title on top of axis
              text: 'hPa',
              offset: 0,
              align: 'high',
              rotation: 0,
              style: {
                  fontSize: '10px',
                  // color: Highcharts.getOptions().colors[2]
              },
              textAlign: 'left',
              x: 3
          },
          labels: {
              style: {
                  fontSize: '8px',
                  // color: Highcharts.getOptions().colors[2]
              },
              y: 2,
              x: 3
          },
          gridLineWidth: 0,
          opposite: true,
          showLastLabel: false
      },    { // Air Pressure Axis
        allowDecimals: false,
        title: {
            text: 'Air Pressure (inHg)',
            style: {
                fontSize: '10px'
            }
        },
        labels: {
            style: {
                fontSize: '8px'
            }
        },
        opposite: true,
        gridLineWidth: 0
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
                  '{series.name}: <b>{point.y}°C</b><br/>'
          },
          zIndex: 1,
          color: '#FF3333',
          negativeColor: '#48AFE8'
      },  {
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
            // style: {
            //     color: 'black',
            //     fontWeight: 'bold'
            // }
        },
        tooltip: {
            valueSuffix: ' %'
        }
    }, {
      name: 'Air pressure',
      type: 'spline',
      // color: Highcharts.getOptions().colors[2],
      data: this.pressures,
      marker: {
          enabled: false
      },
      shadow: false,
      tooltip: {
          valueSuffix: ' inHg'
      },
      dashStyle: 'ShortDot',
      yAxis: 2
  },
    {
          name: 'Wind',
          type: 'windbarb',
          id: 'windbarbs',
          // color: Highcharts.getOptions().colors[1],
          lineWidth: 1.5,
          data: this.winds,
          vectorLength: 18,
          yOffset: -15,
          tooltip: {
              valueSuffix: ' m/s'
          }
      }]
  };
};



parseYrData():void {
  // Loop over hourly (or 6-hourly) forecasts
  this.mockData.properties.timeseries.forEach((node:any, i:number) => {
      const x = Date.parse(node.time),
          nextHours = node.data.next_1_hours || node.data.next_6_hours,
          symbolCode = nextHours && nextHours.summary.symbol_code,
          to = node.data.next_1_hours ? x + 36e5 : x + 6 * 36e5;
      // Populate the parallel arrays
      this.symbols.push(nextHours.summary.symbol_code);
      this.temperatures.push({
          x,
          y: node.data.instant.details.air_temperature,
          // custom options used in the tooltip formatter
          to,
          symbolName: this.dictionary[
              symbolCode.replace(/_(day|night)$/, '')
          ].text
      });
      this.humidities.push({
        x,
        y: node.data.instant.details.humidity
    }); 

      this.winds.push({
          x,
          value: node.data.instant.details.wind_speed,
          direction: node.data.instant.details.wind_from_direction
      });

      this.pressures.push({
          x,
          y: node.data.instant.details.air_pressure_at_sea_level
      })
  });

  // Create the chart when the data is loaded
  this.createChart();
};
goToDetailDay(day:any) {
    // this.showTable = false;
    this.router.navigate(['/detail'], { state: { json: this.res_sevenDay,json_day:day } });
  } 
  goToDetailDay_() {
    // this.showTable = false;
    this.router.navigate(['/detail'], { state: { json: this.res_sevenDay,json_day:this.res_day } });
  } 


isFavorite()
{
    const data = {"city":this.city,"state":this.state}
    this.apiservice.isFavorite(data).subscribe(
    
        (response)=>{
            this.isStarred = response.isFavorite;
        },
        (error:any)=>{
          console.log(error);
        }
      );
}

addFavorite()
{
    if( this.isStarred == true)
    {
        const data = {"city":this.city,"state":this.state}
        this.apiservice.deleteFavorite(data).subscribe(
        
            (response)=>{
                console.log(response);
            },
            (error:any)=>{
              console.log(error);
            }
          );   
        this.isStarred = false;         
        return;
    }
    const data = {"city":this.city,"state":this.state}
    this.apiservice.addFavorite(data).subscribe(
    
        (response)=>{
            console.log(response);
        },
        (error:any)=>{
          console.log(error);
        }
      );   
    this.isStarred = true; 
}
}
