import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ReactiveFormsModule } from '@angular/forms';


import {GeneralDetailedIndicatorRoutingModule } from './general-detailed-indicator-routing.module';
// import { IndicatorsComponent } from './indicators.component';

import { NgxSpinnerModule } from "ngx-spinner";
import { OrderModule } from 'ngx-order-pipe';
import { GeneralDetailedIndicatorComponent } from './general-detailed-indicator.component';
import { CommentComponent } from '../comment/comment.component';



@NgModule({
    imports: [
        CommonModule,
        GeneralDetailedIndicatorRoutingModule,
        ProgressbarModule.forRoot(),
        ButtonsModule.forRoot(),
        CollapseModule.forRoot(),
        PaginationModule.forRoot(),
        NgxSpinnerModule,
        OrderModule,
        ReactiveFormsModule
    ],
    declarations: [ GeneralDetailedIndicatorComponent, CommentComponent]
})
export class GeneralDetailedIndicatorModule { }

