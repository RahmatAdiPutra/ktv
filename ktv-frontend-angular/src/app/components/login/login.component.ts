import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {};

  constructor(private auth: AuthService, private router: Router, private toast: MatSnackBar) {}

  ngOnInit() {
  }

  login() {
    this.auth.login(this.form).subscribe(res => this.handle(res), error => console.log(error));
  }

  handle(res) {
    if (typeof res.payloads !== 'undefined') {
      const key = res.payloads.user_id + '-' + res.payloads.user_name;
      this.auth.set(key);
    } else {
      this.openToast('Username or password invalid', '');
    }
    this.router.navigate(['/']);
  }

  openToast(message: string, action: string) {
    this.toast.open(message, action, {
      duration: 2000,
    });
  }

}
