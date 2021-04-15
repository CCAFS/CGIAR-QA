import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-assessors-chat-window',
  templateUrl: './assessors-chat-window.component.html',
  styleUrls: ['./assessors-chat-window.component.scss']
})
export class AssessorsChatWindowComponent implements OnInit {

  @Input() currentUser;
  
  chatRooms = null;

  assessorsChat = {
    isOpen: false
  }
  constructor(private sanitizer: DomSanitizer) { }

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
