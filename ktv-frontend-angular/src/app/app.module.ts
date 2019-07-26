import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';

import { MatVideoModule } from 'mat-video';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './material/material.module';

import { PusherService } from './services/pusher.service';

import { KtvComponent } from './components/ktv/ktv.component';
import { PlayerComponent } from './components/player/player.component';
import { RemoteComponent } from './components/remote/remote.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { OperatorComponent } from './components/operator/operator.component';
import { HomeComponent } from './components/home/home.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [
    AppComponent,
    KtvComponent,
    PlayerComponent,
    RemoteComponent,
    PageNotFoundComponent,
    OperatorComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    MatVideoModule,
    MaterialModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [
    PusherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
