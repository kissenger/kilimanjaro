import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MapComponent } from './main/map/map.component';
import { CreateRecordComponent } from './main/create-record/create-record.component';

const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'prefix'},
  { path: '', component: MainComponent,
    children: [
      { path: 'map', component: MapComponent},
      { path: 'create-record', component: CreateRecordComponent},

  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
