import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../../../environments/environment';
import { PusherService } from 'src/app/services/pusher.service';
import { SongService } from 'src/app/services/song.service';
import { RoomService } from 'src/app/services/room.service';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})

export class OperatorComponent implements OnInit {

  data: any = {};
  select: any = {};
  param: any = {};
  source: any = {};
  column: any = {};
  page: any = {};
  form: any = {};

  selected = false;

  @ViewChild(MatPaginator) songPaginator: MatPaginator;
  @ViewChild('table') table: MatTable < string[] > ;
  @ViewChild('player') player;

  constructor(
    private pusherService: PusherService,
    private songService: SongService,
    private roomService: RoomService,
    private playerService: PlayerService) {
    this.data.playlists = [];
    this.data.histories = [];
    this.data.songs = [];
    this.data.rooms = [];
    this.data.calls = [];

    this.data.song = {};
    this.data.room = {};
    this.data.call = {};
    this.data.search = {};
    this.data.player = {};

    this.page.song = {};

    this.param.song = {};
    this.param.room = {};
    this.param.search = {};

    this.form.search = {};

    this.column.playlists = ['action', 'title', 'artist'];
    this.column.histories = ['action', 'title', 'artist'];
    this.column.songs = ['action', 'title', 'artist', 'genre', 'language'];
    this.column.rooms = ['name', 'status', 'guest_name', 'ip_address'];
    this.column.calls = ['action', 'name', 'guest'];

    this.data.song.server = environment.hostVideo;
    this.data.song.url = '';

    this.pusherService.connect();
    this.privateChannel();
  }

  ngOnInit() {
    this.param.song.length = 25;
    this.param.song.orderColumn = '3';
    this.param.song.orderDir = 'desc';
    this.param.room.orderColumn = '2';
    this.param.room.orderDir = 'asc';
    this.songService.getLanguage().subscribe(res => this.language(res), error => console.log(error));
    this.songService.getSong(this.param.song).subscribe(res => this.song(res), error => console.log(error));
    this.roomService.getRoom(this.param.room).subscribe(res => this.room(res), error => console.log(error));
    this.roomService.getCall().subscribe(res => this.call(res), error => console.log(error));
  }

  language(res) {
    this.select.languages = res.payloads.data;
  }

  song(res) {
    this.data.songs = res.payloads.data;
    this.source.songs = new MatTableDataSource(this.data.songs);
    this.source.songs.paginator = this.songPaginator;
    this.page.song.pageSizeOptions = [100, 50, 25, 10];
    this.page.song.pageSize = res.payloads.per_page;
    this.page.song.length = res.payloads.total;
    this.songPaginator._intl.itemsPerPageLabel = 'Song per page';
  }

  room(res) {
    this.data.rooms = res.payloads.data;
    this.roomClearSelect(this.data.rooms);
    this.source.rooms = new MatTableDataSource(this.data.rooms);
  }

  call(res) {
    this.data.calls = res.payloads.data;
    this.source.calls = new MatTableDataSource(this.data.calls);
  }

  songPageEvent(page) {
    if (this.form.search.song) {
      this.param.search.page = page.pageIndex + 1;
      this.songService.getSearch(this.param.search).subscribe(res => this.songSearch(res), error => console.log(error));
    } else {
      this.param.song.start = page.pageSize * page.pageIndex;
      this.param.song.length = page.pageSize;
      this.songService.getSong(this.param.song).subscribe(res => this.songRefresh(res), error => console.log(error));
    }
  }

  songSearch(res) {
    const data = {
      payloads: res.payloads.results.song
    };
    this.songRefresh(data);
  }

  songRefresh(res) {
    this.data.songs = res.payloads.data;
    this.source.songs = new MatTableDataSource(this.data.songs);
    if (this.form.search.song) {
      this.page.song.pageSizeOptions = [10];
    } else {
      this.page.song.pageSizeOptions = [100, 50, 25, 10];
    }
    this.page.song.pageSize = res.payloads.per_page;
    this.page.song.length = res.payloads.total;
  }

