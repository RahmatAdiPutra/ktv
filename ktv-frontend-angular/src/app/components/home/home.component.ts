import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  allows = ['Home','KTV','Player','Remote','Operator'];
  options = [
    {name: 'Home', url: '/home', allow: true},
    {name: 'KTV', url: '/ktv', allow: true},
    {name: 'Player', url: '/player', allow: true},
    {name: 'Remote', url: '/remote', allow: true},
    {name: 'Operator', url: '/', allow: true},
    {name: 'Login', url: '/login', allow: true}
  ];

  constructor() { }

  ngOnInit() {
    this.options.forEach((menu, i) => {
      this.options[i].allow = this.allows.includes(menu.name);
    });
  }

}
