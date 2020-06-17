import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFilter'
})

export class CustomFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, key: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();

    return items.filter(function (item) {
      if (key)
        return item[key].toLowerCase().includes(searchText);
      else
        return JSON.stringify(item).toLowerCase().includes(searchText);
    });
  }

}
