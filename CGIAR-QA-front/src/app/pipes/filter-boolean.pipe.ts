import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBoolean'
})
export class FilterBooleanPipe implements PipeTransform {

  transform(items: any[], bol: boolean,key: string): any[] {
    if (!items) return [];

    return items.filter(item => item[key] == bol);
  }

}
