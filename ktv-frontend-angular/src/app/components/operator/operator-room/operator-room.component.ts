import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-operator-room',
  templateUrl: './operator-room.component.html',
  styleUrls: [
    './operator-room.component.css',
    '../operator.component.css'
  ]
})
export class OperatorRoomComponent implements OnInit {

  @Input() data: any = {};
  @Input() source: any = {};
  @Input() column: any = {};
  @Input() roomSelect: Function;

  constructor() { }

  ngOnInit() {
  }

}
