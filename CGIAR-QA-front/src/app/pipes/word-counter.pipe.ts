import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordCounter'
})
export class WordCounterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value && typeof value === 'string') {
      return value.trim().split(/\s+/).length;
    } else {
      return 0;
    }
    // return null;
  }

}
