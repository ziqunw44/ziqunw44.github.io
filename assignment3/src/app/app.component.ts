import { Component ,ViewChild,ElementRef,OnInit,NgZone} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormsModule,ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  RouterLink,
  RouterOutlet
} from '@angular/router';
import { Meteogram } from './meteogram/meteogram.component';
import { DetailDayComponent } from './detail-day/detail-day.component';
import { Router} from '@angular/router';

export const slideInAnimation = trigger('routeAnimations', [
  transition('table => detail', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' })),
  ]),
  transition('detail => table', [
    style({ opacity: 0, transform: 'translateX(0%)' }),
    animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateX(100%)' })),
  ]),
]);
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,CommonModule,RouterLink,Meteogram,DetailDayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [slideInAnimation]

})

export class AppComponent implements OnInit {
  @ViewChild('cityInput') cityInput!: ElementRef;
  ngOnInit() {
    window.onload = () => {
      this.initializeAutocomplete();
    };
  }
  title = 'assignment3';

  states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida",
  "Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming"
];
isClicked = false;
weatherForm: FormGroup;
res_sevenDay:any;
showTable = false;
inProgress = false;
inError = false;
constructor(private apiservice:ApiService, private formBuilder: FormBuilder,private router: Router,private NgZone: NgZone,private httpClient: HttpClient){
  this.weatherForm = this.formBuilder.group(
    {
      street: ['', [Validators.required, Validators.minLength(1)]],
      city: ['', [Validators.required, Validators.minLength(1)]],
      state: ['', Validators.required],
      currentLocation: [false],
    }); 
    this.weatherForm.controls['currentLocation'].valueChanges.subscribe((isChecked) => {
      this.isCurrentLocation(isChecked);
    });
}
isCurrentLocation(isChecked: boolean) {
  if (isChecked) {
    this.weatherForm.controls['street'].disable();
    this.weatherForm.controls['city'].disable();
    this.weatherForm.controls['state'].disable();
    return;
  }
  this.weatherForm.controls['street'].enable();
  this.weatherForm.controls['city'].enable();
  this.weatherForm.controls['state'].enable();
}
submitLocation()
{
  if(this.weatherForm.valid)
  {
    this.inProgress = true;
    this.inError = false;
    if(!this.weatherForm.controls['currentLocation'].value)
    {
      this.showTable = true;
      const data = { ...this.weatherForm.value, location: '' };
      this.apiservice.submit(data).subscribe(
      
        (response)=>{
          this.res_sevenDay = response;
          this.goToMeteogram();
        },
        (error:any)=>{
          console.log(error);
          this.inError = true;
        }
      );
      this.inProgress = false;
      return;
    }  
    this.httpClient.get(`https://ipinfo.io?token=4f0fe9c3c919a4`).subscribe(
      (response: any) => {
        const { city, region, country, loc } = response;
        const data_ = {
          street: '',
          city:city,
          state:region,
          currentLocation: true, 
          location: loc
        };
        this.apiservice.submit(data_).subscribe(
       
          (response)=>{
            this.res_sevenDay = response;
            this.goToMeteogram();
          },
          (error:any)=>{
            this.inError = true;
            console.log(error);
          }
        );
      },
      (error: any) => {
        this.inError = true;
        console.error('Error fetching location:', error);
      }
    );
    this.inProgress = false;
  }
}

  goToMeteogram() {
    this.isClicked = false;
    if(this.weatherForm.valid && this.res_sevenDay)
    {
      this.router.navigate(['/table'], { state: { json: this.res_sevenDay } });
      return;
    }
    this.router.navigate(['/home'] );
  } 
  clearAll() {
    this.res_sevenDay = null;
    this.showTable = false;
    this.isClicked = false;
    this.weatherForm.reset();
    this.router.navigate(['/home']);
  }
  

  goToFavorite() {
    
    this.router.navigate(['/favorite']);
    this.isClicked = true;
  } 
  initializeAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.cityInput.nativeElement, {
      types: ['(cities)'],
      componentRestrictions: { country: 'us' }
    });
  
    autocomplete.addListener('place_changed', () => {
      this.NgZone.run(() => {
        const place = autocomplete.getPlace();
        if (place.address_components) {
          const city = place.address_components.find((component) =>
            component.types.includes('locality')
          )?.long_name;
          let state = place.address_components.find((component) =>
            component.types.includes('administrative_area_level_1')
          )?.long_name;
          if (city) {
            this.weatherForm.controls['city'].setValue(city);
          }
          if (state) {
            this.weatherForm.controls['state'].setValue(state);
          }
        }
      });
    });
  }
  prepareRoute(outlet: RouterOutlet) {
    const animation = outlet?.activatedRouteData?.['animation'];
    return animation;
  }
}

