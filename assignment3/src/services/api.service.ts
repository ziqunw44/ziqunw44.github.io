import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private locationUrl = 'http://localhost:3000/api/submit';
  private mockUrl = 'http://localhost:3000/api/mock';
  private mockmeteUrl = 'http://localhost:3000/api/mockmete';
  private isFavoriteUrl = 'http://localhost:3000/api/isFavorite';
  private addFavoriteUrl = 'http://localhost:3000/api/addFavorite';
  private deleteFavoriteUrl = 'http://localhost:3000/api/deleteFavorite';
  private getFavoriteUrl = 'http://localhost:3000/api/getFavorite';
  constructor( private http:HttpClient) {}


  submit(data:{street: string; city: string; state: string;currentLocation:boolean;}): Observable<any>
  {
    const params = new HttpParams().set('street',data.street).set('city',data.city).set('state',data.state).set('autoDetect',data.currentLocation);
    return this.http.get<any>(this.locationUrl,{params});
  }
  mock(data:{street: string; city: string; state: string;currentLocation:boolean;}): Observable<any>
  {
    const params = new HttpParams().set('street',data.street).set('city',data.city).set('state',data.state).set('autoDetect',data.currentLocation);
    return this.http.get<any>(this.mockUrl,{params});
  }
  getMockWeatherData(): Observable<any> {
    const params = new HttpParams();
    return this.http.get<any>(this.mockmeteUrl,{});
  }
  isFavorite(data:{city:string,state:string}): Observable<any>
  {
    const params = new HttpParams().set('city',data.city).set('state',data.state);
    return this.http.get<any>(this.isFavoriteUrl,{params});    
  }
  addFavorite(data:{city:string,state:string}): Observable<any>
  {
    return this.http.post<any>(this.addFavoriteUrl, data); 
  }
  deleteFavorite(data:{city:string,state:string}): Observable<any>
  {
    return this.http.post<any>(this.deleteFavoriteUrl, data); 
  }
  getFavorite():Observable<any>
  {
    return this.http.get<any>(this.getFavoriteUrl,{});    
  }
} 
