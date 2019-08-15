import { Component, OnInit } from '@angular/core';
import { PusherService } from 'src/app/services/pusher.service';
import { PlayerService } from 'src/app/services/player.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  constructor(
    private pusherService: PusherService,
    private playerService: PlayerService) {
      this.playerService.getPlayer().subscribe(res => console.log(res), error => console.log(error));
    }

  ngOnInit() {
  }

}
