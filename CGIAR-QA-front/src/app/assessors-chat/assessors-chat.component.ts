import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-assessors-chat',
  templateUrl: './assessors-chat.component.html',
  styleUrls: ['./assessors-chat.component.scss']
})
export class AssessorsChatComponent implements OnInit {
  currentUser: User;
  chatroom: SafeResourceUrl;
  constructor(
    private sanitizer: DomSanitizer,
    private activeRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) {
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
        console.log(this.currentUser);
      });
  }

  ngOnInit() {
    this.chatroom = this.sanitizer.bypassSecurityTrustResourceUrl(`https://deadsimplechat.com/Njt10-3wG?username=${this.currentUser.name}`);

  }

}
