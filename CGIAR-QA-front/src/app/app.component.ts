import { Component, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private title = 'qa-app';
  private env = environment;
  private isModalShown = false;

  @ViewChild('autoShownModal', { static: false }) private autoShownModal: ModalDirective;

  constructor(public router: Router) {
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    if (isIEOrEdge) {
      this.showModal()
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.ga,
          {
            'page_path': event.urlAfterRedirects
          }
        );
      }
    })
  }



  private showModal(): void {
    this.isModalShown = true;

  }

  private hideModal(): void {
    this.autoShownModal.hide();
  }

  private onHidden(): void {
    this.isModalShown = false;
  }

}
