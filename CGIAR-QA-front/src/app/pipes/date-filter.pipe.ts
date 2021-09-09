import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFilter'
})
export class DateFilterPipe implements PipeTransform {

  transform(items: any[], selectedDates: any[], key: string): unknown {
    if (!items) return [];
    if (!selectedDates) return items;
    selectedDates = selectedDates.filter(sd => sd.checked); // Array of dates checked
    selectedDates = selectedDates.map(sd => sd.date.toLowerCase()); // Array of strings(dates) to lowerCase
    return this.matchDate(items, selectedDates, key);
  }

  matchDate(items: any[], selectedDates: string[], key: string) {
    return items.filter(function (item) {
      return selectedDates.some(sd => item[key].toLowerCase().includes(sd))
    });
  }

}
