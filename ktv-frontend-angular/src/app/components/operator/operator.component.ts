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
  ip_address: string;
}

export interface RoomCalling {
  name: string;
  guest: string;
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

  options = [
    {name: 'English'},
    {name: 'Indonesia'},
    {name: 'Jepang'},
    {name: 'Korea'},
    {name: 'Mandarin'}
  ];

  songColumns: string[] = ['select', 'title', 'artist', 'genre', 'language'];
  playlistColumns: string[] = ['select', 'title', 'artist'];
  roomColumns: string[] = ['name', 'status', 'ip_address'];
  roomCallColumns: string[] = ['name', 'guest', 'action'];

  songSource = new MatTableDataSource<Songs>(DATA_SONG);
  playlistSource = DATA_SONG;
  roomSource = DATA_ROOM;
  roomCallSource = DATA_ROOM_CALL;
  
  selection = new SelectionModel<Songs>(true, []);

  @ViewChild(MatPaginator) songPaginator: MatPaginator;
  @ViewChild(MatSort) songSort: MatSort;

  constructor() { }

  ngOnInit() {
    this.songSource.paginator = this.songPaginator;
    this.songSource.sort = this.songSort;
    this.songPaginator._intl.itemsPerPageLabel = 'Songs per page';
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
