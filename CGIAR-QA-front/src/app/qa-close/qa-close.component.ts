import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from './../services/authentication.service';

@Component({
  selector: 'app-qa-close',
  templateUrl: './qa-close.component.html',
  styleUrls: ['./qa-close.component.scss']
})
export class QaCloseComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private router: Router,) {
    this.authenticationService.logout();
   }

  ngOnInit() {

  }

}
