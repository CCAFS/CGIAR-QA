import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,  ManyToOne, OneToMany } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAIndicators } from "../entity/Indicators";
import { QAComments } from "../entity/Comments";
// import { QAIndicators } from "@entity/Indicators";


@Entity()
// @Unique(["name", "view_name"])
export class QAIndicatorsMeta {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(0, 200)
    @IsNotEmpty({ message: 'The column name is required' })
    col_name: string;
    
    @Column()
    @Length(0, 200)
    @IsNotEmpty({ message: 'The display name is required' })
    display_name: string;

    @IsNotEmpty({ message: 'Indicator Id is required' })
    @ManyToOne(type => QAIndicators, indicator => indicator.meta)
    indicator: QAIndicators;

    @Column({
        default : true
    })
    enable_comments: boolean;
   
    @Column({
        default : false
    })
    is_primay: boolean;
   
    @Column({
        default : true
    })
    include_general: boolean;
   
    @Column({
        default : true
    })
    include_detail: boolean;
    
    @Column({
        default : 0
    })
    order: number;
    
    @Column({
        nullable : true
    })
    description: string;

    @OneToMany(type => QAComments, comment => comment.meta)
    comments:QAComments;
    
    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}