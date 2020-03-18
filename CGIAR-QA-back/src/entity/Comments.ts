import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAEvaluations } from "../entity/Evaluations"
import { QAIndicatorsMeta } from "../entity/IndicatorsMeta"
import { QAUsers } from "../entity/User"

@Entity()
export class QAComments {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => QAEvaluations, evaluation => evaluation.comments)
    evaluation: QAEvaluations;
    
    @ManyToOne(type => QAIndicatorsMeta, meta => meta.comments)
    meta: QAIndicatorsMeta;
    
    @ManyToOne(type => QAUsers, user => user.comments)
    user: QAUsers;

    @Column({
        nullable : true
    })
    approved: boolean;
        
    @Column({
        default : true
    })
    is_visible: boolean;
    
    @Column({
        default : false
    })
    is_deleted: boolean;
   
    @Column()
    @Length(3, 250)
    @IsNotEmpty({ message: 'Permission is required' })
    detail: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
} 