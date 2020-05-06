import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentComponent } from './comment.component';

@NgModule({
  declarations: [ CommentComponent ],
  exports: [ CommentComponent ],
  imports: [ CommonModule ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CommentComponentModule {}