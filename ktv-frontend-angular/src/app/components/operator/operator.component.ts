import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SongService } from 'src/app/services/song.service';
import { PusherService } from 'src/app/services/pusher.service';

export interface Rooms {
  name: string;
  status: string;
  ip_address: string;
}

export interface RoomCalling {
  name: string;
  guest: string;
}

const DATA_ROOM: Rooms[] = [
  {name:'ktv01', status:'available', ip_address:'192.168.0.1'},
  {name:'ktv02', status:'available', ip_address:'192.168.0.2'},
  {name:'ktv03', status:'available', ip_address:'192.168.0.3'},
  {name:'ktv04', status:'available', ip_address:'192.168.0.4'},
  {name:'ktv05', status:'available', ip_address:'192.168.0.5'},
  {name:'ktv06', status:'available', ip_address:'192.168.0.6'},
  {name:'ktv07', status:'available', ip_address:'192.168.0.7'},
  {name:'ktv08', status:'available', ip_address:'192.168.0.8'},
  {name:'ktv09', status:'available', ip_address:'192.168.0.9'},
  {name:'ktv10', status:'available', ip_address:'192.168.0.10'},
  {name:'ktv11', status:'available', ip_address:'192.168.0.11'},
  {name:'ktv12', status:'available', ip_address:'192.168.0.12'},
  {name:'ktv13', status:'available', ip_address:'192.168.0.13'},
  {name:'ktv14', status:'available', ip_address:'192.168.0.14'},
  {name:'ktv15', status:'available', ip_address:'192.168.0.15'},
  {name:'ktv16', status:'available', ip_address:'192.168.0.16'},
  {name:'ktv17', status:'available', ip_address:'192.168.0.17'},
  {name:'ktv18', status:'available', ip_address:'192.168.0.18'},
  {name:'ktv19', status:'available', ip_address:'192.168.0.19'},
  {name:'ktv20', status:'available', ip_address:'192.168.0.20'},
  {name:'ktv21', status:'available', ip_address:'192.168.0.21'},
  {name:'ktv22', status:'available', ip_address:'192.168.0.22'},
  {name:'ktv23', status:'available', ip_address:'192.168.0.23'},
  {name:'ktv24', status:'available', ip_address:'192.168.0.24'},
  {name:'ktv25', status:'available', ip_address:'192.168.0.25'},
];

const DATA_ROOM_CALL: RoomCalling[] = [
  {name:'ktv01', guest:'joko'},
  {name:'ktv02', guest:'jaka'},
  {name:'ktv03', guest:'jarwo'},
  {name:'ktv04', guest:'budi'},
  {name:'ktv05', guest:'badi'},
  {name:'ktv06', guest:'baki'},
  {name:'ktv07', guest:'bagus'},
  {name:'ktv08', guest:'jasmi'},
  {name:'ktv09', guest:'john'},
];

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})

export class OperatorComponent implements OnInit {

  data: any = [];
  selects: any = [];
  params: any = {};
  sources: any = {};
  columns: any = {};
  pages: any = {};

  @ViewChild(MatPaginator) songPaginator: MatPaginator;
  @ViewChild(MatSort) songSort: MatSort;
  @ViewChild('table') table: MatTable<string[]>;

  constructor(private songService: SongService, private pusherService: PusherService) {
    this.data.playlists = [];
    this.data.histories = [];

    this.columns.songs = ['title', 'artist', 'genre', 'language', 'action'];
    this.columns.playlists = ['title', 'artist', 'action'];
    this.columns.histories = ['title', 'artist'];
    this.columns.rooms = ['name', 'status', 'ip_address'];
    this.columns.rooms.calls = ['name', 'guest', 'action'];

    this.selects.languages = [
      {name: 'English'},
      {name: 'Indonesia'},
      {name: 'Jepang'},
      {name: 'Korea'},
      {name: 'Mandarin'}
    ];

    this.sources.playlists = new MatTableDataSource(this.data.playlists);
    this.sources.histories = this.data.histories;
    this.sources.rooms = DATA_ROOM;
    this.sources.rooms.calls = DATA_ROOM_CALL;

    // this.pusherService.connect();
    // window.Echo.private("room").listen("RoomStatusChanged", rooms => {
    //   console.log("event RoomStatusChanged", rooms);
    // });
  }

  ngOnInit() {
    this.params.length = 100;
    this.songService.getSongs(this.params).subscribe(data => this.payloads(data), error => console.log(error));
  }

  payloads(res) {
    this.songPaginator._intl.itemsPerPageLabel = 'Songs per page';
    this.pages.pageSizeOptions = [100, 50, 25, 10];
    this.pages.pageSize = res.payloads.per_page;
    this.pages.length = res.payloads.total;

    this.sources.songs = new MatTableDataSource(res.payloads.data);
    this.sources.songs.paginator = this.songPaginator;
    this.sources.songs.sort = this.songSort;
  }

  pageEvent(page) {
    this.params.start = (page.pageSize * page.pageIndex) + 1;
    this.params.length = page.pageSize;
    this.songService.getSongs(this.params).subscribe(data => this.refreshData(data), error => console.log(error));
  }

  refreshData(res) {
    this.sources.songs.connect().next(res.payloads.data);
  }

  drop(event: CdkDragDrop<string[]>) {
    const prevIndex = event.item.data;
    moveItemInArray(this.sources.playlists.data, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  addSongToPlaylist(data) {
    this.data.playlists.push(data)
    this.sources.playlists.connect().next(this.data.playlists);
  }

  deleteSongFromPlaylist(index) {
    this.sources.playlists.data = this.sources.playlists.data.filter((v, k) => k !== index);
    this.data.playlists = this.sources.playlists.data;
  }

}
