import { Component, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../_models/user.model';

@Component({
  selector: 'app-tawk-to',
  templateUrl: './tawk-to.component.html',
  styleUrls: ['./tawk-to.component.scss']
})
export class TawkToComponent implements OnInit {
  @Input() id: string;
  script = this._renderer.createElement('script');
  isVisibleTawk = true;
  currentUser: User;

  constructor(private _renderer: Renderer2, @Inject(DOCUMENT) private _document, private authService: AuthenticationService) {
    this.authService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnInit() {

    this.script.text = `var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/5ea2f28869e9320caac6f637/default';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();`;
    this._renderer.appendChild(this._document.body, this.script);
    setTimeout(() => {
      this.openChat()
    }, 200);

  }

  openChat() {
    console.log(window['Tawk_API']);
    // window['Tawk_API'].onLoad(function () {
    //   console.log(window['Tawk_API'])

    // })
    // window.Tawk_API.onLoad = function () {
    //   window.Tawk_API.setAttributes({
    //     'name': this.currentUser.name,
    //     'email': this.currentUser.email,
    //     'hash': 'hash value'
    //   }, function (error) { 
    //     console.log('set att', error)
    //   });
    // }
    if(window['Tawk_API'])
      window['Tawk_API'].maximize();

  }

}
