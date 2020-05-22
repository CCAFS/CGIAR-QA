import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortByPipe } from '../pipes/sort-by.pipe';
import { UrlTransformPipe } from '../pipes/url-transform.pipe';
import { WordCounterPipe } from '../pipes/word-counter.pipe';

@NgModule({
  declarations: [
    SortByPipe,
    UrlTransformPipe, 
    WordCounterPipe
  ],
  exports: [
    SortByPipe,
    UrlTransformPipe, 
    WordCounterPipe
  ],
  providers: [SortByPipe, UrlTransformPipe, WordCounterPipe],
  imports: [
    CommonModule
  ],
})
export class SharedModule { }
