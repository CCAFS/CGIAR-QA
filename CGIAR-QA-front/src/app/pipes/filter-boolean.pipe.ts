import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBoolean'
})
export class FilterBooleanPipe implements PipeTransform {

  transform(items: any[], bol: boolean,key: string): any[] {
    if (!items) return [];
    if (!bol) return items;
    let result = items.filter(item => item[key] == bol);
    console.log({bol});
    
    console.log(result);
    
    return result;
  }

}
