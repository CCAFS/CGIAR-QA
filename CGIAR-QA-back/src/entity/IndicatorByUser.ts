import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAUsers } from "../entity/User";
import { QAIndicators } from "../entity/Indicators";


@Entity()
export class QAIndicatorUser {

    @PrimaryGeneratedColumn()
    id: number;
    
    @IsNotEmpty({ message: 'User Id is required' })
    @ManyToOne(type => QAUsers, user => user.indicators)
    user: QAUsers;
    
    @IsNotEmpty({ message: 'Indicator Id is required' })
    @ManyToOne(type => QAIndicators, indicator => indicator.user_indicator)
    indicator: QAIndicators;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}