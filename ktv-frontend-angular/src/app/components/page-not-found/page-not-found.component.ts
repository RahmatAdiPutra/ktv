import { Component, OnInit } from '@angular/core';
import { PusherService } from 'src/app/services/pusher.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private pusherService: PusherService) { }

  ngOnInit() {
  }

}
