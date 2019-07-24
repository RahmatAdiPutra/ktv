import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
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
  selects: any = {};
  params: any = {};
  sources: any = {};
  columns: any = {};
  pages: any = {};
  order: any = {};
  selected = false;
  videoUrl: any = '';

  @ViewChild(MatPaginator) songPaginator: MatPaginator;
  @ViewChild(MatSort) songSort: MatSort;
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
    this.pages.songs = {};
    this.params.songs = {};
    this.params.rooms = {};

    this.columns.songs = ['action', 'title', 'artist', 'genre', 'language'];
    this.columns.playlists = ['action', 'title', 'artist'];
    this.columns.histories = ['title', 'artist'];
    this.columns.rooms = ['name', 'status', 'ip_address'];
    this.columns.calls = ['action', 'name', 'guest'];

    this.selects.languages = [
      { name: 'English' },
      { name: 'Indonesia' },
      { name: 'Jepang' },
      { name: 'Korea' },
      { name: 'Mandarin' }
    ];

    this.sources.histories = new MatTableDataSource(this.data.histories);

    this.pusherService.connect();
    this.privateChannel();
  }

  ngOnInit() {
    this.params.songs.length = 100;
    this.params.rooms.orderColumn = '2';
    this.params.rooms.orderDir = 'asc';
    this.songService.getSong(this.params.songs).subscribe(res => this.song(res), error => console.log(error));
    this.roomService.getRoom(this.params.rooms).subscribe(res => this.room(res), error => console.log(error));
    this.roomService.getCall().subscribe(res => this.call(res), error => console.log(error));
  }

  song(res) {
    this.sources.songs = new MatTableDataSource(res.payloads.data);
    this.sources.songs.paginator = this.songPaginator;
    this.sources.songs.sort = this.songSort;
    this.pages.songs.pageSizeOptions = [100, 50, 25, 10];
    this.pages.songs.pageSize = res.payloads.per_page;
    this.pages.songs.length = res.payloads.total;
    this.songPaginator._intl.itemsPerPageLabel = 'Song per page';
  }

  room(res) {
    this.roomClearSelect(res.payloads.data);
    this.sources.rooms = new MatTableDataSource(res.payloads.data);
  }

  call(res) {
    this.sources.calls = new MatTableDataSource(res.payloads.data);
  }

  video(data) {
    console.log(data);
    this.videoUrl = 'http://localhost/' + data.file_path;
    console.log(this.videoSource);
    this.videoSource.nativeElement.setAttribute('src', this.videoUrl);
    // this.videoSource.nativeElement.onload();
  }

  songPageEvent(page) {
    this.params.songs.start = (page.pageSize * page.pageIndex) + 1;
    this.params.songs.length = page.pageSize;
    this.songService.getSong(this.params.songs).subscribe(res => this.songRefresh(res), error => console.log(error));
  }

  songRefresh(res) {
    this.sources.songs.connect().next(res.payloads.data);
  }

  roomRefresh(res) {
    this.sources.rooms = new MatTableDataSource(res.payloads.data);
  }

  roomPlaylist(res) {
    this.data.playlists = res.payloads.data.songs;
    this.sources.playlists = new MatTableDataSource(this.data.playlists);
  }

  roomSelect(data) {
    // console.log(data);
    this.roomClearSelect(this.sources.rooms.data);
    const index = this.sources.rooms.data.indexOf(data);
    this.data.room.selected[index] = !this.data.room.selected[index];
    this.data.room.name = data.active_session_id ? data.name : '';
    this.data.room.session = data.active_session_id;
    if (this.data.room.session) {
      this.roomService.getPlaylist(this.data.room.session).subscribe(res => this.roomPlaylist(res), error => console.log(error));
      this.presenceChannel(this.data.room.session);
    } else {
      this.data.playlists = [];
      this.sources.playlists = [];
      console.log('Room session not active');
    }
  }

  callSelect(data) {
    console.log(data);
    this.data.call.id = data.room_id;
    this.data.call.from = data.call_type;
    this.roomService.postCall(this.data.call).subscribe(res => console.log(res), error => console.log(error));
    this.roomSelect(this.sources.rooms.data.find((v, k) => v.id === data.room_id));
  }

  roomClearSelect(data) {
    this.data.room.selected = [];
    data.forEach((v, k) => {
      this.data.room.selected[k] = this.selected;
    });
  }

  playlistDrop(event: CdkDragDrop<string[]>) {
    const prevIndex = event.item.data;
    moveItemInArray(this.sources.playlists.data, prevIndex, event.currentIndex);
    this.table.renderRows();
    this.data.playlists = this.sources.playlists.data;
    this.roomPostPlaylist(this.data.playlists);
  }

  addSongToPlaylist(data) {
    if (this.data.room.session) {
      const allow = this.sources.playlists.data.filter((v, k) => v.id === data.id);
      if (allow.length) {
        return false;
      }
      this.data.playlists.push(data);
      this.sources.playlists.connect().next(this.data.playlists);
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
    this.sources.playlists.data = this.sources.playlists.data.filter((v, k) => k !== index);
    this.data.playlists = this.sources.playlists.data;
    this.roomPostPlaylist(this.data.playlists);
  }

  privateChannel() {
    window.Echo.private('room').listen('RoomStatusChanged', rooms => {
      console.log('event RoomStatusChanged', rooms);
      this.roomService.getRoom(this.params.rooms).subscribe(res => this.roomRefresh(res), error => console.log(error));
      this.roomService.getCall().subscribe(res => this.call(res), error => console.log(error));
    }).listen('Calling', room => {
      console.log('Calling room', room);
      if (room.to !== 'operator') {
        // hanya listening panggilan untuk operator
        return;
      }

      this.roomService.getCall().subscribe(res => this.call(res), error => console.log(error));
    });
  }

  presenceChannel(sessionId) {
    window.Echo.join(`room-playlist.${sessionId}`).listen('RoomPlaylist', (rooms) => {
      this.roomService.getPlaylist(this.data.room.session).subscribe(res => this.roomPlaylist(res), error => console.log(error));
    });
  }

  leavePresenceChannel(sessionId) {
    window.Echo.leave(`room-playlist.${sessionId}`);
  }

}
