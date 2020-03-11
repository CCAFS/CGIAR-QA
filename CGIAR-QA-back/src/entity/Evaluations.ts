import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne, ObjectID } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

// import { QAUsers } from "../entity/User";
import { QAIndicatorUser } from "@entity/IndicatorByUser";

import { StatusHandler } from "@helpers/StatusHandler"

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

    @Column({
        type: "enum",
        enum: StatusHandler,
        default: StatusHandler.Pending
    })
    status: StatusHandler;

    @Column()
    @Length(2, 200)
    @IsNotEmpty({ message: 'The view name is required' })
    indicator_view_name: string;
    
    @Column()
    @Length(2, 200)
    @IsNotEmpty({ message: 'The CRP identifier is required' })
    crp_id: string;
    
    @Column()
    @Length(2, 200)
    @IsNotEmpty({ message: 'The CRP identifier is required' })
    general_comments: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}