import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { OrderModule } from 'ngx-order-pipe';
import { DetailIndicatorRoutingModule } from './detail-indicator-routing.module';
import { DetailIndicatorComponent } from './detail-indicator.component';
import { CRPIndicatorsComponent } from '../crp-indicators/indicators.component';
import { CommentComponentModule } from 'src/app/comment/comment.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MarkdownModule } from 'ngx-markdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { CommentComponent } from '../../comment/comment.component';



@NgModule({
  imports: [
    CommonModule,
    DetailIndicatorRoutingModule,
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    MarkdownModule.forRoot(),
    NgxSpinnerModule,
    OrderModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    CommentComponentModule
  ],
  declarations: [CRPIndicatorsComponent, DetailIndicatorComponent]
})
export class DetailIndicatorModule { }
