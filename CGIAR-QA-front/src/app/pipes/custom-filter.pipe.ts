import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFilter'
})
export class CustomFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    // items = items.toLowerCase();

    return items.filter(function (item) {
      return JSON.stringify(item).toLowerCase().includes(searchText);
    });

    // let a = items.filter(val => {
    //   // console.log(val);
    //   Object.keys(val).forEach(function (key) {
    //     var f = val[key];
    //     // console.log(f)
    //     return f == searchText.toLowerCase()
    //     // use val
    //   });
    // })
    // console.log(a);
    // return items;
    // return items.filter(el => {
    //   let value: any;
    //   let key: any;
    //   console.log(el)
    //   // for ([key, value] of Object.entries(el)) {
    //   //   // console.log(key + ':' + value);
    //   //   value.indexOf(searchText.toLowerCase()) !== -1
    //   // }
    //   // for (const it_ of el) {
    //   //   // console.log(it_ , el[it_])
    //   //   // el[it_].toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    //   // }
    // })
    // let a = items.filter(o => {
    //   // console.log(o, searchText)
    //   Object.keys(o).some(k => {
    //     // console.log(o[k])
    //     // o[k].toLowerCase().includes(
    //     String(o[k]).includes(
    //       searchText.toLowerCase()
    //     )
    //   }
    //   )

    // }
    // );

    // console.log(typeof searchText, searchText, a)
    // return a;
    // return items.filter(it => {
    //   return it.title.toLowerCase().includes(searchText);
    // });
  }

}
