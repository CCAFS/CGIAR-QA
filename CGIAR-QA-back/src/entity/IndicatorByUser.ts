import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAUsers } from "./User";
import { QAIndicators } from "./Indicators";
import { QAEvaluations } from "./Evaluations";


@Entity()
export class QAIndicatorUser {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: 'User Id is required' })
    @ManyToOne(type => QAUsers, user => user.indicators)
    user: QAUsers;

    @IsNotEmpty({ message: 'Indicator Id is required' })
    @ManyToOne(type => QAIndicators, indicator => indicator.user_indicator, { eager: true })
    indicator: QAIndicators;

    @OneToMany(type => QAEvaluations, evaluations => evaluations.indicator_user)
    evaluations: QAEvaluations[];

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}