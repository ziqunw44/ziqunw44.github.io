import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { Meteogram } from './meteogram/meteogram.component';
import {DetailDayComponent} from './detail-day/detail-day.component';
export const routes: Routes = [{path: 'table', component: Meteogram},
                               {path: 'detail', component: DetailDayComponent},
                               {path: 'home', redirectTo: '/'},
                               {path: 'favorite', component: FavoriteComponent}];
