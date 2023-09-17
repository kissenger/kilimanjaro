
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { FeedComponent } from './feed/feed.component';
import { AddSiteComponent } from './new/add-site.component';
import { ListItemComponent } from './feed/list-item/list-item.component';

import { HttpService } from './shared/services/http.service';
import { MapService } from './shared/services/map.service';
import { DataService } from './shared/services/data.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent,
    FeedComponent,
    AddSiteComponent,
    ListItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    HttpService,
    MapService,
    DataService,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
