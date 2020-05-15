import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortByPipe } from '../pipes/sort-by.pipe';
import { UrlTransformPipe } from '../pipes/url-transform.pipe';

@NgModule({
  declarations: [
    SortByPipe,
    UrlTransformPipe
  ],
  exports: [
    SortByPipe,
    UrlTransformPipe
  ],
  providers: [SortByPipe, UrlTransformPipe],
  imports: [
    CommonModule
  ],
})
export class SharedModule { }
