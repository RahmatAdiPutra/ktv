import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PusherService } from 'src/app/services/pusher.service';
import { SongService } from 'src/app/services/song.service';
import { RoomService } from 'src/app/services/room.service';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  data: any = {};

  @ViewChild('player') player;

  constructor(
    private route: ActivatedRoute,
    private pusherService: PusherService,
    private songService: SongService,
    private roomService: RoomService,
    private playerService: PlayerService) {
      this.data.playlists = [];
      this.data.histories = [];

      this.data.song = {};
      this.data.room = {};
      this.data.player = {};

      this.data.player.active = false;
      this.data.player.play = false;

      this.data.song.server = environment.hostVideo;
      this.data.song.url = '';
      this.data.song.autoplay = false;

      this.pusherService.connect();
    }

  ngOnInit() {
    this.data.room.token = this.route.snapshot.paramMap.get('token');
    this.roomService.getRoomOpen(this.data.room.token).subscribe(res => this.roomOpen(res), error => console.log(error));
    // this.playerService.getPlayer().subscribe(res => console.log(res), error => console.log(error));
  }

  roomOpen(res) {
    if (res.payloads.data) {
      this.data.room.session = res.payloads.data.active_session_id;
      this.data.player.active = true;
      this.presenceChannel(this.data.room.session);
    }
  }

  roomPlaylist(res) {
    this.data.playlists = res.payloads.data.filter((v, k) => v.pivot.is_played === 0);
    this.data.histories = res.payloads.data.filter((v, k) => v.pivot.is_played === 1);
    console.log(this.data.playlists);
    console.log(this.data.histories);
    if (this.data.player.play) {
      this.songPlay();
    }
  }

  songSelect(data) {
    if (data) {
      this.data.song.url = this.data.song.server + data.file_path;
    } else {
      this.data.song.url = '';
      console.log('Playlists empty');
    }
  }

  songPlay() {
    this.songSelect(this.data.playlists[0]);
    setTimeout(() => {
      this.player.nativeElement.play();
    }, 1000);
  }

  songStop() {
    this.player.nativeElement.pause();
    this.player.nativeElement.currentTime = 0;
  }

  songNext() {
    if (this.data.player.repeat) {
      this.songPlay();
    } else {
      const x = this.data.playlists.filter((v, k) => k !== 0);
      const y = this.data.playlists.filter((v, k) => k === 0);
      const z = x.concat(y);
      this.data.playlists = x;
      this.songPlay();
      this.roomPostPlaylist(z);
    }
  }

  roomPostPlaylist(data) {
    this.data.room.playlists = {};
    this.data.room.playlists.room_session_id = this.data.room.session;
    this.data.room.addPlaylists = [];
    this.playlistHistory(data);
    this.data.room.playlists.playlist = this.data.room.addPlaylists;
    this.roomService.postPlaylist(this.data.room.playlists).subscribe(res => console.log(res), error => console.log(error));
  }

  playlistHistory(data) {
    data.forEach((v, k) => {
      this.data.room.playlist = {
        song_id: v.id,
        is_played: (data.length - 1) === k ? 1 : 0,
        order_num: (data.length - 1) === k ? this.data.histories.length : k,
        count_play: 1
      };
      this.data.room.addPlaylists.push(this.data.room.playlist);
    });

    this.data.histories.forEach((v, k) => {
      this.data.room.history = {
        song_id: v.id,
        is_played: 1,
        order_num: k,
        count_play: 1
      };
      this.data.room.addPlaylists.push(this.data.room.history);
    });
  }

  presenceChannel(sessionId) {
    window.Echo.join(`room-playlist.${sessionId}`).listen('RoomPlaylist', (rooms) => {
      console.log(rooms);
      let listen = true;
      if (rooms.player) {
        if (rooms.player.play === true) {
          this.data.player.play = rooms.player.play;
        } else if (rooms.player.play === false) {
          listen = false;
          this.data.player.play = rooms.player.play;
          this.songStop();
        }
        this.data.player.repeat = rooms.player.repeat;
      }
      if (listen) {
        this.roomService.getPlaylist(this.data.room.token).subscribe(res => this.roomPlaylist(res), error => console.log(error));
      }
    });
  }

  leavePresenceChannel(sessionId) {
    window.Echo.leave(`room-playlist.${sessionId}`);
  }

}
