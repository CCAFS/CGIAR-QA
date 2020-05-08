import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, ManyToOne, OneToMany } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAIndicatorUser } from "../entity/IndicatorByUser";
import { QAComments } from "../entity/Comments";
import { StatusHandler } from "../_helpers/StatusHandler";
import { QAIndicators } from "./Indicators";


// import { QAUsers } from "../entity/User";
// import { QAIndicatorUser } from "@entity/IndicatorByUser";clear
// import { StatusHandler } from "@helpers/StatusHandler"


@Entity()
export class QAEvaluations {

    @PrimaryGeneratedColumn()
    id: number;

    // @IsNotEmpty({ message: 'Indicator by User is required' })
    // @ManyToOne(type => QAIndicators, indicatorByUser => indicatorByUser.evaluations)
    // indicator: QAIndicators[];

    @Column({ nullable: true })
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

    @Column({ default: "" })
    @Length(2, 200)
    @IsNotEmpty({ message: 'The CRP identifier is required' })
    crp_id: string;

    // @Column({ default: "" })
    // @Length(2, 200)
    // @IsNotEmpty({ message: 'The CRP identifier is required' })
    // general_comments: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(type => QAComments, comment => comment.evaluation)
    comments:QAComments;
}
