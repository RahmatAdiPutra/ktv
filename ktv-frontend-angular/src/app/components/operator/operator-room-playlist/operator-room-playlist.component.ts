import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-operator-room-playlist',
  templateUrl: './operator-room-playlist.component.html',
  styleUrls: [
    './operator-room-playlist.component.css',
    '../operator.component.css'
  ]
})
export class OperatorRoomPlaylistComponent implements OnInit {

  @Input() data: any = {};
  @Input() source: any = {};
  @Input() column: any = {};
  @Input() roomPlaylistDrop: Function;
  @Input() roomPlaylistSelectSong: Function;
  @Input() roomPlaylistDeleteAllSong: Function;
  @Input() roomPlaylistDeleteSong: Function;
  @Input() roomPlaylistTogglePlay: Function;
  @Input() roomPlaylistToggleVocal: Function;

  @Input() table: any = {};
  @ViewChild('table') matTable: MatTable < string[] > ;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() ngOnTable: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.table = this.matTable;
    this.ngOnTable.emit(this.table);
  }

}
