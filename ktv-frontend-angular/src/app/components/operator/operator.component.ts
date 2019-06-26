import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

export interface Songs {
  title: string;
  artist: string;
  genre: string;
  language: string;
}

export interface Rooms {
  name: string;
  status: string;
}

const DATA_SONG: Songs[] = [
  {title: 'a', artist: 'Hydrogen', genre: 'POP', language: 'H'},
  {title: 'b', artist: 'Helium', genre: 'POP', language: 'He'},
  {title: 'c', artist: 'Lithium', genre: 'POP', language: 'Li'},
  {title: 'd', artist: 'Beryllium', genre: 'POP', language: 'Be'},
  {title: 'e', artist: 'Boron', genre: 'POP', language: 'B'},
  {title: 'f', artist: 'Carbon', genre: 'POP', language: 'C'},
  {title: 'g', artist: 'Nitrogen', genre: 'POP', language: 'N'},
  {title: 'h', artist: 'Oxygen', genre: 'POP', language: 'O'},
  {title: 'i', artist: 'Fluorine', genre: 'POP', language: 'F'},
  {title: 'j', artist: 'Neon', genre: 'POP', language: 'Ne'},
  {title: 'k', artist: 'Hydrogen', genre: 'POP', language: 'H'},
  {title: 'l', artist: 'Helium', genre: 'POP', language: 'He'},
  {title: 'm', artist: 'Lithium', genre: 'POP', language: 'Li'},
  {title: 'n', artist: 'Beryllium', genre: 'POP', language: 'Be'},
  {title: 'o', artist: 'Boron', genre: 'POP', language: 'B'},
  {title: 'p', artist: 'Carbon', genre: 'POP', language: 'C'},
  {title: 'q', artist: 'Nitrogen', genre: 'POP', language: 'N'},
  {title: 'r', artist: 'Oxygen', genre: 'POP', language: 'O'},
  {title: 's', artist: 'Fluorine', genre: 'POP', language: 'F'},
  {title: 't', artist: 'Neon', genre: 'POP', language: 'Ne'},
  {title: 'u', artist: 'Helium', genre: 'POP', language: 'He'},
  {title: 'v', artist: 'Lithium', genre: 'POP', language: 'Li'},
  {title: 'w', artist: 'Beryllium', genre: 'POP', language: 'Be'},
  {title: 'x', artist: 'Boron', genre: 'POP', language: 'B'},
  {title: 'y', artist: 'Carbon', genre: 'POP', language: 'C'},
  {title: 'z', artist: 'Nitrogen', genre: 'POP', language: 'N'},
];

const DATA_ROOM: Rooms[] = [
  {name:'ktv01', status:'available'},
  {name:'ktv02', status:'available'},
  {name:'ktv03', status:'available'},
  {name:'ktv04', status:'available'},
  {name:'ktv05', status:'available'},
  {name:'ktv06', status:'available'},
  {name:'ktv07', status:'available'},
  {name:'ktv08', status:'available'},
  {name:'ktv09', status:'available'},
  {name:'ktv10', status:'available'},
  {name:'ktv11', status:'available'},
  {name:'ktv12', status:'available'},
  {name:'ktv13', status:'available'},
  {name:'ktv14', status:'available'},
  {name:'ktv15', status:'available'},
  {name:'ktv16', status:'available'},
  {name:'ktv17', status:'available'},
  {name:'ktv18', status:'available'},
  {name:'ktv19', status:'available'},
  {name:'ktv20', status:'available'},
];

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit {

  options = [
    {name: 'English'},
    {name: 'Indonesia'},
    {name: 'Jepang'},
    {name: 'Korea'},
    {name: 'Mandarin'}
  ];

  songColumns: string[] = ['select', 'title', 'artist', 'genre', 'language'];
  playlistColumns: string[] = ['select', 'no', 'title', 'artist'];
  roomColumns: string[] = ['no', 'name', 'status'];

  songSource = new MatTableDataSource<Songs>(DATA_SONG);
  playlistSource = DATA_SONG;
  roomSource = DATA_ROOM;
  
  selection = new SelectionModel<Songs>(true, []);

  playlistHeight: any;
  playerHeight: any;

  @ViewChild(MatPaginator) songPaginator: MatPaginator;
  @ViewChild(MatSort) songSort: MatSort;
  @ViewChild('targetPlaylist') playlistElement: any;
  @ViewChild('targetPlayer') playerElement: any;

  constructor() { }

  ngOnInit() {
    this.songSource.paginator = this.songPaginator;
    this.songSource.sort = this.songSort;
    this.songPaginator._intl.itemsPerPageLabel = 'Songs per page';

    this.playlistHeight = this.playlistElement.nativeElement.offsetHeight - 57;
    this.playerHeight = this.playerElement.nativeElement.offsetHeight - 57;

    this.playlistHeight = {
      height: this.playlistHeight + "px"
    }

    this.playerHeight = {
      height: this.playerHeight + "px"
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.songSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.songSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Songs): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
  }

}