  roomRefresh(res) {
    this.data.rooms = res.payloads.data;
    this.source.rooms = new MatTableDataSource(this.data.rooms);
    if (this.data.room.session) {
      this.roomSelect(this.data.rooms.find((v, k) => v.active_session_id === this.data.room.session));
    }
  }

  roomPlaylist(res) {
    this.data.playlists = res.payloads.data.filter((v, k) => v.pivot.is_played === 0);
    this.data.histories = res.payloads.data.filter((v, k) => v.pivot.is_played === 1);
    this.source.playlists = new MatTableDataSource(this.data.playlists);
    this.source.histories = new MatTableDataSource(this.data.histories);
  }

  roomRefreshPlaylist(res) {
    this.data.playlists = res.payloads.data.filter((v, k) => v.pivot.is_played === 0);
    this.data.histories = res.payloads.data.filter((v, k) => v.pivot.is_played === 1);
    this.source.playlists.connect().next(this.data.playlists);
    this.source.histories.connect().next(this.data.histories);
    this.source.playlists.data = this.data.playlists;
    this.source.histories.data = this.data.histories;
  }

  roomSelect(data) {
    this.roomClearSelect(this.data.rooms);
    const index = this.data.rooms.indexOf(data);
    this.data.room.selected[index] = !this.data.room.selected[index];
    this.data.room.name = data.active_session_id ? data.name : '';
    this.data.room.session = data.active_session_id;
    this.data.room.token = data.token;
    if (this.data.room.session) {
      this.roomService.getPlaylist(this.data.room.token).subscribe(res => this.roomPlaylist(res), error => console.log(error));
      this.presenceChannel(this.data.room.session);
    } else {
      this.data.playlists = [];
      this.data.histories = [];
      this.source.playlists = [];
      this.source.histories = [];
      console.log('Room session not active');
    }
  }

  callSelect(data) {
    this.data.call.id = data.room_id;
    this.data.call.from = data.call_type;
    this.roomService.postCall(this.data.call).subscribe(res => console.log(res), error => console.log(error));
    this.roomSelect(this.data.rooms.find((v, k) => v.id === data.room_id));
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
    if (this.data.room.session) {
      this.data.player.token = this.data.room.token;
      this.data.player.play = true;
      this.playerService.player(this.data.player).subscribe(res => console.log(res), error => console.log(error));
    }
  }

  songStop() {
    if (this.data.room.session) {
      this.data.player.token = this.data.room.token;
      this.data.player.play = false;
      this.playerService.player(this.data.player).subscribe(res => console.log(res), error => console.log(error));
    }
  }

  songRepeat() {
    if (this.data.room.session) {
      this.data.player.token = this.data.room.token;
      this.data.player.repeat = this.data.player.repeat ? false : true;
      this.playerService.player(this.data.player).subscribe(res => console.log(res), error => console.log(error));
    }
  }

  roomClearSelect(data) {
    this.data.song.url = '';
    this.data.room.selected = [];
    data.forEach((v, k) => {
      this.data.room.selected[k] = this.selected;
    });
  }

  playlistDrop(event: CdkDragDrop < string[] > ) {
    const prevIndex = event.item.data;
    this.data.playlists = this.source.playlists.data;
    moveItemInArray(this.source.playlists.data, prevIndex, event.currentIndex);
    this.table.renderRows();
    if (prevIndex[0] === 0 || event.currentIndex === 0) {
      this.songStop();
    }
    this.source.playlists.connect().next(this.data.playlists);
    this.source.playlists.data = this.data.playlists;
    this.data.room.play = false;
    this.roomPostPlaylist(this.data.playlists);
  }

