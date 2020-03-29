import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAComments } from "../entity/Comments";
import { QAIndicators } from "../entity/Indicators";


@Entity()
export class QACommentsMeta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: false
    })
    enable_crp: boolean;

    @Column({
        default: false
    })
    enable_assessor: boolean;

    @OneToOne(type => QAIndicators)
    @JoinColumn()
    indicator: QAIndicators;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}


