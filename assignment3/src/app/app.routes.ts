import { Routes } from '@angular/router';
import { FavoriteComponent } from './favorite/favorite.component';
import { Meteogram } from './meteogram/meteogram.component';
import {DetailDayComponent} from './detail-day/detail-day.component';
export const routes: Routes = [{path: 'table', component: Meteogram,data: { animation: 'table' },},
                               {path: 'detail', component: DetailDayComponent,data: { animation: 'detail' },},
                               {path: 'home', redirectTo: '/'}, 
                               {path: 'favorite', component: FavoriteComponent}];
