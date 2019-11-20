import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';

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
  @Input() songSort: any = {};
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() ngOnSongPaginator: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() ngOnSongSort: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.songPaginator = this.matPaginator;
    this.songSort = this.sort;
    this.ngOnSongPaginator.emit(this.songPaginator);
    this.ngOnSongSort.emit(this.songSort);
  }

}
