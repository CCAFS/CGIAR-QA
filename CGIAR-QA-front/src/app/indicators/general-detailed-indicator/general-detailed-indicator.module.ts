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
import { CommentComponent } from '../../comment/comment.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MarkdownModule } from 'ngx-markdown';
import { CommentComponentModule } from 'src/app/comment/comment.module';
import { AssessorsChatWindowComponent } from 'src/app/_shared/assessors-chat-window/assessors-chat-window.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// import { CommentComponentModule } from '../../comment/comment.component.module';


@NgModule({
    imports: [
        CommonModule,
        GeneralDetailedIndicatorRoutingModule,
        ProgressbarModule.forRoot(),
        ButtonsModule.forRoot(),
        CollapseModule.forRoot(),
        PaginationModule.forRoot(),
        TooltipModule.forRoot(),
        MarkdownModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxSpinnerModule,
        OrderModule,
        ReactiveFormsModule,
        CommentComponentModule
    ],
    declarations: [ GeneralDetailedIndicatorComponent]
})
export class GeneralDetailedIndicatorModule { }

