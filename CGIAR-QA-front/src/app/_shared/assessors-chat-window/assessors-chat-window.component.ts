import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-assessors-chat-window',
  templateUrl: './assessors-chat-window.component.html',
  styleUrls: ['./assessors-chat-window.component.scss']
})
export class AssessorsChatWindowComponent implements OnInit {

  // @Input() currentUser;
  currentUser;
  currentRole;
  chatRooms = null;

  assessorsChat = {
    isOpen: false
  }
  constructor(private sanitizer: DomSanitizer,
    private activeRoute: ActivatedRoute,
    private authenticationService: AuthenticationService) {
      this.activeRoute.params.subscribe(routeParams => {
        console.log(routeParams);
        this.authenticationService.currentUser.subscribe(x => {
          this.currentUser = x;
          if (x) {
            this.currentRole = x.roles[0].description.toLowerCase();
            console.log(this.currentUser);
            
            this.ngOnInit();
            // this.getHeaderLinks();
            // this.isHome = `/dashboard/${this.currentUser}`;
            // this.isHome = this.router.isActive( `/dashboard/${this.currentUser}` , true)
          }
        });
      })
    }

  ngOnInit() {
    console.log('ASSESSORS CHAT');
    
    this.chatRooms = {
      general: this.sanitizer.bypassSecurityTrustResourceUrl(`https://deadsimplechat.com/am16H1Vlj?username=${this.currentUser.name}`),
    }
  }

  toggleAssessorsChat() {
    this.assessorsChat.isOpen = !this.assessorsChat.isOpen;
  }

}
