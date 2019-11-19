import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-operator-room-call',
  templateUrl: './operator-room-call.component.html',
  styleUrls: [
    './operator-room-call.component.css',
    '../operator.component.css'
  ]
})
export class OperatorRoomCallComponent implements OnInit {

  @Input() data: any = {};
  @Input() source: any = {};
  @Input() column: any = {};
  @Input() callRespond: Function;
  @Input() callToggleFab: Function;

  constructor() { }

  ngOnInit() {
  }

}
