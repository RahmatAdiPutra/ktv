import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SongService } from 'src/app/services/song.service';
import { PusherService } from 'src/app/services/pusher.service';
import { RoomService } from 'src/app/services/room.service';

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
  videoUrl: any = '';

  @ViewChild(MatPaginator) songPaginator: MatPaginator;
  @ViewChild('table') table: MatTable<string[]>;
  @ViewChild('videoSource') videoSource;

  constructor(
    private pusherService: PusherService,
    private songService: SongService,
    private roomService: RoomService) {

    this.data.playlists = [];
    this.data.histories = [];
    this.data.room = {};
    this.data.call = {};
    this.page.song = {};
    this.param.song = {};
    this.param.room = {};
    this.form.search = {};

    this.column.songs = ['action', 'title', 'artist', 'genre', 'language'];
    this.column.playlists = ['action', 'title', 'artist'];
    this.column.histories = ['title', 'artist'];
    this.column.rooms = ['name', 'status', 'ip_address'];
    this.column.calls = ['action', 'name', 'guest'];

    this.source.histories = new MatTableDataSource(this.data.histories);

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
    this.source.songs = new MatTableDataSource(res.payloads.data);
    this.source.songs.paginator = this.songPaginator;
    this.page.song.pageSizeOptions = [100, 50, 25, 10];
    this.page.song.pageSize = res.payloads.per_page;
    this.page.song.length = res.payloads.total;
    this.songPaginator._intl.itemsPerPageLabel = 'Song per page';
  }

  room(res) {
    this.roomClearSelect(res.payloads.data);
    this.source.rooms = new MatTableDataSource(res.payloads.data);
  }

  call(res) {
    this.source.calls = new MatTableDataSource(res.payloads.data);
  }

  video(data) {
    this.videoUrl = 'http://localhost/' + data.file_path;
  }

  songPageEvent(page) {
    this.param.song.start = page.pageSize * page.pageIndex;
    this.param.song.length = page.pageSize;
    this.songService.getSong(this.param.song).subscribe(res => this.songRefresh(res), error => console.log(error));
  }

  songRefresh(res) {
    this.source.songs.connect().next(res.payloads.data);
    this.page.song.pageSize = res.payloads.per_page;
    this.page.song.length = res.payloads.total;
  }

  roomRefresh(res) {
    this.source.rooms = new MatTableDataSource(res.payloads.data);
    this.roomSelect(this.source.rooms.data.find((v, k) => v.active_session_id === this.data.room.session));
  }

  roomPlaylist(res) {
    this.data.playlists = res.payloads.data.songs;
    this.source.playlists = new MatTableDataSource(this.data.playlists);
  }

  roomRefreshPlaylist(res) {
    this.source.playlists.connect().next(res.payloads.data.songs);
  }

  roomSelect(data) {
    if (typeof data === 'undefined') { return; }
    this.roomClearSelect(this.source.rooms.data);
    const index = this.source.rooms.data.indexOf(data);
    this.data.room.selected[index] = !this.data.room.selected[index];
    this.data.room.name = data.active_session_id ? data.name : '';
    this.data.room.session = data.active_session_id;
    if (this.data.room.session) {
      this.roomService.getPlaylist(this.data.room.session).subscribe(res => this.roomPlaylist(res), error => console.log(error));
      this.presenceChannel(this.data.room.session);
    } else {
      this.data.playlists = [];
      this.source.playlists = [];
      console.log('Room session not active');
    }
  }

  callSelect(data) {
    // console.log(data);
    this.data.call.id = data.room_id;
    this.data.call.from = data.call_type;
    this.roomService.postCall(this.data.call).subscribe(res => console.log(res), error => console.log(error));
    this.roomSelect(this.source.rooms.data.find((v, k) => v.id === data.room_id));
  }

  roomClearSelect(data) {
    this.data.room.selected = [];
    data.forEach((v, k) => {
      this.data.room.selected[k] = this.selected;
    });
  }

  playlistDrop(event: CdkDragDrop<string[]>) {
    const prevIndex = event.item.data;
    moveItemInArray(this.source.playlists.data, prevIndex, event.currentIndex);
    this.table.renderRows();
    this.data.playlists = this.source.playlists.data;
    this.roomPostPlaylist(this.data.playlists);
  }

  addSongToPlaylist(data) {
    if (this.data.room.session) {
      const allow = this.source.playlists.data.filter((v, k) => v.id === data.id);
      if (allow.length) {
        return false;
      }
      this.data.playlists.push(data);
      this.source.playlists.connect().next(this.data.playlists);
      this.roomPostPlaylist(this.data.playlists);
    } else {
      console.log('Room session not active');
    }
  }

  roomPostPlaylist(data) {
    this.data.room.playlists = {};
    this.data.room.playlists.room_session_id = this.data.room.session;
    this.data.room.addPlaylists = [];
    data.forEach((v, k) => {
      this.data.room.playlist = {
        song_id: v.id,
        is_played: 0,
        order_num: k,
        count_play: 1
      };
      this.data.room.addPlaylists.push(this.data.room.playlist);
    });
    this.data.room.playlists.playlist = this.data.room.addPlaylists;
    this.roomService.postPlaylist(this.data.room.playlists).subscribe(res => console.log(res), error => console.log(error));
  }

  deleteSongFromPlaylist(index) {
    this.source.playlists.data = this.source.playlists.data.filter((v, k) => k !== index);
    this.data.playlists = this.source.playlists.data;
    this.roomPostPlaylist(this.data.playlists);
  }

  privateChannel() {
    window.Echo.private('room').listen('RoomStatusChanged', rooms => {
      console.log('event RoomStatusChanged', rooms);
      this.roomService.getRoom(this.param.room).subscribe(res => this.roomRefresh(res), error => console.log(error));
    }).listen('Calling', room => {
      console.log('Calling room', room);
      if (room.to !== 'operator') {
        return;
      }
      this.roomService.getCall().subscribe(res => this.call(res), error => console.log(error));
    });
  }

  presenceChannel(sessionId) {
    window.Echo.join(`room-playlist.${sessionId}`).listen('RoomPlaylist', (rooms) => {
      this.roomService.getPlaylist(this.data.room.session).subscribe(res => this.roomRefreshPlaylist(res), error => console.log(error));
    });
  }

  leavePresenceChannel(sessionId) {
    window.Echo.leave(`room-playlist.${sessionId}`);
  }

  formSearch() {
    this.form.search.new = this.form.search.new ? 1 : 0;
    // tslint:disable-next-line: forin
    for (const key in this.form.search) {
      this.param.song[key] = this.form.search[key];
    }
    this.songService.getSong(this.form.search).subscribe(res => this.songRefresh(res), error => console.log(error));
  }

  formSearchClear() {
    this.form.search.song = '';
    this.form.search.artist = '';
    this.form.search.language = '';
    this.form.search.new = 0;
    this.songService.getSong(this.form.search).subscribe(res => this.songRefresh(res), error => console.log(error));
  }

}
