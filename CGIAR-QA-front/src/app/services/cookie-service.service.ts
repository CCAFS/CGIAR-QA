import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {

  constructor(private cookieService: CookieService) { }

  setData(name: string, data: any) {
    let dataString = JSON.stringify(data);
    this.cookieService.set(name, dataString);
    return this.cookieService.check(name);
  }
  getData(name: string) {
    let dataFromString = !this.cookieService.get(name) ? this.cookieService.get(name) : JSON.parse(this.cookieService.get(name));
    return dataFromString;
  }
  getAllData() {
    const allCookies: {} = this.cookieService.getAll()
    return allCookies;
  }
  delete(name: string) {
    return this.cookieService.delete(name)
  }
  deleteAll() {
    return this.cookieService.deleteAll()
  }
}
