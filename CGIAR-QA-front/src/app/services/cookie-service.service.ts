import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor(private cookieService: CookieService) { }

  private setData(name: string, data: any) {
    let dataString = JSON.stringify(data);
    this.cookieService.set(name, dataString,null,'/', '',false, 'Strict');
    // console.log(this.cookieService.check(name), dataString)
    return this.cookieService.check(name);
  }
  private getData(name: string) {
    let dataFromString = !this.cookieService.get(name) ? this.cookieService.get(name) : JSON.parse(this.cookieService.get(name));
    return dataFromString;
  }
  private getAllData() {
    const allCookies: {} = this.cookieService.getAll()
    return allCookies;
  }
  delete(name: string) {
    return this.cookieService.delete(name, '/')
  }
  private deleteAll() {
    return this.cookieService.deleteAll()
  }
}
