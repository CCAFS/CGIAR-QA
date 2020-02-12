import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAUsers } from "../entity/User";


@Entity()
export class QAIndicatorUser {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: 'Indicators is required' })
    @Column("simple-array", { nullable: true })
    indicators_names: string[];
    
    @ManyToOne(type => QAUsers, user => user.id)
    user: QAUsers;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

}