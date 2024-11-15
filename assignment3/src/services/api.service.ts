import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private locationUrl = '/api/submit';
  private isFavoriteUrl = '/api/isFavorite';
  private addFavoriteUrl = '/api/addFavorite';
  private deleteFavoriteUrl = '/api/deleteFavorite';
  private getFavoriteUrl = '/api/getFavorite';
  constructor( private http:HttpClient) {}


  submit(data:{street: string; city: string; state: string;currentLocation:boolean;location:string}): Observable<any>
  {
    console.log(this.locationUrl);
    const params = new HttpParams().set('street',data.street).set('city',data.city).set('state',data.state).set('autoDetect',data.currentLocation).set('location',data.location);
    return this.http.get<any>(this.locationUrl,{params});
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
