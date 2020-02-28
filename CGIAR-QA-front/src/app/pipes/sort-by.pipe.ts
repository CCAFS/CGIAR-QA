import { Pipe, PipeTransform } from '@angular/core';
import { orderBy, sortBy } from 'lodash';


/*
 *ngFor="let c of oneDimArray | sortBy:'asc'"
 *ngFor="let c of arrayOfObjects | sortBy:'asc':'propertyName'"
*/

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(value: any[], order = '', column: string = ''): any[] {
    if (!value || order === '' || !order) { return value; } 
    if (!column || column === '') { return sortBy(value); } 
    if (value.length <= 1) { return value; } 
    return orderBy(value, [column], [order]);
  }
}
