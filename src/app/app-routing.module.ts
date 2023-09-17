import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddSiteComponent } from './new/add-site.component';
import { FeedComponent } from './feed/feed.component';

const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'prefix'},
  { path: 'feed', component: FeedComponent, data: {callingPage: 'feed'}},
  { path: 'new', component: AddSiteComponent, data: {callingPage: 'new'}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
