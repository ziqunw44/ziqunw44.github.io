import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule,NgbAlertModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent{
  favorites: any;
  empty=false;
  res_sevenDay:any;
  ngOnInit(): void {
    this.getFavorite();
  }
  constructor(private apiservice:ApiService,private router:Router){};


  getFavorite()
  {
    this.apiservice.getFavorite().subscribe(
    
        (response)=>{
          this.favorites = response.favorites;
          if(this.favorites.length ===0)
          {
            this.empty = true;
          }
        },
        (error:any)=>{
          console.log(error);
        }
      );
}


deleteFavorite(city:string,state:string)
{

        const data = {"city":city,"state":state}
        this.apiservice.deleteFavorite(data).subscribe(
        
            (response)=>{
                console.log(response);
            },
            (error:any)=>{
              console.log(error);
            }
          );      
          this.favorites = this.favorites.filter(
            (favorite: any) => !(favorite.city === city && favorite.state === state) );
          this.empty = this.favorites.length === 0;
}


submitLocation(city:string,state:string)
{
    const data = {street: '', city: city, state: state, currentLocation: false,location:''}
    this.apiservice.submit(data).subscribe(
    
      (response)=>{
        this.res_sevenDay = response;
        this.goToMeteogram();
      },
      (error:any)=>{
        console.log(error);
      }
    );
}

  goToMeteogram() {
    this.router.navigate(['/table'], { state: { json: this.res_sevenDay } });
  } 
}