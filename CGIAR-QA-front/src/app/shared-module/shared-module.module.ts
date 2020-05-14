import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SortByPipe } from '../pipes/sort-by.pipe';

@NgModule({
  declarations: [
    SortByPipe
  ],
  exports: [
    SortByPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
