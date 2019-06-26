import { Component, OnInit } from '@angular/core';
import { PusherService } from 'src/app/services/pusher.service';

@Component({
  selector: 'app-ktv',
  templateUrl: './ktv.component.html',
  styleUrls: ['./ktv.component.css']
})
export class KtvComponent implements OnInit {

  allows = ['Home','Chart','New Entry','Playlists','Songs','Singer'];
  options = [
    {name: 'Home', url: '/', allow: true},
    {name: 'Chart', url: '/', allow: true},
    {name: 'New Entry', url: '/', allow: true},
    {name: 'Playlists', url: '/', allow: true},
    {name: 'Songs', url: '/', allow: true},
    {name: 'Singer', url: '/', allow: true}
  ];

  constructor(private pusherService: PusherService) { }

  ngOnInit() {
    this.options.forEach((menu, i) => {
      this.options[i].allow = this.allows.includes(menu.name);
    });
  }

}
