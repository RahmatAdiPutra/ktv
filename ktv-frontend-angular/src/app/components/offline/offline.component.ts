import { Component, OnInit } from '@angular/core';
import { PusherService } from 'src/app/services/pusher.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.css']
})
export class OfflineComponent implements OnInit {

  constructor(private pusherService: PusherService) { }

  ngOnInit() {
  }

}
