import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

import { QAEvaluations } from "../entity/Evaluations"
import { QAComments} from "../entity/Comments"
import { QAUsers } from "../entity/User"

@Entity()
export class QACommentsReplies {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => QAComments, meta => meta.replies)
    comment: QAComments;
    
    @ManyToOne(type => QAUsers, user => user.replies)
    user: QAUsers;

    @Column({
        default: false,
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