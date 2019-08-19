import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { HomeComponent } from "./components/home/home.component";
import { KtvComponent } from "./components/ktv/ktv.component";
import { PlayerComponent } from "./components/player/player.component";
import { RemoteComponent } from "./components/remote/remote.component";
import { OperatorComponent } from "./components/operator/operator.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'ktv', component: KtvComponent },
  { path: 'player/:token', component: PlayerComponent },
  { path: 'remote', component: RemoteComponent },
  { path: 'operator', component: OperatorComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
