import { Component,OnInit } from '@angular/core';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-detail-day',
  standalone: true,
  imports: [GoogleMapsModule,CommonModule],
  templateUrl: './detail-day.component.html',
  styleUrl: './detail-day.component.css'
})

export class DetailDayComponent {
  res_sevenDay:any;
  res_oneDay:any;
  res_day:any;
  showChart = true;
  date: any;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };;
  zoom: number=12;
  weatherData = {
    status: 'Clear',
    maxTemp: 57.76,
    minTemp: 41.68,
    apparentTemp: 57.76,
    sunRise: '4 AM',
    sunSet: '3 PM',
    humidity: 73,
    windSpeed: 13,
    visibility: 9.94,
    cloudCover: 100,
  };
  ngOnInit(): void 
  {
    this.res_sevenDay = history.state.json;
    this.res_day = history.state.json_day;
    this.date = this.res_day.date;
      this.center = {
        lat: this.res_sevenDay.locationDetails.lat,
        lng: this.res_sevenDay.locationDetails.lng,
      };
      this.zoom = 12;
  }
  
  constructor(private router:Router) {}
  goToMeteogram() {
    this.showChart = false;
    this.router.navigate(['/table'], { state: { json: this.res_sevenDay, res_day:this.res_day} });
  } 
}