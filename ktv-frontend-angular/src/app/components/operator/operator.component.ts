import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../../../environments/environment';
import { PusherService } from 'src/app/services/pusher.service';
import { OperatorService } from 'src/app/services/operator.service';
import { SongService } from 'src/app/services/song.service';
import { MatDialog } from '@angular/material';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

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
    public dialog: MatDialog,
    private pusherService: PusherService,
    private operator: OperatorService,
    private songService: SongService) {
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

    this.column.playlists = ['action', 'title', 'artist', 'is_play'];
    this.column.songs = ['action', 'title', 'artist', 'genre', 'language'];
    this.column.rooms = ['name', 'status', 'guest_name', 'ip_address'];
    this.column.calls = ['action', 'name', 'guest'];

    this.data.song.server = environment.hostVideo;
    this.data.song.url = '';

    this.channelRoomCall();
  }

  ngOnInit() {
    // this.param.song.length = 25;
    // this.param.song.orderColumn = '3';
    // this.param.song.orderDir = 'desc';
    // this.param.room.orderColumn = '2';
    // this.param.room.orderDir = 'asc';
    this.operator.song().subscribe(res => this.song(res), error => console.log(error));
    this.operator.language().subscribe(res => this.language(res), error => console.log(error));
    this.operator.room().subscribe(res => this.room(res), error => console.log(error));
    this.operator.call().subscribe(res => this.call(res), error => console.log(error));
  }

  language(res) {
    this.select.languages = res.payloads;
  }

  song(res) {
    this.data.songs = res.payloads.data;
    this.source.songs = new MatTableDataSource(this.data.songs);
    this.source.songs.paginator = this.songPaginator;
    // this.page.song.pageSizeOptions = [100, 50, 25, 10];
    // this.page.song.pageSizeOptions = [res.payloads.per_page];
    this.page.song.pageSize = res.payloads.per_page;
    this.page.song.length = res.payloads.total;
    this.page.song.current_page = res.payloads.current_page;
    this.songPaginator._intl.itemsPerPageLabel = 'Song per page';
  }

  room(res) {
    this.data.rooms = res.payloads.data;
    this.roomSelectClear(this.data.rooms);
    this.source.rooms = new MatTableDataSource(this.data.rooms);
  }

  call(res) {
    this.data.calls = res.payloads.data;
    this.source.calls = new MatTableDataSource(this.data.calls);
  }

  songPageEvent(page) {
    if (this.form.search.song) {
      // this.param.search.page = page.pageIndex + 1;
      // this.songService.getSearch(this.param.search).subscribe(res => this.songSearch(res), error => console.log(error));
    } else {
      // this.param.song.start = page.pageSize * page.pageIndex;
      // this.param.song.length = page.pageSize;
      this.operator.song(page.pageIndex + 1).subscribe(res => this.songRefresh(res), error => console.log(error));
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
      // this.page.song.pageSizeOptions = [10];
    } else {
      // this.page.song.pageSizeOptions = [100, 50, 25, 10];
    }
    this.page.song.pageSize = res.payloads.per_page;
    this.page.song.length = res.payloads.total;
  }

  formSearch() {
    console.log(this.form.search);
    if (this.form.search.song) {
      // this.operator.search(this.form.search.song, this.form.search.language).subscribe(
      //   res => console.log(res),
      //   error => console.log(error)
      // );
      this.operator.search(this.form.search.song, this.form.search.language).subscribe(
        res => this.songSearch(res),
        error => console.log(error)
      );
    }
  }

  roomRefresh(res) {
    this.data.rooms = res.payloads.data;
    this.source.rooms = new MatTableDataSource(this.data.rooms);
    if (this.data.room.session) {
      this.roomSelect(this.data.rooms.find((v, k) => v.active_session_id === this.data.room.session));
    }
  }

  roomPlaylist(res) {
    this.data.player.playing = res.payloads.room.player.playing;
    this.source.playlists = new MatTableDataSource(res.payloads.room.playlist);
  }

  roomSelect(data) {
    this.roomSelectClear(this.data.rooms);
    const index = this.data.rooms.indexOf(data);
    this.data.room.selected[index] = !this.data.room.selected[index];
    this.data.room.name = data.active_session_id ? data.name : '';
    this.data.room.session = data.active_session_id;
    this.data.room.token = data.token;
    this.data.room.key = data.activation_key;
    if (this.data.room.session) {
      this.operator.playlist(this.data.room.key).subscribe(res => this.roomPlaylist(res), error => console.log(error));
      this.channelRoomPlaylist(this.data.room);
    } else {
      console.log('Room session not active');
    }
  }

  callSelect(data) {
    this.operator.callRespond(data.room.activation_key).subscribe(res => console.log(res), error => console.log(error));
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

  songPlaylistSelect(data) {
    if (this.data.room.session) {
      this.data.room.songId = data.id;
      this.operator.playing(this.data.room).subscribe(res => console.log(res), error => console.log(error));
    }
  }

  playToggle() {
    if (this.data.room.session) {
      this.operator.playToggle(this.data.room.key).subscribe(res => console.log(res), error => console.log(error));
    }
  }

  roomSelectClear(data) {
    this.data.song.url = '';
    this.data.room = {};
    this.data.player = {};
    this.source.playlists = [];
    this.data.room.selected = [];
    data.forEach((v, k) => {
      this.data.room.selected[k] = this.selected;
    });
  }

  playlistDrop(event: CdkDragDrop < string[] > ) {
    // table
    const prevIndex = event.item.data;
    moveItemInArray(this.source.playlists.data, prevIndex, event.currentIndex);
    this.table.renderRows();

    // post to server
    this.data.room.dataList = [];
    this.source.playlists.data.forEach((v) => {
      this.data.room.dataList.push(v.id);
    });
    this.operator.playlistSongReorder(this.data.room).subscribe(res => console.log(res), error => console.log(error));
  }

  addSongToPlaylist(data) {
    if (this.data.room.session) {
      this.data.room.songId = data.id;
      this.operator.playlistSongAdd(this.data.room).subscribe(res => console.log(res), error => console.log(error));
    } else {
      console.log('Room session not active');
    }
  }

  deleteAllSongFromPlaylist() {
    if (this.data.room.session) {
        const dialogRef = this.dialog.open(DialogDeleteComponent);
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed', result);
          if (result === true) {
            this.source.playlists.data.forEach((v) => {
              console.log(v);
              this.deleteSongFromPlaylist(v);
            });
          }
        });
    } else {
      console.log('Room session not active');
    }
  }

  deleteSongFromPlaylist(data) {
    this.data.room.songListId = data.id;
    this.operator.playlistSongDelete(this.data.room).subscribe(res => console.log(res), error => console.log(error));
  }

  channelRoomCall() {
    window.Echo.channel(`rooms`)
      .listen('.respond.operator', message => {
        console.log('respond rooms', message);
        this.operator.call().subscribe(res => this.call(res), error => console.log(error));
      }).listen('.call.operator', message => {
        console.log('call rooms', message);
        this.operator.call().subscribe(res => this.call(res), error => console.log(error));
      });
  }

  channelRoomPlaylist(data) {
    // listing playlist change
    window.Echo.channel(`session.${data.token}`)
      .listen('.playlist.updated', playlist => {
        console.log(playlist);
        this.source.playlists.connect().next(playlist);
      })
      .listen('.player.stateUpdated', state => {
        console.log('player.stateUpdated ' + state.action);
        this.data.player.playing = state.action;
      });
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

  test() {
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

}
