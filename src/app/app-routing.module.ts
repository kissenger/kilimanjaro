import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MapComponent } from './main/map/map.component';
import { CreateRecordComponent } from './main/create-record/create-record.component';
import { FeedComponent } from './main/feed/feed.component';

const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'prefix'},
  { path: 'map', component: MainComponent, data: {callingPage: 'feed'}},
  { path: 'create-record', component: CreateRecordComponent, data: {callingPage: 'create-record'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