  addSongToPlaylist(data) {
    if (this.data.room.session) {
      this.data.room.play = false;
      const playlist = this.data.playlists.filter((v, k) => v.id === data.id);
      const history = this.data.histories.filter((v, k) => v.id === data.id);
      if (playlist.length) { return; }
      if (history.length) {
        this.data.histories = this.data.histories.filter((v, k) => v.id !== data.id);
        this.source.histories.connect().next(this.data.histories);
        this.source.histories.data = this.data.histories;
      }
      this.data.playlists.push(data);
      this.source.playlists.connect().next(this.data.playlists);
      this.source.playlists.data = this.data.playlists;
      this.roomPostPlaylist(this.data.playlists);
    } else {
      console.log('Room session not active');
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
      if (this.data.room.play) {
        this.data.room.playlist = {
          song_id: v.id,
          is_played: (data.length - 1) === k ? 1 : 0,
          order_num: (data.length - 1) === k ? this.data.histories.length : k,
          count_play: 1
        };
      } else {
        this.data.room.playlist = {
          song_id: v.id,
          is_played: 0,
          order_num: k,
          count_play: 1
        };
      }
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

  deleteSongFromPlaylist(index) {
    this.data.room.play = false;
    this.data.playlists = this.data.playlists.filter((v, k) => k !== index);
    this.source.playlists.connect().next(this.data.playlists);
    this.source.playlists.data = this.data.playlists;
    if (index === 0) {
      this.songStop();
    }
    this.roomPostPlaylist(this.data.playlists);
  }

  privateChannel() {
    window.Echo.private('room').listen('RoomStatusChanged', rooms => {
      console.log('event RoomStatusChanged', rooms);
      this.roomService.getRoom(this.param.room).subscribe(res => this.roomRefresh(res), error => console.log(error));
    }).listen('Calling', room => {
      console.log('Calling room', room);
      if (room.to !== 'operator') { return; }
      this.roomService.getCall().subscribe(res => this.call(res), error => console.log(error));
    });
  }

  presenceChannel(sessionId) {
    window.Echo.join(`room-playlist.${sessionId}`).listen('RoomPlaylist', (rooms) => {
      this.roomService.getPlaylist(this.data.room.token).subscribe(res => this.roomRefreshPlaylist(res), error => console.log(error));
    });
  }

  leavePresenceChannel(sessionId) {
    window.Echo.leave(`room-playlist.${sessionId}`);
  }

  formSearch() {
    this.songPaginator.pageIndex = 0;
    this.param.song.start = 0;
    if (this.form.search.song) {
      delete this.param.search.page;
      this.data.search.q = this.form.search.song;

      if (this.form.search.artist) {
        this.data.search.artist = this.form.search.artist;
      } else {
        delete this.data.search.artist;
        delete this.param.search.artist;
      }

      if (this.form.search.language) {
        this.data.search.lang =  this.form.search.language;
      } else {
        delete this.data.search.lang;
        delete this.param.search.lang;
      }

      // tslint:disable-next-line: forin
      for (const key in this.data.search) {
        this.param.search[key] = this.data.search[key];
      }

      this.songService.getSearch(this.param.search).subscribe(res => this.songSearch(res), error => console.log(error));
    } else {
      this.form.search.new = this.form.search.new ? 1 : 0;

      // tslint:disable-next-line: forin
      for (const key in this.form.search) {
        this.param.song[key] = this.form.search[key];
      }

      this.songService.getSong(this.param.song).subscribe(res => this.songRefresh(res), error => console.log(error));
    }
  }

  formSearchClear() {
    delete this.param.song.song;
    delete this.param.song.artist;
    delete this.param.song.language;
    delete this.param.song.new;
    this.songPaginator.pageIndex = 0;
    this.param.song.start = 0;
    this.form.search.song = '';
    this.form.search.artist = '';
    this.form.search.language = '';
    this.form.search.new = 0;
    this.songService.getSong(this.form.search).subscribe(res => this.songRefresh(res), error => console.log(error));
  }

}
