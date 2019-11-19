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
import { DialogDeleteComponent } from './components/dialog-delete/dialog-delete.component';
import { DialogAllowSoundCallComponent } from './components/dialog-allow-sound-call/dialog-allow-sound-call.component';
import { LoginComponent } from './components/login/login.component';
import { OfflineComponent } from './components/offline/offline.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { OperatorPlaylistComponent } from './components/operator/operator-playlist/operator-playlist.component';
import { OperatorRoomComponent } from './components/operator/operator-room/operator-room.component';
import { OperatorRoomCallComponent } from './components/operator/operator-room-call/operator-room-call.component';
import { OperatorRoomPlaylistComponent } from './components/operator/operator-room-playlist/operator-room-playlist.component';
import { OperatorSongComponent } from './components/operator/operator-song/operator-song.component';
import { OperatorPreviewVideoComponent } from './components/operator/operator-preview-video/operator-preview-video.component';

@NgModule({
  declarations: [
    AppComponent,
    KtvComponent,
    PlayerComponent,
    RemoteComponent,
    PageNotFoundComponent,
    OperatorComponent,
    HomeComponent,
    DialogDeleteComponent,
    DialogAllowSoundCallComponent,
    LoginComponent,
    OfflineComponent,
    PlaylistComponent,
    OperatorPlaylistComponent,
    OperatorRoomComponent,
    OperatorRoomCallComponent,
    OperatorRoomPlaylistComponent,
    OperatorSongComponent,
    OperatorPreviewVideoComponent
  ],
  entryComponents: [
    DialogDeleteComponent,
    DialogAllowSoundCallComponent
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
