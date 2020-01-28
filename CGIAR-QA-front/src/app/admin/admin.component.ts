import { Component, OnInit } from '@angular/core';

import { User } from '../_models/user.model';

import { UsersService } from '../services/users.service';
import { AlertService } from './../services/alert.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  loading = false;
  users: User[] = [];

  constructor(private userService: UsersService, private alert: AlertService) { }

  ngOnInit() {
    this.loadAllUsers();
  }


  loadAllUsers() {
    this.userService.getAllUsers()
      // .pipe(first())
      .subscribe(
        data => {
          console.log(data)
          this.users = data.data
        },
        error => {
          this.alert.error(error);
          this.loading = false;
        });
  }

}
