import { Component, OnInit, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-operator-playlist',
  templateUrl: './operator-playlist.component.html',
  styleUrls: [
    './operator-playlist.component.css',
    '../operator.component.css'
  ],
  animations: [
    trigger('elementDetailPlaylist', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class OperatorPlaylistComponent implements OnInit {

  @Input() data: any = {};
  @Input() select: any = {};
  @Input() source: any = {};
  @Input() column: any = {};
  @Input() form: any = {};
  @Input() formSearch: Function;
  @Input() formSearchClear: Function;
  @Input() songSelect: Function;
  @Input() roomPlaylistAddSong: Function;
  @Input() roomPlaylistAddAllSong: Function;

  constructor() { }

  ngOnInit() {
  }

}
