import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-operator-preview-video',
  templateUrl: './operator-preview-video.component.html',
  styleUrls: [
    './operator-preview-video.component.css',
    '../operator.component.css'
  ]
})
export class OperatorPreviewVideoComponent implements OnInit {

  @Input() data: any = {};

  constructor() { }

  ngOnInit() {
  }

}
