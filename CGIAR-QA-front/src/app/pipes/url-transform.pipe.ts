import { Pipe, PipeTransform } from '@angular/core';


/*
 *ngFor="let c of oneDimArray | urlTransform:args"
*/


@Pipe({
  name: 'urlTransform'
})
export class UrlTransformPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value && (value.indexOf("http://") == 0 || value.indexOf("https://") == 0)) {
      let a_tag = `<a target="_blank" href="${value}">${value}</a>`
      value = a_tag;
    }
    return value;
  }

}
