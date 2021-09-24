import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortByPipe } from '../pipes/sort-by.pipe';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';
import { UrlTransformPipe } from '../pipes/url-transform.pipe';
import { WordCounterPipe } from '../pipes/word-counter.pipe';
import { CustomFilterPipe } from '../pipes/custom-filter.pipe';
import { DateFilterPipe } from '../pipes/date-filter.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    SortByPipe,
    UrlTransformPipe,
    WordCounterPipe,
    CustomFilterPipe,
    DateFilterPipe
    // SafeUrlPipe
  ],
  exports: [
    SortByPipe,
    UrlTransformPipe,
    CustomFilterPipe,
    WordCounterPipe,
    DateFilterPipe
    // SafeUrlPipe
  ],
  providers: [SortByPipe, UrlTransformPipe, CustomFilterPipe, WordCounterPipe, DateFilterPipe
    // SafeUrlPipe
  ],
  imports: [
    CommonModule,
    // NgbModule
  ],
})
export class SharedModule { }
