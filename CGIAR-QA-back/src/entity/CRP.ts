import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, OneToMany, ManyToOne} from "typeorm";
import { Length } from "class-validator";

import { QAUsers } from "../entity/User"
import { StatusGeneralHandler } from "../_helpers/StatusGeneralHandler"


@Entity()
@Unique(["crp_id"])
export class QACrp {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    @Length(2, 20)
    name: string;

    @Column()
    @Length(2, 20)
    crp_id: string;

    @Column()
    @Length(2, 20)
    acronym: string;

    @Column()
    is_marlo: boolean;

    // @ManyToOne(type => QAUsers, user => user.crp)
    // user: QAUsers;
    // @OneToMany(type => QAUsers, user => user.crp)
    // user: QAUsers;

    @Column({
        default : false
    })
    active: boolean;

    @Column({
        type: "enum",
        enum: StatusGeneralHandler,
        default: StatusGeneralHandler.Close
    })
    qa_active:StatusGeneralHandler
}