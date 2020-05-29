import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { IndicatorsRoutingModule } from './indicators-routing.module';
import { IndicatorsComponent } from './indicators.component';

import { NgxSpinnerModule } from "ngx-spinner";
import { OrderModule } from 'ngx-order-pipe';
import { CommentComponentModule } from '../comment/comment.module';
// import { CommentComponent } from '../comment/comment.component';
// import { GeneralDetailedIndicatorComponent } from './general-detailed-indicator/general-detailed-indicator.component';



@NgModule({
    imports: [
        CommonModule,
        IndicatorsRoutingModule,
        ProgressbarModule.forRoot(),
        ButtonsModule.forRoot(),
        CollapseModule.forRoot(),
        PaginationModule.forRoot(),
        NgxSpinnerModule,
        OrderModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2SearchPipeModule,
        CommentComponentModule
    ],
    declarations: [IndicatorsComponent]
})
export class IndicatorsModule { }
