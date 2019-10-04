import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { KtvComponent } from './components/ktv/ktv.component';
import { PlayerComponent } from './components/player/player.component';
import { RemoteComponent } from './components/remote/remote.component';
import { OperatorComponent } from './components/operator/operator.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { LoginComponent } from './components/login/login.component';
import { OfflineComponent } from './components/offline/offline.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { AuthGuard, LoginGuard } from './guards/auth.guard';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  // { path: 'ktv', component: KtvComponent },
  // { path: 'player/:token', component: PlayerComponent },
  // { path: 'remote', component: RemoteComponent },
  { path: '', component: OperatorComponent, canActivate: [AuthGuard] },
  { path: 'playlist', component: PlaylistComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'offline', component: OfflineComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
