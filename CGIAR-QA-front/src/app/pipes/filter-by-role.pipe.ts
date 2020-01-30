import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByRole'
})
export class FilterByRolePipe implements PipeTransform {

  transform(items: any, ...args: any[]): any {
    if (!args || args[0] == '') {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.role.indexOf(args) !== -1);
  }

}
