import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { OrderModule } from 'ngx-order-pipe';
import { DetailIndicatorRoutingModule } from './detail-indicator-routing.module';
import { DetailIndicatorComponent } from './detail-indicator.component';
import { CRPIndicatorsComponent } from '../crp-indicators/indicators.component';
import { CommentComponentModule } from 'src/app/comment/comment.module';
// import { CommentComponent } from '../../comment/comment.component';



@NgModule({
    imports: [
      CommonModule,
      DetailIndicatorRoutingModule,
      ProgressbarModule.forRoot(),
      ButtonsModule.forRoot(),
      CollapseModule.forRoot(),
      PaginationModule.forRoot(),
      NgxSpinnerModule,
      OrderModule,
      ReactiveFormsModule,
      CommentComponentModule
    ],
    declarations: [DetailIndicatorComponent, CRPIndicatorsComponent]
  })
  export class DetailIndicatorModule { }
  