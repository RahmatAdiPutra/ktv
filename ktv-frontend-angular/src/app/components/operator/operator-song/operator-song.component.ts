import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-operator-song',
  templateUrl: './operator-song.component.html',
  styleUrls: [
    './operator-song.component.css',
    '../operator.component.css'
  ]
})
export class OperatorSongComponent implements OnInit {

  @Input() data: any = {};
  @Input() select: any = {};
  @Input() source: any = {};
  @Input() column: any = {};
  @Input() page: any = {};
  @Input() form: any = {};
  @Input() formSearch: Function;
  @Input() formSearchClear: Function;
  @Input() songSelect: Function;
  @Input() roomPlaylistAddSong: Function;
  @Input() songPageEvent: Function;

  @Input() songPaginator: any = {};
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() ngOnSongPaginator: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.songPaginator = this.matPaginator;
    this.ngOnSongPaginator.emit(this.songPaginator);
  }

}
