import { Pipe, PipeTransform } from '@angular/core';


/*
 *ngFor="let c of oneDimArray | urlTransform:args"
*/


@Pipe({
  name: 'urlTransform'
})
export class UrlTransformPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    // console.log(value)
    if (value && typeof value == 'string') {
      if ((value.indexOf("http://") == 0 || value.indexOf("https://") == 0) && this.validateUrl(value)) {
        let a_tag = `<a target="_blank" href="${value}">${value}</a>`
        value = a_tag;
      }
    }
    return value;
  }


  validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

  urlToAnchor(value) {
    if(value.indexOf('<a') == -1 && value && typeof value == 'string') {      
      var urlRegex = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!():,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      return value.replace(urlRegex, function(url) {
        return '<a target="_blank" href="' + url + '">' + url + '</a>';
      });
    } else {
      return value;
    }
  }
}
