import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from "../../services/authentication.service"
import { User } from '../../_models/user.model'
import { Role } from '../../_models/roles.model'

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {
  currentUser: User;
  allRoles = Role;

  constructor(private authenticationService: AuthenticationService, private router: Router, ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }

  goToView(view: string) {
    if (this.currentUser) {
      switch (view) {
        case "dashboard":
          this.router.navigate([`/dashboard/${this.currentUser.roles[0].description.toLocaleLowerCase()}`])
          break;

        default:
          break;
      }
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
