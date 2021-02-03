import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tags-bar',
  templateUrl: './tags-bar.component.html',
  styleUrls: ['./tags-bar.component.scss']
})
export class TagsBarComponent implements OnInit {

  @Input() comment;
  @Input() currentUser;

  infoTags = {
    seen: {total: 0, users: [], description: 'Seen'},
    notSure: {total: 0, users: [], description: 'Not sure'},
    agree: {total: 0, users: [], description: 'Agree'},
    disagree: {total: 0, users: [], description: 'Disagree'}
  }

  userTags = {
    seen: false,
    notSure: false,
    agree: false,
    disagree: false
  }

  @Output() tagEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.comment, this.currentUser);
    if(this.comment && this.currentUser) {
      this.getUserTags(this.comment.tags);
      this.getInfoByTag(this.comment.tags)
    }
  }

  getUserTags(tags: any[]) {
    const userTags = tags.filter(tag => tag.userId == this.currentUser.id);
    
    const tagsKey = Object.keys(this.userTags);

    userTags.forEach(tag => {
      this.userTags[tagsKey[tag.tag_type-1]] = true;
    });

    // console.log(this.userTags);
  }

  getInfoByTag(tags: any[]) {
    //Filter array before reduce
    this.infoTags.seen.total = tags.filter(({tag_type}) => tag_type == 1).length;
    this.infoTags.seen.users = tags.filter(({tag_type}) => tag_type == 1).map(tag => tag.user_name);

    this.infoTags.notSure.total =  tags.filter(({tag_type}) => tag_type == 2).length;
    this.infoTags.notSure.users = tags.filter(({tag_type}) => tag_type == 2).map(tag => tag.user_name);

    this.infoTags.agree.total =  tags.filter(({tag_type}) => tag_type == 3).length;
    this.infoTags.agree.users = tags.filter(({tag_type}) => tag_type == 3).map(tag => tag.user_name);

    this.infoTags.disagree.total =  tags.filter(({tag_type}) => tag_type == 4).length;
    this.infoTags.disagree.users = tags.filter(({tag_type}) => tag_type == 4).map(tag => tag.user_name);

    console.log(this.infoTags);
    
  }

  toggleTag(tagTypeId: number) {
    const tagsKey = Object.keys(this.userTags);
    const newTagValue = !this.userTags[tagsKey[tagTypeId-1]];
    this.userTags[tagsKey[tagTypeId-1]] = newTagValue;

    // console.log(`${tagsKey[tagTypeId-1]}`,newTagValue);
    console.log(this.userTags);
    
    this.tagEvent.emit({commentId: this.comment.id,tagTypeId, newTagValue});
  }

  tooltipMessage(tagTypeKey: string) {
    let msg = '';
    msg += `<strong>${this.infoTags[tagTypeKey].description}</strong><br>`;

    this.infoTags[tagTypeKey].users.forEach(user => {
      msg += `${user}, `
    });
    
    //Delete last ","
    msg = msg.slice(0, -2);
    return msg;
    // let connector = this.infoTags[tagTypeKey].users.length > 1 ? 'are' : 'is';
    // msg += connector;
  }


}
