import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../../../environments/environment';
import { PusherService } from 'src/app/services/pusher.service';
import { OperatorService } from 'src/app/services/operator.service';
import { MatDialog } from '@angular/material';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { DialogAllowSoundCallComponent } from '../dialog-allow-sound-call/dialog-allow-sound-call.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css'],
  animations: [
    trigger('elementDetailPlaylist', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
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
    private toast: MatSnackBar,
    private pusherService: PusherService,
    private operator: OperatorService) {
    this.data.songs = [];
    this.data.rooms = [];
    this.data.calls = [];
    this.data.audio = [];
    this.data.playlists = [];
    this.data.playlistCategory = [];

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

    this.column.songs = ['action', 'title', 'artist', 'genre', 'language'];
    this.column.rooms = ['name', 'status', 'guest_name', 'ip_address'];
    this.column.calls = ['action', 'name', 'guest'];
    this.column.playlists = ['action', 'title', 'artist', 'is_play'];
    this.column.playlistCategory = ['action', 'title', 'category', 'song'];
    this.column.playlistDetail = ['title', 'artist', 'action'];

    this.data.song.url = '';
    this.data.song.server = environment.hostVideo;

    this.data.audio = new Audio();

    this.channelRoomCall();
  }

  ngOnInit() {
    this.operator.language().subscribe(res => this.language(res), error => console.log(error));
    this.operator.category().subscribe(res => this.category(res), error => console.log(error));
    this.operator.playlist().subscribe(res => this.playlist(res), error => console.log(error));
    this.operator.song().subscribe(res => this.song(res), error => console.log(error));
    this.operator.room().subscribe(res => this.room(res), error => console.log(error));
    this.operator.call().subscribe(res => this.call(res), error => console.log(error));
  }

  language(res) {
    this.select.languages = res.payloads;
  }

  category(res) {
    this.select.categories = res.payloads;
    this.select.categories[this.select.categories.length] = {
      id: 0,
      name: 'All'
    };
    this.select.categories.sort((a, b) => {
      const x = a.name.toLowerCase();
      const y = b.name.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }

  playlist(res) {
    this.data.detailPlaylist =  res.payloads.data || null;
    this.data.playlistCategory = res.payloads.data;
    this.source.playlistCategory = new MatTableDataSource(this.data.playlistCategory);
  }

  song(res) {
    this.data.songs = res.payloads.data;
    this.source.songs = new MatTableDataSource(this.data.songs);
    this.source.songs.paginator = this.songPaginator;
    this.page.song.pageSize = res.payloads.per_page;
    this.page.song.length = res.payloads.total;
    this.page.song.current_page = res.payloads.current_page;
    this.songPaginator._intl.itemsPerPageLabel = 'Song per page';
  }

  room(res) {
    this.data.rooms = res.payloads.data.filter(data => data.active_session !== null);
    this.roomSelectClear(this.data.rooms);
    this.source.rooms = new MatTableDataSource(this.data.rooms);
    const allow = this.callGetAllowSound();
    if (!allow.length) {
      this.callSetAllowSound(this.data.rooms);
    }
  }

  call(res) {
    this.data.calls = res.payloads.data;
    this.source.calls = new MatTableDataSource(this.data.calls);
  }

  songPageEvent(page) {
    if (this.form.search) {
      this.operator.search(this.form.search, (page.pageIndex + 1)).subscribe(
        res => this.songSearch(res),
        error => console.log(error)
      );
    } else {
      this.operator.song(page.pageIndex + 1).subscribe(res => this.songRefresh(res), error => console.log(error));
    }
  }

  songSearch(res) {
    if (res.error === false) {
      const data = {
        payloads: res.payloads.results.song
      };
      this.songRefresh(data);
    }
  }

  songRefresh(res) {
    this.data.songs = res.payloads.data;
    this.source.songs = new MatTableDataSource(this.data.songs);
    this.page.song.pageSize = res.payloads.per_page;
    this.page.song.length = res.payloads.total;
  }

  songSelect(data) {
    if (data) {
      this.data.song.url = this.data.song.server + data.file_path;
    }
  }

  roomRefresh(res) {
    this.data.rooms = res.payloads.data;
    this.source.rooms = new MatTableDataSource(this.data.rooms);
    if (this.data.room.session) {
      this.roomSelect(this.data.rooms.find((v, k) => v.active_session_id === this.data.room.session));
    }
  }

  roomSelect(data) {
    this.leaveChannel();
    this.roomSelectClear(this.data.rooms);
    const index = this.data.rooms.indexOf(data);
    this.data.room.selected[index] = !this.data.room.selected[index];
    this.data.room.name = data.active_session_id ? data.name : '';
    this.data.room.session = data.active_session_id;
    this.data.room.token = data.token;
    this.data.room.key = data.activation_key;
    if (this.data.room.session) {
      this.operator.roomPlaylist(this.data.room.key).subscribe(res => this.roomPlaylist(res), error => console.log(error));
      this.channelRoomPlaylist(this.data.room);
    } else {
      this.openToast('Room session not active', '');
    }
  }

  roomSelectClear(data) {
    this.data.song.url = '';
    this.data.room = {};
    this.data.player = {};
    this.source.playlists = [];
    this.data.playlists = [];
    this.data.room.selected = [];
    data.forEach((v, k) => {
      this.data.room.selected[k] = this.selected;
    });
  }

  roomPlaylist(res) {
    this.data.player.playing = res.payloads.room.player.playing;
    this.data.playlists = res.payloads.room.playlist;
    this.source.playlists = new MatTableDataSource(this.data.playlists);
  }

  roomPlaylistSelectSong(data) {
    if (this.data.room.session) {
      this.data.room.songId = data.id;
      this.operator.roomPlaylistPlaying(this.data.room).subscribe(
        res => this.openToast('Song ' + this.data.player.playing, ''),
        error => console.log(error)
      );
    }
  }

  roomPlaylistDrop(event: CdkDragDrop < string[] > ) {
    const prevIndex = event.item.data;
    moveItemInArray(this.data.playlists, prevIndex, event.currentIndex);
    this.table.renderRows();

    this.data.room.dataList = [];
    this.data.playlists.forEach((v) => {
      this.data.room.dataList.push(v.id);
    });
    this.operator.roomPlaylistReorderSong(this.data.room).subscribe(res => res, error => console.log(error));
  }

  roomPlaylistAddSong(data) {
    if (this.data.room.session) {
      this.data.room.songId = data.id;
      this.operator.roomPlaylistAddSong(this.data.room).subscribe(
        res => this.openToast('Song added to playlist', ''),
        error => console.log(error)
      );
    } else {
      this.openToast('Room session not active', '');
    }
  }

  roomPlaylistAddAllSong(data) {
    if (this.data.room.session) {
      data.forEach((v) => {
        this.roomPlaylistAddSong(v);
      });
    } else {
      this.openToast('Room session not active', '');
    }
  }

  roomPlaylistDeleteSong(data) {
    this.data.room.songListId = data.id;
    this.operator.roomPlaylistDeleteSong(this.data.room).subscribe(
      res => this.openToast('Song deleted from playlist', ''),
      error => console.log(error)
    );
  }

  roomPlaylistDeleteAllSong() {
    if (this.data.room.session) {
      if (this.data.playlists.length) {
        const dialogRef = this.dialog.open(DialogDeleteComponent);
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {
            this.data.playlists.forEach((v) => {
              this.roomPlaylistDeleteSong(v);
            });
          }
        });
      } else {
        this.openToast('There are no songs in the playlist', '');
      }
    } else {
      this.openToast('There are no songs in the playlist', '');
    }
  }

  roomPlaylistTogglePlay() {
    if (this.data.room.session) {
      if (this.data.playlists.length) {
        this.operator.roomPlaylistTogglePlay(this.data.room.key).subscribe(
          res => this.openToast('Song ' + this.data.player.playing, ''),
          error => console.log(error)
        );
      } else {
        this.openToast('There are no songs in the playlist', '');
      }
    } else {
      this.openToast('There are no songs in the playlist', '');
    }
  }

  roomPlaylistToggleVocal() {
    if (this.data.room.session) {
      if (this.data.playlists.length) {
        this.operator.roomPlaylistToggleVocal(this.data.room.key).subscribe(
          res => this.data.player.vocal ? this.openToast('Vocal off', '') : this.openToast('Vocal on', ''),
          error => console.log(error)
        );
      } else {
        this.openToast('There are no songs in the playlist', '');
      }
    } else {
      this.openToast('There are no songs in the playlist', '');
    }
  }

  callRespond(data) {
    this.operator.callRespond(data.room.activation_key).subscribe(res => res, error => console.log(error));
    this.roomSelect(this.data.rooms.find((v, k) => v.id === data.room_id));
  }

  callToggleFab() {
    const rooms = this.data.rooms;
    const allow = JSON.parse(localStorage.getItem('allow'));
    rooms.forEach((v, k) => {
      const index = allow.map(e => e.name).indexOf(v.name);
      if (index >= 0) {
        rooms[k].allow = allow[index].allow;
      } else {
        rooms[k].allow = true;
      }
    });
    const dialogRef = this.dialog.open(DialogAllowSoundCallComponent, {
      data: rooms
    });
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        this.callSetAllowSound(result);
      }
    });
  }

  callSetAllowSound(data) {
    const allow = [];
    data.forEach((v, k) => {
      allow.push({
        name: v.name,
        allow: typeof v.allow === 'undefined' ? true : v.allow
      });
    });
    localStorage.setItem('allow', JSON.stringify(allow));
  }

  callGetAllowSound() {
    const allow = [];
    if (localStorage.getItem('allow')) {
      JSON.parse(localStorage.getItem('allow')).forEach((v, k) => {
        if (v.allow) {
          allow.push(v.name);
        }
      });
    }
    return allow;
  }

  callSound(res) {
    if (res) {
      this.data.audio.src = environment.hostVideo + 'call-operator.mp3';
      this.data.audio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
      }, false);
      this.data.audio.autoplay = true;
    } else {
      if (this.data.calls.length <= 1) {
        this.data.audio.src = '';
      }
    }
  }

  formSearch(data?) {
    if (data) {
      this.songPaginator.pageIndex = 0;
      if (this.form.search) {
        this.operator.search(this.form.search, 1).subscribe(
          res => this.songSearch(res),
          error => console.log(error)
        );
      }
    } else {
      this.operator.playlist(this.form.search).subscribe(res => this.playlist(res), error => console.log(error));
    }
  }

  formSearchClear(data?) {
    if (data) {
      this.songPaginator.pageIndex = 0;
      this.form.search.song = '';
      this.form.search.artist = '';
      this.form.search.language = '';
      this.form.search.new = false;
      this.operator.song().subscribe(res => this.songRefresh(res), error => console.log(error));
    } else {
      this.form.search.playlist = '';
      this.form.search.category = '';
      this.operator.playlist().subscribe(res => this.playlist(res), error => console.log(error));
    }
  }

  channelRoomCall() {
    window.Echo.channel(`rooms`)
      .listen('.respond.operator', message => {
        this.operator.call().subscribe(res => this.call(res), error => console.log(error));
        this.openToast(message.message, '');
        this.callSound(false);
      }).listen('.call.operator', message => {
        const allow = this.callGetAllowSound();
        this.operator.call().subscribe(res => this.call(res), error => console.log(error));
        this.openToast(message.message, '');
        if (allow.indexOf(message.message.slice(0, -17)) >= 0) {
          this.callSound(true);
        }
      });
  }

  channelRoomPlaylist(data) {
    // listing playlist change
    window.Echo.channel(`session.${data.token}`)
      .listen('.playlist.updated', playlist => {
        // console.log(playlist);
        this.data.playlists = playlist;
        this.source.playlists.connect().next(playlist);
        if (!this.data.playlists.length) {
          this.data.player.playing = 'pause';
        }
      })
      .listen('.player.stateUpdated', state => {
        // console.log(state);
        if (state.action === 'vocal') {
          this.data.player.vocal = state.state.is_karaoke;
        } else {
          this.data.player.playing = state.action;
        }
      });
  }

  leaveChannel() {
    window.Echo.leave(`session.${this.data.room.token}`);
  }

  openToast(message: string, action: string) {
    this.toast.open(message, action, {
      duration: 2000,
    });
  }

}
