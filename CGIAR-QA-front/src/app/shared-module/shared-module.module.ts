import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortByPipe } from '../pipes/sort-by.pipe';
import { UrlTransformPipe } from '../pipes/url-transform.pipe';
import { WordCounterPipe } from '../pipes/word-counter.pipe';
import { CustomFilterPipe } from '../pipes/custom-filter.pipe';

@NgModule({
  declarations: [
    SortByPipe,
    UrlTransformPipe, 
    WordCounterPipe,
    CustomFilterPipe,
  ],
  exports: [
    SortByPipe,
    UrlTransformPipe,
    CustomFilterPipe, 
    WordCounterPipe
  ],
  providers: [SortByPipe, UrlTransformPipe, CustomFilterPipe, WordCounterPipe],
  imports: [
    CommonModule
  ],
})
export class SharedModule { }
