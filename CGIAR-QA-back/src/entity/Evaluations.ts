import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne, ObjectID } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

// import { QAUsers } from "../entity/User";
import { QAIndicatorUser } from "./IndicatorByUser";

import { StatusHandler } from "../_helpers/StatusHandler"

@Entity()
export class QAEvaluations {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: 'Indicator by User is required' })
    @ManyToOne(type => QAIndicatorUser, indicatorByUser => indicatorByUser.evaluations)
    indicator_user: QAIndicatorUser;

    @Column()
    @IsNotEmpty({ message: 'Id by view is required' })
    indicator_view_id: number;

    @Column('text')
    status: StatusHandler;

    @Column()
    @Length(4, 200)
    @IsNotEmpty({ message: 'The view name is required' })
    indicator_view_name: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}